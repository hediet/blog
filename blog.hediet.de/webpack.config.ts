import { WebpackConfigBuilder } from "@hediet/static-page/dist/content-provider";
import MyWebsite from "./src/content-provider";
import webpack = require("webpack");
import { join } from "path";

async function load(): Promise<webpack.Configuration> {
    return new WebpackConfigBuilder({
        routes: await new MyWebsite().getPages(),
        outputPath: join(__dirname, "./dist")
    }).buildConfig();
}

module.exports = load();
