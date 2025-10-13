const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const fs = require('fs');

// Get the current working directory
const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = (relativePath) => path.resolve(appDirectory, relativePath);

// Try to read the HTML template, if not found, use inline template
let htmlTemplate;
const htmlPath = resolveApp('public/index.html');
if (fs.existsSync(htmlPath)) {
  htmlTemplate = htmlPath;
} else {
  // Fallback: use inline HTML template
  htmlTemplate = path.join(__dirname, 'public/index.html');
}

module.exports = {
  entry: resolveApp('src/index.tsx'),
  output: {
    path: resolveApp('dist'),
    filename: '[name].[contenthash].js',
    chunkFilename: '[name].[contenthash].chunk.js',
    clean: true,
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.jsx'],
  },
  optimization: {
    minimize: true,
    usedExports: true,
    sideEffects: false,
    splitChunks: {
      chunks: 'all',
      maxInitialRequests: 25,
      minSize: 20000,
      cacheGroups: {
        default: false,
        vendors: false,
        vendor: {
          name: 'vendor',
          chunks: 'all',
          test: /[\\/]node_modules[\\/]/,
          priority: 20,
        },
        common: {
          name: 'common',
          minChunks: 2,
          chunks: 'all',
          priority: 10,
          reuseExistingChunk: true,
          enforce: true,
        },
      },
    },
  },
  performance: {
    hints: false,
    maxEntrypointSize: 512000,
    maxAssetSize: 512000,
  },
  cache: {
    type: 'filesystem',
    buildDependencies: {
      config: [__filename],
    },
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: {
          loader: 'ts-loader',
          options: {
            transpileOnly: true,
            experimentalWatchApi: true,
          },
        },
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
      template: htmlTemplate,
      templateContent: `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="icon" type="image/svg+xml" href="/logo.svg">
    <title>CAR AND GO - Plataforma de Aluguel de Carros</title>
    <style>
        body {
            margin: 0;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
                'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
                sans-serif;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
        }
        
        #root {
            min-height: 100vh;
        }
    </style>
</head>
<body>
    <div id="root"></div>
</body>
</html>
      `,
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
