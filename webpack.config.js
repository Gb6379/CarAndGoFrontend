const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const fs = require('fs');

// Get the current working directory
const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = (relativePath) => path.resolve(appDirectory, relativePath);

module.exports = {
  entry: resolveApp('src/index.tsx'),
  output: {
    path: resolveApp('dist'),
    filename: 'bundle.js',
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.jsx'],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'assets/[name][ext]'
        }
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: resolveApp('public/index.html'),
    }),
  ],
  devServer: {
    static: {
      directory: resolveApp('public'),
    },
    compress: true,
    port: 3001,
    hot: true,
    onListening: function(devServer) {
      if (!devServer) {
        throw new Error('webpack-dev-server is not defined');
      }
      
      const port = devServer.server.address().port;
      console.log('=====================================');
      console.log('🚗 CAR AND GO Web Frontend');
      console.log(`📍 Running on port: ${port}`);
      console.log(`🌐 Frontend URL: http://localhost:${port}`);
      console.log('=====================================');
    },
  },
};
