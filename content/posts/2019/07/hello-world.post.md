---
date: 2019-07-02
---

# Hello World

After some back and forth and long nights, I finally published my very own blog!

I will mainly use this blog to write about TypeScript,
my own projects and other cool stuff related to programming.

The blog is a static website that uses TypeScript, React, MobX and much more cool technology.
For compiling the blog, I use webpack and dynamically provide each page as a (virtual) module acting as an entry point.
Each such page has its own `HtmlWebpackPlugin`.
This gives me code splitting, hot reload and lazy loading for free.

Markdown is parsed using `remark` during compile time.
Referenced images are bundled using webpacks file loader plugin.
