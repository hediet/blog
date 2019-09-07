(window.webpackJsonp=window.webpackJsonp||[]).push([[2],{100:function(n,s,a){n.exports.data={baseData:{index:new(a(15).RuntimeRouteRef)([],()=>a.e(0).then(a.t.bind(null,86,7)).then(n=>n.page))},post:{title:"Hot Reload for VS Code Extension Development",content:{kind:"list",items:[{kind:"list",items:[]},{kind:"paragraph",body:{kind:"list",items:[{kind:"image",asset:new(a(40).RuntimeAsset)(a(101))}]}},{kind:"paragraph",body:{kind:"list",items:[{kind:"text",value:"Ever wanted to iteratively tweak your VS Code extension but got annoyed\non how long it takes to try things out? Then check out "},{kind:"inlineCode",code:"@hediet/node-reload"},{kind:"text",value:" to\nimmediately apply your code changes to your running extension\nand speed up your development workflow!"}]}},{kind:"heading",depth:2,body:{kind:"list",items:[{kind:"text",value:"Setting up a new VS Code Extension"}]}},{kind:"paragraph",body:{kind:"list",items:[{kind:"text",value:"Create a new (preferrably TypeScript) extension for vscode with "},{kind:"inlineCode",code:"yo"},{kind:"text",value:":"}]}},{kind:"code",html:"yo code",lang:"sh"},{kind:"paragraph",body:{kind:"list",items:[{kind:"text",value:"Then add a dependency to "},{kind:"inlineCode",code:"@hediet/node-reload"},{kind:"text",value:" and "},{kind:"inlineCode",code:"@hediet/std"},{kind:"text",value:":"}]}},{kind:"code",html:'yarn add @hediet<span class="token operator">/</span>node<span class="token operator">-</span>reload @hediet<span class="token operator">/</span>std',lang:"sh"},{kind:"paragraph",body:{kind:"list",items:[{kind:"text",value:"Delete everything inside "},{kind:"inlineCode",code:"src"},{kind:"text",value:" and create an empty "},{kind:"inlineCode",code:"extension.ts"},{kind:"text",value:".\nFor prototyping add "},{kind:"inlineCode",code:'"*"'},{kind:"text",value:" to the "},{kind:"inlineCode",code:"activationEvents"},{kind:"text",value:" in "},{kind:"inlineCode",code:"package.json"},{kind:"text",value:" so that the extension gets loaded at startup. This is not considered good practice for production as it slows down VS Code if too many extension are loaded when VS Code starts."}]}},{kind:"heading",depth:2,body:{kind:"list",items:[{kind:"text",value:"Simple Hot Reload with "},{kind:"inlineCode",code:"hotRequire"}]}},{kind:"paragraph",body:{kind:"list",items:[{kind:"text",value:"In the simplest scenario, the hot reload logic is put into "},{kind:"inlineCode",code:"extension.ts"},{kind:"text",value:" (which is loaded by VS Code)\nwhile the actual extension code lives in "},{kind:"inlineCode",code:"logic.ts"},{kind:"text",value:".\nThe hot reload logic watches loaded modules for changes and reloads them when they change."}]}},{kind:"paragraph",body:{kind:"list",items:[{kind:"inlineCode",code:"hotRequire"},{kind:"text",value:" can be used to require a file and get notified when it changes.\nFor "},{kind:"inlineCode",code:"hotRequire"},{kind:"text",value:" to watch for changes, "},{kind:"inlineCode",code:"enableHotReload"},{kind:"text",value:" must be called before.\nSince our extension is not the entry module of the process,\nwe must set our extension module as "},{kind:"inlineCode",code:"entryModule"},{kind:"text",value:".\nOnly direct dependencies of watched modules and the entry module are also watched."}]}},{kind:"code",html:'<span class="token comment">// extension.ts</span>\n<span class="token keyword">import</span> <span class="token punctuation">{</span> enableHotReload<span class="token punctuation">,</span> hotRequire <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">"@hediet/node-reload"</span><span class="token punctuation">;</span>\n\n<span class="token keyword">if</span> <span class="token punctuation">(</span>process<span class="token punctuation">.</span>env<span class="token punctuation">.</span><span class="token constant">NODE_ENV</span> <span class="token operator">===</span> <span class="token string">"development"</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token comment">// only activate hot reload while developing the extension</span>\n    <span class="token function">enableHotReload</span><span class="token punctuation">(</span><span class="token punctuation">{</span> entryModule<span class="token punctuation">:</span> module <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n<span class="token punctuation">}</span>\n\n<span class="token keyword">export</span> <span class="token keyword">function</span> <span class="token function">activate</span><span class="token punctuation">(</span><span class="token parameter">context<span class="token punctuation">:</span> vscode<span class="token punctuation">.</span>ExtensionContext</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    context<span class="token punctuation">.</span>subscriptions<span class="token punctuation">.</span><span class="token function">push</span><span class="token punctuation">(</span>\n        <span class="token comment">// `hotRequire` returns a Disposable</span>\n        <span class="token comment">// that disposes the last returned instance</span>\n        <span class="token comment">// and makes it stop watching.</span>\n        hotRequire<span class="token operator">&lt;</span><span class="token keyword">typeof</span> <span class="token keyword">import</span><span class="token punctuation">(</span><span class="token string">"./logic"</span><span class="token punctuation">)</span><span class="token operator">></span><span class="token punctuation">(</span>module<span class="token punctuation">,</span> <span class="token string">"./logic"</span><span class="token punctuation">,</span> <span class="token parameter">logic</span> <span class="token operator">=></span> <span class="token punctuation">{</span>\n            <span class="token comment">// This callback is called immediately</span>\n            <span class="token comment">// and whenever "./logic"</span>\n            <span class="token comment">// or one of its dependencies changes.</span>\n            <span class="token comment">// We simply instantiate our extension again on every change.</span>\n            <span class="token comment">// `dispose` is called on previously returned instances.</span>\n            <span class="token keyword">return</span> <span class="token keyword">new</span> <span class="token class-name">logic<span class="token punctuation">.</span>MyExtension</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n        <span class="token punctuation">}</span><span class="token punctuation">)</span>\n    <span class="token punctuation">)</span><span class="token punctuation">;</span>\n<span class="token punctuation">}</span>',lang:"ts"},{kind:"code",html:'<span class="token comment">// logic.ts</span>\n<span class="token keyword">import</span> <span class="token operator">*</span> <span class="token keyword">as</span> vscode <span class="token keyword">from</span> <span class="token string">"vscode"</span><span class="token punctuation">;</span>\n<span class="token keyword">export</span> <span class="token keyword">class</span> <span class="token class-name">MyExtension</span> <span class="token punctuation">{</span>\n    <span class="token function">constructor</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n        <span class="token keyword">const</span> item <span class="token operator">=</span> vscode<span class="token punctuation">.</span>window<span class="token punctuation">.</span><span class="token function">createStatusBarItem</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n        item<span class="token punctuation">.</span>text <span class="token operator">=</span> <span class="token string">"Hello World!"</span><span class="token punctuation">;</span>\n        item<span class="token punctuation">.</span><span class="token function">show</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n    <span class="token punctuation">}</span>\n\n    <span class="token comment">// Values returned in the callback of `hotRequire` must</span>\n    <span class="token comment">// have a `dispose` function.</span>\n    <span class="token function">dispose</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span><span class="token punctuation">}</span>\n<span class="token punctuation">}</span>',lang:"ts"},{kind:"paragraph",body:{kind:"list",items:[{kind:"text",value:"With this code, every time "},{kind:"inlineCode",code:"logic.ts"},{kind:"text",value:" is changed, a new status bar message is created while the old ones stay.\nTo avoid that, we need to cleanup our stuff before a new instance of "},{kind:"inlineCode",code:"MyExtension"},{kind:"text",value:" is instantiated.\nLuckily, "},{kind:"inlineCode",code:"hotRequire"},{kind:"text",value:" calls "},{kind:"inlineCode",code:"dispose"},{kind:"text",value:" on previously returned objects before the callback is run again:"}]}},{kind:"code",html:'<span class="token comment">// logic.ts</span>\n<span class="token keyword">import</span> <span class="token operator">*</span> <span class="token keyword">as</span> vscode <span class="token keyword">from</span> <span class="token string">"vscode"</span><span class="token punctuation">;</span>\n<span class="token keyword">export</span> <span class="token keyword">class</span> <span class="token class-name">MyExtension</span> <span class="token punctuation">{</span>\n    <span class="token keyword">private</span> s<span class="token punctuation">:</span> vscode<span class="token punctuation">.</span>StatusBarItem<span class="token punctuation">;</span>\n    <span class="token function">constructor</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n        <span class="token keyword">this</span><span class="token punctuation">.</span>s <span class="token operator">=</span> vscode<span class="token punctuation">.</span>window<span class="token punctuation">.</span><span class="token function">createStatusBarItem</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n        <span class="token keyword">this</span><span class="token punctuation">.</span>s<span class="token punctuation">.</span>text <span class="token operator">=</span> <span class="token string">"Hello World!"</span><span class="token punctuation">;</span>\n        <span class="token keyword">this</span><span class="token punctuation">.</span>s<span class="token punctuation">.</span><span class="token function">show</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n    <span class="token punctuation">}</span>\n\n    <span class="token function">dispose</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n        s<span class="token punctuation">.</span><span class="token function">dispose</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n    <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>',lang:"ts"},{kind:"paragraph",body:{kind:"list",items:[{kind:"text",value:"With "},{kind:"inlineCode",code:"Disposable.fn"},{kind:"text",value:" from "},{kind:"inlineCode",code:"@hediet/std/disposable"},{kind:"text",value:" the dispose function can be made less awkward:"}]}},{kind:"code",html:'<span class="token comment">// logic.ts</span>\n<span class="token keyword">import</span> <span class="token operator">*</span> <span class="token keyword">as</span> vscode <span class="token keyword">from</span> <span class="token string">"vscode"</span><span class="token punctuation">;</span>\n<span class="token keyword">import</span> <span class="token punctuation">{</span> Disposable <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">"@hediet/std/disposable"</span><span class="token punctuation">;</span>\n<span class="token keyword">export</span> <span class="token keyword">class</span> <span class="token class-name">MyExtension</span> <span class="token punctuation">{</span>\n    dispose <span class="token operator">=</span> Disposable<span class="token punctuation">.</span><span class="token function">fn</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n    <span class="token function">constructor</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n        <span class="token keyword">const</span> item <span class="token operator">=</span> <span class="token keyword">this</span><span class="token punctuation">.</span>dispose<span class="token punctuation">.</span><span class="token function">track</span><span class="token punctuation">(</span>vscode<span class="token punctuation">.</span>window<span class="token punctuation">.</span><span class="token function">createStatusBarItem</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n        item<span class="token punctuation">.</span>text <span class="token operator">=</span> <span class="token string">"Hello World!"</span><span class="token punctuation">;</span>\n        item<span class="token punctuation">.</span><span class="token function">show</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n    <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>',lang:"ts"},{kind:"paragraph",body:{kind:"list",items:[{kind:"text",value:"And it simply works:"}]}},{kind:"paragraph",body:{kind:"list",items:[{kind:"image",asset:new(a(40).RuntimeAsset)(a(102))}]}},{kind:"heading",depth:2,body:{kind:"list",items:[{kind:"text",value:"Single File Hot Reload with "},{kind:"inlineCode",code:"hotRequireExportedFn"}]}},{kind:"paragraph",body:{kind:"list",items:[{kind:"text",value:"If we want to put the extension logic into the main extension file,\n"},{kind:"inlineCode",code:"hotRequireExportedFn"},{kind:"text",value:" from "},{kind:"inlineCode",code:"@hediet/node-reload"},{kind:"text",value:" is the way to go."}]}},{kind:"paragraph",body:{kind:"list",items:[{kind:"inlineCode",code:"hotRequireExportedFn"},{kind:"text",value:" can be used instead of "},{kind:"inlineCode",code:"hotRequire"},{kind:"text",value:" to load an exported function or class of the given module.\nIn addition to "},{kind:"inlineCode",code:"enableHotReload"},{kind:"text",value:", "},{kind:"inlineCode",code:"registerUpdateReconciler"},{kind:"text",value:" must be called to set the update strategy for the given module."}]}},{kind:"code",html:'<span class="token comment">// extension.ts</span>\n<span class="token comment">// ...</span>\n\n<span class="token function">enableHotReload</span><span class="token punctuation">(</span><span class="token punctuation">{</span> entryModule<span class="token punctuation">:</span> module <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n<span class="token comment">// Accepts and loads new module versions and updates all `hotRequireExportedFn` invocations.</span>\n<span class="token function">registerUpdateReconciler</span><span class="token punctuation">(</span>module<span class="token punctuation">)</span><span class="token punctuation">;</span>\n\n<span class="token keyword">export</span> <span class="token keyword">function</span> <span class="token function">activate</span><span class="token punctuation">(</span><span class="token parameter">context<span class="token punctuation">:</span> vscode<span class="token punctuation">.</span>ExtensionContext</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    context<span class="token punctuation">.</span>subscriptions<span class="token punctuation">.</span><span class="token function">push</span><span class="token punctuation">(</span>\n        <span class="token function">hotRequireExportedFn</span><span class="token punctuation">(</span>\n            <span class="token comment">// The module the function is exported.</span>\n            module<span class="token punctuation">,</span>\n            <span class="token comment">// The exported item.</span>\n            <span class="token comment">// Must be exported in `module` at `MyExtension.name`.</span>\n            MyExtension<span class="token punctuation">,</span>\n            <span class="token comment">// Creates a new `MyExtension` when ever a new module version is loaded.</span>\n            <span class="token comment">// Old instances are disposed before.</span>\n            <span class="token parameter">MyExtension</span> <span class="token operator">=></span> <span class="token keyword">new</span> <span class="token class-name">MyExtension</span><span class="token punctuation">(</span><span class="token punctuation">)</span>\n        <span class="token punctuation">)</span>\n    <span class="token punctuation">)</span><span class="token punctuation">;</span>\n<span class="token punctuation">}</span>\n\n<span class="token comment">// Must be exported as `MyExtension`</span>\n<span class="token keyword">export</span> <span class="token keyword">class</span> <span class="token class-name">MyExtension</span> <span class="token punctuation">{</span>\n    dispose <span class="token operator">=</span> Disposable<span class="token punctuation">.</span><span class="token function">fn</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n    <span class="token function">constructor</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n        <span class="token keyword">const</span> item <span class="token operator">=</span> <span class="token keyword">this</span><span class="token punctuation">.</span>dispose<span class="token punctuation">.</span><span class="token function">track</span><span class="token punctuation">(</span>vscode<span class="token punctuation">.</span>window<span class="token punctuation">.</span><span class="token function">createStatusBarItem</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n        item<span class="token punctuation">.</span>text <span class="token operator">=</span> <span class="token string">"Hello!"</span><span class="token punctuation">;</span>\n        item<span class="token punctuation">.</span>color <span class="token operator">=</span> <span class="token string">"yellow"</span><span class="token punctuation">;</span>\n        item<span class="token punctuation">.</span><span class="token function">show</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n    <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>',lang:"ts"},{kind:"heading",depth:2,body:{kind:"list",items:[{kind:"text",value:"Outlook"}]}},{kind:"paragraph",body:{kind:"list",items:[{kind:"text",value:"This article only touched the surface of what "},{kind:"inlineCode",code:"@hediet/node-reload"},{kind:"text",value:" can do.\nUsing custom module reconcilers one can fully control how to apply changed modules\nor when to let the dependants do the reconcilation.\nSee the docs for more information."}]}}]},date:"Mon Sep 02 2019 02:00:00 GMT+0200 (GMT+02:00)",github:{org:"hediet",repo:"node-reload"}},routeIndexProvider:new(a(15).DynamicRouteIndexProvider)(()=>a.e(1).then(a.t.bind(null,87,7)))}},101:function(n,s,a){n.exports=a.p+"3e2034287f741879c0ef6f84157ac3e5.gif"},102:function(n,s,a){n.exports=a.p+"271f6ac45583740d05072e94846927ba.gif"},82:function(n,s,a){"use strict";(function(n){Object.defineProperty(s,"__esModule",{value:!0});const t=a(0),e=a(83),o=a(43);s.BlogPage=class extends o.BasePage{constructor(){super(...arguments),this.module=n}get title(){return this.data.post.title}render(){const n=this.data.post;return t.createElement(e.PageFrame,Object.assign({},this.data.baseData),t.createElement("h1",null,n.title),t.createElement("div",{className:"badges",style:{display:"flex"}},t.createElement(e.BlogDate,{date:new Date(n.date)}),n.github&&t.createElement("div",{style:{marginLeft:"auto"}},t.createElement(e.GithubBadge,{org:n.github.org,repo:n.github.repo}))),t.createElement(e.ContentRenderer,{content:n.content}))}}}).call(this,a(20)(n))},83:function(n,s,a){"use strict";function t(n){for(var a in n)s.hasOwnProperty(a)||(s[a]=n[a])}Object.defineProperty(s,"__esModule",{value:!0}),t(a(41)),t(a(42)),t(a(84)),t(a(85))},84:function(n,s,a){"use strict";Object.defineProperty(s,"__esModule",{value:!0});const t=a(0);s.BlogDate=function(n){return t.createElement("div",{className:"component-BlogDate"},new Date(n.date).toLocaleDateString("en-US",{day:"numeric",year:"numeric",month:"short"}))}},85:function(n,s,a){"use strict";Object.defineProperty(s,"__esModule",{value:!0});const t=a(0);s.GithubBadge=function(n){const s=`github.com/${n.org}/${n.repo}`;return t.createElement("a",{href:`https://github.com/${n.org}/${n.repo}`},t.createElement("img",{alt:"github repo",style:{border:"none"},src:`https://img.shields.io/badge/repo-${encodeURI(s).replace(/-/g,"--")}-informational.svg`}))}},92:function(n,s,a){const t=a(82),e=a(100).data,o=new t.BlogPage(e);n.exports.page=o}}]);