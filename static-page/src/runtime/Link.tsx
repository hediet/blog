import * as React from "react";
import { RouteRef } from "../page";
import { ReactRouter, RouterConsumer } from "../router";

export function Link(props: {
    to: RouteRef;
    children: React.ReactChild;
}): React.ReactElement {
    return (
        <RouterConsumer>
            {r => (
                <a
                    onClick={e => {
                        r!.navigateTo(props.to);
                        e.preventDefault();
                        e.stopPropagation();
                    }}
                    href={props.to.getUrl()}
                >
                    {props.children}
                </a>
            )}
        </RouterConsumer>
    );
}
