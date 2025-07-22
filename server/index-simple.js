// Simple JavaScript server entry point for Windows
const express = require('express');
const cors = require('cors');
const path = require('path');

// Basic environment setup
process.env.NODE_ENV = process.env.NODE_ENV || 'development';
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Basic middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Serve static files
app.use(express.static(path.join(__dirname, '../client/dist')));

// Basic health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server running', timestamp: new Date().toISOString() });
});

// Basic auth endpoint for testing
app.get('/api/auth/me', (req, res) => {
  res.json({
    id: 'test-user',
    email: 'admin@sportzalfitness.com',
    role: 'admin',
    firstName: 'Admin',
    lastName: 'User'
  });
});

// Serve index.html for all other routes
app.get('*', (req, res) => {
  if (req.path.startsWith('/api/')) {
    res.status(404).json({ error: 'API endpoint not found' });
  } else {
    res.sendFile(path.join(__dirname, '../client/dist/index.html'));
  }
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Simple server running on port ${PORT}`);
  console.log(`🌐 Access at: http://localhost:${PORT}`);
  console.log(`👤 Login: admin@sportzalfitness.com / admin123`);
});

module.exports = app;