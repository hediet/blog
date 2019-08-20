import React = require("react");
import { PageWithRouter } from "@hediet/static-page";
import {
    BlogDate,
    Content,
    BaseData,
    BasePage,
    ContentRenderer
} from "../components";

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
                <BlogDate date={new Date(this.data.post.date)} />
                <ContentRenderer content={this.data.post.content} />
            </BasePage>
        );
    }
}
