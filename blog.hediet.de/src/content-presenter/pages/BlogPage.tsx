import React = require("react");
import { PageWithRouter } from "@hediet/static-page";
import {
    BlogDate,
    Content,
    BaseData,
    BasePage,
    ContentRenderer,
    GithubBadge
} from "../components";

export type BlogPost = {
    title: string;
    content: Content;
    date: string;
    github?: { org: string; repo: string };
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
        const post = this.data.post;
        return (
            <BasePage {...this.data.baseData}>
                <h1>{post.title}</h1>

                <div className="badges" style={{ display: "flex" }}>
                    <BlogDate date={new Date(post.date)} />
                    {post.github && (
                        <div style={{ marginLeft: "auto" }}>
                            <GithubBadge
                                org={post.github.org}
                                repo={post.github.repo}
                            />
                        </div>
                    )}
                </div>
                <ContentRenderer content={post.content} />
            </BasePage>
        );
    }
}
