import React = require("react");
import {
    BasePage,
    BlogDate,
    BaseData,
    GithubBadge
} from "../../../../blog.hediet.de/src/content-presenter/components";
import { BlogPageConstructor } from "../../../../blog.hediet.de/src/content-provider/BlogPageConstructor";
import { PageWithRouter } from "@hediet/static-page";
import { Button, MenuItem } from "@blueprintjs/core";
import { observable, runInAction, computed } from "mobx";
import { Select, ItemRenderer } from "@blueprintjs/select";

const pageCtor: BlogPageConstructor = {
    title: "A TypeScript Playground for RX JS",
    date: new Date("2019-10-15"),
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

interface Demo {
    name: string;
    serializedData: string;
}

const demos: Demo[] = [
    {
        name: "Delayed",
        serializedData:
            "XQAAAAK_AQAAAAAAAABJINBuYDZsN5YTW6OHrMtN89ZdV25aFV-TlxujY6_B2yiluwYypyoRv82V4xDsvXgTGAcdgyBDJYQMNYmL8Er0i0AS0nT-aCxI4mFvK4dz_dhuNamE0PzbQlpxOKZ6W1rN6AqvRT7N5BCBXe4hLsoOhfqOVNfvt0QgnHTE0VG3pYpyUZeVp_YdD84n1RiVn1nOYZYxExyT8HrYbsd6ZjvSOEGEr5RDvhOvck6G1pHpdY6c_l0Rs9DCGxyPQ9XoSXDqBIqtc7aauhOL3EdhONtYnsK1w5jvRpPVySUg5bLMrwYPmcXqQ-2R8POB_VSXHOCbRXuRY1hokQb1Bm8dISB1_SwIQO-Mc1Nux__iU3R_"
    },
    {
        name: "Merge",
        serializedData:
            "XQAAAAKzAgAAAAAAAABJoNBuYDZsN5YTW6OHrMtN89Y1bRpaFU6LpxujY6_62_sGCBGhggMKHkHaLvxThe6noA8ty8yc0tyZDoJiTijOH2pSZh0Q6JFdySlh1w47pXgZPkHAIbuHU8BzSQ3fU8og2jc-ehwGly8LUcQWHjKYQuoqyk6mRu5nVK3Lc_3zkLZ-kcdTH_PiltY8usC_oT9vNUC5wjV52nkRJniqvih83Yndz51g8KYax2QCa6oDsOMpB0HFzg8BBstKzJ3f1gtBIrChJvTnRJQg1afWBIYpWXP55d5FoMDhshanGIHr8kT5dP2o93wVjfUFxKwyAtjLas4PJ3wUf6XK9KCjnaTOfLTbufotkickARFYH2ZuLc9vrRxX-xgDbzDujTUevDdSW3pjONfhWou4zUJcEP_BgsAA"
    },
    {
        name: "Group By",
        serializedData:
            "XQAAAAIPAwAAAAAAAABJIRBuYDZsN5YTW6OHrMtN89Z7RhGEaF6YnWUr_dplnzzkx8k3a4BftTzMxq321iiHa48lwnnzUsEXQu5h8Wq6a5AnJSlgG5tL4DZaygdCn30FtG1gmm5Ho4PNW0cPegpD2XPAheu5he0Fqf37KMr4e8UlTDnyDkMQ11o152fCLEvvjhb17W0XuqEUsIvZVMaXJTlkFdwzOgL4wD9V4AGTJx3K2wqE5LYRRYln12aqfPTVaWTkBluBAHkvZRhngtYuIWRuM_dP7Eb1k7Twx-smh6deXQtMYJCadtsToyEp1rrwys-a7X1kjkbwEJfd4S6VDgntjfXeAqJlMncrr6XI9GqbkAQmFVv00G6Qo2nJM3DmbaHtvYU8fMbx19zLS7LAEk8_wX2Kab4BMEGv6mxe3T3qpLdIKR2k-LngK0qljtGXjIEfaCsJtizJ5t1J6lfFLFVs0Aa_Afsk__odf6w"
    },
    {
        name: "Scan (Async Reduce)",
        serializedData:
            "XQAAAAIKAgAAAAAAAABJIRBuYDZsN5YTW6OHrMtN89ZxS3nDaEaGgWUr_cZCa21dUg1Ov77y6-qEdqeApu425noyrNEj24__p_GAsHMXgHYANpcO0__2KiMS3kMK3A_a-4IStJq9cCZX7gjUqhT-c8JszedICyMJLpr8PinHHC1k5K1cG3sexCpuhGVqmflhlJg0pzcXEBfJODhae4asZBGEn3QaaFz4J6UyvH1DBFyF3o2LDtFb7kVeheZKmBduf-8epYve9GP8ycdJUE9wyJpA3Hf-6QBjb3x0ilJqqBDCTzVmc6eLgy6UPdZIYjpfP1XwRHRYGBt6UtBiBsbw7TcIqmmdgWL8C4-fH1JP5TpCQi4m41tNqgaVPC9zL9kNWM0iCNu4qnC0lehMm4mHBwA7PV684K-BOvF5fPph1cjZ_-6TIXU"
    },
    {
        name: "Reduce (Sync Reduce)",
        serializedData:
            "XQAAAAIMAgAAAAAAAABJIRBuYDZsN5YTW6OHrMtN89ZxS3nDaEaGgWUr_cZCa21dUg1Ov77y6-qEdqeApu425noyrNEj24__p_GAsHMXgHYANpcO0__2KiMS3kMK3A_a-4IStJq9cCZX7gjUqhT-c8JszedICyMJLpr8PinHHC1k5K1cG3sexCpt_OYQyjitMDNql-ax8sAJ2uotmCgXhOOtkoPo-1MQIuekJGzGwQaSs9zHIZ4XscfiTxsbvt0dCwgNXh5USHIvB3IAhZ2M_xZ53JcVYeNP8och2ce-0wj-4yr1qafHkLsKH12ejbbMXkKgAKRxnGi2eg20HePJg7TKTS331nw-R4gzEp20pIGhKdruxc8fzznHGkWpKgRUUkdX-iVYU-m-gwWXO4P4Uap3dP1ZYWnff_q8lOJns_OiCv_5bfeM"
    }
];

export class Page extends PageWithRouter<{ baseData: BaseData }> {
    module = module;
    get title() {
        return pageCtor.title;
    }
    get date() {
        return pageCtor.date;
    }

    @observable serializedData: string =
        typeof window !== "undefined" ? window.location.hash.substr(1) : "";

    @computed get selectedDemo(): Demo | undefined {
        return demos.find(d => d.serializedData === this.serializedData);
    }

    readonly setIFrameRef = (ref: HTMLIFrameElement | null) => {
        if (ref) {
            window.addEventListener("message", m => {
                const d = m.data as {
                    kind: "setSerializedData";
                    serialized: string;
                };
                if (d.kind === "setSerializedData") {
                    this.serializedData = d.serialized;
                    history.replaceState(
                        history.state,
                        document.title,
                        "#" + d.serialized
                    );
                }
            });
        }
    };

    @observable
    private ref: BasePage | null = null;
    readonly setBasePage = (ref: BasePage | null) => {
        this.ref = ref;
    };

    render() {
        const DemoSelect = Select.ofType<Demo>();

        const renderDemo: ItemRenderer<Demo> = (
            demo,
            { handleClick, modifiers }
        ) => {
            if (!modifiers.matchesPredicate) {
                return null;
            }
            return (
                <MenuItem
                    key={demo.name}
                    active={modifiers.active}
                    disabled={modifiers.disabled}
                    text={demo.name}
                    onClick={handleClick}
                />
            );
        };

        return (
            <BasePage
                fullscreenShare={
                    !this.ref
                        ? 0
                        : Math.abs(this.ref.scrollY - this.ref.scrollYMax) < 10
                        ? 1
                        : 0
                }
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
                        and can be used for sharing.
                    </p>

                    <DemoSelect
                        items={demos}
                        itemPredicate={(query: string, item: Demo) =>
                            item.name
                                .toLowerCase()
                                .indexOf(query.toLowerCase()) !== -1
                        }
                        activeItem={this.selectedDemo}
                        itemRenderer={renderDemo}
                        noResults={
                            <MenuItem disabled={true} text="No results." />
                        }
                        onItemSelect={item =>
                            runInAction(() => {
                                this.serializedData = item.serializedData;
                            })
                        }
                    >
                        <Button
                            text={
                                this.selectedDemo
                                    ? this.selectedDemo.name
                                    : "(No Demo selected)"
                            }
                            rightIcon="double-caret-vertical"
                        />
                    </DemoSelect>

                    <div
                        style={{
                            height: 1,
                            marginTop: 10,
                            marginBottom: 10,
                            marginLeft: -10,
                            marginRight: -10,
                            borderTop: "1px solid #738694"
                        }}
                    />

                    <iframe
                        ref={this.setIFrameRef}
                        style={{
                            width: "100%",
                            height: "calc(100vh - 75px)",
                            flex: "1",
                            border: "none"
                        }}
                        src={`http://localhost:8080#${this.serializedData}`}
                    />
                </div>
            </BasePage>
        );
    }
}

export default pageCtor;
