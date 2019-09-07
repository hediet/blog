"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const page_1 = require("./page");
const React = require("react");
const mobx_1 = require("mobx");
const mobx_react_1 = require("mobx-react");
const RouterContext = React.createContext(undefined);
exports.RouterConsumer = RouterContext.Consumer;
let ReactRouter = class ReactRouter extends React.Component {
    constructor(props) {
        super(props);
        this.isLoading = false;
        this.currentPage = this.props.initialPage;
        if (!history.state) {
            const r = props.initialRef;
            history.replaceState(r.serialize(), props.initialPage.title, r.getUrl() + window.location.hash);
        }
        window.addEventListener("popstate", async (ev) => {
            if (!ev.state) {
                return;
            }
            const ref = page_1.RouteRef.deserialize(ev.state, this.props.routeIndexProvider);
            const page = await ref.loadPage();
            if (this.props.onNavigated) {
                this.props.onNavigated(ref, page);
            }
            this.currentPage = page;
        });
    }
    async navigateTo(ref) {
        history.pushState(ref.serialize(), "", ref.getUrl());
        let loading = true;
        setTimeout(() => {
            this.isLoading = loading;
        }, 100);
        try {
            const page = await ref.loadPage();
            mobx_1.runInAction("navigation finished", () => {
                loading = false;
                if (this.props.onNavigated) {
                    this.props.onNavigated(ref, page);
                }
                this.isLoading = false;
                this.currentPage = page;
            });
        }
        catch (e) {
            // Manually go there.
            // Most probably the site has been updated and the chunk does not exist any more.
            window.location.href = ref.getUrl();
        }
    }
    render() {
        return (React.createElement(RouterContext.Provider, { value: this },
            React.createElement(mobx_react_1.Observer, null, () => {
                document.title = this.currentPage.title;
                return this.currentPage.render();
            })));
    }
};
__decorate([
    mobx_1.observable
], ReactRouter.prototype, "isLoading", void 0);
__decorate([
    mobx_1.observable
], ReactRouter.prototype, "currentPage", void 0);
ReactRouter = __decorate([
    mobx_react_1.observer
], ReactRouter);
exports.ReactRouter = ReactRouter;
//# sourceMappingURL=router.js.map