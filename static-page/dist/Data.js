"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Asset {
}
exports.Asset = Asset;
class RuntimeAsset extends Asset {
    constructor(url) {
        super();
        this.url = url;
    }
}
RuntimeAsset.moduleId = module.filename;
RuntimeAsset.exportName = RuntimeAsset.name;
exports.RuntimeAsset = RuntimeAsset;
class CompiletimeAsset extends Asset {
    constructor(path) {
        super();
        this.path = path;
    }
    get url() {
        throw new Error("Only for runtime");
    }
}
exports.CompiletimeAsset = CompiletimeAsset;
//# sourceMappingURL=Data.js.map