export interface Address {
  address: string;
  balance: string;
  txCount: number;
  firstTx?: string;
  lastTx?: string;
  isContract: boolean;
  riskScore: number;
  lastChecked: string;
  prediction: FraudPrediction;
}

export interface Transaction {
  hash: string;
  blockNumber: number;
  timeStamp: string;
  from: string;
  to: string;
  value: string;
  gas: string;
  gasPrice: string;
  gasUsed: string;
  method: string;
  isError: string;
  isSuspicious: boolean;
  suspiciousReason?: string;
}

export interface FraudPrediction {
  riskScore: number; // 0-100
  fraudProbability: number; // 0-1
  isFraudulent: boolean;
  confidence: number; // 0-1
  riskFactors: RiskFactor[];
  category?: string; // 'phishing', 'scam', 'ransomware', etc.
}

export interface RiskFactor {
  name: string;
  description: string;
  score: number; // 0-100
  importance: number; // 0-1
}

export interface MetricItem {
  label: string;
  value: string | number | React.ReactNode; // Allow React elements
  change?: number;
  status?: 'positive' | 'negative' | 'neutral';
}

export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string | string[];
    borderColor?: string | string[];
    borderWidth?: number;
  }[];
}