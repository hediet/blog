import React = require("react");
import { BasePage, BaseData } from "../components/BasePage";
import { PageWithRouter } from "@hediet/static-page";
import { Content, ContentRenderer } from "../components/Content";

export type BlogPost = {
    title: string;
    content: Content;
    date: string;
};

export class BlogPage extends PageWithRouter<{
    post: BlogPost;
    baseData: BaseData;
}> {
    module = module;

    get title() {
        return this.data.post.title;
    }

    render() {
        return (
            <BasePage {...this.data.baseData}>
                <h1>{this.data.post.title}</h1>
                <div className="date">
                    {new Date(this.data.post.date).toLocaleDateString("en-US", {
                        day: "numeric",
                        year: "numeric",
                        month: "short"
                    })}
                </div>
                <ContentRenderer content={this.data.post.content} />
            </BasePage>
        );
    }
}
