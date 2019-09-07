import { RouteRef, Page, RouteIndexProvider } from "./page";
import React = require("react");
import { observable, runInAction } from "mobx";
import { observer, Observer } from "mobx-react";
import { Data } from "./Data";

export interface Router {
    navigateTo(ref: RouteRef): Promise<void>;
    readonly isLoading: boolean;
}

const RouterContext = React.createContext<Router | undefined>(undefined);

export const RouterConsumer = RouterContext.Consumer;

interface ReactRouterProps {
    initialPage: Page;
    initialRef: RouteRef;
    routeIndexProvider: RouteIndexProvider;
    onNavigated?: (ref: RouteRef, page: Page<Data>) => void;
}

@observer
export class ReactRouter extends React.Component<ReactRouterProps>
    implements Router {
    @observable
    isLoading: boolean = false;
    @observable currentPage: Page = this.props.initialPage;

    constructor(props: ReactRouterProps) {
        super(props);

        if (!history.state) {
            const r = props.initialRef;
            history.replaceState(
                r.serialize(),
                props.initialPage.title,
                r.getUrl() + window.location.hash
            );
        }

        window.addEventListener("popstate", async ev => {
            if (!ev.state) {
                return;
            }

            const ref = RouteRef.deserialize(
                ev.state,
                this.props.routeIndexProvider
            );
            const page = await ref.loadPage();
            this.currentPage = page;
        });
    }

    async navigateTo(ref: RouteRef): Promise<void> {
        history.pushState(ref.serialize(), "", ref.getUrl());
        let loading = true;
        setTimeout(() => {
            this.isLoading = loading;
        }, 100);
        const page = await ref.loadPage();
        runInAction("navigation finished", () => {
            loading = false;
            if (this.props.onNavigated) {
                this.props.onNavigated(ref, page);
            }
            this.isLoading = false;
            this.currentPage = page;
        });
    }

    render(): React.ReactElement {
        return (
            <RouterContext.Provider value={this}>
                <Observer>
                    {() => {
                        document.title = this.currentPage.title;
                        return this.currentPage.render();
                    }}
                </Observer>
            </RouterContext.Provider>
        );
    }
}
