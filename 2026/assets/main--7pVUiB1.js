(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))i(s);new MutationObserver(s=>{for(const r of s)if(r.type==="childList")for(const a of r.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&i(a)}).observe(document,{childList:!0,subtree:!0});function e(s){const r={};return s.integrity&&(r.integrity=s.integrity),s.referrerPolicy&&(r.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?r.credentials="include":s.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function i(s){if(s.ep)return;s.ep=!0;const r=e(s);fetch(s.href,r)}})();const Cg=()=>/iPad|iPhone|iPod/.test(navigator.userAgent)||navigator.platform==="MacIntel"&&navigator.maxTouchPoints>1,Lg=()=>Cg()||/Android|Mobile/i.test(navigator.userAgent);let Pg=class{constructor(t,e){this.video=t,this.facing=e??(Lg()?"environment":"user"),t.muted=!0,t.playsInline=!0,t.autoplay=!0,t.setAttribute("playsinline",""),t.setAttribute("muted","")}stream=null;facing;async open(t=this.facing){const e=!!this.stream;this.stop(),e&&await new Promise(s=>setTimeout(s,100));const i={facingMode:t,width:{ideal:1280},height:{ideal:720},frameRate:{ideal:30}};this.stream=await navigator.mediaDevices.getUserMedia({audio:!1,video:i}),this.facing=t,this.video.srcObject=this.stream,await this.video.play().catch(()=>{}),this.video.readyState<2&&await new Promise(s=>this.video.addEventListener("loadeddata",()=>s(),{once:!0}))}async flip(){await this.open(this.facing==="user"?"environment":"user")}get mirrored(){return this.facing==="user"}stop(){if(this.stream){for(const t of this.stream.getTracks())t.stop();this.video.srcObject=null,this.stream=null}}};const Ig="modulepreload",Dg=function(n,t){return new URL(n,t).href},lf={},q1=function(t,e,i){let s=Promise.resolve();if(e&&e.length>0){let a=function(h){return Promise.all(h.map(u=>Promise.resolve(u).then(d=>({status:"fulfilled",value:d}),d=>({status:"rejected",reason:d}))))};const o=document.getElementsByTagName("link"),c=document.querySelector("meta[property=csp-nonce]"),l=c?.nonce||c?.getAttribute("nonce");s=a(e.map(h=>{if(h=Dg(h,i),h in lf)return;lf[h]=!0;const u=h.endsWith(".css"),d=u?'[rel="stylesheet"]':"";if(!!i)for(let v=o.length-1;v>=0;v--){const g=o[v];if(g.href===h&&(!u||g.rel==="stylesheet"))return}else if(document.querySelector(`link[href="${h}"]${d}`))return;const p=document.createElement("link");if(p.rel=u?"stylesheet":Ig,u||(p.as="script"),p.crossOrigin="",p.href=h,l&&p.setAttribute("nonce",l),document.head.appendChild(p),u)return new Promise((v,g)=>{p.addEventListener("load",v),p.addEventListener("error",()=>g(new Error(`Unable to preload CSS for ${h}`)))})}))}function r(a){const o=new Event("vite:preloadError",{cancelable:!0});if(o.payload=a,window.dispatchEvent(o),!o.defaultPrevented)throw a}return s.then(a=>{for(const o of a||[])o.status==="rejected"&&r(o.reason);return t().catch(r)})},O={nose:0,eyeInL:1,eyeL:2,eyeOutL:3,eyeInR:4,eyeR:5,eyeOutR:6,earL:7,earR:8,mouthL:9,mouthR:10,shL:11,shR:12,elL:13,elR:14,wrL:15,wrR:16,pinkyL:17,pinkyR:18,indexL:19,indexR:20,thumbL:21,thumbR:22,hipL:23,hipR:24,knL:25,knR:26,anL:27,anR:28,heelL:29,heelR:30,toeL:31,toeR:32},Hh=33;function Ug(n){return{x:n.x,y:-n.y,z:-n.z,v:n.visibility??1}}const Ng=[[O.shL,O.shR],[O.shL,O.elL],[O.elL,O.wrL],[O.shR,O.elR],[O.elR,O.wrR],[O.shL,O.hipL],[O.shR,O.hipR],[O.hipL,O.hipR],[O.hipL,O.knL],[O.knL,O.anL],[O.hipR,O.knR],[O.knR,O.anR],[O.anL,O.toeL],[O.anR,O.toeR],[O.earL,O.eyeL],[O.eyeL,O.nose],[O.nose,O.eyeR],[O.eyeR,O.earR]];class $1{constructor(t,e){this.model=t,this.numPoses=e}lm=null;lastTs=-1;delegate="GPU";inferMs=0;masks=!1;async load(t){t?.("loading the pose engine");const i=await q1(()=>import("./vision_bundle-Bk4VIwNi.js"),[],import.meta.url),s=await i.FilesetResolver.forVisionTasks("./mediapipe"),r=a=>i.PoseLandmarker.createFromOptions(s,{baseOptions:{modelAssetPath:`./models/pose_landmarker_${this.model}.task`,delegate:a},runningMode:"VIDEO",numPoses:this.numPoses,minPoseDetectionConfidence:.5,minPosePresenceConfidence:.5,minTrackingConfidence:.5,outputSegmentationMasks:this.masks});t?.(`loading the ${this.model} pose model`);try{this.lm=await r("GPU"),this.delegate="GPU"}catch(a){console.warn("GPU delegate failed, using CPU",a),this.lm=await r("CPU"),this.delegate="CPU"}}async setOptions(t){t.numPoses&&(this.numPoses=t.numPoses,await this.lm?.setOptions({numPoses:t.numPoses})),t.masks!==void 0&&t.masks!==this.masks&&(this.masks=t.masks,await this.lm?.setOptions({outputSegmentationMasks:t.masks}))}detect(t,e){if(!this.lm)return[];e<=this.lastTs&&(e=this.lastTs+1),this.lastTs=e;const i=performance.now(),s=this.lm.detectForVideo(t,e);this.inferMs=performance.now()-i;const r=[];for(let a=0;a<s.landmarks.length;a++){const o=s.landmarks[a],c=s.worldLandmarks[a];if(!c)continue;const l=s.segmentationMasks?.[a];r.push({image:o.map(h=>({x:h.x,y:h.y,z:h.z,v:h.visibility??1})),world:c.map(Ug),mask:l?{data:l.getAsFloat32Array().slice(),w:l.width,h:l.height}:void 0})}return s.close(),r}close(){this.lm?.close(),this.lm=null}}function Fg(n,t,e=.85){return{f:e*Math.max(n,t),cx:n/2,cy:t/2,w:n,h:t}}function hf(n,t,e,i=.5){let s=0,r=0,a=0,o=0,c=0,l=0,h=0,u=0,d=0;for(let _=0;_<n.length&&_<t.length;_++){const x=n[_],b=t[_],w=Math.min(x.v,b.v);if(w<i)continue;const E=(b.x*e.w-e.cx)/e.f,A=(e.cy-b.y*e.h)/e.f,T=-E*x.z-x.x,M=-A*x.z-x.y;s+=w,r+=w*E,c+=w*E*E,l+=w*T,u+=w*E*T,a+=w,o+=w*A,c+=w*A*A,h+=w*M,u+=w*A*M,d++}if(d<4)return null;const f=c-r*r/s-o*o/a,p=u-r*l/s-o*h/a;if(Math.abs(f)<1e-9)return null;const v=p/f,g=(l-r*v)/s,m=(h-o*v)/a;return!(v<-.2)||!isFinite(g)||!isFinite(m)?null:{x:g,y:m,z:v}}function Sa(n,t){const e=-n.z;return{x:(t.cx+t.f*n.x/e)/t.w,y:(t.cy-t.f*n.y/e)/t.h}}const Xo=(n,t)=>({x:(n.x+t.x)/2,y:(n.y+t.y)/2,z:(n.z+t.z)/2,v:Math.min(n.v,t.v)}),wi=(n,t)=>Math.hypot(n.x-t.x,n.y-t.y,n.z-t.z);function uf(n){const t=wi(Xo(n[O.shL],n[O.shR]),Xo(n[O.hipL],n[O.hipR])),e=(wi(n[O.shL],n[O.elL])+wi(n[O.shR],n[O.elR]))/2,i=(wi(n[O.elL],n[O.wrL])+wi(n[O.elR],n[O.wrR]))/2,s=(wi(n[O.hipL],n[O.knL])+wi(n[O.hipR],n[O.knR]))/2,r=(wi(n[O.knL],n[O.anL])+wi(n[O.knR],n[O.anR]))/2,a=wi(Xo(n[O.shL],n[O.shR]),Xo(n[O.earL],n[O.earR]));return{torso:t,upperArm:e,forearm:i,thigh:s,shin:r,neck:a}}const Si={tauWorld:.045,tauImage:.035,tauZ:.14,tauLen:1.5,tauVis:.25,tauCore:.09,fadeIn:.22,fadeOut:.35,forgetAfter:.6,matchRadius:1.3},ff=n=>{const t=[O.shL,O.shR,O.hipL,O.hipR];let e=0,i=0,s=0;for(const c of t){const l=n[c];e+=l.x,i+=l.y,s++}e/=s,i/=s;const r=(n[O.shL].x+n[O.shR].x)/2-(n[O.hipL].x+n[O.hipR].x)/2,a=(n[O.shL].y+n[O.shR].y)/2-(n[O.hipL].y+n[O.hipR].y)/2,o=Math.hypot(n[O.shL].x-n[O.shR].x,n[O.shL].y-n[O.shR].y);return{x:e,y:i,s:Math.max(Math.hypot(r,a),o,.04)}},oa=(n,t,e)=>n+(t-n)*e,Er=(n,t)=>1-Math.exp(-n/Math.max(t,1e-4)),Og=new Set([0,1,2,3,4,5,6,7,8,9,10,O.shL,O.shR,O.hipL,O.hipR]);function df(n,t,e,i,s=e){for(let r=0;r<Hh;r++){const a=n[r],o=t[r],c=Og.has(r)?s:e;a.x=oa(a.x,o.x,c),a.y=oa(a.y,o.y,c),a.z=oa(a.z,o.z,c),a.v=oa(a.v,o.v,i)}}const pf=n=>n.map(t=>({...t})),kg=[O.nose,O.eyeL,O.eyeR,O.earL,O.earR,O.shL,O.shR,O.hipL,O.hipR];function Bg(n,t){let e=0,i=0,s=0;for(const r of kg){const a=n[r],o=t[r],c=Math.min(a.v,o.v);c<.5||(e+=(o.x-a.x)*c,i+=(o.y-a.y)*c,s+=c)}if(!(s<1.5)){e/=s,i/=s;for(const r of n)r.x+=e,r.y+=i}}class Hg{tracks=[];nextId=1;last=-1;update(t,e,i){const s=this.last<0?.03333333333333333:Math.min(.25,Math.max(.001,(e-this.last)/1e3));this.last=e;const r=t.map(h=>({d:h,T:hf(h.world,h.image,i),c:ff(h.image)})).filter(h=>h.T),a=this.tracks.filter(h=>!h.lost||h.presence>0),o=[];a.forEach((h,u)=>{const d=ff(h.image);r.forEach((f,p)=>{const v=Math.hypot(d.x-f.c.x,d.y-f.c.y)/d.s;v<Si.matchRadius&&o.push({ti:u,di:p,cost:v})})}),o.sort((h,u)=>h.cost-u.cost);const c=new Set,l=new Set;for(const h of o){if(c.has(h.ti)||l.has(h.di))continue;c.add(h.ti),l.add(h.di);const u=a[h.ti],d=r[h.di],f=u.lost,p=f?1:Er(s,Si.tauVis);df(u.world,d.d.world,f?1:Er(s,Si.tauWorld),p,f?1:Er(s,Si.tauCore)),f||Bg(u.image,d.d.image),df(u.image,d.d.image,f?1:Er(s,Si.tauImage),p);const v=hf(u.world,u.image,i)??d.T;if(f)u.T={...v};else{const _=oa(u.T.z,v.z,Er(s,Si.tauZ)),x=_/v.z;u.T={x:v.x*x,y:v.y*x,z:_}}const g=uf(u.world),m=Er(s,Si.tauLen);for(const _ of Object.keys(g))u.len[_]=oa(u.len[_],g[_],m);u.seen=e,u.lost=!1,u.det=d.d}r.forEach((h,u)=>{if(l.has(u))return;const d=pf(h.d.world);this.tracks.push({id:this.nextId++,born:e,seen:e,image:pf(h.d.image),world:d,T:{...h.T},len:uf(d),presence:0,lost:!1,det:h.d})});for(const h of this.tracks)h.seen!==e&&(h.lost=!0,h.det=null),h.presence=h.lost?Math.max(0,h.presence-s/Si.fadeOut):Math.min(1,h.presence+s/Si.fadeIn);return this.tracks=this.tracks.filter(h=>!(h.lost&&h.presence<=0&&e-h.seen>Si.forgetAfter*1e3)),this.tracks}clear(){this.tracks=[],this.last=-1}}/**
 * @license
 * Copyright 2010-2025 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const s0="180",Vg=0,mf=1,zg=2,Y1=1,j1=2,Qi=3,Os=0,Tn=1,ye=2,Us=0,ga=1,Ea=2,gf=3,vf=4,Z1=5,tr=100,Gg=101,Wg=102,Xg=103,qg=104,K1=200,$g=201,J1=202,Yg=203,Vh=204,zh=205,jg=206,Zg=207,Kg=208,Jg=209,Qg=210,t2=211,e2=212,n2=213,i2=214,Gh=0,Wh=1,Xh=2,Ta=3,qh=4,$h=5,Yh=6,jh=7,Q1=0,s2=1,r2=2,Ns=0,a2=1,o2=2,c2=3,l2=4,h2=5,u2=6,tp=7,xf="attached",f2="detached",ep=300,Aa=301,Ra=302,Yc=303,Zh=304,Ml=306,Ca=1e3,nr=1001,Kh=1002,Vn=1003,d2=1004,qo=1005,Re=1006,Il=1007,Cs=1008,Mi=1009,np=1010,ip=1011,vo=1012,r0=1013,mr=1014,Bi=1015,_r=1016,a0=1017,o0=1018,xo=1020,sp=35902,rp=35899,ap=1021,op=1022,Je=1023,_o=1026,Mo=1027,cp=1028,c0=1029,lp=1030,l0=1031,h0=1033,Uc=33776,Nc=33777,Fc=33778,Oc=33779,Jh=35840,Qh=35841,tu=35842,eu=35843,nu=36196,iu=37492,su=37496,ru=37808,au=37809,ou=37810,cu=37811,lu=37812,hu=37813,uu=37814,fu=37815,du=37816,pu=37817,mu=37818,gu=37819,vu=37820,xu=37821,_u=36492,Mu=36494,bu=36495,yu=36283,wu=36284,Su=36285,Eu=36286,p2=3200,m2=3201,hp=0,g2=1,Ni="",rn="srgb",gr="srgb-linear",jc="linear",xe="srgb",Tr=7680,_f=519,v2=512,x2=513,_2=514,up=515,M2=516,b2=517,y2=518,w2=519,Tu=35044,$o=35048,Mf="300 es",Hi=2e3,Zc=2001;class Na{addEventListener(t,e){this._listeners===void 0&&(this._listeners={});const i=this._listeners;i[t]===void 0&&(i[t]=[]),i[t].indexOf(e)===-1&&i[t].push(e)}hasEventListener(t,e){const i=this._listeners;return i===void 0?!1:i[t]!==void 0&&i[t].indexOf(e)!==-1}removeEventListener(t,e){const i=this._listeners;if(i===void 0)return;const s=i[t];if(s!==void 0){const r=s.indexOf(e);r!==-1&&s.splice(r,1)}}dispatchEvent(t){const e=this._listeners;if(e===void 0)return;const i=e[t.type];if(i!==void 0){t.target=this;const s=i.slice(0);for(let r=0,a=s.length;r<a;r++)s[r].call(this,t);t.target=null}}}const tn=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];let bf=1234567;const lo=Math.PI/180,La=180/Math.PI;function mi(){const n=Math.random()*4294967295|0,t=Math.random()*4294967295|0,e=Math.random()*4294967295|0,i=Math.random()*4294967295|0;return(tn[n&255]+tn[n>>8&255]+tn[n>>16&255]+tn[n>>24&255]+"-"+tn[t&255]+tn[t>>8&255]+"-"+tn[t>>16&15|64]+tn[t>>24&255]+"-"+tn[e&63|128]+tn[e>>8&255]+"-"+tn[e>>16&255]+tn[e>>24&255]+tn[i&255]+tn[i>>8&255]+tn[i>>16&255]+tn[i>>24&255]).toLowerCase()}function Qt(n,t,e){return Math.max(t,Math.min(e,n))}function u0(n,t){return(n%t+t)%t}function S2(n,t,e,i,s){return i+(n-t)*(s-i)/(e-t)}function E2(n,t,e){return n!==t?(e-n)/(t-n):0}function ho(n,t,e){return(1-e)*n+e*t}function T2(n,t,e,i){return ho(n,t,1-Math.exp(-e*i))}function A2(n,t=1){return t-Math.abs(u0(n,t*2)-t)}function R2(n,t,e){return n<=t?0:n>=e?1:(n=(n-t)/(e-t),n*n*(3-2*n))}function C2(n,t,e){return n<=t?0:n>=e?1:(n=(n-t)/(e-t),n*n*n*(n*(n*6-15)+10))}function L2(n,t){return n+Math.floor(Math.random()*(t-n+1))}function P2(n,t){return n+Math.random()*(t-n)}function I2(n){return n*(.5-Math.random())}function D2(n){n!==void 0&&(bf=n);let t=bf+=1831565813;return t=Math.imul(t^t>>>15,t|1),t^=t+Math.imul(t^t>>>7,t|61),((t^t>>>14)>>>0)/4294967296}function U2(n){return n*lo}function N2(n){return n*La}function F2(n){return(n&n-1)===0&&n!==0}function O2(n){return Math.pow(2,Math.ceil(Math.log(n)/Math.LN2))}function k2(n){return Math.pow(2,Math.floor(Math.log(n)/Math.LN2))}function B2(n,t,e,i,s){const r=Math.cos,a=Math.sin,o=r(e/2),c=a(e/2),l=r((t+i)/2),h=a((t+i)/2),u=r((t-i)/2),d=a((t-i)/2),f=r((i-t)/2),p=a((i-t)/2);switch(s){case"XYX":n.set(o*h,c*u,c*d,o*l);break;case"YZY":n.set(c*d,o*h,c*u,o*l);break;case"ZXZ":n.set(c*u,c*d,o*h,o*l);break;case"XZX":n.set(o*h,c*p,c*f,o*l);break;case"YXY":n.set(c*f,o*h,c*p,o*l);break;case"ZYZ":n.set(c*p,c*f,o*h,o*l);break;default:console.warn("THREE.MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+s)}}function ui(n,t){switch(t.constructor){case Float32Array:return n;case Uint32Array:return n/4294967295;case Uint16Array:return n/65535;case Uint8Array:return n/255;case Int32Array:return Math.max(n/2147483647,-1);case Int16Array:return Math.max(n/32767,-1);case Int8Array:return Math.max(n/127,-1);default:throw new Error("Invalid component type.")}}function ge(n,t){switch(t.constructor){case Float32Array:return n;case Uint32Array:return Math.round(n*4294967295);case Uint16Array:return Math.round(n*65535);case Uint8Array:return Math.round(n*255);case Int32Array:return Math.round(n*2147483647);case Int16Array:return Math.round(n*32767);case Int8Array:return Math.round(n*127);default:throw new Error("Invalid component type.")}}const cr={DEG2RAD:lo,RAD2DEG:La,generateUUID:mi,clamp:Qt,euclideanModulo:u0,mapLinear:S2,inverseLerp:E2,lerp:ho,damp:T2,pingpong:A2,smoothstep:R2,smootherstep:C2,randInt:L2,randFloat:P2,randFloatSpread:I2,seededRandom:D2,degToRad:U2,radToDeg:N2,isPowerOfTwo:F2,ceilPowerOfTwo:O2,floorPowerOfTwo:k2,setQuaternionFromProperEuler:B2,normalize:ge,denormalize:ui};class ht{constructor(t=0,e=0){ht.prototype.isVector2=!0,this.x=t,this.y=e}get width(){return this.x}set width(t){this.x=t}get height(){return this.y}set height(t){this.y=t}set(t,e){return this.x=t,this.y=e,this}setScalar(t){return this.x=t,this.y=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y)}copy(t){return this.x=t.x,this.y=t.y,this}add(t){return this.x+=t.x,this.y+=t.y,this}addScalar(t){return this.x+=t,this.y+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this}subScalar(t){return this.x-=t,this.y-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this}multiply(t){return this.x*=t.x,this.y*=t.y,this}multiplyScalar(t){return this.x*=t,this.y*=t,this}divide(t){return this.x/=t.x,this.y/=t.y,this}divideScalar(t){return this.multiplyScalar(1/t)}applyMatrix3(t){const e=this.x,i=this.y,s=t.elements;return this.x=s[0]*e+s[3]*i+s[6],this.y=s[1]*e+s[4]*i+s[7],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this}clamp(t,e){return this.x=Qt(this.x,t.x,e.x),this.y=Qt(this.y,t.y,e.y),this}clampScalar(t,e){return this.x=Qt(this.x,t,e),this.y=Qt(this.y,t,e),this}clampLength(t,e){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Qt(i,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(t){return this.x*t.x+this.y*t.y}cross(t){return this.x*t.y-this.y*t.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const i=this.dot(t)/e;return Math.acos(Qt(i,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,i=this.y-t.y;return e*e+i*i}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this}lerpVectors(t,e,i){return this.x=t.x+(e.x-t.x)*i,this.y=t.y+(e.y-t.y)*i,this}equals(t){return t.x===this.x&&t.y===this.y}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this}rotateAround(t,e){const i=Math.cos(e),s=Math.sin(e),r=this.x-t.x,a=this.y-t.y;return this.x=r*i-a*s+t.x,this.y=r*s+a*i+t.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class Me{constructor(t=0,e=0,i=0,s=1){this.isQuaternion=!0,this._x=t,this._y=e,this._z=i,this._w=s}static slerpFlat(t,e,i,s,r,a,o){let c=i[s+0],l=i[s+1],h=i[s+2],u=i[s+3];const d=r[a+0],f=r[a+1],p=r[a+2],v=r[a+3];if(o===0){t[e+0]=c,t[e+1]=l,t[e+2]=h,t[e+3]=u;return}if(o===1){t[e+0]=d,t[e+1]=f,t[e+2]=p,t[e+3]=v;return}if(u!==v||c!==d||l!==f||h!==p){let g=1-o;const m=c*d+l*f+h*p+u*v,_=m>=0?1:-1,x=1-m*m;if(x>Number.EPSILON){const w=Math.sqrt(x),E=Math.atan2(w,m*_);g=Math.sin(g*E)/w,o=Math.sin(o*E)/w}const b=o*_;if(c=c*g+d*b,l=l*g+f*b,h=h*g+p*b,u=u*g+v*b,g===1-o){const w=1/Math.sqrt(c*c+l*l+h*h+u*u);c*=w,l*=w,h*=w,u*=w}}t[e]=c,t[e+1]=l,t[e+2]=h,t[e+3]=u}static multiplyQuaternionsFlat(t,e,i,s,r,a){const o=i[s],c=i[s+1],l=i[s+2],h=i[s+3],u=r[a],d=r[a+1],f=r[a+2],p=r[a+3];return t[e]=o*p+h*u+c*f-l*d,t[e+1]=c*p+h*d+l*u-o*f,t[e+2]=l*p+h*f+o*d-c*u,t[e+3]=h*p-o*u-c*d-l*f,t}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get w(){return this._w}set w(t){this._w=t,this._onChangeCallback()}set(t,e,i,s){return this._x=t,this._y=e,this._z=i,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(t){return this._x=t.x,this._y=t.y,this._z=t.z,this._w=t.w,this._onChangeCallback(),this}setFromEuler(t,e=!0){const i=t._x,s=t._y,r=t._z,a=t._order,o=Math.cos,c=Math.sin,l=o(i/2),h=o(s/2),u=o(r/2),d=c(i/2),f=c(s/2),p=c(r/2);switch(a){case"XYZ":this._x=d*h*u+l*f*p,this._y=l*f*u-d*h*p,this._z=l*h*p+d*f*u,this._w=l*h*u-d*f*p;break;case"YXZ":this._x=d*h*u+l*f*p,this._y=l*f*u-d*h*p,this._z=l*h*p-d*f*u,this._w=l*h*u+d*f*p;break;case"ZXY":this._x=d*h*u-l*f*p,this._y=l*f*u+d*h*p,this._z=l*h*p+d*f*u,this._w=l*h*u-d*f*p;break;case"ZYX":this._x=d*h*u-l*f*p,this._y=l*f*u+d*h*p,this._z=l*h*p-d*f*u,this._w=l*h*u+d*f*p;break;case"YZX":this._x=d*h*u+l*f*p,this._y=l*f*u+d*h*p,this._z=l*h*p-d*f*u,this._w=l*h*u-d*f*p;break;case"XZY":this._x=d*h*u-l*f*p,this._y=l*f*u-d*h*p,this._z=l*h*p+d*f*u,this._w=l*h*u+d*f*p;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+a)}return e===!0&&this._onChangeCallback(),this}setFromAxisAngle(t,e){const i=e/2,s=Math.sin(i);return this._x=t.x*s,this._y=t.y*s,this._z=t.z*s,this._w=Math.cos(i),this._onChangeCallback(),this}setFromRotationMatrix(t){const e=t.elements,i=e[0],s=e[4],r=e[8],a=e[1],o=e[5],c=e[9],l=e[2],h=e[6],u=e[10],d=i+o+u;if(d>0){const f=.5/Math.sqrt(d+1);this._w=.25/f,this._x=(h-c)*f,this._y=(r-l)*f,this._z=(a-s)*f}else if(i>o&&i>u){const f=2*Math.sqrt(1+i-o-u);this._w=(h-c)/f,this._x=.25*f,this._y=(s+a)/f,this._z=(r+l)/f}else if(o>u){const f=2*Math.sqrt(1+o-i-u);this._w=(r-l)/f,this._x=(s+a)/f,this._y=.25*f,this._z=(c+h)/f}else{const f=2*Math.sqrt(1+u-i-o);this._w=(a-s)/f,this._x=(r+l)/f,this._y=(c+h)/f,this._z=.25*f}return this._onChangeCallback(),this}setFromUnitVectors(t,e){let i=t.dot(e)+1;return i<1e-8?(i=0,Math.abs(t.x)>Math.abs(t.z)?(this._x=-t.y,this._y=t.x,this._z=0,this._w=i):(this._x=0,this._y=-t.z,this._z=t.y,this._w=i)):(this._x=t.y*e.z-t.z*e.y,this._y=t.z*e.x-t.x*e.z,this._z=t.x*e.y-t.y*e.x,this._w=i),this.normalize()}angleTo(t){return 2*Math.acos(Math.abs(Qt(this.dot(t),-1,1)))}rotateTowards(t,e){const i=this.angleTo(t);if(i===0)return this;const s=Math.min(1,e/i);return this.slerp(t,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(t){return this._x*t._x+this._y*t._y+this._z*t._z+this._w*t._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let t=this.length();return t===0?(this._x=0,this._y=0,this._z=0,this._w=1):(t=1/t,this._x=this._x*t,this._y=this._y*t,this._z=this._z*t,this._w=this._w*t),this._onChangeCallback(),this}multiply(t){return this.multiplyQuaternions(this,t)}premultiply(t){return this.multiplyQuaternions(t,this)}multiplyQuaternions(t,e){const i=t._x,s=t._y,r=t._z,a=t._w,o=e._x,c=e._y,l=e._z,h=e._w;return this._x=i*h+a*o+s*l-r*c,this._y=s*h+a*c+r*o-i*l,this._z=r*h+a*l+i*c-s*o,this._w=a*h-i*o-s*c-r*l,this._onChangeCallback(),this}slerp(t,e){if(e===0)return this;if(e===1)return this.copy(t);const i=this._x,s=this._y,r=this._z,a=this._w;let o=a*t._w+i*t._x+s*t._y+r*t._z;if(o<0?(this._w=-t._w,this._x=-t._x,this._y=-t._y,this._z=-t._z,o=-o):this.copy(t),o>=1)return this._w=a,this._x=i,this._y=s,this._z=r,this;const c=1-o*o;if(c<=Number.EPSILON){const f=1-e;return this._w=f*a+e*this._w,this._x=f*i+e*this._x,this._y=f*s+e*this._y,this._z=f*r+e*this._z,this.normalize(),this}const l=Math.sqrt(c),h=Math.atan2(l,o),u=Math.sin((1-e)*h)/l,d=Math.sin(e*h)/l;return this._w=a*u+this._w*d,this._x=i*u+this._x*d,this._y=s*u+this._y*d,this._z=r*u+this._z*d,this._onChangeCallback(),this}slerpQuaternions(t,e,i){return this.copy(t).slerp(e,i)}random(){const t=2*Math.PI*Math.random(),e=2*Math.PI*Math.random(),i=Math.random(),s=Math.sqrt(1-i),r=Math.sqrt(i);return this.set(s*Math.sin(t),s*Math.cos(t),r*Math.sin(e),r*Math.cos(e))}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._w===this._w}fromArray(t,e=0){return this._x=t[e],this._y=t[e+1],this._z=t[e+2],this._w=t[e+3],this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._w,t}fromBufferAttribute(t,e){return this._x=t.getX(e),this._y=t.getY(e),this._z=t.getZ(e),this._w=t.getW(e),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class C{constructor(t=0,e=0,i=0){C.prototype.isVector3=!0,this.x=t,this.y=e,this.z=i}set(t,e,i){return i===void 0&&(i=this.z),this.x=t,this.y=e,this.z=i,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this}multiplyVectors(t,e){return this.x=t.x*e.x,this.y=t.y*e.y,this.z=t.z*e.z,this}applyEuler(t){return this.applyQuaternion(yf.setFromEuler(t))}applyAxisAngle(t,e){return this.applyQuaternion(yf.setFromAxisAngle(t,e))}applyMatrix3(t){const e=this.x,i=this.y,s=this.z,r=t.elements;return this.x=r[0]*e+r[3]*i+r[6]*s,this.y=r[1]*e+r[4]*i+r[7]*s,this.z=r[2]*e+r[5]*i+r[8]*s,this}applyNormalMatrix(t){return this.applyMatrix3(t).normalize()}applyMatrix4(t){const e=this.x,i=this.y,s=this.z,r=t.elements,a=1/(r[3]*e+r[7]*i+r[11]*s+r[15]);return this.x=(r[0]*e+r[4]*i+r[8]*s+r[12])*a,this.y=(r[1]*e+r[5]*i+r[9]*s+r[13])*a,this.z=(r[2]*e+r[6]*i+r[10]*s+r[14])*a,this}applyQuaternion(t){const e=this.x,i=this.y,s=this.z,r=t.x,a=t.y,o=t.z,c=t.w,l=2*(a*s-o*i),h=2*(o*e-r*s),u=2*(r*i-a*e);return this.x=e+c*l+a*u-o*h,this.y=i+c*h+o*l-r*u,this.z=s+c*u+r*h-a*l,this}project(t){return this.applyMatrix4(t.matrixWorldInverse).applyMatrix4(t.projectionMatrix)}unproject(t){return this.applyMatrix4(t.projectionMatrixInverse).applyMatrix4(t.matrixWorld)}transformDirection(t){const e=this.x,i=this.y,s=this.z,r=t.elements;return this.x=r[0]*e+r[4]*i+r[8]*s,this.y=r[1]*e+r[5]*i+r[9]*s,this.z=r[2]*e+r[6]*i+r[10]*s,this.normalize()}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this}divideScalar(t){return this.multiplyScalar(1/t)}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this}clamp(t,e){return this.x=Qt(this.x,t.x,e.x),this.y=Qt(this.y,t.y,e.y),this.z=Qt(this.z,t.z,e.z),this}clampScalar(t,e){return this.x=Qt(this.x,t,e),this.y=Qt(this.y,t,e),this.z=Qt(this.z,t,e),this}clampLength(t,e){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Qt(i,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this}lerpVectors(t,e,i){return this.x=t.x+(e.x-t.x)*i,this.y=t.y+(e.y-t.y)*i,this.z=t.z+(e.z-t.z)*i,this}cross(t){return this.crossVectors(this,t)}crossVectors(t,e){const i=t.x,s=t.y,r=t.z,a=e.x,o=e.y,c=e.z;return this.x=s*c-r*o,this.y=r*a-i*c,this.z=i*o-s*a,this}projectOnVector(t){const e=t.lengthSq();if(e===0)return this.set(0,0,0);const i=t.dot(this)/e;return this.copy(t).multiplyScalar(i)}projectOnPlane(t){return Dl.copy(this).projectOnVector(t),this.sub(Dl)}reflect(t){return this.sub(Dl.copy(t).multiplyScalar(2*this.dot(t)))}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const i=this.dot(t)/e;return Math.acos(Qt(i,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,i=this.y-t.y,s=this.z-t.z;return e*e+i*i+s*s}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)+Math.abs(this.z-t.z)}setFromSpherical(t){return this.setFromSphericalCoords(t.radius,t.phi,t.theta)}setFromSphericalCoords(t,e,i){const s=Math.sin(e)*t;return this.x=s*Math.sin(i),this.y=Math.cos(e)*t,this.z=s*Math.cos(i),this}setFromCylindrical(t){return this.setFromCylindricalCoords(t.radius,t.theta,t.y)}setFromCylindricalCoords(t,e,i){return this.x=t*Math.sin(e),this.y=i,this.z=t*Math.cos(e),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this}setFromMatrixScale(t){const e=this.setFromMatrixColumn(t,0).length(),i=this.setFromMatrixColumn(t,1).length(),s=this.setFromMatrixColumn(t,2).length();return this.x=e,this.y=i,this.z=s,this}setFromMatrixColumn(t,e){return this.fromArray(t.elements,e*4)}setFromMatrix3Column(t,e){return this.fromArray(t.elements,e*3)}setFromEuler(t){return this.x=t._x,this.y=t._y,this.z=t._z,this}setFromColor(t){return this.x=t.r,this.y=t.g,this.z=t.b,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const t=Math.random()*Math.PI*2,e=Math.random()*2-1,i=Math.sqrt(1-e*e);return this.x=i*Math.cos(t),this.y=e,this.z=i*Math.sin(t),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const Dl=new C,yf=new Me;class ne{constructor(t,e,i,s,r,a,o,c,l){ne.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],t!==void 0&&this.set(t,e,i,s,r,a,o,c,l)}set(t,e,i,s,r,a,o,c,l){const h=this.elements;return h[0]=t,h[1]=s,h[2]=o,h[3]=e,h[4]=r,h[5]=c,h[6]=i,h[7]=a,h[8]=l,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(t){const e=this.elements,i=t.elements;return e[0]=i[0],e[1]=i[1],e[2]=i[2],e[3]=i[3],e[4]=i[4],e[5]=i[5],e[6]=i[6],e[7]=i[7],e[8]=i[8],this}extractBasis(t,e,i){return t.setFromMatrix3Column(this,0),e.setFromMatrix3Column(this,1),i.setFromMatrix3Column(this,2),this}setFromMatrix4(t){const e=t.elements;return this.set(e[0],e[4],e[8],e[1],e[5],e[9],e[2],e[6],e[10]),this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const i=t.elements,s=e.elements,r=this.elements,a=i[0],o=i[3],c=i[6],l=i[1],h=i[4],u=i[7],d=i[2],f=i[5],p=i[8],v=s[0],g=s[3],m=s[6],_=s[1],x=s[4],b=s[7],w=s[2],E=s[5],A=s[8];return r[0]=a*v+o*_+c*w,r[3]=a*g+o*x+c*E,r[6]=a*m+o*b+c*A,r[1]=l*v+h*_+u*w,r[4]=l*g+h*x+u*E,r[7]=l*m+h*b+u*A,r[2]=d*v+f*_+p*w,r[5]=d*g+f*x+p*E,r[8]=d*m+f*b+p*A,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[3]*=t,e[6]*=t,e[1]*=t,e[4]*=t,e[7]*=t,e[2]*=t,e[5]*=t,e[8]*=t,this}determinant(){const t=this.elements,e=t[0],i=t[1],s=t[2],r=t[3],a=t[4],o=t[5],c=t[6],l=t[7],h=t[8];return e*a*h-e*o*l-i*r*h+i*o*c+s*r*l-s*a*c}invert(){const t=this.elements,e=t[0],i=t[1],s=t[2],r=t[3],a=t[4],o=t[5],c=t[6],l=t[7],h=t[8],u=h*a-o*l,d=o*c-h*r,f=l*r-a*c,p=e*u+i*d+s*f;if(p===0)return this.set(0,0,0,0,0,0,0,0,0);const v=1/p;return t[0]=u*v,t[1]=(s*l-h*i)*v,t[2]=(o*i-s*a)*v,t[3]=d*v,t[4]=(h*e-s*c)*v,t[5]=(s*r-o*e)*v,t[6]=f*v,t[7]=(i*c-l*e)*v,t[8]=(a*e-i*r)*v,this}transpose(){let t;const e=this.elements;return t=e[1],e[1]=e[3],e[3]=t,t=e[2],e[2]=e[6],e[6]=t,t=e[5],e[5]=e[7],e[7]=t,this}getNormalMatrix(t){return this.setFromMatrix4(t).invert().transpose()}transposeIntoArray(t){const e=this.elements;return t[0]=e[0],t[1]=e[3],t[2]=e[6],t[3]=e[1],t[4]=e[4],t[5]=e[7],t[6]=e[2],t[7]=e[5],t[8]=e[8],this}setUvTransform(t,e,i,s,r,a,o){const c=Math.cos(r),l=Math.sin(r);return this.set(i*c,i*l,-i*(c*a+l*o)+a+t,-s*l,s*c,-s*(-l*a+c*o)+o+e,0,0,1),this}scale(t,e){return this.premultiply(Ul.makeScale(t,e)),this}rotate(t){return this.premultiply(Ul.makeRotation(-t)),this}translate(t,e){return this.premultiply(Ul.makeTranslation(t,e)),this}makeTranslation(t,e){return t.isVector2?this.set(1,0,t.x,0,1,t.y,0,0,1):this.set(1,0,t,0,1,e,0,0,1),this}makeRotation(t){const e=Math.cos(t),i=Math.sin(t);return this.set(e,-i,0,i,e,0,0,0,1),this}makeScale(t,e){return this.set(t,0,0,0,e,0,0,0,1),this}equals(t){const e=this.elements,i=t.elements;for(let s=0;s<9;s++)if(e[s]!==i[s])return!1;return!0}fromArray(t,e=0){for(let i=0;i<9;i++)this.elements[i]=t[i+e];return this}toArray(t=[],e=0){const i=this.elements;return t[e]=i[0],t[e+1]=i[1],t[e+2]=i[2],t[e+3]=i[3],t[e+4]=i[4],t[e+5]=i[5],t[e+6]=i[6],t[e+7]=i[7],t[e+8]=i[8],t}clone(){return new this.constructor().fromArray(this.elements)}}const Ul=new ne;function fp(n){for(let t=n.length-1;t>=0;--t)if(n[t]>=65535)return!0;return!1}function Kc(n){return document.createElementNS("http://www.w3.org/1999/xhtml",n)}function H2(){const n=Kc("canvas");return n.style.display="block",n}const wf={};function bo(n){n in wf||(wf[n]=!0,console.warn(n))}function V2(n,t,e){return new Promise(function(i,s){function r(){switch(n.clientWaitSync(t,n.SYNC_FLUSH_COMMANDS_BIT,0)){case n.WAIT_FAILED:s();break;case n.TIMEOUT_EXPIRED:setTimeout(r,e);break;default:i()}}setTimeout(r,e)})}const Sf=new ne().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),Ef=new ne().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function z2(){const n={enabled:!0,workingColorSpace:gr,spaces:{},convert:function(s,r,a){return this.enabled===!1||r===a||!r||!a||(this.spaces[r].transfer===xe&&(s.r=cs(s.r),s.g=cs(s.g),s.b=cs(s.b)),this.spaces[r].primaries!==this.spaces[a].primaries&&(s.applyMatrix3(this.spaces[r].toXYZ),s.applyMatrix3(this.spaces[a].fromXYZ)),this.spaces[a].transfer===xe&&(s.r=va(s.r),s.g=va(s.g),s.b=va(s.b))),s},workingToColorSpace:function(s,r){return this.convert(s,this.workingColorSpace,r)},colorSpaceToWorking:function(s,r){return this.convert(s,r,this.workingColorSpace)},getPrimaries:function(s){return this.spaces[s].primaries},getTransfer:function(s){return s===Ni?jc:this.spaces[s].transfer},getToneMappingMode:function(s){return this.spaces[s].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(s,r=this.workingColorSpace){return s.fromArray(this.spaces[r].luminanceCoefficients)},define:function(s){Object.assign(this.spaces,s)},_getMatrix:function(s,r,a){return s.copy(this.spaces[r].toXYZ).multiply(this.spaces[a].fromXYZ)},_getDrawingBufferColorSpace:function(s){return this.spaces[s].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(s=this.workingColorSpace){return this.spaces[s].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(s,r){return bo("THREE.ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),n.workingToColorSpace(s,r)},toWorkingColorSpace:function(s,r){return bo("THREE.ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),n.colorSpaceToWorking(s,r)}},t=[.64,.33,.3,.6,.15,.06],e=[.2126,.7152,.0722],i=[.3127,.329];return n.define({[gr]:{primaries:t,whitePoint:i,transfer:jc,toXYZ:Sf,fromXYZ:Ef,luminanceCoefficients:e,workingColorSpaceConfig:{unpackColorSpace:rn},outputColorSpaceConfig:{drawingBufferColorSpace:rn}},[rn]:{primaries:t,whitePoint:i,transfer:xe,toXYZ:Sf,fromXYZ:Ef,luminanceCoefficients:e,outputColorSpaceConfig:{drawingBufferColorSpace:rn}}}),n}const ue=z2();function cs(n){return n<.04045?n*.0773993808:Math.pow(n*.9478672986+.0521327014,2.4)}function va(n){return n<.0031308?n*12.92:1.055*Math.pow(n,.41666)-.055}let Ar;class G2{static getDataURL(t,e="image/png"){if(/^data:/i.test(t.src)||typeof HTMLCanvasElement>"u")return t.src;let i;if(t instanceof HTMLCanvasElement)i=t;else{Ar===void 0&&(Ar=Kc("canvas")),Ar.width=t.width,Ar.height=t.height;const s=Ar.getContext("2d");t instanceof ImageData?s.putImageData(t,0,0):s.drawImage(t,0,0,t.width,t.height),i=Ar}return i.toDataURL(e)}static sRGBToLinear(t){if(typeof HTMLImageElement<"u"&&t instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&t instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&t instanceof ImageBitmap){const e=Kc("canvas");e.width=t.width,e.height=t.height;const i=e.getContext("2d");i.drawImage(t,0,0,t.width,t.height);const s=i.getImageData(0,0,t.width,t.height),r=s.data;for(let a=0;a<r.length;a++)r[a]=cs(r[a]/255)*255;return i.putImageData(s,0,0),e}else if(t.data){const e=t.data.slice(0);for(let i=0;i<e.length;i++)e instanceof Uint8Array||e instanceof Uint8ClampedArray?e[i]=Math.floor(cs(e[i]/255)*255):e[i]=cs(e[i]);return{data:e,width:t.width,height:t.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),t}}let W2=0;class f0{constructor(t=null){this.isSource=!0,Object.defineProperty(this,"id",{value:W2++}),this.uuid=mi(),this.data=t,this.dataReady=!0,this.version=0}getSize(t){const e=this.data;return typeof HTMLVideoElement<"u"&&e instanceof HTMLVideoElement?t.set(e.videoWidth,e.videoHeight,0):e instanceof VideoFrame?t.set(e.displayHeight,e.displayWidth,0):e!==null?t.set(e.width,e.height,e.depth||0):t.set(0,0,0),t}set needsUpdate(t){t===!0&&this.version++}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.images[this.uuid]!==void 0)return t.images[this.uuid];const i={uuid:this.uuid,url:""},s=this.data;if(s!==null){let r;if(Array.isArray(s)){r=[];for(let a=0,o=s.length;a<o;a++)s[a].isDataTexture?r.push(Nl(s[a].image)):r.push(Nl(s[a]))}else r=Nl(s);i.url=r}return e||(t.images[this.uuid]=i),i}}function Nl(n){return typeof HTMLImageElement<"u"&&n instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&n instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&n instanceof ImageBitmap?G2.getDataURL(n):n.data?{data:Array.from(n.data),width:n.width,height:n.height,type:n.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}let X2=0;const Fl=new C;class Qe extends Na{constructor(t=Qe.DEFAULT_IMAGE,e=Qe.DEFAULT_MAPPING,i=nr,s=nr,r=Re,a=Cs,o=Je,c=Mi,l=Qe.DEFAULT_ANISOTROPY,h=Ni){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:X2++}),this.uuid=mi(),this.name="",this.source=new f0(t),this.mipmaps=[],this.mapping=e,this.channel=0,this.wrapS=i,this.wrapT=s,this.magFilter=r,this.minFilter=a,this.anisotropy=l,this.format=o,this.internalFormat=null,this.type=c,this.offset=new ht(0,0),this.repeat=new ht(1,1),this.center=new ht(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new ne,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=h,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(t&&t.depth&&t.depth>1),this.pmremVersion=0}get width(){return this.source.getSize(Fl).x}get height(){return this.source.getSize(Fl).y}get depth(){return this.source.getSize(Fl).z}get image(){return this.source.data}set image(t=null){this.source.data=t}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(t){return this.name=t.name,this.source=t.source,this.mipmaps=t.mipmaps.slice(0),this.mapping=t.mapping,this.channel=t.channel,this.wrapS=t.wrapS,this.wrapT=t.wrapT,this.magFilter=t.magFilter,this.minFilter=t.minFilter,this.anisotropy=t.anisotropy,this.format=t.format,this.internalFormat=t.internalFormat,this.type=t.type,this.offset.copy(t.offset),this.repeat.copy(t.repeat),this.center.copy(t.center),this.rotation=t.rotation,this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrix.copy(t.matrix),this.generateMipmaps=t.generateMipmaps,this.premultiplyAlpha=t.premultiplyAlpha,this.flipY=t.flipY,this.unpackAlignment=t.unpackAlignment,this.colorSpace=t.colorSpace,this.renderTarget=t.renderTarget,this.isRenderTargetTexture=t.isRenderTargetTexture,this.isArrayTexture=t.isArrayTexture,this.userData=JSON.parse(JSON.stringify(t.userData)),this.needsUpdate=!0,this}setValues(t){for(const e in t){const i=t[e];if(i===void 0){console.warn(`THREE.Texture.setValues(): parameter '${e}' has value of undefined.`);continue}const s=this[e];if(s===void 0){console.warn(`THREE.Texture.setValues(): property '${e}' does not exist.`);continue}s&&i&&s.isVector2&&i.isVector2||s&&i&&s.isVector3&&i.isVector3||s&&i&&s.isMatrix3&&i.isMatrix3?s.copy(i):this[e]=i}}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.textures[this.uuid]!==void 0)return t.textures[this.uuid];const i={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(t).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(i.userData=this.userData),e||(t.textures[this.uuid]=i),i}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(t){if(this.mapping!==ep)return t;if(t.applyMatrix3(this.matrix),t.x<0||t.x>1)switch(this.wrapS){case Ca:t.x=t.x-Math.floor(t.x);break;case nr:t.x=t.x<0?0:1;break;case Kh:Math.abs(Math.floor(t.x)%2)===1?t.x=Math.ceil(t.x)-t.x:t.x=t.x-Math.floor(t.x);break}if(t.y<0||t.y>1)switch(this.wrapT){case Ca:t.y=t.y-Math.floor(t.y);break;case nr:t.y=t.y<0?0:1;break;case Kh:Math.abs(Math.floor(t.y)%2)===1?t.y=Math.ceil(t.y)-t.y:t.y=t.y-Math.floor(t.y);break}return this.flipY&&(t.y=1-t.y),t}set needsUpdate(t){t===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(t){t===!0&&this.pmremVersion++}}Qe.DEFAULT_IMAGE=null;Qe.DEFAULT_MAPPING=ep;Qe.DEFAULT_ANISOTROPY=1;class de{constructor(t=0,e=0,i=0,s=1){de.prototype.isVector4=!0,this.x=t,this.y=e,this.z=i,this.w=s}get width(){return this.z}set width(t){this.z=t}get height(){return this.w}set height(t){this.w=t}set(t,e,i,s){return this.x=t,this.y=e,this.z=i,this.w=s,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this.w=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setW(t){return this.w=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;case 3:this.w=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this.w=t.w!==void 0?t.w:1,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this.w+=t.w,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this.w+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this.w=t.w+e.w,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this.w+=t.w*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this.w-=t.w,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this.w-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this.w=t.w-e.w,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this.w*=t.w,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this.w*=t,this}applyMatrix4(t){const e=this.x,i=this.y,s=this.z,r=this.w,a=t.elements;return this.x=a[0]*e+a[4]*i+a[8]*s+a[12]*r,this.y=a[1]*e+a[5]*i+a[9]*s+a[13]*r,this.z=a[2]*e+a[6]*i+a[10]*s+a[14]*r,this.w=a[3]*e+a[7]*i+a[11]*s+a[15]*r,this}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this.w/=t.w,this}divideScalar(t){return this.multiplyScalar(1/t)}setAxisAngleFromQuaternion(t){this.w=2*Math.acos(t.w);const e=Math.sqrt(1-t.w*t.w);return e<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=t.x/e,this.y=t.y/e,this.z=t.z/e),this}setAxisAngleFromRotationMatrix(t){let e,i,s,r;const c=t.elements,l=c[0],h=c[4],u=c[8],d=c[1],f=c[5],p=c[9],v=c[2],g=c[6],m=c[10];if(Math.abs(h-d)<.01&&Math.abs(u-v)<.01&&Math.abs(p-g)<.01){if(Math.abs(h+d)<.1&&Math.abs(u+v)<.1&&Math.abs(p+g)<.1&&Math.abs(l+f+m-3)<.1)return this.set(1,0,0,0),this;e=Math.PI;const x=(l+1)/2,b=(f+1)/2,w=(m+1)/2,E=(h+d)/4,A=(u+v)/4,T=(p+g)/4;return x>b&&x>w?x<.01?(i=0,s=.707106781,r=.707106781):(i=Math.sqrt(x),s=E/i,r=A/i):b>w?b<.01?(i=.707106781,s=0,r=.707106781):(s=Math.sqrt(b),i=E/s,r=T/s):w<.01?(i=.707106781,s=.707106781,r=0):(r=Math.sqrt(w),i=A/r,s=T/r),this.set(i,s,r,e),this}let _=Math.sqrt((g-p)*(g-p)+(u-v)*(u-v)+(d-h)*(d-h));return Math.abs(_)<.001&&(_=1),this.x=(g-p)/_,this.y=(u-v)/_,this.z=(d-h)/_,this.w=Math.acos((l+f+m-1)/2),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this.w=e[15],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this.w=Math.min(this.w,t.w),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this.w=Math.max(this.w,t.w),this}clamp(t,e){return this.x=Qt(this.x,t.x,e.x),this.y=Qt(this.y,t.y,e.y),this.z=Qt(this.z,t.z,e.z),this.w=Qt(this.w,t.w,e.w),this}clampScalar(t,e){return this.x=Qt(this.x,t,e),this.y=Qt(this.y,t,e),this.z=Qt(this.z,t,e),this.w=Qt(this.w,t,e),this}clampLength(t,e){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Qt(i,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z+this.w*t.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this.w+=(t.w-this.w)*e,this}lerpVectors(t,e,i){return this.x=t.x+(e.x-t.x)*i,this.y=t.y+(e.y-t.y)*i,this.z=t.z+(e.z-t.z)*i,this.w=t.w+(e.w-t.w)*i,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z&&t.w===this.w}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this.w=t[e+3],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t[e+3]=this.w,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this.w=t.getW(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class q2 extends Na{constructor(t=1,e=1,i={}){super(),i=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:Re,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1},i),this.isRenderTarget=!0,this.width=t,this.height=e,this.depth=i.depth,this.scissor=new de(0,0,t,e),this.scissorTest=!1,this.viewport=new de(0,0,t,e);const s={width:t,height:e,depth:i.depth},r=new Qe(s);this.textures=[];const a=i.count;for(let o=0;o<a;o++)this.textures[o]=r.clone(),this.textures[o].isRenderTargetTexture=!0,this.textures[o].renderTarget=this;this._setTextureOptions(i),this.depthBuffer=i.depthBuffer,this.stencilBuffer=i.stencilBuffer,this.resolveDepthBuffer=i.resolveDepthBuffer,this.resolveStencilBuffer=i.resolveStencilBuffer,this._depthTexture=null,this.depthTexture=i.depthTexture,this.samples=i.samples,this.multiview=i.multiview}_setTextureOptions(t={}){const e={minFilter:Re,generateMipmaps:!1,flipY:!1,internalFormat:null};t.mapping!==void 0&&(e.mapping=t.mapping),t.wrapS!==void 0&&(e.wrapS=t.wrapS),t.wrapT!==void 0&&(e.wrapT=t.wrapT),t.wrapR!==void 0&&(e.wrapR=t.wrapR),t.magFilter!==void 0&&(e.magFilter=t.magFilter),t.minFilter!==void 0&&(e.minFilter=t.minFilter),t.format!==void 0&&(e.format=t.format),t.type!==void 0&&(e.type=t.type),t.anisotropy!==void 0&&(e.anisotropy=t.anisotropy),t.colorSpace!==void 0&&(e.colorSpace=t.colorSpace),t.flipY!==void 0&&(e.flipY=t.flipY),t.generateMipmaps!==void 0&&(e.generateMipmaps=t.generateMipmaps),t.internalFormat!==void 0&&(e.internalFormat=t.internalFormat);for(let i=0;i<this.textures.length;i++)this.textures[i].setValues(e)}get texture(){return this.textures[0]}set texture(t){this.textures[0]=t}set depthTexture(t){this._depthTexture!==null&&(this._depthTexture.renderTarget=null),t!==null&&(t.renderTarget=this),this._depthTexture=t}get depthTexture(){return this._depthTexture}setSize(t,e,i=1){if(this.width!==t||this.height!==e||this.depth!==i){this.width=t,this.height=e,this.depth=i;for(let s=0,r=this.textures.length;s<r;s++)this.textures[s].image.width=t,this.textures[s].image.height=e,this.textures[s].image.depth=i,this.textures[s].isArrayTexture=this.textures[s].image.depth>1;this.dispose()}this.viewport.set(0,0,t,e),this.scissor.set(0,0,t,e)}clone(){return new this.constructor().copy(this)}copy(t){this.width=t.width,this.height=t.height,this.depth=t.depth,this.scissor.copy(t.scissor),this.scissorTest=t.scissorTest,this.viewport.copy(t.viewport),this.textures.length=0;for(let e=0,i=t.textures.length;e<i;e++){this.textures[e]=t.textures[e].clone(),this.textures[e].isRenderTargetTexture=!0,this.textures[e].renderTarget=this;const s=Object.assign({},t.textures[e].image);this.textures[e].source=new f0(s)}return this.depthBuffer=t.depthBuffer,this.stencilBuffer=t.stencilBuffer,this.resolveDepthBuffer=t.resolveDepthBuffer,this.resolveStencilBuffer=t.resolveStencilBuffer,t.depthTexture!==null&&(this.depthTexture=t.depthTexture.clone()),this.samples=t.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class dn extends q2{constructor(t=1,e=1,i={}){super(t,e,i),this.isWebGLRenderTarget=!0}}class d0 extends Qe{constructor(t=null,e=1,i=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:t,width:e,height:i,depth:s},this.magFilter=Vn,this.minFilter=Vn,this.wrapR=nr,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(t){this.layerUpdates.add(t)}clearLayerUpdates(){this.layerUpdates.clear()}}class $2 extends dn{constructor(t=1,e=1,i=1,s={}){super(t,e,s),this.isWebGLArrayRenderTarget=!0,this.depth=i,this.texture=new d0(null,t,e,i),this._setTextureOptions(s),this.texture.isRenderTargetTexture=!0}}class Y2 extends Qe{constructor(t=null,e=1,i=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:t,width:e,height:i,depth:s},this.magFilter=Vn,this.minFilter=Vn,this.wrapR=nr,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class Fa{constructor(t=new C(1/0,1/0,1/0),e=new C(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=t,this.max=e}set(t,e){return this.min.copy(t),this.max.copy(e),this}setFromArray(t){this.makeEmpty();for(let e=0,i=t.length;e<i;e+=3)this.expandByPoint(ni.fromArray(t,e));return this}setFromBufferAttribute(t){this.makeEmpty();for(let e=0,i=t.count;e<i;e++)this.expandByPoint(ni.fromBufferAttribute(t,e));return this}setFromPoints(t){this.makeEmpty();for(let e=0,i=t.length;e<i;e++)this.expandByPoint(t[e]);return this}setFromCenterAndSize(t,e){const i=ni.copy(e).multiplyScalar(.5);return this.min.copy(t).sub(i),this.max.copy(t).add(i),this}setFromObject(t,e=!1){return this.makeEmpty(),this.expandByObject(t,e)}clone(){return new this.constructor().copy(this)}copy(t){return this.min.copy(t.min),this.max.copy(t.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(t){return this.isEmpty()?t.set(0,0,0):t.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(t){return this.isEmpty()?t.set(0,0,0):t.subVectors(this.max,this.min)}expandByPoint(t){return this.min.min(t),this.max.max(t),this}expandByVector(t){return this.min.sub(t),this.max.add(t),this}expandByScalar(t){return this.min.addScalar(-t),this.max.addScalar(t),this}expandByObject(t,e=!1){t.updateWorldMatrix(!1,!1);const i=t.geometry;if(i!==void 0){const r=i.getAttribute("position");if(e===!0&&r!==void 0&&t.isInstancedMesh!==!0)for(let a=0,o=r.count;a<o;a++)t.isMesh===!0?t.getVertexPosition(a,ni):ni.fromBufferAttribute(r,a),ni.applyMatrix4(t.matrixWorld),this.expandByPoint(ni);else t.boundingBox!==void 0?(t.boundingBox===null&&t.computeBoundingBox(),Yo.copy(t.boundingBox)):(i.boundingBox===null&&i.computeBoundingBox(),Yo.copy(i.boundingBox)),Yo.applyMatrix4(t.matrixWorld),this.union(Yo)}const s=t.children;for(let r=0,a=s.length;r<a;r++)this.expandByObject(s[r],e);return this}containsPoint(t){return t.x>=this.min.x&&t.x<=this.max.x&&t.y>=this.min.y&&t.y<=this.max.y&&t.z>=this.min.z&&t.z<=this.max.z}containsBox(t){return this.min.x<=t.min.x&&t.max.x<=this.max.x&&this.min.y<=t.min.y&&t.max.y<=this.max.y&&this.min.z<=t.min.z&&t.max.z<=this.max.z}getParameter(t,e){return e.set((t.x-this.min.x)/(this.max.x-this.min.x),(t.y-this.min.y)/(this.max.y-this.min.y),(t.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(t){return t.max.x>=this.min.x&&t.min.x<=this.max.x&&t.max.y>=this.min.y&&t.min.y<=this.max.y&&t.max.z>=this.min.z&&t.min.z<=this.max.z}intersectsSphere(t){return this.clampPoint(t.center,ni),ni.distanceToSquared(t.center)<=t.radius*t.radius}intersectsPlane(t){let e,i;return t.normal.x>0?(e=t.normal.x*this.min.x,i=t.normal.x*this.max.x):(e=t.normal.x*this.max.x,i=t.normal.x*this.min.x),t.normal.y>0?(e+=t.normal.y*this.min.y,i+=t.normal.y*this.max.y):(e+=t.normal.y*this.max.y,i+=t.normal.y*this.min.y),t.normal.z>0?(e+=t.normal.z*this.min.z,i+=t.normal.z*this.max.z):(e+=t.normal.z*this.max.z,i+=t.normal.z*this.min.z),e<=-t.constant&&i>=-t.constant}intersectsTriangle(t){if(this.isEmpty())return!1;this.getCenter(Wa),jo.subVectors(this.max,Wa),Rr.subVectors(t.a,Wa),Cr.subVectors(t.b,Wa),Lr.subVectors(t.c,Wa),ms.subVectors(Cr,Rr),gs.subVectors(Lr,Cr),Vs.subVectors(Rr,Lr);let e=[0,-ms.z,ms.y,0,-gs.z,gs.y,0,-Vs.z,Vs.y,ms.z,0,-ms.x,gs.z,0,-gs.x,Vs.z,0,-Vs.x,-ms.y,ms.x,0,-gs.y,gs.x,0,-Vs.y,Vs.x,0];return!Ol(e,Rr,Cr,Lr,jo)||(e=[1,0,0,0,1,0,0,0,1],!Ol(e,Rr,Cr,Lr,jo))?!1:(Zo.crossVectors(ms,gs),e=[Zo.x,Zo.y,Zo.z],Ol(e,Rr,Cr,Lr,jo))}clampPoint(t,e){return e.copy(t).clamp(this.min,this.max)}distanceToPoint(t){return this.clampPoint(t,ni).distanceTo(t)}getBoundingSphere(t){return this.isEmpty()?t.makeEmpty():(this.getCenter(t.center),t.radius=this.getSize(ni).length()*.5),t}intersect(t){return this.min.max(t.min),this.max.min(t.max),this.isEmpty()&&this.makeEmpty(),this}union(t){return this.min.min(t.min),this.max.max(t.max),this}applyMatrix4(t){return this.isEmpty()?this:($i[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(t),$i[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(t),$i[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(t),$i[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(t),$i[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(t),$i[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(t),$i[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(t),$i[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(t),this.setFromPoints($i),this)}translate(t){return this.min.add(t),this.max.add(t),this}equals(t){return t.min.equals(this.min)&&t.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(t){return this.min.fromArray(t.min),this.max.fromArray(t.max),this}}const $i=[new C,new C,new C,new C,new C,new C,new C,new C],ni=new C,Yo=new Fa,Rr=new C,Cr=new C,Lr=new C,ms=new C,gs=new C,Vs=new C,Wa=new C,jo=new C,Zo=new C,zs=new C;function Ol(n,t,e,i,s){for(let r=0,a=n.length-3;r<=a;r+=3){zs.fromArray(n,r);const o=s.x*Math.abs(zs.x)+s.y*Math.abs(zs.y)+s.z*Math.abs(zs.z),c=t.dot(zs),l=e.dot(zs),h=i.dot(zs);if(Math.max(-Math.max(c,l,h),Math.min(c,l,h))>o)return!1}return!0}const j2=new Fa,Xa=new C,kl=new C;class Mr{constructor(t=new C,e=-1){this.isSphere=!0,this.center=t,this.radius=e}set(t,e){return this.center.copy(t),this.radius=e,this}setFromPoints(t,e){const i=this.center;e!==void 0?i.copy(e):j2.setFromPoints(t).getCenter(i);let s=0;for(let r=0,a=t.length;r<a;r++)s=Math.max(s,i.distanceToSquared(t[r]));return this.radius=Math.sqrt(s),this}copy(t){return this.center.copy(t.center),this.radius=t.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(t){return t.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(t){return t.distanceTo(this.center)-this.radius}intersectsSphere(t){const e=this.radius+t.radius;return t.center.distanceToSquared(this.center)<=e*e}intersectsBox(t){return t.intersectsSphere(this)}intersectsPlane(t){return Math.abs(t.distanceToPoint(this.center))<=this.radius}clampPoint(t,e){const i=this.center.distanceToSquared(t);return e.copy(t),i>this.radius*this.radius&&(e.sub(this.center).normalize(),e.multiplyScalar(this.radius).add(this.center)),e}getBoundingBox(t){return this.isEmpty()?(t.makeEmpty(),t):(t.set(this.center,this.center),t.expandByScalar(this.radius),t)}applyMatrix4(t){return this.center.applyMatrix4(t),this.radius=this.radius*t.getMaxScaleOnAxis(),this}translate(t){return this.center.add(t),this}expandByPoint(t){if(this.isEmpty())return this.center.copy(t),this.radius=0,this;Xa.subVectors(t,this.center);const e=Xa.lengthSq();if(e>this.radius*this.radius){const i=Math.sqrt(e),s=(i-this.radius)*.5;this.center.addScaledVector(Xa,s/i),this.radius+=s}return this}union(t){return t.isEmpty()?this:this.isEmpty()?(this.copy(t),this):(this.center.equals(t.center)===!0?this.radius=Math.max(this.radius,t.radius):(kl.subVectors(t.center,this.center).setLength(t.radius),this.expandByPoint(Xa.copy(t.center).add(kl)),this.expandByPoint(Xa.copy(t.center).sub(kl))),this)}equals(t){return t.center.equals(this.center)&&t.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(t){return this.radius=t.radius,this.center.fromArray(t.center),this}}const Yi=new C,Bl=new C,Ko=new C,vs=new C,Hl=new C,Jo=new C,Vl=new C;class p0{constructor(t=new C,e=new C(0,0,-1)){this.origin=t,this.direction=e}set(t,e){return this.origin.copy(t),this.direction.copy(e),this}copy(t){return this.origin.copy(t.origin),this.direction.copy(t.direction),this}at(t,e){return e.copy(this.origin).addScaledVector(this.direction,t)}lookAt(t){return this.direction.copy(t).sub(this.origin).normalize(),this}recast(t){return this.origin.copy(this.at(t,Yi)),this}closestPointToPoint(t,e){e.subVectors(t,this.origin);const i=e.dot(this.direction);return i<0?e.copy(this.origin):e.copy(this.origin).addScaledVector(this.direction,i)}distanceToPoint(t){return Math.sqrt(this.distanceSqToPoint(t))}distanceSqToPoint(t){const e=Yi.subVectors(t,this.origin).dot(this.direction);return e<0?this.origin.distanceToSquared(t):(Yi.copy(this.origin).addScaledVector(this.direction,e),Yi.distanceToSquared(t))}distanceSqToSegment(t,e,i,s){Bl.copy(t).add(e).multiplyScalar(.5),Ko.copy(e).sub(t).normalize(),vs.copy(this.origin).sub(Bl);const r=t.distanceTo(e)*.5,a=-this.direction.dot(Ko),o=vs.dot(this.direction),c=-vs.dot(Ko),l=vs.lengthSq(),h=Math.abs(1-a*a);let u,d,f,p;if(h>0)if(u=a*c-o,d=a*o-c,p=r*h,u>=0)if(d>=-p)if(d<=p){const v=1/h;u*=v,d*=v,f=u*(u+a*d+2*o)+d*(a*u+d+2*c)+l}else d=r,u=Math.max(0,-(a*d+o)),f=-u*u+d*(d+2*c)+l;else d=-r,u=Math.max(0,-(a*d+o)),f=-u*u+d*(d+2*c)+l;else d<=-p?(u=Math.max(0,-(-a*r+o)),d=u>0?-r:Math.min(Math.max(-r,-c),r),f=-u*u+d*(d+2*c)+l):d<=p?(u=0,d=Math.min(Math.max(-r,-c),r),f=d*(d+2*c)+l):(u=Math.max(0,-(a*r+o)),d=u>0?r:Math.min(Math.max(-r,-c),r),f=-u*u+d*(d+2*c)+l);else d=a>0?-r:r,u=Math.max(0,-(a*d+o)),f=-u*u+d*(d+2*c)+l;return i&&i.copy(this.origin).addScaledVector(this.direction,u),s&&s.copy(Bl).addScaledVector(Ko,d),f}intersectSphere(t,e){Yi.subVectors(t.center,this.origin);const i=Yi.dot(this.direction),s=Yi.dot(Yi)-i*i,r=t.radius*t.radius;if(s>r)return null;const a=Math.sqrt(r-s),o=i-a,c=i+a;return c<0?null:o<0?this.at(c,e):this.at(o,e)}intersectsSphere(t){return t.radius<0?!1:this.distanceSqToPoint(t.center)<=t.radius*t.radius}distanceToPlane(t){const e=t.normal.dot(this.direction);if(e===0)return t.distanceToPoint(this.origin)===0?0:null;const i=-(this.origin.dot(t.normal)+t.constant)/e;return i>=0?i:null}intersectPlane(t,e){const i=this.distanceToPlane(t);return i===null?null:this.at(i,e)}intersectsPlane(t){const e=t.distanceToPoint(this.origin);return e===0||t.normal.dot(this.direction)*e<0}intersectBox(t,e){let i,s,r,a,o,c;const l=1/this.direction.x,h=1/this.direction.y,u=1/this.direction.z,d=this.origin;return l>=0?(i=(t.min.x-d.x)*l,s=(t.max.x-d.x)*l):(i=(t.max.x-d.x)*l,s=(t.min.x-d.x)*l),h>=0?(r=(t.min.y-d.y)*h,a=(t.max.y-d.y)*h):(r=(t.max.y-d.y)*h,a=(t.min.y-d.y)*h),i>a||r>s||((r>i||isNaN(i))&&(i=r),(a<s||isNaN(s))&&(s=a),u>=0?(o=(t.min.z-d.z)*u,c=(t.max.z-d.z)*u):(o=(t.max.z-d.z)*u,c=(t.min.z-d.z)*u),i>c||o>s)||((o>i||i!==i)&&(i=o),(c<s||s!==s)&&(s=c),s<0)?null:this.at(i>=0?i:s,e)}intersectsBox(t){return this.intersectBox(t,Yi)!==null}intersectTriangle(t,e,i,s,r){Hl.subVectors(e,t),Jo.subVectors(i,t),Vl.crossVectors(Hl,Jo);let a=this.direction.dot(Vl),o;if(a>0){if(s)return null;o=1}else if(a<0)o=-1,a=-a;else return null;vs.subVectors(this.origin,t);const c=o*this.direction.dot(Jo.crossVectors(vs,Jo));if(c<0)return null;const l=o*this.direction.dot(Hl.cross(vs));if(l<0||c+l>a)return null;const h=-o*vs.dot(Vl);return h<0?null:this.at(h/a,r)}applyMatrix4(t){return this.origin.applyMatrix4(t),this.direction.transformDirection(t),this}equals(t){return t.origin.equals(this.origin)&&t.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class se{constructor(t,e,i,s,r,a,o,c,l,h,u,d,f,p,v,g){se.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],t!==void 0&&this.set(t,e,i,s,r,a,o,c,l,h,u,d,f,p,v,g)}set(t,e,i,s,r,a,o,c,l,h,u,d,f,p,v,g){const m=this.elements;return m[0]=t,m[4]=e,m[8]=i,m[12]=s,m[1]=r,m[5]=a,m[9]=o,m[13]=c,m[2]=l,m[6]=h,m[10]=u,m[14]=d,m[3]=f,m[7]=p,m[11]=v,m[15]=g,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new se().fromArray(this.elements)}copy(t){const e=this.elements,i=t.elements;return e[0]=i[0],e[1]=i[1],e[2]=i[2],e[3]=i[3],e[4]=i[4],e[5]=i[5],e[6]=i[6],e[7]=i[7],e[8]=i[8],e[9]=i[9],e[10]=i[10],e[11]=i[11],e[12]=i[12],e[13]=i[13],e[14]=i[14],e[15]=i[15],this}copyPosition(t){const e=this.elements,i=t.elements;return e[12]=i[12],e[13]=i[13],e[14]=i[14],this}setFromMatrix3(t){const e=t.elements;return this.set(e[0],e[3],e[6],0,e[1],e[4],e[7],0,e[2],e[5],e[8],0,0,0,0,1),this}extractBasis(t,e,i){return t.setFromMatrixColumn(this,0),e.setFromMatrixColumn(this,1),i.setFromMatrixColumn(this,2),this}makeBasis(t,e,i){return this.set(t.x,e.x,i.x,0,t.y,e.y,i.y,0,t.z,e.z,i.z,0,0,0,0,1),this}extractRotation(t){const e=this.elements,i=t.elements,s=1/Pr.setFromMatrixColumn(t,0).length(),r=1/Pr.setFromMatrixColumn(t,1).length(),a=1/Pr.setFromMatrixColumn(t,2).length();return e[0]=i[0]*s,e[1]=i[1]*s,e[2]=i[2]*s,e[3]=0,e[4]=i[4]*r,e[5]=i[5]*r,e[6]=i[6]*r,e[7]=0,e[8]=i[8]*a,e[9]=i[9]*a,e[10]=i[10]*a,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromEuler(t){const e=this.elements,i=t.x,s=t.y,r=t.z,a=Math.cos(i),o=Math.sin(i),c=Math.cos(s),l=Math.sin(s),h=Math.cos(r),u=Math.sin(r);if(t.order==="XYZ"){const d=a*h,f=a*u,p=o*h,v=o*u;e[0]=c*h,e[4]=-c*u,e[8]=l,e[1]=f+p*l,e[5]=d-v*l,e[9]=-o*c,e[2]=v-d*l,e[6]=p+f*l,e[10]=a*c}else if(t.order==="YXZ"){const d=c*h,f=c*u,p=l*h,v=l*u;e[0]=d+v*o,e[4]=p*o-f,e[8]=a*l,e[1]=a*u,e[5]=a*h,e[9]=-o,e[2]=f*o-p,e[6]=v+d*o,e[10]=a*c}else if(t.order==="ZXY"){const d=c*h,f=c*u,p=l*h,v=l*u;e[0]=d-v*o,e[4]=-a*u,e[8]=p+f*o,e[1]=f+p*o,e[5]=a*h,e[9]=v-d*o,e[2]=-a*l,e[6]=o,e[10]=a*c}else if(t.order==="ZYX"){const d=a*h,f=a*u,p=o*h,v=o*u;e[0]=c*h,e[4]=p*l-f,e[8]=d*l+v,e[1]=c*u,e[5]=v*l+d,e[9]=f*l-p,e[2]=-l,e[6]=o*c,e[10]=a*c}else if(t.order==="YZX"){const d=a*c,f=a*l,p=o*c,v=o*l;e[0]=c*h,e[4]=v-d*u,e[8]=p*u+f,e[1]=u,e[5]=a*h,e[9]=-o*h,e[2]=-l*h,e[6]=f*u+p,e[10]=d-v*u}else if(t.order==="XZY"){const d=a*c,f=a*l,p=o*c,v=o*l;e[0]=c*h,e[4]=-u,e[8]=l*h,e[1]=d*u+v,e[5]=a*h,e[9]=f*u-p,e[2]=p*u-f,e[6]=o*h,e[10]=v*u+d}return e[3]=0,e[7]=0,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromQuaternion(t){return this.compose(Z2,t,K2)}lookAt(t,e,i){const s=this.elements;return Ln.subVectors(t,e),Ln.lengthSq()===0&&(Ln.z=1),Ln.normalize(),xs.crossVectors(i,Ln),xs.lengthSq()===0&&(Math.abs(i.z)===1?Ln.x+=1e-4:Ln.z+=1e-4,Ln.normalize(),xs.crossVectors(i,Ln)),xs.normalize(),Qo.crossVectors(Ln,xs),s[0]=xs.x,s[4]=Qo.x,s[8]=Ln.x,s[1]=xs.y,s[5]=Qo.y,s[9]=Ln.y,s[2]=xs.z,s[6]=Qo.z,s[10]=Ln.z,this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const i=t.elements,s=e.elements,r=this.elements,a=i[0],o=i[4],c=i[8],l=i[12],h=i[1],u=i[5],d=i[9],f=i[13],p=i[2],v=i[6],g=i[10],m=i[14],_=i[3],x=i[7],b=i[11],w=i[15],E=s[0],A=s[4],T=s[8],M=s[12],y=s[1],S=s[5],R=s[9],I=s[13],L=s[2],D=s[6],k=s[10],q=s[14],z=s[3],it=s[7],ut=s[11],gt=s[15];return r[0]=a*E+o*y+c*L+l*z,r[4]=a*A+o*S+c*D+l*it,r[8]=a*T+o*R+c*k+l*ut,r[12]=a*M+o*I+c*q+l*gt,r[1]=h*E+u*y+d*L+f*z,r[5]=h*A+u*S+d*D+f*it,r[9]=h*T+u*R+d*k+f*ut,r[13]=h*M+u*I+d*q+f*gt,r[2]=p*E+v*y+g*L+m*z,r[6]=p*A+v*S+g*D+m*it,r[10]=p*T+v*R+g*k+m*ut,r[14]=p*M+v*I+g*q+m*gt,r[3]=_*E+x*y+b*L+w*z,r[7]=_*A+x*S+b*D+w*it,r[11]=_*T+x*R+b*k+w*ut,r[15]=_*M+x*I+b*q+w*gt,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[4]*=t,e[8]*=t,e[12]*=t,e[1]*=t,e[5]*=t,e[9]*=t,e[13]*=t,e[2]*=t,e[6]*=t,e[10]*=t,e[14]*=t,e[3]*=t,e[7]*=t,e[11]*=t,e[15]*=t,this}determinant(){const t=this.elements,e=t[0],i=t[4],s=t[8],r=t[12],a=t[1],o=t[5],c=t[9],l=t[13],h=t[2],u=t[6],d=t[10],f=t[14],p=t[3],v=t[7],g=t[11],m=t[15];return p*(+r*c*u-s*l*u-r*o*d+i*l*d+s*o*f-i*c*f)+v*(+e*c*f-e*l*d+r*a*d-s*a*f+s*l*h-r*c*h)+g*(+e*l*u-e*o*f-r*a*u+i*a*f+r*o*h-i*l*h)+m*(-s*o*h-e*c*u+e*o*d+s*a*u-i*a*d+i*c*h)}transpose(){const t=this.elements;let e;return e=t[1],t[1]=t[4],t[4]=e,e=t[2],t[2]=t[8],t[8]=e,e=t[6],t[6]=t[9],t[9]=e,e=t[3],t[3]=t[12],t[12]=e,e=t[7],t[7]=t[13],t[13]=e,e=t[11],t[11]=t[14],t[14]=e,this}setPosition(t,e,i){const s=this.elements;return t.isVector3?(s[12]=t.x,s[13]=t.y,s[14]=t.z):(s[12]=t,s[13]=e,s[14]=i),this}invert(){const t=this.elements,e=t[0],i=t[1],s=t[2],r=t[3],a=t[4],o=t[5],c=t[6],l=t[7],h=t[8],u=t[9],d=t[10],f=t[11],p=t[12],v=t[13],g=t[14],m=t[15],_=u*g*l-v*d*l+v*c*f-o*g*f-u*c*m+o*d*m,x=p*d*l-h*g*l-p*c*f+a*g*f+h*c*m-a*d*m,b=h*v*l-p*u*l+p*o*f-a*v*f-h*o*m+a*u*m,w=p*u*c-h*v*c-p*o*d+a*v*d+h*o*g-a*u*g,E=e*_+i*x+s*b+r*w;if(E===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const A=1/E;return t[0]=_*A,t[1]=(v*d*r-u*g*r-v*s*f+i*g*f+u*s*m-i*d*m)*A,t[2]=(o*g*r-v*c*r+v*s*l-i*g*l-o*s*m+i*c*m)*A,t[3]=(u*c*r-o*d*r-u*s*l+i*d*l+o*s*f-i*c*f)*A,t[4]=x*A,t[5]=(h*g*r-p*d*r+p*s*f-e*g*f-h*s*m+e*d*m)*A,t[6]=(p*c*r-a*g*r-p*s*l+e*g*l+a*s*m-e*c*m)*A,t[7]=(a*d*r-h*c*r+h*s*l-e*d*l-a*s*f+e*c*f)*A,t[8]=b*A,t[9]=(p*u*r-h*v*r-p*i*f+e*v*f+h*i*m-e*u*m)*A,t[10]=(a*v*r-p*o*r+p*i*l-e*v*l-a*i*m+e*o*m)*A,t[11]=(h*o*r-a*u*r-h*i*l+e*u*l+a*i*f-e*o*f)*A,t[12]=w*A,t[13]=(h*v*s-p*u*s+p*i*d-e*v*d-h*i*g+e*u*g)*A,t[14]=(p*o*s-a*v*s-p*i*c+e*v*c+a*i*g-e*o*g)*A,t[15]=(a*u*s-h*o*s+h*i*c-e*u*c-a*i*d+e*o*d)*A,this}scale(t){const e=this.elements,i=t.x,s=t.y,r=t.z;return e[0]*=i,e[4]*=s,e[8]*=r,e[1]*=i,e[5]*=s,e[9]*=r,e[2]*=i,e[6]*=s,e[10]*=r,e[3]*=i,e[7]*=s,e[11]*=r,this}getMaxScaleOnAxis(){const t=this.elements,e=t[0]*t[0]+t[1]*t[1]+t[2]*t[2],i=t[4]*t[4]+t[5]*t[5]+t[6]*t[6],s=t[8]*t[8]+t[9]*t[9]+t[10]*t[10];return Math.sqrt(Math.max(e,i,s))}makeTranslation(t,e,i){return t.isVector3?this.set(1,0,0,t.x,0,1,0,t.y,0,0,1,t.z,0,0,0,1):this.set(1,0,0,t,0,1,0,e,0,0,1,i,0,0,0,1),this}makeRotationX(t){const e=Math.cos(t),i=Math.sin(t);return this.set(1,0,0,0,0,e,-i,0,0,i,e,0,0,0,0,1),this}makeRotationY(t){const e=Math.cos(t),i=Math.sin(t);return this.set(e,0,i,0,0,1,0,0,-i,0,e,0,0,0,0,1),this}makeRotationZ(t){const e=Math.cos(t),i=Math.sin(t);return this.set(e,-i,0,0,i,e,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(t,e){const i=Math.cos(e),s=Math.sin(e),r=1-i,a=t.x,o=t.y,c=t.z,l=r*a,h=r*o;return this.set(l*a+i,l*o-s*c,l*c+s*o,0,l*o+s*c,h*o+i,h*c-s*a,0,l*c-s*o,h*c+s*a,r*c*c+i,0,0,0,0,1),this}makeScale(t,e,i){return this.set(t,0,0,0,0,e,0,0,0,0,i,0,0,0,0,1),this}makeShear(t,e,i,s,r,a){return this.set(1,i,r,0,t,1,a,0,e,s,1,0,0,0,0,1),this}compose(t,e,i){const s=this.elements,r=e._x,a=e._y,o=e._z,c=e._w,l=r+r,h=a+a,u=o+o,d=r*l,f=r*h,p=r*u,v=a*h,g=a*u,m=o*u,_=c*l,x=c*h,b=c*u,w=i.x,E=i.y,A=i.z;return s[0]=(1-(v+m))*w,s[1]=(f+b)*w,s[2]=(p-x)*w,s[3]=0,s[4]=(f-b)*E,s[5]=(1-(d+m))*E,s[6]=(g+_)*E,s[7]=0,s[8]=(p+x)*A,s[9]=(g-_)*A,s[10]=(1-(d+v))*A,s[11]=0,s[12]=t.x,s[13]=t.y,s[14]=t.z,s[15]=1,this}decompose(t,e,i){const s=this.elements;let r=Pr.set(s[0],s[1],s[2]).length();const a=Pr.set(s[4],s[5],s[6]).length(),o=Pr.set(s[8],s[9],s[10]).length();this.determinant()<0&&(r=-r),t.x=s[12],t.y=s[13],t.z=s[14],ii.copy(this);const l=1/r,h=1/a,u=1/o;return ii.elements[0]*=l,ii.elements[1]*=l,ii.elements[2]*=l,ii.elements[4]*=h,ii.elements[5]*=h,ii.elements[6]*=h,ii.elements[8]*=u,ii.elements[9]*=u,ii.elements[10]*=u,e.setFromRotationMatrix(ii),i.x=r,i.y=a,i.z=o,this}makePerspective(t,e,i,s,r,a,o=Hi,c=!1){const l=this.elements,h=2*r/(e-t),u=2*r/(i-s),d=(e+t)/(e-t),f=(i+s)/(i-s);let p,v;if(c)p=r/(a-r),v=a*r/(a-r);else if(o===Hi)p=-(a+r)/(a-r),v=-2*a*r/(a-r);else if(o===Zc)p=-a/(a-r),v=-a*r/(a-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+o);return l[0]=h,l[4]=0,l[8]=d,l[12]=0,l[1]=0,l[5]=u,l[9]=f,l[13]=0,l[2]=0,l[6]=0,l[10]=p,l[14]=v,l[3]=0,l[7]=0,l[11]=-1,l[15]=0,this}makeOrthographic(t,e,i,s,r,a,o=Hi,c=!1){const l=this.elements,h=2/(e-t),u=2/(i-s),d=-(e+t)/(e-t),f=-(i+s)/(i-s);let p,v;if(c)p=1/(a-r),v=a/(a-r);else if(o===Hi)p=-2/(a-r),v=-(a+r)/(a-r);else if(o===Zc)p=-1/(a-r),v=-r/(a-r);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+o);return l[0]=h,l[4]=0,l[8]=0,l[12]=d,l[1]=0,l[5]=u,l[9]=0,l[13]=f,l[2]=0,l[6]=0,l[10]=p,l[14]=v,l[3]=0,l[7]=0,l[11]=0,l[15]=1,this}equals(t){const e=this.elements,i=t.elements;for(let s=0;s<16;s++)if(e[s]!==i[s])return!1;return!0}fromArray(t,e=0){for(let i=0;i<16;i++)this.elements[i]=t[i+e];return this}toArray(t=[],e=0){const i=this.elements;return t[e]=i[0],t[e+1]=i[1],t[e+2]=i[2],t[e+3]=i[3],t[e+4]=i[4],t[e+5]=i[5],t[e+6]=i[6],t[e+7]=i[7],t[e+8]=i[8],t[e+9]=i[9],t[e+10]=i[10],t[e+11]=i[11],t[e+12]=i[12],t[e+13]=i[13],t[e+14]=i[14],t[e+15]=i[15],t}}const Pr=new C,ii=new se,Z2=new C(0,0,0),K2=new C(1,1,1),xs=new C,Qo=new C,Ln=new C,Tf=new se,Af=new Me;class gn{constructor(t=0,e=0,i=0,s=gn.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=e,this._z=i,this._order=s}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get order(){return this._order}set order(t){this._order=t,this._onChangeCallback()}set(t,e,i,s=this._order){return this._x=t,this._y=e,this._z=i,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(t){return this._x=t._x,this._y=t._y,this._z=t._z,this._order=t._order,this._onChangeCallback(),this}setFromRotationMatrix(t,e=this._order,i=!0){const s=t.elements,r=s[0],a=s[4],o=s[8],c=s[1],l=s[5],h=s[9],u=s[2],d=s[6],f=s[10];switch(e){case"XYZ":this._y=Math.asin(Qt(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-h,f),this._z=Math.atan2(-a,r)):(this._x=Math.atan2(d,l),this._z=0);break;case"YXZ":this._x=Math.asin(-Qt(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(o,f),this._z=Math.atan2(c,l)):(this._y=Math.atan2(-u,r),this._z=0);break;case"ZXY":this._x=Math.asin(Qt(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(-u,f),this._z=Math.atan2(-a,l)):(this._y=0,this._z=Math.atan2(c,r));break;case"ZYX":this._y=Math.asin(-Qt(u,-1,1)),Math.abs(u)<.9999999?(this._x=Math.atan2(d,f),this._z=Math.atan2(c,r)):(this._x=0,this._z=Math.atan2(-a,l));break;case"YZX":this._z=Math.asin(Qt(c,-1,1)),Math.abs(c)<.9999999?(this._x=Math.atan2(-h,l),this._y=Math.atan2(-u,r)):(this._x=0,this._y=Math.atan2(o,f));break;case"XZY":this._z=Math.asin(-Qt(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(d,l),this._y=Math.atan2(o,r)):(this._x=Math.atan2(-h,f),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+e)}return this._order=e,i===!0&&this._onChangeCallback(),this}setFromQuaternion(t,e,i){return Tf.makeRotationFromQuaternion(t),this.setFromRotationMatrix(Tf,e,i)}setFromVector3(t,e=this._order){return this.set(t.x,t.y,t.z,e)}reorder(t){return Af.setFromEuler(this),this.setFromQuaternion(Af,t)}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._order===this._order}fromArray(t){return this._x=t[0],this._y=t[1],this._z=t[2],t[3]!==void 0&&(this._order=t[3]),this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._order,t}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}gn.DEFAULT_ORDER="XYZ";class dp{constructor(){this.mask=1}set(t){this.mask=(1<<t|0)>>>0}enable(t){this.mask|=1<<t|0}enableAll(){this.mask=-1}toggle(t){this.mask^=1<<t|0}disable(t){this.mask&=~(1<<t|0)}disableAll(){this.mask=0}test(t){return(this.mask&t.mask)!==0}isEnabled(t){return(this.mask&(1<<t|0))!==0}}let J2=0;const Rf=new C,Ir=new Me,ji=new se,tc=new C,qa=new C,Q2=new C,tv=new Me,Cf=new C(1,0,0),Lf=new C(0,1,0),Pf=new C(0,0,1),If={type:"added"},ev={type:"removed"},Dr={type:"childadded",child:null},zl={type:"childremoved",child:null};class Be extends Na{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:J2++}),this.uuid=mi(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=Be.DEFAULT_UP.clone();const t=new C,e=new gn,i=new Me,s=new C(1,1,1);function r(){i.setFromEuler(e,!1)}function a(){e.setFromQuaternion(i,void 0,!1)}e._onChange(r),i._onChange(a),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:e},quaternion:{configurable:!0,enumerable:!0,value:i},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new se},normalMatrix:{value:new ne}}),this.matrix=new se,this.matrixWorld=new se,this.matrixAutoUpdate=Be.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=Be.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new dp,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(t){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(t),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(t){return this.quaternion.premultiply(t),this}setRotationFromAxisAngle(t,e){this.quaternion.setFromAxisAngle(t,e)}setRotationFromEuler(t){this.quaternion.setFromEuler(t,!0)}setRotationFromMatrix(t){this.quaternion.setFromRotationMatrix(t)}setRotationFromQuaternion(t){this.quaternion.copy(t)}rotateOnAxis(t,e){return Ir.setFromAxisAngle(t,e),this.quaternion.multiply(Ir),this}rotateOnWorldAxis(t,e){return Ir.setFromAxisAngle(t,e),this.quaternion.premultiply(Ir),this}rotateX(t){return this.rotateOnAxis(Cf,t)}rotateY(t){return this.rotateOnAxis(Lf,t)}rotateZ(t){return this.rotateOnAxis(Pf,t)}translateOnAxis(t,e){return Rf.copy(t).applyQuaternion(this.quaternion),this.position.add(Rf.multiplyScalar(e)),this}translateX(t){return this.translateOnAxis(Cf,t)}translateY(t){return this.translateOnAxis(Lf,t)}translateZ(t){return this.translateOnAxis(Pf,t)}localToWorld(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(this.matrixWorld)}worldToLocal(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(ji.copy(this.matrixWorld).invert())}lookAt(t,e,i){t.isVector3?tc.copy(t):tc.set(t,e,i);const s=this.parent;this.updateWorldMatrix(!0,!1),qa.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?ji.lookAt(qa,tc,this.up):ji.lookAt(tc,qa,this.up),this.quaternion.setFromRotationMatrix(ji),s&&(ji.extractRotation(s.matrixWorld),Ir.setFromRotationMatrix(ji),this.quaternion.premultiply(Ir.invert()))}add(t){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.add(arguments[e]);return this}return t===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",t),this):(t&&t.isObject3D?(t.removeFromParent(),t.parent=this,this.children.push(t),t.dispatchEvent(If),Dr.child=t,this.dispatchEvent(Dr),Dr.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",t),this)}remove(t){if(arguments.length>1){for(let i=0;i<arguments.length;i++)this.remove(arguments[i]);return this}const e=this.children.indexOf(t);return e!==-1&&(t.parent=null,this.children.splice(e,1),t.dispatchEvent(ev),zl.child=t,this.dispatchEvent(zl),zl.child=null),this}removeFromParent(){const t=this.parent;return t!==null&&t.remove(this),this}clear(){return this.remove(...this.children)}attach(t){return this.updateWorldMatrix(!0,!1),ji.copy(this.matrixWorld).invert(),t.parent!==null&&(t.parent.updateWorldMatrix(!0,!1),ji.multiply(t.parent.matrixWorld)),t.applyMatrix4(ji),t.removeFromParent(),t.parent=this,this.children.push(t),t.updateWorldMatrix(!1,!0),t.dispatchEvent(If),Dr.child=t,this.dispatchEvent(Dr),Dr.child=null,this}getObjectById(t){return this.getObjectByProperty("id",t)}getObjectByName(t){return this.getObjectByProperty("name",t)}getObjectByProperty(t,e){if(this[t]===e)return this;for(let i=0,s=this.children.length;i<s;i++){const a=this.children[i].getObjectByProperty(t,e);if(a!==void 0)return a}}getObjectsByProperty(t,e,i=[]){this[t]===e&&i.push(this);const s=this.children;for(let r=0,a=s.length;r<a;r++)s[r].getObjectsByProperty(t,e,i);return i}getWorldPosition(t){return this.updateWorldMatrix(!0,!1),t.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(qa,t,Q2),t}getWorldScale(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(qa,tv,t),t}getWorldDirection(t){this.updateWorldMatrix(!0,!1);const e=this.matrixWorld.elements;return t.set(e[8],e[9],e[10]).normalize()}raycast(){}traverse(t){t(this);const e=this.children;for(let i=0,s=e.length;i<s;i++)e[i].traverse(t)}traverseVisible(t){if(this.visible===!1)return;t(this);const e=this.children;for(let i=0,s=e.length;i<s;i++)e[i].traverseVisible(t)}traverseAncestors(t){const e=this.parent;e!==null&&(t(e),e.traverseAncestors(t))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(t){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||t)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,t=!0);const e=this.children;for(let i=0,s=e.length;i<s;i++)e[i].updateMatrixWorld(t)}updateWorldMatrix(t,e){const i=this.parent;if(t===!0&&i!==null&&i.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),e===!0){const s=this.children;for(let r=0,a=s.length;r<a;r++)s[r].updateWorldMatrix(!1,!0)}}toJSON(t){const e=t===void 0||typeof t=="string",i={};e&&(t={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},i.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});const s={};s.uuid=this.uuid,s.type=this.type,this.name!==""&&(s.name=this.name),this.castShadow===!0&&(s.castShadow=!0),this.receiveShadow===!0&&(s.receiveShadow=!0),this.visible===!1&&(s.visible=!1),this.frustumCulled===!1&&(s.frustumCulled=!1),this.renderOrder!==0&&(s.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(s.matrixAutoUpdate=!1),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.geometryInfo=this._geometryInfo.map(o=>({...o,boundingBox:o.boundingBox?o.boundingBox.toJSON():void 0,boundingSphere:o.boundingSphere?o.boundingSphere.toJSON():void 0})),s.instanceInfo=this._instanceInfo.map(o=>({...o})),s.availableInstanceIds=this._availableInstanceIds.slice(),s.availableGeometryIds=this._availableGeometryIds.slice(),s.nextIndexStart=this._nextIndexStart,s.nextVertexStart=this._nextVertexStart,s.geometryCount=this._geometryCount,s.maxInstanceCount=this._maxInstanceCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.matricesTexture=this._matricesTexture.toJSON(t),s.indirectTexture=this._indirectTexture.toJSON(t),this._colorsTexture!==null&&(s.colorsTexture=this._colorsTexture.toJSON(t)),this.boundingSphere!==null&&(s.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(s.boundingBox=this.boundingBox.toJSON()));function r(o,c){return o[c.uuid]===void 0&&(o[c.uuid]=c.toJSON(t)),c.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(t).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(t).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=r(t.geometries,this.geometry);const o=this.geometry.parameters;if(o!==void 0&&o.shapes!==void 0){const c=o.shapes;if(Array.isArray(c))for(let l=0,h=c.length;l<h;l++){const u=c[l];r(t.shapes,u)}else r(t.shapes,c)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(t.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const o=[];for(let c=0,l=this.material.length;c<l;c++)o.push(r(t.materials,this.material[c]));s.material=o}else s.material=r(t.materials,this.material);if(this.children.length>0){s.children=[];for(let o=0;o<this.children.length;o++)s.children.push(this.children[o].toJSON(t).object)}if(this.animations.length>0){s.animations=[];for(let o=0;o<this.animations.length;o++){const c=this.animations[o];s.animations.push(r(t.animations,c))}}if(e){const o=a(t.geometries),c=a(t.materials),l=a(t.textures),h=a(t.images),u=a(t.shapes),d=a(t.skeletons),f=a(t.animations),p=a(t.nodes);o.length>0&&(i.geometries=o),c.length>0&&(i.materials=c),l.length>0&&(i.textures=l),h.length>0&&(i.images=h),u.length>0&&(i.shapes=u),d.length>0&&(i.skeletons=d),f.length>0&&(i.animations=f),p.length>0&&(i.nodes=p)}return i.object=s,i;function a(o){const c=[];for(const l in o){const h=o[l];delete h.metadata,c.push(h)}return c}}clone(t){return new this.constructor().copy(this,t)}copy(t,e=!0){if(this.name=t.name,this.up.copy(t.up),this.position.copy(t.position),this.rotation.order=t.rotation.order,this.quaternion.copy(t.quaternion),this.scale.copy(t.scale),this.matrix.copy(t.matrix),this.matrixWorld.copy(t.matrixWorld),this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrixWorldAutoUpdate=t.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=t.matrixWorldNeedsUpdate,this.layers.mask=t.layers.mask,this.visible=t.visible,this.castShadow=t.castShadow,this.receiveShadow=t.receiveShadow,this.frustumCulled=t.frustumCulled,this.renderOrder=t.renderOrder,this.animations=t.animations.slice(),this.userData=JSON.parse(JSON.stringify(t.userData)),e===!0)for(let i=0;i<t.children.length;i++){const s=t.children[i];this.add(s.clone())}return this}}Be.DEFAULT_UP=new C(0,1,0);Be.DEFAULT_MATRIX_AUTO_UPDATE=!0;Be.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const si=new C,Zi=new C,Gl=new C,Ki=new C,Ur=new C,Nr=new C,Df=new C,Wl=new C,Xl=new C,ql=new C,$l=new de,Yl=new de,jl=new de;class Qn{constructor(t=new C,e=new C,i=new C){this.a=t,this.b=e,this.c=i}static getNormal(t,e,i,s){s.subVectors(i,e),si.subVectors(t,e),s.cross(si);const r=s.lengthSq();return r>0?s.multiplyScalar(1/Math.sqrt(r)):s.set(0,0,0)}static getBarycoord(t,e,i,s,r){si.subVectors(s,e),Zi.subVectors(i,e),Gl.subVectors(t,e);const a=si.dot(si),o=si.dot(Zi),c=si.dot(Gl),l=Zi.dot(Zi),h=Zi.dot(Gl),u=a*l-o*o;if(u===0)return r.set(0,0,0),null;const d=1/u,f=(l*c-o*h)*d,p=(a*h-o*c)*d;return r.set(1-f-p,p,f)}static containsPoint(t,e,i,s){return this.getBarycoord(t,e,i,s,Ki)===null?!1:Ki.x>=0&&Ki.y>=0&&Ki.x+Ki.y<=1}static getInterpolation(t,e,i,s,r,a,o,c){return this.getBarycoord(t,e,i,s,Ki)===null?(c.x=0,c.y=0,"z"in c&&(c.z=0),"w"in c&&(c.w=0),null):(c.setScalar(0),c.addScaledVector(r,Ki.x),c.addScaledVector(a,Ki.y),c.addScaledVector(o,Ki.z),c)}static getInterpolatedAttribute(t,e,i,s,r,a){return $l.setScalar(0),Yl.setScalar(0),jl.setScalar(0),$l.fromBufferAttribute(t,e),Yl.fromBufferAttribute(t,i),jl.fromBufferAttribute(t,s),a.setScalar(0),a.addScaledVector($l,r.x),a.addScaledVector(Yl,r.y),a.addScaledVector(jl,r.z),a}static isFrontFacing(t,e,i,s){return si.subVectors(i,e),Zi.subVectors(t,e),si.cross(Zi).dot(s)<0}set(t,e,i){return this.a.copy(t),this.b.copy(e),this.c.copy(i),this}setFromPointsAndIndices(t,e,i,s){return this.a.copy(t[e]),this.b.copy(t[i]),this.c.copy(t[s]),this}setFromAttributeAndIndices(t,e,i,s){return this.a.fromBufferAttribute(t,e),this.b.fromBufferAttribute(t,i),this.c.fromBufferAttribute(t,s),this}clone(){return new this.constructor().copy(this)}copy(t){return this.a.copy(t.a),this.b.copy(t.b),this.c.copy(t.c),this}getArea(){return si.subVectors(this.c,this.b),Zi.subVectors(this.a,this.b),si.cross(Zi).length()*.5}getMidpoint(t){return t.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(t){return Qn.getNormal(this.a,this.b,this.c,t)}getPlane(t){return t.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,e){return Qn.getBarycoord(t,this.a,this.b,this.c,e)}getInterpolation(t,e,i,s,r){return Qn.getInterpolation(t,this.a,this.b,this.c,e,i,s,r)}containsPoint(t){return Qn.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return Qn.isFrontFacing(this.a,this.b,this.c,t)}intersectsBox(t){return t.intersectsTriangle(this)}closestPointToPoint(t,e){const i=this.a,s=this.b,r=this.c;let a,o;Ur.subVectors(s,i),Nr.subVectors(r,i),Wl.subVectors(t,i);const c=Ur.dot(Wl),l=Nr.dot(Wl);if(c<=0&&l<=0)return e.copy(i);Xl.subVectors(t,s);const h=Ur.dot(Xl),u=Nr.dot(Xl);if(h>=0&&u<=h)return e.copy(s);const d=c*u-h*l;if(d<=0&&c>=0&&h<=0)return a=c/(c-h),e.copy(i).addScaledVector(Ur,a);ql.subVectors(t,r);const f=Ur.dot(ql),p=Nr.dot(ql);if(p>=0&&f<=p)return e.copy(r);const v=f*l-c*p;if(v<=0&&l>=0&&p<=0)return o=l/(l-p),e.copy(i).addScaledVector(Nr,o);const g=h*p-f*u;if(g<=0&&u-h>=0&&f-p>=0)return Df.subVectors(r,s),o=(u-h)/(u-h+(f-p)),e.copy(s).addScaledVector(Df,o);const m=1/(g+v+d);return a=v*m,o=d*m,e.copy(i).addScaledVector(Ur,a).addScaledVector(Nr,o)}equals(t){return t.a.equals(this.a)&&t.b.equals(this.b)&&t.c.equals(this.c)}}const pp={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},_s={h:0,s:0,l:0},ec={h:0,s:0,l:0};function Zl(n,t,e){return e<0&&(e+=1),e>1&&(e-=1),e<1/6?n+(t-n)*6*e:e<1/2?t:e<2/3?n+(t-n)*6*(2/3-e):n}class vt{constructor(t,e,i){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(t,e,i)}set(t,e,i){if(e===void 0&&i===void 0){const s=t;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(t,e,i);return this}setScalar(t){return this.r=t,this.g=t,this.b=t,this}setHex(t,e=rn){return t=Math.floor(t),this.r=(t>>16&255)/255,this.g=(t>>8&255)/255,this.b=(t&255)/255,ue.colorSpaceToWorking(this,e),this}setRGB(t,e,i,s=ue.workingColorSpace){return this.r=t,this.g=e,this.b=i,ue.colorSpaceToWorking(this,s),this}setHSL(t,e,i,s=ue.workingColorSpace){if(t=u0(t,1),e=Qt(e,0,1),i=Qt(i,0,1),e===0)this.r=this.g=this.b=i;else{const r=i<=.5?i*(1+e):i+e-i*e,a=2*i-r;this.r=Zl(a,r,t+1/3),this.g=Zl(a,r,t),this.b=Zl(a,r,t-1/3)}return ue.colorSpaceToWorking(this,s),this}setStyle(t,e=rn){function i(r){r!==void 0&&parseFloat(r)<1&&console.warn("THREE.Color: Alpha component of "+t+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(t)){let r;const a=s[1],o=s[2];switch(a){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return i(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,e);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return i(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,e);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return i(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,e);break;default:console.warn("THREE.Color: Unknown color model "+t)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(t)){const r=s[1],a=r.length;if(a===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,e);if(a===6)return this.setHex(parseInt(r,16),e);console.warn("THREE.Color: Invalid hex color "+t)}else if(t&&t.length>0)return this.setColorName(t,e);return this}setColorName(t,e=rn){const i=pp[t.toLowerCase()];return i!==void 0?this.setHex(i,e):console.warn("THREE.Color: Unknown color "+t),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(t){return this.r=t.r,this.g=t.g,this.b=t.b,this}copySRGBToLinear(t){return this.r=cs(t.r),this.g=cs(t.g),this.b=cs(t.b),this}copyLinearToSRGB(t){return this.r=va(t.r),this.g=va(t.g),this.b=va(t.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(t=rn){return ue.workingToColorSpace(en.copy(this),t),Math.round(Qt(en.r*255,0,255))*65536+Math.round(Qt(en.g*255,0,255))*256+Math.round(Qt(en.b*255,0,255))}getHexString(t=rn){return("000000"+this.getHex(t).toString(16)).slice(-6)}getHSL(t,e=ue.workingColorSpace){ue.workingToColorSpace(en.copy(this),e);const i=en.r,s=en.g,r=en.b,a=Math.max(i,s,r),o=Math.min(i,s,r);let c,l;const h=(o+a)/2;if(o===a)c=0,l=0;else{const u=a-o;switch(l=h<=.5?u/(a+o):u/(2-a-o),a){case i:c=(s-r)/u+(s<r?6:0);break;case s:c=(r-i)/u+2;break;case r:c=(i-s)/u+4;break}c/=6}return t.h=c,t.s=l,t.l=h,t}getRGB(t,e=ue.workingColorSpace){return ue.workingToColorSpace(en.copy(this),e),t.r=en.r,t.g=en.g,t.b=en.b,t}getStyle(t=rn){ue.workingToColorSpace(en.copy(this),t);const e=en.r,i=en.g,s=en.b;return t!==rn?`color(${t} ${e.toFixed(3)} ${i.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(e*255)},${Math.round(i*255)},${Math.round(s*255)})`}offsetHSL(t,e,i){return this.getHSL(_s),this.setHSL(_s.h+t,_s.s+e,_s.l+i)}add(t){return this.r+=t.r,this.g+=t.g,this.b+=t.b,this}addColors(t,e){return this.r=t.r+e.r,this.g=t.g+e.g,this.b=t.b+e.b,this}addScalar(t){return this.r+=t,this.g+=t,this.b+=t,this}sub(t){return this.r=Math.max(0,this.r-t.r),this.g=Math.max(0,this.g-t.g),this.b=Math.max(0,this.b-t.b),this}multiply(t){return this.r*=t.r,this.g*=t.g,this.b*=t.b,this}multiplyScalar(t){return this.r*=t,this.g*=t,this.b*=t,this}lerp(t,e){return this.r+=(t.r-this.r)*e,this.g+=(t.g-this.g)*e,this.b+=(t.b-this.b)*e,this}lerpColors(t,e,i){return this.r=t.r+(e.r-t.r)*i,this.g=t.g+(e.g-t.g)*i,this.b=t.b+(e.b-t.b)*i,this}lerpHSL(t,e){this.getHSL(_s),t.getHSL(ec);const i=ho(_s.h,ec.h,e),s=ho(_s.s,ec.s,e),r=ho(_s.l,ec.l,e);return this.setHSL(i,s,r),this}setFromVector3(t){return this.r=t.x,this.g=t.y,this.b=t.z,this}applyMatrix3(t){const e=this.r,i=this.g,s=this.b,r=t.elements;return this.r=r[0]*e+r[3]*i+r[6]*s,this.g=r[1]*e+r[4]*i+r[7]*s,this.b=r[2]*e+r[5]*i+r[8]*s,this}equals(t){return t.r===this.r&&t.g===this.g&&t.b===this.b}fromArray(t,e=0){return this.r=t[e],this.g=t[e+1],this.b=t[e+2],this}toArray(t=[],e=0){return t[e]=this.r,t[e+1]=this.g,t[e+2]=this.b,t}fromBufferAttribute(t,e){return this.r=t.getX(e),this.g=t.getY(e),this.b=t.getZ(e),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const en=new vt;vt.NAMES=pp;let nv=0;class br extends Na{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:nv++}),this.uuid=mi(),this.name="",this.type="Material",this.blending=ga,this.side=Os,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=Vh,this.blendDst=zh,this.blendEquation=tr,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new vt(0,0,0),this.blendAlpha=0,this.depthFunc=Ta,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=_f,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Tr,this.stencilZFail=Tr,this.stencilZPass=Tr,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(t){this._alphaTest>0!=t>0&&this.version++,this._alphaTest=t}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(t){if(t!==void 0)for(const e in t){const i=t[e];if(i===void 0){console.warn(`THREE.Material: parameter '${e}' has value of undefined.`);continue}const s=this[e];if(s===void 0){console.warn(`THREE.Material: '${e}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(i):s&&s.isVector3&&i&&i.isVector3?s.copy(i):this[e]=i}}toJSON(t){const e=t===void 0||typeof t=="string";e&&(t={textures:{},images:{}});const i={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};i.uuid=this.uuid,i.type=this.type,this.name!==""&&(i.name=this.name),this.color&&this.color.isColor&&(i.color=this.color.getHex()),this.roughness!==void 0&&(i.roughness=this.roughness),this.metalness!==void 0&&(i.metalness=this.metalness),this.sheen!==void 0&&(i.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(i.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(i.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(i.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(i.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(i.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(i.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(i.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(i.shininess=this.shininess),this.clearcoat!==void 0&&(i.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(i.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(i.clearcoatMap=this.clearcoatMap.toJSON(t).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(i.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(t).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(i.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(t).uuid,i.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(i.sheenColorMap=this.sheenColorMap.toJSON(t).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(i.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(t).uuid),this.dispersion!==void 0&&(i.dispersion=this.dispersion),this.iridescence!==void 0&&(i.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(i.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(i.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(i.iridescenceMap=this.iridescenceMap.toJSON(t).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(i.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(t).uuid),this.anisotropy!==void 0&&(i.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(i.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(i.anisotropyMap=this.anisotropyMap.toJSON(t).uuid),this.map&&this.map.isTexture&&(i.map=this.map.toJSON(t).uuid),this.matcap&&this.matcap.isTexture&&(i.matcap=this.matcap.toJSON(t).uuid),this.alphaMap&&this.alphaMap.isTexture&&(i.alphaMap=this.alphaMap.toJSON(t).uuid),this.lightMap&&this.lightMap.isTexture&&(i.lightMap=this.lightMap.toJSON(t).uuid,i.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(i.aoMap=this.aoMap.toJSON(t).uuid,i.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(i.bumpMap=this.bumpMap.toJSON(t).uuid,i.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(i.normalMap=this.normalMap.toJSON(t).uuid,i.normalMapType=this.normalMapType,i.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(i.displacementMap=this.displacementMap.toJSON(t).uuid,i.displacementScale=this.displacementScale,i.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(i.roughnessMap=this.roughnessMap.toJSON(t).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(i.metalnessMap=this.metalnessMap.toJSON(t).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(i.emissiveMap=this.emissiveMap.toJSON(t).uuid),this.specularMap&&this.specularMap.isTexture&&(i.specularMap=this.specularMap.toJSON(t).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(i.specularIntensityMap=this.specularIntensityMap.toJSON(t).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(i.specularColorMap=this.specularColorMap.toJSON(t).uuid),this.envMap&&this.envMap.isTexture&&(i.envMap=this.envMap.toJSON(t).uuid,this.combine!==void 0&&(i.combine=this.combine)),this.envMapRotation!==void 0&&(i.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(i.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(i.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(i.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(i.gradientMap=this.gradientMap.toJSON(t).uuid),this.transmission!==void 0&&(i.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(i.transmissionMap=this.transmissionMap.toJSON(t).uuid),this.thickness!==void 0&&(i.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(i.thicknessMap=this.thicknessMap.toJSON(t).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(i.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(i.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(i.size=this.size),this.shadowSide!==null&&(i.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(i.sizeAttenuation=this.sizeAttenuation),this.blending!==ga&&(i.blending=this.blending),this.side!==Os&&(i.side=this.side),this.vertexColors===!0&&(i.vertexColors=!0),this.opacity<1&&(i.opacity=this.opacity),this.transparent===!0&&(i.transparent=!0),this.blendSrc!==Vh&&(i.blendSrc=this.blendSrc),this.blendDst!==zh&&(i.blendDst=this.blendDst),this.blendEquation!==tr&&(i.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(i.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(i.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(i.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(i.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(i.blendAlpha=this.blendAlpha),this.depthFunc!==Ta&&(i.depthFunc=this.depthFunc),this.depthTest===!1&&(i.depthTest=this.depthTest),this.depthWrite===!1&&(i.depthWrite=this.depthWrite),this.colorWrite===!1&&(i.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(i.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==_f&&(i.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(i.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(i.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==Tr&&(i.stencilFail=this.stencilFail),this.stencilZFail!==Tr&&(i.stencilZFail=this.stencilZFail),this.stencilZPass!==Tr&&(i.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(i.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(i.rotation=this.rotation),this.polygonOffset===!0&&(i.polygonOffset=!0),this.polygonOffsetFactor!==0&&(i.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(i.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(i.linewidth=this.linewidth),this.dashSize!==void 0&&(i.dashSize=this.dashSize),this.gapSize!==void 0&&(i.gapSize=this.gapSize),this.scale!==void 0&&(i.scale=this.scale),this.dithering===!0&&(i.dithering=!0),this.alphaTest>0&&(i.alphaTest=this.alphaTest),this.alphaHash===!0&&(i.alphaHash=!0),this.alphaToCoverage===!0&&(i.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(i.premultipliedAlpha=!0),this.forceSinglePass===!0&&(i.forceSinglePass=!0),this.wireframe===!0&&(i.wireframe=!0),this.wireframeLinewidth>1&&(i.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(i.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(i.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(i.flatShading=!0),this.visible===!1&&(i.visible=!1),this.toneMapped===!1&&(i.toneMapped=!1),this.fog===!1&&(i.fog=!1),Object.keys(this.userData).length>0&&(i.userData=this.userData);function s(r){const a=[];for(const o in r){const c=r[o];delete c.metadata,a.push(c)}return a}if(e){const r=s(t.textures),a=s(t.images);r.length>0&&(i.textures=r),a.length>0&&(i.images=a)}return i}clone(){return new this.constructor().copy(this)}copy(t){this.name=t.name,this.blending=t.blending,this.side=t.side,this.vertexColors=t.vertexColors,this.opacity=t.opacity,this.transparent=t.transparent,this.blendSrc=t.blendSrc,this.blendDst=t.blendDst,this.blendEquation=t.blendEquation,this.blendSrcAlpha=t.blendSrcAlpha,this.blendDstAlpha=t.blendDstAlpha,this.blendEquationAlpha=t.blendEquationAlpha,this.blendColor.copy(t.blendColor),this.blendAlpha=t.blendAlpha,this.depthFunc=t.depthFunc,this.depthTest=t.depthTest,this.depthWrite=t.depthWrite,this.stencilWriteMask=t.stencilWriteMask,this.stencilFunc=t.stencilFunc,this.stencilRef=t.stencilRef,this.stencilFuncMask=t.stencilFuncMask,this.stencilFail=t.stencilFail,this.stencilZFail=t.stencilZFail,this.stencilZPass=t.stencilZPass,this.stencilWrite=t.stencilWrite;const e=t.clippingPlanes;let i=null;if(e!==null){const s=e.length;i=new Array(s);for(let r=0;r!==s;++r)i[r]=e[r].clone()}return this.clippingPlanes=i,this.clipIntersection=t.clipIntersection,this.clipShadows=t.clipShadows,this.shadowSide=t.shadowSide,this.colorWrite=t.colorWrite,this.precision=t.precision,this.polygonOffset=t.polygonOffset,this.polygonOffsetFactor=t.polygonOffsetFactor,this.polygonOffsetUnits=t.polygonOffsetUnits,this.dithering=t.dithering,this.alphaTest=t.alphaTest,this.alphaHash=t.alphaHash,this.alphaToCoverage=t.alphaToCoverage,this.premultipliedAlpha=t.premultipliedAlpha,this.forceSinglePass=t.forceSinglePass,this.visible=t.visible,this.toneMapped=t.toneMapped,this.userData=JSON.parse(JSON.stringify(t.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(t){t===!0&&this.version++}}class ds extends br{constructor(t){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new vt(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new gn,this.combine=Q1,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.fog=t.fog,this}}const rs=iv();function iv(){const n=new ArrayBuffer(4),t=new Float32Array(n),e=new Uint32Array(n),i=new Uint32Array(512),s=new Uint32Array(512);for(let c=0;c<256;++c){const l=c-127;l<-27?(i[c]=0,i[c|256]=32768,s[c]=24,s[c|256]=24):l<-14?(i[c]=1024>>-l-14,i[c|256]=1024>>-l-14|32768,s[c]=-l-1,s[c|256]=-l-1):l<=15?(i[c]=l+15<<10,i[c|256]=l+15<<10|32768,s[c]=13,s[c|256]=13):l<128?(i[c]=31744,i[c|256]=64512,s[c]=24,s[c|256]=24):(i[c]=31744,i[c|256]=64512,s[c]=13,s[c|256]=13)}const r=new Uint32Array(2048),a=new Uint32Array(64),o=new Uint32Array(64);for(let c=1;c<1024;++c){let l=c<<13,h=0;for(;(l&8388608)===0;)l<<=1,h-=8388608;l&=-8388609,h+=947912704,r[c]=l|h}for(let c=1024;c<2048;++c)r[c]=939524096+(c-1024<<13);for(let c=1;c<31;++c)a[c]=c<<23;a[31]=1199570944,a[32]=2147483648;for(let c=33;c<63;++c)a[c]=2147483648+(c-32<<23);a[63]=3347054592;for(let c=1;c<64;++c)c!==32&&(o[c]=1024);return{floatView:t,uint32View:e,baseTable:i,shiftTable:s,mantissaTable:r,exponentTable:a,offsetTable:o}}function sv(n){Math.abs(n)>65504&&console.warn("THREE.DataUtils.toHalfFloat(): Value out of range."),n=Qt(n,-65504,65504),rs.floatView[0]=n;const t=rs.uint32View[0],e=t>>23&511;return rs.baseTable[e]+((t&8388607)>>rs.shiftTable[e])}function rv(n){const t=n>>10;return rs.uint32View[0]=rs.mantissaTable[rs.offsetTable[t]+(n&1023)]+rs.exponentTable[t],rs.floatView[0]}class nc{static toHalfFloat(t){return sv(t)}static fromHalfFloat(t){return rv(t)}}const He=new C,ic=new ht;let av=0;class Kt{constructor(t,e,i=!1){if(Array.isArray(t))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:av++}),this.name="",this.array=t,this.itemSize=e,this.count=t!==void 0?t.length/e:0,this.normalized=i,this.usage=Tu,this.updateRanges=[],this.gpuType=Bi,this.version=0}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.name=t.name,this.array=new t.array.constructor(t.array),this.itemSize=t.itemSize,this.count=t.count,this.normalized=t.normalized,this.usage=t.usage,this.gpuType=t.gpuType,this}copyAt(t,e,i){t*=this.itemSize,i*=e.itemSize;for(let s=0,r=this.itemSize;s<r;s++)this.array[t+s]=e.array[i+s];return this}copyArray(t){return this.array.set(t),this}applyMatrix3(t){if(this.itemSize===2)for(let e=0,i=this.count;e<i;e++)ic.fromBufferAttribute(this,e),ic.applyMatrix3(t),this.setXY(e,ic.x,ic.y);else if(this.itemSize===3)for(let e=0,i=this.count;e<i;e++)He.fromBufferAttribute(this,e),He.applyMatrix3(t),this.setXYZ(e,He.x,He.y,He.z);return this}applyMatrix4(t){for(let e=0,i=this.count;e<i;e++)He.fromBufferAttribute(this,e),He.applyMatrix4(t),this.setXYZ(e,He.x,He.y,He.z);return this}applyNormalMatrix(t){for(let e=0,i=this.count;e<i;e++)He.fromBufferAttribute(this,e),He.applyNormalMatrix(t),this.setXYZ(e,He.x,He.y,He.z);return this}transformDirection(t){for(let e=0,i=this.count;e<i;e++)He.fromBufferAttribute(this,e),He.transformDirection(t),this.setXYZ(e,He.x,He.y,He.z);return this}set(t,e=0){return this.array.set(t,e),this}getComponent(t,e){let i=this.array[t*this.itemSize+e];return this.normalized&&(i=ui(i,this.array)),i}setComponent(t,e,i){return this.normalized&&(i=ge(i,this.array)),this.array[t*this.itemSize+e]=i,this}getX(t){let e=this.array[t*this.itemSize];return this.normalized&&(e=ui(e,this.array)),e}setX(t,e){return this.normalized&&(e=ge(e,this.array)),this.array[t*this.itemSize]=e,this}getY(t){let e=this.array[t*this.itemSize+1];return this.normalized&&(e=ui(e,this.array)),e}setY(t,e){return this.normalized&&(e=ge(e,this.array)),this.array[t*this.itemSize+1]=e,this}getZ(t){let e=this.array[t*this.itemSize+2];return this.normalized&&(e=ui(e,this.array)),e}setZ(t,e){return this.normalized&&(e=ge(e,this.array)),this.array[t*this.itemSize+2]=e,this}getW(t){let e=this.array[t*this.itemSize+3];return this.normalized&&(e=ui(e,this.array)),e}setW(t,e){return this.normalized&&(e=ge(e,this.array)),this.array[t*this.itemSize+3]=e,this}setXY(t,e,i){return t*=this.itemSize,this.normalized&&(e=ge(e,this.array),i=ge(i,this.array)),this.array[t+0]=e,this.array[t+1]=i,this}setXYZ(t,e,i,s){return t*=this.itemSize,this.normalized&&(e=ge(e,this.array),i=ge(i,this.array),s=ge(s,this.array)),this.array[t+0]=e,this.array[t+1]=i,this.array[t+2]=s,this}setXYZW(t,e,i,s,r){return t*=this.itemSize,this.normalized&&(e=ge(e,this.array),i=ge(i,this.array),s=ge(s,this.array),r=ge(r,this.array)),this.array[t+0]=e,this.array[t+1]=i,this.array[t+2]=s,this.array[t+3]=r,this}onUpload(t){return this.onUploadCallback=t,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const t={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(t.name=this.name),this.usage!==Tu&&(t.usage=this.usage),t}}class mp extends Kt{constructor(t,e,i){super(new Uint16Array(t),e,i)}}class gp extends Kt{constructor(t,e,i){super(new Uint32Array(t),e,i)}}class re extends Kt{constructor(t,e,i){super(new Float32Array(t),e,i)}}let ov=0;const Xn=new se,Kl=new Be,Fr=new C,Pn=new Fa,$a=new Fa,Ye=new C;class me extends Na{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:ov++}),this.uuid=mi(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(t){return Array.isArray(t)?this.index=new(fp(t)?gp:mp)(t,1):this.index=t,this}setIndirect(t){return this.indirect=t,this}getIndirect(){return this.indirect}getAttribute(t){return this.attributes[t]}setAttribute(t,e){return this.attributes[t]=e,this}deleteAttribute(t){return delete this.attributes[t],this}hasAttribute(t){return this.attributes[t]!==void 0}addGroup(t,e,i=0){this.groups.push({start:t,count:e,materialIndex:i})}clearGroups(){this.groups=[]}setDrawRange(t,e){this.drawRange.start=t,this.drawRange.count=e}applyMatrix4(t){const e=this.attributes.position;e!==void 0&&(e.applyMatrix4(t),e.needsUpdate=!0);const i=this.attributes.normal;if(i!==void 0){const r=new ne().getNormalMatrix(t);i.applyNormalMatrix(r),i.needsUpdate=!0}const s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(t),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(t){return Xn.makeRotationFromQuaternion(t),this.applyMatrix4(Xn),this}rotateX(t){return Xn.makeRotationX(t),this.applyMatrix4(Xn),this}rotateY(t){return Xn.makeRotationY(t),this.applyMatrix4(Xn),this}rotateZ(t){return Xn.makeRotationZ(t),this.applyMatrix4(Xn),this}translate(t,e,i){return Xn.makeTranslation(t,e,i),this.applyMatrix4(Xn),this}scale(t,e,i){return Xn.makeScale(t,e,i),this.applyMatrix4(Xn),this}lookAt(t){return Kl.lookAt(t),Kl.updateMatrix(),this.applyMatrix4(Kl.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Fr).negate(),this.translate(Fr.x,Fr.y,Fr.z),this}setFromPoints(t){const e=this.getAttribute("position");if(e===void 0){const i=[];for(let s=0,r=t.length;s<r;s++){const a=t[s];i.push(a.x,a.y,a.z||0)}this.setAttribute("position",new re(i,3))}else{const i=Math.min(t.length,e.count);for(let s=0;s<i;s++){const r=t[s];e.setXYZ(s,r.x,r.y,r.z||0)}t.length>e.count&&console.warn("THREE.BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),e.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new Fa);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new C(-1/0,-1/0,-1/0),new C(1/0,1/0,1/0));return}if(t!==void 0){if(this.boundingBox.setFromBufferAttribute(t),e)for(let i=0,s=e.length;i<s;i++){const r=e[i];Pn.setFromBufferAttribute(r),this.morphTargetsRelative?(Ye.addVectors(this.boundingBox.min,Pn.min),this.boundingBox.expandByPoint(Ye),Ye.addVectors(this.boundingBox.max,Pn.max),this.boundingBox.expandByPoint(Ye)):(this.boundingBox.expandByPoint(Pn.min),this.boundingBox.expandByPoint(Pn.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Mr);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new C,1/0);return}if(t){const i=this.boundingSphere.center;if(Pn.setFromBufferAttribute(t),e)for(let r=0,a=e.length;r<a;r++){const o=e[r];$a.setFromBufferAttribute(o),this.morphTargetsRelative?(Ye.addVectors(Pn.min,$a.min),Pn.expandByPoint(Ye),Ye.addVectors(Pn.max,$a.max),Pn.expandByPoint(Ye)):(Pn.expandByPoint($a.min),Pn.expandByPoint($a.max))}Pn.getCenter(i);let s=0;for(let r=0,a=t.count;r<a;r++)Ye.fromBufferAttribute(t,r),s=Math.max(s,i.distanceToSquared(Ye));if(e)for(let r=0,a=e.length;r<a;r++){const o=e[r],c=this.morphTargetsRelative;for(let l=0,h=o.count;l<h;l++)Ye.fromBufferAttribute(o,l),c&&(Fr.fromBufferAttribute(t,l),Ye.add(Fr)),s=Math.max(s,i.distanceToSquared(Ye))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const t=this.index,e=this.attributes;if(t===null||e.position===void 0||e.normal===void 0||e.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const i=e.position,s=e.normal,r=e.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new Kt(new Float32Array(4*i.count),4));const a=this.getAttribute("tangent"),o=[],c=[];for(let T=0;T<i.count;T++)o[T]=new C,c[T]=new C;const l=new C,h=new C,u=new C,d=new ht,f=new ht,p=new ht,v=new C,g=new C;function m(T,M,y){l.fromBufferAttribute(i,T),h.fromBufferAttribute(i,M),u.fromBufferAttribute(i,y),d.fromBufferAttribute(r,T),f.fromBufferAttribute(r,M),p.fromBufferAttribute(r,y),h.sub(l),u.sub(l),f.sub(d),p.sub(d);const S=1/(f.x*p.y-p.x*f.y);isFinite(S)&&(v.copy(h).multiplyScalar(p.y).addScaledVector(u,-f.y).multiplyScalar(S),g.copy(u).multiplyScalar(f.x).addScaledVector(h,-p.x).multiplyScalar(S),o[T].add(v),o[M].add(v),o[y].add(v),c[T].add(g),c[M].add(g),c[y].add(g))}let _=this.groups;_.length===0&&(_=[{start:0,count:t.count}]);for(let T=0,M=_.length;T<M;++T){const y=_[T],S=y.start,R=y.count;for(let I=S,L=S+R;I<L;I+=3)m(t.getX(I+0),t.getX(I+1),t.getX(I+2))}const x=new C,b=new C,w=new C,E=new C;function A(T){w.fromBufferAttribute(s,T),E.copy(w);const M=o[T];x.copy(M),x.sub(w.multiplyScalar(w.dot(M))).normalize(),b.crossVectors(E,M);const S=b.dot(c[T])<0?-1:1;a.setXYZW(T,x.x,x.y,x.z,S)}for(let T=0,M=_.length;T<M;++T){const y=_[T],S=y.start,R=y.count;for(let I=S,L=S+R;I<L;I+=3)A(t.getX(I+0)),A(t.getX(I+1)),A(t.getX(I+2))}}computeVertexNormals(){const t=this.index,e=this.getAttribute("position");if(e!==void 0){let i=this.getAttribute("normal");if(i===void 0)i=new Kt(new Float32Array(e.count*3),3),this.setAttribute("normal",i);else for(let d=0,f=i.count;d<f;d++)i.setXYZ(d,0,0,0);const s=new C,r=new C,a=new C,o=new C,c=new C,l=new C,h=new C,u=new C;if(t)for(let d=0,f=t.count;d<f;d+=3){const p=t.getX(d+0),v=t.getX(d+1),g=t.getX(d+2);s.fromBufferAttribute(e,p),r.fromBufferAttribute(e,v),a.fromBufferAttribute(e,g),h.subVectors(a,r),u.subVectors(s,r),h.cross(u),o.fromBufferAttribute(i,p),c.fromBufferAttribute(i,v),l.fromBufferAttribute(i,g),o.add(h),c.add(h),l.add(h),i.setXYZ(p,o.x,o.y,o.z),i.setXYZ(v,c.x,c.y,c.z),i.setXYZ(g,l.x,l.y,l.z)}else for(let d=0,f=e.count;d<f;d+=3)s.fromBufferAttribute(e,d+0),r.fromBufferAttribute(e,d+1),a.fromBufferAttribute(e,d+2),h.subVectors(a,r),u.subVectors(s,r),h.cross(u),i.setXYZ(d+0,h.x,h.y,h.z),i.setXYZ(d+1,h.x,h.y,h.z),i.setXYZ(d+2,h.x,h.y,h.z);this.normalizeNormals(),i.needsUpdate=!0}}normalizeNormals(){const t=this.attributes.normal;for(let e=0,i=t.count;e<i;e++)Ye.fromBufferAttribute(t,e),Ye.normalize(),t.setXYZ(e,Ye.x,Ye.y,Ye.z)}toNonIndexed(){function t(o,c){const l=o.array,h=o.itemSize,u=o.normalized,d=new l.constructor(c.length*h);let f=0,p=0;for(let v=0,g=c.length;v<g;v++){o.isInterleavedBufferAttribute?f=c[v]*o.data.stride+o.offset:f=c[v]*h;for(let m=0;m<h;m++)d[p++]=l[f++]}return new Kt(d,h,u)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const e=new me,i=this.index.array,s=this.attributes;for(const o in s){const c=s[o],l=t(c,i);e.setAttribute(o,l)}const r=this.morphAttributes;for(const o in r){const c=[],l=r[o];for(let h=0,u=l.length;h<u;h++){const d=l[h],f=t(d,i);c.push(f)}e.morphAttributes[o]=c}e.morphTargetsRelative=this.morphTargetsRelative;const a=this.groups;for(let o=0,c=a.length;o<c;o++){const l=a[o];e.addGroup(l.start,l.count,l.materialIndex)}return e}toJSON(){const t={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(t.uuid=this.uuid,t.type=this.type,this.name!==""&&(t.name=this.name),Object.keys(this.userData).length>0&&(t.userData=this.userData),this.parameters!==void 0){const c=this.parameters;for(const l in c)c[l]!==void 0&&(t[l]=c[l]);return t}t.data={attributes:{}};const e=this.index;e!==null&&(t.data.index={type:e.array.constructor.name,array:Array.prototype.slice.call(e.array)});const i=this.attributes;for(const c in i){const l=i[c];t.data.attributes[c]=l.toJSON(t.data)}const s={};let r=!1;for(const c in this.morphAttributes){const l=this.morphAttributes[c],h=[];for(let u=0,d=l.length;u<d;u++){const f=l[u];h.push(f.toJSON(t.data))}h.length>0&&(s[c]=h,r=!0)}r&&(t.data.morphAttributes=s,t.data.morphTargetsRelative=this.morphTargetsRelative);const a=this.groups;a.length>0&&(t.data.groups=JSON.parse(JSON.stringify(a)));const o=this.boundingSphere;return o!==null&&(t.data.boundingSphere=o.toJSON()),t}clone(){return new this.constructor().copy(this)}copy(t){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const e={};this.name=t.name;const i=t.index;i!==null&&this.setIndex(i.clone());const s=t.attributes;for(const l in s){const h=s[l];this.setAttribute(l,h.clone(e))}const r=t.morphAttributes;for(const l in r){const h=[],u=r[l];for(let d=0,f=u.length;d<f;d++)h.push(u[d].clone(e));this.morphAttributes[l]=h}this.morphTargetsRelative=t.morphTargetsRelative;const a=t.groups;for(let l=0,h=a.length;l<h;l++){const u=a[l];this.addGroup(u.start,u.count,u.materialIndex)}const o=t.boundingBox;o!==null&&(this.boundingBox=o.clone());const c=t.boundingSphere;return c!==null&&(this.boundingSphere=c.clone()),this.drawRange.start=t.drawRange.start,this.drawRange.count=t.drawRange.count,this.userData=t.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const Uf=new se,Gs=new p0,sc=new Mr,Nf=new C,rc=new C,ac=new C,oc=new C,Jl=new C,cc=new C,Ff=new C,lc=new C;class mt extends Be{constructor(t=new me,e=new ds){super(),this.isMesh=!0,this.type="Mesh",this.geometry=t,this.material=e,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),t.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=t.morphTargetInfluences.slice()),t.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},t.morphTargetDictionary)),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}updateMorphTargets(){const e=this.geometry.morphAttributes,i=Object.keys(e);if(i.length>0){const s=e[i[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=s.length;r<a;r++){const o=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}getVertexPosition(t,e){const i=this.geometry,s=i.attributes.position,r=i.morphAttributes.position,a=i.morphTargetsRelative;e.fromBufferAttribute(s,t);const o=this.morphTargetInfluences;if(r&&o){cc.set(0,0,0);for(let c=0,l=r.length;c<l;c++){const h=o[c],u=r[c];h!==0&&(Jl.fromBufferAttribute(u,t),a?cc.addScaledVector(Jl,h):cc.addScaledVector(Jl.sub(e),h))}e.add(cc)}return e}raycast(t,e){const i=this.geometry,s=this.material,r=this.matrixWorld;s!==void 0&&(i.boundingSphere===null&&i.computeBoundingSphere(),sc.copy(i.boundingSphere),sc.applyMatrix4(r),Gs.copy(t.ray).recast(t.near),!(sc.containsPoint(Gs.origin)===!1&&(Gs.intersectSphere(sc,Nf)===null||Gs.origin.distanceToSquared(Nf)>(t.far-t.near)**2))&&(Uf.copy(r).invert(),Gs.copy(t.ray).applyMatrix4(Uf),!(i.boundingBox!==null&&Gs.intersectsBox(i.boundingBox)===!1)&&this._computeIntersections(t,e,Gs)))}_computeIntersections(t,e,i){let s;const r=this.geometry,a=this.material,o=r.index,c=r.attributes.position,l=r.attributes.uv,h=r.attributes.uv1,u=r.attributes.normal,d=r.groups,f=r.drawRange;if(o!==null)if(Array.isArray(a))for(let p=0,v=d.length;p<v;p++){const g=d[p],m=a[g.materialIndex],_=Math.max(g.start,f.start),x=Math.min(o.count,Math.min(g.start+g.count,f.start+f.count));for(let b=_,w=x;b<w;b+=3){const E=o.getX(b),A=o.getX(b+1),T=o.getX(b+2);s=hc(this,m,t,i,l,h,u,E,A,T),s&&(s.faceIndex=Math.floor(b/3),s.face.materialIndex=g.materialIndex,e.push(s))}}else{const p=Math.max(0,f.start),v=Math.min(o.count,f.start+f.count);for(let g=p,m=v;g<m;g+=3){const _=o.getX(g),x=o.getX(g+1),b=o.getX(g+2);s=hc(this,a,t,i,l,h,u,_,x,b),s&&(s.faceIndex=Math.floor(g/3),e.push(s))}}else if(c!==void 0)if(Array.isArray(a))for(let p=0,v=d.length;p<v;p++){const g=d[p],m=a[g.materialIndex],_=Math.max(g.start,f.start),x=Math.min(c.count,Math.min(g.start+g.count,f.start+f.count));for(let b=_,w=x;b<w;b+=3){const E=b,A=b+1,T=b+2;s=hc(this,m,t,i,l,h,u,E,A,T),s&&(s.faceIndex=Math.floor(b/3),s.face.materialIndex=g.materialIndex,e.push(s))}}else{const p=Math.max(0,f.start),v=Math.min(c.count,f.start+f.count);for(let g=p,m=v;g<m;g+=3){const _=g,x=g+1,b=g+2;s=hc(this,a,t,i,l,h,u,_,x,b),s&&(s.faceIndex=Math.floor(g/3),e.push(s))}}}}function cv(n,t,e,i,s,r,a,o){let c;if(t.side===Tn?c=i.intersectTriangle(a,r,s,!0,o):c=i.intersectTriangle(s,r,a,t.side===Os,o),c===null)return null;lc.copy(o),lc.applyMatrix4(n.matrixWorld);const l=e.ray.origin.distanceTo(lc);return l<e.near||l>e.far?null:{distance:l,point:lc.clone(),object:n}}function hc(n,t,e,i,s,r,a,o,c,l){n.getVertexPosition(o,rc),n.getVertexPosition(c,ac),n.getVertexPosition(l,oc);const h=cv(n,t,e,i,rc,ac,oc,Ff);if(h){const u=new C;Qn.getBarycoord(Ff,rc,ac,oc,u),s&&(h.uv=Qn.getInterpolatedAttribute(s,o,c,l,u,new ht)),r&&(h.uv1=Qn.getInterpolatedAttribute(r,o,c,l,u,new ht)),a&&(h.normal=Qn.getInterpolatedAttribute(a,o,c,l,u,new C),h.normal.dot(i.direction)>0&&h.normal.multiplyScalar(-1));const d={a:o,b:c,c:l,normal:new C,materialIndex:0};Qn.getNormal(rc,ac,oc,d.normal),h.face=d,h.barycoord=u}return h}class be extends me{constructor(t=1,e=1,i=1,s=1,r=1,a=1){super(),this.type="BoxGeometry",this.parameters={width:t,height:e,depth:i,widthSegments:s,heightSegments:r,depthSegments:a};const o=this;s=Math.floor(s),r=Math.floor(r),a=Math.floor(a);const c=[],l=[],h=[],u=[];let d=0,f=0;p("z","y","x",-1,-1,i,e,t,a,r,0),p("z","y","x",1,-1,i,e,-t,a,r,1),p("x","z","y",1,1,t,i,e,s,a,2),p("x","z","y",1,-1,t,i,-e,s,a,3),p("x","y","z",1,-1,t,e,i,s,r,4),p("x","y","z",-1,-1,t,e,-i,s,r,5),this.setIndex(c),this.setAttribute("position",new re(l,3)),this.setAttribute("normal",new re(h,3)),this.setAttribute("uv",new re(u,2));function p(v,g,m,_,x,b,w,E,A,T,M){const y=b/A,S=w/T,R=b/2,I=w/2,L=E/2,D=A+1,k=T+1;let q=0,z=0;const it=new C;for(let ut=0;ut<k;ut++){const gt=ut*S-I;for(let _t=0;_t<D;_t++){const At=_t*y-R;it[v]=At*_,it[g]=gt*x,it[m]=L,l.push(it.x,it.y,it.z),it[v]=0,it[g]=0,it[m]=E>0?1:-1,h.push(it.x,it.y,it.z),u.push(_t/A),u.push(1-ut/T),q+=1}}for(let ut=0;ut<T;ut++)for(let gt=0;gt<A;gt++){const _t=d+gt+D*ut,At=d+gt+D*(ut+1),Ut=d+(gt+1)+D*(ut+1),ct=d+(gt+1)+D*ut;c.push(_t,At,ct),c.push(At,Ut,ct),z+=6}o.addGroup(f,z,M),f+=z,d+=q}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new be(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}}function Pa(n){const t={};for(const e in n){t[e]={};for(const i in n[e]){const s=n[e][i];s&&(s.isColor||s.isMatrix3||s.isMatrix4||s.isVector2||s.isVector3||s.isVector4||s.isTexture||s.isQuaternion)?s.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),t[e][i]=null):t[e][i]=s.clone():Array.isArray(s)?t[e][i]=s.slice():t[e][i]=s}}return t}function ln(n){const t={};for(let e=0;e<n.length;e++){const i=Pa(n[e]);for(const s in i)t[s]=i[s]}return t}function lv(n){const t=[];for(let e=0;e<n.length;e++)t.push(n[e].clone());return t}function vp(n){const t=n.getRenderTarget();return t===null?n.outputColorSpace:t.isXRRenderTarget===!0?t.texture.colorSpace:ue.workingColorSpace}const hv={clone:Pa,merge:ln};var uv=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,fv=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class Ze extends br{constructor(t){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=uv,this.fragmentShader=fv,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,t!==void 0&&this.setValues(t)}copy(t){return super.copy(t),this.fragmentShader=t.fragmentShader,this.vertexShader=t.vertexShader,this.uniforms=Pa(t.uniforms),this.uniformsGroups=lv(t.uniformsGroups),this.defines=Object.assign({},t.defines),this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.fog=t.fog,this.lights=t.lights,this.clipping=t.clipping,this.extensions=Object.assign({},t.extensions),this.glslVersion=t.glslVersion,this}toJSON(t){const e=super.toJSON(t);e.glslVersion=this.glslVersion,e.uniforms={};for(const s in this.uniforms){const a=this.uniforms[s].value;a&&a.isTexture?e.uniforms[s]={type:"t",value:a.toJSON(t).uuid}:a&&a.isColor?e.uniforms[s]={type:"c",value:a.getHex()}:a&&a.isVector2?e.uniforms[s]={type:"v2",value:a.toArray()}:a&&a.isVector3?e.uniforms[s]={type:"v3",value:a.toArray()}:a&&a.isVector4?e.uniforms[s]={type:"v4",value:a.toArray()}:a&&a.isMatrix3?e.uniforms[s]={type:"m3",value:a.toArray()}:a&&a.isMatrix4?e.uniforms[s]={type:"m4",value:a.toArray()}:e.uniforms[s]={value:a}}Object.keys(this.defines).length>0&&(e.defines=this.defines),e.vertexShader=this.vertexShader,e.fragmentShader=this.fragmentShader,e.lights=this.lights,e.clipping=this.clipping;const i={};for(const s in this.extensions)this.extensions[s]===!0&&(i[s]=!0);return Object.keys(i).length>0&&(e.extensions=i),e}}class xp extends Be{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new se,this.projectionMatrix=new se,this.projectionMatrixInverse=new se,this.coordinateSystem=Hi,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(t,e){return super.copy(t,e),this.matrixWorldInverse.copy(t.matrixWorldInverse),this.projectionMatrix.copy(t.projectionMatrix),this.projectionMatrixInverse.copy(t.projectionMatrixInverse),this.coordinateSystem=t.coordinateSystem,this}getWorldDirection(t){return super.getWorldDirection(t).negate()}updateMatrixWorld(t){super.updateMatrixWorld(t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(t,e){super.updateWorldMatrix(t,e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}const Ms=new C,Of=new ht,kf=new ht;class Dn extends xp{constructor(t=50,e=1,i=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=t,this.zoom=1,this.near=i,this.far=s,this.focus=10,this.aspect=e,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.fov=t.fov,this.zoom=t.zoom,this.near=t.near,this.far=t.far,this.focus=t.focus,this.aspect=t.aspect,this.view=t.view===null?null:Object.assign({},t.view),this.filmGauge=t.filmGauge,this.filmOffset=t.filmOffset,this}setFocalLength(t){const e=.5*this.getFilmHeight()/t;this.fov=La*2*Math.atan(e),this.updateProjectionMatrix()}getFocalLength(){const t=Math.tan(lo*.5*this.fov);return .5*this.getFilmHeight()/t}getEffectiveFOV(){return La*2*Math.atan(Math.tan(lo*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(t,e,i){Ms.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),e.set(Ms.x,Ms.y).multiplyScalar(-t/Ms.z),Ms.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),i.set(Ms.x,Ms.y).multiplyScalar(-t/Ms.z)}getViewSize(t,e){return this.getViewBounds(t,Of,kf),e.subVectors(kf,Of)}setViewOffset(t,e,i,s,r,a){this.aspect=t/e,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=i,this.view.offsetY=s,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=this.near;let e=t*Math.tan(lo*.5*this.fov)/this.zoom,i=2*e,s=this.aspect*i,r=-.5*s;const a=this.view;if(this.view!==null&&this.view.enabled){const c=a.fullWidth,l=a.fullHeight;r+=a.offsetX*s/c,e-=a.offsetY*i/l,s*=a.width/c,i*=a.height/l}const o=this.filmOffset;o!==0&&(r+=t*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+s,e,e-i,t,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.fov=this.fov,e.object.zoom=this.zoom,e.object.near=this.near,e.object.far=this.far,e.object.focus=this.focus,e.object.aspect=this.aspect,this.view!==null&&(e.object.view=Object.assign({},this.view)),e.object.filmGauge=this.filmGauge,e.object.filmOffset=this.filmOffset,e}}const Or=-90,kr=1;class dv extends Be{constructor(t,e,i){super(),this.type="CubeCamera",this.renderTarget=i,this.coordinateSystem=null,this.activeMipmapLevel=0;const s=new Dn(Or,kr,t,e);s.layers=this.layers,this.add(s);const r=new Dn(Or,kr,t,e);r.layers=this.layers,this.add(r);const a=new Dn(Or,kr,t,e);a.layers=this.layers,this.add(a);const o=new Dn(Or,kr,t,e);o.layers=this.layers,this.add(o);const c=new Dn(Or,kr,t,e);c.layers=this.layers,this.add(c);const l=new Dn(Or,kr,t,e);l.layers=this.layers,this.add(l)}updateCoordinateSystem(){const t=this.coordinateSystem,e=this.children.concat(),[i,s,r,a,o,c]=e;for(const l of e)this.remove(l);if(t===Hi)i.up.set(0,1,0),i.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),c.up.set(0,1,0),c.lookAt(0,0,-1);else if(t===Zc)i.up.set(0,-1,0),i.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),c.up.set(0,-1,0),c.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+t);for(const l of e)this.add(l),l.updateMatrixWorld()}update(t,e){this.parent===null&&this.updateMatrixWorld();const{renderTarget:i,activeMipmapLevel:s}=this;this.coordinateSystem!==t.coordinateSystem&&(this.coordinateSystem=t.coordinateSystem,this.updateCoordinateSystem());const[r,a,o,c,l,h]=this.children,u=t.getRenderTarget(),d=t.getActiveCubeFace(),f=t.getActiveMipmapLevel(),p=t.xr.enabled;t.xr.enabled=!1;const v=i.texture.generateMipmaps;i.texture.generateMipmaps=!1,t.setRenderTarget(i,0,s),t.render(e,r),t.setRenderTarget(i,1,s),t.render(e,a),t.setRenderTarget(i,2,s),t.render(e,o),t.setRenderTarget(i,3,s),t.render(e,c),t.setRenderTarget(i,4,s),t.render(e,l),i.texture.generateMipmaps=v,t.setRenderTarget(i,5,s),t.render(e,h),t.setRenderTarget(u,d,f),t.xr.enabled=p,i.texture.needsPMREMUpdate=!0}}class _p extends Qe{constructor(t=[],e=Aa,i,s,r,a,o,c,l,h){super(t,e,i,s,r,a,o,c,l,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(t){this.image=t}}class pv extends dn{constructor(t=1,e={}){super(t,t,e),this.isWebGLCubeRenderTarget=!0;const i={width:t,height:t,depth:1},s=[i,i,i,i,i,i];this.texture=new _p(s),this._setTextureOptions(e),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(t,e){this.texture.type=e.type,this.texture.colorSpace=e.colorSpace,this.texture.generateMipmaps=e.generateMipmaps,this.texture.minFilter=e.minFilter,this.texture.magFilter=e.magFilter;const i={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},s=new be(5,5,5),r=new Ze({name:"CubemapFromEquirect",uniforms:Pa(i.uniforms),vertexShader:i.vertexShader,fragmentShader:i.fragmentShader,side:Tn,blending:Us});r.uniforms.tEquirect.value=e;const a=new mt(s,r),o=e.minFilter;return e.minFilter===Cs&&(e.minFilter=Re),new dv(1,10,this).update(t,a),e.minFilter=o,a.geometry.dispose(),a.material.dispose(),this}clear(t,e=!0,i=!0,s=!0){const r=t.getRenderTarget();for(let a=0;a<6;a++)t.setRenderTarget(this,a),t.clear(e,i,s);t.setRenderTarget(r)}}class we extends Be{constructor(){super(),this.isGroup=!0,this.type="Group"}}const mv={type:"move"};class Ql{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new we,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new we,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new C,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new C),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new we,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new C,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new C),this._grip}dispatchEvent(t){return this._targetRay!==null&&this._targetRay.dispatchEvent(t),this._grip!==null&&this._grip.dispatchEvent(t),this._hand!==null&&this._hand.dispatchEvent(t),this}connect(t){if(t&&t.hand){const e=this._hand;if(e)for(const i of t.hand.values())this._getHandJoint(e,i)}return this.dispatchEvent({type:"connected",data:t}),this}disconnect(t){return this.dispatchEvent({type:"disconnected",data:t}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(t,e,i){let s=null,r=null,a=null;const o=this._targetRay,c=this._grip,l=this._hand;if(t&&e.session.visibilityState!=="visible-blurred"){if(l&&t.hand){a=!0;for(const v of t.hand.values()){const g=e.getJointPose(v,i),m=this._getHandJoint(l,v);g!==null&&(m.matrix.fromArray(g.transform.matrix),m.matrix.decompose(m.position,m.rotation,m.scale),m.matrixWorldNeedsUpdate=!0,m.jointRadius=g.radius),m.visible=g!==null}const h=l.joints["index-finger-tip"],u=l.joints["thumb-tip"],d=h.position.distanceTo(u.position),f=.02,p=.005;l.inputState.pinching&&d>f+p?(l.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:t.handedness,target:this})):!l.inputState.pinching&&d<=f-p&&(l.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:t.handedness,target:this}))}else c!==null&&t.gripSpace&&(r=e.getPose(t.gripSpace,i),r!==null&&(c.matrix.fromArray(r.transform.matrix),c.matrix.decompose(c.position,c.rotation,c.scale),c.matrixWorldNeedsUpdate=!0,r.linearVelocity?(c.hasLinearVelocity=!0,c.linearVelocity.copy(r.linearVelocity)):c.hasLinearVelocity=!1,r.angularVelocity?(c.hasAngularVelocity=!0,c.angularVelocity.copy(r.angularVelocity)):c.hasAngularVelocity=!1));o!==null&&(s=e.getPose(t.targetRaySpace,i),s===null&&r!==null&&(s=r),s!==null&&(o.matrix.fromArray(s.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,s.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(s.linearVelocity)):o.hasLinearVelocity=!1,s.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(s.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(mv)))}return o!==null&&(o.visible=s!==null),c!==null&&(c.visible=r!==null),l!==null&&(l.visible=a!==null),this}_getHandJoint(t,e){if(t.joints[e.jointName]===void 0){const i=new we;i.matrixAutoUpdate=!1,i.visible=!1,t.joints[e.jointName]=i,t.add(i)}return t.joints[e.jointName]}}class Mp extends Be{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new gn,this.environmentIntensity=1,this.environmentRotation=new gn,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(t,e){return super.copy(t,e),t.background!==null&&(this.background=t.background.clone()),t.environment!==null&&(this.environment=t.environment.clone()),t.fog!==null&&(this.fog=t.fog.clone()),this.backgroundBlurriness=t.backgroundBlurriness,this.backgroundIntensity=t.backgroundIntensity,this.backgroundRotation.copy(t.backgroundRotation),this.environmentIntensity=t.environmentIntensity,this.environmentRotation.copy(t.environmentRotation),t.overrideMaterial!==null&&(this.overrideMaterial=t.overrideMaterial.clone()),this.matrixAutoUpdate=t.matrixAutoUpdate,this}toJSON(t){const e=super.toJSON(t);return this.fog!==null&&(e.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(e.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(e.object.backgroundIntensity=this.backgroundIntensity),e.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(e.object.environmentIntensity=this.environmentIntensity),e.object.environmentRotation=this.environmentRotation.toArray(),e}}class gv{constructor(t,e){this.isInterleavedBuffer=!0,this.array=t,this.stride=e,this.count=t!==void 0?t.length/e:0,this.usage=Tu,this.updateRanges=[],this.version=0,this.uuid=mi()}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.array=new t.array.constructor(t.array),this.count=t.count,this.stride=t.stride,this.usage=t.usage,this}copyAt(t,e,i){t*=this.stride,i*=e.stride;for(let s=0,r=this.stride;s<r;s++)this.array[t+s]=e.array[i+s];return this}set(t,e=0){return this.array.set(t,e),this}clone(t){t.arrayBuffers===void 0&&(t.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=mi()),t.arrayBuffers[this.array.buffer._uuid]===void 0&&(t.arrayBuffers[this.array.buffer._uuid]=this.array.slice(0).buffer);const e=new this.array.constructor(t.arrayBuffers[this.array.buffer._uuid]),i=new this.constructor(e,this.stride);return i.setUsage(this.usage),i}onUpload(t){return this.onUploadCallback=t,this}toJSON(t){return t.arrayBuffers===void 0&&(t.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=mi()),t.arrayBuffers[this.array.buffer._uuid]===void 0&&(t.arrayBuffers[this.array.buffer._uuid]=Array.from(new Uint32Array(this.array.buffer))),{uuid:this.uuid,buffer:this.array.buffer._uuid,type:this.array.constructor.name,stride:this.stride}}}const on=new C;class Jc{constructor(t,e,i,s=!1){this.isInterleavedBufferAttribute=!0,this.name="",this.data=t,this.itemSize=e,this.offset=i,this.normalized=s}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(t){this.data.needsUpdate=t}applyMatrix4(t){for(let e=0,i=this.data.count;e<i;e++)on.fromBufferAttribute(this,e),on.applyMatrix4(t),this.setXYZ(e,on.x,on.y,on.z);return this}applyNormalMatrix(t){for(let e=0,i=this.count;e<i;e++)on.fromBufferAttribute(this,e),on.applyNormalMatrix(t),this.setXYZ(e,on.x,on.y,on.z);return this}transformDirection(t){for(let e=0,i=this.count;e<i;e++)on.fromBufferAttribute(this,e),on.transformDirection(t),this.setXYZ(e,on.x,on.y,on.z);return this}getComponent(t,e){let i=this.array[t*this.data.stride+this.offset+e];return this.normalized&&(i=ui(i,this.array)),i}setComponent(t,e,i){return this.normalized&&(i=ge(i,this.array)),this.data.array[t*this.data.stride+this.offset+e]=i,this}setX(t,e){return this.normalized&&(e=ge(e,this.array)),this.data.array[t*this.data.stride+this.offset]=e,this}setY(t,e){return this.normalized&&(e=ge(e,this.array)),this.data.array[t*this.data.stride+this.offset+1]=e,this}setZ(t,e){return this.normalized&&(e=ge(e,this.array)),this.data.array[t*this.data.stride+this.offset+2]=e,this}setW(t,e){return this.normalized&&(e=ge(e,this.array)),this.data.array[t*this.data.stride+this.offset+3]=e,this}getX(t){let e=this.data.array[t*this.data.stride+this.offset];return this.normalized&&(e=ui(e,this.array)),e}getY(t){let e=this.data.array[t*this.data.stride+this.offset+1];return this.normalized&&(e=ui(e,this.array)),e}getZ(t){let e=this.data.array[t*this.data.stride+this.offset+2];return this.normalized&&(e=ui(e,this.array)),e}getW(t){let e=this.data.array[t*this.data.stride+this.offset+3];return this.normalized&&(e=ui(e,this.array)),e}setXY(t,e,i){return t=t*this.data.stride+this.offset,this.normalized&&(e=ge(e,this.array),i=ge(i,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=i,this}setXYZ(t,e,i,s){return t=t*this.data.stride+this.offset,this.normalized&&(e=ge(e,this.array),i=ge(i,this.array),s=ge(s,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=i,this.data.array[t+2]=s,this}setXYZW(t,e,i,s,r){return t=t*this.data.stride+this.offset,this.normalized&&(e=ge(e,this.array),i=ge(i,this.array),s=ge(s,this.array),r=ge(r,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=i,this.data.array[t+2]=s,this.data.array[t+3]=r,this}clone(t){if(t===void 0){console.log("THREE.InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.");const e=[];for(let i=0;i<this.count;i++){const s=i*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)e.push(this.data.array[s+r])}return new Kt(new this.array.constructor(e),this.itemSize,this.normalized)}else return t.interleavedBuffers===void 0&&(t.interleavedBuffers={}),t.interleavedBuffers[this.data.uuid]===void 0&&(t.interleavedBuffers[this.data.uuid]=this.data.clone(t)),new Jc(t.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(t){if(t===void 0){console.log("THREE.InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.");const e=[];for(let i=0;i<this.count;i++){const s=i*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)e.push(this.data.array[s+r])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:e,normalized:this.normalized}}else return t.interleavedBuffers===void 0&&(t.interleavedBuffers={}),t.interleavedBuffers[this.data.uuid]===void 0&&(t.interleavedBuffers[this.data.uuid]=this.data.toJSON(t)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}}class m0 extends br{constructor(t){super(),this.isSpriteMaterial=!0,this.type="SpriteMaterial",this.color=new vt(16777215),this.map=null,this.alphaMap=null,this.rotation=0,this.sizeAttenuation=!0,this.transparent=!0,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.alphaMap=t.alphaMap,this.rotation=t.rotation,this.sizeAttenuation=t.sizeAttenuation,this.fog=t.fog,this}}let Br;const Ya=new C,Hr=new C,Vr=new C,zr=new ht,ja=new ht,bp=new se,uc=new C,Za=new C,fc=new C,Bf=new ht,th=new ht,Hf=new ht;class yp extends Be{constructor(t=new m0){if(super(),this.isSprite=!0,this.type="Sprite",Br===void 0){Br=new me;const e=new Float32Array([-.5,-.5,0,0,0,.5,-.5,0,1,0,.5,.5,0,1,1,-.5,.5,0,0,1]),i=new gv(e,5);Br.setIndex([0,1,2,0,2,3]),Br.setAttribute("position",new Jc(i,3,0,!1)),Br.setAttribute("uv",new Jc(i,2,3,!1))}this.geometry=Br,this.material=t,this.center=new ht(.5,.5),this.count=1}raycast(t,e){t.camera===null&&console.error('THREE.Sprite: "Raycaster.camera" needs to be set in order to raycast against sprites.'),Hr.setFromMatrixScale(this.matrixWorld),bp.copy(t.camera.matrixWorld),this.modelViewMatrix.multiplyMatrices(t.camera.matrixWorldInverse,this.matrixWorld),Vr.setFromMatrixPosition(this.modelViewMatrix),t.camera.isPerspectiveCamera&&this.material.sizeAttenuation===!1&&Hr.multiplyScalar(-Vr.z);const i=this.material.rotation;let s,r;i!==0&&(r=Math.cos(i),s=Math.sin(i));const a=this.center;dc(uc.set(-.5,-.5,0),Vr,a,Hr,s,r),dc(Za.set(.5,-.5,0),Vr,a,Hr,s,r),dc(fc.set(.5,.5,0),Vr,a,Hr,s,r),Bf.set(0,0),th.set(1,0),Hf.set(1,1);let o=t.ray.intersectTriangle(uc,Za,fc,!1,Ya);if(o===null&&(dc(Za.set(-.5,.5,0),Vr,a,Hr,s,r),th.set(0,1),o=t.ray.intersectTriangle(uc,fc,Za,!1,Ya),o===null))return;const c=t.ray.origin.distanceTo(Ya);c<t.near||c>t.far||e.push({distance:c,point:Ya.clone(),uv:Qn.getInterpolation(Ya,uc,Za,fc,Bf,th,Hf,new ht),face:null,object:this})}copy(t,e){return super.copy(t,e),t.center!==void 0&&this.center.copy(t.center),this.material=t.material,this}}function dc(n,t,e,i,s,r){zr.subVectors(n,e).addScalar(.5).multiply(i),s!==void 0?(ja.x=r*zr.x-s*zr.y,ja.y=s*zr.x+r*zr.y):ja.copy(zr),n.copy(t),n.x+=ja.x,n.y+=ja.y,n.applyMatrix4(bp)}const Vf=new C,zf=new de,Gf=new de,vv=new C,Wf=new se,pc=new C,eh=new Mr,Xf=new se,nh=new p0;class g0 extends mt{constructor(t,e){super(t,e),this.isSkinnedMesh=!0,this.type="SkinnedMesh",this.bindMode=xf,this.bindMatrix=new se,this.bindMatrixInverse=new se,this.boundingBox=null,this.boundingSphere=null}computeBoundingBox(){const t=this.geometry;this.boundingBox===null&&(this.boundingBox=new Fa),this.boundingBox.makeEmpty();const e=t.getAttribute("position");for(let i=0;i<e.count;i++)this.getVertexPosition(i,pc),this.boundingBox.expandByPoint(pc)}computeBoundingSphere(){const t=this.geometry;this.boundingSphere===null&&(this.boundingSphere=new Mr),this.boundingSphere.makeEmpty();const e=t.getAttribute("position");for(let i=0;i<e.count;i++)this.getVertexPosition(i,pc),this.boundingSphere.expandByPoint(pc)}copy(t,e){return super.copy(t,e),this.bindMode=t.bindMode,this.bindMatrix.copy(t.bindMatrix),this.bindMatrixInverse.copy(t.bindMatrixInverse),this.skeleton=t.skeleton,t.boundingBox!==null&&(this.boundingBox=t.boundingBox.clone()),t.boundingSphere!==null&&(this.boundingSphere=t.boundingSphere.clone()),this}raycast(t,e){const i=this.material,s=this.matrixWorld;i!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),eh.copy(this.boundingSphere),eh.applyMatrix4(s),t.ray.intersectsSphere(eh)!==!1&&(Xf.copy(s).invert(),nh.copy(t.ray).applyMatrix4(Xf),!(this.boundingBox!==null&&nh.intersectsBox(this.boundingBox)===!1)&&this._computeIntersections(t,e,nh)))}getVertexPosition(t,e){return super.getVertexPosition(t,e),this.applyBoneTransform(t,e),e}bind(t,e){this.skeleton=t,e===void 0&&(this.updateMatrixWorld(!0),this.skeleton.calculateInverses(),e=this.matrixWorld),this.bindMatrix.copy(e),this.bindMatrixInverse.copy(e).invert()}pose(){this.skeleton.pose()}normalizeSkinWeights(){const t=new de,e=this.geometry.attributes.skinWeight;for(let i=0,s=e.count;i<s;i++){t.fromBufferAttribute(e,i);const r=1/t.manhattanLength();r!==1/0?t.multiplyScalar(r):t.set(1,0,0,0),e.setXYZW(i,t.x,t.y,t.z,t.w)}}updateMatrixWorld(t){super.updateMatrixWorld(t),this.bindMode===xf?this.bindMatrixInverse.copy(this.matrixWorld).invert():this.bindMode===f2?this.bindMatrixInverse.copy(this.bindMatrix).invert():console.warn("THREE.SkinnedMesh: Unrecognized bindMode: "+this.bindMode)}applyBoneTransform(t,e){const i=this.skeleton,s=this.geometry;zf.fromBufferAttribute(s.attributes.skinIndex,t),Gf.fromBufferAttribute(s.attributes.skinWeight,t),Vf.copy(e).applyMatrix4(this.bindMatrix),e.set(0,0,0);for(let r=0;r<4;r++){const a=Gf.getComponent(r);if(a!==0){const o=zf.getComponent(r);Wf.multiplyMatrices(i.bones[o].matrixWorld,i.boneInverses[o]),e.addScaledVector(vv.copy(Vf).applyMatrix4(Wf),a)}}return e.applyMatrix4(this.bindMatrixInverse)}}class wp extends Be{constructor(){super(),this.isBone=!0,this.type="Bone"}}class xa extends Qe{constructor(t=null,e=1,i=1,s,r,a,o,c,l=Vn,h=Vn,u,d){super(null,a,o,c,l,h,s,r,u,d),this.isDataTexture=!0,this.image={data:t,width:e,height:i},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}const qf=new se,xv=new se;class v0{constructor(t=[],e=[]){this.uuid=mi(),this.bones=t.slice(0),this.boneInverses=e,this.boneMatrices=null,this.boneTexture=null,this.init()}init(){const t=this.bones,e=this.boneInverses;if(this.boneMatrices=new Float32Array(t.length*16),e.length===0)this.calculateInverses();else if(t.length!==e.length){console.warn("THREE.Skeleton: Number of inverse bone matrices does not match amount of bones."),this.boneInverses=[];for(let i=0,s=this.bones.length;i<s;i++)this.boneInverses.push(new se)}}calculateInverses(){this.boneInverses.length=0;for(let t=0,e=this.bones.length;t<e;t++){const i=new se;this.bones[t]&&i.copy(this.bones[t].matrixWorld).invert(),this.boneInverses.push(i)}}pose(){for(let t=0,e=this.bones.length;t<e;t++){const i=this.bones[t];i&&i.matrixWorld.copy(this.boneInverses[t]).invert()}for(let t=0,e=this.bones.length;t<e;t++){const i=this.bones[t];i&&(i.parent&&i.parent.isBone?(i.matrix.copy(i.parent.matrixWorld).invert(),i.matrix.multiply(i.matrixWorld)):i.matrix.copy(i.matrixWorld),i.matrix.decompose(i.position,i.quaternion,i.scale))}}update(){const t=this.bones,e=this.boneInverses,i=this.boneMatrices,s=this.boneTexture;for(let r=0,a=t.length;r<a;r++){const o=t[r]?t[r].matrixWorld:xv;qf.multiplyMatrices(o,e[r]),qf.toArray(i,r*16)}s!==null&&(s.needsUpdate=!0)}clone(){return new v0(this.bones,this.boneInverses)}computeBoneTexture(){let t=Math.sqrt(this.bones.length*4);t=Math.ceil(t/4)*4,t=Math.max(t,4);const e=new Float32Array(t*t*4);e.set(this.boneMatrices);const i=new xa(e,t,t,Je,Bi);return i.needsUpdate=!0,this.boneMatrices=e,this.boneTexture=i,this}getBoneByName(t){for(let e=0,i=this.bones.length;e<i;e++){const s=this.bones[e];if(s.name===t)return s}}dispose(){this.boneTexture!==null&&(this.boneTexture.dispose(),this.boneTexture=null)}fromJSON(t,e){this.uuid=t.uuid;for(let i=0,s=t.bones.length;i<s;i++){const r=t.bones[i];let a=e[r];a===void 0&&(console.warn("THREE.Skeleton: No bone found with UUID:",r),a=new wp),this.bones.push(a),this.boneInverses.push(new se().fromArray(t.boneInverses[i]))}return this.init(),this}toJSON(){const t={metadata:{version:4.7,type:"Skeleton",generator:"Skeleton.toJSON"},bones:[],boneInverses:[]};t.uuid=this.uuid;const e=this.bones,i=this.boneInverses;for(let s=0,r=e.length;s<r;s++){const a=e[s];t.bones.push(a.uuid);const o=i[s];t.boneInverses.push(o.toArray())}return t}}const ih=new C,_v=new C,Mv=new ne;class Js{constructor(t=new C(1,0,0),e=0){this.isPlane=!0,this.normal=t,this.constant=e}set(t,e){return this.normal.copy(t),this.constant=e,this}setComponents(t,e,i,s){return this.normal.set(t,e,i),this.constant=s,this}setFromNormalAndCoplanarPoint(t,e){return this.normal.copy(t),this.constant=-e.dot(this.normal),this}setFromCoplanarPoints(t,e,i){const s=ih.subVectors(i,e).cross(_v.subVectors(t,e)).normalize();return this.setFromNormalAndCoplanarPoint(s,t),this}copy(t){return this.normal.copy(t.normal),this.constant=t.constant,this}normalize(){const t=1/this.normal.length();return this.normal.multiplyScalar(t),this.constant*=t,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(t){return this.normal.dot(t)+this.constant}distanceToSphere(t){return this.distanceToPoint(t.center)-t.radius}projectPoint(t,e){return e.copy(t).addScaledVector(this.normal,-this.distanceToPoint(t))}intersectLine(t,e){const i=t.delta(ih),s=this.normal.dot(i);if(s===0)return this.distanceToPoint(t.start)===0?e.copy(t.start):null;const r=-(t.start.dot(this.normal)+this.constant)/s;return r<0||r>1?null:e.copy(t.start).addScaledVector(i,r)}intersectsLine(t){const e=this.distanceToPoint(t.start),i=this.distanceToPoint(t.end);return e<0&&i>0||i<0&&e>0}intersectsBox(t){return t.intersectsPlane(this)}intersectsSphere(t){return t.intersectsPlane(this)}coplanarPoint(t){return t.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(t,e){const i=e||Mv.getNormalMatrix(t),s=this.coplanarPoint(ih).applyMatrix4(t),r=this.normal.applyMatrix3(i).normalize();return this.constant=-s.dot(r),this}translate(t){return this.constant-=t.dot(this.normal),this}equals(t){return t.normal.equals(this.normal)&&t.constant===this.constant}clone(){return new this.constructor().copy(this)}}const Ws=new Mr,bv=new ht(.5,.5),mc=new C;class x0{constructor(t=new Js,e=new Js,i=new Js,s=new Js,r=new Js,a=new Js){this.planes=[t,e,i,s,r,a]}set(t,e,i,s,r,a){const o=this.planes;return o[0].copy(t),o[1].copy(e),o[2].copy(i),o[3].copy(s),o[4].copy(r),o[5].copy(a),this}copy(t){const e=this.planes;for(let i=0;i<6;i++)e[i].copy(t.planes[i]);return this}setFromProjectionMatrix(t,e=Hi,i=!1){const s=this.planes,r=t.elements,a=r[0],o=r[1],c=r[2],l=r[3],h=r[4],u=r[5],d=r[6],f=r[7],p=r[8],v=r[9],g=r[10],m=r[11],_=r[12],x=r[13],b=r[14],w=r[15];if(s[0].setComponents(l-a,f-h,m-p,w-_).normalize(),s[1].setComponents(l+a,f+h,m+p,w+_).normalize(),s[2].setComponents(l+o,f+u,m+v,w+x).normalize(),s[3].setComponents(l-o,f-u,m-v,w-x).normalize(),i)s[4].setComponents(c,d,g,b).normalize(),s[5].setComponents(l-c,f-d,m-g,w-b).normalize();else if(s[4].setComponents(l-c,f-d,m-g,w-b).normalize(),e===Hi)s[5].setComponents(l+c,f+d,m+g,w+b).normalize();else if(e===Zc)s[5].setComponents(c,d,g,b).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+e);return this}intersectsObject(t){if(t.boundingSphere!==void 0)t.boundingSphere===null&&t.computeBoundingSphere(),Ws.copy(t.boundingSphere).applyMatrix4(t.matrixWorld);else{const e=t.geometry;e.boundingSphere===null&&e.computeBoundingSphere(),Ws.copy(e.boundingSphere).applyMatrix4(t.matrixWorld)}return this.intersectsSphere(Ws)}intersectsSprite(t){Ws.center.set(0,0,0);const e=bv.distanceTo(t.center);return Ws.radius=.7071067811865476+e,Ws.applyMatrix4(t.matrixWorld),this.intersectsSphere(Ws)}intersectsSphere(t){const e=this.planes,i=t.center,s=-t.radius;for(let r=0;r<6;r++)if(e[r].distanceToPoint(i)<s)return!1;return!0}intersectsBox(t){const e=this.planes;for(let i=0;i<6;i++){const s=e[i];if(mc.x=s.normal.x>0?t.max.x:t.min.x,mc.y=s.normal.y>0?t.max.y:t.min.y,mc.z=s.normal.z>0?t.max.z:t.min.z,s.distanceToPoint(mc)<0)return!1}return!0}containsPoint(t){const e=this.planes;for(let i=0;i<6;i++)if(e[i].distanceToPoint(t)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}class yv extends br{constructor(t){super(),this.isPointsMaterial=!0,this.type="PointsMaterial",this.color=new vt(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.alphaMap=t.alphaMap,this.size=t.size,this.sizeAttenuation=t.sizeAttenuation,this.fog=t.fog,this}}const $f=new se,Au=new p0,gc=new Mr,vc=new C;class wv extends Be{constructor(t=new me,e=new yv){super(),this.isPoints=!0,this.type="Points",this.geometry=t,this.material=e,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}raycast(t,e){const i=this.geometry,s=this.matrixWorld,r=t.params.Points.threshold,a=i.drawRange;if(i.boundingSphere===null&&i.computeBoundingSphere(),gc.copy(i.boundingSphere),gc.applyMatrix4(s),gc.radius+=r,t.ray.intersectsSphere(gc)===!1)return;$f.copy(s).invert(),Au.copy(t.ray).applyMatrix4($f);const o=r/((this.scale.x+this.scale.y+this.scale.z)/3),c=o*o,l=i.index,u=i.attributes.position;if(l!==null){const d=Math.max(0,a.start),f=Math.min(l.count,a.start+a.count);for(let p=d,v=f;p<v;p++){const g=l.getX(p);vc.fromBufferAttribute(u,g),Yf(vc,g,c,s,t,e,this)}}else{const d=Math.max(0,a.start),f=Math.min(u.count,a.start+a.count);for(let p=d,v=f;p<v;p++)vc.fromBufferAttribute(u,p),Yf(vc,p,c,s,t,e,this)}}updateMorphTargets(){const e=this.geometry.morphAttributes,i=Object.keys(e);if(i.length>0){const s=e[i[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=s.length;r<a;r++){const o=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}}function Yf(n,t,e,i,s,r,a){const o=Au.distanceSqToPoint(n);if(o<e){const c=new C;Au.closestPointToPoint(n,c),c.applyMatrix4(i);const l=s.ray.origin.distanceTo(c);if(l<s.near||l>s.far)return;r.push({distance:l,distanceToRay:Math.sqrt(o),point:c,index:t,face:null,faceIndex:null,barycoord:null,object:a})}}class Sv extends Qe{constructor(t,e,i,s,r=Re,a=Re,o,c,l){super(t,e,i,s,r,a,o,c,l),this.isVideoTexture=!0,this.generateMipmaps=!1,this._requestVideoFrameCallbackId=0;const h=this;function u(){h.needsUpdate=!0,h._requestVideoFrameCallbackId=t.requestVideoFrameCallback(u)}"requestVideoFrameCallback"in t&&(this._requestVideoFrameCallbackId=t.requestVideoFrameCallback(u))}clone(){return new this.constructor(this.image).copy(this)}update(){const t=this.image;"requestVideoFrameCallback"in t===!1&&t.readyState>=t.HAVE_CURRENT_DATA&&(this.needsUpdate=!0)}dispose(){this._requestVideoFrameCallbackId!==0&&this.source.data.cancelVideoFrameCallback(this._requestVideoFrameCallbackId),super.dispose()}}class Qc extends Qe{constructor(t,e,i,s,r,a,o,c,l){super(t,e,i,s,r,a,o,c,l),this.isCanvasTexture=!0,this.needsUpdate=!0}}class Sp extends Qe{constructor(t,e,i=mr,s,r,a,o=Vn,c=Vn,l,h=_o,u=1){if(h!==_o&&h!==Mo)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");const d={width:t,height:e,depth:u};super(d,s,r,a,o,c,h,i,l),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(t){return super.copy(t),this.source=new f0(Object.assign({},t.image)),this.compareFunction=t.compareFunction,this}toJSON(t){const e=super.toJSON(t);return this.compareFunction!==null&&(e.compareFunction=this.compareFunction),e}}class Ep extends Qe{constructor(t=null){super(),this.sourceTexture=t,this.isExternalTexture=!0}copy(t){return super.copy(t),this.sourceTexture=t.sourceTexture,this}}class yo extends me{constructor(t=1,e=1,i=4,s=8,r=1){super(),this.type="CapsuleGeometry",this.parameters={radius:t,height:e,capSegments:i,radialSegments:s,heightSegments:r},e=Math.max(0,e),i=Math.max(1,Math.floor(i)),s=Math.max(3,Math.floor(s)),r=Math.max(1,Math.floor(r));const a=[],o=[],c=[],l=[],h=e/2,u=Math.PI/2*t,d=e,f=2*u+d,p=i*2+r,v=s+1,g=new C,m=new C;for(let _=0;_<=p;_++){let x=0,b=0,w=0,E=0;if(_<=i){const M=_/i,y=M*Math.PI/2;b=-h-t*Math.cos(y),w=t*Math.sin(y),E=-t*Math.cos(y),x=M*u}else if(_<=i+r){const M=(_-i)/r;b=-h+M*e,w=t,E=0,x=u+M*d}else{const M=(_-i-r)/i,y=M*Math.PI/2;b=h+t*Math.sin(y),w=t*Math.cos(y),E=t*Math.sin(y),x=u+d+M*u}const A=Math.max(0,Math.min(1,x/f));let T=0;_===0?T=.5/s:_===p&&(T=-.5/s);for(let M=0;M<=s;M++){const y=M/s,S=y*Math.PI*2,R=Math.sin(S),I=Math.cos(S);m.x=-w*I,m.y=b,m.z=w*R,o.push(m.x,m.y,m.z),g.set(-w*I,E,w*R),g.normalize(),c.push(g.x,g.y,g.z),l.push(y+T,A)}if(_>0){const M=(_-1)*v;for(let y=0;y<s;y++){const S=M+y,R=M+y+1,I=_*v+y,L=_*v+y+1;a.push(S,R,I),a.push(R,L,I)}}}this.setIndex(a),this.setAttribute("position",new re(o,3)),this.setAttribute("normal",new re(c,3)),this.setAttribute("uv",new re(l,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new yo(t.radius,t.height,t.capSegments,t.radialSegments,t.heightSegments)}}class Oa extends me{constructor(t=1,e=32,i=0,s=Math.PI*2){super(),this.type="CircleGeometry",this.parameters={radius:t,segments:e,thetaStart:i,thetaLength:s},e=Math.max(3,e);const r=[],a=[],o=[],c=[],l=new C,h=new ht;a.push(0,0,0),o.push(0,0,1),c.push(.5,.5);for(let u=0,d=3;u<=e;u++,d+=3){const f=i+u/e*s;l.x=t*Math.cos(f),l.y=t*Math.sin(f),a.push(l.x,l.y,l.z),o.push(0,0,1),h.x=(a[d]/t+1)/2,h.y=(a[d+1]/t+1)/2,c.push(h.x,h.y)}for(let u=1;u<=e;u++)r.push(u,u+1,0);this.setIndex(r),this.setAttribute("position",new re(a,3)),this.setAttribute("normal",new re(o,3)),this.setAttribute("uv",new re(c,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Oa(t.radius,t.segments,t.thetaStart,t.thetaLength)}}class An extends me{constructor(t=1,e=1,i=1,s=32,r=1,a=!1,o=0,c=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:t,radiusBottom:e,height:i,radialSegments:s,heightSegments:r,openEnded:a,thetaStart:o,thetaLength:c};const l=this;s=Math.floor(s),r=Math.floor(r);const h=[],u=[],d=[],f=[];let p=0;const v=[],g=i/2;let m=0;_(),a===!1&&(t>0&&x(!0),e>0&&x(!1)),this.setIndex(h),this.setAttribute("position",new re(u,3)),this.setAttribute("normal",new re(d,3)),this.setAttribute("uv",new re(f,2));function _(){const b=new C,w=new C;let E=0;const A=(e-t)/i;for(let T=0;T<=r;T++){const M=[],y=T/r,S=y*(e-t)+t;for(let R=0;R<=s;R++){const I=R/s,L=I*c+o,D=Math.sin(L),k=Math.cos(L);w.x=S*D,w.y=-y*i+g,w.z=S*k,u.push(w.x,w.y,w.z),b.set(D,A,k).normalize(),d.push(b.x,b.y,b.z),f.push(I,1-y),M.push(p++)}v.push(M)}for(let T=0;T<s;T++)for(let M=0;M<r;M++){const y=v[M][T],S=v[M+1][T],R=v[M+1][T+1],I=v[M][T+1];(t>0||M!==0)&&(h.push(y,S,I),E+=3),(e>0||M!==r-1)&&(h.push(S,R,I),E+=3)}l.addGroup(m,E,0),m+=E}function x(b){const w=p,E=new ht,A=new C;let T=0;const M=b===!0?t:e,y=b===!0?1:-1;for(let R=1;R<=s;R++)u.push(0,g*y,0),d.push(0,y,0),f.push(.5,.5),p++;const S=p;for(let R=0;R<=s;R++){const L=R/s*c+o,D=Math.cos(L),k=Math.sin(L);A.x=M*k,A.y=g*y,A.z=M*D,u.push(A.x,A.y,A.z),d.push(0,y,0),E.x=D*.5+.5,E.y=k*.5*y+.5,f.push(E.x,E.y),p++}for(let R=0;R<s;R++){const I=w+R,L=S+R;b===!0?h.push(L,L+1,I):h.push(L+1,L,I),T+=3}l.addGroup(m,T,b===!0?1:2),m+=T}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new An(t.radiusTop,t.radiusBottom,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}}class gi extends An{constructor(t=1,e=1,i=32,s=1,r=!1,a=0,o=Math.PI*2){super(0,t,e,i,s,r,a,o),this.type="ConeGeometry",this.parameters={radius:t,height:e,radialSegments:i,heightSegments:s,openEnded:r,thetaStart:a,thetaLength:o}}static fromJSON(t){return new gi(t.radius,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}}class Xi{constructor(){this.type="Curve",this.arcLengthDivisions=200,this.needsUpdate=!1,this.cacheArcLengths=null}getPoint(){console.warn("THREE.Curve: .getPoint() not implemented.")}getPointAt(t,e){const i=this.getUtoTmapping(t);return this.getPoint(i,e)}getPoints(t=5){const e=[];for(let i=0;i<=t;i++)e.push(this.getPoint(i/t));return e}getSpacedPoints(t=5){const e=[];for(let i=0;i<=t;i++)e.push(this.getPointAt(i/t));return e}getLength(){const t=this.getLengths();return t[t.length-1]}getLengths(t=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===t+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;const e=[];let i,s=this.getPoint(0),r=0;e.push(0);for(let a=1;a<=t;a++)i=this.getPoint(a/t),r+=i.distanceTo(s),e.push(r),s=i;return this.cacheArcLengths=e,e}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(t,e=null){const i=this.getLengths();let s=0;const r=i.length;let a;e?a=e:a=t*i[r-1];let o=0,c=r-1,l;for(;o<=c;)if(s=Math.floor(o+(c-o)/2),l=i[s]-a,l<0)o=s+1;else if(l>0)c=s-1;else{c=s;break}if(s=c,i[s]===a)return s/(r-1);const h=i[s],d=i[s+1]-h,f=(a-h)/d;return(s+f)/(r-1)}getTangent(t,e){let s=t-1e-4,r=t+1e-4;s<0&&(s=0),r>1&&(r=1);const a=this.getPoint(s),o=this.getPoint(r),c=e||(a.isVector2?new ht:new C);return c.copy(o).sub(a).normalize(),c}getTangentAt(t,e){const i=this.getUtoTmapping(t);return this.getTangent(i,e)}computeFrenetFrames(t,e=!1){const i=new C,s=[],r=[],a=[],o=new C,c=new se;for(let f=0;f<=t;f++){const p=f/t;s[f]=this.getTangentAt(p,new C)}r[0]=new C,a[0]=new C;let l=Number.MAX_VALUE;const h=Math.abs(s[0].x),u=Math.abs(s[0].y),d=Math.abs(s[0].z);h<=l&&(l=h,i.set(1,0,0)),u<=l&&(l=u,i.set(0,1,0)),d<=l&&i.set(0,0,1),o.crossVectors(s[0],i).normalize(),r[0].crossVectors(s[0],o),a[0].crossVectors(s[0],r[0]);for(let f=1;f<=t;f++){if(r[f]=r[f-1].clone(),a[f]=a[f-1].clone(),o.crossVectors(s[f-1],s[f]),o.length()>Number.EPSILON){o.normalize();const p=Math.acos(Qt(s[f-1].dot(s[f]),-1,1));r[f].applyMatrix4(c.makeRotationAxis(o,p))}a[f].crossVectors(s[f],r[f])}if(e===!0){let f=Math.acos(Qt(r[0].dot(r[t]),-1,1));f/=t,s[0].dot(o.crossVectors(r[0],r[t]))>0&&(f=-f);for(let p=1;p<=t;p++)r[p].applyMatrix4(c.makeRotationAxis(s[p],f*p)),a[p].crossVectors(s[p],r[p])}return{tangents:s,normals:r,binormals:a}}clone(){return new this.constructor().copy(this)}copy(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}toJSON(){const t={metadata:{version:4.7,type:"Curve",generator:"Curve.toJSON"}};return t.arcLengthDivisions=this.arcLengthDivisions,t.type=this.type,t}fromJSON(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}}class _0 extends Xi{constructor(t=0,e=0,i=1,s=1,r=0,a=Math.PI*2,o=!1,c=0){super(),this.isEllipseCurve=!0,this.type="EllipseCurve",this.aX=t,this.aY=e,this.xRadius=i,this.yRadius=s,this.aStartAngle=r,this.aEndAngle=a,this.aClockwise=o,this.aRotation=c}getPoint(t,e=new ht){const i=e,s=Math.PI*2;let r=this.aEndAngle-this.aStartAngle;const a=Math.abs(r)<Number.EPSILON;for(;r<0;)r+=s;for(;r>s;)r-=s;r<Number.EPSILON&&(a?r=0:r=s),this.aClockwise===!0&&!a&&(r===s?r=-s:r=r-s);const o=this.aStartAngle+t*r;let c=this.aX+this.xRadius*Math.cos(o),l=this.aY+this.yRadius*Math.sin(o);if(this.aRotation!==0){const h=Math.cos(this.aRotation),u=Math.sin(this.aRotation),d=c-this.aX,f=l-this.aY;c=d*h-f*u+this.aX,l=d*u+f*h+this.aY}return i.set(c,l)}copy(t){return super.copy(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}toJSON(){const t=super.toJSON();return t.aX=this.aX,t.aY=this.aY,t.xRadius=this.xRadius,t.yRadius=this.yRadius,t.aStartAngle=this.aStartAngle,t.aEndAngle=this.aEndAngle,t.aClockwise=this.aClockwise,t.aRotation=this.aRotation,t}fromJSON(t){return super.fromJSON(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}}class Ev extends _0{constructor(t,e,i,s,r,a){super(t,e,i,i,s,r,a),this.isArcCurve=!0,this.type="ArcCurve"}}function M0(){let n=0,t=0,e=0,i=0;function s(r,a,o,c){n=r,t=o,e=-3*r+3*a-2*o-c,i=2*r-2*a+o+c}return{initCatmullRom:function(r,a,o,c,l){s(a,o,l*(o-r),l*(c-a))},initNonuniformCatmullRom:function(r,a,o,c,l,h,u){let d=(a-r)/l-(o-r)/(l+h)+(o-a)/h,f=(o-a)/h-(c-a)/(h+u)+(c-o)/u;d*=h,f*=h,s(a,o,d,f)},calc:function(r){const a=r*r,o=a*r;return n+t*r+e*a+i*o}}}const xc=new C,sh=new M0,rh=new M0,ah=new M0;class ei extends Xi{constructor(t=[],e=!1,i="centripetal",s=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=t,this.closed=e,this.curveType=i,this.tension=s}getPoint(t,e=new C){const i=e,s=this.points,r=s.length,a=(r-(this.closed?0:1))*t;let o=Math.floor(a),c=a-o;this.closed?o+=o>0?0:(Math.floor(Math.abs(o)/r)+1)*r:c===0&&o===r-1&&(o=r-2,c=1);let l,h;this.closed||o>0?l=s[(o-1)%r]:(xc.subVectors(s[0],s[1]).add(s[0]),l=xc);const u=s[o%r],d=s[(o+1)%r];if(this.closed||o+2<r?h=s[(o+2)%r]:(xc.subVectors(s[r-1],s[r-2]).add(s[r-1]),h=xc),this.curveType==="centripetal"||this.curveType==="chordal"){const f=this.curveType==="chordal"?.5:.25;let p=Math.pow(l.distanceToSquared(u),f),v=Math.pow(u.distanceToSquared(d),f),g=Math.pow(d.distanceToSquared(h),f);v<1e-4&&(v=1),p<1e-4&&(p=v),g<1e-4&&(g=v),sh.initNonuniformCatmullRom(l.x,u.x,d.x,h.x,p,v,g),rh.initNonuniformCatmullRom(l.y,u.y,d.y,h.y,p,v,g),ah.initNonuniformCatmullRom(l.z,u.z,d.z,h.z,p,v,g)}else this.curveType==="catmullrom"&&(sh.initCatmullRom(l.x,u.x,d.x,h.x,this.tension),rh.initCatmullRom(l.y,u.y,d.y,h.y,this.tension),ah.initCatmullRom(l.z,u.z,d.z,h.z,this.tension));return i.set(sh.calc(c),rh.calc(c),ah.calc(c)),i}copy(t){super.copy(t),this.points=[];for(let e=0,i=t.points.length;e<i;e++){const s=t.points[e];this.points.push(s.clone())}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}toJSON(){const t=super.toJSON();t.points=[];for(let e=0,i=this.points.length;e<i;e++){const s=this.points[e];t.points.push(s.toArray())}return t.closed=this.closed,t.curveType=this.curveType,t.tension=this.tension,t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,i=t.points.length;e<i;e++){const s=t.points[e];this.points.push(new C().fromArray(s))}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}}function jf(n,t,e,i,s){const r=(i-t)*.5,a=(s-e)*.5,o=n*n,c=n*o;return(2*e-2*i+r+a)*c+(-3*e+3*i-2*r-a)*o+r*n+e}function Tv(n,t){const e=1-n;return e*e*t}function Av(n,t){return 2*(1-n)*n*t}function Rv(n,t){return n*n*t}function uo(n,t,e,i){return Tv(n,t)+Av(n,e)+Rv(n,i)}function Cv(n,t){const e=1-n;return e*e*e*t}function Lv(n,t){const e=1-n;return 3*e*e*n*t}function Pv(n,t){return 3*(1-n)*n*n*t}function Iv(n,t){return n*n*n*t}function fo(n,t,e,i,s){return Cv(n,t)+Lv(n,e)+Pv(n,i)+Iv(n,s)}class Tp extends Xi{constructor(t=new ht,e=new ht,i=new ht,s=new ht){super(),this.isCubicBezierCurve=!0,this.type="CubicBezierCurve",this.v0=t,this.v1=e,this.v2=i,this.v3=s}getPoint(t,e=new ht){const i=e,s=this.v0,r=this.v1,a=this.v2,o=this.v3;return i.set(fo(t,s.x,r.x,a.x,o.x),fo(t,s.y,r.y,a.y,o.y)),i}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}}class Dv extends Xi{constructor(t=new C,e=new C,i=new C,s=new C){super(),this.isCubicBezierCurve3=!0,this.type="CubicBezierCurve3",this.v0=t,this.v1=e,this.v2=i,this.v3=s}getPoint(t,e=new C){const i=e,s=this.v0,r=this.v1,a=this.v2,o=this.v3;return i.set(fo(t,s.x,r.x,a.x,o.x),fo(t,s.y,r.y,a.y,o.y),fo(t,s.z,r.z,a.z,o.z)),i}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}}class Ap extends Xi{constructor(t=new ht,e=new ht){super(),this.isLineCurve=!0,this.type="LineCurve",this.v1=t,this.v2=e}getPoint(t,e=new ht){const i=e;return t===1?i.copy(this.v2):(i.copy(this.v2).sub(this.v1),i.multiplyScalar(t).add(this.v1)),i}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new ht){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class Uv extends Xi{constructor(t=new C,e=new C){super(),this.isLineCurve3=!0,this.type="LineCurve3",this.v1=t,this.v2=e}getPoint(t,e=new C){const i=e;return t===1?i.copy(this.v2):(i.copy(this.v2).sub(this.v1),i.multiplyScalar(t).add(this.v1)),i}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new C){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class Rp extends Xi{constructor(t=new ht,e=new ht,i=new ht){super(),this.isQuadraticBezierCurve=!0,this.type="QuadraticBezierCurve",this.v0=t,this.v1=e,this.v2=i}getPoint(t,e=new ht){const i=e,s=this.v0,r=this.v1,a=this.v2;return i.set(uo(t,s.x,r.x,a.x),uo(t,s.y,r.y,a.y)),i}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class Cp extends Xi{constructor(t=new C,e=new C,i=new C){super(),this.isQuadraticBezierCurve3=!0,this.type="QuadraticBezierCurve3",this.v0=t,this.v1=e,this.v2=i}getPoint(t,e=new C){const i=e,s=this.v0,r=this.v1,a=this.v2;return i.set(uo(t,s.x,r.x,a.x),uo(t,s.y,r.y,a.y),uo(t,s.z,r.z,a.z)),i}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class Lp extends Xi{constructor(t=[]){super(),this.isSplineCurve=!0,this.type="SplineCurve",this.points=t}getPoint(t,e=new ht){const i=e,s=this.points,r=(s.length-1)*t,a=Math.floor(r),o=r-a,c=s[a===0?a:a-1],l=s[a],h=s[a>s.length-2?s.length-1:a+1],u=s[a>s.length-3?s.length-1:a+2];return i.set(jf(o,c.x,l.x,h.x,u.x),jf(o,c.y,l.y,h.y,u.y)),i}copy(t){super.copy(t),this.points=[];for(let e=0,i=t.points.length;e<i;e++){const s=t.points[e];this.points.push(s.clone())}return this}toJSON(){const t=super.toJSON();t.points=[];for(let e=0,i=this.points.length;e<i;e++){const s=this.points[e];t.points.push(s.toArray())}return t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,i=t.points.length;e<i;e++){const s=t.points[e];this.points.push(new ht().fromArray(s))}return this}}var tl=Object.freeze({__proto__:null,ArcCurve:Ev,CatmullRomCurve3:ei,CubicBezierCurve:Tp,CubicBezierCurve3:Dv,EllipseCurve:_0,LineCurve:Ap,LineCurve3:Uv,QuadraticBezierCurve:Rp,QuadraticBezierCurve3:Cp,SplineCurve:Lp});class Nv extends Xi{constructor(){super(),this.type="CurvePath",this.curves=[],this.autoClose=!1}add(t){this.curves.push(t)}closePath(){const t=this.curves[0].getPoint(0),e=this.curves[this.curves.length-1].getPoint(1);if(!t.equals(e)){const i=t.isVector2===!0?"LineCurve":"LineCurve3";this.curves.push(new tl[i](e,t))}return this}getPoint(t,e){const i=t*this.getLength(),s=this.getCurveLengths();let r=0;for(;r<s.length;){if(s[r]>=i){const a=s[r]-i,o=this.curves[r],c=o.getLength(),l=c===0?0:1-a/c;return o.getPointAt(l,e)}r++}return null}getLength(){const t=this.getCurveLengths();return t[t.length-1]}updateArcLengths(){this.needsUpdate=!0,this.cacheLengths=null,this.getCurveLengths()}getCurveLengths(){if(this.cacheLengths&&this.cacheLengths.length===this.curves.length)return this.cacheLengths;const t=[];let e=0;for(let i=0,s=this.curves.length;i<s;i++)e+=this.curves[i].getLength(),t.push(e);return this.cacheLengths=t,t}getSpacedPoints(t=40){const e=[];for(let i=0;i<=t;i++)e.push(this.getPoint(i/t));return this.autoClose&&e.push(e[0]),e}getPoints(t=12){const e=[];let i;for(let s=0,r=this.curves;s<r.length;s++){const a=r[s],o=a.isEllipseCurve?t*2:a.isLineCurve||a.isLineCurve3?1:a.isSplineCurve?t*a.points.length:t,c=a.getPoints(o);for(let l=0;l<c.length;l++){const h=c[l];i&&i.equals(h)||(e.push(h),i=h)}}return this.autoClose&&e.length>1&&!e[e.length-1].equals(e[0])&&e.push(e[0]),e}copy(t){super.copy(t),this.curves=[];for(let e=0,i=t.curves.length;e<i;e++){const s=t.curves[e];this.curves.push(s.clone())}return this.autoClose=t.autoClose,this}toJSON(){const t=super.toJSON();t.autoClose=this.autoClose,t.curves=[];for(let e=0,i=this.curves.length;e<i;e++){const s=this.curves[e];t.curves.push(s.toJSON())}return t}fromJSON(t){super.fromJSON(t),this.autoClose=t.autoClose,this.curves=[];for(let e=0,i=t.curves.length;e<i;e++){const s=t.curves[e];this.curves.push(new tl[s.type]().fromJSON(s))}return this}}class Zf extends Nv{constructor(t){super(),this.type="Path",this.currentPoint=new ht,t&&this.setFromPoints(t)}setFromPoints(t){this.moveTo(t[0].x,t[0].y);for(let e=1,i=t.length;e<i;e++)this.lineTo(t[e].x,t[e].y);return this}moveTo(t,e){return this.currentPoint.set(t,e),this}lineTo(t,e){const i=new Ap(this.currentPoint.clone(),new ht(t,e));return this.curves.push(i),this.currentPoint.set(t,e),this}quadraticCurveTo(t,e,i,s){const r=new Rp(this.currentPoint.clone(),new ht(t,e),new ht(i,s));return this.curves.push(r),this.currentPoint.set(i,s),this}bezierCurveTo(t,e,i,s,r,a){const o=new Tp(this.currentPoint.clone(),new ht(t,e),new ht(i,s),new ht(r,a));return this.curves.push(o),this.currentPoint.set(r,a),this}splineThru(t){const e=[this.currentPoint.clone()].concat(t),i=new Lp(e);return this.curves.push(i),this.currentPoint.copy(t[t.length-1]),this}arc(t,e,i,s,r,a){const o=this.currentPoint.x,c=this.currentPoint.y;return this.absarc(t+o,e+c,i,s,r,a),this}absarc(t,e,i,s,r,a){return this.absellipse(t,e,i,i,s,r,a),this}ellipse(t,e,i,s,r,a,o,c){const l=this.currentPoint.x,h=this.currentPoint.y;return this.absellipse(t+l,e+h,i,s,r,a,o,c),this}absellipse(t,e,i,s,r,a,o,c){const l=new _0(t,e,i,s,r,a,o,c);if(this.curves.length>0){const u=l.getPoint(0);u.equals(this.currentPoint)||this.lineTo(u.x,u.y)}this.curves.push(l);const h=l.getPoint(1);return this.currentPoint.copy(h),this}copy(t){return super.copy(t),this.currentPoint.copy(t.currentPoint),this}toJSON(){const t=super.toJSON();return t.currentPoint=this.currentPoint.toArray(),t}fromJSON(t){return super.fromJSON(t),this.currentPoint.fromArray(t.currentPoint),this}}class b0 extends Zf{constructor(t){super(t),this.uuid=mi(),this.type="Shape",this.holes=[]}getPointsHoles(t){const e=[];for(let i=0,s=this.holes.length;i<s;i++)e[i]=this.holes[i].getPoints(t);return e}extractPoints(t){return{shape:this.getPoints(t),holes:this.getPointsHoles(t)}}copy(t){super.copy(t),this.holes=[];for(let e=0,i=t.holes.length;e<i;e++){const s=t.holes[e];this.holes.push(s.clone())}return this}toJSON(){const t=super.toJSON();t.uuid=this.uuid,t.holes=[];for(let e=0,i=this.holes.length;e<i;e++){const s=this.holes[e];t.holes.push(s.toJSON())}return t}fromJSON(t){super.fromJSON(t),this.uuid=t.uuid,this.holes=[];for(let e=0,i=t.holes.length;e<i;e++){const s=t.holes[e];this.holes.push(new Zf().fromJSON(s))}return this}}function Fv(n,t,e=2){const i=t&&t.length,s=i?t[0]*e:n.length;let r=Pp(n,0,s,e,!0);const a=[];if(!r||r.next===r.prev)return a;let o,c,l;if(i&&(r=Vv(n,t,r,e)),n.length>80*e){o=1/0,c=1/0;let h=-1/0,u=-1/0;for(let d=e;d<s;d+=e){const f=n[d],p=n[d+1];f<o&&(o=f),p<c&&(c=p),f>h&&(h=f),p>u&&(u=p)}l=Math.max(h-o,u-c),l=l!==0?32767/l:0}return wo(r,a,e,o,c,l,0),a}function Pp(n,t,e,i,s){let r;if(s===Jv(n,t,e,i)>0)for(let a=t;a<e;a+=i)r=Kf(a/i|0,n[a],n[a+1],r);else for(let a=e-i;a>=t;a-=i)r=Kf(a/i|0,n[a],n[a+1],r);return r&&Ia(r,r.next)&&(Eo(r),r=r.next),r}function vr(n,t){if(!n)return n;t||(t=n);let e=n,i;do if(i=!1,!e.steiner&&(Ia(e,e.next)||Fe(e.prev,e,e.next)===0)){if(Eo(e),e=t=e.prev,e===e.next)break;i=!0}else e=e.next;while(i||e!==t);return t}function wo(n,t,e,i,s,r,a){if(!n)return;!a&&r&&qv(n,i,s,r);let o=n;for(;n.prev!==n.next;){const c=n.prev,l=n.next;if(r?kv(n,i,s,r):Ov(n)){t.push(c.i,n.i,l.i),Eo(n),n=l.next,o=l.next;continue}if(n=l,n===o){a?a===1?(n=Bv(vr(n),t),wo(n,t,e,i,s,r,2)):a===2&&Hv(n,t,e,i,s,r):wo(vr(n),t,e,i,s,r,1);break}}}function Ov(n){const t=n.prev,e=n,i=n.next;if(Fe(t,e,i)>=0)return!1;const s=t.x,r=e.x,a=i.x,o=t.y,c=e.y,l=i.y,h=Math.min(s,r,a),u=Math.min(o,c,l),d=Math.max(s,r,a),f=Math.max(o,c,l);let p=i.next;for(;p!==t;){if(p.x>=h&&p.x<=d&&p.y>=u&&p.y<=f&&ao(s,o,r,c,a,l,p.x,p.y)&&Fe(p.prev,p,p.next)>=0)return!1;p=p.next}return!0}function kv(n,t,e,i){const s=n.prev,r=n,a=n.next;if(Fe(s,r,a)>=0)return!1;const o=s.x,c=r.x,l=a.x,h=s.y,u=r.y,d=a.y,f=Math.min(o,c,l),p=Math.min(h,u,d),v=Math.max(o,c,l),g=Math.max(h,u,d),m=Ru(f,p,t,e,i),_=Ru(v,g,t,e,i);let x=n.prevZ,b=n.nextZ;for(;x&&x.z>=m&&b&&b.z<=_;){if(x.x>=f&&x.x<=v&&x.y>=p&&x.y<=g&&x!==s&&x!==a&&ao(o,h,c,u,l,d,x.x,x.y)&&Fe(x.prev,x,x.next)>=0||(x=x.prevZ,b.x>=f&&b.x<=v&&b.y>=p&&b.y<=g&&b!==s&&b!==a&&ao(o,h,c,u,l,d,b.x,b.y)&&Fe(b.prev,b,b.next)>=0))return!1;b=b.nextZ}for(;x&&x.z>=m;){if(x.x>=f&&x.x<=v&&x.y>=p&&x.y<=g&&x!==s&&x!==a&&ao(o,h,c,u,l,d,x.x,x.y)&&Fe(x.prev,x,x.next)>=0)return!1;x=x.prevZ}for(;b&&b.z<=_;){if(b.x>=f&&b.x<=v&&b.y>=p&&b.y<=g&&b!==s&&b!==a&&ao(o,h,c,u,l,d,b.x,b.y)&&Fe(b.prev,b,b.next)>=0)return!1;b=b.nextZ}return!0}function Bv(n,t){let e=n;do{const i=e.prev,s=e.next.next;!Ia(i,s)&&Dp(i,e,e.next,s)&&So(i,s)&&So(s,i)&&(t.push(i.i,e.i,s.i),Eo(e),Eo(e.next),e=n=s),e=e.next}while(e!==n);return vr(e)}function Hv(n,t,e,i,s,r){let a=n;do{let o=a.next.next;for(;o!==a.prev;){if(a.i!==o.i&&jv(a,o)){let c=Up(a,o);a=vr(a,a.next),c=vr(c,c.next),wo(a,t,e,i,s,r,0),wo(c,t,e,i,s,r,0);return}o=o.next}a=a.next}while(a!==n)}function Vv(n,t,e,i){const s=[];for(let r=0,a=t.length;r<a;r++){const o=t[r]*i,c=r<a-1?t[r+1]*i:n.length,l=Pp(n,o,c,i,!1);l===l.next&&(l.steiner=!0),s.push(Yv(l))}s.sort(zv);for(let r=0;r<s.length;r++)e=Gv(s[r],e);return e}function zv(n,t){let e=n.x-t.x;if(e===0&&(e=n.y-t.y,e===0)){const i=(n.next.y-n.y)/(n.next.x-n.x),s=(t.next.y-t.y)/(t.next.x-t.x);e=i-s}return e}function Gv(n,t){const e=Wv(n,t);if(!e)return t;const i=Up(e,n);return vr(i,i.next),vr(e,e.next)}function Wv(n,t){let e=t;const i=n.x,s=n.y;let r=-1/0,a;if(Ia(n,e))return e;do{if(Ia(n,e.next))return e.next;if(s<=e.y&&s>=e.next.y&&e.next.y!==e.y){const u=e.x+(s-e.y)*(e.next.x-e.x)/(e.next.y-e.y);if(u<=i&&u>r&&(r=u,a=e.x<e.next.x?e:e.next,u===i))return a}e=e.next}while(e!==t);if(!a)return null;const o=a,c=a.x,l=a.y;let h=1/0;e=a;do{if(i>=e.x&&e.x>=c&&i!==e.x&&Ip(s<l?i:r,s,c,l,s<l?r:i,s,e.x,e.y)){const u=Math.abs(s-e.y)/(i-e.x);So(e,n)&&(u<h||u===h&&(e.x>a.x||e.x===a.x&&Xv(a,e)))&&(a=e,h=u)}e=e.next}while(e!==o);return a}function Xv(n,t){return Fe(n.prev,n,t.prev)<0&&Fe(t.next,n,n.next)<0}function qv(n,t,e,i){let s=n;do s.z===0&&(s.z=Ru(s.x,s.y,t,e,i)),s.prevZ=s.prev,s.nextZ=s.next,s=s.next;while(s!==n);s.prevZ.nextZ=null,s.prevZ=null,$v(s)}function $v(n){let t,e=1;do{let i=n,s;n=null;let r=null;for(t=0;i;){t++;let a=i,o=0;for(let l=0;l<e&&(o++,a=a.nextZ,!!a);l++);let c=e;for(;o>0||c>0&&a;)o!==0&&(c===0||!a||i.z<=a.z)?(s=i,i=i.nextZ,o--):(s=a,a=a.nextZ,c--),r?r.nextZ=s:n=s,s.prevZ=r,r=s;i=a}r.nextZ=null,e*=2}while(t>1);return n}function Ru(n,t,e,i,s){return n=(n-e)*s|0,t=(t-i)*s|0,n=(n|n<<8)&16711935,n=(n|n<<4)&252645135,n=(n|n<<2)&858993459,n=(n|n<<1)&1431655765,t=(t|t<<8)&16711935,t=(t|t<<4)&252645135,t=(t|t<<2)&858993459,t=(t|t<<1)&1431655765,n|t<<1}function Yv(n){let t=n,e=n;do(t.x<e.x||t.x===e.x&&t.y<e.y)&&(e=t),t=t.next;while(t!==n);return e}function Ip(n,t,e,i,s,r,a,o){return(s-a)*(t-o)>=(n-a)*(r-o)&&(n-a)*(i-o)>=(e-a)*(t-o)&&(e-a)*(r-o)>=(s-a)*(i-o)}function ao(n,t,e,i,s,r,a,o){return!(n===a&&t===o)&&Ip(n,t,e,i,s,r,a,o)}function jv(n,t){return n.next.i!==t.i&&n.prev.i!==t.i&&!Zv(n,t)&&(So(n,t)&&So(t,n)&&Kv(n,t)&&(Fe(n.prev,n,t.prev)||Fe(n,t.prev,t))||Ia(n,t)&&Fe(n.prev,n,n.next)>0&&Fe(t.prev,t,t.next)>0)}function Fe(n,t,e){return(t.y-n.y)*(e.x-t.x)-(t.x-n.x)*(e.y-t.y)}function Ia(n,t){return n.x===t.x&&n.y===t.y}function Dp(n,t,e,i){const s=Mc(Fe(n,t,e)),r=Mc(Fe(n,t,i)),a=Mc(Fe(e,i,n)),o=Mc(Fe(e,i,t));return!!(s!==r&&a!==o||s===0&&_c(n,e,t)||r===0&&_c(n,i,t)||a===0&&_c(e,n,i)||o===0&&_c(e,t,i))}function _c(n,t,e){return t.x<=Math.max(n.x,e.x)&&t.x>=Math.min(n.x,e.x)&&t.y<=Math.max(n.y,e.y)&&t.y>=Math.min(n.y,e.y)}function Mc(n){return n>0?1:n<0?-1:0}function Zv(n,t){let e=n;do{if(e.i!==n.i&&e.next.i!==n.i&&e.i!==t.i&&e.next.i!==t.i&&Dp(e,e.next,n,t))return!0;e=e.next}while(e!==n);return!1}function So(n,t){return Fe(n.prev,n,n.next)<0?Fe(n,t,n.next)>=0&&Fe(n,n.prev,t)>=0:Fe(n,t,n.prev)<0||Fe(n,n.next,t)<0}function Kv(n,t){let e=n,i=!1;const s=(n.x+t.x)/2,r=(n.y+t.y)/2;do e.y>r!=e.next.y>r&&e.next.y!==e.y&&s<(e.next.x-e.x)*(r-e.y)/(e.next.y-e.y)+e.x&&(i=!i),e=e.next;while(e!==n);return i}function Up(n,t){const e=Cu(n.i,n.x,n.y),i=Cu(t.i,t.x,t.y),s=n.next,r=t.prev;return n.next=t,t.prev=n,e.next=s,s.prev=e,i.next=e,e.prev=i,r.next=i,i.prev=r,i}function Kf(n,t,e,i){const s=Cu(n,t,e);return i?(s.next=i.next,s.prev=i,i.next.prev=s,i.next=s):(s.prev=s,s.next=s),s}function Eo(n){n.next.prev=n.prev,n.prev.next=n.next,n.prevZ&&(n.prevZ.nextZ=n.nextZ),n.nextZ&&(n.nextZ.prevZ=n.prevZ)}function Cu(n,t,e){return{i:n,x:t,y:e,prev:null,next:null,z:0,prevZ:null,nextZ:null,steiner:!1}}function Jv(n,t,e,i){let s=0;for(let r=t,a=e-i;r<e;r+=i)s+=(n[a]-n[r])*(n[r+1]+n[a+1]),a=r;return s}class Qv{static triangulate(t,e,i=2){return Fv(t,e,i)}}class ca{static area(t){const e=t.length;let i=0;for(let s=e-1,r=0;r<e;s=r++)i+=t[s].x*t[r].y-t[r].x*t[s].y;return i*.5}static isClockWise(t){return ca.area(t)<0}static triangulateShape(t,e){const i=[],s=[],r=[];Jf(t),Qf(i,t);let a=t.length;e.forEach(Jf);for(let c=0;c<e.length;c++)s.push(a),a+=e[c].length,Qf(i,e[c]);const o=Qv.triangulate(i,s);for(let c=0;c<o.length;c+=3)r.push(o.slice(c,c+3));return r}}function Jf(n){const t=n.length;t>2&&n[t-1].equals(n[0])&&n.pop()}function Qf(n,t){for(let e=0;e<t.length;e++)n.push(t[e].x),n.push(t[e].y)}class bl extends me{constructor(t=new b0([new ht(.5,.5),new ht(-.5,.5),new ht(-.5,-.5),new ht(.5,-.5)]),e={}){super(),this.type="ExtrudeGeometry",this.parameters={shapes:t,options:e},t=Array.isArray(t)?t:[t];const i=this,s=[],r=[];for(let o=0,c=t.length;o<c;o++){const l=t[o];a(l)}this.setAttribute("position",new re(s,3)),this.setAttribute("uv",new re(r,2)),this.computeVertexNormals();function a(o){const c=[],l=e.curveSegments!==void 0?e.curveSegments:12,h=e.steps!==void 0?e.steps:1,u=e.depth!==void 0?e.depth:1;let d=e.bevelEnabled!==void 0?e.bevelEnabled:!0,f=e.bevelThickness!==void 0?e.bevelThickness:.2,p=e.bevelSize!==void 0?e.bevelSize:f-.1,v=e.bevelOffset!==void 0?e.bevelOffset:0,g=e.bevelSegments!==void 0?e.bevelSegments:3;const m=e.extrudePath,_=e.UVGenerator!==void 0?e.UVGenerator:tx;let x,b=!1,w,E,A,T;m&&(x=m.getSpacedPoints(h),b=!0,d=!1,w=m.computeFrenetFrames(h,!1),E=new C,A=new C,T=new C),d||(g=0,f=0,p=0,v=0);const M=o.extractPoints(l);let y=M.shape;const S=M.holes;if(!ca.isClockWise(y)){y=y.reverse();for(let Q=0,Z=S.length;Q<Z;Q++){const et=S[Q];ca.isClockWise(et)&&(S[Q]=et.reverse())}}function I(Q){const et=10000000000000001e-36;let ot=Q[0];for(let pt=1;pt<=Q.length;pt++){const Mt=pt%Q.length,yt=Q[Mt],Jt=yt.x-ot.x,Yt=yt.y-ot.y,F=Jt*Jt+Yt*Yt,P=Math.max(Math.abs(yt.x),Math.abs(yt.y),Math.abs(ot.x),Math.abs(ot.y)),j=et*P*P;if(F<=j){Q.splice(Mt,1),pt--;continue}ot=yt}}I(y),S.forEach(I);const L=S.length,D=y;for(let Q=0;Q<L;Q++){const Z=S[Q];y=y.concat(Z)}function k(Q,Z,et){return Z||console.error("THREE.ExtrudeGeometry: vec does not exist"),Q.clone().addScaledVector(Z,et)}const q=y.length;function z(Q,Z,et){let ot,pt,Mt;const yt=Q.x-Z.x,Jt=Q.y-Z.y,Yt=et.x-Q.x,F=et.y-Q.y,P=yt*yt+Jt*Jt,j=yt*F-Jt*Yt;if(Math.abs(j)>Number.EPSILON){const lt=Math.sqrt(P),bt=Math.sqrt(Yt*Yt+F*F),dt=Z.x-Jt/lt,Vt=Z.y+yt/lt,Rt=et.x-F/bt,kt=et.y+Yt/bt,Bt=((Rt-dt)*F-(kt-Vt)*Yt)/(yt*F-Jt*Yt);ot=dt+yt*Bt-Q.x,pt=Vt+Jt*Bt-Q.y;const wt=ot*ot+pt*pt;if(wt<=2)return new ht(ot,pt);Mt=Math.sqrt(wt/2)}else{let lt=!1;yt>Number.EPSILON?Yt>Number.EPSILON&&(lt=!0):yt<-Number.EPSILON?Yt<-Number.EPSILON&&(lt=!0):Math.sign(Jt)===Math.sign(F)&&(lt=!0),lt?(ot=-Jt,pt=yt,Mt=Math.sqrt(P)):(ot=yt,pt=Jt,Mt=Math.sqrt(P/2))}return new ht(ot/Mt,pt/Mt)}const it=[];for(let Q=0,Z=D.length,et=Z-1,ot=Q+1;Q<Z;Q++,et++,ot++)et===Z&&(et=0),ot===Z&&(ot=0),it[Q]=z(D[Q],D[et],D[ot]);const ut=[];let gt,_t=it.concat();for(let Q=0,Z=L;Q<Z;Q++){const et=S[Q];gt=[];for(let ot=0,pt=et.length,Mt=pt-1,yt=ot+1;ot<pt;ot++,Mt++,yt++)Mt===pt&&(Mt=0),yt===pt&&(yt=0),gt[ot]=z(et[ot],et[Mt],et[yt]);ut.push(gt),_t=_t.concat(gt)}let At;if(g===0)At=ca.triangulateShape(D,S);else{const Q=[],Z=[];for(let et=0;et<g;et++){const ot=et/g,pt=f*Math.cos(ot*Math.PI/2),Mt=p*Math.sin(ot*Math.PI/2)+v;for(let yt=0,Jt=D.length;yt<Jt;yt++){const Yt=k(D[yt],it[yt],Mt);W(Yt.x,Yt.y,-pt),ot===0&&Q.push(Yt)}for(let yt=0,Jt=L;yt<Jt;yt++){const Yt=S[yt];gt=ut[yt];const F=[];for(let P=0,j=Yt.length;P<j;P++){const lt=k(Yt[P],gt[P],Mt);W(lt.x,lt.y,-pt),ot===0&&F.push(lt)}ot===0&&Z.push(F)}}At=ca.triangulateShape(Q,Z)}const Ut=At.length,ct=p+v;for(let Q=0;Q<q;Q++){const Z=d?k(y[Q],_t[Q],ct):y[Q];b?(A.copy(w.normals[0]).multiplyScalar(Z.x),E.copy(w.binormals[0]).multiplyScalar(Z.y),T.copy(x[0]).add(A).add(E),W(T.x,T.y,T.z)):W(Z.x,Z.y,0)}for(let Q=1;Q<=h;Q++)for(let Z=0;Z<q;Z++){const et=d?k(y[Z],_t[Z],ct):y[Z];b?(A.copy(w.normals[Q]).multiplyScalar(et.x),E.copy(w.binormals[Q]).multiplyScalar(et.y),T.copy(x[Q]).add(A).add(E),W(T.x,T.y,T.z)):W(et.x,et.y,u/h*Q)}for(let Q=g-1;Q>=0;Q--){const Z=Q/g,et=f*Math.cos(Z*Math.PI/2),ot=p*Math.sin(Z*Math.PI/2)+v;for(let pt=0,Mt=D.length;pt<Mt;pt++){const yt=k(D[pt],it[pt],ot);W(yt.x,yt.y,u+et)}for(let pt=0,Mt=S.length;pt<Mt;pt++){const yt=S[pt];gt=ut[pt];for(let Jt=0,Yt=yt.length;Jt<Yt;Jt++){const F=k(yt[Jt],gt[Jt],ot);b?W(F.x,F.y+x[h-1].y,x[h-1].x+et):W(F.x,F.y,u+et)}}}G(),J();function G(){const Q=s.length/3;if(d){let Z=0,et=q*Z;for(let ot=0;ot<Ut;ot++){const pt=At[ot];V(pt[2]+et,pt[1]+et,pt[0]+et)}Z=h+g*2,et=q*Z;for(let ot=0;ot<Ut;ot++){const pt=At[ot];V(pt[0]+et,pt[1]+et,pt[2]+et)}}else{for(let Z=0;Z<Ut;Z++){const et=At[Z];V(et[2],et[1],et[0])}for(let Z=0;Z<Ut;Z++){const et=At[Z];V(et[0]+q*h,et[1]+q*h,et[2]+q*h)}}i.addGroup(Q,s.length/3-Q,0)}function J(){const Q=s.length/3;let Z=0;H(D,Z),Z+=D.length;for(let et=0,ot=S.length;et<ot;et++){const pt=S[et];H(pt,Z),Z+=pt.length}i.addGroup(Q,s.length/3-Q,1)}function H(Q,Z){let et=Q.length;for(;--et>=0;){const ot=et;let pt=et-1;pt<0&&(pt=Q.length-1);for(let Mt=0,yt=h+g*2;Mt<yt;Mt++){const Jt=q*Mt,Yt=q*(Mt+1),F=Z+ot+Jt,P=Z+pt+Jt,j=Z+pt+Yt,lt=Z+ot+Yt;tt(F,P,j,lt)}}}function W(Q,Z,et){c.push(Q),c.push(Z),c.push(et)}function V(Q,Z,et){st(Q),st(Z),st(et);const ot=s.length/3,pt=_.generateTopUV(i,s,ot-3,ot-2,ot-1);N(pt[0]),N(pt[1]),N(pt[2])}function tt(Q,Z,et,ot){st(Q),st(Z),st(ot),st(Z),st(et),st(ot);const pt=s.length/3,Mt=_.generateSideWallUV(i,s,pt-6,pt-3,pt-2,pt-1);N(Mt[0]),N(Mt[1]),N(Mt[3]),N(Mt[1]),N(Mt[2]),N(Mt[3])}function st(Q){s.push(c[Q*3+0]),s.push(c[Q*3+1]),s.push(c[Q*3+2])}function N(Q){r.push(Q.x),r.push(Q.y)}}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}toJSON(){const t=super.toJSON(),e=this.parameters.shapes,i=this.parameters.options;return ex(e,i,t)}static fromJSON(t,e){const i=[];for(let r=0,a=t.shapes.length;r<a;r++){const o=e[t.shapes[r]];i.push(o)}const s=t.options.extrudePath;return s!==void 0&&(t.options.extrudePath=new tl[s.type]().fromJSON(s)),new bl(i,t.options)}}const tx={generateTopUV:function(n,t,e,i,s){const r=t[e*3],a=t[e*3+1],o=t[i*3],c=t[i*3+1],l=t[s*3],h=t[s*3+1];return[new ht(r,a),new ht(o,c),new ht(l,h)]},generateSideWallUV:function(n,t,e,i,s,r){const a=t[e*3],o=t[e*3+1],c=t[e*3+2],l=t[i*3],h=t[i*3+1],u=t[i*3+2],d=t[s*3],f=t[s*3+1],p=t[s*3+2],v=t[r*3],g=t[r*3+1],m=t[r*3+2];return Math.abs(o-h)<Math.abs(a-l)?[new ht(a,1-c),new ht(l,1-u),new ht(d,1-p),new ht(v,1-m)]:[new ht(o,1-c),new ht(h,1-u),new ht(f,1-p),new ht(g,1-m)]}};function ex(n,t,e){if(e.shapes=[],Array.isArray(n))for(let i=0,s=n.length;i<s;i++){const r=n[i];e.shapes.push(r.uuid)}else e.shapes.push(n.uuid);return e.options=Object.assign({},t),t.extrudePath!==void 0&&(e.options.extrudePath=t.extrudePath.toJSON()),e}class bi extends me{constructor(t=[new ht(0,-.5),new ht(.5,0),new ht(0,.5)],e=12,i=0,s=Math.PI*2){super(),this.type="LatheGeometry",this.parameters={points:t,segments:e,phiStart:i,phiLength:s},e=Math.floor(e),s=Qt(s,0,Math.PI*2);const r=[],a=[],o=[],c=[],l=[],h=1/e,u=new C,d=new ht,f=new C,p=new C,v=new C;let g=0,m=0;for(let _=0;_<=t.length-1;_++)switch(_){case 0:g=t[_+1].x-t[_].x,m=t[_+1].y-t[_].y,f.x=m*1,f.y=-g,f.z=m*0,v.copy(f),f.normalize(),c.push(f.x,f.y,f.z);break;case t.length-1:c.push(v.x,v.y,v.z);break;default:g=t[_+1].x-t[_].x,m=t[_+1].y-t[_].y,f.x=m*1,f.y=-g,f.z=m*0,p.copy(f),f.x+=v.x,f.y+=v.y,f.z+=v.z,f.normalize(),c.push(f.x,f.y,f.z),v.copy(p)}for(let _=0;_<=e;_++){const x=i+_*h*s,b=Math.sin(x),w=Math.cos(x);for(let E=0;E<=t.length-1;E++){u.x=t[E].x*b,u.y=t[E].y,u.z=t[E].x*w,a.push(u.x,u.y,u.z),d.x=_/e,d.y=E/(t.length-1),o.push(d.x,d.y);const A=c[3*E+0]*b,T=c[3*E+1],M=c[3*E+0]*w;l.push(A,T,M)}}for(let _=0;_<e;_++)for(let x=0;x<t.length-1;x++){const b=x+_*t.length,w=b,E=b+t.length,A=b+t.length+1,T=b+1;r.push(w,E,T),r.push(A,T,E)}this.setIndex(r),this.setAttribute("position",new re(a,3)),this.setAttribute("uv",new re(o,2)),this.setAttribute("normal",new re(l,3))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new bi(t.points,t.segments,t.phiStart,t.phiLength)}}class ls extends me{constructor(t=1,e=1,i=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:t,height:e,widthSegments:i,heightSegments:s};const r=t/2,a=e/2,o=Math.floor(i),c=Math.floor(s),l=o+1,h=c+1,u=t/o,d=e/c,f=[],p=[],v=[],g=[];for(let m=0;m<h;m++){const _=m*d-a;for(let x=0;x<l;x++){const b=x*u-r;p.push(b,-_,0),v.push(0,0,1),g.push(x/o),g.push(1-m/c)}}for(let m=0;m<c;m++)for(let _=0;_<o;_++){const x=_+l*m,b=_+l*(m+1),w=_+1+l*(m+1),E=_+1+l*m;f.push(x,b,E),f.push(b,w,E)}this.setIndex(f),this.setAttribute("position",new re(p,3)),this.setAttribute("normal",new re(v,3)),this.setAttribute("uv",new re(g,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new ls(t.width,t.height,t.widthSegments,t.heightSegments)}}class y0 extends me{constructor(t=.5,e=1,i=32,s=1,r=0,a=Math.PI*2){super(),this.type="RingGeometry",this.parameters={innerRadius:t,outerRadius:e,thetaSegments:i,phiSegments:s,thetaStart:r,thetaLength:a},i=Math.max(3,i),s=Math.max(1,s);const o=[],c=[],l=[],h=[];let u=t;const d=(e-t)/s,f=new C,p=new ht;for(let v=0;v<=s;v++){for(let g=0;g<=i;g++){const m=r+g/i*a;f.x=u*Math.cos(m),f.y=u*Math.sin(m),c.push(f.x,f.y,f.z),l.push(0,0,1),p.x=(f.x/e+1)/2,p.y=(f.y/e+1)/2,h.push(p.x,p.y)}u+=d}for(let v=0;v<s;v++){const g=v*(i+1);for(let m=0;m<i;m++){const _=m+g,x=_,b=_+i+1,w=_+i+2,E=_+1;o.push(x,b,E),o.push(b,w,E)}}this.setIndex(o),this.setAttribute("position",new re(c,3)),this.setAttribute("normal",new re(l,3)),this.setAttribute("uv",new re(h,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new y0(t.innerRadius,t.outerRadius,t.thetaSegments,t.phiSegments,t.thetaStart,t.thetaLength)}}class ie extends me{constructor(t=1,e=32,i=16,s=0,r=Math.PI*2,a=0,o=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:t,widthSegments:e,heightSegments:i,phiStart:s,phiLength:r,thetaStart:a,thetaLength:o},e=Math.max(3,Math.floor(e)),i=Math.max(2,Math.floor(i));const c=Math.min(a+o,Math.PI);let l=0;const h=[],u=new C,d=new C,f=[],p=[],v=[],g=[];for(let m=0;m<=i;m++){const _=[],x=m/i;let b=0;m===0&&a===0?b=.5/e:m===i&&c===Math.PI&&(b=-.5/e);for(let w=0;w<=e;w++){const E=w/e;u.x=-t*Math.cos(s+E*r)*Math.sin(a+x*o),u.y=t*Math.cos(a+x*o),u.z=t*Math.sin(s+E*r)*Math.sin(a+x*o),p.push(u.x,u.y,u.z),d.copy(u).normalize(),v.push(d.x,d.y,d.z),g.push(E+b,1-x),_.push(l++)}h.push(_)}for(let m=0;m<i;m++)for(let _=0;_<e;_++){const x=h[m][_+1],b=h[m][_],w=h[m+1][_],E=h[m+1][_+1];(m!==0||a>0)&&f.push(x,b,E),(m!==i-1||c<Math.PI)&&f.push(b,w,E)}this.setIndex(f),this.setAttribute("position",new re(p,3)),this.setAttribute("normal",new re(v,3)),this.setAttribute("uv",new re(g,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new ie(t.radius,t.widthSegments,t.heightSegments,t.phiStart,t.phiLength,t.thetaStart,t.thetaLength)}}class zn extends me{constructor(t=1,e=.4,i=12,s=48,r=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:t,tube:e,radialSegments:i,tubularSegments:s,arc:r},i=Math.floor(i),s=Math.floor(s);const a=[],o=[],c=[],l=[],h=new C,u=new C,d=new C;for(let f=0;f<=i;f++)for(let p=0;p<=s;p++){const v=p/s*r,g=f/i*Math.PI*2;u.x=(t+e*Math.cos(g))*Math.cos(v),u.y=(t+e*Math.cos(g))*Math.sin(v),u.z=e*Math.sin(g),o.push(u.x,u.y,u.z),h.x=t*Math.cos(v),h.y=t*Math.sin(v),d.subVectors(u,h).normalize(),c.push(d.x,d.y,d.z),l.push(p/s),l.push(f/i)}for(let f=1;f<=i;f++)for(let p=1;p<=s;p++){const v=(s+1)*f+p-1,g=(s+1)*(f-1)+p-1,m=(s+1)*(f-1)+p,_=(s+1)*f+p;a.push(v,g,_),a.push(g,m,_)}this.setIndex(a),this.setAttribute("position",new re(o,3)),this.setAttribute("normal",new re(c,3)),this.setAttribute("uv",new re(l,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new zn(t.radius,t.tube,t.radialSegments,t.tubularSegments,t.arc)}}class ps extends me{constructor(t=new Cp(new C(-1,-1,0),new C(-1,1,0),new C(1,1,0)),e=64,i=1,s=8,r=!1){super(),this.type="TubeGeometry",this.parameters={path:t,tubularSegments:e,radius:i,radialSegments:s,closed:r};const a=t.computeFrenetFrames(e,r);this.tangents=a.tangents,this.normals=a.normals,this.binormals=a.binormals;const o=new C,c=new C,l=new ht;let h=new C;const u=[],d=[],f=[],p=[];v(),this.setIndex(p),this.setAttribute("position",new re(u,3)),this.setAttribute("normal",new re(d,3)),this.setAttribute("uv",new re(f,2));function v(){for(let x=0;x<e;x++)g(x);g(r===!1?e:0),_(),m()}function g(x){h=t.getPointAt(x/e,h);const b=a.normals[x],w=a.binormals[x];for(let E=0;E<=s;E++){const A=E/s*Math.PI*2,T=Math.sin(A),M=-Math.cos(A);c.x=M*b.x+T*w.x,c.y=M*b.y+T*w.y,c.z=M*b.z+T*w.z,c.normalize(),d.push(c.x,c.y,c.z),o.x=h.x+i*c.x,o.y=h.y+i*c.y,o.z=h.z+i*c.z,u.push(o.x,o.y,o.z)}}function m(){for(let x=1;x<=e;x++)for(let b=1;b<=s;b++){const w=(s+1)*(x-1)+(b-1),E=(s+1)*x+(b-1),A=(s+1)*x+b,T=(s+1)*(x-1)+b;p.push(w,E,T),p.push(E,A,T)}}function _(){for(let x=0;x<=e;x++)for(let b=0;b<=s;b++)l.x=x/e,l.y=b/s,f.push(l.x,l.y)}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}toJSON(){const t=super.toJSON();return t.path=this.parameters.path.toJSON(),t}static fromJSON(t){return new ps(new tl[t.path.type]().fromJSON(t.path),t.tubularSegments,t.radius,t.radialSegments,t.closed)}}class Xe extends br{constructor(t){super(),this.isMeshStandardMaterial=!0,this.type="MeshStandardMaterial",this.defines={STANDARD:""},this.color=new vt(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new vt(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=hp,this.normalScale=new ht(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new gn,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.defines={STANDARD:""},this.color.copy(t.color),this.roughness=t.roughness,this.metalness=t.metalness,this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.emissive.copy(t.emissive),this.emissiveMap=t.emissiveMap,this.emissiveIntensity=t.emissiveIntensity,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.roughnessMap=t.roughnessMap,this.metalnessMap=t.metalnessMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.envMapIntensity=t.envMapIntensity,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.flatShading=t.flatShading,this.fog=t.fog,this}}class nx extends br{constructor(t){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=p2,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(t)}copy(t){return super.copy(t),this.depthPacking=t.depthPacking,this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this}}class ix extends br{constructor(t){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(t)}copy(t){return super.copy(t),this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this}}class w0 extends Be{constructor(t,e=1){super(),this.isLight=!0,this.type="Light",this.color=new vt(t),this.intensity=e}dispose(){}copy(t,e){return super.copy(t,e),this.color.copy(t.color),this.intensity=t.intensity,this}toJSON(t){const e=super.toJSON(t);return e.object.color=this.color.getHex(),e.object.intensity=this.intensity,this.groundColor!==void 0&&(e.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(e.object.distance=this.distance),this.angle!==void 0&&(e.object.angle=this.angle),this.decay!==void 0&&(e.object.decay=this.decay),this.penumbra!==void 0&&(e.object.penumbra=this.penumbra),this.shadow!==void 0&&(e.object.shadow=this.shadow.toJSON()),this.target!==void 0&&(e.object.target=this.target.uuid),e}}class sx extends w0{constructor(t,e,i){super(t,i),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(Be.DEFAULT_UP),this.updateMatrix(),this.groundColor=new vt(e)}copy(t,e){return super.copy(t,e),this.groundColor.copy(t.groundColor),this}}const oh=new se,td=new C,ed=new C;class Np{constructor(t){this.camera=t,this.intensity=1,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new ht(512,512),this.mapType=Mi,this.map=null,this.mapPass=null,this.matrix=new se,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new x0,this._frameExtents=new ht(1,1),this._viewportCount=1,this._viewports=[new de(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(t){const e=this.camera,i=this.matrix;td.setFromMatrixPosition(t.matrixWorld),e.position.copy(td),ed.setFromMatrixPosition(t.target.matrixWorld),e.lookAt(ed),e.updateMatrixWorld(),oh.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),this._frustum.setFromProjectionMatrix(oh,e.coordinateSystem,e.reversedDepth),e.reversedDepth?i.set(.5,0,0,.5,0,.5,0,.5,0,0,1,0,0,0,0,1):i.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),i.multiply(oh)}getViewport(t){return this._viewports[t]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(t){return this.camera=t.camera.clone(),this.intensity=t.intensity,this.bias=t.bias,this.radius=t.radius,this.autoUpdate=t.autoUpdate,this.needsUpdate=t.needsUpdate,this.normalBias=t.normalBias,this.blurSamples=t.blurSamples,this.mapSize.copy(t.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){const t={};return this.intensity!==1&&(t.intensity=this.intensity),this.bias!==0&&(t.bias=this.bias),this.normalBias!==0&&(t.normalBias=this.normalBias),this.radius!==1&&(t.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(t.mapSize=this.mapSize.toArray()),t.camera=this.camera.toJSON(!1).object,delete t.camera.matrix,t}}class rx extends Np{constructor(){super(new Dn(50,1,.5,500)),this.isSpotLightShadow=!0,this.focus=1,this.aspect=1}updateMatrices(t){const e=this.camera,i=La*2*t.angle*this.focus,s=this.mapSize.width/this.mapSize.height*this.aspect,r=t.distance||e.far;(i!==e.fov||s!==e.aspect||r!==e.far)&&(e.fov=i,e.aspect=s,e.far=r,e.updateProjectionMatrix()),super.updateMatrices(t)}copy(t){return super.copy(t),this.focus=t.focus,this}}class ax extends w0{constructor(t,e,i=0,s=Math.PI/3,r=0,a=2){super(t,e),this.isSpotLight=!0,this.type="SpotLight",this.position.copy(Be.DEFAULT_UP),this.updateMatrix(),this.target=new Be,this.distance=i,this.angle=s,this.penumbra=r,this.decay=a,this.map=null,this.shadow=new rx}get power(){return this.intensity*Math.PI}set power(t){this.intensity=t/Math.PI}dispose(){this.shadow.dispose()}copy(t,e){return super.copy(t,e),this.distance=t.distance,this.angle=t.angle,this.penumbra=t.penumbra,this.decay=t.decay,this.target=t.target.clone(),this.shadow=t.shadow.clone(),this}}class S0 extends xp{constructor(t=-1,e=1,i=1,s=-1,r=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=t,this.right=e,this.top=i,this.bottom=s,this.near=r,this.far=a,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.left=t.left,this.right=t.right,this.top=t.top,this.bottom=t.bottom,this.near=t.near,this.far=t.far,this.zoom=t.zoom,this.view=t.view===null?null:Object.assign({},t.view),this}setViewOffset(t,e,i,s,r,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=i,this.view.offsetY=s,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=(this.right-this.left)/(2*this.zoom),e=(this.top-this.bottom)/(2*this.zoom),i=(this.right+this.left)/2,s=(this.top+this.bottom)/2;let r=i-t,a=i+t,o=s+e,c=s-e;if(this.view!==null&&this.view.enabled){const l=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=l*this.view.offsetX,a=r+l*this.view.width,o-=h*this.view.offsetY,c=o-h*this.view.height}this.projectionMatrix.makeOrthographic(r,a,o,c,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.zoom=this.zoom,e.object.left=this.left,e.object.right=this.right,e.object.top=this.top,e.object.bottom=this.bottom,e.object.near=this.near,e.object.far=this.far,this.view!==null&&(e.object.view=Object.assign({},this.view)),e}}class ox extends Np{constructor(){super(new S0(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class Lu extends w0{constructor(t,e){super(t,e),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(Be.DEFAULT_UP),this.updateMatrix(),this.target=new Be,this.shadow=new ox}dispose(){this.shadow.dispose()}copy(t){return super.copy(t),this.target=t.target.clone(),this.shadow=t.shadow.clone(),this}}class cx extends Dn{constructor(t=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=t}}const nd=new C,bc=new C,Gr=new C,Wr=new C,ch=new C,lx=new C,hx=new C;class ux{constructor(t=new C,e=new C){this.start=t,this.end=e}set(t,e){return this.start.copy(t),this.end.copy(e),this}copy(t){return this.start.copy(t.start),this.end.copy(t.end),this}getCenter(t){return t.addVectors(this.start,this.end).multiplyScalar(.5)}delta(t){return t.subVectors(this.end,this.start)}distanceSq(){return this.start.distanceToSquared(this.end)}distance(){return this.start.distanceTo(this.end)}at(t,e){return this.delta(e).multiplyScalar(t).add(this.start)}closestPointToPointParameter(t,e){nd.subVectors(t,this.start),bc.subVectors(this.end,this.start);const i=bc.dot(bc);let r=bc.dot(nd)/i;return e&&(r=Qt(r,0,1)),r}closestPointToPoint(t,e,i){const s=this.closestPointToPointParameter(t,e);return this.delta(i).multiplyScalar(s).add(this.start)}distanceSqToLine3(t,e=lx,i=hx){const s=10000000000000001e-32;let r,a;const o=this.start,c=t.start,l=this.end,h=t.end;Gr.subVectors(l,o),Wr.subVectors(h,c),ch.subVectors(o,c);const u=Gr.dot(Gr),d=Wr.dot(Wr),f=Wr.dot(ch);if(u<=s&&d<=s)return e.copy(o),i.copy(c),e.sub(i),e.dot(e);if(u<=s)r=0,a=f/d,a=Qt(a,0,1);else{const p=Gr.dot(ch);if(d<=s)a=0,r=Qt(-p/u,0,1);else{const v=Gr.dot(Wr),g=u*d-v*v;g!==0?r=Qt((v*f-p*d)/g,0,1):r=0,a=(v*r+f)/d,a<0?(a=0,r=Qt(-p/u,0,1)):a>1&&(a=1,r=Qt((v-p)/u,0,1))}}return e.copy(o).add(Gr.multiplyScalar(r)),i.copy(c).add(Wr.multiplyScalar(a)),e.sub(i),e.dot(e)}applyMatrix4(t){return this.start.applyMatrix4(t),this.end.applyMatrix4(t),this}equals(t){return t.start.equals(this.start)&&t.end.equals(this.end)}clone(){return new this.constructor().copy(this)}}function id(n,t,e,i){const s=fx(i);switch(e){case ap:return n*t;case cp:return n*t/s.components*s.byteLength;case c0:return n*t/s.components*s.byteLength;case lp:return n*t*2/s.components*s.byteLength;case l0:return n*t*2/s.components*s.byteLength;case op:return n*t*3/s.components*s.byteLength;case Je:return n*t*4/s.components*s.byteLength;case h0:return n*t*4/s.components*s.byteLength;case Uc:case Nc:return Math.floor((n+3)/4)*Math.floor((t+3)/4)*8;case Fc:case Oc:return Math.floor((n+3)/4)*Math.floor((t+3)/4)*16;case Qh:case eu:return Math.max(n,16)*Math.max(t,8)/4;case Jh:case tu:return Math.max(n,8)*Math.max(t,8)/2;case nu:case iu:return Math.floor((n+3)/4)*Math.floor((t+3)/4)*8;case su:return Math.floor((n+3)/4)*Math.floor((t+3)/4)*16;case ru:return Math.floor((n+3)/4)*Math.floor((t+3)/4)*16;case au:return Math.floor((n+4)/5)*Math.floor((t+3)/4)*16;case ou:return Math.floor((n+4)/5)*Math.floor((t+4)/5)*16;case cu:return Math.floor((n+5)/6)*Math.floor((t+4)/5)*16;case lu:return Math.floor((n+5)/6)*Math.floor((t+5)/6)*16;case hu:return Math.floor((n+7)/8)*Math.floor((t+4)/5)*16;case uu:return Math.floor((n+7)/8)*Math.floor((t+5)/6)*16;case fu:return Math.floor((n+7)/8)*Math.floor((t+7)/8)*16;case du:return Math.floor((n+9)/10)*Math.floor((t+4)/5)*16;case pu:return Math.floor((n+9)/10)*Math.floor((t+5)/6)*16;case mu:return Math.floor((n+9)/10)*Math.floor((t+7)/8)*16;case gu:return Math.floor((n+9)/10)*Math.floor((t+9)/10)*16;case vu:return Math.floor((n+11)/12)*Math.floor((t+9)/10)*16;case xu:return Math.floor((n+11)/12)*Math.floor((t+11)/12)*16;case _u:case Mu:case bu:return Math.ceil(n/4)*Math.ceil(t/4)*16;case yu:case wu:return Math.ceil(n/4)*Math.ceil(t/4)*8;case Su:case Eu:return Math.ceil(n/4)*Math.ceil(t/4)*16}throw new Error(`Unable to determine texture byte length for ${e} format.`)}function fx(n){switch(n){case Mi:case np:return{byteLength:1,components:1};case vo:case ip:case _r:return{byteLength:2,components:1};case a0:case o0:return{byteLength:2,components:4};case mr:case r0:case Bi:return{byteLength:4,components:1};case sp:case rp:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${n}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:s0}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=s0);/**
 * @license
 * Copyright 2010-2025 Three.js Authors
 * SPDX-License-Identifier: MIT
 */function Fp(){let n=null,t=!1,e=null,i=null;function s(r,a){e(r,a),i=n.requestAnimationFrame(s)}return{start:function(){t!==!0&&e!==null&&(i=n.requestAnimationFrame(s),t=!0)},stop:function(){n.cancelAnimationFrame(i),t=!1},setAnimationLoop:function(r){e=r},setContext:function(r){n=r}}}function dx(n){const t=new WeakMap;function e(o,c){const l=o.array,h=o.usage,u=l.byteLength,d=n.createBuffer();n.bindBuffer(c,d),n.bufferData(c,l,h),o.onUploadCallback();let f;if(l instanceof Float32Array)f=n.FLOAT;else if(typeof Float16Array<"u"&&l instanceof Float16Array)f=n.HALF_FLOAT;else if(l instanceof Uint16Array)o.isFloat16BufferAttribute?f=n.HALF_FLOAT:f=n.UNSIGNED_SHORT;else if(l instanceof Int16Array)f=n.SHORT;else if(l instanceof Uint32Array)f=n.UNSIGNED_INT;else if(l instanceof Int32Array)f=n.INT;else if(l instanceof Int8Array)f=n.BYTE;else if(l instanceof Uint8Array)f=n.UNSIGNED_BYTE;else if(l instanceof Uint8ClampedArray)f=n.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+l);return{buffer:d,type:f,bytesPerElement:l.BYTES_PER_ELEMENT,version:o.version,size:u}}function i(o,c,l){const h=c.array,u=c.updateRanges;if(n.bindBuffer(l,o),u.length===0)n.bufferSubData(l,0,h);else{u.sort((f,p)=>f.start-p.start);let d=0;for(let f=1;f<u.length;f++){const p=u[d],v=u[f];v.start<=p.start+p.count+1?p.count=Math.max(p.count,v.start+v.count-p.start):(++d,u[d]=v)}u.length=d+1;for(let f=0,p=u.length;f<p;f++){const v=u[f];n.bufferSubData(l,v.start*h.BYTES_PER_ELEMENT,h,v.start,v.count)}c.clearUpdateRanges()}c.onUploadCallback()}function s(o){return o.isInterleavedBufferAttribute&&(o=o.data),t.get(o)}function r(o){o.isInterleavedBufferAttribute&&(o=o.data);const c=t.get(o);c&&(n.deleteBuffer(c.buffer),t.delete(o))}function a(o,c){if(o.isInterleavedBufferAttribute&&(o=o.data),o.isGLBufferAttribute){const h=t.get(o);(!h||h.version<o.version)&&t.set(o,{buffer:o.buffer,type:o.type,bytesPerElement:o.elementSize,version:o.version});return}const l=t.get(o);if(l===void 0)t.set(o,e(o,c));else if(l.version<o.version){if(l.size!==o.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");i(l.buffer,o,c),l.version=o.version}}return{get:s,remove:r,update:a}}var px=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,mx=`#ifdef USE_ALPHAHASH
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
#endif`,gx=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,vx=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,xx=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,_x=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,Mx=`#ifdef USE_AOMAP
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
#endif`,bx=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,yx=`#ifdef USE_BATCHING
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
#endif`,wx=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,Sx=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,Ex=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,Tx=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,Ax=`#ifdef USE_IRIDESCENCE
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
#endif`,Rx=`#ifdef USE_BUMPMAP
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
#endif`,Cx=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,Lx=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,Px=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,Ix=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,Dx=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,Ux=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,Nx=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,Fx=`#if defined( USE_COLOR_ALPHA )
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
#endif`,Ox=`#define PI 3.141592653589793
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
} // validated`,kx=`#ifdef ENVMAP_TYPE_CUBE_UV
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
#endif`,Bx=`vec3 transformedNormal = objectNormal;
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
#endif`,Hx=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,Vx=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,zx=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,Gx=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,Wx="gl_FragColor = linearToOutputTexel( gl_FragColor );",Xx=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,qx=`#ifdef USE_ENVMAP
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
#endif`,$x=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,Yx=`#ifdef USE_ENVMAP
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
#endif`,jx=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,Zx=`#ifdef USE_ENVMAP
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
#endif`,Kx=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,Jx=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,Qx=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,t_=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,e_=`#ifdef USE_GRADIENTMAP
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
}`,n_=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,i_=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,s_=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,r_=`uniform bool receiveShadow;
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
#endif`,a_=`#ifdef USE_ENVMAP
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
#endif`,o_=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,c_=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,l_=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,h_=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,u_=`PhysicalMaterial material;
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
#endif`,f_=`struct PhysicalMaterial {
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
}`,d_=`
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
#endif`,p_=`#if defined( RE_IndirectDiffuse )
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
#endif`,m_=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,g_=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,v_=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,x_=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,__=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,M_=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,b_=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,y_=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,w_=`#if defined( USE_POINTS_UV )
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
#endif`,S_=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,E_=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,T_=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,A_=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,R_=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,C_=`#ifdef USE_MORPHTARGETS
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
#endif`,L_=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,P_=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 nonPerturbedNormal = normal;`,I_=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
#endif`,D_=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,U_=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,N_=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,F_=`#ifdef USE_NORMALMAP
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
#endif`,O_=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,k_=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,B_=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,H_=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,V_=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,z_=`vec3 packNormalToRGB( const in vec3 normal ) {
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
}`,G_=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,W_=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,X_=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,q_=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,$_=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,Y_=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,j_=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,Z_=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,K_=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
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
#endif`,J_=`float getShadowMask() {
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
}`,Q_=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,tM=`#ifdef USE_SKINNING
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
#endif`,eM=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,nM=`#ifdef USE_SKINNING
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
#endif`,iM=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,sM=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,rM=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,aM=`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,oM=`#ifdef USE_TRANSMISSION
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
#endif`,cM=`#ifdef USE_TRANSMISSION
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
#endif`,lM=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,hM=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,uM=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,fM=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const dM=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,pM=`uniform sampler2D t2D;
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
}`,mM=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,gM=`#ifdef ENVMAP_TYPE_CUBE
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
}`,vM=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,xM=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,_M=`#include <common>
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
}`,MM=`#if DEPTH_PACKING == 3200
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
}`,bM=`#define DISTANCE
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
}`,yM=`#define DISTANCE
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
}`,wM=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,SM=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,EM=`uniform float scale;
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
}`,TM=`uniform vec3 diffuse;
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
}`,AM=`#include <common>
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
}`,RM=`uniform vec3 diffuse;
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
}`,CM=`#define LAMBERT
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
}`,LM=`#define LAMBERT
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
}`,PM=`#define MATCAP
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
}`,IM=`#define MATCAP
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
}`,DM=`#define NORMAL
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
}`,UM=`#define NORMAL
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
}`,NM=`#define PHONG
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
}`,FM=`#define PHONG
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
}`,OM=`#define STANDARD
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
}`,kM=`#define STANDARD
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
}`,BM=`#define TOON
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
}`,HM=`#define TOON
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
}`,VM=`uniform float size;
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
}`,zM=`uniform vec3 diffuse;
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
}`,GM=`#include <common>
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
}`,WM=`uniform vec3 color;
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
}`,XM=`uniform float rotation;
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
}`,qM=`uniform vec3 diffuse;
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
}`,ae={alphahash_fragment:px,alphahash_pars_fragment:mx,alphamap_fragment:gx,alphamap_pars_fragment:vx,alphatest_fragment:xx,alphatest_pars_fragment:_x,aomap_fragment:Mx,aomap_pars_fragment:bx,batching_pars_vertex:yx,batching_vertex:wx,begin_vertex:Sx,beginnormal_vertex:Ex,bsdfs:Tx,iridescence_fragment:Ax,bumpmap_pars_fragment:Rx,clipping_planes_fragment:Cx,clipping_planes_pars_fragment:Lx,clipping_planes_pars_vertex:Px,clipping_planes_vertex:Ix,color_fragment:Dx,color_pars_fragment:Ux,color_pars_vertex:Nx,color_vertex:Fx,common:Ox,cube_uv_reflection_fragment:kx,defaultnormal_vertex:Bx,displacementmap_pars_vertex:Hx,displacementmap_vertex:Vx,emissivemap_fragment:zx,emissivemap_pars_fragment:Gx,colorspace_fragment:Wx,colorspace_pars_fragment:Xx,envmap_fragment:qx,envmap_common_pars_fragment:$x,envmap_pars_fragment:Yx,envmap_pars_vertex:jx,envmap_physical_pars_fragment:a_,envmap_vertex:Zx,fog_vertex:Kx,fog_pars_vertex:Jx,fog_fragment:Qx,fog_pars_fragment:t_,gradientmap_pars_fragment:e_,lightmap_pars_fragment:n_,lights_lambert_fragment:i_,lights_lambert_pars_fragment:s_,lights_pars_begin:r_,lights_toon_fragment:o_,lights_toon_pars_fragment:c_,lights_phong_fragment:l_,lights_phong_pars_fragment:h_,lights_physical_fragment:u_,lights_physical_pars_fragment:f_,lights_fragment_begin:d_,lights_fragment_maps:p_,lights_fragment_end:m_,logdepthbuf_fragment:g_,logdepthbuf_pars_fragment:v_,logdepthbuf_pars_vertex:x_,logdepthbuf_vertex:__,map_fragment:M_,map_pars_fragment:b_,map_particle_fragment:y_,map_particle_pars_fragment:w_,metalnessmap_fragment:S_,metalnessmap_pars_fragment:E_,morphinstance_vertex:T_,morphcolor_vertex:A_,morphnormal_vertex:R_,morphtarget_pars_vertex:C_,morphtarget_vertex:L_,normal_fragment_begin:P_,normal_fragment_maps:I_,normal_pars_fragment:D_,normal_pars_vertex:U_,normal_vertex:N_,normalmap_pars_fragment:F_,clearcoat_normal_fragment_begin:O_,clearcoat_normal_fragment_maps:k_,clearcoat_pars_fragment:B_,iridescence_pars_fragment:H_,opaque_fragment:V_,packing:z_,premultiplied_alpha_fragment:G_,project_vertex:W_,dithering_fragment:X_,dithering_pars_fragment:q_,roughnessmap_fragment:$_,roughnessmap_pars_fragment:Y_,shadowmap_pars_fragment:j_,shadowmap_pars_vertex:Z_,shadowmap_vertex:K_,shadowmask_pars_fragment:J_,skinbase_vertex:Q_,skinning_pars_vertex:tM,skinning_vertex:eM,skinnormal_vertex:nM,specularmap_fragment:iM,specularmap_pars_fragment:sM,tonemapping_fragment:rM,tonemapping_pars_fragment:aM,transmission_fragment:oM,transmission_pars_fragment:cM,uv_pars_fragment:lM,uv_pars_vertex:hM,uv_vertex:uM,worldpos_vertex:fM,background_vert:dM,background_frag:pM,backgroundCube_vert:mM,backgroundCube_frag:gM,cube_vert:vM,cube_frag:xM,depth_vert:_M,depth_frag:MM,distanceRGBA_vert:bM,distanceRGBA_frag:yM,equirect_vert:wM,equirect_frag:SM,linedashed_vert:EM,linedashed_frag:TM,meshbasic_vert:AM,meshbasic_frag:RM,meshlambert_vert:CM,meshlambert_frag:LM,meshmatcap_vert:PM,meshmatcap_frag:IM,meshnormal_vert:DM,meshnormal_frag:UM,meshphong_vert:NM,meshphong_frag:FM,meshphysical_vert:OM,meshphysical_frag:kM,meshtoon_vert:BM,meshtoon_frag:HM,points_vert:VM,points_frag:zM,shadow_vert:GM,shadow_frag:WM,sprite_vert:XM,sprite_frag:qM},Lt={common:{diffuse:{value:new vt(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new ne},alphaMap:{value:null},alphaMapTransform:{value:new ne},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new ne}},envmap:{envMap:{value:null},envMapRotation:{value:new ne},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new ne}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new ne}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new ne},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new ne},normalScale:{value:new ht(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new ne},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new ne}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new ne}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new ne}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new vt(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new vt(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new ne},alphaTest:{value:0},uvTransform:{value:new ne}},sprite:{diffuse:{value:new vt(16777215)},opacity:{value:1},center:{value:new ht(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new ne},alphaMap:{value:null},alphaMapTransform:{value:new ne},alphaTest:{value:0}}},Ii={basic:{uniforms:ln([Lt.common,Lt.specularmap,Lt.envmap,Lt.aomap,Lt.lightmap,Lt.fog]),vertexShader:ae.meshbasic_vert,fragmentShader:ae.meshbasic_frag},lambert:{uniforms:ln([Lt.common,Lt.specularmap,Lt.envmap,Lt.aomap,Lt.lightmap,Lt.emissivemap,Lt.bumpmap,Lt.normalmap,Lt.displacementmap,Lt.fog,Lt.lights,{emissive:{value:new vt(0)}}]),vertexShader:ae.meshlambert_vert,fragmentShader:ae.meshlambert_frag},phong:{uniforms:ln([Lt.common,Lt.specularmap,Lt.envmap,Lt.aomap,Lt.lightmap,Lt.emissivemap,Lt.bumpmap,Lt.normalmap,Lt.displacementmap,Lt.fog,Lt.lights,{emissive:{value:new vt(0)},specular:{value:new vt(1118481)},shininess:{value:30}}]),vertexShader:ae.meshphong_vert,fragmentShader:ae.meshphong_frag},standard:{uniforms:ln([Lt.common,Lt.envmap,Lt.aomap,Lt.lightmap,Lt.emissivemap,Lt.bumpmap,Lt.normalmap,Lt.displacementmap,Lt.roughnessmap,Lt.metalnessmap,Lt.fog,Lt.lights,{emissive:{value:new vt(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:ae.meshphysical_vert,fragmentShader:ae.meshphysical_frag},toon:{uniforms:ln([Lt.common,Lt.aomap,Lt.lightmap,Lt.emissivemap,Lt.bumpmap,Lt.normalmap,Lt.displacementmap,Lt.gradientmap,Lt.fog,Lt.lights,{emissive:{value:new vt(0)}}]),vertexShader:ae.meshtoon_vert,fragmentShader:ae.meshtoon_frag},matcap:{uniforms:ln([Lt.common,Lt.bumpmap,Lt.normalmap,Lt.displacementmap,Lt.fog,{matcap:{value:null}}]),vertexShader:ae.meshmatcap_vert,fragmentShader:ae.meshmatcap_frag},points:{uniforms:ln([Lt.points,Lt.fog]),vertexShader:ae.points_vert,fragmentShader:ae.points_frag},dashed:{uniforms:ln([Lt.common,Lt.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:ae.linedashed_vert,fragmentShader:ae.linedashed_frag},depth:{uniforms:ln([Lt.common,Lt.displacementmap]),vertexShader:ae.depth_vert,fragmentShader:ae.depth_frag},normal:{uniforms:ln([Lt.common,Lt.bumpmap,Lt.normalmap,Lt.displacementmap,{opacity:{value:1}}]),vertexShader:ae.meshnormal_vert,fragmentShader:ae.meshnormal_frag},sprite:{uniforms:ln([Lt.sprite,Lt.fog]),vertexShader:ae.sprite_vert,fragmentShader:ae.sprite_frag},background:{uniforms:{uvTransform:{value:new ne},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:ae.background_vert,fragmentShader:ae.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new ne}},vertexShader:ae.backgroundCube_vert,fragmentShader:ae.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:ae.cube_vert,fragmentShader:ae.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:ae.equirect_vert,fragmentShader:ae.equirect_frag},distanceRGBA:{uniforms:ln([Lt.common,Lt.displacementmap,{referencePosition:{value:new C},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:ae.distanceRGBA_vert,fragmentShader:ae.distanceRGBA_frag},shadow:{uniforms:ln([Lt.lights,Lt.fog,{color:{value:new vt(0)},opacity:{value:1}}]),vertexShader:ae.shadow_vert,fragmentShader:ae.shadow_frag}};Ii.physical={uniforms:ln([Ii.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new ne},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new ne},clearcoatNormalScale:{value:new ht(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new ne},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new ne},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new ne},sheen:{value:0},sheenColor:{value:new vt(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new ne},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new ne},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new ne},transmissionSamplerSize:{value:new ht},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new ne},attenuationDistance:{value:0},attenuationColor:{value:new vt(0)},specularColor:{value:new vt(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new ne},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new ne},anisotropyVector:{value:new ht},anisotropyMap:{value:null},anisotropyMapTransform:{value:new ne}}]),vertexShader:ae.meshphysical_vert,fragmentShader:ae.meshphysical_frag};const yc={r:0,b:0,g:0},Xs=new gn,$M=new se;function YM(n,t,e,i,s,r,a){const o=new vt(0);let c=r===!0?0:1,l,h,u=null,d=0,f=null;function p(x){let b=x.isScene===!0?x.background:null;return b&&b.isTexture&&(b=(x.backgroundBlurriness>0?e:t).get(b)),b}function v(x){let b=!1;const w=p(x);w===null?m(o,c):w&&w.isColor&&(m(w,1),b=!0);const E=n.xr.getEnvironmentBlendMode();E==="additive"?i.buffers.color.setClear(0,0,0,1,a):E==="alpha-blend"&&i.buffers.color.setClear(0,0,0,0,a),(n.autoClear||b)&&(i.buffers.depth.setTest(!0),i.buffers.depth.setMask(!0),i.buffers.color.setMask(!0),n.clear(n.autoClearColor,n.autoClearDepth,n.autoClearStencil))}function g(x,b){const w=p(b);w&&(w.isCubeTexture||w.mapping===Ml)?(h===void 0&&(h=new mt(new be(1,1,1),new Ze({name:"BackgroundCubeMaterial",uniforms:Pa(Ii.backgroundCube.uniforms),vertexShader:Ii.backgroundCube.vertexShader,fragmentShader:Ii.backgroundCube.fragmentShader,side:Tn,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),h.geometry.deleteAttribute("normal"),h.geometry.deleteAttribute("uv"),h.onBeforeRender=function(E,A,T){this.matrixWorld.copyPosition(T.matrixWorld)},Object.defineProperty(h.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),s.update(h)),Xs.copy(b.backgroundRotation),Xs.x*=-1,Xs.y*=-1,Xs.z*=-1,w.isCubeTexture&&w.isRenderTargetTexture===!1&&(Xs.y*=-1,Xs.z*=-1),h.material.uniforms.envMap.value=w,h.material.uniforms.flipEnvMap.value=w.isCubeTexture&&w.isRenderTargetTexture===!1?-1:1,h.material.uniforms.backgroundBlurriness.value=b.backgroundBlurriness,h.material.uniforms.backgroundIntensity.value=b.backgroundIntensity,h.material.uniforms.backgroundRotation.value.setFromMatrix4($M.makeRotationFromEuler(Xs)),h.material.toneMapped=ue.getTransfer(w.colorSpace)!==xe,(u!==w||d!==w.version||f!==n.toneMapping)&&(h.material.needsUpdate=!0,u=w,d=w.version,f=n.toneMapping),h.layers.enableAll(),x.unshift(h,h.geometry,h.material,0,0,null)):w&&w.isTexture&&(l===void 0&&(l=new mt(new ls(2,2),new Ze({name:"BackgroundMaterial",uniforms:Pa(Ii.background.uniforms),vertexShader:Ii.background.vertexShader,fragmentShader:Ii.background.fragmentShader,side:Os,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),l.geometry.deleteAttribute("normal"),Object.defineProperty(l.material,"map",{get:function(){return this.uniforms.t2D.value}}),s.update(l)),l.material.uniforms.t2D.value=w,l.material.uniforms.backgroundIntensity.value=b.backgroundIntensity,l.material.toneMapped=ue.getTransfer(w.colorSpace)!==xe,w.matrixAutoUpdate===!0&&w.updateMatrix(),l.material.uniforms.uvTransform.value.copy(w.matrix),(u!==w||d!==w.version||f!==n.toneMapping)&&(l.material.needsUpdate=!0,u=w,d=w.version,f=n.toneMapping),l.layers.enableAll(),x.unshift(l,l.geometry,l.material,0,0,null))}function m(x,b){x.getRGB(yc,vp(n)),i.buffers.color.setClear(yc.r,yc.g,yc.b,b,a)}function _(){h!==void 0&&(h.geometry.dispose(),h.material.dispose(),h=void 0),l!==void 0&&(l.geometry.dispose(),l.material.dispose(),l=void 0)}return{getClearColor:function(){return o},setClearColor:function(x,b=1){o.set(x),c=b,m(o,c)},getClearAlpha:function(){return c},setClearAlpha:function(x){c=x,m(o,c)},render:v,addToRenderList:g,dispose:_}}function jM(n,t){const e=n.getParameter(n.MAX_VERTEX_ATTRIBS),i={},s=d(null);let r=s,a=!1;function o(y,S,R,I,L){let D=!1;const k=u(I,R,S);r!==k&&(r=k,l(r.object)),D=f(y,I,R,L),D&&p(y,I,R,L),L!==null&&t.update(L,n.ELEMENT_ARRAY_BUFFER),(D||a)&&(a=!1,b(y,S,R,I),L!==null&&n.bindBuffer(n.ELEMENT_ARRAY_BUFFER,t.get(L).buffer))}function c(){return n.createVertexArray()}function l(y){return n.bindVertexArray(y)}function h(y){return n.deleteVertexArray(y)}function u(y,S,R){const I=R.wireframe===!0;let L=i[y.id];L===void 0&&(L={},i[y.id]=L);let D=L[S.id];D===void 0&&(D={},L[S.id]=D);let k=D[I];return k===void 0&&(k=d(c()),D[I]=k),k}function d(y){const S=[],R=[],I=[];for(let L=0;L<e;L++)S[L]=0,R[L]=0,I[L]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:S,enabledAttributes:R,attributeDivisors:I,object:y,attributes:{},index:null}}function f(y,S,R,I){const L=r.attributes,D=S.attributes;let k=0;const q=R.getAttributes();for(const z in q)if(q[z].location>=0){const ut=L[z];let gt=D[z];if(gt===void 0&&(z==="instanceMatrix"&&y.instanceMatrix&&(gt=y.instanceMatrix),z==="instanceColor"&&y.instanceColor&&(gt=y.instanceColor)),ut===void 0||ut.attribute!==gt||gt&&ut.data!==gt.data)return!0;k++}return r.attributesNum!==k||r.index!==I}function p(y,S,R,I){const L={},D=S.attributes;let k=0;const q=R.getAttributes();for(const z in q)if(q[z].location>=0){let ut=D[z];ut===void 0&&(z==="instanceMatrix"&&y.instanceMatrix&&(ut=y.instanceMatrix),z==="instanceColor"&&y.instanceColor&&(ut=y.instanceColor));const gt={};gt.attribute=ut,ut&&ut.data&&(gt.data=ut.data),L[z]=gt,k++}r.attributes=L,r.attributesNum=k,r.index=I}function v(){const y=r.newAttributes;for(let S=0,R=y.length;S<R;S++)y[S]=0}function g(y){m(y,0)}function m(y,S){const R=r.newAttributes,I=r.enabledAttributes,L=r.attributeDivisors;R[y]=1,I[y]===0&&(n.enableVertexAttribArray(y),I[y]=1),L[y]!==S&&(n.vertexAttribDivisor(y,S),L[y]=S)}function _(){const y=r.newAttributes,S=r.enabledAttributes;for(let R=0,I=S.length;R<I;R++)S[R]!==y[R]&&(n.disableVertexAttribArray(R),S[R]=0)}function x(y,S,R,I,L,D,k){k===!0?n.vertexAttribIPointer(y,S,R,L,D):n.vertexAttribPointer(y,S,R,I,L,D)}function b(y,S,R,I){v();const L=I.attributes,D=R.getAttributes(),k=S.defaultAttributeValues;for(const q in D){const z=D[q];if(z.location>=0){let it=L[q];if(it===void 0&&(q==="instanceMatrix"&&y.instanceMatrix&&(it=y.instanceMatrix),q==="instanceColor"&&y.instanceColor&&(it=y.instanceColor)),it!==void 0){const ut=it.normalized,gt=it.itemSize,_t=t.get(it);if(_t===void 0)continue;const At=_t.buffer,Ut=_t.type,ct=_t.bytesPerElement,G=Ut===n.INT||Ut===n.UNSIGNED_INT||it.gpuType===r0;if(it.isInterleavedBufferAttribute){const J=it.data,H=J.stride,W=it.offset;if(J.isInstancedInterleavedBuffer){for(let V=0;V<z.locationSize;V++)m(z.location+V,J.meshPerAttribute);y.isInstancedMesh!==!0&&I._maxInstanceCount===void 0&&(I._maxInstanceCount=J.meshPerAttribute*J.count)}else for(let V=0;V<z.locationSize;V++)g(z.location+V);n.bindBuffer(n.ARRAY_BUFFER,At);for(let V=0;V<z.locationSize;V++)x(z.location+V,gt/z.locationSize,Ut,ut,H*ct,(W+gt/z.locationSize*V)*ct,G)}else{if(it.isInstancedBufferAttribute){for(let J=0;J<z.locationSize;J++)m(z.location+J,it.meshPerAttribute);y.isInstancedMesh!==!0&&I._maxInstanceCount===void 0&&(I._maxInstanceCount=it.meshPerAttribute*it.count)}else for(let J=0;J<z.locationSize;J++)g(z.location+J);n.bindBuffer(n.ARRAY_BUFFER,At);for(let J=0;J<z.locationSize;J++)x(z.location+J,gt/z.locationSize,Ut,ut,gt*ct,gt/z.locationSize*J*ct,G)}}else if(k!==void 0){const ut=k[q];if(ut!==void 0)switch(ut.length){case 2:n.vertexAttrib2fv(z.location,ut);break;case 3:n.vertexAttrib3fv(z.location,ut);break;case 4:n.vertexAttrib4fv(z.location,ut);break;default:n.vertexAttrib1fv(z.location,ut)}}}}_()}function w(){T();for(const y in i){const S=i[y];for(const R in S){const I=S[R];for(const L in I)h(I[L].object),delete I[L];delete S[R]}delete i[y]}}function E(y){if(i[y.id]===void 0)return;const S=i[y.id];for(const R in S){const I=S[R];for(const L in I)h(I[L].object),delete I[L];delete S[R]}delete i[y.id]}function A(y){for(const S in i){const R=i[S];if(R[y.id]===void 0)continue;const I=R[y.id];for(const L in I)h(I[L].object),delete I[L];delete R[y.id]}}function T(){M(),a=!0,r!==s&&(r=s,l(r.object))}function M(){s.geometry=null,s.program=null,s.wireframe=!1}return{setup:o,reset:T,resetDefaultState:M,dispose:w,releaseStatesOfGeometry:E,releaseStatesOfProgram:A,initAttributes:v,enableAttribute:g,disableUnusedAttributes:_}}function ZM(n,t,e){let i;function s(l){i=l}function r(l,h){n.drawArrays(i,l,h),e.update(h,i,1)}function a(l,h,u){u!==0&&(n.drawArraysInstanced(i,l,h,u),e.update(h,i,u))}function o(l,h,u){if(u===0)return;t.get("WEBGL_multi_draw").multiDrawArraysWEBGL(i,l,0,h,0,u);let f=0;for(let p=0;p<u;p++)f+=h[p];e.update(f,i,1)}function c(l,h,u,d){if(u===0)return;const f=t.get("WEBGL_multi_draw");if(f===null)for(let p=0;p<l.length;p++)a(l[p],h[p],d[p]);else{f.multiDrawArraysInstancedWEBGL(i,l,0,h,0,d,0,u);let p=0;for(let v=0;v<u;v++)p+=h[v]*d[v];e.update(p,i,1)}}this.setMode=s,this.render=r,this.renderInstances=a,this.renderMultiDraw=o,this.renderMultiDrawInstances=c}function KM(n,t,e,i){let s;function r(){if(s!==void 0)return s;if(t.has("EXT_texture_filter_anisotropic")===!0){const A=t.get("EXT_texture_filter_anisotropic");s=n.getParameter(A.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else s=0;return s}function a(A){return!(A!==Je&&i.convert(A)!==n.getParameter(n.IMPLEMENTATION_COLOR_READ_FORMAT))}function o(A){const T=A===_r&&(t.has("EXT_color_buffer_half_float")||t.has("EXT_color_buffer_float"));return!(A!==Mi&&i.convert(A)!==n.getParameter(n.IMPLEMENTATION_COLOR_READ_TYPE)&&A!==Bi&&!T)}function c(A){if(A==="highp"){if(n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.HIGH_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.HIGH_FLOAT).precision>0)return"highp";A="mediump"}return A==="mediump"&&n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.MEDIUM_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let l=e.precision!==void 0?e.precision:"highp";const h=c(l);h!==l&&(console.warn("THREE.WebGLRenderer:",l,"not supported, using",h,"instead."),l=h);const u=e.logarithmicDepthBuffer===!0,d=e.reversedDepthBuffer===!0&&t.has("EXT_clip_control"),f=n.getParameter(n.MAX_TEXTURE_IMAGE_UNITS),p=n.getParameter(n.MAX_VERTEX_TEXTURE_IMAGE_UNITS),v=n.getParameter(n.MAX_TEXTURE_SIZE),g=n.getParameter(n.MAX_CUBE_MAP_TEXTURE_SIZE),m=n.getParameter(n.MAX_VERTEX_ATTRIBS),_=n.getParameter(n.MAX_VERTEX_UNIFORM_VECTORS),x=n.getParameter(n.MAX_VARYING_VECTORS),b=n.getParameter(n.MAX_FRAGMENT_UNIFORM_VECTORS),w=p>0,E=n.getParameter(n.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:r,getMaxPrecision:c,textureFormatReadable:a,textureTypeReadable:o,precision:l,logarithmicDepthBuffer:u,reversedDepthBuffer:d,maxTextures:f,maxVertexTextures:p,maxTextureSize:v,maxCubemapSize:g,maxAttributes:m,maxVertexUniforms:_,maxVaryings:x,maxFragmentUniforms:b,vertexTextures:w,maxSamples:E}}function JM(n){const t=this;let e=null,i=0,s=!1,r=!1;const a=new Js,o=new ne,c={value:null,needsUpdate:!1};this.uniform=c,this.numPlanes=0,this.numIntersection=0,this.init=function(u,d){const f=u.length!==0||d||i!==0||s;return s=d,i=u.length,f},this.beginShadows=function(){r=!0,h(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(u,d){e=h(u,d,0)},this.setState=function(u,d,f){const p=u.clippingPlanes,v=u.clipIntersection,g=u.clipShadows,m=n.get(u);if(!s||p===null||p.length===0||r&&!g)r?h(null):l();else{const _=r?0:i,x=_*4;let b=m.clippingState||null;c.value=b,b=h(p,d,x,f);for(let w=0;w!==x;++w)b[w]=e[w];m.clippingState=b,this.numIntersection=v?this.numPlanes:0,this.numPlanes+=_}};function l(){c.value!==e&&(c.value=e,c.needsUpdate=i>0),t.numPlanes=i,t.numIntersection=0}function h(u,d,f,p){const v=u!==null?u.length:0;let g=null;if(v!==0){if(g=c.value,p!==!0||g===null){const m=f+v*4,_=d.matrixWorldInverse;o.getNormalMatrix(_),(g===null||g.length<m)&&(g=new Float32Array(m));for(let x=0,b=f;x!==v;++x,b+=4)a.copy(u[x]).applyMatrix4(_,o),a.normal.toArray(g,b),g[b+3]=a.constant}c.value=g,c.needsUpdate=!0}return t.numPlanes=v,t.numIntersection=0,g}}function QM(n){let t=new WeakMap;function e(a,o){return o===Yc?a.mapping=Aa:o===Zh&&(a.mapping=Ra),a}function i(a){if(a&&a.isTexture){const o=a.mapping;if(o===Yc||o===Zh)if(t.has(a)){const c=t.get(a).texture;return e(c,a.mapping)}else{const c=a.image;if(c&&c.height>0){const l=new pv(c.height);return l.fromEquirectangularTexture(n,a),t.set(a,l),a.addEventListener("dispose",s),e(l.texture,a.mapping)}else return null}}return a}function s(a){const o=a.target;o.removeEventListener("dispose",s);const c=t.get(o);c!==void 0&&(t.delete(o),c.dispose())}function r(){t=new WeakMap}return{get:i,dispose:r}}const la=4,sd=[.125,.215,.35,.446,.526,.582],er=20,lh=new S0,rd=new vt;let hh=null,uh=0,fh=0,dh=!1;const Qs=(1+Math.sqrt(5))/2,Xr=1/Qs,ad=[new C(-Qs,Xr,0),new C(Qs,Xr,0),new C(-Xr,0,Qs),new C(Xr,0,Qs),new C(0,Qs,-Xr),new C(0,Qs,Xr),new C(-1,1,-1),new C(1,1,-1),new C(-1,1,1),new C(1,1,1)],t3=new C;class Pu{constructor(t){this._renderer=t,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(t,e=0,i=.1,s=100,r={}){const{size:a=256,position:o=t3}=r;hh=this._renderer.getRenderTarget(),uh=this._renderer.getActiveCubeFace(),fh=this._renderer.getActiveMipmapLevel(),dh=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(a);const c=this._allocateTargets();return c.depthBuffer=!0,this._sceneToCubeUV(t,i,s,c,o),e>0&&this._blur(c,0,0,e),this._applyPMREM(c),this._cleanup(c),c}fromEquirectangular(t,e=null){return this._fromTexture(t,e)}fromCubemap(t,e=null){return this._fromTexture(t,e)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=ld(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=cd(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(t){this._lodMax=Math.floor(Math.log2(t)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let t=0;t<this._lodPlanes.length;t++)this._lodPlanes[t].dispose()}_cleanup(t){this._renderer.setRenderTarget(hh,uh,fh),this._renderer.xr.enabled=dh,t.scissorTest=!1,wc(t,0,0,t.width,t.height)}_fromTexture(t,e){t.mapping===Aa||t.mapping===Ra?this._setSize(t.image.length===0?16:t.image[0].width||t.image[0].image.width):this._setSize(t.image.width/4),hh=this._renderer.getRenderTarget(),uh=this._renderer.getActiveCubeFace(),fh=this._renderer.getActiveMipmapLevel(),dh=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const i=e||this._allocateTargets();return this._textureToCubeUV(t,i),this._applyPMREM(i),this._cleanup(i),i}_allocateTargets(){const t=3*Math.max(this._cubeSize,112),e=4*this._cubeSize,i={magFilter:Re,minFilter:Re,generateMipmaps:!1,type:_r,format:Je,colorSpace:gr,depthBuffer:!1},s=od(t,e,i);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==t||this._pingPongRenderTarget.height!==e){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=od(t,e,i);const{_lodMax:r}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=e3(r)),this._blurMaterial=n3(r,t,e)}return s}_compileMaterial(t){const e=new mt(this._lodPlanes[0],t);this._renderer.compile(e,lh)}_sceneToCubeUV(t,e,i,s,r){const c=new Dn(90,1,e,i),l=[1,-1,1,1,1,1],h=[1,1,1,-1,-1,-1],u=this._renderer,d=u.autoClear,f=u.toneMapping;u.getClearColor(rd),u.toneMapping=Ns,u.autoClear=!1,u.state.buffers.depth.getReversed()&&(u.setRenderTarget(s),u.clearDepth(),u.setRenderTarget(null));const v=new ds({name:"PMREM.Background",side:Tn,depthWrite:!1,depthTest:!1}),g=new mt(new be,v);let m=!1;const _=t.background;_?_.isColor&&(v.color.copy(_),t.background=null,m=!0):(v.color.copy(rd),m=!0);for(let x=0;x<6;x++){const b=x%3;b===0?(c.up.set(0,l[x],0),c.position.set(r.x,r.y,r.z),c.lookAt(r.x+h[x],r.y,r.z)):b===1?(c.up.set(0,0,l[x]),c.position.set(r.x,r.y,r.z),c.lookAt(r.x,r.y+h[x],r.z)):(c.up.set(0,l[x],0),c.position.set(r.x,r.y,r.z),c.lookAt(r.x,r.y,r.z+h[x]));const w=this._cubeSize;wc(s,b*w,x>2?w:0,w,w),u.setRenderTarget(s),m&&u.render(g,c),u.render(t,c)}g.geometry.dispose(),g.material.dispose(),u.toneMapping=f,u.autoClear=d,t.background=_}_textureToCubeUV(t,e){const i=this._renderer,s=t.mapping===Aa||t.mapping===Ra;s?(this._cubemapMaterial===null&&(this._cubemapMaterial=ld()),this._cubemapMaterial.uniforms.flipEnvMap.value=t.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=cd());const r=s?this._cubemapMaterial:this._equirectMaterial,a=new mt(this._lodPlanes[0],r),o=r.uniforms;o.envMap.value=t;const c=this._cubeSize;wc(e,0,0,3*c,2*c),i.setRenderTarget(e),i.render(a,lh)}_applyPMREM(t){const e=this._renderer,i=e.autoClear;e.autoClear=!1;const s=this._lodPlanes.length;for(let r=1;r<s;r++){const a=Math.sqrt(this._sigmas[r]*this._sigmas[r]-this._sigmas[r-1]*this._sigmas[r-1]),o=ad[(s-r-1)%ad.length];this._blur(t,r-1,r,a,o)}e.autoClear=i}_blur(t,e,i,s,r){const a=this._pingPongRenderTarget;this._halfBlur(t,a,e,i,s,"latitudinal",r),this._halfBlur(a,t,i,i,s,"longitudinal",r)}_halfBlur(t,e,i,s,r,a,o){const c=this._renderer,l=this._blurMaterial;a!=="latitudinal"&&a!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const h=3,u=new mt(this._lodPlanes[s],l),d=l.uniforms,f=this._sizeLods[i]-1,p=isFinite(r)?Math.PI/(2*f):2*Math.PI/(2*er-1),v=r/p,g=isFinite(r)?1+Math.floor(h*v):er;g>er&&console.warn(`sigmaRadians, ${r}, is too large and will clip, as it requested ${g} samples when the maximum is set to ${er}`);const m=[];let _=0;for(let A=0;A<er;++A){const T=A/v,M=Math.exp(-T*T/2);m.push(M),A===0?_+=M:A<g&&(_+=2*M)}for(let A=0;A<m.length;A++)m[A]=m[A]/_;d.envMap.value=t.texture,d.samples.value=g,d.weights.value=m,d.latitudinal.value=a==="latitudinal",o&&(d.poleAxis.value=o);const{_lodMax:x}=this;d.dTheta.value=p,d.mipInt.value=x-i;const b=this._sizeLods[s],w=3*b*(s>x-la?s-x+la:0),E=4*(this._cubeSize-b);wc(e,w,E,3*b,2*b),c.setRenderTarget(e),c.render(u,lh)}}function e3(n){const t=[],e=[],i=[];let s=n;const r=n-la+1+sd.length;for(let a=0;a<r;a++){const o=Math.pow(2,s);e.push(o);let c=1/o;a>n-la?c=sd[a-n+la-1]:a===0&&(c=0),i.push(c);const l=1/(o-2),h=-l,u=1+l,d=[h,h,u,h,u,u,h,h,u,u,h,u],f=6,p=6,v=3,g=2,m=1,_=new Float32Array(v*p*f),x=new Float32Array(g*p*f),b=new Float32Array(m*p*f);for(let E=0;E<f;E++){const A=E%3*2/3-1,T=E>2?0:-1,M=[A,T,0,A+2/3,T,0,A+2/3,T+1,0,A,T,0,A+2/3,T+1,0,A,T+1,0];_.set(M,v*p*E),x.set(d,g*p*E);const y=[E,E,E,E,E,E];b.set(y,m*p*E)}const w=new me;w.setAttribute("position",new Kt(_,v)),w.setAttribute("uv",new Kt(x,g)),w.setAttribute("faceIndex",new Kt(b,m)),t.push(w),s>la&&s--}return{lodPlanes:t,sizeLods:e,sigmas:i}}function od(n,t,e){const i=new dn(n,t,e);return i.texture.mapping=Ml,i.texture.name="PMREM.cubeUv",i.scissorTest=!0,i}function wc(n,t,e,i,s){n.viewport.set(t,e,i,s),n.scissor.set(t,e,i,s)}function n3(n,t,e){const i=new Float32Array(er),s=new C(0,1,0);return new Ze({name:"SphericalGaussianBlur",defines:{n:er,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/e,CUBEUV_MAX_MIP:`${n}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:i},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:s}},vertexShader:E0(),fragmentShader:`

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
		`,blending:Us,depthTest:!1,depthWrite:!1})}function cd(){return new Ze({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:E0(),fragmentShader:`

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
		`,blending:Us,depthTest:!1,depthWrite:!1})}function ld(){return new Ze({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:E0(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:Us,depthTest:!1,depthWrite:!1})}function E0(){return`

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
	`}function i3(n){let t=new WeakMap,e=null;function i(o){if(o&&o.isTexture){const c=o.mapping,l=c===Yc||c===Zh,h=c===Aa||c===Ra;if(l||h){let u=t.get(o);const d=u!==void 0?u.texture.pmremVersion:0;if(o.isRenderTargetTexture&&o.pmremVersion!==d)return e===null&&(e=new Pu(n)),u=l?e.fromEquirectangular(o,u):e.fromCubemap(o,u),u.texture.pmremVersion=o.pmremVersion,t.set(o,u),u.texture;if(u!==void 0)return u.texture;{const f=o.image;return l&&f&&f.height>0||h&&f&&s(f)?(e===null&&(e=new Pu(n)),u=l?e.fromEquirectangular(o):e.fromCubemap(o),u.texture.pmremVersion=o.pmremVersion,t.set(o,u),o.addEventListener("dispose",r),u.texture):null}}}return o}function s(o){let c=0;const l=6;for(let h=0;h<l;h++)o[h]!==void 0&&c++;return c===l}function r(o){const c=o.target;c.removeEventListener("dispose",r);const l=t.get(c);l!==void 0&&(t.delete(c),l.dispose())}function a(){t=new WeakMap,e!==null&&(e.dispose(),e=null)}return{get:i,dispose:a}}function s3(n){const t={};function e(i){if(t[i]!==void 0)return t[i];let s;switch(i){case"WEBGL_depth_texture":s=n.getExtension("WEBGL_depth_texture")||n.getExtension("MOZ_WEBGL_depth_texture")||n.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":s=n.getExtension("EXT_texture_filter_anisotropic")||n.getExtension("MOZ_EXT_texture_filter_anisotropic")||n.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":s=n.getExtension("WEBGL_compressed_texture_s3tc")||n.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||n.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":s=n.getExtension("WEBGL_compressed_texture_pvrtc")||n.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:s=n.getExtension(i)}return t[i]=s,s}return{has:function(i){return e(i)!==null},init:function(){e("EXT_color_buffer_float"),e("WEBGL_clip_cull_distance"),e("OES_texture_float_linear"),e("EXT_color_buffer_half_float"),e("WEBGL_multisampled_render_to_texture"),e("WEBGL_render_shared_exponent")},get:function(i){const s=e(i);return s===null&&bo("THREE.WebGLRenderer: "+i+" extension not supported."),s}}}function r3(n,t,e,i){const s={},r=new WeakMap;function a(u){const d=u.target;d.index!==null&&t.remove(d.index);for(const p in d.attributes)t.remove(d.attributes[p]);d.removeEventListener("dispose",a),delete s[d.id];const f=r.get(d);f&&(t.remove(f),r.delete(d)),i.releaseStatesOfGeometry(d),d.isInstancedBufferGeometry===!0&&delete d._maxInstanceCount,e.memory.geometries--}function o(u,d){return s[d.id]===!0||(d.addEventListener("dispose",a),s[d.id]=!0,e.memory.geometries++),d}function c(u){const d=u.attributes;for(const f in d)t.update(d[f],n.ARRAY_BUFFER)}function l(u){const d=[],f=u.index,p=u.attributes.position;let v=0;if(f!==null){const _=f.array;v=f.version;for(let x=0,b=_.length;x<b;x+=3){const w=_[x+0],E=_[x+1],A=_[x+2];d.push(w,E,E,A,A,w)}}else if(p!==void 0){const _=p.array;v=p.version;for(let x=0,b=_.length/3-1;x<b;x+=3){const w=x+0,E=x+1,A=x+2;d.push(w,E,E,A,A,w)}}else return;const g=new(fp(d)?gp:mp)(d,1);g.version=v;const m=r.get(u);m&&t.remove(m),r.set(u,g)}function h(u){const d=r.get(u);if(d){const f=u.index;f!==null&&d.version<f.version&&l(u)}else l(u);return r.get(u)}return{get:o,update:c,getWireframeAttribute:h}}function a3(n,t,e){let i;function s(d){i=d}let r,a;function o(d){r=d.type,a=d.bytesPerElement}function c(d,f){n.drawElements(i,f,r,d*a),e.update(f,i,1)}function l(d,f,p){p!==0&&(n.drawElementsInstanced(i,f,r,d*a,p),e.update(f,i,p))}function h(d,f,p){if(p===0)return;t.get("WEBGL_multi_draw").multiDrawElementsWEBGL(i,f,0,r,d,0,p);let g=0;for(let m=0;m<p;m++)g+=f[m];e.update(g,i,1)}function u(d,f,p,v){if(p===0)return;const g=t.get("WEBGL_multi_draw");if(g===null)for(let m=0;m<d.length;m++)l(d[m]/a,f[m],v[m]);else{g.multiDrawElementsInstancedWEBGL(i,f,0,r,d,0,v,0,p);let m=0;for(let _=0;_<p;_++)m+=f[_]*v[_];e.update(m,i,1)}}this.setMode=s,this.setIndex=o,this.render=c,this.renderInstances=l,this.renderMultiDraw=h,this.renderMultiDrawInstances=u}function o3(n){const t={geometries:0,textures:0},e={frame:0,calls:0,triangles:0,points:0,lines:0};function i(r,a,o){switch(e.calls++,a){case n.TRIANGLES:e.triangles+=o*(r/3);break;case n.LINES:e.lines+=o*(r/2);break;case n.LINE_STRIP:e.lines+=o*(r-1);break;case n.LINE_LOOP:e.lines+=o*r;break;case n.POINTS:e.points+=o*r;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",a);break}}function s(){e.calls=0,e.triangles=0,e.points=0,e.lines=0}return{memory:t,render:e,programs:null,autoReset:!0,reset:s,update:i}}function c3(n,t,e){const i=new WeakMap,s=new de;function r(a,o,c){const l=a.morphTargetInfluences,h=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,u=h!==void 0?h.length:0;let d=i.get(o);if(d===void 0||d.count!==u){let M=function(){A.dispose(),i.delete(o),o.removeEventListener("dispose",M)};d!==void 0&&d.texture.dispose();const f=o.morphAttributes.position!==void 0,p=o.morphAttributes.normal!==void 0,v=o.morphAttributes.color!==void 0,g=o.morphAttributes.position||[],m=o.morphAttributes.normal||[],_=o.morphAttributes.color||[];let x=0;f===!0&&(x=1),p===!0&&(x=2),v===!0&&(x=3);let b=o.attributes.position.count*x,w=1;b>t.maxTextureSize&&(w=Math.ceil(b/t.maxTextureSize),b=t.maxTextureSize);const E=new Float32Array(b*w*4*u),A=new d0(E,b,w,u);A.type=Bi,A.needsUpdate=!0;const T=x*4;for(let y=0;y<u;y++){const S=g[y],R=m[y],I=_[y],L=b*w*4*y;for(let D=0;D<S.count;D++){const k=D*T;f===!0&&(s.fromBufferAttribute(S,D),E[L+k+0]=s.x,E[L+k+1]=s.y,E[L+k+2]=s.z,E[L+k+3]=0),p===!0&&(s.fromBufferAttribute(R,D),E[L+k+4]=s.x,E[L+k+5]=s.y,E[L+k+6]=s.z,E[L+k+7]=0),v===!0&&(s.fromBufferAttribute(I,D),E[L+k+8]=s.x,E[L+k+9]=s.y,E[L+k+10]=s.z,E[L+k+11]=I.itemSize===4?s.w:1)}}d={count:u,texture:A,size:new ht(b,w)},i.set(o,d),o.addEventListener("dispose",M)}if(a.isInstancedMesh===!0&&a.morphTexture!==null)c.getUniforms().setValue(n,"morphTexture",a.morphTexture,e);else{let f=0;for(let v=0;v<l.length;v++)f+=l[v];const p=o.morphTargetsRelative?1:1-f;c.getUniforms().setValue(n,"morphTargetBaseInfluence",p),c.getUniforms().setValue(n,"morphTargetInfluences",l)}c.getUniforms().setValue(n,"morphTargetsTexture",d.texture,e),c.getUniforms().setValue(n,"morphTargetsTextureSize",d.size)}return{update:r}}function l3(n,t,e,i){let s=new WeakMap;function r(c){const l=i.render.frame,h=c.geometry,u=t.get(c,h);if(s.get(u)!==l&&(t.update(u),s.set(u,l)),c.isInstancedMesh&&(c.hasEventListener("dispose",o)===!1&&c.addEventListener("dispose",o),s.get(c)!==l&&(e.update(c.instanceMatrix,n.ARRAY_BUFFER),c.instanceColor!==null&&e.update(c.instanceColor,n.ARRAY_BUFFER),s.set(c,l))),c.isSkinnedMesh){const d=c.skeleton;s.get(d)!==l&&(d.update(),s.set(d,l))}return u}function a(){s=new WeakMap}function o(c){const l=c.target;l.removeEventListener("dispose",o),e.remove(l.instanceMatrix),l.instanceColor!==null&&e.remove(l.instanceColor)}return{update:r,dispose:a}}const Op=new Qe,hd=new Sp(1,1),kp=new d0,Bp=new Y2,Hp=new _p,ud=[],fd=[],dd=new Float32Array(16),pd=new Float32Array(9),md=new Float32Array(4);function ka(n,t,e){const i=n[0];if(i<=0||i>0)return n;const s=t*e;let r=ud[s];if(r===void 0&&(r=new Float32Array(s),ud[s]=r),t!==0){i.toArray(r,0);for(let a=1,o=0;a!==t;++a)o+=e,n[a].toArray(r,o)}return r}function qe(n,t){if(n.length!==t.length)return!1;for(let e=0,i=n.length;e<i;e++)if(n[e]!==t[e])return!1;return!0}function $e(n,t){for(let e=0,i=t.length;e<i;e++)n[e]=t[e]}function yl(n,t){let e=fd[t];e===void 0&&(e=new Int32Array(t),fd[t]=e);for(let i=0;i!==t;++i)e[i]=n.allocateTextureUnit();return e}function h3(n,t){const e=this.cache;e[0]!==t&&(n.uniform1f(this.addr,t),e[0]=t)}function u3(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(n.uniform2f(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(qe(e,t))return;n.uniform2fv(this.addr,t),$e(e,t)}}function f3(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(n.uniform3f(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else if(t.r!==void 0)(e[0]!==t.r||e[1]!==t.g||e[2]!==t.b)&&(n.uniform3f(this.addr,t.r,t.g,t.b),e[0]=t.r,e[1]=t.g,e[2]=t.b);else{if(qe(e,t))return;n.uniform3fv(this.addr,t),$e(e,t)}}function d3(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(n.uniform4f(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(qe(e,t))return;n.uniform4fv(this.addr,t),$e(e,t)}}function p3(n,t){const e=this.cache,i=t.elements;if(i===void 0){if(qe(e,t))return;n.uniformMatrix2fv(this.addr,!1,t),$e(e,t)}else{if(qe(e,i))return;md.set(i),n.uniformMatrix2fv(this.addr,!1,md),$e(e,i)}}function m3(n,t){const e=this.cache,i=t.elements;if(i===void 0){if(qe(e,t))return;n.uniformMatrix3fv(this.addr,!1,t),$e(e,t)}else{if(qe(e,i))return;pd.set(i),n.uniformMatrix3fv(this.addr,!1,pd),$e(e,i)}}function g3(n,t){const e=this.cache,i=t.elements;if(i===void 0){if(qe(e,t))return;n.uniformMatrix4fv(this.addr,!1,t),$e(e,t)}else{if(qe(e,i))return;dd.set(i),n.uniformMatrix4fv(this.addr,!1,dd),$e(e,i)}}function v3(n,t){const e=this.cache;e[0]!==t&&(n.uniform1i(this.addr,t),e[0]=t)}function x3(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(n.uniform2i(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(qe(e,t))return;n.uniform2iv(this.addr,t),$e(e,t)}}function _3(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(n.uniform3i(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(qe(e,t))return;n.uniform3iv(this.addr,t),$e(e,t)}}function M3(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(n.uniform4i(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(qe(e,t))return;n.uniform4iv(this.addr,t),$e(e,t)}}function b3(n,t){const e=this.cache;e[0]!==t&&(n.uniform1ui(this.addr,t),e[0]=t)}function y3(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(n.uniform2ui(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(qe(e,t))return;n.uniform2uiv(this.addr,t),$e(e,t)}}function w3(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(n.uniform3ui(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(qe(e,t))return;n.uniform3uiv(this.addr,t),$e(e,t)}}function S3(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(n.uniform4ui(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(qe(e,t))return;n.uniform4uiv(this.addr,t),$e(e,t)}}function E3(n,t,e){const i=this.cache,s=e.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s);let r;this.type===n.SAMPLER_2D_SHADOW?(hd.compareFunction=up,r=hd):r=Op,e.setTexture2D(t||r,s)}function T3(n,t,e){const i=this.cache,s=e.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s),e.setTexture3D(t||Bp,s)}function A3(n,t,e){const i=this.cache,s=e.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s),e.setTextureCube(t||Hp,s)}function R3(n,t,e){const i=this.cache,s=e.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s),e.setTexture2DArray(t||kp,s)}function C3(n){switch(n){case 5126:return h3;case 35664:return u3;case 35665:return f3;case 35666:return d3;case 35674:return p3;case 35675:return m3;case 35676:return g3;case 5124:case 35670:return v3;case 35667:case 35671:return x3;case 35668:case 35672:return _3;case 35669:case 35673:return M3;case 5125:return b3;case 36294:return y3;case 36295:return w3;case 36296:return S3;case 35678:case 36198:case 36298:case 36306:case 35682:return E3;case 35679:case 36299:case 36307:return T3;case 35680:case 36300:case 36308:case 36293:return A3;case 36289:case 36303:case 36311:case 36292:return R3}}function L3(n,t){n.uniform1fv(this.addr,t)}function P3(n,t){const e=ka(t,this.size,2);n.uniform2fv(this.addr,e)}function I3(n,t){const e=ka(t,this.size,3);n.uniform3fv(this.addr,e)}function D3(n,t){const e=ka(t,this.size,4);n.uniform4fv(this.addr,e)}function U3(n,t){const e=ka(t,this.size,4);n.uniformMatrix2fv(this.addr,!1,e)}function N3(n,t){const e=ka(t,this.size,9);n.uniformMatrix3fv(this.addr,!1,e)}function F3(n,t){const e=ka(t,this.size,16);n.uniformMatrix4fv(this.addr,!1,e)}function O3(n,t){n.uniform1iv(this.addr,t)}function k3(n,t){n.uniform2iv(this.addr,t)}function B3(n,t){n.uniform3iv(this.addr,t)}function H3(n,t){n.uniform4iv(this.addr,t)}function V3(n,t){n.uniform1uiv(this.addr,t)}function z3(n,t){n.uniform2uiv(this.addr,t)}function G3(n,t){n.uniform3uiv(this.addr,t)}function W3(n,t){n.uniform4uiv(this.addr,t)}function X3(n,t,e){const i=this.cache,s=t.length,r=yl(e,s);qe(i,r)||(n.uniform1iv(this.addr,r),$e(i,r));for(let a=0;a!==s;++a)e.setTexture2D(t[a]||Op,r[a])}function q3(n,t,e){const i=this.cache,s=t.length,r=yl(e,s);qe(i,r)||(n.uniform1iv(this.addr,r),$e(i,r));for(let a=0;a!==s;++a)e.setTexture3D(t[a]||Bp,r[a])}function $3(n,t,e){const i=this.cache,s=t.length,r=yl(e,s);qe(i,r)||(n.uniform1iv(this.addr,r),$e(i,r));for(let a=0;a!==s;++a)e.setTextureCube(t[a]||Hp,r[a])}function Y3(n,t,e){const i=this.cache,s=t.length,r=yl(e,s);qe(i,r)||(n.uniform1iv(this.addr,r),$e(i,r));for(let a=0;a!==s;++a)e.setTexture2DArray(t[a]||kp,r[a])}function j3(n){switch(n){case 5126:return L3;case 35664:return P3;case 35665:return I3;case 35666:return D3;case 35674:return U3;case 35675:return N3;case 35676:return F3;case 5124:case 35670:return O3;case 35667:case 35671:return k3;case 35668:case 35672:return B3;case 35669:case 35673:return H3;case 5125:return V3;case 36294:return z3;case 36295:return G3;case 36296:return W3;case 35678:case 36198:case 36298:case 36306:case 35682:return X3;case 35679:case 36299:case 36307:return q3;case 35680:case 36300:case 36308:case 36293:return $3;case 36289:case 36303:case 36311:case 36292:return Y3}}class Z3{constructor(t,e,i){this.id=t,this.addr=i,this.cache=[],this.type=e.type,this.setValue=C3(e.type)}}class K3{constructor(t,e,i){this.id=t,this.addr=i,this.cache=[],this.type=e.type,this.size=e.size,this.setValue=j3(e.type)}}class J3{constructor(t){this.id=t,this.seq=[],this.map={}}setValue(t,e,i){const s=this.seq;for(let r=0,a=s.length;r!==a;++r){const o=s[r];o.setValue(t,e[o.id],i)}}}const ph=/(\w+)(\])?(\[|\.)?/g;function gd(n,t){n.seq.push(t),n.map[t.id]=t}function Q3(n,t,e){const i=n.name,s=i.length;for(ph.lastIndex=0;;){const r=ph.exec(i),a=ph.lastIndex;let o=r[1];const c=r[2]==="]",l=r[3];if(c&&(o=o|0),l===void 0||l==="["&&a+2===s){gd(e,l===void 0?new Z3(o,n,t):new K3(o,n,t));break}else{let u=e.map[o];u===void 0&&(u=new J3(o),gd(e,u)),e=u}}}class kc{constructor(t,e){this.seq=[],this.map={};const i=t.getProgramParameter(e,t.ACTIVE_UNIFORMS);for(let s=0;s<i;++s){const r=t.getActiveUniform(e,s),a=t.getUniformLocation(e,r.name);Q3(r,a,this)}}setValue(t,e,i,s){const r=this.map[e];r!==void 0&&r.setValue(t,i,s)}setOptional(t,e,i){const s=e[i];s!==void 0&&this.setValue(t,i,s)}static upload(t,e,i,s){for(let r=0,a=e.length;r!==a;++r){const o=e[r],c=i[o.id];c.needsUpdate!==!1&&o.setValue(t,c.value,s)}}static seqWithValue(t,e){const i=[];for(let s=0,r=t.length;s!==r;++s){const a=t[s];a.id in e&&i.push(a)}return i}}function vd(n,t,e){const i=n.createShader(t);return n.shaderSource(i,e),n.compileShader(i),i}const tb=37297;let eb=0;function nb(n,t){const e=n.split(`
`),i=[],s=Math.max(t-6,0),r=Math.min(t+6,e.length);for(let a=s;a<r;a++){const o=a+1;i.push(`${o===t?">":" "} ${o}: ${e[a]}`)}return i.join(`
`)}const xd=new ne;function ib(n){ue._getMatrix(xd,ue.workingColorSpace,n);const t=`mat3( ${xd.elements.map(e=>e.toFixed(4))} )`;switch(ue.getTransfer(n)){case jc:return[t,"LinearTransferOETF"];case xe:return[t,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space: ",n),[t,"LinearTransferOETF"]}}function _d(n,t,e){const i=n.getShaderParameter(t,n.COMPILE_STATUS),r=(n.getShaderInfoLog(t)||"").trim();if(i&&r==="")return"";const a=/ERROR: 0:(\d+)/.exec(r);if(a){const o=parseInt(a[1]);return e.toUpperCase()+`

`+r+`

`+nb(n.getShaderSource(t),o)}else return r}function sb(n,t){const e=ib(t);return[`vec4 ${n}( vec4 value ) {`,`	return ${e[1]}( vec4( value.rgb * ${e[0]}, value.a ) );`,"}"].join(`
`)}function rb(n,t){let e;switch(t){case a2:e="Linear";break;case o2:e="Reinhard";break;case c2:e="Cineon";break;case l2:e="ACESFilmic";break;case u2:e="AgX";break;case tp:e="Neutral";break;case h2:e="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",t),e="Linear"}return"vec3 "+n+"( vec3 color ) { return "+e+"ToneMapping( color ); }"}const Sc=new C;function ab(){ue.getLuminanceCoefficients(Sc);const n=Sc.x.toFixed(4),t=Sc.y.toFixed(4),e=Sc.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${n}, ${t}, ${e} );`,"	return dot( weights, rgb );","}"].join(`
`)}function ob(n){return[n.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",n.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(oo).join(`
`)}function cb(n){const t=[];for(const e in n){const i=n[e];i!==!1&&t.push("#define "+e+" "+i)}return t.join(`
`)}function lb(n,t){const e={},i=n.getProgramParameter(t,n.ACTIVE_ATTRIBUTES);for(let s=0;s<i;s++){const r=n.getActiveAttrib(t,s),a=r.name;let o=1;r.type===n.FLOAT_MAT2&&(o=2),r.type===n.FLOAT_MAT3&&(o=3),r.type===n.FLOAT_MAT4&&(o=4),e[a]={type:r.type,location:n.getAttribLocation(t,a),locationSize:o}}return e}function oo(n){return n!==""}function Md(n,t){const e=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return n.replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,e).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows)}function bd(n,t){return n.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}const hb=/^[ \t]*#include +<([\w\d./]+)>/gm;function Iu(n){return n.replace(hb,fb)}const ub=new Map;function fb(n,t){let e=ae[t];if(e===void 0){const i=ub.get(t);if(i!==void 0)e=ae[i],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',t,i);else throw new Error("Can not resolve #include <"+t+">")}return Iu(e)}const db=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function yd(n){return n.replace(db,pb)}function pb(n,t,e,i){let s="";for(let r=parseInt(t);r<parseInt(e);r++)s+=i.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return s}function wd(n){let t=`precision ${n.precision} float;
	precision ${n.precision} int;
	precision ${n.precision} sampler2D;
	precision ${n.precision} samplerCube;
	precision ${n.precision} sampler3D;
	precision ${n.precision} sampler2DArray;
	precision ${n.precision} sampler2DShadow;
	precision ${n.precision} samplerCubeShadow;
	precision ${n.precision} sampler2DArrayShadow;
	precision ${n.precision} isampler2D;
	precision ${n.precision} isampler3D;
	precision ${n.precision} isamplerCube;
	precision ${n.precision} isampler2DArray;
	precision ${n.precision} usampler2D;
	precision ${n.precision} usampler3D;
	precision ${n.precision} usamplerCube;
	precision ${n.precision} usampler2DArray;
	`;return n.precision==="highp"?t+=`
#define HIGH_PRECISION`:n.precision==="mediump"?t+=`
#define MEDIUM_PRECISION`:n.precision==="lowp"&&(t+=`
#define LOW_PRECISION`),t}function mb(n){let t="SHADOWMAP_TYPE_BASIC";return n.shadowMapType===Y1?t="SHADOWMAP_TYPE_PCF":n.shadowMapType===j1?t="SHADOWMAP_TYPE_PCF_SOFT":n.shadowMapType===Qi&&(t="SHADOWMAP_TYPE_VSM"),t}function gb(n){let t="ENVMAP_TYPE_CUBE";if(n.envMap)switch(n.envMapMode){case Aa:case Ra:t="ENVMAP_TYPE_CUBE";break;case Ml:t="ENVMAP_TYPE_CUBE_UV";break}return t}function vb(n){let t="ENVMAP_MODE_REFLECTION";if(n.envMap)switch(n.envMapMode){case Ra:t="ENVMAP_MODE_REFRACTION";break}return t}function xb(n){let t="ENVMAP_BLENDING_NONE";if(n.envMap)switch(n.combine){case Q1:t="ENVMAP_BLENDING_MULTIPLY";break;case s2:t="ENVMAP_BLENDING_MIX";break;case r2:t="ENVMAP_BLENDING_ADD";break}return t}function _b(n){const t=n.envMapCubeUVHeight;if(t===null)return null;const e=Math.log2(t)-2,i=1/t;return{texelWidth:1/(3*Math.max(Math.pow(2,e),112)),texelHeight:i,maxMip:e}}function Mb(n,t,e,i){const s=n.getContext(),r=e.defines;let a=e.vertexShader,o=e.fragmentShader;const c=mb(e),l=gb(e),h=vb(e),u=xb(e),d=_b(e),f=ob(e),p=cb(r),v=s.createProgram();let g,m,_=e.glslVersion?"#version "+e.glslVersion+`
`:"";e.isRawShaderMaterial?(g=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,p].filter(oo).join(`
`),g.length>0&&(g+=`
`),m=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,p].filter(oo).join(`
`),m.length>0&&(m+=`
`)):(g=[wd(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,p,e.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",e.batching?"#define USE_BATCHING":"",e.batchingColor?"#define USE_BATCHING_COLOR":"",e.instancing?"#define USE_INSTANCING":"",e.instancingColor?"#define USE_INSTANCING_COLOR":"",e.instancingMorph?"#define USE_INSTANCING_MORPH":"",e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.map?"#define USE_MAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+h:"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.displacementMap?"#define USE_DISPLACEMENTMAP":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.mapUv?"#define MAP_UV "+e.mapUv:"",e.alphaMapUv?"#define ALPHAMAP_UV "+e.alphaMapUv:"",e.lightMapUv?"#define LIGHTMAP_UV "+e.lightMapUv:"",e.aoMapUv?"#define AOMAP_UV "+e.aoMapUv:"",e.emissiveMapUv?"#define EMISSIVEMAP_UV "+e.emissiveMapUv:"",e.bumpMapUv?"#define BUMPMAP_UV "+e.bumpMapUv:"",e.normalMapUv?"#define NORMALMAP_UV "+e.normalMapUv:"",e.displacementMapUv?"#define DISPLACEMENTMAP_UV "+e.displacementMapUv:"",e.metalnessMapUv?"#define METALNESSMAP_UV "+e.metalnessMapUv:"",e.roughnessMapUv?"#define ROUGHNESSMAP_UV "+e.roughnessMapUv:"",e.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+e.anisotropyMapUv:"",e.clearcoatMapUv?"#define CLEARCOATMAP_UV "+e.clearcoatMapUv:"",e.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+e.clearcoatNormalMapUv:"",e.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+e.clearcoatRoughnessMapUv:"",e.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+e.iridescenceMapUv:"",e.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+e.iridescenceThicknessMapUv:"",e.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+e.sheenColorMapUv:"",e.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+e.sheenRoughnessMapUv:"",e.specularMapUv?"#define SPECULARMAP_UV "+e.specularMapUv:"",e.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+e.specularColorMapUv:"",e.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+e.specularIntensityMapUv:"",e.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+e.transmissionMapUv:"",e.thicknessMapUv?"#define THICKNESSMAP_UV "+e.thicknessMapUv:"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.flatShading?"#define FLAT_SHADED":"",e.skinning?"#define USE_SKINNING":"",e.morphTargets?"#define USE_MORPHTARGETS":"",e.morphNormals&&e.flatShading===!1?"#define USE_MORPHNORMALS":"",e.morphColors?"#define USE_MORPHCOLORS":"",e.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+e.morphTextureStride:"",e.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+e.morphTargetsCount:"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+c:"",e.sizeAttenuation?"#define USE_SIZEATTENUATION":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",e.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(oo).join(`
`),m=[wd(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,p,e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",e.map?"#define USE_MAP":"",e.matcap?"#define USE_MATCAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+l:"",e.envMap?"#define "+h:"",e.envMap?"#define "+u:"",d?"#define CUBEUV_TEXEL_WIDTH "+d.texelWidth:"",d?"#define CUBEUV_TEXEL_HEIGHT "+d.texelHeight:"",d?"#define CUBEUV_MAX_MIP "+d.maxMip+".0":"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoat?"#define USE_CLEARCOAT":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.dispersion?"#define USE_DISPERSION":"",e.iridescence?"#define USE_IRIDESCENCE":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaTest?"#define USE_ALPHATEST":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.sheen?"#define USE_SHEEN":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors||e.instancingColor||e.batchingColor?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.gradientMap?"#define USE_GRADIENTMAP":"",e.flatShading?"#define FLAT_SHADED":"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+c:"",e.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",e.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",e.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",e.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",e.toneMapping!==Ns?"#define TONE_MAPPING":"",e.toneMapping!==Ns?ae.tonemapping_pars_fragment:"",e.toneMapping!==Ns?rb("toneMapping",e.toneMapping):"",e.dithering?"#define DITHERING":"",e.opaque?"#define OPAQUE":"",ae.colorspace_pars_fragment,sb("linearToOutputTexel",e.outputColorSpace),ab(),e.useDepthPacking?"#define DEPTH_PACKING "+e.depthPacking:"",`
`].filter(oo).join(`
`)),a=Iu(a),a=Md(a,e),a=bd(a,e),o=Iu(o),o=Md(o,e),o=bd(o,e),a=yd(a),o=yd(o),e.isRawShaderMaterial!==!0&&(_=`#version 300 es
`,g=[f,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+g,m=["#define varying in",e.glslVersion===Mf?"":"layout(location = 0) out highp vec4 pc_fragColor;",e.glslVersion===Mf?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+m);const x=_+g+a,b=_+m+o,w=vd(s,s.VERTEX_SHADER,x),E=vd(s,s.FRAGMENT_SHADER,b);s.attachShader(v,w),s.attachShader(v,E),e.index0AttributeName!==void 0?s.bindAttribLocation(v,0,e.index0AttributeName):e.morphTargets===!0&&s.bindAttribLocation(v,0,"position"),s.linkProgram(v);function A(S){if(n.debug.checkShaderErrors){const R=s.getProgramInfoLog(v)||"",I=s.getShaderInfoLog(w)||"",L=s.getShaderInfoLog(E)||"",D=R.trim(),k=I.trim(),q=L.trim();let z=!0,it=!0;if(s.getProgramParameter(v,s.LINK_STATUS)===!1)if(z=!1,typeof n.debug.onShaderError=="function")n.debug.onShaderError(s,v,w,E);else{const ut=_d(s,w,"vertex"),gt=_d(s,E,"fragment");console.error("THREE.WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(v,s.VALIDATE_STATUS)+`

Material Name: `+S.name+`
Material Type: `+S.type+`

Program Info Log: `+D+`
`+ut+`
`+gt)}else D!==""?console.warn("THREE.WebGLProgram: Program Info Log:",D):(k===""||q==="")&&(it=!1);it&&(S.diagnostics={runnable:z,programLog:D,vertexShader:{log:k,prefix:g},fragmentShader:{log:q,prefix:m}})}s.deleteShader(w),s.deleteShader(E),T=new kc(s,v),M=lb(s,v)}let T;this.getUniforms=function(){return T===void 0&&A(this),T};let M;this.getAttributes=function(){return M===void 0&&A(this),M};let y=e.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return y===!1&&(y=s.getProgramParameter(v,tb)),y},this.destroy=function(){i.releaseStatesOfProgram(this),s.deleteProgram(v),this.program=void 0},this.type=e.shaderType,this.name=e.shaderName,this.id=eb++,this.cacheKey=t,this.usedTimes=1,this.program=v,this.vertexShader=w,this.fragmentShader=E,this}let bb=0;class yb{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(t){const e=t.vertexShader,i=t.fragmentShader,s=this._getShaderStage(e),r=this._getShaderStage(i),a=this._getShaderCacheForMaterial(t);return a.has(s)===!1&&(a.add(s),s.usedTimes++),a.has(r)===!1&&(a.add(r),r.usedTimes++),this}remove(t){const e=this.materialCache.get(t);for(const i of e)i.usedTimes--,i.usedTimes===0&&this.shaderCache.delete(i.code);return this.materialCache.delete(t),this}getVertexShaderID(t){return this._getShaderStage(t.vertexShader).id}getFragmentShaderID(t){return this._getShaderStage(t.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(t){const e=this.materialCache;let i=e.get(t);return i===void 0&&(i=new Set,e.set(t,i)),i}_getShaderStage(t){const e=this.shaderCache;let i=e.get(t);return i===void 0&&(i=new wb(t),e.set(t,i)),i}}class wb{constructor(t){this.id=bb++,this.code=t,this.usedTimes=0}}function Sb(n,t,e,i,s,r,a){const o=new dp,c=new yb,l=new Set,h=[],u=s.logarithmicDepthBuffer,d=s.vertexTextures;let f=s.precision;const p={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function v(M){return l.add(M),M===0?"uv":`uv${M}`}function g(M,y,S,R,I){const L=R.fog,D=I.geometry,k=M.isMeshStandardMaterial?R.environment:null,q=(M.isMeshStandardMaterial?e:t).get(M.envMap||k),z=q&&q.mapping===Ml?q.image.height:null,it=p[M.type];M.precision!==null&&(f=s.getMaxPrecision(M.precision),f!==M.precision&&console.warn("THREE.WebGLProgram.getParameters:",M.precision,"not supported, using",f,"instead."));const ut=D.morphAttributes.position||D.morphAttributes.normal||D.morphAttributes.color,gt=ut!==void 0?ut.length:0;let _t=0;D.morphAttributes.position!==void 0&&(_t=1),D.morphAttributes.normal!==void 0&&(_t=2),D.morphAttributes.color!==void 0&&(_t=3);let At,Ut,ct,G;if(it){const pe=Ii[it];At=pe.vertexShader,Ut=pe.fragmentShader}else At=M.vertexShader,Ut=M.fragmentShader,c.update(M),ct=c.getVertexShaderID(M),G=c.getFragmentShaderID(M);const J=n.getRenderTarget(),H=n.state.buffers.depth.getReversed(),W=I.isInstancedMesh===!0,V=I.isBatchedMesh===!0,tt=!!M.map,st=!!M.matcap,N=!!q,Q=!!M.aoMap,Z=!!M.lightMap,et=!!M.bumpMap,ot=!!M.normalMap,pt=!!M.displacementMap,Mt=!!M.emissiveMap,yt=!!M.metalnessMap,Jt=!!M.roughnessMap,Yt=M.anisotropy>0,F=M.clearcoat>0,P=M.dispersion>0,j=M.iridescence>0,lt=M.sheen>0,bt=M.transmission>0,dt=Yt&&!!M.anisotropyMap,Vt=F&&!!M.clearcoatMap,Rt=F&&!!M.clearcoatNormalMap,kt=F&&!!M.clearcoatRoughnessMap,Bt=j&&!!M.iridescenceMap,wt=j&&!!M.iridescenceThicknessMap,Dt=lt&&!!M.sheenColorMap,jt=lt&&!!M.sheenRoughnessMap,zt=!!M.specularMap,Pt=!!M.specularColorMap,ee=!!M.specularIntensityMap,X=bt&&!!M.transmissionMap,Tt=bt&&!!M.thicknessMap,Ct=!!M.gradientMap,Ft=!!M.alphaMap,St=M.alphaTest>0,xt=!!M.alphaHash,Ht=!!M.extensions;let te=Ns;M.toneMapped&&(J===null||J.isXRRenderTarget===!0)&&(te=n.toneMapping);const Se={shaderID:it,shaderType:M.type,shaderName:M.name,vertexShader:At,fragmentShader:Ut,defines:M.defines,customVertexShaderID:ct,customFragmentShaderID:G,isRawShaderMaterial:M.isRawShaderMaterial===!0,glslVersion:M.glslVersion,precision:f,batching:V,batchingColor:V&&I._colorsTexture!==null,instancing:W,instancingColor:W&&I.instanceColor!==null,instancingMorph:W&&I.morphTexture!==null,supportsVertexTextures:d,outputColorSpace:J===null?n.outputColorSpace:J.isXRRenderTarget===!0?J.texture.colorSpace:gr,alphaToCoverage:!!M.alphaToCoverage,map:tt,matcap:st,envMap:N,envMapMode:N&&q.mapping,envMapCubeUVHeight:z,aoMap:Q,lightMap:Z,bumpMap:et,normalMap:ot,displacementMap:d&&pt,emissiveMap:Mt,normalMapObjectSpace:ot&&M.normalMapType===g2,normalMapTangentSpace:ot&&M.normalMapType===hp,metalnessMap:yt,roughnessMap:Jt,anisotropy:Yt,anisotropyMap:dt,clearcoat:F,clearcoatMap:Vt,clearcoatNormalMap:Rt,clearcoatRoughnessMap:kt,dispersion:P,iridescence:j,iridescenceMap:Bt,iridescenceThicknessMap:wt,sheen:lt,sheenColorMap:Dt,sheenRoughnessMap:jt,specularMap:zt,specularColorMap:Pt,specularIntensityMap:ee,transmission:bt,transmissionMap:X,thicknessMap:Tt,gradientMap:Ct,opaque:M.transparent===!1&&M.blending===ga&&M.alphaToCoverage===!1,alphaMap:Ft,alphaTest:St,alphaHash:xt,combine:M.combine,mapUv:tt&&v(M.map.channel),aoMapUv:Q&&v(M.aoMap.channel),lightMapUv:Z&&v(M.lightMap.channel),bumpMapUv:et&&v(M.bumpMap.channel),normalMapUv:ot&&v(M.normalMap.channel),displacementMapUv:pt&&v(M.displacementMap.channel),emissiveMapUv:Mt&&v(M.emissiveMap.channel),metalnessMapUv:yt&&v(M.metalnessMap.channel),roughnessMapUv:Jt&&v(M.roughnessMap.channel),anisotropyMapUv:dt&&v(M.anisotropyMap.channel),clearcoatMapUv:Vt&&v(M.clearcoatMap.channel),clearcoatNormalMapUv:Rt&&v(M.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:kt&&v(M.clearcoatRoughnessMap.channel),iridescenceMapUv:Bt&&v(M.iridescenceMap.channel),iridescenceThicknessMapUv:wt&&v(M.iridescenceThicknessMap.channel),sheenColorMapUv:Dt&&v(M.sheenColorMap.channel),sheenRoughnessMapUv:jt&&v(M.sheenRoughnessMap.channel),specularMapUv:zt&&v(M.specularMap.channel),specularColorMapUv:Pt&&v(M.specularColorMap.channel),specularIntensityMapUv:ee&&v(M.specularIntensityMap.channel),transmissionMapUv:X&&v(M.transmissionMap.channel),thicknessMapUv:Tt&&v(M.thicknessMap.channel),alphaMapUv:Ft&&v(M.alphaMap.channel),vertexTangents:!!D.attributes.tangent&&(ot||Yt),vertexColors:M.vertexColors,vertexAlphas:M.vertexColors===!0&&!!D.attributes.color&&D.attributes.color.itemSize===4,pointsUvs:I.isPoints===!0&&!!D.attributes.uv&&(tt||Ft),fog:!!L,useFog:M.fog===!0,fogExp2:!!L&&L.isFogExp2,flatShading:M.flatShading===!0&&M.wireframe===!1,sizeAttenuation:M.sizeAttenuation===!0,logarithmicDepthBuffer:u,reversedDepthBuffer:H,skinning:I.isSkinnedMesh===!0,morphTargets:D.morphAttributes.position!==void 0,morphNormals:D.morphAttributes.normal!==void 0,morphColors:D.morphAttributes.color!==void 0,morphTargetsCount:gt,morphTextureStride:_t,numDirLights:y.directional.length,numPointLights:y.point.length,numSpotLights:y.spot.length,numSpotLightMaps:y.spotLightMap.length,numRectAreaLights:y.rectArea.length,numHemiLights:y.hemi.length,numDirLightShadows:y.directionalShadowMap.length,numPointLightShadows:y.pointShadowMap.length,numSpotLightShadows:y.spotShadowMap.length,numSpotLightShadowsWithMaps:y.numSpotLightShadowsWithMaps,numLightProbes:y.numLightProbes,numClippingPlanes:a.numPlanes,numClipIntersection:a.numIntersection,dithering:M.dithering,shadowMapEnabled:n.shadowMap.enabled&&S.length>0,shadowMapType:n.shadowMap.type,toneMapping:te,decodeVideoTexture:tt&&M.map.isVideoTexture===!0&&ue.getTransfer(M.map.colorSpace)===xe,decodeVideoTextureEmissive:Mt&&M.emissiveMap.isVideoTexture===!0&&ue.getTransfer(M.emissiveMap.colorSpace)===xe,premultipliedAlpha:M.premultipliedAlpha,doubleSided:M.side===ye,flipSided:M.side===Tn,useDepthPacking:M.depthPacking>=0,depthPacking:M.depthPacking||0,index0AttributeName:M.index0AttributeName,extensionClipCullDistance:Ht&&M.extensions.clipCullDistance===!0&&i.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(Ht&&M.extensions.multiDraw===!0||V)&&i.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:i.has("KHR_parallel_shader_compile"),customProgramCacheKey:M.customProgramCacheKey()};return Se.vertexUv1s=l.has(1),Se.vertexUv2s=l.has(2),Se.vertexUv3s=l.has(3),l.clear(),Se}function m(M){const y=[];if(M.shaderID?y.push(M.shaderID):(y.push(M.customVertexShaderID),y.push(M.customFragmentShaderID)),M.defines!==void 0)for(const S in M.defines)y.push(S),y.push(M.defines[S]);return M.isRawShaderMaterial===!1&&(_(y,M),x(y,M),y.push(n.outputColorSpace)),y.push(M.customProgramCacheKey),y.join()}function _(M,y){M.push(y.precision),M.push(y.outputColorSpace),M.push(y.envMapMode),M.push(y.envMapCubeUVHeight),M.push(y.mapUv),M.push(y.alphaMapUv),M.push(y.lightMapUv),M.push(y.aoMapUv),M.push(y.bumpMapUv),M.push(y.normalMapUv),M.push(y.displacementMapUv),M.push(y.emissiveMapUv),M.push(y.metalnessMapUv),M.push(y.roughnessMapUv),M.push(y.anisotropyMapUv),M.push(y.clearcoatMapUv),M.push(y.clearcoatNormalMapUv),M.push(y.clearcoatRoughnessMapUv),M.push(y.iridescenceMapUv),M.push(y.iridescenceThicknessMapUv),M.push(y.sheenColorMapUv),M.push(y.sheenRoughnessMapUv),M.push(y.specularMapUv),M.push(y.specularColorMapUv),M.push(y.specularIntensityMapUv),M.push(y.transmissionMapUv),M.push(y.thicknessMapUv),M.push(y.combine),M.push(y.fogExp2),M.push(y.sizeAttenuation),M.push(y.morphTargetsCount),M.push(y.morphAttributeCount),M.push(y.numDirLights),M.push(y.numPointLights),M.push(y.numSpotLights),M.push(y.numSpotLightMaps),M.push(y.numHemiLights),M.push(y.numRectAreaLights),M.push(y.numDirLightShadows),M.push(y.numPointLightShadows),M.push(y.numSpotLightShadows),M.push(y.numSpotLightShadowsWithMaps),M.push(y.numLightProbes),M.push(y.shadowMapType),M.push(y.toneMapping),M.push(y.numClippingPlanes),M.push(y.numClipIntersection),M.push(y.depthPacking)}function x(M,y){o.disableAll(),y.supportsVertexTextures&&o.enable(0),y.instancing&&o.enable(1),y.instancingColor&&o.enable(2),y.instancingMorph&&o.enable(3),y.matcap&&o.enable(4),y.envMap&&o.enable(5),y.normalMapObjectSpace&&o.enable(6),y.normalMapTangentSpace&&o.enable(7),y.clearcoat&&o.enable(8),y.iridescence&&o.enable(9),y.alphaTest&&o.enable(10),y.vertexColors&&o.enable(11),y.vertexAlphas&&o.enable(12),y.vertexUv1s&&o.enable(13),y.vertexUv2s&&o.enable(14),y.vertexUv3s&&o.enable(15),y.vertexTangents&&o.enable(16),y.anisotropy&&o.enable(17),y.alphaHash&&o.enable(18),y.batching&&o.enable(19),y.dispersion&&o.enable(20),y.batchingColor&&o.enable(21),y.gradientMap&&o.enable(22),M.push(o.mask),o.disableAll(),y.fog&&o.enable(0),y.useFog&&o.enable(1),y.flatShading&&o.enable(2),y.logarithmicDepthBuffer&&o.enable(3),y.reversedDepthBuffer&&o.enable(4),y.skinning&&o.enable(5),y.morphTargets&&o.enable(6),y.morphNormals&&o.enable(7),y.morphColors&&o.enable(8),y.premultipliedAlpha&&o.enable(9),y.shadowMapEnabled&&o.enable(10),y.doubleSided&&o.enable(11),y.flipSided&&o.enable(12),y.useDepthPacking&&o.enable(13),y.dithering&&o.enable(14),y.transmission&&o.enable(15),y.sheen&&o.enable(16),y.opaque&&o.enable(17),y.pointsUvs&&o.enable(18),y.decodeVideoTexture&&o.enable(19),y.decodeVideoTextureEmissive&&o.enable(20),y.alphaToCoverage&&o.enable(21),M.push(o.mask)}function b(M){const y=p[M.type];let S;if(y){const R=Ii[y];S=hv.clone(R.uniforms)}else S=M.uniforms;return S}function w(M,y){let S;for(let R=0,I=h.length;R<I;R++){const L=h[R];if(L.cacheKey===y){S=L,++S.usedTimes;break}}return S===void 0&&(S=new Mb(n,y,M,r),h.push(S)),S}function E(M){if(--M.usedTimes===0){const y=h.indexOf(M);h[y]=h[h.length-1],h.pop(),M.destroy()}}function A(M){c.remove(M)}function T(){c.dispose()}return{getParameters:g,getProgramCacheKey:m,getUniforms:b,acquireProgram:w,releaseProgram:E,releaseShaderCache:A,programs:h,dispose:T}}function Eb(){let n=new WeakMap;function t(a){return n.has(a)}function e(a){let o=n.get(a);return o===void 0&&(o={},n.set(a,o)),o}function i(a){n.delete(a)}function s(a,o,c){n.get(a)[o]=c}function r(){n=new WeakMap}return{has:t,get:e,remove:i,update:s,dispose:r}}function Tb(n,t){return n.groupOrder!==t.groupOrder?n.groupOrder-t.groupOrder:n.renderOrder!==t.renderOrder?n.renderOrder-t.renderOrder:n.material.id!==t.material.id?n.material.id-t.material.id:n.z!==t.z?n.z-t.z:n.id-t.id}function Sd(n,t){return n.groupOrder!==t.groupOrder?n.groupOrder-t.groupOrder:n.renderOrder!==t.renderOrder?n.renderOrder-t.renderOrder:n.z!==t.z?t.z-n.z:n.id-t.id}function Ed(){const n=[];let t=0;const e=[],i=[],s=[];function r(){t=0,e.length=0,i.length=0,s.length=0}function a(u,d,f,p,v,g){let m=n[t];return m===void 0?(m={id:u.id,object:u,geometry:d,material:f,groupOrder:p,renderOrder:u.renderOrder,z:v,group:g},n[t]=m):(m.id=u.id,m.object=u,m.geometry=d,m.material=f,m.groupOrder=p,m.renderOrder=u.renderOrder,m.z=v,m.group=g),t++,m}function o(u,d,f,p,v,g){const m=a(u,d,f,p,v,g);f.transmission>0?i.push(m):f.transparent===!0?s.push(m):e.push(m)}function c(u,d,f,p,v,g){const m=a(u,d,f,p,v,g);f.transmission>0?i.unshift(m):f.transparent===!0?s.unshift(m):e.unshift(m)}function l(u,d){e.length>1&&e.sort(u||Tb),i.length>1&&i.sort(d||Sd),s.length>1&&s.sort(d||Sd)}function h(){for(let u=t,d=n.length;u<d;u++){const f=n[u];if(f.id===null)break;f.id=null,f.object=null,f.geometry=null,f.material=null,f.group=null}}return{opaque:e,transmissive:i,transparent:s,init:r,push:o,unshift:c,finish:h,sort:l}}function Ab(){let n=new WeakMap;function t(i,s){const r=n.get(i);let a;return r===void 0?(a=new Ed,n.set(i,[a])):s>=r.length?(a=new Ed,r.push(a)):a=r[s],a}function e(){n=new WeakMap}return{get:t,dispose:e}}function Rb(){const n={};return{get:function(t){if(n[t.id]!==void 0)return n[t.id];let e;switch(t.type){case"DirectionalLight":e={direction:new C,color:new vt};break;case"SpotLight":e={position:new C,direction:new C,color:new vt,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":e={position:new C,color:new vt,distance:0,decay:0};break;case"HemisphereLight":e={direction:new C,skyColor:new vt,groundColor:new vt};break;case"RectAreaLight":e={color:new vt,position:new C,halfWidth:new C,halfHeight:new C};break}return n[t.id]=e,e}}}function Cb(){const n={};return{get:function(t){if(n[t.id]!==void 0)return n[t.id];let e;switch(t.type){case"DirectionalLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ht};break;case"SpotLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ht};break;case"PointLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ht,shadowCameraNear:1,shadowCameraFar:1e3};break}return n[t.id]=e,e}}}let Lb=0;function Pb(n,t){return(t.castShadow?2:0)-(n.castShadow?2:0)+(t.map?1:0)-(n.map?1:0)}function Ib(n){const t=new Rb,e=Cb(),i={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let l=0;l<9;l++)i.probe.push(new C);const s=new C,r=new se,a=new se;function o(l){let h=0,u=0,d=0;for(let M=0;M<9;M++)i.probe[M].set(0,0,0);let f=0,p=0,v=0,g=0,m=0,_=0,x=0,b=0,w=0,E=0,A=0;l.sort(Pb);for(let M=0,y=l.length;M<y;M++){const S=l[M],R=S.color,I=S.intensity,L=S.distance,D=S.shadow&&S.shadow.map?S.shadow.map.texture:null;if(S.isAmbientLight)h+=R.r*I,u+=R.g*I,d+=R.b*I;else if(S.isLightProbe){for(let k=0;k<9;k++)i.probe[k].addScaledVector(S.sh.coefficients[k],I);A++}else if(S.isDirectionalLight){const k=t.get(S);if(k.color.copy(S.color).multiplyScalar(S.intensity),S.castShadow){const q=S.shadow,z=e.get(S);z.shadowIntensity=q.intensity,z.shadowBias=q.bias,z.shadowNormalBias=q.normalBias,z.shadowRadius=q.radius,z.shadowMapSize=q.mapSize,i.directionalShadow[f]=z,i.directionalShadowMap[f]=D,i.directionalShadowMatrix[f]=S.shadow.matrix,_++}i.directional[f]=k,f++}else if(S.isSpotLight){const k=t.get(S);k.position.setFromMatrixPosition(S.matrixWorld),k.color.copy(R).multiplyScalar(I),k.distance=L,k.coneCos=Math.cos(S.angle),k.penumbraCos=Math.cos(S.angle*(1-S.penumbra)),k.decay=S.decay,i.spot[v]=k;const q=S.shadow;if(S.map&&(i.spotLightMap[w]=S.map,w++,q.updateMatrices(S),S.castShadow&&E++),i.spotLightMatrix[v]=q.matrix,S.castShadow){const z=e.get(S);z.shadowIntensity=q.intensity,z.shadowBias=q.bias,z.shadowNormalBias=q.normalBias,z.shadowRadius=q.radius,z.shadowMapSize=q.mapSize,i.spotShadow[v]=z,i.spotShadowMap[v]=D,b++}v++}else if(S.isRectAreaLight){const k=t.get(S);k.color.copy(R).multiplyScalar(I),k.halfWidth.set(S.width*.5,0,0),k.halfHeight.set(0,S.height*.5,0),i.rectArea[g]=k,g++}else if(S.isPointLight){const k=t.get(S);if(k.color.copy(S.color).multiplyScalar(S.intensity),k.distance=S.distance,k.decay=S.decay,S.castShadow){const q=S.shadow,z=e.get(S);z.shadowIntensity=q.intensity,z.shadowBias=q.bias,z.shadowNormalBias=q.normalBias,z.shadowRadius=q.radius,z.shadowMapSize=q.mapSize,z.shadowCameraNear=q.camera.near,z.shadowCameraFar=q.camera.far,i.pointShadow[p]=z,i.pointShadowMap[p]=D,i.pointShadowMatrix[p]=S.shadow.matrix,x++}i.point[p]=k,p++}else if(S.isHemisphereLight){const k=t.get(S);k.skyColor.copy(S.color).multiplyScalar(I),k.groundColor.copy(S.groundColor).multiplyScalar(I),i.hemi[m]=k,m++}}g>0&&(n.has("OES_texture_float_linear")===!0?(i.rectAreaLTC1=Lt.LTC_FLOAT_1,i.rectAreaLTC2=Lt.LTC_FLOAT_2):(i.rectAreaLTC1=Lt.LTC_HALF_1,i.rectAreaLTC2=Lt.LTC_HALF_2)),i.ambient[0]=h,i.ambient[1]=u,i.ambient[2]=d;const T=i.hash;(T.directionalLength!==f||T.pointLength!==p||T.spotLength!==v||T.rectAreaLength!==g||T.hemiLength!==m||T.numDirectionalShadows!==_||T.numPointShadows!==x||T.numSpotShadows!==b||T.numSpotMaps!==w||T.numLightProbes!==A)&&(i.directional.length=f,i.spot.length=v,i.rectArea.length=g,i.point.length=p,i.hemi.length=m,i.directionalShadow.length=_,i.directionalShadowMap.length=_,i.pointShadow.length=x,i.pointShadowMap.length=x,i.spotShadow.length=b,i.spotShadowMap.length=b,i.directionalShadowMatrix.length=_,i.pointShadowMatrix.length=x,i.spotLightMatrix.length=b+w-E,i.spotLightMap.length=w,i.numSpotLightShadowsWithMaps=E,i.numLightProbes=A,T.directionalLength=f,T.pointLength=p,T.spotLength=v,T.rectAreaLength=g,T.hemiLength=m,T.numDirectionalShadows=_,T.numPointShadows=x,T.numSpotShadows=b,T.numSpotMaps=w,T.numLightProbes=A,i.version=Lb++)}function c(l,h){let u=0,d=0,f=0,p=0,v=0;const g=h.matrixWorldInverse;for(let m=0,_=l.length;m<_;m++){const x=l[m];if(x.isDirectionalLight){const b=i.directional[u];b.direction.setFromMatrixPosition(x.matrixWorld),s.setFromMatrixPosition(x.target.matrixWorld),b.direction.sub(s),b.direction.transformDirection(g),u++}else if(x.isSpotLight){const b=i.spot[f];b.position.setFromMatrixPosition(x.matrixWorld),b.position.applyMatrix4(g),b.direction.setFromMatrixPosition(x.matrixWorld),s.setFromMatrixPosition(x.target.matrixWorld),b.direction.sub(s),b.direction.transformDirection(g),f++}else if(x.isRectAreaLight){const b=i.rectArea[p];b.position.setFromMatrixPosition(x.matrixWorld),b.position.applyMatrix4(g),a.identity(),r.copy(x.matrixWorld),r.premultiply(g),a.extractRotation(r),b.halfWidth.set(x.width*.5,0,0),b.halfHeight.set(0,x.height*.5,0),b.halfWidth.applyMatrix4(a),b.halfHeight.applyMatrix4(a),p++}else if(x.isPointLight){const b=i.point[d];b.position.setFromMatrixPosition(x.matrixWorld),b.position.applyMatrix4(g),d++}else if(x.isHemisphereLight){const b=i.hemi[v];b.direction.setFromMatrixPosition(x.matrixWorld),b.direction.transformDirection(g),v++}}}return{setup:o,setupView:c,state:i}}function Td(n){const t=new Ib(n),e=[],i=[];function s(h){l.camera=h,e.length=0,i.length=0}function r(h){e.push(h)}function a(h){i.push(h)}function o(){t.setup(e)}function c(h){t.setupView(e,h)}const l={lightsArray:e,shadowsArray:i,camera:null,lights:t,transmissionRenderTarget:{}};return{init:s,state:l,setupLights:o,setupLightsView:c,pushLight:r,pushShadow:a}}function Db(n){let t=new WeakMap;function e(s,r=0){const a=t.get(s);let o;return a===void 0?(o=new Td(n),t.set(s,[o])):r>=a.length?(o=new Td(n),a.push(o)):o=a[r],o}function i(){t=new WeakMap}return{get:e,dispose:i}}const Ub=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,Nb=`uniform sampler2D shadow_pass;
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
}`;function Fb(n,t,e){let i=new x0;const s=new ht,r=new ht,a=new de,o=new nx({depthPacking:m2}),c=new ix,l={},h=e.maxTextureSize,u={[Os]:Tn,[Tn]:Os,[ye]:ye},d=new Ze({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new ht},radius:{value:4}},vertexShader:Ub,fragmentShader:Nb}),f=d.clone();f.defines.HORIZONTAL_PASS=1;const p=new me;p.setAttribute("position",new Kt(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const v=new mt(p,d),g=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=Y1;let m=this.type;this.render=function(E,A,T){if(g.enabled===!1||g.autoUpdate===!1&&g.needsUpdate===!1||E.length===0)return;const M=n.getRenderTarget(),y=n.getActiveCubeFace(),S=n.getActiveMipmapLevel(),R=n.state;R.setBlending(Us),R.buffers.depth.getReversed()===!0?R.buffers.color.setClear(0,0,0,0):R.buffers.color.setClear(1,1,1,1),R.buffers.depth.setTest(!0),R.setScissorTest(!1);const I=m!==Qi&&this.type===Qi,L=m===Qi&&this.type!==Qi;for(let D=0,k=E.length;D<k;D++){const q=E[D],z=q.shadow;if(z===void 0){console.warn("THREE.WebGLShadowMap:",q,"has no shadow.");continue}if(z.autoUpdate===!1&&z.needsUpdate===!1)continue;s.copy(z.mapSize);const it=z.getFrameExtents();if(s.multiply(it),r.copy(z.mapSize),(s.x>h||s.y>h)&&(s.x>h&&(r.x=Math.floor(h/it.x),s.x=r.x*it.x,z.mapSize.x=r.x),s.y>h&&(r.y=Math.floor(h/it.y),s.y=r.y*it.y,z.mapSize.y=r.y)),z.map===null||I===!0||L===!0){const gt=this.type!==Qi?{minFilter:Vn,magFilter:Vn}:{};z.map!==null&&z.map.dispose(),z.map=new dn(s.x,s.y,gt),z.map.texture.name=q.name+".shadowMap",z.camera.updateProjectionMatrix()}n.setRenderTarget(z.map),n.clear();const ut=z.getViewportCount();for(let gt=0;gt<ut;gt++){const _t=z.getViewport(gt);a.set(r.x*_t.x,r.y*_t.y,r.x*_t.z,r.y*_t.w),R.viewport(a),z.updateMatrices(q,gt),i=z.getFrustum(),b(A,T,z.camera,q,this.type)}z.isPointLightShadow!==!0&&this.type===Qi&&_(z,T),z.needsUpdate=!1}m=this.type,g.needsUpdate=!1,n.setRenderTarget(M,y,S)};function _(E,A){const T=t.update(v);d.defines.VSM_SAMPLES!==E.blurSamples&&(d.defines.VSM_SAMPLES=E.blurSamples,f.defines.VSM_SAMPLES=E.blurSamples,d.needsUpdate=!0,f.needsUpdate=!0),E.mapPass===null&&(E.mapPass=new dn(s.x,s.y)),d.uniforms.shadow_pass.value=E.map.texture,d.uniforms.resolution.value=E.mapSize,d.uniforms.radius.value=E.radius,n.setRenderTarget(E.mapPass),n.clear(),n.renderBufferDirect(A,null,T,d,v,null),f.uniforms.shadow_pass.value=E.mapPass.texture,f.uniforms.resolution.value=E.mapSize,f.uniforms.radius.value=E.radius,n.setRenderTarget(E.map),n.clear(),n.renderBufferDirect(A,null,T,f,v,null)}function x(E,A,T,M){let y=null;const S=T.isPointLight===!0?E.customDistanceMaterial:E.customDepthMaterial;if(S!==void 0)y=S;else if(y=T.isPointLight===!0?c:o,n.localClippingEnabled&&A.clipShadows===!0&&Array.isArray(A.clippingPlanes)&&A.clippingPlanes.length!==0||A.displacementMap&&A.displacementScale!==0||A.alphaMap&&A.alphaTest>0||A.map&&A.alphaTest>0||A.alphaToCoverage===!0){const R=y.uuid,I=A.uuid;let L=l[R];L===void 0&&(L={},l[R]=L);let D=L[I];D===void 0&&(D=y.clone(),L[I]=D,A.addEventListener("dispose",w)),y=D}if(y.visible=A.visible,y.wireframe=A.wireframe,M===Qi?y.side=A.shadowSide!==null?A.shadowSide:A.side:y.side=A.shadowSide!==null?A.shadowSide:u[A.side],y.alphaMap=A.alphaMap,y.alphaTest=A.alphaToCoverage===!0?.5:A.alphaTest,y.map=A.map,y.clipShadows=A.clipShadows,y.clippingPlanes=A.clippingPlanes,y.clipIntersection=A.clipIntersection,y.displacementMap=A.displacementMap,y.displacementScale=A.displacementScale,y.displacementBias=A.displacementBias,y.wireframeLinewidth=A.wireframeLinewidth,y.linewidth=A.linewidth,T.isPointLight===!0&&y.isMeshDistanceMaterial===!0){const R=n.properties.get(y);R.light=T}return y}function b(E,A,T,M,y){if(E.visible===!1)return;if(E.layers.test(A.layers)&&(E.isMesh||E.isLine||E.isPoints)&&(E.castShadow||E.receiveShadow&&y===Qi)&&(!E.frustumCulled||i.intersectsObject(E))){E.modelViewMatrix.multiplyMatrices(T.matrixWorldInverse,E.matrixWorld);const I=t.update(E),L=E.material;if(Array.isArray(L)){const D=I.groups;for(let k=0,q=D.length;k<q;k++){const z=D[k],it=L[z.materialIndex];if(it&&it.visible){const ut=x(E,it,M,y);E.onBeforeShadow(n,E,A,T,I,ut,z),n.renderBufferDirect(T,null,I,ut,E,z),E.onAfterShadow(n,E,A,T,I,ut,z)}}}else if(L.visible){const D=x(E,L,M,y);E.onBeforeShadow(n,E,A,T,I,D,null),n.renderBufferDirect(T,null,I,D,E,null),E.onAfterShadow(n,E,A,T,I,D,null)}}const R=E.children;for(let I=0,L=R.length;I<L;I++)b(R[I],A,T,M,y)}function w(E){E.target.removeEventListener("dispose",w);for(const T in l){const M=l[T],y=E.target.uuid;y in M&&(M[y].dispose(),delete M[y])}}}const Ob={[Gh]:Wh,[Xh]:Yh,[qh]:jh,[Ta]:$h,[Wh]:Gh,[Yh]:Xh,[jh]:qh,[$h]:Ta};function kb(n,t){function e(){let X=!1;const Tt=new de;let Ct=null;const Ft=new de(0,0,0,0);return{setMask:function(St){Ct!==St&&!X&&(n.colorMask(St,St,St,St),Ct=St)},setLocked:function(St){X=St},setClear:function(St,xt,Ht,te,Se){Se===!0&&(St*=te,xt*=te,Ht*=te),Tt.set(St,xt,Ht,te),Ft.equals(Tt)===!1&&(n.clearColor(St,xt,Ht,te),Ft.copy(Tt))},reset:function(){X=!1,Ct=null,Ft.set(-1,0,0,0)}}}function i(){let X=!1,Tt=!1,Ct=null,Ft=null,St=null;return{setReversed:function(xt){if(Tt!==xt){const Ht=t.get("EXT_clip_control");xt?Ht.clipControlEXT(Ht.LOWER_LEFT_EXT,Ht.ZERO_TO_ONE_EXT):Ht.clipControlEXT(Ht.LOWER_LEFT_EXT,Ht.NEGATIVE_ONE_TO_ONE_EXT),Tt=xt;const te=St;St=null,this.setClear(te)}},getReversed:function(){return Tt},setTest:function(xt){xt?J(n.DEPTH_TEST):H(n.DEPTH_TEST)},setMask:function(xt){Ct!==xt&&!X&&(n.depthMask(xt),Ct=xt)},setFunc:function(xt){if(Tt&&(xt=Ob[xt]),Ft!==xt){switch(xt){case Gh:n.depthFunc(n.NEVER);break;case Wh:n.depthFunc(n.ALWAYS);break;case Xh:n.depthFunc(n.LESS);break;case Ta:n.depthFunc(n.LEQUAL);break;case qh:n.depthFunc(n.EQUAL);break;case $h:n.depthFunc(n.GEQUAL);break;case Yh:n.depthFunc(n.GREATER);break;case jh:n.depthFunc(n.NOTEQUAL);break;default:n.depthFunc(n.LEQUAL)}Ft=xt}},setLocked:function(xt){X=xt},setClear:function(xt){St!==xt&&(Tt&&(xt=1-xt),n.clearDepth(xt),St=xt)},reset:function(){X=!1,Ct=null,Ft=null,St=null,Tt=!1}}}function s(){let X=!1,Tt=null,Ct=null,Ft=null,St=null,xt=null,Ht=null,te=null,Se=null;return{setTest:function(pe){X||(pe?J(n.STENCIL_TEST):H(n.STENCIL_TEST))},setMask:function(pe){Tt!==pe&&!X&&(n.stencilMask(pe),Tt=pe)},setFunc:function(pe,qi,yi){(Ct!==pe||Ft!==qi||St!==yi)&&(n.stencilFunc(pe,qi,yi),Ct=pe,Ft=qi,St=yi)},setOp:function(pe,qi,yi){(xt!==pe||Ht!==qi||te!==yi)&&(n.stencilOp(pe,qi,yi),xt=pe,Ht=qi,te=yi)},setLocked:function(pe){X=pe},setClear:function(pe){Se!==pe&&(n.clearStencil(pe),Se=pe)},reset:function(){X=!1,Tt=null,Ct=null,Ft=null,St=null,xt=null,Ht=null,te=null,Se=null}}}const r=new e,a=new i,o=new s,c=new WeakMap,l=new WeakMap;let h={},u={},d=new WeakMap,f=[],p=null,v=!1,g=null,m=null,_=null,x=null,b=null,w=null,E=null,A=new vt(0,0,0),T=0,M=!1,y=null,S=null,R=null,I=null,L=null;const D=n.getParameter(n.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let k=!1,q=0;const z=n.getParameter(n.VERSION);z.indexOf("WebGL")!==-1?(q=parseFloat(/^WebGL (\d)/.exec(z)[1]),k=q>=1):z.indexOf("OpenGL ES")!==-1&&(q=parseFloat(/^OpenGL ES (\d)/.exec(z)[1]),k=q>=2);let it=null,ut={};const gt=n.getParameter(n.SCISSOR_BOX),_t=n.getParameter(n.VIEWPORT),At=new de().fromArray(gt),Ut=new de().fromArray(_t);function ct(X,Tt,Ct,Ft){const St=new Uint8Array(4),xt=n.createTexture();n.bindTexture(X,xt),n.texParameteri(X,n.TEXTURE_MIN_FILTER,n.NEAREST),n.texParameteri(X,n.TEXTURE_MAG_FILTER,n.NEAREST);for(let Ht=0;Ht<Ct;Ht++)X===n.TEXTURE_3D||X===n.TEXTURE_2D_ARRAY?n.texImage3D(Tt,0,n.RGBA,1,1,Ft,0,n.RGBA,n.UNSIGNED_BYTE,St):n.texImage2D(Tt+Ht,0,n.RGBA,1,1,0,n.RGBA,n.UNSIGNED_BYTE,St);return xt}const G={};G[n.TEXTURE_2D]=ct(n.TEXTURE_2D,n.TEXTURE_2D,1),G[n.TEXTURE_CUBE_MAP]=ct(n.TEXTURE_CUBE_MAP,n.TEXTURE_CUBE_MAP_POSITIVE_X,6),G[n.TEXTURE_2D_ARRAY]=ct(n.TEXTURE_2D_ARRAY,n.TEXTURE_2D_ARRAY,1,1),G[n.TEXTURE_3D]=ct(n.TEXTURE_3D,n.TEXTURE_3D,1,1),r.setClear(0,0,0,1),a.setClear(1),o.setClear(0),J(n.DEPTH_TEST),a.setFunc(Ta),et(!1),ot(mf),J(n.CULL_FACE),Q(Us);function J(X){h[X]!==!0&&(n.enable(X),h[X]=!0)}function H(X){h[X]!==!1&&(n.disable(X),h[X]=!1)}function W(X,Tt){return u[X]!==Tt?(n.bindFramebuffer(X,Tt),u[X]=Tt,X===n.DRAW_FRAMEBUFFER&&(u[n.FRAMEBUFFER]=Tt),X===n.FRAMEBUFFER&&(u[n.DRAW_FRAMEBUFFER]=Tt),!0):!1}function V(X,Tt){let Ct=f,Ft=!1;if(X){Ct=d.get(Tt),Ct===void 0&&(Ct=[],d.set(Tt,Ct));const St=X.textures;if(Ct.length!==St.length||Ct[0]!==n.COLOR_ATTACHMENT0){for(let xt=0,Ht=St.length;xt<Ht;xt++)Ct[xt]=n.COLOR_ATTACHMENT0+xt;Ct.length=St.length,Ft=!0}}else Ct[0]!==n.BACK&&(Ct[0]=n.BACK,Ft=!0);Ft&&n.drawBuffers(Ct)}function tt(X){return p!==X?(n.useProgram(X),p=X,!0):!1}const st={[tr]:n.FUNC_ADD,[Gg]:n.FUNC_SUBTRACT,[Wg]:n.FUNC_REVERSE_SUBTRACT};st[Xg]=n.MIN,st[qg]=n.MAX;const N={[K1]:n.ZERO,[$g]:n.ONE,[J1]:n.SRC_COLOR,[Vh]:n.SRC_ALPHA,[Qg]:n.SRC_ALPHA_SATURATE,[Kg]:n.DST_COLOR,[jg]:n.DST_ALPHA,[Yg]:n.ONE_MINUS_SRC_COLOR,[zh]:n.ONE_MINUS_SRC_ALPHA,[Jg]:n.ONE_MINUS_DST_COLOR,[Zg]:n.ONE_MINUS_DST_ALPHA,[t2]:n.CONSTANT_COLOR,[e2]:n.ONE_MINUS_CONSTANT_COLOR,[n2]:n.CONSTANT_ALPHA,[i2]:n.ONE_MINUS_CONSTANT_ALPHA};function Q(X,Tt,Ct,Ft,St,xt,Ht,te,Se,pe){if(X===Us){v===!0&&(H(n.BLEND),v=!1);return}if(v===!1&&(J(n.BLEND),v=!0),X!==Z1){if(X!==g||pe!==M){if((m!==tr||b!==tr)&&(n.blendEquation(n.FUNC_ADD),m=tr,b=tr),pe)switch(X){case ga:n.blendFuncSeparate(n.ONE,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case Ea:n.blendFunc(n.ONE,n.ONE);break;case gf:n.blendFuncSeparate(n.ZERO,n.ONE_MINUS_SRC_COLOR,n.ZERO,n.ONE);break;case vf:n.blendFuncSeparate(n.DST_COLOR,n.ONE_MINUS_SRC_ALPHA,n.ZERO,n.ONE);break;default:console.error("THREE.WebGLState: Invalid blending: ",X);break}else switch(X){case ga:n.blendFuncSeparate(n.SRC_ALPHA,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case Ea:n.blendFuncSeparate(n.SRC_ALPHA,n.ONE,n.ONE,n.ONE);break;case gf:console.error("THREE.WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case vf:console.error("THREE.WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:console.error("THREE.WebGLState: Invalid blending: ",X);break}_=null,x=null,w=null,E=null,A.set(0,0,0),T=0,g=X,M=pe}return}St=St||Tt,xt=xt||Ct,Ht=Ht||Ft,(Tt!==m||St!==b)&&(n.blendEquationSeparate(st[Tt],st[St]),m=Tt,b=St),(Ct!==_||Ft!==x||xt!==w||Ht!==E)&&(n.blendFuncSeparate(N[Ct],N[Ft],N[xt],N[Ht]),_=Ct,x=Ft,w=xt,E=Ht),(te.equals(A)===!1||Se!==T)&&(n.blendColor(te.r,te.g,te.b,Se),A.copy(te),T=Se),g=X,M=!1}function Z(X,Tt){X.side===ye?H(n.CULL_FACE):J(n.CULL_FACE);let Ct=X.side===Tn;Tt&&(Ct=!Ct),et(Ct),X.blending===ga&&X.transparent===!1?Q(Us):Q(X.blending,X.blendEquation,X.blendSrc,X.blendDst,X.blendEquationAlpha,X.blendSrcAlpha,X.blendDstAlpha,X.blendColor,X.blendAlpha,X.premultipliedAlpha),a.setFunc(X.depthFunc),a.setTest(X.depthTest),a.setMask(X.depthWrite),r.setMask(X.colorWrite);const Ft=X.stencilWrite;o.setTest(Ft),Ft&&(o.setMask(X.stencilWriteMask),o.setFunc(X.stencilFunc,X.stencilRef,X.stencilFuncMask),o.setOp(X.stencilFail,X.stencilZFail,X.stencilZPass)),Mt(X.polygonOffset,X.polygonOffsetFactor,X.polygonOffsetUnits),X.alphaToCoverage===!0?J(n.SAMPLE_ALPHA_TO_COVERAGE):H(n.SAMPLE_ALPHA_TO_COVERAGE)}function et(X){y!==X&&(X?n.frontFace(n.CW):n.frontFace(n.CCW),y=X)}function ot(X){X!==Vg?(J(n.CULL_FACE),X!==S&&(X===mf?n.cullFace(n.BACK):X===zg?n.cullFace(n.FRONT):n.cullFace(n.FRONT_AND_BACK))):H(n.CULL_FACE),S=X}function pt(X){X!==R&&(k&&n.lineWidth(X),R=X)}function Mt(X,Tt,Ct){X?(J(n.POLYGON_OFFSET_FILL),(I!==Tt||L!==Ct)&&(n.polygonOffset(Tt,Ct),I=Tt,L=Ct)):H(n.POLYGON_OFFSET_FILL)}function yt(X){X?J(n.SCISSOR_TEST):H(n.SCISSOR_TEST)}function Jt(X){X===void 0&&(X=n.TEXTURE0+D-1),it!==X&&(n.activeTexture(X),it=X)}function Yt(X,Tt,Ct){Ct===void 0&&(it===null?Ct=n.TEXTURE0+D-1:Ct=it);let Ft=ut[Ct];Ft===void 0&&(Ft={type:void 0,texture:void 0},ut[Ct]=Ft),(Ft.type!==X||Ft.texture!==Tt)&&(it!==Ct&&(n.activeTexture(Ct),it=Ct),n.bindTexture(X,Tt||G[X]),Ft.type=X,Ft.texture=Tt)}function F(){const X=ut[it];X!==void 0&&X.type!==void 0&&(n.bindTexture(X.type,null),X.type=void 0,X.texture=void 0)}function P(){try{n.compressedTexImage2D(...arguments)}catch(X){console.error("THREE.WebGLState:",X)}}function j(){try{n.compressedTexImage3D(...arguments)}catch(X){console.error("THREE.WebGLState:",X)}}function lt(){try{n.texSubImage2D(...arguments)}catch(X){console.error("THREE.WebGLState:",X)}}function bt(){try{n.texSubImage3D(...arguments)}catch(X){console.error("THREE.WebGLState:",X)}}function dt(){try{n.compressedTexSubImage2D(...arguments)}catch(X){console.error("THREE.WebGLState:",X)}}function Vt(){try{n.compressedTexSubImage3D(...arguments)}catch(X){console.error("THREE.WebGLState:",X)}}function Rt(){try{n.texStorage2D(...arguments)}catch(X){console.error("THREE.WebGLState:",X)}}function kt(){try{n.texStorage3D(...arguments)}catch(X){console.error("THREE.WebGLState:",X)}}function Bt(){try{n.texImage2D(...arguments)}catch(X){console.error("THREE.WebGLState:",X)}}function wt(){try{n.texImage3D(...arguments)}catch(X){console.error("THREE.WebGLState:",X)}}function Dt(X){At.equals(X)===!1&&(n.scissor(X.x,X.y,X.z,X.w),At.copy(X))}function jt(X){Ut.equals(X)===!1&&(n.viewport(X.x,X.y,X.z,X.w),Ut.copy(X))}function zt(X,Tt){let Ct=l.get(Tt);Ct===void 0&&(Ct=new WeakMap,l.set(Tt,Ct));let Ft=Ct.get(X);Ft===void 0&&(Ft=n.getUniformBlockIndex(Tt,X.name),Ct.set(X,Ft))}function Pt(X,Tt){const Ft=l.get(Tt).get(X);c.get(Tt)!==Ft&&(n.uniformBlockBinding(Tt,Ft,X.__bindingPointIndex),c.set(Tt,Ft))}function ee(){n.disable(n.BLEND),n.disable(n.CULL_FACE),n.disable(n.DEPTH_TEST),n.disable(n.POLYGON_OFFSET_FILL),n.disable(n.SCISSOR_TEST),n.disable(n.STENCIL_TEST),n.disable(n.SAMPLE_ALPHA_TO_COVERAGE),n.blendEquation(n.FUNC_ADD),n.blendFunc(n.ONE,n.ZERO),n.blendFuncSeparate(n.ONE,n.ZERO,n.ONE,n.ZERO),n.blendColor(0,0,0,0),n.colorMask(!0,!0,!0,!0),n.clearColor(0,0,0,0),n.depthMask(!0),n.depthFunc(n.LESS),a.setReversed(!1),n.clearDepth(1),n.stencilMask(4294967295),n.stencilFunc(n.ALWAYS,0,4294967295),n.stencilOp(n.KEEP,n.KEEP,n.KEEP),n.clearStencil(0),n.cullFace(n.BACK),n.frontFace(n.CCW),n.polygonOffset(0,0),n.activeTexture(n.TEXTURE0),n.bindFramebuffer(n.FRAMEBUFFER,null),n.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),n.bindFramebuffer(n.READ_FRAMEBUFFER,null),n.useProgram(null),n.lineWidth(1),n.scissor(0,0,n.canvas.width,n.canvas.height),n.viewport(0,0,n.canvas.width,n.canvas.height),h={},it=null,ut={},u={},d=new WeakMap,f=[],p=null,v=!1,g=null,m=null,_=null,x=null,b=null,w=null,E=null,A=new vt(0,0,0),T=0,M=!1,y=null,S=null,R=null,I=null,L=null,At.set(0,0,n.canvas.width,n.canvas.height),Ut.set(0,0,n.canvas.width,n.canvas.height),r.reset(),a.reset(),o.reset()}return{buffers:{color:r,depth:a,stencil:o},enable:J,disable:H,bindFramebuffer:W,drawBuffers:V,useProgram:tt,setBlending:Q,setMaterial:Z,setFlipSided:et,setCullFace:ot,setLineWidth:pt,setPolygonOffset:Mt,setScissorTest:yt,activeTexture:Jt,bindTexture:Yt,unbindTexture:F,compressedTexImage2D:P,compressedTexImage3D:j,texImage2D:Bt,texImage3D:wt,updateUBOMapping:zt,uniformBlockBinding:Pt,texStorage2D:Rt,texStorage3D:kt,texSubImage2D:lt,texSubImage3D:bt,compressedTexSubImage2D:dt,compressedTexSubImage3D:Vt,scissor:Dt,viewport:jt,reset:ee}}function Bb(n,t,e,i,s,r,a){const o=t.has("WEBGL_multisampled_render_to_texture")?t.get("WEBGL_multisampled_render_to_texture"):null,c=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),l=new ht,h=new WeakMap;let u;const d=new WeakMap;let f=!1;try{f=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function p(F,P){return f?new OffscreenCanvas(F,P):Kc("canvas")}function v(F,P,j){let lt=1;const bt=Yt(F);if((bt.width>j||bt.height>j)&&(lt=j/Math.max(bt.width,bt.height)),lt<1)if(typeof HTMLImageElement<"u"&&F instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&F instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&F instanceof ImageBitmap||typeof VideoFrame<"u"&&F instanceof VideoFrame){const dt=Math.floor(lt*bt.width),Vt=Math.floor(lt*bt.height);u===void 0&&(u=p(dt,Vt));const Rt=P?p(dt,Vt):u;return Rt.width=dt,Rt.height=Vt,Rt.getContext("2d").drawImage(F,0,0,dt,Vt),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+bt.width+"x"+bt.height+") to ("+dt+"x"+Vt+")."),Rt}else return"data"in F&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+bt.width+"x"+bt.height+")."),F;return F}function g(F){return F.generateMipmaps}function m(F){n.generateMipmap(F)}function _(F){return F.isWebGLCubeRenderTarget?n.TEXTURE_CUBE_MAP:F.isWebGL3DRenderTarget?n.TEXTURE_3D:F.isWebGLArrayRenderTarget||F.isCompressedArrayTexture?n.TEXTURE_2D_ARRAY:n.TEXTURE_2D}function x(F,P,j,lt,bt=!1){if(F!==null){if(n[F]!==void 0)return n[F];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+F+"'")}let dt=P;if(P===n.RED&&(j===n.FLOAT&&(dt=n.R32F),j===n.HALF_FLOAT&&(dt=n.R16F),j===n.UNSIGNED_BYTE&&(dt=n.R8)),P===n.RED_INTEGER&&(j===n.UNSIGNED_BYTE&&(dt=n.R8UI),j===n.UNSIGNED_SHORT&&(dt=n.R16UI),j===n.UNSIGNED_INT&&(dt=n.R32UI),j===n.BYTE&&(dt=n.R8I),j===n.SHORT&&(dt=n.R16I),j===n.INT&&(dt=n.R32I)),P===n.RG&&(j===n.FLOAT&&(dt=n.RG32F),j===n.HALF_FLOAT&&(dt=n.RG16F),j===n.UNSIGNED_BYTE&&(dt=n.RG8)),P===n.RG_INTEGER&&(j===n.UNSIGNED_BYTE&&(dt=n.RG8UI),j===n.UNSIGNED_SHORT&&(dt=n.RG16UI),j===n.UNSIGNED_INT&&(dt=n.RG32UI),j===n.BYTE&&(dt=n.RG8I),j===n.SHORT&&(dt=n.RG16I),j===n.INT&&(dt=n.RG32I)),P===n.RGB_INTEGER&&(j===n.UNSIGNED_BYTE&&(dt=n.RGB8UI),j===n.UNSIGNED_SHORT&&(dt=n.RGB16UI),j===n.UNSIGNED_INT&&(dt=n.RGB32UI),j===n.BYTE&&(dt=n.RGB8I),j===n.SHORT&&(dt=n.RGB16I),j===n.INT&&(dt=n.RGB32I)),P===n.RGBA_INTEGER&&(j===n.UNSIGNED_BYTE&&(dt=n.RGBA8UI),j===n.UNSIGNED_SHORT&&(dt=n.RGBA16UI),j===n.UNSIGNED_INT&&(dt=n.RGBA32UI),j===n.BYTE&&(dt=n.RGBA8I),j===n.SHORT&&(dt=n.RGBA16I),j===n.INT&&(dt=n.RGBA32I)),P===n.RGB&&(j===n.UNSIGNED_INT_5_9_9_9_REV&&(dt=n.RGB9_E5),j===n.UNSIGNED_INT_10F_11F_11F_REV&&(dt=n.R11F_G11F_B10F)),P===n.RGBA){const Vt=bt?jc:ue.getTransfer(lt);j===n.FLOAT&&(dt=n.RGBA32F),j===n.HALF_FLOAT&&(dt=n.RGBA16F),j===n.UNSIGNED_BYTE&&(dt=Vt===xe?n.SRGB8_ALPHA8:n.RGBA8),j===n.UNSIGNED_SHORT_4_4_4_4&&(dt=n.RGBA4),j===n.UNSIGNED_SHORT_5_5_5_1&&(dt=n.RGB5_A1)}return(dt===n.R16F||dt===n.R32F||dt===n.RG16F||dt===n.RG32F||dt===n.RGBA16F||dt===n.RGBA32F)&&t.get("EXT_color_buffer_float"),dt}function b(F,P){let j;return F?P===null||P===mr||P===xo?j=n.DEPTH24_STENCIL8:P===Bi?j=n.DEPTH32F_STENCIL8:P===vo&&(j=n.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):P===null||P===mr||P===xo?j=n.DEPTH_COMPONENT24:P===Bi?j=n.DEPTH_COMPONENT32F:P===vo&&(j=n.DEPTH_COMPONENT16),j}function w(F,P){return g(F)===!0||F.isFramebufferTexture&&F.minFilter!==Vn&&F.minFilter!==Re?Math.log2(Math.max(P.width,P.height))+1:F.mipmaps!==void 0&&F.mipmaps.length>0?F.mipmaps.length:F.isCompressedTexture&&Array.isArray(F.image)?P.mipmaps.length:1}function E(F){const P=F.target;P.removeEventListener("dispose",E),T(P),P.isVideoTexture&&h.delete(P)}function A(F){const P=F.target;P.removeEventListener("dispose",A),y(P)}function T(F){const P=i.get(F);if(P.__webglInit===void 0)return;const j=F.source,lt=d.get(j);if(lt){const bt=lt[P.__cacheKey];bt.usedTimes--,bt.usedTimes===0&&M(F),Object.keys(lt).length===0&&d.delete(j)}i.remove(F)}function M(F){const P=i.get(F);n.deleteTexture(P.__webglTexture);const j=F.source,lt=d.get(j);delete lt[P.__cacheKey],a.memory.textures--}function y(F){const P=i.get(F);if(F.depthTexture&&(F.depthTexture.dispose(),i.remove(F.depthTexture)),F.isWebGLCubeRenderTarget)for(let lt=0;lt<6;lt++){if(Array.isArray(P.__webglFramebuffer[lt]))for(let bt=0;bt<P.__webglFramebuffer[lt].length;bt++)n.deleteFramebuffer(P.__webglFramebuffer[lt][bt]);else n.deleteFramebuffer(P.__webglFramebuffer[lt]);P.__webglDepthbuffer&&n.deleteRenderbuffer(P.__webglDepthbuffer[lt])}else{if(Array.isArray(P.__webglFramebuffer))for(let lt=0;lt<P.__webglFramebuffer.length;lt++)n.deleteFramebuffer(P.__webglFramebuffer[lt]);else n.deleteFramebuffer(P.__webglFramebuffer);if(P.__webglDepthbuffer&&n.deleteRenderbuffer(P.__webglDepthbuffer),P.__webglMultisampledFramebuffer&&n.deleteFramebuffer(P.__webglMultisampledFramebuffer),P.__webglColorRenderbuffer)for(let lt=0;lt<P.__webglColorRenderbuffer.length;lt++)P.__webglColorRenderbuffer[lt]&&n.deleteRenderbuffer(P.__webglColorRenderbuffer[lt]);P.__webglDepthRenderbuffer&&n.deleteRenderbuffer(P.__webglDepthRenderbuffer)}const j=F.textures;for(let lt=0,bt=j.length;lt<bt;lt++){const dt=i.get(j[lt]);dt.__webglTexture&&(n.deleteTexture(dt.__webglTexture),a.memory.textures--),i.remove(j[lt])}i.remove(F)}let S=0;function R(){S=0}function I(){const F=S;return F>=s.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+F+" texture units while this GPU supports only "+s.maxTextures),S+=1,F}function L(F){const P=[];return P.push(F.wrapS),P.push(F.wrapT),P.push(F.wrapR||0),P.push(F.magFilter),P.push(F.minFilter),P.push(F.anisotropy),P.push(F.internalFormat),P.push(F.format),P.push(F.type),P.push(F.generateMipmaps),P.push(F.premultiplyAlpha),P.push(F.flipY),P.push(F.unpackAlignment),P.push(F.colorSpace),P.join()}function D(F,P){const j=i.get(F);if(F.isVideoTexture&&yt(F),F.isRenderTargetTexture===!1&&F.isExternalTexture!==!0&&F.version>0&&j.__version!==F.version){const lt=F.image;if(lt===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(lt.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{G(j,F,P);return}}else F.isExternalTexture&&(j.__webglTexture=F.sourceTexture?F.sourceTexture:null);e.bindTexture(n.TEXTURE_2D,j.__webglTexture,n.TEXTURE0+P)}function k(F,P){const j=i.get(F);if(F.isRenderTargetTexture===!1&&F.version>0&&j.__version!==F.version){G(j,F,P);return}e.bindTexture(n.TEXTURE_2D_ARRAY,j.__webglTexture,n.TEXTURE0+P)}function q(F,P){const j=i.get(F);if(F.isRenderTargetTexture===!1&&F.version>0&&j.__version!==F.version){G(j,F,P);return}e.bindTexture(n.TEXTURE_3D,j.__webglTexture,n.TEXTURE0+P)}function z(F,P){const j=i.get(F);if(F.version>0&&j.__version!==F.version){J(j,F,P);return}e.bindTexture(n.TEXTURE_CUBE_MAP,j.__webglTexture,n.TEXTURE0+P)}const it={[Ca]:n.REPEAT,[nr]:n.CLAMP_TO_EDGE,[Kh]:n.MIRRORED_REPEAT},ut={[Vn]:n.NEAREST,[d2]:n.NEAREST_MIPMAP_NEAREST,[qo]:n.NEAREST_MIPMAP_LINEAR,[Re]:n.LINEAR,[Il]:n.LINEAR_MIPMAP_NEAREST,[Cs]:n.LINEAR_MIPMAP_LINEAR},gt={[v2]:n.NEVER,[w2]:n.ALWAYS,[x2]:n.LESS,[up]:n.LEQUAL,[_2]:n.EQUAL,[y2]:n.GEQUAL,[M2]:n.GREATER,[b2]:n.NOTEQUAL};function _t(F,P){if(P.type===Bi&&t.has("OES_texture_float_linear")===!1&&(P.magFilter===Re||P.magFilter===Il||P.magFilter===qo||P.magFilter===Cs||P.minFilter===Re||P.minFilter===Il||P.minFilter===qo||P.minFilter===Cs)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),n.texParameteri(F,n.TEXTURE_WRAP_S,it[P.wrapS]),n.texParameteri(F,n.TEXTURE_WRAP_T,it[P.wrapT]),(F===n.TEXTURE_3D||F===n.TEXTURE_2D_ARRAY)&&n.texParameteri(F,n.TEXTURE_WRAP_R,it[P.wrapR]),n.texParameteri(F,n.TEXTURE_MAG_FILTER,ut[P.magFilter]),n.texParameteri(F,n.TEXTURE_MIN_FILTER,ut[P.minFilter]),P.compareFunction&&(n.texParameteri(F,n.TEXTURE_COMPARE_MODE,n.COMPARE_REF_TO_TEXTURE),n.texParameteri(F,n.TEXTURE_COMPARE_FUNC,gt[P.compareFunction])),t.has("EXT_texture_filter_anisotropic")===!0){if(P.magFilter===Vn||P.minFilter!==qo&&P.minFilter!==Cs||P.type===Bi&&t.has("OES_texture_float_linear")===!1)return;if(P.anisotropy>1||i.get(P).__currentAnisotropy){const j=t.get("EXT_texture_filter_anisotropic");n.texParameterf(F,j.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(P.anisotropy,s.getMaxAnisotropy())),i.get(P).__currentAnisotropy=P.anisotropy}}}function At(F,P){let j=!1;F.__webglInit===void 0&&(F.__webglInit=!0,P.addEventListener("dispose",E));const lt=P.source;let bt=d.get(lt);bt===void 0&&(bt={},d.set(lt,bt));const dt=L(P);if(dt!==F.__cacheKey){bt[dt]===void 0&&(bt[dt]={texture:n.createTexture(),usedTimes:0},a.memory.textures++,j=!0),bt[dt].usedTimes++;const Vt=bt[F.__cacheKey];Vt!==void 0&&(bt[F.__cacheKey].usedTimes--,Vt.usedTimes===0&&M(P)),F.__cacheKey=dt,F.__webglTexture=bt[dt].texture}return j}function Ut(F,P,j){return Math.floor(Math.floor(F/j)/P)}function ct(F,P,j,lt){const dt=F.updateRanges;if(dt.length===0)e.texSubImage2D(n.TEXTURE_2D,0,0,0,P.width,P.height,j,lt,P.data);else{dt.sort((wt,Dt)=>wt.start-Dt.start);let Vt=0;for(let wt=1;wt<dt.length;wt++){const Dt=dt[Vt],jt=dt[wt],zt=Dt.start+Dt.count,Pt=Ut(jt.start,P.width,4),ee=Ut(Dt.start,P.width,4);jt.start<=zt+1&&Pt===ee&&Ut(jt.start+jt.count-1,P.width,4)===Pt?Dt.count=Math.max(Dt.count,jt.start+jt.count-Dt.start):(++Vt,dt[Vt]=jt)}dt.length=Vt+1;const Rt=n.getParameter(n.UNPACK_ROW_LENGTH),kt=n.getParameter(n.UNPACK_SKIP_PIXELS),Bt=n.getParameter(n.UNPACK_SKIP_ROWS);n.pixelStorei(n.UNPACK_ROW_LENGTH,P.width);for(let wt=0,Dt=dt.length;wt<Dt;wt++){const jt=dt[wt],zt=Math.floor(jt.start/4),Pt=Math.ceil(jt.count/4),ee=zt%P.width,X=Math.floor(zt/P.width),Tt=Pt,Ct=1;n.pixelStorei(n.UNPACK_SKIP_PIXELS,ee),n.pixelStorei(n.UNPACK_SKIP_ROWS,X),e.texSubImage2D(n.TEXTURE_2D,0,ee,X,Tt,Ct,j,lt,P.data)}F.clearUpdateRanges(),n.pixelStorei(n.UNPACK_ROW_LENGTH,Rt),n.pixelStorei(n.UNPACK_SKIP_PIXELS,kt),n.pixelStorei(n.UNPACK_SKIP_ROWS,Bt)}}function G(F,P,j){let lt=n.TEXTURE_2D;(P.isDataArrayTexture||P.isCompressedArrayTexture)&&(lt=n.TEXTURE_2D_ARRAY),P.isData3DTexture&&(lt=n.TEXTURE_3D);const bt=At(F,P),dt=P.source;e.bindTexture(lt,F.__webglTexture,n.TEXTURE0+j);const Vt=i.get(dt);if(dt.version!==Vt.__version||bt===!0){e.activeTexture(n.TEXTURE0+j);const Rt=ue.getPrimaries(ue.workingColorSpace),kt=P.colorSpace===Ni?null:ue.getPrimaries(P.colorSpace),Bt=P.colorSpace===Ni||Rt===kt?n.NONE:n.BROWSER_DEFAULT_WEBGL;n.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,P.flipY),n.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,P.premultiplyAlpha),n.pixelStorei(n.UNPACK_ALIGNMENT,P.unpackAlignment),n.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,Bt);let wt=v(P.image,!1,s.maxTextureSize);wt=Jt(P,wt);const Dt=r.convert(P.format,P.colorSpace),jt=r.convert(P.type);let zt=x(P.internalFormat,Dt,jt,P.colorSpace,P.isVideoTexture);_t(lt,P);let Pt;const ee=P.mipmaps,X=P.isVideoTexture!==!0,Tt=Vt.__version===void 0||bt===!0,Ct=dt.dataReady,Ft=w(P,wt);if(P.isDepthTexture)zt=b(P.format===Mo,P.type),Tt&&(X?e.texStorage2D(n.TEXTURE_2D,1,zt,wt.width,wt.height):e.texImage2D(n.TEXTURE_2D,0,zt,wt.width,wt.height,0,Dt,jt,null));else if(P.isDataTexture)if(ee.length>0){X&&Tt&&e.texStorage2D(n.TEXTURE_2D,Ft,zt,ee[0].width,ee[0].height);for(let St=0,xt=ee.length;St<xt;St++)Pt=ee[St],X?Ct&&e.texSubImage2D(n.TEXTURE_2D,St,0,0,Pt.width,Pt.height,Dt,jt,Pt.data):e.texImage2D(n.TEXTURE_2D,St,zt,Pt.width,Pt.height,0,Dt,jt,Pt.data);P.generateMipmaps=!1}else X?(Tt&&e.texStorage2D(n.TEXTURE_2D,Ft,zt,wt.width,wt.height),Ct&&ct(P,wt,Dt,jt)):e.texImage2D(n.TEXTURE_2D,0,zt,wt.width,wt.height,0,Dt,jt,wt.data);else if(P.isCompressedTexture)if(P.isCompressedArrayTexture){X&&Tt&&e.texStorage3D(n.TEXTURE_2D_ARRAY,Ft,zt,ee[0].width,ee[0].height,wt.depth);for(let St=0,xt=ee.length;St<xt;St++)if(Pt=ee[St],P.format!==Je)if(Dt!==null)if(X){if(Ct)if(P.layerUpdates.size>0){const Ht=id(Pt.width,Pt.height,P.format,P.type);for(const te of P.layerUpdates){const Se=Pt.data.subarray(te*Ht/Pt.data.BYTES_PER_ELEMENT,(te+1)*Ht/Pt.data.BYTES_PER_ELEMENT);e.compressedTexSubImage3D(n.TEXTURE_2D_ARRAY,St,0,0,te,Pt.width,Pt.height,1,Dt,Se)}P.clearLayerUpdates()}else e.compressedTexSubImage3D(n.TEXTURE_2D_ARRAY,St,0,0,0,Pt.width,Pt.height,wt.depth,Dt,Pt.data)}else e.compressedTexImage3D(n.TEXTURE_2D_ARRAY,St,zt,Pt.width,Pt.height,wt.depth,0,Pt.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else X?Ct&&e.texSubImage3D(n.TEXTURE_2D_ARRAY,St,0,0,0,Pt.width,Pt.height,wt.depth,Dt,jt,Pt.data):e.texImage3D(n.TEXTURE_2D_ARRAY,St,zt,Pt.width,Pt.height,wt.depth,0,Dt,jt,Pt.data)}else{X&&Tt&&e.texStorage2D(n.TEXTURE_2D,Ft,zt,ee[0].width,ee[0].height);for(let St=0,xt=ee.length;St<xt;St++)Pt=ee[St],P.format!==Je?Dt!==null?X?Ct&&e.compressedTexSubImage2D(n.TEXTURE_2D,St,0,0,Pt.width,Pt.height,Dt,Pt.data):e.compressedTexImage2D(n.TEXTURE_2D,St,zt,Pt.width,Pt.height,0,Pt.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):X?Ct&&e.texSubImage2D(n.TEXTURE_2D,St,0,0,Pt.width,Pt.height,Dt,jt,Pt.data):e.texImage2D(n.TEXTURE_2D,St,zt,Pt.width,Pt.height,0,Dt,jt,Pt.data)}else if(P.isDataArrayTexture)if(X){if(Tt&&e.texStorage3D(n.TEXTURE_2D_ARRAY,Ft,zt,wt.width,wt.height,wt.depth),Ct)if(P.layerUpdates.size>0){const St=id(wt.width,wt.height,P.format,P.type);for(const xt of P.layerUpdates){const Ht=wt.data.subarray(xt*St/wt.data.BYTES_PER_ELEMENT,(xt+1)*St/wt.data.BYTES_PER_ELEMENT);e.texSubImage3D(n.TEXTURE_2D_ARRAY,0,0,0,xt,wt.width,wt.height,1,Dt,jt,Ht)}P.clearLayerUpdates()}else e.texSubImage3D(n.TEXTURE_2D_ARRAY,0,0,0,0,wt.width,wt.height,wt.depth,Dt,jt,wt.data)}else e.texImage3D(n.TEXTURE_2D_ARRAY,0,zt,wt.width,wt.height,wt.depth,0,Dt,jt,wt.data);else if(P.isData3DTexture)X?(Tt&&e.texStorage3D(n.TEXTURE_3D,Ft,zt,wt.width,wt.height,wt.depth),Ct&&e.texSubImage3D(n.TEXTURE_3D,0,0,0,0,wt.width,wt.height,wt.depth,Dt,jt,wt.data)):e.texImage3D(n.TEXTURE_3D,0,zt,wt.width,wt.height,wt.depth,0,Dt,jt,wt.data);else if(P.isFramebufferTexture){if(Tt)if(X)e.texStorage2D(n.TEXTURE_2D,Ft,zt,wt.width,wt.height);else{let St=wt.width,xt=wt.height;for(let Ht=0;Ht<Ft;Ht++)e.texImage2D(n.TEXTURE_2D,Ht,zt,St,xt,0,Dt,jt,null),St>>=1,xt>>=1}}else if(ee.length>0){if(X&&Tt){const St=Yt(ee[0]);e.texStorage2D(n.TEXTURE_2D,Ft,zt,St.width,St.height)}for(let St=0,xt=ee.length;St<xt;St++)Pt=ee[St],X?Ct&&e.texSubImage2D(n.TEXTURE_2D,St,0,0,Dt,jt,Pt):e.texImage2D(n.TEXTURE_2D,St,zt,Dt,jt,Pt);P.generateMipmaps=!1}else if(X){if(Tt){const St=Yt(wt);e.texStorage2D(n.TEXTURE_2D,Ft,zt,St.width,St.height)}Ct&&e.texSubImage2D(n.TEXTURE_2D,0,0,0,Dt,jt,wt)}else e.texImage2D(n.TEXTURE_2D,0,zt,Dt,jt,wt);g(P)&&m(lt),Vt.__version=dt.version,P.onUpdate&&P.onUpdate(P)}F.__version=P.version}function J(F,P,j){if(P.image.length!==6)return;const lt=At(F,P),bt=P.source;e.bindTexture(n.TEXTURE_CUBE_MAP,F.__webglTexture,n.TEXTURE0+j);const dt=i.get(bt);if(bt.version!==dt.__version||lt===!0){e.activeTexture(n.TEXTURE0+j);const Vt=ue.getPrimaries(ue.workingColorSpace),Rt=P.colorSpace===Ni?null:ue.getPrimaries(P.colorSpace),kt=P.colorSpace===Ni||Vt===Rt?n.NONE:n.BROWSER_DEFAULT_WEBGL;n.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,P.flipY),n.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,P.premultiplyAlpha),n.pixelStorei(n.UNPACK_ALIGNMENT,P.unpackAlignment),n.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,kt);const Bt=P.isCompressedTexture||P.image[0].isCompressedTexture,wt=P.image[0]&&P.image[0].isDataTexture,Dt=[];for(let xt=0;xt<6;xt++)!Bt&&!wt?Dt[xt]=v(P.image[xt],!0,s.maxCubemapSize):Dt[xt]=wt?P.image[xt].image:P.image[xt],Dt[xt]=Jt(P,Dt[xt]);const jt=Dt[0],zt=r.convert(P.format,P.colorSpace),Pt=r.convert(P.type),ee=x(P.internalFormat,zt,Pt,P.colorSpace),X=P.isVideoTexture!==!0,Tt=dt.__version===void 0||lt===!0,Ct=bt.dataReady;let Ft=w(P,jt);_t(n.TEXTURE_CUBE_MAP,P);let St;if(Bt){X&&Tt&&e.texStorage2D(n.TEXTURE_CUBE_MAP,Ft,ee,jt.width,jt.height);for(let xt=0;xt<6;xt++){St=Dt[xt].mipmaps;for(let Ht=0;Ht<St.length;Ht++){const te=St[Ht];P.format!==Je?zt!==null?X?Ct&&e.compressedTexSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+xt,Ht,0,0,te.width,te.height,zt,te.data):e.compressedTexImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+xt,Ht,ee,te.width,te.height,0,te.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):X?Ct&&e.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+xt,Ht,0,0,te.width,te.height,zt,Pt,te.data):e.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+xt,Ht,ee,te.width,te.height,0,zt,Pt,te.data)}}}else{if(St=P.mipmaps,X&&Tt){St.length>0&&Ft++;const xt=Yt(Dt[0]);e.texStorage2D(n.TEXTURE_CUBE_MAP,Ft,ee,xt.width,xt.height)}for(let xt=0;xt<6;xt++)if(wt){X?Ct&&e.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+xt,0,0,0,Dt[xt].width,Dt[xt].height,zt,Pt,Dt[xt].data):e.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+xt,0,ee,Dt[xt].width,Dt[xt].height,0,zt,Pt,Dt[xt].data);for(let Ht=0;Ht<St.length;Ht++){const Se=St[Ht].image[xt].image;X?Ct&&e.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+xt,Ht+1,0,0,Se.width,Se.height,zt,Pt,Se.data):e.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+xt,Ht+1,ee,Se.width,Se.height,0,zt,Pt,Se.data)}}else{X?Ct&&e.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+xt,0,0,0,zt,Pt,Dt[xt]):e.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+xt,0,ee,zt,Pt,Dt[xt]);for(let Ht=0;Ht<St.length;Ht++){const te=St[Ht];X?Ct&&e.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+xt,Ht+1,0,0,zt,Pt,te.image[xt]):e.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+xt,Ht+1,ee,zt,Pt,te.image[xt])}}}g(P)&&m(n.TEXTURE_CUBE_MAP),dt.__version=bt.version,P.onUpdate&&P.onUpdate(P)}F.__version=P.version}function H(F,P,j,lt,bt,dt){const Vt=r.convert(j.format,j.colorSpace),Rt=r.convert(j.type),kt=x(j.internalFormat,Vt,Rt,j.colorSpace),Bt=i.get(P),wt=i.get(j);if(wt.__renderTarget=P,!Bt.__hasExternalTextures){const Dt=Math.max(1,P.width>>dt),jt=Math.max(1,P.height>>dt);bt===n.TEXTURE_3D||bt===n.TEXTURE_2D_ARRAY?e.texImage3D(bt,dt,kt,Dt,jt,P.depth,0,Vt,Rt,null):e.texImage2D(bt,dt,kt,Dt,jt,0,Vt,Rt,null)}e.bindFramebuffer(n.FRAMEBUFFER,F),Mt(P)?o.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,lt,bt,wt.__webglTexture,0,pt(P)):(bt===n.TEXTURE_2D||bt>=n.TEXTURE_CUBE_MAP_POSITIVE_X&&bt<=n.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&n.framebufferTexture2D(n.FRAMEBUFFER,lt,bt,wt.__webglTexture,dt),e.bindFramebuffer(n.FRAMEBUFFER,null)}function W(F,P,j){if(n.bindRenderbuffer(n.RENDERBUFFER,F),P.depthBuffer){const lt=P.depthTexture,bt=lt&&lt.isDepthTexture?lt.type:null,dt=b(P.stencilBuffer,bt),Vt=P.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,Rt=pt(P);Mt(P)?o.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,Rt,dt,P.width,P.height):j?n.renderbufferStorageMultisample(n.RENDERBUFFER,Rt,dt,P.width,P.height):n.renderbufferStorage(n.RENDERBUFFER,dt,P.width,P.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,Vt,n.RENDERBUFFER,F)}else{const lt=P.textures;for(let bt=0;bt<lt.length;bt++){const dt=lt[bt],Vt=r.convert(dt.format,dt.colorSpace),Rt=r.convert(dt.type),kt=x(dt.internalFormat,Vt,Rt,dt.colorSpace),Bt=pt(P);j&&Mt(P)===!1?n.renderbufferStorageMultisample(n.RENDERBUFFER,Bt,kt,P.width,P.height):Mt(P)?o.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,Bt,kt,P.width,P.height):n.renderbufferStorage(n.RENDERBUFFER,kt,P.width,P.height)}}n.bindRenderbuffer(n.RENDERBUFFER,null)}function V(F,P){if(P&&P.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(e.bindFramebuffer(n.FRAMEBUFFER,F),!(P.depthTexture&&P.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");const lt=i.get(P.depthTexture);lt.__renderTarget=P,(!lt.__webglTexture||P.depthTexture.image.width!==P.width||P.depthTexture.image.height!==P.height)&&(P.depthTexture.image.width=P.width,P.depthTexture.image.height=P.height,P.depthTexture.needsUpdate=!0),D(P.depthTexture,0);const bt=lt.__webglTexture,dt=pt(P);if(P.depthTexture.format===_o)Mt(P)?o.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,n.DEPTH_ATTACHMENT,n.TEXTURE_2D,bt,0,dt):n.framebufferTexture2D(n.FRAMEBUFFER,n.DEPTH_ATTACHMENT,n.TEXTURE_2D,bt,0);else if(P.depthTexture.format===Mo)Mt(P)?o.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,n.DEPTH_STENCIL_ATTACHMENT,n.TEXTURE_2D,bt,0,dt):n.framebufferTexture2D(n.FRAMEBUFFER,n.DEPTH_STENCIL_ATTACHMENT,n.TEXTURE_2D,bt,0);else throw new Error("Unknown depthTexture format")}function tt(F){const P=i.get(F),j=F.isWebGLCubeRenderTarget===!0;if(P.__boundDepthTexture!==F.depthTexture){const lt=F.depthTexture;if(P.__depthDisposeCallback&&P.__depthDisposeCallback(),lt){const bt=()=>{delete P.__boundDepthTexture,delete P.__depthDisposeCallback,lt.removeEventListener("dispose",bt)};lt.addEventListener("dispose",bt),P.__depthDisposeCallback=bt}P.__boundDepthTexture=lt}if(F.depthTexture&&!P.__autoAllocateDepthBuffer){if(j)throw new Error("target.depthTexture not supported in Cube render targets");const lt=F.texture.mipmaps;lt&&lt.length>0?V(P.__webglFramebuffer[0],F):V(P.__webglFramebuffer,F)}else if(j){P.__webglDepthbuffer=[];for(let lt=0;lt<6;lt++)if(e.bindFramebuffer(n.FRAMEBUFFER,P.__webglFramebuffer[lt]),P.__webglDepthbuffer[lt]===void 0)P.__webglDepthbuffer[lt]=n.createRenderbuffer(),W(P.__webglDepthbuffer[lt],F,!1);else{const bt=F.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,dt=P.__webglDepthbuffer[lt];n.bindRenderbuffer(n.RENDERBUFFER,dt),n.framebufferRenderbuffer(n.FRAMEBUFFER,bt,n.RENDERBUFFER,dt)}}else{const lt=F.texture.mipmaps;if(lt&&lt.length>0?e.bindFramebuffer(n.FRAMEBUFFER,P.__webglFramebuffer[0]):e.bindFramebuffer(n.FRAMEBUFFER,P.__webglFramebuffer),P.__webglDepthbuffer===void 0)P.__webglDepthbuffer=n.createRenderbuffer(),W(P.__webglDepthbuffer,F,!1);else{const bt=F.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,dt=P.__webglDepthbuffer;n.bindRenderbuffer(n.RENDERBUFFER,dt),n.framebufferRenderbuffer(n.FRAMEBUFFER,bt,n.RENDERBUFFER,dt)}}e.bindFramebuffer(n.FRAMEBUFFER,null)}function st(F,P,j){const lt=i.get(F);P!==void 0&&H(lt.__webglFramebuffer,F,F.texture,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,0),j!==void 0&&tt(F)}function N(F){const P=F.texture,j=i.get(F),lt=i.get(P);F.addEventListener("dispose",A);const bt=F.textures,dt=F.isWebGLCubeRenderTarget===!0,Vt=bt.length>1;if(Vt||(lt.__webglTexture===void 0&&(lt.__webglTexture=n.createTexture()),lt.__version=P.version,a.memory.textures++),dt){j.__webglFramebuffer=[];for(let Rt=0;Rt<6;Rt++)if(P.mipmaps&&P.mipmaps.length>0){j.__webglFramebuffer[Rt]=[];for(let kt=0;kt<P.mipmaps.length;kt++)j.__webglFramebuffer[Rt][kt]=n.createFramebuffer()}else j.__webglFramebuffer[Rt]=n.createFramebuffer()}else{if(P.mipmaps&&P.mipmaps.length>0){j.__webglFramebuffer=[];for(let Rt=0;Rt<P.mipmaps.length;Rt++)j.__webglFramebuffer[Rt]=n.createFramebuffer()}else j.__webglFramebuffer=n.createFramebuffer();if(Vt)for(let Rt=0,kt=bt.length;Rt<kt;Rt++){const Bt=i.get(bt[Rt]);Bt.__webglTexture===void 0&&(Bt.__webglTexture=n.createTexture(),a.memory.textures++)}if(F.samples>0&&Mt(F)===!1){j.__webglMultisampledFramebuffer=n.createFramebuffer(),j.__webglColorRenderbuffer=[],e.bindFramebuffer(n.FRAMEBUFFER,j.__webglMultisampledFramebuffer);for(let Rt=0;Rt<bt.length;Rt++){const kt=bt[Rt];j.__webglColorRenderbuffer[Rt]=n.createRenderbuffer(),n.bindRenderbuffer(n.RENDERBUFFER,j.__webglColorRenderbuffer[Rt]);const Bt=r.convert(kt.format,kt.colorSpace),wt=r.convert(kt.type),Dt=x(kt.internalFormat,Bt,wt,kt.colorSpace,F.isXRRenderTarget===!0),jt=pt(F);n.renderbufferStorageMultisample(n.RENDERBUFFER,jt,Dt,F.width,F.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+Rt,n.RENDERBUFFER,j.__webglColorRenderbuffer[Rt])}n.bindRenderbuffer(n.RENDERBUFFER,null),F.depthBuffer&&(j.__webglDepthRenderbuffer=n.createRenderbuffer(),W(j.__webglDepthRenderbuffer,F,!0)),e.bindFramebuffer(n.FRAMEBUFFER,null)}}if(dt){e.bindTexture(n.TEXTURE_CUBE_MAP,lt.__webglTexture),_t(n.TEXTURE_CUBE_MAP,P);for(let Rt=0;Rt<6;Rt++)if(P.mipmaps&&P.mipmaps.length>0)for(let kt=0;kt<P.mipmaps.length;kt++)H(j.__webglFramebuffer[Rt][kt],F,P,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+Rt,kt);else H(j.__webglFramebuffer[Rt],F,P,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+Rt,0);g(P)&&m(n.TEXTURE_CUBE_MAP),e.unbindTexture()}else if(Vt){for(let Rt=0,kt=bt.length;Rt<kt;Rt++){const Bt=bt[Rt],wt=i.get(Bt);let Dt=n.TEXTURE_2D;(F.isWebGL3DRenderTarget||F.isWebGLArrayRenderTarget)&&(Dt=F.isWebGL3DRenderTarget?n.TEXTURE_3D:n.TEXTURE_2D_ARRAY),e.bindTexture(Dt,wt.__webglTexture),_t(Dt,Bt),H(j.__webglFramebuffer,F,Bt,n.COLOR_ATTACHMENT0+Rt,Dt,0),g(Bt)&&m(Dt)}e.unbindTexture()}else{let Rt=n.TEXTURE_2D;if((F.isWebGL3DRenderTarget||F.isWebGLArrayRenderTarget)&&(Rt=F.isWebGL3DRenderTarget?n.TEXTURE_3D:n.TEXTURE_2D_ARRAY),e.bindTexture(Rt,lt.__webglTexture),_t(Rt,P),P.mipmaps&&P.mipmaps.length>0)for(let kt=0;kt<P.mipmaps.length;kt++)H(j.__webglFramebuffer[kt],F,P,n.COLOR_ATTACHMENT0,Rt,kt);else H(j.__webglFramebuffer,F,P,n.COLOR_ATTACHMENT0,Rt,0);g(P)&&m(Rt),e.unbindTexture()}F.depthBuffer&&tt(F)}function Q(F){const P=F.textures;for(let j=0,lt=P.length;j<lt;j++){const bt=P[j];if(g(bt)){const dt=_(F),Vt=i.get(bt).__webglTexture;e.bindTexture(dt,Vt),m(dt),e.unbindTexture()}}}const Z=[],et=[];function ot(F){if(F.samples>0){if(Mt(F)===!1){const P=F.textures,j=F.width,lt=F.height;let bt=n.COLOR_BUFFER_BIT;const dt=F.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,Vt=i.get(F),Rt=P.length>1;if(Rt)for(let Bt=0;Bt<P.length;Bt++)e.bindFramebuffer(n.FRAMEBUFFER,Vt.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+Bt,n.RENDERBUFFER,null),e.bindFramebuffer(n.FRAMEBUFFER,Vt.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+Bt,n.TEXTURE_2D,null,0);e.bindFramebuffer(n.READ_FRAMEBUFFER,Vt.__webglMultisampledFramebuffer);const kt=F.texture.mipmaps;kt&&kt.length>0?e.bindFramebuffer(n.DRAW_FRAMEBUFFER,Vt.__webglFramebuffer[0]):e.bindFramebuffer(n.DRAW_FRAMEBUFFER,Vt.__webglFramebuffer);for(let Bt=0;Bt<P.length;Bt++){if(F.resolveDepthBuffer&&(F.depthBuffer&&(bt|=n.DEPTH_BUFFER_BIT),F.stencilBuffer&&F.resolveStencilBuffer&&(bt|=n.STENCIL_BUFFER_BIT)),Rt){n.framebufferRenderbuffer(n.READ_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.RENDERBUFFER,Vt.__webglColorRenderbuffer[Bt]);const wt=i.get(P[Bt]).__webglTexture;n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,wt,0)}n.blitFramebuffer(0,0,j,lt,0,0,j,lt,bt,n.NEAREST),c===!0&&(Z.length=0,et.length=0,Z.push(n.COLOR_ATTACHMENT0+Bt),F.depthBuffer&&F.resolveDepthBuffer===!1&&(Z.push(dt),et.push(dt),n.invalidateFramebuffer(n.DRAW_FRAMEBUFFER,et)),n.invalidateFramebuffer(n.READ_FRAMEBUFFER,Z))}if(e.bindFramebuffer(n.READ_FRAMEBUFFER,null),e.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),Rt)for(let Bt=0;Bt<P.length;Bt++){e.bindFramebuffer(n.FRAMEBUFFER,Vt.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+Bt,n.RENDERBUFFER,Vt.__webglColorRenderbuffer[Bt]);const wt=i.get(P[Bt]).__webglTexture;e.bindFramebuffer(n.FRAMEBUFFER,Vt.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+Bt,n.TEXTURE_2D,wt,0)}e.bindFramebuffer(n.DRAW_FRAMEBUFFER,Vt.__webglMultisampledFramebuffer)}else if(F.depthBuffer&&F.resolveDepthBuffer===!1&&c){const P=F.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT;n.invalidateFramebuffer(n.DRAW_FRAMEBUFFER,[P])}}}function pt(F){return Math.min(s.maxSamples,F.samples)}function Mt(F){const P=i.get(F);return F.samples>0&&t.has("WEBGL_multisampled_render_to_texture")===!0&&P.__useRenderToTexture!==!1}function yt(F){const P=a.render.frame;h.get(F)!==P&&(h.set(F,P),F.update())}function Jt(F,P){const j=F.colorSpace,lt=F.format,bt=F.type;return F.isCompressedTexture===!0||F.isVideoTexture===!0||j!==gr&&j!==Ni&&(ue.getTransfer(j)===xe?(lt!==Je||bt!==Mi)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",j)),P}function Yt(F){return typeof HTMLImageElement<"u"&&F instanceof HTMLImageElement?(l.width=F.naturalWidth||F.width,l.height=F.naturalHeight||F.height):typeof VideoFrame<"u"&&F instanceof VideoFrame?(l.width=F.displayWidth,l.height=F.displayHeight):(l.width=F.width,l.height=F.height),l}this.allocateTextureUnit=I,this.resetTextureUnits=R,this.setTexture2D=D,this.setTexture2DArray=k,this.setTexture3D=q,this.setTextureCube=z,this.rebindTextures=st,this.setupRenderTarget=N,this.updateRenderTargetMipmap=Q,this.updateMultisampleRenderTarget=ot,this.setupDepthRenderbuffer=tt,this.setupFrameBufferTexture=H,this.useMultisampledRTT=Mt}function Hb(n,t){function e(i,s=Ni){let r;const a=ue.getTransfer(s);if(i===Mi)return n.UNSIGNED_BYTE;if(i===a0)return n.UNSIGNED_SHORT_4_4_4_4;if(i===o0)return n.UNSIGNED_SHORT_5_5_5_1;if(i===sp)return n.UNSIGNED_INT_5_9_9_9_REV;if(i===rp)return n.UNSIGNED_INT_10F_11F_11F_REV;if(i===np)return n.BYTE;if(i===ip)return n.SHORT;if(i===vo)return n.UNSIGNED_SHORT;if(i===r0)return n.INT;if(i===mr)return n.UNSIGNED_INT;if(i===Bi)return n.FLOAT;if(i===_r)return n.HALF_FLOAT;if(i===ap)return n.ALPHA;if(i===op)return n.RGB;if(i===Je)return n.RGBA;if(i===_o)return n.DEPTH_COMPONENT;if(i===Mo)return n.DEPTH_STENCIL;if(i===cp)return n.RED;if(i===c0)return n.RED_INTEGER;if(i===lp)return n.RG;if(i===l0)return n.RG_INTEGER;if(i===h0)return n.RGBA_INTEGER;if(i===Uc||i===Nc||i===Fc||i===Oc)if(a===xe)if(r=t.get("WEBGL_compressed_texture_s3tc_srgb"),r!==null){if(i===Uc)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(i===Nc)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(i===Fc)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(i===Oc)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(r=t.get("WEBGL_compressed_texture_s3tc"),r!==null){if(i===Uc)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(i===Nc)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(i===Fc)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(i===Oc)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(i===Jh||i===Qh||i===tu||i===eu)if(r=t.get("WEBGL_compressed_texture_pvrtc"),r!==null){if(i===Jh)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(i===Qh)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(i===tu)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(i===eu)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(i===nu||i===iu||i===su)if(r=t.get("WEBGL_compressed_texture_etc"),r!==null){if(i===nu||i===iu)return a===xe?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(i===su)return a===xe?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(i===ru||i===au||i===ou||i===cu||i===lu||i===hu||i===uu||i===fu||i===du||i===pu||i===mu||i===gu||i===vu||i===xu)if(r=t.get("WEBGL_compressed_texture_astc"),r!==null){if(i===ru)return a===xe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(i===au)return a===xe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(i===ou)return a===xe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(i===cu)return a===xe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(i===lu)return a===xe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(i===hu)return a===xe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(i===uu)return a===xe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(i===fu)return a===xe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(i===du)return a===xe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(i===pu)return a===xe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(i===mu)return a===xe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(i===gu)return a===xe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(i===vu)return a===xe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(i===xu)return a===xe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(i===_u||i===Mu||i===bu)if(r=t.get("EXT_texture_compression_bptc"),r!==null){if(i===_u)return a===xe?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(i===Mu)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(i===bu)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(i===yu||i===wu||i===Su||i===Eu)if(r=t.get("EXT_texture_compression_rgtc"),r!==null){if(i===yu)return r.COMPRESSED_RED_RGTC1_EXT;if(i===wu)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(i===Su)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(i===Eu)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return i===xo?n.UNSIGNED_INT_24_8:n[i]!==void 0?n[i]:null}return{convert:e}}const Vb=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,zb=`
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

}`;class Gb{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(t,e){if(this.texture===null){const i=new Ep(t.texture);(t.depthNear!==e.depthNear||t.depthFar!==e.depthFar)&&(this.depthNear=t.depthNear,this.depthFar=t.depthFar),this.texture=i}}getMesh(t){if(this.texture!==null&&this.mesh===null){const e=t.cameras[0].viewport,i=new Ze({vertexShader:Vb,fragmentShader:zb,uniforms:{depthColor:{value:this.texture},depthWidth:{value:e.z},depthHeight:{value:e.w}}});this.mesh=new mt(new ls(20,20),i)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class Wb extends Na{constructor(t,e){super();const i=this;let s=null,r=1,a=null,o="local-floor",c=1,l=null,h=null,u=null,d=null,f=null,p=null;const v=typeof XRWebGLBinding<"u",g=new Gb,m={},_=e.getContextAttributes();let x=null,b=null;const w=[],E=[],A=new ht;let T=null;const M=new Dn;M.viewport=new de;const y=new Dn;y.viewport=new de;const S=[M,y],R=new cx;let I=null,L=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(G){let J=w[G];return J===void 0&&(J=new Ql,w[G]=J),J.getTargetRaySpace()},this.getControllerGrip=function(G){let J=w[G];return J===void 0&&(J=new Ql,w[G]=J),J.getGripSpace()},this.getHand=function(G){let J=w[G];return J===void 0&&(J=new Ql,w[G]=J),J.getHandSpace()};function D(G){const J=E.indexOf(G.inputSource);if(J===-1)return;const H=w[J];H!==void 0&&(H.update(G.inputSource,G.frame,l||a),H.dispatchEvent({type:G.type,data:G.inputSource}))}function k(){s.removeEventListener("select",D),s.removeEventListener("selectstart",D),s.removeEventListener("selectend",D),s.removeEventListener("squeeze",D),s.removeEventListener("squeezestart",D),s.removeEventListener("squeezeend",D),s.removeEventListener("end",k),s.removeEventListener("inputsourceschange",q);for(let G=0;G<w.length;G++){const J=E[G];J!==null&&(E[G]=null,w[G].disconnect(J))}I=null,L=null,g.reset();for(const G in m)delete m[G];t.setRenderTarget(x),f=null,d=null,u=null,s=null,b=null,ct.stop(),i.isPresenting=!1,t.setPixelRatio(T),t.setSize(A.width,A.height,!1),i.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(G){r=G,i.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(G){o=G,i.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return l||a},this.setReferenceSpace=function(G){l=G},this.getBaseLayer=function(){return d!==null?d:f},this.getBinding=function(){return u===null&&v&&(u=new XRWebGLBinding(s,e)),u},this.getFrame=function(){return p},this.getSession=function(){return s},this.setSession=async function(G){if(s=G,s!==null){if(x=t.getRenderTarget(),s.addEventListener("select",D),s.addEventListener("selectstart",D),s.addEventListener("selectend",D),s.addEventListener("squeeze",D),s.addEventListener("squeezestart",D),s.addEventListener("squeezeend",D),s.addEventListener("end",k),s.addEventListener("inputsourceschange",q),_.xrCompatible!==!0&&await e.makeXRCompatible(),T=t.getPixelRatio(),t.getSize(A),v&&"createProjectionLayer"in XRWebGLBinding.prototype){let H=null,W=null,V=null;_.depth&&(V=_.stencil?e.DEPTH24_STENCIL8:e.DEPTH_COMPONENT24,H=_.stencil?Mo:_o,W=_.stencil?xo:mr);const tt={colorFormat:e.RGBA8,depthFormat:V,scaleFactor:r};u=this.getBinding(),d=u.createProjectionLayer(tt),s.updateRenderState({layers:[d]}),t.setPixelRatio(1),t.setSize(d.textureWidth,d.textureHeight,!1),b=new dn(d.textureWidth,d.textureHeight,{format:Je,type:Mi,depthTexture:new Sp(d.textureWidth,d.textureHeight,W,void 0,void 0,void 0,void 0,void 0,void 0,H),stencilBuffer:_.stencil,colorSpace:t.outputColorSpace,samples:_.antialias?4:0,resolveDepthBuffer:d.ignoreDepthValues===!1,resolveStencilBuffer:d.ignoreDepthValues===!1})}else{const H={antialias:_.antialias,alpha:!0,depth:_.depth,stencil:_.stencil,framebufferScaleFactor:r};f=new XRWebGLLayer(s,e,H),s.updateRenderState({baseLayer:f}),t.setPixelRatio(1),t.setSize(f.framebufferWidth,f.framebufferHeight,!1),b=new dn(f.framebufferWidth,f.framebufferHeight,{format:Je,type:Mi,colorSpace:t.outputColorSpace,stencilBuffer:_.stencil,resolveDepthBuffer:f.ignoreDepthValues===!1,resolveStencilBuffer:f.ignoreDepthValues===!1})}b.isXRRenderTarget=!0,this.setFoveation(c),l=null,a=await s.requestReferenceSpace(o),ct.setContext(s),ct.start(),i.isPresenting=!0,i.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode},this.getDepthTexture=function(){return g.getDepthTexture()};function q(G){for(let J=0;J<G.removed.length;J++){const H=G.removed[J],W=E.indexOf(H);W>=0&&(E[W]=null,w[W].disconnect(H))}for(let J=0;J<G.added.length;J++){const H=G.added[J];let W=E.indexOf(H);if(W===-1){for(let tt=0;tt<w.length;tt++)if(tt>=E.length){E.push(H),W=tt;break}else if(E[tt]===null){E[tt]=H,W=tt;break}if(W===-1)break}const V=w[W];V&&V.connect(H)}}const z=new C,it=new C;function ut(G,J,H){z.setFromMatrixPosition(J.matrixWorld),it.setFromMatrixPosition(H.matrixWorld);const W=z.distanceTo(it),V=J.projectionMatrix.elements,tt=H.projectionMatrix.elements,st=V[14]/(V[10]-1),N=V[14]/(V[10]+1),Q=(V[9]+1)/V[5],Z=(V[9]-1)/V[5],et=(V[8]-1)/V[0],ot=(tt[8]+1)/tt[0],pt=st*et,Mt=st*ot,yt=W/(-et+ot),Jt=yt*-et;if(J.matrixWorld.decompose(G.position,G.quaternion,G.scale),G.translateX(Jt),G.translateZ(yt),G.matrixWorld.compose(G.position,G.quaternion,G.scale),G.matrixWorldInverse.copy(G.matrixWorld).invert(),V[10]===-1)G.projectionMatrix.copy(J.projectionMatrix),G.projectionMatrixInverse.copy(J.projectionMatrixInverse);else{const Yt=st+yt,F=N+yt,P=pt-Jt,j=Mt+(W-Jt),lt=Q*N/F*Yt,bt=Z*N/F*Yt;G.projectionMatrix.makePerspective(P,j,lt,bt,Yt,F),G.projectionMatrixInverse.copy(G.projectionMatrix).invert()}}function gt(G,J){J===null?G.matrixWorld.copy(G.matrix):G.matrixWorld.multiplyMatrices(J.matrixWorld,G.matrix),G.matrixWorldInverse.copy(G.matrixWorld).invert()}this.updateCamera=function(G){if(s===null)return;let J=G.near,H=G.far;g.texture!==null&&(g.depthNear>0&&(J=g.depthNear),g.depthFar>0&&(H=g.depthFar)),R.near=y.near=M.near=J,R.far=y.far=M.far=H,(I!==R.near||L!==R.far)&&(s.updateRenderState({depthNear:R.near,depthFar:R.far}),I=R.near,L=R.far),R.layers.mask=G.layers.mask|6,M.layers.mask=R.layers.mask&3,y.layers.mask=R.layers.mask&5;const W=G.parent,V=R.cameras;gt(R,W);for(let tt=0;tt<V.length;tt++)gt(V[tt],W);V.length===2?ut(R,M,y):R.projectionMatrix.copy(M.projectionMatrix),_t(G,R,W)};function _t(G,J,H){H===null?G.matrix.copy(J.matrixWorld):(G.matrix.copy(H.matrixWorld),G.matrix.invert(),G.matrix.multiply(J.matrixWorld)),G.matrix.decompose(G.position,G.quaternion,G.scale),G.updateMatrixWorld(!0),G.projectionMatrix.copy(J.projectionMatrix),G.projectionMatrixInverse.copy(J.projectionMatrixInverse),G.isPerspectiveCamera&&(G.fov=La*2*Math.atan(1/G.projectionMatrix.elements[5]),G.zoom=1)}this.getCamera=function(){return R},this.getFoveation=function(){if(!(d===null&&f===null))return c},this.setFoveation=function(G){c=G,d!==null&&(d.fixedFoveation=G),f!==null&&f.fixedFoveation!==void 0&&(f.fixedFoveation=G)},this.hasDepthSensing=function(){return g.texture!==null},this.getDepthSensingMesh=function(){return g.getMesh(R)},this.getCameraTexture=function(G){return m[G]};let At=null;function Ut(G,J){if(h=J.getViewerPose(l||a),p=J,h!==null){const H=h.views;f!==null&&(t.setRenderTargetFramebuffer(b,f.framebuffer),t.setRenderTarget(b));let W=!1;H.length!==R.cameras.length&&(R.cameras.length=0,W=!0);for(let N=0;N<H.length;N++){const Q=H[N];let Z=null;if(f!==null)Z=f.getViewport(Q);else{const ot=u.getViewSubImage(d,Q);Z=ot.viewport,N===0&&(t.setRenderTargetTextures(b,ot.colorTexture,ot.depthStencilTexture),t.setRenderTarget(b))}let et=S[N];et===void 0&&(et=new Dn,et.layers.enable(N),et.viewport=new de,S[N]=et),et.matrix.fromArray(Q.transform.matrix),et.matrix.decompose(et.position,et.quaternion,et.scale),et.projectionMatrix.fromArray(Q.projectionMatrix),et.projectionMatrixInverse.copy(et.projectionMatrix).invert(),et.viewport.set(Z.x,Z.y,Z.width,Z.height),N===0&&(R.matrix.copy(et.matrix),R.matrix.decompose(R.position,R.quaternion,R.scale)),W===!0&&R.cameras.push(et)}const V=s.enabledFeatures;if(V&&V.includes("depth-sensing")&&s.depthUsage=="gpu-optimized"&&v){u=i.getBinding();const N=u.getDepthInformation(H[0]);N&&N.isValid&&N.texture&&g.init(N,s.renderState)}if(V&&V.includes("camera-access")&&v){t.state.unbindTexture(),u=i.getBinding();for(let N=0;N<H.length;N++){const Q=H[N].camera;if(Q){let Z=m[Q];Z||(Z=new Ep,m[Q]=Z);const et=u.getCameraImage(Q);Z.sourceTexture=et}}}}for(let H=0;H<w.length;H++){const W=E[H],V=w[H];W!==null&&V!==void 0&&V.update(W,J,l||a)}At&&At(G,J),J.detectedPlanes&&i.dispatchEvent({type:"planesdetected",data:J}),p=null}const ct=new Fp;ct.setAnimationLoop(Ut),this.setAnimationLoop=function(G){At=G},this.dispose=function(){}}}const qs=new gn,Xb=new se;function qb(n,t){function e(g,m){g.matrixAutoUpdate===!0&&g.updateMatrix(),m.value.copy(g.matrix)}function i(g,m){m.color.getRGB(g.fogColor.value,vp(n)),m.isFog?(g.fogNear.value=m.near,g.fogFar.value=m.far):m.isFogExp2&&(g.fogDensity.value=m.density)}function s(g,m,_,x,b){m.isMeshBasicMaterial||m.isMeshLambertMaterial?r(g,m):m.isMeshToonMaterial?(r(g,m),u(g,m)):m.isMeshPhongMaterial?(r(g,m),h(g,m)):m.isMeshStandardMaterial?(r(g,m),d(g,m),m.isMeshPhysicalMaterial&&f(g,m,b)):m.isMeshMatcapMaterial?(r(g,m),p(g,m)):m.isMeshDepthMaterial?r(g,m):m.isMeshDistanceMaterial?(r(g,m),v(g,m)):m.isMeshNormalMaterial?r(g,m):m.isLineBasicMaterial?(a(g,m),m.isLineDashedMaterial&&o(g,m)):m.isPointsMaterial?c(g,m,_,x):m.isSpriteMaterial?l(g,m):m.isShadowMaterial?(g.color.value.copy(m.color),g.opacity.value=m.opacity):m.isShaderMaterial&&(m.uniformsNeedUpdate=!1)}function r(g,m){g.opacity.value=m.opacity,m.color&&g.diffuse.value.copy(m.color),m.emissive&&g.emissive.value.copy(m.emissive).multiplyScalar(m.emissiveIntensity),m.map&&(g.map.value=m.map,e(m.map,g.mapTransform)),m.alphaMap&&(g.alphaMap.value=m.alphaMap,e(m.alphaMap,g.alphaMapTransform)),m.bumpMap&&(g.bumpMap.value=m.bumpMap,e(m.bumpMap,g.bumpMapTransform),g.bumpScale.value=m.bumpScale,m.side===Tn&&(g.bumpScale.value*=-1)),m.normalMap&&(g.normalMap.value=m.normalMap,e(m.normalMap,g.normalMapTransform),g.normalScale.value.copy(m.normalScale),m.side===Tn&&g.normalScale.value.negate()),m.displacementMap&&(g.displacementMap.value=m.displacementMap,e(m.displacementMap,g.displacementMapTransform),g.displacementScale.value=m.displacementScale,g.displacementBias.value=m.displacementBias),m.emissiveMap&&(g.emissiveMap.value=m.emissiveMap,e(m.emissiveMap,g.emissiveMapTransform)),m.specularMap&&(g.specularMap.value=m.specularMap,e(m.specularMap,g.specularMapTransform)),m.alphaTest>0&&(g.alphaTest.value=m.alphaTest);const _=t.get(m),x=_.envMap,b=_.envMapRotation;x&&(g.envMap.value=x,qs.copy(b),qs.x*=-1,qs.y*=-1,qs.z*=-1,x.isCubeTexture&&x.isRenderTargetTexture===!1&&(qs.y*=-1,qs.z*=-1),g.envMapRotation.value.setFromMatrix4(Xb.makeRotationFromEuler(qs)),g.flipEnvMap.value=x.isCubeTexture&&x.isRenderTargetTexture===!1?-1:1,g.reflectivity.value=m.reflectivity,g.ior.value=m.ior,g.refractionRatio.value=m.refractionRatio),m.lightMap&&(g.lightMap.value=m.lightMap,g.lightMapIntensity.value=m.lightMapIntensity,e(m.lightMap,g.lightMapTransform)),m.aoMap&&(g.aoMap.value=m.aoMap,g.aoMapIntensity.value=m.aoMapIntensity,e(m.aoMap,g.aoMapTransform))}function a(g,m){g.diffuse.value.copy(m.color),g.opacity.value=m.opacity,m.map&&(g.map.value=m.map,e(m.map,g.mapTransform))}function o(g,m){g.dashSize.value=m.dashSize,g.totalSize.value=m.dashSize+m.gapSize,g.scale.value=m.scale}function c(g,m,_,x){g.diffuse.value.copy(m.color),g.opacity.value=m.opacity,g.size.value=m.size*_,g.scale.value=x*.5,m.map&&(g.map.value=m.map,e(m.map,g.uvTransform)),m.alphaMap&&(g.alphaMap.value=m.alphaMap,e(m.alphaMap,g.alphaMapTransform)),m.alphaTest>0&&(g.alphaTest.value=m.alphaTest)}function l(g,m){g.diffuse.value.copy(m.color),g.opacity.value=m.opacity,g.rotation.value=m.rotation,m.map&&(g.map.value=m.map,e(m.map,g.mapTransform)),m.alphaMap&&(g.alphaMap.value=m.alphaMap,e(m.alphaMap,g.alphaMapTransform)),m.alphaTest>0&&(g.alphaTest.value=m.alphaTest)}function h(g,m){g.specular.value.copy(m.specular),g.shininess.value=Math.max(m.shininess,1e-4)}function u(g,m){m.gradientMap&&(g.gradientMap.value=m.gradientMap)}function d(g,m){g.metalness.value=m.metalness,m.metalnessMap&&(g.metalnessMap.value=m.metalnessMap,e(m.metalnessMap,g.metalnessMapTransform)),g.roughness.value=m.roughness,m.roughnessMap&&(g.roughnessMap.value=m.roughnessMap,e(m.roughnessMap,g.roughnessMapTransform)),m.envMap&&(g.envMapIntensity.value=m.envMapIntensity)}function f(g,m,_){g.ior.value=m.ior,m.sheen>0&&(g.sheenColor.value.copy(m.sheenColor).multiplyScalar(m.sheen),g.sheenRoughness.value=m.sheenRoughness,m.sheenColorMap&&(g.sheenColorMap.value=m.sheenColorMap,e(m.sheenColorMap,g.sheenColorMapTransform)),m.sheenRoughnessMap&&(g.sheenRoughnessMap.value=m.sheenRoughnessMap,e(m.sheenRoughnessMap,g.sheenRoughnessMapTransform))),m.clearcoat>0&&(g.clearcoat.value=m.clearcoat,g.clearcoatRoughness.value=m.clearcoatRoughness,m.clearcoatMap&&(g.clearcoatMap.value=m.clearcoatMap,e(m.clearcoatMap,g.clearcoatMapTransform)),m.clearcoatRoughnessMap&&(g.clearcoatRoughnessMap.value=m.clearcoatRoughnessMap,e(m.clearcoatRoughnessMap,g.clearcoatRoughnessMapTransform)),m.clearcoatNormalMap&&(g.clearcoatNormalMap.value=m.clearcoatNormalMap,e(m.clearcoatNormalMap,g.clearcoatNormalMapTransform),g.clearcoatNormalScale.value.copy(m.clearcoatNormalScale),m.side===Tn&&g.clearcoatNormalScale.value.negate())),m.dispersion>0&&(g.dispersion.value=m.dispersion),m.iridescence>0&&(g.iridescence.value=m.iridescence,g.iridescenceIOR.value=m.iridescenceIOR,g.iridescenceThicknessMinimum.value=m.iridescenceThicknessRange[0],g.iridescenceThicknessMaximum.value=m.iridescenceThicknessRange[1],m.iridescenceMap&&(g.iridescenceMap.value=m.iridescenceMap,e(m.iridescenceMap,g.iridescenceMapTransform)),m.iridescenceThicknessMap&&(g.iridescenceThicknessMap.value=m.iridescenceThicknessMap,e(m.iridescenceThicknessMap,g.iridescenceThicknessMapTransform))),m.transmission>0&&(g.transmission.value=m.transmission,g.transmissionSamplerMap.value=_.texture,g.transmissionSamplerSize.value.set(_.width,_.height),m.transmissionMap&&(g.transmissionMap.value=m.transmissionMap,e(m.transmissionMap,g.transmissionMapTransform)),g.thickness.value=m.thickness,m.thicknessMap&&(g.thicknessMap.value=m.thicknessMap,e(m.thicknessMap,g.thicknessMapTransform)),g.attenuationDistance.value=m.attenuationDistance,g.attenuationColor.value.copy(m.attenuationColor)),m.anisotropy>0&&(g.anisotropyVector.value.set(m.anisotropy*Math.cos(m.anisotropyRotation),m.anisotropy*Math.sin(m.anisotropyRotation)),m.anisotropyMap&&(g.anisotropyMap.value=m.anisotropyMap,e(m.anisotropyMap,g.anisotropyMapTransform))),g.specularIntensity.value=m.specularIntensity,g.specularColor.value.copy(m.specularColor),m.specularColorMap&&(g.specularColorMap.value=m.specularColorMap,e(m.specularColorMap,g.specularColorMapTransform)),m.specularIntensityMap&&(g.specularIntensityMap.value=m.specularIntensityMap,e(m.specularIntensityMap,g.specularIntensityMapTransform))}function p(g,m){m.matcap&&(g.matcap.value=m.matcap)}function v(g,m){const _=t.get(m).light;g.referencePosition.value.setFromMatrixPosition(_.matrixWorld),g.nearDistance.value=_.shadow.camera.near,g.farDistance.value=_.shadow.camera.far}return{refreshFogUniforms:i,refreshMaterialUniforms:s}}function $b(n,t,e,i){let s={},r={},a=[];const o=n.getParameter(n.MAX_UNIFORM_BUFFER_BINDINGS);function c(_,x){const b=x.program;i.uniformBlockBinding(_,b)}function l(_,x){let b=s[_.id];b===void 0&&(p(_),b=h(_),s[_.id]=b,_.addEventListener("dispose",g));const w=x.program;i.updateUBOMapping(_,w);const E=t.render.frame;r[_.id]!==E&&(d(_),r[_.id]=E)}function h(_){const x=u();_.__bindingPointIndex=x;const b=n.createBuffer(),w=_.__size,E=_.usage;return n.bindBuffer(n.UNIFORM_BUFFER,b),n.bufferData(n.UNIFORM_BUFFER,w,E),n.bindBuffer(n.UNIFORM_BUFFER,null),n.bindBufferBase(n.UNIFORM_BUFFER,x,b),b}function u(){for(let _=0;_<o;_++)if(a.indexOf(_)===-1)return a.push(_),_;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function d(_){const x=s[_.id],b=_.uniforms,w=_.__cache;n.bindBuffer(n.UNIFORM_BUFFER,x);for(let E=0,A=b.length;E<A;E++){const T=Array.isArray(b[E])?b[E]:[b[E]];for(let M=0,y=T.length;M<y;M++){const S=T[M];if(f(S,E,M,w)===!0){const R=S.__offset,I=Array.isArray(S.value)?S.value:[S.value];let L=0;for(let D=0;D<I.length;D++){const k=I[D],q=v(k);typeof k=="number"||typeof k=="boolean"?(S.__data[0]=k,n.bufferSubData(n.UNIFORM_BUFFER,R+L,S.__data)):k.isMatrix3?(S.__data[0]=k.elements[0],S.__data[1]=k.elements[1],S.__data[2]=k.elements[2],S.__data[3]=0,S.__data[4]=k.elements[3],S.__data[5]=k.elements[4],S.__data[6]=k.elements[5],S.__data[7]=0,S.__data[8]=k.elements[6],S.__data[9]=k.elements[7],S.__data[10]=k.elements[8],S.__data[11]=0):(k.toArray(S.__data,L),L+=q.storage/Float32Array.BYTES_PER_ELEMENT)}n.bufferSubData(n.UNIFORM_BUFFER,R,S.__data)}}}n.bindBuffer(n.UNIFORM_BUFFER,null)}function f(_,x,b,w){const E=_.value,A=x+"_"+b;if(w[A]===void 0)return typeof E=="number"||typeof E=="boolean"?w[A]=E:w[A]=E.clone(),!0;{const T=w[A];if(typeof E=="number"||typeof E=="boolean"){if(T!==E)return w[A]=E,!0}else if(T.equals(E)===!1)return T.copy(E),!0}return!1}function p(_){const x=_.uniforms;let b=0;const w=16;for(let A=0,T=x.length;A<T;A++){const M=Array.isArray(x[A])?x[A]:[x[A]];for(let y=0,S=M.length;y<S;y++){const R=M[y],I=Array.isArray(R.value)?R.value:[R.value];for(let L=0,D=I.length;L<D;L++){const k=I[L],q=v(k),z=b%w,it=z%q.boundary,ut=z+it;b+=it,ut!==0&&w-ut<q.storage&&(b+=w-ut),R.__data=new Float32Array(q.storage/Float32Array.BYTES_PER_ELEMENT),R.__offset=b,b+=q.storage}}}const E=b%w;return E>0&&(b+=w-E),_.__size=b,_.__cache={},this}function v(_){const x={boundary:0,storage:0};return typeof _=="number"||typeof _=="boolean"?(x.boundary=4,x.storage=4):_.isVector2?(x.boundary=8,x.storage=8):_.isVector3||_.isColor?(x.boundary=16,x.storage=12):_.isVector4?(x.boundary=16,x.storage=16):_.isMatrix3?(x.boundary=48,x.storage=48):_.isMatrix4?(x.boundary=64,x.storage=64):_.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",_),x}function g(_){const x=_.target;x.removeEventListener("dispose",g);const b=a.indexOf(x.__bindingPointIndex);a.splice(b,1),n.deleteBuffer(s[x.id]),delete s[x.id],delete r[x.id]}function m(){for(const _ in s)n.deleteBuffer(s[_]);a=[],s={},r={}}return{bind:c,update:l,dispose:m}}class Yb{constructor(t={}){const{canvas:e=H2(),context:i=null,depth:s=!0,stencil:r=!1,alpha:a=!1,antialias:o=!1,premultipliedAlpha:c=!0,preserveDrawingBuffer:l=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:u=!1,reversedDepthBuffer:d=!1}=t;this.isWebGLRenderer=!0;let f;if(i!==null){if(typeof WebGLRenderingContext<"u"&&i instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");f=i.getContextAttributes().alpha}else f=a;const p=new Uint32Array(4),v=new Int32Array(4);let g=null,m=null;const _=[],x=[];this.domElement=e,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=Ns,this.toneMappingExposure=1,this.transmissionResolutionScale=1;const b=this;let w=!1;this._outputColorSpace=rn;let E=0,A=0,T=null,M=-1,y=null;const S=new de,R=new de;let I=null;const L=new vt(0);let D=0,k=e.width,q=e.height,z=1,it=null,ut=null;const gt=new de(0,0,k,q),_t=new de(0,0,k,q);let At=!1;const Ut=new x0;let ct=!1,G=!1;const J=new se,H=new C,W=new de,V={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let tt=!1;function st(){return T===null?z:1}let N=i;function Q(U,$){return e.getContext(U,$)}try{const U={alpha:!0,depth:s,stencil:r,antialias:o,premultipliedAlpha:c,preserveDrawingBuffer:l,powerPreference:h,failIfMajorPerformanceCaveat:u};if("setAttribute"in e&&e.setAttribute("data-engine",`three.js r${s0}`),e.addEventListener("webglcontextlost",Ct,!1),e.addEventListener("webglcontextrestored",Ft,!1),e.addEventListener("webglcontextcreationerror",St,!1),N===null){const $="webgl2";if(N=Q($,U),N===null)throw Q($)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(U){throw console.error("THREE.WebGLRenderer: "+U.message),U}let Z,et,ot,pt,Mt,yt,Jt,Yt,F,P,j,lt,bt,dt,Vt,Rt,kt,Bt,wt,Dt,jt,zt,Pt,ee;function X(){Z=new s3(N),Z.init(),zt=new Hb(N,Z),et=new KM(N,Z,t,zt),ot=new kb(N,Z),et.reversedDepthBuffer&&d&&ot.buffers.depth.setReversed(!0),pt=new o3(N),Mt=new Eb,yt=new Bb(N,Z,ot,Mt,et,zt,pt),Jt=new QM(b),Yt=new i3(b),F=new dx(N),Pt=new jM(N,F),P=new r3(N,F,pt,Pt),j=new l3(N,P,F,pt),wt=new c3(N,et,yt),Rt=new JM(Mt),lt=new Sb(b,Jt,Yt,Z,et,Pt,Rt),bt=new qb(b,Mt),dt=new Ab,Vt=new Db(Z),Bt=new YM(b,Jt,Yt,ot,j,f,c),kt=new Fb(b,j,et),ee=new $b(N,pt,et,ot),Dt=new ZM(N,Z,pt),jt=new a3(N,Z,pt),pt.programs=lt.programs,b.capabilities=et,b.extensions=Z,b.properties=Mt,b.renderLists=dt,b.shadowMap=kt,b.state=ot,b.info=pt}X();const Tt=new Wb(b,N);this.xr=Tt,this.getContext=function(){return N},this.getContextAttributes=function(){return N.getContextAttributes()},this.forceContextLoss=function(){const U=Z.get("WEBGL_lose_context");U&&U.loseContext()},this.forceContextRestore=function(){const U=Z.get("WEBGL_lose_context");U&&U.restoreContext()},this.getPixelRatio=function(){return z},this.setPixelRatio=function(U){U!==void 0&&(z=U,this.setSize(k,q,!1))},this.getSize=function(U){return U.set(k,q)},this.setSize=function(U,$,nt=!0){if(Tt.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}k=U,q=$,e.width=Math.floor(U*z),e.height=Math.floor($*z),nt===!0&&(e.style.width=U+"px",e.style.height=$+"px"),this.setViewport(0,0,U,$)},this.getDrawingBufferSize=function(U){return U.set(k*z,q*z).floor()},this.setDrawingBufferSize=function(U,$,nt){k=U,q=$,z=nt,e.width=Math.floor(U*nt),e.height=Math.floor($*nt),this.setViewport(0,0,U,$)},this.getCurrentViewport=function(U){return U.copy(S)},this.getViewport=function(U){return U.copy(gt)},this.setViewport=function(U,$,nt,rt){U.isVector4?gt.set(U.x,U.y,U.z,U.w):gt.set(U,$,nt,rt),ot.viewport(S.copy(gt).multiplyScalar(z).round())},this.getScissor=function(U){return U.copy(_t)},this.setScissor=function(U,$,nt,rt){U.isVector4?_t.set(U.x,U.y,U.z,U.w):_t.set(U,$,nt,rt),ot.scissor(R.copy(_t).multiplyScalar(z).round())},this.getScissorTest=function(){return At},this.setScissorTest=function(U){ot.setScissorTest(At=U)},this.setOpaqueSort=function(U){it=U},this.setTransparentSort=function(U){ut=U},this.getClearColor=function(U){return U.copy(Bt.getClearColor())},this.setClearColor=function(){Bt.setClearColor(...arguments)},this.getClearAlpha=function(){return Bt.getClearAlpha()},this.setClearAlpha=function(){Bt.setClearAlpha(...arguments)},this.clear=function(U=!0,$=!0,nt=!0){let rt=0;if(U){let Y=!1;if(T!==null){const Et=T.texture.format;Y=Et===h0||Et===l0||Et===c0}if(Y){const Et=T.texture.type,It=Et===Mi||Et===mr||Et===vo||Et===xo||Et===a0||Et===o0,Ot=Bt.getClearColor(),Nt=Bt.getClearAlpha(),qt=Ot.r,Zt=Ot.g,Gt=Ot.b;It?(p[0]=qt,p[1]=Zt,p[2]=Gt,p[3]=Nt,N.clearBufferuiv(N.COLOR,0,p)):(v[0]=qt,v[1]=Zt,v[2]=Gt,v[3]=Nt,N.clearBufferiv(N.COLOR,0,v))}else rt|=N.COLOR_BUFFER_BIT}$&&(rt|=N.DEPTH_BUFFER_BIT),nt&&(rt|=N.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),N.clear(rt)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){e.removeEventListener("webglcontextlost",Ct,!1),e.removeEventListener("webglcontextrestored",Ft,!1),e.removeEventListener("webglcontextcreationerror",St,!1),Bt.dispose(),dt.dispose(),Vt.dispose(),Mt.dispose(),Jt.dispose(),Yt.dispose(),j.dispose(),Pt.dispose(),ee.dispose(),lt.dispose(),Tt.dispose(),Tt.removeEventListener("sessionstart",yi),Tt.removeEventListener("sessionend",nf),Bs.stop()};function Ct(U){U.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),w=!0}function Ft(){console.log("THREE.WebGLRenderer: Context Restored."),w=!1;const U=pt.autoReset,$=kt.enabled,nt=kt.autoUpdate,rt=kt.needsUpdate,Y=kt.type;X(),pt.autoReset=U,kt.enabled=$,kt.autoUpdate=nt,kt.needsUpdate=rt,kt.type=Y}function St(U){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",U.statusMessage)}function xt(U){const $=U.target;$.removeEventListener("dispose",xt),Ht($)}function Ht(U){te(U),Mt.remove(U)}function te(U){const $=Mt.get(U).programs;$!==void 0&&($.forEach(function(nt){lt.releaseProgram(nt)}),U.isShaderMaterial&&lt.releaseShaderCache(U))}this.renderBufferDirect=function(U,$,nt,rt,Y,Et){$===null&&($=V);const It=Y.isMesh&&Y.matrixWorld.determinant()<0,Ot=wg(U,$,nt,rt,Y);ot.setMaterial(rt,It);let Nt=nt.index,qt=1;if(rt.wireframe===!0){if(Nt=P.getWireframeAttribute(nt),Nt===void 0)return;qt=2}const Zt=nt.drawRange,Gt=nt.attributes.position;let ce=Zt.start*qt,ve=(Zt.start+Zt.count)*qt;Et!==null&&(ce=Math.max(ce,Et.start*qt),ve=Math.min(ve,(Et.start+Et.count)*qt)),Nt!==null?(ce=Math.max(ce,0),ve=Math.min(ve,Nt.count)):Gt!=null&&(ce=Math.max(ce,0),ve=Math.min(ve,Gt.count));const ke=ve-ce;if(ke<0||ke===1/0)return;Pt.setup(Y,rt,Ot,nt,Nt);let Ae,_e=Dt;if(Nt!==null&&(Ae=F.get(Nt),_e=jt,_e.setIndex(Ae)),Y.isMesh)rt.wireframe===!0?(ot.setLineWidth(rt.wireframeLinewidth*st()),_e.setMode(N.LINES)):_e.setMode(N.TRIANGLES);else if(Y.isLine){let Xt=rt.linewidth;Xt===void 0&&(Xt=1),ot.setLineWidth(Xt*st()),Y.isLineSegments?_e.setMode(N.LINES):Y.isLineLoop?_e.setMode(N.LINE_LOOP):_e.setMode(N.LINE_STRIP)}else Y.isPoints?_e.setMode(N.POINTS):Y.isSprite&&_e.setMode(N.TRIANGLES);if(Y.isBatchedMesh)if(Y._multiDrawInstances!==null)bo("THREE.WebGLRenderer: renderMultiDrawInstances has been deprecated and will be removed in r184. Append to renderMultiDraw arguments and use indirection."),_e.renderMultiDrawInstances(Y._multiDrawStarts,Y._multiDrawCounts,Y._multiDrawCount,Y._multiDrawInstances);else if(Z.get("WEBGL_multi_draw"))_e.renderMultiDraw(Y._multiDrawStarts,Y._multiDrawCounts,Y._multiDrawCount);else{const Xt=Y._multiDrawStarts,De=Y._multiDrawCounts,he=Y._multiDrawCount,Rn=Nt?F.get(Nt).bytesPerElement:1,Sr=Mt.get(rt).currentProgram.getUniforms();for(let Cn=0;Cn<he;Cn++)Sr.setValue(N,"_gl_DrawID",Cn),_e.render(Xt[Cn]/Rn,De[Cn])}else if(Y.isInstancedMesh)_e.renderInstances(ce,ke,Y.count);else if(nt.isInstancedBufferGeometry){const Xt=nt._maxInstanceCount!==void 0?nt._maxInstanceCount:1/0,De=Math.min(nt.instanceCount,Xt);_e.renderInstances(ce,ke,De)}else _e.render(ce,ke)};function Se(U,$,nt){U.transparent===!0&&U.side===ye&&U.forceSinglePass===!1?(U.side=Tn,U.needsUpdate=!0,Wo(U,$,nt),U.side=Os,U.needsUpdate=!0,Wo(U,$,nt),U.side=ye):Wo(U,$,nt)}this.compile=function(U,$,nt=null){nt===null&&(nt=U),m=Vt.get(nt),m.init($),x.push(m),nt.traverseVisible(function(Y){Y.isLight&&Y.layers.test($.layers)&&(m.pushLight(Y),Y.castShadow&&m.pushShadow(Y))}),U!==nt&&U.traverseVisible(function(Y){Y.isLight&&Y.layers.test($.layers)&&(m.pushLight(Y),Y.castShadow&&m.pushShadow(Y))}),m.setupLights();const rt=new Set;return U.traverse(function(Y){if(!(Y.isMesh||Y.isPoints||Y.isLine||Y.isSprite))return;const Et=Y.material;if(Et)if(Array.isArray(Et))for(let It=0;It<Et.length;It++){const Ot=Et[It];Se(Ot,nt,Y),rt.add(Ot)}else Se(Et,nt,Y),rt.add(Et)}),m=x.pop(),rt},this.compileAsync=function(U,$,nt=null){const rt=this.compile(U,$,nt);return new Promise(Y=>{function Et(){if(rt.forEach(function(It){Mt.get(It).currentProgram.isReady()&&rt.delete(It)}),rt.size===0){Y(U);return}setTimeout(Et,10)}Z.get("KHR_parallel_shader_compile")!==null?Et():setTimeout(Et,10)})};let pe=null;function qi(U){pe&&pe(U)}function yi(){Bs.stop()}function nf(){Bs.start()}const Bs=new Fp;Bs.setAnimationLoop(qi),typeof self<"u"&&Bs.setContext(self),this.setAnimationLoop=function(U){pe=U,Tt.setAnimationLoop(U),U===null?Bs.stop():Bs.start()},Tt.addEventListener("sessionstart",yi),Tt.addEventListener("sessionend",nf),this.render=function(U,$){if($!==void 0&&$.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(w===!0)return;if(U.matrixWorldAutoUpdate===!0&&U.updateMatrixWorld(),$.parent===null&&$.matrixWorldAutoUpdate===!0&&$.updateMatrixWorld(),Tt.enabled===!0&&Tt.isPresenting===!0&&(Tt.cameraAutoUpdate===!0&&Tt.updateCamera($),$=Tt.getCamera()),U.isScene===!0&&U.onBeforeRender(b,U,$,T),m=Vt.get(U,x.length),m.init($),x.push(m),J.multiplyMatrices($.projectionMatrix,$.matrixWorldInverse),Ut.setFromProjectionMatrix(J,Hi,$.reversedDepth),G=this.localClippingEnabled,ct=Rt.init(this.clippingPlanes,G),g=dt.get(U,_.length),g.init(),_.push(g),Tt.enabled===!0&&Tt.isPresenting===!0){const Et=b.xr.getDepthSensingMesh();Et!==null&&Ll(Et,$,-1/0,b.sortObjects)}Ll(U,$,0,b.sortObjects),g.finish(),b.sortObjects===!0&&g.sort(it,ut),tt=Tt.enabled===!1||Tt.isPresenting===!1||Tt.hasDepthSensing()===!1,tt&&Bt.addToRenderList(g,U),this.info.render.frame++,ct===!0&&Rt.beginShadows();const nt=m.state.shadowsArray;kt.render(nt,U,$),ct===!0&&Rt.endShadows(),this.info.autoReset===!0&&this.info.reset();const rt=g.opaque,Y=g.transmissive;if(m.setupLights(),$.isArrayCamera){const Et=$.cameras;if(Y.length>0)for(let It=0,Ot=Et.length;It<Ot;It++){const Nt=Et[It];rf(rt,Y,U,Nt)}tt&&Bt.render(U);for(let It=0,Ot=Et.length;It<Ot;It++){const Nt=Et[It];sf(g,U,Nt,Nt.viewport)}}else Y.length>0&&rf(rt,Y,U,$),tt&&Bt.render(U),sf(g,U,$);T!==null&&A===0&&(yt.updateMultisampleRenderTarget(T),yt.updateRenderTargetMipmap(T)),U.isScene===!0&&U.onAfterRender(b,U,$),Pt.resetDefaultState(),M=-1,y=null,x.pop(),x.length>0?(m=x[x.length-1],ct===!0&&Rt.setGlobalState(b.clippingPlanes,m.state.camera)):m=null,_.pop(),_.length>0?g=_[_.length-1]:g=null};function Ll(U,$,nt,rt){if(U.visible===!1)return;if(U.layers.test($.layers)){if(U.isGroup)nt=U.renderOrder;else if(U.isLOD)U.autoUpdate===!0&&U.update($);else if(U.isLight)m.pushLight(U),U.castShadow&&m.pushShadow(U);else if(U.isSprite){if(!U.frustumCulled||Ut.intersectsSprite(U)){rt&&W.setFromMatrixPosition(U.matrixWorld).applyMatrix4(J);const It=j.update(U),Ot=U.material;Ot.visible&&g.push(U,It,Ot,nt,W.z,null)}}else if((U.isMesh||U.isLine||U.isPoints)&&(!U.frustumCulled||Ut.intersectsObject(U))){const It=j.update(U),Ot=U.material;if(rt&&(U.boundingSphere!==void 0?(U.boundingSphere===null&&U.computeBoundingSphere(),W.copy(U.boundingSphere.center)):(It.boundingSphere===null&&It.computeBoundingSphere(),W.copy(It.boundingSphere.center)),W.applyMatrix4(U.matrixWorld).applyMatrix4(J)),Array.isArray(Ot)){const Nt=It.groups;for(let qt=0,Zt=Nt.length;qt<Zt;qt++){const Gt=Nt[qt],ce=Ot[Gt.materialIndex];ce&&ce.visible&&g.push(U,It,ce,nt,W.z,Gt)}}else Ot.visible&&g.push(U,It,Ot,nt,W.z,null)}}const Et=U.children;for(let It=0,Ot=Et.length;It<Ot;It++)Ll(Et[It],$,nt,rt)}function sf(U,$,nt,rt){const Y=U.opaque,Et=U.transmissive,It=U.transparent;m.setupLightsView(nt),ct===!0&&Rt.setGlobalState(b.clippingPlanes,nt),rt&&ot.viewport(S.copy(rt)),Y.length>0&&Go(Y,$,nt),Et.length>0&&Go(Et,$,nt),It.length>0&&Go(It,$,nt),ot.buffers.depth.setTest(!0),ot.buffers.depth.setMask(!0),ot.buffers.color.setMask(!0),ot.setPolygonOffset(!1)}function rf(U,$,nt,rt){if((nt.isScene===!0?nt.overrideMaterial:null)!==null)return;m.state.transmissionRenderTarget[rt.id]===void 0&&(m.state.transmissionRenderTarget[rt.id]=new dn(1,1,{generateMipmaps:!0,type:Z.has("EXT_color_buffer_half_float")||Z.has("EXT_color_buffer_float")?_r:Mi,minFilter:Cs,samples:4,stencilBuffer:r,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:ue.workingColorSpace}));const Et=m.state.transmissionRenderTarget[rt.id],It=rt.viewport||S;Et.setSize(It.z*b.transmissionResolutionScale,It.w*b.transmissionResolutionScale);const Ot=b.getRenderTarget(),Nt=b.getActiveCubeFace(),qt=b.getActiveMipmapLevel();b.setRenderTarget(Et),b.getClearColor(L),D=b.getClearAlpha(),D<1&&b.setClearColor(16777215,.5),b.clear(),tt&&Bt.render(nt);const Zt=b.toneMapping;b.toneMapping=Ns;const Gt=rt.viewport;if(rt.viewport!==void 0&&(rt.viewport=void 0),m.setupLightsView(rt),ct===!0&&Rt.setGlobalState(b.clippingPlanes,rt),Go(U,nt,rt),yt.updateMultisampleRenderTarget(Et),yt.updateRenderTargetMipmap(Et),Z.has("WEBGL_multisampled_render_to_texture")===!1){let ce=!1;for(let ve=0,ke=$.length;ve<ke;ve++){const Ae=$[ve],_e=Ae.object,Xt=Ae.geometry,De=Ae.material,he=Ae.group;if(De.side===ye&&_e.layers.test(rt.layers)){const Rn=De.side;De.side=Tn,De.needsUpdate=!0,af(_e,nt,rt,Xt,De,he),De.side=Rn,De.needsUpdate=!0,ce=!0}}ce===!0&&(yt.updateMultisampleRenderTarget(Et),yt.updateRenderTargetMipmap(Et))}b.setRenderTarget(Ot,Nt,qt),b.setClearColor(L,D),Gt!==void 0&&(rt.viewport=Gt),b.toneMapping=Zt}function Go(U,$,nt){const rt=$.isScene===!0?$.overrideMaterial:null;for(let Y=0,Et=U.length;Y<Et;Y++){const It=U[Y],Ot=It.object,Nt=It.geometry,qt=It.group;let Zt=It.material;Zt.allowOverride===!0&&rt!==null&&(Zt=rt),Ot.layers.test(nt.layers)&&af(Ot,$,nt,Nt,Zt,qt)}}function af(U,$,nt,rt,Y,Et){U.onBeforeRender(b,$,nt,rt,Y,Et),U.modelViewMatrix.multiplyMatrices(nt.matrixWorldInverse,U.matrixWorld),U.normalMatrix.getNormalMatrix(U.modelViewMatrix),Y.onBeforeRender(b,$,nt,rt,U,Et),Y.transparent===!0&&Y.side===ye&&Y.forceSinglePass===!1?(Y.side=Tn,Y.needsUpdate=!0,b.renderBufferDirect(nt,$,rt,Y,U,Et),Y.side=Os,Y.needsUpdate=!0,b.renderBufferDirect(nt,$,rt,Y,U,Et),Y.side=ye):b.renderBufferDirect(nt,$,rt,Y,U,Et),U.onAfterRender(b,$,nt,rt,Y,Et)}function Wo(U,$,nt){$.isScene!==!0&&($=V);const rt=Mt.get(U),Y=m.state.lights,Et=m.state.shadowsArray,It=Y.state.version,Ot=lt.getParameters(U,Y.state,Et,$,nt),Nt=lt.getProgramCacheKey(Ot);let qt=rt.programs;rt.environment=U.isMeshStandardMaterial?$.environment:null,rt.fog=$.fog,rt.envMap=(U.isMeshStandardMaterial?Yt:Jt).get(U.envMap||rt.environment),rt.envMapRotation=rt.environment!==null&&U.envMap===null?$.environmentRotation:U.envMapRotation,qt===void 0&&(U.addEventListener("dispose",xt),qt=new Map,rt.programs=qt);let Zt=qt.get(Nt);if(Zt!==void 0){if(rt.currentProgram===Zt&&rt.lightsStateVersion===It)return cf(U,Ot),Zt}else Ot.uniforms=lt.getUniforms(U),U.onBeforeCompile(Ot,b),Zt=lt.acquireProgram(Ot,Nt),qt.set(Nt,Zt),rt.uniforms=Ot.uniforms;const Gt=rt.uniforms;return(!U.isShaderMaterial&&!U.isRawShaderMaterial||U.clipping===!0)&&(Gt.clippingPlanes=Rt.uniform),cf(U,Ot),rt.needsLights=Eg(U),rt.lightsStateVersion=It,rt.needsLights&&(Gt.ambientLightColor.value=Y.state.ambient,Gt.lightProbe.value=Y.state.probe,Gt.directionalLights.value=Y.state.directional,Gt.directionalLightShadows.value=Y.state.directionalShadow,Gt.spotLights.value=Y.state.spot,Gt.spotLightShadows.value=Y.state.spotShadow,Gt.rectAreaLights.value=Y.state.rectArea,Gt.ltc_1.value=Y.state.rectAreaLTC1,Gt.ltc_2.value=Y.state.rectAreaLTC2,Gt.pointLights.value=Y.state.point,Gt.pointLightShadows.value=Y.state.pointShadow,Gt.hemisphereLights.value=Y.state.hemi,Gt.directionalShadowMap.value=Y.state.directionalShadowMap,Gt.directionalShadowMatrix.value=Y.state.directionalShadowMatrix,Gt.spotShadowMap.value=Y.state.spotShadowMap,Gt.spotLightMatrix.value=Y.state.spotLightMatrix,Gt.spotLightMap.value=Y.state.spotLightMap,Gt.pointShadowMap.value=Y.state.pointShadowMap,Gt.pointShadowMatrix.value=Y.state.pointShadowMatrix),rt.currentProgram=Zt,rt.uniformsList=null,Zt}function of(U){if(U.uniformsList===null){const $=U.currentProgram.getUniforms();U.uniformsList=kc.seqWithValue($.seq,U.uniforms)}return U.uniformsList}function cf(U,$){const nt=Mt.get(U);nt.outputColorSpace=$.outputColorSpace,nt.batching=$.batching,nt.batchingColor=$.batchingColor,nt.instancing=$.instancing,nt.instancingColor=$.instancingColor,nt.instancingMorph=$.instancingMorph,nt.skinning=$.skinning,nt.morphTargets=$.morphTargets,nt.morphNormals=$.morphNormals,nt.morphColors=$.morphColors,nt.morphTargetsCount=$.morphTargetsCount,nt.numClippingPlanes=$.numClippingPlanes,nt.numIntersection=$.numClipIntersection,nt.vertexAlphas=$.vertexAlphas,nt.vertexTangents=$.vertexTangents,nt.toneMapping=$.toneMapping}function wg(U,$,nt,rt,Y){$.isScene!==!0&&($=V),yt.resetTextureUnits();const Et=$.fog,It=rt.isMeshStandardMaterial?$.environment:null,Ot=T===null?b.outputColorSpace:T.isXRRenderTarget===!0?T.texture.colorSpace:gr,Nt=(rt.isMeshStandardMaterial?Yt:Jt).get(rt.envMap||It),qt=rt.vertexColors===!0&&!!nt.attributes.color&&nt.attributes.color.itemSize===4,Zt=!!nt.attributes.tangent&&(!!rt.normalMap||rt.anisotropy>0),Gt=!!nt.morphAttributes.position,ce=!!nt.morphAttributes.normal,ve=!!nt.morphAttributes.color;let ke=Ns;rt.toneMapped&&(T===null||T.isXRRenderTarget===!0)&&(ke=b.toneMapping);const Ae=nt.morphAttributes.position||nt.morphAttributes.normal||nt.morphAttributes.color,_e=Ae!==void 0?Ae.length:0,Xt=Mt.get(rt),De=m.state.lights;if(ct===!0&&(G===!0||U!==y)){const an=U===y&&rt.id===M;Rt.setState(rt,U,an)}let he=!1;rt.version===Xt.__version?(Xt.needsLights&&Xt.lightsStateVersion!==De.state.version||Xt.outputColorSpace!==Ot||Y.isBatchedMesh&&Xt.batching===!1||!Y.isBatchedMesh&&Xt.batching===!0||Y.isBatchedMesh&&Xt.batchingColor===!0&&Y.colorTexture===null||Y.isBatchedMesh&&Xt.batchingColor===!1&&Y.colorTexture!==null||Y.isInstancedMesh&&Xt.instancing===!1||!Y.isInstancedMesh&&Xt.instancing===!0||Y.isSkinnedMesh&&Xt.skinning===!1||!Y.isSkinnedMesh&&Xt.skinning===!0||Y.isInstancedMesh&&Xt.instancingColor===!0&&Y.instanceColor===null||Y.isInstancedMesh&&Xt.instancingColor===!1&&Y.instanceColor!==null||Y.isInstancedMesh&&Xt.instancingMorph===!0&&Y.morphTexture===null||Y.isInstancedMesh&&Xt.instancingMorph===!1&&Y.morphTexture!==null||Xt.envMap!==Nt||rt.fog===!0&&Xt.fog!==Et||Xt.numClippingPlanes!==void 0&&(Xt.numClippingPlanes!==Rt.numPlanes||Xt.numIntersection!==Rt.numIntersection)||Xt.vertexAlphas!==qt||Xt.vertexTangents!==Zt||Xt.morphTargets!==Gt||Xt.morphNormals!==ce||Xt.morphColors!==ve||Xt.toneMapping!==ke||Xt.morphTargetsCount!==_e)&&(he=!0):(he=!0,Xt.__version=rt.version);let Rn=Xt.currentProgram;he===!0&&(Rn=Wo(rt,$,Y));let Sr=!1,Cn=!1,Ga=!1;const Ue=Rn.getUniforms(),Gn=Xt.uniforms;if(ot.useProgram(Rn.program)&&(Sr=!0,Cn=!0,Ga=!0),rt.id!==M&&(M=rt.id,Cn=!0),Sr||y!==U){ot.buffers.depth.getReversed()&&U.reversedDepth!==!0&&(U._reversedDepth=!0,U.updateProjectionMatrix()),Ue.setValue(N,"projectionMatrix",U.projectionMatrix),Ue.setValue(N,"viewMatrix",U.matrixWorldInverse);const vn=Ue.map.cameraPosition;vn!==void 0&&vn.setValue(N,H.setFromMatrixPosition(U.matrixWorld)),et.logarithmicDepthBuffer&&Ue.setValue(N,"logDepthBufFC",2/(Math.log(U.far+1)/Math.LN2)),(rt.isMeshPhongMaterial||rt.isMeshToonMaterial||rt.isMeshLambertMaterial||rt.isMeshBasicMaterial||rt.isMeshStandardMaterial||rt.isShaderMaterial)&&Ue.setValue(N,"isOrthographic",U.isOrthographicCamera===!0),y!==U&&(y=U,Cn=!0,Ga=!0)}if(Y.isSkinnedMesh){Ue.setOptional(N,Y,"bindMatrix"),Ue.setOptional(N,Y,"bindMatrixInverse");const an=Y.skeleton;an&&(an.boneTexture===null&&an.computeBoneTexture(),Ue.setValue(N,"boneTexture",an.boneTexture,yt))}Y.isBatchedMesh&&(Ue.setOptional(N,Y,"batchingTexture"),Ue.setValue(N,"batchingTexture",Y._matricesTexture,yt),Ue.setOptional(N,Y,"batchingIdTexture"),Ue.setValue(N,"batchingIdTexture",Y._indirectTexture,yt),Ue.setOptional(N,Y,"batchingColorTexture"),Y._colorsTexture!==null&&Ue.setValue(N,"batchingColorTexture",Y._colorsTexture,yt));const Wn=nt.morphAttributes;if((Wn.position!==void 0||Wn.normal!==void 0||Wn.color!==void 0)&&wt.update(Y,nt,Rn),(Cn||Xt.receiveShadow!==Y.receiveShadow)&&(Xt.receiveShadow=Y.receiveShadow,Ue.setValue(N,"receiveShadow",Y.receiveShadow)),rt.isMeshGouraudMaterial&&rt.envMap!==null&&(Gn.envMap.value=Nt,Gn.flipEnvMap.value=Nt.isCubeTexture&&Nt.isRenderTargetTexture===!1?-1:1),rt.isMeshStandardMaterial&&rt.envMap===null&&$.environment!==null&&(Gn.envMapIntensity.value=$.environmentIntensity),Cn&&(Ue.setValue(N,"toneMappingExposure",b.toneMappingExposure),Xt.needsLights&&Sg(Gn,Ga),Et&&rt.fog===!0&&bt.refreshFogUniforms(Gn,Et),bt.refreshMaterialUniforms(Gn,rt,z,q,m.state.transmissionRenderTarget[U.id]),kc.upload(N,of(Xt),Gn,yt)),rt.isShaderMaterial&&rt.uniformsNeedUpdate===!0&&(kc.upload(N,of(Xt),Gn,yt),rt.uniformsNeedUpdate=!1),rt.isSpriteMaterial&&Ue.setValue(N,"center",Y.center),Ue.setValue(N,"modelViewMatrix",Y.modelViewMatrix),Ue.setValue(N,"normalMatrix",Y.normalMatrix),Ue.setValue(N,"modelMatrix",Y.matrixWorld),rt.isShaderMaterial||rt.isRawShaderMaterial){const an=rt.uniformsGroups;for(let vn=0,Pl=an.length;vn<Pl;vn++){const Hs=an[vn];ee.update(Hs,Rn),ee.bind(Hs,Rn)}}return Rn}function Sg(U,$){U.ambientLightColor.needsUpdate=$,U.lightProbe.needsUpdate=$,U.directionalLights.needsUpdate=$,U.directionalLightShadows.needsUpdate=$,U.pointLights.needsUpdate=$,U.pointLightShadows.needsUpdate=$,U.spotLights.needsUpdate=$,U.spotLightShadows.needsUpdate=$,U.rectAreaLights.needsUpdate=$,U.hemisphereLights.needsUpdate=$}function Eg(U){return U.isMeshLambertMaterial||U.isMeshToonMaterial||U.isMeshPhongMaterial||U.isMeshStandardMaterial||U.isShadowMaterial||U.isShaderMaterial&&U.lights===!0}this.getActiveCubeFace=function(){return E},this.getActiveMipmapLevel=function(){return A},this.getRenderTarget=function(){return T},this.setRenderTargetTextures=function(U,$,nt){const rt=Mt.get(U);rt.__autoAllocateDepthBuffer=U.resolveDepthBuffer===!1,rt.__autoAllocateDepthBuffer===!1&&(rt.__useRenderToTexture=!1),Mt.get(U.texture).__webglTexture=$,Mt.get(U.depthTexture).__webglTexture=rt.__autoAllocateDepthBuffer?void 0:nt,rt.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(U,$){const nt=Mt.get(U);nt.__webglFramebuffer=$,nt.__useDefaultFramebuffer=$===void 0};const Tg=N.createFramebuffer();this.setRenderTarget=function(U,$=0,nt=0){T=U,E=$,A=nt;let rt=!0,Y=null,Et=!1,It=!1;if(U){const Nt=Mt.get(U);if(Nt.__useDefaultFramebuffer!==void 0)ot.bindFramebuffer(N.FRAMEBUFFER,null),rt=!1;else if(Nt.__webglFramebuffer===void 0)yt.setupRenderTarget(U);else if(Nt.__hasExternalTextures)yt.rebindTextures(U,Mt.get(U.texture).__webglTexture,Mt.get(U.depthTexture).__webglTexture);else if(U.depthBuffer){const Gt=U.depthTexture;if(Nt.__boundDepthTexture!==Gt){if(Gt!==null&&Mt.has(Gt)&&(U.width!==Gt.image.width||U.height!==Gt.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");yt.setupDepthRenderbuffer(U)}}const qt=U.texture;(qt.isData3DTexture||qt.isDataArrayTexture||qt.isCompressedArrayTexture)&&(It=!0);const Zt=Mt.get(U).__webglFramebuffer;U.isWebGLCubeRenderTarget?(Array.isArray(Zt[$])?Y=Zt[$][nt]:Y=Zt[$],Et=!0):U.samples>0&&yt.useMultisampledRTT(U)===!1?Y=Mt.get(U).__webglMultisampledFramebuffer:Array.isArray(Zt)?Y=Zt[nt]:Y=Zt,S.copy(U.viewport),R.copy(U.scissor),I=U.scissorTest}else S.copy(gt).multiplyScalar(z).floor(),R.copy(_t).multiplyScalar(z).floor(),I=At;if(nt!==0&&(Y=Tg),ot.bindFramebuffer(N.FRAMEBUFFER,Y)&&rt&&ot.drawBuffers(U,Y),ot.viewport(S),ot.scissor(R),ot.setScissorTest(I),Et){const Nt=Mt.get(U.texture);N.framebufferTexture2D(N.FRAMEBUFFER,N.COLOR_ATTACHMENT0,N.TEXTURE_CUBE_MAP_POSITIVE_X+$,Nt.__webglTexture,nt)}else if(It){const Nt=$;for(let qt=0;qt<U.textures.length;qt++){const Zt=Mt.get(U.textures[qt]);N.framebufferTextureLayer(N.FRAMEBUFFER,N.COLOR_ATTACHMENT0+qt,Zt.__webglTexture,nt,Nt)}}else if(U!==null&&nt!==0){const Nt=Mt.get(U.texture);N.framebufferTexture2D(N.FRAMEBUFFER,N.COLOR_ATTACHMENT0,N.TEXTURE_2D,Nt.__webglTexture,nt)}M=-1},this.readRenderTargetPixels=function(U,$,nt,rt,Y,Et,It,Ot=0){if(!(U&&U.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Nt=Mt.get(U).__webglFramebuffer;if(U.isWebGLCubeRenderTarget&&It!==void 0&&(Nt=Nt[It]),Nt){ot.bindFramebuffer(N.FRAMEBUFFER,Nt);try{const qt=U.textures[Ot],Zt=qt.format,Gt=qt.type;if(!et.textureFormatReadable(Zt)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!et.textureTypeReadable(Gt)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}$>=0&&$<=U.width-rt&&nt>=0&&nt<=U.height-Y&&(U.textures.length>1&&N.readBuffer(N.COLOR_ATTACHMENT0+Ot),N.readPixels($,nt,rt,Y,zt.convert(Zt),zt.convert(Gt),Et))}finally{const qt=T!==null?Mt.get(T).__webglFramebuffer:null;ot.bindFramebuffer(N.FRAMEBUFFER,qt)}}},this.readRenderTargetPixelsAsync=async function(U,$,nt,rt,Y,Et,It,Ot=0){if(!(U&&U.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let Nt=Mt.get(U).__webglFramebuffer;if(U.isWebGLCubeRenderTarget&&It!==void 0&&(Nt=Nt[It]),Nt)if($>=0&&$<=U.width-rt&&nt>=0&&nt<=U.height-Y){ot.bindFramebuffer(N.FRAMEBUFFER,Nt);const qt=U.textures[Ot],Zt=qt.format,Gt=qt.type;if(!et.textureFormatReadable(Zt))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!et.textureTypeReadable(Gt))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");const ce=N.createBuffer();N.bindBuffer(N.PIXEL_PACK_BUFFER,ce),N.bufferData(N.PIXEL_PACK_BUFFER,Et.byteLength,N.STREAM_READ),U.textures.length>1&&N.readBuffer(N.COLOR_ATTACHMENT0+Ot),N.readPixels($,nt,rt,Y,zt.convert(Zt),zt.convert(Gt),0);const ve=T!==null?Mt.get(T).__webglFramebuffer:null;ot.bindFramebuffer(N.FRAMEBUFFER,ve);const ke=N.fenceSync(N.SYNC_GPU_COMMANDS_COMPLETE,0);return N.flush(),await V2(N,ke,4),N.bindBuffer(N.PIXEL_PACK_BUFFER,ce),N.getBufferSubData(N.PIXEL_PACK_BUFFER,0,Et),N.deleteBuffer(ce),N.deleteSync(ke),Et}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(U,$=null,nt=0){const rt=Math.pow(2,-nt),Y=Math.floor(U.image.width*rt),Et=Math.floor(U.image.height*rt),It=$!==null?$.x:0,Ot=$!==null?$.y:0;yt.setTexture2D(U,0),N.copyTexSubImage2D(N.TEXTURE_2D,nt,0,0,It,Ot,Y,Et),ot.unbindTexture()};const Ag=N.createFramebuffer(),Rg=N.createFramebuffer();this.copyTextureToTexture=function(U,$,nt=null,rt=null,Y=0,Et=null){Et===null&&(Y!==0?(bo("WebGLRenderer: copyTextureToTexture function signature has changed to support src and dst mipmap levels."),Et=Y,Y=0):Et=0);let It,Ot,Nt,qt,Zt,Gt,ce,ve,ke;const Ae=U.isCompressedTexture?U.mipmaps[Et]:U.image;if(nt!==null)It=nt.max.x-nt.min.x,Ot=nt.max.y-nt.min.y,Nt=nt.isBox3?nt.max.z-nt.min.z:1,qt=nt.min.x,Zt=nt.min.y,Gt=nt.isBox3?nt.min.z:0;else{const Wn=Math.pow(2,-Y);It=Math.floor(Ae.width*Wn),Ot=Math.floor(Ae.height*Wn),U.isDataArrayTexture?Nt=Ae.depth:U.isData3DTexture?Nt=Math.floor(Ae.depth*Wn):Nt=1,qt=0,Zt=0,Gt=0}rt!==null?(ce=rt.x,ve=rt.y,ke=rt.z):(ce=0,ve=0,ke=0);const _e=zt.convert($.format),Xt=zt.convert($.type);let De;$.isData3DTexture?(yt.setTexture3D($,0),De=N.TEXTURE_3D):$.isDataArrayTexture||$.isCompressedArrayTexture?(yt.setTexture2DArray($,0),De=N.TEXTURE_2D_ARRAY):(yt.setTexture2D($,0),De=N.TEXTURE_2D),N.pixelStorei(N.UNPACK_FLIP_Y_WEBGL,$.flipY),N.pixelStorei(N.UNPACK_PREMULTIPLY_ALPHA_WEBGL,$.premultiplyAlpha),N.pixelStorei(N.UNPACK_ALIGNMENT,$.unpackAlignment);const he=N.getParameter(N.UNPACK_ROW_LENGTH),Rn=N.getParameter(N.UNPACK_IMAGE_HEIGHT),Sr=N.getParameter(N.UNPACK_SKIP_PIXELS),Cn=N.getParameter(N.UNPACK_SKIP_ROWS),Ga=N.getParameter(N.UNPACK_SKIP_IMAGES);N.pixelStorei(N.UNPACK_ROW_LENGTH,Ae.width),N.pixelStorei(N.UNPACK_IMAGE_HEIGHT,Ae.height),N.pixelStorei(N.UNPACK_SKIP_PIXELS,qt),N.pixelStorei(N.UNPACK_SKIP_ROWS,Zt),N.pixelStorei(N.UNPACK_SKIP_IMAGES,Gt);const Ue=U.isDataArrayTexture||U.isData3DTexture,Gn=$.isDataArrayTexture||$.isData3DTexture;if(U.isDepthTexture){const Wn=Mt.get(U),an=Mt.get($),vn=Mt.get(Wn.__renderTarget),Pl=Mt.get(an.__renderTarget);ot.bindFramebuffer(N.READ_FRAMEBUFFER,vn.__webglFramebuffer),ot.bindFramebuffer(N.DRAW_FRAMEBUFFER,Pl.__webglFramebuffer);for(let Hs=0;Hs<Nt;Hs++)Ue&&(N.framebufferTextureLayer(N.READ_FRAMEBUFFER,N.COLOR_ATTACHMENT0,Mt.get(U).__webglTexture,Y,Gt+Hs),N.framebufferTextureLayer(N.DRAW_FRAMEBUFFER,N.COLOR_ATTACHMENT0,Mt.get($).__webglTexture,Et,ke+Hs)),N.blitFramebuffer(qt,Zt,It,Ot,ce,ve,It,Ot,N.DEPTH_BUFFER_BIT,N.NEAREST);ot.bindFramebuffer(N.READ_FRAMEBUFFER,null),ot.bindFramebuffer(N.DRAW_FRAMEBUFFER,null)}else if(Y!==0||U.isRenderTargetTexture||Mt.has(U)){const Wn=Mt.get(U),an=Mt.get($);ot.bindFramebuffer(N.READ_FRAMEBUFFER,Ag),ot.bindFramebuffer(N.DRAW_FRAMEBUFFER,Rg);for(let vn=0;vn<Nt;vn++)Ue?N.framebufferTextureLayer(N.READ_FRAMEBUFFER,N.COLOR_ATTACHMENT0,Wn.__webglTexture,Y,Gt+vn):N.framebufferTexture2D(N.READ_FRAMEBUFFER,N.COLOR_ATTACHMENT0,N.TEXTURE_2D,Wn.__webglTexture,Y),Gn?N.framebufferTextureLayer(N.DRAW_FRAMEBUFFER,N.COLOR_ATTACHMENT0,an.__webglTexture,Et,ke+vn):N.framebufferTexture2D(N.DRAW_FRAMEBUFFER,N.COLOR_ATTACHMENT0,N.TEXTURE_2D,an.__webglTexture,Et),Y!==0?N.blitFramebuffer(qt,Zt,It,Ot,ce,ve,It,Ot,N.COLOR_BUFFER_BIT,N.NEAREST):Gn?N.copyTexSubImage3D(De,Et,ce,ve,ke+vn,qt,Zt,It,Ot):N.copyTexSubImage2D(De,Et,ce,ve,qt,Zt,It,Ot);ot.bindFramebuffer(N.READ_FRAMEBUFFER,null),ot.bindFramebuffer(N.DRAW_FRAMEBUFFER,null)}else Gn?U.isDataTexture||U.isData3DTexture?N.texSubImage3D(De,Et,ce,ve,ke,It,Ot,Nt,_e,Xt,Ae.data):$.isCompressedArrayTexture?N.compressedTexSubImage3D(De,Et,ce,ve,ke,It,Ot,Nt,_e,Ae.data):N.texSubImage3D(De,Et,ce,ve,ke,It,Ot,Nt,_e,Xt,Ae):U.isDataTexture?N.texSubImage2D(N.TEXTURE_2D,Et,ce,ve,It,Ot,_e,Xt,Ae.data):U.isCompressedTexture?N.compressedTexSubImage2D(N.TEXTURE_2D,Et,ce,ve,Ae.width,Ae.height,_e,Ae.data):N.texSubImage2D(N.TEXTURE_2D,Et,ce,ve,It,Ot,_e,Xt,Ae);N.pixelStorei(N.UNPACK_ROW_LENGTH,he),N.pixelStorei(N.UNPACK_IMAGE_HEIGHT,Rn),N.pixelStorei(N.UNPACK_SKIP_PIXELS,Sr),N.pixelStorei(N.UNPACK_SKIP_ROWS,Cn),N.pixelStorei(N.UNPACK_SKIP_IMAGES,Ga),Et===0&&$.generateMipmaps&&N.generateMipmap(De),ot.unbindTexture()},this.initRenderTarget=function(U){Mt.get(U).__webglFramebuffer===void 0&&yt.setupRenderTarget(U)},this.initTexture=function(U){U.isCubeTexture?yt.setTextureCube(U,0):U.isData3DTexture?yt.setTexture3D(U,0):U.isDataArrayTexture||U.isCompressedArrayTexture?yt.setTexture2DArray(U,0):yt.setTexture2D(U,0),ot.unbindTexture()},this.resetState=function(){E=0,A=0,T=null,ot.reset(),Pt.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return Hi}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(t){this._outputColorSpace=t;const e=this.getContext();e.drawingBufferColorSpace=ue._getDrawingBufferColorSpace(t),e.unpackColorSpace=ue._getUnpackColorSpace()}}const jb={armL:[.2,-1,0],forearmL:[.15,-1,.1],armR:[-.2,-1,0],forearmR:[-.15,-1,.1],thighL:[.05,-1,0],shinL:[0,-1,0],footL:[0,-.15,1],thighR:[-.05,-1,0],shinR:[0,-1,0],footR:[0,-.15,1]};function Zb(n,t){const e=n.scale??1,i=p=>new C(...n.dir?.[p]??jb[p]).normalize(),s=Array.from({length:Hh},()=>new C),r=(p,v)=>s[p].copy(v),a=(p,v,g)=>new C(p,v,g).multiplyScalar(e);r(O.hipL,a(.1,0,0)),r(O.hipR,a(-.1,0,0)),r(O.shL,a(.19,.52,-.02)),r(O.shR,a(-.19,.52,-.02));const o=new Me().setFromEuler(new gn(n.head?.[1]??0,n.head?.[0]??0,0,"YXZ")),c=a(0,.6,-.02),l=(p,v,g)=>a(p,v,g).applyQuaternion(o).add(c);r(O.nose,l(0,.1,.11)),r(O.eyeL,l(.032,.135,.09)),r(O.eyeR,l(-.032,.135,.09)),r(O.eyeInL,l(.018,.135,.095)),r(O.eyeInR,l(-.018,.135,.095)),r(O.eyeOutL,l(.05,.135,.08)),r(O.eyeOutR,l(-.05,.135,.08)),r(O.earL,l(.075,.12,0)),r(O.earR,l(-.075,.12,0)),r(O.mouthL,l(.024,.06,.095)),r(O.mouthR,l(-.024,.06,.095));for(const p of["L","R"]){const v=s[p==="L"?O.shL:O.shR],g=s[p==="L"?O.hipL:O.hipR],m=v.clone().addScaledVector(i(`arm${p}`),.29*e),_=m.clone().addScaledVector(i(`forearm${p}`),.26*e);r(p==="L"?O.elL:O.elR,m),r(p==="L"?O.wrL:O.wrR,_);const x=_.clone().addScaledVector(i(`forearm${p}`),.08*e);r(p==="L"?O.indexL:O.indexR,x.clone().add(a(0,0,.02))),r(p==="L"?O.pinkyL:O.pinkyR,x.clone().add(a(0,0,-.02))),r(p==="L"?O.thumbL:O.thumbR,_.clone().addScaledVector(i(`forearm${p}`),.04*e).add(a(0,0,.04)));const b=g.clone().addScaledVector(i(`thigh${p}`),.43*e),w=b.clone().addScaledVector(i(`shin${p}`),.42*e);r(p==="L"?O.knL:O.knR,b),r(p==="L"?O.anL:O.anR,w);const E=w.clone().add(a(0,-.04,-.05));r(p==="L"?O.heelL:O.heelR,E),r(p==="L"?O.toeL:O.toeR,E.clone().addScaledVector(i(`foot${p}`),.24*e))}const h=new Me().setFromAxisAngle(new C(0,1,0),n.yaw??0),u=new Set([O.knL,O.knR,O.anL,O.anR,O.heelL,O.heelR,O.toeL,O.toeR]),d=[],f=[];for(let p=0;p<Hh;p++){const v=s[p].clone().applyQuaternion(h),g=u.has(p)?n.legsVis??.98:.98;d.push({x:v.x,y:v.y,z:v.z,v:g});const m=Sa({x:v.x+n.T.x,y:v.y+n.T.y,z:v.z+n.T.z},t);f.push({x:m.x,y:m.y,z:0,v:g})}return{world:d,image:f}}function Kb(n,t,e){const i=[];for(let s=0;s<n;s++){const r=t*1.3+s*2.1,a=(s-(n-1)/2)*.9+Math.sin(t*.4+s)*.15,o=Math.sin(r);i.push(Zb({T:{x:a,y:-.1+.03*Math.sin(r*2),z:-3-s*.6},yaw:Math.sin(t*.5+s)*.5,head:[Math.sin(t*.7+s)*.4,Math.sin(t*.9)*.15],dir:{armR:[-1,.3+.5*o,.1],forearmR:[-.3,1,.1+.3*o],armL:[.5+.4*Math.cos(r),-.8+.6*Math.cos(r*.5),.3],forearmL:[.2,-.3,1],thighL:[.12,-1,.25*Math.max(0,o)],shinL:[.05,-1,-.2*Math.max(0,o)]},scale:1-s*.08},e))}return i}function Jb(n,t,e,i){const s=n.image,r=new Float32Array(t*e),a=f=>[s[f].x*i,s[f].y],o=Math.hypot(a(O.shL)[0]-a(O.hipL)[0],a(O.shL)[1]-a(O.hipL)[1]),c=[[O.shL,O.elL,.11],[O.elL,O.wrL,.09],[O.shR,O.elR,.11],[O.elR,O.wrR,.09],[O.hipL,O.knL,.15],[O.knL,O.anL,.11],[O.hipR,O.knR,.15],[O.knR,O.anR,.11],[O.anL,O.toeL,.07],[O.anR,O.toeR,.07],[O.shL,O.hipR,.2],[O.shR,O.hipL,.2],[O.shL,O.shR,.14],[O.hipL,O.hipR,.16]],l=a(O.nose),h=a(O.earL),u=a(O.earR),d=Math.max(Math.hypot(h[0]-u[0],h[1]-u[1])*.9,o*.22);for(let f=0;f<e;f++)for(let p=0;p<t;p++){const v=(p+.5)/t*i,g=(f+.5)/e;let m=Math.hypot(v-l[0],g-(l[1]-d*.2))-d;for(const[_,x,b]of c){const w=a(_),E=a(x),A=E[0]-w[0],T=E[1]-w[1],M=A*A+T*T||1,y=Math.max(0,Math.min(1,((v-w[0])*A+(g-w[1])*T)/M));m=Math.min(m,Math.hypot(v-w[0]-A*y,g-w[1]-T*y)-b*o)}r[f*t+p]=Math.max(0,Math.min(1,.5-m/(o*.04)))}return{data:r,w:t,h:e}}function Qb(n){const t=new Map,e=new Map,i=n.clone();return Vp(n,i,function(s,r){t.set(r,s),e.set(s,r)}),i.traverse(function(s){if(!s.isSkinnedMesh)return;const r=s,a=t.get(s),o=a.skeleton.bones;r.skeleton=a.skeleton.clone(),r.bindMatrix.copy(a.bindMatrix),r.skeleton.bones=o.map(function(c){return e.get(c)}),r.bind(r.skeleton,r.bindMatrix)}),i}function Vp(n,t,e){e(n,t);for(let i=0;i<n.children.length;i++)Vp(n.children[i],t.children[i],e)}class zp extends mt{constructor(t,e,i=!1,s=!1,r=1e4){const a=new me;super(a,e),this.isMarchingCubes=!0;const o=this,c=new Float32Array(36),l=new Float32Array(36),h=new Float32Array(36);this.enableUvs=i,this.enableColors=s,this.init=function(_){this.resolution=_,this.isolation=80,this.size=_,this.size2=this.size*this.size,this.size3=this.size2*this.size,this.halfsize=this.size/2,this.delta=2/this.size,this.yd=this.size,this.zd=this.size2,this.field=new Float32Array(this.size3),this.normal_cache=new Float32Array(this.size3*3),this.palette=new Float32Array(this.size3*3),this.count=0;const x=r*3;this.positionArray=new Float32Array(x*3);const b=new Kt(this.positionArray,3);b.setUsage($o),a.setAttribute("position",b),this.normalArray=new Float32Array(x*3);const w=new Kt(this.normalArray,3);if(w.setUsage($o),a.setAttribute("normal",w),this.enableUvs){this.uvArray=new Float32Array(x*2);const E=new Kt(this.uvArray,2);E.setUsage($o),a.setAttribute("uv",E)}if(this.enableColors){this.colorArray=new Float32Array(x*3);const E=new Kt(this.colorArray,3);E.setUsage($o),a.setAttribute("color",E)}a.boundingSphere=new Mr(new C,1)};function u(_,x,b){return _+(x-_)*b}function d(_,x,b,w,E,A,T,M,y,S){const R=(b-T)/(M-T),I=o.normal_cache;c[x+0]=w+R*o.delta,c[x+1]=E,c[x+2]=A,l[x+0]=u(I[_+0],I[_+3],R),l[x+1]=u(I[_+1],I[_+4],R),l[x+2]=u(I[_+2],I[_+5],R),h[x+0]=u(o.palette[y*3+0],o.palette[S*3+0],R),h[x+1]=u(o.palette[y*3+1],o.palette[S*3+1],R),h[x+2]=u(o.palette[y*3+2],o.palette[S*3+2],R)}function f(_,x,b,w,E,A,T,M,y,S){const R=(b-T)/(M-T),I=o.normal_cache;c[x+0]=w,c[x+1]=E+R*o.delta,c[x+2]=A;const L=_+o.yd*3;l[x+0]=u(I[_+0],I[L+0],R),l[x+1]=u(I[_+1],I[L+1],R),l[x+2]=u(I[_+2],I[L+2],R),h[x+0]=u(o.palette[y*3+0],o.palette[S*3+0],R),h[x+1]=u(o.palette[y*3+1],o.palette[S*3+1],R),h[x+2]=u(o.palette[y*3+2],o.palette[S*3+2],R)}function p(_,x,b,w,E,A,T,M,y,S){const R=(b-T)/(M-T),I=o.normal_cache;c[x+0]=w,c[x+1]=E,c[x+2]=A+R*o.delta;const L=_+o.zd*3;l[x+0]=u(I[_+0],I[L+0],R),l[x+1]=u(I[_+1],I[L+1],R),l[x+2]=u(I[_+2],I[L+2],R),h[x+0]=u(o.palette[y*3+0],o.palette[S*3+0],R),h[x+1]=u(o.palette[y*3+1],o.palette[S*3+1],R),h[x+2]=u(o.palette[y*3+2],o.palette[S*3+2],R)}function v(_){const x=_*3;o.normal_cache[x]===0&&(o.normal_cache[x+0]=o.field[_-1]-o.field[_+1],o.normal_cache[x+1]=o.field[_-o.yd]-o.field[_+o.yd],o.normal_cache[x+2]=o.field[_-o.zd]-o.field[_+o.zd])}function g(_,x,b,w,E){const A=w+1,T=w+o.yd,M=w+o.zd,y=A+o.yd,S=A+o.zd,R=w+o.yd+o.zd,I=A+o.yd+o.zd;let L=0;const D=o.field[w],k=o.field[A],q=o.field[T],z=o.field[y],it=o.field[M],ut=o.field[S],gt=o.field[R],_t=o.field[I];D<E&&(L|=1),k<E&&(L|=2),q<E&&(L|=8),z<E&&(L|=4),it<E&&(L|=16),ut<E&&(L|=32),gt<E&&(L|=128),_t<E&&(L|=64);const At=t5[L];if(At===0)return 0;const Ut=o.delta,ct=_+Ut,G=x+Ut,J=b+Ut;At&1&&(v(w),v(A),d(w*3,0,E,_,x,b,D,k,w,A)),At&2&&(v(A),v(y),f(A*3,3,E,ct,x,b,k,z,A,y)),At&4&&(v(T),v(y),d(T*3,6,E,_,G,b,q,z,T,y)),At&8&&(v(w),v(T),f(w*3,9,E,_,x,b,D,q,w,T)),At&16&&(v(M),v(S),d(M*3,12,E,_,x,J,it,ut,M,S)),At&32&&(v(S),v(I),f(S*3,15,E,ct,x,J,ut,_t,S,I)),At&64&&(v(R),v(I),d(R*3,18,E,_,G,J,gt,_t,R,I)),At&128&&(v(M),v(R),f(M*3,21,E,_,x,J,it,gt,M,R)),At&256&&(v(w),v(M),p(w*3,24,E,_,x,b,D,it,w,M)),At&512&&(v(A),v(S),p(A*3,27,E,ct,x,b,k,ut,A,S)),At&1024&&(v(y),v(I),p(y*3,30,E,ct,G,b,z,_t,y,I)),At&2048&&(v(T),v(R),p(T*3,33,E,_,G,b,q,gt,T,R)),L<<=4;let H,W,V,tt=0,st=0;for(;Ec[L+st]!=-1;)H=L+st,W=H+1,V=H+2,m(c,l,h,3*Ec[H],3*Ec[W],3*Ec[V]),st+=3,tt++;return tt}function m(_,x,b,w,E,A){const T=o.count*3;if(o.positionArray[T+0]=_[w],o.positionArray[T+1]=_[w+1],o.positionArray[T+2]=_[w+2],o.positionArray[T+3]=_[E],o.positionArray[T+4]=_[E+1],o.positionArray[T+5]=_[E+2],o.positionArray[T+6]=_[A],o.positionArray[T+7]=_[A+1],o.positionArray[T+8]=_[A+2],o.material.flatShading===!0){const M=(x[w+0]+x[E+0]+x[A+0])/3,y=(x[w+1]+x[E+1]+x[A+1])/3,S=(x[w+2]+x[E+2]+x[A+2])/3;o.normalArray[T+0]=M,o.normalArray[T+1]=y,o.normalArray[T+2]=S,o.normalArray[T+3]=M,o.normalArray[T+4]=y,o.normalArray[T+5]=S,o.normalArray[T+6]=M,o.normalArray[T+7]=y,o.normalArray[T+8]=S}else o.normalArray[T+0]=x[w+0],o.normalArray[T+1]=x[w+1],o.normalArray[T+2]=x[w+2],o.normalArray[T+3]=x[E+0],o.normalArray[T+4]=x[E+1],o.normalArray[T+5]=x[E+2],o.normalArray[T+6]=x[A+0],o.normalArray[T+7]=x[A+1],o.normalArray[T+8]=x[A+2];if(o.enableUvs){const M=o.count*2;o.uvArray[M+0]=_[w+0],o.uvArray[M+1]=_[w+2],o.uvArray[M+2]=_[E+0],o.uvArray[M+3]=_[E+2],o.uvArray[M+4]=_[A+0],o.uvArray[M+5]=_[A+2]}o.enableColors&&(o.colorArray[T+0]=b[w+0],o.colorArray[T+1]=b[w+1],o.colorArray[T+2]=b[w+2],o.colorArray[T+3]=b[E+0],o.colorArray[T+4]=b[E+1],o.colorArray[T+5]=b[E+2],o.colorArray[T+6]=b[A+0],o.colorArray[T+7]=b[A+1],o.colorArray[T+8]=b[A+2]),o.count+=3}this.addBall=function(_,x,b,w,E,A){const T=Math.sign(w);w=Math.abs(w);const M=A!=null;let y=new vt(_,x,b);if(M)try{y=A instanceof vt?A:Array.isArray(A)?new vt(Math.min(Math.abs(A[0]),1),Math.min(Math.abs(A[1]),1),Math.min(Math.abs(A[2]),1)):new vt(A)}catch{y=new vt(_,x,b)}const S=this.size*Math.sqrt(w/E),R=b*this.size,I=x*this.size,L=_*this.size;let D=Math.floor(R-S);D<1&&(D=1);let k=Math.floor(R+S);k>this.size-1&&(k=this.size-1);let q=Math.floor(I-S);q<1&&(q=1);let z=Math.floor(I+S);z>this.size-1&&(z=this.size-1);let it=Math.floor(L-S);it<1&&(it=1);let ut=Math.floor(L+S);ut>this.size-1&&(ut=this.size-1);let gt,_t,At,Ut,ct,G,J,H,W,V,tt;for(At=D;At<k;At++)for(ct=this.size2*At,H=At/this.size-b,W=H*H,_t=q;_t<z;_t++)for(Ut=ct+this.size*_t,J=_t/this.size-x,V=J*J,gt=it;gt<ut;gt++)if(G=gt/this.size-_,tt=w/(1e-6+G*G+V+W)-E,tt>0){this.field[Ut+gt]+=tt*T;const st=Math.sqrt((gt-L)*(gt-L)+(_t-I)*(_t-I)+(At-R)*(At-R))/S,N=1-st*st*st*(st*(st*6-15)+10);this.palette[(Ut+gt)*3+0]+=y.r*N,this.palette[(Ut+gt)*3+1]+=y.g*N,this.palette[(Ut+gt)*3+2]+=y.b*N}},this.addPlaneX=function(_,x){const b=this.size,w=this.yd,E=this.zd,A=this.field;let T,M,y,S,R,I,L,D=b*Math.sqrt(_/x);for(D>b&&(D=b),T=0;T<D;T++)if(I=T/b,S=I*I,R=_/(1e-4+S)-x,R>0)for(M=0;M<b;M++)for(L=T+M*w,y=0;y<b;y++)A[E*y+L]+=R},this.addPlaneY=function(_,x){const b=this.size,w=this.yd,E=this.zd,A=this.field;let T,M,y,S,R,I,L,D,k=b*Math.sqrt(_/x);for(k>b&&(k=b),M=0;M<k;M++)if(I=M/b,S=I*I,R=_/(1e-4+S)-x,R>0)for(L=M*w,T=0;T<b;T++)for(D=L+T,y=0;y<b;y++)A[E*y+D]+=R},this.addPlaneZ=function(_,x){const b=this.size,w=this.yd,E=this.zd,A=this.field;let T,M,y,S,R,I,L,D,k=b*Math.sqrt(_/x);for(k>b&&(k=b),y=0;y<k;y++)if(I=y/b,S=I*I,R=_/(1e-4+S)-x,R>0)for(L=E*y,M=0;M<b;M++)for(D=L+M*w,T=0;T<b;T++)A[D+T]+=R},this.setCell=function(_,x,b,w){const E=this.size2*b+this.size*x+_;this.field[E]=w},this.getCell=function(_,x,b){const w=this.size2*b+this.size*x+_;return this.field[w]},this.blur=function(_=1){const x=this.field,b=x.slice(),w=this.size,E=this.size2;for(let A=0;A<w;A++)for(let T=0;T<w;T++)for(let M=0;M<w;M++){const y=E*M+w*T+A;let S=b[y],R=1;for(let I=-1;I<=1;I+=2){const L=I+A;if(!(L<0||L>=w))for(let D=-1;D<=1;D+=2){const k=D+T;if(!(k<0||k>=w))for(let q=-1;q<=1;q+=2){const z=q+M;if(z<0||z>=w)continue;const it=E*z+w*k+L,ut=b[it];R++,S+=_*(ut-S)/R}}}x[y]=S}},this.reset=function(){for(let _=0;_<this.size3;_++)this.normal_cache[_*3]=0,this.field[_]=0,this.palette[_*3]=this.palette[_*3+1]=this.palette[_*3+2]=0},this.update=function(){this.count=0;const _=this.size-2;for(let x=1;x<_;x++){const b=this.size2*x,w=(x-this.halfsize)/this.halfsize;for(let E=1;E<_;E++){const A=b+this.size*E,T=(E-this.halfsize)/this.halfsize;for(let M=1;M<_;M++){const y=(M-this.halfsize)/this.halfsize,S=A+M;g(y,T,w,S,this.isolation)}}}this.geometry.setDrawRange(0,this.count),a.getAttribute("position").needsUpdate=!0,a.getAttribute("normal").needsUpdate=!0,this.enableUvs&&(a.getAttribute("uv").needsUpdate=!0),this.enableColors&&(a.getAttribute("color").needsUpdate=!0),this.count/3>r&&console.warn("THREE.MarchingCubes: Geometry buffers too small for rendering. Please create an instance with a higher poly count.")},this.init(t)}}const t5=new Int32Array([0,265,515,778,1030,1295,1541,1804,2060,2309,2575,2822,3082,3331,3593,3840,400,153,915,666,1430,1183,1941,1692,2460,2197,2975,2710,3482,3219,3993,3728,560,825,51,314,1590,1855,1077,1340,2620,2869,2111,2358,3642,3891,3129,3376,928,681,419,170,1958,1711,1445,1196,2988,2725,2479,2214,4010,3747,3497,3232,1120,1385,1635,1898,102,367,613,876,3180,3429,3695,3942,2154,2403,2665,2912,1520,1273,2035,1786,502,255,1013,764,3580,3317,4095,3830,2554,2291,3065,2800,1616,1881,1107,1370,598,863,85,348,3676,3925,3167,3414,2650,2899,2137,2384,1984,1737,1475,1226,966,719,453,204,4044,3781,3535,3270,3018,2755,2505,2240,2240,2505,2755,3018,3270,3535,3781,4044,204,453,719,966,1226,1475,1737,1984,2384,2137,2899,2650,3414,3167,3925,3676,348,85,863,598,1370,1107,1881,1616,2800,3065,2291,2554,3830,4095,3317,3580,764,1013,255,502,1786,2035,1273,1520,2912,2665,2403,2154,3942,3695,3429,3180,876,613,367,102,1898,1635,1385,1120,3232,3497,3747,4010,2214,2479,2725,2988,1196,1445,1711,1958,170,419,681,928,3376,3129,3891,3642,2358,2111,2869,2620,1340,1077,1855,1590,314,51,825,560,3728,3993,3219,3482,2710,2975,2197,2460,1692,1941,1183,1430,666,915,153,400,3840,3593,3331,3082,2822,2575,2309,2060,1804,1541,1295,1030,778,515,265,0]),Ec=new Int32Array([-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,8,3,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,1,9,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,1,8,3,9,8,1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,1,2,10,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,8,3,1,2,10,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,9,2,10,0,2,9,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,2,8,3,2,10,8,10,9,8,-1,-1,-1,-1,-1,-1,-1,3,11,2,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,11,2,8,11,0,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,1,9,0,2,3,11,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,1,11,2,1,9,11,9,8,11,-1,-1,-1,-1,-1,-1,-1,3,10,1,11,10,3,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,10,1,0,8,10,8,11,10,-1,-1,-1,-1,-1,-1,-1,3,9,0,3,11,9,11,10,9,-1,-1,-1,-1,-1,-1,-1,9,8,10,10,8,11,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,4,7,8,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,4,3,0,7,3,4,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,1,9,8,4,7,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,4,1,9,4,7,1,7,3,1,-1,-1,-1,-1,-1,-1,-1,1,2,10,8,4,7,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,3,4,7,3,0,4,1,2,10,-1,-1,-1,-1,-1,-1,-1,9,2,10,9,0,2,8,4,7,-1,-1,-1,-1,-1,-1,-1,2,10,9,2,9,7,2,7,3,7,9,4,-1,-1,-1,-1,8,4,7,3,11,2,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,11,4,7,11,2,4,2,0,4,-1,-1,-1,-1,-1,-1,-1,9,0,1,8,4,7,2,3,11,-1,-1,-1,-1,-1,-1,-1,4,7,11,9,4,11,9,11,2,9,2,1,-1,-1,-1,-1,3,10,1,3,11,10,7,8,4,-1,-1,-1,-1,-1,-1,-1,1,11,10,1,4,11,1,0,4,7,11,4,-1,-1,-1,-1,4,7,8,9,0,11,9,11,10,11,0,3,-1,-1,-1,-1,4,7,11,4,11,9,9,11,10,-1,-1,-1,-1,-1,-1,-1,9,5,4,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,9,5,4,0,8,3,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,5,4,1,5,0,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,8,5,4,8,3,5,3,1,5,-1,-1,-1,-1,-1,-1,-1,1,2,10,9,5,4,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,3,0,8,1,2,10,4,9,5,-1,-1,-1,-1,-1,-1,-1,5,2,10,5,4,2,4,0,2,-1,-1,-1,-1,-1,-1,-1,2,10,5,3,2,5,3,5,4,3,4,8,-1,-1,-1,-1,9,5,4,2,3,11,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,11,2,0,8,11,4,9,5,-1,-1,-1,-1,-1,-1,-1,0,5,4,0,1,5,2,3,11,-1,-1,-1,-1,-1,-1,-1,2,1,5,2,5,8,2,8,11,4,8,5,-1,-1,-1,-1,10,3,11,10,1,3,9,5,4,-1,-1,-1,-1,-1,-1,-1,4,9,5,0,8,1,8,10,1,8,11,10,-1,-1,-1,-1,5,4,0,5,0,11,5,11,10,11,0,3,-1,-1,-1,-1,5,4,8,5,8,10,10,8,11,-1,-1,-1,-1,-1,-1,-1,9,7,8,5,7,9,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,9,3,0,9,5,3,5,7,3,-1,-1,-1,-1,-1,-1,-1,0,7,8,0,1,7,1,5,7,-1,-1,-1,-1,-1,-1,-1,1,5,3,3,5,7,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,9,7,8,9,5,7,10,1,2,-1,-1,-1,-1,-1,-1,-1,10,1,2,9,5,0,5,3,0,5,7,3,-1,-1,-1,-1,8,0,2,8,2,5,8,5,7,10,5,2,-1,-1,-1,-1,2,10,5,2,5,3,3,5,7,-1,-1,-1,-1,-1,-1,-1,7,9,5,7,8,9,3,11,2,-1,-1,-1,-1,-1,-1,-1,9,5,7,9,7,2,9,2,0,2,7,11,-1,-1,-1,-1,2,3,11,0,1,8,1,7,8,1,5,7,-1,-1,-1,-1,11,2,1,11,1,7,7,1,5,-1,-1,-1,-1,-1,-1,-1,9,5,8,8,5,7,10,1,3,10,3,11,-1,-1,-1,-1,5,7,0,5,0,9,7,11,0,1,0,10,11,10,0,-1,11,10,0,11,0,3,10,5,0,8,0,7,5,7,0,-1,11,10,5,7,11,5,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,10,6,5,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,8,3,5,10,6,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,9,0,1,5,10,6,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,1,8,3,1,9,8,5,10,6,-1,-1,-1,-1,-1,-1,-1,1,6,5,2,6,1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,1,6,5,1,2,6,3,0,8,-1,-1,-1,-1,-1,-1,-1,9,6,5,9,0,6,0,2,6,-1,-1,-1,-1,-1,-1,-1,5,9,8,5,8,2,5,2,6,3,2,8,-1,-1,-1,-1,2,3,11,10,6,5,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,11,0,8,11,2,0,10,6,5,-1,-1,-1,-1,-1,-1,-1,0,1,9,2,3,11,5,10,6,-1,-1,-1,-1,-1,-1,-1,5,10,6,1,9,2,9,11,2,9,8,11,-1,-1,-1,-1,6,3,11,6,5,3,5,1,3,-1,-1,-1,-1,-1,-1,-1,0,8,11,0,11,5,0,5,1,5,11,6,-1,-1,-1,-1,3,11,6,0,3,6,0,6,5,0,5,9,-1,-1,-1,-1,6,5,9,6,9,11,11,9,8,-1,-1,-1,-1,-1,-1,-1,5,10,6,4,7,8,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,4,3,0,4,7,3,6,5,10,-1,-1,-1,-1,-1,-1,-1,1,9,0,5,10,6,8,4,7,-1,-1,-1,-1,-1,-1,-1,10,6,5,1,9,7,1,7,3,7,9,4,-1,-1,-1,-1,6,1,2,6,5,1,4,7,8,-1,-1,-1,-1,-1,-1,-1,1,2,5,5,2,6,3,0,4,3,4,7,-1,-1,-1,-1,8,4,7,9,0,5,0,6,5,0,2,6,-1,-1,-1,-1,7,3,9,7,9,4,3,2,9,5,9,6,2,6,9,-1,3,11,2,7,8,4,10,6,5,-1,-1,-1,-1,-1,-1,-1,5,10,6,4,7,2,4,2,0,2,7,11,-1,-1,-1,-1,0,1,9,4,7,8,2,3,11,5,10,6,-1,-1,-1,-1,9,2,1,9,11,2,9,4,11,7,11,4,5,10,6,-1,8,4,7,3,11,5,3,5,1,5,11,6,-1,-1,-1,-1,5,1,11,5,11,6,1,0,11,7,11,4,0,4,11,-1,0,5,9,0,6,5,0,3,6,11,6,3,8,4,7,-1,6,5,9,6,9,11,4,7,9,7,11,9,-1,-1,-1,-1,10,4,9,6,4,10,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,4,10,6,4,9,10,0,8,3,-1,-1,-1,-1,-1,-1,-1,10,0,1,10,6,0,6,4,0,-1,-1,-1,-1,-1,-1,-1,8,3,1,8,1,6,8,6,4,6,1,10,-1,-1,-1,-1,1,4,9,1,2,4,2,6,4,-1,-1,-1,-1,-1,-1,-1,3,0,8,1,2,9,2,4,9,2,6,4,-1,-1,-1,-1,0,2,4,4,2,6,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,8,3,2,8,2,4,4,2,6,-1,-1,-1,-1,-1,-1,-1,10,4,9,10,6,4,11,2,3,-1,-1,-1,-1,-1,-1,-1,0,8,2,2,8,11,4,9,10,4,10,6,-1,-1,-1,-1,3,11,2,0,1,6,0,6,4,6,1,10,-1,-1,-1,-1,6,4,1,6,1,10,4,8,1,2,1,11,8,11,1,-1,9,6,4,9,3,6,9,1,3,11,6,3,-1,-1,-1,-1,8,11,1,8,1,0,11,6,1,9,1,4,6,4,1,-1,3,11,6,3,6,0,0,6,4,-1,-1,-1,-1,-1,-1,-1,6,4,8,11,6,8,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,7,10,6,7,8,10,8,9,10,-1,-1,-1,-1,-1,-1,-1,0,7,3,0,10,7,0,9,10,6,7,10,-1,-1,-1,-1,10,6,7,1,10,7,1,7,8,1,8,0,-1,-1,-1,-1,10,6,7,10,7,1,1,7,3,-1,-1,-1,-1,-1,-1,-1,1,2,6,1,6,8,1,8,9,8,6,7,-1,-1,-1,-1,2,6,9,2,9,1,6,7,9,0,9,3,7,3,9,-1,7,8,0,7,0,6,6,0,2,-1,-1,-1,-1,-1,-1,-1,7,3,2,6,7,2,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,2,3,11,10,6,8,10,8,9,8,6,7,-1,-1,-1,-1,2,0,7,2,7,11,0,9,7,6,7,10,9,10,7,-1,1,8,0,1,7,8,1,10,7,6,7,10,2,3,11,-1,11,2,1,11,1,7,10,6,1,6,7,1,-1,-1,-1,-1,8,9,6,8,6,7,9,1,6,11,6,3,1,3,6,-1,0,9,1,11,6,7,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,7,8,0,7,0,6,3,11,0,11,6,0,-1,-1,-1,-1,7,11,6,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,7,6,11,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,3,0,8,11,7,6,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,1,9,11,7,6,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,8,1,9,8,3,1,11,7,6,-1,-1,-1,-1,-1,-1,-1,10,1,2,6,11,7,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,1,2,10,3,0,8,6,11,7,-1,-1,-1,-1,-1,-1,-1,2,9,0,2,10,9,6,11,7,-1,-1,-1,-1,-1,-1,-1,6,11,7,2,10,3,10,8,3,10,9,8,-1,-1,-1,-1,7,2,3,6,2,7,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,7,0,8,7,6,0,6,2,0,-1,-1,-1,-1,-1,-1,-1,2,7,6,2,3,7,0,1,9,-1,-1,-1,-1,-1,-1,-1,1,6,2,1,8,6,1,9,8,8,7,6,-1,-1,-1,-1,10,7,6,10,1,7,1,3,7,-1,-1,-1,-1,-1,-1,-1,10,7,6,1,7,10,1,8,7,1,0,8,-1,-1,-1,-1,0,3,7,0,7,10,0,10,9,6,10,7,-1,-1,-1,-1,7,6,10,7,10,8,8,10,9,-1,-1,-1,-1,-1,-1,-1,6,8,4,11,8,6,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,3,6,11,3,0,6,0,4,6,-1,-1,-1,-1,-1,-1,-1,8,6,11,8,4,6,9,0,1,-1,-1,-1,-1,-1,-1,-1,9,4,6,9,6,3,9,3,1,11,3,6,-1,-1,-1,-1,6,8,4,6,11,8,2,10,1,-1,-1,-1,-1,-1,-1,-1,1,2,10,3,0,11,0,6,11,0,4,6,-1,-1,-1,-1,4,11,8,4,6,11,0,2,9,2,10,9,-1,-1,-1,-1,10,9,3,10,3,2,9,4,3,11,3,6,4,6,3,-1,8,2,3,8,4,2,4,6,2,-1,-1,-1,-1,-1,-1,-1,0,4,2,4,6,2,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,1,9,0,2,3,4,2,4,6,4,3,8,-1,-1,-1,-1,1,9,4,1,4,2,2,4,6,-1,-1,-1,-1,-1,-1,-1,8,1,3,8,6,1,8,4,6,6,10,1,-1,-1,-1,-1,10,1,0,10,0,6,6,0,4,-1,-1,-1,-1,-1,-1,-1,4,6,3,4,3,8,6,10,3,0,3,9,10,9,3,-1,10,9,4,6,10,4,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,4,9,5,7,6,11,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,8,3,4,9,5,11,7,6,-1,-1,-1,-1,-1,-1,-1,5,0,1,5,4,0,7,6,11,-1,-1,-1,-1,-1,-1,-1,11,7,6,8,3,4,3,5,4,3,1,5,-1,-1,-1,-1,9,5,4,10,1,2,7,6,11,-1,-1,-1,-1,-1,-1,-1,6,11,7,1,2,10,0,8,3,4,9,5,-1,-1,-1,-1,7,6,11,5,4,10,4,2,10,4,0,2,-1,-1,-1,-1,3,4,8,3,5,4,3,2,5,10,5,2,11,7,6,-1,7,2,3,7,6,2,5,4,9,-1,-1,-1,-1,-1,-1,-1,9,5,4,0,8,6,0,6,2,6,8,7,-1,-1,-1,-1,3,6,2,3,7,6,1,5,0,5,4,0,-1,-1,-1,-1,6,2,8,6,8,7,2,1,8,4,8,5,1,5,8,-1,9,5,4,10,1,6,1,7,6,1,3,7,-1,-1,-1,-1,1,6,10,1,7,6,1,0,7,8,7,0,9,5,4,-1,4,0,10,4,10,5,0,3,10,6,10,7,3,7,10,-1,7,6,10,7,10,8,5,4,10,4,8,10,-1,-1,-1,-1,6,9,5,6,11,9,11,8,9,-1,-1,-1,-1,-1,-1,-1,3,6,11,0,6,3,0,5,6,0,9,5,-1,-1,-1,-1,0,11,8,0,5,11,0,1,5,5,6,11,-1,-1,-1,-1,6,11,3,6,3,5,5,3,1,-1,-1,-1,-1,-1,-1,-1,1,2,10,9,5,11,9,11,8,11,5,6,-1,-1,-1,-1,0,11,3,0,6,11,0,9,6,5,6,9,1,2,10,-1,11,8,5,11,5,6,8,0,5,10,5,2,0,2,5,-1,6,11,3,6,3,5,2,10,3,10,5,3,-1,-1,-1,-1,5,8,9,5,2,8,5,6,2,3,8,2,-1,-1,-1,-1,9,5,6,9,6,0,0,6,2,-1,-1,-1,-1,-1,-1,-1,1,5,8,1,8,0,5,6,8,3,8,2,6,2,8,-1,1,5,6,2,1,6,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,1,3,6,1,6,10,3,8,6,5,6,9,8,9,6,-1,10,1,0,10,0,6,9,5,0,5,6,0,-1,-1,-1,-1,0,3,8,5,6,10,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,10,5,6,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,11,5,10,7,5,11,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,11,5,10,11,7,5,8,3,0,-1,-1,-1,-1,-1,-1,-1,5,11,7,5,10,11,1,9,0,-1,-1,-1,-1,-1,-1,-1,10,7,5,10,11,7,9,8,1,8,3,1,-1,-1,-1,-1,11,1,2,11,7,1,7,5,1,-1,-1,-1,-1,-1,-1,-1,0,8,3,1,2,7,1,7,5,7,2,11,-1,-1,-1,-1,9,7,5,9,2,7,9,0,2,2,11,7,-1,-1,-1,-1,7,5,2,7,2,11,5,9,2,3,2,8,9,8,2,-1,2,5,10,2,3,5,3,7,5,-1,-1,-1,-1,-1,-1,-1,8,2,0,8,5,2,8,7,5,10,2,5,-1,-1,-1,-1,9,0,1,5,10,3,5,3,7,3,10,2,-1,-1,-1,-1,9,8,2,9,2,1,8,7,2,10,2,5,7,5,2,-1,1,3,5,3,7,5,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,8,7,0,7,1,1,7,5,-1,-1,-1,-1,-1,-1,-1,9,0,3,9,3,5,5,3,7,-1,-1,-1,-1,-1,-1,-1,9,8,7,5,9,7,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,5,8,4,5,10,8,10,11,8,-1,-1,-1,-1,-1,-1,-1,5,0,4,5,11,0,5,10,11,11,3,0,-1,-1,-1,-1,0,1,9,8,4,10,8,10,11,10,4,5,-1,-1,-1,-1,10,11,4,10,4,5,11,3,4,9,4,1,3,1,4,-1,2,5,1,2,8,5,2,11,8,4,5,8,-1,-1,-1,-1,0,4,11,0,11,3,4,5,11,2,11,1,5,1,11,-1,0,2,5,0,5,9,2,11,5,4,5,8,11,8,5,-1,9,4,5,2,11,3,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,2,5,10,3,5,2,3,4,5,3,8,4,-1,-1,-1,-1,5,10,2,5,2,4,4,2,0,-1,-1,-1,-1,-1,-1,-1,3,10,2,3,5,10,3,8,5,4,5,8,0,1,9,-1,5,10,2,5,2,4,1,9,2,9,4,2,-1,-1,-1,-1,8,4,5,8,5,3,3,5,1,-1,-1,-1,-1,-1,-1,-1,0,4,5,1,0,5,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,8,4,5,8,5,3,9,0,5,0,3,5,-1,-1,-1,-1,9,4,5,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,4,11,7,4,9,11,9,10,11,-1,-1,-1,-1,-1,-1,-1,0,8,3,4,9,7,9,11,7,9,10,11,-1,-1,-1,-1,1,10,11,1,11,4,1,4,0,7,4,11,-1,-1,-1,-1,3,1,4,3,4,8,1,10,4,7,4,11,10,11,4,-1,4,11,7,9,11,4,9,2,11,9,1,2,-1,-1,-1,-1,9,7,4,9,11,7,9,1,11,2,11,1,0,8,3,-1,11,7,4,11,4,2,2,4,0,-1,-1,-1,-1,-1,-1,-1,11,7,4,11,4,2,8,3,4,3,2,4,-1,-1,-1,-1,2,9,10,2,7,9,2,3,7,7,4,9,-1,-1,-1,-1,9,10,7,9,7,4,10,2,7,8,7,0,2,0,7,-1,3,7,10,3,10,2,7,4,10,1,10,0,4,0,10,-1,1,10,2,8,7,4,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,4,9,1,4,1,7,7,1,3,-1,-1,-1,-1,-1,-1,-1,4,9,1,4,1,7,0,8,1,8,7,1,-1,-1,-1,-1,4,0,3,7,4,3,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,4,8,7,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,9,10,8,10,11,8,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,3,0,9,3,9,11,11,9,10,-1,-1,-1,-1,-1,-1,-1,0,1,10,0,10,8,8,10,11,-1,-1,-1,-1,-1,-1,-1,3,1,10,11,3,10,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,1,2,11,1,11,9,9,11,8,-1,-1,-1,-1,-1,-1,-1,3,0,9,3,9,11,1,2,9,2,11,9,-1,-1,-1,-1,0,2,11,8,0,11,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,3,2,11,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,2,3,8,2,8,10,10,8,9,-1,-1,-1,-1,-1,-1,-1,9,10,2,0,9,2,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,2,3,8,2,8,10,0,1,8,1,10,8,-1,-1,-1,-1,1,10,2,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,1,3,8,9,1,8,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,9,1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,3,8,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1]),Gp={uFurFade:{value:1}},e5=`
  float furHash(vec3 p) { p = fract(p * 0.1031); p += dot(p, p.zyx + 31.32); return fract((p.x + p.y) * p.z); }
  float furNoise(vec3 p) { vec3 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f);
    return mix(mix(mix(furHash(i), furHash(i + vec3(1, 0, 0)), f.x), mix(furHash(i + vec3(0, 1, 0)), furHash(i + vec3(1, 1, 0)), f.x), f.y),
               mix(mix(furHash(i + vec3(0, 0, 1)), furHash(i + vec3(1, 0, 1)), f.x), mix(furHash(i + vec3(0, 1, 1)), furHash(i + vec3(1, 1, 1)), f.x), f.y), f.z); }`;function n5(n,t){const e=new Xe({vertexColors:!0,roughness:t.feather?.75:.92,metalness:0}),i={uH:{value:n},uFurLen:{value:t.length},uFurDensity:{value:t.density},uFurTip:{value:t.tip},uFeather:{value:t.feather?1:0}};return e.onBeforeCompile=s=>{Object.assign(s.uniforms,i,Gp),s.vertexShader=s.vertexShader.replace("#include <common>",`#include <common>
        uniform float uH; uniform float uFurLen; uniform float uFurFade; uniform float uFeather; attribute float aFur; varying vec3 vFurP; varying vec3 vFurN; varying float vFurK;`).replace("#include <begin_vertex>",`#include <begin_vertex>
        vFurP = position; vFurN = normalize(objectNormal); vFurK = aFur;
        // out along the normal as far as the coat reaches here, combed back and down the body, the tips drooping
        float reach = uFurLen * uFurFade * aFur * uH;
        vec3 comb = vec3(0.0, -0.75, -0.65);
        comb -= dot(comb, vFurN) * vFurN;
        // a feather lies flatter than a hair: less out, more down the body
        transformed += vFurN * reach * mix(1.0, 0.45, uFeather) + comb * reach * mix(0.9, 1.5, uFeather) * uH;
        transformed.y -= reach * 0.35 * uH;`),s.fragmentShader=s.fragmentShader.replace("#include <common>",`#include <common>
        uniform float uH; uniform float uFurDensity; uniform float uFurFade; uniform float uFurTip; uniform float uFeather; varying vec3 vFurP; varying vec3 vFurN; varying float vFurK;
        ${e5}`).replace("#include <color_fragment>",`#include <color_fragment>
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
        diffuseColor.rgb = mix(diffuseColor.rgb, diffuseColor.rgb * 1.25 + 0.06, uFurTip * smoothstep(0.6, 1.0, t));`)},e.customProgramCacheKey=()=>"kaiju-fur-v2",e}function i5(n,t,e,i){const s=[];for(let r=1;r<=i;r++){const a=new g0(t,n5(r/i,e));a.castShadow=!1,a.receiveShadow=!0,a.frustumCulled=!1,a.userData.h=r/i,n.add(a),a.bind(n.skeleton,n.bindMatrix),s.push(a)}return s}function s5(n=512){const t=document.createElement("canvas");t.width=t.height=n;const e=t.getContext("2d"),i=document.createElement("canvas");i.width=i.height=n;const s=i.getContext("2d"),r=e.createImageData(n,n),a=s.createImageData(n,n),o=22,c=[];let l=7;const h=()=>(l=l*1664525+1013904223>>>0,l/4294967296);for(let f=0;f<o;f++)for(let p=0;p<o;p++)c.push([(p+.2+h()*.6)/o,(f+.2+h()*.6)/o,.7+h()*.3]);for(let f=0;f<n;f++)for(let p=0;p<n;p++){const v=p/n,g=f/n,m=Math.floor(v*o),_=Math.floor(g*o);let x=9,b=9,w=1;for(let R=-1;R<=1;R++)for(let I=-1;I<=1;I++){const L=(m+I+o)%o,D=(_+R+o)%o,k=c[D*o+L];let q=v-k[0],z=g-k[1];q-=Math.round(q),z-=Math.round(z);const it=Math.sqrt(q*q+z*z);it<x?(b=x,x=it,w=k[2]):it<b&&(b=it)}const E=b-x,A=Math.min(1,E/.02),T=1-Math.min(1,x/(.55/o)),M=(.55+.45*A)*w*(.85+.3*T),y=(f*n+p)*4;r.data[y]=255*M,r.data[y+1]=255*M,r.data[y+2]=255*M,r.data[y+3]=255;const S=.55+.4*(1-A)-.15*T;a.data[y]=255*S,a.data[y+1]=255*S,a.data[y+2]=255*S,a.data[y+3]=255}e.putImageData(r,0,0),s.putImageData(a,0,0);const u=new Qc(t);u.wrapS=u.wrapT=Ca,u.colorSpace=Ni;const d=new Qc(i);return d.wrapS=d.wrapT=Ca,{map:u,rough:d}}let Tc=null;function Wp(n=!1,t){if(n)return r5();if(t==="armour")return new Xe({vertexColors:!0,roughness:.42,metalness:.45});if(t==="soft")return new Xe({vertexColors:!0,roughness:.82,metalness:0});if(t==="suit")return new Xe({vertexColors:!0,roughness:.34,metalness:.18});!Tc&&typeof document<"u"&&(Tc=s5());const e=new Xe({vertexColors:!0,roughness:.7,metalness:.02});return e.onBeforeCompile=i=>{i.uniforms.uScales={value:Tc?.map??null},i.uniforms.uRough={value:Tc?.rough??null},i.vertexShader=i.vertexShader.replace("#include <common>",`#include <common>
 varying vec3 vBind; varying vec3 vBindN;`).replace("#include <begin_vertex>",`#include <begin_vertex>
 vBind = position; vBindN = normal;`),i.fragmentShader=i.fragmentShader.replace("#include <common>",`#include <common>
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
        float roughTex = triplanar(uRough, vBind, bn, sc).r;`).replace("#include <roughnessmap_fragment>","float roughnessFactor = mix(roughTex, 0.9, isBone);")},e.customProgramCacheKey=()=>"kaiju-v1",e}function r5(){const n=new Xe({vertexColors:!0,roughness:.95,metalness:0});return n.onBeforeCompile=t=>{Object.assign(t.uniforms,Gp),t.fragmentShader=t.fragmentShader.replace("#include <common>",`#include <common>
 uniform float uFurFade;`).replace("#include <color_fragment>",`#include <color_fragment>
 diffuseColor.rgb *= mix(1.0, 0.6, uFurFade);`)},n.customProgramCacheKey=()=>"kaiju-undercoat-v1",n}const el={jaw:0,blinkL:0,blinkR:0,smile:0,pucker:0,browUp:0,smileL:0,smileR:0,frown:0,browDownL:0,browDownR:0,browOuterL:0,browOuterR:0,squintL:0,squintR:0,wideL:0,wideR:0,lookX:0,lookY:0,jawSide:0,puff:0,funnel:0,sneer:0};function a5(n,t={}){const e={...el,...t};for(const i of(n??"").split(",")){const[s,r]=i.split(":");s&&s in e&&r!==void 0&&Number.isFinite(Number(r))&&(e[s]=Number(r))}return e}function Du(n){const t=new me;return t.setAttribute("position",new Kt(n.position,3)),t.setAttribute("normal",new Kt(n.normal,3)),t.setAttribute("color",new Kt(n.color,3)),n.aFur&&t.setAttribute("aFur",new Kt(n.aFur,1)),t.setAttribute("skinIndex",new Kt(n.skinIndex,4)),t.setAttribute("skinWeight",new Kt(n.skinWeight,4)),t}function Ad(n,t,e){return Du(o5(n,t,e))}function o5(n,t,e){const i=n.box,s=(i.min[0]+i.max[0])/2,r=(i.min[1]+i.max[1])/2,a=(i.min[2]+i.max[2])/2,o=(i.max[0]-i.min[0])/2,c=(i.max[1]-i.min[1])/2,l=(i.max[2]-i.min[2])/2,h=new zp(e,new ds,!1,!1,4e5);h.isolation=50;const u=h.field,d=e;for(let S=0;S<d;S++){const R=a+(S/(d-1)*2-1)*l;for(let I=0;I<d;I++){const L=r+(I/(d-1)*2-1)*c;for(let D=0;D<d;D++){const k=s+(D/(d-1)*2-1)*o;u[S*d*d+I*d+D]=Math.max(0,Math.min(100,50-n.sdf(k,L,R)*40))}}}h.update();const f=h.count,p=new Float32Array(f*3),v=new Float32Array(f*3),g=new Float32Array(f*3),m=h.positionArray,_=h.normalArray,x=n.palette.map(S=>new vt(S)),b=new vt;for(let S=0;S<f;S++){const R=s+m[S*3]*o,I=r+m[S*3+1]*c,L=a+m[S*3+2]*l;p[S*3]=R,p[S*3+1]=I,p[S*3+2]=L;let D=_[S*3]/o,k=_[S*3+1]/c,q=_[S*3+2]/l;const z=Math.hypot(D,k,q)||1;D/=z,k/=z,q/=z,v[S*3]=D,v[S*3+1]=k,v[S*3+2]=q;const it=n.region(R,I,L);b.copy(x[it]??x[0]),n.tint?.(it,R,I,L,b);const ut=.94+.06*Math.sin(I*1.7+L*.9)*Math.cos(R*2.3);g[S*3]=b.r*ut,g[S*3+1]=b.g*ut,g[S*3+2]=b.b*ut}h.geometry.dispose();let w;if(n.fur){w=new Float32Array(f);for(let S=0;S<f;S++)w[S]=n.furLen?n.furLen(p[S*3],p[S*3+1],p[S*3+2]):1}const E=new Uint16Array(f*4),A=new Float32Array(f*4),T=t.map((S,R)=>({i:R,a:S.a,b:S.b,reach:S.reach??1/0,name:S.name})),M=n.capture,y=n.weights??"sharp";for(let S=0;S<f;S++){const R=p[S*3],I=p[S*3+1],L=p[S*3+2];let D=1/0,k=1/0,q=0,z=0;for(const _t of T){if(M&&!M(_t,R,I,L))continue;const At=_t.b[0]-_t.a[0],Ut=_t.b[1]-_t.a[1],ct=_t.b[2]-_t.a[2],G=R-_t.a[0],J=I-_t.a[1],H=L-_t.a[2],W=Math.max(0,Math.min(1,(G*At+J*Ut+H*ct)/(At*At+Ut*Ut+ct*ct||1))),V=Math.hypot(G-At*W,J-Ut*W,H-ct*W);V>_t.reach||(V<D?(k=D,z=q,D=V,q=_t.i):V<k&&(k=V,z=_t.i))}isFinite(k)||(k=D,z=q);const it=y==="rigid"?1:y==="soft"?1/Math.pow(D+1.2,2):1/Math.pow(D+.3,4),ut=y==="rigid"?0:y==="soft"?1/Math.pow(k+1.2,2):1/Math.pow(k+.3,4),gt=it+ut;E[S*4]=q,E[S*4+1]=z,A[S*4]=it/gt,A[S*4+1]=ut/gt}return{position:p,normal:v,color:g,skinIndex:E,skinWeight:A,aFur:w}}const c5=(n,t=n.res??88)=>({body:t,fur:Math.max(32,Math.round(t*.6))});function l5(n){const t=new Map;let e=null;for(const i of n){const s=new wp;if(s.name=i.name,i.parent){const r=n.find(a=>a.name===i.parent);s.position.set(i.a[0]-r.a[0],i.a[1]-r.a[1],i.a[2]-r.a[2]),t.get(i.parent).add(s)}else s.position.set(i.a[0],i.a[1],i.a[2]),e=s;t.set(i.name,s)}return{bones:t,root:e}}function mh(n,t=n.res??88,e){const i=performance.now(),s=c5(n,t),{bones:r,root:a}=l5(n.segs);let o,c=[];if(n.body){const l=n.body,h=e?Du(e.body):Ad(l,n.segs,s.body),u=l.surface==="scales"||l.surface==="fur"?void 0:l.surface,d=new g0(h,Wp(!!l.fur||l.surface==="fur",u));d.castShadow=!0,d.receiveShadow=!0,d.frustumCulled=!1,d.add(a),d.bind(new v0(n.segs.map(f=>r.get(f.name)))),l.fur&&(n.furShells??10)>0&&(c=i5(d,e?.fur?Du(e.fur):Ad(l,n.segs,s.fur),l.fur,n.furShells??10)),o=d}else{const l=new we;l.add(a),o=l}if(n.dress){const l=new Map;n.dress({bones:r,segs:n.segs,at(h,u,d,f,p){const v=n.segs.find(g=>g.name===u);return h.position.set(d-v.a[0],f-v.a[1],p-v.a[2]),h.traverse(g=>{g.isMesh&&(g.castShadow=!0,g.receiveShadow=!0)}),r.get(u).add(h),h},std(h){const u=JSON.stringify(h);let d=l.get(u);return d||(d=new Xe(h),l.set(u,d)),d}})}return o.name=n.id,{def:n,root:o,bones:r,fur:c,ms:performance.now()-i}}const B=(n,t,e)=>{const i=Math.max(e-Math.abs(n-t),0)/e;return Math.min(n,t)-i*i*e*.25};function fe(n,t,e,i,s,r,a){const o=n-i,c=t-s,l=e-r;return Math.sqrt(o*o+c*c+l*l)-a}function K(n,t,e,i,s,r,a,o,c,l,h){const u=a-i,d=o-s,f=c-r,p=n-i,v=t-s,g=e-r,m=Math.max(0,Math.min(1,(p*u+v*d+g*f)/(u*u+d*d+f*f))),_=p-u*m,x=v-d*m,b=g-f*m;return Math.sqrt(_*_+x*x+b*b)-(l+(h-l)*m)}function at(n,t,e,i,s,r,a,o,c){const l=(n-i)/a,h=(t-s)/o,u=(e-r)/c,d=Math.sqrt(l*l+h*h+u*u),f=Math.sqrt(l*l/a+h*h/o+u*u/c);return f>0?d*(d-1)/f:-Math.min(a,o,c)}const xr=2.1,ha=[1.95,6,.2],Vi=[xr,3.4,.55],ir=[xr,1,0],Rd=[xr,.3,2],Li=[2.9,11,.8],Hn=[4.99,10.54,1.28],Fs=[6.76,10.06,1.79],_n=[[0,6.6,-2.6],[.5,4.6,-4.4],[1.6,2.4,-5.3],[3,1.1,-5.2],[4.5,.85,-4.1]],Cd=[1.15,1.45,1.4,1.2,.75],Pe=[0,14.4,.6],h5=[{name:"pelvis",a:[0,6,0],b:[0,7.6,0],parent:null},{name:"spine1",a:[0,7.6,0],b:[0,9.4,.1],parent:"pelvis"},{name:"spine2",a:[0,9.4,.1],b:[0,11.4,.1],parent:"spine1"},{name:"neck",a:[0,11.4,.1],b:[0,Pe[1]-1.6,Pe[2]-.25],parent:"spine2"},{name:"head",a:[0,Pe[1]-1.6,Pe[2]-.25],b:[0,Pe[1]+1.6,Pe[2]+.1],parent:"neck"},{name:"jaw",a:[0,Pe[1]-1.1,Pe[2]+1.1],b:[0,Pe[1]-1.2,Pe[2]+2.9],parent:"head",reach:0},{name:"tail1",a:_n[0],b:_n[1],parent:"pelvis"},{name:"tail2",a:_n[1],b:_n[2],parent:"tail1"},{name:"tail3",a:_n[2],b:_n[3],parent:"tail2"},{name:"tail4",a:_n[3],b:_n[4],parent:"tail3"},{name:"thighL",a:ha,b:Vi,parent:"pelvis"},{name:"shinL",a:Vi,b:ir,parent:"thighL"},{name:"footL",a:ir,b:Rd,parent:"shinL"},{name:"thighR",a:Ei(ha),b:Ei(Vi),parent:"pelvis"},{name:"shinR",a:Ei(Vi),b:Ei(ir),parent:"thighR"},{name:"footR",a:Ei(ir),b:Ei(Rd),parent:"shinR"},{name:"armL",a:Li,b:Hn,parent:"spine2"},{name:"forearmL",a:Hn,b:Fs,parent:"armL"},{name:"armR",a:Ei(Li),b:Ei(Hn),parent:"spine2"},{name:"forearmR",a:Ei(Hn),b:Ei(Fs),parent:"armR"}];function Ei(n){return[-n[0],n[1],n[2]]}const u5={min:[-8.6,-.4,-7.2],max:[8.6,18.4,5.8]},Mn=[.98,Pe[1]+.33,Pe[2]+1.97],lr=[0,Pe[1]-.5,Pe[2]+4.05],vi=T0(Xp(Fs,Hn)),gh=T0([-vi[2],0,vi[0]]);function Xp(n,t){return[n[0]-t[0],n[1]-t[1],n[2]-t[2]]}function T0(n){const t=Math.hypot(n[0],n[1],n[2]);return[n[0]/t,n[1]/t,n[2]/t]}const Da=(n,t,e,i=0)=>[n[0]+vi[0]*t+gh[0]*e,n[1]+vi[1]*t+gh[1]*e+i,n[2]+vi[2]*t+gh[2]*e],hi=Da(Fs,.35,0),f5=Da(hi,1.3,0),qp=(n,t,e)=>(n-Fs[0])*vi[0]+(t-Fs[1])*vi[1]+(e-Fs[2])*vi[2],$p=[-.42,-.14,.14,.42].map(n=>[Da(hi,.35,n*1.1),Da(hi,1.15-Math.abs(n)*.5,n*1.35,-.12)]);$p.push([Da(hi,-.1,.45),Da(hi,.45,.95,-.1)]);const d5=[-.5,-.17,.17,.5].map(n=>[[xr+n*1.1,.3,1.8],[xr+n*1.3,.22,2.7-Math.abs(n)*.4]]),bs=(n,t,e,i,s,r,a)=>K(n,t,e,i[0],i[1],i[2],s[0],s[1],s[2],r,a),qr=2.5;let Ld=NaN,Pd=NaN,Id=NaN;const ys={body:0,head:0,arm:0,leg:0,tail:0,min:0};function Vo(n,t,e){if(n===Ld&&t===Pd&&e===Id)return ys;Ld=n,Pd=t,Id=e;const i=Math.abs(n);let s=fe(n,t,e,0,9.2,.2,5.6);s<qr&&(s=at(n,t,e,0,7.7,.35,3.85,3.35,3.4),s=B(s,at(n,t,e,0,10.3,.3,3,2.1,2.7),1.6),s=B(s,at(n,t,e,0,6.9,-1.2,3.4,2.6,2.7),1.2),s=B(s,fe(i,t,e,Li[0],Li[1],Li[2],.85),.7),s=B(s,K(n,t,e,0,11,.2,0,Pe[1]-1.4,Pe[2]-.15,2.1,1.7),.8)),ys.body=s;const r=t-Pe[1],a=e-Pe[2];let o=fe(n,r,a,0,.6,.5,4.3);o<qr&&(o=at(n,r,a,0,0,0,2.38,2.05,2.21),o=B(o,at(i,r,a,1.8,-.66,.25,1.15,1.23,1.31),.66),o=B(o,K(n,r,a,0,-.25,1.48,0,-.57,3.6,1.11,.45),.5),o=B(o,K(n,r,a,0,-1.07,1.15,0,-1.23,2.95,.78,.41),.33),o=B(o,at(i,r,a,1.44,2.05,-.66,.78,1.03,.34),.29),o=Math.max(o,-fe(i,t,e,Mn[0]+.05,Mn[1],Mn[2]+.2,.34))),ys.head=o;let c=bs(i,t,e,Li,f5,1.6,1.6);if(c<qr&&(c=bs(i,t,e,Li,Hn,.72,.8),c=B(c,fe(i,t,e,(Li[0]+Hn[0])/2,(Li[1]+Hn[1])/2,(Li[2]+Hn[2])/2,.9),.6),c=B(c,bs(i,t,e,Hn,Fs,.8,.6),.4),fe(i,t,e,hi[0],hi[1],hi[2],1.6)<qr)){c=B(c,at(i,t,e,hi[0],hi[1],hi[2],.62,.38,.62),.3);for(const u of $p)c=B(c,bs(i,t,e,u[0],u[1],.24,.17),.14)}ys.arm=c;let l=K(i,t,e,ha[0],ha[1],ha[2],xr,.6,1,2,2);if(l<qr&&(l=bs(i,t,e,ha,Vi,1.42,1.1),l=B(l,bs(i,t,e,Vi,ir,1.08,.85),.5),t<2.6)){l=B(l,Math.max(at(i,t,e,xr,.45,.75,.95,.6,1.75),-t),.45);for(const u of d5)l=B(l,bs(i,t,e,u[0],u[1],.26,.18),.15)}ys.leg=l;let h=fe(n,t,e,2,3.4,-4.4,5.4);if(h<qr){h=1e9;for(let u=0;u+1<_n.length;u++)h=B(h,bs(n,t,e,_n[u],_n[u+1],Cd[u],Cd[u+1]),.5)}return ys.tail=h,ys.min=Math.min(s,o,c,l,h),ys}function p5(n,t,e){const i=Vo(n,t,e);let s=B(i.body,i.head,.6);return s=B(s,i.arm,.5),s=B(s,i.leg,.7),B(s,i.tail,.6)}function m5(n,t,e){let i=0,s=1/0,r=0;for(let a=0;a+1<_n.length;a++){const o=_n[a],c=_n[a+1],l=c[0]-o[0],h=c[1]-o[1],u=c[2]-o[2],d=l*l+h*h+u*u,f=Math.max(0,Math.min(1,((n-o[0])*l+(t-o[1])*h+(e-o[2])*u)/d)),p=n-o[0]-l*f,v=t-o[1]-h*f,g=e-o[2]-u*f,m=p*p+v*v+g*g;m<s&&(s=m,i=r+f*Math.sqrt(d)),r+=Math.sqrt(d)}return i}function g5(n,t,e){const i=Math.abs(n);if(Math.hypot(n,t-lr[1],e-lr[2])<.62)return 3;const s=Vo(n,t,e),r=s.min;if(s.head===r){const a=t-Pe[1],o=e-Pe[2];if(o>.2&&a>-1.9){const c=i-1.1,l=a-.22+.32*c;if((c/1.25)**2+(l/.66)**2<1||i<.34&&a>-.35&&a<2.4&&o>.6)return 2;const h=i-1.05,u=a-1.12+.18*h;if((h/1)**2+(u/.4)**2<1||a<-.15+.25*Math.max(0,i-1.2)&&o>.5)return 1}return a>2.75&&i>.98?1:0}if(s.tail===r){const a=m5(n,t,e);return a>7.9||a%2<.85?2:4}return s.arm===r?qp(i,t,e)>-.25?5:0:s.leg===r?t<1.3?5:0:e>1.2&&(n/2.4)**2+((t-7.9)/3.1)**2<1?4:0}function v5(n,t,e){const i=Math.abs(n),s=Math.hypot(i-Mn[0],t-Mn[1],e-Mn[2]);if(s<.62||Math.hypot(n,t-lr[1],e-lr[2])<.85)return 0;const r=Vo(n,t,e),a=r.min;if(r.head===a){const o=t-Pe[1],c=e-Pe[2];return o>1.4&&i>.9&&c<.1?.5:i>1.4&&o<0&&c<1.5?1.35:c>1?.35+.4*Math.min(1,(s-.62)/1.3):.9}return r.tail===a?1.4:r.arm===a?qp(i,t,e)>-.25?.25:.9:r.leg===a?t<1.3?.3:1:1.1}const x5=.15,_5=new Map([["pelvis",0],["spine1",0],["spine2",0],["neck",1],["head",2],["jaw",2],["armL",3],["forearmL",3],["armR",4],["forearmR",4],["thighL",5],["shinL",5],["footL",5],["thighR",6],["shinR",6],["footR",6],["tail1",7],["tail2",7],["tail3",7],["tail4",7]]),vh=T0(Xp(ir,Vi)),M5=new Map([["forearm",(n,t,e)=>(n-Hn[0])*vi[0]+(t-Hn[1])*vi[1]+(e-Hn[2])*vi[2]>-.9],["shin",(n,t,e)=>(n-Vi[0])*vh[0]+(t-Vi[1])*vh[1]+(e-Vi[2])*vh[2]>-.9],["foot",(n,t)=>t<ir[1]+.7]]),Ac=(n,t,e,i)=>{const s=M5.get(n.slice(0,-1));return!s||s(Math.abs(t),e,i)},b5=(n,t,e,i)=>{const s=Vo(t,e,i),r=s.min+x5;switch(_5.get(n.name)){case 0:return s.body<=r;case 1:return e>10.6&&(s.body<=r&&Math.abs(t)<2.4||s.head<=r&&e<Pe[1]-1.6);case 2:return s.head<=r&&e>Pe[1]-2.1||s.body<=r&&e>12&&Math.abs(t)<2;case 3:return s.arm<=r&&t>.5&&Ac(n.name,t,e,i);case 4:return s.arm<=r&&t<-.5&&Ac(n.name,t,e,i);case 5:return s.leg<=r&&t>.2&&Ac(n.name,t,e,i);case 6:return s.leg<=r&&t<-.2&&Ac(n.name,t,e,i);case 7:return s.tail<=r;default:return!0}},y5={id:"jimothy",name:"Jimothy",blurb:"The round Seattle raccoon, standing up",segs:h5,body:{sdf:p5,region:g5,box:u5,palette:[7103837,15130834,1841431,657930,9406332,3814192],weights:"soft",capture:b5,fur:{length:1,density:7,tip:.18},furLen:v5,tint(n,t,e,i,s){if(n!==0)return;i<-.5&&s.multiplyScalar(1-.2*Math.min(1,(-.5-i)/2.5));const r=Vo(t,e,i);(r.arm===r.min||r.leg===r.min)&&s.multiplyScalar(.82)}},dress(n){const t=n.std({color:328965,roughness:.06,metalness:.1});for(const i of[-1,1])n.at(new mt(new ie(.34,14,10),t),"head",i*Mn[0],Mn[1],Mn[2]);const e=new mt(new ie(.42,14,10),n.std({color:657930,roughness:.25}));e.scale.set(1.15,.8,.75),n.at(e,"head",lr[0],lr[1],lr[2])},fit:{size:1.05,limb:.5},face:{eyes:[[Mn[0],Mn[1],Mn[2]+.18,.36],[-.98,Mn[1],Mn[2]+.18,.36]]},idle:{tail:.15},res:84,furShells:8},Ka=new C;function qn(n,t,e,i,s,r){const a=2*Math.PI*s/4,o=Math.max(r-2*s,0),c=Math.PI/4;Ka.copy(t),Ka[i]=0,Ka.normalize();const l=.5*a/(a+o),h=1-Ka.angleTo(n)/c;return Math.sign(Ka[e])===1?h*l:o/(a+o)+l+l*(1-h)}class A0 extends be{constructor(t=1,e=1,i=1,s=2,r=.1){const a=s*2+1;if(r=Math.min(t/2,e/2,i/2,r),super(1,1,1,a,a,a),this.type="RoundedBoxGeometry",this.parameters={width:t,height:e,depth:i,segments:s,radius:r},a===1)return;const o=this.toNonIndexed();this.index=null,this.attributes.position=o.attributes.position,this.attributes.normal=o.attributes.normal,this.attributes.uv=o.attributes.uv;const c=new C,l=new C,h=new C(t,e,i).divideScalar(2).subScalar(r),u=this.attributes.position.array,d=this.attributes.normal.array,f=this.attributes.uv.array,p=u.length/6,v=new C,g=.5/a;for(let m=0,_=0;m<u.length;m+=3,_+=2)switch(c.fromArray(u,m),l.copy(c),l.x-=Math.sign(l.x)*g,l.y-=Math.sign(l.y)*g,l.z-=Math.sign(l.z)*g,l.normalize(),u[m+0]=h.x*Math.sign(c.x)+l.x*r,u[m+1]=h.y*Math.sign(c.y)+l.y*r,u[m+2]=h.z*Math.sign(c.z)+l.z*r,d[m+0]=l.x,d[m+1]=l.y,d[m+2]=l.z,Math.floor(m/p)){case 0:v.set(1,0,0),f[_+0]=qn(v,l,"z","y",r,i),f[_+1]=1-qn(v,l,"y","z",r,e);break;case 1:v.set(-1,0,0),f[_+0]=1-qn(v,l,"z","y",r,i),f[_+1]=1-qn(v,l,"y","z",r,e);break;case 2:v.set(0,1,0),f[_+0]=1-qn(v,l,"x","z",r,t),f[_+1]=qn(v,l,"z","x",r,i);break;case 3:v.set(0,-1,0),f[_+0]=1-qn(v,l,"x","z",r,t),f[_+1]=1-qn(v,l,"z","x",r,i);break;case 4:v.set(0,0,1),f[_+0]=1-qn(v,l,"x","y",r,t),f[_+1]=1-qn(v,l,"y","x",r,e);break;case 5:v.set(0,0,-1),f[_+0]=qn(v,l,"x","y",r,t),f[_+1]=1-qn(v,l,"y","x",r,e);break}}static fromJSON(t){return new A0(t.width,t.height,t.depth,t.segments,t.radius)}}function hs(n,t=!1){const e=n[0].index!==null,i=new Set(Object.keys(n[0].attributes)),s=new Set(Object.keys(n[0].morphAttributes)),r={},a={},o=n[0].morphTargetsRelative,c=new me;let l=0;for(let h=0;h<n.length;++h){const u=n[h];let d=0;if(e!==(u.index!==null))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". All geometries must have compatible attributes; make sure index attribute exists among all geometries, or in none of them."),null;for(const f in u.attributes){if(!i.has(f))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+'. All geometries must have compatible attributes; make sure "'+f+'" attribute exists among all geometries, or in none of them.'),null;r[f]===void 0&&(r[f]=[]),r[f].push(u.attributes[f]),d++}if(d!==i.size)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". Make sure all geometries have the same number of attributes."),null;if(o!==u.morphTargetsRelative)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". .morphTargetsRelative must be consistent throughout all geometries."),null;for(const f in u.morphAttributes){if(!s.has(f))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+".  .morphAttributes must be consistent throughout all geometries."),null;a[f]===void 0&&(a[f]=[]),a[f].push(u.morphAttributes[f])}if(t){let f;if(e)f=u.index.count;else if(u.attributes.position!==void 0)f=u.attributes.position.count;else return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". The geometry must have either an index or a position attribute"),null;c.addGroup(l,f,h),l+=f}}if(e){let h=0;const u=[];for(let d=0;d<n.length;++d){const f=n[d].index;for(let p=0;p<f.count;++p)u.push(f.getX(p)+h);h+=n[d].attributes.position.count}c.setIndex(u)}for(const h in r){const u=Dd(r[h]);if(!u)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+h+" attribute."),null;c.setAttribute(h,u)}for(const h in a){const u=a[h][0].length;if(u===0)break;c.morphAttributes=c.morphAttributes||{},c.morphAttributes[h]=[];for(let d=0;d<u;++d){const f=[];for(let v=0;v<a[h].length;++v)f.push(a[h][v][d]);const p=Dd(f);if(!p)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+h+" morphAttribute."),null;c.morphAttributes[h].push(p)}}return c}function Dd(n){let t,e,i,s=-1,r=0;for(let l=0;l<n.length;++l){const h=n[l];if(t===void 0&&(t=h.array.constructor),t!==h.array.constructor)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.array must be of consistent array types across matching attributes."),null;if(e===void 0&&(e=h.itemSize),e!==h.itemSize)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.itemSize must be consistent across matching attributes."),null;if(i===void 0&&(i=h.normalized),i!==h.normalized)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.normalized must be consistent across matching attributes."),null;if(s===-1&&(s=h.gpuType),s!==h.gpuType)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.gpuType must be consistent across matching attributes."),null;r+=h.count*e}const a=new t(r),o=new Kt(a,e,i);let c=0;for(let l=0;l<n.length;++l){const h=n[l];if(h.isInterleavedBufferAttribute){const u=c/e;for(let d=0,f=h.count;d<f;d++)for(let p=0;p<e;p++){const v=h.getComponent(d,p);o.setComponent(d+u,p,v)}}else a.set(h.array,c);c+=h.count*e}return s!==void 0&&(o.gpuType=s),o}const Yp=[{name:"pelvis",a:[0,9.6,0],b:[0,10.8,0],parent:null},{name:"spine1",a:[0,10.8,0],b:[0,12.6,0],parent:"pelvis"},{name:"spine2",a:[0,12.6,0],b:[0,15,0],parent:"spine1"},{name:"neck",a:[0,15,0],b:[0,15.9,0],parent:"spine2"},{name:"head",a:[0,15.9,0],b:[0,18.4,0],parent:"neck"},{name:"jaw",a:[0,16.5,1],b:[0,16.5,1.3],parent:"head",reach:0},{name:"tail1",a:[0,9.4,-.8],b:[0,9.2,-1.2],parent:"pelvis",reach:0},{name:"tail2",a:[0,9.2,-1.2],b:[0,9,-1.6],parent:"tail1",reach:0},{name:"tail3",a:[0,9,-1.6],b:[0,8.8,-2],parent:"tail2",reach:0},{name:"tail4",a:[0,8.8,-2],b:[0,8.6,-2.4],parent:"tail3",reach:0},{name:"thighL",a:[.95,9.6,0],b:[.95,5.3,0],parent:"pelvis"},{name:"shinL",a:[.95,5.3,0],b:[.95,1.2,0],parent:"thighL"},{name:"footL",a:[.95,1.2,0],b:[.95,.4,1.5],parent:"shinL"},{name:"thighR",a:[-.95,9.6,0],b:[-.95,5.3,0],parent:"pelvis"},{name:"shinR",a:[-.95,5.3,0],b:[-.95,1.2,0],parent:"thighR"},{name:"footR",a:[-.95,1.2,0],b:[-.95,.4,1.5],parent:"shinR"},{name:"armL",a:[2.75,14.4,0],b:[2.75,11.9,0],parent:"spine2"},{name:"forearmL",a:[2.75,11.9,0],b:[2.75,9.5,0],parent:"armL"},{name:"armR",a:[-2.75,14.4,0],b:[-2.75,11.9,0],parent:"spine2"},{name:"forearmR",a:[-2.75,11.9,0],b:[-2.75,9.5,0],parent:"armR"}],R0={y:17.15,a:1.6,b:1.62},xh=3,xi=10,Ud=Math.PI/xi,C0=.38,ua=[{y0:.35,y1:5.2,r0:7.8,r1:5,bone:"pelvis"},{y0:3.9,y1:8.7,r0:7.1,r1:4.4,bone:"pelvis"},{y0:7.3,y1:12,r0:6.3,r1:3.8,bone:"spine1"},{y0:10.6,y1:15,r0:5.4,r1:3.2,bone:"spine2"},{y0:13.5,y1:20,r0:4.7,r1:2.4,bone:"head",flare:1.8,cols:6,rows:20,hole:R0},{y0:19.25,y1:23.7,r0:3.4,r1:.05,bone:"head",flare:1}],w5=9425231,S5=2907158,jp=(n,t)=>n.r1+(n.r0-n.r1)*Math.pow(Math.min(1,Math.max(0,1-t)),n.flare??1.25),E5=n=>{const t=Math.sin(n*127.1+311.7)*43758.5453;return t-Math.floor(t)};function To(n,t){const e=Math.floor(t),i=t-e,s=Ud+e/xi*Math.PI*2,r=Ud+(e+1)/xi*Math.PI*2;return[n*(Math.sin(s)+(Math.sin(r)-Math.sin(s))*i),n*(Math.cos(s)+(Math.cos(r)-Math.cos(s))*i)]}function Zp(n,t,e){const i=jp(n,(e-n.y0)/(n.y1-n.y0));for(let s=0;s<xi;s++){const[r,a]=To(i,s),[o,c]=To(i,s+1);if(a+c>0&&(t-r)*(t-o)<=0&&r!==o)return a+(t-r)/(o-r)*(c-a)}return Math.sqrt(Math.max(0,i*i-t*t))}const Nd=(n,t,e)=>Math.pow(Math.abs(t/n.a)**xh+Math.abs((e-n.y)/n.b)**xh,1/xh),T5=ua.find(n=>n.hole),fa=Zp(T5,0,R0.y)-.3,Uu=.56,Nu=17.4;function A5(n){const t=n.cols??2,e=n.rows??2,i=xi*t,s=n.y1-n.y0,r=[],a=[],o=new vt(w5),c=new vt(S5),l=new vt;for(let d=0;d<=e;d++){const f=1-d/e,p=jp(n,f);for(let v=0;v<=i;v++){let[g,m]=To(p,v/t),_=n.y0+f*s;if(d===e&&v%2===0){const b=v%i,w=.6+.8*E5(b+n.y0*7);_-=C0*w,g*=1.04,m*=1.04}r.push(g,_,m);const x=Math.min(1,Math.max(0,(f-.25)/.4));l.copy(o).lerp(c,x*x*(3-2*x)),a.push(l.r,l.g,l.b)}}const h=[];for(let d=0;d<e;d++)for(let f=0;f<i;f++){const p=d*(i+1)+f,v=p+i+1,g=v+1,m=p+1;h.push(p,v,m,v,g,m)}if(n.hole){const d=n.hole,f=[],p=new Set,v=new Set;for(let g=0;g<h.length;g+=3){const m=[h[g],h[g+1],h[g+2]],_=(r[m[0]*3]+r[m[1]*3]+r[m[2]*3])/3,x=(r[m[0]*3+1]+r[m[1]*3+1]+r[m[2]*3+1])/3;if((r[m[0]*3+2]+r[m[1]*3+2]+r[m[2]*3+2])/3>0&&Nd(d,_,x)<1)for(const w of m)p.add(w);else{f.push(...m);for(const w of m)v.add(w)}}for(const g of p){if(!v.has(g))continue;const m=r[g*3],_=r[g*3+1],x=Nd(d,m,_);if(x<.3)continue;const b=m/x,w=d.y+(_-d.y)/x;r[g*3]=b,r[g*3+1]=w,r[g*3+2]=Zp(n,b,w)}h.length=0,h.push(...f)}const u=new me;return u.setAttribute("position",new re(r,3)),u.setAttribute("color",new re(a,3)),u.setIndex(h),u.computeVertexNormals(),u}const Kp=[[0,-3,.6,2],[0,0,.7,4],[0,2,.55,0],[1,-1,.9,0],[1,1,.6,3],[1,-4,.6,1],[2,-2,.6,1],[2,2,.7,2],[3,-1,.6,4],[3,1,.55,1],[4,-2,.45,1],[4,1,.45,2],[5,-2,.35,0],[5,1,.35,2]],sr=[14165550,2838486,9060304,14699176,15759898],Ao=Kp.map(([n,t,e,i])=>{const s=ua[n],[r,a]=To(s.r0*.99,(t%xi+xi)%xi),o=s.y0-C0*.55;return{bone:s.bone,p:[r,o-e*1.2-.3,a],ci:i}}),_h=Ao.length,Fd=new WeakMap,Jp=n=>{let t=Fd.get(n);return t||(t={uOrnPos:{value:Ao.map(()=>new C(0,-1e4,0))},uOrnCol:{value:Ao.map(()=>new vt(0,0,0))},uOrnR:{value:.2}},Fd.set(n,t)),t};function R5(n){n.name="lime",n.onBeforeCompile=function(t){Object.assign(t.uniforms,Jp(this)),t.vertexShader=t.vertexShader.replace("#include <common>",`#include <common>
 varying vec3 vOrnW;`).replace("#include <project_vertex>",`#include <project_vertex>
 vOrnW = (modelMatrix * vec4(transformed, 1.0)).xyz;`),t.fragmentShader=t.fragmentShader.replace("#include <common>",`#include <common>
        varying vec3 vOrnW; uniform vec3 uOrnPos[${_h}]; uniform vec3 uOrnCol[${_h}]; uniform float uOrnR;`).replace("#include <emissivemap_fragment>",`#include <emissivemap_fragment>
        for (int i = 0; i < ${_h}; i++) {
          vec3 dv = vOrnW - uOrnPos[i];
          float q = dot(dv, dv) / (uOrnR * uOrnR);
          totalEmissiveRadiance += uOrnCol[i] * diffuseColor.rgb * (1.0 / (1.0 + q * 2.5)) * smoothstep(9.0, 2.0, q);
        }`)},n.customProgramCacheKey=()=>"builder-lime-ornaments-v1"}let Ja=null;function C5(){if(Ja)return Ja;const n=document.createElement("canvas");n.width=n.height=64;const t=n.getContext("2d"),e=t.createRadialGradient(32,32,0,32,32,32);return e.addColorStop(0,"rgba(255,255,255,1)"),e.addColorStop(.18,"rgba(255,255,255,0.75)"),e.addColorStop(.45,"rgba(255,255,255,0.22)"),e.addColorStop(1,"rgba(255,255,255,0)"),t.fillStyle=e,t.fillRect(0,0,64,64),Ja=new Qc(n),Ja.colorSpace=rn,Ja}function L5(n){const t=new Map,e=new Set,i=(L,D,k=0,q=0,z=0)=>{L.position.set(k,q,z),L.updateMatrixWorld(!0),L.traverse(it=>{const ut=it;if(!ut.isMesh)return;const gt=ut.material,_t=`${D}|${gt.uuid}|${ut.name}`,At=ut.geometry.index?ut.geometry.toNonIndexed():ut.geometry.clone();for(const ct of Object.keys(At.attributes))ct!=="position"&&ct!=="normal"&&ct!=="color"&&At.deleteAttribute(ct);At.applyMatrix4(ut.matrixWorld);let Ut=t.get(_t);Ut||(Ut={bone:D,mat:gt,name:ut.name,geos:[]},t.set(_t,Ut)),Ut.geos.push(At)})},s=(L,D,k="")=>{e.add(L);const q=new mt(L,D);return q.name=k,q},r=n.std({color:16777215,vertexColors:!0,roughness:.95,metalness:0,flatShading:!0,side:ye,emissive:2771474,emissiveIntensity:1}),a=n.std({color:12894672,emissive:12894672,emissiveIntensity:.05,roughness:.75}),o=n.std({color:1315350,roughness:.5}),c=n.std({color:2236962,roughness:.8}),l=sr.map((L,D)=>{const k=new Xe({color:L,emissive:L,emissiveIntensity:1.2,roughness:.3,metalness:.1});return k.name=`orn-${D}`,k});R5(r);const h=n.std({color:1973794,roughness:.45,metalness:.1}),u=n.std({color:15762972,roughness:.45,metalness:.05}),d=n.std({color:15251514,emissive:16758810,emissiveIntensity:.25,roughness:.25,metalness:.85});for(const L of ua)i(s(A5(L),r),L.bone);const f=new ie(.34,12,8),p=new An(.035,.035,1,4);for(const[L,D,k,q]of Kp){const z=ua[L],[it,ut]=To(z.r0*.99,(D%xi+xi)%xi),gt=z.y0-C0*.55,_t=k*1.2,At=s(p,c);At.scale.y=_t,i(At,z.bone,it,gt-_t/2,ut),i(s(f,l[q],`orn-${q}`),z.bone,it,gt-_t-.3,ut)}const v=sr.map((L,D)=>{const k=new m0({map:C5(),color:L,blending:Ea,depthWrite:!1,transparent:!0,opacity:.85,toneMapped:!1});return k.name=`halo-${D}`,k.userData.keepBlend=!0,k});for(const L of Ao){const D=new yp(v[L.ci]);D.name=`halo-${L.ci}`,D.scale.setScalar(3.2),D.renderOrder=5,n.at(D,L.bone,...L.p)}i(s(new A0(3,3,2.3,3,.8),a),"head",0,R0.y-.05,fa-1.15);const g=(L,D,k,q)=>{n.at(L,"head",D,k,q).traverse(z=>{z.receiveShadow=!1})};for(const L of[1,-1]){const D=new mt(new ie(.16,10,8),o);D.scale.set(1,1.45,.5),D.name=L>0?"eyeL":"eyeR",g(D,L*Uu,Nu,fa+.02);const k=new mt(new be(.74,.16,.1),o);k.rotation.z=L*.38,k.name=L>0?"browL":"browR",g(k,L*.62,17.92,fa+.04)}const m=new mt(new be(.72,.12,.1),o);m.rotation.z=.12,m.name="mouth",g(m,.08,16.5,fa+.03);const _=new we,x=[2.4,2.25,2.45],b=s(new ie(1,24,10,0,Math.PI*2,0,Math.PI/2),h);b.scale.set(...x),_.add(b);const w=.95;for(let L=0;L<4;L++){const D=s(new ie(1,8,6,L*(Math.PI/2)+w/2,Math.PI/2-w,.1*Math.PI,.27*Math.PI),u);D.scale.set(x[0]*1.012,x[1]*1.012,x[2]*1.012),_.add(D)}const E=new bi([new ht(.96,0),new ht(1.08,0),new ht(1.08,.12),new ht(.96,.12),new ht(.96,0)],24),A=s(E,h);A.scale.set(x[0],1,x[2]*1.06),A.position.set(0,-.02,.1),_.add(A);const T=s(new Oa(1,20),n.std({color:2762272,roughness:.9}));T.rotation.x=Math.PI/2,T.scale.set(x[0]*.99,x[2]*.99,1),T.position.y=.01,_.add(T);const M=new b0;for(let L=0;L<8;L++){const D=Math.PI/2+L*Math.PI/4,k=L%2?.24:.85;L?M.lineTo(Math.cos(D)*k,Math.sin(D)*k):M.moveTo(Math.cos(D)*k,Math.sin(D)*k)}const y=new bl(M,{depth:.12,bevelEnabled:!0,bevelThickness:.06,bevelSize:.05,bevelSegments:1}),S=.95,R=s(y,d);R.scale.setScalar(1.5),R.position.set(0,S,x[2]*Math.sqrt(1-(S/x[1])**2)+.02),R.rotation.x=-.45,_.add(R),_.position.y=-.8;const I=new we;I.add(_),I.rotation.set(.12,0,.36,"ZXY"),i(I,"head",0,ua[ua.length-1].y1,0);for(const L of t.values()){const D=n.segs.find(z=>z.name===L.bone).a,k=hs(L.geos);for(const z of L.geos)z.dispose();if(!k)throw new Error(`builder: parts on ${L.bone} would not merge`);k.translate(-D[0],-D[1],-D[2]);const q=new mt(k,L.mat);q.name=L.name,n.at(q,L.bone,D[0],D[1],D[2]),L.mat===a&&(q.receiveShadow=!1)}for(const L of e)L.dispose()}const Od=new WeakMap,P5=sr.map((n,t)=>({rate:1.3+.37*t,ph:t*1.9}));function I5(n,t,e){let i=Od.get(n);if(!i){const a={eyes:[],brows:[],mouth:null,balls:[],halos:[],lime:null,orn:[]},o=new Map,c=new Map;n.traverse(h=>{h.name==="eyeL"||h.name==="eyeR"?a.eyes.push(h):h.name==="browL"||h.name==="browR"?a.brows.push({o:h,y:h.position.y,z:h.rotation.z}):h.name==="mouth"&&(a.mouth=h);const u=h.material;if(u&&!Array.isArray(u)){const d=/^orn-(\d)$/.exec(u.name),f=/^halo-(\d)$/.exec(u.name);d&&o.set(Number(d[1]),u),f&&c.set(Number(f[1]),u),u.name==="lime"&&(a.lime=u)}}),a.balls=sr.map((h,u)=>o.get(u)).filter(Boolean),a.halos=sr.map((h,u)=>c.get(u)).filter(Boolean);const l=new Map;n.traverse(h=>{h.isBone&&l.set(h.name,h)});for(const h of Ao){const u=l.get(h.bone),d=Yp.find(f=>f.name===h.bone).a;u&&a.orn.push({bone:u,local:new C(h.p[0]-d[0],h.p[1]-d[1],h.p[2]-d[2]),ci:h.ci})}Od.set(n,i=a)}const s=P5.map(a=>.55+.45*Math.sin(t*a.rate+a.ph)+.6*Math.max(0,Math.sin(t*a.rate*3.1+a.ph*2)-.85)*6);if(i.balls.forEach((a,o)=>{a.emissiveIntensity=.6+1.6*s[o]}),i.halos.forEach((a,o)=>{a.color.setHex(sr[o]).multiplyScalar(.35+.9*s[o])}),i.lime&&i.orn.length){const a=Jp(i.lime);n.updateMatrixWorld(!0);const o=new C().setFromMatrixScale(n.matrixWorld);a.uOrnR.value=2.4*Math.abs(o.y),i.orn.forEach((c,l)=>{a.uOrnPos.value[l].copy(c.local).applyMatrix4(c.bone.matrixWorld),a.uOrnCol.value[l].setHex(sr[c.ci]).multiplyScalar(1.3*s[c.ci])})}const r=e??null;for(const a of i.eyes)a.scale.y=1.45*(1-.88*(r?a.name==="eyeL"?r.blinkL:r.blinkR:0));for(const a of i.brows)a.o.position.y=a.y+.22*(r?.browUp??0),a.o.rotation.z=a.z*(1-.7*(r?.browUp??0));i.mouth&&(i.mouth.scale.y=1+5*(r?.jaw??0),i.mouth.scale.x=1+.4*(r?.smile??0)-.35*(r?.pucker??0))}const D5={id:"builder",name:"Builder",blurb:"A builder in a Christmas tree costume, tipping his hat",segs:Yp,dress:L5,tick:I5,fit:{size:1,limb:.2},face:{eyes:[[Uu,Nu,fa+.1,.26],[-Uu,Nu,fa+.1,.26]]}},U5=[{name:"pelvis",a:[0,9.6,0],b:[0,10.6,0],parent:null},{name:"spine1",a:[0,10.6,0],b:[0,12.4,.1],parent:"pelvis"},{name:"spine2",a:[0,12.4,.1],b:[0,15,.1],parent:"spine1"},{name:"neck",a:[0,15,.1],b:[0,15.9,.15],parent:"spine2"},{name:"head",a:[0,15.9,.15],b:[0,18.4,.3],parent:"neck"},{name:"jaw",a:[0,16.5,-.3],b:[0,15.55,1],parent:"head",reach:0},{name:"tail1",a:[0,10.4,-1],b:[0,9.6,-1.1],parent:"pelvis",reach:0},{name:"tail2",a:[0,9.6,-1.1],b:[0,8.8,-1.2],parent:"tail1",reach:0},{name:"tail3",a:[0,8.8,-1.2],b:[0,8,-1.3],parent:"tail2",reach:0},{name:"tail4",a:[0,8,-1.3],b:[0,7.2,-1.4],parent:"tail3",reach:0},{name:"thighL",a:[1.1,9.6,0],b:[1.2,5.3,.2],parent:"pelvis"},{name:"shinL",a:[1.2,5.3,.2],b:[1.2,1.1,-.1],parent:"thighL"},{name:"footL",a:[1.2,1.1,-.1],b:[1.2,.35,1.4],parent:"shinL"},{name:"thighR",a:[-1.1,9.6,0],b:[-1.2,5.3,.2],parent:"pelvis"},{name:"shinR",a:[-1.2,5.3,.2],b:[-1.2,1.1,-.1],parent:"thighR"},{name:"footR",a:[-1.2,1.1,-.1],b:[-1.2,.35,1.4],parent:"shinR"},{name:"armL",a:[2.4,14.6,0],b:[2.72,11.9,-.05],parent:"spine2"},{name:"forearmL",a:[2.72,11.9,-.05],b:[2.85,9.45,.4],parent:"armL"},{name:"armR",a:[-2.4,14.6,0],b:[-2.72,11.9,-.05],parent:"spine2"},{name:"forearmR",a:[-2.72,11.9,-.05],b:[-2.85,9.45,.4],parent:"armR"}],Ro=n=>new C(n[0],n[1],n[2]);function Qp(n,t){const e=Ro(t).sub(Ro(n)).normalize(),i=new C(1,0,0).addScaledVector(e,-e.x);i.lengthSq()<1e-6&&i.set(0,0,1),i.normalize();const s=new C().crossVectors(i,e);return new se().makeBasis(i,e,s).setPosition(n[0],n[1],n[2])}const ts=(n,t,e,i,s)=>Ts(n,t,e,i,s,6,5,2);function Ts(n,t,e,i,s,r=12,a=14,o=4){const c=Ro(t).distanceTo(Ro(n)),l=[];for(let u=0;u<=o;u++){const d=-Math.PI/2+u/o*(Math.PI/2);l.push(new ht(Math.max(.001,e*Math.cos(d)),e*.75*Math.sin(d)))}const h=Math.min(.2,1.3*Math.max(e,s)/c);for(let u=1;u<a;u++){const d=u/a,f=i+(e-i)*Math.exp(-((d/h)**2))+(s-i)*Math.exp(-(((1-d)/h)**2));l.push(new ht(f,d*c))}for(let u=0;u<=o;u++){const d=u/o*(Math.PI/2);l.push(new ht(Math.max(.001,s*Math.cos(d)),c+s*.75*Math.sin(d)))}return new bi(l,r).applyMatrix4(Qp(n,t))}function Ne(n,t,e=[1,1,1],i=12){return new ie(t,i,Math.max(6,Math.round(i*.7))).scale(e[0],e[1],e[2]).translate(n[0],n[1],n[2])}function N5(n,t,e=24,i=8){return new ps(new ei(n.map(Ro)),e,t,i,!1)}function Fu(n,t,e=24,i=8){return[N5(n,t,e,i),Ne(n[0],t,[1,1,1],i),Ne(n[n.length-1],t,[1,1,1],i)]}function $n(n){const t=hs(n.map(e=>e.index?e:e.toNonIndexed()),!1);for(const e of n)e.dispose();return t}const F5=n=>[-n[0],n[1],n[2]];function mn(n,t,e,i,s=6e4){const r=M=>(t.max[M]-t.min[M])*e/(e-7),a=M=>t.min[M]-2.5*r(M)/e,o=a(0)+r(0)/2,c=a(1)+r(1)/2,l=a(2)+r(2)/2,h=r(0)/2,u=r(1)/2,d=r(2)/2,f=new zp(e,new ds,!1,!1,s);f.isolation=50;const p=f.field,v=e,g=40;for(let M=0;M<v;M++){const y=l+(2*M/v-1)*d;for(let S=0;S<v;S++){const R=c+(2*S/v-1)*u;for(let I=0;I<v;I++){const L=o+(2*I/v-1)*h;p[M*v*v+S*v+I]=Math.max(0,Math.min(100,50-n(L,R,y)*g))}}}f.update();const m=f.count,_=f.positionArray,x=f.normalArray,b=new Float32Array(m*3),w=new Float32Array(m*3),E=i?new Float32Array(m*3):null,A=new vt;for(let M=0;M<m;M++){const y=o+_[M*3]*h,S=c+_[M*3+1]*u,R=l+_[M*3+2]*d;b[M*3]=y,b[M*3+1]=S,b[M*3+2]=R;let I=x[M*3]/h,L=x[M*3+1]/u,D=x[M*3+2]/d;const k=Math.hypot(I,L,D)||1;I/=k,L/=k,D/=k,w[M*3]=I,w[M*3+1]=L,w[M*3+2]=D,E&&(A.setRGB(1,1,1),i(y,S,R,A),E[M*3]=A.r,E[M*3+1]=A.g,E[M*3+2]=A.b)}f.geometry.dispose();const T=new me;return T.setAttribute("position",new Kt(b,3)),T.setAttribute("normal",new Kt(w,3)),E&&T.setAttribute("color",new Kt(E,3)),T.computeBoundingSphere(),T}const Qa=(n,t,e)=>-B(-n,-t,e),_a=[.43,17.02,1.06],kd=[.43,16.99,.74];function tm(n,t,e,i,s){const r=Math.abs(n),o=e-i,c=s,l=Math.hypot(o,c),h=(r*o+(t-e)*c)/l;return Math.max(h,i-t)}function O5(n,t,e){const i=Math.abs(n);let s=at(n,t,e,0,17.45,-.12,1.1,1.13,1.32);s=B(s,at(n,t,e,0,16.8,-.35,.98,.62,.95),.3),s=B(s,at(n,t,e,0,16.68,.58,.8,.74,.72),.35),s=B(s,at(i,t,e,.78,16.86,.55,.33,.3,.48),.22),s=B(s,K(i,t,e,.86,16.8,.35,.98,16.68,-.42,.15,.13),.15),s=B(s,K(i,t,e,.12,17.32,1.12,.78,17.36,.95,.17,.15),.2),s=Qa(s,-at(i,t,e,1.32,16.95,.05,.38,.5,.55),.18),s=Qa(s,-at(i,t,e,_a[0],_a[1],_a[2],.36,.34,.5),.07);const r=Math.min(tm(n,t,16.86,16.42,.19),Math.hypot(i-.08,t-16.47)-.11);return s=Qa(s,-Math.max(r,.8-e),.04),s=Qa(s,16.08-t,.1),s=Qa(s,-at(i,t,e,.8,16.25,.62,.22,.3,.35),.12),s}function k5(n,t,e,i){const s=Math.abs(n),r=at(s,t,e,_a[0],_a[1],_a[2],.42,.4,.56),a=Math.max(Math.min(tm(n,t,16.86,16.42,.19),Math.hypot(s-.08,t-16.47)-.11),.8-e)-.06,c=Math.max(0,Math.min(1,-Math.min(r,a)/.05))*(.75+.25*Math.max(0,Math.min(1,(1.2-e)/.4)));i.copy(W5).lerp(X5,c),c===0&&i.multiplyScalar(.94+.06*Math.max(0,Math.min(1,(t-16.3)/1.2)))}function B5(n,t,e,i,s,r,a){const o=s-e,c=r-i,l=Math.max(0,Math.min(1,((n-e)*o+(t-i)*c)/(o*o+c*c)));return Math.hypot(n-e-o*l,t-i-c*l)-a}function H5(n,t,e){const i=Math.abs(n);let s=K(i,t,e,0,15.62,1,.5,15.66,.66,.17,.17);return s=B(s,K(i,t,e,.5,15.66,.66,.78,15.74,-.12,.17,.16),.1),s=B(s,Math.max(B5(t,e,15.74,-.14,16.4,-.3,.2),Math.abs(i-.8)-.07),.08),s=B(s,at(i,t,e,.82,16.45,-.3,.15,.11,.13),.06),s=B(s,at(n,t,e,0,15.6,1,.33,.21,.17),.1),s=B(s,K(i,t,e,0,15.8,1.02,.52,15.8,.62,.12,.12),.08),s}function V5(n,t,e){const i=Math.abs(n),s=Math.abs(Math.hypot(i-.25,t-10.95,e-.75)-1.4)-.09;let r=Math.max(s,at(i,t,e,1.2,10.5,-.18,.78,.7,.85));return r=B(r,K(i,t,e,.6,11,-.45,1.55,11.05,.2,.1,.1),.12),r=B(r,at(n,t,e,0,9.95,-.78,.48,.72,.22),.15),r=B(r,K(i,t,e,.38,10.35,-.72,.85,10.4,-.45,.17,.15),.12),r=B(r,K(i,t,e,1.25,10.15,-.15,1,9.62,0,.24,.24),.15),r=B(r,fe(i,t,e,.92,9.6,0,.32),.12),r=Math.min(r,Math.hypot(Math.hypot(t-9.6,e)-.36,i-1)-.1),r=B(r,K(i,t,e,.95,9.48,.28,.12,9.3,.72,.15,.14),.1),r=B(r,K(i,t,e,.12,9.32,.72,.1,9.02,.66,.15,.15),.1),r=B(r,K(i,t,e,1,9.38,-.2,.78,8.92,-.05,.18,.17),.1),r=B(r,K(i,t,e,.78,8.92,-.05,.12,9.04,.62,.13,.12),.1),r}function Mh(n,t,e,i,s){return[new An(t,t*1.08,e,12).translate(n[0],n[1],n[2]),new be(i,e*.42,.18).translate(n[0],n[1]+.02,n[2]-t*.6),new be(.15,e*.55,s).rotateX(.35).translate(n[0],n[1]-.05,n[2]-t-s*.42)]}function Bd(n){const t=[],e=[1.05,1.42,1.64,1.76,1.8,1.74,1.6],i=[.95,1.06,1.12,1.14,1.12,1.06,.96],s=[.32,.48,.62,.72,.8,.85,.85];for(let r=0;r<7;r++){const a=14.55-r*.4,o=e[r],c=.98,l=i[r],h=r>=5,u=[[.26,a+.04,-.78]],d=h?.74*Math.PI:Math.PI-Math.asin(Math.min(.9,.42/o));for(let f=0;f<=7;f++){const p=.14*Math.PI+f/7*(d-.14*Math.PI),v=-Math.cos(p)*(p<Math.PI/2?c:l),g=a-s[r]*Math.pow((p-.14*Math.PI)/(.86*Math.PI),1.3);u.push([o*Math.sin(p),g,v])}if(h){const f=u[u.length-1];u.push([.62,f[1]+.25+(r-5)*.2,1.02],[.26,12.62,1.06])}else u.push([.24,u[u.length-1][1]+.04,l*.98]);t.push(...Fu(u.map(f=>[f[0]*n,f[1],f[2]]),r===0?.13:.12,28,7))}return t}function z5(n,t){const e=Qp(n,[n[0]+t[0],n[1]+t[1],n[2]+t[2]]),i=1.35,s=(u,d,f)=>{const p=new C(u*i,d*i,f*i).applyMatrix4(e);return[p.x,p.y,p.z]},r=[];for(const[u,d,f]of[[0,.1,.16],[0,.1,-.02],[0,.1,-.2],[.02,.3,.2],[.02,.3,0],[.02,.3,-.18]])r.push(Ne(s(u,d,f),.14,[1,1,1],8));const a=[[.21,1],[.07,1.08],[-.07,1],[-.2,.82]];for(const[u,d]of a){const f=s(.02,.4,u*.85),p=s(0,.4+.55*d,u),v=s(-.07,.4+.92*d,u*1.05),g=s(-.17,.4+1.15*d,u*1.08),m=s(-.28,.4+1.3*d,u*1.08);r.push(ts(f,p,.1,.075,.105),ts(p,v,.1,.07,.095),ts(v,g,.09,.065,.085),ts(g,m,.08,.06,.065))}const o=s(0,.25,.26),c=s(-.05,.6,.48),l=s(-.1,.88,.58),h=s(-.16,1.08,.62);return r.push(ts(o,c,.11,.085,.1),ts(c,l,.1,.075,.09),ts(l,h,.09,.065,.065)),r}function G5(){const n=[];n.push(Ne([1.2,.88,0],.27)),n.push(Ne([1.24,.44,-.3],1,[.27,.32,.44]));for(const[r,a,o]of[[.98,.62,.36],[1.22,.62,.34],[1.46,.55,.22],[1.08,.55,.6],[1.32,.52,.56]])n.push(Ne([r,a,o],.17,[1,1,1],8));const t=[.95,1.12,1.28,1.42,1.55],e=[.84,1.08,1.3,1.5,1.68],i=[.1,.075,.07,.065,.065],s=[.42,.34,.3,.27,.24];for(let r=0;r<5;r++){const a=[t[r],.5,.62],o=[e[r],.22,1.38-r*.05];n.push(ts(a,o,i[r]*1.3,i[r],i[r]*1.35));const c=[o[0]+(r===0?-.02:.02*r),.15,o[2]+s[r]];n.push(ts(o,c,i[r]*1.05,i[r]*.8,i[r]*.85))}return n}const em=15656396,W5=new vt(em),X5=new vt(1905164),q5=5832490;function $5(n){const t=n.std({color:em,roughness:.42,metalness:0,emissive:2894368,emissiveIntensity:1}),e=n.std({color:16777215,vertexColors:!0,roughness:.42,metalness:0,emissive:2894368,emissiveIntensity:1}),i=n.std({color:1182214,roughness:.9}),s=n.std({color:0,emissive:q5,emissiveIntensity:1,roughness:1}),r=(f,p,v=t)=>{for(const g of["L","R"]){const m=new mt(f,v);m.name=`skelly-${p}${g}`,g==="R"&&(m.scale.x=-1),n.at(m,p+g,0,0,0)}},a=(f,p,v=t,g=`skelly-${p}`)=>{const m=new mt(f,v);return m.name=g,n.at(m,p,0,0,0),m},o=mn(O5,{min:[-1.25,15.95,-1.5],max:[1.25,18.65,1.4]},52,k5,4e4);a(o,"head",e);const c=$n([Ne(kd,.1,[1,1.1,.7],10),Ne(F5(kd),.1,[1,1.1,.7],10)]);a(c,"head",s,"skelly-embers");const l=(f,p,v,g,m)=>{const _=[];for(let x=0;x<10;x++){const b=-1.05+x/9*2.1;_.push(new yo(.075,p,2,7).scale(1,1,.75).rotateY(b).translate(v*Math.sin(b),f,m+g*Math.cos(b)))}return _};a($n(l(16.15,.17,.6,.78,.47)),"head",t,"skelly-teeth"),a($n([Ne([0,15.98,.8],1,[.58,.24,.4])]),"head",i,"skelly-mouth"),a(mn(H5,{min:[-1,15.36,-.55],max:[1,16.6,1.22]},36,void 0,12e3),"jaw"),a($n(l(15.88,.15,.56,.74,.47)),"jaw",t,"skelly-lowerteeth"),a($n([0,1,2,3].flatMap(f=>Mh([0,15.12+f*.25,-.22],.25,.19,.72,.3))),"neck"),a($n([...[0,1,2,3,4,5].flatMap(f=>Mh([0,12.55+f*.4,-.82],.25,.26,.6,.28)),...Bd(1),...Bd(-1),Ne([0,13.55,1.08],1,[.26,1.05,.12],12),Ne([0,14.42,1],1,[.36,.32,.13],10),...Fu([[.22,14.72,1.02],[.85,14.86,.9],[1.55,14.98,.42],[2.18,15.02,.02]],.13,20,8),...Fu([[-.22,14.72,1.02],[-.85,14.86,.9],[-1.55,14.98,.42],[-2.18,15.02,.02]],.13,20,8),Ne([1.25,13.95,-1],1,[.62,.85,.09],12),Ne([-1.25,13.95,-1],1,[.62,.85,.09],12)]),"spine2"),a($n([0,1,2,3].flatMap(f=>Mh([0,10.85+f*.42,-.42],.36,.3,1.15,.45))),"spine1"),a(mn(V5,{min:[-1.75,8.72,-1.05],max:[1.75,11.2,1.05]},40,void 0,24e3),"pelvis"),r($n([Ne([2.33,14.56,-.03],.36),Ts([2.4,14.45,0],[2.71,12.08,-.05],.3,.2,.28),Ne([2.53,11.98,-.05],.21,[1,.9,1],10),Ne([2.88,11.98,-.06],.2,[1,.9,1],10)]),"arm");const h=[2.72,11.9,-.05],u=[2.85,9.45,.4],d=[u[0]-h[0],u[1]-h[1],u[2]-h[2]];r($n([Ne([2.74,11.98,-.25],.21,[1,1.1,1],10),Ts([2.76,11.85,-.2],[2.86,9.62,.22],.19,.13,.16,10),Ts([2.66,11.72,.12],[2.86,9.62,.54],.16,.13,.21,10),...z5([u[0],u[1]-.05,u[2]],d)]),"forearm"),r($n([Ne([1.12,9.62,.02],.36),Ts([1.12,9.6,0],[1.55,9.24,-.03],.2,.18,.2,10),Ne([1.64,9.3,-.08],.3,[1,1.2,1]),Ts([1.56,9.22,0],[1.22,5.62,.18],.28,.21,.34),Ne([1,5.5,.12],.29),Ne([1.42,5.5,.12],.29)]),"thigh"),r($n([Ts([1.19,5.12,.18],[1.16,1.28,-.08],.36,.18,.24),Ne([1,1.16,-.05],.17,[1,1.2,1],10),Ts([1.52,4.95,.02],[1.47,1.3,-.16],.16,.09,.17,10),Ne([1.2,5.36,.62],.27,[1,1.1,.55])]),"shin"),r($n(G5()),"foot")}const Hd=new WeakMap,Y5={id:"skeleton",name:"Skelly",blurb:"Bones, a grin, and green embers for eyes",segs:U5,dress:$5,fit:{size:1.04,limb:.3},face:{eyes:[[.43,17.02,1.3,.36],[-.43,17.02,1.3,.36]]},tick(n,t,e){let i=Hd.get(n);if(!i){const r=[];n.traverse(a=>{a.name==="skelly-embers"&&r.push(a.material)}),i={jaw:n.getObjectByName("jaw")??null,embers:r},Hd.set(n,i)}const s=.95+.3*Math.sin(t*2.1)+.1*Math.sin(t*7.3+1.1);for(const r of i.embers)r.emissiveIntensity=s;if(i.jaw){const r=t%4.6;i.jaw.rotation.x=e&&e.jaw>.05?.02+.55*e.jaw:r<.75?.05+.07*Math.abs(Math.sin(r*25)):.02}}},j5=[{name:"pelvis",a:[0,9.6,0],b:[0,10.6,0],parent:null},{name:"spine1",a:[0,10.6,0],b:[0,12.4,.1],parent:"pelvis"},{name:"spine2",a:[0,12.4,.1],b:[0,15,.1],parent:"spine1"},{name:"neck",a:[0,15,.1],b:[0,15.9,.15],parent:"spine2",reach:.8},{name:"head",a:[0,15.9,.15],b:[0,18.4,.3],parent:"neck"},{name:"jaw",a:[0,16.4,.9],b:[0,16.4,1.2],parent:"head",reach:0},{name:"tail1",a:[0,14.8,-1.2],b:[0,12.6,-1.4],parent:"spine2",reach:0},{name:"tail2",a:[0,12.6,-1.4],b:[0,10.4,-1.6],parent:"tail1",reach:0},{name:"tail3",a:[0,10.4,-1.6],b:[0,8.2,-1.8],parent:"tail2",reach:0},{name:"tail4",a:[0,8.2,-1.8],b:[0,6.2,-2],parent:"tail3",reach:0},{name:"thighL",a:[1.1,9.6,0],b:[1.2,5.3,.2],parent:"pelvis"},{name:"shinL",a:[1.2,5.3,.2],b:[1.2,1.1,-.1],parent:"thighL"},{name:"footL",a:[1.2,1.1,-.1],b:[1.2,.35,1.4],parent:"shinL"},{name:"thighR",a:[-1.1,9.6,0],b:[-1.2,5.3,.2],parent:"pelvis"},{name:"shinR",a:[-1.2,5.3,.2],b:[-1.2,1.1,-.1],parent:"thighR"},{name:"footR",a:[-1.2,1.1,-.1],b:[-1.2,.35,1.4],parent:"shinR"},{name:"armL",a:[2.5,14.55,0],b:[2.95,11.95,-.05],parent:"spine2"},{name:"forearmL",a:[2.95,11.95,-.05],b:[3.12,9.6,.35],parent:"armL"},{name:"armR",a:[-2.5,14.55,0],b:[-2.95,11.95,-.05],parent:"spine2"},{name:"forearmR",a:[-2.95,11.95,-.05],b:[-3.12,9.6,.35],parent:"armR"}],Z5={min:[-4.2,-.5,-1.9],max:[4.2,17.1,2.3]},K5=[3.12,9.6,.35],nm=(n,t,e)=>K(n,t,e,3.05,10.55,.2,3.16,9,.45,.3,.3);function L0(n,t,e){const i=Math.abs(n);let s=4;if(t>8.4&&(s=at(n,t,e,0,13,.05,1.74,2.15,1.2),s=B(s,at(n,t,e,0,11.35,.15,1.62,1.1,1.12),.5),t>13.2&&(s=B(s,K(i,t,e,0,15,-.05,2.15,14.62,0,.5,.56),.5),s=B(s,Math.hypot(Math.hypot(n,(e+.02)*1.15)-.78,t-15.18)-.2,.12),s=B(s,K(n,t,e,0,14.9,.05,0,15.6,.12,.62,.55),.2)),t<11.6&&(s=B(s,at(n,t,e,0,10.05,0,1.78,1.05,1.15),.4))),t<10.9&&(s=B(s,K(i,t,e,1.08,9.6,0,1.2,5.3,.15,.88,.74),.35),t<6.4&&(s=B(s,K(i,t,e,1.2,5.3,.15,1.22,2.1,-.05,.74,.7),.25))),i>1.5&&t>8.8){const r=K(i,t,e,2.5,14.55,0,2.95,11.95,-.05,.6,.55);s=t>14?B(s,r,.3):Math.min(s,r),t<12.9&&(s=B(s,K(i,t,e,2.95,11.95,-.05,3.08,10,.28,.55,.52),.25),s=Math.max(s,-nm(i,t,e)))}if(t<3.4){const r=B(K(i,t,e,1.22,2.3,-.05,1.22,.6,-.05,.5,.52),Math.max(at(i,t,e,1.22,.5,.55,.58,.5,1.3),-t),.3);s=Math.min(s,r)}return s}const Ou=0,im=1,J5=2,sm=3,Q5=4;function rm(n,t,e){const i=Math.abs(n);return nm(i,t,e)<.06?Q5:t<2.25&&i>.4?J5:t>15.38&&i<.8?sm:i>2.1&&t>9.2||t>10.72?Ou:im}const ty=`
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
  }`;function ey(){const n=new Xe({vertexColors:!0,roughness:.88,metalness:0});return n.onBeforeCompile=t=>{t.vertexShader=t.vertexShader.replace("#include <common>",`#include <common>
 attribute vec3 aCloth; varying vec3 vCloth; varying vec3 vBind; varying vec3 vBindN;`).replace("#include <begin_vertex>",`#include <begin_vertex>
 vBind = position; vBindN = normal; vCloth = aCloth;`),t.fragmentShader=t.fragmentShader.replace("#include <common>",`#include <common>
`+ty).replace("#include <color_fragment>",`#include <color_fragment>
 diffuseColor.rgb = cloth(diffuseColor.rgb, vBind, normalize(vBindN), vCloth);`)},n.customProgramCacheKey=()=>"jack-cloth-v2",n}const je=[0,17.15,.22],ny=1.82,fi=1.38,am=.24;function P0(n,t,e){const i=n-je[0],s=t-je[1],r=e-je[2],a=Math.hypot(i,r),o=Math.atan2(r,i),c=1-Math.sqrt(Math.abs(Math.cos(5*(o-Math.PI/2)))),l=1-.06*c;let h=(Math.hypot(a/l/ny,s/fi)-1)*fi;return h+=.32*Math.exp(-((a/.6)**2))*Math.min(1,Math.abs(s)/fi),{d:h,groove:c}}function Vd(n,t,e,i,s,r,a=0){const o=(i+s)/2,c=Math.cos(a),l=Math.sin(a),h=(n-e)*c-(t-o)*l,u=(n-e)*l+(t-o)*c+o,d=i-s,f=Math.hypot(d,r);return Math.max((Math.abs(h)*d+(u-i)*r)/f,s-u)}const zd=(n,t,e,i,s,r)=>(Math.hypot((n-e)/s,(t-i)/r)-1)*Math.min(s,r),Gd=(n,t,e,i,s,r)=>{const a=Math.abs(n-e)-s,o=Math.abs(t-i)-r;return Math.hypot(Math.max(a,0),Math.max(o,0))+Math.min(Math.max(a,o),0)};function iy(n,t){const e=Math.abs(n);let i=Vd(e,t,.66,.74,.14,.36,-.12);i=Math.min(i,Vd(n,t,0,.1,-.2,.17));let s=Math.max(zd(n,t,0,-.36,1.2,.64),-zd(n,t,0,-.08,1.34,.56));return s=Math.max(s,-Gd(e,t,.32,-.7,.11,.12)),s=Math.max(s,-Gd(n,t,0,-.93,.12,.13)),Math.min(i,s)}function sy(n,t,e){const i=P0(n,t,e).d;let s=Math.max(i,-(i+am));const r=Math.max(iy(n-je[0],t-je[1]),je[2]+.4-e);return s=Math.max(s,-r),s}const ry=new vt(15233038),ay=new vt(10108936),oy=new vt(16757820),cy=new vt(16737290);function ly(n,t,e,i){const{d:s,groove:r}=P0(n,t,e);if(s<-.05){i.copy(oy).lerp(cy,Math.max(0,Math.min(1,(t-je[1]-fi*.2)/(fi*.8))));return}i.copy(ry).lerp(ay,Math.min(1,r*1.3)),i.multiplyScalar(.85+.15*(1-Math.abs(t-je[1])/fi))}function hy(n){const t=n.std({color:16777215,vertexColors:!0,roughness:.5,metalness:0,emissive:16777215,emissiveIntensity:1});return t.onBeforeCompile=e=>{e.vertexShader=e.vertexShader.replace("#include <common>",`#include <common>
 attribute float aGlow; varying float vGlow;`).replace("#include <begin_vertex>",`#include <begin_vertex>
 vGlow = aGlow;`),e.fragmentShader=e.fragmentShader.replace("#include <common>",`#include <common>
 varying float vGlow;`).replace("#include <color_fragment>",`#include <color_fragment>
 vec3 glowHue = diffuseColor.rgb; diffuseColor.rgb *= 1.0 - 0.92 * vGlow;`).replace("#include <emissivemap_fragment>",`#include <emissivemap_fragment>
 totalEmissiveRadiance *= vGlow * glowHue;`)},t.customProgramCacheKey=()=>"jack-shell-v2",t}let Bc=1;const xn=()=>(Bc=Bc*1664525+1013904223>>>0,Bc/4294967296),uy=new C(0,1,0),Wd=[15255146,13937738,15916172,12884540].map(n=>new vt(n));function to(n,t,e,i){const s=new gi(i,e,4,1).translate(0,e/2,0);s.applyQuaternion(new Me().setFromUnitVectors(uy,t.clone().normalize())).translate(n.x,n.y,n.z);const r=Wd[Math.floor(xn()*Wd.length)],a=s.attributes.position.count,o=new Float32Array(a*3);for(let c=0;c<a;c++)o[c*3]=r.r,o[c*3+1]=r.g,o[c*3+2]=r.b;return s.setAttribute("color",new Kt(o,3)),s}function eo(n,t){const e=n.clone().normalize(),i=Math.abs(e.y)<.9?new C(0,1,0):new C(1,0,0),s=new C().crossVectors(e,i).normalize(),r=new C().crossVectors(e,s),a=xn()*Math.PI*2,o=Math.tan(t*Math.sqrt(xn()));return e.addScaledVector(s,Math.cos(a)*o).addScaledVector(r,Math.sin(a)*o).normalize()}function Ji(n){const t=hs(n.map(e=>e.index?e.toNonIndexed():e),!1);for(const e of n)e.dispose();return t}function bh(n,t){let e=0,i=3;for(let s=0;s<30;s++){const r=(e+i)/2;L0(n,t,r)<0?e=r:i=r}return e}function Xd(n,t,e){let i=0,s=3;for(let r=0;r<26;r++){const a=(i+s)/2;L0(Math.cos(t)*a,n,e+Math.sin(t)*a)<0?i=a:s=a}return i}function Rc(n,t,e,i){const s=Math.max(8,Math.round(t*18)),r=new ps(n,s,e,7,i),a=r.attributes.uv,o=a.count,c=new Float32Array(o*3),l=new vt(13150312),h=new vt(9071160),u=new vt;for(let d=0;d<o;d++){const f=.5+.5*Math.sin((a.getX(d)*t*4.5+a.getY(d))*Math.PI*2);u.copy(l).lerp(h,f*f),c[d*3]=u.r,c[d*3+1]=u.g,c[d*3+2]=u.b}return r.setAttribute("color",new Kt(c,3)),r}function fy(n){Bc=7;const t=n.bones.get("pelvis").parent;if(t?.isSkinnedMesh){const ct=t.geometry.attributes.position,G=new Float32Array(ct.count*3);for(let J=0;J<ct.count;J++){const H=rm(ct.getX(J),ct.getY(J),ct.getZ(J));G[J*3]=H===Ou?1:0,G[J*3+1]=H===im?1:0,G[J*3+2]=H===sm?1:0}t.geometry.setAttribute("aCloth",new Kt(G,3)),t.material.dispose(),t.material=ey()}const e=n.std({color:16777215,vertexColors:!0,roughness:.75,metalness:0}),i=n.std({color:16777215,vertexColors:!0,roughness:.9,metalness:0}),s=(ct,G,J,H)=>{for(const W of["L","R"]){const V=new mt(ct,J);V.name=`jack-${H}${W}`,W==="R"&&(V.scale.x=-1),n.at(V,G+W,0,0,0)}},r=mn(sy,{min:[-1.92,je[1]-fi-.05,je[2]-1.92],max:[1.92,je[1]+fi+.05,je[2]+1.92]},48,ly,4e4),a=r.attributes.position,o=new Float32Array(a.count);for(let ct=0;ct<a.count;ct++)o[ct]=Math.max(0,Math.min(1,-P0(a.getX(ct),a.getY(ct),a.getZ(ct)).d/.16));r.setAttribute("aGlow",new Kt(o,1));const c=new mt(r,hy(n));c.name="jack-pumpkin",n.at(c,"head",0,0,0);const l=je[1]-fi+am+.3,h=new we;h.name="jack-flame";const u=new mt(Ji([new ie(.15,10,8).scale(1,1.1,1).translate(0,.15,0),new gi(.148,.42,10,1,!0).translate(0,.36,0)]),n.std({color:0,emissive:16762976,emissiveIntensity:2.4}));u.name="jack-flamecore",h.add(u),n.at(h,"head",0,l,je[2]-.15);const d=je[1]+fi-.22,f=new An(.16,.26,1.5,7,8).translate(0,.75,0);{const ct=f.attributes.position;for(let G=0;G<ct.count;G++){const J=ct.getY(G)/1.5,H=1+.6*Math.max(0,1-J*5);ct.setXYZ(G,ct.getX(G)*H+.5*J*J,ct.getY(G),ct.getZ(G)*H-.1*J*J)}f.computeVertexNormals()}n.at(new mt(f.translate(0,d,je[2]-.05),n.std({color:5990956,roughness:.85})),"head",0,0,0);const p=n.std({color:4863526,roughness:.95,side:ye}),v=[];for(let ct=0;ct<=10;ct++){const G=1.08+ct/10*1.12;v.push(new ht(G,-.22*((G-1.08)/1.12)**2))}const g=[];for(let ct=0;ct<=10;ct++){const G=ct/10;g.push(new ht(1.1-.24*G-(G>.85?(G-.85)*3.6:0),G*1.2))}const m=Ji([new bi(v,28),new bi(g,28)]);{const ct=m.attributes.position;for(let G=0;G<ct.count;G++){const J=ct.getX(G),H=ct.getY(G),W=ct.getZ(G),V=H>.7?.2*Math.exp(-((J/.5)**2))*Math.max(0,W):0;ct.setXYZ(G,J,H-.07*Math.max(0,J)*Math.max(0,Math.hypot(J,W)-1.08)-V*.6,W-V)}m.computeVertexNormals()}const _=new zn(1.07,.08,6,28).rotateX(Math.PI/2).scale(1,2.4,1).translate(0,.2,0),x=new we;x.add(new mt(m,p),new mt(_,n.std({color:1971986,roughness:.8}))),x.rotation.set(-.08,0,-.2),n.at(x,"head",.08,je[1]+fi-.1,je[2]-.1);const b=[];for(let ct=0;ct<34;ct++){const G=ct/34*Math.PI*2+xn()*.15,J=.72,H=new C(Math.cos(G)*J,15.3+xn()*.1,Math.sin(G)*J*.9),W=eo(new C(Math.cos(G)*.9,.7,Math.sin(G)*.9),.35);b.push(to(H,W,.45+xn()*.5,.05))}const w=new mt(Ji(b),e);w.name="jack-collar",n.at(w,"spine2",0,0,0);const E=new C(2.95,11.95,-.05),A=new C(...K5),T=A.clone().sub(E).normalize(),M=[];for(let ct=0;ct<46;ct++){const G=xn()*Math.PI*2,J=.26*Math.sqrt(xn()),H=new C(Math.cos(G)*J,0,Math.sin(G)*J),W=A.clone().addScaledVector(T,.55).add(H);M.push(to(W,eo(T.clone().addScaledVector(H,1.4),.3),.8+xn()*.9,.055))}s(Ji(M),"forearm",e,"hand");const y=[];for(let ct=0;ct<26;ct++){const G=ct/26*Math.PI*2+xn()*.2,J=new C(1.22+Math.cos(G)*.62,2.2+xn()*.12,-.05+Math.sin(G)*.62);y.push(to(J,eo(new C(Math.cos(G),-1.1,Math.sin(G)),.3),.4+xn()*.45,.05))}s(Ji(y),"shin",e,"ankle");const S=[];for(let ct=0;ct<14;ct++){const G=ct/14*Math.PI*2,J=Xd(15.62,G,.1)+.04;S.push(new C(Math.cos(G)*J,15.62,.1+Math.sin(G)*J))}n.at(new mt(Rc(new ei(S,!0),3.6,.09,!0),i),"neck",0,0,0);const R=10.72,I=[];for(let ct=0;ct<24;ct++){const G=ct/24*Math.PI*2,J=Xd(R,G,.05)+.06;I.push(new C(Math.cos(G)*J,R,.05+Math.sin(G)*J))}const L=new ei(I,!0),D=.55,k=bh(D,R)+.1,q=new ei([new C(D,R-.05,k),new C(D+.12,R-.6,k+.12),new C(D+.05,R-1.25,k+.08)]),z=new ei([new C(D,R-.05,k),new C(D-.12,R-.5,k+.14),new C(D-.02,R-1,k+.1)]),it=[];for(const ct of[q,z]){const G=ct.getPoint(1);for(let J=0;J<7;J++)it.push(to(G,eo(new C(0,-1,.1),.35),.22+xn()*.2,.035))}const ut=new ie(.22,10,8).scale(1.2,.9,.8).translate(D,R,k),gt=new Float32Array(ut.attributes.position.count*3),_t=new vt(11571288);for(let ct=0;ct<gt.length;ct+=3)gt[ct]=_t.r,gt[ct+1]=_t.g,gt[ct+2]=_t.b;ut.setAttribute("color",new Kt(gt,3)),n.at(new mt(Ji([Rc(L,11,.13,!0),Rc(q,1.3,.1,!1),Rc(z,1,.1,!1),ut]),i),"pelvis",0,0,0),n.at(new mt(Ji(it),e),"pelvis",0,0,0);const At=[],Ut=[];for(const ct of[14.25,13.45,12.65]){const G=bh(.13,ct);At.push(new An(.12,.12,.07,10).rotateX(Math.PI/2).translate(.13,ct,G+.02))}for(let ct=0;ct<5;ct++)Ut.push(to(new C(.13,13.05,bh(.13,13.05)-.05),eo(new C(.4,.3,1),.4),.35+xn()*.25,.035));n.at(new mt(Ji(At),n.std({color:2759698,roughness:.5})),"spine2",0,0,0),n.at(new mt(Ji(Ut),e),"spine2",0,0,0)}const dy=(n,t,e,i)=>n.name.startsWith("thigh")?i>-1.6&&e<n.a[1]+.8&&Math.abs(Math.abs(t)-Math.abs(n.a[0]))<(e<n.a[1]+.3?1.3:.9):n.name.startsWith("arm")||n.name.startsWith("forearm")?Math.abs(t)>(e<12?2.2:e<14.1?1.88:2.1):!0,qd=new WeakMap,py={id:"pumpkin",name:"Jack",blurb:"A scarecrow with a candle-lit pumpkin head",segs:j5,body:{sdf:L0,region:rm,box:Z5,palette:[9181716,2307418,3810326,11044954,1708556],surface:"soft",weights:"sharp",capture:dy},dress:fy,fit:{size:1.08,limb:.6},face:{eyes:[[.66,17.75,2.02,.38],[-.66,17.75,2.02,.38]]},res:76,tick(n,t,e){let i=qd.get(n);if(!i){const o=[],c=[];n.traverse(l=>{l.name==="jack-pumpkin"&&o.push(l.material),l.name==="jack-flamecore"&&c.push(l.material)}),i={shell:o,core:c,flame:n.getObjectByName("jack-flame")??null},qd.set(n,i)}const s=.5*Math.sin(t*1.7)+.3*Math.sin(t*7.9+1.3)+.22*Math.sin(t*13.3+.4)+.15*Math.sin(t*23.7+2.2),r=Math.max(0,Math.sin(t*.83+.5)-.92)*6,a=Math.max(.35,1+.36*s-r)*(1+1.3*(e?.jaw??0));for(const o of i.shell)o.emissiveIntensity=a;for(const o of i.core)o.emissiveIntensity=2.4*a;i.flame&&(i.flame.scale.set(1-.08*s,a*(1+.12*Math.sin(t*17)),1-.08*s),i.flame.rotation.z=.12*Math.sin(t*5.3))}},Co=[1.2,7.9,0],Un=[1.32,4.5,.15],Nn=[1.32,1.35,-.1],$d=[1.32,1,2],Ls=[2.55,12.1,0],pn=[3.4,9.7,-.1],ci=[3.95,7.4,.15],us=9.4,hr=6.1,nl=2.9,Ti=n=>[-n[0],n[1],n[2]],Ce=[0,13.6,.25],yh=[1.9,1.95,1.8],En=1.1,wl=n=>[Ce[0]+(n[0]-Ce[0])*En,Ce[1]+(n[1]-Ce[1])*En,Ce[2]+(n[2]-Ce[2])*En],fn=[.88,14.55,1.5],sn=[.5,.62,.44],Lo=[0,13.2,1.3],il=n=>Lo[1]-.13*(n-Lo[2]),$r=wl(fn),Yd=sn[0]*En,my=wl(Lo),gy=[{name:"pelvis",a:[0,7.9,0],b:[0,8.9,0],parent:null},{name:"spine1",a:[0,8.9,0],b:[0,10.3,.05],parent:"pelvis"},{name:"spine2",a:[0,10.3,.05],b:[0,11.5,.05],parent:"spine1"},{name:"neck",a:[0,11.5,.05],b:[0,11.9,.1],parent:"spine2"},{name:"head",a:[0,11.9,.1],b:[0,15.3,.4],parent:"neck"},{name:"jaw",a:my,b:wl([0,12.85,3.75]),parent:"head",reach:0},{name:"tail1",a:[0,6.5,-1.2],b:[0,6,-2],parent:"pelvis",reach:1.3},{name:"tail2",a:[0,6,-2],b:[0,5.6,-2.6],parent:"tail1",reach:1.2},{name:"tail3",a:[0,5.6,-2.6],b:[0,5.35,-3],parent:"tail2",reach:1},{name:"tail4",a:[0,5.35,-3],b:[0,5.2,-3.3],parent:"tail3",reach:.9},{name:"thighL",a:Co,b:Un,parent:"pelvis"},{name:"shinL",a:Un,b:Nn,parent:"thighL"},{name:"footL",a:Nn,b:$d,parent:"shinL"},{name:"thighR",a:Ti(Co),b:Ti(Un),parent:"pelvis"},{name:"shinR",a:Ti(Un),b:Ti(Nn),parent:"thighR"},{name:"footR",a:Ti(Nn),b:Ti($d),parent:"shinR"},{name:"armL",a:Ls,b:pn,parent:"spine2"},{name:"forearmL",a:pn,b:ci,parent:"armL"},{name:"armR",a:Ti(Ls),b:Ti(pn),parent:"spine2"},{name:"forearmR",a:Ti(pn),b:Ti(ci),parent:"armR"}],vy={min:[-4.6,.5,-3.8],max:[4.6,18.3,2.5]},Fn=(n,t,e)=>{const i=Math.min(1,Math.max(0,(e-n)/(t-n)));return i*i*(3-2*i)},jn=(n,t,e)=>{const i=Math.sin(n*127.1+t*311.7+e*74.7)*43758.5453;return i-Math.floor(i)};function xy(n,t,e){const i=Math.floor(n),s=Math.floor(t),r=Math.floor(e),a=n-i,o=t-s,c=e-r,l=a*a*(3-2*a),h=o*o*(3-2*o),u=c*c*(3-2*c),d=(f,p,v)=>f+(p-f)*v;return d(d(d(jn(i,s,r),jn(i+1,s,r),l),d(jn(i,s+1,r),jn(i+1,s+1,r),l),h),d(d(jn(i,s,r+1),jn(i+1,s,r+1),l),d(jn(i,s+1,r+1),jn(i+1,s+1,r+1),l),h),u)}function om(n,t,e){if(t<6.5)return 7.3-t;if(t>13.4)return t-12.6;const i=Math.abs(n);let s=at(n,t,e,0,10,.1,1.85,2.4,1.5);return s=B(s,at(n,t,e,0,10.8,.4,1.5,1.25,1.2),.6),s=B(s,at(n,t,e,0,11.45,0,2,1,1.35),.7),s=B(s,fe(i,t,e,2.25,11.85,0,.68),.5),B(s,at(n,t,e,0,8.3,-.1,1.6,1,1.35),.6)}function cm(n,t,e){return t>us+.6||t<hr-.6?Math.max(t-us,hr-t):Math.max(lm(n,t,e),t-us,hr-t)}function lm(n,t,e){const i=Math.min(1,Math.max(0,(us-t)/(us-hr))),s=1-(1-i)*(1-i),r=1+.025*s*Math.cos(Math.atan2(n,e)*12),a=(1.7+.8*s)*r,o=(1.42+.72*s)*r,c=.05-.1*s;return(Math.hypot(n/a,(e-c)/o)-1)*Math.min(a,o)}const _y=[[0,.25,2.1,.45],[.42,.05,1.6,.55],[-.42,.05,1.6,.55],[.22,-.4,1.75,.85],[-.22,-.4,1.75,.85]];function My(n,t,e){const i=Math.abs(n);let s=at(n,t,e,Ce[0],Ce[1],Ce[2],yh[0],yh[1],yh[2]);if(s=B(s,at(i,t,e,.9,13,.7,1.05,.9,1),.5),t>14.6)for(const[r,a,o,c]of _y)s=B(s,K(n,t,e,r*.5,15,a,r*1.4,15.2+o,a-c,.45,.08),.4);return Math.max(s,-at(i,t,e,fn[0],fn[1],fn[2],sn[0]+.05,sn[1]+.05,sn[2]+.05))}const by=(n,t,e,i)=>i(Ce[0]+(n-Ce[0])/En,Ce[1]+(t-Ce[1])/En,Ce[2]+(e-Ce[2])/En)*En;function hm(n,t,e){return t<10.6?11.4-t:by(n,t,e,My)}function um(n,t,e){if(n<1)return 1.7-n;if(t>13.4)return t-12.8;if(t<4.6)return 5.2-t;let i=K(n,t,e,...Ls,...pn,.6,.56);const s=1.75;i=B(i,K(n,t,e/s,pn[0],pn[1],pn[2]/s,ci[0],ci[1],ci[2]/s,.5,.4),.45);for(let r=0;r<4;r++){const a=-.75+r*.5,o=1.2+.35*(1-Math.abs(a)/.75);i=B(i,K(n,t,e,ci[0]-.05,ci[1]+.5,a*.8+.1,ci[0]+.12,ci[1]-o,a*1.1+.15,.32,.12),.25)}return i}function fm(n,t,e){if(t>9.4)return t-8.7;if(n>3)return n-2.1;let i=K(n,t,e,...Co,...Un,.75,.55);return i=B(i,fe(n,t,e,...Un,.57),.3),B(i,K(n,t,e,...Un,...Nn,.53,.42),.3)}function dm(n,t,e){if(e>0)return e+.85;if(t>7.6)return t-6.9;let i=1e9;for(const s of[-1,0,1]){const r=1-Math.abs(s);i=B(i,K(n,t,e,s*.25,6.5,-1.2,s*.7,5.4-r*.2,-3-r*.3,.38,.14),.3)}return i}function yy(n,t,e){const i=Math.abs(n);let s=B(om(n,t,e),hm(n,t,e),.8);return s=B(s,fm(i,t,e),.55),s=B(s,um(i,t,e),.05+.5*Fn(10.9,11.8,t)),Math.min(s,cm(n,t,e),dm(n,t,e))}const as=0,ur=1,Po=2,Io=3,Ma=4,sl=5,Pi=new Float64Array(6);let jd=NaN,Zd=NaN,Kd=NaN,rl=0;function Sl(n,t,e){if(n===jd&&t===Zd&&e===Kd)return rl;const i=Math.abs(n);Pi[as]=om(n,t,e),Pi[ur]=cm(n,t,e),Pi[Po]=hm(n,t,e),Pi[Io]=um(i,t,e),Pi[Ma]=fm(i,t,e),Pi[sl]=dm(n,t,e);let s=0;for(let r=1;r<6;r++)Pi[r]<Pi[s]&&(s=r);return jd=n,Zd=t,Kd=e,rl=s,s}const wy=.25,cn=n=>Pi[n]<=Pi[rl]+wy,Sy=(n,t,e,i)=>{Sl(t,e,i);const s=n.name,r=s.endsWith("L")?1:s.endsWith("R")?-1:0;return r!==0&&t*r<-.05?!1:s==="pelvis"?cn(as)||cn(ur)||cn(sl)||cn(Ma):s==="spine1"?cn(as)||cn(ur):s==="spine2"?cn(as):s==="neck"?cn(as)||cn(Po):s==="head"?cn(Po):s==="jaw"||s.startsWith("foot")?!1:s.startsWith("tail")?cn(sl):s.startsWith("arm")||s.startsWith("forearm")?cn(Io)&&(rl===Io||e>11.3):s.startsWith("shin")?cn(Ma):s.startsWith("thigh")?cn(Ma)?!0:cn(ur)&&i>-.4&&e<Co[1]+.8&&Math.abs(Math.abs(t)-Co[0])<1.35:!0},pm=12166120,Ey=14998264,Ty=1578014,Ay=10126548,mm=16053239,gm=1315352,ku=(n,t)=>(t>0?11.2+.55*Fn(.15,1,n):11.65)-.6*Fn(1.35,1.9,n),Ry=new vt(mm),Jd=new vt(gm),Cy=new vt(pm).multiplyScalar(1/1.6),Ly=(n,t,e)=>1-Fn(t-e,t+e,Math.abs(n));function Py(n,t,e,i,s){s.copy(Ry),n===as&&s.lerp(Cy,Fn(ku(Math.abs(t),i)-.05,ku(Math.abs(t),i)+.08,e)),s.lerp(Jd,Ly(e-(us-.15),.27,.08)),n===ur&&s.lerp(Jd,(1-Fn(hr+.4,hr+.56,e))*(lm(t,e,i)>-.12?1:0))}function Qd(n,t,e){const s=Math.floor(n/.8),r=Math.floor(t/(.8*1.4)),a=Math.floor(e/.8);for(let o=-1;o<=1;o++)for(let c=-1;c<=1;c++)for(let l=-1;l<=1;l++){const h=s+c,u=r+o,d=a+l;if(jn(h,u,d)>.45)continue;const f=(h+.2+.6*jn(h+7,u,d))*.8,p=(u+.2+.6*jn(h,u+7,d))*.8*1.4,v=(d+.2+.6*jn(h,u,d+7))*.8;if(((n-f)/.44)**2+((t-p)/.75)**2+((e-v)/.44)**2<1)return!0}return!1}function vm(n,t,e){const i=Math.abs(n),s=Sl(n,t,e);if(s===ur)return t<hr+.48||t>us-.45?3:2;if(s===as){const r=ku(i,e);return t>r+.3?t>11.2&&i>1.5&&Qd(n,t,e)?1:0:t>r-.05?2:t<us+.12&&t>us-.42?3:2}if(s===Po){const r=Ce[1]+(t-Ce[1])/En,a=Ce[2]+(e-Ce[2])/En;return r>15.2||r>14.2&&a<-.6?5:0}if(s===Io){if(t<6.6)return 6;const r=t>pn[1]?Ls[0]+(pn[0]-Ls[0])*(Ls[1]-t)/(Ls[1]-pn[1]):pn[0]+(ci[0]-pn[0])*Math.min(1,(pn[1]-t)/(pn[1]-ci[1]));return i-r>-.25&&Qd(n,t,e)?1:0}return s===Ma&&t<nl-.05?4:0}function Iy(n,t,e){const i=vm(n,t,e);if(i===2||i===3||i===4)return 0;const s=Sl(n,t,e),r=Math.abs(n),a=.6+.8*xy(n*1.4+3.1,t*1.4,e*1.4);let o=1;if(s===Po){const c=r/En,l=Ce[1]+(t-Ce[1])/En,h=Ce[2]+(e-Ce[2])/En,u=Math.hypot((c-fn[0])/sn[0],(l-fn[1])/sn[1],(h-fn[2])/sn[2]);if(u<1.5||h>.95&&c<1.15&&l<13.95&&l>12.2)return 0;const d=Fn(.2,1.2,h)*(1-Fn(1,1.6,c))*(1-Fn(15.2,15.6,l));o=.3*Math.min(1,(u-1.5)/.8)*d+1.3*(1-d),l>15.2?o=1.5:l<12.6&&h>.3&&(o=Math.min(o,.25))}else if(s===as)o=(t>11?1.25:.9)*(e>0?1-.55*(1-Fn(.5,1.2,r)):1);else if(s===Io){const c=Fn(-.4,.4,-e)*.4+Fn(-.2,.3,Ls[0]+.6-r)*.4;o=(t<7.2?1.3:1)+c}else s===Ma?o=t<nl+.7?1.25:.9:s===sl&&(o=1.2);return i===1&&(o*=1.2),o*a}const xm=(n,t,e)=>B(K(n/1.5,t,e,0,13.55,1.2,0,13.05,3.85,.7,.4)*.88,K(n/1.3,t,e,0,13.85,1,0,13.5,2.7,.42,.32),.4),Dy=(n,t,e)=>Math.max(xm(n,t,e),il(e)-t),_m=(n,t,e)=>K(n/1.42,t,e,0,13.1,1.2,0,12.8,3.65,.55,.32)*.9,Uy=(n,t,e)=>Math.max(_m(n,t,e),t-il(e)+.03),Ny=new vt(4211536),Fy=new vt(8817306),Bu=5903396,Oy=13130354,t1=n=>(t,e,i,s)=>{const r=(n?_m:xm)(Math.abs(t)+.09,e,i)<0&&i<3.6;!n&&r&&e<il(i)+.05?s.setHex(Bu):n&&r&&e>il(i)-.08?s.setHex(Math.abs(t)<.35&&i>1.7?Oy:Bu):s.copy(Ny).lerp(Fy,Fn(2.9,4.1,i))};function ky(n,t,e){const i=Nn[1];let s=Math.max(at(n,t,e,0,.32-i,.65,.84,.4,1.72),-(t+i));return s=B(s,at(n,t,e,0,.78-i,.55,.74,.6,1.5),.2),s=B(s,at(n,t,e,0,.62-i,1.5,.7,.46,.85),.25),s=B(s,K(n,t,e,0,.95-i,-.2,0,1.4-i,-.15,.62,.6),.3),Math.max(s,-K(n,t,e,0,1.4-i,-.15,0,3-i,-.15,.47,.47))}function By(n,t,e,i){const s=t+Nn[1];s<.42||e>1.75&&s<.9?i.setHex(16448252):Math.abs(n)<.3&&e>.25&&e<1.55&&s>1?i.setHex(16777215):Math.abs(s-.47)<.05?i.setHex(12105924):i.setHex(14474468)}function Hy(){const e=new Uint8Array(65536);for(let s=0;s<128;s++)for(let r=0;r<128;r++){const a=(s+.5)/128,o=(r+.5)/128*Math.PI*2,h=((a*2.6-.38*Math.abs(Math.sin(o)))%.85+.85)%.85<.4&&a<.84;e.set(h?[168,142,224,255]:[246,244,250,255],(s*128+r)*4)}const i=new xa(e,128,128,Je);return i.colorSpace=rn,i.wrapS=Ca,i.magFilter=Re,i.minFilter=Cs,i.generateMipmaps=!0,i.needsUpdate=!0,i}function no(n,t,e,i="head"){t.scale.multiplyScalar(En);const s=wl(e);n.at(t,i,s[0],s[1],s[2])}function Vy(n){const t=n.std({color:16514047,roughness:.15}),e=n.std({color:2761284,roughness:.1}),i=n.std({color:328712,roughness:.06}),s=n.std({color:1314840,roughness:.5}),r=n.std({color:16777215,emissive:16777215,emissiveIntensity:.8,roughness:.2});for(const A of[1,-1]){const T=new we;T.scale.set(1,sn[1]/sn[0],sn[2]/sn[0]),T.add(new mt(new ie(sn[0],22,16),t));const M=new we;M.rotation.set(.12,-A*.14,0);for(const[R,I,L]of[[e,.012,.62],[i,.02,.3]]){const D=new mt(new ie(sn[0]+I,22,6,0,Math.PI*2,0,L),R);D.rotation.x=Math.PI/2,M.add(D)}const y=new mt(new ie(.07,8,6),r);y.position.set(A*.1,.12,sn[0]+.02),M.add(y),T.add(M);const S=new mt(new zn(sn[0]+.01,.055,6,24,Math.PI*.8),s);S.rotation.set(.45,0,Math.PI*.1),T.add(S),no(n,T,[A*fn[0],fn[1],fn[2]])}const a=n.std({color:14263361,roughness:.32,metalness:.65}),o=.76,c=fn[2]+sn[2]+.14,l=.3,h=new we;for(const A of[1,-1]){const T=new mt(new zn(o,.12,12,48),a);T.rotation.y=A*l,T.position.set(A*fn[0],0,c),h.add(T);const M=new C(A*(fn[0]+o*Math.cos(l)),.05,c-o*Math.sin(l)),y=new C(A*1.84,.05,-.2),S=new mt(new An(.07,.07,M.distanceTo(y),8),a);S.quaternion.setFromUnitVectors(new C(0,1,0),y.clone().sub(M).normalize()),S.position.copy(M).add(y).multiplyScalar(.5),h.add(S)}const u=new mt(new zn(fn[0]-o*Math.cos(l),.1,8,16,Math.PI),a);u.position.set(0,.05,c+o*Math.sin(l)),h.add(u),no(n,h,[0,fn[1],0]);const d=n.std({vertexColors:!0,roughness:.55,metalness:.02}),f=new mt(mn(Dy,{min:[-1.15,12.45,.9],max:[1.15,14.35,4.35]},34,t1(!1),12e3),d);f.position.set(-0,-13.6,-.25);const p=new mt(mn(Uy,{min:[-.85,12.45,.9],max:[.85,13.25,4]},30,t1(!0),1e4),d);p.position.set(-0,-13.6,-.25);const v=new we;v.add(f),no(n,v,Ce);const g=new we;g.add(p),no(n,g,Ce,"jaw");const m=new mt(new ie(1,16,10),n.std({color:Bu,roughness:.6}));m.scale.set(.6,.36,.55),no(n,m,[0,Lo[1]-.05,Lo[2]+.35]);const _=new Xe({map:Hy(),roughness:.85,side:ye}),x=1.2,b=A=>Un[2]+(Nn[2]-Un[2])*(Un[1]-A)/(Un[1]-Nn[1]);for(const[A,T]of[["shinL",1],["shinR",-1]]){const M=new C(T*Un[0],x,b(x)),y=new C(T*Un[0],nl,b(nl)),S=new mt(new An(.6,.53,M.distanceTo(y),40,1,!0),_);S.quaternion.setFromUnitVectors(new C(0,1,0),y.clone().sub(M).normalize());const R=M.add(y).multiplyScalar(.5);n.at(S,A,R.x,R.y,R.z)}const w=mn(ky,{min:[-.95,-Nn[1]-.05,-1.2],max:[.95,.75,2.45]},26,By,1e4),E=n.std({vertexColors:!0,roughness:.55});for(const[A,T]of[["footL",1],["footR",-1]])n.at(new mt(w,E),A,T*Nn[0],Nn[1],Nn[2])}const zy={id:"violet",name:"Violet",blurb:"The Valkyries’ lavender raven, in gold glasses",segs:gy,body:{sdf:yy,region:vm,box:vy,palette:[pm,Ty,mm,gm,16184570,Ey,Ay],surface:"soft",capture:Sy,fur:{length:1,density:4.5,tip:.3},furLen:Iy,tint(n,t,e,i,s){const r=Sl(t,e,i);(n===2||n===3)&&(r===as||r===ur)&&Py(r,t,e,i,s),n>=2&&n<=4&&s.multiplyScalar(1.6),n!==2&&n!==3&&i<-.6&&s.multiplyScalar(1-.12*Math.min(1,(-.6-i)/1.5))}},dress:Vy,fit:{size:1.1,limb:.55},idle:{tail:.12},face:{jaw:.45,eyes:[[$r[0],$r[1],$r[2],Yd],[-$r[0],$r[1],$r[2],Yd]]},res:72,furShells:9},Mm=[{name:"pelvis",a:[0,9.6,0],b:[0,10.6,0],parent:null},{name:"spine1",a:[0,10.6,0],b:[0,12.4,.1],parent:"pelvis"},{name:"spine2",a:[0,12.4,.1],b:[0,15,.1],parent:"spine1"},{name:"neck",a:[0,15,.1],b:[0,15.9,.15],parent:"spine2",reach:.8},{name:"head",a:[0,15.9,.15],b:[0,18.4,.3],parent:"neck"},{name:"jaw",a:[0,16.4,.9],b:[0,16.4,1.2],parent:"head",reach:0},{name:"tail1",a:[0,14.8,-1.2],b:[0,12.6,-1.4],parent:"spine2",reach:1},{name:"tail2",a:[0,12.6,-1.4],b:[0,10.4,-1.6],parent:"tail1",reach:1},{name:"tail3",a:[0,10.4,-1.6],b:[0,8.2,-1.8],parent:"tail2",reach:1},{name:"tail4",a:[0,8.2,-1.8],b:[0,6.2,-2],parent:"tail3",reach:1},{name:"thighL",a:[1.1,9.6,0],b:[1.2,5.3,.2],parent:"pelvis"},{name:"shinL",a:[1.2,5.3,.2],b:[1.2,1.1,-.1],parent:"thighL"},{name:"footL",a:[1.2,1.1,-.1],b:[1.2,.35,1.4],parent:"shinL"},{name:"thighR",a:[-1.1,9.6,0],b:[-1.2,5.3,.2],parent:"pelvis"},{name:"shinR",a:[-1.2,5.3,.2],b:[-1.2,1.1,-.1],parent:"thighR"},{name:"footR",a:[-1.2,1.1,-.1],b:[-1.2,.35,1.4],parent:"shinR"},{name:"armL",a:[2.4,14.6,0],b:[2.72,11.9,-.05],parent:"spine2"},{name:"forearmL",a:[2.72,11.9,-.05],b:[2.85,9.45,.4],parent:"armL"},{name:"armR",a:[-2.4,14.6,0],b:[-2.72,11.9,-.05],parent:"spine2"},{name:"forearmR",a:[-2.72,11.9,-.05],b:[-2.85,9.45,.4],parent:"armR"}],Gy={min:[-4.2,-.4,-2.8],max:[4.2,20.4,2.6]};function Wy(n,t,e,i){const s=Math.abs(n),r=1-.08*i;let a=at(n,t,e,0,13.35,.1,1.8*r,1.95,1.05*r);return a=B(a,at(s,t,e,.85*r,13.75,.75,.95*r,.68,.5),.45),a=B(a,at(n,t,e,0,13.75,-.35,1.95*r,1.3,.62),.4),a=B(a,K(s,t,e,0,15.35,-.2,1.85*r,14.95,-.1,.5,.36),.5),a=B(a,at(n,t,e,0,11.6,.12,1.35*r,1.45,.92*r),.6),a=B(a,at(n,t,e,0,10,0,1.68*r,1,1.02*r),.6),a=B(a,at(s,t,e,.72,9.55,-.5,.82*r,.85,.62),.4),a=Math.max(a,-K(n,t,e,0,14.6,-1.12,0,10.6,-.98,.16,.14)),a=B(a,K(n,t,e,0,14.9,-.05,0,16.3,.12,.6,.52),.4),a=B(a,at(n,t,e,0,17.3,.1,.95,1.12,1.08),.3),a=B(a,at(n,t,e,0,16.55,.4,.74,.74,.82),.35),a=B(a,at(s,t,e,2.3*r,14.5,0,.7*r,.92,.78),.4),a=B(a,K(s,t,e,2.4,14.4,0,2.72,11.95,-.05,.56*r,.42*r),.3),a=B(a,at(s,t,e,2.56,13.15,.12,.5*r,.95,.5*r),.3),a=B(a,K(s,t,e,2.72,11.9,-.05,2.85,9.6,.38,.46*r,.3*r),.25),a=B(a,at(s,t,e,2.76,11.2,.05,.48*r,.8,.48*r),.3),a=B(a,at(s,t,e,2.87,9,.48,.24,.52,.42),.2),a=B(a,K(s,t,e,2.8,9.35,.75,2.72,8.85,.95,.15,.12),.12),a=B(a,K(s,t,e,1.02,9.6,0,1.15,5.45,.2,.9*r,.56*r),.45),a=B(a,at(s,t,e,1.12,7.7,.28,.8*r,1.6,.72*r),.4),a=B(a,at(s,t,e,.8,8.3,0,.55*r,1.3,.6),.4),a=B(a,fe(s,t,e,1.17,5.3,.32,.52*r),.3),a=B(a,K(s,t,e,1.18,5.25,.15,1.2,1.15,-.1,.5*r,.3*r),.3),a=B(a,at(s,t,e,1.2,3.95,-.28,.56*r,1.3,.6*r),.35),a=B(a,Math.max(at(s,t,e,1.2,.5,.55,.46,.5,1.25),-t),.25),a}function Xy(n,t,e,i,s=0){const r=Math.abs(n);let a=Wy(n,t,e,0);return a=B(a,at(n,t,e,0,17.3,.12,1.08,1.24,1.18),.25),a=B(a,at(n,t,e,0,16.5,.45,.82,.72,.86),.25),a=B(a,K(n,t,e,0,18.42,-.7,0,18.5,.85,.16,.12),.2),a=B(a,at(n,t,e,0,10.55,.05,1.55,.38,1.1),.15),a=B(a,at(n,t,e,0,10.55,1.05,.55,.42,.22),.1),a=B(a,K(r,t,e,2.82,10.25,.3,2.86,9.5,.42,.4,.38),.15),a=B(a,K(r,t,e,1.2,3.2,-.05,1.2,1,-.08,.52,.48),.2),a-s}function qy(n,t,e,i){const s=Math.abs(n);if(t>16.75&&t<17.5&&e>.9&&s<.95)return 2;if(Math.abs(t-10.6)<.45&&e>-1.5)return 3;if(t<3.2||t<10.4&&s>2.3&&t>8.2)return 1;if(e>.7&&s<1.7){const r=t-12.6-s*.55;if(r>0&&r<.35||r>.75&&r<1.1)return 1}return 0}const $y=[{name:"pelvis",a:[0,9.4,-.6],b:[0,10.4,0],parent:null},{name:"spine1",a:[0,10.4,0],b:[0,12.6,.8],parent:"pelvis"},{name:"spine2",a:[0,12.6,.8],b:[0,14.8,1.9],parent:"spine1"},{name:"neck",a:[0,14.8,1.9],b:[0,16,3],parent:"spine2",reach:1.6},{name:"head",a:[0,16,3],b:[0,16.6,5.8],parent:"neck"},{name:"jaw",a:[0,15.5,3.9],b:[0,15.3,6.6],parent:"head",reach:.8},{name:"tail1",a:[0,9.2,-1.6],b:[0,8.2,-3.6],parent:"pelvis",reach:1.8},{name:"tail2",a:[0,8.2,-3.6],b:[0,6.8,-5.2],parent:"tail1",reach:1.8},{name:"tail3",a:[0,6.8,-5.2],b:[0,5.3,-6.4],parent:"tail2",reach:1.6},{name:"tail4",a:[0,5.3,-6.4],b:[0,4,-7.2],parent:"tail3",reach:1.4},{name:"thighL",a:[1.6,9.2,-.3],b:[1.9,6,1.3],parent:"pelvis"},{name:"shinL",a:[1.9,6,1.3],b:[1.9,2.8,-.9],parent:"thighL"},{name:"footL",a:[1.9,2.8,-.9],b:[1.9,.4,1],parent:"shinL"},{name:"thighR",a:[-1.6,9.2,-.3],b:[-1.9,6,1.3],parent:"pelvis"},{name:"shinR",a:[-1.9,6,1.3],b:[-1.9,2.8,-.9],parent:"thighR"},{name:"footR",a:[-1.9,2.8,-.9],b:[-1.9,.4,1],parent:"shinR"},{name:"armL",a:[2.7,14.3,1.6],b:[3.3,11.2,2],parent:"spine2"},{name:"forearmL",a:[3.3,11.2,2],b:[3.2,8.2,3.2],parent:"armL"},{name:"armR",a:[-2.7,14.3,1.6],b:[-3.3,11.2,2],parent:"spine2"},{name:"forearmR",a:[-3.3,11.2,2],b:[-3.2,8.2,3.2],parent:"armR"}],Yy={min:[-5,-.5,-8.6],max:[5,20.4,8.6]},bn=[.62,17.05,4.75],e1=[0,16.35,7.35];function jy(n,t,e,i=0){const s=Math.abs(n);let r=at(n,t,e,0,13.4,1.4,2.6,2.5,2.1);r=B(r,at(n,t,e,0,11.2,.4,1.7,1.6,1.4),.9),r=B(r,at(n,t,e,0,9.8,-.4,2,1.2,1.5),.7),r=B(r,at(n,t,e,0,15.1,1.6,2.3,1.5,2),.8),r=B(r,fe(s,t,e,2.5,14.2,1.5,1.05),.7);let a=at(n,t,e,0,16.9,3.6,1.35,1.25,1.55);a=B(a,K(n,t,e,0,16.7,4.6,0,16.3,7.1,.82,.45),.5),a=B(a,K(n,t,e,0,15.8,4.4,0,15.75,6.7,.55,.32),.35),a=B(a,at(s,t,e,1.15,16.5,3.6,.55,.75,.9),.4),a=B(a,K(s,t,e,.75,17.8,3.1,1.05,19.4,2.7,.5,.06),.3),a=Math.max(a,-fe(s,t,e,bn[0],bn[1],bn[2]+.12,.3)),r=B(r,a,.6),r=B(r,K(s,t,e,2.7,14.3,1.6,3.3,11.2,2,.9,.72),.5),r=B(r,K(s,t,e,3.3,11.2,2,3.2,8.4,3.1,.78,.55),.35),r=B(r,at(s,t,e,3.2,7.9,3.35,.55,.75,.55),.3),r=B(r,K(s,t,e,1.6,9.2,-.3,1.9,6,1.3,1.25,.85),.6),r=B(r,K(s,t,e,1.9,6,1.3,1.9,2.8,-.9,.75,.48),.4),r=B(r,K(s,t,e,1.9,2.8,-.9,1.9,.5,.9,.5,.42),.3);const o=[[0,9.2,-1.6,.6],[0,8.2,-3.6,1],[0,6.8,-5.2,1.15],[0,5.3,-6.4,.9],[0,4,-7.2,.35]];for(let c=0;c+1<o.length;c++){const l=o[c],h=o[c+1];r=B(r,K(n,t,e,l[0],l[1],l[2],h[0],h[1],h[2],l[3],h[3]),.5)}r-=i;for(const c of[-1.5,-.5,.5,1.5])r=B(r,K(s,t,e,3.2+c*.17,7.4,3.5,3.2+c*.22,6.5,3.85,.17,.03),.1);for(const c of[-1,0,1])r=B(r,K(s,t,e,1.9+c*.28,.4,1.2,1.9+c*.34,.1,1.85,.2,.03),.1);return r}function bm(n,t,e){const i=Math.abs(n);return Math.hypot(n,t-e1[1],e-e1[2])<.45||t<7.6&&t>6.2&&e>3.4&&i>2.6||t<.5&&e>1.2?3:t>17.4&&i>.6&&e<3.2||e<-6.3?2:t>15.4&&t<16.4&&e>4.4||t>14.6&&t<15.8&&e>2.8&&i<1.2||e>2.2&&t>10.2&&t<15&&i<1.8?1:t>12.4&&e<.8&&i<1.9&&t>12.4+.5*i?2:0}function Zy(n,t,e){const i=Math.abs(n);return bm(n,t,e)===3||Math.hypot(i-bn[0],t-bn[1],e-bn[2])<.65?0:e>4.6&&t>15.2?.35:t>17.6?.4:t>14&&t<16.4&&e<3.4||e<-1.4&&t<9.6?1.4:t<3?.45:1}const Ky=[{name:"pelvis",a:[0,7.6,-.4],b:[0,8.8,0],parent:null},{name:"spine1",a:[0,8.8,0],b:[0,10.8,.3],parent:"pelvis"},{name:"spine2",a:[0,10.8,.3],b:[0,12.6,.6],parent:"spine1"},{name:"neck",a:[0,12.6,.6],b:[0,15.6,1.3],parent:"spine2",reach:1.9},{name:"head",a:[0,15.6,1.3],b:[0,17.6,2.4],parent:"neck"},{name:"jaw",a:[0,15.9,2.6],b:[0,15.7,4.4],parent:"head",reach:.7},{name:"tail1",a:[0,7.4,-2.6],b:[0,6.8,-3.6],parent:"pelvis",reach:1.4},{name:"tail2",a:[0,6.8,-3.6],b:[0,6.2,-4.5],parent:"tail1",reach:1.4},{name:"tail3",a:[0,6.2,-4.5],b:[0,5.7,-5.2],parent:"tail2",reach:1.2},{name:"tail4",a:[0,5.7,-5.2],b:[0,5.3,-5.7],parent:"tail3",reach:1},{name:"thighL",a:[1.4,7.4,0],b:[1.5,4.6,.3],parent:"pelvis"},{name:"shinL",a:[1.5,4.6,.3],b:[1.5,.9,-.2],parent:"thighL"},{name:"footL",a:[1.5,.9,-.2],b:[1.5,.3,1.8],parent:"shinL"},{name:"thighR",a:[-1.4,7.4,0],b:[-1.5,4.6,.3],parent:"pelvis"},{name:"shinR",a:[-1.5,4.6,.3],b:[-1.5,.9,-.2],parent:"thighR"},{name:"footR",a:[-1.5,.9,-.2],b:[-1.5,.3,1.8],parent:"shinR"},{name:"armL",a:[2.7,11.6,.2],b:[3.3,9.2,-.1],parent:"spine2"},{name:"forearmL",a:[3.3,9.2,-.1],b:[3.2,7,.3],parent:"armL"},{name:"armR",a:[-2.7,11.6,.2],b:[-3.3,9.2,-.1],parent:"spine2"},{name:"forearmR",a:[-3.3,9.2,-.1],b:[-3.2,7,.3],parent:"armR"}],Jy={min:[-5,-.4,-7.2],max:[5,21.4,6.6]},yn=[.72,17.25,2.75];function Qy(n,t,e,i=0){const s=Math.abs(n);let r=at(n,t,e,0,9.2,-.2,3.3,3.5,3);r=B(r,at(n,t,e,0,11.4,.5,2.5,2.2,2.3),1),r=B(r,K(n,t,e,0,12.2,.5,0,15.8,1.4,1.25,.95),.8);let a=fe(n,t,e,0,16.9,1.8,1.55);a=B(a,K(n,t,e,0,16.55,2.9,0,16.1,5,.72,.18),.3),a=B(a,K(n,t,e,0,15.85,2.8,0,15.75,4.4,.5,.14),.25);for(const[o,c]of[[0,1],[.6,.82],[-.6,.82]])a=B(a,K(n,t,e,o*.5,18.1,1.6,o*1.3,18.1+2.7*c,1-.7*c,.34,.12),.3);a=Math.max(a,-fe(s,t,e,yn[0],yn[1],yn[2],.5)),r=B(r,a,.5),r=B(r,at(s,t,e,3,9.8,0,.75,2.6,1.7),.7);for(const o of[-1,0,1])r=B(r,K(s,t,e,3.2,8.4,o*.6,3.25,6.6+Math.abs(o)*.4,o*.75+.2,.42,.14),.3);for(const o of[-1,0,1])r=B(r,K(n,t,e,o*.3,7.6,-2.6,o*1.1,7+(1-Math.abs(o))*.5,-5.6,.5,.2),.4);r=B(r,K(s,t,e,1.4,7.4,0,1.5,4.8,.3,1,.55),.5),r=B(r,K(s,t,e,1.5,4.8,.3,1.5,1,-.2,.42,.36),.25),r-=i;for(const o of[-1,0,1])r=B(r,K(s,t,e,1.5,.5,.1,1.5+o*.85,.3,2-Math.abs(o)*.3,.34,.16),.2);return r=B(r,K(s,t,e,1.5,.5,-.2,1.5,.3,-1.1,.3,.14),.15),r}function ym(n,t,e){const i=Math.abs(n);return t>15.6&&t<17.1&&e>2.6&&i<.85||t<5&&i>.9&&i<2.6||t<1?3:t>18.4||e<-4.6?2:e>1.2&&t>9.4&&t<13.4&&i<1.8||e>2.2&&t>16.2&&t<18.2&&i<1.25?1:0}function tw(n,t,e){const i=Math.abs(n),s=ym(n,t,e);return s===3||Math.hypot(i-yn[0],t-yn[1],e-yn[2])<.9?0:s===2?.6:t>16?.45:t>14.6&&e>1.6?.3:t>12.2?1.25:e<-2.4?1.4:1}const I0=[{name:"pelvis",a:[0,9.2,0],b:[0,10.4,0],parent:null},{name:"spine1",a:[0,10.4,0],b:[0,12.4,.1],parent:"pelvis"},{name:"spine2",a:[0,12.4,.1],b:[0,15.4,.2],parent:"spine1"},{name:"neck",a:[0,15.4,.2],b:[0,16.2,.3],parent:"spine2",reach:.9},{name:"head",a:[0,16.2,.3],b:[0,18.4,.6],parent:"neck"},{name:"jaw",a:[0,16.4,1.2],b:[0,16.4,1.6],parent:"head",reach:0},{name:"tail1",a:[0,9.2,-.5],b:[0,9,-1],parent:"pelvis",reach:0},{name:"tail2",a:[0,9,-1],b:[0,8.8,-1.5],parent:"tail1",reach:0},{name:"tail3",a:[0,8.8,-1.5],b:[0,8.6,-2],parent:"tail2",reach:0},{name:"tail4",a:[0,8.6,-2],b:[0,8.4,-2.5],parent:"tail3",reach:0},{name:"thighL",a:[2.1,9.2,0],b:[2.3,5.2,.3],parent:"pelvis"},{name:"shinL",a:[2.3,5.2,.3],b:[2.3,1.2,-.1],parent:"thighL"},{name:"footL",a:[2.3,1.2,-.1],b:[2.3,.4,1.8],parent:"shinL"},{name:"thighR",a:[-2.1,9.2,0],b:[-2.3,5.2,.3],parent:"pelvis"},{name:"shinR",a:[-2.3,5.2,.3],b:[-2.3,1.2,-.1],parent:"thighR"},{name:"footR",a:[-2.3,1.2,-.1],b:[-2.3,.4,1.8],parent:"shinR"},{name:"armL",a:[4.1,14.7,.2],b:[4.5,11.6,.4],parent:"spine2"},{name:"forearmL",a:[4.5,11.6,.4],b:[4.5,8.4,1],parent:"armL"},{name:"armR",a:[-4.1,14.7,.2],b:[-4.5,11.6,.4],parent:"spine2"},{name:"forearmR",a:[-4.5,11.6,.4],b:[-4.5,8.4,1],parent:"armR"}],ew={min:[-6.4,-.4,-4.4],max:[6.4,19.8,4]};function Ve(n,t,e,i,s,r,a,o,c,l){const h=Math.abs(n-i)-a+l,u=Math.abs(t-s)-o+l,d=Math.abs(e-r)-c+l;return Math.hypot(Math.max(h,0),Math.max(u,0),Math.max(d,0))+Math.min(Math.max(h,u,d),0)-l}function n1(n,t,e,i,s,r,a,o,c){const l=Math.abs(n-i)-a+c,h=Math.hypot(t-s,e-r)-o+c;return Math.hypot(Math.max(l,0),Math.max(h,0))+Math.min(Math.max(l,h),0)-c}function wm(n,t,e,i,s,r,a,o){let c=n-i,l=t-s,h=e-r;const u=Math.cos(a),d=Math.sin(a);[c,h]=[c*u-h*d,c*d+h*u];const f=Math.cos(o),p=Math.sin(o);return[c,l]=[c*f+l*p,-c*p+l*f],[c,l,h]}const hn={hx:1.5,hy:14.6,hz:-2.15,yaw:.4,roll:.62,w:1.1,h:.85,t:.12};function nw(n,t,e){const[i,s,r]=wm(n,t,e,hn.hx,hn.hy,hn.hz,hn.yaw,hn.roll);return Ve(i,s,r,hn.w,hn.h,0,hn.w,hn.h,hn.t,.1)}function iw(n,t,e,i=0){const s=Math.abs(n);let r=1e9;{const a=Ve(n,t,e,0,13.75,.25,2.9,1.75,1.75,.3),o=(e-(2-Math.max(0,t-13.4)*.6))*.86;r=Math.max(a,o)}return r=B(r,Ve(n,t,e,0,12.2,.3,2.3,.6,1.5,.3),.3),r=Math.min(r,Ve(n,t,e,0,12.55,1.95,2.5,.22,.28,.1)),r=Math.min(r,Ve(s,t,e,2.2,13.1,1.92,.42,.26,.15,.08)),r=Math.min(r,Ve(n,t,e,0,11.1,.75,1.15,.9,.55,.25)),r=B(r,Ve(n,t,e,0,11,0,1.2,1,1.05,.3),.2),r=B(r,Ve(n,t,e,0,9.75,0,2.2,.75,1.4,.3),.25),r=Math.min(r,Ve(n,t,e,0,9.45,1.35,.7,.7,.25,.15)),r=Math.min(r,Ve(n,t,e,0,13.5,-1.85,2.2,1.6,.55,.25)),r=Math.min(r,nw(s,t,e)),r=Math.min(r,K(n,t,e,0,15.3,.25,0,16.3,.35,.6,.55)),r=Math.min(r,Ve(n,t,e,0,17.25,.45,.82,.92,.9,.35)),r=Math.min(r,Ve(n,t,e,0,16.55,.95,.55,.38,.42,.18)),r=Math.min(r,Ve(n,t,e,0,18.2,.35,.12,.35,.75,.08)),r=Math.min(r,Ve(s,t,e,.95,17.55,.25,.12,.62,.3,.08)),r=Math.min(r,Ve(s,t,e,4.05,15.05,.2,1.15,.8,1.35,.3)),r=Math.min(r,n1(s,t,e,5.4,14.7,.2,.32,.92,.12)),r=Math.min(r,fe(s,t,e,4.1,14.4,.2,.75)),r=Math.min(r,K(s,t,e,4.1,14.2,.2,4.5,11.8,.4,.62,.58)),r=Math.min(r,fe(s,t,e,4.5,11.6,.4,.72)),r=Math.min(r,Ve(s,t,e,4.55,10,.6,.9,1.5,1,.3)),r=Math.min(r,Ve(s,t,e,4.55,8.05,1,.75,.75,.8,.28)),r=Math.min(r,K(s,t,e,2.1,9.1,0,2.3,5.6,.25,1.05,.95)),r=Math.min(r,Ve(s,t,e,2.3,5.25,.85,.85,.75,.55,.25)),r=Math.min(r,Ve(s,t,e,2.3,3,.05,1.25,2.15,1.35,.35)),r=Math.min(r,n1(s,t,e,3.75,2.6,-.35,.3,.9,.12)),r=Math.min(r,Ve(s,t,e,2.3,.5,.65,1.15,.5,2,.2)),r-i}function sw(n,t,e){const i=Math.abs(n);if(i>5&&Math.hypot(t-14.7,e-.2)<1)return Math.hypot(t-14.7,e-.2)<.42?1:5;if(i>3.38&&Math.hypot(t-2.6,e+.35)<.98)return Math.hypot(t-2.6,e+.35)<.4?1:5;if(t>16.95&&t<17.3&&e>1.2&&i>.12&&i<.62||t>12.85&&t<13.35&&e>1.95&&i>1.85&&i<2.6)return 2;if(t>13.55&&t<15.35&&i<2.55&&i>.18&&e>1.75-Math.max(0,t-13.4)*.6)return 4;if(t>16.15&&t<16.95&&e>1.25&&i<.6)return 6;if(e<-1.9&&t>13.8){const[s,r,a]=wm(i,t,e,hn.hx,hn.hy,hn.hz,hn.yaw,hn.roll);if(Math.abs(a)<.3&&s>.25&&s<1.75&&r>.85&&r<1.5)return 4}return t>12.3&&t<12.8&&e>1.65||t>14.25&&t<15.9&&i>2.9&&i<5.15||t>4.5&&t<6&&e>.4&&i>1.4&&i<3.2||t<1.1&&e>1.6||t>17.9&&i<.2?1:Math.hypot(i-4.1,t-14.4,e-.2)<.85&&t<14.25||Math.hypot(i-4.5,t-11.6,e-.4)<.8||t>15.2&&t<16.2&&i<.7||t>10.2&&t<11.6&&e<1.25&&i<1.25?3:0}function Te(n,t,e,i,s,r,a,o,c,l){const h=Math.abs(n-i)-a+l,u=Math.abs(t-s)-o+l,d=Math.abs(e-r)-c+l;return Math.hypot(Math.max(h,0),Math.max(u,0),Math.max(d,0))+Math.min(Math.max(h,u,d),0)-l}const rw={min:[-6.8,-.4,-4.6],max:[6.8,20.2,5]};function aw(n,t,e,i=0){const s=Math.abs(n);let r=1e9;r=Math.min(r,Te(n,t,e,0,13.6,.2,3.1,2.1,2,.5)),r=Math.min(r,at(n,t,e,0,14.3,2.15,1.05,.7,.75)),r=Math.min(r,Te(n,t,e,0,12.4,2,.9,1,.4,.3)),r=Math.min(r,Te(s,t,e,1.7,15.6,-2.3,.18,2.4,1.1,.12)),r=Math.min(r,Te(n,t,e,0,13,-2.3,2.2,1.6,.6,.3)),r=B(r,Te(n,t,e,0,11.2,.1,1.9,1.1,1.35,.35),.3),r=B(r,Te(n,t,e,0,9.7,0,2.5,.95,1.55,.3),.3),r=Math.min(r,Te(n,t,e,0,9.4,1.4,.8,.9,.35,.2)),r=Math.min(r,K(n,t,e,0,15.3,.2,0,16.4,.3,.75,.7)),r=Math.min(r,Te(n,t,e,0,17.2,.4,1,1,1.1,.4)),r=Math.min(r,Te(n,t,e,0,16.6,1.25,.65,.45,.35,.15)),r=Math.min(r,Te(n,t,e,0,18.6,.3,.13,.75,.9,.08)),r=Math.min(r,K(s,t,e,.95,17.7,.4,1.5,18.5,.2,.2,.08)),r=Math.min(r,Te(s,t,e,4.2,15.4,.1,1.55,.85,1.7,.35)),r=Math.min(r,K(s,t,e,4.2,15.5,1.6,4.2,15.5,3.9,.3,.26)),r=Math.min(r,fe(s,t,e,4.1,14.4,.2,1)),r=Math.min(r,K(s,t,e,4.1,14.2,.2,4.5,11.8,.4,.85,.8)),r=Math.min(r,fe(s,t,e,4.5,11.6,.4,.9)),r=Math.min(r,Te(s,t,e,4.8,10,.6,1,1.7,1.3,.3)),r=Math.min(r,Te(s,t,e,5.85,10,.6,.22,1.8,1.35,.18)),r=Math.min(r,Te(s,t,e,4.75,7.9,1,.85,.85,.95,.3)),r=Math.min(r,K(s,t,e,2.1,9.1,0,2.3,5.8,.25,1.15,1.1)),r=Math.min(r,Te(s,t,e,2.3,5.4,.6,1.15,1.05,1,.3)),r=Math.min(r,Te(s,t,e,2.3,3,0,1.2,2,1.25,.3));for(const a of[3.8,1.9])r=Math.min(r,K(s,t,e,3.35,a,-.4,3.75,a,-.4,.75,.75));return r=Math.min(r,Te(s,t,e,2.3,.55,.65,1.15,.55,2,.2)),r-i}function ow(n,t,e){const i=Math.abs(n),s=n>0;return t>13.7&&t<15&&e>1.6&&i<1.1||t>16.5&&t<17&&e>1.4&&i<.5&&i>.12?2:i>3.9&&i<4.5&&t>15.1&&t<15.9&&e>1.7||i>5.55&&t>8.2&&t<11.8||i>3.1&&t<4.6&&t>1.1&&e<.4||t>5.5&&t<6.3&&e>1.4&&i>1.3&&i<3.3||Math.hypot(i-4.1,t-14.4,e-.2)<1.05&&t<14.6||Math.hypot(i-4.5,t-11.6,e-.4)<.95&&t>11.3||t>10.7&&t<11&&i<2||t>8.6&&t<8.9&&i>1&&i<3.6?3:i>3.55&&t>6.4&&t<16.4||i>2.9&&t>11.4&&t<16.4?s?4:5:t<8.8&&i>.95?s?6:7:t>15.2||i>1.4&&i<2&&e<-1.2||t<11.3||e<-1.7?1:0}const cw={min:[-7.6,-.4,-6.6],max:[7.6,21,4.4]};function lw(n,t,e,i,s,r,a,o,c,l,h,u){const d=(s+o)/2;return K(n,d+(t-d)/u,e,i,s,r,a,o,c,l,h)*u}function hw(n,t,e,i,s,r,a,o,c,l,h,u){const d=(i+a)/2;return K(d+(n-d)/u,t,e,i,s,r,a,o,c,l,h)*u}function uw(n,t,e,i=0){const s=Math.abs(n);let r=1e9;return r=Math.min(r,Te(n,t,e,0,13.7,.1,2.5,1.9,1.7,.6)),r=Math.min(r,at(n,t,e,0,14.4,1.75,.95,.75,.85)),r=B(r,Te(n,t,e,0,11.4,0,1.5,1.2,1.15,.4),.4),r=B(r,Te(n,t,e,0,9.8,0,2.2,.85,1.35,.35),.3),r=Math.min(r,K(n,t,e,0,15.2,-2,0,10.8,-2.3,.75,.2)),r=Math.min(r,lw(s,t,e,1.4,13.6,-2.2,6.8,12.4,-5.6,1.9,.4,.17)),r=Math.min(r,hw(s,t,e,1.5,14.2,-2.4,1.65,17.8,-3.7,.95,.22,.2)),r=Math.min(r,Te(s,t,e,3.4,15.2,.2,1.15,.9,1.5,.3)),r=Math.min(r,Te(s,t,e,3.4,16.4,-.1,.85,.45,1.1,.2)),r=Math.min(r,K(n,t,e,0,15.3,.1,0,16.3,.2,.6,.55)),r=Math.min(r,at(n,t,e,0,17.1,.35,.85,1,1.15)),r=Math.min(r,K(s,t,e,.45,17.8,.6,1,19.4,-.9,.16,.05)),r=Math.min(r,fe(s,t,e,4.1,14.5,.2,.8)),r=Math.min(r,K(s,t,e,4.1,14.3,.2,4.5,11.8,.4,.65,.6)),r=Math.min(r,fe(s,t,e,4.5,11.6,.4,.7)),r=Math.min(r,Te(s,t,e,4.5,10,.6,.8,1.6,.85,.3)),r=Math.min(r,Te(s,t,e,4.5,8,.95,.6,.65,.6,.25)),r=Math.min(r,K(s,t,e,2.1,9.1,0,2.3,5.6,.25,1.1,1)),r=Math.min(r,Te(s,t,e,2.3,5.2,.7,.75,.65,.5,.25)),r=Math.min(r,K(s,t,e,2.3,4.8,-.1,2.3,1.7,-.3,1.25,1.15)),r=Math.min(r,K(s,t,e,2.3,1.6,-.6,2.3,1.1,-1.4,1,1.1)),r=Math.min(r,Te(s,t,e,2.3,.45,.9,.75,.45,1.5,.2)),r-i}function fw(n,t,e){const i=Math.abs(n);return t>13.8&&t<15.1&&e>1.2&&i<1||t>16.8&&t<17.4&&e>1&&i<.75?2:t<1.9&&e<-.9||Math.hypot(i-4.1,t-14.5,e-.2)<.85&&t<14.5||Math.hypot(i-4.5,t-11.6,e-.4)<.75||t>10.4&&t<10.8&&i<1.6?3:i>2.5&&i<4.3&&t>16&&t<16.9||e<-1.9&&i>1.5&&i<7&&Math.abs(t-(13.6-(i-1.4)*.22))<.3||t>12.6&&t<13&&i<2.3&&e>.8?4:i>3.6&&t<13.8&&t>7.2||t<5&&i>1?1:0}function yr(n){const t=!!n.mech,e=!!n.cape,i=n.tail??null;return(s,r,a,o)=>s.name.startsWith("thigh")?o>-1.6&&a<s.a[1]+(t?1.4:.8)&&Math.abs(Math.abs(r)-Math.abs(s.a[0]))<(a<s.a[1]+.3?t?1.45:1.3:t?1.4:.9):s.name.startsWith("tail")?i!==null?o<i:e&&o<-1.55:!t&&(s.name.startsWith("arm")||s.name.startsWith("forearm"))?Math.abs(r)>2&&o>-1.2:t&&s.name.startsWith("arm")?o>-1.5:!0}const Sm=(n,t,e=2.2)=>n.std({color:t,emissive:t,emissiveIntensity:e,roughness:.3}),dw={id:"crimson",name:"Crimson",blurb:"A suited hero, visor and all",segs:Mm,body:{sdf:(n,t,e)=>Xy(n,t,e),region:(n,t,e)=>qy(n,t,e),box:Gy,palette:[13114922,16053492,1052692,12633292],surface:"suit",capture:yr({})},dress(n){const t=n.std({color:526348,roughness:.08,metalness:.6});for(const e of[-1,1]){const i=new mt(new be(1,.38,.4),t);i.rotation.set(0,e*.42,e*-.32),n.at(i,"head",e*.46,17.12,1.12)}},fit:{size:1.08,limb:.7},face:{eyes:[[.46,17.12,1.35,.32],[-.46,17.12,1.35,.32]]}};yr({cape:!0});const pw=$y.map(n=>/^(arm|forearm)/.test(n.name)?{...n,reach:1.95}:n),mw={id:"howler",name:"Howler",blurb:"A wolf man with amber eyes",segs:pw,body:{sdf:(n,t,e)=>jy(n,t,e),region:bm,box:Yy,palette:[7827562,12103584,3420204,1183760],capture:yr({tail:-1.5}),fur:{length:.8,density:7,tip:.22},furLen:Zy},dress(n){const t=Sm(n,16756768,1.8);for(const e of[-1,1]){const i=new mt(new ie(.24,12,8),t);i.scale.set(1.2,.8,.8),n.at(i,"head",e*bn[0],bn[1],bn[2])}},fit:{size:1.1,limb:.6},idle:{tail:.25},face:{jaw:.45,eyes:[[bn[0],bn[1],bn[2]+.12,.3],[-.62,bn[1],bn[2]+.12,.3]]}},gw={id:"plume",name:"Plume",blurb:"A big, friendly, feathered bird",segs:Ky,body:{sdf:(n,t,e)=>Qy(n,t,e),region:ym,box:Jy,palette:[16036872,16770976,15224972,15762468],surface:"soft",capture:yr({tail:-2.4}),fur:{length:1.5,density:1.6,tip:.3,feather:!0},furLen:tw},dress(n){const t=n.std({color:16316660,roughness:.2}),e=n.std({color:657936,roughness:.1});for(const i of[-1,1]){const s=new mt(new ie(.52,18,12),t),r=new mt(new ie(.24,12,8),e);r.position.set(-i*.1,.02,.36),r.scale.set(1,1.2,.6),s.add(r),n.at(s,"head",i*yn[0],yn[1],yn[2])}},fit:{size:1.12,limb:.5},idle:{tail:.15},face:{jaw:.4,eyes:[[yn[0],yn[1],yn[2]+.45,.5],[-.72,yn[1],yn[2]+.45,.5]]}};function D0(n,t){return e=>{const i=Sm(e,t);if(n==="bastion"){for(const a of[-1,1]){const o=new mt(new be(.42,.2,.1),i);o.rotation.z=a*-.12,e.at(o,"head",a*.36,17.12,1.36);const c=new mt(new be(.62,.36,.1),i);e.at(c,"spine2",a*2.2,13.1,2.08)}return}const s=n==="unison",r=new mt(new ie(1,20,12),i);if(r.scale.set(s?.95:.85,s?.55:.6,s?.45:.35),e.at(r,"spine2",0,14.35,s?2.55:1.95),s)for(const a of[-1,1]){const o=new mt(new be(.42,.16,.1),i);o.rotation.z=a*.25,e.at(o,"head",a*.32,16.85,1.62)}else e.at(new mt(new be(1.3,.3,.12),i),"head",0,17.1,1.42);if(s){const a=e.std({color:14673130,roughness:.2,metalness:.9}),o=e.std({color:14198832,roughness:.3,metalness:.8}),c=new we,l=new mt(new be(.22,8,.9),a);l.position.y=-4.5,c.add(l);const h=new mt(new gi(.64,1.4,4),a);h.rotation.z=Math.PI,h.position.y=-9.2,h.scale.set(.35,1,1),c.add(h),c.rotation.x=-.95;const u=new mt(new be(.5,.4,3),o);u.position.y=-.3,c.add(u);const d=new mt(new An(.22,.22,1.6,8),o);d.position.y=.6,c.add(d),e.at(c,"forearmR",-4.75,8,2.1)}}}const vw={id:"bastion",name:"Bastion",blurb:"An armoured truck that stands up",segs:I0,body:{sdf:(n,t,e)=>iw(n,t,e),region:sw,box:ew,palette:[4871266,14262322,9431295,1842980,7118020,1316377,12896462],surface:"armour",weights:"rigid",capture:yr({mech:!0})},dress:D0("bastion",9431295),fit:{size:1,limb:.6},face:{eyes:[[.4,17.12,1.5,.28],[-.4,17.12,1.5,.28]]}},xw={id:"kestrel",name:"Kestrel",blurb:"A jet that stands up",segs:I0,body:{sdf:(n,t,e)=>uw(n,t,e),region:fw,box:cw,palette:[15132908,5661306,16756800,1842980,13117498],surface:"armour",weights:"rigid",capture:yr({mech:!0})},dress:D0("kestrel",16756800),fit:{size:1,limb:.6},face:{eyes:[[.36,17.12,1.56,.26],[-.36,17.12,1.56,.26]]}},_w={id:"unison",name:"Unison",blurb:"Five machines locked into one",segs:I0,body:{sdf:(n,t,e)=>aw(n,t,e),region:ow,box:rw,palette:[15527666,2503274,8382719,1842980,15234090,2271388,15254056,12855866],surface:"armour",weights:"rigid",capture:yr({mech:!0})},dress:D0("unison",8382719),fit:{size:1,limb:.6},face:{eyes:[[.34,16.9,1.72,.25],[-.34,16.9,1.72,.25]]}},zi=15.55,U0=[0,15.6,1.2],di=[1.26,16.95,3.8],oi=[[0,9,-1.8],[.3,7,-4.6],[1.3,4.6,-7.2],[3,2.5,-9.4],[5.2,1.1,-11.2]],i1=[2.5,1.95,1.45,.95,.3],Hu=[2.8,13.9,1.2],co=[4.35,12.4,1.8],Kn=[4.5,11,3.4],Cc=n=>[-n[0],n[1],n[2]],Em=[{name:"pelvis",a:[0,9.2,-.4],b:[0,10.6,0],parent:null},{name:"spine1",a:[0,10.6,0],b:[0,12.6,.5],parent:"pelvis"},{name:"spine2",a:[0,12.6,.5],b:[0,14.4,.9],parent:"spine1"},{name:"neck",a:[0,14.4,.9],b:[0,16.4,1.2],parent:"spine2"},{name:"head",a:[0,16.4,1.2],b:[0,17.3,5.4],parent:"neck"},{name:"jaw",a:U0,b:[0,16.2,5],parent:"head",reach:0},{name:"tail1",a:oi[0],b:oi[1],parent:"pelvis"},{name:"tail2",a:oi[1],b:oi[2],parent:"tail1"},{name:"tail3",a:oi[2],b:oi[3],parent:"tail2"},{name:"tail4",a:oi[3],b:oi[4],parent:"tail3"},{name:"thighL",a:[2,9,.1],b:[2.2,5,.7],parent:"pelvis"},{name:"shinL",a:[2.2,5,.7],b:[2.3,1.5,-.1],parent:"thighL"},{name:"footL",a:[2.3,1.5,-.1],b:[2.4,.4,2.4],parent:"shinL"},{name:"thighR",a:[-2,9,.1],b:[-2.2,5,.7],parent:"pelvis"},{name:"shinR",a:[-2.2,5,.7],b:[-2.3,1.5,-.1],parent:"thighR"},{name:"footR",a:[-2.3,1.5,-.1],b:[-2.4,.4,2.4],parent:"shinR"},{name:"armL",a:Hu,b:co,parent:"spine2"},{name:"forearmL",a:co,b:Kn,parent:"armL"},{name:"armR",a:Cc(Hu),b:Cc(co),parent:"spine2"},{name:"forearmR",a:Cc(co),b:Cc(Kn),parent:"armR"}],s1=(n,t,e)=>-B(-n,-t,e),N0=n=>Math.max(0,Math.min(1,n)),Sn=(n,t,e)=>{const i=N0((e-n)/(t-n));return i*i*(3-2*i)},Hc=n=>1.5+(1.02-1.5)*N0((n-1.5)/4.5);function Tm(n,t,e){const i=Math.abs(n);let s=at(n,t,e,0,16.85,1.3,1.8,1.3,1.95);return s=B(s,K(n,t,e,0,15.8,1.5,0,15.75,6,1.5,1.02),.5),s=B(s,K(n,t,e,0,16.45,2,0,16.4,5.7,1.2,.9),.6),s=B(s,K(i,t,e,1.4,17.55,2,.95,17.2,4.35,.56,.42),.35),s=B(s,at(i,t,e,1.55,16.2,1.6,.82,.95,1.35),.4),s=B(s,fe(i,t,e,.5,16.95,5.75,.28),.2),s=s1(s,-fe(i,t,e,di[0]+.08,di[1]-.02,di[2]+.08,.38),.1),s1(s,Math.min(zi-t,e-U0[2]),.12)}function Mw(n,t,e){const i=Math.abs(n);let s=K(n,t,e,0,15.25,1.5,0,15.2,5.6,1.38,.95);return s=B(s,fe(n,t,e,0,14.9,5.55,.78),.4),s=B(s,at(n,t,e,0,14.75,2.6,1.25,.75,1.8),.5),s=B(s,K(i,t,e,1.1,15.3,1,1,15.3,3.2,.4,.35),.3),Math.max(s,t-zi)}const bw={min:[-1.8,13.7,-.1],max:[1.8,zi+.05,6.5]};function Am(n,t,e){let i=1e9;for(const s of[-1,0,1])i=Math.min(i,K(n,t,e,2.4+s*.95,.45,3.25+(s===0?.45:0),2.4+s*1.1,.12,4+(s===0?.55:0),.26,.05));for(const s of[-.32,0,.32])i=Math.min(i,K(n,t,e,Kn[0]+s,Kn[1]-.45,Kn[2]+.55,Kn[0]+s*1.5,Kn[1]-1.15,Kn[2]+1.25,.17,.035));return i}function Rm(n,t,e){const[i,s,r]=Hu,[a,o,c]=co,[l,h,u]=Kn;let d=K(n,t,e,i,s,r,a,o,c,.9,.72);return d=B(d,K(n,t,e,a,o,c,l,h,u,.7,.56),.3),B(d,at(n,t,e,Kn[0],Kn[1]-.25,Kn[2]+.25,.58,.52,.62),.3)}function yw(n,t,e){const i=Math.abs(n);let s=at(n,t,e,0,9.7,-.3,3,2.6,2.6);return s=Math.min(s,K(n,t,e,0,10.2,0,0,12.6,.5,2.75,2.55)),s=Math.min(s,K(n,t,e,0,12.6,.5,0,14.2,.7,2.55,2)),s=Math.min(s,at(n,t,e,0,11.4,1.5,2.2,3,1.75)),s=Math.min(s,at(i,t,e,1.65,13.9,.5,1.35,1.05,1.4)),s=Math.min(s,fe(i,t,e,2.05,8.6,-.1,2.2)),Math.min(s,K(i,t,e,2,9,.1,2.2,5,.7,1.95,1.55))}function Cm(n,t,e){return B(K(n,t,e,0,14,.5,0,16.2,.95,2.05,1.7),at(n,t,e,0,14.5,1.9,1.45,1,1.3),.6)}const r1=(n,t,e,i,s,r,a)=>{const o=n-i,c=t-s,l=e-r;return o*o+c*c+l*l<a*a};function Lm(n,t,e){const i=Math.abs(n);let s=9;if(r1(n,t,e,0,12.4,.4,8.2)&&(s=at(n,t,e,0,9.7,-.3,3,2.6,2.6),s=B(s,K(n,t,e,0,10.2,0,0,12.6,.5,2.75,2.55),1),s=B(s,K(n,t,e,0,12.6,.5,0,14.2,.7,2.55,2),.9),s=B(s,at(n,t,e,0,11.4,1.5,2.2,3,1.75),.9),s=B(s,at(i,t,e,1.65,13.9,.5,1.35,1.05,1.4),.8),s=B(s,Cm(n,t,e),.9)),n*n<4&&e<1.5&&t>6.5&&t<19&&(s=B(s,K(n,t,e,0,16.2,-.3,0,12,-2,.45,.6),.6),s=B(s,K(n,t,e,0,12,-2,0,9.4,-3,.6,.55),.6)),t>13.4&&e>-1.6&&r1(n,t,e,0,16.6,3.25,6.5)&&(s=B(s,Tm(n,t,e),.7)),e<1.6&&t<13.5&&n>-4.5&&n<7.6){const r=[1,.7,.5,.4];for(let a=0;a<4;a++){const o=oi[a],c=oi[a+1];s=B(s,K(n,t,e,o[0],o[1],o[2],c[0],c[1],c[2],i1[a],i1[a+1]),r[a])}}if(t<12.2&&i<6&&e>-4&&e<5.6){let r=fe(i,t,e,2.05,8.6,-.1,2.2);if(r=B(r,K(i,t,e,2,9,.1,2.2,5,.7,1.95,1.55),.6),r=B(r,fe(i,t,e,2.25,5.1,.85,1.45),.5),r=B(r,K(i,t,e,2.2,5,.7,2.3,1.5,-.1,1.45,1.3),.5),t<4.5&&(r=B(r,K(i,t,e,2.3,1.3,0,2.4,.75,2,1.25,.95),.5),r=B(r,fe(i,t,e,2.3,.9,-.6,.95),.4),e>.2))for(const a of[-1,0,1])r=B(r,K(i,t,e,2.4+a*.5,.75,1.8,2.4+a*.95,.5,3.25+(a===0?.45:0),.52,.36),.3);s=B(s,r,.8)}return i>1.2&&t>8.2&&t<15.8&&e>-1.3&&e<6.2&&(s=B(s,Rm(i,t,e),.3)),(t<2&&e>2||i>3.2&&t>8.4&&t<12&&e>2.6)&&(s=Math.min(s,Am(i,t,e))),Math.max(s,-t)}const pi={skin:6317163,belly:8814703,ridge:2763823,claw:14867659,mouth:4854808,bone:13222576},ww=[pi.skin,pi.belly,pi.ridge,pi.claw,pi.mouth];function Sw(n,t,e){const i=Math.abs(n);if(Am(i,t,e)<.06)return 3;if(e>U0[2]+.2&&e<5.6&&t<zi+.04&&t>zi-.12&&i<Hc(e)-.45)return 4;if(e>1.9&&e<3.3&&t>14.75&&t<zi&&i<1||i<.9&&e<-.3&&t>9.4&&t<16.5&&e<-2.45+(t-9.4)*.3)return 2;const s=i/2.05,r=(t-11.1)/3.4;if(s*s+r*r<1&&e>1)return 1;const a=i/1.15,o=(t-14.2)/.75;return a*a+o*o<1&&e>2?1:0}const Ew=new vt(pi.belly);function Tw(n,t,e,i,s){if(n===1){const r=Math.abs(e*1.25%1-.5)*2;s.multiplyScalar(.8+.2*Sn(.15,.55,r))}else if(n===0){const r=Sn(0,-2.5,i)*Sn(6.5,12,e)+(i<-3?Sn(-.5,1,e-(9.4+i*.62)):0);s.multiplyScalar(1-.22*Math.min(1,r));const a=Math.abs(t)/2.05,o=(e-11.1)/3.4,c=a*a+o*o;i>.6&&c<1.5&&s.lerp(Ew,.35*Sn(1.5,1,c))}}const Yr=[NaN,NaN,NaN],jr=[NaN,NaN,NaN];let a1=!1,wh=0;const Aw=(n,t,e,i)=>{const s=n.name;return s.startsWith("thigh")?t*n.a[0]>-.3&&i>-2&&e<n.a[1]+.6&&Math.abs(Math.abs(t)-Math.abs(n.a[0]))<(e<n.a[1]-.3?2.2:1.2):s.startsWith("tail")?i<-2.7:s.startsWith("arm")||s.startsWith("forearm")?t*n.a[0]<=0?!1:((t!==Yr[0]||e!==Yr[1]||i!==Yr[2])&&(Yr[0]=t,Yr[1]=e,Yr[2]=i,a1=Rm(Math.abs(t),e,i)<yw(t,e,i)+.1),a1):s==="head"||s==="neck"?((t!==jr[0]||e!==jr[1]||i!==jr[2])&&(jr[0]=t,jr[1]=e,jr[2]=i,wh=e>13.4&&i>-1.6?Tm(t,e,i)-Cm(t,e,i):9),s==="head"?wh<.25:wh>-.25):!0},Rw=[[0,16.6,1.1],[0,14.4,.9],[0,12.6,.5],[0,10.6,0],[0,9,-1],...oi.slice(1)],ba=["tail4","tail3","tail2","tail1","pelvis","spine1","spine2","neck"],F0=3116543;function o1(n,t,e){const i=Rw.map(o=>new C(...o)),s=i.slice(1).map((o,c)=>o.distanceTo(i[c])),r=s.reduce((o,c)=>o+c,0),a=[];for(let o=t*r;o<=e*r+1e-6;o+=n){let c=0,l=0;for(;c<s.length-1&&l+s[c]<o;)l+=s[c++];const h=(o-l)/s[c],u=i[c].clone().lerp(i[c+1],h),d=i[c+1].clone().sub(i[c]).normalize();c+2<i.length&&d.lerp(i[c+2].clone().sub(i[c+1]).normalize(),Math.max(0,h-.5)).normalize();const f=new C(0,.7,-.7);f.addScaledVector(d,-f.dot(d)).normalize();const p=new C().crossVectors(d,f).normalize();a.push({p:u,t:d,o:f,side:p,u:o/r})}return a}function Cw(n,t){const e=n.clone().addScaledVector(t,6);for(let i=0;i<80;i++){const s=Lm(e.x,e.y,e.z);if(s<.02)break;e.addScaledVector(t,-Math.max(.03,s*.8))}return e}function Lw(n,t,e,i){const s=i-.5,r=[[.5,-.35],[.53,.1],[.52,.3],[.5,.47+.08*s],[.36,.42],[.31,.6-.06*s],[.2,.58],[.16,.8],[.06-.04*s,1],[-.06,.82],[-.12,.66],[-.24,.76+.08*s],[-.3,.56],[-.42,.6-.06*s],[-.46,.42],[-.55,.36+.05*s],[-.54,.12],[-.5,-.35]],a=new b0(r.map(([f,p])=>new ht(f*t,p*n))),o=new bl(a,{depth:e,bevelEnabled:!0,bevelThickness:e*.45,bevelSize:Math.min(.13,t*.04),bevelSegments:1,steps:1,curveSegments:1});o.translate(0,0,-e/2);const c=o.getAttribute("position"),l=new Float32Array(c.count*3),h=new vt(pi.ridge),u=new vt(pi.bone),d=new vt;for(let f=0;f<c.count;f++){const p=c.getY(f)/n;c.setZ(f,c.getZ(f)*(1-.6*N0(p))),d.copy(h).lerp(u,Sn(-.05,.6,p)),l[f*3]=d.r,l[f*3+1]=d.g,l[f*3+2]=d.b}return o.setAttribute("color",new Kt(l,3)),o.deleteAttribute("uv"),o.computeVertexNormals(),o}const Pw=n=>2.4+1.8*Sn(0,.16,n)-1.9*Sn(.22,.68,n)-.95*Sn(.68,1,n);function Iw(n){const t=new Xe({color:16777215,vertexColors:!0,roughness:.6,metalness:.05,emissive:F0,emissiveIntensity:0});return t.name=`kaiju-plate-${n}`,t.onBeforeCompile=e=>{e.fragmentShader=e.fragmentShader.replace("#include <emissivemap_fragment>",`#include <emissivemap_fragment>
 totalEmissiveRadiance *= 0.12 + 0.88 * smoothstep(0.08, 0.55, vColor.g);`)},t.customProgramCacheKey=()=>"kaiju-plate-v1",t}let io=null;function Dw(){if(io)return io;const n=document.createElement("canvas");n.width=n.height=64;const t=n.getContext("2d"),e=t.createRadialGradient(32,32,0,32,32,32);return e.addColorStop(0,"rgba(255,255,255,1)"),e.addColorStop(.2,"rgba(255,255,255,0.6)"),e.addColorStop(.5,"rgba(255,255,255,0.18)"),e.addColorStop(1,"rgba(255,255,255,0)"),t.fillStyle=e,t.fillRect(0,0,64,64),io=new Qc(n),io.colorSpace=rn,io}function Uw(n){let t=ba[0],e=1/0;const i=new C;for(const s of ba){const r=Em.find(o=>o.name===s),a=new ux(new C(...r.a),new C(...r.b)).closestPointToPoint(n,!0,i).distanceTo(n);a<e&&(e=a,t=s)}return t}function Nw(n){const t=new Map,e=new Map,i=(p,v,g,m)=>{const _=Pw(p.u)*g;if(_<.35)return;const x=p.o.clone().addScaledVector(p.side,v*.55).normalize(),b=Cw(p.p.clone().addScaledVector(p.side,v*.9),x),w=Sn(.42,.05,p.u),E=p.o.clone().addScaledVector(new C(0,1,0),(v?1.9:1.3)*w).addScaledVector(p.side,v*(.7+.6*w)).normalize(),A=new C().crossVectors(p.t,E).normalize(),T=new C().crossVectors(E,A).normalize();b.addScaledVector(E,-.4*Math.min(1,_/2));const M=Lw(_,_*(.86+.1*m),Math.max(.12,.085*_+.05),m);M.applyMatrix4(new se().makeBasis(T,E,A).setPosition(b));const y=Uw(b);if((t.get(y)??t.set(y,[]).get(y)).push(M),v===0){const S=e.get(y)??{p:new C,h:0,n:0};S.p.add(b.clone().addScaledVector(E,_*.4)),S.h+=_,S.n++,e.set(y,S)}};o1(1.55,.04,.985).forEach((p,v)=>i(p,0,1,v*.618%1)),o1(1.6,.035,.62).forEach((p,v)=>{for(const g of[-1,1])i(p,g,.6+.3*Sn(.3,.05,p.u),(v+(g>0?.5:0))*.382%1)}),ba.forEach((p,v)=>{const g=t.get(p);if(!g)return;const m=hs(g,!1);g.forEach(b=>b.dispose());const _=new mt(m,Iw(v));_.name=`kaiju-plates-${p}`,n.at(_,p,0,0,0);const x=e.get(p);if(x){const b=new m0({map:Dw(),color:0,blending:Ea,depthWrite:!1,transparent:!0,opacity:.9,toneMapped:!1});b.name=`kaiju-halo-${v}`,b.userData.keepBlend=!0;const w=new yp(b);w.scale.setScalar(x.h/x.n*3),w.renderOrder=5;const E=x.p.divideScalar(x.n);n.at(w,p,E.x,E.y,E.z)}});const s=new vt(pi.belly).multiplyScalar(.8),r=mn(Mw,bw,40,(p,v,g,m)=>{const _=Math.abs(p);v>zi-.1&&_<Hc(g)-.5?m.setHex(pi.mouth):v<14.6&&_<.9?m.copy(s):m.setHex(pi.skin)},16e3),a=new mt(r,Wp());a.name="kaiju-jaw",n.at(a,"jaw",0,0,0);const o=n.std({color:15525588,roughness:.45}),c=[],l=[];for(let p=0;p<7;p++)for(const v of[-1,1]){const g=2.3+p*.6,m=p===4?1.35:1;c.push(new gi(.15*m,.55*m,6).rotateX(Math.PI).translate(v*(Hc(g)-.14),zi-.22*m,g)),l.push(new gi(.12,.42,6).translate(v*(Hc(g)-.45),zi+.14,g+.3))}for(const p of[-1,1])c.push(new gi(.13,.42,6).rotateX(Math.PI).translate(p*.32,zi-.17,6.75));n.at(new mt(hs(c),o),"head",0,0,0),n.at(new mt(hs(l),o),"jaw",0,0,0);const h=new Xe({color:793130,emissive:F0,emissiveIntensity:0,roughness:.4});h.name="kaiju-core",h.onBeforeCompile=p=>{p.fragmentShader=p.fragmentShader.replace("#include <emissivemap_fragment>",`#include <emissivemap_fragment>
 float facing = abs(dot(normalize(normal), normalize(vViewPosition)));
 totalEmissiveRadiance *= 0.2 + 1.4 * facing * facing;`)},h.customProgramCacheKey=()=>"kaiju-core-v1";const u=new mt(new ie(1,16,10),h);u.scale.set(.85,.7,.6),n.at(u,"head",0,15,3.2);const d=n.std({color:15769624,emissive:16742912,emissiveIntensity:1,roughness:.18}),f=n.std({color:657414,roughness:.3});for(const p of[-1,1]){const v=new mt(new ie(.3,16,12),d),g=new mt(new ie(.15,10,8),f),m=new C(p*.6,.05,.8).normalize();g.position.copy(m).multiplyScalar(.24),g.scale.set(.35,1.3,.4),g.lookAt(m.clone().multiplyScalar(2)),v.add(g),n.at(v,"head",p*di[0],di[1],di[2])}}const c1=new WeakMap,Fw=new vt(F0),Ow={id:"kaiju",name:"Kaiju",blurb:"A city-stomper: open wide for atomic breath",segs:Em,body:{sdf:Lm,region:Sw,box:{min:[-5,-.3,-12],max:[6,19,7.6]},palette:ww,surface:"scales",weights:"sharp",capture:Aw,tint:Tw},dress:Nw,fit:{size:1.06,limb:.6,head:1},idle:{tail:.2},res:88,face:{jaw:.5,eyes:[[di[0],di[1],di[2]+.3,.38],[-1.26,di[1],di[2]+.3,.38]],breath:{colors:[10479871,3844351,3844351,2060287,16777215],rate:3,speed:1.4,size:1}},tick(n,t,e){let i=c1.get(n);const s=e?.jaw??0;if(!i){const l=ba.map(()=>null),h=ba.map(()=>null);let u=null;n.traverse(d=>{const f=d.material;if(!f||Array.isArray(f))return;const p=/^kaiju-plate-(\d)$/.exec(f.name),v=/^kaiju-halo-(\d)$/.exec(f.name);p&&(l[Number(p[1])]=f),v&&(h[Number(v[1])]=f),f.name==="kaiju-core"&&(u=f)}),i={plates:l,halos:h,core:u,charge:Sn(.15,.7,s),t},c1.set(n,i)}const r=Math.max(0,Math.min(.1,t-i.t));i.t=t;const a=Sn(.15,.7,s);i.charge+=(a-i.charge)*(1-Math.exp(-r/(a>i.charge?.12:.3)));const o=i.charge,c=ba.length;for(let l=0;l<c;l++){const h=l/(c-1),u=Sn(h*.45,h*.45+.5,o),d=1+.16*Math.sin(t*29+l*1.7)+.1*Math.sin(t*47+l*2.9)+.22*Math.max(0,Math.sin(t*11.3+l*.8)-.7)*3,f=i.plates[l],p=i.halos[l];f&&(f.emissiveIntensity=1.7*u*d,f.color.setRGB(1-.62*u,1-.5*u,1-.3*u)),p&&p.color.copy(Fw).multiplyScalar(.75*u*d)}i.core&&(i.core.emissiveIntensity=2.6*o*(1+.2*Math.sin(t*37)))}},wn=[2.5,14.55,0],Ke=[2.95,11.95,-.05],Di=[3.12,9.6,.35],kw=[0,16.35,-.25],Lc=n=>[-n[0],n[1],n[2]],Pm=[{name:"pelvis",a:[0,9.6,0],b:[0,10.6,0],parent:null},{name:"spine1",a:[0,10.6,0],b:[0,12.4,.1],parent:"pelvis"},{name:"spine2",a:[0,12.4,.1],b:[0,15,.1],parent:"spine1"},{name:"neck",a:[0,15,.1],b:[0,15.9,.15],parent:"spine2"},{name:"head",a:[0,15.9,.15],b:[0,18.4,.3],parent:"neck"},{name:"jaw",a:kw,b:[0,15.55,1],parent:"head",reach:0},{name:"tail1",a:[0,10.4,-1],b:[0,9.6,-1.1],parent:"pelvis",reach:0},{name:"tail2",a:[0,9.6,-1.1],b:[0,8.8,-1.2],parent:"tail1",reach:0},{name:"tail3",a:[0,8.8,-1.2],b:[0,8,-1.3],parent:"tail2",reach:0},{name:"tail4",a:[0,8,-1.3],b:[0,7.2,-1.4],parent:"tail3",reach:0},{name:"thighL",a:[1.1,9.6,0],b:[1.2,5.3,.2],parent:"pelvis"},{name:"shinL",a:[1.2,5.3,.2],b:[1.2,1.1,-.1],parent:"thighL"},{name:"footL",a:[1.2,1.1,-.1],b:[1.2,.35,1.4],parent:"shinL"},{name:"thighR",a:[-1.1,9.6,0],b:[-1.2,5.3,.2],parent:"pelvis"},{name:"shinR",a:[-1.2,5.3,.2],b:[-1.2,1.1,-.1],parent:"thighR"},{name:"footR",a:[-1.2,1.1,-.1],b:[-1.2,.35,1.4],parent:"shinR"},{name:"armL",a:wn,b:Ke,parent:"spine2"},{name:"forearmL",a:Ke,b:Di,parent:"armL"},{name:"armR",a:Lc(wn),b:Lc(Ke),parent:"spine2"},{name:"forearmR",a:Lc(Ke),b:Lc(Di),parent:"armR"}],so=n=>Pm.findIndex(t=>t.name===n),Bw={min:[-4.3,-.45,-4.1],max:[4.3,17.3,3.9]},El=(n,t)=>[n[0]-t[0],n[1]-t[1],n[2]-t[2]],O0=n=>Math.hypot(n[0],n[1],n[2]),zo=n=>{const t=O0(n)||1;return[n[0]/t,n[1]/t,n[2]/t]},Tl=(n,t)=>[n[1]*t[2]-n[2]*t[1],n[2]*t[0]-n[0]*t[2],n[0]*t[1]-n[1]*t[0]],ks=n=>n<0?0:n>1?1:n,As=(n,t,e)=>{const i=ks((e-n)/(t-n));return i*i*(3-2*i)},Im=(n,t,e)=>-B(-n,-t,e),ss=zo(El(Ke,wn)),Ui=O0(El(Ke,wn)),Vc=zo(Tl(ss,[0,0,1])),Sh=Tl(ss,Vc),On=zo(El(Di,Ke)),li=O0(El(Di,Ke)),po=zo(Tl(On,[0,0,1])),zc=Tl(On,po),rr=14.3,Gc=13.45;function k0(n,t,e){if(t<9.9)return 10.1-t;if(t>17.2)return t-17;const i=Math.abs(n);if(i>3.3)return i-3.05;if(e>2)return e-1.6;if(e<-1.8)return-1.5-e;let s=at(n,t,e,0,13.3,.05,1.5,1.85,.95);if(s=B(s,at(i,t,e,.6,13.25,.5,.6,.52,.5),.35),s=B(s,at(n,t,e,0,11.3,.05,1.16,1.2,.86),.7),t>13.3&&(s=B(s,K(i,t,e,0,15.02,-.14,2.2,14.62,-.06,.33,.36),.42),s=B(s,fe(i,t,e,wn[0],wn[1],wn[2],.45),.3),s=B(s,K(i,t,e,.2,14.78,.62,2.1,14.9,.22,.11,.1),.08),s=Im(s,-fe(n,t,e,0,14.92,.82,.16),.12),s=B(s,K(n,t,e,0,14.6,-.05,0,16.5,.05,.4,.36),.35),t<rr+.1&&t>Gc-.1)){const r=ks((rr-t)/(rr-Gc)),a=Math.atan2(n,e),o=Math.abs(Math.cos(a)),c=1+.045*r*Math.cos(16*a),l=(1.18+.4*r)*c,h=(.82+.5*r*(.6+.4*o))*c,u=(Math.hypot(n/l,(e-.05)/h)-1)*Math.min(l,h);s=Math.min(s,Math.max(u,t-rr,Gc-t))}return s}const ia=[{top:11.35,bot:7.1,r0:[1.22,.98],r1:[2.02,1.78],n:15},{top:7.6,bot:3.75,r0:[1.9,1.62],r1:[2.62,2.32],n:19},{top:4.25,bot:.12,r0:[2.48,2.18],r1:[3.28,2.98],n:23}],es=11.2,Dm=n=>-.028*(11.3-n);function Um(n,t,e){if(t>11.8)return t-11.6;const i=Math.hypot(n,e);if(i>4.1)return i-3.95;const s=Math.atan2(n,e),r=Dm(t);let a=Math.max((Math.hypot(n/1.36,(e-.05)/1.08)-1)*1.08,Math.abs(t-es)-.28);for(const o of ia){if(t>o.top+.4||t<o.bot-.4){a=Math.min(a,Math.max(t-o.top,o.bot-t));continue}const c=ks((o.top-t)/(o.top-o.bot)),l=As(.68,1,c),h=1+.065*l*Math.cos(o.n*s),u=.36*l*l,d=(o.r0[0]+(o.r1[0]-o.r0[0])*c+u)*h,f=(o.r0[1]+(o.r1[1]-o.r0[1])*c+u)*h,p=(Math.hypot(n/d,(e-r)/f)-1)*Math.min(d,f);a=Math.min(a,Math.max(p,t-o.top,o.bot-t))}return a}function Nm(n,t,e){if(n<1.6)return 1.75-n;if(t>15.3)return t-15.15;if(t<8.7)return 8.9-t;if(n>4.4)return n-4.1;let i=K(n,t,e,wn[0],wn[1],wn[2],Ke[0],Ke[1],Ke[2],.4,.36);const s=n-Ke[0],r=t-Ke[1],a=e-Ke[2],o=(s*On[0]+r*On[1]+a*On[2])/li,c=ks(o),l=s-On[0]*li*c,h=r-On[1]*li*c,u=a-On[2]*li*c,d=Math.hypot(l,h,u),f=As(.3,1,c),p=Math.atan2(l*zc[0]+h*zc[1]+u*zc[2],l*po[0]+h*po[1]+u*po[2]),v=.34+.4*f*f*(1+.14*f*Math.cos(9*p));i=B(i,Math.max(d-v,-o*li,(o-1)*li),.22),i=Math.max(i,-Math.max(d-(v-.13),(.78-o)*li));const g=n-wn[0],m=t-wn[1],_=e-wn[2],x=(g*ss[0]+m*ss[1]+_*ss[2])/Ui;if(x>.05&&x<.46){const b=g-ss[0]*Ui*x,w=m-ss[1]*Ui*x,E=_-ss[2]*Ui*x,A=ks((x-.14)/.24),T=Math.atan2(b*Sh[0]+w*Sh[1]+E*Sh[2],b*Vc[0]+w*Vc[1]+E*Vc[2]),M=(.47+.3*A)*(1+.07*A*Math.cos(10*T));i=Math.min(i,Math.max(Math.hypot(b,w,E)-M,(.14-x)*Ui,(x-.38)*Ui))}return i}function Hw(n,t,e){return Math.min(k0(n,t,e),Um(n,t,e),Nm(Math.abs(n),t,e))}const sa=0,Vu=1,Fm=2,kn=new Float64Array(3);let l1=NaN,h1=NaN,u1=NaN,al=0;function B0(n,t,e){if(n===l1&&t===h1&&e===u1)return al;kn[sa]=k0(n,t,e),kn[Vu]=Um(n,t,e),kn[Fm]=Nm(Math.abs(n),t,e);let i=0;for(let s=1;s<3;s++)kn[s]<kn[i]&&(i=s);return l1=n,h1=t,u1=e,al=i,i}const Vw=.2,$s=n=>kn[n]<=kn[al]+Vw,zw=(n,t,e,i)=>{B0(t,e,i);const s=n.name,r=s.endsWith("L")?1:s.endsWith("R")?-1:0,a=Math.abs(t);return r!==0&&t*r<-.05?!1:s.startsWith("arm")||s.startsWith("forearm")?al===Fm:s==="pelvis"?$s(Vu)||$s(sa)&&e<11.6:s==="spine1"?$s(Vu)&&e>9.8||$s(sa)&&e<13.2:s==="spine2"?$s(sa):s==="neck"?$s(sa)&&e>14.5&&a<1.1:s==="head"?$s(sa)&&e>15.8&&a<.9:!1},Gw=(n,t,e)=>B0(n,t,e);function Ww(n,t,e,i,s){const r=B0(t,e,i),a=Math.exp(-(kn[0]-kn[r])/.08),o=Math.exp(-(kn[1]-kn[r])/.08),c=Math.exp(-(kn[2]-kn[r])/.08),l=a+o+c;s.setRGB(a/l,o/l,c/l)}const Ys=n=>`vec3(${n.map(t=>t.toFixed(5)).join(", ")})`,Xw=`
  varying vec3 vBind; varying vec3 vBindN;
  vec3 srgb(float r, float g, float b) { return pow(vec3(r, g, b), vec3(2.2)); }
  // 1 where d < 0, antialiased over w
  float inside(float d, float w) { return 1.0 - smoothstep(-w, w, d); }
  // a row of round scallops along s, each one period wide and h deep (0 between them, h at a scallop's middle)
  float scallop(float s, float period, float h) { float q = 2.0 * fract(s / period) - 1.0; return h * sqrt(max(0.0, 1.0 - q * q)); }
  // lace: little rings on a lattice, cut by the surface
  vec3 lace(vec3 p, vec3 base, vec3 ink, float w) {
    vec3 q = fract(p * 5.5) - 0.5, r = fract(p * 5.5 + 0.5) - 0.5;
    float m = abs(length(q) - 0.26) - 0.05;
    m = min(m, length(q) - 0.08);
    float net = abs(length(r) - 0.36) - 0.025;
    return mix(base, ink, 0.5 * max(inside(m, w * 5.5), 0.6 * inside(net, w * 5.5)));
  }
  vec3 bone() { return srgb(0.94, 0.92, 0.88); }
  float segment2(vec2 p, vec2 a, vec2 b) { vec2 pa = p - a, ba = b - a; float h = clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0); return length(pa - ba * h); }
  vec3 red() { return srgb(0.56, 0.04, 0.1); }
  vec3 black() { return srgb(0.07, 0.05, 0.07); }
  vec3 laceInk() { return srgb(0.32, 0.26, 0.3); }
  vec3 purple() { return srgb(0.36, 0.13, 0.5); }
  vec3 marigold() { return srgb(1.0, 0.56, 0.06); }

  vec3 torsoCol(vec3 p, vec3 n, float w) {
    float th = atan(p.x, p.z);
    vec3 c = red();
    // the bodice's seams: eight thin darker lines down it
    float seam = abs(fract(th / 0.785 + 0.5) - 0.5) * 0.785 * 1.2;
    c *= 1.0 - 0.28 * inside(seam - 0.018, w);
    // the lacing down the front: a black cord criss-crossed between two rows of eyelets
    float ax = abs(p.x);
    float zone = inside(ax - 0.2, w) * inside(p.y - 13.0, w) * inside(11.55 - p.y, w) * step(0.2, n.z);
    float cord = abs(fract((p.y + 1.3 * ax) / 0.26) - 0.5) * 0.26 / 1.64 - 0.014;
    float edge = abs(ax - 0.2) - 0.022;
    c = mix(c, black(), zone * max(inside(cord, w) * inside(ax - 0.17, w), inside(edge, w)));
    // the lace frill with a scalloped hem, and above it the bare bone
    float bot = ${Gc.toFixed(2)} - scallop(th * 1.3, 0.3, 0.1);
    c = mix(c, lace(p, black(), laceInk(), w), inside(bot - p.y, w));
    // the bare bone: a soft shade down toward the frill, under each collarbone and in the notch between them
    vec3 b = bone() * mix(0.8, 1.0, smoothstep(${rr.toFixed(2)}, ${(rr+.45).toFixed(2)}, p.y));
    float front = smoothstep(0.0, 0.35, n.z);
    float clav = segment2(vec2(ax, p.y), vec2(0.22, 14.79), vec2(2.08, 14.91));
    b *= 1.0 - 0.18 * smoothstep(0.26, 0.08, clav) * front;
    b *= 1.0 - 0.3 * smoothstep(0.22, 0.0, length(vec2(p.x, p.y - 14.9))) * front;
    // the collarbones drawn as the face is painted: a soft grey line round each, the bone's knob at the shoulder
    vec3 ink = srgb(0.42, 0.4, 0.44);
    b = mix(b, ink, 0.75 * inside(abs(clav - 0.12) - 0.014, w) * front * step(0.24, ax));
    c = mix(c, b, inside(${(rr+.02).toFixed(2)} - p.y, w));
    return c;
  }

  vec3 skirtCol(vec3 p, vec3 n, float w) {
    float th = atan(p.x, p.z);
    float arc = th * length(p.xz);
    // the tier that shows here, its colour, its trim's, and how far up from its hem
    vec3 base, trim; float e;
    if (p.y > ${(ia[0].bot-.03).toFixed(2)}) { base = red(); trim = black(); e = p.y - ${ia[0].bot.toFixed(2)}; }
    else if (p.y > ${(ia[1].bot-.03).toFixed(2)}) { base = black(); trim = red(); e = p.y - ${ia[1].bot.toFixed(2)}; }
    else { base = purple(); trim = black(); e = p.y - ${ia[2].bot.toFixed(2)}; }
    // gathered: fine pleats shading the cloth
    vec3 c = base * (0.9 + 0.1 * cos(th * 56.0));
    // the trim: a lace band with a scalloped top along each ruffle's hem
    float top = 0.62 + scallop(arc, 0.42, 0.13);
    vec3 t = trim == black() ? lace(p, black(), laceInk(), w) : trim;
    c = mix(c, t, inside(e - top, w));
    // a thin marigold piping at the very hem of each tier
    c = mix(c, marigold(), inside(abs(e - 0.07) - 0.035, w));
    // the sash: purple satin, a marigold stripe along each edge
    float sa = abs(p.y - ${es.toFixed(2)});
    c = mix(c, purple() * 1.15, inside(sa - 0.3, w));
    c = mix(c, marigold(), inside(abs(sa - 0.22) - 0.035, w));
    // the underside of a ruffle is in its own shade
    c *= mix(1.0, 0.35, smoothstep(-0.2, -0.6, n.y));
    return c;
  }

  vec3 armCol(vec3 p, vec3 n, float w) {
    vec3 q = vec3(abs(p.x), p.y, p.z);
    vec3 nn = vec3(sign(p.x) * n.x, n.y, n.z);
    float tu = dot(q - ${Ys(wn)}, ${Ys(ss)}) / ${Ui.toFixed(5)};
    vec3 fo = q - ${Ys(Ke)};
    float tf = dot(fo, ${Ys(On)}) / ${li.toFixed(5)};
    vec3 radial = fo - ${Ys(On)} * ${li.toFixed(5)} * clamp(tf, 0.0, 1.0);
    float ph = atan(dot(radial, ${Ys(zc)}), dot(radial, ${Ys(po)}));
    vec3 c = red();
    // the bell cuff in black lace from mid-forearm, its top scalloped, a marigold piping at its rim
    float cuffTop = 0.42 - scallop(ph * 0.5, 0.35, 0.09);
    c = mix(c, lace(p, black(), laceInk(), w), inside(cuffTop - tf, w / ${li.toFixed(3)}));
    c = mix(c, marigold(), inside(abs(tf - 0.965) - 0.018, w / ${li.toFixed(3)}));
    // inside the open cuff: dark
    c = mix(c, black() * 0.4, step(0.75, tf) * smoothstep(0.1, -0.3, dot(nn, normalize(radial))));
    // the frill at the top of the sleeve, scalloped along its hem, and the bare shoulder above it
    float ub = 0.39 + scallop(ph * 0.5, 0.35, 0.06) / ${Ui.toFixed(3)};
    c = mix(c, lace(p, black(), laceInk(), w), inside(tu - ub, w / ${Ui.toFixed(3)}));
    c = mix(c, bone(), inside(tu - 0.14, w / ${Ui.toFixed(3)}));
    return c;
  }

  vec3 gown(vec3 p, vec3 n, vec3 k, float w) {
    vec3 c = vec3(0.0);
    if (k.x > 0.001) c += torsoCol(p, n, w) * k.x;
    if (k.y > 0.001) c += skirtCol(p, n, w) * k.y;
    if (k.z > 0.001) c += armCol(p, n, w) * k.z;
    return c / max(1e-4, k.x + k.y + k.z);
  }`;function qw(){const n=new Xe({vertexColors:!0,roughness:.62,metalness:0});return n.onBeforeCompile=t=>{t.vertexShader=t.vertexShader.replace("#include <common>",`#include <common>
 varying vec3 vBind; varying vec3 vBindN;`).replace("#include <begin_vertex>",`#include <begin_vertex>
 vBind = position; vBindN = normal;`),t.fragmentShader=t.fragmentShader.replace("#include <common>",`#include <common>
`+Xw).replace("#include <color_fragment>",`#include <color_fragment>
        float pw = max(length(fwidth(vBind)) * 0.6, 1e-4);
        // the vertex colour is the parts' weights (partTint), not a colour
        diffuseColor.rgb = gown(vBind, normalize(vBindN), diffuseColor.rgb, pw);`)},n.customProgramCacheKey=()=>"catrina-cloth-v4",n}const Om=1.32,km=-.1,H0=(n,t)=>Om*Math.atan2(n,t-km),ol=n=>{const t=Math.min(Math.abs(n),.95)/.7;return 16.08+.07*t*t},Fi=[.42,17,1.18];function Al(n,t,e){const i=Math.abs(n);let s=at(n,t,e,0,17.42,-.08,1.02,1.1,1.22);return s=B(s,at(n,t,e,0,16.85,-.38,.9,.6,.85),.3),s=B(s,at(n,t,e,0,16.75,.45,.82,.88,.78),.35),s=B(s,at(i,t,e,.66,16.68,.72,.3,.28,.42),.25),s=B(s,at(n,t,e,0,16,.5,.68,.5,.62),.35),s=B(s,at(n,t,e,0,15.68,.82,.3,.22,.28),.25),s=Im(s,-at(i,t,e,Fi[0],Fi[1],Fi[2],.3,.28,.22),.1),s}const Bm=(n,t,e)=>Math.max(t-ol(H0(n,e)),-.05-e),$w=(n,t,e)=>Math.max(Al(n,t,e),-Bm(n,t,e)),Yw=(n,t,e)=>Math.max(Al(n,t,e),Bm(n,t,e)),jw=new vt(16052200),Zw=new vt(1705480);function f1(n,t,e,i){const s=Al(n,t,e)<-.025&&Math.abs(t-ol(H0(n,e)))<.06;i.copy(s?Zw:jw)}const Kw=`
  varying vec3 vBind;
  vec3 srgb(float r, float g, float b) { return pow(vec3(r, g, b), vec3(2.2)); }
  float inside(float d, float w) { return 1.0 - smoothstep(-w, w, d); }
  float dot2(vec2 v) { return dot(v, v); }
  // Inigo Quilez's heart: its point at the origin, its lobes up to y = 1.1, half as wide
  float heart(vec2 p) {
    p.x = abs(p.x);
    if (p.y + p.x > 1.0) return sqrt(dot2(p - vec2(0.25, 0.75))) - sqrt(2.0) / 4.0;
    return sqrt(min(dot2(p - vec2(0.0, 1.0)), dot2(p - 0.5 * max(p.x + p.y, 0.0)))) * sign(p.x - p.y);
  }
  float segment(vec2 p, vec2 a, vec2 b) { vec2 pa = p - a, ba = b - a; float h = clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0); return length(pa - ba * h); }
  float mouthY(float u) { float a = min(abs(u), 0.95) / 0.7; return 16.08 + 0.07 * a * a; }

  vec3 paint(vec3 base, vec3 p, float w) {
    vec3 BLACK = srgb(0.05, 0.03, 0.05), ORANGE = srgb(1.0, 0.52, 0.02), MAGENTA = srgb(0.9, 0.1, 0.5);
    vec3 TURQ = srgb(0.05, 0.75, 0.78), RED = srgb(0.85, 0.06, 0.12);
    float u = ${Om.toFixed(3)} * atan(p.x, p.z - (${km.toFixed(3)})), v = p.y, au = abs(u);
    vec2 f = vec2(u, v);
    vec3 c = base;
    const float TAU = 6.2831853, N = 10.0;
    // a ring of petals round each socket, shorter toward the nose, a dot past each tip
    vec2 q = vec2(au - ${Fi[0].toFixed(3)}, v - ${Fi[1].toFixed(3)});
    float rho = length(q), phi = atan(q.y, q.x);
    float k = floor(phi / TAU * N + 0.5), pk = k * TAU / N, dl = phi - pk;
    float r0 = 0.28, L = 0.2 * (0.45 + 0.55 * smoothstep(-0.9, 0.3, cos(pk)));
    float tt = clamp((rho - r0) / L, 0.0, 1.0);
    float wd = 0.1 * pow(sin(3.14159 * tt), 0.7) * (0.65 + 0.35 * L / 0.2);
    float dp = max(abs(dl) * rho - wd, max(r0 - 0.03 - rho, rho - r0 - L));
    float ki = mod(k + 30.0, 3.0);
    vec3 pc = ki < 0.5 ? ORANGE : ki < 1.5 ? MAGENTA : TURQ;
    c = mix(c, pc, inside(dp, w));
    c = mix(c, BLACK, inside(abs(dp) - 0.008, w) * step(r0 - 0.01, rho));
    vec2 tip = vec2(cos(pk), sin(pk)) * (r0 + L + 0.06);
    c = mix(c, pc, inside(length(q - tip) - 0.028, w));
    // the socket, black
    c = mix(c, BLACK, inside((length(q / vec2(0.3, 0.28)) - 1.0) * 0.28, w));
    // the nose: an upside-down heart
    c = mix(c, BLACK, inside(heart(vec2(u, 16.74 - v) / 0.24) * 0.24, w));
    // the stitched smile along the jaw's seam
    float um = clamp(u, -0.92, 0.92);
    c = mix(c, BLACK, inside(length(vec2(u - um, v - mouthY(um))) - 0.02, w));
    float sp = 0.088, us = clamp(floor(u / sp + 0.5), -10.0, 10.0) * sp;
    float hs = 0.1 * (1.0 - 0.45 * pow(min(abs(us), 0.9) / 0.9, 2.0));
    float ds = segment(f, vec2(us, mouthY(us) - hs), vec2(us, mouthY(us) + hs)) - 0.017;
    c = mix(c, BLACK, inside(ds, w) * step(abs(us), 0.9));
    // a swirl on each cheek
    vec2 cq = vec2(au - 0.74, v - 16.42);
    float cr = length(cq), ca = atan(cq.y, cq.x);
    float sw = max(abs(fract(cr / 0.05 - ca / TAU + 0.5) - 0.5) * 0.05 - 0.009, cr - 0.155);
    c = mix(c, TURQ, inside(sw, w));
    // a flower on the forehead: six marigold petals round a magenta heart of a centre
    vec2 fq = vec2(u, v - 17.74);
    float fr = length(fq), fa = atan(fq.y, fq.x);
    c = mix(c, ORANGE, inside(fr - 0.2 * (0.5 + 0.5 * abs(cos(fa * 3.0))), w));
    c = mix(c, MAGENTA, inside(fr - 0.07, w));
    // a heart on the chin
    c = mix(c, RED, inside(heart(vec2(u, v - 15.6) / 0.14) * 0.14, w));
    return c;
  }`;function Jw(n){const t=n.std({name:"catrina-face",color:16777215,vertexColors:!0,roughness:.42,metalness:0,emissive:16777215,emissiveIntensity:.14});return t.onBeforeCompile=e=>{e.vertexShader=e.vertexShader.replace("#include <common>",`#include <common>
 varying vec3 vBind;`).replace("#include <begin_vertex>",`#include <begin_vertex>
 vBind = position;`),e.fragmentShader=e.fragmentShader.replace("#include <common>",`#include <common>
`+Kw).replace("#include <color_fragment>",`#include <color_fragment>
        float fw = max(length(fwidth(vBind)) * 0.6, 1e-4);
        float skin = smoothstep(0.25, 0.6, diffuseColor.r);
        diffuseColor.rgb = mix(diffuseColor.rgb, paint(diffuseColor.rgb, vBind, fw), skin);`).replace("#include <emissivemap_fragment>",`#include <emissivemap_fragment>
 totalEmissiveRadiance *= diffuseColor.rgb;`)},t.customProgramCacheKey=()=>"catrina-face-v2",t}const Do=n=>new C(n[0],n[1],n[2]);let Wc=1;const ar=()=>(Wc=Wc*1664525+1013904223>>>0,Wc/4294967296);function We(n,t){const e=n.index?n.toNonIndexed():n;e!==n&&n.dispose(),e.deleteAttribute("uv"),e.attributes.normal||e.computeVertexNormals();const i=e.attributes.position,s=i.count,r=new Float32Array(s*3),a=new vt;for(let o=0;o<s;o++)typeof t=="function"?(a.setRGB(1,1,1),t(i.getX(o),i.getY(o),i.getZ(o),a)):a.set(t),r[o*3]=a.r,r[o*3+1]=a.g,r[o*3+2]=a.b;return e.setAttribute("color",new Kt(r,3)),e}function Bn(n){const t=hs(n,!1);for(const e of n)e.dispose();return t}function Hm(n,t){const e=Do(t).sub(Do(n)).normalize(),i=new C(1,0,0).addScaledVector(e,-e.x);i.lengthSq()<1e-6&&i.set(0,0,1),i.normalize();const s=new C().crossVectors(i,e);return new se().makeBasis(i,e,s).setPosition(n[0],n[1],n[2])}function or(n,t,e=[1,1,1],i=10){return new ie(t,i,Math.max(5,Math.round(i*.7))).scale(e[0],e[1],e[2]).translate(n[0],n[1],n[2])}function js(n,t,e,i,s){const r=Do(t).distanceTo(Do(n)),a=2,o=5,c=[];for(let h=0;h<=a;h++){const u=-Math.PI/2+h/a*(Math.PI/2);c.push(new ht(Math.max(.001,e*Math.cos(u)),e*.75*Math.sin(u)))}const l=Math.min(.2,1.3*Math.max(e,s)/r);for(let h=1;h<o;h++){const u=h/o;c.push(new ht(i+(e-i)*Math.exp(-((u/l)**2))+(s-i)*Math.exp(-(((1-u)/l)**2)),u*r))}for(let h=0;h<=a;h++){const u=h/a*(Math.PI/2);c.push(new ht(Math.max(.001,s*Math.cos(u)),r+s*.75*Math.sin(u)))}return new bi(c,6).applyMatrix4(Hm(n,t))}function Qw(n,t){const e=Hm(n,[n[0]+t[0],n[1]+t[1],n[2]+t[2]]),i=1.42,s=(u,d,f)=>{const p=new C(u*i,d*i,f*i).applyMatrix4(e);return[p.x,p.y,p.z]},r=[];for(const[u,d,f]of[[0,.1,.14],[0,.1,-.02],[0,.1,-.18],[.02,.3,.18],[.02,.3,0],[.02,.3,-.16]])r.push(or(s(u,d,f),.13,[1,1,1],7));const a=[[.2,1.05],[.07,1.14],[-.07,1.06],[-.19,.88]];for(const[u,d]of a){const f=s(.02,.4,u*.85),p=s(0,.4+.55*d,u),v=s(-.07,.4+.93*d,u*1.05),g=s(-.16,.4+1.17*d,u*1.08),m=s(-.26,.4+1.33*d,u*1.08);r.push(js(f,p,.1,.07,.105),js(p,v,.1,.066,.095),js(v,g,.09,.06,.082),js(g,m,.078,.055,.06))}const o=s(0,.25,.24),c=s(-.05,.6,.46),l=s(-.1,.88,.56),h=s(-.16,1.08,.6);return r.push(js(o,c,.11,.08,.1),js(c,l,.1,.072,.088),js(l,h,.088,.064,.06)),r}const d1=[16747008,16753178,15888896,16758320,15229952].map(n=>new vt(n));function zu(n){const t=[],i=new se;for(let s=0;s<34;s++){const r=(s+.5)/34,a=Math.acos(1-r*1.2),o=s*2.39996+ar()*.3,c=new C(Math.sin(a)*Math.cos(o),Math.cos(a),Math.sin(a)*Math.sin(o)),l=new C(-Math.sin(o),0,Math.cos(o)),h=new C().crossVectors(l,c);i.makeBasis(l,c,h).setPosition(c.clone().multiplyScalar(n*.62));const u=new ie(1,6,4).scale(.08*n,.38*n,.26*n).applyMatrix4(i),d=d1[Math.floor(ar()*d1.length)].clone().multiplyScalar(.8+.2*Math.sin(a));t.push(We(u,d))}return t.push(We(new ie(n*.6,10,7),14178816)),Bn(t)}function Vm(n,t=11538464){const r=[],a=(u,d)=>{const f=u/72,p=f*2.7*Math.PI*2,v=n*(.1+.62*f),g=1-.22*Math.abs(Math.sin(p*1.25)),m=n*(-.08-.3*f),_=n*(.42-.14*f)*g,x=d/2,b=m+(_-m)*x,w=v*(.82+.18*x+.4*f*x*x);return[Math.cos(p)*w,b,Math.sin(p)*w]};for(let u=0;u<72;u++)for(let d=0;d<2;d++){const f=a(u,d),p=a(u+1,d),v=a(u+1,d+1),g=a(u,d+1);r.push(...f,...p,...v,...f,...v,...g)}const o=new me;o.setAttribute("position",new re(r,3)),o.computeVertexNormals();const c=new vt(t),l=c.clone().multiplyScalar(.45),h=[We(o,(u,d,f,p)=>p.copy(l).lerp(c,ks(Math.hypot(u,f)/(n*.5))*.6+ks((d+.2*n)/(.6*n))*.4))];return h.push(We(or([0,-.12*n,0],n*.42,[1,.6,1],10),l)),Bn(h)}function tS(n,t,e){const i=[];for(let s=0;s<5;s++){const r=s/5*Math.PI*2;i.push(We(new ie(1,7,4).scale(n*.5,n*.12,n*.32).translate(n*.5,0,0).rotateY(r),t))}return i.push(We(or([0,.05*n,0],n*.22,[1,.7,1],8),e)),Bn(i)}function Gu(n){const t=new ie(1,8,5).scale(n*.22,n*.03,n*.5),e=t.attributes.position;for(let i=0;i<e.count;i++){const s=e.getZ(i)/(n*.5);e.setX(i,e.getX(i)*(1-.55*Math.max(0,s))),e.setY(i,e.getY(i)+.05*n*s*s)}return t.computeVertexNormals(),We(t.translate(0,0,n*.45),3107372)}function p1(n,t,e,i,s=54){const r=new ei(n.map(Do)),a=[We(new ps(r,24,.035,4,!1),e)],o=new vt(e),c=new vt(i),l=new C(0,-1,0);for(let h=0;h<s;h++){const u=.05+.95*(h/s),d=r.getPoint(u),f=r.getTangent(u),p=new C().crossVectors(f,new C(0,1,0));p.lengthSq()<1e-4&&p.set(1,0,0),p.normalize();const v=t*(.3+.7*Math.pow(Math.sin(Math.PI*Math.min(1,u*1.1)),.6));for(const g of[-1,1])for(let m=0;m<2;m++){const _=p.clone().multiplyScalar(g).addScaledVector(l,.35+.3*m+.2*u).addScaledVector(f,.35).normalize();_.x+=(ar()-.5)*.3,_.y+=(ar()-.5)*.3,_.z+=(ar()-.5)*.3,_.normalize();const x=v*(.75+.35*ar())*(m?.8:1),b=new gi(.05,x,3,1).translate(0,x/2,0);b.applyQuaternion(new Me().setFromUnitVectors(new C(0,1,0),_)).translate(d.x,d.y,d.z),a.push(We(b,(w,E,A,T)=>T.copy(o).lerp(c,ks(Math.hypot(w-d.x,E-d.y,A-d.z)/x))))}}return Bn(a)}const Eh=2.7,ns=1.1;function eS(){const n=[];for(let s=0;s<=6;s++){const r=s/6;n.push(new ht(ns-.07*r,.7*r))}for(let s=1;s<=8;s++){const r=s/8*Math.PI/2;n.push(new ht(Math.max(.001,(ns-.07)*Math.cos(r)),.7+.42*Math.sin(r)))}const t=[];for(let s=0;s<=14;s++){const r=s/14,a=ns-.02+r*(Eh-ns);t.push(new ht(a,-.06*Math.sin(Math.PI*r)+.26*r**4))}const e=Bn([We(new bi(n,48),1577500),We(new bi(t,64),1577500),We(new zn(Eh,.06,6,96).rotateX(Math.PI/2).translate(0,.26,0),2365994)]),i=e.attributes.position;for(let s=0;s<i.count;s++){const r=i.getX(s),a=i.getZ(s),o=Math.hypot(r,a);if(o>ns){const c=(o-ns)/(Eh-ns);i.setY(s,i.getY(s)+.1*c*c*Math.sin(3*Math.atan2(r,a)+.6))}}return e.computeVertexNormals(),e}function Th(n,t,e,i,s=.75,r=0){const a=t*Math.PI/180,o=new C(Math.sin(a),0,Math.cos(a)),c=o.clone().multiplyScalar(s).add(new C(0,1,0)).normalize();return n.rotateY(r),n.applyQuaternion(new Me().setFromUnitVectors(new C(0,1,0),c)),n.translate(o.x*e,i,o.z*e)}function nS(){const n=[],t=[[35,1.32,.62,.62,1.6],[72,1.26,.82,.58,1.6],[104,1.3,.52,.5,1.8],[6,1.36,.5,.46,1.8],[50,.9,1.18,.52,.8],[-150,1.3,.55,.5,1.6],[-118,1.36,.45,.4,1.8],[56,2.3,.3,.46,1.2]];for(const[s,r,a,o,c]of t)n.push(Th(zu(o),s,r,a,c));const e=[[18,1.25,.98,.42,1.2],[92,1.05,1.12,.42,1],[54,1.62,.36,.46,1.6],[-14,1.38,.78,.36,1.5],[128,1.42,.45,.4,1.8],[-172,1.38,.62,.44,1.6],[28,2.28,.26,.38,1.2],[-36,1,1.1,.34,.8]];for(const[s,r,a,o,c]of e)n.push(Th(Vm(o),s,r,a,c,ar()*6));const i=[[-28,1.3,.45,.26,14690426],[116,1.18,.95,.26,16051450],[78,1.62,.36,.26,14690426],[-138,1.22,.9,.26,10107592],[0,1.1,1.06,.24,16051450],[40,2.4,.2,.22,14690426],[150,1.35,.5,.24,10107592]];for(const[s,r,a,o,c]of i)n.push(Th(tS(o,c,16765498),s,r,a,1.4));for(const[s,r,a,o,c]of[[30,2.2,.25,1,.2],[90,2,.35,.95,-.3],[125,2,.3,.85,.4],[-160,2,.3,.85,.2],[-5,2,.3,.8,-.4],[60,2.5,.2,.8,-.3]]){const l=s*Math.PI/180;n.push(Gu(o).rotateX(-.35).rotateY(l+c).translate(Math.sin(l)*r*.62,a,Math.cos(l)*r*.62))}return Bn(n)}function iS(){return Bn([p1([[1,.6,-.35],[1.25,1.7,-.45],[.95,2.55,-1.05],[.35,2.75,-1.9],[-.05,2.35,-2.55]],.7,16447218,15784172,60),p1([[1.25,.5,.05],[1.85,1.45,-.15],[2.45,1.95,-.7],[2.85,1.7,-1.35]],.5,13641856,9050762,44)])}function sS(n,t){let e=0,i=2;for(let s=0;s<30;s++){const r=(e+i)/2;Al(n,t,r)<0?e=r:i=r}return e}function rS(n,t){let e=0,i=2;for(let s=0;s<26;s++){const r=(e+i)/2;k0(n[0]+t[0]*r,n[1]+t[1]*r,n[2]+t[2]*r)<0?e=r:i=r}return e}const Ah=[.05,18.15,-.05],aS=new gn(-.14,.15,.1);function oS(n){Wc=11;const t=n.bones.get("pelvis").parent;if(t?.isSkinnedMesh){const b=t.geometry,w=b.attributes.position,E=b.attributes.color,A=b.attributes.skinIndex,T=b.attributes.skinWeight,M=so("pelvis"),y=so("thighL"),S=so("thighR"),R=so("armL"),I=so("armR");for(let L=0;L<w.count;L++){const D=w.getX(L),k=w.getY(L),q=w.getZ(L),z=Math.abs(D),it=E.getX(L)+E.getY(L)+E.getZ(L)||1,ut=E.getX(L)/it;if(E.getY(L)/it>.5&&k<10.5){const _t=Dm(k),Ut=.42*As(-.3,.9,(q-_t)/Math.max(.5,Math.hypot(D,q-_t)))*As(10.4,6.8,k)*(1-.55*As(5.5,1,k)),ct=As(-.9,.9,D);A.setXYZW(L,M,y,S,0),T.setXYZW(L,1-Ut,Ut*ct,Ut*(1-ct),0)}else if(ut>.5&&k>13.8&&z>1.25){const _t=As(1.25,2.3,z)*As(13.8,14.35,k);_t>0&&(A.setZ(L,D>0?R:I),T.setXYZW(L,T.getX(L)*(1-_t),T.getY(L)*(1-_t),_t,0))}}A.needsUpdate=!0,T.needsUpdate=!0,t.material.dispose(),t.material=qw()}const e=(b,w,E,A)=>{const T=new mt(b,E);return T.name=A,n.at(T,w,0,0,0),T},i=(b,w,E,A)=>{for(const T of["L","R"]){const M=new mt(b,E);M.name=`${A}${T}`,T==="R"&&(M.scale.x=-1),n.at(M,w+T,0,0,0)}},s=Jw(n);e(mn($w,{min:[-1.12,15.8,-1.42],max:[1.12,18.6,1.4]},54,f1,5e4),"head",s,"catrina-skull"),e(mn(Yw,{min:[-.92,15.38,-.12],max:[.92,16.3,1.38]},34,f1,16e3),"jaw",s,"catrina-jaw");const r=n.std({color:16183522,roughness:.35}),a=b=>{const w=[];for(let E=0;E<10;E++){const A=-.45+E/9*.9,T=H0(A,1),M=ol(T)+(b?-.07:.07),y=sS(A,ol(T)+(b?.04:-.04))-.1;w.push(new yo(.055,.08,2,6).scale(1,1,.7).rotateY(Math.atan2(A,.8)).translate(A,M,y))}return Bn(w.map(E=>We(E,16183522)))};e(a(!0),"head",r,"catrina-teeth"),e(a(!1),"jaw",r,"catrina-lowerteeth"),e(or([0,16.02,.5],1,[.56,.3,.5],14),"head",n.std({color:1311754,roughness:.8}),"catrina-mouth");const o=n.std({color:14725184,roughness:.25,metalness:.85}),c=[];for(const b of[1,-1])c.push(We(or([b*.93,16.5,-.18],.07,[1,1,1],8),16777215),We(new zn(.1,.025,6,16).rotateY(Math.PI/2).translate(b*.95,16.33,-.18),16777215),We(or([b*.95,16.1,-.18],.1,[.8,1.4,.8],10),16777215));e(Bn(c),"head",o,"catrina-earrings");const l=new we;l.name="catrina-hat",l.add(new mt(eS(),n.std({vertexColors:!0,roughness:.7,metalness:.05,side:ye}))),l.add(new mt(new An(ns+.02,ns+.03,.36,48,1,!0).translate(0,.2,0),n.std({color:6957712,roughness:.35,metalness:.1,side:ye})));const h=n.std({vertexColors:!0,roughness:.6,side:ye});l.add(new mt(nS(),h));const u=new mt(iS(),n.std({vertexColors:!0,roughness:.85,side:ye}));u.name="catrina-plumes",l.add(u),l.rotation.copy(aS),n.at(l,"head",Ah[0],Ah[1],Ah[2]);const d=n.std({color:15920352,roughness:.45,emissive:2762272,emissiveIntensity:1}),f=[Di[0]-Ke[0],Di[1]-Ke[1],Di[2]-Ke[2]];i(Bn(Qw([Di[0]-On[0]*.35,Di[1]-On[1]*.35,Di[2]-On[2]*.35],f).map(b=>We(b,16777215))),"forearm",d,"catrina-hand");const p=15.35;e(new zn(.43,.075,8,32).rotateX(Math.PI/2).scale(1,1.6,1).translate(0,p,.02),"neck",n.std({color:1182740,roughness:.8}),"catrina-choker");const v=zu(.17);v.rotateX(Math.PI/2).translate(0,p-.05,.5),e(v,"neck",h,"catrina-neckflower");const g=[];for(const[b,w,E]of[[.45,.075,30],[.85,.065,42]])for(let A=0;A<E;A++){const T=-Math.PI+(A+.5)/E*Math.PI*2,M=(1+Math.cos(T))/2,y=[.42*Math.sin(T),15.12-b*M*M,.02+.42*Math.cos(T)],S=zo([Math.sin(T)*(.25+M),1.2*(1-M)*(1-M),Math.cos(T)*(.25+M)]),R=rS(y,S)+w*.85;g.push(We(new ie(w,6,4).translate(y[0]+S[0]*R,y[1]+S[1]*R,y[2]+S[2]*R),16777215))}e(Bn(g),"spine2",n.std({color:16183270,roughness:.18,metalness:.1,emissive:3157032,emissiveIntensity:1}),"catrina-pearls");const m=Bn([zu(.3).rotateX(1.3).rotateY(.5).translate(.95,es+.05,1.05),Vm(.26).rotateX(1.2).rotateY(.9).translate(1.3,es-.15,.62),Gu(.6).rotateY(1.2).translate(1.2,es-.3,.9),Gu(.55).rotateY(-.2).rotateZ(-.6).translate(.75,es-.25,1.05)]);e(m,"pelvis",h,"catrina-corsage");const _=-1.1,x=[or([0,es,_-.06],1,[.2,.22,.14],10)];for(const b of[1,-1]){x.push(new zn(.36,.11,8,20).scale(1,.62,.45).rotateZ(b*.18).translate(b*.4,es+.04,_));const w=new yo(.12,1.3,3,8).scale(1.6,1,.4);w.rotateZ(b*.2).rotateX(-.12).translate(b*.28,es-.78,_-.12),x.push(w)}e(Bn(x.map(b=>We(b,16777215))),"pelvis",n.std({color:6957712,roughness:.35,metalness:.1}),"catrina-bow")}const m1=new WeakMap,cS={id:"catrina",name:"Catrina",blurb:"A sugar-skull lady in a flowered hat",segs:Pm,body:{sdf:Hw,region:Gw,box:Bw,palette:[16711680,65280,255],tint:Ww,surface:"soft",weights:"sharp",capture:zw},dress:oS,fit:{size:1.06,limb:.6},face:{jaw:.35,eyes:[[Fi[0],Fi[1],Fi[2]-.04,.3],[-.42,Fi[1],Fi[2]-.04,.3]]},res:80,tick(n,t){let e=m1.get(n);e===void 0&&(e=n.getObjectByName("catrina-plumes")??null,m1.set(n,e)),e&&(e.rotation.x=.03*Math.sin(t*1.3),e.rotation.z=.025*Math.sin(t*.9+1))}},V0=n=>n<0?0:n>1?1:n,nn=(n,t,e)=>{const i=V0((e-n)/(t-n));return i*i*(3-2*i)},lS=(n,t,e)=>-B(-n,-t,e),Ba=.12,zm=.3,Zr={c:[0,17.25,.15],r:[1.42,1.5,1.38]},z0=n=>.55*Math.sin(7*n+.3)+.3*Math.sin(12*n+1.7)+.15*Math.sin(17*n+.4),Gm=n=>.06+.42*nn(14.8,5.4,n),hS=(n,t)=>4.9-.45*n-.08*Math.sin(29*t+1.1);function Wm(n,t,e,i){const s=V0((14-t)/9.2),r=3.3+.45*s,a=1.72+.62*s,o=e-Ba,c=Math.hypot(n/r,o/a),l=Math.hypot(n/(r*r),o/(a*a));return(l>1e-6?c*(c-1)/l:-Math.min(r,a))-Gm(t)*i}function Xm(n,t,e){const i=e-Ba;if(t<15.4&&n*n/30+i*i/15.2>1)return 2;let s=at(n,t,e,Zr.c[0],Zr.c[1],Zr.c[2],Zr.r[0],Zr.r[1],Zr.r[2]);const r=Math.atan2(i,n),a=z0(r);if(s=B(s,at(n,t,e,0,14,.1,3.3,2.55,1.72)-Gm(t)*a*nn(16.4,14,t),1.1),t<15.4){const o=Wm(n,t,e,a);s=Math.min(s,Math.max(o,t-14)),s=Math.max(s,hS(a,r)-t),t<11&&(s=Math.max(s,-lS(o+zm,t-10,.6)))}return s}const qm=0,uS=1;function fS(n,t,e){return t<10.6&&Wm(n,t,e,z0(Math.atan2(e-Ba,n)))<-zm*.5?uS:qm}const dS=new vt(10003644);function pS(n,t,e,i,s){if(n!==qm)return;const r=z0(Math.atan2(i-Ba,t)),a=nn(15.5,5.6,e);s.lerp(dS,V0(.75*a*Math.max(0,-r)+.1*a));const o=nn(1.1,.4,Math.abs(e-15.85))*nn(1.6,.9,Math.hypot(t,i-.1));s.multiplyScalar(1-.12*o)}const mS={min:[-4.55,3.95,-2.95],max:[4.55,19.1,3.2]},g1=["head","armL","forearmL","armR","forearmR","thighL","thighR","spine2","spine1","pelvis"],[gS,vS,xS,_S,MS,bS,yS,wS,SS,ES]=[0,1,2,3,4,5,6,7,8,9];function TS(n,t,e,i){i.fill(0);const s=Math.abs(n),r=n>=0,a=15.65-.55*nn(.3,1.2,e),o=nn(a,a+.85,t),c=(1-o)*nn(1.45,2.95,s)*nn(15.4,14.3,t)*nn(5.6,9.4,t),l=c*nn(12.6,10.9,t),h=(1-o-c)*.65*nn(9.7,6.9,t)*nn(-1.9,-.3,e-Ba),u=h*nn(-1.1,1.1,n),d=Math.max(0,1-o-c-h),f=nn(12.6,13.9,t),p=1-nn(10,11.3,t);i[gS]=o,i[r?vS:_S]=c-l,i[r?xS:MS]=l,i[bS]=u,i[yS]=h-u,i[wS]=d*f,i[SS]=d*(1-f-p),i[ES]=d*p}function AS(n,t){const e=n.geometry.attributes.position,i=n.geometry.attributes.skinIndex,s=n.geometry.attributes.skinWeight,r=g1.map(c=>t.findIndex(l=>l.name===c)),a=new Float32Array(g1.length),o=[0,0,0,0];for(let c=0;c<e.count;c++){TS(e.getX(c),e.getY(c),e.getZ(c),a);let l=0;for(let h=0;h<4;h++){let u=-1;for(let d=0;d<a.length;d++)a[d]>1e-4&&(u<0||a[d]>a[u])&&(u=d);o[h]=u,u>=0&&(l+=a[u],a[u]=-a[u])}for(let h=0;h<4;h++){const u=o[h];i.setComponent(c,h,u>=0?r[u]:0),s.setComponent(c,h,u>=0?-a[u]/l:0)}}i.needsUpdate=!0,s.needsUpdate=!0}function Rl(n,t){let e=0,i=3.2;for(let s=0;s<32;s++){const r=(e+i)/2;Xm(n,t,r)<0?e=r:i=r}return e}const Zn={x:.47,y:17.48,rx:.29,ry:.43,tilt:.08},Ai={top:16.93,rx0:.25,ry0:.17,rx1:.21,ry1:.52},Wu=Rl(Zn.x,Zn.y),RS=Rl(0,16.75),CS=Mm.map(n=>n.name==="jaw"?{name:"jaw",a:[0,16.75,.55],b:[0,16.75,RS+.15],parent:"head",reach:0}:n.name.startsWith("tail")?{...n,reach:0}:n);function v1(n,t,e=6,i=28){const r=c=>{const l=[],h=Math.cos(c.tilt),u=Math.sin(c.tilt),d=(f,p)=>{const v=c.cx+f*h-p*u,g=c.cy+f*u+p*h;l.push(v-t.x,g-t.y,Rl(v,g)+.018-t.z)};d(0,0);for(let f=1;f<=e;f++)for(let p=0;p<i;p++){const v=p/i*Math.PI*2,g=f/e;d(Math.cos(v)*c.rx*g,Math.sin(v)*c.ry*g)}return new Float32Array(l)},a=[];for(let c=0;c<i;c++)a.push(0,1+c,1+(c+1)%i);for(let c=1;c<e;c++)for(let l=0;l<i;l++){const h=1+(c-1)*i+l,u=1+(c-1)*i+(l+1)%i,d=h+i,f=u+i;a.push(h,d,f,h,f,u)}const o=new me;return o.setAttribute("position",new Kt(r(n[0]),3)),o.setIndex(a),o.computeVertexNormals(),n.length>1&&(o.morphAttributes.position=n.slice(1).map(c=>new Kt(r(c),3))),o}const $m={value:0};function LS(){const n=new Xe({vertexColors:!0,roughness:.86,metalness:0,emissive:12900607,emissiveIntensity:.1});return n.onBeforeCompile=t=>{t.uniforms.uFlutter=$m,t.vertexShader=t.vertexShader.replace("#include <common>",`#include <common>
 uniform float uFlutter;`).replace("#include <begin_vertex>",`#include <begin_vertex>
        { // the hem stirs: slow ripples round it, growing toward the edge; in bind pose, so it rides the bones
          float hem = smoothstep(8.2, 4.8, position.y);
          if (hem > 0.0) {
            vec2 r = vec2(position.x, position.z - ${Ba.toFixed(2)});
            float th = atan(r.y, r.x);
            float w = 0.6 * sin(uFlutter * 2.1 + th * 3.0 + position.y * 0.9) + 0.4 * sin(uFlutter * 3.3 - th * 5.0 + 1.3);
            transformed.xz += normalize(r + 1e-4) * (0.15 * hem * w);
            transformed.y += 0.07 * hem * sin(uFlutter * 2.7 + th * 4.0);
          }
        }`),t.fragmentShader=t.fragmentShader.replace("#include <emissivemap_fragment>",`#include <emissivemap_fragment>
        // a ghost's rim: a faint cool glow where the sheet turns away from the eye
        totalEmissiveRadiance += vec3(0.55, 0.75, 1.0) * 0.22 * pow(1.0 - clamp(abs(dot(normal, normalize(vViewPosition))), 0.0, 1.0), 2.5);`)},n.customProgramCacheKey=()=>"ghost-sheet-v1",n}function PS(n){const t=n.bones.get("pelvis").parent;t?.isSkinnedMesh&&(AS(t,n.segs),t.material.dispose(),t.material=LS(),t.name="ghost-sheet");const e=n.std({color:263431,roughness:1,metalness:0,polygonOffset:!0,polygonOffsetFactor:-4,polygonOffsetUnits:-4});for(const r of[1,-1]){const a=new C(r*Zn.x,Zn.y,Wu),o=new mt(v1([{cx:r*Zn.x,cy:Zn.y,rx:Zn.rx,ry:Zn.ry,tilt:-r*Zn.tilt}],a),e);o.name=r>0?"ghost-eyeL":"ghost-eyeR",n.at(o,"head",a.x,a.y,a.z).castShadow=!1}const i=new C(0,Ai.top,Rl(0,Ai.top)),s=new mt(v1([{cx:0,cy:Ai.top-Ai.ry0,rx:Ai.rx0,ry:Ai.ry0,tilt:0},{cx:0,cy:Ai.top-Ai.ry1,rx:Ai.rx1,ry:Ai.ry1,tilt:0}],i,7,32),e);s.name="ghost-mouth",n.at(s,"head",i.x,i.y,i.z).castShadow=!1}const x1=new WeakMap,IS={id:"ghost",name:"Ghost",blurb:"A bedsheet ghost that says boo",segs:CS,body:{sdf:Xm,region:fS,box:mS,palette:[15330547,7107718],surface:"soft",weights:"soft",tint:pS},dress:PS,fit:{size:1.04,limb:.6,head:.45},face:{jaw:.3,eyes:[[Zn.x,Zn.y,Wu+.05,.34],[-.47,Zn.y,Wu+.05,.34]],breath:{colors:[15398655,11066623,13155583,16777215],rate:.7,speed:.55,size:1.5}},res:90,tick(n,t,e){let i=x1.get(n);i||(i={mouth:n.getObjectByName("ghost-mouth")??null,eyes:[n.getObjectByName("ghost-eyeL")??null,n.getObjectByName("ghost-eyeR")??null].filter(l=>!!l)},x1.set(n,i)),$m.value=t;const s=Math.max(0,Math.sin(t*.85-1)),r=e?e.jaw:.55*s*s*s;i.mouth?.morphTargetInfluences&&(i.mouth.morphTargetInfluences[0]=Math.min(1,r));const a=t%5.3<.14?1:0,o=e?e.blinkL:a,c=e?e.blinkR:a;i.eyes[0]&&(i.eyes[0].scale.y=1-.85*o),i.eyes[1]&&(i.eyes[1].scale.y=1-.85*c)}},DS=n=>n<0?0:n>1?1:n,Ym=(n,t,e)=>-B(-n,-t,e),Uo=[0,16.62,-.02],US=[{name:"pelvis",a:[0,9.6,0],b:[0,10.6,0],parent:null},{name:"spine1",a:[0,10.6,0],b:[0,12.4,.1],parent:"pelvis"},{name:"spine2",a:[0,12.4,.1],b:[0,15,.1],parent:"spine1"},{name:"neck",a:[0,15,.1],b:[0,15.9,.15],parent:"spine2",reach:.8},{name:"head",a:[0,15.9,.15],b:[0,18.4,.3],parent:"neck"},{name:"jaw",a:Uo,b:[0,16.3,1.3],parent:"head",reach:0},{name:"tail1",a:[0,14.8,-1.2],b:[0,12.6,-1.4],parent:"spine2",reach:0},{name:"tail2",a:[0,12.6,-1.4],b:[0,10.4,-1.6],parent:"tail1",reach:0},{name:"tail3",a:[0,10.4,-1.6],b:[0,8.2,-1.8],parent:"tail2",reach:0},{name:"tail4",a:[0,8.2,-1.8],b:[0,6.2,-2],parent:"tail3",reach:0},{name:"thighL",a:[1.1,9.6,0],b:[1.2,5.3,.2],parent:"pelvis"},{name:"shinL",a:[1.2,5.3,.2],b:[1.2,1.1,-.1],parent:"thighL"},{name:"footL",a:[1.2,1.1,-.1],b:[1.2,.35,1.4],parent:"shinL"},{name:"thighR",a:[-1.1,9.6,0],b:[-1.2,5.3,.2],parent:"pelvis"},{name:"shinR",a:[-1.2,5.3,.2],b:[-1.2,1.1,-.1],parent:"thighR"},{name:"footR",a:[-1.2,1.1,-.1],b:[-1.2,.35,1.4],parent:"shinR"},{name:"armL",a:[2.52,14.55,0],b:[2.92,11.95,-.05],parent:"spine2"},{name:"forearmL",a:[2.92,11.95,-.05],b:[3.08,9.55,.38],parent:"armL"},{name:"armR",a:[-2.52,14.55,0],b:[-2.92,11.95,-.05],parent:"spine2"},{name:"forearmR",a:[-2.92,11.95,-.05],b:[-3.08,9.55,.38],parent:"armR"}],NS={min:[-4.2,-.5,-1.9],max:[4.2,16.6,2.3]},_1=.13;function FS(n,t,e){const i=Math.abs(n);let s=4;if(t>8.2){s=at(n,t,e,0,13.35,.1,1.62,1.95,1),s=B(s,at(i,t,e,.8,13.8,.62,.82,.6,.42),.45),s=B(s,at(n,t,e,0,13.75,-.32,1.66,1.25,.58),.4),s=B(s,K(i,t,e,0,15.3,-.2,1.85,14.95,-.1,.48,.34),.5),s=B(s,at(n,t,e,0,11.6,.1,1.28,1.45,.86),.6),s=B(s,at(n,t,e,0,10,0,1.62,1,1),.6),s=B(s,at(i,t,e,.7,9.55,-.48,.8,.85,.6),.4),s=Math.max(s,-K(n,t,e,0,14.6,-1.06,0,10.6,-.94,.14,.12)),t>14.2&&(s=B(s,K(n,t,e,0,14.9,-.05,0,16.25,.1,.6,.52),.4)),s=B(s,at(i,t,e,2.42,14.45,0,.6,.84,.7),.4);const r=B(K(i,t,e,2.52,14.4,0,2.92,11.98,-.05,.54,.42),at(i,t,e,2.7,13.15,.1,.48,.95,.48),.3);if(s=t>14?B(s,r,.3):Math.min(s,r),t<12.4){let a=K(i,t,e,2.92,11.9,-.05,3.06,9.7,.36,.45,.3);a=B(a,at(i,t,e,2.96,11.2,.05,.46,.8,.46),.3),a=B(a,at(i,t,e,3.1,9.05,.45,.25,.55,.42),.2),a=B(a,K(i,t,e,3,9.4,.74,2.92,8.9,.94,.15,.12),.12),s=Math.min(s,a)}}return t<10.6&&(s=B(s,K(i,t,e,1.02,9.6,0,1.15,5.45,.2,.86,.54),.45),s=B(s,at(i,t,e,1.12,7.7,.26,.74,1.6,.68),.4),s=B(s,at(i,t,e,.82,8.3,0,.52,1.3,.58),.4),s=B(s,fe(i,t,e,1.17,5.3,.3,.5),.3),s=B(s,K(i,t,e,1.18,5.25,.15,1.2,1.15,-.1,.48,.32),.3),s=B(s,at(i,t,e,1.2,3.95,-.26,.52,1.3,.56),.35),s=B(s,Math.max(at(i,t,e,1.2,.5,.55,.46,.5,1.25),-t-_1),.25)),s-_1}const OS=()=>0,kS=(n,t,e,i)=>n.name.startsWith("thigh")?i>-1.6&&e<n.a[1]+.8&&Math.abs(Math.abs(t)-Math.abs(n.a[0]))<(e<n.a[1]+.3?1.3:.9):n.name.startsWith("arm")||n.name.startsWith("forearm")?Math.abs(t)>(e<12?2.3:e<14.1?1.95:2.15):!0,BS=17.16,cl=n=>BS+.07*n;function jm(n,t,e){let i=at(n,t,e,0,17.35,0,1.1,1.24,1.2);return i=B(i,at(n,t,e,0,16.7,.4,.88,.9,.94),.4),i=B(i,K(n,t,e,-.62,17.42,1,.62,17.42,1,.2,.2),.3),i=B(i,K(n,t,e,0,17,1.16,0,16.6,1.36,.12,.17),.22),i}function Zm(n,t,e){const i=Math.abs(n),s=Math.hypot(n,e-.15),r=Math.atan2(n,e-.15);return Math.max(Math.abs(t-cl(i))-.085,.86-s,Math.abs(r)*s-.78)}const G0=(n,t)=>Ym(n-(Uo[1]-.2*(t-Uo[2])),-.2-t,.15),M1=Uo[1]-.2*(1.3-Uo[2]);function HS(n,t,e){const i=Ym(jm(n,t,e),-Zm(n,t,e),.04);return Math.max(i,-(G0(t,e)-.012))}function VS(n,t,e){return Math.max(jm(n,t,e),G0(t,e)+.012)}const zS=new vt(14076846),GS=new vt(1182728);function b1(n,t,e,i){const s=Zm(n,t,e)<.03||Math.abs(G0(t,e))<.035;i.copy(s?GS:zS)}const WS=`
  varying vec3 vBind;
  float lh(float n) { return fract(sin(n * 91.345) * 47453.5453); }
  float lh3(vec3 p) { return fract(sin(dot(p, vec3(127.1, 311.7, 74.7))) * 43758.5453); }
  float lnoise(vec3 p) {
    vec3 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f);
    float a = mix(mix(lh3(i), lh3(i + vec3(1.0, 0.0, 0.0)), f.x), mix(lh3(i + vec3(0.0, 1.0, 0.0)), lh3(i + vec3(1.0, 1.0, 0.0)), f.x), f.y);
    float b = mix(mix(lh3(i + vec3(0.0, 0.0, 1.0)), lh3(i + vec3(1.0, 0.0, 1.0)), f.x), mix(lh3(i + vec3(0.0, 1.0, 1.0)), lh3(i + vec3(1.0, 1.0, 1.0)), f.x), f.y);
    return mix(a, b, f.z);
  }
  // strips of width w along a gradient g (not normalised: its y stays 1, so a tilt that changes across the body bends
  // the strips without squeezing them), wobbling: (s, id, fract, fwidth)
  vec4 wrapAt(vec3 p, vec3 g, float w, float seed) {
    float s = dot(p, g) / w + 0.7 * lnoise(p * 0.4 + seed) + 0.15 * lnoise(p * 1.7 + seed);
    return vec4(s, floor(s), fract(s), fwidth(s));
  }
  vec3 linen(vec3 base, vec3 p, out float hgt) {
    // which way the wraps lean: one way round the torso, mirrored on the right arm and on each leg; nearly level round
    // the head
    float legs = 1.0 - smoothstep(9.2, 10.2, p.y);
    float side = mix(mix(1.0, sign(p.x), smoothstep(1.7, 2.1, abs(p.x))), clamp(p.x * 3.0, -1.0, 1.0), legs);
    float head = smoothstep(15.8, 16.6, p.y);
    vec4 A = wrapAt(p, vec3(mix(0.4, 0.12, head) * side, 1.0, mix(0.15, 0.04, head)), 0.54, 0.0);
    float ea = max(A.w * 1.5, 0.035);
    float lip = smoothstep(0.0, ea, A.z);
    // the seam's dark softens with distance (strips a few pixels wide), or the figure reads as pinstripes
    float far = smoothstep(0.06, 0.3, A.w);
    float shade = (0.86 + 0.16 * lh(A.y * 7.13)) * (1.0 - mix(0.26, 0.12, far) * smoothstep(0.62, 1.0, A.z)) * mix(mix(0.66, 0.88, far), 1.0, lip);
    hgt = (1.0 - A.z) * lip;
    // the crossing straps
    vec4 B = wrapAt(p, vec3(-0.85 * side, 1.0, -0.22), 0.68, 3.7);
    float eb = max(B.w * 1.5, 0.035);
    float patchB = smoothstep(0.5, 0.58, lnoise(p * 0.3 + 11.0)) * step(0.42, lh(B.y * 3.31 + 1.7)) * (1.0 - head * 0.6);
    float inB = smoothstep(0.0, eb, B.z - 0.14) * smoothstep(0.0, eb, 0.86 - B.z);
    float onB = patchB * inB;
    float nearB = 1.0 - smoothstep(0.0, 0.12, min(abs(B.z - 0.14), abs(B.z - 0.86)));
    shade *= 1.0 - 0.32 * patchB * (1.0 - inB) * nearB;
    float shadeB = (0.9 + 0.12 * lh(B.y * 5.7)) * (1.0 - 0.24 * smoothstep(0.55, 0.86, B.z));
    shade = mix(shade, shadeB, onB);
    hgt = mix(hgt, 1.4 - 0.5 * (B.z - 0.14) / 0.72, onB);
    // here and there a strip falls short of the next and the dark beneath shows
    float gap = step(0.9, lh(A.y * 2.17 + 0.3)) * (1.0 - smoothstep(0.0, ea, A.z - 0.04)) * (1.0 - onB) * (1.0 - far);
    // each strip its own age: some yellower, some greyer
    float age = lh(A.y * 1.9 + onB * 4.0);
    vec3 c = base * shade * mix(vec3(1.04, 1.0, 0.9), vec3(0.9, 0.92, 0.9), age);
    // grime: tea-brown stains in blotches, gathering toward the feet and on the hands
    float g = lnoise(p * 0.7 + 5.0) * 0.6 + lnoise(p * 2.4) * 0.4;
    float low = 1.0 - smoothstep(1.0, 6.5, p.y);
    float hand = smoothstep(2.75, 3.05, abs(p.x)) * (1.0 - smoothstep(9.3, 10.4, p.y));
    float dirt = clamp(smoothstep(0.48, 0.8, g) * 0.6 + 0.5 * low + 0.4 * hand, 0.0, 0.85);
    c = mix(c, c * vec3(0.5, 0.4, 0.27), dirt);
    return mix(c, vec3(0.025, 0.018, 0.012), gap * 0.85);
  }
  // three's perturbNormalArb (bumpmap_pars_fragment), for a height made here rather than read from a map
  vec3 linenBump(vec3 surf, vec3 n, vec2 dHdxy, float faceDir) {
    vec3 sx = normalize(dFdx(surf)), sy = normalize(dFdy(surf));
    vec3 r1 = cross(sy, n), r2 = cross(n, sx);
    float det = dot(sx, r1) * faceDir;
    vec3 grad = sign(det) * (dHdxy.x * r1 + dHdxy.y * r2);
    return normalize(abs(det) * n - grad);
  }`;function XS(){const n=new Xe({vertexColors:!0,roughness:.92,metalness:0});return n.onBeforeCompile=t=>{t.vertexShader=t.vertexShader.replace("#include <common>",`#include <common>
 varying vec3 vBind;`).replace("#include <begin_vertex>",`#include <begin_vertex>
 vBind = position;`),t.fragmentShader=t.fragmentShader.replace("#include <common>",`#include <common>
`+WS).replace("#include <color_fragment>",`#include <color_fragment>
 float linenH; diffuseColor.rgb = linen(diffuseColor.rgb, vBind, linenH);`).replace("#include <normal_fragment_maps>",`#include <normal_fragment_maps>
 normal = linenBump(-vViewPosition, normal, vec2(dFdx(linenH), dFdy(linenH)) * 0.55, faceDirection);`)},n.customProgramCacheKey=()=>"mummy-linen-v1",n}function qS(n){const t=new ds({color:n,transparent:!0,opacity:.6,blending:Ea,depthWrite:!1,toneMapped:!1});return t.userData.keepBlend=!0,t.onBeforeCompile=e=>{e.vertexShader=e.vertexShader.replace("#include <common>",`#include <common>
 varying vec3 vHaloN; varying vec3 vHaloV;`).replace("#include <project_vertex>",`#include <project_vertex>
 vHaloN = normalize(normalMatrix * normal); vHaloV = -mvPosition.xyz;`),e.fragmentShader=e.fragmentShader.replace("#include <common>",`#include <common>
 varying vec3 vHaloN; varying vec3 vHaloV;`).replace("#include <color_fragment>",`#include <color_fragment>
 diffuseColor.a *= pow(clamp(dot(normalize(vHaloN), normalize(vHaloV)), 0.0, 1.0), 2.2);`)},t.customProgramCacheKey=()=>"mummy-halo-v1",t}let Xc=1;const $S=()=>(Xc=Xc*1664525+1013904223>>>0,Xc/4294967296);function YS(n){const t=hs(n.map(e=>e.index?e.toNonIndexed():e),!1);for(const e of n)e.dispose();return t}function jS(n,t,e,i){const a=[],o=[],c=[],l=new vt(14207396),h=new vt(7232062),u=new vt;for(let f=0;f<=14;f++){const p=f/14,v=i*p,g=Math.cos(v),m=Math.sin(v),_=f===14?.25:0;for(let x=0;x<3;x++){const b=(x/2-.5)*t,w=-n*p+(_?($S()-.5)*_*n*.25:0);a.push(b*g+e*p*p,w,b*m+.15*Math.sin(p*3.1));const E=Math.abs(x/2-.5)*2;u.copy(l).lerp(h,DS(.15+.5*p*p+.2*E)).multiplyScalar(.92+.12*(1-E)),o.push(u.r,u.g,u.b)}}for(let f=0;f<14;f++)for(let p=0;p<2;p++){const v=f*3+p,g=v+1,m=v+3,_=m+1;c.push(v,m,g,g,m,_)}const d=new me;return d.setAttribute("position",new re(a,3)),d.setAttribute("color",new re(o,3)),d.setIndex(c),d.computeVertexNormals(),d}const ZS=[{bone:"forearmL",at:[3.25,9.95,.2],len:2.6,w:.42,curl:.35,twist:.9},{bone:"forearmR",at:[-3.15,11.5,-.25],len:1.9,w:.36,curl:-.25,twist:-.7},{bone:"pelvis",at:[1.55,10.45,.55],len:3.3,w:.44,curl:.4,twist:1.2},{bone:"pelvis",at:[-.75,10.6,-1],len:2.8,w:.4,curl:-.3,twist:-1},{bone:"head",at:[.55,17.9,-.95],len:2.2,w:.38,curl:.25,twist:.8}];function KS(n){Xc=11;const t=XS(),e=n.bones.get("pelvis").parent;e?.isSkinnedMesh&&(e.material.dispose(),e.material=t);const i=mn(HS,{min:[-1.3,15.65,-1.32],max:[1.3,18.72,1.62]},56,b1,4e4),s=new mt(i,t);s.name="mummy-head",n.at(s,"head",0,0,0);const r=mn(VS,{min:[-1.05,15.6,-.35],max:[1.05,16.75,1.62]},40,b1,2e4),a=new mt(r,t);a.name="mummy-jaw",n.at(a,"jaw",0,0,0);const o=new mt(new ie(1,18,12).scale(.58,.3,.5).translate(0,M1-.1,.5),n.std({color:1838344,roughness:.9}));n.at(o,"head",0,0,0).castShadow=!1;const c=[];for(const[d,f]of[[-.42,.13],[-.25,.17],[-.08,.15],[.1,.18],[.36,.14]]){const p=Math.sqrt(Math.max(0,1-(d/.9)**2))*.82+.22;c.push(new be(.13,f,.1).rotateY(Math.atan2(d,p)).translate(d,M1-.03-f/2,p))}n.at(new mt(YS(c),n.std({color:13350794,roughness:.6})),"head",0,0,0).castShadow=!1;const l=n.std({color:0,emissive:16753182,emissiveIntensity:2.4,roughness:.4}),h=qS(16751140);for(const d of[1,-1]){const f=new mt(new ie(.1,14,10).scale(1.5,.75,.6),l);f.name="mummy-eye";const p=new mt(new ie(.1,16,10).scale(3.6,1.6,1.2),h);p.name="mummy-halo",p.renderOrder=2,f.add(p);const v=d*.4,g=.95;n.at(f,"head",v,cl(.4),.15+Math.sqrt(g*g-v*v)),f.castShadow=!1,p.castShadow=!1,p.receiveShadow=!1}const u=n.std({color:16777215,vertexColors:!0,roughness:.92,side:ye});ZS.forEach((d,f)=>{const p=new we;p.name="mummy-end",p.userData.phase=f*1.7,p.add(new mt(jS(d.len,d.w,d.curl,d.twist),u)),n.at(p,d.bone,d.at[0],d.at[1],d.at[2])})}const Rh=new Me,y1=new Me,w1=new gn,S1=new WeakMap,JS={id:"mummy",name:"Mummy",blurb:"Old linen, loose ends, eyes like embers",segs:US,body:{sdf:FS,region:OS,box:NS,palette:[14076846],surface:"soft",weights:"sharp",capture:kS},dress:KS,fit:{size:1.06,limb:.6},face:{jaw:.38,eyes:[[.4,cl(.4),1.17,.3],[-.4,cl(.4),1.17,.3]],breath:{colors:[14731408,12098146,15786684,10126432],rate:.8,speed:.6,size:1.3}},res:84,tick(n,t,e){let i=S1.get(n);if(!i){const r=[],a=[],o=new Set;n.traverse(c=>{c.name==="mummy-end"&&(r.push(c),a.push(c.userData.phase??0)),c.name==="mummy-eye"&&o.add(c.material)}),i={ends:r,phase:a,eyes:[...o]},S1.set(n,i)}for(let r=0;r<i.ends.length;r++){const a=i.ends[r],o=i.phase[r];Rh.identity();for(let c=a.parent;c&&c!==n;c=c.parent)Rh.premultiply(c.quaternion);w1.set(.16*Math.sin(t*1.25+o)+.05*Math.sin(t*3.1+o*2.3),0,.12*Math.sin(t*.95+o*1.3)),y1.setFromEuler(w1),a.quaternion.copy(Rh.invert()).multiply(y1)}const s=(2+.5*Math.sin(t*1.6)+.18*Math.sin(t*6.7+.8))*(1-.8*Math.max(e?.blinkL??0,e?.blinkR??0))*(1+.5*(e?.jaw??0));for(const r of i.eyes)r.emissiveIntensity=s}},oe=(n,t,e)=>{const i=Math.min(1,Math.max(0,(e-n)/(t-n)));return i*i*(3-2*i)},le=(n,t,e)=>n+(t-n)*e,ll=(n,t,e)=>-B(-n,-t,e);function fr(n,t,e,i=!1,s=!1){const r=(n+1)*(t+1),a=new Float32Array(r*3),o=new Float32Array(r*2),c=new C;for(let u=0;u<=t;u++)for(let d=0;d<=n;d++){const f=u*(n+1)+d,p=-1+2*d/n,v=u/t;e(p,v,c),a[f*3]=c.x,a[f*3+1]=c.y,a[f*3+2]=c.z,o[f*2]=(p+1)/2,o[f*2+1]=v}const l=[];for(let u=0;u<t;u++)for(let d=0;d<n;d++){const f=u*(n+1)+d,p=f+1,v=f+n+1,g=v+1;i?l.push(f,v,p,p,v,g):l.push(f,p,v,p,g,v)}const h=new me;if(h.setAttribute("position",new Kt(a,3)),h.setAttribute("uv",new Kt(o,2)),h.setIndex(l),h.computeVertexNormals(),s){const u=h.attributes.normal,d=new C,f=new C;for(let p=0;p<=t;p++){const v=p*(n+1),g=v+n;d.fromBufferAttribute(u,v).add(f.fromBufferAttribute(u,g)).normalize(),u.setXYZ(v,d.x,d.y,d.z),u.setXYZ(g,d.x,d.y,d.z)}}return h}function mo(n,t,e){const i=t.attributes.position,s=t.attributes.uv,r=new Map(n.segs.map((c,l)=>[c.name,l])),a=new Uint16Array(i.count*4),o=new Float32Array(i.count*4);for(let c=0;c<i.count;c++){const l=e(i.getX(c),i.getY(c),i.getZ(c),s?s.getX(c)*2-1:0,s?s.getY(c):0).filter(d=>d[1]>1e-4);l.sort((d,f)=>f[1]-d[1]);const h=Math.min(4,l.length);let u=0;for(let d=0;d<h;d++)u+=l[d][1];for(let d=0;d<h;d++)a[c*4+d]=r.get(l[d][0])??0,o[c*4+d]=u>0?l[d][1]/u:0;h===0&&(a[c*4]=r.get("spine2")??0,o[c*4]=1)}t.setAttribute("skinIndex",new Kt(a,4)),t.setAttribute("skinWeight",new Kt(o,4))}function qc(n,t,e,i){const s=n.bones.get("pelvis").parent;if(!s?.isSkinnedMesh)return null;const r=new g0(t,e);return r.name=i,r.castShadow=!0,r.receiveShadow=!0,r.frustumCulled=!1,s.add(r),r.bind(s.skeleton,s.bindMatrix),r}function Ps(n){const t=hs(n,!1);for(const e of n)e.dispose();return t}function $c(n,t,e,i,s,r=!1){const a=new Xe({color:16777215,roughness:e,metalness:0,side:ye,vertexColors:r}),o={uOut:{value:new vt(n)},uIn:{value:new vt(t)},uSheen:{value:i}};return a.onBeforeCompile=c=>{Object.assign(c.uniforms,o),c.fragmentShader=c.fragmentShader.replace("#include <common>",`#include <common>
 uniform vec3 uOut; uniform vec3 uIn; uniform float uSheen;`).replace("#include <color_fragment>",`#include <color_fragment>
 vec3 clothC = gl_FrontFacing ? uOut : uIn; diffuseColor.rgb *= clothC;`).replace("#include <emissivemap_fragment>",`#include <emissivemap_fragment>
 { float fr = 1.0 - abs(dot(normalize(vNormal), normalize(vViewPosition))); totalEmissiveRadiance += clothC * uSheen * pow(fr, 3.0); }`)},a.customProgramCacheKey=()=>s,a}function dr(n,t,e,i=0,s=3){for(let r=0;r<30;r++){const a=(i+s)/2;n(t,e,a)<0?i=a:s=a}return i}function Km(n,t,e,i,s,r=.02){return s.set(n(t+r,e,i)-n(t-r,e,i),n(t,e+r,i)-n(t,e-r,i),n(t,e,i+r)-n(t,e,i-r)).normalize()}function QS(n,t,e,i,s=24){const r=new ei(t.map(([d,f])=>new C(d,f,dr(n,d,f)))),a=[],o=[],c=new C,l=new C,h=new C;for(let d=0;d<=s;d++){const f=r.getPointAt(d/s);if(r.getTangentAt(d/s,l),f.z=dr(n,f.x,f.y),Km(n,f.x,f.y,f.z,c),h.crossVectors(l,c).normalize().multiplyScalar(e/2),f.addScaledVector(c,i),a.push(f.x-h.x,f.y-h.y,f.z-h.z,f.x+h.x,f.y+h.y,f.z+h.z),d>0){const p=(d-1)*2;o.push(p,p+1,p+2,p+1,p+3,p+2)}}const u=new me;return u.setAttribute("position",new re(a,3)),u.setIndex(o),u.computeVertexNormals(),u}function Jm(n,t,e,i,s,r,a,o,c,l,h){const u=p=>{const v=p.attributes.position,g=p.attributes.normal,m=new C;for(let _=0;_<v.count;_++){const x=v.getX(_),b=v.getY(_),w=v.getZ(_);if(Math.abs(e(x,b,w))>.12)continue;const E=t(x,b,w);E>.02||E<-.08||(Km(t,x,b,w,m,.015),g.setXYZ(_,m.x,m.y,m.z))}return h?.(p),p},d=new mt(u(mn((p,v,g)=>Math.max(t(p,v,g),-e(p,v,g)),i,r,o,6e4)),c);d.name=`${l}-head`,n.at(d,"head",0,0,0);const f=new mt(u(mn((p,v,g)=>Math.max(t(p,v,g),e(p,v,g)),s,a,o,2e4)),c);f.name=`${l}-jaw`,n.at(f,"jaw",0,0,0)}function tE(n){const t=new Xe({vertexColors:!0,roughness:.6,metalness:0});return t.onBeforeCompile=e=>{e.fragmentShader=e.fragmentShader.replace("#include <roughnessmap_fragment>",`#include <roughnessmap_fragment>
 roughnessFactor = mix(0.28, roughnessFactor, smoothstep(0.004, 0.05, dot(vColor.rgb, vec3(0.333))));`)},t.customProgramCacheKey=()=>n,t}function Qm(n,t,e,i,s,r,a={}){const o=a.look??[0,0],c=a.irisFrac??.5,l=n.std({color:a.white??15525594,roughness:.18}),h=n.std({color:i,emissive:i,emissiveIntensity:s,roughness:.15}),u=n.std({color:262916,roughness:.08}),d=n.std({color:16777215,emissive:16777215,emissiveIntensity:.7,roughness:.2}),f=a.lid!==void 0?n.std({color:a.lid,roughness:.55,side:ye}):null;for(const p of[1,-1]){const v=p>0?"L":"R",g=new we;g.name=`${r}${v}`,g.add(new mt(new ie(e,20,14),l));const m=new we;m.rotation.set(o[0],-p*o[1],0);const _=new mt(new ie(e*1.02,20,6,0,Math.PI*2,0,c),h);_.name=`${r}-iris`,_.rotation.x=Math.PI/2;const x=new mt(new ie(e*1.035,16,4,0,Math.PI*2,0,c*.42),u);x.rotation.x=Math.PI/2;const b=new mt(new ie(e*.16,8,6),d);if(b.position.set(p*e*.22,e*.28,e*.98),m.add(_,x,b),g.add(m),f){const w=new mt(new ie(e*1.12,20,8,0,Math.PI*2,0,1.3),f);w.name=`${r}-lid${v}`,w.rotation.x=a.lidRest??.2,g.add(w)}n.at(g,"head",p*t[0],t[1],t[2])}}function tg(n,t,e,i,s,r,a){const o=n.std({color:r,roughness:.7});for(const c of[1,-1]){const l=new C(c*t[0],t[1],t[2]),h=new C(c*e[0],e[1],e[2]),u=new An(s,i,l.distanceTo(h),7,1).scale(1,1,.55),d=new mt(u,o);d.quaternion.setFromUnitVectors(new C(0,1,0),h.clone().sub(l).normalize());const f=new we;f.name=`${a}${c>0?"L":"R"}`,f.add(d);const p=l.add(h).multiplyScalar(.5);n.at(f,"head",p.x,p.y,p.z)}}function eg(n,t,e,i){const s={lids:[],eyes:[],brows:[],glow:[]};return n.traverse(r=>{if((r.name===`${t}-lidL`||r.name===`${t}-lidR`)&&s.lids.push({o:r,rest:r.rotation.x,left:r.name.endsWith("L")}),(r.name===`${t}L`||r.name===`${t}R`)&&s.eyes.push({o:r,left:r.name.endsWith("L")}),(r.name===`${e}L`||r.name===`${e}R`)&&s.brows.push({o:r,y:r.position.y}),i.includes(r.name)){const a=r.material;s.glow.includes(a)||s.glow.push(a)}}),s}function ng(n,t,e=.12){const i=s=>t?s?t.blinkL:t.blinkR:0;for(const s of n.lids)s.o.rotation.x=s.rest+(Math.PI/2-s.rest)*i(s.left);if(!n.lids.length)for(const s of n.eyes)s.o.scale.y=1-.9*i(s.left);for(const s of n.brows)s.o.position.y=s.y+e*(t?.browUp??0)}function ig(n,t){return(e,i,s,r)=>{const a=e.name;return a.startsWith("thigh")?r>-1.6&&s<e.a[1]+.8&&Math.abs(Math.abs(i)-Math.abs(e.a[0]))<(s<e.a[1]+.3?1.3:.9):a.startsWith("arm")||a.startsWith("forearm")?Math.abs(i)>n(s)&&r>-1.15:a==="head"?s>t:!0}}const E1=14.6,da=11.9,Xu=9.45,W0=[{name:"pelvis",a:[0,9.6,0],b:[0,10.6,0],parent:null},{name:"spine1",a:[0,10.6,0],b:[0,12.4,.1],parent:"pelvis"},{name:"spine2",a:[0,12.4,.1],b:[0,15,.1],parent:"spine1"},{name:"neck",a:[0,15,.1],b:[0,15.9,.15],parent:"spine2",reach:.8},{name:"head",a:[0,15.9,.15],b:[0,18.4,.3],parent:"neck"},{name:"jaw",a:[0,16.55,-.12],b:[0,16.2,1.15],parent:"head",reach:0},{name:"tail1",a:[0,14.9,-1.3],b:[0,12.4,-1.6],parent:"spine2",reach:0},{name:"tail2",a:[0,12.4,-1.6],b:[0,9.9,-1.9],parent:"tail1",reach:0},{name:"tail3",a:[0,9.9,-1.9],b:[0,7.4,-2.2],parent:"tail2",reach:0},{name:"tail4",a:[0,7.4,-2.2],b:[0,4.9,-2.5],parent:"tail3",reach:0},{name:"thighL",a:[1.1,9.6,0],b:[1.2,5.3,.2],parent:"pelvis"},{name:"shinL",a:[1.2,5.3,.2],b:[1.2,1.1,-.1],parent:"thighL"},{name:"footL",a:[1.2,1.1,-.1],b:[1.2,.75,1.8],parent:"shinL"},{name:"thighR",a:[-1.1,9.6,0],b:[-1.2,5.3,.2],parent:"pelvis"},{name:"shinR",a:[-1.2,5.3,.2],b:[-1.2,1.1,-.1],parent:"thighR"},{name:"footR",a:[-1.2,1.1,-.1],b:[-1.2,.75,1.8],parent:"shinR"},{name:"armL",a:[2.4,E1,0],b:[2.72,da,-.05],parent:"spine2"},{name:"forearmL",a:[2.72,da,-.05],b:[2.85,Xu,.4],parent:"armL"},{name:"armR",a:[-2.4,E1,0],b:[-2.72,da,-.05],parent:"spine2"},{name:"forearmR",a:[-2.72,da,-.05],b:[-2.85,Xu,.4],parent:"armR"}],eE={min:[-3.6,-.3,-1.6],max:[3.6,16.6,2.2]};function qu(n,t,e){const i=Math.abs(n);let s=9;if(t>8.6&&(s=at(n,t,e,0,13.3,.05,1.78,1.95,1.05),s=B(s,at(n,t,e,0,11.4,.1,1.38,1.25,.92),.55),s=B(s,at(n,t,e,0,9.95,0,1.6,1.05,1),.5),t>13.4&&(s=B(s,K(i,t,e,0,15,-.1,2.25,14.6,0,.55,.6),.5),s=B(s,K(n,t,e,0,14.8,-.02,0,16.2,.06,.48,.38),.3))),t<10.9&&(s=B(s,K(i,t,e,1,9.7,0,1.16,5.4,.15,.86,.58),.45),t<6.4&&(s=B(s,K(i,t,e,1.16,5.4,.15,1.2,1.35,-.08,.57,.44),.3))),t<1.9){let r=Math.max(at(i,t,e,1.2,.48,.55,.5,.48,1.25),-t);r=B(r,Math.max(K(i,t,e,1.2,.36,.7,1.2,.3,1.95,.4,.17),-t),.25),s=B(s,r,.3)}if(i>1.5&&t>8.2&&t<15.6){const r=K(i,t,e,2.4,14.4,0,2.72,11.95,-.05,.56,.47);if(s=t>14?B(s,r,.35):Math.min(s,r),t<12.6){let a=K(i,t,e,2.72,11.95,-.05,2.84,10.15,.27,.46,.41);a=B(a,K(i,t,e,2.83,10.25,.25,2.85,9.85,.33,.37,.36),.06);let o=K(i,t,e,2.85,9.9,.33,2.86,9.4,.42,.22,.21);o=B(o,at(i,t,e,2.87,9.05,.47,.19,.45,.36),.2),o=B(o,at(i,t,e,2.88,8.45,.52,.15,.5,.3),.15),o=B(o,K(i,t,e,2.78,9.3,.76,2.72,8.8,.92,.12,.09),.1),s=Math.min(s,B(a,o,.1))}}return s}const $u=0,nE=1,iE=2,T1=3,sE=4;function sg(n,t,e){const i=Math.abs(n);return t<1.12&&i>.5?iE:i>2.45&&t<10.3?t<9.86?T1:sE:t>15.3&&i<.7?T1:i>2&&t>9?$u:t<10.55?nE:$u}const rE=[.86,.82,.16,.5,.6],aE=`
  varying vec3 vBind; varying vec3 vBindN; varying float vTux; varying float vRough;
  float inside(float v, float w) { return 1.0 - smoothstep(w - 0.014, w + 0.014, v); }
  vec3 tux(vec3 base, vec3 p, vec3 n, inout float rough) {
    float ax = abs(p.x);
    float front = smoothstep(0.05, 0.3, n.z) * step(0.0, p.z);
    float wJ = 0.05 + 0.82 * clamp((p.y - 11.05) / 4.1, 0.0, 1.0);
    float open = inside(ax, wJ) * step(11.05, p.y) * front;
    float peak = smoothstep(13.5, 14.45, p.y) * (1.0 - smoothstep(14.5, 14.62, p.y));
    float lapel = inside(ax, wJ + 0.3 + 0.24 * peak) * (1.0 - open) * step(10.9, p.y) * front;
    float wS = 0.6 * clamp((p.y - 13.45) / 1.75, 0.0, 1.0);
    float shirt = inside(ax, wS) * step(13.45, p.y);
    vec3 vest = vec3(0.3, 0.01, 0.018) * (0.82 + 0.18 * abs(sin(p.x * 22.0 + p.y * 9.0) * sin(p.y * 22.0 - p.x * 9.0)));
    vec3 c = mix(base, vec3(0.004, 0.004, 0.007), lapel);
    c = mix(c, vest, open);
    c = mix(c, vec3(0.8, 0.79, 0.75) * (0.95 + 0.05 * sin(p.x * 120.0)), open * shirt);
    float stud = min(length(p.xy - vec2(0.0, 14.3)), length(p.xy - vec2(0.0, 13.85)));
    c = mix(c, vec3(0.015), open * shirt * (1.0 - smoothstep(0.045, 0.06, stud)));
    float btn = min(length(p.xy - vec2(0.0, 12.05)), length(p.xy - vec2(0.0, 11.5)));
    c = mix(c, vec3(0.62, 0.38, 0.09), open * (1.0 - shirt) * (1.0 - smoothstep(0.07, 0.085, btn)));
    rough = mix(rough, 0.2, lapel);
    rough = mix(rough, 0.42, open);
    rough = mix(rough, 0.25, open * (1.0 - shirt) * (1.0 - smoothstep(0.07, 0.085, btn)));
    return c;
  }`;function oE(){const n=new Xe({vertexColors:!0,roughness:.7,metalness:0});return n.onBeforeCompile=t=>{t.vertexShader=t.vertexShader.replace("#include <common>",`#include <common>
 attribute float aTux; attribute float aRough; varying vec3 vBind; varying vec3 vBindN; varying float vTux; varying float vRough;`).replace("#include <begin_vertex>",`#include <begin_vertex>
 vBind = position; vBindN = normal; vTux = aTux; vRough = aRough;`),t.fragmentShader=t.fragmentShader.replace("#include <common>",`#include <common>
`+aE).replace("#include <color_fragment>",`#include <color_fragment>
 float tuxRough = vRough; { float r2 = vRough; vec3 tc = tux(diffuseColor.rgb, vBind, normalize(vBindN), r2); diffuseColor.rgb = mix(diffuseColor.rgb, tc, vTux); tuxRough = mix(vRough, r2, vTux); }`).replace("#include <roughnessmap_fragment>",`#include <roughnessmap_fragment>
 roughnessFactor = tuxRough;`)},n.customProgramCacheKey=()=>"vamp-tux-v1",n}const cE=16.29,rg=1.16,hl=n=>cE+.21*(rg-n),ag=.44,lE=(n,t,e)=>Math.max(t-hl(e),-.15-e,15.98-.32*(e+.15)-t,Math.abs(n)-ag),Rs=[0,.42,.9,1.3,1.72,2.3,Math.PI],Is=[17.78,18.08,17.86,17.36,17.28,16.85,16.6];function hE(n,t){const e=Math.atan2(n,t);for(let i=1;i<Rs.length;i++)if(e<=Rs[i]){const s=(e-Rs[i-1])/(Rs[i]-Rs[i-1]);return le(Is[i-1],Is[i],s)}return Is[Is.length-1]}const Oi=[.34,17.14,.93],uE=(n,t,e)=>{const i=hE(n,e);return .08*oe(i-.03,i+.14,t)*(1+.8*oe(17,18,t)*oe(.1,-.7,e))},og=(n,t,e)=>at(n,t,e,0,17.42,.02,.9,1,1.08)-uE(Math.abs(n),t,e);function X0(n,t,e){const i=Math.abs(n);let s=og(n,t,e);return s=B(s,at(n,t,e,0,16.85,.45,.74,.95,.75),.4),s=B(s,at(n,t,e,0,16.03,.72,.38,.3,.36),.3),s=B(s,K(i,t,e,.68,16.62,-.05,.27,15.97,.72,.17,.15),.3),s=B(s,at(i,t,e,.5,16.98,.8,.3,.17,.28),.2),s=ll(s,-at(i,t,e,.56,16.5,.95,.22,.28,.2),.2),s=B(s,K(i,t,e,.1,17.4,1.04,.62,17.48,.84,.1,.08),.15),s=ll(s,-at(i,t,e,Oi[0],Oi[1],1.08,.24,.15,.2),.08),s=B(s,K(n,t,e,0,17.2,1.04,0,16.7,1.4,.085,.11),.12),s=B(s,at(i,t,e,.11,16.68,1.22,.1,.08,.1),.08),s=B(s,K(i,t,e,0,16.36,1.12,.27,16.33,.98,.055,.035),.06),s=B(s,K(i,t,e,0,16.21,1.08,.24,16.25,.96,.055,.035),.06),s=B(s,at(i,t,e,.88,17,-.05,.1,.32,.2),.12),s=B(s,K(i,t,e,.9,17.15,-.1,1.04,17.66,-.36,.12,.02),.1),B(s,K(n,t,e,0,15.2,-.06,0,16.5,0,.47,.45),.3)}function fE(){const n=new Xe({vertexColors:!0,roughness:.58,metalness:0}),t=Rs.map((e,i)=>`if (ph <= ${e.toFixed(4)}) return mix(${Is[i-1]?.toFixed(3)??"0.0"}, ${Is[i].toFixed(3)}, (ph - ${(Rs[i-1]??0).toFixed(4)}) / ${(e-(Rs[i-1]??e-1)||1).toFixed(4)});`).slice(1).join(`
    `);return n.onBeforeCompile=e=>{e.vertexShader=e.vertexShader.replace("#include <common>",`#include <common>
 attribute float aHair; varying float vHair; varying vec3 vHeadP;`).replace("#include <begin_vertex>",`#include <begin_vertex>
 vHair = aHair; vHeadP = position;`),e.fragmentShader=e.fragmentShader.replace("#include <common>",`#include <common>
  varying float vHair; varying vec3 vHeadP;
  float hairline(vec3 p) {
    float ph = atan(abs(p.x), p.z);
    ${t}
    return ${Is[Is.length-1].toFixed(3)};
  }`).replace("#include <color_fragment>",`#include <color_fragment>
  float hairK = smoothstep(-0.006, 0.006, vHeadP.y - hairline(vHeadP)) * smoothstep(0.35, 0.65, vHair);
  // combed back: faint streaks along the head
  vec3 hairC = vec3(0.0035, 0.0035, 0.005) * (0.8 + 0.4 * sin(atan(vHeadP.x, -vHeadP.z + 0.4) * 90.0));
  diffuseColor.rgb = mix(diffuseColor.rgb, hairC, hairK);`).replace("#include <roughnessmap_fragment>",`#include <roughnessmap_fragment>
 roughnessFactor = mix(roughnessFactor, 0.26, hairK);`)},n.customProgramCacheKey=()=>"vamp-head-v2",n}function dE(n){const t=n.attributes.position,e=new Float32Array(t.count);for(let i=0;i<t.count;i++)e[i]=Math.abs(og(t.getX(i),t.getY(i),t.getZ(i)))<.05?1:0;n.setAttribute("aHair",new Kt(e,1))}function pE(n,t,e){if(t<15)return 15.1-t;const i=at(n,t,e,0,16.95,.15,1.25,1.95,1.55);return i>.35?i:X0(n,t,e)}const mE=new vt(14474452),Ch=new vt(9340568),gE=new vt(6956080),vE=new vt(2098182),xE=new vt(15657178);function _E(n,t,e,i){const s=Math.abs(n);if(X0(n,t,e)<-.07){i.copy(e>rg-.24&&s<.36&&Math.abs(t-hl(e))<.12?xE:vE),s>ag-.05&&i.copy(Ch).multiplyScalar(.55);return}i.copy(mE);const a=Math.hypot((s-Oi[0])/.36,(t-Oi[1]+.04)/.26,(e-1)/.4);i.lerp(Ch,.55*(1-oe(.7,1.25,a)));const o=Math.hypot((s-.56)/.3,(t-16.5)/.36);i.lerp(Ch,.3*(1-oe(.4,1,o))*oe(.6,.9,e)),e>.95&&s<.3&&Math.abs(t-hl(e))<.08&&i.copy(gE)}const cg=2.75,pa=.17,q0=n=>15.52-.22*(1-n)/2,A1=n=>14.62-.3*Math.max(0,n)**2;function ME(n,t,e){let i,s,r,a,o,c=0;if(t<=pa){const l=t/pa;i=n*2.09;const h=Math.cos(i),u=q0(h),d=A1(h),f=le(2,4,Math.abs(Math.sin(i)));o=d+(u-d)*Math.pow(Math.max(0,1-l**f),1/f),s=le(.76,3.15,l),r=le(.76,1.5,l),a=le(0,-.1,l)}else{const l=(t-pa)/(1-pa);i=n*le(2.09,1.76,oe(0,.3,l));const h=Math.cos(i);o=le(A1(h),cg+.35*Math.abs(n)**2,l),s=3.15+.72*Math.sqrt(l)+.6*l*l,r=1.5+.42*Math.sqrt(l)+.55*l*l,a=-.1-.25*l,c=(.012+.09*l)*Math.sin(i*6.5+.4)*oe(0,.12,l)}e.set(s*(1+c)*Math.sin(i),o,a-r*(1+c)*Math.cos(i))}function bE(n,t,e){const i=n*le(2.09,1.72,t),s=Math.cos(i),r=18.12+.62*Math.abs(n)**1.6,a=le(q0(s)-.05,r,t),o=.4*t+.6*t*t,c=le(.8,2,o),l=le(.8,1.62,o),h=le(0,-.18,t);e.set(c*Math.sin(i),a,h-l*s)}const Zs=W0.filter(n=>n.name.startsWith("tail"));function yE(n,t,e){if(t<=0)return;const i=Zs[0].a[1];if(n>=i){e.push(["spine2",t]);return}for(let s=0;s<Zs.length;s++){const r=Zs[s],a=r.a[1]-r.b[1];if(n>=r.b[1]||s===Zs.length-1){const o=Math.min(1,(r.a[1]-n)/a),c=s>0?Zs[s-1].name:"spine2",l=s<Zs.length-1?Zs[s+1].name:null;if(o<.5){const h=.5-o;e.push([r.name,t*(1-h)],[c,t*h])}else if(l){const h=Math.min(.5,o-.5);e.push([r.name,t*(1-h)],[l,t*h])}else e.push([r.name,t]);return}}}function wE(n,t,e,i,s){const r=[],a=n>=0?"L":"R",o=Math.abs(i);let c;if(s<=pa?c=oe(.4,.85,o)*oe(.35,1,s/pa)*.9:c=oe(.3,.78,o)*Math.pow(oe(cg+.3,Xu+.2,t),1.3),c>0){const l=oe(da-.9,da+.9,t);r.push(["arm"+a,c*l],["forearm"+a,c*(1-l)])}return yE(t,1-c,r),r}function SE(n){const t=n.bones.get("pelvis").parent;if(t?.isSkinnedMesh){const T=t.geometry.attributes.position,M=new Float32Array(T.count),y=new Float32Array(T.count);for(let S=0;S<T.count;S++){const R=T.getX(S),I=T.getY(S),L=T.getZ(S),D=sg(R,I);M[S]=D===$u&&Math.abs(R)<1.9&&I>10.8&&I<15.4&&L>0?1:0,y[S]=rE[D]??.7}t.geometry.setAttribute("aTux",new Kt(M,1)),t.geometry.setAttribute("aRough",new Kt(y,1)),t.material.dispose(),t.material=oE()}Jm(n,pE,lE,{min:[-1.12,15.05,-1.28],max:[1.12,18.62,1.62]},{min:[-.52,15.55,-.25],max:[.52,16.75,1.35]},56,30,_E,fE(),"vamp",dE),Qm(n,Oi,.13,11538464,.55,"vamp-eye",{look:[.05,0],lid:11051694,lidRest:.32,white:14998992,irisFrac:.62});const e=(T,M)=>{const y=17.42+M;return[T,y,dr(X0,T,y,.3,1.6)+.025]};tg(n,e(.1,.02),e(.6,.17),.065,.025,657932,"vamp-brow");const i=n.std({color:16052454,roughness:.25});for(const T of[1,-1]){const M=new mt(new gi(.048,.24,8).rotateX(Math.PI),i);n.at(M,"head",T*.2,hl(.94)-.1,.94)}const s=fr(40,6,(T,M,y)=>{const S=T*2.72,R=Math.abs(T),I=oe(.78,1,R),L=le(14.96,15.6-.32*I,M),D=le(.62,.56,M)+.13*I*M;y.set(D*Math.sin(S),L,.03-D*Math.cos(S))});n.at(new mt(s,n.std({color:15921386,roughness:.55,side:ye})),"neck",0,0,0);const r=fr(76,60,ME);mo(n,r,wE);const a=fr(44,14,bE,!0);mo(n,a,()=>[["spine2",1]]);const o=$c(1512734,9046036,.36,.5,"vamp-cape-v1");qc(n,Ps([r,a]),o,"vamp-cape");const c=n.std({color:13936192,roughness:.28,metalness:.9}),l=[],h=2.09,u=.8*Math.sin(h),d=-.8*Math.cos(h),f=q0(Math.cos(h))-.12;for(const T of[1,-1])l.push(new An(.16,.16,.07,16).rotateX(Math.PI/2).rotateY(T*.6).translate(T*u,f,d+.04)),l.push(new ie(.085,10,8).translate(T*u*1.03,f,d+.09));const p=new ei([new C(u*.95,f,d+.08),new C(0,f-.38,d+.32),new C(-u*.95,f,d+.08)]);l.push(new ps(p,12,.035,6,!1)),n.at(new mt(Ps(l),c),"spine2",0,0,0);const v=n.std({color:10095640,roughness:.4,side:ye}),g=12.85,m=dr(qu,0,g),_=[];for(const T of[1,-1])_.push(QS(qu,[[T*.1,g+.35],[T*.3,14],[T*.5,15]],.2,.03));n.at(new mt(Ps(_),v),"spine2",0,0,0);const x=new we,b=new mt(new An(.4,.4,.07,32).rotateX(Math.PI/2),c),w=new mt(new zn(.4,.045,8,32),c),E=Ps(Array.from({length:12},(T,M)=>{const y=M/12*Math.PI*2;return new ie(.045,8,6).translate(Math.cos(y)*.29,Math.sin(y)*.29,.05)})),A=new mt(new ie(.16,16,12).scale(1,1.15,.55),n.std({color:9043984,emissive:12582938,emissiveIntensity:.45,roughness:.08,metalness:.2}));A.name="vamp-gem",A.position.z=.05,x.add(b,w,new mt(E,c),A),n.at(x,"spine2",0,g,m+.07)}const R1=new WeakMap,EE={id:"vampire",name:"Vampire",blurb:"A caped count with a medallion, fangs and red eyes",segs:W0,body:{sdf:qu,region:sg,box:eE,palette:[1512988,1249815,394760,14474452,15724006],surface:"suit",weights:"sharp",capture:ig(n=>n<12?2.15:n<14.1?1.95:2.05,15.85)},dress:SE,fit:{size:1.06,limb:.7},idle:{tail:.04},face:{jaw:.42,eyes:[[Oi[0],Oi[1],Oi[2]+.12,.17],[-.34,Oi[1],Oi[2]+.12,.17]],breath:{colors:[11534360,6946832,16722490,2752520],rate:.8,speed:.6,size:1.2}},res:84,tick(n,t,e){let i=R1.get(n);i||(i=eg(n,"vamp-eye","vamp-brow",["vamp-eye-iris","vamp-gem"]),R1.set(n,i)),ng(i,e);const s=.45+.12*Math.sin(t*1.3)+1.1*(e?.jaw??0);for(const r of i.glow)r.emissiveIntensity=s}},lg=W0,No=n=>lg.find(t=>t.name===n),C1=5.3,TE={min:[-3.5,.6,-1.5],max:[3.5,16.6,1.6]};function ul(n,t,e){const i=Math.abs(n);let s=9;if(t>8.7&&(s=at(n,t,e,0,13.25,.05,1.58,1.85,.98),s=B(s,at(i,t,e,.62,13.15,.5,.56,.52,.48),.35),s=B(s,at(n,t,e,0,11.35,.05,1.1,1.25,.78),.55),s=B(s,at(n,t,e,0,10,0,1.42,1,.95),.5),t>13.4&&(s=B(s,K(i,t,e,0,14.95,-.1,2.15,14.6,0,.46,.5),.45),s=B(s,K(n,t,e,0,14.8,-.02,0,16.2,.06,.42,.34),.3))),t<10.9&&(s=B(s,K(i,t,e,1,9.7,0,1.14,5.4,.15,.62,.46),.45),t<6.4&&(s=B(s,K(i,t,e,1.14,5.4,.15,1.2,1.25,-.08,.42,.3),.3))),i>1.5&&t>7.6&&t<15.6){const r=K(i,t,e,2.4,14.4,0,2.72,11.95,-.05,.48,.4);if(s=t>14?B(s,r,.35):Math.min(s,r),t<12.6){const a=K(i,t,e,2.72,11.95,-.05,2.83,10.3,.25,.39,.44);let o=K(i,t,e,2.83,10.4,.25,2.86,9.4,.42,.17,.18);o=B(o,at(i,t,e,2.87,9.05,.47,.17,.42,.33),.2);for(let c=0;c<4;c++){const l=.27+c*.14;o=B(o,K(i,t,e,2.88,8.75,l,2.92,8.75-(c===0||c===3?.42:.55),l+.12,.075,.05),.06)}o=B(o,K(i,t,e,2.79,9.3,.76,2.72,8.82,.95,.1,.07),.08),s=Math.min(s,a,o)}}return s}const AE=0,L1=1,RE=2;function CE(n,t){const e=Math.abs(n);return e>2.5&&t<10.35||t>15.3&&e<.6?L1:t<10.2&&e<2.2?RE:AE}const LE=-.12,PE=16.24,hg=1.1,Yu=n=>PE+.21*(hg-n),ug=.42,IE=(n,t,e)=>Math.max(t-Yu(e),LE-.03-e,15.98-.32*(e+.15)-t,Math.abs(n)-ug),ki=[.32,17.12,.9],ya=[.14,16.92,1.52];function fl(n,t,e){if(t<15)return 15.1-t;const i=at(n,t,e,0,16.95,.3,1.2,1.95,1.8);if(i>.35)return i;const s=Math.abs(n);let r=at(n,t,e,0,17.42,.02,.88,.98,1.05);return r=B(r,at(n,t,e,0,16.85,.42,.7,.95,.72),.4),r=B(r,K(n,t,e,0,16.25,.72,0,15.78,1,.24,.13),.3),r=B(r,K(s,t,e,.62,16.62,-.05,.2,15.92,.8,.15,.12),.3),r=B(r,at(s,t,e,.48,16.95,.76,.28,.17,.25),.2),r=ll(r,-at(s,t,e,.52,16.48,.92,.2,.26,.18),.2),r=B(r,K(s,t,e,.1,17.38,1,.6,17.44,.82,.09,.07),.15),r=ll(r,-at(s,t,e,ki[0],ki[1],1.04,.23,.14,.19),.08),r=B(r,K(n,t,e,0,17.18,1,0,16.98,1.42,.085,.125),.12),r=B(r,K(n,t,e,0,16.98,1.42,0,16.68,1.9,.125,.09),.08),r=B(r,K(n,t,e,0,16.68,1.9,0,16.5,1.84,.09,.06),.06),r=B(r,K(n,t,e,0,16.52,1.8,0,16.6,1.18,.07,.1),.1),r=B(r,at(s,t,e,.1,16.64,1.3,.09,.07,.14),.08),r=B(r,fe(n,t,e,ya[0],ya[1],ya[2],.07),.03),r=B(r,K(s,t,e,0,16.3,1.08,.27,16.33,.94,.05,.03),.05),r=B(r,K(s,t,e,0,16.16,1.05,.24,16.21,.93,.05,.03),.05),r=B(r,at(s,t,e,.86,17,-.05,.1,.3,.2),.12),B(r,K(n,t,e,0,15.2,-.06,0,16.5,0,.44,.42),.3)}const DE=new vt(10011258),Lh=new vt(5602368),UE=new vt(5917264),NE=new vt(1836296),FE=new vt(14208140),OE=new vt(6974002),kE=new vt(1446930);function BE(n,t,e,i){const s=Math.abs(n);if(fl(n,t,e)<-.07){const c=e>hg-.26&&s<.36&&Math.abs(t-Yu(e))<.13,l=(n+.36)/.12,h=Math.floor(l)===4;i.copy(c&&!h&&l-Math.floor(l)<.8?FE:NE),s>ug-.05&&i.copy(Lh).multiplyScalar(.55);return}if(t>17.62-.35*oe(.4,1.3,Math.atan2(s,e))){i.copy(kE);return}i.copy(DE);const a=Math.hypot((s-ki[0])/.36,(t-ki[1]+.04)/.26,(e-.98)/.4);i.lerp(Lh,.6*(1-oe(.7,1.25,a)));const o=Math.hypot((s-.52)/.3,(t-16.48)/.36);i.lerp(Lh,.35*(1-oe(.4,1,o))*oe(.6,.9,e)),i.lerp(new vt(10132058),.4*(1-oe(.1,.35,Math.hypot(n,t-16.62,e-1.88)))),Math.hypot(n-ya[0],t-ya[1],e-ya[2])<.1&&i.copy(OE),e>.9&&s<.28&&Math.abs(t-Yu(e))<.05&&i.copy(UE)}const dl=11.2,ju=4.45;let wa=11;const In=()=>(wa=wa*1664525+1013904223>>>0,wa/4294967296);function $0(n,t){wa=t;const e=Array.from({length:n},()=>.45+.55*In());return i=>{const s=(i+1)/2*n,r=Math.floor(s)%n,a=s-Math.floor(s);return e[r]*(1-Math.abs(a*2-1))}}const HE=$0(22,5);function VE(n){if(n>10){const t=oe(dl,10,n);return[le(1.06,1.75,t),le(.74,1.2,t)]}return[1.75+.12*(10-n),1.2+.16*(10-n)]}function zE(n,t,e){const i=n*Math.PI,s=le(dl,ju-.85*HE(n)+.15*Math.cos(i),t),[r,a]=VE(s),o=oe(10,ju,s),c=1+(.012+.055*o)*Math.sin(i*9+.7)*oe(10.4,9.6,s);e.set(r*c*Math.sin(i),s,.02-.12*o+a*c*Math.cos(i))}function GE(n,t,e){const i=Math.min(1,Math.max(0,(dl-t)/(dl-ju))),s=Math.max(0,e/Math.max(.5,Math.hypot(n,e))),r=oe(.05,.35,i)*(.3+.7*s)*.92,a=oe(-.7,.7,n),o=.5*oe(C1+.6,C1-.9,t);return[["pelvis",1-r],["thighL",r*a*(1-o)],["shinL",r*a*o],["thighR",r*(1-a)*(1-o)],["shinR",r*(1-a)*o]]}const ma=.5,WE=$0(16,9),XE=n=>15.48-.2*(1-n)/2,P1=n=>14.62-.3*Math.max(0,n)**2,qE=n=>{const t=Math.abs(n);return t<.55?le(10.9,12.6,oe(0,.55,t)):le(12.6,11.9,oe(.55,1,t))};function $E(n,t,e){const i=n*2.72,s=Math.cos(i);let r,a,o,c;if(t<=ma){const u=t/ma,d=XE(s),f=P1(s),p=le(2,3,Math.abs(Math.sin(i)));c=f+(d-f)*Math.pow(Math.max(0,1-u**p),1/p),r=le(.68,2.92,u),a=le(.68,1.42,u),o=le(0,-.08,u),e.set(r*Math.sin(i),c,o-a*s);return}const l=(t-ma)/(1-ma);c=le(P1(s),qE(n)-.55*WE(n),l),r=2.92+.32*Math.sqrt(l),a=1.42+.22*Math.sqrt(l),o=-.08;const h=oe(.62,1,Math.abs(n))*oe(0,.55,l);e.set(r*Math.sin(i)*le(1,.12,h),c,o-a*s+.12*h)}function YE(n,t,e,i,s){const r=Math.abs(i),a=oe(.28,.5,r)*(1-oe(.72,.9,r))*(s<=ma?oe(.4,1,s/ma):1)*.85;return[["spine2",1-a],[n>=0?"armL":"armR",a]]}function jE(){const n=new C(...No("forearmL").a),e=new C(...No("forearmL").b).clone().sub(n),i=e.length();e.normalize();const s=new C(1,0,0).addScaledVector(e,-e.x).normalize(),r=new C().crossVectors(s,e),a=$0(9,3);return fr(36,8,(o,c,l)=>{const h=o*Math.PI,u=le(.5,1.12+.2*a(o),c)*i,d=le(.44,.95,c**1.4);l.copy(n).addScaledVector(e,u).addScaledVector(s,Math.sin(h)*d).addScaledVector(r,Math.cos(h)*d)},!0)}const Ph=(n,t,e)=>Math.min(fl(n,t,e),ul(n,t,e));function I1(n,t){let e=0,i=3.2;if(Ph(Math.sin(n)*i,t,Math.cos(n)*i)<0)return i;for(let s=i,r=0;s>0&&r<60;r++){const a=Ph(Math.sin(n)*s,t,Math.cos(n)*s);if(a<0){e=s,i=s+.1;break}s-=Math.max(.03,Math.min(.1,a*.8))}for(let s=0;s<12;s++){const r=(e+i)/2;Ph(Math.sin(n)*r,t,Math.cos(n)*r)<0?e=r:i=r}return e}function ZE(){wa=23;const n=[],t=[new vt(1841687),new vt(2499101),new vt(1184016),new vt(3814960)],e=64;for(let i=0;i<e;i++){const r=(i%2===0?1:-1)*(.62+(Math.PI-.62)*((Math.floor(i/2)+In()*.6)/(e/2))),a=Math.abs(r)/Math.PI,o=17.72-.25*a+In()*.08,c=le(15,12.4,a**.8)-In()*.6,l=[];let h=I1(r,o)+.06;const u=12,d=In()*6.28,f=.5+In()*.8;for(let w=0;w<=u;w++){const E=w/u,A=le(o,c,E),T=A>15.7?.08:le(.08,le(.48,.8,oe(1.9,2.6,Math.abs(r))),oe(15.7,15,A));h=Math.max(h,I1(r,A)+T);const M=.07*Math.sin(E*9*f+d)*E,y=r+M/Math.max(.8,h);l.push(new C(Math.sin(y)*h,A,Math.cos(y)*h-.02))}const p=new ei(l),v=new ps(p,14,.07,4,!1),g=v.attributes.position,m=15,_=5;for(let w=0;w<m;w++){const E=p.getPointAt(w/(m-1)),A=le(1,.3,w/(m-1))*(.8+.4*In());for(let T=0;T<_;T++){const M=w*_+T;g.setXYZ(M,E.x+(g.getX(M)-E.x)*A,E.y+(g.getY(M)-E.y)*A,E.z+(g.getZ(M)-E.z)*A)}}v.computeVertexNormals();const x=t[Math.floor(In()*t.length)],b=new Float32Array(g.count*3);for(let w=0;w<g.count;w++)b[w*3]=x.r,b[w*3+1]=x.g,b[w*3+2]=x.b;v.setAttribute("color",new Kt(b,3)),v.deleteAttribute("uv"),n.push(v)}return Ps(n)}function KE(n){const t=n.std({color:1315351,roughness:.88,side:ye}),e=new we;e.name="witch-hat";const i=fr(64,8,(f,p,v)=>{const g=f*Math.PI,m=le(.95,2.75,p);v.set(m*Math.sin(g),-.08*p-.2*p*p+.12*Math.sin(3*g+1)*p*p-.1*Math.max(0,Math.cos(g))*p*p,m*Math.cos(g))});e.add(new mt(i,t));const s=new ei([[0,0,0],[0,1.3,-.05],[.05,2.5,-.22],[.22,3.35,-.6],[.5,3.8,-1.15],[.82,3.72,-1.7],[1,3.45,-2]].map(([f,p,v])=>new C(f,p,v))),r=44,a=24,o=new ps(s,r,1,a,!1),c=o.attributes.position;for(let f=0;f<=r;f++){const p=f/r,v=s.getPointAt(p),g=1.08*Math.pow(1-p,.95)*(1+.05*Math.sin(p*28)*(1-p)*oe(.1,.2,p))+.015;for(let m=0;m<=a;m++){const _=f*(a+1)+m;c.setXYZ(_,v.x+(c.getX(_)-v.x)*g,v.y+(c.getY(_)-v.y)*g,v.z+(c.getZ(_)-v.z)*g)}}o.computeVertexNormals(),e.add(new mt(o,t));const l=new bi([new ht(1.13,.04),new ht(1.11,.24),new ht(1.09,.44)],40);e.add(new mt(l,n.std({color:5909114,roughness:.6,side:ye})));const h=n.std({color:14198840,roughness:.3,metalness:.9}),u=Ps([new be(.56,.08,.06).translate(0,.21,0),new be(.56,.08,.06).translate(0,-.21,0),new be(.08,.5,.06).translate(.24,0,0),new be(.08,.5,.06).translate(-.24,0,0),new be(.05,.42,.05).translate(0,0,.02)]),d=new mt(u,h);d.position.set(0,.24,1.13),d.rotation.x=-.03,e.add(d),e.rotation.set(-.1,.15,.1),n.at(e,"head",.04,17.86,-.02)}function JE(n,t,e){let i=Math.max(at(n,t,e,0,.42,.45,.46,.42,1),-t);return i=B(i,Math.max(K(n,t,e,0,.36,.8,0,.36,2,.36,.15),-t),.25),i=B(i,K(n,t,e,0,.36,2,0,.82,2.55,.15,.04),.12),i=B(i,K(n,t,e,0,.8,0,0,1.75,-.08,.44,.42),.25),i=Math.min(i,Math.max(Math.abs(n)-.2,Math.abs(t-.18)-.18,Math.abs(e+.28)-.18)),i}function QE(n){const t=new C(n*1.2,5.75,.23),e=new C(...No("shinL").b);e.x=n*1.2;const i=t.distanceTo(e),s=t.clone().sub(e).normalize(),r=[],a=m=>.38+.13*oe(0,.45,m/i)-.03*oe(.6,1,m/i),o=.34;for(let m=0;m*o<i;m++){const _=m*o,x=Math.min(i,(m+1)*o);r.push([_+.002,a(_),m%2],[(_+x)/2,a((_+x)/2),m%2],[x-.002,a(x),m%2])}const c=20,l=[],h=[],u=[],d=new C(1,0,0).addScaledVector(s,-s.x).normalize(),f=new C().crossVectors(d,s),p=new vt(6958238),v=new vt(1314840);r.forEach(([m,_,x],b)=>{const w=x?v:p;for(let E=0;E<=c;E++){const A=E/c*Math.PI*2,T=e.clone().addScaledVector(s,m).addScaledVector(d,Math.cos(A)*_).addScaledVector(f,Math.sin(A)*_);if(l.push(T.x,T.y,T.z),h.push(w.r,w.g,w.b),b>0&&E<c){const M=(b-1)*(c+1)+E,y=b*(c+1)+E;u.push(M,y,M+1,M+1,y,y+1)}}});const g=new me;return g.setAttribute("position",new re(l,3)),g.setAttribute("color",new re(h,3)),g.setIndex(u),g.computeVertexNormals(),g}function tT(n){wa=41;const t=new C(-2.93,9,.62),e=new C(-.07,1,.05).normalize(),i=d=>t.clone().addScaledVector(e,d),s=[];for(let d=0;d<=8;d++){const f=le(3.4,-6.2,d/8),p=i(f);p.x+=.06*Math.sin(d*2.1),p.z+=.05*Math.cos(d*1.7),s.push(p)}const r=new ps(new ei(s),40,.12,8,!1),a=n.std({color:5914148,roughness:.75}),o=new we;o.add(new mt(r,a)),o.add(new mt(new ie(.13,10,8).translate(s[0].x,s[0].y,s[0].z),a));const c=i(-6),l=[],h=[14201948,12884540,15256700,11043386].map(d=>new vt(d));for(let d=0;d<150;d++){const f=In()*Math.PI*2,p=.26*Math.sqrt(In()),v=c.clone().add(new C(Math.cos(f)*p,.3-In()*.3,Math.sin(f)*p)),g=.12+.75*(p/.26),m=new C(v.x+Math.cos(f)*g,Math.max(.05,v.y-2.4-In()*.4),v.z+Math.sin(f)*g),_=v.distanceTo(m),x=new gi(.045,_,3,1).rotateX(Math.PI).translate(0,_/2,0);x.applyQuaternion(new Me().setFromUnitVectors(new C(0,1,0),v.clone().sub(m).normalize())).translate(m.x,m.y,m.z);const b=h[Math.floor(In()*h.length)],w=x.attributes.position.count,E=new Float32Array(w*3);for(let A=0;A<w;A++)E[A*3]=b.r,E[A*3+1]=b.g,E[A*3+2]=b.b;x.setAttribute("color",new Kt(E,3)),l.push(x)}o.add(new mt(Ps(l),n.std({color:16777215,vertexColors:!0,roughness:.8})));const u=n.std({color:6958238,roughness:.7});for(const[d,f]of[[-5.85,.33],[-6.15,.38]]){const p=new mt(new zn(f,.06,6,20),u);p.position.copy(i(d)),p.quaternion.setFromUnitVectors(new C(0,0,1),e),o.add(p)}n.at(o,"forearmR",0,0,0)}function eT(n){Jm(n,fl,IE,{min:[-1.05,15.05,-1.2],max:[1.05,18.5,2.05]},{min:[-.5,15.5,-.2],max:[.5,16.7,1.3]},56,30,BE,tE("witch-head-v1"),"witch"),Qm(n,ki,.12,13157400,.3,"witch-eye",{look:[.08,.05],lid:6984786,lidRest:.26,white:14867648,irisFrac:.6});const t=(g,m)=>{const _=17.4+m;return[g,_,dr(fl,g,_,.3,1.6)+.025]};tg(n,t(.1,.06),t(.58,.2),.06,.03,2367516,"witch-brow"),KE(n);const e=ZE();mo(n,e,(g,m)=>{const _=oe(15.7,16.6,m);return[["head",_],["neck",(1-_)*.3],["spine2",(1-_)*.7]]}),qc(n,e,n.std({color:16777215,vertexColors:!0,roughness:.5}),"witch-hair");const i=fr(110,40,zE,!0,!0);mo(n,i,GE),qc(n,i,$c(1446938,2760240,.7,.12,"witch-cloth-v1"),"witch-skirt");const s=fr(72,22,$E);mo(n,s,YE),qc(n,s,$c(6040194,3020354,.85,.15,"witch-cloth-v1"),"witch-shawl");const r=new mt(new ie(.26,12,10).scale(1.3,.9,.8),n.std({color:6040194,roughness:.85}));n.at(r,"spine2",0,13.25,dr(ul,0,13.25)+.36);const a=new mt(new zn(1,.12,8,40).rotateX(Math.PI/2).scale(1.13,1.6,.82),n.std({color:4858470,roughness:.7}));n.at(a,"spine1",0,11.12,.05);const o=n.std({color:14198840,roughness:.3,metalness:.9}),c=Ps([new be(.42,.07,.06).translate(0,.17,0),new be(.42,.07,.06).translate(0,-.17,0),new be(.07,.4,.06).translate(.18,0,0),new be(.07,.4,.06).translate(-.18,0,0)]);n.at(new mt(c,o),"spine1",0,11.12,dr(ul,0,11.12)+.17);const l=jE(),h=$c(1446938,2760240,.7,.12,"witch-cloth-v1");n.at(new mt(l,h),"forearmL",0,0,0);const u=new mt(l,h);u.scale.x=-1,n.at(u,"forearmR",0,0,0);const d=n.std({color:16777215,vertexColors:!0,roughness:.8}),f=n.std({color:1840664,roughness:.38}),p=mn(JE,{min:[-.6,-.05,-.65],max:[.6,1.95,2.75]},34,void 0,16e3),v=new bi([new ht(.43,0),new ht(.47,1),new ht(.52,1.35),new ht(.58,1.42),new ht(.56,1.62),new ht(.46,1.6)],24);for(const g of[1,-1]){const m=g>0?"L":"R";n.at(new mt(QE(g),d),"shin"+m,0,0,0);const _=No("shin"+m).b,x=new we;x.add(new mt(v,f)),x.quaternion.setFromUnitVectors(new C(0,1,0),new C(...No("shin"+m).a).sub(new C(..._)).normalize()),n.at(x,"shin"+m,_[0],_[1]+.25,_[2]),n.at(new mt(p,f),"foot"+m,g*1.2,0,0);const b=new mt(c,o);b.scale.setScalar(.8),b.rotation.x=-.85,n.at(b,"foot"+m,g*1.2,.98,.95)}tT(n)}const D1=new WeakMap,nT={id:"witch",name:"Witch",blurb:"A green-faced witch with a crooked hat and a broom",segs:lg,body:{sdf:ul,region:CE,box:TE,palette:[1578524,10011258,1183766],surface:"soft",weights:"sharp",capture:ig(n=>n<12?2.1:n<14.1?1.9:2,15.85)},dress:eT,fit:{size:1.06,limb:.7},face:{jaw:.45,eyes:[[ki[0],ki[1],ki[2]+.12,.16],[-.32,ki[1],ki[2]+.12,.16]],breath:{colors:[8191818,11559167,14221194,9055487],rate:1.2,speed:.8}},res:84,tick(n,t,e){let i=D1.get(n);i||(i=eg(n,"witch-eye","witch-brow",["witch-eye-iris"]),D1.set(n,i)),ng(i,e,.14);const s=.28+.08*Math.sin(t*2.3)+.9*(e?.jaw??0);for(const r of i.glow)r.emissiveIntensity=s}},Wi=[y5,D5,Y5,py,mw,zy,gw,Ow,cS,IS,JS,EE,nT,dw,vw,xw,_w],Zu=["jimothy","builder","skeleton","pumpkin","howler","violet","plume"],Gi=n=>Wi.find(t=>t.id===n)??Wi[0],iT=n=>new C(n.x,n.y,n.z),sT=new C(1,0,0),rT=new C(0,1,0),Kr=(n,t,e)=>{const i=Math.min(1,Math.max(0,(e-n)/(t-n)));return i*i*(3-2*i)};function U1(n,t){const e=t.clone().normalize(),i=new C().crossVectors(n,e).normalize(),s=new C().crossVectors(e,i).normalize();return new Me().setFromRotationMatrix(new se().makeBasis(s,e,i))}function aT(n,t){const e=n.clone().normalize(),i=new C().crossVectors(t,e).normalize(),s=new C().crossVectors(e,i).normalize();return new Me().setFromRotationMatrix(new se().makeBasis(e,i,s))}function Ku(n){const t=b=>iT(n[b]),e=(...b)=>Math.min(...b.map(w=>n[w].v)),i=t(O.hipL),s=t(O.hipR),r=t(O.shL),a=t(O.shR),o=i.clone().add(s).multiplyScalar(.5),c=r.clone().add(a).multiplyScalar(.5),l=c.clone().sub(o),h=U1(i.clone().sub(s),l),u=U1(r.clone().sub(a),l),d=t(O.earL),f=t(O.earR),p=t(O.nose),v=d.clone().add(f).multiplyScalar(.5),g=aT(d.clone().sub(f),p.clone().sub(v));g.multiply(new Me().setFromAxisAngle(new C(1,0,0),-.32));const m=(b,w)=>t(w).sub(t(b)).normalize(),_={armL:m(O.shL,O.elL),forearmL:m(O.elL,O.wrL),armR:m(O.shR,O.elR),forearmR:m(O.elR,O.wrR),thighL:m(O.hipL,O.knL),shinL:m(O.knL,O.anL),footL:m(O.heelL,O.toeL),thighR:m(O.hipR,O.knR),shinR:m(O.knR,O.anR),footR:m(O.heelR,O.toeR)},x={armL:e(O.shL,O.elL),forearmL:e(O.elL,O.wrL),armR:e(O.shR,O.elR),forearmR:e(O.elR,O.wrR),thighL:e(O.hipL,O.knL),shinL:e(O.knL,O.anL),footL:e(O.heelL,O.toeL),thighR:e(O.hipR,O.knR),shinR:e(O.knR,O.anR),footR:e(O.heelR,O.toeR)};return{pelvis:h,chest:u,head:g,headVis:e(O.earL,O.earR,O.nose),neck:v.sub(c).normalize(),dir:_,vis:x}}const oT={armL:new C(1,0,0),armR:new C(-1,0,0),thighL:new C(0,-1,0),thighR:new C(0,-1,0),neck:new C(0,1,0)},N1={forearmL:"armL",forearmR:"armR",shinL:"thighL",shinR:"thighR",footL:"shinL",footR:"shinR"};class cT{bones;rest=new Map;qm=new Map;hipRest;pelvisA;torso;len=new Map;segs;constructor(t,e){this.segs=t,this.bones=e;const i=l=>t.find(h=>h.name===l);for(const l of t){const h=new C(l.b[0]-l.a[0],l.b[1]-l.a[1],l.b[2]-l.a[2]);this.len.set(l.name,h.length()),h.lengthSq()>1e-9?h.normalize():h.set(0,1,0);const u=l.parent?i(l.parent):null,d=u?new C(l.a[0]-u.a[0],l.a[1]-u.a[1],l.a[2]-u.a[2]):new C(...l.a);let f=oT[l.name];if(!f&&N1[l.name]){const p=i(N1[l.name]);f=new C(p.b[0]-p.a[0],p.b[1]-p.a[1],p.b[2]-p.a[2]).normalize(),l.name.startsWith("foot")&&(f=h.clone())}f??=h.clone(),this.rest.set(l.name,{dir:h,offset:d,pre:new Me().setFromUnitVectors(h,f),canon:f})}this.pelvisA=new C(...i("pelvis").a);const s=i("thighL").a,r=i("thighR").a,a=i("armL").a,o=i("armR").a;this.hipRest=new C((s[0]+r[0])/2,(s[1]+r[1])/2,(s[2]+r[2])/2);const c=new C((a[0]+o[0])/2,(a[1]+o[1])/2,(a[2]+o[2])/2);this.torso=c.distanceTo(this.hipRest)}setLength(t,e){const i=this.segs.find(a=>a.parent===t&&!a.name.startsWith("tail")&&a.name!=="jaw");if(!i)return;const s=this.bones.get(i.name),r=this.rest.get(i.name);s.position.copy(r.offset).multiplyScalar(e)}neckFit(t){const e=l=>this.segs.find(h=>h.name===l),i=e("spine2"),s=e("neck"),r=e("head"),a=(e("armL").a[1]+e("armR").a[1])/2-i.a[1],o=s.a[1]-i.a[1]+(r.a[1]-s.a[1]),c=(r.a[1]+r.b[1])/2-r.a[1];return o>.001?(a+t-c)/o:1}setNeck(t){for(const e of["neck","head"]){const i=this.bones.get(e),s=this.rest.get(e);i&&s&&i.position.copy(s.offset).multiplyScalar(t)}}swing(t,e,i,s){const r=this.rest.get(t),a=i.clone().applyQuaternion(e.clone().invert()).normalize(),o=new Me().setFromUnitVectors(r.canon,a).multiply(r.pre);return s<1&&o.slerp(new Me,1-Math.max(0,s)),o}glide=0;primed=new Set;set(t,e,i){const s=this.bones.get(t);s&&(this.glide>0&&this.primed.has(t)&&(e=s.quaternion.clone().slerp(e,this.glide)),s.quaternion.copy(e),this.primed.add(t));const r=i?i.clone().multiply(e):e.clone();return this.qm.set(t,r),r}apply(t,e=0,i=0,s=0){this.glide=s>0?1-Math.exp(-s/.025):0;const r=this.set("pelvis",t.pelvis,null),a=this.hipRest.clone().sub(this.pelvisA).applyQuaternion(t.pelvis);this.bones.get("pelvis").position.copy(a.negate());const o=t.pelvis.clone().slerp(t.chest,.5),c=this.set("spine1",r.clone().invert().multiply(o),r),l=this.set("spine2",c.clone().invert().multiply(t.chest),c),h=Kr(.3,.7,t.headVis),u=this.set("neck",this.swing("neck",l,t.neck,h*.6),l),d=u.clone().invert().multiply(t.head);h<1&&d.slerp(new Me,1-h),this.set("head",d,u);for(const p of["L","R"]){const v=this.set("arm"+p,this.swing("arm"+p,l,t.dir[`arm${p}`],Kr(.35,.7,t.vis[`arm${p}`])),l);this.set("forearm"+p,this.swing("forearm"+p,v,t.dir[`forearm${p}`],Kr(.35,.7,t.vis[`forearm${p}`])),v);const g=this.set("thigh"+p,this.swing("thigh"+p,r,t.dir[`thigh${p}`],Kr(.4,.75,t.vis[`thigh${p}`])),r),m=this.set("shin"+p,this.swing("shin"+p,g,t.dir[`shin${p}`],Kr(.4,.75,t.vis[`shin${p}`])),g);this.set("foot"+p,this.swing("foot"+p,m,t.dir[`foot${p}`],Kr(.5,.8,t.vis[`foot${p}`])),m)}let f=r;for(let p=1;p<=4;p++){const v="tail"+p;if(!this.bones.has(v))break;const g=new Me().setFromEuler(new gn(0,Math.sin(e*2.1-p*.7)*i,Math.sin(e*1.3-p*.5)*i*.3));f=this.set(v,g,p===1?this.qm.get(this.segs.find(m=>m.name==="tail1")?.parent??"pelvis")??r:f)}}setJaw(t,e=0){const i=this.bones.get("jaw");i&&i.quaternion.setFromAxisAngle(rT,e*.16).multiply(new Me().setFromAxisAngle(sT,t))}dirOf(t){return this.rest.get(t).dir.clone().applyQuaternion(this.qm.get(t))}}const ws=128,Jr=64,Yn=96,Ri=72,Ss=12,Qr=9,Ci=24,ai={spread:1,back:.9,envIntensity:1.15,key:5,every:6,targetMean:.22,maxGain:2.8,fill:.35},ta=new Float32Array(256).map((n,t)=>{const e=t/255;return e<=.04045?e/12.92:Math.pow((e+.055)/1.055,2.4)});class lT{constructor(t,e,i){this.renderer=t,this.scene=e,this.cv=document.createElement("canvas"),this.cv.width=Yn,this.cv.height=Ri,this.ctx=this.cv.getContext("2d",{willReadFrequently:!0}),this.fcv=document.createElement("canvas"),this.fcv.width=this.fcv.height=Ci,this.fctx=this.fcv.getContext("2d",{willReadFrequently:!0}),this.tex=new xa(this.data,ws,Jr,Je,_r),this.tex.mapping=Yc,this.tex.colorSpace=gr,this.tex.magFilter=Re,this.tex.minFilter=Re,this.pmrem=new Pu(t),this.key.castShadow=!0,this.key.shadow.mapSize.set(1024,1024),this.key.shadow.bias=-5e-4,this.key.shadow.normalBias=.02,this.key.shadow.radius=4,e.add(this.key),e.add(this.key.target),e.add(this.fill),this.fill.intensity=1}key=new Lu(16777215,1);fill=new sx(16777215,4473924,0);cv;ctx;lin=new Float32Array(Yn*Ri*3);blur=new Float32Array(Ss*Qr*3);data=new Uint16Array(ws*Jr*4);smooth=new Float32Array(ws*Jr*3);primed=!1;keyDir=new C(0,1,1).normalize();keyI=0;tex;pmrem;rt=null;mean=0;share=0;gain=1;realism=!1;face=null;faceDir=new C(0,0,1);faceLum=0;faceConf=0;fcv;fctx;dir=new C(0,1,1).normalize();target=new C(0,0,-2);update(t,e,i,s,r,a){if(this.aimShadows(r,i),!a){this.scene.environment=null,this.fill.intensity=1.2,this.key.intensity=1.6,this.key.position.copy(this.target).add(new C(1.5,3,2.5));return}if(s%ai.every!==0&&this.rt||t.readyState<2||!t.videoWidth)return;this.ctx.drawImage(t,0,0,Yn,Ri);const o=this.ctx.getImageData(0,0,Yn,Ri).data;let c=0;for(let y=0,S=0;y<Yn*Ri;y++,S+=4){const R=ta[o[S]],I=ta[o[S+1]],L=ta[o[S+2]];this.lin[y*3]=R,this.lin[y*3+1]=I,this.lin[y*3+2]=L,c+=.2126*R+.7152*I+.0722*L}this.mean=c/(Yn*Ri),this.gain=Math.min(this.realism?1.25:ai.maxGain,Math.max(1,ai.targetMean/Math.max(this.mean,.001)));const l=this.gain;this.readFace(t,i),this.blur.fill(0);const h=Yn/Ss,u=Ri/Qr;for(let y=0;y<Ri;y++)for(let S=0;S<Yn;S++){const R=(Math.floor(y/u)*Ss+Math.floor(S/h))*3,I=(y*Yn+S)*3,L=this.blur;L[R]=L[R]+this.lin[I],L[R+1]=L[R+1]+this.lin[I+1],L[R+2]=L[R+2]+this.lin[I+2]}for(let y=0;y<this.blur.length;y++)this.blur[y]=this.blur[y]/(h*u);const d=e.f/e.w,f=e.f/e.h;let p=0;for(let y=0;y<Ss*Qr;y++)p+=.2126*this.blur[y*3]+.7152*this.blur[y*3+1]+.0722*this.blur[y*3+2];p/=Ss*Qr;const v=this.faceConf>0?Math.min(2.5,Math.max(.4,this.faceLum/.35/Math.max(p*2.2,.001))):1,g=ai.back*(1+(v-1)*this.faceConf);let m=0,_=0,x=0,b=0;for(let y=0;y<Jr;y++){const S=((y+.5)/Jr-.5)*Math.PI,R=Math.sin(S),I=Math.cos(S);for(let L=0;L<ws;L++){const D=((L+.5)/ws-.5)*Math.PI*2;let k=Math.cos(D)*I;const q=Math.sin(D)*I,z=i?-k:k,it=q<0,ut=Math.max(Math.abs(q),.05),gt=.5+z/ut*d/ai.spread,_t=.5-R/ut*f/ai.spread,At=Math.min(1,Math.max(0,gt)),Ut=Math.min(1,Math.max(0,_t)),ct=(Math.min(Qr-1,Math.floor(Ut*Qr))*Ss+Math.min(Ss-1,Math.floor(At*Ss)))*3;let G,J,H;if(it){const Q=(Math.min(Ri-1,Math.floor(Ut*Ri))*Yn+Math.min(Yn-1,Math.floor(At*Yn)))*3,Z=Math.max(Math.abs(gt-.5)-.5,Math.abs(_t-.5)-.5,0),et=Math.min(1,Z/.4);G=this.lin[Q]+(this.blur[ct]-this.lin[Q])*et,J=this.lin[Q+1]+(this.blur[ct+1]-this.lin[Q+1])*et,H=this.lin[Q+2]+(this.blur[ct+2]-this.lin[Q+2])*et}else G=this.blur[ct]*g,J=this.blur[ct+1]*g,H=this.blur[ct+2]*g;G*=l,J*=l,H*=l;const W=(y*ws+L)*3,V=this.primed?.28:1;G=this.smooth[W]=this.smooth[W]+(G-this.smooth[W])*V,J=this.smooth[W+1]=this.smooth[W+1]+(J-this.smooth[W+1])*V,H=this.smooth[W+2]=this.smooth[W+2]+(H-this.smooth[W+2])*V;const tt=(y*ws+L)*4;this.data[tt]=nc.toHalfFloat(G),this.data[tt+1]=nc.toHalfFloat(J),this.data[tt+2]=nc.toHalfFloat(H),this.data[tt+3]=nc.toHalfFloat(1);const st=.2126*G+.7152*J+.0722*H,N=st*I;k=Math.cos(D)*I,m+=N*k,_+=N*R,x+=N*q,b+=N}}this.primed=!0,this.tex.needsUpdate=!0,this.rt=this.pmrem.fromEquirectangular(this.tex,this.rt),this.scene.environment=this.rt.texture,this.scene.environmentIntensity=ai.envIntensity;const w=Math.hypot(m,_,x);this.share=b>0?w/b:0;const A=(w>1e-6?new C(m/w,_/w,x/w):this.keyDir.clone()).clone().lerp(this.faceDir,.65*this.faceConf).normalize();this.keyDir.lerp(A,.25).normalize(),this.dir.copy(this.keyDir),this.dir.y<.15&&(this.dir.y=.15,this.dir.normalize());const T=this.faceConf>0?Math.min(1,this.faceDir.clone().setZ(0).length()*1.4):this.share,M=ai.key*(this.share+(T-this.share)*this.faceConf*.6)*(b/(ws*Jr))*2;this.keyI+=(M-this.keyI)*(this.keyI===0?1:.25),this.key.intensity=this.keyI,this.fill.intensity=ai.fill*(this.realism?.25:1)*Math.min(1,Math.max(0,1-this.mean/.22)),this.key.position.copy(this.target).addScaledVector(this.dir,4)}readFace(t,e){const i=this.face;if(!i||i.w<.04){this.faceConf*=.9;return}const s=i.probe.map(I=>I.x),r=i.probe.map(I=>I.y),a=Math.min(...s),o=Math.max(...s),c=Math.min(...r),l=Math.max(...r),h=.15,u=(o-a)*(1+h*2),d=(l-c)*(1+h*2),f=a-(o-a)*h,p=c-(l-c)*h,v=t.videoWidth,g=t.videoHeight;if(u<=0||d<=0||!v)return;this.fctx.drawImage(t,f*v,p*g,u*v,d*g,0,0,Ci,Ci);const m=this.fctx.getImageData(0,0,Ci,Ci).data,_=i.probe.map(I=>{const L=Math.round((I.x-f)/u*(Ci-1)),D=Math.round((I.y-p)/d*(Ci-1));let k=0,q=0;for(let z=-1;z<=1;z++)for(let it=-1;it<=1;it++){const ut=Math.min(Ci-1,Math.max(0,L+it)),gt=Math.min(Ci-1,Math.max(0,D+z)),_t=(gt*Ci+ut)*4;k+=.2126*ta[m[_t]]+.7152*ta[m[_t+1]]+.0722*ta[m[_t+2]],q++}return k/q}),[x,b,w,E,A]=_,T=(x+b+w+E+A)/5,M=(w-E)/Math.max(w+E,1e-4),y=(x-b)/Math.max(x+b,1e-4),S=new C(M*2.2*(e?-1:1),Math.max(.1,y*1+.35),.75).normalize(),R=Math.min(1,Math.max(0,(i.w-.04)/.08));this.faceDir.lerp(S,.3).normalize(),this.faceLum+=(T-this.faceLum)*.3,this.faceConf+=(R-this.faceConf)*.3}aimShadows(t,e){if(!t.length)return;const i=new C;for(const a of t)i.add(a);i.multiplyScalar(1/t.length),e&&(i.x=-i.x);let s=1.4;for(const a of t)s=Math.max(s,Math.hypot((e?-a.x:a.x)-i.x,a.y-i.y,a.z-i.z)+1.4);this.target.copy(i),this.key.target.position.copy(i),this.key.position.copy(i).addScaledVector(this.dir,4);const r=this.key.shadow.camera;r.right!==s&&(r.left=-s,r.right=s,r.top=s,r.bottom=-s,r.near=.1,r.far=4+s*2,r.updateProjectionMatrix())}}const ea={tauN:1,tauH:.6,imuAgree:35,footVis:.5};class hT{n=new C(0,1,0);h=-1.4;source="assumed";fromFeet=!1;bodyUp=new C(0,1,0);bodyW=0;update(t,e,i){const s=1-Math.exp(-i/ea.tauN),r=1-Math.exp(-i/ea.tauH),a=new C;let o=0;for(const f of t){if(f.lost||f.presence<.5)continue;const p=x=>new C(f.world[x].x,f.world[x].y,f.world[x].z),v=p(O.shL).add(p(O.shR)).multiplyScalar(.5),g=Math.min(f.world[O.anL].v,f.world[O.anR].v),m=g>ea.footVis?p(O.anL).add(p(O.anR)).multiplyScalar(.5):p(O.hipL).add(p(O.hipR)).multiplyScalar(.5),_=v.sub(m);_.lengthSq()<1e-4||(a.addScaledVector(_.normalize(),f.presence*(g>ea.footVis?1:.6)),o+=f.presence)}o>0&&a.lengthSq()>1e-6&&(a.normalize(),this.bodyUp.lerp(a,this.bodyW>0?s*.5:1).normalize(),this.bodyW=Math.min(1,this.bodyW+i));let c=null;const l=Math.cos(cr.degToRad(ea.imuAgree));e&&(this.bodyW===0||e.dot(this.bodyUp)>l)?(c=e,this.source="motion"):this.bodyW>0&&(c=this.bodyUp,this.source="body"),c&&this.n.lerp(c,s).normalize();let h=0,u=0,d=!1;for(const f of t){if(f.lost||f.presence<.5)continue;const p=_=>this.n.x*(f.T.x+f.world[_].x)+this.n.y*(f.T.y+f.world[_].y)+this.n.z*(f.T.z+f.world[_].z);let v=1/0;for(const[_,x]of[[O.heelL,.02],[O.heelR,.02],[O.toeL,.02],[O.toeR,.02],[O.anL,.08],[O.anR,.08]])f.world[_].v>ea.footVis&&(v=Math.min(v,p(_)-x));if(v<1/0){h+=v*f.presence,u+=f.presence,d=!0;continue}const g=(p(O.hipL)+p(O.hipR))/2,m=Math.max(.6,Math.min(1.1,f.len.thigh+f.len.shin+.08));h+=(g-m)*f.presence*.4,u+=f.presence*.4}u>0&&(this.h+=(h/u-this.h)*r,this.fromFeet=d)}foot(t,e=new C){return e.copy(t).addScaledVector(this.n,this.h-this.n.dot(t))}height(t){return this.n.dot(t)-this.h}axes(){const t=new C(0,0,-1).addScaledVector(this.n,this.n.z).normalize(),e=new C().crossVectors(t,this.n).normalize();return{back:t,side:e}}get cameraHeight(){return-this.h}}const Ks={coupling:.08,deadzone:2,restitution:.55,pupil:.46},uT=new ds({color:16777215,side:ye,depthTest:!1,toneMapped:!1}),fT=new ds({color:657930,side:ye,depthTest:!1,toneMapped:!1}),dT=new ds({color:10132122,side:ye,depthTest:!1,toneMapped:!1}),pT=new ds({color:16777215,side:ye,depthTest:!1,transparent:!0,opacity:.85,toneMapped:!1}),mT=new Oa(1,40),gT=new y0(.95,1.05,40),vT=new Oa(1,28),xT=new Oa(.16,16);class F1{g=new we;pupil;q=new ht(0,-.5);w=new ht;prev=[];sm=new C;primed=!1;constructor(){const t=new mt(mT,uT),e=new mt(gT,dT);this.pupil=new mt(vT,fT),this.pupil.scale.setScalar(Ks.pupil);const i=new mt(xT,pT);i.position.set(-.38,.42,.003),this.pupil.position.z=.0015,e.position.z=.001,this.g.add(t,e,this.pupil,i),this.g.traverse(s=>{s.renderOrder=1100,s.frustumCulled=!1})}update(t,e,i,s){this.primed||(this.sm.copy(t.p),this.primed=!0),this.sm.lerp(t.p,1-Math.exp(-i/.05)),this.prev.push(this.sm.clone()),this.prev.length>3&&this.prev.shift();const r=new C;if(this.prev.length===3&&i>0){r.copy(this.prev[2]).addScaledVector(this.prev[1],-2).add(this.prev[0]).divideScalar(i*i);const d=r.length();r.multiplyScalar(d>Ks.deadzone?(d-Ks.deadzone)/d:0)}const a=new C().addScaledVector(e,-9.8).addScaledVector(r,-1).multiplyScalar(Ks.coupling/Math.max(t.r,.005)),o=a.dot(t.u),c=a.dot(t.v),l=1-Ks.pupil,h=4,u=Math.min(i,.1)/h;for(let d=0;d<h;d++){this.w.x+=o*u,this.w.y+=c*u,this.w.multiplyScalar(Math.exp(-2.2*u)),this.q.addScaledVector(this.w,u);const f=this.q.length();if(f>l){const p=this.q.x/f,v=this.q.y/f;this.q.set(p*l,v*l);const g=this.w.x*p+this.w.y*v;if(g>0){const m=this.w.x-g*p,_=this.w.y-g*v;this.w.set(m*.9-Ks.restitution*g*p,_*.9-Ks.restitution*g*v)}}}this.g.position.copy(t.p),this.g.quaternion.setFromRotationMatrix(new se().makeBasis(t.u,t.v,t.n)),this.g.scale.setScalar(t.r*s),this.g.visible=s>.02,this.pupil.position.set(this.q.x,this.q.y,.0015)}}class _T{group=new we;eyes=new Map;update(t,e,i,s){this.group.visible=s;const r=new Set;if(s)for(const a of t){if(!a.eyes)continue;r.add(a.id);let o=this.eyes.get(a.id);if(!o){o=[new F1,new F1];for(const c of o)this.group.add(c.g);this.eyes.set(a.id,o)}a.eyes.forEach((c,l)=>o[l]?.update(c,e,i,a.show))}for(const[a,o]of this.eyes)if(!r.has(a)){for(const c of o)this.group.remove(c.g);this.eyes.delete(a)}}}const Es=900,MT=`
  attribute float aSize; attribute float aLife; attribute vec3 aColor;
  uniform float uScale;
  varying float vLife; varying vec3 vColor; varying float vNear;
  void main() {
    vLife = aLife; vColor = aColor;
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * mv;
    // a spark flying at the lens fades out and never grows past a tenth of the frame (it would be a white disc)
    float z = max(-mv.z, 0.05);
    vNear = smoothstep(0.2, 0.55, z);
    gl_PointSize = aLife > 0.0 ? min(aSize * uScale / z, uScale * 0.1) : 0.0;
  }`,bT=`
  varying float vLife; varying vec3 vColor; varying float vNear;
  void main() {
    vec2 c = gl_PointCoord - 0.5;
    float d = length(c) * 2.0;
    if (d > 1.0 || vLife <= 0.0) discard;
    float core = exp(-d * d * 5.0), halo = exp(-d * d * 1.6) * 0.45;
    // in quickly (a fast spark is metres out by a slow fade-in's end), out slowly
    float fade = smoothstep(0.0, 0.25, vLife) * smoothstep(1.0, 0.95, vLife) * vNear;
    gl_FragColor = vec4(vColor * (core * 1.6 + halo) * fade, 1.0);
  }`,yT=[16722324,11796265,16769065,2744575,9187071].map(n=>new vt(n));class wT{points;pos=new Float32Array(Es*3);vel=new Float32Array(Es*3);col=new Float32Array(Es*3);size=new Float32Array(Es);life=new Float32Array(Es);span=new Float32Array(Es);next=0;owed=new Map;mat;constructor(){const t=new me;t.setAttribute("position",new Kt(this.pos,3)),t.setAttribute("aColor",new Kt(this.col,3)),t.setAttribute("aSize",new Kt(this.size,1)),t.setAttribute("aLife",new Kt(this.life,1)),this.mat=new Ze({vertexShader:MT,fragmentShader:bT,uniforms:{uScale:{value:800}},transparent:!0,depthWrite:!1,blending:Ea,toneMapped:!1}),this.points=new wv(t,this.mat),this.points.frustumCulled=!1,this.points.renderOrder=1050}update(t,e,i,s){if(this.mat.uniforms.uScale.value=i,this.points.visible=s,!s)return;for(const o of t){const c=Math.min(1,Math.max(0,(o.open-.3)/.45));let l=(this.owed.get(o.id)??0)+c*c*110*(o.rate??1)*e;const h=o.colors?.length?o.colors:yT;for(;l>=1;){l-=1;const u=this.next;this.next=(this.next+1)%Es;const d=.35,f=Math.random()*Math.PI*2,p=Math.random()*d,v=new C(1,0,0).cross(o.dir);v.lengthSq()<1e-4&&v.set(0,1,0),v.normalize();const g=new C().crossVectors(o.dir,v).normalize(),m=o.dir.clone().addScaledVector(v,Math.cos(f)*p).addScaledVector(g,Math.sin(f)*p-.15).normalize(),_=(1.1+Math.random()*1.1)*o.scale*(o.speed??1);this.pos[u*3]=o.p.x,this.pos[u*3+1]=o.p.y,this.pos[u*3+2]=o.p.z,this.vel[u*3]=m.x*_,this.vel[u*3+1]=m.y*_,this.vel[u*3+2]=m.z*_;const x=h[Math.floor(Math.random()*h.length)];this.col[u*3]=x.r,this.col[u*3+1]=x.g,this.col[u*3+2]=x.b,this.size[u]=(.025+Math.random()*.045)*o.scale*(o.size??1),this.span[u]=.9+Math.random()*.6,this.life[u]=1}this.owed.set(o.id,l)}const r=Math.exp(-1.6*e);for(let o=0;o<Es;o++)this.life[o]<=0||(this.life[o]=this.life[o]-e/this.span[o],this.vel[o*3]=this.vel[o*3]*r,this.vel[o*3+2]=this.vel[o*3+2]*r,this.vel[o*3+1]=this.vel[o*3+1]*r+.5*e,this.pos[o*3]=this.pos[o*3]+this.vel[o*3]*e,this.pos[o*3+1]=this.pos[o*3+1]+this.vel[o*3+1]*e,this.pos[o*3+2]=this.pos[o*3+2]+this.vel[o*3+2]*e);const a=this.points.geometry;for(const o of["position","aColor","aSize","aLife"])a.getAttribute(o).needsUpdate=!0}}const ST=new Ze({transparent:!0,depthWrite:!1,toneMapped:!1,vertexShader:"varying vec2 vUv; void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }",fragmentShader:"varying vec2 vUv; void main() { float r = length(vUv - 0.5) * 2.0; gl_FragColor = vec4(0.0, 0.0, 0.0, 0.5 * pow(clamp(1.0 - r, 0.0, 1.0), 1.6)); }"}),ET=new ls(1,1),Ih=12,TT=n=>({pelvis:n.pelvis.clone(),chest:n.chest.clone(),head:n.head.clone(),headVis:n.headVis,neck:n.neck.clone(),dir:Object.fromEntries(Object.entries(n.dir).map(([t,e])=>[t,e.clone()])),vis:{...n.vis}}),fg=`
  varying vec2 vUv;
  uniform vec4 uCrop; // u0, v0, du, dv of the video shown
  uniform float uMirror;
  void main() {
    vec2 uv = position.xy * 0.5 + 0.5;
    uv.x = mix(uv.x, 1.0 - uv.x, uMirror);
    vUv = uCrop.xy + uv * uCrop.zw;
    gl_Position = vec4(position.xy, 1.0, 1.0);
  }`,AT=`
  varying vec2 vUv;
  uniform sampler2D uTex;
  void main() { gl_FragColor = vec4(texture2D(uTex, vUv).rgb, 1.0); }`;class RT{constructor(t){this.canvas=t,this.renderer=new Yb({canvas:t,antialias:!0,alpha:!1,powerPreference:"high-performance",preserveDrawingBuffer:!1}),this.renderer.outputColorSpace=rn,this.renderer.toneMapping=tp,this.renderer.toneMappingExposure=1,this.renderer.shadowMap.enabled=!0,this.renderer.shadowMap.type=j1,this.renderer.setPixelRatio(this.opts.pixelRatio),this.plainBg=new Ze({vertexShader:fg,fragmentShader:AT,depthTest:!1,depthWrite:!1,toneMapped:!1,uniforms:this.bgUniforms}),this.bg=new mt(new ls(2,2),this.plainBg),this.fg=new mt(new ls(2,2),this.plainBg),this.fg.frustumCulled=!1,this.fg.renderOrder=1e3,this.fg.visible=!1,this.bg.frustumCulled=!1,this.bg.renderOrder=-1e3,this.scene.add(this.bg),this.scene.add(this.fg),this.scene.add(this.world),this.world.add(this.googly.group,this.breath.points);for(const e of this.spots)this.world.add(e,e.target);this.grain=new mt(new ls(2,2),new Ze({vertexShader:"varying vec2 vUv; void main() { vUv = position.xy * 0.5 + 0.5; gl_Position = vec4(position.xy, 0.0, 1.0); }",fragmentShader:`varying vec2 vUv; uniform float uTime; uniform vec2 uRes;
        float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
        void main() {
          vec2 d = vUv - 0.5; d.y *= 1.15;
          float vig = 1.0 - 0.35 * dot(d, d);
          float n = hash(floor(vUv * uRes) + fract(uTime * 7.31) * 97.0);
          gl_FragColor = vec4(vec3(vig * (0.965 + 0.035 * n)), 1.0);
        }`,uniforms:{uTime:{value:0},uRes:{value:new ht(1,1)}},depthTest:!1,depthWrite:!1,toneMapped:!1,transparent:!0,blending:Z1,blendSrc:K1,blendDst:J1})),this.grain.frustumCulled=!1,this.grain.renderOrder=1200,this.grain.visible=!1,this.scene.add(this.grain),this.scene.add(this.camera),this.light=new lT(this.renderer,this.scene,this.world),this.rims[0].position.set(-3,2.5,-6),this.rims[1].position.set(3,2.5,-6);for(const e of this.rims)e.target.position.set(0,0,-3),this.scene.add(e,e.target)}renderer;scene=new Mp;camera=new Dn(50,1,.05,60);world=new we;light;bg;bgUniforms={uTex:{value:null},uCrop:{value:new de(0,0,1,1)},uMirror:{value:0}};plainBg;videoTex=null;templates=new Map;wearers=new Map;leaving=[];lastT=-1;frameDt=0;pyramid=!1;hideWearers=!1;cloneCast=t=>t;ground=new hT;googly=new _T;breath=new wT;googlyOn=!1;breathOn=!0;spots=[0,1,2].map(()=>new ax(16777215,0,0,.24,.65,2));grain;fg;rims=[new Lu(16723349,0),new Lu(3073791,0)];opts={size:1,shadows:!0,envLight:!0,pixelRatio:Math.min(window.devicePixelRatio||1,2)};cover={s:1,ox:0,oy:0,vw:1,vh:1,cw:1,ch:1,mirror:!1};setVideo(t){this.videoTex?.dispose();const e=new Sv(t);e.colorSpace=Ni,e.minFilter=Re,e.magFilter=Re,e.generateMipmaps=!1,this.videoTex=e,this.bgUniforms.uTex.value=e}setBackground(t){this.bg.material=t??this.plainBg}setForeground(t){this.fg.visible=!!t,t&&(this.fg.material=t)}template(t){let e=this.templates.get(t);return e||(e=mh(Gi(t)),this.templates.set(t,e)),e}hasTemplate(t){return this.templates.has(t)}worker=null;queue=[];busy=null;waiting=new Map;workerMs=new Map;prepare(t,e=!1){const i=this.templates.get(t);if(i)return Promise.resolve(i);const s=new Promise(r=>{const a=this.waiting.get(t)??[];a.push(r),this.waiting.set(t,a)});return this.busy!==t&&(this.queue=this.queue.filter(r=>r!==t),e?this.queue.unshift(t):this.queue.push(t)),this.pump(),s}isPreparing(t){return this.busy===t||this.queue.includes(t)}pump(){if(!(this.busy||!this.queue.length)){if(!this.worker)try{this.worker=new Worker(new URL(""+new URL("build.worker-CAX7iwun.js",import.meta.url).href,import.meta.url),{type:"module"}),this.worker.onmessage=t=>{const{id:e,body:i,fur:s,ms:r}=t.data;this.workerMs.set(e,r);const a=mh(Gi(e),void 0,i?{body:i,fur:s}:void 0);this.finish(e,a)},this.worker.onerror=t=>{console.warn("costume worker failed; building on the main thread",t),this.worker=null,this.workerDead=!0,this.fallback()}}catch{this.workerDead=!0}if(this.workerDead){this.fallback();return}this.busy=this.queue.shift(),this.worker.postMessage({id:this.busy})}}workerDead=!1;fallback(){const t=this.busy??this.queue.shift();t&&(this.busy=t,setTimeout(()=>this.finish(t,mh(Gi(t))),16))}finish(t,e){this.templates.has(t)||this.templates.set(t,e);const i=this.templates.get(t);for(const s of this.waiting.get(t)??[])s(i);this.waiting.delete(t),this.busy=null,this.pump()}layout(t,e){const i=this.canvas.clientWidth||window.innerWidth,s=this.canvas.clientHeight||window.innerHeight,r=this.opts.pixelRatio;this.renderer.getPixelRatio()!==r&&this.renderer.setPixelRatio(r);const a=this.renderer.getSize(new ht);(a.x!==i||a.y!==s)&&this.renderer.setSize(i,s,!1);const o=Math.max(i/t.w,s/t.h),c=i/o,l=s/o,h=(t.w-c)/2/t.w,u=(t.h-l)/2/t.h;this.bgUniforms.uCrop.value.set(h,u,c/t.w,l/t.h),this.bgUniforms.uMirror.value=e?1:0,this.camera.fov=cr.radToDeg(2*Math.atan(l/2/t.f)),this.camera.aspect=i/s,this.camera.updateProjectionMatrix(),this.world.scale.x=e?-1:1,this.cover={s:o,ox:(t.w-c)/2,oy:(t.h-l)/2,vw:t.w,vh:t.h,cw:i,ch:s,mirror:e}}sync(t,e,i){const s=this.lastT<0?.03333333333333333:Math.min(.1,Math.max(0,i-this.lastT));this.lastT=i,this.frameDt=s;const r=new Set;for(const a of t){const o=e(a.id);let c=this.wearers.get(a.id);c&&c.def.id!==o&&this.templates.has(o)&&(c.leaving=!0,this.leaving.push(c),this.wearers.delete(a.id),c=void 0),!(!c&&!this.templates.has(o))&&(r.add(a.id),c||(c=this.dress(a.id,o)),c.life=Math.min(1,c.life+s/.35),this.pose(c,a,i))}for(const[a,o]of this.wearers)r.has(a)||this.drop(o);this.leaving=this.leaving.filter(a=>{if(a.life-=s/.35,a.life<=0)return this.drop(a),!1;const o=t.find(c=>c.id===a.trackId);return o&&this.pose(a,o,i),!0})}dress(t,e){const{def:i,root:s,rig:r,mats:a}=this.instance(e),o={trackId:t,def:i,root:s,rig:r,mats:a,fade:0,life:0,leaving:!1,poses:[],head:0,len:null,clones:[]};return this.world.add(s),this.wearers.set(t,o),o}instance(t){const e=this.template(t),i=Qb(e.root),s=new Map;i.traverse(a=>{a.isBone&&s.set(a.name,a)});const r=new Map;return i.traverse(a=>{const o=a;if(!o.isMesh&&!a.isSprite)return;const c=l=>{let h=r.get(l);return h||(h=l.clone(),h.onBeforeCompile=l.onBeforeCompile,h.customProgramCacheKey=l.customProgramCacheKey,l.userData.keepBlend?h.userData.baseOpacity=l.opacity:h.alphaHash=!0,r.set(l,h)),h};o.material=Array.isArray(o.material)?o.material.map(c):c(o.material)}),{def:e.def,root:i,rig:new cT(e.def.segs,s),mats:[...r.values()]}}drop(t){this.world.remove(t.root);for(const e of t.clones)this.dropClone(e);for(const e of t.mats)e.dispose();this.wearers.get(t.trackId)===t&&this.wearers.delete(t.trackId)}pose(t,e,i){const s=t.def,r=t.rig,a=Ku(e.world);e.face&&(a.head.copy(e.face.head),a.headVis=Math.max(a.headVis,e.face.headW));const o=this.fit(r,s,e.len);r.apply(a,i,s.idle?.tail??0,this.frameDt),s.face?.jaw&&r.setJaw((e.face?.jaw??0)*s.face.jaw,e.face?.jawSide??0),t.root.position.set(e.T.x,e.T.y,e.T.z),t.root.scale.setScalar(o);const c=e.presence*Math.max(0,Math.min(1,t.life)),l=c*c*(3-2*c);if(l!==t.fade){for(const h of t.mats)h.opacity=l*(h.userData.baseOpacity??1);t.fade=l}t.root.visible=l>.01&&!this.hideWearers,s.tick?.(t.root,i,e.face??null),t.head=(t.head+1)%Ih,t.poses[t.head]=TT(a),t.len=e.len,this.posePyramid(t,o,l,i)}fit(t,e,i){const s=i.torso/t.torso*(e.fit?.size??1)*this.opts.size,r=e.fit?.limb??0,a=(c,l)=>{const h=1+(l/s/(t.len.get(c)??1)-1)*r;t.setLength(c,Math.min(1.6,Math.max(.65,h)))};for(const c of["L","R"])a("arm"+c,i.upperArm),a("thigh"+c,i.thigh),a("shin"+c,i.shin);const o=t.neckFit(i.neck/s);return t.setNeck(1+(Math.min(1.25,Math.max(.45,o))-1)*(e.fit?.head??.85)),s}dropClone(t){this.world.remove(t.root,t.shadow);for(const e of t.mats)e.dispose()}posePyramid(t,e,i,s){const r=this.pyramid?this.wearers.size>1?2:3:0,a=[];for(let v=1;v<=r;v++)for(let g=0;g<=v;g++)a.push({row:v,col:g,id:this.cloneCast(t.def.id,a.length)});for(let v=0;v<t.clones.length;v++){const g=t.clones[v],m=a[v];if(!m){this.dropClone(g),t.clones.splice(v--,1);continue}g.id!==m.id&&this.templates.has(m.id)&&(this.dropClone(g),t.clones[v]=this.makeClone(m))}for(;t.clones.length<a.length;){const v=a[t.clones.length];if(!this.templates.has(v.id)){this.prepare(v.id);break}t.clones.push(this.makeClone(v))}const o=t.rig.torso*e*3.2,c=this.ground,{back:l,side:h}=c.axes(),u=t.root.position,d=c.foot(u),f=c.height(u),p=new Me().setFromUnitVectors(new C(0,0,1),c.n);for(const v of t.clones){const g=v.col-v.row/2,m=Math.round(v.row*3+Math.abs(g)*1.5);let _;for(let w=m;w>=0&&!_;w--)_=t.poses[(t.head-w+Ih*4)%Ih];const x=t.len?this.fit(v.rig,v.def,t.len):e;_&&v.rig.apply(_,s-m/30,v.def.idle?.tail??0);const b=d.clone().addScaledVector(l,v.row*o*.5).addScaledVector(h,g*o*.55);v.root.position.copy(b).addScaledVector(c.n,f),v.root.scale.setScalar(x),v.root.visible=i>.01;for(const w of v.mats)w.opacity=i*(w.userData.baseOpacity??1);v.shadow.position.copy(b).addScaledVector(c.n,.004),v.shadow.quaternion.copy(p),v.shadow.scale.set(o*.42,o*.26,1),v.shadow.visible=v.root.visible,v.def.tick?.(v.root,s-m/30,null)}}makeClone(t){const{def:e,root:i,rig:s,mats:r}=this.instance(t.id);i.traverse(o=>{o.castShadow=!1});const a=new mt(ET,ST);return a.renderOrder=1,this.world.add(i,a),{id:t.id,def:e,root:i,rig:s,mats:r,row:t.row,col:t.col,shadow:a}}faces(t,e,i){this.world.updateMatrixWorld();const s=this.world.matrixWorld.clone().invert(),r=[],a=[];for(const l of t){if(l.lost&&l.presence<=0)continue;const h=l.face,u=this.wearers.get(l.id),d=u&&u.root.visible&&!this.hideWearers?u:null,f=l.face?.head??Ku(l.world).head,p=(w,E,A)=>new C(w,E,A).applyQuaternion(f),v=new C(l.T.x+l.world[O.nose].x,l.T.y+l.world[O.nose].y,l.T.z+l.world[O.nose].z),g=Math.max(.3,-v.z),m=(w,E,A)=>new C((w*e.w-e.cx)/e.f*g,(e.cy-E*e.h)/e.f*g,-g).addScaledVector(p(0,0,1),A);let _=null,x=null;if(d){d.root.updateMatrixWorld(!0);const w=d.rig.bones.get("head"),E=d.def.segs.find(S=>S.name==="head"),A=w?s.clone().multiply(w.matrixWorld):null,T=d.root.scale.x;if(A&&E&&d.def.face?.eyes){const S=new C(1,0,0).transformDirection(A),R=new C(0,1,0).transformDirection(A),I=new C(0,0,1).transformDirection(A);_=d.def.face.eyes.map(([L,D,k,q])=>({p:new C(L-E.a[0],D-E.a[1],k-E.a[2]).applyMatrix4(A),u:S,v:R,n:I,r:q*T*1.15}))}const M=d.rig.bones.get("jaw"),y=d.def.segs.find(S=>S.name==="jaw");if(M&&y&&d.def.face?.jaw){const S=s.clone().multiply(M.matrixWorld);x={p:new C(y.b[0]-y.a[0],y.b[1]-y.a[1],y.b[2]-y.a[2]).applyMatrix4(S),dir:new C(0,-.2,1).transformDirection(A??S),scale:T*10}}else if(A&&E){const S=new C(0,0,1).transformDirection(A);x={p:(h?m(h.mouth.x,h.mouth.y,0):v.clone()).addScaledVector(S,.12*T*10),dir:S.clone().add(new C(0,-.2,0)).normalize(),scale:T*10}}}if(!_&&h){const w=p(1,0,0),E=p(0,1,0),A=p(0,0,1);_=h.eyes.map(T=>({p:m(T.x,T.y,.02),u:w,v:E,n:A,r:Math.max(.012,T.r*e.w/e.f*g*1.35)}))}!x&&h&&(x={p:m(h.mouth.x,h.mouth.y,.03),dir:p(0,-.2,1).normalize(),scale:1}),r.push({id:l.id,eyes:_,show:l.presence});const b=d?.def.face?.breath;x&&h&&a.push({id:l.id,...x,open:h.jaw*l.presence,colors:b?.colors.map(w=>new vt(w)),rate:b?.rate,speed:b?.speed,size:b?.size})}this.googly.update(r,this.ground.n,i,this.googlyOn);let o=null;for(const l of t)!l.lost&&l.face?.read&&l.face.probe&&(!o||l.face.mouth.w>o.face.mouth.w)&&(o=l);this.light.face=o?{probe:o.face.probe,w:o.face.mouth.w*2.4}:null;const c=this.renderer.getDrawingBufferSize(new ht).y;this.breath.update(a,i,c/(2*Math.tan(cr.degToRad(this.camera.fov)/2)),this.breathOn)}setGrain(t,e){this.grain.visible=t;const i=this.grain.material.uniforms;i.uTime.value=e;const s=this.renderer.getDrawingBufferSize(new ht);i.uRes.value.set(s.x/1.5,s.y/1.5)}stageSpots(t,e,i,s,r){const a=this.ground,{back:o,side:c}=a.axes(),l=a.foot(r??new C(0,-.3,-3)),h=l.clone().addScaledVector(o,1.1),u=[16769728,16726696,3856639],d=f=>{const p=Sa(f,s);return new ht(p.x,1-p.y)};return this.spots.map((f,p)=>{const v=l.clone().addScaledVector(c,(p-1)*2.4).addScaledVector(o,.6).addScaledVector(a.n,3.6),g=h.clone().addScaledVector(c,(p-1)*.9+1.2*Math.sin(e*.33+p*2.1)).addScaledVector(o,.8*Math.cos(e*.27+p*1.3)),m=new vt(u[p]);f.color.copy(m),f.position.copy(v),f.target.position.copy(g),f.target.updateMatrixWorld(),f.intensity=t?38*(1+.8*i):0;const _=v.distanceTo(g)*Math.tan(f.angle)*.9,x=d(g),b=v.z<-.15?d(v):new ht(x.x,1.4),w=new ht(Math.abs(d(g.clone().addScaledVector(c,_)).x-x.x),Math.abs(d(g.clone().addScaledVector(o,_)).y-x.y));return{L:b,P:x,R:w,C:m.clone().multiplyScalar(1+.8*i)}})}stageLights(t,e,i){const s=[16722324,11796265,16769065,2744575,9187071];this.rims.forEach((r,a)=>{r.intensity=t?2.2+3*i:0;const o=(e*.12+a*.4)%1*s.length,c=Math.floor(o),l=o-c;r.color.setHex(s[c%s.length]).lerp(new vt(s[(c+1)%s.length]),l)})}people(){return[...this.wearers.values()].filter(t=>t.root.visible).map(t=>t.root.position.clone())}render(t,e,i){this.renderer.shadowMap.enabled=this.opts.shadows,t&&this.light.update(t,e,this.cover.mirror,i,this.people(),this.opts.envLight),this.renderer.render(this.scene,this.camera)}get count(){return this.wearers.size}}const fs=[{id:"insitu",name:"In Situ",code:12,swatch:"radial-gradient(ellipse at 30% 85%, rgba(255,80,190,0.9), transparent 35%), radial-gradient(ellipse at 72% 80%, rgba(80,220,255,0.9), transparent 35%), linear-gradient(160deg, transparent 40%, rgba(255,240,220,0.35) 50%, transparent 60%), #2a2430"},{id:"tunnel",name:"Tunnel",code:9,swatch:"repeating-radial-gradient(circle, #ff2d95 0 3px, #12071f 3px 8px, #2ee6ff 8px 11px, #12071f 11px 16px)"},{id:"lasers",name:"Lasers",code:10,swatch:"linear-gradient(115deg, transparent 46%, #b6ff2e 48%, transparent 50%), linear-gradient(65deg, transparent 46%, #ff2d95 48%, transparent 50%), linear-gradient(90deg, transparent 47%, #2ee6ff 49%, transparent 51%), #07040d"},{id:"kaleido",name:"Kaleido",code:11,swatch:"conic-gradient(#ff2d95, #ffe62e, #b6ff2e, #2ee6ff, #8a2eff, #ff2d95)"},{id:"rings",name:"Rings",code:5,swatch:"repeating-radial-gradient(circle, #ff3d7f 0 5px, #ffb23d 5px 10px, #3dd6ff 10px 15px, #8c5cff 15px 20px)"},{id:"neon",name:"Neon",code:4,swatch:"radial-gradient(circle, transparent 0 40%, #39ff9c 42% 50%, transparent 54%), #06030f"},{id:"pop",name:"Pop Art",code:1,swatch:"radial-gradient(circle at 30% 30%, #ffde00 0 22%, transparent 23%), radial-gradient(circle at 70% 70%, #ff2d8a 0 22%, transparent 23%), #19c3ff"},{id:"warhol",name:"Warhol",code:2,swatch:"conic-gradient(#ff5fa2 0 25%, #ffd400 0 50%, #2ad4c4 0 75%, #7b5cff 0)"},{id:"echo",name:"Echoes",code:6,swatch:"linear-gradient(90deg, #1b1033, #ff2db4 40%, #2de2ff 70%, #1b1033)"},{id:"disco",name:"Disco",code:7,swatch:"radial-gradient(circle at 30% 30%, #ff4fd8, transparent 45%), radial-gradient(circle at 70% 60%, #4fd1ff, transparent 45%), radial-gradient(circle at 45% 80%, #ffe14f, transparent 40%), #120820"},{id:"solar",name:"Solarize",code:3,swatch:"linear-gradient(135deg, #1a0b3d, #ff7a00 45%, #00e5ff 55%, #2a0b3d)"},{id:"spot",name:"Spotlight",code:0,swatch:"radial-gradient(circle at 50% 40%, #fff6d8, #6a5a40 45%, #120f0a 75%)"}],CT=[[2757440,16727435,16756736,16774084],[731722,46023,16740156,16776160],[2951947,9321727,3997598,16382065],[1058330,16723502,3065343,16769520]],pl=12,Pc=`
  varying vec2 vUv;
  void main() { vUv = position.xy * 0.5 + 0.5; gl_Position = vec4(position.xy, 0.0, 1.0); }`,LT=`
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
  }`,PT=`
  varying vec2 vUv;
  uniform sampler2D uTex, uMask;
  uniform vec4 uOn;
  void main() {
    vec4 m = smoothstep(0.3, 0.7, texture2D(uMask, vec2(vUv.x, 1.0 - vUv.y))) * uOn;
    gl_FragColor = vec4(texture2D(uTex, vUv).rgb, max(max(m.r, m.g), max(m.b, m.a)));
  }`,IT=`
  varying vec2 vUv;
  uniform sampler2D uTex, uMask, uFx, uPrev;
  uniform highp sampler2DArray uHist;
  uniform float uHead, uTime, uAspect, uBeat, uLevel, uClones, uPyramid;
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
  ${LT}

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
  // how a cut-out looks in this preset (the subject's look without its rims): the clones wear it too
  vec3 look(vec3 v, int who, vec2 uv, float t) {
    if (uPreset == 0) return v * 1.08;
    if (uPreset == 1 || uPreset == 2) return print(v, who);
    if (uPreset == 3) return solar(v, t);
    if (uPreset == 4) return v * 0.16;
    if (uPreset == 7) return v * (0.75 + 0.7 * discoLight(uv, t));
    if (uPreset == 10) return v * 0.9;
    return v;
  }
  // a frame of the subjects, \`delay\` frames ago, at q (outside the frame: nothing)
  vec4 past(vec2 q, float delay) {
    if (q.x < 0.0 || q.y < 0.0 || q.x > 1.0 || q.y > 1.0) return vec4(0.0);
    return texture(uHist, vec3(q, mod(uHead - delay + ${pl}.0 * 8.0, ${pl}.0)));
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
      // a lit edge only: the halo (bright where dist is 0) belongs outside — inside, it washed the person to a ghost
      fg = vid + hue * rim * 1.2;
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
    // the dance pyramid, over any preset's room: the subjects cloned on the floor behind them, row after row, each
    // later — a canon — in the preset's own look, with a lit edge and a contact shadow
    if (uPyramid > 0.5 && uClones > 0.5) {
      for (int i = 0; i < 9; i++) {
        if (i >= uCloneN) break;
        vec4 cl = uClone[i];
        vec2 e = (uv - cl.xy) / vec2(uFootW * cl.z * 0.6, uFootW * cl.z * 0.13);
        bg *= 1.0 - 0.55 * exp(-dot(e, e));
        vec4 c = past(uFoot + (uv - cl.xy) / cl.z, cl.w);
        int cw = uPreset == 2 ? int(cellIx) : i - 4 * (i / 4);
        vec3 edge = (uPreset == 12 ? vec3(0.0) : neon(float(i) * 0.13 + t * 0.05)) * clamp(1.0 - abs(c.a - 0.5) * 2.0, 0.0, 1.0) * 1.4;
        bg = mix(bg, look(c.rgb, cw, uv, t) * (1.0 - 0.06 * float(i / 3)) + edge, c.a);
      }
    }
    gl_FragColor = vec4(mix(bg, fg, subj), 1.0);
  }`,DT=`
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
  }`,UT=`
  varying vec2 vUv;
  uniform sampler2D uSrc;
  uniform vec2 uDir;
  void main() {
    vec3 c = texture2D(uSrc, vUv).rgb * 0.2270270;
    c += (texture2D(uSrc, vUv + uDir * 1.3846154).rgb + texture2D(uSrc, vUv - uDir * 1.3846154).rgb) * 0.3162162;
    c += (texture2D(uSrc, vUv + uDir * 3.2307692).rgb + texture2D(uSrc, vUv - uDir * 3.2307692).rgb) * 0.0702703;
    gl_FragColor = vec4(c, 1.0);
  }`,O1=`
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
  }`;class NT{material;foreground;_preset=fs[0];get preset(){return this._preset}set preset(t){t!==this._preset&&(this.fromCode=this._preset.code,this.xfade=this.started?0:1,this._preset=t)}fromCode=0;xfade=1;started=!1;rtOld=null;subjects=2;beat=0;setSpots(t,e){const i=this.scene.uniforms;t.forEach((s,r)=>{i.uSpotL.value[r].copy(s.L),i.uSpotP.value[r].copy(s.P),i.uSpotR.value[r].copy(s.R),i.uSpotC.value[r].copy(s.C)}),i.uSpotK.value=e}clones=!0;pyramid=!0;maskTex;maskData=new Uint8Array(4);mw=0;mh=0;fw=0;fh=0;fxTex;fxData;chans=[null,null,null,null];chanMask=[null,null,null,null];union;dist;trail;stamp;uOn=new de;box=new de(.35,.1,.65,.7);quad=new mt(new ls(2,2));quadScene=new Mp;cam=new S0(-1,1,1,-1,0,1);cut;scene;bright;blur;rtScene=[];rtB1a=null;rtB1b=null;rtB2a=null;rtB2b=null;hist=null;head=0;flip=0;sizeKey="";constructor(t,e){this.maskTex=new xa(new Uint8Array(4),1,1,Je),this.maskTex.needsUpdate=!0,this.resizeFx(160,90);const i={depthTest:!1,depthWrite:!1,toneMapped:!1};this.cut=new Ze({...i,vertexShader:Pc,fragmentShader:PT,uniforms:{uTex:t.uTex,uMask:{value:this.maskTex},uOn:{value:this.uOn}}}),this.scene=new Ze({...i,vertexShader:Pc,fragmentShader:IT,uniforms:{uTex:t.uTex,uMask:{value:this.maskTex},uFx:{value:this.fxTex},uPrev:{value:null},uHist:{value:null},uHead:{value:0},uClones:{value:1},uPyramid:{value:1},uSpotL:{value:[0,1,2].map(()=>new ht(.5,1.2))},uSpotP:{value:[0,1,2].map(()=>new ht(.5,.1))},uSpotR:{value:[0,1,2].map(()=>new ht(.1,.04))},uSpotC:{value:[0,1,2].map(()=>new vt(0,0,0))},uSpotK:{value:0},uClone:{value:Array.from({length:9},()=>new de)},uCloneN:{value:0},uFoot:{value:new ht(.5,.1)},uFootW:{value:.2},uTime:{value:0},uAspect:{value:1},uBeat:{value:0},uLevel:{value:0},uPreset:{value:0},uOn:{value:this.uOn},uBox:{value:this.box},uPal:{value:CT.flat().map(s=>new vt(s))}}}),this.bright=new Ze({...i,vertexShader:Pc,fragmentShader:DT,uniforms:{uSrc:{value:null},uTexel:{value:new ht},uThreshold:{value:.72}}}),this.blur=new Ze({...i,vertexShader:Pc,fragmentShader:UT,uniforms:{uSrc:{value:null},uDir:{value:new ht}}}),this.material=new Ze({...i,vertexShader:e,fragmentShader:O1,uniforms:{uCrop:t.uCrop,uMirror:t.uMirror,uScene:{value:null},uBloom1:{value:null},uBloom2:{value:null},uTime:{value:0},uBeat:{value:0},uFlash:{value:1},uRes:{value:new ht(1,1)},uOld:{value:null},uMix:{value:1},uCA:{value:1},uBloomK:{value:1}}}),this.foreground=new Ze({...i,vertexShader:e,fragmentShader:O1,transparent:!0,defines:{FG:1},uniforms:{...this.material.uniforms,uMask:this.scene.uniforms.uMask,uOn:this.scene.uniforms.uOn}}),this.quad.frustumCulled=!1,this.quadScene.add(this.quad)}resizeFx(t,e){this.fxTex?.dispose(),this.fxData=new Uint8Array(t*e*4),this.fxTex=new xa(this.fxData,t,e,Je),this.fxTex.magFilter=Re,this.fxTex.minFilter=Re,this.union=new Float32Array(t*e),this.dist=new Float32Array(t*e),this.trail=new Float32Array(t*e),this.stamp=new Float32Array(t*e);for(let i=0;i<t*e;i++)this.fxData[i*4]=255;this.fxTex.needsUpdate=!0,this.fw=t,this.fh=e,this.scene&&(this.scene.uniforms.uFx.value=this.fxTex)}frameDt=1/30;update(t,e,i,s,r,a){this.frameDt=e;const o=this.scene.uniforms;o.uTime.value=i,o.uAspect.value=s,o.uPreset.value=this.preset.code,o.uBeat.value=this.beat,o.uClones.value=this.clones?1:0,o.uPyramid.value=this.pyramid?1:0,this.material.uniforms.uTime.value=i,this.material.uniforms.uBeat.value=this.beat;const c=this.preset.code===12;this.material.uniforms.uCA.value=c?.25:1,this.material.uniforms.uBloomK.value=c?.45:1;const l=s>=1?160:Math.max(48,Math.round(160*s)),h=s>=1?Math.max(48,Math.round(160/s)):160;(l!==this.fw||h!==this.fh)&&this.resizeFx(l,h);const u=t.filter(g=>g.presence>0).sort((g,m)=>m.len.torso/-m.T.z-g.len.torso/-g.T.z).slice(0,this.subjects),d=new Set(u.map(g=>g.id));for(let g=0;g<4;g++)this.chans[g]!==null&&!d.has(this.chans[g])&&(this.chans[g]=null,this.chanMask[g]=null);for(const g of u){let m=this.chans.indexOf(g.id);if(m<0){if(m=this.chans.indexOf(null),m<0)continue;this.chans[m]=g.id}const _=g.det?.mask;if(_){(_.w!==this.mw||_.h!==this.mh)&&this.resizeMask(_.w,_.h);let x=this.chanMask[m];if(!x||x.length!==_.data.length)x=this.chanMask[m]=new Float32Array(_.data.length),x.set(_.data);else{const b=1-Math.exp(-e/.04),w=_.data;for(let E=0;E<w.length;E++)x[E]=x[E]+(w[E]-x[E])*b}}}const f=[0,0,0,0];for(let g=0;g<4;g++){const m=this.chans[g];m!==null&&this.chanMask[g]&&(f[g]=t.find(_=>_.id===m)?.presence??0)}if(this.uOn.set(f[0],f[1],f[2],f[3]),this.fx(e,i,f),this.layPyramid(u[0],r,a,e),!this.mw)return;const p=this.mw*this.mh,v=this.maskData;for(let g=0;g<4;g++){const m=this.chanMask[g];if(!m){for(let _=0;_<p;_++)v[_*4+g]=0;continue}for(let _=0;_<p;_++)v[_*4+g]=m[_]*255}this.maskTex.needsUpdate=!0}cloneSm=Array.from({length:9},()=>new de);cloneSmN=0;layPyramid(t,e,i,s=1/30){const r=this.scene.uniforms;if(!t||!e||!i){r.uCloneN.value=0,this.cloneSmN=0;return}const a=new C(t.T.x,t.T.y,t.T.z),o=e.foot(a),c=Math.max(1.2,Math.min(2.2,e.height(a)*1.9)),{back:l,side:h}=e.axes(),u=Sa(o,i),d=1-Math.exp(-s/.15),f=r.uFoot.value;this.cloneSmN===0?f.set(u.x,1-u.y):f.lerp(new ht(u.x,1-u.y),d),r.uFootW.value=Math.max(.05,this.box.z-this.box.x);const p=[];for(let g=1;g<=3;g++)for(let m=0;m<=g;m++){const _=m-g/2,x=o.clone().addScaledVector(l,g*c*.5).addScaledVector(h,_*c*.55);if(x.z>-.3)continue;const b=Sa(x,i);p.push({v:new de(b.x,1-b.y,-o.z/-x.z,g*3+Math.abs(_)*1.5),depth:-x.z})}p.sort((g,m)=>m.depth-g.depth);const v=r.uClone.value;p.forEach((g,m)=>{const _=this.cloneSm[m];this.cloneSmN!==p.length?_.copy(g.v):_.lerp(g.v,d),_.w=g.v.w,v[m].copy(_)}),this.cloneSmN=p.length,r.uCloneN.value=p.length}resizeMask(t,e){this.maskTex.dispose(),this.mw=t,this.mh=e,this.maskData=new Uint8Array(t*e*4),this.maskTex=new xa(this.maskData,t,e,Je),this.maskTex.magFilter=Re,this.maskTex.minFilter=Re,this.scene.uniforms.uMask.value=this.maskTex,this.cut.uniforms.uMask.value=this.maskTex}fx(t,e,i){const s=this.fw,r=this.fh,a=this.union,o=this.dist;let c=s,l=r,h=-1,u=-1;for(let m=0;m<r;m++){const _=Math.min(this.mh-1,Math.floor((m+.5)/r*this.mh));for(let x=0;x<s;x++){let b=0;if(this.mw){const w=_*this.mw+Math.min(this.mw-1,Math.floor((x+.5)/s*this.mw));for(let E=0;E<4;E++){const A=this.chanMask[E];A&&(b=Math.max(b,A[w]*i[E]))}}a[m*s+x]=b,b>.5&&(x<c&&(c=x),x>h&&(h=x),m<l&&(l=m),m>u&&(u=m))}}if(h>=0){const m=1-Math.exp(-t/.12),_=c/s,x=(h+1)/s,b=1-(u+1)/r,w=1-l/r;this.box.set(this.box.x+(_-this.box.x)*m,this.box.y+(b-this.box.y)*m,this.box.z+(x-this.box.z)*m,this.box.w+(w-this.box.w)*m)}const d=1e6,f=Math.SQRT2;for(let m=0;m<s*r;m++)o[m]=a[m]>.5?0:d;for(let m=0;m<r;m++)for(let _=0;_<s;_++){const x=m*s+_;let b=o[x];_>0&&(b=Math.min(b,o[x-1]+1)),m>0&&(b=Math.min(b,o[x-s]+1),_>0&&(b=Math.min(b,o[x-s-1]+f)),_<s-1&&(b=Math.min(b,o[x-s+1]+f))),o[x]=b}for(let m=r-1;m>=0;m--)for(let _=s-1;_>=0;_--){const x=m*s+_;let b=o[x];_<s-1&&(b=Math.min(b,o[x+1]+1)),m<r-1&&(b=Math.min(b,o[x+s]+1),_<s-1&&(b=Math.min(b,o[x+s+1]+f)),_>0&&(b=Math.min(b,o[x+s-1]+f))),o[x]=b}const p=Math.exp(-t/1.1),v=e*.2%1,g=this.fxData;for(let m=0;m<s*r;m++){const _=a[m];this.trail[m]=Math.max(this.trail[m]*p,_),_>.5&&(this.stamp[m]=v),g[m*4]=Math.min(1,o[m]/48)*255,g[m*4+1]=this.trail[m]*255,g[m*4+2]=this.stamp[m]*255,g[m*4+3]=_*255}this.fxTex.needsUpdate=!0}targets(t,e,i){const r=900/Math.max(e,i),a=Math.max(64,Math.round(e*r)),o=Math.max(64,Math.round(i*r)),c=`${a}x${o}`;if(c===this.sizeKey)return;this.sizeKey=c;for(const m of[...this.rtScene,this.rtB1a,this.rtB1b,this.rtB2a,this.rtB2b,this.rtOld])m?.dispose();this.hist?.dispose();const l=t.extensions,h=l.has("EXT_color_buffer_half_float")||l.has("EXT_color_buffer_float"),u={type:h?_r:Mi,depthBuffer:!1,magFilter:Re,minFilter:Re};this.bright.uniforms.uThreshold.value=h?.72:.62,this.rtScene=[new dn(a,o,u),new dn(a,o,u)],this.rtOld=new dn(a,o,u);const d=Math.max(16,Math.round(a/4)),f=Math.max(16,Math.round(o/4)),p=Math.max(8,Math.round(a/16)),v=Math.max(8,Math.round(o/16));this.rtB1a=new dn(d,f,u),this.rtB1b=new dn(d,f,u),this.rtB2a=new dn(p,v,u),this.rtB2b=new dn(p,v,u);const g=480/Math.max(e,i);this.hist=new $2(Math.round(e*g),Math.round(i*g),pl,{depthBuffer:!1}),this.hist.texture.magFilter=Re,this.hist.texture.minFilter=Re,this.scene.uniforms.uHist.value=this.hist.texture,this.material.uniforms.uRes.value.set(a,o)}pass(t,e,i,s=0){this.quad.material=e,t.setRenderTarget(i,s),t.render(this.quadScene,this.cam)}render(t,e,i){this.targets(t,e,i);const s=t.getRenderTarget();this.head=(this.head+1)%pl,this.pass(t,this.cut,this.hist,this.head),this.scene.uniforms.uHead.value=this.head;const r=this.rtScene[this.flip],a=this.rtScene[1-this.flip];this.flip=1-this.flip,this.scene.uniforms.uPrev.value=a.texture,this.pass(t,this.scene,r),this.started=!0;const o=this.material.uniforms;if(this.xfade<1){this.xfade=Math.min(1,this.xfade+this.frameDt/.45);const f=this.scene.uniforms.uPreset.value;this.scene.uniforms.uPreset.value=this.fromCode,this.pass(t,this.scene,this.rtOld),this.scene.uniforms.uPreset.value=f,o.uOld.value=this.rtOld.texture}const c=this.xfade;o.uMix.value=c*c*(3-2*c);const l=this.bright.uniforms,h=this.blur.uniforms;l.uSrc.value=r.texture,l.uTexel.value.set(1/r.width,1/r.height),this.pass(t,this.bright,this.rtB1a);const u=(f,p,v)=>{for(let g=0;g<v;g++)h.uSrc.value=f.texture,h.uDir.value.set(1.4/f.width,0),this.pass(t,this.blur,p),h.uSrc.value=p.texture,h.uDir.value.set(0,1.4/f.height),this.pass(t,this.blur,f)};u(this.rtB1a,this.rtB1b,1),l.uSrc.value=this.rtB1a.texture,l.uTexel.value.set(1/this.rtB1a.width,1/this.rtB1a.height);const d=l.uThreshold.value;l.uThreshold.value=0,this.pass(t,this.bright,this.rtB2a),l.uThreshold.value=d,u(this.rtB2a,this.rtB2b,2),t.setRenderTarget(s),o.uScene.value=r.texture,o.uBloom1.value=this.rtB1a.texture,o.uBloom2.value=this.rtB2a.texture}}class FT{env=0;level=0;stream=null;ctx=null;an=null;buf=new Uint8Array(0);avg=0;last=0;get on(){return!!this.an}async start(){if(this.an)return;this.stream=await navigator.mediaDevices.getUserMedia({audio:{echoCancellation:!1,noiseSuppression:!1,autoGainControl:!1}});const t=window.AudioContext??window.webkitAudioContext;this.ctx=new t,await this.ctx.resume();const e=this.ctx.createMediaStreamSource(this.stream);this.an=this.ctx.createAnalyser(),this.an.fftSize=1024,this.an.smoothingTimeConstant=0,e.connect(this.an),this.buf=new Uint8Array(this.an.frequencyBinCount)}stop(){for(const t of this.stream?.getTracks()??[])t.stop();this.ctx?.close(),this.stream=null,this.ctx=null,this.an=null,this.env=0,this.level=0}update(t,e){if(this.env*=Math.exp(-t/.18),!this.an||!this.ctx)return;this.an.getByteFrequencyData(this.buf);const i=this.ctx.sampleRate/this.an.fftSize,s=Math.max(1,Math.floor(40/i)),r=Math.max(s+1,Math.ceil(160/i));let a=0;for(let c=s;c<=r;c++)a+=this.buf[c];const o=a/((r-s+1)*255);this.level+=(o-this.level)*Math.min(1,t/.1),this.avg+=(o-this.avg)*Math.min(1,t/1.2),o>this.avg*1.3+.04&&o>.22&&e-this.last>260&&(this.env=1,this.last=e)}}class OT{up=null;listening=!1;async enable(){const t=window.DeviceOrientationEvent;try{if(t?.requestPermission&&await t.requestPermission()!=="granted")return!1}catch{return!1}return this.listening||(this.listening=!0,window.addEventListener("deviceorientation",e=>{if(e.beta===null||e.gamma===null)return;const i=cr.degToRad(e.beta),s=cr.degToRad(e.gamma);(this.up??=new C).set(-Math.sin(s)*Math.cos(i),Math.sin(i),Math.cos(s)*Math.cos(i)).normalize()})),!0}upInCamera(t){if(!this.up)return null;const e=cr.degToRad(screen.orientation?.angle??window.orientation??0),i=this.up.clone().applyAxisAngle(new C(0,0,1),-e);return t==="user"&&(i.x=-i.x,i.z=-i.z),i}}const Le={tauJaw:.05,tauBlink:.04,tauLook:.06,tauShape:.1,tauPlace:.05,tauTurn:.07,tauTrust:.25,tauBias:.6,tauBiasRelax:2.5,forgetMs:400,perFrame:2,crop:2.4,cropPx:320,budgetMs:12},kT=new Me,BT=new C(0,0,-1);class HT{lm=null;inferMs=0;canvas=document.createElement("canvas");ctx;tried=new Map;n=0;M=new se;v1=new C;v2=new C;constructor(){this.canvas.width=this.canvas.height=Le.cropPx,this.ctx=this.canvas.getContext("2d")}async load(){const e=await q1(()=>import("./vision_bundle-Bk4VIwNi.js"),[],import.meta.url),i=await e.FilesetResolver.forVisionTasks("./mediapipe"),s=r=>e.FaceLandmarker.createFromOptions(i,{baseOptions:{modelAssetPath:"./models/face_landmarker.task",delegate:r},runningMode:"IMAGE",numFaces:1,outputFaceBlendshapes:!0,outputFacialTransformationMatrixes:!0,minFaceDetectionConfidence:.4,minFacePresenceConfidence:.4});try{this.lm=await s("GPU")}catch{this.lm=await s("CPU")}}detect(t,e,i){const s=new Map;if(!this.lm)return s;this.n++;const r=e.filter(l=>!l.lost&&l.presence>.2).sort((l,h)=>(this.tried.get(l.id)??-1)-(this.tried.get(h.id)??-1)),a=performance.now(),o=Le.cropPx,c=this.ctx;for(const l of r.slice(0,Le.perFrame)){if(s.size&&performance.now()-a>Le.budgetMs)break;this.tried.set(l.id,this.n);const h=VT(l,i.w,i.h);if(!h)continue;c.fillStyle="#000",c.fillRect(0,0,o,o),c.drawImage(t,h.x,h.y,h.s,h.s,0,0,o,o);const u=this.lm.detect(this.canvas),d=u.faceLandmarks[0];if(!d||Math.hypot(d[1].x-.5,d[1].y-.5)>.3)continue;const f=new Map;for(const g of u.faceBlendshapes[0]?.categories??[])f.set(g.categoryName,g.score);let p=null;const v=u.facialTransformationMatrixes?.[0];if(v?.data?.length===16){this.M.fromArray(v.data);const g=new Me;this.M.decompose(this.v1,g,this.v2);const m=new C((h.x+h.s/2-i.cx)/i.f,-(h.y+h.s/2-i.cy)/i.f,-1).normalize();p=new Me().setFromUnitVectors(BT,m).multiply(g)}s.set(l.id,{pts:d.map(g=>({x:(h.x+g.x*h.s)/i.w,y:(h.y+g.y*h.s)/i.h,z:g.z*h.s/i.w})),shapes:f,rot:p})}for(const l of this.tried.keys())e.some(h=>h.id===l)||this.tried.delete(l);return this.inferMs=performance.now()-a,s}close(){this.lm?.close(),this.lm=null}}function VT(n,t,e){const i=n.image,s=h=>({x:i[h].x*t,y:i[h].y*e}),r=[O.nose,O.eyeL,O.eyeR,O.earL,O.earR];let a=0,o=0;for(const h of r){const u=s(h);a+=u.x/r.length,o+=u.y/r.length}const c=(h,u)=>{const d=s(h),f=s(u);return Math.hypot(d.x-f.x,d.y-f.y)},l=Le.crop*Math.max(c(O.earL,O.earR),c(O.nose,O.earL),c(O.nose,O.earR),.35*c(O.shL,O.shR));return l>24&&Number.isFinite(a+o)?{x:a-l/2,y:o-l/2,s:l}:null}const ri=(n,t,e,i)=>n+(t-n)*(1-Math.exp(-e/i)),Dh=n=>Math.max(-1,Math.min(1,n)),Ju=(n,t)=>({x:(n.x+t.x)/2,y:(n.y+t.y)/2}),ml=(n,t,e)=>Math.hypot((n.x-t.x)*e,n.y-t.y);function zT(n,t){const e=n.pts,i=(r,a)=>({...Ju(e[r],e[a]),r:ml(e[r],e[a],t)*.62/t}),s=r=>n.shapes.get(r)??0;return{eyes:[i(263,362),i(33,133)],mouth:{...Ju(e[13],e[14]),w:ml(e[61],e[291],t)/t},nose:e[1],probe:[e[151],e[152],e[425],e[205],e[1]].map(r=>({x:r.x,y:r.y})),jaw:Math.min(1,s("jawOpen")*1.4),blinkL:s("eyeBlinkLeft"),blinkR:s("eyeBlinkRight"),smileL:s("mouthSmileLeft"),smileR:s("mouthSmileRight"),smile:(s("mouthSmileLeft")+s("mouthSmileRight"))/2,frown:(s("mouthFrownLeft")+s("mouthFrownRight"))/2,pucker:s("mouthPucker"),funnel:s("mouthFunnel"),browUp:s("browInnerUp"),browDownL:s("browDownLeft"),browDownR:s("browDownRight"),browOuterL:s("browOuterUpLeft"),browOuterR:s("browOuterUpRight"),squintL:s("eyeSquintLeft"),squintR:s("eyeSquintRight"),wideL:s("eyeWideLeft"),wideR:s("eyeWideRight"),lookX:Dh((s("eyeLookOutLeft")-s("eyeLookInLeft")+(s("eyeLookInRight")-s("eyeLookOutRight")))*.8),lookY:Dh((s("eyeLookUpLeft")+s("eyeLookUpRight")-(s("eyeLookDownLeft")+s("eyeLookDownRight")))*.8),jawSide:Dh((s("jawLeft")-s("jawRight"))*2),puff:s("cheekPuff"),sneer:(s("noseSneerLeft")+s("noseSneerRight"))/2}}function GT(n,t){const e=n.image,i=ml(e[O.eyeL],e[O.eyeR],t)*.3/t;return{eyes:[{x:e[O.eyeL].x,y:e[O.eyeL].y,r:i},{x:e[O.eyeR].x,y:e[O.eyeR].y,r:i}],mouth:{...Ju(e[O.mouthL],e[O.mouthR]),w:ml(e[O.mouthL],e[O.mouthR],t)/t}}}function WT(n,t,e){return{...n,eyes:n.eyes.map(i=>({...i,x:i.x+t,y:i.y+e})),mouth:{...n.mouth,x:n.mouth.x+t,y:n.mouth.y+e},nose:{x:n.nose.x+t,y:n.nose.y+e},probe:n.probe.map(i=>({x:i.x+t,y:i.y+e}))}}const XT=Object.keys(el),qT=n=>n==="jaw"?Le.tauJaw:n==="blinkL"||n==="blinkR"?Le.tauBlink:n==="lookX"||n==="lookY"?Le.tauLook:Le.tauShape;function $T(n,t,e,i,s){const r=e.w/e.h;for(const a of n){if(a.lost)continue;const o=t?.get(a.id)??null,c=a.image[O.nose];let l=a.face;const h=o?zT(o,r):null,u=!h&&l?.last&&i-l.last.at<Le.forgetMs?WT(l.last.read,c.x-l.last.nose.x,c.y-l.last.nose.y):null,d=h??u,f=d??GT(a,r),p=Ku(a.world).head;l||(l=a.face={...el,eyes:f.eyes.map(m=>({...m})),mouth:{...f.mouth},read:!!h,seen:i,head:p.clone(),headW:0,turn:null,bias:new Me,trust:0,last:null});{const m=[...f.eyes,f.mouth],_=[...l.eyes,l.mouth];let x=0,b=0;m.forEach((w,E)=>{x+=w.x-_[E].x,b+=w.y-_[E].y}),x/=m.length,b/=m.length;for(const w of _)w.x+=x,w.y+=b}f.eyes.forEach((m,_)=>{const x=l.eyes[_];x.x=ri(x.x,m.x,s,Le.tauPlace),x.y=ri(x.y,m.y,s,Le.tauPlace),x.r=ri(x.r,m.r,s,Le.tauPlace*3)}),l.mouth.x=ri(l.mouth.x,f.mouth.x,s,Le.tauPlace),l.mouth.y=ri(l.mouth.y,f.mouth.y,s,Le.tauPlace),l.mouth.w=ri(l.mouth.w,f.mouth.w,s,Le.tauPlace*3);const v=d??el;for(const m of XT)l[m]=ri(l[m],v[m],s,qT(m));h?(l.probe?h.probe.forEach((m,_)=>{const x=l.probe[_];x.x=ri(x.x,m.x,s,Le.tauPlace),x.y=ri(x.y,m.y,s,Le.tauPlace)}):l.probe=h.probe.map(m=>({...m})),l.read=!0,l.seen=i,l.last={read:h,nose:{x:c.x,y:c.y},at:i}):!u&&i-l.seen>Le.forgetMs&&(l.read=!1,l.probe=void 0),o?.rot?(l.turn?l.turn.slerp(o.rot,1-Math.exp(-s/Le.tauTurn)):l.turn=o.rot.clone(),l.bias.slerp(l.turn.clone().multiply(p.clone().invert()),1-Math.exp(-s/Le.tauBias)),l.trust=ri(l.trust,1,s,Le.tauTrust)):u||(l.trust=ri(l.trust,0,s,Le.tauTrust),l.bias.slerp(kT,1-Math.exp(-s/Le.tauBiasRelax)));const g=l.bias.clone().multiply(p);l.head.copy(l.turn&&l.trust>.001?g.slerp(l.turn,l.trust):g),l.headW=l.trust}}const na={people:2,model:"full",size:1,lens:.85,envLight:!0,shadows:!0,debug:!1,mode:"one",costume:"jimothy",scene:"costume",effect:"insitu",partyCostumes:"behind",music:!1,faces:!0,googly:!1,breath:!0,partyCast:"skeleton",pyramid:!0,cast:["jimothy","builder","skeleton","pumpkin","howler","violet","plume"],v:5},dg="costuma26.settings";function YT(){try{const n=JSON.parse(localStorage.getItem(dg)??"{}"),t=n.v??(Object.keys(n).length?1:na.v),e={...na,...n},i=e.partyCostumes;return i===!0?e.partyCostumes="on":i!=="behind"&&i!=="on"&&(e.partyCostumes="off"),t<2&&(e.effect="insitu",e.partyCostumes="behind",e.partyCast="skeleton"),t<3&&(e.model="full"),t<4&&(e.effect==="pyramid"&&(e.effect="insitu"),e.pyramid=!0),t<5&&(e.cast=[...na.cast]),(!Array.isArray(e.cast)||!e.cast.length)&&(e.cast=[...na.cast]),e.costume==="valkyrie"&&(e.costume="violet"),e.partyCast==="valkyrie"&&(e.partyCast="violet"),e.v=na.v,e}catch{return{...na}}}function jT(n){try{localStorage.setItem(dg,JSON.stringify(n))}catch{}}const ro=n=>`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${n}</svg>`,is={qr:ro('<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><path d="M14 14h3v3h-3zM20 14v.01M14 20h.01M17 20h4v-3"/>'),flip:ro('<path d="M4 7h3l2-3h6l2 3h3a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1z"/><path d="M9 13a3 3 0 0 1 5-2.2M15 13a3 3 0 0 1-5 2.2"/><path d="M14 9v2h-2M10 17v-2h2"/>'),gear:ro('<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/>'),camera:ro('<path d="M4 8h3l2-3h6l2 3h3a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1z"/><circle cx="12" cy="13" r="3.5"/>'),googly:'<svg viewBox="0 0 24 24"><circle cx="7.5" cy="12" r="5.5" fill="#fff" stroke="currentColor" stroke-width="1.5"/><circle cx="16.5" cy="12" r="5.5" fill="#fff" stroke="currentColor" stroke-width="1.5"/><circle cx="6.5" cy="14.2" r="2.4" fill="#111"/><circle cx="17.8" cy="13.6" r="2.4" fill="#111"/></svg>',pyramid:ro('<circle cx="12" cy="5" r="2"/><circle cx="8" cy="12" r="2"/><circle cx="16" cy="12" r="2"/><circle cx="4" cy="19" r="2"/><circle cx="12" cy="19" r="2"/><circle cx="20" cy="19" r="2"/>'),rec:'<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="7" fill="currentColor"/></svg>',stop:'<svg viewBox="0 0 24 24"><rect x="6" y="6" width="12" height="12" rx="2" fill="currentColor"/></svg>'};function ZT(n){return n&&n.__esModule&&Object.prototype.hasOwnProperty.call(n,"default")?n.default:n}var Uh={exports:{}},k1;function KT(){return k1||(k1=1,(function(n,t){var e=(function(){var i=function(w,E){var A=236,T=17,M=w,y=r[E],S=null,R=0,I=null,L=[],D={},k=function(H,W){R=M*4+17,S=(function(V){for(var tt=new Array(V),st=0;st<V;st+=1){tt[st]=new Array(V);for(var N=0;N<V;N+=1)tt[st][N]=null}return tt})(R),q(0,0),q(R-7,0),q(0,R-7),ut(),it(),_t(H,W),M>=7&&gt(H),I==null&&(I=ct(M,y,L)),At(I,W)},q=function(H,W){for(var V=-1;V<=7;V+=1)if(!(H+V<=-1||R<=H+V))for(var tt=-1;tt<=7;tt+=1)W+tt<=-1||R<=W+tt||(0<=V&&V<=6&&(tt==0||tt==6)||0<=tt&&tt<=6&&(V==0||V==6)||2<=V&&V<=4&&2<=tt&&tt<=4?S[H+V][W+tt]=!0:S[H+V][W+tt]=!1)},z=function(){for(var H=0,W=0,V=0;V<8;V+=1){k(!0,V);var tt=o.getLostPoint(D);(V==0||H>tt)&&(H=tt,W=V)}return W},it=function(){for(var H=8;H<R-8;H+=1)S[H][6]==null&&(S[H][6]=H%2==0);for(var W=8;W<R-8;W+=1)S[6][W]==null&&(S[6][W]=W%2==0)},ut=function(){for(var H=o.getPatternPosition(M),W=0;W<H.length;W+=1)for(var V=0;V<H.length;V+=1){var tt=H[W],st=H[V];if(S[tt][st]==null)for(var N=-2;N<=2;N+=1)for(var Q=-2;Q<=2;Q+=1)N==-2||N==2||Q==-2||Q==2||N==0&&Q==0?S[tt+N][st+Q]=!0:S[tt+N][st+Q]=!1}},gt=function(H){for(var W=o.getBCHTypeNumber(M),V=0;V<18;V+=1){var tt=!H&&(W>>V&1)==1;S[Math.floor(V/3)][V%3+R-8-3]=tt}for(var V=0;V<18;V+=1){var tt=!H&&(W>>V&1)==1;S[V%3+R-8-3][Math.floor(V/3)]=tt}},_t=function(H,W){for(var V=y<<3|W,tt=o.getBCHTypeInfo(V),st=0;st<15;st+=1){var N=!H&&(tt>>st&1)==1;st<6?S[st][8]=N:st<8?S[st+1][8]=N:S[R-15+st][8]=N}for(var st=0;st<15;st+=1){var N=!H&&(tt>>st&1)==1;st<8?S[8][R-st-1]=N:st<9?S[8][15-st-1+1]=N:S[8][15-st-1]=N}S[R-8][8]=!H},At=function(H,W){for(var V=-1,tt=R-1,st=7,N=0,Q=o.getMaskFunction(W),Z=R-1;Z>0;Z-=2)for(Z==6&&(Z-=1);;){for(var et=0;et<2;et+=1)if(S[tt][Z-et]==null){var ot=!1;N<H.length&&(ot=(H[N]>>>st&1)==1);var pt=Q(tt,Z-et);pt&&(ot=!ot),S[tt][Z-et]=ot,st-=1,st==-1&&(N+=1,st=7)}if(tt+=V,tt<0||R<=tt){tt-=V,V=-V;break}}},Ut=function(H,W){for(var V=0,tt=0,st=0,N=new Array(W.length),Q=new Array(W.length),Z=0;Z<W.length;Z+=1){var et=W[Z].dataCount,ot=W[Z].totalCount-et;tt=Math.max(tt,et),st=Math.max(st,ot),N[Z]=new Array(et);for(var pt=0;pt<N[Z].length;pt+=1)N[Z][pt]=255&H.getBuffer()[pt+V];V+=et;var Mt=o.getErrorCorrectPolynomial(ot),yt=l(N[Z],Mt.getLength()-1),Jt=yt.mod(Mt);Q[Z]=new Array(Mt.getLength()-1);for(var pt=0;pt<Q[Z].length;pt+=1){var Yt=pt+Jt.getLength()-Q[Z].length;Q[Z][pt]=Yt>=0?Jt.getAt(Yt):0}}for(var F=0,pt=0;pt<W.length;pt+=1)F+=W[pt].totalCount;for(var P=new Array(F),j=0,pt=0;pt<tt;pt+=1)for(var Z=0;Z<W.length;Z+=1)pt<N[Z].length&&(P[j]=N[Z][pt],j+=1);for(var pt=0;pt<st;pt+=1)for(var Z=0;Z<W.length;Z+=1)pt<Q[Z].length&&(P[j]=Q[Z][pt],j+=1);return P},ct=function(H,W,V){for(var tt=h.getRSBlocks(H,W),st=u(),N=0;N<V.length;N+=1){var Q=V[N];st.put(Q.getMode(),4),st.put(Q.getLength(),o.getLengthInBits(Q.getMode(),H)),Q.write(st)}for(var Z=0,N=0;N<tt.length;N+=1)Z+=tt[N].dataCount;if(st.getLengthInBits()>Z*8)throw"code length overflow. ("+st.getLengthInBits()+">"+Z*8+")";for(st.getLengthInBits()+4<=Z*8&&st.put(0,4);st.getLengthInBits()%8!=0;)st.putBit(!1);for(;!(st.getLengthInBits()>=Z*8||(st.put(A,8),st.getLengthInBits()>=Z*8));)st.put(T,8);return Ut(st,tt)};D.addData=function(H,W){W=W||"Byte";var V=null;switch(W){case"Numeric":V=d(H);break;case"Alphanumeric":V=f(H);break;case"Byte":V=p(H);break;case"Kanji":V=v(H);break;default:throw"mode:"+W}L.push(V),I=null},D.isDark=function(H,W){if(H<0||R<=H||W<0||R<=W)throw H+","+W;return S[H][W]},D.getModuleCount=function(){return R},D.make=function(){if(M<1){for(var H=1;H<40;H++){for(var W=h.getRSBlocks(H,y),V=u(),tt=0;tt<L.length;tt++){var st=L[tt];V.put(st.getMode(),4),V.put(st.getLength(),o.getLengthInBits(st.getMode(),H)),st.write(V)}for(var N=0,tt=0;tt<W.length;tt++)N+=W[tt].dataCount;if(V.getLengthInBits()<=N*8)break}M=H}k(!1,z())},D.createTableTag=function(H,W){H=H||2,W=typeof W>"u"?H*4:W;var V="";V+='<table style="',V+=" border-width: 0px; border-style: none;",V+=" border-collapse: collapse;",V+=" padding: 0px; margin: "+W+"px;",V+='">',V+="<tbody>";for(var tt=0;tt<D.getModuleCount();tt+=1){V+="<tr>";for(var st=0;st<D.getModuleCount();st+=1)V+='<td style="',V+=" border-width: 0px; border-style: none;",V+=" border-collapse: collapse;",V+=" padding: 0px; margin: 0px;",V+=" width: "+H+"px;",V+=" height: "+H+"px;",V+=" background-color: ",V+=D.isDark(tt,st)?"#000000":"#ffffff",V+=";",V+='"/>';V+="</tr>"}return V+="</tbody>",V+="</table>",V},D.createSvgTag=function(H,W,V,tt){var st={};typeof arguments[0]=="object"&&(st=arguments[0],H=st.cellSize,W=st.margin,V=st.alt,tt=st.title),H=H||2,W=typeof W>"u"?H*4:W,V=typeof V=="string"?{text:V}:V||{},V.text=V.text||null,V.id=V.text?V.id||"qrcode-description":null,tt=typeof tt=="string"?{text:tt}:tt||{},tt.text=tt.text||null,tt.id=tt.text?tt.id||"qrcode-title":null;var N=D.getModuleCount()*H+W*2,Q,Z,et,ot,pt="",Mt;for(Mt="l"+H+",0 0,"+H+" -"+H+",0 0,-"+H+"z ",pt+='<svg version="1.1" xmlns="http://www.w3.org/2000/svg"',pt+=st.scalable?"":' width="'+N+'px" height="'+N+'px"',pt+=' viewBox="0 0 '+N+" "+N+'" ',pt+=' preserveAspectRatio="xMinYMin meet"',pt+=tt.text||V.text?' role="img" aria-labelledby="'+G([tt.id,V.id].join(" ").trim())+'"':"",pt+=">",pt+=tt.text?'<title id="'+G(tt.id)+'">'+G(tt.text)+"</title>":"",pt+=V.text?'<description id="'+G(V.id)+'">'+G(V.text)+"</description>":"",pt+='<rect width="100%" height="100%" fill="white" cx="0" cy="0"/>',pt+='<path d="',et=0;et<D.getModuleCount();et+=1)for(ot=et*H+W,Q=0;Q<D.getModuleCount();Q+=1)D.isDark(et,Q)&&(Z=Q*H+W,pt+="M"+Z+","+ot+Mt);return pt+='" stroke="transparent" fill="black"/>',pt+="</svg>",pt},D.createDataURL=function(H,W){H=H||2,W=typeof W>"u"?H*4:W;var V=D.getModuleCount()*H+W*2,tt=W,st=V-W;return b(V,V,function(N,Q){if(tt<=N&&N<st&&tt<=Q&&Q<st){var Z=Math.floor((N-tt)/H),et=Math.floor((Q-tt)/H);return D.isDark(et,Z)?0:1}else return 1})},D.createImgTag=function(H,W,V){H=H||2,W=typeof W>"u"?H*4:W;var tt=D.getModuleCount()*H+W*2,st="";return st+="<img",st+=' src="',st+=D.createDataURL(H,W),st+='"',st+=' width="',st+=tt,st+='"',st+=' height="',st+=tt,st+='"',V&&(st+=' alt="',st+=G(V),st+='"'),st+="/>",st};var G=function(H){for(var W="",V=0;V<H.length;V+=1){var tt=H.charAt(V);switch(tt){case"<":W+="&lt;";break;case">":W+="&gt;";break;case"&":W+="&amp;";break;case'"':W+="&quot;";break;default:W+=tt;break}}return W},J=function(H){var W=1;H=typeof H>"u"?W*2:H;var V=D.getModuleCount()*W+H*2,tt=H,st=V-H,N,Q,Z,et,ot,pt={"██":"█","█ ":"▀"," █":"▄","  ":" "},Mt={"██":"▀","█ ":"▀"," █":" ","  ":" "},yt="";for(N=0;N<V;N+=2){for(Z=Math.floor((N-tt)/W),et=Math.floor((N+1-tt)/W),Q=0;Q<V;Q+=1)ot="█",tt<=Q&&Q<st&&tt<=N&&N<st&&D.isDark(Z,Math.floor((Q-tt)/W))&&(ot=" "),tt<=Q&&Q<st&&tt<=N+1&&N+1<st&&D.isDark(et,Math.floor((Q-tt)/W))?ot+=" ":ot+="█",yt+=H<1&&N+1>=st?Mt[ot]:pt[ot];yt+=`
`}return V%2&&H>0?yt.substring(0,yt.length-V-1)+Array(V+1).join("▀"):yt.substring(0,yt.length-1)};return D.createASCII=function(H,W){if(H=H||1,H<2)return J(W);H-=1,W=typeof W>"u"?H*2:W;var V=D.getModuleCount()*H+W*2,tt=W,st=V-W,N,Q,Z,et,ot=Array(H+1).join("██"),pt=Array(H+1).join("  "),Mt="",yt="";for(N=0;N<V;N+=1){for(Z=Math.floor((N-tt)/H),yt="",Q=0;Q<V;Q+=1)et=1,tt<=Q&&Q<st&&tt<=N&&N<st&&D.isDark(Z,Math.floor((Q-tt)/H))&&(et=0),yt+=et?ot:pt;for(Z=0;Z<H;Z+=1)Mt+=yt+`
`}return Mt.substring(0,Mt.length-1)},D.renderTo2dContext=function(H,W){W=W||2;for(var V=D.getModuleCount(),tt=0;tt<V;tt++)for(var st=0;st<V;st++)H.fillStyle=D.isDark(tt,st)?"black":"white",H.fillRect(tt*W,st*W,W,W)},D};i.stringToBytesFuncs={default:function(w){for(var E=[],A=0;A<w.length;A+=1){var T=w.charCodeAt(A);E.push(T&255)}return E}},i.stringToBytes=i.stringToBytesFuncs.default,i.createStringToBytes=function(w,E){var A=(function(){for(var M=_(w),y=function(){var it=M.read();if(it==-1)throw"eof";return it},S=0,R={};;){var I=M.read();if(I==-1)break;var L=y(),D=y(),k=y(),q=String.fromCharCode(I<<8|L),z=D<<8|k;R[q]=z,S+=1}if(S!=E)throw S+" != "+E;return R})(),T=63;return function(M){for(var y=[],S=0;S<M.length;S+=1){var R=M.charCodeAt(S);if(R<128)y.push(R);else{var I=A[M.charAt(S)];typeof I=="number"?(I&255)==I?y.push(I):(y.push(I>>>8),y.push(I&255)):y.push(T)}}return y}};var s={MODE_NUMBER:1,MODE_ALPHA_NUM:2,MODE_8BIT_BYTE:4,MODE_KANJI:8},r={L:1,M:0,Q:3,H:2},a={PATTERN000:0,PATTERN001:1,PATTERN010:2,PATTERN011:3,PATTERN100:4,PATTERN101:5,PATTERN110:6,PATTERN111:7},o=(function(){var w=[[],[6,18],[6,22],[6,26],[6,30],[6,34],[6,22,38],[6,24,42],[6,26,46],[6,28,50],[6,30,54],[6,32,58],[6,34,62],[6,26,46,66],[6,26,48,70],[6,26,50,74],[6,30,54,78],[6,30,56,82],[6,30,58,86],[6,34,62,90],[6,28,50,72,94],[6,26,50,74,98],[6,30,54,78,102],[6,28,54,80,106],[6,32,58,84,110],[6,30,58,86,114],[6,34,62,90,118],[6,26,50,74,98,122],[6,30,54,78,102,126],[6,26,52,78,104,130],[6,30,56,82,108,134],[6,34,60,86,112,138],[6,30,58,86,114,142],[6,34,62,90,118,146],[6,30,54,78,102,126,150],[6,24,50,76,102,128,154],[6,28,54,80,106,132,158],[6,32,58,84,110,136,162],[6,26,54,82,110,138,166],[6,30,58,86,114,142,170]],E=1335,A=7973,T=21522,M={},y=function(S){for(var R=0;S!=0;)R+=1,S>>>=1;return R};return M.getBCHTypeInfo=function(S){for(var R=S<<10;y(R)-y(E)>=0;)R^=E<<y(R)-y(E);return(S<<10|R)^T},M.getBCHTypeNumber=function(S){for(var R=S<<12;y(R)-y(A)>=0;)R^=A<<y(R)-y(A);return S<<12|R},M.getPatternPosition=function(S){return w[S-1]},M.getMaskFunction=function(S){switch(S){case a.PATTERN000:return function(R,I){return(R+I)%2==0};case a.PATTERN001:return function(R,I){return R%2==0};case a.PATTERN010:return function(R,I){return I%3==0};case a.PATTERN011:return function(R,I){return(R+I)%3==0};case a.PATTERN100:return function(R,I){return(Math.floor(R/2)+Math.floor(I/3))%2==0};case a.PATTERN101:return function(R,I){return R*I%2+R*I%3==0};case a.PATTERN110:return function(R,I){return(R*I%2+R*I%3)%2==0};case a.PATTERN111:return function(R,I){return(R*I%3+(R+I)%2)%2==0};default:throw"bad maskPattern:"+S}},M.getErrorCorrectPolynomial=function(S){for(var R=l([1],0),I=0;I<S;I+=1)R=R.multiply(l([1,c.gexp(I)],0));return R},M.getLengthInBits=function(S,R){if(1<=R&&R<10)switch(S){case s.MODE_NUMBER:return 10;case s.MODE_ALPHA_NUM:return 9;case s.MODE_8BIT_BYTE:return 8;case s.MODE_KANJI:return 8;default:throw"mode:"+S}else if(R<27)switch(S){case s.MODE_NUMBER:return 12;case s.MODE_ALPHA_NUM:return 11;case s.MODE_8BIT_BYTE:return 16;case s.MODE_KANJI:return 10;default:throw"mode:"+S}else if(R<41)switch(S){case s.MODE_NUMBER:return 14;case s.MODE_ALPHA_NUM:return 13;case s.MODE_8BIT_BYTE:return 16;case s.MODE_KANJI:return 12;default:throw"mode:"+S}else throw"type:"+R},M.getLostPoint=function(S){for(var R=S.getModuleCount(),I=0,L=0;L<R;L+=1)for(var D=0;D<R;D+=1){for(var k=0,q=S.isDark(L,D),z=-1;z<=1;z+=1)if(!(L+z<0||R<=L+z))for(var it=-1;it<=1;it+=1)D+it<0||R<=D+it||z==0&&it==0||q==S.isDark(L+z,D+it)&&(k+=1);k>5&&(I+=3+k-5)}for(var L=0;L<R-1;L+=1)for(var D=0;D<R-1;D+=1){var ut=0;S.isDark(L,D)&&(ut+=1),S.isDark(L+1,D)&&(ut+=1),S.isDark(L,D+1)&&(ut+=1),S.isDark(L+1,D+1)&&(ut+=1),(ut==0||ut==4)&&(I+=3)}for(var L=0;L<R;L+=1)for(var D=0;D<R-6;D+=1)S.isDark(L,D)&&!S.isDark(L,D+1)&&S.isDark(L,D+2)&&S.isDark(L,D+3)&&S.isDark(L,D+4)&&!S.isDark(L,D+5)&&S.isDark(L,D+6)&&(I+=40);for(var D=0;D<R;D+=1)for(var L=0;L<R-6;L+=1)S.isDark(L,D)&&!S.isDark(L+1,D)&&S.isDark(L+2,D)&&S.isDark(L+3,D)&&S.isDark(L+4,D)&&!S.isDark(L+5,D)&&S.isDark(L+6,D)&&(I+=40);for(var gt=0,D=0;D<R;D+=1)for(var L=0;L<R;L+=1)S.isDark(L,D)&&(gt+=1);var _t=Math.abs(100*gt/R/R-50)/5;return I+=_t*10,I},M})(),c=(function(){for(var w=new Array(256),E=new Array(256),A=0;A<8;A+=1)w[A]=1<<A;for(var A=8;A<256;A+=1)w[A]=w[A-4]^w[A-5]^w[A-6]^w[A-8];for(var A=0;A<255;A+=1)E[w[A]]=A;var T={};return T.glog=function(M){if(M<1)throw"glog("+M+")";return E[M]},T.gexp=function(M){for(;M<0;)M+=255;for(;M>=256;)M-=255;return w[M]},T})();function l(w,E){if(typeof w.length>"u")throw w.length+"/"+E;var A=(function(){for(var M=0;M<w.length&&w[M]==0;)M+=1;for(var y=new Array(w.length-M+E),S=0;S<w.length-M;S+=1)y[S]=w[S+M];return y})(),T={};return T.getAt=function(M){return A[M]},T.getLength=function(){return A.length},T.multiply=function(M){for(var y=new Array(T.getLength()+M.getLength()-1),S=0;S<T.getLength();S+=1)for(var R=0;R<M.getLength();R+=1)y[S+R]^=c.gexp(c.glog(T.getAt(S))+c.glog(M.getAt(R)));return l(y,0)},T.mod=function(M){if(T.getLength()-M.getLength()<0)return T;for(var y=c.glog(T.getAt(0))-c.glog(M.getAt(0)),S=new Array(T.getLength()),R=0;R<T.getLength();R+=1)S[R]=T.getAt(R);for(var R=0;R<M.getLength();R+=1)S[R]^=c.gexp(c.glog(M.getAt(R))+y);return l(S,0).mod(M)},T}var h=(function(){var w=[[1,26,19],[1,26,16],[1,26,13],[1,26,9],[1,44,34],[1,44,28],[1,44,22],[1,44,16],[1,70,55],[1,70,44],[2,35,17],[2,35,13],[1,100,80],[2,50,32],[2,50,24],[4,25,9],[1,134,108],[2,67,43],[2,33,15,2,34,16],[2,33,11,2,34,12],[2,86,68],[4,43,27],[4,43,19],[4,43,15],[2,98,78],[4,49,31],[2,32,14,4,33,15],[4,39,13,1,40,14],[2,121,97],[2,60,38,2,61,39],[4,40,18,2,41,19],[4,40,14,2,41,15],[2,146,116],[3,58,36,2,59,37],[4,36,16,4,37,17],[4,36,12,4,37,13],[2,86,68,2,87,69],[4,69,43,1,70,44],[6,43,19,2,44,20],[6,43,15,2,44,16],[4,101,81],[1,80,50,4,81,51],[4,50,22,4,51,23],[3,36,12,8,37,13],[2,116,92,2,117,93],[6,58,36,2,59,37],[4,46,20,6,47,21],[7,42,14,4,43,15],[4,133,107],[8,59,37,1,60,38],[8,44,20,4,45,21],[12,33,11,4,34,12],[3,145,115,1,146,116],[4,64,40,5,65,41],[11,36,16,5,37,17],[11,36,12,5,37,13],[5,109,87,1,110,88],[5,65,41,5,66,42],[5,54,24,7,55,25],[11,36,12,7,37,13],[5,122,98,1,123,99],[7,73,45,3,74,46],[15,43,19,2,44,20],[3,45,15,13,46,16],[1,135,107,5,136,108],[10,74,46,1,75,47],[1,50,22,15,51,23],[2,42,14,17,43,15],[5,150,120,1,151,121],[9,69,43,4,70,44],[17,50,22,1,51,23],[2,42,14,19,43,15],[3,141,113,4,142,114],[3,70,44,11,71,45],[17,47,21,4,48,22],[9,39,13,16,40,14],[3,135,107,5,136,108],[3,67,41,13,68,42],[15,54,24,5,55,25],[15,43,15,10,44,16],[4,144,116,4,145,117],[17,68,42],[17,50,22,6,51,23],[19,46,16,6,47,17],[2,139,111,7,140,112],[17,74,46],[7,54,24,16,55,25],[34,37,13],[4,151,121,5,152,122],[4,75,47,14,76,48],[11,54,24,14,55,25],[16,45,15,14,46,16],[6,147,117,4,148,118],[6,73,45,14,74,46],[11,54,24,16,55,25],[30,46,16,2,47,17],[8,132,106,4,133,107],[8,75,47,13,76,48],[7,54,24,22,55,25],[22,45,15,13,46,16],[10,142,114,2,143,115],[19,74,46,4,75,47],[28,50,22,6,51,23],[33,46,16,4,47,17],[8,152,122,4,153,123],[22,73,45,3,74,46],[8,53,23,26,54,24],[12,45,15,28,46,16],[3,147,117,10,148,118],[3,73,45,23,74,46],[4,54,24,31,55,25],[11,45,15,31,46,16],[7,146,116,7,147,117],[21,73,45,7,74,46],[1,53,23,37,54,24],[19,45,15,26,46,16],[5,145,115,10,146,116],[19,75,47,10,76,48],[15,54,24,25,55,25],[23,45,15,25,46,16],[13,145,115,3,146,116],[2,74,46,29,75,47],[42,54,24,1,55,25],[23,45,15,28,46,16],[17,145,115],[10,74,46,23,75,47],[10,54,24,35,55,25],[19,45,15,35,46,16],[17,145,115,1,146,116],[14,74,46,21,75,47],[29,54,24,19,55,25],[11,45,15,46,46,16],[13,145,115,6,146,116],[14,74,46,23,75,47],[44,54,24,7,55,25],[59,46,16,1,47,17],[12,151,121,7,152,122],[12,75,47,26,76,48],[39,54,24,14,55,25],[22,45,15,41,46,16],[6,151,121,14,152,122],[6,75,47,34,76,48],[46,54,24,10,55,25],[2,45,15,64,46,16],[17,152,122,4,153,123],[29,74,46,14,75,47],[49,54,24,10,55,25],[24,45,15,46,46,16],[4,152,122,18,153,123],[13,74,46,32,75,47],[48,54,24,14,55,25],[42,45,15,32,46,16],[20,147,117,4,148,118],[40,75,47,7,76,48],[43,54,24,22,55,25],[10,45,15,67,46,16],[19,148,118,6,149,119],[18,75,47,31,76,48],[34,54,24,34,55,25],[20,45,15,61,46,16]],E=function(M,y){var S={};return S.totalCount=M,S.dataCount=y,S},A={},T=function(M,y){switch(y){case r.L:return w[(M-1)*4+0];case r.M:return w[(M-1)*4+1];case r.Q:return w[(M-1)*4+2];case r.H:return w[(M-1)*4+3];default:return}};return A.getRSBlocks=function(M,y){var S=T(M,y);if(typeof S>"u")throw"bad rs block @ typeNumber:"+M+"/errorCorrectionLevel:"+y;for(var R=S.length/3,I=[],L=0;L<R;L+=1)for(var D=S[L*3+0],k=S[L*3+1],q=S[L*3+2],z=0;z<D;z+=1)I.push(E(k,q));return I},A})(),u=function(){var w=[],E=0,A={};return A.getBuffer=function(){return w},A.getAt=function(T){var M=Math.floor(T/8);return(w[M]>>>7-T%8&1)==1},A.put=function(T,M){for(var y=0;y<M;y+=1)A.putBit((T>>>M-y-1&1)==1)},A.getLengthInBits=function(){return E},A.putBit=function(T){var M=Math.floor(E/8);w.length<=M&&w.push(0),T&&(w[M]|=128>>>E%8),E+=1},A},d=function(w){var E=s.MODE_NUMBER,A=w,T={};T.getMode=function(){return E},T.getLength=function(S){return A.length},T.write=function(S){for(var R=A,I=0;I+2<R.length;)S.put(M(R.substring(I,I+3)),10),I+=3;I<R.length&&(R.length-I==1?S.put(M(R.substring(I,I+1)),4):R.length-I==2&&S.put(M(R.substring(I,I+2)),7))};var M=function(S){for(var R=0,I=0;I<S.length;I+=1)R=R*10+y(S.charAt(I));return R},y=function(S){if("0"<=S&&S<="9")return S.charCodeAt(0)-48;throw"illegal char :"+S};return T},f=function(w){var E=s.MODE_ALPHA_NUM,A=w,T={};T.getMode=function(){return E},T.getLength=function(y){return A.length},T.write=function(y){for(var S=A,R=0;R+1<S.length;)y.put(M(S.charAt(R))*45+M(S.charAt(R+1)),11),R+=2;R<S.length&&y.put(M(S.charAt(R)),6)};var M=function(y){if("0"<=y&&y<="9")return y.charCodeAt(0)-48;if("A"<=y&&y<="Z")return y.charCodeAt(0)-65+10;switch(y){case" ":return 36;case"$":return 37;case"%":return 38;case"*":return 39;case"+":return 40;case"-":return 41;case".":return 42;case"/":return 43;case":":return 44;default:throw"illegal char :"+y}};return T},p=function(w){var E=s.MODE_8BIT_BYTE,A=i.stringToBytes(w),T={};return T.getMode=function(){return E},T.getLength=function(M){return A.length},T.write=function(M){for(var y=0;y<A.length;y+=1)M.put(A[y],8)},T},v=function(w){var E=s.MODE_KANJI,A=i.stringToBytesFuncs.SJIS;if(!A)throw"sjis not supported.";(function(y,S){var R=A(y);if(R.length!=2||(R[0]<<8|R[1])!=S)throw"sjis not supported."})("友",38726);var T=A(w),M={};return M.getMode=function(){return E},M.getLength=function(y){return~~(T.length/2)},M.write=function(y){for(var S=T,R=0;R+1<S.length;){var I=(255&S[R])<<8|255&S[R+1];if(33088<=I&&I<=40956)I-=33088;else if(57408<=I&&I<=60351)I-=49472;else throw"illegal char at "+(R+1)+"/"+I;I=(I>>>8&255)*192+(I&255),y.put(I,13),R+=2}if(R<S.length)throw"illegal char at "+(R+1)},M},g=function(){var w=[],E={};return E.writeByte=function(A){w.push(A&255)},E.writeShort=function(A){E.writeByte(A),E.writeByte(A>>>8)},E.writeBytes=function(A,T,M){T=T||0,M=M||A.length;for(var y=0;y<M;y+=1)E.writeByte(A[y+T])},E.writeString=function(A){for(var T=0;T<A.length;T+=1)E.writeByte(A.charCodeAt(T))},E.toByteArray=function(){return w},E.toString=function(){var A="";A+="[";for(var T=0;T<w.length;T+=1)T>0&&(A+=","),A+=w[T];return A+="]",A},E},m=function(){var w=0,E=0,A=0,T="",M={},y=function(R){T+=String.fromCharCode(S(R&63))},S=function(R){if(!(R<0)){if(R<26)return 65+R;if(R<52)return 97+(R-26);if(R<62)return 48+(R-52);if(R==62)return 43;if(R==63)return 47}throw"n:"+R};return M.writeByte=function(R){for(w=w<<8|R&255,E+=8,A+=1;E>=6;)y(w>>>E-6),E-=6},M.flush=function(){if(E>0&&(y(w<<6-E),w=0,E=0),A%3!=0)for(var R=3-A%3,I=0;I<R;I+=1)T+="="},M.toString=function(){return T},M},_=function(w){var E=w,A=0,T=0,M=0,y={};y.read=function(){for(;M<8;){if(A>=E.length){if(M==0)return-1;throw"unexpected end of file./"+M}var R=E.charAt(A);if(A+=1,R=="=")return M=0,-1;if(R.match(/^\s$/))continue;T=T<<6|S(R.charCodeAt(0)),M+=6}var I=T>>>M-8&255;return M-=8,I};var S=function(R){if(65<=R&&R<=90)return R-65;if(97<=R&&R<=122)return R-97+26;if(48<=R&&R<=57)return R-48+52;if(R==43)return 62;if(R==47)return 63;throw"c:"+R};return y},x=function(w,E){var A=w,T=E,M=new Array(w*E),y={};y.setPixel=function(L,D,k){M[D*A+L]=k},y.write=function(L){L.writeString("GIF87a"),L.writeShort(A),L.writeShort(T),L.writeByte(128),L.writeByte(0),L.writeByte(0),L.writeByte(0),L.writeByte(0),L.writeByte(0),L.writeByte(255),L.writeByte(255),L.writeByte(255),L.writeString(","),L.writeShort(0),L.writeShort(0),L.writeShort(A),L.writeShort(T),L.writeByte(0);var D=2,k=R(D);L.writeByte(D);for(var q=0;k.length-q>255;)L.writeByte(255),L.writeBytes(k,q,255),q+=255;L.writeByte(k.length-q),L.writeBytes(k,q,k.length-q),L.writeByte(0),L.writeString(";")};var S=function(L){var D=L,k=0,q=0,z={};return z.write=function(it,ut){if(it>>>ut)throw"length over";for(;k+ut>=8;)D.writeByte(255&(it<<k|q)),ut-=8-k,it>>>=8-k,q=0,k=0;q=it<<k|q,k=k+ut},z.flush=function(){k>0&&D.writeByte(q)},z},R=function(L){for(var D=1<<L,k=(1<<L)+1,q=L+1,z=I(),it=0;it<D;it+=1)z.add(String.fromCharCode(it));z.add(String.fromCharCode(D)),z.add(String.fromCharCode(k));var ut=g(),gt=S(ut);gt.write(D,q);var _t=0,At=String.fromCharCode(M[_t]);for(_t+=1;_t<M.length;){var Ut=String.fromCharCode(M[_t]);_t+=1,z.contains(At+Ut)?At=At+Ut:(gt.write(z.indexOf(At),q),z.size()<4095&&(z.size()==1<<q&&(q+=1),z.add(At+Ut)),At=Ut)}return gt.write(z.indexOf(At),q),gt.write(k,q),gt.flush(),ut.toByteArray()},I=function(){var L={},D=0,k={};return k.add=function(q){if(k.contains(q))throw"dup key:"+q;L[q]=D,D+=1},k.size=function(){return D},k.indexOf=function(q){return L[q]},k.contains=function(q){return typeof L[q]<"u"},k};return y},b=function(w,E,A){for(var T=x(w,E),M=0;M<E;M+=1)for(var y=0;y<w;y+=1)T.setPixel(y,M,A(y,M));var S=g();T.write(S);for(var R=m(),I=S.toByteArray(),L=0;L<I.length;L+=1)R.writeByte(I[L]);return R.flush(),"data:image/gif;base64,"+R};return i})();(function(){e.stringToBytesFuncs["UTF-8"]=function(i){function s(r){for(var a=[],o=0;o<r.length;o++){var c=r.charCodeAt(o);c<128?a.push(c):c<2048?a.push(192|c>>6,128|c&63):c<55296||c>=57344?a.push(224|c>>12,128|c>>6&63,128|c&63):(o++,c=65536+((c&1023)<<10|r.charCodeAt(o)&1023),a.push(240|c>>18,128|c>>12&63,128|c>>6&63,128|c&63))}return a}return s(i)}})(),(function(i){n.exports=i()})(function(){return e})})(Uh)),Uh.exports}var JT=KT();const QT=ZT(JT);function go(){return location.origin+location.pathname.replace(/index\.html$/,"")}function t4(n){const t=QT(0,"M");return t.addData(n),t.make(),t.createSvgTag({cellSize:8,margin:2,scalable:!0})}async function e4(n,t){const e=new File([n],t,{type:n.type});if(navigator.canShare?.({files:[e]}))try{return await navigator.share({files:[e],title:"costuma 2026"}),"shared"}catch(s){if(s.name==="AbortError")return"cancelled"}return pg(n,t),"saved"}function pg(n,t){const e=document.createElement("a");e.href=URL.createObjectURL(n),e.download=t,document.body.appendChild(e),e.click(),e.remove(),setTimeout(()=>URL.revokeObjectURL(e.href),3e4)}function n4(){const n=window.MediaRecorder;if(n)return["video/mp4;codecs=avc1","video/mp4","video/webm;codecs=vp9","video/webm;codecs=vp8","video/webm"].find(t=>n.isTypeSupported(t))}const $t=n=>document.getElementById(n),i4="./",Oe=new URLSearchParams(location.search),Y0=Oe.get("test")==="1",Jn=Number(Oe.get("synth")??0),ft=YT();Oe.get("c")&&(ft.costume=Oe.get("c"));Wi.some(n=>n.id===ft.costume)||(ft.costume=Wi[0].id);Oe.get("people")&&(ft.people=Number(Oe.get("people")));const ti=()=>jT(ft),ze=$t("video"),Fo=$t("stage"),ra=$t("overlay"),Ee=ra.getContext("2d"),Wt=new RT(Fo);Wt.opts.size=ft.size;Wt.opts.shadows=ft.shadows;Wt.opts.envLight=ft.envLight;const un=new NT(Wt.bgUniforms,fg);Wt.cloneCast=(n,t)=>ft.scene==="party"&&ft.partyCast==="mix"?gl(j0(n)+1+t+Bo):n;const Ds=new FT,mg=new OT;let Ua=null,Nh=-1;(Oe.get("scene")==="party"||Oe.get("scene")==="costume")&&(ft.scene=Oe.get("scene"));Oe.get("fx")&&(ft.effect=Oe.get("fx"));Oe.get("googly")&&(ft.googly=Oe.get("googly")==="1");Oe.get("pc")&&(ft.partyCostumes=Oe.get("pc")==="behind"?"behind":Oe.get("pc")==="1"||Oe.get("pc")==="on"?"on":"off");un.preset=fs.find(n=>n.id===ft.effect)??fs[0];const Oo=new Pg(ze,Oe.get("facing")??void 0);let _i=null;const Ge=new Hg;let Ha=!1;const Va=new Map,os=new Map;let ko=0,Bo=0;function wr(){const n=Wi.filter(t=>ft.cast.includes(t.id));return n.length?n:Wi.filter(t=>Zu.includes(t.id))}const gl=n=>{const t=wr();return t[(n%t.length+t.length)%t.length].id},j0=n=>Math.max(0,wr().findIndex(t=>t.id===n));function vl(n){const t=Va.get(n);if(t)return t;if(ft.scene==="party"){if(ft.partyCast!=="mix")return Wi.some(s=>s.id===ft.partyCast)?ft.partyCast:"skeleton";let i=os.get(n);return i||(i=gl(Bo+ko++*3),os.set(n,i)),i}if(ft.mode==="one")return ft.costume;let e=os.get(n);return e||(e=gl(j0(ft.costume)+Bo+ko++),os.set(n,e)),e}const B1=new Set;function za(n,t=!1){if(Wt.hasTemplate(n))return;const e=!B1.has(n);B1.add(n),!t&&e&&Ie(`Dressing up as ${Gi(n).name}…`,1800),(e||!t)&&Wt.prepare(n,!0).catch(i=>{console.error("build failed",n,i),Ie(`${Gi(n).name} failed to build`)})}let H1=0;function Ie(n,t=1400){const e=$t("toast");e.textContent=n,e.classList.add("on"),clearTimeout(H1),H1=window.setTimeout(()=>e.classList.remove("on"),t)}const s4=n=>{const t=$t("hint");t.textContent=n,t.classList.toggle("on",!!n)},Z0=n=>`${i4}thumbs/${n}.png`;function K0(){const n=$t("picker");if(n.innerHTML="",ft.scene==="party"){for(const i of fs){const s=document.createElement("button");s.className="card fx",s.dataset.id=i.id,s.setAttribute("role","option"),s.innerHTML='<div class="thumb"></div><div class="name"></div>',s.querySelector(".thumb").style.background=i.swatch,s.querySelector(".name").textContent=i.name,s.onclick=()=>J0(i.id),n.appendChild(s)}Ho();return}const t=(i,s,r="")=>{const a=document.createElement("button");a.className=`card ${r}`,a.dataset.id=i,a.setAttribute("role","option"),a.innerHTML='<div class="thumb"></div><div class="name"></div>',a.querySelector(".name").textContent=s;const o=a.querySelector(".thumb");if(i==="mix")o.textContent="MIX";else{const c=new Image;c.alt="",c.draggable=!1,c.onerror=()=>{c.remove(),o.textContent=s.slice(0,1)},c.src=Z0(i),o.appendChild(c)}a.onclick=()=>gg(i),n.appendChild(a)};t("mix","Mix","mix");for(const i of wr())t(i.id,i.name);const e=document.createElement("button");e.className="card more",e.innerHTML='<div class="thumb">+</div><div class="name">More</div>',e.onclick=o4,n.appendChild(e),Ho()}function r4(n){let t=null,e=!1;n.addEventListener("pointerdown",s=>{t={x:s.clientX,left:n.scrollLeft,id:s.pointerId},e=!1}),n.addEventListener("dragstart",s=>s.preventDefault()),n.addEventListener("pointermove",s=>{if(!t||s.pointerId!==t.id)return;const r=s.clientX-t.x;!e&&Math.abs(r)>6&&(e=!0,n.classList.add("dragging")),e&&(n.scrollLeft=t.left-r)});const i=()=>{t=null,n.classList.remove("dragging")};n.addEventListener("pointerup",i),n.addEventListener("pointercancel",i),n.addEventListener("click",s=>{e&&(s.stopPropagation(),s.preventDefault(),e=!1)},!0),n.addEventListener("wheel",s=>{Math.abs(s.deltaY)<=Math.abs(s.deltaX)||(n.scrollLeft+=s.deltaY,s.preventDefault())},{passive:!1})}function Ho(){for(const n of $t("picker").querySelectorAll(".card")){const t=ft.scene==="party"?n.dataset.id===ft.effect:ft.mode==="mix"?n.dataset.id==="mix":n.dataset.id===ft.costume;if(n.classList.toggle("on",t),n.setAttribute("aria-selected",String(t)),t){const e=$t("picker");e.scrollTo({left:n.offsetLeft-(e.clientWidth-n.offsetWidth)/2,behavior:"smooth"})}}}function gg(n){if(Va.clear(),n==="mix"){const t=ft.mode==="mix";ft.mode="mix",t&&Bo++,os.clear(),ko=0,Ie(t?"Shuffled":"Mix: everyone gets their own")}else ft.mode="one",ft.costume=n,za(n),Wt.hasTemplate(n)&&Ie(Gi(n).name,900);ti(),Ho()}const a4=()=>[...wr().map(n=>n.id),"mix"];function J0(n){const t=fs.find(e=>e.id===n)??fs[0];if(ft.effect===t.id&&un.preset.id===t.id){const e=a4(),i=e.indexOf(ft.partyCast);ft.partyCast=e[(i+1)%e.length],ft.partyCast==="mix"&&Bo++,Va.clear(),os.clear(),ko=0,ft.partyCast!=="mix"&&za(ft.partyCast),ft.partyCostumes==="off"&&(ft.partyCostumes="behind"),ti(),Ie(ft.partyCast==="mix"?"Dancers: a mix":`Dancers: ${Gi(ft.partyCast).name}`,1e3);return}ft.effect=t.id,un.preset=t,ti(),Ho(),Ie(t.name,800)}function V1(n){const t=$t("dip");t.classList.add("on"),setTimeout(async()=>{try{await n()}finally{requestAnimationFrame(()=>requestAnimationFrame(()=>t.classList.remove("on")))}},190)}function Qu(n){ft.scene=n,ti(),Wt.setBackground(n==="party"?un.material:null),_i?.setOptions({masks:n==="party"}),$t("btn-pyramid").classList.toggle("hidden",n!=="party");for(const t of document.querySelectorAll(".modes button")){const e=t.dataset.scene===n;t.classList.toggle("on",e),t.setAttribute("aria-selected",String(e))}K0()}function o4(){const n=$t("more-body");n.innerHTML="";const t=Wi.filter(i=>!Zu.includes(i.id)),e=(i,s)=>{const r=document.createElement("h3");r.textContent=i,n.appendChild(r);const a=document.createElement("div");a.className="more-grid";for(const o of s){const c=document.createElement("button");c.className="more-card",c.innerHTML='<div class="thumb"></div><div class="name"></div><div class="tick"></div>';const l=new Image;l.alt="",l.draggable=!1,l.src=Z0(o.id),l.onerror=()=>l.remove(),c.querySelector(".thumb").appendChild(l),c.querySelector(".name").textContent=o.name;const h=()=>{const u=ft.cast.includes(o.id);c.classList.toggle("on",u),c.querySelector(".tick").textContent=u?"✓":"✕",c.setAttribute("aria-pressed",String(u))};h(),c.onclick=()=>{const u=ft.cast.includes(o.id);if(u&&ft.cast.length<=1){Ie("Keep at least one");return}ft.cast=u?ft.cast.filter(d=>d!==o.id):[...ft.cast,o.id],u||za(o.id,!0),os.clear(),ko=0,ti(),h(),K0()},a.appendChild(c)}n.appendChild(a)};e("The usual crowd",Wi.filter(i=>Zu.includes(i.id))),e("Advanced & trash",t),Cl("more")}function Cl(n){$t(n).classList.remove("hidden")}for(const n of document.querySelectorAll(".modal"))n.addEventListener("click",t=>{(t.target===n||t.target.closest("[data-close]"))&&n.classList.add("hidden")});function z1(){const n=go();$t("qr-code").innerHTML=t4(n),$t("qr-url").textContent=n,Cl("qr")}$t("btn-copy").onclick=async()=>{try{await navigator.clipboard.writeText(go()),Ie("Link copied")}catch{Ie("Could not copy — long-press the link")}};$t("btn-share-link").onclick=async()=>{if(navigator.share)try{await navigator.share({title:"costuma 2026",text:"Be a 3D costume:",url:go()})}catch{}else try{await navigator.clipboard.writeText(go()),Ie("Link copied")}catch{Ie(go())}};function c4(){const n=$t("settings-body");n.innerHTML="";const t=(r,a,o)=>{const c=document.createElement("div");c.className="set";const l=document.createElement("label"),h=document.createElement("span");if(h.textContent=r,a){const u=document.createElement("small");u.textContent=a,h.appendChild(u)}l.append(h,o),c.appendChild(l),n.appendChild(c)},e=(r,a,o)=>{const c=document.createElement("div");c.className="seg";for(const[l,h]of r){const u=document.createElement("button");u.textContent=h,u.classList.toggle("on",a()===l),u.onclick=()=>{o(l),ti();for(const d of c.children)d.classList.remove("on");u.classList.add("on")},c.appendChild(u)}return c},i=(r,a)=>{const o=document.createElement("input");return o.type="checkbox",o.className="switch",o.checked=r(),o.onchange=()=>{a(o.checked),ti()},o},s=(r,a,o,c,l)=>{const h=document.createElement("input");return h.type="range",h.min=String(r),h.max=String(a),h.step=String(o),h.value=String(c()),h.oninput=()=>{l(Number(h.value)),ti()},h};t(ft.scene==="party"?"Subjects":"People",ft.scene==="party"?"How many people to cut out (the nearest)":"How many to dress at once",e([[1,"1"],[2,"2"],[3,"3"],[4,"4"]],()=>ft.people,r=>{ft.people=r,_i?.setOptions({numPoses:r})})),t("Costume size","Bigger hides more of the person",s(.8,1.5,.01,()=>ft.size,r=>{ft.size=r,Wt.opts.size=r})),t("Pose model","Accurate is steadier, slower to load and run",e([["lite","Fast"],["full","Accurate"]],()=>ft.model,r=>{ft.model=r,g4()})),t("Light from the camera","The costume is lit by the room it stands in",i(()=>ft.envLight,r=>{ft.envLight=r,Wt.opts.envLight=r})),t("Shadows","Off is faster on older phones",i(()=>ft.shadows,r=>{ft.shadows=r,Wt.opts.shadows=r})),t("Lens","If costumes look too flat or too deep",s(.55,1.3,.01,()=>ft.lens,r=>{ft.lens=r})),t("React to the music","Listens through the microphone for the beat; clips record the sound",i(()=>ft.music,r=>{ft.music=r,r?Ds.start().then(()=>Ie("Listening for the beat",1200)).catch(()=>{ft.music=!1,ti(),Ie("No microphone")}):Ds.stop()}));{const r=document.createElement("select");r.className="pick";for(const a of wr()){const o=document.createElement("option");o.value=a.id,o.textContent=a.name,r.appendChild(o)}{const a=document.createElement("option");a.value="mix",a.textContent="A mix",r.appendChild(a)}r.value=ft.partyCast,r.onchange=()=>{ft.partyCast=r.value,Va.clear(),os.clear(),ti(),r.value!=="mix"&&za(r.value)},t("Party dancers","Who dances behind (or as) you in party mode",r)}t("Costumes in party mode","Behind you: you stay yourself, a pyramid of your costume dances behind you",e([["off","Off"],["behind","Behind"],["on","On you"]],()=>ft.partyCostumes,r=>{ft.partyCostumes=r})),t("Face tracking","Mouths open costumes and breathe sparks; googly eyes find your eyes",i(()=>ft.faces,r=>{ft.faces=r,r&&ef()})),t("Mouth magic","Open your mouth: sparks",i(()=>ft.breath,r=>{ft.breath=r})),t("Show the skeleton","What the pose tracker sees",i(()=>ft.debug,r=>{ft.debug=r}))}let t0=!1,pr=null;function vg(n,t){pr={blob:n,name:t};const e=$t("preview-media");e.innerHTML="";const i=URL.createObjectURL(n);if(n.type.startsWith("video")){const s=document.createElement("video");s.src=i,s.controls=!0,s.playsInline=!0,s.loop=!0,s.muted=!0,s.play().catch(()=>{}),e.appendChild(s)}else{const s=new Image;s.src=i,e.appendChild(s)}Cl("preview")}$t("btn-share").onclick=async()=>{pr&&await e4(pr.blob,pr.name)==="saved"&&Ie("Saved")};$t("btn-save").onclick=()=>{pr&&(pg(pr.blob,pr.name),Ie("Saved"))};const xg=()=>new Date().toISOString().slice(0,19).replace(/[:T]/g,"-");let Ic=null,G1=0;function l4(){const n=$t("btn-rec");if(Ic){Ic.stop();return}const t=n4(),e=Fo.captureStream;if(!t||!e){Ie("Recording is not supported in this browser");return}const i=[],s=e.call(Fo,30);for(const a of Ds.stream?.getAudioTracks()??[])s.addTrack(a);const r=new MediaRecorder(s,{mimeType:t,videoBitsPerSecond:8e6});r.ondataavailable=a=>{a.data.size&&i.push(a.data)},r.onstop=()=>{clearTimeout(G1),Ic=null,n.classList.remove("on"),n.innerHTML=is.rec;const a=t.split(";")[0];vg(new Blob(i,{type:a}),`costuma-${xg()}.${a.includes("mp4")?"mp4":"webm"}`)},r.start(250),Ic=r,n.classList.add("on"),n.innerHTML=is.stop,G1=window.setTimeout(()=>r.state==="recording"&&r.stop(),2e4),Ie("Recording — tap to stop",1200)}const h4=4500;let _g=performance.now(),xl=!1;const _l=()=>$t("hud");function u4(){_g=performance.now(),_l().classList.contains("idle")&&(_l().classList.remove("idle"),xl=!0,setTimeout(()=>xl=!1,400))}for(const n of["pointerdown","keydown","wheel"])window.addEventListener(n,u4,{capture:!0,passive:!0});setInterval(()=>{const n=[...document.querySelectorAll(".modal")].some(e=>!e.classList.contains("hidden")),t=Ha&&!n&&performance.now()-_g>h4;t!==_l().classList.contains("idle")&&_l().classList.toggle("idle",t)},300);function Mg(n){const t=Wt.cover,e=n.image,i=(e[O.shL].x+e[O.shR].x+e[O.hipL].x+e[O.hipR].x)/4,s=(e[O.shL].y+e[O.shR].y+e[O.hipL].y+e[O.hipR].y)/4;let r=(i*t.vw-t.ox)*t.s;const a=(s*t.vh-t.oy)*t.s;return t.mirror&&(r=t.cw-r),{x:r,y:a}}Fo.addEventListener("click",n=>{if(!Ha)return;if(xl){xl=!1;return}if(ft.scene==="party"&&ft.partyCostumes==="off"){const r=fs.findIndex(a=>a.id===ft.effect);J0(fs[(r+1)%fs.length].id);return}let t=null,e=1/0;for(const r of Ge.tracks){if(r.lost)continue;const a=Mg(r),o=Math.hypot(a.x-n.clientX,a.y-n.clientY);o<e&&(e=o,t=r)}if(!t||e>Math.max(innerWidth,innerHeight)*.3)return;const i=vl(t.id),s=gl(j0(i)+1);Va.set(t.id,s),za(s),Ie(Gi(s).name,900)});let e0=0,W1=-1,n0=0,i0=performance.now(),Fh=performance.now();const aa=document.createElement("canvas"),f4=aa.getContext("2d");function d4(){if(ft.scene!=="party")return ze;const n=ze.videoWidth||720,t=ze.videoHeight||1280,e=480/Math.max(n,t),i=Math.round(n*e),s=Math.round(t*e);return(aa.width!==i||aa.height!==s)&&(aa.width=i,aa.height=s),f4.drawImage(ze,0,0,i,s),aa}let Q0=0,Oh=performance.now(),kh=0;function tf(){return Fg(ze.videoWidth||720,ze.videoHeight||1280,ft.lens)}function bg(n){if(requestAnimationFrame(bg),!Ha)return;e0++;const t=tf();Wt.layout(t,Oo.mirrored&&!Jn);let e=null;if(Jn){if(e=Kb(Jn,(n-i0)/1e3*(Y0?0:1)+Number(Oe.get("t")??0),t),ft.scene==="party"){const h=t.w/t.h,u=h>=1?240:Math.round(240*h),d=h>=1?Math.round(240/h):240;for(const f of e)f.mask=Jb(f,u,d,h)}}else if(_i&&ze.readyState>=2&&ze.currentTime!==W1){W1=ze.currentTime;try{e=_i.detect(d4(),n)}catch(h){console.error(h)}}if(e&&Ge.update(e.slice(0,ft.people),n,t),e){let h=null;if(Ua&&ft.faces&&!Jn)try{h=Ua.detect(ze,Ge.tracks,t)}catch(u){console.error(u)}if($T(Ge.tracks,h,t,n,Nh<0?1/30:Math.min(.25,(n-Nh)/1e3)),Nh=n,Jn&&(Oe.get("jaw")||Oe.get("face")))for(const u of Ge.tracks)u.face&&Object.assign(u.face,a5(Oe.get("face"),{jaw:Number(Oe.get("jaw")??0)}))}Wt.ground.update(Ge.tracks,Jn?null:mg.upInCamera(Oo.facing),Math.min(.25,(n-Fh)/1e3));const i=ft.scene==="costume"||ft.partyCostumes!=="off";if(i)for(const h of Ge.tracks)za(vl(h.id),!0);const s=(n-i0)/1e3,r=Math.min(.25,(n-Fh)/1e3);Fh=n;const a=i,o=ft.scene==="party",c=o&&ft.partyCostumes==="behind";Wt.pyramid=o&&ft.pyramid&&ft.partyCostumes!=="off",Wt.hideWearers=c,un.pyramid=ft.pyramid,Wt.setForeground(c?un.foreground:null),un.clones=!Wt.pyramid,Wt.stageLights(ft.scene==="party"&&un.preset.id!=="insitu",s,Ds.env);{const h=Ge.tracks.filter(f=>!f.lost).sort((f,p)=>p.T.z-f.T.z)[0],u=ft.scene==="party"&&un.preset.id==="insitu",d=Wt.stageSpots(u,s,Ds.env,t,h?new C(h.T.x,h.T.y,h.T.z):null);un.setSpots(d,u?1:0),Wt.light.realism=u}Wt.setGrain(!0,s),Wt.sync(a?Ge.tracks:[],vl,s),Wt.googlyOn=ft.googly&&ft.faces,Wt.breathOn=ft.breath&&ft.faces,Wt.faces(Ge.tracks,t,r),Ds.update(r,n),ft.scene==="party"&&(un.subjects=ft.people,un.beat=Ds.env,un.update(Ge.tracks,r,s,t.w/t.h,Wt.ground,t),un.render(Wt.renderer,t.w,t.h)),Wt.render(ze,t,e0),t0&&(t0=!1,Fo.toBlob(h=>h&&vg(h,`costuma-${xg()}.jpg`),"image/jpeg",.92)),Ge.tracks.filter(h=>!h.lost).length&&(n0=n),s4(n-n0>2500?"Step back until your head and hips are in view":""),m4(),kh++,n-Oh>1e3&&(Q0=kh*1e3/(n-Oh),kh=0,Oh=n,yg(),p4())}let Dc=0,X1=!1;function p4(){if(!(Y0||!Ha||Ge.tracks.length===0)&&(Dc=Q0<22?Dc+1:0,!(Dc<3))){if(Dc=0,Wt.opts.pixelRatio>1.01)Wt.opts.pixelRatio=Math.max(1,Wt.opts.pixelRatio-.25);else if(Wt.opts.shadows)Wt.opts.shadows=!1;else return;X1||(X1=!0,Ie("Lowering quality to keep up",1500))}}function m4(){const n=ra.clientWidth,t=ra.clientHeight,e=Math.min(devicePixelRatio||1,2);if(ra.width!==Math.round(n*e)&&(ra.width=Math.round(n*e),ra.height=Math.round(t*e)),Ee.setTransform(e,0,0,e,0,0),Ee.clearRect(0,0,n,t),!ft.debug)return;const i=Wt.cover,s=r=>{let a=(r.x*i.vw-i.ox)*i.s;return i.mirror&&(a=i.cw-a),[a,(r.y*i.vh-i.oy)*i.s]};{const r=Wt.ground,a=tf(),{back:o,side:c}=r.axes(),l=Ge.tracks.filter(f=>!f.lost).sort((f,p)=>p.T.z-f.T.z)[0],h=r.foot(l?new C(l.T.x,l.T.y,l.T.z):new C(0,0,-3)).addScaledVector(o,-1),u=(f,p)=>h.clone().addScaledVector(c,f).addScaledVector(o,p),d=(f,p)=>{if(f.z>-.2||p.z>-.2)return;const[v,g]=s(Sa(f,a)),[m,_]=s(Sa(p,a));Ee.beginPath(),Ee.moveTo(v,g),Ee.lineTo(m,_),Ee.stroke()};Ee.strokeStyle="rgba(125, 252, 255, 0.45)",Ee.lineWidth=1.5;for(let f=-3;f<=3.001;f+=.5)d(u(f,0),u(f,8));for(let f=0;f<=8.001;f+=.5)d(u(-3,f),u(3,f));Ee.fillStyle="#7dfcff",Ee.font="600 12px system-ui",Ee.fillText(`floor: ${r.source}${r.fromFeet?" + feet":""} · camera ${r.cameraHeight.toFixed(2)} m up`,12,i.ch-200)}for(const r of Ge.tracks){Ee.globalAlpha=r.presence,Ee.strokeStyle="#7dfcff",Ee.lineWidth=3;for(const[o,c]of Ng){const l=r.image[o],h=r.image[c];if(Math.min(l.v,h.v)<.4)continue;const[u,d]=s(l),[f,p]=s(h);Ee.beginPath(),Ee.moveTo(u,d),Ee.lineTo(f,p),Ee.stroke()}Ee.fillStyle="#ff8a1f";for(const o of r.image){if(o.v<.4)continue;const[c,l]=s(o);Ee.beginPath(),Ee.arc(c,l,4,0,Math.PI*2),Ee.fill()}const a=Mg(r);Ee.fillStyle="#fff",Ee.font="600 14px system-ui",Ee.fillText(`#${r.id} ${Gi(vl(r.id)).name} · ${(-r.T.z).toFixed(1)} m`,a.x-40,a.y)}Ee.globalAlpha=1}function yg(){const n=$t("readout");if(!n||$t("settings").classList.contains("hidden"))return;const t=tf();n.textContent=["build 538f1a9 · 2026-10-31 23:50Z",`${Q0.toFixed(0)} fps · pose ${_i?.inferMs.toFixed(1)??"–"} ms (${_i?.delegate??"–"}, ${ft.model}) · face ${Ua?Ua.inferMs.toFixed(1)+" ms":ft.faces?"loading":"off"}`,`video ${ze.videoWidth}×${ze.videoHeight} · f ${t.f.toFixed(0)} px · ${Oo.facing}`,`people ${Ge.tracks.filter(e=>!e.lost).length} · dressed ${Wt.count}`,...Ge.tracks.filter(e=>!e.lost&&e.face).map(e=>{const i=e.face,s=new gn().setFromQuaternion(i.head,"YXZ"),r=a=>Math.round(cr.radToDeg(a));return`face ${e.id}: ${i.read?"read":"pose only"} · trust ${i.trust.toFixed(2)} · head yaw ${r(s.y)} nod ${r(s.x)} tilt ${r(s.z)} · jaw ${i.jaw.toFixed(2)} blink ${i.blinkL.toFixed(2)}/${i.blinkR.toFixed(2)} look ${i.lookX.toFixed(2)},${i.lookY.toFixed(2)}`}),`pixels ×${Wt.opts.pixelRatio.toFixed(2)} · shadows ${Wt.opts.shadows?"on":"off"}`,`face light ${Wt.light.faceConf>.05?`${Wt.light.faceLum.toFixed(3)} from (${Wt.light.faceDir.x.toFixed(2)}, ${Wt.light.faceDir.y.toFixed(2)}) ×${Wt.light.faceConf.toFixed(2)}`:"—"}`,`light mean ${Wt.light.mean.toFixed(3)} × ${Wt.light.gain.toFixed(2)} · key share ${Wt.light.share.toFixed(2)} · every ${ai.every} frames`].join(`
`)}async function g4(){if(Jn)return;const n=_i,t=new $1(ft.model,ft.people);t.masks=ft.scene==="party",await t.load(e=>Ie(e,2500)),_i=t,n?.close(),Ie(ft.model==="full"?"Accurate pose model":"Fast pose model",1e3)}async function ef(){if(Ua||Jn||!ft.faces)return;const n=new HT;try{await n.load(),Ua=n}catch(t){console.warn("face model failed",t)}}function v4(){const n=document.createElement("canvas");n.width=720,n.height=1280;const t=n.getContext("2d"),e=()=>{const i=t.createLinearGradient(0,0,0,1280);i.addColorStop(0,"#5a4a63"),i.addColorStop(.62,"#3b3142"),i.addColorStop(.63,"#6b5440"),i.addColorStop(1,"#3a2c22"),t.fillStyle=i,t.fillRect(0,0,720,1280),t.fillStyle="#fff3d6",t.fillRect(40,220,170,330),t.fillStyle="#ffb35a",t.beginPath(),t.arc(600,180,46,0,Math.PI*2),t.fill()};return e(),setInterval(e,500),n.captureStream(30)}async function Bh(){const n=$t("start-status"),t=$t("btn-start");t.disabled=!0;const e=Jn?Promise.resolve(!1):mg.enable();try{if(Jn)ze.srcObject=v4(),await ze.play().catch(()=>{}),ze.readyState<2&&await new Promise(s=>ze.addEventListener("loadeddata",s,{once:!0}));else{if(!navigator.mediaDevices?.getUserMedia)throw new Error(location.protocol!=="https:"?"The camera needs an https:// page.":"This browser has no camera access.");n.textContent="Asking for the camera…",await Oo.open(),n.textContent="Loading the pose model…",_i=new $1(ft.model,ft.people),_i.masks=ft.scene==="party",await _i.load(s=>{n.textContent=s[0].toUpperCase()+s.slice(1)+"…"})}Wt.setVideo(ze),n.textContent=`Dressing up as ${Gi(ft.costume).name}…`,await new Promise(s=>setTimeout(s,30));const i=ft.mode==="one"?ft.costume:Wi[0].id;await Wt.prepare(i,!0);for(const s of wr())Wt.prepare(s.id);ef(),$t("start").classList.add("hidden"),$t("hud").classList.remove("hidden"),Qu(ft.scene),Ha=!0,i0=performance.now(),n0=performance.now(),Ho()}catch(i){console.error(i);const s=i;n.textContent=s.name==="NotAllowedError"?"Camera permission was refused. Allow it in the browser settings and try again.":`Could not start: ${s.message}`,t.disabled=!1}}function x4(){$t("btn-pyramid").innerHTML=is.pyramid;const n=()=>$t("btn-pyramid").setAttribute("aria-pressed",String(ft.pyramid));n(),$t("btn-pyramid").onclick=()=>{ft.pyramid=!ft.pyramid,ti(),n(),Ie(ft.pyramid?"Dance pyramid":"No pyramid",800)},$t("btn-googly").innerHTML=is.googly;const t=()=>$t("btn-googly").setAttribute("aria-pressed",String(ft.googly));t(),$t("btn-googly").onclick=()=>{ft.googly=!ft.googly,ft.googly&&!ft.faces&&(ft.faces=!0,ef()),ti(),t(),Ie(ft.googly?"Googly eyes":"No googly eyes",800)},$t("btn-qr").innerHTML=is.qr,$t("btn-flip").innerHTML=is.flip,$t("btn-gear").innerHTML=is.gear,$t("btn-snap").innerHTML=is.camera,$t("btn-rec").innerHTML=is.rec,$t("btn-start").onclick=()=>void Bh(),$t("btn-start-qr").onclick=z1,$t("btn-qr").onclick=z1,$t("btn-gear").onclick=()=>{c4(),Cl("settings"),yg()},$t("btn-flip").onclick=async()=>{Jn||V1(async()=>{try{await Oo.flip(),Wt.setVideo(ze),Ge.clear(),Va.clear(),os.clear()}catch(s){Ie(`Camera: ${s.message}`)}})},$t("btn-snap").onclick=()=>{t0=!0;const s=$t("stage");s.style.filter="brightness(1.8)",setTimeout(()=>s.style.filter="",120)},$t("btn-rec").onclick=l4;for(const s of document.querySelectorAll(".modes button"))s.onclick=()=>{s.dataset.scene!==ft.scene&&V1(()=>Qu(s.dataset.scene))};const e=$t("start-cast");for(const s of wr().slice(0,6)){const r=new Image;r.src=Z0(s.id),r.alt=s.name,r.onerror=()=>r.remove(),e.appendChild(r)}K0(),r4($t("picker")),requestAnimationFrame(bg);const i=window;i.__costuma={stage:Wt,tracker:Ge,settings:ft,start:Bh,choose:gg,party:un,beat:Ds,setScene:Qu,chooseEffect:J0,get started(){return Ha},get frame(){return e0},LIGHT_TUNE:ai},Y0&&Jn&&Bh()}x4();
