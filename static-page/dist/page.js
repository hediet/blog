"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("./path");
const ReactDOM = require("react-dom");
const router_1 = require("./router");
const React = require("react");
const mobx_1 = require("mobx");
function routeRef(path) {
    return new ContentProviderRouteRef(path);
}
exports.routeRef = routeRef;
class RouteRef {
    constructor(path) {
        this.path = path;
    }
    static deserialize(state, routeIndexProvider) {
        const s = state;
        const p = new path_1.Path(s.path);
        return new RuntimeRouteRef(p.parts, async () => {
            const routes = await routeIndexProvider.load();
            const id = p.toString();
            const page = routes[id];
            if (!page) {
                throw new Error("Page does not exist");
            }
            return await page();
        });
    }
}
exports.RouteRef = RouteRef;
class ContentProviderRouteRef extends RouteRef {
    loadPage() {
        throw new Error();
    }
    getUrl() {
        throw new Error();
    }
    serialize() {
        throw new Error();
    }
}
exports.ContentProviderRouteRef = ContentProviderRouteRef;
class RuntimeRouteRef extends RouteRef {
    constructor(pathItems, loadPage) {
        super(new path_1.Path(pathItems));
        this.loadPage = loadPage;
    }
    getUrl() {
        return this.path.toString();
    }
    serialize() {
        const s = {
            path: this.path.parts
        };
        return s;
    }
}
RuntimeRouteRef.moduleId = module.filename;
RuntimeRouteRef.exportName = RuntimeRouteRef.name;
exports.RuntimeRouteRef = RuntimeRouteRef;
class RouteIndexProvider {
}
exports.RouteIndexProvider = RouteIndexProvider;
class PlaceholderRouteIndexProvider extends RouteIndexProvider {
    load() {
        throw new Error("This placeholder instance does not support loading");
    }
}
exports.PlaceholderRouteIndexProvider = PlaceholderRouteIndexProvider;
class DynamicRouteIndexProvider extends RouteIndexProvider {
    constructor(loadFn) {
        super();
        this.loadFn = loadFn;
    }
    load() {
        return this.loadFn();
    }
}
DynamicRouteIndexProvider.moduleId = module.filename;
DynamicRouteIndexProvider.exportName = DynamicRouteIndexProvider.name;
exports.DynamicRouteIndexProvider = DynamicRouteIndexProvider;
class Page {
    constructor(data) {
        this.data = data;
    }
    get moduleFilename() {
        return this.module.filename;
    }
    get exportName() {
        return Object.getPrototypeOf(this).constructor.name;
    }
    updateData(newData) {
        this.data = newData;
    }
    get title() {
        return "";
    }
    getHtmlTemplate(path) {
        return `<!DOCTYPE html>
<html>
    <head>
        <title>${this.title}</title>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body>
        <div id="target"></div>
    </body>
</html>`;
    }
}
__decorate([
    mobx_1.observable
], Page.prototype, "data", void 0);
exports.Page = Page;
class PageWithRouter extends Page {
    constructor(data) {
        if (!data.routeIndexProvider) {
            // this will get replaced when serialized
            data.routeIndexProvider = new PlaceholderRouteIndexProvider();
        }
        super(data);
    }
    load(selfRef) {
        const target = document.getElementById("target");
        ReactDOM.render(React.createElement(router_1.ReactRouter, { initialPage: this, initialRef: selfRef, routeIndexProvider: this.data.routeIndexProvider }), target);
    }
}
exports.PageWithRouter = PageWithRouter;
//# sourceMappingURL=page.js.map