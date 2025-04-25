import { Address, Transaction, FraudPrediction, RiskFactor } from '../types';

// Known suspicious patterns (for mock implementation)
const SUSPICIOUS_PATTERNS = [
  {
    name: 'High Volume Transactions',
    description: 'Unusual number of transactions in a short period of time',
    rule: (address: Address, txs: Transaction[]) => txs.length > 20,
    score: 40,
    importance: 0.4
  },
  {
    name: 'Large Transfers',
    description: 'Unusually large transfers for this account type',
    rule: (address: Address, txs: Transaction[]) => 
      txs.some(tx => parseFloat(tx.value) / 1e18 > 10),
    score: 35,
    importance: 0.5
  },
  {
    name: 'Known Scam Contract',
    description: 'Interactions with addresses flagged as scams or frauds',
    rule: (address: Address, txs: Transaction[]) => 
      txs.some(tx => 
        knownScamAddresses.includes(tx.to) || 
        knownScamAddresses.includes(tx.from)
      ),
    score: 90,
    importance: 0.8
  },
  {
    name: 'Failed Transactions',
    description: 'Multiple failed transactions indicating potential attack attempts',
    rule: (address: Address, txs: Transaction[]) => 
      txs.filter(tx => tx.isError === '1').length >= 3,
    score: 60,
    importance: 0.3
  },
  {
    name: 'New Wallet',
    description: 'Recently created wallet with high-value transactions',
    rule: (address: Address) => {
      if (!address.firstTx) return false;
      const walletAge = Date.now() - new Date(address.firstTx).getTime();
      const isNew = walletAge < 7 * 24 * 3600 * 1000; // Less than 7 days old
      return isNew && parseFloat(address.balance) > 5;
    },
    score: 45,
    importance: 0.4
  },
  {
    name: 'Unusual Gas Usage',
    description: 'Abnormal gas usage patterns typical of fraudulent contracts',
    rule: (_address: Address, txs: Transaction[]) => 
      txs.some(tx => parseInt(tx.gasUsed) > 1000000),
    score: 50,
    importance: 0.5
  },
  {
    name: 'Mixer Usage',
    description: 'Transactions involving known cryptocurrency mixing services',
    rule: (_address: Address, txs: Transaction[]) => 
      txs.some(tx => 
        mixerAddresses.includes(tx.to) || 
        mixerAddresses.includes(tx.from)
      ),
    score: 75,
    importance: 0.7
  },
  {
    name: 'Phishing Contract',
    description: 'Contract using techniques to steal funds or tokens',
    rule: (address: Address) => 
      address.isContract && phishingContracts.includes(address.address),
    score: 95,
    importance: 0.9
  }
];

// Mock lists of known bad addresses
const knownScamAddresses = [
  '0xd4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5',
  '0x7856a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e785'
];

const mixerAddresses = [
  '0x9856a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e985',
  '0xa856a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4ea85'
];

const phishingContracts = [
  '0xb856a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4eb85',
  '0xc856a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4ec85'
];

// Categories based on risk factors
const getCategory = (riskFactors: RiskFactor[]): string | undefined => {
  if (riskFactors.some(f => f.name.includes('Phishing'))) return 'Phishing';
  if (riskFactors.some(f => f.name.includes('Mixer'))) return 'Money Laundering';
  if (riskFactors.some(f => f.name.includes('Scam'))) return 'Scam';
  if (riskFactors.length > 0) return 'Suspicious';
  return undefined;
};

/**
 * Detect fraud for an Ethereum address
 */
export const detectFraud = async (
  address: string,
  addressData: Address,
  transactions: Transaction[]
): Promise<FraudPrediction> => {
  // Simulate API call to ML model
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Apply suspicious patterns to detect risk factors
  const riskFactors: RiskFactor[] = [];
  
  // Flag suspicious transactions
  const txsWithFlags = transactions.map(tx => {
    // Check if transaction involves known scam addresses
    const involvesBadAddress = 
      knownScamAddresses.includes(tx.to) || 
      knownScamAddresses.includes(tx.from) ||
      mixerAddresses.includes(tx.to) || 
      mixerAddresses.includes(tx.from);
    
    // Check for other suspicious patterns
    const highValue = parseFloat(tx.value) / 1e18 > 5; // More than 5 ETH
    const isFailedTx = tx.isError === '1';
    const highGas = parseInt(tx.gasUsed) > 500000;
    
    const isSuspicious = involvesBadAddress || (highValue && (isFailedTx || highGas));
    
    let suspiciousReason;
    if (isSuspicious) {
      if (involvesBadAddress) suspiciousReason = 'Transaction involves a known suspicious address';
      else if (highValue && isFailedTx) suspiciousReason = 'High-value transaction that failed, possible theft attempt';
      else if (highValue && highGas) suspiciousReason = 'High-value transaction with unusual gas usage';
    }
    
    return {
      ...tx,
      isSuspicious,
      suspiciousReason
    };
  });
  
  // Check each pattern
  for (const pattern of SUSPICIOUS_PATTERNS) {
    if (pattern.rule(addressData, txsWithFlags)) {
      riskFactors.push({
        name: pattern.name,
        description: pattern.description,
        score: pattern.score,
        importance: pattern.importance
      });
    }
  }
  
  // Add random risk factor for demo purposes (30% chance)
  if (riskFactors.length === 0 && Math.random() < 0.3) {
    const randomPattern = SUSPICIOUS_PATTERNS[Math.floor(Math.random() * SUSPICIOUS_PATTERNS.length)];
    riskFactors.push({
      name: randomPattern.name,
      description: randomPattern.description,
      score: randomPattern.score,
      importance: randomPattern.importance
    });
  }
  
  // Calculate overall risk score (weighted average of risk factors)
  let overallScore = 0;
  let totalImportance = 0;
  
  if (riskFactors.length > 0) {
    for (const factor of riskFactors) {
      overallScore += factor.score * factor.importance;
      totalImportance += factor.importance;
    }
    overallScore = Math.round(overallScore / totalImportance);
  }
  
  // For known bad addresses, ensure a high risk score
  if (
    knownScamAddresses.includes(address) || 
    phishingContracts.includes(address) ||
    (addressData.isContract && Math.random() < 0.4) // 40% chance for contracts to be high risk
  ) {
    overallScore = Math.max(overallScore, 90);
  }
  
  // Determine confidence based on amount of data
  const confidence = Math.min(
    0.5 + (0.1 * riskFactors.length) + (0.05 * Math.min(transactions.length, 10)),
    0.95
  );
  
  // Get category
  const category = getCategory(riskFactors);
  
  return {
    riskScore: overallScore,
    fraudProbability: overallScore / 100,
    isFraudulent: overallScore >= 75,
    confidence,
    riskFactors,
    category
  };
};