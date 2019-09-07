"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const TerserJSPlugin = require("terser-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const VirtualModulesPlugin = require("webpack-virtual-modules");
const page_1 = require("../page");
const MonacoWebpackPlugin = require("monaco-editor-webpack-plugin");
const mobx_1 = require("mobx");
const serializeData_1 = require("./serializeData");
const HtmlDependencyWebpackPlugin_1 = require("./Webpack/HtmlDependencyWebpackPlugin");
const r = (file) => path.resolve(__dirname, file);
class AddVirtualModulesPlugin {
    constructor(virtualModules, routes) {
        this.virtualModules = virtualModules;
        this.routes = routes;
        this.initialized = false;
    }
    init() {
        if (this.initialized) {
            return;
        }
        this.initialized = true;
        const lastEntries = new Map();
        mobx_1.autorun(() => {
            const writeModule = (m) => {
                const v = lastEntries.get(m.id);
                if (v !== m.content) {
                    lastEntries.set(m.id, m.content);
                    console.log("updating ", m.id, m.content);
                    this.virtualModules.writeModule(m.id, m.content);
                }
            };
            writeModule(this.routes.indexModule);
            for (const route of this.routes.entries) {
                writeModule({
                    id: route.dataModuleId,
                    content: route.getDataModuleContent(this.routes)
                });
                writeModule(route.pageModule);
                writeModule(route.entryModule);
            }
        });
    }
    apply(compiler) {
        compiler.hooks.compilation.tap(Object.getPrototypeOf(this).constructor.name, () => this.init());
    }
}
function formatFilename(name) {
    return JSON.stringify(name);
}
function requireModule(name) {
    return `require(${formatFilename(name)})`;
}
function importModule(name) {
    return `import(${formatFilename(name)})`;
}
function classExpression(clazz) {
    return `(${requireModule(clazz.moduleId)}[${JSON.stringify(clazz.exportName)}])`;
}
exports.classExpression = classExpression;
class RoutesWithModules {
    constructor(routes) {
        this.routes = routes;
    }
    get entries() {
        return this.routes.routes.map(r => new RouteWithModules(r));
    }
    getRouteData(path) {
        return this.entries.find(d => d.route.path.toString() === path.toString());
    }
    runtimeRouteIndexExpression() {
        return `new ${classExpression(page_1.DynamicRouteIndexProvider)}(() => ${importModule(this.indexModuleId)})`;
    }
    get indexModuleId() {
        return r("routeIndex.js");
    }
    get indexModule() {
        return {
            id: this.indexModuleId,
            content: `
module.exports = {
    ${this.entries
                .map(e => `${JSON.stringify(e.route.path.toString())}: () => ${e.importPageExpression}`)
                .join(",")}
};`
        };
    }
}
__decorate([
    mobx_1.computed
], RoutesWithModules.prototype, "entries", null);
__decorate([
    mobx_1.computed
], RoutesWithModules.prototype, "indexModule", null);
exports.RoutesWithModules = RoutesWithModules;
class RouteWithModules {
    constructor(route) {
        this.route = route;
    }
    runtimeRouteRefExpression() {
        return `new (${requireModule(page_1.RuntimeRouteRef.moduleId)}[${JSON.stringify(page_1.RuntimeRouteRef.exportName)}])(${serializeData_1.serializeData(this.route.path.parts, null)}, () => ${this.importPageExpression})`;
    }
    get importPageExpression() {
        return `${importModule(this.pageModule.id)}.then(x => x.page)`;
    }
    get requirePageExpression() {
        return `${requireModule(this.pageModule.id)}.page`;
    }
    get id() {
        if (this.route.path.parts.length === 0) {
            return "index";
        }
        return this.route.path.parts.join(".");
    }
    get entryModule() {
        return {
            id: r(this.id + ".entry.js"),
            content: `
            let page = ${this.requirePageExpression};
            page.load(${this.runtimeRouteRefExpression()});
            `
        };
    }
    get dataModuleId() {
        return r(this.id + ".data.js");
    }
    getDataModuleContent(routes) {
        const page = this.route.page;
        return `module.exports.data = ${serializeData_1.serializeData(page.data, routes)};`;
    }
    get pageModule() {
        const page = this.route.page;
        return {
            id: r(this.id + ".page.js"),
            content: `
            const pageModule = ${requireModule(page.moduleFilename)};
            const data = ${requireModule(this.dataModuleId)}.data;
            const page = new pageModule[${JSON.stringify(page.exportName)}](data);
            if (module.hot) {
                module.hot.accept(${JSON.stringify(this.dataModuleId)}, () => {
                    const newData = ${requireModule(this.dataModuleId)}.data;
                    page.updateData(newData);
                });
            }
            module.exports.page = page`
        };
    }
}
function fromEntries(entries) {
    return [...entries].reduce((obj, { 0: key, 1: val }) => Object.assign(obj, { [key]: val }), {});
}
class WebpackConfigBuilder {
    constructor(options) {
        this.initialRoutes = options.routes;
        this.outputPath = options.outputPath;
    }
    get routes() {
        return new RoutesWithModules(this.initialRoutes);
    }
    buildConfig() {
        return {
            entry: fromEntries(this.routes.entries.map(r => [r.id, r.entryModule.id])),
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
        const addVirtualModulesPlugin = new AddVirtualModulesPlugin(virtualModules, this.routes);
        return [
            virtualModules,
            addVirtualModulesPlugin,
            new MiniCssExtractPlugin({
                filename: "[name].css",
                chunkFilename: "[id].css"
            }),
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
            templateContent: route.route.page.getHtmlTemplate()
        }));
    }
}
__decorate([
    mobx_1.computed
], WebpackConfigBuilder.prototype, "routes", null);
exports.WebpackConfigBuilder = WebpackConfigBuilder;
//# sourceMappingURL=WebpackConfigBuilder.js.map