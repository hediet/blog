import * as webpack from "webpack";

export class AddAssetPlugin implements webpack.Plugin {
    constructor(public readonly assets: Record<string, string>) {}

    apply(compiler: webpack.Compiler) {
        compiler.hooks.emit.tapPromise("AddAssetPlugin", async compilation => {
            for (const [name, asset] of Object.entries(this.assets)) {
                compilation.assets[name] = {
                    source: () => asset,
                    size: () => asset.length
                };
            }
        });
    }
}
