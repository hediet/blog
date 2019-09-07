"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const mobx_1 = require("mobx");
const HtmlDependencyWebpackPlugin_1 = require("./HtmlDependencyWebpackPlugin");
const RoutesWithModules_1 = require("./RoutesWithModules");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const TerserJSPlugin = require("terser-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const VirtualModulesPlugin = require("webpack-virtual-modules");
const MonacoWebpackPlugin = require("monaco-editor-webpack-plugin");
const AddVirtualModulesPlugin_1 = require("./AddVirtualModulesPlugin");
const utils_1 = require("./utils");
const AddAssetsPlugin_1 = require("./AddAssetsPlugin");
async function buildWebpackConfig(options) {
    const { site, outputPath } = options;
    const routes = await site.getPages();
    const assets = await site.getStaticFiles();
    const b = new WebpackConfigBuilder({ routes, assets, outputPath });
    return b.buildConfig();
}
exports.buildWebpackConfig = buildWebpackConfig;
class WebpackConfigBuilder {
    constructor(options) {
        this.initialRoutes = options.routes;
        this.outputPath = options.outputPath;
        this.assets = options.assets;
    }
    get routes() {
        return new RoutesWithModules_1.RoutesWithModules(this.initialRoutes);
    }
    buildConfig() {
        return {
            entry: utils_1.fromEntries(this.routes.entries.map(r => [r.id, r.entryModule.id])),
            output: {
                path: this.outputPath,
                filename: false ? "[name]-[contenthash].js" : "[name].js",
                chunkFilename: false ? "[name]-[contenthash].js" : "[name].js",
                publicPath: "/"
            },
            // mode: "production",
            optimization: {
                // minimize: true,
                minimizer: [
                    new TerserJSPlugin({}),
                    new OptimizeCSSAssetsPlugin({})
                ]
                /*splitChunks: {
                    chunks: "all",
                    minSize: 100
                }*/
            },
            resolve: {
                extensions: [".webpack.js", ".web.js", ".ts", ".tsx", ".js"]
            },
            devtool: "source-map",
            module: {
                rules: this.buildRules()
            },
            plugins: this.buildPlugins()
        };
    }
    buildRules() {
        const cssLoaders = [
            { loader: "style-loader", options: { singleton: true } },
            /*{
                loader: MiniCssExtractPlugin.loader,
                options: {
                    hmr: process.env.NODE_ENV === "development"
                }
            },*/
            "css-loader"
        ];
        return [
            {
                test: /\.css$/,
                use: cssLoaders
            },
            {
                test: /\.scss$/,
                use: [...cssLoaders, "sass-loader"]
            },
            {
                test: /\.(jpe?g|png|gif|eot|ttf|svg|woff|woff2)$/i,
                loader: "file-loader"
            },
            {
                test: /\.(md)$/i,
                loader: "raw-loader"
            },
            {
                test: /\.tsx?$/,
                loader: "ts-loader",
                options: { transpileOnly: true }
            }
        ];
    }
    buildPlugins() {
        const virtualModules = new VirtualModulesPlugin();
        const addVirtualModulesPlugin = new AddVirtualModulesPlugin_1.AddVirtualModulesPlugin(virtualModules, this.routes);
        return [
            virtualModules,
            addVirtualModulesPlugin,
            new MiniCssExtractPlugin({
                filename: "[name].css",
                chunkFilename: "[id].css"
            }),
            new AddAssetsPlugin_1.AddAssetPlugin(this.assets),
            new CleanWebpackPlugin.CleanWebpackPlugin(),
            ...this.buildHtmlWebpackPlugins(),
            new HtmlDependencyWebpackPlugin_1.HtmlDependencyWebpackPlugin(),
            new MonacoWebpackPlugin()
        ];
    }
    buildHtmlWebpackPlugins() {
        return this.routes.entries.map(route => new HtmlWebpackPlugin({
            entry: route.id,
            chunksSortMode: "none",
            filename: "." + route.route.path.toString() + "/index.html",
            templateContent: route.route.page.getHtmlTemplate(route.route.path)
        }));
    }
}
__decorate([
    mobx_1.computed
], WebpackConfigBuilder.prototype, "routes", null);
//# sourceMappingURL=WebpackConfigBuilder.js.map