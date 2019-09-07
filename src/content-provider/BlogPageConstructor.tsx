import { BaseData, Content } from "../content-presenter/components";
import { Page } from "@hediet/static-page";

export interface BlogPageConstructor {
    readonly title: string;
    readonly date: Date;
    readonly preview: Content;
    createPage(baseData: BaseData): Page;
}
