import React = require("react");
import { BasePage, BaseData } from "../components/BasePage";
import { PageWithRouter } from "@hediet/static-page";
import { Content, ContentRenderer } from "../components/Content";

export type BlogPost = {
    title: string;
    content: Content;
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
                <ContentRenderer content={this.data.post.content} />
            </BasePage>
        );
    }
}
