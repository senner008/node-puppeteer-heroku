const path = require('path');
var WebpackShellPlugin = require('webpack-shell-plugin');

module.exports = env => {

  const isDev = env.development;

  var config = {
    entry: './src/index.ts',
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'bundle.js'
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: 'ts-loader',
          exclude: /node_modules/,
        },
      ],
    },
    plugins : [],
    resolve: {
      extensions: [ '.tsx', '.ts', '.js' ],
    },
    watch: isDev ? true : false,
    node: {
      __dirname: false
    },
    mode : Object.keys(env)[0],
    target: 'node',
    externals: {
      puppeteer: 'require("puppeteer")'
    },
  };

  if (process.env.NODE_ENV !== 'production') {
    console.log("hello")

      config.plugins.push(new WebpackShellPlugin({onBuildEnd: ['nodemon dist/bundle.js ' + (process.argv[4] === "--mock" ? "--mock" : "") ]}));
  }

  return config;
};



