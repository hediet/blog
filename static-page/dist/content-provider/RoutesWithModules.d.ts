import { Routes } from ".";
import { Path } from "../path";
import { RouteWithModules, IModule } from "./WebpackConfigBuilder";
export declare class RoutesWithModules {
    private readonly routes;
    readonly entries: RouteWithModules[];
    constructor(routes: Routes);
    getRouteData(path: Path): RouteWithModules | undefined;
    runtimeRouteIndexExpression(): string;
    readonly indexModuleId: string;
    readonly indexModule: IModule;
}
//# sourceMappingURL=RoutesWithModules.d.ts.map