# ETH Shield - Ethereum Fraud Detection System

ETH Shield is a modern web application for detecting and monitoring fraudulent activity on the Ethereum blockchain. It provides real-time risk assessment, transaction analysis, and monitoring capabilities for Ethereum addresses.

## Features

- 🔍 **Address Scanner**: Analyze any Ethereum address for potential fraud risks
- 📊 **Risk Assessment**: Get detailed risk scores and confidence ratings
- 🔄 **Transaction Analysis**: View and analyze transaction patterns
- 👁️ **Address Watchlist**: Monitor suspicious addresses
- 📜 **Scan History**: Keep track of previously analyzed addresses
- 📈 **Dashboard**: View network statistics and fraud trends

## Demo

Live Demo: [ETH Shield Demo](https://eth-shield-demo.netlify.app)

## Quick Start

1. Clone the repository:
```bash
git clone https://github.com/yourusername/eth-shield.git
cd eth-shield
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Build for production:
```bash
npm run build
```

## Input Format Examples

### Ethereum Addresses
- Format: `0x` followed by 40 hexadecimal characters
- Example: `0x742d35Cc6634C0532925a3b844Bc454e4438f44e`

### Transaction Hashes
- Format: `0x` followed by 64 hexadecimal characters
- Example: `0xa1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2`

### Risk Factors
Each risk factor includes:
- Name: String (e.g., "High Volume Transactions")
- Description: String
- Score: Number (0-100)
- Importance: Number (0-1)

## Deployment

### Netlify Deployment

1. Create a new site on Netlify
2. Connect your GitHub repository
3. Configure build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Node version: 18.x

### Environment Variables

Create a `.env` file with the following variables:
```
VITE_ETHERSCAN_API_KEY=your_api_key
VITE_INFURA_PROJECT_ID=your_project_id
```

## Technology Stack

- React 18
- TypeScript
- Vite
- TailwindCSS
- React Router
- Lucide Icons

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## License

MIT License - feel free to use this project for your own purposes.