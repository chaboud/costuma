(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))n(r);new MutationObserver(r=>{for(const s of r)if(s.type==="childList")for(const a of s.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&n(a)}).observe(document,{childList:!0,subtree:!0});function e(r){const s={};return r.integrity&&(s.integrity=r.integrity),r.referrerPolicy&&(s.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?s.credentials="include":r.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function n(r){if(r.ep)return;r.ep=!0;const s=e(r);fetch(r.href,s)}})();const Nd=()=>/iPad|iPhone|iPod/.test(navigator.userAgent)||navigator.platform==="MacIntel"&&navigator.maxTouchPoints>1,Fd=()=>Nd()||/Android|Mobile/i.test(navigator.userAgent);let Od=class{constructor(t,e){this.video=t,this.facing=e??(Fd()?"environment":"user"),t.muted=!0,t.playsInline=!0,t.autoplay=!0,t.setAttribute("playsinline",""),t.setAttribute("muted","")}stream=null;facing;async open(t=this.facing){const e=!!this.stream;this.stop(),e&&await new Promise(r=>setTimeout(r,100));const n={facingMode:t,width:{ideal:1280},height:{ideal:720},frameRate:{ideal:30}};this.stream=await navigator.mediaDevices.getUserMedia({audio:!1,video:n}),this.facing=t,this.video.srcObject=this.stream,await this.video.play().catch(()=>{}),this.video.readyState<2&&await new Promise(r=>this.video.addEventListener("loadeddata",()=>r(),{once:!0}))}async flip(){await this.open(this.facing==="user"?"environment":"user")}get mirrored(){return this.facing==="user"}stop(){if(this.stream){for(const t of this.stream.getTracks())t.stop();this.video.srcObject=null,this.stream=null}}};const Bd="modulepreload",kd=function(i,t){return new URL(i,t).href},Xl={},$u=function(t,e,n){let r=Promise.resolve();if(e&&e.length>0){let a=function(h){return Promise.all(h.map(u=>Promise.resolve(u).then(d=>({status:"fulfilled",value:d}),d=>({status:"rejected",reason:d}))))};const o=document.getElementsByTagName("link"),c=document.querySelector("meta[property=csp-nonce]"),l=c?.nonce||c?.getAttribute("nonce");r=a(e.map(h=>{if(h=kd(h,n),h in Xl)return;Xl[h]=!0;const u=h.endsWith(".css"),d=u?'[rel="stylesheet"]':"";if(!!n)for(let v=o.length-1;v>=0;v--){const m=o[v];if(m.href===h&&(!u||m.rel==="stylesheet"))return}else if(document.querySelector(`link[href="${h}"]${d}`))return;const g=document.createElement("link");if(g.rel=u?"stylesheet":Bd,u||(g.as="script"),g.crossOrigin="",g.href=h,l&&g.setAttribute("nonce",l),document.head.appendChild(g),u)return new Promise((v,m)=>{g.addEventListener("load",v),g.addEventListener("error",()=>m(new Error(`Unable to preload CSS for ${h}`)))})}))}function s(a){const o=new Event("vite:preloadError",{cancelable:!0});if(o.payload=a,window.dispatchEvent(o),!o.defaultPrevented)throw a}return r.then(a=>{for(const o of a||[])o.status==="rejected"&&s(o.reason);return t().catch(s)})},B={nose:0,eyeInL:1,eyeL:2,eyeOutL:3,eyeInR:4,eyeR:5,eyeOutR:6,earL:7,earR:8,mouthL:9,mouthR:10,shL:11,shR:12,elL:13,elR:14,wrL:15,wrR:16,pinkyL:17,pinkyR:18,indexL:19,indexR:20,thumbL:21,thumbR:22,hipL:23,hipR:24,knL:25,knR:26,anL:27,anR:28,heelL:29,heelR:30,toeL:31,toeR:32},ic=33;function Hd(i){return{x:i.x,y:-i.y,z:-i.z,v:i.visibility??1}}const zd=[[B.shL,B.shR],[B.shL,B.elL],[B.elL,B.wrL],[B.shR,B.elR],[B.elR,B.wrR],[B.shL,B.hipL],[B.shR,B.hipR],[B.hipL,B.hipR],[B.hipL,B.knL],[B.knL,B.anL],[B.hipR,B.knR],[B.knR,B.anR],[B.anL,B.toeL],[B.anR,B.toeR],[B.earL,B.eyeL],[B.eyeL,B.nose],[B.nose,B.eyeR],[B.eyeR,B.earR]];class ju{constructor(t,e){this.model=t,this.numPoses=e}lm=null;lastTs=-1;delegate="GPU";inferMs=0;masks=!1;async load(t){t?.("loading the pose engine");const n=await $u(()=>import("./vision_bundle-Bk4VIwNi.js"),[],import.meta.url),r=await n.FilesetResolver.forVisionTasks("./mediapipe"),s=a=>n.PoseLandmarker.createFromOptions(r,{baseOptions:{modelAssetPath:`./models/pose_landmarker_${this.model}.task`,delegate:a},runningMode:"VIDEO",numPoses:this.numPoses,minPoseDetectionConfidence:.5,minPosePresenceConfidence:.5,minTrackingConfidence:.5,outputSegmentationMasks:this.masks});t?.(`loading the ${this.model} pose model`);try{this.lm=await s("GPU"),this.delegate="GPU"}catch(a){console.warn("GPU delegate failed, using CPU",a),this.lm=await s("CPU"),this.delegate="CPU"}}async setOptions(t){t.numPoses&&(this.numPoses=t.numPoses,await this.lm?.setOptions({numPoses:t.numPoses})),t.masks!==void 0&&t.masks!==this.masks&&(this.masks=t.masks,await this.lm?.setOptions({outputSegmentationMasks:t.masks}))}detect(t,e){if(!this.lm)return[];e<=this.lastTs&&(e=this.lastTs+1),this.lastTs=e;const n=performance.now(),r=this.lm.detectForVideo(t,e);this.inferMs=performance.now()-n;const s=[];for(let a=0;a<r.landmarks.length;a++){const o=r.landmarks[a],c=r.worldLandmarks[a];if(!c)continue;const l=r.segmentationMasks?.[a];s.push({image:o.map(h=>({x:h.x,y:h.y,z:h.z,v:h.visibility??1})),world:c.map(Hd),mask:l?{data:l.getAsFloat32Array().slice(),w:l.width,h:l.height}:void 0})}return r.close(),s}close(){this.lm?.close(),this.lm=null}}function Vd(i,t,e=.85){return{f:e*Math.max(i,t),cx:i/2,cy:t/2,w:i,h:t}}function Gd(i,t,e,n=.5){let r=0,s=0,a=0,o=0,c=0,l=0,h=0,u=0,d=0;for(let b=0;b<i.length&&b<t.length;b++){const y=i[b],_=t[b],E=Math.min(y.v,_.v);if(E<n)continue;const w=(_.x*e.w-e.cx)/e.f,A=(e.cy-_.y*e.h)/e.f,R=-w*y.z-y.x,x=-A*y.z-y.y;r+=E,s+=E*w,c+=E*w*w,l+=E*R,u+=E*w*R,a+=E,o+=E*A,c+=E*A*A,h+=E*x,u+=E*A*x,d++}if(d<4)return null;const f=c-s*s/r-o*o/a,g=u-s*l/r-o*h/a;if(Math.abs(f)<1e-9)return null;const v=g/f,m=(l-s*v)/r,p=(h-o*v)/a;return!(v<-.2)||!isFinite(m)||!isFinite(p)?null:{x:m,y:p,z:v}}function is(i,t){const e=-i.z;return{x:(t.cx+t.f*i.x/e)/t.w,y:(t.cy-t.f*i.y/e)/t.h}}const Js=(i,t)=>({x:(i.x+t.x)/2,y:(i.y+t.y)/2,z:(i.z+t.z)/2,v:Math.min(i.v,t.v)}),Xn=(i,t)=>Math.hypot(i.x-t.x,i.y-t.y,i.z-t.z);function ql(i){const t=Xn(Js(i[B.shL],i[B.shR]),Js(i[B.hipL],i[B.hipR])),e=(Xn(i[B.shL],i[B.elL])+Xn(i[B.shR],i[B.elR]))/2,n=(Xn(i[B.elL],i[B.wrL])+Xn(i[B.elR],i[B.wrR]))/2,r=(Xn(i[B.hipL],i[B.knL])+Xn(i[B.hipR],i[B.knR]))/2,s=(Xn(i[B.knL],i[B.anL])+Xn(i[B.knR],i[B.anR]))/2,a=Xn(Js(i[B.shL],i[B.shR]),Js(i[B.earL],i[B.earR]));return{torso:t,upperArm:e,forearm:n,thigh:r,shin:s,neck:a}}const Un={tauWorld:.045,tauImage:.035,tauXY:.05,tauZ:.14,tauLen:1.5,tauVis:.25,tauCore:.09,fadeIn:.22,fadeOut:.35,forgetAfter:.6,matchRadius:1.3},Yl=i=>{const t=[B.shL,B.shR,B.hipL,B.hipR];let e=0,n=0,r=0;for(const c of t){const l=i[c];e+=l.x,n+=l.y,r++}e/=r,n/=r;const s=(i[B.shL].x+i[B.shR].x)/2-(i[B.hipL].x+i[B.hipR].x)/2,a=(i[B.shL].y+i[B.shR].y)/2-(i[B.hipL].y+i[B.hipR].y)/2,o=Math.hypot(i[B.shL].x-i[B.shR].x,i[B.shL].y-i[B.shR].y);return{x:e,y:n,s:Math.max(Math.hypot(s,a),o,.04)}},Fi=(i,t,e)=>i+(t-i)*e,Ki=(i,t)=>1-Math.exp(-i/Math.max(t,1e-4)),Wd=new Set([0,1,2,3,4,5,6,7,8,9,10,B.shL,B.shR,B.hipL,B.hipR]);function $l(i,t,e,n,r=e){for(let s=0;s<ic;s++){const a=i[s],o=t[s],c=Wd.has(s)?r:e;a.x=Fi(a.x,o.x,c),a.y=Fi(a.y,o.y,c),a.z=Fi(a.z,o.z,c),a.v=Fi(a.v,o.v,n)}}const jl=i=>i.map(t=>({...t}));class Xd{tracks=[];nextId=1;last=-1;update(t,e,n){const r=this.last<0?.03333333333333333:Math.min(.25,Math.max(.001,(e-this.last)/1e3));this.last=e;const s=t.map(h=>({d:h,T:Gd(h.world,h.image,n),c:Yl(h.image)})).filter(h=>h.T),a=this.tracks.filter(h=>!h.lost||h.presence>0),o=[];a.forEach((h,u)=>{const d=Yl(h.image);s.forEach((f,g)=>{const v=Math.hypot(d.x-f.c.x,d.y-f.c.y)/d.s;v<Un.matchRadius&&o.push({ti:u,di:g,cost:v})})}),o.sort((h,u)=>h.cost-u.cost);const c=new Set,l=new Set;for(const h of o){if(c.has(h.ti)||l.has(h.di))continue;c.add(h.ti),l.add(h.di);const u=a[h.ti],d=s[h.di],f=u.lost,g=f?1:Ki(r,Un.tauVis);$l(u.world,d.d.world,f?1:Ki(r,Un.tauWorld),g,f?1:Ki(r,Un.tauCore)),$l(u.image,d.d.image,f?1:Ki(r,Un.tauImage),g);const v=f?1:Ki(r,Un.tauXY),m=f?1:Ki(r,Un.tauZ);u.T={x:Fi(u.T.x,d.T.x,v),y:Fi(u.T.y,d.T.y,v),z:Fi(u.T.z,d.T.z,m)};const p=ql(u.world),b=Ki(r,Un.tauLen);for(const y of Object.keys(p))u.len[y]=Fi(u.len[y],p[y],b);u.seen=e,u.lost=!1,u.det=d.d}s.forEach((h,u)=>{if(l.has(u))return;const d=jl(h.d.world);this.tracks.push({id:this.nextId++,born:e,seen:e,image:jl(h.d.image),world:d,T:{...h.T},len:ql(d),presence:0,lost:!1,det:h.d})});for(const h of this.tracks)h.seen!==e&&(h.lost=!0,h.det=null),h.presence=h.lost?Math.max(0,h.presence-r/Un.fadeOut):Math.min(1,h.presence+r/Un.fadeIn);return this.tracks=this.tracks.filter(h=>!(h.lost&&h.presence<=0&&e-h.seen>Un.forgetAfter*1e3)),this.tracks}clear(){this.tracks=[],this.last=-1}}/**
 * @license
 * Copyright 2010-2025 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const ol="180",qd=0,Kl=1,Yd=2,Ku=1,Zu=2,hi=3,Xi=0,dn=1,qe=2,Vi=0,Kr=1,rc=2,Zl=3,Jl=4,Ju=5,ar=100,$d=101,jd=102,Kd=103,Zd=104,Qu=200,Jd=201,tf=202,Qd=203,sc=204,ac=205,t0=206,e0=207,n0=208,i0=209,r0=210,s0=211,a0=212,o0=213,c0=214,oc=0,cc=1,lc=2,rs=3,hc=4,uc=5,fc=6,dc=7,ef=0,l0=1,h0=2,Gi=0,u0=1,f0=2,d0=3,p0=4,m0=5,g0=6,nf=7,Ql="attached",v0="detached",rf=300,ss=301,as=302,Wa=303,pc=304,to=306,os=1e3,cr=1001,mc=1002,yn=1003,x0=1004,Qs=1005,ge=1006,oo=1007,Oi=1008,Gn=1009,sf=1010,af=1011,Is=1012,cl=1013,pr=1014,ti=1015,xr=1016,ll=1017,hl=1018,Us=1020,of=35902,cf=35899,lf=1021,hf=1022,Ve=1023,Ns=1026,Fs=1027,uf=1028,ul=1029,ff=1030,fl=1031,dl=1033,Oa=33776,Ba=33777,ka=33778,Ha=33779,gc=35840,vc=35841,xc=35842,_c=35843,Mc=36196,bc=37492,yc=37496,Sc=37808,wc=37809,Ec=37810,Tc=37811,Ac=37812,Rc=37813,Cc=37814,Lc=37815,Pc=37816,Dc=37817,Ic=37818,Uc=37819,Nc=37820,Fc=37821,Oc=36492,Bc=36494,kc=36495,Hc=36283,zc=36284,Vc=36285,Gc=36286,_0=3200,M0=3201,df=0,b0=1,Qn="",un="srgb",mr="srgb-linear",Xa="linear",he="srgb",wr=7680,th=519,y0=512,S0=513,w0=514,pf=515,E0=516,T0=517,A0=518,R0=519,eh=35044,ta=35048,nh="300 es",ei=2e3,qa=2001;class ds{addEventListener(t,e){this._listeners===void 0&&(this._listeners={});const n=this._listeners;n[t]===void 0&&(n[t]=[]),n[t].indexOf(e)===-1&&n[t].push(e)}hasEventListener(t,e){const n=this._listeners;return n===void 0?!1:n[t]!==void 0&&n[t].indexOf(e)!==-1}removeEventListener(t,e){const n=this._listeners;if(n===void 0)return;const r=n[t];if(r!==void 0){const s=r.indexOf(e);s!==-1&&r.splice(s,1)}}dispatchEvent(t){const e=this._listeners;if(e===void 0)return;const n=e[t.type];if(n!==void 0){t.target=this;const r=n.slice(0);for(let s=0,a=r.length;s<a;s++)r[s].call(this,t);t.target=null}}}const We=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];let ih=1234567;const Rs=Math.PI/180,cs=180/Math.PI;function _r(){const i=Math.random()*4294967295|0,t=Math.random()*4294967295|0,e=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(We[i&255]+We[i>>8&255]+We[i>>16&255]+We[i>>24&255]+"-"+We[t&255]+We[t>>8&255]+"-"+We[t>>16&15|64]+We[t>>24&255]+"-"+We[e&63|128]+We[e>>8&255]+"-"+We[e>>16&255]+We[e>>24&255]+We[n&255]+We[n>>8&255]+We[n>>16&255]+We[n>>24&255]).toLowerCase()}function te(i,t,e){return Math.max(t,Math.min(e,i))}function pl(i,t){return(i%t+t)%t}function C0(i,t,e,n,r){return n+(i-t)*(r-n)/(e-t)}function L0(i,t,e){return i!==t?(e-i)/(t-i):0}function Cs(i,t,e){return(1-e)*i+e*t}function P0(i,t,e,n){return Cs(i,t,1-Math.exp(-e*n))}function D0(i,t=1){return t-Math.abs(pl(i,t*2)-t)}function I0(i,t,e){return i<=t?0:i>=e?1:(i=(i-t)/(e-t),i*i*(3-2*i))}function U0(i,t,e){return i<=t?0:i>=e?1:(i=(i-t)/(e-t),i*i*i*(i*(i*6-15)+10))}function N0(i,t){return i+Math.floor(Math.random()*(t-i+1))}function F0(i,t){return i+Math.random()*(t-i)}function O0(i){return i*(.5-Math.random())}function B0(i){i!==void 0&&(ih=i);let t=ih+=1831565813;return t=Math.imul(t^t>>>15,t|1),t^=t+Math.imul(t^t>>>7,t|61),((t^t>>>14)>>>0)/4294967296}function k0(i){return i*Rs}function H0(i){return i*cs}function z0(i){return(i&i-1)===0&&i!==0}function V0(i){return Math.pow(2,Math.ceil(Math.log(i)/Math.LN2))}function G0(i){return Math.pow(2,Math.floor(Math.log(i)/Math.LN2))}function W0(i,t,e,n,r){const s=Math.cos,a=Math.sin,o=s(e/2),c=a(e/2),l=s((t+n)/2),h=a((t+n)/2),u=s((t-n)/2),d=a((t-n)/2),f=s((n-t)/2),g=a((n-t)/2);switch(r){case"XYX":i.set(o*h,c*u,c*d,o*l);break;case"YZY":i.set(c*d,o*h,c*u,o*l);break;case"ZXZ":i.set(c*u,c*d,o*h,o*l);break;case"XZX":i.set(o*h,c*g,c*f,o*l);break;case"YXY":i.set(c*f,o*h,c*g,o*l);break;case"ZYZ":i.set(c*g,c*f,o*h,o*l);break;default:console.warn("THREE.MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+r)}}function Xr(i,t){switch(t.constructor){case Float32Array:return i;case Uint32Array:return i/4294967295;case Uint16Array:return i/65535;case Uint8Array:return i/255;case Int32Array:return Math.max(i/2147483647,-1);case Int16Array:return Math.max(i/32767,-1);case Int8Array:return Math.max(i/127,-1);default:throw new Error("Invalid component type.")}}function Ke(i,t){switch(t.constructor){case Float32Array:return i;case Uint32Array:return Math.round(i*4294967295);case Uint16Array:return Math.round(i*65535);case Uint8Array:return Math.round(i*255);case Int32Array:return Math.round(i*2147483647);case Int16Array:return Math.round(i*32767);case Int8Array:return Math.round(i*127);default:throw new Error("Invalid component type.")}}const Zr={DEG2RAD:Rs,RAD2DEG:cs,generateUUID:_r,clamp:te,euclideanModulo:pl,mapLinear:C0,inverseLerp:L0,lerp:Cs,damp:P0,pingpong:D0,smoothstep:I0,smootherstep:U0,randInt:N0,randFloat:F0,randFloatSpread:O0,seededRandom:B0,degToRad:k0,radToDeg:H0,isPowerOfTwo:z0,ceilPowerOfTwo:V0,floorPowerOfTwo:G0,setQuaternionFromProperEuler:W0,normalize:Ke,denormalize:Xr};class bt{constructor(t=0,e=0){bt.prototype.isVector2=!0,this.x=t,this.y=e}get width(){return this.x}set width(t){this.x=t}get height(){return this.y}set height(t){this.y=t}set(t,e){return this.x=t,this.y=e,this}setScalar(t){return this.x=t,this.y=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y)}copy(t){return this.x=t.x,this.y=t.y,this}add(t){return this.x+=t.x,this.y+=t.y,this}addScalar(t){return this.x+=t,this.y+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this}subScalar(t){return this.x-=t,this.y-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this}multiply(t){return this.x*=t.x,this.y*=t.y,this}multiplyScalar(t){return this.x*=t,this.y*=t,this}divide(t){return this.x/=t.x,this.y/=t.y,this}divideScalar(t){return this.multiplyScalar(1/t)}applyMatrix3(t){const e=this.x,n=this.y,r=t.elements;return this.x=r[0]*e+r[3]*n+r[6],this.y=r[1]*e+r[4]*n+r[7],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this}clamp(t,e){return this.x=te(this.x,t.x,e.x),this.y=te(this.y,t.y,e.y),this}clampScalar(t,e){return this.x=te(this.x,t,e),this.y=te(this.y,t,e),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(te(n,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(t){return this.x*t.x+this.y*t.y}cross(t){return this.x*t.y-this.y*t.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const n=this.dot(t)/e;return Math.acos(te(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,n=this.y-t.y;return e*e+n*n}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this}equals(t){return t.x===this.x&&t.y===this.y}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this}rotateAround(t,e){const n=Math.cos(e),r=Math.sin(e),s=this.x-t.x,a=this.y-t.y;return this.x=s*n-a*r+t.x,this.y=s*r+a*n+t.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class ze{constructor(t=0,e=0,n=0,r=1){this.isQuaternion=!0,this._x=t,this._y=e,this._z=n,this._w=r}static slerpFlat(t,e,n,r,s,a,o){let c=n[r+0],l=n[r+1],h=n[r+2],u=n[r+3];const d=s[a+0],f=s[a+1],g=s[a+2],v=s[a+3];if(o===0){t[e+0]=c,t[e+1]=l,t[e+2]=h,t[e+3]=u;return}if(o===1){t[e+0]=d,t[e+1]=f,t[e+2]=g,t[e+3]=v;return}if(u!==v||c!==d||l!==f||h!==g){let m=1-o;const p=c*d+l*f+h*g+u*v,b=p>=0?1:-1,y=1-p*p;if(y>Number.EPSILON){const E=Math.sqrt(y),w=Math.atan2(E,p*b);m=Math.sin(m*w)/E,o=Math.sin(o*w)/E}const _=o*b;if(c=c*m+d*_,l=l*m+f*_,h=h*m+g*_,u=u*m+v*_,m===1-o){const E=1/Math.sqrt(c*c+l*l+h*h+u*u);c*=E,l*=E,h*=E,u*=E}}t[e]=c,t[e+1]=l,t[e+2]=h,t[e+3]=u}static multiplyQuaternionsFlat(t,e,n,r,s,a){const o=n[r],c=n[r+1],l=n[r+2],h=n[r+3],u=s[a],d=s[a+1],f=s[a+2],g=s[a+3];return t[e]=o*g+h*u+c*f-l*d,t[e+1]=c*g+h*d+l*u-o*f,t[e+2]=l*g+h*f+o*d-c*u,t[e+3]=h*g-o*u-c*d-l*f,t}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get w(){return this._w}set w(t){this._w=t,this._onChangeCallback()}set(t,e,n,r){return this._x=t,this._y=e,this._z=n,this._w=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(t){return this._x=t.x,this._y=t.y,this._z=t.z,this._w=t.w,this._onChangeCallback(),this}setFromEuler(t,e=!0){const n=t._x,r=t._y,s=t._z,a=t._order,o=Math.cos,c=Math.sin,l=o(n/2),h=o(r/2),u=o(s/2),d=c(n/2),f=c(r/2),g=c(s/2);switch(a){case"XYZ":this._x=d*h*u+l*f*g,this._y=l*f*u-d*h*g,this._z=l*h*g+d*f*u,this._w=l*h*u-d*f*g;break;case"YXZ":this._x=d*h*u+l*f*g,this._y=l*f*u-d*h*g,this._z=l*h*g-d*f*u,this._w=l*h*u+d*f*g;break;case"ZXY":this._x=d*h*u-l*f*g,this._y=l*f*u+d*h*g,this._z=l*h*g+d*f*u,this._w=l*h*u-d*f*g;break;case"ZYX":this._x=d*h*u-l*f*g,this._y=l*f*u+d*h*g,this._z=l*h*g-d*f*u,this._w=l*h*u+d*f*g;break;case"YZX":this._x=d*h*u+l*f*g,this._y=l*f*u+d*h*g,this._z=l*h*g-d*f*u,this._w=l*h*u-d*f*g;break;case"XZY":this._x=d*h*u-l*f*g,this._y=l*f*u-d*h*g,this._z=l*h*g+d*f*u,this._w=l*h*u+d*f*g;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+a)}return e===!0&&this._onChangeCallback(),this}setFromAxisAngle(t,e){const n=e/2,r=Math.sin(n);return this._x=t.x*r,this._y=t.y*r,this._z=t.z*r,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(t){const e=t.elements,n=e[0],r=e[4],s=e[8],a=e[1],o=e[5],c=e[9],l=e[2],h=e[6],u=e[10],d=n+o+u;if(d>0){const f=.5/Math.sqrt(d+1);this._w=.25/f,this._x=(h-c)*f,this._y=(s-l)*f,this._z=(a-r)*f}else if(n>o&&n>u){const f=2*Math.sqrt(1+n-o-u);this._w=(h-c)/f,this._x=.25*f,this._y=(r+a)/f,this._z=(s+l)/f}else if(o>u){const f=2*Math.sqrt(1+o-n-u);this._w=(s-l)/f,this._x=(r+a)/f,this._y=.25*f,this._z=(c+h)/f}else{const f=2*Math.sqrt(1+u-n-o);this._w=(a-r)/f,this._x=(s+l)/f,this._y=(c+h)/f,this._z=.25*f}return this._onChangeCallback(),this}setFromUnitVectors(t,e){let n=t.dot(e)+1;return n<1e-8?(n=0,Math.abs(t.x)>Math.abs(t.z)?(this._x=-t.y,this._y=t.x,this._z=0,this._w=n):(this._x=0,this._y=-t.z,this._z=t.y,this._w=n)):(this._x=t.y*e.z-t.z*e.y,this._y=t.z*e.x-t.x*e.z,this._z=t.x*e.y-t.y*e.x,this._w=n),this.normalize()}angleTo(t){return 2*Math.acos(Math.abs(te(this.dot(t),-1,1)))}rotateTowards(t,e){const n=this.angleTo(t);if(n===0)return this;const r=Math.min(1,e/n);return this.slerp(t,r),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(t){return this._x*t._x+this._y*t._y+this._z*t._z+this._w*t._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let t=this.length();return t===0?(this._x=0,this._y=0,this._z=0,this._w=1):(t=1/t,this._x=this._x*t,this._y=this._y*t,this._z=this._z*t,this._w=this._w*t),this._onChangeCallback(),this}multiply(t){return this.multiplyQuaternions(this,t)}premultiply(t){return this.multiplyQuaternions(t,this)}multiplyQuaternions(t,e){const n=t._x,r=t._y,s=t._z,a=t._w,o=e._x,c=e._y,l=e._z,h=e._w;return this._x=n*h+a*o+r*l-s*c,this._y=r*h+a*c+s*o-n*l,this._z=s*h+a*l+n*c-r*o,this._w=a*h-n*o-r*c-s*l,this._onChangeCallback(),this}slerp(t,e){if(e===0)return this;if(e===1)return this.copy(t);const n=this._x,r=this._y,s=this._z,a=this._w;let o=a*t._w+n*t._x+r*t._y+s*t._z;if(o<0?(this._w=-t._w,this._x=-t._x,this._y=-t._y,this._z=-t._z,o=-o):this.copy(t),o>=1)return this._w=a,this._x=n,this._y=r,this._z=s,this;const c=1-o*o;if(c<=Number.EPSILON){const f=1-e;return this._w=f*a+e*this._w,this._x=f*n+e*this._x,this._y=f*r+e*this._y,this._z=f*s+e*this._z,this.normalize(),this}const l=Math.sqrt(c),h=Math.atan2(l,o),u=Math.sin((1-e)*h)/l,d=Math.sin(e*h)/l;return this._w=a*u+this._w*d,this._x=n*u+this._x*d,this._y=r*u+this._y*d,this._z=s*u+this._z*d,this._onChangeCallback(),this}slerpQuaternions(t,e,n){return this.copy(t).slerp(e,n)}random(){const t=2*Math.PI*Math.random(),e=2*Math.PI*Math.random(),n=Math.random(),r=Math.sqrt(1-n),s=Math.sqrt(n);return this.set(r*Math.sin(t),r*Math.cos(t),s*Math.sin(e),s*Math.cos(e))}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._w===this._w}fromArray(t,e=0){return this._x=t[e],this._y=t[e+1],this._z=t[e+2],this._w=t[e+3],this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._w,t}fromBufferAttribute(t,e){return this._x=t.getX(e),this._y=t.getY(e),this._z=t.getZ(e),this._w=t.getW(e),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class I{constructor(t=0,e=0,n=0){I.prototype.isVector3=!0,this.x=t,this.y=e,this.z=n}set(t,e,n){return n===void 0&&(n=this.z),this.x=t,this.y=e,this.z=n,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this}multiplyVectors(t,e){return this.x=t.x*e.x,this.y=t.y*e.y,this.z=t.z*e.z,this}applyEuler(t){return this.applyQuaternion(rh.setFromEuler(t))}applyAxisAngle(t,e){return this.applyQuaternion(rh.setFromAxisAngle(t,e))}applyMatrix3(t){const e=this.x,n=this.y,r=this.z,s=t.elements;return this.x=s[0]*e+s[3]*n+s[6]*r,this.y=s[1]*e+s[4]*n+s[7]*r,this.z=s[2]*e+s[5]*n+s[8]*r,this}applyNormalMatrix(t){return this.applyMatrix3(t).normalize()}applyMatrix4(t){const e=this.x,n=this.y,r=this.z,s=t.elements,a=1/(s[3]*e+s[7]*n+s[11]*r+s[15]);return this.x=(s[0]*e+s[4]*n+s[8]*r+s[12])*a,this.y=(s[1]*e+s[5]*n+s[9]*r+s[13])*a,this.z=(s[2]*e+s[6]*n+s[10]*r+s[14])*a,this}applyQuaternion(t){const e=this.x,n=this.y,r=this.z,s=t.x,a=t.y,o=t.z,c=t.w,l=2*(a*r-o*n),h=2*(o*e-s*r),u=2*(s*n-a*e);return this.x=e+c*l+a*u-o*h,this.y=n+c*h+o*l-s*u,this.z=r+c*u+s*h-a*l,this}project(t){return this.applyMatrix4(t.matrixWorldInverse).applyMatrix4(t.projectionMatrix)}unproject(t){return this.applyMatrix4(t.projectionMatrixInverse).applyMatrix4(t.matrixWorld)}transformDirection(t){const e=this.x,n=this.y,r=this.z,s=t.elements;return this.x=s[0]*e+s[4]*n+s[8]*r,this.y=s[1]*e+s[5]*n+s[9]*r,this.z=s[2]*e+s[6]*n+s[10]*r,this.normalize()}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this}divideScalar(t){return this.multiplyScalar(1/t)}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this}clamp(t,e){return this.x=te(this.x,t.x,e.x),this.y=te(this.y,t.y,e.y),this.z=te(this.z,t.z,e.z),this}clampScalar(t,e){return this.x=te(this.x,t,e),this.y=te(this.y,t,e),this.z=te(this.z,t,e),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(te(n,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this}cross(t){return this.crossVectors(this,t)}crossVectors(t,e){const n=t.x,r=t.y,s=t.z,a=e.x,o=e.y,c=e.z;return this.x=r*c-s*o,this.y=s*a-n*c,this.z=n*o-r*a,this}projectOnVector(t){const e=t.lengthSq();if(e===0)return this.set(0,0,0);const n=t.dot(this)/e;return this.copy(t).multiplyScalar(n)}projectOnPlane(t){return co.copy(this).projectOnVector(t),this.sub(co)}reflect(t){return this.sub(co.copy(t).multiplyScalar(2*this.dot(t)))}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const n=this.dot(t)/e;return Math.acos(te(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,n=this.y-t.y,r=this.z-t.z;return e*e+n*n+r*r}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)+Math.abs(this.z-t.z)}setFromSpherical(t){return this.setFromSphericalCoords(t.radius,t.phi,t.theta)}setFromSphericalCoords(t,e,n){const r=Math.sin(e)*t;return this.x=r*Math.sin(n),this.y=Math.cos(e)*t,this.z=r*Math.cos(n),this}setFromCylindrical(t){return this.setFromCylindricalCoords(t.radius,t.theta,t.y)}setFromCylindricalCoords(t,e,n){return this.x=t*Math.sin(e),this.y=n,this.z=t*Math.cos(e),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this}setFromMatrixScale(t){const e=this.setFromMatrixColumn(t,0).length(),n=this.setFromMatrixColumn(t,1).length(),r=this.setFromMatrixColumn(t,2).length();return this.x=e,this.y=n,this.z=r,this}setFromMatrixColumn(t,e){return this.fromArray(t.elements,e*4)}setFromMatrix3Column(t,e){return this.fromArray(t.elements,e*3)}setFromEuler(t){return this.x=t._x,this.y=t._y,this.z=t._z,this}setFromColor(t){return this.x=t.r,this.y=t.g,this.z=t.b,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const t=Math.random()*Math.PI*2,e=Math.random()*2-1,n=Math.sqrt(1-e*e);return this.x=n*Math.cos(t),this.y=e,this.z=n*Math.sin(t),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const co=new I,rh=new ze;class Jt{constructor(t,e,n,r,s,a,o,c,l){Jt.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],t!==void 0&&this.set(t,e,n,r,s,a,o,c,l)}set(t,e,n,r,s,a,o,c,l){const h=this.elements;return h[0]=t,h[1]=r,h[2]=o,h[3]=e,h[4]=s,h[5]=c,h[6]=n,h[7]=a,h[8]=l,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(t){const e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],this}extractBasis(t,e,n){return t.setFromMatrix3Column(this,0),e.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(t){const e=t.elements;return this.set(e[0],e[4],e[8],e[1],e[5],e[9],e[2],e[6],e[10]),this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const n=t.elements,r=e.elements,s=this.elements,a=n[0],o=n[3],c=n[6],l=n[1],h=n[4],u=n[7],d=n[2],f=n[5],g=n[8],v=r[0],m=r[3],p=r[6],b=r[1],y=r[4],_=r[7],E=r[2],w=r[5],A=r[8];return s[0]=a*v+o*b+c*E,s[3]=a*m+o*y+c*w,s[6]=a*p+o*_+c*A,s[1]=l*v+h*b+u*E,s[4]=l*m+h*y+u*w,s[7]=l*p+h*_+u*A,s[2]=d*v+f*b+g*E,s[5]=d*m+f*y+g*w,s[8]=d*p+f*_+g*A,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[3]*=t,e[6]*=t,e[1]*=t,e[4]*=t,e[7]*=t,e[2]*=t,e[5]*=t,e[8]*=t,this}determinant(){const t=this.elements,e=t[0],n=t[1],r=t[2],s=t[3],a=t[4],o=t[5],c=t[6],l=t[7],h=t[8];return e*a*h-e*o*l-n*s*h+n*o*c+r*s*l-r*a*c}invert(){const t=this.elements,e=t[0],n=t[1],r=t[2],s=t[3],a=t[4],o=t[5],c=t[6],l=t[7],h=t[8],u=h*a-o*l,d=o*c-h*s,f=l*s-a*c,g=e*u+n*d+r*f;if(g===0)return this.set(0,0,0,0,0,0,0,0,0);const v=1/g;return t[0]=u*v,t[1]=(r*l-h*n)*v,t[2]=(o*n-r*a)*v,t[3]=d*v,t[4]=(h*e-r*c)*v,t[5]=(r*s-o*e)*v,t[6]=f*v,t[7]=(n*c-l*e)*v,t[8]=(a*e-n*s)*v,this}transpose(){let t;const e=this.elements;return t=e[1],e[1]=e[3],e[3]=t,t=e[2],e[2]=e[6],e[6]=t,t=e[5],e[5]=e[7],e[7]=t,this}getNormalMatrix(t){return this.setFromMatrix4(t).invert().transpose()}transposeIntoArray(t){const e=this.elements;return t[0]=e[0],t[1]=e[3],t[2]=e[6],t[3]=e[1],t[4]=e[4],t[5]=e[7],t[6]=e[2],t[7]=e[5],t[8]=e[8],this}setUvTransform(t,e,n,r,s,a,o){const c=Math.cos(s),l=Math.sin(s);return this.set(n*c,n*l,-n*(c*a+l*o)+a+t,-r*l,r*c,-r*(-l*a+c*o)+o+e,0,0,1),this}scale(t,e){return this.premultiply(lo.makeScale(t,e)),this}rotate(t){return this.premultiply(lo.makeRotation(-t)),this}translate(t,e){return this.premultiply(lo.makeTranslation(t,e)),this}makeTranslation(t,e){return t.isVector2?this.set(1,0,t.x,0,1,t.y,0,0,1):this.set(1,0,t,0,1,e,0,0,1),this}makeRotation(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,n,e,0,0,0,1),this}makeScale(t,e){return this.set(t,0,0,0,e,0,0,0,1),this}equals(t){const e=this.elements,n=t.elements;for(let r=0;r<9;r++)if(e[r]!==n[r])return!1;return!0}fromArray(t,e=0){for(let n=0;n<9;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){const n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t}clone(){return new this.constructor().fromArray(this.elements)}}const lo=new Jt;function mf(i){for(let t=i.length-1;t>=0;--t)if(i[t]>=65535)return!0;return!1}function Ya(i){return document.createElementNS("http://www.w3.org/1999/xhtml",i)}function X0(){const i=Ya("canvas");return i.style.display="block",i}const sh={};function Os(i){i in sh||(sh[i]=!0,console.warn(i))}function q0(i,t,e){return new Promise(function(n,r){function s(){switch(i.clientWaitSync(t,i.SYNC_FLUSH_COMMANDS_BIT,0)){case i.WAIT_FAILED:r();break;case i.TIMEOUT_EXPIRED:setTimeout(s,e);break;default:n()}}setTimeout(s,e)})}const ah=new Jt().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),oh=new Jt().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function Y0(){const i={enabled:!0,workingColorSpace:mr,spaces:{},convert:function(r,s,a){return this.enabled===!1||s===a||!s||!a||(this.spaces[s].transfer===he&&(r.r=_i(r.r),r.g=_i(r.g),r.b=_i(r.b)),this.spaces[s].primaries!==this.spaces[a].primaries&&(r.applyMatrix3(this.spaces[s].toXYZ),r.applyMatrix3(this.spaces[a].fromXYZ)),this.spaces[a].transfer===he&&(r.r=Jr(r.r),r.g=Jr(r.g),r.b=Jr(r.b))),r},workingToColorSpace:function(r,s){return this.convert(r,this.workingColorSpace,s)},colorSpaceToWorking:function(r,s){return this.convert(r,s,this.workingColorSpace)},getPrimaries:function(r){return this.spaces[r].primaries},getTransfer:function(r){return r===Qn?Xa:this.spaces[r].transfer},getToneMappingMode:function(r){return this.spaces[r].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(r,s=this.workingColorSpace){return r.fromArray(this.spaces[s].luminanceCoefficients)},define:function(r){Object.assign(this.spaces,r)},_getMatrix:function(r,s,a){return r.copy(this.spaces[s].toXYZ).multiply(this.spaces[a].fromXYZ)},_getDrawingBufferColorSpace:function(r){return this.spaces[r].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(r=this.workingColorSpace){return this.spaces[r].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(r,s){return Os("THREE.ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),i.workingToColorSpace(r,s)},toWorkingColorSpace:function(r,s){return Os("THREE.ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),i.colorSpaceToWorking(r,s)}},t=[.64,.33,.3,.6,.15,.06],e=[.2126,.7152,.0722],n=[.3127,.329];return i.define({[mr]:{primaries:t,whitePoint:n,transfer:Xa,toXYZ:ah,fromXYZ:oh,luminanceCoefficients:e,workingColorSpaceConfig:{unpackColorSpace:un},outputColorSpaceConfig:{drawingBufferColorSpace:un}},[un]:{primaries:t,whitePoint:n,transfer:he,toXYZ:ah,fromXYZ:oh,luminanceCoefficients:e,outputColorSpaceConfig:{drawingBufferColorSpace:un}}}),i}const se=Y0();function _i(i){return i<.04045?i*.0773993808:Math.pow(i*.9478672986+.0521327014,2.4)}function Jr(i){return i<.0031308?i*12.92:1.055*Math.pow(i,.41666)-.055}let Er;class $0{static getDataURL(t,e="image/png"){if(/^data:/i.test(t.src)||typeof HTMLCanvasElement>"u")return t.src;let n;if(t instanceof HTMLCanvasElement)n=t;else{Er===void 0&&(Er=Ya("canvas")),Er.width=t.width,Er.height=t.height;const r=Er.getContext("2d");t instanceof ImageData?r.putImageData(t,0,0):r.drawImage(t,0,0,t.width,t.height),n=Er}return n.toDataURL(e)}static sRGBToLinear(t){if(typeof HTMLImageElement<"u"&&t instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&t instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&t instanceof ImageBitmap){const e=Ya("canvas");e.width=t.width,e.height=t.height;const n=e.getContext("2d");n.drawImage(t,0,0,t.width,t.height);const r=n.getImageData(0,0,t.width,t.height),s=r.data;for(let a=0;a<s.length;a++)s[a]=_i(s[a]/255)*255;return n.putImageData(r,0,0),e}else if(t.data){const e=t.data.slice(0);for(let n=0;n<e.length;n++)e instanceof Uint8Array||e instanceof Uint8ClampedArray?e[n]=Math.floor(_i(e[n]/255)*255):e[n]=_i(e[n]);return{data:e,width:t.width,height:t.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),t}}let j0=0;class ml{constructor(t=null){this.isSource=!0,Object.defineProperty(this,"id",{value:j0++}),this.uuid=_r(),this.data=t,this.dataReady=!0,this.version=0}getSize(t){const e=this.data;return typeof HTMLVideoElement<"u"&&e instanceof HTMLVideoElement?t.set(e.videoWidth,e.videoHeight,0):e instanceof VideoFrame?t.set(e.displayHeight,e.displayWidth,0):e!==null?t.set(e.width,e.height,e.depth||0):t.set(0,0,0),t}set needsUpdate(t){t===!0&&this.version++}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.images[this.uuid]!==void 0)return t.images[this.uuid];const n={uuid:this.uuid,url:""},r=this.data;if(r!==null){let s;if(Array.isArray(r)){s=[];for(let a=0,o=r.length;a<o;a++)r[a].isDataTexture?s.push(ho(r[a].image)):s.push(ho(r[a]))}else s=ho(r);n.url=s}return e||(t.images[this.uuid]=n),n}}function ho(i){return typeof HTMLImageElement<"u"&&i instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&i instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&i instanceof ImageBitmap?$0.getDataURL(i):i.data?{data:Array.from(i.data),width:i.width,height:i.height,type:i.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}let K0=0;const uo=new I;class Ge extends ds{constructor(t=Ge.DEFAULT_IMAGE,e=Ge.DEFAULT_MAPPING,n=cr,r=cr,s=ge,a=Oi,o=Ve,c=Gn,l=Ge.DEFAULT_ANISOTROPY,h=Qn){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:K0++}),this.uuid=_r(),this.name="",this.source=new ml(t),this.mipmaps=[],this.mapping=e,this.channel=0,this.wrapS=n,this.wrapT=r,this.magFilter=s,this.minFilter=a,this.anisotropy=l,this.format=o,this.internalFormat=null,this.type=c,this.offset=new bt(0,0),this.repeat=new bt(1,1),this.center=new bt(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Jt,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=h,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(t&&t.depth&&t.depth>1),this.pmremVersion=0}get width(){return this.source.getSize(uo).x}get height(){return this.source.getSize(uo).y}get depth(){return this.source.getSize(uo).z}get image(){return this.source.data}set image(t=null){this.source.data=t}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(t){return this.name=t.name,this.source=t.source,this.mipmaps=t.mipmaps.slice(0),this.mapping=t.mapping,this.channel=t.channel,this.wrapS=t.wrapS,this.wrapT=t.wrapT,this.magFilter=t.magFilter,this.minFilter=t.minFilter,this.anisotropy=t.anisotropy,this.format=t.format,this.internalFormat=t.internalFormat,this.type=t.type,this.offset.copy(t.offset),this.repeat.copy(t.repeat),this.center.copy(t.center),this.rotation=t.rotation,this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrix.copy(t.matrix),this.generateMipmaps=t.generateMipmaps,this.premultiplyAlpha=t.premultiplyAlpha,this.flipY=t.flipY,this.unpackAlignment=t.unpackAlignment,this.colorSpace=t.colorSpace,this.renderTarget=t.renderTarget,this.isRenderTargetTexture=t.isRenderTargetTexture,this.isArrayTexture=t.isArrayTexture,this.userData=JSON.parse(JSON.stringify(t.userData)),this.needsUpdate=!0,this}setValues(t){for(const e in t){const n=t[e];if(n===void 0){console.warn(`THREE.Texture.setValues(): parameter '${e}' has value of undefined.`);continue}const r=this[e];if(r===void 0){console.warn(`THREE.Texture.setValues(): property '${e}' does not exist.`);continue}r&&n&&r.isVector2&&n.isVector2||r&&n&&r.isVector3&&n.isVector3||r&&n&&r.isMatrix3&&n.isMatrix3?r.copy(n):this[e]=n}}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.textures[this.uuid]!==void 0)return t.textures[this.uuid];const n={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(t).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),e||(t.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(t){if(this.mapping!==rf)return t;if(t.applyMatrix3(this.matrix),t.x<0||t.x>1)switch(this.wrapS){case os:t.x=t.x-Math.floor(t.x);break;case cr:t.x=t.x<0?0:1;break;case mc:Math.abs(Math.floor(t.x)%2)===1?t.x=Math.ceil(t.x)-t.x:t.x=t.x-Math.floor(t.x);break}if(t.y<0||t.y>1)switch(this.wrapT){case os:t.y=t.y-Math.floor(t.y);break;case cr:t.y=t.y<0?0:1;break;case mc:Math.abs(Math.floor(t.y)%2)===1?t.y=Math.ceil(t.y)-t.y:t.y=t.y-Math.floor(t.y);break}return this.flipY&&(t.y=1-t.y),t}set needsUpdate(t){t===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(t){t===!0&&this.pmremVersion++}}Ge.DEFAULT_IMAGE=null;Ge.DEFAULT_MAPPING=rf;Ge.DEFAULT_ANISOTROPY=1;class ae{constructor(t=0,e=0,n=0,r=1){ae.prototype.isVector4=!0,this.x=t,this.y=e,this.z=n,this.w=r}get width(){return this.z}set width(t){this.z=t}get height(){return this.w}set height(t){this.w=t}set(t,e,n,r){return this.x=t,this.y=e,this.z=n,this.w=r,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this.w=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setW(t){return this.w=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;case 3:this.w=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this.w=t.w!==void 0?t.w:1,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this.w+=t.w,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this.w+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this.w=t.w+e.w,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this.w+=t.w*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this.w-=t.w,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this.w-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this.w=t.w-e.w,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this.w*=t.w,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this.w*=t,this}applyMatrix4(t){const e=this.x,n=this.y,r=this.z,s=this.w,a=t.elements;return this.x=a[0]*e+a[4]*n+a[8]*r+a[12]*s,this.y=a[1]*e+a[5]*n+a[9]*r+a[13]*s,this.z=a[2]*e+a[6]*n+a[10]*r+a[14]*s,this.w=a[3]*e+a[7]*n+a[11]*r+a[15]*s,this}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this.w/=t.w,this}divideScalar(t){return this.multiplyScalar(1/t)}setAxisAngleFromQuaternion(t){this.w=2*Math.acos(t.w);const e=Math.sqrt(1-t.w*t.w);return e<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=t.x/e,this.y=t.y/e,this.z=t.z/e),this}setAxisAngleFromRotationMatrix(t){let e,n,r,s;const c=t.elements,l=c[0],h=c[4],u=c[8],d=c[1],f=c[5],g=c[9],v=c[2],m=c[6],p=c[10];if(Math.abs(h-d)<.01&&Math.abs(u-v)<.01&&Math.abs(g-m)<.01){if(Math.abs(h+d)<.1&&Math.abs(u+v)<.1&&Math.abs(g+m)<.1&&Math.abs(l+f+p-3)<.1)return this.set(1,0,0,0),this;e=Math.PI;const y=(l+1)/2,_=(f+1)/2,E=(p+1)/2,w=(h+d)/4,A=(u+v)/4,R=(g+m)/4;return y>_&&y>E?y<.01?(n=0,r=.707106781,s=.707106781):(n=Math.sqrt(y),r=w/n,s=A/n):_>E?_<.01?(n=.707106781,r=0,s=.707106781):(r=Math.sqrt(_),n=w/r,s=R/r):E<.01?(n=.707106781,r=.707106781,s=0):(s=Math.sqrt(E),n=A/s,r=R/s),this.set(n,r,s,e),this}let b=Math.sqrt((m-g)*(m-g)+(u-v)*(u-v)+(d-h)*(d-h));return Math.abs(b)<.001&&(b=1),this.x=(m-g)/b,this.y=(u-v)/b,this.z=(d-h)/b,this.w=Math.acos((l+f+p-1)/2),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this.w=e[15],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this.w=Math.min(this.w,t.w),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this.w=Math.max(this.w,t.w),this}clamp(t,e){return this.x=te(this.x,t.x,e.x),this.y=te(this.y,t.y,e.y),this.z=te(this.z,t.z,e.z),this.w=te(this.w,t.w,e.w),this}clampScalar(t,e){return this.x=te(this.x,t,e),this.y=te(this.y,t,e),this.z=te(this.z,t,e),this.w=te(this.w,t,e),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(te(n,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z+this.w*t.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this.w+=(t.w-this.w)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this.w=t.w+(e.w-t.w)*n,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z&&t.w===this.w}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this.w=t[e+3],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t[e+3]=this.w,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this.w=t.getW(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class Z0 extends ds{constructor(t=1,e=1,n={}){super(),n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:ge,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1},n),this.isRenderTarget=!0,this.width=t,this.height=e,this.depth=n.depth,this.scissor=new ae(0,0,t,e),this.scissorTest=!1,this.viewport=new ae(0,0,t,e);const r={width:t,height:e,depth:n.depth},s=new Ge(r);this.textures=[];const a=n.count;for(let o=0;o<a;o++)this.textures[o]=s.clone(),this.textures[o].isRenderTargetTexture=!0,this.textures[o].renderTarget=this;this._setTextureOptions(n),this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this._depthTexture=null,this.depthTexture=n.depthTexture,this.samples=n.samples,this.multiview=n.multiview}_setTextureOptions(t={}){const e={minFilter:ge,generateMipmaps:!1,flipY:!1,internalFormat:null};t.mapping!==void 0&&(e.mapping=t.mapping),t.wrapS!==void 0&&(e.wrapS=t.wrapS),t.wrapT!==void 0&&(e.wrapT=t.wrapT),t.wrapR!==void 0&&(e.wrapR=t.wrapR),t.magFilter!==void 0&&(e.magFilter=t.magFilter),t.minFilter!==void 0&&(e.minFilter=t.minFilter),t.format!==void 0&&(e.format=t.format),t.type!==void 0&&(e.type=t.type),t.anisotropy!==void 0&&(e.anisotropy=t.anisotropy),t.colorSpace!==void 0&&(e.colorSpace=t.colorSpace),t.flipY!==void 0&&(e.flipY=t.flipY),t.generateMipmaps!==void 0&&(e.generateMipmaps=t.generateMipmaps),t.internalFormat!==void 0&&(e.internalFormat=t.internalFormat);for(let n=0;n<this.textures.length;n++)this.textures[n].setValues(e)}get texture(){return this.textures[0]}set texture(t){this.textures[0]=t}set depthTexture(t){this._depthTexture!==null&&(this._depthTexture.renderTarget=null),t!==null&&(t.renderTarget=this),this._depthTexture=t}get depthTexture(){return this._depthTexture}setSize(t,e,n=1){if(this.width!==t||this.height!==e||this.depth!==n){this.width=t,this.height=e,this.depth=n;for(let r=0,s=this.textures.length;r<s;r++)this.textures[r].image.width=t,this.textures[r].image.height=e,this.textures[r].image.depth=n,this.textures[r].isArrayTexture=this.textures[r].image.depth>1;this.dispose()}this.viewport.set(0,0,t,e),this.scissor.set(0,0,t,e)}clone(){return new this.constructor().copy(this)}copy(t){this.width=t.width,this.height=t.height,this.depth=t.depth,this.scissor.copy(t.scissor),this.scissorTest=t.scissorTest,this.viewport.copy(t.viewport),this.textures.length=0;for(let e=0,n=t.textures.length;e<n;e++){this.textures[e]=t.textures[e].clone(),this.textures[e].isRenderTargetTexture=!0,this.textures[e].renderTarget=this;const r=Object.assign({},t.textures[e].image);this.textures[e].source=new ml(r)}return this.depthBuffer=t.depthBuffer,this.stencilBuffer=t.stencilBuffer,this.resolveDepthBuffer=t.resolveDepthBuffer,this.resolveStencilBuffer=t.resolveStencilBuffer,t.depthTexture!==null&&(this.depthTexture=t.depthTexture.clone()),this.samples=t.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class en extends Z0{constructor(t=1,e=1,n={}){super(t,e,n),this.isWebGLRenderTarget=!0}}class gl extends Ge{constructor(t=null,e=1,n=1,r=1){super(null),this.isDataArrayTexture=!0,this.image={data:t,width:e,height:n,depth:r},this.magFilter=yn,this.minFilter=yn,this.wrapR=cr,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(t){this.layerUpdates.add(t)}clearLayerUpdates(){this.layerUpdates.clear()}}class J0 extends en{constructor(t=1,e=1,n=1,r={}){super(t,e,r),this.isWebGLArrayRenderTarget=!0,this.depth=n,this.texture=new gl(null,t,e,n),this._setTextureOptions(r),this.texture.isRenderTargetTexture=!0}}class Q0 extends Ge{constructor(t=null,e=1,n=1,r=1){super(null),this.isData3DTexture=!0,this.image={data:t,width:e,height:n,depth:r},this.magFilter=yn,this.minFilter=yn,this.wrapR=cr,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class ps{constructor(t=new I(1/0,1/0,1/0),e=new I(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=t,this.max=e}set(t,e){return this.min.copy(t),this.max.copy(e),this}setFromArray(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e+=3)this.expandByPoint(Nn.fromArray(t,e));return this}setFromBufferAttribute(t){this.makeEmpty();for(let e=0,n=t.count;e<n;e++)this.expandByPoint(Nn.fromBufferAttribute(t,e));return this}setFromPoints(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e++)this.expandByPoint(t[e]);return this}setFromCenterAndSize(t,e){const n=Nn.copy(e).multiplyScalar(.5);return this.min.copy(t).sub(n),this.max.copy(t).add(n),this}setFromObject(t,e=!1){return this.makeEmpty(),this.expandByObject(t,e)}clone(){return new this.constructor().copy(this)}copy(t){return this.min.copy(t.min),this.max.copy(t.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(t){return this.isEmpty()?t.set(0,0,0):t.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(t){return this.isEmpty()?t.set(0,0,0):t.subVectors(this.max,this.min)}expandByPoint(t){return this.min.min(t),this.max.max(t),this}expandByVector(t){return this.min.sub(t),this.max.add(t),this}expandByScalar(t){return this.min.addScalar(-t),this.max.addScalar(t),this}expandByObject(t,e=!1){t.updateWorldMatrix(!1,!1);const n=t.geometry;if(n!==void 0){const s=n.getAttribute("position");if(e===!0&&s!==void 0&&t.isInstancedMesh!==!0)for(let a=0,o=s.count;a<o;a++)t.isMesh===!0?t.getVertexPosition(a,Nn):Nn.fromBufferAttribute(s,a),Nn.applyMatrix4(t.matrixWorld),this.expandByPoint(Nn);else t.boundingBox!==void 0?(t.boundingBox===null&&t.computeBoundingBox(),ea.copy(t.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),ea.copy(n.boundingBox)),ea.applyMatrix4(t.matrixWorld),this.union(ea)}const r=t.children;for(let s=0,a=r.length;s<a;s++)this.expandByObject(r[s],e);return this}containsPoint(t){return t.x>=this.min.x&&t.x<=this.max.x&&t.y>=this.min.y&&t.y<=this.max.y&&t.z>=this.min.z&&t.z<=this.max.z}containsBox(t){return this.min.x<=t.min.x&&t.max.x<=this.max.x&&this.min.y<=t.min.y&&t.max.y<=this.max.y&&this.min.z<=t.min.z&&t.max.z<=this.max.z}getParameter(t,e){return e.set((t.x-this.min.x)/(this.max.x-this.min.x),(t.y-this.min.y)/(this.max.y-this.min.y),(t.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(t){return t.max.x>=this.min.x&&t.min.x<=this.max.x&&t.max.y>=this.min.y&&t.min.y<=this.max.y&&t.max.z>=this.min.z&&t.min.z<=this.max.z}intersectsSphere(t){return this.clampPoint(t.center,Nn),Nn.distanceToSquared(t.center)<=t.radius*t.radius}intersectsPlane(t){let e,n;return t.normal.x>0?(e=t.normal.x*this.min.x,n=t.normal.x*this.max.x):(e=t.normal.x*this.max.x,n=t.normal.x*this.min.x),t.normal.y>0?(e+=t.normal.y*this.min.y,n+=t.normal.y*this.max.y):(e+=t.normal.y*this.max.y,n+=t.normal.y*this.min.y),t.normal.z>0?(e+=t.normal.z*this.min.z,n+=t.normal.z*this.max.z):(e+=t.normal.z*this.max.z,n+=t.normal.z*this.min.z),e<=-t.constant&&n>=-t.constant}intersectsTriangle(t){if(this.isEmpty())return!1;this.getCenter(Ms),na.subVectors(this.max,Ms),Tr.subVectors(t.a,Ms),Ar.subVectors(t.b,Ms),Rr.subVectors(t.c,Ms),wi.subVectors(Ar,Tr),Ei.subVectors(Rr,Ar),Zi.subVectors(Tr,Rr);let e=[0,-wi.z,wi.y,0,-Ei.z,Ei.y,0,-Zi.z,Zi.y,wi.z,0,-wi.x,Ei.z,0,-Ei.x,Zi.z,0,-Zi.x,-wi.y,wi.x,0,-Ei.y,Ei.x,0,-Zi.y,Zi.x,0];return!fo(e,Tr,Ar,Rr,na)||(e=[1,0,0,0,1,0,0,0,1],!fo(e,Tr,Ar,Rr,na))?!1:(ia.crossVectors(wi,Ei),e=[ia.x,ia.y,ia.z],fo(e,Tr,Ar,Rr,na))}clampPoint(t,e){return e.copy(t).clamp(this.min,this.max)}distanceToPoint(t){return this.clampPoint(t,Nn).distanceTo(t)}getBoundingSphere(t){return this.isEmpty()?t.makeEmpty():(this.getCenter(t.center),t.radius=this.getSize(Nn).length()*.5),t}intersect(t){return this.min.max(t.min),this.max.min(t.max),this.isEmpty()&&this.makeEmpty(),this}union(t){return this.min.min(t.min),this.max.max(t.max),this}applyMatrix4(t){return this.isEmpty()?this:(ri[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(t),ri[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(t),ri[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(t),ri[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(t),ri[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(t),ri[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(t),ri[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(t),ri[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(t),this.setFromPoints(ri),this)}translate(t){return this.min.add(t),this.max.add(t),this}equals(t){return t.min.equals(this.min)&&t.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(t){return this.min.fromArray(t.min),this.max.fromArray(t.max),this}}const ri=[new I,new I,new I,new I,new I,new I,new I,new I],Nn=new I,ea=new ps,Tr=new I,Ar=new I,Rr=new I,wi=new I,Ei=new I,Zi=new I,Ms=new I,na=new I,ia=new I,Ji=new I;function fo(i,t,e,n,r){for(let s=0,a=i.length-3;s<=a;s+=3){Ji.fromArray(i,s);const o=r.x*Math.abs(Ji.x)+r.y*Math.abs(Ji.y)+r.z*Math.abs(Ji.z),c=t.dot(Ji),l=e.dot(Ji),h=n.dot(Ji);if(Math.max(-Math.max(c,l,h),Math.min(c,l,h))>o)return!1}return!0}const tp=new ps,bs=new I,po=new I;class Mr{constructor(t=new I,e=-1){this.isSphere=!0,this.center=t,this.radius=e}set(t,e){return this.center.copy(t),this.radius=e,this}setFromPoints(t,e){const n=this.center;e!==void 0?n.copy(e):tp.setFromPoints(t).getCenter(n);let r=0;for(let s=0,a=t.length;s<a;s++)r=Math.max(r,n.distanceToSquared(t[s]));return this.radius=Math.sqrt(r),this}copy(t){return this.center.copy(t.center),this.radius=t.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(t){return t.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(t){return t.distanceTo(this.center)-this.radius}intersectsSphere(t){const e=this.radius+t.radius;return t.center.distanceToSquared(this.center)<=e*e}intersectsBox(t){return t.intersectsSphere(this)}intersectsPlane(t){return Math.abs(t.distanceToPoint(this.center))<=this.radius}clampPoint(t,e){const n=this.center.distanceToSquared(t);return e.copy(t),n>this.radius*this.radius&&(e.sub(this.center).normalize(),e.multiplyScalar(this.radius).add(this.center)),e}getBoundingBox(t){return this.isEmpty()?(t.makeEmpty(),t):(t.set(this.center,this.center),t.expandByScalar(this.radius),t)}applyMatrix4(t){return this.center.applyMatrix4(t),this.radius=this.radius*t.getMaxScaleOnAxis(),this}translate(t){return this.center.add(t),this}expandByPoint(t){if(this.isEmpty())return this.center.copy(t),this.radius=0,this;bs.subVectors(t,this.center);const e=bs.lengthSq();if(e>this.radius*this.radius){const n=Math.sqrt(e),r=(n-this.radius)*.5;this.center.addScaledVector(bs,r/n),this.radius+=r}return this}union(t){return t.isEmpty()?this:this.isEmpty()?(this.copy(t),this):(this.center.equals(t.center)===!0?this.radius=Math.max(this.radius,t.radius):(po.subVectors(t.center,this.center).setLength(t.radius),this.expandByPoint(bs.copy(t.center).add(po)),this.expandByPoint(bs.copy(t.center).sub(po))),this)}equals(t){return t.center.equals(this.center)&&t.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(t){return this.radius=t.radius,this.center.fromArray(t.center),this}}const si=new I,mo=new I,ra=new I,Ti=new I,go=new I,sa=new I,vo=new I;class vl{constructor(t=new I,e=new I(0,0,-1)){this.origin=t,this.direction=e}set(t,e){return this.origin.copy(t),this.direction.copy(e),this}copy(t){return this.origin.copy(t.origin),this.direction.copy(t.direction),this}at(t,e){return e.copy(this.origin).addScaledVector(this.direction,t)}lookAt(t){return this.direction.copy(t).sub(this.origin).normalize(),this}recast(t){return this.origin.copy(this.at(t,si)),this}closestPointToPoint(t,e){e.subVectors(t,this.origin);const n=e.dot(this.direction);return n<0?e.copy(this.origin):e.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(t){return Math.sqrt(this.distanceSqToPoint(t))}distanceSqToPoint(t){const e=si.subVectors(t,this.origin).dot(this.direction);return e<0?this.origin.distanceToSquared(t):(si.copy(this.origin).addScaledVector(this.direction,e),si.distanceToSquared(t))}distanceSqToSegment(t,e,n,r){mo.copy(t).add(e).multiplyScalar(.5),ra.copy(e).sub(t).normalize(),Ti.copy(this.origin).sub(mo);const s=t.distanceTo(e)*.5,a=-this.direction.dot(ra),o=Ti.dot(this.direction),c=-Ti.dot(ra),l=Ti.lengthSq(),h=Math.abs(1-a*a);let u,d,f,g;if(h>0)if(u=a*c-o,d=a*o-c,g=s*h,u>=0)if(d>=-g)if(d<=g){const v=1/h;u*=v,d*=v,f=u*(u+a*d+2*o)+d*(a*u+d+2*c)+l}else d=s,u=Math.max(0,-(a*d+o)),f=-u*u+d*(d+2*c)+l;else d=-s,u=Math.max(0,-(a*d+o)),f=-u*u+d*(d+2*c)+l;else d<=-g?(u=Math.max(0,-(-a*s+o)),d=u>0?-s:Math.min(Math.max(-s,-c),s),f=-u*u+d*(d+2*c)+l):d<=g?(u=0,d=Math.min(Math.max(-s,-c),s),f=d*(d+2*c)+l):(u=Math.max(0,-(a*s+o)),d=u>0?s:Math.min(Math.max(-s,-c),s),f=-u*u+d*(d+2*c)+l);else d=a>0?-s:s,u=Math.max(0,-(a*d+o)),f=-u*u+d*(d+2*c)+l;return n&&n.copy(this.origin).addScaledVector(this.direction,u),r&&r.copy(mo).addScaledVector(ra,d),f}intersectSphere(t,e){si.subVectors(t.center,this.origin);const n=si.dot(this.direction),r=si.dot(si)-n*n,s=t.radius*t.radius;if(r>s)return null;const a=Math.sqrt(s-r),o=n-a,c=n+a;return c<0?null:o<0?this.at(c,e):this.at(o,e)}intersectsSphere(t){return t.radius<0?!1:this.distanceSqToPoint(t.center)<=t.radius*t.radius}distanceToPlane(t){const e=t.normal.dot(this.direction);if(e===0)return t.distanceToPoint(this.origin)===0?0:null;const n=-(this.origin.dot(t.normal)+t.constant)/e;return n>=0?n:null}intersectPlane(t,e){const n=this.distanceToPlane(t);return n===null?null:this.at(n,e)}intersectsPlane(t){const e=t.distanceToPoint(this.origin);return e===0||t.normal.dot(this.direction)*e<0}intersectBox(t,e){let n,r,s,a,o,c;const l=1/this.direction.x,h=1/this.direction.y,u=1/this.direction.z,d=this.origin;return l>=0?(n=(t.min.x-d.x)*l,r=(t.max.x-d.x)*l):(n=(t.max.x-d.x)*l,r=(t.min.x-d.x)*l),h>=0?(s=(t.min.y-d.y)*h,a=(t.max.y-d.y)*h):(s=(t.max.y-d.y)*h,a=(t.min.y-d.y)*h),n>a||s>r||((s>n||isNaN(n))&&(n=s),(a<r||isNaN(r))&&(r=a),u>=0?(o=(t.min.z-d.z)*u,c=(t.max.z-d.z)*u):(o=(t.max.z-d.z)*u,c=(t.min.z-d.z)*u),n>c||o>r)||((o>n||n!==n)&&(n=o),(c<r||r!==r)&&(r=c),r<0)?null:this.at(n>=0?n:r,e)}intersectsBox(t){return this.intersectBox(t,si)!==null}intersectTriangle(t,e,n,r,s){go.subVectors(e,t),sa.subVectors(n,t),vo.crossVectors(go,sa);let a=this.direction.dot(vo),o;if(a>0){if(r)return null;o=1}else if(a<0)o=-1,a=-a;else return null;Ti.subVectors(this.origin,t);const c=o*this.direction.dot(sa.crossVectors(Ti,sa));if(c<0)return null;const l=o*this.direction.dot(go.cross(Ti));if(l<0||c+l>a)return null;const h=-o*Ti.dot(vo);return h<0?null:this.at(h/a,s)}applyMatrix4(t){return this.origin.applyMatrix4(t),this.direction.transformDirection(t),this}equals(t){return t.origin.equals(this.origin)&&t.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class ne{constructor(t,e,n,r,s,a,o,c,l,h,u,d,f,g,v,m){ne.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],t!==void 0&&this.set(t,e,n,r,s,a,o,c,l,h,u,d,f,g,v,m)}set(t,e,n,r,s,a,o,c,l,h,u,d,f,g,v,m){const p=this.elements;return p[0]=t,p[4]=e,p[8]=n,p[12]=r,p[1]=s,p[5]=a,p[9]=o,p[13]=c,p[2]=l,p[6]=h,p[10]=u,p[14]=d,p[3]=f,p[7]=g,p[11]=v,p[15]=m,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new ne().fromArray(this.elements)}copy(t){const e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],e[9]=n[9],e[10]=n[10],e[11]=n[11],e[12]=n[12],e[13]=n[13],e[14]=n[14],e[15]=n[15],this}copyPosition(t){const e=this.elements,n=t.elements;return e[12]=n[12],e[13]=n[13],e[14]=n[14],this}setFromMatrix3(t){const e=t.elements;return this.set(e[0],e[3],e[6],0,e[1],e[4],e[7],0,e[2],e[5],e[8],0,0,0,0,1),this}extractBasis(t,e,n){return t.setFromMatrixColumn(this,0),e.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this}makeBasis(t,e,n){return this.set(t.x,e.x,n.x,0,t.y,e.y,n.y,0,t.z,e.z,n.z,0,0,0,0,1),this}extractRotation(t){const e=this.elements,n=t.elements,r=1/Cr.setFromMatrixColumn(t,0).length(),s=1/Cr.setFromMatrixColumn(t,1).length(),a=1/Cr.setFromMatrixColumn(t,2).length();return e[0]=n[0]*r,e[1]=n[1]*r,e[2]=n[2]*r,e[3]=0,e[4]=n[4]*s,e[5]=n[5]*s,e[6]=n[6]*s,e[7]=0,e[8]=n[8]*a,e[9]=n[9]*a,e[10]=n[10]*a,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromEuler(t){const e=this.elements,n=t.x,r=t.y,s=t.z,a=Math.cos(n),o=Math.sin(n),c=Math.cos(r),l=Math.sin(r),h=Math.cos(s),u=Math.sin(s);if(t.order==="XYZ"){const d=a*h,f=a*u,g=o*h,v=o*u;e[0]=c*h,e[4]=-c*u,e[8]=l,e[1]=f+g*l,e[5]=d-v*l,e[9]=-o*c,e[2]=v-d*l,e[6]=g+f*l,e[10]=a*c}else if(t.order==="YXZ"){const d=c*h,f=c*u,g=l*h,v=l*u;e[0]=d+v*o,e[4]=g*o-f,e[8]=a*l,e[1]=a*u,e[5]=a*h,e[9]=-o,e[2]=f*o-g,e[6]=v+d*o,e[10]=a*c}else if(t.order==="ZXY"){const d=c*h,f=c*u,g=l*h,v=l*u;e[0]=d-v*o,e[4]=-a*u,e[8]=g+f*o,e[1]=f+g*o,e[5]=a*h,e[9]=v-d*o,e[2]=-a*l,e[6]=o,e[10]=a*c}else if(t.order==="ZYX"){const d=a*h,f=a*u,g=o*h,v=o*u;e[0]=c*h,e[4]=g*l-f,e[8]=d*l+v,e[1]=c*u,e[5]=v*l+d,e[9]=f*l-g,e[2]=-l,e[6]=o*c,e[10]=a*c}else if(t.order==="YZX"){const d=a*c,f=a*l,g=o*c,v=o*l;e[0]=c*h,e[4]=v-d*u,e[8]=g*u+f,e[1]=u,e[5]=a*h,e[9]=-o*h,e[2]=-l*h,e[6]=f*u+g,e[10]=d-v*u}else if(t.order==="XZY"){const d=a*c,f=a*l,g=o*c,v=o*l;e[0]=c*h,e[4]=-u,e[8]=l*h,e[1]=d*u+v,e[5]=a*h,e[9]=f*u-g,e[2]=g*u-f,e[6]=o*h,e[10]=v*u+d}return e[3]=0,e[7]=0,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromQuaternion(t){return this.compose(ep,t,np)}lookAt(t,e,n){const r=this.elements;return gn.subVectors(t,e),gn.lengthSq()===0&&(gn.z=1),gn.normalize(),Ai.crossVectors(n,gn),Ai.lengthSq()===0&&(Math.abs(n.z)===1?gn.x+=1e-4:gn.z+=1e-4,gn.normalize(),Ai.crossVectors(n,gn)),Ai.normalize(),aa.crossVectors(gn,Ai),r[0]=Ai.x,r[4]=aa.x,r[8]=gn.x,r[1]=Ai.y,r[5]=aa.y,r[9]=gn.y,r[2]=Ai.z,r[6]=aa.z,r[10]=gn.z,this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const n=t.elements,r=e.elements,s=this.elements,a=n[0],o=n[4],c=n[8],l=n[12],h=n[1],u=n[5],d=n[9],f=n[13],g=n[2],v=n[6],m=n[10],p=n[14],b=n[3],y=n[7],_=n[11],E=n[15],w=r[0],A=r[4],R=r[8],x=r[12],M=r[1],S=r[5],T=r[9],D=r[13],U=r[2],N=r[6],z=r[10],$=r[14],V=r[3],tt=r[7],rt=r[11],lt=r[15];return s[0]=a*w+o*M+c*U+l*V,s[4]=a*A+o*S+c*N+l*tt,s[8]=a*R+o*T+c*z+l*rt,s[12]=a*x+o*D+c*$+l*lt,s[1]=h*w+u*M+d*U+f*V,s[5]=h*A+u*S+d*N+f*tt,s[9]=h*R+u*T+d*z+f*rt,s[13]=h*x+u*D+d*$+f*lt,s[2]=g*w+v*M+m*U+p*V,s[6]=g*A+v*S+m*N+p*tt,s[10]=g*R+v*T+m*z+p*rt,s[14]=g*x+v*D+m*$+p*lt,s[3]=b*w+y*M+_*U+E*V,s[7]=b*A+y*S+_*N+E*tt,s[11]=b*R+y*T+_*z+E*rt,s[15]=b*x+y*D+_*$+E*lt,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[4]*=t,e[8]*=t,e[12]*=t,e[1]*=t,e[5]*=t,e[9]*=t,e[13]*=t,e[2]*=t,e[6]*=t,e[10]*=t,e[14]*=t,e[3]*=t,e[7]*=t,e[11]*=t,e[15]*=t,this}determinant(){const t=this.elements,e=t[0],n=t[4],r=t[8],s=t[12],a=t[1],o=t[5],c=t[9],l=t[13],h=t[2],u=t[6],d=t[10],f=t[14],g=t[3],v=t[7],m=t[11],p=t[15];return g*(+s*c*u-r*l*u-s*o*d+n*l*d+r*o*f-n*c*f)+v*(+e*c*f-e*l*d+s*a*d-r*a*f+r*l*h-s*c*h)+m*(+e*l*u-e*o*f-s*a*u+n*a*f+s*o*h-n*l*h)+p*(-r*o*h-e*c*u+e*o*d+r*a*u-n*a*d+n*c*h)}transpose(){const t=this.elements;let e;return e=t[1],t[1]=t[4],t[4]=e,e=t[2],t[2]=t[8],t[8]=e,e=t[6],t[6]=t[9],t[9]=e,e=t[3],t[3]=t[12],t[12]=e,e=t[7],t[7]=t[13],t[13]=e,e=t[11],t[11]=t[14],t[14]=e,this}setPosition(t,e,n){const r=this.elements;return t.isVector3?(r[12]=t.x,r[13]=t.y,r[14]=t.z):(r[12]=t,r[13]=e,r[14]=n),this}invert(){const t=this.elements,e=t[0],n=t[1],r=t[2],s=t[3],a=t[4],o=t[5],c=t[6],l=t[7],h=t[8],u=t[9],d=t[10],f=t[11],g=t[12],v=t[13],m=t[14],p=t[15],b=u*m*l-v*d*l+v*c*f-o*m*f-u*c*p+o*d*p,y=g*d*l-h*m*l-g*c*f+a*m*f+h*c*p-a*d*p,_=h*v*l-g*u*l+g*o*f-a*v*f-h*o*p+a*u*p,E=g*u*c-h*v*c-g*o*d+a*v*d+h*o*m-a*u*m,w=e*b+n*y+r*_+s*E;if(w===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const A=1/w;return t[0]=b*A,t[1]=(v*d*s-u*m*s-v*r*f+n*m*f+u*r*p-n*d*p)*A,t[2]=(o*m*s-v*c*s+v*r*l-n*m*l-o*r*p+n*c*p)*A,t[3]=(u*c*s-o*d*s-u*r*l+n*d*l+o*r*f-n*c*f)*A,t[4]=y*A,t[5]=(h*m*s-g*d*s+g*r*f-e*m*f-h*r*p+e*d*p)*A,t[6]=(g*c*s-a*m*s-g*r*l+e*m*l+a*r*p-e*c*p)*A,t[7]=(a*d*s-h*c*s+h*r*l-e*d*l-a*r*f+e*c*f)*A,t[8]=_*A,t[9]=(g*u*s-h*v*s-g*n*f+e*v*f+h*n*p-e*u*p)*A,t[10]=(a*v*s-g*o*s+g*n*l-e*v*l-a*n*p+e*o*p)*A,t[11]=(h*o*s-a*u*s-h*n*l+e*u*l+a*n*f-e*o*f)*A,t[12]=E*A,t[13]=(h*v*r-g*u*r+g*n*d-e*v*d-h*n*m+e*u*m)*A,t[14]=(g*o*r-a*v*r-g*n*c+e*v*c+a*n*m-e*o*m)*A,t[15]=(a*u*r-h*o*r+h*n*c-e*u*c-a*n*d+e*o*d)*A,this}scale(t){const e=this.elements,n=t.x,r=t.y,s=t.z;return e[0]*=n,e[4]*=r,e[8]*=s,e[1]*=n,e[5]*=r,e[9]*=s,e[2]*=n,e[6]*=r,e[10]*=s,e[3]*=n,e[7]*=r,e[11]*=s,this}getMaxScaleOnAxis(){const t=this.elements,e=t[0]*t[0]+t[1]*t[1]+t[2]*t[2],n=t[4]*t[4]+t[5]*t[5]+t[6]*t[6],r=t[8]*t[8]+t[9]*t[9]+t[10]*t[10];return Math.sqrt(Math.max(e,n,r))}makeTranslation(t,e,n){return t.isVector3?this.set(1,0,0,t.x,0,1,0,t.y,0,0,1,t.z,0,0,0,1):this.set(1,0,0,t,0,1,0,e,0,0,1,n,0,0,0,1),this}makeRotationX(t){const e=Math.cos(t),n=Math.sin(t);return this.set(1,0,0,0,0,e,-n,0,0,n,e,0,0,0,0,1),this}makeRotationY(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,0,n,0,0,1,0,0,-n,0,e,0,0,0,0,1),this}makeRotationZ(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,0,n,e,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(t,e){const n=Math.cos(e),r=Math.sin(e),s=1-n,a=t.x,o=t.y,c=t.z,l=s*a,h=s*o;return this.set(l*a+n,l*o-r*c,l*c+r*o,0,l*o+r*c,h*o+n,h*c-r*a,0,l*c-r*o,h*c+r*a,s*c*c+n,0,0,0,0,1),this}makeScale(t,e,n){return this.set(t,0,0,0,0,e,0,0,0,0,n,0,0,0,0,1),this}makeShear(t,e,n,r,s,a){return this.set(1,n,s,0,t,1,a,0,e,r,1,0,0,0,0,1),this}compose(t,e,n){const r=this.elements,s=e._x,a=e._y,o=e._z,c=e._w,l=s+s,h=a+a,u=o+o,d=s*l,f=s*h,g=s*u,v=a*h,m=a*u,p=o*u,b=c*l,y=c*h,_=c*u,E=n.x,w=n.y,A=n.z;return r[0]=(1-(v+p))*E,r[1]=(f+_)*E,r[2]=(g-y)*E,r[3]=0,r[4]=(f-_)*w,r[5]=(1-(d+p))*w,r[6]=(m+b)*w,r[7]=0,r[8]=(g+y)*A,r[9]=(m-b)*A,r[10]=(1-(d+v))*A,r[11]=0,r[12]=t.x,r[13]=t.y,r[14]=t.z,r[15]=1,this}decompose(t,e,n){const r=this.elements;let s=Cr.set(r[0],r[1],r[2]).length();const a=Cr.set(r[4],r[5],r[6]).length(),o=Cr.set(r[8],r[9],r[10]).length();this.determinant()<0&&(s=-s),t.x=r[12],t.y=r[13],t.z=r[14],Fn.copy(this);const l=1/s,h=1/a,u=1/o;return Fn.elements[0]*=l,Fn.elements[1]*=l,Fn.elements[2]*=l,Fn.elements[4]*=h,Fn.elements[5]*=h,Fn.elements[6]*=h,Fn.elements[8]*=u,Fn.elements[9]*=u,Fn.elements[10]*=u,e.setFromRotationMatrix(Fn),n.x=s,n.y=a,n.z=o,this}makePerspective(t,e,n,r,s,a,o=ei,c=!1){const l=this.elements,h=2*s/(e-t),u=2*s/(n-r),d=(e+t)/(e-t),f=(n+r)/(n-r);let g,v;if(c)g=s/(a-s),v=a*s/(a-s);else if(o===ei)g=-(a+s)/(a-s),v=-2*a*s/(a-s);else if(o===qa)g=-a/(a-s),v=-a*s/(a-s);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+o);return l[0]=h,l[4]=0,l[8]=d,l[12]=0,l[1]=0,l[5]=u,l[9]=f,l[13]=0,l[2]=0,l[6]=0,l[10]=g,l[14]=v,l[3]=0,l[7]=0,l[11]=-1,l[15]=0,this}makeOrthographic(t,e,n,r,s,a,o=ei,c=!1){const l=this.elements,h=2/(e-t),u=2/(n-r),d=-(e+t)/(e-t),f=-(n+r)/(n-r);let g,v;if(c)g=1/(a-s),v=a/(a-s);else if(o===ei)g=-2/(a-s),v=-(a+s)/(a-s);else if(o===qa)g=-1/(a-s),v=-s/(a-s);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+o);return l[0]=h,l[4]=0,l[8]=0,l[12]=d,l[1]=0,l[5]=u,l[9]=0,l[13]=f,l[2]=0,l[6]=0,l[10]=g,l[14]=v,l[3]=0,l[7]=0,l[11]=0,l[15]=1,this}equals(t){const e=this.elements,n=t.elements;for(let r=0;r<16;r++)if(e[r]!==n[r])return!1;return!0}fromArray(t,e=0){for(let n=0;n<16;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){const n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t[e+9]=n[9],t[e+10]=n[10],t[e+11]=n[11],t[e+12]=n[12],t[e+13]=n[13],t[e+14]=n[14],t[e+15]=n[15],t}}const Cr=new I,Fn=new ne,ep=new I(0,0,0),np=new I(1,1,1),Ai=new I,aa=new I,gn=new I,ch=new ne,lh=new ze;class In{constructor(t=0,e=0,n=0,r=In.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=e,this._z=n,this._order=r}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get order(){return this._order}set order(t){this._order=t,this._onChangeCallback()}set(t,e,n,r=this._order){return this._x=t,this._y=e,this._z=n,this._order=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(t){return this._x=t._x,this._y=t._y,this._z=t._z,this._order=t._order,this._onChangeCallback(),this}setFromRotationMatrix(t,e=this._order,n=!0){const r=t.elements,s=r[0],a=r[4],o=r[8],c=r[1],l=r[5],h=r[9],u=r[2],d=r[6],f=r[10];switch(e){case"XYZ":this._y=Math.asin(te(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-h,f),this._z=Math.atan2(-a,s)):(this._x=Math.atan2(d,l),this._z=0);break;case"YXZ":this._x=Math.asin(-te(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(o,f),this._z=Math.atan2(c,l)):(this._y=Math.atan2(-u,s),this._z=0);break;case"ZXY":this._x=Math.asin(te(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(-u,f),this._z=Math.atan2(-a,l)):(this._y=0,this._z=Math.atan2(c,s));break;case"ZYX":this._y=Math.asin(-te(u,-1,1)),Math.abs(u)<.9999999?(this._x=Math.atan2(d,f),this._z=Math.atan2(c,s)):(this._x=0,this._z=Math.atan2(-a,l));break;case"YZX":this._z=Math.asin(te(c,-1,1)),Math.abs(c)<.9999999?(this._x=Math.atan2(-h,l),this._y=Math.atan2(-u,s)):(this._x=0,this._y=Math.atan2(o,f));break;case"XZY":this._z=Math.asin(-te(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(d,l),this._y=Math.atan2(o,s)):(this._x=Math.atan2(-h,f),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+e)}return this._order=e,n===!0&&this._onChangeCallback(),this}setFromQuaternion(t,e,n){return ch.makeRotationFromQuaternion(t),this.setFromRotationMatrix(ch,e,n)}setFromVector3(t,e=this._order){return this.set(t.x,t.y,t.z,e)}reorder(t){return lh.setFromEuler(this),this.setFromQuaternion(lh,t)}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._order===this._order}fromArray(t){return this._x=t[0],this._y=t[1],this._z=t[2],t[3]!==void 0&&(this._order=t[3]),this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._order,t}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}In.DEFAULT_ORDER="XYZ";class gf{constructor(){this.mask=1}set(t){this.mask=(1<<t|0)>>>0}enable(t){this.mask|=1<<t|0}enableAll(){this.mask=-1}toggle(t){this.mask^=1<<t|0}disable(t){this.mask&=~(1<<t|0)}disableAll(){this.mask=0}test(t){return(this.mask&t.mask)!==0}isEnabled(t){return(this.mask&(1<<t|0))!==0}}let ip=0;const hh=new I,Lr=new ze,ai=new ne,oa=new I,ys=new I,rp=new I,sp=new ze,uh=new I(1,0,0),fh=new I(0,1,0),dh=new I(0,0,1),ph={type:"added"},ap={type:"removed"},Pr={type:"childadded",child:null},xo={type:"childremoved",child:null};class Re extends ds{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:ip++}),this.uuid=_r(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=Re.DEFAULT_UP.clone();const t=new I,e=new In,n=new ze,r=new I(1,1,1);function s(){n.setFromEuler(e,!1)}function a(){e.setFromQuaternion(n,void 0,!1)}e._onChange(s),n._onChange(a),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:e},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:r},modelViewMatrix:{value:new ne},normalMatrix:{value:new Jt}}),this.matrix=new ne,this.matrixWorld=new ne,this.matrixAutoUpdate=Re.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=Re.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new gf,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(t){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(t),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(t){return this.quaternion.premultiply(t),this}setRotationFromAxisAngle(t,e){this.quaternion.setFromAxisAngle(t,e)}setRotationFromEuler(t){this.quaternion.setFromEuler(t,!0)}setRotationFromMatrix(t){this.quaternion.setFromRotationMatrix(t)}setRotationFromQuaternion(t){this.quaternion.copy(t)}rotateOnAxis(t,e){return Lr.setFromAxisAngle(t,e),this.quaternion.multiply(Lr),this}rotateOnWorldAxis(t,e){return Lr.setFromAxisAngle(t,e),this.quaternion.premultiply(Lr),this}rotateX(t){return this.rotateOnAxis(uh,t)}rotateY(t){return this.rotateOnAxis(fh,t)}rotateZ(t){return this.rotateOnAxis(dh,t)}translateOnAxis(t,e){return hh.copy(t).applyQuaternion(this.quaternion),this.position.add(hh.multiplyScalar(e)),this}translateX(t){return this.translateOnAxis(uh,t)}translateY(t){return this.translateOnAxis(fh,t)}translateZ(t){return this.translateOnAxis(dh,t)}localToWorld(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(this.matrixWorld)}worldToLocal(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(ai.copy(this.matrixWorld).invert())}lookAt(t,e,n){t.isVector3?oa.copy(t):oa.set(t,e,n);const r=this.parent;this.updateWorldMatrix(!0,!1),ys.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?ai.lookAt(ys,oa,this.up):ai.lookAt(oa,ys,this.up),this.quaternion.setFromRotationMatrix(ai),r&&(ai.extractRotation(r.matrixWorld),Lr.setFromRotationMatrix(ai),this.quaternion.premultiply(Lr.invert()))}add(t){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.add(arguments[e]);return this}return t===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",t),this):(t&&t.isObject3D?(t.removeFromParent(),t.parent=this,this.children.push(t),t.dispatchEvent(ph),Pr.child=t,this.dispatchEvent(Pr),Pr.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",t),this)}remove(t){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}const e=this.children.indexOf(t);return e!==-1&&(t.parent=null,this.children.splice(e,1),t.dispatchEvent(ap),xo.child=t,this.dispatchEvent(xo),xo.child=null),this}removeFromParent(){const t=this.parent;return t!==null&&t.remove(this),this}clear(){return this.remove(...this.children)}attach(t){return this.updateWorldMatrix(!0,!1),ai.copy(this.matrixWorld).invert(),t.parent!==null&&(t.parent.updateWorldMatrix(!0,!1),ai.multiply(t.parent.matrixWorld)),t.applyMatrix4(ai),t.removeFromParent(),t.parent=this,this.children.push(t),t.updateWorldMatrix(!1,!0),t.dispatchEvent(ph),Pr.child=t,this.dispatchEvent(Pr),Pr.child=null,this}getObjectById(t){return this.getObjectByProperty("id",t)}getObjectByName(t){return this.getObjectByProperty("name",t)}getObjectByProperty(t,e){if(this[t]===e)return this;for(let n=0,r=this.children.length;n<r;n++){const a=this.children[n].getObjectByProperty(t,e);if(a!==void 0)return a}}getObjectsByProperty(t,e,n=[]){this[t]===e&&n.push(this);const r=this.children;for(let s=0,a=r.length;s<a;s++)r[s].getObjectsByProperty(t,e,n);return n}getWorldPosition(t){return this.updateWorldMatrix(!0,!1),t.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(ys,t,rp),t}getWorldScale(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(ys,sp,t),t}getWorldDirection(t){this.updateWorldMatrix(!0,!1);const e=this.matrixWorld.elements;return t.set(e[8],e[9],e[10]).normalize()}raycast(){}traverse(t){t(this);const e=this.children;for(let n=0,r=e.length;n<r;n++)e[n].traverse(t)}traverseVisible(t){if(this.visible===!1)return;t(this);const e=this.children;for(let n=0,r=e.length;n<r;n++)e[n].traverseVisible(t)}traverseAncestors(t){const e=this.parent;e!==null&&(t(e),e.traverseAncestors(t))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(t){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||t)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,t=!0);const e=this.children;for(let n=0,r=e.length;n<r;n++)e[n].updateMatrixWorld(t)}updateWorldMatrix(t,e){const n=this.parent;if(t===!0&&n!==null&&n.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),e===!0){const r=this.children;for(let s=0,a=r.length;s<a;s++)r[s].updateWorldMatrix(!1,!0)}}toJSON(t){const e=t===void 0||typeof t=="string",n={};e&&(t={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});const r={};r.uuid=this.uuid,r.type=this.type,this.name!==""&&(r.name=this.name),this.castShadow===!0&&(r.castShadow=!0),this.receiveShadow===!0&&(r.receiveShadow=!0),this.visible===!1&&(r.visible=!1),this.frustumCulled===!1&&(r.frustumCulled=!1),this.renderOrder!==0&&(r.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(r.userData=this.userData),r.layers=this.layers.mask,r.matrix=this.matrix.toArray(),r.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(r.matrixAutoUpdate=!1),this.isInstancedMesh&&(r.type="InstancedMesh",r.count=this.count,r.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(r.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(r.type="BatchedMesh",r.perObjectFrustumCulled=this.perObjectFrustumCulled,r.sortObjects=this.sortObjects,r.drawRanges=this._drawRanges,r.reservedRanges=this._reservedRanges,r.geometryInfo=this._geometryInfo.map(o=>({...o,boundingBox:o.boundingBox?o.boundingBox.toJSON():void 0,boundingSphere:o.boundingSphere?o.boundingSphere.toJSON():void 0})),r.instanceInfo=this._instanceInfo.map(o=>({...o})),r.availableInstanceIds=this._availableInstanceIds.slice(),r.availableGeometryIds=this._availableGeometryIds.slice(),r.nextIndexStart=this._nextIndexStart,r.nextVertexStart=this._nextVertexStart,r.geometryCount=this._geometryCount,r.maxInstanceCount=this._maxInstanceCount,r.maxVertexCount=this._maxVertexCount,r.maxIndexCount=this._maxIndexCount,r.geometryInitialized=this._geometryInitialized,r.matricesTexture=this._matricesTexture.toJSON(t),r.indirectTexture=this._indirectTexture.toJSON(t),this._colorsTexture!==null&&(r.colorsTexture=this._colorsTexture.toJSON(t)),this.boundingSphere!==null&&(r.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(r.boundingBox=this.boundingBox.toJSON()));function s(o,c){return o[c.uuid]===void 0&&(o[c.uuid]=c.toJSON(t)),c.uuid}if(this.isScene)this.background&&(this.background.isColor?r.background=this.background.toJSON():this.background.isTexture&&(r.background=this.background.toJSON(t).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(r.environment=this.environment.toJSON(t).uuid);else if(this.isMesh||this.isLine||this.isPoints){r.geometry=s(t.geometries,this.geometry);const o=this.geometry.parameters;if(o!==void 0&&o.shapes!==void 0){const c=o.shapes;if(Array.isArray(c))for(let l=0,h=c.length;l<h;l++){const u=c[l];s(t.shapes,u)}else s(t.shapes,c)}}if(this.isSkinnedMesh&&(r.bindMode=this.bindMode,r.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(s(t.skeletons,this.skeleton),r.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const o=[];for(let c=0,l=this.material.length;c<l;c++)o.push(s(t.materials,this.material[c]));r.material=o}else r.material=s(t.materials,this.material);if(this.children.length>0){r.children=[];for(let o=0;o<this.children.length;o++)r.children.push(this.children[o].toJSON(t).object)}if(this.animations.length>0){r.animations=[];for(let o=0;o<this.animations.length;o++){const c=this.animations[o];r.animations.push(s(t.animations,c))}}if(e){const o=a(t.geometries),c=a(t.materials),l=a(t.textures),h=a(t.images),u=a(t.shapes),d=a(t.skeletons),f=a(t.animations),g=a(t.nodes);o.length>0&&(n.geometries=o),c.length>0&&(n.materials=c),l.length>0&&(n.textures=l),h.length>0&&(n.images=h),u.length>0&&(n.shapes=u),d.length>0&&(n.skeletons=d),f.length>0&&(n.animations=f),g.length>0&&(n.nodes=g)}return n.object=r,n;function a(o){const c=[];for(const l in o){const h=o[l];delete h.metadata,c.push(h)}return c}}clone(t){return new this.constructor().copy(this,t)}copy(t,e=!0){if(this.name=t.name,this.up.copy(t.up),this.position.copy(t.position),this.rotation.order=t.rotation.order,this.quaternion.copy(t.quaternion),this.scale.copy(t.scale),this.matrix.copy(t.matrix),this.matrixWorld.copy(t.matrixWorld),this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrixWorldAutoUpdate=t.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=t.matrixWorldNeedsUpdate,this.layers.mask=t.layers.mask,this.visible=t.visible,this.castShadow=t.castShadow,this.receiveShadow=t.receiveShadow,this.frustumCulled=t.frustumCulled,this.renderOrder=t.renderOrder,this.animations=t.animations.slice(),this.userData=JSON.parse(JSON.stringify(t.userData)),e===!0)for(let n=0;n<t.children.length;n++){const r=t.children[n];this.add(r.clone())}return this}}Re.DEFAULT_UP=new I(0,1,0);Re.DEFAULT_MATRIX_AUTO_UPDATE=!0;Re.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const On=new I,oi=new I,_o=new I,ci=new I,Dr=new I,Ir=new I,mh=new I,Mo=new I,bo=new I,yo=new I,So=new ae,wo=new ae,Eo=new ae;class kn{constructor(t=new I,e=new I,n=new I){this.a=t,this.b=e,this.c=n}static getNormal(t,e,n,r){r.subVectors(n,e),On.subVectors(t,e),r.cross(On);const s=r.lengthSq();return s>0?r.multiplyScalar(1/Math.sqrt(s)):r.set(0,0,0)}static getBarycoord(t,e,n,r,s){On.subVectors(r,e),oi.subVectors(n,e),_o.subVectors(t,e);const a=On.dot(On),o=On.dot(oi),c=On.dot(_o),l=oi.dot(oi),h=oi.dot(_o),u=a*l-o*o;if(u===0)return s.set(0,0,0),null;const d=1/u,f=(l*c-o*h)*d,g=(a*h-o*c)*d;return s.set(1-f-g,g,f)}static containsPoint(t,e,n,r){return this.getBarycoord(t,e,n,r,ci)===null?!1:ci.x>=0&&ci.y>=0&&ci.x+ci.y<=1}static getInterpolation(t,e,n,r,s,a,o,c){return this.getBarycoord(t,e,n,r,ci)===null?(c.x=0,c.y=0,"z"in c&&(c.z=0),"w"in c&&(c.w=0),null):(c.setScalar(0),c.addScaledVector(s,ci.x),c.addScaledVector(a,ci.y),c.addScaledVector(o,ci.z),c)}static getInterpolatedAttribute(t,e,n,r,s,a){return So.setScalar(0),wo.setScalar(0),Eo.setScalar(0),So.fromBufferAttribute(t,e),wo.fromBufferAttribute(t,n),Eo.fromBufferAttribute(t,r),a.setScalar(0),a.addScaledVector(So,s.x),a.addScaledVector(wo,s.y),a.addScaledVector(Eo,s.z),a}static isFrontFacing(t,e,n,r){return On.subVectors(n,e),oi.subVectors(t,e),On.cross(oi).dot(r)<0}set(t,e,n){return this.a.copy(t),this.b.copy(e),this.c.copy(n),this}setFromPointsAndIndices(t,e,n,r){return this.a.copy(t[e]),this.b.copy(t[n]),this.c.copy(t[r]),this}setFromAttributeAndIndices(t,e,n,r){return this.a.fromBufferAttribute(t,e),this.b.fromBufferAttribute(t,n),this.c.fromBufferAttribute(t,r),this}clone(){return new this.constructor().copy(this)}copy(t){return this.a.copy(t.a),this.b.copy(t.b),this.c.copy(t.c),this}getArea(){return On.subVectors(this.c,this.b),oi.subVectors(this.a,this.b),On.cross(oi).length()*.5}getMidpoint(t){return t.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(t){return kn.getNormal(this.a,this.b,this.c,t)}getPlane(t){return t.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,e){return kn.getBarycoord(t,this.a,this.b,this.c,e)}getInterpolation(t,e,n,r,s){return kn.getInterpolation(t,this.a,this.b,this.c,e,n,r,s)}containsPoint(t){return kn.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return kn.isFrontFacing(this.a,this.b,this.c,t)}intersectsBox(t){return t.intersectsTriangle(this)}closestPointToPoint(t,e){const n=this.a,r=this.b,s=this.c;let a,o;Dr.subVectors(r,n),Ir.subVectors(s,n),Mo.subVectors(t,n);const c=Dr.dot(Mo),l=Ir.dot(Mo);if(c<=0&&l<=0)return e.copy(n);bo.subVectors(t,r);const h=Dr.dot(bo),u=Ir.dot(bo);if(h>=0&&u<=h)return e.copy(r);const d=c*u-h*l;if(d<=0&&c>=0&&h<=0)return a=c/(c-h),e.copy(n).addScaledVector(Dr,a);yo.subVectors(t,s);const f=Dr.dot(yo),g=Ir.dot(yo);if(g>=0&&f<=g)return e.copy(s);const v=f*l-c*g;if(v<=0&&l>=0&&g<=0)return o=l/(l-g),e.copy(n).addScaledVector(Ir,o);const m=h*g-f*u;if(m<=0&&u-h>=0&&f-g>=0)return mh.subVectors(s,r),o=(u-h)/(u-h+(f-g)),e.copy(r).addScaledVector(mh,o);const p=1/(m+v+d);return a=v*p,o=d*p,e.copy(n).addScaledVector(Dr,a).addScaledVector(Ir,o)}equals(t){return t.a.equals(this.a)&&t.b.equals(this.b)&&t.c.equals(this.c)}}const vf={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Ri={h:0,s:0,l:0},ca={h:0,s:0,l:0};function To(i,t,e){return e<0&&(e+=1),e>1&&(e-=1),e<1/6?i+(t-i)*6*e:e<1/2?t:e<2/3?i+(t-i)*6*(2/3-e):i}class Ut{constructor(t,e,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(t,e,n)}set(t,e,n){if(e===void 0&&n===void 0){const r=t;r&&r.isColor?this.copy(r):typeof r=="number"?this.setHex(r):typeof r=="string"&&this.setStyle(r)}else this.setRGB(t,e,n);return this}setScalar(t){return this.r=t,this.g=t,this.b=t,this}setHex(t,e=un){return t=Math.floor(t),this.r=(t>>16&255)/255,this.g=(t>>8&255)/255,this.b=(t&255)/255,se.colorSpaceToWorking(this,e),this}setRGB(t,e,n,r=se.workingColorSpace){return this.r=t,this.g=e,this.b=n,se.colorSpaceToWorking(this,r),this}setHSL(t,e,n,r=se.workingColorSpace){if(t=pl(t,1),e=te(e,0,1),n=te(n,0,1),e===0)this.r=this.g=this.b=n;else{const s=n<=.5?n*(1+e):n+e-n*e,a=2*n-s;this.r=To(a,s,t+1/3),this.g=To(a,s,t),this.b=To(a,s,t-1/3)}return se.colorSpaceToWorking(this,r),this}setStyle(t,e=un){function n(s){s!==void 0&&parseFloat(s)<1&&console.warn("THREE.Color: Alpha component of "+t+" will be ignored.")}let r;if(r=/^(\w+)\(([^\)]*)\)/.exec(t)){let s;const a=r[1],o=r[2];switch(a){case"rgb":case"rgba":if(s=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(s[4]),this.setRGB(Math.min(255,parseInt(s[1],10))/255,Math.min(255,parseInt(s[2],10))/255,Math.min(255,parseInt(s[3],10))/255,e);if(s=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(s[4]),this.setRGB(Math.min(100,parseInt(s[1],10))/100,Math.min(100,parseInt(s[2],10))/100,Math.min(100,parseInt(s[3],10))/100,e);break;case"hsl":case"hsla":if(s=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(s[4]),this.setHSL(parseFloat(s[1])/360,parseFloat(s[2])/100,parseFloat(s[3])/100,e);break;default:console.warn("THREE.Color: Unknown color model "+t)}}else if(r=/^\#([A-Fa-f\d]+)$/.exec(t)){const s=r[1],a=s.length;if(a===3)return this.setRGB(parseInt(s.charAt(0),16)/15,parseInt(s.charAt(1),16)/15,parseInt(s.charAt(2),16)/15,e);if(a===6)return this.setHex(parseInt(s,16),e);console.warn("THREE.Color: Invalid hex color "+t)}else if(t&&t.length>0)return this.setColorName(t,e);return this}setColorName(t,e=un){const n=vf[t.toLowerCase()];return n!==void 0?this.setHex(n,e):console.warn("THREE.Color: Unknown color "+t),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(t){return this.r=t.r,this.g=t.g,this.b=t.b,this}copySRGBToLinear(t){return this.r=_i(t.r),this.g=_i(t.g),this.b=_i(t.b),this}copyLinearToSRGB(t){return this.r=Jr(t.r),this.g=Jr(t.g),this.b=Jr(t.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(t=un){return se.workingToColorSpace(Xe.copy(this),t),Math.round(te(Xe.r*255,0,255))*65536+Math.round(te(Xe.g*255,0,255))*256+Math.round(te(Xe.b*255,0,255))}getHexString(t=un){return("000000"+this.getHex(t).toString(16)).slice(-6)}getHSL(t,e=se.workingColorSpace){se.workingToColorSpace(Xe.copy(this),e);const n=Xe.r,r=Xe.g,s=Xe.b,a=Math.max(n,r,s),o=Math.min(n,r,s);let c,l;const h=(o+a)/2;if(o===a)c=0,l=0;else{const u=a-o;switch(l=h<=.5?u/(a+o):u/(2-a-o),a){case n:c=(r-s)/u+(r<s?6:0);break;case r:c=(s-n)/u+2;break;case s:c=(n-r)/u+4;break}c/=6}return t.h=c,t.s=l,t.l=h,t}getRGB(t,e=se.workingColorSpace){return se.workingToColorSpace(Xe.copy(this),e),t.r=Xe.r,t.g=Xe.g,t.b=Xe.b,t}getStyle(t=un){se.workingToColorSpace(Xe.copy(this),t);const e=Xe.r,n=Xe.g,r=Xe.b;return t!==un?`color(${t} ${e.toFixed(3)} ${n.toFixed(3)} ${r.toFixed(3)})`:`rgb(${Math.round(e*255)},${Math.round(n*255)},${Math.round(r*255)})`}offsetHSL(t,e,n){return this.getHSL(Ri),this.setHSL(Ri.h+t,Ri.s+e,Ri.l+n)}add(t){return this.r+=t.r,this.g+=t.g,this.b+=t.b,this}addColors(t,e){return this.r=t.r+e.r,this.g=t.g+e.g,this.b=t.b+e.b,this}addScalar(t){return this.r+=t,this.g+=t,this.b+=t,this}sub(t){return this.r=Math.max(0,this.r-t.r),this.g=Math.max(0,this.g-t.g),this.b=Math.max(0,this.b-t.b),this}multiply(t){return this.r*=t.r,this.g*=t.g,this.b*=t.b,this}multiplyScalar(t){return this.r*=t,this.g*=t,this.b*=t,this}lerp(t,e){return this.r+=(t.r-this.r)*e,this.g+=(t.g-this.g)*e,this.b+=(t.b-this.b)*e,this}lerpColors(t,e,n){return this.r=t.r+(e.r-t.r)*n,this.g=t.g+(e.g-t.g)*n,this.b=t.b+(e.b-t.b)*n,this}lerpHSL(t,e){this.getHSL(Ri),t.getHSL(ca);const n=Cs(Ri.h,ca.h,e),r=Cs(Ri.s,ca.s,e),s=Cs(Ri.l,ca.l,e);return this.setHSL(n,r,s),this}setFromVector3(t){return this.r=t.x,this.g=t.y,this.b=t.z,this}applyMatrix3(t){const e=this.r,n=this.g,r=this.b,s=t.elements;return this.r=s[0]*e+s[3]*n+s[6]*r,this.g=s[1]*e+s[4]*n+s[7]*r,this.b=s[2]*e+s[5]*n+s[8]*r,this}equals(t){return t.r===this.r&&t.g===this.g&&t.b===this.b}fromArray(t,e=0){return this.r=t[e],this.g=t[e+1],this.b=t[e+2],this}toArray(t=[],e=0){return t[e]=this.r,t[e+1]=this.g,t[e+2]=this.b,t}fromBufferAttribute(t,e){return this.r=t.getX(e),this.g=t.getY(e),this.b=t.getZ(e),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const Xe=new Ut;Ut.NAMES=vf;let op=0;class ms extends ds{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:op++}),this.uuid=_r(),this.name="",this.type="Material",this.blending=Kr,this.side=Xi,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=sc,this.blendDst=ac,this.blendEquation=ar,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Ut(0,0,0),this.blendAlpha=0,this.depthFunc=rs,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=th,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=wr,this.stencilZFail=wr,this.stencilZPass=wr,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(t){this._alphaTest>0!=t>0&&this.version++,this._alphaTest=t}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(t){if(t!==void 0)for(const e in t){const n=t[e];if(n===void 0){console.warn(`THREE.Material: parameter '${e}' has value of undefined.`);continue}const r=this[e];if(r===void 0){console.warn(`THREE.Material: '${e}' is not a property of THREE.${this.type}.`);continue}r&&r.isColor?r.set(n):r&&r.isVector3&&n&&n.isVector3?r.copy(n):this[e]=n}}toJSON(t){const e=t===void 0||typeof t=="string";e&&(t={textures:{},images:{}});const n={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(t).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(t).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(t).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(n.sheenColorMap=this.sheenColorMap.toJSON(t).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(n.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(t).uuid),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(t).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(t).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(t).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(t).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(t).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(t).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(t).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(t).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(t).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(t).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(t).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(t).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(t).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(t).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(t).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(t).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(t).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(t).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(t).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(t).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(t).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==Kr&&(n.blending=this.blending),this.side!==Xi&&(n.side=this.side),this.vertexColors===!0&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=!0),this.blendSrc!==sc&&(n.blendSrc=this.blendSrc),this.blendDst!==ac&&(n.blendDst=this.blendDst),this.blendEquation!==ar&&(n.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(n.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(n.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(n.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(n.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(n.blendAlpha=this.blendAlpha),this.depthFunc!==rs&&(n.depthFunc=this.depthFunc),this.depthTest===!1&&(n.depthTest=this.depthTest),this.depthWrite===!1&&(n.depthWrite=this.depthWrite),this.colorWrite===!1&&(n.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(n.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==th&&(n.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(n.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(n.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==wr&&(n.stencilFail=this.stencilFail),this.stencilZFail!==wr&&(n.stencilZFail=this.stencilZFail),this.stencilZPass!==wr&&(n.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(n.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=!0),this.alphaToCoverage===!0&&(n.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=!0),this.forceSinglePass===!0&&(n.forceSinglePass=!0),this.wireframe===!0&&(n.wireframe=!0),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=!0),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData);function r(s){const a=[];for(const o in s){const c=s[o];delete c.metadata,a.push(c)}return a}if(e){const s=r(t.textures),a=r(t.images);s.length>0&&(n.textures=s),a.length>0&&(n.images=a)}return n}clone(){return new this.constructor().copy(this)}copy(t){this.name=t.name,this.blending=t.blending,this.side=t.side,this.vertexColors=t.vertexColors,this.opacity=t.opacity,this.transparent=t.transparent,this.blendSrc=t.blendSrc,this.blendDst=t.blendDst,this.blendEquation=t.blendEquation,this.blendSrcAlpha=t.blendSrcAlpha,this.blendDstAlpha=t.blendDstAlpha,this.blendEquationAlpha=t.blendEquationAlpha,this.blendColor.copy(t.blendColor),this.blendAlpha=t.blendAlpha,this.depthFunc=t.depthFunc,this.depthTest=t.depthTest,this.depthWrite=t.depthWrite,this.stencilWriteMask=t.stencilWriteMask,this.stencilFunc=t.stencilFunc,this.stencilRef=t.stencilRef,this.stencilFuncMask=t.stencilFuncMask,this.stencilFail=t.stencilFail,this.stencilZFail=t.stencilZFail,this.stencilZPass=t.stencilZPass,this.stencilWrite=t.stencilWrite;const e=t.clippingPlanes;let n=null;if(e!==null){const r=e.length;n=new Array(r);for(let s=0;s!==r;++s)n[s]=e[s].clone()}return this.clippingPlanes=n,this.clipIntersection=t.clipIntersection,this.clipShadows=t.clipShadows,this.shadowSide=t.shadowSide,this.colorWrite=t.colorWrite,this.precision=t.precision,this.polygonOffset=t.polygonOffset,this.polygonOffsetFactor=t.polygonOffsetFactor,this.polygonOffsetUnits=t.polygonOffsetUnits,this.dithering=t.dithering,this.alphaTest=t.alphaTest,this.alphaHash=t.alphaHash,this.alphaToCoverage=t.alphaToCoverage,this.premultipliedAlpha=t.premultipliedAlpha,this.forceSinglePass=t.forceSinglePass,this.visible=t.visible,this.toneMapped=t.toneMapped,this.userData=JSON.parse(JSON.stringify(t.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(t){t===!0&&this.version++}}class Yi extends ms{constructor(t){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new Ut(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new In,this.combine=ef,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.fog=t.fog,this}}const di=cp();function cp(){const i=new ArrayBuffer(4),t=new Float32Array(i),e=new Uint32Array(i),n=new Uint32Array(512),r=new Uint32Array(512);for(let c=0;c<256;++c){const l=c-127;l<-27?(n[c]=0,n[c|256]=32768,r[c]=24,r[c|256]=24):l<-14?(n[c]=1024>>-l-14,n[c|256]=1024>>-l-14|32768,r[c]=-l-1,r[c|256]=-l-1):l<=15?(n[c]=l+15<<10,n[c|256]=l+15<<10|32768,r[c]=13,r[c|256]=13):l<128?(n[c]=31744,n[c|256]=64512,r[c]=24,r[c|256]=24):(n[c]=31744,n[c|256]=64512,r[c]=13,r[c|256]=13)}const s=new Uint32Array(2048),a=new Uint32Array(64),o=new Uint32Array(64);for(let c=1;c<1024;++c){let l=c<<13,h=0;for(;(l&8388608)===0;)l<<=1,h-=8388608;l&=-8388609,h+=947912704,s[c]=l|h}for(let c=1024;c<2048;++c)s[c]=939524096+(c-1024<<13);for(let c=1;c<31;++c)a[c]=c<<23;a[31]=1199570944,a[32]=2147483648;for(let c=33;c<63;++c)a[c]=2147483648+(c-32<<23);a[63]=3347054592;for(let c=1;c<64;++c)c!==32&&(o[c]=1024);return{floatView:t,uint32View:e,baseTable:n,shiftTable:r,mantissaTable:s,exponentTable:a,offsetTable:o}}function lp(i){Math.abs(i)>65504&&console.warn("THREE.DataUtils.toHalfFloat(): Value out of range."),i=te(i,-65504,65504),di.floatView[0]=i;const t=di.uint32View[0],e=t>>23&511;return di.baseTable[e]+((t&8388607)>>di.shiftTable[e])}function hp(i){const t=i>>10;return di.uint32View[0]=di.mantissaTable[di.offsetTable[t]+(i&1023)]+di.exponentTable[t],di.floatView[0]}class la{static toHalfFloat(t){return lp(t)}static fromHalfFloat(t){return hp(t)}}const Pe=new I,ha=new bt;let up=0;class ie{constructor(t,e,n=!1){if(Array.isArray(t))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:up++}),this.name="",this.array=t,this.itemSize=e,this.count=t!==void 0?t.length/e:0,this.normalized=n,this.usage=eh,this.updateRanges=[],this.gpuType=ti,this.version=0}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.name=t.name,this.array=new t.array.constructor(t.array),this.itemSize=t.itemSize,this.count=t.count,this.normalized=t.normalized,this.usage=t.usage,this.gpuType=t.gpuType,this}copyAt(t,e,n){t*=this.itemSize,n*=e.itemSize;for(let r=0,s=this.itemSize;r<s;r++)this.array[t+r]=e.array[n+r];return this}copyArray(t){return this.array.set(t),this}applyMatrix3(t){if(this.itemSize===2)for(let e=0,n=this.count;e<n;e++)ha.fromBufferAttribute(this,e),ha.applyMatrix3(t),this.setXY(e,ha.x,ha.y);else if(this.itemSize===3)for(let e=0,n=this.count;e<n;e++)Pe.fromBufferAttribute(this,e),Pe.applyMatrix3(t),this.setXYZ(e,Pe.x,Pe.y,Pe.z);return this}applyMatrix4(t){for(let e=0,n=this.count;e<n;e++)Pe.fromBufferAttribute(this,e),Pe.applyMatrix4(t),this.setXYZ(e,Pe.x,Pe.y,Pe.z);return this}applyNormalMatrix(t){for(let e=0,n=this.count;e<n;e++)Pe.fromBufferAttribute(this,e),Pe.applyNormalMatrix(t),this.setXYZ(e,Pe.x,Pe.y,Pe.z);return this}transformDirection(t){for(let e=0,n=this.count;e<n;e++)Pe.fromBufferAttribute(this,e),Pe.transformDirection(t),this.setXYZ(e,Pe.x,Pe.y,Pe.z);return this}set(t,e=0){return this.array.set(t,e),this}getComponent(t,e){let n=this.array[t*this.itemSize+e];return this.normalized&&(n=Xr(n,this.array)),n}setComponent(t,e,n){return this.normalized&&(n=Ke(n,this.array)),this.array[t*this.itemSize+e]=n,this}getX(t){let e=this.array[t*this.itemSize];return this.normalized&&(e=Xr(e,this.array)),e}setX(t,e){return this.normalized&&(e=Ke(e,this.array)),this.array[t*this.itemSize]=e,this}getY(t){let e=this.array[t*this.itemSize+1];return this.normalized&&(e=Xr(e,this.array)),e}setY(t,e){return this.normalized&&(e=Ke(e,this.array)),this.array[t*this.itemSize+1]=e,this}getZ(t){let e=this.array[t*this.itemSize+2];return this.normalized&&(e=Xr(e,this.array)),e}setZ(t,e){return this.normalized&&(e=Ke(e,this.array)),this.array[t*this.itemSize+2]=e,this}getW(t){let e=this.array[t*this.itemSize+3];return this.normalized&&(e=Xr(e,this.array)),e}setW(t,e){return this.normalized&&(e=Ke(e,this.array)),this.array[t*this.itemSize+3]=e,this}setXY(t,e,n){return t*=this.itemSize,this.normalized&&(e=Ke(e,this.array),n=Ke(n,this.array)),this.array[t+0]=e,this.array[t+1]=n,this}setXYZ(t,e,n,r){return t*=this.itemSize,this.normalized&&(e=Ke(e,this.array),n=Ke(n,this.array),r=Ke(r,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=r,this}setXYZW(t,e,n,r,s){return t*=this.itemSize,this.normalized&&(e=Ke(e,this.array),n=Ke(n,this.array),r=Ke(r,this.array),s=Ke(s,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=r,this.array[t+3]=s,this}onUpload(t){return this.onUploadCallback=t,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const t={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(t.name=this.name),this.usage!==eh&&(t.usage=this.usage),t}}class xf extends ie{constructor(t,e,n){super(new Uint16Array(t),e,n)}}class _f extends ie{constructor(t,e,n){super(new Uint32Array(t),e,n)}}class oe extends ie{constructor(t,e,n){super(new Float32Array(t),e,n)}}let fp=0;const Tn=new ne,Ao=new Re,Ur=new I,vn=new ps,Ss=new ps,Oe=new I;class Le extends ds{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:fp++}),this.uuid=_r(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(t){return Array.isArray(t)?this.index=new(mf(t)?_f:xf)(t,1):this.index=t,this}setIndirect(t){return this.indirect=t,this}getIndirect(){return this.indirect}getAttribute(t){return this.attributes[t]}setAttribute(t,e){return this.attributes[t]=e,this}deleteAttribute(t){return delete this.attributes[t],this}hasAttribute(t){return this.attributes[t]!==void 0}addGroup(t,e,n=0){this.groups.push({start:t,count:e,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(t,e){this.drawRange.start=t,this.drawRange.count=e}applyMatrix4(t){const e=this.attributes.position;e!==void 0&&(e.applyMatrix4(t),e.needsUpdate=!0);const n=this.attributes.normal;if(n!==void 0){const s=new Jt().getNormalMatrix(t);n.applyNormalMatrix(s),n.needsUpdate=!0}const r=this.attributes.tangent;return r!==void 0&&(r.transformDirection(t),r.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(t){return Tn.makeRotationFromQuaternion(t),this.applyMatrix4(Tn),this}rotateX(t){return Tn.makeRotationX(t),this.applyMatrix4(Tn),this}rotateY(t){return Tn.makeRotationY(t),this.applyMatrix4(Tn),this}rotateZ(t){return Tn.makeRotationZ(t),this.applyMatrix4(Tn),this}translate(t,e,n){return Tn.makeTranslation(t,e,n),this.applyMatrix4(Tn),this}scale(t,e,n){return Tn.makeScale(t,e,n),this.applyMatrix4(Tn),this}lookAt(t){return Ao.lookAt(t),Ao.updateMatrix(),this.applyMatrix4(Ao.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Ur).negate(),this.translate(Ur.x,Ur.y,Ur.z),this}setFromPoints(t){const e=this.getAttribute("position");if(e===void 0){const n=[];for(let r=0,s=t.length;r<s;r++){const a=t[r];n.push(a.x,a.y,a.z||0)}this.setAttribute("position",new oe(n,3))}else{const n=Math.min(t.length,e.count);for(let r=0;r<n;r++){const s=t[r];e.setXYZ(r,s.x,s.y,s.z||0)}t.length>e.count&&console.warn("THREE.BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),e.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new ps);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new I(-1/0,-1/0,-1/0),new I(1/0,1/0,1/0));return}if(t!==void 0){if(this.boundingBox.setFromBufferAttribute(t),e)for(let n=0,r=e.length;n<r;n++){const s=e[n];vn.setFromBufferAttribute(s),this.morphTargetsRelative?(Oe.addVectors(this.boundingBox.min,vn.min),this.boundingBox.expandByPoint(Oe),Oe.addVectors(this.boundingBox.max,vn.max),this.boundingBox.expandByPoint(Oe)):(this.boundingBox.expandByPoint(vn.min),this.boundingBox.expandByPoint(vn.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Mr);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new I,1/0);return}if(t){const n=this.boundingSphere.center;if(vn.setFromBufferAttribute(t),e)for(let s=0,a=e.length;s<a;s++){const o=e[s];Ss.setFromBufferAttribute(o),this.morphTargetsRelative?(Oe.addVectors(vn.min,Ss.min),vn.expandByPoint(Oe),Oe.addVectors(vn.max,Ss.max),vn.expandByPoint(Oe)):(vn.expandByPoint(Ss.min),vn.expandByPoint(Ss.max))}vn.getCenter(n);let r=0;for(let s=0,a=t.count;s<a;s++)Oe.fromBufferAttribute(t,s),r=Math.max(r,n.distanceToSquared(Oe));if(e)for(let s=0,a=e.length;s<a;s++){const o=e[s],c=this.morphTargetsRelative;for(let l=0,h=o.count;l<h;l++)Oe.fromBufferAttribute(o,l),c&&(Ur.fromBufferAttribute(t,l),Oe.add(Ur)),r=Math.max(r,n.distanceToSquared(Oe))}this.boundingSphere.radius=Math.sqrt(r),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const t=this.index,e=this.attributes;if(t===null||e.position===void 0||e.normal===void 0||e.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const n=e.position,r=e.normal,s=e.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new ie(new Float32Array(4*n.count),4));const a=this.getAttribute("tangent"),o=[],c=[];for(let R=0;R<n.count;R++)o[R]=new I,c[R]=new I;const l=new I,h=new I,u=new I,d=new bt,f=new bt,g=new bt,v=new I,m=new I;function p(R,x,M){l.fromBufferAttribute(n,R),h.fromBufferAttribute(n,x),u.fromBufferAttribute(n,M),d.fromBufferAttribute(s,R),f.fromBufferAttribute(s,x),g.fromBufferAttribute(s,M),h.sub(l),u.sub(l),f.sub(d),g.sub(d);const S=1/(f.x*g.y-g.x*f.y);isFinite(S)&&(v.copy(h).multiplyScalar(g.y).addScaledVector(u,-f.y).multiplyScalar(S),m.copy(u).multiplyScalar(f.x).addScaledVector(h,-g.x).multiplyScalar(S),o[R].add(v),o[x].add(v),o[M].add(v),c[R].add(m),c[x].add(m),c[M].add(m))}let b=this.groups;b.length===0&&(b=[{start:0,count:t.count}]);for(let R=0,x=b.length;R<x;++R){const M=b[R],S=M.start,T=M.count;for(let D=S,U=S+T;D<U;D+=3)p(t.getX(D+0),t.getX(D+1),t.getX(D+2))}const y=new I,_=new I,E=new I,w=new I;function A(R){E.fromBufferAttribute(r,R),w.copy(E);const x=o[R];y.copy(x),y.sub(E.multiplyScalar(E.dot(x))).normalize(),_.crossVectors(w,x);const S=_.dot(c[R])<0?-1:1;a.setXYZW(R,y.x,y.y,y.z,S)}for(let R=0,x=b.length;R<x;++R){const M=b[R],S=M.start,T=M.count;for(let D=S,U=S+T;D<U;D+=3)A(t.getX(D+0)),A(t.getX(D+1)),A(t.getX(D+2))}}computeVertexNormals(){const t=this.index,e=this.getAttribute("position");if(e!==void 0){let n=this.getAttribute("normal");if(n===void 0)n=new ie(new Float32Array(e.count*3),3),this.setAttribute("normal",n);else for(let d=0,f=n.count;d<f;d++)n.setXYZ(d,0,0,0);const r=new I,s=new I,a=new I,o=new I,c=new I,l=new I,h=new I,u=new I;if(t)for(let d=0,f=t.count;d<f;d+=3){const g=t.getX(d+0),v=t.getX(d+1),m=t.getX(d+2);r.fromBufferAttribute(e,g),s.fromBufferAttribute(e,v),a.fromBufferAttribute(e,m),h.subVectors(a,s),u.subVectors(r,s),h.cross(u),o.fromBufferAttribute(n,g),c.fromBufferAttribute(n,v),l.fromBufferAttribute(n,m),o.add(h),c.add(h),l.add(h),n.setXYZ(g,o.x,o.y,o.z),n.setXYZ(v,c.x,c.y,c.z),n.setXYZ(m,l.x,l.y,l.z)}else for(let d=0,f=e.count;d<f;d+=3)r.fromBufferAttribute(e,d+0),s.fromBufferAttribute(e,d+1),a.fromBufferAttribute(e,d+2),h.subVectors(a,s),u.subVectors(r,s),h.cross(u),n.setXYZ(d+0,h.x,h.y,h.z),n.setXYZ(d+1,h.x,h.y,h.z),n.setXYZ(d+2,h.x,h.y,h.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){const t=this.attributes.normal;for(let e=0,n=t.count;e<n;e++)Oe.fromBufferAttribute(t,e),Oe.normalize(),t.setXYZ(e,Oe.x,Oe.y,Oe.z)}toNonIndexed(){function t(o,c){const l=o.array,h=o.itemSize,u=o.normalized,d=new l.constructor(c.length*h);let f=0,g=0;for(let v=0,m=c.length;v<m;v++){o.isInterleavedBufferAttribute?f=c[v]*o.data.stride+o.offset:f=c[v]*h;for(let p=0;p<h;p++)d[g++]=l[f++]}return new ie(d,h,u)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const e=new Le,n=this.index.array,r=this.attributes;for(const o in r){const c=r[o],l=t(c,n);e.setAttribute(o,l)}const s=this.morphAttributes;for(const o in s){const c=[],l=s[o];for(let h=0,u=l.length;h<u;h++){const d=l[h],f=t(d,n);c.push(f)}e.morphAttributes[o]=c}e.morphTargetsRelative=this.morphTargetsRelative;const a=this.groups;for(let o=0,c=a.length;o<c;o++){const l=a[o];e.addGroup(l.start,l.count,l.materialIndex)}return e}toJSON(){const t={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(t.uuid=this.uuid,t.type=this.type,this.name!==""&&(t.name=this.name),Object.keys(this.userData).length>0&&(t.userData=this.userData),this.parameters!==void 0){const c=this.parameters;for(const l in c)c[l]!==void 0&&(t[l]=c[l]);return t}t.data={attributes:{}};const e=this.index;e!==null&&(t.data.index={type:e.array.constructor.name,array:Array.prototype.slice.call(e.array)});const n=this.attributes;for(const c in n){const l=n[c];t.data.attributes[c]=l.toJSON(t.data)}const r={};let s=!1;for(const c in this.morphAttributes){const l=this.morphAttributes[c],h=[];for(let u=0,d=l.length;u<d;u++){const f=l[u];h.push(f.toJSON(t.data))}h.length>0&&(r[c]=h,s=!0)}s&&(t.data.morphAttributes=r,t.data.morphTargetsRelative=this.morphTargetsRelative);const a=this.groups;a.length>0&&(t.data.groups=JSON.parse(JSON.stringify(a)));const o=this.boundingSphere;return o!==null&&(t.data.boundingSphere=o.toJSON()),t}clone(){return new this.constructor().copy(this)}copy(t){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const e={};this.name=t.name;const n=t.index;n!==null&&this.setIndex(n.clone());const r=t.attributes;for(const l in r){const h=r[l];this.setAttribute(l,h.clone(e))}const s=t.morphAttributes;for(const l in s){const h=[],u=s[l];for(let d=0,f=u.length;d<f;d++)h.push(u[d].clone(e));this.morphAttributes[l]=h}this.morphTargetsRelative=t.morphTargetsRelative;const a=t.groups;for(let l=0,h=a.length;l<h;l++){const u=a[l];this.addGroup(u.start,u.count,u.materialIndex)}const o=t.boundingBox;o!==null&&(this.boundingBox=o.clone());const c=t.boundingSphere;return c!==null&&(this.boundingSphere=c.clone()),this.drawRange.start=t.drawRange.start,this.drawRange.count=t.drawRange.count,this.userData=t.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const gh=new ne,Qi=new vl,ua=new Mr,vh=new I,fa=new I,da=new I,pa=new I,Ro=new I,ma=new I,xh=new I,ga=new I;class Pt extends Re{constructor(t=new Le,e=new Yi){super(),this.isMesh=!0,this.type="Mesh",this.geometry=t,this.material=e,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),t.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=t.morphTargetInfluences.slice()),t.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},t.morphTargetDictionary)),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}updateMorphTargets(){const e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){const r=e[n[0]];if(r!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,a=r.length;s<a;s++){const o=r[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=s}}}}getVertexPosition(t,e){const n=this.geometry,r=n.attributes.position,s=n.morphAttributes.position,a=n.morphTargetsRelative;e.fromBufferAttribute(r,t);const o=this.morphTargetInfluences;if(s&&o){ma.set(0,0,0);for(let c=0,l=s.length;c<l;c++){const h=o[c],u=s[c];h!==0&&(Ro.fromBufferAttribute(u,t),a?ma.addScaledVector(Ro,h):ma.addScaledVector(Ro.sub(e),h))}e.add(ma)}return e}raycast(t,e){const n=this.geometry,r=this.material,s=this.matrixWorld;r!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),ua.copy(n.boundingSphere),ua.applyMatrix4(s),Qi.copy(t.ray).recast(t.near),!(ua.containsPoint(Qi.origin)===!1&&(Qi.intersectSphere(ua,vh)===null||Qi.origin.distanceToSquared(vh)>(t.far-t.near)**2))&&(gh.copy(s).invert(),Qi.copy(t.ray).applyMatrix4(gh),!(n.boundingBox!==null&&Qi.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(t,e,Qi)))}_computeIntersections(t,e,n){let r;const s=this.geometry,a=this.material,o=s.index,c=s.attributes.position,l=s.attributes.uv,h=s.attributes.uv1,u=s.attributes.normal,d=s.groups,f=s.drawRange;if(o!==null)if(Array.isArray(a))for(let g=0,v=d.length;g<v;g++){const m=d[g],p=a[m.materialIndex],b=Math.max(m.start,f.start),y=Math.min(o.count,Math.min(m.start+m.count,f.start+f.count));for(let _=b,E=y;_<E;_+=3){const w=o.getX(_),A=o.getX(_+1),R=o.getX(_+2);r=va(this,p,t,n,l,h,u,w,A,R),r&&(r.faceIndex=Math.floor(_/3),r.face.materialIndex=m.materialIndex,e.push(r))}}else{const g=Math.max(0,f.start),v=Math.min(o.count,f.start+f.count);for(let m=g,p=v;m<p;m+=3){const b=o.getX(m),y=o.getX(m+1),_=o.getX(m+2);r=va(this,a,t,n,l,h,u,b,y,_),r&&(r.faceIndex=Math.floor(m/3),e.push(r))}}else if(c!==void 0)if(Array.isArray(a))for(let g=0,v=d.length;g<v;g++){const m=d[g],p=a[m.materialIndex],b=Math.max(m.start,f.start),y=Math.min(c.count,Math.min(m.start+m.count,f.start+f.count));for(let _=b,E=y;_<E;_+=3){const w=_,A=_+1,R=_+2;r=va(this,p,t,n,l,h,u,w,A,R),r&&(r.faceIndex=Math.floor(_/3),r.face.materialIndex=m.materialIndex,e.push(r))}}else{const g=Math.max(0,f.start),v=Math.min(c.count,f.start+f.count);for(let m=g,p=v;m<p;m+=3){const b=m,y=m+1,_=m+2;r=va(this,a,t,n,l,h,u,b,y,_),r&&(r.faceIndex=Math.floor(m/3),e.push(r))}}}}function dp(i,t,e,n,r,s,a,o){let c;if(t.side===dn?c=n.intersectTriangle(a,s,r,!0,o):c=n.intersectTriangle(r,s,a,t.side===Xi,o),c===null)return null;ga.copy(o),ga.applyMatrix4(i.matrixWorld);const l=e.ray.origin.distanceTo(ga);return l<e.near||l>e.far?null:{distance:l,point:ga.clone(),object:i}}function va(i,t,e,n,r,s,a,o,c,l){i.getVertexPosition(o,fa),i.getVertexPosition(c,da),i.getVertexPosition(l,pa);const h=dp(i,t,e,n,fa,da,pa,xh);if(h){const u=new I;kn.getBarycoord(xh,fa,da,pa,u),r&&(h.uv=kn.getInterpolatedAttribute(r,o,c,l,u,new bt)),s&&(h.uv1=kn.getInterpolatedAttribute(s,o,c,l,u,new bt)),a&&(h.normal=kn.getInterpolatedAttribute(a,o,c,l,u,new I),h.normal.dot(n.direction)>0&&h.normal.multiplyScalar(-1));const d={a:o,b:c,c:l,normal:new I,materialIndex:0};kn.getNormal(fa,da,pa,d.normal),h.face=d,h.barycoord=u}return h}class nn extends Le{constructor(t=1,e=1,n=1,r=1,s=1,a=1){super(),this.type="BoxGeometry",this.parameters={width:t,height:e,depth:n,widthSegments:r,heightSegments:s,depthSegments:a};const o=this;r=Math.floor(r),s=Math.floor(s),a=Math.floor(a);const c=[],l=[],h=[],u=[];let d=0,f=0;g("z","y","x",-1,-1,n,e,t,a,s,0),g("z","y","x",1,-1,n,e,-t,a,s,1),g("x","z","y",1,1,t,n,e,r,a,2),g("x","z","y",1,-1,t,n,-e,r,a,3),g("x","y","z",1,-1,t,e,n,r,s,4),g("x","y","z",-1,-1,t,e,-n,r,s,5),this.setIndex(c),this.setAttribute("position",new oe(l,3)),this.setAttribute("normal",new oe(h,3)),this.setAttribute("uv",new oe(u,2));function g(v,m,p,b,y,_,E,w,A,R,x){const M=_/A,S=E/R,T=_/2,D=E/2,U=w/2,N=A+1,z=R+1;let $=0,V=0;const tt=new I;for(let rt=0;rt<z;rt++){const lt=rt*S-D;for(let xt=0;xt<N;xt++){const Ct=xt*M-T;tt[v]=Ct*b,tt[m]=lt*y,tt[p]=U,l.push(tt.x,tt.y,tt.z),tt[v]=0,tt[m]=0,tt[p]=w>0?1:-1,h.push(tt.x,tt.y,tt.z),u.push(xt/A),u.push(1-rt/R),$+=1}}for(let rt=0;rt<R;rt++)for(let lt=0;lt<A;lt++){const xt=d+lt+N*rt,Ct=d+lt+N*(rt+1),Ot=d+(lt+1)+N*(rt+1),nt=d+(lt+1)+N*rt;c.push(xt,Ct,nt),c.push(Ct,Ot,nt),V+=6}o.addGroup(f,V,x),f+=V,d+=$}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new nn(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}}function ls(i){const t={};for(const e in i){t[e]={};for(const n in i[e]){const r=i[e][n];r&&(r.isColor||r.isMatrix3||r.isMatrix4||r.isVector2||r.isVector3||r.isVector4||r.isTexture||r.isQuaternion)?r.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),t[e][n]=null):t[e][n]=r.clone():Array.isArray(r)?t[e][n]=r.slice():t[e][n]=r}}return t}function Ze(i){const t={};for(let e=0;e<i.length;e++){const n=ls(i[e]);for(const r in n)t[r]=n[r]}return t}function pp(i){const t=[];for(let e=0;e<i.length;e++)t.push(i[e].clone());return t}function Mf(i){const t=i.getRenderTarget();return t===null?i.outputColorSpace:t.isXRRenderTarget===!0?t.texture.colorSpace:se.workingColorSpace}const mp={clone:ls,merge:Ze};var gp=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,vp=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class ke extends ms{constructor(t){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=gp,this.fragmentShader=vp,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,t!==void 0&&this.setValues(t)}copy(t){return super.copy(t),this.fragmentShader=t.fragmentShader,this.vertexShader=t.vertexShader,this.uniforms=ls(t.uniforms),this.uniformsGroups=pp(t.uniformsGroups),this.defines=Object.assign({},t.defines),this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.fog=t.fog,this.lights=t.lights,this.clipping=t.clipping,this.extensions=Object.assign({},t.extensions),this.glslVersion=t.glslVersion,this}toJSON(t){const e=super.toJSON(t);e.glslVersion=this.glslVersion,e.uniforms={};for(const r in this.uniforms){const a=this.uniforms[r].value;a&&a.isTexture?e.uniforms[r]={type:"t",value:a.toJSON(t).uuid}:a&&a.isColor?e.uniforms[r]={type:"c",value:a.getHex()}:a&&a.isVector2?e.uniforms[r]={type:"v2",value:a.toArray()}:a&&a.isVector3?e.uniforms[r]={type:"v3",value:a.toArray()}:a&&a.isVector4?e.uniforms[r]={type:"v4",value:a.toArray()}:a&&a.isMatrix3?e.uniforms[r]={type:"m3",value:a.toArray()}:a&&a.isMatrix4?e.uniforms[r]={type:"m4",value:a.toArray()}:e.uniforms[r]={value:a}}Object.keys(this.defines).length>0&&(e.defines=this.defines),e.vertexShader=this.vertexShader,e.fragmentShader=this.fragmentShader,e.lights=this.lights,e.clipping=this.clipping;const n={};for(const r in this.extensions)this.extensions[r]===!0&&(n[r]=!0);return Object.keys(n).length>0&&(e.extensions=n),e}}class bf extends Re{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new ne,this.projectionMatrix=new ne,this.projectionMatrixInverse=new ne,this.coordinateSystem=ei,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(t,e){return super.copy(t,e),this.matrixWorldInverse.copy(t.matrixWorldInverse),this.projectionMatrix.copy(t.projectionMatrix),this.projectionMatrixInverse.copy(t.projectionMatrixInverse),this.coordinateSystem=t.coordinateSystem,this}getWorldDirection(t){return super.getWorldDirection(t).negate()}updateMatrixWorld(t){super.updateMatrixWorld(t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(t,e){super.updateWorldMatrix(t,e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}const Ci=new I,_h=new bt,Mh=new bt;class Mn extends bf{constructor(t=50,e=1,n=.1,r=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=t,this.zoom=1,this.near=n,this.far=r,this.focus=10,this.aspect=e,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.fov=t.fov,this.zoom=t.zoom,this.near=t.near,this.far=t.far,this.focus=t.focus,this.aspect=t.aspect,this.view=t.view===null?null:Object.assign({},t.view),this.filmGauge=t.filmGauge,this.filmOffset=t.filmOffset,this}setFocalLength(t){const e=.5*this.getFilmHeight()/t;this.fov=cs*2*Math.atan(e),this.updateProjectionMatrix()}getFocalLength(){const t=Math.tan(Rs*.5*this.fov);return .5*this.getFilmHeight()/t}getEffectiveFOV(){return cs*2*Math.atan(Math.tan(Rs*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(t,e,n){Ci.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),e.set(Ci.x,Ci.y).multiplyScalar(-t/Ci.z),Ci.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(Ci.x,Ci.y).multiplyScalar(-t/Ci.z)}getViewSize(t,e){return this.getViewBounds(t,_h,Mh),e.subVectors(Mh,_h)}setViewOffset(t,e,n,r,s,a){this.aspect=t/e,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=r,this.view.width=s,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=this.near;let e=t*Math.tan(Rs*.5*this.fov)/this.zoom,n=2*e,r=this.aspect*n,s=-.5*r;const a=this.view;if(this.view!==null&&this.view.enabled){const c=a.fullWidth,l=a.fullHeight;s+=a.offsetX*r/c,e-=a.offsetY*n/l,r*=a.width/c,n*=a.height/l}const o=this.filmOffset;o!==0&&(s+=t*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(s,s+r,e,e-n,t,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.fov=this.fov,e.object.zoom=this.zoom,e.object.near=this.near,e.object.far=this.far,e.object.focus=this.focus,e.object.aspect=this.aspect,this.view!==null&&(e.object.view=Object.assign({},this.view)),e.object.filmGauge=this.filmGauge,e.object.filmOffset=this.filmOffset,e}}const Nr=-90,Fr=1;class xp extends Re{constructor(t,e,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;const r=new Mn(Nr,Fr,t,e);r.layers=this.layers,this.add(r);const s=new Mn(Nr,Fr,t,e);s.layers=this.layers,this.add(s);const a=new Mn(Nr,Fr,t,e);a.layers=this.layers,this.add(a);const o=new Mn(Nr,Fr,t,e);o.layers=this.layers,this.add(o);const c=new Mn(Nr,Fr,t,e);c.layers=this.layers,this.add(c);const l=new Mn(Nr,Fr,t,e);l.layers=this.layers,this.add(l)}updateCoordinateSystem(){const t=this.coordinateSystem,e=this.children.concat(),[n,r,s,a,o,c]=e;for(const l of e)this.remove(l);if(t===ei)n.up.set(0,1,0),n.lookAt(1,0,0),r.up.set(0,1,0),r.lookAt(-1,0,0),s.up.set(0,0,-1),s.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),c.up.set(0,1,0),c.lookAt(0,0,-1);else if(t===qa)n.up.set(0,-1,0),n.lookAt(-1,0,0),r.up.set(0,-1,0),r.lookAt(1,0,0),s.up.set(0,0,1),s.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),c.up.set(0,-1,0),c.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+t);for(const l of e)this.add(l),l.updateMatrixWorld()}update(t,e){this.parent===null&&this.updateMatrixWorld();const{renderTarget:n,activeMipmapLevel:r}=this;this.coordinateSystem!==t.coordinateSystem&&(this.coordinateSystem=t.coordinateSystem,this.updateCoordinateSystem());const[s,a,o,c,l,h]=this.children,u=t.getRenderTarget(),d=t.getActiveCubeFace(),f=t.getActiveMipmapLevel(),g=t.xr.enabled;t.xr.enabled=!1;const v=n.texture.generateMipmaps;n.texture.generateMipmaps=!1,t.setRenderTarget(n,0,r),t.render(e,s),t.setRenderTarget(n,1,r),t.render(e,a),t.setRenderTarget(n,2,r),t.render(e,o),t.setRenderTarget(n,3,r),t.render(e,c),t.setRenderTarget(n,4,r),t.render(e,l),n.texture.generateMipmaps=v,t.setRenderTarget(n,5,r),t.render(e,h),t.setRenderTarget(u,d,f),t.xr.enabled=g,n.texture.needsPMREMUpdate=!0}}class yf extends Ge{constructor(t=[],e=ss,n,r,s,a,o,c,l,h){super(t,e,n,r,s,a,o,c,l,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(t){this.image=t}}class _p extends en{constructor(t=1,e={}){super(t,t,e),this.isWebGLCubeRenderTarget=!0;const n={width:t,height:t,depth:1},r=[n,n,n,n,n,n];this.texture=new yf(r),this._setTextureOptions(e),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(t,e){this.texture.type=e.type,this.texture.colorSpace=e.colorSpace,this.texture.generateMipmaps=e.generateMipmaps,this.texture.minFilter=e.minFilter,this.texture.magFilter=e.magFilter;const n={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},r=new nn(5,5,5),s=new ke({name:"CubemapFromEquirect",uniforms:ls(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:dn,blending:Vi});s.uniforms.tEquirect.value=e;const a=new Pt(r,s),o=e.minFilter;return e.minFilter===Oi&&(e.minFilter=ge),new xp(1,10,this).update(t,a),e.minFilter=o,a.geometry.dispose(),a.material.dispose(),this}clear(t,e=!0,n=!0,r=!0){const s=t.getRenderTarget();for(let a=0;a<6;a++)t.setRenderTarget(this,a),t.clear(e,n,r);t.setRenderTarget(s)}}class Ue extends Re{constructor(){super(),this.isGroup=!0,this.type="Group"}}const Mp={type:"move"};class Co{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new Ue,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new Ue,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new I,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new I),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new Ue,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new I,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new I),this._grip}dispatchEvent(t){return this._targetRay!==null&&this._targetRay.dispatchEvent(t),this._grip!==null&&this._grip.dispatchEvent(t),this._hand!==null&&this._hand.dispatchEvent(t),this}connect(t){if(t&&t.hand){const e=this._hand;if(e)for(const n of t.hand.values())this._getHandJoint(e,n)}return this.dispatchEvent({type:"connected",data:t}),this}disconnect(t){return this.dispatchEvent({type:"disconnected",data:t}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(t,e,n){let r=null,s=null,a=null;const o=this._targetRay,c=this._grip,l=this._hand;if(t&&e.session.visibilityState!=="visible-blurred"){if(l&&t.hand){a=!0;for(const v of t.hand.values()){const m=e.getJointPose(v,n),p=this._getHandJoint(l,v);m!==null&&(p.matrix.fromArray(m.transform.matrix),p.matrix.decompose(p.position,p.rotation,p.scale),p.matrixWorldNeedsUpdate=!0,p.jointRadius=m.radius),p.visible=m!==null}const h=l.joints["index-finger-tip"],u=l.joints["thumb-tip"],d=h.position.distanceTo(u.position),f=.02,g=.005;l.inputState.pinching&&d>f+g?(l.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:t.handedness,target:this})):!l.inputState.pinching&&d<=f-g&&(l.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:t.handedness,target:this}))}else c!==null&&t.gripSpace&&(s=e.getPose(t.gripSpace,n),s!==null&&(c.matrix.fromArray(s.transform.matrix),c.matrix.decompose(c.position,c.rotation,c.scale),c.matrixWorldNeedsUpdate=!0,s.linearVelocity?(c.hasLinearVelocity=!0,c.linearVelocity.copy(s.linearVelocity)):c.hasLinearVelocity=!1,s.angularVelocity?(c.hasAngularVelocity=!0,c.angularVelocity.copy(s.angularVelocity)):c.hasAngularVelocity=!1));o!==null&&(r=e.getPose(t.targetRaySpace,n),r===null&&s!==null&&(r=s),r!==null&&(o.matrix.fromArray(r.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,r.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(r.linearVelocity)):o.hasLinearVelocity=!1,r.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(r.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(Mp)))}return o!==null&&(o.visible=r!==null),c!==null&&(c.visible=s!==null),l!==null&&(l.visible=a!==null),this}_getHandJoint(t,e){if(t.joints[e.jointName]===void 0){const n=new Ue;n.matrixAutoUpdate=!1,n.visible=!1,t.joints[e.jointName]=n,t.add(n)}return t.joints[e.jointName]}}class Sf extends Re{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new In,this.environmentIntensity=1,this.environmentRotation=new In,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(t,e){return super.copy(t,e),t.background!==null&&(this.background=t.background.clone()),t.environment!==null&&(this.environment=t.environment.clone()),t.fog!==null&&(this.fog=t.fog.clone()),this.backgroundBlurriness=t.backgroundBlurriness,this.backgroundIntensity=t.backgroundIntensity,this.backgroundRotation.copy(t.backgroundRotation),this.environmentIntensity=t.environmentIntensity,this.environmentRotation.copy(t.environmentRotation),t.overrideMaterial!==null&&(this.overrideMaterial=t.overrideMaterial.clone()),this.matrixAutoUpdate=t.matrixAutoUpdate,this}toJSON(t){const e=super.toJSON(t);return this.fog!==null&&(e.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(e.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(e.object.backgroundIntensity=this.backgroundIntensity),e.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(e.object.environmentIntensity=this.environmentIntensity),e.object.environmentRotation=this.environmentRotation.toArray(),e}}const bh=new I,yh=new ae,Sh=new ae,bp=new I,wh=new ne,xa=new I,Lo=new Mr,Eh=new ne,Po=new vl;class wf extends Pt{constructor(t,e){super(t,e),this.isSkinnedMesh=!0,this.type="SkinnedMesh",this.bindMode=Ql,this.bindMatrix=new ne,this.bindMatrixInverse=new ne,this.boundingBox=null,this.boundingSphere=null}computeBoundingBox(){const t=this.geometry;this.boundingBox===null&&(this.boundingBox=new ps),this.boundingBox.makeEmpty();const e=t.getAttribute("position");for(let n=0;n<e.count;n++)this.getVertexPosition(n,xa),this.boundingBox.expandByPoint(xa)}computeBoundingSphere(){const t=this.geometry;this.boundingSphere===null&&(this.boundingSphere=new Mr),this.boundingSphere.makeEmpty();const e=t.getAttribute("position");for(let n=0;n<e.count;n++)this.getVertexPosition(n,xa),this.boundingSphere.expandByPoint(xa)}copy(t,e){return super.copy(t,e),this.bindMode=t.bindMode,this.bindMatrix.copy(t.bindMatrix),this.bindMatrixInverse.copy(t.bindMatrixInverse),this.skeleton=t.skeleton,t.boundingBox!==null&&(this.boundingBox=t.boundingBox.clone()),t.boundingSphere!==null&&(this.boundingSphere=t.boundingSphere.clone()),this}raycast(t,e){const n=this.material,r=this.matrixWorld;n!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),Lo.copy(this.boundingSphere),Lo.applyMatrix4(r),t.ray.intersectsSphere(Lo)!==!1&&(Eh.copy(r).invert(),Po.copy(t.ray).applyMatrix4(Eh),!(this.boundingBox!==null&&Po.intersectsBox(this.boundingBox)===!1)&&this._computeIntersections(t,e,Po)))}getVertexPosition(t,e){return super.getVertexPosition(t,e),this.applyBoneTransform(t,e),e}bind(t,e){this.skeleton=t,e===void 0&&(this.updateMatrixWorld(!0),this.skeleton.calculateInverses(),e=this.matrixWorld),this.bindMatrix.copy(e),this.bindMatrixInverse.copy(e).invert()}pose(){this.skeleton.pose()}normalizeSkinWeights(){const t=new ae,e=this.geometry.attributes.skinWeight;for(let n=0,r=e.count;n<r;n++){t.fromBufferAttribute(e,n);const s=1/t.manhattanLength();s!==1/0?t.multiplyScalar(s):t.set(1,0,0,0),e.setXYZW(n,t.x,t.y,t.z,t.w)}}updateMatrixWorld(t){super.updateMatrixWorld(t),this.bindMode===Ql?this.bindMatrixInverse.copy(this.matrixWorld).invert():this.bindMode===v0?this.bindMatrixInverse.copy(this.bindMatrix).invert():console.warn("THREE.SkinnedMesh: Unrecognized bindMode: "+this.bindMode)}applyBoneTransform(t,e){const n=this.skeleton,r=this.geometry;yh.fromBufferAttribute(r.attributes.skinIndex,t),Sh.fromBufferAttribute(r.attributes.skinWeight,t),bh.copy(e).applyMatrix4(this.bindMatrix),e.set(0,0,0);for(let s=0;s<4;s++){const a=Sh.getComponent(s);if(a!==0){const o=yh.getComponent(s);wh.multiplyMatrices(n.bones[o].matrixWorld,n.boneInverses[o]),e.addScaledVector(bp.copy(bh).applyMatrix4(wh),a)}}return e.applyMatrix4(this.bindMatrixInverse)}}class Ef extends Re{constructor(){super(),this.isBone=!0,this.type="Bone"}}class Qr extends Ge{constructor(t=null,e=1,n=1,r,s,a,o,c,l=yn,h=yn,u,d){super(null,a,o,c,l,h,r,s,u,d),this.isDataTexture=!0,this.image={data:t,width:e,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}const Th=new ne,yp=new ne;class xl{constructor(t=[],e=[]){this.uuid=_r(),this.bones=t.slice(0),this.boneInverses=e,this.boneMatrices=null,this.boneTexture=null,this.init()}init(){const t=this.bones,e=this.boneInverses;if(this.boneMatrices=new Float32Array(t.length*16),e.length===0)this.calculateInverses();else if(t.length!==e.length){console.warn("THREE.Skeleton: Number of inverse bone matrices does not match amount of bones."),this.boneInverses=[];for(let n=0,r=this.bones.length;n<r;n++)this.boneInverses.push(new ne)}}calculateInverses(){this.boneInverses.length=0;for(let t=0,e=this.bones.length;t<e;t++){const n=new ne;this.bones[t]&&n.copy(this.bones[t].matrixWorld).invert(),this.boneInverses.push(n)}}pose(){for(let t=0,e=this.bones.length;t<e;t++){const n=this.bones[t];n&&n.matrixWorld.copy(this.boneInverses[t]).invert()}for(let t=0,e=this.bones.length;t<e;t++){const n=this.bones[t];n&&(n.parent&&n.parent.isBone?(n.matrix.copy(n.parent.matrixWorld).invert(),n.matrix.multiply(n.matrixWorld)):n.matrix.copy(n.matrixWorld),n.matrix.decompose(n.position,n.quaternion,n.scale))}}update(){const t=this.bones,e=this.boneInverses,n=this.boneMatrices,r=this.boneTexture;for(let s=0,a=t.length;s<a;s++){const o=t[s]?t[s].matrixWorld:yp;Th.multiplyMatrices(o,e[s]),Th.toArray(n,s*16)}r!==null&&(r.needsUpdate=!0)}clone(){return new xl(this.bones,this.boneInverses)}computeBoneTexture(){let t=Math.sqrt(this.bones.length*4);t=Math.ceil(t/4)*4,t=Math.max(t,4);const e=new Float32Array(t*t*4);e.set(this.boneMatrices);const n=new Qr(e,t,t,Ve,ti);return n.needsUpdate=!0,this.boneMatrices=e,this.boneTexture=n,this}getBoneByName(t){for(let e=0,n=this.bones.length;e<n;e++){const r=this.bones[e];if(r.name===t)return r}}dispose(){this.boneTexture!==null&&(this.boneTexture.dispose(),this.boneTexture=null)}fromJSON(t,e){this.uuid=t.uuid;for(let n=0,r=t.bones.length;n<r;n++){const s=t.bones[n];let a=e[s];a===void 0&&(console.warn("THREE.Skeleton: No bone found with UUID:",s),a=new Ef),this.bones.push(a),this.boneInverses.push(new ne().fromArray(t.boneInverses[n]))}return this.init(),this}toJSON(){const t={metadata:{version:4.7,type:"Skeleton",generator:"Skeleton.toJSON"},bones:[],boneInverses:[]};t.uuid=this.uuid;const e=this.bones,n=this.boneInverses;for(let r=0,s=e.length;r<s;r++){const a=e[r];t.bones.push(a.uuid);const o=n[r];t.boneInverses.push(o.toArray())}return t}}const Do=new I,Sp=new I,wp=new Jt;class rr{constructor(t=new I(1,0,0),e=0){this.isPlane=!0,this.normal=t,this.constant=e}set(t,e){return this.normal.copy(t),this.constant=e,this}setComponents(t,e,n,r){return this.normal.set(t,e,n),this.constant=r,this}setFromNormalAndCoplanarPoint(t,e){return this.normal.copy(t),this.constant=-e.dot(this.normal),this}setFromCoplanarPoints(t,e,n){const r=Do.subVectors(n,e).cross(Sp.subVectors(t,e)).normalize();return this.setFromNormalAndCoplanarPoint(r,t),this}copy(t){return this.normal.copy(t.normal),this.constant=t.constant,this}normalize(){const t=1/this.normal.length();return this.normal.multiplyScalar(t),this.constant*=t,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(t){return this.normal.dot(t)+this.constant}distanceToSphere(t){return this.distanceToPoint(t.center)-t.radius}projectPoint(t,e){return e.copy(t).addScaledVector(this.normal,-this.distanceToPoint(t))}intersectLine(t,e){const n=t.delta(Do),r=this.normal.dot(n);if(r===0)return this.distanceToPoint(t.start)===0?e.copy(t.start):null;const s=-(t.start.dot(this.normal)+this.constant)/r;return s<0||s>1?null:e.copy(t.start).addScaledVector(n,s)}intersectsLine(t){const e=this.distanceToPoint(t.start),n=this.distanceToPoint(t.end);return e<0&&n>0||n<0&&e>0}intersectsBox(t){return t.intersectsPlane(this)}intersectsSphere(t){return t.intersectsPlane(this)}coplanarPoint(t){return t.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(t,e){const n=e||wp.getNormalMatrix(t),r=this.coplanarPoint(Do).applyMatrix4(t),s=this.normal.applyMatrix3(n).normalize();return this.constant=-r.dot(s),this}translate(t){return this.constant-=t.dot(this.normal),this}equals(t){return t.normal.equals(this.normal)&&t.constant===this.constant}clone(){return new this.constructor().copy(this)}}const tr=new Mr,Ep=new bt(.5,.5),_a=new I;class _l{constructor(t=new rr,e=new rr,n=new rr,r=new rr,s=new rr,a=new rr){this.planes=[t,e,n,r,s,a]}set(t,e,n,r,s,a){const o=this.planes;return o[0].copy(t),o[1].copy(e),o[2].copy(n),o[3].copy(r),o[4].copy(s),o[5].copy(a),this}copy(t){const e=this.planes;for(let n=0;n<6;n++)e[n].copy(t.planes[n]);return this}setFromProjectionMatrix(t,e=ei,n=!1){const r=this.planes,s=t.elements,a=s[0],o=s[1],c=s[2],l=s[3],h=s[4],u=s[5],d=s[6],f=s[7],g=s[8],v=s[9],m=s[10],p=s[11],b=s[12],y=s[13],_=s[14],E=s[15];if(r[0].setComponents(l-a,f-h,p-g,E-b).normalize(),r[1].setComponents(l+a,f+h,p+g,E+b).normalize(),r[2].setComponents(l+o,f+u,p+v,E+y).normalize(),r[3].setComponents(l-o,f-u,p-v,E-y).normalize(),n)r[4].setComponents(c,d,m,_).normalize(),r[5].setComponents(l-c,f-d,p-m,E-_).normalize();else if(r[4].setComponents(l-c,f-d,p-m,E-_).normalize(),e===ei)r[5].setComponents(l+c,f+d,p+m,E+_).normalize();else if(e===qa)r[5].setComponents(c,d,m,_).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+e);return this}intersectsObject(t){if(t.boundingSphere!==void 0)t.boundingSphere===null&&t.computeBoundingSphere(),tr.copy(t.boundingSphere).applyMatrix4(t.matrixWorld);else{const e=t.geometry;e.boundingSphere===null&&e.computeBoundingSphere(),tr.copy(e.boundingSphere).applyMatrix4(t.matrixWorld)}return this.intersectsSphere(tr)}intersectsSprite(t){tr.center.set(0,0,0);const e=Ep.distanceTo(t.center);return tr.radius=.7071067811865476+e,tr.applyMatrix4(t.matrixWorld),this.intersectsSphere(tr)}intersectsSphere(t){const e=this.planes,n=t.center,r=-t.radius;for(let s=0;s<6;s++)if(e[s].distanceToPoint(n)<r)return!1;return!0}intersectsBox(t){const e=this.planes;for(let n=0;n<6;n++){const r=e[n];if(_a.x=r.normal.x>0?t.max.x:t.min.x,_a.y=r.normal.y>0?t.max.y:t.min.y,_a.z=r.normal.z>0?t.max.z:t.min.z,r.distanceToPoint(_a)<0)return!1}return!0}containsPoint(t){const e=this.planes;for(let n=0;n<6;n++)if(e[n].distanceToPoint(t)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}class Tp extends ms{constructor(t){super(),this.isPointsMaterial=!0,this.type="PointsMaterial",this.color=new Ut(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.alphaMap=t.alphaMap,this.size=t.size,this.sizeAttenuation=t.sizeAttenuation,this.fog=t.fog,this}}const Ah=new ne,Wc=new vl,Ma=new Mr,ba=new I;class Ap extends Re{constructor(t=new Le,e=new Tp){super(),this.isPoints=!0,this.type="Points",this.geometry=t,this.material=e,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}raycast(t,e){const n=this.geometry,r=this.matrixWorld,s=t.params.Points.threshold,a=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),Ma.copy(n.boundingSphere),Ma.applyMatrix4(r),Ma.radius+=s,t.ray.intersectsSphere(Ma)===!1)return;Ah.copy(r).invert(),Wc.copy(t.ray).applyMatrix4(Ah);const o=s/((this.scale.x+this.scale.y+this.scale.z)/3),c=o*o,l=n.index,u=n.attributes.position;if(l!==null){const d=Math.max(0,a.start),f=Math.min(l.count,a.start+a.count);for(let g=d,v=f;g<v;g++){const m=l.getX(g);ba.fromBufferAttribute(u,m),Rh(ba,m,c,r,t,e,this)}}else{const d=Math.max(0,a.start),f=Math.min(u.count,a.start+a.count);for(let g=d,v=f;g<v;g++)ba.fromBufferAttribute(u,g),Rh(ba,g,c,r,t,e,this)}}updateMorphTargets(){const e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){const r=e[n[0]];if(r!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,a=r.length;s<a;s++){const o=r[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=s}}}}}function Rh(i,t,e,n,r,s,a){const o=Wc.distanceSqToPoint(i);if(o<e){const c=new I;Wc.closestPointToPoint(i,c),c.applyMatrix4(n);const l=r.ray.origin.distanceTo(c);if(l<r.near||l>r.far)return;s.push({distance:l,distanceToRay:Math.sqrt(o),point:c,index:t,face:null,faceIndex:null,barycoord:null,object:a})}}class Rp extends Ge{constructor(t,e,n,r,s=ge,a=ge,o,c,l){super(t,e,n,r,s,a,o,c,l),this.isVideoTexture=!0,this.generateMipmaps=!1,this._requestVideoFrameCallbackId=0;const h=this;function u(){h.needsUpdate=!0,h._requestVideoFrameCallbackId=t.requestVideoFrameCallback(u)}"requestVideoFrameCallback"in t&&(this._requestVideoFrameCallbackId=t.requestVideoFrameCallback(u))}clone(){return new this.constructor(this.image).copy(this)}update(){const t=this.image;"requestVideoFrameCallback"in t===!1&&t.readyState>=t.HAVE_CURRENT_DATA&&(this.needsUpdate=!0)}dispose(){this._requestVideoFrameCallbackId!==0&&this.source.data.cancelVideoFrameCallback(this._requestVideoFrameCallbackId),super.dispose()}}class Ch extends Ge{constructor(t,e,n,r,s,a,o,c,l){super(t,e,n,r,s,a,o,c,l),this.isCanvasTexture=!0,this.needsUpdate=!0}}class Tf extends Ge{constructor(t,e,n=pr,r,s,a,o=yn,c=yn,l,h=Ns,u=1){if(h!==Ns&&h!==Fs)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");const d={width:t,height:e,depth:u};super(d,r,s,a,o,c,h,n,l),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(t){return super.copy(t),this.source=new ml(Object.assign({},t.image)),this.compareFunction=t.compareFunction,this}toJSON(t){const e=super.toJSON(t);return this.compareFunction!==null&&(e.compareFunction=this.compareFunction),e}}class Af extends Ge{constructor(t=null){super(),this.sourceTexture=t,this.isExternalTexture=!0}copy(t){return super.copy(t),this.sourceTexture=t.sourceTexture,this}}class Ml extends Le{constructor(t=1,e=1,n=4,r=8,s=1){super(),this.type="CapsuleGeometry",this.parameters={radius:t,height:e,capSegments:n,radialSegments:r,heightSegments:s},e=Math.max(0,e),n=Math.max(1,Math.floor(n)),r=Math.max(3,Math.floor(r)),s=Math.max(1,Math.floor(s));const a=[],o=[],c=[],l=[],h=e/2,u=Math.PI/2*t,d=e,f=2*u+d,g=n*2+s,v=r+1,m=new I,p=new I;for(let b=0;b<=g;b++){let y=0,_=0,E=0,w=0;if(b<=n){const x=b/n,M=x*Math.PI/2;_=-h-t*Math.cos(M),E=t*Math.sin(M),w=-t*Math.cos(M),y=x*u}else if(b<=n+s){const x=(b-n)/s;_=-h+x*e,E=t,w=0,y=u+x*d}else{const x=(b-n-s)/n,M=x*Math.PI/2;_=h+t*Math.sin(M),E=t*Math.cos(M),w=t*Math.sin(M),y=u+d+x*u}const A=Math.max(0,Math.min(1,y/f));let R=0;b===0?R=.5/r:b===g&&(R=-.5/r);for(let x=0;x<=r;x++){const M=x/r,S=M*Math.PI*2,T=Math.sin(S),D=Math.cos(S);p.x=-E*D,p.y=_,p.z=E*T,o.push(p.x,p.y,p.z),m.set(-E*D,w,E*T),m.normalize(),c.push(m.x,m.y,m.z),l.push(M+R,A)}if(b>0){const x=(b-1)*v;for(let M=0;M<r;M++){const S=x+M,T=x+M+1,D=b*v+M,U=b*v+M+1;a.push(S,T,D),a.push(T,U,D)}}}this.setIndex(a),this.setAttribute("position",new oe(o,3)),this.setAttribute("normal",new oe(c,3)),this.setAttribute("uv",new oe(l,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Ml(t.radius,t.height,t.capSegments,t.radialSegments,t.heightSegments)}}class gs extends Le{constructor(t=1,e=32,n=0,r=Math.PI*2){super(),this.type="CircleGeometry",this.parameters={radius:t,segments:e,thetaStart:n,thetaLength:r},e=Math.max(3,e);const s=[],a=[],o=[],c=[],l=new I,h=new bt;a.push(0,0,0),o.push(0,0,1),c.push(.5,.5);for(let u=0,d=3;u<=e;u++,d+=3){const f=n+u/e*r;l.x=t*Math.cos(f),l.y=t*Math.sin(f),a.push(l.x,l.y,l.z),o.push(0,0,1),h.x=(a[d]/t+1)/2,h.y=(a[d+1]/t+1)/2,c.push(h.x,h.y)}for(let u=1;u<=e;u++)s.push(u,u+1,0);this.setIndex(s),this.setAttribute("position",new oe(a,3)),this.setAttribute("normal",new oe(o,3)),this.setAttribute("uv",new oe(c,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new gs(t.radius,t.segments,t.thetaStart,t.thetaLength)}}class Sn extends Le{constructor(t=1,e=1,n=1,r=32,s=1,a=!1,o=0,c=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:t,radiusBottom:e,height:n,radialSegments:r,heightSegments:s,openEnded:a,thetaStart:o,thetaLength:c};const l=this;r=Math.floor(r),s=Math.floor(s);const h=[],u=[],d=[],f=[];let g=0;const v=[],m=n/2;let p=0;b(),a===!1&&(t>0&&y(!0),e>0&&y(!1)),this.setIndex(h),this.setAttribute("position",new oe(u,3)),this.setAttribute("normal",new oe(d,3)),this.setAttribute("uv",new oe(f,2));function b(){const _=new I,E=new I;let w=0;const A=(e-t)/n;for(let R=0;R<=s;R++){const x=[],M=R/s,S=M*(e-t)+t;for(let T=0;T<=r;T++){const D=T/r,U=D*c+o,N=Math.sin(U),z=Math.cos(U);E.x=S*N,E.y=-M*n+m,E.z=S*z,u.push(E.x,E.y,E.z),_.set(N,A,z).normalize(),d.push(_.x,_.y,_.z),f.push(D,1-M),x.push(g++)}v.push(x)}for(let R=0;R<r;R++)for(let x=0;x<s;x++){const M=v[x][R],S=v[x+1][R],T=v[x+1][R+1],D=v[x][R+1];(t>0||x!==0)&&(h.push(M,S,D),w+=3),(e>0||x!==s-1)&&(h.push(S,T,D),w+=3)}l.addGroup(p,w,0),p+=w}function y(_){const E=g,w=new bt,A=new I;let R=0;const x=_===!0?t:e,M=_===!0?1:-1;for(let T=1;T<=r;T++)u.push(0,m*M,0),d.push(0,M,0),f.push(.5,.5),g++;const S=g;for(let T=0;T<=r;T++){const U=T/r*c+o,N=Math.cos(U),z=Math.sin(U);A.x=x*z,A.y=m*M,A.z=x*N,u.push(A.x,A.y,A.z),d.push(0,M,0),w.x=N*.5+.5,w.y=z*.5*M+.5,f.push(w.x,w.y),g++}for(let T=0;T<r;T++){const D=E+T,U=S+T;_===!0?h.push(U,U+1,D):h.push(U+1,U,D),R+=3}l.addGroup(p,R,_===!0?1:2),p+=R}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Sn(t.radiusTop,t.radiusBottom,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}}class br extends Sn{constructor(t=1,e=1,n=32,r=1,s=!1,a=0,o=Math.PI*2){super(0,t,e,n,r,s,a,o),this.type="ConeGeometry",this.parameters={radius:t,height:e,radialSegments:n,heightSegments:r,openEnded:s,thetaStart:a,thetaLength:o}}static fromJSON(t){return new br(t.radius,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}}class Si{constructor(){this.type="Curve",this.arcLengthDivisions=200,this.needsUpdate=!1,this.cacheArcLengths=null}getPoint(){console.warn("THREE.Curve: .getPoint() not implemented.")}getPointAt(t,e){const n=this.getUtoTmapping(t);return this.getPoint(n,e)}getPoints(t=5){const e=[];for(let n=0;n<=t;n++)e.push(this.getPoint(n/t));return e}getSpacedPoints(t=5){const e=[];for(let n=0;n<=t;n++)e.push(this.getPointAt(n/t));return e}getLength(){const t=this.getLengths();return t[t.length-1]}getLengths(t=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===t+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;const e=[];let n,r=this.getPoint(0),s=0;e.push(0);for(let a=1;a<=t;a++)n=this.getPoint(a/t),s+=n.distanceTo(r),e.push(s),r=n;return this.cacheArcLengths=e,e}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(t,e=null){const n=this.getLengths();let r=0;const s=n.length;let a;e?a=e:a=t*n[s-1];let o=0,c=s-1,l;for(;o<=c;)if(r=Math.floor(o+(c-o)/2),l=n[r]-a,l<0)o=r+1;else if(l>0)c=r-1;else{c=r;break}if(r=c,n[r]===a)return r/(s-1);const h=n[r],d=n[r+1]-h,f=(a-h)/d;return(r+f)/(s-1)}getTangent(t,e){let r=t-1e-4,s=t+1e-4;r<0&&(r=0),s>1&&(s=1);const a=this.getPoint(r),o=this.getPoint(s),c=e||(a.isVector2?new bt:new I);return c.copy(o).sub(a).normalize(),c}getTangentAt(t,e){const n=this.getUtoTmapping(t);return this.getTangent(n,e)}computeFrenetFrames(t,e=!1){const n=new I,r=[],s=[],a=[],o=new I,c=new ne;for(let f=0;f<=t;f++){const g=f/t;r[f]=this.getTangentAt(g,new I)}s[0]=new I,a[0]=new I;let l=Number.MAX_VALUE;const h=Math.abs(r[0].x),u=Math.abs(r[0].y),d=Math.abs(r[0].z);h<=l&&(l=h,n.set(1,0,0)),u<=l&&(l=u,n.set(0,1,0)),d<=l&&n.set(0,0,1),o.crossVectors(r[0],n).normalize(),s[0].crossVectors(r[0],o),a[0].crossVectors(r[0],s[0]);for(let f=1;f<=t;f++){if(s[f]=s[f-1].clone(),a[f]=a[f-1].clone(),o.crossVectors(r[f-1],r[f]),o.length()>Number.EPSILON){o.normalize();const g=Math.acos(te(r[f-1].dot(r[f]),-1,1));s[f].applyMatrix4(c.makeRotationAxis(o,g))}a[f].crossVectors(r[f],s[f])}if(e===!0){let f=Math.acos(te(s[0].dot(s[t]),-1,1));f/=t,r[0].dot(o.crossVectors(s[0],s[t]))>0&&(f=-f);for(let g=1;g<=t;g++)s[g].applyMatrix4(c.makeRotationAxis(r[g],f*g)),a[g].crossVectors(r[g],s[g])}return{tangents:r,normals:s,binormals:a}}clone(){return new this.constructor().copy(this)}copy(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}toJSON(){const t={metadata:{version:4.7,type:"Curve",generator:"Curve.toJSON"}};return t.arcLengthDivisions=this.arcLengthDivisions,t.type=this.type,t}fromJSON(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}}class Rf extends Si{constructor(t=0,e=0,n=1,r=1,s=0,a=Math.PI*2,o=!1,c=0){super(),this.isEllipseCurve=!0,this.type="EllipseCurve",this.aX=t,this.aY=e,this.xRadius=n,this.yRadius=r,this.aStartAngle=s,this.aEndAngle=a,this.aClockwise=o,this.aRotation=c}getPoint(t,e=new bt){const n=e,r=Math.PI*2;let s=this.aEndAngle-this.aStartAngle;const a=Math.abs(s)<Number.EPSILON;for(;s<0;)s+=r;for(;s>r;)s-=r;s<Number.EPSILON&&(a?s=0:s=r),this.aClockwise===!0&&!a&&(s===r?s=-r:s=s-r);const o=this.aStartAngle+t*s;let c=this.aX+this.xRadius*Math.cos(o),l=this.aY+this.yRadius*Math.sin(o);if(this.aRotation!==0){const h=Math.cos(this.aRotation),u=Math.sin(this.aRotation),d=c-this.aX,f=l-this.aY;c=d*h-f*u+this.aX,l=d*u+f*h+this.aY}return n.set(c,l)}copy(t){return super.copy(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}toJSON(){const t=super.toJSON();return t.aX=this.aX,t.aY=this.aY,t.xRadius=this.xRadius,t.yRadius=this.yRadius,t.aStartAngle=this.aStartAngle,t.aEndAngle=this.aEndAngle,t.aClockwise=this.aClockwise,t.aRotation=this.aRotation,t}fromJSON(t){return super.fromJSON(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}}class Cp extends Rf{constructor(t,e,n,r,s,a){super(t,e,n,n,r,s,a),this.isArcCurve=!0,this.type="ArcCurve"}}function bl(){let i=0,t=0,e=0,n=0;function r(s,a,o,c){i=s,t=o,e=-3*s+3*a-2*o-c,n=2*s-2*a+o+c}return{initCatmullRom:function(s,a,o,c,l){r(a,o,l*(o-s),l*(c-a))},initNonuniformCatmullRom:function(s,a,o,c,l,h,u){let d=(a-s)/l-(o-s)/(l+h)+(o-a)/h,f=(o-a)/h-(c-a)/(h+u)+(c-o)/u;d*=h,f*=h,r(a,o,d,f)},calc:function(s){const a=s*s,o=a*s;return i+t*s+e*a+n*o}}}const ya=new I,Io=new bl,Uo=new bl,No=new bl;class gi extends Si{constructor(t=[],e=!1,n="centripetal",r=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=t,this.closed=e,this.curveType=n,this.tension=r}getPoint(t,e=new I){const n=e,r=this.points,s=r.length,a=(s-(this.closed?0:1))*t;let o=Math.floor(a),c=a-o;this.closed?o+=o>0?0:(Math.floor(Math.abs(o)/s)+1)*s:c===0&&o===s-1&&(o=s-2,c=1);let l,h;this.closed||o>0?l=r[(o-1)%s]:(ya.subVectors(r[0],r[1]).add(r[0]),l=ya);const u=r[o%s],d=r[(o+1)%s];if(this.closed||o+2<s?h=r[(o+2)%s]:(ya.subVectors(r[s-1],r[s-2]).add(r[s-1]),h=ya),this.curveType==="centripetal"||this.curveType==="chordal"){const f=this.curveType==="chordal"?.5:.25;let g=Math.pow(l.distanceToSquared(u),f),v=Math.pow(u.distanceToSquared(d),f),m=Math.pow(d.distanceToSquared(h),f);v<1e-4&&(v=1),g<1e-4&&(g=v),m<1e-4&&(m=v),Io.initNonuniformCatmullRom(l.x,u.x,d.x,h.x,g,v,m),Uo.initNonuniformCatmullRom(l.y,u.y,d.y,h.y,g,v,m),No.initNonuniformCatmullRom(l.z,u.z,d.z,h.z,g,v,m)}else this.curveType==="catmullrom"&&(Io.initCatmullRom(l.x,u.x,d.x,h.x,this.tension),Uo.initCatmullRom(l.y,u.y,d.y,h.y,this.tension),No.initCatmullRom(l.z,u.z,d.z,h.z,this.tension));return n.set(Io.calc(c),Uo.calc(c),No.calc(c)),n}copy(t){super.copy(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){const r=t.points[e];this.points.push(r.clone())}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}toJSON(){const t=super.toJSON();t.points=[];for(let e=0,n=this.points.length;e<n;e++){const r=this.points[e];t.points.push(r.toArray())}return t.closed=this.closed,t.curveType=this.curveType,t.tension=this.tension,t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){const r=t.points[e];this.points.push(new I().fromArray(r))}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}}function Lh(i,t,e,n,r){const s=(n-t)*.5,a=(r-e)*.5,o=i*i,c=i*o;return(2*e-2*n+s+a)*c+(-3*e+3*n-2*s-a)*o+s*i+e}function Lp(i,t){const e=1-i;return e*e*t}function Pp(i,t){return 2*(1-i)*i*t}function Dp(i,t){return i*i*t}function Ls(i,t,e,n){return Lp(i,t)+Pp(i,e)+Dp(i,n)}function Ip(i,t){const e=1-i;return e*e*e*t}function Up(i,t){const e=1-i;return 3*e*e*i*t}function Np(i,t){return 3*(1-i)*i*i*t}function Fp(i,t){return i*i*i*t}function Ps(i,t,e,n,r){return Ip(i,t)+Up(i,e)+Np(i,n)+Fp(i,r)}class Op extends Si{constructor(t=new bt,e=new bt,n=new bt,r=new bt){super(),this.isCubicBezierCurve=!0,this.type="CubicBezierCurve",this.v0=t,this.v1=e,this.v2=n,this.v3=r}getPoint(t,e=new bt){const n=e,r=this.v0,s=this.v1,a=this.v2,o=this.v3;return n.set(Ps(t,r.x,s.x,a.x,o.x),Ps(t,r.y,s.y,a.y,o.y)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}}class Bp extends Si{constructor(t=new I,e=new I,n=new I,r=new I){super(),this.isCubicBezierCurve3=!0,this.type="CubicBezierCurve3",this.v0=t,this.v1=e,this.v2=n,this.v3=r}getPoint(t,e=new I){const n=e,r=this.v0,s=this.v1,a=this.v2,o=this.v3;return n.set(Ps(t,r.x,s.x,a.x,o.x),Ps(t,r.y,s.y,a.y,o.y),Ps(t,r.z,s.z,a.z,o.z)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}}class kp extends Si{constructor(t=new bt,e=new bt){super(),this.isLineCurve=!0,this.type="LineCurve",this.v1=t,this.v2=e}getPoint(t,e=new bt){const n=e;return t===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(t).add(this.v1)),n}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new bt){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class Hp extends Si{constructor(t=new I,e=new I){super(),this.isLineCurve3=!0,this.type="LineCurve3",this.v1=t,this.v2=e}getPoint(t,e=new I){const n=e;return t===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(t).add(this.v1)),n}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new I){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class zp extends Si{constructor(t=new bt,e=new bt,n=new bt){super(),this.isQuadraticBezierCurve=!0,this.type="QuadraticBezierCurve",this.v0=t,this.v1=e,this.v2=n}getPoint(t,e=new bt){const n=e,r=this.v0,s=this.v1,a=this.v2;return n.set(Ls(t,r.x,s.x,a.x),Ls(t,r.y,s.y,a.y)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class Cf extends Si{constructor(t=new I,e=new I,n=new I){super(),this.isQuadraticBezierCurve3=!0,this.type="QuadraticBezierCurve3",this.v0=t,this.v1=e,this.v2=n}getPoint(t,e=new I){const n=e,r=this.v0,s=this.v1,a=this.v2;return n.set(Ls(t,r.x,s.x,a.x),Ls(t,r.y,s.y,a.y),Ls(t,r.z,s.z,a.z)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class Vp extends Si{constructor(t=[]){super(),this.isSplineCurve=!0,this.type="SplineCurve",this.points=t}getPoint(t,e=new bt){const n=e,r=this.points,s=(r.length-1)*t,a=Math.floor(s),o=s-a,c=r[a===0?a:a-1],l=r[a],h=r[a>r.length-2?r.length-1:a+1],u=r[a>r.length-3?r.length-1:a+2];return n.set(Lh(o,c.x,l.x,h.x,u.x),Lh(o,c.y,l.y,h.y,u.y)),n}copy(t){super.copy(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){const r=t.points[e];this.points.push(r.clone())}return this}toJSON(){const t=super.toJSON();t.points=[];for(let e=0,n=this.points.length;e<n;e++){const r=this.points[e];t.points.push(r.toArray())}return t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){const r=t.points[e];this.points.push(new bt().fromArray(r))}return this}}var Gp=Object.freeze({__proto__:null,ArcCurve:Cp,CatmullRomCurve3:gi,CubicBezierCurve:Op,CubicBezierCurve3:Bp,EllipseCurve:Rf,LineCurve:kp,LineCurve3:Hp,QuadraticBezierCurve:zp,QuadraticBezierCurve3:Cf,SplineCurve:Vp});class hs extends Le{constructor(t=[new bt(0,-.5),new bt(.5,0),new bt(0,.5)],e=12,n=0,r=Math.PI*2){super(),this.type="LatheGeometry",this.parameters={points:t,segments:e,phiStart:n,phiLength:r},e=Math.floor(e),r=te(r,0,Math.PI*2);const s=[],a=[],o=[],c=[],l=[],h=1/e,u=new I,d=new bt,f=new I,g=new I,v=new I;let m=0,p=0;for(let b=0;b<=t.length-1;b++)switch(b){case 0:m=t[b+1].x-t[b].x,p=t[b+1].y-t[b].y,f.x=p*1,f.y=-m,f.z=p*0,v.copy(f),f.normalize(),c.push(f.x,f.y,f.z);break;case t.length-1:c.push(v.x,v.y,v.z);break;default:m=t[b+1].x-t[b].x,p=t[b+1].y-t[b].y,f.x=p*1,f.y=-m,f.z=p*0,g.copy(f),f.x+=v.x,f.y+=v.y,f.z+=v.z,f.normalize(),c.push(f.x,f.y,f.z),v.copy(g)}for(let b=0;b<=e;b++){const y=n+b*h*r,_=Math.sin(y),E=Math.cos(y);for(let w=0;w<=t.length-1;w++){u.x=t[w].x*_,u.y=t[w].y,u.z=t[w].x*E,a.push(u.x,u.y,u.z),d.x=b/e,d.y=w/(t.length-1),o.push(d.x,d.y);const A=c[3*w+0]*_,R=c[3*w+1],x=c[3*w+0]*E;l.push(A,R,x)}}for(let b=0;b<e;b++)for(let y=0;y<t.length-1;y++){const _=y+b*t.length,E=_,w=_+t.length,A=_+t.length+1,R=_+1;s.push(E,w,R),s.push(A,R,w)}this.setIndex(s),this.setAttribute("position",new oe(a,3)),this.setAttribute("uv",new oe(o,2)),this.setAttribute("normal",new oe(l,3))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new hs(t.points,t.segments,t.phiStart,t.phiLength)}}class Mi extends Le{constructor(t=1,e=1,n=1,r=1){super(),this.type="PlaneGeometry",this.parameters={width:t,height:e,widthSegments:n,heightSegments:r};const s=t/2,a=e/2,o=Math.floor(n),c=Math.floor(r),l=o+1,h=c+1,u=t/o,d=e/c,f=[],g=[],v=[],m=[];for(let p=0;p<h;p++){const b=p*d-a;for(let y=0;y<l;y++){const _=y*u-s;g.push(_,-b,0),v.push(0,0,1),m.push(y/o),m.push(1-p/c)}}for(let p=0;p<c;p++)for(let b=0;b<o;b++){const y=b+l*p,_=b+l*(p+1),E=b+1+l*(p+1),w=b+1+l*p;f.push(y,_,w),f.push(_,E,w)}this.setIndex(f),this.setAttribute("position",new oe(g,3)),this.setAttribute("normal",new oe(v,3)),this.setAttribute("uv",new oe(m,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Mi(t.width,t.height,t.widthSegments,t.heightSegments)}}class yl extends Le{constructor(t=.5,e=1,n=32,r=1,s=0,a=Math.PI*2){super(),this.type="RingGeometry",this.parameters={innerRadius:t,outerRadius:e,thetaSegments:n,phiSegments:r,thetaStart:s,thetaLength:a},n=Math.max(3,n),r=Math.max(1,r);const o=[],c=[],l=[],h=[];let u=t;const d=(e-t)/r,f=new I,g=new bt;for(let v=0;v<=r;v++){for(let m=0;m<=n;m++){const p=s+m/n*a;f.x=u*Math.cos(p),f.y=u*Math.sin(p),c.push(f.x,f.y,f.z),l.push(0,0,1),g.x=(f.x/e+1)/2,g.y=(f.y/e+1)/2,h.push(g.x,g.y)}u+=d}for(let v=0;v<r;v++){const m=v*(n+1);for(let p=0;p<n;p++){const b=p+m,y=b,_=b+n+1,E=b+n+2,w=b+1;o.push(y,_,w),o.push(_,E,w)}}this.setIndex(o),this.setAttribute("position",new oe(c,3)),this.setAttribute("normal",new oe(l,3)),this.setAttribute("uv",new oe(h,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new yl(t.innerRadius,t.outerRadius,t.thetaSegments,t.phiSegments,t.thetaStart,t.thetaLength)}}class Se extends Le{constructor(t=1,e=32,n=16,r=0,s=Math.PI*2,a=0,o=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:t,widthSegments:e,heightSegments:n,phiStart:r,phiLength:s,thetaStart:a,thetaLength:o},e=Math.max(3,Math.floor(e)),n=Math.max(2,Math.floor(n));const c=Math.min(a+o,Math.PI);let l=0;const h=[],u=new I,d=new I,f=[],g=[],v=[],m=[];for(let p=0;p<=n;p++){const b=[],y=p/n;let _=0;p===0&&a===0?_=.5/e:p===n&&c===Math.PI&&(_=-.5/e);for(let E=0;E<=e;E++){const w=E/e;u.x=-t*Math.cos(r+w*s)*Math.sin(a+y*o),u.y=t*Math.cos(a+y*o),u.z=t*Math.sin(r+w*s)*Math.sin(a+y*o),g.push(u.x,u.y,u.z),d.copy(u).normalize(),v.push(d.x,d.y,d.z),m.push(w+_,1-y),b.push(l++)}h.push(b)}for(let p=0;p<n;p++)for(let b=0;b<e;b++){const y=h[p][b+1],_=h[p][b],E=h[p+1][b],w=h[p+1][b+1];(p!==0||a>0)&&f.push(y,_,w),(p!==n-1||c<Math.PI)&&f.push(_,E,w)}this.setIndex(f),this.setAttribute("position",new oe(g,3)),this.setAttribute("normal",new oe(v,3)),this.setAttribute("uv",new oe(m,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Se(t.radius,t.widthSegments,t.heightSegments,t.phiStart,t.phiLength,t.thetaStart,t.thetaLength)}}class qi extends Le{constructor(t=1,e=.4,n=12,r=48,s=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:t,tube:e,radialSegments:n,tubularSegments:r,arc:s},n=Math.floor(n),r=Math.floor(r);const a=[],o=[],c=[],l=[],h=new I,u=new I,d=new I;for(let f=0;f<=n;f++)for(let g=0;g<=r;g++){const v=g/r*s,m=f/n*Math.PI*2;u.x=(t+e*Math.cos(m))*Math.cos(v),u.y=(t+e*Math.cos(m))*Math.sin(v),u.z=e*Math.sin(m),o.push(u.x,u.y,u.z),h.x=t*Math.cos(v),h.y=t*Math.sin(v),d.subVectors(u,h).normalize(),c.push(d.x,d.y,d.z),l.push(g/r),l.push(f/n)}for(let f=1;f<=n;f++)for(let g=1;g<=r;g++){const v=(r+1)*f+g-1,m=(r+1)*(f-1)+g-1,p=(r+1)*(f-1)+g,b=(r+1)*f+g;a.push(v,m,b),a.push(m,p,b)}this.setIndex(a),this.setAttribute("position",new oe(o,3)),this.setAttribute("normal",new oe(c,3)),this.setAttribute("uv",new oe(l,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new qi(t.radius,t.tube,t.radialSegments,t.tubularSegments,t.arc)}}class vs extends Le{constructor(t=new Cf(new I(-1,-1,0),new I(-1,1,0),new I(1,1,0)),e=64,n=1,r=8,s=!1){super(),this.type="TubeGeometry",this.parameters={path:t,tubularSegments:e,radius:n,radialSegments:r,closed:s};const a=t.computeFrenetFrames(e,s);this.tangents=a.tangents,this.normals=a.normals,this.binormals=a.binormals;const o=new I,c=new I,l=new bt;let h=new I;const u=[],d=[],f=[],g=[];v(),this.setIndex(g),this.setAttribute("position",new oe(u,3)),this.setAttribute("normal",new oe(d,3)),this.setAttribute("uv",new oe(f,2));function v(){for(let y=0;y<e;y++)m(y);m(s===!1?e:0),b(),p()}function m(y){h=t.getPointAt(y/e,h);const _=a.normals[y],E=a.binormals[y];for(let w=0;w<=r;w++){const A=w/r*Math.PI*2,R=Math.sin(A),x=-Math.cos(A);c.x=x*_.x+R*E.x,c.y=x*_.y+R*E.y,c.z=x*_.z+R*E.z,c.normalize(),d.push(c.x,c.y,c.z),o.x=h.x+n*c.x,o.y=h.y+n*c.y,o.z=h.z+n*c.z,u.push(o.x,o.y,o.z)}}function p(){for(let y=1;y<=e;y++)for(let _=1;_<=r;_++){const E=(r+1)*(y-1)+(_-1),w=(r+1)*y+(_-1),A=(r+1)*y+_,R=(r+1)*(y-1)+_;g.push(E,w,R),g.push(w,A,R)}}function b(){for(let y=0;y<=e;y++)for(let _=0;_<=r;_++)l.x=y/e,l.y=_/r,f.push(l.x,l.y)}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}toJSON(){const t=super.toJSON();return t.path=this.parameters.path.toJSON(),t}static fromJSON(t){return new vs(new Gp[t.path.type]().fromJSON(t.path),t.tubularSegments,t.radius,t.radialSegments,t.closed)}}class vi extends ms{constructor(t){super(),this.isMeshStandardMaterial=!0,this.type="MeshStandardMaterial",this.defines={STANDARD:""},this.color=new Ut(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Ut(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=df,this.normalScale=new bt(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new In,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.defines={STANDARD:""},this.color.copy(t.color),this.roughness=t.roughness,this.metalness=t.metalness,this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.emissive.copy(t.emissive),this.emissiveMap=t.emissiveMap,this.emissiveIntensity=t.emissiveIntensity,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.roughnessMap=t.roughnessMap,this.metalnessMap=t.metalnessMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.envMapIntensity=t.envMapIntensity,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.flatShading=t.flatShading,this.fog=t.fog,this}}class Wp extends ms{constructor(t){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=_0,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(t)}copy(t){return super.copy(t),this.depthPacking=t.depthPacking,this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this}}class Xp extends ms{constructor(t){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(t)}copy(t){return super.copy(t),this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this}}class Sl extends Re{constructor(t,e=1){super(),this.isLight=!0,this.type="Light",this.color=new Ut(t),this.intensity=e}dispose(){}copy(t,e){return super.copy(t,e),this.color.copy(t.color),this.intensity=t.intensity,this}toJSON(t){const e=super.toJSON(t);return e.object.color=this.color.getHex(),e.object.intensity=this.intensity,this.groundColor!==void 0&&(e.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(e.object.distance=this.distance),this.angle!==void 0&&(e.object.angle=this.angle),this.decay!==void 0&&(e.object.decay=this.decay),this.penumbra!==void 0&&(e.object.penumbra=this.penumbra),this.shadow!==void 0&&(e.object.shadow=this.shadow.toJSON()),this.target!==void 0&&(e.object.target=this.target.uuid),e}}class qp extends Sl{constructor(t,e,n){super(t,n),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(Re.DEFAULT_UP),this.updateMatrix(),this.groundColor=new Ut(e)}copy(t,e){return super.copy(t,e),this.groundColor.copy(t.groundColor),this}}const Fo=new ne,Ph=new I,Dh=new I;class Lf{constructor(t){this.camera=t,this.intensity=1,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new bt(512,512),this.mapType=Gn,this.map=null,this.mapPass=null,this.matrix=new ne,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new _l,this._frameExtents=new bt(1,1),this._viewportCount=1,this._viewports=[new ae(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(t){const e=this.camera,n=this.matrix;Ph.setFromMatrixPosition(t.matrixWorld),e.position.copy(Ph),Dh.setFromMatrixPosition(t.target.matrixWorld),e.lookAt(Dh),e.updateMatrixWorld(),Fo.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Fo,e.coordinateSystem,e.reversedDepth),e.reversedDepth?n.set(.5,0,0,.5,0,.5,0,.5,0,0,1,0,0,0,0,1):n.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),n.multiply(Fo)}getViewport(t){return this._viewports[t]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(t){return this.camera=t.camera.clone(),this.intensity=t.intensity,this.bias=t.bias,this.radius=t.radius,this.autoUpdate=t.autoUpdate,this.needsUpdate=t.needsUpdate,this.normalBias=t.normalBias,this.blurSamples=t.blurSamples,this.mapSize.copy(t.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){const t={};return this.intensity!==1&&(t.intensity=this.intensity),this.bias!==0&&(t.bias=this.bias),this.normalBias!==0&&(t.normalBias=this.normalBias),this.radius!==1&&(t.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(t.mapSize=this.mapSize.toArray()),t.camera=this.camera.toJSON(!1).object,delete t.camera.matrix,t}}class Yp extends Lf{constructor(){super(new Mn(50,1,.5,500)),this.isSpotLightShadow=!0,this.focus=1,this.aspect=1}updateMatrices(t){const e=this.camera,n=cs*2*t.angle*this.focus,r=this.mapSize.width/this.mapSize.height*this.aspect,s=t.distance||e.far;(n!==e.fov||r!==e.aspect||s!==e.far)&&(e.fov=n,e.aspect=r,e.far=s,e.updateProjectionMatrix()),super.updateMatrices(t)}copy(t){return super.copy(t),this.focus=t.focus,this}}class $p extends Sl{constructor(t,e,n=0,r=Math.PI/3,s=0,a=2){super(t,e),this.isSpotLight=!0,this.type="SpotLight",this.position.copy(Re.DEFAULT_UP),this.updateMatrix(),this.target=new Re,this.distance=n,this.angle=r,this.penumbra=s,this.decay=a,this.map=null,this.shadow=new Yp}get power(){return this.intensity*Math.PI}set power(t){this.intensity=t/Math.PI}dispose(){this.shadow.dispose()}copy(t,e){return super.copy(t,e),this.distance=t.distance,this.angle=t.angle,this.penumbra=t.penumbra,this.decay=t.decay,this.target=t.target.clone(),this.shadow=t.shadow.clone(),this}}class wl extends bf{constructor(t=-1,e=1,n=1,r=-1,s=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=t,this.right=e,this.top=n,this.bottom=r,this.near=s,this.far=a,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.left=t.left,this.right=t.right,this.top=t.top,this.bottom=t.bottom,this.near=t.near,this.far=t.far,this.zoom=t.zoom,this.view=t.view===null?null:Object.assign({},t.view),this}setViewOffset(t,e,n,r,s,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=r,this.view.width=s,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=(this.right-this.left)/(2*this.zoom),e=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,r=(this.top+this.bottom)/2;let s=n-t,a=n+t,o=r+e,c=r-e;if(this.view!==null&&this.view.enabled){const l=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;s+=l*this.view.offsetX,a=s+l*this.view.width,o-=h*this.view.offsetY,c=o-h*this.view.height}this.projectionMatrix.makeOrthographic(s,a,o,c,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.zoom=this.zoom,e.object.left=this.left,e.object.right=this.right,e.object.top=this.top,e.object.bottom=this.bottom,e.object.near=this.near,e.object.far=this.far,this.view!==null&&(e.object.view=Object.assign({},this.view)),e}}class jp extends Lf{constructor(){super(new wl(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class Xc extends Sl{constructor(t,e){super(t,e),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(Re.DEFAULT_UP),this.updateMatrix(),this.target=new Re,this.shadow=new jp}dispose(){this.shadow.dispose()}copy(t){return super.copy(t),this.target=t.target.clone(),this.shadow=t.shadow.clone(),this}}class Kp extends Mn{constructor(t=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=t}}function Ih(i,t,e,n){const r=Zp(n);switch(e){case lf:return i*t;case uf:return i*t/r.components*r.byteLength;case ul:return i*t/r.components*r.byteLength;case ff:return i*t*2/r.components*r.byteLength;case fl:return i*t*2/r.components*r.byteLength;case hf:return i*t*3/r.components*r.byteLength;case Ve:return i*t*4/r.components*r.byteLength;case dl:return i*t*4/r.components*r.byteLength;case Oa:case Ba:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*8;case ka:case Ha:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*16;case vc:case _c:return Math.max(i,16)*Math.max(t,8)/4;case gc:case xc:return Math.max(i,8)*Math.max(t,8)/2;case Mc:case bc:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*8;case yc:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*16;case Sc:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*16;case wc:return Math.floor((i+4)/5)*Math.floor((t+3)/4)*16;case Ec:return Math.floor((i+4)/5)*Math.floor((t+4)/5)*16;case Tc:return Math.floor((i+5)/6)*Math.floor((t+4)/5)*16;case Ac:return Math.floor((i+5)/6)*Math.floor((t+5)/6)*16;case Rc:return Math.floor((i+7)/8)*Math.floor((t+4)/5)*16;case Cc:return Math.floor((i+7)/8)*Math.floor((t+5)/6)*16;case Lc:return Math.floor((i+7)/8)*Math.floor((t+7)/8)*16;case Pc:return Math.floor((i+9)/10)*Math.floor((t+4)/5)*16;case Dc:return Math.floor((i+9)/10)*Math.floor((t+5)/6)*16;case Ic:return Math.floor((i+9)/10)*Math.floor((t+7)/8)*16;case Uc:return Math.floor((i+9)/10)*Math.floor((t+9)/10)*16;case Nc:return Math.floor((i+11)/12)*Math.floor((t+9)/10)*16;case Fc:return Math.floor((i+11)/12)*Math.floor((t+11)/12)*16;case Oc:case Bc:case kc:return Math.ceil(i/4)*Math.ceil(t/4)*16;case Hc:case zc:return Math.ceil(i/4)*Math.ceil(t/4)*8;case Vc:case Gc:return Math.ceil(i/4)*Math.ceil(t/4)*16}throw new Error(`Unable to determine texture byte length for ${e} format.`)}function Zp(i){switch(i){case Gn:case sf:return{byteLength:1,components:1};case Is:case af:case xr:return{byteLength:2,components:1};case ll:case hl:return{byteLength:2,components:4};case pr:case cl:case ti:return{byteLength:4,components:1};case of:case cf:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${i}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:ol}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=ol);/**
 * @license
 * Copyright 2010-2025 Three.js Authors
 * SPDX-License-Identifier: MIT
 */function Pf(){let i=null,t=!1,e=null,n=null;function r(s,a){e(s,a),n=i.requestAnimationFrame(r)}return{start:function(){t!==!0&&e!==null&&(n=i.requestAnimationFrame(r),t=!0)},stop:function(){i.cancelAnimationFrame(n),t=!1},setAnimationLoop:function(s){e=s},setContext:function(s){i=s}}}function Jp(i){const t=new WeakMap;function e(o,c){const l=o.array,h=o.usage,u=l.byteLength,d=i.createBuffer();i.bindBuffer(c,d),i.bufferData(c,l,h),o.onUploadCallback();let f;if(l instanceof Float32Array)f=i.FLOAT;else if(typeof Float16Array<"u"&&l instanceof Float16Array)f=i.HALF_FLOAT;else if(l instanceof Uint16Array)o.isFloat16BufferAttribute?f=i.HALF_FLOAT:f=i.UNSIGNED_SHORT;else if(l instanceof Int16Array)f=i.SHORT;else if(l instanceof Uint32Array)f=i.UNSIGNED_INT;else if(l instanceof Int32Array)f=i.INT;else if(l instanceof Int8Array)f=i.BYTE;else if(l instanceof Uint8Array)f=i.UNSIGNED_BYTE;else if(l instanceof Uint8ClampedArray)f=i.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+l);return{buffer:d,type:f,bytesPerElement:l.BYTES_PER_ELEMENT,version:o.version,size:u}}function n(o,c,l){const h=c.array,u=c.updateRanges;if(i.bindBuffer(l,o),u.length===0)i.bufferSubData(l,0,h);else{u.sort((f,g)=>f.start-g.start);let d=0;for(let f=1;f<u.length;f++){const g=u[d],v=u[f];v.start<=g.start+g.count+1?g.count=Math.max(g.count,v.start+v.count-g.start):(++d,u[d]=v)}u.length=d+1;for(let f=0,g=u.length;f<g;f++){const v=u[f];i.bufferSubData(l,v.start*h.BYTES_PER_ELEMENT,h,v.start,v.count)}c.clearUpdateRanges()}c.onUploadCallback()}function r(o){return o.isInterleavedBufferAttribute&&(o=o.data),t.get(o)}function s(o){o.isInterleavedBufferAttribute&&(o=o.data);const c=t.get(o);c&&(i.deleteBuffer(c.buffer),t.delete(o))}function a(o,c){if(o.isInterleavedBufferAttribute&&(o=o.data),o.isGLBufferAttribute){const h=t.get(o);(!h||h.version<o.version)&&t.set(o,{buffer:o.buffer,type:o.type,bytesPerElement:o.elementSize,version:o.version});return}const l=t.get(o);if(l===void 0)t.set(o,e(o,c));else if(l.version<o.version){if(l.size!==o.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");n(l.buffer,o,c),l.version=o.version}}return{get:r,remove:s,update:a}}var Qp=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,t1=`#ifdef USE_ALPHAHASH
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
#endif`,e1=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,n1=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,i1=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,r1=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,s1=`#ifdef USE_AOMAP
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
#endif`,a1=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,o1=`#ifdef USE_BATCHING
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
#endif`,c1=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,l1=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,h1=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,u1=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,f1=`#ifdef USE_IRIDESCENCE
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
#endif`,d1=`#ifdef USE_BUMPMAP
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
#endif`,p1=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,m1=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,g1=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,v1=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,x1=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,_1=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,M1=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,b1=`#if defined( USE_COLOR_ALPHA )
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
#endif`,y1=`#define PI 3.141592653589793
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
} // validated`,S1=`#ifdef ENVMAP_TYPE_CUBE_UV
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
#endif`,w1=`vec3 transformedNormal = objectNormal;
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
#endif`,E1=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,T1=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,A1=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,R1=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,C1="gl_FragColor = linearToOutputTexel( gl_FragColor );",L1=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,P1=`#ifdef USE_ENVMAP
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
#endif`,D1=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,I1=`#ifdef USE_ENVMAP
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
#endif`,U1=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,N1=`#ifdef USE_ENVMAP
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
#endif`,F1=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,O1=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,B1=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,k1=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,H1=`#ifdef USE_GRADIENTMAP
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
}`,z1=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,V1=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,G1=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,W1=`uniform bool receiveShadow;
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
#endif`,X1=`#ifdef USE_ENVMAP
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
#endif`,q1=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,Y1=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,$1=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,j1=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,K1=`PhysicalMaterial material;
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
#endif`,Z1=`struct PhysicalMaterial {
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
}`,J1=`
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
#endif`,Q1=`#if defined( RE_IndirectDiffuse )
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
#endif`,tm=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,em=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,nm=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,im=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,rm=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,sm=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,am=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,om=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,cm=`#if defined( USE_POINTS_UV )
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
#endif`,lm=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,hm=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,um=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,fm=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,dm=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,pm=`#ifdef USE_MORPHTARGETS
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
#endif`,mm=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,gm=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 nonPerturbedNormal = normal;`,vm=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
#endif`,xm=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,_m=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Mm=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,bm=`#ifdef USE_NORMALMAP
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
#endif`,ym=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,Sm=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,wm=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,Em=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,Tm=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,Am=`vec3 packNormalToRGB( const in vec3 normal ) {
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
}`,Rm=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,Cm=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,Lm=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,Pm=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,Dm=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,Im=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,Um=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,Nm=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,Fm=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
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
#endif`,Om=`float getShadowMask() {
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
}`,Bm=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,km=`#ifdef USE_SKINNING
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
#endif`,Hm=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,zm=`#ifdef USE_SKINNING
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
#endif`,Vm=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,Gm=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,Wm=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,Xm=`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,qm=`#ifdef USE_TRANSMISSION
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
#endif`,Ym=`#ifdef USE_TRANSMISSION
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
#endif`,$m=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,jm=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,Km=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,Zm=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const Jm=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,Qm=`uniform sampler2D t2D;
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
}`,tg=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,eg=`#ifdef ENVMAP_TYPE_CUBE
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
}`,ng=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,ig=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,rg=`#include <common>
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
}`,sg=`#if DEPTH_PACKING == 3200
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
}`,ag=`#define DISTANCE
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
}`,og=`#define DISTANCE
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
}`,cg=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,lg=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,hg=`uniform float scale;
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
}`,ug=`uniform vec3 diffuse;
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
}`,fg=`#include <common>
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
}`,dg=`uniform vec3 diffuse;
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
}`,pg=`#define LAMBERT
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
}`,mg=`#define LAMBERT
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
}`,gg=`#define MATCAP
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
}`,vg=`#define MATCAP
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
}`,xg=`#define NORMAL
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
}`,_g=`#define NORMAL
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
}`,Mg=`#define PHONG
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
}`,bg=`#define PHONG
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
}`,yg=`#define STANDARD
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
}`,Sg=`#define STANDARD
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
}`,wg=`#define TOON
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
}`,Eg=`#define TOON
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
}`,Tg=`uniform float size;
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
}`,Ag=`uniform vec3 diffuse;
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
}`,Rg=`#include <common>
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
}`,Cg=`uniform vec3 color;
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
}`,Lg=`uniform float rotation;
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
}`,Pg=`uniform vec3 diffuse;
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
}`,Qt={alphahash_fragment:Qp,alphahash_pars_fragment:t1,alphamap_fragment:e1,alphamap_pars_fragment:n1,alphatest_fragment:i1,alphatest_pars_fragment:r1,aomap_fragment:s1,aomap_pars_fragment:a1,batching_pars_vertex:o1,batching_vertex:c1,begin_vertex:l1,beginnormal_vertex:h1,bsdfs:u1,iridescence_fragment:f1,bumpmap_pars_fragment:d1,clipping_planes_fragment:p1,clipping_planes_pars_fragment:m1,clipping_planes_pars_vertex:g1,clipping_planes_vertex:v1,color_fragment:x1,color_pars_fragment:_1,color_pars_vertex:M1,color_vertex:b1,common:y1,cube_uv_reflection_fragment:S1,defaultnormal_vertex:w1,displacementmap_pars_vertex:E1,displacementmap_vertex:T1,emissivemap_fragment:A1,emissivemap_pars_fragment:R1,colorspace_fragment:C1,colorspace_pars_fragment:L1,envmap_fragment:P1,envmap_common_pars_fragment:D1,envmap_pars_fragment:I1,envmap_pars_vertex:U1,envmap_physical_pars_fragment:X1,envmap_vertex:N1,fog_vertex:F1,fog_pars_vertex:O1,fog_fragment:B1,fog_pars_fragment:k1,gradientmap_pars_fragment:H1,lightmap_pars_fragment:z1,lights_lambert_fragment:V1,lights_lambert_pars_fragment:G1,lights_pars_begin:W1,lights_toon_fragment:q1,lights_toon_pars_fragment:Y1,lights_phong_fragment:$1,lights_phong_pars_fragment:j1,lights_physical_fragment:K1,lights_physical_pars_fragment:Z1,lights_fragment_begin:J1,lights_fragment_maps:Q1,lights_fragment_end:tm,logdepthbuf_fragment:em,logdepthbuf_pars_fragment:nm,logdepthbuf_pars_vertex:im,logdepthbuf_vertex:rm,map_fragment:sm,map_pars_fragment:am,map_particle_fragment:om,map_particle_pars_fragment:cm,metalnessmap_fragment:lm,metalnessmap_pars_fragment:hm,morphinstance_vertex:um,morphcolor_vertex:fm,morphnormal_vertex:dm,morphtarget_pars_vertex:pm,morphtarget_vertex:mm,normal_fragment_begin:gm,normal_fragment_maps:vm,normal_pars_fragment:xm,normal_pars_vertex:_m,normal_vertex:Mm,normalmap_pars_fragment:bm,clearcoat_normal_fragment_begin:ym,clearcoat_normal_fragment_maps:Sm,clearcoat_pars_fragment:wm,iridescence_pars_fragment:Em,opaque_fragment:Tm,packing:Am,premultiplied_alpha_fragment:Rm,project_vertex:Cm,dithering_fragment:Lm,dithering_pars_fragment:Pm,roughnessmap_fragment:Dm,roughnessmap_pars_fragment:Im,shadowmap_pars_fragment:Um,shadowmap_pars_vertex:Nm,shadowmap_vertex:Fm,shadowmask_pars_fragment:Om,skinbase_vertex:Bm,skinning_pars_vertex:km,skinning_vertex:Hm,skinnormal_vertex:zm,specularmap_fragment:Vm,specularmap_pars_fragment:Gm,tonemapping_fragment:Wm,tonemapping_pars_fragment:Xm,transmission_fragment:qm,transmission_pars_fragment:Ym,uv_pars_fragment:$m,uv_pars_vertex:jm,uv_vertex:Km,worldpos_vertex:Zm,background_vert:Jm,background_frag:Qm,backgroundCube_vert:tg,backgroundCube_frag:eg,cube_vert:ng,cube_frag:ig,depth_vert:rg,depth_frag:sg,distanceRGBA_vert:ag,distanceRGBA_frag:og,equirect_vert:cg,equirect_frag:lg,linedashed_vert:hg,linedashed_frag:ug,meshbasic_vert:fg,meshbasic_frag:dg,meshlambert_vert:pg,meshlambert_frag:mg,meshmatcap_vert:gg,meshmatcap_frag:vg,meshnormal_vert:xg,meshnormal_frag:_g,meshphong_vert:Mg,meshphong_frag:bg,meshphysical_vert:yg,meshphysical_frag:Sg,meshtoon_vert:wg,meshtoon_frag:Eg,points_vert:Tg,points_frag:Ag,shadow_vert:Rg,shadow_frag:Cg,sprite_vert:Lg,sprite_frag:Pg},Et={common:{diffuse:{value:new Ut(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Jt},alphaMap:{value:null},alphaMapTransform:{value:new Jt},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Jt}},envmap:{envMap:{value:null},envMapRotation:{value:new Jt},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Jt}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Jt}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Jt},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Jt},normalScale:{value:new bt(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Jt},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Jt}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Jt}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Jt}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Ut(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new Ut(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Jt},alphaTest:{value:0},uvTransform:{value:new Jt}},sprite:{diffuse:{value:new Ut(16777215)},opacity:{value:1},center:{value:new bt(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Jt},alphaMap:{value:null},alphaMapTransform:{value:new Jt},alphaTest:{value:0}}},Jn={basic:{uniforms:Ze([Et.common,Et.specularmap,Et.envmap,Et.aomap,Et.lightmap,Et.fog]),vertexShader:Qt.meshbasic_vert,fragmentShader:Qt.meshbasic_frag},lambert:{uniforms:Ze([Et.common,Et.specularmap,Et.envmap,Et.aomap,Et.lightmap,Et.emissivemap,Et.bumpmap,Et.normalmap,Et.displacementmap,Et.fog,Et.lights,{emissive:{value:new Ut(0)}}]),vertexShader:Qt.meshlambert_vert,fragmentShader:Qt.meshlambert_frag},phong:{uniforms:Ze([Et.common,Et.specularmap,Et.envmap,Et.aomap,Et.lightmap,Et.emissivemap,Et.bumpmap,Et.normalmap,Et.displacementmap,Et.fog,Et.lights,{emissive:{value:new Ut(0)},specular:{value:new Ut(1118481)},shininess:{value:30}}]),vertexShader:Qt.meshphong_vert,fragmentShader:Qt.meshphong_frag},standard:{uniforms:Ze([Et.common,Et.envmap,Et.aomap,Et.lightmap,Et.emissivemap,Et.bumpmap,Et.normalmap,Et.displacementmap,Et.roughnessmap,Et.metalnessmap,Et.fog,Et.lights,{emissive:{value:new Ut(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Qt.meshphysical_vert,fragmentShader:Qt.meshphysical_frag},toon:{uniforms:Ze([Et.common,Et.aomap,Et.lightmap,Et.emissivemap,Et.bumpmap,Et.normalmap,Et.displacementmap,Et.gradientmap,Et.fog,Et.lights,{emissive:{value:new Ut(0)}}]),vertexShader:Qt.meshtoon_vert,fragmentShader:Qt.meshtoon_frag},matcap:{uniforms:Ze([Et.common,Et.bumpmap,Et.normalmap,Et.displacementmap,Et.fog,{matcap:{value:null}}]),vertexShader:Qt.meshmatcap_vert,fragmentShader:Qt.meshmatcap_frag},points:{uniforms:Ze([Et.points,Et.fog]),vertexShader:Qt.points_vert,fragmentShader:Qt.points_frag},dashed:{uniforms:Ze([Et.common,Et.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Qt.linedashed_vert,fragmentShader:Qt.linedashed_frag},depth:{uniforms:Ze([Et.common,Et.displacementmap]),vertexShader:Qt.depth_vert,fragmentShader:Qt.depth_frag},normal:{uniforms:Ze([Et.common,Et.bumpmap,Et.normalmap,Et.displacementmap,{opacity:{value:1}}]),vertexShader:Qt.meshnormal_vert,fragmentShader:Qt.meshnormal_frag},sprite:{uniforms:Ze([Et.sprite,Et.fog]),vertexShader:Qt.sprite_vert,fragmentShader:Qt.sprite_frag},background:{uniforms:{uvTransform:{value:new Jt},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Qt.background_vert,fragmentShader:Qt.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new Jt}},vertexShader:Qt.backgroundCube_vert,fragmentShader:Qt.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Qt.cube_vert,fragmentShader:Qt.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Qt.equirect_vert,fragmentShader:Qt.equirect_frag},distanceRGBA:{uniforms:Ze([Et.common,Et.displacementmap,{referencePosition:{value:new I},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Qt.distanceRGBA_vert,fragmentShader:Qt.distanceRGBA_frag},shadow:{uniforms:Ze([Et.lights,Et.fog,{color:{value:new Ut(0)},opacity:{value:1}}]),vertexShader:Qt.shadow_vert,fragmentShader:Qt.shadow_frag}};Jn.physical={uniforms:Ze([Jn.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Jt},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Jt},clearcoatNormalScale:{value:new bt(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Jt},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Jt},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Jt},sheen:{value:0},sheenColor:{value:new Ut(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Jt},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Jt},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Jt},transmissionSamplerSize:{value:new bt},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Jt},attenuationDistance:{value:0},attenuationColor:{value:new Ut(0)},specularColor:{value:new Ut(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Jt},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Jt},anisotropyVector:{value:new bt},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Jt}}]),vertexShader:Qt.meshphysical_vert,fragmentShader:Qt.meshphysical_frag};const Sa={r:0,b:0,g:0},er=new In,Dg=new ne;function Ig(i,t,e,n,r,s,a){const o=new Ut(0);let c=s===!0?0:1,l,h,u=null,d=0,f=null;function g(y){let _=y.isScene===!0?y.background:null;return _&&_.isTexture&&(_=(y.backgroundBlurriness>0?e:t).get(_)),_}function v(y){let _=!1;const E=g(y);E===null?p(o,c):E&&E.isColor&&(p(E,1),_=!0);const w=i.xr.getEnvironmentBlendMode();w==="additive"?n.buffers.color.setClear(0,0,0,1,a):w==="alpha-blend"&&n.buffers.color.setClear(0,0,0,0,a),(i.autoClear||_)&&(n.buffers.depth.setTest(!0),n.buffers.depth.setMask(!0),n.buffers.color.setMask(!0),i.clear(i.autoClearColor,i.autoClearDepth,i.autoClearStencil))}function m(y,_){const E=g(_);E&&(E.isCubeTexture||E.mapping===to)?(h===void 0&&(h=new Pt(new nn(1,1,1),new ke({name:"BackgroundCubeMaterial",uniforms:ls(Jn.backgroundCube.uniforms),vertexShader:Jn.backgroundCube.vertexShader,fragmentShader:Jn.backgroundCube.fragmentShader,side:dn,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),h.geometry.deleteAttribute("normal"),h.geometry.deleteAttribute("uv"),h.onBeforeRender=function(w,A,R){this.matrixWorld.copyPosition(R.matrixWorld)},Object.defineProperty(h.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),r.update(h)),er.copy(_.backgroundRotation),er.x*=-1,er.y*=-1,er.z*=-1,E.isCubeTexture&&E.isRenderTargetTexture===!1&&(er.y*=-1,er.z*=-1),h.material.uniforms.envMap.value=E,h.material.uniforms.flipEnvMap.value=E.isCubeTexture&&E.isRenderTargetTexture===!1?-1:1,h.material.uniforms.backgroundBlurriness.value=_.backgroundBlurriness,h.material.uniforms.backgroundIntensity.value=_.backgroundIntensity,h.material.uniforms.backgroundRotation.value.setFromMatrix4(Dg.makeRotationFromEuler(er)),h.material.toneMapped=se.getTransfer(E.colorSpace)!==he,(u!==E||d!==E.version||f!==i.toneMapping)&&(h.material.needsUpdate=!0,u=E,d=E.version,f=i.toneMapping),h.layers.enableAll(),y.unshift(h,h.geometry,h.material,0,0,null)):E&&E.isTexture&&(l===void 0&&(l=new Pt(new Mi(2,2),new ke({name:"BackgroundMaterial",uniforms:ls(Jn.background.uniforms),vertexShader:Jn.background.vertexShader,fragmentShader:Jn.background.fragmentShader,side:Xi,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),l.geometry.deleteAttribute("normal"),Object.defineProperty(l.material,"map",{get:function(){return this.uniforms.t2D.value}}),r.update(l)),l.material.uniforms.t2D.value=E,l.material.uniforms.backgroundIntensity.value=_.backgroundIntensity,l.material.toneMapped=se.getTransfer(E.colorSpace)!==he,E.matrixAutoUpdate===!0&&E.updateMatrix(),l.material.uniforms.uvTransform.value.copy(E.matrix),(u!==E||d!==E.version||f!==i.toneMapping)&&(l.material.needsUpdate=!0,u=E,d=E.version,f=i.toneMapping),l.layers.enableAll(),y.unshift(l,l.geometry,l.material,0,0,null))}function p(y,_){y.getRGB(Sa,Mf(i)),n.buffers.color.setClear(Sa.r,Sa.g,Sa.b,_,a)}function b(){h!==void 0&&(h.geometry.dispose(),h.material.dispose(),h=void 0),l!==void 0&&(l.geometry.dispose(),l.material.dispose(),l=void 0)}return{getClearColor:function(){return o},setClearColor:function(y,_=1){o.set(y),c=_,p(o,c)},getClearAlpha:function(){return c},setClearAlpha:function(y){c=y,p(o,c)},render:v,addToRenderList:m,dispose:b}}function Ug(i,t){const e=i.getParameter(i.MAX_VERTEX_ATTRIBS),n={},r=d(null);let s=r,a=!1;function o(M,S,T,D,U){let N=!1;const z=u(D,T,S);s!==z&&(s=z,l(s.object)),N=f(M,D,T,U),N&&g(M,D,T,U),U!==null&&t.update(U,i.ELEMENT_ARRAY_BUFFER),(N||a)&&(a=!1,_(M,S,T,D),U!==null&&i.bindBuffer(i.ELEMENT_ARRAY_BUFFER,t.get(U).buffer))}function c(){return i.createVertexArray()}function l(M){return i.bindVertexArray(M)}function h(M){return i.deleteVertexArray(M)}function u(M,S,T){const D=T.wireframe===!0;let U=n[M.id];U===void 0&&(U={},n[M.id]=U);let N=U[S.id];N===void 0&&(N={},U[S.id]=N);let z=N[D];return z===void 0&&(z=d(c()),N[D]=z),z}function d(M){const S=[],T=[],D=[];for(let U=0;U<e;U++)S[U]=0,T[U]=0,D[U]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:S,enabledAttributes:T,attributeDivisors:D,object:M,attributes:{},index:null}}function f(M,S,T,D){const U=s.attributes,N=S.attributes;let z=0;const $=T.getAttributes();for(const V in $)if($[V].location>=0){const rt=U[V];let lt=N[V];if(lt===void 0&&(V==="instanceMatrix"&&M.instanceMatrix&&(lt=M.instanceMatrix),V==="instanceColor"&&M.instanceColor&&(lt=M.instanceColor)),rt===void 0||rt.attribute!==lt||lt&&rt.data!==lt.data)return!0;z++}return s.attributesNum!==z||s.index!==D}function g(M,S,T,D){const U={},N=S.attributes;let z=0;const $=T.getAttributes();for(const V in $)if($[V].location>=0){let rt=N[V];rt===void 0&&(V==="instanceMatrix"&&M.instanceMatrix&&(rt=M.instanceMatrix),V==="instanceColor"&&M.instanceColor&&(rt=M.instanceColor));const lt={};lt.attribute=rt,rt&&rt.data&&(lt.data=rt.data),U[V]=lt,z++}s.attributes=U,s.attributesNum=z,s.index=D}function v(){const M=s.newAttributes;for(let S=0,T=M.length;S<T;S++)M[S]=0}function m(M){p(M,0)}function p(M,S){const T=s.newAttributes,D=s.enabledAttributes,U=s.attributeDivisors;T[M]=1,D[M]===0&&(i.enableVertexAttribArray(M),D[M]=1),U[M]!==S&&(i.vertexAttribDivisor(M,S),U[M]=S)}function b(){const M=s.newAttributes,S=s.enabledAttributes;for(let T=0,D=S.length;T<D;T++)S[T]!==M[T]&&(i.disableVertexAttribArray(T),S[T]=0)}function y(M,S,T,D,U,N,z){z===!0?i.vertexAttribIPointer(M,S,T,U,N):i.vertexAttribPointer(M,S,T,D,U,N)}function _(M,S,T,D){v();const U=D.attributes,N=T.getAttributes(),z=S.defaultAttributeValues;for(const $ in N){const V=N[$];if(V.location>=0){let tt=U[$];if(tt===void 0&&($==="instanceMatrix"&&M.instanceMatrix&&(tt=M.instanceMatrix),$==="instanceColor"&&M.instanceColor&&(tt=M.instanceColor)),tt!==void 0){const rt=tt.normalized,lt=tt.itemSize,xt=t.get(tt);if(xt===void 0)continue;const Ct=xt.buffer,Ot=xt.type,nt=xt.bytesPerElement,W=Ot===i.INT||Ot===i.UNSIGNED_INT||tt.gpuType===cl;if(tt.isInterleavedBufferAttribute){const K=tt.data,F=K.stride,k=tt.offset;if(K.isInstancedInterleavedBuffer){for(let H=0;H<V.locationSize;H++)p(V.location+H,K.meshPerAttribute);M.isInstancedMesh!==!0&&D._maxInstanceCount===void 0&&(D._maxInstanceCount=K.meshPerAttribute*K.count)}else for(let H=0;H<V.locationSize;H++)m(V.location+H);i.bindBuffer(i.ARRAY_BUFFER,Ct);for(let H=0;H<V.locationSize;H++)y(V.location+H,lt/V.locationSize,Ot,rt,F*nt,(k+lt/V.locationSize*H)*nt,W)}else{if(tt.isInstancedBufferAttribute){for(let K=0;K<V.locationSize;K++)p(V.location+K,tt.meshPerAttribute);M.isInstancedMesh!==!0&&D._maxInstanceCount===void 0&&(D._maxInstanceCount=tt.meshPerAttribute*tt.count)}else for(let K=0;K<V.locationSize;K++)m(V.location+K);i.bindBuffer(i.ARRAY_BUFFER,Ct);for(let K=0;K<V.locationSize;K++)y(V.location+K,lt/V.locationSize,Ot,rt,lt*nt,lt/V.locationSize*K*nt,W)}}else if(z!==void 0){const rt=z[$];if(rt!==void 0)switch(rt.length){case 2:i.vertexAttrib2fv(V.location,rt);break;case 3:i.vertexAttrib3fv(V.location,rt);break;case 4:i.vertexAttrib4fv(V.location,rt);break;default:i.vertexAttrib1fv(V.location,rt)}}}}b()}function E(){R();for(const M in n){const S=n[M];for(const T in S){const D=S[T];for(const U in D)h(D[U].object),delete D[U];delete S[T]}delete n[M]}}function w(M){if(n[M.id]===void 0)return;const S=n[M.id];for(const T in S){const D=S[T];for(const U in D)h(D[U].object),delete D[U];delete S[T]}delete n[M.id]}function A(M){for(const S in n){const T=n[S];if(T[M.id]===void 0)continue;const D=T[M.id];for(const U in D)h(D[U].object),delete D[U];delete T[M.id]}}function R(){x(),a=!0,s!==r&&(s=r,l(s.object))}function x(){r.geometry=null,r.program=null,r.wireframe=!1}return{setup:o,reset:R,resetDefaultState:x,dispose:E,releaseStatesOfGeometry:w,releaseStatesOfProgram:A,initAttributes:v,enableAttribute:m,disableUnusedAttributes:b}}function Ng(i,t,e){let n;function r(l){n=l}function s(l,h){i.drawArrays(n,l,h),e.update(h,n,1)}function a(l,h,u){u!==0&&(i.drawArraysInstanced(n,l,h,u),e.update(h,n,u))}function o(l,h,u){if(u===0)return;t.get("WEBGL_multi_draw").multiDrawArraysWEBGL(n,l,0,h,0,u);let f=0;for(let g=0;g<u;g++)f+=h[g];e.update(f,n,1)}function c(l,h,u,d){if(u===0)return;const f=t.get("WEBGL_multi_draw");if(f===null)for(let g=0;g<l.length;g++)a(l[g],h[g],d[g]);else{f.multiDrawArraysInstancedWEBGL(n,l,0,h,0,d,0,u);let g=0;for(let v=0;v<u;v++)g+=h[v]*d[v];e.update(g,n,1)}}this.setMode=r,this.render=s,this.renderInstances=a,this.renderMultiDraw=o,this.renderMultiDrawInstances=c}function Fg(i,t,e,n){let r;function s(){if(r!==void 0)return r;if(t.has("EXT_texture_filter_anisotropic")===!0){const A=t.get("EXT_texture_filter_anisotropic");r=i.getParameter(A.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else r=0;return r}function a(A){return!(A!==Ve&&n.convert(A)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_FORMAT))}function o(A){const R=A===xr&&(t.has("EXT_color_buffer_half_float")||t.has("EXT_color_buffer_float"));return!(A!==Gn&&n.convert(A)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_TYPE)&&A!==ti&&!R)}function c(A){if(A==="highp"){if(i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.HIGH_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.HIGH_FLOAT).precision>0)return"highp";A="mediump"}return A==="mediump"&&i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.MEDIUM_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let l=e.precision!==void 0?e.precision:"highp";const h=c(l);h!==l&&(console.warn("THREE.WebGLRenderer:",l,"not supported, using",h,"instead."),l=h);const u=e.logarithmicDepthBuffer===!0,d=e.reversedDepthBuffer===!0&&t.has("EXT_clip_control"),f=i.getParameter(i.MAX_TEXTURE_IMAGE_UNITS),g=i.getParameter(i.MAX_VERTEX_TEXTURE_IMAGE_UNITS),v=i.getParameter(i.MAX_TEXTURE_SIZE),m=i.getParameter(i.MAX_CUBE_MAP_TEXTURE_SIZE),p=i.getParameter(i.MAX_VERTEX_ATTRIBS),b=i.getParameter(i.MAX_VERTEX_UNIFORM_VECTORS),y=i.getParameter(i.MAX_VARYING_VECTORS),_=i.getParameter(i.MAX_FRAGMENT_UNIFORM_VECTORS),E=g>0,w=i.getParameter(i.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:s,getMaxPrecision:c,textureFormatReadable:a,textureTypeReadable:o,precision:l,logarithmicDepthBuffer:u,reversedDepthBuffer:d,maxTextures:f,maxVertexTextures:g,maxTextureSize:v,maxCubemapSize:m,maxAttributes:p,maxVertexUniforms:b,maxVaryings:y,maxFragmentUniforms:_,vertexTextures:E,maxSamples:w}}function Og(i){const t=this;let e=null,n=0,r=!1,s=!1;const a=new rr,o=new Jt,c={value:null,needsUpdate:!1};this.uniform=c,this.numPlanes=0,this.numIntersection=0,this.init=function(u,d){const f=u.length!==0||d||n!==0||r;return r=d,n=u.length,f},this.beginShadows=function(){s=!0,h(null)},this.endShadows=function(){s=!1},this.setGlobalState=function(u,d){e=h(u,d,0)},this.setState=function(u,d,f){const g=u.clippingPlanes,v=u.clipIntersection,m=u.clipShadows,p=i.get(u);if(!r||g===null||g.length===0||s&&!m)s?h(null):l();else{const b=s?0:n,y=b*4;let _=p.clippingState||null;c.value=_,_=h(g,d,y,f);for(let E=0;E!==y;++E)_[E]=e[E];p.clippingState=_,this.numIntersection=v?this.numPlanes:0,this.numPlanes+=b}};function l(){c.value!==e&&(c.value=e,c.needsUpdate=n>0),t.numPlanes=n,t.numIntersection=0}function h(u,d,f,g){const v=u!==null?u.length:0;let m=null;if(v!==0){if(m=c.value,g!==!0||m===null){const p=f+v*4,b=d.matrixWorldInverse;o.getNormalMatrix(b),(m===null||m.length<p)&&(m=new Float32Array(p));for(let y=0,_=f;y!==v;++y,_+=4)a.copy(u[y]).applyMatrix4(b,o),a.normal.toArray(m,_),m[_+3]=a.constant}c.value=m,c.needsUpdate=!0}return t.numPlanes=v,t.numIntersection=0,m}}function Bg(i){let t=new WeakMap;function e(a,o){return o===Wa?a.mapping=ss:o===pc&&(a.mapping=as),a}function n(a){if(a&&a.isTexture){const o=a.mapping;if(o===Wa||o===pc)if(t.has(a)){const c=t.get(a).texture;return e(c,a.mapping)}else{const c=a.image;if(c&&c.height>0){const l=new _p(c.height);return l.fromEquirectangularTexture(i,a),t.set(a,l),a.addEventListener("dispose",r),e(l.texture,a.mapping)}else return null}}return a}function r(a){const o=a.target;o.removeEventListener("dispose",r);const c=t.get(o);c!==void 0&&(t.delete(o),c.dispose())}function s(){t=new WeakMap}return{get:n,dispose:s}}const $r=4,Uh=[.125,.215,.35,.446,.526,.582],or=20,Oo=new wl,Nh=new Ut;let Bo=null,ko=0,Ho=0,zo=!1;const sr=(1+Math.sqrt(5))/2,Or=1/sr,Fh=[new I(-sr,Or,0),new I(sr,Or,0),new I(-Or,0,sr),new I(Or,0,sr),new I(0,sr,-Or),new I(0,sr,Or),new I(-1,1,-1),new I(1,1,-1),new I(-1,1,1),new I(1,1,1)],kg=new I;class qc{constructor(t){this._renderer=t,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(t,e=0,n=.1,r=100,s={}){const{size:a=256,position:o=kg}=s;Bo=this._renderer.getRenderTarget(),ko=this._renderer.getActiveCubeFace(),Ho=this._renderer.getActiveMipmapLevel(),zo=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(a);const c=this._allocateTargets();return c.depthBuffer=!0,this._sceneToCubeUV(t,n,r,c,o),e>0&&this._blur(c,0,0,e),this._applyPMREM(c),this._cleanup(c),c}fromEquirectangular(t,e=null){return this._fromTexture(t,e)}fromCubemap(t,e=null){return this._fromTexture(t,e)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=kh(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Bh(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(t){this._lodMax=Math.floor(Math.log2(t)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let t=0;t<this._lodPlanes.length;t++)this._lodPlanes[t].dispose()}_cleanup(t){this._renderer.setRenderTarget(Bo,ko,Ho),this._renderer.xr.enabled=zo,t.scissorTest=!1,wa(t,0,0,t.width,t.height)}_fromTexture(t,e){t.mapping===ss||t.mapping===as?this._setSize(t.image.length===0?16:t.image[0].width||t.image[0].image.width):this._setSize(t.image.width/4),Bo=this._renderer.getRenderTarget(),ko=this._renderer.getActiveCubeFace(),Ho=this._renderer.getActiveMipmapLevel(),zo=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const n=e||this._allocateTargets();return this._textureToCubeUV(t,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){const t=3*Math.max(this._cubeSize,112),e=4*this._cubeSize,n={magFilter:ge,minFilter:ge,generateMipmaps:!1,type:xr,format:Ve,colorSpace:mr,depthBuffer:!1},r=Oh(t,e,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==t||this._pingPongRenderTarget.height!==e){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=Oh(t,e,n);const{_lodMax:s}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=Hg(s)),this._blurMaterial=zg(s,t,e)}return r}_compileMaterial(t){const e=new Pt(this._lodPlanes[0],t);this._renderer.compile(e,Oo)}_sceneToCubeUV(t,e,n,r,s){const c=new Mn(90,1,e,n),l=[1,-1,1,1,1,1],h=[1,1,1,-1,-1,-1],u=this._renderer,d=u.autoClear,f=u.toneMapping;u.getClearColor(Nh),u.toneMapping=Gi,u.autoClear=!1,u.state.buffers.depth.getReversed()&&(u.setRenderTarget(r),u.clearDepth(),u.setRenderTarget(null));const v=new Yi({name:"PMREM.Background",side:dn,depthWrite:!1,depthTest:!1}),m=new Pt(new nn,v);let p=!1;const b=t.background;b?b.isColor&&(v.color.copy(b),t.background=null,p=!0):(v.color.copy(Nh),p=!0);for(let y=0;y<6;y++){const _=y%3;_===0?(c.up.set(0,l[y],0),c.position.set(s.x,s.y,s.z),c.lookAt(s.x+h[y],s.y,s.z)):_===1?(c.up.set(0,0,l[y]),c.position.set(s.x,s.y,s.z),c.lookAt(s.x,s.y+h[y],s.z)):(c.up.set(0,l[y],0),c.position.set(s.x,s.y,s.z),c.lookAt(s.x,s.y,s.z+h[y]));const E=this._cubeSize;wa(r,_*E,y>2?E:0,E,E),u.setRenderTarget(r),p&&u.render(m,c),u.render(t,c)}m.geometry.dispose(),m.material.dispose(),u.toneMapping=f,u.autoClear=d,t.background=b}_textureToCubeUV(t,e){const n=this._renderer,r=t.mapping===ss||t.mapping===as;r?(this._cubemapMaterial===null&&(this._cubemapMaterial=kh()),this._cubemapMaterial.uniforms.flipEnvMap.value=t.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=Bh());const s=r?this._cubemapMaterial:this._equirectMaterial,a=new Pt(this._lodPlanes[0],s),o=s.uniforms;o.envMap.value=t;const c=this._cubeSize;wa(e,0,0,3*c,2*c),n.setRenderTarget(e),n.render(a,Oo)}_applyPMREM(t){const e=this._renderer,n=e.autoClear;e.autoClear=!1;const r=this._lodPlanes.length;for(let s=1;s<r;s++){const a=Math.sqrt(this._sigmas[s]*this._sigmas[s]-this._sigmas[s-1]*this._sigmas[s-1]),o=Fh[(r-s-1)%Fh.length];this._blur(t,s-1,s,a,o)}e.autoClear=n}_blur(t,e,n,r,s){const a=this._pingPongRenderTarget;this._halfBlur(t,a,e,n,r,"latitudinal",s),this._halfBlur(a,t,n,n,r,"longitudinal",s)}_halfBlur(t,e,n,r,s,a,o){const c=this._renderer,l=this._blurMaterial;a!=="latitudinal"&&a!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const h=3,u=new Pt(this._lodPlanes[r],l),d=l.uniforms,f=this._sizeLods[n]-1,g=isFinite(s)?Math.PI/(2*f):2*Math.PI/(2*or-1),v=s/g,m=isFinite(s)?1+Math.floor(h*v):or;m>or&&console.warn(`sigmaRadians, ${s}, is too large and will clip, as it requested ${m} samples when the maximum is set to ${or}`);const p=[];let b=0;for(let A=0;A<or;++A){const R=A/v,x=Math.exp(-R*R/2);p.push(x),A===0?b+=x:A<m&&(b+=2*x)}for(let A=0;A<p.length;A++)p[A]=p[A]/b;d.envMap.value=t.texture,d.samples.value=m,d.weights.value=p,d.latitudinal.value=a==="latitudinal",o&&(d.poleAxis.value=o);const{_lodMax:y}=this;d.dTheta.value=g,d.mipInt.value=y-n;const _=this._sizeLods[r],E=3*_*(r>y-$r?r-y+$r:0),w=4*(this._cubeSize-_);wa(e,E,w,3*_,2*_),c.setRenderTarget(e),c.render(u,Oo)}}function Hg(i){const t=[],e=[],n=[];let r=i;const s=i-$r+1+Uh.length;for(let a=0;a<s;a++){const o=Math.pow(2,r);e.push(o);let c=1/o;a>i-$r?c=Uh[a-i+$r-1]:a===0&&(c=0),n.push(c);const l=1/(o-2),h=-l,u=1+l,d=[h,h,u,h,u,u,h,h,u,u,h,u],f=6,g=6,v=3,m=2,p=1,b=new Float32Array(v*g*f),y=new Float32Array(m*g*f),_=new Float32Array(p*g*f);for(let w=0;w<f;w++){const A=w%3*2/3-1,R=w>2?0:-1,x=[A,R,0,A+2/3,R,0,A+2/3,R+1,0,A,R,0,A+2/3,R+1,0,A,R+1,0];b.set(x,v*g*w),y.set(d,m*g*w);const M=[w,w,w,w,w,w];_.set(M,p*g*w)}const E=new Le;E.setAttribute("position",new ie(b,v)),E.setAttribute("uv",new ie(y,m)),E.setAttribute("faceIndex",new ie(_,p)),t.push(E),r>$r&&r--}return{lodPlanes:t,sizeLods:e,sigmas:n}}function Oh(i,t,e){const n=new en(i,t,e);return n.texture.mapping=to,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function wa(i,t,e,n,r){i.viewport.set(t,e,n,r),i.scissor.set(t,e,n,r)}function zg(i,t,e){const n=new Float32Array(or),r=new I(0,1,0);return new ke({name:"SphericalGaussianBlur",defines:{n:or,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/e,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:n},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:r}},vertexShader:El(),fragmentShader:`

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
		`,blending:Vi,depthTest:!1,depthWrite:!1})}function Bh(){return new ke({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:El(),fragmentShader:`

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
		`,blending:Vi,depthTest:!1,depthWrite:!1})}function kh(){return new ke({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:El(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:Vi,depthTest:!1,depthWrite:!1})}function El(){return`

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
	`}function Vg(i){let t=new WeakMap,e=null;function n(o){if(o&&o.isTexture){const c=o.mapping,l=c===Wa||c===pc,h=c===ss||c===as;if(l||h){let u=t.get(o);const d=u!==void 0?u.texture.pmremVersion:0;if(o.isRenderTargetTexture&&o.pmremVersion!==d)return e===null&&(e=new qc(i)),u=l?e.fromEquirectangular(o,u):e.fromCubemap(o,u),u.texture.pmremVersion=o.pmremVersion,t.set(o,u),u.texture;if(u!==void 0)return u.texture;{const f=o.image;return l&&f&&f.height>0||h&&f&&r(f)?(e===null&&(e=new qc(i)),u=l?e.fromEquirectangular(o):e.fromCubemap(o),u.texture.pmremVersion=o.pmremVersion,t.set(o,u),o.addEventListener("dispose",s),u.texture):null}}}return o}function r(o){let c=0;const l=6;for(let h=0;h<l;h++)o[h]!==void 0&&c++;return c===l}function s(o){const c=o.target;c.removeEventListener("dispose",s);const l=t.get(c);l!==void 0&&(t.delete(c),l.dispose())}function a(){t=new WeakMap,e!==null&&(e.dispose(),e=null)}return{get:n,dispose:a}}function Gg(i){const t={};function e(n){if(t[n]!==void 0)return t[n];let r;switch(n){case"WEBGL_depth_texture":r=i.getExtension("WEBGL_depth_texture")||i.getExtension("MOZ_WEBGL_depth_texture")||i.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":r=i.getExtension("EXT_texture_filter_anisotropic")||i.getExtension("MOZ_EXT_texture_filter_anisotropic")||i.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":r=i.getExtension("WEBGL_compressed_texture_s3tc")||i.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":r=i.getExtension("WEBGL_compressed_texture_pvrtc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:r=i.getExtension(n)}return t[n]=r,r}return{has:function(n){return e(n)!==null},init:function(){e("EXT_color_buffer_float"),e("WEBGL_clip_cull_distance"),e("OES_texture_float_linear"),e("EXT_color_buffer_half_float"),e("WEBGL_multisampled_render_to_texture"),e("WEBGL_render_shared_exponent")},get:function(n){const r=e(n);return r===null&&Os("THREE.WebGLRenderer: "+n+" extension not supported."),r}}}function Wg(i,t,e,n){const r={},s=new WeakMap;function a(u){const d=u.target;d.index!==null&&t.remove(d.index);for(const g in d.attributes)t.remove(d.attributes[g]);d.removeEventListener("dispose",a),delete r[d.id];const f=s.get(d);f&&(t.remove(f),s.delete(d)),n.releaseStatesOfGeometry(d),d.isInstancedBufferGeometry===!0&&delete d._maxInstanceCount,e.memory.geometries--}function o(u,d){return r[d.id]===!0||(d.addEventListener("dispose",a),r[d.id]=!0,e.memory.geometries++),d}function c(u){const d=u.attributes;for(const f in d)t.update(d[f],i.ARRAY_BUFFER)}function l(u){const d=[],f=u.index,g=u.attributes.position;let v=0;if(f!==null){const b=f.array;v=f.version;for(let y=0,_=b.length;y<_;y+=3){const E=b[y+0],w=b[y+1],A=b[y+2];d.push(E,w,w,A,A,E)}}else if(g!==void 0){const b=g.array;v=g.version;for(let y=0,_=b.length/3-1;y<_;y+=3){const E=y+0,w=y+1,A=y+2;d.push(E,w,w,A,A,E)}}else return;const m=new(mf(d)?_f:xf)(d,1);m.version=v;const p=s.get(u);p&&t.remove(p),s.set(u,m)}function h(u){const d=s.get(u);if(d){const f=u.index;f!==null&&d.version<f.version&&l(u)}else l(u);return s.get(u)}return{get:o,update:c,getWireframeAttribute:h}}function Xg(i,t,e){let n;function r(d){n=d}let s,a;function o(d){s=d.type,a=d.bytesPerElement}function c(d,f){i.drawElements(n,f,s,d*a),e.update(f,n,1)}function l(d,f,g){g!==0&&(i.drawElementsInstanced(n,f,s,d*a,g),e.update(f,n,g))}function h(d,f,g){if(g===0)return;t.get("WEBGL_multi_draw").multiDrawElementsWEBGL(n,f,0,s,d,0,g);let m=0;for(let p=0;p<g;p++)m+=f[p];e.update(m,n,1)}function u(d,f,g,v){if(g===0)return;const m=t.get("WEBGL_multi_draw");if(m===null)for(let p=0;p<d.length;p++)l(d[p]/a,f[p],v[p]);else{m.multiDrawElementsInstancedWEBGL(n,f,0,s,d,0,v,0,g);let p=0;for(let b=0;b<g;b++)p+=f[b]*v[b];e.update(p,n,1)}}this.setMode=r,this.setIndex=o,this.render=c,this.renderInstances=l,this.renderMultiDraw=h,this.renderMultiDrawInstances=u}function qg(i){const t={geometries:0,textures:0},e={frame:0,calls:0,triangles:0,points:0,lines:0};function n(s,a,o){switch(e.calls++,a){case i.TRIANGLES:e.triangles+=o*(s/3);break;case i.LINES:e.lines+=o*(s/2);break;case i.LINE_STRIP:e.lines+=o*(s-1);break;case i.LINE_LOOP:e.lines+=o*s;break;case i.POINTS:e.points+=o*s;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",a);break}}function r(){e.calls=0,e.triangles=0,e.points=0,e.lines=0}return{memory:t,render:e,programs:null,autoReset:!0,reset:r,update:n}}function Yg(i,t,e){const n=new WeakMap,r=new ae;function s(a,o,c){const l=a.morphTargetInfluences,h=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,u=h!==void 0?h.length:0;let d=n.get(o);if(d===void 0||d.count!==u){let x=function(){A.dispose(),n.delete(o),o.removeEventListener("dispose",x)};d!==void 0&&d.texture.dispose();const f=o.morphAttributes.position!==void 0,g=o.morphAttributes.normal!==void 0,v=o.morphAttributes.color!==void 0,m=o.morphAttributes.position||[],p=o.morphAttributes.normal||[],b=o.morphAttributes.color||[];let y=0;f===!0&&(y=1),g===!0&&(y=2),v===!0&&(y=3);let _=o.attributes.position.count*y,E=1;_>t.maxTextureSize&&(E=Math.ceil(_/t.maxTextureSize),_=t.maxTextureSize);const w=new Float32Array(_*E*4*u),A=new gl(w,_,E,u);A.type=ti,A.needsUpdate=!0;const R=y*4;for(let M=0;M<u;M++){const S=m[M],T=p[M],D=b[M],U=_*E*4*M;for(let N=0;N<S.count;N++){const z=N*R;f===!0&&(r.fromBufferAttribute(S,N),w[U+z+0]=r.x,w[U+z+1]=r.y,w[U+z+2]=r.z,w[U+z+3]=0),g===!0&&(r.fromBufferAttribute(T,N),w[U+z+4]=r.x,w[U+z+5]=r.y,w[U+z+6]=r.z,w[U+z+7]=0),v===!0&&(r.fromBufferAttribute(D,N),w[U+z+8]=r.x,w[U+z+9]=r.y,w[U+z+10]=r.z,w[U+z+11]=D.itemSize===4?r.w:1)}}d={count:u,texture:A,size:new bt(_,E)},n.set(o,d),o.addEventListener("dispose",x)}if(a.isInstancedMesh===!0&&a.morphTexture!==null)c.getUniforms().setValue(i,"morphTexture",a.morphTexture,e);else{let f=0;for(let v=0;v<l.length;v++)f+=l[v];const g=o.morphTargetsRelative?1:1-f;c.getUniforms().setValue(i,"morphTargetBaseInfluence",g),c.getUniforms().setValue(i,"morphTargetInfluences",l)}c.getUniforms().setValue(i,"morphTargetsTexture",d.texture,e),c.getUniforms().setValue(i,"morphTargetsTextureSize",d.size)}return{update:s}}function $g(i,t,e,n){let r=new WeakMap;function s(c){const l=n.render.frame,h=c.geometry,u=t.get(c,h);if(r.get(u)!==l&&(t.update(u),r.set(u,l)),c.isInstancedMesh&&(c.hasEventListener("dispose",o)===!1&&c.addEventListener("dispose",o),r.get(c)!==l&&(e.update(c.instanceMatrix,i.ARRAY_BUFFER),c.instanceColor!==null&&e.update(c.instanceColor,i.ARRAY_BUFFER),r.set(c,l))),c.isSkinnedMesh){const d=c.skeleton;r.get(d)!==l&&(d.update(),r.set(d,l))}return u}function a(){r=new WeakMap}function o(c){const l=c.target;l.removeEventListener("dispose",o),e.remove(l.instanceMatrix),l.instanceColor!==null&&e.remove(l.instanceColor)}return{update:s,dispose:a}}const Df=new Ge,Hh=new Tf(1,1),If=new gl,Uf=new Q0,Nf=new yf,zh=[],Vh=[],Gh=new Float32Array(16),Wh=new Float32Array(9),Xh=new Float32Array(4);function xs(i,t,e){const n=i[0];if(n<=0||n>0)return i;const r=t*e;let s=zh[r];if(s===void 0&&(s=new Float32Array(r),zh[r]=s),t!==0){n.toArray(s,0);for(let a=1,o=0;a!==t;++a)o+=e,i[a].toArray(s,o)}return s}function Ne(i,t){if(i.length!==t.length)return!1;for(let e=0,n=i.length;e<n;e++)if(i[e]!==t[e])return!1;return!0}function Fe(i,t){for(let e=0,n=t.length;e<n;e++)i[e]=t[e]}function eo(i,t){let e=Vh[t];e===void 0&&(e=new Int32Array(t),Vh[t]=e);for(let n=0;n!==t;++n)e[n]=i.allocateTextureUnit();return e}function jg(i,t){const e=this.cache;e[0]!==t&&(i.uniform1f(this.addr,t),e[0]=t)}function Kg(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2f(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Ne(e,t))return;i.uniform2fv(this.addr,t),Fe(e,t)}}function Zg(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3f(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else if(t.r!==void 0)(e[0]!==t.r||e[1]!==t.g||e[2]!==t.b)&&(i.uniform3f(this.addr,t.r,t.g,t.b),e[0]=t.r,e[1]=t.g,e[2]=t.b);else{if(Ne(e,t))return;i.uniform3fv(this.addr,t),Fe(e,t)}}function Jg(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4f(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Ne(e,t))return;i.uniform4fv(this.addr,t),Fe(e,t)}}function Qg(i,t){const e=this.cache,n=t.elements;if(n===void 0){if(Ne(e,t))return;i.uniformMatrix2fv(this.addr,!1,t),Fe(e,t)}else{if(Ne(e,n))return;Xh.set(n),i.uniformMatrix2fv(this.addr,!1,Xh),Fe(e,n)}}function tv(i,t){const e=this.cache,n=t.elements;if(n===void 0){if(Ne(e,t))return;i.uniformMatrix3fv(this.addr,!1,t),Fe(e,t)}else{if(Ne(e,n))return;Wh.set(n),i.uniformMatrix3fv(this.addr,!1,Wh),Fe(e,n)}}function ev(i,t){const e=this.cache,n=t.elements;if(n===void 0){if(Ne(e,t))return;i.uniformMatrix4fv(this.addr,!1,t),Fe(e,t)}else{if(Ne(e,n))return;Gh.set(n),i.uniformMatrix4fv(this.addr,!1,Gh),Fe(e,n)}}function nv(i,t){const e=this.cache;e[0]!==t&&(i.uniform1i(this.addr,t),e[0]=t)}function iv(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2i(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Ne(e,t))return;i.uniform2iv(this.addr,t),Fe(e,t)}}function rv(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3i(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(Ne(e,t))return;i.uniform3iv(this.addr,t),Fe(e,t)}}function sv(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4i(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Ne(e,t))return;i.uniform4iv(this.addr,t),Fe(e,t)}}function av(i,t){const e=this.cache;e[0]!==t&&(i.uniform1ui(this.addr,t),e[0]=t)}function ov(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2ui(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Ne(e,t))return;i.uniform2uiv(this.addr,t),Fe(e,t)}}function cv(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3ui(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(Ne(e,t))return;i.uniform3uiv(this.addr,t),Fe(e,t)}}function lv(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4ui(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Ne(e,t))return;i.uniform4uiv(this.addr,t),Fe(e,t)}}function hv(i,t,e){const n=this.cache,r=e.allocateTextureUnit();n[0]!==r&&(i.uniform1i(this.addr,r),n[0]=r);let s;this.type===i.SAMPLER_2D_SHADOW?(Hh.compareFunction=pf,s=Hh):s=Df,e.setTexture2D(t||s,r)}function uv(i,t,e){const n=this.cache,r=e.allocateTextureUnit();n[0]!==r&&(i.uniform1i(this.addr,r),n[0]=r),e.setTexture3D(t||Uf,r)}function fv(i,t,e){const n=this.cache,r=e.allocateTextureUnit();n[0]!==r&&(i.uniform1i(this.addr,r),n[0]=r),e.setTextureCube(t||Nf,r)}function dv(i,t,e){const n=this.cache,r=e.allocateTextureUnit();n[0]!==r&&(i.uniform1i(this.addr,r),n[0]=r),e.setTexture2DArray(t||If,r)}function pv(i){switch(i){case 5126:return jg;case 35664:return Kg;case 35665:return Zg;case 35666:return Jg;case 35674:return Qg;case 35675:return tv;case 35676:return ev;case 5124:case 35670:return nv;case 35667:case 35671:return iv;case 35668:case 35672:return rv;case 35669:case 35673:return sv;case 5125:return av;case 36294:return ov;case 36295:return cv;case 36296:return lv;case 35678:case 36198:case 36298:case 36306:case 35682:return hv;case 35679:case 36299:case 36307:return uv;case 35680:case 36300:case 36308:case 36293:return fv;case 36289:case 36303:case 36311:case 36292:return dv}}function mv(i,t){i.uniform1fv(this.addr,t)}function gv(i,t){const e=xs(t,this.size,2);i.uniform2fv(this.addr,e)}function vv(i,t){const e=xs(t,this.size,3);i.uniform3fv(this.addr,e)}function xv(i,t){const e=xs(t,this.size,4);i.uniform4fv(this.addr,e)}function _v(i,t){const e=xs(t,this.size,4);i.uniformMatrix2fv(this.addr,!1,e)}function Mv(i,t){const e=xs(t,this.size,9);i.uniformMatrix3fv(this.addr,!1,e)}function bv(i,t){const e=xs(t,this.size,16);i.uniformMatrix4fv(this.addr,!1,e)}function yv(i,t){i.uniform1iv(this.addr,t)}function Sv(i,t){i.uniform2iv(this.addr,t)}function wv(i,t){i.uniform3iv(this.addr,t)}function Ev(i,t){i.uniform4iv(this.addr,t)}function Tv(i,t){i.uniform1uiv(this.addr,t)}function Av(i,t){i.uniform2uiv(this.addr,t)}function Rv(i,t){i.uniform3uiv(this.addr,t)}function Cv(i,t){i.uniform4uiv(this.addr,t)}function Lv(i,t,e){const n=this.cache,r=t.length,s=eo(e,r);Ne(n,s)||(i.uniform1iv(this.addr,s),Fe(n,s));for(let a=0;a!==r;++a)e.setTexture2D(t[a]||Df,s[a])}function Pv(i,t,e){const n=this.cache,r=t.length,s=eo(e,r);Ne(n,s)||(i.uniform1iv(this.addr,s),Fe(n,s));for(let a=0;a!==r;++a)e.setTexture3D(t[a]||Uf,s[a])}function Dv(i,t,e){const n=this.cache,r=t.length,s=eo(e,r);Ne(n,s)||(i.uniform1iv(this.addr,s),Fe(n,s));for(let a=0;a!==r;++a)e.setTextureCube(t[a]||Nf,s[a])}function Iv(i,t,e){const n=this.cache,r=t.length,s=eo(e,r);Ne(n,s)||(i.uniform1iv(this.addr,s),Fe(n,s));for(let a=0;a!==r;++a)e.setTexture2DArray(t[a]||If,s[a])}function Uv(i){switch(i){case 5126:return mv;case 35664:return gv;case 35665:return vv;case 35666:return xv;case 35674:return _v;case 35675:return Mv;case 35676:return bv;case 5124:case 35670:return yv;case 35667:case 35671:return Sv;case 35668:case 35672:return wv;case 35669:case 35673:return Ev;case 5125:return Tv;case 36294:return Av;case 36295:return Rv;case 36296:return Cv;case 35678:case 36198:case 36298:case 36306:case 35682:return Lv;case 35679:case 36299:case 36307:return Pv;case 35680:case 36300:case 36308:case 36293:return Dv;case 36289:case 36303:case 36311:case 36292:return Iv}}class Nv{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.setValue=pv(e.type)}}class Fv{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.size=e.size,this.setValue=Uv(e.type)}}class Ov{constructor(t){this.id=t,this.seq=[],this.map={}}setValue(t,e,n){const r=this.seq;for(let s=0,a=r.length;s!==a;++s){const o=r[s];o.setValue(t,e[o.id],n)}}}const Vo=/(\w+)(\])?(\[|\.)?/g;function qh(i,t){i.seq.push(t),i.map[t.id]=t}function Bv(i,t,e){const n=i.name,r=n.length;for(Vo.lastIndex=0;;){const s=Vo.exec(n),a=Vo.lastIndex;let o=s[1];const c=s[2]==="]",l=s[3];if(c&&(o=o|0),l===void 0||l==="["&&a+2===r){qh(e,l===void 0?new Nv(o,i,t):new Fv(o,i,t));break}else{let u=e.map[o];u===void 0&&(u=new Ov(o),qh(e,u)),e=u}}}class za{constructor(t,e){this.seq=[],this.map={};const n=t.getProgramParameter(e,t.ACTIVE_UNIFORMS);for(let r=0;r<n;++r){const s=t.getActiveUniform(e,r),a=t.getUniformLocation(e,s.name);Bv(s,a,this)}}setValue(t,e,n,r){const s=this.map[e];s!==void 0&&s.setValue(t,n,r)}setOptional(t,e,n){const r=e[n];r!==void 0&&this.setValue(t,n,r)}static upload(t,e,n,r){for(let s=0,a=e.length;s!==a;++s){const o=e[s],c=n[o.id];c.needsUpdate!==!1&&o.setValue(t,c.value,r)}}static seqWithValue(t,e){const n=[];for(let r=0,s=t.length;r!==s;++r){const a=t[r];a.id in e&&n.push(a)}return n}}function Yh(i,t,e){const n=i.createShader(t);return i.shaderSource(n,e),i.compileShader(n),n}const kv=37297;let Hv=0;function zv(i,t){const e=i.split(`
`),n=[],r=Math.max(t-6,0),s=Math.min(t+6,e.length);for(let a=r;a<s;a++){const o=a+1;n.push(`${o===t?">":" "} ${o}: ${e[a]}`)}return n.join(`
`)}const $h=new Jt;function Vv(i){se._getMatrix($h,se.workingColorSpace,i);const t=`mat3( ${$h.elements.map(e=>e.toFixed(4))} )`;switch(se.getTransfer(i)){case Xa:return[t,"LinearTransferOETF"];case he:return[t,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space: ",i),[t,"LinearTransferOETF"]}}function jh(i,t,e){const n=i.getShaderParameter(t,i.COMPILE_STATUS),s=(i.getShaderInfoLog(t)||"").trim();if(n&&s==="")return"";const a=/ERROR: 0:(\d+)/.exec(s);if(a){const o=parseInt(a[1]);return e.toUpperCase()+`

`+s+`

`+zv(i.getShaderSource(t),o)}else return s}function Gv(i,t){const e=Vv(t);return[`vec4 ${i}( vec4 value ) {`,`	return ${e[1]}( vec4( value.rgb * ${e[0]}, value.a ) );`,"}"].join(`
`)}function Wv(i,t){let e;switch(t){case u0:e="Linear";break;case f0:e="Reinhard";break;case d0:e="Cineon";break;case p0:e="ACESFilmic";break;case g0:e="AgX";break;case nf:e="Neutral";break;case m0:e="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",t),e="Linear"}return"vec3 "+i+"( vec3 color ) { return "+e+"ToneMapping( color ); }"}const Ea=new I;function Xv(){se.getLuminanceCoefficients(Ea);const i=Ea.x.toFixed(4),t=Ea.y.toFixed(4),e=Ea.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${i}, ${t}, ${e} );`,"	return dot( weights, rgb );","}"].join(`
`)}function qv(i){return[i.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",i.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(As).join(`
`)}function Yv(i){const t=[];for(const e in i){const n=i[e];n!==!1&&t.push("#define "+e+" "+n)}return t.join(`
`)}function $v(i,t){const e={},n=i.getProgramParameter(t,i.ACTIVE_ATTRIBUTES);for(let r=0;r<n;r++){const s=i.getActiveAttrib(t,r),a=s.name;let o=1;s.type===i.FLOAT_MAT2&&(o=2),s.type===i.FLOAT_MAT3&&(o=3),s.type===i.FLOAT_MAT4&&(o=4),e[a]={type:s.type,location:i.getAttribLocation(t,a),locationSize:o}}return e}function As(i){return i!==""}function Kh(i,t){const e=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return i.replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,e).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows)}function Zh(i,t){return i.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}const jv=/^[ \t]*#include +<([\w\d./]+)>/gm;function Yc(i){return i.replace(jv,Zv)}const Kv=new Map;function Zv(i,t){let e=Qt[t];if(e===void 0){const n=Kv.get(t);if(n!==void 0)e=Qt[n],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',t,n);else throw new Error("Can not resolve #include <"+t+">")}return Yc(e)}const Jv=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function Jh(i){return i.replace(Jv,Qv)}function Qv(i,t,e,n){let r="";for(let s=parseInt(t);s<parseInt(e);s++)r+=n.replace(/\[\s*i\s*\]/g,"[ "+s+" ]").replace(/UNROLLED_LOOP_INDEX/g,s);return r}function Qh(i){let t=`precision ${i.precision} float;
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
#define LOW_PRECISION`),t}function tx(i){let t="SHADOWMAP_TYPE_BASIC";return i.shadowMapType===Ku?t="SHADOWMAP_TYPE_PCF":i.shadowMapType===Zu?t="SHADOWMAP_TYPE_PCF_SOFT":i.shadowMapType===hi&&(t="SHADOWMAP_TYPE_VSM"),t}function ex(i){let t="ENVMAP_TYPE_CUBE";if(i.envMap)switch(i.envMapMode){case ss:case as:t="ENVMAP_TYPE_CUBE";break;case to:t="ENVMAP_TYPE_CUBE_UV";break}return t}function nx(i){let t="ENVMAP_MODE_REFLECTION";if(i.envMap)switch(i.envMapMode){case as:t="ENVMAP_MODE_REFRACTION";break}return t}function ix(i){let t="ENVMAP_BLENDING_NONE";if(i.envMap)switch(i.combine){case ef:t="ENVMAP_BLENDING_MULTIPLY";break;case l0:t="ENVMAP_BLENDING_MIX";break;case h0:t="ENVMAP_BLENDING_ADD";break}return t}function rx(i){const t=i.envMapCubeUVHeight;if(t===null)return null;const e=Math.log2(t)-2,n=1/t;return{texelWidth:1/(3*Math.max(Math.pow(2,e),112)),texelHeight:n,maxMip:e}}function sx(i,t,e,n){const r=i.getContext(),s=e.defines;let a=e.vertexShader,o=e.fragmentShader;const c=tx(e),l=ex(e),h=nx(e),u=ix(e),d=rx(e),f=qv(e),g=Yv(s),v=r.createProgram();let m,p,b=e.glslVersion?"#version "+e.glslVersion+`
`:"";e.isRawShaderMaterial?(m=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g].filter(As).join(`
`),m.length>0&&(m+=`
`),p=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g].filter(As).join(`
`),p.length>0&&(p+=`
`)):(m=[Qh(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g,e.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",e.batching?"#define USE_BATCHING":"",e.batchingColor?"#define USE_BATCHING_COLOR":"",e.instancing?"#define USE_INSTANCING":"",e.instancingColor?"#define USE_INSTANCING_COLOR":"",e.instancingMorph?"#define USE_INSTANCING_MORPH":"",e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.map?"#define USE_MAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+h:"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.displacementMap?"#define USE_DISPLACEMENTMAP":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.mapUv?"#define MAP_UV "+e.mapUv:"",e.alphaMapUv?"#define ALPHAMAP_UV "+e.alphaMapUv:"",e.lightMapUv?"#define LIGHTMAP_UV "+e.lightMapUv:"",e.aoMapUv?"#define AOMAP_UV "+e.aoMapUv:"",e.emissiveMapUv?"#define EMISSIVEMAP_UV "+e.emissiveMapUv:"",e.bumpMapUv?"#define BUMPMAP_UV "+e.bumpMapUv:"",e.normalMapUv?"#define NORMALMAP_UV "+e.normalMapUv:"",e.displacementMapUv?"#define DISPLACEMENTMAP_UV "+e.displacementMapUv:"",e.metalnessMapUv?"#define METALNESSMAP_UV "+e.metalnessMapUv:"",e.roughnessMapUv?"#define ROUGHNESSMAP_UV "+e.roughnessMapUv:"",e.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+e.anisotropyMapUv:"",e.clearcoatMapUv?"#define CLEARCOATMAP_UV "+e.clearcoatMapUv:"",e.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+e.clearcoatNormalMapUv:"",e.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+e.clearcoatRoughnessMapUv:"",e.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+e.iridescenceMapUv:"",e.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+e.iridescenceThicknessMapUv:"",e.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+e.sheenColorMapUv:"",e.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+e.sheenRoughnessMapUv:"",e.specularMapUv?"#define SPECULARMAP_UV "+e.specularMapUv:"",e.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+e.specularColorMapUv:"",e.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+e.specularIntensityMapUv:"",e.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+e.transmissionMapUv:"",e.thicknessMapUv?"#define THICKNESSMAP_UV "+e.thicknessMapUv:"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.flatShading?"#define FLAT_SHADED":"",e.skinning?"#define USE_SKINNING":"",e.morphTargets?"#define USE_MORPHTARGETS":"",e.morphNormals&&e.flatShading===!1?"#define USE_MORPHNORMALS":"",e.morphColors?"#define USE_MORPHCOLORS":"",e.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+e.morphTextureStride:"",e.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+e.morphTargetsCount:"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+c:"",e.sizeAttenuation?"#define USE_SIZEATTENUATION":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",e.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(As).join(`
`),p=[Qh(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g,e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",e.map?"#define USE_MAP":"",e.matcap?"#define USE_MATCAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+l:"",e.envMap?"#define "+h:"",e.envMap?"#define "+u:"",d?"#define CUBEUV_TEXEL_WIDTH "+d.texelWidth:"",d?"#define CUBEUV_TEXEL_HEIGHT "+d.texelHeight:"",d?"#define CUBEUV_MAX_MIP "+d.maxMip+".0":"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoat?"#define USE_CLEARCOAT":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.dispersion?"#define USE_DISPERSION":"",e.iridescence?"#define USE_IRIDESCENCE":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaTest?"#define USE_ALPHATEST":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.sheen?"#define USE_SHEEN":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors||e.instancingColor||e.batchingColor?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.gradientMap?"#define USE_GRADIENTMAP":"",e.flatShading?"#define FLAT_SHADED":"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+c:"",e.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",e.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",e.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",e.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",e.toneMapping!==Gi?"#define TONE_MAPPING":"",e.toneMapping!==Gi?Qt.tonemapping_pars_fragment:"",e.toneMapping!==Gi?Wv("toneMapping",e.toneMapping):"",e.dithering?"#define DITHERING":"",e.opaque?"#define OPAQUE":"",Qt.colorspace_pars_fragment,Gv("linearToOutputTexel",e.outputColorSpace),Xv(),e.useDepthPacking?"#define DEPTH_PACKING "+e.depthPacking:"",`
`].filter(As).join(`
`)),a=Yc(a),a=Kh(a,e),a=Zh(a,e),o=Yc(o),o=Kh(o,e),o=Zh(o,e),a=Jh(a),o=Jh(o),e.isRawShaderMaterial!==!0&&(b=`#version 300 es
`,m=[f,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+m,p=["#define varying in",e.glslVersion===nh?"":"layout(location = 0) out highp vec4 pc_fragColor;",e.glslVersion===nh?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+p);const y=b+m+a,_=b+p+o,E=Yh(r,r.VERTEX_SHADER,y),w=Yh(r,r.FRAGMENT_SHADER,_);r.attachShader(v,E),r.attachShader(v,w),e.index0AttributeName!==void 0?r.bindAttribLocation(v,0,e.index0AttributeName):e.morphTargets===!0&&r.bindAttribLocation(v,0,"position"),r.linkProgram(v);function A(S){if(i.debug.checkShaderErrors){const T=r.getProgramInfoLog(v)||"",D=r.getShaderInfoLog(E)||"",U=r.getShaderInfoLog(w)||"",N=T.trim(),z=D.trim(),$=U.trim();let V=!0,tt=!0;if(r.getProgramParameter(v,r.LINK_STATUS)===!1)if(V=!1,typeof i.debug.onShaderError=="function")i.debug.onShaderError(r,v,E,w);else{const rt=jh(r,E,"vertex"),lt=jh(r,w,"fragment");console.error("THREE.WebGLProgram: Shader Error "+r.getError()+" - VALIDATE_STATUS "+r.getProgramParameter(v,r.VALIDATE_STATUS)+`

Material Name: `+S.name+`
Material Type: `+S.type+`

Program Info Log: `+N+`
`+rt+`
`+lt)}else N!==""?console.warn("THREE.WebGLProgram: Program Info Log:",N):(z===""||$==="")&&(tt=!1);tt&&(S.diagnostics={runnable:V,programLog:N,vertexShader:{log:z,prefix:m},fragmentShader:{log:$,prefix:p}})}r.deleteShader(E),r.deleteShader(w),R=new za(r,v),x=$v(r,v)}let R;this.getUniforms=function(){return R===void 0&&A(this),R};let x;this.getAttributes=function(){return x===void 0&&A(this),x};let M=e.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return M===!1&&(M=r.getProgramParameter(v,kv)),M},this.destroy=function(){n.releaseStatesOfProgram(this),r.deleteProgram(v),this.program=void 0},this.type=e.shaderType,this.name=e.shaderName,this.id=Hv++,this.cacheKey=t,this.usedTimes=1,this.program=v,this.vertexShader=E,this.fragmentShader=w,this}let ax=0;class ox{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(t){const e=t.vertexShader,n=t.fragmentShader,r=this._getShaderStage(e),s=this._getShaderStage(n),a=this._getShaderCacheForMaterial(t);return a.has(r)===!1&&(a.add(r),r.usedTimes++),a.has(s)===!1&&(a.add(s),s.usedTimes++),this}remove(t){const e=this.materialCache.get(t);for(const n of e)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(t),this}getVertexShaderID(t){return this._getShaderStage(t.vertexShader).id}getFragmentShaderID(t){return this._getShaderStage(t.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(t){const e=this.materialCache;let n=e.get(t);return n===void 0&&(n=new Set,e.set(t,n)),n}_getShaderStage(t){const e=this.shaderCache;let n=e.get(t);return n===void 0&&(n=new cx(t),e.set(t,n)),n}}class cx{constructor(t){this.id=ax++,this.code=t,this.usedTimes=0}}function lx(i,t,e,n,r,s,a){const o=new gf,c=new ox,l=new Set,h=[],u=r.logarithmicDepthBuffer,d=r.vertexTextures;let f=r.precision;const g={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function v(x){return l.add(x),x===0?"uv":`uv${x}`}function m(x,M,S,T,D){const U=T.fog,N=D.geometry,z=x.isMeshStandardMaterial?T.environment:null,$=(x.isMeshStandardMaterial?e:t).get(x.envMap||z),V=$&&$.mapping===to?$.image.height:null,tt=g[x.type];x.precision!==null&&(f=r.getMaxPrecision(x.precision),f!==x.precision&&console.warn("THREE.WebGLProgram.getParameters:",x.precision,"not supported, using",f,"instead."));const rt=N.morphAttributes.position||N.morphAttributes.normal||N.morphAttributes.color,lt=rt!==void 0?rt.length:0;let xt=0;N.morphAttributes.position!==void 0&&(xt=1),N.morphAttributes.normal!==void 0&&(xt=2),N.morphAttributes.color!==void 0&&(xt=3);let Ct,Ot,nt,W;if(tt){const ce=Jn[tt];Ct=ce.vertexShader,Ot=ce.fragmentShader}else Ct=x.vertexShader,Ot=x.fragmentShader,c.update(x),nt=c.getVertexShaderID(x),W=c.getFragmentShaderID(x);const K=i.getRenderTarget(),F=i.state.buffers.depth.getReversed(),k=D.isInstancedMesh===!0,H=D.isBatchedMesh===!0,X=!!x.map,Z=!!x.matcap,P=!!$,ut=!!x.aoMap,at=!!x.lightMap,Mt=!!x.bumpMap,pt=!!x.normalMap,_t=!!x.displacementMap,yt=!!x.emissiveMap,Bt=!!x.metalnessMap,Ee=!!x.roughnessMap,ve=x.anisotropy>0,O=x.clearcoat>0,C=x.dispersion>0,j=x.iridescence>0,st=x.sheen>0,ht=x.transmission>0,it=ve&&!!x.anisotropyMap,Vt=O&&!!x.clearcoatMap,St=O&&!!x.clearcoatNormalMap,kt=O&&!!x.clearcoatRoughnessMap,Ht=j&&!!x.iridescenceMap,gt=j&&!!x.iridescenceThicknessMap,Rt=st&&!!x.sheenColorMap,qt=st&&!!x.sheenRoughnessMap,zt=!!x.specularMap,Tt=!!x.specularColorMap,Zt=!!x.specularIntensityMap,G=ht&&!!x.transmissionMap,vt=ht&&!!x.thicknessMap,wt=!!x.gradientMap,It=!!x.alphaMap,dt=x.alphaTest>0,ot=!!x.alphaHash,Ft=!!x.extensions;let jt=Gi;x.toneMapped&&(K===null||K.isXRRenderTarget===!0)&&(jt=i.toneMapping);const fe={shaderID:tt,shaderType:x.type,shaderName:x.name,vertexShader:Ct,fragmentShader:Ot,defines:x.defines,customVertexShaderID:nt,customFragmentShaderID:W,isRawShaderMaterial:x.isRawShaderMaterial===!0,glslVersion:x.glslVersion,precision:f,batching:H,batchingColor:H&&D._colorsTexture!==null,instancing:k,instancingColor:k&&D.instanceColor!==null,instancingMorph:k&&D.morphTexture!==null,supportsVertexTextures:d,outputColorSpace:K===null?i.outputColorSpace:K.isXRRenderTarget===!0?K.texture.colorSpace:mr,alphaToCoverage:!!x.alphaToCoverage,map:X,matcap:Z,envMap:P,envMapMode:P&&$.mapping,envMapCubeUVHeight:V,aoMap:ut,lightMap:at,bumpMap:Mt,normalMap:pt,displacementMap:d&&_t,emissiveMap:yt,normalMapObjectSpace:pt&&x.normalMapType===b0,normalMapTangentSpace:pt&&x.normalMapType===df,metalnessMap:Bt,roughnessMap:Ee,anisotropy:ve,anisotropyMap:it,clearcoat:O,clearcoatMap:Vt,clearcoatNormalMap:St,clearcoatRoughnessMap:kt,dispersion:C,iridescence:j,iridescenceMap:Ht,iridescenceThicknessMap:gt,sheen:st,sheenColorMap:Rt,sheenRoughnessMap:qt,specularMap:zt,specularColorMap:Tt,specularIntensityMap:Zt,transmission:ht,transmissionMap:G,thicknessMap:vt,gradientMap:wt,opaque:x.transparent===!1&&x.blending===Kr&&x.alphaToCoverage===!1,alphaMap:It,alphaTest:dt,alphaHash:ot,combine:x.combine,mapUv:X&&v(x.map.channel),aoMapUv:ut&&v(x.aoMap.channel),lightMapUv:at&&v(x.lightMap.channel),bumpMapUv:Mt&&v(x.bumpMap.channel),normalMapUv:pt&&v(x.normalMap.channel),displacementMapUv:_t&&v(x.displacementMap.channel),emissiveMapUv:yt&&v(x.emissiveMap.channel),metalnessMapUv:Bt&&v(x.metalnessMap.channel),roughnessMapUv:Ee&&v(x.roughnessMap.channel),anisotropyMapUv:it&&v(x.anisotropyMap.channel),clearcoatMapUv:Vt&&v(x.clearcoatMap.channel),clearcoatNormalMapUv:St&&v(x.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:kt&&v(x.clearcoatRoughnessMap.channel),iridescenceMapUv:Ht&&v(x.iridescenceMap.channel),iridescenceThicknessMapUv:gt&&v(x.iridescenceThicknessMap.channel),sheenColorMapUv:Rt&&v(x.sheenColorMap.channel),sheenRoughnessMapUv:qt&&v(x.sheenRoughnessMap.channel),specularMapUv:zt&&v(x.specularMap.channel),specularColorMapUv:Tt&&v(x.specularColorMap.channel),specularIntensityMapUv:Zt&&v(x.specularIntensityMap.channel),transmissionMapUv:G&&v(x.transmissionMap.channel),thicknessMapUv:vt&&v(x.thicknessMap.channel),alphaMapUv:It&&v(x.alphaMap.channel),vertexTangents:!!N.attributes.tangent&&(pt||ve),vertexColors:x.vertexColors,vertexAlphas:x.vertexColors===!0&&!!N.attributes.color&&N.attributes.color.itemSize===4,pointsUvs:D.isPoints===!0&&!!N.attributes.uv&&(X||It),fog:!!U,useFog:x.fog===!0,fogExp2:!!U&&U.isFogExp2,flatShading:x.flatShading===!0&&x.wireframe===!1,sizeAttenuation:x.sizeAttenuation===!0,logarithmicDepthBuffer:u,reversedDepthBuffer:F,skinning:D.isSkinnedMesh===!0,morphTargets:N.morphAttributes.position!==void 0,morphNormals:N.morphAttributes.normal!==void 0,morphColors:N.morphAttributes.color!==void 0,morphTargetsCount:lt,morphTextureStride:xt,numDirLights:M.directional.length,numPointLights:M.point.length,numSpotLights:M.spot.length,numSpotLightMaps:M.spotLightMap.length,numRectAreaLights:M.rectArea.length,numHemiLights:M.hemi.length,numDirLightShadows:M.directionalShadowMap.length,numPointLightShadows:M.pointShadowMap.length,numSpotLightShadows:M.spotShadowMap.length,numSpotLightShadowsWithMaps:M.numSpotLightShadowsWithMaps,numLightProbes:M.numLightProbes,numClippingPlanes:a.numPlanes,numClipIntersection:a.numIntersection,dithering:x.dithering,shadowMapEnabled:i.shadowMap.enabled&&S.length>0,shadowMapType:i.shadowMap.type,toneMapping:jt,decodeVideoTexture:X&&x.map.isVideoTexture===!0&&se.getTransfer(x.map.colorSpace)===he,decodeVideoTextureEmissive:yt&&x.emissiveMap.isVideoTexture===!0&&se.getTransfer(x.emissiveMap.colorSpace)===he,premultipliedAlpha:x.premultipliedAlpha,doubleSided:x.side===qe,flipSided:x.side===dn,useDepthPacking:x.depthPacking>=0,depthPacking:x.depthPacking||0,index0AttributeName:x.index0AttributeName,extensionClipCullDistance:Ft&&x.extensions.clipCullDistance===!0&&n.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(Ft&&x.extensions.multiDraw===!0||H)&&n.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:n.has("KHR_parallel_shader_compile"),customProgramCacheKey:x.customProgramCacheKey()};return fe.vertexUv1s=l.has(1),fe.vertexUv2s=l.has(2),fe.vertexUv3s=l.has(3),l.clear(),fe}function p(x){const M=[];if(x.shaderID?M.push(x.shaderID):(M.push(x.customVertexShaderID),M.push(x.customFragmentShaderID)),x.defines!==void 0)for(const S in x.defines)M.push(S),M.push(x.defines[S]);return x.isRawShaderMaterial===!1&&(b(M,x),y(M,x),M.push(i.outputColorSpace)),M.push(x.customProgramCacheKey),M.join()}function b(x,M){x.push(M.precision),x.push(M.outputColorSpace),x.push(M.envMapMode),x.push(M.envMapCubeUVHeight),x.push(M.mapUv),x.push(M.alphaMapUv),x.push(M.lightMapUv),x.push(M.aoMapUv),x.push(M.bumpMapUv),x.push(M.normalMapUv),x.push(M.displacementMapUv),x.push(M.emissiveMapUv),x.push(M.metalnessMapUv),x.push(M.roughnessMapUv),x.push(M.anisotropyMapUv),x.push(M.clearcoatMapUv),x.push(M.clearcoatNormalMapUv),x.push(M.clearcoatRoughnessMapUv),x.push(M.iridescenceMapUv),x.push(M.iridescenceThicknessMapUv),x.push(M.sheenColorMapUv),x.push(M.sheenRoughnessMapUv),x.push(M.specularMapUv),x.push(M.specularColorMapUv),x.push(M.specularIntensityMapUv),x.push(M.transmissionMapUv),x.push(M.thicknessMapUv),x.push(M.combine),x.push(M.fogExp2),x.push(M.sizeAttenuation),x.push(M.morphTargetsCount),x.push(M.morphAttributeCount),x.push(M.numDirLights),x.push(M.numPointLights),x.push(M.numSpotLights),x.push(M.numSpotLightMaps),x.push(M.numHemiLights),x.push(M.numRectAreaLights),x.push(M.numDirLightShadows),x.push(M.numPointLightShadows),x.push(M.numSpotLightShadows),x.push(M.numSpotLightShadowsWithMaps),x.push(M.numLightProbes),x.push(M.shadowMapType),x.push(M.toneMapping),x.push(M.numClippingPlanes),x.push(M.numClipIntersection),x.push(M.depthPacking)}function y(x,M){o.disableAll(),M.supportsVertexTextures&&o.enable(0),M.instancing&&o.enable(1),M.instancingColor&&o.enable(2),M.instancingMorph&&o.enable(3),M.matcap&&o.enable(4),M.envMap&&o.enable(5),M.normalMapObjectSpace&&o.enable(6),M.normalMapTangentSpace&&o.enable(7),M.clearcoat&&o.enable(8),M.iridescence&&o.enable(9),M.alphaTest&&o.enable(10),M.vertexColors&&o.enable(11),M.vertexAlphas&&o.enable(12),M.vertexUv1s&&o.enable(13),M.vertexUv2s&&o.enable(14),M.vertexUv3s&&o.enable(15),M.vertexTangents&&o.enable(16),M.anisotropy&&o.enable(17),M.alphaHash&&o.enable(18),M.batching&&o.enable(19),M.dispersion&&o.enable(20),M.batchingColor&&o.enable(21),M.gradientMap&&o.enable(22),x.push(o.mask),o.disableAll(),M.fog&&o.enable(0),M.useFog&&o.enable(1),M.flatShading&&o.enable(2),M.logarithmicDepthBuffer&&o.enable(3),M.reversedDepthBuffer&&o.enable(4),M.skinning&&o.enable(5),M.morphTargets&&o.enable(6),M.morphNormals&&o.enable(7),M.morphColors&&o.enable(8),M.premultipliedAlpha&&o.enable(9),M.shadowMapEnabled&&o.enable(10),M.doubleSided&&o.enable(11),M.flipSided&&o.enable(12),M.useDepthPacking&&o.enable(13),M.dithering&&o.enable(14),M.transmission&&o.enable(15),M.sheen&&o.enable(16),M.opaque&&o.enable(17),M.pointsUvs&&o.enable(18),M.decodeVideoTexture&&o.enable(19),M.decodeVideoTextureEmissive&&o.enable(20),M.alphaToCoverage&&o.enable(21),x.push(o.mask)}function _(x){const M=g[x.type];let S;if(M){const T=Jn[M];S=mp.clone(T.uniforms)}else S=x.uniforms;return S}function E(x,M){let S;for(let T=0,D=h.length;T<D;T++){const U=h[T];if(U.cacheKey===M){S=U,++S.usedTimes;break}}return S===void 0&&(S=new sx(i,M,x,s),h.push(S)),S}function w(x){if(--x.usedTimes===0){const M=h.indexOf(x);h[M]=h[h.length-1],h.pop(),x.destroy()}}function A(x){c.remove(x)}function R(){c.dispose()}return{getParameters:m,getProgramCacheKey:p,getUniforms:_,acquireProgram:E,releaseProgram:w,releaseShaderCache:A,programs:h,dispose:R}}function hx(){let i=new WeakMap;function t(a){return i.has(a)}function e(a){let o=i.get(a);return o===void 0&&(o={},i.set(a,o)),o}function n(a){i.delete(a)}function r(a,o,c){i.get(a)[o]=c}function s(){i=new WeakMap}return{has:t,get:e,remove:n,update:r,dispose:s}}function ux(i,t){return i.groupOrder!==t.groupOrder?i.groupOrder-t.groupOrder:i.renderOrder!==t.renderOrder?i.renderOrder-t.renderOrder:i.material.id!==t.material.id?i.material.id-t.material.id:i.z!==t.z?i.z-t.z:i.id-t.id}function tu(i,t){return i.groupOrder!==t.groupOrder?i.groupOrder-t.groupOrder:i.renderOrder!==t.renderOrder?i.renderOrder-t.renderOrder:i.z!==t.z?t.z-i.z:i.id-t.id}function eu(){const i=[];let t=0;const e=[],n=[],r=[];function s(){t=0,e.length=0,n.length=0,r.length=0}function a(u,d,f,g,v,m){let p=i[t];return p===void 0?(p={id:u.id,object:u,geometry:d,material:f,groupOrder:g,renderOrder:u.renderOrder,z:v,group:m},i[t]=p):(p.id=u.id,p.object=u,p.geometry=d,p.material=f,p.groupOrder=g,p.renderOrder=u.renderOrder,p.z=v,p.group=m),t++,p}function o(u,d,f,g,v,m){const p=a(u,d,f,g,v,m);f.transmission>0?n.push(p):f.transparent===!0?r.push(p):e.push(p)}function c(u,d,f,g,v,m){const p=a(u,d,f,g,v,m);f.transmission>0?n.unshift(p):f.transparent===!0?r.unshift(p):e.unshift(p)}function l(u,d){e.length>1&&e.sort(u||ux),n.length>1&&n.sort(d||tu),r.length>1&&r.sort(d||tu)}function h(){for(let u=t,d=i.length;u<d;u++){const f=i[u];if(f.id===null)break;f.id=null,f.object=null,f.geometry=null,f.material=null,f.group=null}}return{opaque:e,transmissive:n,transparent:r,init:s,push:o,unshift:c,finish:h,sort:l}}function fx(){let i=new WeakMap;function t(n,r){const s=i.get(n);let a;return s===void 0?(a=new eu,i.set(n,[a])):r>=s.length?(a=new eu,s.push(a)):a=s[r],a}function e(){i=new WeakMap}return{get:t,dispose:e}}function dx(){const i={};return{get:function(t){if(i[t.id]!==void 0)return i[t.id];let e;switch(t.type){case"DirectionalLight":e={direction:new I,color:new Ut};break;case"SpotLight":e={position:new I,direction:new I,color:new Ut,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":e={position:new I,color:new Ut,distance:0,decay:0};break;case"HemisphereLight":e={direction:new I,skyColor:new Ut,groundColor:new Ut};break;case"RectAreaLight":e={color:new Ut,position:new I,halfWidth:new I,halfHeight:new I};break}return i[t.id]=e,e}}}function px(){const i={};return{get:function(t){if(i[t.id]!==void 0)return i[t.id];let e;switch(t.type){case"DirectionalLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new bt};break;case"SpotLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new bt};break;case"PointLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new bt,shadowCameraNear:1,shadowCameraFar:1e3};break}return i[t.id]=e,e}}}let mx=0;function gx(i,t){return(t.castShadow?2:0)-(i.castShadow?2:0)+(t.map?1:0)-(i.map?1:0)}function vx(i){const t=new dx,e=px(),n={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let l=0;l<9;l++)n.probe.push(new I);const r=new I,s=new ne,a=new ne;function o(l){let h=0,u=0,d=0;for(let x=0;x<9;x++)n.probe[x].set(0,0,0);let f=0,g=0,v=0,m=0,p=0,b=0,y=0,_=0,E=0,w=0,A=0;l.sort(gx);for(let x=0,M=l.length;x<M;x++){const S=l[x],T=S.color,D=S.intensity,U=S.distance,N=S.shadow&&S.shadow.map?S.shadow.map.texture:null;if(S.isAmbientLight)h+=T.r*D,u+=T.g*D,d+=T.b*D;else if(S.isLightProbe){for(let z=0;z<9;z++)n.probe[z].addScaledVector(S.sh.coefficients[z],D);A++}else if(S.isDirectionalLight){const z=t.get(S);if(z.color.copy(S.color).multiplyScalar(S.intensity),S.castShadow){const $=S.shadow,V=e.get(S);V.shadowIntensity=$.intensity,V.shadowBias=$.bias,V.shadowNormalBias=$.normalBias,V.shadowRadius=$.radius,V.shadowMapSize=$.mapSize,n.directionalShadow[f]=V,n.directionalShadowMap[f]=N,n.directionalShadowMatrix[f]=S.shadow.matrix,b++}n.directional[f]=z,f++}else if(S.isSpotLight){const z=t.get(S);z.position.setFromMatrixPosition(S.matrixWorld),z.color.copy(T).multiplyScalar(D),z.distance=U,z.coneCos=Math.cos(S.angle),z.penumbraCos=Math.cos(S.angle*(1-S.penumbra)),z.decay=S.decay,n.spot[v]=z;const $=S.shadow;if(S.map&&(n.spotLightMap[E]=S.map,E++,$.updateMatrices(S),S.castShadow&&w++),n.spotLightMatrix[v]=$.matrix,S.castShadow){const V=e.get(S);V.shadowIntensity=$.intensity,V.shadowBias=$.bias,V.shadowNormalBias=$.normalBias,V.shadowRadius=$.radius,V.shadowMapSize=$.mapSize,n.spotShadow[v]=V,n.spotShadowMap[v]=N,_++}v++}else if(S.isRectAreaLight){const z=t.get(S);z.color.copy(T).multiplyScalar(D),z.halfWidth.set(S.width*.5,0,0),z.halfHeight.set(0,S.height*.5,0),n.rectArea[m]=z,m++}else if(S.isPointLight){const z=t.get(S);if(z.color.copy(S.color).multiplyScalar(S.intensity),z.distance=S.distance,z.decay=S.decay,S.castShadow){const $=S.shadow,V=e.get(S);V.shadowIntensity=$.intensity,V.shadowBias=$.bias,V.shadowNormalBias=$.normalBias,V.shadowRadius=$.radius,V.shadowMapSize=$.mapSize,V.shadowCameraNear=$.camera.near,V.shadowCameraFar=$.camera.far,n.pointShadow[g]=V,n.pointShadowMap[g]=N,n.pointShadowMatrix[g]=S.shadow.matrix,y++}n.point[g]=z,g++}else if(S.isHemisphereLight){const z=t.get(S);z.skyColor.copy(S.color).multiplyScalar(D),z.groundColor.copy(S.groundColor).multiplyScalar(D),n.hemi[p]=z,p++}}m>0&&(i.has("OES_texture_float_linear")===!0?(n.rectAreaLTC1=Et.LTC_FLOAT_1,n.rectAreaLTC2=Et.LTC_FLOAT_2):(n.rectAreaLTC1=Et.LTC_HALF_1,n.rectAreaLTC2=Et.LTC_HALF_2)),n.ambient[0]=h,n.ambient[1]=u,n.ambient[2]=d;const R=n.hash;(R.directionalLength!==f||R.pointLength!==g||R.spotLength!==v||R.rectAreaLength!==m||R.hemiLength!==p||R.numDirectionalShadows!==b||R.numPointShadows!==y||R.numSpotShadows!==_||R.numSpotMaps!==E||R.numLightProbes!==A)&&(n.directional.length=f,n.spot.length=v,n.rectArea.length=m,n.point.length=g,n.hemi.length=p,n.directionalShadow.length=b,n.directionalShadowMap.length=b,n.pointShadow.length=y,n.pointShadowMap.length=y,n.spotShadow.length=_,n.spotShadowMap.length=_,n.directionalShadowMatrix.length=b,n.pointShadowMatrix.length=y,n.spotLightMatrix.length=_+E-w,n.spotLightMap.length=E,n.numSpotLightShadowsWithMaps=w,n.numLightProbes=A,R.directionalLength=f,R.pointLength=g,R.spotLength=v,R.rectAreaLength=m,R.hemiLength=p,R.numDirectionalShadows=b,R.numPointShadows=y,R.numSpotShadows=_,R.numSpotMaps=E,R.numLightProbes=A,n.version=mx++)}function c(l,h){let u=0,d=0,f=0,g=0,v=0;const m=h.matrixWorldInverse;for(let p=0,b=l.length;p<b;p++){const y=l[p];if(y.isDirectionalLight){const _=n.directional[u];_.direction.setFromMatrixPosition(y.matrixWorld),r.setFromMatrixPosition(y.target.matrixWorld),_.direction.sub(r),_.direction.transformDirection(m),u++}else if(y.isSpotLight){const _=n.spot[f];_.position.setFromMatrixPosition(y.matrixWorld),_.position.applyMatrix4(m),_.direction.setFromMatrixPosition(y.matrixWorld),r.setFromMatrixPosition(y.target.matrixWorld),_.direction.sub(r),_.direction.transformDirection(m),f++}else if(y.isRectAreaLight){const _=n.rectArea[g];_.position.setFromMatrixPosition(y.matrixWorld),_.position.applyMatrix4(m),a.identity(),s.copy(y.matrixWorld),s.premultiply(m),a.extractRotation(s),_.halfWidth.set(y.width*.5,0,0),_.halfHeight.set(0,y.height*.5,0),_.halfWidth.applyMatrix4(a),_.halfHeight.applyMatrix4(a),g++}else if(y.isPointLight){const _=n.point[d];_.position.setFromMatrixPosition(y.matrixWorld),_.position.applyMatrix4(m),d++}else if(y.isHemisphereLight){const _=n.hemi[v];_.direction.setFromMatrixPosition(y.matrixWorld),_.direction.transformDirection(m),v++}}}return{setup:o,setupView:c,state:n}}function nu(i){const t=new vx(i),e=[],n=[];function r(h){l.camera=h,e.length=0,n.length=0}function s(h){e.push(h)}function a(h){n.push(h)}function o(){t.setup(e)}function c(h){t.setupView(e,h)}const l={lightsArray:e,shadowsArray:n,camera:null,lights:t,transmissionRenderTarget:{}};return{init:r,state:l,setupLights:o,setupLightsView:c,pushLight:s,pushShadow:a}}function xx(i){let t=new WeakMap;function e(r,s=0){const a=t.get(r);let o;return a===void 0?(o=new nu(i),t.set(r,[o])):s>=a.length?(o=new nu(i),a.push(o)):o=a[s],o}function n(){t=new WeakMap}return{get:e,dispose:n}}const _x=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,Mx=`uniform sampler2D shadow_pass;
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
}`;function bx(i,t,e){let n=new _l;const r=new bt,s=new bt,a=new ae,o=new Wp({depthPacking:M0}),c=new Xp,l={},h=e.maxTextureSize,u={[Xi]:dn,[dn]:Xi,[qe]:qe},d=new ke({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new bt},radius:{value:4}},vertexShader:_x,fragmentShader:Mx}),f=d.clone();f.defines.HORIZONTAL_PASS=1;const g=new Le;g.setAttribute("position",new ie(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const v=new Pt(g,d),m=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=Ku;let p=this.type;this.render=function(w,A,R){if(m.enabled===!1||m.autoUpdate===!1&&m.needsUpdate===!1||w.length===0)return;const x=i.getRenderTarget(),M=i.getActiveCubeFace(),S=i.getActiveMipmapLevel(),T=i.state;T.setBlending(Vi),T.buffers.depth.getReversed()===!0?T.buffers.color.setClear(0,0,0,0):T.buffers.color.setClear(1,1,1,1),T.buffers.depth.setTest(!0),T.setScissorTest(!1);const D=p!==hi&&this.type===hi,U=p===hi&&this.type!==hi;for(let N=0,z=w.length;N<z;N++){const $=w[N],V=$.shadow;if(V===void 0){console.warn("THREE.WebGLShadowMap:",$,"has no shadow.");continue}if(V.autoUpdate===!1&&V.needsUpdate===!1)continue;r.copy(V.mapSize);const tt=V.getFrameExtents();if(r.multiply(tt),s.copy(V.mapSize),(r.x>h||r.y>h)&&(r.x>h&&(s.x=Math.floor(h/tt.x),r.x=s.x*tt.x,V.mapSize.x=s.x),r.y>h&&(s.y=Math.floor(h/tt.y),r.y=s.y*tt.y,V.mapSize.y=s.y)),V.map===null||D===!0||U===!0){const lt=this.type!==hi?{minFilter:yn,magFilter:yn}:{};V.map!==null&&V.map.dispose(),V.map=new en(r.x,r.y,lt),V.map.texture.name=$.name+".shadowMap",V.camera.updateProjectionMatrix()}i.setRenderTarget(V.map),i.clear();const rt=V.getViewportCount();for(let lt=0;lt<rt;lt++){const xt=V.getViewport(lt);a.set(s.x*xt.x,s.y*xt.y,s.x*xt.z,s.y*xt.w),T.viewport(a),V.updateMatrices($,lt),n=V.getFrustum(),_(A,R,V.camera,$,this.type)}V.isPointLightShadow!==!0&&this.type===hi&&b(V,R),V.needsUpdate=!1}p=this.type,m.needsUpdate=!1,i.setRenderTarget(x,M,S)};function b(w,A){const R=t.update(v);d.defines.VSM_SAMPLES!==w.blurSamples&&(d.defines.VSM_SAMPLES=w.blurSamples,f.defines.VSM_SAMPLES=w.blurSamples,d.needsUpdate=!0,f.needsUpdate=!0),w.mapPass===null&&(w.mapPass=new en(r.x,r.y)),d.uniforms.shadow_pass.value=w.map.texture,d.uniforms.resolution.value=w.mapSize,d.uniforms.radius.value=w.radius,i.setRenderTarget(w.mapPass),i.clear(),i.renderBufferDirect(A,null,R,d,v,null),f.uniforms.shadow_pass.value=w.mapPass.texture,f.uniforms.resolution.value=w.mapSize,f.uniforms.radius.value=w.radius,i.setRenderTarget(w.map),i.clear(),i.renderBufferDirect(A,null,R,f,v,null)}function y(w,A,R,x){let M=null;const S=R.isPointLight===!0?w.customDistanceMaterial:w.customDepthMaterial;if(S!==void 0)M=S;else if(M=R.isPointLight===!0?c:o,i.localClippingEnabled&&A.clipShadows===!0&&Array.isArray(A.clippingPlanes)&&A.clippingPlanes.length!==0||A.displacementMap&&A.displacementScale!==0||A.alphaMap&&A.alphaTest>0||A.map&&A.alphaTest>0||A.alphaToCoverage===!0){const T=M.uuid,D=A.uuid;let U=l[T];U===void 0&&(U={},l[T]=U);let N=U[D];N===void 0&&(N=M.clone(),U[D]=N,A.addEventListener("dispose",E)),M=N}if(M.visible=A.visible,M.wireframe=A.wireframe,x===hi?M.side=A.shadowSide!==null?A.shadowSide:A.side:M.side=A.shadowSide!==null?A.shadowSide:u[A.side],M.alphaMap=A.alphaMap,M.alphaTest=A.alphaToCoverage===!0?.5:A.alphaTest,M.map=A.map,M.clipShadows=A.clipShadows,M.clippingPlanes=A.clippingPlanes,M.clipIntersection=A.clipIntersection,M.displacementMap=A.displacementMap,M.displacementScale=A.displacementScale,M.displacementBias=A.displacementBias,M.wireframeLinewidth=A.wireframeLinewidth,M.linewidth=A.linewidth,R.isPointLight===!0&&M.isMeshDistanceMaterial===!0){const T=i.properties.get(M);T.light=R}return M}function _(w,A,R,x,M){if(w.visible===!1)return;if(w.layers.test(A.layers)&&(w.isMesh||w.isLine||w.isPoints)&&(w.castShadow||w.receiveShadow&&M===hi)&&(!w.frustumCulled||n.intersectsObject(w))){w.modelViewMatrix.multiplyMatrices(R.matrixWorldInverse,w.matrixWorld);const D=t.update(w),U=w.material;if(Array.isArray(U)){const N=D.groups;for(let z=0,$=N.length;z<$;z++){const V=N[z],tt=U[V.materialIndex];if(tt&&tt.visible){const rt=y(w,tt,x,M);w.onBeforeShadow(i,w,A,R,D,rt,V),i.renderBufferDirect(R,null,D,rt,w,V),w.onAfterShadow(i,w,A,R,D,rt,V)}}}else if(U.visible){const N=y(w,U,x,M);w.onBeforeShadow(i,w,A,R,D,N,null),i.renderBufferDirect(R,null,D,N,w,null),w.onAfterShadow(i,w,A,R,D,N,null)}}const T=w.children;for(let D=0,U=T.length;D<U;D++)_(T[D],A,R,x,M)}function E(w){w.target.removeEventListener("dispose",E);for(const R in l){const x=l[R],M=w.target.uuid;M in x&&(x[M].dispose(),delete x[M])}}}const yx={[oc]:cc,[lc]:fc,[hc]:dc,[rs]:uc,[cc]:oc,[fc]:lc,[dc]:hc,[uc]:rs};function Sx(i,t){function e(){let G=!1;const vt=new ae;let wt=null;const It=new ae(0,0,0,0);return{setMask:function(dt){wt!==dt&&!G&&(i.colorMask(dt,dt,dt,dt),wt=dt)},setLocked:function(dt){G=dt},setClear:function(dt,ot,Ft,jt,fe){fe===!0&&(dt*=jt,ot*=jt,Ft*=jt),vt.set(dt,ot,Ft,jt),It.equals(vt)===!1&&(i.clearColor(dt,ot,Ft,jt),It.copy(vt))},reset:function(){G=!1,wt=null,It.set(-1,0,0,0)}}}function n(){let G=!1,vt=!1,wt=null,It=null,dt=null;return{setReversed:function(ot){if(vt!==ot){const Ft=t.get("EXT_clip_control");ot?Ft.clipControlEXT(Ft.LOWER_LEFT_EXT,Ft.ZERO_TO_ONE_EXT):Ft.clipControlEXT(Ft.LOWER_LEFT_EXT,Ft.NEGATIVE_ONE_TO_ONE_EXT),vt=ot;const jt=dt;dt=null,this.setClear(jt)}},getReversed:function(){return vt},setTest:function(ot){ot?K(i.DEPTH_TEST):F(i.DEPTH_TEST)},setMask:function(ot){wt!==ot&&!G&&(i.depthMask(ot),wt=ot)},setFunc:function(ot){if(vt&&(ot=yx[ot]),It!==ot){switch(ot){case oc:i.depthFunc(i.NEVER);break;case cc:i.depthFunc(i.ALWAYS);break;case lc:i.depthFunc(i.LESS);break;case rs:i.depthFunc(i.LEQUAL);break;case hc:i.depthFunc(i.EQUAL);break;case uc:i.depthFunc(i.GEQUAL);break;case fc:i.depthFunc(i.GREATER);break;case dc:i.depthFunc(i.NOTEQUAL);break;default:i.depthFunc(i.LEQUAL)}It=ot}},setLocked:function(ot){G=ot},setClear:function(ot){dt!==ot&&(vt&&(ot=1-ot),i.clearDepth(ot),dt=ot)},reset:function(){G=!1,wt=null,It=null,dt=null,vt=!1}}}function r(){let G=!1,vt=null,wt=null,It=null,dt=null,ot=null,Ft=null,jt=null,fe=null;return{setTest:function(ce){G||(ce?K(i.STENCIL_TEST):F(i.STENCIL_TEST))},setMask:function(ce){vt!==ce&&!G&&(i.stencilMask(ce),vt=ce)},setFunc:function(ce,ii,Wn){(wt!==ce||It!==ii||dt!==Wn)&&(i.stencilFunc(ce,ii,Wn),wt=ce,It=ii,dt=Wn)},setOp:function(ce,ii,Wn){(ot!==ce||Ft!==ii||jt!==Wn)&&(i.stencilOp(ce,ii,Wn),ot=ce,Ft=ii,jt=Wn)},setLocked:function(ce){G=ce},setClear:function(ce){fe!==ce&&(i.clearStencil(ce),fe=ce)},reset:function(){G=!1,vt=null,wt=null,It=null,dt=null,ot=null,Ft=null,jt=null,fe=null}}}const s=new e,a=new n,o=new r,c=new WeakMap,l=new WeakMap;let h={},u={},d=new WeakMap,f=[],g=null,v=!1,m=null,p=null,b=null,y=null,_=null,E=null,w=null,A=new Ut(0,0,0),R=0,x=!1,M=null,S=null,T=null,D=null,U=null;const N=i.getParameter(i.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let z=!1,$=0;const V=i.getParameter(i.VERSION);V.indexOf("WebGL")!==-1?($=parseFloat(/^WebGL (\d)/.exec(V)[1]),z=$>=1):V.indexOf("OpenGL ES")!==-1&&($=parseFloat(/^OpenGL ES (\d)/.exec(V)[1]),z=$>=2);let tt=null,rt={};const lt=i.getParameter(i.SCISSOR_BOX),xt=i.getParameter(i.VIEWPORT),Ct=new ae().fromArray(lt),Ot=new ae().fromArray(xt);function nt(G,vt,wt,It){const dt=new Uint8Array(4),ot=i.createTexture();i.bindTexture(G,ot),i.texParameteri(G,i.TEXTURE_MIN_FILTER,i.NEAREST),i.texParameteri(G,i.TEXTURE_MAG_FILTER,i.NEAREST);for(let Ft=0;Ft<wt;Ft++)G===i.TEXTURE_3D||G===i.TEXTURE_2D_ARRAY?i.texImage3D(vt,0,i.RGBA,1,1,It,0,i.RGBA,i.UNSIGNED_BYTE,dt):i.texImage2D(vt+Ft,0,i.RGBA,1,1,0,i.RGBA,i.UNSIGNED_BYTE,dt);return ot}const W={};W[i.TEXTURE_2D]=nt(i.TEXTURE_2D,i.TEXTURE_2D,1),W[i.TEXTURE_CUBE_MAP]=nt(i.TEXTURE_CUBE_MAP,i.TEXTURE_CUBE_MAP_POSITIVE_X,6),W[i.TEXTURE_2D_ARRAY]=nt(i.TEXTURE_2D_ARRAY,i.TEXTURE_2D_ARRAY,1,1),W[i.TEXTURE_3D]=nt(i.TEXTURE_3D,i.TEXTURE_3D,1,1),s.setClear(0,0,0,1),a.setClear(1),o.setClear(0),K(i.DEPTH_TEST),a.setFunc(rs),Mt(!1),pt(Kl),K(i.CULL_FACE),ut(Vi);function K(G){h[G]!==!0&&(i.enable(G),h[G]=!0)}function F(G){h[G]!==!1&&(i.disable(G),h[G]=!1)}function k(G,vt){return u[G]!==vt?(i.bindFramebuffer(G,vt),u[G]=vt,G===i.DRAW_FRAMEBUFFER&&(u[i.FRAMEBUFFER]=vt),G===i.FRAMEBUFFER&&(u[i.DRAW_FRAMEBUFFER]=vt),!0):!1}function H(G,vt){let wt=f,It=!1;if(G){wt=d.get(vt),wt===void 0&&(wt=[],d.set(vt,wt));const dt=G.textures;if(wt.length!==dt.length||wt[0]!==i.COLOR_ATTACHMENT0){for(let ot=0,Ft=dt.length;ot<Ft;ot++)wt[ot]=i.COLOR_ATTACHMENT0+ot;wt.length=dt.length,It=!0}}else wt[0]!==i.BACK&&(wt[0]=i.BACK,It=!0);It&&i.drawBuffers(wt)}function X(G){return g!==G?(i.useProgram(G),g=G,!0):!1}const Z={[ar]:i.FUNC_ADD,[$d]:i.FUNC_SUBTRACT,[jd]:i.FUNC_REVERSE_SUBTRACT};Z[Kd]=i.MIN,Z[Zd]=i.MAX;const P={[Qu]:i.ZERO,[Jd]:i.ONE,[tf]:i.SRC_COLOR,[sc]:i.SRC_ALPHA,[r0]:i.SRC_ALPHA_SATURATE,[n0]:i.DST_COLOR,[t0]:i.DST_ALPHA,[Qd]:i.ONE_MINUS_SRC_COLOR,[ac]:i.ONE_MINUS_SRC_ALPHA,[i0]:i.ONE_MINUS_DST_COLOR,[e0]:i.ONE_MINUS_DST_ALPHA,[s0]:i.CONSTANT_COLOR,[a0]:i.ONE_MINUS_CONSTANT_COLOR,[o0]:i.CONSTANT_ALPHA,[c0]:i.ONE_MINUS_CONSTANT_ALPHA};function ut(G,vt,wt,It,dt,ot,Ft,jt,fe,ce){if(G===Vi){v===!0&&(F(i.BLEND),v=!1);return}if(v===!1&&(K(i.BLEND),v=!0),G!==Ju){if(G!==m||ce!==x){if((p!==ar||_!==ar)&&(i.blendEquation(i.FUNC_ADD),p=ar,_=ar),ce)switch(G){case Kr:i.blendFuncSeparate(i.ONE,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case rc:i.blendFunc(i.ONE,i.ONE);break;case Zl:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case Jl:i.blendFuncSeparate(i.DST_COLOR,i.ONE_MINUS_SRC_ALPHA,i.ZERO,i.ONE);break;default:console.error("THREE.WebGLState: Invalid blending: ",G);break}else switch(G){case Kr:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case rc:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE,i.ONE,i.ONE);break;case Zl:console.error("THREE.WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case Jl:console.error("THREE.WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:console.error("THREE.WebGLState: Invalid blending: ",G);break}b=null,y=null,E=null,w=null,A.set(0,0,0),R=0,m=G,x=ce}return}dt=dt||vt,ot=ot||wt,Ft=Ft||It,(vt!==p||dt!==_)&&(i.blendEquationSeparate(Z[vt],Z[dt]),p=vt,_=dt),(wt!==b||It!==y||ot!==E||Ft!==w)&&(i.blendFuncSeparate(P[wt],P[It],P[ot],P[Ft]),b=wt,y=It,E=ot,w=Ft),(jt.equals(A)===!1||fe!==R)&&(i.blendColor(jt.r,jt.g,jt.b,fe),A.copy(jt),R=fe),m=G,x=!1}function at(G,vt){G.side===qe?F(i.CULL_FACE):K(i.CULL_FACE);let wt=G.side===dn;vt&&(wt=!wt),Mt(wt),G.blending===Kr&&G.transparent===!1?ut(Vi):ut(G.blending,G.blendEquation,G.blendSrc,G.blendDst,G.blendEquationAlpha,G.blendSrcAlpha,G.blendDstAlpha,G.blendColor,G.blendAlpha,G.premultipliedAlpha),a.setFunc(G.depthFunc),a.setTest(G.depthTest),a.setMask(G.depthWrite),s.setMask(G.colorWrite);const It=G.stencilWrite;o.setTest(It),It&&(o.setMask(G.stencilWriteMask),o.setFunc(G.stencilFunc,G.stencilRef,G.stencilFuncMask),o.setOp(G.stencilFail,G.stencilZFail,G.stencilZPass)),yt(G.polygonOffset,G.polygonOffsetFactor,G.polygonOffsetUnits),G.alphaToCoverage===!0?K(i.SAMPLE_ALPHA_TO_COVERAGE):F(i.SAMPLE_ALPHA_TO_COVERAGE)}function Mt(G){M!==G&&(G?i.frontFace(i.CW):i.frontFace(i.CCW),M=G)}function pt(G){G!==qd?(K(i.CULL_FACE),G!==S&&(G===Kl?i.cullFace(i.BACK):G===Yd?i.cullFace(i.FRONT):i.cullFace(i.FRONT_AND_BACK))):F(i.CULL_FACE),S=G}function _t(G){G!==T&&(z&&i.lineWidth(G),T=G)}function yt(G,vt,wt){G?(K(i.POLYGON_OFFSET_FILL),(D!==vt||U!==wt)&&(i.polygonOffset(vt,wt),D=vt,U=wt)):F(i.POLYGON_OFFSET_FILL)}function Bt(G){G?K(i.SCISSOR_TEST):F(i.SCISSOR_TEST)}function Ee(G){G===void 0&&(G=i.TEXTURE0+N-1),tt!==G&&(i.activeTexture(G),tt=G)}function ve(G,vt,wt){wt===void 0&&(tt===null?wt=i.TEXTURE0+N-1:wt=tt);let It=rt[wt];It===void 0&&(It={type:void 0,texture:void 0},rt[wt]=It),(It.type!==G||It.texture!==vt)&&(tt!==wt&&(i.activeTexture(wt),tt=wt),i.bindTexture(G,vt||W[G]),It.type=G,It.texture=vt)}function O(){const G=rt[tt];G!==void 0&&G.type!==void 0&&(i.bindTexture(G.type,null),G.type=void 0,G.texture=void 0)}function C(){try{i.compressedTexImage2D(...arguments)}catch(G){console.error("THREE.WebGLState:",G)}}function j(){try{i.compressedTexImage3D(...arguments)}catch(G){console.error("THREE.WebGLState:",G)}}function st(){try{i.texSubImage2D(...arguments)}catch(G){console.error("THREE.WebGLState:",G)}}function ht(){try{i.texSubImage3D(...arguments)}catch(G){console.error("THREE.WebGLState:",G)}}function it(){try{i.compressedTexSubImage2D(...arguments)}catch(G){console.error("THREE.WebGLState:",G)}}function Vt(){try{i.compressedTexSubImage3D(...arguments)}catch(G){console.error("THREE.WebGLState:",G)}}function St(){try{i.texStorage2D(...arguments)}catch(G){console.error("THREE.WebGLState:",G)}}function kt(){try{i.texStorage3D(...arguments)}catch(G){console.error("THREE.WebGLState:",G)}}function Ht(){try{i.texImage2D(...arguments)}catch(G){console.error("THREE.WebGLState:",G)}}function gt(){try{i.texImage3D(...arguments)}catch(G){console.error("THREE.WebGLState:",G)}}function Rt(G){Ct.equals(G)===!1&&(i.scissor(G.x,G.y,G.z,G.w),Ct.copy(G))}function qt(G){Ot.equals(G)===!1&&(i.viewport(G.x,G.y,G.z,G.w),Ot.copy(G))}function zt(G,vt){let wt=l.get(vt);wt===void 0&&(wt=new WeakMap,l.set(vt,wt));let It=wt.get(G);It===void 0&&(It=i.getUniformBlockIndex(vt,G.name),wt.set(G,It))}function Tt(G,vt){const It=l.get(vt).get(G);c.get(vt)!==It&&(i.uniformBlockBinding(vt,It,G.__bindingPointIndex),c.set(vt,It))}function Zt(){i.disable(i.BLEND),i.disable(i.CULL_FACE),i.disable(i.DEPTH_TEST),i.disable(i.POLYGON_OFFSET_FILL),i.disable(i.SCISSOR_TEST),i.disable(i.STENCIL_TEST),i.disable(i.SAMPLE_ALPHA_TO_COVERAGE),i.blendEquation(i.FUNC_ADD),i.blendFunc(i.ONE,i.ZERO),i.blendFuncSeparate(i.ONE,i.ZERO,i.ONE,i.ZERO),i.blendColor(0,0,0,0),i.colorMask(!0,!0,!0,!0),i.clearColor(0,0,0,0),i.depthMask(!0),i.depthFunc(i.LESS),a.setReversed(!1),i.clearDepth(1),i.stencilMask(4294967295),i.stencilFunc(i.ALWAYS,0,4294967295),i.stencilOp(i.KEEP,i.KEEP,i.KEEP),i.clearStencil(0),i.cullFace(i.BACK),i.frontFace(i.CCW),i.polygonOffset(0,0),i.activeTexture(i.TEXTURE0),i.bindFramebuffer(i.FRAMEBUFFER,null),i.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),i.bindFramebuffer(i.READ_FRAMEBUFFER,null),i.useProgram(null),i.lineWidth(1),i.scissor(0,0,i.canvas.width,i.canvas.height),i.viewport(0,0,i.canvas.width,i.canvas.height),h={},tt=null,rt={},u={},d=new WeakMap,f=[],g=null,v=!1,m=null,p=null,b=null,y=null,_=null,E=null,w=null,A=new Ut(0,0,0),R=0,x=!1,M=null,S=null,T=null,D=null,U=null,Ct.set(0,0,i.canvas.width,i.canvas.height),Ot.set(0,0,i.canvas.width,i.canvas.height),s.reset(),a.reset(),o.reset()}return{buffers:{color:s,depth:a,stencil:o},enable:K,disable:F,bindFramebuffer:k,drawBuffers:H,useProgram:X,setBlending:ut,setMaterial:at,setFlipSided:Mt,setCullFace:pt,setLineWidth:_t,setPolygonOffset:yt,setScissorTest:Bt,activeTexture:Ee,bindTexture:ve,unbindTexture:O,compressedTexImage2D:C,compressedTexImage3D:j,texImage2D:Ht,texImage3D:gt,updateUBOMapping:zt,uniformBlockBinding:Tt,texStorage2D:St,texStorage3D:kt,texSubImage2D:st,texSubImage3D:ht,compressedTexSubImage2D:it,compressedTexSubImage3D:Vt,scissor:Rt,viewport:qt,reset:Zt}}function wx(i,t,e,n,r,s,a){const o=t.has("WEBGL_multisampled_render_to_texture")?t.get("WEBGL_multisampled_render_to_texture"):null,c=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),l=new bt,h=new WeakMap;let u;const d=new WeakMap;let f=!1;try{f=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function g(O,C){return f?new OffscreenCanvas(O,C):Ya("canvas")}function v(O,C,j){let st=1;const ht=ve(O);if((ht.width>j||ht.height>j)&&(st=j/Math.max(ht.width,ht.height)),st<1)if(typeof HTMLImageElement<"u"&&O instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&O instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&O instanceof ImageBitmap||typeof VideoFrame<"u"&&O instanceof VideoFrame){const it=Math.floor(st*ht.width),Vt=Math.floor(st*ht.height);u===void 0&&(u=g(it,Vt));const St=C?g(it,Vt):u;return St.width=it,St.height=Vt,St.getContext("2d").drawImage(O,0,0,it,Vt),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+ht.width+"x"+ht.height+") to ("+it+"x"+Vt+")."),St}else return"data"in O&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+ht.width+"x"+ht.height+")."),O;return O}function m(O){return O.generateMipmaps}function p(O){i.generateMipmap(O)}function b(O){return O.isWebGLCubeRenderTarget?i.TEXTURE_CUBE_MAP:O.isWebGL3DRenderTarget?i.TEXTURE_3D:O.isWebGLArrayRenderTarget||O.isCompressedArrayTexture?i.TEXTURE_2D_ARRAY:i.TEXTURE_2D}function y(O,C,j,st,ht=!1){if(O!==null){if(i[O]!==void 0)return i[O];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+O+"'")}let it=C;if(C===i.RED&&(j===i.FLOAT&&(it=i.R32F),j===i.HALF_FLOAT&&(it=i.R16F),j===i.UNSIGNED_BYTE&&(it=i.R8)),C===i.RED_INTEGER&&(j===i.UNSIGNED_BYTE&&(it=i.R8UI),j===i.UNSIGNED_SHORT&&(it=i.R16UI),j===i.UNSIGNED_INT&&(it=i.R32UI),j===i.BYTE&&(it=i.R8I),j===i.SHORT&&(it=i.R16I),j===i.INT&&(it=i.R32I)),C===i.RG&&(j===i.FLOAT&&(it=i.RG32F),j===i.HALF_FLOAT&&(it=i.RG16F),j===i.UNSIGNED_BYTE&&(it=i.RG8)),C===i.RG_INTEGER&&(j===i.UNSIGNED_BYTE&&(it=i.RG8UI),j===i.UNSIGNED_SHORT&&(it=i.RG16UI),j===i.UNSIGNED_INT&&(it=i.RG32UI),j===i.BYTE&&(it=i.RG8I),j===i.SHORT&&(it=i.RG16I),j===i.INT&&(it=i.RG32I)),C===i.RGB_INTEGER&&(j===i.UNSIGNED_BYTE&&(it=i.RGB8UI),j===i.UNSIGNED_SHORT&&(it=i.RGB16UI),j===i.UNSIGNED_INT&&(it=i.RGB32UI),j===i.BYTE&&(it=i.RGB8I),j===i.SHORT&&(it=i.RGB16I),j===i.INT&&(it=i.RGB32I)),C===i.RGBA_INTEGER&&(j===i.UNSIGNED_BYTE&&(it=i.RGBA8UI),j===i.UNSIGNED_SHORT&&(it=i.RGBA16UI),j===i.UNSIGNED_INT&&(it=i.RGBA32UI),j===i.BYTE&&(it=i.RGBA8I),j===i.SHORT&&(it=i.RGBA16I),j===i.INT&&(it=i.RGBA32I)),C===i.RGB&&(j===i.UNSIGNED_INT_5_9_9_9_REV&&(it=i.RGB9_E5),j===i.UNSIGNED_INT_10F_11F_11F_REV&&(it=i.R11F_G11F_B10F)),C===i.RGBA){const Vt=ht?Xa:se.getTransfer(st);j===i.FLOAT&&(it=i.RGBA32F),j===i.HALF_FLOAT&&(it=i.RGBA16F),j===i.UNSIGNED_BYTE&&(it=Vt===he?i.SRGB8_ALPHA8:i.RGBA8),j===i.UNSIGNED_SHORT_4_4_4_4&&(it=i.RGBA4),j===i.UNSIGNED_SHORT_5_5_5_1&&(it=i.RGB5_A1)}return(it===i.R16F||it===i.R32F||it===i.RG16F||it===i.RG32F||it===i.RGBA16F||it===i.RGBA32F)&&t.get("EXT_color_buffer_float"),it}function _(O,C){let j;return O?C===null||C===pr||C===Us?j=i.DEPTH24_STENCIL8:C===ti?j=i.DEPTH32F_STENCIL8:C===Is&&(j=i.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):C===null||C===pr||C===Us?j=i.DEPTH_COMPONENT24:C===ti?j=i.DEPTH_COMPONENT32F:C===Is&&(j=i.DEPTH_COMPONENT16),j}function E(O,C){return m(O)===!0||O.isFramebufferTexture&&O.minFilter!==yn&&O.minFilter!==ge?Math.log2(Math.max(C.width,C.height))+1:O.mipmaps!==void 0&&O.mipmaps.length>0?O.mipmaps.length:O.isCompressedTexture&&Array.isArray(O.image)?C.mipmaps.length:1}function w(O){const C=O.target;C.removeEventListener("dispose",w),R(C),C.isVideoTexture&&h.delete(C)}function A(O){const C=O.target;C.removeEventListener("dispose",A),M(C)}function R(O){const C=n.get(O);if(C.__webglInit===void 0)return;const j=O.source,st=d.get(j);if(st){const ht=st[C.__cacheKey];ht.usedTimes--,ht.usedTimes===0&&x(O),Object.keys(st).length===0&&d.delete(j)}n.remove(O)}function x(O){const C=n.get(O);i.deleteTexture(C.__webglTexture);const j=O.source,st=d.get(j);delete st[C.__cacheKey],a.memory.textures--}function M(O){const C=n.get(O);if(O.depthTexture&&(O.depthTexture.dispose(),n.remove(O.depthTexture)),O.isWebGLCubeRenderTarget)for(let st=0;st<6;st++){if(Array.isArray(C.__webglFramebuffer[st]))for(let ht=0;ht<C.__webglFramebuffer[st].length;ht++)i.deleteFramebuffer(C.__webglFramebuffer[st][ht]);else i.deleteFramebuffer(C.__webglFramebuffer[st]);C.__webglDepthbuffer&&i.deleteRenderbuffer(C.__webglDepthbuffer[st])}else{if(Array.isArray(C.__webglFramebuffer))for(let st=0;st<C.__webglFramebuffer.length;st++)i.deleteFramebuffer(C.__webglFramebuffer[st]);else i.deleteFramebuffer(C.__webglFramebuffer);if(C.__webglDepthbuffer&&i.deleteRenderbuffer(C.__webglDepthbuffer),C.__webglMultisampledFramebuffer&&i.deleteFramebuffer(C.__webglMultisampledFramebuffer),C.__webglColorRenderbuffer)for(let st=0;st<C.__webglColorRenderbuffer.length;st++)C.__webglColorRenderbuffer[st]&&i.deleteRenderbuffer(C.__webglColorRenderbuffer[st]);C.__webglDepthRenderbuffer&&i.deleteRenderbuffer(C.__webglDepthRenderbuffer)}const j=O.textures;for(let st=0,ht=j.length;st<ht;st++){const it=n.get(j[st]);it.__webglTexture&&(i.deleteTexture(it.__webglTexture),a.memory.textures--),n.remove(j[st])}n.remove(O)}let S=0;function T(){S=0}function D(){const O=S;return O>=r.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+O+" texture units while this GPU supports only "+r.maxTextures),S+=1,O}function U(O){const C=[];return C.push(O.wrapS),C.push(O.wrapT),C.push(O.wrapR||0),C.push(O.magFilter),C.push(O.minFilter),C.push(O.anisotropy),C.push(O.internalFormat),C.push(O.format),C.push(O.type),C.push(O.generateMipmaps),C.push(O.premultiplyAlpha),C.push(O.flipY),C.push(O.unpackAlignment),C.push(O.colorSpace),C.join()}function N(O,C){const j=n.get(O);if(O.isVideoTexture&&Bt(O),O.isRenderTargetTexture===!1&&O.isExternalTexture!==!0&&O.version>0&&j.__version!==O.version){const st=O.image;if(st===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(st.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{W(j,O,C);return}}else O.isExternalTexture&&(j.__webglTexture=O.sourceTexture?O.sourceTexture:null);e.bindTexture(i.TEXTURE_2D,j.__webglTexture,i.TEXTURE0+C)}function z(O,C){const j=n.get(O);if(O.isRenderTargetTexture===!1&&O.version>0&&j.__version!==O.version){W(j,O,C);return}e.bindTexture(i.TEXTURE_2D_ARRAY,j.__webglTexture,i.TEXTURE0+C)}function $(O,C){const j=n.get(O);if(O.isRenderTargetTexture===!1&&O.version>0&&j.__version!==O.version){W(j,O,C);return}e.bindTexture(i.TEXTURE_3D,j.__webglTexture,i.TEXTURE0+C)}function V(O,C){const j=n.get(O);if(O.version>0&&j.__version!==O.version){K(j,O,C);return}e.bindTexture(i.TEXTURE_CUBE_MAP,j.__webglTexture,i.TEXTURE0+C)}const tt={[os]:i.REPEAT,[cr]:i.CLAMP_TO_EDGE,[mc]:i.MIRRORED_REPEAT},rt={[yn]:i.NEAREST,[x0]:i.NEAREST_MIPMAP_NEAREST,[Qs]:i.NEAREST_MIPMAP_LINEAR,[ge]:i.LINEAR,[oo]:i.LINEAR_MIPMAP_NEAREST,[Oi]:i.LINEAR_MIPMAP_LINEAR},lt={[y0]:i.NEVER,[R0]:i.ALWAYS,[S0]:i.LESS,[pf]:i.LEQUAL,[w0]:i.EQUAL,[A0]:i.GEQUAL,[E0]:i.GREATER,[T0]:i.NOTEQUAL};function xt(O,C){if(C.type===ti&&t.has("OES_texture_float_linear")===!1&&(C.magFilter===ge||C.magFilter===oo||C.magFilter===Qs||C.magFilter===Oi||C.minFilter===ge||C.minFilter===oo||C.minFilter===Qs||C.minFilter===Oi)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),i.texParameteri(O,i.TEXTURE_WRAP_S,tt[C.wrapS]),i.texParameteri(O,i.TEXTURE_WRAP_T,tt[C.wrapT]),(O===i.TEXTURE_3D||O===i.TEXTURE_2D_ARRAY)&&i.texParameteri(O,i.TEXTURE_WRAP_R,tt[C.wrapR]),i.texParameteri(O,i.TEXTURE_MAG_FILTER,rt[C.magFilter]),i.texParameteri(O,i.TEXTURE_MIN_FILTER,rt[C.minFilter]),C.compareFunction&&(i.texParameteri(O,i.TEXTURE_COMPARE_MODE,i.COMPARE_REF_TO_TEXTURE),i.texParameteri(O,i.TEXTURE_COMPARE_FUNC,lt[C.compareFunction])),t.has("EXT_texture_filter_anisotropic")===!0){if(C.magFilter===yn||C.minFilter!==Qs&&C.minFilter!==Oi||C.type===ti&&t.has("OES_texture_float_linear")===!1)return;if(C.anisotropy>1||n.get(C).__currentAnisotropy){const j=t.get("EXT_texture_filter_anisotropic");i.texParameterf(O,j.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(C.anisotropy,r.getMaxAnisotropy())),n.get(C).__currentAnisotropy=C.anisotropy}}}function Ct(O,C){let j=!1;O.__webglInit===void 0&&(O.__webglInit=!0,C.addEventListener("dispose",w));const st=C.source;let ht=d.get(st);ht===void 0&&(ht={},d.set(st,ht));const it=U(C);if(it!==O.__cacheKey){ht[it]===void 0&&(ht[it]={texture:i.createTexture(),usedTimes:0},a.memory.textures++,j=!0),ht[it].usedTimes++;const Vt=ht[O.__cacheKey];Vt!==void 0&&(ht[O.__cacheKey].usedTimes--,Vt.usedTimes===0&&x(C)),O.__cacheKey=it,O.__webglTexture=ht[it].texture}return j}function Ot(O,C,j){return Math.floor(Math.floor(O/j)/C)}function nt(O,C,j,st){const it=O.updateRanges;if(it.length===0)e.texSubImage2D(i.TEXTURE_2D,0,0,0,C.width,C.height,j,st,C.data);else{it.sort((gt,Rt)=>gt.start-Rt.start);let Vt=0;for(let gt=1;gt<it.length;gt++){const Rt=it[Vt],qt=it[gt],zt=Rt.start+Rt.count,Tt=Ot(qt.start,C.width,4),Zt=Ot(Rt.start,C.width,4);qt.start<=zt+1&&Tt===Zt&&Ot(qt.start+qt.count-1,C.width,4)===Tt?Rt.count=Math.max(Rt.count,qt.start+qt.count-Rt.start):(++Vt,it[Vt]=qt)}it.length=Vt+1;const St=i.getParameter(i.UNPACK_ROW_LENGTH),kt=i.getParameter(i.UNPACK_SKIP_PIXELS),Ht=i.getParameter(i.UNPACK_SKIP_ROWS);i.pixelStorei(i.UNPACK_ROW_LENGTH,C.width);for(let gt=0,Rt=it.length;gt<Rt;gt++){const qt=it[gt],zt=Math.floor(qt.start/4),Tt=Math.ceil(qt.count/4),Zt=zt%C.width,G=Math.floor(zt/C.width),vt=Tt,wt=1;i.pixelStorei(i.UNPACK_SKIP_PIXELS,Zt),i.pixelStorei(i.UNPACK_SKIP_ROWS,G),e.texSubImage2D(i.TEXTURE_2D,0,Zt,G,vt,wt,j,st,C.data)}O.clearUpdateRanges(),i.pixelStorei(i.UNPACK_ROW_LENGTH,St),i.pixelStorei(i.UNPACK_SKIP_PIXELS,kt),i.pixelStorei(i.UNPACK_SKIP_ROWS,Ht)}}function W(O,C,j){let st=i.TEXTURE_2D;(C.isDataArrayTexture||C.isCompressedArrayTexture)&&(st=i.TEXTURE_2D_ARRAY),C.isData3DTexture&&(st=i.TEXTURE_3D);const ht=Ct(O,C),it=C.source;e.bindTexture(st,O.__webglTexture,i.TEXTURE0+j);const Vt=n.get(it);if(it.version!==Vt.__version||ht===!0){e.activeTexture(i.TEXTURE0+j);const St=se.getPrimaries(se.workingColorSpace),kt=C.colorSpace===Qn?null:se.getPrimaries(C.colorSpace),Ht=C.colorSpace===Qn||St===kt?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,C.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,C.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,C.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,Ht);let gt=v(C.image,!1,r.maxTextureSize);gt=Ee(C,gt);const Rt=s.convert(C.format,C.colorSpace),qt=s.convert(C.type);let zt=y(C.internalFormat,Rt,qt,C.colorSpace,C.isVideoTexture);xt(st,C);let Tt;const Zt=C.mipmaps,G=C.isVideoTexture!==!0,vt=Vt.__version===void 0||ht===!0,wt=it.dataReady,It=E(C,gt);if(C.isDepthTexture)zt=_(C.format===Fs,C.type),vt&&(G?e.texStorage2D(i.TEXTURE_2D,1,zt,gt.width,gt.height):e.texImage2D(i.TEXTURE_2D,0,zt,gt.width,gt.height,0,Rt,qt,null));else if(C.isDataTexture)if(Zt.length>0){G&&vt&&e.texStorage2D(i.TEXTURE_2D,It,zt,Zt[0].width,Zt[0].height);for(let dt=0,ot=Zt.length;dt<ot;dt++)Tt=Zt[dt],G?wt&&e.texSubImage2D(i.TEXTURE_2D,dt,0,0,Tt.width,Tt.height,Rt,qt,Tt.data):e.texImage2D(i.TEXTURE_2D,dt,zt,Tt.width,Tt.height,0,Rt,qt,Tt.data);C.generateMipmaps=!1}else G?(vt&&e.texStorage2D(i.TEXTURE_2D,It,zt,gt.width,gt.height),wt&&nt(C,gt,Rt,qt)):e.texImage2D(i.TEXTURE_2D,0,zt,gt.width,gt.height,0,Rt,qt,gt.data);else if(C.isCompressedTexture)if(C.isCompressedArrayTexture){G&&vt&&e.texStorage3D(i.TEXTURE_2D_ARRAY,It,zt,Zt[0].width,Zt[0].height,gt.depth);for(let dt=0,ot=Zt.length;dt<ot;dt++)if(Tt=Zt[dt],C.format!==Ve)if(Rt!==null)if(G){if(wt)if(C.layerUpdates.size>0){const Ft=Ih(Tt.width,Tt.height,C.format,C.type);for(const jt of C.layerUpdates){const fe=Tt.data.subarray(jt*Ft/Tt.data.BYTES_PER_ELEMENT,(jt+1)*Ft/Tt.data.BYTES_PER_ELEMENT);e.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,dt,0,0,jt,Tt.width,Tt.height,1,Rt,fe)}C.clearLayerUpdates()}else e.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,dt,0,0,0,Tt.width,Tt.height,gt.depth,Rt,Tt.data)}else e.compressedTexImage3D(i.TEXTURE_2D_ARRAY,dt,zt,Tt.width,Tt.height,gt.depth,0,Tt.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else G?wt&&e.texSubImage3D(i.TEXTURE_2D_ARRAY,dt,0,0,0,Tt.width,Tt.height,gt.depth,Rt,qt,Tt.data):e.texImage3D(i.TEXTURE_2D_ARRAY,dt,zt,Tt.width,Tt.height,gt.depth,0,Rt,qt,Tt.data)}else{G&&vt&&e.texStorage2D(i.TEXTURE_2D,It,zt,Zt[0].width,Zt[0].height);for(let dt=0,ot=Zt.length;dt<ot;dt++)Tt=Zt[dt],C.format!==Ve?Rt!==null?G?wt&&e.compressedTexSubImage2D(i.TEXTURE_2D,dt,0,0,Tt.width,Tt.height,Rt,Tt.data):e.compressedTexImage2D(i.TEXTURE_2D,dt,zt,Tt.width,Tt.height,0,Tt.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):G?wt&&e.texSubImage2D(i.TEXTURE_2D,dt,0,0,Tt.width,Tt.height,Rt,qt,Tt.data):e.texImage2D(i.TEXTURE_2D,dt,zt,Tt.width,Tt.height,0,Rt,qt,Tt.data)}else if(C.isDataArrayTexture)if(G){if(vt&&e.texStorage3D(i.TEXTURE_2D_ARRAY,It,zt,gt.width,gt.height,gt.depth),wt)if(C.layerUpdates.size>0){const dt=Ih(gt.width,gt.height,C.format,C.type);for(const ot of C.layerUpdates){const Ft=gt.data.subarray(ot*dt/gt.data.BYTES_PER_ELEMENT,(ot+1)*dt/gt.data.BYTES_PER_ELEMENT);e.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,ot,gt.width,gt.height,1,Rt,qt,Ft)}C.clearLayerUpdates()}else e.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,0,gt.width,gt.height,gt.depth,Rt,qt,gt.data)}else e.texImage3D(i.TEXTURE_2D_ARRAY,0,zt,gt.width,gt.height,gt.depth,0,Rt,qt,gt.data);else if(C.isData3DTexture)G?(vt&&e.texStorage3D(i.TEXTURE_3D,It,zt,gt.width,gt.height,gt.depth),wt&&e.texSubImage3D(i.TEXTURE_3D,0,0,0,0,gt.width,gt.height,gt.depth,Rt,qt,gt.data)):e.texImage3D(i.TEXTURE_3D,0,zt,gt.width,gt.height,gt.depth,0,Rt,qt,gt.data);else if(C.isFramebufferTexture){if(vt)if(G)e.texStorage2D(i.TEXTURE_2D,It,zt,gt.width,gt.height);else{let dt=gt.width,ot=gt.height;for(let Ft=0;Ft<It;Ft++)e.texImage2D(i.TEXTURE_2D,Ft,zt,dt,ot,0,Rt,qt,null),dt>>=1,ot>>=1}}else if(Zt.length>0){if(G&&vt){const dt=ve(Zt[0]);e.texStorage2D(i.TEXTURE_2D,It,zt,dt.width,dt.height)}for(let dt=0,ot=Zt.length;dt<ot;dt++)Tt=Zt[dt],G?wt&&e.texSubImage2D(i.TEXTURE_2D,dt,0,0,Rt,qt,Tt):e.texImage2D(i.TEXTURE_2D,dt,zt,Rt,qt,Tt);C.generateMipmaps=!1}else if(G){if(vt){const dt=ve(gt);e.texStorage2D(i.TEXTURE_2D,It,zt,dt.width,dt.height)}wt&&e.texSubImage2D(i.TEXTURE_2D,0,0,0,Rt,qt,gt)}else e.texImage2D(i.TEXTURE_2D,0,zt,Rt,qt,gt);m(C)&&p(st),Vt.__version=it.version,C.onUpdate&&C.onUpdate(C)}O.__version=C.version}function K(O,C,j){if(C.image.length!==6)return;const st=Ct(O,C),ht=C.source;e.bindTexture(i.TEXTURE_CUBE_MAP,O.__webglTexture,i.TEXTURE0+j);const it=n.get(ht);if(ht.version!==it.__version||st===!0){e.activeTexture(i.TEXTURE0+j);const Vt=se.getPrimaries(se.workingColorSpace),St=C.colorSpace===Qn?null:se.getPrimaries(C.colorSpace),kt=C.colorSpace===Qn||Vt===St?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,C.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,C.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,C.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,kt);const Ht=C.isCompressedTexture||C.image[0].isCompressedTexture,gt=C.image[0]&&C.image[0].isDataTexture,Rt=[];for(let ot=0;ot<6;ot++)!Ht&&!gt?Rt[ot]=v(C.image[ot],!0,r.maxCubemapSize):Rt[ot]=gt?C.image[ot].image:C.image[ot],Rt[ot]=Ee(C,Rt[ot]);const qt=Rt[0],zt=s.convert(C.format,C.colorSpace),Tt=s.convert(C.type),Zt=y(C.internalFormat,zt,Tt,C.colorSpace),G=C.isVideoTexture!==!0,vt=it.__version===void 0||st===!0,wt=ht.dataReady;let It=E(C,qt);xt(i.TEXTURE_CUBE_MAP,C);let dt;if(Ht){G&&vt&&e.texStorage2D(i.TEXTURE_CUBE_MAP,It,Zt,qt.width,qt.height);for(let ot=0;ot<6;ot++){dt=Rt[ot].mipmaps;for(let Ft=0;Ft<dt.length;Ft++){const jt=dt[Ft];C.format!==Ve?zt!==null?G?wt&&e.compressedTexSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ot,Ft,0,0,jt.width,jt.height,zt,jt.data):e.compressedTexImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ot,Ft,Zt,jt.width,jt.height,0,jt.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):G?wt&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ot,Ft,0,0,jt.width,jt.height,zt,Tt,jt.data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ot,Ft,Zt,jt.width,jt.height,0,zt,Tt,jt.data)}}}else{if(dt=C.mipmaps,G&&vt){dt.length>0&&It++;const ot=ve(Rt[0]);e.texStorage2D(i.TEXTURE_CUBE_MAP,It,Zt,ot.width,ot.height)}for(let ot=0;ot<6;ot++)if(gt){G?wt&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ot,0,0,0,Rt[ot].width,Rt[ot].height,zt,Tt,Rt[ot].data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ot,0,Zt,Rt[ot].width,Rt[ot].height,0,zt,Tt,Rt[ot].data);for(let Ft=0;Ft<dt.length;Ft++){const fe=dt[Ft].image[ot].image;G?wt&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ot,Ft+1,0,0,fe.width,fe.height,zt,Tt,fe.data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ot,Ft+1,Zt,fe.width,fe.height,0,zt,Tt,fe.data)}}else{G?wt&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ot,0,0,0,zt,Tt,Rt[ot]):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ot,0,Zt,zt,Tt,Rt[ot]);for(let Ft=0;Ft<dt.length;Ft++){const jt=dt[Ft];G?wt&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ot,Ft+1,0,0,zt,Tt,jt.image[ot]):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ot,Ft+1,Zt,zt,Tt,jt.image[ot])}}}m(C)&&p(i.TEXTURE_CUBE_MAP),it.__version=ht.version,C.onUpdate&&C.onUpdate(C)}O.__version=C.version}function F(O,C,j,st,ht,it){const Vt=s.convert(j.format,j.colorSpace),St=s.convert(j.type),kt=y(j.internalFormat,Vt,St,j.colorSpace),Ht=n.get(C),gt=n.get(j);if(gt.__renderTarget=C,!Ht.__hasExternalTextures){const Rt=Math.max(1,C.width>>it),qt=Math.max(1,C.height>>it);ht===i.TEXTURE_3D||ht===i.TEXTURE_2D_ARRAY?e.texImage3D(ht,it,kt,Rt,qt,C.depth,0,Vt,St,null):e.texImage2D(ht,it,kt,Rt,qt,0,Vt,St,null)}e.bindFramebuffer(i.FRAMEBUFFER,O),yt(C)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,st,ht,gt.__webglTexture,0,_t(C)):(ht===i.TEXTURE_2D||ht>=i.TEXTURE_CUBE_MAP_POSITIVE_X&&ht<=i.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&i.framebufferTexture2D(i.FRAMEBUFFER,st,ht,gt.__webglTexture,it),e.bindFramebuffer(i.FRAMEBUFFER,null)}function k(O,C,j){if(i.bindRenderbuffer(i.RENDERBUFFER,O),C.depthBuffer){const st=C.depthTexture,ht=st&&st.isDepthTexture?st.type:null,it=_(C.stencilBuffer,ht),Vt=C.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,St=_t(C);yt(C)?o.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,St,it,C.width,C.height):j?i.renderbufferStorageMultisample(i.RENDERBUFFER,St,it,C.width,C.height):i.renderbufferStorage(i.RENDERBUFFER,it,C.width,C.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,Vt,i.RENDERBUFFER,O)}else{const st=C.textures;for(let ht=0;ht<st.length;ht++){const it=st[ht],Vt=s.convert(it.format,it.colorSpace),St=s.convert(it.type),kt=y(it.internalFormat,Vt,St,it.colorSpace),Ht=_t(C);j&&yt(C)===!1?i.renderbufferStorageMultisample(i.RENDERBUFFER,Ht,kt,C.width,C.height):yt(C)?o.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,Ht,kt,C.width,C.height):i.renderbufferStorage(i.RENDERBUFFER,kt,C.width,C.height)}}i.bindRenderbuffer(i.RENDERBUFFER,null)}function H(O,C){if(C&&C.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(e.bindFramebuffer(i.FRAMEBUFFER,O),!(C.depthTexture&&C.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");const st=n.get(C.depthTexture);st.__renderTarget=C,(!st.__webglTexture||C.depthTexture.image.width!==C.width||C.depthTexture.image.height!==C.height)&&(C.depthTexture.image.width=C.width,C.depthTexture.image.height=C.height,C.depthTexture.needsUpdate=!0),N(C.depthTexture,0);const ht=st.__webglTexture,it=_t(C);if(C.depthTexture.format===Ns)yt(C)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,ht,0,it):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,ht,0);else if(C.depthTexture.format===Fs)yt(C)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,ht,0,it):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,ht,0);else throw new Error("Unknown depthTexture format")}function X(O){const C=n.get(O),j=O.isWebGLCubeRenderTarget===!0;if(C.__boundDepthTexture!==O.depthTexture){const st=O.depthTexture;if(C.__depthDisposeCallback&&C.__depthDisposeCallback(),st){const ht=()=>{delete C.__boundDepthTexture,delete C.__depthDisposeCallback,st.removeEventListener("dispose",ht)};st.addEventListener("dispose",ht),C.__depthDisposeCallback=ht}C.__boundDepthTexture=st}if(O.depthTexture&&!C.__autoAllocateDepthBuffer){if(j)throw new Error("target.depthTexture not supported in Cube render targets");const st=O.texture.mipmaps;st&&st.length>0?H(C.__webglFramebuffer[0],O):H(C.__webglFramebuffer,O)}else if(j){C.__webglDepthbuffer=[];for(let st=0;st<6;st++)if(e.bindFramebuffer(i.FRAMEBUFFER,C.__webglFramebuffer[st]),C.__webglDepthbuffer[st]===void 0)C.__webglDepthbuffer[st]=i.createRenderbuffer(),k(C.__webglDepthbuffer[st],O,!1);else{const ht=O.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,it=C.__webglDepthbuffer[st];i.bindRenderbuffer(i.RENDERBUFFER,it),i.framebufferRenderbuffer(i.FRAMEBUFFER,ht,i.RENDERBUFFER,it)}}else{const st=O.texture.mipmaps;if(st&&st.length>0?e.bindFramebuffer(i.FRAMEBUFFER,C.__webglFramebuffer[0]):e.bindFramebuffer(i.FRAMEBUFFER,C.__webglFramebuffer),C.__webglDepthbuffer===void 0)C.__webglDepthbuffer=i.createRenderbuffer(),k(C.__webglDepthbuffer,O,!1);else{const ht=O.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,it=C.__webglDepthbuffer;i.bindRenderbuffer(i.RENDERBUFFER,it),i.framebufferRenderbuffer(i.FRAMEBUFFER,ht,i.RENDERBUFFER,it)}}e.bindFramebuffer(i.FRAMEBUFFER,null)}function Z(O,C,j){const st=n.get(O);C!==void 0&&F(st.__webglFramebuffer,O,O.texture,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,0),j!==void 0&&X(O)}function P(O){const C=O.texture,j=n.get(O),st=n.get(C);O.addEventListener("dispose",A);const ht=O.textures,it=O.isWebGLCubeRenderTarget===!0,Vt=ht.length>1;if(Vt||(st.__webglTexture===void 0&&(st.__webglTexture=i.createTexture()),st.__version=C.version,a.memory.textures++),it){j.__webglFramebuffer=[];for(let St=0;St<6;St++)if(C.mipmaps&&C.mipmaps.length>0){j.__webglFramebuffer[St]=[];for(let kt=0;kt<C.mipmaps.length;kt++)j.__webglFramebuffer[St][kt]=i.createFramebuffer()}else j.__webglFramebuffer[St]=i.createFramebuffer()}else{if(C.mipmaps&&C.mipmaps.length>0){j.__webglFramebuffer=[];for(let St=0;St<C.mipmaps.length;St++)j.__webglFramebuffer[St]=i.createFramebuffer()}else j.__webglFramebuffer=i.createFramebuffer();if(Vt)for(let St=0,kt=ht.length;St<kt;St++){const Ht=n.get(ht[St]);Ht.__webglTexture===void 0&&(Ht.__webglTexture=i.createTexture(),a.memory.textures++)}if(O.samples>0&&yt(O)===!1){j.__webglMultisampledFramebuffer=i.createFramebuffer(),j.__webglColorRenderbuffer=[],e.bindFramebuffer(i.FRAMEBUFFER,j.__webglMultisampledFramebuffer);for(let St=0;St<ht.length;St++){const kt=ht[St];j.__webglColorRenderbuffer[St]=i.createRenderbuffer(),i.bindRenderbuffer(i.RENDERBUFFER,j.__webglColorRenderbuffer[St]);const Ht=s.convert(kt.format,kt.colorSpace),gt=s.convert(kt.type),Rt=y(kt.internalFormat,Ht,gt,kt.colorSpace,O.isXRRenderTarget===!0),qt=_t(O);i.renderbufferStorageMultisample(i.RENDERBUFFER,qt,Rt,O.width,O.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+St,i.RENDERBUFFER,j.__webglColorRenderbuffer[St])}i.bindRenderbuffer(i.RENDERBUFFER,null),O.depthBuffer&&(j.__webglDepthRenderbuffer=i.createRenderbuffer(),k(j.__webglDepthRenderbuffer,O,!0)),e.bindFramebuffer(i.FRAMEBUFFER,null)}}if(it){e.bindTexture(i.TEXTURE_CUBE_MAP,st.__webglTexture),xt(i.TEXTURE_CUBE_MAP,C);for(let St=0;St<6;St++)if(C.mipmaps&&C.mipmaps.length>0)for(let kt=0;kt<C.mipmaps.length;kt++)F(j.__webglFramebuffer[St][kt],O,C,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+St,kt);else F(j.__webglFramebuffer[St],O,C,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+St,0);m(C)&&p(i.TEXTURE_CUBE_MAP),e.unbindTexture()}else if(Vt){for(let St=0,kt=ht.length;St<kt;St++){const Ht=ht[St],gt=n.get(Ht);let Rt=i.TEXTURE_2D;(O.isWebGL3DRenderTarget||O.isWebGLArrayRenderTarget)&&(Rt=O.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),e.bindTexture(Rt,gt.__webglTexture),xt(Rt,Ht),F(j.__webglFramebuffer,O,Ht,i.COLOR_ATTACHMENT0+St,Rt,0),m(Ht)&&p(Rt)}e.unbindTexture()}else{let St=i.TEXTURE_2D;if((O.isWebGL3DRenderTarget||O.isWebGLArrayRenderTarget)&&(St=O.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),e.bindTexture(St,st.__webglTexture),xt(St,C),C.mipmaps&&C.mipmaps.length>0)for(let kt=0;kt<C.mipmaps.length;kt++)F(j.__webglFramebuffer[kt],O,C,i.COLOR_ATTACHMENT0,St,kt);else F(j.__webglFramebuffer,O,C,i.COLOR_ATTACHMENT0,St,0);m(C)&&p(St),e.unbindTexture()}O.depthBuffer&&X(O)}function ut(O){const C=O.textures;for(let j=0,st=C.length;j<st;j++){const ht=C[j];if(m(ht)){const it=b(O),Vt=n.get(ht).__webglTexture;e.bindTexture(it,Vt),p(it),e.unbindTexture()}}}const at=[],Mt=[];function pt(O){if(O.samples>0){if(yt(O)===!1){const C=O.textures,j=O.width,st=O.height;let ht=i.COLOR_BUFFER_BIT;const it=O.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,Vt=n.get(O),St=C.length>1;if(St)for(let Ht=0;Ht<C.length;Ht++)e.bindFramebuffer(i.FRAMEBUFFER,Vt.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+Ht,i.RENDERBUFFER,null),e.bindFramebuffer(i.FRAMEBUFFER,Vt.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+Ht,i.TEXTURE_2D,null,0);e.bindFramebuffer(i.READ_FRAMEBUFFER,Vt.__webglMultisampledFramebuffer);const kt=O.texture.mipmaps;kt&&kt.length>0?e.bindFramebuffer(i.DRAW_FRAMEBUFFER,Vt.__webglFramebuffer[0]):e.bindFramebuffer(i.DRAW_FRAMEBUFFER,Vt.__webglFramebuffer);for(let Ht=0;Ht<C.length;Ht++){if(O.resolveDepthBuffer&&(O.depthBuffer&&(ht|=i.DEPTH_BUFFER_BIT),O.stencilBuffer&&O.resolveStencilBuffer&&(ht|=i.STENCIL_BUFFER_BIT)),St){i.framebufferRenderbuffer(i.READ_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.RENDERBUFFER,Vt.__webglColorRenderbuffer[Ht]);const gt=n.get(C[Ht]).__webglTexture;i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,gt,0)}i.blitFramebuffer(0,0,j,st,0,0,j,st,ht,i.NEAREST),c===!0&&(at.length=0,Mt.length=0,at.push(i.COLOR_ATTACHMENT0+Ht),O.depthBuffer&&O.resolveDepthBuffer===!1&&(at.push(it),Mt.push(it),i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,Mt)),i.invalidateFramebuffer(i.READ_FRAMEBUFFER,at))}if(e.bindFramebuffer(i.READ_FRAMEBUFFER,null),e.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),St)for(let Ht=0;Ht<C.length;Ht++){e.bindFramebuffer(i.FRAMEBUFFER,Vt.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+Ht,i.RENDERBUFFER,Vt.__webglColorRenderbuffer[Ht]);const gt=n.get(C[Ht]).__webglTexture;e.bindFramebuffer(i.FRAMEBUFFER,Vt.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+Ht,i.TEXTURE_2D,gt,0)}e.bindFramebuffer(i.DRAW_FRAMEBUFFER,Vt.__webglMultisampledFramebuffer)}else if(O.depthBuffer&&O.resolveDepthBuffer===!1&&c){const C=O.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,[C])}}}function _t(O){return Math.min(r.maxSamples,O.samples)}function yt(O){const C=n.get(O);return O.samples>0&&t.has("WEBGL_multisampled_render_to_texture")===!0&&C.__useRenderToTexture!==!1}function Bt(O){const C=a.render.frame;h.get(O)!==C&&(h.set(O,C),O.update())}function Ee(O,C){const j=O.colorSpace,st=O.format,ht=O.type;return O.isCompressedTexture===!0||O.isVideoTexture===!0||j!==mr&&j!==Qn&&(se.getTransfer(j)===he?(st!==Ve||ht!==Gn)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",j)),C}function ve(O){return typeof HTMLImageElement<"u"&&O instanceof HTMLImageElement?(l.width=O.naturalWidth||O.width,l.height=O.naturalHeight||O.height):typeof VideoFrame<"u"&&O instanceof VideoFrame?(l.width=O.displayWidth,l.height=O.displayHeight):(l.width=O.width,l.height=O.height),l}this.allocateTextureUnit=D,this.resetTextureUnits=T,this.setTexture2D=N,this.setTexture2DArray=z,this.setTexture3D=$,this.setTextureCube=V,this.rebindTextures=Z,this.setupRenderTarget=P,this.updateRenderTargetMipmap=ut,this.updateMultisampleRenderTarget=pt,this.setupDepthRenderbuffer=X,this.setupFrameBufferTexture=F,this.useMultisampledRTT=yt}function Ex(i,t){function e(n,r=Qn){let s;const a=se.getTransfer(r);if(n===Gn)return i.UNSIGNED_BYTE;if(n===ll)return i.UNSIGNED_SHORT_4_4_4_4;if(n===hl)return i.UNSIGNED_SHORT_5_5_5_1;if(n===of)return i.UNSIGNED_INT_5_9_9_9_REV;if(n===cf)return i.UNSIGNED_INT_10F_11F_11F_REV;if(n===sf)return i.BYTE;if(n===af)return i.SHORT;if(n===Is)return i.UNSIGNED_SHORT;if(n===cl)return i.INT;if(n===pr)return i.UNSIGNED_INT;if(n===ti)return i.FLOAT;if(n===xr)return i.HALF_FLOAT;if(n===lf)return i.ALPHA;if(n===hf)return i.RGB;if(n===Ve)return i.RGBA;if(n===Ns)return i.DEPTH_COMPONENT;if(n===Fs)return i.DEPTH_STENCIL;if(n===uf)return i.RED;if(n===ul)return i.RED_INTEGER;if(n===ff)return i.RG;if(n===fl)return i.RG_INTEGER;if(n===dl)return i.RGBA_INTEGER;if(n===Oa||n===Ba||n===ka||n===Ha)if(a===he)if(s=t.get("WEBGL_compressed_texture_s3tc_srgb"),s!==null){if(n===Oa)return s.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===Ba)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===ka)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===Ha)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(s=t.get("WEBGL_compressed_texture_s3tc"),s!==null){if(n===Oa)return s.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===Ba)return s.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===ka)return s.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===Ha)return s.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(n===gc||n===vc||n===xc||n===_c)if(s=t.get("WEBGL_compressed_texture_pvrtc"),s!==null){if(n===gc)return s.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===vc)return s.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===xc)return s.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===_c)return s.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(n===Mc||n===bc||n===yc)if(s=t.get("WEBGL_compressed_texture_etc"),s!==null){if(n===Mc||n===bc)return a===he?s.COMPRESSED_SRGB8_ETC2:s.COMPRESSED_RGB8_ETC2;if(n===yc)return a===he?s.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:s.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(n===Sc||n===wc||n===Ec||n===Tc||n===Ac||n===Rc||n===Cc||n===Lc||n===Pc||n===Dc||n===Ic||n===Uc||n===Nc||n===Fc)if(s=t.get("WEBGL_compressed_texture_astc"),s!==null){if(n===Sc)return a===he?s.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:s.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===wc)return a===he?s.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:s.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===Ec)return a===he?s.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:s.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===Tc)return a===he?s.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:s.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===Ac)return a===he?s.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:s.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===Rc)return a===he?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:s.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===Cc)return a===he?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:s.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===Lc)return a===he?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:s.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===Pc)return a===he?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:s.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===Dc)return a===he?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:s.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===Ic)return a===he?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:s.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===Uc)return a===he?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:s.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===Nc)return a===he?s.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:s.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===Fc)return a===he?s.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:s.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(n===Oc||n===Bc||n===kc)if(s=t.get("EXT_texture_compression_bptc"),s!==null){if(n===Oc)return a===he?s.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:s.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===Bc)return s.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===kc)return s.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(n===Hc||n===zc||n===Vc||n===Gc)if(s=t.get("EXT_texture_compression_rgtc"),s!==null){if(n===Hc)return s.COMPRESSED_RED_RGTC1_EXT;if(n===zc)return s.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===Vc)return s.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===Gc)return s.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return n===Us?i.UNSIGNED_INT_24_8:i[n]!==void 0?i[n]:null}return{convert:e}}const Tx=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,Ax=`
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

}`;class Rx{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(t,e){if(this.texture===null){const n=new Af(t.texture);(t.depthNear!==e.depthNear||t.depthFar!==e.depthFar)&&(this.depthNear=t.depthNear,this.depthFar=t.depthFar),this.texture=n}}getMesh(t){if(this.texture!==null&&this.mesh===null){const e=t.cameras[0].viewport,n=new ke({vertexShader:Tx,fragmentShader:Ax,uniforms:{depthColor:{value:this.texture},depthWidth:{value:e.z},depthHeight:{value:e.w}}});this.mesh=new Pt(new Mi(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class Cx extends ds{constructor(t,e){super();const n=this;let r=null,s=1,a=null,o="local-floor",c=1,l=null,h=null,u=null,d=null,f=null,g=null;const v=typeof XRWebGLBinding<"u",m=new Rx,p={},b=e.getContextAttributes();let y=null,_=null;const E=[],w=[],A=new bt;let R=null;const x=new Mn;x.viewport=new ae;const M=new Mn;M.viewport=new ae;const S=[x,M],T=new Kp;let D=null,U=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(W){let K=E[W];return K===void 0&&(K=new Co,E[W]=K),K.getTargetRaySpace()},this.getControllerGrip=function(W){let K=E[W];return K===void 0&&(K=new Co,E[W]=K),K.getGripSpace()},this.getHand=function(W){let K=E[W];return K===void 0&&(K=new Co,E[W]=K),K.getHandSpace()};function N(W){const K=w.indexOf(W.inputSource);if(K===-1)return;const F=E[K];F!==void 0&&(F.update(W.inputSource,W.frame,l||a),F.dispatchEvent({type:W.type,data:W.inputSource}))}function z(){r.removeEventListener("select",N),r.removeEventListener("selectstart",N),r.removeEventListener("selectend",N),r.removeEventListener("squeeze",N),r.removeEventListener("squeezestart",N),r.removeEventListener("squeezeend",N),r.removeEventListener("end",z),r.removeEventListener("inputsourceschange",$);for(let W=0;W<E.length;W++){const K=w[W];K!==null&&(w[W]=null,E[W].disconnect(K))}D=null,U=null,m.reset();for(const W in p)delete p[W];t.setRenderTarget(y),f=null,d=null,u=null,r=null,_=null,nt.stop(),n.isPresenting=!1,t.setPixelRatio(R),t.setSize(A.width,A.height,!1),n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(W){s=W,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(W){o=W,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return l||a},this.setReferenceSpace=function(W){l=W},this.getBaseLayer=function(){return d!==null?d:f},this.getBinding=function(){return u===null&&v&&(u=new XRWebGLBinding(r,e)),u},this.getFrame=function(){return g},this.getSession=function(){return r},this.setSession=async function(W){if(r=W,r!==null){if(y=t.getRenderTarget(),r.addEventListener("select",N),r.addEventListener("selectstart",N),r.addEventListener("selectend",N),r.addEventListener("squeeze",N),r.addEventListener("squeezestart",N),r.addEventListener("squeezeend",N),r.addEventListener("end",z),r.addEventListener("inputsourceschange",$),b.xrCompatible!==!0&&await e.makeXRCompatible(),R=t.getPixelRatio(),t.getSize(A),v&&"createProjectionLayer"in XRWebGLBinding.prototype){let F=null,k=null,H=null;b.depth&&(H=b.stencil?e.DEPTH24_STENCIL8:e.DEPTH_COMPONENT24,F=b.stencil?Fs:Ns,k=b.stencil?Us:pr);const X={colorFormat:e.RGBA8,depthFormat:H,scaleFactor:s};u=this.getBinding(),d=u.createProjectionLayer(X),r.updateRenderState({layers:[d]}),t.setPixelRatio(1),t.setSize(d.textureWidth,d.textureHeight,!1),_=new en(d.textureWidth,d.textureHeight,{format:Ve,type:Gn,depthTexture:new Tf(d.textureWidth,d.textureHeight,k,void 0,void 0,void 0,void 0,void 0,void 0,F),stencilBuffer:b.stencil,colorSpace:t.outputColorSpace,samples:b.antialias?4:0,resolveDepthBuffer:d.ignoreDepthValues===!1,resolveStencilBuffer:d.ignoreDepthValues===!1})}else{const F={antialias:b.antialias,alpha:!0,depth:b.depth,stencil:b.stencil,framebufferScaleFactor:s};f=new XRWebGLLayer(r,e,F),r.updateRenderState({baseLayer:f}),t.setPixelRatio(1),t.setSize(f.framebufferWidth,f.framebufferHeight,!1),_=new en(f.framebufferWidth,f.framebufferHeight,{format:Ve,type:Gn,colorSpace:t.outputColorSpace,stencilBuffer:b.stencil,resolveDepthBuffer:f.ignoreDepthValues===!1,resolveStencilBuffer:f.ignoreDepthValues===!1})}_.isXRRenderTarget=!0,this.setFoveation(c),l=null,a=await r.requestReferenceSpace(o),nt.setContext(r),nt.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(r!==null)return r.environmentBlendMode},this.getDepthTexture=function(){return m.getDepthTexture()};function $(W){for(let K=0;K<W.removed.length;K++){const F=W.removed[K],k=w.indexOf(F);k>=0&&(w[k]=null,E[k].disconnect(F))}for(let K=0;K<W.added.length;K++){const F=W.added[K];let k=w.indexOf(F);if(k===-1){for(let X=0;X<E.length;X++)if(X>=w.length){w.push(F),k=X;break}else if(w[X]===null){w[X]=F,k=X;break}if(k===-1)break}const H=E[k];H&&H.connect(F)}}const V=new I,tt=new I;function rt(W,K,F){V.setFromMatrixPosition(K.matrixWorld),tt.setFromMatrixPosition(F.matrixWorld);const k=V.distanceTo(tt),H=K.projectionMatrix.elements,X=F.projectionMatrix.elements,Z=H[14]/(H[10]-1),P=H[14]/(H[10]+1),ut=(H[9]+1)/H[5],at=(H[9]-1)/H[5],Mt=(H[8]-1)/H[0],pt=(X[8]+1)/X[0],_t=Z*Mt,yt=Z*pt,Bt=k/(-Mt+pt),Ee=Bt*-Mt;if(K.matrixWorld.decompose(W.position,W.quaternion,W.scale),W.translateX(Ee),W.translateZ(Bt),W.matrixWorld.compose(W.position,W.quaternion,W.scale),W.matrixWorldInverse.copy(W.matrixWorld).invert(),H[10]===-1)W.projectionMatrix.copy(K.projectionMatrix),W.projectionMatrixInverse.copy(K.projectionMatrixInverse);else{const ve=Z+Bt,O=P+Bt,C=_t-Ee,j=yt+(k-Ee),st=ut*P/O*ve,ht=at*P/O*ve;W.projectionMatrix.makePerspective(C,j,st,ht,ve,O),W.projectionMatrixInverse.copy(W.projectionMatrix).invert()}}function lt(W,K){K===null?W.matrixWorld.copy(W.matrix):W.matrixWorld.multiplyMatrices(K.matrixWorld,W.matrix),W.matrixWorldInverse.copy(W.matrixWorld).invert()}this.updateCamera=function(W){if(r===null)return;let K=W.near,F=W.far;m.texture!==null&&(m.depthNear>0&&(K=m.depthNear),m.depthFar>0&&(F=m.depthFar)),T.near=M.near=x.near=K,T.far=M.far=x.far=F,(D!==T.near||U!==T.far)&&(r.updateRenderState({depthNear:T.near,depthFar:T.far}),D=T.near,U=T.far),T.layers.mask=W.layers.mask|6,x.layers.mask=T.layers.mask&3,M.layers.mask=T.layers.mask&5;const k=W.parent,H=T.cameras;lt(T,k);for(let X=0;X<H.length;X++)lt(H[X],k);H.length===2?rt(T,x,M):T.projectionMatrix.copy(x.projectionMatrix),xt(W,T,k)};function xt(W,K,F){F===null?W.matrix.copy(K.matrixWorld):(W.matrix.copy(F.matrixWorld),W.matrix.invert(),W.matrix.multiply(K.matrixWorld)),W.matrix.decompose(W.position,W.quaternion,W.scale),W.updateMatrixWorld(!0),W.projectionMatrix.copy(K.projectionMatrix),W.projectionMatrixInverse.copy(K.projectionMatrixInverse),W.isPerspectiveCamera&&(W.fov=cs*2*Math.atan(1/W.projectionMatrix.elements[5]),W.zoom=1)}this.getCamera=function(){return T},this.getFoveation=function(){if(!(d===null&&f===null))return c},this.setFoveation=function(W){c=W,d!==null&&(d.fixedFoveation=W),f!==null&&f.fixedFoveation!==void 0&&(f.fixedFoveation=W)},this.hasDepthSensing=function(){return m.texture!==null},this.getDepthSensingMesh=function(){return m.getMesh(T)},this.getCameraTexture=function(W){return p[W]};let Ct=null;function Ot(W,K){if(h=K.getViewerPose(l||a),g=K,h!==null){const F=h.views;f!==null&&(t.setRenderTargetFramebuffer(_,f.framebuffer),t.setRenderTarget(_));let k=!1;F.length!==T.cameras.length&&(T.cameras.length=0,k=!0);for(let P=0;P<F.length;P++){const ut=F[P];let at=null;if(f!==null)at=f.getViewport(ut);else{const pt=u.getViewSubImage(d,ut);at=pt.viewport,P===0&&(t.setRenderTargetTextures(_,pt.colorTexture,pt.depthStencilTexture),t.setRenderTarget(_))}let Mt=S[P];Mt===void 0&&(Mt=new Mn,Mt.layers.enable(P),Mt.viewport=new ae,S[P]=Mt),Mt.matrix.fromArray(ut.transform.matrix),Mt.matrix.decompose(Mt.position,Mt.quaternion,Mt.scale),Mt.projectionMatrix.fromArray(ut.projectionMatrix),Mt.projectionMatrixInverse.copy(Mt.projectionMatrix).invert(),Mt.viewport.set(at.x,at.y,at.width,at.height),P===0&&(T.matrix.copy(Mt.matrix),T.matrix.decompose(T.position,T.quaternion,T.scale)),k===!0&&T.cameras.push(Mt)}const H=r.enabledFeatures;if(H&&H.includes("depth-sensing")&&r.depthUsage=="gpu-optimized"&&v){u=n.getBinding();const P=u.getDepthInformation(F[0]);P&&P.isValid&&P.texture&&m.init(P,r.renderState)}if(H&&H.includes("camera-access")&&v){t.state.unbindTexture(),u=n.getBinding();for(let P=0;P<F.length;P++){const ut=F[P].camera;if(ut){let at=p[ut];at||(at=new Af,p[ut]=at);const Mt=u.getCameraImage(ut);at.sourceTexture=Mt}}}}for(let F=0;F<E.length;F++){const k=w[F],H=E[F];k!==null&&H!==void 0&&H.update(k,K,l||a)}Ct&&Ct(W,K),K.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:K}),g=null}const nt=new Pf;nt.setAnimationLoop(Ot),this.setAnimationLoop=function(W){Ct=W},this.dispose=function(){}}}const nr=new In,Lx=new ne;function Px(i,t){function e(m,p){m.matrixAutoUpdate===!0&&m.updateMatrix(),p.value.copy(m.matrix)}function n(m,p){p.color.getRGB(m.fogColor.value,Mf(i)),p.isFog?(m.fogNear.value=p.near,m.fogFar.value=p.far):p.isFogExp2&&(m.fogDensity.value=p.density)}function r(m,p,b,y,_){p.isMeshBasicMaterial||p.isMeshLambertMaterial?s(m,p):p.isMeshToonMaterial?(s(m,p),u(m,p)):p.isMeshPhongMaterial?(s(m,p),h(m,p)):p.isMeshStandardMaterial?(s(m,p),d(m,p),p.isMeshPhysicalMaterial&&f(m,p,_)):p.isMeshMatcapMaterial?(s(m,p),g(m,p)):p.isMeshDepthMaterial?s(m,p):p.isMeshDistanceMaterial?(s(m,p),v(m,p)):p.isMeshNormalMaterial?s(m,p):p.isLineBasicMaterial?(a(m,p),p.isLineDashedMaterial&&o(m,p)):p.isPointsMaterial?c(m,p,b,y):p.isSpriteMaterial?l(m,p):p.isShadowMaterial?(m.color.value.copy(p.color),m.opacity.value=p.opacity):p.isShaderMaterial&&(p.uniformsNeedUpdate=!1)}function s(m,p){m.opacity.value=p.opacity,p.color&&m.diffuse.value.copy(p.color),p.emissive&&m.emissive.value.copy(p.emissive).multiplyScalar(p.emissiveIntensity),p.map&&(m.map.value=p.map,e(p.map,m.mapTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,e(p.alphaMap,m.alphaMapTransform)),p.bumpMap&&(m.bumpMap.value=p.bumpMap,e(p.bumpMap,m.bumpMapTransform),m.bumpScale.value=p.bumpScale,p.side===dn&&(m.bumpScale.value*=-1)),p.normalMap&&(m.normalMap.value=p.normalMap,e(p.normalMap,m.normalMapTransform),m.normalScale.value.copy(p.normalScale),p.side===dn&&m.normalScale.value.negate()),p.displacementMap&&(m.displacementMap.value=p.displacementMap,e(p.displacementMap,m.displacementMapTransform),m.displacementScale.value=p.displacementScale,m.displacementBias.value=p.displacementBias),p.emissiveMap&&(m.emissiveMap.value=p.emissiveMap,e(p.emissiveMap,m.emissiveMapTransform)),p.specularMap&&(m.specularMap.value=p.specularMap,e(p.specularMap,m.specularMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest);const b=t.get(p),y=b.envMap,_=b.envMapRotation;y&&(m.envMap.value=y,nr.copy(_),nr.x*=-1,nr.y*=-1,nr.z*=-1,y.isCubeTexture&&y.isRenderTargetTexture===!1&&(nr.y*=-1,nr.z*=-1),m.envMapRotation.value.setFromMatrix4(Lx.makeRotationFromEuler(nr)),m.flipEnvMap.value=y.isCubeTexture&&y.isRenderTargetTexture===!1?-1:1,m.reflectivity.value=p.reflectivity,m.ior.value=p.ior,m.refractionRatio.value=p.refractionRatio),p.lightMap&&(m.lightMap.value=p.lightMap,m.lightMapIntensity.value=p.lightMapIntensity,e(p.lightMap,m.lightMapTransform)),p.aoMap&&(m.aoMap.value=p.aoMap,m.aoMapIntensity.value=p.aoMapIntensity,e(p.aoMap,m.aoMapTransform))}function a(m,p){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,p.map&&(m.map.value=p.map,e(p.map,m.mapTransform))}function o(m,p){m.dashSize.value=p.dashSize,m.totalSize.value=p.dashSize+p.gapSize,m.scale.value=p.scale}function c(m,p,b,y){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,m.size.value=p.size*b,m.scale.value=y*.5,p.map&&(m.map.value=p.map,e(p.map,m.uvTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,e(p.alphaMap,m.alphaMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest)}function l(m,p){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,m.rotation.value=p.rotation,p.map&&(m.map.value=p.map,e(p.map,m.mapTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,e(p.alphaMap,m.alphaMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest)}function h(m,p){m.specular.value.copy(p.specular),m.shininess.value=Math.max(p.shininess,1e-4)}function u(m,p){p.gradientMap&&(m.gradientMap.value=p.gradientMap)}function d(m,p){m.metalness.value=p.metalness,p.metalnessMap&&(m.metalnessMap.value=p.metalnessMap,e(p.metalnessMap,m.metalnessMapTransform)),m.roughness.value=p.roughness,p.roughnessMap&&(m.roughnessMap.value=p.roughnessMap,e(p.roughnessMap,m.roughnessMapTransform)),p.envMap&&(m.envMapIntensity.value=p.envMapIntensity)}function f(m,p,b){m.ior.value=p.ior,p.sheen>0&&(m.sheenColor.value.copy(p.sheenColor).multiplyScalar(p.sheen),m.sheenRoughness.value=p.sheenRoughness,p.sheenColorMap&&(m.sheenColorMap.value=p.sheenColorMap,e(p.sheenColorMap,m.sheenColorMapTransform)),p.sheenRoughnessMap&&(m.sheenRoughnessMap.value=p.sheenRoughnessMap,e(p.sheenRoughnessMap,m.sheenRoughnessMapTransform))),p.clearcoat>0&&(m.clearcoat.value=p.clearcoat,m.clearcoatRoughness.value=p.clearcoatRoughness,p.clearcoatMap&&(m.clearcoatMap.value=p.clearcoatMap,e(p.clearcoatMap,m.clearcoatMapTransform)),p.clearcoatRoughnessMap&&(m.clearcoatRoughnessMap.value=p.clearcoatRoughnessMap,e(p.clearcoatRoughnessMap,m.clearcoatRoughnessMapTransform)),p.clearcoatNormalMap&&(m.clearcoatNormalMap.value=p.clearcoatNormalMap,e(p.clearcoatNormalMap,m.clearcoatNormalMapTransform),m.clearcoatNormalScale.value.copy(p.clearcoatNormalScale),p.side===dn&&m.clearcoatNormalScale.value.negate())),p.dispersion>0&&(m.dispersion.value=p.dispersion),p.iridescence>0&&(m.iridescence.value=p.iridescence,m.iridescenceIOR.value=p.iridescenceIOR,m.iridescenceThicknessMinimum.value=p.iridescenceThicknessRange[0],m.iridescenceThicknessMaximum.value=p.iridescenceThicknessRange[1],p.iridescenceMap&&(m.iridescenceMap.value=p.iridescenceMap,e(p.iridescenceMap,m.iridescenceMapTransform)),p.iridescenceThicknessMap&&(m.iridescenceThicknessMap.value=p.iridescenceThicknessMap,e(p.iridescenceThicknessMap,m.iridescenceThicknessMapTransform))),p.transmission>0&&(m.transmission.value=p.transmission,m.transmissionSamplerMap.value=b.texture,m.transmissionSamplerSize.value.set(b.width,b.height),p.transmissionMap&&(m.transmissionMap.value=p.transmissionMap,e(p.transmissionMap,m.transmissionMapTransform)),m.thickness.value=p.thickness,p.thicknessMap&&(m.thicknessMap.value=p.thicknessMap,e(p.thicknessMap,m.thicknessMapTransform)),m.attenuationDistance.value=p.attenuationDistance,m.attenuationColor.value.copy(p.attenuationColor)),p.anisotropy>0&&(m.anisotropyVector.value.set(p.anisotropy*Math.cos(p.anisotropyRotation),p.anisotropy*Math.sin(p.anisotropyRotation)),p.anisotropyMap&&(m.anisotropyMap.value=p.anisotropyMap,e(p.anisotropyMap,m.anisotropyMapTransform))),m.specularIntensity.value=p.specularIntensity,m.specularColor.value.copy(p.specularColor),p.specularColorMap&&(m.specularColorMap.value=p.specularColorMap,e(p.specularColorMap,m.specularColorMapTransform)),p.specularIntensityMap&&(m.specularIntensityMap.value=p.specularIntensityMap,e(p.specularIntensityMap,m.specularIntensityMapTransform))}function g(m,p){p.matcap&&(m.matcap.value=p.matcap)}function v(m,p){const b=t.get(p).light;m.referencePosition.value.setFromMatrixPosition(b.matrixWorld),m.nearDistance.value=b.shadow.camera.near,m.farDistance.value=b.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:r}}function Dx(i,t,e,n){let r={},s={},a=[];const o=i.getParameter(i.MAX_UNIFORM_BUFFER_BINDINGS);function c(b,y){const _=y.program;n.uniformBlockBinding(b,_)}function l(b,y){let _=r[b.id];_===void 0&&(g(b),_=h(b),r[b.id]=_,b.addEventListener("dispose",m));const E=y.program;n.updateUBOMapping(b,E);const w=t.render.frame;s[b.id]!==w&&(d(b),s[b.id]=w)}function h(b){const y=u();b.__bindingPointIndex=y;const _=i.createBuffer(),E=b.__size,w=b.usage;return i.bindBuffer(i.UNIFORM_BUFFER,_),i.bufferData(i.UNIFORM_BUFFER,E,w),i.bindBuffer(i.UNIFORM_BUFFER,null),i.bindBufferBase(i.UNIFORM_BUFFER,y,_),_}function u(){for(let b=0;b<o;b++)if(a.indexOf(b)===-1)return a.push(b),b;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function d(b){const y=r[b.id],_=b.uniforms,E=b.__cache;i.bindBuffer(i.UNIFORM_BUFFER,y);for(let w=0,A=_.length;w<A;w++){const R=Array.isArray(_[w])?_[w]:[_[w]];for(let x=0,M=R.length;x<M;x++){const S=R[x];if(f(S,w,x,E)===!0){const T=S.__offset,D=Array.isArray(S.value)?S.value:[S.value];let U=0;for(let N=0;N<D.length;N++){const z=D[N],$=v(z);typeof z=="number"||typeof z=="boolean"?(S.__data[0]=z,i.bufferSubData(i.UNIFORM_BUFFER,T+U,S.__data)):z.isMatrix3?(S.__data[0]=z.elements[0],S.__data[1]=z.elements[1],S.__data[2]=z.elements[2],S.__data[3]=0,S.__data[4]=z.elements[3],S.__data[5]=z.elements[4],S.__data[6]=z.elements[5],S.__data[7]=0,S.__data[8]=z.elements[6],S.__data[9]=z.elements[7],S.__data[10]=z.elements[8],S.__data[11]=0):(z.toArray(S.__data,U),U+=$.storage/Float32Array.BYTES_PER_ELEMENT)}i.bufferSubData(i.UNIFORM_BUFFER,T,S.__data)}}}i.bindBuffer(i.UNIFORM_BUFFER,null)}function f(b,y,_,E){const w=b.value,A=y+"_"+_;if(E[A]===void 0)return typeof w=="number"||typeof w=="boolean"?E[A]=w:E[A]=w.clone(),!0;{const R=E[A];if(typeof w=="number"||typeof w=="boolean"){if(R!==w)return E[A]=w,!0}else if(R.equals(w)===!1)return R.copy(w),!0}return!1}function g(b){const y=b.uniforms;let _=0;const E=16;for(let A=0,R=y.length;A<R;A++){const x=Array.isArray(y[A])?y[A]:[y[A]];for(let M=0,S=x.length;M<S;M++){const T=x[M],D=Array.isArray(T.value)?T.value:[T.value];for(let U=0,N=D.length;U<N;U++){const z=D[U],$=v(z),V=_%E,tt=V%$.boundary,rt=V+tt;_+=tt,rt!==0&&E-rt<$.storage&&(_+=E-rt),T.__data=new Float32Array($.storage/Float32Array.BYTES_PER_ELEMENT),T.__offset=_,_+=$.storage}}}const w=_%E;return w>0&&(_+=E-w),b.__size=_,b.__cache={},this}function v(b){const y={boundary:0,storage:0};return typeof b=="number"||typeof b=="boolean"?(y.boundary=4,y.storage=4):b.isVector2?(y.boundary=8,y.storage=8):b.isVector3||b.isColor?(y.boundary=16,y.storage=12):b.isVector4?(y.boundary=16,y.storage=16):b.isMatrix3?(y.boundary=48,y.storage=48):b.isMatrix4?(y.boundary=64,y.storage=64):b.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",b),y}function m(b){const y=b.target;y.removeEventListener("dispose",m);const _=a.indexOf(y.__bindingPointIndex);a.splice(_,1),i.deleteBuffer(r[y.id]),delete r[y.id],delete s[y.id]}function p(){for(const b in r)i.deleteBuffer(r[b]);a=[],r={},s={}}return{bind:c,update:l,dispose:p}}class Ix{constructor(t={}){const{canvas:e=X0(),context:n=null,depth:r=!0,stencil:s=!1,alpha:a=!1,antialias:o=!1,premultipliedAlpha:c=!0,preserveDrawingBuffer:l=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:u=!1,reversedDepthBuffer:d=!1}=t;this.isWebGLRenderer=!0;let f;if(n!==null){if(typeof WebGLRenderingContext<"u"&&n instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");f=n.getContextAttributes().alpha}else f=a;const g=new Uint32Array(4),v=new Int32Array(4);let m=null,p=null;const b=[],y=[];this.domElement=e,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=Gi,this.toneMappingExposure=1,this.transmissionResolutionScale=1;const _=this;let E=!1;this._outputColorSpace=un;let w=0,A=0,R=null,x=-1,M=null;const S=new ae,T=new ae;let D=null;const U=new Ut(0);let N=0,z=e.width,$=e.height,V=1,tt=null,rt=null;const lt=new ae(0,0,z,$),xt=new ae(0,0,z,$);let Ct=!1;const Ot=new _l;let nt=!1,W=!1;const K=new ne,F=new I,k=new ae,H={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let X=!1;function Z(){return R===null?V:1}let P=n;function ut(L,q){return e.getContext(L,q)}try{const L={alpha:!0,depth:r,stencil:s,antialias:o,premultipliedAlpha:c,preserveDrawingBuffer:l,powerPreference:h,failIfMajorPerformanceCaveat:u};if("setAttribute"in e&&e.setAttribute("data-engine",`three.js r${ol}`),e.addEventListener("webglcontextlost",wt,!1),e.addEventListener("webglcontextrestored",It,!1),e.addEventListener("webglcontextcreationerror",dt,!1),P===null){const q="webgl2";if(P=ut(q,L),P===null)throw ut(q)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(L){throw console.error("THREE.WebGLRenderer: "+L.message),L}let at,Mt,pt,_t,yt,Bt,Ee,ve,O,C,j,st,ht,it,Vt,St,kt,Ht,gt,Rt,qt,zt,Tt,Zt;function G(){at=new Gg(P),at.init(),zt=new Ex(P,at),Mt=new Fg(P,at,t,zt),pt=new Sx(P,at),Mt.reversedDepthBuffer&&d&&pt.buffers.depth.setReversed(!0),_t=new qg(P),yt=new hx,Bt=new wx(P,at,pt,yt,Mt,zt,_t),Ee=new Bg(_),ve=new Vg(_),O=new Jp(P),Tt=new Ug(P,O),C=new Wg(P,O,_t,Tt),j=new $g(P,C,O,_t),gt=new Yg(P,Mt,Bt),St=new Og(yt),st=new lx(_,Ee,ve,at,Mt,Tt,St),ht=new Px(_,yt),it=new fx,Vt=new xx(at),Ht=new Ig(_,Ee,ve,pt,j,f,c),kt=new bx(_,j,Mt),Zt=new Dx(P,_t,Mt,pt),Rt=new Ng(P,at,_t),qt=new Xg(P,at,_t),_t.programs=st.programs,_.capabilities=Mt,_.extensions=at,_.properties=yt,_.renderLists=it,_.shadowMap=kt,_.state=pt,_.info=_t}G();const vt=new Cx(_,P);this.xr=vt,this.getContext=function(){return P},this.getContextAttributes=function(){return P.getContextAttributes()},this.forceContextLoss=function(){const L=at.get("WEBGL_lose_context");L&&L.loseContext()},this.forceContextRestore=function(){const L=at.get("WEBGL_lose_context");L&&L.restoreContext()},this.getPixelRatio=function(){return V},this.setPixelRatio=function(L){L!==void 0&&(V=L,this.setSize(z,$,!1))},this.getSize=function(L){return L.set(z,$)},this.setSize=function(L,q,Q=!0){if(vt.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}z=L,$=q,e.width=Math.floor(L*V),e.height=Math.floor(q*V),Q===!0&&(e.style.width=L+"px",e.style.height=q+"px"),this.setViewport(0,0,L,q)},this.getDrawingBufferSize=function(L){return L.set(z*V,$*V).floor()},this.setDrawingBufferSize=function(L,q,Q){z=L,$=q,V=Q,e.width=Math.floor(L*Q),e.height=Math.floor(q*Q),this.setViewport(0,0,L,q)},this.getCurrentViewport=function(L){return L.copy(S)},this.getViewport=function(L){return L.copy(lt)},this.setViewport=function(L,q,Q,et){L.isVector4?lt.set(L.x,L.y,L.z,L.w):lt.set(L,q,Q,et),pt.viewport(S.copy(lt).multiplyScalar(V).round())},this.getScissor=function(L){return L.copy(xt)},this.setScissor=function(L,q,Q,et){L.isVector4?xt.set(L.x,L.y,L.z,L.w):xt.set(L,q,Q,et),pt.scissor(T.copy(xt).multiplyScalar(V).round())},this.getScissorTest=function(){return Ct},this.setScissorTest=function(L){pt.setScissorTest(Ct=L)},this.setOpaqueSort=function(L){tt=L},this.setTransparentSort=function(L){rt=L},this.getClearColor=function(L){return L.copy(Ht.getClearColor())},this.setClearColor=function(){Ht.setClearColor(...arguments)},this.getClearAlpha=function(){return Ht.getClearAlpha()},this.setClearAlpha=function(){Ht.setClearAlpha(...arguments)},this.clear=function(L=!0,q=!0,Q=!0){let et=0;if(L){let Y=!1;if(R!==null){const mt=R.texture.format;Y=mt===dl||mt===fl||mt===ul}if(Y){const mt=R.texture.type,At=mt===Gn||mt===pr||mt===Is||mt===Us||mt===ll||mt===hl,Nt=Ht.getClearColor(),Dt=Ht.getClearAlpha(),Xt=Nt.r,Yt=Nt.g,Gt=Nt.b;At?(g[0]=Xt,g[1]=Yt,g[2]=Gt,g[3]=Dt,P.clearBufferuiv(P.COLOR,0,g)):(v[0]=Xt,v[1]=Yt,v[2]=Gt,v[3]=Dt,P.clearBufferiv(P.COLOR,0,v))}else et|=P.COLOR_BUFFER_BIT}q&&(et|=P.DEPTH_BUFFER_BIT),Q&&(et|=P.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),P.clear(et)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){e.removeEventListener("webglcontextlost",wt,!1),e.removeEventListener("webglcontextrestored",It,!1),e.removeEventListener("webglcontextcreationerror",dt,!1),Ht.dispose(),it.dispose(),Vt.dispose(),yt.dispose(),Ee.dispose(),ve.dispose(),j.dispose(),Tt.dispose(),Zt.dispose(),st.dispose(),vt.dispose(),vt.removeEventListener("sessionstart",Wn),vt.removeEventListener("sessionend",kl),$i.stop()};function wt(L){L.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),E=!0}function It(){console.log("THREE.WebGLRenderer: Context Restored."),E=!1;const L=_t.autoReset,q=kt.enabled,Q=kt.autoUpdate,et=kt.needsUpdate,Y=kt.type;G(),_t.autoReset=L,kt.enabled=q,kt.autoUpdate=Q,kt.needsUpdate=et,kt.type=Y}function dt(L){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",L.statusMessage)}function ot(L){const q=L.target;q.removeEventListener("dispose",ot),Ft(q)}function Ft(L){jt(L),yt.remove(L)}function jt(L){const q=yt.get(L).programs;q!==void 0&&(q.forEach(function(Q){st.releaseProgram(Q)}),L.isShaderMaterial&&st.releaseShaderCache(L))}this.renderBufferDirect=function(L,q,Q,et,Y,mt){q===null&&(q=H);const At=Y.isMesh&&Y.matrixWorld.determinant()<0,Nt=Cd(L,q,Q,et,Y);pt.setMaterial(et,At);let Dt=Q.index,Xt=1;if(et.wireframe===!0){if(Dt=C.getWireframeAttribute(Q),Dt===void 0)return;Xt=2}const Yt=Q.drawRange,Gt=Q.attributes.position;let ee=Yt.start*Xt,le=(Yt.start+Yt.count)*Xt;mt!==null&&(ee=Math.max(ee,mt.start*Xt),le=Math.min(le,(mt.start+mt.count)*Xt)),Dt!==null?(ee=Math.max(ee,0),le=Math.min(le,Dt.count)):Gt!=null&&(ee=Math.max(ee,0),le=Math.min(le,Gt.count));const we=le-ee;if(we<0||we===1/0)return;Tt.setup(Y,et,Nt,Q,Dt);let me,ue=Rt;if(Dt!==null&&(me=O.get(Dt),ue=qt,ue.setIndex(me)),Y.isMesh)et.wireframe===!0?(pt.setLineWidth(et.wireframeLinewidth*Z()),ue.setMode(P.LINES)):ue.setMode(P.TRIANGLES);else if(Y.isLine){let Wt=et.linewidth;Wt===void 0&&(Wt=1),pt.setLineWidth(Wt*Z()),Y.isLineSegments?ue.setMode(P.LINES):Y.isLineLoop?ue.setMode(P.LINE_LOOP):ue.setMode(P.LINE_STRIP)}else Y.isPoints?ue.setMode(P.POINTS):Y.isSprite&&ue.setMode(P.TRIANGLES);if(Y.isBatchedMesh)if(Y._multiDrawInstances!==null)Os("THREE.WebGLRenderer: renderMultiDrawInstances has been deprecated and will be removed in r184. Append to renderMultiDraw arguments and use indirection."),ue.renderMultiDrawInstances(Y._multiDrawStarts,Y._multiDrawCounts,Y._multiDrawCount,Y._multiDrawInstances);else if(at.get("WEBGL_multi_draw"))ue.renderMultiDraw(Y._multiDrawStarts,Y._multiDrawCounts,Y._multiDrawCount);else{const Wt=Y._multiDrawStarts,Me=Y._multiDrawCounts,re=Y._multiDrawCount,pn=Dt?O.get(Dt).bytesPerElement:1,Sr=yt.get(et).currentProgram.getUniforms();for(let mn=0;mn<re;mn++)Sr.setValue(P,"_gl_DrawID",mn),ue.render(Wt[mn]/pn,Me[mn])}else if(Y.isInstancedMesh)ue.renderInstances(ee,we,Y.count);else if(Q.isInstancedBufferGeometry){const Wt=Q._maxInstanceCount!==void 0?Q._maxInstanceCount:1/0,Me=Math.min(Q.instanceCount,Wt);ue.renderInstances(ee,we,Me)}else ue.render(ee,we)};function fe(L,q,Q){L.transparent===!0&&L.side===qe&&L.forceSinglePass===!1?(L.side=dn,L.needsUpdate=!0,Zs(L,q,Q),L.side=Xi,L.needsUpdate=!0,Zs(L,q,Q),L.side=qe):Zs(L,q,Q)}this.compile=function(L,q,Q=null){Q===null&&(Q=L),p=Vt.get(Q),p.init(q),y.push(p),Q.traverseVisible(function(Y){Y.isLight&&Y.layers.test(q.layers)&&(p.pushLight(Y),Y.castShadow&&p.pushShadow(Y))}),L!==Q&&L.traverseVisible(function(Y){Y.isLight&&Y.layers.test(q.layers)&&(p.pushLight(Y),Y.castShadow&&p.pushShadow(Y))}),p.setupLights();const et=new Set;return L.traverse(function(Y){if(!(Y.isMesh||Y.isPoints||Y.isLine||Y.isSprite))return;const mt=Y.material;if(mt)if(Array.isArray(mt))for(let At=0;At<mt.length;At++){const Nt=mt[At];fe(Nt,Q,Y),et.add(Nt)}else fe(mt,Q,Y),et.add(mt)}),p=y.pop(),et},this.compileAsync=function(L,q,Q=null){const et=this.compile(L,q,Q);return new Promise(Y=>{function mt(){if(et.forEach(function(At){yt.get(At).currentProgram.isReady()&&et.delete(At)}),et.size===0){Y(L);return}setTimeout(mt,10)}at.get("KHR_parallel_shader_compile")!==null?mt():setTimeout(mt,10)})};let ce=null;function ii(L){ce&&ce(L)}function Wn(){$i.stop()}function kl(){$i.start()}const $i=new Pf;$i.setAnimationLoop(ii),typeof self<"u"&&$i.setContext(self),this.setAnimationLoop=function(L){ce=L,vt.setAnimationLoop(L),L===null?$i.stop():$i.start()},vt.addEventListener("sessionstart",Wn),vt.addEventListener("sessionend",kl),this.render=function(L,q){if(q!==void 0&&q.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(E===!0)return;if(L.matrixWorldAutoUpdate===!0&&L.updateMatrixWorld(),q.parent===null&&q.matrixWorldAutoUpdate===!0&&q.updateMatrixWorld(),vt.enabled===!0&&vt.isPresenting===!0&&(vt.cameraAutoUpdate===!0&&vt.updateCamera(q),q=vt.getCamera()),L.isScene===!0&&L.onBeforeRender(_,L,q,R),p=Vt.get(L,y.length),p.init(q),y.push(p),K.multiplyMatrices(q.projectionMatrix,q.matrixWorldInverse),Ot.setFromProjectionMatrix(K,ei,q.reversedDepth),W=this.localClippingEnabled,nt=St.init(this.clippingPlanes,W),m=it.get(L,b.length),m.init(),b.push(m),vt.enabled===!0&&vt.isPresenting===!0){const mt=_.xr.getDepthSensingMesh();mt!==null&&so(mt,q,-1/0,_.sortObjects)}so(L,q,0,_.sortObjects),m.finish(),_.sortObjects===!0&&m.sort(tt,rt),X=vt.enabled===!1||vt.isPresenting===!1||vt.hasDepthSensing()===!1,X&&Ht.addToRenderList(m,L),this.info.render.frame++,nt===!0&&St.beginShadows();const Q=p.state.shadowsArray;kt.render(Q,L,q),nt===!0&&St.endShadows(),this.info.autoReset===!0&&this.info.reset();const et=m.opaque,Y=m.transmissive;if(p.setupLights(),q.isArrayCamera){const mt=q.cameras;if(Y.length>0)for(let At=0,Nt=mt.length;At<Nt;At++){const Dt=mt[At];zl(et,Y,L,Dt)}X&&Ht.render(L);for(let At=0,Nt=mt.length;At<Nt;At++){const Dt=mt[At];Hl(m,L,Dt,Dt.viewport)}}else Y.length>0&&zl(et,Y,L,q),X&&Ht.render(L),Hl(m,L,q);R!==null&&A===0&&(Bt.updateMultisampleRenderTarget(R),Bt.updateRenderTargetMipmap(R)),L.isScene===!0&&L.onAfterRender(_,L,q),Tt.resetDefaultState(),x=-1,M=null,y.pop(),y.length>0?(p=y[y.length-1],nt===!0&&St.setGlobalState(_.clippingPlanes,p.state.camera)):p=null,b.pop(),b.length>0?m=b[b.length-1]:m=null};function so(L,q,Q,et){if(L.visible===!1)return;if(L.layers.test(q.layers)){if(L.isGroup)Q=L.renderOrder;else if(L.isLOD)L.autoUpdate===!0&&L.update(q);else if(L.isLight)p.pushLight(L),L.castShadow&&p.pushShadow(L);else if(L.isSprite){if(!L.frustumCulled||Ot.intersectsSprite(L)){et&&k.setFromMatrixPosition(L.matrixWorld).applyMatrix4(K);const At=j.update(L),Nt=L.material;Nt.visible&&m.push(L,At,Nt,Q,k.z,null)}}else if((L.isMesh||L.isLine||L.isPoints)&&(!L.frustumCulled||Ot.intersectsObject(L))){const At=j.update(L),Nt=L.material;if(et&&(L.boundingSphere!==void 0?(L.boundingSphere===null&&L.computeBoundingSphere(),k.copy(L.boundingSphere.center)):(At.boundingSphere===null&&At.computeBoundingSphere(),k.copy(At.boundingSphere.center)),k.applyMatrix4(L.matrixWorld).applyMatrix4(K)),Array.isArray(Nt)){const Dt=At.groups;for(let Xt=0,Yt=Dt.length;Xt<Yt;Xt++){const Gt=Dt[Xt],ee=Nt[Gt.materialIndex];ee&&ee.visible&&m.push(L,At,ee,Q,k.z,Gt)}}else Nt.visible&&m.push(L,At,Nt,Q,k.z,null)}}const mt=L.children;for(let At=0,Nt=mt.length;At<Nt;At++)so(mt[At],q,Q,et)}function Hl(L,q,Q,et){const Y=L.opaque,mt=L.transmissive,At=L.transparent;p.setupLightsView(Q),nt===!0&&St.setGlobalState(_.clippingPlanes,Q),et&&pt.viewport(S.copy(et)),Y.length>0&&Ks(Y,q,Q),mt.length>0&&Ks(mt,q,Q),At.length>0&&Ks(At,q,Q),pt.buffers.depth.setTest(!0),pt.buffers.depth.setMask(!0),pt.buffers.color.setMask(!0),pt.setPolygonOffset(!1)}function zl(L,q,Q,et){if((Q.isScene===!0?Q.overrideMaterial:null)!==null)return;p.state.transmissionRenderTarget[et.id]===void 0&&(p.state.transmissionRenderTarget[et.id]=new en(1,1,{generateMipmaps:!0,type:at.has("EXT_color_buffer_half_float")||at.has("EXT_color_buffer_float")?xr:Gn,minFilter:Oi,samples:4,stencilBuffer:s,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:se.workingColorSpace}));const mt=p.state.transmissionRenderTarget[et.id],At=et.viewport||S;mt.setSize(At.z*_.transmissionResolutionScale,At.w*_.transmissionResolutionScale);const Nt=_.getRenderTarget(),Dt=_.getActiveCubeFace(),Xt=_.getActiveMipmapLevel();_.setRenderTarget(mt),_.getClearColor(U),N=_.getClearAlpha(),N<1&&_.setClearColor(16777215,.5),_.clear(),X&&Ht.render(Q);const Yt=_.toneMapping;_.toneMapping=Gi;const Gt=et.viewport;if(et.viewport!==void 0&&(et.viewport=void 0),p.setupLightsView(et),nt===!0&&St.setGlobalState(_.clippingPlanes,et),Ks(L,Q,et),Bt.updateMultisampleRenderTarget(mt),Bt.updateRenderTargetMipmap(mt),at.has("WEBGL_multisampled_render_to_texture")===!1){let ee=!1;for(let le=0,we=q.length;le<we;le++){const me=q[le],ue=me.object,Wt=me.geometry,Me=me.material,re=me.group;if(Me.side===qe&&ue.layers.test(et.layers)){const pn=Me.side;Me.side=dn,Me.needsUpdate=!0,Vl(ue,Q,et,Wt,Me,re),Me.side=pn,Me.needsUpdate=!0,ee=!0}}ee===!0&&(Bt.updateMultisampleRenderTarget(mt),Bt.updateRenderTargetMipmap(mt))}_.setRenderTarget(Nt,Dt,Xt),_.setClearColor(U,N),Gt!==void 0&&(et.viewport=Gt),_.toneMapping=Yt}function Ks(L,q,Q){const et=q.isScene===!0?q.overrideMaterial:null;for(let Y=0,mt=L.length;Y<mt;Y++){const At=L[Y],Nt=At.object,Dt=At.geometry,Xt=At.group;let Yt=At.material;Yt.allowOverride===!0&&et!==null&&(Yt=et),Nt.layers.test(Q.layers)&&Vl(Nt,q,Q,Dt,Yt,Xt)}}function Vl(L,q,Q,et,Y,mt){L.onBeforeRender(_,q,Q,et,Y,mt),L.modelViewMatrix.multiplyMatrices(Q.matrixWorldInverse,L.matrixWorld),L.normalMatrix.getNormalMatrix(L.modelViewMatrix),Y.onBeforeRender(_,q,Q,et,L,mt),Y.transparent===!0&&Y.side===qe&&Y.forceSinglePass===!1?(Y.side=dn,Y.needsUpdate=!0,_.renderBufferDirect(Q,q,et,Y,L,mt),Y.side=Xi,Y.needsUpdate=!0,_.renderBufferDirect(Q,q,et,Y,L,mt),Y.side=qe):_.renderBufferDirect(Q,q,et,Y,L,mt),L.onAfterRender(_,q,Q,et,Y,mt)}function Zs(L,q,Q){q.isScene!==!0&&(q=H);const et=yt.get(L),Y=p.state.lights,mt=p.state.shadowsArray,At=Y.state.version,Nt=st.getParameters(L,Y.state,mt,q,Q),Dt=st.getProgramCacheKey(Nt);let Xt=et.programs;et.environment=L.isMeshStandardMaterial?q.environment:null,et.fog=q.fog,et.envMap=(L.isMeshStandardMaterial?ve:Ee).get(L.envMap||et.environment),et.envMapRotation=et.environment!==null&&L.envMap===null?q.environmentRotation:L.envMapRotation,Xt===void 0&&(L.addEventListener("dispose",ot),Xt=new Map,et.programs=Xt);let Yt=Xt.get(Dt);if(Yt!==void 0){if(et.currentProgram===Yt&&et.lightsStateVersion===At)return Wl(L,Nt),Yt}else Nt.uniforms=st.getUniforms(L),L.onBeforeCompile(Nt,_),Yt=st.acquireProgram(Nt,Dt),Xt.set(Dt,Yt),et.uniforms=Nt.uniforms;const Gt=et.uniforms;return(!L.isShaderMaterial&&!L.isRawShaderMaterial||L.clipping===!0)&&(Gt.clippingPlanes=St.uniform),Wl(L,Nt),et.needsLights=Pd(L),et.lightsStateVersion=At,et.needsLights&&(Gt.ambientLightColor.value=Y.state.ambient,Gt.lightProbe.value=Y.state.probe,Gt.directionalLights.value=Y.state.directional,Gt.directionalLightShadows.value=Y.state.directionalShadow,Gt.spotLights.value=Y.state.spot,Gt.spotLightShadows.value=Y.state.spotShadow,Gt.rectAreaLights.value=Y.state.rectArea,Gt.ltc_1.value=Y.state.rectAreaLTC1,Gt.ltc_2.value=Y.state.rectAreaLTC2,Gt.pointLights.value=Y.state.point,Gt.pointLightShadows.value=Y.state.pointShadow,Gt.hemisphereLights.value=Y.state.hemi,Gt.directionalShadowMap.value=Y.state.directionalShadowMap,Gt.directionalShadowMatrix.value=Y.state.directionalShadowMatrix,Gt.spotShadowMap.value=Y.state.spotShadowMap,Gt.spotLightMatrix.value=Y.state.spotLightMatrix,Gt.spotLightMap.value=Y.state.spotLightMap,Gt.pointShadowMap.value=Y.state.pointShadowMap,Gt.pointShadowMatrix.value=Y.state.pointShadowMatrix),et.currentProgram=Yt,et.uniformsList=null,Yt}function Gl(L){if(L.uniformsList===null){const q=L.currentProgram.getUniforms();L.uniformsList=za.seqWithValue(q.seq,L.uniforms)}return L.uniformsList}function Wl(L,q){const Q=yt.get(L);Q.outputColorSpace=q.outputColorSpace,Q.batching=q.batching,Q.batchingColor=q.batchingColor,Q.instancing=q.instancing,Q.instancingColor=q.instancingColor,Q.instancingMorph=q.instancingMorph,Q.skinning=q.skinning,Q.morphTargets=q.morphTargets,Q.morphNormals=q.morphNormals,Q.morphColors=q.morphColors,Q.morphTargetsCount=q.morphTargetsCount,Q.numClippingPlanes=q.numClippingPlanes,Q.numIntersection=q.numClipIntersection,Q.vertexAlphas=q.vertexAlphas,Q.vertexTangents=q.vertexTangents,Q.toneMapping=q.toneMapping}function Cd(L,q,Q,et,Y){q.isScene!==!0&&(q=H),Bt.resetTextureUnits();const mt=q.fog,At=et.isMeshStandardMaterial?q.environment:null,Nt=R===null?_.outputColorSpace:R.isXRRenderTarget===!0?R.texture.colorSpace:mr,Dt=(et.isMeshStandardMaterial?ve:Ee).get(et.envMap||At),Xt=et.vertexColors===!0&&!!Q.attributes.color&&Q.attributes.color.itemSize===4,Yt=!!Q.attributes.tangent&&(!!et.normalMap||et.anisotropy>0),Gt=!!Q.morphAttributes.position,ee=!!Q.morphAttributes.normal,le=!!Q.morphAttributes.color;let we=Gi;et.toneMapped&&(R===null||R.isXRRenderTarget===!0)&&(we=_.toneMapping);const me=Q.morphAttributes.position||Q.morphAttributes.normal||Q.morphAttributes.color,ue=me!==void 0?me.length:0,Wt=yt.get(et),Me=p.state.lights;if(nt===!0&&(W===!0||L!==M)){const $e=L===M&&et.id===x;St.setState(et,L,$e)}let re=!1;et.version===Wt.__version?(Wt.needsLights&&Wt.lightsStateVersion!==Me.state.version||Wt.outputColorSpace!==Nt||Y.isBatchedMesh&&Wt.batching===!1||!Y.isBatchedMesh&&Wt.batching===!0||Y.isBatchedMesh&&Wt.batchingColor===!0&&Y.colorTexture===null||Y.isBatchedMesh&&Wt.batchingColor===!1&&Y.colorTexture!==null||Y.isInstancedMesh&&Wt.instancing===!1||!Y.isInstancedMesh&&Wt.instancing===!0||Y.isSkinnedMesh&&Wt.skinning===!1||!Y.isSkinnedMesh&&Wt.skinning===!0||Y.isInstancedMesh&&Wt.instancingColor===!0&&Y.instanceColor===null||Y.isInstancedMesh&&Wt.instancingColor===!1&&Y.instanceColor!==null||Y.isInstancedMesh&&Wt.instancingMorph===!0&&Y.morphTexture===null||Y.isInstancedMesh&&Wt.instancingMorph===!1&&Y.morphTexture!==null||Wt.envMap!==Dt||et.fog===!0&&Wt.fog!==mt||Wt.numClippingPlanes!==void 0&&(Wt.numClippingPlanes!==St.numPlanes||Wt.numIntersection!==St.numIntersection)||Wt.vertexAlphas!==Xt||Wt.vertexTangents!==Yt||Wt.morphTargets!==Gt||Wt.morphNormals!==ee||Wt.morphColors!==le||Wt.toneMapping!==we||Wt.morphTargetsCount!==ue)&&(re=!0):(re=!0,Wt.__version=et.version);let pn=Wt.currentProgram;re===!0&&(pn=Zs(et,q,Y));let Sr=!1,mn=!1,_s=!1;const be=pn.getUniforms(),wn=Wt.uniforms;if(pt.useProgram(pn.program)&&(Sr=!0,mn=!0,_s=!0),et.id!==x&&(x=et.id,mn=!0),Sr||M!==L){pt.buffers.depth.getReversed()&&L.reversedDepth!==!0&&(L._reversedDepth=!0,L.updateProjectionMatrix()),be.setValue(P,"projectionMatrix",L.projectionMatrix),be.setValue(P,"viewMatrix",L.matrixWorldInverse);const rn=be.map.cameraPosition;rn!==void 0&&rn.setValue(P,F.setFromMatrixPosition(L.matrixWorld)),Mt.logarithmicDepthBuffer&&be.setValue(P,"logDepthBufFC",2/(Math.log(L.far+1)/Math.LN2)),(et.isMeshPhongMaterial||et.isMeshToonMaterial||et.isMeshLambertMaterial||et.isMeshBasicMaterial||et.isMeshStandardMaterial||et.isShaderMaterial)&&be.setValue(P,"isOrthographic",L.isOrthographicCamera===!0),M!==L&&(M=L,mn=!0,_s=!0)}if(Y.isSkinnedMesh){be.setOptional(P,Y,"bindMatrix"),be.setOptional(P,Y,"bindMatrixInverse");const $e=Y.skeleton;$e&&($e.boneTexture===null&&$e.computeBoneTexture(),be.setValue(P,"boneTexture",$e.boneTexture,Bt))}Y.isBatchedMesh&&(be.setOptional(P,Y,"batchingTexture"),be.setValue(P,"batchingTexture",Y._matricesTexture,Bt),be.setOptional(P,Y,"batchingIdTexture"),be.setValue(P,"batchingIdTexture",Y._indirectTexture,Bt),be.setOptional(P,Y,"batchingColorTexture"),Y._colorsTexture!==null&&be.setValue(P,"batchingColorTexture",Y._colorsTexture,Bt));const En=Q.morphAttributes;if((En.position!==void 0||En.normal!==void 0||En.color!==void 0)&&gt.update(Y,Q,pn),(mn||Wt.receiveShadow!==Y.receiveShadow)&&(Wt.receiveShadow=Y.receiveShadow,be.setValue(P,"receiveShadow",Y.receiveShadow)),et.isMeshGouraudMaterial&&et.envMap!==null&&(wn.envMap.value=Dt,wn.flipEnvMap.value=Dt.isCubeTexture&&Dt.isRenderTargetTexture===!1?-1:1),et.isMeshStandardMaterial&&et.envMap===null&&q.environment!==null&&(wn.envMapIntensity.value=q.environmentIntensity),mn&&(be.setValue(P,"toneMappingExposure",_.toneMappingExposure),Wt.needsLights&&Ld(wn,_s),mt&&et.fog===!0&&ht.refreshFogUniforms(wn,mt),ht.refreshMaterialUniforms(wn,et,V,$,p.state.transmissionRenderTarget[L.id]),za.upload(P,Gl(Wt),wn,Bt)),et.isShaderMaterial&&et.uniformsNeedUpdate===!0&&(za.upload(P,Gl(Wt),wn,Bt),et.uniformsNeedUpdate=!1),et.isSpriteMaterial&&be.setValue(P,"center",Y.center),be.setValue(P,"modelViewMatrix",Y.modelViewMatrix),be.setValue(P,"normalMatrix",Y.normalMatrix),be.setValue(P,"modelMatrix",Y.matrixWorld),et.isShaderMaterial||et.isRawShaderMaterial){const $e=et.uniformsGroups;for(let rn=0,ao=$e.length;rn<ao;rn++){const ji=$e[rn];Zt.update(ji,pn),Zt.bind(ji,pn)}}return pn}function Ld(L,q){L.ambientLightColor.needsUpdate=q,L.lightProbe.needsUpdate=q,L.directionalLights.needsUpdate=q,L.directionalLightShadows.needsUpdate=q,L.pointLights.needsUpdate=q,L.pointLightShadows.needsUpdate=q,L.spotLights.needsUpdate=q,L.spotLightShadows.needsUpdate=q,L.rectAreaLights.needsUpdate=q,L.hemisphereLights.needsUpdate=q}function Pd(L){return L.isMeshLambertMaterial||L.isMeshToonMaterial||L.isMeshPhongMaterial||L.isMeshStandardMaterial||L.isShadowMaterial||L.isShaderMaterial&&L.lights===!0}this.getActiveCubeFace=function(){return w},this.getActiveMipmapLevel=function(){return A},this.getRenderTarget=function(){return R},this.setRenderTargetTextures=function(L,q,Q){const et=yt.get(L);et.__autoAllocateDepthBuffer=L.resolveDepthBuffer===!1,et.__autoAllocateDepthBuffer===!1&&(et.__useRenderToTexture=!1),yt.get(L.texture).__webglTexture=q,yt.get(L.depthTexture).__webglTexture=et.__autoAllocateDepthBuffer?void 0:Q,et.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(L,q){const Q=yt.get(L);Q.__webglFramebuffer=q,Q.__useDefaultFramebuffer=q===void 0};const Dd=P.createFramebuffer();this.setRenderTarget=function(L,q=0,Q=0){R=L,w=q,A=Q;let et=!0,Y=null,mt=!1,At=!1;if(L){const Dt=yt.get(L);if(Dt.__useDefaultFramebuffer!==void 0)pt.bindFramebuffer(P.FRAMEBUFFER,null),et=!1;else if(Dt.__webglFramebuffer===void 0)Bt.setupRenderTarget(L);else if(Dt.__hasExternalTextures)Bt.rebindTextures(L,yt.get(L.texture).__webglTexture,yt.get(L.depthTexture).__webglTexture);else if(L.depthBuffer){const Gt=L.depthTexture;if(Dt.__boundDepthTexture!==Gt){if(Gt!==null&&yt.has(Gt)&&(L.width!==Gt.image.width||L.height!==Gt.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");Bt.setupDepthRenderbuffer(L)}}const Xt=L.texture;(Xt.isData3DTexture||Xt.isDataArrayTexture||Xt.isCompressedArrayTexture)&&(At=!0);const Yt=yt.get(L).__webglFramebuffer;L.isWebGLCubeRenderTarget?(Array.isArray(Yt[q])?Y=Yt[q][Q]:Y=Yt[q],mt=!0):L.samples>0&&Bt.useMultisampledRTT(L)===!1?Y=yt.get(L).__webglMultisampledFramebuffer:Array.isArray(Yt)?Y=Yt[Q]:Y=Yt,S.copy(L.viewport),T.copy(L.scissor),D=L.scissorTest}else S.copy(lt).multiplyScalar(V).floor(),T.copy(xt).multiplyScalar(V).floor(),D=Ct;if(Q!==0&&(Y=Dd),pt.bindFramebuffer(P.FRAMEBUFFER,Y)&&et&&pt.drawBuffers(L,Y),pt.viewport(S),pt.scissor(T),pt.setScissorTest(D),mt){const Dt=yt.get(L.texture);P.framebufferTexture2D(P.FRAMEBUFFER,P.COLOR_ATTACHMENT0,P.TEXTURE_CUBE_MAP_POSITIVE_X+q,Dt.__webglTexture,Q)}else if(At){const Dt=q;for(let Xt=0;Xt<L.textures.length;Xt++){const Yt=yt.get(L.textures[Xt]);P.framebufferTextureLayer(P.FRAMEBUFFER,P.COLOR_ATTACHMENT0+Xt,Yt.__webglTexture,Q,Dt)}}else if(L!==null&&Q!==0){const Dt=yt.get(L.texture);P.framebufferTexture2D(P.FRAMEBUFFER,P.COLOR_ATTACHMENT0,P.TEXTURE_2D,Dt.__webglTexture,Q)}x=-1},this.readRenderTargetPixels=function(L,q,Q,et,Y,mt,At,Nt=0){if(!(L&&L.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Dt=yt.get(L).__webglFramebuffer;if(L.isWebGLCubeRenderTarget&&At!==void 0&&(Dt=Dt[At]),Dt){pt.bindFramebuffer(P.FRAMEBUFFER,Dt);try{const Xt=L.textures[Nt],Yt=Xt.format,Gt=Xt.type;if(!Mt.textureFormatReadable(Yt)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!Mt.textureTypeReadable(Gt)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}q>=0&&q<=L.width-et&&Q>=0&&Q<=L.height-Y&&(L.textures.length>1&&P.readBuffer(P.COLOR_ATTACHMENT0+Nt),P.readPixels(q,Q,et,Y,zt.convert(Yt),zt.convert(Gt),mt))}finally{const Xt=R!==null?yt.get(R).__webglFramebuffer:null;pt.bindFramebuffer(P.FRAMEBUFFER,Xt)}}},this.readRenderTargetPixelsAsync=async function(L,q,Q,et,Y,mt,At,Nt=0){if(!(L&&L.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let Dt=yt.get(L).__webglFramebuffer;if(L.isWebGLCubeRenderTarget&&At!==void 0&&(Dt=Dt[At]),Dt)if(q>=0&&q<=L.width-et&&Q>=0&&Q<=L.height-Y){pt.bindFramebuffer(P.FRAMEBUFFER,Dt);const Xt=L.textures[Nt],Yt=Xt.format,Gt=Xt.type;if(!Mt.textureFormatReadable(Yt))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!Mt.textureTypeReadable(Gt))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");const ee=P.createBuffer();P.bindBuffer(P.PIXEL_PACK_BUFFER,ee),P.bufferData(P.PIXEL_PACK_BUFFER,mt.byteLength,P.STREAM_READ),L.textures.length>1&&P.readBuffer(P.COLOR_ATTACHMENT0+Nt),P.readPixels(q,Q,et,Y,zt.convert(Yt),zt.convert(Gt),0);const le=R!==null?yt.get(R).__webglFramebuffer:null;pt.bindFramebuffer(P.FRAMEBUFFER,le);const we=P.fenceSync(P.SYNC_GPU_COMMANDS_COMPLETE,0);return P.flush(),await q0(P,we,4),P.bindBuffer(P.PIXEL_PACK_BUFFER,ee),P.getBufferSubData(P.PIXEL_PACK_BUFFER,0,mt),P.deleteBuffer(ee),P.deleteSync(we),mt}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(L,q=null,Q=0){const et=Math.pow(2,-Q),Y=Math.floor(L.image.width*et),mt=Math.floor(L.image.height*et),At=q!==null?q.x:0,Nt=q!==null?q.y:0;Bt.setTexture2D(L,0),P.copyTexSubImage2D(P.TEXTURE_2D,Q,0,0,At,Nt,Y,mt),pt.unbindTexture()};const Id=P.createFramebuffer(),Ud=P.createFramebuffer();this.copyTextureToTexture=function(L,q,Q=null,et=null,Y=0,mt=null){mt===null&&(Y!==0?(Os("WebGLRenderer: copyTextureToTexture function signature has changed to support src and dst mipmap levels."),mt=Y,Y=0):mt=0);let At,Nt,Dt,Xt,Yt,Gt,ee,le,we;const me=L.isCompressedTexture?L.mipmaps[mt]:L.image;if(Q!==null)At=Q.max.x-Q.min.x,Nt=Q.max.y-Q.min.y,Dt=Q.isBox3?Q.max.z-Q.min.z:1,Xt=Q.min.x,Yt=Q.min.y,Gt=Q.isBox3?Q.min.z:0;else{const En=Math.pow(2,-Y);At=Math.floor(me.width*En),Nt=Math.floor(me.height*En),L.isDataArrayTexture?Dt=me.depth:L.isData3DTexture?Dt=Math.floor(me.depth*En):Dt=1,Xt=0,Yt=0,Gt=0}et!==null?(ee=et.x,le=et.y,we=et.z):(ee=0,le=0,we=0);const ue=zt.convert(q.format),Wt=zt.convert(q.type);let Me;q.isData3DTexture?(Bt.setTexture3D(q,0),Me=P.TEXTURE_3D):q.isDataArrayTexture||q.isCompressedArrayTexture?(Bt.setTexture2DArray(q,0),Me=P.TEXTURE_2D_ARRAY):(Bt.setTexture2D(q,0),Me=P.TEXTURE_2D),P.pixelStorei(P.UNPACK_FLIP_Y_WEBGL,q.flipY),P.pixelStorei(P.UNPACK_PREMULTIPLY_ALPHA_WEBGL,q.premultiplyAlpha),P.pixelStorei(P.UNPACK_ALIGNMENT,q.unpackAlignment);const re=P.getParameter(P.UNPACK_ROW_LENGTH),pn=P.getParameter(P.UNPACK_IMAGE_HEIGHT),Sr=P.getParameter(P.UNPACK_SKIP_PIXELS),mn=P.getParameter(P.UNPACK_SKIP_ROWS),_s=P.getParameter(P.UNPACK_SKIP_IMAGES);P.pixelStorei(P.UNPACK_ROW_LENGTH,me.width),P.pixelStorei(P.UNPACK_IMAGE_HEIGHT,me.height),P.pixelStorei(P.UNPACK_SKIP_PIXELS,Xt),P.pixelStorei(P.UNPACK_SKIP_ROWS,Yt),P.pixelStorei(P.UNPACK_SKIP_IMAGES,Gt);const be=L.isDataArrayTexture||L.isData3DTexture,wn=q.isDataArrayTexture||q.isData3DTexture;if(L.isDepthTexture){const En=yt.get(L),$e=yt.get(q),rn=yt.get(En.__renderTarget),ao=yt.get($e.__renderTarget);pt.bindFramebuffer(P.READ_FRAMEBUFFER,rn.__webglFramebuffer),pt.bindFramebuffer(P.DRAW_FRAMEBUFFER,ao.__webglFramebuffer);for(let ji=0;ji<Dt;ji++)be&&(P.framebufferTextureLayer(P.READ_FRAMEBUFFER,P.COLOR_ATTACHMENT0,yt.get(L).__webglTexture,Y,Gt+ji),P.framebufferTextureLayer(P.DRAW_FRAMEBUFFER,P.COLOR_ATTACHMENT0,yt.get(q).__webglTexture,mt,we+ji)),P.blitFramebuffer(Xt,Yt,At,Nt,ee,le,At,Nt,P.DEPTH_BUFFER_BIT,P.NEAREST);pt.bindFramebuffer(P.READ_FRAMEBUFFER,null),pt.bindFramebuffer(P.DRAW_FRAMEBUFFER,null)}else if(Y!==0||L.isRenderTargetTexture||yt.has(L)){const En=yt.get(L),$e=yt.get(q);pt.bindFramebuffer(P.READ_FRAMEBUFFER,Id),pt.bindFramebuffer(P.DRAW_FRAMEBUFFER,Ud);for(let rn=0;rn<Dt;rn++)be?P.framebufferTextureLayer(P.READ_FRAMEBUFFER,P.COLOR_ATTACHMENT0,En.__webglTexture,Y,Gt+rn):P.framebufferTexture2D(P.READ_FRAMEBUFFER,P.COLOR_ATTACHMENT0,P.TEXTURE_2D,En.__webglTexture,Y),wn?P.framebufferTextureLayer(P.DRAW_FRAMEBUFFER,P.COLOR_ATTACHMENT0,$e.__webglTexture,mt,we+rn):P.framebufferTexture2D(P.DRAW_FRAMEBUFFER,P.COLOR_ATTACHMENT0,P.TEXTURE_2D,$e.__webglTexture,mt),Y!==0?P.blitFramebuffer(Xt,Yt,At,Nt,ee,le,At,Nt,P.COLOR_BUFFER_BIT,P.NEAREST):wn?P.copyTexSubImage3D(Me,mt,ee,le,we+rn,Xt,Yt,At,Nt):P.copyTexSubImage2D(Me,mt,ee,le,Xt,Yt,At,Nt);pt.bindFramebuffer(P.READ_FRAMEBUFFER,null),pt.bindFramebuffer(P.DRAW_FRAMEBUFFER,null)}else wn?L.isDataTexture||L.isData3DTexture?P.texSubImage3D(Me,mt,ee,le,we,At,Nt,Dt,ue,Wt,me.data):q.isCompressedArrayTexture?P.compressedTexSubImage3D(Me,mt,ee,le,we,At,Nt,Dt,ue,me.data):P.texSubImage3D(Me,mt,ee,le,we,At,Nt,Dt,ue,Wt,me):L.isDataTexture?P.texSubImage2D(P.TEXTURE_2D,mt,ee,le,At,Nt,ue,Wt,me.data):L.isCompressedTexture?P.compressedTexSubImage2D(P.TEXTURE_2D,mt,ee,le,me.width,me.height,ue,me.data):P.texSubImage2D(P.TEXTURE_2D,mt,ee,le,At,Nt,ue,Wt,me);P.pixelStorei(P.UNPACK_ROW_LENGTH,re),P.pixelStorei(P.UNPACK_IMAGE_HEIGHT,pn),P.pixelStorei(P.UNPACK_SKIP_PIXELS,Sr),P.pixelStorei(P.UNPACK_SKIP_ROWS,mn),P.pixelStorei(P.UNPACK_SKIP_IMAGES,_s),mt===0&&q.generateMipmaps&&P.generateMipmap(Me),pt.unbindTexture()},this.initRenderTarget=function(L){yt.get(L).__webglFramebuffer===void 0&&Bt.setupRenderTarget(L)},this.initTexture=function(L){L.isCubeTexture?Bt.setTextureCube(L,0):L.isData3DTexture?Bt.setTexture3D(L,0):L.isDataArrayTexture||L.isCompressedArrayTexture?Bt.setTexture2DArray(L,0):Bt.setTexture2D(L,0),pt.unbindTexture()},this.resetState=function(){w=0,A=0,R=null,pt.reset(),Tt.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return ei}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(t){this._outputColorSpace=t;const e=this.getContext();e.drawingBufferColorSpace=se._getDrawingBufferColorSpace(t),e.unpackColorSpace=se._getUnpackColorSpace()}}const Ux={armL:[.2,-1,0],forearmL:[.15,-1,.1],armR:[-.2,-1,0],forearmR:[-.15,-1,.1],thighL:[.05,-1,0],shinL:[0,-1,0],footL:[0,-.15,1],thighR:[-.05,-1,0],shinR:[0,-1,0],footR:[0,-.15,1]};function Nx(i,t){const e=i.scale??1,n=g=>new I(...i.dir?.[g]??Ux[g]).normalize(),r=Array.from({length:ic},()=>new I),s=(g,v)=>r[g].copy(v),a=(g,v,m)=>new I(g,v,m).multiplyScalar(e);s(B.hipL,a(.1,0,0)),s(B.hipR,a(-.1,0,0)),s(B.shL,a(.19,.52,-.02)),s(B.shR,a(-.19,.52,-.02));const o=new ze().setFromEuler(new In(i.head?.[1]??0,i.head?.[0]??0,0,"YXZ")),c=a(0,.6,-.02),l=(g,v,m)=>a(g,v,m).applyQuaternion(o).add(c);s(B.nose,l(0,.1,.11)),s(B.eyeL,l(.032,.135,.09)),s(B.eyeR,l(-.032,.135,.09)),s(B.eyeInL,l(.018,.135,.095)),s(B.eyeInR,l(-.018,.135,.095)),s(B.eyeOutL,l(.05,.135,.08)),s(B.eyeOutR,l(-.05,.135,.08)),s(B.earL,l(.075,.12,0)),s(B.earR,l(-.075,.12,0)),s(B.mouthL,l(.024,.06,.095)),s(B.mouthR,l(-.024,.06,.095));for(const g of["L","R"]){const v=r[g==="L"?B.shL:B.shR],m=r[g==="L"?B.hipL:B.hipR],p=v.clone().addScaledVector(n(`arm${g}`),.29*e),b=p.clone().addScaledVector(n(`forearm${g}`),.26*e);s(g==="L"?B.elL:B.elR,p),s(g==="L"?B.wrL:B.wrR,b);const y=b.clone().addScaledVector(n(`forearm${g}`),.08*e);s(g==="L"?B.indexL:B.indexR,y.clone().add(a(0,0,.02))),s(g==="L"?B.pinkyL:B.pinkyR,y.clone().add(a(0,0,-.02))),s(g==="L"?B.thumbL:B.thumbR,b.clone().addScaledVector(n(`forearm${g}`),.04*e).add(a(0,0,.04)));const _=m.clone().addScaledVector(n(`thigh${g}`),.43*e),E=_.clone().addScaledVector(n(`shin${g}`),.42*e);s(g==="L"?B.knL:B.knR,_),s(g==="L"?B.anL:B.anR,E);const w=E.clone().add(a(0,-.04,-.05));s(g==="L"?B.heelL:B.heelR,w),s(g==="L"?B.toeL:B.toeR,w.clone().addScaledVector(n(`foot${g}`),.24*e))}const h=new ze().setFromAxisAngle(new I(0,1,0),i.yaw??0),u=new Set([B.knL,B.knR,B.anL,B.anR,B.heelL,B.heelR,B.toeL,B.toeR]),d=[],f=[];for(let g=0;g<ic;g++){const v=r[g].clone().applyQuaternion(h),m=u.has(g)?i.legsVis??.98:.98;d.push({x:v.x,y:v.y,z:v.z,v:m});const p=is({x:v.x+i.T.x,y:v.y+i.T.y,z:v.z+i.T.z},t);f.push({x:p.x,y:p.y,z:0,v:m})}return{world:d,image:f}}function Fx(i,t,e){const n=[];for(let r=0;r<i;r++){const s=t*1.3+r*2.1,a=(r-(i-1)/2)*.9+Math.sin(t*.4+r)*.15,o=Math.sin(s);n.push(Nx({T:{x:a,y:-.1+.03*Math.sin(s*2),z:-3-r*.6},yaw:Math.sin(t*.5+r)*.5,head:[Math.sin(t*.7+r)*.4,Math.sin(t*.9)*.15],dir:{armR:[-1,.3+.5*o,.1],forearmR:[-.3,1,.1+.3*o],armL:[.5+.4*Math.cos(s),-.8+.6*Math.cos(s*.5),.3],forearmL:[.2,-.3,1],thighL:[.12,-1,.25*Math.max(0,o)],shinL:[.05,-1,-.2*Math.max(0,o)]},scale:1-r*.08},e))}return n}function Ox(i,t,e,n){const r=i.image,s=new Float32Array(t*e),a=f=>[r[f].x*n,r[f].y],o=Math.hypot(a(B.shL)[0]-a(B.hipL)[0],a(B.shL)[1]-a(B.hipL)[1]),c=[[B.shL,B.elL,.11],[B.elL,B.wrL,.09],[B.shR,B.elR,.11],[B.elR,B.wrR,.09],[B.hipL,B.knL,.15],[B.knL,B.anL,.11],[B.hipR,B.knR,.15],[B.knR,B.anR,.11],[B.anL,B.toeL,.07],[B.anR,B.toeR,.07],[B.shL,B.hipR,.2],[B.shR,B.hipL,.2],[B.shL,B.shR,.14],[B.hipL,B.hipR,.16]],l=a(B.nose),h=a(B.earL),u=a(B.earR),d=Math.max(Math.hypot(h[0]-u[0],h[1]-u[1])*.9,o*.22);for(let f=0;f<e;f++)for(let g=0;g<t;g++){const v=(g+.5)/t*n,m=(f+.5)/e;let p=Math.hypot(v-l[0],m-(l[1]-d*.2))-d;for(const[b,y,_]of c){const E=a(b),w=a(y),A=w[0]-E[0],R=w[1]-E[1],x=A*A+R*R||1,M=Math.max(0,Math.min(1,((v-E[0])*A+(m-E[1])*R)/x));p=Math.min(p,Math.hypot(v-E[0]-A*M,m-E[1]-R*M)-_*o)}s[f*t+g]=Math.max(0,Math.min(1,.5-p/(o*.04)))}return{data:s,w:t,h:e}}function iu(i){const t=new Map,e=new Map,n=i.clone();return Ff(i,n,function(r,s){t.set(s,r),e.set(r,s)}),n.traverse(function(r){if(!r.isSkinnedMesh)return;const s=r,a=t.get(r),o=a.skeleton.bones;s.skeleton=a.skeleton.clone(),s.bindMatrix.copy(a.bindMatrix),s.skeleton.bones=o.map(function(c){return e.get(c)}),s.bind(s.skeleton,s.bindMatrix)}),n}function Ff(i,t,e){e(i,t);for(let n=0;n<i.children.length;n++)Ff(i.children[n],t.children[n],e)}class Of extends Pt{constructor(t,e,n=!1,r=!1,s=1e4){const a=new Le;super(a,e),this.isMarchingCubes=!0;const o=this,c=new Float32Array(36),l=new Float32Array(36),h=new Float32Array(36);this.enableUvs=n,this.enableColors=r,this.init=function(b){this.resolution=b,this.isolation=80,this.size=b,this.size2=this.size*this.size,this.size3=this.size2*this.size,this.halfsize=this.size/2,this.delta=2/this.size,this.yd=this.size,this.zd=this.size2,this.field=new Float32Array(this.size3),this.normal_cache=new Float32Array(this.size3*3),this.palette=new Float32Array(this.size3*3),this.count=0;const y=s*3;this.positionArray=new Float32Array(y*3);const _=new ie(this.positionArray,3);_.setUsage(ta),a.setAttribute("position",_),this.normalArray=new Float32Array(y*3);const E=new ie(this.normalArray,3);if(E.setUsage(ta),a.setAttribute("normal",E),this.enableUvs){this.uvArray=new Float32Array(y*2);const w=new ie(this.uvArray,2);w.setUsage(ta),a.setAttribute("uv",w)}if(this.enableColors){this.colorArray=new Float32Array(y*3);const w=new ie(this.colorArray,3);w.setUsage(ta),a.setAttribute("color",w)}a.boundingSphere=new Mr(new I,1)};function u(b,y,_){return b+(y-b)*_}function d(b,y,_,E,w,A,R,x,M,S){const T=(_-R)/(x-R),D=o.normal_cache;c[y+0]=E+T*o.delta,c[y+1]=w,c[y+2]=A,l[y+0]=u(D[b+0],D[b+3],T),l[y+1]=u(D[b+1],D[b+4],T),l[y+2]=u(D[b+2],D[b+5],T),h[y+0]=u(o.palette[M*3+0],o.palette[S*3+0],T),h[y+1]=u(o.palette[M*3+1],o.palette[S*3+1],T),h[y+2]=u(o.palette[M*3+2],o.palette[S*3+2],T)}function f(b,y,_,E,w,A,R,x,M,S){const T=(_-R)/(x-R),D=o.normal_cache;c[y+0]=E,c[y+1]=w+T*o.delta,c[y+2]=A;const U=b+o.yd*3;l[y+0]=u(D[b+0],D[U+0],T),l[y+1]=u(D[b+1],D[U+1],T),l[y+2]=u(D[b+2],D[U+2],T),h[y+0]=u(o.palette[M*3+0],o.palette[S*3+0],T),h[y+1]=u(o.palette[M*3+1],o.palette[S*3+1],T),h[y+2]=u(o.palette[M*3+2],o.palette[S*3+2],T)}function g(b,y,_,E,w,A,R,x,M,S){const T=(_-R)/(x-R),D=o.normal_cache;c[y+0]=E,c[y+1]=w,c[y+2]=A+T*o.delta;const U=b+o.zd*3;l[y+0]=u(D[b+0],D[U+0],T),l[y+1]=u(D[b+1],D[U+1],T),l[y+2]=u(D[b+2],D[U+2],T),h[y+0]=u(o.palette[M*3+0],o.palette[S*3+0],T),h[y+1]=u(o.palette[M*3+1],o.palette[S*3+1],T),h[y+2]=u(o.palette[M*3+2],o.palette[S*3+2],T)}function v(b){const y=b*3;o.normal_cache[y]===0&&(o.normal_cache[y+0]=o.field[b-1]-o.field[b+1],o.normal_cache[y+1]=o.field[b-o.yd]-o.field[b+o.yd],o.normal_cache[y+2]=o.field[b-o.zd]-o.field[b+o.zd])}function m(b,y,_,E,w){const A=E+1,R=E+o.yd,x=E+o.zd,M=A+o.yd,S=A+o.zd,T=E+o.yd+o.zd,D=A+o.yd+o.zd;let U=0;const N=o.field[E],z=o.field[A],$=o.field[R],V=o.field[M],tt=o.field[x],rt=o.field[S],lt=o.field[T],xt=o.field[D];N<w&&(U|=1),z<w&&(U|=2),$<w&&(U|=8),V<w&&(U|=4),tt<w&&(U|=16),rt<w&&(U|=32),lt<w&&(U|=128),xt<w&&(U|=64);const Ct=Bx[U];if(Ct===0)return 0;const Ot=o.delta,nt=b+Ot,W=y+Ot,K=_+Ot;Ct&1&&(v(E),v(A),d(E*3,0,w,b,y,_,N,z,E,A)),Ct&2&&(v(A),v(M),f(A*3,3,w,nt,y,_,z,V,A,M)),Ct&4&&(v(R),v(M),d(R*3,6,w,b,W,_,$,V,R,M)),Ct&8&&(v(E),v(R),f(E*3,9,w,b,y,_,N,$,E,R)),Ct&16&&(v(x),v(S),d(x*3,12,w,b,y,K,tt,rt,x,S)),Ct&32&&(v(S),v(D),f(S*3,15,w,nt,y,K,rt,xt,S,D)),Ct&64&&(v(T),v(D),d(T*3,18,w,b,W,K,lt,xt,T,D)),Ct&128&&(v(x),v(T),f(x*3,21,w,b,y,K,tt,lt,x,T)),Ct&256&&(v(E),v(x),g(E*3,24,w,b,y,_,N,tt,E,x)),Ct&512&&(v(A),v(S),g(A*3,27,w,nt,y,_,z,rt,A,S)),Ct&1024&&(v(M),v(D),g(M*3,30,w,nt,W,_,V,xt,M,D)),Ct&2048&&(v(R),v(T),g(R*3,33,w,b,W,_,$,lt,R,T)),U<<=4;let F,k,H,X=0,Z=0;for(;Ta[U+Z]!=-1;)F=U+Z,k=F+1,H=F+2,p(c,l,h,3*Ta[F],3*Ta[k],3*Ta[H]),Z+=3,X++;return X}function p(b,y,_,E,w,A){const R=o.count*3;if(o.positionArray[R+0]=b[E],o.positionArray[R+1]=b[E+1],o.positionArray[R+2]=b[E+2],o.positionArray[R+3]=b[w],o.positionArray[R+4]=b[w+1],o.positionArray[R+5]=b[w+2],o.positionArray[R+6]=b[A],o.positionArray[R+7]=b[A+1],o.positionArray[R+8]=b[A+2],o.material.flatShading===!0){const x=(y[E+0]+y[w+0]+y[A+0])/3,M=(y[E+1]+y[w+1]+y[A+1])/3,S=(y[E+2]+y[w+2]+y[A+2])/3;o.normalArray[R+0]=x,o.normalArray[R+1]=M,o.normalArray[R+2]=S,o.normalArray[R+3]=x,o.normalArray[R+4]=M,o.normalArray[R+5]=S,o.normalArray[R+6]=x,o.normalArray[R+7]=M,o.normalArray[R+8]=S}else o.normalArray[R+0]=y[E+0],o.normalArray[R+1]=y[E+1],o.normalArray[R+2]=y[E+2],o.normalArray[R+3]=y[w+0],o.normalArray[R+4]=y[w+1],o.normalArray[R+5]=y[w+2],o.normalArray[R+6]=y[A+0],o.normalArray[R+7]=y[A+1],o.normalArray[R+8]=y[A+2];if(o.enableUvs){const x=o.count*2;o.uvArray[x+0]=b[E+0],o.uvArray[x+1]=b[E+2],o.uvArray[x+2]=b[w+0],o.uvArray[x+3]=b[w+2],o.uvArray[x+4]=b[A+0],o.uvArray[x+5]=b[A+2]}o.enableColors&&(o.colorArray[R+0]=_[E+0],o.colorArray[R+1]=_[E+1],o.colorArray[R+2]=_[E+2],o.colorArray[R+3]=_[w+0],o.colorArray[R+4]=_[w+1],o.colorArray[R+5]=_[w+2],o.colorArray[R+6]=_[A+0],o.colorArray[R+7]=_[A+1],o.colorArray[R+8]=_[A+2]),o.count+=3}this.addBall=function(b,y,_,E,w,A){const R=Math.sign(E);E=Math.abs(E);const x=A!=null;let M=new Ut(b,y,_);if(x)try{M=A instanceof Ut?A:Array.isArray(A)?new Ut(Math.min(Math.abs(A[0]),1),Math.min(Math.abs(A[1]),1),Math.min(Math.abs(A[2]),1)):new Ut(A)}catch{M=new Ut(b,y,_)}const S=this.size*Math.sqrt(E/w),T=_*this.size,D=y*this.size,U=b*this.size;let N=Math.floor(T-S);N<1&&(N=1);let z=Math.floor(T+S);z>this.size-1&&(z=this.size-1);let $=Math.floor(D-S);$<1&&($=1);let V=Math.floor(D+S);V>this.size-1&&(V=this.size-1);let tt=Math.floor(U-S);tt<1&&(tt=1);let rt=Math.floor(U+S);rt>this.size-1&&(rt=this.size-1);let lt,xt,Ct,Ot,nt,W,K,F,k,H,X;for(Ct=N;Ct<z;Ct++)for(nt=this.size2*Ct,F=Ct/this.size-_,k=F*F,xt=$;xt<V;xt++)for(Ot=nt+this.size*xt,K=xt/this.size-y,H=K*K,lt=tt;lt<rt;lt++)if(W=lt/this.size-b,X=E/(1e-6+W*W+H+k)-w,X>0){this.field[Ot+lt]+=X*R;const Z=Math.sqrt((lt-U)*(lt-U)+(xt-D)*(xt-D)+(Ct-T)*(Ct-T))/S,P=1-Z*Z*Z*(Z*(Z*6-15)+10);this.palette[(Ot+lt)*3+0]+=M.r*P,this.palette[(Ot+lt)*3+1]+=M.g*P,this.palette[(Ot+lt)*3+2]+=M.b*P}},this.addPlaneX=function(b,y){const _=this.size,E=this.yd,w=this.zd,A=this.field;let R,x,M,S,T,D,U,N=_*Math.sqrt(b/y);for(N>_&&(N=_),R=0;R<N;R++)if(D=R/_,S=D*D,T=b/(1e-4+S)-y,T>0)for(x=0;x<_;x++)for(U=R+x*E,M=0;M<_;M++)A[w*M+U]+=T},this.addPlaneY=function(b,y){const _=this.size,E=this.yd,w=this.zd,A=this.field;let R,x,M,S,T,D,U,N,z=_*Math.sqrt(b/y);for(z>_&&(z=_),x=0;x<z;x++)if(D=x/_,S=D*D,T=b/(1e-4+S)-y,T>0)for(U=x*E,R=0;R<_;R++)for(N=U+R,M=0;M<_;M++)A[w*M+N]+=T},this.addPlaneZ=function(b,y){const _=this.size,E=this.yd,w=this.zd,A=this.field;let R,x,M,S,T,D,U,N,z=_*Math.sqrt(b/y);for(z>_&&(z=_),M=0;M<z;M++)if(D=M/_,S=D*D,T=b/(1e-4+S)-y,T>0)for(U=w*M,x=0;x<_;x++)for(N=U+x*E,R=0;R<_;R++)A[N+R]+=T},this.setCell=function(b,y,_,E){const w=this.size2*_+this.size*y+b;this.field[w]=E},this.getCell=function(b,y,_){const E=this.size2*_+this.size*y+b;return this.field[E]},this.blur=function(b=1){const y=this.field,_=y.slice(),E=this.size,w=this.size2;for(let A=0;A<E;A++)for(let R=0;R<E;R++)for(let x=0;x<E;x++){const M=w*x+E*R+A;let S=_[M],T=1;for(let D=-1;D<=1;D+=2){const U=D+A;if(!(U<0||U>=E))for(let N=-1;N<=1;N+=2){const z=N+R;if(!(z<0||z>=E))for(let $=-1;$<=1;$+=2){const V=$+x;if(V<0||V>=E)continue;const tt=w*V+E*z+U,rt=_[tt];T++,S+=b*(rt-S)/T}}}y[M]=S}},this.reset=function(){for(let b=0;b<this.size3;b++)this.normal_cache[b*3]=0,this.field[b]=0,this.palette[b*3]=this.palette[b*3+1]=this.palette[b*3+2]=0},this.update=function(){this.count=0;const b=this.size-2;for(let y=1;y<b;y++){const _=this.size2*y,E=(y-this.halfsize)/this.halfsize;for(let w=1;w<b;w++){const A=_+this.size*w,R=(w-this.halfsize)/this.halfsize;for(let x=1;x<b;x++){const M=(x-this.halfsize)/this.halfsize,S=A+x;m(M,R,E,S,this.isolation)}}}this.geometry.setDrawRange(0,this.count),a.getAttribute("position").needsUpdate=!0,a.getAttribute("normal").needsUpdate=!0,this.enableUvs&&(a.getAttribute("uv").needsUpdate=!0),this.enableColors&&(a.getAttribute("color").needsUpdate=!0),this.count/3>s&&console.warn("THREE.MarchingCubes: Geometry buffers too small for rendering. Please create an instance with a higher poly count.")},this.init(t)}}const Bx=new Int32Array([0,265,515,778,1030,1295,1541,1804,2060,2309,2575,2822,3082,3331,3593,3840,400,153,915,666,1430,1183,1941,1692,2460,2197,2975,2710,3482,3219,3993,3728,560,825,51,314,1590,1855,1077,1340,2620,2869,2111,2358,3642,3891,3129,3376,928,681,419,170,1958,1711,1445,1196,2988,2725,2479,2214,4010,3747,3497,3232,1120,1385,1635,1898,102,367,613,876,3180,3429,3695,3942,2154,2403,2665,2912,1520,1273,2035,1786,502,255,1013,764,3580,3317,4095,3830,2554,2291,3065,2800,1616,1881,1107,1370,598,863,85,348,3676,3925,3167,3414,2650,2899,2137,2384,1984,1737,1475,1226,966,719,453,204,4044,3781,3535,3270,3018,2755,2505,2240,2240,2505,2755,3018,3270,3535,3781,4044,204,453,719,966,1226,1475,1737,1984,2384,2137,2899,2650,3414,3167,3925,3676,348,85,863,598,1370,1107,1881,1616,2800,3065,2291,2554,3830,4095,3317,3580,764,1013,255,502,1786,2035,1273,1520,2912,2665,2403,2154,3942,3695,3429,3180,876,613,367,102,1898,1635,1385,1120,3232,3497,3747,4010,2214,2479,2725,2988,1196,1445,1711,1958,170,419,681,928,3376,3129,3891,3642,2358,2111,2869,2620,1340,1077,1855,1590,314,51,825,560,3728,3993,3219,3482,2710,2975,2197,2460,1692,1941,1183,1430,666,915,153,400,3840,3593,3331,3082,2822,2575,2309,2060,1804,1541,1295,1030,778,515,265,0]),Ta=new Int32Array([-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,8,3,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,1,9,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,1,8,3,9,8,1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,1,2,10,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,8,3,1,2,10,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,9,2,10,0,2,9,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,2,8,3,2,10,8,10,9,8,-1,-1,-1,-1,-1,-1,-1,3,11,2,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,11,2,8,11,0,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,1,9,0,2,3,11,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,1,11,2,1,9,11,9,8,11,-1,-1,-1,-1,-1,-1,-1,3,10,1,11,10,3,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,10,1,0,8,10,8,11,10,-1,-1,-1,-1,-1,-1,-1,3,9,0,3,11,9,11,10,9,-1,-1,-1,-1,-1,-1,-1,9,8,10,10,8,11,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,4,7,8,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,4,3,0,7,3,4,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,1,9,8,4,7,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,4,1,9,4,7,1,7,3,1,-1,-1,-1,-1,-1,-1,-1,1,2,10,8,4,7,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,3,4,7,3,0,4,1,2,10,-1,-1,-1,-1,-1,-1,-1,9,2,10,9,0,2,8,4,7,-1,-1,-1,-1,-1,-1,-1,2,10,9,2,9,7,2,7,3,7,9,4,-1,-1,-1,-1,8,4,7,3,11,2,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,11,4,7,11,2,4,2,0,4,-1,-1,-1,-1,-1,-1,-1,9,0,1,8,4,7,2,3,11,-1,-1,-1,-1,-1,-1,-1,4,7,11,9,4,11,9,11,2,9,2,1,-1,-1,-1,-1,3,10,1,3,11,10,7,8,4,-1,-1,-1,-1,-1,-1,-1,1,11,10,1,4,11,1,0,4,7,11,4,-1,-1,-1,-1,4,7,8,9,0,11,9,11,10,11,0,3,-1,-1,-1,-1,4,7,11,4,11,9,9,11,10,-1,-1,-1,-1,-1,-1,-1,9,5,4,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,9,5,4,0,8,3,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,5,4,1,5,0,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,8,5,4,8,3,5,3,1,5,-1,-1,-1,-1,-1,-1,-1,1,2,10,9,5,4,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,3,0,8,1,2,10,4,9,5,-1,-1,-1,-1,-1,-1,-1,5,2,10,5,4,2,4,0,2,-1,-1,-1,-1,-1,-1,-1,2,10,5,3,2,5,3,5,4,3,4,8,-1,-1,-1,-1,9,5,4,2,3,11,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,11,2,0,8,11,4,9,5,-1,-1,-1,-1,-1,-1,-1,0,5,4,0,1,5,2,3,11,-1,-1,-1,-1,-1,-1,-1,2,1,5,2,5,8,2,8,11,4,8,5,-1,-1,-1,-1,10,3,11,10,1,3,9,5,4,-1,-1,-1,-1,-1,-1,-1,4,9,5,0,8,1,8,10,1,8,11,10,-1,-1,-1,-1,5,4,0,5,0,11,5,11,10,11,0,3,-1,-1,-1,-1,5,4,8,5,8,10,10,8,11,-1,-1,-1,-1,-1,-1,-1,9,7,8,5,7,9,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,9,3,0,9,5,3,5,7,3,-1,-1,-1,-1,-1,-1,-1,0,7,8,0,1,7,1,5,7,-1,-1,-1,-1,-1,-1,-1,1,5,3,3,5,7,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,9,7,8,9,5,7,10,1,2,-1,-1,-1,-1,-1,-1,-1,10,1,2,9,5,0,5,3,0,5,7,3,-1,-1,-1,-1,8,0,2,8,2,5,8,5,7,10,5,2,-1,-1,-1,-1,2,10,5,2,5,3,3,5,7,-1,-1,-1,-1,-1,-1,-1,7,9,5,7,8,9,3,11,2,-1,-1,-1,-1,-1,-1,-1,9,5,7,9,7,2,9,2,0,2,7,11,-1,-1,-1,-1,2,3,11,0,1,8,1,7,8,1,5,7,-1,-1,-1,-1,11,2,1,11,1,7,7,1,5,-1,-1,-1,-1,-1,-1,-1,9,5,8,8,5,7,10,1,3,10,3,11,-1,-1,-1,-1,5,7,0,5,0,9,7,11,0,1,0,10,11,10,0,-1,11,10,0,11,0,3,10,5,0,8,0,7,5,7,0,-1,11,10,5,7,11,5,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,10,6,5,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,8,3,5,10,6,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,9,0,1,5,10,6,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,1,8,3,1,9,8,5,10,6,-1,-1,-1,-1,-1,-1,-1,1,6,5,2,6,1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,1,6,5,1,2,6,3,0,8,-1,-1,-1,-1,-1,-1,-1,9,6,5,9,0,6,0,2,6,-1,-1,-1,-1,-1,-1,-1,5,9,8,5,8,2,5,2,6,3,2,8,-1,-1,-1,-1,2,3,11,10,6,5,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,11,0,8,11,2,0,10,6,5,-1,-1,-1,-1,-1,-1,-1,0,1,9,2,3,11,5,10,6,-1,-1,-1,-1,-1,-1,-1,5,10,6,1,9,2,9,11,2,9,8,11,-1,-1,-1,-1,6,3,11,6,5,3,5,1,3,-1,-1,-1,-1,-1,-1,-1,0,8,11,0,11,5,0,5,1,5,11,6,-1,-1,-1,-1,3,11,6,0,3,6,0,6,5,0,5,9,-1,-1,-1,-1,6,5,9,6,9,11,11,9,8,-1,-1,-1,-1,-1,-1,-1,5,10,6,4,7,8,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,4,3,0,4,7,3,6,5,10,-1,-1,-1,-1,-1,-1,-1,1,9,0,5,10,6,8,4,7,-1,-1,-1,-1,-1,-1,-1,10,6,5,1,9,7,1,7,3,7,9,4,-1,-1,-1,-1,6,1,2,6,5,1,4,7,8,-1,-1,-1,-1,-1,-1,-1,1,2,5,5,2,6,3,0,4,3,4,7,-1,-1,-1,-1,8,4,7,9,0,5,0,6,5,0,2,6,-1,-1,-1,-1,7,3,9,7,9,4,3,2,9,5,9,6,2,6,9,-1,3,11,2,7,8,4,10,6,5,-1,-1,-1,-1,-1,-1,-1,5,10,6,4,7,2,4,2,0,2,7,11,-1,-1,-1,-1,0,1,9,4,7,8,2,3,11,5,10,6,-1,-1,-1,-1,9,2,1,9,11,2,9,4,11,7,11,4,5,10,6,-1,8,4,7,3,11,5,3,5,1,5,11,6,-1,-1,-1,-1,5,1,11,5,11,6,1,0,11,7,11,4,0,4,11,-1,0,5,9,0,6,5,0,3,6,11,6,3,8,4,7,-1,6,5,9,6,9,11,4,7,9,7,11,9,-1,-1,-1,-1,10,4,9,6,4,10,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,4,10,6,4,9,10,0,8,3,-1,-1,-1,-1,-1,-1,-1,10,0,1,10,6,0,6,4,0,-1,-1,-1,-1,-1,-1,-1,8,3,1,8,1,6,8,6,4,6,1,10,-1,-1,-1,-1,1,4,9,1,2,4,2,6,4,-1,-1,-1,-1,-1,-1,-1,3,0,8,1,2,9,2,4,9,2,6,4,-1,-1,-1,-1,0,2,4,4,2,6,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,8,3,2,8,2,4,4,2,6,-1,-1,-1,-1,-1,-1,-1,10,4,9,10,6,4,11,2,3,-1,-1,-1,-1,-1,-1,-1,0,8,2,2,8,11,4,9,10,4,10,6,-1,-1,-1,-1,3,11,2,0,1,6,0,6,4,6,1,10,-1,-1,-1,-1,6,4,1,6,1,10,4,8,1,2,1,11,8,11,1,-1,9,6,4,9,3,6,9,1,3,11,6,3,-1,-1,-1,-1,8,11,1,8,1,0,11,6,1,9,1,4,6,4,1,-1,3,11,6,3,6,0,0,6,4,-1,-1,-1,-1,-1,-1,-1,6,4,8,11,6,8,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,7,10,6,7,8,10,8,9,10,-1,-1,-1,-1,-1,-1,-1,0,7,3,0,10,7,0,9,10,6,7,10,-1,-1,-1,-1,10,6,7,1,10,7,1,7,8,1,8,0,-1,-1,-1,-1,10,6,7,10,7,1,1,7,3,-1,-1,-1,-1,-1,-1,-1,1,2,6,1,6,8,1,8,9,8,6,7,-1,-1,-1,-1,2,6,9,2,9,1,6,7,9,0,9,3,7,3,9,-1,7,8,0,7,0,6,6,0,2,-1,-1,-1,-1,-1,-1,-1,7,3,2,6,7,2,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,2,3,11,10,6,8,10,8,9,8,6,7,-1,-1,-1,-1,2,0,7,2,7,11,0,9,7,6,7,10,9,10,7,-1,1,8,0,1,7,8,1,10,7,6,7,10,2,3,11,-1,11,2,1,11,1,7,10,6,1,6,7,1,-1,-1,-1,-1,8,9,6,8,6,7,9,1,6,11,6,3,1,3,6,-1,0,9,1,11,6,7,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,7,8,0,7,0,6,3,11,0,11,6,0,-1,-1,-1,-1,7,11,6,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,7,6,11,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,3,0,8,11,7,6,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,1,9,11,7,6,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,8,1,9,8,3,1,11,7,6,-1,-1,-1,-1,-1,-1,-1,10,1,2,6,11,7,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,1,2,10,3,0,8,6,11,7,-1,-1,-1,-1,-1,-1,-1,2,9,0,2,10,9,6,11,7,-1,-1,-1,-1,-1,-1,-1,6,11,7,2,10,3,10,8,3,10,9,8,-1,-1,-1,-1,7,2,3,6,2,7,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,7,0,8,7,6,0,6,2,0,-1,-1,-1,-1,-1,-1,-1,2,7,6,2,3,7,0,1,9,-1,-1,-1,-1,-1,-1,-1,1,6,2,1,8,6,1,9,8,8,7,6,-1,-1,-1,-1,10,7,6,10,1,7,1,3,7,-1,-1,-1,-1,-1,-1,-1,10,7,6,1,7,10,1,8,7,1,0,8,-1,-1,-1,-1,0,3,7,0,7,10,0,10,9,6,10,7,-1,-1,-1,-1,7,6,10,7,10,8,8,10,9,-1,-1,-1,-1,-1,-1,-1,6,8,4,11,8,6,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,3,6,11,3,0,6,0,4,6,-1,-1,-1,-1,-1,-1,-1,8,6,11,8,4,6,9,0,1,-1,-1,-1,-1,-1,-1,-1,9,4,6,9,6,3,9,3,1,11,3,6,-1,-1,-1,-1,6,8,4,6,11,8,2,10,1,-1,-1,-1,-1,-1,-1,-1,1,2,10,3,0,11,0,6,11,0,4,6,-1,-1,-1,-1,4,11,8,4,6,11,0,2,9,2,10,9,-1,-1,-1,-1,10,9,3,10,3,2,9,4,3,11,3,6,4,6,3,-1,8,2,3,8,4,2,4,6,2,-1,-1,-1,-1,-1,-1,-1,0,4,2,4,6,2,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,1,9,0,2,3,4,2,4,6,4,3,8,-1,-1,-1,-1,1,9,4,1,4,2,2,4,6,-1,-1,-1,-1,-1,-1,-1,8,1,3,8,6,1,8,4,6,6,10,1,-1,-1,-1,-1,10,1,0,10,0,6,6,0,4,-1,-1,-1,-1,-1,-1,-1,4,6,3,4,3,8,6,10,3,0,3,9,10,9,3,-1,10,9,4,6,10,4,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,4,9,5,7,6,11,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,8,3,4,9,5,11,7,6,-1,-1,-1,-1,-1,-1,-1,5,0,1,5,4,0,7,6,11,-1,-1,-1,-1,-1,-1,-1,11,7,6,8,3,4,3,5,4,3,1,5,-1,-1,-1,-1,9,5,4,10,1,2,7,6,11,-1,-1,-1,-1,-1,-1,-1,6,11,7,1,2,10,0,8,3,4,9,5,-1,-1,-1,-1,7,6,11,5,4,10,4,2,10,4,0,2,-1,-1,-1,-1,3,4,8,3,5,4,3,2,5,10,5,2,11,7,6,-1,7,2,3,7,6,2,5,4,9,-1,-1,-1,-1,-1,-1,-1,9,5,4,0,8,6,0,6,2,6,8,7,-1,-1,-1,-1,3,6,2,3,7,6,1,5,0,5,4,0,-1,-1,-1,-1,6,2,8,6,8,7,2,1,8,4,8,5,1,5,8,-1,9,5,4,10,1,6,1,7,6,1,3,7,-1,-1,-1,-1,1,6,10,1,7,6,1,0,7,8,7,0,9,5,4,-1,4,0,10,4,10,5,0,3,10,6,10,7,3,7,10,-1,7,6,10,7,10,8,5,4,10,4,8,10,-1,-1,-1,-1,6,9,5,6,11,9,11,8,9,-1,-1,-1,-1,-1,-1,-1,3,6,11,0,6,3,0,5,6,0,9,5,-1,-1,-1,-1,0,11,8,0,5,11,0,1,5,5,6,11,-1,-1,-1,-1,6,11,3,6,3,5,5,3,1,-1,-1,-1,-1,-1,-1,-1,1,2,10,9,5,11,9,11,8,11,5,6,-1,-1,-1,-1,0,11,3,0,6,11,0,9,6,5,6,9,1,2,10,-1,11,8,5,11,5,6,8,0,5,10,5,2,0,2,5,-1,6,11,3,6,3,5,2,10,3,10,5,3,-1,-1,-1,-1,5,8,9,5,2,8,5,6,2,3,8,2,-1,-1,-1,-1,9,5,6,9,6,0,0,6,2,-1,-1,-1,-1,-1,-1,-1,1,5,8,1,8,0,5,6,8,3,8,2,6,2,8,-1,1,5,6,2,1,6,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,1,3,6,1,6,10,3,8,6,5,6,9,8,9,6,-1,10,1,0,10,0,6,9,5,0,5,6,0,-1,-1,-1,-1,0,3,8,5,6,10,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,10,5,6,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,11,5,10,7,5,11,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,11,5,10,11,7,5,8,3,0,-1,-1,-1,-1,-1,-1,-1,5,11,7,5,10,11,1,9,0,-1,-1,-1,-1,-1,-1,-1,10,7,5,10,11,7,9,8,1,8,3,1,-1,-1,-1,-1,11,1,2,11,7,1,7,5,1,-1,-1,-1,-1,-1,-1,-1,0,8,3,1,2,7,1,7,5,7,2,11,-1,-1,-1,-1,9,7,5,9,2,7,9,0,2,2,11,7,-1,-1,-1,-1,7,5,2,7,2,11,5,9,2,3,2,8,9,8,2,-1,2,5,10,2,3,5,3,7,5,-1,-1,-1,-1,-1,-1,-1,8,2,0,8,5,2,8,7,5,10,2,5,-1,-1,-1,-1,9,0,1,5,10,3,5,3,7,3,10,2,-1,-1,-1,-1,9,8,2,9,2,1,8,7,2,10,2,5,7,5,2,-1,1,3,5,3,7,5,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,8,7,0,7,1,1,7,5,-1,-1,-1,-1,-1,-1,-1,9,0,3,9,3,5,5,3,7,-1,-1,-1,-1,-1,-1,-1,9,8,7,5,9,7,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,5,8,4,5,10,8,10,11,8,-1,-1,-1,-1,-1,-1,-1,5,0,4,5,11,0,5,10,11,11,3,0,-1,-1,-1,-1,0,1,9,8,4,10,8,10,11,10,4,5,-1,-1,-1,-1,10,11,4,10,4,5,11,3,4,9,4,1,3,1,4,-1,2,5,1,2,8,5,2,11,8,4,5,8,-1,-1,-1,-1,0,4,11,0,11,3,4,5,11,2,11,1,5,1,11,-1,0,2,5,0,5,9,2,11,5,4,5,8,11,8,5,-1,9,4,5,2,11,3,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,2,5,10,3,5,2,3,4,5,3,8,4,-1,-1,-1,-1,5,10,2,5,2,4,4,2,0,-1,-1,-1,-1,-1,-1,-1,3,10,2,3,5,10,3,8,5,4,5,8,0,1,9,-1,5,10,2,5,2,4,1,9,2,9,4,2,-1,-1,-1,-1,8,4,5,8,5,3,3,5,1,-1,-1,-1,-1,-1,-1,-1,0,4,5,1,0,5,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,8,4,5,8,5,3,9,0,5,0,3,5,-1,-1,-1,-1,9,4,5,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,4,11,7,4,9,11,9,10,11,-1,-1,-1,-1,-1,-1,-1,0,8,3,4,9,7,9,11,7,9,10,11,-1,-1,-1,-1,1,10,11,1,11,4,1,4,0,7,4,11,-1,-1,-1,-1,3,1,4,3,4,8,1,10,4,7,4,11,10,11,4,-1,4,11,7,9,11,4,9,2,11,9,1,2,-1,-1,-1,-1,9,7,4,9,11,7,9,1,11,2,11,1,0,8,3,-1,11,7,4,11,4,2,2,4,0,-1,-1,-1,-1,-1,-1,-1,11,7,4,11,4,2,8,3,4,3,2,4,-1,-1,-1,-1,2,9,10,2,7,9,2,3,7,7,4,9,-1,-1,-1,-1,9,10,7,9,7,4,10,2,7,8,7,0,2,0,7,-1,3,7,10,3,10,2,7,4,10,1,10,0,4,0,10,-1,1,10,2,8,7,4,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,4,9,1,4,1,7,7,1,3,-1,-1,-1,-1,-1,-1,-1,4,9,1,4,1,7,0,8,1,8,7,1,-1,-1,-1,-1,4,0,3,7,4,3,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,4,8,7,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,9,10,8,10,11,8,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,3,0,9,3,9,11,11,9,10,-1,-1,-1,-1,-1,-1,-1,0,1,10,0,10,8,8,10,11,-1,-1,-1,-1,-1,-1,-1,3,1,10,11,3,10,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,1,2,11,1,11,9,9,11,8,-1,-1,-1,-1,-1,-1,-1,3,0,9,3,9,11,1,2,9,2,11,9,-1,-1,-1,-1,0,2,11,8,0,11,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,3,2,11,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,2,3,8,2,8,10,10,8,9,-1,-1,-1,-1,-1,-1,-1,9,10,2,0,9,2,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,2,3,8,2,8,10,0,1,8,1,10,8,-1,-1,-1,-1,1,10,2,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,1,3,8,9,1,8,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,9,1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,3,8,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1]),Bf={uFurFade:{value:1}},kx=`
  float furHash(vec3 p) { p = fract(p * 0.1031); p += dot(p, p.zyx + 31.32); return fract((p.x + p.y) * p.z); }
  float furNoise(vec3 p) { vec3 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f);
    return mix(mix(mix(furHash(i), furHash(i + vec3(1, 0, 0)), f.x), mix(furHash(i + vec3(0, 1, 0)), furHash(i + vec3(1, 1, 0)), f.x), f.y),
               mix(mix(furHash(i + vec3(0, 0, 1)), furHash(i + vec3(1, 0, 1)), f.x), mix(furHash(i + vec3(0, 1, 1)), furHash(i + vec3(1, 1, 1)), f.x), f.y), f.z); }`;function Hx(i,t){const e=new vi({vertexColors:!0,roughness:t.feather?.75:.92,metalness:0}),n={uH:{value:i},uFurLen:{value:t.length},uFurDensity:{value:t.density},uFurTip:{value:t.tip},uFeather:{value:t.feather?1:0}};return e.onBeforeCompile=r=>{Object.assign(r.uniforms,n,Bf),r.vertexShader=r.vertexShader.replace("#include <common>",`#include <common>
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
        ${kx}`).replace("#include <color_fragment>",`#include <color_fragment>
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
        diffuseColor.rgb = mix(diffuseColor.rgb, diffuseColor.rgb * 1.25 + 0.06, uFurTip * smoothstep(0.6, 1.0, t));`)},e.customProgramCacheKey=()=>"kaiju-fur-v2",e}function zx(i,t,e,n){const r=[];for(let s=1;s<=n;s++){const a=new wf(t,Hx(s/n,e));a.castShadow=!1,a.receiveShadow=!0,a.frustumCulled=!1,a.userData.h=s/n,i.add(a),a.bind(i.skeleton,i.bindMatrix),r.push(a)}return r}function Vx(i=512){const t=document.createElement("canvas");t.width=t.height=i;const e=t.getContext("2d"),n=document.createElement("canvas");n.width=n.height=i;const r=n.getContext("2d"),s=e.createImageData(i,i),a=r.createImageData(i,i),o=22,c=[];let l=7;const h=()=>(l=l*1664525+1013904223>>>0,l/4294967296);for(let f=0;f<o;f++)for(let g=0;g<o;g++)c.push([(g+.2+h()*.6)/o,(f+.2+h()*.6)/o,.7+h()*.3]);for(let f=0;f<i;f++)for(let g=0;g<i;g++){const v=g/i,m=f/i,p=Math.floor(v*o),b=Math.floor(m*o);let y=9,_=9,E=1;for(let T=-1;T<=1;T++)for(let D=-1;D<=1;D++){const U=(p+D+o)%o,N=(b+T+o)%o,z=c[N*o+U];let $=v-z[0],V=m-z[1];$-=Math.round($),V-=Math.round(V);const tt=Math.sqrt($*$+V*V);tt<y?(_=y,y=tt,E=z[2]):tt<_&&(_=tt)}const w=_-y,A=Math.min(1,w/.02),R=1-Math.min(1,y/(.55/o)),x=(.55+.45*A)*E*(.85+.3*R),M=(f*i+g)*4;s.data[M]=255*x,s.data[M+1]=255*x,s.data[M+2]=255*x,s.data[M+3]=255;const S=.55+.4*(1-A)-.15*R;a.data[M]=255*S,a.data[M+1]=255*S,a.data[M+2]=255*S,a.data[M+3]=255}e.putImageData(s,0,0),r.putImageData(a,0,0);const u=new Ch(t);u.wrapS=u.wrapT=os,u.colorSpace=Qn;const d=new Ch(n);return d.wrapS=d.wrapT=os,{map:u,rough:d}}let Aa=null;function Gx(i=!1,t){if(i)return Wx();if(t==="armour")return new vi({vertexColors:!0,roughness:.42,metalness:.45});if(t==="soft")return new vi({vertexColors:!0,roughness:.82,metalness:0});if(t==="suit")return new vi({vertexColors:!0,roughness:.34,metalness:.18});!Aa&&typeof document<"u"&&(Aa=Vx());const e=new vi({vertexColors:!0,roughness:.7,metalness:.02});return e.onBeforeCompile=n=>{n.uniforms.uScales={value:Aa?.map??null},n.uniforms.uRough={value:Aa?.rough??null},n.vertexShader=n.vertexShader.replace("#include <common>",`#include <common>
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
        float roughTex = triplanar(uRough, vBind, bn, sc).r;`).replace("#include <roughnessmap_fragment>","float roughnessFactor = mix(roughTex, 0.9, isBone);")},e.customProgramCacheKey=()=>"kaiju-v1",e}function Wx(){const i=new vi({vertexColors:!0,roughness:.95,metalness:0});return i.onBeforeCompile=t=>{Object.assign(t.uniforms,Bf),t.fragmentShader=t.fragmentShader.replace("#include <common>",`#include <common>
 uniform float uFurFade;`).replace("#include <color_fragment>",`#include <color_fragment>
 diffuseColor.rgb *= mix(1.0, 0.6, uFurFade);`)},i.customProgramCacheKey=()=>"kaiju-undercoat-v1",i}function $c(i){const t=new Le;return t.setAttribute("position",new ie(i.position,3)),t.setAttribute("normal",new ie(i.normal,3)),t.setAttribute("color",new ie(i.color,3)),i.aFur&&t.setAttribute("aFur",new ie(i.aFur,1)),t.setAttribute("skinIndex",new ie(i.skinIndex,4)),t.setAttribute("skinWeight",new ie(i.skinWeight,4)),t}function ru(i,t,e){return $c(Xx(i,t,e))}function Xx(i,t,e){const n=i.box,r=(n.min[0]+n.max[0])/2,s=(n.min[1]+n.max[1])/2,a=(n.min[2]+n.max[2])/2,o=(n.max[0]-n.min[0])/2,c=(n.max[1]-n.min[1])/2,l=(n.max[2]-n.min[2])/2,h=new Of(e,new Yi,!1,!1,4e5);h.isolation=50;const u=h.field,d=e;for(let S=0;S<d;S++){const T=a+(S/(d-1)*2-1)*l;for(let D=0;D<d;D++){const U=s+(D/(d-1)*2-1)*c;for(let N=0;N<d;N++){const z=r+(N/(d-1)*2-1)*o;u[S*d*d+D*d+N]=Math.max(0,Math.min(100,50-i.sdf(z,U,T)*40))}}}h.update();const f=h.count,g=new Float32Array(f*3),v=new Float32Array(f*3),m=new Float32Array(f*3),p=h.positionArray,b=h.normalArray,y=i.palette.map(S=>new Ut(S)),_=new Ut;for(let S=0;S<f;S++){const T=r+p[S*3]*o,D=s+p[S*3+1]*c,U=a+p[S*3+2]*l;g[S*3]=T,g[S*3+1]=D,g[S*3+2]=U;let N=b[S*3]/o,z=b[S*3+1]/c,$=b[S*3+2]/l;const V=Math.hypot(N,z,$)||1;N/=V,z/=V,$/=V,v[S*3]=N,v[S*3+1]=z,v[S*3+2]=$;const tt=i.region(T,D,U);_.copy(y[tt]??y[0]),i.tint?.(tt,T,D,U,_);const rt=.94+.06*Math.sin(D*1.7+U*.9)*Math.cos(T*2.3);m[S*3]=_.r*rt,m[S*3+1]=_.g*rt,m[S*3+2]=_.b*rt}h.geometry.dispose();let E;if(i.fur){E=new Float32Array(f);for(let S=0;S<f;S++)E[S]=i.furLen?i.furLen(g[S*3],g[S*3+1],g[S*3+2]):1}const w=new Uint16Array(f*4),A=new Float32Array(f*4),R=t.map((S,T)=>({i:T,a:S.a,b:S.b,reach:S.reach??1/0,name:S.name})),x=i.capture,M=i.weights??"sharp";for(let S=0;S<f;S++){const T=g[S*3],D=g[S*3+1],U=g[S*3+2];let N=1/0,z=1/0,$=0,V=0;for(const xt of R){if(x&&!x(xt,T,D,U))continue;const Ct=xt.b[0]-xt.a[0],Ot=xt.b[1]-xt.a[1],nt=xt.b[2]-xt.a[2],W=T-xt.a[0],K=D-xt.a[1],F=U-xt.a[2],k=Math.max(0,Math.min(1,(W*Ct+K*Ot+F*nt)/(Ct*Ct+Ot*Ot+nt*nt||1))),H=Math.hypot(W-Ct*k,K-Ot*k,F-nt*k);H>xt.reach||(H<N?(z=N,V=$,N=H,$=xt.i):H<z&&(z=H,V=xt.i))}isFinite(z)||(z=N,V=$);const tt=M==="rigid"?1:M==="soft"?1/Math.pow(N+1.2,2):1/Math.pow(N+.3,4),rt=M==="rigid"?0:M==="soft"?1/Math.pow(z+1.2,2):1/Math.pow(z+.3,4),lt=tt+rt;w[S*4]=$,w[S*4+1]=V,A[S*4]=tt/lt,A[S*4+1]=rt/lt}return{position:g,normal:v,color:m,skinIndex:w,skinWeight:A,aFur:E}}const qx=(i,t=i.res??88)=>({body:t,fur:Math.max(32,Math.round(t*.6))});function Yx(i){const t=new Map;let e=null;for(const n of i){const r=new Ef;if(r.name=n.name,n.parent){const s=i.find(a=>a.name===n.parent);r.position.set(n.a[0]-s.a[0],n.a[1]-s.a[1],n.a[2]-s.a[2]),t.get(n.parent).add(r)}else r.position.set(n.a[0],n.a[1],n.a[2]),e=r;t.set(n.name,r)}return{bones:t,root:e}}function Go(i,t=i.res??88,e){const n=performance.now(),r=qx(i,t),{bones:s,root:a}=Yx(i.segs);let o,c=[];if(i.body){const l=i.body,h=e?$c(e.body):ru(l,i.segs,r.body),u=l.surface==="scales"||l.surface==="fur"?void 0:l.surface,d=new wf(h,Gx(!!l.fur||l.surface==="fur",u));d.castShadow=!0,d.receiveShadow=!0,d.frustumCulled=!1,d.add(a),d.bind(new xl(i.segs.map(f=>s.get(f.name)))),l.fur&&(i.furShells??10)>0&&(c=zx(d,e?.fur?$c(e.fur):ru(l,i.segs,r.fur),l.fur,i.furShells??10)),o=d}else{const l=new Ue;l.add(a),o=l}if(i.dress){const l=new Map;i.dress({bones:s,segs:i.segs,at(h,u,d,f,g){const v=i.segs.find(m=>m.name===u);return h.position.set(d-v.a[0],f-v.a[1],g-v.a[2]),h.traverse(m=>{m.isMesh&&(m.castShadow=!0,m.receiveShadow=!0)}),s.get(u).add(h),h},std(h){const u=JSON.stringify(h);let d=l.get(u);return d||(d=new vi(h),l.set(u,d)),d}})}return o.name=i.id,{def:i,root:o,bones:s,fur:c,ms:performance.now()-n}}const J=(i,t,e)=>{const n=Math.max(e-Math.abs(i-t),0)/e;return Math.min(i,t)-n*n*e*.25};function _e(i,t,e,n,r,s,a){const o=i-n,c=t-r,l=e-s;return Math.sqrt(o*o+c*c+l*l)-a}function ft(i,t,e,n,r,s,a,o,c,l,h){const u=a-n,d=o-r,f=c-s,g=i-n,v=t-r,m=e-s,p=Math.max(0,Math.min(1,(g*u+v*d+m*f)/(u*u+d*d+f*f))),b=g-u*p,y=v-d*p,_=m-f*p;return Math.sqrt(b*b+y*y+_*_)-(l+(h-l)*p)}function Lt(i,t,e,n,r,s,a,o,c){const l=(i-n)/a,h=(t-r)/o,u=(e-s)/c,d=Math.sqrt(l*l+h*h+u*u),f=Math.sqrt(l*l/a+h*h/o+u*u/c);return f>0?d*(d-1)/f:-Math.min(a,o,c)}const gr=2.1,jr=[1.95,6,.2],ni=[gr,3.4,.55],lr=[gr,1,0],su=[gr,.3,2],jn=[2.9,11,.8],bn=[4.99,10.54,1.28],Wi=[6.76,10.06,1.79],on=[[0,6.6,-2.6],[.5,4.6,-4.4],[1.6,2.4,-5.3],[3,1.1,-5.2],[4.5,.85,-4.1]],au=[1.15,1.45,1.4,1.2,.75],xe=[0,14.4,.6],$x=[{name:"pelvis",a:[0,6,0],b:[0,7.6,0],parent:null},{name:"spine1",a:[0,7.6,0],b:[0,9.4,.1],parent:"pelvis"},{name:"spine2",a:[0,9.4,.1],b:[0,11.4,.1],parent:"spine1"},{name:"neck",a:[0,11.4,.1],b:[0,xe[1]-1.6,xe[2]-.25],parent:"spine2"},{name:"head",a:[0,xe[1]-1.6,xe[2]-.25],b:[0,xe[1]+1.6,xe[2]+.1],parent:"neck"},{name:"jaw",a:[0,xe[1]-1.1,xe[2]+1.1],b:[0,xe[1]-1.2,xe[2]+2.9],parent:"head",reach:0},{name:"tail1",a:on[0],b:on[1],parent:"pelvis"},{name:"tail2",a:on[1],b:on[2],parent:"tail1"},{name:"tail3",a:on[2],b:on[3],parent:"tail2"},{name:"tail4",a:on[3],b:on[4],parent:"tail3"},{name:"thighL",a:jr,b:ni,parent:"pelvis"},{name:"shinL",a:ni,b:lr,parent:"thighL"},{name:"footL",a:lr,b:su,parent:"shinL"},{name:"thighR",a:qn(jr),b:qn(ni),parent:"pelvis"},{name:"shinR",a:qn(ni),b:qn(lr),parent:"thighR"},{name:"footR",a:qn(lr),b:qn(su),parent:"shinR"},{name:"armL",a:jn,b:bn,parent:"spine2"},{name:"forearmL",a:bn,b:Wi,parent:"armL"},{name:"armR",a:qn(jn),b:qn(bn),parent:"spine2"},{name:"forearmR",a:qn(bn),b:qn(Wi),parent:"armR"}];function qn(i){return[-i[0],i[1],i[2]]}const jx={min:[-8.6,-.4,-7.2],max:[8.6,18.4,5.8]},cn=[.98,xe[1]+.33,xe[2]+1.97],ur=[0,xe[1]-.5,xe[2]+4.05],zn=Tl(kf(Wi,bn)),Wo=Tl([-zn[2],0,zn[0]]);function kf(i,t){return[i[0]-t[0],i[1]-t[1],i[2]-t[2]]}function Tl(i){const t=Math.hypot(i[0],i[1],i[2]);return[i[0]/t,i[1]/t,i[2]/t]}const us=(i,t,e,n=0)=>[i[0]+zn[0]*t+Wo[0]*e,i[1]+zn[1]*t+Wo[1]*e+n,i[2]+zn[2]*t+Wo[2]*e],Bn=us(Wi,.35,0),Kx=us(Bn,1.3,0),Hf=(i,t,e)=>(i-Wi[0])*zn[0]+(t-Wi[1])*zn[1]+(e-Wi[2])*zn[2],zf=[-.42,-.14,.14,.42].map(i=>[us(Bn,.35,i*1.1),us(Bn,1.15-Math.abs(i)*.5,i*1.35,-.12)]);zf.push([us(Bn,-.1,.45),us(Bn,.45,.95,-.1)]);const Zx=[-.5,-.17,.17,.5].map(i=>[[gr+i*1.1,.3,1.8],[gr+i*1.3,.22,2.7-Math.abs(i)*.4]]),Li=(i,t,e,n,r,s,a)=>ft(i,t,e,n[0],n[1],n[2],r[0],r[1],r[2],s,a),Br=2.5;let ou=NaN,cu=NaN,lu=NaN;const Pi={body:0,head:0,arm:0,leg:0,tail:0,min:0};function qs(i,t,e){if(i===ou&&t===cu&&e===lu)return Pi;ou=i,cu=t,lu=e;const n=Math.abs(i);let r=_e(i,t,e,0,9.2,.2,5.6);r<Br&&(r=Lt(i,t,e,0,7.7,.35,3.85,3.35,3.4),r=J(r,Lt(i,t,e,0,10.3,.3,3,2.1,2.7),1.6),r=J(r,Lt(i,t,e,0,6.9,-1.2,3.4,2.6,2.7),1.2),r=J(r,_e(n,t,e,jn[0],jn[1],jn[2],.85),.7),r=J(r,ft(i,t,e,0,11,.2,0,xe[1]-1.4,xe[2]-.15,2.1,1.7),.8)),Pi.body=r;const s=t-xe[1],a=e-xe[2];let o=_e(i,s,a,0,.6,.5,4.3);o<Br&&(o=Lt(i,s,a,0,0,0,2.38,2.05,2.21),o=J(o,Lt(n,s,a,1.8,-.66,.25,1.15,1.23,1.31),.66),o=J(o,ft(i,s,a,0,-.25,1.48,0,-.57,3.6,1.11,.45),.5),o=J(o,ft(i,s,a,0,-1.07,1.15,0,-1.23,2.95,.78,.41),.33),o=J(o,Lt(n,s,a,1.44,2.05,-.66,.78,1.03,.34),.29),o=Math.max(o,-_e(n,t,e,cn[0]+.05,cn[1],cn[2]+.2,.34))),Pi.head=o;let c=Li(n,t,e,jn,Kx,1.6,1.6);if(c<Br&&(c=Li(n,t,e,jn,bn,.72,.8),c=J(c,_e(n,t,e,(jn[0]+bn[0])/2,(jn[1]+bn[1])/2,(jn[2]+bn[2])/2,.9),.6),c=J(c,Li(n,t,e,bn,Wi,.8,.6),.4),_e(n,t,e,Bn[0],Bn[1],Bn[2],1.6)<Br)){c=J(c,Lt(n,t,e,Bn[0],Bn[1],Bn[2],.62,.38,.62),.3);for(const u of zf)c=J(c,Li(n,t,e,u[0],u[1],.24,.17),.14)}Pi.arm=c;let l=ft(n,t,e,jr[0],jr[1],jr[2],gr,.6,1,2,2);if(l<Br&&(l=Li(n,t,e,jr,ni,1.42,1.1),l=J(l,Li(n,t,e,ni,lr,1.08,.85),.5),t<2.6)){l=J(l,Math.max(Lt(n,t,e,gr,.45,.75,.95,.6,1.75),-t),.45);for(const u of Zx)l=J(l,Li(n,t,e,u[0],u[1],.26,.18),.15)}Pi.leg=l;let h=_e(i,t,e,2,3.4,-4.4,5.4);if(h<Br){h=1e9;for(let u=0;u+1<on.length;u++)h=J(h,Li(i,t,e,on[u],on[u+1],au[u],au[u+1]),.5)}return Pi.tail=h,Pi.min=Math.min(r,o,c,l,h),Pi}function Jx(i,t,e){const n=qs(i,t,e);let r=J(n.body,n.head,.6);return r=J(r,n.arm,.5),r=J(r,n.leg,.7),J(r,n.tail,.6)}function Qx(i,t,e){let n=0,r=1/0,s=0;for(let a=0;a+1<on.length;a++){const o=on[a],c=on[a+1],l=c[0]-o[0],h=c[1]-o[1],u=c[2]-o[2],d=l*l+h*h+u*u,f=Math.max(0,Math.min(1,((i-o[0])*l+(t-o[1])*h+(e-o[2])*u)/d)),g=i-o[0]-l*f,v=t-o[1]-h*f,m=e-o[2]-u*f,p=g*g+v*v+m*m;p<r&&(r=p,n=s+f*Math.sqrt(d)),s+=Math.sqrt(d)}return n}function t_(i,t,e){const n=Math.abs(i);if(Math.hypot(i,t-ur[1],e-ur[2])<.62)return 3;const r=qs(i,t,e),s=r.min;if(r.head===s){const a=t-xe[1],o=e-xe[2];if(o>.2&&a>-1.9){const c=n-1.1,l=a-.22+.32*c;if((c/1.25)**2+(l/.66)**2<1||n<.34&&a>-.35&&a<2.4&&o>.6)return 2;const h=n-1.05,u=a-1.12+.18*h;if((h/1)**2+(u/.4)**2<1||a<-.15+.25*Math.max(0,n-1.2)&&o>.5)return 1}return a>2.75&&n>.98?1:0}if(r.tail===s){const a=Qx(i,t,e);return a>7.9||a%2<.85?2:4}return r.arm===s?Hf(n,t,e)>-.25?5:0:r.leg===s?t<1.3?5:0:e>1.2&&(i/2.4)**2+((t-7.9)/3.1)**2<1?4:0}function e_(i,t,e){const n=Math.abs(i),r=Math.hypot(n-cn[0],t-cn[1],e-cn[2]);if(r<.62||Math.hypot(i,t-ur[1],e-ur[2])<.85)return 0;const s=qs(i,t,e),a=s.min;if(s.head===a){const o=t-xe[1],c=e-xe[2];return o>1.4&&n>.9&&c<.1?.5:n>1.4&&o<0&&c<1.5?1.35:c>1?.35+.4*Math.min(1,(r-.62)/1.3):.9}return s.tail===a?1.4:s.arm===a?Hf(n,t,e)>-.25?.25:.9:s.leg===a?t<1.3?.3:1:1.1}const n_=.15,i_=new Map([["pelvis",0],["spine1",0],["spine2",0],["neck",1],["head",2],["jaw",2],["armL",3],["forearmL",3],["armR",4],["forearmR",4],["thighL",5],["shinL",5],["footL",5],["thighR",6],["shinR",6],["footR",6],["tail1",7],["tail2",7],["tail3",7],["tail4",7]]),Xo=Tl(kf(lr,ni)),r_=new Map([["forearm",(i,t,e)=>(i-bn[0])*zn[0]+(t-bn[1])*zn[1]+(e-bn[2])*zn[2]>-.9],["shin",(i,t,e)=>(i-ni[0])*Xo[0]+(t-ni[1])*Xo[1]+(e-ni[2])*Xo[2]>-.9],["foot",(i,t)=>t<lr[1]+.7]]),Ra=(i,t,e,n)=>{const r=r_.get(i.slice(0,-1));return!r||r(Math.abs(t),e,n)},s_=(i,t,e,n)=>{const r=qs(t,e,n),s=r.min+n_;switch(i_.get(i.name)){case 0:return r.body<=s;case 1:return e>10.6&&(r.body<=s&&Math.abs(t)<2.4||r.head<=s&&e<xe[1]-1.6);case 2:return r.head<=s&&e>xe[1]-2.1||r.body<=s&&e>12&&Math.abs(t)<2;case 3:return r.arm<=s&&t>.5&&Ra(i.name,t,e,n);case 4:return r.arm<=s&&t<-.5&&Ra(i.name,t,e,n);case 5:return r.leg<=s&&t>.2&&Ra(i.name,t,e,n);case 6:return r.leg<=s&&t<-.2&&Ra(i.name,t,e,n);case 7:return r.tail<=s;default:return!0}},a_={id:"jimothy",name:"Jimothy",blurb:"The round Seattle raccoon, standing up",segs:$x,body:{sdf:Jx,region:t_,box:jx,palette:[7103837,15130834,1841431,657930,9406332,3814192],weights:"soft",capture:s_,fur:{length:1,density:7,tip:.18},furLen:e_,tint(i,t,e,n,r){if(i!==0)return;n<-.5&&r.multiplyScalar(1-.2*Math.min(1,(-.5-n)/2.5));const s=qs(t,e,n);(s.arm===s.min||s.leg===s.min)&&r.multiplyScalar(.82)}},dress(i){const t=i.std({color:328965,roughness:.06,metalness:.1});for(const n of[-1,1])i.at(new Pt(new Se(.34,14,10),t),"head",n*cn[0],cn[1],cn[2]);const e=new Pt(new Se(.42,14,10),i.std({color:657930,roughness:.25}));e.scale.set(1.15,.8,.75),i.at(e,"head",ur[0],ur[1],ur[2])},fit:{size:1.05,limb:.5},face:{eyes:[[cn[0],cn[1],cn[2]+.18,.36],[-.98,cn[1],cn[2]+.18,.36]]},idle:{tail:.15},res:84,furShells:8};function Al(i,t=!1){const e=i[0].index!==null,n=new Set(Object.keys(i[0].attributes)),r=new Set(Object.keys(i[0].morphAttributes)),s={},a={},o=i[0].morphTargetsRelative,c=new Le;let l=0;for(let h=0;h<i.length;++h){const u=i[h];let d=0;if(e!==(u.index!==null))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". All geometries must have compatible attributes; make sure index attribute exists among all geometries, or in none of them."),null;for(const f in u.attributes){if(!n.has(f))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+'. All geometries must have compatible attributes; make sure "'+f+'" attribute exists among all geometries, or in none of them.'),null;s[f]===void 0&&(s[f]=[]),s[f].push(u.attributes[f]),d++}if(d!==n.size)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". Make sure all geometries have the same number of attributes."),null;if(o!==u.morphTargetsRelative)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". .morphTargetsRelative must be consistent throughout all geometries."),null;for(const f in u.morphAttributes){if(!r.has(f))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+".  .morphAttributes must be consistent throughout all geometries."),null;a[f]===void 0&&(a[f]=[]),a[f].push(u.morphAttributes[f])}if(t){let f;if(e)f=u.index.count;else if(u.attributes.position!==void 0)f=u.attributes.position.count;else return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". The geometry must have either an index or a position attribute"),null;c.addGroup(l,f,h),l+=f}}if(e){let h=0;const u=[];for(let d=0;d<i.length;++d){const f=i[d].index;for(let g=0;g<f.count;++g)u.push(f.getX(g)+h);h+=i[d].attributes.position.count}c.setIndex(u)}for(const h in s){const u=hu(s[h]);if(!u)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+h+" attribute."),null;c.setAttribute(h,u)}for(const h in a){const u=a[h][0].length;if(u===0)break;c.morphAttributes=c.morphAttributes||{},c.morphAttributes[h]=[];for(let d=0;d<u;++d){const f=[];for(let v=0;v<a[h].length;++v)f.push(a[h][v][d]);const g=hu(f);if(!g)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+h+" morphAttribute."),null;c.morphAttributes[h].push(g)}}return c}function hu(i){let t,e,n,r=-1,s=0;for(let l=0;l<i.length;++l){const h=i[l];if(t===void 0&&(t=h.array.constructor),t!==h.array.constructor)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.array must be of consistent array types across matching attributes."),null;if(e===void 0&&(e=h.itemSize),e!==h.itemSize)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.itemSize must be consistent across matching attributes."),null;if(n===void 0&&(n=h.normalized),n!==h.normalized)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.normalized must be consistent across matching attributes."),null;if(r===-1&&(r=h.gpuType),r!==h.gpuType)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.gpuType must be consistent across matching attributes."),null;s+=h.count*e}const a=new t(s),o=new ie(a,e,n);let c=0;for(let l=0;l<i.length;++l){const h=i[l];if(h.isInterleavedBufferAttribute){const u=c/e;for(let d=0,f=h.count;d<f;d++)for(let g=0;g<e;g++){const v=h.getComponent(d,g);o.setComponent(d+u,g,v)}}else a.set(h.array,c);c+=h.count*e}return r!==void 0&&(o.gpuType=r),o}const Kn=2.75,o_=[{name:"pelvis",a:[0,9.6,0],b:[0,10.8,0],parent:null},{name:"spine1",a:[0,10.8,0],b:[0,12.6,0],parent:"pelvis"},{name:"spine2",a:[0,12.6,0],b:[0,15,0],parent:"spine1"},{name:"neck",a:[0,15,0],b:[0,15.9,0],parent:"spine2"},{name:"head",a:[0,15.9,0],b:[0,18.4,0],parent:"neck"},{name:"jaw",a:[0,16.5,1],b:[0,16.5,1.3],parent:"head",reach:0},{name:"tail1",a:[0,9.4,-.8],b:[0,9.2,-1.2],parent:"pelvis",reach:0},{name:"tail2",a:[0,9.2,-1.2],b:[0,9,-1.6],parent:"tail1",reach:0},{name:"tail3",a:[0,9,-1.6],b:[0,8.8,-2],parent:"tail2",reach:0},{name:"tail4",a:[0,8.8,-2],b:[0,8.6,-2.4],parent:"tail3",reach:0},{name:"thighL",a:[.95,9.6,0],b:[.95,5.3,0],parent:"pelvis"},{name:"shinL",a:[.95,5.3,0],b:[.95,1.2,0],parent:"thighL"},{name:"footL",a:[.95,1.2,0],b:[.95,.4,1.5],parent:"shinL"},{name:"thighR",a:[-.95,9.6,0],b:[-.95,5.3,0],parent:"pelvis"},{name:"shinR",a:[-.95,5.3,0],b:[-.95,1.2,0],parent:"thighR"},{name:"footR",a:[-.95,1.2,0],b:[-.95,.4,1.5],parent:"shinR"},{name:"armL",a:[Kn,14.4,0],b:[Kn,11.9,0],parent:"spine2"},{name:"forearmL",a:[Kn,11.9,0],b:[Kn,9.5,0],parent:"armL"},{name:"armR",a:[-Kn,14.4,0],b:[-Kn,11.9,0],parent:"spine2"},{name:"forearmR",a:[-Kn,11.9,0],b:[-Kn,9.5,0],parent:"armR"}],Je={y:17.15,a:1.4,b:1.22},uu=.3,jc=[{y0:.45,y1:5.4,r0:6,r1:2.9,n:13,bone:"pelvis",baubles:!0,garland:!0,lights:[.62,.3]},{y0:3.8,y1:8.4,r0:5.2,r1:2.5,n:12,bone:"pelvis",turn:.3,baubles:!0,garland:!0,lights:[.62,.3]},{y0:6.7,y1:11,r0:4.45,r1:2.15,n:11,bone:"pelvis",baubles:!0,garland:!0,lights:[.62,.3]},{y0:9.4,y1:13,r0:3.8,r1:1.8,n:9,bone:"spine1",turn:.2,baubles:!0,garland:!0,lights:[.62,.3]},{y0:11.7,y1:14.8,r0:3.25,r1:1.6,n:8,bone:"spine2",baubles:!0,garland:!0,lights:[.62,.3]},{y0:13.5,y1:16.2,r0:2.9,r1:1.45,n:8,bone:"spine2",turn:.4,baubles:!0,garland:!0,lights:[.6,.28]},{y0:15,y1:19.1,r0:2.75,r1:1.35,n:8,bone:"head",flare:.85,k:3,rows:16,hole:Je,baubles:!0},{y0:18.55,y1:20.3,r0:1.8,r1:.6,n:6,bone:"head",turn:Math.PI/6,baubles:!0,garland:!0,lights:[.62,.25]}];function fu(i){const t=i*Kn,e=i>0?"L":"R";return[{y0:12.1,y1:14.9,r0:1.3,r1:.55,n:7,bone:"arm"+e,x:t,drop:.35,rows:2},{y0:10.6,y1:12.7,r0:1.15,r1:.5,n:7,bone:"forearm"+e,x:t,turn:.4,drop:.32,rows:2},{y0:9.1,y1:11.3,r0:.95,r1:.42,n:6,bone:"forearm"+e,x:t,drop:.3,rows:2},{y0:7.7,y1:9.8,r0:.72,r1:.3,n:5,bone:"forearm"+e,x:t,turn:.3,drop:.25,rows:2}]}const Vf=.5,c_=1.4,l_=4168267,h_=1195289,ts=(i,t)=>i.r1+(i.r0-i.r1)*Math.pow(Math.min(1,Math.max(0,1-t)),i.flare??c_),Va=(i,t)=>(t-i.y0)/(i.y1-i.y0),Gf=(i,t,e,n,r=0)=>n>0&&(t/(i.a+r))**2+((e-i.y)/(i.b+r))**2<1;function u_(i){const t=i.k??1,e=i.n*2*t,n=i.y1-i.y0,r=(i.y0+i.y1)/2,s=i.x??0,a=i.turn??0,o=new Sn(i.r1,i.r0,n,e,i.rows??4,!0),c=o.attributes.position,l=new Float32Array(c.count*3),h=new Ut(l_),u=new Ut(h_),d=new Ut;for(let f=0;f<c.count;f++){const g=c.getX(f),v=c.getY(f),m=c.getZ(f),p=(v+n/2)/n,b=Math.atan2(g,m);let y=ts(i,p),_=0;if(p<1e-4){const E=Math.round(b/(Math.PI*2/e)),w=(E%(2*t)+2*t)%(2*t),A=1-Math.min(w,2*t-w)/t;_=-(i.drop??Vf)*A,y*=1+.05*A}c.setXYZ(f,s+Math.sin(b+a)*y,r+v+_,Math.cos(b+a)*y),d.copy(h).lerp(u,Math.pow(Math.min(1,Math.max(0,p)),.8)),l[f*3]=d.r,l[f*3+1]=d.g,l[f*3+2]=d.b}if(o.setAttribute("color",new ie(l,3)),i.hole){const f=o.index.array,g=[];for(let v=0;v<f.length;v+=3){const m=f[v],p=f[v+1],b=f[v+2],y=(c.getX(m)+c.getX(p)+c.getX(b))/3,_=(c.getY(m)+c.getY(p)+c.getY(b))/3,E=(c.getZ(m)+c.getZ(p)+c.getZ(b))/3;Gf(i.hole,y,_,E)||g.push(m,p,b)}o.setIndex(g)}return o.computeVertexNormals(),o}function du(i,t,e,n){const r=ts(i,e)+n;return new I((i.x??0)+Math.sin(t)*r,i.y0+e*(i.y1-i.y0),Math.cos(t)*r)}function qo(i,t,e,n){const s=new vs(i,t,e,6,n),a=s.attributes.position,o=s.attributes.normal;for(let c=0;c<=t;c++)for(let l=0;l<=6;l++){const h=c*7+l,u=.42*Math.sin(c*2.2+l*(Math.PI*2*2/6));a.setXYZ(h,a.getX(h)+o.getX(h)*e*u,a.getY(h)+o.getY(h)*e*u,a.getZ(h)+o.getZ(h)*e*u)}return s.computeVertexNormals(),s}const pu=[16719904,16755216,2781439,16724160],f_=2;function d_(i){const t=new Map,e=new Set,n=(F,k,H=0,X=0,Z=0)=>{F.position.set(H,X,Z),F.updateMatrixWorld(!0),F.traverse(P=>{const ut=P;if(!ut.isMesh)return;const at=ut.material,Mt=`${k}|${at.uuid}|${ut.name}`,pt=ut.geometry.index?ut.geometry.toNonIndexed():ut.geometry.clone();for(const yt of Object.keys(pt.attributes))yt!=="position"&&yt!=="normal"&&yt!=="color"&&pt.deleteAttribute(yt);pt.applyMatrix4(ut.matrixWorld);let _t=t.get(Mt);_t||(_t={bone:k,mat:at,name:ut.name,geos:[]},t.set(Mt,_t)),_t.geos.push(pt)})},r=(F,k,H="")=>{e.add(F);const X=new Pt(F,k);return X.name=H,X},s=i.std({color:15909267,emissive:15909267,emissiveIntensity:.18,roughness:.6}),a=i.std({color:1380623,roughness:.35}),o=i.std({color:5978656,roughness:.8}),c=i.std({color:15899278,roughness:.7}),l=i.std({color:16237849,roughness:.35,metalness:.05}),h=i.std({color:16777215,vertexColors:!0,roughness:.8,flatShading:!0,side:qe}),u=i.std({color:2055722,roughness:.85,flatShading:!0}),d=i.std({color:15250746,roughness:.3,metalness:.9}),f=i.std({color:15777605,roughness:.25,metalness:.9,flatShading:!0}),g=i.std({color:1522205,roughness:.7}),v=[i.std({color:13705003,roughness:.18,metalness:.55}),i.std({color:15316028,roughness:.2,metalness:.9}),i.std({color:2315209,roughness:.18,metalness:.55})],m=[];for(let F=0;F<f_;F++)for(let k=0;k<pu.length;k++){const H=i.std({color:2105376,emissive:pu[k],emissiveIntensity:1.2,roughness:.3,name:`bulb-${k}-${F}`});H.userData.phase=k*1.9+F*Math.PI,H.userData.rate=1.5+.6*((k+F*3)%4),m.push(H)}const p=new Se(.36,12,8),b=new Sn(.1,.1,.16,6),y=new Se(.24,8,6);let _=0,E=0;const w=(F,k,H=1)=>{const X=r(p,v[_++%v.length]);X.scale.setScalar(H),n(X,F,k.x,k.y,k.z);const Z=r(b,d);Z.scale.setScalar(H),n(Z,F,k.x,k.y+.38*H,k.z)},A=(F,k,H=1)=>{const X=r(y,m[(E++*5+_)%m.length],"bulb");X.scale.set(H,1.3*H,H),n(X,F,k.x,k.y,k.z)};for(const[F,k]of[...jc,...fu(1),...fu(-1)].entries()){n(r(u_(k),h),k.bone);const H=X=>k.bone!=="head"||!Gf(Je,X.x,X.y,X.z,uu+.5);if(k.baubles){const X=Math.PI*2/k.n,Z=Math.min(1.25,.75+k.r0*.1);for(let P=F%2;P<k.n;P+=2){const ut=P*X+(k.turn??0),at=k.r0*1.05+.1*Z,Mt=k.y0-(k.drop??Vf)-.36*Z,pt=new I(Math.sin(ut)*at,Mt,Math.cos(ut)*at);H(pt)&&w(k.bone,pt,Z)}}if(k.garland){const X=[],Z=F*1.9;for(let P=0;P<=48;P++){const ut=P/48;X.push(du(k,Z+ut*Math.PI*2,.18+.64*ut,.13))}n(r(qo(new gi(X),120,.15+k.r0*.012,!1),f),k.bone)}if(k.lights){const[X,Z]=k.lights,P=k.n-2,ut=.4+F*.7,at=Math.min(1.3,.8+k.r0*.1),Mt=_t=>{const yt=Math.sin(_t*Math.PI*P);return du(k,ut+_t*Math.PI*2,X-Z*yt*yt,.1)},pt=[];for(let _t=0;_t<96;_t++)pt.push(Mt(_t/96));n(r(new vs(new gi(pt,!0),192,.045,4,!0),g),k.bone);for(let _t=0;_t<P;_t++)for(const yt of[.3,.7]){const Bt=Mt((_t+yt)/P);H(Bt)&&A(k.bone,new I(Bt.x*1.04,Bt.y-.22*at,Bt.z*1.04),at)}}}for(const F of[-1,1]){const k=F>0?"L":"R",H=F*Kn,X=r(new Se(.75,10,6),u);n(X,"arm"+k,H,14.55,0);const Z=r(new br(.42,1.5,8),u);Z.rotation.x=Math.PI,n(Z,"forearm"+k,H,7.1,0),w("forearm"+k,new I(H+F*.75,9.95,.35),.8),w("forearm"+k,new I(H-F*.2,8.55,.7),.7);for(const[P,ut]of[[11.6,.3],[10.2,-.5],[8.8,.9],[12.9,-.2]]){const at=.95-(12.9-P)*.1;A("forearm"+k,new I(H+Math.sin(ut*F)*at,P,Math.cos(ut)*at),.85)}}const R=jc.find(F=>F.hole),M=ts(R,Va(R,Je.y))-.6,S=1.5,T=1.32,D=.55,U=(F,k)=>M+D*Math.sqrt(Math.max(0,1-(F/S)**2-((k-Je.y)/T)**2)),N=r(new Se(1,24,16),s);N.scale.set(S,T,D),n(N,"head",0,Je.y,M);const z=new Se(.2,12,8);for(const F of[-1,1]){const k=r(z,a);k.scale.set(.8,1.3,.45),n(k,"head",F*.5,17.5,U(F*.5,17.5));const H=r(z,c);H.scale.set(1.3,.8,.3),n(H,"head",F*.88,16.95,U(F*.88,16.95)-.02);const X=r(new nn(.78,.32,.3),o);X.rotation.set(0,F*.25,F*-.22),n(X,"head",F*.37,16.9,U(F*.37,16.9)+.02)}const $=r(new qi(.46,.075,6,18,2.3),a);$.rotation.z=-Math.PI/2-1.15,n($,"head",0,16.85,U(0,16.4)+.02);const V=(F,k,H)=>{const X=[];for(let Z=0;Z<64;Z++){const P=Z/64*Math.PI*2,ut=Math.cos(P)*F,at=Je.y+Math.sin(P)*k,Mt=ts(R,Va(R,at))+H;X.push(new I(ut,at,Math.sqrt(Math.max(0,Mt*Mt-ut*ut))))}return new gi(X,!0)};n(r(qo(V(Je.a,Je.b,.05),96,uu,!0),u),"head"),n(r(qo(V(Je.a+.38,Je.b+.38,.06),96,.12,!0),f),"head");for(let F=0;F<12;F++){const k=(F+.5)/12*Math.PI*2,H=Math.cos(k)*(Je.a+.72),X=Je.y+Math.sin(k)*(Je.b+.72),Z=ts(R,Va(R,X))+.12;A("head",new I(H,X,Math.sqrt(Math.max(0,Z*Z-H*H))),.9)}const tt=1.2,rt=new Ue,lt=r(new Se(1,24,10,0,Math.PI*2,0,Math.PI/2),l);lt.scale.set(1.66*tt,1.42*tt,1.72*tt),rt.add(lt);const xt=r(new qi(1,.11,6,20,Math.PI),l);xt.rotation.y=Math.PI/2,xt.scale.copy(lt.scale),rt.add(xt);const Ct=new hs([new bt(.8,0),new bt(1,0),new bt(1,.09),new bt(.8,.09),new bt(.8,0)],32),Ot=r(Ct,l);Ot.scale.set(2.05*tt,1,2.2*tt),Ot.position.set(0,-.02,.22*tt),rt.add(Ot);const nt=r(new gs(1,24),i.std({color:8022610,roughness:.9}));nt.rotation.x=Math.PI/2,nt.scale.set(1.62*tt,1.68*tt,1),nt.position.y=.04,rt.add(nt);const W=-1.3*tt;rt.position.set(0,0,-W);const K=new Ue;K.add(rt),K.rotation.set(-.26,0,.5,"ZXY"),n(K,"head",0,19.65,W);for(const F of t.values()){const k=i.segs.find(Z=>Z.name===F.bone).a,H=Al(F.geos);for(const Z of F.geos)Z.dispose();if(!H)throw new Error(`builder: parts on ${F.bone} would not merge`);H.translate(-k[0],-k[1],-k[2]);const X=new Pt(H,F.mat);X.name=F.name,i.at(X,F.bone,k[0],k[1],k[2]),(F.mat===s||F.mat===a||F.mat===c||F.mat===o)&&(X.receiveShadow=!1)}for(const F of e)F.dispose()}const mu=new WeakMap;function p_(i,t){let e=mu.get(i);if(!e){const n=new Set;i.traverse(r=>{const s=r.material;r.name==="bulb"&&s&&n.add(s)}),e=[...n],mu.set(i,e)}for(const n of e){const r=.5+.5*Math.sin(t*n.userData.rate+n.userData.phase);n.emissiveIntensity=.55+1.35*r*r*r}}const m_={id:"builder",name:"Builder",blurb:"A builder in a Christmas tree costume, tipping his hat",segs:o_,dress:d_,tick:p_,fit:{size:1,limb:.2},face:{eyes:(()=>{const i=jc.find(e=>e.hole),t=ts(i,Va(i,Je.y))-.6+.55*Math.sqrt(Math.max(0,1-(.5/1.5)**2-((17.5-Je.y)/1.32)**2))+.12;return[[.5,17.5,t,.3],[-.5,17.5,t,.3]]})()}},g_=[{name:"pelvis",a:[0,9.6,0],b:[0,10.6,0],parent:null},{name:"spine1",a:[0,10.6,0],b:[0,12.4,.1],parent:"pelvis"},{name:"spine2",a:[0,12.4,.1],b:[0,15,.1],parent:"spine1"},{name:"neck",a:[0,15,.1],b:[0,15.9,.15],parent:"spine2"},{name:"head",a:[0,15.9,.15],b:[0,18.4,.3],parent:"neck"},{name:"jaw",a:[0,16.5,-.3],b:[0,15.55,1],parent:"head",reach:0},{name:"tail1",a:[0,10.4,-1],b:[0,9.6,-1.1],parent:"pelvis",reach:0},{name:"tail2",a:[0,9.6,-1.1],b:[0,8.8,-1.2],parent:"tail1",reach:0},{name:"tail3",a:[0,8.8,-1.2],b:[0,8,-1.3],parent:"tail2",reach:0},{name:"tail4",a:[0,8,-1.3],b:[0,7.2,-1.4],parent:"tail3",reach:0},{name:"thighL",a:[1.1,9.6,0],b:[1.2,5.3,.2],parent:"pelvis"},{name:"shinL",a:[1.2,5.3,.2],b:[1.2,1.1,-.1],parent:"thighL"},{name:"footL",a:[1.2,1.1,-.1],b:[1.2,.35,1.4],parent:"shinL"},{name:"thighR",a:[-1.1,9.6,0],b:[-1.2,5.3,.2],parent:"pelvis"},{name:"shinR",a:[-1.2,5.3,.2],b:[-1.2,1.1,-.1],parent:"thighR"},{name:"footR",a:[-1.2,1.1,-.1],b:[-1.2,.35,1.4],parent:"shinR"},{name:"armL",a:[2.4,14.6,0],b:[2.72,11.9,-.05],parent:"spine2"},{name:"forearmL",a:[2.72,11.9,-.05],b:[2.85,9.45,.4],parent:"armL"},{name:"armR",a:[-2.4,14.6,0],b:[-2.72,11.9,-.05],parent:"spine2"},{name:"forearmR",a:[-2.72,11.9,-.05],b:[-2.85,9.45,.4],parent:"armR"}],Bs=i=>new I(i[0],i[1],i[2]);function Wf(i,t){const e=Bs(t).sub(Bs(i)).normalize(),n=new I(1,0,0).addScaledVector(e,-e.x);n.lengthSq()<1e-6&&n.set(0,0,1),n.normalize();const r=new I().crossVectors(n,e);return new ne().makeBasis(n,e,r).setPosition(i[0],i[1],i[2])}const ui=(i,t,e,n,r)=>Ui(i,t,e,n,r,6,5,2);function Ui(i,t,e,n,r,s=12,a=14,o=4){const c=Bs(t).distanceTo(Bs(i)),l=[];for(let u=0;u<=o;u++){const d=-Math.PI/2+u/o*(Math.PI/2);l.push(new bt(Math.max(.001,e*Math.cos(d)),e*.75*Math.sin(d)))}const h=Math.min(.2,1.3*Math.max(e,r)/c);for(let u=1;u<a;u++){const d=u/a,f=n+(e-n)*Math.exp(-((d/h)**2))+(r-n)*Math.exp(-(((1-d)/h)**2));l.push(new bt(f,d*c))}for(let u=0;u<=o;u++){const d=u/o*(Math.PI/2);l.push(new bt(Math.max(.001,r*Math.cos(d)),c+r*.75*Math.sin(d)))}return new hs(l,s).applyMatrix4(Wf(i,t))}function ye(i,t,e=[1,1,1],n=12){return new Se(t,n,Math.max(6,Math.round(n*.7))).scale(e[0],e[1],e[2]).translate(i[0],i[1],i[2])}function v_(i,t,e=24,n=8){return new vs(new gi(i.map(Bs)),e,t,n,!1)}function Kc(i,t,e=24,n=8){return[v_(i,t,e,n),ye(i[0],t,[1,1,1],n),ye(i[i.length-1],t,[1,1,1],n)]}function An(i){const t=Al(i.map(e=>e.index?e:e.toNonIndexed()),!1);for(const e of i)e.dispose();return t}const x_=i=>[-i[0],i[1],i[2]];function Bi(i,t,e,n,r=6e4){const s=x=>(t.max[x]-t.min[x])*e/(e-7),a=x=>t.min[x]-2.5*s(x)/e,o=a(0)+s(0)/2,c=a(1)+s(1)/2,l=a(2)+s(2)/2,h=s(0)/2,u=s(1)/2,d=s(2)/2,f=new Of(e,new Yi,!1,!1,r);f.isolation=50;const g=f.field,v=e,m=40;for(let x=0;x<v;x++){const M=l+(2*x/v-1)*d;for(let S=0;S<v;S++){const T=c+(2*S/v-1)*u;for(let D=0;D<v;D++){const U=o+(2*D/v-1)*h;g[x*v*v+S*v+D]=Math.max(0,Math.min(100,50-i(U,T,M)*m))}}}f.update();const p=f.count,b=f.positionArray,y=f.normalArray,_=new Float32Array(p*3),E=new Float32Array(p*3),w=n?new Float32Array(p*3):null,A=new Ut;for(let x=0;x<p;x++){const M=o+b[x*3]*h,S=c+b[x*3+1]*u,T=l+b[x*3+2]*d;_[x*3]=M,_[x*3+1]=S,_[x*3+2]=T;let D=y[x*3]/h,U=y[x*3+1]/u,N=y[x*3+2]/d;const z=Math.hypot(D,U,N)||1;D/=z,U/=z,N/=z,E[x*3]=D,E[x*3+1]=U,E[x*3+2]=N,w&&(A.setRGB(1,1,1),n(M,S,T,A),w[x*3]=A.r,w[x*3+1]=A.g,w[x*3+2]=A.b)}f.geometry.dispose();const R=new Le;return R.setAttribute("position",new ie(_,3)),R.setAttribute("normal",new ie(E,3)),w&&R.setAttribute("color",new ie(w,3)),R.computeBoundingSphere(),R}const ws=(i,t,e)=>-J(-i,-t,e),es=[.43,17.02,1.06],gu=[.43,16.99,.74];function Xf(i,t,e,n,r){const s=Math.abs(i),o=e-n,c=r,l=Math.hypot(o,c),h=(s*o+(t-e)*c)/l;return Math.max(h,n-t)}function __(i,t,e){const n=Math.abs(i);let r=Lt(i,t,e,0,17.45,-.12,1.1,1.13,1.32);r=J(r,Lt(i,t,e,0,16.8,-.35,.98,.62,.95),.3),r=J(r,Lt(i,t,e,0,16.68,.58,.8,.74,.72),.35),r=J(r,Lt(n,t,e,.78,16.86,.55,.33,.3,.48),.22),r=J(r,ft(n,t,e,.86,16.8,.35,.98,16.68,-.42,.15,.13),.15),r=J(r,ft(n,t,e,.12,17.32,1.12,.78,17.36,.95,.17,.15),.2),r=ws(r,-Lt(n,t,e,1.32,16.95,.05,.38,.5,.55),.18),r=ws(r,-Lt(n,t,e,es[0],es[1],es[2],.36,.34,.5),.07);const s=Math.min(Xf(i,t,16.86,16.42,.19),Math.hypot(n-.08,t-16.47)-.11);return r=ws(r,-Math.max(s,.8-e),.04),r=ws(r,16.08-t,.1),r=ws(r,-Lt(n,t,e,.8,16.25,.62,.22,.3,.35),.12),r}function M_(i,t,e,n){const r=Math.abs(i),s=Lt(r,t,e,es[0],es[1],es[2],.42,.4,.56),a=Math.max(Math.min(Xf(i,t,16.86,16.42,.19),Math.hypot(r-.08,t-16.47)-.11),.8-e)-.06,c=Math.max(0,Math.min(1,-Math.min(s,a)/.05))*(.75+.25*Math.max(0,Math.min(1,(1.2-e)/.4)));n.copy(T_).lerp(A_,c),c===0&&n.multiplyScalar(.94+.06*Math.max(0,Math.min(1,(t-16.3)/1.2)))}function b_(i,t,e,n,r,s,a){const o=r-e,c=s-n,l=Math.max(0,Math.min(1,((i-e)*o+(t-n)*c)/(o*o+c*c)));return Math.hypot(i-e-o*l,t-n-c*l)-a}function y_(i,t,e){const n=Math.abs(i);let r=ft(n,t,e,0,15.62,1,.5,15.66,.66,.17,.17);return r=J(r,ft(n,t,e,.5,15.66,.66,.78,15.74,-.12,.17,.16),.1),r=J(r,Math.max(b_(t,e,15.74,-.14,16.4,-.3,.2),Math.abs(n-.8)-.07),.08),r=J(r,Lt(n,t,e,.82,16.45,-.3,.15,.11,.13),.06),r=J(r,Lt(i,t,e,0,15.6,1,.33,.21,.17),.1),r=J(r,ft(n,t,e,0,15.8,1.02,.52,15.8,.62,.12,.12),.08),r}function S_(i,t,e){const n=Math.abs(i),r=Math.abs(Math.hypot(n-.25,t-10.95,e-.75)-1.4)-.09;let s=Math.max(r,Lt(n,t,e,1.2,10.5,-.18,.78,.7,.85));return s=J(s,ft(n,t,e,.6,11,-.45,1.55,11.05,.2,.1,.1),.12),s=J(s,Lt(i,t,e,0,9.95,-.78,.48,.72,.22),.15),s=J(s,ft(n,t,e,.38,10.35,-.72,.85,10.4,-.45,.17,.15),.12),s=J(s,ft(n,t,e,1.25,10.15,-.15,1,9.62,0,.24,.24),.15),s=J(s,_e(n,t,e,.92,9.6,0,.32),.12),s=Math.min(s,Math.hypot(Math.hypot(t-9.6,e)-.36,n-1)-.1),s=J(s,ft(n,t,e,.95,9.48,.28,.12,9.3,.72,.15,.14),.1),s=J(s,ft(n,t,e,.12,9.32,.72,.1,9.02,.66,.15,.15),.1),s=J(s,ft(n,t,e,1,9.38,-.2,.78,8.92,-.05,.18,.17),.1),s=J(s,ft(n,t,e,.78,8.92,-.05,.12,9.04,.62,.13,.12),.1),s}function Yo(i,t,e,n,r){return[new Sn(t,t*1.08,e,12).translate(i[0],i[1],i[2]),new nn(n,e*.42,.18).translate(i[0],i[1]+.02,i[2]-t*.6),new nn(.15,e*.55,r).rotateX(.35).translate(i[0],i[1]-.05,i[2]-t-r*.42)]}function vu(i){const t=[],e=[1.05,1.42,1.64,1.76,1.8,1.74,1.6],n=[.95,1.06,1.12,1.14,1.12,1.06,.96],r=[.32,.48,.62,.72,.8,.85,.85];for(let s=0;s<7;s++){const a=14.55-s*.4,o=e[s],c=.98,l=n[s],h=s>=5,u=[[.26,a+.04,-.78]],d=h?.74*Math.PI:Math.PI-Math.asin(Math.min(.9,.42/o));for(let f=0;f<=7;f++){const g=.14*Math.PI+f/7*(d-.14*Math.PI),v=-Math.cos(g)*(g<Math.PI/2?c:l),m=a-r[s]*Math.pow((g-.14*Math.PI)/(.86*Math.PI),1.3);u.push([o*Math.sin(g),m,v])}if(h){const f=u[u.length-1];u.push([.62,f[1]+.25+(s-5)*.2,1.02],[.26,12.62,1.06])}else u.push([.24,u[u.length-1][1]+.04,l*.98]);t.push(...Kc(u.map(f=>[f[0]*i,f[1],f[2]]),s===0?.13:.12,28,7))}return t}function w_(i,t){const e=Wf(i,[i[0]+t[0],i[1]+t[1],i[2]+t[2]]),n=1.35,r=(u,d,f)=>{const g=new I(u*n,d*n,f*n).applyMatrix4(e);return[g.x,g.y,g.z]},s=[];for(const[u,d,f]of[[0,.1,.16],[0,.1,-.02],[0,.1,-.2],[.02,.3,.2],[.02,.3,0],[.02,.3,-.18]])s.push(ye(r(u,d,f),.14,[1,1,1],8));const a=[[.21,1],[.07,1.08],[-.07,1],[-.2,.82]];for(const[u,d]of a){const f=r(.02,.4,u*.85),g=r(0,.4+.55*d,u),v=r(-.07,.4+.92*d,u*1.05),m=r(-.17,.4+1.15*d,u*1.08),p=r(-.28,.4+1.3*d,u*1.08);s.push(ui(f,g,.1,.075,.105),ui(g,v,.1,.07,.095),ui(v,m,.09,.065,.085),ui(m,p,.08,.06,.065))}const o=r(0,.25,.26),c=r(-.05,.6,.48),l=r(-.1,.88,.58),h=r(-.16,1.08,.62);return s.push(ui(o,c,.11,.085,.1),ui(c,l,.1,.075,.09),ui(l,h,.09,.065,.065)),s}function E_(){const i=[];i.push(ye([1.2,.88,0],.27)),i.push(ye([1.24,.44,-.3],1,[.27,.32,.44]));for(const[s,a,o]of[[.98,.62,.36],[1.22,.62,.34],[1.46,.55,.22],[1.08,.55,.6],[1.32,.52,.56]])i.push(ye([s,a,o],.17,[1,1,1],8));const t=[.95,1.12,1.28,1.42,1.55],e=[.84,1.08,1.3,1.5,1.68],n=[.1,.075,.07,.065,.065],r=[.42,.34,.3,.27,.24];for(let s=0;s<5;s++){const a=[t[s],.5,.62],o=[e[s],.22,1.38-s*.05];i.push(ui(a,o,n[s]*1.3,n[s],n[s]*1.35));const c=[o[0]+(s===0?-.02:.02*s),.15,o[2]+r[s]];i.push(ui(o,c,n[s]*1.05,n[s]*.8,n[s]*.85))}return i}const qf=15656396,T_=new Ut(qf),A_=new Ut(1905164),R_=5832490;function C_(i){const t=i.std({color:qf,roughness:.42,metalness:0,emissive:2894368,emissiveIntensity:1}),e=i.std({color:16777215,vertexColors:!0,roughness:.42,metalness:0,emissive:2894368,emissiveIntensity:1}),n=i.std({color:1182214,roughness:.9}),r=i.std({color:0,emissive:R_,emissiveIntensity:1,roughness:1}),s=(f,g,v=t)=>{for(const m of["L","R"]){const p=new Pt(f,v);p.name=`skelly-${g}${m}`,m==="R"&&(p.scale.x=-1),i.at(p,g+m,0,0,0)}},a=(f,g,v=t,m=`skelly-${g}`)=>{const p=new Pt(f,v);return p.name=m,i.at(p,g,0,0,0),p},o=Bi(__,{min:[-1.25,15.95,-1.5],max:[1.25,18.65,1.4]},52,M_,4e4);a(o,"head",e);const c=An([ye(gu,.1,[1,1.1,.7],10),ye(x_(gu),.1,[1,1.1,.7],10)]);a(c,"head",r,"skelly-embers");const l=(f,g,v,m,p)=>{const b=[];for(let y=0;y<10;y++){const _=-1.05+y/9*2.1;b.push(new Ml(.075,g,2,7).scale(1,1,.75).rotateY(_).translate(v*Math.sin(_),f,p+m*Math.cos(_)))}return b};a(An(l(16.15,.17,.6,.78,.47)),"head",t,"skelly-teeth"),a(An([ye([0,15.98,.8],1,[.58,.24,.4])]),"head",n,"skelly-mouth"),a(Bi(y_,{min:[-1,15.36,-.55],max:[1,16.6,1.22]},36,void 0,12e3),"jaw"),a(An(l(15.88,.15,.56,.74,.47)),"jaw",t,"skelly-lowerteeth"),a(An([0,1,2,3].flatMap(f=>Yo([0,15.12+f*.25,-.22],.25,.19,.72,.3))),"neck"),a(An([...[0,1,2,3,4,5].flatMap(f=>Yo([0,12.55+f*.4,-.82],.25,.26,.6,.28)),...vu(1),...vu(-1),ye([0,13.55,1.08],1,[.26,1.05,.12],12),ye([0,14.42,1],1,[.36,.32,.13],10),...Kc([[.22,14.72,1.02],[.85,14.86,.9],[1.55,14.98,.42],[2.18,15.02,.02]],.13,20,8),...Kc([[-.22,14.72,1.02],[-.85,14.86,.9],[-1.55,14.98,.42],[-2.18,15.02,.02]],.13,20,8),ye([1.25,13.95,-1],1,[.62,.85,.09],12),ye([-1.25,13.95,-1],1,[.62,.85,.09],12)]),"spine2"),a(An([0,1,2,3].flatMap(f=>Yo([0,10.85+f*.42,-.42],.36,.3,1.15,.45))),"spine1"),a(Bi(S_,{min:[-1.75,8.72,-1.05],max:[1.75,11.2,1.05]},40,void 0,24e3),"pelvis"),s(An([ye([2.33,14.56,-.03],.36),Ui([2.4,14.45,0],[2.71,12.08,-.05],.3,.2,.28),ye([2.53,11.98,-.05],.21,[1,.9,1],10),ye([2.88,11.98,-.06],.2,[1,.9,1],10)]),"arm");const h=[2.72,11.9,-.05],u=[2.85,9.45,.4],d=[u[0]-h[0],u[1]-h[1],u[2]-h[2]];s(An([ye([2.74,11.98,-.25],.21,[1,1.1,1],10),Ui([2.76,11.85,-.2],[2.86,9.62,.22],.19,.13,.16,10),Ui([2.66,11.72,.12],[2.86,9.62,.54],.16,.13,.21,10),...w_([u[0],u[1]-.05,u[2]],d)]),"forearm"),s(An([ye([1.12,9.62,.02],.36),Ui([1.12,9.6,0],[1.55,9.24,-.03],.2,.18,.2,10),ye([1.64,9.3,-.08],.3,[1,1.2,1]),Ui([1.56,9.22,0],[1.22,5.62,.18],.28,.21,.34),ye([1,5.5,.12],.29),ye([1.42,5.5,.12],.29)]),"thigh"),s(An([Ui([1.19,5.12,.18],[1.16,1.28,-.08],.36,.18,.24),ye([1,1.16,-.05],.17,[1,1.2,1],10),Ui([1.52,4.95,.02],[1.47,1.3,-.16],.16,.09,.17,10),ye([1.2,5.36,.62],.27,[1,1.1,.55])]),"shin"),s(An(E_()),"foot")}const xu=new WeakMap,L_={id:"skeleton",name:"Skelly",blurb:"Bones, a grin, and green embers for eyes",segs:g_,dress:C_,fit:{size:1.04,limb:.3},face:{eyes:[[.43,17.02,1.3,.36],[-.43,17.02,1.3,.36]]},tick(i,t,e){let n=xu.get(i);if(!n){const s=[];i.traverse(a=>{a.name==="skelly-embers"&&s.push(a.material)}),n={jaw:i.getObjectByName("jaw")??null,embers:s},xu.set(i,n)}const r=.95+.3*Math.sin(t*2.1)+.1*Math.sin(t*7.3+1.1);for(const s of n.embers)s.emissiveIntensity=r;if(n.jaw){const s=t%4.6;n.jaw.rotation.x=e&&e.jaw>.05?.02+.55*e.jaw:s<.75?.05+.07*Math.abs(Math.sin(s*25)):.02}}},P_=[{name:"pelvis",a:[0,9.6,0],b:[0,10.6,0],parent:null},{name:"spine1",a:[0,10.6,0],b:[0,12.4,.1],parent:"pelvis"},{name:"spine2",a:[0,12.4,.1],b:[0,15,.1],parent:"spine1"},{name:"neck",a:[0,15,.1],b:[0,15.9,.15],parent:"spine2",reach:.8},{name:"head",a:[0,15.9,.15],b:[0,18.4,.3],parent:"neck"},{name:"jaw",a:[0,16.4,.9],b:[0,16.4,1.2],parent:"head",reach:0},{name:"tail1",a:[0,14.8,-1.2],b:[0,12.6,-1.4],parent:"spine2",reach:0},{name:"tail2",a:[0,12.6,-1.4],b:[0,10.4,-1.6],parent:"tail1",reach:0},{name:"tail3",a:[0,10.4,-1.6],b:[0,8.2,-1.8],parent:"tail2",reach:0},{name:"tail4",a:[0,8.2,-1.8],b:[0,6.2,-2],parent:"tail3",reach:0},{name:"thighL",a:[1.1,9.6,0],b:[1.2,5.3,.2],parent:"pelvis"},{name:"shinL",a:[1.2,5.3,.2],b:[1.2,1.1,-.1],parent:"thighL"},{name:"footL",a:[1.2,1.1,-.1],b:[1.2,.35,1.4],parent:"shinL"},{name:"thighR",a:[-1.1,9.6,0],b:[-1.2,5.3,.2],parent:"pelvis"},{name:"shinR",a:[-1.2,5.3,.2],b:[-1.2,1.1,-.1],parent:"thighR"},{name:"footR",a:[-1.2,1.1,-.1],b:[-1.2,.35,1.4],parent:"shinR"},{name:"armL",a:[2.5,14.55,0],b:[2.95,11.95,-.05],parent:"spine2"},{name:"forearmL",a:[2.95,11.95,-.05],b:[3.12,9.6,.35],parent:"armL"},{name:"armR",a:[-2.5,14.55,0],b:[-2.95,11.95,-.05],parent:"spine2"},{name:"forearmR",a:[-2.95,11.95,-.05],b:[-3.12,9.6,.35],parent:"armR"}],D_={min:[-4.2,-.5,-1.9],max:[4.2,17.1,2.3]},I_=[3.12,9.6,.35],Yf=(i,t,e)=>ft(i,t,e,3.05,10.55,.2,3.16,9,.45,.3,.3);function Rl(i,t,e){const n=Math.abs(i);let r=4;if(t>8.4&&(r=Lt(i,t,e,0,13,.05,1.74,2.15,1.2),r=J(r,Lt(i,t,e,0,11.35,.15,1.62,1.1,1.12),.5),t>13.2&&(r=J(r,ft(n,t,e,0,15,-.05,2.15,14.62,0,.5,.56),.5),r=J(r,Math.hypot(Math.hypot(i,(e+.02)*1.15)-.78,t-15.18)-.2,.12),r=J(r,ft(i,t,e,0,14.9,.05,0,15.6,.12,.62,.55),.2)),t<11.6&&(r=J(r,Lt(i,t,e,0,10.05,0,1.78,1.05,1.15),.4))),t<10.9&&(r=J(r,ft(n,t,e,1.08,9.6,0,1.2,5.3,.15,.88,.74),.35),t<6.4&&(r=J(r,ft(n,t,e,1.2,5.3,.15,1.22,2.1,-.05,.74,.7),.25))),n>1.5&&t>8.8){const s=ft(n,t,e,2.5,14.55,0,2.95,11.95,-.05,.6,.55);r=t>14?J(r,s,.3):Math.min(r,s),t<12.9&&(r=J(r,ft(n,t,e,2.95,11.95,-.05,3.08,10,.28,.55,.52),.25),r=Math.max(r,-Yf(n,t,e)))}if(t<3.4){const s=J(ft(n,t,e,1.22,2.3,-.05,1.22,.6,-.05,.5,.52),Math.max(Lt(n,t,e,1.22,.5,.55,.58,.5,1.3),-t),.3);r=Math.min(r,s)}return r}const Zc=0,$f=1,U_=2,jf=3,N_=4;function Kf(i,t,e){const n=Math.abs(i);return Yf(n,t,e)<.06?N_:t<2.25&&n>.4?U_:t>15.38&&n<.8?jf:n>2.1&&t>9.2||t>10.72?Zc:$f}const F_=`
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
  }`;function O_(){const i=new vi({vertexColors:!0,roughness:.88,metalness:0});return i.onBeforeCompile=t=>{t.vertexShader=t.vertexShader.replace("#include <common>",`#include <common>
 attribute vec3 aCloth; varying vec3 vCloth; varying vec3 vBind; varying vec3 vBindN;`).replace("#include <begin_vertex>",`#include <begin_vertex>
 vBind = position; vBindN = normal; vCloth = aCloth;`),t.fragmentShader=t.fragmentShader.replace("#include <common>",`#include <common>
`+F_).replace("#include <color_fragment>",`#include <color_fragment>
 diffuseColor.rgb = cloth(diffuseColor.rgb, vBind, normalize(vBindN), vCloth);`)},i.customProgramCacheKey=()=>"jack-cloth-v2",i}const Be=[0,17.15,.22],B_=1.82,Hn=1.38,Zf=.24;function Cl(i,t,e){const n=i-Be[0],r=t-Be[1],s=e-Be[2],a=Math.hypot(n,s),o=Math.atan2(s,n),c=1-Math.sqrt(Math.abs(Math.cos(5*(o-Math.PI/2)))),l=1-.06*c;let h=(Math.hypot(a/l/B_,r/Hn)-1)*Hn;return h+=.32*Math.exp(-((a/.6)**2))*Math.min(1,Math.abs(r)/Hn),{d:h,groove:c}}function _u(i,t,e,n,r,s,a=0){const o=(n+r)/2,c=Math.cos(a),l=Math.sin(a),h=(i-e)*c-(t-o)*l,u=(i-e)*l+(t-o)*c+o,d=n-r,f=Math.hypot(d,s);return Math.max((Math.abs(h)*d+(u-n)*s)/f,r-u)}const Mu=(i,t,e,n,r,s)=>(Math.hypot((i-e)/r,(t-n)/s)-1)*Math.min(r,s),bu=(i,t,e,n,r,s)=>{const a=Math.abs(i-e)-r,o=Math.abs(t-n)-s;return Math.hypot(Math.max(a,0),Math.max(o,0))+Math.min(Math.max(a,o),0)};function k_(i,t){const e=Math.abs(i);let n=_u(e,t,.66,.74,.14,.36,-.12);n=Math.min(n,_u(i,t,0,.1,-.2,.17));let r=Math.max(Mu(i,t,0,-.36,1.2,.64),-Mu(i,t,0,-.08,1.34,.56));return r=Math.max(r,-bu(e,t,.32,-.7,.11,.12)),r=Math.max(r,-bu(i,t,0,-.93,.12,.13)),Math.min(n,r)}function H_(i,t,e){const n=Cl(i,t,e).d;let r=Math.max(n,-(n+Zf));const s=Math.max(k_(i-Be[0],t-Be[1]),Be[2]+.4-e);return r=Math.max(r,-s),r}const z_=new Ut(15233038),V_=new Ut(10108936),G_=new Ut(16757820),W_=new Ut(16737290);function X_(i,t,e,n){const{d:r,groove:s}=Cl(i,t,e);if(r<-.05){n.copy(G_).lerp(W_,Math.max(0,Math.min(1,(t-Be[1]-Hn*.2)/(Hn*.8))));return}n.copy(z_).lerp(V_,Math.min(1,s*1.3)),n.multiplyScalar(.85+.15*(1-Math.abs(t-Be[1])/Hn))}function q_(i){const t=i.std({color:16777215,vertexColors:!0,roughness:.5,metalness:0,emissive:16777215,emissiveIntensity:1});return t.onBeforeCompile=e=>{e.vertexShader=e.vertexShader.replace("#include <common>",`#include <common>
 attribute float aGlow; varying float vGlow;`).replace("#include <begin_vertex>",`#include <begin_vertex>
 vGlow = aGlow;`),e.fragmentShader=e.fragmentShader.replace("#include <common>",`#include <common>
 varying float vGlow;`).replace("#include <color_fragment>",`#include <color_fragment>
 vec3 glowHue = diffuseColor.rgb; diffuseColor.rgb *= 1.0 - 0.92 * vGlow;`).replace("#include <emissivemap_fragment>",`#include <emissivemap_fragment>
 totalEmissiveRadiance *= vGlow * glowHue;`)},t.customProgramCacheKey=()=>"jack-shell-v2",t}let Ga=1;const sn=()=>(Ga=Ga*1664525+1013904223>>>0,Ga/4294967296),Y_=new I(0,1,0),yu=[15255146,13937738,15916172,12884540].map(i=>new Ut(i));function Es(i,t,e,n){const r=new br(n,e,4,1).translate(0,e/2,0);r.applyQuaternion(new ze().setFromUnitVectors(Y_,t.clone().normalize())).translate(i.x,i.y,i.z);const s=yu[Math.floor(sn()*yu.length)],a=r.attributes.position.count,o=new Float32Array(a*3);for(let c=0;c<a;c++)o[c*3]=s.r,o[c*3+1]=s.g,o[c*3+2]=s.b;return r.setAttribute("color",new ie(o,3)),r}function Ts(i,t){const e=i.clone().normalize(),n=Math.abs(e.y)<.9?new I(0,1,0):new I(1,0,0),r=new I().crossVectors(e,n).normalize(),s=new I().crossVectors(e,r),a=sn()*Math.PI*2,o=Math.tan(t*Math.sqrt(sn()));return e.addScaledVector(r,Math.cos(a)*o).addScaledVector(s,Math.sin(a)*o).normalize()}function li(i){const t=Al(i.map(e=>e.index?e.toNonIndexed():e),!1);for(const e of i)e.dispose();return t}function $o(i,t){let e=0,n=3;for(let r=0;r<30;r++){const s=(e+n)/2;Rl(i,t,s)<0?e=s:n=s}return e}function Su(i,t,e){let n=0,r=3;for(let s=0;s<26;s++){const a=(n+r)/2;Rl(Math.cos(t)*a,i,e+Math.sin(t)*a)<0?n=a:r=a}return n}function Ca(i,t,e,n){const r=Math.max(8,Math.round(t*18)),s=new vs(i,r,e,7,n),a=s.attributes.uv,o=a.count,c=new Float32Array(o*3),l=new Ut(13150312),h=new Ut(9071160),u=new Ut;for(let d=0;d<o;d++){const f=.5+.5*Math.sin((a.getX(d)*t*4.5+a.getY(d))*Math.PI*2);u.copy(l).lerp(h,f*f),c[d*3]=u.r,c[d*3+1]=u.g,c[d*3+2]=u.b}return s.setAttribute("color",new ie(c,3)),s}function $_(i){Ga=7;const t=i.bones.get("pelvis").parent;if(t?.isSkinnedMesh){const nt=t.geometry.attributes.position,W=new Float32Array(nt.count*3);for(let K=0;K<nt.count;K++){const F=Kf(nt.getX(K),nt.getY(K),nt.getZ(K));W[K*3]=F===Zc?1:0,W[K*3+1]=F===$f?1:0,W[K*3+2]=F===jf?1:0}t.geometry.setAttribute("aCloth",new ie(W,3)),t.material.dispose(),t.material=O_()}const e=i.std({color:16777215,vertexColors:!0,roughness:.75,metalness:0}),n=i.std({color:16777215,vertexColors:!0,roughness:.9,metalness:0}),r=(nt,W,K,F)=>{for(const k of["L","R"]){const H=new Pt(nt,K);H.name=`jack-${F}${k}`,k==="R"&&(H.scale.x=-1),i.at(H,W+k,0,0,0)}},s=Bi(H_,{min:[-1.92,Be[1]-Hn-.05,Be[2]-1.92],max:[1.92,Be[1]+Hn+.05,Be[2]+1.92]},48,X_,4e4),a=s.attributes.position,o=new Float32Array(a.count);for(let nt=0;nt<a.count;nt++)o[nt]=Math.max(0,Math.min(1,-Cl(a.getX(nt),a.getY(nt),a.getZ(nt)).d/.16));s.setAttribute("aGlow",new ie(o,1));const c=new Pt(s,q_(i));c.name="jack-pumpkin",i.at(c,"head",0,0,0);const l=Be[1]-Hn+Zf+.3,h=new Ue;h.name="jack-flame";const u=new Pt(li([new Se(.15,10,8).scale(1,1.1,1).translate(0,.15,0),new br(.148,.42,10,1,!0).translate(0,.36,0)]),i.std({color:0,emissive:16762976,emissiveIntensity:2.4}));u.name="jack-flamecore",h.add(u),i.at(h,"head",0,l,Be[2]-.15);const d=Be[1]+Hn-.22,f=new Sn(.16,.26,1.5,7,8).translate(0,.75,0);{const nt=f.attributes.position;for(let W=0;W<nt.count;W++){const K=nt.getY(W)/1.5,F=1+.6*Math.max(0,1-K*5);nt.setXYZ(W,nt.getX(W)*F+.5*K*K,nt.getY(W),nt.getZ(W)*F-.1*K*K)}f.computeVertexNormals()}i.at(new Pt(f.translate(0,d,Be[2]-.05),i.std({color:5990956,roughness:.85})),"head",0,0,0);const g=i.std({color:4863526,roughness:.95,side:qe}),v=[];for(let nt=0;nt<=10;nt++){const W=1.08+nt/10*1.12;v.push(new bt(W,-.22*((W-1.08)/1.12)**2))}const m=[];for(let nt=0;nt<=10;nt++){const W=nt/10;m.push(new bt(1.1-.24*W-(W>.85?(W-.85)*3.6:0),W*1.2))}const p=li([new hs(v,28),new hs(m,28)]);{const nt=p.attributes.position;for(let W=0;W<nt.count;W++){const K=nt.getX(W),F=nt.getY(W),k=nt.getZ(W),H=F>.7?.2*Math.exp(-((K/.5)**2))*Math.max(0,k):0;nt.setXYZ(W,K,F-.07*Math.max(0,K)*Math.max(0,Math.hypot(K,k)-1.08)-H*.6,k-H)}p.computeVertexNormals()}const b=new qi(1.07,.08,6,28).rotateX(Math.PI/2).scale(1,2.4,1).translate(0,.2,0),y=new Ue;y.add(new Pt(p,g),new Pt(b,i.std({color:1971986,roughness:.8}))),y.rotation.set(-.08,0,-.2),i.at(y,"head",.08,Be[1]+Hn-.1,Be[2]-.1);const _=[];for(let nt=0;nt<34;nt++){const W=nt/34*Math.PI*2+sn()*.15,K=.72,F=new I(Math.cos(W)*K,15.3+sn()*.1,Math.sin(W)*K*.9),k=Ts(new I(Math.cos(W)*.9,.7,Math.sin(W)*.9),.35);_.push(Es(F,k,.45+sn()*.5,.05))}const E=new Pt(li(_),e);E.name="jack-collar",i.at(E,"spine2",0,0,0);const w=new I(2.95,11.95,-.05),A=new I(...I_),R=A.clone().sub(w).normalize(),x=[];for(let nt=0;nt<46;nt++){const W=sn()*Math.PI*2,K=.26*Math.sqrt(sn()),F=new I(Math.cos(W)*K,0,Math.sin(W)*K),k=A.clone().addScaledVector(R,.55).add(F);x.push(Es(k,Ts(R.clone().addScaledVector(F,1.4),.3),.8+sn()*.9,.055))}r(li(x),"forearm",e,"hand");const M=[];for(let nt=0;nt<26;nt++){const W=nt/26*Math.PI*2+sn()*.2,K=new I(1.22+Math.cos(W)*.62,2.2+sn()*.12,-.05+Math.sin(W)*.62);M.push(Es(K,Ts(new I(Math.cos(W),-1.1,Math.sin(W)),.3),.4+sn()*.45,.05))}r(li(M),"shin",e,"ankle");const S=[];for(let nt=0;nt<14;nt++){const W=nt/14*Math.PI*2,K=Su(15.62,W,.1)+.04;S.push(new I(Math.cos(W)*K,15.62,.1+Math.sin(W)*K))}i.at(new Pt(Ca(new gi(S,!0),3.6,.09,!0),n),"neck",0,0,0);const T=10.72,D=[];for(let nt=0;nt<24;nt++){const W=nt/24*Math.PI*2,K=Su(T,W,.05)+.06;D.push(new I(Math.cos(W)*K,T,.05+Math.sin(W)*K))}const U=new gi(D,!0),N=.55,z=$o(N,T)+.1,$=new gi([new I(N,T-.05,z),new I(N+.12,T-.6,z+.12),new I(N+.05,T-1.25,z+.08)]),V=new gi([new I(N,T-.05,z),new I(N-.12,T-.5,z+.14),new I(N-.02,T-1,z+.1)]),tt=[];for(const nt of[$,V]){const W=nt.getPoint(1);for(let K=0;K<7;K++)tt.push(Es(W,Ts(new I(0,-1,.1),.35),.22+sn()*.2,.035))}const rt=new Se(.22,10,8).scale(1.2,.9,.8).translate(N,T,z),lt=new Float32Array(rt.attributes.position.count*3),xt=new Ut(11571288);for(let nt=0;nt<lt.length;nt+=3)lt[nt]=xt.r,lt[nt+1]=xt.g,lt[nt+2]=xt.b;rt.setAttribute("color",new ie(lt,3)),i.at(new Pt(li([Ca(U,11,.13,!0),Ca($,1.3,.1,!1),Ca(V,1,.1,!1),rt]),n),"pelvis",0,0,0),i.at(new Pt(li(tt),e),"pelvis",0,0,0);const Ct=[],Ot=[];for(const nt of[14.25,13.45,12.65]){const W=$o(.13,nt);Ct.push(new Sn(.12,.12,.07,10).rotateX(Math.PI/2).translate(.13,nt,W+.02))}for(let nt=0;nt<5;nt++)Ot.push(Es(new I(.13,13.05,$o(.13,13.05)-.05),Ts(new I(.4,.3,1),.4),.35+sn()*.25,.035));i.at(new Pt(li(Ct),i.std({color:2759698,roughness:.5})),"spine2",0,0,0),i.at(new Pt(li(Ot),e),"spine2",0,0,0)}const j_=(i,t,e,n)=>i.name.startsWith("thigh")?n>-1.6&&e<i.a[1]+.8&&Math.abs(Math.abs(t)-Math.abs(i.a[0]))<(e<i.a[1]+.3?1.3:.9):i.name.startsWith("arm")||i.name.startsWith("forearm")?Math.abs(t)>(e<12?2.2:e<14.1?1.88:2.1):!0,wu=new WeakMap,K_={id:"pumpkin",name:"Jack",blurb:"A scarecrow with a candle-lit pumpkin head",segs:P_,body:{sdf:Rl,region:Kf,box:D_,palette:[9181716,2307418,3810326,11044954,1708556],surface:"soft",weights:"sharp",capture:j_},dress:$_,fit:{size:1.08,limb:.6},face:{eyes:[[.66,17.75,2.02,.38],[-.66,17.75,2.02,.38]]},res:76,tick(i,t,e){let n=wu.get(i);if(!n){const o=[],c=[];i.traverse(l=>{l.name==="jack-pumpkin"&&o.push(l.material),l.name==="jack-flamecore"&&c.push(l.material)}),n={shell:o,core:c,flame:i.getObjectByName("jack-flame")??null},wu.set(i,n)}const r=.5*Math.sin(t*1.7)+.3*Math.sin(t*7.9+1.3)+.22*Math.sin(t*13.3+.4)+.15*Math.sin(t*23.7+2.2),s=Math.max(0,Math.sin(t*.83+.5)-.92)*6,a=Math.max(.35,1+.36*r-s)*(1+1.3*(e?.jaw??0));for(const o of n.shell)o.emissiveIntensity=a;for(const o of n.core)o.emissiveIntensity=2.4*a;n.flame&&(n.flame.scale.set(1-.08*r,a*(1+.12*Math.sin(t*17)),1-.08*r),n.flame.rotation.z=.12*Math.sin(t*5.3))}},ks=[1.2,7.9,0],fn=[1.32,4.5,.15],Ln=[1.32,1.35,-.1],Eu=[1.32,1,2],Jc=[2.45,12.1,0],ki=[3.3,9.7,-.1],fi=[3.85,7.4,.15],pi=9.4,hr=5.9,Yn=i=>[-i[0],i[1],i[2]],Te=[0,13.6,.25],jo=[1.9,1.95,1.8],Dn=1.1,Ys=i=>[Te[0]+(i[0]-Te[0])*Dn,Te[1]+(i[1]-Te[1])*Dn,Te[2]+(i[2]-Te[2])*Dn],tn=[.82,14.25,1.62],Hi=.56,fs=[0,13.05,1.25],$a=i=>fs[1]-.1*(i-fs[2]),kr=Ys(tn),Tu=Hi*Dn,Z_=Ys(fs),J_=[{name:"pelvis",a:[0,7.9,0],b:[0,8.9,0],parent:null},{name:"spine1",a:[0,8.9,0],b:[0,10.3,.05],parent:"pelvis"},{name:"spine2",a:[0,10.3,.05],b:[0,11.5,.05],parent:"spine1"},{name:"neck",a:[0,11.5,.05],b:[0,11.9,.1],parent:"spine2"},{name:"head",a:[0,11.9,.1],b:[0,15.3,.4],parent:"neck"},{name:"jaw",a:Z_,b:Ys([0,12.75,3.95]),parent:"head",reach:0},{name:"tail1",a:[0,6.3,-1.3],b:[0,5.75,-2.3],parent:"pelvis",reach:1.4},{name:"tail2",a:[0,5.75,-2.3],b:[0,5.3,-3.1],parent:"tail1",reach:1.4},{name:"tail3",a:[0,5.3,-3.1],b:[0,5,-3.7],parent:"tail2",reach:1.2},{name:"tail4",a:[0,5,-3.7],b:[0,4.8,-4.1],parent:"tail3",reach:1},{name:"thighL",a:ks,b:fn,parent:"pelvis"},{name:"shinL",a:fn,b:Ln,parent:"thighL"},{name:"footL",a:Ln,b:Eu,parent:"shinL"},{name:"thighR",a:Yn(ks),b:Yn(fn),parent:"pelvis"},{name:"shinR",a:Yn(fn),b:Yn(Ln),parent:"thighR"},{name:"footR",a:Yn(Ln),b:Yn(Eu),parent:"shinR"},{name:"armL",a:Jc,b:ki,parent:"spine2"},{name:"forearmL",a:ki,b:fi,parent:"armL"},{name:"armR",a:Yn(Jc),b:Yn(ki),parent:"spine2"},{name:"forearmR",a:Yn(ki),b:Yn(fi),parent:"armR"}],Q_={min:[-4.6,2.3,-4.5],max:[4.6,17.4,2.5]},Ll=(i,t,e)=>{const n=Math.min(1,Math.max(0,(e-i)/(t-i)));return n*n*(3-2*n)};function Jf(i,t,e){if(t<6.5)return 7.3-t;if(t>13.4)return t-12.6;const n=Math.abs(i);let r=Lt(i,t,e,0,10,.1,1.9,2.4,1.55);return r=J(r,Lt(i,t,e,0,10.75,.45,1.55,1.3,1.25),.6),r=J(r,Lt(i,t,e,0,11.45,0,2.15,1,1.35),.7),r=J(r,_e(n,t,e,2.2,11.85,0,.7),.5),J(r,Lt(i,t,e,0,8.3,-.1,1.65,1,1.4),.6)}function Qf(i,t,e){if(t>pi+.6||t<hr-.6)return Math.max(t-pi,hr-t);const n=Math.min(1,Math.max(0,(pi-t)/(pi-hr))),r=1-(1-n)*(1-n),s=1+.03*r*Math.cos(Math.atan2(i,e)*10),a=(1.72+.95*r)*s,o=(1.45+.85*r)*s,c=.05-.1*r,l=(Math.hypot(i/a,(e-c)/o)-1)*Math.min(a,o);return Math.max(l,t-pi,hr-t)}function t2(i,t,e){const n=Math.abs(i);let r=Lt(i,t,e,Te[0],Te[1],Te[2],jo[0],jo[1],jo[2]);r=J(r,Lt(n,t,e,.9,13,.7,1.05,.9,1),.5);for(const s of[-1,0,1]){const a=1-Math.abs(s);r=J(r,ft(i,t,e,s*.2,15.2,.2,s*.55,16.25+a*.35,.55+a*.25,.3,.09),.3)}return Math.max(r,-_e(n,t,e,tn[0],tn[1],tn[2],Hi+.04))}const e2=(i,t,e,n)=>n(Te[0]+(i-Te[0])/Dn,Te[1]+(t-Te[1])/Dn,Te[2]+(e-Te[2])/Dn)*Dn;function td(i,t,e){return t<10.6?11.4-t:e2(i,t,e,t2)}function ed(i,t,e){if(i<1)return 1.7-i;if(t>13.4)return t-12.8;if(t<4.6)return 5.2-t;let n=ft(i,t,e,...Jc,...ki,.7,.58);const r=1.75;n=J(n,ft(i,t,e/r,ki[0],ki[1],ki[2]/r,fi[0],fi[1],fi[2]/r,.5,.4),.45);for(let s=0;s<4;s++){const a=-.75+s*.5,o=1.45+.4*(1-Math.abs(a)/.75);n=J(n,ft(i,t,e,fi[0]-.05,fi[1]+.5,a*.8+.1,fi[0]+.14,fi[1]-o,a*1.15+.15,.3,.09),.22)}return n}function nd(i,t,e){if(t>9.4)return t-8.7;if(i>3)return i-2.1;let n=ft(i,t,e,...ks,...fn,.78,.56);return n=J(n,_e(i,t,e,...fn,.6),.3),J(n,ft(i,t,e,...fn,fn[0],3,.03,.55,.5),.3)}function id(i,t,e){if(e>0)return e+.85;if(t>7.6)return t-6.8;let n=1e9;for(const r of[-1,0,1]){const s=1-Math.abs(r);n=J(n,ft(i,t,e,r*.25,6.3,-1.3,r*.9,5-s*.25,-3.7-s*.35,.4,.13),.3)}return n}function n2(i,t,e){const n=Math.abs(i);let r=J(Jf(i,t,e),td(i,t,e),.8);return r=J(r,nd(n,t,e),.55),r=J(r,ed(n,t,e),.05+.5*Ll(10.9,11.8,t)),Math.min(r,Qf(i,t,e),id(i,t,e))}const xi=0,fr=1,Hs=2,no=3,ns=4,zs=5,Zn=new Float64Array(6);let Au=NaN,Ru=NaN,Cu=NaN,Qc=0;function io(i,t,e){if(i===Au&&t===Ru&&e===Cu)return Qc;const n=Math.abs(i);Zn[xi]=Jf(i,t,e),Zn[fr]=Qf(i,t,e),Zn[Hs]=td(i,t,e),Zn[no]=ed(n,t,e),Zn[ns]=nd(n,t,e),Zn[zs]=id(i,t,e);let r=0;for(let s=1;s<6;s++)Zn[s]<Zn[r]&&(r=s);return Au=i,Ru=t,Cu=e,Qc=r,r}const i2=.25,je=i=>Zn[i]<=Zn[Qc]+i2,r2=(i,t,e,n)=>{io(t,e,n);const r=i.name,s=r.endsWith("L")?1:r.endsWith("R")?-1:0;return s!==0&&t*s<-.05?!1:r==="pelvis"?je(xi)||je(fr)||je(zs)||je(ns):r==="spine1"?je(xi)||je(fr):r==="spine2"?je(xi):r==="neck"?je(xi)||je(Hs):r==="head"?je(Hs):r==="jaw"||r.startsWith("foot")?!1:r.startsWith("tail")?je(zs):r.startsWith("arm")||r.startsWith("forearm")?je(no):r.startsWith("shin")?je(ns):r.startsWith("thigh")?je(ns)?!0:je(fr)&&n>-.4&&e<ks[1]+.8&&Math.abs(Math.abs(t)-ks[0])<1.35:!0},s2=Ys([0,15.95,0])[1],rd=(i,t)=>t>0?11.55-1*Math.max(0,1-i/1.05):11.55,a2=new Ut(1315352),Lu=new Ut(14855224),o2=new Ut(9062616),Pu=(i,t,e)=>1-Ll(t-e,t+e,Math.abs(i));function c2(i,t,e,n,r){r.copy(a2),i===xi&&r.lerp(Lu,Pu(e-(rd(Math.abs(t),n)-.15),.15,.08)),r.lerp(o2,Pu(e-(pi-.17),.28,.08)),i===fr&&r.lerp(Lu,1-Ll(hr+.34,hr+.5,e))}function sd(i,t,e){const n=Math.abs(i),r=io(i,t,e);if(r===fr)return t<hr+.42?3:t>pi-.45?5:2;if(r===xi){const s=rd(n,e);return t>s?0:t>s-.3?3:t<pi+.1&&t>pi-.45?5:2}return r===Hs?t>s2?1:0:r===no?t<6.9?1:0:r===zs?e<-3.2?1:0:r===ns&&t<4.1?4:0}function l2(i,t,e){const n=sd(i,t,e);if(n!==0&&n!==1)return 0;const r=io(i,t,e);if(r===Hs){const s=Math.abs(i)/Dn,a=Te[1]+(t-Te[1])/Dn,o=Te[2]+(e-Te[2])/Dn,c=Math.hypot(s-tn[0],a-tn[1],o-tn[2]);return c<Hi+.28||o>.95&&s<1&&Math.abs(a-fs[1])<.85?0:a>15.4?.6:.42*Math.min(1,(c-Hi-.28)/.45)}return r===xi?.45:r===no?t<7.4?1:.7:r===zs?1.1:.45}const ad=(i,t,e)=>J(ft(i/1.22,t,e,0,13.3,1.1,0,12.95,4.25,.82,.13)*.9,ft(i,t,e,0,13.75,1,0,13.3,3,.36,.25),.35);function h2(i,t,e){const n=Math.max(ad(i,t,e),$a(e)-t);return J(n,ft(i,t,e,0,12.92,4.05,0,12.58,4.38,.18,.07),.15)}const od=(i,t,e)=>ft(i/1.15,t,e,0,13,1.1,0,12.75,3.95,.62,.11)*.92,u2=(i,t,e)=>Math.max(od(i,t,e),t-$a(e)+.03),f2=2499628,tl=5903396,d2=13130354,Du=i=>(t,e,n,r)=>{const s=(i?od:ad)(Math.abs(t)+.09,e,n)<0&&n<3.8;!i&&s&&e<$a(n)+.05?r.setHex(tl):i&&s&&e>$a(n)-.08?r.setHex(Math.abs(t)<.3&&n>1.7?d2:tl):r.setHex(f2)};function p2(i,t,e){const n=Math.abs(i),r=.13+.42*Math.min(n,1.25),s=.1+.13*Math.sin(Math.PI*Math.min(1,n/1.3));let a=Math.max(Math.abs(t)-r,n-1.25,Math.abs(e)-s)-.07;return a=J(a,Lt(i,t,e,0,0,.04,.26,.3,.28),.08),J(a,ft(n,t,e*1.8,.08,-.1,0,.45,-.95,0,.13,.15),.08)}function m2(i,t,e){const n=Ln[1];let r=Math.max(Lt(i,t,e,0,.32-n,.65,.84,.4,1.72),-(t+n));return r=J(r,Lt(i,t,e,0,.78-n,.55,.74,.6,1.5),.2),r=J(r,Lt(i,t,e,0,.62-n,1.5,.7,.46,.85),.25),r=J(r,ft(i,t,e,0,.95-n,-.2,0,1.45-n,-.15,.62,.6),.3),Math.max(r,-ft(i,t,e,0,1.4-n,-.15,0,3-n,-.15,.47,.47))}const g2=8207568,ja=16052984,Ka=14855224;function v2(i,t,e,n){const r=t+Ln[1];r<.42||e>1.75&&r<.9||Math.abs(i)<.3&&e>.25&&e<1.55&&r>1?n.setHex(ja):e<-.75&&r>.95?n.setHex(Ka):n.setHex(g2)}function x2(){const e=new Uint8Array(131072),n=l=>[l>>16&255,l>>8&255,l&255],r=n(7616708),s=n(1446938),a=n(15905308),o=n(ja);for(let l=0;l<256;l++)for(let h=0;h<128;h++){const u=(l+.5)/256,d=(h+.5)/128*Math.PI*2,g=((u*3.6-.42*Math.abs(Math.sin(d)))%1.2+1.2)%1.2;let v=g<.36?r:g<.48?o:g<.66?s:g<.78?o:g<.92?a:o;u>.9&&(v=u>.94?r:s),e.set([v[0],v[1],v[2],255],(l*128+h)*4)}const c=new Qr(e,128,256,Ve);return c.colorSpace=un,c.wrapS=os,c.magFilter=ge,c.minFilter=Oi,c.generateMipmaps=!0,c.needsUpdate=!0,c}function Hr(i,t,e,n="head"){t.scale.multiplyScalar(Dn);const r=Ys(e);i.at(t,n,r[0],r[1],r[2])}function _2(i){const t=i.std({color:16514047,roughness:.15}),e=i.std({color:460300,roughness:.06}),n=i.std({color:16777215,emissive:16777215,emissiveIntensity:.8,roughness:.2});for(const A of[1,-1]){const R=new Pt(new Se(Hi,22,16),t),x=new Ue;x.rotation.set(.1,-A*.16,0);const M=new Pt(new Se(Hi+.012,22,6,0,Math.PI*2,0,.5),e);M.rotation.x=Math.PI/2,x.add(M);const S=new Pt(new Se(.075,8,6),n);S.position.set(A*.09,.12,Hi+.02),x.add(S),R.add(x),Hr(i,R,[A*tn[0],tn[1],tn[2]])}const r=i.std({color:Ka,roughness:.22,metalness:.9}),s=.7,a=tn[2]+Hi+.12,o=.32,c=new Ue;for(const A of[1,-1]){const R=new Pt(new qi(s,.085,10,44),r);R.rotation.y=A*o,R.position.set(A*tn[0],0,a),c.add(R);const x=new I(A*(tn[0]+s*Math.cos(o)),.05,a-s*Math.sin(o)),M=new I(A*1.86,.05,-.2),S=new Pt(new Sn(.06,.06,x.distanceTo(M),8),r);S.quaternion.setFromUnitVectors(new I(0,1,0),M.clone().sub(x).normalize()),S.position.copy(x).add(M).multiplyScalar(.5),c.add(S)}const l=new Pt(new qi(tn[0]-s*Math.cos(o),.075,8,16,Math.PI),r);l.position.set(0,.02,a+s*Math.sin(o)),c.add(l),Hr(i,c,[0,tn[1],0]);const h=i.std({vertexColors:!0,roughness:.3,metalness:.08}),u=new Pt(Bi(h2,{min:[-1.1,12.4,.9],max:[1.1,14.3,4.5]},36,Du(!1),12e3),h);u.position.set(-0,-13.6,-.25);const d=new Pt(Bi(u2,{min:[-.8,12.3,.9],max:[.8,13.15,4.1]},32,Du(!0),1e4),h);d.position.set(-0,-13.6,-.25);const f=new Ue;f.add(u),Hr(i,f,Te);const g=new Ue;g.add(d),Hr(i,g,Te,"jaw");const v=new Pt(new Se(1,16,10),i.std({color:tl,roughness:.6}));v.scale.set(.55,.36,.55),Hr(i,v,[0,fs[1]-.05,fs[2]+.35]);const m=new Pt(Bi(p2,{min:[-1.55,-1.05,-.35],max:[1.55,.75,.4]},30,void 0,1e4),i.std({color:Ka,roughness:.35,metalness:.55}));m.rotation.set(-.25,.15,-.55),Hr(i,m,[1,15.25,.45]);const p=new vi({map:x2(),roughness:.85,side:qe}),b=4.15,y=1.2,_=A=>fn[2]+(Ln[2]-fn[2])*(fn[1]-A)/(fn[1]-Ln[1]);for(const[A,R]of[["shinL",1],["shinR",-1]]){const x=new I(R*fn[0],y,_(y)),M=new I(R*fn[0],b,_(b)),S=new Pt(new Sn(.66,.53,x.distanceTo(M),40,1,!0),p);S.quaternion.setFromUnitVectors(new I(0,1,0),M.clone().sub(x).normalize());const T=x.add(M).multiplyScalar(.5);i.at(S,A,T.x,T.y,T.z)}const E=Bi(m2,{min:[-.95,-Ln[1]-.05,-1.2],max:[.95,.75,2.45]},28,v2,1e4),w=i.std({vertexColors:!0,roughness:.5});for(const[A,R]of[["footL",1],["footR",-1]])i.at(new Pt(E,w),A,R*Ln[0],Ln[1],Ln[2])}const M2={id:"violet",name:"Violet",blurb:"The Valkyries’ purple raven, in gold glasses",segs:J_,body:{sdf:n2,region:sd,box:Q_,palette:[8010952,2888776,1315352,Ka,ja,9062616],surface:"soft",capture:r2,fur:{length:1.2,density:2,tip:.3,feather:!0},furLen:l2,tint(i,t,e,n,r){const s=io(t,e,n);i>=2&&(s===xi||s===fr)&&c2(s,t,e,n,r),i>=2&&r.multiplyScalar(1.6),(i===0||i===1)&&n<-.6&&r.multiplyScalar(1-.18*Math.min(1,(-.6-n)/1.5))}},dress:_2,fit:{size:1.1,limb:.55},idle:{tail:.12},face:{jaw:.45,eyes:[[kr[0],kr[1],kr[2],Tu],[-kr[0],kr[1],kr[2],Tu]]},res:76,furShells:7},cd=[{name:"pelvis",a:[0,9.6,0],b:[0,10.6,0],parent:null},{name:"spine1",a:[0,10.6,0],b:[0,12.4,.1],parent:"pelvis"},{name:"spine2",a:[0,12.4,.1],b:[0,15,.1],parent:"spine1"},{name:"neck",a:[0,15,.1],b:[0,15.9,.15],parent:"spine2",reach:.8},{name:"head",a:[0,15.9,.15],b:[0,18.4,.3],parent:"neck"},{name:"jaw",a:[0,16.4,.9],b:[0,16.4,1.2],parent:"head",reach:0},{name:"tail1",a:[0,14.8,-1.2],b:[0,12.6,-1.4],parent:"spine2",reach:1},{name:"tail2",a:[0,12.6,-1.4],b:[0,10.4,-1.6],parent:"tail1",reach:1},{name:"tail3",a:[0,10.4,-1.6],b:[0,8.2,-1.8],parent:"tail2",reach:1},{name:"tail4",a:[0,8.2,-1.8],b:[0,6.2,-2],parent:"tail3",reach:1},{name:"thighL",a:[1.1,9.6,0],b:[1.2,5.3,.2],parent:"pelvis"},{name:"shinL",a:[1.2,5.3,.2],b:[1.2,1.1,-.1],parent:"thighL"},{name:"footL",a:[1.2,1.1,-.1],b:[1.2,.35,1.4],parent:"shinL"},{name:"thighR",a:[-1.1,9.6,0],b:[-1.2,5.3,.2],parent:"pelvis"},{name:"shinR",a:[-1.2,5.3,.2],b:[-1.2,1.1,-.1],parent:"thighR"},{name:"footR",a:[-1.2,1.1,-.1],b:[-1.2,.35,1.4],parent:"shinR"},{name:"armL",a:[2.4,14.6,0],b:[2.72,11.9,-.05],parent:"spine2"},{name:"forearmL",a:[2.72,11.9,-.05],b:[2.85,9.45,.4],parent:"armL"},{name:"armR",a:[-2.4,14.6,0],b:[-2.72,11.9,-.05],parent:"spine2"},{name:"forearmR",a:[-2.72,11.9,-.05],b:[-2.85,9.45,.4],parent:"armR"}],ld={min:[-4.2,-.4,-2.8],max:[4.2,20.4,2.6]};function b2(i,t,e,n){const r=Math.abs(i),s=1-.08*n;let a=Lt(i,t,e,0,13.35,.1,1.8*s,1.95,1.05*s);return a=J(a,Lt(r,t,e,.85*s,13.75,.75,.95*s,.68,.5),.45),a=J(a,Lt(i,t,e,0,13.75,-.35,1.95*s,1.3,.62),.4),a=J(a,ft(r,t,e,0,15.35,-.2,1.85*s,14.95,-.1,.5,.36),.5),a=J(a,Lt(i,t,e,0,11.6,.12,1.35*s,1.45,.92*s),.6),a=J(a,Lt(i,t,e,0,10,0,1.68*s,1,1.02*s),.6),a=J(a,Lt(r,t,e,.72,9.55,-.5,.82*s,.85,.62),.4),a=Math.max(a,-ft(i,t,e,0,14.6,-1.12,0,10.6,-.98,.16,.14)),a=J(a,ft(i,t,e,0,14.9,-.05,0,16.3,.12,.6,.52),.4),a=J(a,Lt(i,t,e,0,17.3,.1,.95,1.12,1.08),.3),a=J(a,Lt(i,t,e,0,16.55,.4,.74,.74,.82),.35),a=J(a,Lt(r,t,e,2.3*s,14.5,0,.7*s,.92,.78),.4),a=J(a,ft(r,t,e,2.4,14.4,0,2.72,11.95,-.05,.56*s,.42*s),.3),a=J(a,Lt(r,t,e,2.56,13.15,.12,.5*s,.95,.5*s),.3),a=J(a,ft(r,t,e,2.72,11.9,-.05,2.85,9.6,.38,.46*s,.3*s),.25),a=J(a,Lt(r,t,e,2.76,11.2,.05,.48*s,.8,.48*s),.3),a=J(a,Lt(r,t,e,2.87,9,.48,.24,.52,.42),.2),a=J(a,ft(r,t,e,2.8,9.35,.75,2.72,8.85,.95,.15,.12),.12),a=J(a,ft(r,t,e,1.02,9.6,0,1.15,5.45,.2,.9*s,.56*s),.45),a=J(a,Lt(r,t,e,1.12,7.7,.28,.8*s,1.6,.72*s),.4),a=J(a,Lt(r,t,e,.8,8.3,0,.55*s,1.3,.6),.4),a=J(a,_e(r,t,e,1.17,5.3,.32,.52*s),.3),a=J(a,ft(r,t,e,1.18,5.25,.15,1.2,1.15,-.1,.5*s,.3*s),.3),a=J(a,Lt(r,t,e,1.2,3.95,-.28,.56*s,1.3,.6*s),.35),a=J(a,Math.max(Lt(r,t,e,1.2,.5,.55,.46,.5,1.25),-t),.25),a}function hd(i,t,e,n,r=0){const s=Math.abs(i);let a=b2(i,t,e,n==="valkyrie"?1:0);if(n==="valkyrie"){a=J(a,Lt(i,t,e,0,13.6,.55,2.2,1.5,1),.4);{const o=Math.max(0,Math.min(1,(10.8-t)/3.4)),c=1.6+.75*o,l=Math.hypot(i/1.05,e/.8)-c;a=Math.min(a,Math.max(l,Math.abs(t-9.1)-1.7,-(Math.hypot(i/1.05,e/.8)-c+.32)))}a=J(a,_e(s,t,e,2.38,14.9,0,1),.3),a=J(a,ft(s,t,e,1.2,4.6,.35,1.2,1.4,.2,.75,.62),.2),a=J(a,_e(i,t,e,0,17,.25,1.32),.3),a=J(a,Lt(i,t,e,0,17.4,.2,1.42,1,1.42),.2);for(let o=0;o<3;o++)a=J(a,ft(s,t,e,1.3,17.6+o*.25,.2-o*.35,2.3+o*.25,19+o*.35,-1-o*.5,.32-o*.06,.1),.2);a=J(a,ft(i,t,e,0,16.6,-1.1,0,12.6,-1.5,.42,.26),.3);{const o=2.3+(14.8-t)*.12;a=Math.min(a,Math.max(Math.abs(i)-o,Math.abs(e+1.75+(14.8-t)*.03)-.2,t-14.8,4.6-t)-.08)}}else a=J(a,Lt(i,t,e,0,17.3,.12,1.08,1.24,1.18),.25),a=J(a,Lt(i,t,e,0,16.5,.45,.82,.72,.86),.25),a=J(a,ft(i,t,e,0,18.42,-.7,0,18.5,.85,.16,.12),.2),a=J(a,Lt(i,t,e,0,10.55,.05,1.55,.38,1.1),.15),a=J(a,Lt(i,t,e,0,10.55,1.05,.55,.42,.22),.1),a=J(a,ft(s,t,e,2.82,10.25,.3,2.86,9.5,.42,.4,.38),.15),a=J(a,ft(s,t,e,1.2,3.2,-.05,1.2,1,-.08,.52,.48),.2);return a-r}function ud(i,t,e,n){const r=Math.abs(i);if(n==="valkyrie")return t>17.6&&r>1.2||e<-.9&&t>12.4&&t<16.8&&r<.6?2:t>15.9&&t<17.2&&e>.6&&r<1?3:t>16.9&&t<17.3&&e>.6||Math.abs(t-10.85)<.25||t<7.6&&t>7.3||t>13.5&&t<14&&e>.8||r>2&&Math.abs(t-14.9)<.35?1:0;if(t>16.75&&t<17.5&&e>.9&&r<.95)return 2;if(Math.abs(t-10.6)<.45&&e>-1.5)return 3;if(t<3.2||t<10.4&&r>2.3&&t>8.2)return 1;if(e>.7&&r<1.7){const s=t-12.6-r*.55;if(s>0&&s<.35||s>.75&&s<1.1)return 1}return 0}const y2=[{name:"pelvis",a:[0,9.4,-.6],b:[0,10.4,0],parent:null},{name:"spine1",a:[0,10.4,0],b:[0,12.6,.8],parent:"pelvis"},{name:"spine2",a:[0,12.6,.8],b:[0,14.8,1.9],parent:"spine1"},{name:"neck",a:[0,14.8,1.9],b:[0,16,3],parent:"spine2",reach:1.6},{name:"head",a:[0,16,3],b:[0,16.6,5.8],parent:"neck"},{name:"jaw",a:[0,15.5,3.9],b:[0,15.3,6.6],parent:"head",reach:.8},{name:"tail1",a:[0,9.2,-1.6],b:[0,8.2,-3.6],parent:"pelvis",reach:1.8},{name:"tail2",a:[0,8.2,-3.6],b:[0,6.8,-5.2],parent:"tail1",reach:1.8},{name:"tail3",a:[0,6.8,-5.2],b:[0,5.3,-6.4],parent:"tail2",reach:1.6},{name:"tail4",a:[0,5.3,-6.4],b:[0,4,-7.2],parent:"tail3",reach:1.4},{name:"thighL",a:[1.6,9.2,-.3],b:[1.9,6,1.3],parent:"pelvis"},{name:"shinL",a:[1.9,6,1.3],b:[1.9,2.8,-.9],parent:"thighL"},{name:"footL",a:[1.9,2.8,-.9],b:[1.9,.4,1],parent:"shinL"},{name:"thighR",a:[-1.6,9.2,-.3],b:[-1.9,6,1.3],parent:"pelvis"},{name:"shinR",a:[-1.9,6,1.3],b:[-1.9,2.8,-.9],parent:"thighR"},{name:"footR",a:[-1.9,2.8,-.9],b:[-1.9,.4,1],parent:"shinR"},{name:"armL",a:[2.7,14.3,1.6],b:[3.3,11.2,2],parent:"spine2"},{name:"forearmL",a:[3.3,11.2,2],b:[3.2,8.2,3.2],parent:"armL"},{name:"armR",a:[-2.7,14.3,1.6],b:[-3.3,11.2,2],parent:"spine2"},{name:"forearmR",a:[-3.3,11.2,2],b:[-3.2,8.2,3.2],parent:"armR"}],S2={min:[-5,-.5,-8.6],max:[5,20.4,8.6]},ln=[.62,17.05,4.75],Iu=[0,16.35,7.35];function w2(i,t,e,n=0){const r=Math.abs(i);let s=Lt(i,t,e,0,13.4,1.4,2.6,2.5,2.1);s=J(s,Lt(i,t,e,0,11.2,.4,1.7,1.6,1.4),.9),s=J(s,Lt(i,t,e,0,9.8,-.4,2,1.2,1.5),.7),s=J(s,Lt(i,t,e,0,15.1,1.6,2.3,1.5,2),.8),s=J(s,_e(r,t,e,2.5,14.2,1.5,1.05),.7);let a=Lt(i,t,e,0,16.9,3.6,1.35,1.25,1.55);a=J(a,ft(i,t,e,0,16.7,4.6,0,16.3,7.1,.82,.45),.5),a=J(a,ft(i,t,e,0,15.8,4.4,0,15.75,6.7,.55,.32),.35),a=J(a,Lt(r,t,e,1.15,16.5,3.6,.55,.75,.9),.4),a=J(a,ft(r,t,e,.75,17.8,3.1,1.05,19.4,2.7,.5,.06),.3),a=Math.max(a,-_e(r,t,e,ln[0],ln[1],ln[2]+.12,.3)),s=J(s,a,.6),s=J(s,ft(r,t,e,2.7,14.3,1.6,3.3,11.2,2,.9,.72),.5),s=J(s,ft(r,t,e,3.3,11.2,2,3.2,8.4,3.1,.78,.55),.35),s=J(s,Lt(r,t,e,3.2,7.9,3.35,.55,.75,.55),.3),s=J(s,ft(r,t,e,1.6,9.2,-.3,1.9,6,1.3,1.25,.85),.6),s=J(s,ft(r,t,e,1.9,6,1.3,1.9,2.8,-.9,.75,.48),.4),s=J(s,ft(r,t,e,1.9,2.8,-.9,1.9,.5,.9,.5,.42),.3);const o=[[0,9.2,-1.6,.6],[0,8.2,-3.6,1],[0,6.8,-5.2,1.15],[0,5.3,-6.4,.9],[0,4,-7.2,.35]];for(let c=0;c+1<o.length;c++){const l=o[c],h=o[c+1];s=J(s,ft(i,t,e,l[0],l[1],l[2],h[0],h[1],h[2],l[3],h[3]),.5)}s-=n;for(const c of[-1.5,-.5,.5,1.5])s=J(s,ft(r,t,e,3.2+c*.17,7.4,3.5,3.2+c*.22,6.5,3.85,.17,.03),.1);for(const c of[-1,0,1])s=J(s,ft(r,t,e,1.9+c*.28,.4,1.2,1.9+c*.34,.1,1.85,.2,.03),.1);return s}function fd(i,t,e){const n=Math.abs(i);return Math.hypot(i,t-Iu[1],e-Iu[2])<.45||t<7.6&&t>6.2&&e>3.4&&n>2.6||t<.5&&e>1.2?3:t>17.4&&n>.6&&e<3.2||e<-6.3?2:t>15.4&&t<16.4&&e>4.4||t>14.6&&t<15.8&&e>2.8&&n<1.2||e>2.2&&t>10.2&&t<15&&n<1.8?1:t>12.4&&e<.8&&n<1.9&&t>12.4+.5*n?2:0}function E2(i,t,e){const n=Math.abs(i);return fd(i,t,e)===3||Math.hypot(n-ln[0],t-ln[1],e-ln[2])<.65?0:e>4.6&&t>15.2?.35:t>17.6?.4:t>14&&t<16.4&&e<3.4||e<-1.4&&t<9.6?1.4:t<3?.45:1}const T2=[{name:"pelvis",a:[0,7.6,-.4],b:[0,8.8,0],parent:null},{name:"spine1",a:[0,8.8,0],b:[0,10.8,.3],parent:"pelvis"},{name:"spine2",a:[0,10.8,.3],b:[0,12.6,.6],parent:"spine1"},{name:"neck",a:[0,12.6,.6],b:[0,15.6,1.3],parent:"spine2",reach:1.9},{name:"head",a:[0,15.6,1.3],b:[0,17.6,2.4],parent:"neck"},{name:"jaw",a:[0,15.9,2.6],b:[0,15.7,4.4],parent:"head",reach:.7},{name:"tail1",a:[0,7.4,-2.6],b:[0,6.8,-3.6],parent:"pelvis",reach:1.4},{name:"tail2",a:[0,6.8,-3.6],b:[0,6.2,-4.5],parent:"tail1",reach:1.4},{name:"tail3",a:[0,6.2,-4.5],b:[0,5.7,-5.2],parent:"tail2",reach:1.2},{name:"tail4",a:[0,5.7,-5.2],b:[0,5.3,-5.7],parent:"tail3",reach:1},{name:"thighL",a:[1.4,7.4,0],b:[1.5,4.6,.3],parent:"pelvis"},{name:"shinL",a:[1.5,4.6,.3],b:[1.5,.9,-.2],parent:"thighL"},{name:"footL",a:[1.5,.9,-.2],b:[1.5,.3,1.8],parent:"shinL"},{name:"thighR",a:[-1.4,7.4,0],b:[-1.5,4.6,.3],parent:"pelvis"},{name:"shinR",a:[-1.5,4.6,.3],b:[-1.5,.9,-.2],parent:"thighR"},{name:"footR",a:[-1.5,.9,-.2],b:[-1.5,.3,1.8],parent:"shinR"},{name:"armL",a:[2.7,11.6,.2],b:[3.3,9.2,-.1],parent:"spine2"},{name:"forearmL",a:[3.3,9.2,-.1],b:[3.2,7,.3],parent:"armL"},{name:"armR",a:[-2.7,11.6,.2],b:[-3.3,9.2,-.1],parent:"spine2"},{name:"forearmR",a:[-3.3,9.2,-.1],b:[-3.2,7,.3],parent:"armR"}],A2={min:[-5,-.4,-7.2],max:[5,21.4,6.6]},hn=[.72,17.25,2.75];function R2(i,t,e,n=0){const r=Math.abs(i);let s=Lt(i,t,e,0,9.2,-.2,3.3,3.5,3);s=J(s,Lt(i,t,e,0,11.4,.5,2.5,2.2,2.3),1),s=J(s,ft(i,t,e,0,12.2,.5,0,15.8,1.4,1.25,.95),.8);let a=_e(i,t,e,0,16.9,1.8,1.55);a=J(a,ft(i,t,e,0,16.55,2.9,0,16.1,5,.72,.18),.3),a=J(a,ft(i,t,e,0,15.85,2.8,0,15.75,4.4,.5,.14),.25);for(const[o,c]of[[0,1],[.6,.82],[-.6,.82]])a=J(a,ft(i,t,e,o*.5,18.1,1.6,o*1.3,18.1+2.7*c,1-.7*c,.34,.12),.3);a=Math.max(a,-_e(r,t,e,hn[0],hn[1],hn[2],.5)),s=J(s,a,.5),s=J(s,Lt(r,t,e,3,9.8,0,.75,2.6,1.7),.7);for(const o of[-1,0,1])s=J(s,ft(r,t,e,3.2,8.4,o*.6,3.25,6.6+Math.abs(o)*.4,o*.75+.2,.42,.14),.3);for(const o of[-1,0,1])s=J(s,ft(i,t,e,o*.3,7.6,-2.6,o*1.1,7+(1-Math.abs(o))*.5,-5.6,.5,.2),.4);s=J(s,ft(r,t,e,1.4,7.4,0,1.5,4.8,.3,1,.55),.5),s=J(s,ft(r,t,e,1.5,4.8,.3,1.5,1,-.2,.42,.36),.25),s-=n;for(const o of[-1,0,1])s=J(s,ft(r,t,e,1.5,.5,.1,1.5+o*.85,.3,2-Math.abs(o)*.3,.34,.16),.2);return s=J(s,ft(r,t,e,1.5,.5,-.2,1.5,.3,-1.1,.3,.14),.15),s}function dd(i,t,e){const n=Math.abs(i);return t>15.6&&t<17.1&&e>2.6&&n<.85||t<5&&n>.9&&n<2.6||t<1?3:t>18.4||e<-4.6?2:e>1.2&&t>9.4&&t<13.4&&n<1.8||e>2.2&&t>16.2&&t<18.2&&n<1.25?1:0}function C2(i,t,e){const n=Math.abs(i),r=dd(i,t,e);return r===3||Math.hypot(n-hn[0],t-hn[1],e-hn[2])<.9?0:r===2?.6:t>16?.45:t>14.6&&e>1.6?.3:t>12.2?1.25:e<-2.4?1.4:1}const Pl=[{name:"pelvis",a:[0,9.2,0],b:[0,10.4,0],parent:null},{name:"spine1",a:[0,10.4,0],b:[0,12.4,.1],parent:"pelvis"},{name:"spine2",a:[0,12.4,.1],b:[0,15.4,.2],parent:"spine1"},{name:"neck",a:[0,15.4,.2],b:[0,16.2,.3],parent:"spine2",reach:.9},{name:"head",a:[0,16.2,.3],b:[0,18.4,.6],parent:"neck"},{name:"jaw",a:[0,16.4,1.2],b:[0,16.4,1.6],parent:"head",reach:0},{name:"tail1",a:[0,9.2,-.5],b:[0,9,-1],parent:"pelvis",reach:0},{name:"tail2",a:[0,9,-1],b:[0,8.8,-1.5],parent:"tail1",reach:0},{name:"tail3",a:[0,8.8,-1.5],b:[0,8.6,-2],parent:"tail2",reach:0},{name:"tail4",a:[0,8.6,-2],b:[0,8.4,-2.5],parent:"tail3",reach:0},{name:"thighL",a:[2.1,9.2,0],b:[2.3,5.2,.3],parent:"pelvis"},{name:"shinL",a:[2.3,5.2,.3],b:[2.3,1.2,-.1],parent:"thighL"},{name:"footL",a:[2.3,1.2,-.1],b:[2.3,.4,1.8],parent:"shinL"},{name:"thighR",a:[-2.1,9.2,0],b:[-2.3,5.2,.3],parent:"pelvis"},{name:"shinR",a:[-2.3,5.2,.3],b:[-2.3,1.2,-.1],parent:"thighR"},{name:"footR",a:[-2.3,1.2,-.1],b:[-2.3,.4,1.8],parent:"shinR"},{name:"armL",a:[4.1,14.7,.2],b:[4.5,11.6,.4],parent:"spine2"},{name:"forearmL",a:[4.5,11.6,.4],b:[4.5,8.4,1],parent:"armL"},{name:"armR",a:[-4.1,14.7,.2],b:[-4.5,11.6,.4],parent:"spine2"},{name:"forearmR",a:[-4.5,11.6,.4],b:[-4.5,8.4,1],parent:"armR"}],L2={min:[-6.4,-.4,-4.4],max:[6.4,19.8,4]};function De(i,t,e,n,r,s,a,o,c,l){const h=Math.abs(i-n)-a+l,u=Math.abs(t-r)-o+l,d=Math.abs(e-s)-c+l;return Math.hypot(Math.max(h,0),Math.max(u,0),Math.max(d,0))+Math.min(Math.max(h,u,d),0)-l}function Uu(i,t,e,n,r,s,a,o,c){const l=Math.abs(i-n)-a+c,h=Math.hypot(t-r,e-s)-o+c;return Math.hypot(Math.max(l,0),Math.max(h,0))+Math.min(Math.max(l,h),0)-c}function pd(i,t,e,n,r,s,a,o){let c=i-n,l=t-r,h=e-s;const u=Math.cos(a),d=Math.sin(a);[c,h]=[c*u-h*d,c*d+h*u];const f=Math.cos(o),g=Math.sin(o);return[c,l]=[c*f+l*g,-c*g+l*f],[c,l,h]}const Qe={hx:1.5,hy:14.6,hz:-2.15,yaw:.4,roll:.62,w:1.1,h:.85,t:.12};function P2(i,t,e){const[n,r,s]=pd(i,t,e,Qe.hx,Qe.hy,Qe.hz,Qe.yaw,Qe.roll);return De(n,r,s,Qe.w,Qe.h,0,Qe.w,Qe.h,Qe.t,.1)}function D2(i,t,e,n=0){const r=Math.abs(i);let s=1e9;{const a=De(i,t,e,0,13.75,.25,2.9,1.75,1.75,.3),o=(e-(2-Math.max(0,t-13.4)*.6))*.86;s=Math.max(a,o)}return s=J(s,De(i,t,e,0,12.2,.3,2.3,.6,1.5,.3),.3),s=Math.min(s,De(i,t,e,0,12.55,1.95,2.5,.22,.28,.1)),s=Math.min(s,De(r,t,e,2.2,13.1,1.92,.42,.26,.15,.08)),s=Math.min(s,De(i,t,e,0,11.1,.75,1.15,.9,.55,.25)),s=J(s,De(i,t,e,0,11,0,1.2,1,1.05,.3),.2),s=J(s,De(i,t,e,0,9.75,0,2.2,.75,1.4,.3),.25),s=Math.min(s,De(i,t,e,0,9.45,1.35,.7,.7,.25,.15)),s=Math.min(s,De(i,t,e,0,13.5,-1.85,2.2,1.6,.55,.25)),s=Math.min(s,P2(r,t,e)),s=Math.min(s,ft(i,t,e,0,15.3,.25,0,16.3,.35,.6,.55)),s=Math.min(s,De(i,t,e,0,17.25,.45,.82,.92,.9,.35)),s=Math.min(s,De(i,t,e,0,16.55,.95,.55,.38,.42,.18)),s=Math.min(s,De(i,t,e,0,18.2,.35,.12,.35,.75,.08)),s=Math.min(s,De(r,t,e,.95,17.55,.25,.12,.62,.3,.08)),s=Math.min(s,De(r,t,e,4.05,15.05,.2,1.15,.8,1.35,.3)),s=Math.min(s,Uu(r,t,e,5.4,14.7,.2,.32,.92,.12)),s=Math.min(s,_e(r,t,e,4.1,14.4,.2,.75)),s=Math.min(s,ft(r,t,e,4.1,14.2,.2,4.5,11.8,.4,.62,.58)),s=Math.min(s,_e(r,t,e,4.5,11.6,.4,.72)),s=Math.min(s,De(r,t,e,4.55,10,.6,.9,1.5,1,.3)),s=Math.min(s,De(r,t,e,4.55,8.05,1,.75,.75,.8,.28)),s=Math.min(s,ft(r,t,e,2.1,9.1,0,2.3,5.6,.25,1.05,.95)),s=Math.min(s,De(r,t,e,2.3,5.25,.85,.85,.75,.55,.25)),s=Math.min(s,De(r,t,e,2.3,3,.05,1.25,2.15,1.35,.35)),s=Math.min(s,Uu(r,t,e,3.75,2.6,-.35,.3,.9,.12)),s=Math.min(s,De(r,t,e,2.3,.5,.65,1.15,.5,2,.2)),s-n}function I2(i,t,e){const n=Math.abs(i);if(n>5&&Math.hypot(t-14.7,e-.2)<1)return Math.hypot(t-14.7,e-.2)<.42?1:5;if(n>3.38&&Math.hypot(t-2.6,e+.35)<.98)return Math.hypot(t-2.6,e+.35)<.4?1:5;if(t>16.95&&t<17.3&&e>1.2&&n>.12&&n<.62||t>12.85&&t<13.35&&e>1.95&&n>1.85&&n<2.6)return 2;if(t>13.55&&t<15.35&&n<2.55&&n>.18&&e>1.75-Math.max(0,t-13.4)*.6)return 4;if(t>16.15&&t<16.95&&e>1.25&&n<.6)return 6;if(e<-1.9&&t>13.8){const[r,s,a]=pd(n,t,e,Qe.hx,Qe.hy,Qe.hz,Qe.yaw,Qe.roll);if(Math.abs(a)<.3&&r>.25&&r<1.75&&s>.85&&s<1.5)return 4}return t>12.3&&t<12.8&&e>1.65||t>14.25&&t<15.9&&n>2.9&&n<5.15||t>4.5&&t<6&&e>.4&&n>1.4&&n<3.2||t<1.1&&e>1.6||t>17.9&&n<.2?1:Math.hypot(n-4.1,t-14.4,e-.2)<.85&&t<14.25||Math.hypot(n-4.5,t-11.6,e-.4)<.8||t>15.2&&t<16.2&&n<.7||t>10.2&&t<11.6&&e<1.25&&n<1.25?3:0}function pe(i,t,e,n,r,s,a,o,c,l){const h=Math.abs(i-n)-a+l,u=Math.abs(t-r)-o+l,d=Math.abs(e-s)-c+l;return Math.hypot(Math.max(h,0),Math.max(u,0),Math.max(d,0))+Math.min(Math.max(h,u,d),0)-l}const U2={min:[-6.8,-.4,-4.6],max:[6.8,20.2,5]};function N2(i,t,e,n=0){const r=Math.abs(i);let s=1e9;s=Math.min(s,pe(i,t,e,0,13.6,.2,3.1,2.1,2,.5)),s=Math.min(s,Lt(i,t,e,0,14.3,2.15,1.05,.7,.75)),s=Math.min(s,pe(i,t,e,0,12.4,2,.9,1,.4,.3)),s=Math.min(s,pe(r,t,e,1.7,15.6,-2.3,.18,2.4,1.1,.12)),s=Math.min(s,pe(i,t,e,0,13,-2.3,2.2,1.6,.6,.3)),s=J(s,pe(i,t,e,0,11.2,.1,1.9,1.1,1.35,.35),.3),s=J(s,pe(i,t,e,0,9.7,0,2.5,.95,1.55,.3),.3),s=Math.min(s,pe(i,t,e,0,9.4,1.4,.8,.9,.35,.2)),s=Math.min(s,ft(i,t,e,0,15.3,.2,0,16.4,.3,.75,.7)),s=Math.min(s,pe(i,t,e,0,17.2,.4,1,1,1.1,.4)),s=Math.min(s,pe(i,t,e,0,16.6,1.25,.65,.45,.35,.15)),s=Math.min(s,pe(i,t,e,0,18.6,.3,.13,.75,.9,.08)),s=Math.min(s,ft(r,t,e,.95,17.7,.4,1.5,18.5,.2,.2,.08)),s=Math.min(s,pe(r,t,e,4.2,15.4,.1,1.55,.85,1.7,.35)),s=Math.min(s,ft(r,t,e,4.2,15.5,1.6,4.2,15.5,3.9,.3,.26)),s=Math.min(s,_e(r,t,e,4.1,14.4,.2,1)),s=Math.min(s,ft(r,t,e,4.1,14.2,.2,4.5,11.8,.4,.85,.8)),s=Math.min(s,_e(r,t,e,4.5,11.6,.4,.9)),s=Math.min(s,pe(r,t,e,4.8,10,.6,1,1.7,1.3,.3)),s=Math.min(s,pe(r,t,e,5.85,10,.6,.22,1.8,1.35,.18)),s=Math.min(s,pe(r,t,e,4.75,7.9,1,.85,.85,.95,.3)),s=Math.min(s,ft(r,t,e,2.1,9.1,0,2.3,5.8,.25,1.15,1.1)),s=Math.min(s,pe(r,t,e,2.3,5.4,.6,1.15,1.05,1,.3)),s=Math.min(s,pe(r,t,e,2.3,3,0,1.2,2,1.25,.3));for(const a of[3.8,1.9])s=Math.min(s,ft(r,t,e,3.35,a,-.4,3.75,a,-.4,.75,.75));return s=Math.min(s,pe(r,t,e,2.3,.55,.65,1.15,.55,2,.2)),s-n}function F2(i,t,e){const n=Math.abs(i),r=i>0;return t>13.7&&t<15&&e>1.6&&n<1.1||t>16.5&&t<17&&e>1.4&&n<.5&&n>.12?2:n>3.9&&n<4.5&&t>15.1&&t<15.9&&e>1.7||n>5.55&&t>8.2&&t<11.8||n>3.1&&t<4.6&&t>1.1&&e<.4||t>5.5&&t<6.3&&e>1.4&&n>1.3&&n<3.3||Math.hypot(n-4.1,t-14.4,e-.2)<1.05&&t<14.6||Math.hypot(n-4.5,t-11.6,e-.4)<.95&&t>11.3||t>10.7&&t<11&&n<2||t>8.6&&t<8.9&&n>1&&n<3.6?3:n>3.55&&t>6.4&&t<16.4||n>2.9&&t>11.4&&t<16.4?r?4:5:t<8.8&&n>.95?r?6:7:t>15.2||n>1.4&&n<2&&e<-1.2||t<11.3||e<-1.7?1:0}const O2={min:[-7.6,-.4,-6.6],max:[7.6,21,4.4]};function B2(i,t,e,n,r,s,a,o,c,l,h,u){const d=(r+o)/2;return ft(i,d+(t-d)/u,e,n,r,s,a,o,c,l,h)*u}function k2(i,t,e,n,r,s,a,o,c,l,h,u){const d=(n+a)/2;return ft(d+(i-d)/u,t,e,n,r,s,a,o,c,l,h)*u}function H2(i,t,e,n=0){const r=Math.abs(i);let s=1e9;return s=Math.min(s,pe(i,t,e,0,13.7,.1,2.5,1.9,1.7,.6)),s=Math.min(s,Lt(i,t,e,0,14.4,1.75,.95,.75,.85)),s=J(s,pe(i,t,e,0,11.4,0,1.5,1.2,1.15,.4),.4),s=J(s,pe(i,t,e,0,9.8,0,2.2,.85,1.35,.35),.3),s=Math.min(s,ft(i,t,e,0,15.2,-2,0,10.8,-2.3,.75,.2)),s=Math.min(s,B2(r,t,e,1.4,13.6,-2.2,6.8,12.4,-5.6,1.9,.4,.17)),s=Math.min(s,k2(r,t,e,1.5,14.2,-2.4,1.65,17.8,-3.7,.95,.22,.2)),s=Math.min(s,pe(r,t,e,3.4,15.2,.2,1.15,.9,1.5,.3)),s=Math.min(s,pe(r,t,e,3.4,16.4,-.1,.85,.45,1.1,.2)),s=Math.min(s,ft(i,t,e,0,15.3,.1,0,16.3,.2,.6,.55)),s=Math.min(s,Lt(i,t,e,0,17.1,.35,.85,1,1.15)),s=Math.min(s,ft(r,t,e,.45,17.8,.6,1,19.4,-.9,.16,.05)),s=Math.min(s,_e(r,t,e,4.1,14.5,.2,.8)),s=Math.min(s,ft(r,t,e,4.1,14.3,.2,4.5,11.8,.4,.65,.6)),s=Math.min(s,_e(r,t,e,4.5,11.6,.4,.7)),s=Math.min(s,pe(r,t,e,4.5,10,.6,.8,1.6,.85,.3)),s=Math.min(s,pe(r,t,e,4.5,8,.95,.6,.65,.6,.25)),s=Math.min(s,ft(r,t,e,2.1,9.1,0,2.3,5.6,.25,1.1,1)),s=Math.min(s,pe(r,t,e,2.3,5.2,.7,.75,.65,.5,.25)),s=Math.min(s,ft(r,t,e,2.3,4.8,-.1,2.3,1.7,-.3,1.25,1.15)),s=Math.min(s,ft(r,t,e,2.3,1.6,-.6,2.3,1.1,-1.4,1,1.1)),s=Math.min(s,pe(r,t,e,2.3,.45,.9,.75,.45,1.5,.2)),s-n}function z2(i,t,e){const n=Math.abs(i);return t>13.8&&t<15.1&&e>1.2&&n<1||t>16.8&&t<17.4&&e>1&&n<.75?2:t<1.9&&e<-.9||Math.hypot(n-4.1,t-14.5,e-.2)<.85&&t<14.5||Math.hypot(n-4.5,t-11.6,e-.4)<.75||t>10.4&&t<10.8&&n<1.6?3:n>2.5&&n<4.3&&t>16&&t<16.9||e<-1.9&&n>1.5&&n<7&&Math.abs(t-(13.6-(n-1.4)*.22))<.3||t>12.6&&t<13&&n<2.3&&e>.8?4:n>3.6&&t<13.8&&t>7.2||t<5&&n>1?1:0}function yr(i){const t=!!i.mech,e=!!i.cape,n=i.tail??null;return(r,s,a,o)=>r.name.startsWith("thigh")?o>-1.6&&a<r.a[1]+(t?1.4:.8)&&Math.abs(Math.abs(s)-Math.abs(r.a[0]))<(a<r.a[1]+.3?t?1.45:1.3:t?1.4:.9):r.name.startsWith("tail")?n!==null?o<n:e&&o<-1.55:!t&&(r.name.startsWith("arm")||r.name.startsWith("forearm"))?Math.abs(s)>2&&o>-1.2:t&&r.name.startsWith("arm")?o>-1.5:!0}const md=(i,t,e=2.2)=>i.std({color:t,emissive:t,emissiveIntensity:e,roughness:.3}),V2={id:"crimson",name:"Crimson",blurb:"A suited hero, visor and all",segs:cd,body:{sdf:(i,t,e)=>hd(i,t,e,"crimson"),region:(i,t,e)=>ud(i,t,e,"crimson"),box:ld,palette:[13114922,16053492,1052692,12633292],surface:"suit",capture:yr({})},dress(i){const t=i.std({color:526348,roughness:.08,metalness:.6});for(const e of[-1,1]){const n=new Pt(new nn(1,.38,.4),t);n.rotation.set(0,e*.42,e*-.32),i.at(n,"head",e*.46,17.12,1.12)}},fit:{size:1.08,limb:.7},face:{eyes:[[.46,17.12,1.35,.32],[-.46,17.12,1.35,.32]]}},G2={id:"valkyrie",name:"Valkyrie",blurb:"Winged helm, spear and shield",segs:cd,body:{sdf:(i,t,e)=>hd(i,t,e,"valkyrie"),region:(i,t,e)=>ud(i,t,e,"valkyrie"),box:ld,palette:[7028640,14725184,15657716,15251606],surface:"suit",capture:yr({cape:!0})},dress(i){const t=i.std({color:1708064,roughness:.2});for(const h of[-1,1]){const u=new Pt(new Se(.17,12,8),t);u.scale.set(1,1.3,.6),i.at(u,"head",h*.42,16.8,1.5)}const e=i.std({color:5916210,roughness:.6}),n=i.std({color:14211296,roughness:.25,metalness:.85}),r=new Ue;r.add(new Pt(new Sn(.16,.16,17,10),e));const s=new Pt(new br(.42,2.4,10),n);s.position.y=9.6,r.add(s),i.at(r,"forearmR",-2.9,11,.85);const a=new Ue,o=new Pt(new Sn(2.1,2.1,.3,28),i.std({color:7028640,roughness:.4,metalness:.3}));o.rotation.z=Math.PI/2,a.add(o);const c=new Pt(new qi(2.1,.16,8,32),i.std({color:14725184,roughness:.3,metalness:.7}));c.rotation.y=Math.PI/2,a.add(c);const l=new Pt(new Se(.55,14,10),n);l.position.x=.2,a.add(l),i.at(a,"forearmL",3.38,10.4,.45)},fit:{size:1.08,limb:.7},idle:{tail:.05}},W2=y2.map(i=>/^(arm|forearm)/.test(i.name)?{...i,reach:1.95}:i),X2={id:"howler",name:"Howler",blurb:"A wolf man with amber eyes",segs:W2,body:{sdf:(i,t,e)=>w2(i,t,e),region:fd,box:S2,palette:[7827562,12103584,3420204,1183760],capture:yr({tail:-1.5}),fur:{length:.8,density:7,tip:.22},furLen:E2},dress(i){const t=md(i,16756768,1.8);for(const e of[-1,1]){const n=new Pt(new Se(.24,12,8),t);n.scale.set(1.2,.8,.8),i.at(n,"head",e*ln[0],ln[1],ln[2])}},fit:{size:1.1,limb:.6},idle:{tail:.25},face:{jaw:.45,eyes:[[ln[0],ln[1],ln[2]+.12,.3],[-.62,ln[1],ln[2]+.12,.3]]}},q2={id:"plume",name:"Plume",blurb:"A big, friendly, feathered bird",segs:T2,body:{sdf:(i,t,e)=>R2(i,t,e),region:dd,box:A2,palette:[16036872,16770976,15224972,15762468],surface:"soft",capture:yr({tail:-2.4}),fur:{length:1.5,density:1.6,tip:.3,feather:!0},furLen:C2},dress(i){const t=i.std({color:16316660,roughness:.2}),e=i.std({color:657936,roughness:.1});for(const n of[-1,1]){const r=new Pt(new Se(.52,18,12),t),s=new Pt(new Se(.24,12,8),e);s.position.set(-n*.1,.02,.36),s.scale.set(1,1.2,.6),r.add(s),i.at(r,"head",n*hn[0],hn[1],hn[2])}},fit:{size:1.12,limb:.5},idle:{tail:.15},face:{jaw:.4,eyes:[[hn[0],hn[1],hn[2]+.45,.5],[-.72,hn[1],hn[2]+.45,.5]]}};function Dl(i,t){return e=>{const n=md(e,t);if(i==="bastion"){for(const a of[-1,1]){const o=new Pt(new nn(.42,.2,.1),n);o.rotation.z=a*-.12,e.at(o,"head",a*.36,17.12,1.36);const c=new Pt(new nn(.62,.36,.1),n);e.at(c,"spine2",a*2.2,13.1,2.08)}return}const r=i==="unison",s=new Pt(new Se(1,20,12),n);if(s.scale.set(r?.95:.85,r?.55:.6,r?.45:.35),e.at(s,"spine2",0,14.35,r?2.55:1.95),r)for(const a of[-1,1]){const o=new Pt(new nn(.42,.16,.1),n);o.rotation.z=a*.25,e.at(o,"head",a*.32,16.85,1.62)}else e.at(new Pt(new nn(1.3,.3,.12),n),"head",0,17.1,1.42);if(r){const a=e.std({color:14673130,roughness:.2,metalness:.9}),o=e.std({color:14198832,roughness:.3,metalness:.8}),c=new Ue,l=new Pt(new nn(.22,8,.9),a);l.position.y=-4.5,c.add(l);const h=new Pt(new br(.64,1.4,4),a);h.rotation.z=Math.PI,h.position.y=-9.2,h.scale.set(.35,1,1),c.add(h),c.rotation.x=-.95;const u=new Pt(new nn(.5,.4,3),o);u.position.y=-.3,c.add(u);const d=new Pt(new Sn(.22,.22,1.6,8),o);d.position.y=.6,c.add(d),e.at(c,"forearmR",-4.75,8,2.1)}}}const Y2={id:"bastion",name:"Bastion",blurb:"An armoured truck that stands up",segs:Pl,body:{sdf:(i,t,e)=>D2(i,t,e),region:I2,box:L2,palette:[4871266,14262322,9431295,1842980,7118020,1316377,12896462],surface:"armour",weights:"rigid",capture:yr({mech:!0})},dress:Dl("bastion",9431295),fit:{size:1,limb:.6},face:{eyes:[[.4,17.12,1.5,.28],[-.4,17.12,1.5,.28]]}},$2={id:"kestrel",name:"Kestrel",blurb:"A jet that stands up",segs:Pl,body:{sdf:(i,t,e)=>H2(i,t,e),region:z2,box:O2,palette:[15132908,5661306,16756800,1842980,13117498],surface:"armour",weights:"rigid",capture:yr({mech:!0})},dress:Dl("kestrel",16756800),fit:{size:1,limb:.6},face:{eyes:[[.36,17.12,1.56,.26],[-.36,17.12,1.56,.26]]}},j2={id:"unison",name:"Unison",blurb:"Five machines locked into one",segs:Pl,body:{sdf:(i,t,e)=>N2(i,t,e),region:F2,box:U2,palette:[15527666,2503274,8382719,1842980,15234090,2271388,15254056,12855866],surface:"armour",weights:"rigid",capture:yr({mech:!0})},dress:Dl("unison",8382719),fit:{size:1,limb:.6},face:{eyes:[[.34,16.9,1.72,.25],[-.34,16.9,1.72,.25]]}},Ye=[a_,m_,L_,K_,X2,V2,G2,M2,q2,Y2,$2,j2],bi=i=>Ye.find(t=>t.id===i)??Ye[0],K2=i=>new I(i.x,i.y,i.z),zr=(i,t,e)=>{const n=Math.min(1,Math.max(0,(e-i)/(t-i)));return n*n*(3-2*n)};function Nu(i,t){const e=t.clone().normalize(),n=new I().crossVectors(i,e).normalize(),r=new I().crossVectors(e,n).normalize();return new ze().setFromRotationMatrix(new ne().makeBasis(r,e,n))}function Z2(i,t){const e=i.clone().normalize(),n=new I().crossVectors(t,e).normalize(),r=new I().crossVectors(e,n).normalize();return new ze().setFromRotationMatrix(new ne().makeBasis(e,n,r))}function Fu(i){const t=_=>K2(i[_]),e=(..._)=>Math.min(..._.map(E=>i[E].v)),n=t(B.hipL),r=t(B.hipR),s=t(B.shL),a=t(B.shR),o=n.clone().add(r).multiplyScalar(.5),c=s.clone().add(a).multiplyScalar(.5),l=c.clone().sub(o),h=Nu(n.clone().sub(r),l),u=Nu(s.clone().sub(a),l),d=t(B.earL),f=t(B.earR),g=t(B.nose),v=d.clone().add(f).multiplyScalar(.5),m=Z2(d.clone().sub(f),g.clone().sub(v));m.multiply(new ze().setFromAxisAngle(new I(1,0,0),-.32));const p=(_,E)=>t(E).sub(t(_)).normalize(),b={armL:p(B.shL,B.elL),forearmL:p(B.elL,B.wrL),armR:p(B.shR,B.elR),forearmR:p(B.elR,B.wrR),thighL:p(B.hipL,B.knL),shinL:p(B.knL,B.anL),footL:p(B.heelL,B.toeL),thighR:p(B.hipR,B.knR),shinR:p(B.knR,B.anR),footR:p(B.heelR,B.toeR)},y={armL:e(B.shL,B.elL),forearmL:e(B.elL,B.wrL),armR:e(B.shR,B.elR),forearmR:e(B.elR,B.wrR),thighL:e(B.hipL,B.knL),shinL:e(B.knL,B.anL),footL:e(B.heelL,B.toeL),thighR:e(B.hipR,B.knR),shinR:e(B.knR,B.anR),footR:e(B.heelR,B.toeR)};return{pelvis:h,chest:u,head:m,headVis:e(B.earL,B.earR,B.nose),neck:v.sub(c).normalize(),dir:b,vis:y}}const J2={armL:new I(1,0,0),armR:new I(-1,0,0),thighL:new I(0,-1,0),thighR:new I(0,-1,0),neck:new I(0,1,0)},Ou={forearmL:"armL",forearmR:"armR",shinL:"thighL",shinR:"thighR",footL:"shinL",footR:"shinR"};class Q2{bones;rest=new Map;qm=new Map;hipRest;pelvisA;torso;len=new Map;segs;constructor(t,e){this.segs=t,this.bones=e;const n=l=>t.find(h=>h.name===l);for(const l of t){const h=new I(l.b[0]-l.a[0],l.b[1]-l.a[1],l.b[2]-l.a[2]);this.len.set(l.name,h.length()),h.lengthSq()>1e-9?h.normalize():h.set(0,1,0);const u=l.parent?n(l.parent):null,d=u?new I(l.a[0]-u.a[0],l.a[1]-u.a[1],l.a[2]-u.a[2]):new I(...l.a);let f=J2[l.name];if(!f&&Ou[l.name]){const g=n(Ou[l.name]);f=new I(g.b[0]-g.a[0],g.b[1]-g.a[1],g.b[2]-g.a[2]).normalize(),l.name.startsWith("foot")&&(f=h.clone())}f??=h.clone(),this.rest.set(l.name,{dir:h,offset:d,pre:new ze().setFromUnitVectors(h,f),canon:f})}this.pelvisA=new I(...n("pelvis").a);const r=n("thighL").a,s=n("thighR").a,a=n("armL").a,o=n("armR").a;this.hipRest=new I((r[0]+s[0])/2,(r[1]+s[1])/2,(r[2]+s[2])/2);const c=new I((a[0]+o[0])/2,(a[1]+o[1])/2,(a[2]+o[2])/2);this.torso=c.distanceTo(this.hipRest)}setLength(t,e){const n=this.segs.find(a=>a.parent===t&&!a.name.startsWith("tail")&&a.name!=="jaw");if(!n)return;const r=this.bones.get(n.name),s=this.rest.get(n.name);r.position.copy(s.offset).multiplyScalar(e)}neckFit(t){const e=l=>this.segs.find(h=>h.name===l),n=e("spine2"),r=e("neck"),s=e("head"),a=(e("armL").a[1]+e("armR").a[1])/2-n.a[1],o=r.a[1]-n.a[1]+(s.a[1]-r.a[1]),c=(s.a[1]+s.b[1])/2-s.a[1];return o>.001?(a+t-c)/o:1}setNeck(t){for(const e of["neck","head"]){const n=this.bones.get(e),r=this.rest.get(e);n&&r&&n.position.copy(r.offset).multiplyScalar(t)}}swing(t,e,n,r){const s=this.rest.get(t),a=n.clone().applyQuaternion(e.clone().invert()).normalize(),o=new ze().setFromUnitVectors(s.canon,a).multiply(s.pre);return r<1&&o.slerp(new ze,1-Math.max(0,r)),o}set(t,e,n){const r=this.bones.get(t);r&&r.quaternion.copy(e);const s=n?n.clone().multiply(e):e.clone();return this.qm.set(t,s),s}apply(t,e=0,n=0){const r=this.set("pelvis",t.pelvis,null),s=this.hipRest.clone().sub(this.pelvisA).applyQuaternion(t.pelvis);this.bones.get("pelvis").position.copy(s.negate());const a=t.pelvis.clone().slerp(t.chest,.5),o=this.set("spine1",r.clone().invert().multiply(a),r),c=this.set("spine2",o.clone().invert().multiply(t.chest),o),l=zr(.3,.7,t.headVis),h=this.set("neck",this.swing("neck",c,t.neck,l*.6),c),u=h.clone().invert().multiply(t.head);l<1&&u.slerp(new ze,1-l),this.set("head",u,h);for(const f of["L","R"]){const g=this.set("arm"+f,this.swing("arm"+f,c,t.dir[`arm${f}`],zr(.35,.7,t.vis[`arm${f}`])),c);this.set("forearm"+f,this.swing("forearm"+f,g,t.dir[`forearm${f}`],zr(.35,.7,t.vis[`forearm${f}`])),g);const v=this.set("thigh"+f,this.swing("thigh"+f,r,t.dir[`thigh${f}`],zr(.4,.75,t.vis[`thigh${f}`])),r),m=this.set("shin"+f,this.swing("shin"+f,v,t.dir[`shin${f}`],zr(.4,.75,t.vis[`shin${f}`])),v);this.set("foot"+f,this.swing("foot"+f,m,t.dir[`foot${f}`],zr(.5,.8,t.vis[`foot${f}`])),m)}let d=r;for(let f=1;f<=4;f++){const g="tail"+f;if(!this.bones.has(g))break;const v=new ze().setFromEuler(new In(0,Math.sin(e*2.1-f*.7)*n,Math.sin(e*1.3-f*.5)*n*.3));d=this.set(g,v,f===1?this.qm.get(this.segs.find(m=>m.name==="tail1")?.parent??"pelvis")??r:d)}}setJaw(t){this.bones.get("jaw")?.quaternion.setFromAxisAngle(new I(1,0,0),t)}dirOf(t){return this.rest.get(t).dir.clone().applyQuaternion(this.qm.get(t))}}const Di=64,Vr=32,Rn=48,$n=36,Gr=12,La=9,_n={spread:1.6,back:.9,envIntensity:1.15,key:5,every:6,targetMean:.22,maxGain:2.8,fill:.35},Ko=new Float32Array(256).map((i,t)=>{const e=t/255;return e<=.04045?e/12.92:Math.pow((e+.055)/1.055,2.4)});class tM{constructor(t,e,n){this.renderer=t,this.scene=e,this.cv=document.createElement("canvas"),this.cv.width=Rn,this.cv.height=$n,this.ctx=this.cv.getContext("2d",{willReadFrequently:!0}),this.tex=new Qr(this.data,Di,Vr,Ve,xr),this.tex.mapping=Wa,this.tex.colorSpace=mr,this.tex.magFilter=ge,this.tex.minFilter=ge,this.pmrem=new qc(t),this.key.castShadow=!0,this.key.shadow.mapSize.set(1024,1024),this.key.shadow.bias=-5e-4,this.key.shadow.normalBias=.02,this.key.shadow.radius=4,e.add(this.key),e.add(this.key.target),e.add(this.fill),this.fill.intensity=1}key=new Xc(16777215,1);fill=new qp(16777215,4473924,0);cv;ctx;lin=new Float32Array(Rn*$n*3);blur=new Float32Array(Gr*La*3);data=new Uint16Array(Di*Vr*4);smooth=new Float32Array(Di*Vr*3);primed=!1;keyDir=new I(0,1,1).normalize();keyI=0;tex;pmrem;rt=null;mean=0;share=0;gain=1;realism=!1;dir=new I(0,1,1).normalize();target=new I(0,0,-2);update(t,e,n,r,s,a){if(this.aimShadows(s,n),!a){this.scene.environment=null,this.fill.intensity=1.2,this.key.intensity=1.6,this.key.position.copy(this.target).add(new I(1.5,3,2.5));return}if(r%_n.every!==0&&this.rt||t.readyState<2||!t.videoWidth)return;this.ctx.drawImage(t,0,0,Rn,$n);const o=this.ctx.getImageData(0,0,Rn,$n).data;let c=0;for(let _=0,E=0;_<Rn*$n;_++,E+=4){const w=Ko[o[E]],A=Ko[o[E+1]],R=Ko[o[E+2]];this.lin[_*3]=w,this.lin[_*3+1]=A,this.lin[_*3+2]=R,c+=.2126*w+.7152*A+.0722*R}this.mean=c/(Rn*$n),this.gain=Math.min(this.realism?1.25:_n.maxGain,Math.max(1,_n.targetMean/Math.max(this.mean,.001)));const l=this.gain;this.blur.fill(0);const h=Rn/Gr,u=$n/La;for(let _=0;_<$n;_++)for(let E=0;E<Rn;E++){const w=(Math.floor(_/u)*Gr+Math.floor(E/h))*3,A=(_*Rn+E)*3,R=this.blur;R[w]=R[w]+this.lin[A],R[w+1]=R[w+1]+this.lin[A+1],R[w+2]=R[w+2]+this.lin[A+2]}for(let _=0;_<this.blur.length;_++)this.blur[_]=this.blur[_]/(h*u);const d=e.f/e.w,f=e.f/e.h;let g=0,v=0,m=0,p=0;for(let _=0;_<Vr;_++){const E=((_+.5)/Vr-.5)*Math.PI,w=Math.sin(E),A=Math.cos(E);for(let R=0;R<Di;R++){const x=((R+.5)/Di-.5)*Math.PI*2;let M=Math.cos(x)*A;const S=Math.sin(x)*A,T=n?-M:M,D=S<0,U=Math.max(Math.abs(S),.08),N=Math.min(1,Math.max(0,.5+T/U*d/_n.spread)),z=Math.min(1,Math.max(0,.5-w/U*f/_n.spread));let $,V,tt;if(D){const nt=(Math.min($n-1,Math.floor(z*$n))*Rn+Math.min(Rn-1,Math.floor(N*Rn)))*3;$=this.lin[nt],V=this.lin[nt+1],tt=this.lin[nt+2]}else{const nt=(Math.min(La-1,Math.floor(z*La))*Gr+Math.min(Gr-1,Math.floor(N*Gr)))*3;$=this.blur[nt]*_n.back,V=this.blur[nt+1]*_n.back,tt=this.blur[nt+2]*_n.back}$*=l,V*=l,tt*=l;const rt=(_*Di+R)*3,lt=this.primed?.28:1;$=this.smooth[rt]=this.smooth[rt]+($-this.smooth[rt])*lt,V=this.smooth[rt+1]=this.smooth[rt+1]+(V-this.smooth[rt+1])*lt,tt=this.smooth[rt+2]=this.smooth[rt+2]+(tt-this.smooth[rt+2])*lt;const xt=(_*Di+R)*4;this.data[xt]=la.toHalfFloat($),this.data[xt+1]=la.toHalfFloat(V),this.data[xt+2]=la.toHalfFloat(tt),this.data[xt+3]=la.toHalfFloat(1);const Ct=.2126*$+.7152*V+.0722*tt,Ot=Ct*A;M=Math.cos(x)*A,g+=Ot*M,v+=Ot*w,m+=Ot*S,p+=Ot}}this.primed=!0,this.tex.needsUpdate=!0,this.rt=this.pmrem.fromEquirectangular(this.tex,this.rt),this.scene.environment=this.rt.texture,this.scene.environmentIntensity=_n.envIntensity;const b=Math.hypot(g,v,m);this.share=p>0?b/p:0,b>1e-6&&this.keyDir.lerp(new I(g/b,v/b,m/b),.25).normalize(),this.dir.copy(this.keyDir),this.dir.y<.15&&(this.dir.y=.15,this.dir.normalize());const y=_n.key*this.share*(p/(Di*Vr))*2;this.keyI+=(y-this.keyI)*(this.keyI===0?1:.25),this.key.intensity=this.keyI,this.fill.intensity=_n.fill*(this.realism?.25:1)*Math.min(1,Math.max(0,1-this.mean/.22)),this.key.position.copy(this.target).addScaledVector(this.dir,4)}aimShadows(t,e){if(!t.length)return;const n=new I;for(const a of t)n.add(a);n.multiplyScalar(1/t.length),e&&(n.x=-n.x);let r=1.4;for(const a of t)r=Math.max(r,Math.hypot((e?-a.x:a.x)-n.x,a.y-n.y,a.z-n.z)+1.4);this.target.copy(n),this.key.target.position.copy(n),this.key.position.copy(n).addScaledVector(this.dir,4);const s=this.key.shadow.camera;s.right!==r&&(s.left=-r,s.right=r,s.top=r,s.bottom=-r,s.near=.1,s.far=4+r*2,s.updateProjectionMatrix())}}const Wr={tauN:1,tauH:.6,imuAgree:35,footVis:.5};class eM{n=new I(0,1,0);h=-1.4;source="assumed";fromFeet=!1;bodyUp=new I(0,1,0);bodyW=0;update(t,e,n){const r=1-Math.exp(-n/Wr.tauN),s=1-Math.exp(-n/Wr.tauH),a=new I;let o=0;for(const f of t){if(f.lost||f.presence<.5)continue;const g=y=>new I(f.world[y].x,f.world[y].y,f.world[y].z),v=g(B.shL).add(g(B.shR)).multiplyScalar(.5),m=Math.min(f.world[B.anL].v,f.world[B.anR].v),p=m>Wr.footVis?g(B.anL).add(g(B.anR)).multiplyScalar(.5):g(B.hipL).add(g(B.hipR)).multiplyScalar(.5),b=v.sub(p);b.lengthSq()<1e-4||(a.addScaledVector(b.normalize(),f.presence*(m>Wr.footVis?1:.6)),o+=f.presence)}o>0&&a.lengthSq()>1e-6&&(a.normalize(),this.bodyUp.lerp(a,this.bodyW>0?r*.5:1).normalize(),this.bodyW=Math.min(1,this.bodyW+n));let c=null;const l=Math.cos(Zr.degToRad(Wr.imuAgree));e&&(this.bodyW===0||e.dot(this.bodyUp)>l)?(c=e,this.source="motion"):this.bodyW>0&&(c=this.bodyUp,this.source="body"),c&&this.n.lerp(c,r).normalize();let h=0,u=0,d=!1;for(const f of t){if(f.lost||f.presence<.5)continue;const g=b=>this.n.x*(f.T.x+f.world[b].x)+this.n.y*(f.T.y+f.world[b].y)+this.n.z*(f.T.z+f.world[b].z);let v=1/0;for(const[b,y]of[[B.heelL,.02],[B.heelR,.02],[B.toeL,.02],[B.toeR,.02],[B.anL,.08],[B.anR,.08]])f.world[b].v>Wr.footVis&&(v=Math.min(v,g(b)-y));if(v<1/0){h+=v*f.presence,u+=f.presence,d=!0;continue}const m=(g(B.hipL)+g(B.hipR))/2,p=Math.max(.6,Math.min(1.1,f.len.thigh+f.len.shin+.08));h+=(m-p)*f.presence*.4,u+=f.presence*.4}u>0&&(this.h+=(h/u-this.h)*s,this.fromFeet=d)}foot(t,e=new I){return e.copy(t).addScaledVector(this.n,this.h-this.n.dot(t))}height(t){return this.n.dot(t)-this.h}axes(){const t=new I(0,0,-1).addScaledVector(this.n,this.n.z).normalize(),e=new I().crossVectors(t,this.n).normalize();return{back:t,side:e}}get cameraHeight(){return-this.h}}const ir={coupling:.08,deadzone:2,restitution:.55,pupil:.46},nM=new Yi({color:16777215,side:qe,depthTest:!1,toneMapped:!1}),iM=new Yi({color:657930,side:qe,depthTest:!1,toneMapped:!1}),rM=new Yi({color:10132122,side:qe,depthTest:!1,toneMapped:!1}),sM=new Yi({color:16777215,side:qe,depthTest:!1,transparent:!0,opacity:.85,toneMapped:!1}),aM=new gs(1,40),oM=new yl(.95,1.05,40),cM=new gs(1,28),lM=new gs(.16,16);class Bu{g=new Ue;pupil;q=new bt(0,-.5);w=new bt;prev=[];sm=new I;primed=!1;constructor(){const t=new Pt(aM,nM),e=new Pt(oM,rM);this.pupil=new Pt(cM,iM),this.pupil.scale.setScalar(ir.pupil);const n=new Pt(lM,sM);n.position.set(-.38,.42,.003),this.pupil.position.z=.0015,e.position.z=.001,this.g.add(t,e,this.pupil,n),this.g.traverse(r=>{r.renderOrder=1100,r.frustumCulled=!1})}update(t,e,n,r){this.primed||(this.sm.copy(t.p),this.primed=!0),this.sm.lerp(t.p,1-Math.exp(-n/.05)),this.prev.push(this.sm.clone()),this.prev.length>3&&this.prev.shift();const s=new I;if(this.prev.length===3&&n>0){s.copy(this.prev[2]).addScaledVector(this.prev[1],-2).add(this.prev[0]).divideScalar(n*n);const d=s.length();s.multiplyScalar(d>ir.deadzone?(d-ir.deadzone)/d:0)}const a=new I().addScaledVector(e,-9.8).addScaledVector(s,-1).multiplyScalar(ir.coupling/Math.max(t.r,.005)),o=a.dot(t.u),c=a.dot(t.v),l=1-ir.pupil,h=4,u=Math.min(n,.1)/h;for(let d=0;d<h;d++){this.w.x+=o*u,this.w.y+=c*u,this.w.multiplyScalar(Math.exp(-2.2*u)),this.q.addScaledVector(this.w,u);const f=this.q.length();if(f>l){const g=this.q.x/f,v=this.q.y/f;this.q.set(g*l,v*l);const m=this.w.x*g+this.w.y*v;if(m>0){const p=this.w.x-m*g,b=this.w.y-m*v;this.w.set(p*.9-ir.restitution*m*g,b*.9-ir.restitution*m*v)}}}this.g.position.copy(t.p),this.g.quaternion.setFromRotationMatrix(new ne().makeBasis(t.u,t.v,t.n)),this.g.scale.setScalar(t.r*r),this.g.visible=r>.02,this.pupil.position.set(this.q.x,this.q.y,.0015)}}class hM{group=new Ue;eyes=new Map;update(t,e,n,r){this.group.visible=r;const s=new Set;if(r)for(const a of t){if(!a.eyes)continue;s.add(a.id);let o=this.eyes.get(a.id);if(!o){o=[new Bu,new Bu];for(const c of o)this.group.add(c.g);this.eyes.set(a.id,o)}a.eyes.forEach((c,l)=>o[l]?.update(c,e,n,a.show))}for(const[a,o]of this.eyes)if(!s.has(a)){for(const c of o)this.group.remove(c.g);this.eyes.delete(a)}}}const Ii=900,uM=`
  attribute float aSize; attribute float aLife; attribute vec3 aColor;
  uniform float uScale;
  varying float vLife; varying vec3 vColor;
  void main() {
    vLife = aLife; vColor = aColor;
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = aLife > 0.0 ? aSize * uScale / max(-mv.z, 0.05) : 0.0;
  }`,fM=`
  varying float vLife; varying vec3 vColor;
  void main() {
    vec2 c = gl_PointCoord - 0.5;
    float d = length(c) * 2.0;
    if (d > 1.0 || vLife <= 0.0) discard;
    float core = exp(-d * d * 5.0), halo = exp(-d * d * 1.6) * 0.45;
    float fade = smoothstep(0.0, 0.25, vLife) * smoothstep(1.0, 0.85, vLife);
    gl_FragColor = vec4(vColor * (core * 1.6 + halo) * fade, 1.0);
  }`,dM=[16722324,11796265,16769065,2744575,9187071].map(i=>new Ut(i));class pM{points;pos=new Float32Array(Ii*3);vel=new Float32Array(Ii*3);col=new Float32Array(Ii*3);size=new Float32Array(Ii);life=new Float32Array(Ii);span=new Float32Array(Ii);next=0;owed=new Map;mat;constructor(){const t=new Le;t.setAttribute("position",new ie(this.pos,3)),t.setAttribute("aColor",new ie(this.col,3)),t.setAttribute("aSize",new ie(this.size,1)),t.setAttribute("aLife",new ie(this.life,1)),this.mat=new ke({vertexShader:uM,fragmentShader:fM,uniforms:{uScale:{value:800}},transparent:!0,depthWrite:!1,blending:rc,toneMapped:!1}),this.points=new Ap(t,this.mat),this.points.frustumCulled=!1,this.points.renderOrder=1050}update(t,e,n,r){if(this.mat.uniforms.uScale.value=n,this.points.visible=r,!r)return;for(const o of t){const c=Math.min(1,Math.max(0,(o.open-.3)/.45));let l=(this.owed.get(o.id)??0)+c*c*110*e;const h=o.colors?.length?o.colors:dM;for(;l>=1;){l-=1;const u=this.next;this.next=(this.next+1)%Ii;const d=.35,f=Math.random()*Math.PI*2,g=Math.random()*d,v=new I(1,0,0).cross(o.dir);v.lengthSq()<1e-4&&v.set(0,1,0),v.normalize();const m=new I().crossVectors(o.dir,v).normalize(),p=o.dir.clone().addScaledVector(v,Math.cos(f)*g).addScaledVector(m,Math.sin(f)*g-.15).normalize(),b=(1.1+Math.random()*1.1)*o.scale;this.pos[u*3]=o.p.x,this.pos[u*3+1]=o.p.y,this.pos[u*3+2]=o.p.z,this.vel[u*3]=p.x*b,this.vel[u*3+1]=p.y*b,this.vel[u*3+2]=p.z*b;const y=h[Math.floor(Math.random()*h.length)];this.col[u*3]=y.r,this.col[u*3+1]=y.g,this.col[u*3+2]=y.b,this.size[u]=(.025+Math.random()*.045)*o.scale,this.span[u]=.9+Math.random()*.6,this.life[u]=1}this.owed.set(o.id,l)}const s=Math.exp(-1.6*e);for(let o=0;o<Ii;o++)this.life[o]<=0||(this.life[o]=this.life[o]-e/this.span[o],this.vel[o*3]=this.vel[o*3]*s,this.vel[o*3+2]=this.vel[o*3+2]*s,this.vel[o*3+1]=this.vel[o*3+1]*s+.5*e,this.pos[o*3]=this.pos[o*3]+this.vel[o*3]*e,this.pos[o*3+1]=this.pos[o*3+1]+this.vel[o*3+1]*e,this.pos[o*3+2]=this.pos[o*3+2]+this.vel[o*3+2]*e);const a=this.points.geometry;for(const o of["position","aColor","aSize","aLife"])a.getAttribute(o).needsUpdate=!0}}const mM=new ke({transparent:!0,depthWrite:!1,toneMapped:!1,vertexShader:"varying vec2 vUv; void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }",fragmentShader:"varying vec2 vUv; void main() { float r = length(vUv - 0.5) * 2.0; gl_FragColor = vec4(0.0, 0.0, 0.0, 0.5 * pow(clamp(1.0 - r, 0.0, 1.0), 1.6)); }"}),gM=new Mi(1,1),Pa=12,gd=`
  varying vec2 vUv;
  uniform vec4 uCrop; // u0, v0, du, dv of the video shown
  uniform float uMirror;
  void main() {
    vec2 uv = position.xy * 0.5 + 0.5;
    uv.x = mix(uv.x, 1.0 - uv.x, uMirror);
    vUv = uCrop.xy + uv * uCrop.zw;
    gl_Position = vec4(position.xy, 1.0, 1.0);
  }`,vM=`
  varying vec2 vUv;
  uniform sampler2D uTex;
  void main() { gl_FragColor = vec4(texture2D(uTex, vUv).rgb, 1.0); }`;class xM{constructor(t){this.canvas=t,this.renderer=new Ix({canvas:t,antialias:!0,alpha:!1,powerPreference:"high-performance",preserveDrawingBuffer:!1}),this.renderer.outputColorSpace=un,this.renderer.toneMapping=nf,this.renderer.toneMappingExposure=1,this.renderer.shadowMap.enabled=!0,this.renderer.shadowMap.type=Zu,this.renderer.setPixelRatio(this.opts.pixelRatio),this.plainBg=new ke({vertexShader:gd,fragmentShader:vM,depthTest:!1,depthWrite:!1,toneMapped:!1,uniforms:this.bgUniforms}),this.bg=new Pt(new Mi(2,2),this.plainBg),this.fg=new Pt(new Mi(2,2),this.plainBg),this.fg.frustumCulled=!1,this.fg.renderOrder=1e3,this.fg.visible=!1,this.bg.frustumCulled=!1,this.bg.renderOrder=-1e3,this.scene.add(this.bg),this.scene.add(this.fg),this.scene.add(this.world),this.world.add(this.googly.group,this.breath.points);for(const e of this.spots)this.world.add(e,e.target);this.grain=new Pt(new Mi(2,2),new ke({vertexShader:"varying vec2 vUv; void main() { vUv = position.xy * 0.5 + 0.5; gl_Position = vec4(position.xy, 0.0, 1.0); }",fragmentShader:`varying vec2 vUv; uniform float uTime; uniform vec2 uRes;
        float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
        void main() {
          vec2 d = vUv - 0.5; d.y *= 1.15;
          float vig = 1.0 - 0.35 * dot(d, d);
          float n = hash(floor(vUv * uRes) + fract(uTime * 7.31) * 97.0);
          gl_FragColor = vec4(vec3(vig * (0.965 + 0.035 * n)), 1.0);
        }`,uniforms:{uTime:{value:0},uRes:{value:new bt(1,1)}},depthTest:!1,depthWrite:!1,toneMapped:!1,transparent:!0,blending:Ju,blendSrc:Qu,blendDst:tf})),this.grain.frustumCulled=!1,this.grain.renderOrder=1200,this.grain.visible=!1,this.scene.add(this.grain),this.scene.add(this.camera),this.light=new tM(this.renderer,this.scene,this.world),this.rims[0].position.set(-3,2.5,-6),this.rims[1].position.set(3,2.5,-6);for(const e of this.rims)e.target.position.set(0,0,-3),this.scene.add(e,e.target)}renderer;scene=new Sf;camera=new Mn(50,1,.05,60);world=new Ue;light;bg;bgUniforms={uTex:{value:null},uCrop:{value:new ae(0,0,1,1)},uMirror:{value:0}};plainBg;videoTex=null;templates=new Map;wearers=new Map;leaving=[];lastT=-1;pyramid=!1;hideWearers=!1;ground=new eM;googly=new hM;breath=new pM;googlyOn=!1;breathOn=!0;spots=[0,1,2].map(()=>new $p(16777215,0,0,.24,.65,2));grain;fg;rims=[new Xc(16723349,0),new Xc(3073791,0)];opts={size:1,shadows:!0,envLight:!0,pixelRatio:Math.min(window.devicePixelRatio||1,2)};cover={s:1,ox:0,oy:0,vw:1,vh:1,cw:1,ch:1,mirror:!1};setVideo(t){this.videoTex?.dispose();const e=new Rp(t);e.colorSpace=Qn,e.minFilter=ge,e.magFilter=ge,e.generateMipmaps=!1,this.videoTex=e,this.bgUniforms.uTex.value=e}setBackground(t){this.bg.material=t??this.plainBg}setForeground(t){this.fg.visible=!!t,t&&(this.fg.material=t)}template(t){let e=this.templates.get(t);return e||(e=Go(bi(t)),this.templates.set(t,e)),e}hasTemplate(t){return this.templates.has(t)}worker=null;queue=[];busy=null;waiting=new Map;workerMs=new Map;prepare(t,e=!1){const n=this.templates.get(t);if(n)return Promise.resolve(n);const r=new Promise(s=>{const a=this.waiting.get(t)??[];a.push(s),this.waiting.set(t,a)});return this.busy!==t&&(this.queue=this.queue.filter(s=>s!==t),e?this.queue.unshift(t):this.queue.push(t)),this.pump(),r}isPreparing(t){return this.busy===t||this.queue.includes(t)}pump(){if(!(this.busy||!this.queue.length)){if(!this.worker)try{this.worker=new Worker(new URL(""+new URL("build.worker-Dq0GYZtm.js",import.meta.url).href,import.meta.url),{type:"module"}),this.worker.onmessage=t=>{const{id:e,body:n,fur:r,ms:s}=t.data;this.workerMs.set(e,s);const a=Go(bi(e),void 0,n?{body:n,fur:r}:void 0);this.finish(e,a)},this.worker.onerror=t=>{console.warn("costume worker failed; building on the main thread",t),this.worker=null,this.workerDead=!0,this.fallback()}}catch{this.workerDead=!0}if(this.workerDead){this.fallback();return}this.busy=this.queue.shift(),this.worker.postMessage({id:this.busy})}}workerDead=!1;fallback(){const t=this.busy??this.queue.shift();t&&(this.busy=t,setTimeout(()=>this.finish(t,Go(bi(t))),16))}finish(t,e){this.templates.has(t)||this.templates.set(t,e);const n=this.templates.get(t);for(const r of this.waiting.get(t)??[])r(n);this.waiting.delete(t),this.busy=null,this.pump()}layout(t,e){const n=this.canvas.clientWidth||window.innerWidth,r=this.canvas.clientHeight||window.innerHeight,s=this.opts.pixelRatio;this.renderer.getPixelRatio()!==s&&this.renderer.setPixelRatio(s);const a=this.renderer.getSize(new bt);(a.x!==n||a.y!==r)&&this.renderer.setSize(n,r,!1);const o=Math.max(n/t.w,r/t.h),c=n/o,l=r/o,h=(t.w-c)/2/t.w,u=(t.h-l)/2/t.h;this.bgUniforms.uCrop.value.set(h,u,c/t.w,l/t.h),this.bgUniforms.uMirror.value=e?1:0,this.camera.fov=Zr.radToDeg(2*Math.atan(l/2/t.f)),this.camera.aspect=n/r,this.camera.updateProjectionMatrix(),this.world.scale.x=e?-1:1,this.cover={s:o,ox:(t.w-c)/2,oy:(t.h-l)/2,vw:t.w,vh:t.h,cw:n,ch:r,mirror:e}}sync(t,e,n){const r=this.lastT<0?.03333333333333333:Math.min(.1,Math.max(0,n-this.lastT));this.lastT=n;const s=new Set;for(const a of t){const o=e(a.id);let c=this.wearers.get(a.id);c&&c.def.id!==o&&this.templates.has(o)&&(c.leaving=!0,this.leaving.push(c),this.wearers.delete(a.id),c=void 0),!(!c&&!this.templates.has(o))&&(s.add(a.id),c||(c=this.dress(a.id,o)),c.life=Math.min(1,c.life+r/.35),this.pose(c,a,n))}for(const[a,o]of this.wearers)s.has(a)||this.drop(o);this.leaving=this.leaving.filter(a=>{if(a.life-=r/.35,a.life<=0)return this.drop(a),!1;const o=t.find(c=>c.id===a.trackId);return o&&this.pose(a,o,n),!0})}dress(t,e){const n=this.template(e),r=iu(n.root),s=new Map;r.traverse(l=>{l.isBone&&s.set(l.name,l)});const a=new Map;r.traverse(l=>{const h=l;if(!h.isMesh)return;const u=d=>{let f=a.get(d);return f||(f=d.clone(),f.onBeforeCompile=d.onBeforeCompile,f.customProgramCacheKey=d.customProgramCacheKey,f.alphaHash=!0,a.set(d,f)),f};h.material=Array.isArray(h.material)?h.material.map(u):u(h.material)});const o=n.def.segs.map(l=>s.get(l.name)).filter(Boolean),c={trackId:t,def:n.def,root:r,rig:new Q2(n.def.segs,s),mats:[...a.values()],fade:0,life:0,leaving:!1,boneList:o,hist:Array.from({length:Pa},()=>new Float32Array(o.length*7)),histHead:0,clones:[]};return this.world.add(r),this.wearers.set(t,c),c}drop(t){this.world.remove(t.root);for(const e of t.clones)this.world.remove(e.root,e.shadow);for(const e of t.mats)e.dispose();this.wearers.get(t.trackId)===t&&this.wearers.delete(t.trackId)}pose(t,e,n){const r=t.def,s=t.rig,a=Fu(e.world),o=e.len.torso/s.torso*(r.fit?.size??1)*this.opts.size,c=r.fit?.limb??0,l=(g,v)=>{const m=1+(v/o/(s.len.get(g)??1)-1)*c;s.setLength(g,Math.min(1.6,Math.max(.65,m)))};for(const g of["L","R"])l("arm"+g,e.len.upperArm),l("thigh"+g,e.len.thigh),l("shin"+g,e.len.shin);const h=s.neckFit(e.len.neck/o);s.setNeck(1+(Math.min(1.25,Math.max(.45,h))-1)*(r.fit?.head??.85)),s.apply(a,n,r.idle?.tail??0),r.face?.jaw&&s.setJaw((e.face?.jaw??0)*r.face.jaw),t.root.position.set(e.T.x,e.T.y,e.T.z),t.root.scale.setScalar(o);const u=e.presence*Math.max(0,Math.min(1,t.life)),d=u*u*(3-2*u);if(d!==t.fade){for(const g of t.mats)g.opacity=d;t.fade=d}t.root.visible=d>.01&&!this.hideWearers,r.tick?.(t.root,n,e.face??null),t.histHead=(t.histHead+1)%Pa;const f=t.hist[t.histHead];t.boneList.forEach((g,v)=>{g.quaternion.toArray(f,v*7),g.position.toArray(f,v*7+4)}),this.posePyramid(t,o,d,n)}posePyramid(t,e,n,r){const s=this.pyramid?this.wearers.size>1?2:3:0,a=[];for(let v=1;v<=s;v++)for(let m=0;m<=v;m++)a.push([v,m]);for(;t.clones.length>a.length;){const v=t.clones.pop();this.world.remove(v.root,v.shadow)}for(;t.clones.length<a.length;){const v=iu(t.root);v.traverse(_=>{_.castShadow=!1});const m=new Map;v.traverse(_=>{_.isBone&&m.set(_.name,_)});const[p,b]=a[t.clones.length],y=new Pt(gM,mM);y.renderOrder=1,t.clones.push({root:v,bones:t.def.segs.map(_=>m.get(_.name)).filter(Boolean),row:p,col:b,shadow:y}),this.world.add(v,y)}const o=t.rig.torso*e*3.2,c=this.ground,{back:l,side:h}=c.axes(),u=t.root.position,d=c.foot(u),f=c.height(u),g=new ze().setFromUnitVectors(new I(0,0,1),c.n);for(const v of t.clones){const m=v.col-v.row/2,p=Math.round(v.row*3+Math.abs(m)*1.5),b=t.hist[(t.histHead-p+Pa*4)%Pa];v.bones.forEach((_,E)=>{_.quaternion.fromArray(b,E*7),_.position.fromArray(b,E*7+4)});const y=d.clone().addScaledVector(l,v.row*o*.5).addScaledVector(h,m*o*.55);v.root.position.copy(y).addScaledVector(c.n,f),v.root.scale.copy(t.root.scale),v.root.visible=n>.01,v.shadow.position.copy(y).addScaledVector(c.n,.004),v.shadow.quaternion.copy(g),v.shadow.scale.set(o*.42,o*.26,1),v.shadow.visible=v.root.visible,t.def.tick?.(v.root,r-p/30,null)}}faces(t,e,n){this.world.updateMatrixWorld();const r=this.world.matrixWorld.clone().invert(),s=[],a=[];for(const c of t){if(c.lost&&c.presence<=0)continue;const l=c.face,h=this.wearers.get(c.id),u=h&&h.root.visible&&!this.hideWearers?h:null,d=Fu(c.world).head,f=(y,_,E)=>new I(y,_,E).applyQuaternion(d),g=new I(c.T.x+c.world[B.nose].x,c.T.y+c.world[B.nose].y,c.T.z+c.world[B.nose].z),v=Math.max(.3,-g.z),m=(y,_,E)=>new I((y*e.w-e.cx)/e.f*v,(e.cy-_*e.h)/e.f*v,-v).addScaledVector(f(0,0,1),E);let p=null,b=null;if(u){u.root.updateMatrixWorld(!0);const y=u.rig.bones.get("head"),_=u.def.segs.find(x=>x.name==="head"),E=y?r.clone().multiply(y.matrixWorld):null,w=u.root.scale.x;if(E&&_&&u.def.face?.eyes){const x=new I(1,0,0).transformDirection(E),M=new I(0,1,0).transformDirection(E),S=new I(0,0,1).transformDirection(E);p=u.def.face.eyes.map(([T,D,U,N])=>({p:new I(T-_.a[0],D-_.a[1],U-_.a[2]).applyMatrix4(E),u:x,v:M,n:S,r:N*w*1.15}))}const A=u.rig.bones.get("jaw"),R=u.def.segs.find(x=>x.name==="jaw");if(A&&R&&u.def.face?.jaw){const x=r.clone().multiply(A.matrixWorld);b={p:new I(R.b[0]-R.a[0],R.b[1]-R.a[1],R.b[2]-R.a[2]).applyMatrix4(x),dir:new I(0,-.2,1).transformDirection(E??x),scale:w*10}}else if(E&&_){const x=new I(0,0,1).transformDirection(E);b={p:(l?m(l.mouth.x,l.mouth.y,0):g.clone()).addScaledVector(x,.12*w*10),dir:x.clone().add(new I(0,-.2,0)).normalize(),scale:w*10}}}if(!p&&l){const y=f(1,0,0),_=f(0,1,0),E=f(0,0,1);p=l.eyes.map(w=>({p:m(w.x,w.y,.02),u:y,v:_,n:E,r:Math.max(.012,w.r*e.w/e.f*v*1.35)}))}!b&&l&&(b={p:m(l.mouth.x,l.mouth.y,.03),dir:f(0,-.2,1).normalize(),scale:1}),s.push({id:c.id,eyes:p,show:c.presence}),b&&l&&a.push({id:c.id,...b,open:l.jaw*c.presence,colors:void 0})}this.googly.update(s,this.ground.n,n,this.googlyOn);const o=this.renderer.getDrawingBufferSize(new bt).y;this.breath.update(a,n,o/(2*Math.tan(Zr.degToRad(this.camera.fov)/2)),this.breathOn)}setGrain(t,e){this.grain.visible=t;const n=this.grain.material.uniforms;n.uTime.value=e;const r=this.renderer.getDrawingBufferSize(new bt);n.uRes.value.set(r.x/1.5,r.y/1.5)}stageSpots(t,e,n,r,s){const a=this.ground,{back:o,side:c}=a.axes(),l=a.foot(s??new I(0,-.3,-3)),h=l.clone().addScaledVector(o,1.1),u=[16769728,16726696,3856639],d=f=>{const g=is(f,r);return new bt(g.x,1-g.y)};return this.spots.map((f,g)=>{const v=l.clone().addScaledVector(c,(g-1)*2.4).addScaledVector(o,.6).addScaledVector(a.n,3.6),m=h.clone().addScaledVector(c,(g-1)*.9+1.2*Math.sin(e*.33+g*2.1)).addScaledVector(o,.8*Math.cos(e*.27+g*1.3)),p=new Ut(u[g]);f.color.copy(p),f.position.copy(v),f.target.position.copy(m),f.target.updateMatrixWorld(),f.intensity=t?38*(1+.8*n):0;const b=v.distanceTo(m)*Math.tan(f.angle)*.9,y=d(m),_=v.z<-.15?d(v):new bt(y.x,1.4),E=new bt(Math.abs(d(m.clone().addScaledVector(c,b)).x-y.x),Math.abs(d(m.clone().addScaledVector(o,b)).y-y.y));return{L:_,P:y,R:E,C:p.clone().multiplyScalar(1+.8*n)}})}stageLights(t,e,n){const r=[16722324,11796265,16769065,2744575,9187071];this.rims.forEach((s,a)=>{s.intensity=t?2.2+3*n:0;const o=(e*.12+a*.4)%1*r.length,c=Math.floor(o),l=o-c;s.color.setHex(r[c%r.length]).lerp(new Ut(r[(c+1)%r.length]),l)})}people(){return[...this.wearers.values()].filter(t=>t.root.visible).map(t=>t.root.position.clone())}render(t,e,n){this.renderer.shadowMap.enabled=this.opts.shadows,t&&this.light.update(t,e,this.cover.mirror,n,this.people(),this.opts.envLight),this.renderer.render(this.scene,this.camera)}get count(){return this.wearers.size}}const yi=[{id:"insitu",name:"In Situ",code:12,swatch:"radial-gradient(ellipse at 30% 85%, rgba(255,80,190,0.9), transparent 35%), radial-gradient(ellipse at 72% 80%, rgba(80,220,255,0.9), transparent 35%), linear-gradient(160deg, transparent 40%, rgba(255,240,220,0.35) 50%, transparent 60%), #2a2430"},{id:"pyramid",name:"Pyramid",code:8,swatch:"conic-gradient(from 150deg at 50% 18%, transparent 0 60deg, #ff2d95 60deg 64deg, #b6ff2e 64deg 68deg, transparent 68deg), linear-gradient(#2a0f3d, #08050f)"},{id:"tunnel",name:"Tunnel",code:9,swatch:"repeating-radial-gradient(circle, #ff2d95 0 3px, #12071f 3px 8px, #2ee6ff 8px 11px, #12071f 11px 16px)"},{id:"lasers",name:"Lasers",code:10,swatch:"linear-gradient(115deg, transparent 46%, #b6ff2e 48%, transparent 50%), linear-gradient(65deg, transparent 46%, #ff2d95 48%, transparent 50%), linear-gradient(90deg, transparent 47%, #2ee6ff 49%, transparent 51%), #07040d"},{id:"kaleido",name:"Kaleido",code:11,swatch:"conic-gradient(#ff2d95, #ffe62e, #b6ff2e, #2ee6ff, #8a2eff, #ff2d95)"},{id:"rings",name:"Rings",code:5,swatch:"repeating-radial-gradient(circle, #ff3d7f 0 5px, #ffb23d 5px 10px, #3dd6ff 10px 15px, #8c5cff 15px 20px)"},{id:"neon",name:"Neon",code:4,swatch:"radial-gradient(circle, transparent 0 40%, #39ff9c 42% 50%, transparent 54%), #06030f"},{id:"pop",name:"Pop Art",code:1,swatch:"radial-gradient(circle at 30% 30%, #ffde00 0 22%, transparent 23%), radial-gradient(circle at 70% 70%, #ff2d8a 0 22%, transparent 23%), #19c3ff"},{id:"warhol",name:"Warhol",code:2,swatch:"conic-gradient(#ff5fa2 0 25%, #ffd400 0 50%, #2ad4c4 0 75%, #7b5cff 0)"},{id:"echo",name:"Echoes",code:6,swatch:"linear-gradient(90deg, #1b1033, #ff2db4 40%, #2de2ff 70%, #1b1033)"},{id:"disco",name:"Disco",code:7,swatch:"radial-gradient(circle at 30% 30%, #ff4fd8, transparent 45%), radial-gradient(circle at 70% 60%, #4fd1ff, transparent 45%), radial-gradient(circle at 45% 80%, #ffe14f, transparent 40%), #120820"},{id:"solar",name:"Solarize",code:3,swatch:"linear-gradient(135deg, #1a0b3d, #ff7a00 45%, #00e5ff 55%, #2a0b3d)"},{id:"spot",name:"Spotlight",code:0,swatch:"radial-gradient(circle at 50% 40%, #fff6d8, #6a5a40 45%, #120f0a 75%)"}],_M=[[2757440,16727435,16756736,16774084],[731722,46023,16740156,16776160],[2951947,9321727,3997598,16382065],[1058330,16723502,3065343,16769520]],Za=12,Da=`
  varying vec2 vUv;
  void main() { vUv = position.xy * 0.5 + 0.5; gl_Position = vec4(position.xy, 0.0, 1.0); }`,MM=`
  vec3 hsv(float h, float s, float v) { vec3 k = clamp(abs(mod(h * 6.0 + vec3(0.0, 4.0, 2.0), 6.0) - 3.0) - 1.0, 0.0, 1.0); return v * mix(vec3(1.0), k, s); }
  float luma(vec3 c) { return dot(c, vec3(0.299, 0.587, 0.114)); }
  float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
  float noise(vec2 p) { vec2 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x), mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x), f.y); }
  // the show's palette: hot pink, lime, sun yellow, aqua, violet, round and round, smooth
  vec3 neon(float t) {
    t = fract(t) * 5.0;
    float f = fract(t); f = f * f * (3.0 - 2.0 * f);
    int i = int(floor(t));
    vec3 c0 = vec3(1.0, 0.16, 0.58), c1 = vec3(0.70, 1.0, 0.16), c2 = vec3(1.0, 0.88, 0.16), c3 = vec3(0.16, 0.88, 1.0), c4 = vec3(0.55, 0.18, 1.0);
    vec3 a = i == 0 ? c0 : i == 1 ? c1 : i == 2 ? c2 : i == 3 ? c3 : c4;
    vec3 b = i == 0 ? c1 : i == 1 ? c2 : i == 2 ? c3 : i == 3 ? c4 : c0;
    return mix(a, b, f);
  }`,bM=`
  varying vec2 vUv;
  uniform sampler2D uTex, uMask;
  uniform vec4 uOn;
  void main() {
    vec4 m = smoothstep(0.3, 0.7, texture2D(uMask, vec2(vUv.x, 1.0 - vUv.y))) * uOn;
    gl_FragColor = vec4(texture2D(uTex, vUv).rgb, max(max(m.r, m.g), max(m.b, m.a)));
  }`,yM=`
  varying vec2 vUv;
  uniform sampler2D uTex, uMask, uFx, uPrev;
  uniform highp sampler2DArray uHist;
  uniform float uHead, uTime, uAspect, uBeat, uLevel, uClones;
  uniform int uPreset;
  uniform vec4 uOn, uBox;
  // the pyramid, laid out on the floor (pose/ground.ts) and projected: each clone's feet in uv, its scale against the
  // subject, its delay in frames; back to front. uFoot: the subject's own feet in uv; uFootW: their width in uv
  // In Situ's spotlights, projected: the source, the floor pool's centre (uv), the pool's radii (uv), the colour
  uniform vec2 uSpotL[3], uSpotP[3], uSpotR[3];
  uniform vec3 uSpotC[3];
  uniform float uSpotK;
  uniform vec4 uClone[9];
  uniform int uCloneN;
  uniform vec2 uFoot;
  uniform float uFootW;
  uniform vec3 uPal[16];
  ${MM}

  vec3 pal(int who, int k) { return uPal[who * 4 + k]; }
  vec3 print(vec3 c, int who) { float l = luma(c); return l < 0.22 ? pal(who, 0) : l < 0.45 ? pal(who, 1) : l < 0.7 ? pal(who, 2) : pal(who, 3); }
  vec3 solar(vec3 c, float t) {
    vec3 s = mix(c, 1.0 - c, step(0.5, c));
    return mix(s * 2.0, hsv(fract(t * 0.07) + luma(c) * 0.8, 0.85, 1.0) * (0.35 + 1.2 * luma(s)), 0.55);
  }
  vec3 discoLight(vec2 p, float t) {
    vec3 acc = vec3(0.0);
    for (int i = 0; i < 5; i++) {
      float fi = float(i);
      vec2 c = vec2(0.5 + 0.42 * sin(t * (0.45 + fi * 0.13) + fi * 1.7), 0.45 + 0.35 * cos(t * (0.37 + fi * 0.11) + fi * 2.3));
      vec2 d = (p - c) * vec2(uAspect, 1.0);
      acc += neon(fi / 5.0 + t * 0.03) * exp(-dot(d, d) * 45.0) * 0.9;
    }
    return acc;
  }
  // a frame of the subjects, \`delay\` frames ago, at q (outside the frame: nothing)
  vec4 past(vec2 q, float delay) {
    if (q.x < 0.0 || q.y < 0.0 || q.x > 1.0 || q.y > 1.0) return vec4(0.0);
    return texture(uHist, vec3(q, mod(uHead - delay + ${Za}.0 * 8.0, ${Za}.0)));
  }
  // a laser from \`o\` at angle \`a\` (from straight down), in aspect-correct space
  float beam(vec2 p, vec2 o, float a, float w) {
    vec2 d = vec2(sin(a), -cos(a));
    vec2 v = p - o;
    float along = dot(v, d);
    float across = abs(v.x * d.y - v.y * d.x);
    return along > 0.0 ? exp(-across * across / (w * w)) * exp(-along * 0.25) : 0.0;
  }

  void main() {
    vec2 uv = vUv;
    float cellIx = 0.0;
    if (uPreset == 2) { vec2 cell = floor(uv * 2.0); cellIx = cell.x + (1.0 - cell.y) * 2.0; uv = fract(uv * 2.0); }
    vec2 muv = vec2(uv.x, 1.0 - uv.y);
    vec3 vid = texture2D(uTex, uv).rgb;
    vec4 m = smoothstep(0.3, 0.7, texture2D(uMask, muv)) * uOn;
    float subj = max(max(m.r, m.g), max(m.b, m.a));
    int who = 0; float best = m.r;
    if (m.g > best) { best = m.g; who = 1; }
    if (m.b > best) { best = m.b; who = 2; }
    if (m.a > best) { best = m.a; who = 3; }
    vec4 fx = texture2D(uFx, muv);
    float dist = fx.r, trail = fx.g, stamp = fx.b;
    float t = uTime, beat = uBeat;
    vec2 sp = vec2(uv.x * uAspect, uv.y);
    // a lit edge on every subject, and a halo just outside them, in the show's colours
    float rim = clamp(1.0 - abs(subj - 0.5) * 2.0, 0.0, 1.0);
    vec3 hue = neon(t * 0.06 + float(who) * 0.23);
    vec3 halo = hue * exp(-dist * 22.0) * 0.6;
    vec3 bg = vid, fg = vid;

    if (uPreset == 0) {
      bg = vec3(luma(vid)) * vec3(0.75, 0.78, 0.95) * (0.12 + 0.75 * exp(-dist * 7.0));
      fg = vid * 1.08;
    } else if (uPreset == 1) {
      fg = print(vid, who);
      vec3 base = hsv(fract(0.55 + floor(t * 0.25 + beat * 0.0) * 0.23), 0.75, 1.0);
      vec2 g = fract(sp * 70.0) - 0.5;
      float dots = step(length(g), 0.18 + 0.22 * luma(vid));
      bg = mix(base, base * 0.55 + vec3(0.05), dots);
    } else if (uPreset == 2) {
      int ci = int(cellIx);
      fg = print(vid, ci);
      bg = mix(pal((ci + 2) - 4 * ((ci + 2) / 4), 2), pal(ci, 3), 0.15);
    } else if (uPreset == 3) {
      fg = solar(vid, t);
      bg = solar(vid, t + 3.0) * 0.7;
    } else if (uPreset == 4) {
      vec3 tube = neon(t * 0.08 + muv.y * 0.3);
      float line = exp(-pow((dist - 0.035) * 60.0, 2.0)), glow = exp(-dist * 14.0);
      bg = tube * (line * 2.4 * (1.0 + beat) + glow * 0.5);
      fg = vid * 0.16 + tube * rim * 2.0;
    } else if (uPreset == 5) {
      float k = dist * 9.0 - t * 0.9 - beat * 0.4;
      float band = fract(k);
      bg = neon(floor(k) * 0.17 + t * 0.02) * (0.25 + 1.1 * smoothstep(0.0, 0.08, band) * smoothstep(0.32, 0.12, band));
      bg *= 0.3 + 0.9 * exp(-dist * 1.4);
      fg = vid + halo;
    } else if (uPreset == 6) {
      bg = vid * 0.25 * vec3(0.7, 0.75, 1.0);
      bg = mix(bg, neon(stamp) * 1.3, clamp(trail, 0.0, 1.0) * 0.85);
      fg = vid;
    } else if (uPreset == 7) {
      vec3 L = discoLight(uv, t);
      vec2 fc = floor(sp * 140.0);
      float fleck = step(0.992, hash(fc + floor(t * 6.0))) * 1.6;
      bg = vid * 0.1 + L * (0.9 + beat) + fleck * hsv(hash(fc), 0.5, 1.0);
      fg = vid * (0.75 + 0.7 * L);
    } else if (uPreset == 8) {
      // the dance pyramid: the subjects cloned on the floor behind them, row after row, each later — a canon
      float y = uv.y;
      float scan = pow(0.5 + 0.5 * sin(y * 90.0 - t * 5.0), 10.0);
      bg = neon(y * 0.5 - t * 0.07) * (0.06 + 0.22 * scan + 0.05 * beat) + vid * 0.04;
      vec3 col = bg;
      for (int i = 0; i < 9; i++) {
        if (i >= uCloneN || uClones < 0.5) break;
        vec4 cl = uClone[i];
        // the floor under it darkens first: a contact shadow, as wide as the clone, flattened by the floor's tilt
        vec2 e = (uv - cl.xy) / vec2(uFootW * cl.z * 0.6, uFootW * cl.z * 0.13);
        col *= 1.0 - 0.6 * exp(-dot(e, e));
        vec2 q = uFoot + (uv - cl.xy) / cl.z;
        vec4 c = past(q, cl.w);
        vec3 tint = neon(float(i) * 0.13 + t * 0.05);
        vec3 cc = mix(c.rgb, tint * (0.25 + 1.6 * luma(c.rgb)), 0.65) + tint * clamp(1.0 - abs(c.a - 0.5) * 2.0, 0.0, 1.0) * 1.8;
        col = mix(col, cc, c.a);
      }
      col += neon(t * 0.05) * exp(-pow((uv.y - uFoot.y) * 18.0, 2.0)) * exp(-pow((uv.x - uFoot.x) / (uFootW * 2.5 + 0.01), 2.0)) * 0.5;
      bg = col;
      fg = vid + hue * rim * 1.6;
    } else if (uPreset == 9) {
      // the tunnel: the last frame, a little smaller and turned, fed back under this one — the dancers recede forever
      vec2 c = vec2(0.5, 0.52);
      vec2 d = (uv - c) * vec2(uAspect, 1.0);
      float a = 0.012 + 0.03 * beat, z = 0.962 - 0.035 * beat;
      d = mat2(cos(a), -sin(a), sin(a), cos(a)) * d / z;
      vec3 prev = texture2D(uPrev, c + d / vec2(uAspect, 1.0)).rgb;
      prev = mix(prev, neon(t * 0.08) * luma(prev) * 1.5, 0.07) * 0.94;
      bg = vid * 0.1 + prev;
      fg = vid + hue * rim * 1.4;
    } else if (uPreset == 10) {
      // lasers through haze: three sources over the stage, fans that sweep, snap on the beat
      vec2 p = sp;
      float haze = 0.4 + 0.6 * noise(p * 3.0 + vec2(t * 0.15, -t * 0.08));
      vec3 acc = vec3(0.0);
      for (int s = 0; s < 3; s++) {
        float fs = float(s);
        vec2 o = vec2((0.15 + 0.35 * fs) * uAspect, 1.04);
        for (int k = 0; k < 6; k++) {
          float fk = float(k);
          float a = (fk - 2.5) * (0.16 + 0.06 * sin(t * 0.7 + fs)) + 0.55 * sin(t * (0.35 + 0.1 * fs) + fs * 2.0);
          acc += neon(fs * 0.33 + fk * 0.04 + t * 0.02) * beam(p, o, a, 0.0045 + 0.004 * beat);
        }
      }
      bg = vid * 0.06 + acc * (1.4 + 1.8 * beat) * haze + neon(t * 0.03) * 0.05 * haze;
      fg = vid * 0.9 + hue * rim * 1.5 + acc * 0.25;
    } else if (uPreset == 11) {
      // a kaleidoscope of the room behind them, turning
      vec2 p = (uv - 0.5) * vec2(uAspect, 1.0);
      float r = length(p) * (1.0 - 0.08 * beat), a = atan(p.y, p.x) + t * 0.12;
      float seg = 6.2831853 / 6.0;
      a = mod(a, seg); a = abs(a - seg * 0.5);
      vec2 q = vec2(cos(a), sin(a)) * r;
      vec3 k = texture2D(uTex, clamp(0.5 + q / vec2(uAspect, 1.0) * 0.9, 0.0, 1.0)).rgb;
      k = mix(vec3(luma(k)), k, 1.8);
      bg = clamp(k, 0.0, 1.5) * 0.8 * mix(vec3(1.0), neon(r * 0.8 - t * 0.1) * 1.4, 0.45);
      fg = vid + hue * rim * 1.3;
    }
    if (uPreset == 12) {
      // in situ: the room as the camera saw it, a club's lights added — beams through haze down to pools on the floor
      // (the same lights stand in 3D over the costumes: render/stage.ts stageSpots); the people in the pools are lit
      vec3 add = vec3(0.0), pools = vec3(0.0);
      float haze = 0.55 + 0.45 * noise(sp * 4.0 + vec2(t * 0.12, -t * 0.07));
      for (int i = 0; i < 3; i++) {
        vec2 Ls = uSpotL[i], Ps = uSpotP[i], R = max(uSpotR[i], vec2(0.004));
        vec2 e = (uv - Ps) / R;
        float pool = exp(-dot(e, e) * 1.6);
        // the beam: a cone from the source to the pool, widening, brightest near the floor, soft-edged
        vec2 ax = Ps - Ls; float L2 = max(dot(ax, ax), 1e-5);
        float k = clamp(dot(uv - Ls, ax) / L2, 0.0, 1.15);
        vec2 q = Ls + ax * k;
        float wdt = mix(0.006, R.x * 0.95, k);
        float across = length((uv - q) * vec2(uAspect, 1.0)) / (wdt * uAspect);
        float beam = exp(-across * across * 2.2) * smoothstep(0.0, 0.25, k) * (k < 1.0 ? 1.0 : exp(-(k - 1.0) * 12.0));
        add += uSpotC[i] * beam * haze * 0.4;
        pools += uSpotC[i] * pool;
      }
      add *= uSpotK; pools *= uSpotK;
      // the room a touch darker, so the lights read; floating motes catch the beams
      float mote = step(0.996, hash(floor(sp * 220.0) + floor(t * 3.0))) * 0.8;
      bg = vid * 0.8 * (1.0 + pools * 1.4) + add * (1.0 + mote * 3.0) + pools * 0.07;
      fg = vid * (1.0 + pools * 0.9) + add * 0.15;
    }
    if (uPreset != 1 && uPreset != 2 && uPreset != 0 && uPreset != 12) bg += halo * (uPreset == 4 ? 0.0 : 1.0);
    gl_FragColor = vec4(mix(bg, fg, subj), 1.0);
  }`,SM=`
  varying vec2 vUv;
  uniform sampler2D uSrc;
  uniform vec2 uTexel;
  uniform float uThreshold;
  void main() {
    vec3 c = (texture2D(uSrc, vUv + uTexel * vec2(-1.0, -1.0)).rgb + texture2D(uSrc, vUv + uTexel * vec2(1.0, -1.0)).rgb
            + texture2D(uSrc, vUv + uTexel * vec2(-1.0, 1.0)).rgb + texture2D(uSrc, vUv + uTexel * vec2(1.0, 1.0)).rgb) * 0.25;
    float l = max(max(c.r, c.g), c.b);
    float k = smoothstep(uThreshold, uThreshold + 0.35, l);
    gl_FragColor = vec4(c * k, 1.0);
  }`,wM=`
  varying vec2 vUv;
  uniform sampler2D uSrc;
  uniform vec2 uDir;
  void main() {
    vec3 c = texture2D(uSrc, vUv).rgb * 0.2270270;
    c += (texture2D(uSrc, vUv + uDir * 1.3846154).rgb + texture2D(uSrc, vUv - uDir * 1.3846154).rgb) * 0.3162162;
    c += (texture2D(uSrc, vUv + uDir * 3.2307692).rgb + texture2D(uSrc, vUv - uDir * 3.2307692).rgb) * 0.0702703;
    gl_FragColor = vec4(c, 1.0);
  }`,ku=`
  varying vec2 vUv;
  uniform sampler2D uScene, uBloom1, uBloom2, uOld;
  uniform float uMix;
  #ifdef FG
  uniform sampler2D uMask;
  uniform vec4 uOn;
  #endif
  uniform float uTime, uBeat, uFlash, uCA, uBloomK;
  uniform vec2 uRes;
  void main() {
    vec2 d = vUv - 0.5;
    float ca = (0.006 + 0.012 * uBeat) * uCA;
    vec3 c = vec3(texture2D(uScene, vUv + d * ca).r, texture2D(uScene, vUv).g, texture2D(uScene, vUv - d * ca).b);
    if (uMix < 1.0) c = mix(texture2D(uOld, vUv).rgb, c, uMix);
    c += (texture2D(uBloom1, vUv).rgb * 0.75 + texture2D(uBloom2, vUv).rgb * 0.9) * uBloomK;
    c += uBeat * uFlash * 0.07;
    // the highlights roll off instead of clipping: neon stays a colour
    vec3 hi = max(c - 0.8, 0.0);
    c = min(c, 0.8) + 0.2 * (1.0 - exp(-hi * 3.0)) + hi * 0.05;
    #ifdef FG
    // the subjects again, over whatever the 3D scene drew: the same grade, only where they stand
    vec4 m = smoothstep(0.3, 0.7, texture2D(uMask, vec2(vUv.x, 1.0 - vUv.y))) * uOn;
    gl_FragColor = vec4(c, max(max(m.r, m.g), max(m.b, m.a)));
    #else
    gl_FragColor = vec4(c, 1.0);
    #endif
  }`;class EM{material;foreground;_preset=yi[0];get preset(){return this._preset}set preset(t){t!==this._preset&&(this.fromCode=this._preset.code,this.xfade=this.started?0:1,this._preset=t)}fromCode=0;xfade=1;started=!1;rtOld=null;subjects=2;beat=0;setSpots(t,e){const n=this.scene.uniforms;t.forEach((r,s)=>{n.uSpotL.value[s].copy(r.L),n.uSpotP.value[s].copy(r.P),n.uSpotR.value[s].copy(r.R),n.uSpotC.value[s].copy(r.C)}),n.uSpotK.value=e}clones=!0;maskTex;maskData=new Uint8Array(4);mw=0;mh=0;fw=0;fh=0;fxTex;fxData;chans=[null,null,null,null];chanMask=[null,null,null,null];union;dist;trail;stamp;uOn=new ae;box=new ae(.35,.1,.65,.7);quad=new Pt(new Mi(2,2));quadScene=new Sf;cam=new wl(-1,1,1,-1,0,1);cut;scene;bright;blur;rtScene=[];rtB1a=null;rtB1b=null;rtB2a=null;rtB2b=null;hist=null;head=0;flip=0;sizeKey="";constructor(t,e){this.maskTex=new Qr(new Uint8Array(4),1,1,Ve),this.maskTex.needsUpdate=!0,this.resizeFx(160,90);const n={depthTest:!1,depthWrite:!1,toneMapped:!1};this.cut=new ke({...n,vertexShader:Da,fragmentShader:bM,uniforms:{uTex:t.uTex,uMask:{value:this.maskTex},uOn:{value:this.uOn}}}),this.scene=new ke({...n,vertexShader:Da,fragmentShader:yM,uniforms:{uTex:t.uTex,uMask:{value:this.maskTex},uFx:{value:this.fxTex},uPrev:{value:null},uHist:{value:null},uHead:{value:0},uClones:{value:1},uSpotL:{value:[0,1,2].map(()=>new bt(.5,1.2))},uSpotP:{value:[0,1,2].map(()=>new bt(.5,.1))},uSpotR:{value:[0,1,2].map(()=>new bt(.1,.04))},uSpotC:{value:[0,1,2].map(()=>new Ut(0,0,0))},uSpotK:{value:0},uClone:{value:Array.from({length:9},()=>new ae)},uCloneN:{value:0},uFoot:{value:new bt(.5,.1)},uFootW:{value:.2},uTime:{value:0},uAspect:{value:1},uBeat:{value:0},uLevel:{value:0},uPreset:{value:0},uOn:{value:this.uOn},uBox:{value:this.box},uPal:{value:_M.flat().map(r=>new Ut(r))}}}),this.bright=new ke({...n,vertexShader:Da,fragmentShader:SM,uniforms:{uSrc:{value:null},uTexel:{value:new bt},uThreshold:{value:.72}}}),this.blur=new ke({...n,vertexShader:Da,fragmentShader:wM,uniforms:{uSrc:{value:null},uDir:{value:new bt}}}),this.material=new ke({...n,vertexShader:e,fragmentShader:ku,uniforms:{uCrop:t.uCrop,uMirror:t.uMirror,uScene:{value:null},uBloom1:{value:null},uBloom2:{value:null},uTime:{value:0},uBeat:{value:0},uFlash:{value:1},uRes:{value:new bt(1,1)},uOld:{value:null},uMix:{value:1},uCA:{value:1},uBloomK:{value:1}}}),this.foreground=new ke({...n,vertexShader:e,fragmentShader:ku,transparent:!0,defines:{FG:1},uniforms:{...this.material.uniforms,uMask:this.scene.uniforms.uMask,uOn:this.scene.uniforms.uOn}}),this.quad.frustumCulled=!1,this.quadScene.add(this.quad)}resizeFx(t,e){this.fxTex?.dispose(),this.fxData=new Uint8Array(t*e*4),this.fxTex=new Qr(this.fxData,t,e,Ve),this.fxTex.magFilter=ge,this.fxTex.minFilter=ge,this.union=new Float32Array(t*e),this.dist=new Float32Array(t*e),this.trail=new Float32Array(t*e),this.stamp=new Float32Array(t*e);for(let n=0;n<t*e;n++)this.fxData[n*4]=255;this.fxTex.needsUpdate=!0,this.fw=t,this.fh=e,this.scene&&(this.scene.uniforms.uFx.value=this.fxTex)}frameDt=1/30;update(t,e,n,r,s,a){this.frameDt=e;const o=this.scene.uniforms;o.uTime.value=n,o.uAspect.value=r,o.uPreset.value=this.preset.code,o.uBeat.value=this.beat,o.uClones.value=this.clones?1:0,this.material.uniforms.uTime.value=n,this.material.uniforms.uBeat.value=this.beat;const c=this.preset.code===12;this.material.uniforms.uCA.value=c?.25:1,this.material.uniforms.uBloomK.value=c?.45:1;const l=r>=1?160:Math.max(48,Math.round(160*r)),h=r>=1?Math.max(48,Math.round(160/r)):160;(l!==this.fw||h!==this.fh)&&this.resizeFx(l,h);const u=t.filter(m=>m.presence>0).sort((m,p)=>p.len.torso/-p.T.z-m.len.torso/-m.T.z).slice(0,this.subjects),d=new Set(u.map(m=>m.id));for(let m=0;m<4;m++)this.chans[m]!==null&&!d.has(this.chans[m])&&(this.chans[m]=null,this.chanMask[m]=null);for(const m of u){let p=this.chans.indexOf(m.id);if(p<0){if(p=this.chans.indexOf(null),p<0)continue;this.chans[p]=m.id}const b=m.det?.mask;if(b){(b.w!==this.mw||b.h!==this.mh)&&this.resizeMask(b.w,b.h);let y=this.chanMask[p];if(!y||y.length!==b.data.length)y=this.chanMask[p]=new Float32Array(b.data.length),y.set(b.data);else{const _=1-Math.exp(-e/.04),E=b.data;for(let w=0;w<E.length;w++)y[w]=y[w]+(E[w]-y[w])*_}}}const f=[0,0,0,0];for(let m=0;m<4;m++){const p=this.chans[m];p!==null&&this.chanMask[m]&&(f[m]=t.find(b=>b.id===p)?.presence??0)}if(this.uOn.set(f[0],f[1],f[2],f[3]),this.fx(e,n,f),this.layPyramid(u[0],s,a,e),!this.mw)return;const g=this.mw*this.mh,v=this.maskData;for(let m=0;m<4;m++){const p=this.chanMask[m];if(!p){for(let b=0;b<g;b++)v[b*4+m]=0;continue}for(let b=0;b<g;b++)v[b*4+m]=p[b]*255}this.maskTex.needsUpdate=!0}cloneSm=Array.from({length:9},()=>new ae);cloneSmN=0;layPyramid(t,e,n,r=1/30){const s=this.scene.uniforms;if(!t||!e||!n){s.uCloneN.value=0,this.cloneSmN=0;return}const a=new I(t.T.x,t.T.y,t.T.z),o=e.foot(a),c=Math.max(1.2,Math.min(2.2,e.height(a)*1.9)),{back:l,side:h}=e.axes(),u=is(o,n),d=1-Math.exp(-r/.15),f=s.uFoot.value;this.cloneSmN===0?f.set(u.x,1-u.y):f.lerp(new bt(u.x,1-u.y),d),s.uFootW.value=Math.max(.05,this.box.z-this.box.x);const g=[];for(let m=1;m<=3;m++)for(let p=0;p<=m;p++){const b=p-m/2,y=o.clone().addScaledVector(l,m*c*.5).addScaledVector(h,b*c*.55);if(y.z>-.3)continue;const _=is(y,n);g.push({v:new ae(_.x,1-_.y,-o.z/-y.z,m*3+Math.abs(b)*1.5),depth:-y.z})}g.sort((m,p)=>p.depth-m.depth);const v=s.uClone.value;g.forEach((m,p)=>{const b=this.cloneSm[p];this.cloneSmN!==g.length?b.copy(m.v):b.lerp(m.v,d),b.w=m.v.w,v[p].copy(b)}),this.cloneSmN=g.length,s.uCloneN.value=g.length}resizeMask(t,e){this.maskTex.dispose(),this.mw=t,this.mh=e,this.maskData=new Uint8Array(t*e*4),this.maskTex=new Qr(this.maskData,t,e,Ve),this.maskTex.magFilter=ge,this.maskTex.minFilter=ge,this.scene.uniforms.uMask.value=this.maskTex,this.cut.uniforms.uMask.value=this.maskTex}fx(t,e,n){const r=this.fw,s=this.fh,a=this.union,o=this.dist;let c=r,l=s,h=-1,u=-1;for(let p=0;p<s;p++){const b=Math.min(this.mh-1,Math.floor((p+.5)/s*this.mh));for(let y=0;y<r;y++){let _=0;if(this.mw){const E=b*this.mw+Math.min(this.mw-1,Math.floor((y+.5)/r*this.mw));for(let w=0;w<4;w++){const A=this.chanMask[w];A&&(_=Math.max(_,A[E]*n[w]))}}a[p*r+y]=_,_>.5&&(y<c&&(c=y),y>h&&(h=y),p<l&&(l=p),p>u&&(u=p))}}if(h>=0){const p=1-Math.exp(-t/.12),b=c/r,y=(h+1)/r,_=1-(u+1)/s,E=1-l/s;this.box.set(this.box.x+(b-this.box.x)*p,this.box.y+(_-this.box.y)*p,this.box.z+(y-this.box.z)*p,this.box.w+(E-this.box.w)*p)}const d=1e6,f=Math.SQRT2;for(let p=0;p<r*s;p++)o[p]=a[p]>.5?0:d;for(let p=0;p<s;p++)for(let b=0;b<r;b++){const y=p*r+b;let _=o[y];b>0&&(_=Math.min(_,o[y-1]+1)),p>0&&(_=Math.min(_,o[y-r]+1),b>0&&(_=Math.min(_,o[y-r-1]+f)),b<r-1&&(_=Math.min(_,o[y-r+1]+f))),o[y]=_}for(let p=s-1;p>=0;p--)for(let b=r-1;b>=0;b--){const y=p*r+b;let _=o[y];b<r-1&&(_=Math.min(_,o[y+1]+1)),p<s-1&&(_=Math.min(_,o[y+r]+1),b<r-1&&(_=Math.min(_,o[y+r+1]+f)),b>0&&(_=Math.min(_,o[y+r-1]+f))),o[y]=_}const g=Math.exp(-t/1.1),v=e*.2%1,m=this.fxData;for(let p=0;p<r*s;p++){const b=a[p];this.trail[p]=Math.max(this.trail[p]*g,b),b>.5&&(this.stamp[p]=v),m[p*4]=Math.min(1,o[p]/48)*255,m[p*4+1]=this.trail[p]*255,m[p*4+2]=this.stamp[p]*255,m[p*4+3]=b*255}this.fxTex.needsUpdate=!0}targets(t,e,n){const s=900/Math.max(e,n),a=Math.max(64,Math.round(e*s)),o=Math.max(64,Math.round(n*s)),c=`${a}x${o}`;if(c===this.sizeKey)return;this.sizeKey=c;for(const p of[...this.rtScene,this.rtB1a,this.rtB1b,this.rtB2a,this.rtB2b,this.rtOld])p?.dispose();this.hist?.dispose();const l=t.extensions,h=l.has("EXT_color_buffer_half_float")||l.has("EXT_color_buffer_float"),u={type:h?xr:Gn,depthBuffer:!1,magFilter:ge,minFilter:ge};this.bright.uniforms.uThreshold.value=h?.72:.62,this.rtScene=[new en(a,o,u),new en(a,o,u)],this.rtOld=new en(a,o,u);const d=Math.max(16,Math.round(a/4)),f=Math.max(16,Math.round(o/4)),g=Math.max(8,Math.round(a/16)),v=Math.max(8,Math.round(o/16));this.rtB1a=new en(d,f,u),this.rtB1b=new en(d,f,u),this.rtB2a=new en(g,v,u),this.rtB2b=new en(g,v,u);const m=480/Math.max(e,n);this.hist=new J0(Math.round(e*m),Math.round(n*m),Za,{depthBuffer:!1}),this.hist.texture.magFilter=ge,this.hist.texture.minFilter=ge,this.scene.uniforms.uHist.value=this.hist.texture,this.material.uniforms.uRes.value.set(a,o)}pass(t,e,n,r=0){this.quad.material=e,t.setRenderTarget(n,r),t.render(this.quadScene,this.cam)}render(t,e,n){this.targets(t,e,n);const r=t.getRenderTarget();this.head=(this.head+1)%Za,this.pass(t,this.cut,this.hist,this.head),this.scene.uniforms.uHead.value=this.head;const s=this.rtScene[this.flip],a=this.rtScene[1-this.flip];this.flip=1-this.flip,this.scene.uniforms.uPrev.value=a.texture,this.pass(t,this.scene,s),this.started=!0;const o=this.material.uniforms;if(this.xfade<1){this.xfade=Math.min(1,this.xfade+this.frameDt/.45);const f=this.scene.uniforms.uPreset.value;this.scene.uniforms.uPreset.value=this.fromCode,this.pass(t,this.scene,this.rtOld),this.scene.uniforms.uPreset.value=f,o.uOld.value=this.rtOld.texture}const c=this.xfade;o.uMix.value=c*c*(3-2*c);const l=this.bright.uniforms,h=this.blur.uniforms;l.uSrc.value=s.texture,l.uTexel.value.set(1/s.width,1/s.height),this.pass(t,this.bright,this.rtB1a);const u=(f,g,v)=>{for(let m=0;m<v;m++)h.uSrc.value=f.texture,h.uDir.value.set(1.4/f.width,0),this.pass(t,this.blur,g),h.uSrc.value=g.texture,h.uDir.value.set(0,1.4/f.height),this.pass(t,this.blur,f)};u(this.rtB1a,this.rtB1b,1),l.uSrc.value=this.rtB1a.texture,l.uTexel.value.set(1/this.rtB1a.width,1/this.rtB1a.height);const d=l.uThreshold.value;l.uThreshold.value=0,this.pass(t,this.bright,this.rtB2a),l.uThreshold.value=d,u(this.rtB2a,this.rtB2b,2),t.setRenderTarget(r),o.uScene.value=s.texture,o.uBloom1.value=this.rtB1a.texture,o.uBloom2.value=this.rtB2a.texture}}class TM{env=0;level=0;stream=null;ctx=null;an=null;buf=new Uint8Array(0);avg=0;last=0;get on(){return!!this.an}async start(){if(this.an)return;this.stream=await navigator.mediaDevices.getUserMedia({audio:{echoCancellation:!1,noiseSuppression:!1,autoGainControl:!1}});const t=window.AudioContext??window.webkitAudioContext;this.ctx=new t,await this.ctx.resume();const e=this.ctx.createMediaStreamSource(this.stream);this.an=this.ctx.createAnalyser(),this.an.fftSize=1024,this.an.smoothingTimeConstant=0,e.connect(this.an),this.buf=new Uint8Array(this.an.frequencyBinCount)}stop(){for(const t of this.stream?.getTracks()??[])t.stop();this.ctx?.close(),this.stream=null,this.ctx=null,this.an=null,this.env=0,this.level=0}update(t,e){if(this.env*=Math.exp(-t/.18),!this.an||!this.ctx)return;this.an.getByteFrequencyData(this.buf);const n=this.ctx.sampleRate/this.an.fftSize,r=Math.max(1,Math.floor(40/n)),s=Math.max(r+1,Math.ceil(160/n));let a=0;for(let c=r;c<=s;c++)a+=this.buf[c];const o=a/((s-r+1)*255);this.level+=(o-this.level)*Math.min(1,t/.1),this.avg+=(o-this.avg)*Math.min(1,t/1.2),o>this.avg*1.3+.04&&o>.22&&e-this.last>260&&(this.env=1,this.last=e)}}class AM{up=null;listening=!1;async enable(){const t=window.DeviceOrientationEvent;try{if(t?.requestPermission&&await t.requestPermission()!=="granted")return!1}catch{return!1}return this.listening||(this.listening=!0,window.addEventListener("deviceorientation",e=>{if(e.beta===null||e.gamma===null)return;const n=Zr.degToRad(e.beta),r=Zr.degToRad(e.gamma);(this.up??=new I).set(-Math.sin(r)*Math.cos(n),Math.sin(n),Math.cos(r)*Math.cos(n)).normalize()})),!0}upInCamera(t){if(!this.up)return null;const e=Zr.degToRad(screen.orientation?.angle??window.orientation??0),n=this.up.clone().applyAxisAngle(new I(0,0,1),-e);return t==="user"&&(n.x=-n.x,n.z=-n.z),n}}const xn={tauJaw:.05,tauBlink:.04,tauShape:.1,tauPlace:.05,forgetMs:400};class RM{lm=null;lastTs=-1;inferMs=0;async load(t){const n=await $u(()=>import("./vision_bundle-Bk4VIwNi.js"),[],import.meta.url),r=await n.FilesetResolver.forVisionTasks("./mediapipe"),s=a=>n.FaceLandmarker.createFromOptions(r,{baseOptions:{modelAssetPath:"./models/face_landmarker.task",delegate:a},runningMode:"VIDEO",numFaces:t,outputFaceBlendshapes:!0,minFaceDetectionConfidence:.4,minFacePresenceConfidence:.4,minTrackingConfidence:.4});try{this.lm=await s("GPU")}catch{this.lm=await s("CPU")}}async setFaces(t){await this.lm?.setOptions({numFaces:t})}detect(t,e){if(!this.lm)return[];e<=this.lastTs&&(e=this.lastTs+1),this.lastTs=e;const n=performance.now(),r=this.lm.detectForVideo(t,e);return this.inferMs=performance.now()-n,r.faceLandmarks.map((s,a)=>{const o=new Map;for(const c of r.faceBlendshapes[a]?.categories??[])o.set(c.categoryName,c.score);return{pts:s,shapes:o}})}close(){this.lm?.close(),this.lm=null}}const Cn=(i,t,e,n)=>i+(t-i)*(1-Math.exp(-e/n)),el=(i,t)=>({x:(i.x+t.x)/2,y:(i.y+t.y)/2}),Vs=(i,t,e)=>Math.hypot((i.x-t.x)*e,i.y-t.y);function CM(i,t){const e=i.pts,n=(s,a)=>({...el(e[s],e[a]),r:Vs(e[s],e[a],t)*.62/t}),r=s=>i.shapes.get(s)??0;return{eyes:[n(263,362),n(33,133)],mouth:{...el(e[13],e[14]),w:Vs(e[61],e[291],t)/t},nose:e[1],jaw:Math.min(1,r("jawOpen")*1.4),blinkL:r("eyeBlinkLeft"),blinkR:r("eyeBlinkRight"),smile:(r("mouthSmileLeft")+r("mouthSmileRight"))/2,pucker:r("mouthPucker"),browUp:r("browInnerUp")}}function LM(i,t){const e=i.image,n=Vs(e[B.eyeL],e[B.eyeR],t)*.3/t;return{eyes:[{x:e[B.eyeL].x,y:e[B.eyeL].y,r:n},{x:e[B.eyeR].x,y:e[B.eyeR].y,r:n}],mouth:{...el(e[B.mouthL],e[B.mouthR]),w:Vs(e[B.mouthL],e[B.mouthR],t)/t}}}function PM(i,t,e,n,r){const s=(t??[]).map(o=>CM(o,e)),a=new Set;for(const o of i){if(o.lost)continue;const c=o.image[B.nose];let l=-1,h=1/0;s.forEach((v,m)=>{if(a.has(m))return;const p=Vs(v.nose,c,e),b=Math.max(v.mouth.w*3,.03);p<b*1.5&&p<h&&(h=p,l=m)});const u=l>=0?s[l]:null;l>=0&&a.add(l);const d=u??LM(o,e);let f=o.face;f||(f=o.face={jaw:0,blinkL:0,blinkR:0,smile:0,pucker:0,browUp:0,eyes:d.eyes.map(v=>({...v})),mouth:{...d.mouth},read:!!u,seen:n}),d.eyes.forEach((v,m)=>{const p=f.eyes[m];p.x=Cn(p.x,v.x,r,xn.tauPlace),p.y=Cn(p.y,v.y,r,xn.tauPlace),p.r=Cn(p.r,v.r,r,xn.tauPlace*3)}),f.mouth.x=Cn(f.mouth.x,d.mouth.x,r,xn.tauPlace),f.mouth.y=Cn(f.mouth.y,d.mouth.y,r,xn.tauPlace),f.mouth.w=Cn(f.mouth.w,d.mouth.w,r,xn.tauPlace*3);const g=u??{jaw:0,blinkL:0,blinkR:0,smile:0,pucker:0,browUp:0};f.jaw=Cn(f.jaw,g.jaw,r,xn.tauJaw),f.blinkL=Cn(f.blinkL,g.blinkL,r,xn.tauBlink),f.blinkR=Cn(f.blinkR,g.blinkR,r,xn.tauBlink),f.smile=Cn(f.smile,g.smile,r,xn.tauShape),f.pucker=Cn(f.pucker,g.pucker,r,xn.tauShape),f.browUp=Cn(f.browUp,g.browUp,r,xn.tauShape),u?(f.read=!0,f.seen=n):n-f.seen>xn.forgetMs&&(f.read=!1)}}const Ia={people:2,model:"lite",size:1,lens:.85,envLight:!0,shadows:!0,debug:!1,mode:"one",costume:"jimothy",scene:"costume",effect:"insitu",partyCostumes:"behind",music:!1,faces:!0,googly:!1,breath:!0,partyCast:"skeleton",v:2},vd="costuma26.settings";function DM(){try{const i=JSON.parse(localStorage.getItem(vd)??"{}"),t=i.v??(Object.keys(i).length?1:Ia.v),e={...Ia,...i},n=e.partyCostumes;return n===!0?e.partyCostumes="on":n!=="behind"&&n!=="on"&&(e.partyCostumes="off"),t<2&&(e.effect="insitu",e.partyCostumes="behind",e.partyCast="skeleton"),e.v=Ia.v,e}catch{return{...Ia}}}function IM(i){try{localStorage.setItem(vd,JSON.stringify(i))}catch{}}const Ua=i=>`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${i}</svg>`,Ni={qr:Ua('<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><path d="M14 14h3v3h-3zM20 14v.01M14 20h.01M17 20h4v-3"/>'),flip:Ua('<path d="M4 7h3l2-3h6l2 3h3a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1z"/><path d="M9 13a3 3 0 0 1 5-2.2M15 13a3 3 0 0 1-5 2.2"/><path d="M14 9v2h-2M10 17v-2h2"/>'),gear:Ua('<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/>'),camera:Ua('<path d="M4 8h3l2-3h6l2 3h3a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1z"/><circle cx="12" cy="13" r="3.5"/>'),googly:'<svg viewBox="0 0 24 24"><circle cx="7.5" cy="12" r="5.5" fill="#fff" stroke="currentColor" stroke-width="1.5"/><circle cx="16.5" cy="12" r="5.5" fill="#fff" stroke="currentColor" stroke-width="1.5"/><circle cx="6.5" cy="14.2" r="2.4" fill="#111"/><circle cx="17.8" cy="13.6" r="2.4" fill="#111"/></svg>',rec:'<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="7" fill="currentColor"/></svg>',stop:'<svg viewBox="0 0 24 24"><rect x="6" y="6" width="12" height="12" rx="2" fill="currentColor"/></svg>'};function UM(i){return i&&i.__esModule&&Object.prototype.hasOwnProperty.call(i,"default")?i.default:i}var Zo={exports:{}},Hu;function NM(){return Hu||(Hu=1,(function(i,t){var e=(function(){var n=function(E,w){var A=236,R=17,x=E,M=s[w],S=null,T=0,D=null,U=[],N={},z=function(F,k){T=x*4+17,S=(function(H){for(var X=new Array(H),Z=0;Z<H;Z+=1){X[Z]=new Array(H);for(var P=0;P<H;P+=1)X[Z][P]=null}return X})(T),$(0,0),$(T-7,0),$(0,T-7),rt(),tt(),xt(F,k),x>=7&&lt(F),D==null&&(D=nt(x,M,U)),Ct(D,k)},$=function(F,k){for(var H=-1;H<=7;H+=1)if(!(F+H<=-1||T<=F+H))for(var X=-1;X<=7;X+=1)k+X<=-1||T<=k+X||(0<=H&&H<=6&&(X==0||X==6)||0<=X&&X<=6&&(H==0||H==6)||2<=H&&H<=4&&2<=X&&X<=4?S[F+H][k+X]=!0:S[F+H][k+X]=!1)},V=function(){for(var F=0,k=0,H=0;H<8;H+=1){z(!0,H);var X=o.getLostPoint(N);(H==0||F>X)&&(F=X,k=H)}return k},tt=function(){for(var F=8;F<T-8;F+=1)S[F][6]==null&&(S[F][6]=F%2==0);for(var k=8;k<T-8;k+=1)S[6][k]==null&&(S[6][k]=k%2==0)},rt=function(){for(var F=o.getPatternPosition(x),k=0;k<F.length;k+=1)for(var H=0;H<F.length;H+=1){var X=F[k],Z=F[H];if(S[X][Z]==null)for(var P=-2;P<=2;P+=1)for(var ut=-2;ut<=2;ut+=1)P==-2||P==2||ut==-2||ut==2||P==0&&ut==0?S[X+P][Z+ut]=!0:S[X+P][Z+ut]=!1}},lt=function(F){for(var k=o.getBCHTypeNumber(x),H=0;H<18;H+=1){var X=!F&&(k>>H&1)==1;S[Math.floor(H/3)][H%3+T-8-3]=X}for(var H=0;H<18;H+=1){var X=!F&&(k>>H&1)==1;S[H%3+T-8-3][Math.floor(H/3)]=X}},xt=function(F,k){for(var H=M<<3|k,X=o.getBCHTypeInfo(H),Z=0;Z<15;Z+=1){var P=!F&&(X>>Z&1)==1;Z<6?S[Z][8]=P:Z<8?S[Z+1][8]=P:S[T-15+Z][8]=P}for(var Z=0;Z<15;Z+=1){var P=!F&&(X>>Z&1)==1;Z<8?S[8][T-Z-1]=P:Z<9?S[8][15-Z-1+1]=P:S[8][15-Z-1]=P}S[T-8][8]=!F},Ct=function(F,k){for(var H=-1,X=T-1,Z=7,P=0,ut=o.getMaskFunction(k),at=T-1;at>0;at-=2)for(at==6&&(at-=1);;){for(var Mt=0;Mt<2;Mt+=1)if(S[X][at-Mt]==null){var pt=!1;P<F.length&&(pt=(F[P]>>>Z&1)==1);var _t=ut(X,at-Mt);_t&&(pt=!pt),S[X][at-Mt]=pt,Z-=1,Z==-1&&(P+=1,Z=7)}if(X+=H,X<0||T<=X){X-=H,H=-H;break}}},Ot=function(F,k){for(var H=0,X=0,Z=0,P=new Array(k.length),ut=new Array(k.length),at=0;at<k.length;at+=1){var Mt=k[at].dataCount,pt=k[at].totalCount-Mt;X=Math.max(X,Mt),Z=Math.max(Z,pt),P[at]=new Array(Mt);for(var _t=0;_t<P[at].length;_t+=1)P[at][_t]=255&F.getBuffer()[_t+H];H+=Mt;var yt=o.getErrorCorrectPolynomial(pt),Bt=l(P[at],yt.getLength()-1),Ee=Bt.mod(yt);ut[at]=new Array(yt.getLength()-1);for(var _t=0;_t<ut[at].length;_t+=1){var ve=_t+Ee.getLength()-ut[at].length;ut[at][_t]=ve>=0?Ee.getAt(ve):0}}for(var O=0,_t=0;_t<k.length;_t+=1)O+=k[_t].totalCount;for(var C=new Array(O),j=0,_t=0;_t<X;_t+=1)for(var at=0;at<k.length;at+=1)_t<P[at].length&&(C[j]=P[at][_t],j+=1);for(var _t=0;_t<Z;_t+=1)for(var at=0;at<k.length;at+=1)_t<ut[at].length&&(C[j]=ut[at][_t],j+=1);return C},nt=function(F,k,H){for(var X=h.getRSBlocks(F,k),Z=u(),P=0;P<H.length;P+=1){var ut=H[P];Z.put(ut.getMode(),4),Z.put(ut.getLength(),o.getLengthInBits(ut.getMode(),F)),ut.write(Z)}for(var at=0,P=0;P<X.length;P+=1)at+=X[P].dataCount;if(Z.getLengthInBits()>at*8)throw"code length overflow. ("+Z.getLengthInBits()+">"+at*8+")";for(Z.getLengthInBits()+4<=at*8&&Z.put(0,4);Z.getLengthInBits()%8!=0;)Z.putBit(!1);for(;!(Z.getLengthInBits()>=at*8||(Z.put(A,8),Z.getLengthInBits()>=at*8));)Z.put(R,8);return Ot(Z,X)};N.addData=function(F,k){k=k||"Byte";var H=null;switch(k){case"Numeric":H=d(F);break;case"Alphanumeric":H=f(F);break;case"Byte":H=g(F);break;case"Kanji":H=v(F);break;default:throw"mode:"+k}U.push(H),D=null},N.isDark=function(F,k){if(F<0||T<=F||k<0||T<=k)throw F+","+k;return S[F][k]},N.getModuleCount=function(){return T},N.make=function(){if(x<1){for(var F=1;F<40;F++){for(var k=h.getRSBlocks(F,M),H=u(),X=0;X<U.length;X++){var Z=U[X];H.put(Z.getMode(),4),H.put(Z.getLength(),o.getLengthInBits(Z.getMode(),F)),Z.write(H)}for(var P=0,X=0;X<k.length;X++)P+=k[X].dataCount;if(H.getLengthInBits()<=P*8)break}x=F}z(!1,V())},N.createTableTag=function(F,k){F=F||2,k=typeof k>"u"?F*4:k;var H="";H+='<table style="',H+=" border-width: 0px; border-style: none;",H+=" border-collapse: collapse;",H+=" padding: 0px; margin: "+k+"px;",H+='">',H+="<tbody>";for(var X=0;X<N.getModuleCount();X+=1){H+="<tr>";for(var Z=0;Z<N.getModuleCount();Z+=1)H+='<td style="',H+=" border-width: 0px; border-style: none;",H+=" border-collapse: collapse;",H+=" padding: 0px; margin: 0px;",H+=" width: "+F+"px;",H+=" height: "+F+"px;",H+=" background-color: ",H+=N.isDark(X,Z)?"#000000":"#ffffff",H+=";",H+='"/>';H+="</tr>"}return H+="</tbody>",H+="</table>",H},N.createSvgTag=function(F,k,H,X){var Z={};typeof arguments[0]=="object"&&(Z=arguments[0],F=Z.cellSize,k=Z.margin,H=Z.alt,X=Z.title),F=F||2,k=typeof k>"u"?F*4:k,H=typeof H=="string"?{text:H}:H||{},H.text=H.text||null,H.id=H.text?H.id||"qrcode-description":null,X=typeof X=="string"?{text:X}:X||{},X.text=X.text||null,X.id=X.text?X.id||"qrcode-title":null;var P=N.getModuleCount()*F+k*2,ut,at,Mt,pt,_t="",yt;for(yt="l"+F+",0 0,"+F+" -"+F+",0 0,-"+F+"z ",_t+='<svg version="1.1" xmlns="http://www.w3.org/2000/svg"',_t+=Z.scalable?"":' width="'+P+'px" height="'+P+'px"',_t+=' viewBox="0 0 '+P+" "+P+'" ',_t+=' preserveAspectRatio="xMinYMin meet"',_t+=X.text||H.text?' role="img" aria-labelledby="'+W([X.id,H.id].join(" ").trim())+'"':"",_t+=">",_t+=X.text?'<title id="'+W(X.id)+'">'+W(X.text)+"</title>":"",_t+=H.text?'<description id="'+W(H.id)+'">'+W(H.text)+"</description>":"",_t+='<rect width="100%" height="100%" fill="white" cx="0" cy="0"/>',_t+='<path d="',Mt=0;Mt<N.getModuleCount();Mt+=1)for(pt=Mt*F+k,ut=0;ut<N.getModuleCount();ut+=1)N.isDark(Mt,ut)&&(at=ut*F+k,_t+="M"+at+","+pt+yt);return _t+='" stroke="transparent" fill="black"/>',_t+="</svg>",_t},N.createDataURL=function(F,k){F=F||2,k=typeof k>"u"?F*4:k;var H=N.getModuleCount()*F+k*2,X=k,Z=H-k;return _(H,H,function(P,ut){if(X<=P&&P<Z&&X<=ut&&ut<Z){var at=Math.floor((P-X)/F),Mt=Math.floor((ut-X)/F);return N.isDark(Mt,at)?0:1}else return 1})},N.createImgTag=function(F,k,H){F=F||2,k=typeof k>"u"?F*4:k;var X=N.getModuleCount()*F+k*2,Z="";return Z+="<img",Z+=' src="',Z+=N.createDataURL(F,k),Z+='"',Z+=' width="',Z+=X,Z+='"',Z+=' height="',Z+=X,Z+='"',H&&(Z+=' alt="',Z+=W(H),Z+='"'),Z+="/>",Z};var W=function(F){for(var k="",H=0;H<F.length;H+=1){var X=F.charAt(H);switch(X){case"<":k+="&lt;";break;case">":k+="&gt;";break;case"&":k+="&amp;";break;case'"':k+="&quot;";break;default:k+=X;break}}return k},K=function(F){var k=1;F=typeof F>"u"?k*2:F;var H=N.getModuleCount()*k+F*2,X=F,Z=H-F,P,ut,at,Mt,pt,_t={"██":"█","█ ":"▀"," █":"▄","  ":" "},yt={"██":"▀","█ ":"▀"," █":" ","  ":" "},Bt="";for(P=0;P<H;P+=2){for(at=Math.floor((P-X)/k),Mt=Math.floor((P+1-X)/k),ut=0;ut<H;ut+=1)pt="█",X<=ut&&ut<Z&&X<=P&&P<Z&&N.isDark(at,Math.floor((ut-X)/k))&&(pt=" "),X<=ut&&ut<Z&&X<=P+1&&P+1<Z&&N.isDark(Mt,Math.floor((ut-X)/k))?pt+=" ":pt+="█",Bt+=F<1&&P+1>=Z?yt[pt]:_t[pt];Bt+=`
`}return H%2&&F>0?Bt.substring(0,Bt.length-H-1)+Array(H+1).join("▀"):Bt.substring(0,Bt.length-1)};return N.createASCII=function(F,k){if(F=F||1,F<2)return K(k);F-=1,k=typeof k>"u"?F*2:k;var H=N.getModuleCount()*F+k*2,X=k,Z=H-k,P,ut,at,Mt,pt=Array(F+1).join("██"),_t=Array(F+1).join("  "),yt="",Bt="";for(P=0;P<H;P+=1){for(at=Math.floor((P-X)/F),Bt="",ut=0;ut<H;ut+=1)Mt=1,X<=ut&&ut<Z&&X<=P&&P<Z&&N.isDark(at,Math.floor((ut-X)/F))&&(Mt=0),Bt+=Mt?pt:_t;for(at=0;at<F;at+=1)yt+=Bt+`
`}return yt.substring(0,yt.length-1)},N.renderTo2dContext=function(F,k){k=k||2;for(var H=N.getModuleCount(),X=0;X<H;X++)for(var Z=0;Z<H;Z++)F.fillStyle=N.isDark(X,Z)?"black":"white",F.fillRect(X*k,Z*k,k,k)},N};n.stringToBytesFuncs={default:function(E){for(var w=[],A=0;A<E.length;A+=1){var R=E.charCodeAt(A);w.push(R&255)}return w}},n.stringToBytes=n.stringToBytesFuncs.default,n.createStringToBytes=function(E,w){var A=(function(){for(var x=b(E),M=function(){var tt=x.read();if(tt==-1)throw"eof";return tt},S=0,T={};;){var D=x.read();if(D==-1)break;var U=M(),N=M(),z=M(),$=String.fromCharCode(D<<8|U),V=N<<8|z;T[$]=V,S+=1}if(S!=w)throw S+" != "+w;return T})(),R=63;return function(x){for(var M=[],S=0;S<x.length;S+=1){var T=x.charCodeAt(S);if(T<128)M.push(T);else{var D=A[x.charAt(S)];typeof D=="number"?(D&255)==D?M.push(D):(M.push(D>>>8),M.push(D&255)):M.push(R)}}return M}};var r={MODE_NUMBER:1,MODE_ALPHA_NUM:2,MODE_8BIT_BYTE:4,MODE_KANJI:8},s={L:1,M:0,Q:3,H:2},a={PATTERN000:0,PATTERN001:1,PATTERN010:2,PATTERN011:3,PATTERN100:4,PATTERN101:5,PATTERN110:6,PATTERN111:7},o=(function(){var E=[[],[6,18],[6,22],[6,26],[6,30],[6,34],[6,22,38],[6,24,42],[6,26,46],[6,28,50],[6,30,54],[6,32,58],[6,34,62],[6,26,46,66],[6,26,48,70],[6,26,50,74],[6,30,54,78],[6,30,56,82],[6,30,58,86],[6,34,62,90],[6,28,50,72,94],[6,26,50,74,98],[6,30,54,78,102],[6,28,54,80,106],[6,32,58,84,110],[6,30,58,86,114],[6,34,62,90,118],[6,26,50,74,98,122],[6,30,54,78,102,126],[6,26,52,78,104,130],[6,30,56,82,108,134],[6,34,60,86,112,138],[6,30,58,86,114,142],[6,34,62,90,118,146],[6,30,54,78,102,126,150],[6,24,50,76,102,128,154],[6,28,54,80,106,132,158],[6,32,58,84,110,136,162],[6,26,54,82,110,138,166],[6,30,58,86,114,142,170]],w=1335,A=7973,R=21522,x={},M=function(S){for(var T=0;S!=0;)T+=1,S>>>=1;return T};return x.getBCHTypeInfo=function(S){for(var T=S<<10;M(T)-M(w)>=0;)T^=w<<M(T)-M(w);return(S<<10|T)^R},x.getBCHTypeNumber=function(S){for(var T=S<<12;M(T)-M(A)>=0;)T^=A<<M(T)-M(A);return S<<12|T},x.getPatternPosition=function(S){return E[S-1]},x.getMaskFunction=function(S){switch(S){case a.PATTERN000:return function(T,D){return(T+D)%2==0};case a.PATTERN001:return function(T,D){return T%2==0};case a.PATTERN010:return function(T,D){return D%3==0};case a.PATTERN011:return function(T,D){return(T+D)%3==0};case a.PATTERN100:return function(T,D){return(Math.floor(T/2)+Math.floor(D/3))%2==0};case a.PATTERN101:return function(T,D){return T*D%2+T*D%3==0};case a.PATTERN110:return function(T,D){return(T*D%2+T*D%3)%2==0};case a.PATTERN111:return function(T,D){return(T*D%3+(T+D)%2)%2==0};default:throw"bad maskPattern:"+S}},x.getErrorCorrectPolynomial=function(S){for(var T=l([1],0),D=0;D<S;D+=1)T=T.multiply(l([1,c.gexp(D)],0));return T},x.getLengthInBits=function(S,T){if(1<=T&&T<10)switch(S){case r.MODE_NUMBER:return 10;case r.MODE_ALPHA_NUM:return 9;case r.MODE_8BIT_BYTE:return 8;case r.MODE_KANJI:return 8;default:throw"mode:"+S}else if(T<27)switch(S){case r.MODE_NUMBER:return 12;case r.MODE_ALPHA_NUM:return 11;case r.MODE_8BIT_BYTE:return 16;case r.MODE_KANJI:return 10;default:throw"mode:"+S}else if(T<41)switch(S){case r.MODE_NUMBER:return 14;case r.MODE_ALPHA_NUM:return 13;case r.MODE_8BIT_BYTE:return 16;case r.MODE_KANJI:return 12;default:throw"mode:"+S}else throw"type:"+T},x.getLostPoint=function(S){for(var T=S.getModuleCount(),D=0,U=0;U<T;U+=1)for(var N=0;N<T;N+=1){for(var z=0,$=S.isDark(U,N),V=-1;V<=1;V+=1)if(!(U+V<0||T<=U+V))for(var tt=-1;tt<=1;tt+=1)N+tt<0||T<=N+tt||V==0&&tt==0||$==S.isDark(U+V,N+tt)&&(z+=1);z>5&&(D+=3+z-5)}for(var U=0;U<T-1;U+=1)for(var N=0;N<T-1;N+=1){var rt=0;S.isDark(U,N)&&(rt+=1),S.isDark(U+1,N)&&(rt+=1),S.isDark(U,N+1)&&(rt+=1),S.isDark(U+1,N+1)&&(rt+=1),(rt==0||rt==4)&&(D+=3)}for(var U=0;U<T;U+=1)for(var N=0;N<T-6;N+=1)S.isDark(U,N)&&!S.isDark(U,N+1)&&S.isDark(U,N+2)&&S.isDark(U,N+3)&&S.isDark(U,N+4)&&!S.isDark(U,N+5)&&S.isDark(U,N+6)&&(D+=40);for(var N=0;N<T;N+=1)for(var U=0;U<T-6;U+=1)S.isDark(U,N)&&!S.isDark(U+1,N)&&S.isDark(U+2,N)&&S.isDark(U+3,N)&&S.isDark(U+4,N)&&!S.isDark(U+5,N)&&S.isDark(U+6,N)&&(D+=40);for(var lt=0,N=0;N<T;N+=1)for(var U=0;U<T;U+=1)S.isDark(U,N)&&(lt+=1);var xt=Math.abs(100*lt/T/T-50)/5;return D+=xt*10,D},x})(),c=(function(){for(var E=new Array(256),w=new Array(256),A=0;A<8;A+=1)E[A]=1<<A;for(var A=8;A<256;A+=1)E[A]=E[A-4]^E[A-5]^E[A-6]^E[A-8];for(var A=0;A<255;A+=1)w[E[A]]=A;var R={};return R.glog=function(x){if(x<1)throw"glog("+x+")";return w[x]},R.gexp=function(x){for(;x<0;)x+=255;for(;x>=256;)x-=255;return E[x]},R})();function l(E,w){if(typeof E.length>"u")throw E.length+"/"+w;var A=(function(){for(var x=0;x<E.length&&E[x]==0;)x+=1;for(var M=new Array(E.length-x+w),S=0;S<E.length-x;S+=1)M[S]=E[S+x];return M})(),R={};return R.getAt=function(x){return A[x]},R.getLength=function(){return A.length},R.multiply=function(x){for(var M=new Array(R.getLength()+x.getLength()-1),S=0;S<R.getLength();S+=1)for(var T=0;T<x.getLength();T+=1)M[S+T]^=c.gexp(c.glog(R.getAt(S))+c.glog(x.getAt(T)));return l(M,0)},R.mod=function(x){if(R.getLength()-x.getLength()<0)return R;for(var M=c.glog(R.getAt(0))-c.glog(x.getAt(0)),S=new Array(R.getLength()),T=0;T<R.getLength();T+=1)S[T]=R.getAt(T);for(var T=0;T<x.getLength();T+=1)S[T]^=c.gexp(c.glog(x.getAt(T))+M);return l(S,0).mod(x)},R}var h=(function(){var E=[[1,26,19],[1,26,16],[1,26,13],[1,26,9],[1,44,34],[1,44,28],[1,44,22],[1,44,16],[1,70,55],[1,70,44],[2,35,17],[2,35,13],[1,100,80],[2,50,32],[2,50,24],[4,25,9],[1,134,108],[2,67,43],[2,33,15,2,34,16],[2,33,11,2,34,12],[2,86,68],[4,43,27],[4,43,19],[4,43,15],[2,98,78],[4,49,31],[2,32,14,4,33,15],[4,39,13,1,40,14],[2,121,97],[2,60,38,2,61,39],[4,40,18,2,41,19],[4,40,14,2,41,15],[2,146,116],[3,58,36,2,59,37],[4,36,16,4,37,17],[4,36,12,4,37,13],[2,86,68,2,87,69],[4,69,43,1,70,44],[6,43,19,2,44,20],[6,43,15,2,44,16],[4,101,81],[1,80,50,4,81,51],[4,50,22,4,51,23],[3,36,12,8,37,13],[2,116,92,2,117,93],[6,58,36,2,59,37],[4,46,20,6,47,21],[7,42,14,4,43,15],[4,133,107],[8,59,37,1,60,38],[8,44,20,4,45,21],[12,33,11,4,34,12],[3,145,115,1,146,116],[4,64,40,5,65,41],[11,36,16,5,37,17],[11,36,12,5,37,13],[5,109,87,1,110,88],[5,65,41,5,66,42],[5,54,24,7,55,25],[11,36,12,7,37,13],[5,122,98,1,123,99],[7,73,45,3,74,46],[15,43,19,2,44,20],[3,45,15,13,46,16],[1,135,107,5,136,108],[10,74,46,1,75,47],[1,50,22,15,51,23],[2,42,14,17,43,15],[5,150,120,1,151,121],[9,69,43,4,70,44],[17,50,22,1,51,23],[2,42,14,19,43,15],[3,141,113,4,142,114],[3,70,44,11,71,45],[17,47,21,4,48,22],[9,39,13,16,40,14],[3,135,107,5,136,108],[3,67,41,13,68,42],[15,54,24,5,55,25],[15,43,15,10,44,16],[4,144,116,4,145,117],[17,68,42],[17,50,22,6,51,23],[19,46,16,6,47,17],[2,139,111,7,140,112],[17,74,46],[7,54,24,16,55,25],[34,37,13],[4,151,121,5,152,122],[4,75,47,14,76,48],[11,54,24,14,55,25],[16,45,15,14,46,16],[6,147,117,4,148,118],[6,73,45,14,74,46],[11,54,24,16,55,25],[30,46,16,2,47,17],[8,132,106,4,133,107],[8,75,47,13,76,48],[7,54,24,22,55,25],[22,45,15,13,46,16],[10,142,114,2,143,115],[19,74,46,4,75,47],[28,50,22,6,51,23],[33,46,16,4,47,17],[8,152,122,4,153,123],[22,73,45,3,74,46],[8,53,23,26,54,24],[12,45,15,28,46,16],[3,147,117,10,148,118],[3,73,45,23,74,46],[4,54,24,31,55,25],[11,45,15,31,46,16],[7,146,116,7,147,117],[21,73,45,7,74,46],[1,53,23,37,54,24],[19,45,15,26,46,16],[5,145,115,10,146,116],[19,75,47,10,76,48],[15,54,24,25,55,25],[23,45,15,25,46,16],[13,145,115,3,146,116],[2,74,46,29,75,47],[42,54,24,1,55,25],[23,45,15,28,46,16],[17,145,115],[10,74,46,23,75,47],[10,54,24,35,55,25],[19,45,15,35,46,16],[17,145,115,1,146,116],[14,74,46,21,75,47],[29,54,24,19,55,25],[11,45,15,46,46,16],[13,145,115,6,146,116],[14,74,46,23,75,47],[44,54,24,7,55,25],[59,46,16,1,47,17],[12,151,121,7,152,122],[12,75,47,26,76,48],[39,54,24,14,55,25],[22,45,15,41,46,16],[6,151,121,14,152,122],[6,75,47,34,76,48],[46,54,24,10,55,25],[2,45,15,64,46,16],[17,152,122,4,153,123],[29,74,46,14,75,47],[49,54,24,10,55,25],[24,45,15,46,46,16],[4,152,122,18,153,123],[13,74,46,32,75,47],[48,54,24,14,55,25],[42,45,15,32,46,16],[20,147,117,4,148,118],[40,75,47,7,76,48],[43,54,24,22,55,25],[10,45,15,67,46,16],[19,148,118,6,149,119],[18,75,47,31,76,48],[34,54,24,34,55,25],[20,45,15,61,46,16]],w=function(x,M){var S={};return S.totalCount=x,S.dataCount=M,S},A={},R=function(x,M){switch(M){case s.L:return E[(x-1)*4+0];case s.M:return E[(x-1)*4+1];case s.Q:return E[(x-1)*4+2];case s.H:return E[(x-1)*4+3];default:return}};return A.getRSBlocks=function(x,M){var S=R(x,M);if(typeof S>"u")throw"bad rs block @ typeNumber:"+x+"/errorCorrectionLevel:"+M;for(var T=S.length/3,D=[],U=0;U<T;U+=1)for(var N=S[U*3+0],z=S[U*3+1],$=S[U*3+2],V=0;V<N;V+=1)D.push(w(z,$));return D},A})(),u=function(){var E=[],w=0,A={};return A.getBuffer=function(){return E},A.getAt=function(R){var x=Math.floor(R/8);return(E[x]>>>7-R%8&1)==1},A.put=function(R,x){for(var M=0;M<x;M+=1)A.putBit((R>>>x-M-1&1)==1)},A.getLengthInBits=function(){return w},A.putBit=function(R){var x=Math.floor(w/8);E.length<=x&&E.push(0),R&&(E[x]|=128>>>w%8),w+=1},A},d=function(E){var w=r.MODE_NUMBER,A=E,R={};R.getMode=function(){return w},R.getLength=function(S){return A.length},R.write=function(S){for(var T=A,D=0;D+2<T.length;)S.put(x(T.substring(D,D+3)),10),D+=3;D<T.length&&(T.length-D==1?S.put(x(T.substring(D,D+1)),4):T.length-D==2&&S.put(x(T.substring(D,D+2)),7))};var x=function(S){for(var T=0,D=0;D<S.length;D+=1)T=T*10+M(S.charAt(D));return T},M=function(S){if("0"<=S&&S<="9")return S.charCodeAt(0)-48;throw"illegal char :"+S};return R},f=function(E){var w=r.MODE_ALPHA_NUM,A=E,R={};R.getMode=function(){return w},R.getLength=function(M){return A.length},R.write=function(M){for(var S=A,T=0;T+1<S.length;)M.put(x(S.charAt(T))*45+x(S.charAt(T+1)),11),T+=2;T<S.length&&M.put(x(S.charAt(T)),6)};var x=function(M){if("0"<=M&&M<="9")return M.charCodeAt(0)-48;if("A"<=M&&M<="Z")return M.charCodeAt(0)-65+10;switch(M){case" ":return 36;case"$":return 37;case"%":return 38;case"*":return 39;case"+":return 40;case"-":return 41;case".":return 42;case"/":return 43;case":":return 44;default:throw"illegal char :"+M}};return R},g=function(E){var w=r.MODE_8BIT_BYTE,A=n.stringToBytes(E),R={};return R.getMode=function(){return w},R.getLength=function(x){return A.length},R.write=function(x){for(var M=0;M<A.length;M+=1)x.put(A[M],8)},R},v=function(E){var w=r.MODE_KANJI,A=n.stringToBytesFuncs.SJIS;if(!A)throw"sjis not supported.";(function(M,S){var T=A(M);if(T.length!=2||(T[0]<<8|T[1])!=S)throw"sjis not supported."})("友",38726);var R=A(E),x={};return x.getMode=function(){return w},x.getLength=function(M){return~~(R.length/2)},x.write=function(M){for(var S=R,T=0;T+1<S.length;){var D=(255&S[T])<<8|255&S[T+1];if(33088<=D&&D<=40956)D-=33088;else if(57408<=D&&D<=60351)D-=49472;else throw"illegal char at "+(T+1)+"/"+D;D=(D>>>8&255)*192+(D&255),M.put(D,13),T+=2}if(T<S.length)throw"illegal char at "+(T+1)},x},m=function(){var E=[],w={};return w.writeByte=function(A){E.push(A&255)},w.writeShort=function(A){w.writeByte(A),w.writeByte(A>>>8)},w.writeBytes=function(A,R,x){R=R||0,x=x||A.length;for(var M=0;M<x;M+=1)w.writeByte(A[M+R])},w.writeString=function(A){for(var R=0;R<A.length;R+=1)w.writeByte(A.charCodeAt(R))},w.toByteArray=function(){return E},w.toString=function(){var A="";A+="[";for(var R=0;R<E.length;R+=1)R>0&&(A+=","),A+=E[R];return A+="]",A},w},p=function(){var E=0,w=0,A=0,R="",x={},M=function(T){R+=String.fromCharCode(S(T&63))},S=function(T){if(!(T<0)){if(T<26)return 65+T;if(T<52)return 97+(T-26);if(T<62)return 48+(T-52);if(T==62)return 43;if(T==63)return 47}throw"n:"+T};return x.writeByte=function(T){for(E=E<<8|T&255,w+=8,A+=1;w>=6;)M(E>>>w-6),w-=6},x.flush=function(){if(w>0&&(M(E<<6-w),E=0,w=0),A%3!=0)for(var T=3-A%3,D=0;D<T;D+=1)R+="="},x.toString=function(){return R},x},b=function(E){var w=E,A=0,R=0,x=0,M={};M.read=function(){for(;x<8;){if(A>=w.length){if(x==0)return-1;throw"unexpected end of file./"+x}var T=w.charAt(A);if(A+=1,T=="=")return x=0,-1;if(T.match(/^\s$/))continue;R=R<<6|S(T.charCodeAt(0)),x+=6}var D=R>>>x-8&255;return x-=8,D};var S=function(T){if(65<=T&&T<=90)return T-65;if(97<=T&&T<=122)return T-97+26;if(48<=T&&T<=57)return T-48+52;if(T==43)return 62;if(T==47)return 63;throw"c:"+T};return M},y=function(E,w){var A=E,R=w,x=new Array(E*w),M={};M.setPixel=function(U,N,z){x[N*A+U]=z},M.write=function(U){U.writeString("GIF87a"),U.writeShort(A),U.writeShort(R),U.writeByte(128),U.writeByte(0),U.writeByte(0),U.writeByte(0),U.writeByte(0),U.writeByte(0),U.writeByte(255),U.writeByte(255),U.writeByte(255),U.writeString(","),U.writeShort(0),U.writeShort(0),U.writeShort(A),U.writeShort(R),U.writeByte(0);var N=2,z=T(N);U.writeByte(N);for(var $=0;z.length-$>255;)U.writeByte(255),U.writeBytes(z,$,255),$+=255;U.writeByte(z.length-$),U.writeBytes(z,$,z.length-$),U.writeByte(0),U.writeString(";")};var S=function(U){var N=U,z=0,$=0,V={};return V.write=function(tt,rt){if(tt>>>rt)throw"length over";for(;z+rt>=8;)N.writeByte(255&(tt<<z|$)),rt-=8-z,tt>>>=8-z,$=0,z=0;$=tt<<z|$,z=z+rt},V.flush=function(){z>0&&N.writeByte($)},V},T=function(U){for(var N=1<<U,z=(1<<U)+1,$=U+1,V=D(),tt=0;tt<N;tt+=1)V.add(String.fromCharCode(tt));V.add(String.fromCharCode(N)),V.add(String.fromCharCode(z));var rt=m(),lt=S(rt);lt.write(N,$);var xt=0,Ct=String.fromCharCode(x[xt]);for(xt+=1;xt<x.length;){var Ot=String.fromCharCode(x[xt]);xt+=1,V.contains(Ct+Ot)?Ct=Ct+Ot:(lt.write(V.indexOf(Ct),$),V.size()<4095&&(V.size()==1<<$&&($+=1),V.add(Ct+Ot)),Ct=Ot)}return lt.write(V.indexOf(Ct),$),lt.write(z,$),lt.flush(),rt.toByteArray()},D=function(){var U={},N=0,z={};return z.add=function($){if(z.contains($))throw"dup key:"+$;U[$]=N,N+=1},z.size=function(){return N},z.indexOf=function($){return U[$]},z.contains=function($){return typeof U[$]<"u"},z};return M},_=function(E,w,A){for(var R=y(E,w),x=0;x<w;x+=1)for(var M=0;M<E;M+=1)R.setPixel(M,x,A(M,x));var S=m();R.write(S);for(var T=p(),D=S.toByteArray(),U=0;U<D.length;U+=1)T.writeByte(D[U]);return T.flush(),"data:image/gif;base64,"+T};return n})();(function(){e.stringToBytesFuncs["UTF-8"]=function(n){function r(s){for(var a=[],o=0;o<s.length;o++){var c=s.charCodeAt(o);c<128?a.push(c):c<2048?a.push(192|c>>6,128|c&63):c<55296||c>=57344?a.push(224|c>>12,128|c>>6&63,128|c&63):(o++,c=65536+((c&1023)<<10|s.charCodeAt(o)&1023),a.push(240|c>>18,128|c>>12&63,128|c>>6&63,128|c&63))}return a}return r(n)}})(),(function(n){i.exports=n()})(function(){return e})})(Zo)),Zo.exports}var FM=NM();const OM=UM(FM);function Ds(){return location.origin+location.pathname.replace(/index\.html$/,"")}function BM(i){const t=OM(0,"M");return t.addData(i),t.make(),t.createSvgTag({cellSize:8,margin:2,scalable:!0})}async function kM(i,t){const e=new File([i],t,{type:i.type});if(navigator.canShare?.({files:[e]}))try{return await navigator.share({files:[e],title:"costuma 2026"}),"shared"}catch(r){if(r.name==="AbortError")return"cancelled"}return xd(i,t),"saved"}function xd(i,t){const e=document.createElement("a");e.href=URL.createObjectURL(i),e.download=t,document.body.appendChild(e),e.click(),e.remove(),setTimeout(()=>URL.revokeObjectURL(e.href),3e4)}function HM(){const i=window.MediaRecorder;if(i)return["video/mp4;codecs=avc1","video/mp4","video/webm;codecs=vp9","video/webm;codecs=vp8","video/webm"].find(t=>i.isTypeSupported(t))}const Kt=i=>document.getElementById(i),zM="./",Ae=new URLSearchParams(location.search),Il=Ae.get("test")==="1",Pn=Number(Ae.get("synth")??0),ct=DM();Ae.get("c")&&(ct.costume=Ae.get("c"));Ye.some(i=>i.id===ct.costume)||(ct.costume=Ye[0].id);Ae.get("people")&&(ct.people=Number(Ae.get("people")));const mi=()=>IM(ct),Ie=Kt("video"),Gs=Kt("stage"),qr=Kt("overlay"),de=qr.getContext("2d"),$t=new xM(Gs);$t.opts.size=ct.size;$t.opts.shadows=ct.shadows;$t.opts.envLight=ct.envLight;const an=new EM($t.bgUniforms,gd),zi=new TM,_d=new AM;let vr=null,Jo=-1;(Ae.get("scene")==="party"||Ae.get("scene")==="costume")&&(ct.scene=Ae.get("scene"));Ae.get("fx")&&(ct.effect=Ae.get("fx"));Ae.get("googly")&&(ct.googly=Ae.get("googly")==="1");Ae.get("pc")&&(ct.partyCostumes=Ae.get("pc")==="behind"?"behind":Ae.get("pc")==="1"||Ae.get("pc")==="on"?"on":"off");an.preset=yi.find(i=>i.id===ct.effect)??yi[0];const Ws=new Od(Ie,Ae.get("facing")??void 0);let Vn=null;const He=new Xd;let $s=!1;const js=new Map,Ja=new Map;let Md=0;function Qa(i){const t=js.get(i);if(t)return t;if(ct.scene==="party")return Ye.some(n=>n.id===ct.partyCast)?ct.partyCast:"skeleton";if(ct.mode==="one")return ct.costume;let e=Ja.get(i);if(!e){const n=Ye.findIndex(r=>r.id===ct.costume);e=Ye[(n+Md++)%Ye.length].id,Ja.set(i,e)}return e}const zu=new Set;function ro(i,t=!1){if($t.hasTemplate(i))return;const e=!zu.has(i);zu.add(i),!t&&e&&Ce(`Dressing up as ${bi(i).name}…`,1800),(e||!t)&&$t.prepare(i,!0).catch(n=>{console.error("build failed",i,n),Ce(`${bi(i).name} failed to build`)})}let Vu=0;function Ce(i,t=1400){const e=Kt("toast");e.textContent=i,e.classList.add("on"),clearTimeout(Vu),Vu=window.setTimeout(()=>e.classList.remove("on"),t)}const VM=i=>{const t=Kt("hint");t.textContent=i,t.classList.toggle("on",!!i)},bd=i=>`${zM}thumbs/${i}.png`;function yd(){const i=Kt("picker");if(i.innerHTML="",ct.scene==="party"){for(const e of yi){const n=document.createElement("button");n.className="card fx",n.dataset.id=e.id,n.setAttribute("role","option"),n.innerHTML='<div class="thumb"></div><div class="name"></div>',n.querySelector(".thumb").style.background=e.swatch,n.querySelector(".name").textContent=e.name,n.onclick=()=>Ul(e.id),i.appendChild(n)}Xs();return}const t=(e,n,r="")=>{const s=document.createElement("button");s.className=`card ${r}`,s.dataset.id=e,s.setAttribute("role","option"),s.innerHTML='<div class="thumb"></div><div class="name"></div>',s.querySelector(".name").textContent=n;const a=s.querySelector(".thumb");if(e==="mix")a.textContent="MIX";else{const o=new Image;o.alt="",o.draggable=!1,o.onerror=()=>{o.remove(),a.textContent=n.slice(0,1)},o.src=bd(e),a.appendChild(o)}s.onclick=()=>Sd(e),i.appendChild(s)};t("mix","Mix","mix");for(const e of Ye)t(e.id,e.name);Xs()}function GM(i){let t=null,e=!1;i.addEventListener("pointerdown",r=>{t={x:r.clientX,left:i.scrollLeft,id:r.pointerId},e=!1}),i.addEventListener("dragstart",r=>r.preventDefault()),i.addEventListener("pointermove",r=>{if(!t||r.pointerId!==t.id)return;const s=r.clientX-t.x;!e&&Math.abs(s)>6&&(e=!0,i.classList.add("dragging")),e&&(i.scrollLeft=t.left-s)});const n=()=>{t=null,i.classList.remove("dragging")};i.addEventListener("pointerup",n),i.addEventListener("pointercancel",n),i.addEventListener("click",r=>{e&&(r.stopPropagation(),r.preventDefault(),e=!1)},!0),i.addEventListener("wheel",r=>{Math.abs(r.deltaY)<=Math.abs(r.deltaX)||(i.scrollLeft+=r.deltaY,r.preventDefault())},{passive:!1})}function Xs(){for(const i of Kt("picker").querySelectorAll(".card")){const t=ct.scene==="party"?i.dataset.id===ct.effect:ct.mode==="mix"?i.dataset.id==="mix":i.dataset.id===ct.costume;if(i.classList.toggle("on",t),i.setAttribute("aria-selected",String(t)),t){const e=Kt("picker");e.scrollTo({left:i.offsetLeft-(e.clientWidth-i.offsetWidth)/2,behavior:"smooth"})}}}function Sd(i){js.clear(),i==="mix"?(ct.mode="mix",Ja.clear(),Md=0,Ce("Mix: everyone gets their own")):(ct.mode="one",ct.costume=i,ro(i),$t.hasTemplate(i)&&Ce(bi(i).name,900)),mi(),Xs()}function Ul(i){const t=yi.find(e=>e.id===i)??yi[0];ct.effect=t.id,an.preset=t,mi(),Xs(),Ce(t.name,800)}function Gu(i){const t=Kt("dip");t.classList.add("on"),setTimeout(async()=>{try{await i()}finally{requestAnimationFrame(()=>requestAnimationFrame(()=>t.classList.remove("on")))}},190)}function nl(i){ct.scene=i,mi(),$t.setBackground(i==="party"?an.material:null),Vn?.setOptions({masks:i==="party"});for(const t of document.querySelectorAll(".modes button")){const e=t.dataset.scene===i;t.classList.toggle("on",e),t.setAttribute("aria-selected",String(e))}yd()}function Nl(i){Kt(i).classList.remove("hidden")}for(const i of document.querySelectorAll(".modal"))i.addEventListener("click",t=>{(t.target===i||t.target.closest("[data-close]"))&&i.classList.add("hidden")});function Wu(){const i=Ds();Kt("qr-code").innerHTML=BM(i),Kt("qr-url").textContent=i,Nl("qr")}Kt("btn-copy").onclick=async()=>{try{await navigator.clipboard.writeText(Ds()),Ce("Link copied")}catch{Ce("Could not copy — long-press the link")}};Kt("btn-share-link").onclick=async()=>{if(navigator.share)try{await navigator.share({title:"costuma 2026",text:"Be a 3D costume:",url:Ds()})}catch{}else try{await navigator.clipboard.writeText(Ds()),Ce("Link copied")}catch{Ce(Ds())}};function WM(){const i=Kt("settings-body");i.innerHTML="";const t=(s,a,o)=>{const c=document.createElement("div");c.className="set";const l=document.createElement("label"),h=document.createElement("span");if(h.textContent=s,a){const u=document.createElement("small");u.textContent=a,h.appendChild(u)}l.append(h,o),c.appendChild(l),i.appendChild(c)},e=(s,a,o)=>{const c=document.createElement("div");c.className="seg";for(const[l,h]of s){const u=document.createElement("button");u.textContent=h,u.classList.toggle("on",a()===l),u.onclick=()=>{o(l),mi();for(const d of c.children)d.classList.remove("on");u.classList.add("on")},c.appendChild(u)}return c},n=(s,a)=>{const o=document.createElement("input");return o.type="checkbox",o.className="switch",o.checked=s(),o.onchange=()=>{a(o.checked),mi()},o},r=(s,a,o,c,l)=>{const h=document.createElement("input");return h.type="range",h.min=String(s),h.max=String(a),h.step=String(o),h.value=String(c()),h.oninput=()=>{l(Number(h.value)),mi()},h};t(ct.scene==="party"?"Subjects":"People",ct.scene==="party"?"How many people to cut out (the nearest)":"How many to dress at once",e([[1,"1"],[2,"2"],[3,"3"],[4,"4"]],()=>ct.people,s=>{ct.people=s,Vn?.setOptions({numPoses:s}),vr?.setFaces(s)})),t("Costume size","Bigger hides more of the person",r(.8,1.5,.01,()=>ct.size,s=>{ct.size=s,$t.opts.size=s})),t("Pose model","Accurate is steadier, slower to load and run",e([["lite","Fast"],["full","Accurate"]],()=>ct.model,s=>{ct.model=s,KM()})),t("Light from the camera","The costume is lit by the room it stands in",n(()=>ct.envLight,s=>{ct.envLight=s,$t.opts.envLight=s})),t("Shadows","Off is faster on older phones",n(()=>ct.shadows,s=>{ct.shadows=s,$t.opts.shadows=s})),t("Lens","If costumes look too flat or too deep",r(.55,1.3,.01,()=>ct.lens,s=>{ct.lens=s})),t("React to the music","Listens through the microphone for the beat; clips record the sound",n(()=>ct.music,s=>{ct.music=s,s?zi.start().then(()=>Ce("Listening for the beat",1200)).catch(()=>{ct.music=!1,mi(),Ce("No microphone")}):zi.stop()}));{const s=document.createElement("select");s.className="pick";for(const a of Ye){const o=document.createElement("option");o.value=a.id,o.textContent=a.name,s.appendChild(o)}s.value=ct.partyCast,s.onchange=()=>{ct.partyCast=s.value,js.clear(),mi(),ro(s.value)},t("Party dancers","Who dances behind (or as) you in party mode",s)}t("Costumes in party mode","Behind you: you stay yourself, a pyramid of your costume dances behind you",e([["off","Off"],["behind","Behind"],["on","On you"]],()=>ct.partyCostumes,s=>{ct.partyCostumes=s})),t("Face tracking","Mouths open costumes and breathe sparks; googly eyes find your eyes",n(()=>ct.faces,s=>{ct.faces=s,s&&Bl()})),t("Mouth magic","Open your mouth: sparks",n(()=>ct.breath,s=>{ct.breath=s})),t("Show the skeleton","What the pose tracker sees",n(()=>ct.debug,s=>{ct.debug=s}))}let il=!1,dr=null;function wd(i,t){dr={blob:i,name:t};const e=Kt("preview-media");e.innerHTML="";const n=URL.createObjectURL(i);if(i.type.startsWith("video")){const r=document.createElement("video");r.src=n,r.controls=!0,r.playsInline=!0,r.loop=!0,r.muted=!0,r.play().catch(()=>{}),e.appendChild(r)}else{const r=new Image;r.src=n,e.appendChild(r)}Nl("preview")}Kt("btn-share").onclick=async()=>{dr&&await kM(dr.blob,dr.name)==="saved"&&Ce("Saved")};Kt("btn-save").onclick=()=>{dr&&(xd(dr.blob,dr.name),Ce("Saved"))};const Ed=()=>new Date().toISOString().slice(0,19).replace(/[:T]/g,"-");let Na=null,Xu=0;function XM(){const i=Kt("btn-rec");if(Na){Na.stop();return}const t=HM(),e=Gs.captureStream;if(!t||!e){Ce("Recording is not supported in this browser");return}const n=[],r=e.call(Gs,30);for(const a of zi.stream?.getAudioTracks()??[])r.addTrack(a);const s=new MediaRecorder(r,{mimeType:t,videoBitsPerSecond:8e6});s.ondataavailable=a=>{a.data.size&&n.push(a.data)},s.onstop=()=>{clearTimeout(Xu),Na=null,i.classList.remove("on"),i.innerHTML=Ni.rec;const a=t.split(";")[0];wd(new Blob(n,{type:a}),`costuma-${Ed()}.${a.includes("mp4")?"mp4":"webm"}`)},s.start(250),Na=s,i.classList.add("on"),i.innerHTML=Ni.stop,Xu=window.setTimeout(()=>s.state==="recording"&&s.stop(),2e4),Ce("Recording — tap to stop",1200)}function Td(i){const t=$t.cover,e=i.image,n=(e[B.shL].x+e[B.shR].x+e[B.hipL].x+e[B.hipR].x)/4,r=(e[B.shL].y+e[B.shR].y+e[B.hipL].y+e[B.hipR].y)/4;let s=(n*t.vw-t.ox)*t.s;const a=(r*t.vh-t.oy)*t.s;return t.mirror&&(s=t.cw-s),{x:s,y:a}}Gs.addEventListener("click",i=>{if(!$s)return;if(ct.scene==="party"&&ct.partyCostumes==="off"){const a=yi.findIndex(o=>o.id===ct.effect);Ul(yi[(a+1)%yi.length].id);return}let t=null,e=1/0;for(const a of He.tracks){if(a.lost)continue;const o=Td(a),c=Math.hypot(o.x-i.clientX,o.y-i.clientY);c<e&&(e=c,t=a)}if(!t||e>Math.max(innerWidth,innerHeight)*.3)return;const n=Qa(t.id),r=Ye.findIndex(a=>a.id===n),s=Ye[(r+1)%Ye.length].id;js.set(t.id,s),ro(s),Ce(bi(s).name,900)});let rl=0,qu=-1,sl=0,al=performance.now(),Qo=performance.now();const Yr=document.createElement("canvas"),qM=Yr.getContext("2d");function YM(){if(ct.scene!=="party")return Ie;const i=Ie.videoWidth||720,t=Ie.videoHeight||1280,e=480/Math.max(i,t),n=Math.round(i*e),r=Math.round(t*e);return(Yr.width!==n||Yr.height!==r)&&(Yr.width=n,Yr.height=r),qM.drawImage(Ie,0,0,n,r),Yr}let Fl=0,tc=performance.now(),ec=0;function Ol(){return Vd(Ie.videoWidth||720,Ie.videoHeight||1280,ct.lens)}function Ad(i){if(requestAnimationFrame(Ad),!$s)return;rl++;const t=Ol();$t.layout(t,Ws.mirrored&&!Pn);let e=null;if(Pn){if(e=Fx(Pn,(i-al)/1e3*(Il?0:1)+Number(Ae.get("t")??0),t),ct.scene==="party"){const h=t.w/t.h,u=h>=1?240:Math.round(240*h),d=h>=1?Math.round(240/h):240;for(const f of e)f.mask=Ox(f,u,d,h)}}else if(Vn&&Ie.readyState>=2&&Ie.currentTime!==qu){qu=Ie.currentTime;try{e=Vn.detect(YM(),i)}catch(h){console.error(h)}}if(e&&He.update(e.slice(0,ct.people),i,t),e){let h=null;if(vr&&ct.faces&&!Pn)try{h=vr.detect(Ie,i)}catch(u){console.error(u)}if(PM(He.tracks,h,t.w/t.h,i,Jo<0?1/30:Math.min(.25,(i-Jo)/1e3)),Jo=i,Pn&&Ae.get("jaw"))for(const u of He.tracks)u.face&&(u.face.jaw=Number(Ae.get("jaw")))}$t.ground.update(He.tracks,Pn?null:_d.upInCamera(Ws.facing),Math.min(.25,(i-Qo)/1e3));const n=ct.scene==="costume"||ct.partyCostumes!=="off";if(n)for(const h of He.tracks)ro(Qa(h.id),!0);const r=(i-al)/1e3,s=Math.min(.25,(i-Qo)/1e3);Qo=i;const a=n,o=ct.scene==="party",c=o&&ct.partyCostumes==="behind";$t.pyramid=c||o&&ct.partyCostumes==="on"&&an.preset.id==="pyramid",$t.hideWearers=c,$t.setForeground(c?an.foreground:null),an.clones=!$t.pyramid,$t.stageLights(ct.scene==="party"&&an.preset.id!=="insitu",r,zi.env);{const h=He.tracks.filter(f=>!f.lost).sort((f,g)=>g.T.z-f.T.z)[0],u=ct.scene==="party"&&an.preset.id==="insitu",d=$t.stageSpots(u,r,zi.env,t,h?new I(h.T.x,h.T.y,h.T.z):null);an.setSpots(d,u?1:0),$t.light.realism=u}$t.setGrain(!0,r),$t.sync(a?He.tracks:[],Qa,r),$t.googlyOn=ct.googly&&ct.faces,$t.breathOn=ct.breath&&ct.faces,$t.faces(He.tracks,t,s),zi.update(s,i),ct.scene==="party"&&(an.subjects=ct.people,an.beat=zi.env,an.update(He.tracks,s,r,t.w/t.h,$t.ground,t),an.render($t.renderer,t.w,t.h)),$t.render(Ie,t,rl),il&&(il=!1,Gs.toBlob(h=>h&&wd(h,`costuma-${Ed()}.jpg`),"image/jpeg",.92)),He.tracks.filter(h=>!h.lost).length&&(sl=i),VM(i-sl>2500?"Step back until your head and hips are in view":""),jM(),ec++,i-tc>1e3&&(Fl=ec*1e3/(i-tc),ec=0,tc=i,Rd(),$M())}let Fa=0,Yu=!1;function $M(){if(!(Il||!$s||He.tracks.length===0)&&(Fa=Fl<22?Fa+1:0,!(Fa<3))){if(Fa=0,$t.opts.pixelRatio>1.01)$t.opts.pixelRatio=Math.max(1,$t.opts.pixelRatio-.25);else if($t.opts.shadows)$t.opts.shadows=!1;else return;Yu||(Yu=!0,Ce("Lowering quality to keep up",1500))}}function jM(){const i=qr.clientWidth,t=qr.clientHeight,e=Math.min(devicePixelRatio||1,2);if(qr.width!==Math.round(i*e)&&(qr.width=Math.round(i*e),qr.height=Math.round(t*e)),de.setTransform(e,0,0,e,0,0),de.clearRect(0,0,i,t),!ct.debug)return;const n=$t.cover,r=s=>{let a=(s.x*n.vw-n.ox)*n.s;return n.mirror&&(a=n.cw-a),[a,(s.y*n.vh-n.oy)*n.s]};{const s=$t.ground,a=Ol(),{back:o,side:c}=s.axes(),l=He.tracks.filter(f=>!f.lost).sort((f,g)=>g.T.z-f.T.z)[0],h=s.foot(l?new I(l.T.x,l.T.y,l.T.z):new I(0,0,-3)).addScaledVector(o,-1),u=(f,g)=>h.clone().addScaledVector(c,f).addScaledVector(o,g),d=(f,g)=>{if(f.z>-.2||g.z>-.2)return;const[v,m]=r(is(f,a)),[p,b]=r(is(g,a));de.beginPath(),de.moveTo(v,m),de.lineTo(p,b),de.stroke()};de.strokeStyle="rgba(125, 252, 255, 0.45)",de.lineWidth=1.5;for(let f=-3;f<=3.001;f+=.5)d(u(f,0),u(f,8));for(let f=0;f<=8.001;f+=.5)d(u(-3,f),u(3,f));de.fillStyle="#7dfcff",de.font="600 12px system-ui",de.fillText(`floor: ${s.source}${s.fromFeet?" + feet":""} · camera ${s.cameraHeight.toFixed(2)} m up`,12,n.ch-200)}for(const s of He.tracks){de.globalAlpha=s.presence,de.strokeStyle="#7dfcff",de.lineWidth=3;for(const[o,c]of zd){const l=s.image[o],h=s.image[c];if(Math.min(l.v,h.v)<.4)continue;const[u,d]=r(l),[f,g]=r(h);de.beginPath(),de.moveTo(u,d),de.lineTo(f,g),de.stroke()}de.fillStyle="#ff8a1f";for(const o of s.image){if(o.v<.4)continue;const[c,l]=r(o);de.beginPath(),de.arc(c,l,4,0,Math.PI*2),de.fill()}const a=Td(s);de.fillStyle="#fff",de.font="600 14px system-ui",de.fillText(`#${s.id} ${bi(Qa(s.id)).name} · ${(-s.T.z).toFixed(1)} m`,a.x-40,a.y)}de.globalAlpha=1}function Rd(){const i=Kt("readout");if(!i||Kt("settings").classList.contains("hidden"))return;const t=Ol();i.textContent=["build 9231413 · 2026-10-31 20:54Z",`${Fl.toFixed(0)} fps · pose ${Vn?.inferMs.toFixed(1)??"–"} ms (${Vn?.delegate??"–"}, ${ct.model}) · face ${vr?vr.inferMs.toFixed(1)+" ms":ct.faces?"loading":"off"}`,`video ${Ie.videoWidth}×${Ie.videoHeight} · f ${t.f.toFixed(0)} px · ${Ws.facing}`,`people ${He.tracks.filter(e=>!e.lost).length} · dressed ${$t.count}`,`pixels ×${$t.opts.pixelRatio.toFixed(2)} · shadows ${$t.opts.shadows?"on":"off"}`,`light mean ${$t.light.mean.toFixed(3)} × ${$t.light.gain.toFixed(2)} · key share ${$t.light.share.toFixed(2)} · every ${_n.every} frames`].join(`
`)}async function KM(){if(Pn)return;const i=Vn,t=new ju(ct.model,ct.people);t.masks=ct.scene==="party",await t.load(e=>Ce(e,2500)),Vn=t,i?.close(),Ce(ct.model==="full"?"Accurate pose model":"Fast pose model",1e3)}async function Bl(){if(vr||Pn||!ct.faces)return;const i=new RM;try{await i.load(ct.people),vr=i}catch(t){console.warn("face model failed",t)}}function ZM(){const i=document.createElement("canvas");i.width=720,i.height=1280;const t=i.getContext("2d"),e=()=>{const n=t.createLinearGradient(0,0,0,1280);n.addColorStop(0,"#5a4a63"),n.addColorStop(.62,"#3b3142"),n.addColorStop(.63,"#6b5440"),n.addColorStop(1,"#3a2c22"),t.fillStyle=n,t.fillRect(0,0,720,1280),t.fillStyle="#fff3d6",t.fillRect(40,220,170,330),t.fillStyle="#ffb35a",t.beginPath(),t.arc(600,180,46,0,Math.PI*2),t.fill()};return e(),setInterval(e,500),i.captureStream(30)}async function nc(){const i=Kt("start-status"),t=Kt("btn-start");t.disabled=!0;const e=Pn?Promise.resolve(!1):_d.enable();try{if(Pn)Ie.srcObject=ZM(),await Ie.play().catch(()=>{}),Ie.readyState<2&&await new Promise(r=>Ie.addEventListener("loadeddata",r,{once:!0}));else{if(!navigator.mediaDevices?.getUserMedia)throw new Error(location.protocol!=="https:"?"The camera needs an https:// page.":"This browser has no camera access.");i.textContent="Asking for the camera…",await Ws.open(),i.textContent="Loading the pose model…",Vn=new ju(ct.model,ct.people),Vn.masks=ct.scene==="party",await Vn.load(r=>{i.textContent=r[0].toUpperCase()+r.slice(1)+"…"})}$t.setVideo(Ie),i.textContent=`Dressing up as ${bi(ct.costume).name}…`,await new Promise(r=>setTimeout(r,30));const n=ct.mode==="one"?ct.costume:Ye[0].id;await $t.prepare(n,!0);for(const r of Ye)$t.prepare(r.id);Bl(),Kt("start").classList.add("hidden"),Kt("hud").classList.remove("hidden"),nl(ct.scene),$s=!0,al=performance.now(),sl=performance.now(),Xs()}catch(n){console.error(n);const r=n;i.textContent=r.name==="NotAllowedError"?"Camera permission was refused. Allow it in the browser settings and try again.":`Could not start: ${r.message}`,t.disabled=!1}}function JM(){Kt("btn-googly").innerHTML=Ni.googly;const i=()=>Kt("btn-googly").setAttribute("aria-pressed",String(ct.googly));i(),Kt("btn-googly").onclick=()=>{ct.googly=!ct.googly,ct.googly&&!ct.faces&&(ct.faces=!0,Bl()),mi(),i(),Ce(ct.googly?"Googly eyes":"No googly eyes",800)},Kt("btn-qr").innerHTML=Ni.qr,Kt("btn-flip").innerHTML=Ni.flip,Kt("btn-gear").innerHTML=Ni.gear,Kt("btn-snap").innerHTML=Ni.camera,Kt("btn-rec").innerHTML=Ni.rec,Kt("btn-start").onclick=()=>void nc(),Kt("btn-start-qr").onclick=Wu,Kt("btn-qr").onclick=Wu,Kt("btn-gear").onclick=()=>{WM(),Nl("settings"),Rd()},Kt("btn-flip").onclick=async()=>{Pn||Gu(async()=>{try{await Ws.flip(),$t.setVideo(Ie),He.clear(),js.clear(),Ja.clear()}catch(n){Ce(`Camera: ${n.message}`)}})},Kt("btn-snap").onclick=()=>{il=!0;const n=Kt("stage");n.style.filter="brightness(1.8)",setTimeout(()=>n.style.filter="",120)},Kt("btn-rec").onclick=XM;for(const n of document.querySelectorAll(".modes button"))n.onclick=()=>{n.dataset.scene!==ct.scene&&Gu(()=>nl(n.dataset.scene))};const t=Kt("start-cast");for(const n of Ye.slice(0,6)){const r=new Image;r.src=bd(n.id),r.alt=n.name,r.onerror=()=>r.remove(),t.appendChild(r)}yd(),GM(Kt("picker")),requestAnimationFrame(Ad);const e=window;e.__costuma={stage:$t,tracker:He,settings:ct,start:nc,choose:Sd,party:an,beat:zi,setScene:nl,chooseEffect:Ul,get started(){return $s},get frame(){return rl},LIGHT_TUNE:_n},Il&&Pn&&nc()}JM();
