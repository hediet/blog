"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mobx_1 = require("mobx");
class AddVirtualModulesPlugin {
    constructor(virtualModules, routes) {
        this.virtualModules = virtualModules;
        this.routes = routes;
        this.initialized = false;
        this.lastEntries = new Map();
    }
    writeModule(m) {
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
        mobx_1.autorun(() => {
            this.writeModule(this.routes.indexModule);
            for (const route of this.routes.entries) {
                this.writeModule(route.getDataModule(this.routes));
                this.writeModule(route.pageModule);
                this.writeModule(route.entryModule);
            }
        });
    }
    apply(compiler) {
        compiler.hooks.compilation.tap(Object.getPrototypeOf(this).constructor.name, () => this.init());
    }
}
exports.AddVirtualModulesPlugin = AddVirtualModulesPlugin;
//# sourceMappingURL=AddVirtualModulesPlugin.js.map