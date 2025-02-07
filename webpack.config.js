import path from 'path';
import { fileURLToPath } from 'url';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import TerserPlugin from 'terser-webpack-plugin';

// Convert `import.meta.url` to `__dirname` for ESM compatibility.
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default {
  mode: 'none', // No forced mode, it will be controlled by scripts
  entry: {
    'flextimer': './src/index.js', // ES6+ Standard Version
    'flextimer.min': './src/index.js', // Minified ES6+ Version
    'flextimer.es5': './src/versions/es5.js', // ES5 + UMD Version
    'flextimer.node': './src/versions/node.js', // CommonJS (Node.js) Version
    'flextimer.esm': './src/versions/esm.js', // ESM (ES Modules) Version
    'flextimer.cdn': './src/versions/cdn.js', // Optimized for CDN
    'flextimer.cdn.min': './src/versions/cdn.js', // Minified CDN Version
    'jquery.flextimer': './src/versions/jquery.js', // jQuery Plugin
    //'flextimer.react': './src/versions/react.js', // React Component
    //'flextimer.vue': './src/versions/vue.js', // Vue Component
    //'flextimer.angular': './src/versions/angular.js', // Angular Component
    //'flextimer.next': './src/versions/next.js', // Next.js Version
    //'flextimer.svelte': './src/versions/svelte.js', // Svelte Version
    //'flextimer.solid': './src/versions/solid.js', // Solid.js Version
    //'flextimer.preact': './src/versions/preact.js', // Preact Version
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js', // Dynamic filename based on entry key
    library: 'FlexTimer',
    libraryTarget: 'umd',
    globalObject: 'this', // Ensures compatibility in all environments
    libraryExport: 'default',
    iife: true,
  },
  devtool: 'source-map', // Source maps enabled for debugging
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              [
                '@babel/preset-env',
                {
                  targets: '> 0.25%, not dead',
                },
              ],
            ],
          },
        },
      },
      {
        test: /\.css$/i,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.css'],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name].css', // Dynamic filename for styles
    }),
  ],
  optimization: {
    minimizer: [
      new TerserPlugin({
        test: /\.min\.js$/, // Only minify files ending in .min.js
        terserOptions: {
          keep_classnames: true, // Preserve class names
          keep_fnames: true, // Preserve function names
        },
      }),
    ],
  },
  experiments: {
    outputModule: true, // Enables support for ES Modules in Webpack 5+
  },
};
