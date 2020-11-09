const CompressionPlugin = require('compression-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ContextReplacementPlugin = require('webpack/lib/ContextReplacementPlugin')
const path = require('path')
const _ = require('lodash')
const webpack = require('webpack')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
  .BundleAnalyzerPlugin

const BUILD_DIR = path.resolve(__dirname, './dist')
const SRC_DIR = path.resolve(__dirname, './src')
const PRODUCTION = process.env.NODE_ENV === 'production'
const VISUALIZE = process.env.visualization === 'true'
console.log(
  'Running webpack in mode:' +
    process.env.NODE_ENV +
    ' visualization:' +
    VISUALIZE
)

const extractSCSS = new ExtractTextPlugin('css/style.[contenthash:10].css')
const extractLESS = new ExtractTextPlugin('css/antd.[contenthash:10].css')

const usedEnvKeys = [
  'GA_CODE',
  'GA_ENABLED',
  'FACULTY',
  'UPLOAD_PATH',
  'PROFILE_PIC_MAX_SIZE_IN_MB'
]

const isExternal = function (module) {
  var context = module.context
  if (typeof context !== 'string') {
    return false
  }
  return context.indexOf('node_modules') !== -1
}

// ANTD
// lessToJs does not support @icon-url: "some-string", so we are manually adding it to the produced themeVariables js object here
// downloaded from https://github.com/ant-design/antd-init/tree/master/examples/local-iconfont/iconfont
const fs = require('fs')
const lessToJs = require('less-vars-to-js')
const themeVariables = lessToJs(
  fs.readFileSync(SRC_DIR + '/styles/antd/ant-default-vars.less', 'utf8')
)
themeVariables['@icon-url'] = '\'/fonts/iconfont\''

const plugins = [
  VISUALIZE
    ? new BundleAnalyzerPlugin({
      analyzerMode: 'static'
    })
    : null,
  extractSCSS,
  extractLESS,
  // TODO merge css files via merge-files-webpack-plugin
  new webpack.optimize.CommonsChunkPlugin({
    name: 'vendors',
    minChunks: function (module) {
      return isExternal(module)
    }
  }),
  new webpack.DefinePlugin({
    process: {
      env: _.zipObject(usedEnvKeys, _.map(usedEnvKeys, key => JSON.stringify(process.env[key])))
    }
  }),
  new webpack.optimize.CommonsChunkPlugin({
    name: 'manifest'
  }),
  new HtmlWebpackPlugin({
    // hash: DEVELOPMENT ? true : false, // if needed to force remove caching issues while in dev
    template: SRC_DIR + '/index.html',
    minify: {
      collapseWhitespace: !!PRODUCTION // this is for minifying HTML in PRODUCTION
    }
  }),
  PRODUCTION
    ? (new webpack.optimize.UglifyJsPlugin({
      comments: false,
      compress: {
        warnings: false,
        drop_console: true
      },
      minimize: true,
      sourceMap: true
    }),
      new CompressionPlugin({
        asset: '[path].gz[query]',
        algorithm: 'gzip',
        test: /\.js$|\.css$|\.html$/,
        threshold: 10240, // only if file size > 10.24 kb
        minRatio: 0.8
      }),
      new ContextReplacementPlugin(/moment[/\\]locale$/, /et/)
    )
    : null
].filter(p => p)

const rules = [
  {
    test: /\.jsx?$/,
    exclude: /node_modules/,
    use: {
      loader: 'babel-loader',
      options: {
        presets: ['latest', 'react', 'stage-0'],
        plugins: [
          'transform-object-rest-spread',
          'transform-do-expressions',
          ['import', { libraryName: 'antd', style: true }]
        ]
      }
    }
  },
  {
    test: /media\/(background|brand|personal)\/([^/]*)\.(jpe?g|png|gif|svg)$/i,
    use: [
      {
        loader: 'url-loader',
        options: { limit: 1024, name: 'media/[hash:10].[ext]' } // embed images size < 10kb
      }
    ]
  },
  {
    test: /media\/favicons\/([^/]*)\.(png|svg|ico|json|xml)$/i,
    use: [
      {
        loader: 'url-loader',
        options: { limit: 1, name: '[name].[ext]' } // // do not embed favicons > 1b
      }
    ]
  },
  {
    test: /fonts\/([^/]*)\.(woff|woff2|eot|ttf|svg)$/,
    use: [
      {
        loader: 'url-loader',
        options: { limit: 1, name: 'fonts/[name].[ext]' } // do not embed fonts > 1b
      }
    ]
  },
  // TODO add autoprefixer like autoprefixer?browsers=last 2 version
  {
    test: /\.scss$/,
    use: extractSCSS.extract({
      fallback: 'style-loader',
      use: [
        { loader: 'css-loader', options: { sourceMap: true } },
        { loader: 'sass-loader', options: { sourceMap: true } }
      ]
    })
  },
  {
    // FOR ANTD1
    test: /\.less$/,
    use: extractLESS.extract({
      fallback: 'style-loader',
      use: [
        { loader: 'css-loader', options: { sourceMap: true } },
        {
          loader: 'less-loader',
          options: {
            sourceMap: true,
            modifyVars: themeVariables
          }
        }
      ]
    })
  }
]

module.exports = {
  devtool: 'source-map',
  stats: 'normal',
  entry: {
    app: [SRC_DIR + '/index.jsx']
  },
  plugins: plugins,
  module: {
    rules
  },
  resolve: {
    extensions: ['.js', '.jsx']
  },
  output: {
    path: BUILD_DIR,
    publicPath: PRODUCTION ? '/' : '/',
    filename: PRODUCTION ? 'js/[name].[chunkhash].js' : 'js/[name].js',
    chunkFilename: '[chunkhash].js'
  },
  devServer: {
    // host: 'localhost',
    port: 3446, // preferred port
    contentBase: BUILD_DIR,
    compress: true,
    historyApiFallback: true,
    hot: true,
    inline: true,
    noInfo: true,
    watchOptions: { poll: true }
  }
}
