import {
    enableHotReload,
    hotRequireExportedFn,
    registerUpdateReconciler
} from "@hediet/node-reload";
enableHotReload({ entryModule: module });

import { Path, path, Page } from "@hediet/static-page";
import {
    DynamicRoutes,
    Route,
    Routes,
    WebsiteContentProvider
} from "@hediet/static-page/dist/content-provider";
import { readFileSync } from "fs";
import "ignore-styles";
import { dirname, join } from "path";
import {
    Content,
    text,
    preview
} from "../content-presenter/components/Content";
import { BlogPage } from "../content-presenter/pages/BlogPage";
import { MainPage } from "../content-presenter/pages/MainPage";
import { MonacoPage } from "../content-presenter/pages/MonacoPage";
import { markdownStringToContent } from "./markdownConverter";
import * as glob from "glob";
import { BlogPageConstructor } from "./BlogPageConstructor";
import { BaseData } from "../content-presenter/components";

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
                    date: p.date.toString(),
                    preview: p.preview,
                    ref: blogPostPath(p.id).ref()
                }))
            })
        ),
        ...blogPosts.map(
            p =>
                new Route(
                    blogPostPath(p.id),
                    p.createPage({
                        index: path.default.ref()
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
    preview: Content;
    createPage(baseData: BaseData): Page;
}

function getPosts(): Post[] {
    const cwd = join(__dirname, "../../../content/posts");
    const posts = glob.sync("**/*.post.*", {
        cwd
    });

    const parsedPosts = posts.map(filename => {
        const fullFilename = join(cwd, filename);
        if (filename.endsWith(".tsx")) {
            const page = require(fullFilename).default as BlogPageConstructor;
            const id = titleToId(page.title);
            const p: Post = {
                id,
                title: page.title,
                date: page.date,
                preview: page.preview,
                createPage(baseData) {
                    return page.createPage(baseData);
                }
            };
            return p;
        } else {
            return parseMarkdownPost(fullFilename);
        }
    });

    parsedPosts.sort((a, b) => b.date.getTime() - a.date.getTime());
    return parsedPosts;
}

function titleToId(title: string): string {
    return title.toLowerCase().replace(/\s/g, "_");
}

function parseMarkdownPost(markdownFile: string): Post {
    const markdown = readFileSync(markdownFile, { encoding: "utf8" });
    const { content, date, title, meta } = markdownStringToContent(markdown, {
        basedir: dirname(markdownFile)
    });
    const id = titleToId(title);

    return {
        createPage: baseData =>
            new BlogPage({
                baseData,
                post: {
                    title,
                    content,
                    date: date.toString(),
                    github: meta.github as any
                }
            }),
        get preview() {
            return preview(content);
        },
        date,
        title,
        id
    };
}
