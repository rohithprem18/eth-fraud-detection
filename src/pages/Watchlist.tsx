import React from 'react';
import { Eye, Trash2 } from 'lucide-react';
import { useEthereum } from '../context/EthereumContext';
import AddressCard from '../components/AddressCard';

const Watchlist: React.FC = () => {
  const { watchlist, removeFromWatchlist } = useEthereum();
  
  return (
    <div className="space-y-6">
      <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-medium text-white">Address Watchlist</h3>
          <div className="flex items-center text-gray-400">
            <Eye className="h-5 w-5 mr-2" />
            <span>{watchlist.length} addresses</span>
          </div>
        </div>
        
        <p className="text-gray-300 text-sm">
          Monitor suspicious addresses and receive notifications of changes in their risk profile.
        </p>
      </div>
      
      {watchlist.length > 0 ? (
        <div className="grid grid-cols-1 gap-6">
          {watchlist.map((address) => (
            <AddressCard
              key={address.address}
              address={address}
              isInWatchlist={true}
              onRemoveFromWatchlist={() => removeFromWatchlist(address.address)}
            />
          ))}
        </div>
      ) : (
        <div className="bg-gray-800 rounded-lg border border-gray-700 p-10 text-center">
          <Eye className="h-12 w-12 text-gray-600 mx-auto mb-3" />
          <h3 className="text-lg font-medium mb-2">Your watchlist is empty</h3>
          <p className="text-gray-400 max-w-md mx-auto mb-6">
            Add addresses to your watchlist to track them and monitor for suspicious activity.
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

export default Watchlist;