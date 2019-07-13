declare module "webpack-virtual-modules" {
    import w = require("webpack");
    class VirtualClass implements w.Plugin {
        public constructor();

        writeModule(name: string, content: string): void;
        apply(compiler: Compiler): void;
    }

    export = VirtualClass;
}
