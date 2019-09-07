import { WebpackConfigBuilder } from "@hediet/static-page/dist/content-provider";
import MyWebsite from "./src/content-provider";
import webpack = require("webpack");
import { join } from "path";
import * as CopyPlugin from "copy-webpack-plugin";

async function load(): Promise<webpack.Configuration> {
    const config = new WebpackConfigBuilder({
        routes: await new MyWebsite().getPages(),
        outputPath: join(__dirname, "./dist")
    }).buildConfig();
    config.plugins!.push(
        new CopyPlugin([
            {
                from: join(__dirname, "./static-assets"),
                to: join(__dirname, "./dist")
            }
        ])
    );
    return config;
}

module.exports = load();
