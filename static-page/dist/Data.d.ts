import { RouteRef } from ".";
import { RouteIndexProvider } from "./page";
export declare type Data = DataArray | {
    readonly [TName in string]: Data;
} | string | number | boolean | undefined | RouteRef | RouteIndexProvider | Asset;
export declare abstract class Asset {
    abstract readonly url: string;
}
export declare class RuntimeAsset extends Asset {
    readonly url: string;
    static moduleId: string;
    static exportName: string;
    constructor(url: string);
}
export declare class CompiletimeAsset extends Asset {
    readonly path: string;
    constructor(path: string);
    readonly url: string;
}
export interface DataArray extends ReadonlyArray<Data> {
}
//# sourceMappingURL=Data.d.ts.map