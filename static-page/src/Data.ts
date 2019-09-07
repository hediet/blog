import { RouteRef } from ".";
import { RouteIndexProvider } from "./page";

export type Data =
    | DataArray
    | { readonly [TName in string]: Data }
    | string
    | number
    | boolean
    | undefined
    | RouteRef
    | RouteIndexProvider
    | Asset;

export abstract class Asset {
    public abstract get url(): string;
}

export class RuntimeAsset extends Asset {
    static moduleId = module.filename;
    static exportName = RuntimeAsset.name;

    constructor(public readonly url: string) {
        super();
    }
}

export class CompiletimeAsset extends Asset {
    constructor(public readonly path: string) {
        super();
    }

    public get url(): string {
        throw new Error("Only for runtime");
    }
}

export interface DataArray extends ReadonlyArray<Data> {}
