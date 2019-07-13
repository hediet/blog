import { Path } from "./path";
import * as ReactDOM from "react-dom";
import { ReactRouter } from "./router";
import React = require("react");
import { observable } from "mobx";
import { Data } from "./Data";

export function routeRef(path: Path) {
    return new ContentProviderRouteRef(path);
}

export abstract class RouteRef {
    public static deserialize(
        state: unknown,
        routeIndexProvider: RouteIndexProvider
    ): RouteRef {
        const s = state as Serialized;
        const p = new Path(s.path);
        return new RuntimeRouteRef(p.parts, async () => {
            const routes = await routeIndexProvider.load();
            const id = p.toString();
            const page = routes[id];
            if (!page) {
                throw new Error("Page does not exist");
            }
            return await page();
        });
    }

    constructor(public readonly path: Path) {}

    public abstract loadPage(): Promise<Page>;
    public abstract getUrl(): string;
    public abstract serialize(): unknown;
}

export class ContentProviderRouteRef extends RouteRef {
    public loadPage(): Promise<Page> {
        throw new Error();
    }

    public getUrl(): string {
        throw new Error();
    }

    public serialize(): unknown {
        throw new Error();
    }
}

interface Serialized {
    readonly path: ReadonlyArray<string>;
}

export class RuntimeRouteRef extends RouteRef {
    static moduleId = module.filename;
    static exportName = RuntimeRouteRef.name;

    constructor(
        pathItems: ReadonlyArray<string>,
        public readonly loadPage: () => Promise<Page>
    ) {
        super(new Path(pathItems));
    }

    public getUrl(): string {
        return this.path.toString();
    }

    public serialize(): unknown {
        const s: Serialized = {
            path: this.path.parts
        };
        return s;
    }
}

export abstract class RouteIndexProvider {
    abstract load(): Promise<RouteIndex>;
}

export class PlaceholderRouteIndexProvider extends RouteIndexProvider {
    load(): Promise<RouteIndex> {
        throw new Error("This placeholder instance does not support loading");
    }
}

export class DynamicRouteIndexProvider extends RouteIndexProvider {
    static moduleId = module.filename;
    static exportName = DynamicRouteIndexProvider.name;

    constructor(private readonly loadFn: () => Promise<RouteIndex>) {
        super();
    }

    load(): Promise<RouteIndex> {
        return this.loadFn();
    }
}

export interface RouteIndex {
    [moduleName: string]: (() => Promise<Page>) | undefined;
}

export abstract class Page<TData extends Data = Data> {
    protected abstract get module(): NodeModule;

    public get moduleFilename(): string {
        return this.module.filename;
    }

    public get exportName(): string {
        return Object.getPrototypeOf(this).constructor.name;
    }

    @observable public data: TData;

    constructor(data: TData) {
        this.data = data;
    }

    public abstract render(): React.ReactElement;

    public updateData(newData: TData) {
        this.data = newData;
    }

    public get title(): string {
        return "";
    }

    public getHtmlTemplate(): string {
        return `<!DOCTYPE html>
<html>
    <head>
        <title>${this.title}</title>
        <meta charset="utf-8"/>
    </head>
    <body>
        <div id="target"></div>
    </body>
</html>`;
    }

    public abstract load(selfRef: RouteRef): void;
}

export abstract class PageWithRouter<TData extends Data = Data> extends Page<
    TData & { routeIndexProvider?: RouteIndexProvider }
> {
    constructor(data: TData & { routeIndexProvider?: RouteIndexProvider }) {
        if (!data.routeIndexProvider) {
            // this will get replaced when serialized
            data.routeIndexProvider = new PlaceholderRouteIndexProvider();
        }
        super(data);
    }

    public load(selfRef: RouteRef): void {
        const target = document.getElementById("target")!;
        ReactDOM.render(
            <ReactRouter
                initialPage={this}
                initialRef={selfRef}
                routeIndexProvider={this.data.routeIndexProvider!}
            />,
            target
        );
    }
}
