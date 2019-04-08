var webpack = require('webpack');
const path  = require('path');
const config = require('../config');
const glob = require('glob');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const VueLoader = require("vue-loader");
const UglifyjsWebpackPlugin = require('uglifyjs-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const MiniCssExtractPlugin = require(`mini-css-extract-plugin`);
const PurifyCSSPlugin = require('purifycss-webpack');
const CleanWebpackPlugin = require(`clean-webpack-plugin`);


function resolve (dir) {
    return path.join(__dirname, '..', dir)
}

module.exports = {
    mode:'production',
    entry: path.join(__dirname, '../src/index.js'),
    output: {   //打包输出目录
        path: path.join(__dirname, '../dist'), //打包输出路径
        filename: 'js/[name].[chunkhash:8].js',
        chunkFilename: 'js/[name].[chunkhash:8].chunk.js'
    },
    optimization: {
        runtimeChunk: {
            name: `manifest`
        },
        minimizer: [
            new OptimizeCssAssetsPlugin({
                assetNameRegExp: /\.css$/g,
                cssProcessorOptions: {
                safe: true,
                autoprefixer: { disable: true }, 
                mergeLonghand: false,
                discardComments: {
                    removeAll: true // 移除注释
                }
                },
                canPrint: true
            }),
            new UglifyjsWebpackPlugin({
                exclude: /\.min\.js$/,
                cache: true,
                parallel: true,  // 开启并行压缩，充分利用CPU
                sourceMap: false,
                extractComments : false,   //移除注释
                uglifyOptions : {
                    compress : {
                        unused : true,
                        warnings : false,
                        drop_debugger : true
                    },
                    output : {
                        comments : false
                    }
                }
            })
            
        ],
        noEmitOnErrors: true,  //编译错误时，是否不生成资源
        splitChunks: {  //根据不同的策略，分割打包出来的bundle
            chunks: `all`, // 必须三选一： "initial" | "all" | "async"
            minSize: 20000, // 最小尺寸
            minChunks: 2, // must be greater than or equal 2. The minimum number of chunks which need to contain a module before it's moved into the commons chunk.
            maxAsyncRequests: 5, // 最大异步请求数
            maxInitialRequests: 3, // 最大初始化请求数
            name: true, // 名称，此选项可接收 function
            cacheGroups: {
                vendor: { 
                    chunks: `all`, // all-异步加载快，但初始下载量较大，文件共用性好； initial-初始下载量较小，但异步加载量较大，文件间有重复内容
                    priority: -10,
                    reuseExistingChunk: false, // 选项用于配置在模块完全匹配时重用已有的块，而不是创建新块
                    test: /[\\/]node_modules[\\/]/
                },
                common: { // key 为entry中定义的 入口名称
                    chunks: `all`, // all-异步加载快，但初始下载量较大，文件共用性好； initial-初始下载量较小，但异步加载量较大，文件间有重复内容
                    priority: -20,
                    reuseExistingChunk: false, // 选项用于配置在模块完全匹配时重用已有的块，而不是创建新块
                    test: /[\\/]src[\\/]/
                }
            }
        }
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
                test: /\.js$/,
                loader: `babel-loader`,
                include: [resolve('src'), resolve('test'), resolve('node_modules/webpack-dev-server/client')] 
            },
            {
                test: /\.vue$/,
                loader: 'vue-loader' // 处理以.vue结尾的文件
            },
            {
                test: /\.css$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    "css-loader"
                ]
            },
            {
                test: /\.scss$/,
                loader: "style-loader!css-loader!sass-loader"
            },
            {
                test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    limit: 3000,
                    name: 'media/[name].[hash:7].[ext]'
                  }

            },
            {
                test: /\.(png|jpe?g|gif|svg|webp)(\?.*)?$/,
                use : [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 300,
                            name: 'image/[name].[hash:7].[ext]'
                        }
                    },
                    {
                        loader: `imagemin-loader`,
                        options: {
                            plugins: [
                                {
                                    use: `imagemin-pngquant`
                                },
                                {
                                    use: `imagemin-mozjpeg`
                                }
                            ]
                            }
                        }
                ] 
            }
        ]
    },
    plugins:[
        new VueLoader.VueLoaderPlugin(),
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, '../', 'index.html'),
            inject: true,
            minify: {
                removeComments: true,
                collapseWhitespace: true,
                removeAttributeQuotes: true
            },
            chunksSortMode: 'dependency'
        }),
        new webpack.DefinePlugin({
            'process.env': require('../config/prod.env')
        }),
        new webpack.HashedModuleIdsPlugin(),
        new webpack.optimize.ModuleConcatenationPlugin(),
        new MiniCssExtractPlugin({
            filename:  `css/[name].[contenthash:8].css`,
            chunkFilename:  `css/[name].[contenthash:8].css`
        }),
        new PurifyCSSPlugin({
            paths: glob.sync(path.join(__dirname, './*.html')),
        }),
        new CleanWebpackPlugin({
            // 根目录
            root: process.cwd(),
            // 排除不想删除的文件
            exclude: [`favicon.ico`],
            // 开启在控制台输出信息
            verbose: true,
            // 启用删除文件
            dry: false
        })
        
    ]
};