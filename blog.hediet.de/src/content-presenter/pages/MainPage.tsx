import React = require("react");
import { BasePage, BaseData } from "../components/BasePage";
import { RouteRef, Page, Link, PageWithRouter } from "@hediet/static-page";

export type PostSummary = {
    title: string;
    ref: RouteRef;
};

export class MainPage extends PageWithRouter<{
    recentPosts: PostSummary[];
    baseData: BaseData;
}> {
    module = module;

    render() {
        return (
            <BasePage {...this.data.baseData}>
                {this.data.recentPosts.map((p, idx) => (
                    <div key={idx}>
                        title: {p.title}, <Link to={p.ref}>link</Link>
                    </div>
                ))}
            </BasePage>
        );
    }
}
