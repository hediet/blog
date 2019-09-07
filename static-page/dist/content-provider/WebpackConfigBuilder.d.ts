import * as webpack from "webpack";
import HtmlWebpackPlugin = require("html-webpack-plugin");
import { Route, Routes } from "..";
import { Path } from "../../path";
interface IModule {
    id: string;
    content: string;
}
export declare function classExpression(clazz: {
    moduleId: string;
    exportName: string;
}): string;
export declare class RoutesWithModules {
    private readonly routes;
    readonly entries: RouteWithModules[];
    constructor(routes: Routes);
    getRouteData(path: Path): RouteWithModules | undefined;
    runtimeRouteIndexExpression(): string;
    readonly indexModuleId: string;
    readonly indexModule: IModule;
}
declare class RouteWithModules {
    readonly route: Route;
    constructor(route: Route);
    runtimeRouteRefExpression(): string;
    readonly importPageExpression: string;
    readonly requirePageExpression: string;
    readonly id: string;
    readonly entryModule: IModule;
    readonly dataModuleId: string;
    getDataModuleContent(routes: RoutesWithModules): string;
    readonly pageModule: IModule;
}
export declare class WebpackConfigBuilder {
    private readonly initialRoutes;
    readonly routes: RoutesWithModules;
    private readonly outputPath;
    constructor(options: { routes: Routes; outputPath: string });
    buildConfig(): webpack.Configuration;
    buildRules(): webpack.RuleSetRule[];
    buildPlugins(): webpack.Plugin[];
    buildHtmlWebpackPlugins(): HtmlWebpackPlugin[];
}
export {};
//# sourceMappingURL=WebpackConfigBuilder.d.ts.map
