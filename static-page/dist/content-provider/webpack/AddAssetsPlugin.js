"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class AddAssetPlugin {
    constructor(assets) {
        this.assets = assets;
    }
    apply(compiler) {
        compiler.hooks.emit.tapPromise("AddAssetPlugin", async (compilation) => {
            for (const [name, asset] of Object.entries(this.assets)) {
                compilation.assets[name] = {
                    source: () => asset,
                    size: () => asset.length
                };
            }
        });
    }
}
exports.AddAssetPlugin = AddAssetPlugin;
//# sourceMappingURL=AddAssetsPlugin.js.map