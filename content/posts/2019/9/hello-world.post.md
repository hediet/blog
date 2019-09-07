---
date: 2019-09-07 10:00
title: Hello World
github: { org: "hediet", repo: "blog" }
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

I decided against ready-to-use solutions like next.js
as they don't work that well with TypeScript and
I wanted to create something I fully control.
