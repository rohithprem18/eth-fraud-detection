import React, { useEffect, useState } from 'react';
import { Activity, AlertTriangle, Users, ShieldAlert } from 'lucide-react';
import { useEthereum } from '../context/EthereumContext';
import MetricsCard from '../components/MetricsCard';
import RiskScoreGauge from '../components/RiskScoreGauge';
import { MetricItem } from '../types';
import axios from 'axios';

const Dashboard: React.FC = () => {
  const { scanHistory, watchlist } = useEthereum();
  
  // State to store the Ethereum price
  const [ethPrice, setEthPrice] = useState<string>('$0.00');
  
  useEffect(() => {
    // Fetch the current Ethereum price from the CoinGecko API
    const fetchEthPrice = async () => {
      try {
        const response = await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd');
        setEthPrice(`$${response.data.ethereum.usd.toFixed(2)}`);
      } catch (error) {
        console.error('Error fetching Ethereum price:', error);
      }
    };
    
    // Call the fetch function on initial load
    fetchEthPrice();
    
    // Optionally, you can refresh the price every minute (60000ms)
    const interval = setInterval(fetchEthPrice, 60000);
    
    // Clean up the interval on component unmount
    return () => clearInterval(interval);
  }, []);
  
  // Sample data for demonstration
  const networkMetrics: MetricItem[] = [
    { 
      label: 'Ethereum', 
      value: <img src="src\pages\image.png" className="w-12 h-12 object-contain" alt="Ethereum Logo" /> 
    },
    { 
      label: 'ETH Price', 
      value: ethPrice, 
      change: 2.4, 
      status: 'positive' 
    }
  ];
  
  const detectionMetrics: MetricItem[] = [
    { label: 'Addresses Scanned', value: scanHistory.length },
    { label: 'Addresses Watched', value: watchlist.length },
    { label: 'High Risk Found', value: scanHistory.filter(a => a.riskScore >= 75).length },
    { label: 'Medium Risk Found', value: scanHistory.filter(a => a.riskScore >= 50 && a.riskScore < 75).length }
  ];
  
  const recentlyScanned = scanHistory.slice(0, 5);
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Network Status */}
        <MetricsCard 
          title="Network Status" 
          metrics={networkMetrics} 
          icon={<Activity />} 
        />
        
        {/* Detection Statistics */}
        <MetricsCard 
          title="Detection Statistics" 
          metrics={detectionMetrics} 
          icon={<ShieldAlert />} 
        />
        
        {/* Latest Threats */}
        <div className="bg-gray-800 rounded-lg border border-gray-700 p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium text-white">Latest Threats</h3>
            <AlertTriangle className="text-red-500" />
          </div>
          
          <div className="space-y-3">
            {[{ name: 'USDT Drainer', type: 'Phishing Contract', date: '2h ago' }, { name: 'Fake Airdrop', type: 'Scam Token', date: '5h ago' }, { name: 'ETH2x Multiplier', type: 'Ponzi Scheme', date: '1d ago' }]
              .map((threat, i) => (
                <div key={i} className="flex items-center p-2 rounded hover:bg-gray-700 transition cursor-pointer">
                  <div className="w-2 h-2 rounded-full bg-red-500 mr-3"></div>
                  <div className="flex-1">
                    <h4 className="text-white text-sm font-medium">{threat.name}</h4>
                    <p className="text-gray-400 text-xs">{threat.type}</p>
                  </div>
                  <span className="text-gray-400 text-xs">{threat.date}</span>
                </div>
              ))}
          </div>
          
          <a
            href="https://ethprotector.netlify.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full mt-4 py-2 text-center text-sm text-blue-400 hover:text-blue-300 transition"
          >
            View All Threats
          </a>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Average Risk Score */}
        <div className="bg-gray-800 rounded-lg border border-gray-700 p-5 flex flex-col items-center justify-center">
          <h3 className="font-medium text-white mb-3">Average Risk Score</h3>
          
          <div className="flex justify-center">
            <RiskScoreGauge 
              score={Math.round(
                scanHistory.reduce((acc, addr) => acc + addr.riskScore, 0) / (scanHistory.length || 1)
              )}
            />
          </div>
          
          <p className="text-center text-sm text-gray-400 mt-2">
            Based on {scanHistory.length} addresses scanned
          </p>
        </div>
      </div>
      
      {/* Recently Scanned Addresses */}
      <div className="bg-gray-800 rounded-lg border border-gray-700 p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-medium text-white">Recently Scanned Addresses</h3>
          <Users className="text-blue-400" />
        </div>
        
        {recentlyScanned.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-sm text-gray-400 border-b border-gray-700">
                  <th className="pb-3 pr-6">Address</th>
                  <th className="pb-3 pr-6">Last Checked</th>
                  <th className="pb-3 pr-6">Type</th>
                  <th className="pb-3 pr-6">Risk Score</th>
                  <th className="pb-3">Category</th>
                </tr>
              </thead>
              <tbody>
                {recentlyScanned.map((address, i) => (
                  <tr key={i} className="border-b border-gray-700 hover:bg-gray-750 transition">
                    <td className="py-3 pr-6">
                      <a 
                        href={`/transactions/${address.address}`}
                        className="text-blue-400 hover:underline font-mono text-sm"
                      >
                        {address.address.slice(0, 6)}...{address.address.slice(-4)}
                      </a>
                    </td>
                    <td className="py-3 pr-6 text-sm">
                      {new Date(address.lastChecked).toLocaleString()}
                    </td>
                    <td className="py-3 pr-6 text-sm">
                      {address.isContract ? 'Contract' : 'EOA'}
                    </td>
                    <td className="py-3 pr-6">
                      <div className="flex items-center">
                        <div className="w-16 bg-gray-700 h-2 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${address.riskScore >= 75 ? 'bg-red-500' : address.riskScore >= 50 ? 'bg-orange-500' : address.riskScore >= 25 ? 'bg-yellow-500' : 'bg-green-500'}`}
                            style={{ width: `${address.riskScore}%` }}
                          ></div>
                        </div>
                        <span className="ml-2 text-sm">{address.riskScore}</span>
                      </div>
                    </td>
                    <td className="py-3 text-sm">
                      {address.prediction.category || 'Unknown'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-400">
            <p>No addresses have been scanned yet.</p>
            <p className="mt-2">
              <a href="/scanner" className="text-blue-400 hover:underline">
                Scan an address
              </a>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
