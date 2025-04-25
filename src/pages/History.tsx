import React from 'react';
import { Clock, Trash2 } from 'lucide-react';
import { useEthereum } from '../context/EthereumContext';
import AddressCard from '../components/AddressCard';

const History: React.FC = () => {
  const { scanHistory, addToWatchlist, watchlist } = useEthereum();
  
  return (
    <div className="space-y-6">
      <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-medium text-white">Scan History</h3>
          <div className="flex items-center text-gray-400">
            <Clock className="h-5 w-5 mr-2" />
            <span>{scanHistory.length} addresses</span>
          </div>
        </div>
        
        <p className="text-gray-300 text-sm">
          View your recently scanned addresses and their fraud risk assessment results.
        </p>
      </div>
      
      {scanHistory.length > 0 ? (
        <div className="grid grid-cols-1 gap-6">
          {scanHistory.map((address) => (
            <AddressCard
              key={address.address}
              address={address}
              isInWatchlist={watchlist.some(item => item.address === address.address)}
              onAddToWatchlist={() => addToWatchlist(address)}
              onRemoveFromWatchlist={() => {
                // This would be implemented in the context if needed
              }}
            />
          ))}
        </div>
      ) : (
        <div className="bg-gray-800 rounded-lg border border-gray-700 p-10 text-center">
          <Clock className="h-12 w-12 text-gray-600 mx-auto mb-3" />
          <h3 className="text-lg font-medium mb-2">No scan history</h3>
          <p className="text-gray-400 max-w-md mx-auto mb-6">
            You haven't scanned any Ethereum addresses yet. Start by scanning an address to check for fraud risk.
          </p>
          <a
            href="/scanner"
            className="inline-flex items-center px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition"
          >
            Scan an Address
          </a>
        </div>
      )}
    </div>
  );
};

export default History;