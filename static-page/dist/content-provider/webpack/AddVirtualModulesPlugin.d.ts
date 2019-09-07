import { RoutesWithModules } from "./RoutesWithModules";
import VirtualModulesPlugin = require("webpack-virtual-modules");
import * as webpack from "webpack";
export declare class AddVirtualModulesPlugin implements webpack.Plugin {
    private readonly virtualModules;
    private readonly routes;
    constructor(virtualModules: VirtualModulesPlugin, routes: RoutesWithModules);
    private initialized;
    private lastEntries;
    private writeModule;
    init(): void;
    apply(compiler: webpack.Compiler): void;
}
//# sourceMappingURL=AddVirtualModulesPlugin.d.ts.map