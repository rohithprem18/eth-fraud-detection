import React, { useState } from 'react';
import { ChevronDown, ChevronUp, ExternalLink, AlertTriangle } from 'lucide-react';
import { Transaction } from '../types';
import { formatEther, formatDate, shortenAddress, shortenTxHash } from '../utils/formatters';

interface TransactionListProps {
  transactions: Transaction[];
  currentAddress?: string;
  loading?: boolean;
}

const TransactionList: React.FC<TransactionListProps> = ({ 
  transactions, 
  currentAddress,
  loading = false
}) => {
  const [sortField, setSortField] = useState<keyof Transaction>('timeStamp');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [expanded, setExpanded] = useState<string | null>(null);
  
  const handleSort = (field: keyof Transaction) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };
  
  const sortedTransactions = [...transactions].sort((a, b) => {
    let valA = a[sortField];
    let valB = b[sortField];
    
    if (sortField === 'timeStamp') {
      valA = new Date(valA as string).getTime();
      valB = new Date(valB as string).getTime();
    } else if (sortField === 'value') {
      valA = parseFloat(valA as string);
      valB = parseFloat(valB as string);
    }
    
    if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
    if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });
  
  const toggleExpand = (hash: string) => {
    setExpanded(expanded === hash ? null : hash);
  };
  
  if (loading) {
    return (
      <div className="animate-pulse flex flex-col space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="bg-gray-800 h-16 rounded-lg"></div>
        ))}
      </div>
    );
  }
  
  if (transactions.length === 0) {
    return (
      <div className="bg-gray-800 rounded-lg p-6 text-center border border-gray-700">
        <p className="text-gray-400">No transactions found.</p>
      </div>
    );
  }
  
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="text-left text-sm text-gray-400 border-b border-gray-700">
            <th className="pb-3 pr-4">
              <button 
                className="flex items-center space-x-1 hover:text-white transition"
                onClick={() => handleSort('timeStamp')}
              >
                <span>Time</span>
                {sortField === 'timeStamp' && (
                  sortDirection === 'asc' ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />
                )}
              </button>
            </th>
            <th className="p-3">
              <button 
                className="flex items-center space-x-1 hover:text-white transition"
                onClick={() => handleSort('hash')}
              >
                <span>Transaction</span>
              </button>
            </th>
            <th className="p-3">From</th>
            <th className="p-3">To</th>
            <th className="p-3">
              <button 
                className="flex items-center space-x-1 hover:text-white transition"
                onClick={() => handleSort('value')}
              >
                <span>Value</span>
                {sortField === 'value' && (
                  sortDirection === 'asc' ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />
                )}
              </button>
            </th>
            <th className="p-3 text-right">Status</th>
          </tr>
        </thead>
        <tbody>
          {sortedTransactions.map((tx) => (
            <React.Fragment key={tx.hash}>
              <tr 
                className={`border-b border-gray-700 transition hover:bg-gray-750 ${
                  tx.isSuspicious ? 'bg-red-900/10' : ''
                }`}
                onClick={() => toggleExpand(tx.hash)}
              >
                <td className="py-4 pr-6 text-sm">
                  {formatDate(tx.timeStamp)}
                </td>
                <td className="py-4 pr-6 font-mono text-sm">
                  <div className="flex items-center">
                    {shortenTxHash(tx.hash)}
                    <a 
                      href={`https://etherscan.io/tx/${tx.hash}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="ml-2 text-gray-400 hover:text-blue-400 transition"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <ExternalLink className="h-3 w-3" />
                    </a>
                    {tx.isSuspicious && (
                      <AlertTriangle className="h-4 w-4 ml-2 text-red-500" />
                    )}
                  </div>
                </td>
                <td className={`py-4 pr-6 font-mono text-sm ${
                  currentAddress && tx.from.toLowerCase() === currentAddress.toLowerCase() ? 'text-orange-400' : ''
                }`}>
                  {shortenAddress(tx.from)}
                </td>
                <td className={`py-4 pr-6 font-mono text-sm ${
                  currentAddress && tx.to.toLowerCase() === currentAddress.toLowerCase() ? 'text-green-400' : ''
                }`}>
                  {shortenAddress(tx.to)}
                </td>
                <td className="py-4 pr-6 text-sm">
                  {formatEther(tx.value)} ETH
                </td>
                <td className="py-4 text-right text-sm">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    tx.isError === '0'
                      ? 'bg-green-900/20 text-green-400'
                      : 'bg-red-900/20 text-red-400'
                  }`}>
                    {tx.isError === '0' ? 'Success' : 'Failed'}
                  </span>
                </td>
              </tr>
              {expanded === tx.hash && (
                <tr className="bg-gray-750">
                  <td colSpan={6} className="py-4 px-6">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <h4 className="text-gray-400 mb-2">Transaction Details</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-gray-400">Block:</span>
                            <span>{tx.blockNumber}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Gas Used:</span>
                            <span>{tx.gasUsed}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Gas Price:</span>
                            <span>{parseInt(tx.gasPrice) / 1e9} Gwei</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Method:</span>
                            <span>{tx.method || 'Transfer'}</span>
                          </div>
                        </div>
                      </div>
                      {tx.isSuspicious && (
                        <div>
                          <h4 className="text-red-400 flex items-center mb-2">
                            <AlertTriangle className="h-4 w-4 mr-2" />
                            Suspicious Activity Detected
                          </h4>
                          <p className="text-gray-300">{tx.suspiciousReason}</p>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TransactionList;