const express = require('express');
const path = require('path');
const compression = require('compression');

const app = express();
const isDevelopment = process.env.NODE_ENV !== 'production';
const PORT = process.env.PORT || 8080;

// Enable gzip compression
app.use(compression());

if (isDevelopment) {
  // Development configuration with webpack middleware
  const webpack = require('webpack');
  const webpackConfig = require('./webpack.config.js');
  const compiler = webpack(webpackConfig);

  app.use(require('webpack-dev-middleware')(compiler, {
    publicPath: webpackConfig.output.publicPath
  }));

  app.use(require('webpack-hot-middleware')(compiler));
} else {
  // Serve static files in production
  app.use(express.static(path.join(__dirname, 'dist')));
}

// Handle client-side routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, isDevelopment ? 'index.html' : 'dist/index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});