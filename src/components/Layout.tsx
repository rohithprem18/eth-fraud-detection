import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Shield, BarChart2, Search, List, Clock, AlertTriangle, Settings } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  return (
    <div className="min-h-screen bg-gray-900 text-white flex">
      {/* Sidebar */}
      <div className="w-64 bg-gray-800 border-r border-gray-700 flex flex-col">
        <div className="p-5 border-b border-gray-700">
          <div className="flex items-center space-x-2">
            <Shield className="h-8 w-8 text-blue-400" />
            <h1 className="text-xl font-bold">ETH Shield</h1>
          </div>
          <p className="text-gray-400 text-sm mt-1">Fraud Detection System</p>
        </div>
        
        <nav className="flex-1 p-4">
          <ul className="space-y-1">
            <li>
              <Link
                to="/"
                className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                  isActive('/') 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-300 hover:bg-gray-700'
                }`}
              >
                <BarChart2 className="h-5 w-5" />
                <span>Dashboard</span>
              </Link>
            </li>
            <li>
              <Link
                to="/scanner"
                className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                  isActive('/scanner') 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-300 hover:bg-gray-700'
                }`}
              >
                <Search className="h-5 w-5" />
                <span>Address Scanner</span>
              </Link>
            </li>
            <li>
              <Link
                to="/watchlist"
                className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                  isActive('/watchlist') 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-300 hover:bg-gray-700'
                }`}
              >
                <List className="h-5 w-5" />
                <span>Watchlist</span>
              </Link>
            </li>
            <li>
              <Link
                to="/history"
                className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                  isActive('/history') 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-300 hover:bg-gray-700'
                }`}
              >
                <Clock className="h-5 w-5" />
                <span>History</span>
              </Link>
            </li>
          </ul>
          
          <div className="mt-8">
            <h3 className="text-gray-400 text-xs uppercase tracking-wider mb-2 px-3">Resources</h3>
            <ul className="space-y-1">
              <li>
                <a 
                  href="#" 
                  className="flex items-center space-x-3 p-3 rounded-lg text-gray-300 hover:bg-gray-700 transition-colors"
                >
                  <AlertTriangle className="h-5 w-5" />
                  <span>Known Scams</span>
                </a>
              </li>
              <li>
                <a 
                  href="#" 
                  className="flex items-center space-x-3 p-3 rounded-lg text-gray-300 hover:bg-gray-700 transition-colors"
                >
                  <Settings className="h-5 w-5" />
                  <span>Settings</span>
                </a>
              </li>
            </ul>
          </div>
        </nav>
        
        <div className="p-4 border-t border-gray-700">
          <div className="bg-gray-700 rounded-lg p-3">
            <p className="text-sm text-gray-300">ETH Shield v1.0</p>
            <p className="text-xs text-gray-400 mt-1">Connected to Ethereum Mainnet</p>
          </div>
        </div>
      </div>
      
      {/* Main content */}
      <div className="flex-1 overflow-auto">
        <header className="bg-gray-800 border-b border-gray-700 py-4 px-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium">
              {location.pathname === '/' && 'Dashboard'}
              {location.pathname === '/scanner' && 'Address Scanner'}
              {location.pathname.startsWith('/transactions') && 'Transaction Analysis'}
              {location.pathname === '/watchlist' && 'Watchlist'}
              {location.pathname === '/history' && 'Scan History'}
            </h2>
            
            <div className="flex items-center space-x-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Quick search..."
                  className="bg-gray-700 rounded-lg px-4 py-2 pl-9 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
                />
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              </div>
            </div>
          </div>
        </header>
        
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;