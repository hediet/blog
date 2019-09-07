import React = require("react");
import { toJS, observable } from "mobx";
import { Asset } from "@hediet/static-page";
import classNames = require("classnames");
import { observer } from "mobx-react";

export type Content =
    | { kind: "list"; items: ReadonlyArray<Content> }
    | { kind: "paragraph"; body: Content }
    | { kind: "emphasis"; body: Content }
    | { kind: "strong"; body: Content }
    | { kind: "strong"; body: Content }
    | { kind: "text"; value: string }
    | { kind: "heading"; depth: number; body: Content }
    | { kind: "inlineCode"; code: string }
    | { kind: "code"; /*code: string;*/ lang: string; html: string }
    | { kind: "image"; asset: Asset }
    | { kind: "badge"; text: string }
    | { kind: "link"; url: string; body: Content };

export function preview(content: Content): Content {
    return generatePreview(content, { availableWordCount: 70 });
}

export function toText(content: Content): string {
    const handlers: {
        [TKey in Content["kind"]]: (content: Narrow<Content, TKey>) => string;
    } = {
        list: c => c.items.map(i => toText(i)).join(""),
        emphasis: c => toText(c.body),
        strong: c => toText(c.body),
        paragraph: c => toText(c.body),
        text: c => c.value,
        heading: c => toText(c.body),
        inlineCode: c => `\`${c.code}\``,
        image: c => "(Image)",
        code: c => "(Code)",
        badge: c => "",
        link: c => toText(c.body)
    };

    const h = handlers[content.kind];
    if (!h) {
        console.log(toJS(content));
        throw new Error(`No handler for "${content.kind}".`);
    }
    return h(content as any);
}

function generatePreview(
    content: Content,
    context: { availableWordCount: number }
): Content {
    if (context.availableWordCount === 0) {
        return { kind: "list", items: [] };
    }

    const handlers: {
        [TKey in Content["kind"]]: (content: Narrow<Content, TKey>) => Content;
    } = {
        list: c => ({
            kind: "list",
            items: c.items.map(i => generatePreview(i, context))
        }),
        emphasis: c => ({
            kind: "emphasis",
            body: generatePreview(c.body, context)
        }),
        strong: c => ({
            kind: "strong",
            body: generatePreview(c.body, context)
        }),
        paragraph: c => generatePreview(c.body, context),
        text: c => {
            const words = c.value.split(/\s/);
            words.length = Math.min(words.length, context.availableWordCount);
            context.availableWordCount -= words.length;
            return text(words.join(" "));
        },
        link: c => ({
            kind: "link",
            url: c.url,
            body: generatePreview(c.body, context)
        }),
        heading: c => {
            context.availableWordCount = 0;
            return { kind: "list", items: [] };
        },
        inlineCode: c => {
            context.availableWordCount = Math.max(
                0,
                context.availableWordCount - 2
            );
            return c;
        },
        image: c => ({ kind: "badge", text: "Image" }),
        code: c => ({ kind: "badge", text: "Code" }),
        badge: c => c
    };

    const h = handlers[content.kind];
    if (!h) {
        console.log(toJS(content));
        throw new Error(`No handler for "${content.kind}".`);
    }
    return h(content as any);
}

export function text(value: string): Content {
    return {
        kind: "text",
        value
    };
}

@observer
export class ContentRenderer extends React.Component<{ content: Content }> {
    render() {
        return renderContent(this.props.content);
    }
}

type Narrow<T extends { kind: string }, TId> = T extends { kind: TId }
    ? T
    : never;

const codeOptions = observable({ wrapCode: false });

function renderContent(content: Content, key: number = 0): React.ReactElement {
    const handlers: {
        [TKey in Content["kind"]]: (
            content: Narrow<Content, TKey>
        ) => React.ReactElement;
    } = {
        list: c => (
            <React.Fragment key={key}>
                {c.items.map(renderContent)}
            </React.Fragment>
        ),
        emphasis: c => <i key={key}>{renderContent(c.body)}</i>,
        strong: c => <b key={key}>{renderContent(c.body)}</b>,
        paragraph: c => <p key={key}>{renderContent(c.body)}</p>,
        text: c => <span key={key}>{c.value}</span>,
        link: c => (
            <a key={key} href={c.url}>
                {renderContent(c.body)}
            </a>
        ),
        heading: c => {
            const Heading = `h${c.depth}` as any;
            return <Heading key={key}>{renderContent(c.body)}</Heading>;
        },
        inlineCode: c => (
            <code key={key} className="inlineCode">
                {c.code}
            </code>
        ),
        image: c => <img key={key} src={c.asset.url} />,
        code: c => (
            <pre
                key={key}
                className={classNames(
                    `language-${c.lang}`,
                    codeOptions.wrapCode && "wrap"
                )}
                onClick={s => (codeOptions.wrapCode = !codeOptions.wrapCode)}
            >
                <code
                    className={`language-${c.lang}`}
                    dangerouslySetInnerHTML={{ __html: c.html }}
                />
            </pre>
        ),
        badge: c => (
            <span key={key} className="badge">
                {c.text}
            </span>
        )
    };

    const h = handlers[content.kind];
    if (!h) {
        console.log(toJS(content));
        throw new Error(`No handler for "${content.kind}".`);
    }
    return h(content as any);
}
