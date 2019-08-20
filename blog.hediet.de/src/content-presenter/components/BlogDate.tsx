import React = require("react");

export function BlogDate(props: { date: Date }) {
    return (
        <div className="component-BlogDate">
            {new Date(props.date).toLocaleDateString("en-US", {
                day: "numeric",
                year: "numeric",
                month: "short"
            })}
        </div>
    );
}
