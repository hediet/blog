import * as monaco from "../monaco";
import React = require("react");
import { BasePage, BaseData } from "../components/BasePage";
import { Page, PageWithRouter } from "@hediet/static-page";

export class MonacoPage extends PageWithRouter<{ baseData: BaseData }> {
    module = module;

    render() {
        return (
            <BasePage {...this.data.baseData}>
                <h1>Rx JS Playground</h1>
                <MyComp />
            </BasePage>
        );
    }
}

class MyComp extends React.Component {
    componentDidMount() {
        monaco.editor.create(document.getElementById("container")!, {
            value: 'console.log("Hello, world")',
            language: "javascript",
            automaticLayout: true
        });
    }

    render() {
        return <div id="container" style={{ height: 500, width: "100%" }} />;
    }
}
