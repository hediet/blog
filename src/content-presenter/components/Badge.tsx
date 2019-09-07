import React = require("react");

export function GithubBadge(props: { org: string; repo: string }) {
    const text = `github.com/${props.org}/${props.repo}`;
    return (
        <a href={`https://github.com/${props.org}/${props.repo}`}>
            <img
                alt="github repo"
                style={{ border: "none" }}
                src={`https://img.shields.io/badge/repo-${encodeURI(
                    text
                ).replace(/-/g, "--")}-informational.svg`}
            />
        </a>
    );
}
