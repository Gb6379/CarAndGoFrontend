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
  devtool: false, // Disable source maps to save memory
  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.jsx'],
  },
  optimization: {
    minimize: false, // Disable minification to reduce memory usage
    usedExports: false, // Disable to save memory
    sideEffects: false,
    moduleIds: 'natural',
    runtimeChunk: false, // Disable runtime chunk
    splitChunks: false, // Disable code splitting to save memory
  },
  performance: {
    hints: false,
    maxEntrypointSize: 512000,
    maxAssetSize: 512000,
  },
  cache: false, // Disable filesystem cache to save memory
  ignoreWarnings: [
    // react-datepicker usa require dinâmico para locales do date-fns; aviso inofensivo
    { module: /node_modules\/react-datepicker\/dist\/index\.es\.js/, message: /Critical dependency: the request of a dependency is an expression/ },
  ],
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
    historyApiFallback: true,
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
