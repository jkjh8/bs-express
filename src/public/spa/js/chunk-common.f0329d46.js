(self["webpackChunkbroadcastfe"]=self["webpackChunkbroadcastfe"]||[]).push([[64],{368:(s,e,t)=>{"use strict";t.d(e,{Hb:()=>o,K7:()=>j,KF:()=>l,PW:()=>u,Sb:()=>c,i7:()=>r,lR:()=>d,zF:()=>p});var n=t(499),a=t(1569);let i=(0,n.iH)(null),o=(0,n.iH)([]),r=(0,n.iH)(null),l=((0,n.iH)([]),(0,n.iH)([])),c=(0,n.iH)([]);async function u(){const s=await a.api.get("/device");o.value=s.data,m(s.data)}async function d(){const s=await a.api.get("/device/status");r.value=s.data}async function j(){const s=await a.api.get("/device/pa"),e={};for(const t in s.data)e[t]=JSON.parse(s.data[t]);i.value=e}function m(s){l.value=[],c.value=[];for(let e=0;e<s.length;e++)"Q-Sys"===s[e].deviceType&&"Local"!==s[e].mode||"Send"===s[e].mode?l.value.push(s[e]):c.value.push(s[e])}const p=[{name:"index",align:"center",label:"ID",field:"index",sortable:!0},{name:"name",align:"center",label:"Name",field:"name",sortable:!0},{name:"ipaddress",align:"center",label:"IP Address",field:"ipaddress",sortable:!0},{name:"deviceType",align:"center",label:"Device Type",field:"deviceType",sortable:!0},{name:"mode",align:"center",label:"Active Mode",field:"mode",sortable:!0},{name:"actions",align:"center",label:"Actions"}]},8957:(s,e,t)=>{"use strict";t.d(e,{Z:()=>a});var n=t(9302);function a(){const s=(0,n.Z)();function e(e){var t;return s.notify({icon:"fas fa-circle-info",message:e.message,caption:null!==(t=e.caption)&&void 0!==t?t:"",position:"top",color:"positive",actions:[{icon:"close",round:!0,size:"sm",color:"white",handler:()=>{}}]})}function t(e){var t;return s.notify({icon:"fas fa-circle-info",message:e.message,caption:null!==(t=e.caption)&&void 0!==t?t:"",position:"top",color:"orange",actions:[{icon:"close",round:!0,size:"sm",color:"white",handler:()=>{}}]})}function a(e){var t;return s.notify({icon:"fas fa-triangle-exclamation",message:e.message,caption:null!==(t=e.caption)&&void 0!==t?t:"",position:"top",color:"negative",textColor:"white",actions:[{icon:"close",round:!0,size:"sm",color:"white",handler:()=>{}}]})}return{notifyInfo:e,notifyWarn:t,notifyError:a}}},9e3:(s,e,t)=>{"use strict";t.d(e,{C1:()=>o,FN:()=>f,K:()=>p,N0:()=>g,SO:()=>r,gm:()=>d,gs:()=>j,m0:()=>c,pI:()=>i,tM:()=>l,u5:()=>m,wX:()=>u});var n=t(499),a=t(1569);const i=(0,n.iH)([]),o=s=>!!s||"필수 입력 항목 입니다.",r=s=>/.+@.+\..+/.test(s)||"올바른 형식이 아닙니다",l=s=>s.length>=8||"최소 8자 이상 입력하세요",c=async s=>{const e=await a.api.get(`/auth/checkEmail?email=${s}`);return!e||!e.data.status||"이미 사용중인 이메일 입니다."},u=s=>/^(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)(?:\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)){3}$/gm.test(s)||"IPv4 형식이 아닙니다",d=async s=>{const e=await a.api.get(`/device/ipexists?ipaddr=${s}`);return!e||!e.data.result||"이미 사용중인 아이피 입니다."},j=s=>s>0||"0 보다 큰 숫자를 입력하세요",m=async s=>{const e=await a.api.get(`/device/exists?index=${s}`);return!e||!e.data.result||"이미 사용중인 인덱스 입니다."},p=async s=>{const e=await a.api.get(`/zones/exists?index=${s}`);return!e||!e.data.result||"이미 사용중인 인덱스 입니다."},g=async s=>{if(null===s)return!0;const e=[];for(let t=0;t<i.value.length;t++)i.value[t]===s&&e.push(s);return!(e.length>1)||"방송구간 내 중복된 지역이 있습니다."},f=async s=>{if(null===s)return!0;try{const e=await a.api.get(`/zones/existsChildren?id=${s}`);if(e&&e.data.result.length)return"방송구간 내 중복된 지역이 있습니다."}catch(e){return console.error(e),"방송구간 확인중 문제가 발생하였습니다."}return!0}},1442:(s,e,t)=>{"use strict";t.d(e,{Z:()=>k});t(702);var n=t(9835),a=t(499),i=t(6970),o=t(4182);const r={key:0,class:"q-mr-md"},l={props:{icon:String,iconColor:String,title:String,caption:String,message:String},emits:[...o.Z.emits],setup(s,{emit:e}){const{dialogRef:t,onDialogHide:l,onDialogOK:c,onDialogCancel:u}=(0,o.Z)();return(e,o)=>{const d=(0,n.up)("q-icon"),j=(0,n.up)("q-item-label"),m=(0,n.up)("q-item-section"),p=(0,n.up)("q-card-section"),g=(0,n.up)("q-btn"),f=(0,n.up)("q-card-actions"),v=(0,n.up)("q-card"),h=(0,n.up)("q-dialog");return(0,n.wg)(),(0,n.j4)(h,{ref_key:"dialogRef",ref:t,onHide:(0,a.SU)(l)},{default:(0,n.w5)((()=>[(0,n.Wm)(v,{class:"q-dialog-plugin",style:{"border-radius":"8px"}},{default:(0,n.w5)((()=>[(0,n.Wm)(p,{class:"row no-wrap items-center"},{default:(0,n.w5)((()=>[s.icon?((0,n.wg)(),(0,n.iD)("div",r,[(0,n.Wm)(d,{name:s.icon,color:s.iconColor?s.iconColor:"primary",size:"32px"},null,8,["name","color"])])):(0,n.kq)("",!0),(0,n.Wm)(m,null,{default:(0,n.w5)((()=>[(0,n.Wm)(j,{class:"text-h6 text-bold"},{default:(0,n.w5)((()=>[(0,n.Uk)((0,i.zw)(s.title),1)])),_:1}),s.caption?((0,n.wg)(),(0,n.j4)(j,{key:0,caption:""},{default:(0,n.w5)((()=>[(0,n.Uk)((0,i.zw)(s.caption),1)])),_:1})):(0,n.kq)("",!0)])),_:1})])),_:1}),(0,n.Wm)(p,{class:"text-center"},{default:(0,n.w5)((()=>[(0,n.Uk)((0,i.zw)(s.message),1)])),_:1}),(0,n.Wm)(f,{align:"right"},{default:(0,n.w5)((()=>[(0,n.Wm)(g,{style:{width:"80px"},label:"취소",flat:"",rounded:"",onClick:(0,a.SU)(u)},null,8,["onClick"]),(0,n.Wm)(g,{style:{width:"80px"},label:"확인",class:"text-primary",flat:"",rounded:"",onClick:(0,a.SU)(c)},null,8,["onClick"])])),_:1})])),_:1})])),_:1},8,["onHide"])}}};var c=t(3706),u=t(4458),d=t(3190),j=t(2857),m=t(1233),p=t(3115),g=t(1821),f=t(4455),v=t(9984),h=t.n(v);const b=l,k=b;h()(l,"components",{QDialog:c.Z,QCard:u.Z,QCardSection:d.Z,QIcon:j.Z,QItemSection:m.Z,QItemLabel:p.Z,QCardActions:g.Z,QBtn:f.Z})},417:(s,e,t)=>{"use strict";t.d(e,{Z:()=>j});var n=t(9835),a=t(1957),i=t(499),o=t(4956);const r={props:{name:String,size:String,color:String,msg:String},emits:["click"],setup(s,{emit:e}){const t=s;return(s,r)=>{var l,c;const u=(0,n.up)("q-icon");return(0,n.wg)(),(0,n.j4)(u,{style:{cursor:"pointer"},name:t.name,size:null!==(l=t.size)&&void 0!==l?l:"sm",color:null!==(c=t.color)&&void 0!==c?c:"primary",onClick:r[0]||(r[0]=(0,a.iM)((s=>e("click")),["prevent","stop"]))},{default:(0,n.w5)((()=>[t.msg?((0,n.wg)(),(0,n.j4)((0,i.SU)(o.Z),{key:0,msg:t.msg},null,8,["msg"])):(0,n.kq)("",!0)])),_:1},8,["name","size","color"])}}};var l=t(2857),c=t(9984),u=t.n(c);const d=r,j=d;u()(r,"components",{QIcon:l.Z})},7071:(s,e,t)=>{"use strict";t.d(e,{Z:()=>m});var n=t(9835),a=t(6970);const i={props:{name:String,caption:String,icon:String},setup(s){return(e,t)=>{const i=(0,n.up)("q-icon"),o=(0,n.up)("q-item-section"),r=(0,n.up)("q-item-label"),l=(0,n.up)("q-item");return(0,n.wg)(),(0,n.j4)(l,null,{default:(0,n.w5)((()=>[(0,n.Wm)(o,{avatar:""},{default:(0,n.w5)((()=>[(0,n.Wm)(i,{name:s.icon,size:"md"},null,8,["name"])])),_:1}),(0,n.Wm)(o,null,{default:(0,n.w5)((()=>[(0,n.Wm)(r,null,{default:(0,n.w5)((()=>[(0,n.Uk)((0,a.zw)(s.name),1)])),_:1}),(0,n.Wm)(r,{caption:""},{default:(0,n.w5)((()=>[(0,n.Uk)((0,a.zw)(s.caption),1)])),_:1})])),_:1})])),_:1})}}};var o=t(490),r=t(1233),l=t(2857),c=t(3115),u=t(9984),d=t.n(u);const j=i,m=j;d()(i,"components",{QItem:o.Z,QItemSection:r.Z,QIcon:l.Z,QItemLabel:c.Z})},4956:(s,e,t)=>{"use strict";t.d(e,{Z:()=>u});var n=t(9835),a=t(6970);const i={props:{msg:String},setup(s){const e=s;return(s,t)=>{const i=(0,n.up)("q-tooltip");return(0,n.wg)(),(0,n.j4)(i,{class:"tooltip-bg",anchor:"top middle",self:"bottom middle",offset:[10,10]},{default:(0,n.w5)((()=>[(0,n.Uk)((0,a.zw)(e.msg),1)])),_:1})}}};var o=t(6858),r=t(9984),l=t.n(r);const c=i,u=c;l()(i,"components",{QTooltip:o.Z})},6700:(s,e,t)=>{var n={"./af":3902,"./af.js":3902,"./ar":6314,"./ar-dz":5666,"./ar-dz.js":5666,"./ar-kw":6591,"./ar-kw.js":6591,"./ar-ly":7900,"./ar-ly.js":7900,"./ar-ma":5667,"./ar-ma.js":5667,"./ar-sa":4092,"./ar-sa.js":4092,"./ar-tn":1379,"./ar-tn.js":1379,"./ar.js":6314,"./az":1699,"./az.js":1699,"./be":8988,"./be.js":8988,"./bg":7437,"./bg.js":7437,"./bm":7947,"./bm.js":7947,"./bn":2851,"./bn-bd":4905,"./bn-bd.js":4905,"./bn.js":2851,"./bo":7346,"./bo.js":7346,"./br":1711,"./br.js":1711,"./bs":4974,"./bs.js":4974,"./ca":112,"./ca.js":112,"./cs":6406,"./cs.js":6406,"./cv":1853,"./cv.js":1853,"./cy":9766,"./cy.js":9766,"./da":6836,"./da.js":6836,"./de":9320,"./de-at":4904,"./de-at.js":4904,"./de-ch":6710,"./de-ch.js":6710,"./de.js":9320,"./dv":3274,"./dv.js":3274,"./el":286,"./el.js":286,"./en-au":143,"./en-au.js":143,"./en-ca":237,"./en-ca.js":237,"./en-gb":2428,"./en-gb.js":2428,"./en-ie":3349,"./en-ie.js":3349,"./en-il":3764,"./en-il.js":3764,"./en-in":7809,"./en-in.js":7809,"./en-nz":9851,"./en-nz.js":9851,"./en-sg":5594,"./en-sg.js":5594,"./eo":4483,"./eo.js":4483,"./es":2184,"./es-do":5777,"./es-do.js":5777,"./es-mx":9356,"./es-mx.js":9356,"./es-us":8496,"./es-us.js":8496,"./es.js":2184,"./et":7578,"./et.js":7578,"./eu":2092,"./eu.js":2092,"./fa":5927,"./fa.js":5927,"./fi":171,"./fi.js":171,"./fil":2416,"./fil.js":2416,"./fo":9937,"./fo.js":9937,"./fr":5172,"./fr-ca":8249,"./fr-ca.js":8249,"./fr-ch":7541,"./fr-ch.js":7541,"./fr.js":5172,"./fy":7907,"./fy.js":7907,"./ga":6361,"./ga.js":6361,"./gd":2282,"./gd.js":2282,"./gl":2630,"./gl.js":2630,"./gom-deva":680,"./gom-deva.js":680,"./gom-latn":6220,"./gom-latn.js":6220,"./gu":6272,"./gu.js":6272,"./he":5540,"./he.js":5540,"./hi":6067,"./hi.js":6067,"./hr":9669,"./hr.js":9669,"./hu":3396,"./hu.js":3396,"./hy-am":6678,"./hy-am.js":6678,"./id":4812,"./id.js":4812,"./is":4193,"./is.js":4193,"./it":7863,"./it-ch":959,"./it-ch.js":959,"./it.js":7863,"./ja":1809,"./ja.js":1809,"./jv":8657,"./jv.js":8657,"./ka":3290,"./ka.js":3290,"./kk":8418,"./kk.js":8418,"./km":7687,"./km.js":7687,"./kn":1375,"./kn.js":1375,"./ko":2641,"./ko.js":2641,"./ku":3518,"./ku.js":3518,"./ky":5459,"./ky.js":5459,"./lb":1978,"./lb.js":1978,"./lo":6915,"./lo.js":6915,"./lt":8948,"./lt.js":8948,"./lv":2548,"./lv.js":2548,"./me":8608,"./me.js":8608,"./mi":333,"./mi.js":333,"./mk":1876,"./mk.js":1876,"./ml":999,"./ml.js":999,"./mn":4098,"./mn.js":4098,"./mr":6111,"./mr.js":6111,"./ms":3717,"./ms-my":265,"./ms-my.js":265,"./ms.js":3717,"./mt":8980,"./mt.js":8980,"./my":6895,"./my.js":6895,"./nb":5348,"./nb.js":5348,"./ne":1493,"./ne.js":1493,"./nl":4419,"./nl-be":5576,"./nl-be.js":5576,"./nl.js":4419,"./nn":6907,"./nn.js":6907,"./oc-lnc":2321,"./oc-lnc.js":2321,"./pa-in":9239,"./pa-in.js":9239,"./pl":7627,"./pl.js":7627,"./pt":5703,"./pt-br":1623,"./pt-br.js":1623,"./pt.js":5703,"./ro":2747,"./ro.js":2747,"./ru":4420,"./ru.js":4420,"./sd":2148,"./sd.js":2148,"./se":2461,"./se.js":2461,"./si":2783,"./si.js":2783,"./sk":3306,"./sk.js":3306,"./sl":341,"./sl.js":341,"./sq":2768,"./sq.js":2768,"./sr":2451,"./sr-cyrl":3371,"./sr-cyrl.js":3371,"./sr.js":2451,"./ss":8812,"./ss.js":8812,"./sv":3820,"./sv.js":3820,"./sw":3615,"./sw.js":3615,"./ta":2869,"./ta.js":2869,"./te":2044,"./te.js":2044,"./tet":5861,"./tet.js":5861,"./tg":6999,"./tg.js":6999,"./th":1772,"./th.js":1772,"./tk":7443,"./tk.js":7443,"./tl-ph":9786,"./tl-ph.js":9786,"./tlh":2812,"./tlh.js":2812,"./tr":6952,"./tr.js":6952,"./tzl":9573,"./tzl.js":9573,"./tzm":5990,"./tzm-latn":6961,"./tzm-latn.js":6961,"./tzm.js":5990,"./ug-cn":2610,"./ug-cn.js":2610,"./uk":9498,"./uk.js":9498,"./ur":3970,"./ur.js":3970,"./uz":9006,"./uz-latn":26,"./uz-latn.js":26,"./uz.js":9006,"./vi":9962,"./vi.js":9962,"./x-pseudo":8407,"./x-pseudo.js":8407,"./yo":1962,"./yo.js":1962,"./zh-cn":8909,"./zh-cn.js":8909,"./zh-hk":4014,"./zh-hk.js":4014,"./zh-mo":996,"./zh-mo.js":996,"./zh-tw":6327,"./zh-tw.js":6327};function a(s){var e=i(s);return t(e)}function i(s){if(!t.o(n,s)){var e=new Error("Cannot find module '"+s+"'");throw e.code="MODULE_NOT_FOUND",e}return n[s]}a.keys=function(){return Object.keys(n)},a.resolve=i,s.exports=a,a.id=6700}}]);