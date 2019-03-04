const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const extractSass = new ExtractTextPlugin("prognosport.css");
const TerserPlugin = require('terser-webpack-plugin');

module.exports = [
{
  entry: {
    main: "./src/js/app.js"
  },
  output: {
    path: path.resolve(__dirname, "dist/js"),
    publicPath: '/js/',
    filename: "prognosport.js"
  },
  plugins: [
    /* use jQuery as Global */
    new webpack.ProvidePlugin({
        jQuery: "jquery",
        $: "jquery",
        'window.jQuery': 'jquery',
        Popper: ['popper.js', 'default'],
		ApexCharts: 'apexcharts',
    })
  ],
  optimization: {
    minimizer: [
      new TerserPlugin({
        cache: true,
      }),
    ],
  },
  resolve: {
    extensions: ['.js']
  }
},
{
  entry: {
    main: "./src/scss/app.scss"
  },
  output: {
    path: path.resolve(__dirname, "dist/css"),
    publicPath: '/css/',
    filename: "prognosport.css"
  },
  module: {
    rules: [
      {
        test: /\.(png|woff|woff2|eot|ttf|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        use: [
          {
            loader: 'url-loader'
          }
        ]
      },
      {
        test: /\.scss$/,
        exclude: /node_modules/,
        use: extractSass.extract({
          fallback: "style-loader",
          use: [
            "css-loader",
            {
              loader: "postcss-loader",
              options: {
                plugins: function () {
                  return [
                    require('precss'),
                    require('autoprefixer')
                  ];
                }
              }
            },
            "sass-loader"]
        })
      }
    ]
  },
  plugins: [
    extractSass,
  ],
  resolve: {
    extensions: ['.css', '.js']
  },
}
];
