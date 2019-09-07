import * as webpack from "webpack";
export declare class AddAssetPlugin implements webpack.Plugin {
    readonly assets: Record<string, string>;
    constructor(assets: Record<string, string>);
    apply(compiler: webpack.Compiler): void;
}
//# sourceMappingURL=AddAssetsPlugin.d.ts.map