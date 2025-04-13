const express = require('express');
const cors = require('cors');
const { createProxyMiddleware } = require('http-proxy-middleware');

// Configuration
const HOST = process.env.HOST || 'localhost';
const PORT = process.env.PORT || 5000;
const OLLAMA_URL = process.env.OLLAMA_URL || 'http://localhost:11434';

const app = express();

// Proxy setup
app.use('/ollama',  cors(), createProxyMiddleware({
  target: OLLAMA_URL,
  changeOrigin: true,
  pathRewrite: { '^/ollama': '' },
  onProxyRes: (proxyRes) => {
    proxyRes.headers['Access-Control-Allow-Origin'] = '*';
  },
  onError: (err, req, res) => {
    console.error('Proxy Error:', err);
    res.status(500).json({ error: 'Failed to connect to Ollama' });
  }
}));

// Start server
app.listen(PORT, HOST, async () => {
  console.log(`✅ Proxy server running at http://${HOST}:${PORT}/ollama`);
});