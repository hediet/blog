import { Routes, Route } from "..";
import { DynamicRouteIndexProvider, RuntimeRouteRef } from "../../page";
import { Path } from "../../path";
import { computed } from "mobx";
import { requireModule, classExpression, importModule } from "./utils";
import { serializeData } from "./serializeData";
import * as path from "path";

const r = (file: string) => path.resolve(__dirname, file);

export interface IModule {
    id: string;
    getContent(): string;
}

export class RoutesWithModules {
    @computed
    public get entries(): RouteWithModules[] {
        return this.routes.routes.map(r => new RouteWithModules(r));
    }

    constructor(private readonly routes: Routes) {}

    public getRouteData(path: Path): RouteWithModules | undefined {
        return this.entries.find(
            d => d.route.path.toString() === path.toString()
        );
    }

    public runtimeRouteIndexExpression(): string {
        return `new ${classExpression(
            DynamicRouteIndexProvider
        )}(() => ${importModule(this.indexModule.id)})`;
    }

    @computed
    public get indexModule(): IModule {
        return {
            id: r("routeIndex.js"),
            getContent: () => `
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

export class RouteWithModules {
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
            getContent: () => `
let page = ${this.requirePageExpression};
page.load(${this.runtimeRouteRefExpression()});
            `
        };
    }

    public get dataModuleId(): string {
        return r(this.id + ".data.js");
    }

    public getDataModule(routes: RoutesWithModules): IModule {
        const page = this.route.page;
        return {
            id: this.dataModuleId,
            getContent: () =>
                `module.exports.data = ${serializeData(page.data, routes)};`
        };
    }

    public get pageModule(): IModule {
        const page = this.route.page;
        return {
            id: r(this.id + ".page.js"),
            getContent: () => `
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
