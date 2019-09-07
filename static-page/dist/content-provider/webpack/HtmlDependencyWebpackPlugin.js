"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class HtmlDependencyWebpackPlugin {
    apply(compiler) {
        compiler.plugin("compilation", (compilation) => {
            compilation.plugin("html-webpack-plugin-alter-chunks", (chunks, init) => {
                const stats = compilation.getStats().toJson();
                const allChunks = stats.chunks;
                const entrypoint = init.plugin.options.entry;
                const entry = stats.entrypoints[entrypoint];
                if (!entry) {
                    throw new Error(`Entry ${entrypoint} does not exist.`);
                }
                return entry.chunks.map((chunkId) => {
                    let c = allChunks[chunkId];
                    if (!c) {
                        c = allChunks.find(c => c.id === chunkId);
                    }
                    if (!c) {
                        throw new Error(`Did not find chunk "${chunkId}"!`);
                    }
                    return c;
                });
            });
        });
    }
}
exports.HtmlDependencyWebpackPlugin = HtmlDependencyWebpackPlugin;
//# sourceMappingURL=HtmlDependencyWebpackPlugin.js.map