(window.webpackJsonp=window.webpackJsonp||[]).push([[0],{83:function(e,i,t){const s=t(94),n=t(95).data,l=new s.MainPage(n);e.exports.page=l},94:function(e,i,t){"use strict";(function(e){Object.defineProperty(i,"__esModule",{value:!0});const s=t(0),n=t(41),l=t(25),d=t(42),a=t(43);i.MainPage=class extends a.BasePage{constructor(){super(...arguments),this.module=e}get title(){return"Hediet's Blog"}render(){return s.createElement(n.PageFrame,Object.assign({},this.data.baseData),this.data.recentPosts.map((e,i)=>s.createElement("div",{key:i,className:"postSummary"},s.createElement("div",{className:"postSummaryHeader"},s.createElement("h2",null,s.createElement(l.Link,{to:e.ref},e.title)),s.createElement("div",{className:"date"},new Date(e.date).toLocaleDateString("en-US",{day:"numeric",year:"numeric",month:"short"}))),s.createElement("div",{className:"preview"},s.createElement(l.Link,{to:e.ref},s.createElement("span",null,s.createElement(d.ContentRenderer,{content:e.preview}),"»"))),i<this.data.recentPosts.length-1&&s.createElement("hr",null))))}}}).call(this,t(20)(e))},95:function(e,i,t){e.exports.data={baseData:{index:new(t(15).RuntimeRouteRef)([],()=>Promise.resolve().then(t.t.bind(null,83,7)).then(e=>e.page))},recentPosts:[{title:"Implementing TypeScript Refactorings With Hot Reloading",date:"Sat Sep 07 2019 14:00:00 GMT+0200 (GMT+02:00)",preview:{kind:"list",items:[{kind:"list",items:[]},{kind:"list",items:[{kind:"text",value:"This post is about how to implement a simple refactoring for TypesScript as a language service plugin that can be used in VS Code. It showcases modern development techniques like hot reloading, test driven development and syntax tree visualizations in VS Code."}]},{kind:"list",items:[]},{kind:"list",items:[]},{kind:"list",items:[]},{kind:"list",items:[]},{kind:"list",items:[]},{kind:"list",items:[]},{kind:"list",items:[]},{kind:"list",items:[]},{kind:"list",items:[]},{kind:"list",items:[]},{kind:"list",items:[]},{kind:"list",items:[]},{kind:"list",items:[]},{kind:"list",items:[]},{kind:"list",items:[]},{kind:"list",items:[]},{kind:"list",items:[]},{kind:"list",items:[]},{kind:"list",items:[]},{kind:"list",items:[]},{kind:"list",items:[]},{kind:"list",items:[]},{kind:"list",items:[]},{kind:"list",items:[]},{kind:"list",items:[]},{kind:"list",items:[]},{kind:"list",items:[]},{kind:"list",items:[]},{kind:"list",items:[]},{kind:"list",items:[]},{kind:"list",items:[]},{kind:"list",items:[]},{kind:"list",items:[]},{kind:"list",items:[]},{kind:"list",items:[]},{kind:"list",items:[]},{kind:"list",items:[]},{kind:"list",items:[]},{kind:"list",items:[]},{kind:"list",items:[]},{kind:"list",items:[]},{kind:"list",items:[]},{kind:"list",items:[]},{kind:"list",items:[]},{kind:"list",items:[]},{kind:"list",items:[]},{kind:"list",items:[]},{kind:"list",items:[]},{kind:"list",items:[]}]},ref:new(t(15).RuntimeRouteRef)(["post","implementing_typescript_refactorings_with_hot_reloading"],()=>t.e(2).then(t.t.bind(null,89,7)).then(e=>e.page))},{title:"The Disposable Pattern in TypeScript",date:"Sat Sep 07 2019 12:00:00 GMT+0200 (GMT+02:00)",preview:{kind:"list",items:[{kind:"list",items:[]},{kind:"list",items:[{kind:"text",value:"JavaScript and TypeScript developers are used to implement life cycles and side effects imperatively. Examples are "},{kind:"inlineCode",code:"setInterval"},{kind:"text",value:"/"},{kind:"inlineCode",code:"clearInterval"},{kind:"text",value:" for starting and stopping a timer and "},{kind:"inlineCode",code:"addEventListener"},{kind:"text",value:"/"},{kind:"inlineCode",code:"removeEventListener"},{kind:"text",value:" for adding and removing an event listener. The JavaScript browser API has much more such examples."}]},{kind:"list",items:[{kind:"text",value:"This principle is adopted for own code too, which often results in something similar to this:"}]},{kind:"badge",text:"Code"},{kind:"list",items:[{kind:"text",value:"This"}]},{kind:"list",items:[]},{kind:"list",items:[]},{kind:"list",items:[]},{kind:"list",items:[]},{kind:"list",items:[]},{kind:"list",items:[]},{kind:"list",items:[]},{kind:"list",items:[]},{kind:"list",items:[]},{kind:"list",items:[]},{kind:"list",items:[]},{kind:"list",items:[]},{kind:"list",items:[]},{kind:"list",items:[]}]},ref:new(t(15).RuntimeRouteRef)(["post","the_disposable_pattern_in_typescript"],()=>t.e(4).then(t.t.bind(null,90,7)).then(e=>e.page))},{title:"Hello World",date:"Sat Sep 07 2019 10:00:00 GMT+0200 (GMT+02:00)",preview:{kind:"list",items:[{kind:"list",items:[]},{kind:"list",items:[{kind:"text",value:"After some long nights I finally published my very own blog! I will mainly use this blog to write about TypeScript, my own projects and other cool programming related stuff."}]},{kind:"list",items:[{kind:"text",value:"The blog is a static website that uses TypeScript, React, MobX and much more other cool technology. For compiling the blog, I use webpack and dynamically provide each page as a (virtual) module acting as an entry point. Each such"},{kind:"list",items:[]},{kind:"list",items:[]}]},{kind:"list",items:[]},{kind:"list",items:[]},{kind:"list",items:[]}]},ref:new(t(15).RuntimeRouteRef)(["post","hello_world"],()=>t.e(3).then(t.t.bind(null,91,7)).then(e=>e.page))}],routeIndexProvider:new(t(15).DynamicRouteIndexProvider)(()=>t.e(1).then(t.t.bind(null,88,7)))}}}]);