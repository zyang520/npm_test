var webpack = require('webpack');
const path  = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const VueLoader = require("vue-loader");
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');


function resolve (dir) {
    return path.join(__dirname, '..', dir)
}

module.exports = {
    mode:'development',
    entry: path.join(__dirname, '../src/index.js'),
    output: {   //打包输出目录
        path: path.join(__dirname, '../dist'), //打包输出路径
        filename: '[name].js'     //打包输出文件名字 name 对应的是 entry 里面的 app
    },
    resolve: {
        extensions: ['.js', '.vue', '.json'],
        alias: {
            'vue': 'vue/dist/vue.esm.js',
            '@': resolve('src')

        }
    },
    module: {
        rules: [
            {
                test: /\.vue$/,
                loader: 'vue-loader' // 处理以.vue结尾的文件
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
    optimization: {
        minimizer: [
            new UglifyJSPlugin({
                uglifyOptions: {
                    output: {
                        comments: false
                    },
                    compress: {
                        warnings: false,
                        drop_debugger: true,
                        drop_console: true
                    }
                }
            }),
        ]
    },
    plugins:[
        new VueLoader.VueLoaderPlugin(),
        new HtmlWebpackPlugin({template: path.resolve(__dirname, '../', 'index.html'),}),
        new webpack.DefinePlugin({
            "process.env":{
                NODE_ENV:JSON.stringify('production')
            }
        })
    ]
};