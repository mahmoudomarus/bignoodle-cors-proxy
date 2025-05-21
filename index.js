const express = require('express');
const cors = require('cors');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
const port = process.env.PORT || 3001;
const TARGET_URL = 'https://agno-agent-api-tabi-39e2dc704f77.herokuapp.com';

// CORS middleware
app.use(cors({
  origin: [
    'https://bignoodle-agent-ui-1.onrender.com',
    'https://bignoodle-agent-ui.onrender.com',
    'http://localhost:3000'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'CORS proxy server is running' });
});

// Proxy all requests
const apiProxy = createProxyMiddleware({
  target: TARGET_URL,
  changeOrigin: true,
  pathRewrite: {
    '^/api': ''  // Remove /api prefix when forwarding requests
  },
  onProxyRes: function(proxyRes, req, res) {
    proxyRes.headers['Access-Control-Allow-Origin'] = req.headers.origin || '*';
    proxyRes.headers['Access-Control-Allow-Credentials'] = 'true';
    proxyRes.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS';
    proxyRes.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization';
    
    console.log(`${new Date().toISOString()} - Proxied ${req.method} ${req.url} → ${TARGET_URL}${req.url.replace(/^\/api/, '')}`);
  },
  onError: (err, req, res) => {
    console.error(`Proxy error: ${err.message}`);
    res.status(500).json({ error: 'Proxy error', message: err.message });
  }
});

app.use('/api', apiProxy);

// Handle all other routes
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Not found', message: 'Route not found. Use /api to proxy requests or /health to check server status.' });
});

app.listen(port, () => {
  console.log(`CORS proxy server running on port ${port}`);
  console.log(`Proxying requests from /api to ${TARGET_URL}`);
}); 