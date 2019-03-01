const path = require('path')
const CopyPlugin = require('copy-webpack-plugin')
const { VueLoaderPlugin } = require('vue-loader')
module.exports = {

    entry: './core/src/main.js',
    output: {
        filename: './core/public/build/bundle.js'
    },
    resolve: {
        alias: {
            'vue$': 'vue/dist/vue.esm.js'
            // ....
        },
        modules: [
            path.resolve('./core/src'),
            path.resolve('./node_modules')
        ]
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                    'vue-style-loader',
                    'css-loader'
                ]
            }, {
                test: /\.vue$/,
                loader: 'vue-loader',
            },
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /node_modules/
            },
            {
                test: /\.scss$/,
                use: [
                    "style-loader", // creates style nodes from JS strings
                    "css-loader", // translates CSS into CommonJS
                    "sass-loader" // compiles Sass to CSS, using Node Sass by default
                ]
            },
            {
                test: /\.(png|jpg|gif|svg)$/,
                loader: 'file-loader',
                options: {
                    name: '[name].[ext]?[hash]'
                }
            },
            {
                test: /\.(png|woff|woff2|eot|ttf|svg)$/,
                use: [{
                    loader: 'file-loader',
                    options: {
                        name: '[name].[ext]',
                        outputPath: 'core/public/fonts/',
                        publicPath: '/fonts/'
                    }
                }]
            }
        ]
    },
    plugins: [
        new CopyPlugin([
            { from: 'node_modules/@nimiq/core-web/worker.js', to: 'core/public/build/worker.js' },
            { from: 'node_modules/@nimiq/core-web/worker-js.js', to: 'core/public/build/worker-js.js' },
            { from: 'node_modules/@nimiq/core-web/worker-wasm.js', to: 'core/public/build/worker-wasm.js' },
            { from: 'node_modules/@nimiq/core-web/worker-wasm.wasm', to: 'core/public/build/worker-wasm.wasm' },
            { from: 'node_modules/@nimiq/style/nimiq-style.icons.svg', to: 'core/public/img/nimiq-style.icons.svg' },
        ]),
        new VueLoaderPlugin()
    ],
    devServer: {
        port: 3000
    }
}