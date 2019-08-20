import {} from "@blueprintjs/core";
import { computed, observable } from "mobx";
import { observer } from "mobx-react";
import * as React from "react";
import classnames = require("classnames");
import "../assets/style.scss";
import { RouteRef, Link } from "@hediet/static-page";
import classNames = require("classnames");

export type BaseData = {
    index: RouteRef;
};

@observer
export class BasePage extends React.Component<
    {
        children: React.ReactNode;
        fullscreenShare?: number; // between 0 and 1
    } & BaseData
> {
    @observable public scrollY = 0;
    get scrollYMax() {
        return document.body.offsetHeight - window.innerHeight;
    }
    @observable private mouseOver = false;
    @observable private focus = true;
    @observable private loading = true;

    @computed
    get blur(): number {
        if (this.loading || this.mouseOver || !this.focus) return 0;
        const b = Math.max(0, 4 - this.scrollY / 20);
        return b;
    }

    componentDidMount() {
        window.addEventListener("scroll", () => {
            this.scrollY = window.scrollY;
        });
        window.addEventListener("focus", () => {
            this.focus = true;
        });
        window.addEventListener("blur", () => {
            this.focus = false;
        });
    }

    componentWillUnmount() {}

    render() {
        return (
            <div className="root">
                <div
                    className={"page"}
                    style={{
                        maxWidth:
                            752 +
                            (this.props.fullscreenShare || 0) * (1800 - 752)
                    }}
                >
                    <div
                        className="header"
                        onMouseOver={() => (this.mouseOver = true)}
                        onMouseOut={() => (this.mouseOver = false)}
                    >
                        <img
                            src={require("../assets/logo/background.gif")}
                            style={{ visibility: "hidden" }}
                            onLoad={() => (this.loading = false)}
                        />
                        <div
                            className="header1"
                            style={{
                                filter: `blur(${this.blur}px)`,
                                transition: "2s"
                            }}
                        />
                        <div className="header2" />
                        <div
                            className="header3"
                            style={{
                                opacity: this.blur > 0 ? 1 : 0
                            }}
                        />
                    </div>
                    <div className="title">
                        <Link to={this.props.index}>Blog</Link>
                        <div>Projects</div>
                        <div className="divider" />

                        <a
                            className="with-icon github"
                            href="https://github.com/hediet"
                        >
                            Github
                        </a>
                        <a
                            className="with-icon twitter"
                            href="https://twitter.com/hediet_dev"
                        >
                            Twitter
                        </a>
                    </div>
                    <div className="body">{this.props.children}</div>
                </div>
            </div>
        );
    }
}
