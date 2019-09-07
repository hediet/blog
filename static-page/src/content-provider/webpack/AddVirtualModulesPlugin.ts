import { autorun } from "mobx";
import { RoutesWithModules } from "./RoutesWithModules";
import VirtualModulesPlugin = require("webpack-virtual-modules");
import { IModule } from "./RoutesWithModules";
import * as webpack from "webpack";

export class AddVirtualModulesPlugin implements webpack.Plugin {
    constructor(
        private readonly virtualModules: VirtualModulesPlugin,
        private readonly routes: RoutesWithModules
    ) {}

    private initialized = false;

    private lastEntries = new Map<string, string>();

    private writeModule(m: IModule) {
        const v = this.lastEntries.get(m.id);
        const newContent = m.getContent();
        if (v !== newContent) {
            this.lastEntries.set(m.id, newContent);
            console.log("updating ", m.id);
            this.virtualModules.writeModule(m.id, newContent);
        }
    }

    init() {
        if (this.initialized) {
            return;
        }
        this.initialized = true;

        autorun(() => {
            this.writeModule(this.routes.indexModule);

            for (const route of this.routes.entries) {
                this.writeModule(route.getDataModule(this.routes));
                this.writeModule(route.pageModule);
                this.writeModule(route.entryModule);
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
