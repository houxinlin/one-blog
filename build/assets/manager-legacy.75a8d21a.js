!function(){var e=document.createElement("style");e.innerHTML=".sidebar[data-v-6a119661]::-webkit-scrollbar{width:0}.sidebar-el-menu>ul[data-v-6a119661]{height:100%}.el-sub-menu .el-menu-item[data-v-6a119661]{padding-left:70px!important}.el-aside[data-v-dc5739e0]{position:fixed;top:0px;left:0px;bottom:0px;width:200px;background:#ffffff;box-shadow:2px 2px 12px rgba(0,0,0,.1)}.el-main[data-v-dc5739e0]{position:absolute;bottom:0px;top:0px;left:210px;right:0px;box-sizing:border-box}\n",document.head.appendChild(e),System.register(["./index-legacy.1dade67c.js"],(function(e){"use strict";var n,t,i,l,u,o,r,d,a,c,s,x,f,p,b,m;return{setters:[function(e){n=e._,t=e.z,i=e.A,l=e.B,u=e.a,o=e.o,r=e.C,d=e.j,a=e.b,c=e.e,s=e.F,x=e.d,f=e.f,p=e.h,b=e.k,m=e.i}],execute:function(){e("default",n({components:{vSidebar:n({setup:function(){var e=t(),n=i((function(){return e.path})),u=l();return{items:[{icon:"el-icon-lx-home",index:"/",title:"主页"},{icon:"el-icon-lx-home",index:"/dashboard",title:"系统总览"},{icon:"el-icon-lx-home",index:"/browseRecord",title:"来访记录"},{icon:"el-icon-lx-calendar",index:"2",title:"文章管理",subs:[{index:"/write",title:"写文章"},{index:"/article",title:"文章管理"}]},{icon:"el-icon-lx-home",index:"/setting",title:"系统设置"}],onRoutes:n,collapse:i((function(){return u.state.collapse}))}}},[["render",function(e,n,t,i,l,m){var v=u("el-menu-item"),h=u("el-sub-menu"),_=u("el-menu");return o(),r(_,{class:"sidebar-el-menu","default-active":i.onRoutes,collapse:i.collapse,"text-color":"#333","active-text-color":"#20a0ff","unique-opened":"",router:""},{default:d((function(){return[(o(!0),a(s,null,c(i.items,(function(e){return o(),a(s,null,[e.subs?(o(),r(h,{index:e.index,key:e.index},{title:d((function(){return[x("i",{class:f(e.icon)},null,2),x("span",null,p(e.title),1)]})),default:d((function(){return[(o(!0),a(s,null,c(e.subs,(function(e){return o(),a(s,null,[e.subs?(o(),r(h,{index:e.index,key:e.index},{title:d((function(){return[b(p(e.title),1)]})),default:d((function(){return[(o(!0),a(s,null,c(e.subs,(function(e,n){return o(),r(v,{key:n,index:e.index},{default:d((function(){return[b(p(e.title),1)]})),_:2},1032,["index"])})),128))]})),_:2},1032,["index"])):(o(),r(v,{index:e.index,key:e.index},{default:d((function(){return[b(p(e.title),1)]})),_:2},1032,["index"]))],64)})),256))]})),_:2},1032,["index"])):(o(),r(v,{index:e.index,key:e.index},{title:d((function(){return[b(p(e.title),1)]})),default:d((function(){return[x("i",{class:f(e.icon)},null,2)]})),_:2},1032,["index"]))],64)})),256))]})),_:1},8,["default-active","collapse"])}],["__scopeId","data-v-6a119661"]])},setup:function(){return l(),{}}},[["render",function(e,n,t,i,l,r){var c=u("v-sidebar"),s=u("el-aside"),x=u("router-view"),f=u("el-main");return o(),a("div",null,[m(s,null,{default:d((function(){return[m(c)]})),_:1}),m(f,null,{default:d((function(){return[m(x)]})),_:1})])}],["__scopeId","data-v-dc5739e0"]]))}}}))}();