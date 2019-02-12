
const path  = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const VueLoader = require("vue-loader");

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
            'vue': 'vue/dist/vue.esm.js'

        }
    },
    plugins:[
        new HtmlWebpackPlugin({template: path.resolve(__dirname, '../', 'index.html'),})
    ]
};