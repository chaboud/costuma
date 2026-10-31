(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))n(r);new MutationObserver(r=>{for(const s of r)if(s.type==="childList")for(const a of s.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&n(a)}).observe(document,{childList:!0,subtree:!0});function e(r){const s={};return r.integrity&&(s.integrity=r.integrity),r.referrerPolicy&&(s.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?s.credentials="include":r.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function n(r){if(r.ep)return;r.ep=!0;const s=e(r);fetch(r.href,s)}})();const zu=()=>/iPad|iPhone|iPod/.test(navigator.userAgent)||navigator.platform==="MacIntel"&&navigator.maxTouchPoints>1,Hu=()=>zu()||/Android|Mobile/i.test(navigator.userAgent);let Vu=class{constructor(t,e){this.video=t,this.facing=e??(Hu()?"environment":"user"),t.muted=!0,t.playsInline=!0,t.autoplay=!0,t.setAttribute("playsinline",""),t.setAttribute("muted","")}stream=null;facing;async open(t=this.facing){const e=!!this.stream;this.stop(),e&&await new Promise(r=>setTimeout(r,100));const n={facingMode:t,width:{ideal:1280},height:{ideal:720},frameRate:{ideal:30}};this.stream=await navigator.mediaDevices.getUserMedia({audio:!1,video:n}),this.facing=t,this.video.srcObject=this.stream,await this.video.play().catch(()=>{}),this.video.readyState<2&&await new Promise(r=>this.video.addEventListener("loadeddata",()=>r(),{once:!0}))}async flip(){await this.open(this.facing==="user"?"environment":"user")}get mirrored(){return this.facing==="user"}stop(){if(this.stream){for(const t of this.stream.getTracks())t.stop();this.video.srcObject=null,this.stream=null}}};const Gu="modulepreload",Wu=function(i,t){return new URL(i,t).href},Ac={},Xu=function(t,e,n){let r=Promise.resolve();if(e&&e.length>0){let a=function(h){return Promise.all(h.map(u=>Promise.resolve(u).then(d=>({status:"fulfilled",value:d}),d=>({status:"rejected",reason:d}))))};const o=document.getElementsByTagName("link"),c=document.querySelector("meta[property=csp-nonce]"),l=c?.nonce||c?.getAttribute("nonce");r=a(e.map(h=>{if(h=Wu(h,n),h in Ac)return;Ac[h]=!0;const u=h.endsWith(".css"),d=u?'[rel="stylesheet"]':"";if(!!n)for(let x=o.length-1;x>=0;x--){const g=o[x];if(g.href===h&&(!u||g.rel==="stylesheet"))return}else if(document.querySelector(`link[href="${h}"]${d}`))return;const m=document.createElement("link");if(m.rel=u?"stylesheet":Gu,u||(m.as="script"),m.crossOrigin="",m.href=h,l&&m.setAttribute("nonce",l),document.head.appendChild(m),u)return new Promise((x,g)=>{m.addEventListener("load",x),m.addEventListener("error",()=>g(new Error(`Unable to preload CSS for ${h}`)))})}))}function s(a){const o=new Event("vite:preloadError",{cancelable:!0});if(o.payload=a,window.dispatchEvent(o),!o.defaultPrevented)throw a}return r.then(a=>{for(const o of a||[])o.status==="rejected"&&s(o.reason);return t().catch(s)})},X={nose:0,eyeInL:1,eyeL:2,eyeOutL:3,eyeInR:4,eyeR:5,eyeOutR:6,earL:7,earR:8,mouthL:9,mouthR:10,shL:11,shR:12,elL:13,elR:14,wrL:15,wrR:16,pinkyL:17,pinkyR:18,indexL:19,indexR:20,thumbL:21,thumbR:22,hipL:23,hipR:24,knL:25,knR:26,anL:27,anR:28,heelL:29,heelR:30,toeL:31,toeR:32},ja=33;function qu(i){return{x:i.x,y:-i.y,z:-i.z,v:i.visibility??1}}const Yu=[[X.shL,X.shR],[X.shL,X.elL],[X.elL,X.wrL],[X.shR,X.elR],[X.elR,X.wrR],[X.shL,X.hipL],[X.shR,X.hipR],[X.hipL,X.hipR],[X.hipL,X.knL],[X.knL,X.anL],[X.hipR,X.knR],[X.knR,X.anR],[X.anL,X.toeL],[X.anR,X.toeR],[X.earL,X.eyeL],[X.eyeL,X.nose],[X.nose,X.eyeR],[X.eyeR,X.earR]];class uh{constructor(t,e){this.model=t,this.numPoses=e}lm=null;lastTs=-1;delegate="GPU";inferMs=0;async load(t){t?.("loading the pose engine");const n=await Xu(()=>import("./vision_bundle-Bk4VIwNi.js"),[],import.meta.url),r=await n.FilesetResolver.forVisionTasks("./mediapipe"),s=a=>n.PoseLandmarker.createFromOptions(r,{baseOptions:{modelAssetPath:`./models/pose_landmarker_${this.model}.task`,delegate:a},runningMode:"VIDEO",numPoses:this.numPoses,minPoseDetectionConfidence:.5,minPosePresenceConfidence:.5,minTrackingConfidence:.5});t?.(`loading the ${this.model} pose model`);try{this.lm=await s("GPU"),this.delegate="GPU"}catch(a){console.warn("GPU delegate failed, using CPU",a),this.lm=await s("CPU"),this.delegate="CPU"}}async setOptions(t){t.numPoses&&(this.numPoses=t.numPoses,await this.lm?.setOptions({numPoses:t.numPoses}))}detect(t,e){if(!this.lm)return[];e<=this.lastTs&&(e=this.lastTs+1),this.lastTs=e;const n=performance.now(),r=this.lm.detectForVideo(t,e);this.inferMs=performance.now()-n;const s=[];for(let a=0;a<r.landmarks.length;a++){const o=r.landmarks[a],c=r.worldLandmarks[a];c&&s.push({image:o.map(l=>({x:l.x,y:l.y,z:l.z,v:l.visibility??1})),world:c.map(qu)})}return s}close(){this.lm?.close(),this.lm=null}}function $u(i,t,e=.85){return{f:e*Math.max(i,t),cx:i/2,cy:t/2,w:i,h:t}}function Ju(i,t,e,n=.5){let r=0,s=0,a=0,o=0,c=0,l=0,h=0,u=0,d=0;for(let T=0;T<i.length&&T<t.length;T++){const y=i[T],M=t[T],w=Math.min(y.v,M.v);if(w<n)continue;const E=(M.x*e.w-e.cx)/e.f,A=(e.cy-M.y*e.h)/e.f,C=-E*y.z-y.x,v=-A*y.z-y.y;r+=w,s+=w*E,c+=w*E*E,l+=w*C,u+=w*E*C,a+=w,o+=w*A,c+=w*A*A,h+=w*v,u+=w*A*v,d++}if(d<4)return null;const f=c-s*s/r-o*o/a,m=u-s*l/r-o*h/a;if(Math.abs(f)<1e-9)return null;const x=m/f,g=(l-s*x)/r,p=(h-o*x)/a;return!(x<-.2)||!isFinite(g)||!isFinite(p)?null:{x:g,y:p,z:x}}function Zu(i,t){const e=-i.z;return{x:(t.cx+t.f*i.x/e)/t.w,y:(t.cy-t.f*i.y/e)/t.h}}const ss=(i,t)=>({x:(i.x+t.x)/2,y:(i.y+t.y)/2,z:(i.z+t.z)/2,v:Math.min(i.v,t.v)}),Sn=(i,t)=>Math.hypot(i.x-t.x,i.y-t.y,i.z-t.z);function Rc(i){const t=Sn(ss(i[X.shL],i[X.shR]),ss(i[X.hipL],i[X.hipR])),e=(Sn(i[X.shL],i[X.elL])+Sn(i[X.shR],i[X.elR]))/2,n=(Sn(i[X.elL],i[X.wrL])+Sn(i[X.elR],i[X.wrR]))/2,r=(Sn(i[X.hipL],i[X.knL])+Sn(i[X.hipR],i[X.knR]))/2,s=(Sn(i[X.knL],i[X.anL])+Sn(i[X.knR],i[X.anR]))/2,a=Sn(ss(i[X.shL],i[X.shR]),ss(i[X.earL],i[X.earR]));return{torso:t,upperArm:e,forearm:n,thigh:r,shin:s,neck:a}}const Dn={tauWorld:.045,tauImage:.035,tauXY:.05,tauZ:.14,tauLen:1.5,fadeIn:.22,fadeOut:.35,forgetAfter:.6,matchRadius:1.3},Cc=i=>{const t=[X.shL,X.shR,X.hipL,X.hipR];let e=0,n=0,r=0;for(const c of t){const l=i[c];e+=l.x,n+=l.y,r++}e/=r,n/=r;const s=(i[X.shL].x+i[X.shR].x)/2-(i[X.hipL].x+i[X.hipR].x)/2,a=(i[X.shL].y+i[X.shR].y)/2-(i[X.hipL].y+i[X.hipR].y)/2,o=Math.hypot(i[X.shL].x-i[X.shR].x,i[X.shL].y-i[X.shR].y);return{x:e,y:n,s:Math.max(Math.hypot(s,a),o,.04)}},ii=(i,t,e)=>i+(t-i)*e,Er=(i,t)=>1-Math.exp(-i/Math.max(t,1e-4));function Lc(i,t,e){for(let n=0;n<ja;n++){const r=i[n],s=t[n];r.x=ii(r.x,s.x,e),r.y=ii(r.y,s.y,e),r.z=ii(r.z,s.z,e),r.v=ii(r.v,s.v,Math.min(1,e*1.5))}}const Pc=i=>i.map(t=>({...t}));class Ku{tracks=[];nextId=1;last=-1;update(t,e,n){const r=this.last<0?.03333333333333333:Math.min(.25,Math.max(.001,(e-this.last)/1e3));this.last=e;const s=t.map(h=>({d:h,T:Ju(h.world,h.image,n),c:Cc(h.image)})).filter(h=>h.T),a=this.tracks.filter(h=>!h.lost||h.presence>0),o=[];a.forEach((h,u)=>{const d=Cc(h.image);s.forEach((f,m)=>{const x=Math.hypot(d.x-f.c.x,d.y-f.c.y)/d.s;x<Dn.matchRadius&&o.push({ti:u,di:m,cost:x})})}),o.sort((h,u)=>h.cost-u.cost);const c=new Set,l=new Set;for(const h of o){if(c.has(h.ti)||l.has(h.di))continue;c.add(h.ti),l.add(h.di);const u=a[h.ti],d=s[h.di],f=u.lost;Lc(u.world,d.d.world,f?1:Er(r,Dn.tauWorld)),Lc(u.image,d.d.image,f?1:Er(r,Dn.tauImage));const m=f?1:Er(r,Dn.tauXY),x=f?1:Er(r,Dn.tauZ);u.T={x:ii(u.T.x,d.T.x,m),y:ii(u.T.y,d.T.y,m),z:ii(u.T.z,d.T.z,x)};const g=Rc(u.world),p=Er(r,Dn.tauLen);for(const T of Object.keys(g))u.len[T]=ii(u.len[T],g[T],p);u.seen=e,u.lost=!1}s.forEach((h,u)=>{if(l.has(u))return;const d=Pc(h.d.world);this.tracks.push({id:this.nextId++,born:e,seen:e,image:Pc(h.d.image),world:d,T:{...h.T},len:Rc(d),presence:0,lost:!1})});for(const h of this.tracks)h.seen!==e&&(h.lost=!0),h.presence=h.lost?Math.max(0,h.presence-r/Dn.fadeOut):Math.min(1,h.presence+r/Dn.fadeIn);return this.tracks=this.tracks.filter(h=>!(h.lost&&h.presence<=0&&e-h.seen>Dn.forgetAfter*1e3)),this.tracks}clear(){this.tracks=[],this.last=-1}}/**
 * @license
 * Copyright 2010-2025 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const $o="180",ju=0,Dc=1,Qu=2,fh=1,dh=2,Bn=3,ci=0,$e=1,Tn=2,ri=0,cr=1,Ic=2,Uc=3,Nc=4,tf=5,Si=100,ef=101,nf=102,rf=103,sf=104,af=200,of=201,cf=202,lf=203,Qa=204,to=205,hf=206,uf=207,ff=208,df=209,pf=210,mf=211,gf=212,vf=213,_f=214,eo=0,no=1,io=2,fr=3,ro=4,so=5,ao=6,oo=7,ph=0,xf=1,Mf=2,si=0,Sf=1,yf=2,bf=3,Ef=4,Tf=5,wf=6,mh=7,Fc="attached",Af="detached",gh=300,dr=301,pr=302,Xs=303,co=304,Qs=306,Hr=1e3,Ti=1001,lo=1002,en=1003,Rf=1004,as=1005,Fe=1006,ca=1007,wi=1008,Cn=1009,vh=1010,_h=1011,Vr=1012,Jo=1013,Di=1014,An=1015,_r=1016,Zo=1017,Ko=1018,Gr=1020,xh=35902,Mh=35899,Sh=1021,yh=1022,tn=1023,Wr=1026,Xr=1027,bh=1028,jo=1029,Eh=1030,Qo=1031,tc=1033,ks=33776,zs=33777,Hs=33778,Vs=33779,ho=35840,uo=35841,fo=35842,po=35843,mo=36196,go=37492,vo=37496,_o=37808,xo=37809,Mo=37810,So=37811,yo=37812,bo=37813,Eo=37814,To=37815,wo=37816,Ao=37817,Ro=37818,Co=37819,Lo=37820,Po=37821,Do=36492,Io=36494,Uo=36495,No=36283,Fo=36284,Oo=36285,Bo=36286,Cf=3200,Lf=3201,Th=0,Pf=1,wn="",Qe="srgb",Ii="srgb-linear",qs="linear",ce="srgb",ki=7680,Oc=519,Df=512,If=513,Uf=514,wh=515,Nf=516,Ff=517,Of=518,Bf=519,Bc=35044,os=35048,kc="300 es",Rn=2e3,Ys=2001;class xr{addEventListener(t,e){this._listeners===void 0&&(this._listeners={});const n=this._listeners;n[t]===void 0&&(n[t]=[]),n[t].indexOf(e)===-1&&n[t].push(e)}hasEventListener(t,e){const n=this._listeners;return n===void 0?!1:n[t]!==void 0&&n[t].indexOf(e)!==-1}removeEventListener(t,e){const n=this._listeners;if(n===void 0)return;const r=n[t];if(r!==void 0){const s=r.indexOf(e);s!==-1&&r.splice(s,1)}}dispatchEvent(t){const e=this._listeners;if(e===void 0)return;const n=e[t.type];if(n!==void 0){t.target=this;const r=n.slice(0);for(let s=0,a=r.length;s<a;s++)r[s].call(this,t);t.target=null}}}const Ie=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];let zc=1234567;const Fr=Math.PI/180,qr=180/Math.PI;function hi(){const i=Math.random()*4294967295|0,t=Math.random()*4294967295|0,e=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(Ie[i&255]+Ie[i>>8&255]+Ie[i>>16&255]+Ie[i>>24&255]+"-"+Ie[t&255]+Ie[t>>8&255]+"-"+Ie[t>>16&15|64]+Ie[t>>24&255]+"-"+Ie[e&63|128]+Ie[e>>8&255]+"-"+Ie[e>>16&255]+Ie[e>>24&255]+Ie[n&255]+Ie[n>>8&255]+Ie[n>>16&255]+Ie[n>>24&255]).toLowerCase()}function Qt(i,t,e){return Math.max(t,Math.min(e,i))}function ec(i,t){return(i%t+t)%t}function kf(i,t,e,n,r){return n+(i-t)*(r-n)/(e-t)}function zf(i,t,e){return i!==t?(e-i)/(t-i):0}function Or(i,t,e){return(1-e)*i+e*t}function Hf(i,t,e,n){return Or(i,t,1-Math.exp(-e*n))}function Vf(i,t=1){return t-Math.abs(ec(i,t*2)-t)}function Gf(i,t,e){return i<=t?0:i>=e?1:(i=(i-t)/(e-t),i*i*(3-2*i))}function Wf(i,t,e){return i<=t?0:i>=e?1:(i=(i-t)/(e-t),i*i*i*(i*(i*6-15)+10))}function Xf(i,t){return i+Math.floor(Math.random()*(t-i+1))}function qf(i,t){return i+Math.random()*(t-i)}function Yf(i){return i*(.5-Math.random())}function $f(i){i!==void 0&&(zc=i);let t=zc+=1831565813;return t=Math.imul(t^t>>>15,t|1),t^=t+Math.imul(t^t>>>7,t|61),((t^t>>>14)>>>0)/4294967296}function Jf(i){return i*Fr}function Zf(i){return i*qr}function Kf(i){return(i&i-1)===0&&i!==0}function jf(i){return Math.pow(2,Math.ceil(Math.log(i)/Math.LN2))}function Qf(i){return Math.pow(2,Math.floor(Math.log(i)/Math.LN2))}function td(i,t,e,n,r){const s=Math.cos,a=Math.sin,o=s(e/2),c=a(e/2),l=s((t+n)/2),h=a((t+n)/2),u=s((t-n)/2),d=a((t-n)/2),f=s((n-t)/2),m=a((n-t)/2);switch(r){case"XYX":i.set(o*h,c*u,c*d,o*l);break;case"YZY":i.set(c*d,o*h,c*u,o*l);break;case"ZXZ":i.set(c*u,c*d,o*h,o*l);break;case"XZX":i.set(o*h,c*m,c*f,o*l);break;case"YXY":i.set(c*f,o*h,c*m,o*l);break;case"ZYZ":i.set(c*m,c*f,o*h,o*l);break;default:console.warn("THREE.MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+r)}}function nr(i,t){switch(t.constructor){case Float32Array:return i;case Uint32Array:return i/4294967295;case Uint16Array:return i/65535;case Uint8Array:return i/255;case Int32Array:return Math.max(i/2147483647,-1);case Int16Array:return Math.max(i/32767,-1);case Int8Array:return Math.max(i/127,-1);default:throw new Error("Invalid component type.")}}function ke(i,t){switch(t.constructor){case Float32Array:return i;case Uint32Array:return Math.round(i*4294967295);case Uint16Array:return Math.round(i*65535);case Uint8Array:return Math.round(i*255);case Int32Array:return Math.round(i*2147483647);case Int16Array:return Math.round(i*32767);case Int8Array:return Math.round(i*127);default:throw new Error("Invalid component type.")}}const ed={DEG2RAD:Fr,RAD2DEG:qr,generateUUID:hi,clamp:Qt,euclideanModulo:ec,mapLinear:kf,inverseLerp:zf,lerp:Or,damp:Hf,pingpong:Vf,smoothstep:Gf,smootherstep:Wf,randInt:Xf,randFloat:qf,randFloatSpread:Yf,seededRandom:$f,degToRad:Jf,radToDeg:Zf,isPowerOfTwo:Kf,ceilPowerOfTwo:jf,floorPowerOfTwo:Qf,setQuaternionFromProperEuler:td,normalize:ke,denormalize:nr};class St{constructor(t=0,e=0){St.prototype.isVector2=!0,this.x=t,this.y=e}get width(){return this.x}set width(t){this.x=t}get height(){return this.y}set height(t){this.y=t}set(t,e){return this.x=t,this.y=e,this}setScalar(t){return this.x=t,this.y=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y)}copy(t){return this.x=t.x,this.y=t.y,this}add(t){return this.x+=t.x,this.y+=t.y,this}addScalar(t){return this.x+=t,this.y+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this}subScalar(t){return this.x-=t,this.y-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this}multiply(t){return this.x*=t.x,this.y*=t.y,this}multiplyScalar(t){return this.x*=t,this.y*=t,this}divide(t){return this.x/=t.x,this.y/=t.y,this}divideScalar(t){return this.multiplyScalar(1/t)}applyMatrix3(t){const e=this.x,n=this.y,r=t.elements;return this.x=r[0]*e+r[3]*n+r[6],this.y=r[1]*e+r[4]*n+r[7],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this}clamp(t,e){return this.x=Qt(this.x,t.x,e.x),this.y=Qt(this.y,t.y,e.y),this}clampScalar(t,e){return this.x=Qt(this.x,t,e),this.y=Qt(this.y,t,e),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Qt(n,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(t){return this.x*t.x+this.y*t.y}cross(t){return this.x*t.y-this.y*t.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const n=this.dot(t)/e;return Math.acos(Qt(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,n=this.y-t.y;return e*e+n*n}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this}equals(t){return t.x===this.x&&t.y===this.y}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this}rotateAround(t,e){const n=Math.cos(e),r=Math.sin(e),s=this.x-t.x,a=this.y-t.y;return this.x=s*n-a*r+t.x,this.y=s*r+a*n+t.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class We{constructor(t=0,e=0,n=0,r=1){this.isQuaternion=!0,this._x=t,this._y=e,this._z=n,this._w=r}static slerpFlat(t,e,n,r,s,a,o){let c=n[r+0],l=n[r+1],h=n[r+2],u=n[r+3];const d=s[a+0],f=s[a+1],m=s[a+2],x=s[a+3];if(o===0){t[e+0]=c,t[e+1]=l,t[e+2]=h,t[e+3]=u;return}if(o===1){t[e+0]=d,t[e+1]=f,t[e+2]=m,t[e+3]=x;return}if(u!==x||c!==d||l!==f||h!==m){let g=1-o;const p=c*d+l*f+h*m+u*x,T=p>=0?1:-1,y=1-p*p;if(y>Number.EPSILON){const w=Math.sqrt(y),E=Math.atan2(w,p*T);g=Math.sin(g*E)/w,o=Math.sin(o*E)/w}const M=o*T;if(c=c*g+d*M,l=l*g+f*M,h=h*g+m*M,u=u*g+x*M,g===1-o){const w=1/Math.sqrt(c*c+l*l+h*h+u*u);c*=w,l*=w,h*=w,u*=w}}t[e]=c,t[e+1]=l,t[e+2]=h,t[e+3]=u}static multiplyQuaternionsFlat(t,e,n,r,s,a){const o=n[r],c=n[r+1],l=n[r+2],h=n[r+3],u=s[a],d=s[a+1],f=s[a+2],m=s[a+3];return t[e]=o*m+h*u+c*f-l*d,t[e+1]=c*m+h*d+l*u-o*f,t[e+2]=l*m+h*f+o*d-c*u,t[e+3]=h*m-o*u-c*d-l*f,t}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get w(){return this._w}set w(t){this._w=t,this._onChangeCallback()}set(t,e,n,r){return this._x=t,this._y=e,this._z=n,this._w=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(t){return this._x=t.x,this._y=t.y,this._z=t.z,this._w=t.w,this._onChangeCallback(),this}setFromEuler(t,e=!0){const n=t._x,r=t._y,s=t._z,a=t._order,o=Math.cos,c=Math.sin,l=o(n/2),h=o(r/2),u=o(s/2),d=c(n/2),f=c(r/2),m=c(s/2);switch(a){case"XYZ":this._x=d*h*u+l*f*m,this._y=l*f*u-d*h*m,this._z=l*h*m+d*f*u,this._w=l*h*u-d*f*m;break;case"YXZ":this._x=d*h*u+l*f*m,this._y=l*f*u-d*h*m,this._z=l*h*m-d*f*u,this._w=l*h*u+d*f*m;break;case"ZXY":this._x=d*h*u-l*f*m,this._y=l*f*u+d*h*m,this._z=l*h*m+d*f*u,this._w=l*h*u-d*f*m;break;case"ZYX":this._x=d*h*u-l*f*m,this._y=l*f*u+d*h*m,this._z=l*h*m-d*f*u,this._w=l*h*u+d*f*m;break;case"YZX":this._x=d*h*u+l*f*m,this._y=l*f*u+d*h*m,this._z=l*h*m-d*f*u,this._w=l*h*u-d*f*m;break;case"XZY":this._x=d*h*u-l*f*m,this._y=l*f*u-d*h*m,this._z=l*h*m+d*f*u,this._w=l*h*u+d*f*m;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+a)}return e===!0&&this._onChangeCallback(),this}setFromAxisAngle(t,e){const n=e/2,r=Math.sin(n);return this._x=t.x*r,this._y=t.y*r,this._z=t.z*r,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(t){const e=t.elements,n=e[0],r=e[4],s=e[8],a=e[1],o=e[5],c=e[9],l=e[2],h=e[6],u=e[10],d=n+o+u;if(d>0){const f=.5/Math.sqrt(d+1);this._w=.25/f,this._x=(h-c)*f,this._y=(s-l)*f,this._z=(a-r)*f}else if(n>o&&n>u){const f=2*Math.sqrt(1+n-o-u);this._w=(h-c)/f,this._x=.25*f,this._y=(r+a)/f,this._z=(s+l)/f}else if(o>u){const f=2*Math.sqrt(1+o-n-u);this._w=(s-l)/f,this._x=(r+a)/f,this._y=.25*f,this._z=(c+h)/f}else{const f=2*Math.sqrt(1+u-n-o);this._w=(a-r)/f,this._x=(s+l)/f,this._y=(c+h)/f,this._z=.25*f}return this._onChangeCallback(),this}setFromUnitVectors(t,e){let n=t.dot(e)+1;return n<1e-8?(n=0,Math.abs(t.x)>Math.abs(t.z)?(this._x=-t.y,this._y=t.x,this._z=0,this._w=n):(this._x=0,this._y=-t.z,this._z=t.y,this._w=n)):(this._x=t.y*e.z-t.z*e.y,this._y=t.z*e.x-t.x*e.z,this._z=t.x*e.y-t.y*e.x,this._w=n),this.normalize()}angleTo(t){return 2*Math.acos(Math.abs(Qt(this.dot(t),-1,1)))}rotateTowards(t,e){const n=this.angleTo(t);if(n===0)return this;const r=Math.min(1,e/n);return this.slerp(t,r),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(t){return this._x*t._x+this._y*t._y+this._z*t._z+this._w*t._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let t=this.length();return t===0?(this._x=0,this._y=0,this._z=0,this._w=1):(t=1/t,this._x=this._x*t,this._y=this._y*t,this._z=this._z*t,this._w=this._w*t),this._onChangeCallback(),this}multiply(t){return this.multiplyQuaternions(this,t)}premultiply(t){return this.multiplyQuaternions(t,this)}multiplyQuaternions(t,e){const n=t._x,r=t._y,s=t._z,a=t._w,o=e._x,c=e._y,l=e._z,h=e._w;return this._x=n*h+a*o+r*l-s*c,this._y=r*h+a*c+s*o-n*l,this._z=s*h+a*l+n*c-r*o,this._w=a*h-n*o-r*c-s*l,this._onChangeCallback(),this}slerp(t,e){if(e===0)return this;if(e===1)return this.copy(t);const n=this._x,r=this._y,s=this._z,a=this._w;let o=a*t._w+n*t._x+r*t._y+s*t._z;if(o<0?(this._w=-t._w,this._x=-t._x,this._y=-t._y,this._z=-t._z,o=-o):this.copy(t),o>=1)return this._w=a,this._x=n,this._y=r,this._z=s,this;const c=1-o*o;if(c<=Number.EPSILON){const f=1-e;return this._w=f*a+e*this._w,this._x=f*n+e*this._x,this._y=f*r+e*this._y,this._z=f*s+e*this._z,this.normalize(),this}const l=Math.sqrt(c),h=Math.atan2(l,o),u=Math.sin((1-e)*h)/l,d=Math.sin(e*h)/l;return this._w=a*u+this._w*d,this._x=n*u+this._x*d,this._y=r*u+this._y*d,this._z=s*u+this._z*d,this._onChangeCallback(),this}slerpQuaternions(t,e,n){return this.copy(t).slerp(e,n)}random(){const t=2*Math.PI*Math.random(),e=2*Math.PI*Math.random(),n=Math.random(),r=Math.sqrt(1-n),s=Math.sqrt(n);return this.set(r*Math.sin(t),r*Math.cos(t),s*Math.sin(e),s*Math.cos(e))}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._w===this._w}fromArray(t,e=0){return this._x=t[e],this._y=t[e+1],this._z=t[e+2],this._w=t[e+3],this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._w,t}fromBufferAttribute(t,e){return this._x=t.getX(e),this._y=t.getY(e),this._z=t.getZ(e),this._w=t.getW(e),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class O{constructor(t=0,e=0,n=0){O.prototype.isVector3=!0,this.x=t,this.y=e,this.z=n}set(t,e,n){return n===void 0&&(n=this.z),this.x=t,this.y=e,this.z=n,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this}multiplyVectors(t,e){return this.x=t.x*e.x,this.y=t.y*e.y,this.z=t.z*e.z,this}applyEuler(t){return this.applyQuaternion(Hc.setFromEuler(t))}applyAxisAngle(t,e){return this.applyQuaternion(Hc.setFromAxisAngle(t,e))}applyMatrix3(t){const e=this.x,n=this.y,r=this.z,s=t.elements;return this.x=s[0]*e+s[3]*n+s[6]*r,this.y=s[1]*e+s[4]*n+s[7]*r,this.z=s[2]*e+s[5]*n+s[8]*r,this}applyNormalMatrix(t){return this.applyMatrix3(t).normalize()}applyMatrix4(t){const e=this.x,n=this.y,r=this.z,s=t.elements,a=1/(s[3]*e+s[7]*n+s[11]*r+s[15]);return this.x=(s[0]*e+s[4]*n+s[8]*r+s[12])*a,this.y=(s[1]*e+s[5]*n+s[9]*r+s[13])*a,this.z=(s[2]*e+s[6]*n+s[10]*r+s[14])*a,this}applyQuaternion(t){const e=this.x,n=this.y,r=this.z,s=t.x,a=t.y,o=t.z,c=t.w,l=2*(a*r-o*n),h=2*(o*e-s*r),u=2*(s*n-a*e);return this.x=e+c*l+a*u-o*h,this.y=n+c*h+o*l-s*u,this.z=r+c*u+s*h-a*l,this}project(t){return this.applyMatrix4(t.matrixWorldInverse).applyMatrix4(t.projectionMatrix)}unproject(t){return this.applyMatrix4(t.projectionMatrixInverse).applyMatrix4(t.matrixWorld)}transformDirection(t){const e=this.x,n=this.y,r=this.z,s=t.elements;return this.x=s[0]*e+s[4]*n+s[8]*r,this.y=s[1]*e+s[5]*n+s[9]*r,this.z=s[2]*e+s[6]*n+s[10]*r,this.normalize()}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this}divideScalar(t){return this.multiplyScalar(1/t)}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this}clamp(t,e){return this.x=Qt(this.x,t.x,e.x),this.y=Qt(this.y,t.y,e.y),this.z=Qt(this.z,t.z,e.z),this}clampScalar(t,e){return this.x=Qt(this.x,t,e),this.y=Qt(this.y,t,e),this.z=Qt(this.z,t,e),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Qt(n,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this}cross(t){return this.crossVectors(this,t)}crossVectors(t,e){const n=t.x,r=t.y,s=t.z,a=e.x,o=e.y,c=e.z;return this.x=r*c-s*o,this.y=s*a-n*c,this.z=n*o-r*a,this}projectOnVector(t){const e=t.lengthSq();if(e===0)return this.set(0,0,0);const n=t.dot(this)/e;return this.copy(t).multiplyScalar(n)}projectOnPlane(t){return la.copy(this).projectOnVector(t),this.sub(la)}reflect(t){return this.sub(la.copy(t).multiplyScalar(2*this.dot(t)))}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const n=this.dot(t)/e;return Math.acos(Qt(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,n=this.y-t.y,r=this.z-t.z;return e*e+n*n+r*r}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)+Math.abs(this.z-t.z)}setFromSpherical(t){return this.setFromSphericalCoords(t.radius,t.phi,t.theta)}setFromSphericalCoords(t,e,n){const r=Math.sin(e)*t;return this.x=r*Math.sin(n),this.y=Math.cos(e)*t,this.z=r*Math.cos(n),this}setFromCylindrical(t){return this.setFromCylindricalCoords(t.radius,t.theta,t.y)}setFromCylindricalCoords(t,e,n){return this.x=t*Math.sin(e),this.y=n,this.z=t*Math.cos(e),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this}setFromMatrixScale(t){const e=this.setFromMatrixColumn(t,0).length(),n=this.setFromMatrixColumn(t,1).length(),r=this.setFromMatrixColumn(t,2).length();return this.x=e,this.y=n,this.z=r,this}setFromMatrixColumn(t,e){return this.fromArray(t.elements,e*4)}setFromMatrix3Column(t,e){return this.fromArray(t.elements,e*3)}setFromEuler(t){return this.x=t._x,this.y=t._y,this.z=t._z,this}setFromColor(t){return this.x=t.r,this.y=t.g,this.z=t.b,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const t=Math.random()*Math.PI*2,e=Math.random()*2-1,n=Math.sqrt(1-e*e);return this.x=n*Math.cos(t),this.y=e,this.z=n*Math.sin(t),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const la=new O,Hc=new We;class Kt{constructor(t,e,n,r,s,a,o,c,l){Kt.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],t!==void 0&&this.set(t,e,n,r,s,a,o,c,l)}set(t,e,n,r,s,a,o,c,l){const h=this.elements;return h[0]=t,h[1]=r,h[2]=o,h[3]=e,h[4]=s,h[5]=c,h[6]=n,h[7]=a,h[8]=l,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(t){const e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],this}extractBasis(t,e,n){return t.setFromMatrix3Column(this,0),e.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(t){const e=t.elements;return this.set(e[0],e[4],e[8],e[1],e[5],e[9],e[2],e[6],e[10]),this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const n=t.elements,r=e.elements,s=this.elements,a=n[0],o=n[3],c=n[6],l=n[1],h=n[4],u=n[7],d=n[2],f=n[5],m=n[8],x=r[0],g=r[3],p=r[6],T=r[1],y=r[4],M=r[7],w=r[2],E=r[5],A=r[8];return s[0]=a*x+o*T+c*w,s[3]=a*g+o*y+c*E,s[6]=a*p+o*M+c*A,s[1]=l*x+h*T+u*w,s[4]=l*g+h*y+u*E,s[7]=l*p+h*M+u*A,s[2]=d*x+f*T+m*w,s[5]=d*g+f*y+m*E,s[8]=d*p+f*M+m*A,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[3]*=t,e[6]*=t,e[1]*=t,e[4]*=t,e[7]*=t,e[2]*=t,e[5]*=t,e[8]*=t,this}determinant(){const t=this.elements,e=t[0],n=t[1],r=t[2],s=t[3],a=t[4],o=t[5],c=t[6],l=t[7],h=t[8];return e*a*h-e*o*l-n*s*h+n*o*c+r*s*l-r*a*c}invert(){const t=this.elements,e=t[0],n=t[1],r=t[2],s=t[3],a=t[4],o=t[5],c=t[6],l=t[7],h=t[8],u=h*a-o*l,d=o*c-h*s,f=l*s-a*c,m=e*u+n*d+r*f;if(m===0)return this.set(0,0,0,0,0,0,0,0,0);const x=1/m;return t[0]=u*x,t[1]=(r*l-h*n)*x,t[2]=(o*n-r*a)*x,t[3]=d*x,t[4]=(h*e-r*c)*x,t[5]=(r*s-o*e)*x,t[6]=f*x,t[7]=(n*c-l*e)*x,t[8]=(a*e-n*s)*x,this}transpose(){let t;const e=this.elements;return t=e[1],e[1]=e[3],e[3]=t,t=e[2],e[2]=e[6],e[6]=t,t=e[5],e[5]=e[7],e[7]=t,this}getNormalMatrix(t){return this.setFromMatrix4(t).invert().transpose()}transposeIntoArray(t){const e=this.elements;return t[0]=e[0],t[1]=e[3],t[2]=e[6],t[3]=e[1],t[4]=e[4],t[5]=e[7],t[6]=e[2],t[7]=e[5],t[8]=e[8],this}setUvTransform(t,e,n,r,s,a,o){const c=Math.cos(s),l=Math.sin(s);return this.set(n*c,n*l,-n*(c*a+l*o)+a+t,-r*l,r*c,-r*(-l*a+c*o)+o+e,0,0,1),this}scale(t,e){return this.premultiply(ha.makeScale(t,e)),this}rotate(t){return this.premultiply(ha.makeRotation(-t)),this}translate(t,e){return this.premultiply(ha.makeTranslation(t,e)),this}makeTranslation(t,e){return t.isVector2?this.set(1,0,t.x,0,1,t.y,0,0,1):this.set(1,0,t,0,1,e,0,0,1),this}makeRotation(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,n,e,0,0,0,1),this}makeScale(t,e){return this.set(t,0,0,0,e,0,0,0,1),this}equals(t){const e=this.elements,n=t.elements;for(let r=0;r<9;r++)if(e[r]!==n[r])return!1;return!0}fromArray(t,e=0){for(let n=0;n<9;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){const n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t}clone(){return new this.constructor().fromArray(this.elements)}}const ha=new Kt;function Ah(i){for(let t=i.length-1;t>=0;--t)if(i[t]>=65535)return!0;return!1}function $s(i){return document.createElementNS("http://www.w3.org/1999/xhtml",i)}function nd(){const i=$s("canvas");return i.style.display="block",i}const Vc={};function Yr(i){i in Vc||(Vc[i]=!0,console.warn(i))}function id(i,t,e){return new Promise(function(n,r){function s(){switch(i.clientWaitSync(t,i.SYNC_FLUSH_COMMANDS_BIT,0)){case i.WAIT_FAILED:r();break;case i.TIMEOUT_EXPIRED:setTimeout(s,e);break;default:n()}}setTimeout(s,e)})}const Gc=new Kt().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),Wc=new Kt().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function rd(){const i={enabled:!0,workingColorSpace:Ii,spaces:{},convert:function(r,s,a){return this.enabled===!1||s===a||!s||!a||(this.spaces[s].transfer===ce&&(r.r=Vn(r.r),r.g=Vn(r.g),r.b=Vn(r.b)),this.spaces[s].primaries!==this.spaces[a].primaries&&(r.applyMatrix3(this.spaces[s].toXYZ),r.applyMatrix3(this.spaces[a].fromXYZ)),this.spaces[a].transfer===ce&&(r.r=lr(r.r),r.g=lr(r.g),r.b=lr(r.b))),r},workingToColorSpace:function(r,s){return this.convert(r,this.workingColorSpace,s)},colorSpaceToWorking:function(r,s){return this.convert(r,s,this.workingColorSpace)},getPrimaries:function(r){return this.spaces[r].primaries},getTransfer:function(r){return r===wn?qs:this.spaces[r].transfer},getToneMappingMode:function(r){return this.spaces[r].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(r,s=this.workingColorSpace){return r.fromArray(this.spaces[s].luminanceCoefficients)},define:function(r){Object.assign(this.spaces,r)},_getMatrix:function(r,s,a){return r.copy(this.spaces[s].toXYZ).multiply(this.spaces[a].fromXYZ)},_getDrawingBufferColorSpace:function(r){return this.spaces[r].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(r=this.workingColorSpace){return this.spaces[r].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(r,s){return Yr("THREE.ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),i.workingToColorSpace(r,s)},toWorkingColorSpace:function(r,s){return Yr("THREE.ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),i.colorSpaceToWorking(r,s)}},t=[.64,.33,.3,.6,.15,.06],e=[.2126,.7152,.0722],n=[.3127,.329];return i.define({[Ii]:{primaries:t,whitePoint:n,transfer:qs,toXYZ:Gc,fromXYZ:Wc,luminanceCoefficients:e,workingColorSpaceConfig:{unpackColorSpace:Qe},outputColorSpaceConfig:{drawingBufferColorSpace:Qe}},[Qe]:{primaries:t,whitePoint:n,transfer:ce,toXYZ:Gc,fromXYZ:Wc,luminanceCoefficients:e,outputColorSpaceConfig:{drawingBufferColorSpace:Qe}}}),i}const se=rd();function Vn(i){return i<.04045?i*.0773993808:Math.pow(i*.9478672986+.0521327014,2.4)}function lr(i){return i<.0031308?i*12.92:1.055*Math.pow(i,.41666)-.055}let zi;class sd{static getDataURL(t,e="image/png"){if(/^data:/i.test(t.src)||typeof HTMLCanvasElement>"u")return t.src;let n;if(t instanceof HTMLCanvasElement)n=t;else{zi===void 0&&(zi=$s("canvas")),zi.width=t.width,zi.height=t.height;const r=zi.getContext("2d");t instanceof ImageData?r.putImageData(t,0,0):r.drawImage(t,0,0,t.width,t.height),n=zi}return n.toDataURL(e)}static sRGBToLinear(t){if(typeof HTMLImageElement<"u"&&t instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&t instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&t instanceof ImageBitmap){const e=$s("canvas");e.width=t.width,e.height=t.height;const n=e.getContext("2d");n.drawImage(t,0,0,t.width,t.height);const r=n.getImageData(0,0,t.width,t.height),s=r.data;for(let a=0;a<s.length;a++)s[a]=Vn(s[a]/255)*255;return n.putImageData(r,0,0),e}else if(t.data){const e=t.data.slice(0);for(let n=0;n<e.length;n++)e instanceof Uint8Array||e instanceof Uint8ClampedArray?e[n]=Math.floor(Vn(e[n]/255)*255):e[n]=Vn(e[n]);return{data:e,width:t.width,height:t.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),t}}let ad=0;class nc{constructor(t=null){this.isSource=!0,Object.defineProperty(this,"id",{value:ad++}),this.uuid=hi(),this.data=t,this.dataReady=!0,this.version=0}getSize(t){const e=this.data;return typeof HTMLVideoElement<"u"&&e instanceof HTMLVideoElement?t.set(e.videoWidth,e.videoHeight,0):e instanceof VideoFrame?t.set(e.displayHeight,e.displayWidth,0):e!==null?t.set(e.width,e.height,e.depth||0):t.set(0,0,0),t}set needsUpdate(t){t===!0&&this.version++}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.images[this.uuid]!==void 0)return t.images[this.uuid];const n={uuid:this.uuid,url:""},r=this.data;if(r!==null){let s;if(Array.isArray(r)){s=[];for(let a=0,o=r.length;a<o;a++)r[a].isDataTexture?s.push(ua(r[a].image)):s.push(ua(r[a]))}else s=ua(r);n.url=s}return e||(t.images[this.uuid]=n),n}}function ua(i){return typeof HTMLImageElement<"u"&&i instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&i instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&i instanceof ImageBitmap?sd.getDataURL(i):i.data?{data:Array.from(i.data),width:i.width,height:i.height,type:i.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}let od=0;const fa=new O;class De extends xr{constructor(t=De.DEFAULT_IMAGE,e=De.DEFAULT_MAPPING,n=Ti,r=Ti,s=Fe,a=wi,o=tn,c=Cn,l=De.DEFAULT_ANISOTROPY,h=wn){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:od++}),this.uuid=hi(),this.name="",this.source=new nc(t),this.mipmaps=[],this.mapping=e,this.channel=0,this.wrapS=n,this.wrapT=r,this.magFilter=s,this.minFilter=a,this.anisotropy=l,this.format=o,this.internalFormat=null,this.type=c,this.offset=new St(0,0),this.repeat=new St(1,1),this.center=new St(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Kt,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=h,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(t&&t.depth&&t.depth>1),this.pmremVersion=0}get width(){return this.source.getSize(fa).x}get height(){return this.source.getSize(fa).y}get depth(){return this.source.getSize(fa).z}get image(){return this.source.data}set image(t=null){this.source.data=t}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(t){return this.name=t.name,this.source=t.source,this.mipmaps=t.mipmaps.slice(0),this.mapping=t.mapping,this.channel=t.channel,this.wrapS=t.wrapS,this.wrapT=t.wrapT,this.magFilter=t.magFilter,this.minFilter=t.minFilter,this.anisotropy=t.anisotropy,this.format=t.format,this.internalFormat=t.internalFormat,this.type=t.type,this.offset.copy(t.offset),this.repeat.copy(t.repeat),this.center.copy(t.center),this.rotation=t.rotation,this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrix.copy(t.matrix),this.generateMipmaps=t.generateMipmaps,this.premultiplyAlpha=t.premultiplyAlpha,this.flipY=t.flipY,this.unpackAlignment=t.unpackAlignment,this.colorSpace=t.colorSpace,this.renderTarget=t.renderTarget,this.isRenderTargetTexture=t.isRenderTargetTexture,this.isArrayTexture=t.isArrayTexture,this.userData=JSON.parse(JSON.stringify(t.userData)),this.needsUpdate=!0,this}setValues(t){for(const e in t){const n=t[e];if(n===void 0){console.warn(`THREE.Texture.setValues(): parameter '${e}' has value of undefined.`);continue}const r=this[e];if(r===void 0){console.warn(`THREE.Texture.setValues(): property '${e}' does not exist.`);continue}r&&n&&r.isVector2&&n.isVector2||r&&n&&r.isVector3&&n.isVector3||r&&n&&r.isMatrix3&&n.isMatrix3?r.copy(n):this[e]=n}}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.textures[this.uuid]!==void 0)return t.textures[this.uuid];const n={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(t).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),e||(t.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(t){if(this.mapping!==gh)return t;if(t.applyMatrix3(this.matrix),t.x<0||t.x>1)switch(this.wrapS){case Hr:t.x=t.x-Math.floor(t.x);break;case Ti:t.x=t.x<0?0:1;break;case lo:Math.abs(Math.floor(t.x)%2)===1?t.x=Math.ceil(t.x)-t.x:t.x=t.x-Math.floor(t.x);break}if(t.y<0||t.y>1)switch(this.wrapT){case Hr:t.y=t.y-Math.floor(t.y);break;case Ti:t.y=t.y<0?0:1;break;case lo:Math.abs(Math.floor(t.y)%2)===1?t.y=Math.ceil(t.y)-t.y:t.y=t.y-Math.floor(t.y);break}return this.flipY&&(t.y=1-t.y),t}set needsUpdate(t){t===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(t){t===!0&&this.pmremVersion++}}De.DEFAULT_IMAGE=null;De.DEFAULT_MAPPING=gh;De.DEFAULT_ANISOTROPY=1;class de{constructor(t=0,e=0,n=0,r=1){de.prototype.isVector4=!0,this.x=t,this.y=e,this.z=n,this.w=r}get width(){return this.z}set width(t){this.z=t}get height(){return this.w}set height(t){this.w=t}set(t,e,n,r){return this.x=t,this.y=e,this.z=n,this.w=r,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this.w=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setW(t){return this.w=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;case 3:this.w=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this.w=t.w!==void 0?t.w:1,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this.w+=t.w,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this.w+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this.w=t.w+e.w,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this.w+=t.w*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this.w-=t.w,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this.w-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this.w=t.w-e.w,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this.w*=t.w,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this.w*=t,this}applyMatrix4(t){const e=this.x,n=this.y,r=this.z,s=this.w,a=t.elements;return this.x=a[0]*e+a[4]*n+a[8]*r+a[12]*s,this.y=a[1]*e+a[5]*n+a[9]*r+a[13]*s,this.z=a[2]*e+a[6]*n+a[10]*r+a[14]*s,this.w=a[3]*e+a[7]*n+a[11]*r+a[15]*s,this}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this.w/=t.w,this}divideScalar(t){return this.multiplyScalar(1/t)}setAxisAngleFromQuaternion(t){this.w=2*Math.acos(t.w);const e=Math.sqrt(1-t.w*t.w);return e<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=t.x/e,this.y=t.y/e,this.z=t.z/e),this}setAxisAngleFromRotationMatrix(t){let e,n,r,s;const c=t.elements,l=c[0],h=c[4],u=c[8],d=c[1],f=c[5],m=c[9],x=c[2],g=c[6],p=c[10];if(Math.abs(h-d)<.01&&Math.abs(u-x)<.01&&Math.abs(m-g)<.01){if(Math.abs(h+d)<.1&&Math.abs(u+x)<.1&&Math.abs(m+g)<.1&&Math.abs(l+f+p-3)<.1)return this.set(1,0,0,0),this;e=Math.PI;const y=(l+1)/2,M=(f+1)/2,w=(p+1)/2,E=(h+d)/4,A=(u+x)/4,C=(m+g)/4;return y>M&&y>w?y<.01?(n=0,r=.707106781,s=.707106781):(n=Math.sqrt(y),r=E/n,s=A/n):M>w?M<.01?(n=.707106781,r=0,s=.707106781):(r=Math.sqrt(M),n=E/r,s=C/r):w<.01?(n=.707106781,r=.707106781,s=0):(s=Math.sqrt(w),n=A/s,r=C/s),this.set(n,r,s,e),this}let T=Math.sqrt((g-m)*(g-m)+(u-x)*(u-x)+(d-h)*(d-h));return Math.abs(T)<.001&&(T=1),this.x=(g-m)/T,this.y=(u-x)/T,this.z=(d-h)/T,this.w=Math.acos((l+f+p-1)/2),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this.w=e[15],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this.w=Math.min(this.w,t.w),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this.w=Math.max(this.w,t.w),this}clamp(t,e){return this.x=Qt(this.x,t.x,e.x),this.y=Qt(this.y,t.y,e.y),this.z=Qt(this.z,t.z,e.z),this.w=Qt(this.w,t.w,e.w),this}clampScalar(t,e){return this.x=Qt(this.x,t,e),this.y=Qt(this.y,t,e),this.z=Qt(this.z,t,e),this.w=Qt(this.w,t,e),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Qt(n,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z+this.w*t.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this.w+=(t.w-this.w)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this.w=t.w+(e.w-t.w)*n,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z&&t.w===this.w}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this.w=t[e+3],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t[e+3]=this.w,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this.w=t.getW(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class cd extends xr{constructor(t=1,e=1,n={}){super(),n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:Fe,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1},n),this.isRenderTarget=!0,this.width=t,this.height=e,this.depth=n.depth,this.scissor=new de(0,0,t,e),this.scissorTest=!1,this.viewport=new de(0,0,t,e);const r={width:t,height:e,depth:n.depth},s=new De(r);this.textures=[];const a=n.count;for(let o=0;o<a;o++)this.textures[o]=s.clone(),this.textures[o].isRenderTargetTexture=!0,this.textures[o].renderTarget=this;this._setTextureOptions(n),this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this._depthTexture=null,this.depthTexture=n.depthTexture,this.samples=n.samples,this.multiview=n.multiview}_setTextureOptions(t={}){const e={minFilter:Fe,generateMipmaps:!1,flipY:!1,internalFormat:null};t.mapping!==void 0&&(e.mapping=t.mapping),t.wrapS!==void 0&&(e.wrapS=t.wrapS),t.wrapT!==void 0&&(e.wrapT=t.wrapT),t.wrapR!==void 0&&(e.wrapR=t.wrapR),t.magFilter!==void 0&&(e.magFilter=t.magFilter),t.minFilter!==void 0&&(e.minFilter=t.minFilter),t.format!==void 0&&(e.format=t.format),t.type!==void 0&&(e.type=t.type),t.anisotropy!==void 0&&(e.anisotropy=t.anisotropy),t.colorSpace!==void 0&&(e.colorSpace=t.colorSpace),t.flipY!==void 0&&(e.flipY=t.flipY),t.generateMipmaps!==void 0&&(e.generateMipmaps=t.generateMipmaps),t.internalFormat!==void 0&&(e.internalFormat=t.internalFormat);for(let n=0;n<this.textures.length;n++)this.textures[n].setValues(e)}get texture(){return this.textures[0]}set texture(t){this.textures[0]=t}set depthTexture(t){this._depthTexture!==null&&(this._depthTexture.renderTarget=null),t!==null&&(t.renderTarget=this),this._depthTexture=t}get depthTexture(){return this._depthTexture}setSize(t,e,n=1){if(this.width!==t||this.height!==e||this.depth!==n){this.width=t,this.height=e,this.depth=n;for(let r=0,s=this.textures.length;r<s;r++)this.textures[r].image.width=t,this.textures[r].image.height=e,this.textures[r].image.depth=n,this.textures[r].isArrayTexture=this.textures[r].image.depth>1;this.dispose()}this.viewport.set(0,0,t,e),this.scissor.set(0,0,t,e)}clone(){return new this.constructor().copy(this)}copy(t){this.width=t.width,this.height=t.height,this.depth=t.depth,this.scissor.copy(t.scissor),this.scissorTest=t.scissorTest,this.viewport.copy(t.viewport),this.textures.length=0;for(let e=0,n=t.textures.length;e<n;e++){this.textures[e]=t.textures[e].clone(),this.textures[e].isRenderTargetTexture=!0,this.textures[e].renderTarget=this;const r=Object.assign({},t.textures[e].image);this.textures[e].source=new nc(r)}return this.depthBuffer=t.depthBuffer,this.stencilBuffer=t.stencilBuffer,this.resolveDepthBuffer=t.resolveDepthBuffer,this.resolveStencilBuffer=t.resolveStencilBuffer,t.depthTexture!==null&&(this.depthTexture=t.depthTexture.clone()),this.samples=t.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class Ui extends cd{constructor(t=1,e=1,n={}){super(t,e,n),this.isWebGLRenderTarget=!0}}class Rh extends De{constructor(t=null,e=1,n=1,r=1){super(null),this.isDataArrayTexture=!0,this.image={data:t,width:e,height:n,depth:r},this.magFilter=en,this.minFilter=en,this.wrapR=Ti,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(t){this.layerUpdates.add(t)}clearLayerUpdates(){this.layerUpdates.clear()}}class ld extends De{constructor(t=null,e=1,n=1,r=1){super(null),this.isData3DTexture=!0,this.image={data:t,width:e,height:n,depth:r},this.magFilter=en,this.minFilter=en,this.wrapR=Ti,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class Mr{constructor(t=new O(1/0,1/0,1/0),e=new O(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=t,this.max=e}set(t,e){return this.min.copy(t),this.max.copy(e),this}setFromArray(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e+=3)this.expandByPoint(pn.fromArray(t,e));return this}setFromBufferAttribute(t){this.makeEmpty();for(let e=0,n=t.count;e<n;e++)this.expandByPoint(pn.fromBufferAttribute(t,e));return this}setFromPoints(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e++)this.expandByPoint(t[e]);return this}setFromCenterAndSize(t,e){const n=pn.copy(e).multiplyScalar(.5);return this.min.copy(t).sub(n),this.max.copy(t).add(n),this}setFromObject(t,e=!1){return this.makeEmpty(),this.expandByObject(t,e)}clone(){return new this.constructor().copy(this)}copy(t){return this.min.copy(t.min),this.max.copy(t.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(t){return this.isEmpty()?t.set(0,0,0):t.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(t){return this.isEmpty()?t.set(0,0,0):t.subVectors(this.max,this.min)}expandByPoint(t){return this.min.min(t),this.max.max(t),this}expandByVector(t){return this.min.sub(t),this.max.add(t),this}expandByScalar(t){return this.min.addScalar(-t),this.max.addScalar(t),this}expandByObject(t,e=!1){t.updateWorldMatrix(!1,!1);const n=t.geometry;if(n!==void 0){const s=n.getAttribute("position");if(e===!0&&s!==void 0&&t.isInstancedMesh!==!0)for(let a=0,o=s.count;a<o;a++)t.isMesh===!0?t.getVertexPosition(a,pn):pn.fromBufferAttribute(s,a),pn.applyMatrix4(t.matrixWorld),this.expandByPoint(pn);else t.boundingBox!==void 0?(t.boundingBox===null&&t.computeBoundingBox(),cs.copy(t.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),cs.copy(n.boundingBox)),cs.applyMatrix4(t.matrixWorld),this.union(cs)}const r=t.children;for(let s=0,a=r.length;s<a;s++)this.expandByObject(r[s],e);return this}containsPoint(t){return t.x>=this.min.x&&t.x<=this.max.x&&t.y>=this.min.y&&t.y<=this.max.y&&t.z>=this.min.z&&t.z<=this.max.z}containsBox(t){return this.min.x<=t.min.x&&t.max.x<=this.max.x&&this.min.y<=t.min.y&&t.max.y<=this.max.y&&this.min.z<=t.min.z&&t.max.z<=this.max.z}getParameter(t,e){return e.set((t.x-this.min.x)/(this.max.x-this.min.x),(t.y-this.min.y)/(this.max.y-this.min.y),(t.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(t){return t.max.x>=this.min.x&&t.min.x<=this.max.x&&t.max.y>=this.min.y&&t.min.y<=this.max.y&&t.max.z>=this.min.z&&t.min.z<=this.max.z}intersectsSphere(t){return this.clampPoint(t.center,pn),pn.distanceToSquared(t.center)<=t.radius*t.radius}intersectsPlane(t){let e,n;return t.normal.x>0?(e=t.normal.x*this.min.x,n=t.normal.x*this.max.x):(e=t.normal.x*this.max.x,n=t.normal.x*this.min.x),t.normal.y>0?(e+=t.normal.y*this.min.y,n+=t.normal.y*this.max.y):(e+=t.normal.y*this.max.y,n+=t.normal.y*this.min.y),t.normal.z>0?(e+=t.normal.z*this.min.z,n+=t.normal.z*this.max.z):(e+=t.normal.z*this.max.z,n+=t.normal.z*this.min.z),e<=-t.constant&&n>=-t.constant}intersectsTriangle(t){if(this.isEmpty())return!1;this.getCenter(Tr),ls.subVectors(this.max,Tr),Hi.subVectors(t.a,Tr),Vi.subVectors(t.b,Tr),Gi.subVectors(t.c,Tr),$n.subVectors(Vi,Hi),Jn.subVectors(Gi,Vi),di.subVectors(Hi,Gi);let e=[0,-$n.z,$n.y,0,-Jn.z,Jn.y,0,-di.z,di.y,$n.z,0,-$n.x,Jn.z,0,-Jn.x,di.z,0,-di.x,-$n.y,$n.x,0,-Jn.y,Jn.x,0,-di.y,di.x,0];return!da(e,Hi,Vi,Gi,ls)||(e=[1,0,0,0,1,0,0,0,1],!da(e,Hi,Vi,Gi,ls))?!1:(hs.crossVectors($n,Jn),e=[hs.x,hs.y,hs.z],da(e,Hi,Vi,Gi,ls))}clampPoint(t,e){return e.copy(t).clamp(this.min,this.max)}distanceToPoint(t){return this.clampPoint(t,pn).distanceTo(t)}getBoundingSphere(t){return this.isEmpty()?t.makeEmpty():(this.getCenter(t.center),t.radius=this.getSize(pn).length()*.5),t}intersect(t){return this.min.max(t.min),this.max.min(t.max),this.isEmpty()&&this.makeEmpty(),this}union(t){return this.min.min(t.min),this.max.max(t.max),this}applyMatrix4(t){return this.isEmpty()?this:(In[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(t),In[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(t),In[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(t),In[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(t),In[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(t),In[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(t),In[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(t),In[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(t),this.setFromPoints(In),this)}translate(t){return this.min.add(t),this.max.add(t),this}equals(t){return t.min.equals(this.min)&&t.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(t){return this.min.fromArray(t.min),this.max.fromArray(t.max),this}}const In=[new O,new O,new O,new O,new O,new O,new O,new O],pn=new O,cs=new Mr,Hi=new O,Vi=new O,Gi=new O,$n=new O,Jn=new O,di=new O,Tr=new O,ls=new O,hs=new O,pi=new O;function da(i,t,e,n,r){for(let s=0,a=i.length-3;s<=a;s+=3){pi.fromArray(i,s);const o=r.x*Math.abs(pi.x)+r.y*Math.abs(pi.y)+r.z*Math.abs(pi.z),c=t.dot(pi),l=e.dot(pi),h=n.dot(pi);if(Math.max(-Math.max(c,l,h),Math.min(c,l,h))>o)return!1}return!0}const hd=new Mr,wr=new O,pa=new O;class Sr{constructor(t=new O,e=-1){this.isSphere=!0,this.center=t,this.radius=e}set(t,e){return this.center.copy(t),this.radius=e,this}setFromPoints(t,e){const n=this.center;e!==void 0?n.copy(e):hd.setFromPoints(t).getCenter(n);let r=0;for(let s=0,a=t.length;s<a;s++)r=Math.max(r,n.distanceToSquared(t[s]));return this.radius=Math.sqrt(r),this}copy(t){return this.center.copy(t.center),this.radius=t.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(t){return t.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(t){return t.distanceTo(this.center)-this.radius}intersectsSphere(t){const e=this.radius+t.radius;return t.center.distanceToSquared(this.center)<=e*e}intersectsBox(t){return t.intersectsSphere(this)}intersectsPlane(t){return Math.abs(t.distanceToPoint(this.center))<=this.radius}clampPoint(t,e){const n=this.center.distanceToSquared(t);return e.copy(t),n>this.radius*this.radius&&(e.sub(this.center).normalize(),e.multiplyScalar(this.radius).add(this.center)),e}getBoundingBox(t){return this.isEmpty()?(t.makeEmpty(),t):(t.set(this.center,this.center),t.expandByScalar(this.radius),t)}applyMatrix4(t){return this.center.applyMatrix4(t),this.radius=this.radius*t.getMaxScaleOnAxis(),this}translate(t){return this.center.add(t),this}expandByPoint(t){if(this.isEmpty())return this.center.copy(t),this.radius=0,this;wr.subVectors(t,this.center);const e=wr.lengthSq();if(e>this.radius*this.radius){const n=Math.sqrt(e),r=(n-this.radius)*.5;this.center.addScaledVector(wr,r/n),this.radius+=r}return this}union(t){return t.isEmpty()?this:this.isEmpty()?(this.copy(t),this):(this.center.equals(t.center)===!0?this.radius=Math.max(this.radius,t.radius):(pa.subVectors(t.center,this.center).setLength(t.radius),this.expandByPoint(wr.copy(t.center).add(pa)),this.expandByPoint(wr.copy(t.center).sub(pa))),this)}equals(t){return t.center.equals(this.center)&&t.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(t){return this.radius=t.radius,this.center.fromArray(t.center),this}}const Un=new O,ma=new O,us=new O,Zn=new O,ga=new O,fs=new O,va=new O;class Ch{constructor(t=new O,e=new O(0,0,-1)){this.origin=t,this.direction=e}set(t,e){return this.origin.copy(t),this.direction.copy(e),this}copy(t){return this.origin.copy(t.origin),this.direction.copy(t.direction),this}at(t,e){return e.copy(this.origin).addScaledVector(this.direction,t)}lookAt(t){return this.direction.copy(t).sub(this.origin).normalize(),this}recast(t){return this.origin.copy(this.at(t,Un)),this}closestPointToPoint(t,e){e.subVectors(t,this.origin);const n=e.dot(this.direction);return n<0?e.copy(this.origin):e.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(t){return Math.sqrt(this.distanceSqToPoint(t))}distanceSqToPoint(t){const e=Un.subVectors(t,this.origin).dot(this.direction);return e<0?this.origin.distanceToSquared(t):(Un.copy(this.origin).addScaledVector(this.direction,e),Un.distanceToSquared(t))}distanceSqToSegment(t,e,n,r){ma.copy(t).add(e).multiplyScalar(.5),us.copy(e).sub(t).normalize(),Zn.copy(this.origin).sub(ma);const s=t.distanceTo(e)*.5,a=-this.direction.dot(us),o=Zn.dot(this.direction),c=-Zn.dot(us),l=Zn.lengthSq(),h=Math.abs(1-a*a);let u,d,f,m;if(h>0)if(u=a*c-o,d=a*o-c,m=s*h,u>=0)if(d>=-m)if(d<=m){const x=1/h;u*=x,d*=x,f=u*(u+a*d+2*o)+d*(a*u+d+2*c)+l}else d=s,u=Math.max(0,-(a*d+o)),f=-u*u+d*(d+2*c)+l;else d=-s,u=Math.max(0,-(a*d+o)),f=-u*u+d*(d+2*c)+l;else d<=-m?(u=Math.max(0,-(-a*s+o)),d=u>0?-s:Math.min(Math.max(-s,-c),s),f=-u*u+d*(d+2*c)+l):d<=m?(u=0,d=Math.min(Math.max(-s,-c),s),f=d*(d+2*c)+l):(u=Math.max(0,-(a*s+o)),d=u>0?s:Math.min(Math.max(-s,-c),s),f=-u*u+d*(d+2*c)+l);else d=a>0?-s:s,u=Math.max(0,-(a*d+o)),f=-u*u+d*(d+2*c)+l;return n&&n.copy(this.origin).addScaledVector(this.direction,u),r&&r.copy(ma).addScaledVector(us,d),f}intersectSphere(t,e){Un.subVectors(t.center,this.origin);const n=Un.dot(this.direction),r=Un.dot(Un)-n*n,s=t.radius*t.radius;if(r>s)return null;const a=Math.sqrt(s-r),o=n-a,c=n+a;return c<0?null:o<0?this.at(c,e):this.at(o,e)}intersectsSphere(t){return t.radius<0?!1:this.distanceSqToPoint(t.center)<=t.radius*t.radius}distanceToPlane(t){const e=t.normal.dot(this.direction);if(e===0)return t.distanceToPoint(this.origin)===0?0:null;const n=-(this.origin.dot(t.normal)+t.constant)/e;return n>=0?n:null}intersectPlane(t,e){const n=this.distanceToPlane(t);return n===null?null:this.at(n,e)}intersectsPlane(t){const e=t.distanceToPoint(this.origin);return e===0||t.normal.dot(this.direction)*e<0}intersectBox(t,e){let n,r,s,a,o,c;const l=1/this.direction.x,h=1/this.direction.y,u=1/this.direction.z,d=this.origin;return l>=0?(n=(t.min.x-d.x)*l,r=(t.max.x-d.x)*l):(n=(t.max.x-d.x)*l,r=(t.min.x-d.x)*l),h>=0?(s=(t.min.y-d.y)*h,a=(t.max.y-d.y)*h):(s=(t.max.y-d.y)*h,a=(t.min.y-d.y)*h),n>a||s>r||((s>n||isNaN(n))&&(n=s),(a<r||isNaN(r))&&(r=a),u>=0?(o=(t.min.z-d.z)*u,c=(t.max.z-d.z)*u):(o=(t.max.z-d.z)*u,c=(t.min.z-d.z)*u),n>c||o>r)||((o>n||n!==n)&&(n=o),(c<r||r!==r)&&(r=c),r<0)?null:this.at(n>=0?n:r,e)}intersectsBox(t){return this.intersectBox(t,Un)!==null}intersectTriangle(t,e,n,r,s){ga.subVectors(e,t),fs.subVectors(n,t),va.crossVectors(ga,fs);let a=this.direction.dot(va),o;if(a>0){if(r)return null;o=1}else if(a<0)o=-1,a=-a;else return null;Zn.subVectors(this.origin,t);const c=o*this.direction.dot(fs.crossVectors(Zn,fs));if(c<0)return null;const l=o*this.direction.dot(ga.cross(Zn));if(l<0||c+l>a)return null;const h=-o*Zn.dot(va);return h<0?null:this.at(h/a,s)}applyMatrix4(t){return this.origin.applyMatrix4(t),this.direction.transformDirection(t),this}equals(t){return t.origin.equals(this.origin)&&t.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class ie{constructor(t,e,n,r,s,a,o,c,l,h,u,d,f,m,x,g){ie.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],t!==void 0&&this.set(t,e,n,r,s,a,o,c,l,h,u,d,f,m,x,g)}set(t,e,n,r,s,a,o,c,l,h,u,d,f,m,x,g){const p=this.elements;return p[0]=t,p[4]=e,p[8]=n,p[12]=r,p[1]=s,p[5]=a,p[9]=o,p[13]=c,p[2]=l,p[6]=h,p[10]=u,p[14]=d,p[3]=f,p[7]=m,p[11]=x,p[15]=g,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new ie().fromArray(this.elements)}copy(t){const e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],e[9]=n[9],e[10]=n[10],e[11]=n[11],e[12]=n[12],e[13]=n[13],e[14]=n[14],e[15]=n[15],this}copyPosition(t){const e=this.elements,n=t.elements;return e[12]=n[12],e[13]=n[13],e[14]=n[14],this}setFromMatrix3(t){const e=t.elements;return this.set(e[0],e[3],e[6],0,e[1],e[4],e[7],0,e[2],e[5],e[8],0,0,0,0,1),this}extractBasis(t,e,n){return t.setFromMatrixColumn(this,0),e.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this}makeBasis(t,e,n){return this.set(t.x,e.x,n.x,0,t.y,e.y,n.y,0,t.z,e.z,n.z,0,0,0,0,1),this}extractRotation(t){const e=this.elements,n=t.elements,r=1/Wi.setFromMatrixColumn(t,0).length(),s=1/Wi.setFromMatrixColumn(t,1).length(),a=1/Wi.setFromMatrixColumn(t,2).length();return e[0]=n[0]*r,e[1]=n[1]*r,e[2]=n[2]*r,e[3]=0,e[4]=n[4]*s,e[5]=n[5]*s,e[6]=n[6]*s,e[7]=0,e[8]=n[8]*a,e[9]=n[9]*a,e[10]=n[10]*a,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromEuler(t){const e=this.elements,n=t.x,r=t.y,s=t.z,a=Math.cos(n),o=Math.sin(n),c=Math.cos(r),l=Math.sin(r),h=Math.cos(s),u=Math.sin(s);if(t.order==="XYZ"){const d=a*h,f=a*u,m=o*h,x=o*u;e[0]=c*h,e[4]=-c*u,e[8]=l,e[1]=f+m*l,e[5]=d-x*l,e[9]=-o*c,e[2]=x-d*l,e[6]=m+f*l,e[10]=a*c}else if(t.order==="YXZ"){const d=c*h,f=c*u,m=l*h,x=l*u;e[0]=d+x*o,e[4]=m*o-f,e[8]=a*l,e[1]=a*u,e[5]=a*h,e[9]=-o,e[2]=f*o-m,e[6]=x+d*o,e[10]=a*c}else if(t.order==="ZXY"){const d=c*h,f=c*u,m=l*h,x=l*u;e[0]=d-x*o,e[4]=-a*u,e[8]=m+f*o,e[1]=f+m*o,e[5]=a*h,e[9]=x-d*o,e[2]=-a*l,e[6]=o,e[10]=a*c}else if(t.order==="ZYX"){const d=a*h,f=a*u,m=o*h,x=o*u;e[0]=c*h,e[4]=m*l-f,e[8]=d*l+x,e[1]=c*u,e[5]=x*l+d,e[9]=f*l-m,e[2]=-l,e[6]=o*c,e[10]=a*c}else if(t.order==="YZX"){const d=a*c,f=a*l,m=o*c,x=o*l;e[0]=c*h,e[4]=x-d*u,e[8]=m*u+f,e[1]=u,e[5]=a*h,e[9]=-o*h,e[2]=-l*h,e[6]=f*u+m,e[10]=d-x*u}else if(t.order==="XZY"){const d=a*c,f=a*l,m=o*c,x=o*l;e[0]=c*h,e[4]=-u,e[8]=l*h,e[1]=d*u+x,e[5]=a*h,e[9]=f*u-m,e[2]=m*u-f,e[6]=o*h,e[10]=x*u+d}return e[3]=0,e[7]=0,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromQuaternion(t){return this.compose(ud,t,fd)}lookAt(t,e,n){const r=this.elements;return Ke.subVectors(t,e),Ke.lengthSq()===0&&(Ke.z=1),Ke.normalize(),Kn.crossVectors(n,Ke),Kn.lengthSq()===0&&(Math.abs(n.z)===1?Ke.x+=1e-4:Ke.z+=1e-4,Ke.normalize(),Kn.crossVectors(n,Ke)),Kn.normalize(),ds.crossVectors(Ke,Kn),r[0]=Kn.x,r[4]=ds.x,r[8]=Ke.x,r[1]=Kn.y,r[5]=ds.y,r[9]=Ke.y,r[2]=Kn.z,r[6]=ds.z,r[10]=Ke.z,this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const n=t.elements,r=e.elements,s=this.elements,a=n[0],o=n[4],c=n[8],l=n[12],h=n[1],u=n[5],d=n[9],f=n[13],m=n[2],x=n[6],g=n[10],p=n[14],T=n[3],y=n[7],M=n[11],w=n[15],E=r[0],A=r[4],C=r[8],v=r[12],_=r[1],S=r[5],b=r[9],D=r[13],U=r[2],N=r[6],B=r[10],Z=r[14],H=r[3],st=r[7],ht=r[11],pt=r[15];return s[0]=a*E+o*_+c*U+l*H,s[4]=a*A+o*S+c*N+l*st,s[8]=a*C+o*b+c*B+l*ht,s[12]=a*v+o*D+c*Z+l*pt,s[1]=h*E+u*_+d*U+f*H,s[5]=h*A+u*S+d*N+f*st,s[9]=h*C+u*b+d*B+f*ht,s[13]=h*v+u*D+d*Z+f*pt,s[2]=m*E+x*_+g*U+p*H,s[6]=m*A+x*S+g*N+p*st,s[10]=m*C+x*b+g*B+p*ht,s[14]=m*v+x*D+g*Z+p*pt,s[3]=T*E+y*_+M*U+w*H,s[7]=T*A+y*S+M*N+w*st,s[11]=T*C+y*b+M*B+w*ht,s[15]=T*v+y*D+M*Z+w*pt,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[4]*=t,e[8]*=t,e[12]*=t,e[1]*=t,e[5]*=t,e[9]*=t,e[13]*=t,e[2]*=t,e[6]*=t,e[10]*=t,e[14]*=t,e[3]*=t,e[7]*=t,e[11]*=t,e[15]*=t,this}determinant(){const t=this.elements,e=t[0],n=t[4],r=t[8],s=t[12],a=t[1],o=t[5],c=t[9],l=t[13],h=t[2],u=t[6],d=t[10],f=t[14],m=t[3],x=t[7],g=t[11],p=t[15];return m*(+s*c*u-r*l*u-s*o*d+n*l*d+r*o*f-n*c*f)+x*(+e*c*f-e*l*d+s*a*d-r*a*f+r*l*h-s*c*h)+g*(+e*l*u-e*o*f-s*a*u+n*a*f+s*o*h-n*l*h)+p*(-r*o*h-e*c*u+e*o*d+r*a*u-n*a*d+n*c*h)}transpose(){const t=this.elements;let e;return e=t[1],t[1]=t[4],t[4]=e,e=t[2],t[2]=t[8],t[8]=e,e=t[6],t[6]=t[9],t[9]=e,e=t[3],t[3]=t[12],t[12]=e,e=t[7],t[7]=t[13],t[13]=e,e=t[11],t[11]=t[14],t[14]=e,this}setPosition(t,e,n){const r=this.elements;return t.isVector3?(r[12]=t.x,r[13]=t.y,r[14]=t.z):(r[12]=t,r[13]=e,r[14]=n),this}invert(){const t=this.elements,e=t[0],n=t[1],r=t[2],s=t[3],a=t[4],o=t[5],c=t[6],l=t[7],h=t[8],u=t[9],d=t[10],f=t[11],m=t[12],x=t[13],g=t[14],p=t[15],T=u*g*l-x*d*l+x*c*f-o*g*f-u*c*p+o*d*p,y=m*d*l-h*g*l-m*c*f+a*g*f+h*c*p-a*d*p,M=h*x*l-m*u*l+m*o*f-a*x*f-h*o*p+a*u*p,w=m*u*c-h*x*c-m*o*d+a*x*d+h*o*g-a*u*g,E=e*T+n*y+r*M+s*w;if(E===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const A=1/E;return t[0]=T*A,t[1]=(x*d*s-u*g*s-x*r*f+n*g*f+u*r*p-n*d*p)*A,t[2]=(o*g*s-x*c*s+x*r*l-n*g*l-o*r*p+n*c*p)*A,t[3]=(u*c*s-o*d*s-u*r*l+n*d*l+o*r*f-n*c*f)*A,t[4]=y*A,t[5]=(h*g*s-m*d*s+m*r*f-e*g*f-h*r*p+e*d*p)*A,t[6]=(m*c*s-a*g*s-m*r*l+e*g*l+a*r*p-e*c*p)*A,t[7]=(a*d*s-h*c*s+h*r*l-e*d*l-a*r*f+e*c*f)*A,t[8]=M*A,t[9]=(m*u*s-h*x*s-m*n*f+e*x*f+h*n*p-e*u*p)*A,t[10]=(a*x*s-m*o*s+m*n*l-e*x*l-a*n*p+e*o*p)*A,t[11]=(h*o*s-a*u*s-h*n*l+e*u*l+a*n*f-e*o*f)*A,t[12]=w*A,t[13]=(h*x*r-m*u*r+m*n*d-e*x*d-h*n*g+e*u*g)*A,t[14]=(m*o*r-a*x*r-m*n*c+e*x*c+a*n*g-e*o*g)*A,t[15]=(a*u*r-h*o*r+h*n*c-e*u*c-a*n*d+e*o*d)*A,this}scale(t){const e=this.elements,n=t.x,r=t.y,s=t.z;return e[0]*=n,e[4]*=r,e[8]*=s,e[1]*=n,e[5]*=r,e[9]*=s,e[2]*=n,e[6]*=r,e[10]*=s,e[3]*=n,e[7]*=r,e[11]*=s,this}getMaxScaleOnAxis(){const t=this.elements,e=t[0]*t[0]+t[1]*t[1]+t[2]*t[2],n=t[4]*t[4]+t[5]*t[5]+t[6]*t[6],r=t[8]*t[8]+t[9]*t[9]+t[10]*t[10];return Math.sqrt(Math.max(e,n,r))}makeTranslation(t,e,n){return t.isVector3?this.set(1,0,0,t.x,0,1,0,t.y,0,0,1,t.z,0,0,0,1):this.set(1,0,0,t,0,1,0,e,0,0,1,n,0,0,0,1),this}makeRotationX(t){const e=Math.cos(t),n=Math.sin(t);return this.set(1,0,0,0,0,e,-n,0,0,n,e,0,0,0,0,1),this}makeRotationY(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,0,n,0,0,1,0,0,-n,0,e,0,0,0,0,1),this}makeRotationZ(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,0,n,e,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(t,e){const n=Math.cos(e),r=Math.sin(e),s=1-n,a=t.x,o=t.y,c=t.z,l=s*a,h=s*o;return this.set(l*a+n,l*o-r*c,l*c+r*o,0,l*o+r*c,h*o+n,h*c-r*a,0,l*c-r*o,h*c+r*a,s*c*c+n,0,0,0,0,1),this}makeScale(t,e,n){return this.set(t,0,0,0,0,e,0,0,0,0,n,0,0,0,0,1),this}makeShear(t,e,n,r,s,a){return this.set(1,n,s,0,t,1,a,0,e,r,1,0,0,0,0,1),this}compose(t,e,n){const r=this.elements,s=e._x,a=e._y,o=e._z,c=e._w,l=s+s,h=a+a,u=o+o,d=s*l,f=s*h,m=s*u,x=a*h,g=a*u,p=o*u,T=c*l,y=c*h,M=c*u,w=n.x,E=n.y,A=n.z;return r[0]=(1-(x+p))*w,r[1]=(f+M)*w,r[2]=(m-y)*w,r[3]=0,r[4]=(f-M)*E,r[5]=(1-(d+p))*E,r[6]=(g+T)*E,r[7]=0,r[8]=(m+y)*A,r[9]=(g-T)*A,r[10]=(1-(d+x))*A,r[11]=0,r[12]=t.x,r[13]=t.y,r[14]=t.z,r[15]=1,this}decompose(t,e,n){const r=this.elements;let s=Wi.set(r[0],r[1],r[2]).length();const a=Wi.set(r[4],r[5],r[6]).length(),o=Wi.set(r[8],r[9],r[10]).length();this.determinant()<0&&(s=-s),t.x=r[12],t.y=r[13],t.z=r[14],mn.copy(this);const l=1/s,h=1/a,u=1/o;return mn.elements[0]*=l,mn.elements[1]*=l,mn.elements[2]*=l,mn.elements[4]*=h,mn.elements[5]*=h,mn.elements[6]*=h,mn.elements[8]*=u,mn.elements[9]*=u,mn.elements[10]*=u,e.setFromRotationMatrix(mn),n.x=s,n.y=a,n.z=o,this}makePerspective(t,e,n,r,s,a,o=Rn,c=!1){const l=this.elements,h=2*s/(e-t),u=2*s/(n-r),d=(e+t)/(e-t),f=(n+r)/(n-r);let m,x;if(c)m=s/(a-s),x=a*s/(a-s);else if(o===Rn)m=-(a+s)/(a-s),x=-2*a*s/(a-s);else if(o===Ys)m=-a/(a-s),x=-a*s/(a-s);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+o);return l[0]=h,l[4]=0,l[8]=d,l[12]=0,l[1]=0,l[5]=u,l[9]=f,l[13]=0,l[2]=0,l[6]=0,l[10]=m,l[14]=x,l[3]=0,l[7]=0,l[11]=-1,l[15]=0,this}makeOrthographic(t,e,n,r,s,a,o=Rn,c=!1){const l=this.elements,h=2/(e-t),u=2/(n-r),d=-(e+t)/(e-t),f=-(n+r)/(n-r);let m,x;if(c)m=1/(a-s),x=a/(a-s);else if(o===Rn)m=-2/(a-s),x=-(a+s)/(a-s);else if(o===Ys)m=-1/(a-s),x=-s/(a-s);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+o);return l[0]=h,l[4]=0,l[8]=0,l[12]=d,l[1]=0,l[5]=u,l[9]=0,l[13]=f,l[2]=0,l[6]=0,l[10]=m,l[14]=x,l[3]=0,l[7]=0,l[11]=0,l[15]=1,this}equals(t){const e=this.elements,n=t.elements;for(let r=0;r<16;r++)if(e[r]!==n[r])return!1;return!0}fromArray(t,e=0){for(let n=0;n<16;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){const n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t[e+9]=n[9],t[e+10]=n[10],t[e+11]=n[11],t[e+12]=n[12],t[e+13]=n[13],t[e+14]=n[14],t[e+15]=n[15],t}}const Wi=new O,mn=new ie,ud=new O(0,0,0),fd=new O(1,1,1),Kn=new O,ds=new O,Ke=new O,Xc=new ie,qc=new We;class dn{constructor(t=0,e=0,n=0,r=dn.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=e,this._z=n,this._order=r}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get order(){return this._order}set order(t){this._order=t,this._onChangeCallback()}set(t,e,n,r=this._order){return this._x=t,this._y=e,this._z=n,this._order=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(t){return this._x=t._x,this._y=t._y,this._z=t._z,this._order=t._order,this._onChangeCallback(),this}setFromRotationMatrix(t,e=this._order,n=!0){const r=t.elements,s=r[0],a=r[4],o=r[8],c=r[1],l=r[5],h=r[9],u=r[2],d=r[6],f=r[10];switch(e){case"XYZ":this._y=Math.asin(Qt(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-h,f),this._z=Math.atan2(-a,s)):(this._x=Math.atan2(d,l),this._z=0);break;case"YXZ":this._x=Math.asin(-Qt(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(o,f),this._z=Math.atan2(c,l)):(this._y=Math.atan2(-u,s),this._z=0);break;case"ZXY":this._x=Math.asin(Qt(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(-u,f),this._z=Math.atan2(-a,l)):(this._y=0,this._z=Math.atan2(c,s));break;case"ZYX":this._y=Math.asin(-Qt(u,-1,1)),Math.abs(u)<.9999999?(this._x=Math.atan2(d,f),this._z=Math.atan2(c,s)):(this._x=0,this._z=Math.atan2(-a,l));break;case"YZX":this._z=Math.asin(Qt(c,-1,1)),Math.abs(c)<.9999999?(this._x=Math.atan2(-h,l),this._y=Math.atan2(-u,s)):(this._x=0,this._y=Math.atan2(o,f));break;case"XZY":this._z=Math.asin(-Qt(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(d,l),this._y=Math.atan2(o,s)):(this._x=Math.atan2(-h,f),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+e)}return this._order=e,n===!0&&this._onChangeCallback(),this}setFromQuaternion(t,e,n){return Xc.makeRotationFromQuaternion(t),this.setFromRotationMatrix(Xc,e,n)}setFromVector3(t,e=this._order){return this.set(t.x,t.y,t.z,e)}reorder(t){return qc.setFromEuler(this),this.setFromQuaternion(qc,t)}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._order===this._order}fromArray(t){return this._x=t[0],this._y=t[1],this._z=t[2],t[3]!==void 0&&(this._order=t[3]),this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._order,t}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}dn.DEFAULT_ORDER="XYZ";class Lh{constructor(){this.mask=1}set(t){this.mask=(1<<t|0)>>>0}enable(t){this.mask|=1<<t|0}enableAll(){this.mask=-1}toggle(t){this.mask^=1<<t|0}disable(t){this.mask&=~(1<<t|0)}disableAll(){this.mask=0}test(t){return(this.mask&t.mask)!==0}isEnabled(t){return(this.mask&(1<<t|0))!==0}}let dd=0;const Yc=new O,Xi=new We,Nn=new ie,ps=new O,Ar=new O,pd=new O,md=new We,$c=new O(1,0,0),Jc=new O(0,1,0),Zc=new O(0,0,1),Kc={type:"added"},gd={type:"removed"},qi={type:"childadded",child:null},_a={type:"childremoved",child:null};class Ce extends xr{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:dd++}),this.uuid=hi(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=Ce.DEFAULT_UP.clone();const t=new O,e=new dn,n=new We,r=new O(1,1,1);function s(){n.setFromEuler(e,!1)}function a(){e.setFromQuaternion(n,void 0,!1)}e._onChange(s),n._onChange(a),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:e},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:r},modelViewMatrix:{value:new ie},normalMatrix:{value:new Kt}}),this.matrix=new ie,this.matrixWorld=new ie,this.matrixAutoUpdate=Ce.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=Ce.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new Lh,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(t){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(t),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(t){return this.quaternion.premultiply(t),this}setRotationFromAxisAngle(t,e){this.quaternion.setFromAxisAngle(t,e)}setRotationFromEuler(t){this.quaternion.setFromEuler(t,!0)}setRotationFromMatrix(t){this.quaternion.setFromRotationMatrix(t)}setRotationFromQuaternion(t){this.quaternion.copy(t)}rotateOnAxis(t,e){return Xi.setFromAxisAngle(t,e),this.quaternion.multiply(Xi),this}rotateOnWorldAxis(t,e){return Xi.setFromAxisAngle(t,e),this.quaternion.premultiply(Xi),this}rotateX(t){return this.rotateOnAxis($c,t)}rotateY(t){return this.rotateOnAxis(Jc,t)}rotateZ(t){return this.rotateOnAxis(Zc,t)}translateOnAxis(t,e){return Yc.copy(t).applyQuaternion(this.quaternion),this.position.add(Yc.multiplyScalar(e)),this}translateX(t){return this.translateOnAxis($c,t)}translateY(t){return this.translateOnAxis(Jc,t)}translateZ(t){return this.translateOnAxis(Zc,t)}localToWorld(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(this.matrixWorld)}worldToLocal(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(Nn.copy(this.matrixWorld).invert())}lookAt(t,e,n){t.isVector3?ps.copy(t):ps.set(t,e,n);const r=this.parent;this.updateWorldMatrix(!0,!1),Ar.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Nn.lookAt(Ar,ps,this.up):Nn.lookAt(ps,Ar,this.up),this.quaternion.setFromRotationMatrix(Nn),r&&(Nn.extractRotation(r.matrixWorld),Xi.setFromRotationMatrix(Nn),this.quaternion.premultiply(Xi.invert()))}add(t){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.add(arguments[e]);return this}return t===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",t),this):(t&&t.isObject3D?(t.removeFromParent(),t.parent=this,this.children.push(t),t.dispatchEvent(Kc),qi.child=t,this.dispatchEvent(qi),qi.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",t),this)}remove(t){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}const e=this.children.indexOf(t);return e!==-1&&(t.parent=null,this.children.splice(e,1),t.dispatchEvent(gd),_a.child=t,this.dispatchEvent(_a),_a.child=null),this}removeFromParent(){const t=this.parent;return t!==null&&t.remove(this),this}clear(){return this.remove(...this.children)}attach(t){return this.updateWorldMatrix(!0,!1),Nn.copy(this.matrixWorld).invert(),t.parent!==null&&(t.parent.updateWorldMatrix(!0,!1),Nn.multiply(t.parent.matrixWorld)),t.applyMatrix4(Nn),t.removeFromParent(),t.parent=this,this.children.push(t),t.updateWorldMatrix(!1,!0),t.dispatchEvent(Kc),qi.child=t,this.dispatchEvent(qi),qi.child=null,this}getObjectById(t){return this.getObjectByProperty("id",t)}getObjectByName(t){return this.getObjectByProperty("name",t)}getObjectByProperty(t,e){if(this[t]===e)return this;for(let n=0,r=this.children.length;n<r;n++){const a=this.children[n].getObjectByProperty(t,e);if(a!==void 0)return a}}getObjectsByProperty(t,e,n=[]){this[t]===e&&n.push(this);const r=this.children;for(let s=0,a=r.length;s<a;s++)r[s].getObjectsByProperty(t,e,n);return n}getWorldPosition(t){return this.updateWorldMatrix(!0,!1),t.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Ar,t,pd),t}getWorldScale(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Ar,md,t),t}getWorldDirection(t){this.updateWorldMatrix(!0,!1);const e=this.matrixWorld.elements;return t.set(e[8],e[9],e[10]).normalize()}raycast(){}traverse(t){t(this);const e=this.children;for(let n=0,r=e.length;n<r;n++)e[n].traverse(t)}traverseVisible(t){if(this.visible===!1)return;t(this);const e=this.children;for(let n=0,r=e.length;n<r;n++)e[n].traverseVisible(t)}traverseAncestors(t){const e=this.parent;e!==null&&(t(e),e.traverseAncestors(t))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(t){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||t)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,t=!0);const e=this.children;for(let n=0,r=e.length;n<r;n++)e[n].updateMatrixWorld(t)}updateWorldMatrix(t,e){const n=this.parent;if(t===!0&&n!==null&&n.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),e===!0){const r=this.children;for(let s=0,a=r.length;s<a;s++)r[s].updateWorldMatrix(!1,!0)}}toJSON(t){const e=t===void 0||typeof t=="string",n={};e&&(t={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});const r={};r.uuid=this.uuid,r.type=this.type,this.name!==""&&(r.name=this.name),this.castShadow===!0&&(r.castShadow=!0),this.receiveShadow===!0&&(r.receiveShadow=!0),this.visible===!1&&(r.visible=!1),this.frustumCulled===!1&&(r.frustumCulled=!1),this.renderOrder!==0&&(r.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(r.userData=this.userData),r.layers=this.layers.mask,r.matrix=this.matrix.toArray(),r.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(r.matrixAutoUpdate=!1),this.isInstancedMesh&&(r.type="InstancedMesh",r.count=this.count,r.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(r.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(r.type="BatchedMesh",r.perObjectFrustumCulled=this.perObjectFrustumCulled,r.sortObjects=this.sortObjects,r.drawRanges=this._drawRanges,r.reservedRanges=this._reservedRanges,r.geometryInfo=this._geometryInfo.map(o=>({...o,boundingBox:o.boundingBox?o.boundingBox.toJSON():void 0,boundingSphere:o.boundingSphere?o.boundingSphere.toJSON():void 0})),r.instanceInfo=this._instanceInfo.map(o=>({...o})),r.availableInstanceIds=this._availableInstanceIds.slice(),r.availableGeometryIds=this._availableGeometryIds.slice(),r.nextIndexStart=this._nextIndexStart,r.nextVertexStart=this._nextVertexStart,r.geometryCount=this._geometryCount,r.maxInstanceCount=this._maxInstanceCount,r.maxVertexCount=this._maxVertexCount,r.maxIndexCount=this._maxIndexCount,r.geometryInitialized=this._geometryInitialized,r.matricesTexture=this._matricesTexture.toJSON(t),r.indirectTexture=this._indirectTexture.toJSON(t),this._colorsTexture!==null&&(r.colorsTexture=this._colorsTexture.toJSON(t)),this.boundingSphere!==null&&(r.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(r.boundingBox=this.boundingBox.toJSON()));function s(o,c){return o[c.uuid]===void 0&&(o[c.uuid]=c.toJSON(t)),c.uuid}if(this.isScene)this.background&&(this.background.isColor?r.background=this.background.toJSON():this.background.isTexture&&(r.background=this.background.toJSON(t).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(r.environment=this.environment.toJSON(t).uuid);else if(this.isMesh||this.isLine||this.isPoints){r.geometry=s(t.geometries,this.geometry);const o=this.geometry.parameters;if(o!==void 0&&o.shapes!==void 0){const c=o.shapes;if(Array.isArray(c))for(let l=0,h=c.length;l<h;l++){const u=c[l];s(t.shapes,u)}else s(t.shapes,c)}}if(this.isSkinnedMesh&&(r.bindMode=this.bindMode,r.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(s(t.skeletons,this.skeleton),r.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const o=[];for(let c=0,l=this.material.length;c<l;c++)o.push(s(t.materials,this.material[c]));r.material=o}else r.material=s(t.materials,this.material);if(this.children.length>0){r.children=[];for(let o=0;o<this.children.length;o++)r.children.push(this.children[o].toJSON(t).object)}if(this.animations.length>0){r.animations=[];for(let o=0;o<this.animations.length;o++){const c=this.animations[o];r.animations.push(s(t.animations,c))}}if(e){const o=a(t.geometries),c=a(t.materials),l=a(t.textures),h=a(t.images),u=a(t.shapes),d=a(t.skeletons),f=a(t.animations),m=a(t.nodes);o.length>0&&(n.geometries=o),c.length>0&&(n.materials=c),l.length>0&&(n.textures=l),h.length>0&&(n.images=h),u.length>0&&(n.shapes=u),d.length>0&&(n.skeletons=d),f.length>0&&(n.animations=f),m.length>0&&(n.nodes=m)}return n.object=r,n;function a(o){const c=[];for(const l in o){const h=o[l];delete h.metadata,c.push(h)}return c}}clone(t){return new this.constructor().copy(this,t)}copy(t,e=!0){if(this.name=t.name,this.up.copy(t.up),this.position.copy(t.position),this.rotation.order=t.rotation.order,this.quaternion.copy(t.quaternion),this.scale.copy(t.scale),this.matrix.copy(t.matrix),this.matrixWorld.copy(t.matrixWorld),this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrixWorldAutoUpdate=t.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=t.matrixWorldNeedsUpdate,this.layers.mask=t.layers.mask,this.visible=t.visible,this.castShadow=t.castShadow,this.receiveShadow=t.receiveShadow,this.frustumCulled=t.frustumCulled,this.renderOrder=t.renderOrder,this.animations=t.animations.slice(),this.userData=JSON.parse(JSON.stringify(t.userData)),e===!0)for(let n=0;n<t.children.length;n++){const r=t.children[n];this.add(r.clone())}return this}}Ce.DEFAULT_UP=new O(0,1,0);Ce.DEFAULT_MATRIX_AUTO_UPDATE=!0;Ce.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const gn=new O,Fn=new O,xa=new O,On=new O,Yi=new O,$i=new O,jc=new O,Ma=new O,Sa=new O,ya=new O,ba=new de,Ea=new de,Ta=new de;class xn{constructor(t=new O,e=new O,n=new O){this.a=t,this.b=e,this.c=n}static getNormal(t,e,n,r){r.subVectors(n,e),gn.subVectors(t,e),r.cross(gn);const s=r.lengthSq();return s>0?r.multiplyScalar(1/Math.sqrt(s)):r.set(0,0,0)}static getBarycoord(t,e,n,r,s){gn.subVectors(r,e),Fn.subVectors(n,e),xa.subVectors(t,e);const a=gn.dot(gn),o=gn.dot(Fn),c=gn.dot(xa),l=Fn.dot(Fn),h=Fn.dot(xa),u=a*l-o*o;if(u===0)return s.set(0,0,0),null;const d=1/u,f=(l*c-o*h)*d,m=(a*h-o*c)*d;return s.set(1-f-m,m,f)}static containsPoint(t,e,n,r){return this.getBarycoord(t,e,n,r,On)===null?!1:On.x>=0&&On.y>=0&&On.x+On.y<=1}static getInterpolation(t,e,n,r,s,a,o,c){return this.getBarycoord(t,e,n,r,On)===null?(c.x=0,c.y=0,"z"in c&&(c.z=0),"w"in c&&(c.w=0),null):(c.setScalar(0),c.addScaledVector(s,On.x),c.addScaledVector(a,On.y),c.addScaledVector(o,On.z),c)}static getInterpolatedAttribute(t,e,n,r,s,a){return ba.setScalar(0),Ea.setScalar(0),Ta.setScalar(0),ba.fromBufferAttribute(t,e),Ea.fromBufferAttribute(t,n),Ta.fromBufferAttribute(t,r),a.setScalar(0),a.addScaledVector(ba,s.x),a.addScaledVector(Ea,s.y),a.addScaledVector(Ta,s.z),a}static isFrontFacing(t,e,n,r){return gn.subVectors(n,e),Fn.subVectors(t,e),gn.cross(Fn).dot(r)<0}set(t,e,n){return this.a.copy(t),this.b.copy(e),this.c.copy(n),this}setFromPointsAndIndices(t,e,n,r){return this.a.copy(t[e]),this.b.copy(t[n]),this.c.copy(t[r]),this}setFromAttributeAndIndices(t,e,n,r){return this.a.fromBufferAttribute(t,e),this.b.fromBufferAttribute(t,n),this.c.fromBufferAttribute(t,r),this}clone(){return new this.constructor().copy(this)}copy(t){return this.a.copy(t.a),this.b.copy(t.b),this.c.copy(t.c),this}getArea(){return gn.subVectors(this.c,this.b),Fn.subVectors(this.a,this.b),gn.cross(Fn).length()*.5}getMidpoint(t){return t.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(t){return xn.getNormal(this.a,this.b,this.c,t)}getPlane(t){return t.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,e){return xn.getBarycoord(t,this.a,this.b,this.c,e)}getInterpolation(t,e,n,r,s){return xn.getInterpolation(t,this.a,this.b,this.c,e,n,r,s)}containsPoint(t){return xn.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return xn.isFrontFacing(this.a,this.b,this.c,t)}intersectsBox(t){return t.intersectsTriangle(this)}closestPointToPoint(t,e){const n=this.a,r=this.b,s=this.c;let a,o;Yi.subVectors(r,n),$i.subVectors(s,n),Ma.subVectors(t,n);const c=Yi.dot(Ma),l=$i.dot(Ma);if(c<=0&&l<=0)return e.copy(n);Sa.subVectors(t,r);const h=Yi.dot(Sa),u=$i.dot(Sa);if(h>=0&&u<=h)return e.copy(r);const d=c*u-h*l;if(d<=0&&c>=0&&h<=0)return a=c/(c-h),e.copy(n).addScaledVector(Yi,a);ya.subVectors(t,s);const f=Yi.dot(ya),m=$i.dot(ya);if(m>=0&&f<=m)return e.copy(s);const x=f*l-c*m;if(x<=0&&l>=0&&m<=0)return o=l/(l-m),e.copy(n).addScaledVector($i,o);const g=h*m-f*u;if(g<=0&&u-h>=0&&f-m>=0)return jc.subVectors(s,r),o=(u-h)/(u-h+(f-m)),e.copy(r).addScaledVector(jc,o);const p=1/(g+x+d);return a=x*p,o=d*p,e.copy(n).addScaledVector(Yi,a).addScaledVector($i,o)}equals(t){return t.a.equals(this.a)&&t.b.equals(this.b)&&t.c.equals(this.c)}}const Ph={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},jn={h:0,s:0,l:0},ms={h:0,s:0,l:0};function wa(i,t,e){return e<0&&(e+=1),e>1&&(e-=1),e<1/6?i+(t-i)*6*e:e<1/2?t:e<2/3?i+(t-i)*6*(2/3-e):i}class Yt{constructor(t,e,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(t,e,n)}set(t,e,n){if(e===void 0&&n===void 0){const r=t;r&&r.isColor?this.copy(r):typeof r=="number"?this.setHex(r):typeof r=="string"&&this.setStyle(r)}else this.setRGB(t,e,n);return this}setScalar(t){return this.r=t,this.g=t,this.b=t,this}setHex(t,e=Qe){return t=Math.floor(t),this.r=(t>>16&255)/255,this.g=(t>>8&255)/255,this.b=(t&255)/255,se.colorSpaceToWorking(this,e),this}setRGB(t,e,n,r=se.workingColorSpace){return this.r=t,this.g=e,this.b=n,se.colorSpaceToWorking(this,r),this}setHSL(t,e,n,r=se.workingColorSpace){if(t=ec(t,1),e=Qt(e,0,1),n=Qt(n,0,1),e===0)this.r=this.g=this.b=n;else{const s=n<=.5?n*(1+e):n+e-n*e,a=2*n-s;this.r=wa(a,s,t+1/3),this.g=wa(a,s,t),this.b=wa(a,s,t-1/3)}return se.colorSpaceToWorking(this,r),this}setStyle(t,e=Qe){function n(s){s!==void 0&&parseFloat(s)<1&&console.warn("THREE.Color: Alpha component of "+t+" will be ignored.")}let r;if(r=/^(\w+)\(([^\)]*)\)/.exec(t)){let s;const a=r[1],o=r[2];switch(a){case"rgb":case"rgba":if(s=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(s[4]),this.setRGB(Math.min(255,parseInt(s[1],10))/255,Math.min(255,parseInt(s[2],10))/255,Math.min(255,parseInt(s[3],10))/255,e);if(s=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(s[4]),this.setRGB(Math.min(100,parseInt(s[1],10))/100,Math.min(100,parseInt(s[2],10))/100,Math.min(100,parseInt(s[3],10))/100,e);break;case"hsl":case"hsla":if(s=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(s[4]),this.setHSL(parseFloat(s[1])/360,parseFloat(s[2])/100,parseFloat(s[3])/100,e);break;default:console.warn("THREE.Color: Unknown color model "+t)}}else if(r=/^\#([A-Fa-f\d]+)$/.exec(t)){const s=r[1],a=s.length;if(a===3)return this.setRGB(parseInt(s.charAt(0),16)/15,parseInt(s.charAt(1),16)/15,parseInt(s.charAt(2),16)/15,e);if(a===6)return this.setHex(parseInt(s,16),e);console.warn("THREE.Color: Invalid hex color "+t)}else if(t&&t.length>0)return this.setColorName(t,e);return this}setColorName(t,e=Qe){const n=Ph[t.toLowerCase()];return n!==void 0?this.setHex(n,e):console.warn("THREE.Color: Unknown color "+t),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(t){return this.r=t.r,this.g=t.g,this.b=t.b,this}copySRGBToLinear(t){return this.r=Vn(t.r),this.g=Vn(t.g),this.b=Vn(t.b),this}copyLinearToSRGB(t){return this.r=lr(t.r),this.g=lr(t.g),this.b=lr(t.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(t=Qe){return se.workingToColorSpace(Ue.copy(this),t),Math.round(Qt(Ue.r*255,0,255))*65536+Math.round(Qt(Ue.g*255,0,255))*256+Math.round(Qt(Ue.b*255,0,255))}getHexString(t=Qe){return("000000"+this.getHex(t).toString(16)).slice(-6)}getHSL(t,e=se.workingColorSpace){se.workingToColorSpace(Ue.copy(this),e);const n=Ue.r,r=Ue.g,s=Ue.b,a=Math.max(n,r,s),o=Math.min(n,r,s);let c,l;const h=(o+a)/2;if(o===a)c=0,l=0;else{const u=a-o;switch(l=h<=.5?u/(a+o):u/(2-a-o),a){case n:c=(r-s)/u+(r<s?6:0);break;case r:c=(s-n)/u+2;break;case s:c=(n-r)/u+4;break}c/=6}return t.h=c,t.s=l,t.l=h,t}getRGB(t,e=se.workingColorSpace){return se.workingToColorSpace(Ue.copy(this),e),t.r=Ue.r,t.g=Ue.g,t.b=Ue.b,t}getStyle(t=Qe){se.workingToColorSpace(Ue.copy(this),t);const e=Ue.r,n=Ue.g,r=Ue.b;return t!==Qe?`color(${t} ${e.toFixed(3)} ${n.toFixed(3)} ${r.toFixed(3)})`:`rgb(${Math.round(e*255)},${Math.round(n*255)},${Math.round(r*255)})`}offsetHSL(t,e,n){return this.getHSL(jn),this.setHSL(jn.h+t,jn.s+e,jn.l+n)}add(t){return this.r+=t.r,this.g+=t.g,this.b+=t.b,this}addColors(t,e){return this.r=t.r+e.r,this.g=t.g+e.g,this.b=t.b+e.b,this}addScalar(t){return this.r+=t,this.g+=t,this.b+=t,this}sub(t){return this.r=Math.max(0,this.r-t.r),this.g=Math.max(0,this.g-t.g),this.b=Math.max(0,this.b-t.b),this}multiply(t){return this.r*=t.r,this.g*=t.g,this.b*=t.b,this}multiplyScalar(t){return this.r*=t,this.g*=t,this.b*=t,this}lerp(t,e){return this.r+=(t.r-this.r)*e,this.g+=(t.g-this.g)*e,this.b+=(t.b-this.b)*e,this}lerpColors(t,e,n){return this.r=t.r+(e.r-t.r)*n,this.g=t.g+(e.g-t.g)*n,this.b=t.b+(e.b-t.b)*n,this}lerpHSL(t,e){this.getHSL(jn),t.getHSL(ms);const n=Or(jn.h,ms.h,e),r=Or(jn.s,ms.s,e),s=Or(jn.l,ms.l,e);return this.setHSL(n,r,s),this}setFromVector3(t){return this.r=t.x,this.g=t.y,this.b=t.z,this}applyMatrix3(t){const e=this.r,n=this.g,r=this.b,s=t.elements;return this.r=s[0]*e+s[3]*n+s[6]*r,this.g=s[1]*e+s[4]*n+s[7]*r,this.b=s[2]*e+s[5]*n+s[8]*r,this}equals(t){return t.r===this.r&&t.g===this.g&&t.b===this.b}fromArray(t,e=0){return this.r=t[e],this.g=t[e+1],this.b=t[e+2],this}toArray(t=[],e=0){return t[e]=this.r,t[e+1]=this.g,t[e+2]=this.b,t}fromBufferAttribute(t,e){return this.r=t.getX(e),this.g=t.getY(e),this.b=t.getZ(e),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const Ue=new Yt;Yt.NAMES=Ph;let vd=0;class Qr extends xr{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:vd++}),this.uuid=hi(),this.name="",this.type="Material",this.blending=cr,this.side=ci,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=Qa,this.blendDst=to,this.blendEquation=Si,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Yt(0,0,0),this.blendAlpha=0,this.depthFunc=fr,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=Oc,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=ki,this.stencilZFail=ki,this.stencilZPass=ki,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(t){this._alphaTest>0!=t>0&&this.version++,this._alphaTest=t}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(t){if(t!==void 0)for(const e in t){const n=t[e];if(n===void 0){console.warn(`THREE.Material: parameter '${e}' has value of undefined.`);continue}const r=this[e];if(r===void 0){console.warn(`THREE.Material: '${e}' is not a property of THREE.${this.type}.`);continue}r&&r.isColor?r.set(n):r&&r.isVector3&&n&&n.isVector3?r.copy(n):this[e]=n}}toJSON(t){const e=t===void 0||typeof t=="string";e&&(t={textures:{},images:{}});const n={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(t).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(t).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(t).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(n.sheenColorMap=this.sheenColorMap.toJSON(t).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(n.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(t).uuid),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(t).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(t).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(t).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(t).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(t).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(t).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(t).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(t).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(t).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(t).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(t).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(t).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(t).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(t).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(t).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(t).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(t).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(t).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(t).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(t).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(t).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==cr&&(n.blending=this.blending),this.side!==ci&&(n.side=this.side),this.vertexColors===!0&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=!0),this.blendSrc!==Qa&&(n.blendSrc=this.blendSrc),this.blendDst!==to&&(n.blendDst=this.blendDst),this.blendEquation!==Si&&(n.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(n.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(n.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(n.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(n.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(n.blendAlpha=this.blendAlpha),this.depthFunc!==fr&&(n.depthFunc=this.depthFunc),this.depthTest===!1&&(n.depthTest=this.depthTest),this.depthWrite===!1&&(n.depthWrite=this.depthWrite),this.colorWrite===!1&&(n.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(n.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==Oc&&(n.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(n.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(n.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==ki&&(n.stencilFail=this.stencilFail),this.stencilZFail!==ki&&(n.stencilZFail=this.stencilZFail),this.stencilZPass!==ki&&(n.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(n.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=!0),this.alphaToCoverage===!0&&(n.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=!0),this.forceSinglePass===!0&&(n.forceSinglePass=!0),this.wireframe===!0&&(n.wireframe=!0),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=!0),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData);function r(s){const a=[];for(const o in s){const c=s[o];delete c.metadata,a.push(c)}return a}if(e){const s=r(t.textures),a=r(t.images);s.length>0&&(n.textures=s),a.length>0&&(n.images=a)}return n}clone(){return new this.constructor().copy(this)}copy(t){this.name=t.name,this.blending=t.blending,this.side=t.side,this.vertexColors=t.vertexColors,this.opacity=t.opacity,this.transparent=t.transparent,this.blendSrc=t.blendSrc,this.blendDst=t.blendDst,this.blendEquation=t.blendEquation,this.blendSrcAlpha=t.blendSrcAlpha,this.blendDstAlpha=t.blendDstAlpha,this.blendEquationAlpha=t.blendEquationAlpha,this.blendColor.copy(t.blendColor),this.blendAlpha=t.blendAlpha,this.depthFunc=t.depthFunc,this.depthTest=t.depthTest,this.depthWrite=t.depthWrite,this.stencilWriteMask=t.stencilWriteMask,this.stencilFunc=t.stencilFunc,this.stencilRef=t.stencilRef,this.stencilFuncMask=t.stencilFuncMask,this.stencilFail=t.stencilFail,this.stencilZFail=t.stencilZFail,this.stencilZPass=t.stencilZPass,this.stencilWrite=t.stencilWrite;const e=t.clippingPlanes;let n=null;if(e!==null){const r=e.length;n=new Array(r);for(let s=0;s!==r;++s)n[s]=e[s].clone()}return this.clippingPlanes=n,this.clipIntersection=t.clipIntersection,this.clipShadows=t.clipShadows,this.shadowSide=t.shadowSide,this.colorWrite=t.colorWrite,this.precision=t.precision,this.polygonOffset=t.polygonOffset,this.polygonOffsetFactor=t.polygonOffsetFactor,this.polygonOffsetUnits=t.polygonOffsetUnits,this.dithering=t.dithering,this.alphaTest=t.alphaTest,this.alphaHash=t.alphaHash,this.alphaToCoverage=t.alphaToCoverage,this.premultipliedAlpha=t.premultipliedAlpha,this.forceSinglePass=t.forceSinglePass,this.visible=t.visible,this.toneMapped=t.toneMapped,this.userData=JSON.parse(JSON.stringify(t.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(t){t===!0&&this.version++}}class ta extends Qr{constructor(t){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new Yt(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new dn,this.combine=ph,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.fog=t.fog,this}}const zn=_d();function _d(){const i=new ArrayBuffer(4),t=new Float32Array(i),e=new Uint32Array(i),n=new Uint32Array(512),r=new Uint32Array(512);for(let c=0;c<256;++c){const l=c-127;l<-27?(n[c]=0,n[c|256]=32768,r[c]=24,r[c|256]=24):l<-14?(n[c]=1024>>-l-14,n[c|256]=1024>>-l-14|32768,r[c]=-l-1,r[c|256]=-l-1):l<=15?(n[c]=l+15<<10,n[c|256]=l+15<<10|32768,r[c]=13,r[c|256]=13):l<128?(n[c]=31744,n[c|256]=64512,r[c]=24,r[c|256]=24):(n[c]=31744,n[c|256]=64512,r[c]=13,r[c|256]=13)}const s=new Uint32Array(2048),a=new Uint32Array(64),o=new Uint32Array(64);for(let c=1;c<1024;++c){let l=c<<13,h=0;for(;(l&8388608)===0;)l<<=1,h-=8388608;l&=-8388609,h+=947912704,s[c]=l|h}for(let c=1024;c<2048;++c)s[c]=939524096+(c-1024<<13);for(let c=1;c<31;++c)a[c]=c<<23;a[31]=1199570944,a[32]=2147483648;for(let c=33;c<63;++c)a[c]=2147483648+(c-32<<23);a[63]=3347054592;for(let c=1;c<64;++c)c!==32&&(o[c]=1024);return{floatView:t,uint32View:e,baseTable:n,shiftTable:r,mantissaTable:s,exponentTable:a,offsetTable:o}}function xd(i){Math.abs(i)>65504&&console.warn("THREE.DataUtils.toHalfFloat(): Value out of range."),i=Qt(i,-65504,65504),zn.floatView[0]=i;const t=zn.uint32View[0],e=t>>23&511;return zn.baseTable[e]+((t&8388607)>>zn.shiftTable[e])}function Md(i){const t=i>>10;return zn.uint32View[0]=zn.mantissaTable[zn.offsetTable[t]+(i&1023)]+zn.exponentTable[t],zn.floatView[0]}class gs{static toHalfFloat(t){return xd(t)}static fromHalfFloat(t){return Md(t)}}const be=new O,vs=new St;let Sd=0;class me{constructor(t,e,n=!1){if(Array.isArray(t))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:Sd++}),this.name="",this.array=t,this.itemSize=e,this.count=t!==void 0?t.length/e:0,this.normalized=n,this.usage=Bc,this.updateRanges=[],this.gpuType=An,this.version=0}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.name=t.name,this.array=new t.array.constructor(t.array),this.itemSize=t.itemSize,this.count=t.count,this.normalized=t.normalized,this.usage=t.usage,this.gpuType=t.gpuType,this}copyAt(t,e,n){t*=this.itemSize,n*=e.itemSize;for(let r=0,s=this.itemSize;r<s;r++)this.array[t+r]=e.array[n+r];return this}copyArray(t){return this.array.set(t),this}applyMatrix3(t){if(this.itemSize===2)for(let e=0,n=this.count;e<n;e++)vs.fromBufferAttribute(this,e),vs.applyMatrix3(t),this.setXY(e,vs.x,vs.y);else if(this.itemSize===3)for(let e=0,n=this.count;e<n;e++)be.fromBufferAttribute(this,e),be.applyMatrix3(t),this.setXYZ(e,be.x,be.y,be.z);return this}applyMatrix4(t){for(let e=0,n=this.count;e<n;e++)be.fromBufferAttribute(this,e),be.applyMatrix4(t),this.setXYZ(e,be.x,be.y,be.z);return this}applyNormalMatrix(t){for(let e=0,n=this.count;e<n;e++)be.fromBufferAttribute(this,e),be.applyNormalMatrix(t),this.setXYZ(e,be.x,be.y,be.z);return this}transformDirection(t){for(let e=0,n=this.count;e<n;e++)be.fromBufferAttribute(this,e),be.transformDirection(t),this.setXYZ(e,be.x,be.y,be.z);return this}set(t,e=0){return this.array.set(t,e),this}getComponent(t,e){let n=this.array[t*this.itemSize+e];return this.normalized&&(n=nr(n,this.array)),n}setComponent(t,e,n){return this.normalized&&(n=ke(n,this.array)),this.array[t*this.itemSize+e]=n,this}getX(t){let e=this.array[t*this.itemSize];return this.normalized&&(e=nr(e,this.array)),e}setX(t,e){return this.normalized&&(e=ke(e,this.array)),this.array[t*this.itemSize]=e,this}getY(t){let e=this.array[t*this.itemSize+1];return this.normalized&&(e=nr(e,this.array)),e}setY(t,e){return this.normalized&&(e=ke(e,this.array)),this.array[t*this.itemSize+1]=e,this}getZ(t){let e=this.array[t*this.itemSize+2];return this.normalized&&(e=nr(e,this.array)),e}setZ(t,e){return this.normalized&&(e=ke(e,this.array)),this.array[t*this.itemSize+2]=e,this}getW(t){let e=this.array[t*this.itemSize+3];return this.normalized&&(e=nr(e,this.array)),e}setW(t,e){return this.normalized&&(e=ke(e,this.array)),this.array[t*this.itemSize+3]=e,this}setXY(t,e,n){return t*=this.itemSize,this.normalized&&(e=ke(e,this.array),n=ke(n,this.array)),this.array[t+0]=e,this.array[t+1]=n,this}setXYZ(t,e,n,r){return t*=this.itemSize,this.normalized&&(e=ke(e,this.array),n=ke(n,this.array),r=ke(r,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=r,this}setXYZW(t,e,n,r,s){return t*=this.itemSize,this.normalized&&(e=ke(e,this.array),n=ke(n,this.array),r=ke(r,this.array),s=ke(s,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=r,this.array[t+3]=s,this}onUpload(t){return this.onUploadCallback=t,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const t={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(t.name=this.name),this.usage!==Bc&&(t.usage=this.usage),t}}class Dh extends me{constructor(t,e,n){super(new Uint16Array(t),e,n)}}class Ih extends me{constructor(t,e,n){super(new Uint32Array(t),e,n)}}class he extends me{constructor(t,e,n){super(new Float32Array(t),e,n)}}let yd=0;const an=new ie,Aa=new Ce,Ji=new O,je=new Mr,Rr=new Mr,Re=new O;class Le extends xr{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:yd++}),this.uuid=hi(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(t){return Array.isArray(t)?this.index=new(Ah(t)?Ih:Dh)(t,1):this.index=t,this}setIndirect(t){return this.indirect=t,this}getIndirect(){return this.indirect}getAttribute(t){return this.attributes[t]}setAttribute(t,e){return this.attributes[t]=e,this}deleteAttribute(t){return delete this.attributes[t],this}hasAttribute(t){return this.attributes[t]!==void 0}addGroup(t,e,n=0){this.groups.push({start:t,count:e,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(t,e){this.drawRange.start=t,this.drawRange.count=e}applyMatrix4(t){const e=this.attributes.position;e!==void 0&&(e.applyMatrix4(t),e.needsUpdate=!0);const n=this.attributes.normal;if(n!==void 0){const s=new Kt().getNormalMatrix(t);n.applyNormalMatrix(s),n.needsUpdate=!0}const r=this.attributes.tangent;return r!==void 0&&(r.transformDirection(t),r.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(t){return an.makeRotationFromQuaternion(t),this.applyMatrix4(an),this}rotateX(t){return an.makeRotationX(t),this.applyMatrix4(an),this}rotateY(t){return an.makeRotationY(t),this.applyMatrix4(an),this}rotateZ(t){return an.makeRotationZ(t),this.applyMatrix4(an),this}translate(t,e,n){return an.makeTranslation(t,e,n),this.applyMatrix4(an),this}scale(t,e,n){return an.makeScale(t,e,n),this.applyMatrix4(an),this}lookAt(t){return Aa.lookAt(t),Aa.updateMatrix(),this.applyMatrix4(Aa.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Ji).negate(),this.translate(Ji.x,Ji.y,Ji.z),this}setFromPoints(t){const e=this.getAttribute("position");if(e===void 0){const n=[];for(let r=0,s=t.length;r<s;r++){const a=t[r];n.push(a.x,a.y,a.z||0)}this.setAttribute("position",new he(n,3))}else{const n=Math.min(t.length,e.count);for(let r=0;r<n;r++){const s=t[r];e.setXYZ(r,s.x,s.y,s.z||0)}t.length>e.count&&console.warn("THREE.BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),e.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new Mr);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new O(-1/0,-1/0,-1/0),new O(1/0,1/0,1/0));return}if(t!==void 0){if(this.boundingBox.setFromBufferAttribute(t),e)for(let n=0,r=e.length;n<r;n++){const s=e[n];je.setFromBufferAttribute(s),this.morphTargetsRelative?(Re.addVectors(this.boundingBox.min,je.min),this.boundingBox.expandByPoint(Re),Re.addVectors(this.boundingBox.max,je.max),this.boundingBox.expandByPoint(Re)):(this.boundingBox.expandByPoint(je.min),this.boundingBox.expandByPoint(je.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Sr);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new O,1/0);return}if(t){const n=this.boundingSphere.center;if(je.setFromBufferAttribute(t),e)for(let s=0,a=e.length;s<a;s++){const o=e[s];Rr.setFromBufferAttribute(o),this.morphTargetsRelative?(Re.addVectors(je.min,Rr.min),je.expandByPoint(Re),Re.addVectors(je.max,Rr.max),je.expandByPoint(Re)):(je.expandByPoint(Rr.min),je.expandByPoint(Rr.max))}je.getCenter(n);let r=0;for(let s=0,a=t.count;s<a;s++)Re.fromBufferAttribute(t,s),r=Math.max(r,n.distanceToSquared(Re));if(e)for(let s=0,a=e.length;s<a;s++){const o=e[s],c=this.morphTargetsRelative;for(let l=0,h=o.count;l<h;l++)Re.fromBufferAttribute(o,l),c&&(Ji.fromBufferAttribute(t,l),Re.add(Ji)),r=Math.max(r,n.distanceToSquared(Re))}this.boundingSphere.radius=Math.sqrt(r),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const t=this.index,e=this.attributes;if(t===null||e.position===void 0||e.normal===void 0||e.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const n=e.position,r=e.normal,s=e.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new me(new Float32Array(4*n.count),4));const a=this.getAttribute("tangent"),o=[],c=[];for(let C=0;C<n.count;C++)o[C]=new O,c[C]=new O;const l=new O,h=new O,u=new O,d=new St,f=new St,m=new St,x=new O,g=new O;function p(C,v,_){l.fromBufferAttribute(n,C),h.fromBufferAttribute(n,v),u.fromBufferAttribute(n,_),d.fromBufferAttribute(s,C),f.fromBufferAttribute(s,v),m.fromBufferAttribute(s,_),h.sub(l),u.sub(l),f.sub(d),m.sub(d);const S=1/(f.x*m.y-m.x*f.y);isFinite(S)&&(x.copy(h).multiplyScalar(m.y).addScaledVector(u,-f.y).multiplyScalar(S),g.copy(u).multiplyScalar(f.x).addScaledVector(h,-m.x).multiplyScalar(S),o[C].add(x),o[v].add(x),o[_].add(x),c[C].add(g),c[v].add(g),c[_].add(g))}let T=this.groups;T.length===0&&(T=[{start:0,count:t.count}]);for(let C=0,v=T.length;C<v;++C){const _=T[C],S=_.start,b=_.count;for(let D=S,U=S+b;D<U;D+=3)p(t.getX(D+0),t.getX(D+1),t.getX(D+2))}const y=new O,M=new O,w=new O,E=new O;function A(C){w.fromBufferAttribute(r,C),E.copy(w);const v=o[C];y.copy(v),y.sub(w.multiplyScalar(w.dot(v))).normalize(),M.crossVectors(E,v);const S=M.dot(c[C])<0?-1:1;a.setXYZW(C,y.x,y.y,y.z,S)}for(let C=0,v=T.length;C<v;++C){const _=T[C],S=_.start,b=_.count;for(let D=S,U=S+b;D<U;D+=3)A(t.getX(D+0)),A(t.getX(D+1)),A(t.getX(D+2))}}computeVertexNormals(){const t=this.index,e=this.getAttribute("position");if(e!==void 0){let n=this.getAttribute("normal");if(n===void 0)n=new me(new Float32Array(e.count*3),3),this.setAttribute("normal",n);else for(let d=0,f=n.count;d<f;d++)n.setXYZ(d,0,0,0);const r=new O,s=new O,a=new O,o=new O,c=new O,l=new O,h=new O,u=new O;if(t)for(let d=0,f=t.count;d<f;d+=3){const m=t.getX(d+0),x=t.getX(d+1),g=t.getX(d+2);r.fromBufferAttribute(e,m),s.fromBufferAttribute(e,x),a.fromBufferAttribute(e,g),h.subVectors(a,s),u.subVectors(r,s),h.cross(u),o.fromBufferAttribute(n,m),c.fromBufferAttribute(n,x),l.fromBufferAttribute(n,g),o.add(h),c.add(h),l.add(h),n.setXYZ(m,o.x,o.y,o.z),n.setXYZ(x,c.x,c.y,c.z),n.setXYZ(g,l.x,l.y,l.z)}else for(let d=0,f=e.count;d<f;d+=3)r.fromBufferAttribute(e,d+0),s.fromBufferAttribute(e,d+1),a.fromBufferAttribute(e,d+2),h.subVectors(a,s),u.subVectors(r,s),h.cross(u),n.setXYZ(d+0,h.x,h.y,h.z),n.setXYZ(d+1,h.x,h.y,h.z),n.setXYZ(d+2,h.x,h.y,h.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){const t=this.attributes.normal;for(let e=0,n=t.count;e<n;e++)Re.fromBufferAttribute(t,e),Re.normalize(),t.setXYZ(e,Re.x,Re.y,Re.z)}toNonIndexed(){function t(o,c){const l=o.array,h=o.itemSize,u=o.normalized,d=new l.constructor(c.length*h);let f=0,m=0;for(let x=0,g=c.length;x<g;x++){o.isInterleavedBufferAttribute?f=c[x]*o.data.stride+o.offset:f=c[x]*h;for(let p=0;p<h;p++)d[m++]=l[f++]}return new me(d,h,u)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const e=new Le,n=this.index.array,r=this.attributes;for(const o in r){const c=r[o],l=t(c,n);e.setAttribute(o,l)}const s=this.morphAttributes;for(const o in s){const c=[],l=s[o];for(let h=0,u=l.length;h<u;h++){const d=l[h],f=t(d,n);c.push(f)}e.morphAttributes[o]=c}e.morphTargetsRelative=this.morphTargetsRelative;const a=this.groups;for(let o=0,c=a.length;o<c;o++){const l=a[o];e.addGroup(l.start,l.count,l.materialIndex)}return e}toJSON(){const t={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(t.uuid=this.uuid,t.type=this.type,this.name!==""&&(t.name=this.name),Object.keys(this.userData).length>0&&(t.userData=this.userData),this.parameters!==void 0){const c=this.parameters;for(const l in c)c[l]!==void 0&&(t[l]=c[l]);return t}t.data={attributes:{}};const e=this.index;e!==null&&(t.data.index={type:e.array.constructor.name,array:Array.prototype.slice.call(e.array)});const n=this.attributes;for(const c in n){const l=n[c];t.data.attributes[c]=l.toJSON(t.data)}const r={};let s=!1;for(const c in this.morphAttributes){const l=this.morphAttributes[c],h=[];for(let u=0,d=l.length;u<d;u++){const f=l[u];h.push(f.toJSON(t.data))}h.length>0&&(r[c]=h,s=!0)}s&&(t.data.morphAttributes=r,t.data.morphTargetsRelative=this.morphTargetsRelative);const a=this.groups;a.length>0&&(t.data.groups=JSON.parse(JSON.stringify(a)));const o=this.boundingSphere;return o!==null&&(t.data.boundingSphere=o.toJSON()),t}clone(){return new this.constructor().copy(this)}copy(t){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const e={};this.name=t.name;const n=t.index;n!==null&&this.setIndex(n.clone());const r=t.attributes;for(const l in r){const h=r[l];this.setAttribute(l,h.clone(e))}const s=t.morphAttributes;for(const l in s){const h=[],u=s[l];for(let d=0,f=u.length;d<f;d++)h.push(u[d].clone(e));this.morphAttributes[l]=h}this.morphTargetsRelative=t.morphTargetsRelative;const a=t.groups;for(let l=0,h=a.length;l<h;l++){const u=a[l];this.addGroup(u.start,u.count,u.materialIndex)}const o=t.boundingBox;o!==null&&(this.boundingBox=o.clone());const c=t.boundingSphere;return c!==null&&(this.boundingSphere=c.clone()),this.drawRange.start=t.drawRange.start,this.drawRange.count=t.drawRange.count,this.userData=t.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const Qc=new ie,mi=new Ch,_s=new Sr,tl=new O,xs=new O,Ms=new O,Ss=new O,Ra=new O,ys=new O,el=new O,bs=new O;class ee extends Ce{constructor(t=new Le,e=new ta){super(),this.isMesh=!0,this.type="Mesh",this.geometry=t,this.material=e,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),t.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=t.morphTargetInfluences.slice()),t.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},t.morphTargetDictionary)),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}updateMorphTargets(){const e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){const r=e[n[0]];if(r!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,a=r.length;s<a;s++){const o=r[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=s}}}}getVertexPosition(t,e){const n=this.geometry,r=n.attributes.position,s=n.morphAttributes.position,a=n.morphTargetsRelative;e.fromBufferAttribute(r,t);const o=this.morphTargetInfluences;if(s&&o){ys.set(0,0,0);for(let c=0,l=s.length;c<l;c++){const h=o[c],u=s[c];h!==0&&(Ra.fromBufferAttribute(u,t),a?ys.addScaledVector(Ra,h):ys.addScaledVector(Ra.sub(e),h))}e.add(ys)}return e}raycast(t,e){const n=this.geometry,r=this.material,s=this.matrixWorld;r!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),_s.copy(n.boundingSphere),_s.applyMatrix4(s),mi.copy(t.ray).recast(t.near),!(_s.containsPoint(mi.origin)===!1&&(mi.intersectSphere(_s,tl)===null||mi.origin.distanceToSquared(tl)>(t.far-t.near)**2))&&(Qc.copy(s).invert(),mi.copy(t.ray).applyMatrix4(Qc),!(n.boundingBox!==null&&mi.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(t,e,mi)))}_computeIntersections(t,e,n){let r;const s=this.geometry,a=this.material,o=s.index,c=s.attributes.position,l=s.attributes.uv,h=s.attributes.uv1,u=s.attributes.normal,d=s.groups,f=s.drawRange;if(o!==null)if(Array.isArray(a))for(let m=0,x=d.length;m<x;m++){const g=d[m],p=a[g.materialIndex],T=Math.max(g.start,f.start),y=Math.min(o.count,Math.min(g.start+g.count,f.start+f.count));for(let M=T,w=y;M<w;M+=3){const E=o.getX(M),A=o.getX(M+1),C=o.getX(M+2);r=Es(this,p,t,n,l,h,u,E,A,C),r&&(r.faceIndex=Math.floor(M/3),r.face.materialIndex=g.materialIndex,e.push(r))}}else{const m=Math.max(0,f.start),x=Math.min(o.count,f.start+f.count);for(let g=m,p=x;g<p;g+=3){const T=o.getX(g),y=o.getX(g+1),M=o.getX(g+2);r=Es(this,a,t,n,l,h,u,T,y,M),r&&(r.faceIndex=Math.floor(g/3),e.push(r))}}else if(c!==void 0)if(Array.isArray(a))for(let m=0,x=d.length;m<x;m++){const g=d[m],p=a[g.materialIndex],T=Math.max(g.start,f.start),y=Math.min(c.count,Math.min(g.start+g.count,f.start+f.count));for(let M=T,w=y;M<w;M+=3){const E=M,A=M+1,C=M+2;r=Es(this,p,t,n,l,h,u,E,A,C),r&&(r.faceIndex=Math.floor(M/3),r.face.materialIndex=g.materialIndex,e.push(r))}}else{const m=Math.max(0,f.start),x=Math.min(c.count,f.start+f.count);for(let g=m,p=x;g<p;g+=3){const T=g,y=g+1,M=g+2;r=Es(this,a,t,n,l,h,u,T,y,M),r&&(r.faceIndex=Math.floor(g/3),e.push(r))}}}}function bd(i,t,e,n,r,s,a,o){let c;if(t.side===$e?c=n.intersectTriangle(a,s,r,!0,o):c=n.intersectTriangle(r,s,a,t.side===ci,o),c===null)return null;bs.copy(o),bs.applyMatrix4(i.matrixWorld);const l=e.ray.origin.distanceTo(bs);return l<e.near||l>e.far?null:{distance:l,point:bs.clone(),object:i}}function Es(i,t,e,n,r,s,a,o,c,l){i.getVertexPosition(o,xs),i.getVertexPosition(c,Ms),i.getVertexPosition(l,Ss);const h=bd(i,t,e,n,xs,Ms,Ss,el);if(h){const u=new O;xn.getBarycoord(el,xs,Ms,Ss,u),r&&(h.uv=xn.getInterpolatedAttribute(r,o,c,l,u,new St)),s&&(h.uv1=xn.getInterpolatedAttribute(s,o,c,l,u,new St)),a&&(h.normal=xn.getInterpolatedAttribute(a,o,c,l,u,new O),h.normal.dot(n.direction)>0&&h.normal.multiplyScalar(-1));const d={a:o,b:c,c:l,normal:new O,materialIndex:0};xn.getNormal(xs,Ms,Ss,d.normal),h.face=d,h.barycoord=u}return h}class Ge extends Le{constructor(t=1,e=1,n=1,r=1,s=1,a=1){super(),this.type="BoxGeometry",this.parameters={width:t,height:e,depth:n,widthSegments:r,heightSegments:s,depthSegments:a};const o=this;r=Math.floor(r),s=Math.floor(s),a=Math.floor(a);const c=[],l=[],h=[],u=[];let d=0,f=0;m("z","y","x",-1,-1,n,e,t,a,s,0),m("z","y","x",1,-1,n,e,-t,a,s,1),m("x","z","y",1,1,t,n,e,r,a,2),m("x","z","y",1,-1,t,n,-e,r,a,3),m("x","y","z",1,-1,t,e,n,r,s,4),m("x","y","z",-1,-1,t,e,-n,r,s,5),this.setIndex(c),this.setAttribute("position",new he(l,3)),this.setAttribute("normal",new he(h,3)),this.setAttribute("uv",new he(u,2));function m(x,g,p,T,y,M,w,E,A,C,v){const _=M/A,S=w/C,b=M/2,D=w/2,U=E/2,N=A+1,B=C+1;let Z=0,H=0;const st=new O;for(let ht=0;ht<B;ht++){const pt=ht*S-D;for(let _t=0;_t<N;_t++){const Et=_t*_-b;st[x]=Et*T,st[g]=pt*y,st[p]=U,l.push(st.x,st.y,st.z),st[x]=0,st[g]=0,st[p]=E>0?1:-1,h.push(st.x,st.y,st.z),u.push(_t/A),u.push(1-ht/C),Z+=1}}for(let ht=0;ht<C;ht++)for(let pt=0;pt<A;pt++){const _t=d+pt+N*ht,Et=d+pt+N*(ht+1),zt=d+(pt+1)+N*(ht+1),Vt=d+(pt+1)+N*ht;c.push(_t,Et,Vt),c.push(Et,zt,Vt),H+=6}o.addGroup(f,H,v),f+=H,d+=Z}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Ge(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}}function mr(i){const t={};for(const e in i){t[e]={};for(const n in i[e]){const r=i[e][n];r&&(r.isColor||r.isMatrix3||r.isMatrix4||r.isVector2||r.isVector3||r.isVector4||r.isTexture||r.isQuaternion)?r.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),t[e][n]=null):t[e][n]=r.clone():Array.isArray(r)?t[e][n]=r.slice():t[e][n]=r}}return t}function ze(i){const t={};for(let e=0;e<i.length;e++){const n=mr(i[e]);for(const r in n)t[r]=n[r]}return t}function Ed(i){const t=[];for(let e=0;e<i.length;e++)t.push(i[e].clone());return t}function Uh(i){const t=i.getRenderTarget();return t===null?i.outputColorSpace:t.isXRRenderTarget===!0?t.texture.colorSpace:se.workingColorSpace}const Td={clone:mr,merge:ze};var wd=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,Ad=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class qn extends Qr{constructor(t){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=wd,this.fragmentShader=Ad,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,t!==void 0&&this.setValues(t)}copy(t){return super.copy(t),this.fragmentShader=t.fragmentShader,this.vertexShader=t.vertexShader,this.uniforms=mr(t.uniforms),this.uniformsGroups=Ed(t.uniformsGroups),this.defines=Object.assign({},t.defines),this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.fog=t.fog,this.lights=t.lights,this.clipping=t.clipping,this.extensions=Object.assign({},t.extensions),this.glslVersion=t.glslVersion,this}toJSON(t){const e=super.toJSON(t);e.glslVersion=this.glslVersion,e.uniforms={};for(const r in this.uniforms){const a=this.uniforms[r].value;a&&a.isTexture?e.uniforms[r]={type:"t",value:a.toJSON(t).uuid}:a&&a.isColor?e.uniforms[r]={type:"c",value:a.getHex()}:a&&a.isVector2?e.uniforms[r]={type:"v2",value:a.toArray()}:a&&a.isVector3?e.uniforms[r]={type:"v3",value:a.toArray()}:a&&a.isVector4?e.uniforms[r]={type:"v4",value:a.toArray()}:a&&a.isMatrix3?e.uniforms[r]={type:"m3",value:a.toArray()}:a&&a.isMatrix4?e.uniforms[r]={type:"m4",value:a.toArray()}:e.uniforms[r]={value:a}}Object.keys(this.defines).length>0&&(e.defines=this.defines),e.vertexShader=this.vertexShader,e.fragmentShader=this.fragmentShader,e.lights=this.lights,e.clipping=this.clipping;const n={};for(const r in this.extensions)this.extensions[r]===!0&&(n[r]=!0);return Object.keys(n).length>0&&(e.extensions=n),e}}class Nh extends Ce{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new ie,this.projectionMatrix=new ie,this.projectionMatrixInverse=new ie,this.coordinateSystem=Rn,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(t,e){return super.copy(t,e),this.matrixWorldInverse.copy(t.matrixWorldInverse),this.projectionMatrix.copy(t.projectionMatrix),this.projectionMatrixInverse.copy(t.projectionMatrixInverse),this.coordinateSystem=t.coordinateSystem,this}getWorldDirection(t){return super.getWorldDirection(t).negate()}updateMatrixWorld(t){super.updateMatrixWorld(t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(t,e){super.updateWorldMatrix(t,e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}const Qn=new O,nl=new St,il=new St;class un extends Nh{constructor(t=50,e=1,n=.1,r=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=t,this.zoom=1,this.near=n,this.far=r,this.focus=10,this.aspect=e,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.fov=t.fov,this.zoom=t.zoom,this.near=t.near,this.far=t.far,this.focus=t.focus,this.aspect=t.aspect,this.view=t.view===null?null:Object.assign({},t.view),this.filmGauge=t.filmGauge,this.filmOffset=t.filmOffset,this}setFocalLength(t){const e=.5*this.getFilmHeight()/t;this.fov=qr*2*Math.atan(e),this.updateProjectionMatrix()}getFocalLength(){const t=Math.tan(Fr*.5*this.fov);return .5*this.getFilmHeight()/t}getEffectiveFOV(){return qr*2*Math.atan(Math.tan(Fr*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(t,e,n){Qn.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),e.set(Qn.x,Qn.y).multiplyScalar(-t/Qn.z),Qn.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(Qn.x,Qn.y).multiplyScalar(-t/Qn.z)}getViewSize(t,e){return this.getViewBounds(t,nl,il),e.subVectors(il,nl)}setViewOffset(t,e,n,r,s,a){this.aspect=t/e,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=r,this.view.width=s,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=this.near;let e=t*Math.tan(Fr*.5*this.fov)/this.zoom,n=2*e,r=this.aspect*n,s=-.5*r;const a=this.view;if(this.view!==null&&this.view.enabled){const c=a.fullWidth,l=a.fullHeight;s+=a.offsetX*r/c,e-=a.offsetY*n/l,r*=a.width/c,n*=a.height/l}const o=this.filmOffset;o!==0&&(s+=t*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(s,s+r,e,e-n,t,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.fov=this.fov,e.object.zoom=this.zoom,e.object.near=this.near,e.object.far=this.far,e.object.focus=this.focus,e.object.aspect=this.aspect,this.view!==null&&(e.object.view=Object.assign({},this.view)),e.object.filmGauge=this.filmGauge,e.object.filmOffset=this.filmOffset,e}}const Zi=-90,Ki=1;class Rd extends Ce{constructor(t,e,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;const r=new un(Zi,Ki,t,e);r.layers=this.layers,this.add(r);const s=new un(Zi,Ki,t,e);s.layers=this.layers,this.add(s);const a=new un(Zi,Ki,t,e);a.layers=this.layers,this.add(a);const o=new un(Zi,Ki,t,e);o.layers=this.layers,this.add(o);const c=new un(Zi,Ki,t,e);c.layers=this.layers,this.add(c);const l=new un(Zi,Ki,t,e);l.layers=this.layers,this.add(l)}updateCoordinateSystem(){const t=this.coordinateSystem,e=this.children.concat(),[n,r,s,a,o,c]=e;for(const l of e)this.remove(l);if(t===Rn)n.up.set(0,1,0),n.lookAt(1,0,0),r.up.set(0,1,0),r.lookAt(-1,0,0),s.up.set(0,0,-1),s.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),c.up.set(0,1,0),c.lookAt(0,0,-1);else if(t===Ys)n.up.set(0,-1,0),n.lookAt(-1,0,0),r.up.set(0,-1,0),r.lookAt(1,0,0),s.up.set(0,0,1),s.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),c.up.set(0,-1,0),c.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+t);for(const l of e)this.add(l),l.updateMatrixWorld()}update(t,e){this.parent===null&&this.updateMatrixWorld();const{renderTarget:n,activeMipmapLevel:r}=this;this.coordinateSystem!==t.coordinateSystem&&(this.coordinateSystem=t.coordinateSystem,this.updateCoordinateSystem());const[s,a,o,c,l,h]=this.children,u=t.getRenderTarget(),d=t.getActiveCubeFace(),f=t.getActiveMipmapLevel(),m=t.xr.enabled;t.xr.enabled=!1;const x=n.texture.generateMipmaps;n.texture.generateMipmaps=!1,t.setRenderTarget(n,0,r),t.render(e,s),t.setRenderTarget(n,1,r),t.render(e,a),t.setRenderTarget(n,2,r),t.render(e,o),t.setRenderTarget(n,3,r),t.render(e,c),t.setRenderTarget(n,4,r),t.render(e,l),n.texture.generateMipmaps=x,t.setRenderTarget(n,5,r),t.render(e,h),t.setRenderTarget(u,d,f),t.xr.enabled=m,n.texture.needsPMREMUpdate=!0}}class Fh extends De{constructor(t=[],e=dr,n,r,s,a,o,c,l,h){super(t,e,n,r,s,a,o,c,l,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(t){this.image=t}}class Cd extends Ui{constructor(t=1,e={}){super(t,t,e),this.isWebGLCubeRenderTarget=!0;const n={width:t,height:t,depth:1},r=[n,n,n,n,n,n];this.texture=new Fh(r),this._setTextureOptions(e),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(t,e){this.texture.type=e.type,this.texture.colorSpace=e.colorSpace,this.texture.generateMipmaps=e.generateMipmaps,this.texture.minFilter=e.minFilter,this.texture.magFilter=e.magFilter;const n={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},r=new Ge(5,5,5),s=new qn({name:"CubemapFromEquirect",uniforms:mr(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:$e,blending:ri});s.uniforms.tEquirect.value=e;const a=new ee(r,s),o=e.minFilter;return e.minFilter===wi&&(e.minFilter=Fe),new Rd(1,10,this).update(t,a),e.minFilter=o,a.geometry.dispose(),a.material.dispose(),this}clear(t,e=!0,n=!0,r=!0){const s=t.getRenderTarget();for(let a=0;a<6;a++)t.setRenderTarget(this,a),t.clear(e,n,r);t.setRenderTarget(s)}}class fn extends Ce{constructor(){super(),this.isGroup=!0,this.type="Group"}}const Ld={type:"move"};class Ca{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new fn,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new fn,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new O,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new O),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new fn,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new O,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new O),this._grip}dispatchEvent(t){return this._targetRay!==null&&this._targetRay.dispatchEvent(t),this._grip!==null&&this._grip.dispatchEvent(t),this._hand!==null&&this._hand.dispatchEvent(t),this}connect(t){if(t&&t.hand){const e=this._hand;if(e)for(const n of t.hand.values())this._getHandJoint(e,n)}return this.dispatchEvent({type:"connected",data:t}),this}disconnect(t){return this.dispatchEvent({type:"disconnected",data:t}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(t,e,n){let r=null,s=null,a=null;const o=this._targetRay,c=this._grip,l=this._hand;if(t&&e.session.visibilityState!=="visible-blurred"){if(l&&t.hand){a=!0;for(const x of t.hand.values()){const g=e.getJointPose(x,n),p=this._getHandJoint(l,x);g!==null&&(p.matrix.fromArray(g.transform.matrix),p.matrix.decompose(p.position,p.rotation,p.scale),p.matrixWorldNeedsUpdate=!0,p.jointRadius=g.radius),p.visible=g!==null}const h=l.joints["index-finger-tip"],u=l.joints["thumb-tip"],d=h.position.distanceTo(u.position),f=.02,m=.005;l.inputState.pinching&&d>f+m?(l.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:t.handedness,target:this})):!l.inputState.pinching&&d<=f-m&&(l.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:t.handedness,target:this}))}else c!==null&&t.gripSpace&&(s=e.getPose(t.gripSpace,n),s!==null&&(c.matrix.fromArray(s.transform.matrix),c.matrix.decompose(c.position,c.rotation,c.scale),c.matrixWorldNeedsUpdate=!0,s.linearVelocity?(c.hasLinearVelocity=!0,c.linearVelocity.copy(s.linearVelocity)):c.hasLinearVelocity=!1,s.angularVelocity?(c.hasAngularVelocity=!0,c.angularVelocity.copy(s.angularVelocity)):c.hasAngularVelocity=!1));o!==null&&(r=e.getPose(t.targetRaySpace,n),r===null&&s!==null&&(r=s),r!==null&&(o.matrix.fromArray(r.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,r.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(r.linearVelocity)):o.hasLinearVelocity=!1,r.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(r.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(Ld)))}return o!==null&&(o.visible=r!==null),c!==null&&(c.visible=s!==null),l!==null&&(l.visible=a!==null),this}_getHandJoint(t,e){if(t.joints[e.jointName]===void 0){const n=new fn;n.matrixAutoUpdate=!1,n.visible=!1,t.joints[e.jointName]=n,t.add(n)}return t.joints[e.jointName]}}class Pd extends Ce{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new dn,this.environmentIntensity=1,this.environmentRotation=new dn,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(t,e){return super.copy(t,e),t.background!==null&&(this.background=t.background.clone()),t.environment!==null&&(this.environment=t.environment.clone()),t.fog!==null&&(this.fog=t.fog.clone()),this.backgroundBlurriness=t.backgroundBlurriness,this.backgroundIntensity=t.backgroundIntensity,this.backgroundRotation.copy(t.backgroundRotation),this.environmentIntensity=t.environmentIntensity,this.environmentRotation.copy(t.environmentRotation),t.overrideMaterial!==null&&(this.overrideMaterial=t.overrideMaterial.clone()),this.matrixAutoUpdate=t.matrixAutoUpdate,this}toJSON(t){const e=super.toJSON(t);return this.fog!==null&&(e.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(e.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(e.object.backgroundIntensity=this.backgroundIntensity),e.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(e.object.environmentIntensity=this.environmentIntensity),e.object.environmentRotation=this.environmentRotation.toArray(),e}}const rl=new O,sl=new de,al=new de,Dd=new O,ol=new ie,Ts=new O,La=new Sr,cl=new ie,Pa=new Ch;class Oh extends ee{constructor(t,e){super(t,e),this.isSkinnedMesh=!0,this.type="SkinnedMesh",this.bindMode=Fc,this.bindMatrix=new ie,this.bindMatrixInverse=new ie,this.boundingBox=null,this.boundingSphere=null}computeBoundingBox(){const t=this.geometry;this.boundingBox===null&&(this.boundingBox=new Mr),this.boundingBox.makeEmpty();const e=t.getAttribute("position");for(let n=0;n<e.count;n++)this.getVertexPosition(n,Ts),this.boundingBox.expandByPoint(Ts)}computeBoundingSphere(){const t=this.geometry;this.boundingSphere===null&&(this.boundingSphere=new Sr),this.boundingSphere.makeEmpty();const e=t.getAttribute("position");for(let n=0;n<e.count;n++)this.getVertexPosition(n,Ts),this.boundingSphere.expandByPoint(Ts)}copy(t,e){return super.copy(t,e),this.bindMode=t.bindMode,this.bindMatrix.copy(t.bindMatrix),this.bindMatrixInverse.copy(t.bindMatrixInverse),this.skeleton=t.skeleton,t.boundingBox!==null&&(this.boundingBox=t.boundingBox.clone()),t.boundingSphere!==null&&(this.boundingSphere=t.boundingSphere.clone()),this}raycast(t,e){const n=this.material,r=this.matrixWorld;n!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),La.copy(this.boundingSphere),La.applyMatrix4(r),t.ray.intersectsSphere(La)!==!1&&(cl.copy(r).invert(),Pa.copy(t.ray).applyMatrix4(cl),!(this.boundingBox!==null&&Pa.intersectsBox(this.boundingBox)===!1)&&this._computeIntersections(t,e,Pa)))}getVertexPosition(t,e){return super.getVertexPosition(t,e),this.applyBoneTransform(t,e),e}bind(t,e){this.skeleton=t,e===void 0&&(this.updateMatrixWorld(!0),this.skeleton.calculateInverses(),e=this.matrixWorld),this.bindMatrix.copy(e),this.bindMatrixInverse.copy(e).invert()}pose(){this.skeleton.pose()}normalizeSkinWeights(){const t=new de,e=this.geometry.attributes.skinWeight;for(let n=0,r=e.count;n<r;n++){t.fromBufferAttribute(e,n);const s=1/t.manhattanLength();s!==1/0?t.multiplyScalar(s):t.set(1,0,0,0),e.setXYZW(n,t.x,t.y,t.z,t.w)}}updateMatrixWorld(t){super.updateMatrixWorld(t),this.bindMode===Fc?this.bindMatrixInverse.copy(this.matrixWorld).invert():this.bindMode===Af?this.bindMatrixInverse.copy(this.bindMatrix).invert():console.warn("THREE.SkinnedMesh: Unrecognized bindMode: "+this.bindMode)}applyBoneTransform(t,e){const n=this.skeleton,r=this.geometry;sl.fromBufferAttribute(r.attributes.skinIndex,t),al.fromBufferAttribute(r.attributes.skinWeight,t),rl.copy(e).applyMatrix4(this.bindMatrix),e.set(0,0,0);for(let s=0;s<4;s++){const a=al.getComponent(s);if(a!==0){const o=sl.getComponent(s);ol.multiplyMatrices(n.bones[o].matrixWorld,n.boneInverses[o]),e.addScaledVector(Dd.copy(rl).applyMatrix4(ol),a)}}return e.applyMatrix4(this.bindMatrixInverse)}}class Bh extends Ce{constructor(){super(),this.isBone=!0,this.type="Bone"}}class kh extends De{constructor(t=null,e=1,n=1,r,s,a,o,c,l=en,h=en,u,d){super(null,a,o,c,l,h,r,s,u,d),this.isDataTexture=!0,this.image={data:t,width:e,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}const ll=new ie,Id=new ie;class ic{constructor(t=[],e=[]){this.uuid=hi(),this.bones=t.slice(0),this.boneInverses=e,this.boneMatrices=null,this.boneTexture=null,this.init()}init(){const t=this.bones,e=this.boneInverses;if(this.boneMatrices=new Float32Array(t.length*16),e.length===0)this.calculateInverses();else if(t.length!==e.length){console.warn("THREE.Skeleton: Number of inverse bone matrices does not match amount of bones."),this.boneInverses=[];for(let n=0,r=this.bones.length;n<r;n++)this.boneInverses.push(new ie)}}calculateInverses(){this.boneInverses.length=0;for(let t=0,e=this.bones.length;t<e;t++){const n=new ie;this.bones[t]&&n.copy(this.bones[t].matrixWorld).invert(),this.boneInverses.push(n)}}pose(){for(let t=0,e=this.bones.length;t<e;t++){const n=this.bones[t];n&&n.matrixWorld.copy(this.boneInverses[t]).invert()}for(let t=0,e=this.bones.length;t<e;t++){const n=this.bones[t];n&&(n.parent&&n.parent.isBone?(n.matrix.copy(n.parent.matrixWorld).invert(),n.matrix.multiply(n.matrixWorld)):n.matrix.copy(n.matrixWorld),n.matrix.decompose(n.position,n.quaternion,n.scale))}}update(){const t=this.bones,e=this.boneInverses,n=this.boneMatrices,r=this.boneTexture;for(let s=0,a=t.length;s<a;s++){const o=t[s]?t[s].matrixWorld:Id;ll.multiplyMatrices(o,e[s]),ll.toArray(n,s*16)}r!==null&&(r.needsUpdate=!0)}clone(){return new ic(this.bones,this.boneInverses)}computeBoneTexture(){let t=Math.sqrt(this.bones.length*4);t=Math.ceil(t/4)*4,t=Math.max(t,4);const e=new Float32Array(t*t*4);e.set(this.boneMatrices);const n=new kh(e,t,t,tn,An);return n.needsUpdate=!0,this.boneMatrices=e,this.boneTexture=n,this}getBoneByName(t){for(let e=0,n=this.bones.length;e<n;e++){const r=this.bones[e];if(r.name===t)return r}}dispose(){this.boneTexture!==null&&(this.boneTexture.dispose(),this.boneTexture=null)}fromJSON(t,e){this.uuid=t.uuid;for(let n=0,r=t.bones.length;n<r;n++){const s=t.bones[n];let a=e[s];a===void 0&&(console.warn("THREE.Skeleton: No bone found with UUID:",s),a=new Bh),this.bones.push(a),this.boneInverses.push(new ie().fromArray(t.boneInverses[n]))}return this.init(),this}toJSON(){const t={metadata:{version:4.7,type:"Skeleton",generator:"Skeleton.toJSON"},bones:[],boneInverses:[]};t.uuid=this.uuid;const e=this.bones,n=this.boneInverses;for(let r=0,s=e.length;r<s;r++){const a=e[r];t.bones.push(a.uuid);const o=n[r];t.boneInverses.push(o.toArray())}return t}}const Da=new O,Ud=new O,Nd=new Kt;class xi{constructor(t=new O(1,0,0),e=0){this.isPlane=!0,this.normal=t,this.constant=e}set(t,e){return this.normal.copy(t),this.constant=e,this}setComponents(t,e,n,r){return this.normal.set(t,e,n),this.constant=r,this}setFromNormalAndCoplanarPoint(t,e){return this.normal.copy(t),this.constant=-e.dot(this.normal),this}setFromCoplanarPoints(t,e,n){const r=Da.subVectors(n,e).cross(Ud.subVectors(t,e)).normalize();return this.setFromNormalAndCoplanarPoint(r,t),this}copy(t){return this.normal.copy(t.normal),this.constant=t.constant,this}normalize(){const t=1/this.normal.length();return this.normal.multiplyScalar(t),this.constant*=t,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(t){return this.normal.dot(t)+this.constant}distanceToSphere(t){return this.distanceToPoint(t.center)-t.radius}projectPoint(t,e){return e.copy(t).addScaledVector(this.normal,-this.distanceToPoint(t))}intersectLine(t,e){const n=t.delta(Da),r=this.normal.dot(n);if(r===0)return this.distanceToPoint(t.start)===0?e.copy(t.start):null;const s=-(t.start.dot(this.normal)+this.constant)/r;return s<0||s>1?null:e.copy(t.start).addScaledVector(n,s)}intersectsLine(t){const e=this.distanceToPoint(t.start),n=this.distanceToPoint(t.end);return e<0&&n>0||n<0&&e>0}intersectsBox(t){return t.intersectsPlane(this)}intersectsSphere(t){return t.intersectsPlane(this)}coplanarPoint(t){return t.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(t,e){const n=e||Nd.getNormalMatrix(t),r=this.coplanarPoint(Da).applyMatrix4(t),s=this.normal.applyMatrix3(n).normalize();return this.constant=-r.dot(s),this}translate(t){return this.constant-=t.dot(this.normal),this}equals(t){return t.normal.equals(this.normal)&&t.constant===this.constant}clone(){return new this.constructor().copy(this)}}const gi=new Sr,Fd=new St(.5,.5),ws=new O;class rc{constructor(t=new xi,e=new xi,n=new xi,r=new xi,s=new xi,a=new xi){this.planes=[t,e,n,r,s,a]}set(t,e,n,r,s,a){const o=this.planes;return o[0].copy(t),o[1].copy(e),o[2].copy(n),o[3].copy(r),o[4].copy(s),o[5].copy(a),this}copy(t){const e=this.planes;for(let n=0;n<6;n++)e[n].copy(t.planes[n]);return this}setFromProjectionMatrix(t,e=Rn,n=!1){const r=this.planes,s=t.elements,a=s[0],o=s[1],c=s[2],l=s[3],h=s[4],u=s[5],d=s[6],f=s[7],m=s[8],x=s[9],g=s[10],p=s[11],T=s[12],y=s[13],M=s[14],w=s[15];if(r[0].setComponents(l-a,f-h,p-m,w-T).normalize(),r[1].setComponents(l+a,f+h,p+m,w+T).normalize(),r[2].setComponents(l+o,f+u,p+x,w+y).normalize(),r[3].setComponents(l-o,f-u,p-x,w-y).normalize(),n)r[4].setComponents(c,d,g,M).normalize(),r[5].setComponents(l-c,f-d,p-g,w-M).normalize();else if(r[4].setComponents(l-c,f-d,p-g,w-M).normalize(),e===Rn)r[5].setComponents(l+c,f+d,p+g,w+M).normalize();else if(e===Ys)r[5].setComponents(c,d,g,M).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+e);return this}intersectsObject(t){if(t.boundingSphere!==void 0)t.boundingSphere===null&&t.computeBoundingSphere(),gi.copy(t.boundingSphere).applyMatrix4(t.matrixWorld);else{const e=t.geometry;e.boundingSphere===null&&e.computeBoundingSphere(),gi.copy(e.boundingSphere).applyMatrix4(t.matrixWorld)}return this.intersectsSphere(gi)}intersectsSprite(t){gi.center.set(0,0,0);const e=Fd.distanceTo(t.center);return gi.radius=.7071067811865476+e,gi.applyMatrix4(t.matrixWorld),this.intersectsSphere(gi)}intersectsSphere(t){const e=this.planes,n=t.center,r=-t.radius;for(let s=0;s<6;s++)if(e[s].distanceToPoint(n)<r)return!1;return!0}intersectsBox(t){const e=this.planes;for(let n=0;n<6;n++){const r=e[n];if(ws.x=r.normal.x>0?t.max.x:t.min.x,ws.y=r.normal.y>0?t.max.y:t.min.y,ws.z=r.normal.z>0?t.max.z:t.min.z,r.distanceToPoint(ws)<0)return!1}return!0}containsPoint(t){const e=this.planes;for(let n=0;n<6;n++)if(e[n].distanceToPoint(t)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}class Od extends De{constructor(t,e,n,r,s=Fe,a=Fe,o,c,l){super(t,e,n,r,s,a,o,c,l),this.isVideoTexture=!0,this.generateMipmaps=!1,this._requestVideoFrameCallbackId=0;const h=this;function u(){h.needsUpdate=!0,h._requestVideoFrameCallbackId=t.requestVideoFrameCallback(u)}"requestVideoFrameCallback"in t&&(this._requestVideoFrameCallbackId=t.requestVideoFrameCallback(u))}clone(){return new this.constructor(this.image).copy(this)}update(){const t=this.image;"requestVideoFrameCallback"in t===!1&&t.readyState>=t.HAVE_CURRENT_DATA&&(this.needsUpdate=!0)}dispose(){this._requestVideoFrameCallbackId!==0&&this.source.data.cancelVideoFrameCallback(this._requestVideoFrameCallbackId),super.dispose()}}class hl extends De{constructor(t,e,n,r,s,a,o,c,l){super(t,e,n,r,s,a,o,c,l),this.isCanvasTexture=!0,this.needsUpdate=!0}}class zh extends De{constructor(t,e,n=Di,r,s,a,o=en,c=en,l,h=Wr,u=1){if(h!==Wr&&h!==Xr)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");const d={width:t,height:e,depth:u};super(d,r,s,a,o,c,h,n,l),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(t){return super.copy(t),this.source=new nc(Object.assign({},t.image)),this.compareFunction=t.compareFunction,this}toJSON(t){const e=super.toJSON(t);return this.compareFunction!==null&&(e.compareFunction=this.compareFunction),e}}class Hh extends De{constructor(t=null){super(),this.sourceTexture=t,this.isExternalTexture=!0}copy(t){return super.copy(t),this.sourceTexture=t.sourceTexture,this}}class sc extends Le{constructor(t=1,e=1,n=4,r=8,s=1){super(),this.type="CapsuleGeometry",this.parameters={radius:t,height:e,capSegments:n,radialSegments:r,heightSegments:s},e=Math.max(0,e),n=Math.max(1,Math.floor(n)),r=Math.max(3,Math.floor(r)),s=Math.max(1,Math.floor(s));const a=[],o=[],c=[],l=[],h=e/2,u=Math.PI/2*t,d=e,f=2*u+d,m=n*2+s,x=r+1,g=new O,p=new O;for(let T=0;T<=m;T++){let y=0,M=0,w=0,E=0;if(T<=n){const v=T/n,_=v*Math.PI/2;M=-h-t*Math.cos(_),w=t*Math.sin(_),E=-t*Math.cos(_),y=v*u}else if(T<=n+s){const v=(T-n)/s;M=-h+v*e,w=t,E=0,y=u+v*d}else{const v=(T-n-s)/n,_=v*Math.PI/2;M=h+t*Math.sin(_),w=t*Math.cos(_),E=t*Math.sin(_),y=u+d+v*u}const A=Math.max(0,Math.min(1,y/f));let C=0;T===0?C=.5/r:T===m&&(C=-.5/r);for(let v=0;v<=r;v++){const _=v/r,S=_*Math.PI*2,b=Math.sin(S),D=Math.cos(S);p.x=-w*D,p.y=M,p.z=w*b,o.push(p.x,p.y,p.z),g.set(-w*D,E,w*b),g.normalize(),c.push(g.x,g.y,g.z),l.push(_+C,A)}if(T>0){const v=(T-1)*x;for(let _=0;_<r;_++){const S=v+_,b=v+_+1,D=T*x+_,U=T*x+_+1;a.push(S,b,D),a.push(b,U,D)}}}this.setIndex(a),this.setAttribute("position",new he(o,3)),this.setAttribute("normal",new he(c,3)),this.setAttribute("uv",new he(l,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new sc(t.radius,t.height,t.capSegments,t.radialSegments,t.heightSegments)}}class Ve extends Le{constructor(t=1,e=1,n=1,r=32,s=1,a=!1,o=0,c=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:t,radiusBottom:e,height:n,radialSegments:r,heightSegments:s,openEnded:a,thetaStart:o,thetaLength:c};const l=this;r=Math.floor(r),s=Math.floor(s);const h=[],u=[],d=[],f=[];let m=0;const x=[],g=n/2;let p=0;T(),a===!1&&(t>0&&y(!0),e>0&&y(!1)),this.setIndex(h),this.setAttribute("position",new he(u,3)),this.setAttribute("normal",new he(d,3)),this.setAttribute("uv",new he(f,2));function T(){const M=new O,w=new O;let E=0;const A=(e-t)/n;for(let C=0;C<=s;C++){const v=[],_=C/s,S=_*(e-t)+t;for(let b=0;b<=r;b++){const D=b/r,U=D*c+o,N=Math.sin(U),B=Math.cos(U);w.x=S*N,w.y=-_*n+g,w.z=S*B,u.push(w.x,w.y,w.z),M.set(N,A,B).normalize(),d.push(M.x,M.y,M.z),f.push(D,1-_),v.push(m++)}x.push(v)}for(let C=0;C<r;C++)for(let v=0;v<s;v++){const _=x[v][C],S=x[v+1][C],b=x[v+1][C+1],D=x[v][C+1];(t>0||v!==0)&&(h.push(_,S,D),E+=3),(e>0||v!==s-1)&&(h.push(S,b,D),E+=3)}l.addGroup(p,E,0),p+=E}function y(M){const w=m,E=new St,A=new O;let C=0;const v=M===!0?t:e,_=M===!0?1:-1;for(let b=1;b<=r;b++)u.push(0,g*_,0),d.push(0,_,0),f.push(.5,.5),m++;const S=m;for(let b=0;b<=r;b++){const U=b/r*c+o,N=Math.cos(U),B=Math.sin(U);A.x=v*B,A.y=g*_,A.z=v*N,u.push(A.x,A.y,A.z),d.push(0,_,0),E.x=N*.5+.5,E.y=B*.5*_+.5,f.push(E.x,E.y),m++}for(let b=0;b<r;b++){const D=w+b,U=S+b;M===!0?h.push(U,U+1,D):h.push(U+1,U,D),C+=3}l.addGroup(p,C,M===!0?1:2),p+=C}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Ve(t.radiusTop,t.radiusBottom,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}}class ea extends Ve{constructor(t=1,e=1,n=32,r=1,s=!1,a=0,o=Math.PI*2){super(0,t,e,n,r,s,a,o),this.type="ConeGeometry",this.parameters={radius:t,height:e,radialSegments:n,heightSegments:r,openEnded:s,thetaStart:a,thetaLength:o}}static fromJSON(t){return new ea(t.radius,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}}class Ln{constructor(){this.type="Curve",this.arcLengthDivisions=200,this.needsUpdate=!1,this.cacheArcLengths=null}getPoint(){console.warn("THREE.Curve: .getPoint() not implemented.")}getPointAt(t,e){const n=this.getUtoTmapping(t);return this.getPoint(n,e)}getPoints(t=5){const e=[];for(let n=0;n<=t;n++)e.push(this.getPoint(n/t));return e}getSpacedPoints(t=5){const e=[];for(let n=0;n<=t;n++)e.push(this.getPointAt(n/t));return e}getLength(){const t=this.getLengths();return t[t.length-1]}getLengths(t=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===t+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;const e=[];let n,r=this.getPoint(0),s=0;e.push(0);for(let a=1;a<=t;a++)n=this.getPoint(a/t),s+=n.distanceTo(r),e.push(s),r=n;return this.cacheArcLengths=e,e}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(t,e=null){const n=this.getLengths();let r=0;const s=n.length;let a;e?a=e:a=t*n[s-1];let o=0,c=s-1,l;for(;o<=c;)if(r=Math.floor(o+(c-o)/2),l=n[r]-a,l<0)o=r+1;else if(l>0)c=r-1;else{c=r;break}if(r=c,n[r]===a)return r/(s-1);const h=n[r],d=n[r+1]-h,f=(a-h)/d;return(r+f)/(s-1)}getTangent(t,e){let r=t-1e-4,s=t+1e-4;r<0&&(r=0),s>1&&(s=1);const a=this.getPoint(r),o=this.getPoint(s),c=e||(a.isVector2?new St:new O);return c.copy(o).sub(a).normalize(),c}getTangentAt(t,e){const n=this.getUtoTmapping(t);return this.getTangent(n,e)}computeFrenetFrames(t,e=!1){const n=new O,r=[],s=[],a=[],o=new O,c=new ie;for(let f=0;f<=t;f++){const m=f/t;r[f]=this.getTangentAt(m,new O)}s[0]=new O,a[0]=new O;let l=Number.MAX_VALUE;const h=Math.abs(r[0].x),u=Math.abs(r[0].y),d=Math.abs(r[0].z);h<=l&&(l=h,n.set(1,0,0)),u<=l&&(l=u,n.set(0,1,0)),d<=l&&n.set(0,0,1),o.crossVectors(r[0],n).normalize(),s[0].crossVectors(r[0],o),a[0].crossVectors(r[0],s[0]);for(let f=1;f<=t;f++){if(s[f]=s[f-1].clone(),a[f]=a[f-1].clone(),o.crossVectors(r[f-1],r[f]),o.length()>Number.EPSILON){o.normalize();const m=Math.acos(Qt(r[f-1].dot(r[f]),-1,1));s[f].applyMatrix4(c.makeRotationAxis(o,m))}a[f].crossVectors(r[f],s[f])}if(e===!0){let f=Math.acos(Qt(s[0].dot(s[t]),-1,1));f/=t,r[0].dot(o.crossVectors(s[0],s[t]))>0&&(f=-f);for(let m=1;m<=t;m++)s[m].applyMatrix4(c.makeRotationAxis(r[m],f*m)),a[m].crossVectors(r[m],s[m])}return{tangents:r,normals:s,binormals:a}}clone(){return new this.constructor().copy(this)}copy(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}toJSON(){const t={metadata:{version:4.7,type:"Curve",generator:"Curve.toJSON"}};return t.arcLengthDivisions=this.arcLengthDivisions,t.type=this.type,t}fromJSON(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}}class ac extends Ln{constructor(t=0,e=0,n=1,r=1,s=0,a=Math.PI*2,o=!1,c=0){super(),this.isEllipseCurve=!0,this.type="EllipseCurve",this.aX=t,this.aY=e,this.xRadius=n,this.yRadius=r,this.aStartAngle=s,this.aEndAngle=a,this.aClockwise=o,this.aRotation=c}getPoint(t,e=new St){const n=e,r=Math.PI*2;let s=this.aEndAngle-this.aStartAngle;const a=Math.abs(s)<Number.EPSILON;for(;s<0;)s+=r;for(;s>r;)s-=r;s<Number.EPSILON&&(a?s=0:s=r),this.aClockwise===!0&&!a&&(s===r?s=-r:s=s-r);const o=this.aStartAngle+t*s;let c=this.aX+this.xRadius*Math.cos(o),l=this.aY+this.yRadius*Math.sin(o);if(this.aRotation!==0){const h=Math.cos(this.aRotation),u=Math.sin(this.aRotation),d=c-this.aX,f=l-this.aY;c=d*h-f*u+this.aX,l=d*u+f*h+this.aY}return n.set(c,l)}copy(t){return super.copy(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}toJSON(){const t=super.toJSON();return t.aX=this.aX,t.aY=this.aY,t.xRadius=this.xRadius,t.yRadius=this.yRadius,t.aStartAngle=this.aStartAngle,t.aEndAngle=this.aEndAngle,t.aClockwise=this.aClockwise,t.aRotation=this.aRotation,t}fromJSON(t){return super.fromJSON(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}}class Bd extends ac{constructor(t,e,n,r,s,a){super(t,e,n,n,r,s,a),this.isArcCurve=!0,this.type="ArcCurve"}}function oc(){let i=0,t=0,e=0,n=0;function r(s,a,o,c){i=s,t=o,e=-3*s+3*a-2*o-c,n=2*s-2*a+o+c}return{initCatmullRom:function(s,a,o,c,l){r(a,o,l*(o-s),l*(c-a))},initNonuniformCatmullRom:function(s,a,o,c,l,h,u){let d=(a-s)/l-(o-s)/(l+h)+(o-a)/h,f=(o-a)/h-(c-a)/(h+u)+(c-o)/u;d*=h,f*=h,r(a,o,d,f)},calc:function(s){const a=s*s,o=a*s;return i+t*s+e*a+n*o}}}const As=new O,Ia=new oc,Ua=new oc,Na=new oc;class Js extends Ln{constructor(t=[],e=!1,n="centripetal",r=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=t,this.closed=e,this.curveType=n,this.tension=r}getPoint(t,e=new O){const n=e,r=this.points,s=r.length,a=(s-(this.closed?0:1))*t;let o=Math.floor(a),c=a-o;this.closed?o+=o>0?0:(Math.floor(Math.abs(o)/s)+1)*s:c===0&&o===s-1&&(o=s-2,c=1);let l,h;this.closed||o>0?l=r[(o-1)%s]:(As.subVectors(r[0],r[1]).add(r[0]),l=As);const u=r[o%s],d=r[(o+1)%s];if(this.closed||o+2<s?h=r[(o+2)%s]:(As.subVectors(r[s-1],r[s-2]).add(r[s-1]),h=As),this.curveType==="centripetal"||this.curveType==="chordal"){const f=this.curveType==="chordal"?.5:.25;let m=Math.pow(l.distanceToSquared(u),f),x=Math.pow(u.distanceToSquared(d),f),g=Math.pow(d.distanceToSquared(h),f);x<1e-4&&(x=1),m<1e-4&&(m=x),g<1e-4&&(g=x),Ia.initNonuniformCatmullRom(l.x,u.x,d.x,h.x,m,x,g),Ua.initNonuniformCatmullRom(l.y,u.y,d.y,h.y,m,x,g),Na.initNonuniformCatmullRom(l.z,u.z,d.z,h.z,m,x,g)}else this.curveType==="catmullrom"&&(Ia.initCatmullRom(l.x,u.x,d.x,h.x,this.tension),Ua.initCatmullRom(l.y,u.y,d.y,h.y,this.tension),Na.initCatmullRom(l.z,u.z,d.z,h.z,this.tension));return n.set(Ia.calc(c),Ua.calc(c),Na.calc(c)),n}copy(t){super.copy(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){const r=t.points[e];this.points.push(r.clone())}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}toJSON(){const t=super.toJSON();t.points=[];for(let e=0,n=this.points.length;e<n;e++){const r=this.points[e];t.points.push(r.toArray())}return t.closed=this.closed,t.curveType=this.curveType,t.tension=this.tension,t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){const r=t.points[e];this.points.push(new O().fromArray(r))}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}}function ul(i,t,e,n,r){const s=(n-t)*.5,a=(r-e)*.5,o=i*i,c=i*o;return(2*e-2*n+s+a)*c+(-3*e+3*n-2*s-a)*o+s*i+e}function kd(i,t){const e=1-i;return e*e*t}function zd(i,t){return 2*(1-i)*i*t}function Hd(i,t){return i*i*t}function Br(i,t,e,n){return kd(i,t)+zd(i,e)+Hd(i,n)}function Vd(i,t){const e=1-i;return e*e*e*t}function Gd(i,t){const e=1-i;return 3*e*e*i*t}function Wd(i,t){return 3*(1-i)*i*i*t}function Xd(i,t){return i*i*i*t}function kr(i,t,e,n,r){return Vd(i,t)+Gd(i,e)+Wd(i,n)+Xd(i,r)}class Vh extends Ln{constructor(t=new St,e=new St,n=new St,r=new St){super(),this.isCubicBezierCurve=!0,this.type="CubicBezierCurve",this.v0=t,this.v1=e,this.v2=n,this.v3=r}getPoint(t,e=new St){const n=e,r=this.v0,s=this.v1,a=this.v2,o=this.v3;return n.set(kr(t,r.x,s.x,a.x,o.x),kr(t,r.y,s.y,a.y,o.y)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}}class qd extends Ln{constructor(t=new O,e=new O,n=new O,r=new O){super(),this.isCubicBezierCurve3=!0,this.type="CubicBezierCurve3",this.v0=t,this.v1=e,this.v2=n,this.v3=r}getPoint(t,e=new O){const n=e,r=this.v0,s=this.v1,a=this.v2,o=this.v3;return n.set(kr(t,r.x,s.x,a.x,o.x),kr(t,r.y,s.y,a.y,o.y),kr(t,r.z,s.z,a.z,o.z)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}}class Gh extends Ln{constructor(t=new St,e=new St){super(),this.isLineCurve=!0,this.type="LineCurve",this.v1=t,this.v2=e}getPoint(t,e=new St){const n=e;return t===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(t).add(this.v1)),n}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new St){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class Yd extends Ln{constructor(t=new O,e=new O){super(),this.isLineCurve3=!0,this.type="LineCurve3",this.v1=t,this.v2=e}getPoint(t,e=new O){const n=e;return t===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(t).add(this.v1)),n}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new O){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class Wh extends Ln{constructor(t=new St,e=new St,n=new St){super(),this.isQuadraticBezierCurve=!0,this.type="QuadraticBezierCurve",this.v0=t,this.v1=e,this.v2=n}getPoint(t,e=new St){const n=e,r=this.v0,s=this.v1,a=this.v2;return n.set(Br(t,r.x,s.x,a.x),Br(t,r.y,s.y,a.y)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class Xh extends Ln{constructor(t=new O,e=new O,n=new O){super(),this.isQuadraticBezierCurve3=!0,this.type="QuadraticBezierCurve3",this.v0=t,this.v1=e,this.v2=n}getPoint(t,e=new O){const n=e,r=this.v0,s=this.v1,a=this.v2;return n.set(Br(t,r.x,s.x,a.x),Br(t,r.y,s.y,a.y),Br(t,r.z,s.z,a.z)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class qh extends Ln{constructor(t=[]){super(),this.isSplineCurve=!0,this.type="SplineCurve",this.points=t}getPoint(t,e=new St){const n=e,r=this.points,s=(r.length-1)*t,a=Math.floor(s),o=s-a,c=r[a===0?a:a-1],l=r[a],h=r[a>r.length-2?r.length-1:a+1],u=r[a>r.length-3?r.length-1:a+2];return n.set(ul(o,c.x,l.x,h.x,u.x),ul(o,c.y,l.y,h.y,u.y)),n}copy(t){super.copy(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){const r=t.points[e];this.points.push(r.clone())}return this}toJSON(){const t=super.toJSON();t.points=[];for(let e=0,n=this.points.length;e<n;e++){const r=this.points[e];t.points.push(r.toArray())}return t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){const r=t.points[e];this.points.push(new St().fromArray(r))}return this}}var Zs=Object.freeze({__proto__:null,ArcCurve:Bd,CatmullRomCurve3:Js,CubicBezierCurve:Vh,CubicBezierCurve3:qd,EllipseCurve:ac,LineCurve:Gh,LineCurve3:Yd,QuadraticBezierCurve:Wh,QuadraticBezierCurve3:Xh,SplineCurve:qh});class $d extends Ln{constructor(){super(),this.type="CurvePath",this.curves=[],this.autoClose=!1}add(t){this.curves.push(t)}closePath(){const t=this.curves[0].getPoint(0),e=this.curves[this.curves.length-1].getPoint(1);if(!t.equals(e)){const n=t.isVector2===!0?"LineCurve":"LineCurve3";this.curves.push(new Zs[n](e,t))}return this}getPoint(t,e){const n=t*this.getLength(),r=this.getCurveLengths();let s=0;for(;s<r.length;){if(r[s]>=n){const a=r[s]-n,o=this.curves[s],c=o.getLength(),l=c===0?0:1-a/c;return o.getPointAt(l,e)}s++}return null}getLength(){const t=this.getCurveLengths();return t[t.length-1]}updateArcLengths(){this.needsUpdate=!0,this.cacheLengths=null,this.getCurveLengths()}getCurveLengths(){if(this.cacheLengths&&this.cacheLengths.length===this.curves.length)return this.cacheLengths;const t=[];let e=0;for(let n=0,r=this.curves.length;n<r;n++)e+=this.curves[n].getLength(),t.push(e);return this.cacheLengths=t,t}getSpacedPoints(t=40){const e=[];for(let n=0;n<=t;n++)e.push(this.getPoint(n/t));return this.autoClose&&e.push(e[0]),e}getPoints(t=12){const e=[];let n;for(let r=0,s=this.curves;r<s.length;r++){const a=s[r],o=a.isEllipseCurve?t*2:a.isLineCurve||a.isLineCurve3?1:a.isSplineCurve?t*a.points.length:t,c=a.getPoints(o);for(let l=0;l<c.length;l++){const h=c[l];n&&n.equals(h)||(e.push(h),n=h)}}return this.autoClose&&e.length>1&&!e[e.length-1].equals(e[0])&&e.push(e[0]),e}copy(t){super.copy(t),this.curves=[];for(let e=0,n=t.curves.length;e<n;e++){const r=t.curves[e];this.curves.push(r.clone())}return this.autoClose=t.autoClose,this}toJSON(){const t=super.toJSON();t.autoClose=this.autoClose,t.curves=[];for(let e=0,n=this.curves.length;e<n;e++){const r=this.curves[e];t.curves.push(r.toJSON())}return t}fromJSON(t){super.fromJSON(t),this.autoClose=t.autoClose,this.curves=[];for(let e=0,n=t.curves.length;e<n;e++){const r=t.curves[e];this.curves.push(new Zs[r.type]().fromJSON(r))}return this}}class fl extends $d{constructor(t){super(),this.type="Path",this.currentPoint=new St,t&&this.setFromPoints(t)}setFromPoints(t){this.moveTo(t[0].x,t[0].y);for(let e=1,n=t.length;e<n;e++)this.lineTo(t[e].x,t[e].y);return this}moveTo(t,e){return this.currentPoint.set(t,e),this}lineTo(t,e){const n=new Gh(this.currentPoint.clone(),new St(t,e));return this.curves.push(n),this.currentPoint.set(t,e),this}quadraticCurveTo(t,e,n,r){const s=new Wh(this.currentPoint.clone(),new St(t,e),new St(n,r));return this.curves.push(s),this.currentPoint.set(n,r),this}bezierCurveTo(t,e,n,r,s,a){const o=new Vh(this.currentPoint.clone(),new St(t,e),new St(n,r),new St(s,a));return this.curves.push(o),this.currentPoint.set(s,a),this}splineThru(t){const e=[this.currentPoint.clone()].concat(t),n=new qh(e);return this.curves.push(n),this.currentPoint.copy(t[t.length-1]),this}arc(t,e,n,r,s,a){const o=this.currentPoint.x,c=this.currentPoint.y;return this.absarc(t+o,e+c,n,r,s,a),this}absarc(t,e,n,r,s,a){return this.absellipse(t,e,n,n,r,s,a),this}ellipse(t,e,n,r,s,a,o,c){const l=this.currentPoint.x,h=this.currentPoint.y;return this.absellipse(t+l,e+h,n,r,s,a,o,c),this}absellipse(t,e,n,r,s,a,o,c){const l=new ac(t,e,n,r,s,a,o,c);if(this.curves.length>0){const u=l.getPoint(0);u.equals(this.currentPoint)||this.lineTo(u.x,u.y)}this.curves.push(l);const h=l.getPoint(1);return this.currentPoint.copy(h),this}copy(t){return super.copy(t),this.currentPoint.copy(t.currentPoint),this}toJSON(){const t=super.toJSON();return t.currentPoint=this.currentPoint.toArray(),t}fromJSON(t){return super.fromJSON(t),this.currentPoint.fromArray(t.currentPoint),this}}class Yh extends fl{constructor(t){super(t),this.uuid=hi(),this.type="Shape",this.holes=[]}getPointsHoles(t){const e=[];for(let n=0,r=this.holes.length;n<r;n++)e[n]=this.holes[n].getPoints(t);return e}extractPoints(t){return{shape:this.getPoints(t),holes:this.getPointsHoles(t)}}copy(t){super.copy(t),this.holes=[];for(let e=0,n=t.holes.length;e<n;e++){const r=t.holes[e];this.holes.push(r.clone())}return this}toJSON(){const t=super.toJSON();t.uuid=this.uuid,t.holes=[];for(let e=0,n=this.holes.length;e<n;e++){const r=this.holes[e];t.holes.push(r.toJSON())}return t}fromJSON(t){super.fromJSON(t),this.uuid=t.uuid,this.holes=[];for(let e=0,n=t.holes.length;e<n;e++){const r=t.holes[e];this.holes.push(new fl().fromJSON(r))}return this}}function Jd(i,t,e=2){const n=t&&t.length,r=n?t[0]*e:i.length;let s=$h(i,0,r,e,!0);const a=[];if(!s||s.next===s.prev)return a;let o,c,l;if(n&&(s=tp(i,t,s,e)),i.length>80*e){o=1/0,c=1/0;let h=-1/0,u=-1/0;for(let d=e;d<r;d+=e){const f=i[d],m=i[d+1];f<o&&(o=f),m<c&&(c=m),f>h&&(h=f),m>u&&(u=m)}l=Math.max(h-o,u-c),l=l!==0?32767/l:0}return $r(s,a,e,o,c,l,0),a}function $h(i,t,e,n,r){let s;if(r===up(i,t,e,n)>0)for(let a=t;a<e;a+=n)s=dl(a/n|0,i[a],i[a+1],s);else for(let a=e-n;a>=t;a-=n)s=dl(a/n|0,i[a],i[a+1],s);return s&&gr(s,s.next)&&(Zr(s),s=s.next),s}function Ni(i,t){if(!i)return i;t||(t=i);let e=i,n;do if(n=!1,!e.steiner&&(gr(e,e.next)||Me(e.prev,e,e.next)===0)){if(Zr(e),e=t=e.prev,e===e.next)break;n=!0}else e=e.next;while(n||e!==t);return t}function $r(i,t,e,n,r,s,a){if(!i)return;!a&&s&&sp(i,n,r,s);let o=i;for(;i.prev!==i.next;){const c=i.prev,l=i.next;if(s?Kd(i,n,r,s):Zd(i)){t.push(c.i,i.i,l.i),Zr(i),i=l.next,o=l.next;continue}if(i=l,i===o){a?a===1?(i=jd(Ni(i),t),$r(i,t,e,n,r,s,2)):a===2&&Qd(i,t,e,n,r,s):$r(Ni(i),t,e,n,r,s,1);break}}}function Zd(i){const t=i.prev,e=i,n=i.next;if(Me(t,e,n)>=0)return!1;const r=t.x,s=e.x,a=n.x,o=t.y,c=e.y,l=n.y,h=Math.min(r,s,a),u=Math.min(o,c,l),d=Math.max(r,s,a),f=Math.max(o,c,l);let m=n.next;for(;m!==t;){if(m.x>=h&&m.x<=d&&m.y>=u&&m.y<=f&&Ir(r,o,s,c,a,l,m.x,m.y)&&Me(m.prev,m,m.next)>=0)return!1;m=m.next}return!0}function Kd(i,t,e,n){const r=i.prev,s=i,a=i.next;if(Me(r,s,a)>=0)return!1;const o=r.x,c=s.x,l=a.x,h=r.y,u=s.y,d=a.y,f=Math.min(o,c,l),m=Math.min(h,u,d),x=Math.max(o,c,l),g=Math.max(h,u,d),p=ko(f,m,t,e,n),T=ko(x,g,t,e,n);let y=i.prevZ,M=i.nextZ;for(;y&&y.z>=p&&M&&M.z<=T;){if(y.x>=f&&y.x<=x&&y.y>=m&&y.y<=g&&y!==r&&y!==a&&Ir(o,h,c,u,l,d,y.x,y.y)&&Me(y.prev,y,y.next)>=0||(y=y.prevZ,M.x>=f&&M.x<=x&&M.y>=m&&M.y<=g&&M!==r&&M!==a&&Ir(o,h,c,u,l,d,M.x,M.y)&&Me(M.prev,M,M.next)>=0))return!1;M=M.nextZ}for(;y&&y.z>=p;){if(y.x>=f&&y.x<=x&&y.y>=m&&y.y<=g&&y!==r&&y!==a&&Ir(o,h,c,u,l,d,y.x,y.y)&&Me(y.prev,y,y.next)>=0)return!1;y=y.prevZ}for(;M&&M.z<=T;){if(M.x>=f&&M.x<=x&&M.y>=m&&M.y<=g&&M!==r&&M!==a&&Ir(o,h,c,u,l,d,M.x,M.y)&&Me(M.prev,M,M.next)>=0)return!1;M=M.nextZ}return!0}function jd(i,t){let e=i;do{const n=e.prev,r=e.next.next;!gr(n,r)&&Zh(n,e,e.next,r)&&Jr(n,r)&&Jr(r,n)&&(t.push(n.i,e.i,r.i),Zr(e),Zr(e.next),e=i=r),e=e.next}while(e!==i);return Ni(e)}function Qd(i,t,e,n,r,s){let a=i;do{let o=a.next.next;for(;o!==a.prev;){if(a.i!==o.i&&cp(a,o)){let c=Kh(a,o);a=Ni(a,a.next),c=Ni(c,c.next),$r(a,t,e,n,r,s,0),$r(c,t,e,n,r,s,0);return}o=o.next}a=a.next}while(a!==i)}function tp(i,t,e,n){const r=[];for(let s=0,a=t.length;s<a;s++){const o=t[s]*n,c=s<a-1?t[s+1]*n:i.length,l=$h(i,o,c,n,!1);l===l.next&&(l.steiner=!0),r.push(op(l))}r.sort(ep);for(let s=0;s<r.length;s++)e=np(r[s],e);return e}function ep(i,t){let e=i.x-t.x;if(e===0&&(e=i.y-t.y,e===0)){const n=(i.next.y-i.y)/(i.next.x-i.x),r=(t.next.y-t.y)/(t.next.x-t.x);e=n-r}return e}function np(i,t){const e=ip(i,t);if(!e)return t;const n=Kh(e,i);return Ni(n,n.next),Ni(e,e.next)}function ip(i,t){let e=t;const n=i.x,r=i.y;let s=-1/0,a;if(gr(i,e))return e;do{if(gr(i,e.next))return e.next;if(r<=e.y&&r>=e.next.y&&e.next.y!==e.y){const u=e.x+(r-e.y)*(e.next.x-e.x)/(e.next.y-e.y);if(u<=n&&u>s&&(s=u,a=e.x<e.next.x?e:e.next,u===n))return a}e=e.next}while(e!==t);if(!a)return null;const o=a,c=a.x,l=a.y;let h=1/0;e=a;do{if(n>=e.x&&e.x>=c&&n!==e.x&&Jh(r<l?n:s,r,c,l,r<l?s:n,r,e.x,e.y)){const u=Math.abs(r-e.y)/(n-e.x);Jr(e,i)&&(u<h||u===h&&(e.x>a.x||e.x===a.x&&rp(a,e)))&&(a=e,h=u)}e=e.next}while(e!==o);return a}function rp(i,t){return Me(i.prev,i,t.prev)<0&&Me(t.next,i,i.next)<0}function sp(i,t,e,n){let r=i;do r.z===0&&(r.z=ko(r.x,r.y,t,e,n)),r.prevZ=r.prev,r.nextZ=r.next,r=r.next;while(r!==i);r.prevZ.nextZ=null,r.prevZ=null,ap(r)}function ap(i){let t,e=1;do{let n=i,r;i=null;let s=null;for(t=0;n;){t++;let a=n,o=0;for(let l=0;l<e&&(o++,a=a.nextZ,!!a);l++);let c=e;for(;o>0||c>0&&a;)o!==0&&(c===0||!a||n.z<=a.z)?(r=n,n=n.nextZ,o--):(r=a,a=a.nextZ,c--),s?s.nextZ=r:i=r,r.prevZ=s,s=r;n=a}s.nextZ=null,e*=2}while(t>1);return i}function ko(i,t,e,n,r){return i=(i-e)*r|0,t=(t-n)*r|0,i=(i|i<<8)&16711935,i=(i|i<<4)&252645135,i=(i|i<<2)&858993459,i=(i|i<<1)&1431655765,t=(t|t<<8)&16711935,t=(t|t<<4)&252645135,t=(t|t<<2)&858993459,t=(t|t<<1)&1431655765,i|t<<1}function op(i){let t=i,e=i;do(t.x<e.x||t.x===e.x&&t.y<e.y)&&(e=t),t=t.next;while(t!==i);return e}function Jh(i,t,e,n,r,s,a,o){return(r-a)*(t-o)>=(i-a)*(s-o)&&(i-a)*(n-o)>=(e-a)*(t-o)&&(e-a)*(s-o)>=(r-a)*(n-o)}function Ir(i,t,e,n,r,s,a,o){return!(i===a&&t===o)&&Jh(i,t,e,n,r,s,a,o)}function cp(i,t){return i.next.i!==t.i&&i.prev.i!==t.i&&!lp(i,t)&&(Jr(i,t)&&Jr(t,i)&&hp(i,t)&&(Me(i.prev,i,t.prev)||Me(i,t.prev,t))||gr(i,t)&&Me(i.prev,i,i.next)>0&&Me(t.prev,t,t.next)>0)}function Me(i,t,e){return(t.y-i.y)*(e.x-t.x)-(t.x-i.x)*(e.y-t.y)}function gr(i,t){return i.x===t.x&&i.y===t.y}function Zh(i,t,e,n){const r=Cs(Me(i,t,e)),s=Cs(Me(i,t,n)),a=Cs(Me(e,n,i)),o=Cs(Me(e,n,t));return!!(r!==s&&a!==o||r===0&&Rs(i,e,t)||s===0&&Rs(i,n,t)||a===0&&Rs(e,i,n)||o===0&&Rs(e,t,n))}function Rs(i,t,e){return t.x<=Math.max(i.x,e.x)&&t.x>=Math.min(i.x,e.x)&&t.y<=Math.max(i.y,e.y)&&t.y>=Math.min(i.y,e.y)}function Cs(i){return i>0?1:i<0?-1:0}function lp(i,t){let e=i;do{if(e.i!==i.i&&e.next.i!==i.i&&e.i!==t.i&&e.next.i!==t.i&&Zh(e,e.next,i,t))return!0;e=e.next}while(e!==i);return!1}function Jr(i,t){return Me(i.prev,i,i.next)<0?Me(i,t,i.next)>=0&&Me(i,i.prev,t)>=0:Me(i,t,i.prev)<0||Me(i,i.next,t)<0}function hp(i,t){let e=i,n=!1;const r=(i.x+t.x)/2,s=(i.y+t.y)/2;do e.y>s!=e.next.y>s&&e.next.y!==e.y&&r<(e.next.x-e.x)*(s-e.y)/(e.next.y-e.y)+e.x&&(n=!n),e=e.next;while(e!==i);return n}function Kh(i,t){const e=zo(i.i,i.x,i.y),n=zo(t.i,t.x,t.y),r=i.next,s=t.prev;return i.next=t,t.prev=i,e.next=r,r.prev=e,n.next=e,e.prev=n,s.next=n,n.prev=s,n}function dl(i,t,e,n){const r=zo(i,t,e);return n?(r.next=n.next,r.prev=n,n.next.prev=r,n.next=r):(r.prev=r,r.next=r),r}function Zr(i){i.next.prev=i.prev,i.prev.next=i.next,i.prevZ&&(i.prevZ.nextZ=i.nextZ),i.nextZ&&(i.nextZ.prevZ=i.prevZ)}function zo(i,t,e){return{i,x:t,y:e,prev:null,next:null,z:0,prevZ:null,nextZ:null,steiner:!1}}function up(i,t,e,n){let r=0;for(let s=t,a=e-n;s<e;s+=n)r+=(i[a]-i[s])*(i[s+1]+i[a+1]),a=s;return r}class fp{static triangulate(t,e,n=2){return Jd(t,e,n)}}class rr{static area(t){const e=t.length;let n=0;for(let r=e-1,s=0;s<e;r=s++)n+=t[r].x*t[s].y-t[s].x*t[r].y;return n*.5}static isClockWise(t){return rr.area(t)<0}static triangulateShape(t,e){const n=[],r=[],s=[];pl(t),ml(n,t);let a=t.length;e.forEach(pl);for(let c=0;c<e.length;c++)r.push(a),a+=e[c].length,ml(n,e[c]);const o=fp.triangulate(n,r);for(let c=0;c<o.length;c+=3)s.push(o.slice(c,c+3));return s}}function pl(i){const t=i.length;t>2&&i[t-1].equals(i[0])&&i.pop()}function ml(i,t){for(let e=0;e<t.length;e++)i.push(t[e].x),i.push(t[e].y)}class cc extends Le{constructor(t=new Yh([new St(.5,.5),new St(-.5,.5),new St(-.5,-.5),new St(.5,-.5)]),e={}){super(),this.type="ExtrudeGeometry",this.parameters={shapes:t,options:e},t=Array.isArray(t)?t:[t];const n=this,r=[],s=[];for(let o=0,c=t.length;o<c;o++){const l=t[o];a(l)}this.setAttribute("position",new he(r,3)),this.setAttribute("uv",new he(s,2)),this.computeVertexNormals();function a(o){const c=[],l=e.curveSegments!==void 0?e.curveSegments:12,h=e.steps!==void 0?e.steps:1,u=e.depth!==void 0?e.depth:1;let d=e.bevelEnabled!==void 0?e.bevelEnabled:!0,f=e.bevelThickness!==void 0?e.bevelThickness:.2,m=e.bevelSize!==void 0?e.bevelSize:f-.1,x=e.bevelOffset!==void 0?e.bevelOffset:0,g=e.bevelSegments!==void 0?e.bevelSegments:3;const p=e.extrudePath,T=e.UVGenerator!==void 0?e.UVGenerator:dp;let y,M=!1,w,E,A,C;p&&(y=p.getSpacedPoints(h),M=!0,d=!1,w=p.computeFrenetFrames(h,!1),E=new O,A=new O,C=new O),d||(g=0,f=0,m=0,x=0);const v=o.extractPoints(l);let _=v.shape;const S=v.holes;if(!rr.isClockWise(_)){_=_.reverse();for(let K=0,F=S.length;K<F;K++){const z=S[K];rr.isClockWise(z)&&(S[K]=z.reverse())}}function D(K){const z=10000000000000001e-36;let W=K[0];for(let Q=1;Q<=K.length;Q++){const ot=Q%K.length,ut=K[ot],Pt=ut.x-W.x,kt=ut.y-W.y,I=Pt*Pt+kt*kt,R=Math.max(Math.abs(ut.x),Math.abs(ut.y),Math.abs(W.x),Math.abs(W.y)),Y=z*R*R;if(I<=Y){K.splice(ot,1),Q--;continue}W=ut}}D(_),S.forEach(D);const U=S.length,N=_;for(let K=0;K<U;K++){const F=S[K];_=_.concat(F)}function B(K,F,z){return F||console.error("THREE.ExtrudeGeometry: vec does not exist"),K.clone().addScaledVector(F,z)}const Z=_.length;function H(K,F,z){let W,Q,ot;const ut=K.x-F.x,Pt=K.y-F.y,kt=z.x-K.x,I=z.y-K.y,R=ut*ut+Pt*Pt,Y=ut*I-Pt*kt;if(Math.abs(Y)>Number.EPSILON){const nt=Math.sqrt(R),dt=Math.sqrt(kt*kt+I*I),at=F.x-Pt/nt,Ft=F.y+ut/nt,Mt=z.x-I/dt,It=z.y+kt/dt,Ut=((Mt-at)*I-(It-Ft)*kt)/(ut*I-Pt*kt);W=at+ut*Ut-K.x,Q=Ft+Pt*Ut-K.y;const mt=W*W+Q*Q;if(mt<=2)return new St(W,Q);ot=Math.sqrt(mt/2)}else{let nt=!1;ut>Number.EPSILON?kt>Number.EPSILON&&(nt=!0):ut<-Number.EPSILON?kt<-Number.EPSILON&&(nt=!0):Math.sign(Pt)===Math.sign(I)&&(nt=!0),nt?(W=-Pt,Q=ut,ot=Math.sqrt(R)):(W=ut,Q=Pt,ot=Math.sqrt(R/2))}return new St(W/ot,Q/ot)}const st=[];for(let K=0,F=N.length,z=F-1,W=K+1;K<F;K++,z++,W++)z===F&&(z=0),W===F&&(W=0),st[K]=H(N[K],N[z],N[W]);const ht=[];let pt,_t=st.concat();for(let K=0,F=U;K<F;K++){const z=S[K];pt=[];for(let W=0,Q=z.length,ot=Q-1,ut=W+1;W<Q;W++,ot++,ut++)ot===Q&&(ot=0),ut===Q&&(ut=0),pt[W]=H(z[W],z[ot],z[ut]);ht.push(pt),_t=_t.concat(pt)}let Et;if(g===0)Et=rr.triangulateShape(N,S);else{const K=[],F=[];for(let z=0;z<g;z++){const W=z/g,Q=f*Math.cos(W*Math.PI/2),ot=m*Math.sin(W*Math.PI/2)+x;for(let ut=0,Pt=N.length;ut<Pt;ut++){const kt=B(N[ut],st[ut],ot);q(kt.x,kt.y,-Q),W===0&&K.push(kt)}for(let ut=0,Pt=U;ut<Pt;ut++){const kt=S[ut];pt=ht[ut];const I=[];for(let R=0,Y=kt.length;R<Y;R++){const nt=B(kt[R],pt[R],ot);q(nt.x,nt.y,-Q),W===0&&I.push(nt)}W===0&&F.push(I)}}Et=rr.triangulateShape(K,F)}const zt=Et.length,Vt=m+x;for(let K=0;K<Z;K++){const F=d?B(_[K],_t[K],Vt):_[K];M?(A.copy(w.normals[0]).multiplyScalar(F.x),E.copy(w.binormals[0]).multiplyScalar(F.y),C.copy(y[0]).add(A).add(E),q(C.x,C.y,C.z)):q(F.x,F.y,0)}for(let K=1;K<=h;K++)for(let F=0;F<Z;F++){const z=d?B(_[F],_t[F],Vt):_[F];M?(A.copy(w.normals[K]).multiplyScalar(z.x),E.copy(w.binormals[K]).multiplyScalar(z.y),C.copy(y[K]).add(A).add(E),q(C.x,C.y,C.z)):q(z.x,z.y,u/h*K)}for(let K=g-1;K>=0;K--){const F=K/g,z=f*Math.cos(F*Math.PI/2),W=m*Math.sin(F*Math.PI/2)+x;for(let Q=0,ot=N.length;Q<ot;Q++){const ut=B(N[Q],st[Q],W);q(ut.x,ut.y,u+z)}for(let Q=0,ot=S.length;Q<ot;Q++){const ut=S[Q];pt=ht[Q];for(let Pt=0,kt=ut.length;Pt<kt;Pt++){const I=B(ut[Pt],pt[Pt],W);M?q(I.x,I.y+y[h-1].y,y[h-1].x+z):q(I.x,I.y,u+z)}}}et(),ct();function et(){const K=r.length/3;if(d){let F=0,z=Z*F;for(let W=0;W<zt;W++){const Q=Et[W];k(Q[2]+z,Q[1]+z,Q[0]+z)}F=h+g*2,z=Z*F;for(let W=0;W<zt;W++){const Q=Et[W];k(Q[0]+z,Q[1]+z,Q[2]+z)}}else{for(let F=0;F<zt;F++){const z=Et[F];k(z[2],z[1],z[0])}for(let F=0;F<zt;F++){const z=Et[F];k(z[0]+Z*h,z[1]+Z*h,z[2]+Z*h)}}n.addGroup(K,r.length/3-K,0)}function ct(){const K=r.length/3;let F=0;G(N,F),F+=N.length;for(let z=0,W=S.length;z<W;z++){const Q=S[z];G(Q,F),F+=Q.length}n.addGroup(K,r.length/3-K,1)}function G(K,F){let z=K.length;for(;--z>=0;){const W=z;let Q=z-1;Q<0&&(Q=K.length-1);for(let ot=0,ut=h+g*2;ot<ut;ot++){const Pt=Z*ot,kt=Z*(ot+1),I=F+W+Pt,R=F+Q+Pt,Y=F+Q+kt,nt=F+W+kt;j(I,R,Y,nt)}}}function q(K,F,z){c.push(K),c.push(F),c.push(z)}function k(K,F,z){tt(K),tt(F),tt(z);const W=r.length/3,Q=T.generateTopUV(n,r,W-3,W-2,W-1);P(Q[0]),P(Q[1]),P(Q[2])}function j(K,F,z,W){tt(K),tt(F),tt(W),tt(F),tt(z),tt(W);const Q=r.length/3,ot=T.generateSideWallUV(n,r,Q-6,Q-3,Q-2,Q-1);P(ot[0]),P(ot[1]),P(ot[3]),P(ot[1]),P(ot[2]),P(ot[3])}function tt(K){r.push(c[K*3+0]),r.push(c[K*3+1]),r.push(c[K*3+2])}function P(K){s.push(K.x),s.push(K.y)}}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}toJSON(){const t=super.toJSON(),e=this.parameters.shapes,n=this.parameters.options;return pp(e,n,t)}static fromJSON(t,e){const n=[];for(let s=0,a=t.shapes.length;s<a;s++){const o=e[t.shapes[s]];n.push(o)}const r=t.options.extrudePath;return r!==void 0&&(t.options.extrudePath=new Zs[r.type]().fromJSON(r)),new cc(n,t.options)}}const dp={generateTopUV:function(i,t,e,n,r){const s=t[e*3],a=t[e*3+1],o=t[n*3],c=t[n*3+1],l=t[r*3],h=t[r*3+1];return[new St(s,a),new St(o,c),new St(l,h)]},generateSideWallUV:function(i,t,e,n,r,s){const a=t[e*3],o=t[e*3+1],c=t[e*3+2],l=t[n*3],h=t[n*3+1],u=t[n*3+2],d=t[r*3],f=t[r*3+1],m=t[r*3+2],x=t[s*3],g=t[s*3+1],p=t[s*3+2];return Math.abs(o-h)<Math.abs(a-l)?[new St(a,1-c),new St(l,1-u),new St(d,1-m),new St(x,1-p)]:[new St(o,1-c),new St(h,1-u),new St(f,1-m),new St(g,1-p)]}};function pp(i,t,e){if(e.shapes=[],Array.isArray(i))for(let n=0,r=i.length;n<r;n++){const s=i[n];e.shapes.push(s.uuid)}else e.shapes.push(i.uuid);return e.options=Object.assign({},t),t.extrudePath!==void 0&&(e.options.extrudePath=t.extrudePath.toJSON()),e}class lc extends Le{constructor(t=[new St(0,-.5),new St(.5,0),new St(0,.5)],e=12,n=0,r=Math.PI*2){super(),this.type="LatheGeometry",this.parameters={points:t,segments:e,phiStart:n,phiLength:r},e=Math.floor(e),r=Qt(r,0,Math.PI*2);const s=[],a=[],o=[],c=[],l=[],h=1/e,u=new O,d=new St,f=new O,m=new O,x=new O;let g=0,p=0;for(let T=0;T<=t.length-1;T++)switch(T){case 0:g=t[T+1].x-t[T].x,p=t[T+1].y-t[T].y,f.x=p*1,f.y=-g,f.z=p*0,x.copy(f),f.normalize(),c.push(f.x,f.y,f.z);break;case t.length-1:c.push(x.x,x.y,x.z);break;default:g=t[T+1].x-t[T].x,p=t[T+1].y-t[T].y,f.x=p*1,f.y=-g,f.z=p*0,m.copy(f),f.x+=x.x,f.y+=x.y,f.z+=x.z,f.normalize(),c.push(f.x,f.y,f.z),x.copy(m)}for(let T=0;T<=e;T++){const y=n+T*h*r,M=Math.sin(y),w=Math.cos(y);for(let E=0;E<=t.length-1;E++){u.x=t[E].x*M,u.y=t[E].y,u.z=t[E].x*w,a.push(u.x,u.y,u.z),d.x=T/e,d.y=E/(t.length-1),o.push(d.x,d.y);const A=c[3*E+0]*M,C=c[3*E+1],v=c[3*E+0]*w;l.push(A,C,v)}}for(let T=0;T<e;T++)for(let y=0;y<t.length-1;y++){const M=y+T*t.length,w=M,E=M+t.length,A=M+t.length+1,C=M+1;s.push(w,E,C),s.push(A,C,E)}this.setIndex(s),this.setAttribute("position",new he(a,3)),this.setAttribute("uv",new he(o,2)),this.setAttribute("normal",new he(l,3))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new lc(t.points,t.segments,t.phiStart,t.phiLength)}}class ts extends Le{constructor(t=1,e=1,n=1,r=1){super(),this.type="PlaneGeometry",this.parameters={width:t,height:e,widthSegments:n,heightSegments:r};const s=t/2,a=e/2,o=Math.floor(n),c=Math.floor(r),l=o+1,h=c+1,u=t/o,d=e/c,f=[],m=[],x=[],g=[];for(let p=0;p<h;p++){const T=p*d-a;for(let y=0;y<l;y++){const M=y*u-s;m.push(M,-T,0),x.push(0,0,1),g.push(y/o),g.push(1-p/c)}}for(let p=0;p<c;p++)for(let T=0;T<o;T++){const y=T+l*p,M=T+l*(p+1),w=T+1+l*(p+1),E=T+1+l*p;f.push(y,M,E),f.push(M,w,E)}this.setIndex(f),this.setAttribute("position",new he(m,3)),this.setAttribute("normal",new he(x,3)),this.setAttribute("uv",new he(g,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new ts(t.width,t.height,t.widthSegments,t.heightSegments)}}class Xe extends Le{constructor(t=1,e=32,n=16,r=0,s=Math.PI*2,a=0,o=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:t,widthSegments:e,heightSegments:n,phiStart:r,phiLength:s,thetaStart:a,thetaLength:o},e=Math.max(3,Math.floor(e)),n=Math.max(2,Math.floor(n));const c=Math.min(a+o,Math.PI);let l=0;const h=[],u=new O,d=new O,f=[],m=[],x=[],g=[];for(let p=0;p<=n;p++){const T=[],y=p/n;let M=0;p===0&&a===0?M=.5/e:p===n&&c===Math.PI&&(M=-.5/e);for(let w=0;w<=e;w++){const E=w/e;u.x=-t*Math.cos(r+E*s)*Math.sin(a+y*o),u.y=t*Math.cos(a+y*o),u.z=t*Math.sin(r+E*s)*Math.sin(a+y*o),m.push(u.x,u.y,u.z),d.copy(u).normalize(),x.push(d.x,d.y,d.z),g.push(E+M,1-y),T.push(l++)}h.push(T)}for(let p=0;p<n;p++)for(let T=0;T<e;T++){const y=h[p][T+1],M=h[p][T],w=h[p+1][T],E=h[p+1][T+1];(p!==0||a>0)&&f.push(y,M,E),(p!==n-1||c<Math.PI)&&f.push(M,w,E)}this.setIndex(f),this.setAttribute("position",new he(m,3)),this.setAttribute("normal",new he(x,3)),this.setAttribute("uv",new he(g,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Xe(t.radius,t.widthSegments,t.heightSegments,t.phiStart,t.phiLength,t.thetaStart,t.thetaLength)}}class hr extends Le{constructor(t=1,e=.4,n=12,r=48,s=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:t,tube:e,radialSegments:n,tubularSegments:r,arc:s},n=Math.floor(n),r=Math.floor(r);const a=[],o=[],c=[],l=[],h=new O,u=new O,d=new O;for(let f=0;f<=n;f++)for(let m=0;m<=r;m++){const x=m/r*s,g=f/n*Math.PI*2;u.x=(t+e*Math.cos(g))*Math.cos(x),u.y=(t+e*Math.cos(g))*Math.sin(x),u.z=e*Math.sin(g),o.push(u.x,u.y,u.z),h.x=t*Math.cos(x),h.y=t*Math.sin(x),d.subVectors(u,h).normalize(),c.push(d.x,d.y,d.z),l.push(m/r),l.push(f/n)}for(let f=1;f<=n;f++)for(let m=1;m<=r;m++){const x=(r+1)*f+m-1,g=(r+1)*(f-1)+m-1,p=(r+1)*(f-1)+m,T=(r+1)*f+m;a.push(x,g,T),a.push(g,p,T)}this.setIndex(a),this.setAttribute("position",new he(o,3)),this.setAttribute("normal",new he(c,3)),this.setAttribute("uv",new he(l,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new hr(t.radius,t.tube,t.radialSegments,t.tubularSegments,t.arc)}}class es extends Le{constructor(t=new Xh(new O(-1,-1,0),new O(-1,1,0),new O(1,1,0)),e=64,n=1,r=8,s=!1){super(),this.type="TubeGeometry",this.parameters={path:t,tubularSegments:e,radius:n,radialSegments:r,closed:s};const a=t.computeFrenetFrames(e,s);this.tangents=a.tangents,this.normals=a.normals,this.binormals=a.binormals;const o=new O,c=new O,l=new St;let h=new O;const u=[],d=[],f=[],m=[];x(),this.setIndex(m),this.setAttribute("position",new he(u,3)),this.setAttribute("normal",new he(d,3)),this.setAttribute("uv",new he(f,2));function x(){for(let y=0;y<e;y++)g(y);g(s===!1?e:0),T(),p()}function g(y){h=t.getPointAt(y/e,h);const M=a.normals[y],w=a.binormals[y];for(let E=0;E<=r;E++){const A=E/r*Math.PI*2,C=Math.sin(A),v=-Math.cos(A);c.x=v*M.x+C*w.x,c.y=v*M.y+C*w.y,c.z=v*M.z+C*w.z,c.normalize(),d.push(c.x,c.y,c.z),o.x=h.x+n*c.x,o.y=h.y+n*c.y,o.z=h.z+n*c.z,u.push(o.x,o.y,o.z)}}function p(){for(let y=1;y<=e;y++)for(let M=1;M<=r;M++){const w=(r+1)*(y-1)+(M-1),E=(r+1)*y+(M-1),A=(r+1)*y+M,C=(r+1)*(y-1)+M;m.push(w,E,C),m.push(E,A,C)}}function T(){for(let y=0;y<=e;y++)for(let M=0;M<=r;M++)l.x=y/e,l.y=M/r,f.push(l.x,l.y)}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}toJSON(){const t=super.toJSON();return t.path=this.parameters.path.toJSON(),t}static fromJSON(t){return new es(new Zs[t.path.type]().fromJSON(t.path),t.tubularSegments,t.radius,t.radialSegments,t.closed)}}class Ai extends Qr{constructor(t){super(),this.isMeshStandardMaterial=!0,this.type="MeshStandardMaterial",this.defines={STANDARD:""},this.color=new Yt(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Yt(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Th,this.normalScale=new St(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new dn,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.defines={STANDARD:""},this.color.copy(t.color),this.roughness=t.roughness,this.metalness=t.metalness,this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.emissive.copy(t.emissive),this.emissiveMap=t.emissiveMap,this.emissiveIntensity=t.emissiveIntensity,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.roughnessMap=t.roughnessMap,this.metalnessMap=t.metalnessMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.envMapIntensity=t.envMapIntensity,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.flatShading=t.flatShading,this.fog=t.fog,this}}class mp extends Qr{constructor(t){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=Cf,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(t)}copy(t){return super.copy(t),this.depthPacking=t.depthPacking,this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this}}class gp extends Qr{constructor(t){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(t)}copy(t){return super.copy(t),this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this}}class jh extends Ce{constructor(t,e=1){super(),this.isLight=!0,this.type="Light",this.color=new Yt(t),this.intensity=e}dispose(){}copy(t,e){return super.copy(t,e),this.color.copy(t.color),this.intensity=t.intensity,this}toJSON(t){const e=super.toJSON(t);return e.object.color=this.color.getHex(),e.object.intensity=this.intensity,this.groundColor!==void 0&&(e.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(e.object.distance=this.distance),this.angle!==void 0&&(e.object.angle=this.angle),this.decay!==void 0&&(e.object.decay=this.decay),this.penumbra!==void 0&&(e.object.penumbra=this.penumbra),this.shadow!==void 0&&(e.object.shadow=this.shadow.toJSON()),this.target!==void 0&&(e.object.target=this.target.uuid),e}}class vp extends jh{constructor(t,e,n){super(t,n),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(Ce.DEFAULT_UP),this.updateMatrix(),this.groundColor=new Yt(e)}copy(t,e){return super.copy(t,e),this.groundColor.copy(t.groundColor),this}}const Fa=new ie,gl=new O,vl=new O;class _p{constructor(t){this.camera=t,this.intensity=1,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new St(512,512),this.mapType=Cn,this.map=null,this.mapPass=null,this.matrix=new ie,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new rc,this._frameExtents=new St(1,1),this._viewportCount=1,this._viewports=[new de(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(t){const e=this.camera,n=this.matrix;gl.setFromMatrixPosition(t.matrixWorld),e.position.copy(gl),vl.setFromMatrixPosition(t.target.matrixWorld),e.lookAt(vl),e.updateMatrixWorld(),Fa.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Fa,e.coordinateSystem,e.reversedDepth),e.reversedDepth?n.set(.5,0,0,.5,0,.5,0,.5,0,0,1,0,0,0,0,1):n.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),n.multiply(Fa)}getViewport(t){return this._viewports[t]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(t){return this.camera=t.camera.clone(),this.intensity=t.intensity,this.bias=t.bias,this.radius=t.radius,this.autoUpdate=t.autoUpdate,this.needsUpdate=t.needsUpdate,this.normalBias=t.normalBias,this.blurSamples=t.blurSamples,this.mapSize.copy(t.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){const t={};return this.intensity!==1&&(t.intensity=this.intensity),this.bias!==0&&(t.bias=this.bias),this.normalBias!==0&&(t.normalBias=this.normalBias),this.radius!==1&&(t.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(t.mapSize=this.mapSize.toArray()),t.camera=this.camera.toJSON(!1).object,delete t.camera.matrix,t}}class Qh extends Nh{constructor(t=-1,e=1,n=1,r=-1,s=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=t,this.right=e,this.top=n,this.bottom=r,this.near=s,this.far=a,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.left=t.left,this.right=t.right,this.top=t.top,this.bottom=t.bottom,this.near=t.near,this.far=t.far,this.zoom=t.zoom,this.view=t.view===null?null:Object.assign({},t.view),this}setViewOffset(t,e,n,r,s,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=r,this.view.width=s,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=(this.right-this.left)/(2*this.zoom),e=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,r=(this.top+this.bottom)/2;let s=n-t,a=n+t,o=r+e,c=r-e;if(this.view!==null&&this.view.enabled){const l=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;s+=l*this.view.offsetX,a=s+l*this.view.width,o-=h*this.view.offsetY,c=o-h*this.view.height}this.projectionMatrix.makeOrthographic(s,a,o,c,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.zoom=this.zoom,e.object.left=this.left,e.object.right=this.right,e.object.top=this.top,e.object.bottom=this.bottom,e.object.near=this.near,e.object.far=this.far,this.view!==null&&(e.object.view=Object.assign({},this.view)),e}}class xp extends _p{constructor(){super(new Qh(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class Mp extends jh{constructor(t,e){super(t,e),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(Ce.DEFAULT_UP),this.updateMatrix(),this.target=new Ce,this.shadow=new xp}dispose(){this.shadow.dispose()}copy(t){return super.copy(t),this.target=t.target.clone(),this.shadow=t.shadow.clone(),this}}class Sp extends un{constructor(t=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=t}}function _l(i,t,e,n){const r=yp(n);switch(e){case Sh:return i*t;case bh:return i*t/r.components*r.byteLength;case jo:return i*t/r.components*r.byteLength;case Eh:return i*t*2/r.components*r.byteLength;case Qo:return i*t*2/r.components*r.byteLength;case yh:return i*t*3/r.components*r.byteLength;case tn:return i*t*4/r.components*r.byteLength;case tc:return i*t*4/r.components*r.byteLength;case ks:case zs:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*8;case Hs:case Vs:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*16;case uo:case po:return Math.max(i,16)*Math.max(t,8)/4;case ho:case fo:return Math.max(i,8)*Math.max(t,8)/2;case mo:case go:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*8;case vo:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*16;case _o:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*16;case xo:return Math.floor((i+4)/5)*Math.floor((t+3)/4)*16;case Mo:return Math.floor((i+4)/5)*Math.floor((t+4)/5)*16;case So:return Math.floor((i+5)/6)*Math.floor((t+4)/5)*16;case yo:return Math.floor((i+5)/6)*Math.floor((t+5)/6)*16;case bo:return Math.floor((i+7)/8)*Math.floor((t+4)/5)*16;case Eo:return Math.floor((i+7)/8)*Math.floor((t+5)/6)*16;case To:return Math.floor((i+7)/8)*Math.floor((t+7)/8)*16;case wo:return Math.floor((i+9)/10)*Math.floor((t+4)/5)*16;case Ao:return Math.floor((i+9)/10)*Math.floor((t+5)/6)*16;case Ro:return Math.floor((i+9)/10)*Math.floor((t+7)/8)*16;case Co:return Math.floor((i+9)/10)*Math.floor((t+9)/10)*16;case Lo:return Math.floor((i+11)/12)*Math.floor((t+9)/10)*16;case Po:return Math.floor((i+11)/12)*Math.floor((t+11)/12)*16;case Do:case Io:case Uo:return Math.ceil(i/4)*Math.ceil(t/4)*16;case No:case Fo:return Math.ceil(i/4)*Math.ceil(t/4)*8;case Oo:case Bo:return Math.ceil(i/4)*Math.ceil(t/4)*16}throw new Error(`Unable to determine texture byte length for ${e} format.`)}function yp(i){switch(i){case Cn:case vh:return{byteLength:1,components:1};case Vr:case _h:case _r:return{byteLength:2,components:1};case Zo:case Ko:return{byteLength:2,components:4};case Di:case Jo:case An:return{byteLength:4,components:1};case xh:case Mh:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${i}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:$o}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=$o);/**
 * @license
 * Copyright 2010-2025 Three.js Authors
 * SPDX-License-Identifier: MIT
 */function tu(){let i=null,t=!1,e=null,n=null;function r(s,a){e(s,a),n=i.requestAnimationFrame(r)}return{start:function(){t!==!0&&e!==null&&(n=i.requestAnimationFrame(r),t=!0)},stop:function(){i.cancelAnimationFrame(n),t=!1},setAnimationLoop:function(s){e=s},setContext:function(s){i=s}}}function bp(i){const t=new WeakMap;function e(o,c){const l=o.array,h=o.usage,u=l.byteLength,d=i.createBuffer();i.bindBuffer(c,d),i.bufferData(c,l,h),o.onUploadCallback();let f;if(l instanceof Float32Array)f=i.FLOAT;else if(typeof Float16Array<"u"&&l instanceof Float16Array)f=i.HALF_FLOAT;else if(l instanceof Uint16Array)o.isFloat16BufferAttribute?f=i.HALF_FLOAT:f=i.UNSIGNED_SHORT;else if(l instanceof Int16Array)f=i.SHORT;else if(l instanceof Uint32Array)f=i.UNSIGNED_INT;else if(l instanceof Int32Array)f=i.INT;else if(l instanceof Int8Array)f=i.BYTE;else if(l instanceof Uint8Array)f=i.UNSIGNED_BYTE;else if(l instanceof Uint8ClampedArray)f=i.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+l);return{buffer:d,type:f,bytesPerElement:l.BYTES_PER_ELEMENT,version:o.version,size:u}}function n(o,c,l){const h=c.array,u=c.updateRanges;if(i.bindBuffer(l,o),u.length===0)i.bufferSubData(l,0,h);else{u.sort((f,m)=>f.start-m.start);let d=0;for(let f=1;f<u.length;f++){const m=u[d],x=u[f];x.start<=m.start+m.count+1?m.count=Math.max(m.count,x.start+x.count-m.start):(++d,u[d]=x)}u.length=d+1;for(let f=0,m=u.length;f<m;f++){const x=u[f];i.bufferSubData(l,x.start*h.BYTES_PER_ELEMENT,h,x.start,x.count)}c.clearUpdateRanges()}c.onUploadCallback()}function r(o){return o.isInterleavedBufferAttribute&&(o=o.data),t.get(o)}function s(o){o.isInterleavedBufferAttribute&&(o=o.data);const c=t.get(o);c&&(i.deleteBuffer(c.buffer),t.delete(o))}function a(o,c){if(o.isInterleavedBufferAttribute&&(o=o.data),o.isGLBufferAttribute){const h=t.get(o);(!h||h.version<o.version)&&t.set(o,{buffer:o.buffer,type:o.type,bytesPerElement:o.elementSize,version:o.version});return}const l=t.get(o);if(l===void 0)t.set(o,e(o,c));else if(l.version<o.version){if(l.size!==o.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");n(l.buffer,o,c),l.version=o.version}}return{get:r,remove:s,update:a}}var Ep=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,Tp=`#ifdef USE_ALPHAHASH
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
#endif`,wp=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,Ap=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Rp=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,Cp=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,Lp=`#ifdef USE_AOMAP
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
#endif`,Pp=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,Dp=`#ifdef USE_BATCHING
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
#endif`,Ip=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,Up=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,Np=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,Fp=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,Op=`#ifdef USE_IRIDESCENCE
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
#endif`,Bp=`#ifdef USE_BUMPMAP
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
#endif`,kp=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,zp=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,Hp=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,Vp=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,Gp=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,Wp=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,Xp=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,qp=`#if defined( USE_COLOR_ALPHA )
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
#endif`,Yp=`#define PI 3.141592653589793
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
} // validated`,$p=`#ifdef ENVMAP_TYPE_CUBE_UV
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
#endif`,Jp=`vec3 transformedNormal = objectNormal;
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
#endif`,Zp=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,Kp=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,jp=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,Qp=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,t0="gl_FragColor = linearToOutputTexel( gl_FragColor );",e0=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,n0=`#ifdef USE_ENVMAP
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
#endif`,i0=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,r0=`#ifdef USE_ENVMAP
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
#endif`,s0=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,a0=`#ifdef USE_ENVMAP
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
#endif`,o0=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,c0=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,l0=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,h0=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,u0=`#ifdef USE_GRADIENTMAP
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
}`,f0=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,d0=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,p0=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,m0=`uniform bool receiveShadow;
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
#endif`,g0=`#ifdef USE_ENVMAP
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
#endif`,v0=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,_0=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,x0=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,M0=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,S0=`PhysicalMaterial material;
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
#endif`,y0=`struct PhysicalMaterial {
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
}`,b0=`
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
#endif`,E0=`#if defined( RE_IndirectDiffuse )
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
#endif`,T0=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,w0=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,A0=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,R0=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,C0=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,L0=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,P0=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,D0=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,I0=`#if defined( USE_POINTS_UV )
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
#endif`,U0=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,N0=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,F0=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,O0=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,B0=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,k0=`#ifdef USE_MORPHTARGETS
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
#endif`,z0=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,H0=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 nonPerturbedNormal = normal;`,V0=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
#endif`,G0=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,W0=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,X0=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,q0=`#ifdef USE_NORMALMAP
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
#endif`,Y0=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,$0=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,J0=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,Z0=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,K0=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,j0=`vec3 packNormalToRGB( const in vec3 normal ) {
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
}`,Q0=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,t1=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,e1=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,n1=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,i1=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,r1=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,s1=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,a1=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,o1=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
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
#endif`,c1=`float getShadowMask() {
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
}`,l1=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,h1=`#ifdef USE_SKINNING
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
#endif`,u1=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,f1=`#ifdef USE_SKINNING
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
#endif`,d1=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,p1=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,m1=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,g1=`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,v1=`#ifdef USE_TRANSMISSION
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
#endif`,_1=`#ifdef USE_TRANSMISSION
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
#endif`,x1=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,M1=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,S1=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,y1=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const b1=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,E1=`uniform sampler2D t2D;
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
}`,T1=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,w1=`#ifdef ENVMAP_TYPE_CUBE
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
}`,A1=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,R1=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,C1=`#include <common>
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
}`,L1=`#if DEPTH_PACKING == 3200
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
}`,P1=`#define DISTANCE
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
}`,D1=`#define DISTANCE
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
}`,I1=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,U1=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,N1=`uniform float scale;
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
}`,F1=`uniform vec3 diffuse;
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
}`,O1=`#include <common>
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
}`,B1=`uniform vec3 diffuse;
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
}`,k1=`#define LAMBERT
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
}`,z1=`#define LAMBERT
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
}`,H1=`#define MATCAP
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
}`,V1=`#define MATCAP
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
}`,G1=`#define NORMAL
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
}`,W1=`#define NORMAL
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
}`,X1=`#define PHONG
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
}`,q1=`#define PHONG
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
}`,Y1=`#define STANDARD
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
}`,$1=`#define STANDARD
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
}`,J1=`#define TOON
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
}`,Z1=`#define TOON
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
}`,K1=`uniform float size;
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
}`,j1=`uniform vec3 diffuse;
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
}`,Q1=`#include <common>
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
}`,tm=`uniform vec3 color;
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
}`,em=`uniform float rotation;
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
}`,nm=`uniform vec3 diffuse;
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
}`,jt={alphahash_fragment:Ep,alphahash_pars_fragment:Tp,alphamap_fragment:wp,alphamap_pars_fragment:Ap,alphatest_fragment:Rp,alphatest_pars_fragment:Cp,aomap_fragment:Lp,aomap_pars_fragment:Pp,batching_pars_vertex:Dp,batching_vertex:Ip,begin_vertex:Up,beginnormal_vertex:Np,bsdfs:Fp,iridescence_fragment:Op,bumpmap_pars_fragment:Bp,clipping_planes_fragment:kp,clipping_planes_pars_fragment:zp,clipping_planes_pars_vertex:Hp,clipping_planes_vertex:Vp,color_fragment:Gp,color_pars_fragment:Wp,color_pars_vertex:Xp,color_vertex:qp,common:Yp,cube_uv_reflection_fragment:$p,defaultnormal_vertex:Jp,displacementmap_pars_vertex:Zp,displacementmap_vertex:Kp,emissivemap_fragment:jp,emissivemap_pars_fragment:Qp,colorspace_fragment:t0,colorspace_pars_fragment:e0,envmap_fragment:n0,envmap_common_pars_fragment:i0,envmap_pars_fragment:r0,envmap_pars_vertex:s0,envmap_physical_pars_fragment:g0,envmap_vertex:a0,fog_vertex:o0,fog_pars_vertex:c0,fog_fragment:l0,fog_pars_fragment:h0,gradientmap_pars_fragment:u0,lightmap_pars_fragment:f0,lights_lambert_fragment:d0,lights_lambert_pars_fragment:p0,lights_pars_begin:m0,lights_toon_fragment:v0,lights_toon_pars_fragment:_0,lights_phong_fragment:x0,lights_phong_pars_fragment:M0,lights_physical_fragment:S0,lights_physical_pars_fragment:y0,lights_fragment_begin:b0,lights_fragment_maps:E0,lights_fragment_end:T0,logdepthbuf_fragment:w0,logdepthbuf_pars_fragment:A0,logdepthbuf_pars_vertex:R0,logdepthbuf_vertex:C0,map_fragment:L0,map_pars_fragment:P0,map_particle_fragment:D0,map_particle_pars_fragment:I0,metalnessmap_fragment:U0,metalnessmap_pars_fragment:N0,morphinstance_vertex:F0,morphcolor_vertex:O0,morphnormal_vertex:B0,morphtarget_pars_vertex:k0,morphtarget_vertex:z0,normal_fragment_begin:H0,normal_fragment_maps:V0,normal_pars_fragment:G0,normal_pars_vertex:W0,normal_vertex:X0,normalmap_pars_fragment:q0,clearcoat_normal_fragment_begin:Y0,clearcoat_normal_fragment_maps:$0,clearcoat_pars_fragment:J0,iridescence_pars_fragment:Z0,opaque_fragment:K0,packing:j0,premultiplied_alpha_fragment:Q0,project_vertex:t1,dithering_fragment:e1,dithering_pars_fragment:n1,roughnessmap_fragment:i1,roughnessmap_pars_fragment:r1,shadowmap_pars_fragment:s1,shadowmap_pars_vertex:a1,shadowmap_vertex:o1,shadowmask_pars_fragment:c1,skinbase_vertex:l1,skinning_pars_vertex:h1,skinning_vertex:u1,skinnormal_vertex:f1,specularmap_fragment:d1,specularmap_pars_fragment:p1,tonemapping_fragment:m1,tonemapping_pars_fragment:g1,transmission_fragment:v1,transmission_pars_fragment:_1,uv_pars_fragment:x1,uv_pars_vertex:M1,uv_vertex:S1,worldpos_vertex:y1,background_vert:b1,background_frag:E1,backgroundCube_vert:T1,backgroundCube_frag:w1,cube_vert:A1,cube_frag:R1,depth_vert:C1,depth_frag:L1,distanceRGBA_vert:P1,distanceRGBA_frag:D1,equirect_vert:I1,equirect_frag:U1,linedashed_vert:N1,linedashed_frag:F1,meshbasic_vert:O1,meshbasic_frag:B1,meshlambert_vert:k1,meshlambert_frag:z1,meshmatcap_vert:H1,meshmatcap_frag:V1,meshnormal_vert:G1,meshnormal_frag:W1,meshphong_vert:X1,meshphong_frag:q1,meshphysical_vert:Y1,meshphysical_frag:$1,meshtoon_vert:J1,meshtoon_frag:Z1,points_vert:K1,points_frag:j1,shadow_vert:Q1,shadow_frag:tm,sprite_vert:em,sprite_frag:nm},bt={common:{diffuse:{value:new Yt(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Kt},alphaMap:{value:null},alphaMapTransform:{value:new Kt},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Kt}},envmap:{envMap:{value:null},envMapRotation:{value:new Kt},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Kt}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Kt}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Kt},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Kt},normalScale:{value:new St(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Kt},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Kt}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Kt}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Kt}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Yt(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new Yt(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Kt},alphaTest:{value:0},uvTransform:{value:new Kt}},sprite:{diffuse:{value:new Yt(16777215)},opacity:{value:1},center:{value:new St(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Kt},alphaMap:{value:null},alphaMapTransform:{value:new Kt},alphaTest:{value:0}}},En={basic:{uniforms:ze([bt.common,bt.specularmap,bt.envmap,bt.aomap,bt.lightmap,bt.fog]),vertexShader:jt.meshbasic_vert,fragmentShader:jt.meshbasic_frag},lambert:{uniforms:ze([bt.common,bt.specularmap,bt.envmap,bt.aomap,bt.lightmap,bt.emissivemap,bt.bumpmap,bt.normalmap,bt.displacementmap,bt.fog,bt.lights,{emissive:{value:new Yt(0)}}]),vertexShader:jt.meshlambert_vert,fragmentShader:jt.meshlambert_frag},phong:{uniforms:ze([bt.common,bt.specularmap,bt.envmap,bt.aomap,bt.lightmap,bt.emissivemap,bt.bumpmap,bt.normalmap,bt.displacementmap,bt.fog,bt.lights,{emissive:{value:new Yt(0)},specular:{value:new Yt(1118481)},shininess:{value:30}}]),vertexShader:jt.meshphong_vert,fragmentShader:jt.meshphong_frag},standard:{uniforms:ze([bt.common,bt.envmap,bt.aomap,bt.lightmap,bt.emissivemap,bt.bumpmap,bt.normalmap,bt.displacementmap,bt.roughnessmap,bt.metalnessmap,bt.fog,bt.lights,{emissive:{value:new Yt(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:jt.meshphysical_vert,fragmentShader:jt.meshphysical_frag},toon:{uniforms:ze([bt.common,bt.aomap,bt.lightmap,bt.emissivemap,bt.bumpmap,bt.normalmap,bt.displacementmap,bt.gradientmap,bt.fog,bt.lights,{emissive:{value:new Yt(0)}}]),vertexShader:jt.meshtoon_vert,fragmentShader:jt.meshtoon_frag},matcap:{uniforms:ze([bt.common,bt.bumpmap,bt.normalmap,bt.displacementmap,bt.fog,{matcap:{value:null}}]),vertexShader:jt.meshmatcap_vert,fragmentShader:jt.meshmatcap_frag},points:{uniforms:ze([bt.points,bt.fog]),vertexShader:jt.points_vert,fragmentShader:jt.points_frag},dashed:{uniforms:ze([bt.common,bt.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:jt.linedashed_vert,fragmentShader:jt.linedashed_frag},depth:{uniforms:ze([bt.common,bt.displacementmap]),vertexShader:jt.depth_vert,fragmentShader:jt.depth_frag},normal:{uniforms:ze([bt.common,bt.bumpmap,bt.normalmap,bt.displacementmap,{opacity:{value:1}}]),vertexShader:jt.meshnormal_vert,fragmentShader:jt.meshnormal_frag},sprite:{uniforms:ze([bt.sprite,bt.fog]),vertexShader:jt.sprite_vert,fragmentShader:jt.sprite_frag},background:{uniforms:{uvTransform:{value:new Kt},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:jt.background_vert,fragmentShader:jt.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new Kt}},vertexShader:jt.backgroundCube_vert,fragmentShader:jt.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:jt.cube_vert,fragmentShader:jt.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:jt.equirect_vert,fragmentShader:jt.equirect_frag},distanceRGBA:{uniforms:ze([bt.common,bt.displacementmap,{referencePosition:{value:new O},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:jt.distanceRGBA_vert,fragmentShader:jt.distanceRGBA_frag},shadow:{uniforms:ze([bt.lights,bt.fog,{color:{value:new Yt(0)},opacity:{value:1}}]),vertexShader:jt.shadow_vert,fragmentShader:jt.shadow_frag}};En.physical={uniforms:ze([En.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Kt},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Kt},clearcoatNormalScale:{value:new St(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Kt},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Kt},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Kt},sheen:{value:0},sheenColor:{value:new Yt(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Kt},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Kt},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Kt},transmissionSamplerSize:{value:new St},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Kt},attenuationDistance:{value:0},attenuationColor:{value:new Yt(0)},specularColor:{value:new Yt(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Kt},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Kt},anisotropyVector:{value:new St},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Kt}}]),vertexShader:jt.meshphysical_vert,fragmentShader:jt.meshphysical_frag};const Ls={r:0,b:0,g:0},vi=new dn,im=new ie;function rm(i,t,e,n,r,s,a){const o=new Yt(0);let c=s===!0?0:1,l,h,u=null,d=0,f=null;function m(y){let M=y.isScene===!0?y.background:null;return M&&M.isTexture&&(M=(y.backgroundBlurriness>0?e:t).get(M)),M}function x(y){let M=!1;const w=m(y);w===null?p(o,c):w&&w.isColor&&(p(w,1),M=!0);const E=i.xr.getEnvironmentBlendMode();E==="additive"?n.buffers.color.setClear(0,0,0,1,a):E==="alpha-blend"&&n.buffers.color.setClear(0,0,0,0,a),(i.autoClear||M)&&(n.buffers.depth.setTest(!0),n.buffers.depth.setMask(!0),n.buffers.color.setMask(!0),i.clear(i.autoClearColor,i.autoClearDepth,i.autoClearStencil))}function g(y,M){const w=m(M);w&&(w.isCubeTexture||w.mapping===Qs)?(h===void 0&&(h=new ee(new Ge(1,1,1),new qn({name:"BackgroundCubeMaterial",uniforms:mr(En.backgroundCube.uniforms),vertexShader:En.backgroundCube.vertexShader,fragmentShader:En.backgroundCube.fragmentShader,side:$e,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),h.geometry.deleteAttribute("normal"),h.geometry.deleteAttribute("uv"),h.onBeforeRender=function(E,A,C){this.matrixWorld.copyPosition(C.matrixWorld)},Object.defineProperty(h.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),r.update(h)),vi.copy(M.backgroundRotation),vi.x*=-1,vi.y*=-1,vi.z*=-1,w.isCubeTexture&&w.isRenderTargetTexture===!1&&(vi.y*=-1,vi.z*=-1),h.material.uniforms.envMap.value=w,h.material.uniforms.flipEnvMap.value=w.isCubeTexture&&w.isRenderTargetTexture===!1?-1:1,h.material.uniforms.backgroundBlurriness.value=M.backgroundBlurriness,h.material.uniforms.backgroundIntensity.value=M.backgroundIntensity,h.material.uniforms.backgroundRotation.value.setFromMatrix4(im.makeRotationFromEuler(vi)),h.material.toneMapped=se.getTransfer(w.colorSpace)!==ce,(u!==w||d!==w.version||f!==i.toneMapping)&&(h.material.needsUpdate=!0,u=w,d=w.version,f=i.toneMapping),h.layers.enableAll(),y.unshift(h,h.geometry,h.material,0,0,null)):w&&w.isTexture&&(l===void 0&&(l=new ee(new ts(2,2),new qn({name:"BackgroundMaterial",uniforms:mr(En.background.uniforms),vertexShader:En.background.vertexShader,fragmentShader:En.background.fragmentShader,side:ci,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),l.geometry.deleteAttribute("normal"),Object.defineProperty(l.material,"map",{get:function(){return this.uniforms.t2D.value}}),r.update(l)),l.material.uniforms.t2D.value=w,l.material.uniforms.backgroundIntensity.value=M.backgroundIntensity,l.material.toneMapped=se.getTransfer(w.colorSpace)!==ce,w.matrixAutoUpdate===!0&&w.updateMatrix(),l.material.uniforms.uvTransform.value.copy(w.matrix),(u!==w||d!==w.version||f!==i.toneMapping)&&(l.material.needsUpdate=!0,u=w,d=w.version,f=i.toneMapping),l.layers.enableAll(),y.unshift(l,l.geometry,l.material,0,0,null))}function p(y,M){y.getRGB(Ls,Uh(i)),n.buffers.color.setClear(Ls.r,Ls.g,Ls.b,M,a)}function T(){h!==void 0&&(h.geometry.dispose(),h.material.dispose(),h=void 0),l!==void 0&&(l.geometry.dispose(),l.material.dispose(),l=void 0)}return{getClearColor:function(){return o},setClearColor:function(y,M=1){o.set(y),c=M,p(o,c)},getClearAlpha:function(){return c},setClearAlpha:function(y){c=y,p(o,c)},render:x,addToRenderList:g,dispose:T}}function sm(i,t){const e=i.getParameter(i.MAX_VERTEX_ATTRIBS),n={},r=d(null);let s=r,a=!1;function o(_,S,b,D,U){let N=!1;const B=u(D,b,S);s!==B&&(s=B,l(s.object)),N=f(_,D,b,U),N&&m(_,D,b,U),U!==null&&t.update(U,i.ELEMENT_ARRAY_BUFFER),(N||a)&&(a=!1,M(_,S,b,D),U!==null&&i.bindBuffer(i.ELEMENT_ARRAY_BUFFER,t.get(U).buffer))}function c(){return i.createVertexArray()}function l(_){return i.bindVertexArray(_)}function h(_){return i.deleteVertexArray(_)}function u(_,S,b){const D=b.wireframe===!0;let U=n[_.id];U===void 0&&(U={},n[_.id]=U);let N=U[S.id];N===void 0&&(N={},U[S.id]=N);let B=N[D];return B===void 0&&(B=d(c()),N[D]=B),B}function d(_){const S=[],b=[],D=[];for(let U=0;U<e;U++)S[U]=0,b[U]=0,D[U]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:S,enabledAttributes:b,attributeDivisors:D,object:_,attributes:{},index:null}}function f(_,S,b,D){const U=s.attributes,N=S.attributes;let B=0;const Z=b.getAttributes();for(const H in Z)if(Z[H].location>=0){const ht=U[H];let pt=N[H];if(pt===void 0&&(H==="instanceMatrix"&&_.instanceMatrix&&(pt=_.instanceMatrix),H==="instanceColor"&&_.instanceColor&&(pt=_.instanceColor)),ht===void 0||ht.attribute!==pt||pt&&ht.data!==pt.data)return!0;B++}return s.attributesNum!==B||s.index!==D}function m(_,S,b,D){const U={},N=S.attributes;let B=0;const Z=b.getAttributes();for(const H in Z)if(Z[H].location>=0){let ht=N[H];ht===void 0&&(H==="instanceMatrix"&&_.instanceMatrix&&(ht=_.instanceMatrix),H==="instanceColor"&&_.instanceColor&&(ht=_.instanceColor));const pt={};pt.attribute=ht,ht&&ht.data&&(pt.data=ht.data),U[H]=pt,B++}s.attributes=U,s.attributesNum=B,s.index=D}function x(){const _=s.newAttributes;for(let S=0,b=_.length;S<b;S++)_[S]=0}function g(_){p(_,0)}function p(_,S){const b=s.newAttributes,D=s.enabledAttributes,U=s.attributeDivisors;b[_]=1,D[_]===0&&(i.enableVertexAttribArray(_),D[_]=1),U[_]!==S&&(i.vertexAttribDivisor(_,S),U[_]=S)}function T(){const _=s.newAttributes,S=s.enabledAttributes;for(let b=0,D=S.length;b<D;b++)S[b]!==_[b]&&(i.disableVertexAttribArray(b),S[b]=0)}function y(_,S,b,D,U,N,B){B===!0?i.vertexAttribIPointer(_,S,b,U,N):i.vertexAttribPointer(_,S,b,D,U,N)}function M(_,S,b,D){x();const U=D.attributes,N=b.getAttributes(),B=S.defaultAttributeValues;for(const Z in N){const H=N[Z];if(H.location>=0){let st=U[Z];if(st===void 0&&(Z==="instanceMatrix"&&_.instanceMatrix&&(st=_.instanceMatrix),Z==="instanceColor"&&_.instanceColor&&(st=_.instanceColor)),st!==void 0){const ht=st.normalized,pt=st.itemSize,_t=t.get(st);if(_t===void 0)continue;const Et=_t.buffer,zt=_t.type,Vt=_t.bytesPerElement,et=zt===i.INT||zt===i.UNSIGNED_INT||st.gpuType===Jo;if(st.isInterleavedBufferAttribute){const ct=st.data,G=ct.stride,q=st.offset;if(ct.isInstancedInterleavedBuffer){for(let k=0;k<H.locationSize;k++)p(H.location+k,ct.meshPerAttribute);_.isInstancedMesh!==!0&&D._maxInstanceCount===void 0&&(D._maxInstanceCount=ct.meshPerAttribute*ct.count)}else for(let k=0;k<H.locationSize;k++)g(H.location+k);i.bindBuffer(i.ARRAY_BUFFER,Et);for(let k=0;k<H.locationSize;k++)y(H.location+k,pt/H.locationSize,zt,ht,G*Vt,(q+pt/H.locationSize*k)*Vt,et)}else{if(st.isInstancedBufferAttribute){for(let ct=0;ct<H.locationSize;ct++)p(H.location+ct,st.meshPerAttribute);_.isInstancedMesh!==!0&&D._maxInstanceCount===void 0&&(D._maxInstanceCount=st.meshPerAttribute*st.count)}else for(let ct=0;ct<H.locationSize;ct++)g(H.location+ct);i.bindBuffer(i.ARRAY_BUFFER,Et);for(let ct=0;ct<H.locationSize;ct++)y(H.location+ct,pt/H.locationSize,zt,ht,pt*Vt,pt/H.locationSize*ct*Vt,et)}}else if(B!==void 0){const ht=B[Z];if(ht!==void 0)switch(ht.length){case 2:i.vertexAttrib2fv(H.location,ht);break;case 3:i.vertexAttrib3fv(H.location,ht);break;case 4:i.vertexAttrib4fv(H.location,ht);break;default:i.vertexAttrib1fv(H.location,ht)}}}}T()}function w(){C();for(const _ in n){const S=n[_];for(const b in S){const D=S[b];for(const U in D)h(D[U].object),delete D[U];delete S[b]}delete n[_]}}function E(_){if(n[_.id]===void 0)return;const S=n[_.id];for(const b in S){const D=S[b];for(const U in D)h(D[U].object),delete D[U];delete S[b]}delete n[_.id]}function A(_){for(const S in n){const b=n[S];if(b[_.id]===void 0)continue;const D=b[_.id];for(const U in D)h(D[U].object),delete D[U];delete b[_.id]}}function C(){v(),a=!0,s!==r&&(s=r,l(s.object))}function v(){r.geometry=null,r.program=null,r.wireframe=!1}return{setup:o,reset:C,resetDefaultState:v,dispose:w,releaseStatesOfGeometry:E,releaseStatesOfProgram:A,initAttributes:x,enableAttribute:g,disableUnusedAttributes:T}}function am(i,t,e){let n;function r(l){n=l}function s(l,h){i.drawArrays(n,l,h),e.update(h,n,1)}function a(l,h,u){u!==0&&(i.drawArraysInstanced(n,l,h,u),e.update(h,n,u))}function o(l,h,u){if(u===0)return;t.get("WEBGL_multi_draw").multiDrawArraysWEBGL(n,l,0,h,0,u);let f=0;for(let m=0;m<u;m++)f+=h[m];e.update(f,n,1)}function c(l,h,u,d){if(u===0)return;const f=t.get("WEBGL_multi_draw");if(f===null)for(let m=0;m<l.length;m++)a(l[m],h[m],d[m]);else{f.multiDrawArraysInstancedWEBGL(n,l,0,h,0,d,0,u);let m=0;for(let x=0;x<u;x++)m+=h[x]*d[x];e.update(m,n,1)}}this.setMode=r,this.render=s,this.renderInstances=a,this.renderMultiDraw=o,this.renderMultiDrawInstances=c}function om(i,t,e,n){let r;function s(){if(r!==void 0)return r;if(t.has("EXT_texture_filter_anisotropic")===!0){const A=t.get("EXT_texture_filter_anisotropic");r=i.getParameter(A.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else r=0;return r}function a(A){return!(A!==tn&&n.convert(A)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_FORMAT))}function o(A){const C=A===_r&&(t.has("EXT_color_buffer_half_float")||t.has("EXT_color_buffer_float"));return!(A!==Cn&&n.convert(A)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_TYPE)&&A!==An&&!C)}function c(A){if(A==="highp"){if(i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.HIGH_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.HIGH_FLOAT).precision>0)return"highp";A="mediump"}return A==="mediump"&&i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.MEDIUM_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let l=e.precision!==void 0?e.precision:"highp";const h=c(l);h!==l&&(console.warn("THREE.WebGLRenderer:",l,"not supported, using",h,"instead."),l=h);const u=e.logarithmicDepthBuffer===!0,d=e.reversedDepthBuffer===!0&&t.has("EXT_clip_control"),f=i.getParameter(i.MAX_TEXTURE_IMAGE_UNITS),m=i.getParameter(i.MAX_VERTEX_TEXTURE_IMAGE_UNITS),x=i.getParameter(i.MAX_TEXTURE_SIZE),g=i.getParameter(i.MAX_CUBE_MAP_TEXTURE_SIZE),p=i.getParameter(i.MAX_VERTEX_ATTRIBS),T=i.getParameter(i.MAX_VERTEX_UNIFORM_VECTORS),y=i.getParameter(i.MAX_VARYING_VECTORS),M=i.getParameter(i.MAX_FRAGMENT_UNIFORM_VECTORS),w=m>0,E=i.getParameter(i.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:s,getMaxPrecision:c,textureFormatReadable:a,textureTypeReadable:o,precision:l,logarithmicDepthBuffer:u,reversedDepthBuffer:d,maxTextures:f,maxVertexTextures:m,maxTextureSize:x,maxCubemapSize:g,maxAttributes:p,maxVertexUniforms:T,maxVaryings:y,maxFragmentUniforms:M,vertexTextures:w,maxSamples:E}}function cm(i){const t=this;let e=null,n=0,r=!1,s=!1;const a=new xi,o=new Kt,c={value:null,needsUpdate:!1};this.uniform=c,this.numPlanes=0,this.numIntersection=0,this.init=function(u,d){const f=u.length!==0||d||n!==0||r;return r=d,n=u.length,f},this.beginShadows=function(){s=!0,h(null)},this.endShadows=function(){s=!1},this.setGlobalState=function(u,d){e=h(u,d,0)},this.setState=function(u,d,f){const m=u.clippingPlanes,x=u.clipIntersection,g=u.clipShadows,p=i.get(u);if(!r||m===null||m.length===0||s&&!g)s?h(null):l();else{const T=s?0:n,y=T*4;let M=p.clippingState||null;c.value=M,M=h(m,d,y,f);for(let w=0;w!==y;++w)M[w]=e[w];p.clippingState=M,this.numIntersection=x?this.numPlanes:0,this.numPlanes+=T}};function l(){c.value!==e&&(c.value=e,c.needsUpdate=n>0),t.numPlanes=n,t.numIntersection=0}function h(u,d,f,m){const x=u!==null?u.length:0;let g=null;if(x!==0){if(g=c.value,m!==!0||g===null){const p=f+x*4,T=d.matrixWorldInverse;o.getNormalMatrix(T),(g===null||g.length<p)&&(g=new Float32Array(p));for(let y=0,M=f;y!==x;++y,M+=4)a.copy(u[y]).applyMatrix4(T,o),a.normal.toArray(g,M),g[M+3]=a.constant}c.value=g,c.needsUpdate=!0}return t.numPlanes=x,t.numIntersection=0,g}}function lm(i){let t=new WeakMap;function e(a,o){return o===Xs?a.mapping=dr:o===co&&(a.mapping=pr),a}function n(a){if(a&&a.isTexture){const o=a.mapping;if(o===Xs||o===co)if(t.has(a)){const c=t.get(a).texture;return e(c,a.mapping)}else{const c=a.image;if(c&&c.height>0){const l=new Cd(c.height);return l.fromEquirectangularTexture(i,a),t.set(a,l),a.addEventListener("dispose",r),e(l.texture,a.mapping)}else return null}}return a}function r(a){const o=a.target;o.removeEventListener("dispose",r);const c=t.get(o);c!==void 0&&(t.delete(o),c.dispose())}function s(){t=new WeakMap}return{get:n,dispose:s}}const sr=4,xl=[.125,.215,.35,.446,.526,.582],yi=20,Oa=new Qh,Ml=new Yt;let Ba=null,ka=0,za=0,Ha=!1;const Mi=(1+Math.sqrt(5))/2,ji=1/Mi,Sl=[new O(-Mi,ji,0),new O(Mi,ji,0),new O(-ji,0,Mi),new O(ji,0,Mi),new O(0,Mi,-ji),new O(0,Mi,ji),new O(-1,1,-1),new O(1,1,-1),new O(-1,1,1),new O(1,1,1)],hm=new O;class Ho{constructor(t){this._renderer=t,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(t,e=0,n=.1,r=100,s={}){const{size:a=256,position:o=hm}=s;Ba=this._renderer.getRenderTarget(),ka=this._renderer.getActiveCubeFace(),za=this._renderer.getActiveMipmapLevel(),Ha=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(a);const c=this._allocateTargets();return c.depthBuffer=!0,this._sceneToCubeUV(t,n,r,c,o),e>0&&this._blur(c,0,0,e),this._applyPMREM(c),this._cleanup(c),c}fromEquirectangular(t,e=null){return this._fromTexture(t,e)}fromCubemap(t,e=null){return this._fromTexture(t,e)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=El(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=bl(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(t){this._lodMax=Math.floor(Math.log2(t)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let t=0;t<this._lodPlanes.length;t++)this._lodPlanes[t].dispose()}_cleanup(t){this._renderer.setRenderTarget(Ba,ka,za),this._renderer.xr.enabled=Ha,t.scissorTest=!1,Ps(t,0,0,t.width,t.height)}_fromTexture(t,e){t.mapping===dr||t.mapping===pr?this._setSize(t.image.length===0?16:t.image[0].width||t.image[0].image.width):this._setSize(t.image.width/4),Ba=this._renderer.getRenderTarget(),ka=this._renderer.getActiveCubeFace(),za=this._renderer.getActiveMipmapLevel(),Ha=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const n=e||this._allocateTargets();return this._textureToCubeUV(t,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){const t=3*Math.max(this._cubeSize,112),e=4*this._cubeSize,n={magFilter:Fe,minFilter:Fe,generateMipmaps:!1,type:_r,format:tn,colorSpace:Ii,depthBuffer:!1},r=yl(t,e,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==t||this._pingPongRenderTarget.height!==e){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=yl(t,e,n);const{_lodMax:s}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=um(s)),this._blurMaterial=fm(s,t,e)}return r}_compileMaterial(t){const e=new ee(this._lodPlanes[0],t);this._renderer.compile(e,Oa)}_sceneToCubeUV(t,e,n,r,s){const c=new un(90,1,e,n),l=[1,-1,1,1,1,1],h=[1,1,1,-1,-1,-1],u=this._renderer,d=u.autoClear,f=u.toneMapping;u.getClearColor(Ml),u.toneMapping=si,u.autoClear=!1,u.state.buffers.depth.getReversed()&&(u.setRenderTarget(r),u.clearDepth(),u.setRenderTarget(null));const x=new ta({name:"PMREM.Background",side:$e,depthWrite:!1,depthTest:!1}),g=new ee(new Ge,x);let p=!1;const T=t.background;T?T.isColor&&(x.color.copy(T),t.background=null,p=!0):(x.color.copy(Ml),p=!0);for(let y=0;y<6;y++){const M=y%3;M===0?(c.up.set(0,l[y],0),c.position.set(s.x,s.y,s.z),c.lookAt(s.x+h[y],s.y,s.z)):M===1?(c.up.set(0,0,l[y]),c.position.set(s.x,s.y,s.z),c.lookAt(s.x,s.y+h[y],s.z)):(c.up.set(0,l[y],0),c.position.set(s.x,s.y,s.z),c.lookAt(s.x,s.y,s.z+h[y]));const w=this._cubeSize;Ps(r,M*w,y>2?w:0,w,w),u.setRenderTarget(r),p&&u.render(g,c),u.render(t,c)}g.geometry.dispose(),g.material.dispose(),u.toneMapping=f,u.autoClear=d,t.background=T}_textureToCubeUV(t,e){const n=this._renderer,r=t.mapping===dr||t.mapping===pr;r?(this._cubemapMaterial===null&&(this._cubemapMaterial=El()),this._cubemapMaterial.uniforms.flipEnvMap.value=t.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=bl());const s=r?this._cubemapMaterial:this._equirectMaterial,a=new ee(this._lodPlanes[0],s),o=s.uniforms;o.envMap.value=t;const c=this._cubeSize;Ps(e,0,0,3*c,2*c),n.setRenderTarget(e),n.render(a,Oa)}_applyPMREM(t){const e=this._renderer,n=e.autoClear;e.autoClear=!1;const r=this._lodPlanes.length;for(let s=1;s<r;s++){const a=Math.sqrt(this._sigmas[s]*this._sigmas[s]-this._sigmas[s-1]*this._sigmas[s-1]),o=Sl[(r-s-1)%Sl.length];this._blur(t,s-1,s,a,o)}e.autoClear=n}_blur(t,e,n,r,s){const a=this._pingPongRenderTarget;this._halfBlur(t,a,e,n,r,"latitudinal",s),this._halfBlur(a,t,n,n,r,"longitudinal",s)}_halfBlur(t,e,n,r,s,a,o){const c=this._renderer,l=this._blurMaterial;a!=="latitudinal"&&a!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const h=3,u=new ee(this._lodPlanes[r],l),d=l.uniforms,f=this._sizeLods[n]-1,m=isFinite(s)?Math.PI/(2*f):2*Math.PI/(2*yi-1),x=s/m,g=isFinite(s)?1+Math.floor(h*x):yi;g>yi&&console.warn(`sigmaRadians, ${s}, is too large and will clip, as it requested ${g} samples when the maximum is set to ${yi}`);const p=[];let T=0;for(let A=0;A<yi;++A){const C=A/x,v=Math.exp(-C*C/2);p.push(v),A===0?T+=v:A<g&&(T+=2*v)}for(let A=0;A<p.length;A++)p[A]=p[A]/T;d.envMap.value=t.texture,d.samples.value=g,d.weights.value=p,d.latitudinal.value=a==="latitudinal",o&&(d.poleAxis.value=o);const{_lodMax:y}=this;d.dTheta.value=m,d.mipInt.value=y-n;const M=this._sizeLods[r],w=3*M*(r>y-sr?r-y+sr:0),E=4*(this._cubeSize-M);Ps(e,w,E,3*M,2*M),c.setRenderTarget(e),c.render(u,Oa)}}function um(i){const t=[],e=[],n=[];let r=i;const s=i-sr+1+xl.length;for(let a=0;a<s;a++){const o=Math.pow(2,r);e.push(o);let c=1/o;a>i-sr?c=xl[a-i+sr-1]:a===0&&(c=0),n.push(c);const l=1/(o-2),h=-l,u=1+l,d=[h,h,u,h,u,u,h,h,u,u,h,u],f=6,m=6,x=3,g=2,p=1,T=new Float32Array(x*m*f),y=new Float32Array(g*m*f),M=new Float32Array(p*m*f);for(let E=0;E<f;E++){const A=E%3*2/3-1,C=E>2?0:-1,v=[A,C,0,A+2/3,C,0,A+2/3,C+1,0,A,C,0,A+2/3,C+1,0,A,C+1,0];T.set(v,x*m*E),y.set(d,g*m*E);const _=[E,E,E,E,E,E];M.set(_,p*m*E)}const w=new Le;w.setAttribute("position",new me(T,x)),w.setAttribute("uv",new me(y,g)),w.setAttribute("faceIndex",new me(M,p)),t.push(w),r>sr&&r--}return{lodPlanes:t,sizeLods:e,sigmas:n}}function yl(i,t,e){const n=new Ui(i,t,e);return n.texture.mapping=Qs,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function Ps(i,t,e,n,r){i.viewport.set(t,e,n,r),i.scissor.set(t,e,n,r)}function fm(i,t,e){const n=new Float32Array(yi),r=new O(0,1,0);return new qn({name:"SphericalGaussianBlur",defines:{n:yi,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/e,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:n},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:r}},vertexShader:hc(),fragmentShader:`

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
		`,blending:ri,depthTest:!1,depthWrite:!1})}function bl(){return new qn({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:hc(),fragmentShader:`

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
		`,blending:ri,depthTest:!1,depthWrite:!1})}function El(){return new qn({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:hc(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:ri,depthTest:!1,depthWrite:!1})}function hc(){return`

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
	`}function dm(i){let t=new WeakMap,e=null;function n(o){if(o&&o.isTexture){const c=o.mapping,l=c===Xs||c===co,h=c===dr||c===pr;if(l||h){let u=t.get(o);const d=u!==void 0?u.texture.pmremVersion:0;if(o.isRenderTargetTexture&&o.pmremVersion!==d)return e===null&&(e=new Ho(i)),u=l?e.fromEquirectangular(o,u):e.fromCubemap(o,u),u.texture.pmremVersion=o.pmremVersion,t.set(o,u),u.texture;if(u!==void 0)return u.texture;{const f=o.image;return l&&f&&f.height>0||h&&f&&r(f)?(e===null&&(e=new Ho(i)),u=l?e.fromEquirectangular(o):e.fromCubemap(o),u.texture.pmremVersion=o.pmremVersion,t.set(o,u),o.addEventListener("dispose",s),u.texture):null}}}return o}function r(o){let c=0;const l=6;for(let h=0;h<l;h++)o[h]!==void 0&&c++;return c===l}function s(o){const c=o.target;c.removeEventListener("dispose",s);const l=t.get(c);l!==void 0&&(t.delete(c),l.dispose())}function a(){t=new WeakMap,e!==null&&(e.dispose(),e=null)}return{get:n,dispose:a}}function pm(i){const t={};function e(n){if(t[n]!==void 0)return t[n];let r;switch(n){case"WEBGL_depth_texture":r=i.getExtension("WEBGL_depth_texture")||i.getExtension("MOZ_WEBGL_depth_texture")||i.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":r=i.getExtension("EXT_texture_filter_anisotropic")||i.getExtension("MOZ_EXT_texture_filter_anisotropic")||i.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":r=i.getExtension("WEBGL_compressed_texture_s3tc")||i.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":r=i.getExtension("WEBGL_compressed_texture_pvrtc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:r=i.getExtension(n)}return t[n]=r,r}return{has:function(n){return e(n)!==null},init:function(){e("EXT_color_buffer_float"),e("WEBGL_clip_cull_distance"),e("OES_texture_float_linear"),e("EXT_color_buffer_half_float"),e("WEBGL_multisampled_render_to_texture"),e("WEBGL_render_shared_exponent")},get:function(n){const r=e(n);return r===null&&Yr("THREE.WebGLRenderer: "+n+" extension not supported."),r}}}function mm(i,t,e,n){const r={},s=new WeakMap;function a(u){const d=u.target;d.index!==null&&t.remove(d.index);for(const m in d.attributes)t.remove(d.attributes[m]);d.removeEventListener("dispose",a),delete r[d.id];const f=s.get(d);f&&(t.remove(f),s.delete(d)),n.releaseStatesOfGeometry(d),d.isInstancedBufferGeometry===!0&&delete d._maxInstanceCount,e.memory.geometries--}function o(u,d){return r[d.id]===!0||(d.addEventListener("dispose",a),r[d.id]=!0,e.memory.geometries++),d}function c(u){const d=u.attributes;for(const f in d)t.update(d[f],i.ARRAY_BUFFER)}function l(u){const d=[],f=u.index,m=u.attributes.position;let x=0;if(f!==null){const T=f.array;x=f.version;for(let y=0,M=T.length;y<M;y+=3){const w=T[y+0],E=T[y+1],A=T[y+2];d.push(w,E,E,A,A,w)}}else if(m!==void 0){const T=m.array;x=m.version;for(let y=0,M=T.length/3-1;y<M;y+=3){const w=y+0,E=y+1,A=y+2;d.push(w,E,E,A,A,w)}}else return;const g=new(Ah(d)?Ih:Dh)(d,1);g.version=x;const p=s.get(u);p&&t.remove(p),s.set(u,g)}function h(u){const d=s.get(u);if(d){const f=u.index;f!==null&&d.version<f.version&&l(u)}else l(u);return s.get(u)}return{get:o,update:c,getWireframeAttribute:h}}function gm(i,t,e){let n;function r(d){n=d}let s,a;function o(d){s=d.type,a=d.bytesPerElement}function c(d,f){i.drawElements(n,f,s,d*a),e.update(f,n,1)}function l(d,f,m){m!==0&&(i.drawElementsInstanced(n,f,s,d*a,m),e.update(f,n,m))}function h(d,f,m){if(m===0)return;t.get("WEBGL_multi_draw").multiDrawElementsWEBGL(n,f,0,s,d,0,m);let g=0;for(let p=0;p<m;p++)g+=f[p];e.update(g,n,1)}function u(d,f,m,x){if(m===0)return;const g=t.get("WEBGL_multi_draw");if(g===null)for(let p=0;p<d.length;p++)l(d[p]/a,f[p],x[p]);else{g.multiDrawElementsInstancedWEBGL(n,f,0,s,d,0,x,0,m);let p=0;for(let T=0;T<m;T++)p+=f[T]*x[T];e.update(p,n,1)}}this.setMode=r,this.setIndex=o,this.render=c,this.renderInstances=l,this.renderMultiDraw=h,this.renderMultiDrawInstances=u}function vm(i){const t={geometries:0,textures:0},e={frame:0,calls:0,triangles:0,points:0,lines:0};function n(s,a,o){switch(e.calls++,a){case i.TRIANGLES:e.triangles+=o*(s/3);break;case i.LINES:e.lines+=o*(s/2);break;case i.LINE_STRIP:e.lines+=o*(s-1);break;case i.LINE_LOOP:e.lines+=o*s;break;case i.POINTS:e.points+=o*s;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",a);break}}function r(){e.calls=0,e.triangles=0,e.points=0,e.lines=0}return{memory:t,render:e,programs:null,autoReset:!0,reset:r,update:n}}function _m(i,t,e){const n=new WeakMap,r=new de;function s(a,o,c){const l=a.morphTargetInfluences,h=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,u=h!==void 0?h.length:0;let d=n.get(o);if(d===void 0||d.count!==u){let v=function(){A.dispose(),n.delete(o),o.removeEventListener("dispose",v)};d!==void 0&&d.texture.dispose();const f=o.morphAttributes.position!==void 0,m=o.morphAttributes.normal!==void 0,x=o.morphAttributes.color!==void 0,g=o.morphAttributes.position||[],p=o.morphAttributes.normal||[],T=o.morphAttributes.color||[];let y=0;f===!0&&(y=1),m===!0&&(y=2),x===!0&&(y=3);let M=o.attributes.position.count*y,w=1;M>t.maxTextureSize&&(w=Math.ceil(M/t.maxTextureSize),M=t.maxTextureSize);const E=new Float32Array(M*w*4*u),A=new Rh(E,M,w,u);A.type=An,A.needsUpdate=!0;const C=y*4;for(let _=0;_<u;_++){const S=g[_],b=p[_],D=T[_],U=M*w*4*_;for(let N=0;N<S.count;N++){const B=N*C;f===!0&&(r.fromBufferAttribute(S,N),E[U+B+0]=r.x,E[U+B+1]=r.y,E[U+B+2]=r.z,E[U+B+3]=0),m===!0&&(r.fromBufferAttribute(b,N),E[U+B+4]=r.x,E[U+B+5]=r.y,E[U+B+6]=r.z,E[U+B+7]=0),x===!0&&(r.fromBufferAttribute(D,N),E[U+B+8]=r.x,E[U+B+9]=r.y,E[U+B+10]=r.z,E[U+B+11]=D.itemSize===4?r.w:1)}}d={count:u,texture:A,size:new St(M,w)},n.set(o,d),o.addEventListener("dispose",v)}if(a.isInstancedMesh===!0&&a.morphTexture!==null)c.getUniforms().setValue(i,"morphTexture",a.morphTexture,e);else{let f=0;for(let x=0;x<l.length;x++)f+=l[x];const m=o.morphTargetsRelative?1:1-f;c.getUniforms().setValue(i,"morphTargetBaseInfluence",m),c.getUniforms().setValue(i,"morphTargetInfluences",l)}c.getUniforms().setValue(i,"morphTargetsTexture",d.texture,e),c.getUniforms().setValue(i,"morphTargetsTextureSize",d.size)}return{update:s}}function xm(i,t,e,n){let r=new WeakMap;function s(c){const l=n.render.frame,h=c.geometry,u=t.get(c,h);if(r.get(u)!==l&&(t.update(u),r.set(u,l)),c.isInstancedMesh&&(c.hasEventListener("dispose",o)===!1&&c.addEventListener("dispose",o),r.get(c)!==l&&(e.update(c.instanceMatrix,i.ARRAY_BUFFER),c.instanceColor!==null&&e.update(c.instanceColor,i.ARRAY_BUFFER),r.set(c,l))),c.isSkinnedMesh){const d=c.skeleton;r.get(d)!==l&&(d.update(),r.set(d,l))}return u}function a(){r=new WeakMap}function o(c){const l=c.target;l.removeEventListener("dispose",o),e.remove(l.instanceMatrix),l.instanceColor!==null&&e.remove(l.instanceColor)}return{update:s,dispose:a}}const eu=new De,Tl=new zh(1,1),nu=new Rh,iu=new ld,ru=new Fh,wl=[],Al=[],Rl=new Float32Array(16),Cl=new Float32Array(9),Ll=new Float32Array(4);function yr(i,t,e){const n=i[0];if(n<=0||n>0)return i;const r=t*e;let s=wl[r];if(s===void 0&&(s=new Float32Array(r),wl[r]=s),t!==0){n.toArray(s,0);for(let a=1,o=0;a!==t;++a)o+=e,i[a].toArray(s,o)}return s}function we(i,t){if(i.length!==t.length)return!1;for(let e=0,n=i.length;e<n;e++)if(i[e]!==t[e])return!1;return!0}function Ae(i,t){for(let e=0,n=t.length;e<n;e++)i[e]=t[e]}function na(i,t){let e=Al[t];e===void 0&&(e=new Int32Array(t),Al[t]=e);for(let n=0;n!==t;++n)e[n]=i.allocateTextureUnit();return e}function Mm(i,t){const e=this.cache;e[0]!==t&&(i.uniform1f(this.addr,t),e[0]=t)}function Sm(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2f(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(we(e,t))return;i.uniform2fv(this.addr,t),Ae(e,t)}}function ym(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3f(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else if(t.r!==void 0)(e[0]!==t.r||e[1]!==t.g||e[2]!==t.b)&&(i.uniform3f(this.addr,t.r,t.g,t.b),e[0]=t.r,e[1]=t.g,e[2]=t.b);else{if(we(e,t))return;i.uniform3fv(this.addr,t),Ae(e,t)}}function bm(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4f(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(we(e,t))return;i.uniform4fv(this.addr,t),Ae(e,t)}}function Em(i,t){const e=this.cache,n=t.elements;if(n===void 0){if(we(e,t))return;i.uniformMatrix2fv(this.addr,!1,t),Ae(e,t)}else{if(we(e,n))return;Ll.set(n),i.uniformMatrix2fv(this.addr,!1,Ll),Ae(e,n)}}function Tm(i,t){const e=this.cache,n=t.elements;if(n===void 0){if(we(e,t))return;i.uniformMatrix3fv(this.addr,!1,t),Ae(e,t)}else{if(we(e,n))return;Cl.set(n),i.uniformMatrix3fv(this.addr,!1,Cl),Ae(e,n)}}function wm(i,t){const e=this.cache,n=t.elements;if(n===void 0){if(we(e,t))return;i.uniformMatrix4fv(this.addr,!1,t),Ae(e,t)}else{if(we(e,n))return;Rl.set(n),i.uniformMatrix4fv(this.addr,!1,Rl),Ae(e,n)}}function Am(i,t){const e=this.cache;e[0]!==t&&(i.uniform1i(this.addr,t),e[0]=t)}function Rm(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2i(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(we(e,t))return;i.uniform2iv(this.addr,t),Ae(e,t)}}function Cm(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3i(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(we(e,t))return;i.uniform3iv(this.addr,t),Ae(e,t)}}function Lm(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4i(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(we(e,t))return;i.uniform4iv(this.addr,t),Ae(e,t)}}function Pm(i,t){const e=this.cache;e[0]!==t&&(i.uniform1ui(this.addr,t),e[0]=t)}function Dm(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2ui(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(we(e,t))return;i.uniform2uiv(this.addr,t),Ae(e,t)}}function Im(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3ui(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(we(e,t))return;i.uniform3uiv(this.addr,t),Ae(e,t)}}function Um(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4ui(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(we(e,t))return;i.uniform4uiv(this.addr,t),Ae(e,t)}}function Nm(i,t,e){const n=this.cache,r=e.allocateTextureUnit();n[0]!==r&&(i.uniform1i(this.addr,r),n[0]=r);let s;this.type===i.SAMPLER_2D_SHADOW?(Tl.compareFunction=wh,s=Tl):s=eu,e.setTexture2D(t||s,r)}function Fm(i,t,e){const n=this.cache,r=e.allocateTextureUnit();n[0]!==r&&(i.uniform1i(this.addr,r),n[0]=r),e.setTexture3D(t||iu,r)}function Om(i,t,e){const n=this.cache,r=e.allocateTextureUnit();n[0]!==r&&(i.uniform1i(this.addr,r),n[0]=r),e.setTextureCube(t||ru,r)}function Bm(i,t,e){const n=this.cache,r=e.allocateTextureUnit();n[0]!==r&&(i.uniform1i(this.addr,r),n[0]=r),e.setTexture2DArray(t||nu,r)}function km(i){switch(i){case 5126:return Mm;case 35664:return Sm;case 35665:return ym;case 35666:return bm;case 35674:return Em;case 35675:return Tm;case 35676:return wm;case 5124:case 35670:return Am;case 35667:case 35671:return Rm;case 35668:case 35672:return Cm;case 35669:case 35673:return Lm;case 5125:return Pm;case 36294:return Dm;case 36295:return Im;case 36296:return Um;case 35678:case 36198:case 36298:case 36306:case 35682:return Nm;case 35679:case 36299:case 36307:return Fm;case 35680:case 36300:case 36308:case 36293:return Om;case 36289:case 36303:case 36311:case 36292:return Bm}}function zm(i,t){i.uniform1fv(this.addr,t)}function Hm(i,t){const e=yr(t,this.size,2);i.uniform2fv(this.addr,e)}function Vm(i,t){const e=yr(t,this.size,3);i.uniform3fv(this.addr,e)}function Gm(i,t){const e=yr(t,this.size,4);i.uniform4fv(this.addr,e)}function Wm(i,t){const e=yr(t,this.size,4);i.uniformMatrix2fv(this.addr,!1,e)}function Xm(i,t){const e=yr(t,this.size,9);i.uniformMatrix3fv(this.addr,!1,e)}function qm(i,t){const e=yr(t,this.size,16);i.uniformMatrix4fv(this.addr,!1,e)}function Ym(i,t){i.uniform1iv(this.addr,t)}function $m(i,t){i.uniform2iv(this.addr,t)}function Jm(i,t){i.uniform3iv(this.addr,t)}function Zm(i,t){i.uniform4iv(this.addr,t)}function Km(i,t){i.uniform1uiv(this.addr,t)}function jm(i,t){i.uniform2uiv(this.addr,t)}function Qm(i,t){i.uniform3uiv(this.addr,t)}function tg(i,t){i.uniform4uiv(this.addr,t)}function eg(i,t,e){const n=this.cache,r=t.length,s=na(e,r);we(n,s)||(i.uniform1iv(this.addr,s),Ae(n,s));for(let a=0;a!==r;++a)e.setTexture2D(t[a]||eu,s[a])}function ng(i,t,e){const n=this.cache,r=t.length,s=na(e,r);we(n,s)||(i.uniform1iv(this.addr,s),Ae(n,s));for(let a=0;a!==r;++a)e.setTexture3D(t[a]||iu,s[a])}function ig(i,t,e){const n=this.cache,r=t.length,s=na(e,r);we(n,s)||(i.uniform1iv(this.addr,s),Ae(n,s));for(let a=0;a!==r;++a)e.setTextureCube(t[a]||ru,s[a])}function rg(i,t,e){const n=this.cache,r=t.length,s=na(e,r);we(n,s)||(i.uniform1iv(this.addr,s),Ae(n,s));for(let a=0;a!==r;++a)e.setTexture2DArray(t[a]||nu,s[a])}function sg(i){switch(i){case 5126:return zm;case 35664:return Hm;case 35665:return Vm;case 35666:return Gm;case 35674:return Wm;case 35675:return Xm;case 35676:return qm;case 5124:case 35670:return Ym;case 35667:case 35671:return $m;case 35668:case 35672:return Jm;case 35669:case 35673:return Zm;case 5125:return Km;case 36294:return jm;case 36295:return Qm;case 36296:return tg;case 35678:case 36198:case 36298:case 36306:case 35682:return eg;case 35679:case 36299:case 36307:return ng;case 35680:case 36300:case 36308:case 36293:return ig;case 36289:case 36303:case 36311:case 36292:return rg}}class ag{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.setValue=km(e.type)}}class og{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.size=e.size,this.setValue=sg(e.type)}}class cg{constructor(t){this.id=t,this.seq=[],this.map={}}setValue(t,e,n){const r=this.seq;for(let s=0,a=r.length;s!==a;++s){const o=r[s];o.setValue(t,e[o.id],n)}}}const Va=/(\w+)(\])?(\[|\.)?/g;function Pl(i,t){i.seq.push(t),i.map[t.id]=t}function lg(i,t,e){const n=i.name,r=n.length;for(Va.lastIndex=0;;){const s=Va.exec(n),a=Va.lastIndex;let o=s[1];const c=s[2]==="]",l=s[3];if(c&&(o=o|0),l===void 0||l==="["&&a+2===r){Pl(e,l===void 0?new ag(o,i,t):new og(o,i,t));break}else{let u=e.map[o];u===void 0&&(u=new cg(o),Pl(e,u)),e=u}}}class Gs{constructor(t,e){this.seq=[],this.map={};const n=t.getProgramParameter(e,t.ACTIVE_UNIFORMS);for(let r=0;r<n;++r){const s=t.getActiveUniform(e,r),a=t.getUniformLocation(e,s.name);lg(s,a,this)}}setValue(t,e,n,r){const s=this.map[e];s!==void 0&&s.setValue(t,n,r)}setOptional(t,e,n){const r=e[n];r!==void 0&&this.setValue(t,n,r)}static upload(t,e,n,r){for(let s=0,a=e.length;s!==a;++s){const o=e[s],c=n[o.id];c.needsUpdate!==!1&&o.setValue(t,c.value,r)}}static seqWithValue(t,e){const n=[];for(let r=0,s=t.length;r!==s;++r){const a=t[r];a.id in e&&n.push(a)}return n}}function Dl(i,t,e){const n=i.createShader(t);return i.shaderSource(n,e),i.compileShader(n),n}const hg=37297;let ug=0;function fg(i,t){const e=i.split(`
`),n=[],r=Math.max(t-6,0),s=Math.min(t+6,e.length);for(let a=r;a<s;a++){const o=a+1;n.push(`${o===t?">":" "} ${o}: ${e[a]}`)}return n.join(`
`)}const Il=new Kt;function dg(i){se._getMatrix(Il,se.workingColorSpace,i);const t=`mat3( ${Il.elements.map(e=>e.toFixed(4))} )`;switch(se.getTransfer(i)){case qs:return[t,"LinearTransferOETF"];case ce:return[t,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space: ",i),[t,"LinearTransferOETF"]}}function Ul(i,t,e){const n=i.getShaderParameter(t,i.COMPILE_STATUS),s=(i.getShaderInfoLog(t)||"").trim();if(n&&s==="")return"";const a=/ERROR: 0:(\d+)/.exec(s);if(a){const o=parseInt(a[1]);return e.toUpperCase()+`

`+s+`

`+fg(i.getShaderSource(t),o)}else return s}function pg(i,t){const e=dg(t);return[`vec4 ${i}( vec4 value ) {`,`	return ${e[1]}( vec4( value.rgb * ${e[0]}, value.a ) );`,"}"].join(`
`)}function mg(i,t){let e;switch(t){case Sf:e="Linear";break;case yf:e="Reinhard";break;case bf:e="Cineon";break;case Ef:e="ACESFilmic";break;case wf:e="AgX";break;case mh:e="Neutral";break;case Tf:e="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",t),e="Linear"}return"vec3 "+i+"( vec3 color ) { return "+e+"ToneMapping( color ); }"}const Ds=new O;function gg(){se.getLuminanceCoefficients(Ds);const i=Ds.x.toFixed(4),t=Ds.y.toFixed(4),e=Ds.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${i}, ${t}, ${e} );`,"	return dot( weights, rgb );","}"].join(`
`)}function vg(i){return[i.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",i.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(Ur).join(`
`)}function _g(i){const t=[];for(const e in i){const n=i[e];n!==!1&&t.push("#define "+e+" "+n)}return t.join(`
`)}function xg(i,t){const e={},n=i.getProgramParameter(t,i.ACTIVE_ATTRIBUTES);for(let r=0;r<n;r++){const s=i.getActiveAttrib(t,r),a=s.name;let o=1;s.type===i.FLOAT_MAT2&&(o=2),s.type===i.FLOAT_MAT3&&(o=3),s.type===i.FLOAT_MAT4&&(o=4),e[a]={type:s.type,location:i.getAttribLocation(t,a),locationSize:o}}return e}function Ur(i){return i!==""}function Nl(i,t){const e=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return i.replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,e).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows)}function Fl(i,t){return i.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}const Mg=/^[ \t]*#include +<([\w\d./]+)>/gm;function Vo(i){return i.replace(Mg,yg)}const Sg=new Map;function yg(i,t){let e=jt[t];if(e===void 0){const n=Sg.get(t);if(n!==void 0)e=jt[n],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',t,n);else throw new Error("Can not resolve #include <"+t+">")}return Vo(e)}const bg=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function Ol(i){return i.replace(bg,Eg)}function Eg(i,t,e,n){let r="";for(let s=parseInt(t);s<parseInt(e);s++)r+=n.replace(/\[\s*i\s*\]/g,"[ "+s+" ]").replace(/UNROLLED_LOOP_INDEX/g,s);return r}function Bl(i){let t=`precision ${i.precision} float;
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
#define LOW_PRECISION`),t}function Tg(i){let t="SHADOWMAP_TYPE_BASIC";return i.shadowMapType===fh?t="SHADOWMAP_TYPE_PCF":i.shadowMapType===dh?t="SHADOWMAP_TYPE_PCF_SOFT":i.shadowMapType===Bn&&(t="SHADOWMAP_TYPE_VSM"),t}function wg(i){let t="ENVMAP_TYPE_CUBE";if(i.envMap)switch(i.envMapMode){case dr:case pr:t="ENVMAP_TYPE_CUBE";break;case Qs:t="ENVMAP_TYPE_CUBE_UV";break}return t}function Ag(i){let t="ENVMAP_MODE_REFLECTION";if(i.envMap)switch(i.envMapMode){case pr:t="ENVMAP_MODE_REFRACTION";break}return t}function Rg(i){let t="ENVMAP_BLENDING_NONE";if(i.envMap)switch(i.combine){case ph:t="ENVMAP_BLENDING_MULTIPLY";break;case xf:t="ENVMAP_BLENDING_MIX";break;case Mf:t="ENVMAP_BLENDING_ADD";break}return t}function Cg(i){const t=i.envMapCubeUVHeight;if(t===null)return null;const e=Math.log2(t)-2,n=1/t;return{texelWidth:1/(3*Math.max(Math.pow(2,e),112)),texelHeight:n,maxMip:e}}function Lg(i,t,e,n){const r=i.getContext(),s=e.defines;let a=e.vertexShader,o=e.fragmentShader;const c=Tg(e),l=wg(e),h=Ag(e),u=Rg(e),d=Cg(e),f=vg(e),m=_g(s),x=r.createProgram();let g,p,T=e.glslVersion?"#version "+e.glslVersion+`
`:"";e.isRawShaderMaterial?(g=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,m].filter(Ur).join(`
`),g.length>0&&(g+=`
`),p=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,m].filter(Ur).join(`
`),p.length>0&&(p+=`
`)):(g=[Bl(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,m,e.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",e.batching?"#define USE_BATCHING":"",e.batchingColor?"#define USE_BATCHING_COLOR":"",e.instancing?"#define USE_INSTANCING":"",e.instancingColor?"#define USE_INSTANCING_COLOR":"",e.instancingMorph?"#define USE_INSTANCING_MORPH":"",e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.map?"#define USE_MAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+h:"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.displacementMap?"#define USE_DISPLACEMENTMAP":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.mapUv?"#define MAP_UV "+e.mapUv:"",e.alphaMapUv?"#define ALPHAMAP_UV "+e.alphaMapUv:"",e.lightMapUv?"#define LIGHTMAP_UV "+e.lightMapUv:"",e.aoMapUv?"#define AOMAP_UV "+e.aoMapUv:"",e.emissiveMapUv?"#define EMISSIVEMAP_UV "+e.emissiveMapUv:"",e.bumpMapUv?"#define BUMPMAP_UV "+e.bumpMapUv:"",e.normalMapUv?"#define NORMALMAP_UV "+e.normalMapUv:"",e.displacementMapUv?"#define DISPLACEMENTMAP_UV "+e.displacementMapUv:"",e.metalnessMapUv?"#define METALNESSMAP_UV "+e.metalnessMapUv:"",e.roughnessMapUv?"#define ROUGHNESSMAP_UV "+e.roughnessMapUv:"",e.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+e.anisotropyMapUv:"",e.clearcoatMapUv?"#define CLEARCOATMAP_UV "+e.clearcoatMapUv:"",e.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+e.clearcoatNormalMapUv:"",e.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+e.clearcoatRoughnessMapUv:"",e.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+e.iridescenceMapUv:"",e.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+e.iridescenceThicknessMapUv:"",e.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+e.sheenColorMapUv:"",e.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+e.sheenRoughnessMapUv:"",e.specularMapUv?"#define SPECULARMAP_UV "+e.specularMapUv:"",e.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+e.specularColorMapUv:"",e.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+e.specularIntensityMapUv:"",e.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+e.transmissionMapUv:"",e.thicknessMapUv?"#define THICKNESSMAP_UV "+e.thicknessMapUv:"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.flatShading?"#define FLAT_SHADED":"",e.skinning?"#define USE_SKINNING":"",e.morphTargets?"#define USE_MORPHTARGETS":"",e.morphNormals&&e.flatShading===!1?"#define USE_MORPHNORMALS":"",e.morphColors?"#define USE_MORPHCOLORS":"",e.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+e.morphTextureStride:"",e.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+e.morphTargetsCount:"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+c:"",e.sizeAttenuation?"#define USE_SIZEATTENUATION":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",e.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(Ur).join(`
`),p=[Bl(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,m,e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",e.map?"#define USE_MAP":"",e.matcap?"#define USE_MATCAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+l:"",e.envMap?"#define "+h:"",e.envMap?"#define "+u:"",d?"#define CUBEUV_TEXEL_WIDTH "+d.texelWidth:"",d?"#define CUBEUV_TEXEL_HEIGHT "+d.texelHeight:"",d?"#define CUBEUV_MAX_MIP "+d.maxMip+".0":"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoat?"#define USE_CLEARCOAT":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.dispersion?"#define USE_DISPERSION":"",e.iridescence?"#define USE_IRIDESCENCE":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaTest?"#define USE_ALPHATEST":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.sheen?"#define USE_SHEEN":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors||e.instancingColor||e.batchingColor?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.gradientMap?"#define USE_GRADIENTMAP":"",e.flatShading?"#define FLAT_SHADED":"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+c:"",e.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",e.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",e.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",e.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",e.toneMapping!==si?"#define TONE_MAPPING":"",e.toneMapping!==si?jt.tonemapping_pars_fragment:"",e.toneMapping!==si?mg("toneMapping",e.toneMapping):"",e.dithering?"#define DITHERING":"",e.opaque?"#define OPAQUE":"",jt.colorspace_pars_fragment,pg("linearToOutputTexel",e.outputColorSpace),gg(),e.useDepthPacking?"#define DEPTH_PACKING "+e.depthPacking:"",`
`].filter(Ur).join(`
`)),a=Vo(a),a=Nl(a,e),a=Fl(a,e),o=Vo(o),o=Nl(o,e),o=Fl(o,e),a=Ol(a),o=Ol(o),e.isRawShaderMaterial!==!0&&(T=`#version 300 es
`,g=[f,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+g,p=["#define varying in",e.glslVersion===kc?"":"layout(location = 0) out highp vec4 pc_fragColor;",e.glslVersion===kc?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+p);const y=T+g+a,M=T+p+o,w=Dl(r,r.VERTEX_SHADER,y),E=Dl(r,r.FRAGMENT_SHADER,M);r.attachShader(x,w),r.attachShader(x,E),e.index0AttributeName!==void 0?r.bindAttribLocation(x,0,e.index0AttributeName):e.morphTargets===!0&&r.bindAttribLocation(x,0,"position"),r.linkProgram(x);function A(S){if(i.debug.checkShaderErrors){const b=r.getProgramInfoLog(x)||"",D=r.getShaderInfoLog(w)||"",U=r.getShaderInfoLog(E)||"",N=b.trim(),B=D.trim(),Z=U.trim();let H=!0,st=!0;if(r.getProgramParameter(x,r.LINK_STATUS)===!1)if(H=!1,typeof i.debug.onShaderError=="function")i.debug.onShaderError(r,x,w,E);else{const ht=Ul(r,w,"vertex"),pt=Ul(r,E,"fragment");console.error("THREE.WebGLProgram: Shader Error "+r.getError()+" - VALIDATE_STATUS "+r.getProgramParameter(x,r.VALIDATE_STATUS)+`

Material Name: `+S.name+`
Material Type: `+S.type+`

Program Info Log: `+N+`
`+ht+`
`+pt)}else N!==""?console.warn("THREE.WebGLProgram: Program Info Log:",N):(B===""||Z==="")&&(st=!1);st&&(S.diagnostics={runnable:H,programLog:N,vertexShader:{log:B,prefix:g},fragmentShader:{log:Z,prefix:p}})}r.deleteShader(w),r.deleteShader(E),C=new Gs(r,x),v=xg(r,x)}let C;this.getUniforms=function(){return C===void 0&&A(this),C};let v;this.getAttributes=function(){return v===void 0&&A(this),v};let _=e.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return _===!1&&(_=r.getProgramParameter(x,hg)),_},this.destroy=function(){n.releaseStatesOfProgram(this),r.deleteProgram(x),this.program=void 0},this.type=e.shaderType,this.name=e.shaderName,this.id=ug++,this.cacheKey=t,this.usedTimes=1,this.program=x,this.vertexShader=w,this.fragmentShader=E,this}let Pg=0;class Dg{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(t){const e=t.vertexShader,n=t.fragmentShader,r=this._getShaderStage(e),s=this._getShaderStage(n),a=this._getShaderCacheForMaterial(t);return a.has(r)===!1&&(a.add(r),r.usedTimes++),a.has(s)===!1&&(a.add(s),s.usedTimes++),this}remove(t){const e=this.materialCache.get(t);for(const n of e)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(t),this}getVertexShaderID(t){return this._getShaderStage(t.vertexShader).id}getFragmentShaderID(t){return this._getShaderStage(t.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(t){const e=this.materialCache;let n=e.get(t);return n===void 0&&(n=new Set,e.set(t,n)),n}_getShaderStage(t){const e=this.shaderCache;let n=e.get(t);return n===void 0&&(n=new Ig(t),e.set(t,n)),n}}class Ig{constructor(t){this.id=Pg++,this.code=t,this.usedTimes=0}}function Ug(i,t,e,n,r,s,a){const o=new Lh,c=new Dg,l=new Set,h=[],u=r.logarithmicDepthBuffer,d=r.vertexTextures;let f=r.precision;const m={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function x(v){return l.add(v),v===0?"uv":`uv${v}`}function g(v,_,S,b,D){const U=b.fog,N=D.geometry,B=v.isMeshStandardMaterial?b.environment:null,Z=(v.isMeshStandardMaterial?e:t).get(v.envMap||B),H=Z&&Z.mapping===Qs?Z.image.height:null,st=m[v.type];v.precision!==null&&(f=r.getMaxPrecision(v.precision),f!==v.precision&&console.warn("THREE.WebGLProgram.getParameters:",v.precision,"not supported, using",f,"instead."));const ht=N.morphAttributes.position||N.morphAttributes.normal||N.morphAttributes.color,pt=ht!==void 0?ht.length:0;let _t=0;N.morphAttributes.position!==void 0&&(_t=1),N.morphAttributes.normal!==void 0&&(_t=2),N.morphAttributes.color!==void 0&&(_t=3);let Et,zt,Vt,et;if(st){const ae=En[st];Et=ae.vertexShader,zt=ae.fragmentShader}else Et=v.vertexShader,zt=v.fragmentShader,c.update(v),Vt=c.getVertexShaderID(v),et=c.getFragmentShaderID(v);const ct=i.getRenderTarget(),G=i.state.buffers.depth.getReversed(),q=D.isInstancedMesh===!0,k=D.isBatchedMesh===!0,j=!!v.map,tt=!!v.matcap,P=!!Z,K=!!v.aoMap,F=!!v.lightMap,z=!!v.bumpMap,W=!!v.normalMap,Q=!!v.displacementMap,ot=!!v.emissiveMap,ut=!!v.metalnessMap,Pt=!!v.roughnessMap,kt=v.anisotropy>0,I=v.clearcoat>0,R=v.dispersion>0,Y=v.iridescence>0,nt=v.sheen>0,dt=v.transmission>0,at=kt&&!!v.anisotropyMap,Ft=I&&!!v.clearcoatMap,Mt=I&&!!v.clearcoatNormalMap,It=I&&!!v.clearcoatRoughnessMap,Ut=Y&&!!v.iridescenceMap,mt=Y&&!!v.iridescenceThicknessMap,At=nt&&!!v.sheenColorMap,Xt=nt&&!!v.sheenRoughnessMap,Ot=!!v.specularMap,Tt=!!v.specularColorMap,Zt=!!v.specularIntensityMap,V=dt&&!!v.transmissionMap,xt=dt&&!!v.thicknessMap,yt=!!v.gradientMap,Lt=!!v.alphaMap,gt=v.alphaTest>0,ft=!!v.alphaHash,Nt=!!v.extensions;let $t=si;v.toneMapped&&(ct===null||ct.isXRRenderTarget===!0)&&($t=i.toneMapping);const ue={shaderID:st,shaderType:v.type,shaderName:v.name,vertexShader:Et,fragmentShader:zt,defines:v.defines,customVertexShaderID:Vt,customFragmentShaderID:et,isRawShaderMaterial:v.isRawShaderMaterial===!0,glslVersion:v.glslVersion,precision:f,batching:k,batchingColor:k&&D._colorsTexture!==null,instancing:q,instancingColor:q&&D.instanceColor!==null,instancingMorph:q&&D.morphTexture!==null,supportsVertexTextures:d,outputColorSpace:ct===null?i.outputColorSpace:ct.isXRRenderTarget===!0?ct.texture.colorSpace:Ii,alphaToCoverage:!!v.alphaToCoverage,map:j,matcap:tt,envMap:P,envMapMode:P&&Z.mapping,envMapCubeUVHeight:H,aoMap:K,lightMap:F,bumpMap:z,normalMap:W,displacementMap:d&&Q,emissiveMap:ot,normalMapObjectSpace:W&&v.normalMapType===Pf,normalMapTangentSpace:W&&v.normalMapType===Th,metalnessMap:ut,roughnessMap:Pt,anisotropy:kt,anisotropyMap:at,clearcoat:I,clearcoatMap:Ft,clearcoatNormalMap:Mt,clearcoatRoughnessMap:It,dispersion:R,iridescence:Y,iridescenceMap:Ut,iridescenceThicknessMap:mt,sheen:nt,sheenColorMap:At,sheenRoughnessMap:Xt,specularMap:Ot,specularColorMap:Tt,specularIntensityMap:Zt,transmission:dt,transmissionMap:V,thicknessMap:xt,gradientMap:yt,opaque:v.transparent===!1&&v.blending===cr&&v.alphaToCoverage===!1,alphaMap:Lt,alphaTest:gt,alphaHash:ft,combine:v.combine,mapUv:j&&x(v.map.channel),aoMapUv:K&&x(v.aoMap.channel),lightMapUv:F&&x(v.lightMap.channel),bumpMapUv:z&&x(v.bumpMap.channel),normalMapUv:W&&x(v.normalMap.channel),displacementMapUv:Q&&x(v.displacementMap.channel),emissiveMapUv:ot&&x(v.emissiveMap.channel),metalnessMapUv:ut&&x(v.metalnessMap.channel),roughnessMapUv:Pt&&x(v.roughnessMap.channel),anisotropyMapUv:at&&x(v.anisotropyMap.channel),clearcoatMapUv:Ft&&x(v.clearcoatMap.channel),clearcoatNormalMapUv:Mt&&x(v.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:It&&x(v.clearcoatRoughnessMap.channel),iridescenceMapUv:Ut&&x(v.iridescenceMap.channel),iridescenceThicknessMapUv:mt&&x(v.iridescenceThicknessMap.channel),sheenColorMapUv:At&&x(v.sheenColorMap.channel),sheenRoughnessMapUv:Xt&&x(v.sheenRoughnessMap.channel),specularMapUv:Ot&&x(v.specularMap.channel),specularColorMapUv:Tt&&x(v.specularColorMap.channel),specularIntensityMapUv:Zt&&x(v.specularIntensityMap.channel),transmissionMapUv:V&&x(v.transmissionMap.channel),thicknessMapUv:xt&&x(v.thicknessMap.channel),alphaMapUv:Lt&&x(v.alphaMap.channel),vertexTangents:!!N.attributes.tangent&&(W||kt),vertexColors:v.vertexColors,vertexAlphas:v.vertexColors===!0&&!!N.attributes.color&&N.attributes.color.itemSize===4,pointsUvs:D.isPoints===!0&&!!N.attributes.uv&&(j||Lt),fog:!!U,useFog:v.fog===!0,fogExp2:!!U&&U.isFogExp2,flatShading:v.flatShading===!0&&v.wireframe===!1,sizeAttenuation:v.sizeAttenuation===!0,logarithmicDepthBuffer:u,reversedDepthBuffer:G,skinning:D.isSkinnedMesh===!0,morphTargets:N.morphAttributes.position!==void 0,morphNormals:N.morphAttributes.normal!==void 0,morphColors:N.morphAttributes.color!==void 0,morphTargetsCount:pt,morphTextureStride:_t,numDirLights:_.directional.length,numPointLights:_.point.length,numSpotLights:_.spot.length,numSpotLightMaps:_.spotLightMap.length,numRectAreaLights:_.rectArea.length,numHemiLights:_.hemi.length,numDirLightShadows:_.directionalShadowMap.length,numPointLightShadows:_.pointShadowMap.length,numSpotLightShadows:_.spotShadowMap.length,numSpotLightShadowsWithMaps:_.numSpotLightShadowsWithMaps,numLightProbes:_.numLightProbes,numClippingPlanes:a.numPlanes,numClipIntersection:a.numIntersection,dithering:v.dithering,shadowMapEnabled:i.shadowMap.enabled&&S.length>0,shadowMapType:i.shadowMap.type,toneMapping:$t,decodeVideoTexture:j&&v.map.isVideoTexture===!0&&se.getTransfer(v.map.colorSpace)===ce,decodeVideoTextureEmissive:ot&&v.emissiveMap.isVideoTexture===!0&&se.getTransfer(v.emissiveMap.colorSpace)===ce,premultipliedAlpha:v.premultipliedAlpha,doubleSided:v.side===Tn,flipSided:v.side===$e,useDepthPacking:v.depthPacking>=0,depthPacking:v.depthPacking||0,index0AttributeName:v.index0AttributeName,extensionClipCullDistance:Nt&&v.extensions.clipCullDistance===!0&&n.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(Nt&&v.extensions.multiDraw===!0||k)&&n.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:n.has("KHR_parallel_shader_compile"),customProgramCacheKey:v.customProgramCacheKey()};return ue.vertexUv1s=l.has(1),ue.vertexUv2s=l.has(2),ue.vertexUv3s=l.has(3),l.clear(),ue}function p(v){const _=[];if(v.shaderID?_.push(v.shaderID):(_.push(v.customVertexShaderID),_.push(v.customFragmentShaderID)),v.defines!==void 0)for(const S in v.defines)_.push(S),_.push(v.defines[S]);return v.isRawShaderMaterial===!1&&(T(_,v),y(_,v),_.push(i.outputColorSpace)),_.push(v.customProgramCacheKey),_.join()}function T(v,_){v.push(_.precision),v.push(_.outputColorSpace),v.push(_.envMapMode),v.push(_.envMapCubeUVHeight),v.push(_.mapUv),v.push(_.alphaMapUv),v.push(_.lightMapUv),v.push(_.aoMapUv),v.push(_.bumpMapUv),v.push(_.normalMapUv),v.push(_.displacementMapUv),v.push(_.emissiveMapUv),v.push(_.metalnessMapUv),v.push(_.roughnessMapUv),v.push(_.anisotropyMapUv),v.push(_.clearcoatMapUv),v.push(_.clearcoatNormalMapUv),v.push(_.clearcoatRoughnessMapUv),v.push(_.iridescenceMapUv),v.push(_.iridescenceThicknessMapUv),v.push(_.sheenColorMapUv),v.push(_.sheenRoughnessMapUv),v.push(_.specularMapUv),v.push(_.specularColorMapUv),v.push(_.specularIntensityMapUv),v.push(_.transmissionMapUv),v.push(_.thicknessMapUv),v.push(_.combine),v.push(_.fogExp2),v.push(_.sizeAttenuation),v.push(_.morphTargetsCount),v.push(_.morphAttributeCount),v.push(_.numDirLights),v.push(_.numPointLights),v.push(_.numSpotLights),v.push(_.numSpotLightMaps),v.push(_.numHemiLights),v.push(_.numRectAreaLights),v.push(_.numDirLightShadows),v.push(_.numPointLightShadows),v.push(_.numSpotLightShadows),v.push(_.numSpotLightShadowsWithMaps),v.push(_.numLightProbes),v.push(_.shadowMapType),v.push(_.toneMapping),v.push(_.numClippingPlanes),v.push(_.numClipIntersection),v.push(_.depthPacking)}function y(v,_){o.disableAll(),_.supportsVertexTextures&&o.enable(0),_.instancing&&o.enable(1),_.instancingColor&&o.enable(2),_.instancingMorph&&o.enable(3),_.matcap&&o.enable(4),_.envMap&&o.enable(5),_.normalMapObjectSpace&&o.enable(6),_.normalMapTangentSpace&&o.enable(7),_.clearcoat&&o.enable(8),_.iridescence&&o.enable(9),_.alphaTest&&o.enable(10),_.vertexColors&&o.enable(11),_.vertexAlphas&&o.enable(12),_.vertexUv1s&&o.enable(13),_.vertexUv2s&&o.enable(14),_.vertexUv3s&&o.enable(15),_.vertexTangents&&o.enable(16),_.anisotropy&&o.enable(17),_.alphaHash&&o.enable(18),_.batching&&o.enable(19),_.dispersion&&o.enable(20),_.batchingColor&&o.enable(21),_.gradientMap&&o.enable(22),v.push(o.mask),o.disableAll(),_.fog&&o.enable(0),_.useFog&&o.enable(1),_.flatShading&&o.enable(2),_.logarithmicDepthBuffer&&o.enable(3),_.reversedDepthBuffer&&o.enable(4),_.skinning&&o.enable(5),_.morphTargets&&o.enable(6),_.morphNormals&&o.enable(7),_.morphColors&&o.enable(8),_.premultipliedAlpha&&o.enable(9),_.shadowMapEnabled&&o.enable(10),_.doubleSided&&o.enable(11),_.flipSided&&o.enable(12),_.useDepthPacking&&o.enable(13),_.dithering&&o.enable(14),_.transmission&&o.enable(15),_.sheen&&o.enable(16),_.opaque&&o.enable(17),_.pointsUvs&&o.enable(18),_.decodeVideoTexture&&o.enable(19),_.decodeVideoTextureEmissive&&o.enable(20),_.alphaToCoverage&&o.enable(21),v.push(o.mask)}function M(v){const _=m[v.type];let S;if(_){const b=En[_];S=Td.clone(b.uniforms)}else S=v.uniforms;return S}function w(v,_){let S;for(let b=0,D=h.length;b<D;b++){const U=h[b];if(U.cacheKey===_){S=U,++S.usedTimes;break}}return S===void 0&&(S=new Lg(i,_,v,s),h.push(S)),S}function E(v){if(--v.usedTimes===0){const _=h.indexOf(v);h[_]=h[h.length-1],h.pop(),v.destroy()}}function A(v){c.remove(v)}function C(){c.dispose()}return{getParameters:g,getProgramCacheKey:p,getUniforms:M,acquireProgram:w,releaseProgram:E,releaseShaderCache:A,programs:h,dispose:C}}function Ng(){let i=new WeakMap;function t(a){return i.has(a)}function e(a){let o=i.get(a);return o===void 0&&(o={},i.set(a,o)),o}function n(a){i.delete(a)}function r(a,o,c){i.get(a)[o]=c}function s(){i=new WeakMap}return{has:t,get:e,remove:n,update:r,dispose:s}}function Fg(i,t){return i.groupOrder!==t.groupOrder?i.groupOrder-t.groupOrder:i.renderOrder!==t.renderOrder?i.renderOrder-t.renderOrder:i.material.id!==t.material.id?i.material.id-t.material.id:i.z!==t.z?i.z-t.z:i.id-t.id}function kl(i,t){return i.groupOrder!==t.groupOrder?i.groupOrder-t.groupOrder:i.renderOrder!==t.renderOrder?i.renderOrder-t.renderOrder:i.z!==t.z?t.z-i.z:i.id-t.id}function zl(){const i=[];let t=0;const e=[],n=[],r=[];function s(){t=0,e.length=0,n.length=0,r.length=0}function a(u,d,f,m,x,g){let p=i[t];return p===void 0?(p={id:u.id,object:u,geometry:d,material:f,groupOrder:m,renderOrder:u.renderOrder,z:x,group:g},i[t]=p):(p.id=u.id,p.object=u,p.geometry=d,p.material=f,p.groupOrder=m,p.renderOrder=u.renderOrder,p.z=x,p.group=g),t++,p}function o(u,d,f,m,x,g){const p=a(u,d,f,m,x,g);f.transmission>0?n.push(p):f.transparent===!0?r.push(p):e.push(p)}function c(u,d,f,m,x,g){const p=a(u,d,f,m,x,g);f.transmission>0?n.unshift(p):f.transparent===!0?r.unshift(p):e.unshift(p)}function l(u,d){e.length>1&&e.sort(u||Fg),n.length>1&&n.sort(d||kl),r.length>1&&r.sort(d||kl)}function h(){for(let u=t,d=i.length;u<d;u++){const f=i[u];if(f.id===null)break;f.id=null,f.object=null,f.geometry=null,f.material=null,f.group=null}}return{opaque:e,transmissive:n,transparent:r,init:s,push:o,unshift:c,finish:h,sort:l}}function Og(){let i=new WeakMap;function t(n,r){const s=i.get(n);let a;return s===void 0?(a=new zl,i.set(n,[a])):r>=s.length?(a=new zl,s.push(a)):a=s[r],a}function e(){i=new WeakMap}return{get:t,dispose:e}}function Bg(){const i={};return{get:function(t){if(i[t.id]!==void 0)return i[t.id];let e;switch(t.type){case"DirectionalLight":e={direction:new O,color:new Yt};break;case"SpotLight":e={position:new O,direction:new O,color:new Yt,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":e={position:new O,color:new Yt,distance:0,decay:0};break;case"HemisphereLight":e={direction:new O,skyColor:new Yt,groundColor:new Yt};break;case"RectAreaLight":e={color:new Yt,position:new O,halfWidth:new O,halfHeight:new O};break}return i[t.id]=e,e}}}function kg(){const i={};return{get:function(t){if(i[t.id]!==void 0)return i[t.id];let e;switch(t.type){case"DirectionalLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new St};break;case"SpotLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new St};break;case"PointLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new St,shadowCameraNear:1,shadowCameraFar:1e3};break}return i[t.id]=e,e}}}let zg=0;function Hg(i,t){return(t.castShadow?2:0)-(i.castShadow?2:0)+(t.map?1:0)-(i.map?1:0)}function Vg(i){const t=new Bg,e=kg(),n={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let l=0;l<9;l++)n.probe.push(new O);const r=new O,s=new ie,a=new ie;function o(l){let h=0,u=0,d=0;for(let v=0;v<9;v++)n.probe[v].set(0,0,0);let f=0,m=0,x=0,g=0,p=0,T=0,y=0,M=0,w=0,E=0,A=0;l.sort(Hg);for(let v=0,_=l.length;v<_;v++){const S=l[v],b=S.color,D=S.intensity,U=S.distance,N=S.shadow&&S.shadow.map?S.shadow.map.texture:null;if(S.isAmbientLight)h+=b.r*D,u+=b.g*D,d+=b.b*D;else if(S.isLightProbe){for(let B=0;B<9;B++)n.probe[B].addScaledVector(S.sh.coefficients[B],D);A++}else if(S.isDirectionalLight){const B=t.get(S);if(B.color.copy(S.color).multiplyScalar(S.intensity),S.castShadow){const Z=S.shadow,H=e.get(S);H.shadowIntensity=Z.intensity,H.shadowBias=Z.bias,H.shadowNormalBias=Z.normalBias,H.shadowRadius=Z.radius,H.shadowMapSize=Z.mapSize,n.directionalShadow[f]=H,n.directionalShadowMap[f]=N,n.directionalShadowMatrix[f]=S.shadow.matrix,T++}n.directional[f]=B,f++}else if(S.isSpotLight){const B=t.get(S);B.position.setFromMatrixPosition(S.matrixWorld),B.color.copy(b).multiplyScalar(D),B.distance=U,B.coneCos=Math.cos(S.angle),B.penumbraCos=Math.cos(S.angle*(1-S.penumbra)),B.decay=S.decay,n.spot[x]=B;const Z=S.shadow;if(S.map&&(n.spotLightMap[w]=S.map,w++,Z.updateMatrices(S),S.castShadow&&E++),n.spotLightMatrix[x]=Z.matrix,S.castShadow){const H=e.get(S);H.shadowIntensity=Z.intensity,H.shadowBias=Z.bias,H.shadowNormalBias=Z.normalBias,H.shadowRadius=Z.radius,H.shadowMapSize=Z.mapSize,n.spotShadow[x]=H,n.spotShadowMap[x]=N,M++}x++}else if(S.isRectAreaLight){const B=t.get(S);B.color.copy(b).multiplyScalar(D),B.halfWidth.set(S.width*.5,0,0),B.halfHeight.set(0,S.height*.5,0),n.rectArea[g]=B,g++}else if(S.isPointLight){const B=t.get(S);if(B.color.copy(S.color).multiplyScalar(S.intensity),B.distance=S.distance,B.decay=S.decay,S.castShadow){const Z=S.shadow,H=e.get(S);H.shadowIntensity=Z.intensity,H.shadowBias=Z.bias,H.shadowNormalBias=Z.normalBias,H.shadowRadius=Z.radius,H.shadowMapSize=Z.mapSize,H.shadowCameraNear=Z.camera.near,H.shadowCameraFar=Z.camera.far,n.pointShadow[m]=H,n.pointShadowMap[m]=N,n.pointShadowMatrix[m]=S.shadow.matrix,y++}n.point[m]=B,m++}else if(S.isHemisphereLight){const B=t.get(S);B.skyColor.copy(S.color).multiplyScalar(D),B.groundColor.copy(S.groundColor).multiplyScalar(D),n.hemi[p]=B,p++}}g>0&&(i.has("OES_texture_float_linear")===!0?(n.rectAreaLTC1=bt.LTC_FLOAT_1,n.rectAreaLTC2=bt.LTC_FLOAT_2):(n.rectAreaLTC1=bt.LTC_HALF_1,n.rectAreaLTC2=bt.LTC_HALF_2)),n.ambient[0]=h,n.ambient[1]=u,n.ambient[2]=d;const C=n.hash;(C.directionalLength!==f||C.pointLength!==m||C.spotLength!==x||C.rectAreaLength!==g||C.hemiLength!==p||C.numDirectionalShadows!==T||C.numPointShadows!==y||C.numSpotShadows!==M||C.numSpotMaps!==w||C.numLightProbes!==A)&&(n.directional.length=f,n.spot.length=x,n.rectArea.length=g,n.point.length=m,n.hemi.length=p,n.directionalShadow.length=T,n.directionalShadowMap.length=T,n.pointShadow.length=y,n.pointShadowMap.length=y,n.spotShadow.length=M,n.spotShadowMap.length=M,n.directionalShadowMatrix.length=T,n.pointShadowMatrix.length=y,n.spotLightMatrix.length=M+w-E,n.spotLightMap.length=w,n.numSpotLightShadowsWithMaps=E,n.numLightProbes=A,C.directionalLength=f,C.pointLength=m,C.spotLength=x,C.rectAreaLength=g,C.hemiLength=p,C.numDirectionalShadows=T,C.numPointShadows=y,C.numSpotShadows=M,C.numSpotMaps=w,C.numLightProbes=A,n.version=zg++)}function c(l,h){let u=0,d=0,f=0,m=0,x=0;const g=h.matrixWorldInverse;for(let p=0,T=l.length;p<T;p++){const y=l[p];if(y.isDirectionalLight){const M=n.directional[u];M.direction.setFromMatrixPosition(y.matrixWorld),r.setFromMatrixPosition(y.target.matrixWorld),M.direction.sub(r),M.direction.transformDirection(g),u++}else if(y.isSpotLight){const M=n.spot[f];M.position.setFromMatrixPosition(y.matrixWorld),M.position.applyMatrix4(g),M.direction.setFromMatrixPosition(y.matrixWorld),r.setFromMatrixPosition(y.target.matrixWorld),M.direction.sub(r),M.direction.transformDirection(g),f++}else if(y.isRectAreaLight){const M=n.rectArea[m];M.position.setFromMatrixPosition(y.matrixWorld),M.position.applyMatrix4(g),a.identity(),s.copy(y.matrixWorld),s.premultiply(g),a.extractRotation(s),M.halfWidth.set(y.width*.5,0,0),M.halfHeight.set(0,y.height*.5,0),M.halfWidth.applyMatrix4(a),M.halfHeight.applyMatrix4(a),m++}else if(y.isPointLight){const M=n.point[d];M.position.setFromMatrixPosition(y.matrixWorld),M.position.applyMatrix4(g),d++}else if(y.isHemisphereLight){const M=n.hemi[x];M.direction.setFromMatrixPosition(y.matrixWorld),M.direction.transformDirection(g),x++}}}return{setup:o,setupView:c,state:n}}function Hl(i){const t=new Vg(i),e=[],n=[];function r(h){l.camera=h,e.length=0,n.length=0}function s(h){e.push(h)}function a(h){n.push(h)}function o(){t.setup(e)}function c(h){t.setupView(e,h)}const l={lightsArray:e,shadowsArray:n,camera:null,lights:t,transmissionRenderTarget:{}};return{init:r,state:l,setupLights:o,setupLightsView:c,pushLight:s,pushShadow:a}}function Gg(i){let t=new WeakMap;function e(r,s=0){const a=t.get(r);let o;return a===void 0?(o=new Hl(i),t.set(r,[o])):s>=a.length?(o=new Hl(i),a.push(o)):o=a[s],o}function n(){t=new WeakMap}return{get:e,dispose:n}}const Wg=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,Xg=`uniform sampler2D shadow_pass;
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
}`;function qg(i,t,e){let n=new rc;const r=new St,s=new St,a=new de,o=new mp({depthPacking:Lf}),c=new gp,l={},h=e.maxTextureSize,u={[ci]:$e,[$e]:ci,[Tn]:Tn},d=new qn({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new St},radius:{value:4}},vertexShader:Wg,fragmentShader:Xg}),f=d.clone();f.defines.HORIZONTAL_PASS=1;const m=new Le;m.setAttribute("position",new me(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const x=new ee(m,d),g=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=fh;let p=this.type;this.render=function(E,A,C){if(g.enabled===!1||g.autoUpdate===!1&&g.needsUpdate===!1||E.length===0)return;const v=i.getRenderTarget(),_=i.getActiveCubeFace(),S=i.getActiveMipmapLevel(),b=i.state;b.setBlending(ri),b.buffers.depth.getReversed()===!0?b.buffers.color.setClear(0,0,0,0):b.buffers.color.setClear(1,1,1,1),b.buffers.depth.setTest(!0),b.setScissorTest(!1);const D=p!==Bn&&this.type===Bn,U=p===Bn&&this.type!==Bn;for(let N=0,B=E.length;N<B;N++){const Z=E[N],H=Z.shadow;if(H===void 0){console.warn("THREE.WebGLShadowMap:",Z,"has no shadow.");continue}if(H.autoUpdate===!1&&H.needsUpdate===!1)continue;r.copy(H.mapSize);const st=H.getFrameExtents();if(r.multiply(st),s.copy(H.mapSize),(r.x>h||r.y>h)&&(r.x>h&&(s.x=Math.floor(h/st.x),r.x=s.x*st.x,H.mapSize.x=s.x),r.y>h&&(s.y=Math.floor(h/st.y),r.y=s.y*st.y,H.mapSize.y=s.y)),H.map===null||D===!0||U===!0){const pt=this.type!==Bn?{minFilter:en,magFilter:en}:{};H.map!==null&&H.map.dispose(),H.map=new Ui(r.x,r.y,pt),H.map.texture.name=Z.name+".shadowMap",H.camera.updateProjectionMatrix()}i.setRenderTarget(H.map),i.clear();const ht=H.getViewportCount();for(let pt=0;pt<ht;pt++){const _t=H.getViewport(pt);a.set(s.x*_t.x,s.y*_t.y,s.x*_t.z,s.y*_t.w),b.viewport(a),H.updateMatrices(Z,pt),n=H.getFrustum(),M(A,C,H.camera,Z,this.type)}H.isPointLightShadow!==!0&&this.type===Bn&&T(H,C),H.needsUpdate=!1}p=this.type,g.needsUpdate=!1,i.setRenderTarget(v,_,S)};function T(E,A){const C=t.update(x);d.defines.VSM_SAMPLES!==E.blurSamples&&(d.defines.VSM_SAMPLES=E.blurSamples,f.defines.VSM_SAMPLES=E.blurSamples,d.needsUpdate=!0,f.needsUpdate=!0),E.mapPass===null&&(E.mapPass=new Ui(r.x,r.y)),d.uniforms.shadow_pass.value=E.map.texture,d.uniforms.resolution.value=E.mapSize,d.uniforms.radius.value=E.radius,i.setRenderTarget(E.mapPass),i.clear(),i.renderBufferDirect(A,null,C,d,x,null),f.uniforms.shadow_pass.value=E.mapPass.texture,f.uniforms.resolution.value=E.mapSize,f.uniforms.radius.value=E.radius,i.setRenderTarget(E.map),i.clear(),i.renderBufferDirect(A,null,C,f,x,null)}function y(E,A,C,v){let _=null;const S=C.isPointLight===!0?E.customDistanceMaterial:E.customDepthMaterial;if(S!==void 0)_=S;else if(_=C.isPointLight===!0?c:o,i.localClippingEnabled&&A.clipShadows===!0&&Array.isArray(A.clippingPlanes)&&A.clippingPlanes.length!==0||A.displacementMap&&A.displacementScale!==0||A.alphaMap&&A.alphaTest>0||A.map&&A.alphaTest>0||A.alphaToCoverage===!0){const b=_.uuid,D=A.uuid;let U=l[b];U===void 0&&(U={},l[b]=U);let N=U[D];N===void 0&&(N=_.clone(),U[D]=N,A.addEventListener("dispose",w)),_=N}if(_.visible=A.visible,_.wireframe=A.wireframe,v===Bn?_.side=A.shadowSide!==null?A.shadowSide:A.side:_.side=A.shadowSide!==null?A.shadowSide:u[A.side],_.alphaMap=A.alphaMap,_.alphaTest=A.alphaToCoverage===!0?.5:A.alphaTest,_.map=A.map,_.clipShadows=A.clipShadows,_.clippingPlanes=A.clippingPlanes,_.clipIntersection=A.clipIntersection,_.displacementMap=A.displacementMap,_.displacementScale=A.displacementScale,_.displacementBias=A.displacementBias,_.wireframeLinewidth=A.wireframeLinewidth,_.linewidth=A.linewidth,C.isPointLight===!0&&_.isMeshDistanceMaterial===!0){const b=i.properties.get(_);b.light=C}return _}function M(E,A,C,v,_){if(E.visible===!1)return;if(E.layers.test(A.layers)&&(E.isMesh||E.isLine||E.isPoints)&&(E.castShadow||E.receiveShadow&&_===Bn)&&(!E.frustumCulled||n.intersectsObject(E))){E.modelViewMatrix.multiplyMatrices(C.matrixWorldInverse,E.matrixWorld);const D=t.update(E),U=E.material;if(Array.isArray(U)){const N=D.groups;for(let B=0,Z=N.length;B<Z;B++){const H=N[B],st=U[H.materialIndex];if(st&&st.visible){const ht=y(E,st,v,_);E.onBeforeShadow(i,E,A,C,D,ht,H),i.renderBufferDirect(C,null,D,ht,E,H),E.onAfterShadow(i,E,A,C,D,ht,H)}}}else if(U.visible){const N=y(E,U,v,_);E.onBeforeShadow(i,E,A,C,D,N,null),i.renderBufferDirect(C,null,D,N,E,null),E.onAfterShadow(i,E,A,C,D,N,null)}}const b=E.children;for(let D=0,U=b.length;D<U;D++)M(b[D],A,C,v,_)}function w(E){E.target.removeEventListener("dispose",w);for(const C in l){const v=l[C],_=E.target.uuid;_ in v&&(v[_].dispose(),delete v[_])}}}const Yg={[eo]:no,[io]:ao,[ro]:oo,[fr]:so,[no]:eo,[ao]:io,[oo]:ro,[so]:fr};function $g(i,t){function e(){let V=!1;const xt=new de;let yt=null;const Lt=new de(0,0,0,0);return{setMask:function(gt){yt!==gt&&!V&&(i.colorMask(gt,gt,gt,gt),yt=gt)},setLocked:function(gt){V=gt},setClear:function(gt,ft,Nt,$t,ue){ue===!0&&(gt*=$t,ft*=$t,Nt*=$t),xt.set(gt,ft,Nt,$t),Lt.equals(xt)===!1&&(i.clearColor(gt,ft,Nt,$t),Lt.copy(xt))},reset:function(){V=!1,yt=null,Lt.set(-1,0,0,0)}}}function n(){let V=!1,xt=!1,yt=null,Lt=null,gt=null;return{setReversed:function(ft){if(xt!==ft){const Nt=t.get("EXT_clip_control");ft?Nt.clipControlEXT(Nt.LOWER_LEFT_EXT,Nt.ZERO_TO_ONE_EXT):Nt.clipControlEXT(Nt.LOWER_LEFT_EXT,Nt.NEGATIVE_ONE_TO_ONE_EXT),xt=ft;const $t=gt;gt=null,this.setClear($t)}},getReversed:function(){return xt},setTest:function(ft){ft?ct(i.DEPTH_TEST):G(i.DEPTH_TEST)},setMask:function(ft){yt!==ft&&!V&&(i.depthMask(ft),yt=ft)},setFunc:function(ft){if(xt&&(ft=Yg[ft]),Lt!==ft){switch(ft){case eo:i.depthFunc(i.NEVER);break;case no:i.depthFunc(i.ALWAYS);break;case io:i.depthFunc(i.LESS);break;case fr:i.depthFunc(i.LEQUAL);break;case ro:i.depthFunc(i.EQUAL);break;case so:i.depthFunc(i.GEQUAL);break;case ao:i.depthFunc(i.GREATER);break;case oo:i.depthFunc(i.NOTEQUAL);break;default:i.depthFunc(i.LEQUAL)}Lt=ft}},setLocked:function(ft){V=ft},setClear:function(ft){gt!==ft&&(xt&&(ft=1-ft),i.clearDepth(ft),gt=ft)},reset:function(){V=!1,yt=null,Lt=null,gt=null,xt=!1}}}function r(){let V=!1,xt=null,yt=null,Lt=null,gt=null,ft=null,Nt=null,$t=null,ue=null;return{setTest:function(ae){V||(ae?ct(i.STENCIL_TEST):G(i.STENCIL_TEST))},setMask:function(ae){xt!==ae&&!V&&(i.stencilMask(ae),xt=ae)},setFunc:function(ae,Pn,Mn){(yt!==ae||Lt!==Pn||gt!==Mn)&&(i.stencilFunc(ae,Pn,Mn),yt=ae,Lt=Pn,gt=Mn)},setOp:function(ae,Pn,Mn){(ft!==ae||Nt!==Pn||$t!==Mn)&&(i.stencilOp(ae,Pn,Mn),ft=ae,Nt=Pn,$t=Mn)},setLocked:function(ae){V=ae},setClear:function(ae){ue!==ae&&(i.clearStencil(ae),ue=ae)},reset:function(){V=!1,xt=null,yt=null,Lt=null,gt=null,ft=null,Nt=null,$t=null,ue=null}}}const s=new e,a=new n,o=new r,c=new WeakMap,l=new WeakMap;let h={},u={},d=new WeakMap,f=[],m=null,x=!1,g=null,p=null,T=null,y=null,M=null,w=null,E=null,A=new Yt(0,0,0),C=0,v=!1,_=null,S=null,b=null,D=null,U=null;const N=i.getParameter(i.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let B=!1,Z=0;const H=i.getParameter(i.VERSION);H.indexOf("WebGL")!==-1?(Z=parseFloat(/^WebGL (\d)/.exec(H)[1]),B=Z>=1):H.indexOf("OpenGL ES")!==-1&&(Z=parseFloat(/^OpenGL ES (\d)/.exec(H)[1]),B=Z>=2);let st=null,ht={};const pt=i.getParameter(i.SCISSOR_BOX),_t=i.getParameter(i.VIEWPORT),Et=new de().fromArray(pt),zt=new de().fromArray(_t);function Vt(V,xt,yt,Lt){const gt=new Uint8Array(4),ft=i.createTexture();i.bindTexture(V,ft),i.texParameteri(V,i.TEXTURE_MIN_FILTER,i.NEAREST),i.texParameteri(V,i.TEXTURE_MAG_FILTER,i.NEAREST);for(let Nt=0;Nt<yt;Nt++)V===i.TEXTURE_3D||V===i.TEXTURE_2D_ARRAY?i.texImage3D(xt,0,i.RGBA,1,1,Lt,0,i.RGBA,i.UNSIGNED_BYTE,gt):i.texImage2D(xt+Nt,0,i.RGBA,1,1,0,i.RGBA,i.UNSIGNED_BYTE,gt);return ft}const et={};et[i.TEXTURE_2D]=Vt(i.TEXTURE_2D,i.TEXTURE_2D,1),et[i.TEXTURE_CUBE_MAP]=Vt(i.TEXTURE_CUBE_MAP,i.TEXTURE_CUBE_MAP_POSITIVE_X,6),et[i.TEXTURE_2D_ARRAY]=Vt(i.TEXTURE_2D_ARRAY,i.TEXTURE_2D_ARRAY,1,1),et[i.TEXTURE_3D]=Vt(i.TEXTURE_3D,i.TEXTURE_3D,1,1),s.setClear(0,0,0,1),a.setClear(1),o.setClear(0),ct(i.DEPTH_TEST),a.setFunc(fr),z(!1),W(Dc),ct(i.CULL_FACE),K(ri);function ct(V){h[V]!==!0&&(i.enable(V),h[V]=!0)}function G(V){h[V]!==!1&&(i.disable(V),h[V]=!1)}function q(V,xt){return u[V]!==xt?(i.bindFramebuffer(V,xt),u[V]=xt,V===i.DRAW_FRAMEBUFFER&&(u[i.FRAMEBUFFER]=xt),V===i.FRAMEBUFFER&&(u[i.DRAW_FRAMEBUFFER]=xt),!0):!1}function k(V,xt){let yt=f,Lt=!1;if(V){yt=d.get(xt),yt===void 0&&(yt=[],d.set(xt,yt));const gt=V.textures;if(yt.length!==gt.length||yt[0]!==i.COLOR_ATTACHMENT0){for(let ft=0,Nt=gt.length;ft<Nt;ft++)yt[ft]=i.COLOR_ATTACHMENT0+ft;yt.length=gt.length,Lt=!0}}else yt[0]!==i.BACK&&(yt[0]=i.BACK,Lt=!0);Lt&&i.drawBuffers(yt)}function j(V){return m!==V?(i.useProgram(V),m=V,!0):!1}const tt={[Si]:i.FUNC_ADD,[ef]:i.FUNC_SUBTRACT,[nf]:i.FUNC_REVERSE_SUBTRACT};tt[rf]=i.MIN,tt[sf]=i.MAX;const P={[af]:i.ZERO,[of]:i.ONE,[cf]:i.SRC_COLOR,[Qa]:i.SRC_ALPHA,[pf]:i.SRC_ALPHA_SATURATE,[ff]:i.DST_COLOR,[hf]:i.DST_ALPHA,[lf]:i.ONE_MINUS_SRC_COLOR,[to]:i.ONE_MINUS_SRC_ALPHA,[df]:i.ONE_MINUS_DST_COLOR,[uf]:i.ONE_MINUS_DST_ALPHA,[mf]:i.CONSTANT_COLOR,[gf]:i.ONE_MINUS_CONSTANT_COLOR,[vf]:i.CONSTANT_ALPHA,[_f]:i.ONE_MINUS_CONSTANT_ALPHA};function K(V,xt,yt,Lt,gt,ft,Nt,$t,ue,ae){if(V===ri){x===!0&&(G(i.BLEND),x=!1);return}if(x===!1&&(ct(i.BLEND),x=!0),V!==tf){if(V!==g||ae!==v){if((p!==Si||M!==Si)&&(i.blendEquation(i.FUNC_ADD),p=Si,M=Si),ae)switch(V){case cr:i.blendFuncSeparate(i.ONE,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case Ic:i.blendFunc(i.ONE,i.ONE);break;case Uc:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case Nc:i.blendFuncSeparate(i.DST_COLOR,i.ONE_MINUS_SRC_ALPHA,i.ZERO,i.ONE);break;default:console.error("THREE.WebGLState: Invalid blending: ",V);break}else switch(V){case cr:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case Ic:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE,i.ONE,i.ONE);break;case Uc:console.error("THREE.WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case Nc:console.error("THREE.WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:console.error("THREE.WebGLState: Invalid blending: ",V);break}T=null,y=null,w=null,E=null,A.set(0,0,0),C=0,g=V,v=ae}return}gt=gt||xt,ft=ft||yt,Nt=Nt||Lt,(xt!==p||gt!==M)&&(i.blendEquationSeparate(tt[xt],tt[gt]),p=xt,M=gt),(yt!==T||Lt!==y||ft!==w||Nt!==E)&&(i.blendFuncSeparate(P[yt],P[Lt],P[ft],P[Nt]),T=yt,y=Lt,w=ft,E=Nt),($t.equals(A)===!1||ue!==C)&&(i.blendColor($t.r,$t.g,$t.b,ue),A.copy($t),C=ue),g=V,v=!1}function F(V,xt){V.side===Tn?G(i.CULL_FACE):ct(i.CULL_FACE);let yt=V.side===$e;xt&&(yt=!yt),z(yt),V.blending===cr&&V.transparent===!1?K(ri):K(V.blending,V.blendEquation,V.blendSrc,V.blendDst,V.blendEquationAlpha,V.blendSrcAlpha,V.blendDstAlpha,V.blendColor,V.blendAlpha,V.premultipliedAlpha),a.setFunc(V.depthFunc),a.setTest(V.depthTest),a.setMask(V.depthWrite),s.setMask(V.colorWrite);const Lt=V.stencilWrite;o.setTest(Lt),Lt&&(o.setMask(V.stencilWriteMask),o.setFunc(V.stencilFunc,V.stencilRef,V.stencilFuncMask),o.setOp(V.stencilFail,V.stencilZFail,V.stencilZPass)),ot(V.polygonOffset,V.polygonOffsetFactor,V.polygonOffsetUnits),V.alphaToCoverage===!0?ct(i.SAMPLE_ALPHA_TO_COVERAGE):G(i.SAMPLE_ALPHA_TO_COVERAGE)}function z(V){_!==V&&(V?i.frontFace(i.CW):i.frontFace(i.CCW),_=V)}function W(V){V!==ju?(ct(i.CULL_FACE),V!==S&&(V===Dc?i.cullFace(i.BACK):V===Qu?i.cullFace(i.FRONT):i.cullFace(i.FRONT_AND_BACK))):G(i.CULL_FACE),S=V}function Q(V){V!==b&&(B&&i.lineWidth(V),b=V)}function ot(V,xt,yt){V?(ct(i.POLYGON_OFFSET_FILL),(D!==xt||U!==yt)&&(i.polygonOffset(xt,yt),D=xt,U=yt)):G(i.POLYGON_OFFSET_FILL)}function ut(V){V?ct(i.SCISSOR_TEST):G(i.SCISSOR_TEST)}function Pt(V){V===void 0&&(V=i.TEXTURE0+N-1),st!==V&&(i.activeTexture(V),st=V)}function kt(V,xt,yt){yt===void 0&&(st===null?yt=i.TEXTURE0+N-1:yt=st);let Lt=ht[yt];Lt===void 0&&(Lt={type:void 0,texture:void 0},ht[yt]=Lt),(Lt.type!==V||Lt.texture!==xt)&&(st!==yt&&(i.activeTexture(yt),st=yt),i.bindTexture(V,xt||et[V]),Lt.type=V,Lt.texture=xt)}function I(){const V=ht[st];V!==void 0&&V.type!==void 0&&(i.bindTexture(V.type,null),V.type=void 0,V.texture=void 0)}function R(){try{i.compressedTexImage2D(...arguments)}catch(V){console.error("THREE.WebGLState:",V)}}function Y(){try{i.compressedTexImage3D(...arguments)}catch(V){console.error("THREE.WebGLState:",V)}}function nt(){try{i.texSubImage2D(...arguments)}catch(V){console.error("THREE.WebGLState:",V)}}function dt(){try{i.texSubImage3D(...arguments)}catch(V){console.error("THREE.WebGLState:",V)}}function at(){try{i.compressedTexSubImage2D(...arguments)}catch(V){console.error("THREE.WebGLState:",V)}}function Ft(){try{i.compressedTexSubImage3D(...arguments)}catch(V){console.error("THREE.WebGLState:",V)}}function Mt(){try{i.texStorage2D(...arguments)}catch(V){console.error("THREE.WebGLState:",V)}}function It(){try{i.texStorage3D(...arguments)}catch(V){console.error("THREE.WebGLState:",V)}}function Ut(){try{i.texImage2D(...arguments)}catch(V){console.error("THREE.WebGLState:",V)}}function mt(){try{i.texImage3D(...arguments)}catch(V){console.error("THREE.WebGLState:",V)}}function At(V){Et.equals(V)===!1&&(i.scissor(V.x,V.y,V.z,V.w),Et.copy(V))}function Xt(V){zt.equals(V)===!1&&(i.viewport(V.x,V.y,V.z,V.w),zt.copy(V))}function Ot(V,xt){let yt=l.get(xt);yt===void 0&&(yt=new WeakMap,l.set(xt,yt));let Lt=yt.get(V);Lt===void 0&&(Lt=i.getUniformBlockIndex(xt,V.name),yt.set(V,Lt))}function Tt(V,xt){const Lt=l.get(xt).get(V);c.get(xt)!==Lt&&(i.uniformBlockBinding(xt,Lt,V.__bindingPointIndex),c.set(xt,Lt))}function Zt(){i.disable(i.BLEND),i.disable(i.CULL_FACE),i.disable(i.DEPTH_TEST),i.disable(i.POLYGON_OFFSET_FILL),i.disable(i.SCISSOR_TEST),i.disable(i.STENCIL_TEST),i.disable(i.SAMPLE_ALPHA_TO_COVERAGE),i.blendEquation(i.FUNC_ADD),i.blendFunc(i.ONE,i.ZERO),i.blendFuncSeparate(i.ONE,i.ZERO,i.ONE,i.ZERO),i.blendColor(0,0,0,0),i.colorMask(!0,!0,!0,!0),i.clearColor(0,0,0,0),i.depthMask(!0),i.depthFunc(i.LESS),a.setReversed(!1),i.clearDepth(1),i.stencilMask(4294967295),i.stencilFunc(i.ALWAYS,0,4294967295),i.stencilOp(i.KEEP,i.KEEP,i.KEEP),i.clearStencil(0),i.cullFace(i.BACK),i.frontFace(i.CCW),i.polygonOffset(0,0),i.activeTexture(i.TEXTURE0),i.bindFramebuffer(i.FRAMEBUFFER,null),i.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),i.bindFramebuffer(i.READ_FRAMEBUFFER,null),i.useProgram(null),i.lineWidth(1),i.scissor(0,0,i.canvas.width,i.canvas.height),i.viewport(0,0,i.canvas.width,i.canvas.height),h={},st=null,ht={},u={},d=new WeakMap,f=[],m=null,x=!1,g=null,p=null,T=null,y=null,M=null,w=null,E=null,A=new Yt(0,0,0),C=0,v=!1,_=null,S=null,b=null,D=null,U=null,Et.set(0,0,i.canvas.width,i.canvas.height),zt.set(0,0,i.canvas.width,i.canvas.height),s.reset(),a.reset(),o.reset()}return{buffers:{color:s,depth:a,stencil:o},enable:ct,disable:G,bindFramebuffer:q,drawBuffers:k,useProgram:j,setBlending:K,setMaterial:F,setFlipSided:z,setCullFace:W,setLineWidth:Q,setPolygonOffset:ot,setScissorTest:ut,activeTexture:Pt,bindTexture:kt,unbindTexture:I,compressedTexImage2D:R,compressedTexImage3D:Y,texImage2D:Ut,texImage3D:mt,updateUBOMapping:Ot,uniformBlockBinding:Tt,texStorage2D:Mt,texStorage3D:It,texSubImage2D:nt,texSubImage3D:dt,compressedTexSubImage2D:at,compressedTexSubImage3D:Ft,scissor:At,viewport:Xt,reset:Zt}}function Jg(i,t,e,n,r,s,a){const o=t.has("WEBGL_multisampled_render_to_texture")?t.get("WEBGL_multisampled_render_to_texture"):null,c=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),l=new St,h=new WeakMap;let u;const d=new WeakMap;let f=!1;try{f=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function m(I,R){return f?new OffscreenCanvas(I,R):$s("canvas")}function x(I,R,Y){let nt=1;const dt=kt(I);if((dt.width>Y||dt.height>Y)&&(nt=Y/Math.max(dt.width,dt.height)),nt<1)if(typeof HTMLImageElement<"u"&&I instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&I instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&I instanceof ImageBitmap||typeof VideoFrame<"u"&&I instanceof VideoFrame){const at=Math.floor(nt*dt.width),Ft=Math.floor(nt*dt.height);u===void 0&&(u=m(at,Ft));const Mt=R?m(at,Ft):u;return Mt.width=at,Mt.height=Ft,Mt.getContext("2d").drawImage(I,0,0,at,Ft),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+dt.width+"x"+dt.height+") to ("+at+"x"+Ft+")."),Mt}else return"data"in I&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+dt.width+"x"+dt.height+")."),I;return I}function g(I){return I.generateMipmaps}function p(I){i.generateMipmap(I)}function T(I){return I.isWebGLCubeRenderTarget?i.TEXTURE_CUBE_MAP:I.isWebGL3DRenderTarget?i.TEXTURE_3D:I.isWebGLArrayRenderTarget||I.isCompressedArrayTexture?i.TEXTURE_2D_ARRAY:i.TEXTURE_2D}function y(I,R,Y,nt,dt=!1){if(I!==null){if(i[I]!==void 0)return i[I];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+I+"'")}let at=R;if(R===i.RED&&(Y===i.FLOAT&&(at=i.R32F),Y===i.HALF_FLOAT&&(at=i.R16F),Y===i.UNSIGNED_BYTE&&(at=i.R8)),R===i.RED_INTEGER&&(Y===i.UNSIGNED_BYTE&&(at=i.R8UI),Y===i.UNSIGNED_SHORT&&(at=i.R16UI),Y===i.UNSIGNED_INT&&(at=i.R32UI),Y===i.BYTE&&(at=i.R8I),Y===i.SHORT&&(at=i.R16I),Y===i.INT&&(at=i.R32I)),R===i.RG&&(Y===i.FLOAT&&(at=i.RG32F),Y===i.HALF_FLOAT&&(at=i.RG16F),Y===i.UNSIGNED_BYTE&&(at=i.RG8)),R===i.RG_INTEGER&&(Y===i.UNSIGNED_BYTE&&(at=i.RG8UI),Y===i.UNSIGNED_SHORT&&(at=i.RG16UI),Y===i.UNSIGNED_INT&&(at=i.RG32UI),Y===i.BYTE&&(at=i.RG8I),Y===i.SHORT&&(at=i.RG16I),Y===i.INT&&(at=i.RG32I)),R===i.RGB_INTEGER&&(Y===i.UNSIGNED_BYTE&&(at=i.RGB8UI),Y===i.UNSIGNED_SHORT&&(at=i.RGB16UI),Y===i.UNSIGNED_INT&&(at=i.RGB32UI),Y===i.BYTE&&(at=i.RGB8I),Y===i.SHORT&&(at=i.RGB16I),Y===i.INT&&(at=i.RGB32I)),R===i.RGBA_INTEGER&&(Y===i.UNSIGNED_BYTE&&(at=i.RGBA8UI),Y===i.UNSIGNED_SHORT&&(at=i.RGBA16UI),Y===i.UNSIGNED_INT&&(at=i.RGBA32UI),Y===i.BYTE&&(at=i.RGBA8I),Y===i.SHORT&&(at=i.RGBA16I),Y===i.INT&&(at=i.RGBA32I)),R===i.RGB&&(Y===i.UNSIGNED_INT_5_9_9_9_REV&&(at=i.RGB9_E5),Y===i.UNSIGNED_INT_10F_11F_11F_REV&&(at=i.R11F_G11F_B10F)),R===i.RGBA){const Ft=dt?qs:se.getTransfer(nt);Y===i.FLOAT&&(at=i.RGBA32F),Y===i.HALF_FLOAT&&(at=i.RGBA16F),Y===i.UNSIGNED_BYTE&&(at=Ft===ce?i.SRGB8_ALPHA8:i.RGBA8),Y===i.UNSIGNED_SHORT_4_4_4_4&&(at=i.RGBA4),Y===i.UNSIGNED_SHORT_5_5_5_1&&(at=i.RGB5_A1)}return(at===i.R16F||at===i.R32F||at===i.RG16F||at===i.RG32F||at===i.RGBA16F||at===i.RGBA32F)&&t.get("EXT_color_buffer_float"),at}function M(I,R){let Y;return I?R===null||R===Di||R===Gr?Y=i.DEPTH24_STENCIL8:R===An?Y=i.DEPTH32F_STENCIL8:R===Vr&&(Y=i.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):R===null||R===Di||R===Gr?Y=i.DEPTH_COMPONENT24:R===An?Y=i.DEPTH_COMPONENT32F:R===Vr&&(Y=i.DEPTH_COMPONENT16),Y}function w(I,R){return g(I)===!0||I.isFramebufferTexture&&I.minFilter!==en&&I.minFilter!==Fe?Math.log2(Math.max(R.width,R.height))+1:I.mipmaps!==void 0&&I.mipmaps.length>0?I.mipmaps.length:I.isCompressedTexture&&Array.isArray(I.image)?R.mipmaps.length:1}function E(I){const R=I.target;R.removeEventListener("dispose",E),C(R),R.isVideoTexture&&h.delete(R)}function A(I){const R=I.target;R.removeEventListener("dispose",A),_(R)}function C(I){const R=n.get(I);if(R.__webglInit===void 0)return;const Y=I.source,nt=d.get(Y);if(nt){const dt=nt[R.__cacheKey];dt.usedTimes--,dt.usedTimes===0&&v(I),Object.keys(nt).length===0&&d.delete(Y)}n.remove(I)}function v(I){const R=n.get(I);i.deleteTexture(R.__webglTexture);const Y=I.source,nt=d.get(Y);delete nt[R.__cacheKey],a.memory.textures--}function _(I){const R=n.get(I);if(I.depthTexture&&(I.depthTexture.dispose(),n.remove(I.depthTexture)),I.isWebGLCubeRenderTarget)for(let nt=0;nt<6;nt++){if(Array.isArray(R.__webglFramebuffer[nt]))for(let dt=0;dt<R.__webglFramebuffer[nt].length;dt++)i.deleteFramebuffer(R.__webglFramebuffer[nt][dt]);else i.deleteFramebuffer(R.__webglFramebuffer[nt]);R.__webglDepthbuffer&&i.deleteRenderbuffer(R.__webglDepthbuffer[nt])}else{if(Array.isArray(R.__webglFramebuffer))for(let nt=0;nt<R.__webglFramebuffer.length;nt++)i.deleteFramebuffer(R.__webglFramebuffer[nt]);else i.deleteFramebuffer(R.__webglFramebuffer);if(R.__webglDepthbuffer&&i.deleteRenderbuffer(R.__webglDepthbuffer),R.__webglMultisampledFramebuffer&&i.deleteFramebuffer(R.__webglMultisampledFramebuffer),R.__webglColorRenderbuffer)for(let nt=0;nt<R.__webglColorRenderbuffer.length;nt++)R.__webglColorRenderbuffer[nt]&&i.deleteRenderbuffer(R.__webglColorRenderbuffer[nt]);R.__webglDepthRenderbuffer&&i.deleteRenderbuffer(R.__webglDepthRenderbuffer)}const Y=I.textures;for(let nt=0,dt=Y.length;nt<dt;nt++){const at=n.get(Y[nt]);at.__webglTexture&&(i.deleteTexture(at.__webglTexture),a.memory.textures--),n.remove(Y[nt])}n.remove(I)}let S=0;function b(){S=0}function D(){const I=S;return I>=r.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+I+" texture units while this GPU supports only "+r.maxTextures),S+=1,I}function U(I){const R=[];return R.push(I.wrapS),R.push(I.wrapT),R.push(I.wrapR||0),R.push(I.magFilter),R.push(I.minFilter),R.push(I.anisotropy),R.push(I.internalFormat),R.push(I.format),R.push(I.type),R.push(I.generateMipmaps),R.push(I.premultiplyAlpha),R.push(I.flipY),R.push(I.unpackAlignment),R.push(I.colorSpace),R.join()}function N(I,R){const Y=n.get(I);if(I.isVideoTexture&&ut(I),I.isRenderTargetTexture===!1&&I.isExternalTexture!==!0&&I.version>0&&Y.__version!==I.version){const nt=I.image;if(nt===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(nt.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{et(Y,I,R);return}}else I.isExternalTexture&&(Y.__webglTexture=I.sourceTexture?I.sourceTexture:null);e.bindTexture(i.TEXTURE_2D,Y.__webglTexture,i.TEXTURE0+R)}function B(I,R){const Y=n.get(I);if(I.isRenderTargetTexture===!1&&I.version>0&&Y.__version!==I.version){et(Y,I,R);return}e.bindTexture(i.TEXTURE_2D_ARRAY,Y.__webglTexture,i.TEXTURE0+R)}function Z(I,R){const Y=n.get(I);if(I.isRenderTargetTexture===!1&&I.version>0&&Y.__version!==I.version){et(Y,I,R);return}e.bindTexture(i.TEXTURE_3D,Y.__webglTexture,i.TEXTURE0+R)}function H(I,R){const Y=n.get(I);if(I.version>0&&Y.__version!==I.version){ct(Y,I,R);return}e.bindTexture(i.TEXTURE_CUBE_MAP,Y.__webglTexture,i.TEXTURE0+R)}const st={[Hr]:i.REPEAT,[Ti]:i.CLAMP_TO_EDGE,[lo]:i.MIRRORED_REPEAT},ht={[en]:i.NEAREST,[Rf]:i.NEAREST_MIPMAP_NEAREST,[as]:i.NEAREST_MIPMAP_LINEAR,[Fe]:i.LINEAR,[ca]:i.LINEAR_MIPMAP_NEAREST,[wi]:i.LINEAR_MIPMAP_LINEAR},pt={[Df]:i.NEVER,[Bf]:i.ALWAYS,[If]:i.LESS,[wh]:i.LEQUAL,[Uf]:i.EQUAL,[Of]:i.GEQUAL,[Nf]:i.GREATER,[Ff]:i.NOTEQUAL};function _t(I,R){if(R.type===An&&t.has("OES_texture_float_linear")===!1&&(R.magFilter===Fe||R.magFilter===ca||R.magFilter===as||R.magFilter===wi||R.minFilter===Fe||R.minFilter===ca||R.minFilter===as||R.minFilter===wi)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),i.texParameteri(I,i.TEXTURE_WRAP_S,st[R.wrapS]),i.texParameteri(I,i.TEXTURE_WRAP_T,st[R.wrapT]),(I===i.TEXTURE_3D||I===i.TEXTURE_2D_ARRAY)&&i.texParameteri(I,i.TEXTURE_WRAP_R,st[R.wrapR]),i.texParameteri(I,i.TEXTURE_MAG_FILTER,ht[R.magFilter]),i.texParameteri(I,i.TEXTURE_MIN_FILTER,ht[R.minFilter]),R.compareFunction&&(i.texParameteri(I,i.TEXTURE_COMPARE_MODE,i.COMPARE_REF_TO_TEXTURE),i.texParameteri(I,i.TEXTURE_COMPARE_FUNC,pt[R.compareFunction])),t.has("EXT_texture_filter_anisotropic")===!0){if(R.magFilter===en||R.minFilter!==as&&R.minFilter!==wi||R.type===An&&t.has("OES_texture_float_linear")===!1)return;if(R.anisotropy>1||n.get(R).__currentAnisotropy){const Y=t.get("EXT_texture_filter_anisotropic");i.texParameterf(I,Y.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(R.anisotropy,r.getMaxAnisotropy())),n.get(R).__currentAnisotropy=R.anisotropy}}}function Et(I,R){let Y=!1;I.__webglInit===void 0&&(I.__webglInit=!0,R.addEventListener("dispose",E));const nt=R.source;let dt=d.get(nt);dt===void 0&&(dt={},d.set(nt,dt));const at=U(R);if(at!==I.__cacheKey){dt[at]===void 0&&(dt[at]={texture:i.createTexture(),usedTimes:0},a.memory.textures++,Y=!0),dt[at].usedTimes++;const Ft=dt[I.__cacheKey];Ft!==void 0&&(dt[I.__cacheKey].usedTimes--,Ft.usedTimes===0&&v(R)),I.__cacheKey=at,I.__webglTexture=dt[at].texture}return Y}function zt(I,R,Y){return Math.floor(Math.floor(I/Y)/R)}function Vt(I,R,Y,nt){const at=I.updateRanges;if(at.length===0)e.texSubImage2D(i.TEXTURE_2D,0,0,0,R.width,R.height,Y,nt,R.data);else{at.sort((mt,At)=>mt.start-At.start);let Ft=0;for(let mt=1;mt<at.length;mt++){const At=at[Ft],Xt=at[mt],Ot=At.start+At.count,Tt=zt(Xt.start,R.width,4),Zt=zt(At.start,R.width,4);Xt.start<=Ot+1&&Tt===Zt&&zt(Xt.start+Xt.count-1,R.width,4)===Tt?At.count=Math.max(At.count,Xt.start+Xt.count-At.start):(++Ft,at[Ft]=Xt)}at.length=Ft+1;const Mt=i.getParameter(i.UNPACK_ROW_LENGTH),It=i.getParameter(i.UNPACK_SKIP_PIXELS),Ut=i.getParameter(i.UNPACK_SKIP_ROWS);i.pixelStorei(i.UNPACK_ROW_LENGTH,R.width);for(let mt=0,At=at.length;mt<At;mt++){const Xt=at[mt],Ot=Math.floor(Xt.start/4),Tt=Math.ceil(Xt.count/4),Zt=Ot%R.width,V=Math.floor(Ot/R.width),xt=Tt,yt=1;i.pixelStorei(i.UNPACK_SKIP_PIXELS,Zt),i.pixelStorei(i.UNPACK_SKIP_ROWS,V),e.texSubImage2D(i.TEXTURE_2D,0,Zt,V,xt,yt,Y,nt,R.data)}I.clearUpdateRanges(),i.pixelStorei(i.UNPACK_ROW_LENGTH,Mt),i.pixelStorei(i.UNPACK_SKIP_PIXELS,It),i.pixelStorei(i.UNPACK_SKIP_ROWS,Ut)}}function et(I,R,Y){let nt=i.TEXTURE_2D;(R.isDataArrayTexture||R.isCompressedArrayTexture)&&(nt=i.TEXTURE_2D_ARRAY),R.isData3DTexture&&(nt=i.TEXTURE_3D);const dt=Et(I,R),at=R.source;e.bindTexture(nt,I.__webglTexture,i.TEXTURE0+Y);const Ft=n.get(at);if(at.version!==Ft.__version||dt===!0){e.activeTexture(i.TEXTURE0+Y);const Mt=se.getPrimaries(se.workingColorSpace),It=R.colorSpace===wn?null:se.getPrimaries(R.colorSpace),Ut=R.colorSpace===wn||Mt===It?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,R.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,R.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,R.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,Ut);let mt=x(R.image,!1,r.maxTextureSize);mt=Pt(R,mt);const At=s.convert(R.format,R.colorSpace),Xt=s.convert(R.type);let Ot=y(R.internalFormat,At,Xt,R.colorSpace,R.isVideoTexture);_t(nt,R);let Tt;const Zt=R.mipmaps,V=R.isVideoTexture!==!0,xt=Ft.__version===void 0||dt===!0,yt=at.dataReady,Lt=w(R,mt);if(R.isDepthTexture)Ot=M(R.format===Xr,R.type),xt&&(V?e.texStorage2D(i.TEXTURE_2D,1,Ot,mt.width,mt.height):e.texImage2D(i.TEXTURE_2D,0,Ot,mt.width,mt.height,0,At,Xt,null));else if(R.isDataTexture)if(Zt.length>0){V&&xt&&e.texStorage2D(i.TEXTURE_2D,Lt,Ot,Zt[0].width,Zt[0].height);for(let gt=0,ft=Zt.length;gt<ft;gt++)Tt=Zt[gt],V?yt&&e.texSubImage2D(i.TEXTURE_2D,gt,0,0,Tt.width,Tt.height,At,Xt,Tt.data):e.texImage2D(i.TEXTURE_2D,gt,Ot,Tt.width,Tt.height,0,At,Xt,Tt.data);R.generateMipmaps=!1}else V?(xt&&e.texStorage2D(i.TEXTURE_2D,Lt,Ot,mt.width,mt.height),yt&&Vt(R,mt,At,Xt)):e.texImage2D(i.TEXTURE_2D,0,Ot,mt.width,mt.height,0,At,Xt,mt.data);else if(R.isCompressedTexture)if(R.isCompressedArrayTexture){V&&xt&&e.texStorage3D(i.TEXTURE_2D_ARRAY,Lt,Ot,Zt[0].width,Zt[0].height,mt.depth);for(let gt=0,ft=Zt.length;gt<ft;gt++)if(Tt=Zt[gt],R.format!==tn)if(At!==null)if(V){if(yt)if(R.layerUpdates.size>0){const Nt=_l(Tt.width,Tt.height,R.format,R.type);for(const $t of R.layerUpdates){const ue=Tt.data.subarray($t*Nt/Tt.data.BYTES_PER_ELEMENT,($t+1)*Nt/Tt.data.BYTES_PER_ELEMENT);e.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,gt,0,0,$t,Tt.width,Tt.height,1,At,ue)}R.clearLayerUpdates()}else e.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,gt,0,0,0,Tt.width,Tt.height,mt.depth,At,Tt.data)}else e.compressedTexImage3D(i.TEXTURE_2D_ARRAY,gt,Ot,Tt.width,Tt.height,mt.depth,0,Tt.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else V?yt&&e.texSubImage3D(i.TEXTURE_2D_ARRAY,gt,0,0,0,Tt.width,Tt.height,mt.depth,At,Xt,Tt.data):e.texImage3D(i.TEXTURE_2D_ARRAY,gt,Ot,Tt.width,Tt.height,mt.depth,0,At,Xt,Tt.data)}else{V&&xt&&e.texStorage2D(i.TEXTURE_2D,Lt,Ot,Zt[0].width,Zt[0].height);for(let gt=0,ft=Zt.length;gt<ft;gt++)Tt=Zt[gt],R.format!==tn?At!==null?V?yt&&e.compressedTexSubImage2D(i.TEXTURE_2D,gt,0,0,Tt.width,Tt.height,At,Tt.data):e.compressedTexImage2D(i.TEXTURE_2D,gt,Ot,Tt.width,Tt.height,0,Tt.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):V?yt&&e.texSubImage2D(i.TEXTURE_2D,gt,0,0,Tt.width,Tt.height,At,Xt,Tt.data):e.texImage2D(i.TEXTURE_2D,gt,Ot,Tt.width,Tt.height,0,At,Xt,Tt.data)}else if(R.isDataArrayTexture)if(V){if(xt&&e.texStorage3D(i.TEXTURE_2D_ARRAY,Lt,Ot,mt.width,mt.height,mt.depth),yt)if(R.layerUpdates.size>0){const gt=_l(mt.width,mt.height,R.format,R.type);for(const ft of R.layerUpdates){const Nt=mt.data.subarray(ft*gt/mt.data.BYTES_PER_ELEMENT,(ft+1)*gt/mt.data.BYTES_PER_ELEMENT);e.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,ft,mt.width,mt.height,1,At,Xt,Nt)}R.clearLayerUpdates()}else e.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,0,mt.width,mt.height,mt.depth,At,Xt,mt.data)}else e.texImage3D(i.TEXTURE_2D_ARRAY,0,Ot,mt.width,mt.height,mt.depth,0,At,Xt,mt.data);else if(R.isData3DTexture)V?(xt&&e.texStorage3D(i.TEXTURE_3D,Lt,Ot,mt.width,mt.height,mt.depth),yt&&e.texSubImage3D(i.TEXTURE_3D,0,0,0,0,mt.width,mt.height,mt.depth,At,Xt,mt.data)):e.texImage3D(i.TEXTURE_3D,0,Ot,mt.width,mt.height,mt.depth,0,At,Xt,mt.data);else if(R.isFramebufferTexture){if(xt)if(V)e.texStorage2D(i.TEXTURE_2D,Lt,Ot,mt.width,mt.height);else{let gt=mt.width,ft=mt.height;for(let Nt=0;Nt<Lt;Nt++)e.texImage2D(i.TEXTURE_2D,Nt,Ot,gt,ft,0,At,Xt,null),gt>>=1,ft>>=1}}else if(Zt.length>0){if(V&&xt){const gt=kt(Zt[0]);e.texStorage2D(i.TEXTURE_2D,Lt,Ot,gt.width,gt.height)}for(let gt=0,ft=Zt.length;gt<ft;gt++)Tt=Zt[gt],V?yt&&e.texSubImage2D(i.TEXTURE_2D,gt,0,0,At,Xt,Tt):e.texImage2D(i.TEXTURE_2D,gt,Ot,At,Xt,Tt);R.generateMipmaps=!1}else if(V){if(xt){const gt=kt(mt);e.texStorage2D(i.TEXTURE_2D,Lt,Ot,gt.width,gt.height)}yt&&e.texSubImage2D(i.TEXTURE_2D,0,0,0,At,Xt,mt)}else e.texImage2D(i.TEXTURE_2D,0,Ot,At,Xt,mt);g(R)&&p(nt),Ft.__version=at.version,R.onUpdate&&R.onUpdate(R)}I.__version=R.version}function ct(I,R,Y){if(R.image.length!==6)return;const nt=Et(I,R),dt=R.source;e.bindTexture(i.TEXTURE_CUBE_MAP,I.__webglTexture,i.TEXTURE0+Y);const at=n.get(dt);if(dt.version!==at.__version||nt===!0){e.activeTexture(i.TEXTURE0+Y);const Ft=se.getPrimaries(se.workingColorSpace),Mt=R.colorSpace===wn?null:se.getPrimaries(R.colorSpace),It=R.colorSpace===wn||Ft===Mt?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,R.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,R.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,R.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,It);const Ut=R.isCompressedTexture||R.image[0].isCompressedTexture,mt=R.image[0]&&R.image[0].isDataTexture,At=[];for(let ft=0;ft<6;ft++)!Ut&&!mt?At[ft]=x(R.image[ft],!0,r.maxCubemapSize):At[ft]=mt?R.image[ft].image:R.image[ft],At[ft]=Pt(R,At[ft]);const Xt=At[0],Ot=s.convert(R.format,R.colorSpace),Tt=s.convert(R.type),Zt=y(R.internalFormat,Ot,Tt,R.colorSpace),V=R.isVideoTexture!==!0,xt=at.__version===void 0||nt===!0,yt=dt.dataReady;let Lt=w(R,Xt);_t(i.TEXTURE_CUBE_MAP,R);let gt;if(Ut){V&&xt&&e.texStorage2D(i.TEXTURE_CUBE_MAP,Lt,Zt,Xt.width,Xt.height);for(let ft=0;ft<6;ft++){gt=At[ft].mipmaps;for(let Nt=0;Nt<gt.length;Nt++){const $t=gt[Nt];R.format!==tn?Ot!==null?V?yt&&e.compressedTexSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ft,Nt,0,0,$t.width,$t.height,Ot,$t.data):e.compressedTexImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ft,Nt,Zt,$t.width,$t.height,0,$t.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):V?yt&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ft,Nt,0,0,$t.width,$t.height,Ot,Tt,$t.data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ft,Nt,Zt,$t.width,$t.height,0,Ot,Tt,$t.data)}}}else{if(gt=R.mipmaps,V&&xt){gt.length>0&&Lt++;const ft=kt(At[0]);e.texStorage2D(i.TEXTURE_CUBE_MAP,Lt,Zt,ft.width,ft.height)}for(let ft=0;ft<6;ft++)if(mt){V?yt&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ft,0,0,0,At[ft].width,At[ft].height,Ot,Tt,At[ft].data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ft,0,Zt,At[ft].width,At[ft].height,0,Ot,Tt,At[ft].data);for(let Nt=0;Nt<gt.length;Nt++){const ue=gt[Nt].image[ft].image;V?yt&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ft,Nt+1,0,0,ue.width,ue.height,Ot,Tt,ue.data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ft,Nt+1,Zt,ue.width,ue.height,0,Ot,Tt,ue.data)}}else{V?yt&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ft,0,0,0,Ot,Tt,At[ft]):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ft,0,Zt,Ot,Tt,At[ft]);for(let Nt=0;Nt<gt.length;Nt++){const $t=gt[Nt];V?yt&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ft,Nt+1,0,0,Ot,Tt,$t.image[ft]):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ft,Nt+1,Zt,Ot,Tt,$t.image[ft])}}}g(R)&&p(i.TEXTURE_CUBE_MAP),at.__version=dt.version,R.onUpdate&&R.onUpdate(R)}I.__version=R.version}function G(I,R,Y,nt,dt,at){const Ft=s.convert(Y.format,Y.colorSpace),Mt=s.convert(Y.type),It=y(Y.internalFormat,Ft,Mt,Y.colorSpace),Ut=n.get(R),mt=n.get(Y);if(mt.__renderTarget=R,!Ut.__hasExternalTextures){const At=Math.max(1,R.width>>at),Xt=Math.max(1,R.height>>at);dt===i.TEXTURE_3D||dt===i.TEXTURE_2D_ARRAY?e.texImage3D(dt,at,It,At,Xt,R.depth,0,Ft,Mt,null):e.texImage2D(dt,at,It,At,Xt,0,Ft,Mt,null)}e.bindFramebuffer(i.FRAMEBUFFER,I),ot(R)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,nt,dt,mt.__webglTexture,0,Q(R)):(dt===i.TEXTURE_2D||dt>=i.TEXTURE_CUBE_MAP_POSITIVE_X&&dt<=i.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&i.framebufferTexture2D(i.FRAMEBUFFER,nt,dt,mt.__webglTexture,at),e.bindFramebuffer(i.FRAMEBUFFER,null)}function q(I,R,Y){if(i.bindRenderbuffer(i.RENDERBUFFER,I),R.depthBuffer){const nt=R.depthTexture,dt=nt&&nt.isDepthTexture?nt.type:null,at=M(R.stencilBuffer,dt),Ft=R.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,Mt=Q(R);ot(R)?o.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,Mt,at,R.width,R.height):Y?i.renderbufferStorageMultisample(i.RENDERBUFFER,Mt,at,R.width,R.height):i.renderbufferStorage(i.RENDERBUFFER,at,R.width,R.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,Ft,i.RENDERBUFFER,I)}else{const nt=R.textures;for(let dt=0;dt<nt.length;dt++){const at=nt[dt],Ft=s.convert(at.format,at.colorSpace),Mt=s.convert(at.type),It=y(at.internalFormat,Ft,Mt,at.colorSpace),Ut=Q(R);Y&&ot(R)===!1?i.renderbufferStorageMultisample(i.RENDERBUFFER,Ut,It,R.width,R.height):ot(R)?o.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,Ut,It,R.width,R.height):i.renderbufferStorage(i.RENDERBUFFER,It,R.width,R.height)}}i.bindRenderbuffer(i.RENDERBUFFER,null)}function k(I,R){if(R&&R.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(e.bindFramebuffer(i.FRAMEBUFFER,I),!(R.depthTexture&&R.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");const nt=n.get(R.depthTexture);nt.__renderTarget=R,(!nt.__webglTexture||R.depthTexture.image.width!==R.width||R.depthTexture.image.height!==R.height)&&(R.depthTexture.image.width=R.width,R.depthTexture.image.height=R.height,R.depthTexture.needsUpdate=!0),N(R.depthTexture,0);const dt=nt.__webglTexture,at=Q(R);if(R.depthTexture.format===Wr)ot(R)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,dt,0,at):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,dt,0);else if(R.depthTexture.format===Xr)ot(R)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,dt,0,at):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,dt,0);else throw new Error("Unknown depthTexture format")}function j(I){const R=n.get(I),Y=I.isWebGLCubeRenderTarget===!0;if(R.__boundDepthTexture!==I.depthTexture){const nt=I.depthTexture;if(R.__depthDisposeCallback&&R.__depthDisposeCallback(),nt){const dt=()=>{delete R.__boundDepthTexture,delete R.__depthDisposeCallback,nt.removeEventListener("dispose",dt)};nt.addEventListener("dispose",dt),R.__depthDisposeCallback=dt}R.__boundDepthTexture=nt}if(I.depthTexture&&!R.__autoAllocateDepthBuffer){if(Y)throw new Error("target.depthTexture not supported in Cube render targets");const nt=I.texture.mipmaps;nt&&nt.length>0?k(R.__webglFramebuffer[0],I):k(R.__webglFramebuffer,I)}else if(Y){R.__webglDepthbuffer=[];for(let nt=0;nt<6;nt++)if(e.bindFramebuffer(i.FRAMEBUFFER,R.__webglFramebuffer[nt]),R.__webglDepthbuffer[nt]===void 0)R.__webglDepthbuffer[nt]=i.createRenderbuffer(),q(R.__webglDepthbuffer[nt],I,!1);else{const dt=I.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,at=R.__webglDepthbuffer[nt];i.bindRenderbuffer(i.RENDERBUFFER,at),i.framebufferRenderbuffer(i.FRAMEBUFFER,dt,i.RENDERBUFFER,at)}}else{const nt=I.texture.mipmaps;if(nt&&nt.length>0?e.bindFramebuffer(i.FRAMEBUFFER,R.__webglFramebuffer[0]):e.bindFramebuffer(i.FRAMEBUFFER,R.__webglFramebuffer),R.__webglDepthbuffer===void 0)R.__webglDepthbuffer=i.createRenderbuffer(),q(R.__webglDepthbuffer,I,!1);else{const dt=I.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,at=R.__webglDepthbuffer;i.bindRenderbuffer(i.RENDERBUFFER,at),i.framebufferRenderbuffer(i.FRAMEBUFFER,dt,i.RENDERBUFFER,at)}}e.bindFramebuffer(i.FRAMEBUFFER,null)}function tt(I,R,Y){const nt=n.get(I);R!==void 0&&G(nt.__webglFramebuffer,I,I.texture,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,0),Y!==void 0&&j(I)}function P(I){const R=I.texture,Y=n.get(I),nt=n.get(R);I.addEventListener("dispose",A);const dt=I.textures,at=I.isWebGLCubeRenderTarget===!0,Ft=dt.length>1;if(Ft||(nt.__webglTexture===void 0&&(nt.__webglTexture=i.createTexture()),nt.__version=R.version,a.memory.textures++),at){Y.__webglFramebuffer=[];for(let Mt=0;Mt<6;Mt++)if(R.mipmaps&&R.mipmaps.length>0){Y.__webglFramebuffer[Mt]=[];for(let It=0;It<R.mipmaps.length;It++)Y.__webglFramebuffer[Mt][It]=i.createFramebuffer()}else Y.__webglFramebuffer[Mt]=i.createFramebuffer()}else{if(R.mipmaps&&R.mipmaps.length>0){Y.__webglFramebuffer=[];for(let Mt=0;Mt<R.mipmaps.length;Mt++)Y.__webglFramebuffer[Mt]=i.createFramebuffer()}else Y.__webglFramebuffer=i.createFramebuffer();if(Ft)for(let Mt=0,It=dt.length;Mt<It;Mt++){const Ut=n.get(dt[Mt]);Ut.__webglTexture===void 0&&(Ut.__webglTexture=i.createTexture(),a.memory.textures++)}if(I.samples>0&&ot(I)===!1){Y.__webglMultisampledFramebuffer=i.createFramebuffer(),Y.__webglColorRenderbuffer=[],e.bindFramebuffer(i.FRAMEBUFFER,Y.__webglMultisampledFramebuffer);for(let Mt=0;Mt<dt.length;Mt++){const It=dt[Mt];Y.__webglColorRenderbuffer[Mt]=i.createRenderbuffer(),i.bindRenderbuffer(i.RENDERBUFFER,Y.__webglColorRenderbuffer[Mt]);const Ut=s.convert(It.format,It.colorSpace),mt=s.convert(It.type),At=y(It.internalFormat,Ut,mt,It.colorSpace,I.isXRRenderTarget===!0),Xt=Q(I);i.renderbufferStorageMultisample(i.RENDERBUFFER,Xt,At,I.width,I.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+Mt,i.RENDERBUFFER,Y.__webglColorRenderbuffer[Mt])}i.bindRenderbuffer(i.RENDERBUFFER,null),I.depthBuffer&&(Y.__webglDepthRenderbuffer=i.createRenderbuffer(),q(Y.__webglDepthRenderbuffer,I,!0)),e.bindFramebuffer(i.FRAMEBUFFER,null)}}if(at){e.bindTexture(i.TEXTURE_CUBE_MAP,nt.__webglTexture),_t(i.TEXTURE_CUBE_MAP,R);for(let Mt=0;Mt<6;Mt++)if(R.mipmaps&&R.mipmaps.length>0)for(let It=0;It<R.mipmaps.length;It++)G(Y.__webglFramebuffer[Mt][It],I,R,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+Mt,It);else G(Y.__webglFramebuffer[Mt],I,R,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+Mt,0);g(R)&&p(i.TEXTURE_CUBE_MAP),e.unbindTexture()}else if(Ft){for(let Mt=0,It=dt.length;Mt<It;Mt++){const Ut=dt[Mt],mt=n.get(Ut);let At=i.TEXTURE_2D;(I.isWebGL3DRenderTarget||I.isWebGLArrayRenderTarget)&&(At=I.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),e.bindTexture(At,mt.__webglTexture),_t(At,Ut),G(Y.__webglFramebuffer,I,Ut,i.COLOR_ATTACHMENT0+Mt,At,0),g(Ut)&&p(At)}e.unbindTexture()}else{let Mt=i.TEXTURE_2D;if((I.isWebGL3DRenderTarget||I.isWebGLArrayRenderTarget)&&(Mt=I.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),e.bindTexture(Mt,nt.__webglTexture),_t(Mt,R),R.mipmaps&&R.mipmaps.length>0)for(let It=0;It<R.mipmaps.length;It++)G(Y.__webglFramebuffer[It],I,R,i.COLOR_ATTACHMENT0,Mt,It);else G(Y.__webglFramebuffer,I,R,i.COLOR_ATTACHMENT0,Mt,0);g(R)&&p(Mt),e.unbindTexture()}I.depthBuffer&&j(I)}function K(I){const R=I.textures;for(let Y=0,nt=R.length;Y<nt;Y++){const dt=R[Y];if(g(dt)){const at=T(I),Ft=n.get(dt).__webglTexture;e.bindTexture(at,Ft),p(at),e.unbindTexture()}}}const F=[],z=[];function W(I){if(I.samples>0){if(ot(I)===!1){const R=I.textures,Y=I.width,nt=I.height;let dt=i.COLOR_BUFFER_BIT;const at=I.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,Ft=n.get(I),Mt=R.length>1;if(Mt)for(let Ut=0;Ut<R.length;Ut++)e.bindFramebuffer(i.FRAMEBUFFER,Ft.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+Ut,i.RENDERBUFFER,null),e.bindFramebuffer(i.FRAMEBUFFER,Ft.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+Ut,i.TEXTURE_2D,null,0);e.bindFramebuffer(i.READ_FRAMEBUFFER,Ft.__webglMultisampledFramebuffer);const It=I.texture.mipmaps;It&&It.length>0?e.bindFramebuffer(i.DRAW_FRAMEBUFFER,Ft.__webglFramebuffer[0]):e.bindFramebuffer(i.DRAW_FRAMEBUFFER,Ft.__webglFramebuffer);for(let Ut=0;Ut<R.length;Ut++){if(I.resolveDepthBuffer&&(I.depthBuffer&&(dt|=i.DEPTH_BUFFER_BIT),I.stencilBuffer&&I.resolveStencilBuffer&&(dt|=i.STENCIL_BUFFER_BIT)),Mt){i.framebufferRenderbuffer(i.READ_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.RENDERBUFFER,Ft.__webglColorRenderbuffer[Ut]);const mt=n.get(R[Ut]).__webglTexture;i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,mt,0)}i.blitFramebuffer(0,0,Y,nt,0,0,Y,nt,dt,i.NEAREST),c===!0&&(F.length=0,z.length=0,F.push(i.COLOR_ATTACHMENT0+Ut),I.depthBuffer&&I.resolveDepthBuffer===!1&&(F.push(at),z.push(at),i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,z)),i.invalidateFramebuffer(i.READ_FRAMEBUFFER,F))}if(e.bindFramebuffer(i.READ_FRAMEBUFFER,null),e.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),Mt)for(let Ut=0;Ut<R.length;Ut++){e.bindFramebuffer(i.FRAMEBUFFER,Ft.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+Ut,i.RENDERBUFFER,Ft.__webglColorRenderbuffer[Ut]);const mt=n.get(R[Ut]).__webglTexture;e.bindFramebuffer(i.FRAMEBUFFER,Ft.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+Ut,i.TEXTURE_2D,mt,0)}e.bindFramebuffer(i.DRAW_FRAMEBUFFER,Ft.__webglMultisampledFramebuffer)}else if(I.depthBuffer&&I.resolveDepthBuffer===!1&&c){const R=I.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,[R])}}}function Q(I){return Math.min(r.maxSamples,I.samples)}function ot(I){const R=n.get(I);return I.samples>0&&t.has("WEBGL_multisampled_render_to_texture")===!0&&R.__useRenderToTexture!==!1}function ut(I){const R=a.render.frame;h.get(I)!==R&&(h.set(I,R),I.update())}function Pt(I,R){const Y=I.colorSpace,nt=I.format,dt=I.type;return I.isCompressedTexture===!0||I.isVideoTexture===!0||Y!==Ii&&Y!==wn&&(se.getTransfer(Y)===ce?(nt!==tn||dt!==Cn)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",Y)),R}function kt(I){return typeof HTMLImageElement<"u"&&I instanceof HTMLImageElement?(l.width=I.naturalWidth||I.width,l.height=I.naturalHeight||I.height):typeof VideoFrame<"u"&&I instanceof VideoFrame?(l.width=I.displayWidth,l.height=I.displayHeight):(l.width=I.width,l.height=I.height),l}this.allocateTextureUnit=D,this.resetTextureUnits=b,this.setTexture2D=N,this.setTexture2DArray=B,this.setTexture3D=Z,this.setTextureCube=H,this.rebindTextures=tt,this.setupRenderTarget=P,this.updateRenderTargetMipmap=K,this.updateMultisampleRenderTarget=W,this.setupDepthRenderbuffer=j,this.setupFrameBufferTexture=G,this.useMultisampledRTT=ot}function Zg(i,t){function e(n,r=wn){let s;const a=se.getTransfer(r);if(n===Cn)return i.UNSIGNED_BYTE;if(n===Zo)return i.UNSIGNED_SHORT_4_4_4_4;if(n===Ko)return i.UNSIGNED_SHORT_5_5_5_1;if(n===xh)return i.UNSIGNED_INT_5_9_9_9_REV;if(n===Mh)return i.UNSIGNED_INT_10F_11F_11F_REV;if(n===vh)return i.BYTE;if(n===_h)return i.SHORT;if(n===Vr)return i.UNSIGNED_SHORT;if(n===Jo)return i.INT;if(n===Di)return i.UNSIGNED_INT;if(n===An)return i.FLOAT;if(n===_r)return i.HALF_FLOAT;if(n===Sh)return i.ALPHA;if(n===yh)return i.RGB;if(n===tn)return i.RGBA;if(n===Wr)return i.DEPTH_COMPONENT;if(n===Xr)return i.DEPTH_STENCIL;if(n===bh)return i.RED;if(n===jo)return i.RED_INTEGER;if(n===Eh)return i.RG;if(n===Qo)return i.RG_INTEGER;if(n===tc)return i.RGBA_INTEGER;if(n===ks||n===zs||n===Hs||n===Vs)if(a===ce)if(s=t.get("WEBGL_compressed_texture_s3tc_srgb"),s!==null){if(n===ks)return s.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===zs)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===Hs)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===Vs)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(s=t.get("WEBGL_compressed_texture_s3tc"),s!==null){if(n===ks)return s.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===zs)return s.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===Hs)return s.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===Vs)return s.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(n===ho||n===uo||n===fo||n===po)if(s=t.get("WEBGL_compressed_texture_pvrtc"),s!==null){if(n===ho)return s.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===uo)return s.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===fo)return s.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===po)return s.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(n===mo||n===go||n===vo)if(s=t.get("WEBGL_compressed_texture_etc"),s!==null){if(n===mo||n===go)return a===ce?s.COMPRESSED_SRGB8_ETC2:s.COMPRESSED_RGB8_ETC2;if(n===vo)return a===ce?s.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:s.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(n===_o||n===xo||n===Mo||n===So||n===yo||n===bo||n===Eo||n===To||n===wo||n===Ao||n===Ro||n===Co||n===Lo||n===Po)if(s=t.get("WEBGL_compressed_texture_astc"),s!==null){if(n===_o)return a===ce?s.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:s.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===xo)return a===ce?s.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:s.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===Mo)return a===ce?s.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:s.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===So)return a===ce?s.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:s.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===yo)return a===ce?s.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:s.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===bo)return a===ce?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:s.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===Eo)return a===ce?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:s.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===To)return a===ce?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:s.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===wo)return a===ce?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:s.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===Ao)return a===ce?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:s.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===Ro)return a===ce?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:s.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===Co)return a===ce?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:s.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===Lo)return a===ce?s.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:s.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===Po)return a===ce?s.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:s.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(n===Do||n===Io||n===Uo)if(s=t.get("EXT_texture_compression_bptc"),s!==null){if(n===Do)return a===ce?s.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:s.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===Io)return s.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===Uo)return s.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(n===No||n===Fo||n===Oo||n===Bo)if(s=t.get("EXT_texture_compression_rgtc"),s!==null){if(n===No)return s.COMPRESSED_RED_RGTC1_EXT;if(n===Fo)return s.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===Oo)return s.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===Bo)return s.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return n===Gr?i.UNSIGNED_INT_24_8:i[n]!==void 0?i[n]:null}return{convert:e}}const Kg=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,jg=`
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

}`;class Qg{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(t,e){if(this.texture===null){const n=new Hh(t.texture);(t.depthNear!==e.depthNear||t.depthFar!==e.depthFar)&&(this.depthNear=t.depthNear,this.depthFar=t.depthFar),this.texture=n}}getMesh(t){if(this.texture!==null&&this.mesh===null){const e=t.cameras[0].viewport,n=new qn({vertexShader:Kg,fragmentShader:jg,uniforms:{depthColor:{value:this.texture},depthWidth:{value:e.z},depthHeight:{value:e.w}}});this.mesh=new ee(new ts(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class tv extends xr{constructor(t,e){super();const n=this;let r=null,s=1,a=null,o="local-floor",c=1,l=null,h=null,u=null,d=null,f=null,m=null;const x=typeof XRWebGLBinding<"u",g=new Qg,p={},T=e.getContextAttributes();let y=null,M=null;const w=[],E=[],A=new St;let C=null;const v=new un;v.viewport=new de;const _=new un;_.viewport=new de;const S=[v,_],b=new Sp;let D=null,U=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(et){let ct=w[et];return ct===void 0&&(ct=new Ca,w[et]=ct),ct.getTargetRaySpace()},this.getControllerGrip=function(et){let ct=w[et];return ct===void 0&&(ct=new Ca,w[et]=ct),ct.getGripSpace()},this.getHand=function(et){let ct=w[et];return ct===void 0&&(ct=new Ca,w[et]=ct),ct.getHandSpace()};function N(et){const ct=E.indexOf(et.inputSource);if(ct===-1)return;const G=w[ct];G!==void 0&&(G.update(et.inputSource,et.frame,l||a),G.dispatchEvent({type:et.type,data:et.inputSource}))}function B(){r.removeEventListener("select",N),r.removeEventListener("selectstart",N),r.removeEventListener("selectend",N),r.removeEventListener("squeeze",N),r.removeEventListener("squeezestart",N),r.removeEventListener("squeezeend",N),r.removeEventListener("end",B),r.removeEventListener("inputsourceschange",Z);for(let et=0;et<w.length;et++){const ct=E[et];ct!==null&&(E[et]=null,w[et].disconnect(ct))}D=null,U=null,g.reset();for(const et in p)delete p[et];t.setRenderTarget(y),f=null,d=null,u=null,r=null,M=null,Vt.stop(),n.isPresenting=!1,t.setPixelRatio(C),t.setSize(A.width,A.height,!1),n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(et){s=et,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(et){o=et,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return l||a},this.setReferenceSpace=function(et){l=et},this.getBaseLayer=function(){return d!==null?d:f},this.getBinding=function(){return u===null&&x&&(u=new XRWebGLBinding(r,e)),u},this.getFrame=function(){return m},this.getSession=function(){return r},this.setSession=async function(et){if(r=et,r!==null){if(y=t.getRenderTarget(),r.addEventListener("select",N),r.addEventListener("selectstart",N),r.addEventListener("selectend",N),r.addEventListener("squeeze",N),r.addEventListener("squeezestart",N),r.addEventListener("squeezeend",N),r.addEventListener("end",B),r.addEventListener("inputsourceschange",Z),T.xrCompatible!==!0&&await e.makeXRCompatible(),C=t.getPixelRatio(),t.getSize(A),x&&"createProjectionLayer"in XRWebGLBinding.prototype){let G=null,q=null,k=null;T.depth&&(k=T.stencil?e.DEPTH24_STENCIL8:e.DEPTH_COMPONENT24,G=T.stencil?Xr:Wr,q=T.stencil?Gr:Di);const j={colorFormat:e.RGBA8,depthFormat:k,scaleFactor:s};u=this.getBinding(),d=u.createProjectionLayer(j),r.updateRenderState({layers:[d]}),t.setPixelRatio(1),t.setSize(d.textureWidth,d.textureHeight,!1),M=new Ui(d.textureWidth,d.textureHeight,{format:tn,type:Cn,depthTexture:new zh(d.textureWidth,d.textureHeight,q,void 0,void 0,void 0,void 0,void 0,void 0,G),stencilBuffer:T.stencil,colorSpace:t.outputColorSpace,samples:T.antialias?4:0,resolveDepthBuffer:d.ignoreDepthValues===!1,resolveStencilBuffer:d.ignoreDepthValues===!1})}else{const G={antialias:T.antialias,alpha:!0,depth:T.depth,stencil:T.stencil,framebufferScaleFactor:s};f=new XRWebGLLayer(r,e,G),r.updateRenderState({baseLayer:f}),t.setPixelRatio(1),t.setSize(f.framebufferWidth,f.framebufferHeight,!1),M=new Ui(f.framebufferWidth,f.framebufferHeight,{format:tn,type:Cn,colorSpace:t.outputColorSpace,stencilBuffer:T.stencil,resolveDepthBuffer:f.ignoreDepthValues===!1,resolveStencilBuffer:f.ignoreDepthValues===!1})}M.isXRRenderTarget=!0,this.setFoveation(c),l=null,a=await r.requestReferenceSpace(o),Vt.setContext(r),Vt.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(r!==null)return r.environmentBlendMode},this.getDepthTexture=function(){return g.getDepthTexture()};function Z(et){for(let ct=0;ct<et.removed.length;ct++){const G=et.removed[ct],q=E.indexOf(G);q>=0&&(E[q]=null,w[q].disconnect(G))}for(let ct=0;ct<et.added.length;ct++){const G=et.added[ct];let q=E.indexOf(G);if(q===-1){for(let j=0;j<w.length;j++)if(j>=E.length){E.push(G),q=j;break}else if(E[j]===null){E[j]=G,q=j;break}if(q===-1)break}const k=w[q];k&&k.connect(G)}}const H=new O,st=new O;function ht(et,ct,G){H.setFromMatrixPosition(ct.matrixWorld),st.setFromMatrixPosition(G.matrixWorld);const q=H.distanceTo(st),k=ct.projectionMatrix.elements,j=G.projectionMatrix.elements,tt=k[14]/(k[10]-1),P=k[14]/(k[10]+1),K=(k[9]+1)/k[5],F=(k[9]-1)/k[5],z=(k[8]-1)/k[0],W=(j[8]+1)/j[0],Q=tt*z,ot=tt*W,ut=q/(-z+W),Pt=ut*-z;if(ct.matrixWorld.decompose(et.position,et.quaternion,et.scale),et.translateX(Pt),et.translateZ(ut),et.matrixWorld.compose(et.position,et.quaternion,et.scale),et.matrixWorldInverse.copy(et.matrixWorld).invert(),k[10]===-1)et.projectionMatrix.copy(ct.projectionMatrix),et.projectionMatrixInverse.copy(ct.projectionMatrixInverse);else{const kt=tt+ut,I=P+ut,R=Q-Pt,Y=ot+(q-Pt),nt=K*P/I*kt,dt=F*P/I*kt;et.projectionMatrix.makePerspective(R,Y,nt,dt,kt,I),et.projectionMatrixInverse.copy(et.projectionMatrix).invert()}}function pt(et,ct){ct===null?et.matrixWorld.copy(et.matrix):et.matrixWorld.multiplyMatrices(ct.matrixWorld,et.matrix),et.matrixWorldInverse.copy(et.matrixWorld).invert()}this.updateCamera=function(et){if(r===null)return;let ct=et.near,G=et.far;g.texture!==null&&(g.depthNear>0&&(ct=g.depthNear),g.depthFar>0&&(G=g.depthFar)),b.near=_.near=v.near=ct,b.far=_.far=v.far=G,(D!==b.near||U!==b.far)&&(r.updateRenderState({depthNear:b.near,depthFar:b.far}),D=b.near,U=b.far),b.layers.mask=et.layers.mask|6,v.layers.mask=b.layers.mask&3,_.layers.mask=b.layers.mask&5;const q=et.parent,k=b.cameras;pt(b,q);for(let j=0;j<k.length;j++)pt(k[j],q);k.length===2?ht(b,v,_):b.projectionMatrix.copy(v.projectionMatrix),_t(et,b,q)};function _t(et,ct,G){G===null?et.matrix.copy(ct.matrixWorld):(et.matrix.copy(G.matrixWorld),et.matrix.invert(),et.matrix.multiply(ct.matrixWorld)),et.matrix.decompose(et.position,et.quaternion,et.scale),et.updateMatrixWorld(!0),et.projectionMatrix.copy(ct.projectionMatrix),et.projectionMatrixInverse.copy(ct.projectionMatrixInverse),et.isPerspectiveCamera&&(et.fov=qr*2*Math.atan(1/et.projectionMatrix.elements[5]),et.zoom=1)}this.getCamera=function(){return b},this.getFoveation=function(){if(!(d===null&&f===null))return c},this.setFoveation=function(et){c=et,d!==null&&(d.fixedFoveation=et),f!==null&&f.fixedFoveation!==void 0&&(f.fixedFoveation=et)},this.hasDepthSensing=function(){return g.texture!==null},this.getDepthSensingMesh=function(){return g.getMesh(b)},this.getCameraTexture=function(et){return p[et]};let Et=null;function zt(et,ct){if(h=ct.getViewerPose(l||a),m=ct,h!==null){const G=h.views;f!==null&&(t.setRenderTargetFramebuffer(M,f.framebuffer),t.setRenderTarget(M));let q=!1;G.length!==b.cameras.length&&(b.cameras.length=0,q=!0);for(let P=0;P<G.length;P++){const K=G[P];let F=null;if(f!==null)F=f.getViewport(K);else{const W=u.getViewSubImage(d,K);F=W.viewport,P===0&&(t.setRenderTargetTextures(M,W.colorTexture,W.depthStencilTexture),t.setRenderTarget(M))}let z=S[P];z===void 0&&(z=new un,z.layers.enable(P),z.viewport=new de,S[P]=z),z.matrix.fromArray(K.transform.matrix),z.matrix.decompose(z.position,z.quaternion,z.scale),z.projectionMatrix.fromArray(K.projectionMatrix),z.projectionMatrixInverse.copy(z.projectionMatrix).invert(),z.viewport.set(F.x,F.y,F.width,F.height),P===0&&(b.matrix.copy(z.matrix),b.matrix.decompose(b.position,b.quaternion,b.scale)),q===!0&&b.cameras.push(z)}const k=r.enabledFeatures;if(k&&k.includes("depth-sensing")&&r.depthUsage=="gpu-optimized"&&x){u=n.getBinding();const P=u.getDepthInformation(G[0]);P&&P.isValid&&P.texture&&g.init(P,r.renderState)}if(k&&k.includes("camera-access")&&x){t.state.unbindTexture(),u=n.getBinding();for(let P=0;P<G.length;P++){const K=G[P].camera;if(K){let F=p[K];F||(F=new Hh,p[K]=F);const z=u.getCameraImage(K);F.sourceTexture=z}}}}for(let G=0;G<w.length;G++){const q=E[G],k=w[G];q!==null&&k!==void 0&&k.update(q,ct,l||a)}Et&&Et(et,ct),ct.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:ct}),m=null}const Vt=new tu;Vt.setAnimationLoop(zt),this.setAnimationLoop=function(et){Et=et},this.dispose=function(){}}}const _i=new dn,ev=new ie;function nv(i,t){function e(g,p){g.matrixAutoUpdate===!0&&g.updateMatrix(),p.value.copy(g.matrix)}function n(g,p){p.color.getRGB(g.fogColor.value,Uh(i)),p.isFog?(g.fogNear.value=p.near,g.fogFar.value=p.far):p.isFogExp2&&(g.fogDensity.value=p.density)}function r(g,p,T,y,M){p.isMeshBasicMaterial||p.isMeshLambertMaterial?s(g,p):p.isMeshToonMaterial?(s(g,p),u(g,p)):p.isMeshPhongMaterial?(s(g,p),h(g,p)):p.isMeshStandardMaterial?(s(g,p),d(g,p),p.isMeshPhysicalMaterial&&f(g,p,M)):p.isMeshMatcapMaterial?(s(g,p),m(g,p)):p.isMeshDepthMaterial?s(g,p):p.isMeshDistanceMaterial?(s(g,p),x(g,p)):p.isMeshNormalMaterial?s(g,p):p.isLineBasicMaterial?(a(g,p),p.isLineDashedMaterial&&o(g,p)):p.isPointsMaterial?c(g,p,T,y):p.isSpriteMaterial?l(g,p):p.isShadowMaterial?(g.color.value.copy(p.color),g.opacity.value=p.opacity):p.isShaderMaterial&&(p.uniformsNeedUpdate=!1)}function s(g,p){g.opacity.value=p.opacity,p.color&&g.diffuse.value.copy(p.color),p.emissive&&g.emissive.value.copy(p.emissive).multiplyScalar(p.emissiveIntensity),p.map&&(g.map.value=p.map,e(p.map,g.mapTransform)),p.alphaMap&&(g.alphaMap.value=p.alphaMap,e(p.alphaMap,g.alphaMapTransform)),p.bumpMap&&(g.bumpMap.value=p.bumpMap,e(p.bumpMap,g.bumpMapTransform),g.bumpScale.value=p.bumpScale,p.side===$e&&(g.bumpScale.value*=-1)),p.normalMap&&(g.normalMap.value=p.normalMap,e(p.normalMap,g.normalMapTransform),g.normalScale.value.copy(p.normalScale),p.side===$e&&g.normalScale.value.negate()),p.displacementMap&&(g.displacementMap.value=p.displacementMap,e(p.displacementMap,g.displacementMapTransform),g.displacementScale.value=p.displacementScale,g.displacementBias.value=p.displacementBias),p.emissiveMap&&(g.emissiveMap.value=p.emissiveMap,e(p.emissiveMap,g.emissiveMapTransform)),p.specularMap&&(g.specularMap.value=p.specularMap,e(p.specularMap,g.specularMapTransform)),p.alphaTest>0&&(g.alphaTest.value=p.alphaTest);const T=t.get(p),y=T.envMap,M=T.envMapRotation;y&&(g.envMap.value=y,_i.copy(M),_i.x*=-1,_i.y*=-1,_i.z*=-1,y.isCubeTexture&&y.isRenderTargetTexture===!1&&(_i.y*=-1,_i.z*=-1),g.envMapRotation.value.setFromMatrix4(ev.makeRotationFromEuler(_i)),g.flipEnvMap.value=y.isCubeTexture&&y.isRenderTargetTexture===!1?-1:1,g.reflectivity.value=p.reflectivity,g.ior.value=p.ior,g.refractionRatio.value=p.refractionRatio),p.lightMap&&(g.lightMap.value=p.lightMap,g.lightMapIntensity.value=p.lightMapIntensity,e(p.lightMap,g.lightMapTransform)),p.aoMap&&(g.aoMap.value=p.aoMap,g.aoMapIntensity.value=p.aoMapIntensity,e(p.aoMap,g.aoMapTransform))}function a(g,p){g.diffuse.value.copy(p.color),g.opacity.value=p.opacity,p.map&&(g.map.value=p.map,e(p.map,g.mapTransform))}function o(g,p){g.dashSize.value=p.dashSize,g.totalSize.value=p.dashSize+p.gapSize,g.scale.value=p.scale}function c(g,p,T,y){g.diffuse.value.copy(p.color),g.opacity.value=p.opacity,g.size.value=p.size*T,g.scale.value=y*.5,p.map&&(g.map.value=p.map,e(p.map,g.uvTransform)),p.alphaMap&&(g.alphaMap.value=p.alphaMap,e(p.alphaMap,g.alphaMapTransform)),p.alphaTest>0&&(g.alphaTest.value=p.alphaTest)}function l(g,p){g.diffuse.value.copy(p.color),g.opacity.value=p.opacity,g.rotation.value=p.rotation,p.map&&(g.map.value=p.map,e(p.map,g.mapTransform)),p.alphaMap&&(g.alphaMap.value=p.alphaMap,e(p.alphaMap,g.alphaMapTransform)),p.alphaTest>0&&(g.alphaTest.value=p.alphaTest)}function h(g,p){g.specular.value.copy(p.specular),g.shininess.value=Math.max(p.shininess,1e-4)}function u(g,p){p.gradientMap&&(g.gradientMap.value=p.gradientMap)}function d(g,p){g.metalness.value=p.metalness,p.metalnessMap&&(g.metalnessMap.value=p.metalnessMap,e(p.metalnessMap,g.metalnessMapTransform)),g.roughness.value=p.roughness,p.roughnessMap&&(g.roughnessMap.value=p.roughnessMap,e(p.roughnessMap,g.roughnessMapTransform)),p.envMap&&(g.envMapIntensity.value=p.envMapIntensity)}function f(g,p,T){g.ior.value=p.ior,p.sheen>0&&(g.sheenColor.value.copy(p.sheenColor).multiplyScalar(p.sheen),g.sheenRoughness.value=p.sheenRoughness,p.sheenColorMap&&(g.sheenColorMap.value=p.sheenColorMap,e(p.sheenColorMap,g.sheenColorMapTransform)),p.sheenRoughnessMap&&(g.sheenRoughnessMap.value=p.sheenRoughnessMap,e(p.sheenRoughnessMap,g.sheenRoughnessMapTransform))),p.clearcoat>0&&(g.clearcoat.value=p.clearcoat,g.clearcoatRoughness.value=p.clearcoatRoughness,p.clearcoatMap&&(g.clearcoatMap.value=p.clearcoatMap,e(p.clearcoatMap,g.clearcoatMapTransform)),p.clearcoatRoughnessMap&&(g.clearcoatRoughnessMap.value=p.clearcoatRoughnessMap,e(p.clearcoatRoughnessMap,g.clearcoatRoughnessMapTransform)),p.clearcoatNormalMap&&(g.clearcoatNormalMap.value=p.clearcoatNormalMap,e(p.clearcoatNormalMap,g.clearcoatNormalMapTransform),g.clearcoatNormalScale.value.copy(p.clearcoatNormalScale),p.side===$e&&g.clearcoatNormalScale.value.negate())),p.dispersion>0&&(g.dispersion.value=p.dispersion),p.iridescence>0&&(g.iridescence.value=p.iridescence,g.iridescenceIOR.value=p.iridescenceIOR,g.iridescenceThicknessMinimum.value=p.iridescenceThicknessRange[0],g.iridescenceThicknessMaximum.value=p.iridescenceThicknessRange[1],p.iridescenceMap&&(g.iridescenceMap.value=p.iridescenceMap,e(p.iridescenceMap,g.iridescenceMapTransform)),p.iridescenceThicknessMap&&(g.iridescenceThicknessMap.value=p.iridescenceThicknessMap,e(p.iridescenceThicknessMap,g.iridescenceThicknessMapTransform))),p.transmission>0&&(g.transmission.value=p.transmission,g.transmissionSamplerMap.value=T.texture,g.transmissionSamplerSize.value.set(T.width,T.height),p.transmissionMap&&(g.transmissionMap.value=p.transmissionMap,e(p.transmissionMap,g.transmissionMapTransform)),g.thickness.value=p.thickness,p.thicknessMap&&(g.thicknessMap.value=p.thicknessMap,e(p.thicknessMap,g.thicknessMapTransform)),g.attenuationDistance.value=p.attenuationDistance,g.attenuationColor.value.copy(p.attenuationColor)),p.anisotropy>0&&(g.anisotropyVector.value.set(p.anisotropy*Math.cos(p.anisotropyRotation),p.anisotropy*Math.sin(p.anisotropyRotation)),p.anisotropyMap&&(g.anisotropyMap.value=p.anisotropyMap,e(p.anisotropyMap,g.anisotropyMapTransform))),g.specularIntensity.value=p.specularIntensity,g.specularColor.value.copy(p.specularColor),p.specularColorMap&&(g.specularColorMap.value=p.specularColorMap,e(p.specularColorMap,g.specularColorMapTransform)),p.specularIntensityMap&&(g.specularIntensityMap.value=p.specularIntensityMap,e(p.specularIntensityMap,g.specularIntensityMapTransform))}function m(g,p){p.matcap&&(g.matcap.value=p.matcap)}function x(g,p){const T=t.get(p).light;g.referencePosition.value.setFromMatrixPosition(T.matrixWorld),g.nearDistance.value=T.shadow.camera.near,g.farDistance.value=T.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:r}}function iv(i,t,e,n){let r={},s={},a=[];const o=i.getParameter(i.MAX_UNIFORM_BUFFER_BINDINGS);function c(T,y){const M=y.program;n.uniformBlockBinding(T,M)}function l(T,y){let M=r[T.id];M===void 0&&(m(T),M=h(T),r[T.id]=M,T.addEventListener("dispose",g));const w=y.program;n.updateUBOMapping(T,w);const E=t.render.frame;s[T.id]!==E&&(d(T),s[T.id]=E)}function h(T){const y=u();T.__bindingPointIndex=y;const M=i.createBuffer(),w=T.__size,E=T.usage;return i.bindBuffer(i.UNIFORM_BUFFER,M),i.bufferData(i.UNIFORM_BUFFER,w,E),i.bindBuffer(i.UNIFORM_BUFFER,null),i.bindBufferBase(i.UNIFORM_BUFFER,y,M),M}function u(){for(let T=0;T<o;T++)if(a.indexOf(T)===-1)return a.push(T),T;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function d(T){const y=r[T.id],M=T.uniforms,w=T.__cache;i.bindBuffer(i.UNIFORM_BUFFER,y);for(let E=0,A=M.length;E<A;E++){const C=Array.isArray(M[E])?M[E]:[M[E]];for(let v=0,_=C.length;v<_;v++){const S=C[v];if(f(S,E,v,w)===!0){const b=S.__offset,D=Array.isArray(S.value)?S.value:[S.value];let U=0;for(let N=0;N<D.length;N++){const B=D[N],Z=x(B);typeof B=="number"||typeof B=="boolean"?(S.__data[0]=B,i.bufferSubData(i.UNIFORM_BUFFER,b+U,S.__data)):B.isMatrix3?(S.__data[0]=B.elements[0],S.__data[1]=B.elements[1],S.__data[2]=B.elements[2],S.__data[3]=0,S.__data[4]=B.elements[3],S.__data[5]=B.elements[4],S.__data[6]=B.elements[5],S.__data[7]=0,S.__data[8]=B.elements[6],S.__data[9]=B.elements[7],S.__data[10]=B.elements[8],S.__data[11]=0):(B.toArray(S.__data,U),U+=Z.storage/Float32Array.BYTES_PER_ELEMENT)}i.bufferSubData(i.UNIFORM_BUFFER,b,S.__data)}}}i.bindBuffer(i.UNIFORM_BUFFER,null)}function f(T,y,M,w){const E=T.value,A=y+"_"+M;if(w[A]===void 0)return typeof E=="number"||typeof E=="boolean"?w[A]=E:w[A]=E.clone(),!0;{const C=w[A];if(typeof E=="number"||typeof E=="boolean"){if(C!==E)return w[A]=E,!0}else if(C.equals(E)===!1)return C.copy(E),!0}return!1}function m(T){const y=T.uniforms;let M=0;const w=16;for(let A=0,C=y.length;A<C;A++){const v=Array.isArray(y[A])?y[A]:[y[A]];for(let _=0,S=v.length;_<S;_++){const b=v[_],D=Array.isArray(b.value)?b.value:[b.value];for(let U=0,N=D.length;U<N;U++){const B=D[U],Z=x(B),H=M%w,st=H%Z.boundary,ht=H+st;M+=st,ht!==0&&w-ht<Z.storage&&(M+=w-ht),b.__data=new Float32Array(Z.storage/Float32Array.BYTES_PER_ELEMENT),b.__offset=M,M+=Z.storage}}}const E=M%w;return E>0&&(M+=w-E),T.__size=M,T.__cache={},this}function x(T){const y={boundary:0,storage:0};return typeof T=="number"||typeof T=="boolean"?(y.boundary=4,y.storage=4):T.isVector2?(y.boundary=8,y.storage=8):T.isVector3||T.isColor?(y.boundary=16,y.storage=12):T.isVector4?(y.boundary=16,y.storage=16):T.isMatrix3?(y.boundary=48,y.storage=48):T.isMatrix4?(y.boundary=64,y.storage=64):T.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",T),y}function g(T){const y=T.target;y.removeEventListener("dispose",g);const M=a.indexOf(y.__bindingPointIndex);a.splice(M,1),i.deleteBuffer(r[y.id]),delete r[y.id],delete s[y.id]}function p(){for(const T in r)i.deleteBuffer(r[T]);a=[],r={},s={}}return{bind:c,update:l,dispose:p}}class rv{constructor(t={}){const{canvas:e=nd(),context:n=null,depth:r=!0,stencil:s=!1,alpha:a=!1,antialias:o=!1,premultipliedAlpha:c=!0,preserveDrawingBuffer:l=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:u=!1,reversedDepthBuffer:d=!1}=t;this.isWebGLRenderer=!0;let f;if(n!==null){if(typeof WebGLRenderingContext<"u"&&n instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");f=n.getContextAttributes().alpha}else f=a;const m=new Uint32Array(4),x=new Int32Array(4);let g=null,p=null;const T=[],y=[];this.domElement=e,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=si,this.toneMappingExposure=1,this.transmissionResolutionScale=1;const M=this;let w=!1;this._outputColorSpace=Qe;let E=0,A=0,C=null,v=-1,_=null;const S=new de,b=new de;let D=null;const U=new Yt(0);let N=0,B=e.width,Z=e.height,H=1,st=null,ht=null;const pt=new de(0,0,B,Z),_t=new de(0,0,B,Z);let Et=!1;const zt=new rc;let Vt=!1,et=!1;const ct=new ie,G=new O,q=new de,k={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let j=!1;function tt(){return C===null?H:1}let P=n;function K(L,$){return e.getContext(L,$)}try{const L={alpha:!0,depth:r,stencil:s,antialias:o,premultipliedAlpha:c,preserveDrawingBuffer:l,powerPreference:h,failIfMajorPerformanceCaveat:u};if("setAttribute"in e&&e.setAttribute("data-engine",`three.js r${$o}`),e.addEventListener("webglcontextlost",yt,!1),e.addEventListener("webglcontextrestored",Lt,!1),e.addEventListener("webglcontextcreationerror",gt,!1),P===null){const $="webgl2";if(P=K($,L),P===null)throw K($)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(L){throw console.error("THREE.WebGLRenderer: "+L.message),L}let F,z,W,Q,ot,ut,Pt,kt,I,R,Y,nt,dt,at,Ft,Mt,It,Ut,mt,At,Xt,Ot,Tt,Zt;function V(){F=new pm(P),F.init(),Ot=new Zg(P,F),z=new om(P,F,t,Ot),W=new $g(P,F),z.reversedDepthBuffer&&d&&W.buffers.depth.setReversed(!0),Q=new vm(P),ot=new Ng,ut=new Jg(P,F,W,ot,z,Ot,Q),Pt=new lm(M),kt=new dm(M),I=new bp(P),Tt=new sm(P,I),R=new mm(P,I,Q,Tt),Y=new xm(P,R,I,Q),mt=new _m(P,z,ut),Mt=new cm(ot),nt=new Ug(M,Pt,kt,F,z,Tt,Mt),dt=new nv(M,ot),at=new Og,Ft=new Gg(F),Ut=new rm(M,Pt,kt,W,Y,f,c),It=new qg(M,Y,z),Zt=new iv(P,Q,z,W),At=new am(P,F,Q),Xt=new gm(P,F,Q),Q.programs=nt.programs,M.capabilities=z,M.extensions=F,M.properties=ot,M.renderLists=at,M.shadowMap=It,M.state=W,M.info=Q}V();const xt=new tv(M,P);this.xr=xt,this.getContext=function(){return P},this.getContextAttributes=function(){return P.getContextAttributes()},this.forceContextLoss=function(){const L=F.get("WEBGL_lose_context");L&&L.loseContext()},this.forceContextRestore=function(){const L=F.get("WEBGL_lose_context");L&&L.restoreContext()},this.getPixelRatio=function(){return H},this.setPixelRatio=function(L){L!==void 0&&(H=L,this.setSize(B,Z,!1))},this.getSize=function(L){return L.set(B,Z)},this.setSize=function(L,$,it=!0){if(xt.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}B=L,Z=$,e.width=Math.floor(L*H),e.height=Math.floor($*H),it===!0&&(e.style.width=L+"px",e.style.height=$+"px"),this.setViewport(0,0,L,$)},this.getDrawingBufferSize=function(L){return L.set(B*H,Z*H).floor()},this.setDrawingBufferSize=function(L,$,it){B=L,Z=$,H=it,e.width=Math.floor(L*it),e.height=Math.floor($*it),this.setViewport(0,0,L,$)},this.getCurrentViewport=function(L){return L.copy(S)},this.getViewport=function(L){return L.copy(pt)},this.setViewport=function(L,$,it,rt){L.isVector4?pt.set(L.x,L.y,L.z,L.w):pt.set(L,$,it,rt),W.viewport(S.copy(pt).multiplyScalar(H).round())},this.getScissor=function(L){return L.copy(_t)},this.setScissor=function(L,$,it,rt){L.isVector4?_t.set(L.x,L.y,L.z,L.w):_t.set(L,$,it,rt),W.scissor(b.copy(_t).multiplyScalar(H).round())},this.getScissorTest=function(){return Et},this.setScissorTest=function(L){W.setScissorTest(Et=L)},this.setOpaqueSort=function(L){st=L},this.setTransparentSort=function(L){ht=L},this.getClearColor=function(L){return L.copy(Ut.getClearColor())},this.setClearColor=function(){Ut.setClearColor(...arguments)},this.getClearAlpha=function(){return Ut.getClearAlpha()},this.setClearAlpha=function(){Ut.setClearAlpha(...arguments)},this.clear=function(L=!0,$=!0,it=!0){let rt=0;if(L){let J=!1;if(C!==null){const vt=C.texture.format;J=vt===tc||vt===Qo||vt===jo}if(J){const vt=C.texture.type,wt=vt===Cn||vt===Di||vt===Vr||vt===Gr||vt===Zo||vt===Ko,Dt=Ut.getClearColor(),Ct=Ut.getClearAlpha(),Wt=Dt.r,qt=Dt.g,Ht=Dt.b;wt?(m[0]=Wt,m[1]=qt,m[2]=Ht,m[3]=Ct,P.clearBufferuiv(P.COLOR,0,m)):(x[0]=Wt,x[1]=qt,x[2]=Ht,x[3]=Ct,P.clearBufferiv(P.COLOR,0,x))}else rt|=P.COLOR_BUFFER_BIT}$&&(rt|=P.DEPTH_BUFFER_BIT),it&&(rt|=P.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),P.clear(rt)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){e.removeEventListener("webglcontextlost",yt,!1),e.removeEventListener("webglcontextrestored",Lt,!1),e.removeEventListener("webglcontextcreationerror",gt,!1),Ut.dispose(),at.dispose(),Ft.dispose(),ot.dispose(),Pt.dispose(),kt.dispose(),Y.dispose(),Tt.dispose(),Zt.dispose(),nt.dispose(),xt.dispose(),xt.removeEventListener("sessionstart",Mn),xt.removeEventListener("sessionend",Sc),ui.stop()};function yt(L){L.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),w=!0}function Lt(){console.log("THREE.WebGLRenderer: Context Restored."),w=!1;const L=Q.autoReset,$=It.enabled,it=It.autoUpdate,rt=It.needsUpdate,J=It.type;V(),Q.autoReset=L,It.enabled=$,It.autoUpdate=it,It.needsUpdate=rt,It.type=J}function gt(L){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",L.statusMessage)}function ft(L){const $=L.target;$.removeEventListener("dispose",ft),Nt($)}function Nt(L){$t(L),ot.remove(L)}function $t(L){const $=ot.get(L).programs;$!==void 0&&($.forEach(function(it){nt.releaseProgram(it)}),L.isShaderMaterial&&nt.releaseShaderCache(L))}this.renderBufferDirect=function(L,$,it,rt,J,vt){$===null&&($=k);const wt=J.isMesh&&J.matrixWorld.determinant()<0,Dt=Uu(L,$,it,rt,J);W.setMaterial(rt,wt);let Ct=it.index,Wt=1;if(rt.wireframe===!0){if(Ct=R.getWireframeAttribute(it),Ct===void 0)return;Wt=2}const qt=it.drawRange,Ht=it.attributes.position;let ne=qt.start*Wt,oe=(qt.start+qt.count)*Wt;vt!==null&&(ne=Math.max(ne,vt.start*Wt),oe=Math.min(oe,(vt.start+vt.count)*Wt)),Ct!==null?(ne=Math.max(ne,0),oe=Math.min(oe,Ct.count)):Ht!=null&&(ne=Math.max(ne,0),oe=Math.min(oe,Ht.count));const Se=oe-ne;if(Se<0||Se===1/0)return;Tt.setup(J,rt,Dt,it,Ct);let pe,le=At;if(Ct!==null&&(pe=I.get(Ct),le=Xt,le.setIndex(pe)),J.isMesh)rt.wireframe===!0?(W.setLineWidth(rt.wireframeLinewidth*tt()),le.setMode(P.LINES)):le.setMode(P.TRIANGLES);else if(J.isLine){let Gt=rt.linewidth;Gt===void 0&&(Gt=1),W.setLineWidth(Gt*tt()),J.isLineSegments?le.setMode(P.LINES):J.isLineLoop?le.setMode(P.LINE_LOOP):le.setMode(P.LINE_STRIP)}else J.isPoints?le.setMode(P.POINTS):J.isSprite&&le.setMode(P.TRIANGLES);if(J.isBatchedMesh)if(J._multiDrawInstances!==null)Yr("THREE.WebGLRenderer: renderMultiDrawInstances has been deprecated and will be removed in r184. Append to renderMultiDraw arguments and use indirection."),le.renderMultiDrawInstances(J._multiDrawStarts,J._multiDrawCounts,J._multiDrawCount,J._multiDrawInstances);else if(F.get("WEBGL_multi_draw"))le.renderMultiDraw(J._multiDrawStarts,J._multiDrawCounts,J._multiDrawCount);else{const Gt=J._multiDrawStarts,ve=J._multiDrawCounts,re=J._multiDrawCount,Je=Ct?I.get(Ct).bytesPerElement:1,Bi=ot.get(rt).currentProgram.getUniforms();for(let Ze=0;Ze<re;Ze++)Bi.setValue(P,"_gl_DrawID",Ze),le.render(Gt[Ze]/Je,ve[Ze])}else if(J.isInstancedMesh)le.renderInstances(ne,Se,J.count);else if(it.isInstancedBufferGeometry){const Gt=it._maxInstanceCount!==void 0?it._maxInstanceCount:1/0,ve=Math.min(it.instanceCount,Gt);le.renderInstances(ne,Se,ve)}else le.render(ne,Se)};function ue(L,$,it){L.transparent===!0&&L.side===Tn&&L.forceSinglePass===!1?(L.side=$e,L.needsUpdate=!0,rs(L,$,it),L.side=ci,L.needsUpdate=!0,rs(L,$,it),L.side=Tn):rs(L,$,it)}this.compile=function(L,$,it=null){it===null&&(it=L),p=Ft.get(it),p.init($),y.push(p),it.traverseVisible(function(J){J.isLight&&J.layers.test($.layers)&&(p.pushLight(J),J.castShadow&&p.pushShadow(J))}),L!==it&&L.traverseVisible(function(J){J.isLight&&J.layers.test($.layers)&&(p.pushLight(J),J.castShadow&&p.pushShadow(J))}),p.setupLights();const rt=new Set;return L.traverse(function(J){if(!(J.isMesh||J.isPoints||J.isLine||J.isSprite))return;const vt=J.material;if(vt)if(Array.isArray(vt))for(let wt=0;wt<vt.length;wt++){const Dt=vt[wt];ue(Dt,it,J),rt.add(Dt)}else ue(vt,it,J),rt.add(vt)}),p=y.pop(),rt},this.compileAsync=function(L,$,it=null){const rt=this.compile(L,$,it);return new Promise(J=>{function vt(){if(rt.forEach(function(wt){ot.get(wt).currentProgram.isReady()&&rt.delete(wt)}),rt.size===0){J(L);return}setTimeout(vt,10)}F.get("KHR_parallel_shader_compile")!==null?vt():setTimeout(vt,10)})};let ae=null;function Pn(L){ae&&ae(L)}function Mn(){ui.stop()}function Sc(){ui.start()}const ui=new tu;ui.setAnimationLoop(Pn),typeof self<"u"&&ui.setContext(self),this.setAnimationLoop=function(L){ae=L,xt.setAnimationLoop(L),L===null?ui.stop():ui.start()},xt.addEventListener("sessionstart",Mn),xt.addEventListener("sessionend",Sc),this.render=function(L,$){if($!==void 0&&$.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(w===!0)return;if(L.matrixWorldAutoUpdate===!0&&L.updateMatrixWorld(),$.parent===null&&$.matrixWorldAutoUpdate===!0&&$.updateMatrixWorld(),xt.enabled===!0&&xt.isPresenting===!0&&(xt.cameraAutoUpdate===!0&&xt.updateCamera($),$=xt.getCamera()),L.isScene===!0&&L.onBeforeRender(M,L,$,C),p=Ft.get(L,y.length),p.init($),y.push(p),ct.multiplyMatrices($.projectionMatrix,$.matrixWorldInverse),zt.setFromProjectionMatrix(ct,Rn,$.reversedDepth),et=this.localClippingEnabled,Vt=Mt.init(this.clippingPlanes,et),g=at.get(L,T.length),g.init(),T.push(g),xt.enabled===!0&&xt.isPresenting===!0){const vt=M.xr.getDepthSensingMesh();vt!==null&&aa(vt,$,-1/0,M.sortObjects)}aa(L,$,0,M.sortObjects),g.finish(),M.sortObjects===!0&&g.sort(st,ht),j=xt.enabled===!1||xt.isPresenting===!1||xt.hasDepthSensing()===!1,j&&Ut.addToRenderList(g,L),this.info.render.frame++,Vt===!0&&Mt.beginShadows();const it=p.state.shadowsArray;It.render(it,L,$),Vt===!0&&Mt.endShadows(),this.info.autoReset===!0&&this.info.reset();const rt=g.opaque,J=g.transmissive;if(p.setupLights(),$.isArrayCamera){const vt=$.cameras;if(J.length>0)for(let wt=0,Dt=vt.length;wt<Dt;wt++){const Ct=vt[wt];bc(rt,J,L,Ct)}j&&Ut.render(L);for(let wt=0,Dt=vt.length;wt<Dt;wt++){const Ct=vt[wt];yc(g,L,Ct,Ct.viewport)}}else J.length>0&&bc(rt,J,L,$),j&&Ut.render(L),yc(g,L,$);C!==null&&A===0&&(ut.updateMultisampleRenderTarget(C),ut.updateRenderTargetMipmap(C)),L.isScene===!0&&L.onAfterRender(M,L,$),Tt.resetDefaultState(),v=-1,_=null,y.pop(),y.length>0?(p=y[y.length-1],Vt===!0&&Mt.setGlobalState(M.clippingPlanes,p.state.camera)):p=null,T.pop(),T.length>0?g=T[T.length-1]:g=null};function aa(L,$,it,rt){if(L.visible===!1)return;if(L.layers.test($.layers)){if(L.isGroup)it=L.renderOrder;else if(L.isLOD)L.autoUpdate===!0&&L.update($);else if(L.isLight)p.pushLight(L),L.castShadow&&p.pushShadow(L);else if(L.isSprite){if(!L.frustumCulled||zt.intersectsSprite(L)){rt&&q.setFromMatrixPosition(L.matrixWorld).applyMatrix4(ct);const wt=Y.update(L),Dt=L.material;Dt.visible&&g.push(L,wt,Dt,it,q.z,null)}}else if((L.isMesh||L.isLine||L.isPoints)&&(!L.frustumCulled||zt.intersectsObject(L))){const wt=Y.update(L),Dt=L.material;if(rt&&(L.boundingSphere!==void 0?(L.boundingSphere===null&&L.computeBoundingSphere(),q.copy(L.boundingSphere.center)):(wt.boundingSphere===null&&wt.computeBoundingSphere(),q.copy(wt.boundingSphere.center)),q.applyMatrix4(L.matrixWorld).applyMatrix4(ct)),Array.isArray(Dt)){const Ct=wt.groups;for(let Wt=0,qt=Ct.length;Wt<qt;Wt++){const Ht=Ct[Wt],ne=Dt[Ht.materialIndex];ne&&ne.visible&&g.push(L,wt,ne,it,q.z,Ht)}}else Dt.visible&&g.push(L,wt,Dt,it,q.z,null)}}const vt=L.children;for(let wt=0,Dt=vt.length;wt<Dt;wt++)aa(vt[wt],$,it,rt)}function yc(L,$,it,rt){const J=L.opaque,vt=L.transmissive,wt=L.transparent;p.setupLightsView(it),Vt===!0&&Mt.setGlobalState(M.clippingPlanes,it),rt&&W.viewport(S.copy(rt)),J.length>0&&is(J,$,it),vt.length>0&&is(vt,$,it),wt.length>0&&is(wt,$,it),W.buffers.depth.setTest(!0),W.buffers.depth.setMask(!0),W.buffers.color.setMask(!0),W.setPolygonOffset(!1)}function bc(L,$,it,rt){if((it.isScene===!0?it.overrideMaterial:null)!==null)return;p.state.transmissionRenderTarget[rt.id]===void 0&&(p.state.transmissionRenderTarget[rt.id]=new Ui(1,1,{generateMipmaps:!0,type:F.has("EXT_color_buffer_half_float")||F.has("EXT_color_buffer_float")?_r:Cn,minFilter:wi,samples:4,stencilBuffer:s,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:se.workingColorSpace}));const vt=p.state.transmissionRenderTarget[rt.id],wt=rt.viewport||S;vt.setSize(wt.z*M.transmissionResolutionScale,wt.w*M.transmissionResolutionScale);const Dt=M.getRenderTarget(),Ct=M.getActiveCubeFace(),Wt=M.getActiveMipmapLevel();M.setRenderTarget(vt),M.getClearColor(U),N=M.getClearAlpha(),N<1&&M.setClearColor(16777215,.5),M.clear(),j&&Ut.render(it);const qt=M.toneMapping;M.toneMapping=si;const Ht=rt.viewport;if(rt.viewport!==void 0&&(rt.viewport=void 0),p.setupLightsView(rt),Vt===!0&&Mt.setGlobalState(M.clippingPlanes,rt),is(L,it,rt),ut.updateMultisampleRenderTarget(vt),ut.updateRenderTargetMipmap(vt),F.has("WEBGL_multisampled_render_to_texture")===!1){let ne=!1;for(let oe=0,Se=$.length;oe<Se;oe++){const pe=$[oe],le=pe.object,Gt=pe.geometry,ve=pe.material,re=pe.group;if(ve.side===Tn&&le.layers.test(rt.layers)){const Je=ve.side;ve.side=$e,ve.needsUpdate=!0,Ec(le,it,rt,Gt,ve,re),ve.side=Je,ve.needsUpdate=!0,ne=!0}}ne===!0&&(ut.updateMultisampleRenderTarget(vt),ut.updateRenderTargetMipmap(vt))}M.setRenderTarget(Dt,Ct,Wt),M.setClearColor(U,N),Ht!==void 0&&(rt.viewport=Ht),M.toneMapping=qt}function is(L,$,it){const rt=$.isScene===!0?$.overrideMaterial:null;for(let J=0,vt=L.length;J<vt;J++){const wt=L[J],Dt=wt.object,Ct=wt.geometry,Wt=wt.group;let qt=wt.material;qt.allowOverride===!0&&rt!==null&&(qt=rt),Dt.layers.test(it.layers)&&Ec(Dt,$,it,Ct,qt,Wt)}}function Ec(L,$,it,rt,J,vt){L.onBeforeRender(M,$,it,rt,J,vt),L.modelViewMatrix.multiplyMatrices(it.matrixWorldInverse,L.matrixWorld),L.normalMatrix.getNormalMatrix(L.modelViewMatrix),J.onBeforeRender(M,$,it,rt,L,vt),J.transparent===!0&&J.side===Tn&&J.forceSinglePass===!1?(J.side=$e,J.needsUpdate=!0,M.renderBufferDirect(it,$,rt,J,L,vt),J.side=ci,J.needsUpdate=!0,M.renderBufferDirect(it,$,rt,J,L,vt),J.side=Tn):M.renderBufferDirect(it,$,rt,J,L,vt),L.onAfterRender(M,$,it,rt,J,vt)}function rs(L,$,it){$.isScene!==!0&&($=k);const rt=ot.get(L),J=p.state.lights,vt=p.state.shadowsArray,wt=J.state.version,Dt=nt.getParameters(L,J.state,vt,$,it),Ct=nt.getProgramCacheKey(Dt);let Wt=rt.programs;rt.environment=L.isMeshStandardMaterial?$.environment:null,rt.fog=$.fog,rt.envMap=(L.isMeshStandardMaterial?kt:Pt).get(L.envMap||rt.environment),rt.envMapRotation=rt.environment!==null&&L.envMap===null?$.environmentRotation:L.envMapRotation,Wt===void 0&&(L.addEventListener("dispose",ft),Wt=new Map,rt.programs=Wt);let qt=Wt.get(Ct);if(qt!==void 0){if(rt.currentProgram===qt&&rt.lightsStateVersion===wt)return wc(L,Dt),qt}else Dt.uniforms=nt.getUniforms(L),L.onBeforeCompile(Dt,M),qt=nt.acquireProgram(Dt,Ct),Wt.set(Ct,qt),rt.uniforms=Dt.uniforms;const Ht=rt.uniforms;return(!L.isShaderMaterial&&!L.isRawShaderMaterial||L.clipping===!0)&&(Ht.clippingPlanes=Mt.uniform),wc(L,Dt),rt.needsLights=Fu(L),rt.lightsStateVersion=wt,rt.needsLights&&(Ht.ambientLightColor.value=J.state.ambient,Ht.lightProbe.value=J.state.probe,Ht.directionalLights.value=J.state.directional,Ht.directionalLightShadows.value=J.state.directionalShadow,Ht.spotLights.value=J.state.spot,Ht.spotLightShadows.value=J.state.spotShadow,Ht.rectAreaLights.value=J.state.rectArea,Ht.ltc_1.value=J.state.rectAreaLTC1,Ht.ltc_2.value=J.state.rectAreaLTC2,Ht.pointLights.value=J.state.point,Ht.pointLightShadows.value=J.state.pointShadow,Ht.hemisphereLights.value=J.state.hemi,Ht.directionalShadowMap.value=J.state.directionalShadowMap,Ht.directionalShadowMatrix.value=J.state.directionalShadowMatrix,Ht.spotShadowMap.value=J.state.spotShadowMap,Ht.spotLightMatrix.value=J.state.spotLightMatrix,Ht.spotLightMap.value=J.state.spotLightMap,Ht.pointShadowMap.value=J.state.pointShadowMap,Ht.pointShadowMatrix.value=J.state.pointShadowMatrix),rt.currentProgram=qt,rt.uniformsList=null,qt}function Tc(L){if(L.uniformsList===null){const $=L.currentProgram.getUniforms();L.uniformsList=Gs.seqWithValue($.seq,L.uniforms)}return L.uniformsList}function wc(L,$){const it=ot.get(L);it.outputColorSpace=$.outputColorSpace,it.batching=$.batching,it.batchingColor=$.batchingColor,it.instancing=$.instancing,it.instancingColor=$.instancingColor,it.instancingMorph=$.instancingMorph,it.skinning=$.skinning,it.morphTargets=$.morphTargets,it.morphNormals=$.morphNormals,it.morphColors=$.morphColors,it.morphTargetsCount=$.morphTargetsCount,it.numClippingPlanes=$.numClippingPlanes,it.numIntersection=$.numClipIntersection,it.vertexAlphas=$.vertexAlphas,it.vertexTangents=$.vertexTangents,it.toneMapping=$.toneMapping}function Uu(L,$,it,rt,J){$.isScene!==!0&&($=k),ut.resetTextureUnits();const vt=$.fog,wt=rt.isMeshStandardMaterial?$.environment:null,Dt=C===null?M.outputColorSpace:C.isXRRenderTarget===!0?C.texture.colorSpace:Ii,Ct=(rt.isMeshStandardMaterial?kt:Pt).get(rt.envMap||wt),Wt=rt.vertexColors===!0&&!!it.attributes.color&&it.attributes.color.itemSize===4,qt=!!it.attributes.tangent&&(!!rt.normalMap||rt.anisotropy>0),Ht=!!it.morphAttributes.position,ne=!!it.morphAttributes.normal,oe=!!it.morphAttributes.color;let Se=si;rt.toneMapped&&(C===null||C.isXRRenderTarget===!0)&&(Se=M.toneMapping);const pe=it.morphAttributes.position||it.morphAttributes.normal||it.morphAttributes.color,le=pe!==void 0?pe.length:0,Gt=ot.get(rt),ve=p.state.lights;if(Vt===!0&&(et===!0||L!==_)){const Be=L===_&&rt.id===v;Mt.setState(rt,L,Be)}let re=!1;rt.version===Gt.__version?(Gt.needsLights&&Gt.lightsStateVersion!==ve.state.version||Gt.outputColorSpace!==Dt||J.isBatchedMesh&&Gt.batching===!1||!J.isBatchedMesh&&Gt.batching===!0||J.isBatchedMesh&&Gt.batchingColor===!0&&J.colorTexture===null||J.isBatchedMesh&&Gt.batchingColor===!1&&J.colorTexture!==null||J.isInstancedMesh&&Gt.instancing===!1||!J.isInstancedMesh&&Gt.instancing===!0||J.isSkinnedMesh&&Gt.skinning===!1||!J.isSkinnedMesh&&Gt.skinning===!0||J.isInstancedMesh&&Gt.instancingColor===!0&&J.instanceColor===null||J.isInstancedMesh&&Gt.instancingColor===!1&&J.instanceColor!==null||J.isInstancedMesh&&Gt.instancingMorph===!0&&J.morphTexture===null||J.isInstancedMesh&&Gt.instancingMorph===!1&&J.morphTexture!==null||Gt.envMap!==Ct||rt.fog===!0&&Gt.fog!==vt||Gt.numClippingPlanes!==void 0&&(Gt.numClippingPlanes!==Mt.numPlanes||Gt.numIntersection!==Mt.numIntersection)||Gt.vertexAlphas!==Wt||Gt.vertexTangents!==qt||Gt.morphTargets!==Ht||Gt.morphNormals!==ne||Gt.morphColors!==oe||Gt.toneMapping!==Se||Gt.morphTargetsCount!==le)&&(re=!0):(re=!0,Gt.__version=rt.version);let Je=Gt.currentProgram;re===!0&&(Je=rs(rt,$,J));let Bi=!1,Ze=!1,br=!1;const _e=Je.getUniforms(),rn=Gt.uniforms;if(W.useProgram(Je.program)&&(Bi=!0,Ze=!0,br=!0),rt.id!==v&&(v=rt.id,Ze=!0),Bi||_!==L){W.buffers.depth.getReversed()&&L.reversedDepth!==!0&&(L._reversedDepth=!0,L.updateProjectionMatrix()),_e.setValue(P,"projectionMatrix",L.projectionMatrix),_e.setValue(P,"viewMatrix",L.matrixWorldInverse);const qe=_e.map.cameraPosition;qe!==void 0&&qe.setValue(P,G.setFromMatrixPosition(L.matrixWorld)),z.logarithmicDepthBuffer&&_e.setValue(P,"logDepthBufFC",2/(Math.log(L.far+1)/Math.LN2)),(rt.isMeshPhongMaterial||rt.isMeshToonMaterial||rt.isMeshLambertMaterial||rt.isMeshBasicMaterial||rt.isMeshStandardMaterial||rt.isShaderMaterial)&&_e.setValue(P,"isOrthographic",L.isOrthographicCamera===!0),_!==L&&(_=L,Ze=!0,br=!0)}if(J.isSkinnedMesh){_e.setOptional(P,J,"bindMatrix"),_e.setOptional(P,J,"bindMatrixInverse");const Be=J.skeleton;Be&&(Be.boneTexture===null&&Be.computeBoneTexture(),_e.setValue(P,"boneTexture",Be.boneTexture,ut))}J.isBatchedMesh&&(_e.setOptional(P,J,"batchingTexture"),_e.setValue(P,"batchingTexture",J._matricesTexture,ut),_e.setOptional(P,J,"batchingIdTexture"),_e.setValue(P,"batchingIdTexture",J._indirectTexture,ut),_e.setOptional(P,J,"batchingColorTexture"),J._colorsTexture!==null&&_e.setValue(P,"batchingColorTexture",J._colorsTexture,ut));const sn=it.morphAttributes;if((sn.position!==void 0||sn.normal!==void 0||sn.color!==void 0)&&mt.update(J,it,Je),(Ze||Gt.receiveShadow!==J.receiveShadow)&&(Gt.receiveShadow=J.receiveShadow,_e.setValue(P,"receiveShadow",J.receiveShadow)),rt.isMeshGouraudMaterial&&rt.envMap!==null&&(rn.envMap.value=Ct,rn.flipEnvMap.value=Ct.isCubeTexture&&Ct.isRenderTargetTexture===!1?-1:1),rt.isMeshStandardMaterial&&rt.envMap===null&&$.environment!==null&&(rn.envMapIntensity.value=$.environmentIntensity),Ze&&(_e.setValue(P,"toneMappingExposure",M.toneMappingExposure),Gt.needsLights&&Nu(rn,br),vt&&rt.fog===!0&&dt.refreshFogUniforms(rn,vt),dt.refreshMaterialUniforms(rn,rt,H,Z,p.state.transmissionRenderTarget[L.id]),Gs.upload(P,Tc(Gt),rn,ut)),rt.isShaderMaterial&&rt.uniformsNeedUpdate===!0&&(Gs.upload(P,Tc(Gt),rn,ut),rt.uniformsNeedUpdate=!1),rt.isSpriteMaterial&&_e.setValue(P,"center",J.center),_e.setValue(P,"modelViewMatrix",J.modelViewMatrix),_e.setValue(P,"normalMatrix",J.normalMatrix),_e.setValue(P,"modelMatrix",J.matrixWorld),rt.isShaderMaterial||rt.isRawShaderMaterial){const Be=rt.uniformsGroups;for(let qe=0,oa=Be.length;qe<oa;qe++){const fi=Be[qe];Zt.update(fi,Je),Zt.bind(fi,Je)}}return Je}function Nu(L,$){L.ambientLightColor.needsUpdate=$,L.lightProbe.needsUpdate=$,L.directionalLights.needsUpdate=$,L.directionalLightShadows.needsUpdate=$,L.pointLights.needsUpdate=$,L.pointLightShadows.needsUpdate=$,L.spotLights.needsUpdate=$,L.spotLightShadows.needsUpdate=$,L.rectAreaLights.needsUpdate=$,L.hemisphereLights.needsUpdate=$}function Fu(L){return L.isMeshLambertMaterial||L.isMeshToonMaterial||L.isMeshPhongMaterial||L.isMeshStandardMaterial||L.isShadowMaterial||L.isShaderMaterial&&L.lights===!0}this.getActiveCubeFace=function(){return E},this.getActiveMipmapLevel=function(){return A},this.getRenderTarget=function(){return C},this.setRenderTargetTextures=function(L,$,it){const rt=ot.get(L);rt.__autoAllocateDepthBuffer=L.resolveDepthBuffer===!1,rt.__autoAllocateDepthBuffer===!1&&(rt.__useRenderToTexture=!1),ot.get(L.texture).__webglTexture=$,ot.get(L.depthTexture).__webglTexture=rt.__autoAllocateDepthBuffer?void 0:it,rt.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(L,$){const it=ot.get(L);it.__webglFramebuffer=$,it.__useDefaultFramebuffer=$===void 0};const Ou=P.createFramebuffer();this.setRenderTarget=function(L,$=0,it=0){C=L,E=$,A=it;let rt=!0,J=null,vt=!1,wt=!1;if(L){const Ct=ot.get(L);if(Ct.__useDefaultFramebuffer!==void 0)W.bindFramebuffer(P.FRAMEBUFFER,null),rt=!1;else if(Ct.__webglFramebuffer===void 0)ut.setupRenderTarget(L);else if(Ct.__hasExternalTextures)ut.rebindTextures(L,ot.get(L.texture).__webglTexture,ot.get(L.depthTexture).__webglTexture);else if(L.depthBuffer){const Ht=L.depthTexture;if(Ct.__boundDepthTexture!==Ht){if(Ht!==null&&ot.has(Ht)&&(L.width!==Ht.image.width||L.height!==Ht.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");ut.setupDepthRenderbuffer(L)}}const Wt=L.texture;(Wt.isData3DTexture||Wt.isDataArrayTexture||Wt.isCompressedArrayTexture)&&(wt=!0);const qt=ot.get(L).__webglFramebuffer;L.isWebGLCubeRenderTarget?(Array.isArray(qt[$])?J=qt[$][it]:J=qt[$],vt=!0):L.samples>0&&ut.useMultisampledRTT(L)===!1?J=ot.get(L).__webglMultisampledFramebuffer:Array.isArray(qt)?J=qt[it]:J=qt,S.copy(L.viewport),b.copy(L.scissor),D=L.scissorTest}else S.copy(pt).multiplyScalar(H).floor(),b.copy(_t).multiplyScalar(H).floor(),D=Et;if(it!==0&&(J=Ou),W.bindFramebuffer(P.FRAMEBUFFER,J)&&rt&&W.drawBuffers(L,J),W.viewport(S),W.scissor(b),W.setScissorTest(D),vt){const Ct=ot.get(L.texture);P.framebufferTexture2D(P.FRAMEBUFFER,P.COLOR_ATTACHMENT0,P.TEXTURE_CUBE_MAP_POSITIVE_X+$,Ct.__webglTexture,it)}else if(wt){const Ct=$;for(let Wt=0;Wt<L.textures.length;Wt++){const qt=ot.get(L.textures[Wt]);P.framebufferTextureLayer(P.FRAMEBUFFER,P.COLOR_ATTACHMENT0+Wt,qt.__webglTexture,it,Ct)}}else if(L!==null&&it!==0){const Ct=ot.get(L.texture);P.framebufferTexture2D(P.FRAMEBUFFER,P.COLOR_ATTACHMENT0,P.TEXTURE_2D,Ct.__webglTexture,it)}v=-1},this.readRenderTargetPixels=function(L,$,it,rt,J,vt,wt,Dt=0){if(!(L&&L.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Ct=ot.get(L).__webglFramebuffer;if(L.isWebGLCubeRenderTarget&&wt!==void 0&&(Ct=Ct[wt]),Ct){W.bindFramebuffer(P.FRAMEBUFFER,Ct);try{const Wt=L.textures[Dt],qt=Wt.format,Ht=Wt.type;if(!z.textureFormatReadable(qt)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!z.textureTypeReadable(Ht)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}$>=0&&$<=L.width-rt&&it>=0&&it<=L.height-J&&(L.textures.length>1&&P.readBuffer(P.COLOR_ATTACHMENT0+Dt),P.readPixels($,it,rt,J,Ot.convert(qt),Ot.convert(Ht),vt))}finally{const Wt=C!==null?ot.get(C).__webglFramebuffer:null;W.bindFramebuffer(P.FRAMEBUFFER,Wt)}}},this.readRenderTargetPixelsAsync=async function(L,$,it,rt,J,vt,wt,Dt=0){if(!(L&&L.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let Ct=ot.get(L).__webglFramebuffer;if(L.isWebGLCubeRenderTarget&&wt!==void 0&&(Ct=Ct[wt]),Ct)if($>=0&&$<=L.width-rt&&it>=0&&it<=L.height-J){W.bindFramebuffer(P.FRAMEBUFFER,Ct);const Wt=L.textures[Dt],qt=Wt.format,Ht=Wt.type;if(!z.textureFormatReadable(qt))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!z.textureTypeReadable(Ht))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");const ne=P.createBuffer();P.bindBuffer(P.PIXEL_PACK_BUFFER,ne),P.bufferData(P.PIXEL_PACK_BUFFER,vt.byteLength,P.STREAM_READ),L.textures.length>1&&P.readBuffer(P.COLOR_ATTACHMENT0+Dt),P.readPixels($,it,rt,J,Ot.convert(qt),Ot.convert(Ht),0);const oe=C!==null?ot.get(C).__webglFramebuffer:null;W.bindFramebuffer(P.FRAMEBUFFER,oe);const Se=P.fenceSync(P.SYNC_GPU_COMMANDS_COMPLETE,0);return P.flush(),await id(P,Se,4),P.bindBuffer(P.PIXEL_PACK_BUFFER,ne),P.getBufferSubData(P.PIXEL_PACK_BUFFER,0,vt),P.deleteBuffer(ne),P.deleteSync(Se),vt}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(L,$=null,it=0){const rt=Math.pow(2,-it),J=Math.floor(L.image.width*rt),vt=Math.floor(L.image.height*rt),wt=$!==null?$.x:0,Dt=$!==null?$.y:0;ut.setTexture2D(L,0),P.copyTexSubImage2D(P.TEXTURE_2D,it,0,0,wt,Dt,J,vt),W.unbindTexture()};const Bu=P.createFramebuffer(),ku=P.createFramebuffer();this.copyTextureToTexture=function(L,$,it=null,rt=null,J=0,vt=null){vt===null&&(J!==0?(Yr("WebGLRenderer: copyTextureToTexture function signature has changed to support src and dst mipmap levels."),vt=J,J=0):vt=0);let wt,Dt,Ct,Wt,qt,Ht,ne,oe,Se;const pe=L.isCompressedTexture?L.mipmaps[vt]:L.image;if(it!==null)wt=it.max.x-it.min.x,Dt=it.max.y-it.min.y,Ct=it.isBox3?it.max.z-it.min.z:1,Wt=it.min.x,qt=it.min.y,Ht=it.isBox3?it.min.z:0;else{const sn=Math.pow(2,-J);wt=Math.floor(pe.width*sn),Dt=Math.floor(pe.height*sn),L.isDataArrayTexture?Ct=pe.depth:L.isData3DTexture?Ct=Math.floor(pe.depth*sn):Ct=1,Wt=0,qt=0,Ht=0}rt!==null?(ne=rt.x,oe=rt.y,Se=rt.z):(ne=0,oe=0,Se=0);const le=Ot.convert($.format),Gt=Ot.convert($.type);let ve;$.isData3DTexture?(ut.setTexture3D($,0),ve=P.TEXTURE_3D):$.isDataArrayTexture||$.isCompressedArrayTexture?(ut.setTexture2DArray($,0),ve=P.TEXTURE_2D_ARRAY):(ut.setTexture2D($,0),ve=P.TEXTURE_2D),P.pixelStorei(P.UNPACK_FLIP_Y_WEBGL,$.flipY),P.pixelStorei(P.UNPACK_PREMULTIPLY_ALPHA_WEBGL,$.premultiplyAlpha),P.pixelStorei(P.UNPACK_ALIGNMENT,$.unpackAlignment);const re=P.getParameter(P.UNPACK_ROW_LENGTH),Je=P.getParameter(P.UNPACK_IMAGE_HEIGHT),Bi=P.getParameter(P.UNPACK_SKIP_PIXELS),Ze=P.getParameter(P.UNPACK_SKIP_ROWS),br=P.getParameter(P.UNPACK_SKIP_IMAGES);P.pixelStorei(P.UNPACK_ROW_LENGTH,pe.width),P.pixelStorei(P.UNPACK_IMAGE_HEIGHT,pe.height),P.pixelStorei(P.UNPACK_SKIP_PIXELS,Wt),P.pixelStorei(P.UNPACK_SKIP_ROWS,qt),P.pixelStorei(P.UNPACK_SKIP_IMAGES,Ht);const _e=L.isDataArrayTexture||L.isData3DTexture,rn=$.isDataArrayTexture||$.isData3DTexture;if(L.isDepthTexture){const sn=ot.get(L),Be=ot.get($),qe=ot.get(sn.__renderTarget),oa=ot.get(Be.__renderTarget);W.bindFramebuffer(P.READ_FRAMEBUFFER,qe.__webglFramebuffer),W.bindFramebuffer(P.DRAW_FRAMEBUFFER,oa.__webglFramebuffer);for(let fi=0;fi<Ct;fi++)_e&&(P.framebufferTextureLayer(P.READ_FRAMEBUFFER,P.COLOR_ATTACHMENT0,ot.get(L).__webglTexture,J,Ht+fi),P.framebufferTextureLayer(P.DRAW_FRAMEBUFFER,P.COLOR_ATTACHMENT0,ot.get($).__webglTexture,vt,Se+fi)),P.blitFramebuffer(Wt,qt,wt,Dt,ne,oe,wt,Dt,P.DEPTH_BUFFER_BIT,P.NEAREST);W.bindFramebuffer(P.READ_FRAMEBUFFER,null),W.bindFramebuffer(P.DRAW_FRAMEBUFFER,null)}else if(J!==0||L.isRenderTargetTexture||ot.has(L)){const sn=ot.get(L),Be=ot.get($);W.bindFramebuffer(P.READ_FRAMEBUFFER,Bu),W.bindFramebuffer(P.DRAW_FRAMEBUFFER,ku);for(let qe=0;qe<Ct;qe++)_e?P.framebufferTextureLayer(P.READ_FRAMEBUFFER,P.COLOR_ATTACHMENT0,sn.__webglTexture,J,Ht+qe):P.framebufferTexture2D(P.READ_FRAMEBUFFER,P.COLOR_ATTACHMENT0,P.TEXTURE_2D,sn.__webglTexture,J),rn?P.framebufferTextureLayer(P.DRAW_FRAMEBUFFER,P.COLOR_ATTACHMENT0,Be.__webglTexture,vt,Se+qe):P.framebufferTexture2D(P.DRAW_FRAMEBUFFER,P.COLOR_ATTACHMENT0,P.TEXTURE_2D,Be.__webglTexture,vt),J!==0?P.blitFramebuffer(Wt,qt,wt,Dt,ne,oe,wt,Dt,P.COLOR_BUFFER_BIT,P.NEAREST):rn?P.copyTexSubImage3D(ve,vt,ne,oe,Se+qe,Wt,qt,wt,Dt):P.copyTexSubImage2D(ve,vt,ne,oe,Wt,qt,wt,Dt);W.bindFramebuffer(P.READ_FRAMEBUFFER,null),W.bindFramebuffer(P.DRAW_FRAMEBUFFER,null)}else rn?L.isDataTexture||L.isData3DTexture?P.texSubImage3D(ve,vt,ne,oe,Se,wt,Dt,Ct,le,Gt,pe.data):$.isCompressedArrayTexture?P.compressedTexSubImage3D(ve,vt,ne,oe,Se,wt,Dt,Ct,le,pe.data):P.texSubImage3D(ve,vt,ne,oe,Se,wt,Dt,Ct,le,Gt,pe):L.isDataTexture?P.texSubImage2D(P.TEXTURE_2D,vt,ne,oe,wt,Dt,le,Gt,pe.data):L.isCompressedTexture?P.compressedTexSubImage2D(P.TEXTURE_2D,vt,ne,oe,pe.width,pe.height,le,pe.data):P.texSubImage2D(P.TEXTURE_2D,vt,ne,oe,wt,Dt,le,Gt,pe);P.pixelStorei(P.UNPACK_ROW_LENGTH,re),P.pixelStorei(P.UNPACK_IMAGE_HEIGHT,Je),P.pixelStorei(P.UNPACK_SKIP_PIXELS,Bi),P.pixelStorei(P.UNPACK_SKIP_ROWS,Ze),P.pixelStorei(P.UNPACK_SKIP_IMAGES,br),vt===0&&$.generateMipmaps&&P.generateMipmap(ve),W.unbindTexture()},this.initRenderTarget=function(L){ot.get(L).__webglFramebuffer===void 0&&ut.setupRenderTarget(L)},this.initTexture=function(L){L.isCubeTexture?ut.setTextureCube(L,0):L.isData3DTexture?ut.setTexture3D(L,0):L.isDataArrayTexture||L.isCompressedArrayTexture?ut.setTexture2DArray(L,0):ut.setTexture2D(L,0),W.unbindTexture()},this.resetState=function(){E=0,A=0,C=null,W.reset(),Tt.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return Rn}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(t){this._outputColorSpace=t;const e=this.getContext();e.drawingBufferColorSpace=se._getDrawingBufferColorSpace(t),e.unpackColorSpace=se._getUnpackColorSpace()}}const sv={armL:[.2,-1,0],forearmL:[.15,-1,.1],armR:[-.2,-1,0],forearmR:[-.15,-1,.1],thighL:[.05,-1,0],shinL:[0,-1,0],footL:[0,-.15,1],thighR:[-.05,-1,0],shinR:[0,-1,0],footR:[0,-.15,1]};function av(i,t){const e=i.scale??1,n=m=>new O(...i.dir?.[m]??sv[m]).normalize(),r=Array.from({length:ja},()=>new O),s=(m,x)=>r[m].copy(x),a=(m,x,g)=>new O(m,x,g).multiplyScalar(e);s(X.hipL,a(.1,0,0)),s(X.hipR,a(-.1,0,0)),s(X.shL,a(.19,.52,-.02)),s(X.shR,a(-.19,.52,-.02));const o=new We().setFromEuler(new dn(i.head?.[1]??0,i.head?.[0]??0,0,"YXZ")),c=a(0,.6,-.02),l=(m,x,g)=>a(m,x,g).applyQuaternion(o).add(c);s(X.nose,l(0,.1,.11)),s(X.eyeL,l(.032,.135,.09)),s(X.eyeR,l(-.032,.135,.09)),s(X.eyeInL,l(.018,.135,.095)),s(X.eyeInR,l(-.018,.135,.095)),s(X.eyeOutL,l(.05,.135,.08)),s(X.eyeOutR,l(-.05,.135,.08)),s(X.earL,l(.075,.12,0)),s(X.earR,l(-.075,.12,0)),s(X.mouthL,l(.024,.06,.095)),s(X.mouthR,l(-.024,.06,.095));for(const m of["L","R"]){const x=r[m==="L"?X.shL:X.shR],g=r[m==="L"?X.hipL:X.hipR],p=x.clone().addScaledVector(n(`arm${m}`),.29*e),T=p.clone().addScaledVector(n(`forearm${m}`),.26*e);s(m==="L"?X.elL:X.elR,p),s(m==="L"?X.wrL:X.wrR,T);const y=T.clone().addScaledVector(n(`forearm${m}`),.08*e);s(m==="L"?X.indexL:X.indexR,y.clone().add(a(0,0,.02))),s(m==="L"?X.pinkyL:X.pinkyR,y.clone().add(a(0,0,-.02))),s(m==="L"?X.thumbL:X.thumbR,T.clone().addScaledVector(n(`forearm${m}`),.04*e).add(a(0,0,.04)));const M=g.clone().addScaledVector(n(`thigh${m}`),.43*e),w=M.clone().addScaledVector(n(`shin${m}`),.42*e);s(m==="L"?X.knL:X.knR,M),s(m==="L"?X.anL:X.anR,w);const E=w.clone().add(a(0,-.04,-.05));s(m==="L"?X.heelL:X.heelR,E),s(m==="L"?X.toeL:X.toeR,E.clone().addScaledVector(n(`foot${m}`),.24*e))}const h=new We().setFromAxisAngle(new O(0,1,0),i.yaw??0),u=new Set([X.knL,X.knR,X.anL,X.anR,X.heelL,X.heelR,X.toeL,X.toeR]),d=[],f=[];for(let m=0;m<ja;m++){const x=r[m].clone().applyQuaternion(h),g=u.has(m)?i.legsVis??.98:.98;d.push({x:x.x,y:x.y,z:x.z,v:g});const p=Zu({x:x.x+i.T.x,y:x.y+i.T.y,z:x.z+i.T.z},t);f.push({x:p.x,y:p.y,z:0,v:g})}return{world:d,image:f}}function ov(i,t,e){const n=[];for(let r=0;r<i;r++){const s=t*1.3+r*2.1,a=(r-(i-1)/2)*.9+Math.sin(t*.4+r)*.15,o=Math.sin(s);n.push(av({T:{x:a,y:-.1+.03*Math.sin(s*2),z:-3-r*.6},yaw:Math.sin(t*.5+r)*.5,head:[Math.sin(t*.7+r)*.4,Math.sin(t*.9)*.15],dir:{armR:[-1,.3+.5*o,.1],forearmR:[-.3,1,.1+.3*o],armL:[.5+.4*Math.cos(s),-.8+.6*Math.cos(s*.5),.3],forearmL:[.2,-.3,1],thighL:[.12,-1,.25*Math.max(0,o)],shinL:[.05,-1,-.2*Math.max(0,o)]},scale:1-r*.08},e))}return n}function cv(i){const t=new Map,e=new Map,n=i.clone();return su(i,n,function(r,s){t.set(s,r),e.set(r,s)}),n.traverse(function(r){if(!r.isSkinnedMesh)return;const s=r,a=t.get(r),o=a.skeleton.bones;s.skeleton=a.skeleton.clone(),s.bindMatrix.copy(a.bindMatrix),s.skeleton.bones=o.map(function(c){return e.get(c)}),s.bind(s.skeleton,s.bindMatrix)}),n}function su(i,t,e){e(i,t);for(let n=0;n<i.children.length;n++)su(i.children[n],t.children[n],e)}class au extends ee{constructor(t,e,n=!1,r=!1,s=1e4){const a=new Le;super(a,e),this.isMarchingCubes=!0;const o=this,c=new Float32Array(36),l=new Float32Array(36),h=new Float32Array(36);this.enableUvs=n,this.enableColors=r,this.init=function(T){this.resolution=T,this.isolation=80,this.size=T,this.size2=this.size*this.size,this.size3=this.size2*this.size,this.halfsize=this.size/2,this.delta=2/this.size,this.yd=this.size,this.zd=this.size2,this.field=new Float32Array(this.size3),this.normal_cache=new Float32Array(this.size3*3),this.palette=new Float32Array(this.size3*3),this.count=0;const y=s*3;this.positionArray=new Float32Array(y*3);const M=new me(this.positionArray,3);M.setUsage(os),a.setAttribute("position",M),this.normalArray=new Float32Array(y*3);const w=new me(this.normalArray,3);if(w.setUsage(os),a.setAttribute("normal",w),this.enableUvs){this.uvArray=new Float32Array(y*2);const E=new me(this.uvArray,2);E.setUsage(os),a.setAttribute("uv",E)}if(this.enableColors){this.colorArray=new Float32Array(y*3);const E=new me(this.colorArray,3);E.setUsage(os),a.setAttribute("color",E)}a.boundingSphere=new Sr(new O,1)};function u(T,y,M){return T+(y-T)*M}function d(T,y,M,w,E,A,C,v,_,S){const b=(M-C)/(v-C),D=o.normal_cache;c[y+0]=w+b*o.delta,c[y+1]=E,c[y+2]=A,l[y+0]=u(D[T+0],D[T+3],b),l[y+1]=u(D[T+1],D[T+4],b),l[y+2]=u(D[T+2],D[T+5],b),h[y+0]=u(o.palette[_*3+0],o.palette[S*3+0],b),h[y+1]=u(o.palette[_*3+1],o.palette[S*3+1],b),h[y+2]=u(o.palette[_*3+2],o.palette[S*3+2],b)}function f(T,y,M,w,E,A,C,v,_,S){const b=(M-C)/(v-C),D=o.normal_cache;c[y+0]=w,c[y+1]=E+b*o.delta,c[y+2]=A;const U=T+o.yd*3;l[y+0]=u(D[T+0],D[U+0],b),l[y+1]=u(D[T+1],D[U+1],b),l[y+2]=u(D[T+2],D[U+2],b),h[y+0]=u(o.palette[_*3+0],o.palette[S*3+0],b),h[y+1]=u(o.palette[_*3+1],o.palette[S*3+1],b),h[y+2]=u(o.palette[_*3+2],o.palette[S*3+2],b)}function m(T,y,M,w,E,A,C,v,_,S){const b=(M-C)/(v-C),D=o.normal_cache;c[y+0]=w,c[y+1]=E,c[y+2]=A+b*o.delta;const U=T+o.zd*3;l[y+0]=u(D[T+0],D[U+0],b),l[y+1]=u(D[T+1],D[U+1],b),l[y+2]=u(D[T+2],D[U+2],b),h[y+0]=u(o.palette[_*3+0],o.palette[S*3+0],b),h[y+1]=u(o.palette[_*3+1],o.palette[S*3+1],b),h[y+2]=u(o.palette[_*3+2],o.palette[S*3+2],b)}function x(T){const y=T*3;o.normal_cache[y]===0&&(o.normal_cache[y+0]=o.field[T-1]-o.field[T+1],o.normal_cache[y+1]=o.field[T-o.yd]-o.field[T+o.yd],o.normal_cache[y+2]=o.field[T-o.zd]-o.field[T+o.zd])}function g(T,y,M,w,E){const A=w+1,C=w+o.yd,v=w+o.zd,_=A+o.yd,S=A+o.zd,b=w+o.yd+o.zd,D=A+o.yd+o.zd;let U=0;const N=o.field[w],B=o.field[A],Z=o.field[C],H=o.field[_],st=o.field[v],ht=o.field[S],pt=o.field[b],_t=o.field[D];N<E&&(U|=1),B<E&&(U|=2),Z<E&&(U|=8),H<E&&(U|=4),st<E&&(U|=16),ht<E&&(U|=32),pt<E&&(U|=128),_t<E&&(U|=64);const Et=lv[U];if(Et===0)return 0;const zt=o.delta,Vt=T+zt,et=y+zt,ct=M+zt;Et&1&&(x(w),x(A),d(w*3,0,E,T,y,M,N,B,w,A)),Et&2&&(x(A),x(_),f(A*3,3,E,Vt,y,M,B,H,A,_)),Et&4&&(x(C),x(_),d(C*3,6,E,T,et,M,Z,H,C,_)),Et&8&&(x(w),x(C),f(w*3,9,E,T,y,M,N,Z,w,C)),Et&16&&(x(v),x(S),d(v*3,12,E,T,y,ct,st,ht,v,S)),Et&32&&(x(S),x(D),f(S*3,15,E,Vt,y,ct,ht,_t,S,D)),Et&64&&(x(b),x(D),d(b*3,18,E,T,et,ct,pt,_t,b,D)),Et&128&&(x(v),x(b),f(v*3,21,E,T,y,ct,st,pt,v,b)),Et&256&&(x(w),x(v),m(w*3,24,E,T,y,M,N,st,w,v)),Et&512&&(x(A),x(S),m(A*3,27,E,Vt,y,M,B,ht,A,S)),Et&1024&&(x(_),x(D),m(_*3,30,E,Vt,et,M,H,_t,_,D)),Et&2048&&(x(C),x(b),m(C*3,33,E,T,et,M,Z,pt,C,b)),U<<=4;let G,q,k,j=0,tt=0;for(;Is[U+tt]!=-1;)G=U+tt,q=G+1,k=G+2,p(c,l,h,3*Is[G],3*Is[q],3*Is[k]),tt+=3,j++;return j}function p(T,y,M,w,E,A){const C=o.count*3;if(o.positionArray[C+0]=T[w],o.positionArray[C+1]=T[w+1],o.positionArray[C+2]=T[w+2],o.positionArray[C+3]=T[E],o.positionArray[C+4]=T[E+1],o.positionArray[C+5]=T[E+2],o.positionArray[C+6]=T[A],o.positionArray[C+7]=T[A+1],o.positionArray[C+8]=T[A+2],o.material.flatShading===!0){const v=(y[w+0]+y[E+0]+y[A+0])/3,_=(y[w+1]+y[E+1]+y[A+1])/3,S=(y[w+2]+y[E+2]+y[A+2])/3;o.normalArray[C+0]=v,o.normalArray[C+1]=_,o.normalArray[C+2]=S,o.normalArray[C+3]=v,o.normalArray[C+4]=_,o.normalArray[C+5]=S,o.normalArray[C+6]=v,o.normalArray[C+7]=_,o.normalArray[C+8]=S}else o.normalArray[C+0]=y[w+0],o.normalArray[C+1]=y[w+1],o.normalArray[C+2]=y[w+2],o.normalArray[C+3]=y[E+0],o.normalArray[C+4]=y[E+1],o.normalArray[C+5]=y[E+2],o.normalArray[C+6]=y[A+0],o.normalArray[C+7]=y[A+1],o.normalArray[C+8]=y[A+2];if(o.enableUvs){const v=o.count*2;o.uvArray[v+0]=T[w+0],o.uvArray[v+1]=T[w+2],o.uvArray[v+2]=T[E+0],o.uvArray[v+3]=T[E+2],o.uvArray[v+4]=T[A+0],o.uvArray[v+5]=T[A+2]}o.enableColors&&(o.colorArray[C+0]=M[w+0],o.colorArray[C+1]=M[w+1],o.colorArray[C+2]=M[w+2],o.colorArray[C+3]=M[E+0],o.colorArray[C+4]=M[E+1],o.colorArray[C+5]=M[E+2],o.colorArray[C+6]=M[A+0],o.colorArray[C+7]=M[A+1],o.colorArray[C+8]=M[A+2]),o.count+=3}this.addBall=function(T,y,M,w,E,A){const C=Math.sign(w);w=Math.abs(w);const v=A!=null;let _=new Yt(T,y,M);if(v)try{_=A instanceof Yt?A:Array.isArray(A)?new Yt(Math.min(Math.abs(A[0]),1),Math.min(Math.abs(A[1]),1),Math.min(Math.abs(A[2]),1)):new Yt(A)}catch{_=new Yt(T,y,M)}const S=this.size*Math.sqrt(w/E),b=M*this.size,D=y*this.size,U=T*this.size;let N=Math.floor(b-S);N<1&&(N=1);let B=Math.floor(b+S);B>this.size-1&&(B=this.size-1);let Z=Math.floor(D-S);Z<1&&(Z=1);let H=Math.floor(D+S);H>this.size-1&&(H=this.size-1);let st=Math.floor(U-S);st<1&&(st=1);let ht=Math.floor(U+S);ht>this.size-1&&(ht=this.size-1);let pt,_t,Et,zt,Vt,et,ct,G,q,k,j;for(Et=N;Et<B;Et++)for(Vt=this.size2*Et,G=Et/this.size-M,q=G*G,_t=Z;_t<H;_t++)for(zt=Vt+this.size*_t,ct=_t/this.size-y,k=ct*ct,pt=st;pt<ht;pt++)if(et=pt/this.size-T,j=w/(1e-6+et*et+k+q)-E,j>0){this.field[zt+pt]+=j*C;const tt=Math.sqrt((pt-U)*(pt-U)+(_t-D)*(_t-D)+(Et-b)*(Et-b))/S,P=1-tt*tt*tt*(tt*(tt*6-15)+10);this.palette[(zt+pt)*3+0]+=_.r*P,this.palette[(zt+pt)*3+1]+=_.g*P,this.palette[(zt+pt)*3+2]+=_.b*P}},this.addPlaneX=function(T,y){const M=this.size,w=this.yd,E=this.zd,A=this.field;let C,v,_,S,b,D,U,N=M*Math.sqrt(T/y);for(N>M&&(N=M),C=0;C<N;C++)if(D=C/M,S=D*D,b=T/(1e-4+S)-y,b>0)for(v=0;v<M;v++)for(U=C+v*w,_=0;_<M;_++)A[E*_+U]+=b},this.addPlaneY=function(T,y){const M=this.size,w=this.yd,E=this.zd,A=this.field;let C,v,_,S,b,D,U,N,B=M*Math.sqrt(T/y);for(B>M&&(B=M),v=0;v<B;v++)if(D=v/M,S=D*D,b=T/(1e-4+S)-y,b>0)for(U=v*w,C=0;C<M;C++)for(N=U+C,_=0;_<M;_++)A[E*_+N]+=b},this.addPlaneZ=function(T,y){const M=this.size,w=this.yd,E=this.zd,A=this.field;let C,v,_,S,b,D,U,N,B=M*Math.sqrt(T/y);for(B>M&&(B=M),_=0;_<B;_++)if(D=_/M,S=D*D,b=T/(1e-4+S)-y,b>0)for(U=E*_,v=0;v<M;v++)for(N=U+v*w,C=0;C<M;C++)A[N+C]+=b},this.setCell=function(T,y,M,w){const E=this.size2*M+this.size*y+T;this.field[E]=w},this.getCell=function(T,y,M){const w=this.size2*M+this.size*y+T;return this.field[w]},this.blur=function(T=1){const y=this.field,M=y.slice(),w=this.size,E=this.size2;for(let A=0;A<w;A++)for(let C=0;C<w;C++)for(let v=0;v<w;v++){const _=E*v+w*C+A;let S=M[_],b=1;for(let D=-1;D<=1;D+=2){const U=D+A;if(!(U<0||U>=w))for(let N=-1;N<=1;N+=2){const B=N+C;if(!(B<0||B>=w))for(let Z=-1;Z<=1;Z+=2){const H=Z+v;if(H<0||H>=w)continue;const st=E*H+w*B+U,ht=M[st];b++,S+=T*(ht-S)/b}}}y[_]=S}},this.reset=function(){for(let T=0;T<this.size3;T++)this.normal_cache[T*3]=0,this.field[T]=0,this.palette[T*3]=this.palette[T*3+1]=this.palette[T*3+2]=0},this.update=function(){this.count=0;const T=this.size-2;for(let y=1;y<T;y++){const M=this.size2*y,w=(y-this.halfsize)/this.halfsize;for(let E=1;E<T;E++){const A=M+this.size*E,C=(E-this.halfsize)/this.halfsize;for(let v=1;v<T;v++){const _=(v-this.halfsize)/this.halfsize,S=A+v;g(_,C,w,S,this.isolation)}}}this.geometry.setDrawRange(0,this.count),a.getAttribute("position").needsUpdate=!0,a.getAttribute("normal").needsUpdate=!0,this.enableUvs&&(a.getAttribute("uv").needsUpdate=!0),this.enableColors&&(a.getAttribute("color").needsUpdate=!0),this.count/3>s&&console.warn("THREE.MarchingCubes: Geometry buffers too small for rendering. Please create an instance with a higher poly count.")},this.init(t)}}const lv=new Int32Array([0,265,515,778,1030,1295,1541,1804,2060,2309,2575,2822,3082,3331,3593,3840,400,153,915,666,1430,1183,1941,1692,2460,2197,2975,2710,3482,3219,3993,3728,560,825,51,314,1590,1855,1077,1340,2620,2869,2111,2358,3642,3891,3129,3376,928,681,419,170,1958,1711,1445,1196,2988,2725,2479,2214,4010,3747,3497,3232,1120,1385,1635,1898,102,367,613,876,3180,3429,3695,3942,2154,2403,2665,2912,1520,1273,2035,1786,502,255,1013,764,3580,3317,4095,3830,2554,2291,3065,2800,1616,1881,1107,1370,598,863,85,348,3676,3925,3167,3414,2650,2899,2137,2384,1984,1737,1475,1226,966,719,453,204,4044,3781,3535,3270,3018,2755,2505,2240,2240,2505,2755,3018,3270,3535,3781,4044,204,453,719,966,1226,1475,1737,1984,2384,2137,2899,2650,3414,3167,3925,3676,348,85,863,598,1370,1107,1881,1616,2800,3065,2291,2554,3830,4095,3317,3580,764,1013,255,502,1786,2035,1273,1520,2912,2665,2403,2154,3942,3695,3429,3180,876,613,367,102,1898,1635,1385,1120,3232,3497,3747,4010,2214,2479,2725,2988,1196,1445,1711,1958,170,419,681,928,3376,3129,3891,3642,2358,2111,2869,2620,1340,1077,1855,1590,314,51,825,560,3728,3993,3219,3482,2710,2975,2197,2460,1692,1941,1183,1430,666,915,153,400,3840,3593,3331,3082,2822,2575,2309,2060,1804,1541,1295,1030,778,515,265,0]),Is=new Int32Array([-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,8,3,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,1,9,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,1,8,3,9,8,1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,1,2,10,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,8,3,1,2,10,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,9,2,10,0,2,9,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,2,8,3,2,10,8,10,9,8,-1,-1,-1,-1,-1,-1,-1,3,11,2,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,11,2,8,11,0,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,1,9,0,2,3,11,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,1,11,2,1,9,11,9,8,11,-1,-1,-1,-1,-1,-1,-1,3,10,1,11,10,3,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,10,1,0,8,10,8,11,10,-1,-1,-1,-1,-1,-1,-1,3,9,0,3,11,9,11,10,9,-1,-1,-1,-1,-1,-1,-1,9,8,10,10,8,11,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,4,7,8,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,4,3,0,7,3,4,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,1,9,8,4,7,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,4,1,9,4,7,1,7,3,1,-1,-1,-1,-1,-1,-1,-1,1,2,10,8,4,7,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,3,4,7,3,0,4,1,2,10,-1,-1,-1,-1,-1,-1,-1,9,2,10,9,0,2,8,4,7,-1,-1,-1,-1,-1,-1,-1,2,10,9,2,9,7,2,7,3,7,9,4,-1,-1,-1,-1,8,4,7,3,11,2,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,11,4,7,11,2,4,2,0,4,-1,-1,-1,-1,-1,-1,-1,9,0,1,8,4,7,2,3,11,-1,-1,-1,-1,-1,-1,-1,4,7,11,9,4,11,9,11,2,9,2,1,-1,-1,-1,-1,3,10,1,3,11,10,7,8,4,-1,-1,-1,-1,-1,-1,-1,1,11,10,1,4,11,1,0,4,7,11,4,-1,-1,-1,-1,4,7,8,9,0,11,9,11,10,11,0,3,-1,-1,-1,-1,4,7,11,4,11,9,9,11,10,-1,-1,-1,-1,-1,-1,-1,9,5,4,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,9,5,4,0,8,3,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,5,4,1,5,0,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,8,5,4,8,3,5,3,1,5,-1,-1,-1,-1,-1,-1,-1,1,2,10,9,5,4,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,3,0,8,1,2,10,4,9,5,-1,-1,-1,-1,-1,-1,-1,5,2,10,5,4,2,4,0,2,-1,-1,-1,-1,-1,-1,-1,2,10,5,3,2,5,3,5,4,3,4,8,-1,-1,-1,-1,9,5,4,2,3,11,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,11,2,0,8,11,4,9,5,-1,-1,-1,-1,-1,-1,-1,0,5,4,0,1,5,2,3,11,-1,-1,-1,-1,-1,-1,-1,2,1,5,2,5,8,2,8,11,4,8,5,-1,-1,-1,-1,10,3,11,10,1,3,9,5,4,-1,-1,-1,-1,-1,-1,-1,4,9,5,0,8,1,8,10,1,8,11,10,-1,-1,-1,-1,5,4,0,5,0,11,5,11,10,11,0,3,-1,-1,-1,-1,5,4,8,5,8,10,10,8,11,-1,-1,-1,-1,-1,-1,-1,9,7,8,5,7,9,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,9,3,0,9,5,3,5,7,3,-1,-1,-1,-1,-1,-1,-1,0,7,8,0,1,7,1,5,7,-1,-1,-1,-1,-1,-1,-1,1,5,3,3,5,7,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,9,7,8,9,5,7,10,1,2,-1,-1,-1,-1,-1,-1,-1,10,1,2,9,5,0,5,3,0,5,7,3,-1,-1,-1,-1,8,0,2,8,2,5,8,5,7,10,5,2,-1,-1,-1,-1,2,10,5,2,5,3,3,5,7,-1,-1,-1,-1,-1,-1,-1,7,9,5,7,8,9,3,11,2,-1,-1,-1,-1,-1,-1,-1,9,5,7,9,7,2,9,2,0,2,7,11,-1,-1,-1,-1,2,3,11,0,1,8,1,7,8,1,5,7,-1,-1,-1,-1,11,2,1,11,1,7,7,1,5,-1,-1,-1,-1,-1,-1,-1,9,5,8,8,5,7,10,1,3,10,3,11,-1,-1,-1,-1,5,7,0,5,0,9,7,11,0,1,0,10,11,10,0,-1,11,10,0,11,0,3,10,5,0,8,0,7,5,7,0,-1,11,10,5,7,11,5,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,10,6,5,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,8,3,5,10,6,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,9,0,1,5,10,6,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,1,8,3,1,9,8,5,10,6,-1,-1,-1,-1,-1,-1,-1,1,6,5,2,6,1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,1,6,5,1,2,6,3,0,8,-1,-1,-1,-1,-1,-1,-1,9,6,5,9,0,6,0,2,6,-1,-1,-1,-1,-1,-1,-1,5,9,8,5,8,2,5,2,6,3,2,8,-1,-1,-1,-1,2,3,11,10,6,5,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,11,0,8,11,2,0,10,6,5,-1,-1,-1,-1,-1,-1,-1,0,1,9,2,3,11,5,10,6,-1,-1,-1,-1,-1,-1,-1,5,10,6,1,9,2,9,11,2,9,8,11,-1,-1,-1,-1,6,3,11,6,5,3,5,1,3,-1,-1,-1,-1,-1,-1,-1,0,8,11,0,11,5,0,5,1,5,11,6,-1,-1,-1,-1,3,11,6,0,3,6,0,6,5,0,5,9,-1,-1,-1,-1,6,5,9,6,9,11,11,9,8,-1,-1,-1,-1,-1,-1,-1,5,10,6,4,7,8,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,4,3,0,4,7,3,6,5,10,-1,-1,-1,-1,-1,-1,-1,1,9,0,5,10,6,8,4,7,-1,-1,-1,-1,-1,-1,-1,10,6,5,1,9,7,1,7,3,7,9,4,-1,-1,-1,-1,6,1,2,6,5,1,4,7,8,-1,-1,-1,-1,-1,-1,-1,1,2,5,5,2,6,3,0,4,3,4,7,-1,-1,-1,-1,8,4,7,9,0,5,0,6,5,0,2,6,-1,-1,-1,-1,7,3,9,7,9,4,3,2,9,5,9,6,2,6,9,-1,3,11,2,7,8,4,10,6,5,-1,-1,-1,-1,-1,-1,-1,5,10,6,4,7,2,4,2,0,2,7,11,-1,-1,-1,-1,0,1,9,4,7,8,2,3,11,5,10,6,-1,-1,-1,-1,9,2,1,9,11,2,9,4,11,7,11,4,5,10,6,-1,8,4,7,3,11,5,3,5,1,5,11,6,-1,-1,-1,-1,5,1,11,5,11,6,1,0,11,7,11,4,0,4,11,-1,0,5,9,0,6,5,0,3,6,11,6,3,8,4,7,-1,6,5,9,6,9,11,4,7,9,7,11,9,-1,-1,-1,-1,10,4,9,6,4,10,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,4,10,6,4,9,10,0,8,3,-1,-1,-1,-1,-1,-1,-1,10,0,1,10,6,0,6,4,0,-1,-1,-1,-1,-1,-1,-1,8,3,1,8,1,6,8,6,4,6,1,10,-1,-1,-1,-1,1,4,9,1,2,4,2,6,4,-1,-1,-1,-1,-1,-1,-1,3,0,8,1,2,9,2,4,9,2,6,4,-1,-1,-1,-1,0,2,4,4,2,6,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,8,3,2,8,2,4,4,2,6,-1,-1,-1,-1,-1,-1,-1,10,4,9,10,6,4,11,2,3,-1,-1,-1,-1,-1,-1,-1,0,8,2,2,8,11,4,9,10,4,10,6,-1,-1,-1,-1,3,11,2,0,1,6,0,6,4,6,1,10,-1,-1,-1,-1,6,4,1,6,1,10,4,8,1,2,1,11,8,11,1,-1,9,6,4,9,3,6,9,1,3,11,6,3,-1,-1,-1,-1,8,11,1,8,1,0,11,6,1,9,1,4,6,4,1,-1,3,11,6,3,6,0,0,6,4,-1,-1,-1,-1,-1,-1,-1,6,4,8,11,6,8,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,7,10,6,7,8,10,8,9,10,-1,-1,-1,-1,-1,-1,-1,0,7,3,0,10,7,0,9,10,6,7,10,-1,-1,-1,-1,10,6,7,1,10,7,1,7,8,1,8,0,-1,-1,-1,-1,10,6,7,10,7,1,1,7,3,-1,-1,-1,-1,-1,-1,-1,1,2,6,1,6,8,1,8,9,8,6,7,-1,-1,-1,-1,2,6,9,2,9,1,6,7,9,0,9,3,7,3,9,-1,7,8,0,7,0,6,6,0,2,-1,-1,-1,-1,-1,-1,-1,7,3,2,6,7,2,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,2,3,11,10,6,8,10,8,9,8,6,7,-1,-1,-1,-1,2,0,7,2,7,11,0,9,7,6,7,10,9,10,7,-1,1,8,0,1,7,8,1,10,7,6,7,10,2,3,11,-1,11,2,1,11,1,7,10,6,1,6,7,1,-1,-1,-1,-1,8,9,6,8,6,7,9,1,6,11,6,3,1,3,6,-1,0,9,1,11,6,7,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,7,8,0,7,0,6,3,11,0,11,6,0,-1,-1,-1,-1,7,11,6,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,7,6,11,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,3,0,8,11,7,6,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,1,9,11,7,6,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,8,1,9,8,3,1,11,7,6,-1,-1,-1,-1,-1,-1,-1,10,1,2,6,11,7,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,1,2,10,3,0,8,6,11,7,-1,-1,-1,-1,-1,-1,-1,2,9,0,2,10,9,6,11,7,-1,-1,-1,-1,-1,-1,-1,6,11,7,2,10,3,10,8,3,10,9,8,-1,-1,-1,-1,7,2,3,6,2,7,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,7,0,8,7,6,0,6,2,0,-1,-1,-1,-1,-1,-1,-1,2,7,6,2,3,7,0,1,9,-1,-1,-1,-1,-1,-1,-1,1,6,2,1,8,6,1,9,8,8,7,6,-1,-1,-1,-1,10,7,6,10,1,7,1,3,7,-1,-1,-1,-1,-1,-1,-1,10,7,6,1,7,10,1,8,7,1,0,8,-1,-1,-1,-1,0,3,7,0,7,10,0,10,9,6,10,7,-1,-1,-1,-1,7,6,10,7,10,8,8,10,9,-1,-1,-1,-1,-1,-1,-1,6,8,4,11,8,6,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,3,6,11,3,0,6,0,4,6,-1,-1,-1,-1,-1,-1,-1,8,6,11,8,4,6,9,0,1,-1,-1,-1,-1,-1,-1,-1,9,4,6,9,6,3,9,3,1,11,3,6,-1,-1,-1,-1,6,8,4,6,11,8,2,10,1,-1,-1,-1,-1,-1,-1,-1,1,2,10,3,0,11,0,6,11,0,4,6,-1,-1,-1,-1,4,11,8,4,6,11,0,2,9,2,10,9,-1,-1,-1,-1,10,9,3,10,3,2,9,4,3,11,3,6,4,6,3,-1,8,2,3,8,4,2,4,6,2,-1,-1,-1,-1,-1,-1,-1,0,4,2,4,6,2,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,1,9,0,2,3,4,2,4,6,4,3,8,-1,-1,-1,-1,1,9,4,1,4,2,2,4,6,-1,-1,-1,-1,-1,-1,-1,8,1,3,8,6,1,8,4,6,6,10,1,-1,-1,-1,-1,10,1,0,10,0,6,6,0,4,-1,-1,-1,-1,-1,-1,-1,4,6,3,4,3,8,6,10,3,0,3,9,10,9,3,-1,10,9,4,6,10,4,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,4,9,5,7,6,11,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,8,3,4,9,5,11,7,6,-1,-1,-1,-1,-1,-1,-1,5,0,1,5,4,0,7,6,11,-1,-1,-1,-1,-1,-1,-1,11,7,6,8,3,4,3,5,4,3,1,5,-1,-1,-1,-1,9,5,4,10,1,2,7,6,11,-1,-1,-1,-1,-1,-1,-1,6,11,7,1,2,10,0,8,3,4,9,5,-1,-1,-1,-1,7,6,11,5,4,10,4,2,10,4,0,2,-1,-1,-1,-1,3,4,8,3,5,4,3,2,5,10,5,2,11,7,6,-1,7,2,3,7,6,2,5,4,9,-1,-1,-1,-1,-1,-1,-1,9,5,4,0,8,6,0,6,2,6,8,7,-1,-1,-1,-1,3,6,2,3,7,6,1,5,0,5,4,0,-1,-1,-1,-1,6,2,8,6,8,7,2,1,8,4,8,5,1,5,8,-1,9,5,4,10,1,6,1,7,6,1,3,7,-1,-1,-1,-1,1,6,10,1,7,6,1,0,7,8,7,0,9,5,4,-1,4,0,10,4,10,5,0,3,10,6,10,7,3,7,10,-1,7,6,10,7,10,8,5,4,10,4,8,10,-1,-1,-1,-1,6,9,5,6,11,9,11,8,9,-1,-1,-1,-1,-1,-1,-1,3,6,11,0,6,3,0,5,6,0,9,5,-1,-1,-1,-1,0,11,8,0,5,11,0,1,5,5,6,11,-1,-1,-1,-1,6,11,3,6,3,5,5,3,1,-1,-1,-1,-1,-1,-1,-1,1,2,10,9,5,11,9,11,8,11,5,6,-1,-1,-1,-1,0,11,3,0,6,11,0,9,6,5,6,9,1,2,10,-1,11,8,5,11,5,6,8,0,5,10,5,2,0,2,5,-1,6,11,3,6,3,5,2,10,3,10,5,3,-1,-1,-1,-1,5,8,9,5,2,8,5,6,2,3,8,2,-1,-1,-1,-1,9,5,6,9,6,0,0,6,2,-1,-1,-1,-1,-1,-1,-1,1,5,8,1,8,0,5,6,8,3,8,2,6,2,8,-1,1,5,6,2,1,6,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,1,3,6,1,6,10,3,8,6,5,6,9,8,9,6,-1,10,1,0,10,0,6,9,5,0,5,6,0,-1,-1,-1,-1,0,3,8,5,6,10,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,10,5,6,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,11,5,10,7,5,11,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,11,5,10,11,7,5,8,3,0,-1,-1,-1,-1,-1,-1,-1,5,11,7,5,10,11,1,9,0,-1,-1,-1,-1,-1,-1,-1,10,7,5,10,11,7,9,8,1,8,3,1,-1,-1,-1,-1,11,1,2,11,7,1,7,5,1,-1,-1,-1,-1,-1,-1,-1,0,8,3,1,2,7,1,7,5,7,2,11,-1,-1,-1,-1,9,7,5,9,2,7,9,0,2,2,11,7,-1,-1,-1,-1,7,5,2,7,2,11,5,9,2,3,2,8,9,8,2,-1,2,5,10,2,3,5,3,7,5,-1,-1,-1,-1,-1,-1,-1,8,2,0,8,5,2,8,7,5,10,2,5,-1,-1,-1,-1,9,0,1,5,10,3,5,3,7,3,10,2,-1,-1,-1,-1,9,8,2,9,2,1,8,7,2,10,2,5,7,5,2,-1,1,3,5,3,7,5,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,8,7,0,7,1,1,7,5,-1,-1,-1,-1,-1,-1,-1,9,0,3,9,3,5,5,3,7,-1,-1,-1,-1,-1,-1,-1,9,8,7,5,9,7,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,5,8,4,5,10,8,10,11,8,-1,-1,-1,-1,-1,-1,-1,5,0,4,5,11,0,5,10,11,11,3,0,-1,-1,-1,-1,0,1,9,8,4,10,8,10,11,10,4,5,-1,-1,-1,-1,10,11,4,10,4,5,11,3,4,9,4,1,3,1,4,-1,2,5,1,2,8,5,2,11,8,4,5,8,-1,-1,-1,-1,0,4,11,0,11,3,4,5,11,2,11,1,5,1,11,-1,0,2,5,0,5,9,2,11,5,4,5,8,11,8,5,-1,9,4,5,2,11,3,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,2,5,10,3,5,2,3,4,5,3,8,4,-1,-1,-1,-1,5,10,2,5,2,4,4,2,0,-1,-1,-1,-1,-1,-1,-1,3,10,2,3,5,10,3,8,5,4,5,8,0,1,9,-1,5,10,2,5,2,4,1,9,2,9,4,2,-1,-1,-1,-1,8,4,5,8,5,3,3,5,1,-1,-1,-1,-1,-1,-1,-1,0,4,5,1,0,5,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,8,4,5,8,5,3,9,0,5,0,3,5,-1,-1,-1,-1,9,4,5,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,4,11,7,4,9,11,9,10,11,-1,-1,-1,-1,-1,-1,-1,0,8,3,4,9,7,9,11,7,9,10,11,-1,-1,-1,-1,1,10,11,1,11,4,1,4,0,7,4,11,-1,-1,-1,-1,3,1,4,3,4,8,1,10,4,7,4,11,10,11,4,-1,4,11,7,9,11,4,9,2,11,9,1,2,-1,-1,-1,-1,9,7,4,9,11,7,9,1,11,2,11,1,0,8,3,-1,11,7,4,11,4,2,2,4,0,-1,-1,-1,-1,-1,-1,-1,11,7,4,11,4,2,8,3,4,3,2,4,-1,-1,-1,-1,2,9,10,2,7,9,2,3,7,7,4,9,-1,-1,-1,-1,9,10,7,9,7,4,10,2,7,8,7,0,2,0,7,-1,3,7,10,3,10,2,7,4,10,1,10,0,4,0,10,-1,1,10,2,8,7,4,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,4,9,1,4,1,7,7,1,3,-1,-1,-1,-1,-1,-1,-1,4,9,1,4,1,7,0,8,1,8,7,1,-1,-1,-1,-1,4,0,3,7,4,3,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,4,8,7,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,9,10,8,10,11,8,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,3,0,9,3,9,11,11,9,10,-1,-1,-1,-1,-1,-1,-1,0,1,10,0,10,8,8,10,11,-1,-1,-1,-1,-1,-1,-1,3,1,10,11,3,10,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,1,2,11,1,11,9,9,11,8,-1,-1,-1,-1,-1,-1,-1,3,0,9,3,9,11,1,2,9,2,11,9,-1,-1,-1,-1,0,2,11,8,0,11,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,3,2,11,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,2,3,8,2,8,10,10,8,9,-1,-1,-1,-1,-1,-1,-1,9,10,2,0,9,2,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,2,3,8,2,8,10,0,1,8,1,10,8,-1,-1,-1,-1,1,10,2,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,1,3,8,9,1,8,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,9,1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,3,8,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1]),ou={uFurFade:{value:1}},hv=`
  float furHash(vec3 p) { p = fract(p * 0.1031); p += dot(p, p.zyx + 31.32); return fract((p.x + p.y) * p.z); }
  float furNoise(vec3 p) { vec3 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f);
    return mix(mix(mix(furHash(i), furHash(i + vec3(1, 0, 0)), f.x), mix(furHash(i + vec3(0, 1, 0)), furHash(i + vec3(1, 1, 0)), f.x), f.y),
               mix(mix(furHash(i + vec3(0, 0, 1)), furHash(i + vec3(1, 0, 1)), f.x), mix(furHash(i + vec3(0, 1, 1)), furHash(i + vec3(1, 1, 1)), f.x), f.y), f.z); }`;function uv(i,t){const e=new Ai({vertexColors:!0,roughness:t.feather?.75:.92,metalness:0}),n={uH:{value:i},uFurLen:{value:t.length},uFurDensity:{value:t.density},uFurTip:{value:t.tip},uFeather:{value:t.feather?1:0}};return e.onBeforeCompile=r=>{Object.assign(r.uniforms,n,ou),r.vertexShader=r.vertexShader.replace("#include <common>",`#include <common>
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
        ${hv}`).replace("#include <color_fragment>",`#include <color_fragment>
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
        diffuseColor.rgb = mix(diffuseColor.rgb, diffuseColor.rgb * 1.25 + 0.06, uFurTip * smoothstep(0.6, 1.0, t));`)},e.customProgramCacheKey=()=>"kaiju-fur-v2",e}function fv(i,t,e,n){const r=[];for(let s=1;s<=n;s++){const a=new Oh(t,uv(s/n,e));a.castShadow=!1,a.receiveShadow=!0,a.frustumCulled=!1,a.userData.h=s/n,i.add(a),a.bind(i.skeleton,i.bindMatrix),r.push(a)}return r}function dv(i=512){const t=document.createElement("canvas");t.width=t.height=i;const e=t.getContext("2d"),n=document.createElement("canvas");n.width=n.height=i;const r=n.getContext("2d"),s=e.createImageData(i,i),a=r.createImageData(i,i),o=22,c=[];let l=7;const h=()=>(l=l*1664525+1013904223>>>0,l/4294967296);for(let f=0;f<o;f++)for(let m=0;m<o;m++)c.push([(m+.2+h()*.6)/o,(f+.2+h()*.6)/o,.7+h()*.3]);for(let f=0;f<i;f++)for(let m=0;m<i;m++){const x=m/i,g=f/i,p=Math.floor(x*o),T=Math.floor(g*o);let y=9,M=9,w=1;for(let b=-1;b<=1;b++)for(let D=-1;D<=1;D++){const U=(p+D+o)%o,N=(T+b+o)%o,B=c[N*o+U];let Z=x-B[0],H=g-B[1];Z-=Math.round(Z),H-=Math.round(H);const st=Math.sqrt(Z*Z+H*H);st<y?(M=y,y=st,w=B[2]):st<M&&(M=st)}const E=M-y,A=Math.min(1,E/.02),C=1-Math.min(1,y/(.55/o)),v=(.55+.45*A)*w*(.85+.3*C),_=(f*i+m)*4;s.data[_]=255*v,s.data[_+1]=255*v,s.data[_+2]=255*v,s.data[_+3]=255;const S=.55+.4*(1-A)-.15*C;a.data[_]=255*S,a.data[_+1]=255*S,a.data[_+2]=255*S,a.data[_+3]=255}e.putImageData(s,0,0),r.putImageData(a,0,0);const u=new hl(t);u.wrapS=u.wrapT=Hr,u.colorSpace=wn;const d=new hl(n);return d.wrapS=d.wrapT=Hr,{map:u,rough:d}}let Us=null;function pv(i=!1,t){if(i)return mv();if(t==="armour")return new Ai({vertexColors:!0,roughness:.42,metalness:.45});if(t==="soft")return new Ai({vertexColors:!0,roughness:.82,metalness:0});if(t==="suit")return new Ai({vertexColors:!0,roughness:.34,metalness:.18});!Us&&typeof document<"u"&&(Us=dv());const e=new Ai({vertexColors:!0,roughness:.7,metalness:.02});return e.onBeforeCompile=n=>{n.uniforms.uScales={value:Us?.map??null},n.uniforms.uRough={value:Us?.rough??null},n.vertexShader=n.vertexShader.replace("#include <common>",`#include <common>
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
        float roughTex = triplanar(uRough, vBind, bn, sc).r;`).replace("#include <roughnessmap_fragment>","float roughnessFactor = mix(roughTex, 0.9, isBone);")},e.customProgramCacheKey=()=>"kaiju-v1",e}function mv(){const i=new Ai({vertexColors:!0,roughness:.95,metalness:0});return i.onBeforeCompile=t=>{Object.assign(t.uniforms,ou),t.fragmentShader=t.fragmentShader.replace("#include <common>",`#include <common>
 uniform float uFurFade;`).replace("#include <color_fragment>",`#include <color_fragment>
 diffuseColor.rgb *= mix(1.0, 0.6, uFurFade);`)},i.customProgramCacheKey=()=>"kaiju-undercoat-v1",i}function Vl(i,t,e){const n=i.box,r=(n.min[0]+n.max[0])/2,s=(n.min[1]+n.max[1])/2,a=(n.min[2]+n.max[2])/2,o=(n.max[0]-n.min[0])/2,c=(n.max[1]-n.min[1])/2,l=(n.max[2]-n.min[2])/2,h=new au(e,new ta,!1,!1,4e5);h.isolation=50;const u=h.field,d=e;for(let S=0;S<d;S++){const b=a+(S/(d-1)*2-1)*l;for(let D=0;D<d;D++){const U=s+(D/(d-1)*2-1)*c;for(let N=0;N<d;N++){const B=r+(N/(d-1)*2-1)*o;u[S*d*d+D*d+N]=Math.max(0,Math.min(100,50-i.sdf(B,U,b)*40))}}}h.update();const f=h.count,m=new Float32Array(f*3),x=new Float32Array(f*3),g=new Float32Array(f*3),p=h.positionArray,T=h.normalArray,y=i.palette.map(S=>new Yt(S)),M=new Yt;for(let S=0;S<f;S++){const b=r+p[S*3]*o,D=s+p[S*3+1]*c,U=a+p[S*3+2]*l;m[S*3]=b,m[S*3+1]=D,m[S*3+2]=U;let N=T[S*3]/o,B=T[S*3+1]/c,Z=T[S*3+2]/l;const H=Math.hypot(N,B,Z)||1;N/=H,B/=H,Z/=H,x[S*3]=N,x[S*3+1]=B,x[S*3+2]=Z;const st=i.region(b,D,U);M.copy(y[st]??y[0]),i.tint?.(st,b,D,U,M);const ht=.94+.06*Math.sin(D*1.7+U*.9)*Math.cos(b*2.3);g[S*3]=M.r*ht,g[S*3+1]=M.g*ht,g[S*3+2]=M.b*ht}h.geometry.dispose();const w=new Le;if(w.setAttribute("position",new me(m,3)),w.setAttribute("normal",new me(x,3)),w.setAttribute("color",new me(g,3)),i.fur){const S=new Float32Array(f);for(let b=0;b<f;b++)S[b]=i.furLen?i.furLen(m[b*3],m[b*3+1],m[b*3+2]):1;w.setAttribute("aFur",new me(S,1))}const E=new Uint16Array(f*4),A=new Float32Array(f*4),C=t.map((S,b)=>({i:b,a:S.a,b:S.b,reach:S.reach??1/0,name:S.name})),v=i.capture,_=i.weights??"sharp";for(let S=0;S<f;S++){const b=m[S*3],D=m[S*3+1],U=m[S*3+2];let N=1/0,B=1/0,Z=0,H=0;for(const _t of C){if(v&&!v(_t,b,D,U))continue;const Et=_t.b[0]-_t.a[0],zt=_t.b[1]-_t.a[1],Vt=_t.b[2]-_t.a[2],et=b-_t.a[0],ct=D-_t.a[1],G=U-_t.a[2],q=Math.max(0,Math.min(1,(et*Et+ct*zt+G*Vt)/(Et*Et+zt*zt+Vt*Vt||1))),k=Math.hypot(et-Et*q,ct-zt*q,G-Vt*q);k>_t.reach||(k<N?(B=N,H=Z,N=k,Z=_t.i):k<B&&(B=k,H=_t.i))}isFinite(B)||(B=N,H=Z);const st=_==="rigid"?1:_==="soft"?1/Math.pow(N+1.2,2):1/Math.pow(N+.3,4),ht=_==="rigid"?0:_==="soft"?1/Math.pow(B+1.2,2):1/Math.pow(B+.3,4),pt=st+ht;E[S*4]=Z,E[S*4+1]=H,A[S*4]=st/pt,A[S*4+1]=ht/pt}return w.setAttribute("skinIndex",new me(E,4)),w.setAttribute("skinWeight",new me(A,4)),w}function gv(i){const t=new Map;let e=null;for(const n of i){const r=new Bh;if(r.name=n.name,n.parent){const s=i.find(a=>a.name===n.parent);r.position.set(n.a[0]-s.a[0],n.a[1]-s.a[1],n.a[2]-s.a[2]),t.get(n.parent).add(r)}else r.position.set(n.a[0],n.a[1],n.a[2]),e=r;t.set(n.name,r)}return{bones:t,root:e}}function vv(i,t=i.res??88){const e=performance.now(),{bones:n,root:r}=gv(i.segs);let s,a=[];if(i.body){const o=i.body,c=Vl(o,i.segs,t),l=o.surface==="scales"||o.surface==="fur"?void 0:o.surface,h=new Oh(c,pv(!!o.fur||o.surface==="fur",l));h.castShadow=!0,h.receiveShadow=!0,h.frustumCulled=!1,h.add(r),h.bind(new ic(i.segs.map(u=>n.get(u.name)))),o.fur&&(i.furShells??10)>0&&(a=fv(h,Vl(o,i.segs,Math.max(32,Math.round(t*.6))),o.fur,i.furShells??10)),s=h}else{const o=new fn;o.add(r),s=o}if(i.dress){const o=new Map;i.dress({bones:n,segs:i.segs,at(c,l,h,u,d){const f=i.segs.find(m=>m.name===l);return c.position.set(h-f.a[0],u-f.a[1],d-f.a[2]),c.traverse(m=>{m.isMesh&&(m.castShadow=!0,m.receiveShadow=!0)}),n.get(l).add(c),c},std(c){const l=JSON.stringify(c);let h=o.get(l);return h||(h=new Ai(c),o.set(l,h)),h}})}return s.name=i.id,{def:i,root:s,bones:n,fur:a,ms:performance.now()-e}}const lt=(i,t,e)=>{const n=Math.max(e-Math.abs(i-t),0)/e;return Math.min(i,t)-n*n*e*.25};function Te(i,t,e,n,r,s,a){const o=i-n,c=t-r,l=e-s;return Math.sqrt(o*o+c*c+l*l)-a}function Rt(i,t,e,n,r,s,a,o,c,l,h){const u=a-n,d=o-r,f=c-s,m=i-n,x=t-r,g=e-s,p=Math.max(0,Math.min(1,(m*u+x*d+g*f)/(u*u+d*d+f*f))),T=m-u*p,y=x-d*p,M=g-f*p;return Math.sqrt(T*T+y*y+M*M)-(l+(h-l)*p)}function Bt(i,t,e,n,r,s,a,o,c){const l=(i-n)/a,h=(t-r)/o,u=(e-s)/c,d=Math.sqrt(l*l+h*h+u*u),f=Math.sqrt(l*l/a+h*h/o+u*u/c);return f>0?d*(d-1)/f:-Math.min(a,o,c)}const ar=[1.7,6,.2],or=[1.9,3.4,.55],Nr=[1.9,1,0],Gl=[1.9,.3,2],bi=[2.9,11,.8],Ri=[4.84,10.1,1.33],ai=[6.47,9.3,1.88],Ye=[[0,6.6,-2.6],[.5,4.6,-4.4],[1.6,2.4,-5.3],[3,1.1,-5.2],[4.5,.85,-4.1]],Wl=[1.15,1.45,1.4,1.2,.75],ge=[0,14.4,.6],_v=[{name:"pelvis",a:[0,6,0],b:[0,7.6,0],parent:null},{name:"spine1",a:[0,7.6,0],b:[0,9.4,.1],parent:"pelvis"},{name:"spine2",a:[0,9.4,.1],b:[0,11.4,.1],parent:"spine1"},{name:"neck",a:[0,11.4,.1],b:[0,ge[1]-1.6,ge[2]-.25],parent:"spine2"},{name:"head",a:[0,ge[1]-1.6,ge[2]-.25],b:[0,ge[1]+1.6,ge[2]+.1],parent:"neck"},{name:"jaw",a:[0,ge[1]-1.1,ge[2]+1.1],b:[0,ge[1]-1.2,ge[2]+2.9],parent:"head",reach:0},{name:"tail1",a:Ye[0],b:Ye[1],parent:"pelvis"},{name:"tail2",a:Ye[1],b:Ye[2],parent:"tail1"},{name:"tail3",a:Ye[2],b:Ye[3],parent:"tail2"},{name:"tail4",a:Ye[3],b:Ye[4],parent:"tail3"},{name:"thighL",a:ar,b:or,parent:"pelvis"},{name:"shinL",a:or,b:Nr,parent:"thighL"},{name:"footL",a:Nr,b:Gl,parent:"shinL"},{name:"thighR",a:yn(ar),b:yn(or),parent:"pelvis"},{name:"shinR",a:yn(or),b:yn(Nr),parent:"thighR"},{name:"footR",a:yn(Nr),b:yn(Gl),parent:"shinR"},{name:"armL",a:bi,b:Ri,parent:"spine2"},{name:"forearmL",a:Ri,b:ai,parent:"armL"},{name:"armR",a:yn(bi),b:yn(Ri),parent:"spine2"},{name:"forearmR",a:yn(Ri),b:yn(ai),parent:"armR"}];function yn(i){return[-i[0],i[1],i[2]]}const xv={min:[-8.3,-.4,-7.2],max:[8.3,18.4,5.8]},Gn=[.98,ge[1]+.33,ge[2]+1.97],Ci=[0,ge[1]-.5,ge[2]+4.05],oi=cu(Mv(ai,Ri)),Ga=cu([-oi[2],0,oi[0]]);function Mv(i,t){return[i[0]-t[0],i[1]-t[1],i[2]-t[2]]}function cu(i){const t=Math.hypot(i[0],i[1],i[2]);return[i[0]/t,i[1]/t,i[2]/t]}const vr=(i,t,e,n=0)=>[i[0]+oi[0]*t+Ga[0]*e,i[1]+oi[1]*t+Ga[1]*e+n,i[2]+oi[2]*t+Ga[2]*e],_n=vr(ai,.35,0),Sv=vr(_n,1.3,0),lu=(i,t,e)=>(i-ai[0])*oi[0]+(t-ai[1])*oi[1]+(e-ai[2])*oi[2],hu=[-.42,-.14,.14,.42].map(i=>[vr(_n,.35,i*1.1),vr(_n,1.15-Math.abs(i)*.5,i*1.35,-.12)]);hu.push([vr(_n,-.1,.45),vr(_n,.45,.95,-.1)]);const yv=[-.5,-.17,.17,.5].map(i=>[[1.9+i*1.1,.3,1.8],[1.9+i*1.3,.22,2.7-Math.abs(i)*.4]]),ti=(i,t,e,n,r,s,a)=>Rt(i,t,e,n[0],n[1],n[2],r[0],r[1],r[2],s,a),Cr=2.5;let Xl=NaN,ql=NaN,Yl=NaN;const ei={body:0,head:0,arm:0,leg:0,tail:0,min:0};function ns(i,t,e){if(i===Xl&&t===ql&&e===Yl)return ei;Xl=i,ql=t,Yl=e;const n=Math.abs(i);let r=Bt(i,t,e,0,7.7,.35,3.85,3.35,3.4);r=lt(r,Bt(i,t,e,0,10.3,.3,3,2.1,2.7),1.6),r=lt(r,Bt(i,t,e,0,6.9,-1.2,3.4,2.6,2.7),1.2),r=lt(r,Te(n,t,e,bi[0],bi[1],bi[2],1.15),.9),r=lt(r,Rt(i,t,e,0,11,.2,0,ge[1]-1.4,ge[2]-.15,2.1,1.7),.8),ei.body=r;const s=t-ge[1],a=e-ge[2];let o=Te(i,s,a,0,.6,.5,4.3);o<Cr&&(o=Bt(i,s,a,0,0,0,2.38,2.05,2.21),o=lt(o,Bt(n,s,a,1.8,-.66,.25,1.15,1.23,1.31),.66),o=lt(o,Rt(i,s,a,0,-.25,1.48,0,-.57,3.6,1.11,.45),.5),o=lt(o,Rt(i,s,a,0,-1.07,1.15,0,-1.23,2.95,.78,.41),.33),o=lt(o,Bt(n,s,a,1.44,2.05,-.66,.78,1.03,.34),.29),o=Math.max(o,-Te(n,t,e,Gn[0]+.05,Gn[1],Gn[2]+.2,.34))),ei.head=o;let c=ti(n,t,e,bi,Sv,1.6,1.6);if(c<Cr&&(c=ti(n,t,e,bi,Ri,.95,.8),c=lt(c,ti(n,t,e,Ri,ai,.8,.6),.4),Te(n,t,e,_n[0],_n[1],_n[2],1.6)<Cr)){c=lt(c,Bt(n,t,e,_n[0],_n[1],_n[2],.62,.38,.62),.3);for(const u of hu)c=lt(c,ti(n,t,e,u[0],u[1],.24,.17),.14)}ei.arm=c;let l=Rt(n,t,e,ar[0],ar[1],ar[2],1.9,.6,1,2,2);if(l<Cr&&(l=ti(n,t,e,ar,or,1.55,1.15),l=lt(l,ti(n,t,e,or,Nr,1.12,.85),.5),t<2.6)){l=lt(l,Math.max(Bt(n,t,e,1.9,.45,.75,.95,.6,1.75),-t),.45);for(const u of yv)l=lt(l,ti(n,t,e,u[0],u[1],.26,.18),.15)}ei.leg=l;let h=Te(i,t,e,2,3.4,-4.4,5.4);if(h<Cr){h=1e9;for(let u=0;u+1<Ye.length;u++)h=lt(h,ti(i,t,e,Ye[u],Ye[u+1],Wl[u],Wl[u+1]),.5)}return ei.tail=h,ei.min=Math.min(r,o,c,l,h),ei}function bv(i,t,e){const n=ns(i,t,e);let r=lt(n.body,n.head,.6);return r=lt(r,n.arm,.5),r=lt(r,n.leg,.7),lt(r,n.tail,.6)}function Ev(i,t,e){let n=0,r=1/0,s=0;for(let a=0;a+1<Ye.length;a++){const o=Ye[a],c=Ye[a+1],l=c[0]-o[0],h=c[1]-o[1],u=c[2]-o[2],d=l*l+h*h+u*u,f=Math.max(0,Math.min(1,((i-o[0])*l+(t-o[1])*h+(e-o[2])*u)/d)),m=i-o[0]-l*f,x=t-o[1]-h*f,g=e-o[2]-u*f,p=m*m+x*x+g*g;p<r&&(r=p,n=s+f*Math.sqrt(d)),s+=Math.sqrt(d)}return n}function Tv(i,t,e){const n=Math.abs(i);if(Math.hypot(i,t-Ci[1],e-Ci[2])<.62)return 3;const r=ns(i,t,e),s=r.min;if(r.head===s){const a=t-ge[1];if(e-ge[2]>.5&&a>-1.5){if(a>.98&&a<1.72&&n<2.05&&n>.37)return 1;if(a>-.25&&a<=.98&&n>.33||n<=.33&&a>-.25&&a<2.3)return 2;if(a<=-.25)return 1}return a>2.75&&n>.98?1:0}if(r.tail===s){const a=Ev(i,t,e);return a>7.9||a%2<.85?2:4}return r.arm===s?lu(n,t,e)>-.25?5:0:r.leg===s?t<1.3?5:0:e>1.2&&(i/2.4)**2+((t-7.9)/3.1)**2<1?4:0}function wv(i,t,e){const n=Math.abs(i),r=Math.hypot(n-Gn[0],t-Gn[1],e-Gn[2]);if(r<.62||Math.hypot(i,t-Ci[1],e-Ci[2])<.85)return 0;const s=ns(i,t,e),a=s.min;if(s.head===a){const o=t-ge[1],c=e-ge[2];return o>1.4&&n>.9&&c<.1?.5:n>1.4&&o<0&&c<1.5?1.35:c>1?.35+.4*Math.min(1,(r-.62)/1.3):.9}return s.tail===a?1.4:s.arm===a?lu(n,t,e)>-.25?.25:.9:s.leg===a?t<1.3?.3:1:1.1}const Av=.6;function Rv(){return(i,t,e,n)=>{const r=ns(t,e,n),s=i.name,a=o=>o<=r.min+Av;return s==="pelvis"||s==="spine1"||s==="spine2"?a(r.body):s==="neck"?(a(r.body)||a(r.head))&&e>10.6&&e<ge[1]-1:s==="head"||s==="jaw"?a(r.head)&&e>ge[1]-2.1:s.startsWith("arm")||s.startsWith("forearm")?a(r.arm)&&(s.endsWith("L")?t>.5:t<-.5):s.startsWith("thigh")||s.startsWith("shin")||s.startsWith("foot")?a(r.leg)&&(s.endsWith("L")?t>.2:t<-.2):s.startsWith("tail")?a(r.tail):!0}}const Cv={id:"jimothy",name:"Jimothy",blurb:"The round Seattle raccoon, standing up",segs:_v,body:{sdf:bv,region:Tv,box:xv,palette:[8024164,15130834,1841431,657930,11050638,3814192],weights:"soft",capture:Rv(),fur:{length:1,density:7,tip:.18},furLen:wv,tint(i,t,e,n,r){if(i!==0)return;n<-.5&&r.multiplyScalar(1-.2*Math.min(1,(-.5-n)/2.5));const s=ns(t,e,n);(s.arm===s.min||s.leg===s.min)&&r.multiplyScalar(.82)}},dress(i){const t=i.std({color:328965,roughness:.06,metalness:.1});for(const n of[-1,1])i.at(new ee(new Xe(.34,14,10),t),"head",n*Gn[0],Gn[1],Gn[2]);const e=new ee(new Xe(.5,14,10),i.std({color:657930,roughness:.25}));e.scale.set(1.15,.8,.75),i.at(e,"head",Ci[0],Ci[1],Ci[2])},fit:{size:1.05,limb:.4},idle:{tail:.15},furShells:8},Lr=new O;function on(i,t,e,n,r,s){const a=2*Math.PI*r/4,o=Math.max(s-2*r,0),c=Math.PI/4;Lr.copy(t),Lr[n]=0,Lr.normalize();const l=.5*a/(a+o),h=1-Lr.angleTo(i)/c;return Math.sign(Lr[e])===1?h*l:o/(a+o)+l+l*(1-h)}class uc extends Ge{constructor(t=1,e=1,n=1,r=2,s=.1){const a=r*2+1;if(s=Math.min(t/2,e/2,n/2,s),super(1,1,1,a,a,a),this.type="RoundedBoxGeometry",this.parameters={width:t,height:e,depth:n,segments:r,radius:s},a===1)return;const o=this.toNonIndexed();this.index=null,this.attributes.position=o.attributes.position,this.attributes.normal=o.attributes.normal,this.attributes.uv=o.attributes.uv;const c=new O,l=new O,h=new O(t,e,n).divideScalar(2).subScalar(s),u=this.attributes.position.array,d=this.attributes.normal.array,f=this.attributes.uv.array,m=u.length/6,x=new O,g=.5/a;for(let p=0,T=0;p<u.length;p+=3,T+=2)switch(c.fromArray(u,p),l.copy(c),l.x-=Math.sign(l.x)*g,l.y-=Math.sign(l.y)*g,l.z-=Math.sign(l.z)*g,l.normalize(),u[p+0]=h.x*Math.sign(c.x)+l.x*s,u[p+1]=h.y*Math.sign(c.y)+l.y*s,u[p+2]=h.z*Math.sign(c.z)+l.z*s,d[p+0]=l.x,d[p+1]=l.y,d[p+2]=l.z,Math.floor(p/m)){case 0:x.set(1,0,0),f[T+0]=on(x,l,"z","y",s,n),f[T+1]=1-on(x,l,"y","z",s,e);break;case 1:x.set(-1,0,0),f[T+0]=1-on(x,l,"z","y",s,n),f[T+1]=1-on(x,l,"y","z",s,e);break;case 2:x.set(0,1,0),f[T+0]=1-on(x,l,"x","z",s,t),f[T+1]=on(x,l,"z","x",s,n);break;case 3:x.set(0,-1,0),f[T+0]=1-on(x,l,"x","z",s,t),f[T+1]=1-on(x,l,"z","x",s,n);break;case 4:x.set(0,0,1),f[T+0]=1-on(x,l,"x","y",s,t),f[T+1]=1-on(x,l,"y","x",s,e);break;case 5:x.set(0,0,-1),f[T+0]=on(x,l,"x","y",s,t),f[T+1]=1-on(x,l,"y","x",s,e);break}}static fromJSON(t){return new uc(t.width,t.height,t.depth,t.segments,t.radius)}}function uu(i,t=!1){const e=i[0].index!==null,n=new Set(Object.keys(i[0].attributes)),r=new Set(Object.keys(i[0].morphAttributes)),s={},a={},o=i[0].morphTargetsRelative,c=new Le;let l=0;for(let h=0;h<i.length;++h){const u=i[h];let d=0;if(e!==(u.index!==null))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". All geometries must have compatible attributes; make sure index attribute exists among all geometries, or in none of them."),null;for(const f in u.attributes){if(!n.has(f))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+'. All geometries must have compatible attributes; make sure "'+f+'" attribute exists among all geometries, or in none of them.'),null;s[f]===void 0&&(s[f]=[]),s[f].push(u.attributes[f]),d++}if(d!==n.size)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". Make sure all geometries have the same number of attributes."),null;if(o!==u.morphTargetsRelative)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". .morphTargetsRelative must be consistent throughout all geometries."),null;for(const f in u.morphAttributes){if(!r.has(f))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+".  .morphAttributes must be consistent throughout all geometries."),null;a[f]===void 0&&(a[f]=[]),a[f].push(u.morphAttributes[f])}if(t){let f;if(e)f=u.index.count;else if(u.attributes.position!==void 0)f=u.attributes.position.count;else return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". The geometry must have either an index or a position attribute"),null;c.addGroup(l,f,h),l+=f}}if(e){let h=0;const u=[];for(let d=0;d<i.length;++d){const f=i[d].index;for(let m=0;m<f.count;++m)u.push(f.getX(m)+h);h+=i[d].attributes.position.count}c.setIndex(u)}for(const h in s){const u=$l(s[h]);if(!u)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+h+" attribute."),null;c.setAttribute(h,u)}for(const h in a){const u=a[h][0].length;if(u===0)break;c.morphAttributes=c.morphAttributes||{},c.morphAttributes[h]=[];for(let d=0;d<u;++d){const f=[];for(let x=0;x<a[h].length;++x)f.push(a[h][x][d]);const m=$l(f);if(!m)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+h+" morphAttribute."),null;c.morphAttributes[h].push(m)}}return c}function $l(i){let t,e,n,r=-1,s=0;for(let l=0;l<i.length;++l){const h=i[l];if(t===void 0&&(t=h.array.constructor),t!==h.array.constructor)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.array must be of consistent array types across matching attributes."),null;if(e===void 0&&(e=h.itemSize),e!==h.itemSize)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.itemSize must be consistent across matching attributes."),null;if(n===void 0&&(n=h.normalized),n!==h.normalized)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.normalized must be consistent across matching attributes."),null;if(r===-1&&(r=h.gpuType),r!==h.gpuType)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.gpuType must be consistent across matching attributes."),null;s+=h.count*e}const a=new t(s),o=new me(a,e,n);let c=0;for(let l=0;l<i.length;++l){const h=i[l];if(h.isInterleavedBufferAttribute){const u=c/e;for(let d=0,f=h.count;d<f;d++)for(let m=0;m<e;m++){const x=h.getComponent(d,m);o.setComponent(d+u,m,x)}}else a.set(h.array,c);c+=h.count*e}return r!==void 0&&(o.gpuType=r),o}const vn=2.75,Lv=[{name:"pelvis",a:[0,9.6,0],b:[0,10.8,0],parent:null},{name:"spine1",a:[0,10.8,0],b:[0,12.6,0],parent:"pelvis"},{name:"spine2",a:[0,12.6,0],b:[0,15,0],parent:"spine1"},{name:"neck",a:[0,15,0],b:[0,15.9,0],parent:"spine2"},{name:"head",a:[0,15.9,0],b:[0,18.4,.1],parent:"neck"},{name:"jaw",a:[0,16.5,1],b:[0,16.5,1.3],parent:"head",reach:0},{name:"tail1",a:[0,9.4,-.8],b:[0,9.2,-1.2],parent:"pelvis",reach:0},{name:"tail2",a:[0,9.2,-1.2],b:[0,9,-1.6],parent:"tail1",reach:0},{name:"tail3",a:[0,9,-1.6],b:[0,8.8,-2],parent:"tail2",reach:0},{name:"tail4",a:[0,8.8,-2],b:[0,8.6,-2.4],parent:"tail3",reach:0},{name:"thighL",a:[.95,9.6,0],b:[.95,5.3,0],parent:"pelvis"},{name:"shinL",a:[.95,5.3,0],b:[.95,1.2,0],parent:"thighL"},{name:"footL",a:[.95,1.2,0],b:[.95,.4,1.5],parent:"shinL"},{name:"thighR",a:[-.95,9.6,0],b:[-.95,5.3,0],parent:"pelvis"},{name:"shinR",a:[-.95,5.3,0],b:[-.95,1.2,0],parent:"thighR"},{name:"footR",a:[-.95,1.2,0],b:[-.95,.4,1.5],parent:"shinR"},{name:"armL",a:[vn,14.4,0],b:[vn,11.9,0],parent:"spine2"},{name:"forearmL",a:[vn,11.9,0],b:[vn,9.5,0],parent:"armL"},{name:"armR",a:[-vn,14.4,0],b:[-vn,11.9,0],parent:"spine2"},{name:"forearmR",a:[-vn,11.9,0],b:[-vn,9.5,0],parent:"armR"}],Ns=[{y0:9.9,y1:12.3,r0:3.5,r1:1.45,n:9,bone:"pelvis"},{y0:11.35,y1:13.6,r0:3.05,r1:1.25,n:8,bone:"spine1"},{y0:12.75,y1:14.85,r0:2.65,r1:1.05,n:7,bone:"spine2"},{y0:14.05,y1:15.8,r0:2.15,r1:.8,n:6,bone:"spine2"}],fu=.5,Pv=1.4,Dv=4168267,Iv=1195289,du=(i,t)=>i.r1+(i.r0-i.r1)*Math.pow(Math.min(1,Math.max(0,1-t)),Pv);function Uv(i){const t=i.n*2,e=i.y1-i.y0,n=new Ve(i.r1,i.r0,e,t,4,!0),r=n.attributes.position,s=new Float32Array(r.count*3),a=new Yt(Dv),o=new Yt(Iv),c=new Yt;for(let l=0;l<r.count;l++){const h=r.getX(l),u=r.getY(l),d=r.getZ(l),f=(u+e/2)/e,m=Math.hypot(h,d)||1;let x=du(i,f),g=0;f<1e-4&&(Math.round(Math.atan2(h,d)/(Math.PI*2/t))%2+2)%2===0&&(g=-fu,x*=1.05),r.setXYZ(l,h/m*x,u+g,d/m*x),c.copy(a).lerp(o,Math.pow(Math.min(1,Math.max(0,f)),.8)),s[l*3]=c.r,s[l*3+1]=c.g,s[l*3+2]=c.b}return n.setAttribute("color",new me(s,3)),n.computeVertexNormals(),n}function Nv(i,t,e){const r=new es(i,t,e,6,!1),s=r.attributes.position,a=r.attributes.normal;for(let o=0;o<=t;o++)for(let c=0;c<=6;c++){const l=o*7+c,h=1+.42*Math.sin(o*2.2+c*(Math.PI*2*2/6));s.setXYZ(l,s.getX(l)+a.getX(l)*e*(h-1),s.getY(l)+a.getY(l)*e*(h-1),s.getZ(l)+a.getZ(l)*e*(h-1))}return r.computeVertexNormals(),r}function Jl(i,t,e,n){const r=du(i,e)+n;return new O(Math.sin(t)*r,i.y0+e*(i.y1-i.y0),Math.cos(t)*r)}const Zl=[16719904,16755216,2781439,16724160],Fv=2,Ov=16763955;function Bv(i){const t=new Map,e=new Set,n=(F,z,W,Q,ot)=>{F.position.set(W,Q,ot),F.updateMatrixWorld(!0),F.traverse(ut=>{const Pt=ut;if(!Pt.isMesh)return;const kt=Pt.material,I=`${z}|${kt.uuid}|${Pt.name}`,R=Pt.geometry.index?Pt.geometry.toNonIndexed():Pt.geometry.clone();for(const nt of Object.keys(R.attributes))nt!=="position"&&nt!=="normal"&&nt!=="color"&&R.deleteAttribute(nt);R.applyMatrix4(Pt.matrixWorld);let Y=t.get(I);Y||(Y={bone:z,mat:kt,name:Pt.name,geos:[]},t.set(I,Y)),Y.geos.push(R)})},r=new Map,s=(F,z,W,Q=.25)=>{const ot=`${F},${z},${W},${Q}`;let ut=r.get(ot);return ut||(ut=new uc(F,z,W,2,Math.min(Q,F/2-.01,z/2-.01,W/2-.01)),r.set(ot,ut)),ut},a=(F,z,W="")=>{e.add(F);const Q=new ee(F,z);return Q.name=W,Q},o=i.std({color:15909267,roughness:.6}),c=i.std({color:1380623,roughness:.35}),l=i.std({color:5978656,roughness:.8}),h=i.std({color:15899278,roughness:.7}),u=i.std({color:16237849,roughness:.35,metalness:.05}),d=i.std({color:12722988,roughness:.75}),f=i.std({color:15921128,roughness:.8}),m=i.std({color:13146714,roughness:.85}),x=i.std({color:9397556,roughness:.85}),g=i.std({color:3100550,roughness:.85}),p=i.std({color:7029286,roughness:.6}),T=i.std({color:8014372,roughness:.7}),y=i.std({color:2760730,roughness:.9}),M=i.std({color:13225686,roughness:.3,metalness:.85}),w=i.std({color:5593439,roughness:.35,metalness:.8}),E=i.std({color:11039806,roughness:.7}),A=i.std({color:16777215,vertexColors:!0,roughness:.8,flatShading:!0,side:Tn}),C=i.std({color:15250746,roughness:.3,metalness:.9}),v=i.std({color:15777605,roughness:.25,metalness:.9,flatShading:!0}),_=i.std({color:1522205,roughness:.7}),S=[i.std({color:13705003,roughness:.18,metalness:.55}),i.std({color:15316028,roughness:.2,metalness:.9}),i.std({color:2315209,roughness:.18,metalness:.55})],b=[];for(let F=0;F<Fv;F++)for(let z=0;z<Zl.length;z++){const W=i.std({color:2105376,emissive:Zl[z],emissiveIntensity:2.5,roughness:.3,name:`bulb-${z}-${F}`});W.userData.phase=z*1.9+F*Math.PI,W.userData.rate=1.5+.6*((z+F*3)%4),b.push(W)}const D=i.std({color:6965760,emissive:Ov,emissiveIntensity:1.3,roughness:.25,metalness:.4,name:"star"});n(a(s(2.9,2.6,2.6,.62),o),"head",0,17.15,.05);const U=new Xe(.2,12,8);for(const F of[-1,1]){const z=a(U,c);z.scale.set(.8,1.3,.45),n(z,"head",F*.52,17.45,1.35);const W=a(U,h);W.scale.set(1.3,.8,.3),n(W,"head",F*.95,16.9,1.33);const Q=a(s(.8,.34,.3,.14),l);Q.rotation.z=F*-.22,n(Q,"head",F*.38,16.82,1.41)}const N=a(new hr(.5,.075,6,18,2.3),c);N.rotation.z=-Math.PI/2-1.15,n(N,"head",0,16.78,1.36);const B=new fn;B.add(a(new Xe(1,24,10,0,Math.PI*2,0,Math.PI/2),u));const Z=a(new hr(1,.11,6,20,Math.PI),u);Z.rotation.y=Math.PI/2,B.add(Z),B.scale.set(1.66,1.22,1.72),n(B,"head",0,18,.05);const H=a(new Ve(1,1,.16,28),u);H.scale.set(1.9,1,2.08),n(H,"head",0,18.05,.3);const st=new Yh;for(let F=0;F<10;F++){const z=Math.PI/2+F*Math.PI/5,W=F%2?.42:1;F?st.lineTo(Math.cos(z)*W,Math.sin(z)*W):st.moveTo(Math.cos(z)*W,Math.sin(z)*W)}const ht=new cc(st,{depth:.36,bevelEnabled:!0,bevelThickness:.12,bevelSize:.08,bevelSegments:1});ht.translate(0,0,-.18),n(a(ht,D,"star"),"head",0,20.15,.05),n(a(new Ve(.12,.16,.6,6),C),"head",0,19.35,.05),n(a(new Ve(.72,.8,1.5,10),o),"neck",0,15.6,0),n(a(s(2*vn-1.2,2.8,2.2,.4),d),"spine2",0,13.9,0),n(a(s(3.5,2.4,2,.3),d),"spine1",0,11.7,0),n(a(s(3.75,2,2.1,.3),g),"pelvis",0,9.5,0);for(const F of Ns)n(a(Uv(F),A),F.bone,0,(F.y0+F.y1)/2,0);const pt=new Xe(.36,12,8),_t=new Ve(.1,.1,.16,6);let Et=0;Ns.forEach((F,z)=>{const W=Math.PI*2/F.n;for(let Q=z%2;Q<F.n;Q+=2){const ot=Q*W,ut=F.r0*1.05+.1,Pt=F.y0-fu-.34;n(a(pt,S[Et++%S.length]),F.bone,Math.sin(ot)*ut,Pt,Math.cos(ot)*ut),n(a(_t,C),F.bone,Math.sin(ot)*ut,Pt+.38,Math.cos(ot)*ut)}}),Ns.forEach((F,z)=>{const W=[],Q=z*1.9;for(let ot=0;ot<=48;ot++){const ut=ot/48;W.push(Jl(F,Q+ut*Math.PI*2,.18+.64*ut,.13))}n(a(Nv(new Js(W),120,.17),v),F.bone,0,0,0)});const zt=new Xe(.24,10,7);let Vt=0;Ns.forEach((F,z)=>{const W=F.n-2,Q=.4+z*.7,ot=.6,ut=.3,Pt=I=>{const R=Math.sin(I*Math.PI*W);return Jl(F,Q+I*Math.PI*2,ot-ut*R*R,.1)},kt=[];for(let I=0;I<96;I++)kt.push(Pt(I/96));n(a(new es(new Js(kt,!0),192,.045,4,!0),_),F.bone,0,0,0);for(let I=0;I<W;I++)for(const R of[.22,.5,.78]){const Y=Pt((I+R)/W),nt=a(zt,b[(Vt*5+z)%b.length],"bulb");nt.scale.set(1,1.3,1),n(nt,F.bone,Y.x*1.04,Y.y-.22,Y.z*1.04),Vt++}});for(const F of[-1,1]){const z=F>0?"L":"R",W=F*vn;n(a(s(1.7,1.2,1.7,.45),d),"arm"+z,W,14.35,0),n(a(s(1.5,2.8,1.5,.25),d),"arm"+z,W,13,0),n(a(s(1.38,1.38,1.38,.55),d),"arm"+z,W,11.9,0),n(a(s(1.42,2.3,1.42,.25),d),"forearm"+z,W,10.8,0),n(a(s(1.58,.45,1.58,.15),f),"forearm"+z,W,9.75,0),n(a(s(1.64,.6,1.64,.2),x),"forearm"+z,W,9.3,0),n(a(s(1.45,1.3,1.5,.4),m),"forearm"+z,W,8.5,.05),n(a(s(.42,.8,.46,.18),m),"forearm"+z,W-F*.5,8.75,.82)}const et=new fn,ct=a(new Ve(.19,.22,3.4,8),E);ct.rotation.x=Math.PI/2,ct.position.z=1.1,et.add(ct);const G=a(new Ve(.26,.26,1.3,8),y);G.rotation.x=Math.PI/2,et.add(G);const q=2.75,k=a(s(.62,.9,.7,.12),w);k.position.set(0,.05,q),et.add(k);const j=a(new Ve(.4,.36,.9,10),M);j.position.set(0,.85,q),et.add(j);const tt=a(s(.5,1.15,.32,.12),w);tt.position.set(0,-.8,q-.25),tt.rotation.x=-.55,et.add(tt),et.rotation.y=-.6,n(et,"forearmR",-vn,8.45,.1);for(const F of[-1,1]){const z=F>0?"L":"R",W=F*.95;n(a(s(1.8,4.5,1.8,.25),g),"thigh"+z,W,7.75,0),n(a(s(1.76,1.76,1.76,.6),g),"thigh"+z,W,5.3,0),n(a(s(1.74,3.9,1.74,.25),g),"shin"+z,W,3.3,0),n(a(s(1.98,1.7,2,.3),T),"shin"+z,W,1.6,0),n(a(s(1.95,.32,2.05,.1),T),"shin"+z,W,2.45,0),n(a(s(2,1.05,3.1,.4),T),"foot"+z,W,.62,.55),n(a(s(2.1,.3,3.25,.1),y),"foot"+z,W,.15,.55);for(let Q=0;Q<3;Q++)n(a(s(1,.1,.16,.04),f),"shin"+z,W,1.1+Q*.4,1.02)}n(a(s(3.95,.62,2.3,.15),p),"pelvis",0,9.05,0),n(a(s(.7,.5,.14,.06),M),"pelvis",0,9.05,1.18);for(const F of[-1,1])n(a(s(.85,1.05,.7,.18),p),"pelvis",F*1.65,8.55,1);const P=new fn;P.add(a(s(.26,1.7,.12,.05),M));const K=a(new hr(.28,.1,6,12,Math.PI*1.4),M);K.position.y=1,K.rotation.z=-Math.PI*.2,P.add(K),P.rotation.z=.2,n(P,"pelvis",-1.7,9,1.05);for(const F of t.values()){const z=i.segs.find(ot=>ot.name===F.bone).a,W=uu(F.geos);for(const ot of F.geos)ot.dispose();if(!W)throw new Error(`builder: parts on ${F.bone} would not merge`);W.translate(-z[0],-z[1],-z[2]);const Q=new ee(W,F.mat);Q.name=F.name,i.at(Q,F.bone,z[0],z[1],z[2])}for(const F of e)F.dispose()}const Kl=new WeakMap;function kv(i,t){let e=Kl.get(i);if(!e){const n=new Set;let r=null;i.traverse(s=>{const a=s.material;s.name==="bulb"&&a&&n.add(a),s.name==="star"&&a&&(r=a)}),e={bulbs:[...n],star:r},Kl.set(i,e)}for(const n of e.bulbs){const r=.5+.5*Math.sin(t*n.userData.rate+n.userData.phase);n.emissiveIntensity=.55+1.35*r*r*r}e.star&&(e.star.emissiveIntensity=1.25+.3*Math.sin(t*2.4))}const zv={id:"builder",name:"Tree Builder",blurb:"A blocky builder, decked out as a Christmas tree",segs:Lv,dress:Bv,tick:kv,fit:{size:1.06,limb:.2}},Hv=[{name:"pelvis",a:[0,9.6,0],b:[0,10.6,0],parent:null},{name:"spine1",a:[0,10.6,0],b:[0,12.4,.1],parent:"pelvis"},{name:"spine2",a:[0,12.4,.1],b:[0,15,.1],parent:"spine1"},{name:"neck",a:[0,15,.1],b:[0,15.9,.15],parent:"spine2"},{name:"head",a:[0,15.9,.15],b:[0,18.4,.3],parent:"neck"},{name:"jaw",a:[0,16.5,-.3],b:[0,15.55,1],parent:"head",reach:0},{name:"tail1",a:[0,10.4,-1],b:[0,9.6,-1.1],parent:"pelvis",reach:0},{name:"tail2",a:[0,9.6,-1.1],b:[0,8.8,-1.2],parent:"tail1",reach:0},{name:"tail3",a:[0,8.8,-1.2],b:[0,8,-1.3],parent:"tail2",reach:0},{name:"tail4",a:[0,8,-1.3],b:[0,7.2,-1.4],parent:"tail3",reach:0},{name:"thighL",a:[1.1,9.6,0],b:[1.2,5.3,.2],parent:"pelvis"},{name:"shinL",a:[1.2,5.3,.2],b:[1.2,1.1,-.1],parent:"thighL"},{name:"footL",a:[1.2,1.1,-.1],b:[1.2,.35,1.4],parent:"shinL"},{name:"thighR",a:[-1.1,9.6,0],b:[-1.2,5.3,.2],parent:"pelvis"},{name:"shinR",a:[-1.2,5.3,.2],b:[-1.2,1.1,-.1],parent:"thighR"},{name:"footR",a:[-1.2,1.1,-.1],b:[-1.2,.35,1.4],parent:"shinR"},{name:"armL",a:[2.4,14.6,0],b:[2.72,11.9,-.05],parent:"spine2"},{name:"forearmL",a:[2.72,11.9,-.05],b:[2.85,9.45,.4],parent:"armL"},{name:"armR",a:[-2.4,14.6,0],b:[-2.72,11.9,-.05],parent:"spine2"},{name:"forearmR",a:[-2.72,11.9,-.05],b:[-2.85,9.45,.4],parent:"armR"}],Kr=i=>new O(i[0],i[1],i[2]);function pu(i,t){const e=Kr(t).sub(Kr(i)).normalize(),n=new O(1,0,0).addScaledVector(e,-e.x);n.lengthSq()<1e-6&&n.set(0,0,1),n.normalize();const r=new O().crossVectors(n,e);return new ie().makeBasis(n,e,r).setPosition(i[0],i[1],i[2])}const kn=(i,t,e,n,r)=>ni(i,t,e,n,r,6,5,2);function ni(i,t,e,n,r,s=12,a=14,o=4){const c=Kr(t).distanceTo(Kr(i)),l=[];for(let u=0;u<=o;u++){const d=-Math.PI/2+u/o*(Math.PI/2);l.push(new St(Math.max(.001,e*Math.cos(d)),e*.75*Math.sin(d)))}const h=Math.min(.2,1.3*Math.max(e,r)/c);for(let u=1;u<a;u++){const d=u/a,f=n+(e-n)*Math.exp(-((d/h)**2))+(r-n)*Math.exp(-(((1-d)/h)**2));l.push(new St(f,d*c))}for(let u=0;u<=o;u++){const d=u/o*(Math.PI/2);l.push(new St(Math.max(.001,r*Math.cos(d)),c+r*.75*Math.sin(d)))}return new lc(l,s).applyMatrix4(pu(i,t))}function xe(i,t,e=[1,1,1],n=12){return new Xe(t,n,Math.max(6,Math.round(n*.7))).scale(e[0],e[1],e[2]).translate(i[0],i[1],i[2])}function Vv(i,t,e=24,n=8){return new es(new Js(i.map(Kr)),e,t,n,!1)}function Go(i,t,e=24,n=8){return[Vv(i,t,e,n),xe(i[0],t,[1,1,1],n),xe(i[i.length-1],t,[1,1,1],n)]}function cn(i){const t=uu(i.map(e=>e.index?e:e.toNonIndexed()),!1);for(const e of i)e.dispose();return t}const Gv=i=>[-i[0],i[1],i[2]];function Wa(i,t,e,n,r=6e4){const s=v=>(t.max[v]-t.min[v])*e/(e-7),a=v=>t.min[v]-2.5*s(v)/e,o=a(0)+s(0)/2,c=a(1)+s(1)/2,l=a(2)+s(2)/2,h=s(0)/2,u=s(1)/2,d=s(2)/2,f=new au(e,new ta,!1,!1,r);f.isolation=50;const m=f.field,x=e,g=40;for(let v=0;v<x;v++){const _=l+(2*v/x-1)*d;for(let S=0;S<x;S++){const b=c+(2*S/x-1)*u;for(let D=0;D<x;D++){const U=o+(2*D/x-1)*h;m[v*x*x+S*x+D]=Math.max(0,Math.min(100,50-i(U,b,_)*g))}}}f.update();const p=f.count,T=f.positionArray,y=f.normalArray,M=new Float32Array(p*3),w=new Float32Array(p*3),E=n?new Float32Array(p*3):null,A=new Yt;for(let v=0;v<p;v++){const _=o+T[v*3]*h,S=c+T[v*3+1]*u,b=l+T[v*3+2]*d;M[v*3]=_,M[v*3+1]=S,M[v*3+2]=b;let D=y[v*3]/h,U=y[v*3+1]/u,N=y[v*3+2]/d;const B=Math.hypot(D,U,N)||1;D/=B,U/=B,N/=B,w[v*3]=D,w[v*3+1]=U,w[v*3+2]=N,E&&(A.setRGB(1,1,1),n(_,S,b,A),E[v*3]=A.r,E[v*3+1]=A.g,E[v*3+2]=A.b)}f.geometry.dispose();const C=new Le;return C.setAttribute("position",new me(M,3)),C.setAttribute("normal",new me(w,3)),E&&C.setAttribute("color",new me(E,3)),C.computeBoundingSphere(),C}const Pr=(i,t,e)=>-lt(-i,-t,e),ur=[.43,17.02,1.06],jl=[.43,16.99,.74];function mu(i,t,e,n,r){const s=Math.abs(i),o=e-n,c=r,l=Math.hypot(o,c),h=(s*o+(t-e)*c)/l;return Math.max(h,n-t)}function Wv(i,t,e){const n=Math.abs(i);let r=Bt(i,t,e,0,17.45,-.12,1.1,1.13,1.32);r=lt(r,Bt(i,t,e,0,16.8,-.35,.98,.62,.95),.3),r=lt(r,Bt(i,t,e,0,16.68,.58,.8,.74,.72),.35),r=lt(r,Bt(n,t,e,.78,16.86,.55,.33,.3,.48),.22),r=lt(r,Rt(n,t,e,.86,16.8,.35,.98,16.68,-.42,.15,.13),.15),r=lt(r,Rt(n,t,e,.12,17.32,1.12,.78,17.36,.95,.17,.15),.2),r=Pr(r,-Bt(n,t,e,1.32,16.95,.05,.38,.5,.55),.18),r=Pr(r,-Bt(n,t,e,ur[0],ur[1],ur[2],.36,.34,.5),.07);const s=Math.min(mu(i,t,16.86,16.42,.19),Math.hypot(n-.08,t-16.47)-.11);return r=Pr(r,-Math.max(s,.8-e),.04),r=Pr(r,16.08-t,.1),r=Pr(r,-Bt(n,t,e,.8,16.25,.62,.22,.3,.35),.12),r}function Xv(i,t,e,n){const r=Math.abs(i),s=Bt(r,t,e,ur[0],ur[1],ur[2],.42,.4,.56),a=Math.max(Math.min(mu(i,t,16.86,16.42,.19),Math.hypot(r-.08,t-16.47)-.11),.8-e)-.06,c=Math.max(0,Math.min(1,-Math.min(s,a)/.05))*(.75+.25*Math.max(0,Math.min(1,(1.2-e)/.4)));n.copy(Kv).lerp(jv,c),c===0&&n.multiplyScalar(.94+.06*Math.max(0,Math.min(1,(t-16.3)/1.2)))}function qv(i,t,e,n,r,s,a){const o=r-e,c=s-n,l=Math.max(0,Math.min(1,((i-e)*o+(t-n)*c)/(o*o+c*c)));return Math.hypot(i-e-o*l,t-n-c*l)-a}function Yv(i,t,e){const n=Math.abs(i);let r=Rt(n,t,e,0,15.62,1,.5,15.66,.66,.17,.17);return r=lt(r,Rt(n,t,e,.5,15.66,.66,.78,15.74,-.12,.17,.16),.1),r=lt(r,Math.max(qv(t,e,15.74,-.14,16.4,-.3,.2),Math.abs(n-.8)-.07),.08),r=lt(r,Bt(n,t,e,.82,16.45,-.3,.15,.11,.13),.06),r=lt(r,Bt(i,t,e,0,15.6,1,.33,.21,.17),.1),r=lt(r,Rt(n,t,e,0,15.8,1.02,.52,15.8,.62,.12,.12),.08),r}function $v(i,t,e){const n=Math.abs(i),r=Math.abs(Math.hypot(n-.25,t-10.95,e-.75)-1.4)-.09;let s=Math.max(r,Bt(n,t,e,1.2,10.5,-.18,.78,.7,.85));return s=lt(s,Rt(n,t,e,.6,11,-.45,1.55,11.05,.2,.1,.1),.12),s=lt(s,Bt(i,t,e,0,9.95,-.78,.48,.72,.22),.15),s=lt(s,Rt(n,t,e,.38,10.35,-.72,.85,10.4,-.45,.17,.15),.12),s=lt(s,Rt(n,t,e,1.25,10.15,-.15,1,9.62,0,.24,.24),.15),s=lt(s,Te(n,t,e,.92,9.6,0,.32),.12),s=Math.min(s,Math.hypot(Math.hypot(t-9.6,e)-.36,n-1)-.1),s=lt(s,Rt(n,t,e,.95,9.48,.28,.12,9.3,.72,.15,.14),.1),s=lt(s,Rt(n,t,e,.12,9.32,.72,.1,9.02,.66,.15,.15),.1),s=lt(s,Rt(n,t,e,1,9.38,-.2,.78,8.92,-.05,.18,.17),.1),s=lt(s,Rt(n,t,e,.78,8.92,-.05,.12,9.04,.62,.13,.12),.1),s}function Xa(i,t,e,n,r){return[new Ve(t,t*1.08,e,12).translate(i[0],i[1],i[2]),new Ge(n,e*.42,.18).translate(i[0],i[1]+.02,i[2]-t*.6),new Ge(.15,e*.55,r).rotateX(.35).translate(i[0],i[1]-.05,i[2]-t-r*.42)]}function Ql(i){const t=[],e=[1.05,1.42,1.64,1.76,1.8,1.74,1.6],n=[.95,1.06,1.12,1.14,1.12,1.06,.96],r=[.32,.48,.62,.72,.8,.85,.85];for(let s=0;s<7;s++){const a=14.55-s*.4,o=e[s],c=.98,l=n[s],h=s>=5,u=[[.26,a+.04,-.78]],d=h?.74*Math.PI:Math.PI-Math.asin(Math.min(.9,.42/o));for(let f=0;f<=7;f++){const m=.14*Math.PI+f/7*(d-.14*Math.PI),x=-Math.cos(m)*(m<Math.PI/2?c:l),g=a-r[s]*Math.pow((m-.14*Math.PI)/(.86*Math.PI),1.3);u.push([o*Math.sin(m),g,x])}if(h){const f=u[u.length-1];u.push([.62,f[1]+.25+(s-5)*.2,1.02],[.26,12.62,1.06])}else u.push([.24,u[u.length-1][1]+.04,l*.98]);t.push(...Go(u.map(f=>[f[0]*i,f[1],f[2]]),s===0?.13:.12,28,7))}return t}function Jv(i,t){const e=pu(i,[i[0]+t[0],i[1]+t[1],i[2]+t[2]]),n=1.35,r=(u,d,f)=>{const m=new O(u*n,d*n,f*n).applyMatrix4(e);return[m.x,m.y,m.z]},s=[];for(const[u,d,f]of[[0,.1,.16],[0,.1,-.02],[0,.1,-.2],[.02,.3,.2],[.02,.3,0],[.02,.3,-.18]])s.push(xe(r(u,d,f),.14,[1,1,1],8));const a=[[.21,1],[.07,1.08],[-.07,1],[-.2,.82]];for(const[u,d]of a){const f=r(.02,.4,u*.85),m=r(0,.4+.55*d,u),x=r(-.07,.4+.92*d,u*1.05),g=r(-.17,.4+1.15*d,u*1.08),p=r(-.28,.4+1.3*d,u*1.08);s.push(kn(f,m,.1,.075,.105),kn(m,x,.1,.07,.095),kn(x,g,.09,.065,.085),kn(g,p,.08,.06,.065))}const o=r(0,.25,.26),c=r(-.05,.6,.48),l=r(-.1,.88,.58),h=r(-.16,1.08,.62);return s.push(kn(o,c,.11,.085,.1),kn(c,l,.1,.075,.09),kn(l,h,.09,.065,.065)),s}function Zv(){const i=[];i.push(xe([1.2,.88,0],.27)),i.push(xe([1.24,.44,-.3],1,[.27,.32,.44]));for(const[s,a,o]of[[.98,.62,.36],[1.22,.62,.34],[1.46,.55,.22],[1.08,.55,.6],[1.32,.52,.56]])i.push(xe([s,a,o],.17,[1,1,1],8));const t=[.95,1.12,1.28,1.42,1.55],e=[.84,1.08,1.3,1.5,1.68],n=[.1,.075,.07,.065,.065],r=[.42,.34,.3,.27,.24];for(let s=0;s<5;s++){const a=[t[s],.5,.62],o=[e[s],.22,1.38-s*.05];i.push(kn(a,o,n[s]*1.3,n[s],n[s]*1.35));const c=[o[0]+(s===0?-.02:.02*s),.15,o[2]+r[s]];i.push(kn(o,c,n[s]*1.05,n[s]*.8,n[s]*.85))}return i}const gu=15656396,Kv=new Yt(gu),jv=new Yt(1905164),Qv=5832490;function t_(i){const t=i.std({color:gu,roughness:.42,metalness:0,emissive:2894368,emissiveIntensity:1}),e=i.std({color:16777215,vertexColors:!0,roughness:.42,metalness:0,emissive:2894368,emissiveIntensity:1}),n=i.std({color:1182214,roughness:.9}),r=i.std({color:0,emissive:Qv,emissiveIntensity:1,roughness:1}),s=(f,m,x=t)=>{for(const g of["L","R"]){const p=new ee(f,x);p.name=`skelly-${m}${g}`,g==="R"&&(p.scale.x=-1),i.at(p,m+g,0,0,0)}},a=(f,m,x=t,g=`skelly-${m}`)=>{const p=new ee(f,x);return p.name=g,i.at(p,m,0,0,0),p},o=Wa(Wv,{min:[-1.25,15.95,-1.5],max:[1.25,18.65,1.4]},52,Xv,4e4);a(o,"head",e);const c=cn([xe(jl,.1,[1,1.1,.7],10),xe(Gv(jl),.1,[1,1.1,.7],10)]);a(c,"head",r,"skelly-embers");const l=(f,m,x,g,p)=>{const T=[];for(let y=0;y<10;y++){const M=-1.05+y/9*2.1;T.push(new sc(.075,m,2,7).scale(1,1,.75).rotateY(M).translate(x*Math.sin(M),f,p+g*Math.cos(M)))}return T};a(cn(l(16.15,.17,.6,.78,.47)),"head",t,"skelly-teeth"),a(cn([xe([0,15.98,.8],1,[.58,.24,.4])]),"head",n,"skelly-mouth"),a(Wa(Yv,{min:[-1,15.36,-.55],max:[1,16.6,1.22]},36,void 0,12e3),"jaw"),a(cn(l(15.88,.15,.56,.74,.47)),"jaw",t,"skelly-lowerteeth"),a(cn([0,1,2,3].flatMap(f=>Xa([0,15.12+f*.25,-.22],.25,.19,.72,.3))),"neck"),a(cn([...[0,1,2,3,4,5].flatMap(f=>Xa([0,12.55+f*.4,-.82],.25,.26,.6,.28)),...Ql(1),...Ql(-1),xe([0,13.55,1.08],1,[.26,1.05,.12],12),xe([0,14.42,1],1,[.36,.32,.13],10),...Go([[.22,14.72,1.02],[.85,14.86,.9],[1.55,14.98,.42],[2.18,15.02,.02]],.13,20,8),...Go([[-.22,14.72,1.02],[-.85,14.86,.9],[-1.55,14.98,.42],[-2.18,15.02,.02]],.13,20,8),xe([1.25,13.95,-1],1,[.62,.85,.09],12),xe([-1.25,13.95,-1],1,[.62,.85,.09],12)]),"spine2"),a(cn([0,1,2,3].flatMap(f=>Xa([0,10.85+f*.42,-.42],.36,.3,1.15,.45))),"spine1"),a(Wa($v,{min:[-1.75,8.72,-1.05],max:[1.75,11.2,1.05]},40,void 0,24e3),"pelvis"),s(cn([xe([2.33,14.56,-.03],.36),ni([2.4,14.45,0],[2.71,12.08,-.05],.3,.2,.28),xe([2.53,11.98,-.05],.21,[1,.9,1],10),xe([2.88,11.98,-.06],.2,[1,.9,1],10)]),"arm");const h=[2.72,11.9,-.05],u=[2.85,9.45,.4],d=[u[0]-h[0],u[1]-h[1],u[2]-h[2]];s(cn([xe([2.74,11.98,-.25],.21,[1,1.1,1],10),ni([2.76,11.85,-.2],[2.86,9.62,.22],.19,.13,.16,10),ni([2.66,11.72,.12],[2.86,9.62,.54],.16,.13,.21,10),...Jv([u[0],u[1]-.05,u[2]],d)]),"forearm"),s(cn([xe([1.12,9.62,.02],.36),ni([1.12,9.6,0],[1.55,9.24,-.03],.2,.18,.2,10),xe([1.64,9.3,-.08],.3,[1,1.2,1]),ni([1.56,9.22,0],[1.22,5.62,.18],.28,.21,.34),xe([1,5.5,.12],.29),xe([1.42,5.5,.12],.29)]),"thigh"),s(cn([ni([1.19,5.12,.18],[1.16,1.28,-.08],.36,.18,.24),xe([1,1.16,-.05],.17,[1,1.2,1],10),ni([1.52,4.95,.02],[1.47,1.3,-.16],.16,.09,.17,10),xe([1.2,5.36,.62],.27,[1,1.1,.55])]),"shin"),s(cn(Zv()),"foot")}const th=new WeakMap,e_={id:"skeleton",name:"Skelly",blurb:"Bones, a grin, and green embers for eyes",segs:Hv,dress:t_,fit:{size:1.04,limb:.3},tick(i,t){let e=th.get(i);if(!e){const r=[];i.traverse(s=>{s.name==="skelly-embers"&&r.push(s.material)}),e={jaw:i.getObjectByName("jaw")??null,embers:r},th.set(i,e)}const n=.95+.3*Math.sin(t*2.1)+.1*Math.sin(t*7.3+1.1);for(const r of e.embers)r.emissiveIntensity=n;if(e.jaw){const r=t%4.6;e.jaw.rotation.x=r<.75?.05+.07*Math.abs(Math.sin(r*25)):.02}}},fc=[{name:"pelvis",a:[0,9.6,0],b:[0,10.6,0],parent:null},{name:"spine1",a:[0,10.6,0],b:[0,12.4,.1],parent:"pelvis"},{name:"spine2",a:[0,12.4,.1],b:[0,15,.1],parent:"spine1"},{name:"neck",a:[0,15,.1],b:[0,15.9,.15],parent:"spine2",reach:.8},{name:"head",a:[0,15.9,.15],b:[0,18.4,.3],parent:"neck"},{name:"jaw",a:[0,16.4,.9],b:[0,16.4,1.2],parent:"head",reach:0},{name:"tail1",a:[0,14.8,-1.2],b:[0,12.6,-1.4],parent:"spine2",reach:1},{name:"tail2",a:[0,12.6,-1.4],b:[0,10.4,-1.6],parent:"tail1",reach:1},{name:"tail3",a:[0,10.4,-1.6],b:[0,8.2,-1.8],parent:"tail2",reach:1},{name:"tail4",a:[0,8.2,-1.8],b:[0,6.2,-2],parent:"tail3",reach:1},{name:"thighL",a:[1.1,9.6,0],b:[1.2,5.3,.2],parent:"pelvis"},{name:"shinL",a:[1.2,5.3,.2],b:[1.2,1.1,-.1],parent:"thighL"},{name:"footL",a:[1.2,1.1,-.1],b:[1.2,.35,1.4],parent:"shinL"},{name:"thighR",a:[-1.1,9.6,0],b:[-1.2,5.3,.2],parent:"pelvis"},{name:"shinR",a:[-1.2,5.3,.2],b:[-1.2,1.1,-.1],parent:"thighR"},{name:"footR",a:[-1.2,1.1,-.1],b:[-1.2,.35,1.4],parent:"shinR"},{name:"armL",a:[2.4,14.6,0],b:[2.72,11.9,-.05],parent:"spine2"},{name:"forearmL",a:[2.72,11.9,-.05],b:[2.85,9.45,.4],parent:"armL"},{name:"armR",a:[-2.4,14.6,0],b:[-2.72,11.9,-.05],parent:"spine2"},{name:"forearmR",a:[-2.72,11.9,-.05],b:[-2.85,9.45,.4],parent:"armR"}],dc={min:[-4.2,-.4,-2.8],max:[4.2,20.4,2.6]};function n_(i,t,e,n){const r=Math.abs(i),s=1-.08*n;let a=Bt(i,t,e,0,13.35,.1,1.8*s,1.95,1.05*s);return a=lt(a,Bt(r,t,e,.85*s,13.75,.75,.95*s,.68,.5),.45),a=lt(a,Bt(i,t,e,0,13.75,-.35,1.95*s,1.3,.62),.4),a=lt(a,Rt(r,t,e,0,15.35,-.2,1.85*s,14.95,-.1,.5,.36),.5),a=lt(a,Bt(i,t,e,0,11.6,.12,1.35*s,1.45,.92*s),.6),a=lt(a,Bt(i,t,e,0,10,0,1.68*s,1,1.02*s),.6),a=lt(a,Bt(r,t,e,.72,9.55,-.5,.82*s,.85,.62),.4),a=Math.max(a,-Rt(i,t,e,0,14.6,-1.12,0,10.6,-.98,.16,.14)),a=lt(a,Rt(i,t,e,0,14.9,-.05,0,16.3,.12,.6,.52),.4),a=lt(a,Bt(i,t,e,0,17.3,.1,.95,1.12,1.08),.3),a=lt(a,Bt(i,t,e,0,16.55,.4,.74,.74,.82),.35),a=lt(a,Bt(r,t,e,2.3*s,14.5,0,.7*s,.92,.78),.4),a=lt(a,Rt(r,t,e,2.4,14.4,0,2.72,11.95,-.05,.56*s,.42*s),.3),a=lt(a,Bt(r,t,e,2.56,13.15,.12,.5*s,.95,.5*s),.3),a=lt(a,Rt(r,t,e,2.72,11.9,-.05,2.85,9.6,.38,.46*s,.3*s),.25),a=lt(a,Bt(r,t,e,2.76,11.2,.05,.48*s,.8,.48*s),.3),a=lt(a,Bt(r,t,e,2.87,9,.48,.24,.52,.42),.2),a=lt(a,Rt(r,t,e,2.8,9.35,.75,2.72,8.85,.95,.15,.12),.12),a=lt(a,Rt(r,t,e,1.02,9.6,0,1.15,5.45,.2,.9*s,.56*s),.45),a=lt(a,Bt(r,t,e,1.12,7.7,.28,.8*s,1.6,.72*s),.4),a=lt(a,Bt(r,t,e,.8,8.3,0,.55*s,1.3,.6),.4),a=lt(a,Te(r,t,e,1.17,5.3,.32,.52*s),.3),a=lt(a,Rt(r,t,e,1.18,5.25,.15,1.2,1.15,-.1,.5*s,.3*s),.3),a=lt(a,Bt(r,t,e,1.2,3.95,-.28,.56*s,1.3,.6*s),.35),a=lt(a,Math.max(Bt(r,t,e,1.2,.5,.55,.46,.5,1.25),-t),.25),a}function pc(i,t,e,n,r=0){const s=Math.abs(i);let a=n_(i,t,e,n==="valkyrie"?1:0);if(n==="valkyrie"){a=lt(a,Bt(i,t,e,0,13.6,.55,2.2,1.5,1),.4);{const o=Math.max(0,Math.min(1,(10.8-t)/3.4)),c=1.6+.75*o,l=Math.hypot(i/1.05,e/.8)-c;a=Math.min(a,Math.max(l,Math.abs(t-9.1)-1.7,-(Math.hypot(i/1.05,e/.8)-c+.32)))}a=lt(a,Te(s,t,e,2.38,14.9,0,1),.3),a=lt(a,Rt(s,t,e,1.2,4.6,.35,1.2,1.4,.2,.75,.62),.2),a=lt(a,Te(i,t,e,0,17,.25,1.32),.3),a=lt(a,Bt(i,t,e,0,17.4,.2,1.42,1,1.42),.2);for(let o=0;o<3;o++)a=lt(a,Rt(s,t,e,1.3,17.6+o*.25,.2-o*.35,2.3+o*.25,19+o*.35,-1-o*.5,.32-o*.06,.1),.2);a=lt(a,Rt(i,t,e,0,16.6,-1.1,0,12.6,-1.5,.42,.26),.3);{const o=2.3+(14.8-t)*.12;a=Math.min(a,Math.max(Math.abs(i)-o,Math.abs(e+1.75+(14.8-t)*.03)-.2,t-14.8,4.6-t)-.08)}}else a=lt(a,Bt(i,t,e,0,17.3,.12,1.08,1.24,1.18),.25),a=lt(a,Bt(i,t,e,0,16.5,.45,.82,.72,.86),.25),a=lt(a,Rt(i,t,e,0,18.42,-.7,0,18.5,.85,.16,.12),.2),a=lt(a,Bt(i,t,e,0,10.55,.05,1.55,.38,1.1),.15),a=lt(a,Bt(i,t,e,0,10.55,1.05,.55,.42,.22),.1),a=lt(a,Rt(s,t,e,2.82,10.25,.3,2.86,9.5,.42,.4,.38),.15),a=lt(a,Rt(s,t,e,1.2,3.2,-.05,1.2,1,-.08,.52,.48),.2);return a-r}function mc(i,t,e,n){const r=Math.abs(i);if(n==="valkyrie")return t>17.6&&r>1.2||e<-.9&&t>12.4&&t<16.8&&r<.6?2:t>15.9&&t<17.2&&e>.6&&r<1?3:t>16.9&&t<17.3&&e>.6||Math.abs(t-10.85)<.25||t<7.6&&t>7.3||t>13.5&&t<14&&e>.8||r>2&&Math.abs(t-14.9)<.35?1:0;if(t>16.75&&t<17.5&&e>.9&&r<.95)return 2;if(Math.abs(t-10.6)<.45&&e>-1.5)return 3;if(t<3.2||t<10.4&&r>2.3&&t>8.2)return 1;if(e>.7&&r<1.7){const s=t-12.6-r*.55;if(s>0&&s<.35||s>.75&&s<1.1)return 1}return 0}const i_={id:"pumpkin",name:"Jack",blurb:"coming soon",segs:fc,body:{sdf:(i,t,e)=>pc(i,t,e,"crimson"),region:(i,t,e)=>mc(i,t,e,"crimson"),box:dc,palette:[7829367,11184810,2236962,10066329],surface:"suit"},fit:{size:1.08,limb:.7}},r_=[{name:"pelvis",a:[0,9.4,-.6],b:[0,10.4,0],parent:null},{name:"spine1",a:[0,10.4,0],b:[0,12.6,.8],parent:"pelvis"},{name:"spine2",a:[0,12.6,.8],b:[0,14.8,1.9],parent:"spine1"},{name:"neck",a:[0,14.8,1.9],b:[0,16,3],parent:"spine2",reach:1.6},{name:"head",a:[0,16,3],b:[0,16.6,5.8],parent:"neck"},{name:"jaw",a:[0,15.5,3.9],b:[0,15.3,6.6],parent:"head",reach:.8},{name:"tail1",a:[0,9.2,-1.6],b:[0,8.2,-3.6],parent:"pelvis",reach:1.8},{name:"tail2",a:[0,8.2,-3.6],b:[0,6.8,-5.2],parent:"tail1",reach:1.8},{name:"tail3",a:[0,6.8,-5.2],b:[0,5.3,-6.4],parent:"tail2",reach:1.6},{name:"tail4",a:[0,5.3,-6.4],b:[0,4,-7.2],parent:"tail3",reach:1.4},{name:"thighL",a:[1.6,9.2,-.3],b:[1.9,6,1.3],parent:"pelvis"},{name:"shinL",a:[1.9,6,1.3],b:[1.9,2.8,-.9],parent:"thighL"},{name:"footL",a:[1.9,2.8,-.9],b:[1.9,.4,1],parent:"shinL"},{name:"thighR",a:[-1.6,9.2,-.3],b:[-1.9,6,1.3],parent:"pelvis"},{name:"shinR",a:[-1.9,6,1.3],b:[-1.9,2.8,-.9],parent:"thighR"},{name:"footR",a:[-1.9,2.8,-.9],b:[-1.9,.4,1],parent:"shinR"},{name:"armL",a:[2.7,14.3,1.6],b:[3.3,11.2,2],parent:"spine2"},{name:"forearmL",a:[3.3,11.2,2],b:[3.2,8.2,3.2],parent:"armL"},{name:"armR",a:[-2.7,14.3,1.6],b:[-3.3,11.2,2],parent:"spine2"},{name:"forearmR",a:[-3.3,11.2,2],b:[-3.2,8.2,3.2],parent:"armR"}],s_={min:[-5,-.5,-8.6],max:[5,20.4,8.6]},Wn=[.62,17.05,4.75],eh=[0,16.35,7.35];function a_(i,t,e,n=0){const r=Math.abs(i);let s=Bt(i,t,e,0,13.4,1.4,2.6,2.5,2.1);s=lt(s,Bt(i,t,e,0,11.2,.4,1.7,1.6,1.4),.9),s=lt(s,Bt(i,t,e,0,9.8,-.4,2,1.2,1.5),.7),s=lt(s,Bt(i,t,e,0,15.1,1.6,2.3,1.5,2),.8),s=lt(s,Te(r,t,e,2.5,14.2,1.5,1.05),.7);let a=Bt(i,t,e,0,16.9,3.6,1.35,1.25,1.55);a=lt(a,Rt(i,t,e,0,16.7,4.6,0,16.3,7.1,.82,.45),.5),a=lt(a,Rt(i,t,e,0,15.8,4.4,0,15.75,6.7,.55,.32),.35),a=lt(a,Bt(r,t,e,1.15,16.5,3.6,.55,.75,.9),.4),a=lt(a,Rt(r,t,e,.75,17.8,3.1,1.05,19.4,2.7,.5,.06),.3),a=Math.max(a,-Te(r,t,e,Wn[0],Wn[1],Wn[2]+.12,.3)),s=lt(s,a,.6),s=lt(s,Rt(r,t,e,2.7,14.3,1.6,3.3,11.2,2,.9,.72),.5),s=lt(s,Rt(r,t,e,3.3,11.2,2,3.2,8.4,3.1,.78,.55),.35),s=lt(s,Bt(r,t,e,3.2,7.9,3.35,.55,.75,.55),.3),s=lt(s,Rt(r,t,e,1.6,9.2,-.3,1.9,6,1.3,1.25,.85),.6),s=lt(s,Rt(r,t,e,1.9,6,1.3,1.9,2.8,-.9,.75,.48),.4),s=lt(s,Rt(r,t,e,1.9,2.8,-.9,1.9,.5,.9,.5,.42),.3);const o=[[0,9.2,-1.6,.6],[0,8.2,-3.6,1],[0,6.8,-5.2,1.15],[0,5.3,-6.4,.9],[0,4,-7.2,.35]];for(let c=0;c+1<o.length;c++){const l=o[c],h=o[c+1];s=lt(s,Rt(i,t,e,l[0],l[1],l[2],h[0],h[1],h[2],l[3],h[3]),.5)}s-=n;for(const c of[-1.5,-.5,.5,1.5])s=lt(s,Rt(r,t,e,3.2+c*.17,7.4,3.5,3.2+c*.22,6.5,3.85,.17,.03),.1);for(const c of[-1,0,1])s=lt(s,Rt(r,t,e,1.9+c*.28,.4,1.2,1.9+c*.34,.1,1.85,.2,.03),.1);return s}function vu(i,t,e){const n=Math.abs(i);return Math.hypot(i,t-eh[1],e-eh[2])<.45||t<7.6&&t>6.2&&e>3.4&&n>2.6||t<.5&&e>1.2?3:t>17.4&&n>.6&&e<3.2||e<-6.3?2:t>15.4&&t<16.4&&e>4.4||t>14.6&&t<15.8&&e>2.8&&n<1.2||e>2.2&&t>10.2&&t<15&&n<1.8?1:t>12.4&&e<.8&&n<1.9&&t>12.4+.5*n?2:0}function o_(i,t,e){const n=Math.abs(i);return vu(i,t,e)===3||Math.hypot(n-Wn[0],t-Wn[1],e-Wn[2])<.65?0:e>4.6&&t>15.2?.35:t>17.6?.4:t>14&&t<16.4&&e<3.4||e<-1.4&&t<9.6?1.4:t<3?.45:1}const c_=[{name:"pelvis",a:[0,7.6,-.4],b:[0,8.8,0],parent:null},{name:"spine1",a:[0,8.8,0],b:[0,10.8,.3],parent:"pelvis"},{name:"spine2",a:[0,10.8,.3],b:[0,12.6,.6],parent:"spine1"},{name:"neck",a:[0,12.6,.6],b:[0,15.6,1.3],parent:"spine2",reach:1.9},{name:"head",a:[0,15.6,1.3],b:[0,17.6,2.4],parent:"neck"},{name:"jaw",a:[0,15.9,2.6],b:[0,15.7,4.4],parent:"head",reach:.7},{name:"tail1",a:[0,7.4,-2.6],b:[0,6.8,-3.6],parent:"pelvis",reach:1.4},{name:"tail2",a:[0,6.8,-3.6],b:[0,6.2,-4.5],parent:"tail1",reach:1.4},{name:"tail3",a:[0,6.2,-4.5],b:[0,5.7,-5.2],parent:"tail2",reach:1.2},{name:"tail4",a:[0,5.7,-5.2],b:[0,5.3,-5.7],parent:"tail3",reach:1},{name:"thighL",a:[1.4,7.4,0],b:[1.5,4.6,.3],parent:"pelvis"},{name:"shinL",a:[1.5,4.6,.3],b:[1.5,.9,-.2],parent:"thighL"},{name:"footL",a:[1.5,.9,-.2],b:[1.5,.3,1.8],parent:"shinL"},{name:"thighR",a:[-1.4,7.4,0],b:[-1.5,4.6,.3],parent:"pelvis"},{name:"shinR",a:[-1.5,4.6,.3],b:[-1.5,.9,-.2],parent:"thighR"},{name:"footR",a:[-1.5,.9,-.2],b:[-1.5,.3,1.8],parent:"shinR"},{name:"armL",a:[2.7,11.6,.2],b:[3.3,9.2,-.1],parent:"spine2"},{name:"forearmL",a:[3.3,9.2,-.1],b:[3.2,7,.3],parent:"armL"},{name:"armR",a:[-2.7,11.6,.2],b:[-3.3,9.2,-.1],parent:"spine2"},{name:"forearmR",a:[-3.3,9.2,-.1],b:[-3.2,7,.3],parent:"armR"}],l_={min:[-5,-.4,-7.2],max:[5,21.4,6.6]},Xn=[.72,17.25,2.75];function h_(i,t,e,n=0){const r=Math.abs(i);let s=Bt(i,t,e,0,9.2,-.2,3.3,3.5,3);s=lt(s,Bt(i,t,e,0,11.4,.5,2.5,2.2,2.3),1),s=lt(s,Rt(i,t,e,0,12.2,.5,0,15.8,1.4,1.25,.95),.8);let a=Te(i,t,e,0,16.9,1.8,1.55);a=lt(a,Rt(i,t,e,0,16.55,2.9,0,16.1,5,.72,.18),.3),a=lt(a,Rt(i,t,e,0,15.85,2.8,0,15.75,4.4,.5,.14),.25);for(const[o,c]of[[0,1],[.6,.82],[-.6,.82]])a=lt(a,Rt(i,t,e,o*.5,18.1,1.6,o*1.3,18.1+2.7*c,1-.7*c,.34,.12),.3);a=Math.max(a,-Te(r,t,e,Xn[0],Xn[1],Xn[2],.5)),s=lt(s,a,.5),s=lt(s,Bt(r,t,e,3,9.8,0,.75,2.6,1.7),.7);for(const o of[-1,0,1])s=lt(s,Rt(r,t,e,3.2,8.4,o*.6,3.25,6.6+Math.abs(o)*.4,o*.75+.2,.42,.14),.3);for(const o of[-1,0,1])s=lt(s,Rt(i,t,e,o*.3,7.6,-2.6,o*1.1,7+(1-Math.abs(o))*.5,-5.6,.5,.2),.4);s=lt(s,Rt(r,t,e,1.4,7.4,0,1.5,4.8,.3,1,.55),.5),s=lt(s,Rt(r,t,e,1.5,4.8,.3,1.5,1,-.2,.42,.36),.25),s-=n;for(const o of[-1,0,1])s=lt(s,Rt(r,t,e,1.5,.5,.1,1.5+o*.85,.3,2-Math.abs(o)*.3,.34,.16),.2);return s=lt(s,Rt(r,t,e,1.5,.5,-.2,1.5,.3,-1.1,.3,.14),.15),s}function _u(i,t,e){const n=Math.abs(i);return t>15.6&&t<17.1&&e>2.6&&n<.85||t<5&&n>.9&&n<2.6||t<1?3:t>18.4||e<-4.6?2:e>1.2&&t>9.4&&t<13.4&&n<1.8||e>2.2&&t>16.2&&t<18.2&&n<1.25?1:0}function u_(i,t,e){const n=Math.abs(i),r=_u(i,t,e);return r===3||Math.hypot(n-Xn[0],t-Xn[1],e-Xn[2])<.9?0:r===2?.6:t>16?.45:t>14.6&&e>1.6?.3:t>12.2?1.25:e<-2.4?1.4:1}const gc=[{name:"pelvis",a:[0,9.2,0],b:[0,10.4,0],parent:null},{name:"spine1",a:[0,10.4,0],b:[0,12.4,.1],parent:"pelvis"},{name:"spine2",a:[0,12.4,.1],b:[0,15.4,.2],parent:"spine1"},{name:"neck",a:[0,15.4,.2],b:[0,16.2,.3],parent:"spine2",reach:.9},{name:"head",a:[0,16.2,.3],b:[0,18.4,.6],parent:"neck"},{name:"jaw",a:[0,16.4,1.2],b:[0,16.4,1.6],parent:"head",reach:0},{name:"tail1",a:[0,9.2,-.5],b:[0,9,-1],parent:"pelvis",reach:0},{name:"tail2",a:[0,9,-1],b:[0,8.8,-1.5],parent:"tail1",reach:0},{name:"tail3",a:[0,8.8,-1.5],b:[0,8.6,-2],parent:"tail2",reach:0},{name:"tail4",a:[0,8.6,-2],b:[0,8.4,-2.5],parent:"tail3",reach:0},{name:"thighL",a:[2.1,9.2,0],b:[2.3,5.2,.3],parent:"pelvis"},{name:"shinL",a:[2.3,5.2,.3],b:[2.3,1.2,-.1],parent:"thighL"},{name:"footL",a:[2.3,1.2,-.1],b:[2.3,.4,1.8],parent:"shinL"},{name:"thighR",a:[-2.1,9.2,0],b:[-2.3,5.2,.3],parent:"pelvis"},{name:"shinR",a:[-2.3,5.2,.3],b:[-2.3,1.2,-.1],parent:"thighR"},{name:"footR",a:[-2.3,1.2,-.1],b:[-2.3,.4,1.8],parent:"shinR"},{name:"armL",a:[4.1,14.7,.2],b:[4.5,11.6,.4],parent:"spine2"},{name:"forearmL",a:[4.5,11.6,.4],b:[4.5,8.4,1],parent:"armL"},{name:"armR",a:[-4.1,14.7,.2],b:[-4.5,11.6,.4],parent:"spine2"},{name:"forearmR",a:[-4.5,11.6,.4],b:[-4.5,8.4,1],parent:"armR"}],f_={min:[-6.4,-.4,-4.4],max:[6.4,19.8,4]};function Ee(i,t,e,n,r,s,a,o,c,l){const h=Math.abs(i-n)-a+l,u=Math.abs(t-r)-o+l,d=Math.abs(e-s)-c+l;return Math.hypot(Math.max(h,0),Math.max(u,0),Math.max(d,0))+Math.min(Math.max(h,u,d),0)-l}function nh(i,t,e,n,r,s,a,o,c){const l=Math.abs(i-n)-a+c,h=Math.hypot(t-r,e-s)-o+c;return Math.hypot(Math.max(l,0),Math.max(h,0))+Math.min(Math.max(l,h),0)-c}function xu(i,t,e,n,r,s,a,o){let c=i-n,l=t-r,h=e-s;const u=Math.cos(a),d=Math.sin(a);[c,h]=[c*u-h*d,c*d+h*u];const f=Math.cos(o),m=Math.sin(o);return[c,l]=[c*f+l*m,-c*m+l*f],[c,l,h]}const He={hx:1.5,hy:14.6,hz:-2.15,yaw:.4,roll:.62,w:1.1,h:.85,t:.12};function d_(i,t,e){const[n,r,s]=xu(i,t,e,He.hx,He.hy,He.hz,He.yaw,He.roll);return Ee(n,r,s,He.w,He.h,0,He.w,He.h,He.t,.1)}function p_(i,t,e,n=0){const r=Math.abs(i);let s=1e9;{const a=Ee(i,t,e,0,13.75,.25,2.9,1.75,1.75,.3),o=(e-(2-Math.max(0,t-13.4)*.6))*.86;s=Math.max(a,o)}return s=lt(s,Ee(i,t,e,0,12.2,.3,2.3,.6,1.5,.3),.3),s=Math.min(s,Ee(i,t,e,0,12.55,1.95,2.5,.22,.28,.1)),s=Math.min(s,Ee(r,t,e,2.2,13.1,1.92,.42,.26,.15,.08)),s=Math.min(s,Ee(i,t,e,0,11.1,.75,1.15,.9,.55,.25)),s=lt(s,Ee(i,t,e,0,11,0,1.2,1,1.05,.3),.2),s=lt(s,Ee(i,t,e,0,9.75,0,2.2,.75,1.4,.3),.25),s=Math.min(s,Ee(i,t,e,0,9.45,1.35,.7,.7,.25,.15)),s=Math.min(s,Ee(i,t,e,0,13.5,-1.85,2.2,1.6,.55,.25)),s=Math.min(s,d_(r,t,e)),s=Math.min(s,Rt(i,t,e,0,15.3,.25,0,16.3,.35,.6,.55)),s=Math.min(s,Ee(i,t,e,0,17.25,.45,.82,.92,.9,.35)),s=Math.min(s,Ee(i,t,e,0,16.55,.95,.55,.38,.42,.18)),s=Math.min(s,Ee(i,t,e,0,18.2,.35,.12,.35,.75,.08)),s=Math.min(s,Ee(r,t,e,.95,17.55,.25,.12,.62,.3,.08)),s=Math.min(s,Ee(r,t,e,4.05,15.05,.2,1.15,.8,1.35,.3)),s=Math.min(s,nh(r,t,e,5.4,14.7,.2,.32,.92,.12)),s=Math.min(s,Te(r,t,e,4.1,14.4,.2,.75)),s=Math.min(s,Rt(r,t,e,4.1,14.2,.2,4.5,11.8,.4,.62,.58)),s=Math.min(s,Te(r,t,e,4.5,11.6,.4,.72)),s=Math.min(s,Ee(r,t,e,4.55,10,.6,.9,1.5,1,.3)),s=Math.min(s,Ee(r,t,e,4.55,8.05,1,.75,.75,.8,.28)),s=Math.min(s,Rt(r,t,e,2.1,9.1,0,2.3,5.6,.25,1.05,.95)),s=Math.min(s,Ee(r,t,e,2.3,5.25,.85,.85,.75,.55,.25)),s=Math.min(s,Ee(r,t,e,2.3,3,.05,1.25,2.15,1.35,.35)),s=Math.min(s,nh(r,t,e,3.75,2.6,-.35,.3,.9,.12)),s=Math.min(s,Ee(r,t,e,2.3,.5,.65,1.15,.5,2,.2)),s-n}function m_(i,t,e){const n=Math.abs(i);if(n>5&&Math.hypot(t-14.7,e-.2)<1)return Math.hypot(t-14.7,e-.2)<.42?1:5;if(n>3.38&&Math.hypot(t-2.6,e+.35)<.98)return Math.hypot(t-2.6,e+.35)<.4?1:5;if(t>16.95&&t<17.3&&e>1.2&&n>.12&&n<.62||t>12.85&&t<13.35&&e>1.95&&n>1.85&&n<2.6)return 2;if(t>13.55&&t<15.35&&n<2.55&&n>.18&&e>1.75-Math.max(0,t-13.4)*.6)return 4;if(t>16.15&&t<16.95&&e>1.25&&n<.6)return 6;if(e<-1.9&&t>13.8){const[r,s,a]=xu(n,t,e,He.hx,He.hy,He.hz,He.yaw,He.roll);if(Math.abs(a)<.3&&r>.25&&r<1.75&&s>.85&&s<1.5)return 4}return t>12.3&&t<12.8&&e>1.65||t>14.25&&t<15.9&&n>2.9&&n<5.15||t>4.5&&t<6&&e>.4&&n>1.4&&n<3.2||t<1.1&&e>1.6||t>17.9&&n<.2?1:Math.hypot(n-4.1,t-14.4,e-.2)<.85&&t<14.25||Math.hypot(n-4.5,t-11.6,e-.4)<.8||t>15.2&&t<16.2&&n<.7||t>10.2&&t<11.6&&e<1.25&&n<1.25?3:0}function fe(i,t,e,n,r,s,a,o,c,l){const h=Math.abs(i-n)-a+l,u=Math.abs(t-r)-o+l,d=Math.abs(e-s)-c+l;return Math.hypot(Math.max(h,0),Math.max(u,0),Math.max(d,0))+Math.min(Math.max(h,u,d),0)-l}const g_={min:[-6.8,-.4,-4.6],max:[6.8,20.2,5]};function v_(i,t,e,n=0){const r=Math.abs(i);let s=1e9;s=Math.min(s,fe(i,t,e,0,13.6,.2,3.1,2.1,2,.5)),s=Math.min(s,Bt(i,t,e,0,14.3,2.15,1.05,.7,.75)),s=Math.min(s,fe(i,t,e,0,12.4,2,.9,1,.4,.3)),s=Math.min(s,fe(r,t,e,1.7,15.6,-2.3,.18,2.4,1.1,.12)),s=Math.min(s,fe(i,t,e,0,13,-2.3,2.2,1.6,.6,.3)),s=lt(s,fe(i,t,e,0,11.2,.1,1.9,1.1,1.35,.35),.3),s=lt(s,fe(i,t,e,0,9.7,0,2.5,.95,1.55,.3),.3),s=Math.min(s,fe(i,t,e,0,9.4,1.4,.8,.9,.35,.2)),s=Math.min(s,Rt(i,t,e,0,15.3,.2,0,16.4,.3,.75,.7)),s=Math.min(s,fe(i,t,e,0,17.2,.4,1,1,1.1,.4)),s=Math.min(s,fe(i,t,e,0,16.6,1.25,.65,.45,.35,.15)),s=Math.min(s,fe(i,t,e,0,18.6,.3,.13,.75,.9,.08)),s=Math.min(s,Rt(r,t,e,.95,17.7,.4,1.5,18.5,.2,.2,.08)),s=Math.min(s,fe(r,t,e,4.2,15.4,.1,1.55,.85,1.7,.35)),s=Math.min(s,Rt(r,t,e,4.2,15.5,1.6,4.2,15.5,3.9,.3,.26)),s=Math.min(s,Te(r,t,e,4.1,14.4,.2,1)),s=Math.min(s,Rt(r,t,e,4.1,14.2,.2,4.5,11.8,.4,.85,.8)),s=Math.min(s,Te(r,t,e,4.5,11.6,.4,.9)),s=Math.min(s,fe(r,t,e,4.8,10,.6,1,1.7,1.3,.3)),s=Math.min(s,fe(r,t,e,5.85,10,.6,.22,1.8,1.35,.18)),s=Math.min(s,fe(r,t,e,4.75,7.9,1,.85,.85,.95,.3)),s=Math.min(s,Rt(r,t,e,2.1,9.1,0,2.3,5.8,.25,1.15,1.1)),s=Math.min(s,fe(r,t,e,2.3,5.4,.6,1.15,1.05,1,.3)),s=Math.min(s,fe(r,t,e,2.3,3,0,1.2,2,1.25,.3));for(const a of[3.8,1.9])s=Math.min(s,Rt(r,t,e,3.35,a,-.4,3.75,a,-.4,.75,.75));return s=Math.min(s,fe(r,t,e,2.3,.55,.65,1.15,.55,2,.2)),s-n}function __(i,t,e){const n=Math.abs(i),r=i>0;return t>13.7&&t<15&&e>1.6&&n<1.1||t>16.5&&t<17&&e>1.4&&n<.5&&n>.12?2:n>3.9&&n<4.5&&t>15.1&&t<15.9&&e>1.7||n>5.55&&t>8.2&&t<11.8||n>3.1&&t<4.6&&t>1.1&&e<.4||t>5.5&&t<6.3&&e>1.4&&n>1.3&&n<3.3||Math.hypot(n-4.1,t-14.4,e-.2)<1.05&&t<14.6||Math.hypot(n-4.5,t-11.6,e-.4)<.95&&t>11.3||t>10.7&&t<11&&n<2||t>8.6&&t<8.9&&n>1&&n<3.6?3:n>3.55&&t>6.4&&t<16.4||n>2.9&&t>11.4&&t<16.4?r?4:5:t<8.8&&n>.95?r?6:7:t>15.2||n>1.4&&n<2&&e<-1.2||t<11.3||e<-1.7?1:0}const x_={min:[-7.6,-.4,-6.6],max:[7.6,21,4.4]};function M_(i,t,e,n,r,s,a,o,c,l,h,u){const d=(r+o)/2;return Rt(i,d+(t-d)/u,e,n,r,s,a,o,c,l,h)*u}function S_(i,t,e,n,r,s,a,o,c,l,h,u){const d=(n+a)/2;return Rt(d+(i-d)/u,t,e,n,r,s,a,o,c,l,h)*u}function y_(i,t,e,n=0){const r=Math.abs(i);let s=1e9;return s=Math.min(s,fe(i,t,e,0,13.7,.1,2.5,1.9,1.7,.6)),s=Math.min(s,Bt(i,t,e,0,14.4,1.75,.95,.75,.85)),s=lt(s,fe(i,t,e,0,11.4,0,1.5,1.2,1.15,.4),.4),s=lt(s,fe(i,t,e,0,9.8,0,2.2,.85,1.35,.35),.3),s=Math.min(s,Rt(i,t,e,0,15.2,-2,0,10.8,-2.3,.75,.2)),s=Math.min(s,M_(r,t,e,1.4,13.6,-2.2,6.8,12.4,-5.6,1.9,.4,.17)),s=Math.min(s,S_(r,t,e,1.5,14.2,-2.4,1.65,17.8,-3.7,.95,.22,.2)),s=Math.min(s,fe(r,t,e,3.4,15.2,.2,1.15,.9,1.5,.3)),s=Math.min(s,fe(r,t,e,3.4,16.4,-.1,.85,.45,1.1,.2)),s=Math.min(s,Rt(i,t,e,0,15.3,.1,0,16.3,.2,.6,.55)),s=Math.min(s,Bt(i,t,e,0,17.1,.35,.85,1,1.15)),s=Math.min(s,Rt(r,t,e,.45,17.8,.6,1,19.4,-.9,.16,.05)),s=Math.min(s,Te(r,t,e,4.1,14.5,.2,.8)),s=Math.min(s,Rt(r,t,e,4.1,14.3,.2,4.5,11.8,.4,.65,.6)),s=Math.min(s,Te(r,t,e,4.5,11.6,.4,.7)),s=Math.min(s,fe(r,t,e,4.5,10,.6,.8,1.6,.85,.3)),s=Math.min(s,fe(r,t,e,4.5,8,.95,.6,.65,.6,.25)),s=Math.min(s,Rt(r,t,e,2.1,9.1,0,2.3,5.6,.25,1.1,1)),s=Math.min(s,fe(r,t,e,2.3,5.2,.7,.75,.65,.5,.25)),s=Math.min(s,Rt(r,t,e,2.3,4.8,-.1,2.3,1.7,-.3,1.25,1.15)),s=Math.min(s,Rt(r,t,e,2.3,1.6,-.6,2.3,1.1,-1.4,1,1.1)),s=Math.min(s,fe(r,t,e,2.3,.45,.9,.75,.45,1.5,.2)),s-n}function b_(i,t,e){const n=Math.abs(i);return t>13.8&&t<15.1&&e>1.2&&n<1||t>16.8&&t<17.4&&e>1&&n<.75?2:t<1.9&&e<-.9||Math.hypot(n-4.1,t-14.5,e-.2)<.85&&t<14.5||Math.hypot(n-4.5,t-11.6,e-.4)<.75||t>10.4&&t<10.8&&n<1.6?3:n>2.5&&n<4.3&&t>16&&t<16.9||e<-1.9&&n>1.5&&n<7&&Math.abs(t-(13.6-(n-1.4)*.22))<.3||t>12.6&&t<13&&n<2.3&&e>.8?4:n>3.6&&t<13.8&&t>7.2||t<5&&n>1?1:0}function Oi(i){const t=!!i.mech,e=!!i.cape,n=i.tail??null;return(r,s,a,o)=>r.name.startsWith("thigh")?o>-1.6&&a<r.a[1]+(t?1.4:.8)&&Math.abs(Math.abs(s)-Math.abs(r.a[0]))<(a<r.a[1]+.3?t?1.45:1.3:t?1.4:.9):r.name.startsWith("tail")?n!==null?o<n:e&&o<-1.55:!t&&(r.name.startsWith("arm")||r.name.startsWith("forearm"))?Math.abs(s)>2:t&&r.name.startsWith("arm")?o>-1.5:!0}const Mu=(i,t,e=2.2)=>i.std({color:t,emissive:t,emissiveIntensity:e,roughness:.3}),E_={id:"crimson",name:"Crimson",blurb:"A suited hero, visor and all",segs:fc,body:{sdf:(i,t,e)=>pc(i,t,e,"crimson"),region:(i,t,e)=>mc(i,t,e,"crimson"),box:dc,palette:[13114922,16053492,1052692,12633292],surface:"suit",capture:Oi({})},dress(i){const t=i.std({color:526348,roughness:.08,metalness:.6});for(const e of[-1,1]){const n=new ee(new Ge(1,.38,.4),t);n.rotation.set(0,e*.42,e*-.32),i.at(n,"head",e*.46,17.12,1.12)}},fit:{size:1.08,limb:.7}},T_={id:"valkyrie",name:"Valkyrie",blurb:"Winged helm, spear and shield",segs:fc,body:{sdf:(i,t,e)=>pc(i,t,e,"valkyrie"),region:(i,t,e)=>mc(i,t,e,"valkyrie"),box:dc,palette:[7028640,14725184,15657716,15251606],surface:"suit",capture:Oi({cape:!0})},dress(i){const t=i.std({color:1708064,roughness:.2});for(const h of[-1,1]){const u=new ee(new Xe(.17,12,8),t);u.scale.set(1,1.3,.6),i.at(u,"head",h*.42,16.8,1.5)}const e=i.std({color:5916210,roughness:.6}),n=i.std({color:14211296,roughness:.25,metalness:.85}),r=new fn;r.add(new ee(new Ve(.16,.16,17,10),e));const s=new ee(new ea(.42,2.4,10),n);s.position.y=9.6,r.add(s),i.at(r,"forearmR",-2.9,11,.85);const a=new fn,o=new ee(new Ve(2.1,2.1,.3,28),i.std({color:7028640,roughness:.4,metalness:.3}));o.rotation.z=Math.PI/2,a.add(o);const c=new ee(new hr(2.1,.16,8,32),i.std({color:14725184,roughness:.3,metalness:.7}));c.rotation.y=Math.PI/2,a.add(c);const l=new ee(new Xe(.55,14,10),n);l.position.x=.2,a.add(l),i.at(a,"forearmL",3.38,10.4,.45)},fit:{size:1.08,limb:.7},idle:{tail:.05}},w_={id:"howler",name:"Howler",blurb:"A wolf man with amber eyes",segs:r_,body:{sdf:(i,t,e)=>a_(i,t,e),region:vu,box:s_,palette:[7827562,12103584,3420204,1183760],capture:Oi({tail:-1.5}),fur:{length:.8,density:7,tip:.22},furLen:o_},dress(i){const t=Mu(i,16756768,1.8);for(const e of[-1,1]){const n=new ee(new Xe(.24,12,8),t);n.scale.set(1.2,.8,.8),i.at(n,"head",e*Wn[0],Wn[1],Wn[2])}},fit:{size:1.1,limb:.6},idle:{tail:.25}},A_={id:"plume",name:"Plume",blurb:"A big, friendly, feathered bird",segs:c_,body:{sdf:(i,t,e)=>h_(i,t,e),region:_u,box:l_,palette:[16036872,16770976,15224972,15762468],surface:"soft",capture:Oi({tail:-2.4}),fur:{length:1.5,density:1.6,tip:.3,feather:!0},furLen:u_},dress(i){const t=i.std({color:16316660,roughness:.2}),e=i.std({color:657936,roughness:.1});for(const n of[-1,1]){const r=new ee(new Xe(.52,18,12),t),s=new ee(new Xe(.24,12,8),e);s.position.set(-n*.1,.02,.36),s.scale.set(1,1.2,.6),r.add(s),i.at(r,"head",n*Xn[0],Xn[1],Xn[2])}},fit:{size:1.12,limb:.5},idle:{tail:.15}};function vc(i,t){return e=>{const n=Mu(e,t);if(i==="bastion"){for(const a of[-1,1]){const o=new ee(new Ge(.42,.2,.1),n);o.rotation.z=a*-.12,e.at(o,"head",a*.36,17.12,1.36);const c=new ee(new Ge(.62,.36,.1),n);e.at(c,"spine2",a*2.2,13.1,2.08)}return}const r=i==="unison",s=new ee(new Xe(1,20,12),n);if(s.scale.set(r?.95:.85,r?.55:.6,r?.45:.35),e.at(s,"spine2",0,14.35,r?2.55:1.95),r)for(const a of[-1,1]){const o=new ee(new Ge(.42,.16,.1),n);o.rotation.z=a*.25,e.at(o,"head",a*.32,16.85,1.62)}else e.at(new ee(new Ge(1.3,.3,.12),n),"head",0,17.1,1.42);if(r){const a=e.std({color:14673130,roughness:.2,metalness:.9}),o=e.std({color:14198832,roughness:.3,metalness:.8}),c=new fn,l=new ee(new Ge(.22,8,.9),a);l.position.y=-4.5,c.add(l);const h=new ee(new ea(.64,1.4,4),a);h.rotation.z=Math.PI,h.position.y=-9.2,h.scale.set(.35,1,1),c.add(h),c.rotation.x=-.95;const u=new ee(new Ge(.5,.4,3),o);u.position.y=-.3,c.add(u);const d=new ee(new Ve(.22,.22,1.6,8),o);d.position.y=.6,c.add(d),e.at(c,"forearmR",-4.75,8,2.1)}}}const R_={id:"bastion",name:"Bastion",blurb:"An armoured truck that stands up",segs:gc,body:{sdf:(i,t,e)=>p_(i,t,e),region:m_,box:f_,palette:[4871266,14262322,9431295,1842980,7118020,1316377,12896462],surface:"armour",weights:"rigid",capture:Oi({mech:!0})},dress:vc("bastion",9431295),fit:{size:1,limb:.6}},C_={id:"kestrel",name:"Kestrel",blurb:"A jet that stands up",segs:gc,body:{sdf:(i,t,e)=>y_(i,t,e),region:b_,box:x_,palette:[15132908,5661306,16756800,1842980,13117498],surface:"armour",weights:"rigid",capture:Oi({mech:!0})},dress:vc("kestrel",16756800),fit:{size:1,limb:.6}},L_={id:"unison",name:"Unison",blurb:"Five machines locked into one",segs:gc,body:{sdf:(i,t,e)=>v_(i,t,e),region:__,box:g_,palette:[15527666,2503274,8382719,1842980,15234090,2271388,15254056,12855866],surface:"armour",weights:"rigid",capture:Oi({mech:!0})},dress:vc("unison",8382719),fit:{size:1,limb:.6}},nn=[Cv,zv,e_,i_,w_,E_,T_,A_,R_,C_,L_],Fi=i=>nn.find(t=>t.id===i)??nn[0],P_=i=>new O(i.x,i.y,i.z),Qi=(i,t,e)=>{const n=Math.min(1,Math.max(0,(e-i)/(t-i)));return n*n*(3-2*n)};function ih(i,t){const e=t.clone().normalize(),n=new O().crossVectors(i,e).normalize(),r=new O().crossVectors(e,n).normalize();return new We().setFromRotationMatrix(new ie().makeBasis(r,e,n))}function D_(i,t){const e=i.clone().normalize(),n=new O().crossVectors(t,e).normalize(),r=new O().crossVectors(e,n).normalize();return new We().setFromRotationMatrix(new ie().makeBasis(e,n,r))}function I_(i){const t=M=>P_(i[M]),e=(...M)=>Math.min(...M.map(w=>i[w].v)),n=t(X.hipL),r=t(X.hipR),s=t(X.shL),a=t(X.shR),o=n.clone().add(r).multiplyScalar(.5),c=s.clone().add(a).multiplyScalar(.5),l=c.clone().sub(o),h=ih(n.clone().sub(r),l),u=ih(s.clone().sub(a),l),d=t(X.earL),f=t(X.earR),m=t(X.nose),x=d.clone().add(f).multiplyScalar(.5),g=D_(d.clone().sub(f),m.clone().sub(x));g.multiply(new We().setFromAxisAngle(new O(1,0,0),-.32));const p=(M,w)=>t(w).sub(t(M)).normalize(),T={armL:p(X.shL,X.elL),forearmL:p(X.elL,X.wrL),armR:p(X.shR,X.elR),forearmR:p(X.elR,X.wrR),thighL:p(X.hipL,X.knL),shinL:p(X.knL,X.anL),footL:p(X.heelL,X.toeL),thighR:p(X.hipR,X.knR),shinR:p(X.knR,X.anR),footR:p(X.heelR,X.toeR)},y={armL:e(X.shL,X.elL),forearmL:e(X.elL,X.wrL),armR:e(X.shR,X.elR),forearmR:e(X.elR,X.wrR),thighL:e(X.hipL,X.knL),shinL:e(X.knL,X.anL),footL:e(X.heelL,X.toeL),thighR:e(X.hipR,X.knR),shinR:e(X.knR,X.anR),footR:e(X.heelR,X.toeR)};return{pelvis:h,chest:u,head:g,headVis:e(X.earL,X.earR,X.nose),neck:x.sub(c).normalize(),dir:T,vis:y}}const U_={armL:new O(1,0,0),armR:new O(-1,0,0),thighL:new O(0,-1,0),thighR:new O(0,-1,0),neck:new O(0,1,0)},rh={forearmL:"armL",forearmR:"armR",shinL:"thighL",shinR:"thighR",footL:"shinL",footR:"shinR"};class N_{bones;rest=new Map;qm=new Map;hipRest;pelvisA;torso;len=new Map;segs;constructor(t,e){this.segs=t,this.bones=e;const n=l=>t.find(h=>h.name===l);for(const l of t){const h=new O(l.b[0]-l.a[0],l.b[1]-l.a[1],l.b[2]-l.a[2]);this.len.set(l.name,h.length()),h.lengthSq()>1e-9?h.normalize():h.set(0,1,0);const u=l.parent?n(l.parent):null,d=u?new O(l.a[0]-u.a[0],l.a[1]-u.a[1],l.a[2]-u.a[2]):new O(...l.a);let f=U_[l.name];if(!f&&rh[l.name]){const m=n(rh[l.name]);f=new O(m.b[0]-m.a[0],m.b[1]-m.a[1],m.b[2]-m.a[2]).normalize(),l.name.startsWith("foot")&&(f=h.clone())}f??=h.clone(),this.rest.set(l.name,{dir:h,offset:d,pre:new We().setFromUnitVectors(h,f),canon:f})}this.pelvisA=new O(...n("pelvis").a);const r=n("thighL").a,s=n("thighR").a,a=n("armL").a,o=n("armR").a;this.hipRest=new O((r[0]+s[0])/2,(r[1]+s[1])/2,(r[2]+s[2])/2);const c=new O((a[0]+o[0])/2,(a[1]+o[1])/2,(a[2]+o[2])/2);this.torso=c.distanceTo(this.hipRest)}setLength(t,e){const n=this.segs.find(a=>a.parent===t&&!a.name.startsWith("tail")&&a.name!=="jaw");if(!n)return;const r=this.bones.get(n.name),s=this.rest.get(n.name);r.position.copy(s.offset).multiplyScalar(e)}neckFit(t){const e=l=>this.segs.find(h=>h.name===l),n=e("spine2"),r=e("neck"),s=e("head"),a=(e("armL").a[1]+e("armR").a[1])/2-n.a[1],o=r.a[1]-n.a[1]+(s.a[1]-r.a[1]),c=(s.a[1]+s.b[1])/2-s.a[1];return o>.001?(a+t-c)/o:1}setNeck(t){for(const e of["neck","head"]){const n=this.bones.get(e),r=this.rest.get(e);n&&r&&n.position.copy(r.offset).multiplyScalar(t)}}swing(t,e,n,r){const s=this.rest.get(t),a=n.clone().applyQuaternion(e.clone().invert()).normalize(),o=new We().setFromUnitVectors(s.canon,a).multiply(s.pre);return r<1&&o.slerp(new We,1-Math.max(0,r)),o}set(t,e,n){const r=this.bones.get(t);r&&r.quaternion.copy(e);const s=n?n.clone().multiply(e):e.clone();return this.qm.set(t,s),s}apply(t,e=0,n=0){const r=this.set("pelvis",t.pelvis,null),s=this.hipRest.clone().sub(this.pelvisA).applyQuaternion(t.pelvis);this.bones.get("pelvis").position.copy(s.negate());const a=t.pelvis.clone().slerp(t.chest,.5),o=this.set("spine1",r.clone().invert().multiply(a),r),c=this.set("spine2",o.clone().invert().multiply(t.chest),o),l=Qi(.3,.7,t.headVis),h=this.set("neck",this.swing("neck",c,t.neck,l*.6),c),u=h.clone().invert().multiply(t.head);l<1&&u.slerp(new We,1-l),this.set("head",u,h);for(const f of["L","R"]){const m=this.set("arm"+f,this.swing("arm"+f,c,t.dir[`arm${f}`],Qi(.35,.7,t.vis[`arm${f}`])),c);this.set("forearm"+f,this.swing("forearm"+f,m,t.dir[`forearm${f}`],Qi(.35,.7,t.vis[`forearm${f}`])),m);const x=this.set("thigh"+f,this.swing("thigh"+f,r,t.dir[`thigh${f}`],Qi(.4,.75,t.vis[`thigh${f}`])),r),g=this.set("shin"+f,this.swing("shin"+f,x,t.dir[`shin${f}`],Qi(.4,.75,t.vis[`shin${f}`])),x);this.set("foot"+f,this.swing("foot"+f,g,t.dir[`foot${f}`],Qi(.5,.8,t.vis[`foot${f}`])),g)}let d=r;for(let f=1;f<=4;f++){const m="tail"+f;if(!this.bones.has(m))break;const x=new We().setFromEuler(new dn(0,Math.sin(e*2.1-f*.7)*n,Math.sin(e*1.3-f*.5)*n*.3));d=this.set(m,x,f===1?this.qm.get(this.segs.find(g=>g.name==="tail1")?.parent??"pelvis")??r:d)}}dirOf(t){return this.rest.get(t).dir.clone().applyQuaternion(this.qm.get(t))}}const tr=64,Dr=32,ln=48,bn=36,er=12,Fs=9,hn={spread:1.6,back:.9,envIntensity:1.15,key:5,every:6,targetMean:.2,maxGain:2.6},qa=new Float32Array(256).map((i,t)=>{const e=t/255;return e<=.04045?e/12.92:Math.pow((e+.055)/1.055,2.4)});class F_{constructor(t,e,n){this.renderer=t,this.scene=e,this.cv=document.createElement("canvas"),this.cv.width=ln,this.cv.height=bn,this.ctx=this.cv.getContext("2d",{willReadFrequently:!0}),this.tex=new kh(this.data,tr,Dr,tn,_r),this.tex.mapping=Xs,this.tex.colorSpace=Ii,this.tex.magFilter=Fe,this.tex.minFilter=Fe,this.pmrem=new Ho(t),this.key.castShadow=!0,this.key.shadow.mapSize.set(1024,1024),this.key.shadow.bias=-5e-4,this.key.shadow.normalBias=.02,this.key.shadow.radius=4,e.add(this.key),e.add(this.key.target),e.add(this.fill),this.fill.intensity=1}key=new Mp(16777215,1);fill=new vp(16777215,4473924,0);cv;ctx;lin=new Float32Array(ln*bn*3);blur=new Float32Array(er*Fs*3);data=new Uint16Array(tr*Dr*4);tex;pmrem;rt=null;mean=0;share=0;gain=1;dir=new O(0,1,1).normalize();target=new O(0,0,-2);update(t,e,n,r,s,a){if(this.aimShadows(s,n),!a){this.scene.environment=null,this.fill.intensity=1.2,this.key.intensity=1.6,this.key.position.copy(this.target).add(new O(1.5,3,2.5));return}if(r%hn.every!==0&&this.rt||t.readyState<2||!t.videoWidth)return;this.ctx.drawImage(t,0,0,ln,bn);const o=this.ctx.getImageData(0,0,ln,bn).data;let c=0;for(let y=0,M=0;y<ln*bn;y++,M+=4){const w=qa[o[M]],E=qa[o[M+1]],A=qa[o[M+2]];this.lin[y*3]=w,this.lin[y*3+1]=E,this.lin[y*3+2]=A,c+=.2126*w+.7152*E+.0722*A}this.mean=c/(ln*bn),this.gain=Math.min(hn.maxGain,Math.max(1,hn.targetMean/Math.max(this.mean,.001)));const l=this.gain;this.blur.fill(0);const h=ln/er,u=bn/Fs;for(let y=0;y<bn;y++)for(let M=0;M<ln;M++){const w=(Math.floor(y/u)*er+Math.floor(M/h))*3,E=(y*ln+M)*3,A=this.blur;A[w]=A[w]+this.lin[E],A[w+1]=A[w+1]+this.lin[E+1],A[w+2]=A[w+2]+this.lin[E+2]}for(let y=0;y<this.blur.length;y++)this.blur[y]=this.blur[y]/(h*u);const d=e.f/e.w,f=e.f/e.h;let m=0,x=0,g=0,p=0;for(let y=0;y<Dr;y++){const M=((y+.5)/Dr-.5)*Math.PI,w=Math.sin(M),E=Math.cos(M);for(let A=0;A<tr;A++){const C=((A+.5)/tr-.5)*Math.PI*2;let v=Math.cos(C)*E;const _=Math.sin(C)*E,S=n?-v:v,b=_<0,D=Math.max(Math.abs(_),.08),U=Math.min(1,Math.max(0,.5+S/D*d/hn.spread)),N=Math.min(1,Math.max(0,.5-w/D*f/hn.spread));let B,Z,H;if(b){const _t=(Math.min(bn-1,Math.floor(N*bn))*ln+Math.min(ln-1,Math.floor(U*ln)))*3;B=this.lin[_t],Z=this.lin[_t+1],H=this.lin[_t+2]}else{const _t=(Math.min(Fs-1,Math.floor(N*Fs))*er+Math.min(er-1,Math.floor(U*er)))*3;B=this.blur[_t]*hn.back,Z=this.blur[_t+1]*hn.back,H=this.blur[_t+2]*hn.back}B*=l,Z*=l,H*=l;const st=(y*tr+A)*4;this.data[st]=gs.toHalfFloat(B),this.data[st+1]=gs.toHalfFloat(Z),this.data[st+2]=gs.toHalfFloat(H),this.data[st+3]=gs.toHalfFloat(1);const ht=.2126*B+.7152*Z+.0722*H,pt=ht*E;v=Math.cos(C)*E,m+=pt*v,x+=pt*w,g+=pt*_,p+=pt}}this.tex.needsUpdate=!0,this.rt=this.pmrem.fromEquirectangular(this.tex,this.rt),this.scene.environment=this.rt.texture,this.scene.environmentIntensity=hn.envIntensity;const T=Math.hypot(m,x,g);this.share=p>0?T/p:0,T>1e-6&&this.dir.set(m/T,x/T,g/T),this.dir.y<.15&&(this.dir.y=.15,this.dir.normalize()),this.key.intensity=hn.key*this.share*(p/(tr*Dr))*2,this.fill.intensity=0,this.key.position.copy(this.target).addScaledVector(this.dir,4)}aimShadows(t,e){if(!t.length)return;const n=new O;for(const a of t)n.add(a);n.multiplyScalar(1/t.length),e&&(n.x=-n.x);let r=1.4;for(const a of t)r=Math.max(r,Math.hypot((e?-a.x:a.x)-n.x,a.y-n.y,a.z-n.z)+1.4);this.target.copy(n),this.key.target.position.copy(n),this.key.position.copy(n).addScaledVector(this.dir,4);const s=this.key.shadow.camera;s.right!==r&&(s.left=-r,s.right=r,s.top=r,s.bottom=-r,s.near=.1,s.far=4+r*2,s.updateProjectionMatrix())}}const O_=`
  varying vec2 vUv;
  uniform vec4 uCrop; // u0, v0, du, dv of the video shown
  uniform float uMirror;
  void main() {
    vec2 uv = position.xy * 0.5 + 0.5;
    uv.x = mix(uv.x, 1.0 - uv.x, uMirror);
    vUv = uCrop.xy + uv * uCrop.zw;
    gl_Position = vec4(position.xy, 1.0, 1.0);
  }`,B_=`
  varying vec2 vUv;
  uniform sampler2D uTex;
  void main() { gl_FragColor = vec4(texture2D(uTex, vUv).rgb, 1.0); }`;class k_{constructor(t){this.canvas=t,this.renderer=new rv({canvas:t,antialias:!0,alpha:!1,powerPreference:"high-performance",preserveDrawingBuffer:!1}),this.renderer.outputColorSpace=Qe,this.renderer.toneMapping=mh,this.renderer.toneMappingExposure=1,this.renderer.shadowMap.enabled=!0,this.renderer.shadowMap.type=dh,this.renderer.setPixelRatio(this.opts.pixelRatio),this.bg=new ee(new ts(2,2),new qn({vertexShader:O_,fragmentShader:B_,depthTest:!1,depthWrite:!1,toneMapped:!1,uniforms:{uTex:{value:null},uCrop:{value:new de(0,0,1,1)},uMirror:{value:0}}})),this.bg.frustumCulled=!1,this.bg.renderOrder=-1e3,this.scene.add(this.bg),this.scene.add(this.world),this.scene.add(this.camera),this.light=new F_(this.renderer,this.scene,this.world)}renderer;scene=new Pd;camera=new un(50,1,.05,60);world=new fn;light;bg;videoTex=null;templates=new Map;wearers=new Map;opts={size:1,shadows:!0,envLight:!0,pixelRatio:Math.min(window.devicePixelRatio||1,2)};cover={s:1,ox:0,oy:0,vw:1,vh:1,cw:1,ch:1,mirror:!1};setVideo(t){this.videoTex?.dispose();const e=new Od(t);e.colorSpace=wn,e.minFilter=Fe,e.magFilter=Fe,e.generateMipmaps=!1,this.videoTex=e,this.bg.material.uniforms.uTex.value=e}template(t){let e=this.templates.get(t);return e||(e=vv(Fi(t)),this.templates.set(t,e)),e}hasTemplate(t){return this.templates.has(t)}layout(t,e){const n=this.canvas.clientWidth||window.innerWidth,r=this.canvas.clientHeight||window.innerHeight,s=this.opts.pixelRatio;this.renderer.getPixelRatio()!==s&&this.renderer.setPixelRatio(s);const a=this.renderer.getSize(new St);(a.x!==n||a.y!==r)&&this.renderer.setSize(n,r,!1);const o=Math.max(n/t.w,r/t.h),c=n/o,l=r/o,h=(t.w-c)/2/t.w,u=(t.h-l)/2/t.h;this.bg.material.uniforms.uCrop.value.set(h,u,c/t.w,l/t.h),this.bg.material.uniforms.uMirror.value=e?1:0,this.camera.fov=ed.radToDeg(2*Math.atan(l/2/t.f)),this.camera.aspect=n/r,this.camera.updateProjectionMatrix(),this.world.scale.x=e?-1:1,this.cover={s:o,ox:(t.w-c)/2,oy:(t.h-l)/2,vw:t.w,vh:t.h,cw:n,ch:r,mirror:e}}sync(t,e,n){const r=new Set;for(const s of t){const a=e(s.id);if(!this.templates.has(a))continue;r.add(s.id);let o=this.wearers.get(s.id);o&&o.def.id!==a&&(this.drop(o),o=void 0),o||(o=this.dress(s.id,a)),this.pose(o,s,n)}for(const[s,a]of this.wearers)r.has(s)||this.drop(a)}dress(t,e){const n=this.template(e),r=cv(n.root),s=new Map;r.traverse(c=>{c.isBone&&s.set(c.name,c)});const a=new Map;r.traverse(c=>{const l=c;if(!l.isMesh)return;const h=u=>{let d=a.get(u);return d||(d=u.clone(),d.onBeforeCompile=u.onBeforeCompile,d.customProgramCacheKey=u.customProgramCacheKey,d.alphaHash=!0,a.set(u,d)),d};l.material=Array.isArray(l.material)?l.material.map(h):h(l.material)});const o={trackId:t,def:n.def,root:r,rig:new N_(n.def.segs,s),mats:[...a.values()],fade:0};return this.world.add(r),this.wearers.set(t,o),o}drop(t){this.world.remove(t.root);for(const e of t.mats)e.dispose();this.wearers.delete(t.trackId)}pose(t,e,n){const r=t.def,s=t.rig,a=I_(e.world),o=e.len.torso/s.torso*(r.fit?.size??1)*this.opts.size,c=r.fit?.limb??0,l=(d,f)=>{const m=1+(f/o/(s.len.get(d)??1)-1)*c;s.setLength(d,Math.min(1.6,Math.max(.65,m)))};for(const d of["L","R"])l("arm"+d,e.len.upperArm),l("thigh"+d,e.len.thigh),l("shin"+d,e.len.shin);const h=s.neckFit(e.len.neck/o);s.setNeck(1+(Math.min(1.25,Math.max(.45,h))-1)*(r.fit?.head??.85)),s.apply(a,n,r.idle?.tail??0),t.root.position.set(e.T.x,e.T.y,e.T.z),t.root.scale.setScalar(o);const u=e.presence*e.presence*(3-2*e.presence);if(u!==t.fade){for(const d of t.mats)d.opacity=u;t.fade=u}t.root.visible=u>.01,r.tick?.(t.root,n)}people(){return[...this.wearers.values()].filter(t=>t.root.visible).map(t=>t.root.position.clone())}render(t,e,n){this.renderer.shadowMap.enabled=this.opts.shadows,t&&this.light.update(t,e,this.cover.mirror,n,this.people(),this.opts.envLight),this.renderer.render(this.scene,this.camera)}get count(){return this.wearers.size}}const sh={people:2,model:"lite",size:1,lens:.85,envLight:!0,shadows:!0,debug:!1,mode:"one",costume:"jimothy"},Su="costuma26.settings";function z_(){try{return{...sh,...JSON.parse(localStorage.getItem(Su)??"{}")}}catch{return{...sh}}}function H_(i){try{localStorage.setItem(Su,JSON.stringify(i))}catch{}}const Os=i=>`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${i}</svg>`,Ei={qr:Os('<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><path d="M14 14h3v3h-3zM20 14v.01M14 20h.01M17 20h4v-3"/>'),flip:Os('<path d="M4 7h3l2-3h6l2 3h3a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1z"/><path d="M9 13a3 3 0 0 1 5-2.2M15 13a3 3 0 0 1-5 2.2"/><path d="M14 9v2h-2M10 17v-2h2"/>'),gear:Os('<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/>'),camera:Os('<path d="M4 8h3l2-3h6l2 3h3a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1z"/><circle cx="12" cy="13" r="3.5"/>'),rec:'<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="7" fill="currentColor"/></svg>',stop:'<svg viewBox="0 0 24 24"><rect x="6" y="6" width="12" height="12" rx="2" fill="currentColor"/></svg>'};function V_(i){return i&&i.__esModule&&Object.prototype.hasOwnProperty.call(i,"default")?i.default:i}var Ya={exports:{}},ah;function G_(){return ah||(ah=1,(function(i,t){var e=(function(){var n=function(w,E){var A=236,C=17,v=w,_=s[E],S=null,b=0,D=null,U=[],N={},B=function(G,q){b=v*4+17,S=(function(k){for(var j=new Array(k),tt=0;tt<k;tt+=1){j[tt]=new Array(k);for(var P=0;P<k;P+=1)j[tt][P]=null}return j})(b),Z(0,0),Z(b-7,0),Z(0,b-7),ht(),st(),_t(G,q),v>=7&&pt(G),D==null&&(D=Vt(v,_,U)),Et(D,q)},Z=function(G,q){for(var k=-1;k<=7;k+=1)if(!(G+k<=-1||b<=G+k))for(var j=-1;j<=7;j+=1)q+j<=-1||b<=q+j||(0<=k&&k<=6&&(j==0||j==6)||0<=j&&j<=6&&(k==0||k==6)||2<=k&&k<=4&&2<=j&&j<=4?S[G+k][q+j]=!0:S[G+k][q+j]=!1)},H=function(){for(var G=0,q=0,k=0;k<8;k+=1){B(!0,k);var j=o.getLostPoint(N);(k==0||G>j)&&(G=j,q=k)}return q},st=function(){for(var G=8;G<b-8;G+=1)S[G][6]==null&&(S[G][6]=G%2==0);for(var q=8;q<b-8;q+=1)S[6][q]==null&&(S[6][q]=q%2==0)},ht=function(){for(var G=o.getPatternPosition(v),q=0;q<G.length;q+=1)for(var k=0;k<G.length;k+=1){var j=G[q],tt=G[k];if(S[j][tt]==null)for(var P=-2;P<=2;P+=1)for(var K=-2;K<=2;K+=1)P==-2||P==2||K==-2||K==2||P==0&&K==0?S[j+P][tt+K]=!0:S[j+P][tt+K]=!1}},pt=function(G){for(var q=o.getBCHTypeNumber(v),k=0;k<18;k+=1){var j=!G&&(q>>k&1)==1;S[Math.floor(k/3)][k%3+b-8-3]=j}for(var k=0;k<18;k+=1){var j=!G&&(q>>k&1)==1;S[k%3+b-8-3][Math.floor(k/3)]=j}},_t=function(G,q){for(var k=_<<3|q,j=o.getBCHTypeInfo(k),tt=0;tt<15;tt+=1){var P=!G&&(j>>tt&1)==1;tt<6?S[tt][8]=P:tt<8?S[tt+1][8]=P:S[b-15+tt][8]=P}for(var tt=0;tt<15;tt+=1){var P=!G&&(j>>tt&1)==1;tt<8?S[8][b-tt-1]=P:tt<9?S[8][15-tt-1+1]=P:S[8][15-tt-1]=P}S[b-8][8]=!G},Et=function(G,q){for(var k=-1,j=b-1,tt=7,P=0,K=o.getMaskFunction(q),F=b-1;F>0;F-=2)for(F==6&&(F-=1);;){for(var z=0;z<2;z+=1)if(S[j][F-z]==null){var W=!1;P<G.length&&(W=(G[P]>>>tt&1)==1);var Q=K(j,F-z);Q&&(W=!W),S[j][F-z]=W,tt-=1,tt==-1&&(P+=1,tt=7)}if(j+=k,j<0||b<=j){j-=k,k=-k;break}}},zt=function(G,q){for(var k=0,j=0,tt=0,P=new Array(q.length),K=new Array(q.length),F=0;F<q.length;F+=1){var z=q[F].dataCount,W=q[F].totalCount-z;j=Math.max(j,z),tt=Math.max(tt,W),P[F]=new Array(z);for(var Q=0;Q<P[F].length;Q+=1)P[F][Q]=255&G.getBuffer()[Q+k];k+=z;var ot=o.getErrorCorrectPolynomial(W),ut=l(P[F],ot.getLength()-1),Pt=ut.mod(ot);K[F]=new Array(ot.getLength()-1);for(var Q=0;Q<K[F].length;Q+=1){var kt=Q+Pt.getLength()-K[F].length;K[F][Q]=kt>=0?Pt.getAt(kt):0}}for(var I=0,Q=0;Q<q.length;Q+=1)I+=q[Q].totalCount;for(var R=new Array(I),Y=0,Q=0;Q<j;Q+=1)for(var F=0;F<q.length;F+=1)Q<P[F].length&&(R[Y]=P[F][Q],Y+=1);for(var Q=0;Q<tt;Q+=1)for(var F=0;F<q.length;F+=1)Q<K[F].length&&(R[Y]=K[F][Q],Y+=1);return R},Vt=function(G,q,k){for(var j=h.getRSBlocks(G,q),tt=u(),P=0;P<k.length;P+=1){var K=k[P];tt.put(K.getMode(),4),tt.put(K.getLength(),o.getLengthInBits(K.getMode(),G)),K.write(tt)}for(var F=0,P=0;P<j.length;P+=1)F+=j[P].dataCount;if(tt.getLengthInBits()>F*8)throw"code length overflow. ("+tt.getLengthInBits()+">"+F*8+")";for(tt.getLengthInBits()+4<=F*8&&tt.put(0,4);tt.getLengthInBits()%8!=0;)tt.putBit(!1);for(;!(tt.getLengthInBits()>=F*8||(tt.put(A,8),tt.getLengthInBits()>=F*8));)tt.put(C,8);return zt(tt,j)};N.addData=function(G,q){q=q||"Byte";var k=null;switch(q){case"Numeric":k=d(G);break;case"Alphanumeric":k=f(G);break;case"Byte":k=m(G);break;case"Kanji":k=x(G);break;default:throw"mode:"+q}U.push(k),D=null},N.isDark=function(G,q){if(G<0||b<=G||q<0||b<=q)throw G+","+q;return S[G][q]},N.getModuleCount=function(){return b},N.make=function(){if(v<1){for(var G=1;G<40;G++){for(var q=h.getRSBlocks(G,_),k=u(),j=0;j<U.length;j++){var tt=U[j];k.put(tt.getMode(),4),k.put(tt.getLength(),o.getLengthInBits(tt.getMode(),G)),tt.write(k)}for(var P=0,j=0;j<q.length;j++)P+=q[j].dataCount;if(k.getLengthInBits()<=P*8)break}v=G}B(!1,H())},N.createTableTag=function(G,q){G=G||2,q=typeof q>"u"?G*4:q;var k="";k+='<table style="',k+=" border-width: 0px; border-style: none;",k+=" border-collapse: collapse;",k+=" padding: 0px; margin: "+q+"px;",k+='">',k+="<tbody>";for(var j=0;j<N.getModuleCount();j+=1){k+="<tr>";for(var tt=0;tt<N.getModuleCount();tt+=1)k+='<td style="',k+=" border-width: 0px; border-style: none;",k+=" border-collapse: collapse;",k+=" padding: 0px; margin: 0px;",k+=" width: "+G+"px;",k+=" height: "+G+"px;",k+=" background-color: ",k+=N.isDark(j,tt)?"#000000":"#ffffff",k+=";",k+='"/>';k+="</tr>"}return k+="</tbody>",k+="</table>",k},N.createSvgTag=function(G,q,k,j){var tt={};typeof arguments[0]=="object"&&(tt=arguments[0],G=tt.cellSize,q=tt.margin,k=tt.alt,j=tt.title),G=G||2,q=typeof q>"u"?G*4:q,k=typeof k=="string"?{text:k}:k||{},k.text=k.text||null,k.id=k.text?k.id||"qrcode-description":null,j=typeof j=="string"?{text:j}:j||{},j.text=j.text||null,j.id=j.text?j.id||"qrcode-title":null;var P=N.getModuleCount()*G+q*2,K,F,z,W,Q="",ot;for(ot="l"+G+",0 0,"+G+" -"+G+",0 0,-"+G+"z ",Q+='<svg version="1.1" xmlns="http://www.w3.org/2000/svg"',Q+=tt.scalable?"":' width="'+P+'px" height="'+P+'px"',Q+=' viewBox="0 0 '+P+" "+P+'" ',Q+=' preserveAspectRatio="xMinYMin meet"',Q+=j.text||k.text?' role="img" aria-labelledby="'+et([j.id,k.id].join(" ").trim())+'"':"",Q+=">",Q+=j.text?'<title id="'+et(j.id)+'">'+et(j.text)+"</title>":"",Q+=k.text?'<description id="'+et(k.id)+'">'+et(k.text)+"</description>":"",Q+='<rect width="100%" height="100%" fill="white" cx="0" cy="0"/>',Q+='<path d="',z=0;z<N.getModuleCount();z+=1)for(W=z*G+q,K=0;K<N.getModuleCount();K+=1)N.isDark(z,K)&&(F=K*G+q,Q+="M"+F+","+W+ot);return Q+='" stroke="transparent" fill="black"/>',Q+="</svg>",Q},N.createDataURL=function(G,q){G=G||2,q=typeof q>"u"?G*4:q;var k=N.getModuleCount()*G+q*2,j=q,tt=k-q;return M(k,k,function(P,K){if(j<=P&&P<tt&&j<=K&&K<tt){var F=Math.floor((P-j)/G),z=Math.floor((K-j)/G);return N.isDark(z,F)?0:1}else return 1})},N.createImgTag=function(G,q,k){G=G||2,q=typeof q>"u"?G*4:q;var j=N.getModuleCount()*G+q*2,tt="";return tt+="<img",tt+=' src="',tt+=N.createDataURL(G,q),tt+='"',tt+=' width="',tt+=j,tt+='"',tt+=' height="',tt+=j,tt+='"',k&&(tt+=' alt="',tt+=et(k),tt+='"'),tt+="/>",tt};var et=function(G){for(var q="",k=0;k<G.length;k+=1){var j=G.charAt(k);switch(j){case"<":q+="&lt;";break;case">":q+="&gt;";break;case"&":q+="&amp;";break;case'"':q+="&quot;";break;default:q+=j;break}}return q},ct=function(G){var q=1;G=typeof G>"u"?q*2:G;var k=N.getModuleCount()*q+G*2,j=G,tt=k-G,P,K,F,z,W,Q={"██":"█","█ ":"▀"," █":"▄","  ":" "},ot={"██":"▀","█ ":"▀"," █":" ","  ":" "},ut="";for(P=0;P<k;P+=2){for(F=Math.floor((P-j)/q),z=Math.floor((P+1-j)/q),K=0;K<k;K+=1)W="█",j<=K&&K<tt&&j<=P&&P<tt&&N.isDark(F,Math.floor((K-j)/q))&&(W=" "),j<=K&&K<tt&&j<=P+1&&P+1<tt&&N.isDark(z,Math.floor((K-j)/q))?W+=" ":W+="█",ut+=G<1&&P+1>=tt?ot[W]:Q[W];ut+=`
`}return k%2&&G>0?ut.substring(0,ut.length-k-1)+Array(k+1).join("▀"):ut.substring(0,ut.length-1)};return N.createASCII=function(G,q){if(G=G||1,G<2)return ct(q);G-=1,q=typeof q>"u"?G*2:q;var k=N.getModuleCount()*G+q*2,j=q,tt=k-q,P,K,F,z,W=Array(G+1).join("██"),Q=Array(G+1).join("  "),ot="",ut="";for(P=0;P<k;P+=1){for(F=Math.floor((P-j)/G),ut="",K=0;K<k;K+=1)z=1,j<=K&&K<tt&&j<=P&&P<tt&&N.isDark(F,Math.floor((K-j)/G))&&(z=0),ut+=z?W:Q;for(F=0;F<G;F+=1)ot+=ut+`
`}return ot.substring(0,ot.length-1)},N.renderTo2dContext=function(G,q){q=q||2;for(var k=N.getModuleCount(),j=0;j<k;j++)for(var tt=0;tt<k;tt++)G.fillStyle=N.isDark(j,tt)?"black":"white",G.fillRect(j*q,tt*q,q,q)},N};n.stringToBytesFuncs={default:function(w){for(var E=[],A=0;A<w.length;A+=1){var C=w.charCodeAt(A);E.push(C&255)}return E}},n.stringToBytes=n.stringToBytesFuncs.default,n.createStringToBytes=function(w,E){var A=(function(){for(var v=T(w),_=function(){var st=v.read();if(st==-1)throw"eof";return st},S=0,b={};;){var D=v.read();if(D==-1)break;var U=_(),N=_(),B=_(),Z=String.fromCharCode(D<<8|U),H=N<<8|B;b[Z]=H,S+=1}if(S!=E)throw S+" != "+E;return b})(),C=63;return function(v){for(var _=[],S=0;S<v.length;S+=1){var b=v.charCodeAt(S);if(b<128)_.push(b);else{var D=A[v.charAt(S)];typeof D=="number"?(D&255)==D?_.push(D):(_.push(D>>>8),_.push(D&255)):_.push(C)}}return _}};var r={MODE_NUMBER:1,MODE_ALPHA_NUM:2,MODE_8BIT_BYTE:4,MODE_KANJI:8},s={L:1,M:0,Q:3,H:2},a={PATTERN000:0,PATTERN001:1,PATTERN010:2,PATTERN011:3,PATTERN100:4,PATTERN101:5,PATTERN110:6,PATTERN111:7},o=(function(){var w=[[],[6,18],[6,22],[6,26],[6,30],[6,34],[6,22,38],[6,24,42],[6,26,46],[6,28,50],[6,30,54],[6,32,58],[6,34,62],[6,26,46,66],[6,26,48,70],[6,26,50,74],[6,30,54,78],[6,30,56,82],[6,30,58,86],[6,34,62,90],[6,28,50,72,94],[6,26,50,74,98],[6,30,54,78,102],[6,28,54,80,106],[6,32,58,84,110],[6,30,58,86,114],[6,34,62,90,118],[6,26,50,74,98,122],[6,30,54,78,102,126],[6,26,52,78,104,130],[6,30,56,82,108,134],[6,34,60,86,112,138],[6,30,58,86,114,142],[6,34,62,90,118,146],[6,30,54,78,102,126,150],[6,24,50,76,102,128,154],[6,28,54,80,106,132,158],[6,32,58,84,110,136,162],[6,26,54,82,110,138,166],[6,30,58,86,114,142,170]],E=1335,A=7973,C=21522,v={},_=function(S){for(var b=0;S!=0;)b+=1,S>>>=1;return b};return v.getBCHTypeInfo=function(S){for(var b=S<<10;_(b)-_(E)>=0;)b^=E<<_(b)-_(E);return(S<<10|b)^C},v.getBCHTypeNumber=function(S){for(var b=S<<12;_(b)-_(A)>=0;)b^=A<<_(b)-_(A);return S<<12|b},v.getPatternPosition=function(S){return w[S-1]},v.getMaskFunction=function(S){switch(S){case a.PATTERN000:return function(b,D){return(b+D)%2==0};case a.PATTERN001:return function(b,D){return b%2==0};case a.PATTERN010:return function(b,D){return D%3==0};case a.PATTERN011:return function(b,D){return(b+D)%3==0};case a.PATTERN100:return function(b,D){return(Math.floor(b/2)+Math.floor(D/3))%2==0};case a.PATTERN101:return function(b,D){return b*D%2+b*D%3==0};case a.PATTERN110:return function(b,D){return(b*D%2+b*D%3)%2==0};case a.PATTERN111:return function(b,D){return(b*D%3+(b+D)%2)%2==0};default:throw"bad maskPattern:"+S}},v.getErrorCorrectPolynomial=function(S){for(var b=l([1],0),D=0;D<S;D+=1)b=b.multiply(l([1,c.gexp(D)],0));return b},v.getLengthInBits=function(S,b){if(1<=b&&b<10)switch(S){case r.MODE_NUMBER:return 10;case r.MODE_ALPHA_NUM:return 9;case r.MODE_8BIT_BYTE:return 8;case r.MODE_KANJI:return 8;default:throw"mode:"+S}else if(b<27)switch(S){case r.MODE_NUMBER:return 12;case r.MODE_ALPHA_NUM:return 11;case r.MODE_8BIT_BYTE:return 16;case r.MODE_KANJI:return 10;default:throw"mode:"+S}else if(b<41)switch(S){case r.MODE_NUMBER:return 14;case r.MODE_ALPHA_NUM:return 13;case r.MODE_8BIT_BYTE:return 16;case r.MODE_KANJI:return 12;default:throw"mode:"+S}else throw"type:"+b},v.getLostPoint=function(S){for(var b=S.getModuleCount(),D=0,U=0;U<b;U+=1)for(var N=0;N<b;N+=1){for(var B=0,Z=S.isDark(U,N),H=-1;H<=1;H+=1)if(!(U+H<0||b<=U+H))for(var st=-1;st<=1;st+=1)N+st<0||b<=N+st||H==0&&st==0||Z==S.isDark(U+H,N+st)&&(B+=1);B>5&&(D+=3+B-5)}for(var U=0;U<b-1;U+=1)for(var N=0;N<b-1;N+=1){var ht=0;S.isDark(U,N)&&(ht+=1),S.isDark(U+1,N)&&(ht+=1),S.isDark(U,N+1)&&(ht+=1),S.isDark(U+1,N+1)&&(ht+=1),(ht==0||ht==4)&&(D+=3)}for(var U=0;U<b;U+=1)for(var N=0;N<b-6;N+=1)S.isDark(U,N)&&!S.isDark(U,N+1)&&S.isDark(U,N+2)&&S.isDark(U,N+3)&&S.isDark(U,N+4)&&!S.isDark(U,N+5)&&S.isDark(U,N+6)&&(D+=40);for(var N=0;N<b;N+=1)for(var U=0;U<b-6;U+=1)S.isDark(U,N)&&!S.isDark(U+1,N)&&S.isDark(U+2,N)&&S.isDark(U+3,N)&&S.isDark(U+4,N)&&!S.isDark(U+5,N)&&S.isDark(U+6,N)&&(D+=40);for(var pt=0,N=0;N<b;N+=1)for(var U=0;U<b;U+=1)S.isDark(U,N)&&(pt+=1);var _t=Math.abs(100*pt/b/b-50)/5;return D+=_t*10,D},v})(),c=(function(){for(var w=new Array(256),E=new Array(256),A=0;A<8;A+=1)w[A]=1<<A;for(var A=8;A<256;A+=1)w[A]=w[A-4]^w[A-5]^w[A-6]^w[A-8];for(var A=0;A<255;A+=1)E[w[A]]=A;var C={};return C.glog=function(v){if(v<1)throw"glog("+v+")";return E[v]},C.gexp=function(v){for(;v<0;)v+=255;for(;v>=256;)v-=255;return w[v]},C})();function l(w,E){if(typeof w.length>"u")throw w.length+"/"+E;var A=(function(){for(var v=0;v<w.length&&w[v]==0;)v+=1;for(var _=new Array(w.length-v+E),S=0;S<w.length-v;S+=1)_[S]=w[S+v];return _})(),C={};return C.getAt=function(v){return A[v]},C.getLength=function(){return A.length},C.multiply=function(v){for(var _=new Array(C.getLength()+v.getLength()-1),S=0;S<C.getLength();S+=1)for(var b=0;b<v.getLength();b+=1)_[S+b]^=c.gexp(c.glog(C.getAt(S))+c.glog(v.getAt(b)));return l(_,0)},C.mod=function(v){if(C.getLength()-v.getLength()<0)return C;for(var _=c.glog(C.getAt(0))-c.glog(v.getAt(0)),S=new Array(C.getLength()),b=0;b<C.getLength();b+=1)S[b]=C.getAt(b);for(var b=0;b<v.getLength();b+=1)S[b]^=c.gexp(c.glog(v.getAt(b))+_);return l(S,0).mod(v)},C}var h=(function(){var w=[[1,26,19],[1,26,16],[1,26,13],[1,26,9],[1,44,34],[1,44,28],[1,44,22],[1,44,16],[1,70,55],[1,70,44],[2,35,17],[2,35,13],[1,100,80],[2,50,32],[2,50,24],[4,25,9],[1,134,108],[2,67,43],[2,33,15,2,34,16],[2,33,11,2,34,12],[2,86,68],[4,43,27],[4,43,19],[4,43,15],[2,98,78],[4,49,31],[2,32,14,4,33,15],[4,39,13,1,40,14],[2,121,97],[2,60,38,2,61,39],[4,40,18,2,41,19],[4,40,14,2,41,15],[2,146,116],[3,58,36,2,59,37],[4,36,16,4,37,17],[4,36,12,4,37,13],[2,86,68,2,87,69],[4,69,43,1,70,44],[6,43,19,2,44,20],[6,43,15,2,44,16],[4,101,81],[1,80,50,4,81,51],[4,50,22,4,51,23],[3,36,12,8,37,13],[2,116,92,2,117,93],[6,58,36,2,59,37],[4,46,20,6,47,21],[7,42,14,4,43,15],[4,133,107],[8,59,37,1,60,38],[8,44,20,4,45,21],[12,33,11,4,34,12],[3,145,115,1,146,116],[4,64,40,5,65,41],[11,36,16,5,37,17],[11,36,12,5,37,13],[5,109,87,1,110,88],[5,65,41,5,66,42],[5,54,24,7,55,25],[11,36,12,7,37,13],[5,122,98,1,123,99],[7,73,45,3,74,46],[15,43,19,2,44,20],[3,45,15,13,46,16],[1,135,107,5,136,108],[10,74,46,1,75,47],[1,50,22,15,51,23],[2,42,14,17,43,15],[5,150,120,1,151,121],[9,69,43,4,70,44],[17,50,22,1,51,23],[2,42,14,19,43,15],[3,141,113,4,142,114],[3,70,44,11,71,45],[17,47,21,4,48,22],[9,39,13,16,40,14],[3,135,107,5,136,108],[3,67,41,13,68,42],[15,54,24,5,55,25],[15,43,15,10,44,16],[4,144,116,4,145,117],[17,68,42],[17,50,22,6,51,23],[19,46,16,6,47,17],[2,139,111,7,140,112],[17,74,46],[7,54,24,16,55,25],[34,37,13],[4,151,121,5,152,122],[4,75,47,14,76,48],[11,54,24,14,55,25],[16,45,15,14,46,16],[6,147,117,4,148,118],[6,73,45,14,74,46],[11,54,24,16,55,25],[30,46,16,2,47,17],[8,132,106,4,133,107],[8,75,47,13,76,48],[7,54,24,22,55,25],[22,45,15,13,46,16],[10,142,114,2,143,115],[19,74,46,4,75,47],[28,50,22,6,51,23],[33,46,16,4,47,17],[8,152,122,4,153,123],[22,73,45,3,74,46],[8,53,23,26,54,24],[12,45,15,28,46,16],[3,147,117,10,148,118],[3,73,45,23,74,46],[4,54,24,31,55,25],[11,45,15,31,46,16],[7,146,116,7,147,117],[21,73,45,7,74,46],[1,53,23,37,54,24],[19,45,15,26,46,16],[5,145,115,10,146,116],[19,75,47,10,76,48],[15,54,24,25,55,25],[23,45,15,25,46,16],[13,145,115,3,146,116],[2,74,46,29,75,47],[42,54,24,1,55,25],[23,45,15,28,46,16],[17,145,115],[10,74,46,23,75,47],[10,54,24,35,55,25],[19,45,15,35,46,16],[17,145,115,1,146,116],[14,74,46,21,75,47],[29,54,24,19,55,25],[11,45,15,46,46,16],[13,145,115,6,146,116],[14,74,46,23,75,47],[44,54,24,7,55,25],[59,46,16,1,47,17],[12,151,121,7,152,122],[12,75,47,26,76,48],[39,54,24,14,55,25],[22,45,15,41,46,16],[6,151,121,14,152,122],[6,75,47,34,76,48],[46,54,24,10,55,25],[2,45,15,64,46,16],[17,152,122,4,153,123],[29,74,46,14,75,47],[49,54,24,10,55,25],[24,45,15,46,46,16],[4,152,122,18,153,123],[13,74,46,32,75,47],[48,54,24,14,55,25],[42,45,15,32,46,16],[20,147,117,4,148,118],[40,75,47,7,76,48],[43,54,24,22,55,25],[10,45,15,67,46,16],[19,148,118,6,149,119],[18,75,47,31,76,48],[34,54,24,34,55,25],[20,45,15,61,46,16]],E=function(v,_){var S={};return S.totalCount=v,S.dataCount=_,S},A={},C=function(v,_){switch(_){case s.L:return w[(v-1)*4+0];case s.M:return w[(v-1)*4+1];case s.Q:return w[(v-1)*4+2];case s.H:return w[(v-1)*4+3];default:return}};return A.getRSBlocks=function(v,_){var S=C(v,_);if(typeof S>"u")throw"bad rs block @ typeNumber:"+v+"/errorCorrectionLevel:"+_;for(var b=S.length/3,D=[],U=0;U<b;U+=1)for(var N=S[U*3+0],B=S[U*3+1],Z=S[U*3+2],H=0;H<N;H+=1)D.push(E(B,Z));return D},A})(),u=function(){var w=[],E=0,A={};return A.getBuffer=function(){return w},A.getAt=function(C){var v=Math.floor(C/8);return(w[v]>>>7-C%8&1)==1},A.put=function(C,v){for(var _=0;_<v;_+=1)A.putBit((C>>>v-_-1&1)==1)},A.getLengthInBits=function(){return E},A.putBit=function(C){var v=Math.floor(E/8);w.length<=v&&w.push(0),C&&(w[v]|=128>>>E%8),E+=1},A},d=function(w){var E=r.MODE_NUMBER,A=w,C={};C.getMode=function(){return E},C.getLength=function(S){return A.length},C.write=function(S){for(var b=A,D=0;D+2<b.length;)S.put(v(b.substring(D,D+3)),10),D+=3;D<b.length&&(b.length-D==1?S.put(v(b.substring(D,D+1)),4):b.length-D==2&&S.put(v(b.substring(D,D+2)),7))};var v=function(S){for(var b=0,D=0;D<S.length;D+=1)b=b*10+_(S.charAt(D));return b},_=function(S){if("0"<=S&&S<="9")return S.charCodeAt(0)-48;throw"illegal char :"+S};return C},f=function(w){var E=r.MODE_ALPHA_NUM,A=w,C={};C.getMode=function(){return E},C.getLength=function(_){return A.length},C.write=function(_){for(var S=A,b=0;b+1<S.length;)_.put(v(S.charAt(b))*45+v(S.charAt(b+1)),11),b+=2;b<S.length&&_.put(v(S.charAt(b)),6)};var v=function(_){if("0"<=_&&_<="9")return _.charCodeAt(0)-48;if("A"<=_&&_<="Z")return _.charCodeAt(0)-65+10;switch(_){case" ":return 36;case"$":return 37;case"%":return 38;case"*":return 39;case"+":return 40;case"-":return 41;case".":return 42;case"/":return 43;case":":return 44;default:throw"illegal char :"+_}};return C},m=function(w){var E=r.MODE_8BIT_BYTE,A=n.stringToBytes(w),C={};return C.getMode=function(){return E},C.getLength=function(v){return A.length},C.write=function(v){for(var _=0;_<A.length;_+=1)v.put(A[_],8)},C},x=function(w){var E=r.MODE_KANJI,A=n.stringToBytesFuncs.SJIS;if(!A)throw"sjis not supported.";(function(_,S){var b=A(_);if(b.length!=2||(b[0]<<8|b[1])!=S)throw"sjis not supported."})("友",38726);var C=A(w),v={};return v.getMode=function(){return E},v.getLength=function(_){return~~(C.length/2)},v.write=function(_){for(var S=C,b=0;b+1<S.length;){var D=(255&S[b])<<8|255&S[b+1];if(33088<=D&&D<=40956)D-=33088;else if(57408<=D&&D<=60351)D-=49472;else throw"illegal char at "+(b+1)+"/"+D;D=(D>>>8&255)*192+(D&255),_.put(D,13),b+=2}if(b<S.length)throw"illegal char at "+(b+1)},v},g=function(){var w=[],E={};return E.writeByte=function(A){w.push(A&255)},E.writeShort=function(A){E.writeByte(A),E.writeByte(A>>>8)},E.writeBytes=function(A,C,v){C=C||0,v=v||A.length;for(var _=0;_<v;_+=1)E.writeByte(A[_+C])},E.writeString=function(A){for(var C=0;C<A.length;C+=1)E.writeByte(A.charCodeAt(C))},E.toByteArray=function(){return w},E.toString=function(){var A="";A+="[";for(var C=0;C<w.length;C+=1)C>0&&(A+=","),A+=w[C];return A+="]",A},E},p=function(){var w=0,E=0,A=0,C="",v={},_=function(b){C+=String.fromCharCode(S(b&63))},S=function(b){if(!(b<0)){if(b<26)return 65+b;if(b<52)return 97+(b-26);if(b<62)return 48+(b-52);if(b==62)return 43;if(b==63)return 47}throw"n:"+b};return v.writeByte=function(b){for(w=w<<8|b&255,E+=8,A+=1;E>=6;)_(w>>>E-6),E-=6},v.flush=function(){if(E>0&&(_(w<<6-E),w=0,E=0),A%3!=0)for(var b=3-A%3,D=0;D<b;D+=1)C+="="},v.toString=function(){return C},v},T=function(w){var E=w,A=0,C=0,v=0,_={};_.read=function(){for(;v<8;){if(A>=E.length){if(v==0)return-1;throw"unexpected end of file./"+v}var b=E.charAt(A);if(A+=1,b=="=")return v=0,-1;if(b.match(/^\s$/))continue;C=C<<6|S(b.charCodeAt(0)),v+=6}var D=C>>>v-8&255;return v-=8,D};var S=function(b){if(65<=b&&b<=90)return b-65;if(97<=b&&b<=122)return b-97+26;if(48<=b&&b<=57)return b-48+52;if(b==43)return 62;if(b==47)return 63;throw"c:"+b};return _},y=function(w,E){var A=w,C=E,v=new Array(w*E),_={};_.setPixel=function(U,N,B){v[N*A+U]=B},_.write=function(U){U.writeString("GIF87a"),U.writeShort(A),U.writeShort(C),U.writeByte(128),U.writeByte(0),U.writeByte(0),U.writeByte(0),U.writeByte(0),U.writeByte(0),U.writeByte(255),U.writeByte(255),U.writeByte(255),U.writeString(","),U.writeShort(0),U.writeShort(0),U.writeShort(A),U.writeShort(C),U.writeByte(0);var N=2,B=b(N);U.writeByte(N);for(var Z=0;B.length-Z>255;)U.writeByte(255),U.writeBytes(B,Z,255),Z+=255;U.writeByte(B.length-Z),U.writeBytes(B,Z,B.length-Z),U.writeByte(0),U.writeString(";")};var S=function(U){var N=U,B=0,Z=0,H={};return H.write=function(st,ht){if(st>>>ht)throw"length over";for(;B+ht>=8;)N.writeByte(255&(st<<B|Z)),ht-=8-B,st>>>=8-B,Z=0,B=0;Z=st<<B|Z,B=B+ht},H.flush=function(){B>0&&N.writeByte(Z)},H},b=function(U){for(var N=1<<U,B=(1<<U)+1,Z=U+1,H=D(),st=0;st<N;st+=1)H.add(String.fromCharCode(st));H.add(String.fromCharCode(N)),H.add(String.fromCharCode(B));var ht=g(),pt=S(ht);pt.write(N,Z);var _t=0,Et=String.fromCharCode(v[_t]);for(_t+=1;_t<v.length;){var zt=String.fromCharCode(v[_t]);_t+=1,H.contains(Et+zt)?Et=Et+zt:(pt.write(H.indexOf(Et),Z),H.size()<4095&&(H.size()==1<<Z&&(Z+=1),H.add(Et+zt)),Et=zt)}return pt.write(H.indexOf(Et),Z),pt.write(B,Z),pt.flush(),ht.toByteArray()},D=function(){var U={},N=0,B={};return B.add=function(Z){if(B.contains(Z))throw"dup key:"+Z;U[Z]=N,N+=1},B.size=function(){return N},B.indexOf=function(Z){return U[Z]},B.contains=function(Z){return typeof U[Z]<"u"},B};return _},M=function(w,E,A){for(var C=y(w,E),v=0;v<E;v+=1)for(var _=0;_<w;_+=1)C.setPixel(_,v,A(_,v));var S=g();C.write(S);for(var b=p(),D=S.toByteArray(),U=0;U<D.length;U+=1)b.writeByte(D[U]);return b.flush(),"data:image/gif;base64,"+b};return n})();(function(){e.stringToBytesFuncs["UTF-8"]=function(n){function r(s){for(var a=[],o=0;o<s.length;o++){var c=s.charCodeAt(o);c<128?a.push(c):c<2048?a.push(192|c>>6,128|c&63):c<55296||c>=57344?a.push(224|c>>12,128|c>>6&63,128|c&63):(o++,c=65536+((c&1023)<<10|s.charCodeAt(o)&1023),a.push(240|c>>18,128|c>>12&63,128|c>>6&63,128|c&63))}return a}return r(n)}})(),(function(n){i.exports=n()})(function(){return e})})(Ya)),Ya.exports}var W_=G_();const X_=V_(W_);function zr(){return location.origin+location.pathname.replace(/index\.html$/,"")}function q_(i){const t=X_(0,"M");return t.addData(i),t.make(),t.createSvgTag({cellSize:8,margin:2,scalable:!0})}async function Y_(i,t){const e=new File([i],t,{type:i.type});if(navigator.canShare?.({files:[e]}))try{return await navigator.share({files:[e],title:"costuma 2026"}),"shared"}catch(r){if(r.name==="AbortError")return"cancelled"}return yu(i,t),"saved"}function yu(i,t){const e=document.createElement("a");e.href=URL.createObjectURL(i),e.download=t,document.body.appendChild(e),e.click(),e.remove(),setTimeout(()=>URL.revokeObjectURL(e.href),3e4)}function $_(){const i=window.MediaRecorder;if(i)return["video/mp4;codecs=avc1","video/mp4","video/webm;codecs=vp9","video/webm;codecs=vp8","video/webm"].find(t=>i.isTypeSupported(t))}const te=i=>document.getElementById(i),J_="./",li=new URLSearchParams(location.search),bu=li.get("test")==="1",Li=Number(li.get("synth")??0),Jt=z_();li.get("c")&&(Jt.costume=li.get("c"));nn.some(i=>i.id===Jt.costume)||(Jt.costume=nn[0].id);li.get("people")&&(Jt.people=Number(li.get("people")));const Ws=()=>H_(Jt),Ne=te("video"),jr=te("stage"),ir=te("overlay"),Pe=ir.getContext("2d"),ye=new k_(jr);ye.opts.size=Jt.size;ye.opts.shadows=Jt.shadows;ye.opts.envLight=Jt.envLight;const ia=new Vu(Ne,li.get("facing")??void 0);let Yn=null;const Hn=new Ku;let ra=!1;const sa=new Map,Ks=new Map;let Eu=0;function js(i){const t=sa.get(i);if(t)return t;if(Jt.mode==="one")return Jt.costume;let e=Ks.get(i);if(!e){const n=nn.findIndex(r=>r.id===Jt.costume);e=nn[(n+Eu++)%nn.length].id,Ks.set(i,e)}return e}const $a=new Set;function _c(i,t=!1){ye.hasTemplate(i)||$a.has(i)||($a.add(i),t||Oe(`Dressing up as ${Fi(i).name}…`,1800),requestAnimationFrame(()=>setTimeout(()=>{try{ye.template(i)}catch(e){console.error("build failed",i,e),Oe(`${Fi(i).name} failed to build`)}$a.delete(i)},20)))}let oh=0;function Oe(i,t=1400){const e=te("toast");e.textContent=i,e.classList.add("on"),clearTimeout(oh),oh=window.setTimeout(()=>e.classList.remove("on"),t)}const Z_=i=>{const t=te("hint");t.textContent=i,t.classList.toggle("on",!!i)},Tu=i=>`${J_}thumbs/${i}.png`;function K_(){const i=te("picker");i.innerHTML="";const t=(e,n,r="")=>{const s=document.createElement("button");s.className=`card ${r}`,s.dataset.id=e,s.setAttribute("role","option"),s.innerHTML='<div class="thumb"></div><div class="name"></div>',s.querySelector(".name").textContent=n;const a=s.querySelector(".thumb");if(e==="mix")a.textContent="MIX";else{const o=new Image;o.alt="",o.onerror=()=>{o.remove(),a.textContent=n.slice(0,1)},o.src=Tu(e),a.appendChild(o)}s.onclick=()=>wu(e),i.appendChild(s)};t("mix","Mix","mix");for(const e of nn)t(e.id,e.name);xc()}function xc(){for(const i of te("picker").querySelectorAll(".card")){const t=Jt.mode==="mix"?i.dataset.id==="mix":i.dataset.id===Jt.costume;i.classList.toggle("on",t),i.setAttribute("aria-selected",String(t)),t&&i.scrollIntoView({behavior:"smooth",inline:"center",block:"nearest"})}}function wu(i){sa.clear(),i==="mix"?(Jt.mode="mix",Ks.clear(),Eu=0,Oe("Mix: everyone gets their own")):(Jt.mode="one",Jt.costume=i,_c(i),ye.hasTemplate(i)&&Oe(Fi(i).name,900)),Ws(),xc()}function Mc(i){te(i).classList.remove("hidden")}for(const i of document.querySelectorAll(".modal"))i.addEventListener("click",t=>{(t.target===i||t.target.closest("[data-close]"))&&i.classList.add("hidden")});function ch(){const i=zr();te("qr-code").innerHTML=q_(i),te("qr-url").textContent=i,Mc("qr")}te("btn-copy").onclick=async()=>{try{await navigator.clipboard.writeText(zr()),Oe("Link copied")}catch{Oe("Could not copy — long-press the link")}};te("btn-share-link").onclick=async()=>{if(navigator.share)try{await navigator.share({title:"costuma 2026",text:"Be a 3D costume:",url:zr()})}catch{}else try{await navigator.clipboard.writeText(zr()),Oe("Link copied")}catch{Oe(zr())}};function j_(){const i=te("settings-body");i.innerHTML="";const t=(s,a,o)=>{const c=document.createElement("div");c.className="set";const l=document.createElement("label"),h=document.createElement("span");if(h.textContent=s,a){const u=document.createElement("small");u.textContent=a,h.appendChild(u)}l.append(h,o),c.appendChild(l),i.appendChild(c)},e=(s,a,o)=>{const c=document.createElement("div");c.className="seg";for(const[l,h]of s){const u=document.createElement("button");u.textContent=h,u.classList.toggle("on",a()===l),u.onclick=()=>{o(l),Ws();for(const d of c.children)d.classList.remove("on");u.classList.add("on")},c.appendChild(u)}return c},n=(s,a)=>{const o=document.createElement("input");return o.type="checkbox",o.className="switch",o.checked=s(),o.onchange=()=>{a(o.checked),Ws()},o},r=(s,a,o,c,l)=>{const h=document.createElement("input");return h.type="range",h.min=String(s),h.max=String(a),h.step=String(o),h.value=String(c()),h.oninput=()=>{l(Number(h.value)),Ws()},h};t("People","How many to dress at once",e([[1,"1"],[2,"2"],[3,"3"],[4,"4"]],()=>Jt.people,s=>{Jt.people=s,Yn?.setOptions({numPoses:s})})),t("Costume size","Bigger hides more of the person",r(.8,1.5,.01,()=>Jt.size,s=>{Jt.size=s,ye.opts.size=s})),t("Pose model","Accurate is steadier, slower to load and run",e([["lite","Fast"],["full","Accurate"]],()=>Jt.model,s=>{Jt.model=s,ex()})),t("Light from the camera","The costume is lit by the room it stands in",n(()=>Jt.envLight,s=>{Jt.envLight=s,ye.opts.envLight=s})),t("Shadows","Off is faster on older phones",n(()=>Jt.shadows,s=>{Jt.shadows=s,ye.opts.shadows=s})),t("Lens","If costumes look too flat or too deep",r(.55,1.3,.01,()=>Jt.lens,s=>{Jt.lens=s})),t("Show the skeleton","What the pose tracker sees",n(()=>Jt.debug,s=>{Jt.debug=s}))}let Wo=!1,Pi=null;function Au(i,t){Pi={blob:i,name:t};const e=te("preview-media");e.innerHTML="";const n=URL.createObjectURL(i);if(i.type.startsWith("video")){const r=document.createElement("video");r.src=n,r.controls=!0,r.playsInline=!0,r.loop=!0,r.muted=!0,r.play().catch(()=>{}),e.appendChild(r)}else{const r=new Image;r.src=n,e.appendChild(r)}Mc("preview")}te("btn-share").onclick=async()=>{Pi&&await Y_(Pi.blob,Pi.name)==="saved"&&Oe("Saved")};te("btn-save").onclick=()=>{Pi&&(yu(Pi.blob,Pi.name),Oe("Saved"))};const Ru=()=>new Date().toISOString().slice(0,19).replace(/[:T]/g,"-");let Bs=null,lh=0;function Q_(){const i=te("btn-rec");if(Bs){Bs.stop();return}const t=$_(),e=jr.captureStream;if(!t||!e){Oe("Recording is not supported in this browser");return}const n=[],r=new MediaRecorder(e.call(jr,30),{mimeType:t,videoBitsPerSecond:6e6});r.ondataavailable=s=>{s.data.size&&n.push(s.data)},r.onstop=()=>{clearTimeout(lh),Bs=null,i.classList.remove("on"),i.innerHTML=Ei.rec;const s=t.split(";")[0];Au(new Blob(n,{type:s}),`costuma-${Ru()}.${s.includes("mp4")?"mp4":"webm"}`)},r.start(250),Bs=r,i.classList.add("on"),i.innerHTML=Ei.stop,lh=window.setTimeout(()=>r.state==="recording"&&r.stop(),2e4),Oe("Recording — tap to stop",1200)}function Cu(i){const t=ye.cover,e=i.image,n=(e[X.shL].x+e[X.shR].x+e[X.hipL].x+e[X.hipR].x)/4,r=(e[X.shL].y+e[X.shR].y+e[X.hipL].y+e[X.hipR].y)/4;let s=(n*t.vw-t.ox)*t.s;const a=(r*t.vh-t.oy)*t.s;return t.mirror&&(s=t.cw-s),{x:s,y:a}}jr.addEventListener("click",i=>{if(!ra)return;let t=null,e=1/0;for(const a of Hn.tracks){if(a.lost)continue;const o=Cu(a),c=Math.hypot(o.x-i.clientX,o.y-i.clientY);c<e&&(e=c,t=a)}if(!t||e>Math.max(innerWidth,innerHeight)*.3)return;const n=js(t.id),r=nn.findIndex(a=>a.id===n),s=nn[(r+1)%nn.length].id;sa.set(t.id,s),_c(s),Oe(Fi(s).name,900)});let Xo=0,hh=-1,qo=0,Yo=performance.now(),Lu=0,Ja=performance.now(),Za=0;function Pu(){return $u(Ne.videoWidth||720,Ne.videoHeight||1280,Jt.lens)}function Du(i){if(requestAnimationFrame(Du),!ra)return;Xo++;const t=Pu();ye.layout(t,ia.mirrored&&!Li);let e=null;if(Li)e=ov(Li,(i-Yo)/1e3*(bu?0:1)+Number(li.get("t")??0),t);else if(Yn&&Ne.readyState>=2&&Ne.currentTime!==hh){hh=Ne.currentTime;try{e=Yn.detect(Ne,i)}catch(s){console.error(s)}}e&&Hn.update(e.slice(0,Jt.people),i,t);for(const s of Hn.tracks)_c(js(s.id),!0);const n=(i-Yo)/1e3;ye.sync(Hn.tracks,js,n),ye.render(Ne,t,Xo),Wo&&(Wo=!1,jr.toBlob(s=>s&&Au(s,`costuma-${Ru()}.jpg`),"image/jpeg",.92)),Hn.tracks.filter(s=>!s.lost).length&&(qo=i),Z_(i-qo>2500?"Step back until your head and hips are in view":""),tx(),Za++,i-Ja>1e3&&(Lu=Za*1e3/(i-Ja),Za=0,Ja=i,Iu())}function tx(){const i=ir.clientWidth,t=ir.clientHeight,e=Math.min(devicePixelRatio||1,2);if(ir.width!==Math.round(i*e)&&(ir.width=Math.round(i*e),ir.height=Math.round(t*e)),Pe.setTransform(e,0,0,e,0,0),Pe.clearRect(0,0,i,t),!Jt.debug)return;const n=ye.cover,r=s=>{let a=(s.x*n.vw-n.ox)*n.s;return n.mirror&&(a=n.cw-a),[a,(s.y*n.vh-n.oy)*n.s]};for(const s of Hn.tracks){Pe.globalAlpha=s.presence,Pe.strokeStyle="#7dfcff",Pe.lineWidth=3;for(const[o,c]of Yu){const l=s.image[o],h=s.image[c];if(Math.min(l.v,h.v)<.4)continue;const[u,d]=r(l),[f,m]=r(h);Pe.beginPath(),Pe.moveTo(u,d),Pe.lineTo(f,m),Pe.stroke()}Pe.fillStyle="#ff8a1f";for(const o of s.image){if(o.v<.4)continue;const[c,l]=r(o);Pe.beginPath(),Pe.arc(c,l,4,0,Math.PI*2),Pe.fill()}const a=Cu(s);Pe.fillStyle="#fff",Pe.font="600 14px system-ui",Pe.fillText(`#${s.id} ${Fi(js(s.id)).name} · ${(-s.T.z).toFixed(1)} m`,a.x-40,a.y)}Pe.globalAlpha=1}function Iu(){const i=te("readout");if(!i||te("settings").classList.contains("hidden"))return;const t=Pu();i.textContent=["build bcb914f · 2026-10-31 18:12Z",`${Lu.toFixed(0)} fps · pose ${Yn?.inferMs.toFixed(1)??"–"} ms (${Yn?.delegate??"–"}, ${Jt.model})`,`video ${Ne.videoWidth}×${Ne.videoHeight} · f ${t.f.toFixed(0)} px · ${ia.facing}`,`people ${Hn.tracks.filter(e=>!e.lost).length} · dressed ${ye.count}`,`light mean ${ye.light.mean.toFixed(3)} × ${ye.light.gain.toFixed(2)} · key share ${ye.light.share.toFixed(2)} · every ${hn.every} frames`].join(`
`)}async function ex(){if(Li)return;const i=Yn,t=new uh(Jt.model,Jt.people);await t.load(e=>Oe(e,2500)),Yn=t,i?.close(),Oe(Jt.model==="full"?"Accurate pose model":"Fast pose model",1e3)}function nx(){const i=document.createElement("canvas");i.width=720,i.height=1280;const t=i.getContext("2d"),e=()=>{const n=t.createLinearGradient(0,0,0,1280);n.addColorStop(0,"#5a4a63"),n.addColorStop(.62,"#3b3142"),n.addColorStop(.63,"#6b5440"),n.addColorStop(1,"#3a2c22"),t.fillStyle=n,t.fillRect(0,0,720,1280),t.fillStyle="#fff3d6",t.fillRect(40,220,170,330),t.fillStyle="#ffb35a",t.beginPath(),t.arc(600,180,46,0,Math.PI*2),t.fill()};return e(),setInterval(e,500),i.captureStream(30)}async function Ka(){const i=te("start-status"),t=te("btn-start");t.disabled=!0;try{if(Li)Ne.srcObject=nx(),await Ne.play().catch(()=>{}),Ne.readyState<2&&await new Promise(e=>Ne.addEventListener("loadeddata",e,{once:!0}));else{if(!navigator.mediaDevices?.getUserMedia)throw new Error(location.protocol!=="https:"?"The camera needs an https:// page.":"This browser has no camera access.");i.textContent="Asking for the camera…",await ia.open(),i.textContent="Loading the pose model…",Yn=new uh(Jt.model,Jt.people),await Yn.load(e=>{i.textContent=e[0].toUpperCase()+e.slice(1)+"…"})}ye.setVideo(Ne),i.textContent=`Dressing up as ${Fi(Jt.costume).name}…`,await new Promise(e=>setTimeout(e,30)),ye.template(Jt.mode==="one"?Jt.costume:nn[0].id),te("start").classList.add("hidden"),te("hud").classList.remove("hidden"),ra=!0,Yo=performance.now(),qo=performance.now(),xc()}catch(e){console.error(e);const n=e;i.textContent=n.name==="NotAllowedError"?"Camera permission was refused. Allow it in the browser settings and try again.":`Could not start: ${n.message}`,t.disabled=!1}}function ix(){te("btn-qr").innerHTML=Ei.qr,te("btn-flip").innerHTML=Ei.flip,te("btn-gear").innerHTML=Ei.gear,te("btn-snap").innerHTML=Ei.camera,te("btn-rec").innerHTML=Ei.rec,te("btn-start").onclick=()=>void Ka(),te("btn-start-qr").onclick=ch,te("btn-qr").onclick=ch,te("btn-gear").onclick=()=>{j_(),Mc("settings"),Iu()},te("btn-flip").onclick=async()=>{if(!Li)try{await ia.flip(),ye.setVideo(Ne),Hn.clear(),sa.clear(),Ks.clear()}catch(e){Oe(`Camera: ${e.message}`)}},te("btn-snap").onclick=()=>{Wo=!0;const e=te("stage");e.style.filter="brightness(1.8)",setTimeout(()=>e.style.filter="",120)},te("btn-rec").onclick=Q_;const i=te("start-cast");for(const e of nn.slice(0,6)){const n=new Image;n.src=Tu(e.id),n.alt=e.name,n.onerror=()=>n.remove(),i.appendChild(n)}K_(),requestAnimationFrame(Du);const t=window;t.__costuma={stage:ye,tracker:Hn,settings:Jt,start:Ka,choose:wu,get started(){return ra},get frame(){return Xo},LIGHT_TUNE:hn},bu&&Li&&Ka()}ix();
