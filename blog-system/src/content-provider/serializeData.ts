import { Data, Asset, CompiletimeAsset, RuntimeAsset } from "../Data";
import { RouteRef, RouteIndexProvider } from "..";
import { DetailedRoutes, classExpression } from "./WebpackConfigBuilder";

export function serializeData(
    obj: Data,
    routes: DetailedRoutes | null
): string {
    if (
        typeof obj === "boolean" ||
        typeof obj === "string" ||
        typeof obj === "number"
    ) {
        return JSON.stringify(obj);
    }

    if (obj === null) {
        return "null";
    } else if (obj === undefined) {
        return "undefined";
    }

    if (typeof obj === "object") {
        if (Array.isArray(obj)) {
            let result = "[";
            let first = true;
            for (const item of obj) {
                if (!first) {
                    result += ",";
                } else {
                    first = false;
                }
                result += serializeData(item, routes);
            }
            result += `]`;
            return result;
        } else if (obj instanceof RouteRef) {
            const data = routes!.getRouteData(obj.path);
            if (!data) {
                throw new Error();
            }
            return data.runtimeRouteRefExpression();
        } else if (obj instanceof RouteIndexProvider) {
            return routes!.runtimeRouteIndexExpression();
        } else if (obj instanceof CompiletimeAsset) {
            return `new ${classExpression(
                RuntimeAsset
            )}(require("${JSON.stringify(obj.path).substr(1)}))`;
        } else {
            let result = "{";
            let first = true;
            for (const [key, val] of Object.entries(obj)) {
                if (!first) {
                    result += ",";
                } else {
                    first = false;
                }
                result += `${JSON.stringify(key)}:${serializeData(
                    val,
                    routes
                )}`;
            }
            result += `}`;
            return result;
        }
    }

    throw new Error(`Not supported: "${obj}"`);
}
