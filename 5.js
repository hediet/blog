(window.webpackJsonp=window.webpackJsonp||[]).push([[5,1,19,20],{85:function(e,t,i){"use strict";Object.defineProperty(t,"__esModule",{value:!0});const s=i(25),n=i(7),l=i(0);t.BasePage=class extends s.Page{constructor(e){e.routeIndexProvider||(e.routeIndexProvider=new s.PlaceholderRouteIndexProvider),super(e)}load(e){const t=document.getElementById("target");let i=location.href;n.render(l.createElement(s.ReactRouter,{initialPage:this,initialRef:e,routeIndexProvider:this.data.routeIndexProvider,onNavigated:(e,t)=>{_paq.push(["setReferrerUrl",i]),i=e.getUrl(),_paq.push(["setCustomUrl",i]),_paq.push(["setDocumentTitle",t.title]),_paq.push(["deleteCustomVariables","page"]),_paq.push(["setGenerationTimeMs",0]),_paq.push(["trackPageView"])}}),t)}getHtmlTemplate(e){const t=e.toString();return`<!DOCTYPE html>\n<html>\n    <head>\n        <title>${this.title}</title>\n        <meta charset="utf-8">\n        <meta name="theme-color" content="#130f12" />\n        <meta name="viewport" content="width=device-width, initial-scale=1.0">\n        <link rel="alternate" type="application/rss+xml" title="RSS" href="/feed.rss" />\n        \n        <script type="text/javascript">\n        var _paq = window._paq || [];\n        /* tracker methods like "setCustomDimension" should be called before "trackPageView" */\n        _paq.push(['setCustomUrl', ${JSON.stringify(t)}]);\n        _paq.push(['trackPageView']);\n        _paq.push(['enableLinkTracking']);\n        (function() {\n            var u="//matom.hediet.de/";\n            _paq.push(['setTrackerUrl', u+'mat-api']);\n            _paq.push(['setSiteId', '3']);\n            var d=document, g=d.createElement('script'), s=d.getElementsByTagName('script')[0];\n            g.type='text/javascript'; g.async=true; g.defer=true; g.src=u+'mat-client'; s.parentNode.insertBefore(g,s);\n        })();\n        <\/script>\n        <noscript><p><img src="//matom.hediet.de/mat-api?idsite=3&amp;rec=1" style="border:0;" alt="" /></p></noscript>\n    </head>\n    <body>\n        <div id="target"></div>\n    </body>\n</html>`}}},87:function(e,t,i){const s=i(97),n=i(98).data,l=new s.MainPage(n);e.exports.page=l},97:function(e,t,i){"use strict";(function(e){Object.defineProperty(t,"__esModule",{value:!0});const s=i(0),n=i(41),l=i(25),d=i(42),a=i(85);t.MainPage=class extends a.BasePage{constructor(){super(...arguments),this.module=e}get title(){return"Hediet's Blog"}render(){return s.createElement(n.PageFrame,Object.assign({},this.data.baseData),this.data.recentPosts.map((e,t)=>s.createElement("div",{key:t,className:"postSummary"},s.createElement("div",{className:"postSummaryHeader"},s.createElement("h2",null,s.createElement(l.Link,{to:e.ref},e.title)),s.createElement("div",{className:"date"},new Date(e.date).toLocaleDateString("en-US",{day:"numeric",year:"numeric",month:"short"}))),s.createElement("div",{className:"preview"},s.createElement(l.Link,{to:e.ref},s.createElement("span",null,s.createElement(d.ContentRenderer,{content:e.preview}),"»"))),t<this.data.recentPosts.length-1&&s.createElement("hr",null))))}}}).call(this,i(20)(e))},98:function(e,t,i){e.exports.data={baseData:{index:new(i(15).RuntimeRouteRef)([],()=>Promise.resolve().then(i.t.bind(null,87,7)).then(e=>e.page))},recentPosts:[{title:"How to Stress the C# Compiler",date:"Fri Oct 04 2019 12:00:00 GMT+0200 (GMT+02:00)",preview:{kind:"list",items:[{kind:"list",items:[]},{kind:"list",items:[{kind:"text",value:"C# is (mostly) a strongly typed programming language. It's type system supports generics, inference, and method overloading. Combining these features, any C# compiler can easily be knocked out. This blog article demonstrates a few approaches. One of them knocks out the programmer more than the compiler, but that's not so important."}]},{kind:"list",items:[]},{kind:"list",items:[]},{kind:"list",items:[]},{kind:"list",items:[]},{kind:"list",items:[]},{kind:"list",items:[]},{kind:"list",items:[]},{kind:"list",items:[]},{kind:"list",items:[]},{kind:"list",items:[]},{kind:"list",items:[]},{kind:"list",items:[]},{kind:"list",items:[]},{kind:"list",items:[]},{kind:"list",items:[]},{kind:"list",items:[]},{kind:"list",items:[]},{kind:"list",items:[]},{kind:"list",items:[]},{kind:"list",items:[]},{kind:"list",items:[]},{kind:"list",items:[]},{kind:"list",items:[]},{kind:"list",items:[]},{kind:"list",items:[]},{kind:"list",items:[]},{kind:"list",items:[]},{kind:"list",items:[]},{kind:"list",items:[]},{kind:"list",items:[]},{kind:"list",items:[]},{kind:"list",items:[]},{kind:"list",items:[]},{kind:"list",items:[]},{kind:"list",items:[]},{kind:"list",items:[]},{kind:"list",items:[]},{kind:"list",items:[]},{kind:"list",items:[]},{kind:"list",items:[]},{kind:"list",items:[]},{kind:"list",items:[]},{kind:"list",items:[]},{kind:"list",items:[]},{kind:"list",items:[]},{kind:"list",items:[]},{kind:"list",items:[]},{kind:"list",items:[]},{kind:"list",items:[]},{kind:"list",items:[]},{kind:"list",items:[]},{kind:"list",items:[]},{kind:"list",items:[]},{kind:"list",items:[]}]},ref:new(i(15).RuntimeRouteRef)(["post","how-to-stress-the-csharp-compiler"],()=>i.e(4).then(i.t.bind(null,94,7)).then(e=>e.page))},{title:"Hot Reload for VS Code Extension Development",date:"Tue Sep 10 2019 02:00:00 GMT+0200 (GMT+02:00)",preview:{kind:"list",items:[{kind:"list",items:[]},{kind:"list",items:[{kind:"badge",text:"Image"}]},{kind:"list",items:[{kind:"text",value:"Ever wanted to iteratively tweak your VS Code extension but got annoyed on how long it takes to try things out? Then check out "},{kind:"inlineCode",code:"@hediet/node-reload"},{kind:"text",value:" to immediately apply your code changes to your running extension and speed up your development workflow!"}]},{kind:"list",items:[]},{kind:"list",items:[]},{kind:"list",items:[]},{kind:"list",items:[]},{kind:"list",items:[]},{kind:"list",items:[]},{kind:"list",items:[]},{kind:"list",items:[]},{kind:"list",items:[]},{kind:"list",items:[]},{kind:"list",items:[]},{kind:"list",items:[]},{kind:"list",items:[]},{kind:"list",items:[]},{kind:"list",items:[]},{kind:"list",items:[]},{kind:"list",items:[]},{kind:"list",items:[]},{kind:"list",items:[]},{kind:"list",items:[]},{kind:"list",items:[]},{kind:"list",items:[]},{kind:"list",items:[]}]},ref:new(i(15).RuntimeRouteRef)(["post","hot_reload_for_vs_code_extension_development"],()=>i.e(14).then(i.t.bind(null,91,7)).then(e=>e.page))},{title:"A TypeScript Playground for RX JS",date:"Sun Sep 08 2019 12:00:00 GMT+0200 (GMT+02:00)",preview:{kind:"text",value:"This post is a playground for\n        RxJS, a library for reactive programming using Observables that\n        make it easier to compose asynchronous or callback-based\n        code. The playground supports editable as well as\n        computed observables. Events of editable observables can\n        be created with a single click and dragged around, while\n        computed observables are expressed in type-checked\n        JavaScript (also known as TypeScript) and can refer to\n        other observables."},ref:new(i(15).RuntimeRouteRef)(["post","a_typescript_playground_for_rx_js"],()=>i.e(3).then(i.t.bind(null,95,7)).then(e=>e.page))},{title:"Implementing TypeScript Refactorings With Hot Reloading",date:"Sat Sep 07 2019 14:00:00 GMT+0200 (GMT+02:00)",preview:{kind:"list",items:[{kind:"list",items:[]},{kind:"list",items:[{kind:"text",value:"This post is about how to implement a simple refactoring for TypesScript as a language service plugin that can be used in VS Code. It showcases modern development techniques like hot reloading, test driven development and syntax tree visualizations in VS Code."}]},{kind:"list",items:[]},{kind:"list",items:[]},{kind:"list",items:[]},{kind:"list",items:[]},{kind:"list",items:[]},{kind:"list",items:[]},{kind:"list",items:[]},{kind:"list",items:[]},{kind:"list",items:[]},{kind:"list",items:[]},{kind:"list",items:[]},{kind:"list",items:[]},{kind:"list",items:[]},{kind:"list",items:[]},{kind:"list",items:[]},{kind:"list",items:[]},{kind:"list",items:[]},{kind:"list",items:[]},{kind:"list",items:[]},{kind:"list",items:[]},{kind:"list",items:[]},{kind:"list",items:[]},{kind:"list",items:[]},{kind:"list",items:[]},{kind:"list",items:[]},{kind:"list",items:[]},{kind:"list",items:[]},{kind:"list",items:[]},{kind:"list",items:[]},{kind:"list",items:[]},{kind:"list",items:[]},{kind:"list",items:[]},{kind:"list",items:[]},{kind:"list",items:[]},{kind:"list",items:[]},{kind:"list",items:[]},{kind:"list",items:[]},{kind:"list",items:[]},{kind:"list",items:[]},{kind:"list",items:[]},{kind:"list",items:[]},{kind:"list",items:[]},{kind:"list",items:[]},{kind:"list",items:[]},{kind:"list",items:[]},{kind:"list",items:[]},{kind:"list",items:[]},{kind:"list",items:[]},{kind:"list",items:[]}]},ref:new(i(15).RuntimeRouteRef)(["post","implementing_typescript_refactorings_with_hot_reloading"],()=>i.e(2).then(i.t.bind(null,96,7)).then(e=>e.page))},{title:"The Disposable Pattern in TypeScript",date:"Sat Sep 07 2019 12:00:00 GMT+0200 (GMT+02:00)",preview:{kind:"list",items:[{kind:"list",items:[]},{kind:"list",items:[{kind:"text",value:"JavaScript and TypeScript developers are used to implement life cycles and side effects imperatively. Examples are "},{kind:"inlineCode",code:"setInterval"},{kind:"text",value:"/"},{kind:"inlineCode",code:"clearInterval"},{kind:"text",value:" for starting and stopping a timer and "},{kind:"inlineCode",code:"addEventListener"},{kind:"text",value:"/"},{kind:"inlineCode",code:"removeEventListener"},{kind:"text",value:" for adding and removing an event listener. The JavaScript browser API has much more such examples."}]},{kind:"list",items:[{kind:"text",value:"This principle is adopted for own code too, which often results in something similar to this:"}]},{kind:"badge",text:"Code"},{kind:"list",items:[{kind:"text",value:"This"}]},{kind:"list",items:[]},{kind:"list",items:[]},{kind:"list",items:[]},{kind:"list",items:[]},{kind:"list",items:[]},{kind:"list",items:[]},{kind:"list",items:[]},{kind:"list",items:[]},{kind:"list",items:[]},{kind:"list",items:[]},{kind:"list",items:[]},{kind:"list",items:[]},{kind:"list",items:[]},{kind:"list",items:[]}]},ref:new(i(15).RuntimeRouteRef)(["post","the_disposable_pattern_in_typescript"],()=>i.e(18).then(i.t.bind(null,92,7)).then(e=>e.page))},{title:"Hello World",date:"Sat Sep 07 2019 10:00:00 GMT+0200 (GMT+02:00)",preview:{kind:"list",items:[{kind:"list",items:[]},{kind:"list",items:[{kind:"text",value:"After some long nights I finally published my very own blog! I will mainly use this blog to write about TypeScript, my own projects and other cool programming related stuff."}]},{kind:"list",items:[{kind:"text",value:"The blog is a static website that uses TypeScript, React, MobX and much more other cool technology. For compiling the blog, I use webpack and dynamically provide each page as a (virtual) module acting as an entry point. Each such"},{kind:"list",items:[]},{kind:"list",items:[]}]},{kind:"list",items:[]},{kind:"list",items:[]},{kind:"list",items:[]}]},ref:new(i(15).RuntimeRouteRef)(["post","hello_world"],()=>i.e(17).then(i.t.bind(null,93,7)).then(e=>e.page))}],routeIndexProvider:new(i(15).DynamicRouteIndexProvider)(()=>i.e(0).then(i.t.bind(null,88,7)))}}}]);