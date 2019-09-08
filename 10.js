(window.webpackJsonp=window.webpackJsonp||[]).push([[10,12,14],{82:function(e,t,n){"use strict";function i(e){for(var n in e)t.hasOwnProperty(n)||(t[n]=e[n])}Object.defineProperty(t,"__esModule",{value:!0}),i(n(41)),i(n(42)),i(n(83)),i(n(84))},83:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});const i=n(0);t.BlogDate=function(e){return i.createElement("div",{className:"component-BlogDate"},new Date(e.date).toLocaleDateString("en-US",{day:"numeric",year:"numeric",month:"short"}))}},84:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});const i=n(0);t.GithubBadge=function(e){const t=`github.com/${e.org}/${e.repo}`;return i.createElement("a",{href:`https://github.com/${e.org}/${e.repo}`},i.createElement("img",{alt:"github repo",style:{border:"none"},src:`https://img.shields.io/badge/repo-${encodeURI(t).replace(/-/g,"--")}-informational.svg`}))}},86:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});const i=n(25),a=n(7),o=n(0);t.BasePage=class extends i.Page{constructor(e){e.routeIndexProvider||(e.routeIndexProvider=new i.PlaceholderRouteIndexProvider),super(e)}load(e){const t=document.getElementById("target");let n=location.href;a.render(o.createElement(i.ReactRouter,{initialPage:this,initialRef:e,routeIndexProvider:this.data.routeIndexProvider,onNavigated:(e,t)=>{_paq.push(["setReferrerUrl",n]),n=e.getUrl(),_paq.push(["setCustomUrl",n]),_paq.push(["setDocumentTitle",t.title]),_paq.push(["deleteCustomVariables","page"]),_paq.push(["setGenerationTimeMs",0]),_paq.push(["trackPageView"])}}),t)}getHtmlTemplate(e){const t=e.toString();return`<!DOCTYPE html>\n<html>\n    <head>\n        <title>${this.title}</title>\n        <meta charset="utf-8">\n        <meta name="theme-color" content="#130f12" />\n        <meta name="viewport" content="width=device-width, initial-scale=1.0">\n        <link rel="alternate" type="application/rss+xml" title="RSS" href="/feed.rss" />\n        \n        <script type="text/javascript">\n        var _paq = window._paq || [];\n        /* tracker methods like "setCustomDimension" should be called before "trackPageView" */\n        _paq.push(['setCustomUrl', ${JSON.stringify(t)}]);\n        _paq.push(['trackPageView']);\n        _paq.push(['enableLinkTracking']);\n        (function() {\n            var u="//matom.hediet.de/";\n            _paq.push(['setTrackerUrl', u+'mat-api']);\n            _paq.push(['setSiteId', '3']);\n            var d=document, g=d.createElement('script'), s=d.getElementsByTagName('script')[0];\n            g.type='text/javascript'; g.async=true; g.defer=true; g.src=u+'mat-client'; s.parentNode.insertBefore(g,s);\n        })();\n        <\/script>\n        <noscript><p><img src="//matom.hediet.de/mat-api?idsite=3&amp;rec=1" style="border:0;" alt="" /></p></noscript>\n    </head>\n    <body>\n        <div id="target"></div>\n    </body>\n</html>`}}},87:function(e,t,n){"use strict";(function(e){Object.defineProperty(t,"__esModule",{value:!0});const i=n(0),a=n(82),o=n(86);t.BlogPage=class extends o.BasePage{constructor(){super(...arguments),this.module=e}get title(){return this.data.post.title}render(){const e=this.data.post;return i.createElement(a.PageFrame,Object.assign({},this.data.baseData),i.createElement("h1",null,e.title),i.createElement("div",{className:"badges",style:{display:"flex"}},i.createElement(a.BlogDate,{date:new Date(e.date)}),e.github&&i.createElement("div",{style:{marginLeft:"auto"}},i.createElement(a.GithubBadge,{org:e.github.org,repo:e.github.repo}))),i.createElement(a.ContentRenderer,{content:e.content}))}}}).call(this,n(20)(e))},92:function(e,t,n){const i=n(87),a=n(98).data,o=new i.BlogPage(a);e.exports.page=o},98:function(e,t,n){e.exports.data={baseData:{index:new(n(15).RuntimeRouteRef)([],()=>n.e(1).then(n.t.bind(null,85,7)).then(e=>e.page))},post:{title:"Hello World",content:{kind:"list",items:[{kind:"list",items:[]},{kind:"paragraph",body:{kind:"list",items:[{kind:"text",value:"After some long nights I finally published my very own blog!\nI will mainly use this blog to write about TypeScript,\nmy own projects and other cool programming related stuff."}]}},{kind:"paragraph",body:{kind:"list",items:[{kind:"text",value:"The blog is a static website that uses TypeScript, React, MobX and much more other cool technology.\nFor compiling the blog, I use webpack and dynamically provide each page as a (virtual) module acting as an entry point.\nEach such page has its own "},{kind:"inlineCode",code:"HtmlWebpackPlugin"},{kind:"text",value:" instance.\nThis gives code splitting, hot reload and lazy loading for free."}]}},{kind:"paragraph",body:{kind:"list",items:[{kind:"text",value:"Markdown is parsed using "},{kind:"inlineCode",code:"remark"},{kind:"text",value:" during compile time.\nReferenced images are bundled using webpack's file loader plugin."}]}},{kind:"paragraph",body:{kind:"list",items:[{kind:"text",value:"I decided against ready-to-use solutions like next.js\nas they don't work that well with TypeScript and\nI wanted to create something I fully control."}]}},{kind:"paragraph",body:{kind:"list",items:[{kind:"text",value:"You may also want to check out "},{kind:"link",body:{kind:"list",items:[{kind:"text",value:"my mate's blog"}]},url:"https://phiresky.github.io/blog/"},{kind:"text",value:"\nwho shares a similar passion about programming languages and other cool computer stuff.\nEven though I don't think his blog is as "},{kind:"link",body:{kind:"list",items:[{kind:"text",value:"awesome"}]},url:"https://web.archive.org/web/20190907140610/https://phiresky.github.io/blog/2019/about/"},{kind:"text",value:" as mine, his tool "},{kind:"link",body:{kind:"list",items:[{kind:"text",value:"rga"}]},url:"https://phiresky.github.io/blog/2019/rga--ripgrep-for-zip-targz-docx-odt-epub-jpg/"},{kind:"text",value:" might actually be."}]}}]},date:"Sat Sep 07 2019 10:00:00 GMT+0200 (GMT+02:00)",github:{org:"hediet",repo:"blog"}},routeIndexProvider:new(n(15).DynamicRouteIndexProvider)(()=>n.e(0).then(n.t.bind(null,88,7)))}}}]);