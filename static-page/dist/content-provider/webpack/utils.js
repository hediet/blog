"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function requireModule(name) {
    return `require(${formatFilename(name)})`;
}
exports.requireModule = requireModule;
function importModule(name) {
    return `import(${formatFilename(name)})`;
}
exports.importModule = importModule;
function formatFilename(name) {
    return JSON.stringify(name);
}
exports.formatFilename = formatFilename;
function classExpression(clazz) {
    return `(${requireModule(clazz.moduleId)}[${JSON.stringify(clazz.exportName)}])`;
}
exports.classExpression = classExpression;
function fromEntries(entries) {
    return [...entries].reduce((obj, { 0: key, 1: val }) => Object.assign(obj, { [key]: val }), {});
}
exports.fromEntries = fromEntries;
//# sourceMappingURL=utils.js.map