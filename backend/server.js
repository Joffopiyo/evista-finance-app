const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/db');
require('dotenv').config();

// Route imports
const authRoutes = require('./routes/auth');
const transactionRoutes = require('./routes/transactions');
const analyticsRoutes = require('./routes/analytics');
const adminRoutes = require('./routes/admin');
const courseRoutes = require('./routes/courses');

const app = express();
const PORT = process.env.PORT || 4000;

// Connect to database
connectDB();

// Security middleware
app.use(helmet({
  crossOriginEmbedderPolicy: false, // Disable for WASM
  contentSecurityPolicy: false // Disable for development
}));

// CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:4000',
  credentials: false
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Add MIME type for WASM files
app.use((req, res, next) => {
  if (req.url.endsWith('.wasm')) {
    res.set('Content-Type', 'application/wasm');
  }
  next();
});

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Serve static files from Frontend directory with proper MIME types
app.use(express.static('frontend', {
  setHeaders: (res, path) => {
    if (path.endsWith('.wasm')) {
      res.set('Content-Type', 'application/wasm');
    }
    if (path.endsWith('.js')) {
      res.set('Content-Type', 'application/javascript');
    }
  }
}));

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/courses', courseRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Debug endpoint to check environment variables (Remove in production)
app.get('/api/debug-config', (req, res) => {
  res.json({
    env_check: {
      JWT_SECRET_EXISTS: !!process.env.JWT_SECRET,
      MONGODB_URI_EXISTS: !!process.env.MONGODB_URI,
      FRONTEND_URL_EXISTS: !!process.env.FRONTEND_URL,
      NODE_ENV: process.env.NODE_ENV
    }
  });
});

// Serve frontend routes
app.get('/', (req, res) => {
  res.sendFile('index.html', { root: 'frontend' });
});

app.get('/login', (req, res) => {
  res.sendFile('login.html', { root: 'frontend' });
});

app.get('/user-dashboard', (req, res) => {
  res.sendFile('user-dashboard.html', { root: 'frontend' });
});

app.get('/admin-dashboard', (req, res) => {
  res.sendFile('admin-dashboard.html', { root: 'frontend' });
});

app.get('/budget', (req, res) => {
  res.sendFile('budget.html', { root: 'frontend' });
});

app.get('/signup', (req, res) => {
  res.sendFile('signup.html', { root: 'frontend' });
});

app.get('/courses', (req, res) => {
  res.sendFile('courses.html', { root: 'frontend' });
});

app.get('/reports', (req, res) => {
  res.sendFile('reports.html', { root: 'frontend' });
});

// 404 handler for API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({ error: 'API endpoint not found', code: 404 });
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Server error:', error);
  res.status(500).json({ error: 'Internal server error', code: 500 });
});

const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Frontend: http://localhost:${PORT}`);
  console.log(`API: http://localhost:${PORT}/api`);
  console.log('WASM MIME types configured');
}).on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use. Please try a different port or close the application using this port.`);
    process.exit(1);
  } else {
    console.error('Server error:', err);
    process.exit(1);
  }
});