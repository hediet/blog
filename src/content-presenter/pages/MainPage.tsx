import React = require("react");
import { PageFrame, BaseData } from "../components/BasePage";
import { RouteRef, Page, Link, PageWithRouter } from "@hediet/static-page";
import { Content, ContentRenderer } from "../components/Content";
import { BasePage } from "./BasePage";

export type PostSummary = {
    title: string;
    preview: Content;
    ref: RouteRef;
    date: string;
};

export class MainPage extends BasePage<{
    recentPosts: PostSummary[];
    baseData: BaseData;
}> {
    module = module;

    get title(): string {
        return "Hediet's Blog";
    }

    render() {
        return (
            <PageFrame {...this.data.baseData}>
                {this.data.recentPosts.map((p, idx) => (
                    <div key={idx} className="postSummary">
                        <div className="postSummaryHeader">
                            <h2>
                                <Link to={p.ref}>{p.title}</Link>
                            </h2>
                            <div className="date">
                                {new Date(p.date).toLocaleDateString("en-US", {
                                    day: "numeric",
                                    year: "numeric",
                                    month: "short"
                                })}
                            </div>
                        </div>
                        <div className="preview">
                            <Link to={p.ref}>
                                <span>
                                    <ContentRenderer content={p.preview} />»
                                </span>
                            </Link>
                        </div>
                        {idx < this.data.recentPosts.length - 1 && <hr />}
                    </div>
                ))}
            </PageFrame>
        );
    }
}
