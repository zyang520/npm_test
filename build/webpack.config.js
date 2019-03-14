const path = require('path');
//html-webpack-plugin插件，webpack中生成HTML的插件
const HTMLPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const isDev = 'development';
const VueLoader = require("vue-loader");
const config = require("../config/index");
const baseWebpackConfig = require('./webpack.base.conf')


const HOST = process.env.HOST;
console.log('----host =======' + JSON.stringify(process.env)+ '---------------------');

function resolve (dir) {
    return path.join(__dirname, '..', dir)
}




module.exports = {
    context: path.resolve(__dirname, '../'),
    entry: path.join(__dirname, '../src/index.js'), // 入口文件 用path.join(__dirname, 'src/index.js')将路径拼接为绝对路径
    mode : 'development',
    devtool: `#eval-source-map`,
    performance:{
        hints:false
    },
    resolve: {
        extensions: ['.js', '.vue', '.json'],
        alias: {
            'vue$': 'vue/dist/vue.esm.js',
            '@': resolve('src')

        }
    },
    plugins : [
        new webpack.DefinePlugin({
            'process.env': require('../config/dev.env')
        }),
        new VueLoader.VueLoaderPlugin(),
        new HTMLPlugin({template: path.resolve(__dirname, '../', 'index.html'),})

    ],
    module: {
        rules: [
            {
                test: /\.vue$/,
                loader: 'vue-loader' // 处理以.vue结尾的文件
            },
            {
                test: /\.js$/,
                loader: 'babel-loader',
                include: [resolve('src'), resolve('test'), resolve('node_modules/webpack-dev-server/client')]
            },
            {
                test: /\.css$/, // 处理css文件
                use: [
                    'style-loader',
                    'css-loader'
                ]
            },
            {
                test: /\.scss$/,
                loader: "style-loader!css-loader!sass-loader"
            },
            {
                test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                loader: 'url-loader'

            },
            {
                test: /\.(gif|jpg|jpeg|png|svg)$/, // 处理图片文件
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 1024,
                            name: '[name].[ext]'
                        }
                    }
                ]
            }
        ]
    },

    node: {
        // prevent webpack from injecting useless setImmediate polyfill because Vue
        // source contains it (although only uses it if it's native).
        setImmediate: false,
        // prevent webpack from injecting mocks to Node native modules
        // that does not make sense for the client
        dgram: 'empty',
        fs: 'empty',
        net: 'empty',
        tls: 'empty',
        child_process: 'empty'
    },
    devServer: {
        contentBase: path.resolve(process.cwd(), `dist`),
        historyApiFallback: true, // 不跳转
        host:'0.0.0.0',
        port: 8680,
        disableHostCheck: true,
        inline: true, // 实时刷新
        progress: true,
        compress: true, // Enable gzip compression for everything served
        overlay: true, // Shows a full-screen overlay in the browser
        stats: `errors-only`, // To show only errors in your bundle
        open: false, // When open is enabled, the dev server will open the browser.
        publicPath: `/`,
        // proxy: {
        //     '/demo': {
        //         target: 'http://192.168.1.121/',
        //         changeOrigin: true,
        //         pathRewrite: {'^/demo': '/'}
        //     }
        // }
    }
}


