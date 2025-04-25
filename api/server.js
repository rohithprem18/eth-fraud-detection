import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import dotenv from 'dotenv';
import { detectFraud } from '../src/services/fraudDetectionService.js';
import { fetchAddressDetails, fetchTransactions } from '../src/services/ethereumService.js';

// Load environment variables
dotenv.config();

const __dirname = dirname(fileURLToPath(import.meta.url));

// Initialize express
const app = express();
const port = process.env.PORT || 3000;

// Load Swagger document
const swaggerDocument = YAML.load(join(__dirname, 'swagger.yaml'));

// Middleware
app.use(cors());
app.use(helmet());
app.use(morgan('combined'));
app.use(express.json());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// API Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Scan address endpoint
app.post('/api/scan', async (req, res) => {
  try {
    const { address } = req.body;
    
    if (!address || !/^0x[a-fA-F0-9]{40}$/.test(address)) {
      return res.status(400).json({ error: 'Invalid Ethereum address' });
    }
    
    const addressData = await fetchAddressDetails(address);
    const transactions = await fetchTransactions(address);
    const prediction = await detectFraud(address, addressData, transactions);
    
    res.json({
      address: addressData,
      transactions,
      prediction
    });
  } catch (error) {
    console.error('Error scanning address:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get transactions endpoint
app.get('/api/transactions/:address', async (req, res) => {
  try {
    const { address } = req.params;
    
    if (!address || !/^0x[a-fA-F0-9]{40}$/.test(address)) {
      return res.status(400).json({ error: 'Invalid Ethereum address' });
    }
    
    const transactions = await fetchTransactions(address);
    res.json({ transactions });
  } catch (error) {
    console.error('Error fetching transactions:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Start server
app.listen(port, () => {
  console.log(`API server running on port ${port}`);
});