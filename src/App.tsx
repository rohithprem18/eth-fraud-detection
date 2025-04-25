import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import AddressScanner from './pages/AddressScanner';
import TransactionAnalysis from './pages/TransactionAnalysis';
import Watchlist from './pages/Watchlist';
import History from './pages/History';
import { EthereumProvider } from './context/EthereumContext';

function App() {
  return (
    <EthereumProvider>
      <Router>
        <Toaster position="top-right" />
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/scanner" element={<AddressScanner />} />
            <Route path="/transactions/:address" element={<TransactionAnalysis />} />
            <Route path="/watchlist" element={<Watchlist />} />
            <Route path="/history" element={<History />} />
          </Routes>
        </Layout>
      </Router>
    </EthereumProvider>
  );
}

export default App;