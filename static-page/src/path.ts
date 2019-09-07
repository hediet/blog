import { ContentProviderRouteRef } from "./page";

export class Path {
    constructor(public readonly parts: ReadonlyArray<string>) {}

    toString(): string {
        return "/" + this.parts.join("/");
    }

    ref() {
        return new ContentProviderRouteRef(this);
    }
}

export function path(parts: string[]): Path {
    return new Path(parts);
}

path.default = path([]);
