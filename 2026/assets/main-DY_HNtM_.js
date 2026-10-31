(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))n(r);new MutationObserver(r=>{for(const s of r)if(s.type==="childList")for(const a of s.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&n(a)}).observe(document,{childList:!0,subtree:!0});function e(r){const s={};return r.integrity&&(s.integrity=r.integrity),r.referrerPolicy&&(s.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?s.credentials="include":r.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function n(r){if(r.ep)return;r.ep=!0;const s=e(r);fetch(r.href,s)}})();const df=()=>/iPad|iPhone|iPod/.test(navigator.userAgent)||navigator.platform==="MacIntel"&&navigator.maxTouchPoints>1,pf=()=>df()||/Android|Mobile/i.test(navigator.userAgent);let mf=class{constructor(t,e){this.video=t,this.facing=e??(pf()?"environment":"user"),t.muted=!0,t.playsInline=!0,t.autoplay=!0,t.setAttribute("playsinline",""),t.setAttribute("muted","")}stream=null;facing;async open(t=this.facing){const e=!!this.stream;this.stop(),e&&await new Promise(r=>setTimeout(r,100));const n={facingMode:t,width:{ideal:1280},height:{ideal:720},frameRate:{ideal:30}};this.stream=await navigator.mediaDevices.getUserMedia({audio:!1,video:n}),this.facing=t,this.video.srcObject=this.stream,await this.video.play().catch(()=>{}),this.video.readyState<2&&await new Promise(r=>this.video.addEventListener("loadeddata",()=>r(),{once:!0}))}async flip(){await this.open(this.facing==="user"?"environment":"user")}get mirrored(){return this.facing==="user"}stop(){if(this.stream){for(const t of this.stream.getTracks())t.stop();this.video.srcObject=null,this.stream=null}}};const gf="modulepreload",vf=function(i,t){return new URL(i,t).href},zc={},_f=function(t,e,n){let r=Promise.resolve();if(e&&e.length>0){let a=function(h){return Promise.all(h.map(u=>Promise.resolve(u).then(d=>({status:"fulfilled",value:d}),d=>({status:"rejected",reason:d}))))};const o=document.getElementsByTagName("link"),c=document.querySelector("meta[property=csp-nonce]"),l=c?.nonce||c?.getAttribute("nonce");r=a(e.map(h=>{if(h=vf(h,n),h in zc)return;zc[h]=!0;const u=h.endsWith(".css"),d=u?'[rel="stylesheet"]':"";if(!!n)for(let x=o.length-1;x>=0;x--){const g=o[x];if(g.href===h&&(!u||g.rel==="stylesheet"))return}else if(document.querySelector(`link[href="${h}"]${d}`))return;const m=document.createElement("link");if(m.rel=u?"stylesheet":gf,u||(m.as="script"),m.crossOrigin="",m.href=h,l&&m.setAttribute("nonce",l),document.head.appendChild(m),u)return new Promise((x,g)=>{m.addEventListener("load",x),m.addEventListener("error",()=>g(new Error(`Unable to preload CSS for ${h}`)))})}))}function s(a){const o=new Event("vite:preloadError",{cancelable:!0});if(o.payload=a,window.dispatchEvent(o),!o.defaultPrevented)throw a}return r.then(a=>{for(const o of a||[])o.status==="rejected"&&s(o.reason);return t().catch(s)})},q={nose:0,eyeInL:1,eyeL:2,eyeOutL:3,eyeInR:4,eyeR:5,eyeOutR:6,earL:7,earR:8,mouthL:9,mouthR:10,shL:11,shR:12,elL:13,elR:14,wrL:15,wrR:16,pinkyL:17,pinkyR:18,indexL:19,indexR:20,thumbL:21,thumbR:22,hipL:23,hipR:24,knL:25,knR:26,anL:27,anR:28,heelL:29,heelR:30,toeL:31,toeR:32},ho=33;function xf(i){return{x:i.x,y:-i.y,z:-i.z,v:i.visibility??1}}const Mf=[[q.shL,q.shR],[q.shL,q.elL],[q.elL,q.wrL],[q.shR,q.elR],[q.elR,q.wrR],[q.shL,q.hipL],[q.shR,q.hipR],[q.hipL,q.hipR],[q.hipL,q.knL],[q.knL,q.anL],[q.hipR,q.knR],[q.knR,q.anR],[q.anL,q.toeL],[q.anR,q.toeR],[q.earL,q.eyeL],[q.eyeL,q.nose],[q.nose,q.eyeR],[q.eyeR,q.earR]];class Ph{constructor(t,e){this.model=t,this.numPoses=e}lm=null;lastTs=-1;delegate="GPU";inferMs=0;async load(t){t?.("loading the pose engine");const n=await _f(()=>import("./vision_bundle-Bk4VIwNi.js"),[],import.meta.url),r=await n.FilesetResolver.forVisionTasks("./mediapipe"),s=a=>n.PoseLandmarker.createFromOptions(r,{baseOptions:{modelAssetPath:`./models/pose_landmarker_${this.model}.task`,delegate:a},runningMode:"VIDEO",numPoses:this.numPoses,minPoseDetectionConfidence:.5,minPosePresenceConfidence:.5,minTrackingConfidence:.5});t?.(`loading the ${this.model} pose model`);try{this.lm=await s("GPU"),this.delegate="GPU"}catch(a){console.warn("GPU delegate failed, using CPU",a),this.lm=await s("CPU"),this.delegate="CPU"}}async setOptions(t){t.numPoses&&(this.numPoses=t.numPoses,await this.lm?.setOptions({numPoses:t.numPoses}))}detect(t,e){if(!this.lm)return[];e<=this.lastTs&&(e=this.lastTs+1),this.lastTs=e;const n=performance.now(),r=this.lm.detectForVideo(t,e);this.inferMs=performance.now()-n;const s=[];for(let a=0;a<r.landmarks.length;a++){const o=r.landmarks[a],c=r.worldLandmarks[a];c&&s.push({image:o.map(l=>({x:l.x,y:l.y,z:l.z,v:l.visibility??1})),world:c.map(xf)})}return s}close(){this.lm?.close(),this.lm=null}}function Sf(i,t,e=.85){return{f:e*Math.max(i,t),cx:i/2,cy:t/2,w:i,h:t}}function yf(i,t,e,n=.5){let r=0,s=0,a=0,o=0,c=0,l=0,h=0,u=0,d=0;for(let w=0;w<i.length&&w<t.length;w++){const y=i[w],M=t[w],T=Math.min(y.v,M.v);if(T<n)continue;const E=(M.x*e.w-e.cx)/e.f,A=(e.cy-M.y*e.h)/e.f,C=-E*y.z-y.x,v=-A*y.z-y.y;r+=T,s+=T*E,c+=T*E*E,l+=T*C,u+=T*E*C,a+=T,o+=T*A,c+=T*A*A,h+=T*v,u+=T*A*v,d++}if(d<4)return null;const f=c-s*s/r-o*o/a,m=u-s*l/r-o*h/a;if(Math.abs(f)<1e-9)return null;const x=m/f,g=(l-s*x)/r,p=(h-o*x)/a;return!(x<-.2)||!isFinite(g)||!isFinite(p)?null:{x:g,y:p,z:x}}function bf(i,t){const e=-i.z;return{x:(t.cx+t.f*i.x/e)/t.w,y:(t.cy-t.f*i.y/e)/t.h}}const gs=(i,t)=>({x:(i.x+t.x)/2,y:(i.y+t.y)/2,z:(i.z+t.z)/2,v:Math.min(i.v,t.v)}),En=(i,t)=>Math.hypot(i.x-t.x,i.y-t.y,i.z-t.z);function Hc(i){const t=En(gs(i[q.shL],i[q.shR]),gs(i[q.hipL],i[q.hipR])),e=(En(i[q.shL],i[q.elL])+En(i[q.shR],i[q.elR]))/2,n=(En(i[q.elL],i[q.wrL])+En(i[q.elR],i[q.wrR]))/2,r=(En(i[q.hipL],i[q.knL])+En(i[q.hipR],i[q.knR]))/2,s=(En(i[q.knL],i[q.anL])+En(i[q.knR],i[q.anR]))/2,a=En(gs(i[q.shL],i[q.shR]),gs(i[q.earL],i[q.earR]));return{torso:t,upperArm:e,forearm:n,thigh:r,shin:s,neck:a}}const Nn={tauWorld:.045,tauImage:.035,tauXY:.05,tauZ:.14,tauLen:1.5,fadeIn:.22,fadeOut:.35,forgetAfter:.6,matchRadius:1.3},Vc=i=>{const t=[q.shL,q.shR,q.hipL,q.hipR];let e=0,n=0,r=0;for(const c of t){const l=i[c];e+=l.x,n+=l.y,r++}e/=r,n/=r;const s=(i[q.shL].x+i[q.shR].x)/2-(i[q.hipL].x+i[q.hipR].x)/2,a=(i[q.shL].y+i[q.shR].y)/2-(i[q.hipL].y+i[q.hipR].y)/2,o=Math.hypot(i[q.shL].x-i[q.shR].x,i[q.shL].y-i[q.shR].y);return{x:e,y:n,s:Math.max(Math.hypot(s,a),o,.04)}},oi=(i,t,e)=>i+(t-i)*e,Ir=(i,t)=>1-Math.exp(-i/Math.max(t,1e-4));function Gc(i,t,e){for(let n=0;n<ho;n++){const r=i[n],s=t[n];r.x=oi(r.x,s.x,e),r.y=oi(r.y,s.y,e),r.z=oi(r.z,s.z,e),r.v=oi(r.v,s.v,Math.min(1,e*1.5))}}const Wc=i=>i.map(t=>({...t}));class Ef{tracks=[];nextId=1;last=-1;update(t,e,n){const r=this.last<0?.03333333333333333:Math.min(.25,Math.max(.001,(e-this.last)/1e3));this.last=e;const s=t.map(h=>({d:h,T:yf(h.world,h.image,n),c:Vc(h.image)})).filter(h=>h.T),a=this.tracks.filter(h=>!h.lost||h.presence>0),o=[];a.forEach((h,u)=>{const d=Vc(h.image);s.forEach((f,m)=>{const x=Math.hypot(d.x-f.c.x,d.y-f.c.y)/d.s;x<Nn.matchRadius&&o.push({ti:u,di:m,cost:x})})}),o.sort((h,u)=>h.cost-u.cost);const c=new Set,l=new Set;for(const h of o){if(c.has(h.ti)||l.has(h.di))continue;c.add(h.ti),l.add(h.di);const u=a[h.ti],d=s[h.di],f=u.lost;Gc(u.world,d.d.world,f?1:Ir(r,Nn.tauWorld)),Gc(u.image,d.d.image,f?1:Ir(r,Nn.tauImage));const m=f?1:Ir(r,Nn.tauXY),x=f?1:Ir(r,Nn.tauZ);u.T={x:oi(u.T.x,d.T.x,m),y:oi(u.T.y,d.T.y,m),z:oi(u.T.z,d.T.z,x)};const g=Hc(u.world),p=Ir(r,Nn.tauLen);for(const w of Object.keys(g))u.len[w]=oi(u.len[w],g[w],p);u.seen=e,u.lost=!1}s.forEach((h,u)=>{if(l.has(u))return;const d=Wc(h.d.world);this.tracks.push({id:this.nextId++,born:e,seen:e,image:Wc(h.d.image),world:d,T:{...h.T},len:Hc(d),presence:0,lost:!1})});for(const h of this.tracks)h.seen!==e&&(h.lost=!0),h.presence=h.lost?Math.max(0,h.presence-r/Nn.fadeOut):Math.min(1,h.presence+r/Nn.fadeIn);return this.tracks=this.tracks.filter(h=>!(h.lost&&h.presence<=0&&e-h.seen>Nn.forgetAfter*1e3)),this.tracks}clear(){this.tracks=[],this.last=-1}}/**
 * @license
 * Copyright 2010-2025 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const oc="180",wf=0,Xc=1,Tf=2,Dh=1,Ih=2,Vn=3,pi=0,Ke=1,Sn=2,hi=0,gr=1,qc=2,Yc=3,$c=4,Af=5,Ai=100,Rf=101,Cf=102,Lf=103,Pf=104,Df=200,If=201,Uf=202,Nf=203,uo=204,fo=205,Ff=206,Of=207,Bf=208,kf=209,zf=210,Hf=211,Vf=212,Gf=213,Wf=214,po=0,mo=1,go=2,xr=3,vo=4,_o=5,xo=6,Mo=7,Uh=0,Xf=1,qf=2,ui=0,Yf=1,$f=2,Zf=3,Jf=4,Kf=5,jf=6,Nh=7,Zc="attached",Qf="detached",Fh=300,Mr=301,Sr=302,aa=303,So=304,da=306,Kr=1e3,Pi=1001,yo=1002,sn=1003,td=1004,vs=1005,He=1006,Ma=1007,Di=1008,Dn=1009,Oh=1010,Bh=1011,jr=1012,cc=1013,Bi=1014,Cn=1015,wr=1016,lc=1017,hc=1018,Qr=1020,kh=35902,zh=35899,Hh=1021,Vh=1022,rn=1023,ts=1026,es=1027,Gh=1028,uc=1029,Wh=1030,fc=1031,dc=1033,js=33776,Qs=33777,ta=33778,ea=33779,bo=35840,Eo=35841,wo=35842,To=35843,Ao=36196,Ro=37492,Co=37496,Lo=37808,Po=37809,Do=37810,Io=37811,Uo=37812,No=37813,Fo=37814,Oo=37815,Bo=37816,ko=37817,zo=37818,Ho=37819,Vo=37820,Go=37821,Wo=36492,Xo=36494,qo=36495,Yo=36283,$o=36284,Zo=36285,Jo=36286,ed=3200,nd=3201,Xh=0,id=1,Rn="",nn="srgb",ki="srgb-linear",oa="linear",he="srgb",qi=7680,Jc=519,rd=512,sd=513,ad=514,qh=515,od=516,cd=517,ld=518,hd=519,Kc=35044,_s=35048,jc="300 es",Ln=2e3,ca=2001;class Tr{addEventListener(t,e){this._listeners===void 0&&(this._listeners={});const n=this._listeners;n[t]===void 0&&(n[t]=[]),n[t].indexOf(e)===-1&&n[t].push(e)}hasEventListener(t,e){const n=this._listeners;return n===void 0?!1:n[t]!==void 0&&n[t].indexOf(e)!==-1}removeEventListener(t,e){const n=this._listeners;if(n===void 0)return;const r=n[t];if(r!==void 0){const s=r.indexOf(e);s!==-1&&r.splice(s,1)}}dispatchEvent(t){const e=this._listeners;if(e===void 0)return;const n=e[t.type];if(n!==void 0){t.target=this;const r=n.slice(0);for(let s=0,a=r.length;s<a;s++)r[s].call(this,t);t.target=null}}}const Oe=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];let Qc=1234567;const qr=Math.PI/180,ns=180/Math.PI;function gi(){const i=Math.random()*4294967295|0,t=Math.random()*4294967295|0,e=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(Oe[i&255]+Oe[i>>8&255]+Oe[i>>16&255]+Oe[i>>24&255]+"-"+Oe[t&255]+Oe[t>>8&255]+"-"+Oe[t>>16&15|64]+Oe[t>>24&255]+"-"+Oe[e&63|128]+Oe[e>>8&255]+"-"+Oe[e>>16&255]+Oe[e>>24&255]+Oe[n&255]+Oe[n>>8&255]+Oe[n>>16&255]+Oe[n>>24&255]).toLowerCase()}function te(i,t,e){return Math.max(t,Math.min(e,i))}function pc(i,t){return(i%t+t)%t}function ud(i,t,e,n,r){return n+(i-t)*(r-n)/(e-t)}function fd(i,t,e){return i!==t?(e-i)/(t-i):0}function Yr(i,t,e){return(1-e)*i+e*t}function dd(i,t,e,n){return Yr(i,t,1-Math.exp(-e*n))}function pd(i,t=1){return t-Math.abs(pc(i,t*2)-t)}function md(i,t,e){return i<=t?0:i>=e?1:(i=(i-t)/(e-t),i*i*(3-2*i))}function gd(i,t,e){return i<=t?0:i>=e?1:(i=(i-t)/(e-t),i*i*i*(i*(i*6-15)+10))}function vd(i,t){return i+Math.floor(Math.random()*(t-i+1))}function _d(i,t){return i+Math.random()*(t-i)}function xd(i){return i*(.5-Math.random())}function Md(i){i!==void 0&&(Qc=i);let t=Qc+=1831565813;return t=Math.imul(t^t>>>15,t|1),t^=t+Math.imul(t^t>>>7,t|61),((t^t>>>14)>>>0)/4294967296}function Sd(i){return i*qr}function yd(i){return i*ns}function bd(i){return(i&i-1)===0&&i!==0}function Ed(i){return Math.pow(2,Math.ceil(Math.log(i)/Math.LN2))}function wd(i){return Math.pow(2,Math.floor(Math.log(i)/Math.LN2))}function Td(i,t,e,n,r){const s=Math.cos,a=Math.sin,o=s(e/2),c=a(e/2),l=s((t+n)/2),h=a((t+n)/2),u=s((t-n)/2),d=a((t-n)/2),f=s((n-t)/2),m=a((n-t)/2);switch(r){case"XYX":i.set(o*h,c*u,c*d,o*l);break;case"YZY":i.set(c*d,o*h,c*u,o*l);break;case"ZXZ":i.set(c*u,c*d,o*h,o*l);break;case"XZX":i.set(o*h,c*m,c*f,o*l);break;case"YXY":i.set(c*f,o*h,c*m,o*l);break;case"ZYZ":i.set(c*m,c*f,o*h,o*l);break;default:console.warn("THREE.MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+r)}}function hr(i,t){switch(t.constructor){case Float32Array:return i;case Uint32Array:return i/4294967295;case Uint16Array:return i/65535;case Uint8Array:return i/255;case Int32Array:return Math.max(i/2147483647,-1);case Int16Array:return Math.max(i/32767,-1);case Int8Array:return Math.max(i/127,-1);default:throw new Error("Invalid component type.")}}function Ge(i,t){switch(t.constructor){case Float32Array:return i;case Uint32Array:return Math.round(i*4294967295);case Uint16Array:return Math.round(i*65535);case Uint8Array:return Math.round(i*255);case Int32Array:return Math.round(i*2147483647);case Int16Array:return Math.round(i*32767);case Int8Array:return Math.round(i*127);default:throw new Error("Invalid component type.")}}const Ad={DEG2RAD:qr,RAD2DEG:ns,generateUUID:gi,clamp:te,euclideanModulo:pc,mapLinear:ud,inverseLerp:fd,lerp:Yr,damp:dd,pingpong:pd,smoothstep:md,smootherstep:gd,randInt:vd,randFloat:_d,randFloatSpread:xd,seededRandom:Md,degToRad:Sd,radToDeg:yd,isPowerOfTwo:bd,ceilPowerOfTwo:Ed,floorPowerOfTwo:wd,setQuaternionFromProperEuler:Td,normalize:Ge,denormalize:hr};class St{constructor(t=0,e=0){St.prototype.isVector2=!0,this.x=t,this.y=e}get width(){return this.x}set width(t){this.x=t}get height(){return this.y}set height(t){this.y=t}set(t,e){return this.x=t,this.y=e,this}setScalar(t){return this.x=t,this.y=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y)}copy(t){return this.x=t.x,this.y=t.y,this}add(t){return this.x+=t.x,this.y+=t.y,this}addScalar(t){return this.x+=t,this.y+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this}subScalar(t){return this.x-=t,this.y-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this}multiply(t){return this.x*=t.x,this.y*=t.y,this}multiplyScalar(t){return this.x*=t,this.y*=t,this}divide(t){return this.x/=t.x,this.y/=t.y,this}divideScalar(t){return this.multiplyScalar(1/t)}applyMatrix3(t){const e=this.x,n=this.y,r=t.elements;return this.x=r[0]*e+r[3]*n+r[6],this.y=r[1]*e+r[4]*n+r[7],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this}clamp(t,e){return this.x=te(this.x,t.x,e.x),this.y=te(this.y,t.y,e.y),this}clampScalar(t,e){return this.x=te(this.x,t,e),this.y=te(this.y,t,e),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(te(n,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(t){return this.x*t.x+this.y*t.y}cross(t){return this.x*t.y-this.y*t.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const n=this.dot(t)/e;return Math.acos(te(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,n=this.y-t.y;return e*e+n*n}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this}equals(t){return t.x===this.x&&t.y===this.y}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this}rotateAround(t,e){const n=Math.cos(e),r=Math.sin(e),s=this.x-t.x,a=this.y-t.y;return this.x=s*n-a*r+t.x,this.y=s*r+a*n+t.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class ke{constructor(t=0,e=0,n=0,r=1){this.isQuaternion=!0,this._x=t,this._y=e,this._z=n,this._w=r}static slerpFlat(t,e,n,r,s,a,o){let c=n[r+0],l=n[r+1],h=n[r+2],u=n[r+3];const d=s[a+0],f=s[a+1],m=s[a+2],x=s[a+3];if(o===0){t[e+0]=c,t[e+1]=l,t[e+2]=h,t[e+3]=u;return}if(o===1){t[e+0]=d,t[e+1]=f,t[e+2]=m,t[e+3]=x;return}if(u!==x||c!==d||l!==f||h!==m){let g=1-o;const p=c*d+l*f+h*m+u*x,w=p>=0?1:-1,y=1-p*p;if(y>Number.EPSILON){const T=Math.sqrt(y),E=Math.atan2(T,p*w);g=Math.sin(g*E)/T,o=Math.sin(o*E)/T}const M=o*w;if(c=c*g+d*M,l=l*g+f*M,h=h*g+m*M,u=u*g+x*M,g===1-o){const T=1/Math.sqrt(c*c+l*l+h*h+u*u);c*=T,l*=T,h*=T,u*=T}}t[e]=c,t[e+1]=l,t[e+2]=h,t[e+3]=u}static multiplyQuaternionsFlat(t,e,n,r,s,a){const o=n[r],c=n[r+1],l=n[r+2],h=n[r+3],u=s[a],d=s[a+1],f=s[a+2],m=s[a+3];return t[e]=o*m+h*u+c*f-l*d,t[e+1]=c*m+h*d+l*u-o*f,t[e+2]=l*m+h*f+o*d-c*u,t[e+3]=h*m-o*u-c*d-l*f,t}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get w(){return this._w}set w(t){this._w=t,this._onChangeCallback()}set(t,e,n,r){return this._x=t,this._y=e,this._z=n,this._w=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(t){return this._x=t.x,this._y=t.y,this._z=t.z,this._w=t.w,this._onChangeCallback(),this}setFromEuler(t,e=!0){const n=t._x,r=t._y,s=t._z,a=t._order,o=Math.cos,c=Math.sin,l=o(n/2),h=o(r/2),u=o(s/2),d=c(n/2),f=c(r/2),m=c(s/2);switch(a){case"XYZ":this._x=d*h*u+l*f*m,this._y=l*f*u-d*h*m,this._z=l*h*m+d*f*u,this._w=l*h*u-d*f*m;break;case"YXZ":this._x=d*h*u+l*f*m,this._y=l*f*u-d*h*m,this._z=l*h*m-d*f*u,this._w=l*h*u+d*f*m;break;case"ZXY":this._x=d*h*u-l*f*m,this._y=l*f*u+d*h*m,this._z=l*h*m+d*f*u,this._w=l*h*u-d*f*m;break;case"ZYX":this._x=d*h*u-l*f*m,this._y=l*f*u+d*h*m,this._z=l*h*m-d*f*u,this._w=l*h*u+d*f*m;break;case"YZX":this._x=d*h*u+l*f*m,this._y=l*f*u+d*h*m,this._z=l*h*m-d*f*u,this._w=l*h*u-d*f*m;break;case"XZY":this._x=d*h*u-l*f*m,this._y=l*f*u-d*h*m,this._z=l*h*m+d*f*u,this._w=l*h*u+d*f*m;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+a)}return e===!0&&this._onChangeCallback(),this}setFromAxisAngle(t,e){const n=e/2,r=Math.sin(n);return this._x=t.x*r,this._y=t.y*r,this._z=t.z*r,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(t){const e=t.elements,n=e[0],r=e[4],s=e[8],a=e[1],o=e[5],c=e[9],l=e[2],h=e[6],u=e[10],d=n+o+u;if(d>0){const f=.5/Math.sqrt(d+1);this._w=.25/f,this._x=(h-c)*f,this._y=(s-l)*f,this._z=(a-r)*f}else if(n>o&&n>u){const f=2*Math.sqrt(1+n-o-u);this._w=(h-c)/f,this._x=.25*f,this._y=(r+a)/f,this._z=(s+l)/f}else if(o>u){const f=2*Math.sqrt(1+o-n-u);this._w=(s-l)/f,this._x=(r+a)/f,this._y=.25*f,this._z=(c+h)/f}else{const f=2*Math.sqrt(1+u-n-o);this._w=(a-r)/f,this._x=(s+l)/f,this._y=(c+h)/f,this._z=.25*f}return this._onChangeCallback(),this}setFromUnitVectors(t,e){let n=t.dot(e)+1;return n<1e-8?(n=0,Math.abs(t.x)>Math.abs(t.z)?(this._x=-t.y,this._y=t.x,this._z=0,this._w=n):(this._x=0,this._y=-t.z,this._z=t.y,this._w=n)):(this._x=t.y*e.z-t.z*e.y,this._y=t.z*e.x-t.x*e.z,this._z=t.x*e.y-t.y*e.x,this._w=n),this.normalize()}angleTo(t){return 2*Math.acos(Math.abs(te(this.dot(t),-1,1)))}rotateTowards(t,e){const n=this.angleTo(t);if(n===0)return this;const r=Math.min(1,e/n);return this.slerp(t,r),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(t){return this._x*t._x+this._y*t._y+this._z*t._z+this._w*t._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let t=this.length();return t===0?(this._x=0,this._y=0,this._z=0,this._w=1):(t=1/t,this._x=this._x*t,this._y=this._y*t,this._z=this._z*t,this._w=this._w*t),this._onChangeCallback(),this}multiply(t){return this.multiplyQuaternions(this,t)}premultiply(t){return this.multiplyQuaternions(t,this)}multiplyQuaternions(t,e){const n=t._x,r=t._y,s=t._z,a=t._w,o=e._x,c=e._y,l=e._z,h=e._w;return this._x=n*h+a*o+r*l-s*c,this._y=r*h+a*c+s*o-n*l,this._z=s*h+a*l+n*c-r*o,this._w=a*h-n*o-r*c-s*l,this._onChangeCallback(),this}slerp(t,e){if(e===0)return this;if(e===1)return this.copy(t);const n=this._x,r=this._y,s=this._z,a=this._w;let o=a*t._w+n*t._x+r*t._y+s*t._z;if(o<0?(this._w=-t._w,this._x=-t._x,this._y=-t._y,this._z=-t._z,o=-o):this.copy(t),o>=1)return this._w=a,this._x=n,this._y=r,this._z=s,this;const c=1-o*o;if(c<=Number.EPSILON){const f=1-e;return this._w=f*a+e*this._w,this._x=f*n+e*this._x,this._y=f*r+e*this._y,this._z=f*s+e*this._z,this.normalize(),this}const l=Math.sqrt(c),h=Math.atan2(l,o),u=Math.sin((1-e)*h)/l,d=Math.sin(e*h)/l;return this._w=a*u+this._w*d,this._x=n*u+this._x*d,this._y=r*u+this._y*d,this._z=s*u+this._z*d,this._onChangeCallback(),this}slerpQuaternions(t,e,n){return this.copy(t).slerp(e,n)}random(){const t=2*Math.PI*Math.random(),e=2*Math.PI*Math.random(),n=Math.random(),r=Math.sqrt(1-n),s=Math.sqrt(n);return this.set(r*Math.sin(t),r*Math.cos(t),s*Math.sin(e),s*Math.cos(e))}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._w===this._w}fromArray(t,e=0){return this._x=t[e],this._y=t[e+1],this._z=t[e+2],this._w=t[e+3],this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._w,t}fromBufferAttribute(t,e){return this._x=t.getX(e),this._y=t.getY(e),this._z=t.getZ(e),this._w=t.getW(e),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class O{constructor(t=0,e=0,n=0){O.prototype.isVector3=!0,this.x=t,this.y=e,this.z=n}set(t,e,n){return n===void 0&&(n=this.z),this.x=t,this.y=e,this.z=n,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this}multiplyVectors(t,e){return this.x=t.x*e.x,this.y=t.y*e.y,this.z=t.z*e.z,this}applyEuler(t){return this.applyQuaternion(tl.setFromEuler(t))}applyAxisAngle(t,e){return this.applyQuaternion(tl.setFromAxisAngle(t,e))}applyMatrix3(t){const e=this.x,n=this.y,r=this.z,s=t.elements;return this.x=s[0]*e+s[3]*n+s[6]*r,this.y=s[1]*e+s[4]*n+s[7]*r,this.z=s[2]*e+s[5]*n+s[8]*r,this}applyNormalMatrix(t){return this.applyMatrix3(t).normalize()}applyMatrix4(t){const e=this.x,n=this.y,r=this.z,s=t.elements,a=1/(s[3]*e+s[7]*n+s[11]*r+s[15]);return this.x=(s[0]*e+s[4]*n+s[8]*r+s[12])*a,this.y=(s[1]*e+s[5]*n+s[9]*r+s[13])*a,this.z=(s[2]*e+s[6]*n+s[10]*r+s[14])*a,this}applyQuaternion(t){const e=this.x,n=this.y,r=this.z,s=t.x,a=t.y,o=t.z,c=t.w,l=2*(a*r-o*n),h=2*(o*e-s*r),u=2*(s*n-a*e);return this.x=e+c*l+a*u-o*h,this.y=n+c*h+o*l-s*u,this.z=r+c*u+s*h-a*l,this}project(t){return this.applyMatrix4(t.matrixWorldInverse).applyMatrix4(t.projectionMatrix)}unproject(t){return this.applyMatrix4(t.projectionMatrixInverse).applyMatrix4(t.matrixWorld)}transformDirection(t){const e=this.x,n=this.y,r=this.z,s=t.elements;return this.x=s[0]*e+s[4]*n+s[8]*r,this.y=s[1]*e+s[5]*n+s[9]*r,this.z=s[2]*e+s[6]*n+s[10]*r,this.normalize()}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this}divideScalar(t){return this.multiplyScalar(1/t)}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this}clamp(t,e){return this.x=te(this.x,t.x,e.x),this.y=te(this.y,t.y,e.y),this.z=te(this.z,t.z,e.z),this}clampScalar(t,e){return this.x=te(this.x,t,e),this.y=te(this.y,t,e),this.z=te(this.z,t,e),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(te(n,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this}cross(t){return this.crossVectors(this,t)}crossVectors(t,e){const n=t.x,r=t.y,s=t.z,a=e.x,o=e.y,c=e.z;return this.x=r*c-s*o,this.y=s*a-n*c,this.z=n*o-r*a,this}projectOnVector(t){const e=t.lengthSq();if(e===0)return this.set(0,0,0);const n=t.dot(this)/e;return this.copy(t).multiplyScalar(n)}projectOnPlane(t){return Sa.copy(this).projectOnVector(t),this.sub(Sa)}reflect(t){return this.sub(Sa.copy(t).multiplyScalar(2*this.dot(t)))}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const n=this.dot(t)/e;return Math.acos(te(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,n=this.y-t.y,r=this.z-t.z;return e*e+n*n+r*r}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)+Math.abs(this.z-t.z)}setFromSpherical(t){return this.setFromSphericalCoords(t.radius,t.phi,t.theta)}setFromSphericalCoords(t,e,n){const r=Math.sin(e)*t;return this.x=r*Math.sin(n),this.y=Math.cos(e)*t,this.z=r*Math.cos(n),this}setFromCylindrical(t){return this.setFromCylindricalCoords(t.radius,t.theta,t.y)}setFromCylindricalCoords(t,e,n){return this.x=t*Math.sin(e),this.y=n,this.z=t*Math.cos(e),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this}setFromMatrixScale(t){const e=this.setFromMatrixColumn(t,0).length(),n=this.setFromMatrixColumn(t,1).length(),r=this.setFromMatrixColumn(t,2).length();return this.x=e,this.y=n,this.z=r,this}setFromMatrixColumn(t,e){return this.fromArray(t.elements,e*4)}setFromMatrix3Column(t,e){return this.fromArray(t.elements,e*3)}setFromEuler(t){return this.x=t._x,this.y=t._y,this.z=t._z,this}setFromColor(t){return this.x=t.r,this.y=t.g,this.z=t.b,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const t=Math.random()*Math.PI*2,e=Math.random()*2-1,n=Math.sqrt(1-e*e);return this.x=n*Math.cos(t),this.y=e,this.z=n*Math.sin(t),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const Sa=new O,tl=new ke;class jt{constructor(t,e,n,r,s,a,o,c,l){jt.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],t!==void 0&&this.set(t,e,n,r,s,a,o,c,l)}set(t,e,n,r,s,a,o,c,l){const h=this.elements;return h[0]=t,h[1]=r,h[2]=o,h[3]=e,h[4]=s,h[5]=c,h[6]=n,h[7]=a,h[8]=l,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(t){const e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],this}extractBasis(t,e,n){return t.setFromMatrix3Column(this,0),e.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(t){const e=t.elements;return this.set(e[0],e[4],e[8],e[1],e[5],e[9],e[2],e[6],e[10]),this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const n=t.elements,r=e.elements,s=this.elements,a=n[0],o=n[3],c=n[6],l=n[1],h=n[4],u=n[7],d=n[2],f=n[5],m=n[8],x=r[0],g=r[3],p=r[6],w=r[1],y=r[4],M=r[7],T=r[2],E=r[5],A=r[8];return s[0]=a*x+o*w+c*T,s[3]=a*g+o*y+c*E,s[6]=a*p+o*M+c*A,s[1]=l*x+h*w+u*T,s[4]=l*g+h*y+u*E,s[7]=l*p+h*M+u*A,s[2]=d*x+f*w+m*T,s[5]=d*g+f*y+m*E,s[8]=d*p+f*M+m*A,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[3]*=t,e[6]*=t,e[1]*=t,e[4]*=t,e[7]*=t,e[2]*=t,e[5]*=t,e[8]*=t,this}determinant(){const t=this.elements,e=t[0],n=t[1],r=t[2],s=t[3],a=t[4],o=t[5],c=t[6],l=t[7],h=t[8];return e*a*h-e*o*l-n*s*h+n*o*c+r*s*l-r*a*c}invert(){const t=this.elements,e=t[0],n=t[1],r=t[2],s=t[3],a=t[4],o=t[5],c=t[6],l=t[7],h=t[8],u=h*a-o*l,d=o*c-h*s,f=l*s-a*c,m=e*u+n*d+r*f;if(m===0)return this.set(0,0,0,0,0,0,0,0,0);const x=1/m;return t[0]=u*x,t[1]=(r*l-h*n)*x,t[2]=(o*n-r*a)*x,t[3]=d*x,t[4]=(h*e-r*c)*x,t[5]=(r*s-o*e)*x,t[6]=f*x,t[7]=(n*c-l*e)*x,t[8]=(a*e-n*s)*x,this}transpose(){let t;const e=this.elements;return t=e[1],e[1]=e[3],e[3]=t,t=e[2],e[2]=e[6],e[6]=t,t=e[5],e[5]=e[7],e[7]=t,this}getNormalMatrix(t){return this.setFromMatrix4(t).invert().transpose()}transposeIntoArray(t){const e=this.elements;return t[0]=e[0],t[1]=e[3],t[2]=e[6],t[3]=e[1],t[4]=e[4],t[5]=e[7],t[6]=e[2],t[7]=e[5],t[8]=e[8],this}setUvTransform(t,e,n,r,s,a,o){const c=Math.cos(s),l=Math.sin(s);return this.set(n*c,n*l,-n*(c*a+l*o)+a+t,-r*l,r*c,-r*(-l*a+c*o)+o+e,0,0,1),this}scale(t,e){return this.premultiply(ya.makeScale(t,e)),this}rotate(t){return this.premultiply(ya.makeRotation(-t)),this}translate(t,e){return this.premultiply(ya.makeTranslation(t,e)),this}makeTranslation(t,e){return t.isVector2?this.set(1,0,t.x,0,1,t.y,0,0,1):this.set(1,0,t,0,1,e,0,0,1),this}makeRotation(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,n,e,0,0,0,1),this}makeScale(t,e){return this.set(t,0,0,0,e,0,0,0,1),this}equals(t){const e=this.elements,n=t.elements;for(let r=0;r<9;r++)if(e[r]!==n[r])return!1;return!0}fromArray(t,e=0){for(let n=0;n<9;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){const n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t}clone(){return new this.constructor().fromArray(this.elements)}}const ya=new jt;function Yh(i){for(let t=i.length-1;t>=0;--t)if(i[t]>=65535)return!0;return!1}function la(i){return document.createElementNS("http://www.w3.org/1999/xhtml",i)}function Rd(){const i=la("canvas");return i.style.display="block",i}const el={};function is(i){i in el||(el[i]=!0,console.warn(i))}function Cd(i,t,e){return new Promise(function(n,r){function s(){switch(i.clientWaitSync(t,i.SYNC_FLUSH_COMMANDS_BIT,0)){case i.WAIT_FAILED:r();break;case i.TIMEOUT_EXPIRED:setTimeout(s,e);break;default:n()}}setTimeout(s,e)})}const nl=new jt().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),il=new jt().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function Ld(){const i={enabled:!0,workingColorSpace:ki,spaces:{},convert:function(r,s,a){return this.enabled===!1||s===a||!s||!a||(this.spaces[s].transfer===he&&(r.r=qn(r.r),r.g=qn(r.g),r.b=qn(r.b)),this.spaces[s].primaries!==this.spaces[a].primaries&&(r.applyMatrix3(this.spaces[s].toXYZ),r.applyMatrix3(this.spaces[a].fromXYZ)),this.spaces[a].transfer===he&&(r.r=vr(r.r),r.g=vr(r.g),r.b=vr(r.b))),r},workingToColorSpace:function(r,s){return this.convert(r,this.workingColorSpace,s)},colorSpaceToWorking:function(r,s){return this.convert(r,s,this.workingColorSpace)},getPrimaries:function(r){return this.spaces[r].primaries},getTransfer:function(r){return r===Rn?oa:this.spaces[r].transfer},getToneMappingMode:function(r){return this.spaces[r].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(r,s=this.workingColorSpace){return r.fromArray(this.spaces[s].luminanceCoefficients)},define:function(r){Object.assign(this.spaces,r)},_getMatrix:function(r,s,a){return r.copy(this.spaces[s].toXYZ).multiply(this.spaces[a].fromXYZ)},_getDrawingBufferColorSpace:function(r){return this.spaces[r].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(r=this.workingColorSpace){return this.spaces[r].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(r,s){return is("THREE.ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),i.workingToColorSpace(r,s)},toWorkingColorSpace:function(r,s){return is("THREE.ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),i.colorSpaceToWorking(r,s)}},t=[.64,.33,.3,.6,.15,.06],e=[.2126,.7152,.0722],n=[.3127,.329];return i.define({[ki]:{primaries:t,whitePoint:n,transfer:oa,toXYZ:nl,fromXYZ:il,luminanceCoefficients:e,workingColorSpaceConfig:{unpackColorSpace:nn},outputColorSpaceConfig:{drawingBufferColorSpace:nn}},[nn]:{primaries:t,whitePoint:n,transfer:he,toXYZ:nl,fromXYZ:il,luminanceCoefficients:e,outputColorSpaceConfig:{drawingBufferColorSpace:nn}}}),i}const se=Ld();function qn(i){return i<.04045?i*.0773993808:Math.pow(i*.9478672986+.0521327014,2.4)}function vr(i){return i<.0031308?i*12.92:1.055*Math.pow(i,.41666)-.055}let Yi;class Pd{static getDataURL(t,e="image/png"){if(/^data:/i.test(t.src)||typeof HTMLCanvasElement>"u")return t.src;let n;if(t instanceof HTMLCanvasElement)n=t;else{Yi===void 0&&(Yi=la("canvas")),Yi.width=t.width,Yi.height=t.height;const r=Yi.getContext("2d");t instanceof ImageData?r.putImageData(t,0,0):r.drawImage(t,0,0,t.width,t.height),n=Yi}return n.toDataURL(e)}static sRGBToLinear(t){if(typeof HTMLImageElement<"u"&&t instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&t instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&t instanceof ImageBitmap){const e=la("canvas");e.width=t.width,e.height=t.height;const n=e.getContext("2d");n.drawImage(t,0,0,t.width,t.height);const r=n.getImageData(0,0,t.width,t.height),s=r.data;for(let a=0;a<s.length;a++)s[a]=qn(s[a]/255)*255;return n.putImageData(r,0,0),e}else if(t.data){const e=t.data.slice(0);for(let n=0;n<e.length;n++)e instanceof Uint8Array||e instanceof Uint8ClampedArray?e[n]=Math.floor(qn(e[n]/255)*255):e[n]=qn(e[n]);return{data:e,width:t.width,height:t.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),t}}let Dd=0;class mc{constructor(t=null){this.isSource=!0,Object.defineProperty(this,"id",{value:Dd++}),this.uuid=gi(),this.data=t,this.dataReady=!0,this.version=0}getSize(t){const e=this.data;return typeof HTMLVideoElement<"u"&&e instanceof HTMLVideoElement?t.set(e.videoWidth,e.videoHeight,0):e instanceof VideoFrame?t.set(e.displayHeight,e.displayWidth,0):e!==null?t.set(e.width,e.height,e.depth||0):t.set(0,0,0),t}set needsUpdate(t){t===!0&&this.version++}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.images[this.uuid]!==void 0)return t.images[this.uuid];const n={uuid:this.uuid,url:""},r=this.data;if(r!==null){let s;if(Array.isArray(r)){s=[];for(let a=0,o=r.length;a<o;a++)r[a].isDataTexture?s.push(ba(r[a].image)):s.push(ba(r[a]))}else s=ba(r);n.url=s}return e||(t.images[this.uuid]=n),n}}function ba(i){return typeof HTMLImageElement<"u"&&i instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&i instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&i instanceof ImageBitmap?Pd.getDataURL(i):i.data?{data:Array.from(i.data),width:i.width,height:i.height,type:i.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}let Id=0;const Ea=new O;class Ne extends Tr{constructor(t=Ne.DEFAULT_IMAGE,e=Ne.DEFAULT_MAPPING,n=Pi,r=Pi,s=He,a=Di,o=rn,c=Dn,l=Ne.DEFAULT_ANISOTROPY,h=Rn){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:Id++}),this.uuid=gi(),this.name="",this.source=new mc(t),this.mipmaps=[],this.mapping=e,this.channel=0,this.wrapS=n,this.wrapT=r,this.magFilter=s,this.minFilter=a,this.anisotropy=l,this.format=o,this.internalFormat=null,this.type=c,this.offset=new St(0,0),this.repeat=new St(1,1),this.center=new St(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new jt,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=h,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(t&&t.depth&&t.depth>1),this.pmremVersion=0}get width(){return this.source.getSize(Ea).x}get height(){return this.source.getSize(Ea).y}get depth(){return this.source.getSize(Ea).z}get image(){return this.source.data}set image(t=null){this.source.data=t}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(t){return this.name=t.name,this.source=t.source,this.mipmaps=t.mipmaps.slice(0),this.mapping=t.mapping,this.channel=t.channel,this.wrapS=t.wrapS,this.wrapT=t.wrapT,this.magFilter=t.magFilter,this.minFilter=t.minFilter,this.anisotropy=t.anisotropy,this.format=t.format,this.internalFormat=t.internalFormat,this.type=t.type,this.offset.copy(t.offset),this.repeat.copy(t.repeat),this.center.copy(t.center),this.rotation=t.rotation,this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrix.copy(t.matrix),this.generateMipmaps=t.generateMipmaps,this.premultiplyAlpha=t.premultiplyAlpha,this.flipY=t.flipY,this.unpackAlignment=t.unpackAlignment,this.colorSpace=t.colorSpace,this.renderTarget=t.renderTarget,this.isRenderTargetTexture=t.isRenderTargetTexture,this.isArrayTexture=t.isArrayTexture,this.userData=JSON.parse(JSON.stringify(t.userData)),this.needsUpdate=!0,this}setValues(t){for(const e in t){const n=t[e];if(n===void 0){console.warn(`THREE.Texture.setValues(): parameter '${e}' has value of undefined.`);continue}const r=this[e];if(r===void 0){console.warn(`THREE.Texture.setValues(): property '${e}' does not exist.`);continue}r&&n&&r.isVector2&&n.isVector2||r&&n&&r.isVector3&&n.isVector3||r&&n&&r.isMatrix3&&n.isMatrix3?r.copy(n):this[e]=n}}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.textures[this.uuid]!==void 0)return t.textures[this.uuid];const n={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(t).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),e||(t.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(t){if(this.mapping!==Fh)return t;if(t.applyMatrix3(this.matrix),t.x<0||t.x>1)switch(this.wrapS){case Kr:t.x=t.x-Math.floor(t.x);break;case Pi:t.x=t.x<0?0:1;break;case yo:Math.abs(Math.floor(t.x)%2)===1?t.x=Math.ceil(t.x)-t.x:t.x=t.x-Math.floor(t.x);break}if(t.y<0||t.y>1)switch(this.wrapT){case Kr:t.y=t.y-Math.floor(t.y);break;case Pi:t.y=t.y<0?0:1;break;case yo:Math.abs(Math.floor(t.y)%2)===1?t.y=Math.ceil(t.y)-t.y:t.y=t.y-Math.floor(t.y);break}return this.flipY&&(t.y=1-t.y),t}set needsUpdate(t){t===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(t){t===!0&&this.pmremVersion++}}Ne.DEFAULT_IMAGE=null;Ne.DEFAULT_MAPPING=Fh;Ne.DEFAULT_ANISOTROPY=1;class me{constructor(t=0,e=0,n=0,r=1){me.prototype.isVector4=!0,this.x=t,this.y=e,this.z=n,this.w=r}get width(){return this.z}set width(t){this.z=t}get height(){return this.w}set height(t){this.w=t}set(t,e,n,r){return this.x=t,this.y=e,this.z=n,this.w=r,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this.w=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setW(t){return this.w=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;case 3:this.w=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this.w=t.w!==void 0?t.w:1,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this.w+=t.w,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this.w+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this.w=t.w+e.w,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this.w+=t.w*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this.w-=t.w,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this.w-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this.w=t.w-e.w,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this.w*=t.w,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this.w*=t,this}applyMatrix4(t){const e=this.x,n=this.y,r=this.z,s=this.w,a=t.elements;return this.x=a[0]*e+a[4]*n+a[8]*r+a[12]*s,this.y=a[1]*e+a[5]*n+a[9]*r+a[13]*s,this.z=a[2]*e+a[6]*n+a[10]*r+a[14]*s,this.w=a[3]*e+a[7]*n+a[11]*r+a[15]*s,this}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this.w/=t.w,this}divideScalar(t){return this.multiplyScalar(1/t)}setAxisAngleFromQuaternion(t){this.w=2*Math.acos(t.w);const e=Math.sqrt(1-t.w*t.w);return e<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=t.x/e,this.y=t.y/e,this.z=t.z/e),this}setAxisAngleFromRotationMatrix(t){let e,n,r,s;const c=t.elements,l=c[0],h=c[4],u=c[8],d=c[1],f=c[5],m=c[9],x=c[2],g=c[6],p=c[10];if(Math.abs(h-d)<.01&&Math.abs(u-x)<.01&&Math.abs(m-g)<.01){if(Math.abs(h+d)<.1&&Math.abs(u+x)<.1&&Math.abs(m+g)<.1&&Math.abs(l+f+p-3)<.1)return this.set(1,0,0,0),this;e=Math.PI;const y=(l+1)/2,M=(f+1)/2,T=(p+1)/2,E=(h+d)/4,A=(u+x)/4,C=(m+g)/4;return y>M&&y>T?y<.01?(n=0,r=.707106781,s=.707106781):(n=Math.sqrt(y),r=E/n,s=A/n):M>T?M<.01?(n=.707106781,r=0,s=.707106781):(r=Math.sqrt(M),n=E/r,s=C/r):T<.01?(n=.707106781,r=.707106781,s=0):(s=Math.sqrt(T),n=A/s,r=C/s),this.set(n,r,s,e),this}let w=Math.sqrt((g-m)*(g-m)+(u-x)*(u-x)+(d-h)*(d-h));return Math.abs(w)<.001&&(w=1),this.x=(g-m)/w,this.y=(u-x)/w,this.z=(d-h)/w,this.w=Math.acos((l+f+p-1)/2),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this.w=e[15],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this.w=Math.min(this.w,t.w),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this.w=Math.max(this.w,t.w),this}clamp(t,e){return this.x=te(this.x,t.x,e.x),this.y=te(this.y,t.y,e.y),this.z=te(this.z,t.z,e.z),this.w=te(this.w,t.w,e.w),this}clampScalar(t,e){return this.x=te(this.x,t,e),this.y=te(this.y,t,e),this.z=te(this.z,t,e),this.w=te(this.w,t,e),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(te(n,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z+this.w*t.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this.w+=(t.w-this.w)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this.w=t.w+(e.w-t.w)*n,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z&&t.w===this.w}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this.w=t[e+3],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t[e+3]=this.w,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this.w=t.getW(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class Ud extends Tr{constructor(t=1,e=1,n={}){super(),n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:He,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1},n),this.isRenderTarget=!0,this.width=t,this.height=e,this.depth=n.depth,this.scissor=new me(0,0,t,e),this.scissorTest=!1,this.viewport=new me(0,0,t,e);const r={width:t,height:e,depth:n.depth},s=new Ne(r);this.textures=[];const a=n.count;for(let o=0;o<a;o++)this.textures[o]=s.clone(),this.textures[o].isRenderTargetTexture=!0,this.textures[o].renderTarget=this;this._setTextureOptions(n),this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this._depthTexture=null,this.depthTexture=n.depthTexture,this.samples=n.samples,this.multiview=n.multiview}_setTextureOptions(t={}){const e={minFilter:He,generateMipmaps:!1,flipY:!1,internalFormat:null};t.mapping!==void 0&&(e.mapping=t.mapping),t.wrapS!==void 0&&(e.wrapS=t.wrapS),t.wrapT!==void 0&&(e.wrapT=t.wrapT),t.wrapR!==void 0&&(e.wrapR=t.wrapR),t.magFilter!==void 0&&(e.magFilter=t.magFilter),t.minFilter!==void 0&&(e.minFilter=t.minFilter),t.format!==void 0&&(e.format=t.format),t.type!==void 0&&(e.type=t.type),t.anisotropy!==void 0&&(e.anisotropy=t.anisotropy),t.colorSpace!==void 0&&(e.colorSpace=t.colorSpace),t.flipY!==void 0&&(e.flipY=t.flipY),t.generateMipmaps!==void 0&&(e.generateMipmaps=t.generateMipmaps),t.internalFormat!==void 0&&(e.internalFormat=t.internalFormat);for(let n=0;n<this.textures.length;n++)this.textures[n].setValues(e)}get texture(){return this.textures[0]}set texture(t){this.textures[0]=t}set depthTexture(t){this._depthTexture!==null&&(this._depthTexture.renderTarget=null),t!==null&&(t.renderTarget=this),this._depthTexture=t}get depthTexture(){return this._depthTexture}setSize(t,e,n=1){if(this.width!==t||this.height!==e||this.depth!==n){this.width=t,this.height=e,this.depth=n;for(let r=0,s=this.textures.length;r<s;r++)this.textures[r].image.width=t,this.textures[r].image.height=e,this.textures[r].image.depth=n,this.textures[r].isArrayTexture=this.textures[r].image.depth>1;this.dispose()}this.viewport.set(0,0,t,e),this.scissor.set(0,0,t,e)}clone(){return new this.constructor().copy(this)}copy(t){this.width=t.width,this.height=t.height,this.depth=t.depth,this.scissor.copy(t.scissor),this.scissorTest=t.scissorTest,this.viewport.copy(t.viewport),this.textures.length=0;for(let e=0,n=t.textures.length;e<n;e++){this.textures[e]=t.textures[e].clone(),this.textures[e].isRenderTargetTexture=!0,this.textures[e].renderTarget=this;const r=Object.assign({},t.textures[e].image);this.textures[e].source=new mc(r)}return this.depthBuffer=t.depthBuffer,this.stencilBuffer=t.stencilBuffer,this.resolveDepthBuffer=t.resolveDepthBuffer,this.resolveStencilBuffer=t.resolveStencilBuffer,t.depthTexture!==null&&(this.depthTexture=t.depthTexture.clone()),this.samples=t.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class zi extends Ud{constructor(t=1,e=1,n={}){super(t,e,n),this.isWebGLRenderTarget=!0}}class $h extends Ne{constructor(t=null,e=1,n=1,r=1){super(null),this.isDataArrayTexture=!0,this.image={data:t,width:e,height:n,depth:r},this.magFilter=sn,this.minFilter=sn,this.wrapR=Pi,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(t){this.layerUpdates.add(t)}clearLayerUpdates(){this.layerUpdates.clear()}}class Nd extends Ne{constructor(t=null,e=1,n=1,r=1){super(null),this.isData3DTexture=!0,this.image={data:t,width:e,height:n,depth:r},this.magFilter=sn,this.minFilter=sn,this.wrapR=Pi,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class Ar{constructor(t=new O(1/0,1/0,1/0),e=new O(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=t,this.max=e}set(t,e){return this.min.copy(t),this.max.copy(e),this}setFromArray(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e+=3)this.expandByPoint(gn.fromArray(t,e));return this}setFromBufferAttribute(t){this.makeEmpty();for(let e=0,n=t.count;e<n;e++)this.expandByPoint(gn.fromBufferAttribute(t,e));return this}setFromPoints(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e++)this.expandByPoint(t[e]);return this}setFromCenterAndSize(t,e){const n=gn.copy(e).multiplyScalar(.5);return this.min.copy(t).sub(n),this.max.copy(t).add(n),this}setFromObject(t,e=!1){return this.makeEmpty(),this.expandByObject(t,e)}clone(){return new this.constructor().copy(this)}copy(t){return this.min.copy(t.min),this.max.copy(t.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(t){return this.isEmpty()?t.set(0,0,0):t.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(t){return this.isEmpty()?t.set(0,0,0):t.subVectors(this.max,this.min)}expandByPoint(t){return this.min.min(t),this.max.max(t),this}expandByVector(t){return this.min.sub(t),this.max.add(t),this}expandByScalar(t){return this.min.addScalar(-t),this.max.addScalar(t),this}expandByObject(t,e=!1){t.updateWorldMatrix(!1,!1);const n=t.geometry;if(n!==void 0){const s=n.getAttribute("position");if(e===!0&&s!==void 0&&t.isInstancedMesh!==!0)for(let a=0,o=s.count;a<o;a++)t.isMesh===!0?t.getVertexPosition(a,gn):gn.fromBufferAttribute(s,a),gn.applyMatrix4(t.matrixWorld),this.expandByPoint(gn);else t.boundingBox!==void 0?(t.boundingBox===null&&t.computeBoundingBox(),xs.copy(t.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),xs.copy(n.boundingBox)),xs.applyMatrix4(t.matrixWorld),this.union(xs)}const r=t.children;for(let s=0,a=r.length;s<a;s++)this.expandByObject(r[s],e);return this}containsPoint(t){return t.x>=this.min.x&&t.x<=this.max.x&&t.y>=this.min.y&&t.y<=this.max.y&&t.z>=this.min.z&&t.z<=this.max.z}containsBox(t){return this.min.x<=t.min.x&&t.max.x<=this.max.x&&this.min.y<=t.min.y&&t.max.y<=this.max.y&&this.min.z<=t.min.z&&t.max.z<=this.max.z}getParameter(t,e){return e.set((t.x-this.min.x)/(this.max.x-this.min.x),(t.y-this.min.y)/(this.max.y-this.min.y),(t.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(t){return t.max.x>=this.min.x&&t.min.x<=this.max.x&&t.max.y>=this.min.y&&t.min.y<=this.max.y&&t.max.z>=this.min.z&&t.min.z<=this.max.z}intersectsSphere(t){return this.clampPoint(t.center,gn),gn.distanceToSquared(t.center)<=t.radius*t.radius}intersectsPlane(t){let e,n;return t.normal.x>0?(e=t.normal.x*this.min.x,n=t.normal.x*this.max.x):(e=t.normal.x*this.max.x,n=t.normal.x*this.min.x),t.normal.y>0?(e+=t.normal.y*this.min.y,n+=t.normal.y*this.max.y):(e+=t.normal.y*this.max.y,n+=t.normal.y*this.min.y),t.normal.z>0?(e+=t.normal.z*this.min.z,n+=t.normal.z*this.max.z):(e+=t.normal.z*this.max.z,n+=t.normal.z*this.min.z),e<=-t.constant&&n>=-t.constant}intersectsTriangle(t){if(this.isEmpty())return!1;this.getCenter(Ur),Ms.subVectors(this.max,Ur),$i.subVectors(t.a,Ur),Zi.subVectors(t.b,Ur),Ji.subVectors(t.c,Ur),jn.subVectors(Zi,$i),Qn.subVectors(Ji,Zi),xi.subVectors($i,Ji);let e=[0,-jn.z,jn.y,0,-Qn.z,Qn.y,0,-xi.z,xi.y,jn.z,0,-jn.x,Qn.z,0,-Qn.x,xi.z,0,-xi.x,-jn.y,jn.x,0,-Qn.y,Qn.x,0,-xi.y,xi.x,0];return!wa(e,$i,Zi,Ji,Ms)||(e=[1,0,0,0,1,0,0,0,1],!wa(e,$i,Zi,Ji,Ms))?!1:(Ss.crossVectors(jn,Qn),e=[Ss.x,Ss.y,Ss.z],wa(e,$i,Zi,Ji,Ms))}clampPoint(t,e){return e.copy(t).clamp(this.min,this.max)}distanceToPoint(t){return this.clampPoint(t,gn).distanceTo(t)}getBoundingSphere(t){return this.isEmpty()?t.makeEmpty():(this.getCenter(t.center),t.radius=this.getSize(gn).length()*.5),t}intersect(t){return this.min.max(t.min),this.max.min(t.max),this.isEmpty()&&this.makeEmpty(),this}union(t){return this.min.min(t.min),this.max.max(t.max),this}applyMatrix4(t){return this.isEmpty()?this:(Fn[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(t),Fn[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(t),Fn[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(t),Fn[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(t),Fn[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(t),Fn[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(t),Fn[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(t),Fn[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(t),this.setFromPoints(Fn),this)}translate(t){return this.min.add(t),this.max.add(t),this}equals(t){return t.min.equals(this.min)&&t.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(t){return this.min.fromArray(t.min),this.max.fromArray(t.max),this}}const Fn=[new O,new O,new O,new O,new O,new O,new O,new O],gn=new O,xs=new Ar,$i=new O,Zi=new O,Ji=new O,jn=new O,Qn=new O,xi=new O,Ur=new O,Ms=new O,Ss=new O,Mi=new O;function wa(i,t,e,n,r){for(let s=0,a=i.length-3;s<=a;s+=3){Mi.fromArray(i,s);const o=r.x*Math.abs(Mi.x)+r.y*Math.abs(Mi.y)+r.z*Math.abs(Mi.z),c=t.dot(Mi),l=e.dot(Mi),h=n.dot(Mi);if(Math.max(-Math.max(c,l,h),Math.min(c,l,h))>o)return!1}return!0}const Fd=new Ar,Nr=new O,Ta=new O;class Rr{constructor(t=new O,e=-1){this.isSphere=!0,this.center=t,this.radius=e}set(t,e){return this.center.copy(t),this.radius=e,this}setFromPoints(t,e){const n=this.center;e!==void 0?n.copy(e):Fd.setFromPoints(t).getCenter(n);let r=0;for(let s=0,a=t.length;s<a;s++)r=Math.max(r,n.distanceToSquared(t[s]));return this.radius=Math.sqrt(r),this}copy(t){return this.center.copy(t.center),this.radius=t.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(t){return t.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(t){return t.distanceTo(this.center)-this.radius}intersectsSphere(t){const e=this.radius+t.radius;return t.center.distanceToSquared(this.center)<=e*e}intersectsBox(t){return t.intersectsSphere(this)}intersectsPlane(t){return Math.abs(t.distanceToPoint(this.center))<=this.radius}clampPoint(t,e){const n=this.center.distanceToSquared(t);return e.copy(t),n>this.radius*this.radius&&(e.sub(this.center).normalize(),e.multiplyScalar(this.radius).add(this.center)),e}getBoundingBox(t){return this.isEmpty()?(t.makeEmpty(),t):(t.set(this.center,this.center),t.expandByScalar(this.radius),t)}applyMatrix4(t){return this.center.applyMatrix4(t),this.radius=this.radius*t.getMaxScaleOnAxis(),this}translate(t){return this.center.add(t),this}expandByPoint(t){if(this.isEmpty())return this.center.copy(t),this.radius=0,this;Nr.subVectors(t,this.center);const e=Nr.lengthSq();if(e>this.radius*this.radius){const n=Math.sqrt(e),r=(n-this.radius)*.5;this.center.addScaledVector(Nr,r/n),this.radius+=r}return this}union(t){return t.isEmpty()?this:this.isEmpty()?(this.copy(t),this):(this.center.equals(t.center)===!0?this.radius=Math.max(this.radius,t.radius):(Ta.subVectors(t.center,this.center).setLength(t.radius),this.expandByPoint(Nr.copy(t.center).add(Ta)),this.expandByPoint(Nr.copy(t.center).sub(Ta))),this)}equals(t){return t.center.equals(this.center)&&t.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(t){return this.radius=t.radius,this.center.fromArray(t.center),this}}const On=new O,Aa=new O,ys=new O,ti=new O,Ra=new O,bs=new O,Ca=new O;class Zh{constructor(t=new O,e=new O(0,0,-1)){this.origin=t,this.direction=e}set(t,e){return this.origin.copy(t),this.direction.copy(e),this}copy(t){return this.origin.copy(t.origin),this.direction.copy(t.direction),this}at(t,e){return e.copy(this.origin).addScaledVector(this.direction,t)}lookAt(t){return this.direction.copy(t).sub(this.origin).normalize(),this}recast(t){return this.origin.copy(this.at(t,On)),this}closestPointToPoint(t,e){e.subVectors(t,this.origin);const n=e.dot(this.direction);return n<0?e.copy(this.origin):e.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(t){return Math.sqrt(this.distanceSqToPoint(t))}distanceSqToPoint(t){const e=On.subVectors(t,this.origin).dot(this.direction);return e<0?this.origin.distanceToSquared(t):(On.copy(this.origin).addScaledVector(this.direction,e),On.distanceToSquared(t))}distanceSqToSegment(t,e,n,r){Aa.copy(t).add(e).multiplyScalar(.5),ys.copy(e).sub(t).normalize(),ti.copy(this.origin).sub(Aa);const s=t.distanceTo(e)*.5,a=-this.direction.dot(ys),o=ti.dot(this.direction),c=-ti.dot(ys),l=ti.lengthSq(),h=Math.abs(1-a*a);let u,d,f,m;if(h>0)if(u=a*c-o,d=a*o-c,m=s*h,u>=0)if(d>=-m)if(d<=m){const x=1/h;u*=x,d*=x,f=u*(u+a*d+2*o)+d*(a*u+d+2*c)+l}else d=s,u=Math.max(0,-(a*d+o)),f=-u*u+d*(d+2*c)+l;else d=-s,u=Math.max(0,-(a*d+o)),f=-u*u+d*(d+2*c)+l;else d<=-m?(u=Math.max(0,-(-a*s+o)),d=u>0?-s:Math.min(Math.max(-s,-c),s),f=-u*u+d*(d+2*c)+l):d<=m?(u=0,d=Math.min(Math.max(-s,-c),s),f=d*(d+2*c)+l):(u=Math.max(0,-(a*s+o)),d=u>0?s:Math.min(Math.max(-s,-c),s),f=-u*u+d*(d+2*c)+l);else d=a>0?-s:s,u=Math.max(0,-(a*d+o)),f=-u*u+d*(d+2*c)+l;return n&&n.copy(this.origin).addScaledVector(this.direction,u),r&&r.copy(Aa).addScaledVector(ys,d),f}intersectSphere(t,e){On.subVectors(t.center,this.origin);const n=On.dot(this.direction),r=On.dot(On)-n*n,s=t.radius*t.radius;if(r>s)return null;const a=Math.sqrt(s-r),o=n-a,c=n+a;return c<0?null:o<0?this.at(c,e):this.at(o,e)}intersectsSphere(t){return t.radius<0?!1:this.distanceSqToPoint(t.center)<=t.radius*t.radius}distanceToPlane(t){const e=t.normal.dot(this.direction);if(e===0)return t.distanceToPoint(this.origin)===0?0:null;const n=-(this.origin.dot(t.normal)+t.constant)/e;return n>=0?n:null}intersectPlane(t,e){const n=this.distanceToPlane(t);return n===null?null:this.at(n,e)}intersectsPlane(t){const e=t.distanceToPoint(this.origin);return e===0||t.normal.dot(this.direction)*e<0}intersectBox(t,e){let n,r,s,a,o,c;const l=1/this.direction.x,h=1/this.direction.y,u=1/this.direction.z,d=this.origin;return l>=0?(n=(t.min.x-d.x)*l,r=(t.max.x-d.x)*l):(n=(t.max.x-d.x)*l,r=(t.min.x-d.x)*l),h>=0?(s=(t.min.y-d.y)*h,a=(t.max.y-d.y)*h):(s=(t.max.y-d.y)*h,a=(t.min.y-d.y)*h),n>a||s>r||((s>n||isNaN(n))&&(n=s),(a<r||isNaN(r))&&(r=a),u>=0?(o=(t.min.z-d.z)*u,c=(t.max.z-d.z)*u):(o=(t.max.z-d.z)*u,c=(t.min.z-d.z)*u),n>c||o>r)||((o>n||n!==n)&&(n=o),(c<r||r!==r)&&(r=c),r<0)?null:this.at(n>=0?n:r,e)}intersectsBox(t){return this.intersectBox(t,On)!==null}intersectTriangle(t,e,n,r,s){Ra.subVectors(e,t),bs.subVectors(n,t),Ca.crossVectors(Ra,bs);let a=this.direction.dot(Ca),o;if(a>0){if(r)return null;o=1}else if(a<0)o=-1,a=-a;else return null;ti.subVectors(this.origin,t);const c=o*this.direction.dot(bs.crossVectors(ti,bs));if(c<0)return null;const l=o*this.direction.dot(Ra.cross(ti));if(l<0||c+l>a)return null;const h=-o*ti.dot(Ca);return h<0?null:this.at(h/a,s)}applyMatrix4(t){return this.origin.applyMatrix4(t),this.direction.transformDirection(t),this}equals(t){return t.origin.equals(this.origin)&&t.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class ie{constructor(t,e,n,r,s,a,o,c,l,h,u,d,f,m,x,g){ie.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],t!==void 0&&this.set(t,e,n,r,s,a,o,c,l,h,u,d,f,m,x,g)}set(t,e,n,r,s,a,o,c,l,h,u,d,f,m,x,g){const p=this.elements;return p[0]=t,p[4]=e,p[8]=n,p[12]=r,p[1]=s,p[5]=a,p[9]=o,p[13]=c,p[2]=l,p[6]=h,p[10]=u,p[14]=d,p[3]=f,p[7]=m,p[11]=x,p[15]=g,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new ie().fromArray(this.elements)}copy(t){const e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],e[9]=n[9],e[10]=n[10],e[11]=n[11],e[12]=n[12],e[13]=n[13],e[14]=n[14],e[15]=n[15],this}copyPosition(t){const e=this.elements,n=t.elements;return e[12]=n[12],e[13]=n[13],e[14]=n[14],this}setFromMatrix3(t){const e=t.elements;return this.set(e[0],e[3],e[6],0,e[1],e[4],e[7],0,e[2],e[5],e[8],0,0,0,0,1),this}extractBasis(t,e,n){return t.setFromMatrixColumn(this,0),e.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this}makeBasis(t,e,n){return this.set(t.x,e.x,n.x,0,t.y,e.y,n.y,0,t.z,e.z,n.z,0,0,0,0,1),this}extractRotation(t){const e=this.elements,n=t.elements,r=1/Ki.setFromMatrixColumn(t,0).length(),s=1/Ki.setFromMatrixColumn(t,1).length(),a=1/Ki.setFromMatrixColumn(t,2).length();return e[0]=n[0]*r,e[1]=n[1]*r,e[2]=n[2]*r,e[3]=0,e[4]=n[4]*s,e[5]=n[5]*s,e[6]=n[6]*s,e[7]=0,e[8]=n[8]*a,e[9]=n[9]*a,e[10]=n[10]*a,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromEuler(t){const e=this.elements,n=t.x,r=t.y,s=t.z,a=Math.cos(n),o=Math.sin(n),c=Math.cos(r),l=Math.sin(r),h=Math.cos(s),u=Math.sin(s);if(t.order==="XYZ"){const d=a*h,f=a*u,m=o*h,x=o*u;e[0]=c*h,e[4]=-c*u,e[8]=l,e[1]=f+m*l,e[5]=d-x*l,e[9]=-o*c,e[2]=x-d*l,e[6]=m+f*l,e[10]=a*c}else if(t.order==="YXZ"){const d=c*h,f=c*u,m=l*h,x=l*u;e[0]=d+x*o,e[4]=m*o-f,e[8]=a*l,e[1]=a*u,e[5]=a*h,e[9]=-o,e[2]=f*o-m,e[6]=x+d*o,e[10]=a*c}else if(t.order==="ZXY"){const d=c*h,f=c*u,m=l*h,x=l*u;e[0]=d-x*o,e[4]=-a*u,e[8]=m+f*o,e[1]=f+m*o,e[5]=a*h,e[9]=x-d*o,e[2]=-a*l,e[6]=o,e[10]=a*c}else if(t.order==="ZYX"){const d=a*h,f=a*u,m=o*h,x=o*u;e[0]=c*h,e[4]=m*l-f,e[8]=d*l+x,e[1]=c*u,e[5]=x*l+d,e[9]=f*l-m,e[2]=-l,e[6]=o*c,e[10]=a*c}else if(t.order==="YZX"){const d=a*c,f=a*l,m=o*c,x=o*l;e[0]=c*h,e[4]=x-d*u,e[8]=m*u+f,e[1]=u,e[5]=a*h,e[9]=-o*h,e[2]=-l*h,e[6]=f*u+m,e[10]=d-x*u}else if(t.order==="XZY"){const d=a*c,f=a*l,m=o*c,x=o*l;e[0]=c*h,e[4]=-u,e[8]=l*h,e[1]=d*u+x,e[5]=a*h,e[9]=f*u-m,e[2]=m*u-f,e[6]=o*h,e[10]=x*u+d}return e[3]=0,e[7]=0,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromQuaternion(t){return this.compose(Od,t,Bd)}lookAt(t,e,n){const r=this.elements;return tn.subVectors(t,e),tn.lengthSq()===0&&(tn.z=1),tn.normalize(),ei.crossVectors(n,tn),ei.lengthSq()===0&&(Math.abs(n.z)===1?tn.x+=1e-4:tn.z+=1e-4,tn.normalize(),ei.crossVectors(n,tn)),ei.normalize(),Es.crossVectors(tn,ei),r[0]=ei.x,r[4]=Es.x,r[8]=tn.x,r[1]=ei.y,r[5]=Es.y,r[9]=tn.y,r[2]=ei.z,r[6]=Es.z,r[10]=tn.z,this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const n=t.elements,r=e.elements,s=this.elements,a=n[0],o=n[4],c=n[8],l=n[12],h=n[1],u=n[5],d=n[9],f=n[13],m=n[2],x=n[6],g=n[10],p=n[14],w=n[3],y=n[7],M=n[11],T=n[15],E=r[0],A=r[4],C=r[8],v=r[12],_=r[1],S=r[5],b=r[9],D=r[13],U=r[2],N=r[6],H=r[10],Z=r[14],V=r[3],rt=r[7],ht=r[11],dt=r[15];return s[0]=a*E+o*_+c*U+l*V,s[4]=a*A+o*S+c*N+l*rt,s[8]=a*C+o*b+c*H+l*ht,s[12]=a*v+o*D+c*Z+l*dt,s[1]=h*E+u*_+d*U+f*V,s[5]=h*A+u*S+d*N+f*rt,s[9]=h*C+u*b+d*H+f*ht,s[13]=h*v+u*D+d*Z+f*dt,s[2]=m*E+x*_+g*U+p*V,s[6]=m*A+x*S+g*N+p*rt,s[10]=m*C+x*b+g*H+p*ht,s[14]=m*v+x*D+g*Z+p*dt,s[3]=w*E+y*_+M*U+T*V,s[7]=w*A+y*S+M*N+T*rt,s[11]=w*C+y*b+M*H+T*ht,s[15]=w*v+y*D+M*Z+T*dt,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[4]*=t,e[8]*=t,e[12]*=t,e[1]*=t,e[5]*=t,e[9]*=t,e[13]*=t,e[2]*=t,e[6]*=t,e[10]*=t,e[14]*=t,e[3]*=t,e[7]*=t,e[11]*=t,e[15]*=t,this}determinant(){const t=this.elements,e=t[0],n=t[4],r=t[8],s=t[12],a=t[1],o=t[5],c=t[9],l=t[13],h=t[2],u=t[6],d=t[10],f=t[14],m=t[3],x=t[7],g=t[11],p=t[15];return m*(+s*c*u-r*l*u-s*o*d+n*l*d+r*o*f-n*c*f)+x*(+e*c*f-e*l*d+s*a*d-r*a*f+r*l*h-s*c*h)+g*(+e*l*u-e*o*f-s*a*u+n*a*f+s*o*h-n*l*h)+p*(-r*o*h-e*c*u+e*o*d+r*a*u-n*a*d+n*c*h)}transpose(){const t=this.elements;let e;return e=t[1],t[1]=t[4],t[4]=e,e=t[2],t[2]=t[8],t[8]=e,e=t[6],t[6]=t[9],t[9]=e,e=t[3],t[3]=t[12],t[12]=e,e=t[7],t[7]=t[13],t[13]=e,e=t[11],t[11]=t[14],t[14]=e,this}setPosition(t,e,n){const r=this.elements;return t.isVector3?(r[12]=t.x,r[13]=t.y,r[14]=t.z):(r[12]=t,r[13]=e,r[14]=n),this}invert(){const t=this.elements,e=t[0],n=t[1],r=t[2],s=t[3],a=t[4],o=t[5],c=t[6],l=t[7],h=t[8],u=t[9],d=t[10],f=t[11],m=t[12],x=t[13],g=t[14],p=t[15],w=u*g*l-x*d*l+x*c*f-o*g*f-u*c*p+o*d*p,y=m*d*l-h*g*l-m*c*f+a*g*f+h*c*p-a*d*p,M=h*x*l-m*u*l+m*o*f-a*x*f-h*o*p+a*u*p,T=m*u*c-h*x*c-m*o*d+a*x*d+h*o*g-a*u*g,E=e*w+n*y+r*M+s*T;if(E===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const A=1/E;return t[0]=w*A,t[1]=(x*d*s-u*g*s-x*r*f+n*g*f+u*r*p-n*d*p)*A,t[2]=(o*g*s-x*c*s+x*r*l-n*g*l-o*r*p+n*c*p)*A,t[3]=(u*c*s-o*d*s-u*r*l+n*d*l+o*r*f-n*c*f)*A,t[4]=y*A,t[5]=(h*g*s-m*d*s+m*r*f-e*g*f-h*r*p+e*d*p)*A,t[6]=(m*c*s-a*g*s-m*r*l+e*g*l+a*r*p-e*c*p)*A,t[7]=(a*d*s-h*c*s+h*r*l-e*d*l-a*r*f+e*c*f)*A,t[8]=M*A,t[9]=(m*u*s-h*x*s-m*n*f+e*x*f+h*n*p-e*u*p)*A,t[10]=(a*x*s-m*o*s+m*n*l-e*x*l-a*n*p+e*o*p)*A,t[11]=(h*o*s-a*u*s-h*n*l+e*u*l+a*n*f-e*o*f)*A,t[12]=T*A,t[13]=(h*x*r-m*u*r+m*n*d-e*x*d-h*n*g+e*u*g)*A,t[14]=(m*o*r-a*x*r-m*n*c+e*x*c+a*n*g-e*o*g)*A,t[15]=(a*u*r-h*o*r+h*n*c-e*u*c-a*n*d+e*o*d)*A,this}scale(t){const e=this.elements,n=t.x,r=t.y,s=t.z;return e[0]*=n,e[4]*=r,e[8]*=s,e[1]*=n,e[5]*=r,e[9]*=s,e[2]*=n,e[6]*=r,e[10]*=s,e[3]*=n,e[7]*=r,e[11]*=s,this}getMaxScaleOnAxis(){const t=this.elements,e=t[0]*t[0]+t[1]*t[1]+t[2]*t[2],n=t[4]*t[4]+t[5]*t[5]+t[6]*t[6],r=t[8]*t[8]+t[9]*t[9]+t[10]*t[10];return Math.sqrt(Math.max(e,n,r))}makeTranslation(t,e,n){return t.isVector3?this.set(1,0,0,t.x,0,1,0,t.y,0,0,1,t.z,0,0,0,1):this.set(1,0,0,t,0,1,0,e,0,0,1,n,0,0,0,1),this}makeRotationX(t){const e=Math.cos(t),n=Math.sin(t);return this.set(1,0,0,0,0,e,-n,0,0,n,e,0,0,0,0,1),this}makeRotationY(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,0,n,0,0,1,0,0,-n,0,e,0,0,0,0,1),this}makeRotationZ(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,0,n,e,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(t,e){const n=Math.cos(e),r=Math.sin(e),s=1-n,a=t.x,o=t.y,c=t.z,l=s*a,h=s*o;return this.set(l*a+n,l*o-r*c,l*c+r*o,0,l*o+r*c,h*o+n,h*c-r*a,0,l*c-r*o,h*c+r*a,s*c*c+n,0,0,0,0,1),this}makeScale(t,e,n){return this.set(t,0,0,0,0,e,0,0,0,0,n,0,0,0,0,1),this}makeShear(t,e,n,r,s,a){return this.set(1,n,s,0,t,1,a,0,e,r,1,0,0,0,0,1),this}compose(t,e,n){const r=this.elements,s=e._x,a=e._y,o=e._z,c=e._w,l=s+s,h=a+a,u=o+o,d=s*l,f=s*h,m=s*u,x=a*h,g=a*u,p=o*u,w=c*l,y=c*h,M=c*u,T=n.x,E=n.y,A=n.z;return r[0]=(1-(x+p))*T,r[1]=(f+M)*T,r[2]=(m-y)*T,r[3]=0,r[4]=(f-M)*E,r[5]=(1-(d+p))*E,r[6]=(g+w)*E,r[7]=0,r[8]=(m+y)*A,r[9]=(g-w)*A,r[10]=(1-(d+x))*A,r[11]=0,r[12]=t.x,r[13]=t.y,r[14]=t.z,r[15]=1,this}decompose(t,e,n){const r=this.elements;let s=Ki.set(r[0],r[1],r[2]).length();const a=Ki.set(r[4],r[5],r[6]).length(),o=Ki.set(r[8],r[9],r[10]).length();this.determinant()<0&&(s=-s),t.x=r[12],t.y=r[13],t.z=r[14],vn.copy(this);const l=1/s,h=1/a,u=1/o;return vn.elements[0]*=l,vn.elements[1]*=l,vn.elements[2]*=l,vn.elements[4]*=h,vn.elements[5]*=h,vn.elements[6]*=h,vn.elements[8]*=u,vn.elements[9]*=u,vn.elements[10]*=u,e.setFromRotationMatrix(vn),n.x=s,n.y=a,n.z=o,this}makePerspective(t,e,n,r,s,a,o=Ln,c=!1){const l=this.elements,h=2*s/(e-t),u=2*s/(n-r),d=(e+t)/(e-t),f=(n+r)/(n-r);let m,x;if(c)m=s/(a-s),x=a*s/(a-s);else if(o===Ln)m=-(a+s)/(a-s),x=-2*a*s/(a-s);else if(o===ca)m=-a/(a-s),x=-a*s/(a-s);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+o);return l[0]=h,l[4]=0,l[8]=d,l[12]=0,l[1]=0,l[5]=u,l[9]=f,l[13]=0,l[2]=0,l[6]=0,l[10]=m,l[14]=x,l[3]=0,l[7]=0,l[11]=-1,l[15]=0,this}makeOrthographic(t,e,n,r,s,a,o=Ln,c=!1){const l=this.elements,h=2/(e-t),u=2/(n-r),d=-(e+t)/(e-t),f=-(n+r)/(n-r);let m,x;if(c)m=1/(a-s),x=a/(a-s);else if(o===Ln)m=-2/(a-s),x=-(a+s)/(a-s);else if(o===ca)m=-1/(a-s),x=-s/(a-s);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+o);return l[0]=h,l[4]=0,l[8]=0,l[12]=d,l[1]=0,l[5]=u,l[9]=0,l[13]=f,l[2]=0,l[6]=0,l[10]=m,l[14]=x,l[3]=0,l[7]=0,l[11]=0,l[15]=1,this}equals(t){const e=this.elements,n=t.elements;for(let r=0;r<16;r++)if(e[r]!==n[r])return!1;return!0}fromArray(t,e=0){for(let n=0;n<16;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){const n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t[e+9]=n[9],t[e+10]=n[10],t[e+11]=n[11],t[e+12]=n[12],t[e+13]=n[13],t[e+14]=n[14],t[e+15]=n[15],t}}const Ki=new O,vn=new ie,Od=new O(0,0,0),Bd=new O(1,1,1),ei=new O,Es=new O,tn=new O,rl=new ie,sl=new ke;class mn{constructor(t=0,e=0,n=0,r=mn.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=e,this._z=n,this._order=r}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get order(){return this._order}set order(t){this._order=t,this._onChangeCallback()}set(t,e,n,r=this._order){return this._x=t,this._y=e,this._z=n,this._order=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(t){return this._x=t._x,this._y=t._y,this._z=t._z,this._order=t._order,this._onChangeCallback(),this}setFromRotationMatrix(t,e=this._order,n=!0){const r=t.elements,s=r[0],a=r[4],o=r[8],c=r[1],l=r[5],h=r[9],u=r[2],d=r[6],f=r[10];switch(e){case"XYZ":this._y=Math.asin(te(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-h,f),this._z=Math.atan2(-a,s)):(this._x=Math.atan2(d,l),this._z=0);break;case"YXZ":this._x=Math.asin(-te(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(o,f),this._z=Math.atan2(c,l)):(this._y=Math.atan2(-u,s),this._z=0);break;case"ZXY":this._x=Math.asin(te(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(-u,f),this._z=Math.atan2(-a,l)):(this._y=0,this._z=Math.atan2(c,s));break;case"ZYX":this._y=Math.asin(-te(u,-1,1)),Math.abs(u)<.9999999?(this._x=Math.atan2(d,f),this._z=Math.atan2(c,s)):(this._x=0,this._z=Math.atan2(-a,l));break;case"YZX":this._z=Math.asin(te(c,-1,1)),Math.abs(c)<.9999999?(this._x=Math.atan2(-h,l),this._y=Math.atan2(-u,s)):(this._x=0,this._y=Math.atan2(o,f));break;case"XZY":this._z=Math.asin(-te(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(d,l),this._y=Math.atan2(o,s)):(this._x=Math.atan2(-h,f),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+e)}return this._order=e,n===!0&&this._onChangeCallback(),this}setFromQuaternion(t,e,n){return rl.makeRotationFromQuaternion(t),this.setFromRotationMatrix(rl,e,n)}setFromVector3(t,e=this._order){return this.set(t.x,t.y,t.z,e)}reorder(t){return sl.setFromEuler(this),this.setFromQuaternion(sl,t)}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._order===this._order}fromArray(t){return this._x=t[0],this._y=t[1],this._z=t[2],t[3]!==void 0&&(this._order=t[3]),this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._order,t}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}mn.DEFAULT_ORDER="XYZ";class Jh{constructor(){this.mask=1}set(t){this.mask=(1<<t|0)>>>0}enable(t){this.mask|=1<<t|0}enableAll(){this.mask=-1}toggle(t){this.mask^=1<<t|0}disable(t){this.mask&=~(1<<t|0)}disableAll(){this.mask=0}test(t){return(this.mask&t.mask)!==0}isEnabled(t){return(this.mask&(1<<t|0))!==0}}let kd=0;const al=new O,ji=new ke,Bn=new ie,ws=new O,Fr=new O,zd=new O,Hd=new ke,ol=new O(1,0,0),cl=new O(0,1,0),ll=new O(0,0,1),hl={type:"added"},Vd={type:"removed"},Qi={type:"childadded",child:null},La={type:"childremoved",child:null};class Pe extends Tr{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:kd++}),this.uuid=gi(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=Pe.DEFAULT_UP.clone();const t=new O,e=new mn,n=new ke,r=new O(1,1,1);function s(){n.setFromEuler(e,!1)}function a(){e.setFromQuaternion(n,void 0,!1)}e._onChange(s),n._onChange(a),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:e},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:r},modelViewMatrix:{value:new ie},normalMatrix:{value:new jt}}),this.matrix=new ie,this.matrixWorld=new ie,this.matrixAutoUpdate=Pe.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=Pe.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new Jh,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(t){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(t),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(t){return this.quaternion.premultiply(t),this}setRotationFromAxisAngle(t,e){this.quaternion.setFromAxisAngle(t,e)}setRotationFromEuler(t){this.quaternion.setFromEuler(t,!0)}setRotationFromMatrix(t){this.quaternion.setFromRotationMatrix(t)}setRotationFromQuaternion(t){this.quaternion.copy(t)}rotateOnAxis(t,e){return ji.setFromAxisAngle(t,e),this.quaternion.multiply(ji),this}rotateOnWorldAxis(t,e){return ji.setFromAxisAngle(t,e),this.quaternion.premultiply(ji),this}rotateX(t){return this.rotateOnAxis(ol,t)}rotateY(t){return this.rotateOnAxis(cl,t)}rotateZ(t){return this.rotateOnAxis(ll,t)}translateOnAxis(t,e){return al.copy(t).applyQuaternion(this.quaternion),this.position.add(al.multiplyScalar(e)),this}translateX(t){return this.translateOnAxis(ol,t)}translateY(t){return this.translateOnAxis(cl,t)}translateZ(t){return this.translateOnAxis(ll,t)}localToWorld(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(this.matrixWorld)}worldToLocal(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(Bn.copy(this.matrixWorld).invert())}lookAt(t,e,n){t.isVector3?ws.copy(t):ws.set(t,e,n);const r=this.parent;this.updateWorldMatrix(!0,!1),Fr.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Bn.lookAt(Fr,ws,this.up):Bn.lookAt(ws,Fr,this.up),this.quaternion.setFromRotationMatrix(Bn),r&&(Bn.extractRotation(r.matrixWorld),ji.setFromRotationMatrix(Bn),this.quaternion.premultiply(ji.invert()))}add(t){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.add(arguments[e]);return this}return t===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",t),this):(t&&t.isObject3D?(t.removeFromParent(),t.parent=this,this.children.push(t),t.dispatchEvent(hl),Qi.child=t,this.dispatchEvent(Qi),Qi.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",t),this)}remove(t){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}const e=this.children.indexOf(t);return e!==-1&&(t.parent=null,this.children.splice(e,1),t.dispatchEvent(Vd),La.child=t,this.dispatchEvent(La),La.child=null),this}removeFromParent(){const t=this.parent;return t!==null&&t.remove(this),this}clear(){return this.remove(...this.children)}attach(t){return this.updateWorldMatrix(!0,!1),Bn.copy(this.matrixWorld).invert(),t.parent!==null&&(t.parent.updateWorldMatrix(!0,!1),Bn.multiply(t.parent.matrixWorld)),t.applyMatrix4(Bn),t.removeFromParent(),t.parent=this,this.children.push(t),t.updateWorldMatrix(!1,!0),t.dispatchEvent(hl),Qi.child=t,this.dispatchEvent(Qi),Qi.child=null,this}getObjectById(t){return this.getObjectByProperty("id",t)}getObjectByName(t){return this.getObjectByProperty("name",t)}getObjectByProperty(t,e){if(this[t]===e)return this;for(let n=0,r=this.children.length;n<r;n++){const a=this.children[n].getObjectByProperty(t,e);if(a!==void 0)return a}}getObjectsByProperty(t,e,n=[]){this[t]===e&&n.push(this);const r=this.children;for(let s=0,a=r.length;s<a;s++)r[s].getObjectsByProperty(t,e,n);return n}getWorldPosition(t){return this.updateWorldMatrix(!0,!1),t.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Fr,t,zd),t}getWorldScale(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Fr,Hd,t),t}getWorldDirection(t){this.updateWorldMatrix(!0,!1);const e=this.matrixWorld.elements;return t.set(e[8],e[9],e[10]).normalize()}raycast(){}traverse(t){t(this);const e=this.children;for(let n=0,r=e.length;n<r;n++)e[n].traverse(t)}traverseVisible(t){if(this.visible===!1)return;t(this);const e=this.children;for(let n=0,r=e.length;n<r;n++)e[n].traverseVisible(t)}traverseAncestors(t){const e=this.parent;e!==null&&(t(e),e.traverseAncestors(t))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(t){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||t)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,t=!0);const e=this.children;for(let n=0,r=e.length;n<r;n++)e[n].updateMatrixWorld(t)}updateWorldMatrix(t,e){const n=this.parent;if(t===!0&&n!==null&&n.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),e===!0){const r=this.children;for(let s=0,a=r.length;s<a;s++)r[s].updateWorldMatrix(!1,!0)}}toJSON(t){const e=t===void 0||typeof t=="string",n={};e&&(t={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});const r={};r.uuid=this.uuid,r.type=this.type,this.name!==""&&(r.name=this.name),this.castShadow===!0&&(r.castShadow=!0),this.receiveShadow===!0&&(r.receiveShadow=!0),this.visible===!1&&(r.visible=!1),this.frustumCulled===!1&&(r.frustumCulled=!1),this.renderOrder!==0&&(r.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(r.userData=this.userData),r.layers=this.layers.mask,r.matrix=this.matrix.toArray(),r.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(r.matrixAutoUpdate=!1),this.isInstancedMesh&&(r.type="InstancedMesh",r.count=this.count,r.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(r.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(r.type="BatchedMesh",r.perObjectFrustumCulled=this.perObjectFrustumCulled,r.sortObjects=this.sortObjects,r.drawRanges=this._drawRanges,r.reservedRanges=this._reservedRanges,r.geometryInfo=this._geometryInfo.map(o=>({...o,boundingBox:o.boundingBox?o.boundingBox.toJSON():void 0,boundingSphere:o.boundingSphere?o.boundingSphere.toJSON():void 0})),r.instanceInfo=this._instanceInfo.map(o=>({...o})),r.availableInstanceIds=this._availableInstanceIds.slice(),r.availableGeometryIds=this._availableGeometryIds.slice(),r.nextIndexStart=this._nextIndexStart,r.nextVertexStart=this._nextVertexStart,r.geometryCount=this._geometryCount,r.maxInstanceCount=this._maxInstanceCount,r.maxVertexCount=this._maxVertexCount,r.maxIndexCount=this._maxIndexCount,r.geometryInitialized=this._geometryInitialized,r.matricesTexture=this._matricesTexture.toJSON(t),r.indirectTexture=this._indirectTexture.toJSON(t),this._colorsTexture!==null&&(r.colorsTexture=this._colorsTexture.toJSON(t)),this.boundingSphere!==null&&(r.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(r.boundingBox=this.boundingBox.toJSON()));function s(o,c){return o[c.uuid]===void 0&&(o[c.uuid]=c.toJSON(t)),c.uuid}if(this.isScene)this.background&&(this.background.isColor?r.background=this.background.toJSON():this.background.isTexture&&(r.background=this.background.toJSON(t).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(r.environment=this.environment.toJSON(t).uuid);else if(this.isMesh||this.isLine||this.isPoints){r.geometry=s(t.geometries,this.geometry);const o=this.geometry.parameters;if(o!==void 0&&o.shapes!==void 0){const c=o.shapes;if(Array.isArray(c))for(let l=0,h=c.length;l<h;l++){const u=c[l];s(t.shapes,u)}else s(t.shapes,c)}}if(this.isSkinnedMesh&&(r.bindMode=this.bindMode,r.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(s(t.skeletons,this.skeleton),r.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const o=[];for(let c=0,l=this.material.length;c<l;c++)o.push(s(t.materials,this.material[c]));r.material=o}else r.material=s(t.materials,this.material);if(this.children.length>0){r.children=[];for(let o=0;o<this.children.length;o++)r.children.push(this.children[o].toJSON(t).object)}if(this.animations.length>0){r.animations=[];for(let o=0;o<this.animations.length;o++){const c=this.animations[o];r.animations.push(s(t.animations,c))}}if(e){const o=a(t.geometries),c=a(t.materials),l=a(t.textures),h=a(t.images),u=a(t.shapes),d=a(t.skeletons),f=a(t.animations),m=a(t.nodes);o.length>0&&(n.geometries=o),c.length>0&&(n.materials=c),l.length>0&&(n.textures=l),h.length>0&&(n.images=h),u.length>0&&(n.shapes=u),d.length>0&&(n.skeletons=d),f.length>0&&(n.animations=f),m.length>0&&(n.nodes=m)}return n.object=r,n;function a(o){const c=[];for(const l in o){const h=o[l];delete h.metadata,c.push(h)}return c}}clone(t){return new this.constructor().copy(this,t)}copy(t,e=!0){if(this.name=t.name,this.up.copy(t.up),this.position.copy(t.position),this.rotation.order=t.rotation.order,this.quaternion.copy(t.quaternion),this.scale.copy(t.scale),this.matrix.copy(t.matrix),this.matrixWorld.copy(t.matrixWorld),this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrixWorldAutoUpdate=t.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=t.matrixWorldNeedsUpdate,this.layers.mask=t.layers.mask,this.visible=t.visible,this.castShadow=t.castShadow,this.receiveShadow=t.receiveShadow,this.frustumCulled=t.frustumCulled,this.renderOrder=t.renderOrder,this.animations=t.animations.slice(),this.userData=JSON.parse(JSON.stringify(t.userData)),e===!0)for(let n=0;n<t.children.length;n++){const r=t.children[n];this.add(r.clone())}return this}}Pe.DEFAULT_UP=new O(0,1,0);Pe.DEFAULT_MATRIX_AUTO_UPDATE=!0;Pe.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const _n=new O,kn=new O,Pa=new O,zn=new O,tr=new O,er=new O,ul=new O,Da=new O,Ia=new O,Ua=new O,Na=new me,Fa=new me,Oa=new me;class yn{constructor(t=new O,e=new O,n=new O){this.a=t,this.b=e,this.c=n}static getNormal(t,e,n,r){r.subVectors(n,e),_n.subVectors(t,e),r.cross(_n);const s=r.lengthSq();return s>0?r.multiplyScalar(1/Math.sqrt(s)):r.set(0,0,0)}static getBarycoord(t,e,n,r,s){_n.subVectors(r,e),kn.subVectors(n,e),Pa.subVectors(t,e);const a=_n.dot(_n),o=_n.dot(kn),c=_n.dot(Pa),l=kn.dot(kn),h=kn.dot(Pa),u=a*l-o*o;if(u===0)return s.set(0,0,0),null;const d=1/u,f=(l*c-o*h)*d,m=(a*h-o*c)*d;return s.set(1-f-m,m,f)}static containsPoint(t,e,n,r){return this.getBarycoord(t,e,n,r,zn)===null?!1:zn.x>=0&&zn.y>=0&&zn.x+zn.y<=1}static getInterpolation(t,e,n,r,s,a,o,c){return this.getBarycoord(t,e,n,r,zn)===null?(c.x=0,c.y=0,"z"in c&&(c.z=0),"w"in c&&(c.w=0),null):(c.setScalar(0),c.addScaledVector(s,zn.x),c.addScaledVector(a,zn.y),c.addScaledVector(o,zn.z),c)}static getInterpolatedAttribute(t,e,n,r,s,a){return Na.setScalar(0),Fa.setScalar(0),Oa.setScalar(0),Na.fromBufferAttribute(t,e),Fa.fromBufferAttribute(t,n),Oa.fromBufferAttribute(t,r),a.setScalar(0),a.addScaledVector(Na,s.x),a.addScaledVector(Fa,s.y),a.addScaledVector(Oa,s.z),a}static isFrontFacing(t,e,n,r){return _n.subVectors(n,e),kn.subVectors(t,e),_n.cross(kn).dot(r)<0}set(t,e,n){return this.a.copy(t),this.b.copy(e),this.c.copy(n),this}setFromPointsAndIndices(t,e,n,r){return this.a.copy(t[e]),this.b.copy(t[n]),this.c.copy(t[r]),this}setFromAttributeAndIndices(t,e,n,r){return this.a.fromBufferAttribute(t,e),this.b.fromBufferAttribute(t,n),this.c.fromBufferAttribute(t,r),this}clone(){return new this.constructor().copy(this)}copy(t){return this.a.copy(t.a),this.b.copy(t.b),this.c.copy(t.c),this}getArea(){return _n.subVectors(this.c,this.b),kn.subVectors(this.a,this.b),_n.cross(kn).length()*.5}getMidpoint(t){return t.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(t){return yn.getNormal(this.a,this.b,this.c,t)}getPlane(t){return t.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,e){return yn.getBarycoord(t,this.a,this.b,this.c,e)}getInterpolation(t,e,n,r,s){return yn.getInterpolation(t,this.a,this.b,this.c,e,n,r,s)}containsPoint(t){return yn.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return yn.isFrontFacing(this.a,this.b,this.c,t)}intersectsBox(t){return t.intersectsTriangle(this)}closestPointToPoint(t,e){const n=this.a,r=this.b,s=this.c;let a,o;tr.subVectors(r,n),er.subVectors(s,n),Da.subVectors(t,n);const c=tr.dot(Da),l=er.dot(Da);if(c<=0&&l<=0)return e.copy(n);Ia.subVectors(t,r);const h=tr.dot(Ia),u=er.dot(Ia);if(h>=0&&u<=h)return e.copy(r);const d=c*u-h*l;if(d<=0&&c>=0&&h<=0)return a=c/(c-h),e.copy(n).addScaledVector(tr,a);Ua.subVectors(t,s);const f=tr.dot(Ua),m=er.dot(Ua);if(m>=0&&f<=m)return e.copy(s);const x=f*l-c*m;if(x<=0&&l>=0&&m<=0)return o=l/(l-m),e.copy(n).addScaledVector(er,o);const g=h*m-f*u;if(g<=0&&u-h>=0&&f-m>=0)return ul.subVectors(s,r),o=(u-h)/(u-h+(f-m)),e.copy(r).addScaledVector(ul,o);const p=1/(g+x+d);return a=x*p,o=d*p,e.copy(n).addScaledVector(tr,a).addScaledVector(er,o)}equals(t){return t.a.equals(this.a)&&t.b.equals(this.b)&&t.c.equals(this.c)}}const Kh={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},ni={h:0,s:0,l:0},Ts={h:0,s:0,l:0};function Ba(i,t,e){return e<0&&(e+=1),e>1&&(e-=1),e<1/6?i+(t-i)*6*e:e<1/2?t:e<2/3?i+(t-i)*6*(2/3-e):i}class Gt{constructor(t,e,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(t,e,n)}set(t,e,n){if(e===void 0&&n===void 0){const r=t;r&&r.isColor?this.copy(r):typeof r=="number"?this.setHex(r):typeof r=="string"&&this.setStyle(r)}else this.setRGB(t,e,n);return this}setScalar(t){return this.r=t,this.g=t,this.b=t,this}setHex(t,e=nn){return t=Math.floor(t),this.r=(t>>16&255)/255,this.g=(t>>8&255)/255,this.b=(t&255)/255,se.colorSpaceToWorking(this,e),this}setRGB(t,e,n,r=se.workingColorSpace){return this.r=t,this.g=e,this.b=n,se.colorSpaceToWorking(this,r),this}setHSL(t,e,n,r=se.workingColorSpace){if(t=pc(t,1),e=te(e,0,1),n=te(n,0,1),e===0)this.r=this.g=this.b=n;else{const s=n<=.5?n*(1+e):n+e-n*e,a=2*n-s;this.r=Ba(a,s,t+1/3),this.g=Ba(a,s,t),this.b=Ba(a,s,t-1/3)}return se.colorSpaceToWorking(this,r),this}setStyle(t,e=nn){function n(s){s!==void 0&&parseFloat(s)<1&&console.warn("THREE.Color: Alpha component of "+t+" will be ignored.")}let r;if(r=/^(\w+)\(([^\)]*)\)/.exec(t)){let s;const a=r[1],o=r[2];switch(a){case"rgb":case"rgba":if(s=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(s[4]),this.setRGB(Math.min(255,parseInt(s[1],10))/255,Math.min(255,parseInt(s[2],10))/255,Math.min(255,parseInt(s[3],10))/255,e);if(s=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(s[4]),this.setRGB(Math.min(100,parseInt(s[1],10))/100,Math.min(100,parseInt(s[2],10))/100,Math.min(100,parseInt(s[3],10))/100,e);break;case"hsl":case"hsla":if(s=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(s[4]),this.setHSL(parseFloat(s[1])/360,parseFloat(s[2])/100,parseFloat(s[3])/100,e);break;default:console.warn("THREE.Color: Unknown color model "+t)}}else if(r=/^\#([A-Fa-f\d]+)$/.exec(t)){const s=r[1],a=s.length;if(a===3)return this.setRGB(parseInt(s.charAt(0),16)/15,parseInt(s.charAt(1),16)/15,parseInt(s.charAt(2),16)/15,e);if(a===6)return this.setHex(parseInt(s,16),e);console.warn("THREE.Color: Invalid hex color "+t)}else if(t&&t.length>0)return this.setColorName(t,e);return this}setColorName(t,e=nn){const n=Kh[t.toLowerCase()];return n!==void 0?this.setHex(n,e):console.warn("THREE.Color: Unknown color "+t),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(t){return this.r=t.r,this.g=t.g,this.b=t.b,this}copySRGBToLinear(t){return this.r=qn(t.r),this.g=qn(t.g),this.b=qn(t.b),this}copyLinearToSRGB(t){return this.r=vr(t.r),this.g=vr(t.g),this.b=vr(t.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(t=nn){return se.workingToColorSpace(Be.copy(this),t),Math.round(te(Be.r*255,0,255))*65536+Math.round(te(Be.g*255,0,255))*256+Math.round(te(Be.b*255,0,255))}getHexString(t=nn){return("000000"+this.getHex(t).toString(16)).slice(-6)}getHSL(t,e=se.workingColorSpace){se.workingToColorSpace(Be.copy(this),e);const n=Be.r,r=Be.g,s=Be.b,a=Math.max(n,r,s),o=Math.min(n,r,s);let c,l;const h=(o+a)/2;if(o===a)c=0,l=0;else{const u=a-o;switch(l=h<=.5?u/(a+o):u/(2-a-o),a){case n:c=(r-s)/u+(r<s?6:0);break;case r:c=(s-n)/u+2;break;case s:c=(n-r)/u+4;break}c/=6}return t.h=c,t.s=l,t.l=h,t}getRGB(t,e=se.workingColorSpace){return se.workingToColorSpace(Be.copy(this),e),t.r=Be.r,t.g=Be.g,t.b=Be.b,t}getStyle(t=nn){se.workingToColorSpace(Be.copy(this),t);const e=Be.r,n=Be.g,r=Be.b;return t!==nn?`color(${t} ${e.toFixed(3)} ${n.toFixed(3)} ${r.toFixed(3)})`:`rgb(${Math.round(e*255)},${Math.round(n*255)},${Math.round(r*255)})`}offsetHSL(t,e,n){return this.getHSL(ni),this.setHSL(ni.h+t,ni.s+e,ni.l+n)}add(t){return this.r+=t.r,this.g+=t.g,this.b+=t.b,this}addColors(t,e){return this.r=t.r+e.r,this.g=t.g+e.g,this.b=t.b+e.b,this}addScalar(t){return this.r+=t,this.g+=t,this.b+=t,this}sub(t){return this.r=Math.max(0,this.r-t.r),this.g=Math.max(0,this.g-t.g),this.b=Math.max(0,this.b-t.b),this}multiply(t){return this.r*=t.r,this.g*=t.g,this.b*=t.b,this}multiplyScalar(t){return this.r*=t,this.g*=t,this.b*=t,this}lerp(t,e){return this.r+=(t.r-this.r)*e,this.g+=(t.g-this.g)*e,this.b+=(t.b-this.b)*e,this}lerpColors(t,e,n){return this.r=t.r+(e.r-t.r)*n,this.g=t.g+(e.g-t.g)*n,this.b=t.b+(e.b-t.b)*n,this}lerpHSL(t,e){this.getHSL(ni),t.getHSL(Ts);const n=Yr(ni.h,Ts.h,e),r=Yr(ni.s,Ts.s,e),s=Yr(ni.l,Ts.l,e);return this.setHSL(n,r,s),this}setFromVector3(t){return this.r=t.x,this.g=t.y,this.b=t.z,this}applyMatrix3(t){const e=this.r,n=this.g,r=this.b,s=t.elements;return this.r=s[0]*e+s[3]*n+s[6]*r,this.g=s[1]*e+s[4]*n+s[7]*r,this.b=s[2]*e+s[5]*n+s[8]*r,this}equals(t){return t.r===this.r&&t.g===this.g&&t.b===this.b}fromArray(t,e=0){return this.r=t[e],this.g=t[e+1],this.b=t[e+2],this}toArray(t=[],e=0){return t[e]=this.r,t[e+1]=this.g,t[e+2]=this.b,t}fromBufferAttribute(t,e){return this.r=t.getX(e),this.g=t.getY(e),this.b=t.getZ(e),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const Be=new Gt;Gt.NAMES=Kh;let Gd=0;class hs extends Tr{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:Gd++}),this.uuid=gi(),this.name="",this.type="Material",this.blending=gr,this.side=pi,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=uo,this.blendDst=fo,this.blendEquation=Ai,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Gt(0,0,0),this.blendAlpha=0,this.depthFunc=xr,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=Jc,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=qi,this.stencilZFail=qi,this.stencilZPass=qi,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(t){this._alphaTest>0!=t>0&&this.version++,this._alphaTest=t}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(t){if(t!==void 0)for(const e in t){const n=t[e];if(n===void 0){console.warn(`THREE.Material: parameter '${e}' has value of undefined.`);continue}const r=this[e];if(r===void 0){console.warn(`THREE.Material: '${e}' is not a property of THREE.${this.type}.`);continue}r&&r.isColor?r.set(n):r&&r.isVector3&&n&&n.isVector3?r.copy(n):this[e]=n}}toJSON(t){const e=t===void 0||typeof t=="string";e&&(t={textures:{},images:{}});const n={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(t).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(t).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(t).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(n.sheenColorMap=this.sheenColorMap.toJSON(t).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(n.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(t).uuid),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(t).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(t).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(t).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(t).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(t).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(t).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(t).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(t).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(t).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(t).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(t).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(t).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(t).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(t).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(t).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(t).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(t).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(t).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(t).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(t).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(t).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==gr&&(n.blending=this.blending),this.side!==pi&&(n.side=this.side),this.vertexColors===!0&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=!0),this.blendSrc!==uo&&(n.blendSrc=this.blendSrc),this.blendDst!==fo&&(n.blendDst=this.blendDst),this.blendEquation!==Ai&&(n.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(n.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(n.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(n.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(n.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(n.blendAlpha=this.blendAlpha),this.depthFunc!==xr&&(n.depthFunc=this.depthFunc),this.depthTest===!1&&(n.depthTest=this.depthTest),this.depthWrite===!1&&(n.depthWrite=this.depthWrite),this.colorWrite===!1&&(n.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(n.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==Jc&&(n.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(n.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(n.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==qi&&(n.stencilFail=this.stencilFail),this.stencilZFail!==qi&&(n.stencilZFail=this.stencilZFail),this.stencilZPass!==qi&&(n.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(n.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=!0),this.alphaToCoverage===!0&&(n.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=!0),this.forceSinglePass===!0&&(n.forceSinglePass=!0),this.wireframe===!0&&(n.wireframe=!0),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=!0),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData);function r(s){const a=[];for(const o in s){const c=s[o];delete c.metadata,a.push(c)}return a}if(e){const s=r(t.textures),a=r(t.images);s.length>0&&(n.textures=s),a.length>0&&(n.images=a)}return n}clone(){return new this.constructor().copy(this)}copy(t){this.name=t.name,this.blending=t.blending,this.side=t.side,this.vertexColors=t.vertexColors,this.opacity=t.opacity,this.transparent=t.transparent,this.blendSrc=t.blendSrc,this.blendDst=t.blendDst,this.blendEquation=t.blendEquation,this.blendSrcAlpha=t.blendSrcAlpha,this.blendDstAlpha=t.blendDstAlpha,this.blendEquationAlpha=t.blendEquationAlpha,this.blendColor.copy(t.blendColor),this.blendAlpha=t.blendAlpha,this.depthFunc=t.depthFunc,this.depthTest=t.depthTest,this.depthWrite=t.depthWrite,this.stencilWriteMask=t.stencilWriteMask,this.stencilFunc=t.stencilFunc,this.stencilRef=t.stencilRef,this.stencilFuncMask=t.stencilFuncMask,this.stencilFail=t.stencilFail,this.stencilZFail=t.stencilZFail,this.stencilZPass=t.stencilZPass,this.stencilWrite=t.stencilWrite;const e=t.clippingPlanes;let n=null;if(e!==null){const r=e.length;n=new Array(r);for(let s=0;s!==r;++s)n[s]=e[s].clone()}return this.clippingPlanes=n,this.clipIntersection=t.clipIntersection,this.clipShadows=t.clipShadows,this.shadowSide=t.shadowSide,this.colorWrite=t.colorWrite,this.precision=t.precision,this.polygonOffset=t.polygonOffset,this.polygonOffsetFactor=t.polygonOffsetFactor,this.polygonOffsetUnits=t.polygonOffsetUnits,this.dithering=t.dithering,this.alphaTest=t.alphaTest,this.alphaHash=t.alphaHash,this.alphaToCoverage=t.alphaToCoverage,this.premultipliedAlpha=t.premultipliedAlpha,this.forceSinglePass=t.forceSinglePass,this.visible=t.visible,this.toneMapped=t.toneMapped,this.userData=JSON.parse(JSON.stringify(t.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(t){t===!0&&this.version++}}class pa extends hs{constructor(t){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new Gt(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new mn,this.combine=Uh,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.fog=t.fog,this}}const Wn=Wd();function Wd(){const i=new ArrayBuffer(4),t=new Float32Array(i),e=new Uint32Array(i),n=new Uint32Array(512),r=new Uint32Array(512);for(let c=0;c<256;++c){const l=c-127;l<-27?(n[c]=0,n[c|256]=32768,r[c]=24,r[c|256]=24):l<-14?(n[c]=1024>>-l-14,n[c|256]=1024>>-l-14|32768,r[c]=-l-1,r[c|256]=-l-1):l<=15?(n[c]=l+15<<10,n[c|256]=l+15<<10|32768,r[c]=13,r[c|256]=13):l<128?(n[c]=31744,n[c|256]=64512,r[c]=24,r[c|256]=24):(n[c]=31744,n[c|256]=64512,r[c]=13,r[c|256]=13)}const s=new Uint32Array(2048),a=new Uint32Array(64),o=new Uint32Array(64);for(let c=1;c<1024;++c){let l=c<<13,h=0;for(;(l&8388608)===0;)l<<=1,h-=8388608;l&=-8388609,h+=947912704,s[c]=l|h}for(let c=1024;c<2048;++c)s[c]=939524096+(c-1024<<13);for(let c=1;c<31;++c)a[c]=c<<23;a[31]=1199570944,a[32]=2147483648;for(let c=33;c<63;++c)a[c]=2147483648+(c-32<<23);a[63]=3347054592;for(let c=1;c<64;++c)c!==32&&(o[c]=1024);return{floatView:t,uint32View:e,baseTable:n,shiftTable:r,mantissaTable:s,exponentTable:a,offsetTable:o}}function Xd(i){Math.abs(i)>65504&&console.warn("THREE.DataUtils.toHalfFloat(): Value out of range."),i=te(i,-65504,65504),Wn.floatView[0]=i;const t=Wn.uint32View[0],e=t>>23&511;return Wn.baseTable[e]+((t&8388607)>>Wn.shiftTable[e])}function qd(i){const t=i>>10;return Wn.uint32View[0]=Wn.mantissaTable[Wn.offsetTable[t]+(i&1023)]+Wn.exponentTable[t],Wn.floatView[0]}class As{static toHalfFloat(t){return Xd(t)}static fromHalfFloat(t){return qd(t)}}const be=new O,Rs=new St;let Yd=0;class oe{constructor(t,e,n=!1){if(Array.isArray(t))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:Yd++}),this.name="",this.array=t,this.itemSize=e,this.count=t!==void 0?t.length/e:0,this.normalized=n,this.usage=Kc,this.updateRanges=[],this.gpuType=Cn,this.version=0}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.name=t.name,this.array=new t.array.constructor(t.array),this.itemSize=t.itemSize,this.count=t.count,this.normalized=t.normalized,this.usage=t.usage,this.gpuType=t.gpuType,this}copyAt(t,e,n){t*=this.itemSize,n*=e.itemSize;for(let r=0,s=this.itemSize;r<s;r++)this.array[t+r]=e.array[n+r];return this}copyArray(t){return this.array.set(t),this}applyMatrix3(t){if(this.itemSize===2)for(let e=0,n=this.count;e<n;e++)Rs.fromBufferAttribute(this,e),Rs.applyMatrix3(t),this.setXY(e,Rs.x,Rs.y);else if(this.itemSize===3)for(let e=0,n=this.count;e<n;e++)be.fromBufferAttribute(this,e),be.applyMatrix3(t),this.setXYZ(e,be.x,be.y,be.z);return this}applyMatrix4(t){for(let e=0,n=this.count;e<n;e++)be.fromBufferAttribute(this,e),be.applyMatrix4(t),this.setXYZ(e,be.x,be.y,be.z);return this}applyNormalMatrix(t){for(let e=0,n=this.count;e<n;e++)be.fromBufferAttribute(this,e),be.applyNormalMatrix(t),this.setXYZ(e,be.x,be.y,be.z);return this}transformDirection(t){for(let e=0,n=this.count;e<n;e++)be.fromBufferAttribute(this,e),be.transformDirection(t),this.setXYZ(e,be.x,be.y,be.z);return this}set(t,e=0){return this.array.set(t,e),this}getComponent(t,e){let n=this.array[t*this.itemSize+e];return this.normalized&&(n=hr(n,this.array)),n}setComponent(t,e,n){return this.normalized&&(n=Ge(n,this.array)),this.array[t*this.itemSize+e]=n,this}getX(t){let e=this.array[t*this.itemSize];return this.normalized&&(e=hr(e,this.array)),e}setX(t,e){return this.normalized&&(e=Ge(e,this.array)),this.array[t*this.itemSize]=e,this}getY(t){let e=this.array[t*this.itemSize+1];return this.normalized&&(e=hr(e,this.array)),e}setY(t,e){return this.normalized&&(e=Ge(e,this.array)),this.array[t*this.itemSize+1]=e,this}getZ(t){let e=this.array[t*this.itemSize+2];return this.normalized&&(e=hr(e,this.array)),e}setZ(t,e){return this.normalized&&(e=Ge(e,this.array)),this.array[t*this.itemSize+2]=e,this}getW(t){let e=this.array[t*this.itemSize+3];return this.normalized&&(e=hr(e,this.array)),e}setW(t,e){return this.normalized&&(e=Ge(e,this.array)),this.array[t*this.itemSize+3]=e,this}setXY(t,e,n){return t*=this.itemSize,this.normalized&&(e=Ge(e,this.array),n=Ge(n,this.array)),this.array[t+0]=e,this.array[t+1]=n,this}setXYZ(t,e,n,r){return t*=this.itemSize,this.normalized&&(e=Ge(e,this.array),n=Ge(n,this.array),r=Ge(r,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=r,this}setXYZW(t,e,n,r,s){return t*=this.itemSize,this.normalized&&(e=Ge(e,this.array),n=Ge(n,this.array),r=Ge(r,this.array),s=Ge(s,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=r,this.array[t+3]=s,this}onUpload(t){return this.onUploadCallback=t,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const t={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(t.name=this.name),this.usage!==Kc&&(t.usage=this.usage),t}}class jh extends oe{constructor(t,e,n){super(new Uint16Array(t),e,n)}}class Qh extends oe{constructor(t,e,n){super(new Uint32Array(t),e,n)}}class fe extends oe{constructor(t,e,n){super(new Float32Array(t),e,n)}}let $d=0;const ln=new ie,ka=new Pe,nr=new O,en=new Ar,Or=new Ar,Re=new O;class De extends Tr{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:$d++}),this.uuid=gi(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(t){return Array.isArray(t)?this.index=new(Yh(t)?Qh:jh)(t,1):this.index=t,this}setIndirect(t){return this.indirect=t,this}getIndirect(){return this.indirect}getAttribute(t){return this.attributes[t]}setAttribute(t,e){return this.attributes[t]=e,this}deleteAttribute(t){return delete this.attributes[t],this}hasAttribute(t){return this.attributes[t]!==void 0}addGroup(t,e,n=0){this.groups.push({start:t,count:e,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(t,e){this.drawRange.start=t,this.drawRange.count=e}applyMatrix4(t){const e=this.attributes.position;e!==void 0&&(e.applyMatrix4(t),e.needsUpdate=!0);const n=this.attributes.normal;if(n!==void 0){const s=new jt().getNormalMatrix(t);n.applyNormalMatrix(s),n.needsUpdate=!0}const r=this.attributes.tangent;return r!==void 0&&(r.transformDirection(t),r.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(t){return ln.makeRotationFromQuaternion(t),this.applyMatrix4(ln),this}rotateX(t){return ln.makeRotationX(t),this.applyMatrix4(ln),this}rotateY(t){return ln.makeRotationY(t),this.applyMatrix4(ln),this}rotateZ(t){return ln.makeRotationZ(t),this.applyMatrix4(ln),this}translate(t,e,n){return ln.makeTranslation(t,e,n),this.applyMatrix4(ln),this}scale(t,e,n){return ln.makeScale(t,e,n),this.applyMatrix4(ln),this}lookAt(t){return ka.lookAt(t),ka.updateMatrix(),this.applyMatrix4(ka.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(nr).negate(),this.translate(nr.x,nr.y,nr.z),this}setFromPoints(t){const e=this.getAttribute("position");if(e===void 0){const n=[];for(let r=0,s=t.length;r<s;r++){const a=t[r];n.push(a.x,a.y,a.z||0)}this.setAttribute("position",new fe(n,3))}else{const n=Math.min(t.length,e.count);for(let r=0;r<n;r++){const s=t[r];e.setXYZ(r,s.x,s.y,s.z||0)}t.length>e.count&&console.warn("THREE.BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),e.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new Ar);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new O(-1/0,-1/0,-1/0),new O(1/0,1/0,1/0));return}if(t!==void 0){if(this.boundingBox.setFromBufferAttribute(t),e)for(let n=0,r=e.length;n<r;n++){const s=e[n];en.setFromBufferAttribute(s),this.morphTargetsRelative?(Re.addVectors(this.boundingBox.min,en.min),this.boundingBox.expandByPoint(Re),Re.addVectors(this.boundingBox.max,en.max),this.boundingBox.expandByPoint(Re)):(this.boundingBox.expandByPoint(en.min),this.boundingBox.expandByPoint(en.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Rr);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new O,1/0);return}if(t){const n=this.boundingSphere.center;if(en.setFromBufferAttribute(t),e)for(let s=0,a=e.length;s<a;s++){const o=e[s];Or.setFromBufferAttribute(o),this.morphTargetsRelative?(Re.addVectors(en.min,Or.min),en.expandByPoint(Re),Re.addVectors(en.max,Or.max),en.expandByPoint(Re)):(en.expandByPoint(Or.min),en.expandByPoint(Or.max))}en.getCenter(n);let r=0;for(let s=0,a=t.count;s<a;s++)Re.fromBufferAttribute(t,s),r=Math.max(r,n.distanceToSquared(Re));if(e)for(let s=0,a=e.length;s<a;s++){const o=e[s],c=this.morphTargetsRelative;for(let l=0,h=o.count;l<h;l++)Re.fromBufferAttribute(o,l),c&&(nr.fromBufferAttribute(t,l),Re.add(nr)),r=Math.max(r,n.distanceToSquared(Re))}this.boundingSphere.radius=Math.sqrt(r),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const t=this.index,e=this.attributes;if(t===null||e.position===void 0||e.normal===void 0||e.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const n=e.position,r=e.normal,s=e.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new oe(new Float32Array(4*n.count),4));const a=this.getAttribute("tangent"),o=[],c=[];for(let C=0;C<n.count;C++)o[C]=new O,c[C]=new O;const l=new O,h=new O,u=new O,d=new St,f=new St,m=new St,x=new O,g=new O;function p(C,v,_){l.fromBufferAttribute(n,C),h.fromBufferAttribute(n,v),u.fromBufferAttribute(n,_),d.fromBufferAttribute(s,C),f.fromBufferAttribute(s,v),m.fromBufferAttribute(s,_),h.sub(l),u.sub(l),f.sub(d),m.sub(d);const S=1/(f.x*m.y-m.x*f.y);isFinite(S)&&(x.copy(h).multiplyScalar(m.y).addScaledVector(u,-f.y).multiplyScalar(S),g.copy(u).multiplyScalar(f.x).addScaledVector(h,-m.x).multiplyScalar(S),o[C].add(x),o[v].add(x),o[_].add(x),c[C].add(g),c[v].add(g),c[_].add(g))}let w=this.groups;w.length===0&&(w=[{start:0,count:t.count}]);for(let C=0,v=w.length;C<v;++C){const _=w[C],S=_.start,b=_.count;for(let D=S,U=S+b;D<U;D+=3)p(t.getX(D+0),t.getX(D+1),t.getX(D+2))}const y=new O,M=new O,T=new O,E=new O;function A(C){T.fromBufferAttribute(r,C),E.copy(T);const v=o[C];y.copy(v),y.sub(T.multiplyScalar(T.dot(v))).normalize(),M.crossVectors(E,v);const S=M.dot(c[C])<0?-1:1;a.setXYZW(C,y.x,y.y,y.z,S)}for(let C=0,v=w.length;C<v;++C){const _=w[C],S=_.start,b=_.count;for(let D=S,U=S+b;D<U;D+=3)A(t.getX(D+0)),A(t.getX(D+1)),A(t.getX(D+2))}}computeVertexNormals(){const t=this.index,e=this.getAttribute("position");if(e!==void 0){let n=this.getAttribute("normal");if(n===void 0)n=new oe(new Float32Array(e.count*3),3),this.setAttribute("normal",n);else for(let d=0,f=n.count;d<f;d++)n.setXYZ(d,0,0,0);const r=new O,s=new O,a=new O,o=new O,c=new O,l=new O,h=new O,u=new O;if(t)for(let d=0,f=t.count;d<f;d+=3){const m=t.getX(d+0),x=t.getX(d+1),g=t.getX(d+2);r.fromBufferAttribute(e,m),s.fromBufferAttribute(e,x),a.fromBufferAttribute(e,g),h.subVectors(a,s),u.subVectors(r,s),h.cross(u),o.fromBufferAttribute(n,m),c.fromBufferAttribute(n,x),l.fromBufferAttribute(n,g),o.add(h),c.add(h),l.add(h),n.setXYZ(m,o.x,o.y,o.z),n.setXYZ(x,c.x,c.y,c.z),n.setXYZ(g,l.x,l.y,l.z)}else for(let d=0,f=e.count;d<f;d+=3)r.fromBufferAttribute(e,d+0),s.fromBufferAttribute(e,d+1),a.fromBufferAttribute(e,d+2),h.subVectors(a,s),u.subVectors(r,s),h.cross(u),n.setXYZ(d+0,h.x,h.y,h.z),n.setXYZ(d+1,h.x,h.y,h.z),n.setXYZ(d+2,h.x,h.y,h.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){const t=this.attributes.normal;for(let e=0,n=t.count;e<n;e++)Re.fromBufferAttribute(t,e),Re.normalize(),t.setXYZ(e,Re.x,Re.y,Re.z)}toNonIndexed(){function t(o,c){const l=o.array,h=o.itemSize,u=o.normalized,d=new l.constructor(c.length*h);let f=0,m=0;for(let x=0,g=c.length;x<g;x++){o.isInterleavedBufferAttribute?f=c[x]*o.data.stride+o.offset:f=c[x]*h;for(let p=0;p<h;p++)d[m++]=l[f++]}return new oe(d,h,u)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const e=new De,n=this.index.array,r=this.attributes;for(const o in r){const c=r[o],l=t(c,n);e.setAttribute(o,l)}const s=this.morphAttributes;for(const o in s){const c=[],l=s[o];for(let h=0,u=l.length;h<u;h++){const d=l[h],f=t(d,n);c.push(f)}e.morphAttributes[o]=c}e.morphTargetsRelative=this.morphTargetsRelative;const a=this.groups;for(let o=0,c=a.length;o<c;o++){const l=a[o];e.addGroup(l.start,l.count,l.materialIndex)}return e}toJSON(){const t={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(t.uuid=this.uuid,t.type=this.type,this.name!==""&&(t.name=this.name),Object.keys(this.userData).length>0&&(t.userData=this.userData),this.parameters!==void 0){const c=this.parameters;for(const l in c)c[l]!==void 0&&(t[l]=c[l]);return t}t.data={attributes:{}};const e=this.index;e!==null&&(t.data.index={type:e.array.constructor.name,array:Array.prototype.slice.call(e.array)});const n=this.attributes;for(const c in n){const l=n[c];t.data.attributes[c]=l.toJSON(t.data)}const r={};let s=!1;for(const c in this.morphAttributes){const l=this.morphAttributes[c],h=[];for(let u=0,d=l.length;u<d;u++){const f=l[u];h.push(f.toJSON(t.data))}h.length>0&&(r[c]=h,s=!0)}s&&(t.data.morphAttributes=r,t.data.morphTargetsRelative=this.morphTargetsRelative);const a=this.groups;a.length>0&&(t.data.groups=JSON.parse(JSON.stringify(a)));const o=this.boundingSphere;return o!==null&&(t.data.boundingSphere=o.toJSON()),t}clone(){return new this.constructor().copy(this)}copy(t){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const e={};this.name=t.name;const n=t.index;n!==null&&this.setIndex(n.clone());const r=t.attributes;for(const l in r){const h=r[l];this.setAttribute(l,h.clone(e))}const s=t.morphAttributes;for(const l in s){const h=[],u=s[l];for(let d=0,f=u.length;d<f;d++)h.push(u[d].clone(e));this.morphAttributes[l]=h}this.morphTargetsRelative=t.morphTargetsRelative;const a=t.groups;for(let l=0,h=a.length;l<h;l++){const u=a[l];this.addGroup(u.start,u.count,u.materialIndex)}const o=t.boundingBox;o!==null&&(this.boundingBox=o.clone());const c=t.boundingSphere;return c!==null&&(this.boundingSphere=c.clone()),this.drawRange.start=t.drawRange.start,this.drawRange.count=t.drawRange.count,this.userData=t.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const fl=new ie,Si=new Zh,Cs=new Rr,dl=new O,Ls=new O,Ps=new O,Ds=new O,za=new O,Is=new O,pl=new O,Us=new O;class Xt extends Pe{constructor(t=new De,e=new pa){super(),this.isMesh=!0,this.type="Mesh",this.geometry=t,this.material=e,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),t.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=t.morphTargetInfluences.slice()),t.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},t.morphTargetDictionary)),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}updateMorphTargets(){const e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){const r=e[n[0]];if(r!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,a=r.length;s<a;s++){const o=r[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=s}}}}getVertexPosition(t,e){const n=this.geometry,r=n.attributes.position,s=n.morphAttributes.position,a=n.morphTargetsRelative;e.fromBufferAttribute(r,t);const o=this.morphTargetInfluences;if(s&&o){Is.set(0,0,0);for(let c=0,l=s.length;c<l;c++){const h=o[c],u=s[c];h!==0&&(za.fromBufferAttribute(u,t),a?Is.addScaledVector(za,h):Is.addScaledVector(za.sub(e),h))}e.add(Is)}return e}raycast(t,e){const n=this.geometry,r=this.material,s=this.matrixWorld;r!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),Cs.copy(n.boundingSphere),Cs.applyMatrix4(s),Si.copy(t.ray).recast(t.near),!(Cs.containsPoint(Si.origin)===!1&&(Si.intersectSphere(Cs,dl)===null||Si.origin.distanceToSquared(dl)>(t.far-t.near)**2))&&(fl.copy(s).invert(),Si.copy(t.ray).applyMatrix4(fl),!(n.boundingBox!==null&&Si.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(t,e,Si)))}_computeIntersections(t,e,n){let r;const s=this.geometry,a=this.material,o=s.index,c=s.attributes.position,l=s.attributes.uv,h=s.attributes.uv1,u=s.attributes.normal,d=s.groups,f=s.drawRange;if(o!==null)if(Array.isArray(a))for(let m=0,x=d.length;m<x;m++){const g=d[m],p=a[g.materialIndex],w=Math.max(g.start,f.start),y=Math.min(o.count,Math.min(g.start+g.count,f.start+f.count));for(let M=w,T=y;M<T;M+=3){const E=o.getX(M),A=o.getX(M+1),C=o.getX(M+2);r=Ns(this,p,t,n,l,h,u,E,A,C),r&&(r.faceIndex=Math.floor(M/3),r.face.materialIndex=g.materialIndex,e.push(r))}}else{const m=Math.max(0,f.start),x=Math.min(o.count,f.start+f.count);for(let g=m,p=x;g<p;g+=3){const w=o.getX(g),y=o.getX(g+1),M=o.getX(g+2);r=Ns(this,a,t,n,l,h,u,w,y,M),r&&(r.faceIndex=Math.floor(g/3),e.push(r))}}else if(c!==void 0)if(Array.isArray(a))for(let m=0,x=d.length;m<x;m++){const g=d[m],p=a[g.materialIndex],w=Math.max(g.start,f.start),y=Math.min(c.count,Math.min(g.start+g.count,f.start+f.count));for(let M=w,T=y;M<T;M+=3){const E=M,A=M+1,C=M+2;r=Ns(this,p,t,n,l,h,u,E,A,C),r&&(r.faceIndex=Math.floor(M/3),r.face.materialIndex=g.materialIndex,e.push(r))}}else{const m=Math.max(0,f.start),x=Math.min(c.count,f.start+f.count);for(let g=m,p=x;g<p;g+=3){const w=g,y=g+1,M=g+2;r=Ns(this,a,t,n,l,h,u,w,y,M),r&&(r.faceIndex=Math.floor(g/3),e.push(r))}}}}function Zd(i,t,e,n,r,s,a,o){let c;if(t.side===Ke?c=n.intersectTriangle(a,s,r,!0,o):c=n.intersectTriangle(r,s,a,t.side===pi,o),c===null)return null;Us.copy(o),Us.applyMatrix4(i.matrixWorld);const l=e.ray.origin.distanceTo(Us);return l<e.near||l>e.far?null:{distance:l,point:Us.clone(),object:i}}function Ns(i,t,e,n,r,s,a,o,c,l){i.getVertexPosition(o,Ls),i.getVertexPosition(c,Ps),i.getVertexPosition(l,Ds);const h=Zd(i,t,e,n,Ls,Ps,Ds,pl);if(h){const u=new O;yn.getBarycoord(pl,Ls,Ps,Ds,u),r&&(h.uv=yn.getInterpolatedAttribute(r,o,c,l,u,new St)),s&&(h.uv1=yn.getInterpolatedAttribute(s,o,c,l,u,new St)),a&&(h.normal=yn.getInterpolatedAttribute(a,o,c,l,u,new O),h.normal.dot(n.direction)>0&&h.normal.multiplyScalar(-1));const d={a:o,b:c,c:l,normal:new O,materialIndex:0};yn.getNormal(Ls,Ps,Ds,d.normal),h.face=d,h.barycoord=u}return h}class qe extends De{constructor(t=1,e=1,n=1,r=1,s=1,a=1){super(),this.type="BoxGeometry",this.parameters={width:t,height:e,depth:n,widthSegments:r,heightSegments:s,depthSegments:a};const o=this;r=Math.floor(r),s=Math.floor(s),a=Math.floor(a);const c=[],l=[],h=[],u=[];let d=0,f=0;m("z","y","x",-1,-1,n,e,t,a,s,0),m("z","y","x",1,-1,n,e,-t,a,s,1),m("x","z","y",1,1,t,n,e,r,a,2),m("x","z","y",1,-1,t,n,-e,r,a,3),m("x","y","z",1,-1,t,e,n,r,s,4),m("x","y","z",-1,-1,t,e,-n,r,s,5),this.setIndex(c),this.setAttribute("position",new fe(l,3)),this.setAttribute("normal",new fe(h,3)),this.setAttribute("uv",new fe(u,2));function m(x,g,p,w,y,M,T,E,A,C,v){const _=M/A,S=T/C,b=M/2,D=T/2,U=E/2,N=A+1,H=C+1;let Z=0,V=0;const rt=new O;for(let ht=0;ht<H;ht++){const dt=ht*S-D;for(let mt=0;mt<N;mt++){const Et=mt*_-b;rt[x]=Et*w,rt[g]=dt*y,rt[p]=U,l.push(rt.x,rt.y,rt.z),rt[x]=0,rt[g]=0,rt[p]=E>0?1:-1,h.push(rt.x,rt.y,rt.z),u.push(mt/A),u.push(1-ht/C),Z+=1}}for(let ht=0;ht<C;ht++)for(let dt=0;dt<A;dt++){const mt=d+dt+N*ht,Et=d+dt+N*(ht+1),Ft=d+(dt+1)+N*(ht+1),zt=d+(dt+1)+N*ht;c.push(mt,Et,zt),c.push(Et,Ft,zt),V+=6}o.addGroup(f,V,v),f+=V,d+=Z}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new qe(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}}function yr(i){const t={};for(const e in i){t[e]={};for(const n in i[e]){const r=i[e][n];r&&(r.isColor||r.isMatrix3||r.isMatrix4||r.isVector2||r.isVector3||r.isVector4||r.isTexture||r.isQuaternion)?r.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),t[e][n]=null):t[e][n]=r.clone():Array.isArray(r)?t[e][n]=r.slice():t[e][n]=r}}return t}function We(i){const t={};for(let e=0;e<i.length;e++){const n=yr(i[e]);for(const r in n)t[r]=n[r]}return t}function Jd(i){const t=[];for(let e=0;e<i.length;e++)t.push(i[e].clone());return t}function tu(i){const t=i.getRenderTarget();return t===null?i.outputColorSpace:t.isXRRenderTarget===!0?t.texture.colorSpace:se.workingColorSpace}const Kd={clone:yr,merge:We};var jd=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,Qd=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class Jn extends hs{constructor(t){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=jd,this.fragmentShader=Qd,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,t!==void 0&&this.setValues(t)}copy(t){return super.copy(t),this.fragmentShader=t.fragmentShader,this.vertexShader=t.vertexShader,this.uniforms=yr(t.uniforms),this.uniformsGroups=Jd(t.uniformsGroups),this.defines=Object.assign({},t.defines),this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.fog=t.fog,this.lights=t.lights,this.clipping=t.clipping,this.extensions=Object.assign({},t.extensions),this.glslVersion=t.glslVersion,this}toJSON(t){const e=super.toJSON(t);e.glslVersion=this.glslVersion,e.uniforms={};for(const r in this.uniforms){const a=this.uniforms[r].value;a&&a.isTexture?e.uniforms[r]={type:"t",value:a.toJSON(t).uuid}:a&&a.isColor?e.uniforms[r]={type:"c",value:a.getHex()}:a&&a.isVector2?e.uniforms[r]={type:"v2",value:a.toArray()}:a&&a.isVector3?e.uniforms[r]={type:"v3",value:a.toArray()}:a&&a.isVector4?e.uniforms[r]={type:"v4",value:a.toArray()}:a&&a.isMatrix3?e.uniforms[r]={type:"m3",value:a.toArray()}:a&&a.isMatrix4?e.uniforms[r]={type:"m4",value:a.toArray()}:e.uniforms[r]={value:a}}Object.keys(this.defines).length>0&&(e.defines=this.defines),e.vertexShader=this.vertexShader,e.fragmentShader=this.fragmentShader,e.lights=this.lights,e.clipping=this.clipping;const n={};for(const r in this.extensions)this.extensions[r]===!0&&(n[r]=!0);return Object.keys(n).length>0&&(e.extensions=n),e}}class eu extends Pe{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new ie,this.projectionMatrix=new ie,this.projectionMatrixInverse=new ie,this.coordinateSystem=Ln,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(t,e){return super.copy(t,e),this.matrixWorldInverse.copy(t.matrixWorldInverse),this.projectionMatrix.copy(t.projectionMatrix),this.projectionMatrixInverse.copy(t.projectionMatrixInverse),this.coordinateSystem=t.coordinateSystem,this}getWorldDirection(t){return super.getWorldDirection(t).negate()}updateMatrixWorld(t){super.updateMatrixWorld(t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(t,e){super.updateWorldMatrix(t,e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}const ii=new O,ml=new St,gl=new St;class pn extends eu{constructor(t=50,e=1,n=.1,r=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=t,this.zoom=1,this.near=n,this.far=r,this.focus=10,this.aspect=e,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.fov=t.fov,this.zoom=t.zoom,this.near=t.near,this.far=t.far,this.focus=t.focus,this.aspect=t.aspect,this.view=t.view===null?null:Object.assign({},t.view),this.filmGauge=t.filmGauge,this.filmOffset=t.filmOffset,this}setFocalLength(t){const e=.5*this.getFilmHeight()/t;this.fov=ns*2*Math.atan(e),this.updateProjectionMatrix()}getFocalLength(){const t=Math.tan(qr*.5*this.fov);return .5*this.getFilmHeight()/t}getEffectiveFOV(){return ns*2*Math.atan(Math.tan(qr*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(t,e,n){ii.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),e.set(ii.x,ii.y).multiplyScalar(-t/ii.z),ii.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(ii.x,ii.y).multiplyScalar(-t/ii.z)}getViewSize(t,e){return this.getViewBounds(t,ml,gl),e.subVectors(gl,ml)}setViewOffset(t,e,n,r,s,a){this.aspect=t/e,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=r,this.view.width=s,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=this.near;let e=t*Math.tan(qr*.5*this.fov)/this.zoom,n=2*e,r=this.aspect*n,s=-.5*r;const a=this.view;if(this.view!==null&&this.view.enabled){const c=a.fullWidth,l=a.fullHeight;s+=a.offsetX*r/c,e-=a.offsetY*n/l,r*=a.width/c,n*=a.height/l}const o=this.filmOffset;o!==0&&(s+=t*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(s,s+r,e,e-n,t,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.fov=this.fov,e.object.zoom=this.zoom,e.object.near=this.near,e.object.far=this.far,e.object.focus=this.focus,e.object.aspect=this.aspect,this.view!==null&&(e.object.view=Object.assign({},this.view)),e.object.filmGauge=this.filmGauge,e.object.filmOffset=this.filmOffset,e}}const ir=-90,rr=1;class tp extends Pe{constructor(t,e,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;const r=new pn(ir,rr,t,e);r.layers=this.layers,this.add(r);const s=new pn(ir,rr,t,e);s.layers=this.layers,this.add(s);const a=new pn(ir,rr,t,e);a.layers=this.layers,this.add(a);const o=new pn(ir,rr,t,e);o.layers=this.layers,this.add(o);const c=new pn(ir,rr,t,e);c.layers=this.layers,this.add(c);const l=new pn(ir,rr,t,e);l.layers=this.layers,this.add(l)}updateCoordinateSystem(){const t=this.coordinateSystem,e=this.children.concat(),[n,r,s,a,o,c]=e;for(const l of e)this.remove(l);if(t===Ln)n.up.set(0,1,0),n.lookAt(1,0,0),r.up.set(0,1,0),r.lookAt(-1,0,0),s.up.set(0,0,-1),s.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),c.up.set(0,1,0),c.lookAt(0,0,-1);else if(t===ca)n.up.set(0,-1,0),n.lookAt(-1,0,0),r.up.set(0,-1,0),r.lookAt(1,0,0),s.up.set(0,0,1),s.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),c.up.set(0,-1,0),c.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+t);for(const l of e)this.add(l),l.updateMatrixWorld()}update(t,e){this.parent===null&&this.updateMatrixWorld();const{renderTarget:n,activeMipmapLevel:r}=this;this.coordinateSystem!==t.coordinateSystem&&(this.coordinateSystem=t.coordinateSystem,this.updateCoordinateSystem());const[s,a,o,c,l,h]=this.children,u=t.getRenderTarget(),d=t.getActiveCubeFace(),f=t.getActiveMipmapLevel(),m=t.xr.enabled;t.xr.enabled=!1;const x=n.texture.generateMipmaps;n.texture.generateMipmaps=!1,t.setRenderTarget(n,0,r),t.render(e,s),t.setRenderTarget(n,1,r),t.render(e,a),t.setRenderTarget(n,2,r),t.render(e,o),t.setRenderTarget(n,3,r),t.render(e,c),t.setRenderTarget(n,4,r),t.render(e,l),n.texture.generateMipmaps=x,t.setRenderTarget(n,5,r),t.render(e,h),t.setRenderTarget(u,d,f),t.xr.enabled=m,n.texture.needsPMREMUpdate=!0}}class nu extends Ne{constructor(t=[],e=Mr,n,r,s,a,o,c,l,h){super(t,e,n,r,s,a,o,c,l,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(t){this.image=t}}class ep extends zi{constructor(t=1,e={}){super(t,t,e),this.isWebGLCubeRenderTarget=!0;const n={width:t,height:t,depth:1},r=[n,n,n,n,n,n];this.texture=new nu(r),this._setTextureOptions(e),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(t,e){this.texture.type=e.type,this.texture.colorSpace=e.colorSpace,this.texture.generateMipmaps=e.generateMipmaps,this.texture.minFilter=e.minFilter,this.texture.magFilter=e.magFilter;const n={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},r=new qe(5,5,5),s=new Jn({name:"CubemapFromEquirect",uniforms:yr(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:Ke,blending:hi});s.uniforms.tEquirect.value=e;const a=new Xt(r,s),o=e.minFilter;return e.minFilter===Di&&(e.minFilter=He),new tp(1,10,this).update(t,a),e.minFilter=o,a.geometry.dispose(),a.material.dispose(),this}clear(t,e=!0,n=!0,r=!0){const s=t.getRenderTarget();for(let a=0;a<6;a++)t.setRenderTarget(this,a),t.clear(e,n,r);t.setRenderTarget(s)}}class Je extends Pe{constructor(){super(),this.isGroup=!0,this.type="Group"}}const np={type:"move"};class Ha{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new Je,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new Je,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new O,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new O),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new Je,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new O,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new O),this._grip}dispatchEvent(t){return this._targetRay!==null&&this._targetRay.dispatchEvent(t),this._grip!==null&&this._grip.dispatchEvent(t),this._hand!==null&&this._hand.dispatchEvent(t),this}connect(t){if(t&&t.hand){const e=this._hand;if(e)for(const n of t.hand.values())this._getHandJoint(e,n)}return this.dispatchEvent({type:"connected",data:t}),this}disconnect(t){return this.dispatchEvent({type:"disconnected",data:t}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(t,e,n){let r=null,s=null,a=null;const o=this._targetRay,c=this._grip,l=this._hand;if(t&&e.session.visibilityState!=="visible-blurred"){if(l&&t.hand){a=!0;for(const x of t.hand.values()){const g=e.getJointPose(x,n),p=this._getHandJoint(l,x);g!==null&&(p.matrix.fromArray(g.transform.matrix),p.matrix.decompose(p.position,p.rotation,p.scale),p.matrixWorldNeedsUpdate=!0,p.jointRadius=g.radius),p.visible=g!==null}const h=l.joints["index-finger-tip"],u=l.joints["thumb-tip"],d=h.position.distanceTo(u.position),f=.02,m=.005;l.inputState.pinching&&d>f+m?(l.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:t.handedness,target:this})):!l.inputState.pinching&&d<=f-m&&(l.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:t.handedness,target:this}))}else c!==null&&t.gripSpace&&(s=e.getPose(t.gripSpace,n),s!==null&&(c.matrix.fromArray(s.transform.matrix),c.matrix.decompose(c.position,c.rotation,c.scale),c.matrixWorldNeedsUpdate=!0,s.linearVelocity?(c.hasLinearVelocity=!0,c.linearVelocity.copy(s.linearVelocity)):c.hasLinearVelocity=!1,s.angularVelocity?(c.hasAngularVelocity=!0,c.angularVelocity.copy(s.angularVelocity)):c.hasAngularVelocity=!1));o!==null&&(r=e.getPose(t.targetRaySpace,n),r===null&&s!==null&&(r=s),r!==null&&(o.matrix.fromArray(r.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,r.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(r.linearVelocity)):o.hasLinearVelocity=!1,r.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(r.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(np)))}return o!==null&&(o.visible=r!==null),c!==null&&(c.visible=s!==null),l!==null&&(l.visible=a!==null),this}_getHandJoint(t,e){if(t.joints[e.jointName]===void 0){const n=new Je;n.matrixAutoUpdate=!1,n.visible=!1,t.joints[e.jointName]=n,t.add(n)}return t.joints[e.jointName]}}class ip extends Pe{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new mn,this.environmentIntensity=1,this.environmentRotation=new mn,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(t,e){return super.copy(t,e),t.background!==null&&(this.background=t.background.clone()),t.environment!==null&&(this.environment=t.environment.clone()),t.fog!==null&&(this.fog=t.fog.clone()),this.backgroundBlurriness=t.backgroundBlurriness,this.backgroundIntensity=t.backgroundIntensity,this.backgroundRotation.copy(t.backgroundRotation),this.environmentIntensity=t.environmentIntensity,this.environmentRotation.copy(t.environmentRotation),t.overrideMaterial!==null&&(this.overrideMaterial=t.overrideMaterial.clone()),this.matrixAutoUpdate=t.matrixAutoUpdate,this}toJSON(t){const e=super.toJSON(t);return this.fog!==null&&(e.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(e.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(e.object.backgroundIntensity=this.backgroundIntensity),e.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(e.object.environmentIntensity=this.environmentIntensity),e.object.environmentRotation=this.environmentRotation.toArray(),e}}const vl=new O,_l=new me,xl=new me,rp=new O,Ml=new ie,Fs=new O,Va=new Rr,Sl=new ie,Ga=new Zh;class iu extends Xt{constructor(t,e){super(t,e),this.isSkinnedMesh=!0,this.type="SkinnedMesh",this.bindMode=Zc,this.bindMatrix=new ie,this.bindMatrixInverse=new ie,this.boundingBox=null,this.boundingSphere=null}computeBoundingBox(){const t=this.geometry;this.boundingBox===null&&(this.boundingBox=new Ar),this.boundingBox.makeEmpty();const e=t.getAttribute("position");for(let n=0;n<e.count;n++)this.getVertexPosition(n,Fs),this.boundingBox.expandByPoint(Fs)}computeBoundingSphere(){const t=this.geometry;this.boundingSphere===null&&(this.boundingSphere=new Rr),this.boundingSphere.makeEmpty();const e=t.getAttribute("position");for(let n=0;n<e.count;n++)this.getVertexPosition(n,Fs),this.boundingSphere.expandByPoint(Fs)}copy(t,e){return super.copy(t,e),this.bindMode=t.bindMode,this.bindMatrix.copy(t.bindMatrix),this.bindMatrixInverse.copy(t.bindMatrixInverse),this.skeleton=t.skeleton,t.boundingBox!==null&&(this.boundingBox=t.boundingBox.clone()),t.boundingSphere!==null&&(this.boundingSphere=t.boundingSphere.clone()),this}raycast(t,e){const n=this.material,r=this.matrixWorld;n!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),Va.copy(this.boundingSphere),Va.applyMatrix4(r),t.ray.intersectsSphere(Va)!==!1&&(Sl.copy(r).invert(),Ga.copy(t.ray).applyMatrix4(Sl),!(this.boundingBox!==null&&Ga.intersectsBox(this.boundingBox)===!1)&&this._computeIntersections(t,e,Ga)))}getVertexPosition(t,e){return super.getVertexPosition(t,e),this.applyBoneTransform(t,e),e}bind(t,e){this.skeleton=t,e===void 0&&(this.updateMatrixWorld(!0),this.skeleton.calculateInverses(),e=this.matrixWorld),this.bindMatrix.copy(e),this.bindMatrixInverse.copy(e).invert()}pose(){this.skeleton.pose()}normalizeSkinWeights(){const t=new me,e=this.geometry.attributes.skinWeight;for(let n=0,r=e.count;n<r;n++){t.fromBufferAttribute(e,n);const s=1/t.manhattanLength();s!==1/0?t.multiplyScalar(s):t.set(1,0,0,0),e.setXYZW(n,t.x,t.y,t.z,t.w)}}updateMatrixWorld(t){super.updateMatrixWorld(t),this.bindMode===Zc?this.bindMatrixInverse.copy(this.matrixWorld).invert():this.bindMode===Qf?this.bindMatrixInverse.copy(this.bindMatrix).invert():console.warn("THREE.SkinnedMesh: Unrecognized bindMode: "+this.bindMode)}applyBoneTransform(t,e){const n=this.skeleton,r=this.geometry;_l.fromBufferAttribute(r.attributes.skinIndex,t),xl.fromBufferAttribute(r.attributes.skinWeight,t),vl.copy(e).applyMatrix4(this.bindMatrix),e.set(0,0,0);for(let s=0;s<4;s++){const a=xl.getComponent(s);if(a!==0){const o=_l.getComponent(s);Ml.multiplyMatrices(n.bones[o].matrixWorld,n.boneInverses[o]),e.addScaledVector(rp.copy(vl).applyMatrix4(Ml),a)}}return e.applyMatrix4(this.bindMatrixInverse)}}class ru extends Pe{constructor(){super(),this.isBone=!0,this.type="Bone"}}class su extends Ne{constructor(t=null,e=1,n=1,r,s,a,o,c,l=sn,h=sn,u,d){super(null,a,o,c,l,h,r,s,u,d),this.isDataTexture=!0,this.image={data:t,width:e,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}const yl=new ie,sp=new ie;class gc{constructor(t=[],e=[]){this.uuid=gi(),this.bones=t.slice(0),this.boneInverses=e,this.boneMatrices=null,this.boneTexture=null,this.init()}init(){const t=this.bones,e=this.boneInverses;if(this.boneMatrices=new Float32Array(t.length*16),e.length===0)this.calculateInverses();else if(t.length!==e.length){console.warn("THREE.Skeleton: Number of inverse bone matrices does not match amount of bones."),this.boneInverses=[];for(let n=0,r=this.bones.length;n<r;n++)this.boneInverses.push(new ie)}}calculateInverses(){this.boneInverses.length=0;for(let t=0,e=this.bones.length;t<e;t++){const n=new ie;this.bones[t]&&n.copy(this.bones[t].matrixWorld).invert(),this.boneInverses.push(n)}}pose(){for(let t=0,e=this.bones.length;t<e;t++){const n=this.bones[t];n&&n.matrixWorld.copy(this.boneInverses[t]).invert()}for(let t=0,e=this.bones.length;t<e;t++){const n=this.bones[t];n&&(n.parent&&n.parent.isBone?(n.matrix.copy(n.parent.matrixWorld).invert(),n.matrix.multiply(n.matrixWorld)):n.matrix.copy(n.matrixWorld),n.matrix.decompose(n.position,n.quaternion,n.scale))}}update(){const t=this.bones,e=this.boneInverses,n=this.boneMatrices,r=this.boneTexture;for(let s=0,a=t.length;s<a;s++){const o=t[s]?t[s].matrixWorld:sp;yl.multiplyMatrices(o,e[s]),yl.toArray(n,s*16)}r!==null&&(r.needsUpdate=!0)}clone(){return new gc(this.bones,this.boneInverses)}computeBoneTexture(){let t=Math.sqrt(this.bones.length*4);t=Math.ceil(t/4)*4,t=Math.max(t,4);const e=new Float32Array(t*t*4);e.set(this.boneMatrices);const n=new su(e,t,t,rn,Cn);return n.needsUpdate=!0,this.boneMatrices=e,this.boneTexture=n,this}getBoneByName(t){for(let e=0,n=this.bones.length;e<n;e++){const r=this.bones[e];if(r.name===t)return r}}dispose(){this.boneTexture!==null&&(this.boneTexture.dispose(),this.boneTexture=null)}fromJSON(t,e){this.uuid=t.uuid;for(let n=0,r=t.bones.length;n<r;n++){const s=t.bones[n];let a=e[s];a===void 0&&(console.warn("THREE.Skeleton: No bone found with UUID:",s),a=new ru),this.bones.push(a),this.boneInverses.push(new ie().fromArray(t.boneInverses[n]))}return this.init(),this}toJSON(){const t={metadata:{version:4.7,type:"Skeleton",generator:"Skeleton.toJSON"},bones:[],boneInverses:[]};t.uuid=this.uuid;const e=this.bones,n=this.boneInverses;for(let r=0,s=e.length;r<s;r++){const a=e[r];t.bones.push(a.uuid);const o=n[r];t.boneInverses.push(o.toArray())}return t}}const Wa=new O,ap=new O,op=new jt;class wi{constructor(t=new O(1,0,0),e=0){this.isPlane=!0,this.normal=t,this.constant=e}set(t,e){return this.normal.copy(t),this.constant=e,this}setComponents(t,e,n,r){return this.normal.set(t,e,n),this.constant=r,this}setFromNormalAndCoplanarPoint(t,e){return this.normal.copy(t),this.constant=-e.dot(this.normal),this}setFromCoplanarPoints(t,e,n){const r=Wa.subVectors(n,e).cross(ap.subVectors(t,e)).normalize();return this.setFromNormalAndCoplanarPoint(r,t),this}copy(t){return this.normal.copy(t.normal),this.constant=t.constant,this}normalize(){const t=1/this.normal.length();return this.normal.multiplyScalar(t),this.constant*=t,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(t){return this.normal.dot(t)+this.constant}distanceToSphere(t){return this.distanceToPoint(t.center)-t.radius}projectPoint(t,e){return e.copy(t).addScaledVector(this.normal,-this.distanceToPoint(t))}intersectLine(t,e){const n=t.delta(Wa),r=this.normal.dot(n);if(r===0)return this.distanceToPoint(t.start)===0?e.copy(t.start):null;const s=-(t.start.dot(this.normal)+this.constant)/r;return s<0||s>1?null:e.copy(t.start).addScaledVector(n,s)}intersectsLine(t){const e=this.distanceToPoint(t.start),n=this.distanceToPoint(t.end);return e<0&&n>0||n<0&&e>0}intersectsBox(t){return t.intersectsPlane(this)}intersectsSphere(t){return t.intersectsPlane(this)}coplanarPoint(t){return t.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(t,e){const n=e||op.getNormalMatrix(t),r=this.coplanarPoint(Wa).applyMatrix4(t),s=this.normal.applyMatrix3(n).normalize();return this.constant=-r.dot(s),this}translate(t){return this.constant-=t.dot(this.normal),this}equals(t){return t.normal.equals(this.normal)&&t.constant===this.constant}clone(){return new this.constructor().copy(this)}}const yi=new Rr,cp=new St(.5,.5),Os=new O;class vc{constructor(t=new wi,e=new wi,n=new wi,r=new wi,s=new wi,a=new wi){this.planes=[t,e,n,r,s,a]}set(t,e,n,r,s,a){const o=this.planes;return o[0].copy(t),o[1].copy(e),o[2].copy(n),o[3].copy(r),o[4].copy(s),o[5].copy(a),this}copy(t){const e=this.planes;for(let n=0;n<6;n++)e[n].copy(t.planes[n]);return this}setFromProjectionMatrix(t,e=Ln,n=!1){const r=this.planes,s=t.elements,a=s[0],o=s[1],c=s[2],l=s[3],h=s[4],u=s[5],d=s[6],f=s[7],m=s[8],x=s[9],g=s[10],p=s[11],w=s[12],y=s[13],M=s[14],T=s[15];if(r[0].setComponents(l-a,f-h,p-m,T-w).normalize(),r[1].setComponents(l+a,f+h,p+m,T+w).normalize(),r[2].setComponents(l+o,f+u,p+x,T+y).normalize(),r[3].setComponents(l-o,f-u,p-x,T-y).normalize(),n)r[4].setComponents(c,d,g,M).normalize(),r[5].setComponents(l-c,f-d,p-g,T-M).normalize();else if(r[4].setComponents(l-c,f-d,p-g,T-M).normalize(),e===Ln)r[5].setComponents(l+c,f+d,p+g,T+M).normalize();else if(e===ca)r[5].setComponents(c,d,g,M).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+e);return this}intersectsObject(t){if(t.boundingSphere!==void 0)t.boundingSphere===null&&t.computeBoundingSphere(),yi.copy(t.boundingSphere).applyMatrix4(t.matrixWorld);else{const e=t.geometry;e.boundingSphere===null&&e.computeBoundingSphere(),yi.copy(e.boundingSphere).applyMatrix4(t.matrixWorld)}return this.intersectsSphere(yi)}intersectsSprite(t){yi.center.set(0,0,0);const e=cp.distanceTo(t.center);return yi.radius=.7071067811865476+e,yi.applyMatrix4(t.matrixWorld),this.intersectsSphere(yi)}intersectsSphere(t){const e=this.planes,n=t.center,r=-t.radius;for(let s=0;s<6;s++)if(e[s].distanceToPoint(n)<r)return!1;return!0}intersectsBox(t){const e=this.planes;for(let n=0;n<6;n++){const r=e[n];if(Os.x=r.normal.x>0?t.max.x:t.min.x,Os.y=r.normal.y>0?t.max.y:t.min.y,Os.z=r.normal.z>0?t.max.z:t.min.z,r.distanceToPoint(Os)<0)return!1}return!0}containsPoint(t){const e=this.planes;for(let n=0;n<6;n++)if(e[n].distanceToPoint(t)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}class lp extends Ne{constructor(t,e,n,r,s=He,a=He,o,c,l){super(t,e,n,r,s,a,o,c,l),this.isVideoTexture=!0,this.generateMipmaps=!1,this._requestVideoFrameCallbackId=0;const h=this;function u(){h.needsUpdate=!0,h._requestVideoFrameCallbackId=t.requestVideoFrameCallback(u)}"requestVideoFrameCallback"in t&&(this._requestVideoFrameCallbackId=t.requestVideoFrameCallback(u))}clone(){return new this.constructor(this.image).copy(this)}update(){const t=this.image;"requestVideoFrameCallback"in t===!1&&t.readyState>=t.HAVE_CURRENT_DATA&&(this.needsUpdate=!0)}dispose(){this._requestVideoFrameCallbackId!==0&&this.source.data.cancelVideoFrameCallback(this._requestVideoFrameCallbackId),super.dispose()}}class bl extends Ne{constructor(t,e,n,r,s,a,o,c,l){super(t,e,n,r,s,a,o,c,l),this.isCanvasTexture=!0,this.needsUpdate=!0}}class au extends Ne{constructor(t,e,n=Bi,r,s,a,o=sn,c=sn,l,h=ts,u=1){if(h!==ts&&h!==es)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");const d={width:t,height:e,depth:u};super(d,r,s,a,o,c,h,n,l),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(t){return super.copy(t),this.source=new mc(Object.assign({},t.image)),this.compareFunction=t.compareFunction,this}toJSON(t){const e=super.toJSON(t);return this.compareFunction!==null&&(e.compareFunction=this.compareFunction),e}}class ou extends Ne{constructor(t=null){super(),this.sourceTexture=t,this.isExternalTexture=!0}copy(t){return super.copy(t),this.sourceTexture=t.sourceTexture,this}}class _c extends De{constructor(t=1,e=1,n=4,r=8,s=1){super(),this.type="CapsuleGeometry",this.parameters={radius:t,height:e,capSegments:n,radialSegments:r,heightSegments:s},e=Math.max(0,e),n=Math.max(1,Math.floor(n)),r=Math.max(3,Math.floor(r)),s=Math.max(1,Math.floor(s));const a=[],o=[],c=[],l=[],h=e/2,u=Math.PI/2*t,d=e,f=2*u+d,m=n*2+s,x=r+1,g=new O,p=new O;for(let w=0;w<=m;w++){let y=0,M=0,T=0,E=0;if(w<=n){const v=w/n,_=v*Math.PI/2;M=-h-t*Math.cos(_),T=t*Math.sin(_),E=-t*Math.cos(_),y=v*u}else if(w<=n+s){const v=(w-n)/s;M=-h+v*e,T=t,E=0,y=u+v*d}else{const v=(w-n-s)/n,_=v*Math.PI/2;M=h+t*Math.sin(_),T=t*Math.cos(_),E=t*Math.sin(_),y=u+d+v*u}const A=Math.max(0,Math.min(1,y/f));let C=0;w===0?C=.5/r:w===m&&(C=-.5/r);for(let v=0;v<=r;v++){const _=v/r,S=_*Math.PI*2,b=Math.sin(S),D=Math.cos(S);p.x=-T*D,p.y=M,p.z=T*b,o.push(p.x,p.y,p.z),g.set(-T*D,E,T*b),g.normalize(),c.push(g.x,g.y,g.z),l.push(_+C,A)}if(w>0){const v=(w-1)*x;for(let _=0;_<r;_++){const S=v+_,b=v+_+1,D=w*x+_,U=w*x+_+1;a.push(S,b,D),a.push(b,U,D)}}}this.setIndex(a),this.setAttribute("position",new fe(o,3)),this.setAttribute("normal",new fe(c,3)),this.setAttribute("uv",new fe(l,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new _c(t.radius,t.height,t.capSegments,t.radialSegments,t.heightSegments)}}class Le extends De{constructor(t=1,e=1,n=1,r=32,s=1,a=!1,o=0,c=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:t,radiusBottom:e,height:n,radialSegments:r,heightSegments:s,openEnded:a,thetaStart:o,thetaLength:c};const l=this;r=Math.floor(r),s=Math.floor(s);const h=[],u=[],d=[],f=[];let m=0;const x=[],g=n/2;let p=0;w(),a===!1&&(t>0&&y(!0),e>0&&y(!1)),this.setIndex(h),this.setAttribute("position",new fe(u,3)),this.setAttribute("normal",new fe(d,3)),this.setAttribute("uv",new fe(f,2));function w(){const M=new O,T=new O;let E=0;const A=(e-t)/n;for(let C=0;C<=s;C++){const v=[],_=C/s,S=_*(e-t)+t;for(let b=0;b<=r;b++){const D=b/r,U=D*c+o,N=Math.sin(U),H=Math.cos(U);T.x=S*N,T.y=-_*n+g,T.z=S*H,u.push(T.x,T.y,T.z),M.set(N,A,H).normalize(),d.push(M.x,M.y,M.z),f.push(D,1-_),v.push(m++)}x.push(v)}for(let C=0;C<r;C++)for(let v=0;v<s;v++){const _=x[v][C],S=x[v+1][C],b=x[v+1][C+1],D=x[v][C+1];(t>0||v!==0)&&(h.push(_,S,D),E+=3),(e>0||v!==s-1)&&(h.push(S,b,D),E+=3)}l.addGroup(p,E,0),p+=E}function y(M){const T=m,E=new St,A=new O;let C=0;const v=M===!0?t:e,_=M===!0?1:-1;for(let b=1;b<=r;b++)u.push(0,g*_,0),d.push(0,_,0),f.push(.5,.5),m++;const S=m;for(let b=0;b<=r;b++){const U=b/r*c+o,N=Math.cos(U),H=Math.sin(U);A.x=v*H,A.y=g*_,A.z=v*N,u.push(A.x,A.y,A.z),d.push(0,_,0),E.x=N*.5+.5,E.y=H*.5*_+.5,f.push(E.x,E.y),m++}for(let b=0;b<r;b++){const D=T+b,U=S+b;M===!0?h.push(U,U+1,D):h.push(U+1,U,D),C+=3}l.addGroup(p,C,M===!0?1:2),p+=C}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Le(t.radiusTop,t.radiusBottom,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}}class Cr extends Le{constructor(t=1,e=1,n=32,r=1,s=!1,a=0,o=Math.PI*2){super(0,t,e,n,r,s,a,o),this.type="ConeGeometry",this.parameters={radius:t,height:e,radialSegments:n,heightSegments:r,openEnded:s,thetaStart:a,thetaLength:o}}static fromJSON(t){return new Cr(t.radius,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}}class In{constructor(){this.type="Curve",this.arcLengthDivisions=200,this.needsUpdate=!1,this.cacheArcLengths=null}getPoint(){console.warn("THREE.Curve: .getPoint() not implemented.")}getPointAt(t,e){const n=this.getUtoTmapping(t);return this.getPoint(n,e)}getPoints(t=5){const e=[];for(let n=0;n<=t;n++)e.push(this.getPoint(n/t));return e}getSpacedPoints(t=5){const e=[];for(let n=0;n<=t;n++)e.push(this.getPointAt(n/t));return e}getLength(){const t=this.getLengths();return t[t.length-1]}getLengths(t=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===t+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;const e=[];let n,r=this.getPoint(0),s=0;e.push(0);for(let a=1;a<=t;a++)n=this.getPoint(a/t),s+=n.distanceTo(r),e.push(s),r=n;return this.cacheArcLengths=e,e}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(t,e=null){const n=this.getLengths();let r=0;const s=n.length;let a;e?a=e:a=t*n[s-1];let o=0,c=s-1,l;for(;o<=c;)if(r=Math.floor(o+(c-o)/2),l=n[r]-a,l<0)o=r+1;else if(l>0)c=r-1;else{c=r;break}if(r=c,n[r]===a)return r/(s-1);const h=n[r],d=n[r+1]-h,f=(a-h)/d;return(r+f)/(s-1)}getTangent(t,e){let r=t-1e-4,s=t+1e-4;r<0&&(r=0),s>1&&(s=1);const a=this.getPoint(r),o=this.getPoint(s),c=e||(a.isVector2?new St:new O);return c.copy(o).sub(a).normalize(),c}getTangentAt(t,e){const n=this.getUtoTmapping(t);return this.getTangent(n,e)}computeFrenetFrames(t,e=!1){const n=new O,r=[],s=[],a=[],o=new O,c=new ie;for(let f=0;f<=t;f++){const m=f/t;r[f]=this.getTangentAt(m,new O)}s[0]=new O,a[0]=new O;let l=Number.MAX_VALUE;const h=Math.abs(r[0].x),u=Math.abs(r[0].y),d=Math.abs(r[0].z);h<=l&&(l=h,n.set(1,0,0)),u<=l&&(l=u,n.set(0,1,0)),d<=l&&n.set(0,0,1),o.crossVectors(r[0],n).normalize(),s[0].crossVectors(r[0],o),a[0].crossVectors(r[0],s[0]);for(let f=1;f<=t;f++){if(s[f]=s[f-1].clone(),a[f]=a[f-1].clone(),o.crossVectors(r[f-1],r[f]),o.length()>Number.EPSILON){o.normalize();const m=Math.acos(te(r[f-1].dot(r[f]),-1,1));s[f].applyMatrix4(c.makeRotationAxis(o,m))}a[f].crossVectors(r[f],s[f])}if(e===!0){let f=Math.acos(te(s[0].dot(s[t]),-1,1));f/=t,r[0].dot(o.crossVectors(s[0],s[t]))>0&&(f=-f);for(let m=1;m<=t;m++)s[m].applyMatrix4(c.makeRotationAxis(r[m],f*m)),a[m].crossVectors(r[m],s[m])}return{tangents:r,normals:s,binormals:a}}clone(){return new this.constructor().copy(this)}copy(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}toJSON(){const t={metadata:{version:4.7,type:"Curve",generator:"Curve.toJSON"}};return t.arcLengthDivisions=this.arcLengthDivisions,t.type=this.type,t}fromJSON(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}}class xc extends In{constructor(t=0,e=0,n=1,r=1,s=0,a=Math.PI*2,o=!1,c=0){super(),this.isEllipseCurve=!0,this.type="EllipseCurve",this.aX=t,this.aY=e,this.xRadius=n,this.yRadius=r,this.aStartAngle=s,this.aEndAngle=a,this.aClockwise=o,this.aRotation=c}getPoint(t,e=new St){const n=e,r=Math.PI*2;let s=this.aEndAngle-this.aStartAngle;const a=Math.abs(s)<Number.EPSILON;for(;s<0;)s+=r;for(;s>r;)s-=r;s<Number.EPSILON&&(a?s=0:s=r),this.aClockwise===!0&&!a&&(s===r?s=-r:s=s-r);const o=this.aStartAngle+t*s;let c=this.aX+this.xRadius*Math.cos(o),l=this.aY+this.yRadius*Math.sin(o);if(this.aRotation!==0){const h=Math.cos(this.aRotation),u=Math.sin(this.aRotation),d=c-this.aX,f=l-this.aY;c=d*h-f*u+this.aX,l=d*u+f*h+this.aY}return n.set(c,l)}copy(t){return super.copy(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}toJSON(){const t=super.toJSON();return t.aX=this.aX,t.aY=this.aY,t.xRadius=this.xRadius,t.yRadius=this.yRadius,t.aStartAngle=this.aStartAngle,t.aEndAngle=this.aEndAngle,t.aClockwise=this.aClockwise,t.aRotation=this.aRotation,t}fromJSON(t){return super.fromJSON(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}}class hp extends xc{constructor(t,e,n,r,s,a){super(t,e,n,n,r,s,a),this.isArcCurve=!0,this.type="ArcCurve"}}function Mc(){let i=0,t=0,e=0,n=0;function r(s,a,o,c){i=s,t=o,e=-3*s+3*a-2*o-c,n=2*s-2*a+o+c}return{initCatmullRom:function(s,a,o,c,l){r(a,o,l*(o-s),l*(c-a))},initNonuniformCatmullRom:function(s,a,o,c,l,h,u){let d=(a-s)/l-(o-s)/(l+h)+(o-a)/h,f=(o-a)/h-(c-a)/(h+u)+(c-o)/u;d*=h,f*=h,r(a,o,d,f)},calc:function(s){const a=s*s,o=a*s;return i+t*s+e*a+n*o}}}const Bs=new O,Xa=new Mc,qa=new Mc,Ya=new Mc;class ci extends In{constructor(t=[],e=!1,n="centripetal",r=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=t,this.closed=e,this.curveType=n,this.tension=r}getPoint(t,e=new O){const n=e,r=this.points,s=r.length,a=(s-(this.closed?0:1))*t;let o=Math.floor(a),c=a-o;this.closed?o+=o>0?0:(Math.floor(Math.abs(o)/s)+1)*s:c===0&&o===s-1&&(o=s-2,c=1);let l,h;this.closed||o>0?l=r[(o-1)%s]:(Bs.subVectors(r[0],r[1]).add(r[0]),l=Bs);const u=r[o%s],d=r[(o+1)%s];if(this.closed||o+2<s?h=r[(o+2)%s]:(Bs.subVectors(r[s-1],r[s-2]).add(r[s-1]),h=Bs),this.curveType==="centripetal"||this.curveType==="chordal"){const f=this.curveType==="chordal"?.5:.25;let m=Math.pow(l.distanceToSquared(u),f),x=Math.pow(u.distanceToSquared(d),f),g=Math.pow(d.distanceToSquared(h),f);x<1e-4&&(x=1),m<1e-4&&(m=x),g<1e-4&&(g=x),Xa.initNonuniformCatmullRom(l.x,u.x,d.x,h.x,m,x,g),qa.initNonuniformCatmullRom(l.y,u.y,d.y,h.y,m,x,g),Ya.initNonuniformCatmullRom(l.z,u.z,d.z,h.z,m,x,g)}else this.curveType==="catmullrom"&&(Xa.initCatmullRom(l.x,u.x,d.x,h.x,this.tension),qa.initCatmullRom(l.y,u.y,d.y,h.y,this.tension),Ya.initCatmullRom(l.z,u.z,d.z,h.z,this.tension));return n.set(Xa.calc(c),qa.calc(c),Ya.calc(c)),n}copy(t){super.copy(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){const r=t.points[e];this.points.push(r.clone())}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}toJSON(){const t=super.toJSON();t.points=[];for(let e=0,n=this.points.length;e<n;e++){const r=this.points[e];t.points.push(r.toArray())}return t.closed=this.closed,t.curveType=this.curveType,t.tension=this.tension,t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){const r=t.points[e];this.points.push(new O().fromArray(r))}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}}function El(i,t,e,n,r){const s=(n-t)*.5,a=(r-e)*.5,o=i*i,c=i*o;return(2*e-2*n+s+a)*c+(-3*e+3*n-2*s-a)*o+s*i+e}function up(i,t){const e=1-i;return e*e*t}function fp(i,t){return 2*(1-i)*i*t}function dp(i,t){return i*i*t}function $r(i,t,e,n){return up(i,t)+fp(i,e)+dp(i,n)}function pp(i,t){const e=1-i;return e*e*e*t}function mp(i,t){const e=1-i;return 3*e*e*i*t}function gp(i,t){return 3*(1-i)*i*i*t}function vp(i,t){return i*i*i*t}function Zr(i,t,e,n,r){return pp(i,t)+mp(i,e)+gp(i,n)+vp(i,r)}class cu extends In{constructor(t=new St,e=new St,n=new St,r=new St){super(),this.isCubicBezierCurve=!0,this.type="CubicBezierCurve",this.v0=t,this.v1=e,this.v2=n,this.v3=r}getPoint(t,e=new St){const n=e,r=this.v0,s=this.v1,a=this.v2,o=this.v3;return n.set(Zr(t,r.x,s.x,a.x,o.x),Zr(t,r.y,s.y,a.y,o.y)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}}class _p extends In{constructor(t=new O,e=new O,n=new O,r=new O){super(),this.isCubicBezierCurve3=!0,this.type="CubicBezierCurve3",this.v0=t,this.v1=e,this.v2=n,this.v3=r}getPoint(t,e=new O){const n=e,r=this.v0,s=this.v1,a=this.v2,o=this.v3;return n.set(Zr(t,r.x,s.x,a.x,o.x),Zr(t,r.y,s.y,a.y,o.y),Zr(t,r.z,s.z,a.z,o.z)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}}class lu extends In{constructor(t=new St,e=new St){super(),this.isLineCurve=!0,this.type="LineCurve",this.v1=t,this.v2=e}getPoint(t,e=new St){const n=e;return t===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(t).add(this.v1)),n}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new St){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class xp extends In{constructor(t=new O,e=new O){super(),this.isLineCurve3=!0,this.type="LineCurve3",this.v1=t,this.v2=e}getPoint(t,e=new O){const n=e;return t===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(t).add(this.v1)),n}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new O){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class hu extends In{constructor(t=new St,e=new St,n=new St){super(),this.isQuadraticBezierCurve=!0,this.type="QuadraticBezierCurve",this.v0=t,this.v1=e,this.v2=n}getPoint(t,e=new St){const n=e,r=this.v0,s=this.v1,a=this.v2;return n.set($r(t,r.x,s.x,a.x),$r(t,r.y,s.y,a.y)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class uu extends In{constructor(t=new O,e=new O,n=new O){super(),this.isQuadraticBezierCurve3=!0,this.type="QuadraticBezierCurve3",this.v0=t,this.v1=e,this.v2=n}getPoint(t,e=new O){const n=e,r=this.v0,s=this.v1,a=this.v2;return n.set($r(t,r.x,s.x,a.x),$r(t,r.y,s.y,a.y),$r(t,r.z,s.z,a.z)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class fu extends In{constructor(t=[]){super(),this.isSplineCurve=!0,this.type="SplineCurve",this.points=t}getPoint(t,e=new St){const n=e,r=this.points,s=(r.length-1)*t,a=Math.floor(s),o=s-a,c=r[a===0?a:a-1],l=r[a],h=r[a>r.length-2?r.length-1:a+1],u=r[a>r.length-3?r.length-1:a+2];return n.set(El(o,c.x,l.x,h.x,u.x),El(o,c.y,l.y,h.y,u.y)),n}copy(t){super.copy(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){const r=t.points[e];this.points.push(r.clone())}return this}toJSON(){const t=super.toJSON();t.points=[];for(let e=0,n=this.points.length;e<n;e++){const r=this.points[e];t.points.push(r.toArray())}return t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){const r=t.points[e];this.points.push(new St().fromArray(r))}return this}}var ha=Object.freeze({__proto__:null,ArcCurve:hp,CatmullRomCurve3:ci,CubicBezierCurve:cu,CubicBezierCurve3:_p,EllipseCurve:xc,LineCurve:lu,LineCurve3:xp,QuadraticBezierCurve:hu,QuadraticBezierCurve3:uu,SplineCurve:fu});class Mp extends In{constructor(){super(),this.type="CurvePath",this.curves=[],this.autoClose=!1}add(t){this.curves.push(t)}closePath(){const t=this.curves[0].getPoint(0),e=this.curves[this.curves.length-1].getPoint(1);if(!t.equals(e)){const n=t.isVector2===!0?"LineCurve":"LineCurve3";this.curves.push(new ha[n](e,t))}return this}getPoint(t,e){const n=t*this.getLength(),r=this.getCurveLengths();let s=0;for(;s<r.length;){if(r[s]>=n){const a=r[s]-n,o=this.curves[s],c=o.getLength(),l=c===0?0:1-a/c;return o.getPointAt(l,e)}s++}return null}getLength(){const t=this.getCurveLengths();return t[t.length-1]}updateArcLengths(){this.needsUpdate=!0,this.cacheLengths=null,this.getCurveLengths()}getCurveLengths(){if(this.cacheLengths&&this.cacheLengths.length===this.curves.length)return this.cacheLengths;const t=[];let e=0;for(let n=0,r=this.curves.length;n<r;n++)e+=this.curves[n].getLength(),t.push(e);return this.cacheLengths=t,t}getSpacedPoints(t=40){const e=[];for(let n=0;n<=t;n++)e.push(this.getPoint(n/t));return this.autoClose&&e.push(e[0]),e}getPoints(t=12){const e=[];let n;for(let r=0,s=this.curves;r<s.length;r++){const a=s[r],o=a.isEllipseCurve?t*2:a.isLineCurve||a.isLineCurve3?1:a.isSplineCurve?t*a.points.length:t,c=a.getPoints(o);for(let l=0;l<c.length;l++){const h=c[l];n&&n.equals(h)||(e.push(h),n=h)}}return this.autoClose&&e.length>1&&!e[e.length-1].equals(e[0])&&e.push(e[0]),e}copy(t){super.copy(t),this.curves=[];for(let e=0,n=t.curves.length;e<n;e++){const r=t.curves[e];this.curves.push(r.clone())}return this.autoClose=t.autoClose,this}toJSON(){const t=super.toJSON();t.autoClose=this.autoClose,t.curves=[];for(let e=0,n=this.curves.length;e<n;e++){const r=this.curves[e];t.curves.push(r.toJSON())}return t}fromJSON(t){super.fromJSON(t),this.autoClose=t.autoClose,this.curves=[];for(let e=0,n=t.curves.length;e<n;e++){const r=t.curves[e];this.curves.push(new ha[r.type]().fromJSON(r))}return this}}class wl extends Mp{constructor(t){super(),this.type="Path",this.currentPoint=new St,t&&this.setFromPoints(t)}setFromPoints(t){this.moveTo(t[0].x,t[0].y);for(let e=1,n=t.length;e<n;e++)this.lineTo(t[e].x,t[e].y);return this}moveTo(t,e){return this.currentPoint.set(t,e),this}lineTo(t,e){const n=new lu(this.currentPoint.clone(),new St(t,e));return this.curves.push(n),this.currentPoint.set(t,e),this}quadraticCurveTo(t,e,n,r){const s=new hu(this.currentPoint.clone(),new St(t,e),new St(n,r));return this.curves.push(s),this.currentPoint.set(n,r),this}bezierCurveTo(t,e,n,r,s,a){const o=new cu(this.currentPoint.clone(),new St(t,e),new St(n,r),new St(s,a));return this.curves.push(o),this.currentPoint.set(s,a),this}splineThru(t){const e=[this.currentPoint.clone()].concat(t),n=new fu(e);return this.curves.push(n),this.currentPoint.copy(t[t.length-1]),this}arc(t,e,n,r,s,a){const o=this.currentPoint.x,c=this.currentPoint.y;return this.absarc(t+o,e+c,n,r,s,a),this}absarc(t,e,n,r,s,a){return this.absellipse(t,e,n,n,r,s,a),this}ellipse(t,e,n,r,s,a,o,c){const l=this.currentPoint.x,h=this.currentPoint.y;return this.absellipse(t+l,e+h,n,r,s,a,o,c),this}absellipse(t,e,n,r,s,a,o,c){const l=new xc(t,e,n,r,s,a,o,c);if(this.curves.length>0){const u=l.getPoint(0);u.equals(this.currentPoint)||this.lineTo(u.x,u.y)}this.curves.push(l);const h=l.getPoint(1);return this.currentPoint.copy(h),this}copy(t){return super.copy(t),this.currentPoint.copy(t.currentPoint),this}toJSON(){const t=super.toJSON();return t.currentPoint=this.currentPoint.toArray(),t}fromJSON(t){return super.fromJSON(t),this.currentPoint.fromArray(t.currentPoint),this}}class du extends wl{constructor(t){super(t),this.uuid=gi(),this.type="Shape",this.holes=[]}getPointsHoles(t){const e=[];for(let n=0,r=this.holes.length;n<r;n++)e[n]=this.holes[n].getPoints(t);return e}extractPoints(t){return{shape:this.getPoints(t),holes:this.getPointsHoles(t)}}copy(t){super.copy(t),this.holes=[];for(let e=0,n=t.holes.length;e<n;e++){const r=t.holes[e];this.holes.push(r.clone())}return this}toJSON(){const t=super.toJSON();t.uuid=this.uuid,t.holes=[];for(let e=0,n=this.holes.length;e<n;e++){const r=this.holes[e];t.holes.push(r.toJSON())}return t}fromJSON(t){super.fromJSON(t),this.uuid=t.uuid,this.holes=[];for(let e=0,n=t.holes.length;e<n;e++){const r=t.holes[e];this.holes.push(new wl().fromJSON(r))}return this}}function Sp(i,t,e=2){const n=t&&t.length,r=n?t[0]*e:i.length;let s=pu(i,0,r,e,!0);const a=[];if(!s||s.next===s.prev)return a;let o,c,l;if(n&&(s=Tp(i,t,s,e)),i.length>80*e){o=1/0,c=1/0;let h=-1/0,u=-1/0;for(let d=e;d<r;d+=e){const f=i[d],m=i[d+1];f<o&&(o=f),m<c&&(c=m),f>h&&(h=f),m>u&&(u=m)}l=Math.max(h-o,u-c),l=l!==0?32767/l:0}return rs(s,a,e,o,c,l,0),a}function pu(i,t,e,n,r){let s;if(r===Op(i,t,e,n)>0)for(let a=t;a<e;a+=n)s=Tl(a/n|0,i[a],i[a+1],s);else for(let a=e-n;a>=t;a-=n)s=Tl(a/n|0,i[a],i[a+1],s);return s&&br(s,s.next)&&(as(s),s=s.next),s}function Hi(i,t){if(!i)return i;t||(t=i);let e=i,n;do if(n=!1,!e.steiner&&(br(e,e.next)||Se(e.prev,e,e.next)===0)){if(as(e),e=t=e.prev,e===e.next)break;n=!0}else e=e.next;while(n||e!==t);return t}function rs(i,t,e,n,r,s,a){if(!i)return;!a&&s&&Pp(i,n,r,s);let o=i;for(;i.prev!==i.next;){const c=i.prev,l=i.next;if(s?bp(i,n,r,s):yp(i)){t.push(c.i,i.i,l.i),as(i),i=l.next,o=l.next;continue}if(i=l,i===o){a?a===1?(i=Ep(Hi(i),t),rs(i,t,e,n,r,s,2)):a===2&&wp(i,t,e,n,r,s):rs(Hi(i),t,e,n,r,s,1);break}}}function yp(i){const t=i.prev,e=i,n=i.next;if(Se(t,e,n)>=0)return!1;const r=t.x,s=e.x,a=n.x,o=t.y,c=e.y,l=n.y,h=Math.min(r,s,a),u=Math.min(o,c,l),d=Math.max(r,s,a),f=Math.max(o,c,l);let m=n.next;for(;m!==t;){if(m.x>=h&&m.x<=d&&m.y>=u&&m.y<=f&&Gr(r,o,s,c,a,l,m.x,m.y)&&Se(m.prev,m,m.next)>=0)return!1;m=m.next}return!0}function bp(i,t,e,n){const r=i.prev,s=i,a=i.next;if(Se(r,s,a)>=0)return!1;const o=r.x,c=s.x,l=a.x,h=r.y,u=s.y,d=a.y,f=Math.min(o,c,l),m=Math.min(h,u,d),x=Math.max(o,c,l),g=Math.max(h,u,d),p=Ko(f,m,t,e,n),w=Ko(x,g,t,e,n);let y=i.prevZ,M=i.nextZ;for(;y&&y.z>=p&&M&&M.z<=w;){if(y.x>=f&&y.x<=x&&y.y>=m&&y.y<=g&&y!==r&&y!==a&&Gr(o,h,c,u,l,d,y.x,y.y)&&Se(y.prev,y,y.next)>=0||(y=y.prevZ,M.x>=f&&M.x<=x&&M.y>=m&&M.y<=g&&M!==r&&M!==a&&Gr(o,h,c,u,l,d,M.x,M.y)&&Se(M.prev,M,M.next)>=0))return!1;M=M.nextZ}for(;y&&y.z>=p;){if(y.x>=f&&y.x<=x&&y.y>=m&&y.y<=g&&y!==r&&y!==a&&Gr(o,h,c,u,l,d,y.x,y.y)&&Se(y.prev,y,y.next)>=0)return!1;y=y.prevZ}for(;M&&M.z<=w;){if(M.x>=f&&M.x<=x&&M.y>=m&&M.y<=g&&M!==r&&M!==a&&Gr(o,h,c,u,l,d,M.x,M.y)&&Se(M.prev,M,M.next)>=0)return!1;M=M.nextZ}return!0}function Ep(i,t){let e=i;do{const n=e.prev,r=e.next.next;!br(n,r)&&gu(n,e,e.next,r)&&ss(n,r)&&ss(r,n)&&(t.push(n.i,e.i,r.i),as(e),as(e.next),e=i=r),e=e.next}while(e!==i);return Hi(e)}function wp(i,t,e,n,r,s){let a=i;do{let o=a.next.next;for(;o!==a.prev;){if(a.i!==o.i&&Up(a,o)){let c=vu(a,o);a=Hi(a,a.next),c=Hi(c,c.next),rs(a,t,e,n,r,s,0),rs(c,t,e,n,r,s,0);return}o=o.next}a=a.next}while(a!==i)}function Tp(i,t,e,n){const r=[];for(let s=0,a=t.length;s<a;s++){const o=t[s]*n,c=s<a-1?t[s+1]*n:i.length,l=pu(i,o,c,n,!1);l===l.next&&(l.steiner=!0),r.push(Ip(l))}r.sort(Ap);for(let s=0;s<r.length;s++)e=Rp(r[s],e);return e}function Ap(i,t){let e=i.x-t.x;if(e===0&&(e=i.y-t.y,e===0)){const n=(i.next.y-i.y)/(i.next.x-i.x),r=(t.next.y-t.y)/(t.next.x-t.x);e=n-r}return e}function Rp(i,t){const e=Cp(i,t);if(!e)return t;const n=vu(e,i);return Hi(n,n.next),Hi(e,e.next)}function Cp(i,t){let e=t;const n=i.x,r=i.y;let s=-1/0,a;if(br(i,e))return e;do{if(br(i,e.next))return e.next;if(r<=e.y&&r>=e.next.y&&e.next.y!==e.y){const u=e.x+(r-e.y)*(e.next.x-e.x)/(e.next.y-e.y);if(u<=n&&u>s&&(s=u,a=e.x<e.next.x?e:e.next,u===n))return a}e=e.next}while(e!==t);if(!a)return null;const o=a,c=a.x,l=a.y;let h=1/0;e=a;do{if(n>=e.x&&e.x>=c&&n!==e.x&&mu(r<l?n:s,r,c,l,r<l?s:n,r,e.x,e.y)){const u=Math.abs(r-e.y)/(n-e.x);ss(e,i)&&(u<h||u===h&&(e.x>a.x||e.x===a.x&&Lp(a,e)))&&(a=e,h=u)}e=e.next}while(e!==o);return a}function Lp(i,t){return Se(i.prev,i,t.prev)<0&&Se(t.next,i,i.next)<0}function Pp(i,t,e,n){let r=i;do r.z===0&&(r.z=Ko(r.x,r.y,t,e,n)),r.prevZ=r.prev,r.nextZ=r.next,r=r.next;while(r!==i);r.prevZ.nextZ=null,r.prevZ=null,Dp(r)}function Dp(i){let t,e=1;do{let n=i,r;i=null;let s=null;for(t=0;n;){t++;let a=n,o=0;for(let l=0;l<e&&(o++,a=a.nextZ,!!a);l++);let c=e;for(;o>0||c>0&&a;)o!==0&&(c===0||!a||n.z<=a.z)?(r=n,n=n.nextZ,o--):(r=a,a=a.nextZ,c--),s?s.nextZ=r:i=r,r.prevZ=s,s=r;n=a}s.nextZ=null,e*=2}while(t>1);return i}function Ko(i,t,e,n,r){return i=(i-e)*r|0,t=(t-n)*r|0,i=(i|i<<8)&16711935,i=(i|i<<4)&252645135,i=(i|i<<2)&858993459,i=(i|i<<1)&1431655765,t=(t|t<<8)&16711935,t=(t|t<<4)&252645135,t=(t|t<<2)&858993459,t=(t|t<<1)&1431655765,i|t<<1}function Ip(i){let t=i,e=i;do(t.x<e.x||t.x===e.x&&t.y<e.y)&&(e=t),t=t.next;while(t!==i);return e}function mu(i,t,e,n,r,s,a,o){return(r-a)*(t-o)>=(i-a)*(s-o)&&(i-a)*(n-o)>=(e-a)*(t-o)&&(e-a)*(s-o)>=(r-a)*(n-o)}function Gr(i,t,e,n,r,s,a,o){return!(i===a&&t===o)&&mu(i,t,e,n,r,s,a,o)}function Up(i,t){return i.next.i!==t.i&&i.prev.i!==t.i&&!Np(i,t)&&(ss(i,t)&&ss(t,i)&&Fp(i,t)&&(Se(i.prev,i,t.prev)||Se(i,t.prev,t))||br(i,t)&&Se(i.prev,i,i.next)>0&&Se(t.prev,t,t.next)>0)}function Se(i,t,e){return(t.y-i.y)*(e.x-t.x)-(t.x-i.x)*(e.y-t.y)}function br(i,t){return i.x===t.x&&i.y===t.y}function gu(i,t,e,n){const r=zs(Se(i,t,e)),s=zs(Se(i,t,n)),a=zs(Se(e,n,i)),o=zs(Se(e,n,t));return!!(r!==s&&a!==o||r===0&&ks(i,e,t)||s===0&&ks(i,n,t)||a===0&&ks(e,i,n)||o===0&&ks(e,t,n))}function ks(i,t,e){return t.x<=Math.max(i.x,e.x)&&t.x>=Math.min(i.x,e.x)&&t.y<=Math.max(i.y,e.y)&&t.y>=Math.min(i.y,e.y)}function zs(i){return i>0?1:i<0?-1:0}function Np(i,t){let e=i;do{if(e.i!==i.i&&e.next.i!==i.i&&e.i!==t.i&&e.next.i!==t.i&&gu(e,e.next,i,t))return!0;e=e.next}while(e!==i);return!1}function ss(i,t){return Se(i.prev,i,i.next)<0?Se(i,t,i.next)>=0&&Se(i,i.prev,t)>=0:Se(i,t,i.prev)<0||Se(i,i.next,t)<0}function Fp(i,t){let e=i,n=!1;const r=(i.x+t.x)/2,s=(i.y+t.y)/2;do e.y>s!=e.next.y>s&&e.next.y!==e.y&&r<(e.next.x-e.x)*(s-e.y)/(e.next.y-e.y)+e.x&&(n=!n),e=e.next;while(e!==i);return n}function vu(i,t){const e=jo(i.i,i.x,i.y),n=jo(t.i,t.x,t.y),r=i.next,s=t.prev;return i.next=t,t.prev=i,e.next=r,r.prev=e,n.next=e,e.prev=n,s.next=n,n.prev=s,n}function Tl(i,t,e,n){const r=jo(i,t,e);return n?(r.next=n.next,r.prev=n,n.next.prev=r,n.next=r):(r.prev=r,r.next=r),r}function as(i){i.next.prev=i.prev,i.prev.next=i.next,i.prevZ&&(i.prevZ.nextZ=i.nextZ),i.nextZ&&(i.nextZ.prevZ=i.prevZ)}function jo(i,t,e){return{i,x:t,y:e,prev:null,next:null,z:0,prevZ:null,nextZ:null,steiner:!1}}function Op(i,t,e,n){let r=0;for(let s=t,a=e-n;s<e;s+=n)r+=(i[a]-i[s])*(i[s+1]+i[a+1]),a=s;return r}class Bp{static triangulate(t,e,n=2){return Sp(t,e,n)}}class fr{static area(t){const e=t.length;let n=0;for(let r=e-1,s=0;s<e;r=s++)n+=t[r].x*t[s].y-t[s].x*t[r].y;return n*.5}static isClockWise(t){return fr.area(t)<0}static triangulateShape(t,e){const n=[],r=[],s=[];Al(t),Rl(n,t);let a=t.length;e.forEach(Al);for(let c=0;c<e.length;c++)r.push(a),a+=e[c].length,Rl(n,e[c]);const o=Bp.triangulate(n,r);for(let c=0;c<o.length;c+=3)s.push(o.slice(c,c+3));return s}}function Al(i){const t=i.length;t>2&&i[t-1].equals(i[0])&&i.pop()}function Rl(i,t){for(let e=0;e<t.length;e++)i.push(t[e].x),i.push(t[e].y)}class Sc extends De{constructor(t=new du([new St(.5,.5),new St(-.5,.5),new St(-.5,-.5),new St(.5,-.5)]),e={}){super(),this.type="ExtrudeGeometry",this.parameters={shapes:t,options:e},t=Array.isArray(t)?t:[t];const n=this,r=[],s=[];for(let o=0,c=t.length;o<c;o++){const l=t[o];a(l)}this.setAttribute("position",new fe(r,3)),this.setAttribute("uv",new fe(s,2)),this.computeVertexNormals();function a(o){const c=[],l=e.curveSegments!==void 0?e.curveSegments:12,h=e.steps!==void 0?e.steps:1,u=e.depth!==void 0?e.depth:1;let d=e.bevelEnabled!==void 0?e.bevelEnabled:!0,f=e.bevelThickness!==void 0?e.bevelThickness:.2,m=e.bevelSize!==void 0?e.bevelSize:f-.1,x=e.bevelOffset!==void 0?e.bevelOffset:0,g=e.bevelSegments!==void 0?e.bevelSegments:3;const p=e.extrudePath,w=e.UVGenerator!==void 0?e.UVGenerator:kp;let y,M=!1,T,E,A,C;p&&(y=p.getSpacedPoints(h),M=!0,d=!1,T=p.computeFrenetFrames(h,!1),E=new O,A=new O,C=new O),d||(g=0,f=0,m=0,x=0);const v=o.extractPoints(l);let _=v.shape;const S=v.holes;if(!fr.isClockWise(_)){_=_.reverse();for(let Q=0,z=S.length;Q<z;Q++){const G=S[Q];fr.isClockWise(G)&&(S[Q]=G.reverse())}}function D(Q){const G=10000000000000001e-36;let X=Q[0];for(let tt=1;tt<=Q.length;tt++){const ot=tt%Q.length,ut=Q[ot],Pt=ut.x-X.x,Ht=ut.y-X.y,I=Pt*Pt+Ht*Ht,R=Math.max(Math.abs(ut.x),Math.abs(ut.y),Math.abs(X.x),Math.abs(X.y)),Y=G*R*R;if(I<=Y){Q.splice(ot,1),tt--;continue}X=ut}}D(_),S.forEach(D);const U=S.length,N=_;for(let Q=0;Q<U;Q++){const z=S[Q];_=_.concat(z)}function H(Q,z,G){return z||console.error("THREE.ExtrudeGeometry: vec does not exist"),Q.clone().addScaledVector(z,G)}const Z=_.length;function V(Q,z,G){let X,tt,ot;const ut=Q.x-z.x,Pt=Q.y-z.y,Ht=G.x-Q.x,I=G.y-Q.y,R=ut*ut+Pt*Pt,Y=ut*I-Pt*Ht;if(Math.abs(Y)>Number.EPSILON){const nt=Math.sqrt(R),pt=Math.sqrt(Ht*Ht+I*I),at=z.x-Pt/nt,Ot=z.y+ut/nt,Mt=G.x-I/pt,It=G.y+Ht/pt,Ut=((Mt-at)*I-(It-Ot)*Ht)/(ut*I-Pt*Ht);X=at+ut*Ut-Q.x,tt=Ot+Pt*Ut-Q.y;const gt=X*X+tt*tt;if(gt<=2)return new St(X,tt);ot=Math.sqrt(gt/2)}else{let nt=!1;ut>Number.EPSILON?Ht>Number.EPSILON&&(nt=!0):ut<-Number.EPSILON?Ht<-Number.EPSILON&&(nt=!0):Math.sign(Pt)===Math.sign(I)&&(nt=!0),nt?(X=-Pt,tt=ut,ot=Math.sqrt(R)):(X=ut,tt=Pt,ot=Math.sqrt(R/2))}return new St(X/ot,tt/ot)}const rt=[];for(let Q=0,z=N.length,G=z-1,X=Q+1;Q<z;Q++,G++,X++)G===z&&(G=0),X===z&&(X=0),rt[Q]=V(N[Q],N[G],N[X]);const ht=[];let dt,mt=rt.concat();for(let Q=0,z=U;Q<z;Q++){const G=S[Q];dt=[];for(let X=0,tt=G.length,ot=tt-1,ut=X+1;X<tt;X++,ot++,ut++)ot===tt&&(ot=0),ut===tt&&(ut=0),dt[X]=V(G[X],G[ot],G[ut]);ht.push(dt),mt=mt.concat(dt)}let Et;if(g===0)Et=fr.triangulateShape(N,S);else{const Q=[],z=[];for(let G=0;G<g;G++){const X=G/g,tt=f*Math.cos(X*Math.PI/2),ot=m*Math.sin(X*Math.PI/2)+x;for(let ut=0,Pt=N.length;ut<Pt;ut++){const Ht=H(N[ut],rt[ut],ot);k(Ht.x,Ht.y,-tt),X===0&&Q.push(Ht)}for(let ut=0,Pt=U;ut<Pt;ut++){const Ht=S[ut];dt=ht[ut];const I=[];for(let R=0,Y=Ht.length;R<Y;R++){const nt=H(Ht[R],dt[R],ot);k(nt.x,nt.y,-tt),X===0&&I.push(nt)}X===0&&z.push(I)}}Et=fr.triangulateShape(Q,z)}const Ft=Et.length,zt=m+x;for(let Q=0;Q<Z;Q++){const z=d?H(_[Q],mt[Q],zt):_[Q];M?(A.copy(T.normals[0]).multiplyScalar(z.x),E.copy(T.binormals[0]).multiplyScalar(z.y),C.copy(y[0]).add(A).add(E),k(C.x,C.y,C.z)):k(z.x,z.y,0)}for(let Q=1;Q<=h;Q++)for(let z=0;z<Z;z++){const G=d?H(_[z],mt[z],zt):_[z];M?(A.copy(T.normals[Q]).multiplyScalar(G.x),E.copy(T.binormals[Q]).multiplyScalar(G.y),C.copy(y[Q]).add(A).add(E),k(C.x,C.y,C.z)):k(G.x,G.y,u/h*Q)}for(let Q=g-1;Q>=0;Q--){const z=Q/g,G=f*Math.cos(z*Math.PI/2),X=m*Math.sin(z*Math.PI/2)+x;for(let tt=0,ot=N.length;tt<ot;tt++){const ut=H(N[tt],rt[tt],X);k(ut.x,ut.y,u+G)}for(let tt=0,ot=S.length;tt<ot;tt++){const ut=S[tt];dt=ht[tt];for(let Pt=0,Ht=ut.length;Pt<Ht;Pt++){const I=H(ut[Pt],dt[Pt],X);M?k(I.x,I.y+y[h-1].y,y[h-1].x+G):k(I.x,I.y,u+G)}}}et(),lt();function et(){const Q=r.length/3;if(d){let z=0,G=Z*z;for(let X=0;X<Ft;X++){const tt=Et[X];B(tt[2]+G,tt[1]+G,tt[0]+G)}z=h+g*2,G=Z*z;for(let X=0;X<Ft;X++){const tt=Et[X];B(tt[0]+G,tt[1]+G,tt[2]+G)}}else{for(let z=0;z<Ft;z++){const G=Et[z];B(G[2],G[1],G[0])}for(let z=0;z<Ft;z++){const G=Et[z];B(G[0]+Z*h,G[1]+Z*h,G[2]+Z*h)}}n.addGroup(Q,r.length/3-Q,0)}function lt(){const Q=r.length/3;let z=0;F(N,z),z+=N.length;for(let G=0,X=S.length;G<X;G++){const tt=S[G];F(tt,z),z+=tt.length}n.addGroup(Q,r.length/3-Q,1)}function F(Q,z){let G=Q.length;for(;--G>=0;){const X=G;let tt=G-1;tt<0&&(tt=Q.length-1);for(let ot=0,ut=h+g*2;ot<ut;ot++){const Pt=Z*ot,Ht=Z*(ot+1),I=z+X+Pt,R=z+tt+Pt,Y=z+tt+Ht,nt=z+X+Ht;K(I,R,Y,nt)}}}function k(Q,z,G){c.push(Q),c.push(z),c.push(G)}function B(Q,z,G){j(Q),j(z),j(G);const X=r.length/3,tt=w.generateTopUV(n,r,X-3,X-2,X-1);P(tt[0]),P(tt[1]),P(tt[2])}function K(Q,z,G,X){j(Q),j(z),j(X),j(z),j(G),j(X);const tt=r.length/3,ot=w.generateSideWallUV(n,r,tt-6,tt-3,tt-2,tt-1);P(ot[0]),P(ot[1]),P(ot[3]),P(ot[1]),P(ot[2]),P(ot[3])}function j(Q){r.push(c[Q*3+0]),r.push(c[Q*3+1]),r.push(c[Q*3+2])}function P(Q){s.push(Q.x),s.push(Q.y)}}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}toJSON(){const t=super.toJSON(),e=this.parameters.shapes,n=this.parameters.options;return zp(e,n,t)}static fromJSON(t,e){const n=[];for(let s=0,a=t.shapes.length;s<a;s++){const o=e[t.shapes[s]];n.push(o)}const r=t.options.extrudePath;return r!==void 0&&(t.options.extrudePath=new ha[r.type]().fromJSON(r)),new Sc(n,t.options)}}const kp={generateTopUV:function(i,t,e,n,r){const s=t[e*3],a=t[e*3+1],o=t[n*3],c=t[n*3+1],l=t[r*3],h=t[r*3+1];return[new St(s,a),new St(o,c),new St(l,h)]},generateSideWallUV:function(i,t,e,n,r,s){const a=t[e*3],o=t[e*3+1],c=t[e*3+2],l=t[n*3],h=t[n*3+1],u=t[n*3+2],d=t[r*3],f=t[r*3+1],m=t[r*3+2],x=t[s*3],g=t[s*3+1],p=t[s*3+2];return Math.abs(o-h)<Math.abs(a-l)?[new St(a,1-c),new St(l,1-u),new St(d,1-m),new St(x,1-p)]:[new St(o,1-c),new St(h,1-u),new St(f,1-m),new St(g,1-p)]}};function zp(i,t,e){if(e.shapes=[],Array.isArray(i))for(let n=0,r=i.length;n<r;n++){const s=i[n];e.shapes.push(s.uuid)}else e.shapes.push(i.uuid);return e.options=Object.assign({},t),t.extrudePath!==void 0&&(e.options.extrudePath=t.extrudePath.toJSON()),e}class os extends De{constructor(t=[new St(0,-.5),new St(.5,0),new St(0,.5)],e=12,n=0,r=Math.PI*2){super(),this.type="LatheGeometry",this.parameters={points:t,segments:e,phiStart:n,phiLength:r},e=Math.floor(e),r=te(r,0,Math.PI*2);const s=[],a=[],o=[],c=[],l=[],h=1/e,u=new O,d=new St,f=new O,m=new O,x=new O;let g=0,p=0;for(let w=0;w<=t.length-1;w++)switch(w){case 0:g=t[w+1].x-t[w].x,p=t[w+1].y-t[w].y,f.x=p*1,f.y=-g,f.z=p*0,x.copy(f),f.normalize(),c.push(f.x,f.y,f.z);break;case t.length-1:c.push(x.x,x.y,x.z);break;default:g=t[w+1].x-t[w].x,p=t[w+1].y-t[w].y,f.x=p*1,f.y=-g,f.z=p*0,m.copy(f),f.x+=x.x,f.y+=x.y,f.z+=x.z,f.normalize(),c.push(f.x,f.y,f.z),x.copy(m)}for(let w=0;w<=e;w++){const y=n+w*h*r,M=Math.sin(y),T=Math.cos(y);for(let E=0;E<=t.length-1;E++){u.x=t[E].x*M,u.y=t[E].y,u.z=t[E].x*T,a.push(u.x,u.y,u.z),d.x=w/e,d.y=E/(t.length-1),o.push(d.x,d.y);const A=c[3*E+0]*M,C=c[3*E+1],v=c[3*E+0]*T;l.push(A,C,v)}}for(let w=0;w<e;w++)for(let y=0;y<t.length-1;y++){const M=y+w*t.length,T=M,E=M+t.length,A=M+t.length+1,C=M+1;s.push(T,E,C),s.push(A,C,E)}this.setIndex(s),this.setAttribute("position",new fe(a,3)),this.setAttribute("uv",new fe(o,2)),this.setAttribute("normal",new fe(l,3))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new os(t.points,t.segments,t.phiStart,t.phiLength)}}class us extends De{constructor(t=1,e=1,n=1,r=1){super(),this.type="PlaneGeometry",this.parameters={width:t,height:e,widthSegments:n,heightSegments:r};const s=t/2,a=e/2,o=Math.floor(n),c=Math.floor(r),l=o+1,h=c+1,u=t/o,d=e/c,f=[],m=[],x=[],g=[];for(let p=0;p<h;p++){const w=p*d-a;for(let y=0;y<l;y++){const M=y*u-s;m.push(M,-w,0),x.push(0,0,1),g.push(y/o),g.push(1-p/c)}}for(let p=0;p<c;p++)for(let w=0;w<o;w++){const y=w+l*p,M=w+l*(p+1),T=w+1+l*(p+1),E=w+1+l*p;f.push(y,M,E),f.push(M,T,E)}this.setIndex(f),this.setAttribute("position",new fe(m,3)),this.setAttribute("normal",new fe(x,3)),this.setAttribute("uv",new fe(g,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new us(t.width,t.height,t.widthSegments,t.heightSegments)}}class Ue extends De{constructor(t=1,e=32,n=16,r=0,s=Math.PI*2,a=0,o=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:t,widthSegments:e,heightSegments:n,phiStart:r,phiLength:s,thetaStart:a,thetaLength:o},e=Math.max(3,Math.floor(e)),n=Math.max(2,Math.floor(n));const c=Math.min(a+o,Math.PI);let l=0;const h=[],u=new O,d=new O,f=[],m=[],x=[],g=[];for(let p=0;p<=n;p++){const w=[],y=p/n;let M=0;p===0&&a===0?M=.5/e:p===n&&c===Math.PI&&(M=-.5/e);for(let T=0;T<=e;T++){const E=T/e;u.x=-t*Math.cos(r+E*s)*Math.sin(a+y*o),u.y=t*Math.cos(a+y*o),u.z=t*Math.sin(r+E*s)*Math.sin(a+y*o),m.push(u.x,u.y,u.z),d.copy(u).normalize(),x.push(d.x,d.y,d.z),g.push(E+M,1-y),w.push(l++)}h.push(w)}for(let p=0;p<n;p++)for(let w=0;w<e;w++){const y=h[p][w+1],M=h[p][w],T=h[p+1][w],E=h[p+1][w+1];(p!==0||a>0)&&f.push(y,M,E),(p!==n-1||c<Math.PI)&&f.push(M,T,E)}this.setIndex(f),this.setAttribute("position",new fe(m,3)),this.setAttribute("normal",new fe(x,3)),this.setAttribute("uv",new fe(g,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Ue(t.radius,t.widthSegments,t.heightSegments,t.phiStart,t.phiLength,t.thetaStart,t.thetaLength)}}class Ui extends De{constructor(t=1,e=.4,n=12,r=48,s=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:t,tube:e,radialSegments:n,tubularSegments:r,arc:s},n=Math.floor(n),r=Math.floor(r);const a=[],o=[],c=[],l=[],h=new O,u=new O,d=new O;for(let f=0;f<=n;f++)for(let m=0;m<=r;m++){const x=m/r*s,g=f/n*Math.PI*2;u.x=(t+e*Math.cos(g))*Math.cos(x),u.y=(t+e*Math.cos(g))*Math.sin(x),u.z=e*Math.sin(g),o.push(u.x,u.y,u.z),h.x=t*Math.cos(x),h.y=t*Math.sin(x),d.subVectors(u,h).normalize(),c.push(d.x,d.y,d.z),l.push(m/r),l.push(f/n)}for(let f=1;f<=n;f++)for(let m=1;m<=r;m++){const x=(r+1)*f+m-1,g=(r+1)*(f-1)+m-1,p=(r+1)*(f-1)+m,w=(r+1)*f+m;a.push(x,g,w),a.push(g,p,w)}this.setIndex(a),this.setAttribute("position",new fe(o,3)),this.setAttribute("normal",new fe(c,3)),this.setAttribute("uv",new fe(l,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Ui(t.radius,t.tube,t.radialSegments,t.tubularSegments,t.arc)}}class Lr extends De{constructor(t=new uu(new O(-1,-1,0),new O(-1,1,0),new O(1,1,0)),e=64,n=1,r=8,s=!1){super(),this.type="TubeGeometry",this.parameters={path:t,tubularSegments:e,radius:n,radialSegments:r,closed:s};const a=t.computeFrenetFrames(e,s);this.tangents=a.tangents,this.normals=a.normals,this.binormals=a.binormals;const o=new O,c=new O,l=new St;let h=new O;const u=[],d=[],f=[],m=[];x(),this.setIndex(m),this.setAttribute("position",new fe(u,3)),this.setAttribute("normal",new fe(d,3)),this.setAttribute("uv",new fe(f,2));function x(){for(let y=0;y<e;y++)g(y);g(s===!1?e:0),w(),p()}function g(y){h=t.getPointAt(y/e,h);const M=a.normals[y],T=a.binormals[y];for(let E=0;E<=r;E++){const A=E/r*Math.PI*2,C=Math.sin(A),v=-Math.cos(A);c.x=v*M.x+C*T.x,c.y=v*M.y+C*T.y,c.z=v*M.z+C*T.z,c.normalize(),d.push(c.x,c.y,c.z),o.x=h.x+n*c.x,o.y=h.y+n*c.y,o.z=h.z+n*c.z,u.push(o.x,o.y,o.z)}}function p(){for(let y=1;y<=e;y++)for(let M=1;M<=r;M++){const T=(r+1)*(y-1)+(M-1),E=(r+1)*y+(M-1),A=(r+1)*y+M,C=(r+1)*(y-1)+M;m.push(T,E,C),m.push(E,A,C)}}function w(){for(let y=0;y<=e;y++)for(let M=0;M<=r;M++)l.x=y/e,l.y=M/r,f.push(l.x,l.y)}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}toJSON(){const t=super.toJSON();return t.path=this.parameters.path.toJSON(),t}static fromJSON(t){return new Lr(new ha[t.path.type]().fromJSON(t.path),t.tubularSegments,t.radius,t.radialSegments,t.closed)}}class li extends hs{constructor(t){super(),this.isMeshStandardMaterial=!0,this.type="MeshStandardMaterial",this.defines={STANDARD:""},this.color=new Gt(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Gt(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Xh,this.normalScale=new St(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new mn,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.defines={STANDARD:""},this.color.copy(t.color),this.roughness=t.roughness,this.metalness=t.metalness,this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.emissive.copy(t.emissive),this.emissiveMap=t.emissiveMap,this.emissiveIntensity=t.emissiveIntensity,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.roughnessMap=t.roughnessMap,this.metalnessMap=t.metalnessMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.envMapIntensity=t.envMapIntensity,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.flatShading=t.flatShading,this.fog=t.fog,this}}class Hp extends hs{constructor(t){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=ed,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(t)}copy(t){return super.copy(t),this.depthPacking=t.depthPacking,this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this}}class Vp extends hs{constructor(t){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(t)}copy(t){return super.copy(t),this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this}}class _u extends Pe{constructor(t,e=1){super(),this.isLight=!0,this.type="Light",this.color=new Gt(t),this.intensity=e}dispose(){}copy(t,e){return super.copy(t,e),this.color.copy(t.color),this.intensity=t.intensity,this}toJSON(t){const e=super.toJSON(t);return e.object.color=this.color.getHex(),e.object.intensity=this.intensity,this.groundColor!==void 0&&(e.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(e.object.distance=this.distance),this.angle!==void 0&&(e.object.angle=this.angle),this.decay!==void 0&&(e.object.decay=this.decay),this.penumbra!==void 0&&(e.object.penumbra=this.penumbra),this.shadow!==void 0&&(e.object.shadow=this.shadow.toJSON()),this.target!==void 0&&(e.object.target=this.target.uuid),e}}class Gp extends _u{constructor(t,e,n){super(t,n),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(Pe.DEFAULT_UP),this.updateMatrix(),this.groundColor=new Gt(e)}copy(t,e){return super.copy(t,e),this.groundColor.copy(t.groundColor),this}}const $a=new ie,Cl=new O,Ll=new O;class Wp{constructor(t){this.camera=t,this.intensity=1,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new St(512,512),this.mapType=Dn,this.map=null,this.mapPass=null,this.matrix=new ie,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new vc,this._frameExtents=new St(1,1),this._viewportCount=1,this._viewports=[new me(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(t){const e=this.camera,n=this.matrix;Cl.setFromMatrixPosition(t.matrixWorld),e.position.copy(Cl),Ll.setFromMatrixPosition(t.target.matrixWorld),e.lookAt(Ll),e.updateMatrixWorld(),$a.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),this._frustum.setFromProjectionMatrix($a,e.coordinateSystem,e.reversedDepth),e.reversedDepth?n.set(.5,0,0,.5,0,.5,0,.5,0,0,1,0,0,0,0,1):n.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),n.multiply($a)}getViewport(t){return this._viewports[t]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(t){return this.camera=t.camera.clone(),this.intensity=t.intensity,this.bias=t.bias,this.radius=t.radius,this.autoUpdate=t.autoUpdate,this.needsUpdate=t.needsUpdate,this.normalBias=t.normalBias,this.blurSamples=t.blurSamples,this.mapSize.copy(t.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){const t={};return this.intensity!==1&&(t.intensity=this.intensity),this.bias!==0&&(t.bias=this.bias),this.normalBias!==0&&(t.normalBias=this.normalBias),this.radius!==1&&(t.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(t.mapSize=this.mapSize.toArray()),t.camera=this.camera.toJSON(!1).object,delete t.camera.matrix,t}}class xu extends eu{constructor(t=-1,e=1,n=1,r=-1,s=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=t,this.right=e,this.top=n,this.bottom=r,this.near=s,this.far=a,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.left=t.left,this.right=t.right,this.top=t.top,this.bottom=t.bottom,this.near=t.near,this.far=t.far,this.zoom=t.zoom,this.view=t.view===null?null:Object.assign({},t.view),this}setViewOffset(t,e,n,r,s,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=r,this.view.width=s,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=(this.right-this.left)/(2*this.zoom),e=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,r=(this.top+this.bottom)/2;let s=n-t,a=n+t,o=r+e,c=r-e;if(this.view!==null&&this.view.enabled){const l=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;s+=l*this.view.offsetX,a=s+l*this.view.width,o-=h*this.view.offsetY,c=o-h*this.view.height}this.projectionMatrix.makeOrthographic(s,a,o,c,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.zoom=this.zoom,e.object.left=this.left,e.object.right=this.right,e.object.top=this.top,e.object.bottom=this.bottom,e.object.near=this.near,e.object.far=this.far,this.view!==null&&(e.object.view=Object.assign({},this.view)),e}}class Xp extends Wp{constructor(){super(new xu(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class qp extends _u{constructor(t,e){super(t,e),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(Pe.DEFAULT_UP),this.updateMatrix(),this.target=new Pe,this.shadow=new Xp}dispose(){this.shadow.dispose()}copy(t){return super.copy(t),this.target=t.target.clone(),this.shadow=t.shadow.clone(),this}}class Yp extends pn{constructor(t=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=t}}function Pl(i,t,e,n){const r=$p(n);switch(e){case Hh:return i*t;case Gh:return i*t/r.components*r.byteLength;case uc:return i*t/r.components*r.byteLength;case Wh:return i*t*2/r.components*r.byteLength;case fc:return i*t*2/r.components*r.byteLength;case Vh:return i*t*3/r.components*r.byteLength;case rn:return i*t*4/r.components*r.byteLength;case dc:return i*t*4/r.components*r.byteLength;case js:case Qs:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*8;case ta:case ea:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*16;case Eo:case To:return Math.max(i,16)*Math.max(t,8)/4;case bo:case wo:return Math.max(i,8)*Math.max(t,8)/2;case Ao:case Ro:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*8;case Co:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*16;case Lo:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*16;case Po:return Math.floor((i+4)/5)*Math.floor((t+3)/4)*16;case Do:return Math.floor((i+4)/5)*Math.floor((t+4)/5)*16;case Io:return Math.floor((i+5)/6)*Math.floor((t+4)/5)*16;case Uo:return Math.floor((i+5)/6)*Math.floor((t+5)/6)*16;case No:return Math.floor((i+7)/8)*Math.floor((t+4)/5)*16;case Fo:return Math.floor((i+7)/8)*Math.floor((t+5)/6)*16;case Oo:return Math.floor((i+7)/8)*Math.floor((t+7)/8)*16;case Bo:return Math.floor((i+9)/10)*Math.floor((t+4)/5)*16;case ko:return Math.floor((i+9)/10)*Math.floor((t+5)/6)*16;case zo:return Math.floor((i+9)/10)*Math.floor((t+7)/8)*16;case Ho:return Math.floor((i+9)/10)*Math.floor((t+9)/10)*16;case Vo:return Math.floor((i+11)/12)*Math.floor((t+9)/10)*16;case Go:return Math.floor((i+11)/12)*Math.floor((t+11)/12)*16;case Wo:case Xo:case qo:return Math.ceil(i/4)*Math.ceil(t/4)*16;case Yo:case $o:return Math.ceil(i/4)*Math.ceil(t/4)*8;case Zo:case Jo:return Math.ceil(i/4)*Math.ceil(t/4)*16}throw new Error(`Unable to determine texture byte length for ${e} format.`)}function $p(i){switch(i){case Dn:case Oh:return{byteLength:1,components:1};case jr:case Bh:case wr:return{byteLength:2,components:1};case lc:case hc:return{byteLength:2,components:4};case Bi:case cc:case Cn:return{byteLength:4,components:1};case kh:case zh:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${i}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:oc}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=oc);/**
 * @license
 * Copyright 2010-2025 Three.js Authors
 * SPDX-License-Identifier: MIT
 */function Mu(){let i=null,t=!1,e=null,n=null;function r(s,a){e(s,a),n=i.requestAnimationFrame(r)}return{start:function(){t!==!0&&e!==null&&(n=i.requestAnimationFrame(r),t=!0)},stop:function(){i.cancelAnimationFrame(n),t=!1},setAnimationLoop:function(s){e=s},setContext:function(s){i=s}}}function Zp(i){const t=new WeakMap;function e(o,c){const l=o.array,h=o.usage,u=l.byteLength,d=i.createBuffer();i.bindBuffer(c,d),i.bufferData(c,l,h),o.onUploadCallback();let f;if(l instanceof Float32Array)f=i.FLOAT;else if(typeof Float16Array<"u"&&l instanceof Float16Array)f=i.HALF_FLOAT;else if(l instanceof Uint16Array)o.isFloat16BufferAttribute?f=i.HALF_FLOAT:f=i.UNSIGNED_SHORT;else if(l instanceof Int16Array)f=i.SHORT;else if(l instanceof Uint32Array)f=i.UNSIGNED_INT;else if(l instanceof Int32Array)f=i.INT;else if(l instanceof Int8Array)f=i.BYTE;else if(l instanceof Uint8Array)f=i.UNSIGNED_BYTE;else if(l instanceof Uint8ClampedArray)f=i.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+l);return{buffer:d,type:f,bytesPerElement:l.BYTES_PER_ELEMENT,version:o.version,size:u}}function n(o,c,l){const h=c.array,u=c.updateRanges;if(i.bindBuffer(l,o),u.length===0)i.bufferSubData(l,0,h);else{u.sort((f,m)=>f.start-m.start);let d=0;for(let f=1;f<u.length;f++){const m=u[d],x=u[f];x.start<=m.start+m.count+1?m.count=Math.max(m.count,x.start+x.count-m.start):(++d,u[d]=x)}u.length=d+1;for(let f=0,m=u.length;f<m;f++){const x=u[f];i.bufferSubData(l,x.start*h.BYTES_PER_ELEMENT,h,x.start,x.count)}c.clearUpdateRanges()}c.onUploadCallback()}function r(o){return o.isInterleavedBufferAttribute&&(o=o.data),t.get(o)}function s(o){o.isInterleavedBufferAttribute&&(o=o.data);const c=t.get(o);c&&(i.deleteBuffer(c.buffer),t.delete(o))}function a(o,c){if(o.isInterleavedBufferAttribute&&(o=o.data),o.isGLBufferAttribute){const h=t.get(o);(!h||h.version<o.version)&&t.set(o,{buffer:o.buffer,type:o.type,bytesPerElement:o.elementSize,version:o.version});return}const l=t.get(o);if(l===void 0)t.set(o,e(o,c));else if(l.version<o.version){if(l.size!==o.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");n(l.buffer,o,c),l.version=o.version}}return{get:r,remove:s,update:a}}var Jp=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,Kp=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,jp=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,Qp=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,t0=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,e0=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,n0=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,i0=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,r0=`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec3 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 ).rgb;
	}
#endif`,s0=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,a0=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,o0=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,c0=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,l0=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,h0=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,u0=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,f0=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,d0=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,p0=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,m0=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,g0=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,v0=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,_0=`#if defined( USE_COLOR_ALPHA )
	vColor = vec4( 1.0 );
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec3( 1.0 );
#endif
#ifdef USE_COLOR
	vColor *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.xyz *= instanceColor.xyz;
#endif
#ifdef USE_BATCHING_COLOR
	vec3 batchingColor = getBatchingColor( getIndirectIndex( gl_DrawID ) );
	vColor.xyz *= batchingColor.xyz;
#endif`,x0=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
vec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );
}
mat3 transposeMat3( const in mat3 m ) {
	mat3 tmp;
	tmp[ 0 ] = vec3( m[ 0 ].x, m[ 1 ].x, m[ 2 ].x );
	tmp[ 1 ] = vec3( m[ 0 ].y, m[ 1 ].y, m[ 2 ].y );
	tmp[ 2 ] = vec3( m[ 0 ].z, m[ 1 ].z, m[ 2 ].z );
	return tmp;
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,M0=`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,S0=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
	#ifdef FLIP_SIDED
		transformedTangent = - transformedTangent;
	#endif
#endif`,y0=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,b0=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,E0=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,w0=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,T0="gl_FragColor = linearToOutputTexel( gl_FragColor );",A0=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,R0=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * vec3( flipEnvMap * reflectVec.x, reflectVec.yz ) );
	#else
		vec4 envColor = vec4( 0.0 );
	#endif
	#ifdef ENVMAP_BLENDING_MULTIPLY
		outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_MIX )
		outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_ADD )
		outgoingLight += envColor.xyz * specularStrength * reflectivity;
	#endif
#endif`,C0=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,L0=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,P0=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,D0=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,I0=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,U0=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,N0=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,F0=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,O0=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,B0=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,k0=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,z0=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,H0=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif`,V0=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, roughness * roughness) );
			reflectVec = inverseTransformDirection( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
#endif`,G0=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,W0=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,X0=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,q0=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,Y0=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb * ( 1.0 - metalnessFactor );
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = mix( min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = mix( vec3( 0.04 ), diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.07, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,$0=`struct PhysicalMaterial {
	vec3 diffuseColor;
	float roughness;
	vec3 specularColor;
	float specularF90;
	float dispersion;
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		float v = 0.5 / ( gv + gl );
		return saturate(v);
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColor;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transposeMat3( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float a = roughness < 0.25 ? -339.2 * r2 + 161.4 * roughness - 25.9 : -8.48 * r2 + 14.3 * roughness - 9.95;
	float b = roughness < 0.25 ? 44.0 * r2 - 23.7 * roughness + 3.26 : 1.97 * r2 - 3.27 * roughness + 0.72;
	float DG = exp( a * dotNV + b ) + ( roughness < 0.25 ? 0.0 : 0.1 * ( roughness - 0.25 ) );
	return saturate( DG * RECIPROCAL_PI );
}
vec2 DFGApprox( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	const vec4 c0 = vec4( - 1, - 0.0275, - 0.572, 0.022 );
	const vec4 c1 = vec4( 1, 0.0425, 1.04, - 0.04 );
	vec4 r = roughness * c0 + c1;
	float a004 = min( r.x * r.x, exp2( - 9.28 * dotNV ) ) * r.x + r.y;
	vec2 fab = vec2( - 1.04, 1.04 ) * a004 + r.zw;
	return fab;
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColor * t2.x + ( vec3( 1.0 ) - material.specularColor ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseColor * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
	#endif
	reflectedLight.directSpecular += irradiance * BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
	#endif
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.iridescence, material.iridescenceFresnel, material.roughness, singleScattering, multiScattering );
	#else
		computeMultiscattering( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.roughness, singleScattering, multiScattering );
	#endif
	vec3 totalScattering = singleScattering + multiScattering;
	vec3 diffuse = material.diffuseColor * ( 1.0 - max( max( totalScattering.r, totalScattering.g ), totalScattering.b ) );
	reflectedLight.indirectSpecular += radiance * singleScattering;
	reflectedLight.indirectSpecular += multiScattering * cosineWeightedIrradiance;
	reflectedLight.indirectDiffuse += diffuse * cosineWeightedIrradiance;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,Z0=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		material.iridescenceFresnel = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		material.iridescenceF0 = Schlick_to_F0( material.iridescenceFresnel, 1.0, dotNVi );
	}
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,J0=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD ) && defined( ENVMAP_TYPE_CUBE_UV )
		iblIrradiance += getIBLIrradiance( geometryNormal );
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		radiance += getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		radiance += getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,K0=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,j0=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,Q0=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,t1=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,e1=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,n1=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,i1=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,r1=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,s1=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,a1=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,o1=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,c1=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,l1=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,h1=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,u1=`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,f1=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,d1=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,p1=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,m1=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,g1=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,v1=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,_1=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,x1=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,M1=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,S1=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,y1=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,b1=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,E1=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return depth * ( near - far ) - near;
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return ( near * far ) / ( ( far - near ) * depth - far );
}`,w1=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,T1=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,A1=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,R1=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,C1=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,L1=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,P1=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform sampler2D pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	float texture2DCompare( sampler2D depths, vec2 uv, float compare ) {
		float depth = unpackRGBAToDepth( texture2D( depths, uv ) );
		#ifdef USE_REVERSED_DEPTH_BUFFER
			return step( depth, compare );
		#else
			return step( compare, depth );
		#endif
	}
	vec2 texture2DDistribution( sampler2D shadow, vec2 uv ) {
		return unpackRGBATo2Half( texture2D( shadow, uv ) );
	}
	float VSMShadow( sampler2D shadow, vec2 uv, float compare ) {
		float occlusion = 1.0;
		vec2 distribution = texture2DDistribution( shadow, uv );
		#ifdef USE_REVERSED_DEPTH_BUFFER
			float hard_shadow = step( distribution.x, compare );
		#else
			float hard_shadow = step( compare, distribution.x );
		#endif
		if ( hard_shadow != 1.0 ) {
			float distance = compare - distribution.x;
			float variance = max( 0.00000, distribution.y * distribution.y );
			float softness_probability = variance / (variance + distance * distance );			softness_probability = clamp( ( softness_probability - 0.3 ) / ( 0.95 - 0.3 ), 0.0, 1.0 );			occlusion = clamp( max( hard_shadow, softness_probability ), 0.0, 1.0 );
		}
		return occlusion;
	}
	float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
		float shadow = 1.0;
		shadowCoord.xyz /= shadowCoord.w;
		shadowCoord.z += shadowBias;
		bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
		bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
		if ( frustumTest ) {
		#if defined( SHADOWMAP_TYPE_PCF )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx0 = - texelSize.x * shadowRadius;
			float dy0 = - texelSize.y * shadowRadius;
			float dx1 = + texelSize.x * shadowRadius;
			float dy1 = + texelSize.y * shadowRadius;
			float dx2 = dx0 / 2.0;
			float dy2 = dy0 / 2.0;
			float dx3 = dx1 / 2.0;
			float dy3 = dy1 / 2.0;
			shadow = (
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy1 ), shadowCoord.z )
			) * ( 1.0 / 17.0 );
		#elif defined( SHADOWMAP_TYPE_PCF_SOFT )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx = texelSize.x;
			float dy = texelSize.y;
			vec2 uv = shadowCoord.xy;
			vec2 f = fract( uv * shadowMapSize + 0.5 );
			uv -= f * texelSize;
			shadow = (
				texture2DCompare( shadowMap, uv, shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( dx, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( 0.0, dy ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + texelSize, shadowCoord.z ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, 0.0 ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 0.0 ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, dy ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( 0.0, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 0.0, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( texture2DCompare( shadowMap, uv + vec2( dx, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( dx, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( mix( texture2DCompare( shadowMap, uv + vec2( -dx, -dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, -dy ), shadowCoord.z ),
						  f.x ),
					 mix( texture2DCompare( shadowMap, uv + vec2( -dx, 2.0 * dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 2.0 * dy ), shadowCoord.z ),
						  f.x ),
					 f.y )
			) * ( 1.0 / 9.0 );
		#elif defined( SHADOWMAP_TYPE_VSM )
			shadow = VSMShadow( shadowMap, shadowCoord.xy, shadowCoord.z );
		#else
			shadow = texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z );
		#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	vec2 cubeToUV( vec3 v, float texelSizeY ) {
		vec3 absV = abs( v );
		float scaleToCube = 1.0 / max( absV.x, max( absV.y, absV.z ) );
		absV *= scaleToCube;
		v *= scaleToCube * ( 1.0 - 2.0 * texelSizeY );
		vec2 planar = v.xy;
		float almostATexel = 1.5 * texelSizeY;
		float almostOne = 1.0 - almostATexel;
		if ( absV.z >= almostOne ) {
			if ( v.z > 0.0 )
				planar.x = 4.0 - v.x;
		} else if ( absV.x >= almostOne ) {
			float signX = sign( v.x );
			planar.x = v.z * signX + 2.0 * signX;
		} else if ( absV.y >= almostOne ) {
			float signY = sign( v.y );
			planar.x = v.x + 2.0 * signY + 2.0;
			planar.y = v.z * signY - 2.0;
		}
		return vec2( 0.125, 0.25 ) * planar + vec2( 0.375, 0.75 );
	}
	float getPointShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		
		float lightToPositionLength = length( lightToPosition );
		if ( lightToPositionLength - shadowCameraFar <= 0.0 && lightToPositionLength - shadowCameraNear >= 0.0 ) {
			float dp = ( lightToPositionLength - shadowCameraNear ) / ( shadowCameraFar - shadowCameraNear );			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			vec2 texelSize = vec2( 1.0 ) / ( shadowMapSize * vec2( 4.0, 2.0 ) );
			#if defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_PCF_SOFT ) || defined( SHADOWMAP_TYPE_VSM )
				vec2 offset = vec2( - 1, 1 ) * shadowRadius * texelSize.y;
				shadow = (
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxx, texelSize.y ), dp )
				) * ( 1.0 / 9.0 );
			#else
				shadow = texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp );
			#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
#endif`,D1=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,I1=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	vec3 shadowWorldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,U1=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,N1=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,F1=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,O1=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,B1=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,k1=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,z1=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,H1=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,V1=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,G1=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = inverseTransformDirection( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseColor, material.specularColor, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,W1=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		#else
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,X1=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,q1=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,Y1=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,$1=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const Z1=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,J1=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,K1=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,j1=`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float flipEnvMap;
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vec3( flipEnvMap * vWorldDirection.x, vWorldDirection.yz ) );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Q1=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,tm=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,em=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,nm=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	#ifdef USE_REVERSED_DEPTH_BUFFER
		float fragCoordZ = vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ];
	#else
		float fragCoordZ = 0.5 * vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ] + 0.5;
	#endif
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,im=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,rm=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main () {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = packDepthToRGBA( dist );
}`,sm=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,am=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,om=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,cm=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,lm=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,hm=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,um=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,fm=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,dm=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,pm=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,mm=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,gm=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <packing>
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( packNormalToRGB( normal ), diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,vm=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,_m=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,xm=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,Mm=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
		float sheenEnergyComp = 1.0 - 0.157 * max3( material.sheenColor );
		outgoingLight = outgoingLight * sheenEnergyComp + sheenSpecularDirect + sheenSpecularIndirect;
	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Sm=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,ym=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,bm=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,Em=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,wm=`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Tm=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <packing>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,Am=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,Rm=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,Qt={alphahash_fragment:Jp,alphahash_pars_fragment:Kp,alphamap_fragment:jp,alphamap_pars_fragment:Qp,alphatest_fragment:t0,alphatest_pars_fragment:e0,aomap_fragment:n0,aomap_pars_fragment:i0,batching_pars_vertex:r0,batching_vertex:s0,begin_vertex:a0,beginnormal_vertex:o0,bsdfs:c0,iridescence_fragment:l0,bumpmap_pars_fragment:h0,clipping_planes_fragment:u0,clipping_planes_pars_fragment:f0,clipping_planes_pars_vertex:d0,clipping_planes_vertex:p0,color_fragment:m0,color_pars_fragment:g0,color_pars_vertex:v0,color_vertex:_0,common:x0,cube_uv_reflection_fragment:M0,defaultnormal_vertex:S0,displacementmap_pars_vertex:y0,displacementmap_vertex:b0,emissivemap_fragment:E0,emissivemap_pars_fragment:w0,colorspace_fragment:T0,colorspace_pars_fragment:A0,envmap_fragment:R0,envmap_common_pars_fragment:C0,envmap_pars_fragment:L0,envmap_pars_vertex:P0,envmap_physical_pars_fragment:V0,envmap_vertex:D0,fog_vertex:I0,fog_pars_vertex:U0,fog_fragment:N0,fog_pars_fragment:F0,gradientmap_pars_fragment:O0,lightmap_pars_fragment:B0,lights_lambert_fragment:k0,lights_lambert_pars_fragment:z0,lights_pars_begin:H0,lights_toon_fragment:G0,lights_toon_pars_fragment:W0,lights_phong_fragment:X0,lights_phong_pars_fragment:q0,lights_physical_fragment:Y0,lights_physical_pars_fragment:$0,lights_fragment_begin:Z0,lights_fragment_maps:J0,lights_fragment_end:K0,logdepthbuf_fragment:j0,logdepthbuf_pars_fragment:Q0,logdepthbuf_pars_vertex:t1,logdepthbuf_vertex:e1,map_fragment:n1,map_pars_fragment:i1,map_particle_fragment:r1,map_particle_pars_fragment:s1,metalnessmap_fragment:a1,metalnessmap_pars_fragment:o1,morphinstance_vertex:c1,morphcolor_vertex:l1,morphnormal_vertex:h1,morphtarget_pars_vertex:u1,morphtarget_vertex:f1,normal_fragment_begin:d1,normal_fragment_maps:p1,normal_pars_fragment:m1,normal_pars_vertex:g1,normal_vertex:v1,normalmap_pars_fragment:_1,clearcoat_normal_fragment_begin:x1,clearcoat_normal_fragment_maps:M1,clearcoat_pars_fragment:S1,iridescence_pars_fragment:y1,opaque_fragment:b1,packing:E1,premultiplied_alpha_fragment:w1,project_vertex:T1,dithering_fragment:A1,dithering_pars_fragment:R1,roughnessmap_fragment:C1,roughnessmap_pars_fragment:L1,shadowmap_pars_fragment:P1,shadowmap_pars_vertex:D1,shadowmap_vertex:I1,shadowmask_pars_fragment:U1,skinbase_vertex:N1,skinning_pars_vertex:F1,skinning_vertex:O1,skinnormal_vertex:B1,specularmap_fragment:k1,specularmap_pars_fragment:z1,tonemapping_fragment:H1,tonemapping_pars_fragment:V1,transmission_fragment:G1,transmission_pars_fragment:W1,uv_pars_fragment:X1,uv_pars_vertex:q1,uv_vertex:Y1,worldpos_vertex:$1,background_vert:Z1,background_frag:J1,backgroundCube_vert:K1,backgroundCube_frag:j1,cube_vert:Q1,cube_frag:tm,depth_vert:em,depth_frag:nm,distanceRGBA_vert:im,distanceRGBA_frag:rm,equirect_vert:sm,equirect_frag:am,linedashed_vert:om,linedashed_frag:cm,meshbasic_vert:lm,meshbasic_frag:hm,meshlambert_vert:um,meshlambert_frag:fm,meshmatcap_vert:dm,meshmatcap_frag:pm,meshnormal_vert:mm,meshnormal_frag:gm,meshphong_vert:vm,meshphong_frag:_m,meshphysical_vert:xm,meshphysical_frag:Mm,meshtoon_vert:Sm,meshtoon_frag:ym,points_vert:bm,points_frag:Em,shadow_vert:wm,shadow_frag:Tm,sprite_vert:Am,sprite_frag:Rm},wt={common:{diffuse:{value:new Gt(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new jt},alphaMap:{value:null},alphaMapTransform:{value:new jt},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new jt}},envmap:{envMap:{value:null},envMapRotation:{value:new jt},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new jt}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new jt}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new jt},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new jt},normalScale:{value:new St(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new jt},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new jt}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new jt}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new jt}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Gt(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new Gt(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new jt},alphaTest:{value:0},uvTransform:{value:new jt}},sprite:{diffuse:{value:new Gt(16777215)},opacity:{value:1},center:{value:new St(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new jt},alphaMap:{value:null},alphaMapTransform:{value:new jt},alphaTest:{value:0}}},An={basic:{uniforms:We([wt.common,wt.specularmap,wt.envmap,wt.aomap,wt.lightmap,wt.fog]),vertexShader:Qt.meshbasic_vert,fragmentShader:Qt.meshbasic_frag},lambert:{uniforms:We([wt.common,wt.specularmap,wt.envmap,wt.aomap,wt.lightmap,wt.emissivemap,wt.bumpmap,wt.normalmap,wt.displacementmap,wt.fog,wt.lights,{emissive:{value:new Gt(0)}}]),vertexShader:Qt.meshlambert_vert,fragmentShader:Qt.meshlambert_frag},phong:{uniforms:We([wt.common,wt.specularmap,wt.envmap,wt.aomap,wt.lightmap,wt.emissivemap,wt.bumpmap,wt.normalmap,wt.displacementmap,wt.fog,wt.lights,{emissive:{value:new Gt(0)},specular:{value:new Gt(1118481)},shininess:{value:30}}]),vertexShader:Qt.meshphong_vert,fragmentShader:Qt.meshphong_frag},standard:{uniforms:We([wt.common,wt.envmap,wt.aomap,wt.lightmap,wt.emissivemap,wt.bumpmap,wt.normalmap,wt.displacementmap,wt.roughnessmap,wt.metalnessmap,wt.fog,wt.lights,{emissive:{value:new Gt(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Qt.meshphysical_vert,fragmentShader:Qt.meshphysical_frag},toon:{uniforms:We([wt.common,wt.aomap,wt.lightmap,wt.emissivemap,wt.bumpmap,wt.normalmap,wt.displacementmap,wt.gradientmap,wt.fog,wt.lights,{emissive:{value:new Gt(0)}}]),vertexShader:Qt.meshtoon_vert,fragmentShader:Qt.meshtoon_frag},matcap:{uniforms:We([wt.common,wt.bumpmap,wt.normalmap,wt.displacementmap,wt.fog,{matcap:{value:null}}]),vertexShader:Qt.meshmatcap_vert,fragmentShader:Qt.meshmatcap_frag},points:{uniforms:We([wt.points,wt.fog]),vertexShader:Qt.points_vert,fragmentShader:Qt.points_frag},dashed:{uniforms:We([wt.common,wt.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Qt.linedashed_vert,fragmentShader:Qt.linedashed_frag},depth:{uniforms:We([wt.common,wt.displacementmap]),vertexShader:Qt.depth_vert,fragmentShader:Qt.depth_frag},normal:{uniforms:We([wt.common,wt.bumpmap,wt.normalmap,wt.displacementmap,{opacity:{value:1}}]),vertexShader:Qt.meshnormal_vert,fragmentShader:Qt.meshnormal_frag},sprite:{uniforms:We([wt.sprite,wt.fog]),vertexShader:Qt.sprite_vert,fragmentShader:Qt.sprite_frag},background:{uniforms:{uvTransform:{value:new jt},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Qt.background_vert,fragmentShader:Qt.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new jt}},vertexShader:Qt.backgroundCube_vert,fragmentShader:Qt.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Qt.cube_vert,fragmentShader:Qt.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Qt.equirect_vert,fragmentShader:Qt.equirect_frag},distanceRGBA:{uniforms:We([wt.common,wt.displacementmap,{referencePosition:{value:new O},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Qt.distanceRGBA_vert,fragmentShader:Qt.distanceRGBA_frag},shadow:{uniforms:We([wt.lights,wt.fog,{color:{value:new Gt(0)},opacity:{value:1}}]),vertexShader:Qt.shadow_vert,fragmentShader:Qt.shadow_frag}};An.physical={uniforms:We([An.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new jt},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new jt},clearcoatNormalScale:{value:new St(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new jt},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new jt},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new jt},sheen:{value:0},sheenColor:{value:new Gt(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new jt},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new jt},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new jt},transmissionSamplerSize:{value:new St},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new jt},attenuationDistance:{value:0},attenuationColor:{value:new Gt(0)},specularColor:{value:new Gt(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new jt},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new jt},anisotropyVector:{value:new St},anisotropyMap:{value:null},anisotropyMapTransform:{value:new jt}}]),vertexShader:Qt.meshphysical_vert,fragmentShader:Qt.meshphysical_frag};const Hs={r:0,b:0,g:0},bi=new mn,Cm=new ie;function Lm(i,t,e,n,r,s,a){const o=new Gt(0);let c=s===!0?0:1,l,h,u=null,d=0,f=null;function m(y){let M=y.isScene===!0?y.background:null;return M&&M.isTexture&&(M=(y.backgroundBlurriness>0?e:t).get(M)),M}function x(y){let M=!1;const T=m(y);T===null?p(o,c):T&&T.isColor&&(p(T,1),M=!0);const E=i.xr.getEnvironmentBlendMode();E==="additive"?n.buffers.color.setClear(0,0,0,1,a):E==="alpha-blend"&&n.buffers.color.setClear(0,0,0,0,a),(i.autoClear||M)&&(n.buffers.depth.setTest(!0),n.buffers.depth.setMask(!0),n.buffers.color.setMask(!0),i.clear(i.autoClearColor,i.autoClearDepth,i.autoClearStencil))}function g(y,M){const T=m(M);T&&(T.isCubeTexture||T.mapping===da)?(h===void 0&&(h=new Xt(new qe(1,1,1),new Jn({name:"BackgroundCubeMaterial",uniforms:yr(An.backgroundCube.uniforms),vertexShader:An.backgroundCube.vertexShader,fragmentShader:An.backgroundCube.fragmentShader,side:Ke,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),h.geometry.deleteAttribute("normal"),h.geometry.deleteAttribute("uv"),h.onBeforeRender=function(E,A,C){this.matrixWorld.copyPosition(C.matrixWorld)},Object.defineProperty(h.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),r.update(h)),bi.copy(M.backgroundRotation),bi.x*=-1,bi.y*=-1,bi.z*=-1,T.isCubeTexture&&T.isRenderTargetTexture===!1&&(bi.y*=-1,bi.z*=-1),h.material.uniforms.envMap.value=T,h.material.uniforms.flipEnvMap.value=T.isCubeTexture&&T.isRenderTargetTexture===!1?-1:1,h.material.uniforms.backgroundBlurriness.value=M.backgroundBlurriness,h.material.uniforms.backgroundIntensity.value=M.backgroundIntensity,h.material.uniforms.backgroundRotation.value.setFromMatrix4(Cm.makeRotationFromEuler(bi)),h.material.toneMapped=se.getTransfer(T.colorSpace)!==he,(u!==T||d!==T.version||f!==i.toneMapping)&&(h.material.needsUpdate=!0,u=T,d=T.version,f=i.toneMapping),h.layers.enableAll(),y.unshift(h,h.geometry,h.material,0,0,null)):T&&T.isTexture&&(l===void 0&&(l=new Xt(new us(2,2),new Jn({name:"BackgroundMaterial",uniforms:yr(An.background.uniforms),vertexShader:An.background.vertexShader,fragmentShader:An.background.fragmentShader,side:pi,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),l.geometry.deleteAttribute("normal"),Object.defineProperty(l.material,"map",{get:function(){return this.uniforms.t2D.value}}),r.update(l)),l.material.uniforms.t2D.value=T,l.material.uniforms.backgroundIntensity.value=M.backgroundIntensity,l.material.toneMapped=se.getTransfer(T.colorSpace)!==he,T.matrixAutoUpdate===!0&&T.updateMatrix(),l.material.uniforms.uvTransform.value.copy(T.matrix),(u!==T||d!==T.version||f!==i.toneMapping)&&(l.material.needsUpdate=!0,u=T,d=T.version,f=i.toneMapping),l.layers.enableAll(),y.unshift(l,l.geometry,l.material,0,0,null))}function p(y,M){y.getRGB(Hs,tu(i)),n.buffers.color.setClear(Hs.r,Hs.g,Hs.b,M,a)}function w(){h!==void 0&&(h.geometry.dispose(),h.material.dispose(),h=void 0),l!==void 0&&(l.geometry.dispose(),l.material.dispose(),l=void 0)}return{getClearColor:function(){return o},setClearColor:function(y,M=1){o.set(y),c=M,p(o,c)},getClearAlpha:function(){return c},setClearAlpha:function(y){c=y,p(o,c)},render:x,addToRenderList:g,dispose:w}}function Pm(i,t){const e=i.getParameter(i.MAX_VERTEX_ATTRIBS),n={},r=d(null);let s=r,a=!1;function o(_,S,b,D,U){let N=!1;const H=u(D,b,S);s!==H&&(s=H,l(s.object)),N=f(_,D,b,U),N&&m(_,D,b,U),U!==null&&t.update(U,i.ELEMENT_ARRAY_BUFFER),(N||a)&&(a=!1,M(_,S,b,D),U!==null&&i.bindBuffer(i.ELEMENT_ARRAY_BUFFER,t.get(U).buffer))}function c(){return i.createVertexArray()}function l(_){return i.bindVertexArray(_)}function h(_){return i.deleteVertexArray(_)}function u(_,S,b){const D=b.wireframe===!0;let U=n[_.id];U===void 0&&(U={},n[_.id]=U);let N=U[S.id];N===void 0&&(N={},U[S.id]=N);let H=N[D];return H===void 0&&(H=d(c()),N[D]=H),H}function d(_){const S=[],b=[],D=[];for(let U=0;U<e;U++)S[U]=0,b[U]=0,D[U]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:S,enabledAttributes:b,attributeDivisors:D,object:_,attributes:{},index:null}}function f(_,S,b,D){const U=s.attributes,N=S.attributes;let H=0;const Z=b.getAttributes();for(const V in Z)if(Z[V].location>=0){const ht=U[V];let dt=N[V];if(dt===void 0&&(V==="instanceMatrix"&&_.instanceMatrix&&(dt=_.instanceMatrix),V==="instanceColor"&&_.instanceColor&&(dt=_.instanceColor)),ht===void 0||ht.attribute!==dt||dt&&ht.data!==dt.data)return!0;H++}return s.attributesNum!==H||s.index!==D}function m(_,S,b,D){const U={},N=S.attributes;let H=0;const Z=b.getAttributes();for(const V in Z)if(Z[V].location>=0){let ht=N[V];ht===void 0&&(V==="instanceMatrix"&&_.instanceMatrix&&(ht=_.instanceMatrix),V==="instanceColor"&&_.instanceColor&&(ht=_.instanceColor));const dt={};dt.attribute=ht,ht&&ht.data&&(dt.data=ht.data),U[V]=dt,H++}s.attributes=U,s.attributesNum=H,s.index=D}function x(){const _=s.newAttributes;for(let S=0,b=_.length;S<b;S++)_[S]=0}function g(_){p(_,0)}function p(_,S){const b=s.newAttributes,D=s.enabledAttributes,U=s.attributeDivisors;b[_]=1,D[_]===0&&(i.enableVertexAttribArray(_),D[_]=1),U[_]!==S&&(i.vertexAttribDivisor(_,S),U[_]=S)}function w(){const _=s.newAttributes,S=s.enabledAttributes;for(let b=0,D=S.length;b<D;b++)S[b]!==_[b]&&(i.disableVertexAttribArray(b),S[b]=0)}function y(_,S,b,D,U,N,H){H===!0?i.vertexAttribIPointer(_,S,b,U,N):i.vertexAttribPointer(_,S,b,D,U,N)}function M(_,S,b,D){x();const U=D.attributes,N=b.getAttributes(),H=S.defaultAttributeValues;for(const Z in N){const V=N[Z];if(V.location>=0){let rt=U[Z];if(rt===void 0&&(Z==="instanceMatrix"&&_.instanceMatrix&&(rt=_.instanceMatrix),Z==="instanceColor"&&_.instanceColor&&(rt=_.instanceColor)),rt!==void 0){const ht=rt.normalized,dt=rt.itemSize,mt=t.get(rt);if(mt===void 0)continue;const Et=mt.buffer,Ft=mt.type,zt=mt.bytesPerElement,et=Ft===i.INT||Ft===i.UNSIGNED_INT||rt.gpuType===cc;if(rt.isInterleavedBufferAttribute){const lt=rt.data,F=lt.stride,k=rt.offset;if(lt.isInstancedInterleavedBuffer){for(let B=0;B<V.locationSize;B++)p(V.location+B,lt.meshPerAttribute);_.isInstancedMesh!==!0&&D._maxInstanceCount===void 0&&(D._maxInstanceCount=lt.meshPerAttribute*lt.count)}else for(let B=0;B<V.locationSize;B++)g(V.location+B);i.bindBuffer(i.ARRAY_BUFFER,Et);for(let B=0;B<V.locationSize;B++)y(V.location+B,dt/V.locationSize,Ft,ht,F*zt,(k+dt/V.locationSize*B)*zt,et)}else{if(rt.isInstancedBufferAttribute){for(let lt=0;lt<V.locationSize;lt++)p(V.location+lt,rt.meshPerAttribute);_.isInstancedMesh!==!0&&D._maxInstanceCount===void 0&&(D._maxInstanceCount=rt.meshPerAttribute*rt.count)}else for(let lt=0;lt<V.locationSize;lt++)g(V.location+lt);i.bindBuffer(i.ARRAY_BUFFER,Et);for(let lt=0;lt<V.locationSize;lt++)y(V.location+lt,dt/V.locationSize,Ft,ht,dt*zt,dt/V.locationSize*lt*zt,et)}}else if(H!==void 0){const ht=H[Z];if(ht!==void 0)switch(ht.length){case 2:i.vertexAttrib2fv(V.location,ht);break;case 3:i.vertexAttrib3fv(V.location,ht);break;case 4:i.vertexAttrib4fv(V.location,ht);break;default:i.vertexAttrib1fv(V.location,ht)}}}}w()}function T(){C();for(const _ in n){const S=n[_];for(const b in S){const D=S[b];for(const U in D)h(D[U].object),delete D[U];delete S[b]}delete n[_]}}function E(_){if(n[_.id]===void 0)return;const S=n[_.id];for(const b in S){const D=S[b];for(const U in D)h(D[U].object),delete D[U];delete S[b]}delete n[_.id]}function A(_){for(const S in n){const b=n[S];if(b[_.id]===void 0)continue;const D=b[_.id];for(const U in D)h(D[U].object),delete D[U];delete b[_.id]}}function C(){v(),a=!0,s!==r&&(s=r,l(s.object))}function v(){r.geometry=null,r.program=null,r.wireframe=!1}return{setup:o,reset:C,resetDefaultState:v,dispose:T,releaseStatesOfGeometry:E,releaseStatesOfProgram:A,initAttributes:x,enableAttribute:g,disableUnusedAttributes:w}}function Dm(i,t,e){let n;function r(l){n=l}function s(l,h){i.drawArrays(n,l,h),e.update(h,n,1)}function a(l,h,u){u!==0&&(i.drawArraysInstanced(n,l,h,u),e.update(h,n,u))}function o(l,h,u){if(u===0)return;t.get("WEBGL_multi_draw").multiDrawArraysWEBGL(n,l,0,h,0,u);let f=0;for(let m=0;m<u;m++)f+=h[m];e.update(f,n,1)}function c(l,h,u,d){if(u===0)return;const f=t.get("WEBGL_multi_draw");if(f===null)for(let m=0;m<l.length;m++)a(l[m],h[m],d[m]);else{f.multiDrawArraysInstancedWEBGL(n,l,0,h,0,d,0,u);let m=0;for(let x=0;x<u;x++)m+=h[x]*d[x];e.update(m,n,1)}}this.setMode=r,this.render=s,this.renderInstances=a,this.renderMultiDraw=o,this.renderMultiDrawInstances=c}function Im(i,t,e,n){let r;function s(){if(r!==void 0)return r;if(t.has("EXT_texture_filter_anisotropic")===!0){const A=t.get("EXT_texture_filter_anisotropic");r=i.getParameter(A.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else r=0;return r}function a(A){return!(A!==rn&&n.convert(A)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_FORMAT))}function o(A){const C=A===wr&&(t.has("EXT_color_buffer_half_float")||t.has("EXT_color_buffer_float"));return!(A!==Dn&&n.convert(A)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_TYPE)&&A!==Cn&&!C)}function c(A){if(A==="highp"){if(i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.HIGH_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.HIGH_FLOAT).precision>0)return"highp";A="mediump"}return A==="mediump"&&i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.MEDIUM_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let l=e.precision!==void 0?e.precision:"highp";const h=c(l);h!==l&&(console.warn("THREE.WebGLRenderer:",l,"not supported, using",h,"instead."),l=h);const u=e.logarithmicDepthBuffer===!0,d=e.reversedDepthBuffer===!0&&t.has("EXT_clip_control"),f=i.getParameter(i.MAX_TEXTURE_IMAGE_UNITS),m=i.getParameter(i.MAX_VERTEX_TEXTURE_IMAGE_UNITS),x=i.getParameter(i.MAX_TEXTURE_SIZE),g=i.getParameter(i.MAX_CUBE_MAP_TEXTURE_SIZE),p=i.getParameter(i.MAX_VERTEX_ATTRIBS),w=i.getParameter(i.MAX_VERTEX_UNIFORM_VECTORS),y=i.getParameter(i.MAX_VARYING_VECTORS),M=i.getParameter(i.MAX_FRAGMENT_UNIFORM_VECTORS),T=m>0,E=i.getParameter(i.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:s,getMaxPrecision:c,textureFormatReadable:a,textureTypeReadable:o,precision:l,logarithmicDepthBuffer:u,reversedDepthBuffer:d,maxTextures:f,maxVertexTextures:m,maxTextureSize:x,maxCubemapSize:g,maxAttributes:p,maxVertexUniforms:w,maxVaryings:y,maxFragmentUniforms:M,vertexTextures:T,maxSamples:E}}function Um(i){const t=this;let e=null,n=0,r=!1,s=!1;const a=new wi,o=new jt,c={value:null,needsUpdate:!1};this.uniform=c,this.numPlanes=0,this.numIntersection=0,this.init=function(u,d){const f=u.length!==0||d||n!==0||r;return r=d,n=u.length,f},this.beginShadows=function(){s=!0,h(null)},this.endShadows=function(){s=!1},this.setGlobalState=function(u,d){e=h(u,d,0)},this.setState=function(u,d,f){const m=u.clippingPlanes,x=u.clipIntersection,g=u.clipShadows,p=i.get(u);if(!r||m===null||m.length===0||s&&!g)s?h(null):l();else{const w=s?0:n,y=w*4;let M=p.clippingState||null;c.value=M,M=h(m,d,y,f);for(let T=0;T!==y;++T)M[T]=e[T];p.clippingState=M,this.numIntersection=x?this.numPlanes:0,this.numPlanes+=w}};function l(){c.value!==e&&(c.value=e,c.needsUpdate=n>0),t.numPlanes=n,t.numIntersection=0}function h(u,d,f,m){const x=u!==null?u.length:0;let g=null;if(x!==0){if(g=c.value,m!==!0||g===null){const p=f+x*4,w=d.matrixWorldInverse;o.getNormalMatrix(w),(g===null||g.length<p)&&(g=new Float32Array(p));for(let y=0,M=f;y!==x;++y,M+=4)a.copy(u[y]).applyMatrix4(w,o),a.normal.toArray(g,M),g[M+3]=a.constant}c.value=g,c.needsUpdate=!0}return t.numPlanes=x,t.numIntersection=0,g}}function Nm(i){let t=new WeakMap;function e(a,o){return o===aa?a.mapping=Mr:o===So&&(a.mapping=Sr),a}function n(a){if(a&&a.isTexture){const o=a.mapping;if(o===aa||o===So)if(t.has(a)){const c=t.get(a).texture;return e(c,a.mapping)}else{const c=a.image;if(c&&c.height>0){const l=new ep(c.height);return l.fromEquirectangularTexture(i,a),t.set(a,l),a.addEventListener("dispose",r),e(l.texture,a.mapping)}else return null}}return a}function r(a){const o=a.target;o.removeEventListener("dispose",r);const c=t.get(o);c!==void 0&&(t.delete(o),c.dispose())}function s(){t=new WeakMap}return{get:n,dispose:s}}const dr=4,Dl=[.125,.215,.35,.446,.526,.582],Ri=20,Za=new xu,Il=new Gt;let Ja=null,Ka=0,ja=0,Qa=!1;const Ti=(1+Math.sqrt(5))/2,sr=1/Ti,Ul=[new O(-Ti,sr,0),new O(Ti,sr,0),new O(-sr,0,Ti),new O(sr,0,Ti),new O(0,Ti,-sr),new O(0,Ti,sr),new O(-1,1,-1),new O(1,1,-1),new O(-1,1,1),new O(1,1,1)],Fm=new O;class Qo{constructor(t){this._renderer=t,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(t,e=0,n=.1,r=100,s={}){const{size:a=256,position:o=Fm}=s;Ja=this._renderer.getRenderTarget(),Ka=this._renderer.getActiveCubeFace(),ja=this._renderer.getActiveMipmapLevel(),Qa=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(a);const c=this._allocateTargets();return c.depthBuffer=!0,this._sceneToCubeUV(t,n,r,c,o),e>0&&this._blur(c,0,0,e),this._applyPMREM(c),this._cleanup(c),c}fromEquirectangular(t,e=null){return this._fromTexture(t,e)}fromCubemap(t,e=null){return this._fromTexture(t,e)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Ol(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Fl(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(t){this._lodMax=Math.floor(Math.log2(t)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let t=0;t<this._lodPlanes.length;t++)this._lodPlanes[t].dispose()}_cleanup(t){this._renderer.setRenderTarget(Ja,Ka,ja),this._renderer.xr.enabled=Qa,t.scissorTest=!1,Vs(t,0,0,t.width,t.height)}_fromTexture(t,e){t.mapping===Mr||t.mapping===Sr?this._setSize(t.image.length===0?16:t.image[0].width||t.image[0].image.width):this._setSize(t.image.width/4),Ja=this._renderer.getRenderTarget(),Ka=this._renderer.getActiveCubeFace(),ja=this._renderer.getActiveMipmapLevel(),Qa=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const n=e||this._allocateTargets();return this._textureToCubeUV(t,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){const t=3*Math.max(this._cubeSize,112),e=4*this._cubeSize,n={magFilter:He,minFilter:He,generateMipmaps:!1,type:wr,format:rn,colorSpace:ki,depthBuffer:!1},r=Nl(t,e,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==t||this._pingPongRenderTarget.height!==e){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=Nl(t,e,n);const{_lodMax:s}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=Om(s)),this._blurMaterial=Bm(s,t,e)}return r}_compileMaterial(t){const e=new Xt(this._lodPlanes[0],t);this._renderer.compile(e,Za)}_sceneToCubeUV(t,e,n,r,s){const c=new pn(90,1,e,n),l=[1,-1,1,1,1,1],h=[1,1,1,-1,-1,-1],u=this._renderer,d=u.autoClear,f=u.toneMapping;u.getClearColor(Il),u.toneMapping=ui,u.autoClear=!1,u.state.buffers.depth.getReversed()&&(u.setRenderTarget(r),u.clearDepth(),u.setRenderTarget(null));const x=new pa({name:"PMREM.Background",side:Ke,depthWrite:!1,depthTest:!1}),g=new Xt(new qe,x);let p=!1;const w=t.background;w?w.isColor&&(x.color.copy(w),t.background=null,p=!0):(x.color.copy(Il),p=!0);for(let y=0;y<6;y++){const M=y%3;M===0?(c.up.set(0,l[y],0),c.position.set(s.x,s.y,s.z),c.lookAt(s.x+h[y],s.y,s.z)):M===1?(c.up.set(0,0,l[y]),c.position.set(s.x,s.y,s.z),c.lookAt(s.x,s.y+h[y],s.z)):(c.up.set(0,l[y],0),c.position.set(s.x,s.y,s.z),c.lookAt(s.x,s.y,s.z+h[y]));const T=this._cubeSize;Vs(r,M*T,y>2?T:0,T,T),u.setRenderTarget(r),p&&u.render(g,c),u.render(t,c)}g.geometry.dispose(),g.material.dispose(),u.toneMapping=f,u.autoClear=d,t.background=w}_textureToCubeUV(t,e){const n=this._renderer,r=t.mapping===Mr||t.mapping===Sr;r?(this._cubemapMaterial===null&&(this._cubemapMaterial=Ol()),this._cubemapMaterial.uniforms.flipEnvMap.value=t.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=Fl());const s=r?this._cubemapMaterial:this._equirectMaterial,a=new Xt(this._lodPlanes[0],s),o=s.uniforms;o.envMap.value=t;const c=this._cubeSize;Vs(e,0,0,3*c,2*c),n.setRenderTarget(e),n.render(a,Za)}_applyPMREM(t){const e=this._renderer,n=e.autoClear;e.autoClear=!1;const r=this._lodPlanes.length;for(let s=1;s<r;s++){const a=Math.sqrt(this._sigmas[s]*this._sigmas[s]-this._sigmas[s-1]*this._sigmas[s-1]),o=Ul[(r-s-1)%Ul.length];this._blur(t,s-1,s,a,o)}e.autoClear=n}_blur(t,e,n,r,s){const a=this._pingPongRenderTarget;this._halfBlur(t,a,e,n,r,"latitudinal",s),this._halfBlur(a,t,n,n,r,"longitudinal",s)}_halfBlur(t,e,n,r,s,a,o){const c=this._renderer,l=this._blurMaterial;a!=="latitudinal"&&a!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const h=3,u=new Xt(this._lodPlanes[r],l),d=l.uniforms,f=this._sizeLods[n]-1,m=isFinite(s)?Math.PI/(2*f):2*Math.PI/(2*Ri-1),x=s/m,g=isFinite(s)?1+Math.floor(h*x):Ri;g>Ri&&console.warn(`sigmaRadians, ${s}, is too large and will clip, as it requested ${g} samples when the maximum is set to ${Ri}`);const p=[];let w=0;for(let A=0;A<Ri;++A){const C=A/x,v=Math.exp(-C*C/2);p.push(v),A===0?w+=v:A<g&&(w+=2*v)}for(let A=0;A<p.length;A++)p[A]=p[A]/w;d.envMap.value=t.texture,d.samples.value=g,d.weights.value=p,d.latitudinal.value=a==="latitudinal",o&&(d.poleAxis.value=o);const{_lodMax:y}=this;d.dTheta.value=m,d.mipInt.value=y-n;const M=this._sizeLods[r],T=3*M*(r>y-dr?r-y+dr:0),E=4*(this._cubeSize-M);Vs(e,T,E,3*M,2*M),c.setRenderTarget(e),c.render(u,Za)}}function Om(i){const t=[],e=[],n=[];let r=i;const s=i-dr+1+Dl.length;for(let a=0;a<s;a++){const o=Math.pow(2,r);e.push(o);let c=1/o;a>i-dr?c=Dl[a-i+dr-1]:a===0&&(c=0),n.push(c);const l=1/(o-2),h=-l,u=1+l,d=[h,h,u,h,u,u,h,h,u,u,h,u],f=6,m=6,x=3,g=2,p=1,w=new Float32Array(x*m*f),y=new Float32Array(g*m*f),M=new Float32Array(p*m*f);for(let E=0;E<f;E++){const A=E%3*2/3-1,C=E>2?0:-1,v=[A,C,0,A+2/3,C,0,A+2/3,C+1,0,A,C,0,A+2/3,C+1,0,A,C+1,0];w.set(v,x*m*E),y.set(d,g*m*E);const _=[E,E,E,E,E,E];M.set(_,p*m*E)}const T=new De;T.setAttribute("position",new oe(w,x)),T.setAttribute("uv",new oe(y,g)),T.setAttribute("faceIndex",new oe(M,p)),t.push(T),r>dr&&r--}return{lodPlanes:t,sizeLods:e,sigmas:n}}function Nl(i,t,e){const n=new zi(i,t,e);return n.texture.mapping=da,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function Vs(i,t,e,n,r){i.viewport.set(t,e,n,r),i.scissor.set(t,e,n,r)}function Bm(i,t,e){const n=new Float32Array(Ri),r=new O(0,1,0);return new Jn({name:"SphericalGaussianBlur",defines:{n:Ri,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/e,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:n},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:r}},vertexShader:yc(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform int samples;
			uniform float weights[ n ];
			uniform bool latitudinal;
			uniform float dTheta;
			uniform float mipInt;
			uniform vec3 poleAxis;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			vec3 getSample( float theta, vec3 axis ) {

				float cosTheta = cos( theta );
				// Rodrigues' axis-angle rotation
				vec3 sampleDirection = vOutputDirection * cosTheta
					+ cross( axis, vOutputDirection ) * sin( theta )
					+ axis * dot( axis, vOutputDirection ) * ( 1.0 - cosTheta );

				return bilinearCubeUV( envMap, sampleDirection, mipInt );

			}

			void main() {

				vec3 axis = latitudinal ? poleAxis : cross( poleAxis, vOutputDirection );

				if ( all( equal( axis, vec3( 0.0 ) ) ) ) {

					axis = vec3( vOutputDirection.z, 0.0, - vOutputDirection.x );

				}

				axis = normalize( axis );

				gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
				gl_FragColor.rgb += weights[ 0 ] * getSample( 0.0, axis );

				for ( int i = 1; i < n; i++ ) {

					if ( i >= samples ) {

						break;

					}

					float theta = dTheta * float( i );
					gl_FragColor.rgb += weights[ i ] * getSample( -1.0 * theta, axis );
					gl_FragColor.rgb += weights[ i ] * getSample( theta, axis );

				}

			}
		`,blending:hi,depthTest:!1,depthWrite:!1})}function Fl(){return new Jn({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:yc(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:hi,depthTest:!1,depthWrite:!1})}function Ol(){return new Jn({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:yc(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:hi,depthTest:!1,depthWrite:!1})}function yc(){return`

		precision mediump float;
		precision mediump int;

		attribute float faceIndex;

		varying vec3 vOutputDirection;

		// RH coordinate system; PMREM face-indexing convention
		vec3 getDirection( vec2 uv, float face ) {

			uv = 2.0 * uv - 1.0;

			vec3 direction = vec3( uv, 1.0 );

			if ( face == 0.0 ) {

				direction = direction.zyx; // ( 1, v, u ) pos x

			} else if ( face == 1.0 ) {

				direction = direction.xzy;
				direction.xz *= -1.0; // ( -u, 1, -v ) pos y

			} else if ( face == 2.0 ) {

				direction.x *= -1.0; // ( -u, v, 1 ) pos z

			} else if ( face == 3.0 ) {

				direction = direction.zyx;
				direction.xz *= -1.0; // ( -1, v, -u ) neg x

			} else if ( face == 4.0 ) {

				direction = direction.xzy;
				direction.xy *= -1.0; // ( -u, -1, v ) neg y

			} else if ( face == 5.0 ) {

				direction.z *= -1.0; // ( u, v, -1 ) neg z

			}

			return direction;

		}

		void main() {

			vOutputDirection = getDirection( uv, faceIndex );
			gl_Position = vec4( position, 1.0 );

		}
	`}function km(i){let t=new WeakMap,e=null;function n(o){if(o&&o.isTexture){const c=o.mapping,l=c===aa||c===So,h=c===Mr||c===Sr;if(l||h){let u=t.get(o);const d=u!==void 0?u.texture.pmremVersion:0;if(o.isRenderTargetTexture&&o.pmremVersion!==d)return e===null&&(e=new Qo(i)),u=l?e.fromEquirectangular(o,u):e.fromCubemap(o,u),u.texture.pmremVersion=o.pmremVersion,t.set(o,u),u.texture;if(u!==void 0)return u.texture;{const f=o.image;return l&&f&&f.height>0||h&&f&&r(f)?(e===null&&(e=new Qo(i)),u=l?e.fromEquirectangular(o):e.fromCubemap(o),u.texture.pmremVersion=o.pmremVersion,t.set(o,u),o.addEventListener("dispose",s),u.texture):null}}}return o}function r(o){let c=0;const l=6;for(let h=0;h<l;h++)o[h]!==void 0&&c++;return c===l}function s(o){const c=o.target;c.removeEventListener("dispose",s);const l=t.get(c);l!==void 0&&(t.delete(c),l.dispose())}function a(){t=new WeakMap,e!==null&&(e.dispose(),e=null)}return{get:n,dispose:a}}function zm(i){const t={};function e(n){if(t[n]!==void 0)return t[n];let r;switch(n){case"WEBGL_depth_texture":r=i.getExtension("WEBGL_depth_texture")||i.getExtension("MOZ_WEBGL_depth_texture")||i.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":r=i.getExtension("EXT_texture_filter_anisotropic")||i.getExtension("MOZ_EXT_texture_filter_anisotropic")||i.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":r=i.getExtension("WEBGL_compressed_texture_s3tc")||i.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":r=i.getExtension("WEBGL_compressed_texture_pvrtc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:r=i.getExtension(n)}return t[n]=r,r}return{has:function(n){return e(n)!==null},init:function(){e("EXT_color_buffer_float"),e("WEBGL_clip_cull_distance"),e("OES_texture_float_linear"),e("EXT_color_buffer_half_float"),e("WEBGL_multisampled_render_to_texture"),e("WEBGL_render_shared_exponent")},get:function(n){const r=e(n);return r===null&&is("THREE.WebGLRenderer: "+n+" extension not supported."),r}}}function Hm(i,t,e,n){const r={},s=new WeakMap;function a(u){const d=u.target;d.index!==null&&t.remove(d.index);for(const m in d.attributes)t.remove(d.attributes[m]);d.removeEventListener("dispose",a),delete r[d.id];const f=s.get(d);f&&(t.remove(f),s.delete(d)),n.releaseStatesOfGeometry(d),d.isInstancedBufferGeometry===!0&&delete d._maxInstanceCount,e.memory.geometries--}function o(u,d){return r[d.id]===!0||(d.addEventListener("dispose",a),r[d.id]=!0,e.memory.geometries++),d}function c(u){const d=u.attributes;for(const f in d)t.update(d[f],i.ARRAY_BUFFER)}function l(u){const d=[],f=u.index,m=u.attributes.position;let x=0;if(f!==null){const w=f.array;x=f.version;for(let y=0,M=w.length;y<M;y+=3){const T=w[y+0],E=w[y+1],A=w[y+2];d.push(T,E,E,A,A,T)}}else if(m!==void 0){const w=m.array;x=m.version;for(let y=0,M=w.length/3-1;y<M;y+=3){const T=y+0,E=y+1,A=y+2;d.push(T,E,E,A,A,T)}}else return;const g=new(Yh(d)?Qh:jh)(d,1);g.version=x;const p=s.get(u);p&&t.remove(p),s.set(u,g)}function h(u){const d=s.get(u);if(d){const f=u.index;f!==null&&d.version<f.version&&l(u)}else l(u);return s.get(u)}return{get:o,update:c,getWireframeAttribute:h}}function Vm(i,t,e){let n;function r(d){n=d}let s,a;function o(d){s=d.type,a=d.bytesPerElement}function c(d,f){i.drawElements(n,f,s,d*a),e.update(f,n,1)}function l(d,f,m){m!==0&&(i.drawElementsInstanced(n,f,s,d*a,m),e.update(f,n,m))}function h(d,f,m){if(m===0)return;t.get("WEBGL_multi_draw").multiDrawElementsWEBGL(n,f,0,s,d,0,m);let g=0;for(let p=0;p<m;p++)g+=f[p];e.update(g,n,1)}function u(d,f,m,x){if(m===0)return;const g=t.get("WEBGL_multi_draw");if(g===null)for(let p=0;p<d.length;p++)l(d[p]/a,f[p],x[p]);else{g.multiDrawElementsInstancedWEBGL(n,f,0,s,d,0,x,0,m);let p=0;for(let w=0;w<m;w++)p+=f[w]*x[w];e.update(p,n,1)}}this.setMode=r,this.setIndex=o,this.render=c,this.renderInstances=l,this.renderMultiDraw=h,this.renderMultiDrawInstances=u}function Gm(i){const t={geometries:0,textures:0},e={frame:0,calls:0,triangles:0,points:0,lines:0};function n(s,a,o){switch(e.calls++,a){case i.TRIANGLES:e.triangles+=o*(s/3);break;case i.LINES:e.lines+=o*(s/2);break;case i.LINE_STRIP:e.lines+=o*(s-1);break;case i.LINE_LOOP:e.lines+=o*s;break;case i.POINTS:e.points+=o*s;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",a);break}}function r(){e.calls=0,e.triangles=0,e.points=0,e.lines=0}return{memory:t,render:e,programs:null,autoReset:!0,reset:r,update:n}}function Wm(i,t,e){const n=new WeakMap,r=new me;function s(a,o,c){const l=a.morphTargetInfluences,h=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,u=h!==void 0?h.length:0;let d=n.get(o);if(d===void 0||d.count!==u){let v=function(){A.dispose(),n.delete(o),o.removeEventListener("dispose",v)};d!==void 0&&d.texture.dispose();const f=o.morphAttributes.position!==void 0,m=o.morphAttributes.normal!==void 0,x=o.morphAttributes.color!==void 0,g=o.morphAttributes.position||[],p=o.morphAttributes.normal||[],w=o.morphAttributes.color||[];let y=0;f===!0&&(y=1),m===!0&&(y=2),x===!0&&(y=3);let M=o.attributes.position.count*y,T=1;M>t.maxTextureSize&&(T=Math.ceil(M/t.maxTextureSize),M=t.maxTextureSize);const E=new Float32Array(M*T*4*u),A=new $h(E,M,T,u);A.type=Cn,A.needsUpdate=!0;const C=y*4;for(let _=0;_<u;_++){const S=g[_],b=p[_],D=w[_],U=M*T*4*_;for(let N=0;N<S.count;N++){const H=N*C;f===!0&&(r.fromBufferAttribute(S,N),E[U+H+0]=r.x,E[U+H+1]=r.y,E[U+H+2]=r.z,E[U+H+3]=0),m===!0&&(r.fromBufferAttribute(b,N),E[U+H+4]=r.x,E[U+H+5]=r.y,E[U+H+6]=r.z,E[U+H+7]=0),x===!0&&(r.fromBufferAttribute(D,N),E[U+H+8]=r.x,E[U+H+9]=r.y,E[U+H+10]=r.z,E[U+H+11]=D.itemSize===4?r.w:1)}}d={count:u,texture:A,size:new St(M,T)},n.set(o,d),o.addEventListener("dispose",v)}if(a.isInstancedMesh===!0&&a.morphTexture!==null)c.getUniforms().setValue(i,"morphTexture",a.morphTexture,e);else{let f=0;for(let x=0;x<l.length;x++)f+=l[x];const m=o.morphTargetsRelative?1:1-f;c.getUniforms().setValue(i,"morphTargetBaseInfluence",m),c.getUniforms().setValue(i,"morphTargetInfluences",l)}c.getUniforms().setValue(i,"morphTargetsTexture",d.texture,e),c.getUniforms().setValue(i,"morphTargetsTextureSize",d.size)}return{update:s}}function Xm(i,t,e,n){let r=new WeakMap;function s(c){const l=n.render.frame,h=c.geometry,u=t.get(c,h);if(r.get(u)!==l&&(t.update(u),r.set(u,l)),c.isInstancedMesh&&(c.hasEventListener("dispose",o)===!1&&c.addEventListener("dispose",o),r.get(c)!==l&&(e.update(c.instanceMatrix,i.ARRAY_BUFFER),c.instanceColor!==null&&e.update(c.instanceColor,i.ARRAY_BUFFER),r.set(c,l))),c.isSkinnedMesh){const d=c.skeleton;r.get(d)!==l&&(d.update(),r.set(d,l))}return u}function a(){r=new WeakMap}function o(c){const l=c.target;l.removeEventListener("dispose",o),e.remove(l.instanceMatrix),l.instanceColor!==null&&e.remove(l.instanceColor)}return{update:s,dispose:a}}const Su=new Ne,Bl=new au(1,1),yu=new $h,bu=new Nd,Eu=new nu,kl=[],zl=[],Hl=new Float32Array(16),Vl=new Float32Array(9),Gl=new Float32Array(4);function Pr(i,t,e){const n=i[0];if(n<=0||n>0)return i;const r=t*e;let s=kl[r];if(s===void 0&&(s=new Float32Array(r),kl[r]=s),t!==0){n.toArray(s,0);for(let a=1,o=0;a!==t;++a)o+=e,i[a].toArray(s,o)}return s}function Te(i,t){if(i.length!==t.length)return!1;for(let e=0,n=i.length;e<n;e++)if(i[e]!==t[e])return!1;return!0}function Ae(i,t){for(let e=0,n=t.length;e<n;e++)i[e]=t[e]}function ma(i,t){let e=zl[t];e===void 0&&(e=new Int32Array(t),zl[t]=e);for(let n=0;n!==t;++n)e[n]=i.allocateTextureUnit();return e}function qm(i,t){const e=this.cache;e[0]!==t&&(i.uniform1f(this.addr,t),e[0]=t)}function Ym(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2f(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Te(e,t))return;i.uniform2fv(this.addr,t),Ae(e,t)}}function $m(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3f(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else if(t.r!==void 0)(e[0]!==t.r||e[1]!==t.g||e[2]!==t.b)&&(i.uniform3f(this.addr,t.r,t.g,t.b),e[0]=t.r,e[1]=t.g,e[2]=t.b);else{if(Te(e,t))return;i.uniform3fv(this.addr,t),Ae(e,t)}}function Zm(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4f(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Te(e,t))return;i.uniform4fv(this.addr,t),Ae(e,t)}}function Jm(i,t){const e=this.cache,n=t.elements;if(n===void 0){if(Te(e,t))return;i.uniformMatrix2fv(this.addr,!1,t),Ae(e,t)}else{if(Te(e,n))return;Gl.set(n),i.uniformMatrix2fv(this.addr,!1,Gl),Ae(e,n)}}function Km(i,t){const e=this.cache,n=t.elements;if(n===void 0){if(Te(e,t))return;i.uniformMatrix3fv(this.addr,!1,t),Ae(e,t)}else{if(Te(e,n))return;Vl.set(n),i.uniformMatrix3fv(this.addr,!1,Vl),Ae(e,n)}}function jm(i,t){const e=this.cache,n=t.elements;if(n===void 0){if(Te(e,t))return;i.uniformMatrix4fv(this.addr,!1,t),Ae(e,t)}else{if(Te(e,n))return;Hl.set(n),i.uniformMatrix4fv(this.addr,!1,Hl),Ae(e,n)}}function Qm(i,t){const e=this.cache;e[0]!==t&&(i.uniform1i(this.addr,t),e[0]=t)}function tg(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2i(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Te(e,t))return;i.uniform2iv(this.addr,t),Ae(e,t)}}function eg(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3i(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(Te(e,t))return;i.uniform3iv(this.addr,t),Ae(e,t)}}function ng(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4i(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Te(e,t))return;i.uniform4iv(this.addr,t),Ae(e,t)}}function ig(i,t){const e=this.cache;e[0]!==t&&(i.uniform1ui(this.addr,t),e[0]=t)}function rg(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2ui(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Te(e,t))return;i.uniform2uiv(this.addr,t),Ae(e,t)}}function sg(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3ui(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(Te(e,t))return;i.uniform3uiv(this.addr,t),Ae(e,t)}}function ag(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4ui(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Te(e,t))return;i.uniform4uiv(this.addr,t),Ae(e,t)}}function og(i,t,e){const n=this.cache,r=e.allocateTextureUnit();n[0]!==r&&(i.uniform1i(this.addr,r),n[0]=r);let s;this.type===i.SAMPLER_2D_SHADOW?(Bl.compareFunction=qh,s=Bl):s=Su,e.setTexture2D(t||s,r)}function cg(i,t,e){const n=this.cache,r=e.allocateTextureUnit();n[0]!==r&&(i.uniform1i(this.addr,r),n[0]=r),e.setTexture3D(t||bu,r)}function lg(i,t,e){const n=this.cache,r=e.allocateTextureUnit();n[0]!==r&&(i.uniform1i(this.addr,r),n[0]=r),e.setTextureCube(t||Eu,r)}function hg(i,t,e){const n=this.cache,r=e.allocateTextureUnit();n[0]!==r&&(i.uniform1i(this.addr,r),n[0]=r),e.setTexture2DArray(t||yu,r)}function ug(i){switch(i){case 5126:return qm;case 35664:return Ym;case 35665:return $m;case 35666:return Zm;case 35674:return Jm;case 35675:return Km;case 35676:return jm;case 5124:case 35670:return Qm;case 35667:case 35671:return tg;case 35668:case 35672:return eg;case 35669:case 35673:return ng;case 5125:return ig;case 36294:return rg;case 36295:return sg;case 36296:return ag;case 35678:case 36198:case 36298:case 36306:case 35682:return og;case 35679:case 36299:case 36307:return cg;case 35680:case 36300:case 36308:case 36293:return lg;case 36289:case 36303:case 36311:case 36292:return hg}}function fg(i,t){i.uniform1fv(this.addr,t)}function dg(i,t){const e=Pr(t,this.size,2);i.uniform2fv(this.addr,e)}function pg(i,t){const e=Pr(t,this.size,3);i.uniform3fv(this.addr,e)}function mg(i,t){const e=Pr(t,this.size,4);i.uniform4fv(this.addr,e)}function gg(i,t){const e=Pr(t,this.size,4);i.uniformMatrix2fv(this.addr,!1,e)}function vg(i,t){const e=Pr(t,this.size,9);i.uniformMatrix3fv(this.addr,!1,e)}function _g(i,t){const e=Pr(t,this.size,16);i.uniformMatrix4fv(this.addr,!1,e)}function xg(i,t){i.uniform1iv(this.addr,t)}function Mg(i,t){i.uniform2iv(this.addr,t)}function Sg(i,t){i.uniform3iv(this.addr,t)}function yg(i,t){i.uniform4iv(this.addr,t)}function bg(i,t){i.uniform1uiv(this.addr,t)}function Eg(i,t){i.uniform2uiv(this.addr,t)}function wg(i,t){i.uniform3uiv(this.addr,t)}function Tg(i,t){i.uniform4uiv(this.addr,t)}function Ag(i,t,e){const n=this.cache,r=t.length,s=ma(e,r);Te(n,s)||(i.uniform1iv(this.addr,s),Ae(n,s));for(let a=0;a!==r;++a)e.setTexture2D(t[a]||Su,s[a])}function Rg(i,t,e){const n=this.cache,r=t.length,s=ma(e,r);Te(n,s)||(i.uniform1iv(this.addr,s),Ae(n,s));for(let a=0;a!==r;++a)e.setTexture3D(t[a]||bu,s[a])}function Cg(i,t,e){const n=this.cache,r=t.length,s=ma(e,r);Te(n,s)||(i.uniform1iv(this.addr,s),Ae(n,s));for(let a=0;a!==r;++a)e.setTextureCube(t[a]||Eu,s[a])}function Lg(i,t,e){const n=this.cache,r=t.length,s=ma(e,r);Te(n,s)||(i.uniform1iv(this.addr,s),Ae(n,s));for(let a=0;a!==r;++a)e.setTexture2DArray(t[a]||yu,s[a])}function Pg(i){switch(i){case 5126:return fg;case 35664:return dg;case 35665:return pg;case 35666:return mg;case 35674:return gg;case 35675:return vg;case 35676:return _g;case 5124:case 35670:return xg;case 35667:case 35671:return Mg;case 35668:case 35672:return Sg;case 35669:case 35673:return yg;case 5125:return bg;case 36294:return Eg;case 36295:return wg;case 36296:return Tg;case 35678:case 36198:case 36298:case 36306:case 35682:return Ag;case 35679:case 36299:case 36307:return Rg;case 35680:case 36300:case 36308:case 36293:return Cg;case 36289:case 36303:case 36311:case 36292:return Lg}}class Dg{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.setValue=ug(e.type)}}class Ig{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.size=e.size,this.setValue=Pg(e.type)}}class Ug{constructor(t){this.id=t,this.seq=[],this.map={}}setValue(t,e,n){const r=this.seq;for(let s=0,a=r.length;s!==a;++s){const o=r[s];o.setValue(t,e[o.id],n)}}}const to=/(\w+)(\])?(\[|\.)?/g;function Wl(i,t){i.seq.push(t),i.map[t.id]=t}function Ng(i,t,e){const n=i.name,r=n.length;for(to.lastIndex=0;;){const s=to.exec(n),a=to.lastIndex;let o=s[1];const c=s[2]==="]",l=s[3];if(c&&(o=o|0),l===void 0||l==="["&&a+2===r){Wl(e,l===void 0?new Dg(o,i,t):new Ig(o,i,t));break}else{let u=e.map[o];u===void 0&&(u=new Ug(o),Wl(e,u)),e=u}}}class na{constructor(t,e){this.seq=[],this.map={};const n=t.getProgramParameter(e,t.ACTIVE_UNIFORMS);for(let r=0;r<n;++r){const s=t.getActiveUniform(e,r),a=t.getUniformLocation(e,s.name);Ng(s,a,this)}}setValue(t,e,n,r){const s=this.map[e];s!==void 0&&s.setValue(t,n,r)}setOptional(t,e,n){const r=e[n];r!==void 0&&this.setValue(t,n,r)}static upload(t,e,n,r){for(let s=0,a=e.length;s!==a;++s){const o=e[s],c=n[o.id];c.needsUpdate!==!1&&o.setValue(t,c.value,r)}}static seqWithValue(t,e){const n=[];for(let r=0,s=t.length;r!==s;++r){const a=t[r];a.id in e&&n.push(a)}return n}}function Xl(i,t,e){const n=i.createShader(t);return i.shaderSource(n,e),i.compileShader(n),n}const Fg=37297;let Og=0;function Bg(i,t){const e=i.split(`
`),n=[],r=Math.max(t-6,0),s=Math.min(t+6,e.length);for(let a=r;a<s;a++){const o=a+1;n.push(`${o===t?">":" "} ${o}: ${e[a]}`)}return n.join(`
`)}const ql=new jt;function kg(i){se._getMatrix(ql,se.workingColorSpace,i);const t=`mat3( ${ql.elements.map(e=>e.toFixed(4))} )`;switch(se.getTransfer(i)){case oa:return[t,"LinearTransferOETF"];case he:return[t,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space: ",i),[t,"LinearTransferOETF"]}}function Yl(i,t,e){const n=i.getShaderParameter(t,i.COMPILE_STATUS),s=(i.getShaderInfoLog(t)||"").trim();if(n&&s==="")return"";const a=/ERROR: 0:(\d+)/.exec(s);if(a){const o=parseInt(a[1]);return e.toUpperCase()+`

`+s+`

`+Bg(i.getShaderSource(t),o)}else return s}function zg(i,t){const e=kg(t);return[`vec4 ${i}( vec4 value ) {`,`	return ${e[1]}( vec4( value.rgb * ${e[0]}, value.a ) );`,"}"].join(`
`)}function Hg(i,t){let e;switch(t){case Yf:e="Linear";break;case $f:e="Reinhard";break;case Zf:e="Cineon";break;case Jf:e="ACESFilmic";break;case jf:e="AgX";break;case Nh:e="Neutral";break;case Kf:e="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",t),e="Linear"}return"vec3 "+i+"( vec3 color ) { return "+e+"ToneMapping( color ); }"}const Gs=new O;function Vg(){se.getLuminanceCoefficients(Gs);const i=Gs.x.toFixed(4),t=Gs.y.toFixed(4),e=Gs.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${i}, ${t}, ${e} );`,"	return dot( weights, rgb );","}"].join(`
`)}function Gg(i){return[i.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",i.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(Wr).join(`
`)}function Wg(i){const t=[];for(const e in i){const n=i[e];n!==!1&&t.push("#define "+e+" "+n)}return t.join(`
`)}function Xg(i,t){const e={},n=i.getProgramParameter(t,i.ACTIVE_ATTRIBUTES);for(let r=0;r<n;r++){const s=i.getActiveAttrib(t,r),a=s.name;let o=1;s.type===i.FLOAT_MAT2&&(o=2),s.type===i.FLOAT_MAT3&&(o=3),s.type===i.FLOAT_MAT4&&(o=4),e[a]={type:s.type,location:i.getAttribLocation(t,a),locationSize:o}}return e}function Wr(i){return i!==""}function $l(i,t){const e=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return i.replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,e).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows)}function Zl(i,t){return i.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}const qg=/^[ \t]*#include +<([\w\d./]+)>/gm;function tc(i){return i.replace(qg,$g)}const Yg=new Map;function $g(i,t){let e=Qt[t];if(e===void 0){const n=Yg.get(t);if(n!==void 0)e=Qt[n],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',t,n);else throw new Error("Can not resolve #include <"+t+">")}return tc(e)}const Zg=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function Jl(i){return i.replace(Zg,Jg)}function Jg(i,t,e,n){let r="";for(let s=parseInt(t);s<parseInt(e);s++)r+=n.replace(/\[\s*i\s*\]/g,"[ "+s+" ]").replace(/UNROLLED_LOOP_INDEX/g,s);return r}function Kl(i){let t=`precision ${i.precision} float;
	precision ${i.precision} int;
	precision ${i.precision} sampler2D;
	precision ${i.precision} samplerCube;
	precision ${i.precision} sampler3D;
	precision ${i.precision} sampler2DArray;
	precision ${i.precision} sampler2DShadow;
	precision ${i.precision} samplerCubeShadow;
	precision ${i.precision} sampler2DArrayShadow;
	precision ${i.precision} isampler2D;
	precision ${i.precision} isampler3D;
	precision ${i.precision} isamplerCube;
	precision ${i.precision} isampler2DArray;
	precision ${i.precision} usampler2D;
	precision ${i.precision} usampler3D;
	precision ${i.precision} usamplerCube;
	precision ${i.precision} usampler2DArray;
	`;return i.precision==="highp"?t+=`
#define HIGH_PRECISION`:i.precision==="mediump"?t+=`
#define MEDIUM_PRECISION`:i.precision==="lowp"&&(t+=`
#define LOW_PRECISION`),t}function Kg(i){let t="SHADOWMAP_TYPE_BASIC";return i.shadowMapType===Dh?t="SHADOWMAP_TYPE_PCF":i.shadowMapType===Ih?t="SHADOWMAP_TYPE_PCF_SOFT":i.shadowMapType===Vn&&(t="SHADOWMAP_TYPE_VSM"),t}function jg(i){let t="ENVMAP_TYPE_CUBE";if(i.envMap)switch(i.envMapMode){case Mr:case Sr:t="ENVMAP_TYPE_CUBE";break;case da:t="ENVMAP_TYPE_CUBE_UV";break}return t}function Qg(i){let t="ENVMAP_MODE_REFLECTION";if(i.envMap)switch(i.envMapMode){case Sr:t="ENVMAP_MODE_REFRACTION";break}return t}function tv(i){let t="ENVMAP_BLENDING_NONE";if(i.envMap)switch(i.combine){case Uh:t="ENVMAP_BLENDING_MULTIPLY";break;case Xf:t="ENVMAP_BLENDING_MIX";break;case qf:t="ENVMAP_BLENDING_ADD";break}return t}function ev(i){const t=i.envMapCubeUVHeight;if(t===null)return null;const e=Math.log2(t)-2,n=1/t;return{texelWidth:1/(3*Math.max(Math.pow(2,e),112)),texelHeight:n,maxMip:e}}function nv(i,t,e,n){const r=i.getContext(),s=e.defines;let a=e.vertexShader,o=e.fragmentShader;const c=Kg(e),l=jg(e),h=Qg(e),u=tv(e),d=ev(e),f=Gg(e),m=Wg(s),x=r.createProgram();let g,p,w=e.glslVersion?"#version "+e.glslVersion+`
`:"";e.isRawShaderMaterial?(g=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,m].filter(Wr).join(`
`),g.length>0&&(g+=`
`),p=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,m].filter(Wr).join(`
`),p.length>0&&(p+=`
`)):(g=[Kl(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,m,e.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",e.batching?"#define USE_BATCHING":"",e.batchingColor?"#define USE_BATCHING_COLOR":"",e.instancing?"#define USE_INSTANCING":"",e.instancingColor?"#define USE_INSTANCING_COLOR":"",e.instancingMorph?"#define USE_INSTANCING_MORPH":"",e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.map?"#define USE_MAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+h:"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.displacementMap?"#define USE_DISPLACEMENTMAP":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.mapUv?"#define MAP_UV "+e.mapUv:"",e.alphaMapUv?"#define ALPHAMAP_UV "+e.alphaMapUv:"",e.lightMapUv?"#define LIGHTMAP_UV "+e.lightMapUv:"",e.aoMapUv?"#define AOMAP_UV "+e.aoMapUv:"",e.emissiveMapUv?"#define EMISSIVEMAP_UV "+e.emissiveMapUv:"",e.bumpMapUv?"#define BUMPMAP_UV "+e.bumpMapUv:"",e.normalMapUv?"#define NORMALMAP_UV "+e.normalMapUv:"",e.displacementMapUv?"#define DISPLACEMENTMAP_UV "+e.displacementMapUv:"",e.metalnessMapUv?"#define METALNESSMAP_UV "+e.metalnessMapUv:"",e.roughnessMapUv?"#define ROUGHNESSMAP_UV "+e.roughnessMapUv:"",e.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+e.anisotropyMapUv:"",e.clearcoatMapUv?"#define CLEARCOATMAP_UV "+e.clearcoatMapUv:"",e.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+e.clearcoatNormalMapUv:"",e.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+e.clearcoatRoughnessMapUv:"",e.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+e.iridescenceMapUv:"",e.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+e.iridescenceThicknessMapUv:"",e.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+e.sheenColorMapUv:"",e.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+e.sheenRoughnessMapUv:"",e.specularMapUv?"#define SPECULARMAP_UV "+e.specularMapUv:"",e.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+e.specularColorMapUv:"",e.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+e.specularIntensityMapUv:"",e.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+e.transmissionMapUv:"",e.thicknessMapUv?"#define THICKNESSMAP_UV "+e.thicknessMapUv:"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.flatShading?"#define FLAT_SHADED":"",e.skinning?"#define USE_SKINNING":"",e.morphTargets?"#define USE_MORPHTARGETS":"",e.morphNormals&&e.flatShading===!1?"#define USE_MORPHNORMALS":"",e.morphColors?"#define USE_MORPHCOLORS":"",e.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+e.morphTextureStride:"",e.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+e.morphTargetsCount:"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+c:"",e.sizeAttenuation?"#define USE_SIZEATTENUATION":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",e.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(Wr).join(`
`),p=[Kl(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,m,e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",e.map?"#define USE_MAP":"",e.matcap?"#define USE_MATCAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+l:"",e.envMap?"#define "+h:"",e.envMap?"#define "+u:"",d?"#define CUBEUV_TEXEL_WIDTH "+d.texelWidth:"",d?"#define CUBEUV_TEXEL_HEIGHT "+d.texelHeight:"",d?"#define CUBEUV_MAX_MIP "+d.maxMip+".0":"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoat?"#define USE_CLEARCOAT":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.dispersion?"#define USE_DISPERSION":"",e.iridescence?"#define USE_IRIDESCENCE":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaTest?"#define USE_ALPHATEST":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.sheen?"#define USE_SHEEN":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors||e.instancingColor||e.batchingColor?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.gradientMap?"#define USE_GRADIENTMAP":"",e.flatShading?"#define FLAT_SHADED":"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+c:"",e.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",e.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",e.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",e.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",e.toneMapping!==ui?"#define TONE_MAPPING":"",e.toneMapping!==ui?Qt.tonemapping_pars_fragment:"",e.toneMapping!==ui?Hg("toneMapping",e.toneMapping):"",e.dithering?"#define DITHERING":"",e.opaque?"#define OPAQUE":"",Qt.colorspace_pars_fragment,zg("linearToOutputTexel",e.outputColorSpace),Vg(),e.useDepthPacking?"#define DEPTH_PACKING "+e.depthPacking:"",`
`].filter(Wr).join(`
`)),a=tc(a),a=$l(a,e),a=Zl(a,e),o=tc(o),o=$l(o,e),o=Zl(o,e),a=Jl(a),o=Jl(o),e.isRawShaderMaterial!==!0&&(w=`#version 300 es
`,g=[f,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+g,p=["#define varying in",e.glslVersion===jc?"":"layout(location = 0) out highp vec4 pc_fragColor;",e.glslVersion===jc?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+p);const y=w+g+a,M=w+p+o,T=Xl(r,r.VERTEX_SHADER,y),E=Xl(r,r.FRAGMENT_SHADER,M);r.attachShader(x,T),r.attachShader(x,E),e.index0AttributeName!==void 0?r.bindAttribLocation(x,0,e.index0AttributeName):e.morphTargets===!0&&r.bindAttribLocation(x,0,"position"),r.linkProgram(x);function A(S){if(i.debug.checkShaderErrors){const b=r.getProgramInfoLog(x)||"",D=r.getShaderInfoLog(T)||"",U=r.getShaderInfoLog(E)||"",N=b.trim(),H=D.trim(),Z=U.trim();let V=!0,rt=!0;if(r.getProgramParameter(x,r.LINK_STATUS)===!1)if(V=!1,typeof i.debug.onShaderError=="function")i.debug.onShaderError(r,x,T,E);else{const ht=Yl(r,T,"vertex"),dt=Yl(r,E,"fragment");console.error("THREE.WebGLProgram: Shader Error "+r.getError()+" - VALIDATE_STATUS "+r.getProgramParameter(x,r.VALIDATE_STATUS)+`

Material Name: `+S.name+`
Material Type: `+S.type+`

Program Info Log: `+N+`
`+ht+`
`+dt)}else N!==""?console.warn("THREE.WebGLProgram: Program Info Log:",N):(H===""||Z==="")&&(rt=!1);rt&&(S.diagnostics={runnable:V,programLog:N,vertexShader:{log:H,prefix:g},fragmentShader:{log:Z,prefix:p}})}r.deleteShader(T),r.deleteShader(E),C=new na(r,x),v=Xg(r,x)}let C;this.getUniforms=function(){return C===void 0&&A(this),C};let v;this.getAttributes=function(){return v===void 0&&A(this),v};let _=e.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return _===!1&&(_=r.getProgramParameter(x,Fg)),_},this.destroy=function(){n.releaseStatesOfProgram(this),r.deleteProgram(x),this.program=void 0},this.type=e.shaderType,this.name=e.shaderName,this.id=Og++,this.cacheKey=t,this.usedTimes=1,this.program=x,this.vertexShader=T,this.fragmentShader=E,this}let iv=0;class rv{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(t){const e=t.vertexShader,n=t.fragmentShader,r=this._getShaderStage(e),s=this._getShaderStage(n),a=this._getShaderCacheForMaterial(t);return a.has(r)===!1&&(a.add(r),r.usedTimes++),a.has(s)===!1&&(a.add(s),s.usedTimes++),this}remove(t){const e=this.materialCache.get(t);for(const n of e)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(t),this}getVertexShaderID(t){return this._getShaderStage(t.vertexShader).id}getFragmentShaderID(t){return this._getShaderStage(t.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(t){const e=this.materialCache;let n=e.get(t);return n===void 0&&(n=new Set,e.set(t,n)),n}_getShaderStage(t){const e=this.shaderCache;let n=e.get(t);return n===void 0&&(n=new sv(t),e.set(t,n)),n}}class sv{constructor(t){this.id=iv++,this.code=t,this.usedTimes=0}}function av(i,t,e,n,r,s,a){const o=new Jh,c=new rv,l=new Set,h=[],u=r.logarithmicDepthBuffer,d=r.vertexTextures;let f=r.precision;const m={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function x(v){return l.add(v),v===0?"uv":`uv${v}`}function g(v,_,S,b,D){const U=b.fog,N=D.geometry,H=v.isMeshStandardMaterial?b.environment:null,Z=(v.isMeshStandardMaterial?e:t).get(v.envMap||H),V=Z&&Z.mapping===da?Z.image.height:null,rt=m[v.type];v.precision!==null&&(f=r.getMaxPrecision(v.precision),f!==v.precision&&console.warn("THREE.WebGLProgram.getParameters:",v.precision,"not supported, using",f,"instead."));const ht=N.morphAttributes.position||N.morphAttributes.normal||N.morphAttributes.color,dt=ht!==void 0?ht.length:0;let mt=0;N.morphAttributes.position!==void 0&&(mt=1),N.morphAttributes.normal!==void 0&&(mt=2),N.morphAttributes.color!==void 0&&(mt=3);let Et,Ft,zt,et;if(rt){const ae=An[rt];Et=ae.vertexShader,Ft=ae.fragmentShader}else Et=v.vertexShader,Ft=v.fragmentShader,c.update(v),zt=c.getVertexShaderID(v),et=c.getFragmentShaderID(v);const lt=i.getRenderTarget(),F=i.state.buffers.depth.getReversed(),k=D.isInstancedMesh===!0,B=D.isBatchedMesh===!0,K=!!v.map,j=!!v.matcap,P=!!Z,Q=!!v.aoMap,z=!!v.lightMap,G=!!v.bumpMap,X=!!v.normalMap,tt=!!v.displacementMap,ot=!!v.emissiveMap,ut=!!v.metalnessMap,Pt=!!v.roughnessMap,Ht=v.anisotropy>0,I=v.clearcoat>0,R=v.dispersion>0,Y=v.iridescence>0,nt=v.sheen>0,pt=v.transmission>0,at=Ht&&!!v.anisotropyMap,Ot=I&&!!v.clearcoatMap,Mt=I&&!!v.clearcoatNormalMap,It=I&&!!v.clearcoatRoughnessMap,Ut=Y&&!!v.iridescenceMap,gt=Y&&!!v.iridescenceThicknessMap,Rt=nt&&!!v.sheenColorMap,Yt=nt&&!!v.sheenRoughnessMap,kt=!!v.specularMap,Tt=!!v.specularColorMap,Kt=!!v.specularIntensityMap,W=pt&&!!v.transmissionMap,xt=pt&&!!v.thicknessMap,yt=!!v.gradientMap,Lt=!!v.alphaMap,vt=v.alphaTest>0,ft=!!v.alphaHash,Nt=!!v.extensions;let Zt=ui;v.toneMapped&&(lt===null||lt.isXRRenderTarget===!0)&&(Zt=i.toneMapping);const de={shaderID:rt,shaderType:v.type,shaderName:v.name,vertexShader:Et,fragmentShader:Ft,defines:v.defines,customVertexShaderID:zt,customFragmentShaderID:et,isRawShaderMaterial:v.isRawShaderMaterial===!0,glslVersion:v.glslVersion,precision:f,batching:B,batchingColor:B&&D._colorsTexture!==null,instancing:k,instancingColor:k&&D.instanceColor!==null,instancingMorph:k&&D.morphTexture!==null,supportsVertexTextures:d,outputColorSpace:lt===null?i.outputColorSpace:lt.isXRRenderTarget===!0?lt.texture.colorSpace:ki,alphaToCoverage:!!v.alphaToCoverage,map:K,matcap:j,envMap:P,envMapMode:P&&Z.mapping,envMapCubeUVHeight:V,aoMap:Q,lightMap:z,bumpMap:G,normalMap:X,displacementMap:d&&tt,emissiveMap:ot,normalMapObjectSpace:X&&v.normalMapType===id,normalMapTangentSpace:X&&v.normalMapType===Xh,metalnessMap:ut,roughnessMap:Pt,anisotropy:Ht,anisotropyMap:at,clearcoat:I,clearcoatMap:Ot,clearcoatNormalMap:Mt,clearcoatRoughnessMap:It,dispersion:R,iridescence:Y,iridescenceMap:Ut,iridescenceThicknessMap:gt,sheen:nt,sheenColorMap:Rt,sheenRoughnessMap:Yt,specularMap:kt,specularColorMap:Tt,specularIntensityMap:Kt,transmission:pt,transmissionMap:W,thicknessMap:xt,gradientMap:yt,opaque:v.transparent===!1&&v.blending===gr&&v.alphaToCoverage===!1,alphaMap:Lt,alphaTest:vt,alphaHash:ft,combine:v.combine,mapUv:K&&x(v.map.channel),aoMapUv:Q&&x(v.aoMap.channel),lightMapUv:z&&x(v.lightMap.channel),bumpMapUv:G&&x(v.bumpMap.channel),normalMapUv:X&&x(v.normalMap.channel),displacementMapUv:tt&&x(v.displacementMap.channel),emissiveMapUv:ot&&x(v.emissiveMap.channel),metalnessMapUv:ut&&x(v.metalnessMap.channel),roughnessMapUv:Pt&&x(v.roughnessMap.channel),anisotropyMapUv:at&&x(v.anisotropyMap.channel),clearcoatMapUv:Ot&&x(v.clearcoatMap.channel),clearcoatNormalMapUv:Mt&&x(v.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:It&&x(v.clearcoatRoughnessMap.channel),iridescenceMapUv:Ut&&x(v.iridescenceMap.channel),iridescenceThicknessMapUv:gt&&x(v.iridescenceThicknessMap.channel),sheenColorMapUv:Rt&&x(v.sheenColorMap.channel),sheenRoughnessMapUv:Yt&&x(v.sheenRoughnessMap.channel),specularMapUv:kt&&x(v.specularMap.channel),specularColorMapUv:Tt&&x(v.specularColorMap.channel),specularIntensityMapUv:Kt&&x(v.specularIntensityMap.channel),transmissionMapUv:W&&x(v.transmissionMap.channel),thicknessMapUv:xt&&x(v.thicknessMap.channel),alphaMapUv:Lt&&x(v.alphaMap.channel),vertexTangents:!!N.attributes.tangent&&(X||Ht),vertexColors:v.vertexColors,vertexAlphas:v.vertexColors===!0&&!!N.attributes.color&&N.attributes.color.itemSize===4,pointsUvs:D.isPoints===!0&&!!N.attributes.uv&&(K||Lt),fog:!!U,useFog:v.fog===!0,fogExp2:!!U&&U.isFogExp2,flatShading:v.flatShading===!0&&v.wireframe===!1,sizeAttenuation:v.sizeAttenuation===!0,logarithmicDepthBuffer:u,reversedDepthBuffer:F,skinning:D.isSkinnedMesh===!0,morphTargets:N.morphAttributes.position!==void 0,morphNormals:N.morphAttributes.normal!==void 0,morphColors:N.morphAttributes.color!==void 0,morphTargetsCount:dt,morphTextureStride:mt,numDirLights:_.directional.length,numPointLights:_.point.length,numSpotLights:_.spot.length,numSpotLightMaps:_.spotLightMap.length,numRectAreaLights:_.rectArea.length,numHemiLights:_.hemi.length,numDirLightShadows:_.directionalShadowMap.length,numPointLightShadows:_.pointShadowMap.length,numSpotLightShadows:_.spotShadowMap.length,numSpotLightShadowsWithMaps:_.numSpotLightShadowsWithMaps,numLightProbes:_.numLightProbes,numClippingPlanes:a.numPlanes,numClipIntersection:a.numIntersection,dithering:v.dithering,shadowMapEnabled:i.shadowMap.enabled&&S.length>0,shadowMapType:i.shadowMap.type,toneMapping:Zt,decodeVideoTexture:K&&v.map.isVideoTexture===!0&&se.getTransfer(v.map.colorSpace)===he,decodeVideoTextureEmissive:ot&&v.emissiveMap.isVideoTexture===!0&&se.getTransfer(v.emissiveMap.colorSpace)===he,premultipliedAlpha:v.premultipliedAlpha,doubleSided:v.side===Sn,flipSided:v.side===Ke,useDepthPacking:v.depthPacking>=0,depthPacking:v.depthPacking||0,index0AttributeName:v.index0AttributeName,extensionClipCullDistance:Nt&&v.extensions.clipCullDistance===!0&&n.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(Nt&&v.extensions.multiDraw===!0||B)&&n.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:n.has("KHR_parallel_shader_compile"),customProgramCacheKey:v.customProgramCacheKey()};return de.vertexUv1s=l.has(1),de.vertexUv2s=l.has(2),de.vertexUv3s=l.has(3),l.clear(),de}function p(v){const _=[];if(v.shaderID?_.push(v.shaderID):(_.push(v.customVertexShaderID),_.push(v.customFragmentShaderID)),v.defines!==void 0)for(const S in v.defines)_.push(S),_.push(v.defines[S]);return v.isRawShaderMaterial===!1&&(w(_,v),y(_,v),_.push(i.outputColorSpace)),_.push(v.customProgramCacheKey),_.join()}function w(v,_){v.push(_.precision),v.push(_.outputColorSpace),v.push(_.envMapMode),v.push(_.envMapCubeUVHeight),v.push(_.mapUv),v.push(_.alphaMapUv),v.push(_.lightMapUv),v.push(_.aoMapUv),v.push(_.bumpMapUv),v.push(_.normalMapUv),v.push(_.displacementMapUv),v.push(_.emissiveMapUv),v.push(_.metalnessMapUv),v.push(_.roughnessMapUv),v.push(_.anisotropyMapUv),v.push(_.clearcoatMapUv),v.push(_.clearcoatNormalMapUv),v.push(_.clearcoatRoughnessMapUv),v.push(_.iridescenceMapUv),v.push(_.iridescenceThicknessMapUv),v.push(_.sheenColorMapUv),v.push(_.sheenRoughnessMapUv),v.push(_.specularMapUv),v.push(_.specularColorMapUv),v.push(_.specularIntensityMapUv),v.push(_.transmissionMapUv),v.push(_.thicknessMapUv),v.push(_.combine),v.push(_.fogExp2),v.push(_.sizeAttenuation),v.push(_.morphTargetsCount),v.push(_.morphAttributeCount),v.push(_.numDirLights),v.push(_.numPointLights),v.push(_.numSpotLights),v.push(_.numSpotLightMaps),v.push(_.numHemiLights),v.push(_.numRectAreaLights),v.push(_.numDirLightShadows),v.push(_.numPointLightShadows),v.push(_.numSpotLightShadows),v.push(_.numSpotLightShadowsWithMaps),v.push(_.numLightProbes),v.push(_.shadowMapType),v.push(_.toneMapping),v.push(_.numClippingPlanes),v.push(_.numClipIntersection),v.push(_.depthPacking)}function y(v,_){o.disableAll(),_.supportsVertexTextures&&o.enable(0),_.instancing&&o.enable(1),_.instancingColor&&o.enable(2),_.instancingMorph&&o.enable(3),_.matcap&&o.enable(4),_.envMap&&o.enable(5),_.normalMapObjectSpace&&o.enable(6),_.normalMapTangentSpace&&o.enable(7),_.clearcoat&&o.enable(8),_.iridescence&&o.enable(9),_.alphaTest&&o.enable(10),_.vertexColors&&o.enable(11),_.vertexAlphas&&o.enable(12),_.vertexUv1s&&o.enable(13),_.vertexUv2s&&o.enable(14),_.vertexUv3s&&o.enable(15),_.vertexTangents&&o.enable(16),_.anisotropy&&o.enable(17),_.alphaHash&&o.enable(18),_.batching&&o.enable(19),_.dispersion&&o.enable(20),_.batchingColor&&o.enable(21),_.gradientMap&&o.enable(22),v.push(o.mask),o.disableAll(),_.fog&&o.enable(0),_.useFog&&o.enable(1),_.flatShading&&o.enable(2),_.logarithmicDepthBuffer&&o.enable(3),_.reversedDepthBuffer&&o.enable(4),_.skinning&&o.enable(5),_.morphTargets&&o.enable(6),_.morphNormals&&o.enable(7),_.morphColors&&o.enable(8),_.premultipliedAlpha&&o.enable(9),_.shadowMapEnabled&&o.enable(10),_.doubleSided&&o.enable(11),_.flipSided&&o.enable(12),_.useDepthPacking&&o.enable(13),_.dithering&&o.enable(14),_.transmission&&o.enable(15),_.sheen&&o.enable(16),_.opaque&&o.enable(17),_.pointsUvs&&o.enable(18),_.decodeVideoTexture&&o.enable(19),_.decodeVideoTextureEmissive&&o.enable(20),_.alphaToCoverage&&o.enable(21),v.push(o.mask)}function M(v){const _=m[v.type];let S;if(_){const b=An[_];S=Kd.clone(b.uniforms)}else S=v.uniforms;return S}function T(v,_){let S;for(let b=0,D=h.length;b<D;b++){const U=h[b];if(U.cacheKey===_){S=U,++S.usedTimes;break}}return S===void 0&&(S=new nv(i,_,v,s),h.push(S)),S}function E(v){if(--v.usedTimes===0){const _=h.indexOf(v);h[_]=h[h.length-1],h.pop(),v.destroy()}}function A(v){c.remove(v)}function C(){c.dispose()}return{getParameters:g,getProgramCacheKey:p,getUniforms:M,acquireProgram:T,releaseProgram:E,releaseShaderCache:A,programs:h,dispose:C}}function ov(){let i=new WeakMap;function t(a){return i.has(a)}function e(a){let o=i.get(a);return o===void 0&&(o={},i.set(a,o)),o}function n(a){i.delete(a)}function r(a,o,c){i.get(a)[o]=c}function s(){i=new WeakMap}return{has:t,get:e,remove:n,update:r,dispose:s}}function cv(i,t){return i.groupOrder!==t.groupOrder?i.groupOrder-t.groupOrder:i.renderOrder!==t.renderOrder?i.renderOrder-t.renderOrder:i.material.id!==t.material.id?i.material.id-t.material.id:i.z!==t.z?i.z-t.z:i.id-t.id}function jl(i,t){return i.groupOrder!==t.groupOrder?i.groupOrder-t.groupOrder:i.renderOrder!==t.renderOrder?i.renderOrder-t.renderOrder:i.z!==t.z?t.z-i.z:i.id-t.id}function Ql(){const i=[];let t=0;const e=[],n=[],r=[];function s(){t=0,e.length=0,n.length=0,r.length=0}function a(u,d,f,m,x,g){let p=i[t];return p===void 0?(p={id:u.id,object:u,geometry:d,material:f,groupOrder:m,renderOrder:u.renderOrder,z:x,group:g},i[t]=p):(p.id=u.id,p.object=u,p.geometry=d,p.material=f,p.groupOrder=m,p.renderOrder=u.renderOrder,p.z=x,p.group=g),t++,p}function o(u,d,f,m,x,g){const p=a(u,d,f,m,x,g);f.transmission>0?n.push(p):f.transparent===!0?r.push(p):e.push(p)}function c(u,d,f,m,x,g){const p=a(u,d,f,m,x,g);f.transmission>0?n.unshift(p):f.transparent===!0?r.unshift(p):e.unshift(p)}function l(u,d){e.length>1&&e.sort(u||cv),n.length>1&&n.sort(d||jl),r.length>1&&r.sort(d||jl)}function h(){for(let u=t,d=i.length;u<d;u++){const f=i[u];if(f.id===null)break;f.id=null,f.object=null,f.geometry=null,f.material=null,f.group=null}}return{opaque:e,transmissive:n,transparent:r,init:s,push:o,unshift:c,finish:h,sort:l}}function lv(){let i=new WeakMap;function t(n,r){const s=i.get(n);let a;return s===void 0?(a=new Ql,i.set(n,[a])):r>=s.length?(a=new Ql,s.push(a)):a=s[r],a}function e(){i=new WeakMap}return{get:t,dispose:e}}function hv(){const i={};return{get:function(t){if(i[t.id]!==void 0)return i[t.id];let e;switch(t.type){case"DirectionalLight":e={direction:new O,color:new Gt};break;case"SpotLight":e={position:new O,direction:new O,color:new Gt,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":e={position:new O,color:new Gt,distance:0,decay:0};break;case"HemisphereLight":e={direction:new O,skyColor:new Gt,groundColor:new Gt};break;case"RectAreaLight":e={color:new Gt,position:new O,halfWidth:new O,halfHeight:new O};break}return i[t.id]=e,e}}}function uv(){const i={};return{get:function(t){if(i[t.id]!==void 0)return i[t.id];let e;switch(t.type){case"DirectionalLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new St};break;case"SpotLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new St};break;case"PointLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new St,shadowCameraNear:1,shadowCameraFar:1e3};break}return i[t.id]=e,e}}}let fv=0;function dv(i,t){return(t.castShadow?2:0)-(i.castShadow?2:0)+(t.map?1:0)-(i.map?1:0)}function pv(i){const t=new hv,e=uv(),n={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let l=0;l<9;l++)n.probe.push(new O);const r=new O,s=new ie,a=new ie;function o(l){let h=0,u=0,d=0;for(let v=0;v<9;v++)n.probe[v].set(0,0,0);let f=0,m=0,x=0,g=0,p=0,w=0,y=0,M=0,T=0,E=0,A=0;l.sort(dv);for(let v=0,_=l.length;v<_;v++){const S=l[v],b=S.color,D=S.intensity,U=S.distance,N=S.shadow&&S.shadow.map?S.shadow.map.texture:null;if(S.isAmbientLight)h+=b.r*D,u+=b.g*D,d+=b.b*D;else if(S.isLightProbe){for(let H=0;H<9;H++)n.probe[H].addScaledVector(S.sh.coefficients[H],D);A++}else if(S.isDirectionalLight){const H=t.get(S);if(H.color.copy(S.color).multiplyScalar(S.intensity),S.castShadow){const Z=S.shadow,V=e.get(S);V.shadowIntensity=Z.intensity,V.shadowBias=Z.bias,V.shadowNormalBias=Z.normalBias,V.shadowRadius=Z.radius,V.shadowMapSize=Z.mapSize,n.directionalShadow[f]=V,n.directionalShadowMap[f]=N,n.directionalShadowMatrix[f]=S.shadow.matrix,w++}n.directional[f]=H,f++}else if(S.isSpotLight){const H=t.get(S);H.position.setFromMatrixPosition(S.matrixWorld),H.color.copy(b).multiplyScalar(D),H.distance=U,H.coneCos=Math.cos(S.angle),H.penumbraCos=Math.cos(S.angle*(1-S.penumbra)),H.decay=S.decay,n.spot[x]=H;const Z=S.shadow;if(S.map&&(n.spotLightMap[T]=S.map,T++,Z.updateMatrices(S),S.castShadow&&E++),n.spotLightMatrix[x]=Z.matrix,S.castShadow){const V=e.get(S);V.shadowIntensity=Z.intensity,V.shadowBias=Z.bias,V.shadowNormalBias=Z.normalBias,V.shadowRadius=Z.radius,V.shadowMapSize=Z.mapSize,n.spotShadow[x]=V,n.spotShadowMap[x]=N,M++}x++}else if(S.isRectAreaLight){const H=t.get(S);H.color.copy(b).multiplyScalar(D),H.halfWidth.set(S.width*.5,0,0),H.halfHeight.set(0,S.height*.5,0),n.rectArea[g]=H,g++}else if(S.isPointLight){const H=t.get(S);if(H.color.copy(S.color).multiplyScalar(S.intensity),H.distance=S.distance,H.decay=S.decay,S.castShadow){const Z=S.shadow,V=e.get(S);V.shadowIntensity=Z.intensity,V.shadowBias=Z.bias,V.shadowNormalBias=Z.normalBias,V.shadowRadius=Z.radius,V.shadowMapSize=Z.mapSize,V.shadowCameraNear=Z.camera.near,V.shadowCameraFar=Z.camera.far,n.pointShadow[m]=V,n.pointShadowMap[m]=N,n.pointShadowMatrix[m]=S.shadow.matrix,y++}n.point[m]=H,m++}else if(S.isHemisphereLight){const H=t.get(S);H.skyColor.copy(S.color).multiplyScalar(D),H.groundColor.copy(S.groundColor).multiplyScalar(D),n.hemi[p]=H,p++}}g>0&&(i.has("OES_texture_float_linear")===!0?(n.rectAreaLTC1=wt.LTC_FLOAT_1,n.rectAreaLTC2=wt.LTC_FLOAT_2):(n.rectAreaLTC1=wt.LTC_HALF_1,n.rectAreaLTC2=wt.LTC_HALF_2)),n.ambient[0]=h,n.ambient[1]=u,n.ambient[2]=d;const C=n.hash;(C.directionalLength!==f||C.pointLength!==m||C.spotLength!==x||C.rectAreaLength!==g||C.hemiLength!==p||C.numDirectionalShadows!==w||C.numPointShadows!==y||C.numSpotShadows!==M||C.numSpotMaps!==T||C.numLightProbes!==A)&&(n.directional.length=f,n.spot.length=x,n.rectArea.length=g,n.point.length=m,n.hemi.length=p,n.directionalShadow.length=w,n.directionalShadowMap.length=w,n.pointShadow.length=y,n.pointShadowMap.length=y,n.spotShadow.length=M,n.spotShadowMap.length=M,n.directionalShadowMatrix.length=w,n.pointShadowMatrix.length=y,n.spotLightMatrix.length=M+T-E,n.spotLightMap.length=T,n.numSpotLightShadowsWithMaps=E,n.numLightProbes=A,C.directionalLength=f,C.pointLength=m,C.spotLength=x,C.rectAreaLength=g,C.hemiLength=p,C.numDirectionalShadows=w,C.numPointShadows=y,C.numSpotShadows=M,C.numSpotMaps=T,C.numLightProbes=A,n.version=fv++)}function c(l,h){let u=0,d=0,f=0,m=0,x=0;const g=h.matrixWorldInverse;for(let p=0,w=l.length;p<w;p++){const y=l[p];if(y.isDirectionalLight){const M=n.directional[u];M.direction.setFromMatrixPosition(y.matrixWorld),r.setFromMatrixPosition(y.target.matrixWorld),M.direction.sub(r),M.direction.transformDirection(g),u++}else if(y.isSpotLight){const M=n.spot[f];M.position.setFromMatrixPosition(y.matrixWorld),M.position.applyMatrix4(g),M.direction.setFromMatrixPosition(y.matrixWorld),r.setFromMatrixPosition(y.target.matrixWorld),M.direction.sub(r),M.direction.transformDirection(g),f++}else if(y.isRectAreaLight){const M=n.rectArea[m];M.position.setFromMatrixPosition(y.matrixWorld),M.position.applyMatrix4(g),a.identity(),s.copy(y.matrixWorld),s.premultiply(g),a.extractRotation(s),M.halfWidth.set(y.width*.5,0,0),M.halfHeight.set(0,y.height*.5,0),M.halfWidth.applyMatrix4(a),M.halfHeight.applyMatrix4(a),m++}else if(y.isPointLight){const M=n.point[d];M.position.setFromMatrixPosition(y.matrixWorld),M.position.applyMatrix4(g),d++}else if(y.isHemisphereLight){const M=n.hemi[x];M.direction.setFromMatrixPosition(y.matrixWorld),M.direction.transformDirection(g),x++}}}return{setup:o,setupView:c,state:n}}function th(i){const t=new pv(i),e=[],n=[];function r(h){l.camera=h,e.length=0,n.length=0}function s(h){e.push(h)}function a(h){n.push(h)}function o(){t.setup(e)}function c(h){t.setupView(e,h)}const l={lightsArray:e,shadowsArray:n,camera:null,lights:t,transmissionRenderTarget:{}};return{init:r,state:l,setupLights:o,setupLightsView:c,pushLight:s,pushShadow:a}}function mv(i){let t=new WeakMap;function e(r,s=0){const a=t.get(r);let o;return a===void 0?(o=new th(i),t.set(r,[o])):s>=a.length?(o=new th(i),a.push(o)):o=a[s],o}function n(){t=new WeakMap}return{get:e,dispose:n}}const gv=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,vv=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
#include <packing>
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = unpackRGBATo2Half( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ) );
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = unpackRGBAToDepth( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ) );
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( squared_mean - mean * mean );
	gl_FragColor = pack2HalfToRGBA( vec2( mean, std_dev ) );
}`;function _v(i,t,e){let n=new vc;const r=new St,s=new St,a=new me,o=new Hp({depthPacking:nd}),c=new Vp,l={},h=e.maxTextureSize,u={[pi]:Ke,[Ke]:pi,[Sn]:Sn},d=new Jn({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new St},radius:{value:4}},vertexShader:gv,fragmentShader:vv}),f=d.clone();f.defines.HORIZONTAL_PASS=1;const m=new De;m.setAttribute("position",new oe(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const x=new Xt(m,d),g=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=Dh;let p=this.type;this.render=function(E,A,C){if(g.enabled===!1||g.autoUpdate===!1&&g.needsUpdate===!1||E.length===0)return;const v=i.getRenderTarget(),_=i.getActiveCubeFace(),S=i.getActiveMipmapLevel(),b=i.state;b.setBlending(hi),b.buffers.depth.getReversed()===!0?b.buffers.color.setClear(0,0,0,0):b.buffers.color.setClear(1,1,1,1),b.buffers.depth.setTest(!0),b.setScissorTest(!1);const D=p!==Vn&&this.type===Vn,U=p===Vn&&this.type!==Vn;for(let N=0,H=E.length;N<H;N++){const Z=E[N],V=Z.shadow;if(V===void 0){console.warn("THREE.WebGLShadowMap:",Z,"has no shadow.");continue}if(V.autoUpdate===!1&&V.needsUpdate===!1)continue;r.copy(V.mapSize);const rt=V.getFrameExtents();if(r.multiply(rt),s.copy(V.mapSize),(r.x>h||r.y>h)&&(r.x>h&&(s.x=Math.floor(h/rt.x),r.x=s.x*rt.x,V.mapSize.x=s.x),r.y>h&&(s.y=Math.floor(h/rt.y),r.y=s.y*rt.y,V.mapSize.y=s.y)),V.map===null||D===!0||U===!0){const dt=this.type!==Vn?{minFilter:sn,magFilter:sn}:{};V.map!==null&&V.map.dispose(),V.map=new zi(r.x,r.y,dt),V.map.texture.name=Z.name+".shadowMap",V.camera.updateProjectionMatrix()}i.setRenderTarget(V.map),i.clear();const ht=V.getViewportCount();for(let dt=0;dt<ht;dt++){const mt=V.getViewport(dt);a.set(s.x*mt.x,s.y*mt.y,s.x*mt.z,s.y*mt.w),b.viewport(a),V.updateMatrices(Z,dt),n=V.getFrustum(),M(A,C,V.camera,Z,this.type)}V.isPointLightShadow!==!0&&this.type===Vn&&w(V,C),V.needsUpdate=!1}p=this.type,g.needsUpdate=!1,i.setRenderTarget(v,_,S)};function w(E,A){const C=t.update(x);d.defines.VSM_SAMPLES!==E.blurSamples&&(d.defines.VSM_SAMPLES=E.blurSamples,f.defines.VSM_SAMPLES=E.blurSamples,d.needsUpdate=!0,f.needsUpdate=!0),E.mapPass===null&&(E.mapPass=new zi(r.x,r.y)),d.uniforms.shadow_pass.value=E.map.texture,d.uniforms.resolution.value=E.mapSize,d.uniforms.radius.value=E.radius,i.setRenderTarget(E.mapPass),i.clear(),i.renderBufferDirect(A,null,C,d,x,null),f.uniforms.shadow_pass.value=E.mapPass.texture,f.uniforms.resolution.value=E.mapSize,f.uniforms.radius.value=E.radius,i.setRenderTarget(E.map),i.clear(),i.renderBufferDirect(A,null,C,f,x,null)}function y(E,A,C,v){let _=null;const S=C.isPointLight===!0?E.customDistanceMaterial:E.customDepthMaterial;if(S!==void 0)_=S;else if(_=C.isPointLight===!0?c:o,i.localClippingEnabled&&A.clipShadows===!0&&Array.isArray(A.clippingPlanes)&&A.clippingPlanes.length!==0||A.displacementMap&&A.displacementScale!==0||A.alphaMap&&A.alphaTest>0||A.map&&A.alphaTest>0||A.alphaToCoverage===!0){const b=_.uuid,D=A.uuid;let U=l[b];U===void 0&&(U={},l[b]=U);let N=U[D];N===void 0&&(N=_.clone(),U[D]=N,A.addEventListener("dispose",T)),_=N}if(_.visible=A.visible,_.wireframe=A.wireframe,v===Vn?_.side=A.shadowSide!==null?A.shadowSide:A.side:_.side=A.shadowSide!==null?A.shadowSide:u[A.side],_.alphaMap=A.alphaMap,_.alphaTest=A.alphaToCoverage===!0?.5:A.alphaTest,_.map=A.map,_.clipShadows=A.clipShadows,_.clippingPlanes=A.clippingPlanes,_.clipIntersection=A.clipIntersection,_.displacementMap=A.displacementMap,_.displacementScale=A.displacementScale,_.displacementBias=A.displacementBias,_.wireframeLinewidth=A.wireframeLinewidth,_.linewidth=A.linewidth,C.isPointLight===!0&&_.isMeshDistanceMaterial===!0){const b=i.properties.get(_);b.light=C}return _}function M(E,A,C,v,_){if(E.visible===!1)return;if(E.layers.test(A.layers)&&(E.isMesh||E.isLine||E.isPoints)&&(E.castShadow||E.receiveShadow&&_===Vn)&&(!E.frustumCulled||n.intersectsObject(E))){E.modelViewMatrix.multiplyMatrices(C.matrixWorldInverse,E.matrixWorld);const D=t.update(E),U=E.material;if(Array.isArray(U)){const N=D.groups;for(let H=0,Z=N.length;H<Z;H++){const V=N[H],rt=U[V.materialIndex];if(rt&&rt.visible){const ht=y(E,rt,v,_);E.onBeforeShadow(i,E,A,C,D,ht,V),i.renderBufferDirect(C,null,D,ht,E,V),E.onAfterShadow(i,E,A,C,D,ht,V)}}}else if(U.visible){const N=y(E,U,v,_);E.onBeforeShadow(i,E,A,C,D,N,null),i.renderBufferDirect(C,null,D,N,E,null),E.onAfterShadow(i,E,A,C,D,N,null)}}const b=E.children;for(let D=0,U=b.length;D<U;D++)M(b[D],A,C,v,_)}function T(E){E.target.removeEventListener("dispose",T);for(const C in l){const v=l[C],_=E.target.uuid;_ in v&&(v[_].dispose(),delete v[_])}}}const xv={[po]:mo,[go]:xo,[vo]:Mo,[xr]:_o,[mo]:po,[xo]:go,[Mo]:vo,[_o]:xr};function Mv(i,t){function e(){let W=!1;const xt=new me;let yt=null;const Lt=new me(0,0,0,0);return{setMask:function(vt){yt!==vt&&!W&&(i.colorMask(vt,vt,vt,vt),yt=vt)},setLocked:function(vt){W=vt},setClear:function(vt,ft,Nt,Zt,de){de===!0&&(vt*=Zt,ft*=Zt,Nt*=Zt),xt.set(vt,ft,Nt,Zt),Lt.equals(xt)===!1&&(i.clearColor(vt,ft,Nt,Zt),Lt.copy(xt))},reset:function(){W=!1,yt=null,Lt.set(-1,0,0,0)}}}function n(){let W=!1,xt=!1,yt=null,Lt=null,vt=null;return{setReversed:function(ft){if(xt!==ft){const Nt=t.get("EXT_clip_control");ft?Nt.clipControlEXT(Nt.LOWER_LEFT_EXT,Nt.ZERO_TO_ONE_EXT):Nt.clipControlEXT(Nt.LOWER_LEFT_EXT,Nt.NEGATIVE_ONE_TO_ONE_EXT),xt=ft;const Zt=vt;vt=null,this.setClear(Zt)}},getReversed:function(){return xt},setTest:function(ft){ft?lt(i.DEPTH_TEST):F(i.DEPTH_TEST)},setMask:function(ft){yt!==ft&&!W&&(i.depthMask(ft),yt=ft)},setFunc:function(ft){if(xt&&(ft=xv[ft]),Lt!==ft){switch(ft){case po:i.depthFunc(i.NEVER);break;case mo:i.depthFunc(i.ALWAYS);break;case go:i.depthFunc(i.LESS);break;case xr:i.depthFunc(i.LEQUAL);break;case vo:i.depthFunc(i.EQUAL);break;case _o:i.depthFunc(i.GEQUAL);break;case xo:i.depthFunc(i.GREATER);break;case Mo:i.depthFunc(i.NOTEQUAL);break;default:i.depthFunc(i.LEQUAL)}Lt=ft}},setLocked:function(ft){W=ft},setClear:function(ft){vt!==ft&&(xt&&(ft=1-ft),i.clearDepth(ft),vt=ft)},reset:function(){W=!1,yt=null,Lt=null,vt=null,xt=!1}}}function r(){let W=!1,xt=null,yt=null,Lt=null,vt=null,ft=null,Nt=null,Zt=null,de=null;return{setTest:function(ae){W||(ae?lt(i.STENCIL_TEST):F(i.STENCIL_TEST))},setMask:function(ae){xt!==ae&&!W&&(i.stencilMask(ae),xt=ae)},setFunc:function(ae,Un,bn){(yt!==ae||Lt!==Un||vt!==bn)&&(i.stencilFunc(ae,Un,bn),yt=ae,Lt=Un,vt=bn)},setOp:function(ae,Un,bn){(ft!==ae||Nt!==Un||Zt!==bn)&&(i.stencilOp(ae,Un,bn),ft=ae,Nt=Un,Zt=bn)},setLocked:function(ae){W=ae},setClear:function(ae){de!==ae&&(i.clearStencil(ae),de=ae)},reset:function(){W=!1,xt=null,yt=null,Lt=null,vt=null,ft=null,Nt=null,Zt=null,de=null}}}const s=new e,a=new n,o=new r,c=new WeakMap,l=new WeakMap;let h={},u={},d=new WeakMap,f=[],m=null,x=!1,g=null,p=null,w=null,y=null,M=null,T=null,E=null,A=new Gt(0,0,0),C=0,v=!1,_=null,S=null,b=null,D=null,U=null;const N=i.getParameter(i.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let H=!1,Z=0;const V=i.getParameter(i.VERSION);V.indexOf("WebGL")!==-1?(Z=parseFloat(/^WebGL (\d)/.exec(V)[1]),H=Z>=1):V.indexOf("OpenGL ES")!==-1&&(Z=parseFloat(/^OpenGL ES (\d)/.exec(V)[1]),H=Z>=2);let rt=null,ht={};const dt=i.getParameter(i.SCISSOR_BOX),mt=i.getParameter(i.VIEWPORT),Et=new me().fromArray(dt),Ft=new me().fromArray(mt);function zt(W,xt,yt,Lt){const vt=new Uint8Array(4),ft=i.createTexture();i.bindTexture(W,ft),i.texParameteri(W,i.TEXTURE_MIN_FILTER,i.NEAREST),i.texParameteri(W,i.TEXTURE_MAG_FILTER,i.NEAREST);for(let Nt=0;Nt<yt;Nt++)W===i.TEXTURE_3D||W===i.TEXTURE_2D_ARRAY?i.texImage3D(xt,0,i.RGBA,1,1,Lt,0,i.RGBA,i.UNSIGNED_BYTE,vt):i.texImage2D(xt+Nt,0,i.RGBA,1,1,0,i.RGBA,i.UNSIGNED_BYTE,vt);return ft}const et={};et[i.TEXTURE_2D]=zt(i.TEXTURE_2D,i.TEXTURE_2D,1),et[i.TEXTURE_CUBE_MAP]=zt(i.TEXTURE_CUBE_MAP,i.TEXTURE_CUBE_MAP_POSITIVE_X,6),et[i.TEXTURE_2D_ARRAY]=zt(i.TEXTURE_2D_ARRAY,i.TEXTURE_2D_ARRAY,1,1),et[i.TEXTURE_3D]=zt(i.TEXTURE_3D,i.TEXTURE_3D,1,1),s.setClear(0,0,0,1),a.setClear(1),o.setClear(0),lt(i.DEPTH_TEST),a.setFunc(xr),G(!1),X(Xc),lt(i.CULL_FACE),Q(hi);function lt(W){h[W]!==!0&&(i.enable(W),h[W]=!0)}function F(W){h[W]!==!1&&(i.disable(W),h[W]=!1)}function k(W,xt){return u[W]!==xt?(i.bindFramebuffer(W,xt),u[W]=xt,W===i.DRAW_FRAMEBUFFER&&(u[i.FRAMEBUFFER]=xt),W===i.FRAMEBUFFER&&(u[i.DRAW_FRAMEBUFFER]=xt),!0):!1}function B(W,xt){let yt=f,Lt=!1;if(W){yt=d.get(xt),yt===void 0&&(yt=[],d.set(xt,yt));const vt=W.textures;if(yt.length!==vt.length||yt[0]!==i.COLOR_ATTACHMENT0){for(let ft=0,Nt=vt.length;ft<Nt;ft++)yt[ft]=i.COLOR_ATTACHMENT0+ft;yt.length=vt.length,Lt=!0}}else yt[0]!==i.BACK&&(yt[0]=i.BACK,Lt=!0);Lt&&i.drawBuffers(yt)}function K(W){return m!==W?(i.useProgram(W),m=W,!0):!1}const j={[Ai]:i.FUNC_ADD,[Rf]:i.FUNC_SUBTRACT,[Cf]:i.FUNC_REVERSE_SUBTRACT};j[Lf]=i.MIN,j[Pf]=i.MAX;const P={[Df]:i.ZERO,[If]:i.ONE,[Uf]:i.SRC_COLOR,[uo]:i.SRC_ALPHA,[zf]:i.SRC_ALPHA_SATURATE,[Bf]:i.DST_COLOR,[Ff]:i.DST_ALPHA,[Nf]:i.ONE_MINUS_SRC_COLOR,[fo]:i.ONE_MINUS_SRC_ALPHA,[kf]:i.ONE_MINUS_DST_COLOR,[Of]:i.ONE_MINUS_DST_ALPHA,[Hf]:i.CONSTANT_COLOR,[Vf]:i.ONE_MINUS_CONSTANT_COLOR,[Gf]:i.CONSTANT_ALPHA,[Wf]:i.ONE_MINUS_CONSTANT_ALPHA};function Q(W,xt,yt,Lt,vt,ft,Nt,Zt,de,ae){if(W===hi){x===!0&&(F(i.BLEND),x=!1);return}if(x===!1&&(lt(i.BLEND),x=!0),W!==Af){if(W!==g||ae!==v){if((p!==Ai||M!==Ai)&&(i.blendEquation(i.FUNC_ADD),p=Ai,M=Ai),ae)switch(W){case gr:i.blendFuncSeparate(i.ONE,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case qc:i.blendFunc(i.ONE,i.ONE);break;case Yc:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case $c:i.blendFuncSeparate(i.DST_COLOR,i.ONE_MINUS_SRC_ALPHA,i.ZERO,i.ONE);break;default:console.error("THREE.WebGLState: Invalid blending: ",W);break}else switch(W){case gr:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case qc:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE,i.ONE,i.ONE);break;case Yc:console.error("THREE.WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case $c:console.error("THREE.WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:console.error("THREE.WebGLState: Invalid blending: ",W);break}w=null,y=null,T=null,E=null,A.set(0,0,0),C=0,g=W,v=ae}return}vt=vt||xt,ft=ft||yt,Nt=Nt||Lt,(xt!==p||vt!==M)&&(i.blendEquationSeparate(j[xt],j[vt]),p=xt,M=vt),(yt!==w||Lt!==y||ft!==T||Nt!==E)&&(i.blendFuncSeparate(P[yt],P[Lt],P[ft],P[Nt]),w=yt,y=Lt,T=ft,E=Nt),(Zt.equals(A)===!1||de!==C)&&(i.blendColor(Zt.r,Zt.g,Zt.b,de),A.copy(Zt),C=de),g=W,v=!1}function z(W,xt){W.side===Sn?F(i.CULL_FACE):lt(i.CULL_FACE);let yt=W.side===Ke;xt&&(yt=!yt),G(yt),W.blending===gr&&W.transparent===!1?Q(hi):Q(W.blending,W.blendEquation,W.blendSrc,W.blendDst,W.blendEquationAlpha,W.blendSrcAlpha,W.blendDstAlpha,W.blendColor,W.blendAlpha,W.premultipliedAlpha),a.setFunc(W.depthFunc),a.setTest(W.depthTest),a.setMask(W.depthWrite),s.setMask(W.colorWrite);const Lt=W.stencilWrite;o.setTest(Lt),Lt&&(o.setMask(W.stencilWriteMask),o.setFunc(W.stencilFunc,W.stencilRef,W.stencilFuncMask),o.setOp(W.stencilFail,W.stencilZFail,W.stencilZPass)),ot(W.polygonOffset,W.polygonOffsetFactor,W.polygonOffsetUnits),W.alphaToCoverage===!0?lt(i.SAMPLE_ALPHA_TO_COVERAGE):F(i.SAMPLE_ALPHA_TO_COVERAGE)}function G(W){_!==W&&(W?i.frontFace(i.CW):i.frontFace(i.CCW),_=W)}function X(W){W!==wf?(lt(i.CULL_FACE),W!==S&&(W===Xc?i.cullFace(i.BACK):W===Tf?i.cullFace(i.FRONT):i.cullFace(i.FRONT_AND_BACK))):F(i.CULL_FACE),S=W}function tt(W){W!==b&&(H&&i.lineWidth(W),b=W)}function ot(W,xt,yt){W?(lt(i.POLYGON_OFFSET_FILL),(D!==xt||U!==yt)&&(i.polygonOffset(xt,yt),D=xt,U=yt)):F(i.POLYGON_OFFSET_FILL)}function ut(W){W?lt(i.SCISSOR_TEST):F(i.SCISSOR_TEST)}function Pt(W){W===void 0&&(W=i.TEXTURE0+N-1),rt!==W&&(i.activeTexture(W),rt=W)}function Ht(W,xt,yt){yt===void 0&&(rt===null?yt=i.TEXTURE0+N-1:yt=rt);let Lt=ht[yt];Lt===void 0&&(Lt={type:void 0,texture:void 0},ht[yt]=Lt),(Lt.type!==W||Lt.texture!==xt)&&(rt!==yt&&(i.activeTexture(yt),rt=yt),i.bindTexture(W,xt||et[W]),Lt.type=W,Lt.texture=xt)}function I(){const W=ht[rt];W!==void 0&&W.type!==void 0&&(i.bindTexture(W.type,null),W.type=void 0,W.texture=void 0)}function R(){try{i.compressedTexImage2D(...arguments)}catch(W){console.error("THREE.WebGLState:",W)}}function Y(){try{i.compressedTexImage3D(...arguments)}catch(W){console.error("THREE.WebGLState:",W)}}function nt(){try{i.texSubImage2D(...arguments)}catch(W){console.error("THREE.WebGLState:",W)}}function pt(){try{i.texSubImage3D(...arguments)}catch(W){console.error("THREE.WebGLState:",W)}}function at(){try{i.compressedTexSubImage2D(...arguments)}catch(W){console.error("THREE.WebGLState:",W)}}function Ot(){try{i.compressedTexSubImage3D(...arguments)}catch(W){console.error("THREE.WebGLState:",W)}}function Mt(){try{i.texStorage2D(...arguments)}catch(W){console.error("THREE.WebGLState:",W)}}function It(){try{i.texStorage3D(...arguments)}catch(W){console.error("THREE.WebGLState:",W)}}function Ut(){try{i.texImage2D(...arguments)}catch(W){console.error("THREE.WebGLState:",W)}}function gt(){try{i.texImage3D(...arguments)}catch(W){console.error("THREE.WebGLState:",W)}}function Rt(W){Et.equals(W)===!1&&(i.scissor(W.x,W.y,W.z,W.w),Et.copy(W))}function Yt(W){Ft.equals(W)===!1&&(i.viewport(W.x,W.y,W.z,W.w),Ft.copy(W))}function kt(W,xt){let yt=l.get(xt);yt===void 0&&(yt=new WeakMap,l.set(xt,yt));let Lt=yt.get(W);Lt===void 0&&(Lt=i.getUniformBlockIndex(xt,W.name),yt.set(W,Lt))}function Tt(W,xt){const Lt=l.get(xt).get(W);c.get(xt)!==Lt&&(i.uniformBlockBinding(xt,Lt,W.__bindingPointIndex),c.set(xt,Lt))}function Kt(){i.disable(i.BLEND),i.disable(i.CULL_FACE),i.disable(i.DEPTH_TEST),i.disable(i.POLYGON_OFFSET_FILL),i.disable(i.SCISSOR_TEST),i.disable(i.STENCIL_TEST),i.disable(i.SAMPLE_ALPHA_TO_COVERAGE),i.blendEquation(i.FUNC_ADD),i.blendFunc(i.ONE,i.ZERO),i.blendFuncSeparate(i.ONE,i.ZERO,i.ONE,i.ZERO),i.blendColor(0,0,0,0),i.colorMask(!0,!0,!0,!0),i.clearColor(0,0,0,0),i.depthMask(!0),i.depthFunc(i.LESS),a.setReversed(!1),i.clearDepth(1),i.stencilMask(4294967295),i.stencilFunc(i.ALWAYS,0,4294967295),i.stencilOp(i.KEEP,i.KEEP,i.KEEP),i.clearStencil(0),i.cullFace(i.BACK),i.frontFace(i.CCW),i.polygonOffset(0,0),i.activeTexture(i.TEXTURE0),i.bindFramebuffer(i.FRAMEBUFFER,null),i.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),i.bindFramebuffer(i.READ_FRAMEBUFFER,null),i.useProgram(null),i.lineWidth(1),i.scissor(0,0,i.canvas.width,i.canvas.height),i.viewport(0,0,i.canvas.width,i.canvas.height),h={},rt=null,ht={},u={},d=new WeakMap,f=[],m=null,x=!1,g=null,p=null,w=null,y=null,M=null,T=null,E=null,A=new Gt(0,0,0),C=0,v=!1,_=null,S=null,b=null,D=null,U=null,Et.set(0,0,i.canvas.width,i.canvas.height),Ft.set(0,0,i.canvas.width,i.canvas.height),s.reset(),a.reset(),o.reset()}return{buffers:{color:s,depth:a,stencil:o},enable:lt,disable:F,bindFramebuffer:k,drawBuffers:B,useProgram:K,setBlending:Q,setMaterial:z,setFlipSided:G,setCullFace:X,setLineWidth:tt,setPolygonOffset:ot,setScissorTest:ut,activeTexture:Pt,bindTexture:Ht,unbindTexture:I,compressedTexImage2D:R,compressedTexImage3D:Y,texImage2D:Ut,texImage3D:gt,updateUBOMapping:kt,uniformBlockBinding:Tt,texStorage2D:Mt,texStorage3D:It,texSubImage2D:nt,texSubImage3D:pt,compressedTexSubImage2D:at,compressedTexSubImage3D:Ot,scissor:Rt,viewport:Yt,reset:Kt}}function Sv(i,t,e,n,r,s,a){const o=t.has("WEBGL_multisampled_render_to_texture")?t.get("WEBGL_multisampled_render_to_texture"):null,c=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),l=new St,h=new WeakMap;let u;const d=new WeakMap;let f=!1;try{f=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function m(I,R){return f?new OffscreenCanvas(I,R):la("canvas")}function x(I,R,Y){let nt=1;const pt=Ht(I);if((pt.width>Y||pt.height>Y)&&(nt=Y/Math.max(pt.width,pt.height)),nt<1)if(typeof HTMLImageElement<"u"&&I instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&I instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&I instanceof ImageBitmap||typeof VideoFrame<"u"&&I instanceof VideoFrame){const at=Math.floor(nt*pt.width),Ot=Math.floor(nt*pt.height);u===void 0&&(u=m(at,Ot));const Mt=R?m(at,Ot):u;return Mt.width=at,Mt.height=Ot,Mt.getContext("2d").drawImage(I,0,0,at,Ot),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+pt.width+"x"+pt.height+") to ("+at+"x"+Ot+")."),Mt}else return"data"in I&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+pt.width+"x"+pt.height+")."),I;return I}function g(I){return I.generateMipmaps}function p(I){i.generateMipmap(I)}function w(I){return I.isWebGLCubeRenderTarget?i.TEXTURE_CUBE_MAP:I.isWebGL3DRenderTarget?i.TEXTURE_3D:I.isWebGLArrayRenderTarget||I.isCompressedArrayTexture?i.TEXTURE_2D_ARRAY:i.TEXTURE_2D}function y(I,R,Y,nt,pt=!1){if(I!==null){if(i[I]!==void 0)return i[I];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+I+"'")}let at=R;if(R===i.RED&&(Y===i.FLOAT&&(at=i.R32F),Y===i.HALF_FLOAT&&(at=i.R16F),Y===i.UNSIGNED_BYTE&&(at=i.R8)),R===i.RED_INTEGER&&(Y===i.UNSIGNED_BYTE&&(at=i.R8UI),Y===i.UNSIGNED_SHORT&&(at=i.R16UI),Y===i.UNSIGNED_INT&&(at=i.R32UI),Y===i.BYTE&&(at=i.R8I),Y===i.SHORT&&(at=i.R16I),Y===i.INT&&(at=i.R32I)),R===i.RG&&(Y===i.FLOAT&&(at=i.RG32F),Y===i.HALF_FLOAT&&(at=i.RG16F),Y===i.UNSIGNED_BYTE&&(at=i.RG8)),R===i.RG_INTEGER&&(Y===i.UNSIGNED_BYTE&&(at=i.RG8UI),Y===i.UNSIGNED_SHORT&&(at=i.RG16UI),Y===i.UNSIGNED_INT&&(at=i.RG32UI),Y===i.BYTE&&(at=i.RG8I),Y===i.SHORT&&(at=i.RG16I),Y===i.INT&&(at=i.RG32I)),R===i.RGB_INTEGER&&(Y===i.UNSIGNED_BYTE&&(at=i.RGB8UI),Y===i.UNSIGNED_SHORT&&(at=i.RGB16UI),Y===i.UNSIGNED_INT&&(at=i.RGB32UI),Y===i.BYTE&&(at=i.RGB8I),Y===i.SHORT&&(at=i.RGB16I),Y===i.INT&&(at=i.RGB32I)),R===i.RGBA_INTEGER&&(Y===i.UNSIGNED_BYTE&&(at=i.RGBA8UI),Y===i.UNSIGNED_SHORT&&(at=i.RGBA16UI),Y===i.UNSIGNED_INT&&(at=i.RGBA32UI),Y===i.BYTE&&(at=i.RGBA8I),Y===i.SHORT&&(at=i.RGBA16I),Y===i.INT&&(at=i.RGBA32I)),R===i.RGB&&(Y===i.UNSIGNED_INT_5_9_9_9_REV&&(at=i.RGB9_E5),Y===i.UNSIGNED_INT_10F_11F_11F_REV&&(at=i.R11F_G11F_B10F)),R===i.RGBA){const Ot=pt?oa:se.getTransfer(nt);Y===i.FLOAT&&(at=i.RGBA32F),Y===i.HALF_FLOAT&&(at=i.RGBA16F),Y===i.UNSIGNED_BYTE&&(at=Ot===he?i.SRGB8_ALPHA8:i.RGBA8),Y===i.UNSIGNED_SHORT_4_4_4_4&&(at=i.RGBA4),Y===i.UNSIGNED_SHORT_5_5_5_1&&(at=i.RGB5_A1)}return(at===i.R16F||at===i.R32F||at===i.RG16F||at===i.RG32F||at===i.RGBA16F||at===i.RGBA32F)&&t.get("EXT_color_buffer_float"),at}function M(I,R){let Y;return I?R===null||R===Bi||R===Qr?Y=i.DEPTH24_STENCIL8:R===Cn?Y=i.DEPTH32F_STENCIL8:R===jr&&(Y=i.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):R===null||R===Bi||R===Qr?Y=i.DEPTH_COMPONENT24:R===Cn?Y=i.DEPTH_COMPONENT32F:R===jr&&(Y=i.DEPTH_COMPONENT16),Y}function T(I,R){return g(I)===!0||I.isFramebufferTexture&&I.minFilter!==sn&&I.minFilter!==He?Math.log2(Math.max(R.width,R.height))+1:I.mipmaps!==void 0&&I.mipmaps.length>0?I.mipmaps.length:I.isCompressedTexture&&Array.isArray(I.image)?R.mipmaps.length:1}function E(I){const R=I.target;R.removeEventListener("dispose",E),C(R),R.isVideoTexture&&h.delete(R)}function A(I){const R=I.target;R.removeEventListener("dispose",A),_(R)}function C(I){const R=n.get(I);if(R.__webglInit===void 0)return;const Y=I.source,nt=d.get(Y);if(nt){const pt=nt[R.__cacheKey];pt.usedTimes--,pt.usedTimes===0&&v(I),Object.keys(nt).length===0&&d.delete(Y)}n.remove(I)}function v(I){const R=n.get(I);i.deleteTexture(R.__webglTexture);const Y=I.source,nt=d.get(Y);delete nt[R.__cacheKey],a.memory.textures--}function _(I){const R=n.get(I);if(I.depthTexture&&(I.depthTexture.dispose(),n.remove(I.depthTexture)),I.isWebGLCubeRenderTarget)for(let nt=0;nt<6;nt++){if(Array.isArray(R.__webglFramebuffer[nt]))for(let pt=0;pt<R.__webglFramebuffer[nt].length;pt++)i.deleteFramebuffer(R.__webglFramebuffer[nt][pt]);else i.deleteFramebuffer(R.__webglFramebuffer[nt]);R.__webglDepthbuffer&&i.deleteRenderbuffer(R.__webglDepthbuffer[nt])}else{if(Array.isArray(R.__webglFramebuffer))for(let nt=0;nt<R.__webglFramebuffer.length;nt++)i.deleteFramebuffer(R.__webglFramebuffer[nt]);else i.deleteFramebuffer(R.__webglFramebuffer);if(R.__webglDepthbuffer&&i.deleteRenderbuffer(R.__webglDepthbuffer),R.__webglMultisampledFramebuffer&&i.deleteFramebuffer(R.__webglMultisampledFramebuffer),R.__webglColorRenderbuffer)for(let nt=0;nt<R.__webglColorRenderbuffer.length;nt++)R.__webglColorRenderbuffer[nt]&&i.deleteRenderbuffer(R.__webglColorRenderbuffer[nt]);R.__webglDepthRenderbuffer&&i.deleteRenderbuffer(R.__webglDepthRenderbuffer)}const Y=I.textures;for(let nt=0,pt=Y.length;nt<pt;nt++){const at=n.get(Y[nt]);at.__webglTexture&&(i.deleteTexture(at.__webglTexture),a.memory.textures--),n.remove(Y[nt])}n.remove(I)}let S=0;function b(){S=0}function D(){const I=S;return I>=r.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+I+" texture units while this GPU supports only "+r.maxTextures),S+=1,I}function U(I){const R=[];return R.push(I.wrapS),R.push(I.wrapT),R.push(I.wrapR||0),R.push(I.magFilter),R.push(I.minFilter),R.push(I.anisotropy),R.push(I.internalFormat),R.push(I.format),R.push(I.type),R.push(I.generateMipmaps),R.push(I.premultiplyAlpha),R.push(I.flipY),R.push(I.unpackAlignment),R.push(I.colorSpace),R.join()}function N(I,R){const Y=n.get(I);if(I.isVideoTexture&&ut(I),I.isRenderTargetTexture===!1&&I.isExternalTexture!==!0&&I.version>0&&Y.__version!==I.version){const nt=I.image;if(nt===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(nt.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{et(Y,I,R);return}}else I.isExternalTexture&&(Y.__webglTexture=I.sourceTexture?I.sourceTexture:null);e.bindTexture(i.TEXTURE_2D,Y.__webglTexture,i.TEXTURE0+R)}function H(I,R){const Y=n.get(I);if(I.isRenderTargetTexture===!1&&I.version>0&&Y.__version!==I.version){et(Y,I,R);return}e.bindTexture(i.TEXTURE_2D_ARRAY,Y.__webglTexture,i.TEXTURE0+R)}function Z(I,R){const Y=n.get(I);if(I.isRenderTargetTexture===!1&&I.version>0&&Y.__version!==I.version){et(Y,I,R);return}e.bindTexture(i.TEXTURE_3D,Y.__webglTexture,i.TEXTURE0+R)}function V(I,R){const Y=n.get(I);if(I.version>0&&Y.__version!==I.version){lt(Y,I,R);return}e.bindTexture(i.TEXTURE_CUBE_MAP,Y.__webglTexture,i.TEXTURE0+R)}const rt={[Kr]:i.REPEAT,[Pi]:i.CLAMP_TO_EDGE,[yo]:i.MIRRORED_REPEAT},ht={[sn]:i.NEAREST,[td]:i.NEAREST_MIPMAP_NEAREST,[vs]:i.NEAREST_MIPMAP_LINEAR,[He]:i.LINEAR,[Ma]:i.LINEAR_MIPMAP_NEAREST,[Di]:i.LINEAR_MIPMAP_LINEAR},dt={[rd]:i.NEVER,[hd]:i.ALWAYS,[sd]:i.LESS,[qh]:i.LEQUAL,[ad]:i.EQUAL,[ld]:i.GEQUAL,[od]:i.GREATER,[cd]:i.NOTEQUAL};function mt(I,R){if(R.type===Cn&&t.has("OES_texture_float_linear")===!1&&(R.magFilter===He||R.magFilter===Ma||R.magFilter===vs||R.magFilter===Di||R.minFilter===He||R.minFilter===Ma||R.minFilter===vs||R.minFilter===Di)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),i.texParameteri(I,i.TEXTURE_WRAP_S,rt[R.wrapS]),i.texParameteri(I,i.TEXTURE_WRAP_T,rt[R.wrapT]),(I===i.TEXTURE_3D||I===i.TEXTURE_2D_ARRAY)&&i.texParameteri(I,i.TEXTURE_WRAP_R,rt[R.wrapR]),i.texParameteri(I,i.TEXTURE_MAG_FILTER,ht[R.magFilter]),i.texParameteri(I,i.TEXTURE_MIN_FILTER,ht[R.minFilter]),R.compareFunction&&(i.texParameteri(I,i.TEXTURE_COMPARE_MODE,i.COMPARE_REF_TO_TEXTURE),i.texParameteri(I,i.TEXTURE_COMPARE_FUNC,dt[R.compareFunction])),t.has("EXT_texture_filter_anisotropic")===!0){if(R.magFilter===sn||R.minFilter!==vs&&R.minFilter!==Di||R.type===Cn&&t.has("OES_texture_float_linear")===!1)return;if(R.anisotropy>1||n.get(R).__currentAnisotropy){const Y=t.get("EXT_texture_filter_anisotropic");i.texParameterf(I,Y.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(R.anisotropy,r.getMaxAnisotropy())),n.get(R).__currentAnisotropy=R.anisotropy}}}function Et(I,R){let Y=!1;I.__webglInit===void 0&&(I.__webglInit=!0,R.addEventListener("dispose",E));const nt=R.source;let pt=d.get(nt);pt===void 0&&(pt={},d.set(nt,pt));const at=U(R);if(at!==I.__cacheKey){pt[at]===void 0&&(pt[at]={texture:i.createTexture(),usedTimes:0},a.memory.textures++,Y=!0),pt[at].usedTimes++;const Ot=pt[I.__cacheKey];Ot!==void 0&&(pt[I.__cacheKey].usedTimes--,Ot.usedTimes===0&&v(R)),I.__cacheKey=at,I.__webglTexture=pt[at].texture}return Y}function Ft(I,R,Y){return Math.floor(Math.floor(I/Y)/R)}function zt(I,R,Y,nt){const at=I.updateRanges;if(at.length===0)e.texSubImage2D(i.TEXTURE_2D,0,0,0,R.width,R.height,Y,nt,R.data);else{at.sort((gt,Rt)=>gt.start-Rt.start);let Ot=0;for(let gt=1;gt<at.length;gt++){const Rt=at[Ot],Yt=at[gt],kt=Rt.start+Rt.count,Tt=Ft(Yt.start,R.width,4),Kt=Ft(Rt.start,R.width,4);Yt.start<=kt+1&&Tt===Kt&&Ft(Yt.start+Yt.count-1,R.width,4)===Tt?Rt.count=Math.max(Rt.count,Yt.start+Yt.count-Rt.start):(++Ot,at[Ot]=Yt)}at.length=Ot+1;const Mt=i.getParameter(i.UNPACK_ROW_LENGTH),It=i.getParameter(i.UNPACK_SKIP_PIXELS),Ut=i.getParameter(i.UNPACK_SKIP_ROWS);i.pixelStorei(i.UNPACK_ROW_LENGTH,R.width);for(let gt=0,Rt=at.length;gt<Rt;gt++){const Yt=at[gt],kt=Math.floor(Yt.start/4),Tt=Math.ceil(Yt.count/4),Kt=kt%R.width,W=Math.floor(kt/R.width),xt=Tt,yt=1;i.pixelStorei(i.UNPACK_SKIP_PIXELS,Kt),i.pixelStorei(i.UNPACK_SKIP_ROWS,W),e.texSubImage2D(i.TEXTURE_2D,0,Kt,W,xt,yt,Y,nt,R.data)}I.clearUpdateRanges(),i.pixelStorei(i.UNPACK_ROW_LENGTH,Mt),i.pixelStorei(i.UNPACK_SKIP_PIXELS,It),i.pixelStorei(i.UNPACK_SKIP_ROWS,Ut)}}function et(I,R,Y){let nt=i.TEXTURE_2D;(R.isDataArrayTexture||R.isCompressedArrayTexture)&&(nt=i.TEXTURE_2D_ARRAY),R.isData3DTexture&&(nt=i.TEXTURE_3D);const pt=Et(I,R),at=R.source;e.bindTexture(nt,I.__webglTexture,i.TEXTURE0+Y);const Ot=n.get(at);if(at.version!==Ot.__version||pt===!0){e.activeTexture(i.TEXTURE0+Y);const Mt=se.getPrimaries(se.workingColorSpace),It=R.colorSpace===Rn?null:se.getPrimaries(R.colorSpace),Ut=R.colorSpace===Rn||Mt===It?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,R.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,R.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,R.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,Ut);let gt=x(R.image,!1,r.maxTextureSize);gt=Pt(R,gt);const Rt=s.convert(R.format,R.colorSpace),Yt=s.convert(R.type);let kt=y(R.internalFormat,Rt,Yt,R.colorSpace,R.isVideoTexture);mt(nt,R);let Tt;const Kt=R.mipmaps,W=R.isVideoTexture!==!0,xt=Ot.__version===void 0||pt===!0,yt=at.dataReady,Lt=T(R,gt);if(R.isDepthTexture)kt=M(R.format===es,R.type),xt&&(W?e.texStorage2D(i.TEXTURE_2D,1,kt,gt.width,gt.height):e.texImage2D(i.TEXTURE_2D,0,kt,gt.width,gt.height,0,Rt,Yt,null));else if(R.isDataTexture)if(Kt.length>0){W&&xt&&e.texStorage2D(i.TEXTURE_2D,Lt,kt,Kt[0].width,Kt[0].height);for(let vt=0,ft=Kt.length;vt<ft;vt++)Tt=Kt[vt],W?yt&&e.texSubImage2D(i.TEXTURE_2D,vt,0,0,Tt.width,Tt.height,Rt,Yt,Tt.data):e.texImage2D(i.TEXTURE_2D,vt,kt,Tt.width,Tt.height,0,Rt,Yt,Tt.data);R.generateMipmaps=!1}else W?(xt&&e.texStorage2D(i.TEXTURE_2D,Lt,kt,gt.width,gt.height),yt&&zt(R,gt,Rt,Yt)):e.texImage2D(i.TEXTURE_2D,0,kt,gt.width,gt.height,0,Rt,Yt,gt.data);else if(R.isCompressedTexture)if(R.isCompressedArrayTexture){W&&xt&&e.texStorage3D(i.TEXTURE_2D_ARRAY,Lt,kt,Kt[0].width,Kt[0].height,gt.depth);for(let vt=0,ft=Kt.length;vt<ft;vt++)if(Tt=Kt[vt],R.format!==rn)if(Rt!==null)if(W){if(yt)if(R.layerUpdates.size>0){const Nt=Pl(Tt.width,Tt.height,R.format,R.type);for(const Zt of R.layerUpdates){const de=Tt.data.subarray(Zt*Nt/Tt.data.BYTES_PER_ELEMENT,(Zt+1)*Nt/Tt.data.BYTES_PER_ELEMENT);e.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,vt,0,0,Zt,Tt.width,Tt.height,1,Rt,de)}R.clearLayerUpdates()}else e.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,vt,0,0,0,Tt.width,Tt.height,gt.depth,Rt,Tt.data)}else e.compressedTexImage3D(i.TEXTURE_2D_ARRAY,vt,kt,Tt.width,Tt.height,gt.depth,0,Tt.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else W?yt&&e.texSubImage3D(i.TEXTURE_2D_ARRAY,vt,0,0,0,Tt.width,Tt.height,gt.depth,Rt,Yt,Tt.data):e.texImage3D(i.TEXTURE_2D_ARRAY,vt,kt,Tt.width,Tt.height,gt.depth,0,Rt,Yt,Tt.data)}else{W&&xt&&e.texStorage2D(i.TEXTURE_2D,Lt,kt,Kt[0].width,Kt[0].height);for(let vt=0,ft=Kt.length;vt<ft;vt++)Tt=Kt[vt],R.format!==rn?Rt!==null?W?yt&&e.compressedTexSubImage2D(i.TEXTURE_2D,vt,0,0,Tt.width,Tt.height,Rt,Tt.data):e.compressedTexImage2D(i.TEXTURE_2D,vt,kt,Tt.width,Tt.height,0,Tt.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):W?yt&&e.texSubImage2D(i.TEXTURE_2D,vt,0,0,Tt.width,Tt.height,Rt,Yt,Tt.data):e.texImage2D(i.TEXTURE_2D,vt,kt,Tt.width,Tt.height,0,Rt,Yt,Tt.data)}else if(R.isDataArrayTexture)if(W){if(xt&&e.texStorage3D(i.TEXTURE_2D_ARRAY,Lt,kt,gt.width,gt.height,gt.depth),yt)if(R.layerUpdates.size>0){const vt=Pl(gt.width,gt.height,R.format,R.type);for(const ft of R.layerUpdates){const Nt=gt.data.subarray(ft*vt/gt.data.BYTES_PER_ELEMENT,(ft+1)*vt/gt.data.BYTES_PER_ELEMENT);e.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,ft,gt.width,gt.height,1,Rt,Yt,Nt)}R.clearLayerUpdates()}else e.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,0,gt.width,gt.height,gt.depth,Rt,Yt,gt.data)}else e.texImage3D(i.TEXTURE_2D_ARRAY,0,kt,gt.width,gt.height,gt.depth,0,Rt,Yt,gt.data);else if(R.isData3DTexture)W?(xt&&e.texStorage3D(i.TEXTURE_3D,Lt,kt,gt.width,gt.height,gt.depth),yt&&e.texSubImage3D(i.TEXTURE_3D,0,0,0,0,gt.width,gt.height,gt.depth,Rt,Yt,gt.data)):e.texImage3D(i.TEXTURE_3D,0,kt,gt.width,gt.height,gt.depth,0,Rt,Yt,gt.data);else if(R.isFramebufferTexture){if(xt)if(W)e.texStorage2D(i.TEXTURE_2D,Lt,kt,gt.width,gt.height);else{let vt=gt.width,ft=gt.height;for(let Nt=0;Nt<Lt;Nt++)e.texImage2D(i.TEXTURE_2D,Nt,kt,vt,ft,0,Rt,Yt,null),vt>>=1,ft>>=1}}else if(Kt.length>0){if(W&&xt){const vt=Ht(Kt[0]);e.texStorage2D(i.TEXTURE_2D,Lt,kt,vt.width,vt.height)}for(let vt=0,ft=Kt.length;vt<ft;vt++)Tt=Kt[vt],W?yt&&e.texSubImage2D(i.TEXTURE_2D,vt,0,0,Rt,Yt,Tt):e.texImage2D(i.TEXTURE_2D,vt,kt,Rt,Yt,Tt);R.generateMipmaps=!1}else if(W){if(xt){const vt=Ht(gt);e.texStorage2D(i.TEXTURE_2D,Lt,kt,vt.width,vt.height)}yt&&e.texSubImage2D(i.TEXTURE_2D,0,0,0,Rt,Yt,gt)}else e.texImage2D(i.TEXTURE_2D,0,kt,Rt,Yt,gt);g(R)&&p(nt),Ot.__version=at.version,R.onUpdate&&R.onUpdate(R)}I.__version=R.version}function lt(I,R,Y){if(R.image.length!==6)return;const nt=Et(I,R),pt=R.source;e.bindTexture(i.TEXTURE_CUBE_MAP,I.__webglTexture,i.TEXTURE0+Y);const at=n.get(pt);if(pt.version!==at.__version||nt===!0){e.activeTexture(i.TEXTURE0+Y);const Ot=se.getPrimaries(se.workingColorSpace),Mt=R.colorSpace===Rn?null:se.getPrimaries(R.colorSpace),It=R.colorSpace===Rn||Ot===Mt?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,R.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,R.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,R.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,It);const Ut=R.isCompressedTexture||R.image[0].isCompressedTexture,gt=R.image[0]&&R.image[0].isDataTexture,Rt=[];for(let ft=0;ft<6;ft++)!Ut&&!gt?Rt[ft]=x(R.image[ft],!0,r.maxCubemapSize):Rt[ft]=gt?R.image[ft].image:R.image[ft],Rt[ft]=Pt(R,Rt[ft]);const Yt=Rt[0],kt=s.convert(R.format,R.colorSpace),Tt=s.convert(R.type),Kt=y(R.internalFormat,kt,Tt,R.colorSpace),W=R.isVideoTexture!==!0,xt=at.__version===void 0||nt===!0,yt=pt.dataReady;let Lt=T(R,Yt);mt(i.TEXTURE_CUBE_MAP,R);let vt;if(Ut){W&&xt&&e.texStorage2D(i.TEXTURE_CUBE_MAP,Lt,Kt,Yt.width,Yt.height);for(let ft=0;ft<6;ft++){vt=Rt[ft].mipmaps;for(let Nt=0;Nt<vt.length;Nt++){const Zt=vt[Nt];R.format!==rn?kt!==null?W?yt&&e.compressedTexSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ft,Nt,0,0,Zt.width,Zt.height,kt,Zt.data):e.compressedTexImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ft,Nt,Kt,Zt.width,Zt.height,0,Zt.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):W?yt&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ft,Nt,0,0,Zt.width,Zt.height,kt,Tt,Zt.data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ft,Nt,Kt,Zt.width,Zt.height,0,kt,Tt,Zt.data)}}}else{if(vt=R.mipmaps,W&&xt){vt.length>0&&Lt++;const ft=Ht(Rt[0]);e.texStorage2D(i.TEXTURE_CUBE_MAP,Lt,Kt,ft.width,ft.height)}for(let ft=0;ft<6;ft++)if(gt){W?yt&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ft,0,0,0,Rt[ft].width,Rt[ft].height,kt,Tt,Rt[ft].data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ft,0,Kt,Rt[ft].width,Rt[ft].height,0,kt,Tt,Rt[ft].data);for(let Nt=0;Nt<vt.length;Nt++){const de=vt[Nt].image[ft].image;W?yt&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ft,Nt+1,0,0,de.width,de.height,kt,Tt,de.data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ft,Nt+1,Kt,de.width,de.height,0,kt,Tt,de.data)}}else{W?yt&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ft,0,0,0,kt,Tt,Rt[ft]):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ft,0,Kt,kt,Tt,Rt[ft]);for(let Nt=0;Nt<vt.length;Nt++){const Zt=vt[Nt];W?yt&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ft,Nt+1,0,0,kt,Tt,Zt.image[ft]):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ft,Nt+1,Kt,kt,Tt,Zt.image[ft])}}}g(R)&&p(i.TEXTURE_CUBE_MAP),at.__version=pt.version,R.onUpdate&&R.onUpdate(R)}I.__version=R.version}function F(I,R,Y,nt,pt,at){const Ot=s.convert(Y.format,Y.colorSpace),Mt=s.convert(Y.type),It=y(Y.internalFormat,Ot,Mt,Y.colorSpace),Ut=n.get(R),gt=n.get(Y);if(gt.__renderTarget=R,!Ut.__hasExternalTextures){const Rt=Math.max(1,R.width>>at),Yt=Math.max(1,R.height>>at);pt===i.TEXTURE_3D||pt===i.TEXTURE_2D_ARRAY?e.texImage3D(pt,at,It,Rt,Yt,R.depth,0,Ot,Mt,null):e.texImage2D(pt,at,It,Rt,Yt,0,Ot,Mt,null)}e.bindFramebuffer(i.FRAMEBUFFER,I),ot(R)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,nt,pt,gt.__webglTexture,0,tt(R)):(pt===i.TEXTURE_2D||pt>=i.TEXTURE_CUBE_MAP_POSITIVE_X&&pt<=i.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&i.framebufferTexture2D(i.FRAMEBUFFER,nt,pt,gt.__webglTexture,at),e.bindFramebuffer(i.FRAMEBUFFER,null)}function k(I,R,Y){if(i.bindRenderbuffer(i.RENDERBUFFER,I),R.depthBuffer){const nt=R.depthTexture,pt=nt&&nt.isDepthTexture?nt.type:null,at=M(R.stencilBuffer,pt),Ot=R.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,Mt=tt(R);ot(R)?o.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,Mt,at,R.width,R.height):Y?i.renderbufferStorageMultisample(i.RENDERBUFFER,Mt,at,R.width,R.height):i.renderbufferStorage(i.RENDERBUFFER,at,R.width,R.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,Ot,i.RENDERBUFFER,I)}else{const nt=R.textures;for(let pt=0;pt<nt.length;pt++){const at=nt[pt],Ot=s.convert(at.format,at.colorSpace),Mt=s.convert(at.type),It=y(at.internalFormat,Ot,Mt,at.colorSpace),Ut=tt(R);Y&&ot(R)===!1?i.renderbufferStorageMultisample(i.RENDERBUFFER,Ut,It,R.width,R.height):ot(R)?o.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,Ut,It,R.width,R.height):i.renderbufferStorage(i.RENDERBUFFER,It,R.width,R.height)}}i.bindRenderbuffer(i.RENDERBUFFER,null)}function B(I,R){if(R&&R.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(e.bindFramebuffer(i.FRAMEBUFFER,I),!(R.depthTexture&&R.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");const nt=n.get(R.depthTexture);nt.__renderTarget=R,(!nt.__webglTexture||R.depthTexture.image.width!==R.width||R.depthTexture.image.height!==R.height)&&(R.depthTexture.image.width=R.width,R.depthTexture.image.height=R.height,R.depthTexture.needsUpdate=!0),N(R.depthTexture,0);const pt=nt.__webglTexture,at=tt(R);if(R.depthTexture.format===ts)ot(R)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,pt,0,at):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,pt,0);else if(R.depthTexture.format===es)ot(R)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,pt,0,at):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,pt,0);else throw new Error("Unknown depthTexture format")}function K(I){const R=n.get(I),Y=I.isWebGLCubeRenderTarget===!0;if(R.__boundDepthTexture!==I.depthTexture){const nt=I.depthTexture;if(R.__depthDisposeCallback&&R.__depthDisposeCallback(),nt){const pt=()=>{delete R.__boundDepthTexture,delete R.__depthDisposeCallback,nt.removeEventListener("dispose",pt)};nt.addEventListener("dispose",pt),R.__depthDisposeCallback=pt}R.__boundDepthTexture=nt}if(I.depthTexture&&!R.__autoAllocateDepthBuffer){if(Y)throw new Error("target.depthTexture not supported in Cube render targets");const nt=I.texture.mipmaps;nt&&nt.length>0?B(R.__webglFramebuffer[0],I):B(R.__webglFramebuffer,I)}else if(Y){R.__webglDepthbuffer=[];for(let nt=0;nt<6;nt++)if(e.bindFramebuffer(i.FRAMEBUFFER,R.__webglFramebuffer[nt]),R.__webglDepthbuffer[nt]===void 0)R.__webglDepthbuffer[nt]=i.createRenderbuffer(),k(R.__webglDepthbuffer[nt],I,!1);else{const pt=I.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,at=R.__webglDepthbuffer[nt];i.bindRenderbuffer(i.RENDERBUFFER,at),i.framebufferRenderbuffer(i.FRAMEBUFFER,pt,i.RENDERBUFFER,at)}}else{const nt=I.texture.mipmaps;if(nt&&nt.length>0?e.bindFramebuffer(i.FRAMEBUFFER,R.__webglFramebuffer[0]):e.bindFramebuffer(i.FRAMEBUFFER,R.__webglFramebuffer),R.__webglDepthbuffer===void 0)R.__webglDepthbuffer=i.createRenderbuffer(),k(R.__webglDepthbuffer,I,!1);else{const pt=I.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,at=R.__webglDepthbuffer;i.bindRenderbuffer(i.RENDERBUFFER,at),i.framebufferRenderbuffer(i.FRAMEBUFFER,pt,i.RENDERBUFFER,at)}}e.bindFramebuffer(i.FRAMEBUFFER,null)}function j(I,R,Y){const nt=n.get(I);R!==void 0&&F(nt.__webglFramebuffer,I,I.texture,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,0),Y!==void 0&&K(I)}function P(I){const R=I.texture,Y=n.get(I),nt=n.get(R);I.addEventListener("dispose",A);const pt=I.textures,at=I.isWebGLCubeRenderTarget===!0,Ot=pt.length>1;if(Ot||(nt.__webglTexture===void 0&&(nt.__webglTexture=i.createTexture()),nt.__version=R.version,a.memory.textures++),at){Y.__webglFramebuffer=[];for(let Mt=0;Mt<6;Mt++)if(R.mipmaps&&R.mipmaps.length>0){Y.__webglFramebuffer[Mt]=[];for(let It=0;It<R.mipmaps.length;It++)Y.__webglFramebuffer[Mt][It]=i.createFramebuffer()}else Y.__webglFramebuffer[Mt]=i.createFramebuffer()}else{if(R.mipmaps&&R.mipmaps.length>0){Y.__webglFramebuffer=[];for(let Mt=0;Mt<R.mipmaps.length;Mt++)Y.__webglFramebuffer[Mt]=i.createFramebuffer()}else Y.__webglFramebuffer=i.createFramebuffer();if(Ot)for(let Mt=0,It=pt.length;Mt<It;Mt++){const Ut=n.get(pt[Mt]);Ut.__webglTexture===void 0&&(Ut.__webglTexture=i.createTexture(),a.memory.textures++)}if(I.samples>0&&ot(I)===!1){Y.__webglMultisampledFramebuffer=i.createFramebuffer(),Y.__webglColorRenderbuffer=[],e.bindFramebuffer(i.FRAMEBUFFER,Y.__webglMultisampledFramebuffer);for(let Mt=0;Mt<pt.length;Mt++){const It=pt[Mt];Y.__webglColorRenderbuffer[Mt]=i.createRenderbuffer(),i.bindRenderbuffer(i.RENDERBUFFER,Y.__webglColorRenderbuffer[Mt]);const Ut=s.convert(It.format,It.colorSpace),gt=s.convert(It.type),Rt=y(It.internalFormat,Ut,gt,It.colorSpace,I.isXRRenderTarget===!0),Yt=tt(I);i.renderbufferStorageMultisample(i.RENDERBUFFER,Yt,Rt,I.width,I.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+Mt,i.RENDERBUFFER,Y.__webglColorRenderbuffer[Mt])}i.bindRenderbuffer(i.RENDERBUFFER,null),I.depthBuffer&&(Y.__webglDepthRenderbuffer=i.createRenderbuffer(),k(Y.__webglDepthRenderbuffer,I,!0)),e.bindFramebuffer(i.FRAMEBUFFER,null)}}if(at){e.bindTexture(i.TEXTURE_CUBE_MAP,nt.__webglTexture),mt(i.TEXTURE_CUBE_MAP,R);for(let Mt=0;Mt<6;Mt++)if(R.mipmaps&&R.mipmaps.length>0)for(let It=0;It<R.mipmaps.length;It++)F(Y.__webglFramebuffer[Mt][It],I,R,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+Mt,It);else F(Y.__webglFramebuffer[Mt],I,R,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+Mt,0);g(R)&&p(i.TEXTURE_CUBE_MAP),e.unbindTexture()}else if(Ot){for(let Mt=0,It=pt.length;Mt<It;Mt++){const Ut=pt[Mt],gt=n.get(Ut);let Rt=i.TEXTURE_2D;(I.isWebGL3DRenderTarget||I.isWebGLArrayRenderTarget)&&(Rt=I.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),e.bindTexture(Rt,gt.__webglTexture),mt(Rt,Ut),F(Y.__webglFramebuffer,I,Ut,i.COLOR_ATTACHMENT0+Mt,Rt,0),g(Ut)&&p(Rt)}e.unbindTexture()}else{let Mt=i.TEXTURE_2D;if((I.isWebGL3DRenderTarget||I.isWebGLArrayRenderTarget)&&(Mt=I.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),e.bindTexture(Mt,nt.__webglTexture),mt(Mt,R),R.mipmaps&&R.mipmaps.length>0)for(let It=0;It<R.mipmaps.length;It++)F(Y.__webglFramebuffer[It],I,R,i.COLOR_ATTACHMENT0,Mt,It);else F(Y.__webglFramebuffer,I,R,i.COLOR_ATTACHMENT0,Mt,0);g(R)&&p(Mt),e.unbindTexture()}I.depthBuffer&&K(I)}function Q(I){const R=I.textures;for(let Y=0,nt=R.length;Y<nt;Y++){const pt=R[Y];if(g(pt)){const at=w(I),Ot=n.get(pt).__webglTexture;e.bindTexture(at,Ot),p(at),e.unbindTexture()}}}const z=[],G=[];function X(I){if(I.samples>0){if(ot(I)===!1){const R=I.textures,Y=I.width,nt=I.height;let pt=i.COLOR_BUFFER_BIT;const at=I.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,Ot=n.get(I),Mt=R.length>1;if(Mt)for(let Ut=0;Ut<R.length;Ut++)e.bindFramebuffer(i.FRAMEBUFFER,Ot.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+Ut,i.RENDERBUFFER,null),e.bindFramebuffer(i.FRAMEBUFFER,Ot.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+Ut,i.TEXTURE_2D,null,0);e.bindFramebuffer(i.READ_FRAMEBUFFER,Ot.__webglMultisampledFramebuffer);const It=I.texture.mipmaps;It&&It.length>0?e.bindFramebuffer(i.DRAW_FRAMEBUFFER,Ot.__webglFramebuffer[0]):e.bindFramebuffer(i.DRAW_FRAMEBUFFER,Ot.__webglFramebuffer);for(let Ut=0;Ut<R.length;Ut++){if(I.resolveDepthBuffer&&(I.depthBuffer&&(pt|=i.DEPTH_BUFFER_BIT),I.stencilBuffer&&I.resolveStencilBuffer&&(pt|=i.STENCIL_BUFFER_BIT)),Mt){i.framebufferRenderbuffer(i.READ_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.RENDERBUFFER,Ot.__webglColorRenderbuffer[Ut]);const gt=n.get(R[Ut]).__webglTexture;i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,gt,0)}i.blitFramebuffer(0,0,Y,nt,0,0,Y,nt,pt,i.NEAREST),c===!0&&(z.length=0,G.length=0,z.push(i.COLOR_ATTACHMENT0+Ut),I.depthBuffer&&I.resolveDepthBuffer===!1&&(z.push(at),G.push(at),i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,G)),i.invalidateFramebuffer(i.READ_FRAMEBUFFER,z))}if(e.bindFramebuffer(i.READ_FRAMEBUFFER,null),e.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),Mt)for(let Ut=0;Ut<R.length;Ut++){e.bindFramebuffer(i.FRAMEBUFFER,Ot.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+Ut,i.RENDERBUFFER,Ot.__webglColorRenderbuffer[Ut]);const gt=n.get(R[Ut]).__webglTexture;e.bindFramebuffer(i.FRAMEBUFFER,Ot.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+Ut,i.TEXTURE_2D,gt,0)}e.bindFramebuffer(i.DRAW_FRAMEBUFFER,Ot.__webglMultisampledFramebuffer)}else if(I.depthBuffer&&I.resolveDepthBuffer===!1&&c){const R=I.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,[R])}}}function tt(I){return Math.min(r.maxSamples,I.samples)}function ot(I){const R=n.get(I);return I.samples>0&&t.has("WEBGL_multisampled_render_to_texture")===!0&&R.__useRenderToTexture!==!1}function ut(I){const R=a.render.frame;h.get(I)!==R&&(h.set(I,R),I.update())}function Pt(I,R){const Y=I.colorSpace,nt=I.format,pt=I.type;return I.isCompressedTexture===!0||I.isVideoTexture===!0||Y!==ki&&Y!==Rn&&(se.getTransfer(Y)===he?(nt!==rn||pt!==Dn)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",Y)),R}function Ht(I){return typeof HTMLImageElement<"u"&&I instanceof HTMLImageElement?(l.width=I.naturalWidth||I.width,l.height=I.naturalHeight||I.height):typeof VideoFrame<"u"&&I instanceof VideoFrame?(l.width=I.displayWidth,l.height=I.displayHeight):(l.width=I.width,l.height=I.height),l}this.allocateTextureUnit=D,this.resetTextureUnits=b,this.setTexture2D=N,this.setTexture2DArray=H,this.setTexture3D=Z,this.setTextureCube=V,this.rebindTextures=j,this.setupRenderTarget=P,this.updateRenderTargetMipmap=Q,this.updateMultisampleRenderTarget=X,this.setupDepthRenderbuffer=K,this.setupFrameBufferTexture=F,this.useMultisampledRTT=ot}function yv(i,t){function e(n,r=Rn){let s;const a=se.getTransfer(r);if(n===Dn)return i.UNSIGNED_BYTE;if(n===lc)return i.UNSIGNED_SHORT_4_4_4_4;if(n===hc)return i.UNSIGNED_SHORT_5_5_5_1;if(n===kh)return i.UNSIGNED_INT_5_9_9_9_REV;if(n===zh)return i.UNSIGNED_INT_10F_11F_11F_REV;if(n===Oh)return i.BYTE;if(n===Bh)return i.SHORT;if(n===jr)return i.UNSIGNED_SHORT;if(n===cc)return i.INT;if(n===Bi)return i.UNSIGNED_INT;if(n===Cn)return i.FLOAT;if(n===wr)return i.HALF_FLOAT;if(n===Hh)return i.ALPHA;if(n===Vh)return i.RGB;if(n===rn)return i.RGBA;if(n===ts)return i.DEPTH_COMPONENT;if(n===es)return i.DEPTH_STENCIL;if(n===Gh)return i.RED;if(n===uc)return i.RED_INTEGER;if(n===Wh)return i.RG;if(n===fc)return i.RG_INTEGER;if(n===dc)return i.RGBA_INTEGER;if(n===js||n===Qs||n===ta||n===ea)if(a===he)if(s=t.get("WEBGL_compressed_texture_s3tc_srgb"),s!==null){if(n===js)return s.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===Qs)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===ta)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===ea)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(s=t.get("WEBGL_compressed_texture_s3tc"),s!==null){if(n===js)return s.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===Qs)return s.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===ta)return s.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===ea)return s.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(n===bo||n===Eo||n===wo||n===To)if(s=t.get("WEBGL_compressed_texture_pvrtc"),s!==null){if(n===bo)return s.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===Eo)return s.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===wo)return s.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===To)return s.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(n===Ao||n===Ro||n===Co)if(s=t.get("WEBGL_compressed_texture_etc"),s!==null){if(n===Ao||n===Ro)return a===he?s.COMPRESSED_SRGB8_ETC2:s.COMPRESSED_RGB8_ETC2;if(n===Co)return a===he?s.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:s.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(n===Lo||n===Po||n===Do||n===Io||n===Uo||n===No||n===Fo||n===Oo||n===Bo||n===ko||n===zo||n===Ho||n===Vo||n===Go)if(s=t.get("WEBGL_compressed_texture_astc"),s!==null){if(n===Lo)return a===he?s.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:s.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===Po)return a===he?s.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:s.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===Do)return a===he?s.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:s.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===Io)return a===he?s.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:s.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===Uo)return a===he?s.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:s.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===No)return a===he?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:s.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===Fo)return a===he?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:s.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===Oo)return a===he?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:s.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===Bo)return a===he?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:s.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===ko)return a===he?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:s.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===zo)return a===he?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:s.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===Ho)return a===he?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:s.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===Vo)return a===he?s.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:s.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===Go)return a===he?s.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:s.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(n===Wo||n===Xo||n===qo)if(s=t.get("EXT_texture_compression_bptc"),s!==null){if(n===Wo)return a===he?s.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:s.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===Xo)return s.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===qo)return s.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(n===Yo||n===$o||n===Zo||n===Jo)if(s=t.get("EXT_texture_compression_rgtc"),s!==null){if(n===Yo)return s.COMPRESSED_RED_RGTC1_EXT;if(n===$o)return s.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===Zo)return s.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===Jo)return s.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return n===Qr?i.UNSIGNED_INT_24_8:i[n]!==void 0?i[n]:null}return{convert:e}}const bv=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,Ev=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`;class wv{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(t,e){if(this.texture===null){const n=new ou(t.texture);(t.depthNear!==e.depthNear||t.depthFar!==e.depthFar)&&(this.depthNear=t.depthNear,this.depthFar=t.depthFar),this.texture=n}}getMesh(t){if(this.texture!==null&&this.mesh===null){const e=t.cameras[0].viewport,n=new Jn({vertexShader:bv,fragmentShader:Ev,uniforms:{depthColor:{value:this.texture},depthWidth:{value:e.z},depthHeight:{value:e.w}}});this.mesh=new Xt(new us(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class Tv extends Tr{constructor(t,e){super();const n=this;let r=null,s=1,a=null,o="local-floor",c=1,l=null,h=null,u=null,d=null,f=null,m=null;const x=typeof XRWebGLBinding<"u",g=new wv,p={},w=e.getContextAttributes();let y=null,M=null;const T=[],E=[],A=new St;let C=null;const v=new pn;v.viewport=new me;const _=new pn;_.viewport=new me;const S=[v,_],b=new Yp;let D=null,U=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(et){let lt=T[et];return lt===void 0&&(lt=new Ha,T[et]=lt),lt.getTargetRaySpace()},this.getControllerGrip=function(et){let lt=T[et];return lt===void 0&&(lt=new Ha,T[et]=lt),lt.getGripSpace()},this.getHand=function(et){let lt=T[et];return lt===void 0&&(lt=new Ha,T[et]=lt),lt.getHandSpace()};function N(et){const lt=E.indexOf(et.inputSource);if(lt===-1)return;const F=T[lt];F!==void 0&&(F.update(et.inputSource,et.frame,l||a),F.dispatchEvent({type:et.type,data:et.inputSource}))}function H(){r.removeEventListener("select",N),r.removeEventListener("selectstart",N),r.removeEventListener("selectend",N),r.removeEventListener("squeeze",N),r.removeEventListener("squeezestart",N),r.removeEventListener("squeezeend",N),r.removeEventListener("end",H),r.removeEventListener("inputsourceschange",Z);for(let et=0;et<T.length;et++){const lt=E[et];lt!==null&&(E[et]=null,T[et].disconnect(lt))}D=null,U=null,g.reset();for(const et in p)delete p[et];t.setRenderTarget(y),f=null,d=null,u=null,r=null,M=null,zt.stop(),n.isPresenting=!1,t.setPixelRatio(C),t.setSize(A.width,A.height,!1),n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(et){s=et,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(et){o=et,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return l||a},this.setReferenceSpace=function(et){l=et},this.getBaseLayer=function(){return d!==null?d:f},this.getBinding=function(){return u===null&&x&&(u=new XRWebGLBinding(r,e)),u},this.getFrame=function(){return m},this.getSession=function(){return r},this.setSession=async function(et){if(r=et,r!==null){if(y=t.getRenderTarget(),r.addEventListener("select",N),r.addEventListener("selectstart",N),r.addEventListener("selectend",N),r.addEventListener("squeeze",N),r.addEventListener("squeezestart",N),r.addEventListener("squeezeend",N),r.addEventListener("end",H),r.addEventListener("inputsourceschange",Z),w.xrCompatible!==!0&&await e.makeXRCompatible(),C=t.getPixelRatio(),t.getSize(A),x&&"createProjectionLayer"in XRWebGLBinding.prototype){let F=null,k=null,B=null;w.depth&&(B=w.stencil?e.DEPTH24_STENCIL8:e.DEPTH_COMPONENT24,F=w.stencil?es:ts,k=w.stencil?Qr:Bi);const K={colorFormat:e.RGBA8,depthFormat:B,scaleFactor:s};u=this.getBinding(),d=u.createProjectionLayer(K),r.updateRenderState({layers:[d]}),t.setPixelRatio(1),t.setSize(d.textureWidth,d.textureHeight,!1),M=new zi(d.textureWidth,d.textureHeight,{format:rn,type:Dn,depthTexture:new au(d.textureWidth,d.textureHeight,k,void 0,void 0,void 0,void 0,void 0,void 0,F),stencilBuffer:w.stencil,colorSpace:t.outputColorSpace,samples:w.antialias?4:0,resolveDepthBuffer:d.ignoreDepthValues===!1,resolveStencilBuffer:d.ignoreDepthValues===!1})}else{const F={antialias:w.antialias,alpha:!0,depth:w.depth,stencil:w.stencil,framebufferScaleFactor:s};f=new XRWebGLLayer(r,e,F),r.updateRenderState({baseLayer:f}),t.setPixelRatio(1),t.setSize(f.framebufferWidth,f.framebufferHeight,!1),M=new zi(f.framebufferWidth,f.framebufferHeight,{format:rn,type:Dn,colorSpace:t.outputColorSpace,stencilBuffer:w.stencil,resolveDepthBuffer:f.ignoreDepthValues===!1,resolveStencilBuffer:f.ignoreDepthValues===!1})}M.isXRRenderTarget=!0,this.setFoveation(c),l=null,a=await r.requestReferenceSpace(o),zt.setContext(r),zt.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(r!==null)return r.environmentBlendMode},this.getDepthTexture=function(){return g.getDepthTexture()};function Z(et){for(let lt=0;lt<et.removed.length;lt++){const F=et.removed[lt],k=E.indexOf(F);k>=0&&(E[k]=null,T[k].disconnect(F))}for(let lt=0;lt<et.added.length;lt++){const F=et.added[lt];let k=E.indexOf(F);if(k===-1){for(let K=0;K<T.length;K++)if(K>=E.length){E.push(F),k=K;break}else if(E[K]===null){E[K]=F,k=K;break}if(k===-1)break}const B=T[k];B&&B.connect(F)}}const V=new O,rt=new O;function ht(et,lt,F){V.setFromMatrixPosition(lt.matrixWorld),rt.setFromMatrixPosition(F.matrixWorld);const k=V.distanceTo(rt),B=lt.projectionMatrix.elements,K=F.projectionMatrix.elements,j=B[14]/(B[10]-1),P=B[14]/(B[10]+1),Q=(B[9]+1)/B[5],z=(B[9]-1)/B[5],G=(B[8]-1)/B[0],X=(K[8]+1)/K[0],tt=j*G,ot=j*X,ut=k/(-G+X),Pt=ut*-G;if(lt.matrixWorld.decompose(et.position,et.quaternion,et.scale),et.translateX(Pt),et.translateZ(ut),et.matrixWorld.compose(et.position,et.quaternion,et.scale),et.matrixWorldInverse.copy(et.matrixWorld).invert(),B[10]===-1)et.projectionMatrix.copy(lt.projectionMatrix),et.projectionMatrixInverse.copy(lt.projectionMatrixInverse);else{const Ht=j+ut,I=P+ut,R=tt-Pt,Y=ot+(k-Pt),nt=Q*P/I*Ht,pt=z*P/I*Ht;et.projectionMatrix.makePerspective(R,Y,nt,pt,Ht,I),et.projectionMatrixInverse.copy(et.projectionMatrix).invert()}}function dt(et,lt){lt===null?et.matrixWorld.copy(et.matrix):et.matrixWorld.multiplyMatrices(lt.matrixWorld,et.matrix),et.matrixWorldInverse.copy(et.matrixWorld).invert()}this.updateCamera=function(et){if(r===null)return;let lt=et.near,F=et.far;g.texture!==null&&(g.depthNear>0&&(lt=g.depthNear),g.depthFar>0&&(F=g.depthFar)),b.near=_.near=v.near=lt,b.far=_.far=v.far=F,(D!==b.near||U!==b.far)&&(r.updateRenderState({depthNear:b.near,depthFar:b.far}),D=b.near,U=b.far),b.layers.mask=et.layers.mask|6,v.layers.mask=b.layers.mask&3,_.layers.mask=b.layers.mask&5;const k=et.parent,B=b.cameras;dt(b,k);for(let K=0;K<B.length;K++)dt(B[K],k);B.length===2?ht(b,v,_):b.projectionMatrix.copy(v.projectionMatrix),mt(et,b,k)};function mt(et,lt,F){F===null?et.matrix.copy(lt.matrixWorld):(et.matrix.copy(F.matrixWorld),et.matrix.invert(),et.matrix.multiply(lt.matrixWorld)),et.matrix.decompose(et.position,et.quaternion,et.scale),et.updateMatrixWorld(!0),et.projectionMatrix.copy(lt.projectionMatrix),et.projectionMatrixInverse.copy(lt.projectionMatrixInverse),et.isPerspectiveCamera&&(et.fov=ns*2*Math.atan(1/et.projectionMatrix.elements[5]),et.zoom=1)}this.getCamera=function(){return b},this.getFoveation=function(){if(!(d===null&&f===null))return c},this.setFoveation=function(et){c=et,d!==null&&(d.fixedFoveation=et),f!==null&&f.fixedFoveation!==void 0&&(f.fixedFoveation=et)},this.hasDepthSensing=function(){return g.texture!==null},this.getDepthSensingMesh=function(){return g.getMesh(b)},this.getCameraTexture=function(et){return p[et]};let Et=null;function Ft(et,lt){if(h=lt.getViewerPose(l||a),m=lt,h!==null){const F=h.views;f!==null&&(t.setRenderTargetFramebuffer(M,f.framebuffer),t.setRenderTarget(M));let k=!1;F.length!==b.cameras.length&&(b.cameras.length=0,k=!0);for(let P=0;P<F.length;P++){const Q=F[P];let z=null;if(f!==null)z=f.getViewport(Q);else{const X=u.getViewSubImage(d,Q);z=X.viewport,P===0&&(t.setRenderTargetTextures(M,X.colorTexture,X.depthStencilTexture),t.setRenderTarget(M))}let G=S[P];G===void 0&&(G=new pn,G.layers.enable(P),G.viewport=new me,S[P]=G),G.matrix.fromArray(Q.transform.matrix),G.matrix.decompose(G.position,G.quaternion,G.scale),G.projectionMatrix.fromArray(Q.projectionMatrix),G.projectionMatrixInverse.copy(G.projectionMatrix).invert(),G.viewport.set(z.x,z.y,z.width,z.height),P===0&&(b.matrix.copy(G.matrix),b.matrix.decompose(b.position,b.quaternion,b.scale)),k===!0&&b.cameras.push(G)}const B=r.enabledFeatures;if(B&&B.includes("depth-sensing")&&r.depthUsage=="gpu-optimized"&&x){u=n.getBinding();const P=u.getDepthInformation(F[0]);P&&P.isValid&&P.texture&&g.init(P,r.renderState)}if(B&&B.includes("camera-access")&&x){t.state.unbindTexture(),u=n.getBinding();for(let P=0;P<F.length;P++){const Q=F[P].camera;if(Q){let z=p[Q];z||(z=new ou,p[Q]=z);const G=u.getCameraImage(Q);z.sourceTexture=G}}}}for(let F=0;F<T.length;F++){const k=E[F],B=T[F];k!==null&&B!==void 0&&B.update(k,lt,l||a)}Et&&Et(et,lt),lt.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:lt}),m=null}const zt=new Mu;zt.setAnimationLoop(Ft),this.setAnimationLoop=function(et){Et=et},this.dispose=function(){}}}const Ei=new mn,Av=new ie;function Rv(i,t){function e(g,p){g.matrixAutoUpdate===!0&&g.updateMatrix(),p.value.copy(g.matrix)}function n(g,p){p.color.getRGB(g.fogColor.value,tu(i)),p.isFog?(g.fogNear.value=p.near,g.fogFar.value=p.far):p.isFogExp2&&(g.fogDensity.value=p.density)}function r(g,p,w,y,M){p.isMeshBasicMaterial||p.isMeshLambertMaterial?s(g,p):p.isMeshToonMaterial?(s(g,p),u(g,p)):p.isMeshPhongMaterial?(s(g,p),h(g,p)):p.isMeshStandardMaterial?(s(g,p),d(g,p),p.isMeshPhysicalMaterial&&f(g,p,M)):p.isMeshMatcapMaterial?(s(g,p),m(g,p)):p.isMeshDepthMaterial?s(g,p):p.isMeshDistanceMaterial?(s(g,p),x(g,p)):p.isMeshNormalMaterial?s(g,p):p.isLineBasicMaterial?(a(g,p),p.isLineDashedMaterial&&o(g,p)):p.isPointsMaterial?c(g,p,w,y):p.isSpriteMaterial?l(g,p):p.isShadowMaterial?(g.color.value.copy(p.color),g.opacity.value=p.opacity):p.isShaderMaterial&&(p.uniformsNeedUpdate=!1)}function s(g,p){g.opacity.value=p.opacity,p.color&&g.diffuse.value.copy(p.color),p.emissive&&g.emissive.value.copy(p.emissive).multiplyScalar(p.emissiveIntensity),p.map&&(g.map.value=p.map,e(p.map,g.mapTransform)),p.alphaMap&&(g.alphaMap.value=p.alphaMap,e(p.alphaMap,g.alphaMapTransform)),p.bumpMap&&(g.bumpMap.value=p.bumpMap,e(p.bumpMap,g.bumpMapTransform),g.bumpScale.value=p.bumpScale,p.side===Ke&&(g.bumpScale.value*=-1)),p.normalMap&&(g.normalMap.value=p.normalMap,e(p.normalMap,g.normalMapTransform),g.normalScale.value.copy(p.normalScale),p.side===Ke&&g.normalScale.value.negate()),p.displacementMap&&(g.displacementMap.value=p.displacementMap,e(p.displacementMap,g.displacementMapTransform),g.displacementScale.value=p.displacementScale,g.displacementBias.value=p.displacementBias),p.emissiveMap&&(g.emissiveMap.value=p.emissiveMap,e(p.emissiveMap,g.emissiveMapTransform)),p.specularMap&&(g.specularMap.value=p.specularMap,e(p.specularMap,g.specularMapTransform)),p.alphaTest>0&&(g.alphaTest.value=p.alphaTest);const w=t.get(p),y=w.envMap,M=w.envMapRotation;y&&(g.envMap.value=y,Ei.copy(M),Ei.x*=-1,Ei.y*=-1,Ei.z*=-1,y.isCubeTexture&&y.isRenderTargetTexture===!1&&(Ei.y*=-1,Ei.z*=-1),g.envMapRotation.value.setFromMatrix4(Av.makeRotationFromEuler(Ei)),g.flipEnvMap.value=y.isCubeTexture&&y.isRenderTargetTexture===!1?-1:1,g.reflectivity.value=p.reflectivity,g.ior.value=p.ior,g.refractionRatio.value=p.refractionRatio),p.lightMap&&(g.lightMap.value=p.lightMap,g.lightMapIntensity.value=p.lightMapIntensity,e(p.lightMap,g.lightMapTransform)),p.aoMap&&(g.aoMap.value=p.aoMap,g.aoMapIntensity.value=p.aoMapIntensity,e(p.aoMap,g.aoMapTransform))}function a(g,p){g.diffuse.value.copy(p.color),g.opacity.value=p.opacity,p.map&&(g.map.value=p.map,e(p.map,g.mapTransform))}function o(g,p){g.dashSize.value=p.dashSize,g.totalSize.value=p.dashSize+p.gapSize,g.scale.value=p.scale}function c(g,p,w,y){g.diffuse.value.copy(p.color),g.opacity.value=p.opacity,g.size.value=p.size*w,g.scale.value=y*.5,p.map&&(g.map.value=p.map,e(p.map,g.uvTransform)),p.alphaMap&&(g.alphaMap.value=p.alphaMap,e(p.alphaMap,g.alphaMapTransform)),p.alphaTest>0&&(g.alphaTest.value=p.alphaTest)}function l(g,p){g.diffuse.value.copy(p.color),g.opacity.value=p.opacity,g.rotation.value=p.rotation,p.map&&(g.map.value=p.map,e(p.map,g.mapTransform)),p.alphaMap&&(g.alphaMap.value=p.alphaMap,e(p.alphaMap,g.alphaMapTransform)),p.alphaTest>0&&(g.alphaTest.value=p.alphaTest)}function h(g,p){g.specular.value.copy(p.specular),g.shininess.value=Math.max(p.shininess,1e-4)}function u(g,p){p.gradientMap&&(g.gradientMap.value=p.gradientMap)}function d(g,p){g.metalness.value=p.metalness,p.metalnessMap&&(g.metalnessMap.value=p.metalnessMap,e(p.metalnessMap,g.metalnessMapTransform)),g.roughness.value=p.roughness,p.roughnessMap&&(g.roughnessMap.value=p.roughnessMap,e(p.roughnessMap,g.roughnessMapTransform)),p.envMap&&(g.envMapIntensity.value=p.envMapIntensity)}function f(g,p,w){g.ior.value=p.ior,p.sheen>0&&(g.sheenColor.value.copy(p.sheenColor).multiplyScalar(p.sheen),g.sheenRoughness.value=p.sheenRoughness,p.sheenColorMap&&(g.sheenColorMap.value=p.sheenColorMap,e(p.sheenColorMap,g.sheenColorMapTransform)),p.sheenRoughnessMap&&(g.sheenRoughnessMap.value=p.sheenRoughnessMap,e(p.sheenRoughnessMap,g.sheenRoughnessMapTransform))),p.clearcoat>0&&(g.clearcoat.value=p.clearcoat,g.clearcoatRoughness.value=p.clearcoatRoughness,p.clearcoatMap&&(g.clearcoatMap.value=p.clearcoatMap,e(p.clearcoatMap,g.clearcoatMapTransform)),p.clearcoatRoughnessMap&&(g.clearcoatRoughnessMap.value=p.clearcoatRoughnessMap,e(p.clearcoatRoughnessMap,g.clearcoatRoughnessMapTransform)),p.clearcoatNormalMap&&(g.clearcoatNormalMap.value=p.clearcoatNormalMap,e(p.clearcoatNormalMap,g.clearcoatNormalMapTransform),g.clearcoatNormalScale.value.copy(p.clearcoatNormalScale),p.side===Ke&&g.clearcoatNormalScale.value.negate())),p.dispersion>0&&(g.dispersion.value=p.dispersion),p.iridescence>0&&(g.iridescence.value=p.iridescence,g.iridescenceIOR.value=p.iridescenceIOR,g.iridescenceThicknessMinimum.value=p.iridescenceThicknessRange[0],g.iridescenceThicknessMaximum.value=p.iridescenceThicknessRange[1],p.iridescenceMap&&(g.iridescenceMap.value=p.iridescenceMap,e(p.iridescenceMap,g.iridescenceMapTransform)),p.iridescenceThicknessMap&&(g.iridescenceThicknessMap.value=p.iridescenceThicknessMap,e(p.iridescenceThicknessMap,g.iridescenceThicknessMapTransform))),p.transmission>0&&(g.transmission.value=p.transmission,g.transmissionSamplerMap.value=w.texture,g.transmissionSamplerSize.value.set(w.width,w.height),p.transmissionMap&&(g.transmissionMap.value=p.transmissionMap,e(p.transmissionMap,g.transmissionMapTransform)),g.thickness.value=p.thickness,p.thicknessMap&&(g.thicknessMap.value=p.thicknessMap,e(p.thicknessMap,g.thicknessMapTransform)),g.attenuationDistance.value=p.attenuationDistance,g.attenuationColor.value.copy(p.attenuationColor)),p.anisotropy>0&&(g.anisotropyVector.value.set(p.anisotropy*Math.cos(p.anisotropyRotation),p.anisotropy*Math.sin(p.anisotropyRotation)),p.anisotropyMap&&(g.anisotropyMap.value=p.anisotropyMap,e(p.anisotropyMap,g.anisotropyMapTransform))),g.specularIntensity.value=p.specularIntensity,g.specularColor.value.copy(p.specularColor),p.specularColorMap&&(g.specularColorMap.value=p.specularColorMap,e(p.specularColorMap,g.specularColorMapTransform)),p.specularIntensityMap&&(g.specularIntensityMap.value=p.specularIntensityMap,e(p.specularIntensityMap,g.specularIntensityMapTransform))}function m(g,p){p.matcap&&(g.matcap.value=p.matcap)}function x(g,p){const w=t.get(p).light;g.referencePosition.value.setFromMatrixPosition(w.matrixWorld),g.nearDistance.value=w.shadow.camera.near,g.farDistance.value=w.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:r}}function Cv(i,t,e,n){let r={},s={},a=[];const o=i.getParameter(i.MAX_UNIFORM_BUFFER_BINDINGS);function c(w,y){const M=y.program;n.uniformBlockBinding(w,M)}function l(w,y){let M=r[w.id];M===void 0&&(m(w),M=h(w),r[w.id]=M,w.addEventListener("dispose",g));const T=y.program;n.updateUBOMapping(w,T);const E=t.render.frame;s[w.id]!==E&&(d(w),s[w.id]=E)}function h(w){const y=u();w.__bindingPointIndex=y;const M=i.createBuffer(),T=w.__size,E=w.usage;return i.bindBuffer(i.UNIFORM_BUFFER,M),i.bufferData(i.UNIFORM_BUFFER,T,E),i.bindBuffer(i.UNIFORM_BUFFER,null),i.bindBufferBase(i.UNIFORM_BUFFER,y,M),M}function u(){for(let w=0;w<o;w++)if(a.indexOf(w)===-1)return a.push(w),w;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function d(w){const y=r[w.id],M=w.uniforms,T=w.__cache;i.bindBuffer(i.UNIFORM_BUFFER,y);for(let E=0,A=M.length;E<A;E++){const C=Array.isArray(M[E])?M[E]:[M[E]];for(let v=0,_=C.length;v<_;v++){const S=C[v];if(f(S,E,v,T)===!0){const b=S.__offset,D=Array.isArray(S.value)?S.value:[S.value];let U=0;for(let N=0;N<D.length;N++){const H=D[N],Z=x(H);typeof H=="number"||typeof H=="boolean"?(S.__data[0]=H,i.bufferSubData(i.UNIFORM_BUFFER,b+U,S.__data)):H.isMatrix3?(S.__data[0]=H.elements[0],S.__data[1]=H.elements[1],S.__data[2]=H.elements[2],S.__data[3]=0,S.__data[4]=H.elements[3],S.__data[5]=H.elements[4],S.__data[6]=H.elements[5],S.__data[7]=0,S.__data[8]=H.elements[6],S.__data[9]=H.elements[7],S.__data[10]=H.elements[8],S.__data[11]=0):(H.toArray(S.__data,U),U+=Z.storage/Float32Array.BYTES_PER_ELEMENT)}i.bufferSubData(i.UNIFORM_BUFFER,b,S.__data)}}}i.bindBuffer(i.UNIFORM_BUFFER,null)}function f(w,y,M,T){const E=w.value,A=y+"_"+M;if(T[A]===void 0)return typeof E=="number"||typeof E=="boolean"?T[A]=E:T[A]=E.clone(),!0;{const C=T[A];if(typeof E=="number"||typeof E=="boolean"){if(C!==E)return T[A]=E,!0}else if(C.equals(E)===!1)return C.copy(E),!0}return!1}function m(w){const y=w.uniforms;let M=0;const T=16;for(let A=0,C=y.length;A<C;A++){const v=Array.isArray(y[A])?y[A]:[y[A]];for(let _=0,S=v.length;_<S;_++){const b=v[_],D=Array.isArray(b.value)?b.value:[b.value];for(let U=0,N=D.length;U<N;U++){const H=D[U],Z=x(H),V=M%T,rt=V%Z.boundary,ht=V+rt;M+=rt,ht!==0&&T-ht<Z.storage&&(M+=T-ht),b.__data=new Float32Array(Z.storage/Float32Array.BYTES_PER_ELEMENT),b.__offset=M,M+=Z.storage}}}const E=M%T;return E>0&&(M+=T-E),w.__size=M,w.__cache={},this}function x(w){const y={boundary:0,storage:0};return typeof w=="number"||typeof w=="boolean"?(y.boundary=4,y.storage=4):w.isVector2?(y.boundary=8,y.storage=8):w.isVector3||w.isColor?(y.boundary=16,y.storage=12):w.isVector4?(y.boundary=16,y.storage=16):w.isMatrix3?(y.boundary=48,y.storage=48):w.isMatrix4?(y.boundary=64,y.storage=64):w.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",w),y}function g(w){const y=w.target;y.removeEventListener("dispose",g);const M=a.indexOf(y.__bindingPointIndex);a.splice(M,1),i.deleteBuffer(r[y.id]),delete r[y.id],delete s[y.id]}function p(){for(const w in r)i.deleteBuffer(r[w]);a=[],r={},s={}}return{bind:c,update:l,dispose:p}}class Lv{constructor(t={}){const{canvas:e=Rd(),context:n=null,depth:r=!0,stencil:s=!1,alpha:a=!1,antialias:o=!1,premultipliedAlpha:c=!0,preserveDrawingBuffer:l=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:u=!1,reversedDepthBuffer:d=!1}=t;this.isWebGLRenderer=!0;let f;if(n!==null){if(typeof WebGLRenderingContext<"u"&&n instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");f=n.getContextAttributes().alpha}else f=a;const m=new Uint32Array(4),x=new Int32Array(4);let g=null,p=null;const w=[],y=[];this.domElement=e,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=ui,this.toneMappingExposure=1,this.transmissionResolutionScale=1;const M=this;let T=!1;this._outputColorSpace=nn;let E=0,A=0,C=null,v=-1,_=null;const S=new me,b=new me;let D=null;const U=new Gt(0);let N=0,H=e.width,Z=e.height,V=1,rt=null,ht=null;const dt=new me(0,0,H,Z),mt=new me(0,0,H,Z);let Et=!1;const Ft=new vc;let zt=!1,et=!1;const lt=new ie,F=new O,k=new me,B={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let K=!1;function j(){return C===null?V:1}let P=n;function Q(L,$){return e.getContext(L,$)}try{const L={alpha:!0,depth:r,stencil:s,antialias:o,premultipliedAlpha:c,preserveDrawingBuffer:l,powerPreference:h,failIfMajorPerformanceCaveat:u};if("setAttribute"in e&&e.setAttribute("data-engine",`three.js r${oc}`),e.addEventListener("webglcontextlost",yt,!1),e.addEventListener("webglcontextrestored",Lt,!1),e.addEventListener("webglcontextcreationerror",vt,!1),P===null){const $="webgl2";if(P=Q($,L),P===null)throw Q($)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(L){throw console.error("THREE.WebGLRenderer: "+L.message),L}let z,G,X,tt,ot,ut,Pt,Ht,I,R,Y,nt,pt,at,Ot,Mt,It,Ut,gt,Rt,Yt,kt,Tt,Kt;function W(){z=new zm(P),z.init(),kt=new yv(P,z),G=new Im(P,z,t,kt),X=new Mv(P,z),G.reversedDepthBuffer&&d&&X.buffers.depth.setReversed(!0),tt=new Gm(P),ot=new ov,ut=new Sv(P,z,X,ot,G,kt,tt),Pt=new Nm(M),Ht=new km(M),I=new Zp(P),Tt=new Pm(P,I),R=new Hm(P,I,tt,Tt),Y=new Xm(P,R,I,tt),gt=new Wm(P,G,ut),Mt=new Um(ot),nt=new av(M,Pt,Ht,z,G,Tt,Mt),pt=new Rv(M,ot),at=new lv,Ot=new mv(z),Ut=new Lm(M,Pt,Ht,X,Y,f,c),It=new _v(M,Y,G),Kt=new Cv(P,tt,G,X),Rt=new Dm(P,z,tt),Yt=new Vm(P,z,tt),tt.programs=nt.programs,M.capabilities=G,M.extensions=z,M.properties=ot,M.renderLists=at,M.shadowMap=It,M.state=X,M.info=tt}W();const xt=new Tv(M,P);this.xr=xt,this.getContext=function(){return P},this.getContextAttributes=function(){return P.getContextAttributes()},this.forceContextLoss=function(){const L=z.get("WEBGL_lose_context");L&&L.loseContext()},this.forceContextRestore=function(){const L=z.get("WEBGL_lose_context");L&&L.restoreContext()},this.getPixelRatio=function(){return V},this.setPixelRatio=function(L){L!==void 0&&(V=L,this.setSize(H,Z,!1))},this.getSize=function(L){return L.set(H,Z)},this.setSize=function(L,$,it=!0){if(xt.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}H=L,Z=$,e.width=Math.floor(L*V),e.height=Math.floor($*V),it===!0&&(e.style.width=L+"px",e.style.height=$+"px"),this.setViewport(0,0,L,$)},this.getDrawingBufferSize=function(L){return L.set(H*V,Z*V).floor()},this.setDrawingBufferSize=function(L,$,it){H=L,Z=$,V=it,e.width=Math.floor(L*it),e.height=Math.floor($*it),this.setViewport(0,0,L,$)},this.getCurrentViewport=function(L){return L.copy(S)},this.getViewport=function(L){return L.copy(dt)},this.setViewport=function(L,$,it,st){L.isVector4?dt.set(L.x,L.y,L.z,L.w):dt.set(L,$,it,st),X.viewport(S.copy(dt).multiplyScalar(V).round())},this.getScissor=function(L){return L.copy(mt)},this.setScissor=function(L,$,it,st){L.isVector4?mt.set(L.x,L.y,L.z,L.w):mt.set(L,$,it,st),X.scissor(b.copy(mt).multiplyScalar(V).round())},this.getScissorTest=function(){return Et},this.setScissorTest=function(L){X.setScissorTest(Et=L)},this.setOpaqueSort=function(L){rt=L},this.setTransparentSort=function(L){ht=L},this.getClearColor=function(L){return L.copy(Ut.getClearColor())},this.setClearColor=function(){Ut.setClearColor(...arguments)},this.getClearAlpha=function(){return Ut.getClearAlpha()},this.setClearAlpha=function(){Ut.setClearAlpha(...arguments)},this.clear=function(L=!0,$=!0,it=!0){let st=0;if(L){let J=!1;if(C!==null){const _t=C.texture.format;J=_t===dc||_t===fc||_t===uc}if(J){const _t=C.texture.type,At=_t===Dn||_t===Bi||_t===jr||_t===Qr||_t===lc||_t===hc,Dt=Ut.getClearColor(),Ct=Ut.getClearAlpha(),qt=Dt.r,$t=Dt.g,Vt=Dt.b;At?(m[0]=qt,m[1]=$t,m[2]=Vt,m[3]=Ct,P.clearBufferuiv(P.COLOR,0,m)):(x[0]=qt,x[1]=$t,x[2]=Vt,x[3]=Ct,P.clearBufferiv(P.COLOR,0,x))}else st|=P.COLOR_BUFFER_BIT}$&&(st|=P.DEPTH_BUFFER_BIT),it&&(st|=P.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),P.clear(st)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){e.removeEventListener("webglcontextlost",yt,!1),e.removeEventListener("webglcontextrestored",Lt,!1),e.removeEventListener("webglcontextcreationerror",vt,!1),Ut.dispose(),at.dispose(),Ot.dispose(),ot.dispose(),Pt.dispose(),Ht.dispose(),Y.dispose(),Tt.dispose(),Kt.dispose(),nt.dispose(),xt.dispose(),xt.removeEventListener("sessionstart",bn),xt.removeEventListener("sessionend",Uc),vi.stop()};function yt(L){L.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),T=!0}function Lt(){console.log("THREE.WebGLRenderer: Context Restored."),T=!1;const L=tt.autoReset,$=It.enabled,it=It.autoUpdate,st=It.needsUpdate,J=It.type;W(),tt.autoReset=L,It.enabled=$,It.autoUpdate=it,It.needsUpdate=st,It.type=J}function vt(L){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",L.statusMessage)}function ft(L){const $=L.target;$.removeEventListener("dispose",ft),Nt($)}function Nt(L){Zt(L),ot.remove(L)}function Zt(L){const $=ot.get(L).programs;$!==void 0&&($.forEach(function(it){nt.releaseProgram(it)}),L.isShaderMaterial&&nt.releaseShaderCache(L))}this.renderBufferDirect=function(L,$,it,st,J,_t){$===null&&($=B);const At=J.isMesh&&J.matrixWorld.determinant()<0,Dt=of(L,$,it,st,J);X.setMaterial(st,At);let Ct=it.index,qt=1;if(st.wireframe===!0){if(Ct=R.getWireframeAttribute(it),Ct===void 0)return;qt=2}const $t=it.drawRange,Vt=it.attributes.position;let ne=$t.start*qt,le=($t.start+$t.count)*qt;_t!==null&&(ne=Math.max(ne,_t.start*qt),le=Math.min(le,(_t.start+_t.count)*qt)),Ct!==null?(ne=Math.max(ne,0),le=Math.min(le,Ct.count)):Vt!=null&&(ne=Math.max(ne,0),le=Math.min(le,Vt.count));const ye=le-ne;if(ye<0||ye===1/0)return;Tt.setup(J,st,Dt,it,Ct);let ge,ue=Rt;if(Ct!==null&&(ge=I.get(Ct),ue=Yt,ue.setIndex(ge)),J.isMesh)st.wireframe===!0?(X.setLineWidth(st.wireframeLinewidth*j()),ue.setMode(P.LINES)):ue.setMode(P.TRIANGLES);else if(J.isLine){let Wt=st.linewidth;Wt===void 0&&(Wt=1),X.setLineWidth(Wt*j()),J.isLineSegments?ue.setMode(P.LINES):J.isLineLoop?ue.setMode(P.LINE_LOOP):ue.setMode(P.LINE_STRIP)}else J.isPoints?ue.setMode(P.POINTS):J.isSprite&&ue.setMode(P.TRIANGLES);if(J.isBatchedMesh)if(J._multiDrawInstances!==null)is("THREE.WebGLRenderer: renderMultiDrawInstances has been deprecated and will be removed in r184. Append to renderMultiDraw arguments and use indirection."),ue.renderMultiDrawInstances(J._multiDrawStarts,J._multiDrawCounts,J._multiDrawCount,J._multiDrawInstances);else if(z.get("WEBGL_multi_draw"))ue.renderMultiDraw(J._multiDrawStarts,J._multiDrawCounts,J._multiDrawCount);else{const Wt=J._multiDrawStarts,_e=J._multiDrawCounts,re=J._multiDrawCount,je=Ct?I.get(Ct).bytesPerElement:1,Xi=ot.get(st).currentProgram.getUniforms();for(let Qe=0;Qe<re;Qe++)Xi.setValue(P,"_gl_DrawID",Qe),ue.render(Wt[Qe]/je,_e[Qe])}else if(J.isInstancedMesh)ue.renderInstances(ne,ye,J.count);else if(it.isInstancedBufferGeometry){const Wt=it._maxInstanceCount!==void 0?it._maxInstanceCount:1/0,_e=Math.min(it.instanceCount,Wt);ue.renderInstances(ne,ye,_e)}else ue.render(ne,ye)};function de(L,$,it){L.transparent===!0&&L.side===Sn&&L.forceSinglePass===!1?(L.side=Ke,L.needsUpdate=!0,ms(L,$,it),L.side=pi,L.needsUpdate=!0,ms(L,$,it),L.side=Sn):ms(L,$,it)}this.compile=function(L,$,it=null){it===null&&(it=L),p=Ot.get(it),p.init($),y.push(p),it.traverseVisible(function(J){J.isLight&&J.layers.test($.layers)&&(p.pushLight(J),J.castShadow&&p.pushShadow(J))}),L!==it&&L.traverseVisible(function(J){J.isLight&&J.layers.test($.layers)&&(p.pushLight(J),J.castShadow&&p.pushShadow(J))}),p.setupLights();const st=new Set;return L.traverse(function(J){if(!(J.isMesh||J.isPoints||J.isLine||J.isSprite))return;const _t=J.material;if(_t)if(Array.isArray(_t))for(let At=0;At<_t.length;At++){const Dt=_t[At];de(Dt,it,J),st.add(Dt)}else de(_t,it,J),st.add(_t)}),p=y.pop(),st},this.compileAsync=function(L,$,it=null){const st=this.compile(L,$,it);return new Promise(J=>{function _t(){if(st.forEach(function(At){ot.get(At).currentProgram.isReady()&&st.delete(At)}),st.size===0){J(L);return}setTimeout(_t,10)}z.get("KHR_parallel_shader_compile")!==null?_t():setTimeout(_t,10)})};let ae=null;function Un(L){ae&&ae(L)}function bn(){vi.stop()}function Uc(){vi.start()}const vi=new Mu;vi.setAnimationLoop(Un),typeof self<"u"&&vi.setContext(self),this.setAnimationLoop=function(L){ae=L,xt.setAnimationLoop(L),L===null?vi.stop():vi.start()},xt.addEventListener("sessionstart",bn),xt.addEventListener("sessionend",Uc),this.render=function(L,$){if($!==void 0&&$.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(T===!0)return;if(L.matrixWorldAutoUpdate===!0&&L.updateMatrixWorld(),$.parent===null&&$.matrixWorldAutoUpdate===!0&&$.updateMatrixWorld(),xt.enabled===!0&&xt.isPresenting===!0&&(xt.cameraAutoUpdate===!0&&xt.updateCamera($),$=xt.getCamera()),L.isScene===!0&&L.onBeforeRender(M,L,$,C),p=Ot.get(L,y.length),p.init($),y.push(p),lt.multiplyMatrices($.projectionMatrix,$.matrixWorldInverse),Ft.setFromProjectionMatrix(lt,Ln,$.reversedDepth),et=this.localClippingEnabled,zt=Mt.init(this.clippingPlanes,et),g=at.get(L,w.length),g.init(),w.push(g),xt.enabled===!0&&xt.isPresenting===!0){const _t=M.xr.getDepthSensingMesh();_t!==null&&_a(_t,$,-1/0,M.sortObjects)}_a(L,$,0,M.sortObjects),g.finish(),M.sortObjects===!0&&g.sort(rt,ht),K=xt.enabled===!1||xt.isPresenting===!1||xt.hasDepthSensing()===!1,K&&Ut.addToRenderList(g,L),this.info.render.frame++,zt===!0&&Mt.beginShadows();const it=p.state.shadowsArray;It.render(it,L,$),zt===!0&&Mt.endShadows(),this.info.autoReset===!0&&this.info.reset();const st=g.opaque,J=g.transmissive;if(p.setupLights(),$.isArrayCamera){const _t=$.cameras;if(J.length>0)for(let At=0,Dt=_t.length;At<Dt;At++){const Ct=_t[At];Fc(st,J,L,Ct)}K&&Ut.render(L);for(let At=0,Dt=_t.length;At<Dt;At++){const Ct=_t[At];Nc(g,L,Ct,Ct.viewport)}}else J.length>0&&Fc(st,J,L,$),K&&Ut.render(L),Nc(g,L,$);C!==null&&A===0&&(ut.updateMultisampleRenderTarget(C),ut.updateRenderTargetMipmap(C)),L.isScene===!0&&L.onAfterRender(M,L,$),Tt.resetDefaultState(),v=-1,_=null,y.pop(),y.length>0?(p=y[y.length-1],zt===!0&&Mt.setGlobalState(M.clippingPlanes,p.state.camera)):p=null,w.pop(),w.length>0?g=w[w.length-1]:g=null};function _a(L,$,it,st){if(L.visible===!1)return;if(L.layers.test($.layers)){if(L.isGroup)it=L.renderOrder;else if(L.isLOD)L.autoUpdate===!0&&L.update($);else if(L.isLight)p.pushLight(L),L.castShadow&&p.pushShadow(L);else if(L.isSprite){if(!L.frustumCulled||Ft.intersectsSprite(L)){st&&k.setFromMatrixPosition(L.matrixWorld).applyMatrix4(lt);const At=Y.update(L),Dt=L.material;Dt.visible&&g.push(L,At,Dt,it,k.z,null)}}else if((L.isMesh||L.isLine||L.isPoints)&&(!L.frustumCulled||Ft.intersectsObject(L))){const At=Y.update(L),Dt=L.material;if(st&&(L.boundingSphere!==void 0?(L.boundingSphere===null&&L.computeBoundingSphere(),k.copy(L.boundingSphere.center)):(At.boundingSphere===null&&At.computeBoundingSphere(),k.copy(At.boundingSphere.center)),k.applyMatrix4(L.matrixWorld).applyMatrix4(lt)),Array.isArray(Dt)){const Ct=At.groups;for(let qt=0,$t=Ct.length;qt<$t;qt++){const Vt=Ct[qt],ne=Dt[Vt.materialIndex];ne&&ne.visible&&g.push(L,At,ne,it,k.z,Vt)}}else Dt.visible&&g.push(L,At,Dt,it,k.z,null)}}const _t=L.children;for(let At=0,Dt=_t.length;At<Dt;At++)_a(_t[At],$,it,st)}function Nc(L,$,it,st){const J=L.opaque,_t=L.transmissive,At=L.transparent;p.setupLightsView(it),zt===!0&&Mt.setGlobalState(M.clippingPlanes,it),st&&X.viewport(S.copy(st)),J.length>0&&ps(J,$,it),_t.length>0&&ps(_t,$,it),At.length>0&&ps(At,$,it),X.buffers.depth.setTest(!0),X.buffers.depth.setMask(!0),X.buffers.color.setMask(!0),X.setPolygonOffset(!1)}function Fc(L,$,it,st){if((it.isScene===!0?it.overrideMaterial:null)!==null)return;p.state.transmissionRenderTarget[st.id]===void 0&&(p.state.transmissionRenderTarget[st.id]=new zi(1,1,{generateMipmaps:!0,type:z.has("EXT_color_buffer_half_float")||z.has("EXT_color_buffer_float")?wr:Dn,minFilter:Di,samples:4,stencilBuffer:s,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:se.workingColorSpace}));const _t=p.state.transmissionRenderTarget[st.id],At=st.viewport||S;_t.setSize(At.z*M.transmissionResolutionScale,At.w*M.transmissionResolutionScale);const Dt=M.getRenderTarget(),Ct=M.getActiveCubeFace(),qt=M.getActiveMipmapLevel();M.setRenderTarget(_t),M.getClearColor(U),N=M.getClearAlpha(),N<1&&M.setClearColor(16777215,.5),M.clear(),K&&Ut.render(it);const $t=M.toneMapping;M.toneMapping=ui;const Vt=st.viewport;if(st.viewport!==void 0&&(st.viewport=void 0),p.setupLightsView(st),zt===!0&&Mt.setGlobalState(M.clippingPlanes,st),ps(L,it,st),ut.updateMultisampleRenderTarget(_t),ut.updateRenderTargetMipmap(_t),z.has("WEBGL_multisampled_render_to_texture")===!1){let ne=!1;for(let le=0,ye=$.length;le<ye;le++){const ge=$[le],ue=ge.object,Wt=ge.geometry,_e=ge.material,re=ge.group;if(_e.side===Sn&&ue.layers.test(st.layers)){const je=_e.side;_e.side=Ke,_e.needsUpdate=!0,Oc(ue,it,st,Wt,_e,re),_e.side=je,_e.needsUpdate=!0,ne=!0}}ne===!0&&(ut.updateMultisampleRenderTarget(_t),ut.updateRenderTargetMipmap(_t))}M.setRenderTarget(Dt,Ct,qt),M.setClearColor(U,N),Vt!==void 0&&(st.viewport=Vt),M.toneMapping=$t}function ps(L,$,it){const st=$.isScene===!0?$.overrideMaterial:null;for(let J=0,_t=L.length;J<_t;J++){const At=L[J],Dt=At.object,Ct=At.geometry,qt=At.group;let $t=At.material;$t.allowOverride===!0&&st!==null&&($t=st),Dt.layers.test(it.layers)&&Oc(Dt,$,it,Ct,$t,qt)}}function Oc(L,$,it,st,J,_t){L.onBeforeRender(M,$,it,st,J,_t),L.modelViewMatrix.multiplyMatrices(it.matrixWorldInverse,L.matrixWorld),L.normalMatrix.getNormalMatrix(L.modelViewMatrix),J.onBeforeRender(M,$,it,st,L,_t),J.transparent===!0&&J.side===Sn&&J.forceSinglePass===!1?(J.side=Ke,J.needsUpdate=!0,M.renderBufferDirect(it,$,st,J,L,_t),J.side=pi,J.needsUpdate=!0,M.renderBufferDirect(it,$,st,J,L,_t),J.side=Sn):M.renderBufferDirect(it,$,st,J,L,_t),L.onAfterRender(M,$,it,st,J,_t)}function ms(L,$,it){$.isScene!==!0&&($=B);const st=ot.get(L),J=p.state.lights,_t=p.state.shadowsArray,At=J.state.version,Dt=nt.getParameters(L,J.state,_t,$,it),Ct=nt.getProgramCacheKey(Dt);let qt=st.programs;st.environment=L.isMeshStandardMaterial?$.environment:null,st.fog=$.fog,st.envMap=(L.isMeshStandardMaterial?Ht:Pt).get(L.envMap||st.environment),st.envMapRotation=st.environment!==null&&L.envMap===null?$.environmentRotation:L.envMapRotation,qt===void 0&&(L.addEventListener("dispose",ft),qt=new Map,st.programs=qt);let $t=qt.get(Ct);if($t!==void 0){if(st.currentProgram===$t&&st.lightsStateVersion===At)return kc(L,Dt),$t}else Dt.uniforms=nt.getUniforms(L),L.onBeforeCompile(Dt,M),$t=nt.acquireProgram(Dt,Ct),qt.set(Ct,$t),st.uniforms=Dt.uniforms;const Vt=st.uniforms;return(!L.isShaderMaterial&&!L.isRawShaderMaterial||L.clipping===!0)&&(Vt.clippingPlanes=Mt.uniform),kc(L,Dt),st.needsLights=lf(L),st.lightsStateVersion=At,st.needsLights&&(Vt.ambientLightColor.value=J.state.ambient,Vt.lightProbe.value=J.state.probe,Vt.directionalLights.value=J.state.directional,Vt.directionalLightShadows.value=J.state.directionalShadow,Vt.spotLights.value=J.state.spot,Vt.spotLightShadows.value=J.state.spotShadow,Vt.rectAreaLights.value=J.state.rectArea,Vt.ltc_1.value=J.state.rectAreaLTC1,Vt.ltc_2.value=J.state.rectAreaLTC2,Vt.pointLights.value=J.state.point,Vt.pointLightShadows.value=J.state.pointShadow,Vt.hemisphereLights.value=J.state.hemi,Vt.directionalShadowMap.value=J.state.directionalShadowMap,Vt.directionalShadowMatrix.value=J.state.directionalShadowMatrix,Vt.spotShadowMap.value=J.state.spotShadowMap,Vt.spotLightMatrix.value=J.state.spotLightMatrix,Vt.spotLightMap.value=J.state.spotLightMap,Vt.pointShadowMap.value=J.state.pointShadowMap,Vt.pointShadowMatrix.value=J.state.pointShadowMatrix),st.currentProgram=$t,st.uniformsList=null,$t}function Bc(L){if(L.uniformsList===null){const $=L.currentProgram.getUniforms();L.uniformsList=na.seqWithValue($.seq,L.uniforms)}return L.uniformsList}function kc(L,$){const it=ot.get(L);it.outputColorSpace=$.outputColorSpace,it.batching=$.batching,it.batchingColor=$.batchingColor,it.instancing=$.instancing,it.instancingColor=$.instancingColor,it.instancingMorph=$.instancingMorph,it.skinning=$.skinning,it.morphTargets=$.morphTargets,it.morphNormals=$.morphNormals,it.morphColors=$.morphColors,it.morphTargetsCount=$.morphTargetsCount,it.numClippingPlanes=$.numClippingPlanes,it.numIntersection=$.numClipIntersection,it.vertexAlphas=$.vertexAlphas,it.vertexTangents=$.vertexTangents,it.toneMapping=$.toneMapping}function of(L,$,it,st,J){$.isScene!==!0&&($=B),ut.resetTextureUnits();const _t=$.fog,At=st.isMeshStandardMaterial?$.environment:null,Dt=C===null?M.outputColorSpace:C.isXRRenderTarget===!0?C.texture.colorSpace:ki,Ct=(st.isMeshStandardMaterial?Ht:Pt).get(st.envMap||At),qt=st.vertexColors===!0&&!!it.attributes.color&&it.attributes.color.itemSize===4,$t=!!it.attributes.tangent&&(!!st.normalMap||st.anisotropy>0),Vt=!!it.morphAttributes.position,ne=!!it.morphAttributes.normal,le=!!it.morphAttributes.color;let ye=ui;st.toneMapped&&(C===null||C.isXRRenderTarget===!0)&&(ye=M.toneMapping);const ge=it.morphAttributes.position||it.morphAttributes.normal||it.morphAttributes.color,ue=ge!==void 0?ge.length:0,Wt=ot.get(st),_e=p.state.lights;if(zt===!0&&(et===!0||L!==_)){const Ve=L===_&&st.id===v;Mt.setState(st,L,Ve)}let re=!1;st.version===Wt.__version?(Wt.needsLights&&Wt.lightsStateVersion!==_e.state.version||Wt.outputColorSpace!==Dt||J.isBatchedMesh&&Wt.batching===!1||!J.isBatchedMesh&&Wt.batching===!0||J.isBatchedMesh&&Wt.batchingColor===!0&&J.colorTexture===null||J.isBatchedMesh&&Wt.batchingColor===!1&&J.colorTexture!==null||J.isInstancedMesh&&Wt.instancing===!1||!J.isInstancedMesh&&Wt.instancing===!0||J.isSkinnedMesh&&Wt.skinning===!1||!J.isSkinnedMesh&&Wt.skinning===!0||J.isInstancedMesh&&Wt.instancingColor===!0&&J.instanceColor===null||J.isInstancedMesh&&Wt.instancingColor===!1&&J.instanceColor!==null||J.isInstancedMesh&&Wt.instancingMorph===!0&&J.morphTexture===null||J.isInstancedMesh&&Wt.instancingMorph===!1&&J.morphTexture!==null||Wt.envMap!==Ct||st.fog===!0&&Wt.fog!==_t||Wt.numClippingPlanes!==void 0&&(Wt.numClippingPlanes!==Mt.numPlanes||Wt.numIntersection!==Mt.numIntersection)||Wt.vertexAlphas!==qt||Wt.vertexTangents!==$t||Wt.morphTargets!==Vt||Wt.morphNormals!==ne||Wt.morphColors!==le||Wt.toneMapping!==ye||Wt.morphTargetsCount!==ue)&&(re=!0):(re=!0,Wt.__version=st.version);let je=Wt.currentProgram;re===!0&&(je=ms(st,$,J));let Xi=!1,Qe=!1,Dr=!1;const xe=je.getUniforms(),on=Wt.uniforms;if(X.useProgram(je.program)&&(Xi=!0,Qe=!0,Dr=!0),st.id!==v&&(v=st.id,Qe=!0),Xi||_!==L){X.buffers.depth.getReversed()&&L.reversedDepth!==!0&&(L._reversedDepth=!0,L.updateProjectionMatrix()),xe.setValue(P,"projectionMatrix",L.projectionMatrix),xe.setValue(P,"viewMatrix",L.matrixWorldInverse);const Ye=xe.map.cameraPosition;Ye!==void 0&&Ye.setValue(P,F.setFromMatrixPosition(L.matrixWorld)),G.logarithmicDepthBuffer&&xe.setValue(P,"logDepthBufFC",2/(Math.log(L.far+1)/Math.LN2)),(st.isMeshPhongMaterial||st.isMeshToonMaterial||st.isMeshLambertMaterial||st.isMeshBasicMaterial||st.isMeshStandardMaterial||st.isShaderMaterial)&&xe.setValue(P,"isOrthographic",L.isOrthographicCamera===!0),_!==L&&(_=L,Qe=!0,Dr=!0)}if(J.isSkinnedMesh){xe.setOptional(P,J,"bindMatrix"),xe.setOptional(P,J,"bindMatrixInverse");const Ve=J.skeleton;Ve&&(Ve.boneTexture===null&&Ve.computeBoneTexture(),xe.setValue(P,"boneTexture",Ve.boneTexture,ut))}J.isBatchedMesh&&(xe.setOptional(P,J,"batchingTexture"),xe.setValue(P,"batchingTexture",J._matricesTexture,ut),xe.setOptional(P,J,"batchingIdTexture"),xe.setValue(P,"batchingIdTexture",J._indirectTexture,ut),xe.setOptional(P,J,"batchingColorTexture"),J._colorsTexture!==null&&xe.setValue(P,"batchingColorTexture",J._colorsTexture,ut));const cn=it.morphAttributes;if((cn.position!==void 0||cn.normal!==void 0||cn.color!==void 0)&&gt.update(J,it,je),(Qe||Wt.receiveShadow!==J.receiveShadow)&&(Wt.receiveShadow=J.receiveShadow,xe.setValue(P,"receiveShadow",J.receiveShadow)),st.isMeshGouraudMaterial&&st.envMap!==null&&(on.envMap.value=Ct,on.flipEnvMap.value=Ct.isCubeTexture&&Ct.isRenderTargetTexture===!1?-1:1),st.isMeshStandardMaterial&&st.envMap===null&&$.environment!==null&&(on.envMapIntensity.value=$.environmentIntensity),Qe&&(xe.setValue(P,"toneMappingExposure",M.toneMappingExposure),Wt.needsLights&&cf(on,Dr),_t&&st.fog===!0&&pt.refreshFogUniforms(on,_t),pt.refreshMaterialUniforms(on,st,V,Z,p.state.transmissionRenderTarget[L.id]),na.upload(P,Bc(Wt),on,ut)),st.isShaderMaterial&&st.uniformsNeedUpdate===!0&&(na.upload(P,Bc(Wt),on,ut),st.uniformsNeedUpdate=!1),st.isSpriteMaterial&&xe.setValue(P,"center",J.center),xe.setValue(P,"modelViewMatrix",J.modelViewMatrix),xe.setValue(P,"normalMatrix",J.normalMatrix),xe.setValue(P,"modelMatrix",J.matrixWorld),st.isShaderMaterial||st.isRawShaderMaterial){const Ve=st.uniformsGroups;for(let Ye=0,xa=Ve.length;Ye<xa;Ye++){const _i=Ve[Ye];Kt.update(_i,je),Kt.bind(_i,je)}}return je}function cf(L,$){L.ambientLightColor.needsUpdate=$,L.lightProbe.needsUpdate=$,L.directionalLights.needsUpdate=$,L.directionalLightShadows.needsUpdate=$,L.pointLights.needsUpdate=$,L.pointLightShadows.needsUpdate=$,L.spotLights.needsUpdate=$,L.spotLightShadows.needsUpdate=$,L.rectAreaLights.needsUpdate=$,L.hemisphereLights.needsUpdate=$}function lf(L){return L.isMeshLambertMaterial||L.isMeshToonMaterial||L.isMeshPhongMaterial||L.isMeshStandardMaterial||L.isShadowMaterial||L.isShaderMaterial&&L.lights===!0}this.getActiveCubeFace=function(){return E},this.getActiveMipmapLevel=function(){return A},this.getRenderTarget=function(){return C},this.setRenderTargetTextures=function(L,$,it){const st=ot.get(L);st.__autoAllocateDepthBuffer=L.resolveDepthBuffer===!1,st.__autoAllocateDepthBuffer===!1&&(st.__useRenderToTexture=!1),ot.get(L.texture).__webglTexture=$,ot.get(L.depthTexture).__webglTexture=st.__autoAllocateDepthBuffer?void 0:it,st.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(L,$){const it=ot.get(L);it.__webglFramebuffer=$,it.__useDefaultFramebuffer=$===void 0};const hf=P.createFramebuffer();this.setRenderTarget=function(L,$=0,it=0){C=L,E=$,A=it;let st=!0,J=null,_t=!1,At=!1;if(L){const Ct=ot.get(L);if(Ct.__useDefaultFramebuffer!==void 0)X.bindFramebuffer(P.FRAMEBUFFER,null),st=!1;else if(Ct.__webglFramebuffer===void 0)ut.setupRenderTarget(L);else if(Ct.__hasExternalTextures)ut.rebindTextures(L,ot.get(L.texture).__webglTexture,ot.get(L.depthTexture).__webglTexture);else if(L.depthBuffer){const Vt=L.depthTexture;if(Ct.__boundDepthTexture!==Vt){if(Vt!==null&&ot.has(Vt)&&(L.width!==Vt.image.width||L.height!==Vt.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");ut.setupDepthRenderbuffer(L)}}const qt=L.texture;(qt.isData3DTexture||qt.isDataArrayTexture||qt.isCompressedArrayTexture)&&(At=!0);const $t=ot.get(L).__webglFramebuffer;L.isWebGLCubeRenderTarget?(Array.isArray($t[$])?J=$t[$][it]:J=$t[$],_t=!0):L.samples>0&&ut.useMultisampledRTT(L)===!1?J=ot.get(L).__webglMultisampledFramebuffer:Array.isArray($t)?J=$t[it]:J=$t,S.copy(L.viewport),b.copy(L.scissor),D=L.scissorTest}else S.copy(dt).multiplyScalar(V).floor(),b.copy(mt).multiplyScalar(V).floor(),D=Et;if(it!==0&&(J=hf),X.bindFramebuffer(P.FRAMEBUFFER,J)&&st&&X.drawBuffers(L,J),X.viewport(S),X.scissor(b),X.setScissorTest(D),_t){const Ct=ot.get(L.texture);P.framebufferTexture2D(P.FRAMEBUFFER,P.COLOR_ATTACHMENT0,P.TEXTURE_CUBE_MAP_POSITIVE_X+$,Ct.__webglTexture,it)}else if(At){const Ct=$;for(let qt=0;qt<L.textures.length;qt++){const $t=ot.get(L.textures[qt]);P.framebufferTextureLayer(P.FRAMEBUFFER,P.COLOR_ATTACHMENT0+qt,$t.__webglTexture,it,Ct)}}else if(L!==null&&it!==0){const Ct=ot.get(L.texture);P.framebufferTexture2D(P.FRAMEBUFFER,P.COLOR_ATTACHMENT0,P.TEXTURE_2D,Ct.__webglTexture,it)}v=-1},this.readRenderTargetPixels=function(L,$,it,st,J,_t,At,Dt=0){if(!(L&&L.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Ct=ot.get(L).__webglFramebuffer;if(L.isWebGLCubeRenderTarget&&At!==void 0&&(Ct=Ct[At]),Ct){X.bindFramebuffer(P.FRAMEBUFFER,Ct);try{const qt=L.textures[Dt],$t=qt.format,Vt=qt.type;if(!G.textureFormatReadable($t)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!G.textureTypeReadable(Vt)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}$>=0&&$<=L.width-st&&it>=0&&it<=L.height-J&&(L.textures.length>1&&P.readBuffer(P.COLOR_ATTACHMENT0+Dt),P.readPixels($,it,st,J,kt.convert($t),kt.convert(Vt),_t))}finally{const qt=C!==null?ot.get(C).__webglFramebuffer:null;X.bindFramebuffer(P.FRAMEBUFFER,qt)}}},this.readRenderTargetPixelsAsync=async function(L,$,it,st,J,_t,At,Dt=0){if(!(L&&L.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let Ct=ot.get(L).__webglFramebuffer;if(L.isWebGLCubeRenderTarget&&At!==void 0&&(Ct=Ct[At]),Ct)if($>=0&&$<=L.width-st&&it>=0&&it<=L.height-J){X.bindFramebuffer(P.FRAMEBUFFER,Ct);const qt=L.textures[Dt],$t=qt.format,Vt=qt.type;if(!G.textureFormatReadable($t))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!G.textureTypeReadable(Vt))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");const ne=P.createBuffer();P.bindBuffer(P.PIXEL_PACK_BUFFER,ne),P.bufferData(P.PIXEL_PACK_BUFFER,_t.byteLength,P.STREAM_READ),L.textures.length>1&&P.readBuffer(P.COLOR_ATTACHMENT0+Dt),P.readPixels($,it,st,J,kt.convert($t),kt.convert(Vt),0);const le=C!==null?ot.get(C).__webglFramebuffer:null;X.bindFramebuffer(P.FRAMEBUFFER,le);const ye=P.fenceSync(P.SYNC_GPU_COMMANDS_COMPLETE,0);return P.flush(),await Cd(P,ye,4),P.bindBuffer(P.PIXEL_PACK_BUFFER,ne),P.getBufferSubData(P.PIXEL_PACK_BUFFER,0,_t),P.deleteBuffer(ne),P.deleteSync(ye),_t}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(L,$=null,it=0){const st=Math.pow(2,-it),J=Math.floor(L.image.width*st),_t=Math.floor(L.image.height*st),At=$!==null?$.x:0,Dt=$!==null?$.y:0;ut.setTexture2D(L,0),P.copyTexSubImage2D(P.TEXTURE_2D,it,0,0,At,Dt,J,_t),X.unbindTexture()};const uf=P.createFramebuffer(),ff=P.createFramebuffer();this.copyTextureToTexture=function(L,$,it=null,st=null,J=0,_t=null){_t===null&&(J!==0?(is("WebGLRenderer: copyTextureToTexture function signature has changed to support src and dst mipmap levels."),_t=J,J=0):_t=0);let At,Dt,Ct,qt,$t,Vt,ne,le,ye;const ge=L.isCompressedTexture?L.mipmaps[_t]:L.image;if(it!==null)At=it.max.x-it.min.x,Dt=it.max.y-it.min.y,Ct=it.isBox3?it.max.z-it.min.z:1,qt=it.min.x,$t=it.min.y,Vt=it.isBox3?it.min.z:0;else{const cn=Math.pow(2,-J);At=Math.floor(ge.width*cn),Dt=Math.floor(ge.height*cn),L.isDataArrayTexture?Ct=ge.depth:L.isData3DTexture?Ct=Math.floor(ge.depth*cn):Ct=1,qt=0,$t=0,Vt=0}st!==null?(ne=st.x,le=st.y,ye=st.z):(ne=0,le=0,ye=0);const ue=kt.convert($.format),Wt=kt.convert($.type);let _e;$.isData3DTexture?(ut.setTexture3D($,0),_e=P.TEXTURE_3D):$.isDataArrayTexture||$.isCompressedArrayTexture?(ut.setTexture2DArray($,0),_e=P.TEXTURE_2D_ARRAY):(ut.setTexture2D($,0),_e=P.TEXTURE_2D),P.pixelStorei(P.UNPACK_FLIP_Y_WEBGL,$.flipY),P.pixelStorei(P.UNPACK_PREMULTIPLY_ALPHA_WEBGL,$.premultiplyAlpha),P.pixelStorei(P.UNPACK_ALIGNMENT,$.unpackAlignment);const re=P.getParameter(P.UNPACK_ROW_LENGTH),je=P.getParameter(P.UNPACK_IMAGE_HEIGHT),Xi=P.getParameter(P.UNPACK_SKIP_PIXELS),Qe=P.getParameter(P.UNPACK_SKIP_ROWS),Dr=P.getParameter(P.UNPACK_SKIP_IMAGES);P.pixelStorei(P.UNPACK_ROW_LENGTH,ge.width),P.pixelStorei(P.UNPACK_IMAGE_HEIGHT,ge.height),P.pixelStorei(P.UNPACK_SKIP_PIXELS,qt),P.pixelStorei(P.UNPACK_SKIP_ROWS,$t),P.pixelStorei(P.UNPACK_SKIP_IMAGES,Vt);const xe=L.isDataArrayTexture||L.isData3DTexture,on=$.isDataArrayTexture||$.isData3DTexture;if(L.isDepthTexture){const cn=ot.get(L),Ve=ot.get($),Ye=ot.get(cn.__renderTarget),xa=ot.get(Ve.__renderTarget);X.bindFramebuffer(P.READ_FRAMEBUFFER,Ye.__webglFramebuffer),X.bindFramebuffer(P.DRAW_FRAMEBUFFER,xa.__webglFramebuffer);for(let _i=0;_i<Ct;_i++)xe&&(P.framebufferTextureLayer(P.READ_FRAMEBUFFER,P.COLOR_ATTACHMENT0,ot.get(L).__webglTexture,J,Vt+_i),P.framebufferTextureLayer(P.DRAW_FRAMEBUFFER,P.COLOR_ATTACHMENT0,ot.get($).__webglTexture,_t,ye+_i)),P.blitFramebuffer(qt,$t,At,Dt,ne,le,At,Dt,P.DEPTH_BUFFER_BIT,P.NEAREST);X.bindFramebuffer(P.READ_FRAMEBUFFER,null),X.bindFramebuffer(P.DRAW_FRAMEBUFFER,null)}else if(J!==0||L.isRenderTargetTexture||ot.has(L)){const cn=ot.get(L),Ve=ot.get($);X.bindFramebuffer(P.READ_FRAMEBUFFER,uf),X.bindFramebuffer(P.DRAW_FRAMEBUFFER,ff);for(let Ye=0;Ye<Ct;Ye++)xe?P.framebufferTextureLayer(P.READ_FRAMEBUFFER,P.COLOR_ATTACHMENT0,cn.__webglTexture,J,Vt+Ye):P.framebufferTexture2D(P.READ_FRAMEBUFFER,P.COLOR_ATTACHMENT0,P.TEXTURE_2D,cn.__webglTexture,J),on?P.framebufferTextureLayer(P.DRAW_FRAMEBUFFER,P.COLOR_ATTACHMENT0,Ve.__webglTexture,_t,ye+Ye):P.framebufferTexture2D(P.DRAW_FRAMEBUFFER,P.COLOR_ATTACHMENT0,P.TEXTURE_2D,Ve.__webglTexture,_t),J!==0?P.blitFramebuffer(qt,$t,At,Dt,ne,le,At,Dt,P.COLOR_BUFFER_BIT,P.NEAREST):on?P.copyTexSubImage3D(_e,_t,ne,le,ye+Ye,qt,$t,At,Dt):P.copyTexSubImage2D(_e,_t,ne,le,qt,$t,At,Dt);X.bindFramebuffer(P.READ_FRAMEBUFFER,null),X.bindFramebuffer(P.DRAW_FRAMEBUFFER,null)}else on?L.isDataTexture||L.isData3DTexture?P.texSubImage3D(_e,_t,ne,le,ye,At,Dt,Ct,ue,Wt,ge.data):$.isCompressedArrayTexture?P.compressedTexSubImage3D(_e,_t,ne,le,ye,At,Dt,Ct,ue,ge.data):P.texSubImage3D(_e,_t,ne,le,ye,At,Dt,Ct,ue,Wt,ge):L.isDataTexture?P.texSubImage2D(P.TEXTURE_2D,_t,ne,le,At,Dt,ue,Wt,ge.data):L.isCompressedTexture?P.compressedTexSubImage2D(P.TEXTURE_2D,_t,ne,le,ge.width,ge.height,ue,ge.data):P.texSubImage2D(P.TEXTURE_2D,_t,ne,le,At,Dt,ue,Wt,ge);P.pixelStorei(P.UNPACK_ROW_LENGTH,re),P.pixelStorei(P.UNPACK_IMAGE_HEIGHT,je),P.pixelStorei(P.UNPACK_SKIP_PIXELS,Xi),P.pixelStorei(P.UNPACK_SKIP_ROWS,Qe),P.pixelStorei(P.UNPACK_SKIP_IMAGES,Dr),_t===0&&$.generateMipmaps&&P.generateMipmap(_e),X.unbindTexture()},this.initRenderTarget=function(L){ot.get(L).__webglFramebuffer===void 0&&ut.setupRenderTarget(L)},this.initTexture=function(L){L.isCubeTexture?ut.setTextureCube(L,0):L.isData3DTexture?ut.setTexture3D(L,0):L.isDataArrayTexture||L.isCompressedArrayTexture?ut.setTexture2DArray(L,0):ut.setTexture2D(L,0),X.unbindTexture()},this.resetState=function(){E=0,A=0,C=null,X.reset(),Tt.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return Ln}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(t){this._outputColorSpace=t;const e=this.getContext();e.drawingBufferColorSpace=se._getDrawingBufferColorSpace(t),e.unpackColorSpace=se._getUnpackColorSpace()}}const Pv={armL:[.2,-1,0],forearmL:[.15,-1,.1],armR:[-.2,-1,0],forearmR:[-.15,-1,.1],thighL:[.05,-1,0],shinL:[0,-1,0],footL:[0,-.15,1],thighR:[-.05,-1,0],shinR:[0,-1,0],footR:[0,-.15,1]};function Dv(i,t){const e=i.scale??1,n=m=>new O(...i.dir?.[m]??Pv[m]).normalize(),r=Array.from({length:ho},()=>new O),s=(m,x)=>r[m].copy(x),a=(m,x,g)=>new O(m,x,g).multiplyScalar(e);s(q.hipL,a(.1,0,0)),s(q.hipR,a(-.1,0,0)),s(q.shL,a(.19,.52,-.02)),s(q.shR,a(-.19,.52,-.02));const o=new ke().setFromEuler(new mn(i.head?.[1]??0,i.head?.[0]??0,0,"YXZ")),c=a(0,.6,-.02),l=(m,x,g)=>a(m,x,g).applyQuaternion(o).add(c);s(q.nose,l(0,.1,.11)),s(q.eyeL,l(.032,.135,.09)),s(q.eyeR,l(-.032,.135,.09)),s(q.eyeInL,l(.018,.135,.095)),s(q.eyeInR,l(-.018,.135,.095)),s(q.eyeOutL,l(.05,.135,.08)),s(q.eyeOutR,l(-.05,.135,.08)),s(q.earL,l(.075,.12,0)),s(q.earR,l(-.075,.12,0)),s(q.mouthL,l(.024,.06,.095)),s(q.mouthR,l(-.024,.06,.095));for(const m of["L","R"]){const x=r[m==="L"?q.shL:q.shR],g=r[m==="L"?q.hipL:q.hipR],p=x.clone().addScaledVector(n(`arm${m}`),.29*e),w=p.clone().addScaledVector(n(`forearm${m}`),.26*e);s(m==="L"?q.elL:q.elR,p),s(m==="L"?q.wrL:q.wrR,w);const y=w.clone().addScaledVector(n(`forearm${m}`),.08*e);s(m==="L"?q.indexL:q.indexR,y.clone().add(a(0,0,.02))),s(m==="L"?q.pinkyL:q.pinkyR,y.clone().add(a(0,0,-.02))),s(m==="L"?q.thumbL:q.thumbR,w.clone().addScaledVector(n(`forearm${m}`),.04*e).add(a(0,0,.04)));const M=g.clone().addScaledVector(n(`thigh${m}`),.43*e),T=M.clone().addScaledVector(n(`shin${m}`),.42*e);s(m==="L"?q.knL:q.knR,M),s(m==="L"?q.anL:q.anR,T);const E=T.clone().add(a(0,-.04,-.05));s(m==="L"?q.heelL:q.heelR,E),s(m==="L"?q.toeL:q.toeR,E.clone().addScaledVector(n(`foot${m}`),.24*e))}const h=new ke().setFromAxisAngle(new O(0,1,0),i.yaw??0),u=new Set([q.knL,q.knR,q.anL,q.anR,q.heelL,q.heelR,q.toeL,q.toeR]),d=[],f=[];for(let m=0;m<ho;m++){const x=r[m].clone().applyQuaternion(h),g=u.has(m)?i.legsVis??.98:.98;d.push({x:x.x,y:x.y,z:x.z,v:g});const p=bf({x:x.x+i.T.x,y:x.y+i.T.y,z:x.z+i.T.z},t);f.push({x:p.x,y:p.y,z:0,v:g})}return{world:d,image:f}}function Iv(i,t,e){const n=[];for(let r=0;r<i;r++){const s=t*1.3+r*2.1,a=(r-(i-1)/2)*.9+Math.sin(t*.4+r)*.15,o=Math.sin(s);n.push(Dv({T:{x:a,y:-.1+.03*Math.sin(s*2),z:-3-r*.6},yaw:Math.sin(t*.5+r)*.5,head:[Math.sin(t*.7+r)*.4,Math.sin(t*.9)*.15],dir:{armR:[-1,.3+.5*o,.1],forearmR:[-.3,1,.1+.3*o],armL:[.5+.4*Math.cos(s),-.8+.6*Math.cos(s*.5),.3],forearmL:[.2,-.3,1],thighL:[.12,-1,.25*Math.max(0,o)],shinL:[.05,-1,-.2*Math.max(0,o)]},scale:1-r*.08},e))}return n}function Uv(i){const t=new Map,e=new Map,n=i.clone();return wu(i,n,function(r,s){t.set(s,r),e.set(r,s)}),n.traverse(function(r){if(!r.isSkinnedMesh)return;const s=r,a=t.get(r),o=a.skeleton.bones;s.skeleton=a.skeleton.clone(),s.bindMatrix.copy(a.bindMatrix),s.skeleton.bones=o.map(function(c){return e.get(c)}),s.bind(s.skeleton,s.bindMatrix)}),n}function wu(i,t,e){e(i,t);for(let n=0;n<i.children.length;n++)wu(i.children[n],t.children[n],e)}class Tu extends Xt{constructor(t,e,n=!1,r=!1,s=1e4){const a=new De;super(a,e),this.isMarchingCubes=!0;const o=this,c=new Float32Array(36),l=new Float32Array(36),h=new Float32Array(36);this.enableUvs=n,this.enableColors=r,this.init=function(w){this.resolution=w,this.isolation=80,this.size=w,this.size2=this.size*this.size,this.size3=this.size2*this.size,this.halfsize=this.size/2,this.delta=2/this.size,this.yd=this.size,this.zd=this.size2,this.field=new Float32Array(this.size3),this.normal_cache=new Float32Array(this.size3*3),this.palette=new Float32Array(this.size3*3),this.count=0;const y=s*3;this.positionArray=new Float32Array(y*3);const M=new oe(this.positionArray,3);M.setUsage(_s),a.setAttribute("position",M),this.normalArray=new Float32Array(y*3);const T=new oe(this.normalArray,3);if(T.setUsage(_s),a.setAttribute("normal",T),this.enableUvs){this.uvArray=new Float32Array(y*2);const E=new oe(this.uvArray,2);E.setUsage(_s),a.setAttribute("uv",E)}if(this.enableColors){this.colorArray=new Float32Array(y*3);const E=new oe(this.colorArray,3);E.setUsage(_s),a.setAttribute("color",E)}a.boundingSphere=new Rr(new O,1)};function u(w,y,M){return w+(y-w)*M}function d(w,y,M,T,E,A,C,v,_,S){const b=(M-C)/(v-C),D=o.normal_cache;c[y+0]=T+b*o.delta,c[y+1]=E,c[y+2]=A,l[y+0]=u(D[w+0],D[w+3],b),l[y+1]=u(D[w+1],D[w+4],b),l[y+2]=u(D[w+2],D[w+5],b),h[y+0]=u(o.palette[_*3+0],o.palette[S*3+0],b),h[y+1]=u(o.palette[_*3+1],o.palette[S*3+1],b),h[y+2]=u(o.palette[_*3+2],o.palette[S*3+2],b)}function f(w,y,M,T,E,A,C,v,_,S){const b=(M-C)/(v-C),D=o.normal_cache;c[y+0]=T,c[y+1]=E+b*o.delta,c[y+2]=A;const U=w+o.yd*3;l[y+0]=u(D[w+0],D[U+0],b),l[y+1]=u(D[w+1],D[U+1],b),l[y+2]=u(D[w+2],D[U+2],b),h[y+0]=u(o.palette[_*3+0],o.palette[S*3+0],b),h[y+1]=u(o.palette[_*3+1],o.palette[S*3+1],b),h[y+2]=u(o.palette[_*3+2],o.palette[S*3+2],b)}function m(w,y,M,T,E,A,C,v,_,S){const b=(M-C)/(v-C),D=o.normal_cache;c[y+0]=T,c[y+1]=E,c[y+2]=A+b*o.delta;const U=w+o.zd*3;l[y+0]=u(D[w+0],D[U+0],b),l[y+1]=u(D[w+1],D[U+1],b),l[y+2]=u(D[w+2],D[U+2],b),h[y+0]=u(o.palette[_*3+0],o.palette[S*3+0],b),h[y+1]=u(o.palette[_*3+1],o.palette[S*3+1],b),h[y+2]=u(o.palette[_*3+2],o.palette[S*3+2],b)}function x(w){const y=w*3;o.normal_cache[y]===0&&(o.normal_cache[y+0]=o.field[w-1]-o.field[w+1],o.normal_cache[y+1]=o.field[w-o.yd]-o.field[w+o.yd],o.normal_cache[y+2]=o.field[w-o.zd]-o.field[w+o.zd])}function g(w,y,M,T,E){const A=T+1,C=T+o.yd,v=T+o.zd,_=A+o.yd,S=A+o.zd,b=T+o.yd+o.zd,D=A+o.yd+o.zd;let U=0;const N=o.field[T],H=o.field[A],Z=o.field[C],V=o.field[_],rt=o.field[v],ht=o.field[S],dt=o.field[b],mt=o.field[D];N<E&&(U|=1),H<E&&(U|=2),Z<E&&(U|=8),V<E&&(U|=4),rt<E&&(U|=16),ht<E&&(U|=32),dt<E&&(U|=128),mt<E&&(U|=64);const Et=Nv[U];if(Et===0)return 0;const Ft=o.delta,zt=w+Ft,et=y+Ft,lt=M+Ft;Et&1&&(x(T),x(A),d(T*3,0,E,w,y,M,N,H,T,A)),Et&2&&(x(A),x(_),f(A*3,3,E,zt,y,M,H,V,A,_)),Et&4&&(x(C),x(_),d(C*3,6,E,w,et,M,Z,V,C,_)),Et&8&&(x(T),x(C),f(T*3,9,E,w,y,M,N,Z,T,C)),Et&16&&(x(v),x(S),d(v*3,12,E,w,y,lt,rt,ht,v,S)),Et&32&&(x(S),x(D),f(S*3,15,E,zt,y,lt,ht,mt,S,D)),Et&64&&(x(b),x(D),d(b*3,18,E,w,et,lt,dt,mt,b,D)),Et&128&&(x(v),x(b),f(v*3,21,E,w,y,lt,rt,dt,v,b)),Et&256&&(x(T),x(v),m(T*3,24,E,w,y,M,N,rt,T,v)),Et&512&&(x(A),x(S),m(A*3,27,E,zt,y,M,H,ht,A,S)),Et&1024&&(x(_),x(D),m(_*3,30,E,zt,et,M,V,mt,_,D)),Et&2048&&(x(C),x(b),m(C*3,33,E,w,et,M,Z,dt,C,b)),U<<=4;let F,k,B,K=0,j=0;for(;Ws[U+j]!=-1;)F=U+j,k=F+1,B=F+2,p(c,l,h,3*Ws[F],3*Ws[k],3*Ws[B]),j+=3,K++;return K}function p(w,y,M,T,E,A){const C=o.count*3;if(o.positionArray[C+0]=w[T],o.positionArray[C+1]=w[T+1],o.positionArray[C+2]=w[T+2],o.positionArray[C+3]=w[E],o.positionArray[C+4]=w[E+1],o.positionArray[C+5]=w[E+2],o.positionArray[C+6]=w[A],o.positionArray[C+7]=w[A+1],o.positionArray[C+8]=w[A+2],o.material.flatShading===!0){const v=(y[T+0]+y[E+0]+y[A+0])/3,_=(y[T+1]+y[E+1]+y[A+1])/3,S=(y[T+2]+y[E+2]+y[A+2])/3;o.normalArray[C+0]=v,o.normalArray[C+1]=_,o.normalArray[C+2]=S,o.normalArray[C+3]=v,o.normalArray[C+4]=_,o.normalArray[C+5]=S,o.normalArray[C+6]=v,o.normalArray[C+7]=_,o.normalArray[C+8]=S}else o.normalArray[C+0]=y[T+0],o.normalArray[C+1]=y[T+1],o.normalArray[C+2]=y[T+2],o.normalArray[C+3]=y[E+0],o.normalArray[C+4]=y[E+1],o.normalArray[C+5]=y[E+2],o.normalArray[C+6]=y[A+0],o.normalArray[C+7]=y[A+1],o.normalArray[C+8]=y[A+2];if(o.enableUvs){const v=o.count*2;o.uvArray[v+0]=w[T+0],o.uvArray[v+1]=w[T+2],o.uvArray[v+2]=w[E+0],o.uvArray[v+3]=w[E+2],o.uvArray[v+4]=w[A+0],o.uvArray[v+5]=w[A+2]}o.enableColors&&(o.colorArray[C+0]=M[T+0],o.colorArray[C+1]=M[T+1],o.colorArray[C+2]=M[T+2],o.colorArray[C+3]=M[E+0],o.colorArray[C+4]=M[E+1],o.colorArray[C+5]=M[E+2],o.colorArray[C+6]=M[A+0],o.colorArray[C+7]=M[A+1],o.colorArray[C+8]=M[A+2]),o.count+=3}this.addBall=function(w,y,M,T,E,A){const C=Math.sign(T);T=Math.abs(T);const v=A!=null;let _=new Gt(w,y,M);if(v)try{_=A instanceof Gt?A:Array.isArray(A)?new Gt(Math.min(Math.abs(A[0]),1),Math.min(Math.abs(A[1]),1),Math.min(Math.abs(A[2]),1)):new Gt(A)}catch{_=new Gt(w,y,M)}const S=this.size*Math.sqrt(T/E),b=M*this.size,D=y*this.size,U=w*this.size;let N=Math.floor(b-S);N<1&&(N=1);let H=Math.floor(b+S);H>this.size-1&&(H=this.size-1);let Z=Math.floor(D-S);Z<1&&(Z=1);let V=Math.floor(D+S);V>this.size-1&&(V=this.size-1);let rt=Math.floor(U-S);rt<1&&(rt=1);let ht=Math.floor(U+S);ht>this.size-1&&(ht=this.size-1);let dt,mt,Et,Ft,zt,et,lt,F,k,B,K;for(Et=N;Et<H;Et++)for(zt=this.size2*Et,F=Et/this.size-M,k=F*F,mt=Z;mt<V;mt++)for(Ft=zt+this.size*mt,lt=mt/this.size-y,B=lt*lt,dt=rt;dt<ht;dt++)if(et=dt/this.size-w,K=T/(1e-6+et*et+B+k)-E,K>0){this.field[Ft+dt]+=K*C;const j=Math.sqrt((dt-U)*(dt-U)+(mt-D)*(mt-D)+(Et-b)*(Et-b))/S,P=1-j*j*j*(j*(j*6-15)+10);this.palette[(Ft+dt)*3+0]+=_.r*P,this.palette[(Ft+dt)*3+1]+=_.g*P,this.palette[(Ft+dt)*3+2]+=_.b*P}},this.addPlaneX=function(w,y){const M=this.size,T=this.yd,E=this.zd,A=this.field;let C,v,_,S,b,D,U,N=M*Math.sqrt(w/y);for(N>M&&(N=M),C=0;C<N;C++)if(D=C/M,S=D*D,b=w/(1e-4+S)-y,b>0)for(v=0;v<M;v++)for(U=C+v*T,_=0;_<M;_++)A[E*_+U]+=b},this.addPlaneY=function(w,y){const M=this.size,T=this.yd,E=this.zd,A=this.field;let C,v,_,S,b,D,U,N,H=M*Math.sqrt(w/y);for(H>M&&(H=M),v=0;v<H;v++)if(D=v/M,S=D*D,b=w/(1e-4+S)-y,b>0)for(U=v*T,C=0;C<M;C++)for(N=U+C,_=0;_<M;_++)A[E*_+N]+=b},this.addPlaneZ=function(w,y){const M=this.size,T=this.yd,E=this.zd,A=this.field;let C,v,_,S,b,D,U,N,H=M*Math.sqrt(w/y);for(H>M&&(H=M),_=0;_<H;_++)if(D=_/M,S=D*D,b=w/(1e-4+S)-y,b>0)for(U=E*_,v=0;v<M;v++)for(N=U+v*T,C=0;C<M;C++)A[N+C]+=b},this.setCell=function(w,y,M,T){const E=this.size2*M+this.size*y+w;this.field[E]=T},this.getCell=function(w,y,M){const T=this.size2*M+this.size*y+w;return this.field[T]},this.blur=function(w=1){const y=this.field,M=y.slice(),T=this.size,E=this.size2;for(let A=0;A<T;A++)for(let C=0;C<T;C++)for(let v=0;v<T;v++){const _=E*v+T*C+A;let S=M[_],b=1;for(let D=-1;D<=1;D+=2){const U=D+A;if(!(U<0||U>=T))for(let N=-1;N<=1;N+=2){const H=N+C;if(!(H<0||H>=T))for(let Z=-1;Z<=1;Z+=2){const V=Z+v;if(V<0||V>=T)continue;const rt=E*V+T*H+U,ht=M[rt];b++,S+=w*(ht-S)/b}}}y[_]=S}},this.reset=function(){for(let w=0;w<this.size3;w++)this.normal_cache[w*3]=0,this.field[w]=0,this.palette[w*3]=this.palette[w*3+1]=this.palette[w*3+2]=0},this.update=function(){this.count=0;const w=this.size-2;for(let y=1;y<w;y++){const M=this.size2*y,T=(y-this.halfsize)/this.halfsize;for(let E=1;E<w;E++){const A=M+this.size*E,C=(E-this.halfsize)/this.halfsize;for(let v=1;v<w;v++){const _=(v-this.halfsize)/this.halfsize,S=A+v;g(_,C,T,S,this.isolation)}}}this.geometry.setDrawRange(0,this.count),a.getAttribute("position").needsUpdate=!0,a.getAttribute("normal").needsUpdate=!0,this.enableUvs&&(a.getAttribute("uv").needsUpdate=!0),this.enableColors&&(a.getAttribute("color").needsUpdate=!0),this.count/3>s&&console.warn("THREE.MarchingCubes: Geometry buffers too small for rendering. Please create an instance with a higher poly count.")},this.init(t)}}const Nv=new Int32Array([0,265,515,778,1030,1295,1541,1804,2060,2309,2575,2822,3082,3331,3593,3840,400,153,915,666,1430,1183,1941,1692,2460,2197,2975,2710,3482,3219,3993,3728,560,825,51,314,1590,1855,1077,1340,2620,2869,2111,2358,3642,3891,3129,3376,928,681,419,170,1958,1711,1445,1196,2988,2725,2479,2214,4010,3747,3497,3232,1120,1385,1635,1898,102,367,613,876,3180,3429,3695,3942,2154,2403,2665,2912,1520,1273,2035,1786,502,255,1013,764,3580,3317,4095,3830,2554,2291,3065,2800,1616,1881,1107,1370,598,863,85,348,3676,3925,3167,3414,2650,2899,2137,2384,1984,1737,1475,1226,966,719,453,204,4044,3781,3535,3270,3018,2755,2505,2240,2240,2505,2755,3018,3270,3535,3781,4044,204,453,719,966,1226,1475,1737,1984,2384,2137,2899,2650,3414,3167,3925,3676,348,85,863,598,1370,1107,1881,1616,2800,3065,2291,2554,3830,4095,3317,3580,764,1013,255,502,1786,2035,1273,1520,2912,2665,2403,2154,3942,3695,3429,3180,876,613,367,102,1898,1635,1385,1120,3232,3497,3747,4010,2214,2479,2725,2988,1196,1445,1711,1958,170,419,681,928,3376,3129,3891,3642,2358,2111,2869,2620,1340,1077,1855,1590,314,51,825,560,3728,3993,3219,3482,2710,2975,2197,2460,1692,1941,1183,1430,666,915,153,400,3840,3593,3331,3082,2822,2575,2309,2060,1804,1541,1295,1030,778,515,265,0]),Ws=new Int32Array([-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,8,3,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,1,9,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,1,8,3,9,8,1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,1,2,10,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,8,3,1,2,10,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,9,2,10,0,2,9,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,2,8,3,2,10,8,10,9,8,-1,-1,-1,-1,-1,-1,-1,3,11,2,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,11,2,8,11,0,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,1,9,0,2,3,11,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,1,11,2,1,9,11,9,8,11,-1,-1,-1,-1,-1,-1,-1,3,10,1,11,10,3,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,10,1,0,8,10,8,11,10,-1,-1,-1,-1,-1,-1,-1,3,9,0,3,11,9,11,10,9,-1,-1,-1,-1,-1,-1,-1,9,8,10,10,8,11,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,4,7,8,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,4,3,0,7,3,4,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,1,9,8,4,7,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,4,1,9,4,7,1,7,3,1,-1,-1,-1,-1,-1,-1,-1,1,2,10,8,4,7,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,3,4,7,3,0,4,1,2,10,-1,-1,-1,-1,-1,-1,-1,9,2,10,9,0,2,8,4,7,-1,-1,-1,-1,-1,-1,-1,2,10,9,2,9,7,2,7,3,7,9,4,-1,-1,-1,-1,8,4,7,3,11,2,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,11,4,7,11,2,4,2,0,4,-1,-1,-1,-1,-1,-1,-1,9,0,1,8,4,7,2,3,11,-1,-1,-1,-1,-1,-1,-1,4,7,11,9,4,11,9,11,2,9,2,1,-1,-1,-1,-1,3,10,1,3,11,10,7,8,4,-1,-1,-1,-1,-1,-1,-1,1,11,10,1,4,11,1,0,4,7,11,4,-1,-1,-1,-1,4,7,8,9,0,11,9,11,10,11,0,3,-1,-1,-1,-1,4,7,11,4,11,9,9,11,10,-1,-1,-1,-1,-1,-1,-1,9,5,4,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,9,5,4,0,8,3,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,5,4,1,5,0,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,8,5,4,8,3,5,3,1,5,-1,-1,-1,-1,-1,-1,-1,1,2,10,9,5,4,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,3,0,8,1,2,10,4,9,5,-1,-1,-1,-1,-1,-1,-1,5,2,10,5,4,2,4,0,2,-1,-1,-1,-1,-1,-1,-1,2,10,5,3,2,5,3,5,4,3,4,8,-1,-1,-1,-1,9,5,4,2,3,11,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,11,2,0,8,11,4,9,5,-1,-1,-1,-1,-1,-1,-1,0,5,4,0,1,5,2,3,11,-1,-1,-1,-1,-1,-1,-1,2,1,5,2,5,8,2,8,11,4,8,5,-1,-1,-1,-1,10,3,11,10,1,3,9,5,4,-1,-1,-1,-1,-1,-1,-1,4,9,5,0,8,1,8,10,1,8,11,10,-1,-1,-1,-1,5,4,0,5,0,11,5,11,10,11,0,3,-1,-1,-1,-1,5,4,8,5,8,10,10,8,11,-1,-1,-1,-1,-1,-1,-1,9,7,8,5,7,9,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,9,3,0,9,5,3,5,7,3,-1,-1,-1,-1,-1,-1,-1,0,7,8,0,1,7,1,5,7,-1,-1,-1,-1,-1,-1,-1,1,5,3,3,5,7,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,9,7,8,9,5,7,10,1,2,-1,-1,-1,-1,-1,-1,-1,10,1,2,9,5,0,5,3,0,5,7,3,-1,-1,-1,-1,8,0,2,8,2,5,8,5,7,10,5,2,-1,-1,-1,-1,2,10,5,2,5,3,3,5,7,-1,-1,-1,-1,-1,-1,-1,7,9,5,7,8,9,3,11,2,-1,-1,-1,-1,-1,-1,-1,9,5,7,9,7,2,9,2,0,2,7,11,-1,-1,-1,-1,2,3,11,0,1,8,1,7,8,1,5,7,-1,-1,-1,-1,11,2,1,11,1,7,7,1,5,-1,-1,-1,-1,-1,-1,-1,9,5,8,8,5,7,10,1,3,10,3,11,-1,-1,-1,-1,5,7,0,5,0,9,7,11,0,1,0,10,11,10,0,-1,11,10,0,11,0,3,10,5,0,8,0,7,5,7,0,-1,11,10,5,7,11,5,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,10,6,5,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,8,3,5,10,6,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,9,0,1,5,10,6,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,1,8,3,1,9,8,5,10,6,-1,-1,-1,-1,-1,-1,-1,1,6,5,2,6,1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,1,6,5,1,2,6,3,0,8,-1,-1,-1,-1,-1,-1,-1,9,6,5,9,0,6,0,2,6,-1,-1,-1,-1,-1,-1,-1,5,9,8,5,8,2,5,2,6,3,2,8,-1,-1,-1,-1,2,3,11,10,6,5,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,11,0,8,11,2,0,10,6,5,-1,-1,-1,-1,-1,-1,-1,0,1,9,2,3,11,5,10,6,-1,-1,-1,-1,-1,-1,-1,5,10,6,1,9,2,9,11,2,9,8,11,-1,-1,-1,-1,6,3,11,6,5,3,5,1,3,-1,-1,-1,-1,-1,-1,-1,0,8,11,0,11,5,0,5,1,5,11,6,-1,-1,-1,-1,3,11,6,0,3,6,0,6,5,0,5,9,-1,-1,-1,-1,6,5,9,6,9,11,11,9,8,-1,-1,-1,-1,-1,-1,-1,5,10,6,4,7,8,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,4,3,0,4,7,3,6,5,10,-1,-1,-1,-1,-1,-1,-1,1,9,0,5,10,6,8,4,7,-1,-1,-1,-1,-1,-1,-1,10,6,5,1,9,7,1,7,3,7,9,4,-1,-1,-1,-1,6,1,2,6,5,1,4,7,8,-1,-1,-1,-1,-1,-1,-1,1,2,5,5,2,6,3,0,4,3,4,7,-1,-1,-1,-1,8,4,7,9,0,5,0,6,5,0,2,6,-1,-1,-1,-1,7,3,9,7,9,4,3,2,9,5,9,6,2,6,9,-1,3,11,2,7,8,4,10,6,5,-1,-1,-1,-1,-1,-1,-1,5,10,6,4,7,2,4,2,0,2,7,11,-1,-1,-1,-1,0,1,9,4,7,8,2,3,11,5,10,6,-1,-1,-1,-1,9,2,1,9,11,2,9,4,11,7,11,4,5,10,6,-1,8,4,7,3,11,5,3,5,1,5,11,6,-1,-1,-1,-1,5,1,11,5,11,6,1,0,11,7,11,4,0,4,11,-1,0,5,9,0,6,5,0,3,6,11,6,3,8,4,7,-1,6,5,9,6,9,11,4,7,9,7,11,9,-1,-1,-1,-1,10,4,9,6,4,10,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,4,10,6,4,9,10,0,8,3,-1,-1,-1,-1,-1,-1,-1,10,0,1,10,6,0,6,4,0,-1,-1,-1,-1,-1,-1,-1,8,3,1,8,1,6,8,6,4,6,1,10,-1,-1,-1,-1,1,4,9,1,2,4,2,6,4,-1,-1,-1,-1,-1,-1,-1,3,0,8,1,2,9,2,4,9,2,6,4,-1,-1,-1,-1,0,2,4,4,2,6,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,8,3,2,8,2,4,4,2,6,-1,-1,-1,-1,-1,-1,-1,10,4,9,10,6,4,11,2,3,-1,-1,-1,-1,-1,-1,-1,0,8,2,2,8,11,4,9,10,4,10,6,-1,-1,-1,-1,3,11,2,0,1,6,0,6,4,6,1,10,-1,-1,-1,-1,6,4,1,6,1,10,4,8,1,2,1,11,8,11,1,-1,9,6,4,9,3,6,9,1,3,11,6,3,-1,-1,-1,-1,8,11,1,8,1,0,11,6,1,9,1,4,6,4,1,-1,3,11,6,3,6,0,0,6,4,-1,-1,-1,-1,-1,-1,-1,6,4,8,11,6,8,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,7,10,6,7,8,10,8,9,10,-1,-1,-1,-1,-1,-1,-1,0,7,3,0,10,7,0,9,10,6,7,10,-1,-1,-1,-1,10,6,7,1,10,7,1,7,8,1,8,0,-1,-1,-1,-1,10,6,7,10,7,1,1,7,3,-1,-1,-1,-1,-1,-1,-1,1,2,6,1,6,8,1,8,9,8,6,7,-1,-1,-1,-1,2,6,9,2,9,1,6,7,9,0,9,3,7,3,9,-1,7,8,0,7,0,6,6,0,2,-1,-1,-1,-1,-1,-1,-1,7,3,2,6,7,2,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,2,3,11,10,6,8,10,8,9,8,6,7,-1,-1,-1,-1,2,0,7,2,7,11,0,9,7,6,7,10,9,10,7,-1,1,8,0,1,7,8,1,10,7,6,7,10,2,3,11,-1,11,2,1,11,1,7,10,6,1,6,7,1,-1,-1,-1,-1,8,9,6,8,6,7,9,1,6,11,6,3,1,3,6,-1,0,9,1,11,6,7,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,7,8,0,7,0,6,3,11,0,11,6,0,-1,-1,-1,-1,7,11,6,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,7,6,11,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,3,0,8,11,7,6,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,1,9,11,7,6,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,8,1,9,8,3,1,11,7,6,-1,-1,-1,-1,-1,-1,-1,10,1,2,6,11,7,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,1,2,10,3,0,8,6,11,7,-1,-1,-1,-1,-1,-1,-1,2,9,0,2,10,9,6,11,7,-1,-1,-1,-1,-1,-1,-1,6,11,7,2,10,3,10,8,3,10,9,8,-1,-1,-1,-1,7,2,3,6,2,7,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,7,0,8,7,6,0,6,2,0,-1,-1,-1,-1,-1,-1,-1,2,7,6,2,3,7,0,1,9,-1,-1,-1,-1,-1,-1,-1,1,6,2,1,8,6,1,9,8,8,7,6,-1,-1,-1,-1,10,7,6,10,1,7,1,3,7,-1,-1,-1,-1,-1,-1,-1,10,7,6,1,7,10,1,8,7,1,0,8,-1,-1,-1,-1,0,3,7,0,7,10,0,10,9,6,10,7,-1,-1,-1,-1,7,6,10,7,10,8,8,10,9,-1,-1,-1,-1,-1,-1,-1,6,8,4,11,8,6,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,3,6,11,3,0,6,0,4,6,-1,-1,-1,-1,-1,-1,-1,8,6,11,8,4,6,9,0,1,-1,-1,-1,-1,-1,-1,-1,9,4,6,9,6,3,9,3,1,11,3,6,-1,-1,-1,-1,6,8,4,6,11,8,2,10,1,-1,-1,-1,-1,-1,-1,-1,1,2,10,3,0,11,0,6,11,0,4,6,-1,-1,-1,-1,4,11,8,4,6,11,0,2,9,2,10,9,-1,-1,-1,-1,10,9,3,10,3,2,9,4,3,11,3,6,4,6,3,-1,8,2,3,8,4,2,4,6,2,-1,-1,-1,-1,-1,-1,-1,0,4,2,4,6,2,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,1,9,0,2,3,4,2,4,6,4,3,8,-1,-1,-1,-1,1,9,4,1,4,2,2,4,6,-1,-1,-1,-1,-1,-1,-1,8,1,3,8,6,1,8,4,6,6,10,1,-1,-1,-1,-1,10,1,0,10,0,6,6,0,4,-1,-1,-1,-1,-1,-1,-1,4,6,3,4,3,8,6,10,3,0,3,9,10,9,3,-1,10,9,4,6,10,4,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,4,9,5,7,6,11,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,8,3,4,9,5,11,7,6,-1,-1,-1,-1,-1,-1,-1,5,0,1,5,4,0,7,6,11,-1,-1,-1,-1,-1,-1,-1,11,7,6,8,3,4,3,5,4,3,1,5,-1,-1,-1,-1,9,5,4,10,1,2,7,6,11,-1,-1,-1,-1,-1,-1,-1,6,11,7,1,2,10,0,8,3,4,9,5,-1,-1,-1,-1,7,6,11,5,4,10,4,2,10,4,0,2,-1,-1,-1,-1,3,4,8,3,5,4,3,2,5,10,5,2,11,7,6,-1,7,2,3,7,6,2,5,4,9,-1,-1,-1,-1,-1,-1,-1,9,5,4,0,8,6,0,6,2,6,8,7,-1,-1,-1,-1,3,6,2,3,7,6,1,5,0,5,4,0,-1,-1,-1,-1,6,2,8,6,8,7,2,1,8,4,8,5,1,5,8,-1,9,5,4,10,1,6,1,7,6,1,3,7,-1,-1,-1,-1,1,6,10,1,7,6,1,0,7,8,7,0,9,5,4,-1,4,0,10,4,10,5,0,3,10,6,10,7,3,7,10,-1,7,6,10,7,10,8,5,4,10,4,8,10,-1,-1,-1,-1,6,9,5,6,11,9,11,8,9,-1,-1,-1,-1,-1,-1,-1,3,6,11,0,6,3,0,5,6,0,9,5,-1,-1,-1,-1,0,11,8,0,5,11,0,1,5,5,6,11,-1,-1,-1,-1,6,11,3,6,3,5,5,3,1,-1,-1,-1,-1,-1,-1,-1,1,2,10,9,5,11,9,11,8,11,5,6,-1,-1,-1,-1,0,11,3,0,6,11,0,9,6,5,6,9,1,2,10,-1,11,8,5,11,5,6,8,0,5,10,5,2,0,2,5,-1,6,11,3,6,3,5,2,10,3,10,5,3,-1,-1,-1,-1,5,8,9,5,2,8,5,6,2,3,8,2,-1,-1,-1,-1,9,5,6,9,6,0,0,6,2,-1,-1,-1,-1,-1,-1,-1,1,5,8,1,8,0,5,6,8,3,8,2,6,2,8,-1,1,5,6,2,1,6,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,1,3,6,1,6,10,3,8,6,5,6,9,8,9,6,-1,10,1,0,10,0,6,9,5,0,5,6,0,-1,-1,-1,-1,0,3,8,5,6,10,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,10,5,6,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,11,5,10,7,5,11,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,11,5,10,11,7,5,8,3,0,-1,-1,-1,-1,-1,-1,-1,5,11,7,5,10,11,1,9,0,-1,-1,-1,-1,-1,-1,-1,10,7,5,10,11,7,9,8,1,8,3,1,-1,-1,-1,-1,11,1,2,11,7,1,7,5,1,-1,-1,-1,-1,-1,-1,-1,0,8,3,1,2,7,1,7,5,7,2,11,-1,-1,-1,-1,9,7,5,9,2,7,9,0,2,2,11,7,-1,-1,-1,-1,7,5,2,7,2,11,5,9,2,3,2,8,9,8,2,-1,2,5,10,2,3,5,3,7,5,-1,-1,-1,-1,-1,-1,-1,8,2,0,8,5,2,8,7,5,10,2,5,-1,-1,-1,-1,9,0,1,5,10,3,5,3,7,3,10,2,-1,-1,-1,-1,9,8,2,9,2,1,8,7,2,10,2,5,7,5,2,-1,1,3,5,3,7,5,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,8,7,0,7,1,1,7,5,-1,-1,-1,-1,-1,-1,-1,9,0,3,9,3,5,5,3,7,-1,-1,-1,-1,-1,-1,-1,9,8,7,5,9,7,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,5,8,4,5,10,8,10,11,8,-1,-1,-1,-1,-1,-1,-1,5,0,4,5,11,0,5,10,11,11,3,0,-1,-1,-1,-1,0,1,9,8,4,10,8,10,11,10,4,5,-1,-1,-1,-1,10,11,4,10,4,5,11,3,4,9,4,1,3,1,4,-1,2,5,1,2,8,5,2,11,8,4,5,8,-1,-1,-1,-1,0,4,11,0,11,3,4,5,11,2,11,1,5,1,11,-1,0,2,5,0,5,9,2,11,5,4,5,8,11,8,5,-1,9,4,5,2,11,3,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,2,5,10,3,5,2,3,4,5,3,8,4,-1,-1,-1,-1,5,10,2,5,2,4,4,2,0,-1,-1,-1,-1,-1,-1,-1,3,10,2,3,5,10,3,8,5,4,5,8,0,1,9,-1,5,10,2,5,2,4,1,9,2,9,4,2,-1,-1,-1,-1,8,4,5,8,5,3,3,5,1,-1,-1,-1,-1,-1,-1,-1,0,4,5,1,0,5,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,8,4,5,8,5,3,9,0,5,0,3,5,-1,-1,-1,-1,9,4,5,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,4,11,7,4,9,11,9,10,11,-1,-1,-1,-1,-1,-1,-1,0,8,3,4,9,7,9,11,7,9,10,11,-1,-1,-1,-1,1,10,11,1,11,4,1,4,0,7,4,11,-1,-1,-1,-1,3,1,4,3,4,8,1,10,4,7,4,11,10,11,4,-1,4,11,7,9,11,4,9,2,11,9,1,2,-1,-1,-1,-1,9,7,4,9,11,7,9,1,11,2,11,1,0,8,3,-1,11,7,4,11,4,2,2,4,0,-1,-1,-1,-1,-1,-1,-1,11,7,4,11,4,2,8,3,4,3,2,4,-1,-1,-1,-1,2,9,10,2,7,9,2,3,7,7,4,9,-1,-1,-1,-1,9,10,7,9,7,4,10,2,7,8,7,0,2,0,7,-1,3,7,10,3,10,2,7,4,10,1,10,0,4,0,10,-1,1,10,2,8,7,4,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,4,9,1,4,1,7,7,1,3,-1,-1,-1,-1,-1,-1,-1,4,9,1,4,1,7,0,8,1,8,7,1,-1,-1,-1,-1,4,0,3,7,4,3,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,4,8,7,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,9,10,8,10,11,8,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,3,0,9,3,9,11,11,9,10,-1,-1,-1,-1,-1,-1,-1,0,1,10,0,10,8,8,10,11,-1,-1,-1,-1,-1,-1,-1,3,1,10,11,3,10,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,1,2,11,1,11,9,9,11,8,-1,-1,-1,-1,-1,-1,-1,3,0,9,3,9,11,1,2,9,2,11,9,-1,-1,-1,-1,0,2,11,8,0,11,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,3,2,11,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,2,3,8,2,8,10,10,8,9,-1,-1,-1,-1,-1,-1,-1,9,10,2,0,9,2,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,2,3,8,2,8,10,0,1,8,1,10,8,-1,-1,-1,-1,1,10,2,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,1,3,8,9,1,8,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,9,1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,3,8,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1]),Au={uFurFade:{value:1}},Fv=`
  float furHash(vec3 p) { p = fract(p * 0.1031); p += dot(p, p.zyx + 31.32); return fract((p.x + p.y) * p.z); }
  float furNoise(vec3 p) { vec3 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f);
    return mix(mix(mix(furHash(i), furHash(i + vec3(1, 0, 0)), f.x), mix(furHash(i + vec3(0, 1, 0)), furHash(i + vec3(1, 1, 0)), f.x), f.y),
               mix(mix(furHash(i + vec3(0, 0, 1)), furHash(i + vec3(1, 0, 1)), f.x), mix(furHash(i + vec3(0, 1, 1)), furHash(i + vec3(1, 1, 1)), f.x), f.y), f.z); }`;function Ov(i,t){const e=new li({vertexColors:!0,roughness:t.feather?.75:.92,metalness:0}),n={uH:{value:i},uFurLen:{value:t.length},uFurDensity:{value:t.density},uFurTip:{value:t.tip},uFeather:{value:t.feather?1:0}};return e.onBeforeCompile=r=>{Object.assign(r.uniforms,n,Au),r.vertexShader=r.vertexShader.replace("#include <common>",`#include <common>
        uniform float uH; uniform float uFurLen; uniform float uFurFade; uniform float uFeather; attribute float aFur; varying vec3 vFurP; varying vec3 vFurN; varying float vFurK;`).replace("#include <begin_vertex>",`#include <begin_vertex>
        vFurP = position; vFurN = normalize(objectNormal); vFurK = aFur;
        // out along the normal as far as the coat reaches here, combed back and down the body, the tips drooping
        float reach = uFurLen * uFurFade * aFur * uH;
        vec3 comb = vec3(0.0, -0.75, -0.65);
        comb -= dot(comb, vFurN) * vFurN;
        // a feather lies flatter than a hair: less out, more down the body
        transformed += vFurN * reach * mix(1.0, 0.45, uFeather) + comb * reach * mix(0.9, 1.5, uFeather) * uH;
        transformed.y -= reach * 0.35 * uH;`),r.fragmentShader=r.fragmentShader.replace("#include <common>",`#include <common>
        uniform float uH; uniform float uFurDensity; uniform float uFurFade; uniform float uFurTip; uniform float uFeather; varying vec3 vFurP; varying vec3 vFurN; varying float vFurK;
        ${Fv}`).replace("#include <color_fragment>",`#include <color_fragment>
        vec3 q = vFurP * uFurDensity;
        // how big a strand is on screen: under a pixel or two, the strands widen into a soft solid coat
        float fw = length(fwidth(q));
        vec3 cell = floor(q), n = normalize(vFurN);
        // the strand stands off its cell's centre by a hash: no lattice
        vec3 f = fract(q) - 0.5 - (vec3(furHash(cell + 17.0), furHash(cell + 41.0), furHash(cell + 73.0)) - 0.5) * 0.55;
        // across the strand: the offset from its cell's centre in the surface's own plane
        vec3 ft = f - dot(f, n) * n;
        float clump = furNoise(vFurP * 0.7);
        float len = (0.35 + 0.65 * furHash(cell)) * (0.55 + 0.6 * clump);
        float r = mix(0.48, 0.1, clamp(uH / max(len, 1e-3), 0.0, 1.0));
        r = mix(r, 0.75, smoothstep(0.35, 0.9, fw));
        float t = uH / max(len, 1e-3);
        float shade = mix(0.55, 1.0, t);
        if (uFeather > 0.5) {
          // a feather: a vane laid down the body, long along the comb and broad across it, narrowing to its tip, a
          // darker shaft down its middle and faint barbs; the next row's tips lie over its root, so a coat is shingled
          vec3 cd = vec3(0.0, -0.75, -0.65); cd -= dot(cd, n) * n; cd = length(cd) > 1e-3 ? normalize(cd) : normalize(cross(n, vec3(1.0, 0.0, 0.0)));
          len = 0.6 + 0.4 * furHash(cell);
          t = uH / len;
          float al = dot(ft, cd), ac = length(ft - al * cd);
          float ra = mix(0.62, 0.36, t), rb = mix(0.5, 0.2, t * t);
          r = 1.0;
          if ((al * al) / (ra * ra) + (ac * ac) / (rb * rb) > mix(1.0, 1.8, smoothstep(0.35, 0.9, fw))) discard;
          shade = mix(0.72, 1.0, t) * (ac < 0.035 ? 0.82 : 1.0) * (0.94 + 0.06 * sin(al * 60.0 + ac * 25.0)) * (0.9 + 0.2 * furHash(cell + 5.0));
          ft = vec3(0.0);
        }
        if (uH > len || length(ft) > r || vFurK < 0.02) discard;
        // dark at the root, lighter guard hairs at the tip
        diffuseColor.rgb *= shade;
        diffuseColor.rgb = mix(diffuseColor.rgb, diffuseColor.rgb * 1.25 + 0.06, uFurTip * smoothstep(0.6, 1.0, t));`)},e.customProgramCacheKey=()=>"kaiju-fur-v2",e}function Bv(i,t,e,n){const r=[];for(let s=1;s<=n;s++){const a=new iu(t,Ov(s/n,e));a.castShadow=!1,a.receiveShadow=!0,a.frustumCulled=!1,a.userData.h=s/n,i.add(a),a.bind(i.skeleton,i.bindMatrix),r.push(a)}return r}function kv(i=512){const t=document.createElement("canvas");t.width=t.height=i;const e=t.getContext("2d"),n=document.createElement("canvas");n.width=n.height=i;const r=n.getContext("2d"),s=e.createImageData(i,i),a=r.createImageData(i,i),o=22,c=[];let l=7;const h=()=>(l=l*1664525+1013904223>>>0,l/4294967296);for(let f=0;f<o;f++)for(let m=0;m<o;m++)c.push([(m+.2+h()*.6)/o,(f+.2+h()*.6)/o,.7+h()*.3]);for(let f=0;f<i;f++)for(let m=0;m<i;m++){const x=m/i,g=f/i,p=Math.floor(x*o),w=Math.floor(g*o);let y=9,M=9,T=1;for(let b=-1;b<=1;b++)for(let D=-1;D<=1;D++){const U=(p+D+o)%o,N=(w+b+o)%o,H=c[N*o+U];let Z=x-H[0],V=g-H[1];Z-=Math.round(Z),V-=Math.round(V);const rt=Math.sqrt(Z*Z+V*V);rt<y?(M=y,y=rt,T=H[2]):rt<M&&(M=rt)}const E=M-y,A=Math.min(1,E/.02),C=1-Math.min(1,y/(.55/o)),v=(.55+.45*A)*T*(.85+.3*C),_=(f*i+m)*4;s.data[_]=255*v,s.data[_+1]=255*v,s.data[_+2]=255*v,s.data[_+3]=255;const S=.55+.4*(1-A)-.15*C;a.data[_]=255*S,a.data[_+1]=255*S,a.data[_+2]=255*S,a.data[_+3]=255}e.putImageData(s,0,0),r.putImageData(a,0,0);const u=new bl(t);u.wrapS=u.wrapT=Kr,u.colorSpace=Rn;const d=new bl(n);return d.wrapS=d.wrapT=Kr,{map:u,rough:d}}let Xs=null;function zv(i=!1,t){if(i)return Hv();if(t==="armour")return new li({vertexColors:!0,roughness:.42,metalness:.45});if(t==="soft")return new li({vertexColors:!0,roughness:.82,metalness:0});if(t==="suit")return new li({vertexColors:!0,roughness:.34,metalness:.18});!Xs&&typeof document<"u"&&(Xs=kv());const e=new li({vertexColors:!0,roughness:.7,metalness:.02});return e.onBeforeCompile=n=>{n.uniforms.uScales={value:Xs?.map??null},n.uniforms.uRough={value:Xs?.rough??null},n.vertexShader=n.vertexShader.replace("#include <common>",`#include <common>
 varying vec3 vBind; varying vec3 vBindN;`).replace("#include <begin_vertex>",`#include <begin_vertex>
 vBind = position; vBindN = normal;`),n.fragmentShader=n.fragmentShader.replace("#include <common>",`#include <common>
        uniform sampler2D uScales; uniform sampler2D uRough;
        varying vec3 vBind; varying vec3 vBindN;
        vec4 triplanar(sampler2D t, vec3 p, vec3 n, float scale) {
          vec3 w = abs(n); w = pow(w, vec3(4.0)); w /= (w.x + w.y + w.z + 1e-4);
          return texture2D(t, p.yz * scale) * w.x + texture2D(t, p.xz * scale) * w.y + texture2D(t, p.xy * scale) * w.z;
        }`).replace("#include <color_fragment>",`#include <color_fragment>
        vec3 bn = normalize(vBindN);
        // scales are larger on the back and tail, finer on the face and hands
        float fine = smoothstep(14.0, 17.5, vBind.y) * step(3.0, vBind.z);
        float sc = mix(0.14, 0.32, fine);
        float scales = triplanar(uScales, vBind, bn, sc).r;
        // plates and claws are matte bone: keep their vertex colour, just darken the seams a little
        float isBone = step(0.78, diffuseColor.g) * step(0.7, diffuseColor.r);
        diffuseColor.rgb *= mix(0.55 + 0.6 * scales, 0.85 + 0.15 * scales, isBone);
        // belly plates: horizontal ridges
        float bellyish = step(0.6, diffuseColor.r) * step(diffuseColor.b, 0.7) * (1.0 - isBone);
        float ridge = 0.85 + 0.15 * smoothstep(0.2, 0.5, abs(fract(vBind.y * 1.6) - 0.5));
        diffuseColor.rgb *= mix(1.0, ridge, bellyish);
        float roughTex = triplanar(uRough, vBind, bn, sc).r;`).replace("#include <roughnessmap_fragment>","float roughnessFactor = mix(roughTex, 0.9, isBone);")},e.customProgramCacheKey=()=>"kaiju-v1",e}function Hv(){const i=new li({vertexColors:!0,roughness:.95,metalness:0});return i.onBeforeCompile=t=>{Object.assign(t.uniforms,Au),t.fragmentShader=t.fragmentShader.replace("#include <common>",`#include <common>
 uniform float uFurFade;`).replace("#include <color_fragment>",`#include <color_fragment>
 diffuseColor.rgb *= mix(1.0, 0.6, uFurFade);`)},i.customProgramCacheKey=()=>"kaiju-undercoat-v1",i}function eh(i,t,e){const n=i.box,r=(n.min[0]+n.max[0])/2,s=(n.min[1]+n.max[1])/2,a=(n.min[2]+n.max[2])/2,o=(n.max[0]-n.min[0])/2,c=(n.max[1]-n.min[1])/2,l=(n.max[2]-n.min[2])/2,h=new Tu(e,new pa,!1,!1,4e5);h.isolation=50;const u=h.field,d=e;for(let S=0;S<d;S++){const b=a+(S/(d-1)*2-1)*l;for(let D=0;D<d;D++){const U=s+(D/(d-1)*2-1)*c;for(let N=0;N<d;N++){const H=r+(N/(d-1)*2-1)*o;u[S*d*d+D*d+N]=Math.max(0,Math.min(100,50-i.sdf(H,U,b)*40))}}}h.update();const f=h.count,m=new Float32Array(f*3),x=new Float32Array(f*3),g=new Float32Array(f*3),p=h.positionArray,w=h.normalArray,y=i.palette.map(S=>new Gt(S)),M=new Gt;for(let S=0;S<f;S++){const b=r+p[S*3]*o,D=s+p[S*3+1]*c,U=a+p[S*3+2]*l;m[S*3]=b,m[S*3+1]=D,m[S*3+2]=U;let N=w[S*3]/o,H=w[S*3+1]/c,Z=w[S*3+2]/l;const V=Math.hypot(N,H,Z)||1;N/=V,H/=V,Z/=V,x[S*3]=N,x[S*3+1]=H,x[S*3+2]=Z;const rt=i.region(b,D,U);M.copy(y[rt]??y[0]),i.tint?.(rt,b,D,U,M);const ht=.94+.06*Math.sin(D*1.7+U*.9)*Math.cos(b*2.3);g[S*3]=M.r*ht,g[S*3+1]=M.g*ht,g[S*3+2]=M.b*ht}h.geometry.dispose();const T=new De;if(T.setAttribute("position",new oe(m,3)),T.setAttribute("normal",new oe(x,3)),T.setAttribute("color",new oe(g,3)),i.fur){const S=new Float32Array(f);for(let b=0;b<f;b++)S[b]=i.furLen?i.furLen(m[b*3],m[b*3+1],m[b*3+2]):1;T.setAttribute("aFur",new oe(S,1))}const E=new Uint16Array(f*4),A=new Float32Array(f*4),C=t.map((S,b)=>({i:b,a:S.a,b:S.b,reach:S.reach??1/0,name:S.name})),v=i.capture,_=i.weights??"sharp";for(let S=0;S<f;S++){const b=m[S*3],D=m[S*3+1],U=m[S*3+2];let N=1/0,H=1/0,Z=0,V=0;for(const mt of C){if(v&&!v(mt,b,D,U))continue;const Et=mt.b[0]-mt.a[0],Ft=mt.b[1]-mt.a[1],zt=mt.b[2]-mt.a[2],et=b-mt.a[0],lt=D-mt.a[1],F=U-mt.a[2],k=Math.max(0,Math.min(1,(et*Et+lt*Ft+F*zt)/(Et*Et+Ft*Ft+zt*zt||1))),B=Math.hypot(et-Et*k,lt-Ft*k,F-zt*k);B>mt.reach||(B<N?(H=N,V=Z,N=B,Z=mt.i):B<H&&(H=B,V=mt.i))}isFinite(H)||(H=N,V=Z);const rt=_==="rigid"?1:_==="soft"?1/Math.pow(N+1.2,2):1/Math.pow(N+.3,4),ht=_==="rigid"?0:_==="soft"?1/Math.pow(H+1.2,2):1/Math.pow(H+.3,4),dt=rt+ht;E[S*4]=Z,E[S*4+1]=V,A[S*4]=rt/dt,A[S*4+1]=ht/dt}return T.setAttribute("skinIndex",new oe(E,4)),T.setAttribute("skinWeight",new oe(A,4)),T}function Vv(i){const t=new Map;let e=null;for(const n of i){const r=new ru;if(r.name=n.name,n.parent){const s=i.find(a=>a.name===n.parent);r.position.set(n.a[0]-s.a[0],n.a[1]-s.a[1],n.a[2]-s.a[2]),t.get(n.parent).add(r)}else r.position.set(n.a[0],n.a[1],n.a[2]),e=r;t.set(n.name,r)}return{bones:t,root:e}}function Gv(i,t=i.res??88){const e=performance.now(),{bones:n,root:r}=Vv(i.segs);let s,a=[];if(i.body){const o=i.body,c=eh(o,i.segs,t),l=o.surface==="scales"||o.surface==="fur"?void 0:o.surface,h=new iu(c,zv(!!o.fur||o.surface==="fur",l));h.castShadow=!0,h.receiveShadow=!0,h.frustumCulled=!1,h.add(r),h.bind(new gc(i.segs.map(u=>n.get(u.name)))),o.fur&&(i.furShells??10)>0&&(a=Bv(h,eh(o,i.segs,Math.max(32,Math.round(t*.6))),o.fur,i.furShells??10)),s=h}else{const o=new Je;o.add(r),s=o}if(i.dress){const o=new Map;i.dress({bones:n,segs:i.segs,at(c,l,h,u,d){const f=i.segs.find(m=>m.name===l);return c.position.set(h-f.a[0],u-f.a[1],d-f.a[2]),c.traverse(m=>{m.isMesh&&(m.castShadow=!0,m.receiveShadow=!0)}),n.get(l).add(c),c},std(c){const l=JSON.stringify(c);let h=o.get(l);return h||(h=new li(c),o.set(l,h)),h}})}return s.name=i.id,{def:i,root:s,bones:n,fur:a,ms:performance.now()-e}}const ct=(i,t,e)=>{const n=Math.max(e-Math.abs(i-t),0)/e;return Math.min(i,t)-n*n*e*.25};function we(i,t,e,n,r,s,a){const o=i-n,c=t-r,l=e-s;return Math.sqrt(o*o+c*c+l*l)-a}function bt(i,t,e,n,r,s,a,o,c,l,h){const u=a-n,d=o-r,f=c-s,m=i-n,x=t-r,g=e-s,p=Math.max(0,Math.min(1,(m*u+x*d+g*f)/(u*u+d*d+f*f))),w=m-u*p,y=x-d*p,M=g-f*p;return Math.sqrt(w*w+y*y+M*M)-(l+(h-l)*p)}function Bt(i,t,e,n,r,s,a,o,c){const l=(i-n)/a,h=(t-r)/o,u=(e-s)/c,d=Math.sqrt(l*l+h*h+u*u),f=Math.sqrt(l*l/a+h*h/o+u*u/c);return f>0?d*(d-1)/f:-Math.min(a,o,c)}const Vi=2.1,pr=[1.95,6,.2],mr=[Vi,3.4,.55],Xr=[Vi,1,0],nh=[Vi,.3,2],Ci=[2.9,11,.8],Ii=[4.99,10.54,1.28],fi=[6.76,10.06,1.79],Ze=[[0,6.6,-2.6],[.5,4.6,-4.4],[1.6,2.4,-5.3],[3,1.1,-5.2],[4.5,.85,-4.1]],ih=[1.15,1.45,1.4,1.2,.75],ve=[0,14.4,.6],Wv=[{name:"pelvis",a:[0,6,0],b:[0,7.6,0],parent:null},{name:"spine1",a:[0,7.6,0],b:[0,9.4,.1],parent:"pelvis"},{name:"spine2",a:[0,9.4,.1],b:[0,11.4,.1],parent:"spine1"},{name:"neck",a:[0,11.4,.1],b:[0,ve[1]-1.6,ve[2]-.25],parent:"spine2"},{name:"head",a:[0,ve[1]-1.6,ve[2]-.25],b:[0,ve[1]+1.6,ve[2]+.1],parent:"neck"},{name:"jaw",a:[0,ve[1]-1.1,ve[2]+1.1],b:[0,ve[1]-1.2,ve[2]+2.9],parent:"head",reach:0},{name:"tail1",a:Ze[0],b:Ze[1],parent:"pelvis"},{name:"tail2",a:Ze[1],b:Ze[2],parent:"tail1"},{name:"tail3",a:Ze[2],b:Ze[3],parent:"tail2"},{name:"tail4",a:Ze[3],b:Ze[4],parent:"tail3"},{name:"thighL",a:pr,b:mr,parent:"pelvis"},{name:"shinL",a:mr,b:Xr,parent:"thighL"},{name:"footL",a:Xr,b:nh,parent:"shinL"},{name:"thighR",a:wn(pr),b:wn(mr),parent:"pelvis"},{name:"shinR",a:wn(mr),b:wn(Xr),parent:"thighR"},{name:"footR",a:wn(Xr),b:wn(nh),parent:"shinR"},{name:"armL",a:Ci,b:Ii,parent:"spine2"},{name:"forearmL",a:Ii,b:fi,parent:"armL"},{name:"armR",a:wn(Ci),b:wn(Ii),parent:"spine2"},{name:"forearmR",a:wn(Ii),b:wn(fi),parent:"armR"}];function wn(i){return[-i[0],i[1],i[2]]}const Xv={min:[-8.6,-.4,-7.2],max:[8.6,18.4,5.8]},Yn=[.98,ve[1]+.33,ve[2]+1.97],Ni=[0,ve[1]-.5,ve[2]+4.05],di=Ru(qv(fi,Ii)),eo=Ru([-di[2],0,di[0]]);function qv(i,t){return[i[0]-t[0],i[1]-t[1],i[2]-t[2]]}function Ru(i){const t=Math.hypot(i[0],i[1],i[2]);return[i[0]/t,i[1]/t,i[2]/t]}const Er=(i,t,e,n=0)=>[i[0]+di[0]*t+eo[0]*e,i[1]+di[1]*t+eo[1]*e+n,i[2]+di[2]*t+eo[2]*e],Mn=Er(fi,.35,0),Yv=Er(Mn,1.3,0),Cu=(i,t,e)=>(i-fi[0])*di[0]+(t-fi[1])*di[1]+(e-fi[2])*di[2],Lu=[-.42,-.14,.14,.42].map(i=>[Er(Mn,.35,i*1.1),Er(Mn,1.15-Math.abs(i)*.5,i*1.35,-.12)]);Lu.push([Er(Mn,-.1,.45),Er(Mn,.45,.95,-.1)]);const $v=[-.5,-.17,.17,.5].map(i=>[[Vi+i*1.1,.3,1.8],[Vi+i*1.3,.22,2.7-Math.abs(i)*.4]]),ri=(i,t,e,n,r,s,a)=>bt(i,t,e,n[0],n[1],n[2],r[0],r[1],r[2],s,a),ar=2.5;let rh=NaN,sh=NaN,ah=NaN;const si={body:0,head:0,arm:0,leg:0,tail:0,min:0};function fs(i,t,e){if(i===rh&&t===sh&&e===ah)return si;rh=i,sh=t,ah=e;const n=Math.abs(i);let r=we(i,t,e,0,9.2,.2,5.6);r<ar&&(r=Bt(i,t,e,0,7.7,.35,3.85,3.35,3.4),r=ct(r,Bt(i,t,e,0,10.3,.3,3,2.1,2.7),1.6),r=ct(r,Bt(i,t,e,0,6.9,-1.2,3.4,2.6,2.7),1.2),r=ct(r,we(n,t,e,Ci[0],Ci[1],Ci[2],1.15),.9),r=ct(r,bt(i,t,e,0,11,.2,0,ve[1]-1.4,ve[2]-.15,2.1,1.7),.8)),si.body=r;const s=t-ve[1],a=e-ve[2];let o=we(i,s,a,0,.6,.5,4.3);o<ar&&(o=Bt(i,s,a,0,0,0,2.38,2.05,2.21),o=ct(o,Bt(n,s,a,1.8,-.66,.25,1.15,1.23,1.31),.66),o=ct(o,bt(i,s,a,0,-.25,1.48,0,-.57,3.6,1.11,.45),.5),o=ct(o,bt(i,s,a,0,-1.07,1.15,0,-1.23,2.95,.78,.41),.33),o=ct(o,Bt(n,s,a,1.44,2.05,-.66,.78,1.03,.34),.29),o=Math.max(o,-we(n,t,e,Yn[0]+.05,Yn[1],Yn[2]+.2,.34))),si.head=o;let c=ri(n,t,e,Ci,Yv,1.6,1.6);if(c<ar&&(c=ri(n,t,e,Ci,Ii,.95,.8),c=ct(c,ri(n,t,e,Ii,fi,.8,.6),.4),we(n,t,e,Mn[0],Mn[1],Mn[2],1.6)<ar)){c=ct(c,Bt(n,t,e,Mn[0],Mn[1],Mn[2],.62,.38,.62),.3);for(const u of Lu)c=ct(c,ri(n,t,e,u[0],u[1],.24,.17),.14)}si.arm=c;let l=bt(n,t,e,pr[0],pr[1],pr[2],Vi,.6,1,2,2);if(l<ar&&(l=ri(n,t,e,pr,mr,1.42,1.1),l=ct(l,ri(n,t,e,mr,Xr,1.08,.85),.5),t<2.6)){l=ct(l,Math.max(Bt(n,t,e,Vi,.45,.75,.95,.6,1.75),-t),.45);for(const u of $v)l=ct(l,ri(n,t,e,u[0],u[1],.26,.18),.15)}si.leg=l;let h=we(i,t,e,2,3.4,-4.4,5.4);if(h<ar){h=1e9;for(let u=0;u+1<Ze.length;u++)h=ct(h,ri(i,t,e,Ze[u],Ze[u+1],ih[u],ih[u+1]),.5)}return si.tail=h,si.min=Math.min(r,o,c,l,h),si}function Zv(i,t,e){const n=fs(i,t,e);let r=ct(n.body,n.head,.6);return r=ct(r,n.arm,.5),r=ct(r,n.leg,.7),ct(r,n.tail,.6)}function Jv(i,t,e){let n=0,r=1/0,s=0;for(let a=0;a+1<Ze.length;a++){const o=Ze[a],c=Ze[a+1],l=c[0]-o[0],h=c[1]-o[1],u=c[2]-o[2],d=l*l+h*h+u*u,f=Math.max(0,Math.min(1,((i-o[0])*l+(t-o[1])*h+(e-o[2])*u)/d)),m=i-o[0]-l*f,x=t-o[1]-h*f,g=e-o[2]-u*f,p=m*m+x*x+g*g;p<r&&(r=p,n=s+f*Math.sqrt(d)),s+=Math.sqrt(d)}return n}function Kv(i,t,e){const n=Math.abs(i);if(Math.hypot(i,t-Ni[1],e-Ni[2])<.62)return 3;const r=fs(i,t,e),s=r.min;if(r.head===s){const a=t-ve[1],o=e-ve[2];if(o>.2&&a>-1.9){const c=n-1.1,l=a-.22+.32*c;if((c/1.25)**2+(l/.66)**2<1||n<.34&&a>-.35&&a<2.4&&o>.6)return 2;const h=n-1.05,u=a-1.12+.18*h;if((h/1)**2+(u/.4)**2<1||a<-.15+.25*Math.max(0,n-1.2)&&o>.5)return 1}return a>2.75&&n>.98?1:0}if(r.tail===s){const a=Jv(i,t,e);return a>7.9||a%2<.85?2:4}return r.arm===s?Cu(n,t,e)>-.25?5:0:r.leg===s?t<1.3?5:0:e>1.2&&(i/2.4)**2+((t-7.9)/3.1)**2<1?4:0}function jv(i,t,e){const n=Math.abs(i),r=Math.hypot(n-Yn[0],t-Yn[1],e-Yn[2]);if(r<.62||Math.hypot(i,t-Ni[1],e-Ni[2])<.85)return 0;const s=fs(i,t,e),a=s.min;if(s.head===a){const o=t-ve[1],c=e-ve[2];return o>1.4&&n>.9&&c<.1?.5:n>1.4&&o<0&&c<1.5?1.35:c>1?.35+.4*Math.min(1,(r-.62)/1.3):.9}return s.tail===a?1.4:s.arm===a?Cu(n,t,e)>-.25?.25:.9:s.leg===a?t<1.3?.3:1:1.1}const Qv=.4,t_=new Map([["pelvis",0],["spine1",0],["spine2",0],["neck",1],["head",2],["jaw",2],["armL",3],["forearmL",3],["armR",4],["forearmR",4],["thighL",5],["shinL",5],["footL",5],["thighR",6],["shinR",6],["footR",6],["tail1",7],["tail2",7],["tail3",7],["tail4",7]]),e_=(i,t,e,n)=>{const r=fs(t,e,n),s=r.min+Qv;switch(t_.get(i.name)){case 0:return r.body<=s;case 1:return(r.body<=s||r.head<=s)&&e>10.6&&e<ve[1]-1;case 2:return r.head<=s&&e>ve[1]-2.1;case 3:return r.arm<=s&&t>.5;case 4:return r.arm<=s&&t<-.5;case 5:return r.leg<=s&&t>.2;case 6:return r.leg<=s&&t<-.2;case 7:return r.tail<=s;default:return!0}},n_={id:"jimothy",name:"Jimothy",blurb:"The round Seattle raccoon, standing up",segs:Wv,body:{sdf:Zv,region:Kv,box:Xv,palette:[7760994,15130834,1841431,657930,10326916,3814192],weights:"soft",capture:e_,fur:{length:1,density:7,tip:.18},furLen:jv,tint(i,t,e,n,r){if(i!==0)return;n<-.5&&r.multiplyScalar(1-.2*Math.min(1,(-.5-n)/2.5));const s=fs(t,e,n);(s.arm===s.min||s.leg===s.min)&&r.multiplyScalar(.82)}},dress(i){const t=i.std({color:328965,roughness:.06,metalness:.1});for(const n of[-1,1])i.at(new Xt(new Ue(.34,14,10),t),"head",n*Yn[0],Yn[1],Yn[2]);const e=new Xt(new Ue(.42,14,10),i.std({color:657930,roughness:.25}));e.scale.set(1.15,.8,.75),i.at(e,"head",Ni[0],Ni[1],Ni[2])},fit:{size:1.05,limb:.5},idle:{tail:.15},res:84,furShells:8},Br=new O;function hn(i,t,e,n,r,s){const a=2*Math.PI*r/4,o=Math.max(s-2*r,0),c=Math.PI/4;Br.copy(t),Br[n]=0,Br.normalize();const l=.5*a/(a+o),h=1-Br.angleTo(i)/c;return Math.sign(Br[e])===1?h*l:o/(a+o)+l+l*(1-h)}class bc extends qe{constructor(t=1,e=1,n=1,r=2,s=.1){const a=r*2+1;if(s=Math.min(t/2,e/2,n/2,s),super(1,1,1,a,a,a),this.type="RoundedBoxGeometry",this.parameters={width:t,height:e,depth:n,segments:r,radius:s},a===1)return;const o=this.toNonIndexed();this.index=null,this.attributes.position=o.attributes.position,this.attributes.normal=o.attributes.normal,this.attributes.uv=o.attributes.uv;const c=new O,l=new O,h=new O(t,e,n).divideScalar(2).subScalar(s),u=this.attributes.position.array,d=this.attributes.normal.array,f=this.attributes.uv.array,m=u.length/6,x=new O,g=.5/a;for(let p=0,w=0;p<u.length;p+=3,w+=2)switch(c.fromArray(u,p),l.copy(c),l.x-=Math.sign(l.x)*g,l.y-=Math.sign(l.y)*g,l.z-=Math.sign(l.z)*g,l.normalize(),u[p+0]=h.x*Math.sign(c.x)+l.x*s,u[p+1]=h.y*Math.sign(c.y)+l.y*s,u[p+2]=h.z*Math.sign(c.z)+l.z*s,d[p+0]=l.x,d[p+1]=l.y,d[p+2]=l.z,Math.floor(p/m)){case 0:x.set(1,0,0),f[w+0]=hn(x,l,"z","y",s,n),f[w+1]=1-hn(x,l,"y","z",s,e);break;case 1:x.set(-1,0,0),f[w+0]=1-hn(x,l,"z","y",s,n),f[w+1]=1-hn(x,l,"y","z",s,e);break;case 2:x.set(0,1,0),f[w+0]=1-hn(x,l,"x","z",s,t),f[w+1]=hn(x,l,"z","x",s,n);break;case 3:x.set(0,-1,0),f[w+0]=1-hn(x,l,"x","z",s,t),f[w+1]=1-hn(x,l,"z","x",s,n);break;case 4:x.set(0,0,1),f[w+0]=1-hn(x,l,"x","y",s,t),f[w+1]=1-hn(x,l,"y","x",s,e);break;case 5:x.set(0,0,-1),f[w+0]=hn(x,l,"x","y",s,t),f[w+1]=1-hn(x,l,"y","x",s,e);break}}static fromJSON(t){return new bc(t.width,t.height,t.depth,t.segments,t.radius)}}function Ec(i,t=!1){const e=i[0].index!==null,n=new Set(Object.keys(i[0].attributes)),r=new Set(Object.keys(i[0].morphAttributes)),s={},a={},o=i[0].morphTargetsRelative,c=new De;let l=0;for(let h=0;h<i.length;++h){const u=i[h];let d=0;if(e!==(u.index!==null))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". All geometries must have compatible attributes; make sure index attribute exists among all geometries, or in none of them."),null;for(const f in u.attributes){if(!n.has(f))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+'. All geometries must have compatible attributes; make sure "'+f+'" attribute exists among all geometries, or in none of them.'),null;s[f]===void 0&&(s[f]=[]),s[f].push(u.attributes[f]),d++}if(d!==n.size)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". Make sure all geometries have the same number of attributes."),null;if(o!==u.morphTargetsRelative)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". .morphTargetsRelative must be consistent throughout all geometries."),null;for(const f in u.morphAttributes){if(!r.has(f))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+".  .morphAttributes must be consistent throughout all geometries."),null;a[f]===void 0&&(a[f]=[]),a[f].push(u.morphAttributes[f])}if(t){let f;if(e)f=u.index.count;else if(u.attributes.position!==void 0)f=u.attributes.position.count;else return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". The geometry must have either an index or a position attribute"),null;c.addGroup(l,f,h),l+=f}}if(e){let h=0;const u=[];for(let d=0;d<i.length;++d){const f=i[d].index;for(let m=0;m<f.count;++m)u.push(f.getX(m)+h);h+=i[d].attributes.position.count}c.setIndex(u)}for(const h in s){const u=oh(s[h]);if(!u)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+h+" attribute."),null;c.setAttribute(h,u)}for(const h in a){const u=a[h][0].length;if(u===0)break;c.morphAttributes=c.morphAttributes||{},c.morphAttributes[h]=[];for(let d=0;d<u;++d){const f=[];for(let x=0;x<a[h].length;++x)f.push(a[h][x][d]);const m=oh(f);if(!m)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+h+" morphAttribute."),null;c.morphAttributes[h].push(m)}}return c}function oh(i){let t,e,n,r=-1,s=0;for(let l=0;l<i.length;++l){const h=i[l];if(t===void 0&&(t=h.array.constructor),t!==h.array.constructor)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.array must be of consistent array types across matching attributes."),null;if(e===void 0&&(e=h.itemSize),e!==h.itemSize)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.itemSize must be consistent across matching attributes."),null;if(n===void 0&&(n=h.normalized),n!==h.normalized)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.normalized must be consistent across matching attributes."),null;if(r===-1&&(r=h.gpuType),r!==h.gpuType)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.gpuType must be consistent across matching attributes."),null;s+=h.count*e}const a=new t(s),o=new oe(a,e,n);let c=0;for(let l=0;l<i.length;++l){const h=i[l];if(h.isInterleavedBufferAttribute){const u=c/e;for(let d=0,f=h.count;d<f;d++)for(let m=0;m<e;m++){const x=h.getComponent(d,m);o.setComponent(d+u,m,x)}}else a.set(h.array,c);c+=h.count*e}return r!==void 0&&(o.gpuType=r),o}const xn=2.75,i_=[{name:"pelvis",a:[0,9.6,0],b:[0,10.8,0],parent:null},{name:"spine1",a:[0,10.8,0],b:[0,12.6,0],parent:"pelvis"},{name:"spine2",a:[0,12.6,0],b:[0,15,0],parent:"spine1"},{name:"neck",a:[0,15,0],b:[0,15.9,0],parent:"spine2"},{name:"head",a:[0,15.9,0],b:[0,18.4,.1],parent:"neck"},{name:"jaw",a:[0,16.5,1],b:[0,16.5,1.3],parent:"head",reach:0},{name:"tail1",a:[0,9.4,-.8],b:[0,9.2,-1.2],parent:"pelvis",reach:0},{name:"tail2",a:[0,9.2,-1.2],b:[0,9,-1.6],parent:"tail1",reach:0},{name:"tail3",a:[0,9,-1.6],b:[0,8.8,-2],parent:"tail2",reach:0},{name:"tail4",a:[0,8.8,-2],b:[0,8.6,-2.4],parent:"tail3",reach:0},{name:"thighL",a:[.95,9.6,0],b:[.95,5.3,0],parent:"pelvis"},{name:"shinL",a:[.95,5.3,0],b:[.95,1.2,0],parent:"thighL"},{name:"footL",a:[.95,1.2,0],b:[.95,.4,1.5],parent:"shinL"},{name:"thighR",a:[-.95,9.6,0],b:[-.95,5.3,0],parent:"pelvis"},{name:"shinR",a:[-.95,5.3,0],b:[-.95,1.2,0],parent:"thighR"},{name:"footR",a:[-.95,1.2,0],b:[-.95,.4,1.5],parent:"shinR"},{name:"armL",a:[xn,14.4,0],b:[xn,11.9,0],parent:"spine2"},{name:"forearmL",a:[xn,11.9,0],b:[xn,9.5,0],parent:"armL"},{name:"armR",a:[-xn,14.4,0],b:[-xn,11.9,0],parent:"spine2"},{name:"forearmR",a:[-xn,11.9,0],b:[-xn,9.5,0],parent:"armR"}],qs=[{y0:9.9,y1:12.3,r0:3.5,r1:1.45,n:9,bone:"pelvis"},{y0:11.35,y1:13.6,r0:3.05,r1:1.25,n:8,bone:"spine1"},{y0:12.75,y1:14.85,r0:2.65,r1:1.05,n:7,bone:"spine2"},{y0:14.05,y1:15.8,r0:2.15,r1:.8,n:6,bone:"spine2"}],Pu=.5,r_=1.4,s_=4168267,a_=1195289,Du=(i,t)=>i.r1+(i.r0-i.r1)*Math.pow(Math.min(1,Math.max(0,1-t)),r_);function o_(i){const t=i.n*2,e=i.y1-i.y0,n=new Le(i.r1,i.r0,e,t,4,!0),r=n.attributes.position,s=new Float32Array(r.count*3),a=new Gt(s_),o=new Gt(a_),c=new Gt;for(let l=0;l<r.count;l++){const h=r.getX(l),u=r.getY(l),d=r.getZ(l),f=(u+e/2)/e,m=Math.hypot(h,d)||1;let x=Du(i,f),g=0;f<1e-4&&(Math.round(Math.atan2(h,d)/(Math.PI*2/t))%2+2)%2===0&&(g=-Pu,x*=1.05),r.setXYZ(l,h/m*x,u+g,d/m*x),c.copy(a).lerp(o,Math.pow(Math.min(1,Math.max(0,f)),.8)),s[l*3]=c.r,s[l*3+1]=c.g,s[l*3+2]=c.b}return n.setAttribute("color",new oe(s,3)),n.computeVertexNormals(),n}function c_(i,t,e){const r=new Lr(i,t,e,6,!1),s=r.attributes.position,a=r.attributes.normal;for(let o=0;o<=t;o++)for(let c=0;c<=6;c++){const l=o*7+c,h=1+.42*Math.sin(o*2.2+c*(Math.PI*2*2/6));s.setXYZ(l,s.getX(l)+a.getX(l)*e*(h-1),s.getY(l)+a.getY(l)*e*(h-1),s.getZ(l)+a.getZ(l)*e*(h-1))}return r.computeVertexNormals(),r}function ch(i,t,e,n){const r=Du(i,e)+n;return new O(Math.sin(t)*r,i.y0+e*(i.y1-i.y0),Math.cos(t)*r)}const lh=[16719904,16755216,2781439,16724160],l_=2,h_=16763955;function u_(i){const t=new Map,e=new Set,n=(z,G,X,tt,ot)=>{z.position.set(X,tt,ot),z.updateMatrixWorld(!0),z.traverse(ut=>{const Pt=ut;if(!Pt.isMesh)return;const Ht=Pt.material,I=`${G}|${Ht.uuid}|${Pt.name}`,R=Pt.geometry.index?Pt.geometry.toNonIndexed():Pt.geometry.clone();for(const nt of Object.keys(R.attributes))nt!=="position"&&nt!=="normal"&&nt!=="color"&&R.deleteAttribute(nt);R.applyMatrix4(Pt.matrixWorld);let Y=t.get(I);Y||(Y={bone:G,mat:Ht,name:Pt.name,geos:[]},t.set(I,Y)),Y.geos.push(R)})},r=new Map,s=(z,G,X,tt=.25)=>{const ot=`${z},${G},${X},${tt}`;let ut=r.get(ot);return ut||(ut=new bc(z,G,X,2,Math.min(tt,z/2-.01,G/2-.01,X/2-.01)),r.set(ot,ut)),ut},a=(z,G,X="")=>{e.add(z);const tt=new Xt(z,G);return tt.name=X,tt},o=i.std({color:15909267,roughness:.6}),c=i.std({color:1380623,roughness:.35}),l=i.std({color:5978656,roughness:.8}),h=i.std({color:15899278,roughness:.7}),u=i.std({color:16237849,roughness:.35,metalness:.05}),d=i.std({color:12722988,roughness:.75}),f=i.std({color:15921128,roughness:.8}),m=i.std({color:13146714,roughness:.85}),x=i.std({color:9397556,roughness:.85}),g=i.std({color:3100550,roughness:.85}),p=i.std({color:7029286,roughness:.6}),w=i.std({color:8014372,roughness:.7}),y=i.std({color:2760730,roughness:.9}),M=i.std({color:13225686,roughness:.3,metalness:.85}),T=i.std({color:5593439,roughness:.35,metalness:.8}),E=i.std({color:11039806,roughness:.7}),A=i.std({color:16777215,vertexColors:!0,roughness:.8,flatShading:!0,side:Sn}),C=i.std({color:15250746,roughness:.3,metalness:.9}),v=i.std({color:15777605,roughness:.25,metalness:.9,flatShading:!0}),_=i.std({color:1522205,roughness:.7}),S=[i.std({color:13705003,roughness:.18,metalness:.55}),i.std({color:15316028,roughness:.2,metalness:.9}),i.std({color:2315209,roughness:.18,metalness:.55})],b=[];for(let z=0;z<l_;z++)for(let G=0;G<lh.length;G++){const X=i.std({color:2105376,emissive:lh[G],emissiveIntensity:2.5,roughness:.3,name:`bulb-${G}-${z}`});X.userData.phase=G*1.9+z*Math.PI,X.userData.rate=1.5+.6*((G+z*3)%4),b.push(X)}const D=i.std({color:6965760,emissive:h_,emissiveIntensity:1.3,roughness:.25,metalness:.4,name:"star"});n(a(s(2.9,2.6,2.6,.62),o),"head",0,17.15,.05);const U=new Ue(.2,12,8);for(const z of[-1,1]){const G=a(U,c);G.scale.set(.8,1.3,.45),n(G,"head",z*.52,17.45,1.35);const X=a(U,h);X.scale.set(1.3,.8,.3),n(X,"head",z*.95,16.9,1.33);const tt=a(s(.8,.34,.3,.14),l);tt.rotation.z=z*-.22,n(tt,"head",z*.38,16.82,1.41)}n(a(s(2.96,1.25,.5,.22),l),"head",0,17.55,-1.08);for(const z of[-1,1])n(a(s(.22,1.05,1.25,.1),l),"head",z*1.42,17.6,-.62);const N=a(new Ui(.5,.075,6,18,2.3),c);N.rotation.z=-Math.PI/2-1.15,n(N,"head",0,16.78,1.36);const H=new Je;H.add(a(new Ue(1,24,10,0,Math.PI*2,0,Math.PI/2),u));const Z=a(new Ui(1,.11,6,20,Math.PI),u);Z.rotation.y=Math.PI/2,H.add(Z),H.scale.set(1.66,1.22,1.72),n(H,"head",0,18,.05);const V=a(new Le(1,1,.16,28),u);V.scale.set(1.9,1,2.08),n(V,"head",0,18.05,.3);const rt=new du;for(let z=0;z<10;z++){const G=Math.PI/2+z*Math.PI/5,X=z%2?.42:1;z?rt.lineTo(Math.cos(G)*X,Math.sin(G)*X):rt.moveTo(Math.cos(G)*X,Math.sin(G)*X)}const ht=new Sc(rt,{depth:.36,bevelEnabled:!0,bevelThickness:.12,bevelSize:.08,bevelSegments:1});ht.translate(0,0,-.18),n(a(ht,D,"star"),"head",0,20.15,.05),n(a(new Le(.12,.16,.6,6),C),"head",0,19.35,.05),n(a(new Le(.72,.8,1.5,10),o),"neck",0,15.6,0),n(a(s(2*xn-1.2,2.8,2.2,.4),d),"spine2",0,13.9,0),n(a(s(3.5,2.4,2,.3),d),"spine1",0,11.7,0),n(a(s(3.75,2,2.1,.3),g),"pelvis",0,9.5,0);for(const z of qs)n(a(o_(z),A),z.bone,0,(z.y0+z.y1)/2,0);const dt=new Ue(.36,12,8),mt=new Le(.1,.1,.16,6);let Et=0;qs.forEach((z,G)=>{const X=Math.PI*2/z.n;for(let tt=G%2;tt<z.n;tt+=2){const ot=tt*X,ut=z.r0*1.05+.1,Pt=z.y0-Pu-.34;n(a(dt,S[Et++%S.length]),z.bone,Math.sin(ot)*ut,Pt,Math.cos(ot)*ut),n(a(mt,C),z.bone,Math.sin(ot)*ut,Pt+.38,Math.cos(ot)*ut)}}),qs.forEach((z,G)=>{const X=[],tt=G*1.9;for(let ot=0;ot<=48;ot++){const ut=ot/48;X.push(ch(z,tt+ut*Math.PI*2,.18+.64*ut,.13))}n(a(c_(new ci(X),120,.17),v),z.bone,0,0,0)});const Ft=new Ue(.24,10,7);let zt=0;qs.forEach((z,G)=>{const X=z.n-2,tt=.4+G*.7,ot=.6,ut=.3,Pt=I=>{const R=Math.sin(I*Math.PI*X);return ch(z,tt+I*Math.PI*2,ot-ut*R*R,.1)},Ht=[];for(let I=0;I<96;I++)Ht.push(Pt(I/96));n(a(new Lr(new ci(Ht,!0),192,.045,4,!0),_),z.bone,0,0,0);for(let I=0;I<X;I++)for(const R of[.22,.5,.78]){const Y=Pt((I+R)/X),nt=a(Ft,b[(zt*5+G)%b.length],"bulb");nt.scale.set(1,1.3,1),n(nt,z.bone,Y.x*1.04,Y.y-.22,Y.z*1.04),zt++}});for(const z of[-1,1]){const G=z>0?"L":"R",X=z*xn;n(a(s(1.7,1.2,1.7,.45),d),"arm"+G,X,14.35,0),n(a(s(1.5,2.8,1.5,.25),d),"arm"+G,X,13,0),n(a(s(1.38,1.38,1.38,.55),d),"arm"+G,X,11.9,0),n(a(s(1.42,2.3,1.42,.25),d),"forearm"+G,X,10.8,0),n(a(s(1.58,.45,1.58,.15),f),"forearm"+G,X,9.75,0),n(a(s(1.64,.6,1.64,.2),x),"forearm"+G,X,9.3,0),n(a(s(1.45,1.3,1.5,.4),m),"forearm"+G,X,8.5,.05),n(a(s(.42,.8,.46,.18),m),"forearm"+G,X-z*.5,8.75,.82)}const et=new Je,lt=a(new Le(.19,.22,3.4,8),E);lt.rotation.x=Math.PI/2,lt.position.z=1.1,et.add(lt);const F=a(new Le(.26,.26,1.3,8),y);F.rotation.x=Math.PI/2,et.add(F);const k=2.75,B=a(s(.62,.9,.7,.12),T);B.position.set(0,.05,k),et.add(B);const K=a(new Le(.4,.36,.9,10),M);K.position.set(0,.85,k),et.add(K);const j=a(s(.5,1.15,.32,.12),T);j.position.set(0,-.8,k-.25),j.rotation.x=-.55,et.add(j),et.rotation.y=-.6,n(et,"forearmR",-xn,8.45,.1);for(const z of[-1,1]){const G=z>0?"L":"R",X=z*.95;n(a(s(1.8,4.5,1.8,.25),g),"thigh"+G,X,7.75,0),n(a(s(1.76,1.76,1.76,.6),g),"thigh"+G,X,5.3,0),n(a(s(1.74,3.9,1.74,.25),g),"shin"+G,X,3.3,0),n(a(s(1.98,1.7,2,.3),w),"shin"+G,X,1.6,0),n(a(s(1.95,.32,2.05,.1),w),"shin"+G,X,2.45,0),n(a(s(2,1.05,3.1,.4),w),"foot"+G,X,.62,.55),n(a(s(2.1,.3,3.25,.1),y),"foot"+G,X,.15,.55);for(let tt=0;tt<3;tt++)n(a(s(1,.1,.16,.04),f),"shin"+G,X,1.1+tt*.4,1.02)}n(a(s(3.95,.62,2.3,.15),p),"pelvis",0,9.05,0),n(a(s(.7,.5,.14,.06),M),"pelvis",0,9.05,1.18);for(const z of[-1,1])n(a(s(.85,1.05,.7,.18),p),"pelvis",z*1.65,8.55,1);const P=new Je;P.add(a(s(.26,1.7,.12,.05),M));const Q=a(new Ui(.28,.1,6,12,Math.PI*1.4),M);Q.position.y=1,Q.rotation.z=-Math.PI*.2,P.add(Q),P.rotation.z=.2,n(P,"pelvis",-1.7,9,1.05);for(const z of t.values()){const G=i.segs.find(ot=>ot.name===z.bone).a,X=Ec(z.geos);for(const ot of z.geos)ot.dispose();if(!X)throw new Error(`builder: parts on ${z.bone} would not merge`);X.translate(-G[0],-G[1],-G[2]);const tt=new Xt(X,z.mat);tt.name=z.name,i.at(tt,z.bone,G[0],G[1],G[2])}for(const z of e)z.dispose()}const hh=new WeakMap;function f_(i,t){let e=hh.get(i);if(!e){const n=new Set;let r=null;i.traverse(s=>{const a=s.material;s.name==="bulb"&&a&&n.add(a),s.name==="star"&&a&&(r=a)}),e={bulbs:[...n],star:r},hh.set(i,e)}for(const n of e.bulbs){const r=.5+.5*Math.sin(t*n.userData.rate+n.userData.phase);n.emissiveIntensity=.55+1.35*r*r*r}e.star&&(e.star.emissiveIntensity=1.25+.3*Math.sin(t*2.4))}const d_={id:"builder",name:"Builder",blurb:"A blocky builder, decked out as a Christmas tree",segs:i_,dress:u_,tick:f_,fit:{size:1.06,limb:.2}},p_=[{name:"pelvis",a:[0,9.6,0],b:[0,10.6,0],parent:null},{name:"spine1",a:[0,10.6,0],b:[0,12.4,.1],parent:"pelvis"},{name:"spine2",a:[0,12.4,.1],b:[0,15,.1],parent:"spine1"},{name:"neck",a:[0,15,.1],b:[0,15.9,.15],parent:"spine2"},{name:"head",a:[0,15.9,.15],b:[0,18.4,.3],parent:"neck"},{name:"jaw",a:[0,16.5,-.3],b:[0,15.55,1],parent:"head",reach:0},{name:"tail1",a:[0,10.4,-1],b:[0,9.6,-1.1],parent:"pelvis",reach:0},{name:"tail2",a:[0,9.6,-1.1],b:[0,8.8,-1.2],parent:"tail1",reach:0},{name:"tail3",a:[0,8.8,-1.2],b:[0,8,-1.3],parent:"tail2",reach:0},{name:"tail4",a:[0,8,-1.3],b:[0,7.2,-1.4],parent:"tail3",reach:0},{name:"thighL",a:[1.1,9.6,0],b:[1.2,5.3,.2],parent:"pelvis"},{name:"shinL",a:[1.2,5.3,.2],b:[1.2,1.1,-.1],parent:"thighL"},{name:"footL",a:[1.2,1.1,-.1],b:[1.2,.35,1.4],parent:"shinL"},{name:"thighR",a:[-1.1,9.6,0],b:[-1.2,5.3,.2],parent:"pelvis"},{name:"shinR",a:[-1.2,5.3,.2],b:[-1.2,1.1,-.1],parent:"thighR"},{name:"footR",a:[-1.2,1.1,-.1],b:[-1.2,.35,1.4],parent:"shinR"},{name:"armL",a:[2.4,14.6,0],b:[2.72,11.9,-.05],parent:"spine2"},{name:"forearmL",a:[2.72,11.9,-.05],b:[2.85,9.45,.4],parent:"armL"},{name:"armR",a:[-2.4,14.6,0],b:[-2.72,11.9,-.05],parent:"spine2"},{name:"forearmR",a:[-2.72,11.9,-.05],b:[-2.85,9.45,.4],parent:"armR"}],cs=i=>new O(i[0],i[1],i[2]);function Iu(i,t){const e=cs(t).sub(cs(i)).normalize(),n=new O(1,0,0).addScaledVector(e,-e.x);n.lengthSq()<1e-6&&n.set(0,0,1),n.normalize();const r=new O().crossVectors(n,e);return new ie().makeBasis(n,e,r).setPosition(i[0],i[1],i[2])}const Gn=(i,t,e,n,r)=>ai(i,t,e,n,r,6,5,2);function ai(i,t,e,n,r,s=12,a=14,o=4){const c=cs(t).distanceTo(cs(i)),l=[];for(let u=0;u<=o;u++){const d=-Math.PI/2+u/o*(Math.PI/2);l.push(new St(Math.max(.001,e*Math.cos(d)),e*.75*Math.sin(d)))}const h=Math.min(.2,1.3*Math.max(e,r)/c);for(let u=1;u<a;u++){const d=u/a,f=n+(e-n)*Math.exp(-((d/h)**2))+(r-n)*Math.exp(-(((1-d)/h)**2));l.push(new St(f,d*c))}for(let u=0;u<=o;u++){const d=u/o*(Math.PI/2);l.push(new St(Math.max(.001,r*Math.cos(d)),c+r*.75*Math.sin(d)))}return new os(l,s).applyMatrix4(Iu(i,t))}function Me(i,t,e=[1,1,1],n=12){return new Ue(t,n,Math.max(6,Math.round(n*.7))).scale(e[0],e[1],e[2]).translate(i[0],i[1],i[2])}function m_(i,t,e=24,n=8){return new Lr(new ci(i.map(cs)),e,t,n,!1)}function ec(i,t,e=24,n=8){return[m_(i,t,e,n),Me(i[0],t,[1,1,1],n),Me(i[i.length-1],t,[1,1,1],n)]}function un(i){const t=Ec(i.map(e=>e.index?e:e.toNonIndexed()),!1);for(const e of i)e.dispose();return t}const g_=i=>[-i[0],i[1],i[2]];function ia(i,t,e,n,r=6e4){const s=v=>(t.max[v]-t.min[v])*e/(e-7),a=v=>t.min[v]-2.5*s(v)/e,o=a(0)+s(0)/2,c=a(1)+s(1)/2,l=a(2)+s(2)/2,h=s(0)/2,u=s(1)/2,d=s(2)/2,f=new Tu(e,new pa,!1,!1,r);f.isolation=50;const m=f.field,x=e,g=40;for(let v=0;v<x;v++){const _=l+(2*v/x-1)*d;for(let S=0;S<x;S++){const b=c+(2*S/x-1)*u;for(let D=0;D<x;D++){const U=o+(2*D/x-1)*h;m[v*x*x+S*x+D]=Math.max(0,Math.min(100,50-i(U,b,_)*g))}}}f.update();const p=f.count,w=f.positionArray,y=f.normalArray,M=new Float32Array(p*3),T=new Float32Array(p*3),E=n?new Float32Array(p*3):null,A=new Gt;for(let v=0;v<p;v++){const _=o+w[v*3]*h,S=c+w[v*3+1]*u,b=l+w[v*3+2]*d;M[v*3]=_,M[v*3+1]=S,M[v*3+2]=b;let D=y[v*3]/h,U=y[v*3+1]/u,N=y[v*3+2]/d;const H=Math.hypot(D,U,N)||1;D/=H,U/=H,N/=H,T[v*3]=D,T[v*3+1]=U,T[v*3+2]=N,E&&(A.setRGB(1,1,1),n(_,S,b,A),E[v*3]=A.r,E[v*3+1]=A.g,E[v*3+2]=A.b)}f.geometry.dispose();const C=new De;return C.setAttribute("position",new oe(M,3)),C.setAttribute("normal",new oe(T,3)),E&&C.setAttribute("color",new oe(E,3)),C.computeBoundingSphere(),C}const kr=(i,t,e)=>-ct(-i,-t,e),_r=[.43,17.02,1.06],uh=[.43,16.99,.74];function Uu(i,t,e,n,r){const s=Math.abs(i),o=e-n,c=r,l=Math.hypot(o,c),h=(s*o+(t-e)*c)/l;return Math.max(h,n-t)}function v_(i,t,e){const n=Math.abs(i);let r=Bt(i,t,e,0,17.45,-.12,1.1,1.13,1.32);r=ct(r,Bt(i,t,e,0,16.8,-.35,.98,.62,.95),.3),r=ct(r,Bt(i,t,e,0,16.68,.58,.8,.74,.72),.35),r=ct(r,Bt(n,t,e,.78,16.86,.55,.33,.3,.48),.22),r=ct(r,bt(n,t,e,.86,16.8,.35,.98,16.68,-.42,.15,.13),.15),r=ct(r,bt(n,t,e,.12,17.32,1.12,.78,17.36,.95,.17,.15),.2),r=kr(r,-Bt(n,t,e,1.32,16.95,.05,.38,.5,.55),.18),r=kr(r,-Bt(n,t,e,_r[0],_r[1],_r[2],.36,.34,.5),.07);const s=Math.min(Uu(i,t,16.86,16.42,.19),Math.hypot(n-.08,t-16.47)-.11);return r=kr(r,-Math.max(s,.8-e),.04),r=kr(r,16.08-t,.1),r=kr(r,-Bt(n,t,e,.8,16.25,.62,.22,.3,.35),.12),r}function __(i,t,e,n){const r=Math.abs(i),s=Bt(r,t,e,_r[0],_r[1],_r[2],.42,.4,.56),a=Math.max(Math.min(Uu(i,t,16.86,16.42,.19),Math.hypot(r-.08,t-16.47)-.11),.8-e)-.06,c=Math.max(0,Math.min(1,-Math.min(s,a)/.05))*(.75+.25*Math.max(0,Math.min(1,(1.2-e)/.4)));n.copy(E_).lerp(w_,c),c===0&&n.multiplyScalar(.94+.06*Math.max(0,Math.min(1,(t-16.3)/1.2)))}function x_(i,t,e,n,r,s,a){const o=r-e,c=s-n,l=Math.max(0,Math.min(1,((i-e)*o+(t-n)*c)/(o*o+c*c)));return Math.hypot(i-e-o*l,t-n-c*l)-a}function M_(i,t,e){const n=Math.abs(i);let r=bt(n,t,e,0,15.62,1,.5,15.66,.66,.17,.17);return r=ct(r,bt(n,t,e,.5,15.66,.66,.78,15.74,-.12,.17,.16),.1),r=ct(r,Math.max(x_(t,e,15.74,-.14,16.4,-.3,.2),Math.abs(n-.8)-.07),.08),r=ct(r,Bt(n,t,e,.82,16.45,-.3,.15,.11,.13),.06),r=ct(r,Bt(i,t,e,0,15.6,1,.33,.21,.17),.1),r=ct(r,bt(n,t,e,0,15.8,1.02,.52,15.8,.62,.12,.12),.08),r}function S_(i,t,e){const n=Math.abs(i),r=Math.abs(Math.hypot(n-.25,t-10.95,e-.75)-1.4)-.09;let s=Math.max(r,Bt(n,t,e,1.2,10.5,-.18,.78,.7,.85));return s=ct(s,bt(n,t,e,.6,11,-.45,1.55,11.05,.2,.1,.1),.12),s=ct(s,Bt(i,t,e,0,9.95,-.78,.48,.72,.22),.15),s=ct(s,bt(n,t,e,.38,10.35,-.72,.85,10.4,-.45,.17,.15),.12),s=ct(s,bt(n,t,e,1.25,10.15,-.15,1,9.62,0,.24,.24),.15),s=ct(s,we(n,t,e,.92,9.6,0,.32),.12),s=Math.min(s,Math.hypot(Math.hypot(t-9.6,e)-.36,n-1)-.1),s=ct(s,bt(n,t,e,.95,9.48,.28,.12,9.3,.72,.15,.14),.1),s=ct(s,bt(n,t,e,.12,9.32,.72,.1,9.02,.66,.15,.15),.1),s=ct(s,bt(n,t,e,1,9.38,-.2,.78,8.92,-.05,.18,.17),.1),s=ct(s,bt(n,t,e,.78,8.92,-.05,.12,9.04,.62,.13,.12),.1),s}function no(i,t,e,n,r){return[new Le(t,t*1.08,e,12).translate(i[0],i[1],i[2]),new qe(n,e*.42,.18).translate(i[0],i[1]+.02,i[2]-t*.6),new qe(.15,e*.55,r).rotateX(.35).translate(i[0],i[1]-.05,i[2]-t-r*.42)]}function fh(i){const t=[],e=[1.05,1.42,1.64,1.76,1.8,1.74,1.6],n=[.95,1.06,1.12,1.14,1.12,1.06,.96],r=[.32,.48,.62,.72,.8,.85,.85];for(let s=0;s<7;s++){const a=14.55-s*.4,o=e[s],c=.98,l=n[s],h=s>=5,u=[[.26,a+.04,-.78]],d=h?.74*Math.PI:Math.PI-Math.asin(Math.min(.9,.42/o));for(let f=0;f<=7;f++){const m=.14*Math.PI+f/7*(d-.14*Math.PI),x=-Math.cos(m)*(m<Math.PI/2?c:l),g=a-r[s]*Math.pow((m-.14*Math.PI)/(.86*Math.PI),1.3);u.push([o*Math.sin(m),g,x])}if(h){const f=u[u.length-1];u.push([.62,f[1]+.25+(s-5)*.2,1.02],[.26,12.62,1.06])}else u.push([.24,u[u.length-1][1]+.04,l*.98]);t.push(...ec(u.map(f=>[f[0]*i,f[1],f[2]]),s===0?.13:.12,28,7))}return t}function y_(i,t){const e=Iu(i,[i[0]+t[0],i[1]+t[1],i[2]+t[2]]),n=1.35,r=(u,d,f)=>{const m=new O(u*n,d*n,f*n).applyMatrix4(e);return[m.x,m.y,m.z]},s=[];for(const[u,d,f]of[[0,.1,.16],[0,.1,-.02],[0,.1,-.2],[.02,.3,.2],[.02,.3,0],[.02,.3,-.18]])s.push(Me(r(u,d,f),.14,[1,1,1],8));const a=[[.21,1],[.07,1.08],[-.07,1],[-.2,.82]];for(const[u,d]of a){const f=r(.02,.4,u*.85),m=r(0,.4+.55*d,u),x=r(-.07,.4+.92*d,u*1.05),g=r(-.17,.4+1.15*d,u*1.08),p=r(-.28,.4+1.3*d,u*1.08);s.push(Gn(f,m,.1,.075,.105),Gn(m,x,.1,.07,.095),Gn(x,g,.09,.065,.085),Gn(g,p,.08,.06,.065))}const o=r(0,.25,.26),c=r(-.05,.6,.48),l=r(-.1,.88,.58),h=r(-.16,1.08,.62);return s.push(Gn(o,c,.11,.085,.1),Gn(c,l,.1,.075,.09),Gn(l,h,.09,.065,.065)),s}function b_(){const i=[];i.push(Me([1.2,.88,0],.27)),i.push(Me([1.24,.44,-.3],1,[.27,.32,.44]));for(const[s,a,o]of[[.98,.62,.36],[1.22,.62,.34],[1.46,.55,.22],[1.08,.55,.6],[1.32,.52,.56]])i.push(Me([s,a,o],.17,[1,1,1],8));const t=[.95,1.12,1.28,1.42,1.55],e=[.84,1.08,1.3,1.5,1.68],n=[.1,.075,.07,.065,.065],r=[.42,.34,.3,.27,.24];for(let s=0;s<5;s++){const a=[t[s],.5,.62],o=[e[s],.22,1.38-s*.05];i.push(Gn(a,o,n[s]*1.3,n[s],n[s]*1.35));const c=[o[0]+(s===0?-.02:.02*s),.15,o[2]+r[s]];i.push(Gn(o,c,n[s]*1.05,n[s]*.8,n[s]*.85))}return i}const Nu=15656396,E_=new Gt(Nu),w_=new Gt(1905164),T_=5832490;function A_(i){const t=i.std({color:Nu,roughness:.42,metalness:0,emissive:2894368,emissiveIntensity:1}),e=i.std({color:16777215,vertexColors:!0,roughness:.42,metalness:0,emissive:2894368,emissiveIntensity:1}),n=i.std({color:1182214,roughness:.9}),r=i.std({color:0,emissive:T_,emissiveIntensity:1,roughness:1}),s=(f,m,x=t)=>{for(const g of["L","R"]){const p=new Xt(f,x);p.name=`skelly-${m}${g}`,g==="R"&&(p.scale.x=-1),i.at(p,m+g,0,0,0)}},a=(f,m,x=t,g=`skelly-${m}`)=>{const p=new Xt(f,x);return p.name=g,i.at(p,m,0,0,0),p},o=ia(v_,{min:[-1.25,15.95,-1.5],max:[1.25,18.65,1.4]},52,__,4e4);a(o,"head",e);const c=un([Me(uh,.1,[1,1.1,.7],10),Me(g_(uh),.1,[1,1.1,.7],10)]);a(c,"head",r,"skelly-embers");const l=(f,m,x,g,p)=>{const w=[];for(let y=0;y<10;y++){const M=-1.05+y/9*2.1;w.push(new _c(.075,m,2,7).scale(1,1,.75).rotateY(M).translate(x*Math.sin(M),f,p+g*Math.cos(M)))}return w};a(un(l(16.15,.17,.6,.78,.47)),"head",t,"skelly-teeth"),a(un([Me([0,15.98,.8],1,[.58,.24,.4])]),"head",n,"skelly-mouth"),a(ia(M_,{min:[-1,15.36,-.55],max:[1,16.6,1.22]},36,void 0,12e3),"jaw"),a(un(l(15.88,.15,.56,.74,.47)),"jaw",t,"skelly-lowerteeth"),a(un([0,1,2,3].flatMap(f=>no([0,15.12+f*.25,-.22],.25,.19,.72,.3))),"neck"),a(un([...[0,1,2,3,4,5].flatMap(f=>no([0,12.55+f*.4,-.82],.25,.26,.6,.28)),...fh(1),...fh(-1),Me([0,13.55,1.08],1,[.26,1.05,.12],12),Me([0,14.42,1],1,[.36,.32,.13],10),...ec([[.22,14.72,1.02],[.85,14.86,.9],[1.55,14.98,.42],[2.18,15.02,.02]],.13,20,8),...ec([[-.22,14.72,1.02],[-.85,14.86,.9],[-1.55,14.98,.42],[-2.18,15.02,.02]],.13,20,8),Me([1.25,13.95,-1],1,[.62,.85,.09],12),Me([-1.25,13.95,-1],1,[.62,.85,.09],12)]),"spine2"),a(un([0,1,2,3].flatMap(f=>no([0,10.85+f*.42,-.42],.36,.3,1.15,.45))),"spine1"),a(ia(S_,{min:[-1.75,8.72,-1.05],max:[1.75,11.2,1.05]},40,void 0,24e3),"pelvis"),s(un([Me([2.33,14.56,-.03],.36),ai([2.4,14.45,0],[2.71,12.08,-.05],.3,.2,.28),Me([2.53,11.98,-.05],.21,[1,.9,1],10),Me([2.88,11.98,-.06],.2,[1,.9,1],10)]),"arm");const h=[2.72,11.9,-.05],u=[2.85,9.45,.4],d=[u[0]-h[0],u[1]-h[1],u[2]-h[2]];s(un([Me([2.74,11.98,-.25],.21,[1,1.1,1],10),ai([2.76,11.85,-.2],[2.86,9.62,.22],.19,.13,.16,10),ai([2.66,11.72,.12],[2.86,9.62,.54],.16,.13,.21,10),...y_([u[0],u[1]-.05,u[2]],d)]),"forearm"),s(un([Me([1.12,9.62,.02],.36),ai([1.12,9.6,0],[1.55,9.24,-.03],.2,.18,.2,10),Me([1.64,9.3,-.08],.3,[1,1.2,1]),ai([1.56,9.22,0],[1.22,5.62,.18],.28,.21,.34),Me([1,5.5,.12],.29),Me([1.42,5.5,.12],.29)]),"thigh"),s(un([ai([1.19,5.12,.18],[1.16,1.28,-.08],.36,.18,.24),Me([1,1.16,-.05],.17,[1,1.2,1],10),ai([1.52,4.95,.02],[1.47,1.3,-.16],.16,.09,.17,10),Me([1.2,5.36,.62],.27,[1,1.1,.55])]),"shin"),s(un(b_()),"foot")}const dh=new WeakMap,R_={id:"skeleton",name:"Skelly",blurb:"Bones, a grin, and green embers for eyes",segs:p_,dress:A_,fit:{size:1.04,limb:.3},tick(i,t){let e=dh.get(i);if(!e){const r=[];i.traverse(s=>{s.name==="skelly-embers"&&r.push(s.material)}),e={jaw:i.getObjectByName("jaw")??null,embers:r},dh.set(i,e)}const n=.95+.3*Math.sin(t*2.1)+.1*Math.sin(t*7.3+1.1);for(const r of e.embers)r.emissiveIntensity=n;if(e.jaw){const r=t%4.6;e.jaw.rotation.x=r<.75?.05+.07*Math.abs(Math.sin(r*25)):.02}}},C_=[{name:"pelvis",a:[0,9.6,0],b:[0,10.6,0],parent:null},{name:"spine1",a:[0,10.6,0],b:[0,12.4,.1],parent:"pelvis"},{name:"spine2",a:[0,12.4,.1],b:[0,15,.1],parent:"spine1"},{name:"neck",a:[0,15,.1],b:[0,15.9,.15],parent:"spine2",reach:.8},{name:"head",a:[0,15.9,.15],b:[0,18.4,.3],parent:"neck"},{name:"jaw",a:[0,16.4,.9],b:[0,16.4,1.2],parent:"head",reach:0},{name:"tail1",a:[0,14.8,-1.2],b:[0,12.6,-1.4],parent:"spine2",reach:0},{name:"tail2",a:[0,12.6,-1.4],b:[0,10.4,-1.6],parent:"tail1",reach:0},{name:"tail3",a:[0,10.4,-1.6],b:[0,8.2,-1.8],parent:"tail2",reach:0},{name:"tail4",a:[0,8.2,-1.8],b:[0,6.2,-2],parent:"tail3",reach:0},{name:"thighL",a:[1.1,9.6,0],b:[1.2,5.3,.2],parent:"pelvis"},{name:"shinL",a:[1.2,5.3,.2],b:[1.2,1.1,-.1],parent:"thighL"},{name:"footL",a:[1.2,1.1,-.1],b:[1.2,.35,1.4],parent:"shinL"},{name:"thighR",a:[-1.1,9.6,0],b:[-1.2,5.3,.2],parent:"pelvis"},{name:"shinR",a:[-1.2,5.3,.2],b:[-1.2,1.1,-.1],parent:"thighR"},{name:"footR",a:[-1.2,1.1,-.1],b:[-1.2,.35,1.4],parent:"shinR"},{name:"armL",a:[2.5,14.55,0],b:[2.95,11.95,-.05],parent:"spine2"},{name:"forearmL",a:[2.95,11.95,-.05],b:[3.12,9.6,.35],parent:"armL"},{name:"armR",a:[-2.5,14.55,0],b:[-2.95,11.95,-.05],parent:"spine2"},{name:"forearmR",a:[-2.95,11.95,-.05],b:[-3.12,9.6,.35],parent:"armR"}],L_={min:[-4.2,-.5,-1.9],max:[4.2,17.1,2.3]},P_=[3.12,9.6,.35],Fu=(i,t,e)=>bt(i,t,e,3.05,10.55,.2,3.16,9,.45,.3,.3);function wc(i,t,e){const n=Math.abs(i);let r=4;if(t>8.4&&(r=Bt(i,t,e,0,13,.05,1.74,2.15,1.2),r=ct(r,Bt(i,t,e,0,11.35,.15,1.62,1.1,1.12),.5),t>13.2&&(r=ct(r,bt(n,t,e,0,15,-.05,2.15,14.62,0,.5,.56),.5),r=ct(r,Math.hypot(Math.hypot(i,(e+.02)*1.15)-.78,t-15.18)-.2,.12),r=ct(r,bt(i,t,e,0,14.9,.05,0,16.4,.15,.62,.55),.2)),t<11.6&&(r=ct(r,Bt(i,t,e,0,10.05,0,1.78,1.05,1.15),.4))),t<10.9&&(r=ct(r,bt(n,t,e,1.08,9.6,0,1.2,5.3,.15,.88,.74),.35),t<6.4&&(r=ct(r,bt(n,t,e,1.2,5.3,.15,1.22,2.1,-.05,.74,.7),.25))),n>1.5&&t>8.8){const s=bt(n,t,e,2.5,14.55,0,2.95,11.95,-.05,.6,.55);r=t>14?ct(r,s,.3):Math.min(r,s),t<12.9&&(r=ct(r,bt(n,t,e,2.95,11.95,-.05,3.08,10,.28,.55,.52),.25),r=Math.max(r,-Fu(n,t,e)))}if(t<3.4){const s=ct(bt(n,t,e,1.22,2.3,-.05,1.22,.6,-.05,.5,.52),Math.max(Bt(n,t,e,1.22,.5,.55,.58,.5,1.3),-t),.3);r=Math.min(r,s)}return r}const nc=0,Ou=1,D_=2,Bu=3,I_=4;function ku(i,t,e){const n=Math.abs(i);return Fu(n,t,e)<.06?I_:t<2.25&&n>.4?D_:t>15.38&&n<.8?Bu:n>2.1&&t>9.2||t>10.72?nc:Ou}const U_=`
  varying vec3 vCloth; varying vec3 vBind; varying vec3 vBindN;
  float band(float q, float c, float w) { return 1.0 - smoothstep(w - 0.015, w + 0.015, abs(q - c)); }
  vec3 check(vec2 p, vec3 base, vec3 line) {
    vec2 q = fract(p / 1.3);
    float du = band(q.x, 0.5, 0.18), dv = band(q.y, 0.5, 0.18);
    float lu = band(q.x, 0.06, 0.028), lv = band(q.y, 0.06, 0.028);
    vec3 c = base * (1.0 - 0.66 * du) * (1.0 - 0.66 * dv);
    c = mix(c, line, 0.7 * max(lu, lv) * (1.0 - 0.6 * max(du, dv)));
    return c * (0.9 + 0.1 * sin((p.x + p.y) * 64.0));
  }
  vec3 tri(vec3 p, vec3 n, vec3 base, vec3 line) {
    vec3 w = n * n; w *= w; w /= (w.x + w.y + w.z + 1e-4);
    return check(p.zy, base, line) * w.x + check(p.xy, base, line) * w.z + check(p.xz, base, line) * w.y;
  }
  float box2(vec2 p, vec2 c, vec2 h) { vec2 d = abs(p - c) - h; return length(max(d, 0.0)) + min(max(d.x, d.y), 0.0); }
  // a sewn-on patch: inside it its own cloth, round its edge a dashed cream stitch
  vec3 sewOn(vec3 c, vec2 p, vec2 at, vec2 h, vec3 cloth, float face) {
    float b = box2(p, at, h);
    c = mix(c, cloth, (1.0 - smoothstep(-0.01, 0.01, b)) * face);
    float st = (1.0 - smoothstep(0.012, 0.03, abs(b + 0.07))) * step(0.45, fract((p.x + p.y) * 4.5));
    return mix(c, vec3(0.75, 0.62, 0.38), st * face);
  }
  vec3 burlap(vec2 p) { return vec3(0.36, 0.25, 0.11) * (0.8 + 0.2 * abs(sin(p.x * 70.0)) * abs(sin(p.y * 70.0))); }
  vec3 denim(vec3 p, vec3 n) {
    vec3 c = vec3(0.04, 0.075, 0.19) * (0.86 + 0.14 * sin((p.x + p.y + p.z) * 75.0));
    c *= 1.0 + 0.6 * smoothstep(0.4, 1.0, n.z) * smoothstep(3.0, 8.5, p.y) * (1.0 - smoothstep(8.5, 9.6, p.y)); // worn pale over the thighs
    float front = smoothstep(0.25, 0.5, n.z), back = smoothstep(0.25, 0.5, -n.z);
    c = sewOn(c, p.xy, vec2(1.22, 5.55), vec2(0.42, 0.4), burlap(p.xy), front);
    c = sewOn(c, p.xy, vec2(-1.08, 7.85), vec2(0.36, 0.42), check(p.xy * 1.4, vec3(0.05, 0.16, 0.05), vec3(0.6, 0.5, 0.2)), front);
    c = sewOn(c, p.xy, vec2(0.75, 9.55), vec2(0.42, 0.36), burlap(p.xy * 1.2), back);
    return c;
  }
  vec3 cloth(vec3 base, vec3 p, vec3 n, vec3 k) {
    vec3 f = tri(p, n, vec3(0.42, 0.028, 0.02), vec3(0.78, 0.6, 0.26));
    // the button placket down the shirt front
    f *= 1.0 - 0.5 * (1.0 - smoothstep(0.03, 0.05, abs(p.x - 0.13))) * smoothstep(0.3, 0.6, n.z) * step(10.9, p.y);
    vec3 sack = burlap(vec2(atan(p.z, p.x) * 0.7, p.y)) * 1.3;
    return base * clamp(1.0 - k.x - k.y - k.z, 0.0, 1.0) + f * k.x + denim(p, n) * k.y + sack * k.z;
  }`;function N_(){const i=new li({vertexColors:!0,roughness:.88,metalness:0});return i.onBeforeCompile=t=>{t.vertexShader=t.vertexShader.replace("#include <common>",`#include <common>
 attribute vec3 aCloth; varying vec3 vCloth; varying vec3 vBind; varying vec3 vBindN;`).replace("#include <begin_vertex>",`#include <begin_vertex>
 vBind = position; vBindN = normal; vCloth = aCloth;`),t.fragmentShader=t.fragmentShader.replace("#include <common>",`#include <common>
`+U_).replace("#include <color_fragment>",`#include <color_fragment>
 diffuseColor.rgb = cloth(diffuseColor.rgb, vBind, normalize(vBindN), vCloth);`)},i.customProgramCacheKey=()=>"jack-cloth-v2",i}const Ce=[0,17.15,.22],F_=1.82,Xn=1.38,zu=.24;function Tc(i,t,e){const n=i-Ce[0],r=t-Ce[1],s=e-Ce[2],a=Math.hypot(n,s),o=Math.atan2(s,n),c=1-Math.sqrt(Math.abs(Math.cos(5*(o-Math.PI/2)))),l=1-.06*c;let h=(Math.hypot(a/l/F_,r/Xn)-1)*Xn;return h+=.32*Math.exp(-((a/.6)**2))*Math.min(1,Math.abs(r)/Xn),{d:h,groove:c}}function ph(i,t,e,n,r,s,a=0){const o=(n+r)/2,c=Math.cos(a),l=Math.sin(a),h=(i-e)*c-(t-o)*l,u=(i-e)*l+(t-o)*c+o,d=n-r,f=Math.hypot(d,s);return Math.max((Math.abs(h)*d+(u-n)*s)/f,r-u)}const mh=(i,t,e,n,r,s)=>(Math.hypot((i-e)/r,(t-n)/s)-1)*Math.min(r,s),gh=(i,t,e,n,r,s)=>{const a=Math.abs(i-e)-r,o=Math.abs(t-n)-s;return Math.hypot(Math.max(a,0),Math.max(o,0))+Math.min(Math.max(a,o),0)};function O_(i,t){const e=Math.abs(i);let n=ph(e,t,.66,.74,.14,.36,-.12);n=Math.min(n,ph(i,t,0,.1,-.2,.17));let r=Math.max(mh(i,t,0,-.36,1.2,.64),-mh(i,t,0,-.08,1.34,.56));return r=Math.max(r,-gh(e,t,.32,-.7,.11,.12)),r=Math.max(r,-gh(i,t,0,-.93,.12,.13)),Math.min(n,r)}function B_(i,t,e){const n=Tc(i,t,e).d;let r=Math.max(n,-(n+zu));const s=Math.max(O_(i-Ce[0],t-Ce[1]),Ce[2]+.4-e);return r=Math.max(r,-s),r}const k_=new Gt(15759890),z_=new Gt(11027978),H_=new Gt(8008712);function V_(i,t,e,n){const{d:r,groove:s}=Tc(i,t,e);if(r<-.07){n.copy(H_);return}n.copy(k_).lerp(z_,Math.min(1,s*1.3)),n.multiplyScalar(.85+.15*(1-Math.abs(t-Ce[1])/Xn))}function G_(i){const t=i.std({color:16777215,vertexColors:!0,roughness:.5,metalness:0,emissive:16745496,emissiveIntensity:1.8});return t.onBeforeCompile=e=>{e.vertexShader=e.vertexShader.replace("#include <common>",`#include <common>
 attribute float aGlow; varying float vGlow;`).replace("#include <begin_vertex>",`#include <begin_vertex>
 vGlow = aGlow;`),e.fragmentShader=e.fragmentShader.replace("#include <common>",`#include <common>
 varying float vGlow;`).replace("#include <emissivemap_fragment>",`#include <emissivemap_fragment>
 totalEmissiveRadiance *= vGlow;`)},t.customProgramCacheKey=()=>"jack-shell-v1",t}let ra=1;const $e=()=>(ra=ra*1664525+1013904223>>>0,ra/4294967296),W_=new O(0,1,0),vh=[15255146,13937738,15916172,12884540].map(i=>new Gt(i));function zr(i,t,e,n){const r=new Cr(n,e,4,1).translate(0,e/2,0);r.applyQuaternion(new ke().setFromUnitVectors(W_,t.clone().normalize())).translate(i.x,i.y,i.z);const s=vh[Math.floor($e()*vh.length)],a=r.attributes.position.count,o=new Float32Array(a*3);for(let c=0;c<a;c++)o[c*3]=s.r,o[c*3+1]=s.g,o[c*3+2]=s.b;return r.setAttribute("color",new oe(o,3)),r}function Hr(i,t){const e=i.clone().normalize(),n=Math.abs(e.y)<.9?new O(0,1,0):new O(1,0,0),r=new O().crossVectors(e,n).normalize(),s=new O().crossVectors(e,r),a=$e()*Math.PI*2,o=Math.tan(t*Math.sqrt($e()));return e.addScaledVector(r,Math.cos(a)*o).addScaledVector(s,Math.sin(a)*o).normalize()}function Hn(i){const t=Ec(i.map(e=>e.index?e.toNonIndexed():e),!1);for(const e of i)e.dispose();return t}function io(i,t){let e=0,n=3;for(let r=0;r<30;r++){const s=(e+n)/2;wc(i,t,s)<0?e=s:n=s}return e}function _h(i,t,e){let n=0,r=3;for(let s=0;s<26;s++){const a=(n+r)/2;wc(Math.cos(t)*a,i,e+Math.sin(t)*a)<0?n=a:r=a}return n}function Ys(i,t,e,n){const r=Math.max(8,Math.round(t*18)),s=new Lr(i,r,e,7,n),a=s.attributes.uv,o=a.count,c=new Float32Array(o*3),l=new Gt(13150312),h=new Gt(9071160),u=new Gt;for(let d=0;d<o;d++){const f=.5+.5*Math.sin((a.getX(d)*t*4.5+a.getY(d))*Math.PI*2);u.copy(l).lerp(h,f*f),c[d*3]=u.r,c[d*3+1]=u.g,c[d*3+2]=u.b}return s.setAttribute("color",new oe(c,3)),s}function X_(i){ra=7;const t=i.bones.get("pelvis").parent,e=t.geometry.attributes.position,n=new Float32Array(e.count*3);for(let F=0;F<e.count;F++){const k=ku(e.getX(F),e.getY(F),e.getZ(F));n[F*3]=k===nc?1:0,n[F*3+1]=k===Ou?1:0,n[F*3+2]=k===Bu?1:0}t.geometry.setAttribute("aCloth",new oe(n,3)),t.material.dispose(),t.material=N_();const r=i.std({color:16777215,vertexColors:!0,roughness:.75,metalness:0}),s=i.std({color:16777215,vertexColors:!0,roughness:.9,metalness:0}),a=(F,k,B,K)=>{for(const j of["L","R"]){const P=new Xt(F,B);P.name=`jack-${K}${j}`,j==="R"&&(P.scale.x=-1),i.at(P,k+j,0,0,0)}},o=ia(B_,{min:[-1.92,Ce[1]-Xn-.05,Ce[2]-1.92],max:[1.92,Ce[1]+Xn+.05,Ce[2]+1.92]},48,V_,4e4),c=o.attributes.position,l=new Float32Array(c.count);for(let F=0;F<c.count;F++)l[F]=Math.max(0,Math.min(1,-Tc(c.getX(F),c.getY(F),c.getZ(F)).d/.16));o.setAttribute("aGlow",new oe(l,1));const h=new Xt(o,G_(i));h.name="jack-pumpkin",i.at(h,"head",0,0,0);const u=Ce[1]-Xn+zu+.12,d=new Xt(new Le(.2,.22,.4,10).translate(0,u+.2,Ce[2]),i.std({color:15918792,roughness:.6,emissive:16756816,emissiveIntensity:.25}));i.at(d,"head",0,0,0);const f=new Je;f.name="jack-flame";const m=new Xt(Hn([new Ue(.15,10,8).scale(1,1.1,1).translate(0,.15,0),new Cr(.148,.42,10,1,!0).translate(0,.36,0)]),i.std({color:0,emissive:16762976,emissiveIntensity:2.4}));m.name="jack-flamecore",f.add(m),i.at(f,"head",0,u+.42,Ce[2]);const x=Ce[1]+Xn-.22,g=new Le(.16,.26,1.5,7,8).translate(0,.75,0);{const F=g.attributes.position;for(let k=0;k<F.count;k++){const B=F.getY(k)/1.5,K=1+.6*Math.max(0,1-B*5);F.setXYZ(k,F.getX(k)*K+.5*B*B,F.getY(k),F.getZ(k)*K-.1*B*B)}g.computeVertexNormals()}i.at(new Xt(g.translate(0,x,Ce[2]-.05),i.std({color:5990956,roughness:.85})),"head",0,0,0);const p=i.std({color:4863526,roughness:.95,side:Sn}),w=[];for(let F=0;F<=10;F++){const k=1.08+F/10*1.12;w.push(new St(k,-.22*((k-1.08)/1.12)**2))}const y=[];for(let F=0;F<=10;F++){const k=F/10;y.push(new St(1.1-.24*k-(k>.85?(k-.85)*3.6:0),k*1.2))}const M=Hn([new os(w,28),new os(y,28)]);{const F=M.attributes.position;for(let k=0;k<F.count;k++){const B=F.getX(k),K=F.getY(k),j=F.getZ(k),P=K>.7?.2*Math.exp(-((B/.5)**2))*Math.max(0,j):0;F.setXYZ(k,B,K-.07*Math.max(0,B)*Math.max(0,Math.hypot(B,j)-1.08)-P*.6,j-P)}M.computeVertexNormals()}const T=new Ui(1.07,.08,6,28).rotateX(Math.PI/2).scale(1,2.4,1).translate(0,.2,0),E=new Je;E.add(new Xt(M,p),new Xt(T,i.std({color:1971986,roughness:.8}))),E.rotation.set(-.16,0,-.2),i.at(E,"head",.08,Ce[1]+Xn-.36,Ce[2]-.12);const A=[];for(let F=0;F<34;F++){const k=F/34*Math.PI*2+$e()*.15,B=.72,K=new O(Math.cos(k)*B,15.3+$e()*.1,Math.sin(k)*B*.9),j=Hr(new O(Math.cos(k)*.9,.7,Math.sin(k)*.9),.35);A.push(zr(K,j,.45+$e()*.5,.05))}const C=new Xt(Hn(A),r);C.name="jack-collar",i.at(C,"spine2",0,0,0);const v=new O(2.95,11.95,-.05),_=new O(...P_),S=_.clone().sub(v).normalize(),b=[];for(let F=0;F<46;F++){const k=$e()*Math.PI*2,B=.26*Math.sqrt($e()),K=new O(Math.cos(k)*B,0,Math.sin(k)*B),j=_.clone().addScaledVector(S,.55).add(K);b.push(zr(j,Hr(S.clone().addScaledVector(K,1.4),.3),.8+$e()*.9,.055))}a(Hn(b),"forearm",r,"hand");const D=[];for(let F=0;F<26;F++){const k=F/26*Math.PI*2+$e()*.2,B=new O(1.22+Math.cos(k)*.62,2.2+$e()*.12,-.05+Math.sin(k)*.62);D.push(zr(B,Hr(new O(Math.cos(k),-1.1,Math.sin(k)),.3),.4+$e()*.45,.05))}a(Hn(D),"shin",r,"ankle");const U=[];for(let F=0;F<14;F++){const k=F/14*Math.PI*2,B=_h(15.62,k,.1)+.04;U.push(new O(Math.cos(k)*B,15.62,.1+Math.sin(k)*B))}i.at(new Xt(Ys(new ci(U,!0),3.6,.09,!0),s),"neck",0,0,0);const N=10.72,H=[];for(let F=0;F<24;F++){const k=F/24*Math.PI*2,B=_h(N,k,.05)+.06;H.push(new O(Math.cos(k)*B,N,.05+Math.sin(k)*B))}const Z=new ci(H,!0),V=.55,rt=io(V,N)+.1,ht=new ci([new O(V,N-.05,rt),new O(V+.12,N-.6,rt+.12),new O(V+.05,N-1.25,rt+.08)]),dt=new ci([new O(V,N-.05,rt),new O(V-.12,N-.5,rt+.14),new O(V-.02,N-1,rt+.1)]),mt=[];for(const F of[ht,dt]){const k=F.getPoint(1);for(let B=0;B<7;B++)mt.push(zr(k,Hr(new O(0,-1,.1),.35),.22+$e()*.2,.035))}const Et=new Ue(.22,10,8).scale(1.2,.9,.8).translate(V,N,rt),Ft=new Float32Array(Et.attributes.position.count*3),zt=new Gt(11571288);for(let F=0;F<Ft.length;F+=3)Ft[F]=zt.r,Ft[F+1]=zt.g,Ft[F+2]=zt.b;Et.setAttribute("color",new oe(Ft,3)),i.at(new Xt(Hn([Ys(Z,11,.13,!0),Ys(ht,1.3,.1,!1),Ys(dt,1,.1,!1),Et]),s),"pelvis",0,0,0),i.at(new Xt(Hn(mt),r),"pelvis",0,0,0);const et=[],lt=[];for(const F of[14.25,13.45,12.65]){const k=io(.13,F);et.push(new Le(.12,.12,.07,10).rotateX(Math.PI/2).translate(.13,F,k+.02))}for(let F=0;F<5;F++)lt.push(zr(new O(.13,13.05,io(.13,13.05)-.05),Hr(new O(.4,.3,1),.4),.35+$e()*.25,.035));i.at(new Xt(Hn(et),i.std({color:2759698,roughness:.5})),"spine2",0,0,0),i.at(new Xt(Hn(lt),r),"spine2",0,0,0)}const q_=(i,t,e,n)=>i.name.startsWith("thigh")?n>-1.6&&e<i.a[1]+.8&&Math.abs(Math.abs(t)-Math.abs(i.a[0]))<(e<i.a[1]+.3?1.3:.9):i.name.startsWith("arm")||i.name.startsWith("forearm")?Math.abs(t)>2.1:!0,xh=new WeakMap,Y_={id:"pumpkin",name:"Jack",blurb:"A scarecrow with a candle-lit pumpkin head",segs:C_,body:{sdf:wc,region:ku,box:L_,palette:[9181716,2307418,3810326,11044954,1708556],surface:"soft",weights:"sharp",capture:q_},dress:X_,fit:{size:1.08,limb:.6},res:76,tick(i,t){let e=xh.get(i);if(!e){const a=[],o=[];i.traverse(c=>{c.name==="jack-pumpkin"&&a.push(c.material),c.name==="jack-flamecore"&&o.push(c.material)}),e={shell:a,core:o,flame:i.getObjectByName("jack-flame")??null},xh.set(i,e)}const n=.5*Math.sin(t*1.7)+.3*Math.sin(t*7.9+1.3)+.22*Math.sin(t*13.3+.4)+.15*Math.sin(t*23.7+2.2),r=Math.max(0,Math.sin(t*.83+.5)-.92)*6,s=Math.max(.35,1+.28*n-r);for(const a of e.shell)a.emissiveIntensity=1.8*s;for(const a of e.core)a.emissiveIntensity=2.4*s;e.flame&&(e.flame.scale.set(1-.08*n,s*(1+.12*Math.sin(t*17)),1-.08*n),e.flame.rotation.z=.12*Math.sin(t*5.3))}},Hu=[{name:"pelvis",a:[0,9.6,0],b:[0,10.6,0],parent:null},{name:"spine1",a:[0,10.6,0],b:[0,12.4,.1],parent:"pelvis"},{name:"spine2",a:[0,12.4,.1],b:[0,15,.1],parent:"spine1"},{name:"neck",a:[0,15,.1],b:[0,15.9,.15],parent:"spine2",reach:.8},{name:"head",a:[0,15.9,.15],b:[0,18.4,.3],parent:"neck"},{name:"jaw",a:[0,16.4,.9],b:[0,16.4,1.2],parent:"head",reach:0},{name:"tail1",a:[0,14.8,-1.2],b:[0,12.6,-1.4],parent:"spine2",reach:1},{name:"tail2",a:[0,12.6,-1.4],b:[0,10.4,-1.6],parent:"tail1",reach:1},{name:"tail3",a:[0,10.4,-1.6],b:[0,8.2,-1.8],parent:"tail2",reach:1},{name:"tail4",a:[0,8.2,-1.8],b:[0,6.2,-2],parent:"tail3",reach:1},{name:"thighL",a:[1.1,9.6,0],b:[1.2,5.3,.2],parent:"pelvis"},{name:"shinL",a:[1.2,5.3,.2],b:[1.2,1.1,-.1],parent:"thighL"},{name:"footL",a:[1.2,1.1,-.1],b:[1.2,.35,1.4],parent:"shinL"},{name:"thighR",a:[-1.1,9.6,0],b:[-1.2,5.3,.2],parent:"pelvis"},{name:"shinR",a:[-1.2,5.3,.2],b:[-1.2,1.1,-.1],parent:"thighR"},{name:"footR",a:[-1.2,1.1,-.1],b:[-1.2,.35,1.4],parent:"shinR"},{name:"armL",a:[2.4,14.6,0],b:[2.72,11.9,-.05],parent:"spine2"},{name:"forearmL",a:[2.72,11.9,-.05],b:[2.85,9.45,.4],parent:"armL"},{name:"armR",a:[-2.4,14.6,0],b:[-2.72,11.9,-.05],parent:"spine2"},{name:"forearmR",a:[-2.72,11.9,-.05],b:[-2.85,9.45,.4],parent:"armR"}],Vu={min:[-4.2,-.4,-2.8],max:[4.2,20.4,2.6]};function $_(i,t,e,n){const r=Math.abs(i),s=1-.08*n;let a=Bt(i,t,e,0,13.35,.1,1.8*s,1.95,1.05*s);return a=ct(a,Bt(r,t,e,.85*s,13.75,.75,.95*s,.68,.5),.45),a=ct(a,Bt(i,t,e,0,13.75,-.35,1.95*s,1.3,.62),.4),a=ct(a,bt(r,t,e,0,15.35,-.2,1.85*s,14.95,-.1,.5,.36),.5),a=ct(a,Bt(i,t,e,0,11.6,.12,1.35*s,1.45,.92*s),.6),a=ct(a,Bt(i,t,e,0,10,0,1.68*s,1,1.02*s),.6),a=ct(a,Bt(r,t,e,.72,9.55,-.5,.82*s,.85,.62),.4),a=Math.max(a,-bt(i,t,e,0,14.6,-1.12,0,10.6,-.98,.16,.14)),a=ct(a,bt(i,t,e,0,14.9,-.05,0,16.3,.12,.6,.52),.4),a=ct(a,Bt(i,t,e,0,17.3,.1,.95,1.12,1.08),.3),a=ct(a,Bt(i,t,e,0,16.55,.4,.74,.74,.82),.35),a=ct(a,Bt(r,t,e,2.3*s,14.5,0,.7*s,.92,.78),.4),a=ct(a,bt(r,t,e,2.4,14.4,0,2.72,11.95,-.05,.56*s,.42*s),.3),a=ct(a,Bt(r,t,e,2.56,13.15,.12,.5*s,.95,.5*s),.3),a=ct(a,bt(r,t,e,2.72,11.9,-.05,2.85,9.6,.38,.46*s,.3*s),.25),a=ct(a,Bt(r,t,e,2.76,11.2,.05,.48*s,.8,.48*s),.3),a=ct(a,Bt(r,t,e,2.87,9,.48,.24,.52,.42),.2),a=ct(a,bt(r,t,e,2.8,9.35,.75,2.72,8.85,.95,.15,.12),.12),a=ct(a,bt(r,t,e,1.02,9.6,0,1.15,5.45,.2,.9*s,.56*s),.45),a=ct(a,Bt(r,t,e,1.12,7.7,.28,.8*s,1.6,.72*s),.4),a=ct(a,Bt(r,t,e,.8,8.3,0,.55*s,1.3,.6),.4),a=ct(a,we(r,t,e,1.17,5.3,.32,.52*s),.3),a=ct(a,bt(r,t,e,1.18,5.25,.15,1.2,1.15,-.1,.5*s,.3*s),.3),a=ct(a,Bt(r,t,e,1.2,3.95,-.28,.56*s,1.3,.6*s),.35),a=ct(a,Math.max(Bt(r,t,e,1.2,.5,.55,.46,.5,1.25),-t),.25),a}function Gu(i,t,e,n,r=0){const s=Math.abs(i);let a=$_(i,t,e,n==="valkyrie"?1:0);if(n==="valkyrie"){a=ct(a,Bt(i,t,e,0,13.6,.55,2.2,1.5,1),.4);{const o=Math.max(0,Math.min(1,(10.8-t)/3.4)),c=1.6+.75*o,l=Math.hypot(i/1.05,e/.8)-c;a=Math.min(a,Math.max(l,Math.abs(t-9.1)-1.7,-(Math.hypot(i/1.05,e/.8)-c+.32)))}a=ct(a,we(s,t,e,2.38,14.9,0,1),.3),a=ct(a,bt(s,t,e,1.2,4.6,.35,1.2,1.4,.2,.75,.62),.2),a=ct(a,we(i,t,e,0,17,.25,1.32),.3),a=ct(a,Bt(i,t,e,0,17.4,.2,1.42,1,1.42),.2);for(let o=0;o<3;o++)a=ct(a,bt(s,t,e,1.3,17.6+o*.25,.2-o*.35,2.3+o*.25,19+o*.35,-1-o*.5,.32-o*.06,.1),.2);a=ct(a,bt(i,t,e,0,16.6,-1.1,0,12.6,-1.5,.42,.26),.3);{const o=2.3+(14.8-t)*.12;a=Math.min(a,Math.max(Math.abs(i)-o,Math.abs(e+1.75+(14.8-t)*.03)-.2,t-14.8,4.6-t)-.08)}}else a=ct(a,Bt(i,t,e,0,17.3,.12,1.08,1.24,1.18),.25),a=ct(a,Bt(i,t,e,0,16.5,.45,.82,.72,.86),.25),a=ct(a,bt(i,t,e,0,18.42,-.7,0,18.5,.85,.16,.12),.2),a=ct(a,Bt(i,t,e,0,10.55,.05,1.55,.38,1.1),.15),a=ct(a,Bt(i,t,e,0,10.55,1.05,.55,.42,.22),.1),a=ct(a,bt(s,t,e,2.82,10.25,.3,2.86,9.5,.42,.4,.38),.15),a=ct(a,bt(s,t,e,1.2,3.2,-.05,1.2,1,-.08,.52,.48),.2);return a-r}function Wu(i,t,e,n){const r=Math.abs(i);if(n==="valkyrie")return t>17.6&&r>1.2||e<-.9&&t>12.4&&t<16.8&&r<.6?2:t>15.9&&t<17.2&&e>.6&&r<1?3:t>16.9&&t<17.3&&e>.6||Math.abs(t-10.85)<.25||t<7.6&&t>7.3||t>13.5&&t<14&&e>.8||r>2&&Math.abs(t-14.9)<.35?1:0;if(t>16.75&&t<17.5&&e>.9&&r<.95)return 2;if(Math.abs(t-10.6)<.45&&e>-1.5)return 3;if(t<3.2||t<10.4&&r>2.3&&t>8.2)return 1;if(e>.7&&r<1.7){const s=t-12.6-r*.55;if(s>0&&s<.35||s>.75&&s<1.1)return 1}return 0}const Z_=[{name:"pelvis",a:[0,9.4,-.6],b:[0,10.4,0],parent:null},{name:"spine1",a:[0,10.4,0],b:[0,12.6,.8],parent:"pelvis"},{name:"spine2",a:[0,12.6,.8],b:[0,14.8,1.9],parent:"spine1"},{name:"neck",a:[0,14.8,1.9],b:[0,16,3],parent:"spine2",reach:1.6},{name:"head",a:[0,16,3],b:[0,16.6,5.8],parent:"neck"},{name:"jaw",a:[0,15.5,3.9],b:[0,15.3,6.6],parent:"head",reach:.8},{name:"tail1",a:[0,9.2,-1.6],b:[0,8.2,-3.6],parent:"pelvis",reach:1.8},{name:"tail2",a:[0,8.2,-3.6],b:[0,6.8,-5.2],parent:"tail1",reach:1.8},{name:"tail3",a:[0,6.8,-5.2],b:[0,5.3,-6.4],parent:"tail2",reach:1.6},{name:"tail4",a:[0,5.3,-6.4],b:[0,4,-7.2],parent:"tail3",reach:1.4},{name:"thighL",a:[1.6,9.2,-.3],b:[1.9,6,1.3],parent:"pelvis"},{name:"shinL",a:[1.9,6,1.3],b:[1.9,2.8,-.9],parent:"thighL"},{name:"footL",a:[1.9,2.8,-.9],b:[1.9,.4,1],parent:"shinL"},{name:"thighR",a:[-1.6,9.2,-.3],b:[-1.9,6,1.3],parent:"pelvis"},{name:"shinR",a:[-1.9,6,1.3],b:[-1.9,2.8,-.9],parent:"thighR"},{name:"footR",a:[-1.9,2.8,-.9],b:[-1.9,.4,1],parent:"shinR"},{name:"armL",a:[2.7,14.3,1.6],b:[3.3,11.2,2],parent:"spine2"},{name:"forearmL",a:[3.3,11.2,2],b:[3.2,8.2,3.2],parent:"armL"},{name:"armR",a:[-2.7,14.3,1.6],b:[-3.3,11.2,2],parent:"spine2"},{name:"forearmR",a:[-3.3,11.2,2],b:[-3.2,8.2,3.2],parent:"armR"}],J_={min:[-5,-.5,-8.6],max:[5,20.4,8.6]},$n=[.62,17.05,4.75],Mh=[0,16.35,7.35];function K_(i,t,e,n=0){const r=Math.abs(i);let s=Bt(i,t,e,0,13.4,1.4,2.6,2.5,2.1);s=ct(s,Bt(i,t,e,0,11.2,.4,1.7,1.6,1.4),.9),s=ct(s,Bt(i,t,e,0,9.8,-.4,2,1.2,1.5),.7),s=ct(s,Bt(i,t,e,0,15.1,1.6,2.3,1.5,2),.8),s=ct(s,we(r,t,e,2.5,14.2,1.5,1.05),.7);let a=Bt(i,t,e,0,16.9,3.6,1.35,1.25,1.55);a=ct(a,bt(i,t,e,0,16.7,4.6,0,16.3,7.1,.82,.45),.5),a=ct(a,bt(i,t,e,0,15.8,4.4,0,15.75,6.7,.55,.32),.35),a=ct(a,Bt(r,t,e,1.15,16.5,3.6,.55,.75,.9),.4),a=ct(a,bt(r,t,e,.75,17.8,3.1,1.05,19.4,2.7,.5,.06),.3),a=Math.max(a,-we(r,t,e,$n[0],$n[1],$n[2]+.12,.3)),s=ct(s,a,.6),s=ct(s,bt(r,t,e,2.7,14.3,1.6,3.3,11.2,2,.9,.72),.5),s=ct(s,bt(r,t,e,3.3,11.2,2,3.2,8.4,3.1,.78,.55),.35),s=ct(s,Bt(r,t,e,3.2,7.9,3.35,.55,.75,.55),.3),s=ct(s,bt(r,t,e,1.6,9.2,-.3,1.9,6,1.3,1.25,.85),.6),s=ct(s,bt(r,t,e,1.9,6,1.3,1.9,2.8,-.9,.75,.48),.4),s=ct(s,bt(r,t,e,1.9,2.8,-.9,1.9,.5,.9,.5,.42),.3);const o=[[0,9.2,-1.6,.6],[0,8.2,-3.6,1],[0,6.8,-5.2,1.15],[0,5.3,-6.4,.9],[0,4,-7.2,.35]];for(let c=0;c+1<o.length;c++){const l=o[c],h=o[c+1];s=ct(s,bt(i,t,e,l[0],l[1],l[2],h[0],h[1],h[2],l[3],h[3]),.5)}s-=n;for(const c of[-1.5,-.5,.5,1.5])s=ct(s,bt(r,t,e,3.2+c*.17,7.4,3.5,3.2+c*.22,6.5,3.85,.17,.03),.1);for(const c of[-1,0,1])s=ct(s,bt(r,t,e,1.9+c*.28,.4,1.2,1.9+c*.34,.1,1.85,.2,.03),.1);return s}function Xu(i,t,e){const n=Math.abs(i);return Math.hypot(i,t-Mh[1],e-Mh[2])<.45||t<7.6&&t>6.2&&e>3.4&&n>2.6||t<.5&&e>1.2?3:t>17.4&&n>.6&&e<3.2||e<-6.3?2:t>15.4&&t<16.4&&e>4.4||t>14.6&&t<15.8&&e>2.8&&n<1.2||e>2.2&&t>10.2&&t<15&&n<1.8?1:t>12.4&&e<.8&&n<1.9&&t>12.4+.5*n?2:0}function j_(i,t,e){const n=Math.abs(i);return Xu(i,t,e)===3||Math.hypot(n-$n[0],t-$n[1],e-$n[2])<.65?0:e>4.6&&t>15.2?.35:t>17.6?.4:t>14&&t<16.4&&e<3.4||e<-1.4&&t<9.6?1.4:t<3?.45:1}const Q_=[{name:"pelvis",a:[0,7.6,-.4],b:[0,8.8,0],parent:null},{name:"spine1",a:[0,8.8,0],b:[0,10.8,.3],parent:"pelvis"},{name:"spine2",a:[0,10.8,.3],b:[0,12.6,.6],parent:"spine1"},{name:"neck",a:[0,12.6,.6],b:[0,15.6,1.3],parent:"spine2",reach:1.9},{name:"head",a:[0,15.6,1.3],b:[0,17.6,2.4],parent:"neck"},{name:"jaw",a:[0,15.9,2.6],b:[0,15.7,4.4],parent:"head",reach:.7},{name:"tail1",a:[0,7.4,-2.6],b:[0,6.8,-3.6],parent:"pelvis",reach:1.4},{name:"tail2",a:[0,6.8,-3.6],b:[0,6.2,-4.5],parent:"tail1",reach:1.4},{name:"tail3",a:[0,6.2,-4.5],b:[0,5.7,-5.2],parent:"tail2",reach:1.2},{name:"tail4",a:[0,5.7,-5.2],b:[0,5.3,-5.7],parent:"tail3",reach:1},{name:"thighL",a:[1.4,7.4,0],b:[1.5,4.6,.3],parent:"pelvis"},{name:"shinL",a:[1.5,4.6,.3],b:[1.5,.9,-.2],parent:"thighL"},{name:"footL",a:[1.5,.9,-.2],b:[1.5,.3,1.8],parent:"shinL"},{name:"thighR",a:[-1.4,7.4,0],b:[-1.5,4.6,.3],parent:"pelvis"},{name:"shinR",a:[-1.5,4.6,.3],b:[-1.5,.9,-.2],parent:"thighR"},{name:"footR",a:[-1.5,.9,-.2],b:[-1.5,.3,1.8],parent:"shinR"},{name:"armL",a:[2.7,11.6,.2],b:[3.3,9.2,-.1],parent:"spine2"},{name:"forearmL",a:[3.3,9.2,-.1],b:[3.2,7,.3],parent:"armL"},{name:"armR",a:[-2.7,11.6,.2],b:[-3.3,9.2,-.1],parent:"spine2"},{name:"forearmR",a:[-3.3,9.2,-.1],b:[-3.2,7,.3],parent:"armR"}],tx={min:[-5,-.4,-7.2],max:[5,21.4,6.6]},Zn=[.72,17.25,2.75];function ex(i,t,e,n=0){const r=Math.abs(i);let s=Bt(i,t,e,0,9.2,-.2,3.3,3.5,3);s=ct(s,Bt(i,t,e,0,11.4,.5,2.5,2.2,2.3),1),s=ct(s,bt(i,t,e,0,12.2,.5,0,15.8,1.4,1.25,.95),.8);let a=we(i,t,e,0,16.9,1.8,1.55);a=ct(a,bt(i,t,e,0,16.55,2.9,0,16.1,5,.72,.18),.3),a=ct(a,bt(i,t,e,0,15.85,2.8,0,15.75,4.4,.5,.14),.25);for(const[o,c]of[[0,1],[.6,.82],[-.6,.82]])a=ct(a,bt(i,t,e,o*.5,18.1,1.6,o*1.3,18.1+2.7*c,1-.7*c,.34,.12),.3);a=Math.max(a,-we(r,t,e,Zn[0],Zn[1],Zn[2],.5)),s=ct(s,a,.5),s=ct(s,Bt(r,t,e,3,9.8,0,.75,2.6,1.7),.7);for(const o of[-1,0,1])s=ct(s,bt(r,t,e,3.2,8.4,o*.6,3.25,6.6+Math.abs(o)*.4,o*.75+.2,.42,.14),.3);for(const o of[-1,0,1])s=ct(s,bt(i,t,e,o*.3,7.6,-2.6,o*1.1,7+(1-Math.abs(o))*.5,-5.6,.5,.2),.4);s=ct(s,bt(r,t,e,1.4,7.4,0,1.5,4.8,.3,1,.55),.5),s=ct(s,bt(r,t,e,1.5,4.8,.3,1.5,1,-.2,.42,.36),.25),s-=n;for(const o of[-1,0,1])s=ct(s,bt(r,t,e,1.5,.5,.1,1.5+o*.85,.3,2-Math.abs(o)*.3,.34,.16),.2);return s=ct(s,bt(r,t,e,1.5,.5,-.2,1.5,.3,-1.1,.3,.14),.15),s}function qu(i,t,e){const n=Math.abs(i);return t>15.6&&t<17.1&&e>2.6&&n<.85||t<5&&n>.9&&n<2.6||t<1?3:t>18.4||e<-4.6?2:e>1.2&&t>9.4&&t<13.4&&n<1.8||e>2.2&&t>16.2&&t<18.2&&n<1.25?1:0}function nx(i,t,e){const n=Math.abs(i),r=qu(i,t,e);return r===3||Math.hypot(n-Zn[0],t-Zn[1],e-Zn[2])<.9?0:r===2?.6:t>16?.45:t>14.6&&e>1.6?.3:t>12.2?1.25:e<-2.4?1.4:1}const Ac=[{name:"pelvis",a:[0,9.2,0],b:[0,10.4,0],parent:null},{name:"spine1",a:[0,10.4,0],b:[0,12.4,.1],parent:"pelvis"},{name:"spine2",a:[0,12.4,.1],b:[0,15.4,.2],parent:"spine1"},{name:"neck",a:[0,15.4,.2],b:[0,16.2,.3],parent:"spine2",reach:.9},{name:"head",a:[0,16.2,.3],b:[0,18.4,.6],parent:"neck"},{name:"jaw",a:[0,16.4,1.2],b:[0,16.4,1.6],parent:"head",reach:0},{name:"tail1",a:[0,9.2,-.5],b:[0,9,-1],parent:"pelvis",reach:0},{name:"tail2",a:[0,9,-1],b:[0,8.8,-1.5],parent:"tail1",reach:0},{name:"tail3",a:[0,8.8,-1.5],b:[0,8.6,-2],parent:"tail2",reach:0},{name:"tail4",a:[0,8.6,-2],b:[0,8.4,-2.5],parent:"tail3",reach:0},{name:"thighL",a:[2.1,9.2,0],b:[2.3,5.2,.3],parent:"pelvis"},{name:"shinL",a:[2.3,5.2,.3],b:[2.3,1.2,-.1],parent:"thighL"},{name:"footL",a:[2.3,1.2,-.1],b:[2.3,.4,1.8],parent:"shinL"},{name:"thighR",a:[-2.1,9.2,0],b:[-2.3,5.2,.3],parent:"pelvis"},{name:"shinR",a:[-2.3,5.2,.3],b:[-2.3,1.2,-.1],parent:"thighR"},{name:"footR",a:[-2.3,1.2,-.1],b:[-2.3,.4,1.8],parent:"shinR"},{name:"armL",a:[4.1,14.7,.2],b:[4.5,11.6,.4],parent:"spine2"},{name:"forearmL",a:[4.5,11.6,.4],b:[4.5,8.4,1],parent:"armL"},{name:"armR",a:[-4.1,14.7,.2],b:[-4.5,11.6,.4],parent:"spine2"},{name:"forearmR",a:[-4.5,11.6,.4],b:[-4.5,8.4,1],parent:"armR"}],ix={min:[-6.4,-.4,-4.4],max:[6.4,19.8,4]};function Ee(i,t,e,n,r,s,a,o,c,l){const h=Math.abs(i-n)-a+l,u=Math.abs(t-r)-o+l,d=Math.abs(e-s)-c+l;return Math.hypot(Math.max(h,0),Math.max(u,0),Math.max(d,0))+Math.min(Math.max(h,u,d),0)-l}function Sh(i,t,e,n,r,s,a,o,c){const l=Math.abs(i-n)-a+c,h=Math.hypot(t-r,e-s)-o+c;return Math.hypot(Math.max(l,0),Math.max(h,0))+Math.min(Math.max(l,h),0)-c}function Yu(i,t,e,n,r,s,a,o){let c=i-n,l=t-r,h=e-s;const u=Math.cos(a),d=Math.sin(a);[c,h]=[c*u-h*d,c*d+h*u];const f=Math.cos(o),m=Math.sin(o);return[c,l]=[c*f+l*m,-c*m+l*f],[c,l,h]}const Xe={hx:1.5,hy:14.6,hz:-2.15,yaw:.4,roll:.62,w:1.1,h:.85,t:.12};function rx(i,t,e){const[n,r,s]=Yu(i,t,e,Xe.hx,Xe.hy,Xe.hz,Xe.yaw,Xe.roll);return Ee(n,r,s,Xe.w,Xe.h,0,Xe.w,Xe.h,Xe.t,.1)}function sx(i,t,e,n=0){const r=Math.abs(i);let s=1e9;{const a=Ee(i,t,e,0,13.75,.25,2.9,1.75,1.75,.3),o=(e-(2-Math.max(0,t-13.4)*.6))*.86;s=Math.max(a,o)}return s=ct(s,Ee(i,t,e,0,12.2,.3,2.3,.6,1.5,.3),.3),s=Math.min(s,Ee(i,t,e,0,12.55,1.95,2.5,.22,.28,.1)),s=Math.min(s,Ee(r,t,e,2.2,13.1,1.92,.42,.26,.15,.08)),s=Math.min(s,Ee(i,t,e,0,11.1,.75,1.15,.9,.55,.25)),s=ct(s,Ee(i,t,e,0,11,0,1.2,1,1.05,.3),.2),s=ct(s,Ee(i,t,e,0,9.75,0,2.2,.75,1.4,.3),.25),s=Math.min(s,Ee(i,t,e,0,9.45,1.35,.7,.7,.25,.15)),s=Math.min(s,Ee(i,t,e,0,13.5,-1.85,2.2,1.6,.55,.25)),s=Math.min(s,rx(r,t,e)),s=Math.min(s,bt(i,t,e,0,15.3,.25,0,16.3,.35,.6,.55)),s=Math.min(s,Ee(i,t,e,0,17.25,.45,.82,.92,.9,.35)),s=Math.min(s,Ee(i,t,e,0,16.55,.95,.55,.38,.42,.18)),s=Math.min(s,Ee(i,t,e,0,18.2,.35,.12,.35,.75,.08)),s=Math.min(s,Ee(r,t,e,.95,17.55,.25,.12,.62,.3,.08)),s=Math.min(s,Ee(r,t,e,4.05,15.05,.2,1.15,.8,1.35,.3)),s=Math.min(s,Sh(r,t,e,5.4,14.7,.2,.32,.92,.12)),s=Math.min(s,we(r,t,e,4.1,14.4,.2,.75)),s=Math.min(s,bt(r,t,e,4.1,14.2,.2,4.5,11.8,.4,.62,.58)),s=Math.min(s,we(r,t,e,4.5,11.6,.4,.72)),s=Math.min(s,Ee(r,t,e,4.55,10,.6,.9,1.5,1,.3)),s=Math.min(s,Ee(r,t,e,4.55,8.05,1,.75,.75,.8,.28)),s=Math.min(s,bt(r,t,e,2.1,9.1,0,2.3,5.6,.25,1.05,.95)),s=Math.min(s,Ee(r,t,e,2.3,5.25,.85,.85,.75,.55,.25)),s=Math.min(s,Ee(r,t,e,2.3,3,.05,1.25,2.15,1.35,.35)),s=Math.min(s,Sh(r,t,e,3.75,2.6,-.35,.3,.9,.12)),s=Math.min(s,Ee(r,t,e,2.3,.5,.65,1.15,.5,2,.2)),s-n}function ax(i,t,e){const n=Math.abs(i);if(n>5&&Math.hypot(t-14.7,e-.2)<1)return Math.hypot(t-14.7,e-.2)<.42?1:5;if(n>3.38&&Math.hypot(t-2.6,e+.35)<.98)return Math.hypot(t-2.6,e+.35)<.4?1:5;if(t>16.95&&t<17.3&&e>1.2&&n>.12&&n<.62||t>12.85&&t<13.35&&e>1.95&&n>1.85&&n<2.6)return 2;if(t>13.55&&t<15.35&&n<2.55&&n>.18&&e>1.75-Math.max(0,t-13.4)*.6)return 4;if(t>16.15&&t<16.95&&e>1.25&&n<.6)return 6;if(e<-1.9&&t>13.8){const[r,s,a]=Yu(n,t,e,Xe.hx,Xe.hy,Xe.hz,Xe.yaw,Xe.roll);if(Math.abs(a)<.3&&r>.25&&r<1.75&&s>.85&&s<1.5)return 4}return t>12.3&&t<12.8&&e>1.65||t>14.25&&t<15.9&&n>2.9&&n<5.15||t>4.5&&t<6&&e>.4&&n>1.4&&n<3.2||t<1.1&&e>1.6||t>17.9&&n<.2?1:Math.hypot(n-4.1,t-14.4,e-.2)<.85&&t<14.25||Math.hypot(n-4.5,t-11.6,e-.4)<.8||t>15.2&&t<16.2&&n<.7||t>10.2&&t<11.6&&e<1.25&&n<1.25?3:0}function pe(i,t,e,n,r,s,a,o,c,l){const h=Math.abs(i-n)-a+l,u=Math.abs(t-r)-o+l,d=Math.abs(e-s)-c+l;return Math.hypot(Math.max(h,0),Math.max(u,0),Math.max(d,0))+Math.min(Math.max(h,u,d),0)-l}const ox={min:[-6.8,-.4,-4.6],max:[6.8,20.2,5]};function cx(i,t,e,n=0){const r=Math.abs(i);let s=1e9;s=Math.min(s,pe(i,t,e,0,13.6,.2,3.1,2.1,2,.5)),s=Math.min(s,Bt(i,t,e,0,14.3,2.15,1.05,.7,.75)),s=Math.min(s,pe(i,t,e,0,12.4,2,.9,1,.4,.3)),s=Math.min(s,pe(r,t,e,1.7,15.6,-2.3,.18,2.4,1.1,.12)),s=Math.min(s,pe(i,t,e,0,13,-2.3,2.2,1.6,.6,.3)),s=ct(s,pe(i,t,e,0,11.2,.1,1.9,1.1,1.35,.35),.3),s=ct(s,pe(i,t,e,0,9.7,0,2.5,.95,1.55,.3),.3),s=Math.min(s,pe(i,t,e,0,9.4,1.4,.8,.9,.35,.2)),s=Math.min(s,bt(i,t,e,0,15.3,.2,0,16.4,.3,.75,.7)),s=Math.min(s,pe(i,t,e,0,17.2,.4,1,1,1.1,.4)),s=Math.min(s,pe(i,t,e,0,16.6,1.25,.65,.45,.35,.15)),s=Math.min(s,pe(i,t,e,0,18.6,.3,.13,.75,.9,.08)),s=Math.min(s,bt(r,t,e,.95,17.7,.4,1.5,18.5,.2,.2,.08)),s=Math.min(s,pe(r,t,e,4.2,15.4,.1,1.55,.85,1.7,.35)),s=Math.min(s,bt(r,t,e,4.2,15.5,1.6,4.2,15.5,3.9,.3,.26)),s=Math.min(s,we(r,t,e,4.1,14.4,.2,1)),s=Math.min(s,bt(r,t,e,4.1,14.2,.2,4.5,11.8,.4,.85,.8)),s=Math.min(s,we(r,t,e,4.5,11.6,.4,.9)),s=Math.min(s,pe(r,t,e,4.8,10,.6,1,1.7,1.3,.3)),s=Math.min(s,pe(r,t,e,5.85,10,.6,.22,1.8,1.35,.18)),s=Math.min(s,pe(r,t,e,4.75,7.9,1,.85,.85,.95,.3)),s=Math.min(s,bt(r,t,e,2.1,9.1,0,2.3,5.8,.25,1.15,1.1)),s=Math.min(s,pe(r,t,e,2.3,5.4,.6,1.15,1.05,1,.3)),s=Math.min(s,pe(r,t,e,2.3,3,0,1.2,2,1.25,.3));for(const a of[3.8,1.9])s=Math.min(s,bt(r,t,e,3.35,a,-.4,3.75,a,-.4,.75,.75));return s=Math.min(s,pe(r,t,e,2.3,.55,.65,1.15,.55,2,.2)),s-n}function lx(i,t,e){const n=Math.abs(i),r=i>0;return t>13.7&&t<15&&e>1.6&&n<1.1||t>16.5&&t<17&&e>1.4&&n<.5&&n>.12?2:n>3.9&&n<4.5&&t>15.1&&t<15.9&&e>1.7||n>5.55&&t>8.2&&t<11.8||n>3.1&&t<4.6&&t>1.1&&e<.4||t>5.5&&t<6.3&&e>1.4&&n>1.3&&n<3.3||Math.hypot(n-4.1,t-14.4,e-.2)<1.05&&t<14.6||Math.hypot(n-4.5,t-11.6,e-.4)<.95&&t>11.3||t>10.7&&t<11&&n<2||t>8.6&&t<8.9&&n>1&&n<3.6?3:n>3.55&&t>6.4&&t<16.4||n>2.9&&t>11.4&&t<16.4?r?4:5:t<8.8&&n>.95?r?6:7:t>15.2||n>1.4&&n<2&&e<-1.2||t<11.3||e<-1.7?1:0}const hx={min:[-7.6,-.4,-6.6],max:[7.6,21,4.4]};function ux(i,t,e,n,r,s,a,o,c,l,h,u){const d=(r+o)/2;return bt(i,d+(t-d)/u,e,n,r,s,a,o,c,l,h)*u}function fx(i,t,e,n,r,s,a,o,c,l,h,u){const d=(n+a)/2;return bt(d+(i-d)/u,t,e,n,r,s,a,o,c,l,h)*u}function dx(i,t,e,n=0){const r=Math.abs(i);let s=1e9;return s=Math.min(s,pe(i,t,e,0,13.7,.1,2.5,1.9,1.7,.6)),s=Math.min(s,Bt(i,t,e,0,14.4,1.75,.95,.75,.85)),s=ct(s,pe(i,t,e,0,11.4,0,1.5,1.2,1.15,.4),.4),s=ct(s,pe(i,t,e,0,9.8,0,2.2,.85,1.35,.35),.3),s=Math.min(s,bt(i,t,e,0,15.2,-2,0,10.8,-2.3,.75,.2)),s=Math.min(s,ux(r,t,e,1.4,13.6,-2.2,6.8,12.4,-5.6,1.9,.4,.17)),s=Math.min(s,fx(r,t,e,1.5,14.2,-2.4,1.65,17.8,-3.7,.95,.22,.2)),s=Math.min(s,pe(r,t,e,3.4,15.2,.2,1.15,.9,1.5,.3)),s=Math.min(s,pe(r,t,e,3.4,16.4,-.1,.85,.45,1.1,.2)),s=Math.min(s,bt(i,t,e,0,15.3,.1,0,16.3,.2,.6,.55)),s=Math.min(s,Bt(i,t,e,0,17.1,.35,.85,1,1.15)),s=Math.min(s,bt(r,t,e,.45,17.8,.6,1,19.4,-.9,.16,.05)),s=Math.min(s,we(r,t,e,4.1,14.5,.2,.8)),s=Math.min(s,bt(r,t,e,4.1,14.3,.2,4.5,11.8,.4,.65,.6)),s=Math.min(s,we(r,t,e,4.5,11.6,.4,.7)),s=Math.min(s,pe(r,t,e,4.5,10,.6,.8,1.6,.85,.3)),s=Math.min(s,pe(r,t,e,4.5,8,.95,.6,.65,.6,.25)),s=Math.min(s,bt(r,t,e,2.1,9.1,0,2.3,5.6,.25,1.1,1)),s=Math.min(s,pe(r,t,e,2.3,5.2,.7,.75,.65,.5,.25)),s=Math.min(s,bt(r,t,e,2.3,4.8,-.1,2.3,1.7,-.3,1.25,1.15)),s=Math.min(s,bt(r,t,e,2.3,1.6,-.6,2.3,1.1,-1.4,1,1.1)),s=Math.min(s,pe(r,t,e,2.3,.45,.9,.75,.45,1.5,.2)),s-n}function px(i,t,e){const n=Math.abs(i);return t>13.8&&t<15.1&&e>1.2&&n<1||t>16.8&&t<17.4&&e>1&&n<.75?2:t<1.9&&e<-.9||Math.hypot(n-4.1,t-14.5,e-.2)<.85&&t<14.5||Math.hypot(n-4.5,t-11.6,e-.4)<.75||t>10.4&&t<10.8&&n<1.6?3:n>2.5&&n<4.3&&t>16&&t<16.9||e<-1.9&&n>1.5&&n<7&&Math.abs(t-(13.6-(n-1.4)*.22))<.3||t>12.6&&t<13&&n<2.3&&e>.8?4:n>3.6&&t<13.8&&t>7.2||t<5&&n>1?1:0}function Wi(i){const t=!!i.mech,e=!!i.cape,n=i.tail??null;return(r,s,a,o)=>r.name.startsWith("thigh")?o>-1.6&&a<r.a[1]+(t?1.4:.8)&&Math.abs(Math.abs(s)-Math.abs(r.a[0]))<(a<r.a[1]+.3?t?1.45:1.3:t?1.4:.9):r.name.startsWith("tail")?n!==null?o<n:e&&o<-1.55:!t&&(r.name.startsWith("arm")||r.name.startsWith("forearm"))?Math.abs(s)>2&&o>-1.2:t&&r.name.startsWith("arm")?o>-1.5:!0}const $u=(i,t,e=2.2)=>i.std({color:t,emissive:t,emissiveIntensity:e,roughness:.3}),mx={id:"crimson",name:"Crimson",blurb:"A suited hero, visor and all",segs:Hu,body:{sdf:(i,t,e)=>Gu(i,t,e,"crimson"),region:(i,t,e)=>Wu(i,t,e,"crimson"),box:Vu,palette:[13114922,16053492,1052692,12633292],surface:"suit",capture:Wi({})},dress(i){const t=i.std({color:526348,roughness:.08,metalness:.6});for(const e of[-1,1]){const n=new Xt(new qe(1,.38,.4),t);n.rotation.set(0,e*.42,e*-.32),i.at(n,"head",e*.46,17.12,1.12)}},fit:{size:1.08,limb:.7}},gx={id:"valkyrie",name:"Valkyrie",blurb:"Winged helm, spear and shield",segs:Hu,body:{sdf:(i,t,e)=>Gu(i,t,e,"valkyrie"),region:(i,t,e)=>Wu(i,t,e,"valkyrie"),box:Vu,palette:[7028640,14725184,15657716,15251606],surface:"suit",capture:Wi({cape:!0})},dress(i){const t=i.std({color:1708064,roughness:.2});for(const h of[-1,1]){const u=new Xt(new Ue(.17,12,8),t);u.scale.set(1,1.3,.6),i.at(u,"head",h*.42,16.8,1.5)}const e=i.std({color:5916210,roughness:.6}),n=i.std({color:14211296,roughness:.25,metalness:.85}),r=new Je;r.add(new Xt(new Le(.16,.16,17,10),e));const s=new Xt(new Cr(.42,2.4,10),n);s.position.y=9.6,r.add(s),i.at(r,"forearmR",-2.9,11,.85);const a=new Je,o=new Xt(new Le(2.1,2.1,.3,28),i.std({color:7028640,roughness:.4,metalness:.3}));o.rotation.z=Math.PI/2,a.add(o);const c=new Xt(new Ui(2.1,.16,8,32),i.std({color:14725184,roughness:.3,metalness:.7}));c.rotation.y=Math.PI/2,a.add(c);const l=new Xt(new Ue(.55,14,10),n);l.position.x=.2,a.add(l),i.at(a,"forearmL",3.38,10.4,.45)},fit:{size:1.08,limb:.7},idle:{tail:.05}},vx=Z_.map(i=>/^(arm|forearm)/.test(i.name)?{...i,reach:1.95}:i),_x={id:"howler",name:"Howler",blurb:"A wolf man with amber eyes",segs:vx,body:{sdf:(i,t,e)=>K_(i,t,e),region:Xu,box:J_,palette:[7827562,12103584,3420204,1183760],capture:Wi({tail:-1.5}),fur:{length:.8,density:7,tip:.22},furLen:j_},dress(i){const t=$u(i,16756768,1.8);for(const e of[-1,1]){const n=new Xt(new Ue(.24,12,8),t);n.scale.set(1.2,.8,.8),i.at(n,"head",e*$n[0],$n[1],$n[2])}},fit:{size:1.1,limb:.6},idle:{tail:.25}},xx={id:"plume",name:"Plume",blurb:"A big, friendly, feathered bird",segs:Q_,body:{sdf:(i,t,e)=>ex(i,t,e),region:qu,box:tx,palette:[16036872,16770976,15224972,15762468],surface:"soft",capture:Wi({tail:-2.4}),fur:{length:1.5,density:1.6,tip:.3,feather:!0},furLen:nx},dress(i){const t=i.std({color:16316660,roughness:.2}),e=i.std({color:657936,roughness:.1});for(const n of[-1,1]){const r=new Xt(new Ue(.52,18,12),t),s=new Xt(new Ue(.24,12,8),e);s.position.set(-n*.1,.02,.36),s.scale.set(1,1.2,.6),r.add(s),i.at(r,"head",n*Zn[0],Zn[1],Zn[2])}},fit:{size:1.12,limb:.5},idle:{tail:.15}};function Rc(i,t){return e=>{const n=$u(e,t);if(i==="bastion"){for(const a of[-1,1]){const o=new Xt(new qe(.42,.2,.1),n);o.rotation.z=a*-.12,e.at(o,"head",a*.36,17.12,1.36);const c=new Xt(new qe(.62,.36,.1),n);e.at(c,"spine2",a*2.2,13.1,2.08)}return}const r=i==="unison",s=new Xt(new Ue(1,20,12),n);if(s.scale.set(r?.95:.85,r?.55:.6,r?.45:.35),e.at(s,"spine2",0,14.35,r?2.55:1.95),r)for(const a of[-1,1]){const o=new Xt(new qe(.42,.16,.1),n);o.rotation.z=a*.25,e.at(o,"head",a*.32,16.85,1.62)}else e.at(new Xt(new qe(1.3,.3,.12),n),"head",0,17.1,1.42);if(r){const a=e.std({color:14673130,roughness:.2,metalness:.9}),o=e.std({color:14198832,roughness:.3,metalness:.8}),c=new Je,l=new Xt(new qe(.22,8,.9),a);l.position.y=-4.5,c.add(l);const h=new Xt(new Cr(.64,1.4,4),a);h.rotation.z=Math.PI,h.position.y=-9.2,h.scale.set(.35,1,1),c.add(h),c.rotation.x=-.95;const u=new Xt(new qe(.5,.4,3),o);u.position.y=-.3,c.add(u);const d=new Xt(new Le(.22,.22,1.6,8),o);d.position.y=.6,c.add(d),e.at(c,"forearmR",-4.75,8,2.1)}}}const Mx={id:"bastion",name:"Bastion",blurb:"An armoured truck that stands up",segs:Ac,body:{sdf:(i,t,e)=>sx(i,t,e),region:ax,box:ix,palette:[4871266,14262322,9431295,1842980,7118020,1316377,12896462],surface:"armour",weights:"rigid",capture:Wi({mech:!0})},dress:Rc("bastion",9431295),fit:{size:1,limb:.6}},Sx={id:"kestrel",name:"Kestrel",blurb:"A jet that stands up",segs:Ac,body:{sdf:(i,t,e)=>dx(i,t,e),region:px,box:hx,palette:[15132908,5661306,16756800,1842980,13117498],surface:"armour",weights:"rigid",capture:Wi({mech:!0})},dress:Rc("kestrel",16756800),fit:{size:1,limb:.6}},yx={id:"unison",name:"Unison",blurb:"Five machines locked into one",segs:Ac,body:{sdf:(i,t,e)=>cx(i,t,e),region:lx,box:ox,palette:[15527666,2503274,8382719,1842980,15234090,2271388,15254056,12855866],surface:"armour",weights:"rigid",capture:Wi({mech:!0})},dress:Rc("unison",8382719),fit:{size:1,limb:.6}},an=[n_,d_,R_,Y_,_x,mx,gx,xx,Mx,Sx,yx],Gi=i=>an.find(t=>t.id===i)??an[0],bx=i=>new O(i.x,i.y,i.z),or=(i,t,e)=>{const n=Math.min(1,Math.max(0,(e-i)/(t-i)));return n*n*(3-2*n)};function yh(i,t){const e=t.clone().normalize(),n=new O().crossVectors(i,e).normalize(),r=new O().crossVectors(e,n).normalize();return new ke().setFromRotationMatrix(new ie().makeBasis(r,e,n))}function Ex(i,t){const e=i.clone().normalize(),n=new O().crossVectors(t,e).normalize(),r=new O().crossVectors(e,n).normalize();return new ke().setFromRotationMatrix(new ie().makeBasis(e,n,r))}function wx(i){const t=M=>bx(i[M]),e=(...M)=>Math.min(...M.map(T=>i[T].v)),n=t(q.hipL),r=t(q.hipR),s=t(q.shL),a=t(q.shR),o=n.clone().add(r).multiplyScalar(.5),c=s.clone().add(a).multiplyScalar(.5),l=c.clone().sub(o),h=yh(n.clone().sub(r),l),u=yh(s.clone().sub(a),l),d=t(q.earL),f=t(q.earR),m=t(q.nose),x=d.clone().add(f).multiplyScalar(.5),g=Ex(d.clone().sub(f),m.clone().sub(x));g.multiply(new ke().setFromAxisAngle(new O(1,0,0),-.32));const p=(M,T)=>t(T).sub(t(M)).normalize(),w={armL:p(q.shL,q.elL),forearmL:p(q.elL,q.wrL),armR:p(q.shR,q.elR),forearmR:p(q.elR,q.wrR),thighL:p(q.hipL,q.knL),shinL:p(q.knL,q.anL),footL:p(q.heelL,q.toeL),thighR:p(q.hipR,q.knR),shinR:p(q.knR,q.anR),footR:p(q.heelR,q.toeR)},y={armL:e(q.shL,q.elL),forearmL:e(q.elL,q.wrL),armR:e(q.shR,q.elR),forearmR:e(q.elR,q.wrR),thighL:e(q.hipL,q.knL),shinL:e(q.knL,q.anL),footL:e(q.heelL,q.toeL),thighR:e(q.hipR,q.knR),shinR:e(q.knR,q.anR),footR:e(q.heelR,q.toeR)};return{pelvis:h,chest:u,head:g,headVis:e(q.earL,q.earR,q.nose),neck:x.sub(c).normalize(),dir:w,vis:y}}const Tx={armL:new O(1,0,0),armR:new O(-1,0,0),thighL:new O(0,-1,0),thighR:new O(0,-1,0),neck:new O(0,1,0)},bh={forearmL:"armL",forearmR:"armR",shinL:"thighL",shinR:"thighR",footL:"shinL",footR:"shinR"};class Ax{bones;rest=new Map;qm=new Map;hipRest;pelvisA;torso;len=new Map;segs;constructor(t,e){this.segs=t,this.bones=e;const n=l=>t.find(h=>h.name===l);for(const l of t){const h=new O(l.b[0]-l.a[0],l.b[1]-l.a[1],l.b[2]-l.a[2]);this.len.set(l.name,h.length()),h.lengthSq()>1e-9?h.normalize():h.set(0,1,0);const u=l.parent?n(l.parent):null,d=u?new O(l.a[0]-u.a[0],l.a[1]-u.a[1],l.a[2]-u.a[2]):new O(...l.a);let f=Tx[l.name];if(!f&&bh[l.name]){const m=n(bh[l.name]);f=new O(m.b[0]-m.a[0],m.b[1]-m.a[1],m.b[2]-m.a[2]).normalize(),l.name.startsWith("foot")&&(f=h.clone())}f??=h.clone(),this.rest.set(l.name,{dir:h,offset:d,pre:new ke().setFromUnitVectors(h,f),canon:f})}this.pelvisA=new O(...n("pelvis").a);const r=n("thighL").a,s=n("thighR").a,a=n("armL").a,o=n("armR").a;this.hipRest=new O((r[0]+s[0])/2,(r[1]+s[1])/2,(r[2]+s[2])/2);const c=new O((a[0]+o[0])/2,(a[1]+o[1])/2,(a[2]+o[2])/2);this.torso=c.distanceTo(this.hipRest)}setLength(t,e){const n=this.segs.find(a=>a.parent===t&&!a.name.startsWith("tail")&&a.name!=="jaw");if(!n)return;const r=this.bones.get(n.name),s=this.rest.get(n.name);r.position.copy(s.offset).multiplyScalar(e)}neckFit(t){const e=l=>this.segs.find(h=>h.name===l),n=e("spine2"),r=e("neck"),s=e("head"),a=(e("armL").a[1]+e("armR").a[1])/2-n.a[1],o=r.a[1]-n.a[1]+(s.a[1]-r.a[1]),c=(s.a[1]+s.b[1])/2-s.a[1];return o>.001?(a+t-c)/o:1}setNeck(t){for(const e of["neck","head"]){const n=this.bones.get(e),r=this.rest.get(e);n&&r&&n.position.copy(r.offset).multiplyScalar(t)}}swing(t,e,n,r){const s=this.rest.get(t),a=n.clone().applyQuaternion(e.clone().invert()).normalize(),o=new ke().setFromUnitVectors(s.canon,a).multiply(s.pre);return r<1&&o.slerp(new ke,1-Math.max(0,r)),o}set(t,e,n){const r=this.bones.get(t);r&&r.quaternion.copy(e);const s=n?n.clone().multiply(e):e.clone();return this.qm.set(t,s),s}apply(t,e=0,n=0){const r=this.set("pelvis",t.pelvis,null),s=this.hipRest.clone().sub(this.pelvisA).applyQuaternion(t.pelvis);this.bones.get("pelvis").position.copy(s.negate());const a=t.pelvis.clone().slerp(t.chest,.5),o=this.set("spine1",r.clone().invert().multiply(a),r),c=this.set("spine2",o.clone().invert().multiply(t.chest),o),l=or(.3,.7,t.headVis),h=this.set("neck",this.swing("neck",c,t.neck,l*.6),c),u=h.clone().invert().multiply(t.head);l<1&&u.slerp(new ke,1-l),this.set("head",u,h);for(const f of["L","R"]){const m=this.set("arm"+f,this.swing("arm"+f,c,t.dir[`arm${f}`],or(.35,.7,t.vis[`arm${f}`])),c);this.set("forearm"+f,this.swing("forearm"+f,m,t.dir[`forearm${f}`],or(.35,.7,t.vis[`forearm${f}`])),m);const x=this.set("thigh"+f,this.swing("thigh"+f,r,t.dir[`thigh${f}`],or(.4,.75,t.vis[`thigh${f}`])),r),g=this.set("shin"+f,this.swing("shin"+f,x,t.dir[`shin${f}`],or(.4,.75,t.vis[`shin${f}`])),x);this.set("foot"+f,this.swing("foot"+f,g,t.dir[`foot${f}`],or(.5,.8,t.vis[`foot${f}`])),g)}let d=r;for(let f=1;f<=4;f++){const m="tail"+f;if(!this.bones.has(m))break;const x=new ke().setFromEuler(new mn(0,Math.sin(e*2.1-f*.7)*n,Math.sin(e*1.3-f*.5)*n*.3));d=this.set(m,x,f===1?this.qm.get(this.segs.find(g=>g.name==="tail1")?.parent??"pelvis")??r:d)}}dirOf(t){return this.rest.get(t).dir.clone().applyQuaternion(this.qm.get(t))}}const cr=64,Vr=32,fn=48,Tn=36,lr=12,$s=9,dn={spread:1.6,back:.9,envIntensity:1.15,key:5,every:6,targetMean:.2,maxGain:2.6},ro=new Float32Array(256).map((i,t)=>{const e=t/255;return e<=.04045?e/12.92:Math.pow((e+.055)/1.055,2.4)});class Rx{constructor(t,e,n){this.renderer=t,this.scene=e,this.cv=document.createElement("canvas"),this.cv.width=fn,this.cv.height=Tn,this.ctx=this.cv.getContext("2d",{willReadFrequently:!0}),this.tex=new su(this.data,cr,Vr,rn,wr),this.tex.mapping=aa,this.tex.colorSpace=ki,this.tex.magFilter=He,this.tex.minFilter=He,this.pmrem=new Qo(t),this.key.castShadow=!0,this.key.shadow.mapSize.set(1024,1024),this.key.shadow.bias=-5e-4,this.key.shadow.normalBias=.02,this.key.shadow.radius=4,e.add(this.key),e.add(this.key.target),e.add(this.fill),this.fill.intensity=1}key=new qp(16777215,1);fill=new Gp(16777215,4473924,0);cv;ctx;lin=new Float32Array(fn*Tn*3);blur=new Float32Array(lr*$s*3);data=new Uint16Array(cr*Vr*4);tex;pmrem;rt=null;mean=0;share=0;gain=1;dir=new O(0,1,1).normalize();target=new O(0,0,-2);update(t,e,n,r,s,a){if(this.aimShadows(s,n),!a){this.scene.environment=null,this.fill.intensity=1.2,this.key.intensity=1.6,this.key.position.copy(this.target).add(new O(1.5,3,2.5));return}if(r%dn.every!==0&&this.rt||t.readyState<2||!t.videoWidth)return;this.ctx.drawImage(t,0,0,fn,Tn);const o=this.ctx.getImageData(0,0,fn,Tn).data;let c=0;for(let y=0,M=0;y<fn*Tn;y++,M+=4){const T=ro[o[M]],E=ro[o[M+1]],A=ro[o[M+2]];this.lin[y*3]=T,this.lin[y*3+1]=E,this.lin[y*3+2]=A,c+=.2126*T+.7152*E+.0722*A}this.mean=c/(fn*Tn),this.gain=Math.min(dn.maxGain,Math.max(1,dn.targetMean/Math.max(this.mean,.001)));const l=this.gain;this.blur.fill(0);const h=fn/lr,u=Tn/$s;for(let y=0;y<Tn;y++)for(let M=0;M<fn;M++){const T=(Math.floor(y/u)*lr+Math.floor(M/h))*3,E=(y*fn+M)*3,A=this.blur;A[T]=A[T]+this.lin[E],A[T+1]=A[T+1]+this.lin[E+1],A[T+2]=A[T+2]+this.lin[E+2]}for(let y=0;y<this.blur.length;y++)this.blur[y]=this.blur[y]/(h*u);const d=e.f/e.w,f=e.f/e.h;let m=0,x=0,g=0,p=0;for(let y=0;y<Vr;y++){const M=((y+.5)/Vr-.5)*Math.PI,T=Math.sin(M),E=Math.cos(M);for(let A=0;A<cr;A++){const C=((A+.5)/cr-.5)*Math.PI*2;let v=Math.cos(C)*E;const _=Math.sin(C)*E,S=n?-v:v,b=_<0,D=Math.max(Math.abs(_),.08),U=Math.min(1,Math.max(0,.5+S/D*d/dn.spread)),N=Math.min(1,Math.max(0,.5-T/D*f/dn.spread));let H,Z,V;if(b){const mt=(Math.min(Tn-1,Math.floor(N*Tn))*fn+Math.min(fn-1,Math.floor(U*fn)))*3;H=this.lin[mt],Z=this.lin[mt+1],V=this.lin[mt+2]}else{const mt=(Math.min($s-1,Math.floor(N*$s))*lr+Math.min(lr-1,Math.floor(U*lr)))*3;H=this.blur[mt]*dn.back,Z=this.blur[mt+1]*dn.back,V=this.blur[mt+2]*dn.back}H*=l,Z*=l,V*=l;const rt=(y*cr+A)*4;this.data[rt]=As.toHalfFloat(H),this.data[rt+1]=As.toHalfFloat(Z),this.data[rt+2]=As.toHalfFloat(V),this.data[rt+3]=As.toHalfFloat(1);const ht=.2126*H+.7152*Z+.0722*V,dt=ht*E;v=Math.cos(C)*E,m+=dt*v,x+=dt*T,g+=dt*_,p+=dt}}this.tex.needsUpdate=!0,this.rt=this.pmrem.fromEquirectangular(this.tex,this.rt),this.scene.environment=this.rt.texture,this.scene.environmentIntensity=dn.envIntensity;const w=Math.hypot(m,x,g);this.share=p>0?w/p:0,w>1e-6&&this.dir.set(m/w,x/w,g/w),this.dir.y<.15&&(this.dir.y=.15,this.dir.normalize()),this.key.intensity=dn.key*this.share*(p/(cr*Vr))*2,this.fill.intensity=0,this.key.position.copy(this.target).addScaledVector(this.dir,4)}aimShadows(t,e){if(!t.length)return;const n=new O;for(const a of t)n.add(a);n.multiplyScalar(1/t.length),e&&(n.x=-n.x);let r=1.4;for(const a of t)r=Math.max(r,Math.hypot((e?-a.x:a.x)-n.x,a.y-n.y,a.z-n.z)+1.4);this.target.copy(n),this.key.target.position.copy(n),this.key.position.copy(n).addScaledVector(this.dir,4);const s=this.key.shadow.camera;s.right!==r&&(s.left=-r,s.right=r,s.top=r,s.bottom=-r,s.near=.1,s.far=4+r*2,s.updateProjectionMatrix())}}const Cx=`
  varying vec2 vUv;
  uniform vec4 uCrop; // u0, v0, du, dv of the video shown
  uniform float uMirror;
  void main() {
    vec2 uv = position.xy * 0.5 + 0.5;
    uv.x = mix(uv.x, 1.0 - uv.x, uMirror);
    vUv = uCrop.xy + uv * uCrop.zw;
    gl_Position = vec4(position.xy, 1.0, 1.0);
  }`,Lx=`
  varying vec2 vUv;
  uniform sampler2D uTex;
  void main() { gl_FragColor = vec4(texture2D(uTex, vUv).rgb, 1.0); }`;class Px{constructor(t){this.canvas=t,this.renderer=new Lv({canvas:t,antialias:!0,alpha:!1,powerPreference:"high-performance",preserveDrawingBuffer:!1}),this.renderer.outputColorSpace=nn,this.renderer.toneMapping=Nh,this.renderer.toneMappingExposure=1,this.renderer.shadowMap.enabled=!0,this.renderer.shadowMap.type=Ih,this.renderer.setPixelRatio(this.opts.pixelRatio),this.bg=new Xt(new us(2,2),new Jn({vertexShader:Cx,fragmentShader:Lx,depthTest:!1,depthWrite:!1,toneMapped:!1,uniforms:{uTex:{value:null},uCrop:{value:new me(0,0,1,1)},uMirror:{value:0}}})),this.bg.frustumCulled=!1,this.bg.renderOrder=-1e3,this.scene.add(this.bg),this.scene.add(this.world),this.scene.add(this.camera),this.light=new Rx(this.renderer,this.scene,this.world)}renderer;scene=new ip;camera=new pn(50,1,.05,60);world=new Je;light;bg;videoTex=null;templates=new Map;wearers=new Map;opts={size:1,shadows:!0,envLight:!0,pixelRatio:Math.min(window.devicePixelRatio||1,2)};cover={s:1,ox:0,oy:0,vw:1,vh:1,cw:1,ch:1,mirror:!1};setVideo(t){this.videoTex?.dispose();const e=new lp(t);e.colorSpace=Rn,e.minFilter=He,e.magFilter=He,e.generateMipmaps=!1,this.videoTex=e,this.bg.material.uniforms.uTex.value=e}template(t){let e=this.templates.get(t);return e||(e=Gv(Gi(t)),this.templates.set(t,e)),e}hasTemplate(t){return this.templates.has(t)}layout(t,e){const n=this.canvas.clientWidth||window.innerWidth,r=this.canvas.clientHeight||window.innerHeight,s=this.opts.pixelRatio;this.renderer.getPixelRatio()!==s&&this.renderer.setPixelRatio(s);const a=this.renderer.getSize(new St);(a.x!==n||a.y!==r)&&this.renderer.setSize(n,r,!1);const o=Math.max(n/t.w,r/t.h),c=n/o,l=r/o,h=(t.w-c)/2/t.w,u=(t.h-l)/2/t.h;this.bg.material.uniforms.uCrop.value.set(h,u,c/t.w,l/t.h),this.bg.material.uniforms.uMirror.value=e?1:0,this.camera.fov=Ad.radToDeg(2*Math.atan(l/2/t.f)),this.camera.aspect=n/r,this.camera.updateProjectionMatrix(),this.world.scale.x=e?-1:1,this.cover={s:o,ox:(t.w-c)/2,oy:(t.h-l)/2,vw:t.w,vh:t.h,cw:n,ch:r,mirror:e}}sync(t,e,n){const r=new Set;for(const s of t){const a=e(s.id);if(!this.templates.has(a))continue;r.add(s.id);let o=this.wearers.get(s.id);o&&o.def.id!==a&&(this.drop(o),o=void 0),o||(o=this.dress(s.id,a)),this.pose(o,s,n)}for(const[s,a]of this.wearers)r.has(s)||this.drop(a)}dress(t,e){const n=this.template(e),r=Uv(n.root),s=new Map;r.traverse(c=>{c.isBone&&s.set(c.name,c)});const a=new Map;r.traverse(c=>{const l=c;if(!l.isMesh)return;const h=u=>{let d=a.get(u);return d||(d=u.clone(),d.onBeforeCompile=u.onBeforeCompile,d.customProgramCacheKey=u.customProgramCacheKey,d.alphaHash=!0,a.set(u,d)),d};l.material=Array.isArray(l.material)?l.material.map(h):h(l.material)});const o={trackId:t,def:n.def,root:r,rig:new Ax(n.def.segs,s),mats:[...a.values()],fade:0};return this.world.add(r),this.wearers.set(t,o),o}drop(t){this.world.remove(t.root);for(const e of t.mats)e.dispose();this.wearers.delete(t.trackId)}pose(t,e,n){const r=t.def,s=t.rig,a=wx(e.world),o=e.len.torso/s.torso*(r.fit?.size??1)*this.opts.size,c=r.fit?.limb??0,l=(d,f)=>{const m=1+(f/o/(s.len.get(d)??1)-1)*c;s.setLength(d,Math.min(1.6,Math.max(.65,m)))};for(const d of["L","R"])l("arm"+d,e.len.upperArm),l("thigh"+d,e.len.thigh),l("shin"+d,e.len.shin);const h=s.neckFit(e.len.neck/o);s.setNeck(1+(Math.min(1.25,Math.max(.45,h))-1)*(r.fit?.head??.85)),s.apply(a,n,r.idle?.tail??0),t.root.position.set(e.T.x,e.T.y,e.T.z),t.root.scale.setScalar(o);const u=e.presence*e.presence*(3-2*e.presence);if(u!==t.fade){for(const d of t.mats)d.opacity=u;t.fade=u}t.root.visible=u>.01,r.tick?.(t.root,n)}people(){return[...this.wearers.values()].filter(t=>t.root.visible).map(t=>t.root.position.clone())}render(t,e,n){this.renderer.shadowMap.enabled=this.opts.shadows,t&&this.light.update(t,e,this.cover.mirror,n,this.people(),this.opts.envLight),this.renderer.render(this.scene,this.camera)}get count(){return this.wearers.size}}const Eh={people:2,model:"lite",size:1,lens:.85,envLight:!0,shadows:!0,debug:!1,mode:"one",costume:"jimothy"},Zu="costuma26.settings";function Dx(){try{return{...Eh,...JSON.parse(localStorage.getItem(Zu)??"{}")}}catch{return{...Eh}}}function Ix(i){try{localStorage.setItem(Zu,JSON.stringify(i))}catch{}}const Zs=i=>`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${i}</svg>`,Li={qr:Zs('<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><path d="M14 14h3v3h-3zM20 14v.01M14 20h.01M17 20h4v-3"/>'),flip:Zs('<path d="M4 7h3l2-3h6l2 3h3a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1z"/><path d="M9 13a3 3 0 0 1 5-2.2M15 13a3 3 0 0 1-5 2.2"/><path d="M14 9v2h-2M10 17v-2h2"/>'),gear:Zs('<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/>'),camera:Zs('<path d="M4 8h3l2-3h6l2 3h3a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1z"/><circle cx="12" cy="13" r="3.5"/>'),rec:'<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="7" fill="currentColor"/></svg>',stop:'<svg viewBox="0 0 24 24"><rect x="6" y="6" width="12" height="12" rx="2" fill="currentColor"/></svg>'};function Ux(i){return i&&i.__esModule&&Object.prototype.hasOwnProperty.call(i,"default")?i.default:i}var so={exports:{}},wh;function Nx(){return wh||(wh=1,(function(i,t){var e=(function(){var n=function(T,E){var A=236,C=17,v=T,_=s[E],S=null,b=0,D=null,U=[],N={},H=function(F,k){b=v*4+17,S=(function(B){for(var K=new Array(B),j=0;j<B;j+=1){K[j]=new Array(B);for(var P=0;P<B;P+=1)K[j][P]=null}return K})(b),Z(0,0),Z(b-7,0),Z(0,b-7),ht(),rt(),mt(F,k),v>=7&&dt(F),D==null&&(D=zt(v,_,U)),Et(D,k)},Z=function(F,k){for(var B=-1;B<=7;B+=1)if(!(F+B<=-1||b<=F+B))for(var K=-1;K<=7;K+=1)k+K<=-1||b<=k+K||(0<=B&&B<=6&&(K==0||K==6)||0<=K&&K<=6&&(B==0||B==6)||2<=B&&B<=4&&2<=K&&K<=4?S[F+B][k+K]=!0:S[F+B][k+K]=!1)},V=function(){for(var F=0,k=0,B=0;B<8;B+=1){H(!0,B);var K=o.getLostPoint(N);(B==0||F>K)&&(F=K,k=B)}return k},rt=function(){for(var F=8;F<b-8;F+=1)S[F][6]==null&&(S[F][6]=F%2==0);for(var k=8;k<b-8;k+=1)S[6][k]==null&&(S[6][k]=k%2==0)},ht=function(){for(var F=o.getPatternPosition(v),k=0;k<F.length;k+=1)for(var B=0;B<F.length;B+=1){var K=F[k],j=F[B];if(S[K][j]==null)for(var P=-2;P<=2;P+=1)for(var Q=-2;Q<=2;Q+=1)P==-2||P==2||Q==-2||Q==2||P==0&&Q==0?S[K+P][j+Q]=!0:S[K+P][j+Q]=!1}},dt=function(F){for(var k=o.getBCHTypeNumber(v),B=0;B<18;B+=1){var K=!F&&(k>>B&1)==1;S[Math.floor(B/3)][B%3+b-8-3]=K}for(var B=0;B<18;B+=1){var K=!F&&(k>>B&1)==1;S[B%3+b-8-3][Math.floor(B/3)]=K}},mt=function(F,k){for(var B=_<<3|k,K=o.getBCHTypeInfo(B),j=0;j<15;j+=1){var P=!F&&(K>>j&1)==1;j<6?S[j][8]=P:j<8?S[j+1][8]=P:S[b-15+j][8]=P}for(var j=0;j<15;j+=1){var P=!F&&(K>>j&1)==1;j<8?S[8][b-j-1]=P:j<9?S[8][15-j-1+1]=P:S[8][15-j-1]=P}S[b-8][8]=!F},Et=function(F,k){for(var B=-1,K=b-1,j=7,P=0,Q=o.getMaskFunction(k),z=b-1;z>0;z-=2)for(z==6&&(z-=1);;){for(var G=0;G<2;G+=1)if(S[K][z-G]==null){var X=!1;P<F.length&&(X=(F[P]>>>j&1)==1);var tt=Q(K,z-G);tt&&(X=!X),S[K][z-G]=X,j-=1,j==-1&&(P+=1,j=7)}if(K+=B,K<0||b<=K){K-=B,B=-B;break}}},Ft=function(F,k){for(var B=0,K=0,j=0,P=new Array(k.length),Q=new Array(k.length),z=0;z<k.length;z+=1){var G=k[z].dataCount,X=k[z].totalCount-G;K=Math.max(K,G),j=Math.max(j,X),P[z]=new Array(G);for(var tt=0;tt<P[z].length;tt+=1)P[z][tt]=255&F.getBuffer()[tt+B];B+=G;var ot=o.getErrorCorrectPolynomial(X),ut=l(P[z],ot.getLength()-1),Pt=ut.mod(ot);Q[z]=new Array(ot.getLength()-1);for(var tt=0;tt<Q[z].length;tt+=1){var Ht=tt+Pt.getLength()-Q[z].length;Q[z][tt]=Ht>=0?Pt.getAt(Ht):0}}for(var I=0,tt=0;tt<k.length;tt+=1)I+=k[tt].totalCount;for(var R=new Array(I),Y=0,tt=0;tt<K;tt+=1)for(var z=0;z<k.length;z+=1)tt<P[z].length&&(R[Y]=P[z][tt],Y+=1);for(var tt=0;tt<j;tt+=1)for(var z=0;z<k.length;z+=1)tt<Q[z].length&&(R[Y]=Q[z][tt],Y+=1);return R},zt=function(F,k,B){for(var K=h.getRSBlocks(F,k),j=u(),P=0;P<B.length;P+=1){var Q=B[P];j.put(Q.getMode(),4),j.put(Q.getLength(),o.getLengthInBits(Q.getMode(),F)),Q.write(j)}for(var z=0,P=0;P<K.length;P+=1)z+=K[P].dataCount;if(j.getLengthInBits()>z*8)throw"code length overflow. ("+j.getLengthInBits()+">"+z*8+")";for(j.getLengthInBits()+4<=z*8&&j.put(0,4);j.getLengthInBits()%8!=0;)j.putBit(!1);for(;!(j.getLengthInBits()>=z*8||(j.put(A,8),j.getLengthInBits()>=z*8));)j.put(C,8);return Ft(j,K)};N.addData=function(F,k){k=k||"Byte";var B=null;switch(k){case"Numeric":B=d(F);break;case"Alphanumeric":B=f(F);break;case"Byte":B=m(F);break;case"Kanji":B=x(F);break;default:throw"mode:"+k}U.push(B),D=null},N.isDark=function(F,k){if(F<0||b<=F||k<0||b<=k)throw F+","+k;return S[F][k]},N.getModuleCount=function(){return b},N.make=function(){if(v<1){for(var F=1;F<40;F++){for(var k=h.getRSBlocks(F,_),B=u(),K=0;K<U.length;K++){var j=U[K];B.put(j.getMode(),4),B.put(j.getLength(),o.getLengthInBits(j.getMode(),F)),j.write(B)}for(var P=0,K=0;K<k.length;K++)P+=k[K].dataCount;if(B.getLengthInBits()<=P*8)break}v=F}H(!1,V())},N.createTableTag=function(F,k){F=F||2,k=typeof k>"u"?F*4:k;var B="";B+='<table style="',B+=" border-width: 0px; border-style: none;",B+=" border-collapse: collapse;",B+=" padding: 0px; margin: "+k+"px;",B+='">',B+="<tbody>";for(var K=0;K<N.getModuleCount();K+=1){B+="<tr>";for(var j=0;j<N.getModuleCount();j+=1)B+='<td style="',B+=" border-width: 0px; border-style: none;",B+=" border-collapse: collapse;",B+=" padding: 0px; margin: 0px;",B+=" width: "+F+"px;",B+=" height: "+F+"px;",B+=" background-color: ",B+=N.isDark(K,j)?"#000000":"#ffffff",B+=";",B+='"/>';B+="</tr>"}return B+="</tbody>",B+="</table>",B},N.createSvgTag=function(F,k,B,K){var j={};typeof arguments[0]=="object"&&(j=arguments[0],F=j.cellSize,k=j.margin,B=j.alt,K=j.title),F=F||2,k=typeof k>"u"?F*4:k,B=typeof B=="string"?{text:B}:B||{},B.text=B.text||null,B.id=B.text?B.id||"qrcode-description":null,K=typeof K=="string"?{text:K}:K||{},K.text=K.text||null,K.id=K.text?K.id||"qrcode-title":null;var P=N.getModuleCount()*F+k*2,Q,z,G,X,tt="",ot;for(ot="l"+F+",0 0,"+F+" -"+F+",0 0,-"+F+"z ",tt+='<svg version="1.1" xmlns="http://www.w3.org/2000/svg"',tt+=j.scalable?"":' width="'+P+'px" height="'+P+'px"',tt+=' viewBox="0 0 '+P+" "+P+'" ',tt+=' preserveAspectRatio="xMinYMin meet"',tt+=K.text||B.text?' role="img" aria-labelledby="'+et([K.id,B.id].join(" ").trim())+'"':"",tt+=">",tt+=K.text?'<title id="'+et(K.id)+'">'+et(K.text)+"</title>":"",tt+=B.text?'<description id="'+et(B.id)+'">'+et(B.text)+"</description>":"",tt+='<rect width="100%" height="100%" fill="white" cx="0" cy="0"/>',tt+='<path d="',G=0;G<N.getModuleCount();G+=1)for(X=G*F+k,Q=0;Q<N.getModuleCount();Q+=1)N.isDark(G,Q)&&(z=Q*F+k,tt+="M"+z+","+X+ot);return tt+='" stroke="transparent" fill="black"/>',tt+="</svg>",tt},N.createDataURL=function(F,k){F=F||2,k=typeof k>"u"?F*4:k;var B=N.getModuleCount()*F+k*2,K=k,j=B-k;return M(B,B,function(P,Q){if(K<=P&&P<j&&K<=Q&&Q<j){var z=Math.floor((P-K)/F),G=Math.floor((Q-K)/F);return N.isDark(G,z)?0:1}else return 1})},N.createImgTag=function(F,k,B){F=F||2,k=typeof k>"u"?F*4:k;var K=N.getModuleCount()*F+k*2,j="";return j+="<img",j+=' src="',j+=N.createDataURL(F,k),j+='"',j+=' width="',j+=K,j+='"',j+=' height="',j+=K,j+='"',B&&(j+=' alt="',j+=et(B),j+='"'),j+="/>",j};var et=function(F){for(var k="",B=0;B<F.length;B+=1){var K=F.charAt(B);switch(K){case"<":k+="&lt;";break;case">":k+="&gt;";break;case"&":k+="&amp;";break;case'"':k+="&quot;";break;default:k+=K;break}}return k},lt=function(F){var k=1;F=typeof F>"u"?k*2:F;var B=N.getModuleCount()*k+F*2,K=F,j=B-F,P,Q,z,G,X,tt={"██":"█","█ ":"▀"," █":"▄","  ":" "},ot={"██":"▀","█ ":"▀"," █":" ","  ":" "},ut="";for(P=0;P<B;P+=2){for(z=Math.floor((P-K)/k),G=Math.floor((P+1-K)/k),Q=0;Q<B;Q+=1)X="█",K<=Q&&Q<j&&K<=P&&P<j&&N.isDark(z,Math.floor((Q-K)/k))&&(X=" "),K<=Q&&Q<j&&K<=P+1&&P+1<j&&N.isDark(G,Math.floor((Q-K)/k))?X+=" ":X+="█",ut+=F<1&&P+1>=j?ot[X]:tt[X];ut+=`
`}return B%2&&F>0?ut.substring(0,ut.length-B-1)+Array(B+1).join("▀"):ut.substring(0,ut.length-1)};return N.createASCII=function(F,k){if(F=F||1,F<2)return lt(k);F-=1,k=typeof k>"u"?F*2:k;var B=N.getModuleCount()*F+k*2,K=k,j=B-k,P,Q,z,G,X=Array(F+1).join("██"),tt=Array(F+1).join("  "),ot="",ut="";for(P=0;P<B;P+=1){for(z=Math.floor((P-K)/F),ut="",Q=0;Q<B;Q+=1)G=1,K<=Q&&Q<j&&K<=P&&P<j&&N.isDark(z,Math.floor((Q-K)/F))&&(G=0),ut+=G?X:tt;for(z=0;z<F;z+=1)ot+=ut+`
`}return ot.substring(0,ot.length-1)},N.renderTo2dContext=function(F,k){k=k||2;for(var B=N.getModuleCount(),K=0;K<B;K++)for(var j=0;j<B;j++)F.fillStyle=N.isDark(K,j)?"black":"white",F.fillRect(K*k,j*k,k,k)},N};n.stringToBytesFuncs={default:function(T){for(var E=[],A=0;A<T.length;A+=1){var C=T.charCodeAt(A);E.push(C&255)}return E}},n.stringToBytes=n.stringToBytesFuncs.default,n.createStringToBytes=function(T,E){var A=(function(){for(var v=w(T),_=function(){var rt=v.read();if(rt==-1)throw"eof";return rt},S=0,b={};;){var D=v.read();if(D==-1)break;var U=_(),N=_(),H=_(),Z=String.fromCharCode(D<<8|U),V=N<<8|H;b[Z]=V,S+=1}if(S!=E)throw S+" != "+E;return b})(),C=63;return function(v){for(var _=[],S=0;S<v.length;S+=1){var b=v.charCodeAt(S);if(b<128)_.push(b);else{var D=A[v.charAt(S)];typeof D=="number"?(D&255)==D?_.push(D):(_.push(D>>>8),_.push(D&255)):_.push(C)}}return _}};var r={MODE_NUMBER:1,MODE_ALPHA_NUM:2,MODE_8BIT_BYTE:4,MODE_KANJI:8},s={L:1,M:0,Q:3,H:2},a={PATTERN000:0,PATTERN001:1,PATTERN010:2,PATTERN011:3,PATTERN100:4,PATTERN101:5,PATTERN110:6,PATTERN111:7},o=(function(){var T=[[],[6,18],[6,22],[6,26],[6,30],[6,34],[6,22,38],[6,24,42],[6,26,46],[6,28,50],[6,30,54],[6,32,58],[6,34,62],[6,26,46,66],[6,26,48,70],[6,26,50,74],[6,30,54,78],[6,30,56,82],[6,30,58,86],[6,34,62,90],[6,28,50,72,94],[6,26,50,74,98],[6,30,54,78,102],[6,28,54,80,106],[6,32,58,84,110],[6,30,58,86,114],[6,34,62,90,118],[6,26,50,74,98,122],[6,30,54,78,102,126],[6,26,52,78,104,130],[6,30,56,82,108,134],[6,34,60,86,112,138],[6,30,58,86,114,142],[6,34,62,90,118,146],[6,30,54,78,102,126,150],[6,24,50,76,102,128,154],[6,28,54,80,106,132,158],[6,32,58,84,110,136,162],[6,26,54,82,110,138,166],[6,30,58,86,114,142,170]],E=1335,A=7973,C=21522,v={},_=function(S){for(var b=0;S!=0;)b+=1,S>>>=1;return b};return v.getBCHTypeInfo=function(S){for(var b=S<<10;_(b)-_(E)>=0;)b^=E<<_(b)-_(E);return(S<<10|b)^C},v.getBCHTypeNumber=function(S){for(var b=S<<12;_(b)-_(A)>=0;)b^=A<<_(b)-_(A);return S<<12|b},v.getPatternPosition=function(S){return T[S-1]},v.getMaskFunction=function(S){switch(S){case a.PATTERN000:return function(b,D){return(b+D)%2==0};case a.PATTERN001:return function(b,D){return b%2==0};case a.PATTERN010:return function(b,D){return D%3==0};case a.PATTERN011:return function(b,D){return(b+D)%3==0};case a.PATTERN100:return function(b,D){return(Math.floor(b/2)+Math.floor(D/3))%2==0};case a.PATTERN101:return function(b,D){return b*D%2+b*D%3==0};case a.PATTERN110:return function(b,D){return(b*D%2+b*D%3)%2==0};case a.PATTERN111:return function(b,D){return(b*D%3+(b+D)%2)%2==0};default:throw"bad maskPattern:"+S}},v.getErrorCorrectPolynomial=function(S){for(var b=l([1],0),D=0;D<S;D+=1)b=b.multiply(l([1,c.gexp(D)],0));return b},v.getLengthInBits=function(S,b){if(1<=b&&b<10)switch(S){case r.MODE_NUMBER:return 10;case r.MODE_ALPHA_NUM:return 9;case r.MODE_8BIT_BYTE:return 8;case r.MODE_KANJI:return 8;default:throw"mode:"+S}else if(b<27)switch(S){case r.MODE_NUMBER:return 12;case r.MODE_ALPHA_NUM:return 11;case r.MODE_8BIT_BYTE:return 16;case r.MODE_KANJI:return 10;default:throw"mode:"+S}else if(b<41)switch(S){case r.MODE_NUMBER:return 14;case r.MODE_ALPHA_NUM:return 13;case r.MODE_8BIT_BYTE:return 16;case r.MODE_KANJI:return 12;default:throw"mode:"+S}else throw"type:"+b},v.getLostPoint=function(S){for(var b=S.getModuleCount(),D=0,U=0;U<b;U+=1)for(var N=0;N<b;N+=1){for(var H=0,Z=S.isDark(U,N),V=-1;V<=1;V+=1)if(!(U+V<0||b<=U+V))for(var rt=-1;rt<=1;rt+=1)N+rt<0||b<=N+rt||V==0&&rt==0||Z==S.isDark(U+V,N+rt)&&(H+=1);H>5&&(D+=3+H-5)}for(var U=0;U<b-1;U+=1)for(var N=0;N<b-1;N+=1){var ht=0;S.isDark(U,N)&&(ht+=1),S.isDark(U+1,N)&&(ht+=1),S.isDark(U,N+1)&&(ht+=1),S.isDark(U+1,N+1)&&(ht+=1),(ht==0||ht==4)&&(D+=3)}for(var U=0;U<b;U+=1)for(var N=0;N<b-6;N+=1)S.isDark(U,N)&&!S.isDark(U,N+1)&&S.isDark(U,N+2)&&S.isDark(U,N+3)&&S.isDark(U,N+4)&&!S.isDark(U,N+5)&&S.isDark(U,N+6)&&(D+=40);for(var N=0;N<b;N+=1)for(var U=0;U<b-6;U+=1)S.isDark(U,N)&&!S.isDark(U+1,N)&&S.isDark(U+2,N)&&S.isDark(U+3,N)&&S.isDark(U+4,N)&&!S.isDark(U+5,N)&&S.isDark(U+6,N)&&(D+=40);for(var dt=0,N=0;N<b;N+=1)for(var U=0;U<b;U+=1)S.isDark(U,N)&&(dt+=1);var mt=Math.abs(100*dt/b/b-50)/5;return D+=mt*10,D},v})(),c=(function(){for(var T=new Array(256),E=new Array(256),A=0;A<8;A+=1)T[A]=1<<A;for(var A=8;A<256;A+=1)T[A]=T[A-4]^T[A-5]^T[A-6]^T[A-8];for(var A=0;A<255;A+=1)E[T[A]]=A;var C={};return C.glog=function(v){if(v<1)throw"glog("+v+")";return E[v]},C.gexp=function(v){for(;v<0;)v+=255;for(;v>=256;)v-=255;return T[v]},C})();function l(T,E){if(typeof T.length>"u")throw T.length+"/"+E;var A=(function(){for(var v=0;v<T.length&&T[v]==0;)v+=1;for(var _=new Array(T.length-v+E),S=0;S<T.length-v;S+=1)_[S]=T[S+v];return _})(),C={};return C.getAt=function(v){return A[v]},C.getLength=function(){return A.length},C.multiply=function(v){for(var _=new Array(C.getLength()+v.getLength()-1),S=0;S<C.getLength();S+=1)for(var b=0;b<v.getLength();b+=1)_[S+b]^=c.gexp(c.glog(C.getAt(S))+c.glog(v.getAt(b)));return l(_,0)},C.mod=function(v){if(C.getLength()-v.getLength()<0)return C;for(var _=c.glog(C.getAt(0))-c.glog(v.getAt(0)),S=new Array(C.getLength()),b=0;b<C.getLength();b+=1)S[b]=C.getAt(b);for(var b=0;b<v.getLength();b+=1)S[b]^=c.gexp(c.glog(v.getAt(b))+_);return l(S,0).mod(v)},C}var h=(function(){var T=[[1,26,19],[1,26,16],[1,26,13],[1,26,9],[1,44,34],[1,44,28],[1,44,22],[1,44,16],[1,70,55],[1,70,44],[2,35,17],[2,35,13],[1,100,80],[2,50,32],[2,50,24],[4,25,9],[1,134,108],[2,67,43],[2,33,15,2,34,16],[2,33,11,2,34,12],[2,86,68],[4,43,27],[4,43,19],[4,43,15],[2,98,78],[4,49,31],[2,32,14,4,33,15],[4,39,13,1,40,14],[2,121,97],[2,60,38,2,61,39],[4,40,18,2,41,19],[4,40,14,2,41,15],[2,146,116],[3,58,36,2,59,37],[4,36,16,4,37,17],[4,36,12,4,37,13],[2,86,68,2,87,69],[4,69,43,1,70,44],[6,43,19,2,44,20],[6,43,15,2,44,16],[4,101,81],[1,80,50,4,81,51],[4,50,22,4,51,23],[3,36,12,8,37,13],[2,116,92,2,117,93],[6,58,36,2,59,37],[4,46,20,6,47,21],[7,42,14,4,43,15],[4,133,107],[8,59,37,1,60,38],[8,44,20,4,45,21],[12,33,11,4,34,12],[3,145,115,1,146,116],[4,64,40,5,65,41],[11,36,16,5,37,17],[11,36,12,5,37,13],[5,109,87,1,110,88],[5,65,41,5,66,42],[5,54,24,7,55,25],[11,36,12,7,37,13],[5,122,98,1,123,99],[7,73,45,3,74,46],[15,43,19,2,44,20],[3,45,15,13,46,16],[1,135,107,5,136,108],[10,74,46,1,75,47],[1,50,22,15,51,23],[2,42,14,17,43,15],[5,150,120,1,151,121],[9,69,43,4,70,44],[17,50,22,1,51,23],[2,42,14,19,43,15],[3,141,113,4,142,114],[3,70,44,11,71,45],[17,47,21,4,48,22],[9,39,13,16,40,14],[3,135,107,5,136,108],[3,67,41,13,68,42],[15,54,24,5,55,25],[15,43,15,10,44,16],[4,144,116,4,145,117],[17,68,42],[17,50,22,6,51,23],[19,46,16,6,47,17],[2,139,111,7,140,112],[17,74,46],[7,54,24,16,55,25],[34,37,13],[4,151,121,5,152,122],[4,75,47,14,76,48],[11,54,24,14,55,25],[16,45,15,14,46,16],[6,147,117,4,148,118],[6,73,45,14,74,46],[11,54,24,16,55,25],[30,46,16,2,47,17],[8,132,106,4,133,107],[8,75,47,13,76,48],[7,54,24,22,55,25],[22,45,15,13,46,16],[10,142,114,2,143,115],[19,74,46,4,75,47],[28,50,22,6,51,23],[33,46,16,4,47,17],[8,152,122,4,153,123],[22,73,45,3,74,46],[8,53,23,26,54,24],[12,45,15,28,46,16],[3,147,117,10,148,118],[3,73,45,23,74,46],[4,54,24,31,55,25],[11,45,15,31,46,16],[7,146,116,7,147,117],[21,73,45,7,74,46],[1,53,23,37,54,24],[19,45,15,26,46,16],[5,145,115,10,146,116],[19,75,47,10,76,48],[15,54,24,25,55,25],[23,45,15,25,46,16],[13,145,115,3,146,116],[2,74,46,29,75,47],[42,54,24,1,55,25],[23,45,15,28,46,16],[17,145,115],[10,74,46,23,75,47],[10,54,24,35,55,25],[19,45,15,35,46,16],[17,145,115,1,146,116],[14,74,46,21,75,47],[29,54,24,19,55,25],[11,45,15,46,46,16],[13,145,115,6,146,116],[14,74,46,23,75,47],[44,54,24,7,55,25],[59,46,16,1,47,17],[12,151,121,7,152,122],[12,75,47,26,76,48],[39,54,24,14,55,25],[22,45,15,41,46,16],[6,151,121,14,152,122],[6,75,47,34,76,48],[46,54,24,10,55,25],[2,45,15,64,46,16],[17,152,122,4,153,123],[29,74,46,14,75,47],[49,54,24,10,55,25],[24,45,15,46,46,16],[4,152,122,18,153,123],[13,74,46,32,75,47],[48,54,24,14,55,25],[42,45,15,32,46,16],[20,147,117,4,148,118],[40,75,47,7,76,48],[43,54,24,22,55,25],[10,45,15,67,46,16],[19,148,118,6,149,119],[18,75,47,31,76,48],[34,54,24,34,55,25],[20,45,15,61,46,16]],E=function(v,_){var S={};return S.totalCount=v,S.dataCount=_,S},A={},C=function(v,_){switch(_){case s.L:return T[(v-1)*4+0];case s.M:return T[(v-1)*4+1];case s.Q:return T[(v-1)*4+2];case s.H:return T[(v-1)*4+3];default:return}};return A.getRSBlocks=function(v,_){var S=C(v,_);if(typeof S>"u")throw"bad rs block @ typeNumber:"+v+"/errorCorrectionLevel:"+_;for(var b=S.length/3,D=[],U=0;U<b;U+=1)for(var N=S[U*3+0],H=S[U*3+1],Z=S[U*3+2],V=0;V<N;V+=1)D.push(E(H,Z));return D},A})(),u=function(){var T=[],E=0,A={};return A.getBuffer=function(){return T},A.getAt=function(C){var v=Math.floor(C/8);return(T[v]>>>7-C%8&1)==1},A.put=function(C,v){for(var _=0;_<v;_+=1)A.putBit((C>>>v-_-1&1)==1)},A.getLengthInBits=function(){return E},A.putBit=function(C){var v=Math.floor(E/8);T.length<=v&&T.push(0),C&&(T[v]|=128>>>E%8),E+=1},A},d=function(T){var E=r.MODE_NUMBER,A=T,C={};C.getMode=function(){return E},C.getLength=function(S){return A.length},C.write=function(S){for(var b=A,D=0;D+2<b.length;)S.put(v(b.substring(D,D+3)),10),D+=3;D<b.length&&(b.length-D==1?S.put(v(b.substring(D,D+1)),4):b.length-D==2&&S.put(v(b.substring(D,D+2)),7))};var v=function(S){for(var b=0,D=0;D<S.length;D+=1)b=b*10+_(S.charAt(D));return b},_=function(S){if("0"<=S&&S<="9")return S.charCodeAt(0)-48;throw"illegal char :"+S};return C},f=function(T){var E=r.MODE_ALPHA_NUM,A=T,C={};C.getMode=function(){return E},C.getLength=function(_){return A.length},C.write=function(_){for(var S=A,b=0;b+1<S.length;)_.put(v(S.charAt(b))*45+v(S.charAt(b+1)),11),b+=2;b<S.length&&_.put(v(S.charAt(b)),6)};var v=function(_){if("0"<=_&&_<="9")return _.charCodeAt(0)-48;if("A"<=_&&_<="Z")return _.charCodeAt(0)-65+10;switch(_){case" ":return 36;case"$":return 37;case"%":return 38;case"*":return 39;case"+":return 40;case"-":return 41;case".":return 42;case"/":return 43;case":":return 44;default:throw"illegal char :"+_}};return C},m=function(T){var E=r.MODE_8BIT_BYTE,A=n.stringToBytes(T),C={};return C.getMode=function(){return E},C.getLength=function(v){return A.length},C.write=function(v){for(var _=0;_<A.length;_+=1)v.put(A[_],8)},C},x=function(T){var E=r.MODE_KANJI,A=n.stringToBytesFuncs.SJIS;if(!A)throw"sjis not supported.";(function(_,S){var b=A(_);if(b.length!=2||(b[0]<<8|b[1])!=S)throw"sjis not supported."})("友",38726);var C=A(T),v={};return v.getMode=function(){return E},v.getLength=function(_){return~~(C.length/2)},v.write=function(_){for(var S=C,b=0;b+1<S.length;){var D=(255&S[b])<<8|255&S[b+1];if(33088<=D&&D<=40956)D-=33088;else if(57408<=D&&D<=60351)D-=49472;else throw"illegal char at "+(b+1)+"/"+D;D=(D>>>8&255)*192+(D&255),_.put(D,13),b+=2}if(b<S.length)throw"illegal char at "+(b+1)},v},g=function(){var T=[],E={};return E.writeByte=function(A){T.push(A&255)},E.writeShort=function(A){E.writeByte(A),E.writeByte(A>>>8)},E.writeBytes=function(A,C,v){C=C||0,v=v||A.length;for(var _=0;_<v;_+=1)E.writeByte(A[_+C])},E.writeString=function(A){for(var C=0;C<A.length;C+=1)E.writeByte(A.charCodeAt(C))},E.toByteArray=function(){return T},E.toString=function(){var A="";A+="[";for(var C=0;C<T.length;C+=1)C>0&&(A+=","),A+=T[C];return A+="]",A},E},p=function(){var T=0,E=0,A=0,C="",v={},_=function(b){C+=String.fromCharCode(S(b&63))},S=function(b){if(!(b<0)){if(b<26)return 65+b;if(b<52)return 97+(b-26);if(b<62)return 48+(b-52);if(b==62)return 43;if(b==63)return 47}throw"n:"+b};return v.writeByte=function(b){for(T=T<<8|b&255,E+=8,A+=1;E>=6;)_(T>>>E-6),E-=6},v.flush=function(){if(E>0&&(_(T<<6-E),T=0,E=0),A%3!=0)for(var b=3-A%3,D=0;D<b;D+=1)C+="="},v.toString=function(){return C},v},w=function(T){var E=T,A=0,C=0,v=0,_={};_.read=function(){for(;v<8;){if(A>=E.length){if(v==0)return-1;throw"unexpected end of file./"+v}var b=E.charAt(A);if(A+=1,b=="=")return v=0,-1;if(b.match(/^\s$/))continue;C=C<<6|S(b.charCodeAt(0)),v+=6}var D=C>>>v-8&255;return v-=8,D};var S=function(b){if(65<=b&&b<=90)return b-65;if(97<=b&&b<=122)return b-97+26;if(48<=b&&b<=57)return b-48+52;if(b==43)return 62;if(b==47)return 63;throw"c:"+b};return _},y=function(T,E){var A=T,C=E,v=new Array(T*E),_={};_.setPixel=function(U,N,H){v[N*A+U]=H},_.write=function(U){U.writeString("GIF87a"),U.writeShort(A),U.writeShort(C),U.writeByte(128),U.writeByte(0),U.writeByte(0),U.writeByte(0),U.writeByte(0),U.writeByte(0),U.writeByte(255),U.writeByte(255),U.writeByte(255),U.writeString(","),U.writeShort(0),U.writeShort(0),U.writeShort(A),U.writeShort(C),U.writeByte(0);var N=2,H=b(N);U.writeByte(N);for(var Z=0;H.length-Z>255;)U.writeByte(255),U.writeBytes(H,Z,255),Z+=255;U.writeByte(H.length-Z),U.writeBytes(H,Z,H.length-Z),U.writeByte(0),U.writeString(";")};var S=function(U){var N=U,H=0,Z=0,V={};return V.write=function(rt,ht){if(rt>>>ht)throw"length over";for(;H+ht>=8;)N.writeByte(255&(rt<<H|Z)),ht-=8-H,rt>>>=8-H,Z=0,H=0;Z=rt<<H|Z,H=H+ht},V.flush=function(){H>0&&N.writeByte(Z)},V},b=function(U){for(var N=1<<U,H=(1<<U)+1,Z=U+1,V=D(),rt=0;rt<N;rt+=1)V.add(String.fromCharCode(rt));V.add(String.fromCharCode(N)),V.add(String.fromCharCode(H));var ht=g(),dt=S(ht);dt.write(N,Z);var mt=0,Et=String.fromCharCode(v[mt]);for(mt+=1;mt<v.length;){var Ft=String.fromCharCode(v[mt]);mt+=1,V.contains(Et+Ft)?Et=Et+Ft:(dt.write(V.indexOf(Et),Z),V.size()<4095&&(V.size()==1<<Z&&(Z+=1),V.add(Et+Ft)),Et=Ft)}return dt.write(V.indexOf(Et),Z),dt.write(H,Z),dt.flush(),ht.toByteArray()},D=function(){var U={},N=0,H={};return H.add=function(Z){if(H.contains(Z))throw"dup key:"+Z;U[Z]=N,N+=1},H.size=function(){return N},H.indexOf=function(Z){return U[Z]},H.contains=function(Z){return typeof U[Z]<"u"},H};return _},M=function(T,E,A){for(var C=y(T,E),v=0;v<E;v+=1)for(var _=0;_<T;_+=1)C.setPixel(_,v,A(_,v));var S=g();C.write(S);for(var b=p(),D=S.toByteArray(),U=0;U<D.length;U+=1)b.writeByte(D[U]);return b.flush(),"data:image/gif;base64,"+b};return n})();(function(){e.stringToBytesFuncs["UTF-8"]=function(n){function r(s){for(var a=[],o=0;o<s.length;o++){var c=s.charCodeAt(o);c<128?a.push(c):c<2048?a.push(192|c>>6,128|c&63):c<55296||c>=57344?a.push(224|c>>12,128|c>>6&63,128|c&63):(o++,c=65536+((c&1023)<<10|s.charCodeAt(o)&1023),a.push(240|c>>18,128|c>>12&63,128|c>>6&63,128|c&63))}return a}return r(n)}})(),(function(n){i.exports=n()})(function(){return e})})(so)),so.exports}var Fx=Nx();const Ox=Ux(Fx);function Jr(){return location.origin+location.pathname.replace(/index\.html$/,"")}function Bx(i){const t=Ox(0,"M");return t.addData(i),t.make(),t.createSvgTag({cellSize:8,margin:2,scalable:!0})}async function kx(i,t){const e=new File([i],t,{type:i.type});if(navigator.canShare?.({files:[e]}))try{return await navigator.share({files:[e],title:"costuma 2026"}),"shared"}catch(r){if(r.name==="AbortError")return"cancelled"}return Ju(i,t),"saved"}function Ju(i,t){const e=document.createElement("a");e.href=URL.createObjectURL(i),e.download=t,document.body.appendChild(e),e.click(),e.remove(),setTimeout(()=>URL.revokeObjectURL(e.href),3e4)}function zx(){const i=window.MediaRecorder;if(i)return["video/mp4;codecs=avc1","video/mp4","video/webm;codecs=vp9","video/webm;codecs=vp8","video/webm"].find(t=>i.isTypeSupported(t))}const ee=i=>document.getElementById(i),Hx="./",mi=new URLSearchParams(location.search),Cc=mi.get("test")==="1",Fi=Number(mi.get("synth")??0),Jt=Dx();mi.get("c")&&(Jt.costume=mi.get("c"));an.some(i=>i.id===Jt.costume)||(Jt.costume=an[0].id);mi.get("people")&&(Jt.people=Number(mi.get("people")));const sa=()=>Ix(Jt),ze=ee("video"),ls=ee("stage"),ur=ee("overlay"),Ie=ur.getContext("2d"),ce=new Px(ls);ce.opts.size=Jt.size;ce.opts.shadows=Jt.shadows;ce.opts.envLight=Jt.envLight;const ga=new mf(ze,mi.get("facing")??void 0);let Kn=null;const Pn=new Ef;let ds=!1;const va=new Map,ua=new Map;let Ku=0;function fa(i){const t=va.get(i);if(t)return t;if(Jt.mode==="one")return Jt.costume;let e=ua.get(i);if(!e){const n=an.findIndex(r=>r.id===Jt.costume);e=an[(n+Ku++)%an.length].id,ua.set(i,e)}return e}const ao=new Set;function Lc(i,t=!1){ce.hasTemplate(i)||ao.has(i)||(ao.add(i),t||Fe(`Dressing up as ${Gi(i).name}…`,1800),requestAnimationFrame(()=>setTimeout(()=>{try{ce.template(i)}catch(e){console.error("build failed",i,e),Fe(`${Gi(i).name} failed to build`)}ao.delete(i)},20)))}let Th=0;function Fe(i,t=1400){const e=ee("toast");e.textContent=i,e.classList.add("on"),clearTimeout(Th),Th=window.setTimeout(()=>e.classList.remove("on"),t)}const Vx=i=>{const t=ee("hint");t.textContent=i,t.classList.toggle("on",!!i)},ju=i=>`${Hx}thumbs/${i}.png`;function Gx(){const i=ee("picker");i.innerHTML="";const t=(e,n,r="")=>{const s=document.createElement("button");s.className=`card ${r}`,s.dataset.id=e,s.setAttribute("role","option"),s.innerHTML='<div class="thumb"></div><div class="name"></div>',s.querySelector(".name").textContent=n;const a=s.querySelector(".thumb");if(e==="mix")a.textContent="MIX";else{const o=new Image;o.alt="",o.onerror=()=>{o.remove(),a.textContent=n.slice(0,1)},o.src=ju(e),a.appendChild(o)}s.onclick=()=>Qu(e),i.appendChild(s)};t("mix","Mix","mix");for(const e of an)t(e.id,e.name);Pc()}function Pc(){for(const i of ee("picker").querySelectorAll(".card")){const t=Jt.mode==="mix"?i.dataset.id==="mix":i.dataset.id===Jt.costume;i.classList.toggle("on",t),i.setAttribute("aria-selected",String(t)),t&&i.scrollIntoView({behavior:"smooth",inline:"center",block:"nearest"})}}function Qu(i){va.clear(),i==="mix"?(Jt.mode="mix",ua.clear(),Ku=0,Fe("Mix: everyone gets their own")):(Jt.mode="one",Jt.costume=i,Lc(i),ce.hasTemplate(i)&&Fe(Gi(i).name,900)),sa(),Pc()}function Dc(i){ee(i).classList.remove("hidden")}for(const i of document.querySelectorAll(".modal"))i.addEventListener("click",t=>{(t.target===i||t.target.closest("[data-close]"))&&i.classList.add("hidden")});function Ah(){const i=Jr();ee("qr-code").innerHTML=Bx(i),ee("qr-url").textContent=i,Dc("qr")}ee("btn-copy").onclick=async()=>{try{await navigator.clipboard.writeText(Jr()),Fe("Link copied")}catch{Fe("Could not copy — long-press the link")}};ee("btn-share-link").onclick=async()=>{if(navigator.share)try{await navigator.share({title:"costuma 2026",text:"Be a 3D costume:",url:Jr()})}catch{}else try{await navigator.clipboard.writeText(Jr()),Fe("Link copied")}catch{Fe(Jr())}};function Wx(){const i=ee("settings-body");i.innerHTML="";const t=(s,a,o)=>{const c=document.createElement("div");c.className="set";const l=document.createElement("label"),h=document.createElement("span");if(h.textContent=s,a){const u=document.createElement("small");u.textContent=a,h.appendChild(u)}l.append(h,o),c.appendChild(l),i.appendChild(c)},e=(s,a,o)=>{const c=document.createElement("div");c.className="seg";for(const[l,h]of s){const u=document.createElement("button");u.textContent=h,u.classList.toggle("on",a()===l),u.onclick=()=>{o(l),sa();for(const d of c.children)d.classList.remove("on");u.classList.add("on")},c.appendChild(u)}return c},n=(s,a)=>{const o=document.createElement("input");return o.type="checkbox",o.className="switch",o.checked=s(),o.onchange=()=>{a(o.checked),sa()},o},r=(s,a,o,c,l)=>{const h=document.createElement("input");return h.type="range",h.min=String(s),h.max=String(a),h.step=String(o),h.value=String(c()),h.oninput=()=>{l(Number(h.value)),sa()},h};t("People","How many to dress at once",e([[1,"1"],[2,"2"],[3,"3"],[4,"4"]],()=>Jt.people,s=>{Jt.people=s,Kn?.setOptions({numPoses:s})})),t("Costume size","Bigger hides more of the person",r(.8,1.5,.01,()=>Jt.size,s=>{Jt.size=s,ce.opts.size=s})),t("Pose model","Accurate is steadier, slower to load and run",e([["lite","Fast"],["full","Accurate"]],()=>Jt.model,s=>{Jt.model=s,$x()})),t("Light from the camera","The costume is lit by the room it stands in",n(()=>Jt.envLight,s=>{Jt.envLight=s,ce.opts.envLight=s})),t("Shadows","Off is faster on older phones",n(()=>Jt.shadows,s=>{Jt.shadows=s,ce.opts.shadows=s})),t("Lens","If costumes look too flat or too deep",r(.55,1.3,.01,()=>Jt.lens,s=>{Jt.lens=s})),t("Show the skeleton","What the pose tracker sees",n(()=>Jt.debug,s=>{Jt.debug=s}))}let ic=!1,Oi=null;function tf(i,t){Oi={blob:i,name:t};const e=ee("preview-media");e.innerHTML="";const n=URL.createObjectURL(i);if(i.type.startsWith("video")){const r=document.createElement("video");r.src=n,r.controls=!0,r.playsInline=!0,r.loop=!0,r.muted=!0,r.play().catch(()=>{}),e.appendChild(r)}else{const r=new Image;r.src=n,e.appendChild(r)}Dc("preview")}ee("btn-share").onclick=async()=>{Oi&&await kx(Oi.blob,Oi.name)==="saved"&&Fe("Saved")};ee("btn-save").onclick=()=>{Oi&&(Ju(Oi.blob,Oi.name),Fe("Saved"))};const ef=()=>new Date().toISOString().slice(0,19).replace(/[:T]/g,"-");let Js=null,Rh=0;function Xx(){const i=ee("btn-rec");if(Js){Js.stop();return}const t=zx(),e=ls.captureStream;if(!t||!e){Fe("Recording is not supported in this browser");return}const n=[],r=new MediaRecorder(e.call(ls,30),{mimeType:t,videoBitsPerSecond:6e6});r.ondataavailable=s=>{s.data.size&&n.push(s.data)},r.onstop=()=>{clearTimeout(Rh),Js=null,i.classList.remove("on"),i.innerHTML=Li.rec;const s=t.split(";")[0];tf(new Blob(n,{type:s}),`costuma-${ef()}.${s.includes("mp4")?"mp4":"webm"}`)},r.start(250),Js=r,i.classList.add("on"),i.innerHTML=Li.stop,Rh=window.setTimeout(()=>r.state==="recording"&&r.stop(),2e4),Fe("Recording — tap to stop",1200)}function nf(i){const t=ce.cover,e=i.image,n=(e[q.shL].x+e[q.shR].x+e[q.hipL].x+e[q.hipR].x)/4,r=(e[q.shL].y+e[q.shR].y+e[q.hipL].y+e[q.hipR].y)/4;let s=(n*t.vw-t.ox)*t.s;const a=(r*t.vh-t.oy)*t.s;return t.mirror&&(s=t.cw-s),{x:s,y:a}}ls.addEventListener("click",i=>{if(!ds)return;let t=null,e=1/0;for(const a of Pn.tracks){if(a.lost)continue;const o=nf(a),c=Math.hypot(o.x-i.clientX,o.y-i.clientY);c<e&&(e=c,t=a)}if(!t||e>Math.max(innerWidth,innerHeight)*.3)return;const n=fa(t.id),r=an.findIndex(a=>a.id===n),s=an[(r+1)%an.length].id;va.set(t.id,s),Lc(s),Fe(Gi(s).name,900)});let rc=0,Ch=-1,sc=0,ac=performance.now(),Ic=0,oo=performance.now(),co=0;function rf(){return Sf(ze.videoWidth||720,ze.videoHeight||1280,Jt.lens)}function sf(i){if(requestAnimationFrame(sf),!ds)return;rc++;const t=rf();ce.layout(t,ga.mirrored&&!Fi);let e=null;if(Fi)e=Iv(Fi,(i-ac)/1e3*(Cc?0:1)+Number(mi.get("t")??0),t);else if(Kn&&ze.readyState>=2&&ze.currentTime!==Ch){Ch=ze.currentTime;try{e=Kn.detect(ze,i)}catch(s){console.error(s)}}e&&Pn.update(e.slice(0,Jt.people),i,t);for(const s of Pn.tracks)Lc(fa(s.id),!0);const n=(i-ac)/1e3;ce.sync(Pn.tracks,fa,n),ce.render(ze,t,rc),ic&&(ic=!1,ls.toBlob(s=>s&&tf(s,`costuma-${ef()}.jpg`),"image/jpeg",.92)),Pn.tracks.filter(s=>!s.lost).length&&(sc=i),Vx(i-sc>2500?"Step back until your head and hips are in view":""),Yx(),co++,i-oo>1e3&&(Ic=co*1e3/(i-oo),co=0,oo=i,af(),qx())}let Ks=0,Lh=!1;function qx(){if(!(Cc||!ds||Pn.tracks.length===0)&&(Ks=Ic<22?Ks+1:0,!(Ks<3))){if(Ks=0,ce.opts.pixelRatio>1.01)ce.opts.pixelRatio=Math.max(1,ce.opts.pixelRatio-.25);else if(ce.opts.shadows)ce.opts.shadows=!1;else return;Lh||(Lh=!0,Fe("Lowering quality to keep up",1500))}}function Yx(){const i=ur.clientWidth,t=ur.clientHeight,e=Math.min(devicePixelRatio||1,2);if(ur.width!==Math.round(i*e)&&(ur.width=Math.round(i*e),ur.height=Math.round(t*e)),Ie.setTransform(e,0,0,e,0,0),Ie.clearRect(0,0,i,t),!Jt.debug)return;const n=ce.cover,r=s=>{let a=(s.x*n.vw-n.ox)*n.s;return n.mirror&&(a=n.cw-a),[a,(s.y*n.vh-n.oy)*n.s]};for(const s of Pn.tracks){Ie.globalAlpha=s.presence,Ie.strokeStyle="#7dfcff",Ie.lineWidth=3;for(const[o,c]of Mf){const l=s.image[o],h=s.image[c];if(Math.min(l.v,h.v)<.4)continue;const[u,d]=r(l),[f,m]=r(h);Ie.beginPath(),Ie.moveTo(u,d),Ie.lineTo(f,m),Ie.stroke()}Ie.fillStyle="#ff8a1f";for(const o of s.image){if(o.v<.4)continue;const[c,l]=r(o);Ie.beginPath(),Ie.arc(c,l,4,0,Math.PI*2),Ie.fill()}const a=nf(s);Ie.fillStyle="#fff",Ie.font="600 14px system-ui",Ie.fillText(`#${s.id} ${Gi(fa(s.id)).name} · ${(-s.T.z).toFixed(1)} m`,a.x-40,a.y)}Ie.globalAlpha=1}function af(){const i=ee("readout");if(!i||ee("settings").classList.contains("hidden"))return;const t=rf();i.textContent=["build 8dc7ffb · 2026-10-31 18:24Z",`${Ic.toFixed(0)} fps · pose ${Kn?.inferMs.toFixed(1)??"–"} ms (${Kn?.delegate??"–"}, ${Jt.model})`,`video ${ze.videoWidth}×${ze.videoHeight} · f ${t.f.toFixed(0)} px · ${ga.facing}`,`people ${Pn.tracks.filter(e=>!e.lost).length} · dressed ${ce.count}`,`pixels ×${ce.opts.pixelRatio.toFixed(2)} · shadows ${ce.opts.shadows?"on":"off"}`,`light mean ${ce.light.mean.toFixed(3)} × ${ce.light.gain.toFixed(2)} · key share ${ce.light.share.toFixed(2)} · every ${dn.every} frames`].join(`
`)}async function $x(){if(Fi)return;const i=Kn,t=new Ph(Jt.model,Jt.people);await t.load(e=>Fe(e,2500)),Kn=t,i?.close(),Fe(Jt.model==="full"?"Accurate pose model":"Fast pose model",1e3)}function Zx(){const i=document.createElement("canvas");i.width=720,i.height=1280;const t=i.getContext("2d"),e=()=>{const n=t.createLinearGradient(0,0,0,1280);n.addColorStop(0,"#5a4a63"),n.addColorStop(.62,"#3b3142"),n.addColorStop(.63,"#6b5440"),n.addColorStop(1,"#3a2c22"),t.fillStyle=n,t.fillRect(0,0,720,1280),t.fillStyle="#fff3d6",t.fillRect(40,220,170,330),t.fillStyle="#ffb35a",t.beginPath(),t.arc(600,180,46,0,Math.PI*2),t.fill()};return e(),setInterval(e,500),i.captureStream(30)}async function lo(){const i=ee("start-status"),t=ee("btn-start");t.disabled=!0;try{if(Fi)ze.srcObject=Zx(),await ze.play().catch(()=>{}),ze.readyState<2&&await new Promise(e=>ze.addEventListener("loadeddata",e,{once:!0}));else{if(!navigator.mediaDevices?.getUserMedia)throw new Error(location.protocol!=="https:"?"The camera needs an https:// page.":"This browser has no camera access.");i.textContent="Asking for the camera…",await ga.open(),i.textContent="Loading the pose model…",Kn=new Ph(Jt.model,Jt.people),await Kn.load(e=>{i.textContent=e[0].toUpperCase()+e.slice(1)+"…"})}ce.setVideo(ze),i.textContent=`Dressing up as ${Gi(Jt.costume).name}…`,await new Promise(e=>setTimeout(e,30)),ce.template(Jt.mode==="one"?Jt.costume:an[0].id),ee("start").classList.add("hidden"),ee("hud").classList.remove("hidden"),ds=!0,ac=performance.now(),sc=performance.now(),Pc()}catch(e){console.error(e);const n=e;i.textContent=n.name==="NotAllowedError"?"Camera permission was refused. Allow it in the browser settings and try again.":`Could not start: ${n.message}`,t.disabled=!1}}function Jx(){ee("btn-qr").innerHTML=Li.qr,ee("btn-flip").innerHTML=Li.flip,ee("btn-gear").innerHTML=Li.gear,ee("btn-snap").innerHTML=Li.camera,ee("btn-rec").innerHTML=Li.rec,ee("btn-start").onclick=()=>void lo(),ee("btn-start-qr").onclick=Ah,ee("btn-qr").onclick=Ah,ee("btn-gear").onclick=()=>{Wx(),Dc("settings"),af()},ee("btn-flip").onclick=async()=>{if(!Fi)try{await ga.flip(),ce.setVideo(ze),Pn.clear(),va.clear(),ua.clear()}catch(e){Fe(`Camera: ${e.message}`)}},ee("btn-snap").onclick=()=>{ic=!0;const e=ee("stage");e.style.filter="brightness(1.8)",setTimeout(()=>e.style.filter="",120)},ee("btn-rec").onclick=Xx;const i=ee("start-cast");for(const e of an.slice(0,6)){const n=new Image;n.src=ju(e.id),n.alt=e.name,n.onerror=()=>n.remove(),i.appendChild(n)}Gx(),requestAnimationFrame(sf);const t=window;t.__costuma={stage:ce,tracker:Pn,settings:Jt,start:lo,choose:Qu,get started(){return ds},get frame(){return rc},LIGHT_TUNE:dn},Cc&&Fi&&lo()}Jx();
