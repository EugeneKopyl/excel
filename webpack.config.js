const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack')
const CopyPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');

module.exports = (env, argv) => {
    const isProd = argv.mode === 'production'
    const isDev = !isProd
    process.env.NODE_ENV = argv.mode
    const fileName = (ext) => isProd ? `[name].[contenthash].bundle.${ext}` :`[name].bundle.${ext}`
    const plugins = () => {
        const base = [
            new HtmlWebpackPlugin({
                template: './index.html'
            }),
            new CopyPlugin({
                patterns: [
                    {
                        from: path.resolve(__dirname, 'src', 'favicon.ico'),
                        to: path.resolve(__dirname, 'dist')},
                ],
            }),
            new MiniCssExtractPlugin({
                filename: fileName('css')
            }),
            new webpack.DefinePlugin({
                'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
            })
        ]
        if (isDev) {
            base.push(new ESLintPlugin({}))
        }
        return base
    }
    return {
        target: 'web',
        context: path.resolve(__dirname, 'src'),
        entry: {
            main: ['@babel/polyfill', './index.js']
        },
        output: {
            path: path.resolve(__dirname, 'dist'),
            filename: fileName('js'),
            clean: true,
        },
        resolve: {
            extensions: ['.js'],
            alias: {
                '@': path.resolve(__dirname, 'src'),
                '@core': path.resolve(__dirname, 'src', 'core')
            }
        },
        devServer: {
            port: 3500,
            open: true,
            // hot: true,
            watchContentBase: true,
            liveReload: true,
        },
        devtool: isDev ? 'source-map' : false,
        plugins: plugins(),
        module: {
            rules: [
                {
                    test: /\.s[ac]ss$/i,
                    use: [
                        MiniCssExtractPlugin.loader,
                        'css-loader',
                        'sass-loader',
                    ],
                },
                {
                    test: /\.m?js$/,
                    exclude: /node_modules/,
                    use: {
                        loader: 'babel-loader',
                        options: {
                            presets: ['@babel/preset-env']
                        }
                    }
                },
            ],
        },
    }
}
