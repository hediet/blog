import * as webpack from "webpack";

export class HtmlDependencyWebpackPlugin {
    apply(compiler: any) {
        compiler.plugin(
            "compilation",
            (compilation: webpack.compilation.Compilation) => {
                compilation.plugin(
                    "html-webpack-plugin-alter-chunks",
                    (chunks: any, init: any) => {
                        const stats = compilation.getStats().toJson();
                        const allChunks = stats.chunks!;
                        const entrypoint = init.plugin.options.entry;
                        const entry = stats.entrypoints![entrypoint];

                        if (!entry) {
                            throw new Error(
                                `Entry ${entrypoint} does not exist.`
                            );
                        }

                        return entry.chunks.map((chunkId: number | number) => {
                            let c = allChunks[chunkId];

                            if (!c) {
                                c = allChunks.find(c => c.id === chunkId)!;
                            }

                            if (!c) {
                                throw new Error(
                                    `Did not find chunk "${chunkId}"!`
                                );
                            }

                            return c;
                        });
                    }
                );
            }
        );
    }
}
