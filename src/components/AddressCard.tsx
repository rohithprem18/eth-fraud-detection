import React from 'react';
import { ArrowUpRight, AlertTriangle, Shield, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Address } from '../types';
import { formatEther, shortenAddress, formatDate } from '../utils/formatters';

interface AddressCardProps {
  address: Address;
  onAddToWatchlist?: () => void;
  isInWatchlist?: boolean;
  onRemoveFromWatchlist?: () => void;
}

const AddressCard: React.FC<AddressCardProps> = ({ 
  address, 
  onAddToWatchlist, 
  isInWatchlist,
  onRemoveFromWatchlist
}) => {
  const getRiskColor = (score: number) => {
    if (score >= 75) return 'text-red-500 bg-red-500/10';
    if (score >= 50) return 'text-orange-500 bg-orange-500/10';
    if (score >= 25) return 'text-yellow-500 bg-yellow-500/10';
    return 'text-green-500 bg-green-500/10';
  };

  const getRiskLabel = (score: number) => {
    if (score >= 75) return 'High Risk';
    if (score >= 50) return 'Medium Risk';
    if (score >= 25) return 'Low Risk';
    return 'Safe';
  };

  return (
    <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden border border-gray-700 transition hover:border-gray-600">
      <div className="p-5">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-lg font-medium mb-1 flex items-center">
              {shortenAddress(address.address)}
              <a 
                href={`https://etherscan.io/address/${address.address}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="ml-2 text-gray-400 hover:text-blue-400 transition"
              >
                <ArrowUpRight className="h-4 w-4" />
              </a>
            </h3>
            <div className="text-sm text-gray-400">
              {address.isContract ? 'Contract' : 'EOA'} | {formatEther(address.balance)} ETH
            </div>
          </div>
          
          <div className={`px-3 py-1 rounded-full text-sm font-medium ${getRiskColor(address.riskScore)}`}>
            {getRiskLabel(address.riskScore)}
          </div>
        </div>
        
        <div className="flex items-center space-x-2 mb-4 text-sm text-gray-400">
          <Clock className="h-4 w-4" />
          <span>Last checked: {formatDate(address.lastChecked)}</span>
        </div>
        
        {address.prediction.riskFactors.length > 0 && (
          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-300 mb-2">Risk Factors:</h4>
            <ul className="space-y-1">
              {address.prediction.riskFactors.slice(0, 2).map((factor, index) => (
                <li key={index} className="text-sm flex items-start">
                  <AlertTriangle className="h-4 w-4 text-yellow-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-300">{factor.description}</span>
                </li>
              ))}
              {address.prediction.riskFactors.length > 2 && (
                <li className="text-sm text-gray-400">
                  +{address.prediction.riskFactors.length - 2} more risk factors
                </li>
              )}
            </ul>
          </div>
        )}
        
        <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-700">
          <div className="flex space-x-2">
            <div className="text-sm bg-gray-700 rounded-full px-3 py-1">
              TX Count: {address.txCount}
            </div>
            {address.prediction.category && (
              <div className="text-sm bg-gray-700 rounded-full px-3 py-1">
                {address.prediction.category}
              </div>
            )}
          </div>
          
          <div className="flex space-x-2">
            {isInWatchlist ? (
              <button
                onClick={onRemoveFromWatchlist}
                className="text-xs bg-blue-900/50 hover:bg-blue-900 text-blue-400 px-3 py-1 rounded transition"
              >
                Remove from Watchlist
              </button>
            ) : (
              <button
                onClick={onAddToWatchlist}
                className="text-xs bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 px-3 py-1 rounded transition"
              >
                Add to Watchlist
              </button>
            )}
            
            <Link
              to={`/transactions/${address.address}`}
              className="text-xs bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded transition"
            >
              View Transactions
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddressCard;