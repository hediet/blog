import { RouteRef, Page, RouteIndexProvider } from "./page";
import React = require("react");
import { observable } from "mobx";
import { observer, Observer } from "mobx-react";

export interface Router {
    navigateTo(ref: RouteRef): Promise<void>;
}

const RouterContext = React.createContext<Router | undefined>(undefined);

export const RouterConsumer = RouterContext.Consumer;

interface ReactRouterProps {
    initialPage: Page;
    initialRef: RouteRef;
    routeIndexProvider: RouteIndexProvider;
}

@observer
export class ReactRouter extends React.Component<ReactRouterProps>
    implements Router {
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
        const page = await ref.loadPage();
        this.currentPage = page;
        history.pushState(ref.serialize(), page.title, ref.getUrl());
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
