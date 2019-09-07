import { ContentProviderRouteRef } from "./page";
export declare class Path {
    readonly parts: ReadonlyArray<string>;
    constructor(parts: ReadonlyArray<string>);
    toString(): string;
    ref(): ContentProviderRouteRef;
}
declare function path(parts: string[]): Path;
declare namespace path {
    var default: Path;
}
export default path;
//# sourceMappingURL=path.d.ts.map