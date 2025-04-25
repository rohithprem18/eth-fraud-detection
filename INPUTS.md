# ETH Shield Input Reference

This document details all possible inputs and their formats for the ETH Shield application.

## Address Scanner

### Ethereum Address Input
- **Format**: `0x` + 40 hexadecimal characters
- **Example**: `0x742d35Cc6634C0532925a3b844Bc454e4438f44e`
- **Validation**: Must match regex `/^0x[a-fA-F0-9]{40}$/`

## Transaction Analysis

### Transaction Hash
- **Format**: `0x` + 64 hexadecimal characters
- **Example**: `0xa1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2`
- **Validation**: Must match regex `/^0x[a-fA-F0-9]{64}$/`

## Risk Assessment Parameters

### Risk Score
- **Range**: 0-100
- **Format**: Integer
- **Categories**:
  - 0-24: Safe
  - 25-49: Low Risk
  - 50-74: Medium Risk
  - 75-100: High Risk

### Confidence Score
- **Range**: 0-1
- **Format**: Decimal
- **Example**: 0.95

### Risk Factors
```json
{
  "name": "High Volume Transactions",
  "description": "Unusual number of transactions in a short period",
  "score": 75,
  "importance": 0.8
}
```

## Watchlist Parameters

### Address Entry
```json
{
  "address": "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
  "label": "Suspicious Contract",
  "notes": "High-risk trading pattern detected"
}
```

## Transaction Filters

### Date Range
- **Format**: ISO 8601
- **Example**: `2024-03-01T00:00:00Z` to `2024-03-15T23:59:59Z`

### Value Range
- **Format**: Wei (as string)
- **Example**: `"1000000000000000000"` (1 ETH)

### Transaction Type
- **Values**: 
  - `"all"`
  - `"incoming"`
  - `"outgoing"`
  - `"contract"`
  - `"suspicious"`

## Search Parameters

### Quick Search
- **Format**: String
- **Searchable Fields**:
  - Ethereum addresses
  - Transaction hashes
  - Labels
  - Notes

### Advanced Search
```json
{
  "type": "address|transaction",
  "dateRange": {
    "start": "2024-03-01T00:00:00Z",
    "end": "2024-03-15T23:59:59Z"
  },
  "riskLevel": "high|medium|low|safe",
  "category": "phishing|scam|suspicious"
}
```