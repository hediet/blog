export function requireModule(name: string): string {
    return `require(${formatFilename(name)})`;
}

export function importModule(name: string): string {
    return `import(${formatFilename(name)})`;
}

export function formatFilename(name: string): string {
    return JSON.stringify(name);
}

export function classExpression(clazz: {
    moduleId: string;
    exportName: string;
}): string {
    return `(${requireModule(clazz.moduleId)}[${JSON.stringify(
        clazz.exportName
    )}])`;
}

export function fromEntries<T = any>(
    entries: Iterable<readonly [PropertyKey, T]>
): { [k in PropertyKey]: T } {
    return [...entries].reduce(
        (obj, { 0: key, 1: val }) => Object.assign(obj, { [key]: val }),
        {}
    );
}
