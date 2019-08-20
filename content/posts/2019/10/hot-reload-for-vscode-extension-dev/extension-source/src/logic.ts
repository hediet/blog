import * as vscode from "vscode";
import { Disposable } from "@hediet/std/disposable";
export class MyExtension {
    dispose = Disposable.fn();
    constructor() {
        const item = this.dispose.track(vscode.window.createStatusBarItem());
        item.text = "Hello World!";
        item.color = "yellow";
        item.show();
    }
}
