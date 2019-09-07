import * as monaco from "monaco-editor";

let m: typeof monaco;
if (typeof window !== "undefined") {
    m = require("monaco-editor");
} else {
    m = null!;
}

export = m;
