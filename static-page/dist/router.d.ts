import { RouteRef, Page, RouteIndexProvider } from "./page";
import React = require("react");
import { Data } from "./Data";
export interface Router {
    navigateTo(ref: RouteRef): Promise<void>;
    readonly isLoading: boolean;
}
export declare const RouterConsumer: React.ExoticComponent<React.ConsumerProps<Router | undefined>>;
interface ReactRouterProps {
    initialPage: Page;
    initialRef: RouteRef;
    routeIndexProvider: RouteIndexProvider;
    onNavigated?: (ref: RouteRef, page: Page<Data>) => void;
}
export declare class ReactRouter extends React.Component<ReactRouterProps> implements Router {
    isLoading: boolean;
    currentPage: Page;
    constructor(props: ReactRouterProps);
    navigateTo(ref: RouteRef): Promise<void>;
    render(): React.ReactElement;
}
export {};
//# sourceMappingURL=router.d.ts.map