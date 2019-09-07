import { Content } from "../content-presenter/components/Content";
import * as remarkAbstract from "remark";
import { Root, Item } from "remark";
import { CompiletimeAsset } from "@hediet/static-page";
import { join } from "path";
import * as Prism from "prismjs";
import * as mdfrontmatter from "remark-frontmatter";
import * as yaml from "js-yaml";

export interface MarkdownContext {
    readonly basedir: string;
}

export function markdownStringToContent(
    markdown: string,
    context: MarkdownContext
): {
    content: Content;
    date: Date;
    title: string;
    meta: Record<string, unknown>;
} {
    const remark = remarkAbstract();
    const ast: Root = remark.use(mdfrontmatter).parse(markdown);
    const c2: MarkdownContext2 = {
        basedir: context.basedir,
        date: undefined,
        title: undefined,
        meta: {}
    };
    const content = markdownToContent(ast, c2);
    return {
        content,
        date: c2.date!,
        title: c2.title!,
        meta: c2.meta
    };
}

interface MarkdownContext2 extends MarkdownContext {
    title: string | undefined;
    date: Date | undefined;
    meta: Record<string, unknown>;
}

type Narrow<T extends { type: string }, TId> = T extends { type: TId }
    ? T
    : never;

function mapArray(items: Item[], context: MarkdownContext2): Content {
    return {
        kind: "list",
        items: items.map(i => markdownToContent(i, context))
    };
}

function markdownToContent(
    node: Item | Root,
    context: MarkdownContext2
): Content {
    const handlers: {
        [TKey in (Item | Root)["type"]]: (
            content: Narrow<Item | Root, TKey>
        ) => Content;
    } = {
        root: item => mapArray(item.children, context),
        text: item => ({ kind: "text", value: item.value }),
        emphasis: item => ({
            kind: "emphasis",
            body: mapArray(item.children, context)
        }),
        strong: item => ({
            kind: "strong",
            body: mapArray(item.children, context)
        }),
        paragraph: item => ({
            kind: "paragraph",
            body: mapArray(item.children, context)
        }),
        code: item => {
            let lang = item.lang;
            if (lang === "js") {
                lang = "javascript";
            }

            if (!Prism.languages[lang]) {
                lang = "javascript";
            }

            const html = Prism.highlight(
                item.value,
                Prism.languages[lang],
                lang
            );

            return {
                kind: "code",
                // code: item.value,
                html: html,
                lang: item.lang
            };
        },
        inlineCode: item => ({
            kind: "inlineCode",
            code: item.value
        }),
        link: item => ({
            kind: "link",
            body: mapArray(item.children, context),
            url: item.url
        }),
        list: item => ({ kind: "text", value: "not supported" }),
        thematicBreak: item => ({ kind: "text", value: "not supported" }),
        toml: item => ({ kind: "text", value: "not supported" }),
        yaml: item => {
            const doc = yaml.load(item.value) as {
                title: string;
                date: string;
            };
            if (doc.title) {
                context.title = doc.title;
            }
            if (doc.date) {
                context.date = new Date(doc.date);
            }
            Object.assign(context.meta, doc);
            return {
                kind: "list",
                items: []
            };
        },
        heading: item => {
            return {
                kind: "heading",
                depth: item.depth,
                body: mapArray(item.children, context)
            };
        },
        image: item => ({
            kind: "image",
            asset: new CompiletimeAsset(join(context.basedir, item.url))
        })
    };

    const h = handlers[node.type];
    if (!h) {
        throw new Error(`unknown type: ${node.type}`);
    }
    return h(node as any);
}
