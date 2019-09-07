"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = require("..");
function serializeData(obj, routes) {
    if (typeof obj === "boolean" ||
        typeof obj === "string" ||
        typeof obj === "number") {
        return JSON.stringify(obj);
    }
    if (obj === null) {
        return "null";
    }
    else if (obj === undefined) {
        return "undefined";
    }
    if (typeof obj === "object") {
        if (Array.isArray(obj)) {
            let result = "[";
            let first = true;
            for (const item of obj) {
                if (!first) {
                    result += ",";
                }
                else {
                    first = false;
                }
                result += serializeData(item, routes);
            }
            result += `]`;
            return result;
        }
        else if (obj instanceof __1.RouteRef) {
            const data = routes.getRouteData(obj.path);
            if (!data) {
                throw new Error();
            }
            return data.runtimeRouteRefExpression();
        }
        else if (obj instanceof __1.RouteIndexProvider) {
            return routes.runtimeRouteIndexExpression();
        }
        else {
            let result = "{";
            let first = true;
            for (const [key, val] of Object.entries(obj)) {
                if (!first) {
                    result += ",";
                }
                else {
                    first = false;
                }
                result += `${JSON.stringify(key)}:${serializeData(val, routes)}`;
            }
            result += `}`;
            return result;
        }
    }
    throw new Error(`Not supported: "${obj}"`);
}
exports.serializeData = serializeData;
//# sourceMappingURL=dataSerializer.js.map