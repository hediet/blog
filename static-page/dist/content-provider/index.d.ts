import { Page } from "../page";
import { Path } from "../path";
export { buildWebpackConfig } from "./webpack/WebpackConfigBuilder";
export declare abstract class WebsiteContentProvider {
    abstract getPages(): Promise<Routes>;
    getStaticFiles(): Promise<Record<string, string>>;
}
export declare class Routes {
    protected _routes: ReadonlyArray<Route>;
    readonly routes: ReadonlyArray<Route>;
    constructor(routes: ReadonlyArray<Route>);
}
export declare class DynamicRoutes extends Routes {
    updateRoutes(routes: ReadonlyArray<Route>): void;
}
export declare class Route {
    readonly path: Path;
    protected _page: Page;
    readonly page: Page;
    constructor(path: Path, page: Page);
}
export declare class DynamicRoute extends Route {
    updatePage(page: Page): void;
}
//# sourceMappingURL=index.d.ts.map