"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const page_1 = require("../../page");
const mobx_1 = require("mobx");
const utils_1 = require("./utils");
const serializeData_1 = require("./serializeData");
const path = require("path");
const r = (file) => path.resolve(__dirname, file);
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
        return `new ${utils_1.classExpression(page_1.DynamicRouteIndexProvider)}(() => ${utils_1.importModule(this.indexModule.id)})`;
    }
    get indexModule() {
        return {
            id: r("routeIndex.js"),
            getContent: () => `
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
        return `new (${utils_1.requireModule(page_1.RuntimeRouteRef.moduleId)}[${JSON.stringify(page_1.RuntimeRouteRef.exportName)}])(${serializeData_1.serializeData(this.route.path.parts, null)}, () => ${this.importPageExpression})`;
    }
    get importPageExpression() {
        return `${utils_1.importModule(this.pageModule.id)}.then(x => x.page)`;
    }
    get requirePageExpression() {
        return `${utils_1.requireModule(this.pageModule.id)}.page`;
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
            getContent: () => `
let page = ${this.requirePageExpression};
page.load(${this.runtimeRouteRefExpression()});
            `
        };
    }
    get dataModuleId() {
        return r(this.id + ".data.js");
    }
    getDataModule(routes) {
        const page = this.route.page;
        return {
            id: this.dataModuleId,
            getContent: () => `module.exports.data = ${serializeData_1.serializeData(page.data, routes)};`
        };
    }
    get pageModule() {
        const page = this.route.page;
        return {
            id: r(this.id + ".page.js"),
            getContent: () => `
const pageModule = ${utils_1.requireModule(page.moduleFilename)};
const data = ${utils_1.requireModule(this.dataModuleId)}.data;
const page = new pageModule[${JSON.stringify(page.exportName)}](data);
if (module.hot) {
    module.hot.accept(${JSON.stringify(this.dataModuleId)}, () => {
        const newData = ${utils_1.requireModule(this.dataModuleId)}.data;
        page.updateData(newData);
    });
}
module.exports.page = page`
        };
    }
}
exports.RouteWithModules = RouteWithModules;
//# sourceMappingURL=RoutesWithModules.js.map