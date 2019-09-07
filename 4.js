(window.webpackJsonp=window.webpackJsonp||[]).push([[4],{83:function(n,s,a){"use strict";(function(n){Object.defineProperty(s,"__esModule",{value:!0});const t=a(0),e=a(84),p=a(43);s.BlogPage=class extends p.BasePage{constructor(){super(...arguments),this.module=n}get title(){return this.data.post.title}render(){const n=this.data.post;return t.createElement(e.PageFrame,Object.assign({},this.data.baseData),t.createElement("h1",null,n.title),t.createElement("div",{className:"badges",style:{display:"flex"}},t.createElement(e.BlogDate,{date:new Date(n.date)}),n.github&&t.createElement("div",{style:{marginLeft:"auto"}},t.createElement(e.GithubBadge,{org:n.github.org,repo:n.github.repo}))),t.createElement(e.ContentRenderer,{content:n.content}))}}}).call(this,a(20)(n))},84:function(n,s,a){"use strict";function t(n){for(var a in n)s.hasOwnProperty(a)||(s[a]=n[a])}Object.defineProperty(s,"__esModule",{value:!0}),t(a(41)),t(a(42)),t(a(85)),t(a(86))},85:function(n,s,a){"use strict";Object.defineProperty(s,"__esModule",{value:!0});const t=a(0);s.BlogDate=function(n){return t.createElement("div",{className:"component-BlogDate"},new Date(n.date).toLocaleDateString("en-US",{day:"numeric",year:"numeric",month:"short"}))}},86:function(n,s,a){"use strict";Object.defineProperty(s,"__esModule",{value:!0});const t=a(0);s.GithubBadge=function(n){const s=`github.com/${n.org}/${n.repo}`;return t.createElement("a",{href:`https://github.com/${n.org}/${n.repo}`},t.createElement("img",{alt:"github repo",style:{border:"none"},src:`https://img.shields.io/badge/repo-${encodeURI(s).replace(/-/g,"--")}-informational.svg`}))}},89:function(n,s,a){const t=a(83),e=a(98).data,p=new t.BlogPage(e);n.exports.page=p},98:function(n,s,a){n.exports.data={baseData:{index:new(a(15).RuntimeRouteRef)([],()=>a.e(0).then(a.t.bind(null,82,7)).then(n=>n.page))},post:{title:"The Disposable Pattern in TypeScript",content:{kind:"list",items:[{kind:"list",items:[]},{kind:"paragraph",body:{kind:"list",items:[{kind:"text",value:"JavaScript and TypeScript developers are used to implement life cycles and side effects imperatively.\nExamples are "},{kind:"inlineCode",code:"setInterval"},{kind:"text",value:"/"},{kind:"inlineCode",code:"clearInterval"},{kind:"text",value:" for starting and stopping a timer\nand "},{kind:"inlineCode",code:"addEventListener"},{kind:"text",value:"/"},{kind:"inlineCode",code:"removeEventListener"},{kind:"text",value:" for adding and removing an event listener.\nThe JavaScript browser API has much more such examples."}]}},{kind:"paragraph",body:{kind:"list",items:[{kind:"text",value:"This principle is adopted for own code too, which often results in something similar to this:"}]}},{kind:"code",html:'<span class="token keyword">class</span> <span class="token class-name">MyClass</span> <span class="token punctuation">{</span>\n    <span class="token keyword">private</span> handle<span class="token punctuation">:</span> number<span class="token punctuation">;</span>\n    <span class="token keyword">public</span> <span class="token function">start</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token keyword">void</span> <span class="token punctuation">{</span>\n        <span class="token keyword">this</span><span class="token punctuation">.</span>handle <span class="token operator">=</span> <span class="token function">setInterval</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=></span> <span class="token punctuation">{</span>\n            <span class="token comment">// ...</span>\n        <span class="token punctuation">}</span><span class="token punctuation">,</span> <span class="token number">1000</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n    <span class="token punctuation">}</span>\n\n    <span class="token keyword">public</span> <span class="token function">stop</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token keyword">void</span> <span class="token punctuation">{</span>\n        <span class="token function">clearInterval</span><span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">.</span>handle<span class="token punctuation">)</span><span class="token punctuation">;</span>\n    <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n\n<span class="token keyword">class</span> <span class="token class-name">MyService</span> <span class="token punctuation">{</span>\n    <span class="token keyword">private</span> myClass <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">MyClass</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n\n    <span class="token keyword">public</span> <span class="token function">foo</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token keyword">void</span> <span class="token punctuation">{</span>\n        <span class="token comment">// ...</span>\n        <span class="token keyword">this</span><span class="token punctuation">.</span>myClass<span class="token punctuation">.</span><span class="token function">start</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n        <span class="token comment">// ...</span>\n    <span class="token punctuation">}</span>\n\n    <span class="token keyword">public</span> <span class="token function">bar</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token keyword">void</span> <span class="token punctuation">{</span>\n        <span class="token comment">// ...</span>\n        <span class="token keyword">this</span><span class="token punctuation">.</span>myClass<span class="token punctuation">.</span><span class="token function">stop</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n        <span class="token comment">// ...</span>\n    <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>',lang:"ts"},{kind:"paragraph",body:{kind:"list",items:[{kind:"text",value:"This is verbose, hard to read and maintain and prone to bugs\nsince it is easy to forget calling the right method for cleanup."}]}},{kind:"paragraph",body:{kind:"list",items:[{kind:"text",value:"But it also leads to unclear architecture:\nHow are "},{kind:"inlineCode",code:"MyClass"},{kind:"text",value:" and "},{kind:"inlineCode",code:"MyService"},{kind:"text",value:" associated?\nWhat is the structure of "},{kind:"inlineCode",code:"MyClass"},{kind:"text",value:"?"}]}},{kind:"heading",depth:2,body:{kind:"list",items:[{kind:"text",value:"Thinking in Components"}]}},{kind:"paragraph",body:{kind:"list",items:[{kind:"text",value:"When thinking in components,\ninstead of having in mind that you set and clear an interval in "},{kind:"inlineCode",code:"MyClass"},{kind:"text",value:",\nyou would think of "},{kind:"inlineCode",code:"MyClass"},{kind:"text",value:" as something that composes an interval component."}]}},{kind:"paragraph",body:{kind:"list",items:[{kind:"text",value:"The idea of components is that they have a specific lifetime that starts on construction and ends on destruction.\nWhen modeling components in JS with classes,\nthe "},{kind:"inlineCode",code:"constructor"},{kind:"text",value:" marks the beginning of the lifetime.\nAs JS classes have no destructors, a method named "},{kind:"inlineCode",code:"dispose"},{kind:"text",value:" is commonly used to\nmark the end of a component's lifetime."}]}},{kind:"paragraph",body:{kind:"list",items:[{kind:"text",value:"This is how "},{kind:"inlineCode",code:"MyClass"},{kind:"text",value:" would be implemented when thinking in components.\nRather than starting an interval, we now compose a new interval.\nThe effect is the same, but the meaning is different:"}]}},{kind:"code",html:'<span class="token keyword">class</span> <span class="token class-name">MyClass</span> <span class="token punctuation">{</span>\n    <span class="token keyword">public</span> readonly timer<span class="token punctuation">:</span> Disposable<span class="token punctuation">;</span>\n\n    <span class="token function">constructor</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n        <span class="token keyword">this</span><span class="token punctuation">.</span>timer <span class="token operator">=</span> <span class="token function">createInterval</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=></span> <span class="token punctuation">{</span>\n            <span class="token comment">// ...</span>\n        <span class="token punctuation">}</span><span class="token punctuation">,</span> <span class="token number">1000</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n    <span class="token punctuation">}</span>\n\n    <span class="token keyword">public</span> <span class="token function">dispose</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token keyword">void</span> <span class="token punctuation">{</span>\n        <span class="token keyword">this</span><span class="token punctuation">.</span>timer<span class="token punctuation">.</span><span class="token function">dispose</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n    <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>',lang:"ts"},{kind:"paragraph",body:{kind:"list",items:[{kind:"text",value:"As such components provide an abstraction for how to destroy them,\na "},{kind:"inlineCode",code:"Disposer"},{kind:"text",value:" component could be used for composing components in a way that\nyou cannot forget to dispose all sub-components:"}]}},{kind:"code",html:'<span class="token keyword">class</span> <span class="token class-name">MyClass</span> <span class="token punctuation">{</span>\n    <span class="token keyword">private</span> readonly disposer <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Disposer</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n\n    <span class="token function">constructor</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n        <span class="token keyword">this</span><span class="token punctuation">.</span>disposer<span class="token punctuation">.</span><span class="token function">track</span><span class="token punctuation">(</span>\n            <span class="token function">createInterval</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=></span> <span class="token punctuation">{</span>\n                <span class="token comment">// ...</span>\n            <span class="token punctuation">}</span><span class="token punctuation">,</span> <span class="token number">1000</span><span class="token punctuation">)</span>\n        <span class="token punctuation">)</span><span class="token punctuation">;</span>\n    <span class="token punctuation">}</span>\n\n    <span class="token keyword">public</span> <span class="token function">dispose</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token keyword">void</span> <span class="token punctuation">{</span>\n        <span class="token keyword">this</span><span class="token punctuation">.</span>disposer<span class="token punctuation">.</span><span class="token function">dispose</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n    <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>',lang:"ts"},{kind:"paragraph",body:{kind:"list",items:[{kind:"text",value:"When "},{kind:"inlineCode",code:"disposer"},{kind:"text",value:" would dispose all its tracked components when called as method, it could be used directly as the "},{kind:"inlineCode",code:"dispose"},{kind:"text",value:" method, making the code even shorter:"}]}},{kind:"code",html:'<span class="token keyword">class</span> <span class="token class-name">MyClass</span> <span class="token punctuation">{</span>\n    <span class="token keyword">public</span> readonly dispose <span class="token operator">=</span> Disposable<span class="token punctuation">.</span><span class="token function">fn</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n\n    <span class="token function">constructor</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n        <span class="token keyword">this</span><span class="token punctuation">.</span>dispose<span class="token punctuation">.</span><span class="token function">track</span><span class="token punctuation">(</span>\n            <span class="token function">createInterval</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=></span> <span class="token punctuation">{</span>\n                <span class="token comment">// ...</span>\n            <span class="token punctuation">}</span><span class="token punctuation">,</span> <span class="token number">1000</span><span class="token punctuation">)</span>\n        <span class="token punctuation">)</span><span class="token punctuation">;</span>\n    <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>',lang:"ts"},{kind:"paragraph",body:{kind:"list",items:[{kind:"text",value:"The downside of using such a function "},{kind:"inlineCode",code:"Disposable.fn"},{kind:"text",value:" in the presented way is\nthat it publicly exposes its API to track and untrack disposables."}]}},{kind:"paragraph",body:{kind:"list",items:[{kind:"text",value:"If implemented with components in mind, it becomes now clear that "},{kind:"inlineCode",code:"MyService"},{kind:"text",value:"\ncomposes zero or one instances of "},{kind:"inlineCode",code:"MyClass"},{kind:"text",value:":"}]}},{kind:"code",html:'<span class="token keyword">class</span> <span class="token class-name">MyService</span> <span class="token punctuation">{</span>\n    <span class="token keyword">public</span> readonly dispose <span class="token operator">=</span> Disposable<span class="token punctuation">.</span><span class="token function">fn</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n    <span class="token keyword">private</span> myClass<span class="token punctuation">:</span> MyClass <span class="token operator">|</span> <span class="token keyword">undefined</span> <span class="token operator">=</span> <span class="token keyword">undefined</span><span class="token punctuation">;</span>\n\n    <span class="token keyword">public</span> <span class="token function">foo</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n        <span class="token comment">// ...</span>\n        <span class="token function">assert</span><span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">.</span>myClass <span class="token operator">===</span> <span class="token keyword">undefined</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n        <span class="token keyword">this</span><span class="token punctuation">.</span>myClass <span class="token operator">=</span> <span class="token keyword">this</span><span class="token punctuation">.</span>dispose<span class="token punctuation">.</span><span class="token function">track</span><span class="token punctuation">(</span><span class="token keyword">new</span> <span class="token class-name">MyClass</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n        <span class="token comment">// ...</span>\n    <span class="token punctuation">}</span>\n\n    <span class="token keyword">public</span> <span class="token function">bar</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n        <span class="token comment">// ...</span>\n        <span class="token function">assert</span><span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">.</span>myClass <span class="token operator">!==</span> <span class="token keyword">undefined</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n        <span class="token keyword">this</span><span class="token punctuation">.</span>dispose<span class="token punctuation">.</span><span class="token function">untrack</span><span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">.</span>myClass<span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">dispose</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n        <span class="token keyword">this</span><span class="token punctuation">.</span>myClass <span class="token operator">=</span> <span class="token keyword">undefined</span><span class="token punctuation">;</span>\n        <span class="token comment">// ...</span>\n    <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>',lang:"ts"},{kind:"paragraph",body:{kind:"list",items:[{kind:"text",value:"The use of "},{kind:"inlineCode",code:"Disposable.fn"},{kind:"text",value:" ensures that the instance of "},{kind:"inlineCode",code:"MyClass"},{kind:"text",value:"\nis also disposed when "},{kind:"inlineCode",code:"bar"},{kind:"text",value:" is not called."}]}}]},date:"Sat Sep 07 2019 12:00:00 GMT+0200 (GMT+02:00)",github:void 0},routeIndexProvider:new(a(15).DynamicRouteIndexProvider)(()=>a.e(1).then(a.t.bind(null,87,7)))}}}]);