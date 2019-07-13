import * as webpack from "webpack";
import path = require("path");
import HtmlWebpackPlugin = require("html-webpack-plugin");
import TerserJSPlugin = require("terser-webpack-plugin");
import MiniCssExtractPlugin = require("mini-css-extract-plugin");
import OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
import CleanWebpackPlugin = require("clean-webpack-plugin");
import VirtualModulesPlugin = require("webpack-virtual-modules");
import { WebsiteContentProvider, Route, Routes } from ".";
import {
    RouteRef,
    RuntimeRouteRef,
    RouteIndexProvider,
    DynamicRouteIndexProvider
} from "../page";
import { Path } from "../path";
import MonacoWebpackPlugin = require("monaco-editor-webpack-plugin");
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { autorun, computed } from "mobx";
import { Data } from "../Data";
import { serializeData } from "./serializeData";

const r = (file: string) => path.resolve(__dirname, file);

class HtmlDependencyWebpackPlugin {
    apply(compiler: any) {
        compiler.plugin(
            "compilation",
            (compilation: webpack.compilation.Compilation) => {
                compilation.plugin(
                    "html-webpack-plugin-alter-chunks",
                    (chunks: any, init: any) => {
                        const stats = compilation.getStats().toJson();
                        const allChunks = stats.chunks!;
                        const entrypoint = init.plugin.options.entry;
                        const entry = stats.entrypoints![entrypoint];

                        if (!entry) {
                            throw new Error(
                                `Entry ${entrypoint} does not exist.`
                            );
                        }
                        return entry.chunks.map((chunkId: number | number) => {
                            let c = allChunks[chunkId];
                            if (!c) {
                                c = allChunks.find(c => c.id === chunkId)!;
                            }
                            if (!c) {
                                throw new Error(
                                    `Did not find chunk "${chunkId}"!`
                                );
                            }
                            return c;
                        });
                    }
                );
            }
        );
    }
}

class AddVirtualModules {
    constructor(
        private readonly virtualModules: VirtualModulesPlugin,
        private readonly routes: DetailedRoutes
    ) {}

    private initialized = false;

    init() {
        if (this.initialized) {
            return;
        }
        this.initialized = true;

        const lastEntries = new Map<string, string>();
        autorun(() => {
            const writeModule = (m: IModule) => {
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

    apply(compiler: webpack.Compiler) {
        compiler.hooks.compilation.tap(
            Object.getPrototypeOf(this).constructor.name,
            () => this.init()
        );
    }
}

interface IModule {
    id: string;
    content: string;
}

function formatFilename(name: string): string {
    return JSON.stringify(name);
}

function requireModule(name: string): string {
    return `require(${formatFilename(name)})`;
}
function importModule(name: string): string {
    return `import(${formatFilename(name)})`;
}

export function classExpression(clazz: {
    moduleId: string;
    exportName: string;
}): string {
    return `(${requireModule(clazz.moduleId)}[${JSON.stringify(
        clazz.exportName
    )}])`;
}

export class DetailedRoutes {
    @computed
    public get entries(): RouteData[] {
        return this.routes.routes.map(r => new RouteData(r));
    }

    constructor(private readonly routes: Routes) {}

    public getRouteData(path: Path): RouteData | undefined {
        return this.entries.find(
            d => d.route.path.toString() === path.toString()
        );
    }

    public runtimeRouteIndexExpression(): string {
        return `new ${classExpression(
            DynamicRouteIndexProvider
        )}(() => ${importModule(this.indexModuleId)})`;
    }

    public get indexModuleId(): string {
        return r("routeIndex.js");
    }

    @computed
    public get indexModule(): IModule {
        return {
            id: this.indexModuleId,
            content: `
module.exports = {
    ${this.entries
        .map(
            e =>
                `${JSON.stringify(e.route.path.toString())}: () => ${
                    e.importPageExpression
                }`
        )
        .join(",")}
};`
        };
    }
}

class RouteData {
    constructor(public readonly route: Route) {}

    public runtimeRouteRefExpression(): string {
        return `new (${requireModule(
            RuntimeRouteRef.moduleId
        )}[${JSON.stringify(RuntimeRouteRef.exportName)}])(${serializeData(
            this.route.path.parts,
            null
        )}, () => ${this.importPageExpression})`;
    }

    public get importPageExpression(): string {
        return `${importModule(this.pageModule.id)}.then(x => x.page)`;
    }

    public get requirePageExpression(): string {
        return `${requireModule(this.pageModule.id)}.page`;
    }

    public get id(): string {
        if (this.route.path.parts.length === 0) {
            return "index";
        }
        return this.route.path.parts.join(".");
    }

    public get entryModule(): IModule {
        return {
            id: r(this.id + ".entry.js"),
            content: `
            let page = ${this.requirePageExpression};
            page.load(${this.runtimeRouteRefExpression()});
            `
        };
    }

    public get dataModuleId(): string {
        return r(this.id + ".data.js");
    }

    public getDataModuleContent(routes: DetailedRoutes) {
        const page = this.route.page;
        return `module.exports.data = ${serializeData(page.data, routes)};`;
    }

    public get pageModule(): IModule {
        const page = this.route.page;
        return {
            id: r(this.id + ".page.js"),
            content: `
            const pageModule = ${requireModule(page.moduleFilename)};
            const data = ${requireModule(this.dataModuleId)}.data;
            const page = new pageModule[${JSON.stringify(
                page.exportName
            )}](data);
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

function fromEntries<T = any>(
    entries: Iterable<readonly [PropertyKey, T]>
): { [k in PropertyKey]: T } {
    return [...entries].reduce(
        (obj, { 0: key, 1: val }) => Object.assign(obj, { [key]: val }),
        {}
    );
}

export class WebpackConfigBuilder {
    private readonly initialRoutes: Routes;

    @computed
    public get routes(): DetailedRoutes {
        return new DetailedRoutes(this.initialRoutes);
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
        const addVirtualModulesPlugin = new AddVirtualModules(
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
