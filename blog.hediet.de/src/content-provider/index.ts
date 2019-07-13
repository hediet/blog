import {
    enableHotReload,
    hotRequireExportedFn,
    registerUpdateReconciler
} from "@hediet/node-reload";
enableHotReload({ entryModule: module });

import { Path, path } from "@hediet/static-page";
import {
    DynamicRoutes,
    Route,
    Routes,
    WebsiteContentProvider
} from "@hediet/static-page/dist/content-provider";
import { readFileSync } from "fs";
import "ignore-styles";
import { dirname, join } from "path";
import { Content, text } from "../content-presenter/components/Content";
import { BlogPage } from "../content-presenter/pages/BlogPage";
import { MainPage } from "../content-presenter/pages/MainPage";
import { MonacoPage } from "../content-presenter/pages/MonacoPage";
import { markdownStringToContent } from "./markdownConverter";
import * as glob from "glob";

registerUpdateReconciler(module);

export default class MyWebsite implements WebsiteContentProvider {
    async getPages(): Promise<Routes> {
        const routes = new DynamicRoutes([]);
        hotRequireExportedFn(
            module,
            getPages,
            { hasFnChanged: "yes" },
            getPages => {
                if (typeof getPages === "function") {
                    routes.updateRoutes(getPages());
                }
            }
        );
        return routes;
    }
}

export function getPages(): Route[] {
    const blogPosts = getPosts();

    return [
        new Route(
            path(["monaco"]),
            new MonacoPage({
                baseData: {
                    index: path.default.ref()
                }
            })
        ),
        new Route(
            path.default,
            new MainPage({
                baseData: {
                    index: path.default.ref()
                },
                recentPosts: blogPosts.map(p => ({
                    title: p.title,
                    ref: blogPostPath(p.id).ref()
                }))
            })
        ),
        ...blogPosts.map(
            p =>
                new Route(
                    blogPostPath(p.id),
                    new BlogPage({
                        baseData: {
                            index: path.default.ref()
                        },
                        post: {
                            title: p.title,
                            content: p.content
                        }
                    })
                )
        )
    ];
}

function blogPostPath(id: string): Path {
    return path(["post", id]);
}

interface Post {
    id: string;
    date: Date;
    title: string;
    content: Content;
}

function getPosts(): Post[] {
    const cwd = join(__dirname, "../../../content/posts");
    const posts = glob.sync("**/*.post.md", {
        cwd
    });
    return posts.map(filename => {
        return parsePost(join(cwd, filename));
    });
}

function parsePost(markdownFile: string): Post {
    const markdown = readFileSync(markdownFile, { encoding: "utf8" });
    let date: Date | undefined;
    let title: string | undefined;
    const content = markdownStringToContent(markdown, {
        basedir: dirname(markdownFile),
        setDate(d) {
            date = d;
        },
        setTitle(t) {
            title = t;
        }
    });

    if (!date) {
        throw new Error("Post without date");
    }
    if (!title) {
        throw new Error("Post without title");
    }

    const id = title.toLowerCase().replace(/\s/g, "_");

    return {
        content,
        date,
        title,
        id
    };
}
