const path = require('path');
//html-webpack-plugin插件，webpack中生成HTML的插件
const HTMLPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const isDev = 'development';
const VueLoader = require("vue-loader");
const config = require("../config");




const config = {
    entry: path.join(__dirname, '../src/index.js'), // 入口文件 用path.join(__dirname, 'src/index.js')将路径拼接为绝对路径
    mode : 'development',
    output: {
        filename: '[name].js', // 文件输出
        path:config.build.assetsRoot
    },
    resolve: {
        extensions: ['.js', '.vue', '.json'],
        alias: {
          'vue': 'vue/dist/vue.esm.js'
          
        }
      },
    plugins : [
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
                test: /\.css$/, // 处理css文件
                use: [
                    'style-loader',
                    'css-loader'
                ]
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
    }
}

module.exports = config;
