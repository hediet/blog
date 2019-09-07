import { Routes, Route } from "..";
import { Path } from "../../path";
export interface IModule {
    id: string;
    getContent(): string;
}
export declare class RoutesWithModules {
    private readonly routes;
    readonly entries: RouteWithModules[];
    constructor(routes: Routes);
    getRouteData(path: Path): RouteWithModules | undefined;
    runtimeRouteIndexExpression(): string;
    readonly indexModule: IModule;
}
export declare class RouteWithModules {
    readonly route: Route;
    constructor(route: Route);
    runtimeRouteRefExpression(): string;
    readonly importPageExpression: string;
    readonly requirePageExpression: string;
    readonly id: string;
    readonly entryModule: IModule;
    readonly dataModuleId: string;
    getDataModule(routes: RoutesWithModules): IModule;
    readonly pageModule: IModule;
}
//# sourceMappingURL=RoutesWithModules.d.ts.map