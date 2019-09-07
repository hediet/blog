"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const router_1 = require("../router");
function Link(props) {
    return (React.createElement(router_1.RouterConsumer, null, r => (React.createElement("a", { onClick: e => {
            r.navigateTo(props.to);
            e.preventDefault();
            e.stopPropagation();
        }, href: props.to.getUrl() }, props.children))));
}
exports.Link = Link;
//# sourceMappingURL=Link.js.map