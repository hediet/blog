/// <reference types="node" />
import { Path } from "./path";
import React = require("react");
import { Data } from "./Data";
export declare function routeRef(path: Path): ContentProviderRouteRef;
export declare abstract class RouteRef {
    readonly path: Path;
    static deserialize(state: unknown, routeIndexProvider: RouteIndexProvider): RouteRef;
    constructor(path: Path);
    abstract loadPage(): Promise<Page>;
    abstract getUrl(): string;
    abstract serialize(): unknown;
}
export declare class ContentProviderRouteRef extends RouteRef {
    loadPage(): Promise<Page>;
    getUrl(): string;
    serialize(): unknown;
}
export declare class RuntimeRouteRef extends RouteRef {
    readonly loadPage: () => Promise<Page>;
    static moduleId: string;
    static exportName: string;
    constructor(pathItems: ReadonlyArray<string>, loadPage: () => Promise<Page>);
    getUrl(): string;
    serialize(): unknown;
}
export declare abstract class RouteIndexProvider {
    abstract load(): Promise<RouteIndex>;
}
export declare class PlaceholderRouteIndexProvider extends RouteIndexProvider {
    load(): Promise<RouteIndex>;
}
export declare class DynamicRouteIndexProvider extends RouteIndexProvider {
    private readonly loadFn;
    static moduleId: string;
    static exportName: string;
    constructor(loadFn: () => Promise<RouteIndex>);
    load(): Promise<RouteIndex>;
}
export interface RouteIndex {
    [moduleName: string]: (() => Promise<Page>) | undefined;
}
export declare abstract class Page<TData extends Data = Data> {
    protected abstract readonly module: NodeModule;
    readonly moduleFilename: string;
    readonly exportName: string;
    data: TData;
    constructor(data: TData);
    abstract render(): React.ReactElement;
    updateData(newData: TData): void;
    readonly title: string;
    getHtmlTemplate(path: Path): string;
    abstract load(selfRef: RouteRef): void;
}
export declare abstract class PageWithRouter<TData extends Data = Data> extends Page<TData & {
    routeIndexProvider?: RouteIndexProvider;
}> {
    constructor(data: TData & {
        routeIndexProvider?: RouteIndexProvider;
    });
    load(selfRef: RouteRef): void;
}
//# sourceMappingURL=page.d.ts.map