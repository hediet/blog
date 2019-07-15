import { computed } from "mobx";
import * as webpack from "webpack";
import { Routes } from "..";
import { HtmlDependencyWebpackPlugin } from "./HtmlDependencyWebpackPlugin";
import { RoutesWithModules } from "./RoutesWithModules";
import HtmlWebpackPlugin = require("html-webpack-plugin");
import TerserJSPlugin = require("terser-webpack-plugin");
import MiniCssExtractPlugin = require("mini-css-extract-plugin");
import OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
import CleanWebpackPlugin = require("clean-webpack-plugin");
import VirtualModulesPlugin = require("webpack-virtual-modules");
import MonacoWebpackPlugin = require("monaco-editor-webpack-plugin");
import { AddVirtualModulesPlugin } from "./AddVirtualModulesPlugin";
import { fromEntries } from "./utils";

export class WebpackConfigBuilder {
    private readonly initialRoutes: Routes;

    @computed
    public get routes(): RoutesWithModules {
        return new RoutesWithModules(this.initialRoutes);
    }

    private readonly outputPath: string;

    constructor(options: { routes: Routes; outputPath: string }) {
        this.initialRoutes = options.routes;
        this.outputPath = options.outputPath;
    }

    buildConfig(): webpack.Configuration {
        return {
            entry: fromEntries(
                this.routes.entries.map(r => [r.id, r.entryModule.id])
            ),
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

    buildRules(): webpack.RuleSetRule[] {
        const cssLoaders: webpack.RuleSetUseItem[] = [
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

    buildPlugins(): webpack.Plugin[] {
        const virtualModules = new VirtualModulesPlugin();
        const addVirtualModulesPlugin = new AddVirtualModulesPlugin(
            virtualModules,
            this.routes
        );

        return [
            virtualModules,
            addVirtualModulesPlugin,
            new MiniCssExtractPlugin({
                filename: "[name].css",
                chunkFilename: "[id].css"
            }),
            new CleanWebpackPlugin.CleanWebpackPlugin(),
            ...this.buildHtmlWebpackPlugins(),
            new HtmlDependencyWebpackPlugin(),
            new MonacoWebpackPlugin()
        ];
    }

    buildHtmlWebpackPlugins(): HtmlWebpackPlugin[] {
        return this.routes.entries.map(
            route =>
                new HtmlWebpackPlugin({
                    entry: route.id,
                    chunksSortMode: "none",
                    filename: "." + route.route.path.toString() + "/index.html",
                    templateContent: route.route.page.getHtmlTemplate()
                })
        );
    }
}
