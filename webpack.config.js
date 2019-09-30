const path = require('path');


module.exports = env => {

  const isDev = env.development;

  return {
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
};