import express, { Application } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { initCollections } from './config/chroma.config.js';
import uploadRoutes from './routes/upload.routes.js';
import chatRoutes from './routes/chat.routes.js';

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Routes
app.use('/api/upload', uploadRoutes);
app.use('/api/chat', chatRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handler
app.use((err: any, req: any, res: any, next: any) => {
  console.error('❌ Server error:', err);
  res.status(500).json({ error: err.message || 'Internal server error' });
});

// Initialize and start server
async function startServer() {
  try {
    // Initialize ChromaDB collections
    await initCollections();
    
    app.listen(PORT, () => {
      console.log(`\n🚀 Server running on http://localhost:${PORT}`);
      console.log(`📡 Health check: http://localhost:${PORT}/health`);
      console.log(`📤 Upload endpoint: http://localhost:${PORT}/api/upload`);
      console.log(`💬 Chat endpoint: http://localhost:${PORT}/api/chat\n`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
