import React = require("react");
import { toJS } from "mobx";
import { Asset } from "@hediet/static-page";

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
    | { kind: "image"; asset: Asset };

export function text(value: string): Content {
    return {
        kind: "text",
        value
    };
}

export class ContentRenderer extends React.Component<{ content: Content }> {
    render() {
        return renderContent(this.props.content);
    }
}

type Narrow<T extends { kind: string }, TId> = T extends { kind: TId }
    ? T
    : never;

function renderContent(content: Content, key: number = 0): React.ReactElement {
    const handlers: {
        [TKey in Content["kind"]]: (
            content: Narrow<Content, TKey>
        ) => React.ReactElement
    } = {
        list: c => <div key={key}>{c.items.map(renderContent)}</div>,
        emphasis: c => <i key={key}>{renderContent(c.body)}</i>,
        strong: c => <b key={key}>{renderContent(c.body)}</b>,
        paragraph: c => <p key={key}>{renderContent(c.body)}</p>,
        text: c => <span key={key}>{c.value}</span>,
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
            <pre className={`language-${c.lang}`}>
                <code
                    className={`language-${c.lang}`}
                    dangerouslySetInnerHTML={{ __html: c.html }}
                />
            </pre>
        )
    };

    const h = handlers[content.kind];
    if (!h) {
        console.log(toJS(content));
        throw new Error(`No handler for "${content.kind}".`);
    }
    return h(content as any);
}
