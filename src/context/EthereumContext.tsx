import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { fetchAddressDetails, fetchTransactions } from '../services/ethereumService';
import { detectFraud } from '../services/fraudDetectionService';
import { Address, Transaction, FraudPrediction } from '../types';

interface EthereumContextType {
  scanAddress: (address: string) => Promise<FraudPrediction>;
  loadingAddress: boolean;
  currentAddress: Address | null;
  transactions: Transaction[];
  loadingTransactions: boolean;
  watchlist: Address[];
  addToWatchlist: (address: Address) => void;
  removeFromWatchlist: (address: string) => void;
  scanHistory: Address[];
}

const EthereumContext = createContext<EthereumContextType | undefined>(undefined);

export const EthereumProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentAddress, setCurrentAddress] = useState<Address | null>(null);
  const [loadingAddress, setLoadingAddress] = useState<boolean>(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loadingTransactions, setLoadingTransactions] = useState<boolean>(false);
  const [watchlist, setWatchlist] = useState<Address[]>(() => {
    const saved = localStorage.getItem('watchlist');
    return saved ? JSON.parse(saved) : [];
  });
  const [scanHistory, setScanHistory] = useState<Address[]>(() => {
    const saved = localStorage.getItem('scanHistory');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('watchlist', JSON.stringify(watchlist));
  }, [watchlist]);

  useEffect(() => {
    localStorage.setItem('scanHistory', JSON.stringify(scanHistory));
  }, [scanHistory]);

  const scanAddress = async (address: string): Promise<FraudPrediction> => {
    try {
      setLoadingAddress(true);
      
      // Fetch address details from Ethereum network
      const addressData = await fetchAddressDetails(address);
      
      // Fetch recent transactions
      setLoadingTransactions(true);
      const txList = await fetchTransactions(address);
      setTransactions(txList);
      
      // Get fraud prediction
      const prediction = await detectFraud(address, addressData, txList);
      
      const addressWithPrediction: Address = {
        ...addressData,
        address,
        riskScore: prediction.riskScore,
        lastChecked: new Date().toISOString(),
        prediction
      };
      
      // Update current address
      setCurrentAddress(addressWithPrediction);
      
      // Add to scan history
      const updatedHistory = [
        addressWithPrediction,
        ...scanHistory.filter(item => item.address !== address)
      ].slice(0, 20); // Keep last 20 addresses
      
      setScanHistory(updatedHistory);
      
      return prediction;
    } catch (error) {
      console.error('Error scanning address:', error);
      throw error;
    } finally {
      setLoadingAddress(false);
      setLoadingTransactions(false);
    }
  };

  const addToWatchlist = (address: Address) => {
    setWatchlist(prev => {
      // Only add if not already in watchlist
      if (prev.some(item => item.address === address.address)) {
        return prev;
      }
      return [address, ...prev];
    });
  };

  const removeFromWatchlist = (address: string) => {
    setWatchlist(prev => prev.filter(item => item.address !== address));
  };

  return (
    <EthereumContext.Provider 
      value={{
        scanAddress,
        loadingAddress,
        currentAddress,
        transactions,
        loadingTransactions,
        watchlist,
        addToWatchlist,
        removeFromWatchlist,
        scanHistory
      }}
    >
      {children}
    </EthereumContext.Provider>
  );
};

export const useEthereum = () => {
  const context = useContext(EthereumContext);
  if (context === undefined) {
    throw new Error('useEthereum must be used within an EthereumProvider');
  }
  return context;
};