import { Transaction, Address } from '../types';

// Mock data and service functions since we can't connect to Ethereum directly
const MOCK_TRANSACTIONS: Transaction[] = [
  {
    hash: '0xa1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2',
    blockNumber: 15324567,
    timeStamp: new Date(Date.now() - 3600000).toISOString(),
    from: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
    to: '0x123a52Cc6634C0532925a3b844Bc454e4438f123',
    value: '1500000000000000000', // 1.5 ETH
    gas: '21000',
    gasPrice: '50000000000',
    gasUsed: '21000',
    method: 'Transfer',
    isError: '0',
    isSuspicious: false
  },
  {
    hash: '0xb2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3',
    blockNumber: 15324530,
    timeStamp: new Date(Date.now() - 86400000).toISOString(),
    from: '0x123a52Cc6634C0532925a3b844Bc454e4438f123',
    to: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
    value: '500000000000000000', // 0.5 ETH
    gas: '21000',
    gasPrice: '45000000000',
    gasUsed: '21000',
    method: 'Transfer',
    isError: '0',
    isSuspicious: false
  },
  {
    hash: '0xc3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4',
    blockNumber: 15324400,
    timeStamp: new Date(Date.now() - 172800000).toISOString(),
    from: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
    to: '0xd4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5',
    value: '2000000000000000000', // 2 ETH
    gas: '150000',
    gasPrice: '55000000000',
    gasUsed: '120000',
    method: 'Contract Interaction',
    isError: '0',
    isSuspicious: true,
    suspiciousReason: 'Interacted with a known phishing contract that drains funds'
  },
  {
    hash: '0xd4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5',
    blockNumber: 15324350,
    timeStamp: new Date(Date.now() - 259200000).toISOString(),
    from: '0xe5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f',
    to: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
    value: '10000000000000000000', // 10 ETH
    gas: '21000',
    gasPrice: '40000000000',
    gasUsed: '21000',
    method: 'Transfer',
    isError: '0',
    isSuspicious: false
  },
  {
    hash: '0xe5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6',
    blockNumber: 15324300,
    timeStamp: new Date(Date.now() - 345600000).toISOString(),
    from: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
    to: '0x9856a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e985',
    value: '5000000000000000000', // 5 ETH
    gas: '21000',
    gasPrice: '60000000000',
    gasUsed: '21000',
    method: 'Transfer',
    isError: '1', // Failed transaction
    isSuspicious: false
  }
];

const KNOWN_SCAM_ADDRESSES = [
  '0xd4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5',
  '0x7856a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e785'
];

/**
 * Fetch address details from Ethereum network (mock implementation)
 */
export const fetchAddressDetails = async (address: string): Promise<Address> => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Generate random data for demonstration
  const isContract = Math.random() > 0.7;
  const txCount = Math.floor(Math.random() * 100) + 1;
  const balance = (Math.random() * 10).toFixed(4) + '000000000000000000'; // Random ETH amount
  
  // Recent dates for first and last transactions
  const lastTx = new Date(Date.now() - Math.random() * 30 * 24 * 3600 * 1000).toISOString();
  const firstTx = new Date(Date.now() - (Math.random() * 365 + 30) * 24 * 3600 * 1000).toISOString();
  
  // Higher risk for known scam addresses
  const isKnownScam = KNOWN_SCAM_ADDRESSES.includes(address);
  
  return {
    address,
    balance,
    txCount,
    firstTx,
    lastTx,
    isContract,
    riskScore: 0, // Will be set by fraud detection service
    lastChecked: new Date().toISOString(),
    prediction: {
      riskScore: 0,
      fraudProbability: 0,
      isFraudulent: false,
      confidence: 0,
      riskFactors: []
    }
  };
};

/**
 * Fetch transactions for an address (mock implementation)
 */
export const fetchTransactions = async (address: string): Promise<Transaction[]> => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Update the addresses in mock data to match the requested address
  const transactions = MOCK_TRANSACTIONS.map(tx => {
    // Randomly make some transactions involve the requested address
    const isSender = Math.random() > 0.5;
    
    return {
      ...tx,
      from: isSender ? address : tx.from,
      to: !isSender ? address : tx.to
    };
  });
  
  // Add some randomness to timestamps
  return transactions.map(tx => ({
    ...tx,
    timeStamp: new Date(new Date(tx.timeStamp).getTime() + Math.random() * 86400000).toISOString()
  }));
};