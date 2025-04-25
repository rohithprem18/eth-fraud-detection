import React, { useState } from 'react';
import { Search, Shield, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useEthereum } from '../context/EthereumContext';
import RiskScoreGauge from '../components/RiskScoreGauge';
import RiskFactorsList from '../components/RiskFactorsList';
import toast from 'react-hot-toast';

const AddressScanner: React.FC = () => {
  const [address, setAddress] = useState('');
  const [isValidFormat, setIsValidFormat] = useState(true);
  const { scanAddress, loadingAddress, currentAddress } = useEthereum();
  const navigate = useNavigate();
  
  const validateEthAddress = (addr: string) => {
    return /^0x[a-fA-F0-9]{40}$/.test(addr);
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setAddress(value);
    if (value === '' || validateEthAddress(value)) {
      setIsValidFormat(true);
    } else {
      setIsValidFormat(false);
    }
  };
  
  const handleScan = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateEthAddress(address)) {
      setIsValidFormat(false);
      return;
    }
    
    try {
      await scanAddress(address);
      toast.success('Address scanned successfully');
    } catch (error) {
      console.error('Error scanning address:', error);
      toast.error('Failed to scan address. Please try again.');
    }
  };
  
  const handleViewTransactions = () => {
    if (currentAddress) {
      navigate(`/transactions/${currentAddress.address}`);
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
        <h3 className="text-xl font-medium text-white mb-4">Ethereum Address Scanner</h3>
        
        <form onSubmit={handleScan} className="space-y-4">
          <div>
            <label htmlFor="eth-address" className="block text-sm font-medium text-gray-300 mb-1">
              Enter Ethereum Address
            </label>
            <div className="relative">
              <input
                id="eth-address"
                type="text"
                value={address}
                onChange={handleInputChange}
                placeholder="0x..."
                className={`w-full bg-gray-700 border ${
                  isValidFormat ? 'border-gray-600' : 'border-red-500'
                } rounded-lg px-4 py-3 pl-10 text-white focus:outline-none focus:ring-2 focus:ring-blue-500`}
                disabled={loadingAddress}
              />
              <Search className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
            </div>
            {!isValidFormat && (
              <p className="mt-1 text-sm text-red-500 flex items-center">
                <AlertTriangle className="h-4 w-4 mr-1" />
                Invalid Ethereum address format. Please enter a valid address.
              </p>
            )}
          </div>
          
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={!address || !isValidFormat || loadingAddress}
              className={`px-6 py-2 rounded-lg flex items-center space-x-2 ${
                !address || !isValidFormat || loadingAddress
                  ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              } transition`}
            >
              {loadingAddress ? (
                <>
                  <div className="h-5 w-5 border-2 border-gray-300 border-t-white rounded-full animate-spin mr-2"></div>
                  <span>Scanning...</span>
                </>
              ) : (
                <>
                  <Shield className="h-5 w-5" />
                  <span>Scan Address</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
      
      {/* Results Section */}
      {currentAddress && !loadingAddress && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Risk Score Card */}
          <div className="bg-gray-800 rounded-lg border border-gray-700 p-6 flex flex-col items-center">
            <h3 className="text-xl font-medium text-white mb-4 self-start">Risk Assessment</h3>
            
            <RiskScoreGauge score={currentAddress.riskScore} />
            
            <div className="mt-4 w-full">
              <div className="flex justify-between items-center">
                <span className="text-gray-400 text-sm">Risk Level</span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  currentAddress.riskScore >= 75 ? 'text-red-500 bg-red-500/10' :
                  currentAddress.riskScore >= 50 ? 'text-orange-500 bg-orange-500/10' :
                  currentAddress.riskScore >= 25 ? 'text-yellow-500 bg-yellow-500/10' :
                  'text-green-500 bg-green-500/10'
                }`}>
                  {currentAddress.riskScore >= 75 ? 'High Risk' :
                   currentAddress.riskScore >= 50 ? 'Medium Risk' :
                   currentAddress.riskScore >= 25 ? 'Low Risk' :
                   'Safe'}
                </span>
              </div>
              
              <div className="flex justify-between items-center mt-2">
                <span className="text-gray-400 text-sm">Confidence</span>
                <span className="text-white">{Math.round(currentAddress.prediction.confidence * 100)}%</span>
              </div>
              
              {currentAddress.prediction.category && (
                <div className="flex justify-between items-center mt-2">
                  <span className="text-gray-400 text-sm">Category</span>
                  <span className="text-white">{currentAddress.prediction.category}</span>
                </div>
              )}
              
              <button
                onClick={handleViewTransactions}
                className="w-full mt-6 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white transition"
              >
                View Transactions
              </button>
            </div>
          </div>
          
          {/* Risk Factors */}
          <div className="bg-gray-800 rounded-lg border border-gray-700 p-6 lg:col-span-2">
            <h3 className="text-xl font-medium text-white mb-4">Risk Factors</h3>
            
            <RiskFactorsList factors={currentAddress.prediction.riskFactors} />
          </div>
          
          {/* Address Details */}
          <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
            <h3 className="text-xl font-medium text-white mb-4">Address Details</h3>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-400">Address Type:</span>
                <span className="text-white">{currentAddress.isContract ? 'Contract' : 'EOA'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Balance:</span>
                <span className="text-white">{parseFloat(currentAddress.balance) / 1e18} ETH</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Transactions:</span>
                <span className="text-white">{currentAddress.txCount}</span>
              </div>
              {currentAddress.firstTx && (
                <div className="flex justify-between">
                  <span className="text-gray-400">First Transaction:</span>
                  <span className="text-white">{new Date(currentAddress.firstTx).toLocaleDateString()}</span>
                </div>
              )}
              {currentAddress.lastTx && (
                <div className="flex justify-between">
                  <span className="text-gray-400">Last Transaction:</span>
                  <span className="text-white">{new Date(currentAddress.lastTx).toLocaleDateString()}</span>
                </div>
              )}
            </div>
            
            <div className="mt-4 pt-4 border-t border-gray-700">
              <a
                href={`https://etherscan.io/address/${currentAddress.address}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 text-sm"
              >
                View on Etherscan →
              </a>
            </div>
          </div>
          
          {/* Security Recommendations */}
          <div className="bg-gray-800 rounded-lg border border-gray-700 p-6 lg:col-span-2">
            <h3 className="text-xl font-medium text-white mb-4">Security Recommendations</h3>
            
            {currentAddress.riskScore >= 75 ? (
              <div className="space-y-4">
                <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                  <div className="flex items-start">
                    <AlertTriangle className="h-5 w-5 text-red-500 mr-2 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-white">High Risk - Avoid Interacting</h4>
                      <p className="text-gray-300 text-sm mt-1">
                        This address has been identified as high risk. We strongly advise against sending funds or connecting your wallet.
                      </p>
                    </div>
                  </div>
                </div>
                
                <ul className="space-y-2 text-gray-300 text-sm pl-5 list-disc">
                  <li>Do not send any funds to this address</li>
                  <li>Do not approve any token spending</li>
                  <li>If you've interacted with this address, consider moving your funds to a new wallet</li>
                  <li>Report this address to Etherscan and other blockchain security services</li>
                </ul>
              </div>
            ) : currentAddress.riskScore >= 50 ? (
              <div className="space-y-4">
                <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-4">
                  <div className="flex items-start">
                    <AlertTriangle className="h-5 w-5 text-orange-500 mr-2 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-white">Medium Risk - Proceed with Caution</h4>
                      <p className="text-gray-300 text-sm mt-1">
                        This address shows some suspicious patterns. Exercise caution when interacting.
                      </p>
                    </div>
                  </div>
                </div>
                
                <ul className="space-y-2 text-gray-300 text-sm pl-5 list-disc">
                  <li>Verify the address through multiple sources before sending funds</li>
                  <li>Limit transaction amounts to minimize potential loss</li>
                  <li>Review any smart contract interactions carefully</li>
                  <li>Consider using a hardware wallet for added security</li>
                </ul>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                  <div className="flex items-start">
                    <Shield className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-white">Low Risk - Generally Safe</h4>
                      <p className="text-gray-300 text-sm mt-1">
                        This address appears to be safe based on our analysis. Standard security practices are still recommended.
                      </p>
                    </div>
                  </div>
                </div>
                
                <ul className="space-y-2 text-gray-300 text-sm pl-5 list-disc">
                  <li>Always double-check addresses before sending transactions</li>
                  <li>Use hardware wallets for significant transactions</li>
                  <li>Keep your seed phrases secure and offline</li>
                  <li>Enable two-factor authentication where possible</li>
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AddressScanner;