export declare function requireModule(name: string): string;
export declare function importModule(name: string): string;
export declare function formatFilename(name: string): string;
export declare function classExpression(clazz: {
    moduleId: string;
    exportName: string;
}): string;
export declare function fromEntries<T = any>(entries: Iterable<readonly [PropertyKey, T]>): {
    [k in PropertyKey]: T;
};
//# sourceMappingURL=utils.d.ts.map