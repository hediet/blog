---
date: 2019-10-10
title: Implementing TypeScript Refactorings With Hot Reloading
github: { org: "hediet", repo: "hediet-ts-refactoring-lsp" }
---

This post is about how to implement a simple refactoring for TypesScript as a language service plugin that can be used in VS Code.
It showcases modern development techniques like hot reloading, test driven development and syntax tree visualizations in VS Code.

## Goal

When I want to pass a textual message to a function, I often start with a simple string literal enquoted in `"` but then notice that I want to include non-static variables.
However, rather than just concatenating the various string parts, I prefer to use string templates for that.
The goal of this post is to implement a refactoring that can convert from manually concatenated strings to string templates:

```ts
format("Hello " + name);

// After applying "Convert to template string":
format(`Hello ${name}`);
```

## Figuring out how to write a Language Service Plugin

I used [Writing a Language Service Plugin](https://github.com/microsoft/TypeScript/wiki/Writing-a-Language-Service-Plugin) as a starting point for a language service plugin.
With the help of autocompletion, I soon spotted `getApplicableRefactors` and `getEditsForRefactor` as the two functions of the language service to decorate for custom refactorings.

By using `getProgram` of the underlying lanugage service, the plugin can access the current syntax tree and the type checker.

I ended with the following project structure:

```ts
// src/index.ts: Entry point of the plugin, automatically loaded by the language server.
import * as ts from "typescript/lib/tsserverlibrary";
import { createDecoratedLanguageService } from "./createDecoratedLanguageService";

export = function init(modules: { typescript: typeof ts }) {
    return {
        // Is called by the TypeScript language server to get the decorated language service.
        create(info: ts.server.PluginCreateInfo): ts.LanguageService {
            // At runtime, use `modules.typescript` rather than importing "typescript".
            // This avoids version conflicts, in particular when new AST kinds are added.
            // Types however still must be imported from "typescript".
            return createLanguageServiceWithRefactorings(
                modules.typescript,
                info.languageService,
                info.project.projectService
            );
        }
    };
};
```

```ts
// src/createLanguageServiceWithRefactorings.ts
import * as ts from "typescript";

export function createLanguageServiceWithRefactorings(
    typescript: typeof ts,
    base: ts.LanguageService
): ts.LanguageService {
    return {
        ...base,

        getApplicableRefactors: (fileName, positionOrRange, preferences) => {
            const existing = base.getApplicableRefactors(
                fileName,
                positionOrRange,
                preferences
            );
            const refactorings = [];
            const program = base.getProgram();

            // TODO

            return [...refactorings, ...existing];
        },

        getEditsForRefactor: (
            fileName: string,
            formatOptions: ts.FormatCodeSettings,
            positionOrRange: number | ts.TextRange,
            refactorName: string,
            actionName: string,
            preferences: ts.UserPreferences | undefined
        ): ts.RefactorEditInfo | undefined => {
            const e = base.getEditsForRefactor(
                fileName,
                formatOptions,
                positionOrRange,
                refactorName,
                actionName,
                preferences
            );
            if (e) {
                return e;
            }
            const program = base.getProgram();

            // TODO

            return undefined;
        }
    };
}
```

And finally the file where the actual refactor logic should be implemented:

```ts
// src/ConvertToStringTemplateRefactoring.ts
export class ConvertToStringTemplateRefactoring {
    public static readonly refactoringName = "@hediet/ts-refactoring-lsp";
    public static readonly convertToStringTemplate = "convertToStringTemplate";

    // TODO
}
```

## Setting up Test and Debugging Environments

When programming against a very large and not very well documented API such as TypeScripts compiler API,
it is important to be able to test things quickly. Besides, it is very useful to have an easy way to attach a debugger.
I can recommend using Mocha and the Mocha Test Explorer for VS Code, which allows to run and debug arbitrary tests with a single click.

For testing, we need to mock a language service host, so we can easily define virtual TypeScript files.
We also want to have a way to specifiy markers in our virtual files
so we don't have to compute positions where to apply the refactoring by ourselves.
This can be implemented in a way so that the actual tests can be expressed like this:

```ts
// test/main.test.ts
import {
    testSingleFileLanguageService,
    expectRefactoring,
    expectNoRefactoring
} from "./utils";
import { ConvertToStringTemplateRefactoring } from "../src/ConvertToStringTemplateRefactoring";
import { createLanguageServiceWithRefactorings } from "../src/createLanguageServiceWithRefactorings";
import ts = require("typescript/lib/tsserverlibrary");

describe("convertStringConcatenationToStringTemplate", () => {
    const action = {
        refactoringName: ConvertToStringTemplateRefactoring.refactoringName,
        actionName: ConvertToStringTemplateRefactoring.convertToStringTemplate
    };

    const decorateWithRefactorings = (base: ts.LanguageService) =>
        createLanguageServiceWithRefactorings(ts, base);

    describe("Expect Refactoring", () => {
        // "|" is used as marker for where to trigger the refactoring.
        // `testSingleFileLanguageService` calls mocha's `it` with the program as name.
        testSingleFileLanguageService(
            `const str = "|hello";`,
            decorateWithRefactorings,
            expectRefactoring(action, "const str = `hello`;")
        );
        testSingleFileLanguageService(
            `const str = ("hello" |+ i) + 1;`,
            decorateWithRefactorings,
            expectRefactoring(action, "const str = `hello${i}${1}`;")
        );
    });

    describe("Expect No Refactoring", () => {
        testSingleFileLanguageService(
            `const str = "test";|`,
            decorateWithRefactorings,
            expectNoRefactoring(refactoringName)
        );
        testSingleFileLanguageService(
            `const str = (1 + "hello" |+ i) + 1;`,
            decorateWithRefactorings,
            expectNoRefactoring(refactoringName)
        );
    });
});
```

`testSingleFileLanguageService` is implemented as follows:

```ts
// test/utils.ts
// ...
type TestFn = (
    service: ts.LanguageService,
    markers: number[],
    mainFile: { name: string; content: string }
) => void;

/**
 * Describes a test for a given content with markers.
 * Prepares services and calles `testFn` to do the actual testing.
 */
export function testSingleFileLanguageService(
    content: string,
    decorator: (base: ts.LanguageService) => ts.LanguageService,
    testFn: TestFn
): void {
    it(content, () => {
        const main = stripMarkers(content);
        const mainFile = { name: "main.ts", content: main.stripped };
        const files = new Map<string, string>([
            [mainFile.name, mainFile.content]
        ]);
        const serviceHost = new MockLanguageServiceHost(files, {});
        const baseService = ts.createLanguageService(
            serviceHost,
            ts.createDocumentRegistry()
        );
        const decoratedService = decorator(baseService);
        testFn(decoratedService, main.markers, mainFile);
    });
}
// ...
```

See [`utils.ts`](https://github.com/hediet/hediet-ts-refactoring-lsp/blob/master/language-service-plugin/test/utils.ts) for the remaining implementations.

## Abstractions

At this point, we need to fix the todos in `getApplicableRefactors` and `getEditsForRefactor`.

In our case, for `getApplicableRefactors`, we need to identify the node at the given position
that can be converted into a string template.
For `getEditsForRefactor`, we also have to identify the node that should be refactored
and compute the edits that apply the refactoring.

To factor out the common identification of the node where the refactoring should be applied,
or generally to maintain context between `getApplicableRefactors` and `getEditsForRefactor`,
it seems an abstraction for how to implement refactorings might be useful. Ideally, `getApplicableRefactors` returns a function that provides the edits together with each returned refactoring. Our abstraction does that:

```ts
// src/RefactorProvider.ts
import * as ts from "typescript";

export abstract class RefactorProvider {
    constructor(
        protected readonly typescript: typeof ts,
        protected readonly base: ts.LanguageService
    ) {}

    /**
     * @param filter The filter that is applied to the returned refactors.
     * Can be used for performance optimizations.
     */
    abstract getRefactors(
        context: {
            program: ts.Program;
            positionOrRange: number | ts.TextRange;
            sourceFile: ts.SourceFile;
        },
        filter: RefactorFilter
    ): Refactor[];
}

export interface RefactorFilter {
    refactorName?: string;
    actionName?: string;
}

export interface Refactor {
    name: string;
    description: string;
    actions: RefactorAction[];
}

export interface RefactorAction {
    name: string;
    description: string;
    getEdits(
        formatOptions: ts.FormatCodeSettings,
        preferences: ts.UserPreferences | undefined
    ): ts.RefactorEditInfo | undefined;
}
```

Given a `RefactorProvider`, implementing `getApplicableRefactors` and `getEditsForRefactor` should be easy now.

## Implementing a RefactorProvider

In this phase it is extremely useful to have hot reloading and a way to easily attach a debugger.
`@hediet/node-reload` is a library that provides a fully featured hot reloading solution for Node JS.
[The Mocha Test Explorer Extension](https://marketplace.visualstudio.com/items?itemName=hbenl.vscode-mocha-test-adapter) for VS Code provides an easy way to debug mocha tests:

![](./mocha.png)

Alternatively, you can use my library [easy-attach](https://github.com/hediet/easy-attach) that works even without VS Code.

Equipped with hot reloading, the core class now looks like this:

```ts
// src/ConvertToStringTemplateRefactoring.ts
import {
    hotClass,
    enableHotReload,
    registerUpdateReconciler
} from "@hediet/node-reload";
import * as ts from "typescript";
import { RefactorProvider, Refactor } from "./RefactorProvider";

enableHotReload({ entryModule: module });

// Automatically reloads the new module when it changed
registerUpdateReconciler(module);

// Marks all methods of the class as hot.
// Hot methods are automatically restarted
// when they have been changed while being executed.
@hotClass(module)
export class ConvertToStringTemplateRefactoring extends RefactorProvider {
    public static readonly refactoringName = "@hediet/ts-refactoring-lsp";
    public static readonly convertToStringTemplate = "convertToStringTemplate";

    getRefactors(
        context: {
            program: ts.Program;
            positionOrRange: number | ts.TextRange;
            sourceFile: ts.SourceFile;
        },
        filter: RefactorFilter
    ): Refactor[] {
        // todo
        debugger;
        return [];
    }
}
```

For hot reloading to work with TypeScript, `tsc` must be started in watch mode (or alternatively `ts-node` can be used).

At this point, we can already start debugging the tests.
As you can see, if the currently executed method is changed, it is simply reexecuted when continuing.
This is almost like an inline playground for refactorings:

![](./hot-reload-demo.gif)

The actual implementation is easy now.
In `getApplicableRefactors`, all actions must be listed that can be invoked at that position.
`getEditsForRefactor` then computes how a given action affects the source code.

For our refactoring, we need to find out which AST leaf is at `positionOrRange`,
then we navigate the AST tree upwards until we are not in a binary expression anymore.
If the very left node of the last binary expression is a string, we can suggest to convert that expression tree to a single template string.

## Distribute the plugin through a VS Code Extension

This is especially easy when the VS Code extension and the language server plugin are organized in a yarn workspace.
Simply add a `typescriptServerPlugins` key to the `contributes` section of the `package.json` of your VS Code extension. The name refers to the name of the plugin's `package.json`.

```json
{
    // ...
    "contributes": {
        "typescriptServerPlugins": [
            {
                "enableForWorkspaceTypeScriptVersions": true,
                "name": "@hediet/ts-refactoring-lsp"
            }
        ]
    }
    // ...
}
```
