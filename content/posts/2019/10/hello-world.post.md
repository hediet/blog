---
date: 2019-10-01
title: Hello World
---

After some long nights I finally published my very own blog!

I will mainly use this blog to write about TypeScript,
my own projects and other cool programming related stuff.

The blog is a static website that uses TypeScript, React, MobX and much more other cool technology.
For compiling the blog, I use webpack and dynamically provide each page as a (virtual) module acting as an entry point.
Each such page has its own `HtmlWebpackPlugin` instance.
This gives code splitting, hot reload and lazy loading for free.

Markdown is parsed using `remark` during compile time.
Referenced images are bundled using webpack's file loader plugin.

```dot
oo -> fo
```
