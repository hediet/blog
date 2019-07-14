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
                    preview: preview(p.content),
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
                            content: p.content,
                            date: p.date.toString()
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
    // aa
    return posts.map(filename => {
        return parsePost(join(cwd, filename));
    });
}

function parsePost(markdownFile: string): Post {
    const markdown = readFileSync(markdownFile, { encoding: "utf8" });
    const { content, date, title } = markdownStringToContent(markdown, {
        basedir: dirname(markdownFile)
    });
    const id = title.toLowerCase().replace(/\s/g, "_");

    return {
        content,
        date,
        title,
        id
    };
}
