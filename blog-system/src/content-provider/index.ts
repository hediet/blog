import { Page } from "../page";
import { Path } from "../path";
import { observable, action } from "mobx";

export { WebpackConfigBuilder } from "./webpack/WebpackConfigBuilder";

export interface WebsiteContentProvider {
    getPages(): Promise<Routes>;
}

export class Routes {
    @observable
    protected _routes: ReadonlyArray<Route>;

    public get routes(): ReadonlyArray<Route> {
        return this._routes;
    }

    constructor(routes: ReadonlyArray<Route>) {
        this._routes = routes;
    }
}

export class DynamicRoutes extends Routes {
    @action
    public updateRoutes(routes: ReadonlyArray<Route>) {
        this._routes = routes;
    }
}

export class Route {
    @observable
    protected _page: Page;
    public get page(): Page {
        return this._page;
    }

    constructor(public readonly path: Path, page: Page) {
        this._page = page;
    }
}

export class DynamicRoute extends Route {
    @action
    public updatePage(page: Page) {
        this._page = page;
    }
}
