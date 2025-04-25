import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ArrowUpRight, Eye, Plus, AlertTriangle, Shield } from 'lucide-react';
import { useEthereum } from '../context/EthereumContext';
import { Transaction, RiskFactor } from '../types';
import TransactionList from '../components/TransactionList';
import { shortenAddress } from '../utils/formatters';

const TransactionAnalysis: React.FC = () => {
  const { address } = useParams<{ address: string }>();
  const { 
    transactions, 
    loadingTransactions, 
    scanAddress, 
    currentAddress,
    watchlist,
    addToWatchlist,
    removeFromWatchlist 
  } = useEthereum();
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchData = async () => {
      if (address && (!currentAddress || currentAddress.address !== address)) {
        try {
          await scanAddress(address);
        } catch (error) {
          console.error('Error fetching address data:', error);
        }
      }
      setLoading(false);
    };
    
    fetchData();
  }, [address, currentAddress, scanAddress]);
  
  const isInWatchlist = watchlist.some(item => item.address === address);
  
  const handleAddToWatchlist = () => {
    if (currentAddress) {
      addToWatchlist(currentAddress);
    }
  };
  
  const handleRemoveFromWatchlist = () => {
    if (address) {
      removeFromWatchlist(address);
    }
  };
  
  if (loading || !currentAddress) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }
  
  // Group transactions by date
  const groupedTransactions: {[key: string]: Transaction[]} = {};
  transactions.forEach(tx => {
    const date = new Date(tx.timeStamp).toDateString();
    if (!groupedTransactions[date]) {
      groupedTransactions[date] = [];
    }
    groupedTransactions[date].push(tx);
  });
  
  // Sort suspicious transactions to the top within each date group
  Object.keys(groupedTransactions).forEach(date => {
    groupedTransactions[date].sort((a, b) => {
      if (a.isSuspicious && !b.isSuspicious) return -1;
      if (!a.isSuspicious && b.isSuspicious) return 1;
      return new Date(b.timeStamp).getTime() - new Date(a.timeStamp).getTime();
    });
  });
  
  // Get suspicous transaction count
  const suspiciousCount = transactions.filter(tx => tx.isSuspicious).length;
  
  return (
    <div className="space-y-6">
      {/* Header with address info */}
      <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-gray-400 mb-2">
              <Link to="/scanner" className="hover:text-white transition flex items-center">
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back to Scanner
              </Link>
            </div>
            
            <h2 className="text-xl font-medium flex items-center">
              <span className="font-mono">{shortenAddress(address || '')}</span>
              <a 
                href={`https://etherscan.io/address/${address}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="ml-2 text-gray-400 hover:text-blue-400 transition"
              >
                <ArrowUpRight className="h-4 w-4" />
              </a>
            </h2>
            
            <div className="flex items-center mt-1 space-x-2">
              <span className={`px-2 py-0.5 rounded-full text-xs ${
                currentAddress.riskScore >= 75 ? 'bg-red-500/20 text-red-400' :
                currentAddress.riskScore >= 50 ? 'bg-orange-500/20 text-orange-400' :
                currentAddress.riskScore >= 25 ? 'bg-yellow-500/20 text-yellow-400' :
                'bg-green-500/20 text-green-400'
              }`}>
                {currentAddress.riskScore >= 75 ? 'High Risk' :
                 currentAddress.riskScore >= 50 ? 'Medium Risk' :
                 currentAddress.riskScore >= 25 ? 'Low Risk' :
                 'Safe'}
              </span>
              
              <span className="text-gray-400 text-sm">
                {currentAddress.isContract ? 'Contract' : 'EOA'}
              </span>
              
              {currentAddress.prediction.category && (
                <span className="bg-gray-700 px-2 py-0.5 rounded-full text-xs">
                  {currentAddress.prediction.category}
                </span>
              )}
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {isInWatchlist ? (
              <button
                onClick={handleRemoveFromWatchlist}
                className="flex items-center space-x-1 px-3 py-1.5 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 rounded transition"
              >
                <Eye className="h-4 w-4" />
                <span>Remove from Watchlist</span>
              </button>
            ) : (
              <button
                onClick={handleAddToWatchlist}
                className="flex items-center space-x-1 px-3 py-1.5 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 rounded transition"
              >
                <Plus className="h-4 w-4" />
                <span>Add to Watchlist</span>
              </button>
            )}
          </div>
        </div>
      </div>
      
      {/* Transaction Insights */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gray-800 rounded-lg border border-gray-700 p-5 flex items-center justify-between">
          <div>
            <p className="text-gray-400 text-sm">Transaction Count</p>
            <p className="text-2xl font-medium">{transactions.length}</p>
          </div>
        </div>
        
        <div className="bg-gray-800 rounded-lg border border-gray-700 p-5 flex items-center justify-between">
          <div>
            <p className="text-gray-400 text-sm">Suspicious Transactions</p>
            <p className={`text-2xl font-medium ${suspiciousCount > 0 ? 'text-red-400' : ''}`}>
              {suspiciousCount}
            </p>
          </div>
          {suspiciousCount > 0 && <AlertTriangle className="h-8 w-8 text-red-500" />}
        </div>
        
        <div className="bg-gray-800 rounded-lg border border-gray-700 p-5 flex items-center justify-between">
          <div>
            <p className="text-gray-400 text-sm">First Transaction</p>
            <p className="text-sm font-medium">
              {currentAddress.firstTx 
                ? new Date(currentAddress.firstTx).toLocaleDateString() 
                : 'Unknown'
              }
            </p>
          </div>
        </div>
        
        <div className="bg-gray-800 rounded-lg border border-gray-700 p-5 flex items-center justify-between">
          <div>
            <p className="text-gray-400 text-sm">Last Transaction</p>
            <p className="text-sm font-medium">
              {currentAddress.lastTx 
                ? new Date(currentAddress.lastTx).toLocaleDateString() 
                : 'Unknown'
              }
            </p>
          </div>
        </div>
      </div>
      
      {/* Risk Factors */}
      {currentAddress.prediction.riskFactors.length > 0 && (
        <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
          <h3 className="text-lg font-medium mb-4">Risk Factors</h3>
          
          <div className="space-y-3">
            {currentAddress.prediction.riskFactors.map((factor: RiskFactor, idx: number) => (
              <div 
                key={idx}
                className={`p-3 rounded-lg ${
                  factor.score >= 75 ? 'bg-red-500/10 border border-red-500/30' :
                  factor.score >= 50 ? 'bg-orange-500/10 border border-orange-500/30' :
                  'bg-yellow-500/10 border border-yellow-500/30'
                }`}
              >
                <div className="flex items-start">
                  <AlertTriangle className={`h-5 w-5 mr-2 flex-shrink-0 ${
                    factor.score >= 75 ? 'text-red-500' :
                    factor.score >= 50 ? 'text-orange-500' :
                    'text-yellow-500'
                  }`} />
                  
                  <div>
                    <h4 className="font-medium text-white">{factor.name}</h4>
                    <p className="text-gray-300 text-sm">{factor.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Transaction List */}
      <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
        <h3 className="text-lg font-medium mb-4">Transaction History</h3>
        
        {Object.keys(groupedTransactions).length > 0 ? (
          <div className="space-y-6">
            {Object.keys(groupedTransactions).sort((a, b) => 
              new Date(b).getTime() - new Date(a).getTime()
            ).map(date => (
              <div key={date}>
                <h4 className="text-gray-400 text-sm mb-2">{date}</h4>
                <TransactionList 
                  transactions={groupedTransactions[date]} 
                  currentAddress={address}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Shield className="h-12 w-12 text-gray-600 mx-auto mb-3" />
            <p className="text-gray-400">No transactions found for this address.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionAnalysis;