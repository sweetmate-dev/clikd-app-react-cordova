const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const autoprefixer = require('autoprefixer');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

const env = process.env.NODE_ENV || 'staging';

var workerLoader = 'worker';
if (process.env.PLATFORM == 'IOS') {
  workerLoader += '?inline=true&fallback=false';
}

console.log(process.env.PLATFORM, workerLoader);

/* Set up environment specific constants, accessible from within the application
through the process.env global */

const globals = require('./config/config.' + env);
const definitions = {
  NODE_ENV: JSON.stringify(env),
}
for(var key in globals){
  definitions[key] = JSON.stringify(globals[key])
}

const config = {
  context: __dirname,
  resolve: {
    alias: {
      '@assets': path.resolve(__dirname, "app", "assets"),
      '^': path.resolve(__dirname, "app"),
      'randombytes': '^/workers/randombytes',
    },

  },
  entry: [
      './app/Clikd.js'
  ],
  output: {
    path: path.join(__dirname, 'www'),
    filename: 'bundle-[hash:6].js',
    publicPath: '',
  },
  module: {
    loaders: [{ 
        test: /(\.js|\.jsx)$/,
        exclude: /node_modules/,
        loader: 'babel',
        query: { 
          presets: ['env', 'stage-0', 'react'],
          plugins: ['transform-decorators-legacy', 'jsx-control-statements']

        }
      },{
        test: /\.(png|jpg|gif|svg)$/,
        loader: "file-loader?name=img-[hash:6].[ext]",
        exclude: path.resolve(__dirname, 'app', 'assets', 'icons'),  
      }, {
        test: /\.(|eot|ttf|woff)$/,
        loader: "file-loader?name=font-[hash:6].[ext]"
      }, {
        test: /\.svg$/, 
        include: path.resolve(__dirname, 'app', 'assets', 'icons'),  
        loader: 'svg-inline?classPrefix' 
      }, {
        test: /ChatWorker\.js$/,
        include: path.resolve(__dirname, 'app', 'workers'),
        loaders: [workerLoader, 'babel?presets[]=env&presets[]=stage-0']
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(['www'], {
      exclude: ['.gitignore'],
    }),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: path.resolve(__dirname, 'app', 'assets', 'index.tpl.html')
    }),
    new webpack.NoErrorsPlugin(),
    new webpack.DefinePlugin({
      'process.env': definitions,
    })
  ],
  sassLoader: {
    includePaths: [path.resolve(__dirname, "app", "assets", "scss")]
  },
  postcss: function () {
    return [autoprefixer({browsers: ['ios > 7', 'last 2 ChromeAndroid versions']})];
  }
};


if (process.env.TARGET === 'release') {

  /* Minify and compress assets for release */

  config.module.loaders.push({
    test: /(\.scss|\.css)$/,
    loader: ExtractTextPlugin.extract('style', ['css', 'sass', 'postcss'])
  });

  config.plugins.push(new webpack.optimize.OccurrenceOrderPlugin());
  config.plugins.push(new ExtractTextPlugin('bundle-[hash:6].css', { allChunks: true }));
  config.plugins.push(new webpack.optimize.UglifyJsPlugin());

} else {

  config.devtool = 'inline-source-map';

  config.module.loaders.push({
    test: /(\.scss|\.css)$/,
    loaders: ['style', 'css', 'sass', 'postcss']
  });

}

module.exports = config;
