"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const mobx_1 = require("mobx");
var WebpackConfigBuilder_1 = require("./webpack/WebpackConfigBuilder");
exports.buildWebpackConfig = WebpackConfigBuilder_1.buildWebpackConfig;
class WebsiteContentProvider {
    async getStaticFiles() {
        return {};
    }
}
exports.WebsiteContentProvider = WebsiteContentProvider;
class Routes {
    constructor(routes) {
        this._routes = routes;
    }
    get routes() {
        return this._routes;
    }
}
__decorate([
    mobx_1.observable
], Routes.prototype, "_routes", void 0);
exports.Routes = Routes;
class DynamicRoutes extends Routes {
    updateRoutes(routes) {
        this._routes = routes;
    }
}
__decorate([
    mobx_1.action
], DynamicRoutes.prototype, "updateRoutes", null);
exports.DynamicRoutes = DynamicRoutes;
class Route {
    constructor(path, page) {
        this.path = path;
        this._page = page;
    }
    get page() {
        return this._page;
    }
}
__decorate([
    mobx_1.observable
], Route.prototype, "_page", void 0);
exports.Route = Route;
class DynamicRoute extends Route {
    updatePage(page) {
        this._page = page;
    }
}
__decorate([
    mobx_1.action
], DynamicRoute.prototype, "updatePage", null);
exports.DynamicRoute = DynamicRoute;
//# sourceMappingURL=index.js.map