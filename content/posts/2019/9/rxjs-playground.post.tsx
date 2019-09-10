import React = require("react");
import {
    PageFrame,
    BlogDate,
    BaseData,
    GithubBadge
} from "../../../../blog.hediet.de/src/content-presenter/components";
import { BlogPageConstructor } from "../../../../blog.hediet.de/src/content-provider/BlogPageConstructor";
import { PageWithRouter } from "@hediet/static-page";
import { observable, runInAction, computed } from "mobx";
import * as cookies from "js-cookie";

const pageCtor: BlogPageConstructor = {
    title: "A TypeScript Playground for RX JS",
    date: new Date("2019-09-08 12:00"),
    preview: {
        kind: "text",
        value: `This post is a playground for
        RxJS, a library for reactive programming using Observables that
        make it easier to compose asynchronous or callback-based
        code. The playground supports editable as well as
        computed observables. Events of editable observables can
        be created with a single click and dragged around, while
        computed observables are expressed in type-checked
        JavaScript (also known as TypeScript) and can refer to
        other observables.`
    },
    createPage(baseData) {
        return new Page({ baseData });
    }
};

export class UrlHashStore {
    @observable private value: string | undefined = this.get();

    constructor() {
        if (typeof window !== "undefined") {
            const fn = () => {
                const next = window.location.hash.substr(1);
                if (this.value !== next) {
                    this.value = next;
                    runInAction(() => {
                        this.value = next;
                    });
                }
            };

            fn();

            window.addEventListener("hashchange", fn);
        }
    }

    get(): string | undefined {
        return this.value;
    }

    set(value: string): void {
        this.value = value;
        history.replaceState(history.state, document.title, "#" + value);
    }
}

class RxJsFullScreen {
    static readonly instance = new RxJsFullScreen();
    private readonly cookieName = "rxjs-playground-fullscreen";

    public readonly wasFullScreen = !!cookies.get(this.cookieName);
    public setIsFullScreen(fullScreen: boolean) {
        if (fullScreen) {
            cookies.set(this.cookieName, "true");
        } else {
            cookies.remove(this.cookieName);
        }
    }
}

export class Page extends PageWithRouter<{ baseData: BaseData }> {
    module = module;
    get title() {
        return pageCtor.title;
    }
    get date() {
        return pageCtor.date;
    }

    private readonly dataStore = new UrlHashStore();

    readonly setIFrameRef = (ref: HTMLIFrameElement | null) => {
        if (ref) {
            window.addEventListener("message", m => {
                const d = m.data as {
                    kind: "setSerializedData";
                    serialized: string;
                };
                if (d.kind === "setSerializedData") {
                    this.dataStore.set(d.serialized);
                }
            });
        }
    };

    @observable
    private ref: PageFrame | null = null;
    readonly setBasePage = (ref: PageFrame | null) => {
        this.ref = ref;
    };

    get fullscreenShare(): number {
        return !this.ref
            ? 0
            : Math.abs(this.ref.scrollY - this.ref.scrollYMax) < 10
            ? 1
            : 0;
    }

    render() {
        RxJsFullScreen.instance.setIsFullScreen(this.fullscreenShare === 1);

        return (
            <PageFrame
                fullscreenShare={this.fullscreenShare}
                {...this.data.baseData}
                ref={this.setBasePage}
            >
                <div>
                    <div style={{ display: "flex" }}>
                        <h1>{this.title}</h1>
                    </div>
                    <div className="badges" style={{ display: "flex" }}>
                        <BlogDate date={this.date} />
                        <div style={{ marginLeft: "auto" }}>
                            <GithubBadge org="hediet" repo="rxjs-playground" />
                        </div>
                    </div>
                    <p>
                        This post is a playground for{" "}
                        <a href="https://rxjs-dev.firebaseapp.com/">RxJS</a>, a
                        library for reactive programming using Observables that
                        make it easier to compose asynchronous or callback-based
                        code. The playground supports editable as well as
                        computed observables. Events of editable observables can
                        be created with a single click and dragged around, while
                        computed observables are expressed in type-checked
                        JavaScript (also known as TypeScript) and can refer to
                        other observables.
                    </p>
                    <p>
                        Core of this playground is the RxJs{" "}
                        <code className="inlineCode">VirtualTimeScheduler</code>{" "}
                        that is used to immediately process delayed observables.
                        The{" "}
                        <a href="https://microsoft.github.io/monaco-editor/">
                            Monaco Editor
                        </a>{" "}
                        is used as editor component. The control UI is
                        implemented with{" "}
                        <a href="https://blueprintjs.com/">BlueprintJs</a>, the
                        visualization is rendered as plain SVG.
                    </p>
                    <p>
                        For technical reasons, delayed Rx operations must be
                        given the scheduler passed to the{" "}
                        <code className="inlineCode">visualize</code> function.
                        The <code className="inlineCode">track</code> function
                        can be used to track piped (intermediate) observables.
                        The browser url reflects the current playground model
                        and can be used for sharing. Scroll down to maximize the
                        playground.
                    </p>

                    <iframe
                        ref={this.setIFrameRef}
                        onLoad={() => {
                            if (RxJsFullScreen.instance.wasFullScreen) {
                                setTimeout(() => {
                                    scrollBy({ top: 1000 });
                                }, 0);
                            }
                        }}
                        style={{
                            width: "100%",
                            height: "calc(100vh - 18px)",
                            flex: "1",
                            border: "none"
                        }}
                        src={`https://hediet.github.io/rxjs-playground/#${this.dataStore.get()}`}
                    />
                </div>
            </PageFrame>
        );
    }
}

export default pageCtor;
