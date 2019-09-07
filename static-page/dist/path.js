"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const page_1 = require("./page");
class Path {
    constructor(parts) {
        this.parts = parts;
    }
    toString() {
        return "/" + this.parts.join("/");
    }
    ref() {
        return new page_1.ContentProviderRouteRef(this);
    }
}
exports.Path = Path;
function path(parts) {
    return new Path(parts);
}
exports.path = path;
path.default = path([]);
//# sourceMappingURL=path.js.map