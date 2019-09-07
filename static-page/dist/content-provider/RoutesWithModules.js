"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const page_1 = require("../page");
const mobx_1 = require("mobx");
const WebpackConfigBuilder_1 = require("./WebpackConfigBuilder");
class RoutesWithModules {
    constructor(routes) {
        this.routes = routes;
    }
    get entries() {
        return this.routes.routes.map(r => new WebpackConfigBuilder_1.RouteWithModules(r));
    }
    getRouteData(path) {
        return this.entries.find(d => d.route.path.toString() === path.toString());
    }
    runtimeRouteIndexExpression() {
        return `new ${WebpackConfigBuilder_1.classExpression(page_1.DynamicRouteIndexProvider)}(() => ${WebpackConfigBuilder_1.importModule(this.indexModuleId)})`;
    }
    get indexModuleId() {
        return WebpackConfigBuilder_1.r("routeIndex.js");
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
        return `new (${requireModule(RuntimeRouteRef.moduleId)}[${JSON.stringify(RuntimeRouteRef.exportName)}])(${serializeData(this.route.path.parts, null)}, () => ${this.importPageExpression})`;
    }
    get importPageExpression() {
        return `${WebpackConfigBuilder_1.importModule(this.pageModule.id)}.then(x => x.page)`;
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
            id: WebpackConfigBuilder_1.r(this.id + ".entry.js"),
            content: `
            let page = ${this.requirePageExpression};
            page.load(${this.runtimeRouteRefExpression()});
            `
        };
    }
    get dataModuleId() {
        return WebpackConfigBuilder_1.r(this.id + ".data.js");
    }
    getDataModuleContent(routes) {
        const page = this.route.page;
        return `module.exports.data = ${serializeData(page.data, routes)};`;
    }
    get pageModule() {
        const page = this.route.page;
        return {
            id: WebpackConfigBuilder_1.r(this.id + ".page.js"),
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
exports.RouteWithModules = RouteWithModules;
function requireModule(name) {
    return `require(${formatFilename(name)})`;
}
function importModule(name) {
    return `import(${formatFilename(name)})`;
}
exports.importModule = importModule;
function formatFilename(name) {
    return JSON.stringify(name);
}
function classExpression(clazz) {
    return `(${requireModule(clazz.moduleId)}[${JSON.stringify(clazz.exportName)}])`;
}
exports.classExpression = classExpression;
//# sourceMappingURL=RoutesWithModules.js.map