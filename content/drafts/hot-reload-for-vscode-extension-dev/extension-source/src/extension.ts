import {
    enableHotReload,
    registerUpdateReconciler,
    hotRequireExportedFn,
    hotRequire
} from "@hediet/node-reload";
import { Disposable } from "@hediet/std/disposable";
import * as vscode from "vscode";

if (process.env.NODE_ENV === "development") {
    enableHotReload({ entryModule: module });
}
registerUpdateReconciler(module);

export function activate(context: vscode.ExtensionContext) {
    context.subscriptions.push(
        hotRequire<typeof import("./logic")>(module, "./logic", logic => {
            // This callback is called immediately
            // and whenever "./logic"
            // or one of its dependencies changes.
            // We simply instantiate our extension again on every change.
            // `dispose` is called on previously returned instances.
            return new logic.MyExtension();
        })
    );

    context.subscriptions.push(
        hotRequireExportedFn(
            module,
            MyExtension,
            MyExtension => new MyExtension()
        )
    );
}

export class MyExtension {
    dispose = Disposable.fn();
    constructor() {
        const item = this.dispose.track(vscode.window.createStatusBarItem());
        item.text = "Hello World!";
        item.color = "white";
        item.show();
    }
}
