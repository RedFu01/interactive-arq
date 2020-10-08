const path = require('path');
const webpack = require('webpack');
const autoprefixer = require('autoprefixer');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const NODE_ENV = process.env.NODE_ENV || 'development';

const entry = {
    index: './src/App.js'
};

const webpackModule = {
    rules: [
        {
            test: /\.js$/,
            exclude: path.resolve(__dirname, 'node_modules'),
            use: 'babel-loader'
        },
        {
            test: /\.(jpe?g|png|gif|eot|woff|woff2|svg|ttf)$/,
            loader: 'file-loader'
        },
        {
            test: [/\.scss$/, /\.css$/],
            use: ExtractTextPlugin.extract({
                fallback: 'style-loader',
                use: [
                    'css-loader',
                    'sass-loader',
                    {
                        loader: 'postcss-loader',
                        options: {
                            plugins: () => [
                                autoprefixer
                            ]
                        }
                    }
                ]
            })
        }
    ]
};

const webpackPlugins = [
    new ExtractTextPlugin('bundle.css'),
    new HtmlWebpackPlugin({
        template: 'index.html',
        inject: true,
        minify: {
            minifyCSS: true,
            minifyJS: true
        }
    }),
    // new CopyWebpackPlugin([{
    //     from: './assets/*'
    // }]),
    // new CopyWebpackPlugin([
    //     {
    //         from: './robots.txt'
    //     },
    //     {
    //         from: './imprint.html'
    //     },
    //     {
    //         from: './data-policy.html'
    //     }
    // ]),
    // new FaviconsWebpackPlugin({
    //     logo: './src/assets/happycar-512x512.png',
    //     prefix: 'icons/',
    //     backgroundd: '#0067b3',
    //     title: 'HAPPYCAR | Booking Management'
    // }),
    // new webpack.DefinePlugin({
    //     'process.env': {
    //         API_ENDPOINT: JSON.stringify(API_ENDPOINT)
    //     }
    // })
];

if (NODE_ENV === 'production') {
    // webpackModule.rules.push({
    //     enforce: 'pre',
    //     test: /\.js$/,
    //     exclude: path.resolve(__dirname, 'node_modules'),
    //     loader: 'eslint-loader'
    // });
    webpackPlugins.push(
        new webpack.NoEmitOnErrorsPlugin(),
        new webpack.optimize.ModuleConcatenationPlugin(),
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            },
            comments: false
        })
    );
}

module.exports = {
    entry,
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js',
        publicPath: '/'
    },
    devServer: {
        contentBase: path.join(__dirname, 'dist'),
        historyApiFallback: {
            index: '/index.html',
            disableDotRule: true
        },
        compress: true
    },
    module: webpackModule,
    plugins: webpackPlugins,
    devtool: NODE_ENV === 'development' ? '#cheap-module-eval-source-map' : false
};
