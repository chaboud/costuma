(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))n(r);new MutationObserver(r=>{for(const s of r)if(s.type==="childList")for(const a of s.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&n(a)}).observe(document,{childList:!0,subtree:!0});function e(r){const s={};return r.integrity&&(s.integrity=r.integrity),r.referrerPolicy&&(s.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?s.credentials="include":r.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function n(r){if(r.ep)return;r.ep=!0;const s=e(r);fetch(r.href,s)}})();const d0=()=>/iPad|iPhone|iPod/.test(navigator.userAgent)||navigator.platform==="MacIntel"&&navigator.maxTouchPoints>1,p0=()=>d0()||/Android|Mobile/i.test(navigator.userAgent);let m0=class{constructor(t,e){this.video=t,this.facing=e??(p0()?"environment":"user"),t.muted=!0,t.playsInline=!0,t.autoplay=!0,t.setAttribute("playsinline",""),t.setAttribute("muted","")}stream=null;facing;async open(t=this.facing){const e=!!this.stream;this.stop(),e&&await new Promise(r=>setTimeout(r,100));const n={facingMode:t,width:{ideal:1280},height:{ideal:720},frameRate:{ideal:30}};this.stream=await navigator.mediaDevices.getUserMedia({audio:!1,video:n}),this.facing=t,this.video.srcObject=this.stream,await this.video.play().catch(()=>{}),this.video.readyState<2&&await new Promise(r=>this.video.addEventListener("loadeddata",()=>r(),{once:!0}))}async flip(){await this.open(this.facing==="user"?"environment":"user")}get mirrored(){return this.facing==="user"}stop(){if(this.stream){for(const t of this.stream.getTracks())t.stop();this.video.srcObject=null,this.stream=null}}};const g0="modulepreload",v0=function(i,t){return new URL(i,t).href},fh={},_f=function(t,e,n){let r=Promise.resolve();if(e&&e.length>0){let a=function(h){return Promise.all(h.map(u=>Promise.resolve(u).then(d=>({status:"fulfilled",value:d}),d=>({status:"rejected",reason:d}))))};const o=document.getElementsByTagName("link"),c=document.querySelector("meta[property=csp-nonce]"),l=c?.nonce||c?.getAttribute("nonce");r=a(e.map(h=>{if(h=v0(h,n),h in fh)return;fh[h]=!0;const u=h.endsWith(".css"),d=u?'[rel="stylesheet"]':"";if(!!n)for(let v=o.length-1;v>=0;v--){const g=o[v];if(g.href===h&&(!u||g.rel==="stylesheet"))return}else if(document.querySelector(`link[href="${h}"]${d}`))return;const m=document.createElement("link");if(m.rel=u?"stylesheet":g0,u||(m.as="script"),m.crossOrigin="",m.href=h,l&&m.setAttribute("nonce",l),document.head.appendChild(m),u)return new Promise((v,g)=>{m.addEventListener("load",v),m.addEventListener("error",()=>g(new Error(`Unable to preload CSS for ${h}`)))})}))}function s(a){const o=new Event("vite:preloadError",{cancelable:!0});if(o.payload=a,window.dispatchEvent(o),!o.defaultPrevented)throw a}return r.then(a=>{for(const o of a||[])o.status==="rejected"&&s(o.reason);return t().catch(s)})},O={nose:0,eyeInL:1,eyeL:2,eyeOutL:3,eyeInR:4,eyeR:5,eyeOutR:6,earL:7,earR:8,mouthL:9,mouthR:10,shL:11,shR:12,elL:13,elR:14,wrL:15,wrR:16,pinkyL:17,pinkyR:18,indexL:19,indexR:20,thumbL:21,thumbR:22,hipL:23,hipR:24,knL:25,knR:26,anL:27,anR:28,heelL:29,heelR:30,toeL:31,toeR:32},_c=33;function x0(i){return{x:i.x,y:-i.y,z:-i.z,v:i.visibility??1}}const _0=[[O.shL,O.shR],[O.shL,O.elL],[O.elL,O.wrL],[O.shR,O.elR],[O.elR,O.wrR],[O.shL,O.hipL],[O.shR,O.hipR],[O.hipL,O.hipR],[O.hipL,O.knL],[O.knL,O.anL],[O.hipR,O.knR],[O.knR,O.anR],[O.anL,O.toeL],[O.anR,O.toeR],[O.earL,O.eyeL],[O.eyeL,O.nose],[O.nose,O.eyeR],[O.eyeR,O.earR]];class Mf{constructor(t,e){this.model=t,this.numPoses=e}lm=null;lastTs=-1;delegate="GPU";inferMs=0;masks=!1;async load(t){t?.("loading the pose engine");const n=await _f(()=>import("./vision_bundle-Bk4VIwNi.js"),[],import.meta.url),r=await n.FilesetResolver.forVisionTasks("./mediapipe"),s=a=>n.PoseLandmarker.createFromOptions(r,{baseOptions:{modelAssetPath:`./models/pose_landmarker_${this.model}.task`,delegate:a},runningMode:"VIDEO",numPoses:this.numPoses,minPoseDetectionConfidence:.5,minPosePresenceConfidence:.5,minTrackingConfidence:.5,outputSegmentationMasks:this.masks});t?.(`loading the ${this.model} pose model`);try{this.lm=await s("GPU"),this.delegate="GPU"}catch(a){console.warn("GPU delegate failed, using CPU",a),this.lm=await s("CPU"),this.delegate="CPU"}}async setOptions(t){t.numPoses&&(this.numPoses=t.numPoses,await this.lm?.setOptions({numPoses:t.numPoses})),t.masks!==void 0&&t.masks!==this.masks&&(this.masks=t.masks,await this.lm?.setOptions({outputSegmentationMasks:t.masks}))}detect(t,e){if(!this.lm)return[];e<=this.lastTs&&(e=this.lastTs+1),this.lastTs=e;const n=performance.now(),r=this.lm.detectForVideo(t,e);this.inferMs=performance.now()-n;const s=[];for(let a=0;a<r.landmarks.length;a++){const o=r.landmarks[a],c=r.worldLandmarks[a];if(!c)continue;const l=r.segmentationMasks?.[a];s.push({image:o.map(h=>({x:h.x,y:h.y,z:h.z,v:h.visibility??1})),world:c.map(x0),mask:l?{data:l.getAsFloat32Array().slice(),w:l.width,h:l.height}:void 0})}return r.close(),s}close(){this.lm?.close(),this.lm=null}}function M0(i,t,e=.85){return{f:e*Math.max(i,t),cx:i/2,cy:t/2,w:i,h:t}}function dh(i,t,e,n=.5){let r=0,s=0,a=0,o=0,c=0,l=0,h=0,u=0,d=0;for(let y=0;y<i.length&&y<t.length;y++){const M=i[y],_=t[y],w=Math.min(M.v,_.v);if(w<n)continue;const E=(_.x*e.w-e.cx)/e.f,A=(e.cy-_.y*e.h)/e.f,R=-E*M.z-M.x,x=-A*M.z-M.y;r+=w,s+=w*E,c+=w*E*E,l+=w*R,u+=w*E*R,a+=w,o+=w*A,c+=w*A*A,h+=w*x,u+=w*A*x,d++}if(d<4)return null;const f=c-s*s/r-o*o/a,m=u-s*l/r-o*h/a;if(Math.abs(f)<1e-9)return null;const v=m/f,g=(l-s*v)/r,p=(h-o*v)/a;return!(v<-.2)||!isFinite(g)||!isFinite(p)?null:{x:g,y:p,z:v}}function os(i,t){const e=-i.z;return{x:(t.cx+t.f*i.x/e)/t.w,y:(t.cy-t.f*i.y/e)/t.h}}const la=(i,t)=>({x:(i.x+t.x)/2,y:(i.y+t.y)/2,z:(i.z+t.z)/2,v:Math.min(i.v,t.v)}),jn=(i,t)=>Math.hypot(i.x-t.x,i.y-t.y,i.z-t.z);function ph(i){const t=jn(la(i[O.shL],i[O.shR]),la(i[O.hipL],i[O.hipR])),e=(jn(i[O.shL],i[O.elL])+jn(i[O.shR],i[O.elR]))/2,n=(jn(i[O.elL],i[O.wrL])+jn(i[O.elR],i[O.wrR]))/2,r=(jn(i[O.hipL],i[O.knL])+jn(i[O.hipR],i[O.knR]))/2,s=(jn(i[O.knL],i[O.anL])+jn(i[O.knR],i[O.anR]))/2,a=jn(la(i[O.shL],i[O.shR]),la(i[O.earL],i[O.earR]));return{torso:t,upperArm:e,forearm:n,thigh:r,shin:s,neck:a}}const Jn={tauWorld:.045,tauImage:.035,tauZ:.14,tauLen:1.5,tauVis:.25,tauCore:.09,fadeIn:.22,fadeOut:.35,forgetAfter:.6,matchRadius:1.3},mh=i=>{const t=[O.shL,O.shR,O.hipL,O.hipR];let e=0,n=0,r=0;for(const c of t){const l=i[c];e+=l.x,n+=l.y,r++}e/=r,n/=r;const s=(i[O.shL].x+i[O.shR].x)/2-(i[O.hipL].x+i[O.hipR].x)/2,a=(i[O.shL].y+i[O.shR].y)/2-(i[O.hipL].y+i[O.hipR].y)/2,o=Math.hypot(i[O.shL].x-i[O.shR].x,i[O.shL].y-i[O.shR].y);return{x:e,y:n,s:Math.max(Math.hypot(s,a),o,.04)}},$r=(i,t,e)=>i+(t-i)*e,wr=(i,t)=>1-Math.exp(-i/Math.max(t,1e-4)),y0=new Set([0,1,2,3,4,5,6,7,8,9,10,O.shL,O.shR,O.hipL,O.hipR]);function gh(i,t,e,n,r=e){for(let s=0;s<_c;s++){const a=i[s],o=t[s],c=y0.has(s)?r:e;a.x=$r(a.x,o.x,c),a.y=$r(a.y,o.y,c),a.z=$r(a.z,o.z,c),a.v=$r(a.v,o.v,n)}}const vh=i=>i.map(t=>({...t})),b0=[O.nose,O.eyeL,O.eyeR,O.earL,O.earR,O.shL,O.shR,O.hipL,O.hipR];function S0(i,t){let e=0,n=0,r=0;for(const s of b0){const a=i[s],o=t[s],c=Math.min(a.v,o.v);c<.5||(e+=(o.x-a.x)*c,n+=(o.y-a.y)*c,r+=c)}if(!(r<1.5)){e/=r,n/=r;for(const s of i)s.x+=e,s.y+=n}}class w0{tracks=[];nextId=1;last=-1;update(t,e,n){const r=this.last<0?.03333333333333333:Math.min(.25,Math.max(.001,(e-this.last)/1e3));this.last=e;const s=t.map(h=>({d:h,T:dh(h.world,h.image,n),c:mh(h.image)})).filter(h=>h.T),a=this.tracks.filter(h=>!h.lost||h.presence>0),o=[];a.forEach((h,u)=>{const d=mh(h.image);s.forEach((f,m)=>{const v=Math.hypot(d.x-f.c.x,d.y-f.c.y)/d.s;v<Jn.matchRadius&&o.push({ti:u,di:m,cost:v})})}),o.sort((h,u)=>h.cost-u.cost);const c=new Set,l=new Set;for(const h of o){if(c.has(h.ti)||l.has(h.di))continue;c.add(h.ti),l.add(h.di);const u=a[h.ti],d=s[h.di],f=u.lost,m=f?1:wr(r,Jn.tauVis);gh(u.world,d.d.world,f?1:wr(r,Jn.tauWorld),m,f?1:wr(r,Jn.tauCore)),f||S0(u.image,d.d.image),gh(u.image,d.d.image,f?1:wr(r,Jn.tauImage),m);const v=dh(u.world,u.image,n)??d.T;if(f)u.T={...v};else{const y=$r(u.T.z,v.z,wr(r,Jn.tauZ)),M=y/v.z;u.T={x:v.x*M,y:v.y*M,z:y}}const g=ph(u.world),p=wr(r,Jn.tauLen);for(const y of Object.keys(g))u.len[y]=$r(u.len[y],g[y],p);u.seen=e,u.lost=!1,u.det=d.d}s.forEach((h,u)=>{if(l.has(u))return;const d=vh(h.d.world);this.tracks.push({id:this.nextId++,born:e,seen:e,image:vh(h.d.image),world:d,T:{...h.T},len:ph(d),presence:0,lost:!1,det:h.d})});for(const h of this.tracks)h.seen!==e&&(h.lost=!0,h.det=null),h.presence=h.lost?Math.max(0,h.presence-r/Jn.fadeOut):Math.min(1,h.presence+r/Jn.fadeIn);return this.tracks=this.tracks.filter(h=>!(h.lost&&h.presence<=0&&e-h.seen>Jn.forgetAfter*1e3)),this.tracks}clear(){this.tracks=[],this.last=-1}}/**
 * @license
 * Copyright 2010-2025 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const El="180",E0=0,xh=1,T0=2,yf=1,bf=2,gi=3,qi=0,mn=1,je=2,Vi=0,ts=1,Mc=2,_h=3,Mh=4,Sf=5,ar=100,A0=101,R0=102,C0=103,L0=104,wf=200,P0=201,Ef=202,D0=203,yc=204,bc=205,I0=206,U0=207,N0=208,F0=209,O0=210,B0=211,k0=212,z0=213,H0=214,Sc=0,wc=1,Ec=2,cs=3,Tc=4,Ac=5,Rc=6,Cc=7,Tf=0,V0=1,G0=2,Gi=0,W0=1,X0=2,q0=3,Y0=4,$0=5,j0=6,Af=7,yh="attached",J0="detached",Rf=300,ls=301,hs=302,no=303,Lc=304,go=306,us=1e3,cr=1001,Pc=1002,An=1003,Z0=1004,ha=1005,xe=1006,wo=1007,ki=1008,Yn=1009,Cf=1010,Lf=1011,zs=1012,Tl=1013,mr=1014,ri=1015,Mr=1016,Al=1017,Rl=1018,Hs=1020,Pf=35902,Df=35899,If=1021,Uf=1022,We=1023,Vs=1026,Gs=1027,Nf=1028,Cl=1029,Ff=1030,Ll=1031,Pl=1033,Ja=33776,Za=33777,Ka=33778,Qa=33779,Dc=35840,Ic=35841,Uc=35842,Nc=35843,Fc=36196,Oc=37492,Bc=37496,kc=37808,zc=37809,Hc=37810,Vc=37811,Gc=37812,Wc=37813,Xc=37814,qc=37815,Yc=37816,$c=37817,jc=37818,Jc=37819,Zc=37820,Kc=37821,Qc=36492,tl=36494,el=36495,nl=36283,il=36284,rl=36285,sl=36286,K0=3200,Q0=3201,Of=0,tp=1,ii="",dn="srgb",gr="srgb-linear",io="linear",fe="srgb",Er=7680,bh=519,ep=512,np=513,ip=514,Bf=515,rp=516,sp=517,ap=518,op=519,Sh=35044,ua=35048,wh="300 es",si=2e3,ro=2001;class vs{addEventListener(t,e){this._listeners===void 0&&(this._listeners={});const n=this._listeners;n[t]===void 0&&(n[t]=[]),n[t].indexOf(e)===-1&&n[t].push(e)}hasEventListener(t,e){const n=this._listeners;return n===void 0?!1:n[t]!==void 0&&n[t].indexOf(e)!==-1}removeEventListener(t,e){const n=this._listeners;if(n===void 0)return;const r=n[t];if(r!==void 0){const s=r.indexOf(e);s!==-1&&r.splice(s,1)}}dispatchEvent(t){const e=this._listeners;if(e===void 0)return;const n=e[t.type];if(n!==void 0){t.target=this;const r=n.slice(0);for(let s=0,a=r.length;s<a;s++)r[s].call(this,t);t.target=null}}}const qe=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];let Eh=1234567;const Ns=Math.PI/180,fs=180/Math.PI;function Yi(){const i=Math.random()*4294967295|0,t=Math.random()*4294967295|0,e=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(qe[i&255]+qe[i>>8&255]+qe[i>>16&255]+qe[i>>24&255]+"-"+qe[t&255]+qe[t>>8&255]+"-"+qe[t>>16&15|64]+qe[t>>24&255]+"-"+qe[e&63|128]+qe[e>>8&255]+"-"+qe[e>>16&255]+qe[e>>24&255]+qe[n&255]+qe[n>>8&255]+qe[n>>16&255]+qe[n>>24&255]).toLowerCase()}function ne(i,t,e){return Math.max(t,Math.min(e,i))}function Dl(i,t){return(i%t+t)%t}function cp(i,t,e,n,r){return n+(i-t)*(r-n)/(e-t)}function lp(i,t,e){return i!==t?(e-i)/(t-i):0}function Fs(i,t,e){return(1-e)*i+e*t}function hp(i,t,e,n){return Fs(i,t,1-Math.exp(-e*n))}function up(i,t=1){return t-Math.abs(Dl(i,t*2)-t)}function fp(i,t,e){return i<=t?0:i>=e?1:(i=(i-t)/(e-t),i*i*(3-2*i))}function dp(i,t,e){return i<=t?0:i>=e?1:(i=(i-t)/(e-t),i*i*i*(i*(i*6-15)+10))}function pp(i,t){return i+Math.floor(Math.random()*(t-i+1))}function mp(i,t){return i+Math.random()*(t-i)}function gp(i){return i*(.5-Math.random())}function vp(i){i!==void 0&&(Eh=i);let t=Eh+=1831565813;return t=Math.imul(t^t>>>15,t|1),t^=t+Math.imul(t^t>>>7,t|61),((t^t>>>14)>>>0)/4294967296}function xp(i){return i*Ns}function _p(i){return i*fs}function Mp(i){return(i&i-1)===0&&i!==0}function yp(i){return Math.pow(2,Math.ceil(Math.log(i)/Math.LN2))}function bp(i){return Math.pow(2,Math.floor(Math.log(i)/Math.LN2))}function Sp(i,t,e,n,r){const s=Math.cos,a=Math.sin,o=s(e/2),c=a(e/2),l=s((t+n)/2),h=a((t+n)/2),u=s((t-n)/2),d=a((t-n)/2),f=s((n-t)/2),m=a((n-t)/2);switch(r){case"XYX":i.set(o*h,c*u,c*d,o*l);break;case"YZY":i.set(c*d,o*h,c*u,o*l);break;case"ZXZ":i.set(c*u,c*d,o*h,o*l);break;case"XZX":i.set(o*h,c*m,c*f,o*l);break;case"YXY":i.set(c*f,o*h,c*m,o*l);break;case"ZYZ":i.set(c*m,c*f,o*h,o*l);break;default:console.warn("THREE.MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+r)}}function Xr(i,t){switch(t.constructor){case Float32Array:return i;case Uint32Array:return i/4294967295;case Uint16Array:return i/65535;case Uint8Array:return i/255;case Int32Array:return Math.max(i/2147483647,-1);case Int16Array:return Math.max(i/32767,-1);case Int8Array:return Math.max(i/127,-1);default:throw new Error("Invalid component type.")}}function Qe(i,t){switch(t.constructor){case Float32Array:return i;case Uint32Array:return Math.round(i*4294967295);case Uint16Array:return Math.round(i*65535);case Uint8Array:return Math.round(i*255);case Int32Array:return Math.round(i*2147483647);case Int16Array:return Math.round(i*32767);case Int8Array:return Math.round(i*127);default:throw new Error("Invalid component type.")}}const es={DEG2RAD:Ns,RAD2DEG:fs,generateUUID:Yi,clamp:ne,euclideanModulo:Dl,mapLinear:cp,inverseLerp:lp,lerp:Fs,damp:hp,pingpong:up,smoothstep:fp,smootherstep:dp,randInt:pp,randFloat:mp,randFloatSpread:gp,seededRandom:vp,degToRad:xp,radToDeg:_p,isPowerOfTwo:Mp,ceilPowerOfTwo:yp,floorPowerOfTwo:bp,setQuaternionFromProperEuler:Sp,normalize:Qe,denormalize:Xr};class dt{constructor(t=0,e=0){dt.prototype.isVector2=!0,this.x=t,this.y=e}get width(){return this.x}set width(t){this.x=t}get height(){return this.y}set height(t){this.y=t}set(t,e){return this.x=t,this.y=e,this}setScalar(t){return this.x=t,this.y=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y)}copy(t){return this.x=t.x,this.y=t.y,this}add(t){return this.x+=t.x,this.y+=t.y,this}addScalar(t){return this.x+=t,this.y+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this}subScalar(t){return this.x-=t,this.y-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this}multiply(t){return this.x*=t.x,this.y*=t.y,this}multiplyScalar(t){return this.x*=t,this.y*=t,this}divide(t){return this.x/=t.x,this.y/=t.y,this}divideScalar(t){return this.multiplyScalar(1/t)}applyMatrix3(t){const e=this.x,n=this.y,r=t.elements;return this.x=r[0]*e+r[3]*n+r[6],this.y=r[1]*e+r[4]*n+r[7],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this}clamp(t,e){return this.x=ne(this.x,t.x,e.x),this.y=ne(this.y,t.y,e.y),this}clampScalar(t,e){return this.x=ne(this.x,t,e),this.y=ne(this.y,t,e),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(ne(n,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(t){return this.x*t.x+this.y*t.y}cross(t){return this.x*t.y-this.y*t.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const n=this.dot(t)/e;return Math.acos(ne(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,n=this.y-t.y;return e*e+n*n}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this}equals(t){return t.x===this.x&&t.y===this.y}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this}rotateAround(t,e){const n=Math.cos(e),r=Math.sin(e),s=this.x-t.x,a=this.y-t.y;return this.x=s*n-a*r+t.x,this.y=s*r+a*n+t.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class Ge{constructor(t=0,e=0,n=0,r=1){this.isQuaternion=!0,this._x=t,this._y=e,this._z=n,this._w=r}static slerpFlat(t,e,n,r,s,a,o){let c=n[r+0],l=n[r+1],h=n[r+2],u=n[r+3];const d=s[a+0],f=s[a+1],m=s[a+2],v=s[a+3];if(o===0){t[e+0]=c,t[e+1]=l,t[e+2]=h,t[e+3]=u;return}if(o===1){t[e+0]=d,t[e+1]=f,t[e+2]=m,t[e+3]=v;return}if(u!==v||c!==d||l!==f||h!==m){let g=1-o;const p=c*d+l*f+h*m+u*v,y=p>=0?1:-1,M=1-p*p;if(M>Number.EPSILON){const w=Math.sqrt(M),E=Math.atan2(w,p*y);g=Math.sin(g*E)/w,o=Math.sin(o*E)/w}const _=o*y;if(c=c*g+d*_,l=l*g+f*_,h=h*g+m*_,u=u*g+v*_,g===1-o){const w=1/Math.sqrt(c*c+l*l+h*h+u*u);c*=w,l*=w,h*=w,u*=w}}t[e]=c,t[e+1]=l,t[e+2]=h,t[e+3]=u}static multiplyQuaternionsFlat(t,e,n,r,s,a){const o=n[r],c=n[r+1],l=n[r+2],h=n[r+3],u=s[a],d=s[a+1],f=s[a+2],m=s[a+3];return t[e]=o*m+h*u+c*f-l*d,t[e+1]=c*m+h*d+l*u-o*f,t[e+2]=l*m+h*f+o*d-c*u,t[e+3]=h*m-o*u-c*d-l*f,t}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get w(){return this._w}set w(t){this._w=t,this._onChangeCallback()}set(t,e,n,r){return this._x=t,this._y=e,this._z=n,this._w=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(t){return this._x=t.x,this._y=t.y,this._z=t.z,this._w=t.w,this._onChangeCallback(),this}setFromEuler(t,e=!0){const n=t._x,r=t._y,s=t._z,a=t._order,o=Math.cos,c=Math.sin,l=o(n/2),h=o(r/2),u=o(s/2),d=c(n/2),f=c(r/2),m=c(s/2);switch(a){case"XYZ":this._x=d*h*u+l*f*m,this._y=l*f*u-d*h*m,this._z=l*h*m+d*f*u,this._w=l*h*u-d*f*m;break;case"YXZ":this._x=d*h*u+l*f*m,this._y=l*f*u-d*h*m,this._z=l*h*m-d*f*u,this._w=l*h*u+d*f*m;break;case"ZXY":this._x=d*h*u-l*f*m,this._y=l*f*u+d*h*m,this._z=l*h*m+d*f*u,this._w=l*h*u-d*f*m;break;case"ZYX":this._x=d*h*u-l*f*m,this._y=l*f*u+d*h*m,this._z=l*h*m-d*f*u,this._w=l*h*u+d*f*m;break;case"YZX":this._x=d*h*u+l*f*m,this._y=l*f*u+d*h*m,this._z=l*h*m-d*f*u,this._w=l*h*u-d*f*m;break;case"XZY":this._x=d*h*u-l*f*m,this._y=l*f*u-d*h*m,this._z=l*h*m+d*f*u,this._w=l*h*u+d*f*m;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+a)}return e===!0&&this._onChangeCallback(),this}setFromAxisAngle(t,e){const n=e/2,r=Math.sin(n);return this._x=t.x*r,this._y=t.y*r,this._z=t.z*r,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(t){const e=t.elements,n=e[0],r=e[4],s=e[8],a=e[1],o=e[5],c=e[9],l=e[2],h=e[6],u=e[10],d=n+o+u;if(d>0){const f=.5/Math.sqrt(d+1);this._w=.25/f,this._x=(h-c)*f,this._y=(s-l)*f,this._z=(a-r)*f}else if(n>o&&n>u){const f=2*Math.sqrt(1+n-o-u);this._w=(h-c)/f,this._x=.25*f,this._y=(r+a)/f,this._z=(s+l)/f}else if(o>u){const f=2*Math.sqrt(1+o-n-u);this._w=(s-l)/f,this._x=(r+a)/f,this._y=.25*f,this._z=(c+h)/f}else{const f=2*Math.sqrt(1+u-n-o);this._w=(a-r)/f,this._x=(s+l)/f,this._y=(c+h)/f,this._z=.25*f}return this._onChangeCallback(),this}setFromUnitVectors(t,e){let n=t.dot(e)+1;return n<1e-8?(n=0,Math.abs(t.x)>Math.abs(t.z)?(this._x=-t.y,this._y=t.x,this._z=0,this._w=n):(this._x=0,this._y=-t.z,this._z=t.y,this._w=n)):(this._x=t.y*e.z-t.z*e.y,this._y=t.z*e.x-t.x*e.z,this._z=t.x*e.y-t.y*e.x,this._w=n),this.normalize()}angleTo(t){return 2*Math.acos(Math.abs(ne(this.dot(t),-1,1)))}rotateTowards(t,e){const n=this.angleTo(t);if(n===0)return this;const r=Math.min(1,e/n);return this.slerp(t,r),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(t){return this._x*t._x+this._y*t._y+this._z*t._z+this._w*t._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let t=this.length();return t===0?(this._x=0,this._y=0,this._z=0,this._w=1):(t=1/t,this._x=this._x*t,this._y=this._y*t,this._z=this._z*t,this._w=this._w*t),this._onChangeCallback(),this}multiply(t){return this.multiplyQuaternions(this,t)}premultiply(t){return this.multiplyQuaternions(t,this)}multiplyQuaternions(t,e){const n=t._x,r=t._y,s=t._z,a=t._w,o=e._x,c=e._y,l=e._z,h=e._w;return this._x=n*h+a*o+r*l-s*c,this._y=r*h+a*c+s*o-n*l,this._z=s*h+a*l+n*c-r*o,this._w=a*h-n*o-r*c-s*l,this._onChangeCallback(),this}slerp(t,e){if(e===0)return this;if(e===1)return this.copy(t);const n=this._x,r=this._y,s=this._z,a=this._w;let o=a*t._w+n*t._x+r*t._y+s*t._z;if(o<0?(this._w=-t._w,this._x=-t._x,this._y=-t._y,this._z=-t._z,o=-o):this.copy(t),o>=1)return this._w=a,this._x=n,this._y=r,this._z=s,this;const c=1-o*o;if(c<=Number.EPSILON){const f=1-e;return this._w=f*a+e*this._w,this._x=f*n+e*this._x,this._y=f*r+e*this._y,this._z=f*s+e*this._z,this.normalize(),this}const l=Math.sqrt(c),h=Math.atan2(l,o),u=Math.sin((1-e)*h)/l,d=Math.sin(e*h)/l;return this._w=a*u+this._w*d,this._x=n*u+this._x*d,this._y=r*u+this._y*d,this._z=s*u+this._z*d,this._onChangeCallback(),this}slerpQuaternions(t,e,n){return this.copy(t).slerp(e,n)}random(){const t=2*Math.PI*Math.random(),e=2*Math.PI*Math.random(),n=Math.random(),r=Math.sqrt(1-n),s=Math.sqrt(n);return this.set(r*Math.sin(t),r*Math.cos(t),s*Math.sin(e),s*Math.cos(e))}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._w===this._w}fromArray(t,e=0){return this._x=t[e],this._y=t[e+1],this._z=t[e+2],this._w=t[e+3],this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._w,t}fromBufferAttribute(t,e){return this._x=t.getX(e),this._y=t.getY(e),this._z=t.getZ(e),this._w=t.getW(e),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class N{constructor(t=0,e=0,n=0){N.prototype.isVector3=!0,this.x=t,this.y=e,this.z=n}set(t,e,n){return n===void 0&&(n=this.z),this.x=t,this.y=e,this.z=n,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this}multiplyVectors(t,e){return this.x=t.x*e.x,this.y=t.y*e.y,this.z=t.z*e.z,this}applyEuler(t){return this.applyQuaternion(Th.setFromEuler(t))}applyAxisAngle(t,e){return this.applyQuaternion(Th.setFromAxisAngle(t,e))}applyMatrix3(t){const e=this.x,n=this.y,r=this.z,s=t.elements;return this.x=s[0]*e+s[3]*n+s[6]*r,this.y=s[1]*e+s[4]*n+s[7]*r,this.z=s[2]*e+s[5]*n+s[8]*r,this}applyNormalMatrix(t){return this.applyMatrix3(t).normalize()}applyMatrix4(t){const e=this.x,n=this.y,r=this.z,s=t.elements,a=1/(s[3]*e+s[7]*n+s[11]*r+s[15]);return this.x=(s[0]*e+s[4]*n+s[8]*r+s[12])*a,this.y=(s[1]*e+s[5]*n+s[9]*r+s[13])*a,this.z=(s[2]*e+s[6]*n+s[10]*r+s[14])*a,this}applyQuaternion(t){const e=this.x,n=this.y,r=this.z,s=t.x,a=t.y,o=t.z,c=t.w,l=2*(a*r-o*n),h=2*(o*e-s*r),u=2*(s*n-a*e);return this.x=e+c*l+a*u-o*h,this.y=n+c*h+o*l-s*u,this.z=r+c*u+s*h-a*l,this}project(t){return this.applyMatrix4(t.matrixWorldInverse).applyMatrix4(t.projectionMatrix)}unproject(t){return this.applyMatrix4(t.projectionMatrixInverse).applyMatrix4(t.matrixWorld)}transformDirection(t){const e=this.x,n=this.y,r=this.z,s=t.elements;return this.x=s[0]*e+s[4]*n+s[8]*r,this.y=s[1]*e+s[5]*n+s[9]*r,this.z=s[2]*e+s[6]*n+s[10]*r,this.normalize()}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this}divideScalar(t){return this.multiplyScalar(1/t)}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this}clamp(t,e){return this.x=ne(this.x,t.x,e.x),this.y=ne(this.y,t.y,e.y),this.z=ne(this.z,t.z,e.z),this}clampScalar(t,e){return this.x=ne(this.x,t,e),this.y=ne(this.y,t,e),this.z=ne(this.z,t,e),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(ne(n,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this}cross(t){return this.crossVectors(this,t)}crossVectors(t,e){const n=t.x,r=t.y,s=t.z,a=e.x,o=e.y,c=e.z;return this.x=r*c-s*o,this.y=s*a-n*c,this.z=n*o-r*a,this}projectOnVector(t){const e=t.lengthSq();if(e===0)return this.set(0,0,0);const n=t.dot(this)/e;return this.copy(t).multiplyScalar(n)}projectOnPlane(t){return Eo.copy(this).projectOnVector(t),this.sub(Eo)}reflect(t){return this.sub(Eo.copy(t).multiplyScalar(2*this.dot(t)))}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const n=this.dot(t)/e;return Math.acos(ne(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,n=this.y-t.y,r=this.z-t.z;return e*e+n*n+r*r}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)+Math.abs(this.z-t.z)}setFromSpherical(t){return this.setFromSphericalCoords(t.radius,t.phi,t.theta)}setFromSphericalCoords(t,e,n){const r=Math.sin(e)*t;return this.x=r*Math.sin(n),this.y=Math.cos(e)*t,this.z=r*Math.cos(n),this}setFromCylindrical(t){return this.setFromCylindricalCoords(t.radius,t.theta,t.y)}setFromCylindricalCoords(t,e,n){return this.x=t*Math.sin(e),this.y=n,this.z=t*Math.cos(e),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this}setFromMatrixScale(t){const e=this.setFromMatrixColumn(t,0).length(),n=this.setFromMatrixColumn(t,1).length(),r=this.setFromMatrixColumn(t,2).length();return this.x=e,this.y=n,this.z=r,this}setFromMatrixColumn(t,e){return this.fromArray(t.elements,e*4)}setFromMatrix3Column(t,e){return this.fromArray(t.elements,e*3)}setFromEuler(t){return this.x=t._x,this.y=t._y,this.z=t._z,this}setFromColor(t){return this.x=t.r,this.y=t.g,this.z=t.b,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const t=Math.random()*Math.PI*2,e=Math.random()*2-1,n=Math.sqrt(1-e*e);return this.x=n*Math.cos(t),this.y=e,this.z=n*Math.sin(t),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const Eo=new N,Th=new Ge;class te{constructor(t,e,n,r,s,a,o,c,l){te.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],t!==void 0&&this.set(t,e,n,r,s,a,o,c,l)}set(t,e,n,r,s,a,o,c,l){const h=this.elements;return h[0]=t,h[1]=r,h[2]=o,h[3]=e,h[4]=s,h[5]=c,h[6]=n,h[7]=a,h[8]=l,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(t){const e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],this}extractBasis(t,e,n){return t.setFromMatrix3Column(this,0),e.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(t){const e=t.elements;return this.set(e[0],e[4],e[8],e[1],e[5],e[9],e[2],e[6],e[10]),this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const n=t.elements,r=e.elements,s=this.elements,a=n[0],o=n[3],c=n[6],l=n[1],h=n[4],u=n[7],d=n[2],f=n[5],m=n[8],v=r[0],g=r[3],p=r[6],y=r[1],M=r[4],_=r[7],w=r[2],E=r[5],A=r[8];return s[0]=a*v+o*y+c*w,s[3]=a*g+o*M+c*E,s[6]=a*p+o*_+c*A,s[1]=l*v+h*y+u*w,s[4]=l*g+h*M+u*E,s[7]=l*p+h*_+u*A,s[2]=d*v+f*y+m*w,s[5]=d*g+f*M+m*E,s[8]=d*p+f*_+m*A,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[3]*=t,e[6]*=t,e[1]*=t,e[4]*=t,e[7]*=t,e[2]*=t,e[5]*=t,e[8]*=t,this}determinant(){const t=this.elements,e=t[0],n=t[1],r=t[2],s=t[3],a=t[4],o=t[5],c=t[6],l=t[7],h=t[8];return e*a*h-e*o*l-n*s*h+n*o*c+r*s*l-r*a*c}invert(){const t=this.elements,e=t[0],n=t[1],r=t[2],s=t[3],a=t[4],o=t[5],c=t[6],l=t[7],h=t[8],u=h*a-o*l,d=o*c-h*s,f=l*s-a*c,m=e*u+n*d+r*f;if(m===0)return this.set(0,0,0,0,0,0,0,0,0);const v=1/m;return t[0]=u*v,t[1]=(r*l-h*n)*v,t[2]=(o*n-r*a)*v,t[3]=d*v,t[4]=(h*e-r*c)*v,t[5]=(r*s-o*e)*v,t[6]=f*v,t[7]=(n*c-l*e)*v,t[8]=(a*e-n*s)*v,this}transpose(){let t;const e=this.elements;return t=e[1],e[1]=e[3],e[3]=t,t=e[2],e[2]=e[6],e[6]=t,t=e[5],e[5]=e[7],e[7]=t,this}getNormalMatrix(t){return this.setFromMatrix4(t).invert().transpose()}transposeIntoArray(t){const e=this.elements;return t[0]=e[0],t[1]=e[3],t[2]=e[6],t[3]=e[1],t[4]=e[4],t[5]=e[7],t[6]=e[2],t[7]=e[5],t[8]=e[8],this}setUvTransform(t,e,n,r,s,a,o){const c=Math.cos(s),l=Math.sin(s);return this.set(n*c,n*l,-n*(c*a+l*o)+a+t,-r*l,r*c,-r*(-l*a+c*o)+o+e,0,0,1),this}scale(t,e){return this.premultiply(To.makeScale(t,e)),this}rotate(t){return this.premultiply(To.makeRotation(-t)),this}translate(t,e){return this.premultiply(To.makeTranslation(t,e)),this}makeTranslation(t,e){return t.isVector2?this.set(1,0,t.x,0,1,t.y,0,0,1):this.set(1,0,t,0,1,e,0,0,1),this}makeRotation(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,n,e,0,0,0,1),this}makeScale(t,e){return this.set(t,0,0,0,e,0,0,0,1),this}equals(t){const e=this.elements,n=t.elements;for(let r=0;r<9;r++)if(e[r]!==n[r])return!1;return!0}fromArray(t,e=0){for(let n=0;n<9;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){const n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t}clone(){return new this.constructor().fromArray(this.elements)}}const To=new te;function kf(i){for(let t=i.length-1;t>=0;--t)if(i[t]>=65535)return!0;return!1}function so(i){return document.createElementNS("http://www.w3.org/1999/xhtml",i)}function wp(){const i=so("canvas");return i.style.display="block",i}const Ah={};function Ws(i){i in Ah||(Ah[i]=!0,console.warn(i))}function Ep(i,t,e){return new Promise(function(n,r){function s(){switch(i.clientWaitSync(t,i.SYNC_FLUSH_COMMANDS_BIT,0)){case i.WAIT_FAILED:r();break;case i.TIMEOUT_EXPIRED:setTimeout(s,e);break;default:n()}}setTimeout(s,e)})}const Rh=new te().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),Ch=new te().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function Tp(){const i={enabled:!0,workingColorSpace:gr,spaces:{},convert:function(r,s,a){return this.enabled===!1||s===a||!s||!a||(this.spaces[s].transfer===fe&&(r.r=bi(r.r),r.g=bi(r.g),r.b=bi(r.b)),this.spaces[s].primaries!==this.spaces[a].primaries&&(r.applyMatrix3(this.spaces[s].toXYZ),r.applyMatrix3(this.spaces[a].fromXYZ)),this.spaces[a].transfer===fe&&(r.r=ns(r.r),r.g=ns(r.g),r.b=ns(r.b))),r},workingToColorSpace:function(r,s){return this.convert(r,this.workingColorSpace,s)},colorSpaceToWorking:function(r,s){return this.convert(r,s,this.workingColorSpace)},getPrimaries:function(r){return this.spaces[r].primaries},getTransfer:function(r){return r===ii?io:this.spaces[r].transfer},getToneMappingMode:function(r){return this.spaces[r].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(r,s=this.workingColorSpace){return r.fromArray(this.spaces[s].luminanceCoefficients)},define:function(r){Object.assign(this.spaces,r)},_getMatrix:function(r,s,a){return r.copy(this.spaces[s].toXYZ).multiply(this.spaces[a].fromXYZ)},_getDrawingBufferColorSpace:function(r){return this.spaces[r].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(r=this.workingColorSpace){return this.spaces[r].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(r,s){return Ws("THREE.ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),i.workingToColorSpace(r,s)},toWorkingColorSpace:function(r,s){return Ws("THREE.ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),i.colorSpaceToWorking(r,s)}},t=[.64,.33,.3,.6,.15,.06],e=[.2126,.7152,.0722],n=[.3127,.329];return i.define({[gr]:{primaries:t,whitePoint:n,transfer:io,toXYZ:Rh,fromXYZ:Ch,luminanceCoefficients:e,workingColorSpaceConfig:{unpackColorSpace:dn},outputColorSpaceConfig:{drawingBufferColorSpace:dn}},[dn]:{primaries:t,whitePoint:n,transfer:fe,toXYZ:Rh,fromXYZ:Ch,luminanceCoefficients:e,outputColorSpaceConfig:{drawingBufferColorSpace:dn}}}),i}const ce=Tp();function bi(i){return i<.04045?i*.0773993808:Math.pow(i*.9478672986+.0521327014,2.4)}function ns(i){return i<.0031308?i*12.92:1.055*Math.pow(i,.41666)-.055}let Tr;class Ap{static getDataURL(t,e="image/png"){if(/^data:/i.test(t.src)||typeof HTMLCanvasElement>"u")return t.src;let n;if(t instanceof HTMLCanvasElement)n=t;else{Tr===void 0&&(Tr=so("canvas")),Tr.width=t.width,Tr.height=t.height;const r=Tr.getContext("2d");t instanceof ImageData?r.putImageData(t,0,0):r.drawImage(t,0,0,t.width,t.height),n=Tr}return n.toDataURL(e)}static sRGBToLinear(t){if(typeof HTMLImageElement<"u"&&t instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&t instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&t instanceof ImageBitmap){const e=so("canvas");e.width=t.width,e.height=t.height;const n=e.getContext("2d");n.drawImage(t,0,0,t.width,t.height);const r=n.getImageData(0,0,t.width,t.height),s=r.data;for(let a=0;a<s.length;a++)s[a]=bi(s[a]/255)*255;return n.putImageData(r,0,0),e}else if(t.data){const e=t.data.slice(0);for(let n=0;n<e.length;n++)e instanceof Uint8Array||e instanceof Uint8ClampedArray?e[n]=Math.floor(bi(e[n]/255)*255):e[n]=bi(e[n]);return{data:e,width:t.width,height:t.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),t}}let Rp=0;class Il{constructor(t=null){this.isSource=!0,Object.defineProperty(this,"id",{value:Rp++}),this.uuid=Yi(),this.data=t,this.dataReady=!0,this.version=0}getSize(t){const e=this.data;return typeof HTMLVideoElement<"u"&&e instanceof HTMLVideoElement?t.set(e.videoWidth,e.videoHeight,0):e instanceof VideoFrame?t.set(e.displayHeight,e.displayWidth,0):e!==null?t.set(e.width,e.height,e.depth||0):t.set(0,0,0),t}set needsUpdate(t){t===!0&&this.version++}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.images[this.uuid]!==void 0)return t.images[this.uuid];const n={uuid:this.uuid,url:""},r=this.data;if(r!==null){let s;if(Array.isArray(r)){s=[];for(let a=0,o=r.length;a<o;a++)r[a].isDataTexture?s.push(Ao(r[a].image)):s.push(Ao(r[a]))}else s=Ao(r);n.url=s}return e||(t.images[this.uuid]=n),n}}function Ao(i){return typeof HTMLImageElement<"u"&&i instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&i instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&i instanceof ImageBitmap?Ap.getDataURL(i):i.data?{data:Array.from(i.data),width:i.width,height:i.height,type:i.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}let Cp=0;const Ro=new N;class Xe extends vs{constructor(t=Xe.DEFAULT_IMAGE,e=Xe.DEFAULT_MAPPING,n=cr,r=cr,s=xe,a=ki,o=We,c=Yn,l=Xe.DEFAULT_ANISOTROPY,h=ii){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:Cp++}),this.uuid=Yi(),this.name="",this.source=new Il(t),this.mipmaps=[],this.mapping=e,this.channel=0,this.wrapS=n,this.wrapT=r,this.magFilter=s,this.minFilter=a,this.anisotropy=l,this.format=o,this.internalFormat=null,this.type=c,this.offset=new dt(0,0),this.repeat=new dt(1,1),this.center=new dt(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new te,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=h,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(t&&t.depth&&t.depth>1),this.pmremVersion=0}get width(){return this.source.getSize(Ro).x}get height(){return this.source.getSize(Ro).y}get depth(){return this.source.getSize(Ro).z}get image(){return this.source.data}set image(t=null){this.source.data=t}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(t){return this.name=t.name,this.source=t.source,this.mipmaps=t.mipmaps.slice(0),this.mapping=t.mapping,this.channel=t.channel,this.wrapS=t.wrapS,this.wrapT=t.wrapT,this.magFilter=t.magFilter,this.minFilter=t.minFilter,this.anisotropy=t.anisotropy,this.format=t.format,this.internalFormat=t.internalFormat,this.type=t.type,this.offset.copy(t.offset),this.repeat.copy(t.repeat),this.center.copy(t.center),this.rotation=t.rotation,this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrix.copy(t.matrix),this.generateMipmaps=t.generateMipmaps,this.premultiplyAlpha=t.premultiplyAlpha,this.flipY=t.flipY,this.unpackAlignment=t.unpackAlignment,this.colorSpace=t.colorSpace,this.renderTarget=t.renderTarget,this.isRenderTargetTexture=t.isRenderTargetTexture,this.isArrayTexture=t.isArrayTexture,this.userData=JSON.parse(JSON.stringify(t.userData)),this.needsUpdate=!0,this}setValues(t){for(const e in t){const n=t[e];if(n===void 0){console.warn(`THREE.Texture.setValues(): parameter '${e}' has value of undefined.`);continue}const r=this[e];if(r===void 0){console.warn(`THREE.Texture.setValues(): property '${e}' does not exist.`);continue}r&&n&&r.isVector2&&n.isVector2||r&&n&&r.isVector3&&n.isVector3||r&&n&&r.isMatrix3&&n.isMatrix3?r.copy(n):this[e]=n}}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.textures[this.uuid]!==void 0)return t.textures[this.uuid];const n={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(t).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),e||(t.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(t){if(this.mapping!==Rf)return t;if(t.applyMatrix3(this.matrix),t.x<0||t.x>1)switch(this.wrapS){case us:t.x=t.x-Math.floor(t.x);break;case cr:t.x=t.x<0?0:1;break;case Pc:Math.abs(Math.floor(t.x)%2)===1?t.x=Math.ceil(t.x)-t.x:t.x=t.x-Math.floor(t.x);break}if(t.y<0||t.y>1)switch(this.wrapT){case us:t.y=t.y-Math.floor(t.y);break;case cr:t.y=t.y<0?0:1;break;case Pc:Math.abs(Math.floor(t.y)%2)===1?t.y=Math.ceil(t.y)-t.y:t.y=t.y-Math.floor(t.y);break}return this.flipY&&(t.y=1-t.y),t}set needsUpdate(t){t===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(t){t===!0&&this.pmremVersion++}}Xe.DEFAULT_IMAGE=null;Xe.DEFAULT_MAPPING=Rf;Xe.DEFAULT_ANISOTROPY=1;class le{constructor(t=0,e=0,n=0,r=1){le.prototype.isVector4=!0,this.x=t,this.y=e,this.z=n,this.w=r}get width(){return this.z}set width(t){this.z=t}get height(){return this.w}set height(t){this.w=t}set(t,e,n,r){return this.x=t,this.y=e,this.z=n,this.w=r,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this.w=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setW(t){return this.w=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;case 3:this.w=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this.w=t.w!==void 0?t.w:1,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this.w+=t.w,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this.w+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this.w=t.w+e.w,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this.w+=t.w*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this.w-=t.w,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this.w-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this.w=t.w-e.w,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this.w*=t.w,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this.w*=t,this}applyMatrix4(t){const e=this.x,n=this.y,r=this.z,s=this.w,a=t.elements;return this.x=a[0]*e+a[4]*n+a[8]*r+a[12]*s,this.y=a[1]*e+a[5]*n+a[9]*r+a[13]*s,this.z=a[2]*e+a[6]*n+a[10]*r+a[14]*s,this.w=a[3]*e+a[7]*n+a[11]*r+a[15]*s,this}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this.w/=t.w,this}divideScalar(t){return this.multiplyScalar(1/t)}setAxisAngleFromQuaternion(t){this.w=2*Math.acos(t.w);const e=Math.sqrt(1-t.w*t.w);return e<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=t.x/e,this.y=t.y/e,this.z=t.z/e),this}setAxisAngleFromRotationMatrix(t){let e,n,r,s;const c=t.elements,l=c[0],h=c[4],u=c[8],d=c[1],f=c[5],m=c[9],v=c[2],g=c[6],p=c[10];if(Math.abs(h-d)<.01&&Math.abs(u-v)<.01&&Math.abs(m-g)<.01){if(Math.abs(h+d)<.1&&Math.abs(u+v)<.1&&Math.abs(m+g)<.1&&Math.abs(l+f+p-3)<.1)return this.set(1,0,0,0),this;e=Math.PI;const M=(l+1)/2,_=(f+1)/2,w=(p+1)/2,E=(h+d)/4,A=(u+v)/4,R=(m+g)/4;return M>_&&M>w?M<.01?(n=0,r=.707106781,s=.707106781):(n=Math.sqrt(M),r=E/n,s=A/n):_>w?_<.01?(n=.707106781,r=0,s=.707106781):(r=Math.sqrt(_),n=E/r,s=R/r):w<.01?(n=.707106781,r=.707106781,s=0):(s=Math.sqrt(w),n=A/s,r=R/s),this.set(n,r,s,e),this}let y=Math.sqrt((g-m)*(g-m)+(u-v)*(u-v)+(d-h)*(d-h));return Math.abs(y)<.001&&(y=1),this.x=(g-m)/y,this.y=(u-v)/y,this.z=(d-h)/y,this.w=Math.acos((l+f+p-1)/2),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this.w=e[15],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this.w=Math.min(this.w,t.w),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this.w=Math.max(this.w,t.w),this}clamp(t,e){return this.x=ne(this.x,t.x,e.x),this.y=ne(this.y,t.y,e.y),this.z=ne(this.z,t.z,e.z),this.w=ne(this.w,t.w,e.w),this}clampScalar(t,e){return this.x=ne(this.x,t,e),this.y=ne(this.y,t,e),this.z=ne(this.z,t,e),this.w=ne(this.w,t,e),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(ne(n,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z+this.w*t.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this.w+=(t.w-this.w)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this.w=t.w+(e.w-t.w)*n,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z&&t.w===this.w}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this.w=t[e+3],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t[e+3]=this.w,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this.w=t.getW(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class Lp extends vs{constructor(t=1,e=1,n={}){super(),n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:xe,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1},n),this.isRenderTarget=!0,this.width=t,this.height=e,this.depth=n.depth,this.scissor=new le(0,0,t,e),this.scissorTest=!1,this.viewport=new le(0,0,t,e);const r={width:t,height:e,depth:n.depth},s=new Xe(r);this.textures=[];const a=n.count;for(let o=0;o<a;o++)this.textures[o]=s.clone(),this.textures[o].isRenderTargetTexture=!0,this.textures[o].renderTarget=this;this._setTextureOptions(n),this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this._depthTexture=null,this.depthTexture=n.depthTexture,this.samples=n.samples,this.multiview=n.multiview}_setTextureOptions(t={}){const e={minFilter:xe,generateMipmaps:!1,flipY:!1,internalFormat:null};t.mapping!==void 0&&(e.mapping=t.mapping),t.wrapS!==void 0&&(e.wrapS=t.wrapS),t.wrapT!==void 0&&(e.wrapT=t.wrapT),t.wrapR!==void 0&&(e.wrapR=t.wrapR),t.magFilter!==void 0&&(e.magFilter=t.magFilter),t.minFilter!==void 0&&(e.minFilter=t.minFilter),t.format!==void 0&&(e.format=t.format),t.type!==void 0&&(e.type=t.type),t.anisotropy!==void 0&&(e.anisotropy=t.anisotropy),t.colorSpace!==void 0&&(e.colorSpace=t.colorSpace),t.flipY!==void 0&&(e.flipY=t.flipY),t.generateMipmaps!==void 0&&(e.generateMipmaps=t.generateMipmaps),t.internalFormat!==void 0&&(e.internalFormat=t.internalFormat);for(let n=0;n<this.textures.length;n++)this.textures[n].setValues(e)}get texture(){return this.textures[0]}set texture(t){this.textures[0]=t}set depthTexture(t){this._depthTexture!==null&&(this._depthTexture.renderTarget=null),t!==null&&(t.renderTarget=this),this._depthTexture=t}get depthTexture(){return this._depthTexture}setSize(t,e,n=1){if(this.width!==t||this.height!==e||this.depth!==n){this.width=t,this.height=e,this.depth=n;for(let r=0,s=this.textures.length;r<s;r++)this.textures[r].image.width=t,this.textures[r].image.height=e,this.textures[r].image.depth=n,this.textures[r].isArrayTexture=this.textures[r].image.depth>1;this.dispose()}this.viewport.set(0,0,t,e),this.scissor.set(0,0,t,e)}clone(){return new this.constructor().copy(this)}copy(t){this.width=t.width,this.height=t.height,this.depth=t.depth,this.scissor.copy(t.scissor),this.scissorTest=t.scissorTest,this.viewport.copy(t.viewport),this.textures.length=0;for(let e=0,n=t.textures.length;e<n;e++){this.textures[e]=t.textures[e].clone(),this.textures[e].isRenderTargetTexture=!0,this.textures[e].renderTarget=this;const r=Object.assign({},t.textures[e].image);this.textures[e].source=new Il(r)}return this.depthBuffer=t.depthBuffer,this.stencilBuffer=t.stencilBuffer,this.resolveDepthBuffer=t.resolveDepthBuffer,this.resolveStencilBuffer=t.resolveStencilBuffer,t.depthTexture!==null&&(this.depthTexture=t.depthTexture.clone()),this.samples=t.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class rn extends Lp{constructor(t=1,e=1,n={}){super(t,e,n),this.isWebGLRenderTarget=!0}}class Ul extends Xe{constructor(t=null,e=1,n=1,r=1){super(null),this.isDataArrayTexture=!0,this.image={data:t,width:e,height:n,depth:r},this.magFilter=An,this.minFilter=An,this.wrapR=cr,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(t){this.layerUpdates.add(t)}clearLayerUpdates(){this.layerUpdates.clear()}}class Pp extends rn{constructor(t=1,e=1,n=1,r={}){super(t,e,r),this.isWebGLArrayRenderTarget=!0,this.depth=n,this.texture=new Ul(null,t,e,n),this._setTextureOptions(r),this.texture.isRenderTargetTexture=!0}}class Dp extends Xe{constructor(t=null,e=1,n=1,r=1){super(null),this.isData3DTexture=!0,this.image={data:t,width:e,height:n,depth:r},this.magFilter=An,this.minFilter=An,this.wrapR=cr,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class xs{constructor(t=new N(1/0,1/0,1/0),e=new N(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=t,this.max=e}set(t,e){return this.min.copy(t),this.max.copy(e),this}setFromArray(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e+=3)this.expandByPoint(Bn.fromArray(t,e));return this}setFromBufferAttribute(t){this.makeEmpty();for(let e=0,n=t.count;e<n;e++)this.expandByPoint(Bn.fromBufferAttribute(t,e));return this}setFromPoints(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e++)this.expandByPoint(t[e]);return this}setFromCenterAndSize(t,e){const n=Bn.copy(e).multiplyScalar(.5);return this.min.copy(t).sub(n),this.max.copy(t).add(n),this}setFromObject(t,e=!1){return this.makeEmpty(),this.expandByObject(t,e)}clone(){return new this.constructor().copy(this)}copy(t){return this.min.copy(t.min),this.max.copy(t.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(t){return this.isEmpty()?t.set(0,0,0):t.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(t){return this.isEmpty()?t.set(0,0,0):t.subVectors(this.max,this.min)}expandByPoint(t){return this.min.min(t),this.max.max(t),this}expandByVector(t){return this.min.sub(t),this.max.add(t),this}expandByScalar(t){return this.min.addScalar(-t),this.max.addScalar(t),this}expandByObject(t,e=!1){t.updateWorldMatrix(!1,!1);const n=t.geometry;if(n!==void 0){const s=n.getAttribute("position");if(e===!0&&s!==void 0&&t.isInstancedMesh!==!0)for(let a=0,o=s.count;a<o;a++)t.isMesh===!0?t.getVertexPosition(a,Bn):Bn.fromBufferAttribute(s,a),Bn.applyMatrix4(t.matrixWorld),this.expandByPoint(Bn);else t.boundingBox!==void 0?(t.boundingBox===null&&t.computeBoundingBox(),fa.copy(t.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),fa.copy(n.boundingBox)),fa.applyMatrix4(t.matrixWorld),this.union(fa)}const r=t.children;for(let s=0,a=r.length;s<a;s++)this.expandByObject(r[s],e);return this}containsPoint(t){return t.x>=this.min.x&&t.x<=this.max.x&&t.y>=this.min.y&&t.y<=this.max.y&&t.z>=this.min.z&&t.z<=this.max.z}containsBox(t){return this.min.x<=t.min.x&&t.max.x<=this.max.x&&this.min.y<=t.min.y&&t.max.y<=this.max.y&&this.min.z<=t.min.z&&t.max.z<=this.max.z}getParameter(t,e){return e.set((t.x-this.min.x)/(this.max.x-this.min.x),(t.y-this.min.y)/(this.max.y-this.min.y),(t.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(t){return t.max.x>=this.min.x&&t.min.x<=this.max.x&&t.max.y>=this.min.y&&t.min.y<=this.max.y&&t.max.z>=this.min.z&&t.min.z<=this.max.z}intersectsSphere(t){return this.clampPoint(t.center,Bn),Bn.distanceToSquared(t.center)<=t.radius*t.radius}intersectsPlane(t){let e,n;return t.normal.x>0?(e=t.normal.x*this.min.x,n=t.normal.x*this.max.x):(e=t.normal.x*this.max.x,n=t.normal.x*this.min.x),t.normal.y>0?(e+=t.normal.y*this.min.y,n+=t.normal.y*this.max.y):(e+=t.normal.y*this.max.y,n+=t.normal.y*this.min.y),t.normal.z>0?(e+=t.normal.z*this.min.z,n+=t.normal.z*this.max.z):(e+=t.normal.z*this.max.z,n+=t.normal.z*this.min.z),e<=-t.constant&&n>=-t.constant}intersectsTriangle(t){if(this.isEmpty())return!1;this.getCenter(Ss),da.subVectors(this.max,Ss),Ar.subVectors(t.a,Ss),Rr.subVectors(t.b,Ss),Cr.subVectors(t.c,Ss),Ai.subVectors(Rr,Ar),Ri.subVectors(Cr,Rr),Zi.subVectors(Ar,Cr);let e=[0,-Ai.z,Ai.y,0,-Ri.z,Ri.y,0,-Zi.z,Zi.y,Ai.z,0,-Ai.x,Ri.z,0,-Ri.x,Zi.z,0,-Zi.x,-Ai.y,Ai.x,0,-Ri.y,Ri.x,0,-Zi.y,Zi.x,0];return!Co(e,Ar,Rr,Cr,da)||(e=[1,0,0,0,1,0,0,0,1],!Co(e,Ar,Rr,Cr,da))?!1:(pa.crossVectors(Ai,Ri),e=[pa.x,pa.y,pa.z],Co(e,Ar,Rr,Cr,da))}clampPoint(t,e){return e.copy(t).clamp(this.min,this.max)}distanceToPoint(t){return this.clampPoint(t,Bn).distanceTo(t)}getBoundingSphere(t){return this.isEmpty()?t.makeEmpty():(this.getCenter(t.center),t.radius=this.getSize(Bn).length()*.5),t}intersect(t){return this.min.max(t.min),this.max.min(t.max),this.isEmpty()&&this.makeEmpty(),this}union(t){return this.min.min(t.min),this.max.max(t.max),this}applyMatrix4(t){return this.isEmpty()?this:(hi[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(t),hi[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(t),hi[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(t),hi[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(t),hi[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(t),hi[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(t),hi[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(t),hi[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(t),this.setFromPoints(hi),this)}translate(t){return this.min.add(t),this.max.add(t),this}equals(t){return t.min.equals(this.min)&&t.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(t){return this.min.fromArray(t.min),this.max.fromArray(t.max),this}}const hi=[new N,new N,new N,new N,new N,new N,new N,new N],Bn=new N,fa=new xs,Ar=new N,Rr=new N,Cr=new N,Ai=new N,Ri=new N,Zi=new N,Ss=new N,da=new N,pa=new N,Ki=new N;function Co(i,t,e,n,r){for(let s=0,a=i.length-3;s<=a;s+=3){Ki.fromArray(i,s);const o=r.x*Math.abs(Ki.x)+r.y*Math.abs(Ki.y)+r.z*Math.abs(Ki.z),c=t.dot(Ki),l=e.dot(Ki),h=n.dot(Ki);if(Math.max(-Math.max(c,l,h),Math.min(c,l,h))>o)return!1}return!0}const Ip=new xs,ws=new N,Lo=new N;class yr{constructor(t=new N,e=-1){this.isSphere=!0,this.center=t,this.radius=e}set(t,e){return this.center.copy(t),this.radius=e,this}setFromPoints(t,e){const n=this.center;e!==void 0?n.copy(e):Ip.setFromPoints(t).getCenter(n);let r=0;for(let s=0,a=t.length;s<a;s++)r=Math.max(r,n.distanceToSquared(t[s]));return this.radius=Math.sqrt(r),this}copy(t){return this.center.copy(t.center),this.radius=t.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(t){return t.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(t){return t.distanceTo(this.center)-this.radius}intersectsSphere(t){const e=this.radius+t.radius;return t.center.distanceToSquared(this.center)<=e*e}intersectsBox(t){return t.intersectsSphere(this)}intersectsPlane(t){return Math.abs(t.distanceToPoint(this.center))<=this.radius}clampPoint(t,e){const n=this.center.distanceToSquared(t);return e.copy(t),n>this.radius*this.radius&&(e.sub(this.center).normalize(),e.multiplyScalar(this.radius).add(this.center)),e}getBoundingBox(t){return this.isEmpty()?(t.makeEmpty(),t):(t.set(this.center,this.center),t.expandByScalar(this.radius),t)}applyMatrix4(t){return this.center.applyMatrix4(t),this.radius=this.radius*t.getMaxScaleOnAxis(),this}translate(t){return this.center.add(t),this}expandByPoint(t){if(this.isEmpty())return this.center.copy(t),this.radius=0,this;ws.subVectors(t,this.center);const e=ws.lengthSq();if(e>this.radius*this.radius){const n=Math.sqrt(e),r=(n-this.radius)*.5;this.center.addScaledVector(ws,r/n),this.radius+=r}return this}union(t){return t.isEmpty()?this:this.isEmpty()?(this.copy(t),this):(this.center.equals(t.center)===!0?this.radius=Math.max(this.radius,t.radius):(Lo.subVectors(t.center,this.center).setLength(t.radius),this.expandByPoint(ws.copy(t.center).add(Lo)),this.expandByPoint(ws.copy(t.center).sub(Lo))),this)}equals(t){return t.center.equals(this.center)&&t.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(t){return this.radius=t.radius,this.center.fromArray(t.center),this}}const ui=new N,Po=new N,ma=new N,Ci=new N,Do=new N,ga=new N,Io=new N;class Nl{constructor(t=new N,e=new N(0,0,-1)){this.origin=t,this.direction=e}set(t,e){return this.origin.copy(t),this.direction.copy(e),this}copy(t){return this.origin.copy(t.origin),this.direction.copy(t.direction),this}at(t,e){return e.copy(this.origin).addScaledVector(this.direction,t)}lookAt(t){return this.direction.copy(t).sub(this.origin).normalize(),this}recast(t){return this.origin.copy(this.at(t,ui)),this}closestPointToPoint(t,e){e.subVectors(t,this.origin);const n=e.dot(this.direction);return n<0?e.copy(this.origin):e.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(t){return Math.sqrt(this.distanceSqToPoint(t))}distanceSqToPoint(t){const e=ui.subVectors(t,this.origin).dot(this.direction);return e<0?this.origin.distanceToSquared(t):(ui.copy(this.origin).addScaledVector(this.direction,e),ui.distanceToSquared(t))}distanceSqToSegment(t,e,n,r){Po.copy(t).add(e).multiplyScalar(.5),ma.copy(e).sub(t).normalize(),Ci.copy(this.origin).sub(Po);const s=t.distanceTo(e)*.5,a=-this.direction.dot(ma),o=Ci.dot(this.direction),c=-Ci.dot(ma),l=Ci.lengthSq(),h=Math.abs(1-a*a);let u,d,f,m;if(h>0)if(u=a*c-o,d=a*o-c,m=s*h,u>=0)if(d>=-m)if(d<=m){const v=1/h;u*=v,d*=v,f=u*(u+a*d+2*o)+d*(a*u+d+2*c)+l}else d=s,u=Math.max(0,-(a*d+o)),f=-u*u+d*(d+2*c)+l;else d=-s,u=Math.max(0,-(a*d+o)),f=-u*u+d*(d+2*c)+l;else d<=-m?(u=Math.max(0,-(-a*s+o)),d=u>0?-s:Math.min(Math.max(-s,-c),s),f=-u*u+d*(d+2*c)+l):d<=m?(u=0,d=Math.min(Math.max(-s,-c),s),f=d*(d+2*c)+l):(u=Math.max(0,-(a*s+o)),d=u>0?s:Math.min(Math.max(-s,-c),s),f=-u*u+d*(d+2*c)+l);else d=a>0?-s:s,u=Math.max(0,-(a*d+o)),f=-u*u+d*(d+2*c)+l;return n&&n.copy(this.origin).addScaledVector(this.direction,u),r&&r.copy(Po).addScaledVector(ma,d),f}intersectSphere(t,e){ui.subVectors(t.center,this.origin);const n=ui.dot(this.direction),r=ui.dot(ui)-n*n,s=t.radius*t.radius;if(r>s)return null;const a=Math.sqrt(s-r),o=n-a,c=n+a;return c<0?null:o<0?this.at(c,e):this.at(o,e)}intersectsSphere(t){return t.radius<0?!1:this.distanceSqToPoint(t.center)<=t.radius*t.radius}distanceToPlane(t){const e=t.normal.dot(this.direction);if(e===0)return t.distanceToPoint(this.origin)===0?0:null;const n=-(this.origin.dot(t.normal)+t.constant)/e;return n>=0?n:null}intersectPlane(t,e){const n=this.distanceToPlane(t);return n===null?null:this.at(n,e)}intersectsPlane(t){const e=t.distanceToPoint(this.origin);return e===0||t.normal.dot(this.direction)*e<0}intersectBox(t,e){let n,r,s,a,o,c;const l=1/this.direction.x,h=1/this.direction.y,u=1/this.direction.z,d=this.origin;return l>=0?(n=(t.min.x-d.x)*l,r=(t.max.x-d.x)*l):(n=(t.max.x-d.x)*l,r=(t.min.x-d.x)*l),h>=0?(s=(t.min.y-d.y)*h,a=(t.max.y-d.y)*h):(s=(t.max.y-d.y)*h,a=(t.min.y-d.y)*h),n>a||s>r||((s>n||isNaN(n))&&(n=s),(a<r||isNaN(r))&&(r=a),u>=0?(o=(t.min.z-d.z)*u,c=(t.max.z-d.z)*u):(o=(t.max.z-d.z)*u,c=(t.min.z-d.z)*u),n>c||o>r)||((o>n||n!==n)&&(n=o),(c<r||r!==r)&&(r=c),r<0)?null:this.at(n>=0?n:r,e)}intersectsBox(t){return this.intersectBox(t,ui)!==null}intersectTriangle(t,e,n,r,s){Do.subVectors(e,t),ga.subVectors(n,t),Io.crossVectors(Do,ga);let a=this.direction.dot(Io),o;if(a>0){if(r)return null;o=1}else if(a<0)o=-1,a=-a;else return null;Ci.subVectors(this.origin,t);const c=o*this.direction.dot(ga.crossVectors(Ci,ga));if(c<0)return null;const l=o*this.direction.dot(Do.cross(Ci));if(l<0||c+l>a)return null;const h=-o*Ci.dot(Io);return h<0?null:this.at(h/a,s)}applyMatrix4(t){return this.origin.applyMatrix4(t),this.direction.transformDirection(t),this}equals(t){return t.origin.equals(this.origin)&&t.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class re{constructor(t,e,n,r,s,a,o,c,l,h,u,d,f,m,v,g){re.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],t!==void 0&&this.set(t,e,n,r,s,a,o,c,l,h,u,d,f,m,v,g)}set(t,e,n,r,s,a,o,c,l,h,u,d,f,m,v,g){const p=this.elements;return p[0]=t,p[4]=e,p[8]=n,p[12]=r,p[1]=s,p[5]=a,p[9]=o,p[13]=c,p[2]=l,p[6]=h,p[10]=u,p[14]=d,p[3]=f,p[7]=m,p[11]=v,p[15]=g,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new re().fromArray(this.elements)}copy(t){const e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],e[9]=n[9],e[10]=n[10],e[11]=n[11],e[12]=n[12],e[13]=n[13],e[14]=n[14],e[15]=n[15],this}copyPosition(t){const e=this.elements,n=t.elements;return e[12]=n[12],e[13]=n[13],e[14]=n[14],this}setFromMatrix3(t){const e=t.elements;return this.set(e[0],e[3],e[6],0,e[1],e[4],e[7],0,e[2],e[5],e[8],0,0,0,0,1),this}extractBasis(t,e,n){return t.setFromMatrixColumn(this,0),e.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this}makeBasis(t,e,n){return this.set(t.x,e.x,n.x,0,t.y,e.y,n.y,0,t.z,e.z,n.z,0,0,0,0,1),this}extractRotation(t){const e=this.elements,n=t.elements,r=1/Lr.setFromMatrixColumn(t,0).length(),s=1/Lr.setFromMatrixColumn(t,1).length(),a=1/Lr.setFromMatrixColumn(t,2).length();return e[0]=n[0]*r,e[1]=n[1]*r,e[2]=n[2]*r,e[3]=0,e[4]=n[4]*s,e[5]=n[5]*s,e[6]=n[6]*s,e[7]=0,e[8]=n[8]*a,e[9]=n[9]*a,e[10]=n[10]*a,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromEuler(t){const e=this.elements,n=t.x,r=t.y,s=t.z,a=Math.cos(n),o=Math.sin(n),c=Math.cos(r),l=Math.sin(r),h=Math.cos(s),u=Math.sin(s);if(t.order==="XYZ"){const d=a*h,f=a*u,m=o*h,v=o*u;e[0]=c*h,e[4]=-c*u,e[8]=l,e[1]=f+m*l,e[5]=d-v*l,e[9]=-o*c,e[2]=v-d*l,e[6]=m+f*l,e[10]=a*c}else if(t.order==="YXZ"){const d=c*h,f=c*u,m=l*h,v=l*u;e[0]=d+v*o,e[4]=m*o-f,e[8]=a*l,e[1]=a*u,e[5]=a*h,e[9]=-o,e[2]=f*o-m,e[6]=v+d*o,e[10]=a*c}else if(t.order==="ZXY"){const d=c*h,f=c*u,m=l*h,v=l*u;e[0]=d-v*o,e[4]=-a*u,e[8]=m+f*o,e[1]=f+m*o,e[5]=a*h,e[9]=v-d*o,e[2]=-a*l,e[6]=o,e[10]=a*c}else if(t.order==="ZYX"){const d=a*h,f=a*u,m=o*h,v=o*u;e[0]=c*h,e[4]=m*l-f,e[8]=d*l+v,e[1]=c*u,e[5]=v*l+d,e[9]=f*l-m,e[2]=-l,e[6]=o*c,e[10]=a*c}else if(t.order==="YZX"){const d=a*c,f=a*l,m=o*c,v=o*l;e[0]=c*h,e[4]=v-d*u,e[8]=m*u+f,e[1]=u,e[5]=a*h,e[9]=-o*h,e[2]=-l*h,e[6]=f*u+m,e[10]=d-v*u}else if(t.order==="XZY"){const d=a*c,f=a*l,m=o*c,v=o*l;e[0]=c*h,e[4]=-u,e[8]=l*h,e[1]=d*u+v,e[5]=a*h,e[9]=f*u-m,e[2]=m*u-f,e[6]=o*h,e[10]=v*u+d}return e[3]=0,e[7]=0,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromQuaternion(t){return this.compose(Up,t,Np)}lookAt(t,e,n){const r=this.elements;return xn.subVectors(t,e),xn.lengthSq()===0&&(xn.z=1),xn.normalize(),Li.crossVectors(n,xn),Li.lengthSq()===0&&(Math.abs(n.z)===1?xn.x+=1e-4:xn.z+=1e-4,xn.normalize(),Li.crossVectors(n,xn)),Li.normalize(),va.crossVectors(xn,Li),r[0]=Li.x,r[4]=va.x,r[8]=xn.x,r[1]=Li.y,r[5]=va.y,r[9]=xn.y,r[2]=Li.z,r[6]=va.z,r[10]=xn.z,this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const n=t.elements,r=e.elements,s=this.elements,a=n[0],o=n[4],c=n[8],l=n[12],h=n[1],u=n[5],d=n[9],f=n[13],m=n[2],v=n[6],g=n[10],p=n[14],y=n[3],M=n[7],_=n[11],w=n[15],E=r[0],A=r[4],R=r[8],x=r[12],b=r[1],S=r[5],T=r[9],L=r[13],D=r[2],U=r[6],B=r[10],X=r[14],H=r[3],Q=r[7],ct=r[11],ut=r[15];return s[0]=a*E+o*b+c*D+l*H,s[4]=a*A+o*S+c*U+l*Q,s[8]=a*R+o*T+c*B+l*ct,s[12]=a*x+o*L+c*X+l*ut,s[1]=h*E+u*b+d*D+f*H,s[5]=h*A+u*S+d*U+f*Q,s[9]=h*R+u*T+d*B+f*ct,s[13]=h*x+u*L+d*X+f*ut,s[2]=m*E+v*b+g*D+p*H,s[6]=m*A+v*S+g*U+p*Q,s[10]=m*R+v*T+g*B+p*ct,s[14]=m*x+v*L+g*X+p*ut,s[3]=y*E+M*b+_*D+w*H,s[7]=y*A+M*S+_*U+w*Q,s[11]=y*R+M*T+_*B+w*ct,s[15]=y*x+M*L+_*X+w*ut,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[4]*=t,e[8]*=t,e[12]*=t,e[1]*=t,e[5]*=t,e[9]*=t,e[13]*=t,e[2]*=t,e[6]*=t,e[10]*=t,e[14]*=t,e[3]*=t,e[7]*=t,e[11]*=t,e[15]*=t,this}determinant(){const t=this.elements,e=t[0],n=t[4],r=t[8],s=t[12],a=t[1],o=t[5],c=t[9],l=t[13],h=t[2],u=t[6],d=t[10],f=t[14],m=t[3],v=t[7],g=t[11],p=t[15];return m*(+s*c*u-r*l*u-s*o*d+n*l*d+r*o*f-n*c*f)+v*(+e*c*f-e*l*d+s*a*d-r*a*f+r*l*h-s*c*h)+g*(+e*l*u-e*o*f-s*a*u+n*a*f+s*o*h-n*l*h)+p*(-r*o*h-e*c*u+e*o*d+r*a*u-n*a*d+n*c*h)}transpose(){const t=this.elements;let e;return e=t[1],t[1]=t[4],t[4]=e,e=t[2],t[2]=t[8],t[8]=e,e=t[6],t[6]=t[9],t[9]=e,e=t[3],t[3]=t[12],t[12]=e,e=t[7],t[7]=t[13],t[13]=e,e=t[11],t[11]=t[14],t[14]=e,this}setPosition(t,e,n){const r=this.elements;return t.isVector3?(r[12]=t.x,r[13]=t.y,r[14]=t.z):(r[12]=t,r[13]=e,r[14]=n),this}invert(){const t=this.elements,e=t[0],n=t[1],r=t[2],s=t[3],a=t[4],o=t[5],c=t[6],l=t[7],h=t[8],u=t[9],d=t[10],f=t[11],m=t[12],v=t[13],g=t[14],p=t[15],y=u*g*l-v*d*l+v*c*f-o*g*f-u*c*p+o*d*p,M=m*d*l-h*g*l-m*c*f+a*g*f+h*c*p-a*d*p,_=h*v*l-m*u*l+m*o*f-a*v*f-h*o*p+a*u*p,w=m*u*c-h*v*c-m*o*d+a*v*d+h*o*g-a*u*g,E=e*y+n*M+r*_+s*w;if(E===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const A=1/E;return t[0]=y*A,t[1]=(v*d*s-u*g*s-v*r*f+n*g*f+u*r*p-n*d*p)*A,t[2]=(o*g*s-v*c*s+v*r*l-n*g*l-o*r*p+n*c*p)*A,t[3]=(u*c*s-o*d*s-u*r*l+n*d*l+o*r*f-n*c*f)*A,t[4]=M*A,t[5]=(h*g*s-m*d*s+m*r*f-e*g*f-h*r*p+e*d*p)*A,t[6]=(m*c*s-a*g*s-m*r*l+e*g*l+a*r*p-e*c*p)*A,t[7]=(a*d*s-h*c*s+h*r*l-e*d*l-a*r*f+e*c*f)*A,t[8]=_*A,t[9]=(m*u*s-h*v*s-m*n*f+e*v*f+h*n*p-e*u*p)*A,t[10]=(a*v*s-m*o*s+m*n*l-e*v*l-a*n*p+e*o*p)*A,t[11]=(h*o*s-a*u*s-h*n*l+e*u*l+a*n*f-e*o*f)*A,t[12]=w*A,t[13]=(h*v*r-m*u*r+m*n*d-e*v*d-h*n*g+e*u*g)*A,t[14]=(m*o*r-a*v*r-m*n*c+e*v*c+a*n*g-e*o*g)*A,t[15]=(a*u*r-h*o*r+h*n*c-e*u*c-a*n*d+e*o*d)*A,this}scale(t){const e=this.elements,n=t.x,r=t.y,s=t.z;return e[0]*=n,e[4]*=r,e[8]*=s,e[1]*=n,e[5]*=r,e[9]*=s,e[2]*=n,e[6]*=r,e[10]*=s,e[3]*=n,e[7]*=r,e[11]*=s,this}getMaxScaleOnAxis(){const t=this.elements,e=t[0]*t[0]+t[1]*t[1]+t[2]*t[2],n=t[4]*t[4]+t[5]*t[5]+t[6]*t[6],r=t[8]*t[8]+t[9]*t[9]+t[10]*t[10];return Math.sqrt(Math.max(e,n,r))}makeTranslation(t,e,n){return t.isVector3?this.set(1,0,0,t.x,0,1,0,t.y,0,0,1,t.z,0,0,0,1):this.set(1,0,0,t,0,1,0,e,0,0,1,n,0,0,0,1),this}makeRotationX(t){const e=Math.cos(t),n=Math.sin(t);return this.set(1,0,0,0,0,e,-n,0,0,n,e,0,0,0,0,1),this}makeRotationY(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,0,n,0,0,1,0,0,-n,0,e,0,0,0,0,1),this}makeRotationZ(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,0,n,e,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(t,e){const n=Math.cos(e),r=Math.sin(e),s=1-n,a=t.x,o=t.y,c=t.z,l=s*a,h=s*o;return this.set(l*a+n,l*o-r*c,l*c+r*o,0,l*o+r*c,h*o+n,h*c-r*a,0,l*c-r*o,h*c+r*a,s*c*c+n,0,0,0,0,1),this}makeScale(t,e,n){return this.set(t,0,0,0,0,e,0,0,0,0,n,0,0,0,0,1),this}makeShear(t,e,n,r,s,a){return this.set(1,n,s,0,t,1,a,0,e,r,1,0,0,0,0,1),this}compose(t,e,n){const r=this.elements,s=e._x,a=e._y,o=e._z,c=e._w,l=s+s,h=a+a,u=o+o,d=s*l,f=s*h,m=s*u,v=a*h,g=a*u,p=o*u,y=c*l,M=c*h,_=c*u,w=n.x,E=n.y,A=n.z;return r[0]=(1-(v+p))*w,r[1]=(f+_)*w,r[2]=(m-M)*w,r[3]=0,r[4]=(f-_)*E,r[5]=(1-(d+p))*E,r[6]=(g+y)*E,r[7]=0,r[8]=(m+M)*A,r[9]=(g-y)*A,r[10]=(1-(d+v))*A,r[11]=0,r[12]=t.x,r[13]=t.y,r[14]=t.z,r[15]=1,this}decompose(t,e,n){const r=this.elements;let s=Lr.set(r[0],r[1],r[2]).length();const a=Lr.set(r[4],r[5],r[6]).length(),o=Lr.set(r[8],r[9],r[10]).length();this.determinant()<0&&(s=-s),t.x=r[12],t.y=r[13],t.z=r[14],kn.copy(this);const l=1/s,h=1/a,u=1/o;return kn.elements[0]*=l,kn.elements[1]*=l,kn.elements[2]*=l,kn.elements[4]*=h,kn.elements[5]*=h,kn.elements[6]*=h,kn.elements[8]*=u,kn.elements[9]*=u,kn.elements[10]*=u,e.setFromRotationMatrix(kn),n.x=s,n.y=a,n.z=o,this}makePerspective(t,e,n,r,s,a,o=si,c=!1){const l=this.elements,h=2*s/(e-t),u=2*s/(n-r),d=(e+t)/(e-t),f=(n+r)/(n-r);let m,v;if(c)m=s/(a-s),v=a*s/(a-s);else if(o===si)m=-(a+s)/(a-s),v=-2*a*s/(a-s);else if(o===ro)m=-a/(a-s),v=-a*s/(a-s);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+o);return l[0]=h,l[4]=0,l[8]=d,l[12]=0,l[1]=0,l[5]=u,l[9]=f,l[13]=0,l[2]=0,l[6]=0,l[10]=m,l[14]=v,l[3]=0,l[7]=0,l[11]=-1,l[15]=0,this}makeOrthographic(t,e,n,r,s,a,o=si,c=!1){const l=this.elements,h=2/(e-t),u=2/(n-r),d=-(e+t)/(e-t),f=-(n+r)/(n-r);let m,v;if(c)m=1/(a-s),v=a/(a-s);else if(o===si)m=-2/(a-s),v=-(a+s)/(a-s);else if(o===ro)m=-1/(a-s),v=-s/(a-s);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+o);return l[0]=h,l[4]=0,l[8]=0,l[12]=d,l[1]=0,l[5]=u,l[9]=0,l[13]=f,l[2]=0,l[6]=0,l[10]=m,l[14]=v,l[3]=0,l[7]=0,l[11]=0,l[15]=1,this}equals(t){const e=this.elements,n=t.elements;for(let r=0;r<16;r++)if(e[r]!==n[r])return!1;return!0}fromArray(t,e=0){for(let n=0;n<16;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){const n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t[e+9]=n[9],t[e+10]=n[10],t[e+11]=n[11],t[e+12]=n[12],t[e+13]=n[13],t[e+14]=n[14],t[e+15]=n[15],t}}const Lr=new N,kn=new re,Up=new N(0,0,0),Np=new N(1,1,1),Li=new N,va=new N,xn=new N,Lh=new re,Ph=new Ge;class On{constructor(t=0,e=0,n=0,r=On.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=e,this._z=n,this._order=r}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get order(){return this._order}set order(t){this._order=t,this._onChangeCallback()}set(t,e,n,r=this._order){return this._x=t,this._y=e,this._z=n,this._order=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(t){return this._x=t._x,this._y=t._y,this._z=t._z,this._order=t._order,this._onChangeCallback(),this}setFromRotationMatrix(t,e=this._order,n=!0){const r=t.elements,s=r[0],a=r[4],o=r[8],c=r[1],l=r[5],h=r[9],u=r[2],d=r[6],f=r[10];switch(e){case"XYZ":this._y=Math.asin(ne(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-h,f),this._z=Math.atan2(-a,s)):(this._x=Math.atan2(d,l),this._z=0);break;case"YXZ":this._x=Math.asin(-ne(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(o,f),this._z=Math.atan2(c,l)):(this._y=Math.atan2(-u,s),this._z=0);break;case"ZXY":this._x=Math.asin(ne(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(-u,f),this._z=Math.atan2(-a,l)):(this._y=0,this._z=Math.atan2(c,s));break;case"ZYX":this._y=Math.asin(-ne(u,-1,1)),Math.abs(u)<.9999999?(this._x=Math.atan2(d,f),this._z=Math.atan2(c,s)):(this._x=0,this._z=Math.atan2(-a,l));break;case"YZX":this._z=Math.asin(ne(c,-1,1)),Math.abs(c)<.9999999?(this._x=Math.atan2(-h,l),this._y=Math.atan2(-u,s)):(this._x=0,this._y=Math.atan2(o,f));break;case"XZY":this._z=Math.asin(-ne(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(d,l),this._y=Math.atan2(o,s)):(this._x=Math.atan2(-h,f),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+e)}return this._order=e,n===!0&&this._onChangeCallback(),this}setFromQuaternion(t,e,n){return Lh.makeRotationFromQuaternion(t),this.setFromRotationMatrix(Lh,e,n)}setFromVector3(t,e=this._order){return this.set(t.x,t.y,t.z,e)}reorder(t){return Ph.setFromEuler(this),this.setFromQuaternion(Ph,t)}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._order===this._order}fromArray(t){return this._x=t[0],this._y=t[1],this._z=t[2],t[3]!==void 0&&(this._order=t[3]),this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._order,t}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}On.DEFAULT_ORDER="XYZ";class zf{constructor(){this.mask=1}set(t){this.mask=(1<<t|0)>>>0}enable(t){this.mask|=1<<t|0}enableAll(){this.mask=-1}toggle(t){this.mask^=1<<t|0}disable(t){this.mask&=~(1<<t|0)}disableAll(){this.mask=0}test(t){return(this.mask&t.mask)!==0}isEnabled(t){return(this.mask&(1<<t|0))!==0}}let Fp=0;const Dh=new N,Pr=new Ge,fi=new re,xa=new N,Es=new N,Op=new N,Bp=new Ge,Ih=new N(1,0,0),Uh=new N(0,1,0),Nh=new N(0,0,1),Fh={type:"added"},kp={type:"removed"},Dr={type:"childadded",child:null},Uo={type:"childremoved",child:null};class Ce extends vs{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:Fp++}),this.uuid=Yi(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=Ce.DEFAULT_UP.clone();const t=new N,e=new On,n=new Ge,r=new N(1,1,1);function s(){n.setFromEuler(e,!1)}function a(){e.setFromQuaternion(n,void 0,!1)}e._onChange(s),n._onChange(a),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:e},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:r},modelViewMatrix:{value:new re},normalMatrix:{value:new te}}),this.matrix=new re,this.matrixWorld=new re,this.matrixAutoUpdate=Ce.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=Ce.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new zf,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(t){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(t),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(t){return this.quaternion.premultiply(t),this}setRotationFromAxisAngle(t,e){this.quaternion.setFromAxisAngle(t,e)}setRotationFromEuler(t){this.quaternion.setFromEuler(t,!0)}setRotationFromMatrix(t){this.quaternion.setFromRotationMatrix(t)}setRotationFromQuaternion(t){this.quaternion.copy(t)}rotateOnAxis(t,e){return Pr.setFromAxisAngle(t,e),this.quaternion.multiply(Pr),this}rotateOnWorldAxis(t,e){return Pr.setFromAxisAngle(t,e),this.quaternion.premultiply(Pr),this}rotateX(t){return this.rotateOnAxis(Ih,t)}rotateY(t){return this.rotateOnAxis(Uh,t)}rotateZ(t){return this.rotateOnAxis(Nh,t)}translateOnAxis(t,e){return Dh.copy(t).applyQuaternion(this.quaternion),this.position.add(Dh.multiplyScalar(e)),this}translateX(t){return this.translateOnAxis(Ih,t)}translateY(t){return this.translateOnAxis(Uh,t)}translateZ(t){return this.translateOnAxis(Nh,t)}localToWorld(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(this.matrixWorld)}worldToLocal(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(fi.copy(this.matrixWorld).invert())}lookAt(t,e,n){t.isVector3?xa.copy(t):xa.set(t,e,n);const r=this.parent;this.updateWorldMatrix(!0,!1),Es.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?fi.lookAt(Es,xa,this.up):fi.lookAt(xa,Es,this.up),this.quaternion.setFromRotationMatrix(fi),r&&(fi.extractRotation(r.matrixWorld),Pr.setFromRotationMatrix(fi),this.quaternion.premultiply(Pr.invert()))}add(t){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.add(arguments[e]);return this}return t===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",t),this):(t&&t.isObject3D?(t.removeFromParent(),t.parent=this,this.children.push(t),t.dispatchEvent(Fh),Dr.child=t,this.dispatchEvent(Dr),Dr.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",t),this)}remove(t){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}const e=this.children.indexOf(t);return e!==-1&&(t.parent=null,this.children.splice(e,1),t.dispatchEvent(kp),Uo.child=t,this.dispatchEvent(Uo),Uo.child=null),this}removeFromParent(){const t=this.parent;return t!==null&&t.remove(this),this}clear(){return this.remove(...this.children)}attach(t){return this.updateWorldMatrix(!0,!1),fi.copy(this.matrixWorld).invert(),t.parent!==null&&(t.parent.updateWorldMatrix(!0,!1),fi.multiply(t.parent.matrixWorld)),t.applyMatrix4(fi),t.removeFromParent(),t.parent=this,this.children.push(t),t.updateWorldMatrix(!1,!0),t.dispatchEvent(Fh),Dr.child=t,this.dispatchEvent(Dr),Dr.child=null,this}getObjectById(t){return this.getObjectByProperty("id",t)}getObjectByName(t){return this.getObjectByProperty("name",t)}getObjectByProperty(t,e){if(this[t]===e)return this;for(let n=0,r=this.children.length;n<r;n++){const a=this.children[n].getObjectByProperty(t,e);if(a!==void 0)return a}}getObjectsByProperty(t,e,n=[]){this[t]===e&&n.push(this);const r=this.children;for(let s=0,a=r.length;s<a;s++)r[s].getObjectsByProperty(t,e,n);return n}getWorldPosition(t){return this.updateWorldMatrix(!0,!1),t.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Es,t,Op),t}getWorldScale(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Es,Bp,t),t}getWorldDirection(t){this.updateWorldMatrix(!0,!1);const e=this.matrixWorld.elements;return t.set(e[8],e[9],e[10]).normalize()}raycast(){}traverse(t){t(this);const e=this.children;for(let n=0,r=e.length;n<r;n++)e[n].traverse(t)}traverseVisible(t){if(this.visible===!1)return;t(this);const e=this.children;for(let n=0,r=e.length;n<r;n++)e[n].traverseVisible(t)}traverseAncestors(t){const e=this.parent;e!==null&&(t(e),e.traverseAncestors(t))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(t){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||t)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,t=!0);const e=this.children;for(let n=0,r=e.length;n<r;n++)e[n].updateMatrixWorld(t)}updateWorldMatrix(t,e){const n=this.parent;if(t===!0&&n!==null&&n.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),e===!0){const r=this.children;for(let s=0,a=r.length;s<a;s++)r[s].updateWorldMatrix(!1,!0)}}toJSON(t){const e=t===void 0||typeof t=="string",n={};e&&(t={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});const r={};r.uuid=this.uuid,r.type=this.type,this.name!==""&&(r.name=this.name),this.castShadow===!0&&(r.castShadow=!0),this.receiveShadow===!0&&(r.receiveShadow=!0),this.visible===!1&&(r.visible=!1),this.frustumCulled===!1&&(r.frustumCulled=!1),this.renderOrder!==0&&(r.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(r.userData=this.userData),r.layers=this.layers.mask,r.matrix=this.matrix.toArray(),r.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(r.matrixAutoUpdate=!1),this.isInstancedMesh&&(r.type="InstancedMesh",r.count=this.count,r.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(r.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(r.type="BatchedMesh",r.perObjectFrustumCulled=this.perObjectFrustumCulled,r.sortObjects=this.sortObjects,r.drawRanges=this._drawRanges,r.reservedRanges=this._reservedRanges,r.geometryInfo=this._geometryInfo.map(o=>({...o,boundingBox:o.boundingBox?o.boundingBox.toJSON():void 0,boundingSphere:o.boundingSphere?o.boundingSphere.toJSON():void 0})),r.instanceInfo=this._instanceInfo.map(o=>({...o})),r.availableInstanceIds=this._availableInstanceIds.slice(),r.availableGeometryIds=this._availableGeometryIds.slice(),r.nextIndexStart=this._nextIndexStart,r.nextVertexStart=this._nextVertexStart,r.geometryCount=this._geometryCount,r.maxInstanceCount=this._maxInstanceCount,r.maxVertexCount=this._maxVertexCount,r.maxIndexCount=this._maxIndexCount,r.geometryInitialized=this._geometryInitialized,r.matricesTexture=this._matricesTexture.toJSON(t),r.indirectTexture=this._indirectTexture.toJSON(t),this._colorsTexture!==null&&(r.colorsTexture=this._colorsTexture.toJSON(t)),this.boundingSphere!==null&&(r.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(r.boundingBox=this.boundingBox.toJSON()));function s(o,c){return o[c.uuid]===void 0&&(o[c.uuid]=c.toJSON(t)),c.uuid}if(this.isScene)this.background&&(this.background.isColor?r.background=this.background.toJSON():this.background.isTexture&&(r.background=this.background.toJSON(t).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(r.environment=this.environment.toJSON(t).uuid);else if(this.isMesh||this.isLine||this.isPoints){r.geometry=s(t.geometries,this.geometry);const o=this.geometry.parameters;if(o!==void 0&&o.shapes!==void 0){const c=o.shapes;if(Array.isArray(c))for(let l=0,h=c.length;l<h;l++){const u=c[l];s(t.shapes,u)}else s(t.shapes,c)}}if(this.isSkinnedMesh&&(r.bindMode=this.bindMode,r.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(s(t.skeletons,this.skeleton),r.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const o=[];for(let c=0,l=this.material.length;c<l;c++)o.push(s(t.materials,this.material[c]));r.material=o}else r.material=s(t.materials,this.material);if(this.children.length>0){r.children=[];for(let o=0;o<this.children.length;o++)r.children.push(this.children[o].toJSON(t).object)}if(this.animations.length>0){r.animations=[];for(let o=0;o<this.animations.length;o++){const c=this.animations[o];r.animations.push(s(t.animations,c))}}if(e){const o=a(t.geometries),c=a(t.materials),l=a(t.textures),h=a(t.images),u=a(t.shapes),d=a(t.skeletons),f=a(t.animations),m=a(t.nodes);o.length>0&&(n.geometries=o),c.length>0&&(n.materials=c),l.length>0&&(n.textures=l),h.length>0&&(n.images=h),u.length>0&&(n.shapes=u),d.length>0&&(n.skeletons=d),f.length>0&&(n.animations=f),m.length>0&&(n.nodes=m)}return n.object=r,n;function a(o){const c=[];for(const l in o){const h=o[l];delete h.metadata,c.push(h)}return c}}clone(t){return new this.constructor().copy(this,t)}copy(t,e=!0){if(this.name=t.name,this.up.copy(t.up),this.position.copy(t.position),this.rotation.order=t.rotation.order,this.quaternion.copy(t.quaternion),this.scale.copy(t.scale),this.matrix.copy(t.matrix),this.matrixWorld.copy(t.matrixWorld),this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrixWorldAutoUpdate=t.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=t.matrixWorldNeedsUpdate,this.layers.mask=t.layers.mask,this.visible=t.visible,this.castShadow=t.castShadow,this.receiveShadow=t.receiveShadow,this.frustumCulled=t.frustumCulled,this.renderOrder=t.renderOrder,this.animations=t.animations.slice(),this.userData=JSON.parse(JSON.stringify(t.userData)),e===!0)for(let n=0;n<t.children.length;n++){const r=t.children[n];this.add(r.clone())}return this}}Ce.DEFAULT_UP=new N(0,1,0);Ce.DEFAULT_MATRIX_AUTO_UPDATE=!0;Ce.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const zn=new N,di=new N,No=new N,pi=new N,Ir=new N,Ur=new N,Oh=new N,Fo=new N,Oo=new N,Bo=new N,ko=new le,zo=new le,Ho=new le;class Gn{constructor(t=new N,e=new N,n=new N){this.a=t,this.b=e,this.c=n}static getNormal(t,e,n,r){r.subVectors(n,e),zn.subVectors(t,e),r.cross(zn);const s=r.lengthSq();return s>0?r.multiplyScalar(1/Math.sqrt(s)):r.set(0,0,0)}static getBarycoord(t,e,n,r,s){zn.subVectors(r,e),di.subVectors(n,e),No.subVectors(t,e);const a=zn.dot(zn),o=zn.dot(di),c=zn.dot(No),l=di.dot(di),h=di.dot(No),u=a*l-o*o;if(u===0)return s.set(0,0,0),null;const d=1/u,f=(l*c-o*h)*d,m=(a*h-o*c)*d;return s.set(1-f-m,m,f)}static containsPoint(t,e,n,r){return this.getBarycoord(t,e,n,r,pi)===null?!1:pi.x>=0&&pi.y>=0&&pi.x+pi.y<=1}static getInterpolation(t,e,n,r,s,a,o,c){return this.getBarycoord(t,e,n,r,pi)===null?(c.x=0,c.y=0,"z"in c&&(c.z=0),"w"in c&&(c.w=0),null):(c.setScalar(0),c.addScaledVector(s,pi.x),c.addScaledVector(a,pi.y),c.addScaledVector(o,pi.z),c)}static getInterpolatedAttribute(t,e,n,r,s,a){return ko.setScalar(0),zo.setScalar(0),Ho.setScalar(0),ko.fromBufferAttribute(t,e),zo.fromBufferAttribute(t,n),Ho.fromBufferAttribute(t,r),a.setScalar(0),a.addScaledVector(ko,s.x),a.addScaledVector(zo,s.y),a.addScaledVector(Ho,s.z),a}static isFrontFacing(t,e,n,r){return zn.subVectors(n,e),di.subVectors(t,e),zn.cross(di).dot(r)<0}set(t,e,n){return this.a.copy(t),this.b.copy(e),this.c.copy(n),this}setFromPointsAndIndices(t,e,n,r){return this.a.copy(t[e]),this.b.copy(t[n]),this.c.copy(t[r]),this}setFromAttributeAndIndices(t,e,n,r){return this.a.fromBufferAttribute(t,e),this.b.fromBufferAttribute(t,n),this.c.fromBufferAttribute(t,r),this}clone(){return new this.constructor().copy(this)}copy(t){return this.a.copy(t.a),this.b.copy(t.b),this.c.copy(t.c),this}getArea(){return zn.subVectors(this.c,this.b),di.subVectors(this.a,this.b),zn.cross(di).length()*.5}getMidpoint(t){return t.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(t){return Gn.getNormal(this.a,this.b,this.c,t)}getPlane(t){return t.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,e){return Gn.getBarycoord(t,this.a,this.b,this.c,e)}getInterpolation(t,e,n,r,s){return Gn.getInterpolation(t,this.a,this.b,this.c,e,n,r,s)}containsPoint(t){return Gn.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return Gn.isFrontFacing(this.a,this.b,this.c,t)}intersectsBox(t){return t.intersectsTriangle(this)}closestPointToPoint(t,e){const n=this.a,r=this.b,s=this.c;let a,o;Ir.subVectors(r,n),Ur.subVectors(s,n),Fo.subVectors(t,n);const c=Ir.dot(Fo),l=Ur.dot(Fo);if(c<=0&&l<=0)return e.copy(n);Oo.subVectors(t,r);const h=Ir.dot(Oo),u=Ur.dot(Oo);if(h>=0&&u<=h)return e.copy(r);const d=c*u-h*l;if(d<=0&&c>=0&&h<=0)return a=c/(c-h),e.copy(n).addScaledVector(Ir,a);Bo.subVectors(t,s);const f=Ir.dot(Bo),m=Ur.dot(Bo);if(m>=0&&f<=m)return e.copy(s);const v=f*l-c*m;if(v<=0&&l>=0&&m<=0)return o=l/(l-m),e.copy(n).addScaledVector(Ur,o);const g=h*m-f*u;if(g<=0&&u-h>=0&&f-m>=0)return Oh.subVectors(s,r),o=(u-h)/(u-h+(f-m)),e.copy(r).addScaledVector(Oh,o);const p=1/(g+v+d);return a=v*p,o=d*p,e.copy(n).addScaledVector(Ir,a).addScaledVector(Ur,o)}equals(t){return t.a.equals(this.a)&&t.b.equals(this.b)&&t.c.equals(this.c)}}const Hf={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Pi={h:0,s:0,l:0},_a={h:0,s:0,l:0};function Vo(i,t,e){return e<0&&(e+=1),e>1&&(e-=1),e<1/6?i+(t-i)*6*e:e<1/2?t:e<2/3?i+(t-i)*6*(2/3-e):i}class Ut{constructor(t,e,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(t,e,n)}set(t,e,n){if(e===void 0&&n===void 0){const r=t;r&&r.isColor?this.copy(r):typeof r=="number"?this.setHex(r):typeof r=="string"&&this.setStyle(r)}else this.setRGB(t,e,n);return this}setScalar(t){return this.r=t,this.g=t,this.b=t,this}setHex(t,e=dn){return t=Math.floor(t),this.r=(t>>16&255)/255,this.g=(t>>8&255)/255,this.b=(t&255)/255,ce.colorSpaceToWorking(this,e),this}setRGB(t,e,n,r=ce.workingColorSpace){return this.r=t,this.g=e,this.b=n,ce.colorSpaceToWorking(this,r),this}setHSL(t,e,n,r=ce.workingColorSpace){if(t=Dl(t,1),e=ne(e,0,1),n=ne(n,0,1),e===0)this.r=this.g=this.b=n;else{const s=n<=.5?n*(1+e):n+e-n*e,a=2*n-s;this.r=Vo(a,s,t+1/3),this.g=Vo(a,s,t),this.b=Vo(a,s,t-1/3)}return ce.colorSpaceToWorking(this,r),this}setStyle(t,e=dn){function n(s){s!==void 0&&parseFloat(s)<1&&console.warn("THREE.Color: Alpha component of "+t+" will be ignored.")}let r;if(r=/^(\w+)\(([^\)]*)\)/.exec(t)){let s;const a=r[1],o=r[2];switch(a){case"rgb":case"rgba":if(s=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(s[4]),this.setRGB(Math.min(255,parseInt(s[1],10))/255,Math.min(255,parseInt(s[2],10))/255,Math.min(255,parseInt(s[3],10))/255,e);if(s=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(s[4]),this.setRGB(Math.min(100,parseInt(s[1],10))/100,Math.min(100,parseInt(s[2],10))/100,Math.min(100,parseInt(s[3],10))/100,e);break;case"hsl":case"hsla":if(s=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(s[4]),this.setHSL(parseFloat(s[1])/360,parseFloat(s[2])/100,parseFloat(s[3])/100,e);break;default:console.warn("THREE.Color: Unknown color model "+t)}}else if(r=/^\#([A-Fa-f\d]+)$/.exec(t)){const s=r[1],a=s.length;if(a===3)return this.setRGB(parseInt(s.charAt(0),16)/15,parseInt(s.charAt(1),16)/15,parseInt(s.charAt(2),16)/15,e);if(a===6)return this.setHex(parseInt(s,16),e);console.warn("THREE.Color: Invalid hex color "+t)}else if(t&&t.length>0)return this.setColorName(t,e);return this}setColorName(t,e=dn){const n=Hf[t.toLowerCase()];return n!==void 0?this.setHex(n,e):console.warn("THREE.Color: Unknown color "+t),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(t){return this.r=t.r,this.g=t.g,this.b=t.b,this}copySRGBToLinear(t){return this.r=bi(t.r),this.g=bi(t.g),this.b=bi(t.b),this}copyLinearToSRGB(t){return this.r=ns(t.r),this.g=ns(t.g),this.b=ns(t.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(t=dn){return ce.workingToColorSpace(Ye.copy(this),t),Math.round(ne(Ye.r*255,0,255))*65536+Math.round(ne(Ye.g*255,0,255))*256+Math.round(ne(Ye.b*255,0,255))}getHexString(t=dn){return("000000"+this.getHex(t).toString(16)).slice(-6)}getHSL(t,e=ce.workingColorSpace){ce.workingToColorSpace(Ye.copy(this),e);const n=Ye.r,r=Ye.g,s=Ye.b,a=Math.max(n,r,s),o=Math.min(n,r,s);let c,l;const h=(o+a)/2;if(o===a)c=0,l=0;else{const u=a-o;switch(l=h<=.5?u/(a+o):u/(2-a-o),a){case n:c=(r-s)/u+(r<s?6:0);break;case r:c=(s-n)/u+2;break;case s:c=(n-r)/u+4;break}c/=6}return t.h=c,t.s=l,t.l=h,t}getRGB(t,e=ce.workingColorSpace){return ce.workingToColorSpace(Ye.copy(this),e),t.r=Ye.r,t.g=Ye.g,t.b=Ye.b,t}getStyle(t=dn){ce.workingToColorSpace(Ye.copy(this),t);const e=Ye.r,n=Ye.g,r=Ye.b;return t!==dn?`color(${t} ${e.toFixed(3)} ${n.toFixed(3)} ${r.toFixed(3)})`:`rgb(${Math.round(e*255)},${Math.round(n*255)},${Math.round(r*255)})`}offsetHSL(t,e,n){return this.getHSL(Pi),this.setHSL(Pi.h+t,Pi.s+e,Pi.l+n)}add(t){return this.r+=t.r,this.g+=t.g,this.b+=t.b,this}addColors(t,e){return this.r=t.r+e.r,this.g=t.g+e.g,this.b=t.b+e.b,this}addScalar(t){return this.r+=t,this.g+=t,this.b+=t,this}sub(t){return this.r=Math.max(0,this.r-t.r),this.g=Math.max(0,this.g-t.g),this.b=Math.max(0,this.b-t.b),this}multiply(t){return this.r*=t.r,this.g*=t.g,this.b*=t.b,this}multiplyScalar(t){return this.r*=t,this.g*=t,this.b*=t,this}lerp(t,e){return this.r+=(t.r-this.r)*e,this.g+=(t.g-this.g)*e,this.b+=(t.b-this.b)*e,this}lerpColors(t,e,n){return this.r=t.r+(e.r-t.r)*n,this.g=t.g+(e.g-t.g)*n,this.b=t.b+(e.b-t.b)*n,this}lerpHSL(t,e){this.getHSL(Pi),t.getHSL(_a);const n=Fs(Pi.h,_a.h,e),r=Fs(Pi.s,_a.s,e),s=Fs(Pi.l,_a.l,e);return this.setHSL(n,r,s),this}setFromVector3(t){return this.r=t.x,this.g=t.y,this.b=t.z,this}applyMatrix3(t){const e=this.r,n=this.g,r=this.b,s=t.elements;return this.r=s[0]*e+s[3]*n+s[6]*r,this.g=s[1]*e+s[4]*n+s[7]*r,this.b=s[2]*e+s[5]*n+s[8]*r,this}equals(t){return t.r===this.r&&t.g===this.g&&t.b===this.b}fromArray(t,e=0){return this.r=t[e],this.g=t[e+1],this.b=t[e+2],this}toArray(t=[],e=0){return t[e]=this.r,t[e+1]=this.g,t[e+2]=this.b,t}fromBufferAttribute(t,e){return this.r=t.getX(e),this.g=t.getY(e),this.b=t.getZ(e),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const Ye=new Ut;Ut.NAMES=Hf;let zp=0;class _s extends vs{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:zp++}),this.uuid=Yi(),this.name="",this.type="Material",this.blending=ts,this.side=qi,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=yc,this.blendDst=bc,this.blendEquation=ar,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Ut(0,0,0),this.blendAlpha=0,this.depthFunc=cs,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=bh,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Er,this.stencilZFail=Er,this.stencilZPass=Er,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(t){this._alphaTest>0!=t>0&&this.version++,this._alphaTest=t}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(t){if(t!==void 0)for(const e in t){const n=t[e];if(n===void 0){console.warn(`THREE.Material: parameter '${e}' has value of undefined.`);continue}const r=this[e];if(r===void 0){console.warn(`THREE.Material: '${e}' is not a property of THREE.${this.type}.`);continue}r&&r.isColor?r.set(n):r&&r.isVector3&&n&&n.isVector3?r.copy(n):this[e]=n}}toJSON(t){const e=t===void 0||typeof t=="string";e&&(t={textures:{},images:{}});const n={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(t).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(t).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(t).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(n.sheenColorMap=this.sheenColorMap.toJSON(t).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(n.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(t).uuid),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(t).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(t).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(t).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(t).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(t).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(t).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(t).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(t).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(t).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(t).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(t).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(t).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(t).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(t).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(t).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(t).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(t).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(t).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(t).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(t).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(t).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==ts&&(n.blending=this.blending),this.side!==qi&&(n.side=this.side),this.vertexColors===!0&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=!0),this.blendSrc!==yc&&(n.blendSrc=this.blendSrc),this.blendDst!==bc&&(n.blendDst=this.blendDst),this.blendEquation!==ar&&(n.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(n.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(n.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(n.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(n.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(n.blendAlpha=this.blendAlpha),this.depthFunc!==cs&&(n.depthFunc=this.depthFunc),this.depthTest===!1&&(n.depthTest=this.depthTest),this.depthWrite===!1&&(n.depthWrite=this.depthWrite),this.colorWrite===!1&&(n.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(n.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==bh&&(n.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(n.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(n.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==Er&&(n.stencilFail=this.stencilFail),this.stencilZFail!==Er&&(n.stencilZFail=this.stencilZFail),this.stencilZPass!==Er&&(n.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(n.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=!0),this.alphaToCoverage===!0&&(n.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=!0),this.forceSinglePass===!0&&(n.forceSinglePass=!0),this.wireframe===!0&&(n.wireframe=!0),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=!0),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData);function r(s){const a=[];for(const o in s){const c=s[o];delete c.metadata,a.push(c)}return a}if(e){const s=r(t.textures),a=r(t.images);s.length>0&&(n.textures=s),a.length>0&&(n.images=a)}return n}clone(){return new this.constructor().copy(this)}copy(t){this.name=t.name,this.blending=t.blending,this.side=t.side,this.vertexColors=t.vertexColors,this.opacity=t.opacity,this.transparent=t.transparent,this.blendSrc=t.blendSrc,this.blendDst=t.blendDst,this.blendEquation=t.blendEquation,this.blendSrcAlpha=t.blendSrcAlpha,this.blendDstAlpha=t.blendDstAlpha,this.blendEquationAlpha=t.blendEquationAlpha,this.blendColor.copy(t.blendColor),this.blendAlpha=t.blendAlpha,this.depthFunc=t.depthFunc,this.depthTest=t.depthTest,this.depthWrite=t.depthWrite,this.stencilWriteMask=t.stencilWriteMask,this.stencilFunc=t.stencilFunc,this.stencilRef=t.stencilRef,this.stencilFuncMask=t.stencilFuncMask,this.stencilFail=t.stencilFail,this.stencilZFail=t.stencilZFail,this.stencilZPass=t.stencilZPass,this.stencilWrite=t.stencilWrite;const e=t.clippingPlanes;let n=null;if(e!==null){const r=e.length;n=new Array(r);for(let s=0;s!==r;++s)n[s]=e[s].clone()}return this.clippingPlanes=n,this.clipIntersection=t.clipIntersection,this.clipShadows=t.clipShadows,this.shadowSide=t.shadowSide,this.colorWrite=t.colorWrite,this.precision=t.precision,this.polygonOffset=t.polygonOffset,this.polygonOffsetFactor=t.polygonOffsetFactor,this.polygonOffsetUnits=t.polygonOffsetUnits,this.dithering=t.dithering,this.alphaTest=t.alphaTest,this.alphaHash=t.alphaHash,this.alphaToCoverage=t.alphaToCoverage,this.premultipliedAlpha=t.premultipliedAlpha,this.forceSinglePass=t.forceSinglePass,this.visible=t.visible,this.toneMapped=t.toneMapped,this.userData=JSON.parse(JSON.stringify(t.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(t){t===!0&&this.version++}}class $i extends _s{constructor(t){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new Ut(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new On,this.combine=Tf,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.fog=t.fog,this}}const xi=Hp();function Hp(){const i=new ArrayBuffer(4),t=new Float32Array(i),e=new Uint32Array(i),n=new Uint32Array(512),r=new Uint32Array(512);for(let c=0;c<256;++c){const l=c-127;l<-27?(n[c]=0,n[c|256]=32768,r[c]=24,r[c|256]=24):l<-14?(n[c]=1024>>-l-14,n[c|256]=1024>>-l-14|32768,r[c]=-l-1,r[c|256]=-l-1):l<=15?(n[c]=l+15<<10,n[c|256]=l+15<<10|32768,r[c]=13,r[c|256]=13):l<128?(n[c]=31744,n[c|256]=64512,r[c]=24,r[c|256]=24):(n[c]=31744,n[c|256]=64512,r[c]=13,r[c|256]=13)}const s=new Uint32Array(2048),a=new Uint32Array(64),o=new Uint32Array(64);for(let c=1;c<1024;++c){let l=c<<13,h=0;for(;(l&8388608)===0;)l<<=1,h-=8388608;l&=-8388609,h+=947912704,s[c]=l|h}for(let c=1024;c<2048;++c)s[c]=939524096+(c-1024<<13);for(let c=1;c<31;++c)a[c]=c<<23;a[31]=1199570944,a[32]=2147483648;for(let c=33;c<63;++c)a[c]=2147483648+(c-32<<23);a[63]=3347054592;for(let c=1;c<64;++c)c!==32&&(o[c]=1024);return{floatView:t,uint32View:e,baseTable:n,shiftTable:r,mantissaTable:s,exponentTable:a,offsetTable:o}}function Vp(i){Math.abs(i)>65504&&console.warn("THREE.DataUtils.toHalfFloat(): Value out of range."),i=ne(i,-65504,65504),xi.floatView[0]=i;const t=xi.uint32View[0],e=t>>23&511;return xi.baseTable[e]+((t&8388607)>>xi.shiftTable[e])}function Gp(i){const t=i>>10;return xi.uint32View[0]=xi.mantissaTable[xi.offsetTable[t]+(i&1023)]+xi.exponentTable[t],xi.floatView[0]}class Ma{static toHalfFloat(t){return Vp(t)}static fromHalfFloat(t){return Gp(t)}}const Pe=new N,ya=new dt;let Wp=0;class ae{constructor(t,e,n=!1){if(Array.isArray(t))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:Wp++}),this.name="",this.array=t,this.itemSize=e,this.count=t!==void 0?t.length/e:0,this.normalized=n,this.usage=Sh,this.updateRanges=[],this.gpuType=ri,this.version=0}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.name=t.name,this.array=new t.array.constructor(t.array),this.itemSize=t.itemSize,this.count=t.count,this.normalized=t.normalized,this.usage=t.usage,this.gpuType=t.gpuType,this}copyAt(t,e,n){t*=this.itemSize,n*=e.itemSize;for(let r=0,s=this.itemSize;r<s;r++)this.array[t+r]=e.array[n+r];return this}copyArray(t){return this.array.set(t),this}applyMatrix3(t){if(this.itemSize===2)for(let e=0,n=this.count;e<n;e++)ya.fromBufferAttribute(this,e),ya.applyMatrix3(t),this.setXY(e,ya.x,ya.y);else if(this.itemSize===3)for(let e=0,n=this.count;e<n;e++)Pe.fromBufferAttribute(this,e),Pe.applyMatrix3(t),this.setXYZ(e,Pe.x,Pe.y,Pe.z);return this}applyMatrix4(t){for(let e=0,n=this.count;e<n;e++)Pe.fromBufferAttribute(this,e),Pe.applyMatrix4(t),this.setXYZ(e,Pe.x,Pe.y,Pe.z);return this}applyNormalMatrix(t){for(let e=0,n=this.count;e<n;e++)Pe.fromBufferAttribute(this,e),Pe.applyNormalMatrix(t),this.setXYZ(e,Pe.x,Pe.y,Pe.z);return this}transformDirection(t){for(let e=0,n=this.count;e<n;e++)Pe.fromBufferAttribute(this,e),Pe.transformDirection(t),this.setXYZ(e,Pe.x,Pe.y,Pe.z);return this}set(t,e=0){return this.array.set(t,e),this}getComponent(t,e){let n=this.array[t*this.itemSize+e];return this.normalized&&(n=Xr(n,this.array)),n}setComponent(t,e,n){return this.normalized&&(n=Qe(n,this.array)),this.array[t*this.itemSize+e]=n,this}getX(t){let e=this.array[t*this.itemSize];return this.normalized&&(e=Xr(e,this.array)),e}setX(t,e){return this.normalized&&(e=Qe(e,this.array)),this.array[t*this.itemSize]=e,this}getY(t){let e=this.array[t*this.itemSize+1];return this.normalized&&(e=Xr(e,this.array)),e}setY(t,e){return this.normalized&&(e=Qe(e,this.array)),this.array[t*this.itemSize+1]=e,this}getZ(t){let e=this.array[t*this.itemSize+2];return this.normalized&&(e=Xr(e,this.array)),e}setZ(t,e){return this.normalized&&(e=Qe(e,this.array)),this.array[t*this.itemSize+2]=e,this}getW(t){let e=this.array[t*this.itemSize+3];return this.normalized&&(e=Xr(e,this.array)),e}setW(t,e){return this.normalized&&(e=Qe(e,this.array)),this.array[t*this.itemSize+3]=e,this}setXY(t,e,n){return t*=this.itemSize,this.normalized&&(e=Qe(e,this.array),n=Qe(n,this.array)),this.array[t+0]=e,this.array[t+1]=n,this}setXYZ(t,e,n,r){return t*=this.itemSize,this.normalized&&(e=Qe(e,this.array),n=Qe(n,this.array),r=Qe(r,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=r,this}setXYZW(t,e,n,r,s){return t*=this.itemSize,this.normalized&&(e=Qe(e,this.array),n=Qe(n,this.array),r=Qe(r,this.array),s=Qe(s,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=r,this.array[t+3]=s,this}onUpload(t){return this.onUploadCallback=t,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const t={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(t.name=this.name),this.usage!==Sh&&(t.usage=this.usage),t}}class Vf extends ae{constructor(t,e,n){super(new Uint16Array(t),e,n)}}class Gf extends ae{constructor(t,e,n){super(new Uint32Array(t),e,n)}}class se extends ae{constructor(t,e,n){super(new Float32Array(t),e,n)}}let Xp=0;const Ln=new re,Go=new Ce,Nr=new N,_n=new xs,Ts=new xs,Oe=new N;class Ee extends vs{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:Xp++}),this.uuid=Yi(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(t){return Array.isArray(t)?this.index=new(kf(t)?Gf:Vf)(t,1):this.index=t,this}setIndirect(t){return this.indirect=t,this}getIndirect(){return this.indirect}getAttribute(t){return this.attributes[t]}setAttribute(t,e){return this.attributes[t]=e,this}deleteAttribute(t){return delete this.attributes[t],this}hasAttribute(t){return this.attributes[t]!==void 0}addGroup(t,e,n=0){this.groups.push({start:t,count:e,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(t,e){this.drawRange.start=t,this.drawRange.count=e}applyMatrix4(t){const e=this.attributes.position;e!==void 0&&(e.applyMatrix4(t),e.needsUpdate=!0);const n=this.attributes.normal;if(n!==void 0){const s=new te().getNormalMatrix(t);n.applyNormalMatrix(s),n.needsUpdate=!0}const r=this.attributes.tangent;return r!==void 0&&(r.transformDirection(t),r.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(t){return Ln.makeRotationFromQuaternion(t),this.applyMatrix4(Ln),this}rotateX(t){return Ln.makeRotationX(t),this.applyMatrix4(Ln),this}rotateY(t){return Ln.makeRotationY(t),this.applyMatrix4(Ln),this}rotateZ(t){return Ln.makeRotationZ(t),this.applyMatrix4(Ln),this}translate(t,e,n){return Ln.makeTranslation(t,e,n),this.applyMatrix4(Ln),this}scale(t,e,n){return Ln.makeScale(t,e,n),this.applyMatrix4(Ln),this}lookAt(t){return Go.lookAt(t),Go.updateMatrix(),this.applyMatrix4(Go.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Nr).negate(),this.translate(Nr.x,Nr.y,Nr.z),this}setFromPoints(t){const e=this.getAttribute("position");if(e===void 0){const n=[];for(let r=0,s=t.length;r<s;r++){const a=t[r];n.push(a.x,a.y,a.z||0)}this.setAttribute("position",new se(n,3))}else{const n=Math.min(t.length,e.count);for(let r=0;r<n;r++){const s=t[r];e.setXYZ(r,s.x,s.y,s.z||0)}t.length>e.count&&console.warn("THREE.BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),e.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new xs);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new N(-1/0,-1/0,-1/0),new N(1/0,1/0,1/0));return}if(t!==void 0){if(this.boundingBox.setFromBufferAttribute(t),e)for(let n=0,r=e.length;n<r;n++){const s=e[n];_n.setFromBufferAttribute(s),this.morphTargetsRelative?(Oe.addVectors(this.boundingBox.min,_n.min),this.boundingBox.expandByPoint(Oe),Oe.addVectors(this.boundingBox.max,_n.max),this.boundingBox.expandByPoint(Oe)):(this.boundingBox.expandByPoint(_n.min),this.boundingBox.expandByPoint(_n.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new yr);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new N,1/0);return}if(t){const n=this.boundingSphere.center;if(_n.setFromBufferAttribute(t),e)for(let s=0,a=e.length;s<a;s++){const o=e[s];Ts.setFromBufferAttribute(o),this.morphTargetsRelative?(Oe.addVectors(_n.min,Ts.min),_n.expandByPoint(Oe),Oe.addVectors(_n.max,Ts.max),_n.expandByPoint(Oe)):(_n.expandByPoint(Ts.min),_n.expandByPoint(Ts.max))}_n.getCenter(n);let r=0;for(let s=0,a=t.count;s<a;s++)Oe.fromBufferAttribute(t,s),r=Math.max(r,n.distanceToSquared(Oe));if(e)for(let s=0,a=e.length;s<a;s++){const o=e[s],c=this.morphTargetsRelative;for(let l=0,h=o.count;l<h;l++)Oe.fromBufferAttribute(o,l),c&&(Nr.fromBufferAttribute(t,l),Oe.add(Nr)),r=Math.max(r,n.distanceToSquared(Oe))}this.boundingSphere.radius=Math.sqrt(r),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const t=this.index,e=this.attributes;if(t===null||e.position===void 0||e.normal===void 0||e.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const n=e.position,r=e.normal,s=e.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new ae(new Float32Array(4*n.count),4));const a=this.getAttribute("tangent"),o=[],c=[];for(let R=0;R<n.count;R++)o[R]=new N,c[R]=new N;const l=new N,h=new N,u=new N,d=new dt,f=new dt,m=new dt,v=new N,g=new N;function p(R,x,b){l.fromBufferAttribute(n,R),h.fromBufferAttribute(n,x),u.fromBufferAttribute(n,b),d.fromBufferAttribute(s,R),f.fromBufferAttribute(s,x),m.fromBufferAttribute(s,b),h.sub(l),u.sub(l),f.sub(d),m.sub(d);const S=1/(f.x*m.y-m.x*f.y);isFinite(S)&&(v.copy(h).multiplyScalar(m.y).addScaledVector(u,-f.y).multiplyScalar(S),g.copy(u).multiplyScalar(f.x).addScaledVector(h,-m.x).multiplyScalar(S),o[R].add(v),o[x].add(v),o[b].add(v),c[R].add(g),c[x].add(g),c[b].add(g))}let y=this.groups;y.length===0&&(y=[{start:0,count:t.count}]);for(let R=0,x=y.length;R<x;++R){const b=y[R],S=b.start,T=b.count;for(let L=S,D=S+T;L<D;L+=3)p(t.getX(L+0),t.getX(L+1),t.getX(L+2))}const M=new N,_=new N,w=new N,E=new N;function A(R){w.fromBufferAttribute(r,R),E.copy(w);const x=o[R];M.copy(x),M.sub(w.multiplyScalar(w.dot(x))).normalize(),_.crossVectors(E,x);const S=_.dot(c[R])<0?-1:1;a.setXYZW(R,M.x,M.y,M.z,S)}for(let R=0,x=y.length;R<x;++R){const b=y[R],S=b.start,T=b.count;for(let L=S,D=S+T;L<D;L+=3)A(t.getX(L+0)),A(t.getX(L+1)),A(t.getX(L+2))}}computeVertexNormals(){const t=this.index,e=this.getAttribute("position");if(e!==void 0){let n=this.getAttribute("normal");if(n===void 0)n=new ae(new Float32Array(e.count*3),3),this.setAttribute("normal",n);else for(let d=0,f=n.count;d<f;d++)n.setXYZ(d,0,0,0);const r=new N,s=new N,a=new N,o=new N,c=new N,l=new N,h=new N,u=new N;if(t)for(let d=0,f=t.count;d<f;d+=3){const m=t.getX(d+0),v=t.getX(d+1),g=t.getX(d+2);r.fromBufferAttribute(e,m),s.fromBufferAttribute(e,v),a.fromBufferAttribute(e,g),h.subVectors(a,s),u.subVectors(r,s),h.cross(u),o.fromBufferAttribute(n,m),c.fromBufferAttribute(n,v),l.fromBufferAttribute(n,g),o.add(h),c.add(h),l.add(h),n.setXYZ(m,o.x,o.y,o.z),n.setXYZ(v,c.x,c.y,c.z),n.setXYZ(g,l.x,l.y,l.z)}else for(let d=0,f=e.count;d<f;d+=3)r.fromBufferAttribute(e,d+0),s.fromBufferAttribute(e,d+1),a.fromBufferAttribute(e,d+2),h.subVectors(a,s),u.subVectors(r,s),h.cross(u),n.setXYZ(d+0,h.x,h.y,h.z),n.setXYZ(d+1,h.x,h.y,h.z),n.setXYZ(d+2,h.x,h.y,h.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){const t=this.attributes.normal;for(let e=0,n=t.count;e<n;e++)Oe.fromBufferAttribute(t,e),Oe.normalize(),t.setXYZ(e,Oe.x,Oe.y,Oe.z)}toNonIndexed(){function t(o,c){const l=o.array,h=o.itemSize,u=o.normalized,d=new l.constructor(c.length*h);let f=0,m=0;for(let v=0,g=c.length;v<g;v++){o.isInterleavedBufferAttribute?f=c[v]*o.data.stride+o.offset:f=c[v]*h;for(let p=0;p<h;p++)d[m++]=l[f++]}return new ae(d,h,u)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const e=new Ee,n=this.index.array,r=this.attributes;for(const o in r){const c=r[o],l=t(c,n);e.setAttribute(o,l)}const s=this.morphAttributes;for(const o in s){const c=[],l=s[o];for(let h=0,u=l.length;h<u;h++){const d=l[h],f=t(d,n);c.push(f)}e.morphAttributes[o]=c}e.morphTargetsRelative=this.morphTargetsRelative;const a=this.groups;for(let o=0,c=a.length;o<c;o++){const l=a[o];e.addGroup(l.start,l.count,l.materialIndex)}return e}toJSON(){const t={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(t.uuid=this.uuid,t.type=this.type,this.name!==""&&(t.name=this.name),Object.keys(this.userData).length>0&&(t.userData=this.userData),this.parameters!==void 0){const c=this.parameters;for(const l in c)c[l]!==void 0&&(t[l]=c[l]);return t}t.data={attributes:{}};const e=this.index;e!==null&&(t.data.index={type:e.array.constructor.name,array:Array.prototype.slice.call(e.array)});const n=this.attributes;for(const c in n){const l=n[c];t.data.attributes[c]=l.toJSON(t.data)}const r={};let s=!1;for(const c in this.morphAttributes){const l=this.morphAttributes[c],h=[];for(let u=0,d=l.length;u<d;u++){const f=l[u];h.push(f.toJSON(t.data))}h.length>0&&(r[c]=h,s=!0)}s&&(t.data.morphAttributes=r,t.data.morphTargetsRelative=this.morphTargetsRelative);const a=this.groups;a.length>0&&(t.data.groups=JSON.parse(JSON.stringify(a)));const o=this.boundingSphere;return o!==null&&(t.data.boundingSphere=o.toJSON()),t}clone(){return new this.constructor().copy(this)}copy(t){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const e={};this.name=t.name;const n=t.index;n!==null&&this.setIndex(n.clone());const r=t.attributes;for(const l in r){const h=r[l];this.setAttribute(l,h.clone(e))}const s=t.morphAttributes;for(const l in s){const h=[],u=s[l];for(let d=0,f=u.length;d<f;d++)h.push(u[d].clone(e));this.morphAttributes[l]=h}this.morphTargetsRelative=t.morphTargetsRelative;const a=t.groups;for(let l=0,h=a.length;l<h;l++){const u=a[l];this.addGroup(u.start,u.count,u.materialIndex)}const o=t.boundingBox;o!==null&&(this.boundingBox=o.clone());const c=t.boundingSphere;return c!==null&&(this.boundingSphere=c.clone()),this.drawRange.start=t.drawRange.start,this.drawRange.count=t.drawRange.count,this.userData=t.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const Bh=new re,Qi=new Nl,ba=new yr,kh=new N,Sa=new N,wa=new N,Ea=new N,Wo=new N,Ta=new N,zh=new N,Aa=new N;class Dt extends Ce{constructor(t=new Ee,e=new $i){super(),this.isMesh=!0,this.type="Mesh",this.geometry=t,this.material=e,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),t.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=t.morphTargetInfluences.slice()),t.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},t.morphTargetDictionary)),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}updateMorphTargets(){const e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){const r=e[n[0]];if(r!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,a=r.length;s<a;s++){const o=r[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=s}}}}getVertexPosition(t,e){const n=this.geometry,r=n.attributes.position,s=n.morphAttributes.position,a=n.morphTargetsRelative;e.fromBufferAttribute(r,t);const o=this.morphTargetInfluences;if(s&&o){Ta.set(0,0,0);for(let c=0,l=s.length;c<l;c++){const h=o[c],u=s[c];h!==0&&(Wo.fromBufferAttribute(u,t),a?Ta.addScaledVector(Wo,h):Ta.addScaledVector(Wo.sub(e),h))}e.add(Ta)}return e}raycast(t,e){const n=this.geometry,r=this.material,s=this.matrixWorld;r!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),ba.copy(n.boundingSphere),ba.applyMatrix4(s),Qi.copy(t.ray).recast(t.near),!(ba.containsPoint(Qi.origin)===!1&&(Qi.intersectSphere(ba,kh)===null||Qi.origin.distanceToSquared(kh)>(t.far-t.near)**2))&&(Bh.copy(s).invert(),Qi.copy(t.ray).applyMatrix4(Bh),!(n.boundingBox!==null&&Qi.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(t,e,Qi)))}_computeIntersections(t,e,n){let r;const s=this.geometry,a=this.material,o=s.index,c=s.attributes.position,l=s.attributes.uv,h=s.attributes.uv1,u=s.attributes.normal,d=s.groups,f=s.drawRange;if(o!==null)if(Array.isArray(a))for(let m=0,v=d.length;m<v;m++){const g=d[m],p=a[g.materialIndex],y=Math.max(g.start,f.start),M=Math.min(o.count,Math.min(g.start+g.count,f.start+f.count));for(let _=y,w=M;_<w;_+=3){const E=o.getX(_),A=o.getX(_+1),R=o.getX(_+2);r=Ra(this,p,t,n,l,h,u,E,A,R),r&&(r.faceIndex=Math.floor(_/3),r.face.materialIndex=g.materialIndex,e.push(r))}}else{const m=Math.max(0,f.start),v=Math.min(o.count,f.start+f.count);for(let g=m,p=v;g<p;g+=3){const y=o.getX(g),M=o.getX(g+1),_=o.getX(g+2);r=Ra(this,a,t,n,l,h,u,y,M,_),r&&(r.faceIndex=Math.floor(g/3),e.push(r))}}else if(c!==void 0)if(Array.isArray(a))for(let m=0,v=d.length;m<v;m++){const g=d[m],p=a[g.materialIndex],y=Math.max(g.start,f.start),M=Math.min(c.count,Math.min(g.start+g.count,f.start+f.count));for(let _=y,w=M;_<w;_+=3){const E=_,A=_+1,R=_+2;r=Ra(this,p,t,n,l,h,u,E,A,R),r&&(r.faceIndex=Math.floor(_/3),r.face.materialIndex=g.materialIndex,e.push(r))}}else{const m=Math.max(0,f.start),v=Math.min(c.count,f.start+f.count);for(let g=m,p=v;g<p;g+=3){const y=g,M=g+1,_=g+2;r=Ra(this,a,t,n,l,h,u,y,M,_),r&&(r.faceIndex=Math.floor(g/3),e.push(r))}}}}function qp(i,t,e,n,r,s,a,o){let c;if(t.side===mn?c=n.intersectTriangle(a,s,r,!0,o):c=n.intersectTriangle(r,s,a,t.side===qi,o),c===null)return null;Aa.copy(o),Aa.applyMatrix4(i.matrixWorld);const l=e.ray.origin.distanceTo(Aa);return l<e.near||l>e.far?null:{distance:l,point:Aa.clone(),object:i}}function Ra(i,t,e,n,r,s,a,o,c,l){i.getVertexPosition(o,Sa),i.getVertexPosition(c,wa),i.getVertexPosition(l,Ea);const h=qp(i,t,e,n,Sa,wa,Ea,zh);if(h){const u=new N;Gn.getBarycoord(zh,Sa,wa,Ea,u),r&&(h.uv=Gn.getInterpolatedAttribute(r,o,c,l,u,new dt)),s&&(h.uv1=Gn.getInterpolatedAttribute(s,o,c,l,u,new dt)),a&&(h.normal=Gn.getInterpolatedAttribute(a,o,c,l,u,new N),h.normal.dot(n.direction)>0&&h.normal.multiplyScalar(-1));const d={a:o,b:c,c:l,normal:new N,materialIndex:0};Gn.getNormal(Sa,wa,Ea,d.normal),h.face=d,h.barycoord=u}return h}class Ve extends Ee{constructor(t=1,e=1,n=1,r=1,s=1,a=1){super(),this.type="BoxGeometry",this.parameters={width:t,height:e,depth:n,widthSegments:r,heightSegments:s,depthSegments:a};const o=this;r=Math.floor(r),s=Math.floor(s),a=Math.floor(a);const c=[],l=[],h=[],u=[];let d=0,f=0;m("z","y","x",-1,-1,n,e,t,a,s,0),m("z","y","x",1,-1,n,e,-t,a,s,1),m("x","z","y",1,1,t,n,e,r,a,2),m("x","z","y",1,-1,t,n,-e,r,a,3),m("x","y","z",1,-1,t,e,n,r,s,4),m("x","y","z",-1,-1,t,e,-n,r,s,5),this.setIndex(c),this.setAttribute("position",new se(l,3)),this.setAttribute("normal",new se(h,3)),this.setAttribute("uv",new se(u,2));function m(v,g,p,y,M,_,w,E,A,R,x){const b=_/A,S=w/R,T=_/2,L=w/2,D=E/2,U=A+1,B=R+1;let X=0,H=0;const Q=new N;for(let ct=0;ct<B;ct++){const ut=ct*S-L;for(let vt=0;vt<U;vt++){const Et=vt*b-T;Q[v]=Et*y,Q[g]=ut*M,Q[p]=D,l.push(Q.x,Q.y,Q.z),Q[v]=0,Q[g]=0,Q[p]=E>0?1:-1,h.push(Q.x,Q.y,Q.z),u.push(vt/A),u.push(1-ct/R),X+=1}}for(let ct=0;ct<R;ct++)for(let ut=0;ut<A;ut++){const vt=d+ut+U*ct,Et=d+ut+U*(ct+1),Nt=d+(ut+1)+U*(ct+1),lt=d+(ut+1)+U*ct;c.push(vt,Et,lt),c.push(Et,Nt,lt),H+=6}o.addGroup(f,H,x),f+=H,d+=X}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Ve(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}}function ds(i){const t={};for(const e in i){t[e]={};for(const n in i[e]){const r=i[e][n];r&&(r.isColor||r.isMatrix3||r.isMatrix4||r.isVector2||r.isVector3||r.isVector4||r.isTexture||r.isQuaternion)?r.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),t[e][n]=null):t[e][n]=r.clone():Array.isArray(r)?t[e][n]=r.slice():t[e][n]=r}}return t}function tn(i){const t={};for(let e=0;e<i.length;e++){const n=ds(i[e]);for(const r in n)t[r]=n[r]}return t}function Yp(i){const t=[];for(let e=0;e<i.length;e++)t.push(i[e].clone());return t}function Wf(i){const t=i.getRenderTarget();return t===null?i.outputColorSpace:t.isXRRenderTarget===!0?t.texture.colorSpace:ce.workingColorSpace}const $p={clone:ds,merge:tn};var jp=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,Jp=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class ke extends _s{constructor(t){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=jp,this.fragmentShader=Jp,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,t!==void 0&&this.setValues(t)}copy(t){return super.copy(t),this.fragmentShader=t.fragmentShader,this.vertexShader=t.vertexShader,this.uniforms=ds(t.uniforms),this.uniformsGroups=Yp(t.uniformsGroups),this.defines=Object.assign({},t.defines),this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.fog=t.fog,this.lights=t.lights,this.clipping=t.clipping,this.extensions=Object.assign({},t.extensions),this.glslVersion=t.glslVersion,this}toJSON(t){const e=super.toJSON(t);e.glslVersion=this.glslVersion,e.uniforms={};for(const r in this.uniforms){const a=this.uniforms[r].value;a&&a.isTexture?e.uniforms[r]={type:"t",value:a.toJSON(t).uuid}:a&&a.isColor?e.uniforms[r]={type:"c",value:a.getHex()}:a&&a.isVector2?e.uniforms[r]={type:"v2",value:a.toArray()}:a&&a.isVector3?e.uniforms[r]={type:"v3",value:a.toArray()}:a&&a.isVector4?e.uniforms[r]={type:"v4",value:a.toArray()}:a&&a.isMatrix3?e.uniforms[r]={type:"m3",value:a.toArray()}:a&&a.isMatrix4?e.uniforms[r]={type:"m4",value:a.toArray()}:e.uniforms[r]={value:a}}Object.keys(this.defines).length>0&&(e.defines=this.defines),e.vertexShader=this.vertexShader,e.fragmentShader=this.fragmentShader,e.lights=this.lights,e.clipping=this.clipping;const n={};for(const r in this.extensions)this.extensions[r]===!0&&(n[r]=!0);return Object.keys(n).length>0&&(e.extensions=n),e}}class Xf extends Ce{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new re,this.projectionMatrix=new re,this.projectionMatrixInverse=new re,this.coordinateSystem=si,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(t,e){return super.copy(t,e),this.matrixWorldInverse.copy(t.matrixWorldInverse),this.projectionMatrix.copy(t.projectionMatrix),this.projectionMatrixInverse.copy(t.projectionMatrixInverse),this.coordinateSystem=t.coordinateSystem,this}getWorldDirection(t){return super.getWorldDirection(t).negate()}updateMatrixWorld(t){super.updateMatrixWorld(t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(t,e){super.updateWorldMatrix(t,e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}const Di=new N,Hh=new dt,Vh=new dt;class bn extends Xf{constructor(t=50,e=1,n=.1,r=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=t,this.zoom=1,this.near=n,this.far=r,this.focus=10,this.aspect=e,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.fov=t.fov,this.zoom=t.zoom,this.near=t.near,this.far=t.far,this.focus=t.focus,this.aspect=t.aspect,this.view=t.view===null?null:Object.assign({},t.view),this.filmGauge=t.filmGauge,this.filmOffset=t.filmOffset,this}setFocalLength(t){const e=.5*this.getFilmHeight()/t;this.fov=fs*2*Math.atan(e),this.updateProjectionMatrix()}getFocalLength(){const t=Math.tan(Ns*.5*this.fov);return .5*this.getFilmHeight()/t}getEffectiveFOV(){return fs*2*Math.atan(Math.tan(Ns*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(t,e,n){Di.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),e.set(Di.x,Di.y).multiplyScalar(-t/Di.z),Di.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(Di.x,Di.y).multiplyScalar(-t/Di.z)}getViewSize(t,e){return this.getViewBounds(t,Hh,Vh),e.subVectors(Vh,Hh)}setViewOffset(t,e,n,r,s,a){this.aspect=t/e,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=r,this.view.width=s,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=this.near;let e=t*Math.tan(Ns*.5*this.fov)/this.zoom,n=2*e,r=this.aspect*n,s=-.5*r;const a=this.view;if(this.view!==null&&this.view.enabled){const c=a.fullWidth,l=a.fullHeight;s+=a.offsetX*r/c,e-=a.offsetY*n/l,r*=a.width/c,n*=a.height/l}const o=this.filmOffset;o!==0&&(s+=t*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(s,s+r,e,e-n,t,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.fov=this.fov,e.object.zoom=this.zoom,e.object.near=this.near,e.object.far=this.far,e.object.focus=this.focus,e.object.aspect=this.aspect,this.view!==null&&(e.object.view=Object.assign({},this.view)),e.object.filmGauge=this.filmGauge,e.object.filmOffset=this.filmOffset,e}}const Fr=-90,Or=1;class Zp extends Ce{constructor(t,e,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;const r=new bn(Fr,Or,t,e);r.layers=this.layers,this.add(r);const s=new bn(Fr,Or,t,e);s.layers=this.layers,this.add(s);const a=new bn(Fr,Or,t,e);a.layers=this.layers,this.add(a);const o=new bn(Fr,Or,t,e);o.layers=this.layers,this.add(o);const c=new bn(Fr,Or,t,e);c.layers=this.layers,this.add(c);const l=new bn(Fr,Or,t,e);l.layers=this.layers,this.add(l)}updateCoordinateSystem(){const t=this.coordinateSystem,e=this.children.concat(),[n,r,s,a,o,c]=e;for(const l of e)this.remove(l);if(t===si)n.up.set(0,1,0),n.lookAt(1,0,0),r.up.set(0,1,0),r.lookAt(-1,0,0),s.up.set(0,0,-1),s.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),c.up.set(0,1,0),c.lookAt(0,0,-1);else if(t===ro)n.up.set(0,-1,0),n.lookAt(-1,0,0),r.up.set(0,-1,0),r.lookAt(1,0,0),s.up.set(0,0,1),s.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),c.up.set(0,-1,0),c.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+t);for(const l of e)this.add(l),l.updateMatrixWorld()}update(t,e){this.parent===null&&this.updateMatrixWorld();const{renderTarget:n,activeMipmapLevel:r}=this;this.coordinateSystem!==t.coordinateSystem&&(this.coordinateSystem=t.coordinateSystem,this.updateCoordinateSystem());const[s,a,o,c,l,h]=this.children,u=t.getRenderTarget(),d=t.getActiveCubeFace(),f=t.getActiveMipmapLevel(),m=t.xr.enabled;t.xr.enabled=!1;const v=n.texture.generateMipmaps;n.texture.generateMipmaps=!1,t.setRenderTarget(n,0,r),t.render(e,s),t.setRenderTarget(n,1,r),t.render(e,a),t.setRenderTarget(n,2,r),t.render(e,o),t.setRenderTarget(n,3,r),t.render(e,c),t.setRenderTarget(n,4,r),t.render(e,l),n.texture.generateMipmaps=v,t.setRenderTarget(n,5,r),t.render(e,h),t.setRenderTarget(u,d,f),t.xr.enabled=m,n.texture.needsPMREMUpdate=!0}}class qf extends Xe{constructor(t=[],e=ls,n,r,s,a,o,c,l,h){super(t,e,n,r,s,a,o,c,l,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(t){this.image=t}}class Kp extends rn{constructor(t=1,e={}){super(t,t,e),this.isWebGLCubeRenderTarget=!0;const n={width:t,height:t,depth:1},r=[n,n,n,n,n,n];this.texture=new qf(r),this._setTextureOptions(e),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(t,e){this.texture.type=e.type,this.texture.colorSpace=e.colorSpace,this.texture.generateMipmaps=e.generateMipmaps,this.texture.minFilter=e.minFilter,this.texture.magFilter=e.magFilter;const n={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},r=new Ve(5,5,5),s=new ke({name:"CubemapFromEquirect",uniforms:ds(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:mn,blending:Vi});s.uniforms.tEquirect.value=e;const a=new Dt(r,s),o=e.minFilter;return e.minFilter===ki&&(e.minFilter=xe),new Zp(1,10,this).update(t,a),e.minFilter=o,a.geometry.dispose(),a.material.dispose(),this}clear(t,e=!0,n=!0,r=!0){const s=t.getRenderTarget();for(let a=0;a<6;a++)t.setRenderTarget(this,a),t.clear(e,n,r);t.setRenderTarget(s)}}class ze extends Ce{constructor(){super(),this.isGroup=!0,this.type="Group"}}const Qp={type:"move"};class Xo{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new ze,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new ze,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new N,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new N),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new ze,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new N,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new N),this._grip}dispatchEvent(t){return this._targetRay!==null&&this._targetRay.dispatchEvent(t),this._grip!==null&&this._grip.dispatchEvent(t),this._hand!==null&&this._hand.dispatchEvent(t),this}connect(t){if(t&&t.hand){const e=this._hand;if(e)for(const n of t.hand.values())this._getHandJoint(e,n)}return this.dispatchEvent({type:"connected",data:t}),this}disconnect(t){return this.dispatchEvent({type:"disconnected",data:t}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(t,e,n){let r=null,s=null,a=null;const o=this._targetRay,c=this._grip,l=this._hand;if(t&&e.session.visibilityState!=="visible-blurred"){if(l&&t.hand){a=!0;for(const v of t.hand.values()){const g=e.getJointPose(v,n),p=this._getHandJoint(l,v);g!==null&&(p.matrix.fromArray(g.transform.matrix),p.matrix.decompose(p.position,p.rotation,p.scale),p.matrixWorldNeedsUpdate=!0,p.jointRadius=g.radius),p.visible=g!==null}const h=l.joints["index-finger-tip"],u=l.joints["thumb-tip"],d=h.position.distanceTo(u.position),f=.02,m=.005;l.inputState.pinching&&d>f+m?(l.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:t.handedness,target:this})):!l.inputState.pinching&&d<=f-m&&(l.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:t.handedness,target:this}))}else c!==null&&t.gripSpace&&(s=e.getPose(t.gripSpace,n),s!==null&&(c.matrix.fromArray(s.transform.matrix),c.matrix.decompose(c.position,c.rotation,c.scale),c.matrixWorldNeedsUpdate=!0,s.linearVelocity?(c.hasLinearVelocity=!0,c.linearVelocity.copy(s.linearVelocity)):c.hasLinearVelocity=!1,s.angularVelocity?(c.hasAngularVelocity=!0,c.angularVelocity.copy(s.angularVelocity)):c.hasAngularVelocity=!1));o!==null&&(r=e.getPose(t.targetRaySpace,n),r===null&&s!==null&&(r=s),r!==null&&(o.matrix.fromArray(r.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,r.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(r.linearVelocity)):o.hasLinearVelocity=!1,r.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(r.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(Qp)))}return o!==null&&(o.visible=r!==null),c!==null&&(c.visible=s!==null),l!==null&&(l.visible=a!==null),this}_getHandJoint(t,e){if(t.joints[e.jointName]===void 0){const n=new ze;n.matrixAutoUpdate=!1,n.visible=!1,t.joints[e.jointName]=n,t.add(n)}return t.joints[e.jointName]}}class Yf extends Ce{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new On,this.environmentIntensity=1,this.environmentRotation=new On,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(t,e){return super.copy(t,e),t.background!==null&&(this.background=t.background.clone()),t.environment!==null&&(this.environment=t.environment.clone()),t.fog!==null&&(this.fog=t.fog.clone()),this.backgroundBlurriness=t.backgroundBlurriness,this.backgroundIntensity=t.backgroundIntensity,this.backgroundRotation.copy(t.backgroundRotation),this.environmentIntensity=t.environmentIntensity,this.environmentRotation.copy(t.environmentRotation),t.overrideMaterial!==null&&(this.overrideMaterial=t.overrideMaterial.clone()),this.matrixAutoUpdate=t.matrixAutoUpdate,this}toJSON(t){const e=super.toJSON(t);return this.fog!==null&&(e.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(e.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(e.object.backgroundIntensity=this.backgroundIntensity),e.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(e.object.environmentIntensity=this.environmentIntensity),e.object.environmentRotation=this.environmentRotation.toArray(),e}}const Gh=new N,Wh=new le,Xh=new le,t1=new N,qh=new re,Ca=new N,qo=new yr,Yh=new re,Yo=new Nl;class $f extends Dt{constructor(t,e){super(t,e),this.isSkinnedMesh=!0,this.type="SkinnedMesh",this.bindMode=yh,this.bindMatrix=new re,this.bindMatrixInverse=new re,this.boundingBox=null,this.boundingSphere=null}computeBoundingBox(){const t=this.geometry;this.boundingBox===null&&(this.boundingBox=new xs),this.boundingBox.makeEmpty();const e=t.getAttribute("position");for(let n=0;n<e.count;n++)this.getVertexPosition(n,Ca),this.boundingBox.expandByPoint(Ca)}computeBoundingSphere(){const t=this.geometry;this.boundingSphere===null&&(this.boundingSphere=new yr),this.boundingSphere.makeEmpty();const e=t.getAttribute("position");for(let n=0;n<e.count;n++)this.getVertexPosition(n,Ca),this.boundingSphere.expandByPoint(Ca)}copy(t,e){return super.copy(t,e),this.bindMode=t.bindMode,this.bindMatrix.copy(t.bindMatrix),this.bindMatrixInverse.copy(t.bindMatrixInverse),this.skeleton=t.skeleton,t.boundingBox!==null&&(this.boundingBox=t.boundingBox.clone()),t.boundingSphere!==null&&(this.boundingSphere=t.boundingSphere.clone()),this}raycast(t,e){const n=this.material,r=this.matrixWorld;n!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),qo.copy(this.boundingSphere),qo.applyMatrix4(r),t.ray.intersectsSphere(qo)!==!1&&(Yh.copy(r).invert(),Yo.copy(t.ray).applyMatrix4(Yh),!(this.boundingBox!==null&&Yo.intersectsBox(this.boundingBox)===!1)&&this._computeIntersections(t,e,Yo)))}getVertexPosition(t,e){return super.getVertexPosition(t,e),this.applyBoneTransform(t,e),e}bind(t,e){this.skeleton=t,e===void 0&&(this.updateMatrixWorld(!0),this.skeleton.calculateInverses(),e=this.matrixWorld),this.bindMatrix.copy(e),this.bindMatrixInverse.copy(e).invert()}pose(){this.skeleton.pose()}normalizeSkinWeights(){const t=new le,e=this.geometry.attributes.skinWeight;for(let n=0,r=e.count;n<r;n++){t.fromBufferAttribute(e,n);const s=1/t.manhattanLength();s!==1/0?t.multiplyScalar(s):t.set(1,0,0,0),e.setXYZW(n,t.x,t.y,t.z,t.w)}}updateMatrixWorld(t){super.updateMatrixWorld(t),this.bindMode===yh?this.bindMatrixInverse.copy(this.matrixWorld).invert():this.bindMode===J0?this.bindMatrixInverse.copy(this.bindMatrix).invert():console.warn("THREE.SkinnedMesh: Unrecognized bindMode: "+this.bindMode)}applyBoneTransform(t,e){const n=this.skeleton,r=this.geometry;Wh.fromBufferAttribute(r.attributes.skinIndex,t),Xh.fromBufferAttribute(r.attributes.skinWeight,t),Gh.copy(e).applyMatrix4(this.bindMatrix),e.set(0,0,0);for(let s=0;s<4;s++){const a=Xh.getComponent(s);if(a!==0){const o=Wh.getComponent(s);qh.multiplyMatrices(n.bones[o].matrixWorld,n.boneInverses[o]),e.addScaledVector(t1.copy(Gh).applyMatrix4(qh),a)}}return e.applyMatrix4(this.bindMatrixInverse)}}class jf extends Ce{constructor(){super(),this.isBone=!0,this.type="Bone"}}class is extends Xe{constructor(t=null,e=1,n=1,r,s,a,o,c,l=An,h=An,u,d){super(null,a,o,c,l,h,r,s,u,d),this.isDataTexture=!0,this.image={data:t,width:e,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}const $h=new re,e1=new re;class Fl{constructor(t=[],e=[]){this.uuid=Yi(),this.bones=t.slice(0),this.boneInverses=e,this.boneMatrices=null,this.boneTexture=null,this.init()}init(){const t=this.bones,e=this.boneInverses;if(this.boneMatrices=new Float32Array(t.length*16),e.length===0)this.calculateInverses();else if(t.length!==e.length){console.warn("THREE.Skeleton: Number of inverse bone matrices does not match amount of bones."),this.boneInverses=[];for(let n=0,r=this.bones.length;n<r;n++)this.boneInverses.push(new re)}}calculateInverses(){this.boneInverses.length=0;for(let t=0,e=this.bones.length;t<e;t++){const n=new re;this.bones[t]&&n.copy(this.bones[t].matrixWorld).invert(),this.boneInverses.push(n)}}pose(){for(let t=0,e=this.bones.length;t<e;t++){const n=this.bones[t];n&&n.matrixWorld.copy(this.boneInverses[t]).invert()}for(let t=0,e=this.bones.length;t<e;t++){const n=this.bones[t];n&&(n.parent&&n.parent.isBone?(n.matrix.copy(n.parent.matrixWorld).invert(),n.matrix.multiply(n.matrixWorld)):n.matrix.copy(n.matrixWorld),n.matrix.decompose(n.position,n.quaternion,n.scale))}}update(){const t=this.bones,e=this.boneInverses,n=this.boneMatrices,r=this.boneTexture;for(let s=0,a=t.length;s<a;s++){const o=t[s]?t[s].matrixWorld:e1;$h.multiplyMatrices(o,e[s]),$h.toArray(n,s*16)}r!==null&&(r.needsUpdate=!0)}clone(){return new Fl(this.bones,this.boneInverses)}computeBoneTexture(){let t=Math.sqrt(this.bones.length*4);t=Math.ceil(t/4)*4,t=Math.max(t,4);const e=new Float32Array(t*t*4);e.set(this.boneMatrices);const n=new is(e,t,t,We,ri);return n.needsUpdate=!0,this.boneMatrices=e,this.boneTexture=n,this}getBoneByName(t){for(let e=0,n=this.bones.length;e<n;e++){const r=this.bones[e];if(r.name===t)return r}}dispose(){this.boneTexture!==null&&(this.boneTexture.dispose(),this.boneTexture=null)}fromJSON(t,e){this.uuid=t.uuid;for(let n=0,r=t.bones.length;n<r;n++){const s=t.bones[n];let a=e[s];a===void 0&&(console.warn("THREE.Skeleton: No bone found with UUID:",s),a=new jf),this.bones.push(a),this.boneInverses.push(new re().fromArray(t.boneInverses[n]))}return this.init(),this}toJSON(){const t={metadata:{version:4.7,type:"Skeleton",generator:"Skeleton.toJSON"},bones:[],boneInverses:[]};t.uuid=this.uuid;const e=this.bones,n=this.boneInverses;for(let r=0,s=e.length;r<s;r++){const a=e[r];t.bones.push(a.uuid);const o=n[r];t.boneInverses.push(o.toArray())}return t}}const $o=new N,n1=new N,i1=new te;class rr{constructor(t=new N(1,0,0),e=0){this.isPlane=!0,this.normal=t,this.constant=e}set(t,e){return this.normal.copy(t),this.constant=e,this}setComponents(t,e,n,r){return this.normal.set(t,e,n),this.constant=r,this}setFromNormalAndCoplanarPoint(t,e){return this.normal.copy(t),this.constant=-e.dot(this.normal),this}setFromCoplanarPoints(t,e,n){const r=$o.subVectors(n,e).cross(n1.subVectors(t,e)).normalize();return this.setFromNormalAndCoplanarPoint(r,t),this}copy(t){return this.normal.copy(t.normal),this.constant=t.constant,this}normalize(){const t=1/this.normal.length();return this.normal.multiplyScalar(t),this.constant*=t,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(t){return this.normal.dot(t)+this.constant}distanceToSphere(t){return this.distanceToPoint(t.center)-t.radius}projectPoint(t,e){return e.copy(t).addScaledVector(this.normal,-this.distanceToPoint(t))}intersectLine(t,e){const n=t.delta($o),r=this.normal.dot(n);if(r===0)return this.distanceToPoint(t.start)===0?e.copy(t.start):null;const s=-(t.start.dot(this.normal)+this.constant)/r;return s<0||s>1?null:e.copy(t.start).addScaledVector(n,s)}intersectsLine(t){const e=this.distanceToPoint(t.start),n=this.distanceToPoint(t.end);return e<0&&n>0||n<0&&e>0}intersectsBox(t){return t.intersectsPlane(this)}intersectsSphere(t){return t.intersectsPlane(this)}coplanarPoint(t){return t.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(t,e){const n=e||i1.getNormalMatrix(t),r=this.coplanarPoint($o).applyMatrix4(t),s=this.normal.applyMatrix3(n).normalize();return this.constant=-r.dot(s),this}translate(t){return this.constant-=t.dot(this.normal),this}equals(t){return t.normal.equals(this.normal)&&t.constant===this.constant}clone(){return new this.constructor().copy(this)}}const tr=new yr,r1=new dt(.5,.5),La=new N;class Ol{constructor(t=new rr,e=new rr,n=new rr,r=new rr,s=new rr,a=new rr){this.planes=[t,e,n,r,s,a]}set(t,e,n,r,s,a){const o=this.planes;return o[0].copy(t),o[1].copy(e),o[2].copy(n),o[3].copy(r),o[4].copy(s),o[5].copy(a),this}copy(t){const e=this.planes;for(let n=0;n<6;n++)e[n].copy(t.planes[n]);return this}setFromProjectionMatrix(t,e=si,n=!1){const r=this.planes,s=t.elements,a=s[0],o=s[1],c=s[2],l=s[3],h=s[4],u=s[5],d=s[6],f=s[7],m=s[8],v=s[9],g=s[10],p=s[11],y=s[12],M=s[13],_=s[14],w=s[15];if(r[0].setComponents(l-a,f-h,p-m,w-y).normalize(),r[1].setComponents(l+a,f+h,p+m,w+y).normalize(),r[2].setComponents(l+o,f+u,p+v,w+M).normalize(),r[3].setComponents(l-o,f-u,p-v,w-M).normalize(),n)r[4].setComponents(c,d,g,_).normalize(),r[5].setComponents(l-c,f-d,p-g,w-_).normalize();else if(r[4].setComponents(l-c,f-d,p-g,w-_).normalize(),e===si)r[5].setComponents(l+c,f+d,p+g,w+_).normalize();else if(e===ro)r[5].setComponents(c,d,g,_).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+e);return this}intersectsObject(t){if(t.boundingSphere!==void 0)t.boundingSphere===null&&t.computeBoundingSphere(),tr.copy(t.boundingSphere).applyMatrix4(t.matrixWorld);else{const e=t.geometry;e.boundingSphere===null&&e.computeBoundingSphere(),tr.copy(e.boundingSphere).applyMatrix4(t.matrixWorld)}return this.intersectsSphere(tr)}intersectsSprite(t){tr.center.set(0,0,0);const e=r1.distanceTo(t.center);return tr.radius=.7071067811865476+e,tr.applyMatrix4(t.matrixWorld),this.intersectsSphere(tr)}intersectsSphere(t){const e=this.planes,n=t.center,r=-t.radius;for(let s=0;s<6;s++)if(e[s].distanceToPoint(n)<r)return!1;return!0}intersectsBox(t){const e=this.planes;for(let n=0;n<6;n++){const r=e[n];if(La.x=r.normal.x>0?t.max.x:t.min.x,La.y=r.normal.y>0?t.max.y:t.min.y,La.z=r.normal.z>0?t.max.z:t.min.z,r.distanceToPoint(La)<0)return!1}return!0}containsPoint(t){const e=this.planes;for(let n=0;n<6;n++)if(e[n].distanceToPoint(t)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}class s1 extends _s{constructor(t){super(),this.isPointsMaterial=!0,this.type="PointsMaterial",this.color=new Ut(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.alphaMap=t.alphaMap,this.size=t.size,this.sizeAttenuation=t.sizeAttenuation,this.fog=t.fog,this}}const jh=new re,al=new Nl,Pa=new yr,Da=new N;class a1 extends Ce{constructor(t=new Ee,e=new s1){super(),this.isPoints=!0,this.type="Points",this.geometry=t,this.material=e,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}raycast(t,e){const n=this.geometry,r=this.matrixWorld,s=t.params.Points.threshold,a=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),Pa.copy(n.boundingSphere),Pa.applyMatrix4(r),Pa.radius+=s,t.ray.intersectsSphere(Pa)===!1)return;jh.copy(r).invert(),al.copy(t.ray).applyMatrix4(jh);const o=s/((this.scale.x+this.scale.y+this.scale.z)/3),c=o*o,l=n.index,u=n.attributes.position;if(l!==null){const d=Math.max(0,a.start),f=Math.min(l.count,a.start+a.count);for(let m=d,v=f;m<v;m++){const g=l.getX(m);Da.fromBufferAttribute(u,g),Jh(Da,g,c,r,t,e,this)}}else{const d=Math.max(0,a.start),f=Math.min(u.count,a.start+a.count);for(let m=d,v=f;m<v;m++)Da.fromBufferAttribute(u,m),Jh(Da,m,c,r,t,e,this)}}updateMorphTargets(){const e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){const r=e[n[0]];if(r!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,a=r.length;s<a;s++){const o=r[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=s}}}}}function Jh(i,t,e,n,r,s,a){const o=al.distanceSqToPoint(i);if(o<e){const c=new N;al.closestPointToPoint(i,c),c.applyMatrix4(n);const l=r.ray.origin.distanceTo(c);if(l<r.near||l>r.far)return;s.push({distance:l,distanceToRay:Math.sqrt(o),point:c,index:t,face:null,faceIndex:null,barycoord:null,object:a})}}class o1 extends Xe{constructor(t,e,n,r,s=xe,a=xe,o,c,l){super(t,e,n,r,s,a,o,c,l),this.isVideoTexture=!0,this.generateMipmaps=!1,this._requestVideoFrameCallbackId=0;const h=this;function u(){h.needsUpdate=!0,h._requestVideoFrameCallbackId=t.requestVideoFrameCallback(u)}"requestVideoFrameCallback"in t&&(this._requestVideoFrameCallbackId=t.requestVideoFrameCallback(u))}clone(){return new this.constructor(this.image).copy(this)}update(){const t=this.image;"requestVideoFrameCallback"in t===!1&&t.readyState>=t.HAVE_CURRENT_DATA&&(this.needsUpdate=!0)}dispose(){this._requestVideoFrameCallbackId!==0&&this.source.data.cancelVideoFrameCallback(this._requestVideoFrameCallbackId),super.dispose()}}class Zh extends Xe{constructor(t,e,n,r,s,a,o,c,l){super(t,e,n,r,s,a,o,c,l),this.isCanvasTexture=!0,this.needsUpdate=!0}}class Jf extends Xe{constructor(t,e,n=mr,r,s,a,o=An,c=An,l,h=Vs,u=1){if(h!==Vs&&h!==Gs)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");const d={width:t,height:e,depth:u};super(d,r,s,a,o,c,h,n,l),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(t){return super.copy(t),this.source=new Il(Object.assign({},t.image)),this.compareFunction=t.compareFunction,this}toJSON(t){const e=super.toJSON(t);return this.compareFunction!==null&&(e.compareFunction=this.compareFunction),e}}class Zf extends Xe{constructor(t=null){super(),this.sourceTexture=t,this.isExternalTexture=!0}copy(t){return super.copy(t),this.sourceTexture=t.sourceTexture,this}}class Bl extends Ee{constructor(t=1,e=1,n=4,r=8,s=1){super(),this.type="CapsuleGeometry",this.parameters={radius:t,height:e,capSegments:n,radialSegments:r,heightSegments:s},e=Math.max(0,e),n=Math.max(1,Math.floor(n)),r=Math.max(3,Math.floor(r)),s=Math.max(1,Math.floor(s));const a=[],o=[],c=[],l=[],h=e/2,u=Math.PI/2*t,d=e,f=2*u+d,m=n*2+s,v=r+1,g=new N,p=new N;for(let y=0;y<=m;y++){let M=0,_=0,w=0,E=0;if(y<=n){const x=y/n,b=x*Math.PI/2;_=-h-t*Math.cos(b),w=t*Math.sin(b),E=-t*Math.cos(b),M=x*u}else if(y<=n+s){const x=(y-n)/s;_=-h+x*e,w=t,E=0,M=u+x*d}else{const x=(y-n-s)/n,b=x*Math.PI/2;_=h+t*Math.sin(b),w=t*Math.cos(b),E=t*Math.sin(b),M=u+d+x*u}const A=Math.max(0,Math.min(1,M/f));let R=0;y===0?R=.5/r:y===m&&(R=-.5/r);for(let x=0;x<=r;x++){const b=x/r,S=b*Math.PI*2,T=Math.sin(S),L=Math.cos(S);p.x=-w*L,p.y=_,p.z=w*T,o.push(p.x,p.y,p.z),g.set(-w*L,E,w*T),g.normalize(),c.push(g.x,g.y,g.z),l.push(b+R,A)}if(y>0){const x=(y-1)*v;for(let b=0;b<r;b++){const S=x+b,T=x+b+1,L=y*v+b,D=y*v+b+1;a.push(S,T,L),a.push(T,D,L)}}}this.setIndex(a),this.setAttribute("position",new se(o,3)),this.setAttribute("normal",new se(c,3)),this.setAttribute("uv",new se(l,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Bl(t.radius,t.height,t.capSegments,t.radialSegments,t.heightSegments)}}class Ms extends Ee{constructor(t=1,e=32,n=0,r=Math.PI*2){super(),this.type="CircleGeometry",this.parameters={radius:t,segments:e,thetaStart:n,thetaLength:r},e=Math.max(3,e);const s=[],a=[],o=[],c=[],l=new N,h=new dt;a.push(0,0,0),o.push(0,0,1),c.push(.5,.5);for(let u=0,d=3;u<=e;u++,d+=3){const f=n+u/e*r;l.x=t*Math.cos(f),l.y=t*Math.sin(f),a.push(l.x,l.y,l.z),o.push(0,0,1),h.x=(a[d]/t+1)/2,h.y=(a[d+1]/t+1)/2,c.push(h.x,h.y)}for(let u=1;u<=e;u++)s.push(u,u+1,0);this.setIndex(s),this.setAttribute("position",new se(a,3)),this.setAttribute("normal",new se(o,3)),this.setAttribute("uv",new se(c,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Ms(t.radius,t.segments,t.thetaStart,t.thetaLength)}}class oi extends Ee{constructor(t=1,e=1,n=1,r=32,s=1,a=!1,o=0,c=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:t,radiusBottom:e,height:n,radialSegments:r,heightSegments:s,openEnded:a,thetaStart:o,thetaLength:c};const l=this;r=Math.floor(r),s=Math.floor(s);const h=[],u=[],d=[],f=[];let m=0;const v=[],g=n/2;let p=0;y(),a===!1&&(t>0&&M(!0),e>0&&M(!1)),this.setIndex(h),this.setAttribute("position",new se(u,3)),this.setAttribute("normal",new se(d,3)),this.setAttribute("uv",new se(f,2));function y(){const _=new N,w=new N;let E=0;const A=(e-t)/n;for(let R=0;R<=s;R++){const x=[],b=R/s,S=b*(e-t)+t;for(let T=0;T<=r;T++){const L=T/r,D=L*c+o,U=Math.sin(D),B=Math.cos(D);w.x=S*U,w.y=-b*n+g,w.z=S*B,u.push(w.x,w.y,w.z),_.set(U,A,B).normalize(),d.push(_.x,_.y,_.z),f.push(L,1-b),x.push(m++)}v.push(x)}for(let R=0;R<r;R++)for(let x=0;x<s;x++){const b=v[x][R],S=v[x+1][R],T=v[x+1][R+1],L=v[x][R+1];(t>0||x!==0)&&(h.push(b,S,L),E+=3),(e>0||x!==s-1)&&(h.push(S,T,L),E+=3)}l.addGroup(p,E,0),p+=E}function M(_){const w=m,E=new dt,A=new N;let R=0;const x=_===!0?t:e,b=_===!0?1:-1;for(let T=1;T<=r;T++)u.push(0,g*b,0),d.push(0,b,0),f.push(.5,.5),m++;const S=m;for(let T=0;T<=r;T++){const D=T/r*c+o,U=Math.cos(D),B=Math.sin(D);A.x=x*B,A.y=g*b,A.z=x*U,u.push(A.x,A.y,A.z),d.push(0,b,0),E.x=U*.5+.5,E.y=B*.5*b+.5,f.push(E.x,E.y),m++}for(let T=0;T<r;T++){const L=w+T,D=S+T;_===!0?h.push(D,D+1,L):h.push(D+1,D,L),R+=3}l.addGroup(p,R,_===!0?1:2),p+=R}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new oi(t.radiusTop,t.radiusBottom,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}}class ia extends oi{constructor(t=1,e=1,n=32,r=1,s=!1,a=0,o=Math.PI*2){super(0,t,e,n,r,s,a,o),this.type="ConeGeometry",this.parameters={radius:t,height:e,radialSegments:n,heightSegments:r,openEnded:s,thetaStart:a,thetaLength:o}}static fromJSON(t){return new ia(t.radius,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}}class ci{constructor(){this.type="Curve",this.arcLengthDivisions=200,this.needsUpdate=!1,this.cacheArcLengths=null}getPoint(){console.warn("THREE.Curve: .getPoint() not implemented.")}getPointAt(t,e){const n=this.getUtoTmapping(t);return this.getPoint(n,e)}getPoints(t=5){const e=[];for(let n=0;n<=t;n++)e.push(this.getPoint(n/t));return e}getSpacedPoints(t=5){const e=[];for(let n=0;n<=t;n++)e.push(this.getPointAt(n/t));return e}getLength(){const t=this.getLengths();return t[t.length-1]}getLengths(t=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===t+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;const e=[];let n,r=this.getPoint(0),s=0;e.push(0);for(let a=1;a<=t;a++)n=this.getPoint(a/t),s+=n.distanceTo(r),e.push(s),r=n;return this.cacheArcLengths=e,e}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(t,e=null){const n=this.getLengths();let r=0;const s=n.length;let a;e?a=e:a=t*n[s-1];let o=0,c=s-1,l;for(;o<=c;)if(r=Math.floor(o+(c-o)/2),l=n[r]-a,l<0)o=r+1;else if(l>0)c=r-1;else{c=r;break}if(r=c,n[r]===a)return r/(s-1);const h=n[r],d=n[r+1]-h,f=(a-h)/d;return(r+f)/(s-1)}getTangent(t,e){let r=t-1e-4,s=t+1e-4;r<0&&(r=0),s>1&&(s=1);const a=this.getPoint(r),o=this.getPoint(s),c=e||(a.isVector2?new dt:new N);return c.copy(o).sub(a).normalize(),c}getTangentAt(t,e){const n=this.getUtoTmapping(t);return this.getTangent(n,e)}computeFrenetFrames(t,e=!1){const n=new N,r=[],s=[],a=[],o=new N,c=new re;for(let f=0;f<=t;f++){const m=f/t;r[f]=this.getTangentAt(m,new N)}s[0]=new N,a[0]=new N;let l=Number.MAX_VALUE;const h=Math.abs(r[0].x),u=Math.abs(r[0].y),d=Math.abs(r[0].z);h<=l&&(l=h,n.set(1,0,0)),u<=l&&(l=u,n.set(0,1,0)),d<=l&&n.set(0,0,1),o.crossVectors(r[0],n).normalize(),s[0].crossVectors(r[0],o),a[0].crossVectors(r[0],s[0]);for(let f=1;f<=t;f++){if(s[f]=s[f-1].clone(),a[f]=a[f-1].clone(),o.crossVectors(r[f-1],r[f]),o.length()>Number.EPSILON){o.normalize();const m=Math.acos(ne(r[f-1].dot(r[f]),-1,1));s[f].applyMatrix4(c.makeRotationAxis(o,m))}a[f].crossVectors(r[f],s[f])}if(e===!0){let f=Math.acos(ne(s[0].dot(s[t]),-1,1));f/=t,r[0].dot(o.crossVectors(s[0],s[t]))>0&&(f=-f);for(let m=1;m<=t;m++)s[m].applyMatrix4(c.makeRotationAxis(r[m],f*m)),a[m].crossVectors(r[m],s[m])}return{tangents:r,normals:s,binormals:a}}clone(){return new this.constructor().copy(this)}copy(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}toJSON(){const t={metadata:{version:4.7,type:"Curve",generator:"Curve.toJSON"}};return t.arcLengthDivisions=this.arcLengthDivisions,t.type=this.type,t}fromJSON(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}}class kl extends ci{constructor(t=0,e=0,n=1,r=1,s=0,a=Math.PI*2,o=!1,c=0){super(),this.isEllipseCurve=!0,this.type="EllipseCurve",this.aX=t,this.aY=e,this.xRadius=n,this.yRadius=r,this.aStartAngle=s,this.aEndAngle=a,this.aClockwise=o,this.aRotation=c}getPoint(t,e=new dt){const n=e,r=Math.PI*2;let s=this.aEndAngle-this.aStartAngle;const a=Math.abs(s)<Number.EPSILON;for(;s<0;)s+=r;for(;s>r;)s-=r;s<Number.EPSILON&&(a?s=0:s=r),this.aClockwise===!0&&!a&&(s===r?s=-r:s=s-r);const o=this.aStartAngle+t*s;let c=this.aX+this.xRadius*Math.cos(o),l=this.aY+this.yRadius*Math.sin(o);if(this.aRotation!==0){const h=Math.cos(this.aRotation),u=Math.sin(this.aRotation),d=c-this.aX,f=l-this.aY;c=d*h-f*u+this.aX,l=d*u+f*h+this.aY}return n.set(c,l)}copy(t){return super.copy(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}toJSON(){const t=super.toJSON();return t.aX=this.aX,t.aY=this.aY,t.xRadius=this.xRadius,t.yRadius=this.yRadius,t.aStartAngle=this.aStartAngle,t.aEndAngle=this.aEndAngle,t.aClockwise=this.aClockwise,t.aRotation=this.aRotation,t}fromJSON(t){return super.fromJSON(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}}class c1 extends kl{constructor(t,e,n,r,s,a){super(t,e,n,n,r,s,a),this.isArcCurve=!0,this.type="ArcCurve"}}function zl(){let i=0,t=0,e=0,n=0;function r(s,a,o,c){i=s,t=o,e=-3*s+3*a-2*o-c,n=2*s-2*a+o+c}return{initCatmullRom:function(s,a,o,c,l){r(a,o,l*(o-s),l*(c-a))},initNonuniformCatmullRom:function(s,a,o,c,l,h,u){let d=(a-s)/l-(o-s)/(l+h)+(o-a)/h,f=(o-a)/h-(c-a)/(h+u)+(c-o)/u;d*=h,f*=h,r(a,o,d,f)},calc:function(s){const a=s*s,o=a*s;return i+t*s+e*a+n*o}}}const Ia=new N,jo=new zl,Jo=new zl,Zo=new zl;class jr extends ci{constructor(t=[],e=!1,n="centripetal",r=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=t,this.closed=e,this.curveType=n,this.tension=r}getPoint(t,e=new N){const n=e,r=this.points,s=r.length,a=(s-(this.closed?0:1))*t;let o=Math.floor(a),c=a-o;this.closed?o+=o>0?0:(Math.floor(Math.abs(o)/s)+1)*s:c===0&&o===s-1&&(o=s-2,c=1);let l,h;this.closed||o>0?l=r[(o-1)%s]:(Ia.subVectors(r[0],r[1]).add(r[0]),l=Ia);const u=r[o%s],d=r[(o+1)%s];if(this.closed||o+2<s?h=r[(o+2)%s]:(Ia.subVectors(r[s-1],r[s-2]).add(r[s-1]),h=Ia),this.curveType==="centripetal"||this.curveType==="chordal"){const f=this.curveType==="chordal"?.5:.25;let m=Math.pow(l.distanceToSquared(u),f),v=Math.pow(u.distanceToSquared(d),f),g=Math.pow(d.distanceToSquared(h),f);v<1e-4&&(v=1),m<1e-4&&(m=v),g<1e-4&&(g=v),jo.initNonuniformCatmullRom(l.x,u.x,d.x,h.x,m,v,g),Jo.initNonuniformCatmullRom(l.y,u.y,d.y,h.y,m,v,g),Zo.initNonuniformCatmullRom(l.z,u.z,d.z,h.z,m,v,g)}else this.curveType==="catmullrom"&&(jo.initCatmullRom(l.x,u.x,d.x,h.x,this.tension),Jo.initCatmullRom(l.y,u.y,d.y,h.y,this.tension),Zo.initCatmullRom(l.z,u.z,d.z,h.z,this.tension));return n.set(jo.calc(c),Jo.calc(c),Zo.calc(c)),n}copy(t){super.copy(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){const r=t.points[e];this.points.push(r.clone())}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}toJSON(){const t=super.toJSON();t.points=[];for(let e=0,n=this.points.length;e<n;e++){const r=this.points[e];t.points.push(r.toArray())}return t.closed=this.closed,t.curveType=this.curveType,t.tension=this.tension,t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){const r=t.points[e];this.points.push(new N().fromArray(r))}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}}function Kh(i,t,e,n,r){const s=(n-t)*.5,a=(r-e)*.5,o=i*i,c=i*o;return(2*e-2*n+s+a)*c+(-3*e+3*n-2*s-a)*o+s*i+e}function l1(i,t){const e=1-i;return e*e*t}function h1(i,t){return 2*(1-i)*i*t}function u1(i,t){return i*i*t}function Os(i,t,e,n){return l1(i,t)+h1(i,e)+u1(i,n)}function f1(i,t){const e=1-i;return e*e*e*t}function d1(i,t){const e=1-i;return 3*e*e*i*t}function p1(i,t){return 3*(1-i)*i*i*t}function m1(i,t){return i*i*i*t}function Bs(i,t,e,n,r){return f1(i,t)+d1(i,e)+p1(i,n)+m1(i,r)}class Kf extends ci{constructor(t=new dt,e=new dt,n=new dt,r=new dt){super(),this.isCubicBezierCurve=!0,this.type="CubicBezierCurve",this.v0=t,this.v1=e,this.v2=n,this.v3=r}getPoint(t,e=new dt){const n=e,r=this.v0,s=this.v1,a=this.v2,o=this.v3;return n.set(Bs(t,r.x,s.x,a.x,o.x),Bs(t,r.y,s.y,a.y,o.y)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}}class g1 extends ci{constructor(t=new N,e=new N,n=new N,r=new N){super(),this.isCubicBezierCurve3=!0,this.type="CubicBezierCurve3",this.v0=t,this.v1=e,this.v2=n,this.v3=r}getPoint(t,e=new N){const n=e,r=this.v0,s=this.v1,a=this.v2,o=this.v3;return n.set(Bs(t,r.x,s.x,a.x,o.x),Bs(t,r.y,s.y,a.y,o.y),Bs(t,r.z,s.z,a.z,o.z)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}}class Qf extends ci{constructor(t=new dt,e=new dt){super(),this.isLineCurve=!0,this.type="LineCurve",this.v1=t,this.v2=e}getPoint(t,e=new dt){const n=e;return t===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(t).add(this.v1)),n}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new dt){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class v1 extends ci{constructor(t=new N,e=new N){super(),this.isLineCurve3=!0,this.type="LineCurve3",this.v1=t,this.v2=e}getPoint(t,e=new N){const n=e;return t===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(t).add(this.v1)),n}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new N){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class td extends ci{constructor(t=new dt,e=new dt,n=new dt){super(),this.isQuadraticBezierCurve=!0,this.type="QuadraticBezierCurve",this.v0=t,this.v1=e,this.v2=n}getPoint(t,e=new dt){const n=e,r=this.v0,s=this.v1,a=this.v2;return n.set(Os(t,r.x,s.x,a.x),Os(t,r.y,s.y,a.y)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class ed extends ci{constructor(t=new N,e=new N,n=new N){super(),this.isQuadraticBezierCurve3=!0,this.type="QuadraticBezierCurve3",this.v0=t,this.v1=e,this.v2=n}getPoint(t,e=new N){const n=e,r=this.v0,s=this.v1,a=this.v2;return n.set(Os(t,r.x,s.x,a.x),Os(t,r.y,s.y,a.y),Os(t,r.z,s.z,a.z)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class nd extends ci{constructor(t=[]){super(),this.isSplineCurve=!0,this.type="SplineCurve",this.points=t}getPoint(t,e=new dt){const n=e,r=this.points,s=(r.length-1)*t,a=Math.floor(s),o=s-a,c=r[a===0?a:a-1],l=r[a],h=r[a>r.length-2?r.length-1:a+1],u=r[a>r.length-3?r.length-1:a+2];return n.set(Kh(o,c.x,l.x,h.x,u.x),Kh(o,c.y,l.y,h.y,u.y)),n}copy(t){super.copy(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){const r=t.points[e];this.points.push(r.clone())}return this}toJSON(){const t=super.toJSON();t.points=[];for(let e=0,n=this.points.length;e<n;e++){const r=this.points[e];t.points.push(r.toArray())}return t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){const r=t.points[e];this.points.push(new dt().fromArray(r))}return this}}var ao=Object.freeze({__proto__:null,ArcCurve:c1,CatmullRomCurve3:jr,CubicBezierCurve:Kf,CubicBezierCurve3:g1,EllipseCurve:kl,LineCurve:Qf,LineCurve3:v1,QuadraticBezierCurve:td,QuadraticBezierCurve3:ed,SplineCurve:nd});class x1 extends ci{constructor(){super(),this.type="CurvePath",this.curves=[],this.autoClose=!1}add(t){this.curves.push(t)}closePath(){const t=this.curves[0].getPoint(0),e=this.curves[this.curves.length-1].getPoint(1);if(!t.equals(e)){const n=t.isVector2===!0?"LineCurve":"LineCurve3";this.curves.push(new ao[n](e,t))}return this}getPoint(t,e){const n=t*this.getLength(),r=this.getCurveLengths();let s=0;for(;s<r.length;){if(r[s]>=n){const a=r[s]-n,o=this.curves[s],c=o.getLength(),l=c===0?0:1-a/c;return o.getPointAt(l,e)}s++}return null}getLength(){const t=this.getCurveLengths();return t[t.length-1]}updateArcLengths(){this.needsUpdate=!0,this.cacheLengths=null,this.getCurveLengths()}getCurveLengths(){if(this.cacheLengths&&this.cacheLengths.length===this.curves.length)return this.cacheLengths;const t=[];let e=0;for(let n=0,r=this.curves.length;n<r;n++)e+=this.curves[n].getLength(),t.push(e);return this.cacheLengths=t,t}getSpacedPoints(t=40){const e=[];for(let n=0;n<=t;n++)e.push(this.getPoint(n/t));return this.autoClose&&e.push(e[0]),e}getPoints(t=12){const e=[];let n;for(let r=0,s=this.curves;r<s.length;r++){const a=s[r],o=a.isEllipseCurve?t*2:a.isLineCurve||a.isLineCurve3?1:a.isSplineCurve?t*a.points.length:t,c=a.getPoints(o);for(let l=0;l<c.length;l++){const h=c[l];n&&n.equals(h)||(e.push(h),n=h)}}return this.autoClose&&e.length>1&&!e[e.length-1].equals(e[0])&&e.push(e[0]),e}copy(t){super.copy(t),this.curves=[];for(let e=0,n=t.curves.length;e<n;e++){const r=t.curves[e];this.curves.push(r.clone())}return this.autoClose=t.autoClose,this}toJSON(){const t=super.toJSON();t.autoClose=this.autoClose,t.curves=[];for(let e=0,n=this.curves.length;e<n;e++){const r=this.curves[e];t.curves.push(r.toJSON())}return t}fromJSON(t){super.fromJSON(t),this.autoClose=t.autoClose,this.curves=[];for(let e=0,n=t.curves.length;e<n;e++){const r=t.curves[e];this.curves.push(new ao[r.type]().fromJSON(r))}return this}}class Qh extends x1{constructor(t){super(),this.type="Path",this.currentPoint=new dt,t&&this.setFromPoints(t)}setFromPoints(t){this.moveTo(t[0].x,t[0].y);for(let e=1,n=t.length;e<n;e++)this.lineTo(t[e].x,t[e].y);return this}moveTo(t,e){return this.currentPoint.set(t,e),this}lineTo(t,e){const n=new Qf(this.currentPoint.clone(),new dt(t,e));return this.curves.push(n),this.currentPoint.set(t,e),this}quadraticCurveTo(t,e,n,r){const s=new td(this.currentPoint.clone(),new dt(t,e),new dt(n,r));return this.curves.push(s),this.currentPoint.set(n,r),this}bezierCurveTo(t,e,n,r,s,a){const o=new Kf(this.currentPoint.clone(),new dt(t,e),new dt(n,r),new dt(s,a));return this.curves.push(o),this.currentPoint.set(s,a),this}splineThru(t){const e=[this.currentPoint.clone()].concat(t),n=new nd(e);return this.curves.push(n),this.currentPoint.copy(t[t.length-1]),this}arc(t,e,n,r,s,a){const o=this.currentPoint.x,c=this.currentPoint.y;return this.absarc(t+o,e+c,n,r,s,a),this}absarc(t,e,n,r,s,a){return this.absellipse(t,e,n,n,r,s,a),this}ellipse(t,e,n,r,s,a,o,c){const l=this.currentPoint.x,h=this.currentPoint.y;return this.absellipse(t+l,e+h,n,r,s,a,o,c),this}absellipse(t,e,n,r,s,a,o,c){const l=new kl(t,e,n,r,s,a,o,c);if(this.curves.length>0){const u=l.getPoint(0);u.equals(this.currentPoint)||this.lineTo(u.x,u.y)}this.curves.push(l);const h=l.getPoint(1);return this.currentPoint.copy(h),this}copy(t){return super.copy(t),this.currentPoint.copy(t.currentPoint),this}toJSON(){const t=super.toJSON();return t.currentPoint=this.currentPoint.toArray(),t}fromJSON(t){return super.fromJSON(t),this.currentPoint.fromArray(t.currentPoint),this}}class id extends Qh{constructor(t){super(t),this.uuid=Yi(),this.type="Shape",this.holes=[]}getPointsHoles(t){const e=[];for(let n=0,r=this.holes.length;n<r;n++)e[n]=this.holes[n].getPoints(t);return e}extractPoints(t){return{shape:this.getPoints(t),holes:this.getPointsHoles(t)}}copy(t){super.copy(t),this.holes=[];for(let e=0,n=t.holes.length;e<n;e++){const r=t.holes[e];this.holes.push(r.clone())}return this}toJSON(){const t=super.toJSON();t.uuid=this.uuid,t.holes=[];for(let e=0,n=this.holes.length;e<n;e++){const r=this.holes[e];t.holes.push(r.toJSON())}return t}fromJSON(t){super.fromJSON(t),this.uuid=t.uuid,this.holes=[];for(let e=0,n=t.holes.length;e<n;e++){const r=t.holes[e];this.holes.push(new Qh().fromJSON(r))}return this}}function _1(i,t,e=2){const n=t&&t.length,r=n?t[0]*e:i.length;let s=rd(i,0,r,e,!0);const a=[];if(!s||s.next===s.prev)return a;let o,c,l;if(n&&(s=w1(i,t,s,e)),i.length>80*e){o=1/0,c=1/0;let h=-1/0,u=-1/0;for(let d=e;d<r;d+=e){const f=i[d],m=i[d+1];f<o&&(o=f),m<c&&(c=m),f>h&&(h=f),m>u&&(u=m)}l=Math.max(h-o,u-c),l=l!==0?32767/l:0}return Xs(s,a,e,o,c,l,0),a}function rd(i,t,e,n,r){let s;if(r===N1(i,t,e,n)>0)for(let a=t;a<e;a+=n)s=tu(a/n|0,i[a],i[a+1],s);else for(let a=e-n;a>=t;a-=n)s=tu(a/n|0,i[a],i[a+1],s);return s&&ps(s,s.next)&&(Ys(s),s=s.next),s}function vr(i,t){if(!i)return i;t||(t=i);let e=i,n;do if(n=!1,!e.steiner&&(ps(e,e.next)||we(e.prev,e,e.next)===0)){if(Ys(e),e=t=e.prev,e===e.next)break;n=!0}else e=e.next;while(n||e!==t);return t}function Xs(i,t,e,n,r,s,a){if(!i)return;!a&&s&&C1(i,n,r,s);let o=i;for(;i.prev!==i.next;){const c=i.prev,l=i.next;if(s?y1(i,n,r,s):M1(i)){t.push(c.i,i.i,l.i),Ys(i),i=l.next,o=l.next;continue}if(i=l,i===o){a?a===1?(i=b1(vr(i),t),Xs(i,t,e,n,r,s,2)):a===2&&S1(i,t,e,n,r,s):Xs(vr(i),t,e,n,r,s,1);break}}}function M1(i){const t=i.prev,e=i,n=i.next;if(we(t,e,n)>=0)return!1;const r=t.x,s=e.x,a=n.x,o=t.y,c=e.y,l=n.y,h=Math.min(r,s,a),u=Math.min(o,c,l),d=Math.max(r,s,a),f=Math.max(o,c,l);let m=n.next;for(;m!==t;){if(m.x>=h&&m.x<=d&&m.y>=u&&m.y<=f&&Ds(r,o,s,c,a,l,m.x,m.y)&&we(m.prev,m,m.next)>=0)return!1;m=m.next}return!0}function y1(i,t,e,n){const r=i.prev,s=i,a=i.next;if(we(r,s,a)>=0)return!1;const o=r.x,c=s.x,l=a.x,h=r.y,u=s.y,d=a.y,f=Math.min(o,c,l),m=Math.min(h,u,d),v=Math.max(o,c,l),g=Math.max(h,u,d),p=ol(f,m,t,e,n),y=ol(v,g,t,e,n);let M=i.prevZ,_=i.nextZ;for(;M&&M.z>=p&&_&&_.z<=y;){if(M.x>=f&&M.x<=v&&M.y>=m&&M.y<=g&&M!==r&&M!==a&&Ds(o,h,c,u,l,d,M.x,M.y)&&we(M.prev,M,M.next)>=0||(M=M.prevZ,_.x>=f&&_.x<=v&&_.y>=m&&_.y<=g&&_!==r&&_!==a&&Ds(o,h,c,u,l,d,_.x,_.y)&&we(_.prev,_,_.next)>=0))return!1;_=_.nextZ}for(;M&&M.z>=p;){if(M.x>=f&&M.x<=v&&M.y>=m&&M.y<=g&&M!==r&&M!==a&&Ds(o,h,c,u,l,d,M.x,M.y)&&we(M.prev,M,M.next)>=0)return!1;M=M.prevZ}for(;_&&_.z<=y;){if(_.x>=f&&_.x<=v&&_.y>=m&&_.y<=g&&_!==r&&_!==a&&Ds(o,h,c,u,l,d,_.x,_.y)&&we(_.prev,_,_.next)>=0)return!1;_=_.nextZ}return!0}function b1(i,t){let e=i;do{const n=e.prev,r=e.next.next;!ps(n,r)&&ad(n,e,e.next,r)&&qs(n,r)&&qs(r,n)&&(t.push(n.i,e.i,r.i),Ys(e),Ys(e.next),e=i=r),e=e.next}while(e!==i);return vr(e)}function S1(i,t,e,n,r,s){let a=i;do{let o=a.next.next;for(;o!==a.prev;){if(a.i!==o.i&&D1(a,o)){let c=od(a,o);a=vr(a,a.next),c=vr(c,c.next),Xs(a,t,e,n,r,s,0),Xs(c,t,e,n,r,s,0);return}o=o.next}a=a.next}while(a!==i)}function w1(i,t,e,n){const r=[];for(let s=0,a=t.length;s<a;s++){const o=t[s]*n,c=s<a-1?t[s+1]*n:i.length,l=rd(i,o,c,n,!1);l===l.next&&(l.steiner=!0),r.push(P1(l))}r.sort(E1);for(let s=0;s<r.length;s++)e=T1(r[s],e);return e}function E1(i,t){let e=i.x-t.x;if(e===0&&(e=i.y-t.y,e===0)){const n=(i.next.y-i.y)/(i.next.x-i.x),r=(t.next.y-t.y)/(t.next.x-t.x);e=n-r}return e}function T1(i,t){const e=A1(i,t);if(!e)return t;const n=od(e,i);return vr(n,n.next),vr(e,e.next)}function A1(i,t){let e=t;const n=i.x,r=i.y;let s=-1/0,a;if(ps(i,e))return e;do{if(ps(i,e.next))return e.next;if(r<=e.y&&r>=e.next.y&&e.next.y!==e.y){const u=e.x+(r-e.y)*(e.next.x-e.x)/(e.next.y-e.y);if(u<=n&&u>s&&(s=u,a=e.x<e.next.x?e:e.next,u===n))return a}e=e.next}while(e!==t);if(!a)return null;const o=a,c=a.x,l=a.y;let h=1/0;e=a;do{if(n>=e.x&&e.x>=c&&n!==e.x&&sd(r<l?n:s,r,c,l,r<l?s:n,r,e.x,e.y)){const u=Math.abs(r-e.y)/(n-e.x);qs(e,i)&&(u<h||u===h&&(e.x>a.x||e.x===a.x&&R1(a,e)))&&(a=e,h=u)}e=e.next}while(e!==o);return a}function R1(i,t){return we(i.prev,i,t.prev)<0&&we(t.next,i,i.next)<0}function C1(i,t,e,n){let r=i;do r.z===0&&(r.z=ol(r.x,r.y,t,e,n)),r.prevZ=r.prev,r.nextZ=r.next,r=r.next;while(r!==i);r.prevZ.nextZ=null,r.prevZ=null,L1(r)}function L1(i){let t,e=1;do{let n=i,r;i=null;let s=null;for(t=0;n;){t++;let a=n,o=0;for(let l=0;l<e&&(o++,a=a.nextZ,!!a);l++);let c=e;for(;o>0||c>0&&a;)o!==0&&(c===0||!a||n.z<=a.z)?(r=n,n=n.nextZ,o--):(r=a,a=a.nextZ,c--),s?s.nextZ=r:i=r,r.prevZ=s,s=r;n=a}s.nextZ=null,e*=2}while(t>1);return i}function ol(i,t,e,n,r){return i=(i-e)*r|0,t=(t-n)*r|0,i=(i|i<<8)&16711935,i=(i|i<<4)&252645135,i=(i|i<<2)&858993459,i=(i|i<<1)&1431655765,t=(t|t<<8)&16711935,t=(t|t<<4)&252645135,t=(t|t<<2)&858993459,t=(t|t<<1)&1431655765,i|t<<1}function P1(i){let t=i,e=i;do(t.x<e.x||t.x===e.x&&t.y<e.y)&&(e=t),t=t.next;while(t!==i);return e}function sd(i,t,e,n,r,s,a,o){return(r-a)*(t-o)>=(i-a)*(s-o)&&(i-a)*(n-o)>=(e-a)*(t-o)&&(e-a)*(s-o)>=(r-a)*(n-o)}function Ds(i,t,e,n,r,s,a,o){return!(i===a&&t===o)&&sd(i,t,e,n,r,s,a,o)}function D1(i,t){return i.next.i!==t.i&&i.prev.i!==t.i&&!I1(i,t)&&(qs(i,t)&&qs(t,i)&&U1(i,t)&&(we(i.prev,i,t.prev)||we(i,t.prev,t))||ps(i,t)&&we(i.prev,i,i.next)>0&&we(t.prev,t,t.next)>0)}function we(i,t,e){return(t.y-i.y)*(e.x-t.x)-(t.x-i.x)*(e.y-t.y)}function ps(i,t){return i.x===t.x&&i.y===t.y}function ad(i,t,e,n){const r=Na(we(i,t,e)),s=Na(we(i,t,n)),a=Na(we(e,n,i)),o=Na(we(e,n,t));return!!(r!==s&&a!==o||r===0&&Ua(i,e,t)||s===0&&Ua(i,n,t)||a===0&&Ua(e,i,n)||o===0&&Ua(e,t,n))}function Ua(i,t,e){return t.x<=Math.max(i.x,e.x)&&t.x>=Math.min(i.x,e.x)&&t.y<=Math.max(i.y,e.y)&&t.y>=Math.min(i.y,e.y)}function Na(i){return i>0?1:i<0?-1:0}function I1(i,t){let e=i;do{if(e.i!==i.i&&e.next.i!==i.i&&e.i!==t.i&&e.next.i!==t.i&&ad(e,e.next,i,t))return!0;e=e.next}while(e!==i);return!1}function qs(i,t){return we(i.prev,i,i.next)<0?we(i,t,i.next)>=0&&we(i,i.prev,t)>=0:we(i,t,i.prev)<0||we(i,i.next,t)<0}function U1(i,t){let e=i,n=!1;const r=(i.x+t.x)/2,s=(i.y+t.y)/2;do e.y>s!=e.next.y>s&&e.next.y!==e.y&&r<(e.next.x-e.x)*(s-e.y)/(e.next.y-e.y)+e.x&&(n=!n),e=e.next;while(e!==i);return n}function od(i,t){const e=cl(i.i,i.x,i.y),n=cl(t.i,t.x,t.y),r=i.next,s=t.prev;return i.next=t,t.prev=i,e.next=r,r.prev=e,n.next=e,e.prev=n,s.next=n,n.prev=s,n}function tu(i,t,e,n){const r=cl(i,t,e);return n?(r.next=n.next,r.prev=n,n.next.prev=r,n.next=r):(r.prev=r,r.next=r),r}function Ys(i){i.next.prev=i.prev,i.prev.next=i.next,i.prevZ&&(i.prevZ.nextZ=i.nextZ),i.nextZ&&(i.nextZ.prevZ=i.prevZ)}function cl(i,t,e){return{i,x:t,y:e,prev:null,next:null,z:0,prevZ:null,nextZ:null,steiner:!1}}function N1(i,t,e,n){let r=0;for(let s=t,a=e-n;s<e;s+=n)r+=(i[a]-i[s])*(i[s+1]+i[a+1]),a=s;return r}class F1{static triangulate(t,e,n=2){return _1(t,e,n)}}class Jr{static area(t){const e=t.length;let n=0;for(let r=e-1,s=0;s<e;r=s++)n+=t[r].x*t[s].y-t[s].x*t[r].y;return n*.5}static isClockWise(t){return Jr.area(t)<0}static triangulateShape(t,e){const n=[],r=[],s=[];eu(t),nu(n,t);let a=t.length;e.forEach(eu);for(let c=0;c<e.length;c++)r.push(a),a+=e[c].length,nu(n,e[c]);const o=F1.triangulate(n,r);for(let c=0;c<o.length;c+=3)s.push(o.slice(c,c+3));return s}}function eu(i){const t=i.length;t>2&&i[t-1].equals(i[0])&&i.pop()}function nu(i,t){for(let e=0;e<t.length;e++)i.push(t[e].x),i.push(t[e].y)}class Hl extends Ee{constructor(t=new id([new dt(.5,.5),new dt(-.5,.5),new dt(-.5,-.5),new dt(.5,-.5)]),e={}){super(),this.type="ExtrudeGeometry",this.parameters={shapes:t,options:e},t=Array.isArray(t)?t:[t];const n=this,r=[],s=[];for(let o=0,c=t.length;o<c;o++){const l=t[o];a(l)}this.setAttribute("position",new se(r,3)),this.setAttribute("uv",new se(s,2)),this.computeVertexNormals();function a(o){const c=[],l=e.curveSegments!==void 0?e.curveSegments:12,h=e.steps!==void 0?e.steps:1,u=e.depth!==void 0?e.depth:1;let d=e.bevelEnabled!==void 0?e.bevelEnabled:!0,f=e.bevelThickness!==void 0?e.bevelThickness:.2,m=e.bevelSize!==void 0?e.bevelSize:f-.1,v=e.bevelOffset!==void 0?e.bevelOffset:0,g=e.bevelSegments!==void 0?e.bevelSegments:3;const p=e.extrudePath,y=e.UVGenerator!==void 0?e.UVGenerator:O1;let M,_=!1,w,E,A,R;p&&(M=p.getSpacedPoints(h),_=!0,d=!1,w=p.computeFrenetFrames(h,!1),E=new N,A=new N,R=new N),d||(g=0,f=0,m=0,v=0);const x=o.extractPoints(l);let b=x.shape;const S=x.holes;if(!Jr.isClockWise(b)){b=b.reverse();for(let Z=0,j=S.length;Z<j;Z++){const et=S[Z];Jr.isClockWise(et)&&(S[Z]=et.reverse())}}function L(Z){const et=10000000000000001e-36;let st=Z[0];for(let ht=1;ht<=Z.length;ht++){const pt=ht%Z.length,xt=Z[pt],Jt=xt.x-st.x,qt=xt.y-st.y,F=Jt*Jt+qt*qt,C=Math.max(Math.abs(xt.x),Math.abs(xt.y),Math.abs(st.x),Math.abs(st.y)),$=et*C*C;if(F<=$){Z.splice(pt,1),ht--;continue}st=xt}}L(b),S.forEach(L);const D=S.length,U=b;for(let Z=0;Z<D;Z++){const j=S[Z];b=b.concat(j)}function B(Z,j,et){return j||console.error("THREE.ExtrudeGeometry: vec does not exist"),Z.clone().addScaledVector(j,et)}const X=b.length;function H(Z,j,et){let st,ht,pt;const xt=Z.x-j.x,Jt=Z.y-j.y,qt=et.x-Z.x,F=et.y-Z.y,C=xt*xt+Jt*Jt,$=xt*F-Jt*qt;if(Math.abs($)>Number.EPSILON){const at=Math.sqrt(C),gt=Math.sqrt(qt*qt+F*F),ot=j.x-Jt/at,Ht=j.y+xt/at,wt=et.x-F/gt,Bt=et.y+qt/gt,kt=((wt-ot)*F-(Bt-Ht)*qt)/(xt*F-Jt*qt);st=ot+xt*kt-Z.x,ht=Ht+Jt*kt-Z.y;const _t=st*st+ht*ht;if(_t<=2)return new dt(st,ht);pt=Math.sqrt(_t/2)}else{let at=!1;xt>Number.EPSILON?qt>Number.EPSILON&&(at=!0):xt<-Number.EPSILON?qt<-Number.EPSILON&&(at=!0):Math.sign(Jt)===Math.sign(F)&&(at=!0),at?(st=-Jt,ht=xt,pt=Math.sqrt(C)):(st=xt,ht=Jt,pt=Math.sqrt(C/2))}return new dt(st/pt,ht/pt)}const Q=[];for(let Z=0,j=U.length,et=j-1,st=Z+1;Z<j;Z++,et++,st++)et===j&&(et=0),st===j&&(st=0),Q[Z]=H(U[Z],U[et],U[st]);const ct=[];let ut,vt=Q.concat();for(let Z=0,j=D;Z<j;Z++){const et=S[Z];ut=[];for(let st=0,ht=et.length,pt=ht-1,xt=st+1;st<ht;st++,pt++,xt++)pt===ht&&(pt=0),xt===ht&&(xt=0),ut[st]=H(et[st],et[pt],et[xt]);ct.push(ut),vt=vt.concat(ut)}let Et;if(g===0)Et=Jr.triangulateShape(U,S);else{const Z=[],j=[];for(let et=0;et<g;et++){const st=et/g,ht=f*Math.cos(st*Math.PI/2),pt=m*Math.sin(st*Math.PI/2)+v;for(let xt=0,Jt=U.length;xt<Jt;xt++){const qt=B(U[xt],Q[xt],pt);W(qt.x,qt.y,-ht),st===0&&Z.push(qt)}for(let xt=0,Jt=D;xt<Jt;xt++){const qt=S[xt];ut=ct[xt];const F=[];for(let C=0,$=qt.length;C<$;C++){const at=B(qt[C],ut[C],pt);W(at.x,at.y,-ht),st===0&&F.push(at)}st===0&&j.push(F)}}Et=Jr.triangulateShape(Z,j)}const Nt=Et.length,lt=m+v;for(let Z=0;Z<X;Z++){const j=d?B(b[Z],vt[Z],lt):b[Z];_?(A.copy(w.normals[0]).multiplyScalar(j.x),E.copy(w.binormals[0]).multiplyScalar(j.y),R.copy(M[0]).add(A).add(E),W(R.x,R.y,R.z)):W(j.x,j.y,0)}for(let Z=1;Z<=h;Z++)for(let j=0;j<X;j++){const et=d?B(b[j],vt[j],lt):b[j];_?(A.copy(w.normals[Z]).multiplyScalar(et.x),E.copy(w.binormals[Z]).multiplyScalar(et.y),R.copy(M[Z]).add(A).add(E),W(R.x,R.y,R.z)):W(et.x,et.y,u/h*Z)}for(let Z=g-1;Z>=0;Z--){const j=Z/g,et=f*Math.cos(j*Math.PI/2),st=m*Math.sin(j*Math.PI/2)+v;for(let ht=0,pt=U.length;ht<pt;ht++){const xt=B(U[ht],Q[ht],st);W(xt.x,xt.y,u+et)}for(let ht=0,pt=S.length;ht<pt;ht++){const xt=S[ht];ut=ct[ht];for(let Jt=0,qt=xt.length;Jt<qt;Jt++){const F=B(xt[Jt],ut[Jt],st);_?W(F.x,F.y+M[h-1].y,M[h-1].x+et):W(F.x,F.y,u+et)}}}G(),J();function G(){const Z=r.length/3;if(d){let j=0,et=X*j;for(let st=0;st<Nt;st++){const ht=Et[st];k(ht[2]+et,ht[1]+et,ht[0]+et)}j=h+g*2,et=X*j;for(let st=0;st<Nt;st++){const ht=Et[st];k(ht[0]+et,ht[1]+et,ht[2]+et)}}else{for(let j=0;j<Nt;j++){const et=Et[j];k(et[2],et[1],et[0])}for(let j=0;j<Nt;j++){const et=Et[j];k(et[0]+X*h,et[1]+X*h,et[2]+X*h)}}n.addGroup(Z,r.length/3-Z,0)}function J(){const Z=r.length/3;let j=0;z(U,j),j+=U.length;for(let et=0,st=S.length;et<st;et++){const ht=S[et];z(ht,j),j+=ht.length}n.addGroup(Z,r.length/3-Z,1)}function z(Z,j){let et=Z.length;for(;--et>=0;){const st=et;let ht=et-1;ht<0&&(ht=Z.length-1);for(let pt=0,xt=h+g*2;pt<xt;pt++){const Jt=X*pt,qt=X*(pt+1),F=j+st+Jt,C=j+ht+Jt,$=j+ht+qt,at=j+st+qt;K(F,C,$,at)}}}function W(Z,j,et){c.push(Z),c.push(j),c.push(et)}function k(Z,j,et){it(Z),it(j),it(et);const st=r.length/3,ht=y.generateTopUV(n,r,st-3,st-2,st-1);I(ht[0]),I(ht[1]),I(ht[2])}function K(Z,j,et,st){it(Z),it(j),it(st),it(j),it(et),it(st);const ht=r.length/3,pt=y.generateSideWallUV(n,r,ht-6,ht-3,ht-2,ht-1);I(pt[0]),I(pt[1]),I(pt[3]),I(pt[1]),I(pt[2]),I(pt[3])}function it(Z){r.push(c[Z*3+0]),r.push(c[Z*3+1]),r.push(c[Z*3+2])}function I(Z){s.push(Z.x),s.push(Z.y)}}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}toJSON(){const t=super.toJSON(),e=this.parameters.shapes,n=this.parameters.options;return B1(e,n,t)}static fromJSON(t,e){const n=[];for(let s=0,a=t.shapes.length;s<a;s++){const o=e[t.shapes[s]];n.push(o)}const r=t.options.extrudePath;return r!==void 0&&(t.options.extrudePath=new ao[r.type]().fromJSON(r)),new Hl(n,t.options)}}const O1={generateTopUV:function(i,t,e,n,r){const s=t[e*3],a=t[e*3+1],o=t[n*3],c=t[n*3+1],l=t[r*3],h=t[r*3+1];return[new dt(s,a),new dt(o,c),new dt(l,h)]},generateSideWallUV:function(i,t,e,n,r,s){const a=t[e*3],o=t[e*3+1],c=t[e*3+2],l=t[n*3],h=t[n*3+1],u=t[n*3+2],d=t[r*3],f=t[r*3+1],m=t[r*3+2],v=t[s*3],g=t[s*3+1],p=t[s*3+2];return Math.abs(o-h)<Math.abs(a-l)?[new dt(a,1-c),new dt(l,1-u),new dt(d,1-m),new dt(v,1-p)]:[new dt(o,1-c),new dt(h,1-u),new dt(f,1-m),new dt(g,1-p)]}};function B1(i,t,e){if(e.shapes=[],Array.isArray(i))for(let n=0,r=i.length;n<r;n++){const s=i[n];e.shapes.push(s.uuid)}else e.shapes.push(i.uuid);return e.options=Object.assign({},t),t.extrudePath!==void 0&&(e.options.extrudePath=t.extrudePath.toJSON()),e}class ms extends Ee{constructor(t=[new dt(0,-.5),new dt(.5,0),new dt(0,.5)],e=12,n=0,r=Math.PI*2){super(),this.type="LatheGeometry",this.parameters={points:t,segments:e,phiStart:n,phiLength:r},e=Math.floor(e),r=ne(r,0,Math.PI*2);const s=[],a=[],o=[],c=[],l=[],h=1/e,u=new N,d=new dt,f=new N,m=new N,v=new N;let g=0,p=0;for(let y=0;y<=t.length-1;y++)switch(y){case 0:g=t[y+1].x-t[y].x,p=t[y+1].y-t[y].y,f.x=p*1,f.y=-g,f.z=p*0,v.copy(f),f.normalize(),c.push(f.x,f.y,f.z);break;case t.length-1:c.push(v.x,v.y,v.z);break;default:g=t[y+1].x-t[y].x,p=t[y+1].y-t[y].y,f.x=p*1,f.y=-g,f.z=p*0,m.copy(f),f.x+=v.x,f.y+=v.y,f.z+=v.z,f.normalize(),c.push(f.x,f.y,f.z),v.copy(m)}for(let y=0;y<=e;y++){const M=n+y*h*r,_=Math.sin(M),w=Math.cos(M);for(let E=0;E<=t.length-1;E++){u.x=t[E].x*_,u.y=t[E].y,u.z=t[E].x*w,a.push(u.x,u.y,u.z),d.x=y/e,d.y=E/(t.length-1),o.push(d.x,d.y);const A=c[3*E+0]*_,R=c[3*E+1],x=c[3*E+0]*w;l.push(A,R,x)}}for(let y=0;y<e;y++)for(let M=0;M<t.length-1;M++){const _=M+y*t.length,w=_,E=_+t.length,A=_+t.length+1,R=_+1;s.push(w,E,R),s.push(A,R,E)}this.setIndex(s),this.setAttribute("position",new se(a,3)),this.setAttribute("uv",new se(o,2)),this.setAttribute("normal",new se(l,3))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new ms(t.points,t.segments,t.phiStart,t.phiLength)}}class Si extends Ee{constructor(t=1,e=1,n=1,r=1){super(),this.type="PlaneGeometry",this.parameters={width:t,height:e,widthSegments:n,heightSegments:r};const s=t/2,a=e/2,o=Math.floor(n),c=Math.floor(r),l=o+1,h=c+1,u=t/o,d=e/c,f=[],m=[],v=[],g=[];for(let p=0;p<h;p++){const y=p*d-a;for(let M=0;M<l;M++){const _=M*u-s;m.push(_,-y,0),v.push(0,0,1),g.push(M/o),g.push(1-p/c)}}for(let p=0;p<c;p++)for(let y=0;y<o;y++){const M=y+l*p,_=y+l*(p+1),w=y+1+l*(p+1),E=y+1+l*p;f.push(M,_,E),f.push(_,w,E)}this.setIndex(f),this.setAttribute("position",new se(m,3)),this.setAttribute("normal",new se(v,3)),this.setAttribute("uv",new se(g,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Si(t.width,t.height,t.widthSegments,t.heightSegments)}}class Vl extends Ee{constructor(t=.5,e=1,n=32,r=1,s=0,a=Math.PI*2){super(),this.type="RingGeometry",this.parameters={innerRadius:t,outerRadius:e,thetaSegments:n,phiSegments:r,thetaStart:s,thetaLength:a},n=Math.max(3,n),r=Math.max(1,r);const o=[],c=[],l=[],h=[];let u=t;const d=(e-t)/r,f=new N,m=new dt;for(let v=0;v<=r;v++){for(let g=0;g<=n;g++){const p=s+g/n*a;f.x=u*Math.cos(p),f.y=u*Math.sin(p),c.push(f.x,f.y,f.z),l.push(0,0,1),m.x=(f.x/e+1)/2,m.y=(f.y/e+1)/2,h.push(m.x,m.y)}u+=d}for(let v=0;v<r;v++){const g=v*(n+1);for(let p=0;p<n;p++){const y=p+g,M=y,_=y+n+1,w=y+n+2,E=y+1;o.push(M,_,E),o.push(_,w,E)}}this.setIndex(o),this.setAttribute("position",new se(c,3)),this.setAttribute("normal",new se(l,3)),this.setAttribute("uv",new se(h,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Vl(t.innerRadius,t.outerRadius,t.thetaSegments,t.phiSegments,t.thetaStart,t.thetaLength)}}class Ue extends Ee{constructor(t=1,e=32,n=16,r=0,s=Math.PI*2,a=0,o=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:t,widthSegments:e,heightSegments:n,phiStart:r,phiLength:s,thetaStart:a,thetaLength:o},e=Math.max(3,Math.floor(e)),n=Math.max(2,Math.floor(n));const c=Math.min(a+o,Math.PI);let l=0;const h=[],u=new N,d=new N,f=[],m=[],v=[],g=[];for(let p=0;p<=n;p++){const y=[],M=p/n;let _=0;p===0&&a===0?_=.5/e:p===n&&c===Math.PI&&(_=-.5/e);for(let w=0;w<=e;w++){const E=w/e;u.x=-t*Math.cos(r+E*s)*Math.sin(a+M*o),u.y=t*Math.cos(a+M*o),u.z=t*Math.sin(r+E*s)*Math.sin(a+M*o),m.push(u.x,u.y,u.z),d.copy(u).normalize(),v.push(d.x,d.y,d.z),g.push(E+_,1-M),y.push(l++)}h.push(y)}for(let p=0;p<n;p++)for(let y=0;y<e;y++){const M=h[p][y+1],_=h[p][y],w=h[p+1][y],E=h[p+1][y+1];(p!==0||a>0)&&f.push(M,_,E),(p!==n-1||c<Math.PI)&&f.push(_,w,E)}this.setIndex(f),this.setAttribute("position",new se(m,3)),this.setAttribute("normal",new se(v,3)),this.setAttribute("uv",new se(g,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Ue(t.radius,t.widthSegments,t.heightSegments,t.phiStart,t.phiLength,t.thetaStart,t.thetaLength)}}class rs extends Ee{constructor(t=1,e=.4,n=12,r=48,s=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:t,tube:e,radialSegments:n,tubularSegments:r,arc:s},n=Math.floor(n),r=Math.floor(r);const a=[],o=[],c=[],l=[],h=new N,u=new N,d=new N;for(let f=0;f<=n;f++)for(let m=0;m<=r;m++){const v=m/r*s,g=f/n*Math.PI*2;u.x=(t+e*Math.cos(g))*Math.cos(v),u.y=(t+e*Math.cos(g))*Math.sin(v),u.z=e*Math.sin(g),o.push(u.x,u.y,u.z),h.x=t*Math.cos(v),h.y=t*Math.sin(v),d.subVectors(u,h).normalize(),c.push(d.x,d.y,d.z),l.push(m/r),l.push(f/n)}for(let f=1;f<=n;f++)for(let m=1;m<=r;m++){const v=(r+1)*f+m-1,g=(r+1)*(f-1)+m-1,p=(r+1)*(f-1)+m,y=(r+1)*f+m;a.push(v,g,y),a.push(g,p,y)}this.setIndex(a),this.setAttribute("position",new se(o,3)),this.setAttribute("normal",new se(c,3)),this.setAttribute("uv",new se(l,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new rs(t.radius,t.tube,t.radialSegments,t.tubularSegments,t.arc)}}class vo extends Ee{constructor(t=new ed(new N(-1,-1,0),new N(-1,1,0),new N(1,1,0)),e=64,n=1,r=8,s=!1){super(),this.type="TubeGeometry",this.parameters={path:t,tubularSegments:e,radius:n,radialSegments:r,closed:s};const a=t.computeFrenetFrames(e,s);this.tangents=a.tangents,this.normals=a.normals,this.binormals=a.binormals;const o=new N,c=new N,l=new dt;let h=new N;const u=[],d=[],f=[],m=[];v(),this.setIndex(m),this.setAttribute("position",new se(u,3)),this.setAttribute("normal",new se(d,3)),this.setAttribute("uv",new se(f,2));function v(){for(let M=0;M<e;M++)g(M);g(s===!1?e:0),y(),p()}function g(M){h=t.getPointAt(M/e,h);const _=a.normals[M],w=a.binormals[M];for(let E=0;E<=r;E++){const A=E/r*Math.PI*2,R=Math.sin(A),x=-Math.cos(A);c.x=x*_.x+R*w.x,c.y=x*_.y+R*w.y,c.z=x*_.z+R*w.z,c.normalize(),d.push(c.x,c.y,c.z),o.x=h.x+n*c.x,o.y=h.y+n*c.y,o.z=h.z+n*c.z,u.push(o.x,o.y,o.z)}}function p(){for(let M=1;M<=e;M++)for(let _=1;_<=r;_++){const w=(r+1)*(M-1)+(_-1),E=(r+1)*M+(_-1),A=(r+1)*M+_,R=(r+1)*(M-1)+_;m.push(w,E,R),m.push(E,A,R)}}function y(){for(let M=0;M<=e;M++)for(let _=0;_<=r;_++)l.x=M/e,l.y=_/r,f.push(l.x,l.y)}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}toJSON(){const t=super.toJSON();return t.path=this.parameters.path.toJSON(),t}static fromJSON(t){return new vo(new ao[t.path.type]().fromJSON(t.path),t.tubularSegments,t.radius,t.radialSegments,t.closed)}}class Mi extends _s{constructor(t){super(),this.isMeshStandardMaterial=!0,this.type="MeshStandardMaterial",this.defines={STANDARD:""},this.color=new Ut(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Ut(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Of,this.normalScale=new dt(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new On,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.defines={STANDARD:""},this.color.copy(t.color),this.roughness=t.roughness,this.metalness=t.metalness,this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.emissive.copy(t.emissive),this.emissiveMap=t.emissiveMap,this.emissiveIntensity=t.emissiveIntensity,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.roughnessMap=t.roughnessMap,this.metalnessMap=t.metalnessMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.envMapIntensity=t.envMapIntensity,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.flatShading=t.flatShading,this.fog=t.fog,this}}class k1 extends _s{constructor(t){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=K0,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(t)}copy(t){return super.copy(t),this.depthPacking=t.depthPacking,this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this}}class z1 extends _s{constructor(t){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(t)}copy(t){return super.copy(t),this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this}}class Gl extends Ce{constructor(t,e=1){super(),this.isLight=!0,this.type="Light",this.color=new Ut(t),this.intensity=e}dispose(){}copy(t,e){return super.copy(t,e),this.color.copy(t.color),this.intensity=t.intensity,this}toJSON(t){const e=super.toJSON(t);return e.object.color=this.color.getHex(),e.object.intensity=this.intensity,this.groundColor!==void 0&&(e.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(e.object.distance=this.distance),this.angle!==void 0&&(e.object.angle=this.angle),this.decay!==void 0&&(e.object.decay=this.decay),this.penumbra!==void 0&&(e.object.penumbra=this.penumbra),this.shadow!==void 0&&(e.object.shadow=this.shadow.toJSON()),this.target!==void 0&&(e.object.target=this.target.uuid),e}}class H1 extends Gl{constructor(t,e,n){super(t,n),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(Ce.DEFAULT_UP),this.updateMatrix(),this.groundColor=new Ut(e)}copy(t,e){return super.copy(t,e),this.groundColor.copy(t.groundColor),this}}const Ko=new re,iu=new N,ru=new N;class cd{constructor(t){this.camera=t,this.intensity=1,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new dt(512,512),this.mapType=Yn,this.map=null,this.mapPass=null,this.matrix=new re,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new Ol,this._frameExtents=new dt(1,1),this._viewportCount=1,this._viewports=[new le(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(t){const e=this.camera,n=this.matrix;iu.setFromMatrixPosition(t.matrixWorld),e.position.copy(iu),ru.setFromMatrixPosition(t.target.matrixWorld),e.lookAt(ru),e.updateMatrixWorld(),Ko.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Ko,e.coordinateSystem,e.reversedDepth),e.reversedDepth?n.set(.5,0,0,.5,0,.5,0,.5,0,0,1,0,0,0,0,1):n.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),n.multiply(Ko)}getViewport(t){return this._viewports[t]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(t){return this.camera=t.camera.clone(),this.intensity=t.intensity,this.bias=t.bias,this.radius=t.radius,this.autoUpdate=t.autoUpdate,this.needsUpdate=t.needsUpdate,this.normalBias=t.normalBias,this.blurSamples=t.blurSamples,this.mapSize.copy(t.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){const t={};return this.intensity!==1&&(t.intensity=this.intensity),this.bias!==0&&(t.bias=this.bias),this.normalBias!==0&&(t.normalBias=this.normalBias),this.radius!==1&&(t.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(t.mapSize=this.mapSize.toArray()),t.camera=this.camera.toJSON(!1).object,delete t.camera.matrix,t}}class V1 extends cd{constructor(){super(new bn(50,1,.5,500)),this.isSpotLightShadow=!0,this.focus=1,this.aspect=1}updateMatrices(t){const e=this.camera,n=fs*2*t.angle*this.focus,r=this.mapSize.width/this.mapSize.height*this.aspect,s=t.distance||e.far;(n!==e.fov||r!==e.aspect||s!==e.far)&&(e.fov=n,e.aspect=r,e.far=s,e.updateProjectionMatrix()),super.updateMatrices(t)}copy(t){return super.copy(t),this.focus=t.focus,this}}class G1 extends Gl{constructor(t,e,n=0,r=Math.PI/3,s=0,a=2){super(t,e),this.isSpotLight=!0,this.type="SpotLight",this.position.copy(Ce.DEFAULT_UP),this.updateMatrix(),this.target=new Ce,this.distance=n,this.angle=r,this.penumbra=s,this.decay=a,this.map=null,this.shadow=new V1}get power(){return this.intensity*Math.PI}set power(t){this.intensity=t/Math.PI}dispose(){this.shadow.dispose()}copy(t,e){return super.copy(t,e),this.distance=t.distance,this.angle=t.angle,this.penumbra=t.penumbra,this.decay=t.decay,this.target=t.target.clone(),this.shadow=t.shadow.clone(),this}}class Wl extends Xf{constructor(t=-1,e=1,n=1,r=-1,s=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=t,this.right=e,this.top=n,this.bottom=r,this.near=s,this.far=a,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.left=t.left,this.right=t.right,this.top=t.top,this.bottom=t.bottom,this.near=t.near,this.far=t.far,this.zoom=t.zoom,this.view=t.view===null?null:Object.assign({},t.view),this}setViewOffset(t,e,n,r,s,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=r,this.view.width=s,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=(this.right-this.left)/(2*this.zoom),e=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,r=(this.top+this.bottom)/2;let s=n-t,a=n+t,o=r+e,c=r-e;if(this.view!==null&&this.view.enabled){const l=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;s+=l*this.view.offsetX,a=s+l*this.view.width,o-=h*this.view.offsetY,c=o-h*this.view.height}this.projectionMatrix.makeOrthographic(s,a,o,c,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.zoom=this.zoom,e.object.left=this.left,e.object.right=this.right,e.object.top=this.top,e.object.bottom=this.bottom,e.object.near=this.near,e.object.far=this.far,this.view!==null&&(e.object.view=Object.assign({},this.view)),e}}class W1 extends cd{constructor(){super(new Wl(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class ll extends Gl{constructor(t,e){super(t,e),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(Ce.DEFAULT_UP),this.updateMatrix(),this.target=new Ce,this.shadow=new W1}dispose(){this.shadow.dispose()}copy(t){return super.copy(t),this.target=t.target.clone(),this.shadow=t.shadow.clone(),this}}class X1 extends bn{constructor(t=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=t}}function su(i,t,e,n){const r=q1(n);switch(e){case If:return i*t;case Nf:return i*t/r.components*r.byteLength;case Cl:return i*t/r.components*r.byteLength;case Ff:return i*t*2/r.components*r.byteLength;case Ll:return i*t*2/r.components*r.byteLength;case Uf:return i*t*3/r.components*r.byteLength;case We:return i*t*4/r.components*r.byteLength;case Pl:return i*t*4/r.components*r.byteLength;case Ja:case Za:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*8;case Ka:case Qa:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*16;case Ic:case Nc:return Math.max(i,16)*Math.max(t,8)/4;case Dc:case Uc:return Math.max(i,8)*Math.max(t,8)/2;case Fc:case Oc:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*8;case Bc:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*16;case kc:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*16;case zc:return Math.floor((i+4)/5)*Math.floor((t+3)/4)*16;case Hc:return Math.floor((i+4)/5)*Math.floor((t+4)/5)*16;case Vc:return Math.floor((i+5)/6)*Math.floor((t+4)/5)*16;case Gc:return Math.floor((i+5)/6)*Math.floor((t+5)/6)*16;case Wc:return Math.floor((i+7)/8)*Math.floor((t+4)/5)*16;case Xc:return Math.floor((i+7)/8)*Math.floor((t+5)/6)*16;case qc:return Math.floor((i+7)/8)*Math.floor((t+7)/8)*16;case Yc:return Math.floor((i+9)/10)*Math.floor((t+4)/5)*16;case $c:return Math.floor((i+9)/10)*Math.floor((t+5)/6)*16;case jc:return Math.floor((i+9)/10)*Math.floor((t+7)/8)*16;case Jc:return Math.floor((i+9)/10)*Math.floor((t+9)/10)*16;case Zc:return Math.floor((i+11)/12)*Math.floor((t+9)/10)*16;case Kc:return Math.floor((i+11)/12)*Math.floor((t+11)/12)*16;case Qc:case tl:case el:return Math.ceil(i/4)*Math.ceil(t/4)*16;case nl:case il:return Math.ceil(i/4)*Math.ceil(t/4)*8;case rl:case sl:return Math.ceil(i/4)*Math.ceil(t/4)*16}throw new Error(`Unable to determine texture byte length for ${e} format.`)}function q1(i){switch(i){case Yn:case Cf:return{byteLength:1,components:1};case zs:case Lf:case Mr:return{byteLength:2,components:1};case Al:case Rl:return{byteLength:2,components:4};case mr:case Tl:case ri:return{byteLength:4,components:1};case Pf:case Df:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${i}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:El}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=El);/**
 * @license
 * Copyright 2010-2025 Three.js Authors
 * SPDX-License-Identifier: MIT
 */function ld(){let i=null,t=!1,e=null,n=null;function r(s,a){e(s,a),n=i.requestAnimationFrame(r)}return{start:function(){t!==!0&&e!==null&&(n=i.requestAnimationFrame(r),t=!0)},stop:function(){i.cancelAnimationFrame(n),t=!1},setAnimationLoop:function(s){e=s},setContext:function(s){i=s}}}function Y1(i){const t=new WeakMap;function e(o,c){const l=o.array,h=o.usage,u=l.byteLength,d=i.createBuffer();i.bindBuffer(c,d),i.bufferData(c,l,h),o.onUploadCallback();let f;if(l instanceof Float32Array)f=i.FLOAT;else if(typeof Float16Array<"u"&&l instanceof Float16Array)f=i.HALF_FLOAT;else if(l instanceof Uint16Array)o.isFloat16BufferAttribute?f=i.HALF_FLOAT:f=i.UNSIGNED_SHORT;else if(l instanceof Int16Array)f=i.SHORT;else if(l instanceof Uint32Array)f=i.UNSIGNED_INT;else if(l instanceof Int32Array)f=i.INT;else if(l instanceof Int8Array)f=i.BYTE;else if(l instanceof Uint8Array)f=i.UNSIGNED_BYTE;else if(l instanceof Uint8ClampedArray)f=i.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+l);return{buffer:d,type:f,bytesPerElement:l.BYTES_PER_ELEMENT,version:o.version,size:u}}function n(o,c,l){const h=c.array,u=c.updateRanges;if(i.bindBuffer(l,o),u.length===0)i.bufferSubData(l,0,h);else{u.sort((f,m)=>f.start-m.start);let d=0;for(let f=1;f<u.length;f++){const m=u[d],v=u[f];v.start<=m.start+m.count+1?m.count=Math.max(m.count,v.start+v.count-m.start):(++d,u[d]=v)}u.length=d+1;for(let f=0,m=u.length;f<m;f++){const v=u[f];i.bufferSubData(l,v.start*h.BYTES_PER_ELEMENT,h,v.start,v.count)}c.clearUpdateRanges()}c.onUploadCallback()}function r(o){return o.isInterleavedBufferAttribute&&(o=o.data),t.get(o)}function s(o){o.isInterleavedBufferAttribute&&(o=o.data);const c=t.get(o);c&&(i.deleteBuffer(c.buffer),t.delete(o))}function a(o,c){if(o.isInterleavedBufferAttribute&&(o=o.data),o.isGLBufferAttribute){const h=t.get(o);(!h||h.version<o.version)&&t.set(o,{buffer:o.buffer,type:o.type,bytesPerElement:o.elementSize,version:o.version});return}const l=t.get(o);if(l===void 0)t.set(o,e(o,c));else if(l.version<o.version){if(l.size!==o.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");n(l.buffer,o,c),l.version=o.version}}return{get:r,remove:s,update:a}}var $1=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,j1=`#ifdef USE_ALPHAHASH
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
#endif`,J1=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,Z1=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,K1=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,Q1=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,tm=`#ifdef USE_AOMAP
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
#endif`,em=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,nm=`#ifdef USE_BATCHING
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
#endif`,im=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,rm=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,sm=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,am=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,om=`#ifdef USE_IRIDESCENCE
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
#endif`,cm=`#ifdef USE_BUMPMAP
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
#endif`,lm=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,hm=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,um=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,fm=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,dm=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,pm=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,mm=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,gm=`#if defined( USE_COLOR_ALPHA )
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
#endif`,vm=`#define PI 3.141592653589793
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
} // validated`,xm=`#ifdef ENVMAP_TYPE_CUBE_UV
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
#endif`,_m=`vec3 transformedNormal = objectNormal;
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
#endif`,Mm=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,ym=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,bm=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,Sm=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,wm="gl_FragColor = linearToOutputTexel( gl_FragColor );",Em=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,Tm=`#ifdef USE_ENVMAP
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
#endif`,Am=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,Rm=`#ifdef USE_ENVMAP
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
#endif`,Cm=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,Lm=`#ifdef USE_ENVMAP
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
#endif`,Pm=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,Dm=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,Im=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,Um=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,Nm=`#ifdef USE_GRADIENTMAP
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
}`,Fm=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,Om=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,Bm=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,km=`uniform bool receiveShadow;
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
#endif`,zm=`#ifdef USE_ENVMAP
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
#endif`,Hm=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,Vm=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,Gm=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,Wm=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,Xm=`PhysicalMaterial material;
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
#endif`,qm=`struct PhysicalMaterial {
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
}`,Ym=`
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
#endif`,$m=`#if defined( RE_IndirectDiffuse )
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
#endif`,jm=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,Jm=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,Zm=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Km=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Qm=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,tg=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,eg=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,ng=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,ig=`#if defined( USE_POINTS_UV )
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
#endif`,rg=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,sg=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,ag=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,og=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,cg=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,lg=`#ifdef USE_MORPHTARGETS
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
#endif`,hg=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,ug=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 nonPerturbedNormal = normal;`,fg=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
#endif`,dg=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,pg=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,mg=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,gg=`#ifdef USE_NORMALMAP
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
#endif`,vg=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,xg=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,_g=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,Mg=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,yg=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,bg=`vec3 packNormalToRGB( const in vec3 normal ) {
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
}`,Sg=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,wg=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,Eg=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,Tg=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,Ag=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,Rg=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,Cg=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,Lg=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,Pg=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
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
#endif`,Dg=`float getShadowMask() {
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
}`,Ig=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,Ug=`#ifdef USE_SKINNING
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
#endif`,Ng=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,Fg=`#ifdef USE_SKINNING
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
#endif`,Og=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,Bg=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,kg=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,zg=`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,Hg=`#ifdef USE_TRANSMISSION
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
#endif`,Vg=`#ifdef USE_TRANSMISSION
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
#endif`,Gg=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,Wg=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,Xg=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,qg=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const Yg=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,$g=`uniform sampler2D t2D;
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
}`,jg=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Jg=`#ifdef ENVMAP_TYPE_CUBE
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
}`,Zg=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Kg=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Qg=`#include <common>
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
}`,tv=`#if DEPTH_PACKING == 3200
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
}`,ev=`#define DISTANCE
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
}`,nv=`#define DISTANCE
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
}`,iv=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,rv=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,sv=`uniform float scale;
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
}`,av=`uniform vec3 diffuse;
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
}`,ov=`#include <common>
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
}`,cv=`uniform vec3 diffuse;
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
}`,lv=`#define LAMBERT
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
}`,hv=`#define LAMBERT
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
}`,uv=`#define MATCAP
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
}`,fv=`#define MATCAP
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
}`,dv=`#define NORMAL
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
}`,pv=`#define NORMAL
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
}`,mv=`#define PHONG
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
}`,gv=`#define PHONG
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
}`,vv=`#define STANDARD
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
}`,xv=`#define STANDARD
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
}`,_v=`#define TOON
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
}`,Mv=`#define TOON
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
}`,yv=`uniform float size;
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
}`,bv=`uniform vec3 diffuse;
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
}`,Sv=`#include <common>
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
}`,wv=`uniform vec3 color;
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
}`,Ev=`uniform float rotation;
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
}`,Tv=`uniform vec3 diffuse;
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
}`,ee={alphahash_fragment:$1,alphahash_pars_fragment:j1,alphamap_fragment:J1,alphamap_pars_fragment:Z1,alphatest_fragment:K1,alphatest_pars_fragment:Q1,aomap_fragment:tm,aomap_pars_fragment:em,batching_pars_vertex:nm,batching_vertex:im,begin_vertex:rm,beginnormal_vertex:sm,bsdfs:am,iridescence_fragment:om,bumpmap_pars_fragment:cm,clipping_planes_fragment:lm,clipping_planes_pars_fragment:hm,clipping_planes_pars_vertex:um,clipping_planes_vertex:fm,color_fragment:dm,color_pars_fragment:pm,color_pars_vertex:mm,color_vertex:gm,common:vm,cube_uv_reflection_fragment:xm,defaultnormal_vertex:_m,displacementmap_pars_vertex:Mm,displacementmap_vertex:ym,emissivemap_fragment:bm,emissivemap_pars_fragment:Sm,colorspace_fragment:wm,colorspace_pars_fragment:Em,envmap_fragment:Tm,envmap_common_pars_fragment:Am,envmap_pars_fragment:Rm,envmap_pars_vertex:Cm,envmap_physical_pars_fragment:zm,envmap_vertex:Lm,fog_vertex:Pm,fog_pars_vertex:Dm,fog_fragment:Im,fog_pars_fragment:Um,gradientmap_pars_fragment:Nm,lightmap_pars_fragment:Fm,lights_lambert_fragment:Om,lights_lambert_pars_fragment:Bm,lights_pars_begin:km,lights_toon_fragment:Hm,lights_toon_pars_fragment:Vm,lights_phong_fragment:Gm,lights_phong_pars_fragment:Wm,lights_physical_fragment:Xm,lights_physical_pars_fragment:qm,lights_fragment_begin:Ym,lights_fragment_maps:$m,lights_fragment_end:jm,logdepthbuf_fragment:Jm,logdepthbuf_pars_fragment:Zm,logdepthbuf_pars_vertex:Km,logdepthbuf_vertex:Qm,map_fragment:tg,map_pars_fragment:eg,map_particle_fragment:ng,map_particle_pars_fragment:ig,metalnessmap_fragment:rg,metalnessmap_pars_fragment:sg,morphinstance_vertex:ag,morphcolor_vertex:og,morphnormal_vertex:cg,morphtarget_pars_vertex:lg,morphtarget_vertex:hg,normal_fragment_begin:ug,normal_fragment_maps:fg,normal_pars_fragment:dg,normal_pars_vertex:pg,normal_vertex:mg,normalmap_pars_fragment:gg,clearcoat_normal_fragment_begin:vg,clearcoat_normal_fragment_maps:xg,clearcoat_pars_fragment:_g,iridescence_pars_fragment:Mg,opaque_fragment:yg,packing:bg,premultiplied_alpha_fragment:Sg,project_vertex:wg,dithering_fragment:Eg,dithering_pars_fragment:Tg,roughnessmap_fragment:Ag,roughnessmap_pars_fragment:Rg,shadowmap_pars_fragment:Cg,shadowmap_pars_vertex:Lg,shadowmap_vertex:Pg,shadowmask_pars_fragment:Dg,skinbase_vertex:Ig,skinning_pars_vertex:Ug,skinning_vertex:Ng,skinnormal_vertex:Fg,specularmap_fragment:Og,specularmap_pars_fragment:Bg,tonemapping_fragment:kg,tonemapping_pars_fragment:zg,transmission_fragment:Hg,transmission_pars_fragment:Vg,uv_pars_fragment:Gg,uv_pars_vertex:Wg,uv_vertex:Xg,worldpos_vertex:qg,background_vert:Yg,background_frag:$g,backgroundCube_vert:jg,backgroundCube_frag:Jg,cube_vert:Zg,cube_frag:Kg,depth_vert:Qg,depth_frag:tv,distanceRGBA_vert:ev,distanceRGBA_frag:nv,equirect_vert:iv,equirect_frag:rv,linedashed_vert:sv,linedashed_frag:av,meshbasic_vert:ov,meshbasic_frag:cv,meshlambert_vert:lv,meshlambert_frag:hv,meshmatcap_vert:uv,meshmatcap_frag:fv,meshnormal_vert:dv,meshnormal_frag:pv,meshphong_vert:mv,meshphong_frag:gv,meshphysical_vert:vv,meshphysical_frag:xv,meshtoon_vert:_v,meshtoon_frag:Mv,points_vert:yv,points_frag:bv,shadow_vert:Sv,shadow_frag:wv,sprite_vert:Ev,sprite_frag:Tv},At={common:{diffuse:{value:new Ut(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new te},alphaMap:{value:null},alphaMapTransform:{value:new te},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new te}},envmap:{envMap:{value:null},envMapRotation:{value:new te},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new te}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new te}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new te},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new te},normalScale:{value:new dt(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new te},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new te}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new te}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new te}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Ut(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new Ut(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new te},alphaTest:{value:0},uvTransform:{value:new te}},sprite:{diffuse:{value:new Ut(16777215)},opacity:{value:1},center:{value:new dt(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new te},alphaMap:{value:null},alphaMapTransform:{value:new te},alphaTest:{value:0}}},ni={basic:{uniforms:tn([At.common,At.specularmap,At.envmap,At.aomap,At.lightmap,At.fog]),vertexShader:ee.meshbasic_vert,fragmentShader:ee.meshbasic_frag},lambert:{uniforms:tn([At.common,At.specularmap,At.envmap,At.aomap,At.lightmap,At.emissivemap,At.bumpmap,At.normalmap,At.displacementmap,At.fog,At.lights,{emissive:{value:new Ut(0)}}]),vertexShader:ee.meshlambert_vert,fragmentShader:ee.meshlambert_frag},phong:{uniforms:tn([At.common,At.specularmap,At.envmap,At.aomap,At.lightmap,At.emissivemap,At.bumpmap,At.normalmap,At.displacementmap,At.fog,At.lights,{emissive:{value:new Ut(0)},specular:{value:new Ut(1118481)},shininess:{value:30}}]),vertexShader:ee.meshphong_vert,fragmentShader:ee.meshphong_frag},standard:{uniforms:tn([At.common,At.envmap,At.aomap,At.lightmap,At.emissivemap,At.bumpmap,At.normalmap,At.displacementmap,At.roughnessmap,At.metalnessmap,At.fog,At.lights,{emissive:{value:new Ut(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:ee.meshphysical_vert,fragmentShader:ee.meshphysical_frag},toon:{uniforms:tn([At.common,At.aomap,At.lightmap,At.emissivemap,At.bumpmap,At.normalmap,At.displacementmap,At.gradientmap,At.fog,At.lights,{emissive:{value:new Ut(0)}}]),vertexShader:ee.meshtoon_vert,fragmentShader:ee.meshtoon_frag},matcap:{uniforms:tn([At.common,At.bumpmap,At.normalmap,At.displacementmap,At.fog,{matcap:{value:null}}]),vertexShader:ee.meshmatcap_vert,fragmentShader:ee.meshmatcap_frag},points:{uniforms:tn([At.points,At.fog]),vertexShader:ee.points_vert,fragmentShader:ee.points_frag},dashed:{uniforms:tn([At.common,At.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:ee.linedashed_vert,fragmentShader:ee.linedashed_frag},depth:{uniforms:tn([At.common,At.displacementmap]),vertexShader:ee.depth_vert,fragmentShader:ee.depth_frag},normal:{uniforms:tn([At.common,At.bumpmap,At.normalmap,At.displacementmap,{opacity:{value:1}}]),vertexShader:ee.meshnormal_vert,fragmentShader:ee.meshnormal_frag},sprite:{uniforms:tn([At.sprite,At.fog]),vertexShader:ee.sprite_vert,fragmentShader:ee.sprite_frag},background:{uniforms:{uvTransform:{value:new te},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:ee.background_vert,fragmentShader:ee.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new te}},vertexShader:ee.backgroundCube_vert,fragmentShader:ee.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:ee.cube_vert,fragmentShader:ee.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:ee.equirect_vert,fragmentShader:ee.equirect_frag},distanceRGBA:{uniforms:tn([At.common,At.displacementmap,{referencePosition:{value:new N},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:ee.distanceRGBA_vert,fragmentShader:ee.distanceRGBA_frag},shadow:{uniforms:tn([At.lights,At.fog,{color:{value:new Ut(0)},opacity:{value:1}}]),vertexShader:ee.shadow_vert,fragmentShader:ee.shadow_frag}};ni.physical={uniforms:tn([ni.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new te},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new te},clearcoatNormalScale:{value:new dt(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new te},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new te},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new te},sheen:{value:0},sheenColor:{value:new Ut(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new te},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new te},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new te},transmissionSamplerSize:{value:new dt},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new te},attenuationDistance:{value:0},attenuationColor:{value:new Ut(0)},specularColor:{value:new Ut(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new te},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new te},anisotropyVector:{value:new dt},anisotropyMap:{value:null},anisotropyMapTransform:{value:new te}}]),vertexShader:ee.meshphysical_vert,fragmentShader:ee.meshphysical_frag};const Fa={r:0,b:0,g:0},er=new On,Av=new re;function Rv(i,t,e,n,r,s,a){const o=new Ut(0);let c=s===!0?0:1,l,h,u=null,d=0,f=null;function m(M){let _=M.isScene===!0?M.background:null;return _&&_.isTexture&&(_=(M.backgroundBlurriness>0?e:t).get(_)),_}function v(M){let _=!1;const w=m(M);w===null?p(o,c):w&&w.isColor&&(p(w,1),_=!0);const E=i.xr.getEnvironmentBlendMode();E==="additive"?n.buffers.color.setClear(0,0,0,1,a):E==="alpha-blend"&&n.buffers.color.setClear(0,0,0,0,a),(i.autoClear||_)&&(n.buffers.depth.setTest(!0),n.buffers.depth.setMask(!0),n.buffers.color.setMask(!0),i.clear(i.autoClearColor,i.autoClearDepth,i.autoClearStencil))}function g(M,_){const w=m(_);w&&(w.isCubeTexture||w.mapping===go)?(h===void 0&&(h=new Dt(new Ve(1,1,1),new ke({name:"BackgroundCubeMaterial",uniforms:ds(ni.backgroundCube.uniforms),vertexShader:ni.backgroundCube.vertexShader,fragmentShader:ni.backgroundCube.fragmentShader,side:mn,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),h.geometry.deleteAttribute("normal"),h.geometry.deleteAttribute("uv"),h.onBeforeRender=function(E,A,R){this.matrixWorld.copyPosition(R.matrixWorld)},Object.defineProperty(h.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),r.update(h)),er.copy(_.backgroundRotation),er.x*=-1,er.y*=-1,er.z*=-1,w.isCubeTexture&&w.isRenderTargetTexture===!1&&(er.y*=-1,er.z*=-1),h.material.uniforms.envMap.value=w,h.material.uniforms.flipEnvMap.value=w.isCubeTexture&&w.isRenderTargetTexture===!1?-1:1,h.material.uniforms.backgroundBlurriness.value=_.backgroundBlurriness,h.material.uniforms.backgroundIntensity.value=_.backgroundIntensity,h.material.uniforms.backgroundRotation.value.setFromMatrix4(Av.makeRotationFromEuler(er)),h.material.toneMapped=ce.getTransfer(w.colorSpace)!==fe,(u!==w||d!==w.version||f!==i.toneMapping)&&(h.material.needsUpdate=!0,u=w,d=w.version,f=i.toneMapping),h.layers.enableAll(),M.unshift(h,h.geometry,h.material,0,0,null)):w&&w.isTexture&&(l===void 0&&(l=new Dt(new Si(2,2),new ke({name:"BackgroundMaterial",uniforms:ds(ni.background.uniforms),vertexShader:ni.background.vertexShader,fragmentShader:ni.background.fragmentShader,side:qi,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),l.geometry.deleteAttribute("normal"),Object.defineProperty(l.material,"map",{get:function(){return this.uniforms.t2D.value}}),r.update(l)),l.material.uniforms.t2D.value=w,l.material.uniforms.backgroundIntensity.value=_.backgroundIntensity,l.material.toneMapped=ce.getTransfer(w.colorSpace)!==fe,w.matrixAutoUpdate===!0&&w.updateMatrix(),l.material.uniforms.uvTransform.value.copy(w.matrix),(u!==w||d!==w.version||f!==i.toneMapping)&&(l.material.needsUpdate=!0,u=w,d=w.version,f=i.toneMapping),l.layers.enableAll(),M.unshift(l,l.geometry,l.material,0,0,null))}function p(M,_){M.getRGB(Fa,Wf(i)),n.buffers.color.setClear(Fa.r,Fa.g,Fa.b,_,a)}function y(){h!==void 0&&(h.geometry.dispose(),h.material.dispose(),h=void 0),l!==void 0&&(l.geometry.dispose(),l.material.dispose(),l=void 0)}return{getClearColor:function(){return o},setClearColor:function(M,_=1){o.set(M),c=_,p(o,c)},getClearAlpha:function(){return c},setClearAlpha:function(M){c=M,p(o,c)},render:v,addToRenderList:g,dispose:y}}function Cv(i,t){const e=i.getParameter(i.MAX_VERTEX_ATTRIBS),n={},r=d(null);let s=r,a=!1;function o(b,S,T,L,D){let U=!1;const B=u(L,T,S);s!==B&&(s=B,l(s.object)),U=f(b,L,T,D),U&&m(b,L,T,D),D!==null&&t.update(D,i.ELEMENT_ARRAY_BUFFER),(U||a)&&(a=!1,_(b,S,T,L),D!==null&&i.bindBuffer(i.ELEMENT_ARRAY_BUFFER,t.get(D).buffer))}function c(){return i.createVertexArray()}function l(b){return i.bindVertexArray(b)}function h(b){return i.deleteVertexArray(b)}function u(b,S,T){const L=T.wireframe===!0;let D=n[b.id];D===void 0&&(D={},n[b.id]=D);let U=D[S.id];U===void 0&&(U={},D[S.id]=U);let B=U[L];return B===void 0&&(B=d(c()),U[L]=B),B}function d(b){const S=[],T=[],L=[];for(let D=0;D<e;D++)S[D]=0,T[D]=0,L[D]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:S,enabledAttributes:T,attributeDivisors:L,object:b,attributes:{},index:null}}function f(b,S,T,L){const D=s.attributes,U=S.attributes;let B=0;const X=T.getAttributes();for(const H in X)if(X[H].location>=0){const ct=D[H];let ut=U[H];if(ut===void 0&&(H==="instanceMatrix"&&b.instanceMatrix&&(ut=b.instanceMatrix),H==="instanceColor"&&b.instanceColor&&(ut=b.instanceColor)),ct===void 0||ct.attribute!==ut||ut&&ct.data!==ut.data)return!0;B++}return s.attributesNum!==B||s.index!==L}function m(b,S,T,L){const D={},U=S.attributes;let B=0;const X=T.getAttributes();for(const H in X)if(X[H].location>=0){let ct=U[H];ct===void 0&&(H==="instanceMatrix"&&b.instanceMatrix&&(ct=b.instanceMatrix),H==="instanceColor"&&b.instanceColor&&(ct=b.instanceColor));const ut={};ut.attribute=ct,ct&&ct.data&&(ut.data=ct.data),D[H]=ut,B++}s.attributes=D,s.attributesNum=B,s.index=L}function v(){const b=s.newAttributes;for(let S=0,T=b.length;S<T;S++)b[S]=0}function g(b){p(b,0)}function p(b,S){const T=s.newAttributes,L=s.enabledAttributes,D=s.attributeDivisors;T[b]=1,L[b]===0&&(i.enableVertexAttribArray(b),L[b]=1),D[b]!==S&&(i.vertexAttribDivisor(b,S),D[b]=S)}function y(){const b=s.newAttributes,S=s.enabledAttributes;for(let T=0,L=S.length;T<L;T++)S[T]!==b[T]&&(i.disableVertexAttribArray(T),S[T]=0)}function M(b,S,T,L,D,U,B){B===!0?i.vertexAttribIPointer(b,S,T,D,U):i.vertexAttribPointer(b,S,T,L,D,U)}function _(b,S,T,L){v();const D=L.attributes,U=T.getAttributes(),B=S.defaultAttributeValues;for(const X in U){const H=U[X];if(H.location>=0){let Q=D[X];if(Q===void 0&&(X==="instanceMatrix"&&b.instanceMatrix&&(Q=b.instanceMatrix),X==="instanceColor"&&b.instanceColor&&(Q=b.instanceColor)),Q!==void 0){const ct=Q.normalized,ut=Q.itemSize,vt=t.get(Q);if(vt===void 0)continue;const Et=vt.buffer,Nt=vt.type,lt=vt.bytesPerElement,G=Nt===i.INT||Nt===i.UNSIGNED_INT||Q.gpuType===Tl;if(Q.isInterleavedBufferAttribute){const J=Q.data,z=J.stride,W=Q.offset;if(J.isInstancedInterleavedBuffer){for(let k=0;k<H.locationSize;k++)p(H.location+k,J.meshPerAttribute);b.isInstancedMesh!==!0&&L._maxInstanceCount===void 0&&(L._maxInstanceCount=J.meshPerAttribute*J.count)}else for(let k=0;k<H.locationSize;k++)g(H.location+k);i.bindBuffer(i.ARRAY_BUFFER,Et);for(let k=0;k<H.locationSize;k++)M(H.location+k,ut/H.locationSize,Nt,ct,z*lt,(W+ut/H.locationSize*k)*lt,G)}else{if(Q.isInstancedBufferAttribute){for(let J=0;J<H.locationSize;J++)p(H.location+J,Q.meshPerAttribute);b.isInstancedMesh!==!0&&L._maxInstanceCount===void 0&&(L._maxInstanceCount=Q.meshPerAttribute*Q.count)}else for(let J=0;J<H.locationSize;J++)g(H.location+J);i.bindBuffer(i.ARRAY_BUFFER,Et);for(let J=0;J<H.locationSize;J++)M(H.location+J,ut/H.locationSize,Nt,ct,ut*lt,ut/H.locationSize*J*lt,G)}}else if(B!==void 0){const ct=B[X];if(ct!==void 0)switch(ct.length){case 2:i.vertexAttrib2fv(H.location,ct);break;case 3:i.vertexAttrib3fv(H.location,ct);break;case 4:i.vertexAttrib4fv(H.location,ct);break;default:i.vertexAttrib1fv(H.location,ct)}}}}y()}function w(){R();for(const b in n){const S=n[b];for(const T in S){const L=S[T];for(const D in L)h(L[D].object),delete L[D];delete S[T]}delete n[b]}}function E(b){if(n[b.id]===void 0)return;const S=n[b.id];for(const T in S){const L=S[T];for(const D in L)h(L[D].object),delete L[D];delete S[T]}delete n[b.id]}function A(b){for(const S in n){const T=n[S];if(T[b.id]===void 0)continue;const L=T[b.id];for(const D in L)h(L[D].object),delete L[D];delete T[b.id]}}function R(){x(),a=!0,s!==r&&(s=r,l(s.object))}function x(){r.geometry=null,r.program=null,r.wireframe=!1}return{setup:o,reset:R,resetDefaultState:x,dispose:w,releaseStatesOfGeometry:E,releaseStatesOfProgram:A,initAttributes:v,enableAttribute:g,disableUnusedAttributes:y}}function Lv(i,t,e){let n;function r(l){n=l}function s(l,h){i.drawArrays(n,l,h),e.update(h,n,1)}function a(l,h,u){u!==0&&(i.drawArraysInstanced(n,l,h,u),e.update(h,n,u))}function o(l,h,u){if(u===0)return;t.get("WEBGL_multi_draw").multiDrawArraysWEBGL(n,l,0,h,0,u);let f=0;for(let m=0;m<u;m++)f+=h[m];e.update(f,n,1)}function c(l,h,u,d){if(u===0)return;const f=t.get("WEBGL_multi_draw");if(f===null)for(let m=0;m<l.length;m++)a(l[m],h[m],d[m]);else{f.multiDrawArraysInstancedWEBGL(n,l,0,h,0,d,0,u);let m=0;for(let v=0;v<u;v++)m+=h[v]*d[v];e.update(m,n,1)}}this.setMode=r,this.render=s,this.renderInstances=a,this.renderMultiDraw=o,this.renderMultiDrawInstances=c}function Pv(i,t,e,n){let r;function s(){if(r!==void 0)return r;if(t.has("EXT_texture_filter_anisotropic")===!0){const A=t.get("EXT_texture_filter_anisotropic");r=i.getParameter(A.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else r=0;return r}function a(A){return!(A!==We&&n.convert(A)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_FORMAT))}function o(A){const R=A===Mr&&(t.has("EXT_color_buffer_half_float")||t.has("EXT_color_buffer_float"));return!(A!==Yn&&n.convert(A)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_TYPE)&&A!==ri&&!R)}function c(A){if(A==="highp"){if(i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.HIGH_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.HIGH_FLOAT).precision>0)return"highp";A="mediump"}return A==="mediump"&&i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.MEDIUM_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let l=e.precision!==void 0?e.precision:"highp";const h=c(l);h!==l&&(console.warn("THREE.WebGLRenderer:",l,"not supported, using",h,"instead."),l=h);const u=e.logarithmicDepthBuffer===!0,d=e.reversedDepthBuffer===!0&&t.has("EXT_clip_control"),f=i.getParameter(i.MAX_TEXTURE_IMAGE_UNITS),m=i.getParameter(i.MAX_VERTEX_TEXTURE_IMAGE_UNITS),v=i.getParameter(i.MAX_TEXTURE_SIZE),g=i.getParameter(i.MAX_CUBE_MAP_TEXTURE_SIZE),p=i.getParameter(i.MAX_VERTEX_ATTRIBS),y=i.getParameter(i.MAX_VERTEX_UNIFORM_VECTORS),M=i.getParameter(i.MAX_VARYING_VECTORS),_=i.getParameter(i.MAX_FRAGMENT_UNIFORM_VECTORS),w=m>0,E=i.getParameter(i.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:s,getMaxPrecision:c,textureFormatReadable:a,textureTypeReadable:o,precision:l,logarithmicDepthBuffer:u,reversedDepthBuffer:d,maxTextures:f,maxVertexTextures:m,maxTextureSize:v,maxCubemapSize:g,maxAttributes:p,maxVertexUniforms:y,maxVaryings:M,maxFragmentUniforms:_,vertexTextures:w,maxSamples:E}}function Dv(i){const t=this;let e=null,n=0,r=!1,s=!1;const a=new rr,o=new te,c={value:null,needsUpdate:!1};this.uniform=c,this.numPlanes=0,this.numIntersection=0,this.init=function(u,d){const f=u.length!==0||d||n!==0||r;return r=d,n=u.length,f},this.beginShadows=function(){s=!0,h(null)},this.endShadows=function(){s=!1},this.setGlobalState=function(u,d){e=h(u,d,0)},this.setState=function(u,d,f){const m=u.clippingPlanes,v=u.clipIntersection,g=u.clipShadows,p=i.get(u);if(!r||m===null||m.length===0||s&&!g)s?h(null):l();else{const y=s?0:n,M=y*4;let _=p.clippingState||null;c.value=_,_=h(m,d,M,f);for(let w=0;w!==M;++w)_[w]=e[w];p.clippingState=_,this.numIntersection=v?this.numPlanes:0,this.numPlanes+=y}};function l(){c.value!==e&&(c.value=e,c.needsUpdate=n>0),t.numPlanes=n,t.numIntersection=0}function h(u,d,f,m){const v=u!==null?u.length:0;let g=null;if(v!==0){if(g=c.value,m!==!0||g===null){const p=f+v*4,y=d.matrixWorldInverse;o.getNormalMatrix(y),(g===null||g.length<p)&&(g=new Float32Array(p));for(let M=0,_=f;M!==v;++M,_+=4)a.copy(u[M]).applyMatrix4(y,o),a.normal.toArray(g,_),g[_+3]=a.constant}c.value=g,c.needsUpdate=!0}return t.numPlanes=v,t.numIntersection=0,g}}function Iv(i){let t=new WeakMap;function e(a,o){return o===no?a.mapping=ls:o===Lc&&(a.mapping=hs),a}function n(a){if(a&&a.isTexture){const o=a.mapping;if(o===no||o===Lc)if(t.has(a)){const c=t.get(a).texture;return e(c,a.mapping)}else{const c=a.image;if(c&&c.height>0){const l=new Kp(c.height);return l.fromEquirectangularTexture(i,a),t.set(a,l),a.addEventListener("dispose",r),e(l.texture,a.mapping)}else return null}}return a}function r(a){const o=a.target;o.removeEventListener("dispose",r);const c=t.get(o);c!==void 0&&(t.delete(o),c.dispose())}function s(){t=new WeakMap}return{get:n,dispose:s}}const Zr=4,au=[.125,.215,.35,.446,.526,.582],or=20,Qo=new Wl,ou=new Ut;let tc=null,ec=0,nc=0,ic=!1;const sr=(1+Math.sqrt(5))/2,Br=1/sr,cu=[new N(-sr,Br,0),new N(sr,Br,0),new N(-Br,0,sr),new N(Br,0,sr),new N(0,sr,-Br),new N(0,sr,Br),new N(-1,1,-1),new N(1,1,-1),new N(-1,1,1),new N(1,1,1)],Uv=new N;class hl{constructor(t){this._renderer=t,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(t,e=0,n=.1,r=100,s={}){const{size:a=256,position:o=Uv}=s;tc=this._renderer.getRenderTarget(),ec=this._renderer.getActiveCubeFace(),nc=this._renderer.getActiveMipmapLevel(),ic=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(a);const c=this._allocateTargets();return c.depthBuffer=!0,this._sceneToCubeUV(t,n,r,c,o),e>0&&this._blur(c,0,0,e),this._applyPMREM(c),this._cleanup(c),c}fromEquirectangular(t,e=null){return this._fromTexture(t,e)}fromCubemap(t,e=null){return this._fromTexture(t,e)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=uu(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=hu(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(t){this._lodMax=Math.floor(Math.log2(t)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let t=0;t<this._lodPlanes.length;t++)this._lodPlanes[t].dispose()}_cleanup(t){this._renderer.setRenderTarget(tc,ec,nc),this._renderer.xr.enabled=ic,t.scissorTest=!1,Oa(t,0,0,t.width,t.height)}_fromTexture(t,e){t.mapping===ls||t.mapping===hs?this._setSize(t.image.length===0?16:t.image[0].width||t.image[0].image.width):this._setSize(t.image.width/4),tc=this._renderer.getRenderTarget(),ec=this._renderer.getActiveCubeFace(),nc=this._renderer.getActiveMipmapLevel(),ic=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const n=e||this._allocateTargets();return this._textureToCubeUV(t,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){const t=3*Math.max(this._cubeSize,112),e=4*this._cubeSize,n={magFilter:xe,minFilter:xe,generateMipmaps:!1,type:Mr,format:We,colorSpace:gr,depthBuffer:!1},r=lu(t,e,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==t||this._pingPongRenderTarget.height!==e){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=lu(t,e,n);const{_lodMax:s}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=Nv(s)),this._blurMaterial=Fv(s,t,e)}return r}_compileMaterial(t){const e=new Dt(this._lodPlanes[0],t);this._renderer.compile(e,Qo)}_sceneToCubeUV(t,e,n,r,s){const c=new bn(90,1,e,n),l=[1,-1,1,1,1,1],h=[1,1,1,-1,-1,-1],u=this._renderer,d=u.autoClear,f=u.toneMapping;u.getClearColor(ou),u.toneMapping=Gi,u.autoClear=!1,u.state.buffers.depth.getReversed()&&(u.setRenderTarget(r),u.clearDepth(),u.setRenderTarget(null));const v=new $i({name:"PMREM.Background",side:mn,depthWrite:!1,depthTest:!1}),g=new Dt(new Ve,v);let p=!1;const y=t.background;y?y.isColor&&(v.color.copy(y),t.background=null,p=!0):(v.color.copy(ou),p=!0);for(let M=0;M<6;M++){const _=M%3;_===0?(c.up.set(0,l[M],0),c.position.set(s.x,s.y,s.z),c.lookAt(s.x+h[M],s.y,s.z)):_===1?(c.up.set(0,0,l[M]),c.position.set(s.x,s.y,s.z),c.lookAt(s.x,s.y+h[M],s.z)):(c.up.set(0,l[M],0),c.position.set(s.x,s.y,s.z),c.lookAt(s.x,s.y,s.z+h[M]));const w=this._cubeSize;Oa(r,_*w,M>2?w:0,w,w),u.setRenderTarget(r),p&&u.render(g,c),u.render(t,c)}g.geometry.dispose(),g.material.dispose(),u.toneMapping=f,u.autoClear=d,t.background=y}_textureToCubeUV(t,e){const n=this._renderer,r=t.mapping===ls||t.mapping===hs;r?(this._cubemapMaterial===null&&(this._cubemapMaterial=uu()),this._cubemapMaterial.uniforms.flipEnvMap.value=t.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=hu());const s=r?this._cubemapMaterial:this._equirectMaterial,a=new Dt(this._lodPlanes[0],s),o=s.uniforms;o.envMap.value=t;const c=this._cubeSize;Oa(e,0,0,3*c,2*c),n.setRenderTarget(e),n.render(a,Qo)}_applyPMREM(t){const e=this._renderer,n=e.autoClear;e.autoClear=!1;const r=this._lodPlanes.length;for(let s=1;s<r;s++){const a=Math.sqrt(this._sigmas[s]*this._sigmas[s]-this._sigmas[s-1]*this._sigmas[s-1]),o=cu[(r-s-1)%cu.length];this._blur(t,s-1,s,a,o)}e.autoClear=n}_blur(t,e,n,r,s){const a=this._pingPongRenderTarget;this._halfBlur(t,a,e,n,r,"latitudinal",s),this._halfBlur(a,t,n,n,r,"longitudinal",s)}_halfBlur(t,e,n,r,s,a,o){const c=this._renderer,l=this._blurMaterial;a!=="latitudinal"&&a!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const h=3,u=new Dt(this._lodPlanes[r],l),d=l.uniforms,f=this._sizeLods[n]-1,m=isFinite(s)?Math.PI/(2*f):2*Math.PI/(2*or-1),v=s/m,g=isFinite(s)?1+Math.floor(h*v):or;g>or&&console.warn(`sigmaRadians, ${s}, is too large and will clip, as it requested ${g} samples when the maximum is set to ${or}`);const p=[];let y=0;for(let A=0;A<or;++A){const R=A/v,x=Math.exp(-R*R/2);p.push(x),A===0?y+=x:A<g&&(y+=2*x)}for(let A=0;A<p.length;A++)p[A]=p[A]/y;d.envMap.value=t.texture,d.samples.value=g,d.weights.value=p,d.latitudinal.value=a==="latitudinal",o&&(d.poleAxis.value=o);const{_lodMax:M}=this;d.dTheta.value=m,d.mipInt.value=M-n;const _=this._sizeLods[r],w=3*_*(r>M-Zr?r-M+Zr:0),E=4*(this._cubeSize-_);Oa(e,w,E,3*_,2*_),c.setRenderTarget(e),c.render(u,Qo)}}function Nv(i){const t=[],e=[],n=[];let r=i;const s=i-Zr+1+au.length;for(let a=0;a<s;a++){const o=Math.pow(2,r);e.push(o);let c=1/o;a>i-Zr?c=au[a-i+Zr-1]:a===0&&(c=0),n.push(c);const l=1/(o-2),h=-l,u=1+l,d=[h,h,u,h,u,u,h,h,u,u,h,u],f=6,m=6,v=3,g=2,p=1,y=new Float32Array(v*m*f),M=new Float32Array(g*m*f),_=new Float32Array(p*m*f);for(let E=0;E<f;E++){const A=E%3*2/3-1,R=E>2?0:-1,x=[A,R,0,A+2/3,R,0,A+2/3,R+1,0,A,R,0,A+2/3,R+1,0,A,R+1,0];y.set(x,v*m*E),M.set(d,g*m*E);const b=[E,E,E,E,E,E];_.set(b,p*m*E)}const w=new Ee;w.setAttribute("position",new ae(y,v)),w.setAttribute("uv",new ae(M,g)),w.setAttribute("faceIndex",new ae(_,p)),t.push(w),r>Zr&&r--}return{lodPlanes:t,sizeLods:e,sigmas:n}}function lu(i,t,e){const n=new rn(i,t,e);return n.texture.mapping=go,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function Oa(i,t,e,n,r){i.viewport.set(t,e,n,r),i.scissor.set(t,e,n,r)}function Fv(i,t,e){const n=new Float32Array(or),r=new N(0,1,0);return new ke({name:"SphericalGaussianBlur",defines:{n:or,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/e,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:n},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:r}},vertexShader:Xl(),fragmentShader:`

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
		`,blending:Vi,depthTest:!1,depthWrite:!1})}function hu(){return new ke({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:Xl(),fragmentShader:`

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
		`,blending:Vi,depthTest:!1,depthWrite:!1})}function uu(){return new ke({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:Xl(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:Vi,depthTest:!1,depthWrite:!1})}function Xl(){return`

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
	`}function Ov(i){let t=new WeakMap,e=null;function n(o){if(o&&o.isTexture){const c=o.mapping,l=c===no||c===Lc,h=c===ls||c===hs;if(l||h){let u=t.get(o);const d=u!==void 0?u.texture.pmremVersion:0;if(o.isRenderTargetTexture&&o.pmremVersion!==d)return e===null&&(e=new hl(i)),u=l?e.fromEquirectangular(o,u):e.fromCubemap(o,u),u.texture.pmremVersion=o.pmremVersion,t.set(o,u),u.texture;if(u!==void 0)return u.texture;{const f=o.image;return l&&f&&f.height>0||h&&f&&r(f)?(e===null&&(e=new hl(i)),u=l?e.fromEquirectangular(o):e.fromCubemap(o),u.texture.pmremVersion=o.pmremVersion,t.set(o,u),o.addEventListener("dispose",s),u.texture):null}}}return o}function r(o){let c=0;const l=6;for(let h=0;h<l;h++)o[h]!==void 0&&c++;return c===l}function s(o){const c=o.target;c.removeEventListener("dispose",s);const l=t.get(c);l!==void 0&&(t.delete(c),l.dispose())}function a(){t=new WeakMap,e!==null&&(e.dispose(),e=null)}return{get:n,dispose:a}}function Bv(i){const t={};function e(n){if(t[n]!==void 0)return t[n];let r;switch(n){case"WEBGL_depth_texture":r=i.getExtension("WEBGL_depth_texture")||i.getExtension("MOZ_WEBGL_depth_texture")||i.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":r=i.getExtension("EXT_texture_filter_anisotropic")||i.getExtension("MOZ_EXT_texture_filter_anisotropic")||i.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":r=i.getExtension("WEBGL_compressed_texture_s3tc")||i.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":r=i.getExtension("WEBGL_compressed_texture_pvrtc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:r=i.getExtension(n)}return t[n]=r,r}return{has:function(n){return e(n)!==null},init:function(){e("EXT_color_buffer_float"),e("WEBGL_clip_cull_distance"),e("OES_texture_float_linear"),e("EXT_color_buffer_half_float"),e("WEBGL_multisampled_render_to_texture"),e("WEBGL_render_shared_exponent")},get:function(n){const r=e(n);return r===null&&Ws("THREE.WebGLRenderer: "+n+" extension not supported."),r}}}function kv(i,t,e,n){const r={},s=new WeakMap;function a(u){const d=u.target;d.index!==null&&t.remove(d.index);for(const m in d.attributes)t.remove(d.attributes[m]);d.removeEventListener("dispose",a),delete r[d.id];const f=s.get(d);f&&(t.remove(f),s.delete(d)),n.releaseStatesOfGeometry(d),d.isInstancedBufferGeometry===!0&&delete d._maxInstanceCount,e.memory.geometries--}function o(u,d){return r[d.id]===!0||(d.addEventListener("dispose",a),r[d.id]=!0,e.memory.geometries++),d}function c(u){const d=u.attributes;for(const f in d)t.update(d[f],i.ARRAY_BUFFER)}function l(u){const d=[],f=u.index,m=u.attributes.position;let v=0;if(f!==null){const y=f.array;v=f.version;for(let M=0,_=y.length;M<_;M+=3){const w=y[M+0],E=y[M+1],A=y[M+2];d.push(w,E,E,A,A,w)}}else if(m!==void 0){const y=m.array;v=m.version;for(let M=0,_=y.length/3-1;M<_;M+=3){const w=M+0,E=M+1,A=M+2;d.push(w,E,E,A,A,w)}}else return;const g=new(kf(d)?Gf:Vf)(d,1);g.version=v;const p=s.get(u);p&&t.remove(p),s.set(u,g)}function h(u){const d=s.get(u);if(d){const f=u.index;f!==null&&d.version<f.version&&l(u)}else l(u);return s.get(u)}return{get:o,update:c,getWireframeAttribute:h}}function zv(i,t,e){let n;function r(d){n=d}let s,a;function o(d){s=d.type,a=d.bytesPerElement}function c(d,f){i.drawElements(n,f,s,d*a),e.update(f,n,1)}function l(d,f,m){m!==0&&(i.drawElementsInstanced(n,f,s,d*a,m),e.update(f,n,m))}function h(d,f,m){if(m===0)return;t.get("WEBGL_multi_draw").multiDrawElementsWEBGL(n,f,0,s,d,0,m);let g=0;for(let p=0;p<m;p++)g+=f[p];e.update(g,n,1)}function u(d,f,m,v){if(m===0)return;const g=t.get("WEBGL_multi_draw");if(g===null)for(let p=0;p<d.length;p++)l(d[p]/a,f[p],v[p]);else{g.multiDrawElementsInstancedWEBGL(n,f,0,s,d,0,v,0,m);let p=0;for(let y=0;y<m;y++)p+=f[y]*v[y];e.update(p,n,1)}}this.setMode=r,this.setIndex=o,this.render=c,this.renderInstances=l,this.renderMultiDraw=h,this.renderMultiDrawInstances=u}function Hv(i){const t={geometries:0,textures:0},e={frame:0,calls:0,triangles:0,points:0,lines:0};function n(s,a,o){switch(e.calls++,a){case i.TRIANGLES:e.triangles+=o*(s/3);break;case i.LINES:e.lines+=o*(s/2);break;case i.LINE_STRIP:e.lines+=o*(s-1);break;case i.LINE_LOOP:e.lines+=o*s;break;case i.POINTS:e.points+=o*s;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",a);break}}function r(){e.calls=0,e.triangles=0,e.points=0,e.lines=0}return{memory:t,render:e,programs:null,autoReset:!0,reset:r,update:n}}function Vv(i,t,e){const n=new WeakMap,r=new le;function s(a,o,c){const l=a.morphTargetInfluences,h=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,u=h!==void 0?h.length:0;let d=n.get(o);if(d===void 0||d.count!==u){let x=function(){A.dispose(),n.delete(o),o.removeEventListener("dispose",x)};d!==void 0&&d.texture.dispose();const f=o.morphAttributes.position!==void 0,m=o.morphAttributes.normal!==void 0,v=o.morphAttributes.color!==void 0,g=o.morphAttributes.position||[],p=o.morphAttributes.normal||[],y=o.morphAttributes.color||[];let M=0;f===!0&&(M=1),m===!0&&(M=2),v===!0&&(M=3);let _=o.attributes.position.count*M,w=1;_>t.maxTextureSize&&(w=Math.ceil(_/t.maxTextureSize),_=t.maxTextureSize);const E=new Float32Array(_*w*4*u),A=new Ul(E,_,w,u);A.type=ri,A.needsUpdate=!0;const R=M*4;for(let b=0;b<u;b++){const S=g[b],T=p[b],L=y[b],D=_*w*4*b;for(let U=0;U<S.count;U++){const B=U*R;f===!0&&(r.fromBufferAttribute(S,U),E[D+B+0]=r.x,E[D+B+1]=r.y,E[D+B+2]=r.z,E[D+B+3]=0),m===!0&&(r.fromBufferAttribute(T,U),E[D+B+4]=r.x,E[D+B+5]=r.y,E[D+B+6]=r.z,E[D+B+7]=0),v===!0&&(r.fromBufferAttribute(L,U),E[D+B+8]=r.x,E[D+B+9]=r.y,E[D+B+10]=r.z,E[D+B+11]=L.itemSize===4?r.w:1)}}d={count:u,texture:A,size:new dt(_,w)},n.set(o,d),o.addEventListener("dispose",x)}if(a.isInstancedMesh===!0&&a.morphTexture!==null)c.getUniforms().setValue(i,"morphTexture",a.morphTexture,e);else{let f=0;for(let v=0;v<l.length;v++)f+=l[v];const m=o.morphTargetsRelative?1:1-f;c.getUniforms().setValue(i,"morphTargetBaseInfluence",m),c.getUniforms().setValue(i,"morphTargetInfluences",l)}c.getUniforms().setValue(i,"morphTargetsTexture",d.texture,e),c.getUniforms().setValue(i,"morphTargetsTextureSize",d.size)}return{update:s}}function Gv(i,t,e,n){let r=new WeakMap;function s(c){const l=n.render.frame,h=c.geometry,u=t.get(c,h);if(r.get(u)!==l&&(t.update(u),r.set(u,l)),c.isInstancedMesh&&(c.hasEventListener("dispose",o)===!1&&c.addEventListener("dispose",o),r.get(c)!==l&&(e.update(c.instanceMatrix,i.ARRAY_BUFFER),c.instanceColor!==null&&e.update(c.instanceColor,i.ARRAY_BUFFER),r.set(c,l))),c.isSkinnedMesh){const d=c.skeleton;r.get(d)!==l&&(d.update(),r.set(d,l))}return u}function a(){r=new WeakMap}function o(c){const l=c.target;l.removeEventListener("dispose",o),e.remove(l.instanceMatrix),l.instanceColor!==null&&e.remove(l.instanceColor)}return{update:s,dispose:a}}const hd=new Xe,fu=new Jf(1,1),ud=new Ul,fd=new Dp,dd=new qf,du=[],pu=[],mu=new Float32Array(16),gu=new Float32Array(9),vu=new Float32Array(4);function ys(i,t,e){const n=i[0];if(n<=0||n>0)return i;const r=t*e;let s=du[r];if(s===void 0&&(s=new Float32Array(r),du[r]=s),t!==0){n.toArray(s,0);for(let a=1,o=0;a!==t;++a)o+=e,i[a].toArray(s,o)}return s}function Ne(i,t){if(i.length!==t.length)return!1;for(let e=0,n=i.length;e<n;e++)if(i[e]!==t[e])return!1;return!0}function Fe(i,t){for(let e=0,n=t.length;e<n;e++)i[e]=t[e]}function xo(i,t){let e=pu[t];e===void 0&&(e=new Int32Array(t),pu[t]=e);for(let n=0;n!==t;++n)e[n]=i.allocateTextureUnit();return e}function Wv(i,t){const e=this.cache;e[0]!==t&&(i.uniform1f(this.addr,t),e[0]=t)}function Xv(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2f(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Ne(e,t))return;i.uniform2fv(this.addr,t),Fe(e,t)}}function qv(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3f(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else if(t.r!==void 0)(e[0]!==t.r||e[1]!==t.g||e[2]!==t.b)&&(i.uniform3f(this.addr,t.r,t.g,t.b),e[0]=t.r,e[1]=t.g,e[2]=t.b);else{if(Ne(e,t))return;i.uniform3fv(this.addr,t),Fe(e,t)}}function Yv(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4f(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Ne(e,t))return;i.uniform4fv(this.addr,t),Fe(e,t)}}function $v(i,t){const e=this.cache,n=t.elements;if(n===void 0){if(Ne(e,t))return;i.uniformMatrix2fv(this.addr,!1,t),Fe(e,t)}else{if(Ne(e,n))return;vu.set(n),i.uniformMatrix2fv(this.addr,!1,vu),Fe(e,n)}}function jv(i,t){const e=this.cache,n=t.elements;if(n===void 0){if(Ne(e,t))return;i.uniformMatrix3fv(this.addr,!1,t),Fe(e,t)}else{if(Ne(e,n))return;gu.set(n),i.uniformMatrix3fv(this.addr,!1,gu),Fe(e,n)}}function Jv(i,t){const e=this.cache,n=t.elements;if(n===void 0){if(Ne(e,t))return;i.uniformMatrix4fv(this.addr,!1,t),Fe(e,t)}else{if(Ne(e,n))return;mu.set(n),i.uniformMatrix4fv(this.addr,!1,mu),Fe(e,n)}}function Zv(i,t){const e=this.cache;e[0]!==t&&(i.uniform1i(this.addr,t),e[0]=t)}function Kv(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2i(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Ne(e,t))return;i.uniform2iv(this.addr,t),Fe(e,t)}}function Qv(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3i(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(Ne(e,t))return;i.uniform3iv(this.addr,t),Fe(e,t)}}function tx(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4i(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Ne(e,t))return;i.uniform4iv(this.addr,t),Fe(e,t)}}function ex(i,t){const e=this.cache;e[0]!==t&&(i.uniform1ui(this.addr,t),e[0]=t)}function nx(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2ui(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Ne(e,t))return;i.uniform2uiv(this.addr,t),Fe(e,t)}}function ix(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3ui(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(Ne(e,t))return;i.uniform3uiv(this.addr,t),Fe(e,t)}}function rx(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4ui(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Ne(e,t))return;i.uniform4uiv(this.addr,t),Fe(e,t)}}function sx(i,t,e){const n=this.cache,r=e.allocateTextureUnit();n[0]!==r&&(i.uniform1i(this.addr,r),n[0]=r);let s;this.type===i.SAMPLER_2D_SHADOW?(fu.compareFunction=Bf,s=fu):s=hd,e.setTexture2D(t||s,r)}function ax(i,t,e){const n=this.cache,r=e.allocateTextureUnit();n[0]!==r&&(i.uniform1i(this.addr,r),n[0]=r),e.setTexture3D(t||fd,r)}function ox(i,t,e){const n=this.cache,r=e.allocateTextureUnit();n[0]!==r&&(i.uniform1i(this.addr,r),n[0]=r),e.setTextureCube(t||dd,r)}function cx(i,t,e){const n=this.cache,r=e.allocateTextureUnit();n[0]!==r&&(i.uniform1i(this.addr,r),n[0]=r),e.setTexture2DArray(t||ud,r)}function lx(i){switch(i){case 5126:return Wv;case 35664:return Xv;case 35665:return qv;case 35666:return Yv;case 35674:return $v;case 35675:return jv;case 35676:return Jv;case 5124:case 35670:return Zv;case 35667:case 35671:return Kv;case 35668:case 35672:return Qv;case 35669:case 35673:return tx;case 5125:return ex;case 36294:return nx;case 36295:return ix;case 36296:return rx;case 35678:case 36198:case 36298:case 36306:case 35682:return sx;case 35679:case 36299:case 36307:return ax;case 35680:case 36300:case 36308:case 36293:return ox;case 36289:case 36303:case 36311:case 36292:return cx}}function hx(i,t){i.uniform1fv(this.addr,t)}function ux(i,t){const e=ys(t,this.size,2);i.uniform2fv(this.addr,e)}function fx(i,t){const e=ys(t,this.size,3);i.uniform3fv(this.addr,e)}function dx(i,t){const e=ys(t,this.size,4);i.uniform4fv(this.addr,e)}function px(i,t){const e=ys(t,this.size,4);i.uniformMatrix2fv(this.addr,!1,e)}function mx(i,t){const e=ys(t,this.size,9);i.uniformMatrix3fv(this.addr,!1,e)}function gx(i,t){const e=ys(t,this.size,16);i.uniformMatrix4fv(this.addr,!1,e)}function vx(i,t){i.uniform1iv(this.addr,t)}function xx(i,t){i.uniform2iv(this.addr,t)}function _x(i,t){i.uniform3iv(this.addr,t)}function Mx(i,t){i.uniform4iv(this.addr,t)}function yx(i,t){i.uniform1uiv(this.addr,t)}function bx(i,t){i.uniform2uiv(this.addr,t)}function Sx(i,t){i.uniform3uiv(this.addr,t)}function wx(i,t){i.uniform4uiv(this.addr,t)}function Ex(i,t,e){const n=this.cache,r=t.length,s=xo(e,r);Ne(n,s)||(i.uniform1iv(this.addr,s),Fe(n,s));for(let a=0;a!==r;++a)e.setTexture2D(t[a]||hd,s[a])}function Tx(i,t,e){const n=this.cache,r=t.length,s=xo(e,r);Ne(n,s)||(i.uniform1iv(this.addr,s),Fe(n,s));for(let a=0;a!==r;++a)e.setTexture3D(t[a]||fd,s[a])}function Ax(i,t,e){const n=this.cache,r=t.length,s=xo(e,r);Ne(n,s)||(i.uniform1iv(this.addr,s),Fe(n,s));for(let a=0;a!==r;++a)e.setTextureCube(t[a]||dd,s[a])}function Rx(i,t,e){const n=this.cache,r=t.length,s=xo(e,r);Ne(n,s)||(i.uniform1iv(this.addr,s),Fe(n,s));for(let a=0;a!==r;++a)e.setTexture2DArray(t[a]||ud,s[a])}function Cx(i){switch(i){case 5126:return hx;case 35664:return ux;case 35665:return fx;case 35666:return dx;case 35674:return px;case 35675:return mx;case 35676:return gx;case 5124:case 35670:return vx;case 35667:case 35671:return xx;case 35668:case 35672:return _x;case 35669:case 35673:return Mx;case 5125:return yx;case 36294:return bx;case 36295:return Sx;case 36296:return wx;case 35678:case 36198:case 36298:case 36306:case 35682:return Ex;case 35679:case 36299:case 36307:return Tx;case 35680:case 36300:case 36308:case 36293:return Ax;case 36289:case 36303:case 36311:case 36292:return Rx}}class Lx{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.setValue=lx(e.type)}}class Px{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.size=e.size,this.setValue=Cx(e.type)}}class Dx{constructor(t){this.id=t,this.seq=[],this.map={}}setValue(t,e,n){const r=this.seq;for(let s=0,a=r.length;s!==a;++s){const o=r[s];o.setValue(t,e[o.id],n)}}}const rc=/(\w+)(\])?(\[|\.)?/g;function xu(i,t){i.seq.push(t),i.map[t.id]=t}function Ix(i,t,e){const n=i.name,r=n.length;for(rc.lastIndex=0;;){const s=rc.exec(n),a=rc.lastIndex;let o=s[1];const c=s[2]==="]",l=s[3];if(c&&(o=o|0),l===void 0||l==="["&&a+2===r){xu(e,l===void 0?new Lx(o,i,t):new Px(o,i,t));break}else{let u=e.map[o];u===void 0&&(u=new Dx(o),xu(e,u)),e=u}}}class to{constructor(t,e){this.seq=[],this.map={};const n=t.getProgramParameter(e,t.ACTIVE_UNIFORMS);for(let r=0;r<n;++r){const s=t.getActiveUniform(e,r),a=t.getUniformLocation(e,s.name);Ix(s,a,this)}}setValue(t,e,n,r){const s=this.map[e];s!==void 0&&s.setValue(t,n,r)}setOptional(t,e,n){const r=e[n];r!==void 0&&this.setValue(t,n,r)}static upload(t,e,n,r){for(let s=0,a=e.length;s!==a;++s){const o=e[s],c=n[o.id];c.needsUpdate!==!1&&o.setValue(t,c.value,r)}}static seqWithValue(t,e){const n=[];for(let r=0,s=t.length;r!==s;++r){const a=t[r];a.id in e&&n.push(a)}return n}}function _u(i,t,e){const n=i.createShader(t);return i.shaderSource(n,e),i.compileShader(n),n}const Ux=37297;let Nx=0;function Fx(i,t){const e=i.split(`
`),n=[],r=Math.max(t-6,0),s=Math.min(t+6,e.length);for(let a=r;a<s;a++){const o=a+1;n.push(`${o===t?">":" "} ${o}: ${e[a]}`)}return n.join(`
`)}const Mu=new te;function Ox(i){ce._getMatrix(Mu,ce.workingColorSpace,i);const t=`mat3( ${Mu.elements.map(e=>e.toFixed(4))} )`;switch(ce.getTransfer(i)){case io:return[t,"LinearTransferOETF"];case fe:return[t,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space: ",i),[t,"LinearTransferOETF"]}}function yu(i,t,e){const n=i.getShaderParameter(t,i.COMPILE_STATUS),s=(i.getShaderInfoLog(t)||"").trim();if(n&&s==="")return"";const a=/ERROR: 0:(\d+)/.exec(s);if(a){const o=parseInt(a[1]);return e.toUpperCase()+`

`+s+`

`+Fx(i.getShaderSource(t),o)}else return s}function Bx(i,t){const e=Ox(t);return[`vec4 ${i}( vec4 value ) {`,`	return ${e[1]}( vec4( value.rgb * ${e[0]}, value.a ) );`,"}"].join(`
`)}function kx(i,t){let e;switch(t){case W0:e="Linear";break;case X0:e="Reinhard";break;case q0:e="Cineon";break;case Y0:e="ACESFilmic";break;case j0:e="AgX";break;case Af:e="Neutral";break;case $0:e="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",t),e="Linear"}return"vec3 "+i+"( vec3 color ) { return "+e+"ToneMapping( color ); }"}const Ba=new N;function zx(){ce.getLuminanceCoefficients(Ba);const i=Ba.x.toFixed(4),t=Ba.y.toFixed(4),e=Ba.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${i}, ${t}, ${e} );`,"	return dot( weights, rgb );","}"].join(`
`)}function Hx(i){return[i.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",i.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(Is).join(`
`)}function Vx(i){const t=[];for(const e in i){const n=i[e];n!==!1&&t.push("#define "+e+" "+n)}return t.join(`
`)}function Gx(i,t){const e={},n=i.getProgramParameter(t,i.ACTIVE_ATTRIBUTES);for(let r=0;r<n;r++){const s=i.getActiveAttrib(t,r),a=s.name;let o=1;s.type===i.FLOAT_MAT2&&(o=2),s.type===i.FLOAT_MAT3&&(o=3),s.type===i.FLOAT_MAT4&&(o=4),e[a]={type:s.type,location:i.getAttribLocation(t,a),locationSize:o}}return e}function Is(i){return i!==""}function bu(i,t){const e=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return i.replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,e).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows)}function Su(i,t){return i.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}const Wx=/^[ \t]*#include +<([\w\d./]+)>/gm;function ul(i){return i.replace(Wx,qx)}const Xx=new Map;function qx(i,t){let e=ee[t];if(e===void 0){const n=Xx.get(t);if(n!==void 0)e=ee[n],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',t,n);else throw new Error("Can not resolve #include <"+t+">")}return ul(e)}const Yx=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function wu(i){return i.replace(Yx,$x)}function $x(i,t,e,n){let r="";for(let s=parseInt(t);s<parseInt(e);s++)r+=n.replace(/\[\s*i\s*\]/g,"[ "+s+" ]").replace(/UNROLLED_LOOP_INDEX/g,s);return r}function Eu(i){let t=`precision ${i.precision} float;
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
#define LOW_PRECISION`),t}function jx(i){let t="SHADOWMAP_TYPE_BASIC";return i.shadowMapType===yf?t="SHADOWMAP_TYPE_PCF":i.shadowMapType===bf?t="SHADOWMAP_TYPE_PCF_SOFT":i.shadowMapType===gi&&(t="SHADOWMAP_TYPE_VSM"),t}function Jx(i){let t="ENVMAP_TYPE_CUBE";if(i.envMap)switch(i.envMapMode){case ls:case hs:t="ENVMAP_TYPE_CUBE";break;case go:t="ENVMAP_TYPE_CUBE_UV";break}return t}function Zx(i){let t="ENVMAP_MODE_REFLECTION";if(i.envMap)switch(i.envMapMode){case hs:t="ENVMAP_MODE_REFRACTION";break}return t}function Kx(i){let t="ENVMAP_BLENDING_NONE";if(i.envMap)switch(i.combine){case Tf:t="ENVMAP_BLENDING_MULTIPLY";break;case V0:t="ENVMAP_BLENDING_MIX";break;case G0:t="ENVMAP_BLENDING_ADD";break}return t}function Qx(i){const t=i.envMapCubeUVHeight;if(t===null)return null;const e=Math.log2(t)-2,n=1/t;return{texelWidth:1/(3*Math.max(Math.pow(2,e),112)),texelHeight:n,maxMip:e}}function t_(i,t,e,n){const r=i.getContext(),s=e.defines;let a=e.vertexShader,o=e.fragmentShader;const c=jx(e),l=Jx(e),h=Zx(e),u=Kx(e),d=Qx(e),f=Hx(e),m=Vx(s),v=r.createProgram();let g,p,y=e.glslVersion?"#version "+e.glslVersion+`
`:"";e.isRawShaderMaterial?(g=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,m].filter(Is).join(`
`),g.length>0&&(g+=`
`),p=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,m].filter(Is).join(`
`),p.length>0&&(p+=`
`)):(g=[Eu(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,m,e.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",e.batching?"#define USE_BATCHING":"",e.batchingColor?"#define USE_BATCHING_COLOR":"",e.instancing?"#define USE_INSTANCING":"",e.instancingColor?"#define USE_INSTANCING_COLOR":"",e.instancingMorph?"#define USE_INSTANCING_MORPH":"",e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.map?"#define USE_MAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+h:"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.displacementMap?"#define USE_DISPLACEMENTMAP":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.mapUv?"#define MAP_UV "+e.mapUv:"",e.alphaMapUv?"#define ALPHAMAP_UV "+e.alphaMapUv:"",e.lightMapUv?"#define LIGHTMAP_UV "+e.lightMapUv:"",e.aoMapUv?"#define AOMAP_UV "+e.aoMapUv:"",e.emissiveMapUv?"#define EMISSIVEMAP_UV "+e.emissiveMapUv:"",e.bumpMapUv?"#define BUMPMAP_UV "+e.bumpMapUv:"",e.normalMapUv?"#define NORMALMAP_UV "+e.normalMapUv:"",e.displacementMapUv?"#define DISPLACEMENTMAP_UV "+e.displacementMapUv:"",e.metalnessMapUv?"#define METALNESSMAP_UV "+e.metalnessMapUv:"",e.roughnessMapUv?"#define ROUGHNESSMAP_UV "+e.roughnessMapUv:"",e.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+e.anisotropyMapUv:"",e.clearcoatMapUv?"#define CLEARCOATMAP_UV "+e.clearcoatMapUv:"",e.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+e.clearcoatNormalMapUv:"",e.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+e.clearcoatRoughnessMapUv:"",e.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+e.iridescenceMapUv:"",e.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+e.iridescenceThicknessMapUv:"",e.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+e.sheenColorMapUv:"",e.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+e.sheenRoughnessMapUv:"",e.specularMapUv?"#define SPECULARMAP_UV "+e.specularMapUv:"",e.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+e.specularColorMapUv:"",e.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+e.specularIntensityMapUv:"",e.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+e.transmissionMapUv:"",e.thicknessMapUv?"#define THICKNESSMAP_UV "+e.thicknessMapUv:"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.flatShading?"#define FLAT_SHADED":"",e.skinning?"#define USE_SKINNING":"",e.morphTargets?"#define USE_MORPHTARGETS":"",e.morphNormals&&e.flatShading===!1?"#define USE_MORPHNORMALS":"",e.morphColors?"#define USE_MORPHCOLORS":"",e.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+e.morphTextureStride:"",e.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+e.morphTargetsCount:"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+c:"",e.sizeAttenuation?"#define USE_SIZEATTENUATION":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",e.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(Is).join(`
`),p=[Eu(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,m,e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",e.map?"#define USE_MAP":"",e.matcap?"#define USE_MATCAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+l:"",e.envMap?"#define "+h:"",e.envMap?"#define "+u:"",d?"#define CUBEUV_TEXEL_WIDTH "+d.texelWidth:"",d?"#define CUBEUV_TEXEL_HEIGHT "+d.texelHeight:"",d?"#define CUBEUV_MAX_MIP "+d.maxMip+".0":"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoat?"#define USE_CLEARCOAT":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.dispersion?"#define USE_DISPERSION":"",e.iridescence?"#define USE_IRIDESCENCE":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaTest?"#define USE_ALPHATEST":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.sheen?"#define USE_SHEEN":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors||e.instancingColor||e.batchingColor?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.gradientMap?"#define USE_GRADIENTMAP":"",e.flatShading?"#define FLAT_SHADED":"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+c:"",e.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",e.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",e.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",e.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",e.toneMapping!==Gi?"#define TONE_MAPPING":"",e.toneMapping!==Gi?ee.tonemapping_pars_fragment:"",e.toneMapping!==Gi?kx("toneMapping",e.toneMapping):"",e.dithering?"#define DITHERING":"",e.opaque?"#define OPAQUE":"",ee.colorspace_pars_fragment,Bx("linearToOutputTexel",e.outputColorSpace),zx(),e.useDepthPacking?"#define DEPTH_PACKING "+e.depthPacking:"",`
`].filter(Is).join(`
`)),a=ul(a),a=bu(a,e),a=Su(a,e),o=ul(o),o=bu(o,e),o=Su(o,e),a=wu(a),o=wu(o),e.isRawShaderMaterial!==!0&&(y=`#version 300 es
`,g=[f,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+g,p=["#define varying in",e.glslVersion===wh?"":"layout(location = 0) out highp vec4 pc_fragColor;",e.glslVersion===wh?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+p);const M=y+g+a,_=y+p+o,w=_u(r,r.VERTEX_SHADER,M),E=_u(r,r.FRAGMENT_SHADER,_);r.attachShader(v,w),r.attachShader(v,E),e.index0AttributeName!==void 0?r.bindAttribLocation(v,0,e.index0AttributeName):e.morphTargets===!0&&r.bindAttribLocation(v,0,"position"),r.linkProgram(v);function A(S){if(i.debug.checkShaderErrors){const T=r.getProgramInfoLog(v)||"",L=r.getShaderInfoLog(w)||"",D=r.getShaderInfoLog(E)||"",U=T.trim(),B=L.trim(),X=D.trim();let H=!0,Q=!0;if(r.getProgramParameter(v,r.LINK_STATUS)===!1)if(H=!1,typeof i.debug.onShaderError=="function")i.debug.onShaderError(r,v,w,E);else{const ct=yu(r,w,"vertex"),ut=yu(r,E,"fragment");console.error("THREE.WebGLProgram: Shader Error "+r.getError()+" - VALIDATE_STATUS "+r.getProgramParameter(v,r.VALIDATE_STATUS)+`

Material Name: `+S.name+`
Material Type: `+S.type+`

Program Info Log: `+U+`
`+ct+`
`+ut)}else U!==""?console.warn("THREE.WebGLProgram: Program Info Log:",U):(B===""||X==="")&&(Q=!1);Q&&(S.diagnostics={runnable:H,programLog:U,vertexShader:{log:B,prefix:g},fragmentShader:{log:X,prefix:p}})}r.deleteShader(w),r.deleteShader(E),R=new to(r,v),x=Gx(r,v)}let R;this.getUniforms=function(){return R===void 0&&A(this),R};let x;this.getAttributes=function(){return x===void 0&&A(this),x};let b=e.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return b===!1&&(b=r.getProgramParameter(v,Ux)),b},this.destroy=function(){n.releaseStatesOfProgram(this),r.deleteProgram(v),this.program=void 0},this.type=e.shaderType,this.name=e.shaderName,this.id=Nx++,this.cacheKey=t,this.usedTimes=1,this.program=v,this.vertexShader=w,this.fragmentShader=E,this}let e_=0;class n_{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(t){const e=t.vertexShader,n=t.fragmentShader,r=this._getShaderStage(e),s=this._getShaderStage(n),a=this._getShaderCacheForMaterial(t);return a.has(r)===!1&&(a.add(r),r.usedTimes++),a.has(s)===!1&&(a.add(s),s.usedTimes++),this}remove(t){const e=this.materialCache.get(t);for(const n of e)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(t),this}getVertexShaderID(t){return this._getShaderStage(t.vertexShader).id}getFragmentShaderID(t){return this._getShaderStage(t.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(t){const e=this.materialCache;let n=e.get(t);return n===void 0&&(n=new Set,e.set(t,n)),n}_getShaderStage(t){const e=this.shaderCache;let n=e.get(t);return n===void 0&&(n=new i_(t),e.set(t,n)),n}}class i_{constructor(t){this.id=e_++,this.code=t,this.usedTimes=0}}function r_(i,t,e,n,r,s,a){const o=new zf,c=new n_,l=new Set,h=[],u=r.logarithmicDepthBuffer,d=r.vertexTextures;let f=r.precision;const m={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function v(x){return l.add(x),x===0?"uv":`uv${x}`}function g(x,b,S,T,L){const D=T.fog,U=L.geometry,B=x.isMeshStandardMaterial?T.environment:null,X=(x.isMeshStandardMaterial?e:t).get(x.envMap||B),H=X&&X.mapping===go?X.image.height:null,Q=m[x.type];x.precision!==null&&(f=r.getMaxPrecision(x.precision),f!==x.precision&&console.warn("THREE.WebGLProgram.getParameters:",x.precision,"not supported, using",f,"instead."));const ct=U.morphAttributes.position||U.morphAttributes.normal||U.morphAttributes.color,ut=ct!==void 0?ct.length:0;let vt=0;U.morphAttributes.position!==void 0&&(vt=1),U.morphAttributes.normal!==void 0&&(vt=2),U.morphAttributes.color!==void 0&&(vt=3);let Et,Nt,lt,G;if(Q){const he=ni[Q];Et=he.vertexShader,Nt=he.fragmentShader}else Et=x.vertexShader,Nt=x.fragmentShader,c.update(x),lt=c.getVertexShaderID(x),G=c.getFragmentShaderID(x);const J=i.getRenderTarget(),z=i.state.buffers.depth.getReversed(),W=L.isInstancedMesh===!0,k=L.isBatchedMesh===!0,K=!!x.map,it=!!x.matcap,I=!!X,Z=!!x.aoMap,j=!!x.lightMap,et=!!x.bumpMap,st=!!x.normalMap,ht=!!x.displacementMap,pt=!!x.emissiveMap,xt=!!x.metalnessMap,Jt=!!x.roughnessMap,qt=x.anisotropy>0,F=x.clearcoat>0,C=x.dispersion>0,$=x.iridescence>0,at=x.sheen>0,gt=x.transmission>0,ot=qt&&!!x.anisotropyMap,Ht=F&&!!x.clearcoatMap,wt=F&&!!x.clearcoatNormalMap,Bt=F&&!!x.clearcoatRoughnessMap,kt=$&&!!x.iridescenceMap,_t=$&&!!x.iridescenceThicknessMap,Lt=at&&!!x.sheenColorMap,Yt=at&&!!x.sheenRoughnessMap,Vt=!!x.specularMap,Rt=!!x.specularColorMap,Qt=!!x.specularIntensityMap,V=gt&&!!x.transmissionMap,bt=gt&&!!x.thicknessMap,Tt=!!x.gradientMap,Ft=!!x.alphaMap,Mt=x.alphaTest>0,ft=!!x.alphaHash,zt=!!x.extensions;let Zt=Gi;x.toneMapped&&(J===null||J.isXRRenderTarget===!0)&&(Zt=i.toneMapping);const pe={shaderID:Q,shaderType:x.type,shaderName:x.name,vertexShader:Et,fragmentShader:Nt,defines:x.defines,customVertexShaderID:lt,customFragmentShaderID:G,isRawShaderMaterial:x.isRawShaderMaterial===!0,glslVersion:x.glslVersion,precision:f,batching:k,batchingColor:k&&L._colorsTexture!==null,instancing:W,instancingColor:W&&L.instanceColor!==null,instancingMorph:W&&L.morphTexture!==null,supportsVertexTextures:d,outputColorSpace:J===null?i.outputColorSpace:J.isXRRenderTarget===!0?J.texture.colorSpace:gr,alphaToCoverage:!!x.alphaToCoverage,map:K,matcap:it,envMap:I,envMapMode:I&&X.mapping,envMapCubeUVHeight:H,aoMap:Z,lightMap:j,bumpMap:et,normalMap:st,displacementMap:d&&ht,emissiveMap:pt,normalMapObjectSpace:st&&x.normalMapType===tp,normalMapTangentSpace:st&&x.normalMapType===Of,metalnessMap:xt,roughnessMap:Jt,anisotropy:qt,anisotropyMap:ot,clearcoat:F,clearcoatMap:Ht,clearcoatNormalMap:wt,clearcoatRoughnessMap:Bt,dispersion:C,iridescence:$,iridescenceMap:kt,iridescenceThicknessMap:_t,sheen:at,sheenColorMap:Lt,sheenRoughnessMap:Yt,specularMap:Vt,specularColorMap:Rt,specularIntensityMap:Qt,transmission:gt,transmissionMap:V,thicknessMap:bt,gradientMap:Tt,opaque:x.transparent===!1&&x.blending===ts&&x.alphaToCoverage===!1,alphaMap:Ft,alphaTest:Mt,alphaHash:ft,combine:x.combine,mapUv:K&&v(x.map.channel),aoMapUv:Z&&v(x.aoMap.channel),lightMapUv:j&&v(x.lightMap.channel),bumpMapUv:et&&v(x.bumpMap.channel),normalMapUv:st&&v(x.normalMap.channel),displacementMapUv:ht&&v(x.displacementMap.channel),emissiveMapUv:pt&&v(x.emissiveMap.channel),metalnessMapUv:xt&&v(x.metalnessMap.channel),roughnessMapUv:Jt&&v(x.roughnessMap.channel),anisotropyMapUv:ot&&v(x.anisotropyMap.channel),clearcoatMapUv:Ht&&v(x.clearcoatMap.channel),clearcoatNormalMapUv:wt&&v(x.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:Bt&&v(x.clearcoatRoughnessMap.channel),iridescenceMapUv:kt&&v(x.iridescenceMap.channel),iridescenceThicknessMapUv:_t&&v(x.iridescenceThicknessMap.channel),sheenColorMapUv:Lt&&v(x.sheenColorMap.channel),sheenRoughnessMapUv:Yt&&v(x.sheenRoughnessMap.channel),specularMapUv:Vt&&v(x.specularMap.channel),specularColorMapUv:Rt&&v(x.specularColorMap.channel),specularIntensityMapUv:Qt&&v(x.specularIntensityMap.channel),transmissionMapUv:V&&v(x.transmissionMap.channel),thicknessMapUv:bt&&v(x.thicknessMap.channel),alphaMapUv:Ft&&v(x.alphaMap.channel),vertexTangents:!!U.attributes.tangent&&(st||qt),vertexColors:x.vertexColors,vertexAlphas:x.vertexColors===!0&&!!U.attributes.color&&U.attributes.color.itemSize===4,pointsUvs:L.isPoints===!0&&!!U.attributes.uv&&(K||Ft),fog:!!D,useFog:x.fog===!0,fogExp2:!!D&&D.isFogExp2,flatShading:x.flatShading===!0&&x.wireframe===!1,sizeAttenuation:x.sizeAttenuation===!0,logarithmicDepthBuffer:u,reversedDepthBuffer:z,skinning:L.isSkinnedMesh===!0,morphTargets:U.morphAttributes.position!==void 0,morphNormals:U.morphAttributes.normal!==void 0,morphColors:U.morphAttributes.color!==void 0,morphTargetsCount:ut,morphTextureStride:vt,numDirLights:b.directional.length,numPointLights:b.point.length,numSpotLights:b.spot.length,numSpotLightMaps:b.spotLightMap.length,numRectAreaLights:b.rectArea.length,numHemiLights:b.hemi.length,numDirLightShadows:b.directionalShadowMap.length,numPointLightShadows:b.pointShadowMap.length,numSpotLightShadows:b.spotShadowMap.length,numSpotLightShadowsWithMaps:b.numSpotLightShadowsWithMaps,numLightProbes:b.numLightProbes,numClippingPlanes:a.numPlanes,numClipIntersection:a.numIntersection,dithering:x.dithering,shadowMapEnabled:i.shadowMap.enabled&&S.length>0,shadowMapType:i.shadowMap.type,toneMapping:Zt,decodeVideoTexture:K&&x.map.isVideoTexture===!0&&ce.getTransfer(x.map.colorSpace)===fe,decodeVideoTextureEmissive:pt&&x.emissiveMap.isVideoTexture===!0&&ce.getTransfer(x.emissiveMap.colorSpace)===fe,premultipliedAlpha:x.premultipliedAlpha,doubleSided:x.side===je,flipSided:x.side===mn,useDepthPacking:x.depthPacking>=0,depthPacking:x.depthPacking||0,index0AttributeName:x.index0AttributeName,extensionClipCullDistance:zt&&x.extensions.clipCullDistance===!0&&n.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(zt&&x.extensions.multiDraw===!0||k)&&n.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:n.has("KHR_parallel_shader_compile"),customProgramCacheKey:x.customProgramCacheKey()};return pe.vertexUv1s=l.has(1),pe.vertexUv2s=l.has(2),pe.vertexUv3s=l.has(3),l.clear(),pe}function p(x){const b=[];if(x.shaderID?b.push(x.shaderID):(b.push(x.customVertexShaderID),b.push(x.customFragmentShaderID)),x.defines!==void 0)for(const S in x.defines)b.push(S),b.push(x.defines[S]);return x.isRawShaderMaterial===!1&&(y(b,x),M(b,x),b.push(i.outputColorSpace)),b.push(x.customProgramCacheKey),b.join()}function y(x,b){x.push(b.precision),x.push(b.outputColorSpace),x.push(b.envMapMode),x.push(b.envMapCubeUVHeight),x.push(b.mapUv),x.push(b.alphaMapUv),x.push(b.lightMapUv),x.push(b.aoMapUv),x.push(b.bumpMapUv),x.push(b.normalMapUv),x.push(b.displacementMapUv),x.push(b.emissiveMapUv),x.push(b.metalnessMapUv),x.push(b.roughnessMapUv),x.push(b.anisotropyMapUv),x.push(b.clearcoatMapUv),x.push(b.clearcoatNormalMapUv),x.push(b.clearcoatRoughnessMapUv),x.push(b.iridescenceMapUv),x.push(b.iridescenceThicknessMapUv),x.push(b.sheenColorMapUv),x.push(b.sheenRoughnessMapUv),x.push(b.specularMapUv),x.push(b.specularColorMapUv),x.push(b.specularIntensityMapUv),x.push(b.transmissionMapUv),x.push(b.thicknessMapUv),x.push(b.combine),x.push(b.fogExp2),x.push(b.sizeAttenuation),x.push(b.morphTargetsCount),x.push(b.morphAttributeCount),x.push(b.numDirLights),x.push(b.numPointLights),x.push(b.numSpotLights),x.push(b.numSpotLightMaps),x.push(b.numHemiLights),x.push(b.numRectAreaLights),x.push(b.numDirLightShadows),x.push(b.numPointLightShadows),x.push(b.numSpotLightShadows),x.push(b.numSpotLightShadowsWithMaps),x.push(b.numLightProbes),x.push(b.shadowMapType),x.push(b.toneMapping),x.push(b.numClippingPlanes),x.push(b.numClipIntersection),x.push(b.depthPacking)}function M(x,b){o.disableAll(),b.supportsVertexTextures&&o.enable(0),b.instancing&&o.enable(1),b.instancingColor&&o.enable(2),b.instancingMorph&&o.enable(3),b.matcap&&o.enable(4),b.envMap&&o.enable(5),b.normalMapObjectSpace&&o.enable(6),b.normalMapTangentSpace&&o.enable(7),b.clearcoat&&o.enable(8),b.iridescence&&o.enable(9),b.alphaTest&&o.enable(10),b.vertexColors&&o.enable(11),b.vertexAlphas&&o.enable(12),b.vertexUv1s&&o.enable(13),b.vertexUv2s&&o.enable(14),b.vertexUv3s&&o.enable(15),b.vertexTangents&&o.enable(16),b.anisotropy&&o.enable(17),b.alphaHash&&o.enable(18),b.batching&&o.enable(19),b.dispersion&&o.enable(20),b.batchingColor&&o.enable(21),b.gradientMap&&o.enable(22),x.push(o.mask),o.disableAll(),b.fog&&o.enable(0),b.useFog&&o.enable(1),b.flatShading&&o.enable(2),b.logarithmicDepthBuffer&&o.enable(3),b.reversedDepthBuffer&&o.enable(4),b.skinning&&o.enable(5),b.morphTargets&&o.enable(6),b.morphNormals&&o.enable(7),b.morphColors&&o.enable(8),b.premultipliedAlpha&&o.enable(9),b.shadowMapEnabled&&o.enable(10),b.doubleSided&&o.enable(11),b.flipSided&&o.enable(12),b.useDepthPacking&&o.enable(13),b.dithering&&o.enable(14),b.transmission&&o.enable(15),b.sheen&&o.enable(16),b.opaque&&o.enable(17),b.pointsUvs&&o.enable(18),b.decodeVideoTexture&&o.enable(19),b.decodeVideoTextureEmissive&&o.enable(20),b.alphaToCoverage&&o.enable(21),x.push(o.mask)}function _(x){const b=m[x.type];let S;if(b){const T=ni[b];S=$p.clone(T.uniforms)}else S=x.uniforms;return S}function w(x,b){let S;for(let T=0,L=h.length;T<L;T++){const D=h[T];if(D.cacheKey===b){S=D,++S.usedTimes;break}}return S===void 0&&(S=new t_(i,b,x,s),h.push(S)),S}function E(x){if(--x.usedTimes===0){const b=h.indexOf(x);h[b]=h[h.length-1],h.pop(),x.destroy()}}function A(x){c.remove(x)}function R(){c.dispose()}return{getParameters:g,getProgramCacheKey:p,getUniforms:_,acquireProgram:w,releaseProgram:E,releaseShaderCache:A,programs:h,dispose:R}}function s_(){let i=new WeakMap;function t(a){return i.has(a)}function e(a){let o=i.get(a);return o===void 0&&(o={},i.set(a,o)),o}function n(a){i.delete(a)}function r(a,o,c){i.get(a)[o]=c}function s(){i=new WeakMap}return{has:t,get:e,remove:n,update:r,dispose:s}}function a_(i,t){return i.groupOrder!==t.groupOrder?i.groupOrder-t.groupOrder:i.renderOrder!==t.renderOrder?i.renderOrder-t.renderOrder:i.material.id!==t.material.id?i.material.id-t.material.id:i.z!==t.z?i.z-t.z:i.id-t.id}function Tu(i,t){return i.groupOrder!==t.groupOrder?i.groupOrder-t.groupOrder:i.renderOrder!==t.renderOrder?i.renderOrder-t.renderOrder:i.z!==t.z?t.z-i.z:i.id-t.id}function Au(){const i=[];let t=0;const e=[],n=[],r=[];function s(){t=0,e.length=0,n.length=0,r.length=0}function a(u,d,f,m,v,g){let p=i[t];return p===void 0?(p={id:u.id,object:u,geometry:d,material:f,groupOrder:m,renderOrder:u.renderOrder,z:v,group:g},i[t]=p):(p.id=u.id,p.object=u,p.geometry=d,p.material=f,p.groupOrder=m,p.renderOrder=u.renderOrder,p.z=v,p.group=g),t++,p}function o(u,d,f,m,v,g){const p=a(u,d,f,m,v,g);f.transmission>0?n.push(p):f.transparent===!0?r.push(p):e.push(p)}function c(u,d,f,m,v,g){const p=a(u,d,f,m,v,g);f.transmission>0?n.unshift(p):f.transparent===!0?r.unshift(p):e.unshift(p)}function l(u,d){e.length>1&&e.sort(u||a_),n.length>1&&n.sort(d||Tu),r.length>1&&r.sort(d||Tu)}function h(){for(let u=t,d=i.length;u<d;u++){const f=i[u];if(f.id===null)break;f.id=null,f.object=null,f.geometry=null,f.material=null,f.group=null}}return{opaque:e,transmissive:n,transparent:r,init:s,push:o,unshift:c,finish:h,sort:l}}function o_(){let i=new WeakMap;function t(n,r){const s=i.get(n);let a;return s===void 0?(a=new Au,i.set(n,[a])):r>=s.length?(a=new Au,s.push(a)):a=s[r],a}function e(){i=new WeakMap}return{get:t,dispose:e}}function c_(){const i={};return{get:function(t){if(i[t.id]!==void 0)return i[t.id];let e;switch(t.type){case"DirectionalLight":e={direction:new N,color:new Ut};break;case"SpotLight":e={position:new N,direction:new N,color:new Ut,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":e={position:new N,color:new Ut,distance:0,decay:0};break;case"HemisphereLight":e={direction:new N,skyColor:new Ut,groundColor:new Ut};break;case"RectAreaLight":e={color:new Ut,position:new N,halfWidth:new N,halfHeight:new N};break}return i[t.id]=e,e}}}function l_(){const i={};return{get:function(t){if(i[t.id]!==void 0)return i[t.id];let e;switch(t.type){case"DirectionalLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new dt};break;case"SpotLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new dt};break;case"PointLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new dt,shadowCameraNear:1,shadowCameraFar:1e3};break}return i[t.id]=e,e}}}let h_=0;function u_(i,t){return(t.castShadow?2:0)-(i.castShadow?2:0)+(t.map?1:0)-(i.map?1:0)}function f_(i){const t=new c_,e=l_(),n={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let l=0;l<9;l++)n.probe.push(new N);const r=new N,s=new re,a=new re;function o(l){let h=0,u=0,d=0;for(let x=0;x<9;x++)n.probe[x].set(0,0,0);let f=0,m=0,v=0,g=0,p=0,y=0,M=0,_=0,w=0,E=0,A=0;l.sort(u_);for(let x=0,b=l.length;x<b;x++){const S=l[x],T=S.color,L=S.intensity,D=S.distance,U=S.shadow&&S.shadow.map?S.shadow.map.texture:null;if(S.isAmbientLight)h+=T.r*L,u+=T.g*L,d+=T.b*L;else if(S.isLightProbe){for(let B=0;B<9;B++)n.probe[B].addScaledVector(S.sh.coefficients[B],L);A++}else if(S.isDirectionalLight){const B=t.get(S);if(B.color.copy(S.color).multiplyScalar(S.intensity),S.castShadow){const X=S.shadow,H=e.get(S);H.shadowIntensity=X.intensity,H.shadowBias=X.bias,H.shadowNormalBias=X.normalBias,H.shadowRadius=X.radius,H.shadowMapSize=X.mapSize,n.directionalShadow[f]=H,n.directionalShadowMap[f]=U,n.directionalShadowMatrix[f]=S.shadow.matrix,y++}n.directional[f]=B,f++}else if(S.isSpotLight){const B=t.get(S);B.position.setFromMatrixPosition(S.matrixWorld),B.color.copy(T).multiplyScalar(L),B.distance=D,B.coneCos=Math.cos(S.angle),B.penumbraCos=Math.cos(S.angle*(1-S.penumbra)),B.decay=S.decay,n.spot[v]=B;const X=S.shadow;if(S.map&&(n.spotLightMap[w]=S.map,w++,X.updateMatrices(S),S.castShadow&&E++),n.spotLightMatrix[v]=X.matrix,S.castShadow){const H=e.get(S);H.shadowIntensity=X.intensity,H.shadowBias=X.bias,H.shadowNormalBias=X.normalBias,H.shadowRadius=X.radius,H.shadowMapSize=X.mapSize,n.spotShadow[v]=H,n.spotShadowMap[v]=U,_++}v++}else if(S.isRectAreaLight){const B=t.get(S);B.color.copy(T).multiplyScalar(L),B.halfWidth.set(S.width*.5,0,0),B.halfHeight.set(0,S.height*.5,0),n.rectArea[g]=B,g++}else if(S.isPointLight){const B=t.get(S);if(B.color.copy(S.color).multiplyScalar(S.intensity),B.distance=S.distance,B.decay=S.decay,S.castShadow){const X=S.shadow,H=e.get(S);H.shadowIntensity=X.intensity,H.shadowBias=X.bias,H.shadowNormalBias=X.normalBias,H.shadowRadius=X.radius,H.shadowMapSize=X.mapSize,H.shadowCameraNear=X.camera.near,H.shadowCameraFar=X.camera.far,n.pointShadow[m]=H,n.pointShadowMap[m]=U,n.pointShadowMatrix[m]=S.shadow.matrix,M++}n.point[m]=B,m++}else if(S.isHemisphereLight){const B=t.get(S);B.skyColor.copy(S.color).multiplyScalar(L),B.groundColor.copy(S.groundColor).multiplyScalar(L),n.hemi[p]=B,p++}}g>0&&(i.has("OES_texture_float_linear")===!0?(n.rectAreaLTC1=At.LTC_FLOAT_1,n.rectAreaLTC2=At.LTC_FLOAT_2):(n.rectAreaLTC1=At.LTC_HALF_1,n.rectAreaLTC2=At.LTC_HALF_2)),n.ambient[0]=h,n.ambient[1]=u,n.ambient[2]=d;const R=n.hash;(R.directionalLength!==f||R.pointLength!==m||R.spotLength!==v||R.rectAreaLength!==g||R.hemiLength!==p||R.numDirectionalShadows!==y||R.numPointShadows!==M||R.numSpotShadows!==_||R.numSpotMaps!==w||R.numLightProbes!==A)&&(n.directional.length=f,n.spot.length=v,n.rectArea.length=g,n.point.length=m,n.hemi.length=p,n.directionalShadow.length=y,n.directionalShadowMap.length=y,n.pointShadow.length=M,n.pointShadowMap.length=M,n.spotShadow.length=_,n.spotShadowMap.length=_,n.directionalShadowMatrix.length=y,n.pointShadowMatrix.length=M,n.spotLightMatrix.length=_+w-E,n.spotLightMap.length=w,n.numSpotLightShadowsWithMaps=E,n.numLightProbes=A,R.directionalLength=f,R.pointLength=m,R.spotLength=v,R.rectAreaLength=g,R.hemiLength=p,R.numDirectionalShadows=y,R.numPointShadows=M,R.numSpotShadows=_,R.numSpotMaps=w,R.numLightProbes=A,n.version=h_++)}function c(l,h){let u=0,d=0,f=0,m=0,v=0;const g=h.matrixWorldInverse;for(let p=0,y=l.length;p<y;p++){const M=l[p];if(M.isDirectionalLight){const _=n.directional[u];_.direction.setFromMatrixPosition(M.matrixWorld),r.setFromMatrixPosition(M.target.matrixWorld),_.direction.sub(r),_.direction.transformDirection(g),u++}else if(M.isSpotLight){const _=n.spot[f];_.position.setFromMatrixPosition(M.matrixWorld),_.position.applyMatrix4(g),_.direction.setFromMatrixPosition(M.matrixWorld),r.setFromMatrixPosition(M.target.matrixWorld),_.direction.sub(r),_.direction.transformDirection(g),f++}else if(M.isRectAreaLight){const _=n.rectArea[m];_.position.setFromMatrixPosition(M.matrixWorld),_.position.applyMatrix4(g),a.identity(),s.copy(M.matrixWorld),s.premultiply(g),a.extractRotation(s),_.halfWidth.set(M.width*.5,0,0),_.halfHeight.set(0,M.height*.5,0),_.halfWidth.applyMatrix4(a),_.halfHeight.applyMatrix4(a),m++}else if(M.isPointLight){const _=n.point[d];_.position.setFromMatrixPosition(M.matrixWorld),_.position.applyMatrix4(g),d++}else if(M.isHemisphereLight){const _=n.hemi[v];_.direction.setFromMatrixPosition(M.matrixWorld),_.direction.transformDirection(g),v++}}}return{setup:o,setupView:c,state:n}}function Ru(i){const t=new f_(i),e=[],n=[];function r(h){l.camera=h,e.length=0,n.length=0}function s(h){e.push(h)}function a(h){n.push(h)}function o(){t.setup(e)}function c(h){t.setupView(e,h)}const l={lightsArray:e,shadowsArray:n,camera:null,lights:t,transmissionRenderTarget:{}};return{init:r,state:l,setupLights:o,setupLightsView:c,pushLight:s,pushShadow:a}}function d_(i){let t=new WeakMap;function e(r,s=0){const a=t.get(r);let o;return a===void 0?(o=new Ru(i),t.set(r,[o])):s>=a.length?(o=new Ru(i),a.push(o)):o=a[s],o}function n(){t=new WeakMap}return{get:e,dispose:n}}const p_=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,m_=`uniform sampler2D shadow_pass;
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
}`;function g_(i,t,e){let n=new Ol;const r=new dt,s=new dt,a=new le,o=new k1({depthPacking:Q0}),c=new z1,l={},h=e.maxTextureSize,u={[qi]:mn,[mn]:qi,[je]:je},d=new ke({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new dt},radius:{value:4}},vertexShader:p_,fragmentShader:m_}),f=d.clone();f.defines.HORIZONTAL_PASS=1;const m=new Ee;m.setAttribute("position",new ae(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const v=new Dt(m,d),g=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=yf;let p=this.type;this.render=function(E,A,R){if(g.enabled===!1||g.autoUpdate===!1&&g.needsUpdate===!1||E.length===0)return;const x=i.getRenderTarget(),b=i.getActiveCubeFace(),S=i.getActiveMipmapLevel(),T=i.state;T.setBlending(Vi),T.buffers.depth.getReversed()===!0?T.buffers.color.setClear(0,0,0,0):T.buffers.color.setClear(1,1,1,1),T.buffers.depth.setTest(!0),T.setScissorTest(!1);const L=p!==gi&&this.type===gi,D=p===gi&&this.type!==gi;for(let U=0,B=E.length;U<B;U++){const X=E[U],H=X.shadow;if(H===void 0){console.warn("THREE.WebGLShadowMap:",X,"has no shadow.");continue}if(H.autoUpdate===!1&&H.needsUpdate===!1)continue;r.copy(H.mapSize);const Q=H.getFrameExtents();if(r.multiply(Q),s.copy(H.mapSize),(r.x>h||r.y>h)&&(r.x>h&&(s.x=Math.floor(h/Q.x),r.x=s.x*Q.x,H.mapSize.x=s.x),r.y>h&&(s.y=Math.floor(h/Q.y),r.y=s.y*Q.y,H.mapSize.y=s.y)),H.map===null||L===!0||D===!0){const ut=this.type!==gi?{minFilter:An,magFilter:An}:{};H.map!==null&&H.map.dispose(),H.map=new rn(r.x,r.y,ut),H.map.texture.name=X.name+".shadowMap",H.camera.updateProjectionMatrix()}i.setRenderTarget(H.map),i.clear();const ct=H.getViewportCount();for(let ut=0;ut<ct;ut++){const vt=H.getViewport(ut);a.set(s.x*vt.x,s.y*vt.y,s.x*vt.z,s.y*vt.w),T.viewport(a),H.updateMatrices(X,ut),n=H.getFrustum(),_(A,R,H.camera,X,this.type)}H.isPointLightShadow!==!0&&this.type===gi&&y(H,R),H.needsUpdate=!1}p=this.type,g.needsUpdate=!1,i.setRenderTarget(x,b,S)};function y(E,A){const R=t.update(v);d.defines.VSM_SAMPLES!==E.blurSamples&&(d.defines.VSM_SAMPLES=E.blurSamples,f.defines.VSM_SAMPLES=E.blurSamples,d.needsUpdate=!0,f.needsUpdate=!0),E.mapPass===null&&(E.mapPass=new rn(r.x,r.y)),d.uniforms.shadow_pass.value=E.map.texture,d.uniforms.resolution.value=E.mapSize,d.uniforms.radius.value=E.radius,i.setRenderTarget(E.mapPass),i.clear(),i.renderBufferDirect(A,null,R,d,v,null),f.uniforms.shadow_pass.value=E.mapPass.texture,f.uniforms.resolution.value=E.mapSize,f.uniforms.radius.value=E.radius,i.setRenderTarget(E.map),i.clear(),i.renderBufferDirect(A,null,R,f,v,null)}function M(E,A,R,x){let b=null;const S=R.isPointLight===!0?E.customDistanceMaterial:E.customDepthMaterial;if(S!==void 0)b=S;else if(b=R.isPointLight===!0?c:o,i.localClippingEnabled&&A.clipShadows===!0&&Array.isArray(A.clippingPlanes)&&A.clippingPlanes.length!==0||A.displacementMap&&A.displacementScale!==0||A.alphaMap&&A.alphaTest>0||A.map&&A.alphaTest>0||A.alphaToCoverage===!0){const T=b.uuid,L=A.uuid;let D=l[T];D===void 0&&(D={},l[T]=D);let U=D[L];U===void 0&&(U=b.clone(),D[L]=U,A.addEventListener("dispose",w)),b=U}if(b.visible=A.visible,b.wireframe=A.wireframe,x===gi?b.side=A.shadowSide!==null?A.shadowSide:A.side:b.side=A.shadowSide!==null?A.shadowSide:u[A.side],b.alphaMap=A.alphaMap,b.alphaTest=A.alphaToCoverage===!0?.5:A.alphaTest,b.map=A.map,b.clipShadows=A.clipShadows,b.clippingPlanes=A.clippingPlanes,b.clipIntersection=A.clipIntersection,b.displacementMap=A.displacementMap,b.displacementScale=A.displacementScale,b.displacementBias=A.displacementBias,b.wireframeLinewidth=A.wireframeLinewidth,b.linewidth=A.linewidth,R.isPointLight===!0&&b.isMeshDistanceMaterial===!0){const T=i.properties.get(b);T.light=R}return b}function _(E,A,R,x,b){if(E.visible===!1)return;if(E.layers.test(A.layers)&&(E.isMesh||E.isLine||E.isPoints)&&(E.castShadow||E.receiveShadow&&b===gi)&&(!E.frustumCulled||n.intersectsObject(E))){E.modelViewMatrix.multiplyMatrices(R.matrixWorldInverse,E.matrixWorld);const L=t.update(E),D=E.material;if(Array.isArray(D)){const U=L.groups;for(let B=0,X=U.length;B<X;B++){const H=U[B],Q=D[H.materialIndex];if(Q&&Q.visible){const ct=M(E,Q,x,b);E.onBeforeShadow(i,E,A,R,L,ct,H),i.renderBufferDirect(R,null,L,ct,E,H),E.onAfterShadow(i,E,A,R,L,ct,H)}}}else if(D.visible){const U=M(E,D,x,b);E.onBeforeShadow(i,E,A,R,L,U,null),i.renderBufferDirect(R,null,L,U,E,null),E.onAfterShadow(i,E,A,R,L,U,null)}}const T=E.children;for(let L=0,D=T.length;L<D;L++)_(T[L],A,R,x,b)}function w(E){E.target.removeEventListener("dispose",w);for(const R in l){const x=l[R],b=E.target.uuid;b in x&&(x[b].dispose(),delete x[b])}}}const v_={[Sc]:wc,[Ec]:Rc,[Tc]:Cc,[cs]:Ac,[wc]:Sc,[Rc]:Ec,[Cc]:Tc,[Ac]:cs};function x_(i,t){function e(){let V=!1;const bt=new le;let Tt=null;const Ft=new le(0,0,0,0);return{setMask:function(Mt){Tt!==Mt&&!V&&(i.colorMask(Mt,Mt,Mt,Mt),Tt=Mt)},setLocked:function(Mt){V=Mt},setClear:function(Mt,ft,zt,Zt,pe){pe===!0&&(Mt*=Zt,ft*=Zt,zt*=Zt),bt.set(Mt,ft,zt,Zt),Ft.equals(bt)===!1&&(i.clearColor(Mt,ft,zt,Zt),Ft.copy(bt))},reset:function(){V=!1,Tt=null,Ft.set(-1,0,0,0)}}}function n(){let V=!1,bt=!1,Tt=null,Ft=null,Mt=null;return{setReversed:function(ft){if(bt!==ft){const zt=t.get("EXT_clip_control");ft?zt.clipControlEXT(zt.LOWER_LEFT_EXT,zt.ZERO_TO_ONE_EXT):zt.clipControlEXT(zt.LOWER_LEFT_EXT,zt.NEGATIVE_ONE_TO_ONE_EXT),bt=ft;const Zt=Mt;Mt=null,this.setClear(Zt)}},getReversed:function(){return bt},setTest:function(ft){ft?J(i.DEPTH_TEST):z(i.DEPTH_TEST)},setMask:function(ft){Tt!==ft&&!V&&(i.depthMask(ft),Tt=ft)},setFunc:function(ft){if(bt&&(ft=v_[ft]),Ft!==ft){switch(ft){case Sc:i.depthFunc(i.NEVER);break;case wc:i.depthFunc(i.ALWAYS);break;case Ec:i.depthFunc(i.LESS);break;case cs:i.depthFunc(i.LEQUAL);break;case Tc:i.depthFunc(i.EQUAL);break;case Ac:i.depthFunc(i.GEQUAL);break;case Rc:i.depthFunc(i.GREATER);break;case Cc:i.depthFunc(i.NOTEQUAL);break;default:i.depthFunc(i.LEQUAL)}Ft=ft}},setLocked:function(ft){V=ft},setClear:function(ft){Mt!==ft&&(bt&&(ft=1-ft),i.clearDepth(ft),Mt=ft)},reset:function(){V=!1,Tt=null,Ft=null,Mt=null,bt=!1}}}function r(){let V=!1,bt=null,Tt=null,Ft=null,Mt=null,ft=null,zt=null,Zt=null,pe=null;return{setTest:function(he){V||(he?J(i.STENCIL_TEST):z(i.STENCIL_TEST))},setMask:function(he){bt!==he&&!V&&(i.stencilMask(he),bt=he)},setFunc:function(he,li,$n){(Tt!==he||Ft!==li||Mt!==$n)&&(i.stencilFunc(he,li,$n),Tt=he,Ft=li,Mt=$n)},setOp:function(he,li,$n){(ft!==he||zt!==li||Zt!==$n)&&(i.stencilOp(he,li,$n),ft=he,zt=li,Zt=$n)},setLocked:function(he){V=he},setClear:function(he){pe!==he&&(i.clearStencil(he),pe=he)},reset:function(){V=!1,bt=null,Tt=null,Ft=null,Mt=null,ft=null,zt=null,Zt=null,pe=null}}}const s=new e,a=new n,o=new r,c=new WeakMap,l=new WeakMap;let h={},u={},d=new WeakMap,f=[],m=null,v=!1,g=null,p=null,y=null,M=null,_=null,w=null,E=null,A=new Ut(0,0,0),R=0,x=!1,b=null,S=null,T=null,L=null,D=null;const U=i.getParameter(i.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let B=!1,X=0;const H=i.getParameter(i.VERSION);H.indexOf("WebGL")!==-1?(X=parseFloat(/^WebGL (\d)/.exec(H)[1]),B=X>=1):H.indexOf("OpenGL ES")!==-1&&(X=parseFloat(/^OpenGL ES (\d)/.exec(H)[1]),B=X>=2);let Q=null,ct={};const ut=i.getParameter(i.SCISSOR_BOX),vt=i.getParameter(i.VIEWPORT),Et=new le().fromArray(ut),Nt=new le().fromArray(vt);function lt(V,bt,Tt,Ft){const Mt=new Uint8Array(4),ft=i.createTexture();i.bindTexture(V,ft),i.texParameteri(V,i.TEXTURE_MIN_FILTER,i.NEAREST),i.texParameteri(V,i.TEXTURE_MAG_FILTER,i.NEAREST);for(let zt=0;zt<Tt;zt++)V===i.TEXTURE_3D||V===i.TEXTURE_2D_ARRAY?i.texImage3D(bt,0,i.RGBA,1,1,Ft,0,i.RGBA,i.UNSIGNED_BYTE,Mt):i.texImage2D(bt+zt,0,i.RGBA,1,1,0,i.RGBA,i.UNSIGNED_BYTE,Mt);return ft}const G={};G[i.TEXTURE_2D]=lt(i.TEXTURE_2D,i.TEXTURE_2D,1),G[i.TEXTURE_CUBE_MAP]=lt(i.TEXTURE_CUBE_MAP,i.TEXTURE_CUBE_MAP_POSITIVE_X,6),G[i.TEXTURE_2D_ARRAY]=lt(i.TEXTURE_2D_ARRAY,i.TEXTURE_2D_ARRAY,1,1),G[i.TEXTURE_3D]=lt(i.TEXTURE_3D,i.TEXTURE_3D,1,1),s.setClear(0,0,0,1),a.setClear(1),o.setClear(0),J(i.DEPTH_TEST),a.setFunc(cs),et(!1),st(xh),J(i.CULL_FACE),Z(Vi);function J(V){h[V]!==!0&&(i.enable(V),h[V]=!0)}function z(V){h[V]!==!1&&(i.disable(V),h[V]=!1)}function W(V,bt){return u[V]!==bt?(i.bindFramebuffer(V,bt),u[V]=bt,V===i.DRAW_FRAMEBUFFER&&(u[i.FRAMEBUFFER]=bt),V===i.FRAMEBUFFER&&(u[i.DRAW_FRAMEBUFFER]=bt),!0):!1}function k(V,bt){let Tt=f,Ft=!1;if(V){Tt=d.get(bt),Tt===void 0&&(Tt=[],d.set(bt,Tt));const Mt=V.textures;if(Tt.length!==Mt.length||Tt[0]!==i.COLOR_ATTACHMENT0){for(let ft=0,zt=Mt.length;ft<zt;ft++)Tt[ft]=i.COLOR_ATTACHMENT0+ft;Tt.length=Mt.length,Ft=!0}}else Tt[0]!==i.BACK&&(Tt[0]=i.BACK,Ft=!0);Ft&&i.drawBuffers(Tt)}function K(V){return m!==V?(i.useProgram(V),m=V,!0):!1}const it={[ar]:i.FUNC_ADD,[A0]:i.FUNC_SUBTRACT,[R0]:i.FUNC_REVERSE_SUBTRACT};it[C0]=i.MIN,it[L0]=i.MAX;const I={[wf]:i.ZERO,[P0]:i.ONE,[Ef]:i.SRC_COLOR,[yc]:i.SRC_ALPHA,[O0]:i.SRC_ALPHA_SATURATE,[N0]:i.DST_COLOR,[I0]:i.DST_ALPHA,[D0]:i.ONE_MINUS_SRC_COLOR,[bc]:i.ONE_MINUS_SRC_ALPHA,[F0]:i.ONE_MINUS_DST_COLOR,[U0]:i.ONE_MINUS_DST_ALPHA,[B0]:i.CONSTANT_COLOR,[k0]:i.ONE_MINUS_CONSTANT_COLOR,[z0]:i.CONSTANT_ALPHA,[H0]:i.ONE_MINUS_CONSTANT_ALPHA};function Z(V,bt,Tt,Ft,Mt,ft,zt,Zt,pe,he){if(V===Vi){v===!0&&(z(i.BLEND),v=!1);return}if(v===!1&&(J(i.BLEND),v=!0),V!==Sf){if(V!==g||he!==x){if((p!==ar||_!==ar)&&(i.blendEquation(i.FUNC_ADD),p=ar,_=ar),he)switch(V){case ts:i.blendFuncSeparate(i.ONE,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case Mc:i.blendFunc(i.ONE,i.ONE);break;case _h:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case Mh:i.blendFuncSeparate(i.DST_COLOR,i.ONE_MINUS_SRC_ALPHA,i.ZERO,i.ONE);break;default:console.error("THREE.WebGLState: Invalid blending: ",V);break}else switch(V){case ts:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case Mc:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE,i.ONE,i.ONE);break;case _h:console.error("THREE.WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case Mh:console.error("THREE.WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:console.error("THREE.WebGLState: Invalid blending: ",V);break}y=null,M=null,w=null,E=null,A.set(0,0,0),R=0,g=V,x=he}return}Mt=Mt||bt,ft=ft||Tt,zt=zt||Ft,(bt!==p||Mt!==_)&&(i.blendEquationSeparate(it[bt],it[Mt]),p=bt,_=Mt),(Tt!==y||Ft!==M||ft!==w||zt!==E)&&(i.blendFuncSeparate(I[Tt],I[Ft],I[ft],I[zt]),y=Tt,M=Ft,w=ft,E=zt),(Zt.equals(A)===!1||pe!==R)&&(i.blendColor(Zt.r,Zt.g,Zt.b,pe),A.copy(Zt),R=pe),g=V,x=!1}function j(V,bt){V.side===je?z(i.CULL_FACE):J(i.CULL_FACE);let Tt=V.side===mn;bt&&(Tt=!Tt),et(Tt),V.blending===ts&&V.transparent===!1?Z(Vi):Z(V.blending,V.blendEquation,V.blendSrc,V.blendDst,V.blendEquationAlpha,V.blendSrcAlpha,V.blendDstAlpha,V.blendColor,V.blendAlpha,V.premultipliedAlpha),a.setFunc(V.depthFunc),a.setTest(V.depthTest),a.setMask(V.depthWrite),s.setMask(V.colorWrite);const Ft=V.stencilWrite;o.setTest(Ft),Ft&&(o.setMask(V.stencilWriteMask),o.setFunc(V.stencilFunc,V.stencilRef,V.stencilFuncMask),o.setOp(V.stencilFail,V.stencilZFail,V.stencilZPass)),pt(V.polygonOffset,V.polygonOffsetFactor,V.polygonOffsetUnits),V.alphaToCoverage===!0?J(i.SAMPLE_ALPHA_TO_COVERAGE):z(i.SAMPLE_ALPHA_TO_COVERAGE)}function et(V){b!==V&&(V?i.frontFace(i.CW):i.frontFace(i.CCW),b=V)}function st(V){V!==E0?(J(i.CULL_FACE),V!==S&&(V===xh?i.cullFace(i.BACK):V===T0?i.cullFace(i.FRONT):i.cullFace(i.FRONT_AND_BACK))):z(i.CULL_FACE),S=V}function ht(V){V!==T&&(B&&i.lineWidth(V),T=V)}function pt(V,bt,Tt){V?(J(i.POLYGON_OFFSET_FILL),(L!==bt||D!==Tt)&&(i.polygonOffset(bt,Tt),L=bt,D=Tt)):z(i.POLYGON_OFFSET_FILL)}function xt(V){V?J(i.SCISSOR_TEST):z(i.SCISSOR_TEST)}function Jt(V){V===void 0&&(V=i.TEXTURE0+U-1),Q!==V&&(i.activeTexture(V),Q=V)}function qt(V,bt,Tt){Tt===void 0&&(Q===null?Tt=i.TEXTURE0+U-1:Tt=Q);let Ft=ct[Tt];Ft===void 0&&(Ft={type:void 0,texture:void 0},ct[Tt]=Ft),(Ft.type!==V||Ft.texture!==bt)&&(Q!==Tt&&(i.activeTexture(Tt),Q=Tt),i.bindTexture(V,bt||G[V]),Ft.type=V,Ft.texture=bt)}function F(){const V=ct[Q];V!==void 0&&V.type!==void 0&&(i.bindTexture(V.type,null),V.type=void 0,V.texture=void 0)}function C(){try{i.compressedTexImage2D(...arguments)}catch(V){console.error("THREE.WebGLState:",V)}}function $(){try{i.compressedTexImage3D(...arguments)}catch(V){console.error("THREE.WebGLState:",V)}}function at(){try{i.texSubImage2D(...arguments)}catch(V){console.error("THREE.WebGLState:",V)}}function gt(){try{i.texSubImage3D(...arguments)}catch(V){console.error("THREE.WebGLState:",V)}}function ot(){try{i.compressedTexSubImage2D(...arguments)}catch(V){console.error("THREE.WebGLState:",V)}}function Ht(){try{i.compressedTexSubImage3D(...arguments)}catch(V){console.error("THREE.WebGLState:",V)}}function wt(){try{i.texStorage2D(...arguments)}catch(V){console.error("THREE.WebGLState:",V)}}function Bt(){try{i.texStorage3D(...arguments)}catch(V){console.error("THREE.WebGLState:",V)}}function kt(){try{i.texImage2D(...arguments)}catch(V){console.error("THREE.WebGLState:",V)}}function _t(){try{i.texImage3D(...arguments)}catch(V){console.error("THREE.WebGLState:",V)}}function Lt(V){Et.equals(V)===!1&&(i.scissor(V.x,V.y,V.z,V.w),Et.copy(V))}function Yt(V){Nt.equals(V)===!1&&(i.viewport(V.x,V.y,V.z,V.w),Nt.copy(V))}function Vt(V,bt){let Tt=l.get(bt);Tt===void 0&&(Tt=new WeakMap,l.set(bt,Tt));let Ft=Tt.get(V);Ft===void 0&&(Ft=i.getUniformBlockIndex(bt,V.name),Tt.set(V,Ft))}function Rt(V,bt){const Ft=l.get(bt).get(V);c.get(bt)!==Ft&&(i.uniformBlockBinding(bt,Ft,V.__bindingPointIndex),c.set(bt,Ft))}function Qt(){i.disable(i.BLEND),i.disable(i.CULL_FACE),i.disable(i.DEPTH_TEST),i.disable(i.POLYGON_OFFSET_FILL),i.disable(i.SCISSOR_TEST),i.disable(i.STENCIL_TEST),i.disable(i.SAMPLE_ALPHA_TO_COVERAGE),i.blendEquation(i.FUNC_ADD),i.blendFunc(i.ONE,i.ZERO),i.blendFuncSeparate(i.ONE,i.ZERO,i.ONE,i.ZERO),i.blendColor(0,0,0,0),i.colorMask(!0,!0,!0,!0),i.clearColor(0,0,0,0),i.depthMask(!0),i.depthFunc(i.LESS),a.setReversed(!1),i.clearDepth(1),i.stencilMask(4294967295),i.stencilFunc(i.ALWAYS,0,4294967295),i.stencilOp(i.KEEP,i.KEEP,i.KEEP),i.clearStencil(0),i.cullFace(i.BACK),i.frontFace(i.CCW),i.polygonOffset(0,0),i.activeTexture(i.TEXTURE0),i.bindFramebuffer(i.FRAMEBUFFER,null),i.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),i.bindFramebuffer(i.READ_FRAMEBUFFER,null),i.useProgram(null),i.lineWidth(1),i.scissor(0,0,i.canvas.width,i.canvas.height),i.viewport(0,0,i.canvas.width,i.canvas.height),h={},Q=null,ct={},u={},d=new WeakMap,f=[],m=null,v=!1,g=null,p=null,y=null,M=null,_=null,w=null,E=null,A=new Ut(0,0,0),R=0,x=!1,b=null,S=null,T=null,L=null,D=null,Et.set(0,0,i.canvas.width,i.canvas.height),Nt.set(0,0,i.canvas.width,i.canvas.height),s.reset(),a.reset(),o.reset()}return{buffers:{color:s,depth:a,stencil:o},enable:J,disable:z,bindFramebuffer:W,drawBuffers:k,useProgram:K,setBlending:Z,setMaterial:j,setFlipSided:et,setCullFace:st,setLineWidth:ht,setPolygonOffset:pt,setScissorTest:xt,activeTexture:Jt,bindTexture:qt,unbindTexture:F,compressedTexImage2D:C,compressedTexImage3D:$,texImage2D:kt,texImage3D:_t,updateUBOMapping:Vt,uniformBlockBinding:Rt,texStorage2D:wt,texStorage3D:Bt,texSubImage2D:at,texSubImage3D:gt,compressedTexSubImage2D:ot,compressedTexSubImage3D:Ht,scissor:Lt,viewport:Yt,reset:Qt}}function __(i,t,e,n,r,s,a){const o=t.has("WEBGL_multisampled_render_to_texture")?t.get("WEBGL_multisampled_render_to_texture"):null,c=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),l=new dt,h=new WeakMap;let u;const d=new WeakMap;let f=!1;try{f=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function m(F,C){return f?new OffscreenCanvas(F,C):so("canvas")}function v(F,C,$){let at=1;const gt=qt(F);if((gt.width>$||gt.height>$)&&(at=$/Math.max(gt.width,gt.height)),at<1)if(typeof HTMLImageElement<"u"&&F instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&F instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&F instanceof ImageBitmap||typeof VideoFrame<"u"&&F instanceof VideoFrame){const ot=Math.floor(at*gt.width),Ht=Math.floor(at*gt.height);u===void 0&&(u=m(ot,Ht));const wt=C?m(ot,Ht):u;return wt.width=ot,wt.height=Ht,wt.getContext("2d").drawImage(F,0,0,ot,Ht),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+gt.width+"x"+gt.height+") to ("+ot+"x"+Ht+")."),wt}else return"data"in F&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+gt.width+"x"+gt.height+")."),F;return F}function g(F){return F.generateMipmaps}function p(F){i.generateMipmap(F)}function y(F){return F.isWebGLCubeRenderTarget?i.TEXTURE_CUBE_MAP:F.isWebGL3DRenderTarget?i.TEXTURE_3D:F.isWebGLArrayRenderTarget||F.isCompressedArrayTexture?i.TEXTURE_2D_ARRAY:i.TEXTURE_2D}function M(F,C,$,at,gt=!1){if(F!==null){if(i[F]!==void 0)return i[F];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+F+"'")}let ot=C;if(C===i.RED&&($===i.FLOAT&&(ot=i.R32F),$===i.HALF_FLOAT&&(ot=i.R16F),$===i.UNSIGNED_BYTE&&(ot=i.R8)),C===i.RED_INTEGER&&($===i.UNSIGNED_BYTE&&(ot=i.R8UI),$===i.UNSIGNED_SHORT&&(ot=i.R16UI),$===i.UNSIGNED_INT&&(ot=i.R32UI),$===i.BYTE&&(ot=i.R8I),$===i.SHORT&&(ot=i.R16I),$===i.INT&&(ot=i.R32I)),C===i.RG&&($===i.FLOAT&&(ot=i.RG32F),$===i.HALF_FLOAT&&(ot=i.RG16F),$===i.UNSIGNED_BYTE&&(ot=i.RG8)),C===i.RG_INTEGER&&($===i.UNSIGNED_BYTE&&(ot=i.RG8UI),$===i.UNSIGNED_SHORT&&(ot=i.RG16UI),$===i.UNSIGNED_INT&&(ot=i.RG32UI),$===i.BYTE&&(ot=i.RG8I),$===i.SHORT&&(ot=i.RG16I),$===i.INT&&(ot=i.RG32I)),C===i.RGB_INTEGER&&($===i.UNSIGNED_BYTE&&(ot=i.RGB8UI),$===i.UNSIGNED_SHORT&&(ot=i.RGB16UI),$===i.UNSIGNED_INT&&(ot=i.RGB32UI),$===i.BYTE&&(ot=i.RGB8I),$===i.SHORT&&(ot=i.RGB16I),$===i.INT&&(ot=i.RGB32I)),C===i.RGBA_INTEGER&&($===i.UNSIGNED_BYTE&&(ot=i.RGBA8UI),$===i.UNSIGNED_SHORT&&(ot=i.RGBA16UI),$===i.UNSIGNED_INT&&(ot=i.RGBA32UI),$===i.BYTE&&(ot=i.RGBA8I),$===i.SHORT&&(ot=i.RGBA16I),$===i.INT&&(ot=i.RGBA32I)),C===i.RGB&&($===i.UNSIGNED_INT_5_9_9_9_REV&&(ot=i.RGB9_E5),$===i.UNSIGNED_INT_10F_11F_11F_REV&&(ot=i.R11F_G11F_B10F)),C===i.RGBA){const Ht=gt?io:ce.getTransfer(at);$===i.FLOAT&&(ot=i.RGBA32F),$===i.HALF_FLOAT&&(ot=i.RGBA16F),$===i.UNSIGNED_BYTE&&(ot=Ht===fe?i.SRGB8_ALPHA8:i.RGBA8),$===i.UNSIGNED_SHORT_4_4_4_4&&(ot=i.RGBA4),$===i.UNSIGNED_SHORT_5_5_5_1&&(ot=i.RGB5_A1)}return(ot===i.R16F||ot===i.R32F||ot===i.RG16F||ot===i.RG32F||ot===i.RGBA16F||ot===i.RGBA32F)&&t.get("EXT_color_buffer_float"),ot}function _(F,C){let $;return F?C===null||C===mr||C===Hs?$=i.DEPTH24_STENCIL8:C===ri?$=i.DEPTH32F_STENCIL8:C===zs&&($=i.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):C===null||C===mr||C===Hs?$=i.DEPTH_COMPONENT24:C===ri?$=i.DEPTH_COMPONENT32F:C===zs&&($=i.DEPTH_COMPONENT16),$}function w(F,C){return g(F)===!0||F.isFramebufferTexture&&F.minFilter!==An&&F.minFilter!==xe?Math.log2(Math.max(C.width,C.height))+1:F.mipmaps!==void 0&&F.mipmaps.length>0?F.mipmaps.length:F.isCompressedTexture&&Array.isArray(F.image)?C.mipmaps.length:1}function E(F){const C=F.target;C.removeEventListener("dispose",E),R(C),C.isVideoTexture&&h.delete(C)}function A(F){const C=F.target;C.removeEventListener("dispose",A),b(C)}function R(F){const C=n.get(F);if(C.__webglInit===void 0)return;const $=F.source,at=d.get($);if(at){const gt=at[C.__cacheKey];gt.usedTimes--,gt.usedTimes===0&&x(F),Object.keys(at).length===0&&d.delete($)}n.remove(F)}function x(F){const C=n.get(F);i.deleteTexture(C.__webglTexture);const $=F.source,at=d.get($);delete at[C.__cacheKey],a.memory.textures--}function b(F){const C=n.get(F);if(F.depthTexture&&(F.depthTexture.dispose(),n.remove(F.depthTexture)),F.isWebGLCubeRenderTarget)for(let at=0;at<6;at++){if(Array.isArray(C.__webglFramebuffer[at]))for(let gt=0;gt<C.__webglFramebuffer[at].length;gt++)i.deleteFramebuffer(C.__webglFramebuffer[at][gt]);else i.deleteFramebuffer(C.__webglFramebuffer[at]);C.__webglDepthbuffer&&i.deleteRenderbuffer(C.__webglDepthbuffer[at])}else{if(Array.isArray(C.__webglFramebuffer))for(let at=0;at<C.__webglFramebuffer.length;at++)i.deleteFramebuffer(C.__webglFramebuffer[at]);else i.deleteFramebuffer(C.__webglFramebuffer);if(C.__webglDepthbuffer&&i.deleteRenderbuffer(C.__webglDepthbuffer),C.__webglMultisampledFramebuffer&&i.deleteFramebuffer(C.__webglMultisampledFramebuffer),C.__webglColorRenderbuffer)for(let at=0;at<C.__webglColorRenderbuffer.length;at++)C.__webglColorRenderbuffer[at]&&i.deleteRenderbuffer(C.__webglColorRenderbuffer[at]);C.__webglDepthRenderbuffer&&i.deleteRenderbuffer(C.__webglDepthRenderbuffer)}const $=F.textures;for(let at=0,gt=$.length;at<gt;at++){const ot=n.get($[at]);ot.__webglTexture&&(i.deleteTexture(ot.__webglTexture),a.memory.textures--),n.remove($[at])}n.remove(F)}let S=0;function T(){S=0}function L(){const F=S;return F>=r.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+F+" texture units while this GPU supports only "+r.maxTextures),S+=1,F}function D(F){const C=[];return C.push(F.wrapS),C.push(F.wrapT),C.push(F.wrapR||0),C.push(F.magFilter),C.push(F.minFilter),C.push(F.anisotropy),C.push(F.internalFormat),C.push(F.format),C.push(F.type),C.push(F.generateMipmaps),C.push(F.premultiplyAlpha),C.push(F.flipY),C.push(F.unpackAlignment),C.push(F.colorSpace),C.join()}function U(F,C){const $=n.get(F);if(F.isVideoTexture&&xt(F),F.isRenderTargetTexture===!1&&F.isExternalTexture!==!0&&F.version>0&&$.__version!==F.version){const at=F.image;if(at===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(at.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{G($,F,C);return}}else F.isExternalTexture&&($.__webglTexture=F.sourceTexture?F.sourceTexture:null);e.bindTexture(i.TEXTURE_2D,$.__webglTexture,i.TEXTURE0+C)}function B(F,C){const $=n.get(F);if(F.isRenderTargetTexture===!1&&F.version>0&&$.__version!==F.version){G($,F,C);return}e.bindTexture(i.TEXTURE_2D_ARRAY,$.__webglTexture,i.TEXTURE0+C)}function X(F,C){const $=n.get(F);if(F.isRenderTargetTexture===!1&&F.version>0&&$.__version!==F.version){G($,F,C);return}e.bindTexture(i.TEXTURE_3D,$.__webglTexture,i.TEXTURE0+C)}function H(F,C){const $=n.get(F);if(F.version>0&&$.__version!==F.version){J($,F,C);return}e.bindTexture(i.TEXTURE_CUBE_MAP,$.__webglTexture,i.TEXTURE0+C)}const Q={[us]:i.REPEAT,[cr]:i.CLAMP_TO_EDGE,[Pc]:i.MIRRORED_REPEAT},ct={[An]:i.NEAREST,[Z0]:i.NEAREST_MIPMAP_NEAREST,[ha]:i.NEAREST_MIPMAP_LINEAR,[xe]:i.LINEAR,[wo]:i.LINEAR_MIPMAP_NEAREST,[ki]:i.LINEAR_MIPMAP_LINEAR},ut={[ep]:i.NEVER,[op]:i.ALWAYS,[np]:i.LESS,[Bf]:i.LEQUAL,[ip]:i.EQUAL,[ap]:i.GEQUAL,[rp]:i.GREATER,[sp]:i.NOTEQUAL};function vt(F,C){if(C.type===ri&&t.has("OES_texture_float_linear")===!1&&(C.magFilter===xe||C.magFilter===wo||C.magFilter===ha||C.magFilter===ki||C.minFilter===xe||C.minFilter===wo||C.minFilter===ha||C.minFilter===ki)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),i.texParameteri(F,i.TEXTURE_WRAP_S,Q[C.wrapS]),i.texParameteri(F,i.TEXTURE_WRAP_T,Q[C.wrapT]),(F===i.TEXTURE_3D||F===i.TEXTURE_2D_ARRAY)&&i.texParameteri(F,i.TEXTURE_WRAP_R,Q[C.wrapR]),i.texParameteri(F,i.TEXTURE_MAG_FILTER,ct[C.magFilter]),i.texParameteri(F,i.TEXTURE_MIN_FILTER,ct[C.minFilter]),C.compareFunction&&(i.texParameteri(F,i.TEXTURE_COMPARE_MODE,i.COMPARE_REF_TO_TEXTURE),i.texParameteri(F,i.TEXTURE_COMPARE_FUNC,ut[C.compareFunction])),t.has("EXT_texture_filter_anisotropic")===!0){if(C.magFilter===An||C.minFilter!==ha&&C.minFilter!==ki||C.type===ri&&t.has("OES_texture_float_linear")===!1)return;if(C.anisotropy>1||n.get(C).__currentAnisotropy){const $=t.get("EXT_texture_filter_anisotropic");i.texParameterf(F,$.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(C.anisotropy,r.getMaxAnisotropy())),n.get(C).__currentAnisotropy=C.anisotropy}}}function Et(F,C){let $=!1;F.__webglInit===void 0&&(F.__webglInit=!0,C.addEventListener("dispose",E));const at=C.source;let gt=d.get(at);gt===void 0&&(gt={},d.set(at,gt));const ot=D(C);if(ot!==F.__cacheKey){gt[ot]===void 0&&(gt[ot]={texture:i.createTexture(),usedTimes:0},a.memory.textures++,$=!0),gt[ot].usedTimes++;const Ht=gt[F.__cacheKey];Ht!==void 0&&(gt[F.__cacheKey].usedTimes--,Ht.usedTimes===0&&x(C)),F.__cacheKey=ot,F.__webglTexture=gt[ot].texture}return $}function Nt(F,C,$){return Math.floor(Math.floor(F/$)/C)}function lt(F,C,$,at){const ot=F.updateRanges;if(ot.length===0)e.texSubImage2D(i.TEXTURE_2D,0,0,0,C.width,C.height,$,at,C.data);else{ot.sort((_t,Lt)=>_t.start-Lt.start);let Ht=0;for(let _t=1;_t<ot.length;_t++){const Lt=ot[Ht],Yt=ot[_t],Vt=Lt.start+Lt.count,Rt=Nt(Yt.start,C.width,4),Qt=Nt(Lt.start,C.width,4);Yt.start<=Vt+1&&Rt===Qt&&Nt(Yt.start+Yt.count-1,C.width,4)===Rt?Lt.count=Math.max(Lt.count,Yt.start+Yt.count-Lt.start):(++Ht,ot[Ht]=Yt)}ot.length=Ht+1;const wt=i.getParameter(i.UNPACK_ROW_LENGTH),Bt=i.getParameter(i.UNPACK_SKIP_PIXELS),kt=i.getParameter(i.UNPACK_SKIP_ROWS);i.pixelStorei(i.UNPACK_ROW_LENGTH,C.width);for(let _t=0,Lt=ot.length;_t<Lt;_t++){const Yt=ot[_t],Vt=Math.floor(Yt.start/4),Rt=Math.ceil(Yt.count/4),Qt=Vt%C.width,V=Math.floor(Vt/C.width),bt=Rt,Tt=1;i.pixelStorei(i.UNPACK_SKIP_PIXELS,Qt),i.pixelStorei(i.UNPACK_SKIP_ROWS,V),e.texSubImage2D(i.TEXTURE_2D,0,Qt,V,bt,Tt,$,at,C.data)}F.clearUpdateRanges(),i.pixelStorei(i.UNPACK_ROW_LENGTH,wt),i.pixelStorei(i.UNPACK_SKIP_PIXELS,Bt),i.pixelStorei(i.UNPACK_SKIP_ROWS,kt)}}function G(F,C,$){let at=i.TEXTURE_2D;(C.isDataArrayTexture||C.isCompressedArrayTexture)&&(at=i.TEXTURE_2D_ARRAY),C.isData3DTexture&&(at=i.TEXTURE_3D);const gt=Et(F,C),ot=C.source;e.bindTexture(at,F.__webglTexture,i.TEXTURE0+$);const Ht=n.get(ot);if(ot.version!==Ht.__version||gt===!0){e.activeTexture(i.TEXTURE0+$);const wt=ce.getPrimaries(ce.workingColorSpace),Bt=C.colorSpace===ii?null:ce.getPrimaries(C.colorSpace),kt=C.colorSpace===ii||wt===Bt?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,C.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,C.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,C.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,kt);let _t=v(C.image,!1,r.maxTextureSize);_t=Jt(C,_t);const Lt=s.convert(C.format,C.colorSpace),Yt=s.convert(C.type);let Vt=M(C.internalFormat,Lt,Yt,C.colorSpace,C.isVideoTexture);vt(at,C);let Rt;const Qt=C.mipmaps,V=C.isVideoTexture!==!0,bt=Ht.__version===void 0||gt===!0,Tt=ot.dataReady,Ft=w(C,_t);if(C.isDepthTexture)Vt=_(C.format===Gs,C.type),bt&&(V?e.texStorage2D(i.TEXTURE_2D,1,Vt,_t.width,_t.height):e.texImage2D(i.TEXTURE_2D,0,Vt,_t.width,_t.height,0,Lt,Yt,null));else if(C.isDataTexture)if(Qt.length>0){V&&bt&&e.texStorage2D(i.TEXTURE_2D,Ft,Vt,Qt[0].width,Qt[0].height);for(let Mt=0,ft=Qt.length;Mt<ft;Mt++)Rt=Qt[Mt],V?Tt&&e.texSubImage2D(i.TEXTURE_2D,Mt,0,0,Rt.width,Rt.height,Lt,Yt,Rt.data):e.texImage2D(i.TEXTURE_2D,Mt,Vt,Rt.width,Rt.height,0,Lt,Yt,Rt.data);C.generateMipmaps=!1}else V?(bt&&e.texStorage2D(i.TEXTURE_2D,Ft,Vt,_t.width,_t.height),Tt&&lt(C,_t,Lt,Yt)):e.texImage2D(i.TEXTURE_2D,0,Vt,_t.width,_t.height,0,Lt,Yt,_t.data);else if(C.isCompressedTexture)if(C.isCompressedArrayTexture){V&&bt&&e.texStorage3D(i.TEXTURE_2D_ARRAY,Ft,Vt,Qt[0].width,Qt[0].height,_t.depth);for(let Mt=0,ft=Qt.length;Mt<ft;Mt++)if(Rt=Qt[Mt],C.format!==We)if(Lt!==null)if(V){if(Tt)if(C.layerUpdates.size>0){const zt=su(Rt.width,Rt.height,C.format,C.type);for(const Zt of C.layerUpdates){const pe=Rt.data.subarray(Zt*zt/Rt.data.BYTES_PER_ELEMENT,(Zt+1)*zt/Rt.data.BYTES_PER_ELEMENT);e.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,Mt,0,0,Zt,Rt.width,Rt.height,1,Lt,pe)}C.clearLayerUpdates()}else e.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,Mt,0,0,0,Rt.width,Rt.height,_t.depth,Lt,Rt.data)}else e.compressedTexImage3D(i.TEXTURE_2D_ARRAY,Mt,Vt,Rt.width,Rt.height,_t.depth,0,Rt.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else V?Tt&&e.texSubImage3D(i.TEXTURE_2D_ARRAY,Mt,0,0,0,Rt.width,Rt.height,_t.depth,Lt,Yt,Rt.data):e.texImage3D(i.TEXTURE_2D_ARRAY,Mt,Vt,Rt.width,Rt.height,_t.depth,0,Lt,Yt,Rt.data)}else{V&&bt&&e.texStorage2D(i.TEXTURE_2D,Ft,Vt,Qt[0].width,Qt[0].height);for(let Mt=0,ft=Qt.length;Mt<ft;Mt++)Rt=Qt[Mt],C.format!==We?Lt!==null?V?Tt&&e.compressedTexSubImage2D(i.TEXTURE_2D,Mt,0,0,Rt.width,Rt.height,Lt,Rt.data):e.compressedTexImage2D(i.TEXTURE_2D,Mt,Vt,Rt.width,Rt.height,0,Rt.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):V?Tt&&e.texSubImage2D(i.TEXTURE_2D,Mt,0,0,Rt.width,Rt.height,Lt,Yt,Rt.data):e.texImage2D(i.TEXTURE_2D,Mt,Vt,Rt.width,Rt.height,0,Lt,Yt,Rt.data)}else if(C.isDataArrayTexture)if(V){if(bt&&e.texStorage3D(i.TEXTURE_2D_ARRAY,Ft,Vt,_t.width,_t.height,_t.depth),Tt)if(C.layerUpdates.size>0){const Mt=su(_t.width,_t.height,C.format,C.type);for(const ft of C.layerUpdates){const zt=_t.data.subarray(ft*Mt/_t.data.BYTES_PER_ELEMENT,(ft+1)*Mt/_t.data.BYTES_PER_ELEMENT);e.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,ft,_t.width,_t.height,1,Lt,Yt,zt)}C.clearLayerUpdates()}else e.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,0,_t.width,_t.height,_t.depth,Lt,Yt,_t.data)}else e.texImage3D(i.TEXTURE_2D_ARRAY,0,Vt,_t.width,_t.height,_t.depth,0,Lt,Yt,_t.data);else if(C.isData3DTexture)V?(bt&&e.texStorage3D(i.TEXTURE_3D,Ft,Vt,_t.width,_t.height,_t.depth),Tt&&e.texSubImage3D(i.TEXTURE_3D,0,0,0,0,_t.width,_t.height,_t.depth,Lt,Yt,_t.data)):e.texImage3D(i.TEXTURE_3D,0,Vt,_t.width,_t.height,_t.depth,0,Lt,Yt,_t.data);else if(C.isFramebufferTexture){if(bt)if(V)e.texStorage2D(i.TEXTURE_2D,Ft,Vt,_t.width,_t.height);else{let Mt=_t.width,ft=_t.height;for(let zt=0;zt<Ft;zt++)e.texImage2D(i.TEXTURE_2D,zt,Vt,Mt,ft,0,Lt,Yt,null),Mt>>=1,ft>>=1}}else if(Qt.length>0){if(V&&bt){const Mt=qt(Qt[0]);e.texStorage2D(i.TEXTURE_2D,Ft,Vt,Mt.width,Mt.height)}for(let Mt=0,ft=Qt.length;Mt<ft;Mt++)Rt=Qt[Mt],V?Tt&&e.texSubImage2D(i.TEXTURE_2D,Mt,0,0,Lt,Yt,Rt):e.texImage2D(i.TEXTURE_2D,Mt,Vt,Lt,Yt,Rt);C.generateMipmaps=!1}else if(V){if(bt){const Mt=qt(_t);e.texStorage2D(i.TEXTURE_2D,Ft,Vt,Mt.width,Mt.height)}Tt&&e.texSubImage2D(i.TEXTURE_2D,0,0,0,Lt,Yt,_t)}else e.texImage2D(i.TEXTURE_2D,0,Vt,Lt,Yt,_t);g(C)&&p(at),Ht.__version=ot.version,C.onUpdate&&C.onUpdate(C)}F.__version=C.version}function J(F,C,$){if(C.image.length!==6)return;const at=Et(F,C),gt=C.source;e.bindTexture(i.TEXTURE_CUBE_MAP,F.__webglTexture,i.TEXTURE0+$);const ot=n.get(gt);if(gt.version!==ot.__version||at===!0){e.activeTexture(i.TEXTURE0+$);const Ht=ce.getPrimaries(ce.workingColorSpace),wt=C.colorSpace===ii?null:ce.getPrimaries(C.colorSpace),Bt=C.colorSpace===ii||Ht===wt?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,C.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,C.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,C.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,Bt);const kt=C.isCompressedTexture||C.image[0].isCompressedTexture,_t=C.image[0]&&C.image[0].isDataTexture,Lt=[];for(let ft=0;ft<6;ft++)!kt&&!_t?Lt[ft]=v(C.image[ft],!0,r.maxCubemapSize):Lt[ft]=_t?C.image[ft].image:C.image[ft],Lt[ft]=Jt(C,Lt[ft]);const Yt=Lt[0],Vt=s.convert(C.format,C.colorSpace),Rt=s.convert(C.type),Qt=M(C.internalFormat,Vt,Rt,C.colorSpace),V=C.isVideoTexture!==!0,bt=ot.__version===void 0||at===!0,Tt=gt.dataReady;let Ft=w(C,Yt);vt(i.TEXTURE_CUBE_MAP,C);let Mt;if(kt){V&&bt&&e.texStorage2D(i.TEXTURE_CUBE_MAP,Ft,Qt,Yt.width,Yt.height);for(let ft=0;ft<6;ft++){Mt=Lt[ft].mipmaps;for(let zt=0;zt<Mt.length;zt++){const Zt=Mt[zt];C.format!==We?Vt!==null?V?Tt&&e.compressedTexSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ft,zt,0,0,Zt.width,Zt.height,Vt,Zt.data):e.compressedTexImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ft,zt,Qt,Zt.width,Zt.height,0,Zt.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):V?Tt&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ft,zt,0,0,Zt.width,Zt.height,Vt,Rt,Zt.data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ft,zt,Qt,Zt.width,Zt.height,0,Vt,Rt,Zt.data)}}}else{if(Mt=C.mipmaps,V&&bt){Mt.length>0&&Ft++;const ft=qt(Lt[0]);e.texStorage2D(i.TEXTURE_CUBE_MAP,Ft,Qt,ft.width,ft.height)}for(let ft=0;ft<6;ft++)if(_t){V?Tt&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ft,0,0,0,Lt[ft].width,Lt[ft].height,Vt,Rt,Lt[ft].data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ft,0,Qt,Lt[ft].width,Lt[ft].height,0,Vt,Rt,Lt[ft].data);for(let zt=0;zt<Mt.length;zt++){const pe=Mt[zt].image[ft].image;V?Tt&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ft,zt+1,0,0,pe.width,pe.height,Vt,Rt,pe.data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ft,zt+1,Qt,pe.width,pe.height,0,Vt,Rt,pe.data)}}else{V?Tt&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ft,0,0,0,Vt,Rt,Lt[ft]):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ft,0,Qt,Vt,Rt,Lt[ft]);for(let zt=0;zt<Mt.length;zt++){const Zt=Mt[zt];V?Tt&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ft,zt+1,0,0,Vt,Rt,Zt.image[ft]):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ft,zt+1,Qt,Vt,Rt,Zt.image[ft])}}}g(C)&&p(i.TEXTURE_CUBE_MAP),ot.__version=gt.version,C.onUpdate&&C.onUpdate(C)}F.__version=C.version}function z(F,C,$,at,gt,ot){const Ht=s.convert($.format,$.colorSpace),wt=s.convert($.type),Bt=M($.internalFormat,Ht,wt,$.colorSpace),kt=n.get(C),_t=n.get($);if(_t.__renderTarget=C,!kt.__hasExternalTextures){const Lt=Math.max(1,C.width>>ot),Yt=Math.max(1,C.height>>ot);gt===i.TEXTURE_3D||gt===i.TEXTURE_2D_ARRAY?e.texImage3D(gt,ot,Bt,Lt,Yt,C.depth,0,Ht,wt,null):e.texImage2D(gt,ot,Bt,Lt,Yt,0,Ht,wt,null)}e.bindFramebuffer(i.FRAMEBUFFER,F),pt(C)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,at,gt,_t.__webglTexture,0,ht(C)):(gt===i.TEXTURE_2D||gt>=i.TEXTURE_CUBE_MAP_POSITIVE_X&&gt<=i.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&i.framebufferTexture2D(i.FRAMEBUFFER,at,gt,_t.__webglTexture,ot),e.bindFramebuffer(i.FRAMEBUFFER,null)}function W(F,C,$){if(i.bindRenderbuffer(i.RENDERBUFFER,F),C.depthBuffer){const at=C.depthTexture,gt=at&&at.isDepthTexture?at.type:null,ot=_(C.stencilBuffer,gt),Ht=C.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,wt=ht(C);pt(C)?o.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,wt,ot,C.width,C.height):$?i.renderbufferStorageMultisample(i.RENDERBUFFER,wt,ot,C.width,C.height):i.renderbufferStorage(i.RENDERBUFFER,ot,C.width,C.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,Ht,i.RENDERBUFFER,F)}else{const at=C.textures;for(let gt=0;gt<at.length;gt++){const ot=at[gt],Ht=s.convert(ot.format,ot.colorSpace),wt=s.convert(ot.type),Bt=M(ot.internalFormat,Ht,wt,ot.colorSpace),kt=ht(C);$&&pt(C)===!1?i.renderbufferStorageMultisample(i.RENDERBUFFER,kt,Bt,C.width,C.height):pt(C)?o.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,kt,Bt,C.width,C.height):i.renderbufferStorage(i.RENDERBUFFER,Bt,C.width,C.height)}}i.bindRenderbuffer(i.RENDERBUFFER,null)}function k(F,C){if(C&&C.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(e.bindFramebuffer(i.FRAMEBUFFER,F),!(C.depthTexture&&C.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");const at=n.get(C.depthTexture);at.__renderTarget=C,(!at.__webglTexture||C.depthTexture.image.width!==C.width||C.depthTexture.image.height!==C.height)&&(C.depthTexture.image.width=C.width,C.depthTexture.image.height=C.height,C.depthTexture.needsUpdate=!0),U(C.depthTexture,0);const gt=at.__webglTexture,ot=ht(C);if(C.depthTexture.format===Vs)pt(C)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,gt,0,ot):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,gt,0);else if(C.depthTexture.format===Gs)pt(C)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,gt,0,ot):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,gt,0);else throw new Error("Unknown depthTexture format")}function K(F){const C=n.get(F),$=F.isWebGLCubeRenderTarget===!0;if(C.__boundDepthTexture!==F.depthTexture){const at=F.depthTexture;if(C.__depthDisposeCallback&&C.__depthDisposeCallback(),at){const gt=()=>{delete C.__boundDepthTexture,delete C.__depthDisposeCallback,at.removeEventListener("dispose",gt)};at.addEventListener("dispose",gt),C.__depthDisposeCallback=gt}C.__boundDepthTexture=at}if(F.depthTexture&&!C.__autoAllocateDepthBuffer){if($)throw new Error("target.depthTexture not supported in Cube render targets");const at=F.texture.mipmaps;at&&at.length>0?k(C.__webglFramebuffer[0],F):k(C.__webglFramebuffer,F)}else if($){C.__webglDepthbuffer=[];for(let at=0;at<6;at++)if(e.bindFramebuffer(i.FRAMEBUFFER,C.__webglFramebuffer[at]),C.__webglDepthbuffer[at]===void 0)C.__webglDepthbuffer[at]=i.createRenderbuffer(),W(C.__webglDepthbuffer[at],F,!1);else{const gt=F.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,ot=C.__webglDepthbuffer[at];i.bindRenderbuffer(i.RENDERBUFFER,ot),i.framebufferRenderbuffer(i.FRAMEBUFFER,gt,i.RENDERBUFFER,ot)}}else{const at=F.texture.mipmaps;if(at&&at.length>0?e.bindFramebuffer(i.FRAMEBUFFER,C.__webglFramebuffer[0]):e.bindFramebuffer(i.FRAMEBUFFER,C.__webglFramebuffer),C.__webglDepthbuffer===void 0)C.__webglDepthbuffer=i.createRenderbuffer(),W(C.__webglDepthbuffer,F,!1);else{const gt=F.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,ot=C.__webglDepthbuffer;i.bindRenderbuffer(i.RENDERBUFFER,ot),i.framebufferRenderbuffer(i.FRAMEBUFFER,gt,i.RENDERBUFFER,ot)}}e.bindFramebuffer(i.FRAMEBUFFER,null)}function it(F,C,$){const at=n.get(F);C!==void 0&&z(at.__webglFramebuffer,F,F.texture,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,0),$!==void 0&&K(F)}function I(F){const C=F.texture,$=n.get(F),at=n.get(C);F.addEventListener("dispose",A);const gt=F.textures,ot=F.isWebGLCubeRenderTarget===!0,Ht=gt.length>1;if(Ht||(at.__webglTexture===void 0&&(at.__webglTexture=i.createTexture()),at.__version=C.version,a.memory.textures++),ot){$.__webglFramebuffer=[];for(let wt=0;wt<6;wt++)if(C.mipmaps&&C.mipmaps.length>0){$.__webglFramebuffer[wt]=[];for(let Bt=0;Bt<C.mipmaps.length;Bt++)$.__webglFramebuffer[wt][Bt]=i.createFramebuffer()}else $.__webglFramebuffer[wt]=i.createFramebuffer()}else{if(C.mipmaps&&C.mipmaps.length>0){$.__webglFramebuffer=[];for(let wt=0;wt<C.mipmaps.length;wt++)$.__webglFramebuffer[wt]=i.createFramebuffer()}else $.__webglFramebuffer=i.createFramebuffer();if(Ht)for(let wt=0,Bt=gt.length;wt<Bt;wt++){const kt=n.get(gt[wt]);kt.__webglTexture===void 0&&(kt.__webglTexture=i.createTexture(),a.memory.textures++)}if(F.samples>0&&pt(F)===!1){$.__webglMultisampledFramebuffer=i.createFramebuffer(),$.__webglColorRenderbuffer=[],e.bindFramebuffer(i.FRAMEBUFFER,$.__webglMultisampledFramebuffer);for(let wt=0;wt<gt.length;wt++){const Bt=gt[wt];$.__webglColorRenderbuffer[wt]=i.createRenderbuffer(),i.bindRenderbuffer(i.RENDERBUFFER,$.__webglColorRenderbuffer[wt]);const kt=s.convert(Bt.format,Bt.colorSpace),_t=s.convert(Bt.type),Lt=M(Bt.internalFormat,kt,_t,Bt.colorSpace,F.isXRRenderTarget===!0),Yt=ht(F);i.renderbufferStorageMultisample(i.RENDERBUFFER,Yt,Lt,F.width,F.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+wt,i.RENDERBUFFER,$.__webglColorRenderbuffer[wt])}i.bindRenderbuffer(i.RENDERBUFFER,null),F.depthBuffer&&($.__webglDepthRenderbuffer=i.createRenderbuffer(),W($.__webglDepthRenderbuffer,F,!0)),e.bindFramebuffer(i.FRAMEBUFFER,null)}}if(ot){e.bindTexture(i.TEXTURE_CUBE_MAP,at.__webglTexture),vt(i.TEXTURE_CUBE_MAP,C);for(let wt=0;wt<6;wt++)if(C.mipmaps&&C.mipmaps.length>0)for(let Bt=0;Bt<C.mipmaps.length;Bt++)z($.__webglFramebuffer[wt][Bt],F,C,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+wt,Bt);else z($.__webglFramebuffer[wt],F,C,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+wt,0);g(C)&&p(i.TEXTURE_CUBE_MAP),e.unbindTexture()}else if(Ht){for(let wt=0,Bt=gt.length;wt<Bt;wt++){const kt=gt[wt],_t=n.get(kt);let Lt=i.TEXTURE_2D;(F.isWebGL3DRenderTarget||F.isWebGLArrayRenderTarget)&&(Lt=F.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),e.bindTexture(Lt,_t.__webglTexture),vt(Lt,kt),z($.__webglFramebuffer,F,kt,i.COLOR_ATTACHMENT0+wt,Lt,0),g(kt)&&p(Lt)}e.unbindTexture()}else{let wt=i.TEXTURE_2D;if((F.isWebGL3DRenderTarget||F.isWebGLArrayRenderTarget)&&(wt=F.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),e.bindTexture(wt,at.__webglTexture),vt(wt,C),C.mipmaps&&C.mipmaps.length>0)for(let Bt=0;Bt<C.mipmaps.length;Bt++)z($.__webglFramebuffer[Bt],F,C,i.COLOR_ATTACHMENT0,wt,Bt);else z($.__webglFramebuffer,F,C,i.COLOR_ATTACHMENT0,wt,0);g(C)&&p(wt),e.unbindTexture()}F.depthBuffer&&K(F)}function Z(F){const C=F.textures;for(let $=0,at=C.length;$<at;$++){const gt=C[$];if(g(gt)){const ot=y(F),Ht=n.get(gt).__webglTexture;e.bindTexture(ot,Ht),p(ot),e.unbindTexture()}}}const j=[],et=[];function st(F){if(F.samples>0){if(pt(F)===!1){const C=F.textures,$=F.width,at=F.height;let gt=i.COLOR_BUFFER_BIT;const ot=F.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,Ht=n.get(F),wt=C.length>1;if(wt)for(let kt=0;kt<C.length;kt++)e.bindFramebuffer(i.FRAMEBUFFER,Ht.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+kt,i.RENDERBUFFER,null),e.bindFramebuffer(i.FRAMEBUFFER,Ht.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+kt,i.TEXTURE_2D,null,0);e.bindFramebuffer(i.READ_FRAMEBUFFER,Ht.__webglMultisampledFramebuffer);const Bt=F.texture.mipmaps;Bt&&Bt.length>0?e.bindFramebuffer(i.DRAW_FRAMEBUFFER,Ht.__webglFramebuffer[0]):e.bindFramebuffer(i.DRAW_FRAMEBUFFER,Ht.__webglFramebuffer);for(let kt=0;kt<C.length;kt++){if(F.resolveDepthBuffer&&(F.depthBuffer&&(gt|=i.DEPTH_BUFFER_BIT),F.stencilBuffer&&F.resolveStencilBuffer&&(gt|=i.STENCIL_BUFFER_BIT)),wt){i.framebufferRenderbuffer(i.READ_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.RENDERBUFFER,Ht.__webglColorRenderbuffer[kt]);const _t=n.get(C[kt]).__webglTexture;i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,_t,0)}i.blitFramebuffer(0,0,$,at,0,0,$,at,gt,i.NEAREST),c===!0&&(j.length=0,et.length=0,j.push(i.COLOR_ATTACHMENT0+kt),F.depthBuffer&&F.resolveDepthBuffer===!1&&(j.push(ot),et.push(ot),i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,et)),i.invalidateFramebuffer(i.READ_FRAMEBUFFER,j))}if(e.bindFramebuffer(i.READ_FRAMEBUFFER,null),e.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),wt)for(let kt=0;kt<C.length;kt++){e.bindFramebuffer(i.FRAMEBUFFER,Ht.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+kt,i.RENDERBUFFER,Ht.__webglColorRenderbuffer[kt]);const _t=n.get(C[kt]).__webglTexture;e.bindFramebuffer(i.FRAMEBUFFER,Ht.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+kt,i.TEXTURE_2D,_t,0)}e.bindFramebuffer(i.DRAW_FRAMEBUFFER,Ht.__webglMultisampledFramebuffer)}else if(F.depthBuffer&&F.resolveDepthBuffer===!1&&c){const C=F.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,[C])}}}function ht(F){return Math.min(r.maxSamples,F.samples)}function pt(F){const C=n.get(F);return F.samples>0&&t.has("WEBGL_multisampled_render_to_texture")===!0&&C.__useRenderToTexture!==!1}function xt(F){const C=a.render.frame;h.get(F)!==C&&(h.set(F,C),F.update())}function Jt(F,C){const $=F.colorSpace,at=F.format,gt=F.type;return F.isCompressedTexture===!0||F.isVideoTexture===!0||$!==gr&&$!==ii&&(ce.getTransfer($)===fe?(at!==We||gt!==Yn)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",$)),C}function qt(F){return typeof HTMLImageElement<"u"&&F instanceof HTMLImageElement?(l.width=F.naturalWidth||F.width,l.height=F.naturalHeight||F.height):typeof VideoFrame<"u"&&F instanceof VideoFrame?(l.width=F.displayWidth,l.height=F.displayHeight):(l.width=F.width,l.height=F.height),l}this.allocateTextureUnit=L,this.resetTextureUnits=T,this.setTexture2D=U,this.setTexture2DArray=B,this.setTexture3D=X,this.setTextureCube=H,this.rebindTextures=it,this.setupRenderTarget=I,this.updateRenderTargetMipmap=Z,this.updateMultisampleRenderTarget=st,this.setupDepthRenderbuffer=K,this.setupFrameBufferTexture=z,this.useMultisampledRTT=pt}function M_(i,t){function e(n,r=ii){let s;const a=ce.getTransfer(r);if(n===Yn)return i.UNSIGNED_BYTE;if(n===Al)return i.UNSIGNED_SHORT_4_4_4_4;if(n===Rl)return i.UNSIGNED_SHORT_5_5_5_1;if(n===Pf)return i.UNSIGNED_INT_5_9_9_9_REV;if(n===Df)return i.UNSIGNED_INT_10F_11F_11F_REV;if(n===Cf)return i.BYTE;if(n===Lf)return i.SHORT;if(n===zs)return i.UNSIGNED_SHORT;if(n===Tl)return i.INT;if(n===mr)return i.UNSIGNED_INT;if(n===ri)return i.FLOAT;if(n===Mr)return i.HALF_FLOAT;if(n===If)return i.ALPHA;if(n===Uf)return i.RGB;if(n===We)return i.RGBA;if(n===Vs)return i.DEPTH_COMPONENT;if(n===Gs)return i.DEPTH_STENCIL;if(n===Nf)return i.RED;if(n===Cl)return i.RED_INTEGER;if(n===Ff)return i.RG;if(n===Ll)return i.RG_INTEGER;if(n===Pl)return i.RGBA_INTEGER;if(n===Ja||n===Za||n===Ka||n===Qa)if(a===fe)if(s=t.get("WEBGL_compressed_texture_s3tc_srgb"),s!==null){if(n===Ja)return s.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===Za)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===Ka)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===Qa)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(s=t.get("WEBGL_compressed_texture_s3tc"),s!==null){if(n===Ja)return s.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===Za)return s.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===Ka)return s.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===Qa)return s.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(n===Dc||n===Ic||n===Uc||n===Nc)if(s=t.get("WEBGL_compressed_texture_pvrtc"),s!==null){if(n===Dc)return s.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===Ic)return s.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===Uc)return s.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===Nc)return s.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(n===Fc||n===Oc||n===Bc)if(s=t.get("WEBGL_compressed_texture_etc"),s!==null){if(n===Fc||n===Oc)return a===fe?s.COMPRESSED_SRGB8_ETC2:s.COMPRESSED_RGB8_ETC2;if(n===Bc)return a===fe?s.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:s.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(n===kc||n===zc||n===Hc||n===Vc||n===Gc||n===Wc||n===Xc||n===qc||n===Yc||n===$c||n===jc||n===Jc||n===Zc||n===Kc)if(s=t.get("WEBGL_compressed_texture_astc"),s!==null){if(n===kc)return a===fe?s.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:s.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===zc)return a===fe?s.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:s.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===Hc)return a===fe?s.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:s.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===Vc)return a===fe?s.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:s.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===Gc)return a===fe?s.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:s.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===Wc)return a===fe?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:s.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===Xc)return a===fe?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:s.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===qc)return a===fe?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:s.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===Yc)return a===fe?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:s.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===$c)return a===fe?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:s.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===jc)return a===fe?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:s.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===Jc)return a===fe?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:s.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===Zc)return a===fe?s.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:s.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===Kc)return a===fe?s.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:s.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(n===Qc||n===tl||n===el)if(s=t.get("EXT_texture_compression_bptc"),s!==null){if(n===Qc)return a===fe?s.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:s.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===tl)return s.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===el)return s.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(n===nl||n===il||n===rl||n===sl)if(s=t.get("EXT_texture_compression_rgtc"),s!==null){if(n===nl)return s.COMPRESSED_RED_RGTC1_EXT;if(n===il)return s.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===rl)return s.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===sl)return s.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return n===Hs?i.UNSIGNED_INT_24_8:i[n]!==void 0?i[n]:null}return{convert:e}}const y_=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,b_=`
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

}`;class S_{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(t,e){if(this.texture===null){const n=new Zf(t.texture);(t.depthNear!==e.depthNear||t.depthFar!==e.depthFar)&&(this.depthNear=t.depthNear,this.depthFar=t.depthFar),this.texture=n}}getMesh(t){if(this.texture!==null&&this.mesh===null){const e=t.cameras[0].viewport,n=new ke({vertexShader:y_,fragmentShader:b_,uniforms:{depthColor:{value:this.texture},depthWidth:{value:e.z},depthHeight:{value:e.w}}});this.mesh=new Dt(new Si(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class w_ extends vs{constructor(t,e){super();const n=this;let r=null,s=1,a=null,o="local-floor",c=1,l=null,h=null,u=null,d=null,f=null,m=null;const v=typeof XRWebGLBinding<"u",g=new S_,p={},y=e.getContextAttributes();let M=null,_=null;const w=[],E=[],A=new dt;let R=null;const x=new bn;x.viewport=new le;const b=new bn;b.viewport=new le;const S=[x,b],T=new X1;let L=null,D=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(G){let J=w[G];return J===void 0&&(J=new Xo,w[G]=J),J.getTargetRaySpace()},this.getControllerGrip=function(G){let J=w[G];return J===void 0&&(J=new Xo,w[G]=J),J.getGripSpace()},this.getHand=function(G){let J=w[G];return J===void 0&&(J=new Xo,w[G]=J),J.getHandSpace()};function U(G){const J=E.indexOf(G.inputSource);if(J===-1)return;const z=w[J];z!==void 0&&(z.update(G.inputSource,G.frame,l||a),z.dispatchEvent({type:G.type,data:G.inputSource}))}function B(){r.removeEventListener("select",U),r.removeEventListener("selectstart",U),r.removeEventListener("selectend",U),r.removeEventListener("squeeze",U),r.removeEventListener("squeezestart",U),r.removeEventListener("squeezeend",U),r.removeEventListener("end",B),r.removeEventListener("inputsourceschange",X);for(let G=0;G<w.length;G++){const J=E[G];J!==null&&(E[G]=null,w[G].disconnect(J))}L=null,D=null,g.reset();for(const G in p)delete p[G];t.setRenderTarget(M),f=null,d=null,u=null,r=null,_=null,lt.stop(),n.isPresenting=!1,t.setPixelRatio(R),t.setSize(A.width,A.height,!1),n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(G){s=G,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(G){o=G,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return l||a},this.setReferenceSpace=function(G){l=G},this.getBaseLayer=function(){return d!==null?d:f},this.getBinding=function(){return u===null&&v&&(u=new XRWebGLBinding(r,e)),u},this.getFrame=function(){return m},this.getSession=function(){return r},this.setSession=async function(G){if(r=G,r!==null){if(M=t.getRenderTarget(),r.addEventListener("select",U),r.addEventListener("selectstart",U),r.addEventListener("selectend",U),r.addEventListener("squeeze",U),r.addEventListener("squeezestart",U),r.addEventListener("squeezeend",U),r.addEventListener("end",B),r.addEventListener("inputsourceschange",X),y.xrCompatible!==!0&&await e.makeXRCompatible(),R=t.getPixelRatio(),t.getSize(A),v&&"createProjectionLayer"in XRWebGLBinding.prototype){let z=null,W=null,k=null;y.depth&&(k=y.stencil?e.DEPTH24_STENCIL8:e.DEPTH_COMPONENT24,z=y.stencil?Gs:Vs,W=y.stencil?Hs:mr);const K={colorFormat:e.RGBA8,depthFormat:k,scaleFactor:s};u=this.getBinding(),d=u.createProjectionLayer(K),r.updateRenderState({layers:[d]}),t.setPixelRatio(1),t.setSize(d.textureWidth,d.textureHeight,!1),_=new rn(d.textureWidth,d.textureHeight,{format:We,type:Yn,depthTexture:new Jf(d.textureWidth,d.textureHeight,W,void 0,void 0,void 0,void 0,void 0,void 0,z),stencilBuffer:y.stencil,colorSpace:t.outputColorSpace,samples:y.antialias?4:0,resolveDepthBuffer:d.ignoreDepthValues===!1,resolveStencilBuffer:d.ignoreDepthValues===!1})}else{const z={antialias:y.antialias,alpha:!0,depth:y.depth,stencil:y.stencil,framebufferScaleFactor:s};f=new XRWebGLLayer(r,e,z),r.updateRenderState({baseLayer:f}),t.setPixelRatio(1),t.setSize(f.framebufferWidth,f.framebufferHeight,!1),_=new rn(f.framebufferWidth,f.framebufferHeight,{format:We,type:Yn,colorSpace:t.outputColorSpace,stencilBuffer:y.stencil,resolveDepthBuffer:f.ignoreDepthValues===!1,resolveStencilBuffer:f.ignoreDepthValues===!1})}_.isXRRenderTarget=!0,this.setFoveation(c),l=null,a=await r.requestReferenceSpace(o),lt.setContext(r),lt.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(r!==null)return r.environmentBlendMode},this.getDepthTexture=function(){return g.getDepthTexture()};function X(G){for(let J=0;J<G.removed.length;J++){const z=G.removed[J],W=E.indexOf(z);W>=0&&(E[W]=null,w[W].disconnect(z))}for(let J=0;J<G.added.length;J++){const z=G.added[J];let W=E.indexOf(z);if(W===-1){for(let K=0;K<w.length;K++)if(K>=E.length){E.push(z),W=K;break}else if(E[K]===null){E[K]=z,W=K;break}if(W===-1)break}const k=w[W];k&&k.connect(z)}}const H=new N,Q=new N;function ct(G,J,z){H.setFromMatrixPosition(J.matrixWorld),Q.setFromMatrixPosition(z.matrixWorld);const W=H.distanceTo(Q),k=J.projectionMatrix.elements,K=z.projectionMatrix.elements,it=k[14]/(k[10]-1),I=k[14]/(k[10]+1),Z=(k[9]+1)/k[5],j=(k[9]-1)/k[5],et=(k[8]-1)/k[0],st=(K[8]+1)/K[0],ht=it*et,pt=it*st,xt=W/(-et+st),Jt=xt*-et;if(J.matrixWorld.decompose(G.position,G.quaternion,G.scale),G.translateX(Jt),G.translateZ(xt),G.matrixWorld.compose(G.position,G.quaternion,G.scale),G.matrixWorldInverse.copy(G.matrixWorld).invert(),k[10]===-1)G.projectionMatrix.copy(J.projectionMatrix),G.projectionMatrixInverse.copy(J.projectionMatrixInverse);else{const qt=it+xt,F=I+xt,C=ht-Jt,$=pt+(W-Jt),at=Z*I/F*qt,gt=j*I/F*qt;G.projectionMatrix.makePerspective(C,$,at,gt,qt,F),G.projectionMatrixInverse.copy(G.projectionMatrix).invert()}}function ut(G,J){J===null?G.matrixWorld.copy(G.matrix):G.matrixWorld.multiplyMatrices(J.matrixWorld,G.matrix),G.matrixWorldInverse.copy(G.matrixWorld).invert()}this.updateCamera=function(G){if(r===null)return;let J=G.near,z=G.far;g.texture!==null&&(g.depthNear>0&&(J=g.depthNear),g.depthFar>0&&(z=g.depthFar)),T.near=b.near=x.near=J,T.far=b.far=x.far=z,(L!==T.near||D!==T.far)&&(r.updateRenderState({depthNear:T.near,depthFar:T.far}),L=T.near,D=T.far),T.layers.mask=G.layers.mask|6,x.layers.mask=T.layers.mask&3,b.layers.mask=T.layers.mask&5;const W=G.parent,k=T.cameras;ut(T,W);for(let K=0;K<k.length;K++)ut(k[K],W);k.length===2?ct(T,x,b):T.projectionMatrix.copy(x.projectionMatrix),vt(G,T,W)};function vt(G,J,z){z===null?G.matrix.copy(J.matrixWorld):(G.matrix.copy(z.matrixWorld),G.matrix.invert(),G.matrix.multiply(J.matrixWorld)),G.matrix.decompose(G.position,G.quaternion,G.scale),G.updateMatrixWorld(!0),G.projectionMatrix.copy(J.projectionMatrix),G.projectionMatrixInverse.copy(J.projectionMatrixInverse),G.isPerspectiveCamera&&(G.fov=fs*2*Math.atan(1/G.projectionMatrix.elements[5]),G.zoom=1)}this.getCamera=function(){return T},this.getFoveation=function(){if(!(d===null&&f===null))return c},this.setFoveation=function(G){c=G,d!==null&&(d.fixedFoveation=G),f!==null&&f.fixedFoveation!==void 0&&(f.fixedFoveation=G)},this.hasDepthSensing=function(){return g.texture!==null},this.getDepthSensingMesh=function(){return g.getMesh(T)},this.getCameraTexture=function(G){return p[G]};let Et=null;function Nt(G,J){if(h=J.getViewerPose(l||a),m=J,h!==null){const z=h.views;f!==null&&(t.setRenderTargetFramebuffer(_,f.framebuffer),t.setRenderTarget(_));let W=!1;z.length!==T.cameras.length&&(T.cameras.length=0,W=!0);for(let I=0;I<z.length;I++){const Z=z[I];let j=null;if(f!==null)j=f.getViewport(Z);else{const st=u.getViewSubImage(d,Z);j=st.viewport,I===0&&(t.setRenderTargetTextures(_,st.colorTexture,st.depthStencilTexture),t.setRenderTarget(_))}let et=S[I];et===void 0&&(et=new bn,et.layers.enable(I),et.viewport=new le,S[I]=et),et.matrix.fromArray(Z.transform.matrix),et.matrix.decompose(et.position,et.quaternion,et.scale),et.projectionMatrix.fromArray(Z.projectionMatrix),et.projectionMatrixInverse.copy(et.projectionMatrix).invert(),et.viewport.set(j.x,j.y,j.width,j.height),I===0&&(T.matrix.copy(et.matrix),T.matrix.decompose(T.position,T.quaternion,T.scale)),W===!0&&T.cameras.push(et)}const k=r.enabledFeatures;if(k&&k.includes("depth-sensing")&&r.depthUsage=="gpu-optimized"&&v){u=n.getBinding();const I=u.getDepthInformation(z[0]);I&&I.isValid&&I.texture&&g.init(I,r.renderState)}if(k&&k.includes("camera-access")&&v){t.state.unbindTexture(),u=n.getBinding();for(let I=0;I<z.length;I++){const Z=z[I].camera;if(Z){let j=p[Z];j||(j=new Zf,p[Z]=j);const et=u.getCameraImage(Z);j.sourceTexture=et}}}}for(let z=0;z<w.length;z++){const W=E[z],k=w[z];W!==null&&k!==void 0&&k.update(W,J,l||a)}Et&&Et(G,J),J.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:J}),m=null}const lt=new ld;lt.setAnimationLoop(Nt),this.setAnimationLoop=function(G){Et=G},this.dispose=function(){}}}const nr=new On,E_=new re;function T_(i,t){function e(g,p){g.matrixAutoUpdate===!0&&g.updateMatrix(),p.value.copy(g.matrix)}function n(g,p){p.color.getRGB(g.fogColor.value,Wf(i)),p.isFog?(g.fogNear.value=p.near,g.fogFar.value=p.far):p.isFogExp2&&(g.fogDensity.value=p.density)}function r(g,p,y,M,_){p.isMeshBasicMaterial||p.isMeshLambertMaterial?s(g,p):p.isMeshToonMaterial?(s(g,p),u(g,p)):p.isMeshPhongMaterial?(s(g,p),h(g,p)):p.isMeshStandardMaterial?(s(g,p),d(g,p),p.isMeshPhysicalMaterial&&f(g,p,_)):p.isMeshMatcapMaterial?(s(g,p),m(g,p)):p.isMeshDepthMaterial?s(g,p):p.isMeshDistanceMaterial?(s(g,p),v(g,p)):p.isMeshNormalMaterial?s(g,p):p.isLineBasicMaterial?(a(g,p),p.isLineDashedMaterial&&o(g,p)):p.isPointsMaterial?c(g,p,y,M):p.isSpriteMaterial?l(g,p):p.isShadowMaterial?(g.color.value.copy(p.color),g.opacity.value=p.opacity):p.isShaderMaterial&&(p.uniformsNeedUpdate=!1)}function s(g,p){g.opacity.value=p.opacity,p.color&&g.diffuse.value.copy(p.color),p.emissive&&g.emissive.value.copy(p.emissive).multiplyScalar(p.emissiveIntensity),p.map&&(g.map.value=p.map,e(p.map,g.mapTransform)),p.alphaMap&&(g.alphaMap.value=p.alphaMap,e(p.alphaMap,g.alphaMapTransform)),p.bumpMap&&(g.bumpMap.value=p.bumpMap,e(p.bumpMap,g.bumpMapTransform),g.bumpScale.value=p.bumpScale,p.side===mn&&(g.bumpScale.value*=-1)),p.normalMap&&(g.normalMap.value=p.normalMap,e(p.normalMap,g.normalMapTransform),g.normalScale.value.copy(p.normalScale),p.side===mn&&g.normalScale.value.negate()),p.displacementMap&&(g.displacementMap.value=p.displacementMap,e(p.displacementMap,g.displacementMapTransform),g.displacementScale.value=p.displacementScale,g.displacementBias.value=p.displacementBias),p.emissiveMap&&(g.emissiveMap.value=p.emissiveMap,e(p.emissiveMap,g.emissiveMapTransform)),p.specularMap&&(g.specularMap.value=p.specularMap,e(p.specularMap,g.specularMapTransform)),p.alphaTest>0&&(g.alphaTest.value=p.alphaTest);const y=t.get(p),M=y.envMap,_=y.envMapRotation;M&&(g.envMap.value=M,nr.copy(_),nr.x*=-1,nr.y*=-1,nr.z*=-1,M.isCubeTexture&&M.isRenderTargetTexture===!1&&(nr.y*=-1,nr.z*=-1),g.envMapRotation.value.setFromMatrix4(E_.makeRotationFromEuler(nr)),g.flipEnvMap.value=M.isCubeTexture&&M.isRenderTargetTexture===!1?-1:1,g.reflectivity.value=p.reflectivity,g.ior.value=p.ior,g.refractionRatio.value=p.refractionRatio),p.lightMap&&(g.lightMap.value=p.lightMap,g.lightMapIntensity.value=p.lightMapIntensity,e(p.lightMap,g.lightMapTransform)),p.aoMap&&(g.aoMap.value=p.aoMap,g.aoMapIntensity.value=p.aoMapIntensity,e(p.aoMap,g.aoMapTransform))}function a(g,p){g.diffuse.value.copy(p.color),g.opacity.value=p.opacity,p.map&&(g.map.value=p.map,e(p.map,g.mapTransform))}function o(g,p){g.dashSize.value=p.dashSize,g.totalSize.value=p.dashSize+p.gapSize,g.scale.value=p.scale}function c(g,p,y,M){g.diffuse.value.copy(p.color),g.opacity.value=p.opacity,g.size.value=p.size*y,g.scale.value=M*.5,p.map&&(g.map.value=p.map,e(p.map,g.uvTransform)),p.alphaMap&&(g.alphaMap.value=p.alphaMap,e(p.alphaMap,g.alphaMapTransform)),p.alphaTest>0&&(g.alphaTest.value=p.alphaTest)}function l(g,p){g.diffuse.value.copy(p.color),g.opacity.value=p.opacity,g.rotation.value=p.rotation,p.map&&(g.map.value=p.map,e(p.map,g.mapTransform)),p.alphaMap&&(g.alphaMap.value=p.alphaMap,e(p.alphaMap,g.alphaMapTransform)),p.alphaTest>0&&(g.alphaTest.value=p.alphaTest)}function h(g,p){g.specular.value.copy(p.specular),g.shininess.value=Math.max(p.shininess,1e-4)}function u(g,p){p.gradientMap&&(g.gradientMap.value=p.gradientMap)}function d(g,p){g.metalness.value=p.metalness,p.metalnessMap&&(g.metalnessMap.value=p.metalnessMap,e(p.metalnessMap,g.metalnessMapTransform)),g.roughness.value=p.roughness,p.roughnessMap&&(g.roughnessMap.value=p.roughnessMap,e(p.roughnessMap,g.roughnessMapTransform)),p.envMap&&(g.envMapIntensity.value=p.envMapIntensity)}function f(g,p,y){g.ior.value=p.ior,p.sheen>0&&(g.sheenColor.value.copy(p.sheenColor).multiplyScalar(p.sheen),g.sheenRoughness.value=p.sheenRoughness,p.sheenColorMap&&(g.sheenColorMap.value=p.sheenColorMap,e(p.sheenColorMap,g.sheenColorMapTransform)),p.sheenRoughnessMap&&(g.sheenRoughnessMap.value=p.sheenRoughnessMap,e(p.sheenRoughnessMap,g.sheenRoughnessMapTransform))),p.clearcoat>0&&(g.clearcoat.value=p.clearcoat,g.clearcoatRoughness.value=p.clearcoatRoughness,p.clearcoatMap&&(g.clearcoatMap.value=p.clearcoatMap,e(p.clearcoatMap,g.clearcoatMapTransform)),p.clearcoatRoughnessMap&&(g.clearcoatRoughnessMap.value=p.clearcoatRoughnessMap,e(p.clearcoatRoughnessMap,g.clearcoatRoughnessMapTransform)),p.clearcoatNormalMap&&(g.clearcoatNormalMap.value=p.clearcoatNormalMap,e(p.clearcoatNormalMap,g.clearcoatNormalMapTransform),g.clearcoatNormalScale.value.copy(p.clearcoatNormalScale),p.side===mn&&g.clearcoatNormalScale.value.negate())),p.dispersion>0&&(g.dispersion.value=p.dispersion),p.iridescence>0&&(g.iridescence.value=p.iridescence,g.iridescenceIOR.value=p.iridescenceIOR,g.iridescenceThicknessMinimum.value=p.iridescenceThicknessRange[0],g.iridescenceThicknessMaximum.value=p.iridescenceThicknessRange[1],p.iridescenceMap&&(g.iridescenceMap.value=p.iridescenceMap,e(p.iridescenceMap,g.iridescenceMapTransform)),p.iridescenceThicknessMap&&(g.iridescenceThicknessMap.value=p.iridescenceThicknessMap,e(p.iridescenceThicknessMap,g.iridescenceThicknessMapTransform))),p.transmission>0&&(g.transmission.value=p.transmission,g.transmissionSamplerMap.value=y.texture,g.transmissionSamplerSize.value.set(y.width,y.height),p.transmissionMap&&(g.transmissionMap.value=p.transmissionMap,e(p.transmissionMap,g.transmissionMapTransform)),g.thickness.value=p.thickness,p.thicknessMap&&(g.thicknessMap.value=p.thicknessMap,e(p.thicknessMap,g.thicknessMapTransform)),g.attenuationDistance.value=p.attenuationDistance,g.attenuationColor.value.copy(p.attenuationColor)),p.anisotropy>0&&(g.anisotropyVector.value.set(p.anisotropy*Math.cos(p.anisotropyRotation),p.anisotropy*Math.sin(p.anisotropyRotation)),p.anisotropyMap&&(g.anisotropyMap.value=p.anisotropyMap,e(p.anisotropyMap,g.anisotropyMapTransform))),g.specularIntensity.value=p.specularIntensity,g.specularColor.value.copy(p.specularColor),p.specularColorMap&&(g.specularColorMap.value=p.specularColorMap,e(p.specularColorMap,g.specularColorMapTransform)),p.specularIntensityMap&&(g.specularIntensityMap.value=p.specularIntensityMap,e(p.specularIntensityMap,g.specularIntensityMapTransform))}function m(g,p){p.matcap&&(g.matcap.value=p.matcap)}function v(g,p){const y=t.get(p).light;g.referencePosition.value.setFromMatrixPosition(y.matrixWorld),g.nearDistance.value=y.shadow.camera.near,g.farDistance.value=y.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:r}}function A_(i,t,e,n){let r={},s={},a=[];const o=i.getParameter(i.MAX_UNIFORM_BUFFER_BINDINGS);function c(y,M){const _=M.program;n.uniformBlockBinding(y,_)}function l(y,M){let _=r[y.id];_===void 0&&(m(y),_=h(y),r[y.id]=_,y.addEventListener("dispose",g));const w=M.program;n.updateUBOMapping(y,w);const E=t.render.frame;s[y.id]!==E&&(d(y),s[y.id]=E)}function h(y){const M=u();y.__bindingPointIndex=M;const _=i.createBuffer(),w=y.__size,E=y.usage;return i.bindBuffer(i.UNIFORM_BUFFER,_),i.bufferData(i.UNIFORM_BUFFER,w,E),i.bindBuffer(i.UNIFORM_BUFFER,null),i.bindBufferBase(i.UNIFORM_BUFFER,M,_),_}function u(){for(let y=0;y<o;y++)if(a.indexOf(y)===-1)return a.push(y),y;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function d(y){const M=r[y.id],_=y.uniforms,w=y.__cache;i.bindBuffer(i.UNIFORM_BUFFER,M);for(let E=0,A=_.length;E<A;E++){const R=Array.isArray(_[E])?_[E]:[_[E]];for(let x=0,b=R.length;x<b;x++){const S=R[x];if(f(S,E,x,w)===!0){const T=S.__offset,L=Array.isArray(S.value)?S.value:[S.value];let D=0;for(let U=0;U<L.length;U++){const B=L[U],X=v(B);typeof B=="number"||typeof B=="boolean"?(S.__data[0]=B,i.bufferSubData(i.UNIFORM_BUFFER,T+D,S.__data)):B.isMatrix3?(S.__data[0]=B.elements[0],S.__data[1]=B.elements[1],S.__data[2]=B.elements[2],S.__data[3]=0,S.__data[4]=B.elements[3],S.__data[5]=B.elements[4],S.__data[6]=B.elements[5],S.__data[7]=0,S.__data[8]=B.elements[6],S.__data[9]=B.elements[7],S.__data[10]=B.elements[8],S.__data[11]=0):(B.toArray(S.__data,D),D+=X.storage/Float32Array.BYTES_PER_ELEMENT)}i.bufferSubData(i.UNIFORM_BUFFER,T,S.__data)}}}i.bindBuffer(i.UNIFORM_BUFFER,null)}function f(y,M,_,w){const E=y.value,A=M+"_"+_;if(w[A]===void 0)return typeof E=="number"||typeof E=="boolean"?w[A]=E:w[A]=E.clone(),!0;{const R=w[A];if(typeof E=="number"||typeof E=="boolean"){if(R!==E)return w[A]=E,!0}else if(R.equals(E)===!1)return R.copy(E),!0}return!1}function m(y){const M=y.uniforms;let _=0;const w=16;for(let A=0,R=M.length;A<R;A++){const x=Array.isArray(M[A])?M[A]:[M[A]];for(let b=0,S=x.length;b<S;b++){const T=x[b],L=Array.isArray(T.value)?T.value:[T.value];for(let D=0,U=L.length;D<U;D++){const B=L[D],X=v(B),H=_%w,Q=H%X.boundary,ct=H+Q;_+=Q,ct!==0&&w-ct<X.storage&&(_+=w-ct),T.__data=new Float32Array(X.storage/Float32Array.BYTES_PER_ELEMENT),T.__offset=_,_+=X.storage}}}const E=_%w;return E>0&&(_+=w-E),y.__size=_,y.__cache={},this}function v(y){const M={boundary:0,storage:0};return typeof y=="number"||typeof y=="boolean"?(M.boundary=4,M.storage=4):y.isVector2?(M.boundary=8,M.storage=8):y.isVector3||y.isColor?(M.boundary=16,M.storage=12):y.isVector4?(M.boundary=16,M.storage=16):y.isMatrix3?(M.boundary=48,M.storage=48):y.isMatrix4?(M.boundary=64,M.storage=64):y.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",y),M}function g(y){const M=y.target;M.removeEventListener("dispose",g);const _=a.indexOf(M.__bindingPointIndex);a.splice(_,1),i.deleteBuffer(r[M.id]),delete r[M.id],delete s[M.id]}function p(){for(const y in r)i.deleteBuffer(r[y]);a=[],r={},s={}}return{bind:c,update:l,dispose:p}}class R_{constructor(t={}){const{canvas:e=wp(),context:n=null,depth:r=!0,stencil:s=!1,alpha:a=!1,antialias:o=!1,premultipliedAlpha:c=!0,preserveDrawingBuffer:l=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:u=!1,reversedDepthBuffer:d=!1}=t;this.isWebGLRenderer=!0;let f;if(n!==null){if(typeof WebGLRenderingContext<"u"&&n instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");f=n.getContextAttributes().alpha}else f=a;const m=new Uint32Array(4),v=new Int32Array(4);let g=null,p=null;const y=[],M=[];this.domElement=e,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=Gi,this.toneMappingExposure=1,this.transmissionResolutionScale=1;const _=this;let w=!1;this._outputColorSpace=dn;let E=0,A=0,R=null,x=-1,b=null;const S=new le,T=new le;let L=null;const D=new Ut(0);let U=0,B=e.width,X=e.height,H=1,Q=null,ct=null;const ut=new le(0,0,B,X),vt=new le(0,0,B,X);let Et=!1;const Nt=new Ol;let lt=!1,G=!1;const J=new re,z=new N,W=new le,k={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let K=!1;function it(){return R===null?H:1}let I=n;function Z(P,q){return e.getContext(P,q)}try{const P={alpha:!0,depth:r,stencil:s,antialias:o,premultipliedAlpha:c,preserveDrawingBuffer:l,powerPreference:h,failIfMajorPerformanceCaveat:u};if("setAttribute"in e&&e.setAttribute("data-engine",`three.js r${El}`),e.addEventListener("webglcontextlost",Tt,!1),e.addEventListener("webglcontextrestored",Ft,!1),e.addEventListener("webglcontextcreationerror",Mt,!1),I===null){const q="webgl2";if(I=Z(q,P),I===null)throw Z(q)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(P){throw console.error("THREE.WebGLRenderer: "+P.message),P}let j,et,st,ht,pt,xt,Jt,qt,F,C,$,at,gt,ot,Ht,wt,Bt,kt,_t,Lt,Yt,Vt,Rt,Qt;function V(){j=new Bv(I),j.init(),Vt=new M_(I,j),et=new Pv(I,j,t,Vt),st=new x_(I,j),et.reversedDepthBuffer&&d&&st.buffers.depth.setReversed(!0),ht=new Hv(I),pt=new s_,xt=new __(I,j,st,pt,et,Vt,ht),Jt=new Iv(_),qt=new Ov(_),F=new Y1(I),Rt=new Cv(I,F),C=new kv(I,F,ht,Rt),$=new Gv(I,C,F,ht),_t=new Vv(I,et,xt),wt=new Dv(pt),at=new r_(_,Jt,qt,j,et,Rt,wt),gt=new T_(_,pt),ot=new o_,Ht=new d_(j),kt=new Rv(_,Jt,qt,st,$,f,c),Bt=new g_(_,$,et),Qt=new A_(I,ht,et,st),Lt=new Lv(I,j,ht),Yt=new zv(I,j,ht),ht.programs=at.programs,_.capabilities=et,_.extensions=j,_.properties=pt,_.renderLists=ot,_.shadowMap=Bt,_.state=st,_.info=ht}V();const bt=new w_(_,I);this.xr=bt,this.getContext=function(){return I},this.getContextAttributes=function(){return I.getContextAttributes()},this.forceContextLoss=function(){const P=j.get("WEBGL_lose_context");P&&P.loseContext()},this.forceContextRestore=function(){const P=j.get("WEBGL_lose_context");P&&P.restoreContext()},this.getPixelRatio=function(){return H},this.setPixelRatio=function(P){P!==void 0&&(H=P,this.setSize(B,X,!1))},this.getSize=function(P){return P.set(B,X)},this.setSize=function(P,q,tt=!0){if(bt.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}B=P,X=q,e.width=Math.floor(P*H),e.height=Math.floor(q*H),tt===!0&&(e.style.width=P+"px",e.style.height=q+"px"),this.setViewport(0,0,P,q)},this.getDrawingBufferSize=function(P){return P.set(B*H,X*H).floor()},this.setDrawingBufferSize=function(P,q,tt){B=P,X=q,H=tt,e.width=Math.floor(P*tt),e.height=Math.floor(q*tt),this.setViewport(0,0,P,q)},this.getCurrentViewport=function(P){return P.copy(S)},this.getViewport=function(P){return P.copy(ut)},this.setViewport=function(P,q,tt,nt){P.isVector4?ut.set(P.x,P.y,P.z,P.w):ut.set(P,q,tt,nt),st.viewport(S.copy(ut).multiplyScalar(H).round())},this.getScissor=function(P){return P.copy(vt)},this.setScissor=function(P,q,tt,nt){P.isVector4?vt.set(P.x,P.y,P.z,P.w):vt.set(P,q,tt,nt),st.scissor(T.copy(vt).multiplyScalar(H).round())},this.getScissorTest=function(){return Et},this.setScissorTest=function(P){st.setScissorTest(Et=P)},this.setOpaqueSort=function(P){Q=P},this.setTransparentSort=function(P){ct=P},this.getClearColor=function(P){return P.copy(kt.getClearColor())},this.setClearColor=function(){kt.setClearColor(...arguments)},this.getClearAlpha=function(){return kt.getClearAlpha()},this.setClearAlpha=function(){kt.setClearAlpha(...arguments)},this.clear=function(P=!0,q=!0,tt=!0){let nt=0;if(P){let Y=!1;if(R!==null){const yt=R.texture.format;Y=yt===Pl||yt===Ll||yt===Cl}if(Y){const yt=R.texture.type,Ct=yt===Yn||yt===mr||yt===zs||yt===Hs||yt===Al||yt===Rl,Ot=kt.getClearColor(),It=kt.getClearAlpha(),Xt=Ot.r,$t=Ot.g,Gt=Ot.b;Ct?(m[0]=Xt,m[1]=$t,m[2]=Gt,m[3]=It,I.clearBufferuiv(I.COLOR,0,m)):(v[0]=Xt,v[1]=$t,v[2]=Gt,v[3]=It,I.clearBufferiv(I.COLOR,0,v))}else nt|=I.COLOR_BUFFER_BIT}q&&(nt|=I.DEPTH_BUFFER_BIT),tt&&(nt|=I.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),I.clear(nt)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){e.removeEventListener("webglcontextlost",Tt,!1),e.removeEventListener("webglcontextrestored",Ft,!1),e.removeEventListener("webglcontextcreationerror",Mt,!1),kt.dispose(),ot.dispose(),Ht.dispose(),pt.dispose(),Jt.dispose(),qt.dispose(),$.dispose(),Rt.dispose(),Qt.dispose(),at.dispose(),bt.dispose(),bt.removeEventListener("sessionstart",$n),bt.removeEventListener("sessionend",ah),ji.stop()};function Tt(P){P.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),w=!0}function Ft(){console.log("THREE.WebGLRenderer: Context Restored."),w=!1;const P=ht.autoReset,q=Bt.enabled,tt=Bt.autoUpdate,nt=Bt.needsUpdate,Y=Bt.type;V(),ht.autoReset=P,Bt.enabled=q,Bt.autoUpdate=tt,Bt.needsUpdate=nt,Bt.type=Y}function Mt(P){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",P.statusMessage)}function ft(P){const q=P.target;q.removeEventListener("dispose",ft),zt(q)}function zt(P){Zt(P),pt.remove(P)}function Zt(P){const q=pt.get(P).programs;q!==void 0&&(q.forEach(function(tt){at.releaseProgram(tt)}),P.isShaderMaterial&&at.releaseShaderCache(P))}this.renderBufferDirect=function(P,q,tt,nt,Y,yt){q===null&&(q=k);const Ct=Y.isMesh&&Y.matrixWorld.determinant()<0,Ot=o0(P,q,tt,nt,Y);st.setMaterial(nt,Ct);let It=tt.index,Xt=1;if(nt.wireframe===!0){if(It=C.getWireframeAttribute(tt),It===void 0)return;Xt=2}const $t=tt.drawRange,Gt=tt.attributes.position;let ie=$t.start*Xt,ue=($t.start+$t.count)*Xt;yt!==null&&(ie=Math.max(ie,yt.start*Xt),ue=Math.min(ue,(yt.start+yt.count)*Xt)),It!==null?(ie=Math.max(ie,0),ue=Math.min(ue,It.count)):Gt!=null&&(ie=Math.max(ie,0),ue=Math.min(ue,Gt.count));const Te=ue-ie;if(Te<0||Te===1/0)return;Rt.setup(Y,nt,Ot,tt,It);let ve,de=Lt;if(It!==null&&(ve=F.get(It),de=Yt,de.setIndex(ve)),Y.isMesh)nt.wireframe===!0?(st.setLineWidth(nt.wireframeLinewidth*it()),de.setMode(I.LINES)):de.setMode(I.TRIANGLES);else if(Y.isLine){let Wt=nt.linewidth;Wt===void 0&&(Wt=1),st.setLineWidth(Wt*it()),Y.isLineSegments?de.setMode(I.LINES):Y.isLineLoop?de.setMode(I.LINE_LOOP):de.setMode(I.LINE_STRIP)}else Y.isPoints?de.setMode(I.POINTS):Y.isSprite&&de.setMode(I.TRIANGLES);if(Y.isBatchedMesh)if(Y._multiDrawInstances!==null)Ws("THREE.WebGLRenderer: renderMultiDrawInstances has been deprecated and will be removed in r184. Append to renderMultiDraw arguments and use indirection."),de.renderMultiDrawInstances(Y._multiDrawStarts,Y._multiDrawCounts,Y._multiDrawCount,Y._multiDrawInstances);else if(j.get("WEBGL_multi_draw"))de.renderMultiDraw(Y._multiDrawStarts,Y._multiDrawCounts,Y._multiDrawCount);else{const Wt=Y._multiDrawStarts,ye=Y._multiDrawCounts,oe=Y._multiDrawCount,gn=It?F.get(It).bytesPerElement:1,Sr=pt.get(nt).currentProgram.getUniforms();for(let vn=0;vn<oe;vn++)Sr.setValue(I,"_gl_DrawID",vn),de.render(Wt[vn]/gn,ye[vn])}else if(Y.isInstancedMesh)de.renderInstances(ie,Te,Y.count);else if(tt.isInstancedBufferGeometry){const Wt=tt._maxInstanceCount!==void 0?tt._maxInstanceCount:1/0,ye=Math.min(tt.instanceCount,Wt);de.renderInstances(ie,Te,ye)}else de.render(ie,Te)};function pe(P,q,tt){P.transparent===!0&&P.side===je&&P.forceSinglePass===!1?(P.side=mn,P.needsUpdate=!0,ca(P,q,tt),P.side=qi,P.needsUpdate=!0,ca(P,q,tt),P.side=je):ca(P,q,tt)}this.compile=function(P,q,tt=null){tt===null&&(tt=P),p=Ht.get(tt),p.init(q),M.push(p),tt.traverseVisible(function(Y){Y.isLight&&Y.layers.test(q.layers)&&(p.pushLight(Y),Y.castShadow&&p.pushShadow(Y))}),P!==tt&&P.traverseVisible(function(Y){Y.isLight&&Y.layers.test(q.layers)&&(p.pushLight(Y),Y.castShadow&&p.pushShadow(Y))}),p.setupLights();const nt=new Set;return P.traverse(function(Y){if(!(Y.isMesh||Y.isPoints||Y.isLine||Y.isSprite))return;const yt=Y.material;if(yt)if(Array.isArray(yt))for(let Ct=0;Ct<yt.length;Ct++){const Ot=yt[Ct];pe(Ot,tt,Y),nt.add(Ot)}else pe(yt,tt,Y),nt.add(yt)}),p=M.pop(),nt},this.compileAsync=function(P,q,tt=null){const nt=this.compile(P,q,tt);return new Promise(Y=>{function yt(){if(nt.forEach(function(Ct){pt.get(Ct).currentProgram.isReady()&&nt.delete(Ct)}),nt.size===0){Y(P);return}setTimeout(yt,10)}j.get("KHR_parallel_shader_compile")!==null?yt():setTimeout(yt,10)})};let he=null;function li(P){he&&he(P)}function $n(){ji.stop()}function ah(){ji.start()}const ji=new ld;ji.setAnimationLoop(li),typeof self<"u"&&ji.setContext(self),this.setAnimationLoop=function(P){he=P,bt.setAnimationLoop(P),P===null?ji.stop():ji.start()},bt.addEventListener("sessionstart",$n),bt.addEventListener("sessionend",ah),this.render=function(P,q){if(q!==void 0&&q.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(w===!0)return;if(P.matrixWorldAutoUpdate===!0&&P.updateMatrixWorld(),q.parent===null&&q.matrixWorldAutoUpdate===!0&&q.updateMatrixWorld(),bt.enabled===!0&&bt.isPresenting===!0&&(bt.cameraAutoUpdate===!0&&bt.updateCamera(q),q=bt.getCamera()),P.isScene===!0&&P.onBeforeRender(_,P,q,R),p=Ht.get(P,M.length),p.init(q),M.push(p),J.multiplyMatrices(q.projectionMatrix,q.matrixWorldInverse),Nt.setFromProjectionMatrix(J,si,q.reversedDepth),G=this.localClippingEnabled,lt=wt.init(this.clippingPlanes,G),g=ot.get(P,y.length),g.init(),y.push(g),bt.enabled===!0&&bt.isPresenting===!0){const yt=_.xr.getDepthSensingMesh();yt!==null&&bo(yt,q,-1/0,_.sortObjects)}bo(P,q,0,_.sortObjects),g.finish(),_.sortObjects===!0&&g.sort(Q,ct),K=bt.enabled===!1||bt.isPresenting===!1||bt.hasDepthSensing()===!1,K&&kt.addToRenderList(g,P),this.info.render.frame++,lt===!0&&wt.beginShadows();const tt=p.state.shadowsArray;Bt.render(tt,P,q),lt===!0&&wt.endShadows(),this.info.autoReset===!0&&this.info.reset();const nt=g.opaque,Y=g.transmissive;if(p.setupLights(),q.isArrayCamera){const yt=q.cameras;if(Y.length>0)for(let Ct=0,Ot=yt.length;Ct<Ot;Ct++){const It=yt[Ct];ch(nt,Y,P,It)}K&&kt.render(P);for(let Ct=0,Ot=yt.length;Ct<Ot;Ct++){const It=yt[Ct];oh(g,P,It,It.viewport)}}else Y.length>0&&ch(nt,Y,P,q),K&&kt.render(P),oh(g,P,q);R!==null&&A===0&&(xt.updateMultisampleRenderTarget(R),xt.updateRenderTargetMipmap(R)),P.isScene===!0&&P.onAfterRender(_,P,q),Rt.resetDefaultState(),x=-1,b=null,M.pop(),M.length>0?(p=M[M.length-1],lt===!0&&wt.setGlobalState(_.clippingPlanes,p.state.camera)):p=null,y.pop(),y.length>0?g=y[y.length-1]:g=null};function bo(P,q,tt,nt){if(P.visible===!1)return;if(P.layers.test(q.layers)){if(P.isGroup)tt=P.renderOrder;else if(P.isLOD)P.autoUpdate===!0&&P.update(q);else if(P.isLight)p.pushLight(P),P.castShadow&&p.pushShadow(P);else if(P.isSprite){if(!P.frustumCulled||Nt.intersectsSprite(P)){nt&&W.setFromMatrixPosition(P.matrixWorld).applyMatrix4(J);const Ct=$.update(P),Ot=P.material;Ot.visible&&g.push(P,Ct,Ot,tt,W.z,null)}}else if((P.isMesh||P.isLine||P.isPoints)&&(!P.frustumCulled||Nt.intersectsObject(P))){const Ct=$.update(P),Ot=P.material;if(nt&&(P.boundingSphere!==void 0?(P.boundingSphere===null&&P.computeBoundingSphere(),W.copy(P.boundingSphere.center)):(Ct.boundingSphere===null&&Ct.computeBoundingSphere(),W.copy(Ct.boundingSphere.center)),W.applyMatrix4(P.matrixWorld).applyMatrix4(J)),Array.isArray(Ot)){const It=Ct.groups;for(let Xt=0,$t=It.length;Xt<$t;Xt++){const Gt=It[Xt],ie=Ot[Gt.materialIndex];ie&&ie.visible&&g.push(P,Ct,ie,tt,W.z,Gt)}}else Ot.visible&&g.push(P,Ct,Ot,tt,W.z,null)}}const yt=P.children;for(let Ct=0,Ot=yt.length;Ct<Ot;Ct++)bo(yt[Ct],q,tt,nt)}function oh(P,q,tt,nt){const Y=P.opaque,yt=P.transmissive,Ct=P.transparent;p.setupLightsView(tt),lt===!0&&wt.setGlobalState(_.clippingPlanes,tt),nt&&st.viewport(S.copy(nt)),Y.length>0&&oa(Y,q,tt),yt.length>0&&oa(yt,q,tt),Ct.length>0&&oa(Ct,q,tt),st.buffers.depth.setTest(!0),st.buffers.depth.setMask(!0),st.buffers.color.setMask(!0),st.setPolygonOffset(!1)}function ch(P,q,tt,nt){if((tt.isScene===!0?tt.overrideMaterial:null)!==null)return;p.state.transmissionRenderTarget[nt.id]===void 0&&(p.state.transmissionRenderTarget[nt.id]=new rn(1,1,{generateMipmaps:!0,type:j.has("EXT_color_buffer_half_float")||j.has("EXT_color_buffer_float")?Mr:Yn,minFilter:ki,samples:4,stencilBuffer:s,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:ce.workingColorSpace}));const yt=p.state.transmissionRenderTarget[nt.id],Ct=nt.viewport||S;yt.setSize(Ct.z*_.transmissionResolutionScale,Ct.w*_.transmissionResolutionScale);const Ot=_.getRenderTarget(),It=_.getActiveCubeFace(),Xt=_.getActiveMipmapLevel();_.setRenderTarget(yt),_.getClearColor(D),U=_.getClearAlpha(),U<1&&_.setClearColor(16777215,.5),_.clear(),K&&kt.render(tt);const $t=_.toneMapping;_.toneMapping=Gi;const Gt=nt.viewport;if(nt.viewport!==void 0&&(nt.viewport=void 0),p.setupLightsView(nt),lt===!0&&wt.setGlobalState(_.clippingPlanes,nt),oa(P,tt,nt),xt.updateMultisampleRenderTarget(yt),xt.updateRenderTargetMipmap(yt),j.has("WEBGL_multisampled_render_to_texture")===!1){let ie=!1;for(let ue=0,Te=q.length;ue<Te;ue++){const ve=q[ue],de=ve.object,Wt=ve.geometry,ye=ve.material,oe=ve.group;if(ye.side===je&&de.layers.test(nt.layers)){const gn=ye.side;ye.side=mn,ye.needsUpdate=!0,lh(de,tt,nt,Wt,ye,oe),ye.side=gn,ye.needsUpdate=!0,ie=!0}}ie===!0&&(xt.updateMultisampleRenderTarget(yt),xt.updateRenderTargetMipmap(yt))}_.setRenderTarget(Ot,It,Xt),_.setClearColor(D,U),Gt!==void 0&&(nt.viewport=Gt),_.toneMapping=$t}function oa(P,q,tt){const nt=q.isScene===!0?q.overrideMaterial:null;for(let Y=0,yt=P.length;Y<yt;Y++){const Ct=P[Y],Ot=Ct.object,It=Ct.geometry,Xt=Ct.group;let $t=Ct.material;$t.allowOverride===!0&&nt!==null&&($t=nt),Ot.layers.test(tt.layers)&&lh(Ot,q,tt,It,$t,Xt)}}function lh(P,q,tt,nt,Y,yt){P.onBeforeRender(_,q,tt,nt,Y,yt),P.modelViewMatrix.multiplyMatrices(tt.matrixWorldInverse,P.matrixWorld),P.normalMatrix.getNormalMatrix(P.modelViewMatrix),Y.onBeforeRender(_,q,tt,nt,P,yt),Y.transparent===!0&&Y.side===je&&Y.forceSinglePass===!1?(Y.side=mn,Y.needsUpdate=!0,_.renderBufferDirect(tt,q,nt,Y,P,yt),Y.side=qi,Y.needsUpdate=!0,_.renderBufferDirect(tt,q,nt,Y,P,yt),Y.side=je):_.renderBufferDirect(tt,q,nt,Y,P,yt),P.onAfterRender(_,q,tt,nt,Y,yt)}function ca(P,q,tt){q.isScene!==!0&&(q=k);const nt=pt.get(P),Y=p.state.lights,yt=p.state.shadowsArray,Ct=Y.state.version,Ot=at.getParameters(P,Y.state,yt,q,tt),It=at.getProgramCacheKey(Ot);let Xt=nt.programs;nt.environment=P.isMeshStandardMaterial?q.environment:null,nt.fog=q.fog,nt.envMap=(P.isMeshStandardMaterial?qt:Jt).get(P.envMap||nt.environment),nt.envMapRotation=nt.environment!==null&&P.envMap===null?q.environmentRotation:P.envMapRotation,Xt===void 0&&(P.addEventListener("dispose",ft),Xt=new Map,nt.programs=Xt);let $t=Xt.get(It);if($t!==void 0){if(nt.currentProgram===$t&&nt.lightsStateVersion===Ct)return uh(P,Ot),$t}else Ot.uniforms=at.getUniforms(P),P.onBeforeCompile(Ot,_),$t=at.acquireProgram(Ot,It),Xt.set(It,$t),nt.uniforms=Ot.uniforms;const Gt=nt.uniforms;return(!P.isShaderMaterial&&!P.isRawShaderMaterial||P.clipping===!0)&&(Gt.clippingPlanes=wt.uniform),uh(P,Ot),nt.needsLights=l0(P),nt.lightsStateVersion=Ct,nt.needsLights&&(Gt.ambientLightColor.value=Y.state.ambient,Gt.lightProbe.value=Y.state.probe,Gt.directionalLights.value=Y.state.directional,Gt.directionalLightShadows.value=Y.state.directionalShadow,Gt.spotLights.value=Y.state.spot,Gt.spotLightShadows.value=Y.state.spotShadow,Gt.rectAreaLights.value=Y.state.rectArea,Gt.ltc_1.value=Y.state.rectAreaLTC1,Gt.ltc_2.value=Y.state.rectAreaLTC2,Gt.pointLights.value=Y.state.point,Gt.pointLightShadows.value=Y.state.pointShadow,Gt.hemisphereLights.value=Y.state.hemi,Gt.directionalShadowMap.value=Y.state.directionalShadowMap,Gt.directionalShadowMatrix.value=Y.state.directionalShadowMatrix,Gt.spotShadowMap.value=Y.state.spotShadowMap,Gt.spotLightMatrix.value=Y.state.spotLightMatrix,Gt.spotLightMap.value=Y.state.spotLightMap,Gt.pointShadowMap.value=Y.state.pointShadowMap,Gt.pointShadowMatrix.value=Y.state.pointShadowMatrix),nt.currentProgram=$t,nt.uniformsList=null,$t}function hh(P){if(P.uniformsList===null){const q=P.currentProgram.getUniforms();P.uniformsList=to.seqWithValue(q.seq,P.uniforms)}return P.uniformsList}function uh(P,q){const tt=pt.get(P);tt.outputColorSpace=q.outputColorSpace,tt.batching=q.batching,tt.batchingColor=q.batchingColor,tt.instancing=q.instancing,tt.instancingColor=q.instancingColor,tt.instancingMorph=q.instancingMorph,tt.skinning=q.skinning,tt.morphTargets=q.morphTargets,tt.morphNormals=q.morphNormals,tt.morphColors=q.morphColors,tt.morphTargetsCount=q.morphTargetsCount,tt.numClippingPlanes=q.numClippingPlanes,tt.numIntersection=q.numClipIntersection,tt.vertexAlphas=q.vertexAlphas,tt.vertexTangents=q.vertexTangents,tt.toneMapping=q.toneMapping}function o0(P,q,tt,nt,Y){q.isScene!==!0&&(q=k),xt.resetTextureUnits();const yt=q.fog,Ct=nt.isMeshStandardMaterial?q.environment:null,Ot=R===null?_.outputColorSpace:R.isXRRenderTarget===!0?R.texture.colorSpace:gr,It=(nt.isMeshStandardMaterial?qt:Jt).get(nt.envMap||Ct),Xt=nt.vertexColors===!0&&!!tt.attributes.color&&tt.attributes.color.itemSize===4,$t=!!tt.attributes.tangent&&(!!nt.normalMap||nt.anisotropy>0),Gt=!!tt.morphAttributes.position,ie=!!tt.morphAttributes.normal,ue=!!tt.morphAttributes.color;let Te=Gi;nt.toneMapped&&(R===null||R.isXRRenderTarget===!0)&&(Te=_.toneMapping);const ve=tt.morphAttributes.position||tt.morphAttributes.normal||tt.morphAttributes.color,de=ve!==void 0?ve.length:0,Wt=pt.get(nt),ye=p.state.lights;if(lt===!0&&(G===!0||P!==b)){const Ze=P===b&&nt.id===x;wt.setState(nt,P,Ze)}let oe=!1;nt.version===Wt.__version?(Wt.needsLights&&Wt.lightsStateVersion!==ye.state.version||Wt.outputColorSpace!==Ot||Y.isBatchedMesh&&Wt.batching===!1||!Y.isBatchedMesh&&Wt.batching===!0||Y.isBatchedMesh&&Wt.batchingColor===!0&&Y.colorTexture===null||Y.isBatchedMesh&&Wt.batchingColor===!1&&Y.colorTexture!==null||Y.isInstancedMesh&&Wt.instancing===!1||!Y.isInstancedMesh&&Wt.instancing===!0||Y.isSkinnedMesh&&Wt.skinning===!1||!Y.isSkinnedMesh&&Wt.skinning===!0||Y.isInstancedMesh&&Wt.instancingColor===!0&&Y.instanceColor===null||Y.isInstancedMesh&&Wt.instancingColor===!1&&Y.instanceColor!==null||Y.isInstancedMesh&&Wt.instancingMorph===!0&&Y.morphTexture===null||Y.isInstancedMesh&&Wt.instancingMorph===!1&&Y.morphTexture!==null||Wt.envMap!==It||nt.fog===!0&&Wt.fog!==yt||Wt.numClippingPlanes!==void 0&&(Wt.numClippingPlanes!==wt.numPlanes||Wt.numIntersection!==wt.numIntersection)||Wt.vertexAlphas!==Xt||Wt.vertexTangents!==$t||Wt.morphTargets!==Gt||Wt.morphNormals!==ie||Wt.morphColors!==ue||Wt.toneMapping!==Te||Wt.morphTargetsCount!==de)&&(oe=!0):(oe=!0,Wt.__version=nt.version);let gn=Wt.currentProgram;oe===!0&&(gn=ca(nt,q,Y));let Sr=!1,vn=!1,bs=!1;const be=gn.getUniforms(),Rn=Wt.uniforms;if(st.useProgram(gn.program)&&(Sr=!0,vn=!0,bs=!0),nt.id!==x&&(x=nt.id,vn=!0),Sr||b!==P){st.buffers.depth.getReversed()&&P.reversedDepth!==!0&&(P._reversedDepth=!0,P.updateProjectionMatrix()),be.setValue(I,"projectionMatrix",P.projectionMatrix),be.setValue(I,"viewMatrix",P.matrixWorldInverse);const an=be.map.cameraPosition;an!==void 0&&an.setValue(I,z.setFromMatrixPosition(P.matrixWorld)),et.logarithmicDepthBuffer&&be.setValue(I,"logDepthBufFC",2/(Math.log(P.far+1)/Math.LN2)),(nt.isMeshPhongMaterial||nt.isMeshToonMaterial||nt.isMeshLambertMaterial||nt.isMeshBasicMaterial||nt.isMeshStandardMaterial||nt.isShaderMaterial)&&be.setValue(I,"isOrthographic",P.isOrthographicCamera===!0),b!==P&&(b=P,vn=!0,bs=!0)}if(Y.isSkinnedMesh){be.setOptional(I,Y,"bindMatrix"),be.setOptional(I,Y,"bindMatrixInverse");const Ze=Y.skeleton;Ze&&(Ze.boneTexture===null&&Ze.computeBoneTexture(),be.setValue(I,"boneTexture",Ze.boneTexture,xt))}Y.isBatchedMesh&&(be.setOptional(I,Y,"batchingTexture"),be.setValue(I,"batchingTexture",Y._matricesTexture,xt),be.setOptional(I,Y,"batchingIdTexture"),be.setValue(I,"batchingIdTexture",Y._indirectTexture,xt),be.setOptional(I,Y,"batchingColorTexture"),Y._colorsTexture!==null&&be.setValue(I,"batchingColorTexture",Y._colorsTexture,xt));const Cn=tt.morphAttributes;if((Cn.position!==void 0||Cn.normal!==void 0||Cn.color!==void 0)&&_t.update(Y,tt,gn),(vn||Wt.receiveShadow!==Y.receiveShadow)&&(Wt.receiveShadow=Y.receiveShadow,be.setValue(I,"receiveShadow",Y.receiveShadow)),nt.isMeshGouraudMaterial&&nt.envMap!==null&&(Rn.envMap.value=It,Rn.flipEnvMap.value=It.isCubeTexture&&It.isRenderTargetTexture===!1?-1:1),nt.isMeshStandardMaterial&&nt.envMap===null&&q.environment!==null&&(Rn.envMapIntensity.value=q.environmentIntensity),vn&&(be.setValue(I,"toneMappingExposure",_.toneMappingExposure),Wt.needsLights&&c0(Rn,bs),yt&&nt.fog===!0&&gt.refreshFogUniforms(Rn,yt),gt.refreshMaterialUniforms(Rn,nt,H,X,p.state.transmissionRenderTarget[P.id]),to.upload(I,hh(Wt),Rn,xt)),nt.isShaderMaterial&&nt.uniformsNeedUpdate===!0&&(to.upload(I,hh(Wt),Rn,xt),nt.uniformsNeedUpdate=!1),nt.isSpriteMaterial&&be.setValue(I,"center",Y.center),be.setValue(I,"modelViewMatrix",Y.modelViewMatrix),be.setValue(I,"normalMatrix",Y.normalMatrix),be.setValue(I,"modelMatrix",Y.matrixWorld),nt.isShaderMaterial||nt.isRawShaderMaterial){const Ze=nt.uniformsGroups;for(let an=0,So=Ze.length;an<So;an++){const Ji=Ze[an];Qt.update(Ji,gn),Qt.bind(Ji,gn)}}return gn}function c0(P,q){P.ambientLightColor.needsUpdate=q,P.lightProbe.needsUpdate=q,P.directionalLights.needsUpdate=q,P.directionalLightShadows.needsUpdate=q,P.pointLights.needsUpdate=q,P.pointLightShadows.needsUpdate=q,P.spotLights.needsUpdate=q,P.spotLightShadows.needsUpdate=q,P.rectAreaLights.needsUpdate=q,P.hemisphereLights.needsUpdate=q}function l0(P){return P.isMeshLambertMaterial||P.isMeshToonMaterial||P.isMeshPhongMaterial||P.isMeshStandardMaterial||P.isShadowMaterial||P.isShaderMaterial&&P.lights===!0}this.getActiveCubeFace=function(){return E},this.getActiveMipmapLevel=function(){return A},this.getRenderTarget=function(){return R},this.setRenderTargetTextures=function(P,q,tt){const nt=pt.get(P);nt.__autoAllocateDepthBuffer=P.resolveDepthBuffer===!1,nt.__autoAllocateDepthBuffer===!1&&(nt.__useRenderToTexture=!1),pt.get(P.texture).__webglTexture=q,pt.get(P.depthTexture).__webglTexture=nt.__autoAllocateDepthBuffer?void 0:tt,nt.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(P,q){const tt=pt.get(P);tt.__webglFramebuffer=q,tt.__useDefaultFramebuffer=q===void 0};const h0=I.createFramebuffer();this.setRenderTarget=function(P,q=0,tt=0){R=P,E=q,A=tt;let nt=!0,Y=null,yt=!1,Ct=!1;if(P){const It=pt.get(P);if(It.__useDefaultFramebuffer!==void 0)st.bindFramebuffer(I.FRAMEBUFFER,null),nt=!1;else if(It.__webglFramebuffer===void 0)xt.setupRenderTarget(P);else if(It.__hasExternalTextures)xt.rebindTextures(P,pt.get(P.texture).__webglTexture,pt.get(P.depthTexture).__webglTexture);else if(P.depthBuffer){const Gt=P.depthTexture;if(It.__boundDepthTexture!==Gt){if(Gt!==null&&pt.has(Gt)&&(P.width!==Gt.image.width||P.height!==Gt.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");xt.setupDepthRenderbuffer(P)}}const Xt=P.texture;(Xt.isData3DTexture||Xt.isDataArrayTexture||Xt.isCompressedArrayTexture)&&(Ct=!0);const $t=pt.get(P).__webglFramebuffer;P.isWebGLCubeRenderTarget?(Array.isArray($t[q])?Y=$t[q][tt]:Y=$t[q],yt=!0):P.samples>0&&xt.useMultisampledRTT(P)===!1?Y=pt.get(P).__webglMultisampledFramebuffer:Array.isArray($t)?Y=$t[tt]:Y=$t,S.copy(P.viewport),T.copy(P.scissor),L=P.scissorTest}else S.copy(ut).multiplyScalar(H).floor(),T.copy(vt).multiplyScalar(H).floor(),L=Et;if(tt!==0&&(Y=h0),st.bindFramebuffer(I.FRAMEBUFFER,Y)&&nt&&st.drawBuffers(P,Y),st.viewport(S),st.scissor(T),st.setScissorTest(L),yt){const It=pt.get(P.texture);I.framebufferTexture2D(I.FRAMEBUFFER,I.COLOR_ATTACHMENT0,I.TEXTURE_CUBE_MAP_POSITIVE_X+q,It.__webglTexture,tt)}else if(Ct){const It=q;for(let Xt=0;Xt<P.textures.length;Xt++){const $t=pt.get(P.textures[Xt]);I.framebufferTextureLayer(I.FRAMEBUFFER,I.COLOR_ATTACHMENT0+Xt,$t.__webglTexture,tt,It)}}else if(P!==null&&tt!==0){const It=pt.get(P.texture);I.framebufferTexture2D(I.FRAMEBUFFER,I.COLOR_ATTACHMENT0,I.TEXTURE_2D,It.__webglTexture,tt)}x=-1},this.readRenderTargetPixels=function(P,q,tt,nt,Y,yt,Ct,Ot=0){if(!(P&&P.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let It=pt.get(P).__webglFramebuffer;if(P.isWebGLCubeRenderTarget&&Ct!==void 0&&(It=It[Ct]),It){st.bindFramebuffer(I.FRAMEBUFFER,It);try{const Xt=P.textures[Ot],$t=Xt.format,Gt=Xt.type;if(!et.textureFormatReadable($t)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!et.textureTypeReadable(Gt)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}q>=0&&q<=P.width-nt&&tt>=0&&tt<=P.height-Y&&(P.textures.length>1&&I.readBuffer(I.COLOR_ATTACHMENT0+Ot),I.readPixels(q,tt,nt,Y,Vt.convert($t),Vt.convert(Gt),yt))}finally{const Xt=R!==null?pt.get(R).__webglFramebuffer:null;st.bindFramebuffer(I.FRAMEBUFFER,Xt)}}},this.readRenderTargetPixelsAsync=async function(P,q,tt,nt,Y,yt,Ct,Ot=0){if(!(P&&P.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let It=pt.get(P).__webglFramebuffer;if(P.isWebGLCubeRenderTarget&&Ct!==void 0&&(It=It[Ct]),It)if(q>=0&&q<=P.width-nt&&tt>=0&&tt<=P.height-Y){st.bindFramebuffer(I.FRAMEBUFFER,It);const Xt=P.textures[Ot],$t=Xt.format,Gt=Xt.type;if(!et.textureFormatReadable($t))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!et.textureTypeReadable(Gt))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");const ie=I.createBuffer();I.bindBuffer(I.PIXEL_PACK_BUFFER,ie),I.bufferData(I.PIXEL_PACK_BUFFER,yt.byteLength,I.STREAM_READ),P.textures.length>1&&I.readBuffer(I.COLOR_ATTACHMENT0+Ot),I.readPixels(q,tt,nt,Y,Vt.convert($t),Vt.convert(Gt),0);const ue=R!==null?pt.get(R).__webglFramebuffer:null;st.bindFramebuffer(I.FRAMEBUFFER,ue);const Te=I.fenceSync(I.SYNC_GPU_COMMANDS_COMPLETE,0);return I.flush(),await Ep(I,Te,4),I.bindBuffer(I.PIXEL_PACK_BUFFER,ie),I.getBufferSubData(I.PIXEL_PACK_BUFFER,0,yt),I.deleteBuffer(ie),I.deleteSync(Te),yt}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(P,q=null,tt=0){const nt=Math.pow(2,-tt),Y=Math.floor(P.image.width*nt),yt=Math.floor(P.image.height*nt),Ct=q!==null?q.x:0,Ot=q!==null?q.y:0;xt.setTexture2D(P,0),I.copyTexSubImage2D(I.TEXTURE_2D,tt,0,0,Ct,Ot,Y,yt),st.unbindTexture()};const u0=I.createFramebuffer(),f0=I.createFramebuffer();this.copyTextureToTexture=function(P,q,tt=null,nt=null,Y=0,yt=null){yt===null&&(Y!==0?(Ws("WebGLRenderer: copyTextureToTexture function signature has changed to support src and dst mipmap levels."),yt=Y,Y=0):yt=0);let Ct,Ot,It,Xt,$t,Gt,ie,ue,Te;const ve=P.isCompressedTexture?P.mipmaps[yt]:P.image;if(tt!==null)Ct=tt.max.x-tt.min.x,Ot=tt.max.y-tt.min.y,It=tt.isBox3?tt.max.z-tt.min.z:1,Xt=tt.min.x,$t=tt.min.y,Gt=tt.isBox3?tt.min.z:0;else{const Cn=Math.pow(2,-Y);Ct=Math.floor(ve.width*Cn),Ot=Math.floor(ve.height*Cn),P.isDataArrayTexture?It=ve.depth:P.isData3DTexture?It=Math.floor(ve.depth*Cn):It=1,Xt=0,$t=0,Gt=0}nt!==null?(ie=nt.x,ue=nt.y,Te=nt.z):(ie=0,ue=0,Te=0);const de=Vt.convert(q.format),Wt=Vt.convert(q.type);let ye;q.isData3DTexture?(xt.setTexture3D(q,0),ye=I.TEXTURE_3D):q.isDataArrayTexture||q.isCompressedArrayTexture?(xt.setTexture2DArray(q,0),ye=I.TEXTURE_2D_ARRAY):(xt.setTexture2D(q,0),ye=I.TEXTURE_2D),I.pixelStorei(I.UNPACK_FLIP_Y_WEBGL,q.flipY),I.pixelStorei(I.UNPACK_PREMULTIPLY_ALPHA_WEBGL,q.premultiplyAlpha),I.pixelStorei(I.UNPACK_ALIGNMENT,q.unpackAlignment);const oe=I.getParameter(I.UNPACK_ROW_LENGTH),gn=I.getParameter(I.UNPACK_IMAGE_HEIGHT),Sr=I.getParameter(I.UNPACK_SKIP_PIXELS),vn=I.getParameter(I.UNPACK_SKIP_ROWS),bs=I.getParameter(I.UNPACK_SKIP_IMAGES);I.pixelStorei(I.UNPACK_ROW_LENGTH,ve.width),I.pixelStorei(I.UNPACK_IMAGE_HEIGHT,ve.height),I.pixelStorei(I.UNPACK_SKIP_PIXELS,Xt),I.pixelStorei(I.UNPACK_SKIP_ROWS,$t),I.pixelStorei(I.UNPACK_SKIP_IMAGES,Gt);const be=P.isDataArrayTexture||P.isData3DTexture,Rn=q.isDataArrayTexture||q.isData3DTexture;if(P.isDepthTexture){const Cn=pt.get(P),Ze=pt.get(q),an=pt.get(Cn.__renderTarget),So=pt.get(Ze.__renderTarget);st.bindFramebuffer(I.READ_FRAMEBUFFER,an.__webglFramebuffer),st.bindFramebuffer(I.DRAW_FRAMEBUFFER,So.__webglFramebuffer);for(let Ji=0;Ji<It;Ji++)be&&(I.framebufferTextureLayer(I.READ_FRAMEBUFFER,I.COLOR_ATTACHMENT0,pt.get(P).__webglTexture,Y,Gt+Ji),I.framebufferTextureLayer(I.DRAW_FRAMEBUFFER,I.COLOR_ATTACHMENT0,pt.get(q).__webglTexture,yt,Te+Ji)),I.blitFramebuffer(Xt,$t,Ct,Ot,ie,ue,Ct,Ot,I.DEPTH_BUFFER_BIT,I.NEAREST);st.bindFramebuffer(I.READ_FRAMEBUFFER,null),st.bindFramebuffer(I.DRAW_FRAMEBUFFER,null)}else if(Y!==0||P.isRenderTargetTexture||pt.has(P)){const Cn=pt.get(P),Ze=pt.get(q);st.bindFramebuffer(I.READ_FRAMEBUFFER,u0),st.bindFramebuffer(I.DRAW_FRAMEBUFFER,f0);for(let an=0;an<It;an++)be?I.framebufferTextureLayer(I.READ_FRAMEBUFFER,I.COLOR_ATTACHMENT0,Cn.__webglTexture,Y,Gt+an):I.framebufferTexture2D(I.READ_FRAMEBUFFER,I.COLOR_ATTACHMENT0,I.TEXTURE_2D,Cn.__webglTexture,Y),Rn?I.framebufferTextureLayer(I.DRAW_FRAMEBUFFER,I.COLOR_ATTACHMENT0,Ze.__webglTexture,yt,Te+an):I.framebufferTexture2D(I.DRAW_FRAMEBUFFER,I.COLOR_ATTACHMENT0,I.TEXTURE_2D,Ze.__webglTexture,yt),Y!==0?I.blitFramebuffer(Xt,$t,Ct,Ot,ie,ue,Ct,Ot,I.COLOR_BUFFER_BIT,I.NEAREST):Rn?I.copyTexSubImage3D(ye,yt,ie,ue,Te+an,Xt,$t,Ct,Ot):I.copyTexSubImage2D(ye,yt,ie,ue,Xt,$t,Ct,Ot);st.bindFramebuffer(I.READ_FRAMEBUFFER,null),st.bindFramebuffer(I.DRAW_FRAMEBUFFER,null)}else Rn?P.isDataTexture||P.isData3DTexture?I.texSubImage3D(ye,yt,ie,ue,Te,Ct,Ot,It,de,Wt,ve.data):q.isCompressedArrayTexture?I.compressedTexSubImage3D(ye,yt,ie,ue,Te,Ct,Ot,It,de,ve.data):I.texSubImage3D(ye,yt,ie,ue,Te,Ct,Ot,It,de,Wt,ve):P.isDataTexture?I.texSubImage2D(I.TEXTURE_2D,yt,ie,ue,Ct,Ot,de,Wt,ve.data):P.isCompressedTexture?I.compressedTexSubImage2D(I.TEXTURE_2D,yt,ie,ue,ve.width,ve.height,de,ve.data):I.texSubImage2D(I.TEXTURE_2D,yt,ie,ue,Ct,Ot,de,Wt,ve);I.pixelStorei(I.UNPACK_ROW_LENGTH,oe),I.pixelStorei(I.UNPACK_IMAGE_HEIGHT,gn),I.pixelStorei(I.UNPACK_SKIP_PIXELS,Sr),I.pixelStorei(I.UNPACK_SKIP_ROWS,vn),I.pixelStorei(I.UNPACK_SKIP_IMAGES,bs),yt===0&&q.generateMipmaps&&I.generateMipmap(ye),st.unbindTexture()},this.initRenderTarget=function(P){pt.get(P).__webglFramebuffer===void 0&&xt.setupRenderTarget(P)},this.initTexture=function(P){P.isCubeTexture?xt.setTextureCube(P,0):P.isData3DTexture?xt.setTexture3D(P,0):P.isDataArrayTexture||P.isCompressedArrayTexture?xt.setTexture2DArray(P,0):xt.setTexture2D(P,0),st.unbindTexture()},this.resetState=function(){E=0,A=0,R=null,st.reset(),Rt.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return si}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(t){this._outputColorSpace=t;const e=this.getContext();e.drawingBufferColorSpace=ce._getDrawingBufferColorSpace(t),e.unpackColorSpace=ce._getUnpackColorSpace()}}const C_={armL:[.2,-1,0],forearmL:[.15,-1,.1],armR:[-.2,-1,0],forearmR:[-.15,-1,.1],thighL:[.05,-1,0],shinL:[0,-1,0],footL:[0,-.15,1],thighR:[-.05,-1,0],shinR:[0,-1,0],footR:[0,-.15,1]};function L_(i,t){const e=i.scale??1,n=m=>new N(...i.dir?.[m]??C_[m]).normalize(),r=Array.from({length:_c},()=>new N),s=(m,v)=>r[m].copy(v),a=(m,v,g)=>new N(m,v,g).multiplyScalar(e);s(O.hipL,a(.1,0,0)),s(O.hipR,a(-.1,0,0)),s(O.shL,a(.19,.52,-.02)),s(O.shR,a(-.19,.52,-.02));const o=new Ge().setFromEuler(new On(i.head?.[1]??0,i.head?.[0]??0,0,"YXZ")),c=a(0,.6,-.02),l=(m,v,g)=>a(m,v,g).applyQuaternion(o).add(c);s(O.nose,l(0,.1,.11)),s(O.eyeL,l(.032,.135,.09)),s(O.eyeR,l(-.032,.135,.09)),s(O.eyeInL,l(.018,.135,.095)),s(O.eyeInR,l(-.018,.135,.095)),s(O.eyeOutL,l(.05,.135,.08)),s(O.eyeOutR,l(-.05,.135,.08)),s(O.earL,l(.075,.12,0)),s(O.earR,l(-.075,.12,0)),s(O.mouthL,l(.024,.06,.095)),s(O.mouthR,l(-.024,.06,.095));for(const m of["L","R"]){const v=r[m==="L"?O.shL:O.shR],g=r[m==="L"?O.hipL:O.hipR],p=v.clone().addScaledVector(n(`arm${m}`),.29*e),y=p.clone().addScaledVector(n(`forearm${m}`),.26*e);s(m==="L"?O.elL:O.elR,p),s(m==="L"?O.wrL:O.wrR,y);const M=y.clone().addScaledVector(n(`forearm${m}`),.08*e);s(m==="L"?O.indexL:O.indexR,M.clone().add(a(0,0,.02))),s(m==="L"?O.pinkyL:O.pinkyR,M.clone().add(a(0,0,-.02))),s(m==="L"?O.thumbL:O.thumbR,y.clone().addScaledVector(n(`forearm${m}`),.04*e).add(a(0,0,.04)));const _=g.clone().addScaledVector(n(`thigh${m}`),.43*e),w=_.clone().addScaledVector(n(`shin${m}`),.42*e);s(m==="L"?O.knL:O.knR,_),s(m==="L"?O.anL:O.anR,w);const E=w.clone().add(a(0,-.04,-.05));s(m==="L"?O.heelL:O.heelR,E),s(m==="L"?O.toeL:O.toeR,E.clone().addScaledVector(n(`foot${m}`),.24*e))}const h=new Ge().setFromAxisAngle(new N(0,1,0),i.yaw??0),u=new Set([O.knL,O.knR,O.anL,O.anR,O.heelL,O.heelR,O.toeL,O.toeR]),d=[],f=[];for(let m=0;m<_c;m++){const v=r[m].clone().applyQuaternion(h),g=u.has(m)?i.legsVis??.98:.98;d.push({x:v.x,y:v.y,z:v.z,v:g});const p=os({x:v.x+i.T.x,y:v.y+i.T.y,z:v.z+i.T.z},t);f.push({x:p.x,y:p.y,z:0,v:g})}return{world:d,image:f}}function P_(i,t,e){const n=[];for(let r=0;r<i;r++){const s=t*1.3+r*2.1,a=(r-(i-1)/2)*.9+Math.sin(t*.4+r)*.15,o=Math.sin(s);n.push(L_({T:{x:a,y:-.1+.03*Math.sin(s*2),z:-3-r*.6},yaw:Math.sin(t*.5+r)*.5,head:[Math.sin(t*.7+r)*.4,Math.sin(t*.9)*.15],dir:{armR:[-1,.3+.5*o,.1],forearmR:[-.3,1,.1+.3*o],armL:[.5+.4*Math.cos(s),-.8+.6*Math.cos(s*.5),.3],forearmL:[.2,-.3,1],thighL:[.12,-1,.25*Math.max(0,o)],shinL:[.05,-1,-.2*Math.max(0,o)]},scale:1-r*.08},e))}return n}function D_(i,t,e,n){const r=i.image,s=new Float32Array(t*e),a=f=>[r[f].x*n,r[f].y],o=Math.hypot(a(O.shL)[0]-a(O.hipL)[0],a(O.shL)[1]-a(O.hipL)[1]),c=[[O.shL,O.elL,.11],[O.elL,O.wrL,.09],[O.shR,O.elR,.11],[O.elR,O.wrR,.09],[O.hipL,O.knL,.15],[O.knL,O.anL,.11],[O.hipR,O.knR,.15],[O.knR,O.anR,.11],[O.anL,O.toeL,.07],[O.anR,O.toeR,.07],[O.shL,O.hipR,.2],[O.shR,O.hipL,.2],[O.shL,O.shR,.14],[O.hipL,O.hipR,.16]],l=a(O.nose),h=a(O.earL),u=a(O.earR),d=Math.max(Math.hypot(h[0]-u[0],h[1]-u[1])*.9,o*.22);for(let f=0;f<e;f++)for(let m=0;m<t;m++){const v=(m+.5)/t*n,g=(f+.5)/e;let p=Math.hypot(v-l[0],g-(l[1]-d*.2))-d;for(const[y,M,_]of c){const w=a(y),E=a(M),A=E[0]-w[0],R=E[1]-w[1],x=A*A+R*R||1,b=Math.max(0,Math.min(1,((v-w[0])*A+(g-w[1])*R)/x));p=Math.min(p,Math.hypot(v-w[0]-A*b,g-w[1]-R*b)-_*o)}s[f*t+m]=Math.max(0,Math.min(1,.5-p/(o*.04)))}return{data:s,w:t,h:e}}function Cu(i){const t=new Map,e=new Map,n=i.clone();return pd(i,n,function(r,s){t.set(s,r),e.set(r,s)}),n.traverse(function(r){if(!r.isSkinnedMesh)return;const s=r,a=t.get(r),o=a.skeleton.bones;s.skeleton=a.skeleton.clone(),s.bindMatrix.copy(a.bindMatrix),s.skeleton.bones=o.map(function(c){return e.get(c)}),s.bind(s.skeleton,s.bindMatrix)}),n}function pd(i,t,e){e(i,t);for(let n=0;n<i.children.length;n++)pd(i.children[n],t.children[n],e)}class md extends Dt{constructor(t,e,n=!1,r=!1,s=1e4){const a=new Ee;super(a,e),this.isMarchingCubes=!0;const o=this,c=new Float32Array(36),l=new Float32Array(36),h=new Float32Array(36);this.enableUvs=n,this.enableColors=r,this.init=function(y){this.resolution=y,this.isolation=80,this.size=y,this.size2=this.size*this.size,this.size3=this.size2*this.size,this.halfsize=this.size/2,this.delta=2/this.size,this.yd=this.size,this.zd=this.size2,this.field=new Float32Array(this.size3),this.normal_cache=new Float32Array(this.size3*3),this.palette=new Float32Array(this.size3*3),this.count=0;const M=s*3;this.positionArray=new Float32Array(M*3);const _=new ae(this.positionArray,3);_.setUsage(ua),a.setAttribute("position",_),this.normalArray=new Float32Array(M*3);const w=new ae(this.normalArray,3);if(w.setUsage(ua),a.setAttribute("normal",w),this.enableUvs){this.uvArray=new Float32Array(M*2);const E=new ae(this.uvArray,2);E.setUsage(ua),a.setAttribute("uv",E)}if(this.enableColors){this.colorArray=new Float32Array(M*3);const E=new ae(this.colorArray,3);E.setUsage(ua),a.setAttribute("color",E)}a.boundingSphere=new yr(new N,1)};function u(y,M,_){return y+(M-y)*_}function d(y,M,_,w,E,A,R,x,b,S){const T=(_-R)/(x-R),L=o.normal_cache;c[M+0]=w+T*o.delta,c[M+1]=E,c[M+2]=A,l[M+0]=u(L[y+0],L[y+3],T),l[M+1]=u(L[y+1],L[y+4],T),l[M+2]=u(L[y+2],L[y+5],T),h[M+0]=u(o.palette[b*3+0],o.palette[S*3+0],T),h[M+1]=u(o.palette[b*3+1],o.palette[S*3+1],T),h[M+2]=u(o.palette[b*3+2],o.palette[S*3+2],T)}function f(y,M,_,w,E,A,R,x,b,S){const T=(_-R)/(x-R),L=o.normal_cache;c[M+0]=w,c[M+1]=E+T*o.delta,c[M+2]=A;const D=y+o.yd*3;l[M+0]=u(L[y+0],L[D+0],T),l[M+1]=u(L[y+1],L[D+1],T),l[M+2]=u(L[y+2],L[D+2],T),h[M+0]=u(o.palette[b*3+0],o.palette[S*3+0],T),h[M+1]=u(o.palette[b*3+1],o.palette[S*3+1],T),h[M+2]=u(o.palette[b*3+2],o.palette[S*3+2],T)}function m(y,M,_,w,E,A,R,x,b,S){const T=(_-R)/(x-R),L=o.normal_cache;c[M+0]=w,c[M+1]=E,c[M+2]=A+T*o.delta;const D=y+o.zd*3;l[M+0]=u(L[y+0],L[D+0],T),l[M+1]=u(L[y+1],L[D+1],T),l[M+2]=u(L[y+2],L[D+2],T),h[M+0]=u(o.palette[b*3+0],o.palette[S*3+0],T),h[M+1]=u(o.palette[b*3+1],o.palette[S*3+1],T),h[M+2]=u(o.palette[b*3+2],o.palette[S*3+2],T)}function v(y){const M=y*3;o.normal_cache[M]===0&&(o.normal_cache[M+0]=o.field[y-1]-o.field[y+1],o.normal_cache[M+1]=o.field[y-o.yd]-o.field[y+o.yd],o.normal_cache[M+2]=o.field[y-o.zd]-o.field[y+o.zd])}function g(y,M,_,w,E){const A=w+1,R=w+o.yd,x=w+o.zd,b=A+o.yd,S=A+o.zd,T=w+o.yd+o.zd,L=A+o.yd+o.zd;let D=0;const U=o.field[w],B=o.field[A],X=o.field[R],H=o.field[b],Q=o.field[x],ct=o.field[S],ut=o.field[T],vt=o.field[L];U<E&&(D|=1),B<E&&(D|=2),X<E&&(D|=8),H<E&&(D|=4),Q<E&&(D|=16),ct<E&&(D|=32),ut<E&&(D|=128),vt<E&&(D|=64);const Et=I_[D];if(Et===0)return 0;const Nt=o.delta,lt=y+Nt,G=M+Nt,J=_+Nt;Et&1&&(v(w),v(A),d(w*3,0,E,y,M,_,U,B,w,A)),Et&2&&(v(A),v(b),f(A*3,3,E,lt,M,_,B,H,A,b)),Et&4&&(v(R),v(b),d(R*3,6,E,y,G,_,X,H,R,b)),Et&8&&(v(w),v(R),f(w*3,9,E,y,M,_,U,X,w,R)),Et&16&&(v(x),v(S),d(x*3,12,E,y,M,J,Q,ct,x,S)),Et&32&&(v(S),v(L),f(S*3,15,E,lt,M,J,ct,vt,S,L)),Et&64&&(v(T),v(L),d(T*3,18,E,y,G,J,ut,vt,T,L)),Et&128&&(v(x),v(T),f(x*3,21,E,y,M,J,Q,ut,x,T)),Et&256&&(v(w),v(x),m(w*3,24,E,y,M,_,U,Q,w,x)),Et&512&&(v(A),v(S),m(A*3,27,E,lt,M,_,B,ct,A,S)),Et&1024&&(v(b),v(L),m(b*3,30,E,lt,G,_,H,vt,b,L)),Et&2048&&(v(R),v(T),m(R*3,33,E,y,G,_,X,ut,R,T)),D<<=4;let z,W,k,K=0,it=0;for(;ka[D+it]!=-1;)z=D+it,W=z+1,k=z+2,p(c,l,h,3*ka[z],3*ka[W],3*ka[k]),it+=3,K++;return K}function p(y,M,_,w,E,A){const R=o.count*3;if(o.positionArray[R+0]=y[w],o.positionArray[R+1]=y[w+1],o.positionArray[R+2]=y[w+2],o.positionArray[R+3]=y[E],o.positionArray[R+4]=y[E+1],o.positionArray[R+5]=y[E+2],o.positionArray[R+6]=y[A],o.positionArray[R+7]=y[A+1],o.positionArray[R+8]=y[A+2],o.material.flatShading===!0){const x=(M[w+0]+M[E+0]+M[A+0])/3,b=(M[w+1]+M[E+1]+M[A+1])/3,S=(M[w+2]+M[E+2]+M[A+2])/3;o.normalArray[R+0]=x,o.normalArray[R+1]=b,o.normalArray[R+2]=S,o.normalArray[R+3]=x,o.normalArray[R+4]=b,o.normalArray[R+5]=S,o.normalArray[R+6]=x,o.normalArray[R+7]=b,o.normalArray[R+8]=S}else o.normalArray[R+0]=M[w+0],o.normalArray[R+1]=M[w+1],o.normalArray[R+2]=M[w+2],o.normalArray[R+3]=M[E+0],o.normalArray[R+4]=M[E+1],o.normalArray[R+5]=M[E+2],o.normalArray[R+6]=M[A+0],o.normalArray[R+7]=M[A+1],o.normalArray[R+8]=M[A+2];if(o.enableUvs){const x=o.count*2;o.uvArray[x+0]=y[w+0],o.uvArray[x+1]=y[w+2],o.uvArray[x+2]=y[E+0],o.uvArray[x+3]=y[E+2],o.uvArray[x+4]=y[A+0],o.uvArray[x+5]=y[A+2]}o.enableColors&&(o.colorArray[R+0]=_[w+0],o.colorArray[R+1]=_[w+1],o.colorArray[R+2]=_[w+2],o.colorArray[R+3]=_[E+0],o.colorArray[R+4]=_[E+1],o.colorArray[R+5]=_[E+2],o.colorArray[R+6]=_[A+0],o.colorArray[R+7]=_[A+1],o.colorArray[R+8]=_[A+2]),o.count+=3}this.addBall=function(y,M,_,w,E,A){const R=Math.sign(w);w=Math.abs(w);const x=A!=null;let b=new Ut(y,M,_);if(x)try{b=A instanceof Ut?A:Array.isArray(A)?new Ut(Math.min(Math.abs(A[0]),1),Math.min(Math.abs(A[1]),1),Math.min(Math.abs(A[2]),1)):new Ut(A)}catch{b=new Ut(y,M,_)}const S=this.size*Math.sqrt(w/E),T=_*this.size,L=M*this.size,D=y*this.size;let U=Math.floor(T-S);U<1&&(U=1);let B=Math.floor(T+S);B>this.size-1&&(B=this.size-1);let X=Math.floor(L-S);X<1&&(X=1);let H=Math.floor(L+S);H>this.size-1&&(H=this.size-1);let Q=Math.floor(D-S);Q<1&&(Q=1);let ct=Math.floor(D+S);ct>this.size-1&&(ct=this.size-1);let ut,vt,Et,Nt,lt,G,J,z,W,k,K;for(Et=U;Et<B;Et++)for(lt=this.size2*Et,z=Et/this.size-_,W=z*z,vt=X;vt<H;vt++)for(Nt=lt+this.size*vt,J=vt/this.size-M,k=J*J,ut=Q;ut<ct;ut++)if(G=ut/this.size-y,K=w/(1e-6+G*G+k+W)-E,K>0){this.field[Nt+ut]+=K*R;const it=Math.sqrt((ut-D)*(ut-D)+(vt-L)*(vt-L)+(Et-T)*(Et-T))/S,I=1-it*it*it*(it*(it*6-15)+10);this.palette[(Nt+ut)*3+0]+=b.r*I,this.palette[(Nt+ut)*3+1]+=b.g*I,this.palette[(Nt+ut)*3+2]+=b.b*I}},this.addPlaneX=function(y,M){const _=this.size,w=this.yd,E=this.zd,A=this.field;let R,x,b,S,T,L,D,U=_*Math.sqrt(y/M);for(U>_&&(U=_),R=0;R<U;R++)if(L=R/_,S=L*L,T=y/(1e-4+S)-M,T>0)for(x=0;x<_;x++)for(D=R+x*w,b=0;b<_;b++)A[E*b+D]+=T},this.addPlaneY=function(y,M){const _=this.size,w=this.yd,E=this.zd,A=this.field;let R,x,b,S,T,L,D,U,B=_*Math.sqrt(y/M);for(B>_&&(B=_),x=0;x<B;x++)if(L=x/_,S=L*L,T=y/(1e-4+S)-M,T>0)for(D=x*w,R=0;R<_;R++)for(U=D+R,b=0;b<_;b++)A[E*b+U]+=T},this.addPlaneZ=function(y,M){const _=this.size,w=this.yd,E=this.zd,A=this.field;let R,x,b,S,T,L,D,U,B=_*Math.sqrt(y/M);for(B>_&&(B=_),b=0;b<B;b++)if(L=b/_,S=L*L,T=y/(1e-4+S)-M,T>0)for(D=E*b,x=0;x<_;x++)for(U=D+x*w,R=0;R<_;R++)A[U+R]+=T},this.setCell=function(y,M,_,w){const E=this.size2*_+this.size*M+y;this.field[E]=w},this.getCell=function(y,M,_){const w=this.size2*_+this.size*M+y;return this.field[w]},this.blur=function(y=1){const M=this.field,_=M.slice(),w=this.size,E=this.size2;for(let A=0;A<w;A++)for(let R=0;R<w;R++)for(let x=0;x<w;x++){const b=E*x+w*R+A;let S=_[b],T=1;for(let L=-1;L<=1;L+=2){const D=L+A;if(!(D<0||D>=w))for(let U=-1;U<=1;U+=2){const B=U+R;if(!(B<0||B>=w))for(let X=-1;X<=1;X+=2){const H=X+x;if(H<0||H>=w)continue;const Q=E*H+w*B+D,ct=_[Q];T++,S+=y*(ct-S)/T}}}M[b]=S}},this.reset=function(){for(let y=0;y<this.size3;y++)this.normal_cache[y*3]=0,this.field[y]=0,this.palette[y*3]=this.palette[y*3+1]=this.palette[y*3+2]=0},this.update=function(){this.count=0;const y=this.size-2;for(let M=1;M<y;M++){const _=this.size2*M,w=(M-this.halfsize)/this.halfsize;for(let E=1;E<y;E++){const A=_+this.size*E,R=(E-this.halfsize)/this.halfsize;for(let x=1;x<y;x++){const b=(x-this.halfsize)/this.halfsize,S=A+x;g(b,R,w,S,this.isolation)}}}this.geometry.setDrawRange(0,this.count),a.getAttribute("position").needsUpdate=!0,a.getAttribute("normal").needsUpdate=!0,this.enableUvs&&(a.getAttribute("uv").needsUpdate=!0),this.enableColors&&(a.getAttribute("color").needsUpdate=!0),this.count/3>s&&console.warn("THREE.MarchingCubes: Geometry buffers too small for rendering. Please create an instance with a higher poly count.")},this.init(t)}}const I_=new Int32Array([0,265,515,778,1030,1295,1541,1804,2060,2309,2575,2822,3082,3331,3593,3840,400,153,915,666,1430,1183,1941,1692,2460,2197,2975,2710,3482,3219,3993,3728,560,825,51,314,1590,1855,1077,1340,2620,2869,2111,2358,3642,3891,3129,3376,928,681,419,170,1958,1711,1445,1196,2988,2725,2479,2214,4010,3747,3497,3232,1120,1385,1635,1898,102,367,613,876,3180,3429,3695,3942,2154,2403,2665,2912,1520,1273,2035,1786,502,255,1013,764,3580,3317,4095,3830,2554,2291,3065,2800,1616,1881,1107,1370,598,863,85,348,3676,3925,3167,3414,2650,2899,2137,2384,1984,1737,1475,1226,966,719,453,204,4044,3781,3535,3270,3018,2755,2505,2240,2240,2505,2755,3018,3270,3535,3781,4044,204,453,719,966,1226,1475,1737,1984,2384,2137,2899,2650,3414,3167,3925,3676,348,85,863,598,1370,1107,1881,1616,2800,3065,2291,2554,3830,4095,3317,3580,764,1013,255,502,1786,2035,1273,1520,2912,2665,2403,2154,3942,3695,3429,3180,876,613,367,102,1898,1635,1385,1120,3232,3497,3747,4010,2214,2479,2725,2988,1196,1445,1711,1958,170,419,681,928,3376,3129,3891,3642,2358,2111,2869,2620,1340,1077,1855,1590,314,51,825,560,3728,3993,3219,3482,2710,2975,2197,2460,1692,1941,1183,1430,666,915,153,400,3840,3593,3331,3082,2822,2575,2309,2060,1804,1541,1295,1030,778,515,265,0]),ka=new Int32Array([-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,8,3,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,1,9,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,1,8,3,9,8,1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,1,2,10,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,8,3,1,2,10,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,9,2,10,0,2,9,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,2,8,3,2,10,8,10,9,8,-1,-1,-1,-1,-1,-1,-1,3,11,2,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,11,2,8,11,0,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,1,9,0,2,3,11,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,1,11,2,1,9,11,9,8,11,-1,-1,-1,-1,-1,-1,-1,3,10,1,11,10,3,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,10,1,0,8,10,8,11,10,-1,-1,-1,-1,-1,-1,-1,3,9,0,3,11,9,11,10,9,-1,-1,-1,-1,-1,-1,-1,9,8,10,10,8,11,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,4,7,8,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,4,3,0,7,3,4,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,1,9,8,4,7,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,4,1,9,4,7,1,7,3,1,-1,-1,-1,-1,-1,-1,-1,1,2,10,8,4,7,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,3,4,7,3,0,4,1,2,10,-1,-1,-1,-1,-1,-1,-1,9,2,10,9,0,2,8,4,7,-1,-1,-1,-1,-1,-1,-1,2,10,9,2,9,7,2,7,3,7,9,4,-1,-1,-1,-1,8,4,7,3,11,2,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,11,4,7,11,2,4,2,0,4,-1,-1,-1,-1,-1,-1,-1,9,0,1,8,4,7,2,3,11,-1,-1,-1,-1,-1,-1,-1,4,7,11,9,4,11,9,11,2,9,2,1,-1,-1,-1,-1,3,10,1,3,11,10,7,8,4,-1,-1,-1,-1,-1,-1,-1,1,11,10,1,4,11,1,0,4,7,11,4,-1,-1,-1,-1,4,7,8,9,0,11,9,11,10,11,0,3,-1,-1,-1,-1,4,7,11,4,11,9,9,11,10,-1,-1,-1,-1,-1,-1,-1,9,5,4,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,9,5,4,0,8,3,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,5,4,1,5,0,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,8,5,4,8,3,5,3,1,5,-1,-1,-1,-1,-1,-1,-1,1,2,10,9,5,4,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,3,0,8,1,2,10,4,9,5,-1,-1,-1,-1,-1,-1,-1,5,2,10,5,4,2,4,0,2,-1,-1,-1,-1,-1,-1,-1,2,10,5,3,2,5,3,5,4,3,4,8,-1,-1,-1,-1,9,5,4,2,3,11,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,11,2,0,8,11,4,9,5,-1,-1,-1,-1,-1,-1,-1,0,5,4,0,1,5,2,3,11,-1,-1,-1,-1,-1,-1,-1,2,1,5,2,5,8,2,8,11,4,8,5,-1,-1,-1,-1,10,3,11,10,1,3,9,5,4,-1,-1,-1,-1,-1,-1,-1,4,9,5,0,8,1,8,10,1,8,11,10,-1,-1,-1,-1,5,4,0,5,0,11,5,11,10,11,0,3,-1,-1,-1,-1,5,4,8,5,8,10,10,8,11,-1,-1,-1,-1,-1,-1,-1,9,7,8,5,7,9,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,9,3,0,9,5,3,5,7,3,-1,-1,-1,-1,-1,-1,-1,0,7,8,0,1,7,1,5,7,-1,-1,-1,-1,-1,-1,-1,1,5,3,3,5,7,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,9,7,8,9,5,7,10,1,2,-1,-1,-1,-1,-1,-1,-1,10,1,2,9,5,0,5,3,0,5,7,3,-1,-1,-1,-1,8,0,2,8,2,5,8,5,7,10,5,2,-1,-1,-1,-1,2,10,5,2,5,3,3,5,7,-1,-1,-1,-1,-1,-1,-1,7,9,5,7,8,9,3,11,2,-1,-1,-1,-1,-1,-1,-1,9,5,7,9,7,2,9,2,0,2,7,11,-1,-1,-1,-1,2,3,11,0,1,8,1,7,8,1,5,7,-1,-1,-1,-1,11,2,1,11,1,7,7,1,5,-1,-1,-1,-1,-1,-1,-1,9,5,8,8,5,7,10,1,3,10,3,11,-1,-1,-1,-1,5,7,0,5,0,9,7,11,0,1,0,10,11,10,0,-1,11,10,0,11,0,3,10,5,0,8,0,7,5,7,0,-1,11,10,5,7,11,5,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,10,6,5,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,8,3,5,10,6,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,9,0,1,5,10,6,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,1,8,3,1,9,8,5,10,6,-1,-1,-1,-1,-1,-1,-1,1,6,5,2,6,1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,1,6,5,1,2,6,3,0,8,-1,-1,-1,-1,-1,-1,-1,9,6,5,9,0,6,0,2,6,-1,-1,-1,-1,-1,-1,-1,5,9,8,5,8,2,5,2,6,3,2,8,-1,-1,-1,-1,2,3,11,10,6,5,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,11,0,8,11,2,0,10,6,5,-1,-1,-1,-1,-1,-1,-1,0,1,9,2,3,11,5,10,6,-1,-1,-1,-1,-1,-1,-1,5,10,6,1,9,2,9,11,2,9,8,11,-1,-1,-1,-1,6,3,11,6,5,3,5,1,3,-1,-1,-1,-1,-1,-1,-1,0,8,11,0,11,5,0,5,1,5,11,6,-1,-1,-1,-1,3,11,6,0,3,6,0,6,5,0,5,9,-1,-1,-1,-1,6,5,9,6,9,11,11,9,8,-1,-1,-1,-1,-1,-1,-1,5,10,6,4,7,8,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,4,3,0,4,7,3,6,5,10,-1,-1,-1,-1,-1,-1,-1,1,9,0,5,10,6,8,4,7,-1,-1,-1,-1,-1,-1,-1,10,6,5,1,9,7,1,7,3,7,9,4,-1,-1,-1,-1,6,1,2,6,5,1,4,7,8,-1,-1,-1,-1,-1,-1,-1,1,2,5,5,2,6,3,0,4,3,4,7,-1,-1,-1,-1,8,4,7,9,0,5,0,6,5,0,2,6,-1,-1,-1,-1,7,3,9,7,9,4,3,2,9,5,9,6,2,6,9,-1,3,11,2,7,8,4,10,6,5,-1,-1,-1,-1,-1,-1,-1,5,10,6,4,7,2,4,2,0,2,7,11,-1,-1,-1,-1,0,1,9,4,7,8,2,3,11,5,10,6,-1,-1,-1,-1,9,2,1,9,11,2,9,4,11,7,11,4,5,10,6,-1,8,4,7,3,11,5,3,5,1,5,11,6,-1,-1,-1,-1,5,1,11,5,11,6,1,0,11,7,11,4,0,4,11,-1,0,5,9,0,6,5,0,3,6,11,6,3,8,4,7,-1,6,5,9,6,9,11,4,7,9,7,11,9,-1,-1,-1,-1,10,4,9,6,4,10,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,4,10,6,4,9,10,0,8,3,-1,-1,-1,-1,-1,-1,-1,10,0,1,10,6,0,6,4,0,-1,-1,-1,-1,-1,-1,-1,8,3,1,8,1,6,8,6,4,6,1,10,-1,-1,-1,-1,1,4,9,1,2,4,2,6,4,-1,-1,-1,-1,-1,-1,-1,3,0,8,1,2,9,2,4,9,2,6,4,-1,-1,-1,-1,0,2,4,4,2,6,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,8,3,2,8,2,4,4,2,6,-1,-1,-1,-1,-1,-1,-1,10,4,9,10,6,4,11,2,3,-1,-1,-1,-1,-1,-1,-1,0,8,2,2,8,11,4,9,10,4,10,6,-1,-1,-1,-1,3,11,2,0,1,6,0,6,4,6,1,10,-1,-1,-1,-1,6,4,1,6,1,10,4,8,1,2,1,11,8,11,1,-1,9,6,4,9,3,6,9,1,3,11,6,3,-1,-1,-1,-1,8,11,1,8,1,0,11,6,1,9,1,4,6,4,1,-1,3,11,6,3,6,0,0,6,4,-1,-1,-1,-1,-1,-1,-1,6,4,8,11,6,8,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,7,10,6,7,8,10,8,9,10,-1,-1,-1,-1,-1,-1,-1,0,7,3,0,10,7,0,9,10,6,7,10,-1,-1,-1,-1,10,6,7,1,10,7,1,7,8,1,8,0,-1,-1,-1,-1,10,6,7,10,7,1,1,7,3,-1,-1,-1,-1,-1,-1,-1,1,2,6,1,6,8,1,8,9,8,6,7,-1,-1,-1,-1,2,6,9,2,9,1,6,7,9,0,9,3,7,3,9,-1,7,8,0,7,0,6,6,0,2,-1,-1,-1,-1,-1,-1,-1,7,3,2,6,7,2,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,2,3,11,10,6,8,10,8,9,8,6,7,-1,-1,-1,-1,2,0,7,2,7,11,0,9,7,6,7,10,9,10,7,-1,1,8,0,1,7,8,1,10,7,6,7,10,2,3,11,-1,11,2,1,11,1,7,10,6,1,6,7,1,-1,-1,-1,-1,8,9,6,8,6,7,9,1,6,11,6,3,1,3,6,-1,0,9,1,11,6,7,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,7,8,0,7,0,6,3,11,0,11,6,0,-1,-1,-1,-1,7,11,6,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,7,6,11,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,3,0,8,11,7,6,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,1,9,11,7,6,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,8,1,9,8,3,1,11,7,6,-1,-1,-1,-1,-1,-1,-1,10,1,2,6,11,7,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,1,2,10,3,0,8,6,11,7,-1,-1,-1,-1,-1,-1,-1,2,9,0,2,10,9,6,11,7,-1,-1,-1,-1,-1,-1,-1,6,11,7,2,10,3,10,8,3,10,9,8,-1,-1,-1,-1,7,2,3,6,2,7,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,7,0,8,7,6,0,6,2,0,-1,-1,-1,-1,-1,-1,-1,2,7,6,2,3,7,0,1,9,-1,-1,-1,-1,-1,-1,-1,1,6,2,1,8,6,1,9,8,8,7,6,-1,-1,-1,-1,10,7,6,10,1,7,1,3,7,-1,-1,-1,-1,-1,-1,-1,10,7,6,1,7,10,1,8,7,1,0,8,-1,-1,-1,-1,0,3,7,0,7,10,0,10,9,6,10,7,-1,-1,-1,-1,7,6,10,7,10,8,8,10,9,-1,-1,-1,-1,-1,-1,-1,6,8,4,11,8,6,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,3,6,11,3,0,6,0,4,6,-1,-1,-1,-1,-1,-1,-1,8,6,11,8,4,6,9,0,1,-1,-1,-1,-1,-1,-1,-1,9,4,6,9,6,3,9,3,1,11,3,6,-1,-1,-1,-1,6,8,4,6,11,8,2,10,1,-1,-1,-1,-1,-1,-1,-1,1,2,10,3,0,11,0,6,11,0,4,6,-1,-1,-1,-1,4,11,8,4,6,11,0,2,9,2,10,9,-1,-1,-1,-1,10,9,3,10,3,2,9,4,3,11,3,6,4,6,3,-1,8,2,3,8,4,2,4,6,2,-1,-1,-1,-1,-1,-1,-1,0,4,2,4,6,2,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,1,9,0,2,3,4,2,4,6,4,3,8,-1,-1,-1,-1,1,9,4,1,4,2,2,4,6,-1,-1,-1,-1,-1,-1,-1,8,1,3,8,6,1,8,4,6,6,10,1,-1,-1,-1,-1,10,1,0,10,0,6,6,0,4,-1,-1,-1,-1,-1,-1,-1,4,6,3,4,3,8,6,10,3,0,3,9,10,9,3,-1,10,9,4,6,10,4,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,4,9,5,7,6,11,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,8,3,4,9,5,11,7,6,-1,-1,-1,-1,-1,-1,-1,5,0,1,5,4,0,7,6,11,-1,-1,-1,-1,-1,-1,-1,11,7,6,8,3,4,3,5,4,3,1,5,-1,-1,-1,-1,9,5,4,10,1,2,7,6,11,-1,-1,-1,-1,-1,-1,-1,6,11,7,1,2,10,0,8,3,4,9,5,-1,-1,-1,-1,7,6,11,5,4,10,4,2,10,4,0,2,-1,-1,-1,-1,3,4,8,3,5,4,3,2,5,10,5,2,11,7,6,-1,7,2,3,7,6,2,5,4,9,-1,-1,-1,-1,-1,-1,-1,9,5,4,0,8,6,0,6,2,6,8,7,-1,-1,-1,-1,3,6,2,3,7,6,1,5,0,5,4,0,-1,-1,-1,-1,6,2,8,6,8,7,2,1,8,4,8,5,1,5,8,-1,9,5,4,10,1,6,1,7,6,1,3,7,-1,-1,-1,-1,1,6,10,1,7,6,1,0,7,8,7,0,9,5,4,-1,4,0,10,4,10,5,0,3,10,6,10,7,3,7,10,-1,7,6,10,7,10,8,5,4,10,4,8,10,-1,-1,-1,-1,6,9,5,6,11,9,11,8,9,-1,-1,-1,-1,-1,-1,-1,3,6,11,0,6,3,0,5,6,0,9,5,-1,-1,-1,-1,0,11,8,0,5,11,0,1,5,5,6,11,-1,-1,-1,-1,6,11,3,6,3,5,5,3,1,-1,-1,-1,-1,-1,-1,-1,1,2,10,9,5,11,9,11,8,11,5,6,-1,-1,-1,-1,0,11,3,0,6,11,0,9,6,5,6,9,1,2,10,-1,11,8,5,11,5,6,8,0,5,10,5,2,0,2,5,-1,6,11,3,6,3,5,2,10,3,10,5,3,-1,-1,-1,-1,5,8,9,5,2,8,5,6,2,3,8,2,-1,-1,-1,-1,9,5,6,9,6,0,0,6,2,-1,-1,-1,-1,-1,-1,-1,1,5,8,1,8,0,5,6,8,3,8,2,6,2,8,-1,1,5,6,2,1,6,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,1,3,6,1,6,10,3,8,6,5,6,9,8,9,6,-1,10,1,0,10,0,6,9,5,0,5,6,0,-1,-1,-1,-1,0,3,8,5,6,10,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,10,5,6,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,11,5,10,7,5,11,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,11,5,10,11,7,5,8,3,0,-1,-1,-1,-1,-1,-1,-1,5,11,7,5,10,11,1,9,0,-1,-1,-1,-1,-1,-1,-1,10,7,5,10,11,7,9,8,1,8,3,1,-1,-1,-1,-1,11,1,2,11,7,1,7,5,1,-1,-1,-1,-1,-1,-1,-1,0,8,3,1,2,7,1,7,5,7,2,11,-1,-1,-1,-1,9,7,5,9,2,7,9,0,2,2,11,7,-1,-1,-1,-1,7,5,2,7,2,11,5,9,2,3,2,8,9,8,2,-1,2,5,10,2,3,5,3,7,5,-1,-1,-1,-1,-1,-1,-1,8,2,0,8,5,2,8,7,5,10,2,5,-1,-1,-1,-1,9,0,1,5,10,3,5,3,7,3,10,2,-1,-1,-1,-1,9,8,2,9,2,1,8,7,2,10,2,5,7,5,2,-1,1,3,5,3,7,5,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,8,7,0,7,1,1,7,5,-1,-1,-1,-1,-1,-1,-1,9,0,3,9,3,5,5,3,7,-1,-1,-1,-1,-1,-1,-1,9,8,7,5,9,7,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,5,8,4,5,10,8,10,11,8,-1,-1,-1,-1,-1,-1,-1,5,0,4,5,11,0,5,10,11,11,3,0,-1,-1,-1,-1,0,1,9,8,4,10,8,10,11,10,4,5,-1,-1,-1,-1,10,11,4,10,4,5,11,3,4,9,4,1,3,1,4,-1,2,5,1,2,8,5,2,11,8,4,5,8,-1,-1,-1,-1,0,4,11,0,11,3,4,5,11,2,11,1,5,1,11,-1,0,2,5,0,5,9,2,11,5,4,5,8,11,8,5,-1,9,4,5,2,11,3,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,2,5,10,3,5,2,3,4,5,3,8,4,-1,-1,-1,-1,5,10,2,5,2,4,4,2,0,-1,-1,-1,-1,-1,-1,-1,3,10,2,3,5,10,3,8,5,4,5,8,0,1,9,-1,5,10,2,5,2,4,1,9,2,9,4,2,-1,-1,-1,-1,8,4,5,8,5,3,3,5,1,-1,-1,-1,-1,-1,-1,-1,0,4,5,1,0,5,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,8,4,5,8,5,3,9,0,5,0,3,5,-1,-1,-1,-1,9,4,5,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,4,11,7,4,9,11,9,10,11,-1,-1,-1,-1,-1,-1,-1,0,8,3,4,9,7,9,11,7,9,10,11,-1,-1,-1,-1,1,10,11,1,11,4,1,4,0,7,4,11,-1,-1,-1,-1,3,1,4,3,4,8,1,10,4,7,4,11,10,11,4,-1,4,11,7,9,11,4,9,2,11,9,1,2,-1,-1,-1,-1,9,7,4,9,11,7,9,1,11,2,11,1,0,8,3,-1,11,7,4,11,4,2,2,4,0,-1,-1,-1,-1,-1,-1,-1,11,7,4,11,4,2,8,3,4,3,2,4,-1,-1,-1,-1,2,9,10,2,7,9,2,3,7,7,4,9,-1,-1,-1,-1,9,10,7,9,7,4,10,2,7,8,7,0,2,0,7,-1,3,7,10,3,10,2,7,4,10,1,10,0,4,0,10,-1,1,10,2,8,7,4,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,4,9,1,4,1,7,7,1,3,-1,-1,-1,-1,-1,-1,-1,4,9,1,4,1,7,0,8,1,8,7,1,-1,-1,-1,-1,4,0,3,7,4,3,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,4,8,7,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,9,10,8,10,11,8,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,3,0,9,3,9,11,11,9,10,-1,-1,-1,-1,-1,-1,-1,0,1,10,0,10,8,8,10,11,-1,-1,-1,-1,-1,-1,-1,3,1,10,11,3,10,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,1,2,11,1,11,9,9,11,8,-1,-1,-1,-1,-1,-1,-1,3,0,9,3,9,11,1,2,9,2,11,9,-1,-1,-1,-1,0,2,11,8,0,11,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,3,2,11,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,2,3,8,2,8,10,10,8,9,-1,-1,-1,-1,-1,-1,-1,9,10,2,0,9,2,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,2,3,8,2,8,10,0,1,8,1,10,8,-1,-1,-1,-1,1,10,2,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,1,3,8,9,1,8,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,9,1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,3,8,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1]),gd={uFurFade:{value:1}},U_=`
  float furHash(vec3 p) { p = fract(p * 0.1031); p += dot(p, p.zyx + 31.32); return fract((p.x + p.y) * p.z); }
  float furNoise(vec3 p) { vec3 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f);
    return mix(mix(mix(furHash(i), furHash(i + vec3(1, 0, 0)), f.x), mix(furHash(i + vec3(0, 1, 0)), furHash(i + vec3(1, 1, 0)), f.x), f.y),
               mix(mix(furHash(i + vec3(0, 0, 1)), furHash(i + vec3(1, 0, 1)), f.x), mix(furHash(i + vec3(0, 1, 1)), furHash(i + vec3(1, 1, 1)), f.x), f.y), f.z); }`;function N_(i,t){const e=new Mi({vertexColors:!0,roughness:t.feather?.75:.92,metalness:0}),n={uH:{value:i},uFurLen:{value:t.length},uFurDensity:{value:t.density},uFurTip:{value:t.tip},uFeather:{value:t.feather?1:0}};return e.onBeforeCompile=r=>{Object.assign(r.uniforms,n,gd),r.vertexShader=r.vertexShader.replace("#include <common>",`#include <common>
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
        ${U_}`).replace("#include <color_fragment>",`#include <color_fragment>
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
        diffuseColor.rgb = mix(diffuseColor.rgb, diffuseColor.rgb * 1.25 + 0.06, uFurTip * smoothstep(0.6, 1.0, t));`)},e.customProgramCacheKey=()=>"kaiju-fur-v2",e}function F_(i,t,e,n){const r=[];for(let s=1;s<=n;s++){const a=new $f(t,N_(s/n,e));a.castShadow=!1,a.receiveShadow=!0,a.frustumCulled=!1,a.userData.h=s/n,i.add(a),a.bind(i.skeleton,i.bindMatrix),r.push(a)}return r}function O_(i=512){const t=document.createElement("canvas");t.width=t.height=i;const e=t.getContext("2d"),n=document.createElement("canvas");n.width=n.height=i;const r=n.getContext("2d"),s=e.createImageData(i,i),a=r.createImageData(i,i),o=22,c=[];let l=7;const h=()=>(l=l*1664525+1013904223>>>0,l/4294967296);for(let f=0;f<o;f++)for(let m=0;m<o;m++)c.push([(m+.2+h()*.6)/o,(f+.2+h()*.6)/o,.7+h()*.3]);for(let f=0;f<i;f++)for(let m=0;m<i;m++){const v=m/i,g=f/i,p=Math.floor(v*o),y=Math.floor(g*o);let M=9,_=9,w=1;for(let T=-1;T<=1;T++)for(let L=-1;L<=1;L++){const D=(p+L+o)%o,U=(y+T+o)%o,B=c[U*o+D];let X=v-B[0],H=g-B[1];X-=Math.round(X),H-=Math.round(H);const Q=Math.sqrt(X*X+H*H);Q<M?(_=M,M=Q,w=B[2]):Q<_&&(_=Q)}const E=_-M,A=Math.min(1,E/.02),R=1-Math.min(1,M/(.55/o)),x=(.55+.45*A)*w*(.85+.3*R),b=(f*i+m)*4;s.data[b]=255*x,s.data[b+1]=255*x,s.data[b+2]=255*x,s.data[b+3]=255;const S=.55+.4*(1-A)-.15*R;a.data[b]=255*S,a.data[b+1]=255*S,a.data[b+2]=255*S,a.data[b+3]=255}e.putImageData(s,0,0),r.putImageData(a,0,0);const u=new Zh(t);u.wrapS=u.wrapT=us,u.colorSpace=ii;const d=new Zh(n);return d.wrapS=d.wrapT=us,{map:u,rough:d}}let za=null;function B_(i=!1,t){if(i)return k_();if(t==="armour")return new Mi({vertexColors:!0,roughness:.42,metalness:.45});if(t==="soft")return new Mi({vertexColors:!0,roughness:.82,metalness:0});if(t==="suit")return new Mi({vertexColors:!0,roughness:.34,metalness:.18});!za&&typeof document<"u"&&(za=O_());const e=new Mi({vertexColors:!0,roughness:.7,metalness:.02});return e.onBeforeCompile=n=>{n.uniforms.uScales={value:za?.map??null},n.uniforms.uRough={value:za?.rough??null},n.vertexShader=n.vertexShader.replace("#include <common>",`#include <common>
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
        float roughTex = triplanar(uRough, vBind, bn, sc).r;`).replace("#include <roughnessmap_fragment>","float roughnessFactor = mix(roughTex, 0.9, isBone);")},e.customProgramCacheKey=()=>"kaiju-v1",e}function k_(){const i=new Mi({vertexColors:!0,roughness:.95,metalness:0});return i.onBeforeCompile=t=>{Object.assign(t.uniforms,gd),t.fragmentShader=t.fragmentShader.replace("#include <common>",`#include <common>
 uniform float uFurFade;`).replace("#include <color_fragment>",`#include <color_fragment>
 diffuseColor.rgb *= mix(1.0, 0.6, uFurFade);`)},i.customProgramCacheKey=()=>"kaiju-undercoat-v1",i}function fl(i){const t=new Ee;return t.setAttribute("position",new ae(i.position,3)),t.setAttribute("normal",new ae(i.normal,3)),t.setAttribute("color",new ae(i.color,3)),i.aFur&&t.setAttribute("aFur",new ae(i.aFur,1)),t.setAttribute("skinIndex",new ae(i.skinIndex,4)),t.setAttribute("skinWeight",new ae(i.skinWeight,4)),t}function Lu(i,t,e){return fl(z_(i,t,e))}function z_(i,t,e){const n=i.box,r=(n.min[0]+n.max[0])/2,s=(n.min[1]+n.max[1])/2,a=(n.min[2]+n.max[2])/2,o=(n.max[0]-n.min[0])/2,c=(n.max[1]-n.min[1])/2,l=(n.max[2]-n.min[2])/2,h=new md(e,new $i,!1,!1,4e5);h.isolation=50;const u=h.field,d=e;for(let S=0;S<d;S++){const T=a+(S/(d-1)*2-1)*l;for(let L=0;L<d;L++){const D=s+(L/(d-1)*2-1)*c;for(let U=0;U<d;U++){const B=r+(U/(d-1)*2-1)*o;u[S*d*d+L*d+U]=Math.max(0,Math.min(100,50-i.sdf(B,D,T)*40))}}}h.update();const f=h.count,m=new Float32Array(f*3),v=new Float32Array(f*3),g=new Float32Array(f*3),p=h.positionArray,y=h.normalArray,M=i.palette.map(S=>new Ut(S)),_=new Ut;for(let S=0;S<f;S++){const T=r+p[S*3]*o,L=s+p[S*3+1]*c,D=a+p[S*3+2]*l;m[S*3]=T,m[S*3+1]=L,m[S*3+2]=D;let U=y[S*3]/o,B=y[S*3+1]/c,X=y[S*3+2]/l;const H=Math.hypot(U,B,X)||1;U/=H,B/=H,X/=H,v[S*3]=U,v[S*3+1]=B,v[S*3+2]=X;const Q=i.region(T,L,D);_.copy(M[Q]??M[0]),i.tint?.(Q,T,L,D,_);const ct=.94+.06*Math.sin(L*1.7+D*.9)*Math.cos(T*2.3);g[S*3]=_.r*ct,g[S*3+1]=_.g*ct,g[S*3+2]=_.b*ct}h.geometry.dispose();let w;if(i.fur){w=new Float32Array(f);for(let S=0;S<f;S++)w[S]=i.furLen?i.furLen(m[S*3],m[S*3+1],m[S*3+2]):1}const E=new Uint16Array(f*4),A=new Float32Array(f*4),R=t.map((S,T)=>({i:T,a:S.a,b:S.b,reach:S.reach??1/0,name:S.name})),x=i.capture,b=i.weights??"sharp";for(let S=0;S<f;S++){const T=m[S*3],L=m[S*3+1],D=m[S*3+2];let U=1/0,B=1/0,X=0,H=0;for(const vt of R){if(x&&!x(vt,T,L,D))continue;const Et=vt.b[0]-vt.a[0],Nt=vt.b[1]-vt.a[1],lt=vt.b[2]-vt.a[2],G=T-vt.a[0],J=L-vt.a[1],z=D-vt.a[2],W=Math.max(0,Math.min(1,(G*Et+J*Nt+z*lt)/(Et*Et+Nt*Nt+lt*lt||1))),k=Math.hypot(G-Et*W,J-Nt*W,z-lt*W);k>vt.reach||(k<U?(B=U,H=X,U=k,X=vt.i):k<B&&(B=k,H=vt.i))}isFinite(B)||(B=U,H=X);const Q=b==="rigid"?1:b==="soft"?1/Math.pow(U+1.2,2):1/Math.pow(U+.3,4),ct=b==="rigid"?0:b==="soft"?1/Math.pow(B+1.2,2):1/Math.pow(B+.3,4),ut=Q+ct;E[S*4]=X,E[S*4+1]=H,A[S*4]=Q/ut,A[S*4+1]=ct/ut}return{position:m,normal:v,color:g,skinIndex:E,skinWeight:A,aFur:w}}const H_=(i,t=i.res??88)=>({body:t,fur:Math.max(32,Math.round(t*.6))});function V_(i){const t=new Map;let e=null;for(const n of i){const r=new jf;if(r.name=n.name,n.parent){const s=i.find(a=>a.name===n.parent);r.position.set(n.a[0]-s.a[0],n.a[1]-s.a[1],n.a[2]-s.a[2]),t.get(n.parent).add(r)}else r.position.set(n.a[0],n.a[1],n.a[2]),e=r;t.set(n.name,r)}return{bones:t,root:e}}function sc(i,t=i.res??88,e){const n=performance.now(),r=H_(i,t),{bones:s,root:a}=V_(i.segs);let o,c=[];if(i.body){const l=i.body,h=e?fl(e.body):Lu(l,i.segs,r.body),u=l.surface==="scales"||l.surface==="fur"?void 0:l.surface,d=new $f(h,B_(!!l.fur||l.surface==="fur",u));d.castShadow=!0,d.receiveShadow=!0,d.frustumCulled=!1,d.add(a),d.bind(new Fl(i.segs.map(f=>s.get(f.name)))),l.fur&&(i.furShells??10)>0&&(c=F_(d,e?.fur?fl(e.fur):Lu(l,i.segs,r.fur),l.fur,i.furShells??10)),o=d}else{const l=new ze;l.add(a),o=l}if(i.dress){const l=new Map;i.dress({bones:s,segs:i.segs,at(h,u,d,f,m){const v=i.segs.find(g=>g.name===u);return h.position.set(d-v.a[0],f-v.a[1],m-v.a[2]),h.traverse(g=>{g.isMesh&&(g.castShadow=!0,g.receiveShadow=!0)}),s.get(u).add(h),h},std(h){const u=JSON.stringify(h);let d=l.get(u);return d||(d=new Mi(h),l.set(u,d)),d}})}return o.name=i.id,{def:i,root:o,bones:s,fur:c,ms:performance.now()-n}}const rt=(i,t,e)=>{const n=Math.max(e-Math.abs(i-t),0)/e;return Math.min(i,t)-n*n*e*.25};function Ae(i,t,e,n,r,s,a){const o=i-n,c=t-r,l=e-s;return Math.sqrt(o*o+c*c+l*l)-a}function St(i,t,e,n,r,s,a,o,c,l,h){const u=a-n,d=o-r,f=c-s,m=i-n,v=t-r,g=e-s,p=Math.max(0,Math.min(1,(m*u+v*d+g*f)/(u*u+d*d+f*f))),y=m-u*p,M=v-d*p,_=g-f*p;return Math.sqrt(y*y+M*M+_*_)-(l+(h-l)*p)}function Pt(i,t,e,n,r,s,a,o,c){const l=(i-n)/a,h=(t-r)/o,u=(e-s)/c,d=Math.sqrt(l*l+h*h+u*u),f=Math.sqrt(l*l/a+h*h/o+u*u/c);return f>0?d*(d-1)/f:-Math.min(a,o,c)}const xr=2.1,Kr=[1.95,6,.2],ai=[xr,3.4,.55],lr=[xr,1,0],Pu=[xr,.3,2],ti=[2.9,11,.8],Tn=[4.99,10.54,1.28],Wi=[6.76,10.06,1.79],ln=[[0,6.6,-2.6],[.5,4.6,-4.4],[1.6,2.4,-5.3],[3,1.1,-5.2],[4.5,.85,-4.1]],Du=[1.15,1.45,1.4,1.2,.75],Me=[0,14.4,.6],G_=[{name:"pelvis",a:[0,6,0],b:[0,7.6,0],parent:null},{name:"spine1",a:[0,7.6,0],b:[0,9.4,.1],parent:"pelvis"},{name:"spine2",a:[0,9.4,.1],b:[0,11.4,.1],parent:"spine1"},{name:"neck",a:[0,11.4,.1],b:[0,Me[1]-1.6,Me[2]-.25],parent:"spine2"},{name:"head",a:[0,Me[1]-1.6,Me[2]-.25],b:[0,Me[1]+1.6,Me[2]+.1],parent:"neck"},{name:"jaw",a:[0,Me[1]-1.1,Me[2]+1.1],b:[0,Me[1]-1.2,Me[2]+2.9],parent:"head",reach:0},{name:"tail1",a:ln[0],b:ln[1],parent:"pelvis"},{name:"tail2",a:ln[1],b:ln[2],parent:"tail1"},{name:"tail3",a:ln[2],b:ln[3],parent:"tail2"},{name:"tail4",a:ln[3],b:ln[4],parent:"tail3"},{name:"thighL",a:Kr,b:ai,parent:"pelvis"},{name:"shinL",a:ai,b:lr,parent:"thighL"},{name:"footL",a:lr,b:Pu,parent:"shinL"},{name:"thighR",a:Zn(Kr),b:Zn(ai),parent:"pelvis"},{name:"shinR",a:Zn(ai),b:Zn(lr),parent:"thighR"},{name:"footR",a:Zn(lr),b:Zn(Pu),parent:"shinR"},{name:"armL",a:ti,b:Tn,parent:"spine2"},{name:"forearmL",a:Tn,b:Wi,parent:"armL"},{name:"armR",a:Zn(ti),b:Zn(Tn),parent:"spine2"},{name:"forearmR",a:Zn(Tn),b:Zn(Wi),parent:"armR"}];function Zn(i){return[-i[0],i[1],i[2]]}const W_={min:[-8.6,-.4,-7.2],max:[8.6,18.4,5.8]},hn=[.98,Me[1]+.33,Me[2]+1.97],hr=[0,Me[1]-.5,Me[2]+4.05],Xn=ql(vd(Wi,Tn)),ac=ql([-Xn[2],0,Xn[0]]);function vd(i,t){return[i[0]-t[0],i[1]-t[1],i[2]-t[2]]}function ql(i){const t=Math.hypot(i[0],i[1],i[2]);return[i[0]/t,i[1]/t,i[2]/t]}const gs=(i,t,e,n=0)=>[i[0]+Xn[0]*t+ac[0]*e,i[1]+Xn[1]*t+ac[1]*e+n,i[2]+Xn[2]*t+ac[2]*e],Vn=gs(Wi,.35,0),X_=gs(Vn,1.3,0),xd=(i,t,e)=>(i-Wi[0])*Xn[0]+(t-Wi[1])*Xn[1]+(e-Wi[2])*Xn[2],_d=[-.42,-.14,.14,.42].map(i=>[gs(Vn,.35,i*1.1),gs(Vn,1.15-Math.abs(i)*.5,i*1.35,-.12)]);_d.push([gs(Vn,-.1,.45),gs(Vn,.45,.95,-.1)]);const q_=[-.5,-.17,.17,.5].map(i=>[[xr+i*1.1,.3,1.8],[xr+i*1.3,.22,2.7-Math.abs(i)*.4]]),Ii=(i,t,e,n,r,s,a)=>St(i,t,e,n[0],n[1],n[2],r[0],r[1],r[2],s,a),kr=2.5;let Iu=NaN,Uu=NaN,Nu=NaN;const Ui={body:0,head:0,arm:0,leg:0,tail:0,min:0};function ra(i,t,e){if(i===Iu&&t===Uu&&e===Nu)return Ui;Iu=i,Uu=t,Nu=e;const n=Math.abs(i);let r=Ae(i,t,e,0,9.2,.2,5.6);r<kr&&(r=Pt(i,t,e,0,7.7,.35,3.85,3.35,3.4),r=rt(r,Pt(i,t,e,0,10.3,.3,3,2.1,2.7),1.6),r=rt(r,Pt(i,t,e,0,6.9,-1.2,3.4,2.6,2.7),1.2),r=rt(r,Ae(n,t,e,ti[0],ti[1],ti[2],.85),.7),r=rt(r,St(i,t,e,0,11,.2,0,Me[1]-1.4,Me[2]-.15,2.1,1.7),.8)),Ui.body=r;const s=t-Me[1],a=e-Me[2];let o=Ae(i,s,a,0,.6,.5,4.3);o<kr&&(o=Pt(i,s,a,0,0,0,2.38,2.05,2.21),o=rt(o,Pt(n,s,a,1.8,-.66,.25,1.15,1.23,1.31),.66),o=rt(o,St(i,s,a,0,-.25,1.48,0,-.57,3.6,1.11,.45),.5),o=rt(o,St(i,s,a,0,-1.07,1.15,0,-1.23,2.95,.78,.41),.33),o=rt(o,Pt(n,s,a,1.44,2.05,-.66,.78,1.03,.34),.29),o=Math.max(o,-Ae(n,t,e,hn[0]+.05,hn[1],hn[2]+.2,.34))),Ui.head=o;let c=Ii(n,t,e,ti,X_,1.6,1.6);if(c<kr&&(c=Ii(n,t,e,ti,Tn,.72,.8),c=rt(c,Ae(n,t,e,(ti[0]+Tn[0])/2,(ti[1]+Tn[1])/2,(ti[2]+Tn[2])/2,.9),.6),c=rt(c,Ii(n,t,e,Tn,Wi,.8,.6),.4),Ae(n,t,e,Vn[0],Vn[1],Vn[2],1.6)<kr)){c=rt(c,Pt(n,t,e,Vn[0],Vn[1],Vn[2],.62,.38,.62),.3);for(const u of _d)c=rt(c,Ii(n,t,e,u[0],u[1],.24,.17),.14)}Ui.arm=c;let l=St(n,t,e,Kr[0],Kr[1],Kr[2],xr,.6,1,2,2);if(l<kr&&(l=Ii(n,t,e,Kr,ai,1.42,1.1),l=rt(l,Ii(n,t,e,ai,lr,1.08,.85),.5),t<2.6)){l=rt(l,Math.max(Pt(n,t,e,xr,.45,.75,.95,.6,1.75),-t),.45);for(const u of q_)l=rt(l,Ii(n,t,e,u[0],u[1],.26,.18),.15)}Ui.leg=l;let h=Ae(i,t,e,2,3.4,-4.4,5.4);if(h<kr){h=1e9;for(let u=0;u+1<ln.length;u++)h=rt(h,Ii(i,t,e,ln[u],ln[u+1],Du[u],Du[u+1]),.5)}return Ui.tail=h,Ui.min=Math.min(r,o,c,l,h),Ui}function Y_(i,t,e){const n=ra(i,t,e);let r=rt(n.body,n.head,.6);return r=rt(r,n.arm,.5),r=rt(r,n.leg,.7),rt(r,n.tail,.6)}function $_(i,t,e){let n=0,r=1/0,s=0;for(let a=0;a+1<ln.length;a++){const o=ln[a],c=ln[a+1],l=c[0]-o[0],h=c[1]-o[1],u=c[2]-o[2],d=l*l+h*h+u*u,f=Math.max(0,Math.min(1,((i-o[0])*l+(t-o[1])*h+(e-o[2])*u)/d)),m=i-o[0]-l*f,v=t-o[1]-h*f,g=e-o[2]-u*f,p=m*m+v*v+g*g;p<r&&(r=p,n=s+f*Math.sqrt(d)),s+=Math.sqrt(d)}return n}function j_(i,t,e){const n=Math.abs(i);if(Math.hypot(i,t-hr[1],e-hr[2])<.62)return 3;const r=ra(i,t,e),s=r.min;if(r.head===s){const a=t-Me[1],o=e-Me[2];if(o>.2&&a>-1.9){const c=n-1.1,l=a-.22+.32*c;if((c/1.25)**2+(l/.66)**2<1||n<.34&&a>-.35&&a<2.4&&o>.6)return 2;const h=n-1.05,u=a-1.12+.18*h;if((h/1)**2+(u/.4)**2<1||a<-.15+.25*Math.max(0,n-1.2)&&o>.5)return 1}return a>2.75&&n>.98?1:0}if(r.tail===s){const a=$_(i,t,e);return a>7.9||a%2<.85?2:4}return r.arm===s?xd(n,t,e)>-.25?5:0:r.leg===s?t<1.3?5:0:e>1.2&&(i/2.4)**2+((t-7.9)/3.1)**2<1?4:0}function J_(i,t,e){const n=Math.abs(i),r=Math.hypot(n-hn[0],t-hn[1],e-hn[2]);if(r<.62||Math.hypot(i,t-hr[1],e-hr[2])<.85)return 0;const s=ra(i,t,e),a=s.min;if(s.head===a){const o=t-Me[1],c=e-Me[2];return o>1.4&&n>.9&&c<.1?.5:n>1.4&&o<0&&c<1.5?1.35:c>1?.35+.4*Math.min(1,(r-.62)/1.3):.9}return s.tail===a?1.4:s.arm===a?xd(n,t,e)>-.25?.25:.9:s.leg===a?t<1.3?.3:1:1.1}const Z_=.15,K_=new Map([["pelvis",0],["spine1",0],["spine2",0],["neck",1],["head",2],["jaw",2],["armL",3],["forearmL",3],["armR",4],["forearmR",4],["thighL",5],["shinL",5],["footL",5],["thighR",6],["shinR",6],["footR",6],["tail1",7],["tail2",7],["tail3",7],["tail4",7]]),oc=ql(vd(lr,ai)),Q_=new Map([["forearm",(i,t,e)=>(i-Tn[0])*Xn[0]+(t-Tn[1])*Xn[1]+(e-Tn[2])*Xn[2]>-.9],["shin",(i,t,e)=>(i-ai[0])*oc[0]+(t-ai[1])*oc[1]+(e-ai[2])*oc[2]>-.9],["foot",(i,t)=>t<lr[1]+.7]]),Ha=(i,t,e,n)=>{const r=Q_.get(i.slice(0,-1));return!r||r(Math.abs(t),e,n)},t2=(i,t,e,n)=>{const r=ra(t,e,n),s=r.min+Z_;switch(K_.get(i.name)){case 0:return r.body<=s;case 1:return e>10.6&&(r.body<=s&&Math.abs(t)<2.4||r.head<=s&&e<Me[1]-1.6);case 2:return r.head<=s&&e>Me[1]-2.1||r.body<=s&&e>12&&Math.abs(t)<2;case 3:return r.arm<=s&&t>.5&&Ha(i.name,t,e,n);case 4:return r.arm<=s&&t<-.5&&Ha(i.name,t,e,n);case 5:return r.leg<=s&&t>.2&&Ha(i.name,t,e,n);case 6:return r.leg<=s&&t<-.2&&Ha(i.name,t,e,n);case 7:return r.tail<=s;default:return!0}},e2={id:"jimothy",name:"Jimothy",blurb:"The round Seattle raccoon, standing up",segs:G_,body:{sdf:Y_,region:j_,box:W_,palette:[7103837,15130834,1841431,657930,9406332,3814192],weights:"soft",capture:t2,fur:{length:1,density:7,tip:.18},furLen:J_,tint(i,t,e,n,r){if(i!==0)return;n<-.5&&r.multiplyScalar(1-.2*Math.min(1,(-.5-n)/2.5));const s=ra(t,e,n);(s.arm===s.min||s.leg===s.min)&&r.multiplyScalar(.82)}},dress(i){const t=i.std({color:328965,roughness:.06,metalness:.1});for(const n of[-1,1])i.at(new Dt(new Ue(.34,14,10),t),"head",n*hn[0],hn[1],hn[2]);const e=new Dt(new Ue(.42,14,10),i.std({color:657930,roughness:.25}));e.scale.set(1.15,.8,.75),i.at(e,"head",hr[0],hr[1],hr[2])},fit:{size:1.05,limb:.5},face:{eyes:[[hn[0],hn[1],hn[2]+.18,.36],[-.98,hn[1],hn[2]+.18,.36]]},idle:{tail:.15},res:84,furShells:8},As=new N;function Pn(i,t,e,n,r,s){const a=2*Math.PI*r/4,o=Math.max(s-2*r,0),c=Math.PI/4;As.copy(t),As[n]=0,As.normalize();const l=.5*a/(a+o),h=1-As.angleTo(i)/c;return Math.sign(As[e])===1?h*l:o/(a+o)+l+l*(1-h)}class Yl extends Ve{constructor(t=1,e=1,n=1,r=2,s=.1){const a=r*2+1;if(s=Math.min(t/2,e/2,n/2,s),super(1,1,1,a,a,a),this.type="RoundedBoxGeometry",this.parameters={width:t,height:e,depth:n,segments:r,radius:s},a===1)return;const o=this.toNonIndexed();this.index=null,this.attributes.position=o.attributes.position,this.attributes.normal=o.attributes.normal,this.attributes.uv=o.attributes.uv;const c=new N,l=new N,h=new N(t,e,n).divideScalar(2).subScalar(s),u=this.attributes.position.array,d=this.attributes.normal.array,f=this.attributes.uv.array,m=u.length/6,v=new N,g=.5/a;for(let p=0,y=0;p<u.length;p+=3,y+=2)switch(c.fromArray(u,p),l.copy(c),l.x-=Math.sign(l.x)*g,l.y-=Math.sign(l.y)*g,l.z-=Math.sign(l.z)*g,l.normalize(),u[p+0]=h.x*Math.sign(c.x)+l.x*s,u[p+1]=h.y*Math.sign(c.y)+l.y*s,u[p+2]=h.z*Math.sign(c.z)+l.z*s,d[p+0]=l.x,d[p+1]=l.y,d[p+2]=l.z,Math.floor(p/m)){case 0:v.set(1,0,0),f[y+0]=Pn(v,l,"z","y",s,n),f[y+1]=1-Pn(v,l,"y","z",s,e);break;case 1:v.set(-1,0,0),f[y+0]=1-Pn(v,l,"z","y",s,n),f[y+1]=1-Pn(v,l,"y","z",s,e);break;case 2:v.set(0,1,0),f[y+0]=1-Pn(v,l,"x","z",s,t),f[y+1]=Pn(v,l,"z","x",s,n);break;case 3:v.set(0,-1,0),f[y+0]=1-Pn(v,l,"x","z",s,t),f[y+1]=1-Pn(v,l,"z","x",s,n);break;case 4:v.set(0,0,1),f[y+0]=1-Pn(v,l,"x","y",s,t),f[y+1]=1-Pn(v,l,"y","x",s,e);break;case 5:v.set(0,0,-1),f[y+0]=Pn(v,l,"x","y",s,t),f[y+1]=1-Pn(v,l,"y","x",s,e);break}}static fromJSON(t){return new Yl(t.width,t.height,t.depth,t.segments,t.radius)}}function $l(i,t=!1){const e=i[0].index!==null,n=new Set(Object.keys(i[0].attributes)),r=new Set(Object.keys(i[0].morphAttributes)),s={},a={},o=i[0].morphTargetsRelative,c=new Ee;let l=0;for(let h=0;h<i.length;++h){const u=i[h];let d=0;if(e!==(u.index!==null))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". All geometries must have compatible attributes; make sure index attribute exists among all geometries, or in none of them."),null;for(const f in u.attributes){if(!n.has(f))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+'. All geometries must have compatible attributes; make sure "'+f+'" attribute exists among all geometries, or in none of them.'),null;s[f]===void 0&&(s[f]=[]),s[f].push(u.attributes[f]),d++}if(d!==n.size)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". Make sure all geometries have the same number of attributes."),null;if(o!==u.morphTargetsRelative)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". .morphTargetsRelative must be consistent throughout all geometries."),null;for(const f in u.morphAttributes){if(!r.has(f))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+".  .morphAttributes must be consistent throughout all geometries."),null;a[f]===void 0&&(a[f]=[]),a[f].push(u.morphAttributes[f])}if(t){let f;if(e)f=u.index.count;else if(u.attributes.position!==void 0)f=u.attributes.position.count;else return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". The geometry must have either an index or a position attribute"),null;c.addGroup(l,f,h),l+=f}}if(e){let h=0;const u=[];for(let d=0;d<i.length;++d){const f=i[d].index;for(let m=0;m<f.count;++m)u.push(f.getX(m)+h);h+=i[d].attributes.position.count}c.setIndex(u)}for(const h in s){const u=Fu(s[h]);if(!u)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+h+" attribute."),null;c.setAttribute(h,u)}for(const h in a){const u=a[h][0].length;if(u===0)break;c.morphAttributes=c.morphAttributes||{},c.morphAttributes[h]=[];for(let d=0;d<u;++d){const f=[];for(let v=0;v<a[h].length;++v)f.push(a[h][v][d]);const m=Fu(f);if(!m)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+h+" morphAttribute."),null;c.morphAttributes[h].push(m)}}return c}function Fu(i){let t,e,n,r=-1,s=0;for(let l=0;l<i.length;++l){const h=i[l];if(t===void 0&&(t=h.array.constructor),t!==h.array.constructor)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.array must be of consistent array types across matching attributes."),null;if(e===void 0&&(e=h.itemSize),e!==h.itemSize)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.itemSize must be consistent across matching attributes."),null;if(n===void 0&&(n=h.normalized),n!==h.normalized)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.normalized must be consistent across matching attributes."),null;if(r===-1&&(r=h.gpuType),r!==h.gpuType)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.gpuType must be consistent across matching attributes."),null;s+=h.count*e}const a=new t(s),o=new ae(a,e,n);let c=0;for(let l=0;l<i.length;++l){const h=i[l];if(h.isInterleavedBufferAttribute){const u=c/e;for(let d=0,f=h.count;d<f;d++)for(let m=0;m<e;m++){const v=h.getComponent(d,m);o.setComponent(d+u,m,v)}}else a.set(h.array,c);c+=h.count*e}return r!==void 0&&(o.gpuType=r),o}const n2=[{name:"pelvis",a:[0,9.6,0],b:[0,10.8,0],parent:null},{name:"spine1",a:[0,10.8,0],b:[0,12.6,0],parent:"pelvis"},{name:"spine2",a:[0,12.6,0],b:[0,15,0],parent:"spine1"},{name:"neck",a:[0,15,0],b:[0,15.9,0],parent:"spine2"},{name:"head",a:[0,15.9,0],b:[0,18.4,0],parent:"neck"},{name:"jaw",a:[0,16.5,1],b:[0,16.5,1.3],parent:"head",reach:0},{name:"tail1",a:[0,9.4,-.8],b:[0,9.2,-1.2],parent:"pelvis",reach:0},{name:"tail2",a:[0,9.2,-1.2],b:[0,9,-1.6],parent:"tail1",reach:0},{name:"tail3",a:[0,9,-1.6],b:[0,8.8,-2],parent:"tail2",reach:0},{name:"tail4",a:[0,8.8,-2],b:[0,8.6,-2.4],parent:"tail3",reach:0},{name:"thighL",a:[.95,9.6,0],b:[.95,5.3,0],parent:"pelvis"},{name:"shinL",a:[.95,5.3,0],b:[.95,1.2,0],parent:"thighL"},{name:"footL",a:[.95,1.2,0],b:[.95,.4,1.5],parent:"shinL"},{name:"thighR",a:[-.95,9.6,0],b:[-.95,5.3,0],parent:"pelvis"},{name:"shinR",a:[-.95,5.3,0],b:[-.95,1.2,0],parent:"thighR"},{name:"footR",a:[-.95,1.2,0],b:[-.95,.4,1.5],parent:"shinR"},{name:"armL",a:[2.75,14.4,0],b:[2.75,11.9,0],parent:"spine2"},{name:"forearmL",a:[2.75,11.9,0],b:[2.75,9.5,0],parent:"armL"},{name:"armR",a:[-2.75,14.4,0],b:[-2.75,11.9,0],parent:"spine2"},{name:"forearmR",a:[-2.75,11.9,0],b:[-2.75,9.5,0],parent:"armR"}],jl={y:17.15,a:1.6,b:1.62},cc=3,Xi=10,Ou=Math.PI/Xi,Md=.38,Us=[{y0:.35,y1:5.2,r0:7.8,r1:5,bone:"pelvis"},{y0:3.9,y1:8.7,r0:7.1,r1:4.4,bone:"pelvis"},{y0:7.3,y1:12,r0:6.3,r1:3.8,bone:"spine1"},{y0:10.6,y1:15,r0:5.4,r1:3.2,bone:"spine2"},{y0:13.5,y1:20,r0:4.7,r1:2.4,bone:"head",flare:1.8,cols:6,rows:20,hole:jl},{y0:19.25,y1:23.7,r0:3.4,r1:.05,bone:"head",flare:1}],i2=9425231,r2=2907158,yd=(i,t)=>i.r1+(i.r0-i.r1)*Math.pow(Math.min(1,Math.max(0,1-t)),i.flare??1.25),s2=i=>{const t=Math.sin(i*127.1+311.7)*43758.5453;return t-Math.floor(t)};function oo(i,t){const e=Math.floor(t),n=t-e,r=Ou+e/Xi*Math.PI*2,s=Ou+(e+1)/Xi*Math.PI*2;return[i*(Math.sin(r)+(Math.sin(s)-Math.sin(r))*n),i*(Math.cos(r)+(Math.cos(s)-Math.cos(r))*n)]}function bd(i,t,e){const n=yd(i,(e-i.y0)/(i.y1-i.y0));for(let r=0;r<Xi;r++){const[s,a]=oo(n,r),[o,c]=oo(n,r+1);if(a+c>0&&(t-s)*(t-o)<=0&&s!==o)return a+(t-s)/(o-s)*(c-a)}return Math.sqrt(Math.max(0,n*n-t*t))}const Bu=(i,t,e)=>Math.pow(Math.abs(t/i.a)**cc+Math.abs((e-i.y)/i.b)**cc,1/cc),a2=Us.find(i=>i.hole),Qr=bd(a2,0,jl.y)-.3,dl=.56,pl=17.4;function o2(i){const t=i.cols??2,e=i.rows??2,n=Xi*t,r=i.y1-i.y0,s=[],a=[],o=new Ut(i2),c=new Ut(r2),l=new Ut;for(let d=0;d<=e;d++){const f=1-d/e,m=yd(i,f);for(let v=0;v<=n;v++){let[g,p]=oo(m,v/t),y=i.y0+f*r;if(d===e&&v%2===0){const _=v%n,w=.6+.8*s2(_+i.y0*7);y-=Md*w,g*=1.04,p*=1.04}s.push(g,y,p);const M=Math.min(1,Math.max(0,(f-.25)/.4));l.copy(o).lerp(c,M*M*(3-2*M)),a.push(l.r,l.g,l.b)}}const h=[];for(let d=0;d<e;d++)for(let f=0;f<n;f++){const m=d*(n+1)+f,v=m+n+1,g=v+1,p=m+1;h.push(m,v,p,v,g,p)}if(i.hole){const d=i.hole,f=[],m=new Set,v=new Set;for(let g=0;g<h.length;g+=3){const p=[h[g],h[g+1],h[g+2]],y=(s[p[0]*3]+s[p[1]*3]+s[p[2]*3])/3,M=(s[p[0]*3+1]+s[p[1]*3+1]+s[p[2]*3+1])/3;if((s[p[0]*3+2]+s[p[1]*3+2]+s[p[2]*3+2])/3>0&&Bu(d,y,M)<1)for(const w of p)m.add(w);else{f.push(...p);for(const w of p)v.add(w)}}for(const g of m){if(!v.has(g))continue;const p=s[g*3],y=s[g*3+1],M=Bu(d,p,y);if(M<.3)continue;const _=p/M,w=d.y+(y-d.y)/M;s[g*3]=_,s[g*3+1]=w,s[g*3+2]=bd(i,_,w)}h.length=0,h.push(...f)}const u=new Ee;return u.setAttribute("position",new se(s,3)),u.setAttribute("color",new se(a,3)),u.setIndex(h),u.computeVertexNormals(),u}const c2=[[0,-3,.6,2],[0,0,.7,4],[0,2,.55,0],[1,-1,.9,0],[1,1,.6,3],[1,-4,.6,1],[2,-2,.6,1],[2,2,.7,2],[3,-1,.6,4],[3,1,.55,1],[4,-2,.45,1],[4,1,.45,2],[5,-2,.35,0],[5,1,.35,2]],l2=[14165550,2838486,9060304,14699176,15759898];function h2(i){const t=new Map,e=new Set,n=(L,D,U=0,B=0,X=0)=>{L.position.set(U,B,X),L.updateMatrixWorld(!0),L.traverse(H=>{const Q=H;if(!Q.isMesh)return;const ct=Q.material,ut=`${D}|${ct.uuid}|${Q.name}`,vt=Q.geometry.index?Q.geometry.toNonIndexed():Q.geometry.clone();for(const Nt of Object.keys(vt.attributes))Nt!=="position"&&Nt!=="normal"&&Nt!=="color"&&vt.deleteAttribute(Nt);vt.applyMatrix4(Q.matrixWorld);let Et=t.get(ut);Et||(Et={bone:D,mat:ct,name:Q.name,geos:[]},t.set(ut,Et)),Et.geos.push(vt)})},r=(L,D,U="")=>{e.add(L);const B=new Dt(L,D);return B.name=U,B},s=i.std({color:16777215,vertexColors:!0,roughness:.95,metalness:0,flatShading:!0,side:je}),a=i.std({color:12894672,emissive:12894672,emissiveIntensity:.05,roughness:.75}),o=i.std({color:1315350,roughness:.5}),c=i.std({color:2236962,roughness:.8}),l=l2.map(L=>i.std({color:L,roughness:.35,metalness:.15})),h=i.std({color:1973794,roughness:.45,metalness:.1}),u=i.std({color:15762972,roughness:.45,metalness:.05}),d=i.std({color:15251514,emissive:16758810,emissiveIntensity:.25,roughness:.25,metalness:.85});for(const L of Us)n(r(o2(L),s),L.bone);const f=new Ue(.34,12,8),m=new oi(.035,.035,1,4);for(const[L,D,U,B]of c2){const X=Us[L],[H,Q]=oo(X.r0*.99,(D%Xi+Xi)%Xi),ct=X.y0-Md*.55,ut=U*1.2,vt=r(m,c);vt.scale.y=ut,n(vt,X.bone,H,ct-ut/2,Q),n(r(f,l[B]),X.bone,H,ct-ut-.3,Q)}n(r(new Yl(3,3,2.3,3,.8),a),"head",0,jl.y-.05,Qr-1.15);const v=(L,D,U,B)=>{i.at(L,"head",D,U,B).traverse(X=>{X.receiveShadow=!1})};for(const L of[1,-1]){const D=new Dt(new Ue(.16,10,8),o);D.scale.set(1,1.45,.5),D.name=L>0?"eyeL":"eyeR",v(D,L*dl,pl,Qr+.02);const U=new Dt(new Ve(.74,.16,.1),o);U.rotation.z=L*.38,U.name=L>0?"browL":"browR",v(U,L*.62,17.92,Qr+.04)}const g=new Dt(new Ve(.72,.12,.1),o);g.rotation.z=.12,g.name="mouth",v(g,.08,16.5,Qr+.03);const p=new ze,y=[2.4,2.25,2.45],M=r(new Ue(1,24,10,0,Math.PI*2,0,Math.PI/2),h);M.scale.set(...y),p.add(M);const _=.95;for(let L=0;L<4;L++){const D=r(new Ue(1,8,6,L*(Math.PI/2)+_/2,Math.PI/2-_,.1*Math.PI,.27*Math.PI),u);D.scale.set(y[0]*1.012,y[1]*1.012,y[2]*1.012),p.add(D)}const w=new ms([new dt(.96,0),new dt(1.08,0),new dt(1.08,.12),new dt(.96,.12),new dt(.96,0)],24),E=r(w,h);E.scale.set(y[0],1,y[2]*1.06),E.position.set(0,-.02,.1),p.add(E);const A=r(new Ms(1,20),i.std({color:2762272,roughness:.9}));A.rotation.x=Math.PI/2,A.scale.set(y[0]*.99,y[2]*.99,1),A.position.y=.01,p.add(A);const R=new id;for(let L=0;L<8;L++){const D=Math.PI/2+L*Math.PI/4,U=L%2?.24:.85;L?R.lineTo(Math.cos(D)*U,Math.sin(D)*U):R.moveTo(Math.cos(D)*U,Math.sin(D)*U)}const x=new Hl(R,{depth:.12,bevelEnabled:!0,bevelThickness:.06,bevelSize:.05,bevelSegments:1}),b=.95,S=r(x,d);S.scale.setScalar(1.5),S.position.set(0,b,y[2]*Math.sqrt(1-(b/y[1])**2)+.02),S.rotation.x=-.45,p.add(S),p.position.y=-.8;const T=new ze;T.add(p),T.rotation.set(.12,0,.36,"ZXY"),n(T,"head",0,Us[Us.length-1].y1,0);for(const L of t.values()){const D=i.segs.find(X=>X.name===L.bone).a,U=$l(L.geos);for(const X of L.geos)X.dispose();if(!U)throw new Error(`builder: parts on ${L.bone} would not merge`);U.translate(-D[0],-D[1],-D[2]);const B=new Dt(U,L.mat);B.name=L.name,i.at(B,L.bone,D[0],D[1],D[2]),L.mat===a&&(B.receiveShadow=!1)}for(const L of e)L.dispose()}const ku=new WeakMap;function u2(i,t,e){let n=ku.get(i);if(!n){const s={eyes:[],brows:[],mouth:null};i.traverse(a=>{a.name==="eyeL"||a.name==="eyeR"?s.eyes.push(a):a.name==="browL"||a.name==="browR"?s.brows.push({o:a,y:a.position.y,z:a.rotation.z}):a.name==="mouth"&&(s.mouth=a)}),ku.set(i,n=s)}const r=e??null;for(const s of n.eyes)s.scale.y=1.45*(1-.88*(r?s.name==="eyeL"?r.blinkL:r.blinkR:0));for(const s of n.brows)s.o.position.y=s.y+.22*(r?.browUp??0),s.o.rotation.z=s.z*(1-.7*(r?.browUp??0));n.mouth&&(n.mouth.scale.y=1+5*(r?.jaw??0),n.mouth.scale.x=1+.4*(r?.smile??0)-.35*(r?.pucker??0))}const f2={id:"builder",name:"Builder",blurb:"A builder in a Christmas tree costume, tipping his hat",segs:n2,dress:h2,tick:u2,fit:{size:1,limb:.2},face:{eyes:[[dl,pl,Qr+.1,.26],[-dl,pl,Qr+.1,.26]]}},d2=[{name:"pelvis",a:[0,9.6,0],b:[0,10.6,0],parent:null},{name:"spine1",a:[0,10.6,0],b:[0,12.4,.1],parent:"pelvis"},{name:"spine2",a:[0,12.4,.1],b:[0,15,.1],parent:"spine1"},{name:"neck",a:[0,15,.1],b:[0,15.9,.15],parent:"spine2"},{name:"head",a:[0,15.9,.15],b:[0,18.4,.3],parent:"neck"},{name:"jaw",a:[0,16.5,-.3],b:[0,15.55,1],parent:"head",reach:0},{name:"tail1",a:[0,10.4,-1],b:[0,9.6,-1.1],parent:"pelvis",reach:0},{name:"tail2",a:[0,9.6,-1.1],b:[0,8.8,-1.2],parent:"tail1",reach:0},{name:"tail3",a:[0,8.8,-1.2],b:[0,8,-1.3],parent:"tail2",reach:0},{name:"tail4",a:[0,8,-1.3],b:[0,7.2,-1.4],parent:"tail3",reach:0},{name:"thighL",a:[1.1,9.6,0],b:[1.2,5.3,.2],parent:"pelvis"},{name:"shinL",a:[1.2,5.3,.2],b:[1.2,1.1,-.1],parent:"thighL"},{name:"footL",a:[1.2,1.1,-.1],b:[1.2,.35,1.4],parent:"shinL"},{name:"thighR",a:[-1.1,9.6,0],b:[-1.2,5.3,.2],parent:"pelvis"},{name:"shinR",a:[-1.2,5.3,.2],b:[-1.2,1.1,-.1],parent:"thighR"},{name:"footR",a:[-1.2,1.1,-.1],b:[-1.2,.35,1.4],parent:"shinR"},{name:"armL",a:[2.4,14.6,0],b:[2.72,11.9,-.05],parent:"spine2"},{name:"forearmL",a:[2.72,11.9,-.05],b:[2.85,9.45,.4],parent:"armL"},{name:"armR",a:[-2.4,14.6,0],b:[-2.72,11.9,-.05],parent:"spine2"},{name:"forearmR",a:[-2.72,11.9,-.05],b:[-2.85,9.45,.4],parent:"armR"}],$s=i=>new N(i[0],i[1],i[2]);function Sd(i,t){const e=$s(t).sub($s(i)).normalize(),n=new N(1,0,0).addScaledVector(e,-e.x);n.lengthSq()<1e-6&&n.set(0,0,1),n.normalize();const r=new N().crossVectors(n,e);return new re().makeBasis(n,e,r).setPosition(i[0],i[1],i[2])}const vi=(i,t,e,n,r)=>Oi(i,t,e,n,r,6,5,2);function Oi(i,t,e,n,r,s=12,a=14,o=4){const c=$s(t).distanceTo($s(i)),l=[];for(let u=0;u<=o;u++){const d=-Math.PI/2+u/o*(Math.PI/2);l.push(new dt(Math.max(.001,e*Math.cos(d)),e*.75*Math.sin(d)))}const h=Math.min(.2,1.3*Math.max(e,r)/c);for(let u=1;u<a;u++){const d=u/a,f=n+(e-n)*Math.exp(-((d/h)**2))+(r-n)*Math.exp(-(((1-d)/h)**2));l.push(new dt(f,d*c))}for(let u=0;u<=o;u++){const d=u/o*(Math.PI/2);l.push(new dt(Math.max(.001,r*Math.cos(d)),c+r*.75*Math.sin(d)))}return new ms(l,s).applyMatrix4(Sd(i,t))}function Se(i,t,e=[1,1,1],n=12){return new Ue(t,n,Math.max(6,Math.round(n*.7))).scale(e[0],e[1],e[2]).translate(i[0],i[1],i[2])}function p2(i,t,e=24,n=8){return new vo(new jr(i.map($s)),e,t,n,!1)}function ml(i,t,e=24,n=8){return[p2(i,t,e,n),Se(i[0],t,[1,1,1],n),Se(i[i.length-1],t,[1,1,1],n)]}function Dn(i){const t=$l(i.map(e=>e.index?e:e.toNonIndexed()),!1);for(const e of i)e.dispose();return t}const m2=i=>[-i[0],i[1],i[2]];function ur(i,t,e,n,r=6e4){const s=x=>(t.max[x]-t.min[x])*e/(e-7),a=x=>t.min[x]-2.5*s(x)/e,o=a(0)+s(0)/2,c=a(1)+s(1)/2,l=a(2)+s(2)/2,h=s(0)/2,u=s(1)/2,d=s(2)/2,f=new md(e,new $i,!1,!1,r);f.isolation=50;const m=f.field,v=e,g=40;for(let x=0;x<v;x++){const b=l+(2*x/v-1)*d;for(let S=0;S<v;S++){const T=c+(2*S/v-1)*u;for(let L=0;L<v;L++){const D=o+(2*L/v-1)*h;m[x*v*v+S*v+L]=Math.max(0,Math.min(100,50-i(D,T,b)*g))}}}f.update();const p=f.count,y=f.positionArray,M=f.normalArray,_=new Float32Array(p*3),w=new Float32Array(p*3),E=n?new Float32Array(p*3):null,A=new Ut;for(let x=0;x<p;x++){const b=o+y[x*3]*h,S=c+y[x*3+1]*u,T=l+y[x*3+2]*d;_[x*3]=b,_[x*3+1]=S,_[x*3+2]=T;let L=M[x*3]/h,D=M[x*3+1]/u,U=M[x*3+2]/d;const B=Math.hypot(L,D,U)||1;L/=B,D/=B,U/=B,w[x*3]=L,w[x*3+1]=D,w[x*3+2]=U,E&&(A.setRGB(1,1,1),n(b,S,T,A),E[x*3]=A.r,E[x*3+1]=A.g,E[x*3+2]=A.b)}f.geometry.dispose();const R=new Ee;return R.setAttribute("position",new ae(_,3)),R.setAttribute("normal",new ae(w,3)),E&&R.setAttribute("color",new ae(E,3)),R.computeBoundingSphere(),R}const Rs=(i,t,e)=>-rt(-i,-t,e),ss=[.43,17.02,1.06],zu=[.43,16.99,.74];function wd(i,t,e,n,r){const s=Math.abs(i),o=e-n,c=r,l=Math.hypot(o,c),h=(s*o+(t-e)*c)/l;return Math.max(h,n-t)}function g2(i,t,e){const n=Math.abs(i);let r=Pt(i,t,e,0,17.45,-.12,1.1,1.13,1.32);r=rt(r,Pt(i,t,e,0,16.8,-.35,.98,.62,.95),.3),r=rt(r,Pt(i,t,e,0,16.68,.58,.8,.74,.72),.35),r=rt(r,Pt(n,t,e,.78,16.86,.55,.33,.3,.48),.22),r=rt(r,St(n,t,e,.86,16.8,.35,.98,16.68,-.42,.15,.13),.15),r=rt(r,St(n,t,e,.12,17.32,1.12,.78,17.36,.95,.17,.15),.2),r=Rs(r,-Pt(n,t,e,1.32,16.95,.05,.38,.5,.55),.18),r=Rs(r,-Pt(n,t,e,ss[0],ss[1],ss[2],.36,.34,.5),.07);const s=Math.min(wd(i,t,16.86,16.42,.19),Math.hypot(n-.08,t-16.47)-.11);return r=Rs(r,-Math.max(s,.8-e),.04),r=Rs(r,16.08-t,.1),r=Rs(r,-Pt(n,t,e,.8,16.25,.62,.22,.3,.35),.12),r}function v2(i,t,e,n){const r=Math.abs(i),s=Pt(r,t,e,ss[0],ss[1],ss[2],.42,.4,.56),a=Math.max(Math.min(wd(i,t,16.86,16.42,.19),Math.hypot(r-.08,t-16.47)-.11),.8-e)-.06,c=Math.max(0,Math.min(1,-Math.min(s,a)/.05))*(.75+.25*Math.max(0,Math.min(1,(1.2-e)/.4)));n.copy(S2).lerp(w2,c),c===0&&n.multiplyScalar(.94+.06*Math.max(0,Math.min(1,(t-16.3)/1.2)))}function x2(i,t,e,n,r,s,a){const o=r-e,c=s-n,l=Math.max(0,Math.min(1,((i-e)*o+(t-n)*c)/(o*o+c*c)));return Math.hypot(i-e-o*l,t-n-c*l)-a}function _2(i,t,e){const n=Math.abs(i);let r=St(n,t,e,0,15.62,1,.5,15.66,.66,.17,.17);return r=rt(r,St(n,t,e,.5,15.66,.66,.78,15.74,-.12,.17,.16),.1),r=rt(r,Math.max(x2(t,e,15.74,-.14,16.4,-.3,.2),Math.abs(n-.8)-.07),.08),r=rt(r,Pt(n,t,e,.82,16.45,-.3,.15,.11,.13),.06),r=rt(r,Pt(i,t,e,0,15.6,1,.33,.21,.17),.1),r=rt(r,St(n,t,e,0,15.8,1.02,.52,15.8,.62,.12,.12),.08),r}function M2(i,t,e){const n=Math.abs(i),r=Math.abs(Math.hypot(n-.25,t-10.95,e-.75)-1.4)-.09;let s=Math.max(r,Pt(n,t,e,1.2,10.5,-.18,.78,.7,.85));return s=rt(s,St(n,t,e,.6,11,-.45,1.55,11.05,.2,.1,.1),.12),s=rt(s,Pt(i,t,e,0,9.95,-.78,.48,.72,.22),.15),s=rt(s,St(n,t,e,.38,10.35,-.72,.85,10.4,-.45,.17,.15),.12),s=rt(s,St(n,t,e,1.25,10.15,-.15,1,9.62,0,.24,.24),.15),s=rt(s,Ae(n,t,e,.92,9.6,0,.32),.12),s=Math.min(s,Math.hypot(Math.hypot(t-9.6,e)-.36,n-1)-.1),s=rt(s,St(n,t,e,.95,9.48,.28,.12,9.3,.72,.15,.14),.1),s=rt(s,St(n,t,e,.12,9.32,.72,.1,9.02,.66,.15,.15),.1),s=rt(s,St(n,t,e,1,9.38,-.2,.78,8.92,-.05,.18,.17),.1),s=rt(s,St(n,t,e,.78,8.92,-.05,.12,9.04,.62,.13,.12),.1),s}function lc(i,t,e,n,r){return[new oi(t,t*1.08,e,12).translate(i[0],i[1],i[2]),new Ve(n,e*.42,.18).translate(i[0],i[1]+.02,i[2]-t*.6),new Ve(.15,e*.55,r).rotateX(.35).translate(i[0],i[1]-.05,i[2]-t-r*.42)]}function Hu(i){const t=[],e=[1.05,1.42,1.64,1.76,1.8,1.74,1.6],n=[.95,1.06,1.12,1.14,1.12,1.06,.96],r=[.32,.48,.62,.72,.8,.85,.85];for(let s=0;s<7;s++){const a=14.55-s*.4,o=e[s],c=.98,l=n[s],h=s>=5,u=[[.26,a+.04,-.78]],d=h?.74*Math.PI:Math.PI-Math.asin(Math.min(.9,.42/o));for(let f=0;f<=7;f++){const m=.14*Math.PI+f/7*(d-.14*Math.PI),v=-Math.cos(m)*(m<Math.PI/2?c:l),g=a-r[s]*Math.pow((m-.14*Math.PI)/(.86*Math.PI),1.3);u.push([o*Math.sin(m),g,v])}if(h){const f=u[u.length-1];u.push([.62,f[1]+.25+(s-5)*.2,1.02],[.26,12.62,1.06])}else u.push([.24,u[u.length-1][1]+.04,l*.98]);t.push(...ml(u.map(f=>[f[0]*i,f[1],f[2]]),s===0?.13:.12,28,7))}return t}function y2(i,t){const e=Sd(i,[i[0]+t[0],i[1]+t[1],i[2]+t[2]]),n=1.35,r=(u,d,f)=>{const m=new N(u*n,d*n,f*n).applyMatrix4(e);return[m.x,m.y,m.z]},s=[];for(const[u,d,f]of[[0,.1,.16],[0,.1,-.02],[0,.1,-.2],[.02,.3,.2],[.02,.3,0],[.02,.3,-.18]])s.push(Se(r(u,d,f),.14,[1,1,1],8));const a=[[.21,1],[.07,1.08],[-.07,1],[-.2,.82]];for(const[u,d]of a){const f=r(.02,.4,u*.85),m=r(0,.4+.55*d,u),v=r(-.07,.4+.92*d,u*1.05),g=r(-.17,.4+1.15*d,u*1.08),p=r(-.28,.4+1.3*d,u*1.08);s.push(vi(f,m,.1,.075,.105),vi(m,v,.1,.07,.095),vi(v,g,.09,.065,.085),vi(g,p,.08,.06,.065))}const o=r(0,.25,.26),c=r(-.05,.6,.48),l=r(-.1,.88,.58),h=r(-.16,1.08,.62);return s.push(vi(o,c,.11,.085,.1),vi(c,l,.1,.075,.09),vi(l,h,.09,.065,.065)),s}function b2(){const i=[];i.push(Se([1.2,.88,0],.27)),i.push(Se([1.24,.44,-.3],1,[.27,.32,.44]));for(const[s,a,o]of[[.98,.62,.36],[1.22,.62,.34],[1.46,.55,.22],[1.08,.55,.6],[1.32,.52,.56]])i.push(Se([s,a,o],.17,[1,1,1],8));const t=[.95,1.12,1.28,1.42,1.55],e=[.84,1.08,1.3,1.5,1.68],n=[.1,.075,.07,.065,.065],r=[.42,.34,.3,.27,.24];for(let s=0;s<5;s++){const a=[t[s],.5,.62],o=[e[s],.22,1.38-s*.05];i.push(vi(a,o,n[s]*1.3,n[s],n[s]*1.35));const c=[o[0]+(s===0?-.02:.02*s),.15,o[2]+r[s]];i.push(vi(o,c,n[s]*1.05,n[s]*.8,n[s]*.85))}return i}const Ed=15656396,S2=new Ut(Ed),w2=new Ut(1905164),E2=5832490;function T2(i){const t=i.std({color:Ed,roughness:.42,metalness:0,emissive:2894368,emissiveIntensity:1}),e=i.std({color:16777215,vertexColors:!0,roughness:.42,metalness:0,emissive:2894368,emissiveIntensity:1}),n=i.std({color:1182214,roughness:.9}),r=i.std({color:0,emissive:E2,emissiveIntensity:1,roughness:1}),s=(f,m,v=t)=>{for(const g of["L","R"]){const p=new Dt(f,v);p.name=`skelly-${m}${g}`,g==="R"&&(p.scale.x=-1),i.at(p,m+g,0,0,0)}},a=(f,m,v=t,g=`skelly-${m}`)=>{const p=new Dt(f,v);return p.name=g,i.at(p,m,0,0,0),p},o=ur(g2,{min:[-1.25,15.95,-1.5],max:[1.25,18.65,1.4]},52,v2,4e4);a(o,"head",e);const c=Dn([Se(zu,.1,[1,1.1,.7],10),Se(m2(zu),.1,[1,1.1,.7],10)]);a(c,"head",r,"skelly-embers");const l=(f,m,v,g,p)=>{const y=[];for(let M=0;M<10;M++){const _=-1.05+M/9*2.1;y.push(new Bl(.075,m,2,7).scale(1,1,.75).rotateY(_).translate(v*Math.sin(_),f,p+g*Math.cos(_)))}return y};a(Dn(l(16.15,.17,.6,.78,.47)),"head",t,"skelly-teeth"),a(Dn([Se([0,15.98,.8],1,[.58,.24,.4])]),"head",n,"skelly-mouth"),a(ur(_2,{min:[-1,15.36,-.55],max:[1,16.6,1.22]},36,void 0,12e3),"jaw"),a(Dn(l(15.88,.15,.56,.74,.47)),"jaw",t,"skelly-lowerteeth"),a(Dn([0,1,2,3].flatMap(f=>lc([0,15.12+f*.25,-.22],.25,.19,.72,.3))),"neck"),a(Dn([...[0,1,2,3,4,5].flatMap(f=>lc([0,12.55+f*.4,-.82],.25,.26,.6,.28)),...Hu(1),...Hu(-1),Se([0,13.55,1.08],1,[.26,1.05,.12],12),Se([0,14.42,1],1,[.36,.32,.13],10),...ml([[.22,14.72,1.02],[.85,14.86,.9],[1.55,14.98,.42],[2.18,15.02,.02]],.13,20,8),...ml([[-.22,14.72,1.02],[-.85,14.86,.9],[-1.55,14.98,.42],[-2.18,15.02,.02]],.13,20,8),Se([1.25,13.95,-1],1,[.62,.85,.09],12),Se([-1.25,13.95,-1],1,[.62,.85,.09],12)]),"spine2"),a(Dn([0,1,2,3].flatMap(f=>lc([0,10.85+f*.42,-.42],.36,.3,1.15,.45))),"spine1"),a(ur(M2,{min:[-1.75,8.72,-1.05],max:[1.75,11.2,1.05]},40,void 0,24e3),"pelvis"),s(Dn([Se([2.33,14.56,-.03],.36),Oi([2.4,14.45,0],[2.71,12.08,-.05],.3,.2,.28),Se([2.53,11.98,-.05],.21,[1,.9,1],10),Se([2.88,11.98,-.06],.2,[1,.9,1],10)]),"arm");const h=[2.72,11.9,-.05],u=[2.85,9.45,.4],d=[u[0]-h[0],u[1]-h[1],u[2]-h[2]];s(Dn([Se([2.74,11.98,-.25],.21,[1,1.1,1],10),Oi([2.76,11.85,-.2],[2.86,9.62,.22],.19,.13,.16,10),Oi([2.66,11.72,.12],[2.86,9.62,.54],.16,.13,.21,10),...y2([u[0],u[1]-.05,u[2]],d)]),"forearm"),s(Dn([Se([1.12,9.62,.02],.36),Oi([1.12,9.6,0],[1.55,9.24,-.03],.2,.18,.2,10),Se([1.64,9.3,-.08],.3,[1,1.2,1]),Oi([1.56,9.22,0],[1.22,5.62,.18],.28,.21,.34),Se([1,5.5,.12],.29),Se([1.42,5.5,.12],.29)]),"thigh"),s(Dn([Oi([1.19,5.12,.18],[1.16,1.28,-.08],.36,.18,.24),Se([1,1.16,-.05],.17,[1,1.2,1],10),Oi([1.52,4.95,.02],[1.47,1.3,-.16],.16,.09,.17,10),Se([1.2,5.36,.62],.27,[1,1.1,.55])]),"shin"),s(Dn(b2()),"foot")}const Vu=new WeakMap,A2={id:"skeleton",name:"Skelly",blurb:"Bones, a grin, and green embers for eyes",segs:d2,dress:T2,fit:{size:1.04,limb:.3},face:{eyes:[[.43,17.02,1.3,.36],[-.43,17.02,1.3,.36]]},tick(i,t,e){let n=Vu.get(i);if(!n){const s=[];i.traverse(a=>{a.name==="skelly-embers"&&s.push(a.material)}),n={jaw:i.getObjectByName("jaw")??null,embers:s},Vu.set(i,n)}const r=.95+.3*Math.sin(t*2.1)+.1*Math.sin(t*7.3+1.1);for(const s of n.embers)s.emissiveIntensity=r;if(n.jaw){const s=t%4.6;n.jaw.rotation.x=e&&e.jaw>.05?.02+.55*e.jaw:s<.75?.05+.07*Math.abs(Math.sin(s*25)):.02}}},R2=[{name:"pelvis",a:[0,9.6,0],b:[0,10.6,0],parent:null},{name:"spine1",a:[0,10.6,0],b:[0,12.4,.1],parent:"pelvis"},{name:"spine2",a:[0,12.4,.1],b:[0,15,.1],parent:"spine1"},{name:"neck",a:[0,15,.1],b:[0,15.9,.15],parent:"spine2",reach:.8},{name:"head",a:[0,15.9,.15],b:[0,18.4,.3],parent:"neck"},{name:"jaw",a:[0,16.4,.9],b:[0,16.4,1.2],parent:"head",reach:0},{name:"tail1",a:[0,14.8,-1.2],b:[0,12.6,-1.4],parent:"spine2",reach:0},{name:"tail2",a:[0,12.6,-1.4],b:[0,10.4,-1.6],parent:"tail1",reach:0},{name:"tail3",a:[0,10.4,-1.6],b:[0,8.2,-1.8],parent:"tail2",reach:0},{name:"tail4",a:[0,8.2,-1.8],b:[0,6.2,-2],parent:"tail3",reach:0},{name:"thighL",a:[1.1,9.6,0],b:[1.2,5.3,.2],parent:"pelvis"},{name:"shinL",a:[1.2,5.3,.2],b:[1.2,1.1,-.1],parent:"thighL"},{name:"footL",a:[1.2,1.1,-.1],b:[1.2,.35,1.4],parent:"shinL"},{name:"thighR",a:[-1.1,9.6,0],b:[-1.2,5.3,.2],parent:"pelvis"},{name:"shinR",a:[-1.2,5.3,.2],b:[-1.2,1.1,-.1],parent:"thighR"},{name:"footR",a:[-1.2,1.1,-.1],b:[-1.2,.35,1.4],parent:"shinR"},{name:"armL",a:[2.5,14.55,0],b:[2.95,11.95,-.05],parent:"spine2"},{name:"forearmL",a:[2.95,11.95,-.05],b:[3.12,9.6,.35],parent:"armL"},{name:"armR",a:[-2.5,14.55,0],b:[-2.95,11.95,-.05],parent:"spine2"},{name:"forearmR",a:[-2.95,11.95,-.05],b:[-3.12,9.6,.35],parent:"armR"}],C2={min:[-4.2,-.5,-1.9],max:[4.2,17.1,2.3]},L2=[3.12,9.6,.35],Td=(i,t,e)=>St(i,t,e,3.05,10.55,.2,3.16,9,.45,.3,.3);function Jl(i,t,e){const n=Math.abs(i);let r=4;if(t>8.4&&(r=Pt(i,t,e,0,13,.05,1.74,2.15,1.2),r=rt(r,Pt(i,t,e,0,11.35,.15,1.62,1.1,1.12),.5),t>13.2&&(r=rt(r,St(n,t,e,0,15,-.05,2.15,14.62,0,.5,.56),.5),r=rt(r,Math.hypot(Math.hypot(i,(e+.02)*1.15)-.78,t-15.18)-.2,.12),r=rt(r,St(i,t,e,0,14.9,.05,0,15.6,.12,.62,.55),.2)),t<11.6&&(r=rt(r,Pt(i,t,e,0,10.05,0,1.78,1.05,1.15),.4))),t<10.9&&(r=rt(r,St(n,t,e,1.08,9.6,0,1.2,5.3,.15,.88,.74),.35),t<6.4&&(r=rt(r,St(n,t,e,1.2,5.3,.15,1.22,2.1,-.05,.74,.7),.25))),n>1.5&&t>8.8){const s=St(n,t,e,2.5,14.55,0,2.95,11.95,-.05,.6,.55);r=t>14?rt(r,s,.3):Math.min(r,s),t<12.9&&(r=rt(r,St(n,t,e,2.95,11.95,-.05,3.08,10,.28,.55,.52),.25),r=Math.max(r,-Td(n,t,e)))}if(t<3.4){const s=rt(St(n,t,e,1.22,2.3,-.05,1.22,.6,-.05,.5,.52),Math.max(Pt(n,t,e,1.22,.5,.55,.58,.5,1.3),-t),.3);r=Math.min(r,s)}return r}const gl=0,Ad=1,P2=2,Rd=3,D2=4;function Cd(i,t,e){const n=Math.abs(i);return Td(n,t,e)<.06?D2:t<2.25&&n>.4?P2:t>15.38&&n<.8?Rd:n>2.1&&t>9.2||t>10.72?gl:Ad}const I2=`
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
  }`;function U2(){const i=new Mi({vertexColors:!0,roughness:.88,metalness:0});return i.onBeforeCompile=t=>{t.vertexShader=t.vertexShader.replace("#include <common>",`#include <common>
 attribute vec3 aCloth; varying vec3 vCloth; varying vec3 vBind; varying vec3 vBindN;`).replace("#include <begin_vertex>",`#include <begin_vertex>
 vBind = position; vBindN = normal; vCloth = aCloth;`),t.fragmentShader=t.fragmentShader.replace("#include <common>",`#include <common>
`+I2).replace("#include <color_fragment>",`#include <color_fragment>
 diffuseColor.rgb = cloth(diffuseColor.rgb, vBind, normalize(vBindN), vCloth);`)},i.customProgramCacheKey=()=>"jack-cloth-v2",i}const Be=[0,17.15,.22],N2=1.82,Wn=1.38,Ld=.24;function Zl(i,t,e){const n=i-Be[0],r=t-Be[1],s=e-Be[2],a=Math.hypot(n,s),o=Math.atan2(s,n),c=1-Math.sqrt(Math.abs(Math.cos(5*(o-Math.PI/2)))),l=1-.06*c;let h=(Math.hypot(a/l/N2,r/Wn)-1)*Wn;return h+=.32*Math.exp(-((a/.6)**2))*Math.min(1,Math.abs(r)/Wn),{d:h,groove:c}}function Gu(i,t,e,n,r,s,a=0){const o=(n+r)/2,c=Math.cos(a),l=Math.sin(a),h=(i-e)*c-(t-o)*l,u=(i-e)*l+(t-o)*c+o,d=n-r,f=Math.hypot(d,s);return Math.max((Math.abs(h)*d+(u-n)*s)/f,r-u)}const Wu=(i,t,e,n,r,s)=>(Math.hypot((i-e)/r,(t-n)/s)-1)*Math.min(r,s),Xu=(i,t,e,n,r,s)=>{const a=Math.abs(i-e)-r,o=Math.abs(t-n)-s;return Math.hypot(Math.max(a,0),Math.max(o,0))+Math.min(Math.max(a,o),0)};function F2(i,t){const e=Math.abs(i);let n=Gu(e,t,.66,.74,.14,.36,-.12);n=Math.min(n,Gu(i,t,0,.1,-.2,.17));let r=Math.max(Wu(i,t,0,-.36,1.2,.64),-Wu(i,t,0,-.08,1.34,.56));return r=Math.max(r,-Xu(e,t,.32,-.7,.11,.12)),r=Math.max(r,-Xu(i,t,0,-.93,.12,.13)),Math.min(n,r)}function O2(i,t,e){const n=Zl(i,t,e).d;let r=Math.max(n,-(n+Ld));const s=Math.max(F2(i-Be[0],t-Be[1]),Be[2]+.4-e);return r=Math.max(r,-s),r}const B2=new Ut(15233038),k2=new Ut(10108936),z2=new Ut(16757820),H2=new Ut(16737290);function V2(i,t,e,n){const{d:r,groove:s}=Zl(i,t,e);if(r<-.05){n.copy(z2).lerp(H2,Math.max(0,Math.min(1,(t-Be[1]-Wn*.2)/(Wn*.8))));return}n.copy(B2).lerp(k2,Math.min(1,s*1.3)),n.multiplyScalar(.85+.15*(1-Math.abs(t-Be[1])/Wn))}function G2(i){const t=i.std({color:16777215,vertexColors:!0,roughness:.5,metalness:0,emissive:16777215,emissiveIntensity:1});return t.onBeforeCompile=e=>{e.vertexShader=e.vertexShader.replace("#include <common>",`#include <common>
 attribute float aGlow; varying float vGlow;`).replace("#include <begin_vertex>",`#include <begin_vertex>
 vGlow = aGlow;`),e.fragmentShader=e.fragmentShader.replace("#include <common>",`#include <common>
 varying float vGlow;`).replace("#include <color_fragment>",`#include <color_fragment>
 vec3 glowHue = diffuseColor.rgb; diffuseColor.rgb *= 1.0 - 0.92 * vGlow;`).replace("#include <emissivemap_fragment>",`#include <emissivemap_fragment>
 totalEmissiveRadiance *= vGlow * glowHue;`)},t.customProgramCacheKey=()=>"jack-shell-v2",t}let eo=1;const on=()=>(eo=eo*1664525+1013904223>>>0,eo/4294967296),W2=new N(0,1,0),qu=[15255146,13937738,15916172,12884540].map(i=>new Ut(i));function Cs(i,t,e,n){const r=new ia(n,e,4,1).translate(0,e/2,0);r.applyQuaternion(new Ge().setFromUnitVectors(W2,t.clone().normalize())).translate(i.x,i.y,i.z);const s=qu[Math.floor(on()*qu.length)],a=r.attributes.position.count,o=new Float32Array(a*3);for(let c=0;c<a;c++)o[c*3]=s.r,o[c*3+1]=s.g,o[c*3+2]=s.b;return r.setAttribute("color",new ae(o,3)),r}function Ls(i,t){const e=i.clone().normalize(),n=Math.abs(e.y)<.9?new N(0,1,0):new N(1,0,0),r=new N().crossVectors(e,n).normalize(),s=new N().crossVectors(e,r),a=on()*Math.PI*2,o=Math.tan(t*Math.sqrt(on()));return e.addScaledVector(r,Math.cos(a)*o).addScaledVector(s,Math.sin(a)*o).normalize()}function mi(i){const t=$l(i.map(e=>e.index?e.toNonIndexed():e),!1);for(const e of i)e.dispose();return t}function hc(i,t){let e=0,n=3;for(let r=0;r<30;r++){const s=(e+n)/2;Jl(i,t,s)<0?e=s:n=s}return e}function Yu(i,t,e){let n=0,r=3;for(let s=0;s<26;s++){const a=(n+r)/2;Jl(Math.cos(t)*a,i,e+Math.sin(t)*a)<0?n=a:r=a}return n}function Va(i,t,e,n){const r=Math.max(8,Math.round(t*18)),s=new vo(i,r,e,7,n),a=s.attributes.uv,o=a.count,c=new Float32Array(o*3),l=new Ut(13150312),h=new Ut(9071160),u=new Ut;for(let d=0;d<o;d++){const f=.5+.5*Math.sin((a.getX(d)*t*4.5+a.getY(d))*Math.PI*2);u.copy(l).lerp(h,f*f),c[d*3]=u.r,c[d*3+1]=u.g,c[d*3+2]=u.b}return s.setAttribute("color",new ae(c,3)),s}function X2(i){eo=7;const t=i.bones.get("pelvis").parent;if(t?.isSkinnedMesh){const lt=t.geometry.attributes.position,G=new Float32Array(lt.count*3);for(let J=0;J<lt.count;J++){const z=Cd(lt.getX(J),lt.getY(J),lt.getZ(J));G[J*3]=z===gl?1:0,G[J*3+1]=z===Ad?1:0,G[J*3+2]=z===Rd?1:0}t.geometry.setAttribute("aCloth",new ae(G,3)),t.material.dispose(),t.material=U2()}const e=i.std({color:16777215,vertexColors:!0,roughness:.75,metalness:0}),n=i.std({color:16777215,vertexColors:!0,roughness:.9,metalness:0}),r=(lt,G,J,z)=>{for(const W of["L","R"]){const k=new Dt(lt,J);k.name=`jack-${z}${W}`,W==="R"&&(k.scale.x=-1),i.at(k,G+W,0,0,0)}},s=ur(O2,{min:[-1.92,Be[1]-Wn-.05,Be[2]-1.92],max:[1.92,Be[1]+Wn+.05,Be[2]+1.92]},48,V2,4e4),a=s.attributes.position,o=new Float32Array(a.count);for(let lt=0;lt<a.count;lt++)o[lt]=Math.max(0,Math.min(1,-Zl(a.getX(lt),a.getY(lt),a.getZ(lt)).d/.16));s.setAttribute("aGlow",new ae(o,1));const c=new Dt(s,G2(i));c.name="jack-pumpkin",i.at(c,"head",0,0,0);const l=Be[1]-Wn+Ld+.3,h=new ze;h.name="jack-flame";const u=new Dt(mi([new Ue(.15,10,8).scale(1,1.1,1).translate(0,.15,0),new ia(.148,.42,10,1,!0).translate(0,.36,0)]),i.std({color:0,emissive:16762976,emissiveIntensity:2.4}));u.name="jack-flamecore",h.add(u),i.at(h,"head",0,l,Be[2]-.15);const d=Be[1]+Wn-.22,f=new oi(.16,.26,1.5,7,8).translate(0,.75,0);{const lt=f.attributes.position;for(let G=0;G<lt.count;G++){const J=lt.getY(G)/1.5,z=1+.6*Math.max(0,1-J*5);lt.setXYZ(G,lt.getX(G)*z+.5*J*J,lt.getY(G),lt.getZ(G)*z-.1*J*J)}f.computeVertexNormals()}i.at(new Dt(f.translate(0,d,Be[2]-.05),i.std({color:5990956,roughness:.85})),"head",0,0,0);const m=i.std({color:4863526,roughness:.95,side:je}),v=[];for(let lt=0;lt<=10;lt++){const G=1.08+lt/10*1.12;v.push(new dt(G,-.22*((G-1.08)/1.12)**2))}const g=[];for(let lt=0;lt<=10;lt++){const G=lt/10;g.push(new dt(1.1-.24*G-(G>.85?(G-.85)*3.6:0),G*1.2))}const p=mi([new ms(v,28),new ms(g,28)]);{const lt=p.attributes.position;for(let G=0;G<lt.count;G++){const J=lt.getX(G),z=lt.getY(G),W=lt.getZ(G),k=z>.7?.2*Math.exp(-((J/.5)**2))*Math.max(0,W):0;lt.setXYZ(G,J,z-.07*Math.max(0,J)*Math.max(0,Math.hypot(J,W)-1.08)-k*.6,W-k)}p.computeVertexNormals()}const y=new rs(1.07,.08,6,28).rotateX(Math.PI/2).scale(1,2.4,1).translate(0,.2,0),M=new ze;M.add(new Dt(p,m),new Dt(y,i.std({color:1971986,roughness:.8}))),M.rotation.set(-.08,0,-.2),i.at(M,"head",.08,Be[1]+Wn-.1,Be[2]-.1);const _=[];for(let lt=0;lt<34;lt++){const G=lt/34*Math.PI*2+on()*.15,J=.72,z=new N(Math.cos(G)*J,15.3+on()*.1,Math.sin(G)*J*.9),W=Ls(new N(Math.cos(G)*.9,.7,Math.sin(G)*.9),.35);_.push(Cs(z,W,.45+on()*.5,.05))}const w=new Dt(mi(_),e);w.name="jack-collar",i.at(w,"spine2",0,0,0);const E=new N(2.95,11.95,-.05),A=new N(...L2),R=A.clone().sub(E).normalize(),x=[];for(let lt=0;lt<46;lt++){const G=on()*Math.PI*2,J=.26*Math.sqrt(on()),z=new N(Math.cos(G)*J,0,Math.sin(G)*J),W=A.clone().addScaledVector(R,.55).add(z);x.push(Cs(W,Ls(R.clone().addScaledVector(z,1.4),.3),.8+on()*.9,.055))}r(mi(x),"forearm",e,"hand");const b=[];for(let lt=0;lt<26;lt++){const G=lt/26*Math.PI*2+on()*.2,J=new N(1.22+Math.cos(G)*.62,2.2+on()*.12,-.05+Math.sin(G)*.62);b.push(Cs(J,Ls(new N(Math.cos(G),-1.1,Math.sin(G)),.3),.4+on()*.45,.05))}r(mi(b),"shin",e,"ankle");const S=[];for(let lt=0;lt<14;lt++){const G=lt/14*Math.PI*2,J=Yu(15.62,G,.1)+.04;S.push(new N(Math.cos(G)*J,15.62,.1+Math.sin(G)*J))}i.at(new Dt(Va(new jr(S,!0),3.6,.09,!0),n),"neck",0,0,0);const T=10.72,L=[];for(let lt=0;lt<24;lt++){const G=lt/24*Math.PI*2,J=Yu(T,G,.05)+.06;L.push(new N(Math.cos(G)*J,T,.05+Math.sin(G)*J))}const D=new jr(L,!0),U=.55,B=hc(U,T)+.1,X=new jr([new N(U,T-.05,B),new N(U+.12,T-.6,B+.12),new N(U+.05,T-1.25,B+.08)]),H=new jr([new N(U,T-.05,B),new N(U-.12,T-.5,B+.14),new N(U-.02,T-1,B+.1)]),Q=[];for(const lt of[X,H]){const G=lt.getPoint(1);for(let J=0;J<7;J++)Q.push(Cs(G,Ls(new N(0,-1,.1),.35),.22+on()*.2,.035))}const ct=new Ue(.22,10,8).scale(1.2,.9,.8).translate(U,T,B),ut=new Float32Array(ct.attributes.position.count*3),vt=new Ut(11571288);for(let lt=0;lt<ut.length;lt+=3)ut[lt]=vt.r,ut[lt+1]=vt.g,ut[lt+2]=vt.b;ct.setAttribute("color",new ae(ut,3)),i.at(new Dt(mi([Va(D,11,.13,!0),Va(X,1.3,.1,!1),Va(H,1,.1,!1),ct]),n),"pelvis",0,0,0),i.at(new Dt(mi(Q),e),"pelvis",0,0,0);const Et=[],Nt=[];for(const lt of[14.25,13.45,12.65]){const G=hc(.13,lt);Et.push(new oi(.12,.12,.07,10).rotateX(Math.PI/2).translate(.13,lt,G+.02))}for(let lt=0;lt<5;lt++)Nt.push(Cs(new N(.13,13.05,hc(.13,13.05)-.05),Ls(new N(.4,.3,1),.4),.35+on()*.25,.035));i.at(new Dt(mi(Et),i.std({color:2759698,roughness:.5})),"spine2",0,0,0),i.at(new Dt(mi(Nt),e),"spine2",0,0,0)}const q2=(i,t,e,n)=>i.name.startsWith("thigh")?n>-1.6&&e<i.a[1]+.8&&Math.abs(Math.abs(t)-Math.abs(i.a[0]))<(e<i.a[1]+.3?1.3:.9):i.name.startsWith("arm")||i.name.startsWith("forearm")?Math.abs(t)>(e<12?2.2:e<14.1?1.88:2.1):!0,$u=new WeakMap,Y2={id:"pumpkin",name:"Jack",blurb:"A scarecrow with a candle-lit pumpkin head",segs:R2,body:{sdf:Jl,region:Cd,box:C2,palette:[9181716,2307418,3810326,11044954,1708556],surface:"soft",weights:"sharp",capture:q2},dress:X2,fit:{size:1.08,limb:.6},face:{eyes:[[.66,17.75,2.02,.38],[-.66,17.75,2.02,.38]]},res:76,tick(i,t,e){let n=$u.get(i);if(!n){const o=[],c=[];i.traverse(l=>{l.name==="jack-pumpkin"&&o.push(l.material),l.name==="jack-flamecore"&&c.push(l.material)}),n={shell:o,core:c,flame:i.getObjectByName("jack-flame")??null},$u.set(i,n)}const r=.5*Math.sin(t*1.7)+.3*Math.sin(t*7.9+1.3)+.22*Math.sin(t*13.3+.4)+.15*Math.sin(t*23.7+2.2),s=Math.max(0,Math.sin(t*.83+.5)-.92)*6,a=Math.max(.35,1+.36*r-s)*(1+1.3*(e?.jaw??0));for(const o of n.shell)o.emissiveIntensity=a;for(const o of n.core)o.emissiveIntensity=2.4*a;n.flame&&(n.flame.scale.set(1-.08*r,a*(1+.12*Math.sin(t*17)),1-.08*r),n.flame.rotation.z=.12*Math.sin(t*5.3))}},js=[1.2,7.9,0],Sn=[1.32,4.5,.15],wn=[1.32,1.35,-.1],ju=[1.32,1,2],zi=[2.55,12.1,0],sn=[3.4,9.7,-.1],Hn=[3.95,7.4,.15],wi=9.4,fr=6.1,co=2.9,Kn=i=>[-i[0],i[1],i[2]],_e=[0,13.6,.25],uc=[1.9,1.95,1.8],pn=1.1,_o=i=>[_e[0]+(i[0]-_e[0])*pn,_e[1]+(i[1]-_e[1])*pn,_e[2]+(i[2]-_e[2])*pn],nn=[.88,14.55,1.5],$e=[.5,.62,.44],Js=[0,13.2,1.3],lo=i=>Js[1]-.13*(i-Js[2]),zr=_o(nn),Ju=$e[0]*pn,$2=_o(Js),j2=[{name:"pelvis",a:[0,7.9,0],b:[0,8.9,0],parent:null},{name:"spine1",a:[0,8.9,0],b:[0,10.3,.05],parent:"pelvis"},{name:"spine2",a:[0,10.3,.05],b:[0,11.5,.05],parent:"spine1"},{name:"neck",a:[0,11.5,.05],b:[0,11.9,.1],parent:"spine2"},{name:"head",a:[0,11.9,.1],b:[0,15.3,.4],parent:"neck"},{name:"jaw",a:$2,b:_o([0,12.85,3.75]),parent:"head",reach:0},{name:"tail1",a:[0,6.5,-1.2],b:[0,6,-2],parent:"pelvis",reach:1.3},{name:"tail2",a:[0,6,-2],b:[0,5.6,-2.6],parent:"tail1",reach:1.2},{name:"tail3",a:[0,5.6,-2.6],b:[0,5.35,-3],parent:"tail2",reach:1},{name:"tail4",a:[0,5.35,-3],b:[0,5.2,-3.3],parent:"tail3",reach:.9},{name:"thighL",a:js,b:Sn,parent:"pelvis"},{name:"shinL",a:Sn,b:wn,parent:"thighL"},{name:"footL",a:wn,b:ju,parent:"shinL"},{name:"thighR",a:Kn(js),b:Kn(Sn),parent:"pelvis"},{name:"shinR",a:Kn(Sn),b:Kn(wn),parent:"thighR"},{name:"footR",a:Kn(wn),b:Kn(ju),parent:"shinR"},{name:"armL",a:zi,b:sn,parent:"spine2"},{name:"forearmL",a:sn,b:Hn,parent:"armL"},{name:"armR",a:Kn(zi),b:Kn(sn),parent:"spine2"},{name:"forearmR",a:Kn(sn),b:Kn(Hn),parent:"armR"}],J2={min:[-4.6,.5,-3.8],max:[4.6,18.3,2.5]},En=(i,t,e)=>{const n=Math.min(1,Math.max(0,(e-i)/(t-i)));return n*n*(3-2*n)},Nn=(i,t,e)=>{const n=Math.sin(i*127.1+t*311.7+e*74.7)*43758.5453;return n-Math.floor(n)};function Z2(i,t,e){const n=Math.floor(i),r=Math.floor(t),s=Math.floor(e),a=i-n,o=t-r,c=e-s,l=a*a*(3-2*a),h=o*o*(3-2*o),u=c*c*(3-2*c),d=(f,m,v)=>f+(m-f)*v;return d(d(d(Nn(n,r,s),Nn(n+1,r,s),l),d(Nn(n,r+1,s),Nn(n+1,r+1,s),l),h),d(d(Nn(n,r,s+1),Nn(n+1,r,s+1),l),d(Nn(n,r+1,s+1),Nn(n+1,r+1,s+1),l),h),u)}function Pd(i,t,e){if(t<6.5)return 7.3-t;if(t>13.4)return t-12.6;const n=Math.abs(i);let r=Pt(i,t,e,0,10,.1,1.85,2.4,1.5);return r=rt(r,Pt(i,t,e,0,10.8,.4,1.5,1.25,1.2),.6),r=rt(r,Pt(i,t,e,0,11.45,0,2,1,1.35),.7),r=rt(r,Ae(n,t,e,2.25,11.85,0,.68),.5),rt(r,Pt(i,t,e,0,8.3,-.1,1.6,1,1.35),.6)}function Dd(i,t,e){return t>wi+.6||t<fr-.6?Math.max(t-wi,fr-t):Math.max(Id(i,t,e),t-wi,fr-t)}function Id(i,t,e){const n=Math.min(1,Math.max(0,(wi-t)/(wi-fr))),r=1-(1-n)*(1-n),s=1+.025*r*Math.cos(Math.atan2(i,e)*12),a=(1.7+.8*r)*s,o=(1.42+.72*r)*s,c=.05-.1*r;return(Math.hypot(i/a,(e-c)/o)-1)*Math.min(a,o)}const K2=[[0,.25,2.1,.45],[.42,.05,1.6,.55],[-.42,.05,1.6,.55],[.22,-.4,1.75,.85],[-.22,-.4,1.75,.85]];function Q2(i,t,e){const n=Math.abs(i);let r=Pt(i,t,e,_e[0],_e[1],_e[2],uc[0],uc[1],uc[2]);if(r=rt(r,Pt(n,t,e,.9,13,.7,1.05,.9,1),.5),t>14.6)for(const[s,a,o,c]of K2)r=rt(r,St(i,t,e,s*.5,15,a,s*1.4,15.2+o,a-c,.45,.08),.4);return Math.max(r,-Pt(n,t,e,nn[0],nn[1],nn[2],$e[0]+.05,$e[1]+.05,$e[2]+.05))}const tM=(i,t,e,n)=>n(_e[0]+(i-_e[0])/pn,_e[1]+(t-_e[1])/pn,_e[2]+(e-_e[2])/pn)*pn;function Ud(i,t,e){return t<10.6?11.4-t:tM(i,t,e,Q2)}function Nd(i,t,e){if(i<1)return 1.7-i;if(t>13.4)return t-12.8;if(t<4.6)return 5.2-t;let n=St(i,t,e,...zi,...sn,.6,.56);const r=1.75;n=rt(n,St(i,t,e/r,sn[0],sn[1],sn[2]/r,Hn[0],Hn[1],Hn[2]/r,.5,.4),.45);for(let s=0;s<4;s++){const a=-.75+s*.5,o=1.2+.35*(1-Math.abs(a)/.75);n=rt(n,St(i,t,e,Hn[0]-.05,Hn[1]+.5,a*.8+.1,Hn[0]+.12,Hn[1]-o,a*1.1+.15,.32,.12),.25)}return n}function Fd(i,t,e){if(t>9.4)return t-8.7;if(i>3)return i-2.1;let n=St(i,t,e,...js,...Sn,.75,.55);return n=rt(n,Ae(i,t,e,...Sn,.57),.3),rt(n,St(i,t,e,...Sn,...wn,.53,.42),.3)}function Od(i,t,e){if(e>0)return e+.85;if(t>7.6)return t-6.9;let n=1e9;for(const r of[-1,0,1]){const s=1-Math.abs(r);n=rt(n,St(i,t,e,r*.25,6.5,-1.2,r*.7,5.4-s*.2,-3-s*.3,.38,.14),.3)}return n}function eM(i,t,e){const n=Math.abs(i);let r=rt(Pd(i,t,e),Ud(i,t,e),.8);return r=rt(r,Fd(n,t,e),.55),r=rt(r,Nd(n,t,e),.05+.5*En(10.9,11.8,t)),Math.min(r,Dd(i,t,e),Od(i,t,e))}const yi=0,dr=1,Zs=2,Ks=3,as=4,ho=5,ei=new Float64Array(6);let Zu=NaN,Ku=NaN,Qu=NaN,uo=0;function Mo(i,t,e){if(i===Zu&&t===Ku&&e===Qu)return uo;const n=Math.abs(i);ei[yi]=Pd(i,t,e),ei[dr]=Dd(i,t,e),ei[Zs]=Ud(i,t,e),ei[Ks]=Nd(n,t,e),ei[as]=Fd(n,t,e),ei[ho]=Od(i,t,e);let r=0;for(let s=1;s<6;s++)ei[s]<ei[r]&&(r=s);return Zu=i,Ku=t,Qu=e,uo=r,r}const nM=.25,Ke=i=>ei[i]<=ei[uo]+nM,iM=(i,t,e,n)=>{Mo(t,e,n);const r=i.name,s=r.endsWith("L")?1:r.endsWith("R")?-1:0;return s!==0&&t*s<-.05?!1:r==="pelvis"?Ke(yi)||Ke(dr)||Ke(ho)||Ke(as):r==="spine1"?Ke(yi)||Ke(dr):r==="spine2"?Ke(yi):r==="neck"?Ke(yi)||Ke(Zs):r==="head"?Ke(Zs):r==="jaw"||r.startsWith("foot")?!1:r.startsWith("tail")?Ke(ho):r.startsWith("arm")||r.startsWith("forearm")?Ke(Ks)&&(uo===Ks||e>11.3):r.startsWith("shin")?Ke(as):r.startsWith("thigh")?Ke(as)?!0:Ke(dr)&&n>-.4&&e<js[1]+.8&&Math.abs(Math.abs(t)-js[0])<1.35:!0},Bd=12166120,rM=14998264,sM=1578014,aM=10126548,kd=16053239,zd=1315352,vl=(i,t)=>(t>0?11.2+.55*En(.15,1,i):11.65)-.6*En(1.35,1.9,i),oM=new Ut(kd),tf=new Ut(zd),cM=new Ut(Bd).multiplyScalar(1/1.6),lM=(i,t,e)=>1-En(t-e,t+e,Math.abs(i));function hM(i,t,e,n,r){r.copy(oM),i===yi&&r.lerp(cM,En(vl(Math.abs(t),n)-.05,vl(Math.abs(t),n)+.08,e)),r.lerp(tf,lM(e-(wi-.15),.27,.08)),i===dr&&r.lerp(tf,(1-En(fr+.4,fr+.56,e))*(Id(t,e,n)>-.12?1:0))}function ef(i,t,e){const r=Math.floor(i/.8),s=Math.floor(t/(.8*1.4)),a=Math.floor(e/.8);for(let o=-1;o<=1;o++)for(let c=-1;c<=1;c++)for(let l=-1;l<=1;l++){const h=r+c,u=s+o,d=a+l;if(Nn(h,u,d)>.45)continue;const f=(h+.2+.6*Nn(h+7,u,d))*.8,m=(u+.2+.6*Nn(h,u+7,d))*.8*1.4,v=(d+.2+.6*Nn(h,u,d+7))*.8;if(((i-f)/.44)**2+((t-m)/.75)**2+((e-v)/.44)**2<1)return!0}return!1}function Hd(i,t,e){const n=Math.abs(i),r=Mo(i,t,e);if(r===dr)return t<fr+.48||t>wi-.45?3:2;if(r===yi){const s=vl(n,e);return t>s+.3?t>11.2&&n>1.5&&ef(i,t,e)?1:0:t>s-.05?2:t<wi+.12&&t>wi-.42?3:2}if(r===Zs){const s=_e[1]+(t-_e[1])/pn,a=_e[2]+(e-_e[2])/pn;return s>15.2||s>14.2&&a<-.6?5:0}if(r===Ks){if(t<6.6)return 6;const s=t>sn[1]?zi[0]+(sn[0]-zi[0])*(zi[1]-t)/(zi[1]-sn[1]):sn[0]+(Hn[0]-sn[0])*Math.min(1,(sn[1]-t)/(sn[1]-Hn[1]));return n-s>-.25&&ef(i,t,e)?1:0}return r===as&&t<co-.05?4:0}function uM(i,t,e){const n=Hd(i,t,e);if(n===2||n===3||n===4)return 0;const r=Mo(i,t,e),s=Math.abs(i),a=.6+.8*Z2(i*1.4+3.1,t*1.4,e*1.4);let o=1;if(r===Zs){const c=s/pn,l=_e[1]+(t-_e[1])/pn,h=_e[2]+(e-_e[2])/pn,u=Math.hypot((c-nn[0])/$e[0],(l-nn[1])/$e[1],(h-nn[2])/$e[2]);if(u<1.5||h>.95&&c<1.15&&l<13.95&&l>12.2)return 0;const d=En(.2,1.2,h)*(1-En(1,1.6,c))*(1-En(15.2,15.6,l));o=.3*Math.min(1,(u-1.5)/.8)*d+1.3*(1-d),l>15.2?o=1.5:l<12.6&&h>.3&&(o=Math.min(o,.25))}else if(r===yi)o=(t>11?1.25:.9)*(e>0?1-.55*(1-En(.5,1.2,s)):1);else if(r===Ks){const c=En(-.4,.4,-e)*.4+En(-.2,.3,zi[0]+.6-s)*.4;o=(t<7.2?1.3:1)+c}else r===as?o=t<co+.7?1.25:.9:r===ho&&(o=1.2);return n===1&&(o*=1.2),o*a}const Vd=(i,t,e)=>rt(St(i/1.5,t,e,0,13.55,1.2,0,13.05,3.85,.7,.4)*.88,St(i/1.3,t,e,0,13.85,1,0,13.5,2.7,.42,.32),.4),fM=(i,t,e)=>Math.max(Vd(i,t,e),lo(e)-t),Gd=(i,t,e)=>St(i/1.42,t,e,0,13.1,1.2,0,12.8,3.65,.55,.32)*.9,dM=(i,t,e)=>Math.max(Gd(i,t,e),t-lo(e)+.03),pM=new Ut(4211536),mM=new Ut(8817306),xl=5903396,gM=13130354,nf=i=>(t,e,n,r)=>{const s=(i?Gd:Vd)(Math.abs(t)+.09,e,n)<0&&n<3.6;!i&&s&&e<lo(n)+.05?r.setHex(xl):i&&s&&e>lo(n)-.08?r.setHex(Math.abs(t)<.35&&n>1.7?gM:xl):r.copy(pM).lerp(mM,En(2.9,4.1,n))};function vM(i,t,e){const n=wn[1];let r=Math.max(Pt(i,t,e,0,.32-n,.65,.84,.4,1.72),-(t+n));return r=rt(r,Pt(i,t,e,0,.78-n,.55,.74,.6,1.5),.2),r=rt(r,Pt(i,t,e,0,.62-n,1.5,.7,.46,.85),.25),r=rt(r,St(i,t,e,0,.95-n,-.2,0,1.4-n,-.15,.62,.6),.3),Math.max(r,-St(i,t,e,0,1.4-n,-.15,0,3-n,-.15,.47,.47))}function xM(i,t,e,n){const r=t+wn[1];r<.42||e>1.75&&r<.9?n.setHex(16448252):Math.abs(i)<.3&&e>.25&&e<1.55&&r>1?n.setHex(16777215):Math.abs(r-.47)<.05?n.setHex(12105924):n.setHex(14474468)}function _M(){const e=new Uint8Array(65536);for(let r=0;r<128;r++)for(let s=0;s<128;s++){const a=(r+.5)/128,o=(s+.5)/128*Math.PI*2,h=((a*2.6-.38*Math.abs(Math.sin(o)))%.85+.85)%.85<.4&&a<.84;e.set(h?[168,142,224,255]:[246,244,250,255],(r*128+s)*4)}const n=new is(e,128,128,We);return n.colorSpace=dn,n.wrapS=us,n.magFilter=xe,n.minFilter=ki,n.generateMipmaps=!0,n.needsUpdate=!0,n}function Ps(i,t,e,n="head"){t.scale.multiplyScalar(pn);const r=_o(e);i.at(t,n,r[0],r[1],r[2])}function MM(i){const t=i.std({color:16514047,roughness:.15}),e=i.std({color:2761284,roughness:.1}),n=i.std({color:328712,roughness:.06}),r=i.std({color:1314840,roughness:.5}),s=i.std({color:16777215,emissive:16777215,emissiveIntensity:.8,roughness:.2});for(const A of[1,-1]){const R=new ze;R.scale.set(1,$e[1]/$e[0],$e[2]/$e[0]),R.add(new Dt(new Ue($e[0],22,16),t));const x=new ze;x.rotation.set(.12,-A*.14,0);for(const[T,L,D]of[[e,.012,.62],[n,.02,.3]]){const U=new Dt(new Ue($e[0]+L,22,6,0,Math.PI*2,0,D),T);U.rotation.x=Math.PI/2,x.add(U)}const b=new Dt(new Ue(.07,8,6),s);b.position.set(A*.1,.12,$e[0]+.02),x.add(b),R.add(x);const S=new Dt(new rs($e[0]+.01,.055,6,24,Math.PI*.8),r);S.rotation.set(.45,0,Math.PI*.1),R.add(S),Ps(i,R,[A*nn[0],nn[1],nn[2]])}const a=i.std({color:14263361,roughness:.32,metalness:.65}),o=.76,c=nn[2]+$e[2]+.14,l=.3,h=new ze;for(const A of[1,-1]){const R=new Dt(new rs(o,.12,12,48),a);R.rotation.y=A*l,R.position.set(A*nn[0],0,c),h.add(R);const x=new N(A*(nn[0]+o*Math.cos(l)),.05,c-o*Math.sin(l)),b=new N(A*1.84,.05,-.2),S=new Dt(new oi(.07,.07,x.distanceTo(b),8),a);S.quaternion.setFromUnitVectors(new N(0,1,0),b.clone().sub(x).normalize()),S.position.copy(x).add(b).multiplyScalar(.5),h.add(S)}const u=new Dt(new rs(nn[0]-o*Math.cos(l),.1,8,16,Math.PI),a);u.position.set(0,.05,c+o*Math.sin(l)),h.add(u),Ps(i,h,[0,nn[1],0]);const d=i.std({vertexColors:!0,roughness:.55,metalness:.02}),f=new Dt(ur(fM,{min:[-1.15,12.45,.9],max:[1.15,14.35,4.35]},34,nf(!1),12e3),d);f.position.set(-0,-13.6,-.25);const m=new Dt(ur(dM,{min:[-.85,12.45,.9],max:[.85,13.25,4]},30,nf(!0),1e4),d);m.position.set(-0,-13.6,-.25);const v=new ze;v.add(f),Ps(i,v,_e);const g=new ze;g.add(m),Ps(i,g,_e,"jaw");const p=new Dt(new Ue(1,16,10),i.std({color:xl,roughness:.6}));p.scale.set(.6,.36,.55),Ps(i,p,[0,Js[1]-.05,Js[2]+.35]);const y=new Mi({map:_M(),roughness:.85,side:je}),M=1.2,_=A=>Sn[2]+(wn[2]-Sn[2])*(Sn[1]-A)/(Sn[1]-wn[1]);for(const[A,R]of[["shinL",1],["shinR",-1]]){const x=new N(R*Sn[0],M,_(M)),b=new N(R*Sn[0],co,_(co)),S=new Dt(new oi(.6,.53,x.distanceTo(b),40,1,!0),y);S.quaternion.setFromUnitVectors(new N(0,1,0),b.clone().sub(x).normalize());const T=x.add(b).multiplyScalar(.5);i.at(S,A,T.x,T.y,T.z)}const w=ur(vM,{min:[-.95,-wn[1]-.05,-1.2],max:[.95,.75,2.45]},26,xM,1e4),E=i.std({vertexColors:!0,roughness:.55});for(const[A,R]of[["footL",1],["footR",-1]])i.at(new Dt(w,E),A,R*wn[0],wn[1],wn[2])}const yM={id:"violet",name:"Violet",blurb:"The Valkyries’ lavender raven, in gold glasses",segs:j2,body:{sdf:eM,region:Hd,box:J2,palette:[Bd,sM,kd,zd,16184570,rM,aM],surface:"soft",capture:iM,fur:{length:1,density:4.5,tip:.3},furLen:uM,tint(i,t,e,n,r){const s=Mo(t,e,n);(i===2||i===3)&&(s===yi||s===dr)&&hM(s,t,e,n,r),i>=2&&i<=4&&r.multiplyScalar(1.6),i!==2&&i!==3&&n<-.6&&r.multiplyScalar(1-.12*Math.min(1,(-.6-n)/1.5))}},dress:MM,fit:{size:1.1,limb:.55},idle:{tail:.12},face:{jaw:.45,eyes:[[zr[0],zr[1],zr[2],Ju],[-zr[0],zr[1],zr[2],Ju]]},res:72,furShells:9},bM=[{name:"pelvis",a:[0,9.6,0],b:[0,10.6,0],parent:null},{name:"spine1",a:[0,10.6,0],b:[0,12.4,.1],parent:"pelvis"},{name:"spine2",a:[0,12.4,.1],b:[0,15,.1],parent:"spine1"},{name:"neck",a:[0,15,.1],b:[0,15.9,.15],parent:"spine2",reach:.8},{name:"head",a:[0,15.9,.15],b:[0,18.4,.3],parent:"neck"},{name:"jaw",a:[0,16.4,.9],b:[0,16.4,1.2],parent:"head",reach:0},{name:"tail1",a:[0,14.8,-1.2],b:[0,12.6,-1.4],parent:"spine2",reach:1},{name:"tail2",a:[0,12.6,-1.4],b:[0,10.4,-1.6],parent:"tail1",reach:1},{name:"tail3",a:[0,10.4,-1.6],b:[0,8.2,-1.8],parent:"tail2",reach:1},{name:"tail4",a:[0,8.2,-1.8],b:[0,6.2,-2],parent:"tail3",reach:1},{name:"thighL",a:[1.1,9.6,0],b:[1.2,5.3,.2],parent:"pelvis"},{name:"shinL",a:[1.2,5.3,.2],b:[1.2,1.1,-.1],parent:"thighL"},{name:"footL",a:[1.2,1.1,-.1],b:[1.2,.35,1.4],parent:"shinL"},{name:"thighR",a:[-1.1,9.6,0],b:[-1.2,5.3,.2],parent:"pelvis"},{name:"shinR",a:[-1.2,5.3,.2],b:[-1.2,1.1,-.1],parent:"thighR"},{name:"footR",a:[-1.2,1.1,-.1],b:[-1.2,.35,1.4],parent:"shinR"},{name:"armL",a:[2.4,14.6,0],b:[2.72,11.9,-.05],parent:"spine2"},{name:"forearmL",a:[2.72,11.9,-.05],b:[2.85,9.45,.4],parent:"armL"},{name:"armR",a:[-2.4,14.6,0],b:[-2.72,11.9,-.05],parent:"spine2"},{name:"forearmR",a:[-2.72,11.9,-.05],b:[-2.85,9.45,.4],parent:"armR"}],SM={min:[-4.2,-.4,-2.8],max:[4.2,20.4,2.6]};function wM(i,t,e,n){const r=Math.abs(i),s=1-.08*n;let a=Pt(i,t,e,0,13.35,.1,1.8*s,1.95,1.05*s);return a=rt(a,Pt(r,t,e,.85*s,13.75,.75,.95*s,.68,.5),.45),a=rt(a,Pt(i,t,e,0,13.75,-.35,1.95*s,1.3,.62),.4),a=rt(a,St(r,t,e,0,15.35,-.2,1.85*s,14.95,-.1,.5,.36),.5),a=rt(a,Pt(i,t,e,0,11.6,.12,1.35*s,1.45,.92*s),.6),a=rt(a,Pt(i,t,e,0,10,0,1.68*s,1,1.02*s),.6),a=rt(a,Pt(r,t,e,.72,9.55,-.5,.82*s,.85,.62),.4),a=Math.max(a,-St(i,t,e,0,14.6,-1.12,0,10.6,-.98,.16,.14)),a=rt(a,St(i,t,e,0,14.9,-.05,0,16.3,.12,.6,.52),.4),a=rt(a,Pt(i,t,e,0,17.3,.1,.95,1.12,1.08),.3),a=rt(a,Pt(i,t,e,0,16.55,.4,.74,.74,.82),.35),a=rt(a,Pt(r,t,e,2.3*s,14.5,0,.7*s,.92,.78),.4),a=rt(a,St(r,t,e,2.4,14.4,0,2.72,11.95,-.05,.56*s,.42*s),.3),a=rt(a,Pt(r,t,e,2.56,13.15,.12,.5*s,.95,.5*s),.3),a=rt(a,St(r,t,e,2.72,11.9,-.05,2.85,9.6,.38,.46*s,.3*s),.25),a=rt(a,Pt(r,t,e,2.76,11.2,.05,.48*s,.8,.48*s),.3),a=rt(a,Pt(r,t,e,2.87,9,.48,.24,.52,.42),.2),a=rt(a,St(r,t,e,2.8,9.35,.75,2.72,8.85,.95,.15,.12),.12),a=rt(a,St(r,t,e,1.02,9.6,0,1.15,5.45,.2,.9*s,.56*s),.45),a=rt(a,Pt(r,t,e,1.12,7.7,.28,.8*s,1.6,.72*s),.4),a=rt(a,Pt(r,t,e,.8,8.3,0,.55*s,1.3,.6),.4),a=rt(a,Ae(r,t,e,1.17,5.3,.32,.52*s),.3),a=rt(a,St(r,t,e,1.18,5.25,.15,1.2,1.15,-.1,.5*s,.3*s),.3),a=rt(a,Pt(r,t,e,1.2,3.95,-.28,.56*s,1.3,.6*s),.35),a=rt(a,Math.max(Pt(r,t,e,1.2,.5,.55,.46,.5,1.25),-t),.25),a}function EM(i,t,e,n,r=0){const s=Math.abs(i);let a=wM(i,t,e,0);return a=rt(a,Pt(i,t,e,0,17.3,.12,1.08,1.24,1.18),.25),a=rt(a,Pt(i,t,e,0,16.5,.45,.82,.72,.86),.25),a=rt(a,St(i,t,e,0,18.42,-.7,0,18.5,.85,.16,.12),.2),a=rt(a,Pt(i,t,e,0,10.55,.05,1.55,.38,1.1),.15),a=rt(a,Pt(i,t,e,0,10.55,1.05,.55,.42,.22),.1),a=rt(a,St(s,t,e,2.82,10.25,.3,2.86,9.5,.42,.4,.38),.15),a=rt(a,St(s,t,e,1.2,3.2,-.05,1.2,1,-.08,.52,.48),.2),a-r}function TM(i,t,e,n){const r=Math.abs(i);if(t>16.75&&t<17.5&&e>.9&&r<.95)return 2;if(Math.abs(t-10.6)<.45&&e>-1.5)return 3;if(t<3.2||t<10.4&&r>2.3&&t>8.2)return 1;if(e>.7&&r<1.7){const s=t-12.6-r*.55;if(s>0&&s<.35||s>.75&&s<1.1)return 1}return 0}const AM=[{name:"pelvis",a:[0,9.4,-.6],b:[0,10.4,0],parent:null},{name:"spine1",a:[0,10.4,0],b:[0,12.6,.8],parent:"pelvis"},{name:"spine2",a:[0,12.6,.8],b:[0,14.8,1.9],parent:"spine1"},{name:"neck",a:[0,14.8,1.9],b:[0,16,3],parent:"spine2",reach:1.6},{name:"head",a:[0,16,3],b:[0,16.6,5.8],parent:"neck"},{name:"jaw",a:[0,15.5,3.9],b:[0,15.3,6.6],parent:"head",reach:.8},{name:"tail1",a:[0,9.2,-1.6],b:[0,8.2,-3.6],parent:"pelvis",reach:1.8},{name:"tail2",a:[0,8.2,-3.6],b:[0,6.8,-5.2],parent:"tail1",reach:1.8},{name:"tail3",a:[0,6.8,-5.2],b:[0,5.3,-6.4],parent:"tail2",reach:1.6},{name:"tail4",a:[0,5.3,-6.4],b:[0,4,-7.2],parent:"tail3",reach:1.4},{name:"thighL",a:[1.6,9.2,-.3],b:[1.9,6,1.3],parent:"pelvis"},{name:"shinL",a:[1.9,6,1.3],b:[1.9,2.8,-.9],parent:"thighL"},{name:"footL",a:[1.9,2.8,-.9],b:[1.9,.4,1],parent:"shinL"},{name:"thighR",a:[-1.6,9.2,-.3],b:[-1.9,6,1.3],parent:"pelvis"},{name:"shinR",a:[-1.9,6,1.3],b:[-1.9,2.8,-.9],parent:"thighR"},{name:"footR",a:[-1.9,2.8,-.9],b:[-1.9,.4,1],parent:"shinR"},{name:"armL",a:[2.7,14.3,1.6],b:[3.3,11.2,2],parent:"spine2"},{name:"forearmL",a:[3.3,11.2,2],b:[3.2,8.2,3.2],parent:"armL"},{name:"armR",a:[-2.7,14.3,1.6],b:[-3.3,11.2,2],parent:"spine2"},{name:"forearmR",a:[-3.3,11.2,2],b:[-3.2,8.2,3.2],parent:"armR"}],RM={min:[-5,-.5,-8.6],max:[5,20.4,8.6]},un=[.62,17.05,4.75],rf=[0,16.35,7.35];function CM(i,t,e,n=0){const r=Math.abs(i);let s=Pt(i,t,e,0,13.4,1.4,2.6,2.5,2.1);s=rt(s,Pt(i,t,e,0,11.2,.4,1.7,1.6,1.4),.9),s=rt(s,Pt(i,t,e,0,9.8,-.4,2,1.2,1.5),.7),s=rt(s,Pt(i,t,e,0,15.1,1.6,2.3,1.5,2),.8),s=rt(s,Ae(r,t,e,2.5,14.2,1.5,1.05),.7);let a=Pt(i,t,e,0,16.9,3.6,1.35,1.25,1.55);a=rt(a,St(i,t,e,0,16.7,4.6,0,16.3,7.1,.82,.45),.5),a=rt(a,St(i,t,e,0,15.8,4.4,0,15.75,6.7,.55,.32),.35),a=rt(a,Pt(r,t,e,1.15,16.5,3.6,.55,.75,.9),.4),a=rt(a,St(r,t,e,.75,17.8,3.1,1.05,19.4,2.7,.5,.06),.3),a=Math.max(a,-Ae(r,t,e,un[0],un[1],un[2]+.12,.3)),s=rt(s,a,.6),s=rt(s,St(r,t,e,2.7,14.3,1.6,3.3,11.2,2,.9,.72),.5),s=rt(s,St(r,t,e,3.3,11.2,2,3.2,8.4,3.1,.78,.55),.35),s=rt(s,Pt(r,t,e,3.2,7.9,3.35,.55,.75,.55),.3),s=rt(s,St(r,t,e,1.6,9.2,-.3,1.9,6,1.3,1.25,.85),.6),s=rt(s,St(r,t,e,1.9,6,1.3,1.9,2.8,-.9,.75,.48),.4),s=rt(s,St(r,t,e,1.9,2.8,-.9,1.9,.5,.9,.5,.42),.3);const o=[[0,9.2,-1.6,.6],[0,8.2,-3.6,1],[0,6.8,-5.2,1.15],[0,5.3,-6.4,.9],[0,4,-7.2,.35]];for(let c=0;c+1<o.length;c++){const l=o[c],h=o[c+1];s=rt(s,St(i,t,e,l[0],l[1],l[2],h[0],h[1],h[2],l[3],h[3]),.5)}s-=n;for(const c of[-1.5,-.5,.5,1.5])s=rt(s,St(r,t,e,3.2+c*.17,7.4,3.5,3.2+c*.22,6.5,3.85,.17,.03),.1);for(const c of[-1,0,1])s=rt(s,St(r,t,e,1.9+c*.28,.4,1.2,1.9+c*.34,.1,1.85,.2,.03),.1);return s}function Wd(i,t,e){const n=Math.abs(i);return Math.hypot(i,t-rf[1],e-rf[2])<.45||t<7.6&&t>6.2&&e>3.4&&n>2.6||t<.5&&e>1.2?3:t>17.4&&n>.6&&e<3.2||e<-6.3?2:t>15.4&&t<16.4&&e>4.4||t>14.6&&t<15.8&&e>2.8&&n<1.2||e>2.2&&t>10.2&&t<15&&n<1.8?1:t>12.4&&e<.8&&n<1.9&&t>12.4+.5*n?2:0}function LM(i,t,e){const n=Math.abs(i);return Wd(i,t,e)===3||Math.hypot(n-un[0],t-un[1],e-un[2])<.65?0:e>4.6&&t>15.2?.35:t>17.6?.4:t>14&&t<16.4&&e<3.4||e<-1.4&&t<9.6?1.4:t<3?.45:1}const PM=[{name:"pelvis",a:[0,7.6,-.4],b:[0,8.8,0],parent:null},{name:"spine1",a:[0,8.8,0],b:[0,10.8,.3],parent:"pelvis"},{name:"spine2",a:[0,10.8,.3],b:[0,12.6,.6],parent:"spine1"},{name:"neck",a:[0,12.6,.6],b:[0,15.6,1.3],parent:"spine2",reach:1.9},{name:"head",a:[0,15.6,1.3],b:[0,17.6,2.4],parent:"neck"},{name:"jaw",a:[0,15.9,2.6],b:[0,15.7,4.4],parent:"head",reach:.7},{name:"tail1",a:[0,7.4,-2.6],b:[0,6.8,-3.6],parent:"pelvis",reach:1.4},{name:"tail2",a:[0,6.8,-3.6],b:[0,6.2,-4.5],parent:"tail1",reach:1.4},{name:"tail3",a:[0,6.2,-4.5],b:[0,5.7,-5.2],parent:"tail2",reach:1.2},{name:"tail4",a:[0,5.7,-5.2],b:[0,5.3,-5.7],parent:"tail3",reach:1},{name:"thighL",a:[1.4,7.4,0],b:[1.5,4.6,.3],parent:"pelvis"},{name:"shinL",a:[1.5,4.6,.3],b:[1.5,.9,-.2],parent:"thighL"},{name:"footL",a:[1.5,.9,-.2],b:[1.5,.3,1.8],parent:"shinL"},{name:"thighR",a:[-1.4,7.4,0],b:[-1.5,4.6,.3],parent:"pelvis"},{name:"shinR",a:[-1.5,4.6,.3],b:[-1.5,.9,-.2],parent:"thighR"},{name:"footR",a:[-1.5,.9,-.2],b:[-1.5,.3,1.8],parent:"shinR"},{name:"armL",a:[2.7,11.6,.2],b:[3.3,9.2,-.1],parent:"spine2"},{name:"forearmL",a:[3.3,9.2,-.1],b:[3.2,7,.3],parent:"armL"},{name:"armR",a:[-2.7,11.6,.2],b:[-3.3,9.2,-.1],parent:"spine2"},{name:"forearmR",a:[-3.3,9.2,-.1],b:[-3.2,7,.3],parent:"armR"}],DM={min:[-5,-.4,-7.2],max:[5,21.4,6.6]},fn=[.72,17.25,2.75];function IM(i,t,e,n=0){const r=Math.abs(i);let s=Pt(i,t,e,0,9.2,-.2,3.3,3.5,3);s=rt(s,Pt(i,t,e,0,11.4,.5,2.5,2.2,2.3),1),s=rt(s,St(i,t,e,0,12.2,.5,0,15.8,1.4,1.25,.95),.8);let a=Ae(i,t,e,0,16.9,1.8,1.55);a=rt(a,St(i,t,e,0,16.55,2.9,0,16.1,5,.72,.18),.3),a=rt(a,St(i,t,e,0,15.85,2.8,0,15.75,4.4,.5,.14),.25);for(const[o,c]of[[0,1],[.6,.82],[-.6,.82]])a=rt(a,St(i,t,e,o*.5,18.1,1.6,o*1.3,18.1+2.7*c,1-.7*c,.34,.12),.3);a=Math.max(a,-Ae(r,t,e,fn[0],fn[1],fn[2],.5)),s=rt(s,a,.5),s=rt(s,Pt(r,t,e,3,9.8,0,.75,2.6,1.7),.7);for(const o of[-1,0,1])s=rt(s,St(r,t,e,3.2,8.4,o*.6,3.25,6.6+Math.abs(o)*.4,o*.75+.2,.42,.14),.3);for(const o of[-1,0,1])s=rt(s,St(i,t,e,o*.3,7.6,-2.6,o*1.1,7+(1-Math.abs(o))*.5,-5.6,.5,.2),.4);s=rt(s,St(r,t,e,1.4,7.4,0,1.5,4.8,.3,1,.55),.5),s=rt(s,St(r,t,e,1.5,4.8,.3,1.5,1,-.2,.42,.36),.25),s-=n;for(const o of[-1,0,1])s=rt(s,St(r,t,e,1.5,.5,.1,1.5+o*.85,.3,2-Math.abs(o)*.3,.34,.16),.2);return s=rt(s,St(r,t,e,1.5,.5,-.2,1.5,.3,-1.1,.3,.14),.15),s}function Xd(i,t,e){const n=Math.abs(i);return t>15.6&&t<17.1&&e>2.6&&n<.85||t<5&&n>.9&&n<2.6||t<1?3:t>18.4||e<-4.6?2:e>1.2&&t>9.4&&t<13.4&&n<1.8||e>2.2&&t>16.2&&t<18.2&&n<1.25?1:0}function UM(i,t,e){const n=Math.abs(i),r=Xd(i,t,e);return r===3||Math.hypot(n-fn[0],t-fn[1],e-fn[2])<.9?0:r===2?.6:t>16?.45:t>14.6&&e>1.6?.3:t>12.2?1.25:e<-2.4?1.4:1}const Kl=[{name:"pelvis",a:[0,9.2,0],b:[0,10.4,0],parent:null},{name:"spine1",a:[0,10.4,0],b:[0,12.4,.1],parent:"pelvis"},{name:"spine2",a:[0,12.4,.1],b:[0,15.4,.2],parent:"spine1"},{name:"neck",a:[0,15.4,.2],b:[0,16.2,.3],parent:"spine2",reach:.9},{name:"head",a:[0,16.2,.3],b:[0,18.4,.6],parent:"neck"},{name:"jaw",a:[0,16.4,1.2],b:[0,16.4,1.6],parent:"head",reach:0},{name:"tail1",a:[0,9.2,-.5],b:[0,9,-1],parent:"pelvis",reach:0},{name:"tail2",a:[0,9,-1],b:[0,8.8,-1.5],parent:"tail1",reach:0},{name:"tail3",a:[0,8.8,-1.5],b:[0,8.6,-2],parent:"tail2",reach:0},{name:"tail4",a:[0,8.6,-2],b:[0,8.4,-2.5],parent:"tail3",reach:0},{name:"thighL",a:[2.1,9.2,0],b:[2.3,5.2,.3],parent:"pelvis"},{name:"shinL",a:[2.3,5.2,.3],b:[2.3,1.2,-.1],parent:"thighL"},{name:"footL",a:[2.3,1.2,-.1],b:[2.3,.4,1.8],parent:"shinL"},{name:"thighR",a:[-2.1,9.2,0],b:[-2.3,5.2,.3],parent:"pelvis"},{name:"shinR",a:[-2.3,5.2,.3],b:[-2.3,1.2,-.1],parent:"thighR"},{name:"footR",a:[-2.3,1.2,-.1],b:[-2.3,.4,1.8],parent:"shinR"},{name:"armL",a:[4.1,14.7,.2],b:[4.5,11.6,.4],parent:"spine2"},{name:"forearmL",a:[4.5,11.6,.4],b:[4.5,8.4,1],parent:"armL"},{name:"armR",a:[-4.1,14.7,.2],b:[-4.5,11.6,.4],parent:"spine2"},{name:"forearmR",a:[-4.5,11.6,.4],b:[-4.5,8.4,1],parent:"armR"}],NM={min:[-6.4,-.4,-4.4],max:[6.4,19.8,4]};function De(i,t,e,n,r,s,a,o,c,l){const h=Math.abs(i-n)-a+l,u=Math.abs(t-r)-o+l,d=Math.abs(e-s)-c+l;return Math.hypot(Math.max(h,0),Math.max(u,0),Math.max(d,0))+Math.min(Math.max(h,u,d),0)-l}function sf(i,t,e,n,r,s,a,o,c){const l=Math.abs(i-n)-a+c,h=Math.hypot(t-r,e-s)-o+c;return Math.hypot(Math.max(l,0),Math.max(h,0))+Math.min(Math.max(l,h),0)-c}function qd(i,t,e,n,r,s,a,o){let c=i-n,l=t-r,h=e-s;const u=Math.cos(a),d=Math.sin(a);[c,h]=[c*u-h*d,c*d+h*u];const f=Math.cos(o),m=Math.sin(o);return[c,l]=[c*f+l*m,-c*m+l*f],[c,l,h]}const en={hx:1.5,hy:14.6,hz:-2.15,yaw:.4,roll:.62,w:1.1,h:.85,t:.12};function FM(i,t,e){const[n,r,s]=qd(i,t,e,en.hx,en.hy,en.hz,en.yaw,en.roll);return De(n,r,s,en.w,en.h,0,en.w,en.h,en.t,.1)}function OM(i,t,e,n=0){const r=Math.abs(i);let s=1e9;{const a=De(i,t,e,0,13.75,.25,2.9,1.75,1.75,.3),o=(e-(2-Math.max(0,t-13.4)*.6))*.86;s=Math.max(a,o)}return s=rt(s,De(i,t,e,0,12.2,.3,2.3,.6,1.5,.3),.3),s=Math.min(s,De(i,t,e,0,12.55,1.95,2.5,.22,.28,.1)),s=Math.min(s,De(r,t,e,2.2,13.1,1.92,.42,.26,.15,.08)),s=Math.min(s,De(i,t,e,0,11.1,.75,1.15,.9,.55,.25)),s=rt(s,De(i,t,e,0,11,0,1.2,1,1.05,.3),.2),s=rt(s,De(i,t,e,0,9.75,0,2.2,.75,1.4,.3),.25),s=Math.min(s,De(i,t,e,0,9.45,1.35,.7,.7,.25,.15)),s=Math.min(s,De(i,t,e,0,13.5,-1.85,2.2,1.6,.55,.25)),s=Math.min(s,FM(r,t,e)),s=Math.min(s,St(i,t,e,0,15.3,.25,0,16.3,.35,.6,.55)),s=Math.min(s,De(i,t,e,0,17.25,.45,.82,.92,.9,.35)),s=Math.min(s,De(i,t,e,0,16.55,.95,.55,.38,.42,.18)),s=Math.min(s,De(i,t,e,0,18.2,.35,.12,.35,.75,.08)),s=Math.min(s,De(r,t,e,.95,17.55,.25,.12,.62,.3,.08)),s=Math.min(s,De(r,t,e,4.05,15.05,.2,1.15,.8,1.35,.3)),s=Math.min(s,sf(r,t,e,5.4,14.7,.2,.32,.92,.12)),s=Math.min(s,Ae(r,t,e,4.1,14.4,.2,.75)),s=Math.min(s,St(r,t,e,4.1,14.2,.2,4.5,11.8,.4,.62,.58)),s=Math.min(s,Ae(r,t,e,4.5,11.6,.4,.72)),s=Math.min(s,De(r,t,e,4.55,10,.6,.9,1.5,1,.3)),s=Math.min(s,De(r,t,e,4.55,8.05,1,.75,.75,.8,.28)),s=Math.min(s,St(r,t,e,2.1,9.1,0,2.3,5.6,.25,1.05,.95)),s=Math.min(s,De(r,t,e,2.3,5.25,.85,.85,.75,.55,.25)),s=Math.min(s,De(r,t,e,2.3,3,.05,1.25,2.15,1.35,.35)),s=Math.min(s,sf(r,t,e,3.75,2.6,-.35,.3,.9,.12)),s=Math.min(s,De(r,t,e,2.3,.5,.65,1.15,.5,2,.2)),s-n}function BM(i,t,e){const n=Math.abs(i);if(n>5&&Math.hypot(t-14.7,e-.2)<1)return Math.hypot(t-14.7,e-.2)<.42?1:5;if(n>3.38&&Math.hypot(t-2.6,e+.35)<.98)return Math.hypot(t-2.6,e+.35)<.4?1:5;if(t>16.95&&t<17.3&&e>1.2&&n>.12&&n<.62||t>12.85&&t<13.35&&e>1.95&&n>1.85&&n<2.6)return 2;if(t>13.55&&t<15.35&&n<2.55&&n>.18&&e>1.75-Math.max(0,t-13.4)*.6)return 4;if(t>16.15&&t<16.95&&e>1.25&&n<.6)return 6;if(e<-1.9&&t>13.8){const[r,s,a]=qd(n,t,e,en.hx,en.hy,en.hz,en.yaw,en.roll);if(Math.abs(a)<.3&&r>.25&&r<1.75&&s>.85&&s<1.5)return 4}return t>12.3&&t<12.8&&e>1.65||t>14.25&&t<15.9&&n>2.9&&n<5.15||t>4.5&&t<6&&e>.4&&n>1.4&&n<3.2||t<1.1&&e>1.6||t>17.9&&n<.2?1:Math.hypot(n-4.1,t-14.4,e-.2)<.85&&t<14.25||Math.hypot(n-4.5,t-11.6,e-.4)<.8||t>15.2&&t<16.2&&n<.7||t>10.2&&t<11.6&&e<1.25&&n<1.25?3:0}function ge(i,t,e,n,r,s,a,o,c,l){const h=Math.abs(i-n)-a+l,u=Math.abs(t-r)-o+l,d=Math.abs(e-s)-c+l;return Math.hypot(Math.max(h,0),Math.max(u,0),Math.max(d,0))+Math.min(Math.max(h,u,d),0)-l}const kM={min:[-6.8,-.4,-4.6],max:[6.8,20.2,5]};function zM(i,t,e,n=0){const r=Math.abs(i);let s=1e9;s=Math.min(s,ge(i,t,e,0,13.6,.2,3.1,2.1,2,.5)),s=Math.min(s,Pt(i,t,e,0,14.3,2.15,1.05,.7,.75)),s=Math.min(s,ge(i,t,e,0,12.4,2,.9,1,.4,.3)),s=Math.min(s,ge(r,t,e,1.7,15.6,-2.3,.18,2.4,1.1,.12)),s=Math.min(s,ge(i,t,e,0,13,-2.3,2.2,1.6,.6,.3)),s=rt(s,ge(i,t,e,0,11.2,.1,1.9,1.1,1.35,.35),.3),s=rt(s,ge(i,t,e,0,9.7,0,2.5,.95,1.55,.3),.3),s=Math.min(s,ge(i,t,e,0,9.4,1.4,.8,.9,.35,.2)),s=Math.min(s,St(i,t,e,0,15.3,.2,0,16.4,.3,.75,.7)),s=Math.min(s,ge(i,t,e,0,17.2,.4,1,1,1.1,.4)),s=Math.min(s,ge(i,t,e,0,16.6,1.25,.65,.45,.35,.15)),s=Math.min(s,ge(i,t,e,0,18.6,.3,.13,.75,.9,.08)),s=Math.min(s,St(r,t,e,.95,17.7,.4,1.5,18.5,.2,.2,.08)),s=Math.min(s,ge(r,t,e,4.2,15.4,.1,1.55,.85,1.7,.35)),s=Math.min(s,St(r,t,e,4.2,15.5,1.6,4.2,15.5,3.9,.3,.26)),s=Math.min(s,Ae(r,t,e,4.1,14.4,.2,1)),s=Math.min(s,St(r,t,e,4.1,14.2,.2,4.5,11.8,.4,.85,.8)),s=Math.min(s,Ae(r,t,e,4.5,11.6,.4,.9)),s=Math.min(s,ge(r,t,e,4.8,10,.6,1,1.7,1.3,.3)),s=Math.min(s,ge(r,t,e,5.85,10,.6,.22,1.8,1.35,.18)),s=Math.min(s,ge(r,t,e,4.75,7.9,1,.85,.85,.95,.3)),s=Math.min(s,St(r,t,e,2.1,9.1,0,2.3,5.8,.25,1.15,1.1)),s=Math.min(s,ge(r,t,e,2.3,5.4,.6,1.15,1.05,1,.3)),s=Math.min(s,ge(r,t,e,2.3,3,0,1.2,2,1.25,.3));for(const a of[3.8,1.9])s=Math.min(s,St(r,t,e,3.35,a,-.4,3.75,a,-.4,.75,.75));return s=Math.min(s,ge(r,t,e,2.3,.55,.65,1.15,.55,2,.2)),s-n}function HM(i,t,e){const n=Math.abs(i),r=i>0;return t>13.7&&t<15&&e>1.6&&n<1.1||t>16.5&&t<17&&e>1.4&&n<.5&&n>.12?2:n>3.9&&n<4.5&&t>15.1&&t<15.9&&e>1.7||n>5.55&&t>8.2&&t<11.8||n>3.1&&t<4.6&&t>1.1&&e<.4||t>5.5&&t<6.3&&e>1.4&&n>1.3&&n<3.3||Math.hypot(n-4.1,t-14.4,e-.2)<1.05&&t<14.6||Math.hypot(n-4.5,t-11.6,e-.4)<.95&&t>11.3||t>10.7&&t<11&&n<2||t>8.6&&t<8.9&&n>1&&n<3.6?3:n>3.55&&t>6.4&&t<16.4||n>2.9&&t>11.4&&t<16.4?r?4:5:t<8.8&&n>.95?r?6:7:t>15.2||n>1.4&&n<2&&e<-1.2||t<11.3||e<-1.7?1:0}const VM={min:[-7.6,-.4,-6.6],max:[7.6,21,4.4]};function GM(i,t,e,n,r,s,a,o,c,l,h,u){const d=(r+o)/2;return St(i,d+(t-d)/u,e,n,r,s,a,o,c,l,h)*u}function WM(i,t,e,n,r,s,a,o,c,l,h,u){const d=(n+a)/2;return St(d+(i-d)/u,t,e,n,r,s,a,o,c,l,h)*u}function XM(i,t,e,n=0){const r=Math.abs(i);let s=1e9;return s=Math.min(s,ge(i,t,e,0,13.7,.1,2.5,1.9,1.7,.6)),s=Math.min(s,Pt(i,t,e,0,14.4,1.75,.95,.75,.85)),s=rt(s,ge(i,t,e,0,11.4,0,1.5,1.2,1.15,.4),.4),s=rt(s,ge(i,t,e,0,9.8,0,2.2,.85,1.35,.35),.3),s=Math.min(s,St(i,t,e,0,15.2,-2,0,10.8,-2.3,.75,.2)),s=Math.min(s,GM(r,t,e,1.4,13.6,-2.2,6.8,12.4,-5.6,1.9,.4,.17)),s=Math.min(s,WM(r,t,e,1.5,14.2,-2.4,1.65,17.8,-3.7,.95,.22,.2)),s=Math.min(s,ge(r,t,e,3.4,15.2,.2,1.15,.9,1.5,.3)),s=Math.min(s,ge(r,t,e,3.4,16.4,-.1,.85,.45,1.1,.2)),s=Math.min(s,St(i,t,e,0,15.3,.1,0,16.3,.2,.6,.55)),s=Math.min(s,Pt(i,t,e,0,17.1,.35,.85,1,1.15)),s=Math.min(s,St(r,t,e,.45,17.8,.6,1,19.4,-.9,.16,.05)),s=Math.min(s,Ae(r,t,e,4.1,14.5,.2,.8)),s=Math.min(s,St(r,t,e,4.1,14.3,.2,4.5,11.8,.4,.65,.6)),s=Math.min(s,Ae(r,t,e,4.5,11.6,.4,.7)),s=Math.min(s,ge(r,t,e,4.5,10,.6,.8,1.6,.85,.3)),s=Math.min(s,ge(r,t,e,4.5,8,.95,.6,.65,.6,.25)),s=Math.min(s,St(r,t,e,2.1,9.1,0,2.3,5.6,.25,1.1,1)),s=Math.min(s,ge(r,t,e,2.3,5.2,.7,.75,.65,.5,.25)),s=Math.min(s,St(r,t,e,2.3,4.8,-.1,2.3,1.7,-.3,1.25,1.15)),s=Math.min(s,St(r,t,e,2.3,1.6,-.6,2.3,1.1,-1.4,1,1.1)),s=Math.min(s,ge(r,t,e,2.3,.45,.9,.75,.45,1.5,.2)),s-n}function qM(i,t,e){const n=Math.abs(i);return t>13.8&&t<15.1&&e>1.2&&n<1||t>16.8&&t<17.4&&e>1&&n<.75?2:t<1.9&&e<-.9||Math.hypot(n-4.1,t-14.5,e-.2)<.85&&t<14.5||Math.hypot(n-4.5,t-11.6,e-.4)<.75||t>10.4&&t<10.8&&n<1.6?3:n>2.5&&n<4.3&&t>16&&t<16.9||e<-1.9&&n>1.5&&n<7&&Math.abs(t-(13.6-(n-1.4)*.22))<.3||t>12.6&&t<13&&n<2.3&&e>.8?4:n>3.6&&t<13.8&&t>7.2||t<5&&n>1?1:0}function br(i){const t=!!i.mech,e=!!i.cape,n=i.tail??null;return(r,s,a,o)=>r.name.startsWith("thigh")?o>-1.6&&a<r.a[1]+(t?1.4:.8)&&Math.abs(Math.abs(s)-Math.abs(r.a[0]))<(a<r.a[1]+.3?t?1.45:1.3:t?1.4:.9):r.name.startsWith("tail")?n!==null?o<n:e&&o<-1.55:!t&&(r.name.startsWith("arm")||r.name.startsWith("forearm"))?Math.abs(s)>2&&o>-1.2:t&&r.name.startsWith("arm")?o>-1.5:!0}const Yd=(i,t,e=2.2)=>i.std({color:t,emissive:t,emissiveIntensity:e,roughness:.3}),YM={id:"crimson",name:"Crimson",blurb:"A suited hero, visor and all",segs:bM,body:{sdf:(i,t,e)=>EM(i,t,e),region:(i,t,e)=>TM(i,t,e),box:SM,palette:[13114922,16053492,1052692,12633292],surface:"suit",capture:br({})},dress(i){const t=i.std({color:526348,roughness:.08,metalness:.6});for(const e of[-1,1]){const n=new Dt(new Ve(1,.38,.4),t);n.rotation.set(0,e*.42,e*-.32),i.at(n,"head",e*.46,17.12,1.12)}},fit:{size:1.08,limb:.7},face:{eyes:[[.46,17.12,1.35,.32],[-.46,17.12,1.35,.32]]}};br({cape:!0});const $M=AM.map(i=>/^(arm|forearm)/.test(i.name)?{...i,reach:1.95}:i),jM={id:"howler",name:"Howler",blurb:"A wolf man with amber eyes",segs:$M,body:{sdf:(i,t,e)=>CM(i,t,e),region:Wd,box:RM,palette:[7827562,12103584,3420204,1183760],capture:br({tail:-1.5}),fur:{length:.8,density:7,tip:.22},furLen:LM},dress(i){const t=Yd(i,16756768,1.8);for(const e of[-1,1]){const n=new Dt(new Ue(.24,12,8),t);n.scale.set(1.2,.8,.8),i.at(n,"head",e*un[0],un[1],un[2])}},fit:{size:1.1,limb:.6},idle:{tail:.25},face:{jaw:.45,eyes:[[un[0],un[1],un[2]+.12,.3],[-.62,un[1],un[2]+.12,.3]]}},JM={id:"plume",name:"Plume",blurb:"A big, friendly, feathered bird",segs:PM,body:{sdf:(i,t,e)=>IM(i,t,e),region:Xd,box:DM,palette:[16036872,16770976,15224972,15762468],surface:"soft",capture:br({tail:-2.4}),fur:{length:1.5,density:1.6,tip:.3,feather:!0},furLen:UM},dress(i){const t=i.std({color:16316660,roughness:.2}),e=i.std({color:657936,roughness:.1});for(const n of[-1,1]){const r=new Dt(new Ue(.52,18,12),t),s=new Dt(new Ue(.24,12,8),e);s.position.set(-n*.1,.02,.36),s.scale.set(1,1.2,.6),r.add(s),i.at(r,"head",n*fn[0],fn[1],fn[2])}},fit:{size:1.12,limb:.5},idle:{tail:.15},face:{jaw:.4,eyes:[[fn[0],fn[1],fn[2]+.45,.5],[-.72,fn[1],fn[2]+.45,.5]]}};function Ql(i,t){return e=>{const n=Yd(e,t);if(i==="bastion"){for(const a of[-1,1]){const o=new Dt(new Ve(.42,.2,.1),n);o.rotation.z=a*-.12,e.at(o,"head",a*.36,17.12,1.36);const c=new Dt(new Ve(.62,.36,.1),n);e.at(c,"spine2",a*2.2,13.1,2.08)}return}const r=i==="unison",s=new Dt(new Ue(1,20,12),n);if(s.scale.set(r?.95:.85,r?.55:.6,r?.45:.35),e.at(s,"spine2",0,14.35,r?2.55:1.95),r)for(const a of[-1,1]){const o=new Dt(new Ve(.42,.16,.1),n);o.rotation.z=a*.25,e.at(o,"head",a*.32,16.85,1.62)}else e.at(new Dt(new Ve(1.3,.3,.12),n),"head",0,17.1,1.42);if(r){const a=e.std({color:14673130,roughness:.2,metalness:.9}),o=e.std({color:14198832,roughness:.3,metalness:.8}),c=new ze,l=new Dt(new Ve(.22,8,.9),a);l.position.y=-4.5,c.add(l);const h=new Dt(new ia(.64,1.4,4),a);h.rotation.z=Math.PI,h.position.y=-9.2,h.scale.set(.35,1,1),c.add(h),c.rotation.x=-.95;const u=new Dt(new Ve(.5,.4,3),o);u.position.y=-.3,c.add(u);const d=new Dt(new oi(.22,.22,1.6,8),o);d.position.y=.6,c.add(d),e.at(c,"forearmR",-4.75,8,2.1)}}}const ZM={id:"bastion",name:"Bastion",blurb:"An armoured truck that stands up",segs:Kl,body:{sdf:(i,t,e)=>OM(i,t,e),region:BM,box:NM,palette:[4871266,14262322,9431295,1842980,7118020,1316377,12896462],surface:"armour",weights:"rigid",capture:br({mech:!0})},dress:Ql("bastion",9431295),fit:{size:1,limb:.6},face:{eyes:[[.4,17.12,1.5,.28],[-.4,17.12,1.5,.28]]}},KM={id:"kestrel",name:"Kestrel",blurb:"A jet that stands up",segs:Kl,body:{sdf:(i,t,e)=>XM(i,t,e),region:qM,box:VM,palette:[15132908,5661306,16756800,1842980,13117498],surface:"armour",weights:"rigid",capture:br({mech:!0})},dress:Ql("kestrel",16756800),fit:{size:1,limb:.6},face:{eyes:[[.36,17.12,1.56,.26],[-.36,17.12,1.56,.26]]}},QM={id:"unison",name:"Unison",blurb:"Five machines locked into one",segs:Kl,body:{sdf:(i,t,e)=>zM(i,t,e),region:HM,box:kM,palette:[15527666,2503274,8382719,1842980,15234090,2271388,15254056,12855866],surface:"armour",weights:"rigid",capture:br({mech:!0})},dress:Ql("unison",8382719),fit:{size:1,limb:.6},face:{eyes:[[.34,16.9,1.72,.25],[-.34,16.9,1.72,.25]]}},Je=[e2,f2,A2,Y2,jM,YM,yM,JM,ZM,KM,QM],Ei=i=>Je.find(t=>t.id===i)??Je[0],ty=i=>new N(i.x,i.y,i.z),Hr=(i,t,e)=>{const n=Math.min(1,Math.max(0,(e-i)/(t-i)));return n*n*(3-2*n)};function af(i,t){const e=t.clone().normalize(),n=new N().crossVectors(i,e).normalize(),r=new N().crossVectors(e,n).normalize();return new Ge().setFromRotationMatrix(new re().makeBasis(r,e,n))}function ey(i,t){const e=i.clone().normalize(),n=new N().crossVectors(t,e).normalize(),r=new N().crossVectors(e,n).normalize();return new Ge().setFromRotationMatrix(new re().makeBasis(e,n,r))}function of(i){const t=_=>ty(i[_]),e=(..._)=>Math.min(..._.map(w=>i[w].v)),n=t(O.hipL),r=t(O.hipR),s=t(O.shL),a=t(O.shR),o=n.clone().add(r).multiplyScalar(.5),c=s.clone().add(a).multiplyScalar(.5),l=c.clone().sub(o),h=af(n.clone().sub(r),l),u=af(s.clone().sub(a),l),d=t(O.earL),f=t(O.earR),m=t(O.nose),v=d.clone().add(f).multiplyScalar(.5),g=ey(d.clone().sub(f),m.clone().sub(v));g.multiply(new Ge().setFromAxisAngle(new N(1,0,0),-.32));const p=(_,w)=>t(w).sub(t(_)).normalize(),y={armL:p(O.shL,O.elL),forearmL:p(O.elL,O.wrL),armR:p(O.shR,O.elR),forearmR:p(O.elR,O.wrR),thighL:p(O.hipL,O.knL),shinL:p(O.knL,O.anL),footL:p(O.heelL,O.toeL),thighR:p(O.hipR,O.knR),shinR:p(O.knR,O.anR),footR:p(O.heelR,O.toeR)},M={armL:e(O.shL,O.elL),forearmL:e(O.elL,O.wrL),armR:e(O.shR,O.elR),forearmR:e(O.elR,O.wrR),thighL:e(O.hipL,O.knL),shinL:e(O.knL,O.anL),footL:e(O.heelL,O.toeL),thighR:e(O.hipR,O.knR),shinR:e(O.knR,O.anR),footR:e(O.heelR,O.toeR)};return{pelvis:h,chest:u,head:g,headVis:e(O.earL,O.earR,O.nose),neck:v.sub(c).normalize(),dir:y,vis:M}}const ny={armL:new N(1,0,0),armR:new N(-1,0,0),thighL:new N(0,-1,0),thighR:new N(0,-1,0),neck:new N(0,1,0)},cf={forearmL:"armL",forearmR:"armR",shinL:"thighL",shinR:"thighR",footL:"shinL",footR:"shinR"};class iy{bones;rest=new Map;qm=new Map;hipRest;pelvisA;torso;len=new Map;segs;constructor(t,e){this.segs=t,this.bones=e;const n=l=>t.find(h=>h.name===l);for(const l of t){const h=new N(l.b[0]-l.a[0],l.b[1]-l.a[1],l.b[2]-l.a[2]);this.len.set(l.name,h.length()),h.lengthSq()>1e-9?h.normalize():h.set(0,1,0);const u=l.parent?n(l.parent):null,d=u?new N(l.a[0]-u.a[0],l.a[1]-u.a[1],l.a[2]-u.a[2]):new N(...l.a);let f=ny[l.name];if(!f&&cf[l.name]){const m=n(cf[l.name]);f=new N(m.b[0]-m.a[0],m.b[1]-m.a[1],m.b[2]-m.a[2]).normalize(),l.name.startsWith("foot")&&(f=h.clone())}f??=h.clone(),this.rest.set(l.name,{dir:h,offset:d,pre:new Ge().setFromUnitVectors(h,f),canon:f})}this.pelvisA=new N(...n("pelvis").a);const r=n("thighL").a,s=n("thighR").a,a=n("armL").a,o=n("armR").a;this.hipRest=new N((r[0]+s[0])/2,(r[1]+s[1])/2,(r[2]+s[2])/2);const c=new N((a[0]+o[0])/2,(a[1]+o[1])/2,(a[2]+o[2])/2);this.torso=c.distanceTo(this.hipRest)}setLength(t,e){const n=this.segs.find(a=>a.parent===t&&!a.name.startsWith("tail")&&a.name!=="jaw");if(!n)return;const r=this.bones.get(n.name),s=this.rest.get(n.name);r.position.copy(s.offset).multiplyScalar(e)}neckFit(t){const e=l=>this.segs.find(h=>h.name===l),n=e("spine2"),r=e("neck"),s=e("head"),a=(e("armL").a[1]+e("armR").a[1])/2-n.a[1],o=r.a[1]-n.a[1]+(s.a[1]-r.a[1]),c=(s.a[1]+s.b[1])/2-s.a[1];return o>.001?(a+t-c)/o:1}setNeck(t){for(const e of["neck","head"]){const n=this.bones.get(e),r=this.rest.get(e);n&&r&&n.position.copy(r.offset).multiplyScalar(t)}}swing(t,e,n,r){const s=this.rest.get(t),a=n.clone().applyQuaternion(e.clone().invert()).normalize(),o=new Ge().setFromUnitVectors(s.canon,a).multiply(s.pre);return r<1&&o.slerp(new Ge,1-Math.max(0,r)),o}glide=0;primed=new Set;set(t,e,n){const r=this.bones.get(t);r&&(this.glide>0&&this.primed.has(t)&&(e=r.quaternion.clone().slerp(e,this.glide)),r.quaternion.copy(e),this.primed.add(t));const s=n?n.clone().multiply(e):e.clone();return this.qm.set(t,s),s}apply(t,e=0,n=0,r=0){this.glide=r>0?1-Math.exp(-r/.025):0;const s=this.set("pelvis",t.pelvis,null),a=this.hipRest.clone().sub(this.pelvisA).applyQuaternion(t.pelvis);this.bones.get("pelvis").position.copy(a.negate());const o=t.pelvis.clone().slerp(t.chest,.5),c=this.set("spine1",s.clone().invert().multiply(o),s),l=this.set("spine2",c.clone().invert().multiply(t.chest),c),h=Hr(.3,.7,t.headVis),u=this.set("neck",this.swing("neck",l,t.neck,h*.6),l),d=u.clone().invert().multiply(t.head);h<1&&d.slerp(new Ge,1-h),this.set("head",d,u);for(const m of["L","R"]){const v=this.set("arm"+m,this.swing("arm"+m,l,t.dir[`arm${m}`],Hr(.35,.7,t.vis[`arm${m}`])),l);this.set("forearm"+m,this.swing("forearm"+m,v,t.dir[`forearm${m}`],Hr(.35,.7,t.vis[`forearm${m}`])),v);const g=this.set("thigh"+m,this.swing("thigh"+m,s,t.dir[`thigh${m}`],Hr(.4,.75,t.vis[`thigh${m}`])),s),p=this.set("shin"+m,this.swing("shin"+m,g,t.dir[`shin${m}`],Hr(.4,.75,t.vis[`shin${m}`])),g);this.set("foot"+m,this.swing("foot"+m,p,t.dir[`foot${m}`],Hr(.5,.8,t.vis[`foot${m}`])),p)}let f=s;for(let m=1;m<=4;m++){const v="tail"+m;if(!this.bones.has(v))break;const g=new Ge().setFromEuler(new On(0,Math.sin(e*2.1-m*.7)*n,Math.sin(e*1.3-m*.5)*n*.3));f=this.set(v,g,m===1?this.qm.get(this.segs.find(p=>p.name==="tail1")?.parent??"pelvis")??s:f)}}setJaw(t){this.bones.get("jaw")?.quaternion.setFromAxisAngle(new N(1,0,0),t)}dirOf(t){return this.rest.get(t).dir.clone().applyQuaternion(this.qm.get(t))}}const Ni=64,Vr=32,In=48,Qn=36,Gr=12,Ga=9,yn={spread:1.6,back:.9,envIntensity:1.15,key:5,every:6,targetMean:.22,maxGain:2.8,fill:.35},fc=new Float32Array(256).map((i,t)=>{const e=t/255;return e<=.04045?e/12.92:Math.pow((e+.055)/1.055,2.4)});class ry{constructor(t,e,n){this.renderer=t,this.scene=e,this.cv=document.createElement("canvas"),this.cv.width=In,this.cv.height=Qn,this.ctx=this.cv.getContext("2d",{willReadFrequently:!0}),this.tex=new is(this.data,Ni,Vr,We,Mr),this.tex.mapping=no,this.tex.colorSpace=gr,this.tex.magFilter=xe,this.tex.minFilter=xe,this.pmrem=new hl(t),this.key.castShadow=!0,this.key.shadow.mapSize.set(1024,1024),this.key.shadow.bias=-5e-4,this.key.shadow.normalBias=.02,this.key.shadow.radius=4,e.add(this.key),e.add(this.key.target),e.add(this.fill),this.fill.intensity=1}key=new ll(16777215,1);fill=new H1(16777215,4473924,0);cv;ctx;lin=new Float32Array(In*Qn*3);blur=new Float32Array(Gr*Ga*3);data=new Uint16Array(Ni*Vr*4);smooth=new Float32Array(Ni*Vr*3);primed=!1;keyDir=new N(0,1,1).normalize();keyI=0;tex;pmrem;rt=null;mean=0;share=0;gain=1;realism=!1;dir=new N(0,1,1).normalize();target=new N(0,0,-2);update(t,e,n,r,s,a){if(this.aimShadows(s,n),!a){this.scene.environment=null,this.fill.intensity=1.2,this.key.intensity=1.6,this.key.position.copy(this.target).add(new N(1.5,3,2.5));return}if(r%yn.every!==0&&this.rt||t.readyState<2||!t.videoWidth)return;this.ctx.drawImage(t,0,0,In,Qn);const o=this.ctx.getImageData(0,0,In,Qn).data;let c=0;for(let _=0,w=0;_<In*Qn;_++,w+=4){const E=fc[o[w]],A=fc[o[w+1]],R=fc[o[w+2]];this.lin[_*3]=E,this.lin[_*3+1]=A,this.lin[_*3+2]=R,c+=.2126*E+.7152*A+.0722*R}this.mean=c/(In*Qn),this.gain=Math.min(this.realism?1.25:yn.maxGain,Math.max(1,yn.targetMean/Math.max(this.mean,.001)));const l=this.gain;this.blur.fill(0);const h=In/Gr,u=Qn/Ga;for(let _=0;_<Qn;_++)for(let w=0;w<In;w++){const E=(Math.floor(_/u)*Gr+Math.floor(w/h))*3,A=(_*In+w)*3,R=this.blur;R[E]=R[E]+this.lin[A],R[E+1]=R[E+1]+this.lin[A+1],R[E+2]=R[E+2]+this.lin[A+2]}for(let _=0;_<this.blur.length;_++)this.blur[_]=this.blur[_]/(h*u);const d=e.f/e.w,f=e.f/e.h;let m=0,v=0,g=0,p=0;for(let _=0;_<Vr;_++){const w=((_+.5)/Vr-.5)*Math.PI,E=Math.sin(w),A=Math.cos(w);for(let R=0;R<Ni;R++){const x=((R+.5)/Ni-.5)*Math.PI*2;let b=Math.cos(x)*A;const S=Math.sin(x)*A,T=n?-b:b,L=S<0,D=Math.max(Math.abs(S),.08),U=Math.min(1,Math.max(0,.5+T/D*d/yn.spread)),B=Math.min(1,Math.max(0,.5-E/D*f/yn.spread));let X,H,Q;if(L){const lt=(Math.min(Qn-1,Math.floor(B*Qn))*In+Math.min(In-1,Math.floor(U*In)))*3;X=this.lin[lt],H=this.lin[lt+1],Q=this.lin[lt+2]}else{const lt=(Math.min(Ga-1,Math.floor(B*Ga))*Gr+Math.min(Gr-1,Math.floor(U*Gr)))*3;X=this.blur[lt]*yn.back,H=this.blur[lt+1]*yn.back,Q=this.blur[lt+2]*yn.back}X*=l,H*=l,Q*=l;const ct=(_*Ni+R)*3,ut=this.primed?.28:1;X=this.smooth[ct]=this.smooth[ct]+(X-this.smooth[ct])*ut,H=this.smooth[ct+1]=this.smooth[ct+1]+(H-this.smooth[ct+1])*ut,Q=this.smooth[ct+2]=this.smooth[ct+2]+(Q-this.smooth[ct+2])*ut;const vt=(_*Ni+R)*4;this.data[vt]=Ma.toHalfFloat(X),this.data[vt+1]=Ma.toHalfFloat(H),this.data[vt+2]=Ma.toHalfFloat(Q),this.data[vt+3]=Ma.toHalfFloat(1);const Et=.2126*X+.7152*H+.0722*Q,Nt=Et*A;b=Math.cos(x)*A,m+=Nt*b,v+=Nt*E,g+=Nt*S,p+=Nt}}this.primed=!0,this.tex.needsUpdate=!0,this.rt=this.pmrem.fromEquirectangular(this.tex,this.rt),this.scene.environment=this.rt.texture,this.scene.environmentIntensity=yn.envIntensity;const y=Math.hypot(m,v,g);this.share=p>0?y/p:0,y>1e-6&&this.keyDir.lerp(new N(m/y,v/y,g/y),.25).normalize(),this.dir.copy(this.keyDir),this.dir.y<.15&&(this.dir.y=.15,this.dir.normalize());const M=yn.key*this.share*(p/(Ni*Vr))*2;this.keyI+=(M-this.keyI)*(this.keyI===0?1:.25),this.key.intensity=this.keyI,this.fill.intensity=yn.fill*(this.realism?.25:1)*Math.min(1,Math.max(0,1-this.mean/.22)),this.key.position.copy(this.target).addScaledVector(this.dir,4)}aimShadows(t,e){if(!t.length)return;const n=new N;for(const a of t)n.add(a);n.multiplyScalar(1/t.length),e&&(n.x=-n.x);let r=1.4;for(const a of t)r=Math.max(r,Math.hypot((e?-a.x:a.x)-n.x,a.y-n.y,a.z-n.z)+1.4);this.target.copy(n),this.key.target.position.copy(n),this.key.position.copy(n).addScaledVector(this.dir,4);const s=this.key.shadow.camera;s.right!==r&&(s.left=-r,s.right=r,s.top=r,s.bottom=-r,s.near=.1,s.far=4+r*2,s.updateProjectionMatrix())}}const Wr={tauN:1,tauH:.6,imuAgree:35,footVis:.5};class sy{n=new N(0,1,0);h=-1.4;source="assumed";fromFeet=!1;bodyUp=new N(0,1,0);bodyW=0;update(t,e,n){const r=1-Math.exp(-n/Wr.tauN),s=1-Math.exp(-n/Wr.tauH),a=new N;let o=0;for(const f of t){if(f.lost||f.presence<.5)continue;const m=M=>new N(f.world[M].x,f.world[M].y,f.world[M].z),v=m(O.shL).add(m(O.shR)).multiplyScalar(.5),g=Math.min(f.world[O.anL].v,f.world[O.anR].v),p=g>Wr.footVis?m(O.anL).add(m(O.anR)).multiplyScalar(.5):m(O.hipL).add(m(O.hipR)).multiplyScalar(.5),y=v.sub(p);y.lengthSq()<1e-4||(a.addScaledVector(y.normalize(),f.presence*(g>Wr.footVis?1:.6)),o+=f.presence)}o>0&&a.lengthSq()>1e-6&&(a.normalize(),this.bodyUp.lerp(a,this.bodyW>0?r*.5:1).normalize(),this.bodyW=Math.min(1,this.bodyW+n));let c=null;const l=Math.cos(es.degToRad(Wr.imuAgree));e&&(this.bodyW===0||e.dot(this.bodyUp)>l)?(c=e,this.source="motion"):this.bodyW>0&&(c=this.bodyUp,this.source="body"),c&&this.n.lerp(c,r).normalize();let h=0,u=0,d=!1;for(const f of t){if(f.lost||f.presence<.5)continue;const m=y=>this.n.x*(f.T.x+f.world[y].x)+this.n.y*(f.T.y+f.world[y].y)+this.n.z*(f.T.z+f.world[y].z);let v=1/0;for(const[y,M]of[[O.heelL,.02],[O.heelR,.02],[O.toeL,.02],[O.toeR,.02],[O.anL,.08],[O.anR,.08]])f.world[y].v>Wr.footVis&&(v=Math.min(v,m(y)-M));if(v<1/0){h+=v*f.presence,u+=f.presence,d=!0;continue}const g=(m(O.hipL)+m(O.hipR))/2,p=Math.max(.6,Math.min(1.1,f.len.thigh+f.len.shin+.08));h+=(g-p)*f.presence*.4,u+=f.presence*.4}u>0&&(this.h+=(h/u-this.h)*s,this.fromFeet=d)}foot(t,e=new N){return e.copy(t).addScaledVector(this.n,this.h-this.n.dot(t))}height(t){return this.n.dot(t)-this.h}axes(){const t=new N(0,0,-1).addScaledVector(this.n,this.n.z).normalize(),e=new N().crossVectors(t,this.n).normalize();return{back:t,side:e}}get cameraHeight(){return-this.h}}const ir={coupling:.08,deadzone:2,restitution:.55,pupil:.46},ay=new $i({color:16777215,side:je,depthTest:!1,toneMapped:!1}),oy=new $i({color:657930,side:je,depthTest:!1,toneMapped:!1}),cy=new $i({color:10132122,side:je,depthTest:!1,toneMapped:!1}),ly=new $i({color:16777215,side:je,depthTest:!1,transparent:!0,opacity:.85,toneMapped:!1}),hy=new Ms(1,40),uy=new Vl(.95,1.05,40),fy=new Ms(1,28),dy=new Ms(.16,16);class lf{g=new ze;pupil;q=new dt(0,-.5);w=new dt;prev=[];sm=new N;primed=!1;constructor(){const t=new Dt(hy,ay),e=new Dt(uy,cy);this.pupil=new Dt(fy,oy),this.pupil.scale.setScalar(ir.pupil);const n=new Dt(dy,ly);n.position.set(-.38,.42,.003),this.pupil.position.z=.0015,e.position.z=.001,this.g.add(t,e,this.pupil,n),this.g.traverse(r=>{r.renderOrder=1100,r.frustumCulled=!1})}update(t,e,n,r){this.primed||(this.sm.copy(t.p),this.primed=!0),this.sm.lerp(t.p,1-Math.exp(-n/.05)),this.prev.push(this.sm.clone()),this.prev.length>3&&this.prev.shift();const s=new N;if(this.prev.length===3&&n>0){s.copy(this.prev[2]).addScaledVector(this.prev[1],-2).add(this.prev[0]).divideScalar(n*n);const d=s.length();s.multiplyScalar(d>ir.deadzone?(d-ir.deadzone)/d:0)}const a=new N().addScaledVector(e,-9.8).addScaledVector(s,-1).multiplyScalar(ir.coupling/Math.max(t.r,.005)),o=a.dot(t.u),c=a.dot(t.v),l=1-ir.pupil,h=4,u=Math.min(n,.1)/h;for(let d=0;d<h;d++){this.w.x+=o*u,this.w.y+=c*u,this.w.multiplyScalar(Math.exp(-2.2*u)),this.q.addScaledVector(this.w,u);const f=this.q.length();if(f>l){const m=this.q.x/f,v=this.q.y/f;this.q.set(m*l,v*l);const g=this.w.x*m+this.w.y*v;if(g>0){const p=this.w.x-g*m,y=this.w.y-g*v;this.w.set(p*.9-ir.restitution*g*m,y*.9-ir.restitution*g*v)}}}this.g.position.copy(t.p),this.g.quaternion.setFromRotationMatrix(new re().makeBasis(t.u,t.v,t.n)),this.g.scale.setScalar(t.r*r),this.g.visible=r>.02,this.pupil.position.set(this.q.x,this.q.y,.0015)}}class py{group=new ze;eyes=new Map;update(t,e,n,r){this.group.visible=r;const s=new Set;if(r)for(const a of t){if(!a.eyes)continue;s.add(a.id);let o=this.eyes.get(a.id);if(!o){o=[new lf,new lf];for(const c of o)this.group.add(c.g);this.eyes.set(a.id,o)}a.eyes.forEach((c,l)=>o[l]?.update(c,e,n,a.show))}for(const[a,o]of this.eyes)if(!s.has(a)){for(const c of o)this.group.remove(c.g);this.eyes.delete(a)}}}const Fi=900,my=`
  attribute float aSize; attribute float aLife; attribute vec3 aColor;
  uniform float uScale;
  varying float vLife; varying vec3 vColor;
  void main() {
    vLife = aLife; vColor = aColor;
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = aLife > 0.0 ? aSize * uScale / max(-mv.z, 0.05) : 0.0;
  }`,gy=`
  varying float vLife; varying vec3 vColor;
  void main() {
    vec2 c = gl_PointCoord - 0.5;
    float d = length(c) * 2.0;
    if (d > 1.0 || vLife <= 0.0) discard;
    float core = exp(-d * d * 5.0), halo = exp(-d * d * 1.6) * 0.45;
    float fade = smoothstep(0.0, 0.25, vLife) * smoothstep(1.0, 0.85, vLife);
    gl_FragColor = vec4(vColor * (core * 1.6 + halo) * fade, 1.0);
  }`,vy=[16722324,11796265,16769065,2744575,9187071].map(i=>new Ut(i));class xy{points;pos=new Float32Array(Fi*3);vel=new Float32Array(Fi*3);col=new Float32Array(Fi*3);size=new Float32Array(Fi);life=new Float32Array(Fi);span=new Float32Array(Fi);next=0;owed=new Map;mat;constructor(){const t=new Ee;t.setAttribute("position",new ae(this.pos,3)),t.setAttribute("aColor",new ae(this.col,3)),t.setAttribute("aSize",new ae(this.size,1)),t.setAttribute("aLife",new ae(this.life,1)),this.mat=new ke({vertexShader:my,fragmentShader:gy,uniforms:{uScale:{value:800}},transparent:!0,depthWrite:!1,blending:Mc,toneMapped:!1}),this.points=new a1(t,this.mat),this.points.frustumCulled=!1,this.points.renderOrder=1050}update(t,e,n,r){if(this.mat.uniforms.uScale.value=n,this.points.visible=r,!r)return;for(const o of t){const c=Math.min(1,Math.max(0,(o.open-.3)/.45));let l=(this.owed.get(o.id)??0)+c*c*110*e;const h=o.colors?.length?o.colors:vy;for(;l>=1;){l-=1;const u=this.next;this.next=(this.next+1)%Fi;const d=.35,f=Math.random()*Math.PI*2,m=Math.random()*d,v=new N(1,0,0).cross(o.dir);v.lengthSq()<1e-4&&v.set(0,1,0),v.normalize();const g=new N().crossVectors(o.dir,v).normalize(),p=o.dir.clone().addScaledVector(v,Math.cos(f)*m).addScaledVector(g,Math.sin(f)*m-.15).normalize(),y=(1.1+Math.random()*1.1)*o.scale;this.pos[u*3]=o.p.x,this.pos[u*3+1]=o.p.y,this.pos[u*3+2]=o.p.z,this.vel[u*3]=p.x*y,this.vel[u*3+1]=p.y*y,this.vel[u*3+2]=p.z*y;const M=h[Math.floor(Math.random()*h.length)];this.col[u*3]=M.r,this.col[u*3+1]=M.g,this.col[u*3+2]=M.b,this.size[u]=(.025+Math.random()*.045)*o.scale,this.span[u]=.9+Math.random()*.6,this.life[u]=1}this.owed.set(o.id,l)}const s=Math.exp(-1.6*e);for(let o=0;o<Fi;o++)this.life[o]<=0||(this.life[o]=this.life[o]-e/this.span[o],this.vel[o*3]=this.vel[o*3]*s,this.vel[o*3+2]=this.vel[o*3+2]*s,this.vel[o*3+1]=this.vel[o*3+1]*s+.5*e,this.pos[o*3]=this.pos[o*3]+this.vel[o*3]*e,this.pos[o*3+1]=this.pos[o*3+1]+this.vel[o*3+1]*e,this.pos[o*3+2]=this.pos[o*3+2]+this.vel[o*3+2]*e);const a=this.points.geometry;for(const o of["position","aColor","aSize","aLife"])a.getAttribute(o).needsUpdate=!0}}const _y=new ke({transparent:!0,depthWrite:!1,toneMapped:!1,vertexShader:"varying vec2 vUv; void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }",fragmentShader:"varying vec2 vUv; void main() { float r = length(vUv - 0.5) * 2.0; gl_FragColor = vec4(0.0, 0.0, 0.0, 0.5 * pow(clamp(1.0 - r, 0.0, 1.0), 1.6)); }"}),My=new Si(1,1),Wa=12,$d=`
  varying vec2 vUv;
  uniform vec4 uCrop; // u0, v0, du, dv of the video shown
  uniform float uMirror;
  void main() {
    vec2 uv = position.xy * 0.5 + 0.5;
    uv.x = mix(uv.x, 1.0 - uv.x, uMirror);
    vUv = uCrop.xy + uv * uCrop.zw;
    gl_Position = vec4(position.xy, 1.0, 1.0);
  }`,yy=`
  varying vec2 vUv;
  uniform sampler2D uTex;
  void main() { gl_FragColor = vec4(texture2D(uTex, vUv).rgb, 1.0); }`;class by{constructor(t){this.canvas=t,this.renderer=new R_({canvas:t,antialias:!0,alpha:!1,powerPreference:"high-performance",preserveDrawingBuffer:!1}),this.renderer.outputColorSpace=dn,this.renderer.toneMapping=Af,this.renderer.toneMappingExposure=1,this.renderer.shadowMap.enabled=!0,this.renderer.shadowMap.type=bf,this.renderer.setPixelRatio(this.opts.pixelRatio),this.plainBg=new ke({vertexShader:$d,fragmentShader:yy,depthTest:!1,depthWrite:!1,toneMapped:!1,uniforms:this.bgUniforms}),this.bg=new Dt(new Si(2,2),this.plainBg),this.fg=new Dt(new Si(2,2),this.plainBg),this.fg.frustumCulled=!1,this.fg.renderOrder=1e3,this.fg.visible=!1,this.bg.frustumCulled=!1,this.bg.renderOrder=-1e3,this.scene.add(this.bg),this.scene.add(this.fg),this.scene.add(this.world),this.world.add(this.googly.group,this.breath.points);for(const e of this.spots)this.world.add(e,e.target);this.grain=new Dt(new Si(2,2),new ke({vertexShader:"varying vec2 vUv; void main() { vUv = position.xy * 0.5 + 0.5; gl_Position = vec4(position.xy, 0.0, 1.0); }",fragmentShader:`varying vec2 vUv; uniform float uTime; uniform vec2 uRes;
        float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
        void main() {
          vec2 d = vUv - 0.5; d.y *= 1.15;
          float vig = 1.0 - 0.35 * dot(d, d);
          float n = hash(floor(vUv * uRes) + fract(uTime * 7.31) * 97.0);
          gl_FragColor = vec4(vec3(vig * (0.965 + 0.035 * n)), 1.0);
        }`,uniforms:{uTime:{value:0},uRes:{value:new dt(1,1)}},depthTest:!1,depthWrite:!1,toneMapped:!1,transparent:!0,blending:Sf,blendSrc:wf,blendDst:Ef})),this.grain.frustumCulled=!1,this.grain.renderOrder=1200,this.grain.visible=!1,this.scene.add(this.grain),this.scene.add(this.camera),this.light=new ry(this.renderer,this.scene,this.world),this.rims[0].position.set(-3,2.5,-6),this.rims[1].position.set(3,2.5,-6);for(const e of this.rims)e.target.position.set(0,0,-3),this.scene.add(e,e.target)}renderer;scene=new Yf;camera=new bn(50,1,.05,60);world=new ze;light;bg;bgUniforms={uTex:{value:null},uCrop:{value:new le(0,0,1,1)},uMirror:{value:0}};plainBg;videoTex=null;templates=new Map;wearers=new Map;leaving=[];lastT=-1;frameDt=0;pyramid=!1;hideWearers=!1;ground=new sy;googly=new py;breath=new xy;googlyOn=!1;breathOn=!0;spots=[0,1,2].map(()=>new G1(16777215,0,0,.24,.65,2));grain;fg;rims=[new ll(16723349,0),new ll(3073791,0)];opts={size:1,shadows:!0,envLight:!0,pixelRatio:Math.min(window.devicePixelRatio||1,2)};cover={s:1,ox:0,oy:0,vw:1,vh:1,cw:1,ch:1,mirror:!1};setVideo(t){this.videoTex?.dispose();const e=new o1(t);e.colorSpace=ii,e.minFilter=xe,e.magFilter=xe,e.generateMipmaps=!1,this.videoTex=e,this.bgUniforms.uTex.value=e}setBackground(t){this.bg.material=t??this.plainBg}setForeground(t){this.fg.visible=!!t,t&&(this.fg.material=t)}template(t){let e=this.templates.get(t);return e||(e=sc(Ei(t)),this.templates.set(t,e)),e}hasTemplate(t){return this.templates.has(t)}worker=null;queue=[];busy=null;waiting=new Map;workerMs=new Map;prepare(t,e=!1){const n=this.templates.get(t);if(n)return Promise.resolve(n);const r=new Promise(s=>{const a=this.waiting.get(t)??[];a.push(s),this.waiting.set(t,a)});return this.busy!==t&&(this.queue=this.queue.filter(s=>s!==t),e?this.queue.unshift(t):this.queue.push(t)),this.pump(),r}isPreparing(t){return this.busy===t||this.queue.includes(t)}pump(){if(!(this.busy||!this.queue.length)){if(!this.worker)try{this.worker=new Worker(new URL(""+new URL("build.worker-CRstWC2e.js",import.meta.url).href,import.meta.url),{type:"module"}),this.worker.onmessage=t=>{const{id:e,body:n,fur:r,ms:s}=t.data;this.workerMs.set(e,s);const a=sc(Ei(e),void 0,n?{body:n,fur:r}:void 0);this.finish(e,a)},this.worker.onerror=t=>{console.warn("costume worker failed; building on the main thread",t),this.worker=null,this.workerDead=!0,this.fallback()}}catch{this.workerDead=!0}if(this.workerDead){this.fallback();return}this.busy=this.queue.shift(),this.worker.postMessage({id:this.busy})}}workerDead=!1;fallback(){const t=this.busy??this.queue.shift();t&&(this.busy=t,setTimeout(()=>this.finish(t,sc(Ei(t))),16))}finish(t,e){this.templates.has(t)||this.templates.set(t,e);const n=this.templates.get(t);for(const r of this.waiting.get(t)??[])r(n);this.waiting.delete(t),this.busy=null,this.pump()}layout(t,e){const n=this.canvas.clientWidth||window.innerWidth,r=this.canvas.clientHeight||window.innerHeight,s=this.opts.pixelRatio;this.renderer.getPixelRatio()!==s&&this.renderer.setPixelRatio(s);const a=this.renderer.getSize(new dt);(a.x!==n||a.y!==r)&&this.renderer.setSize(n,r,!1);const o=Math.max(n/t.w,r/t.h),c=n/o,l=r/o,h=(t.w-c)/2/t.w,u=(t.h-l)/2/t.h;this.bgUniforms.uCrop.value.set(h,u,c/t.w,l/t.h),this.bgUniforms.uMirror.value=e?1:0,this.camera.fov=es.radToDeg(2*Math.atan(l/2/t.f)),this.camera.aspect=n/r,this.camera.updateProjectionMatrix(),this.world.scale.x=e?-1:1,this.cover={s:o,ox:(t.w-c)/2,oy:(t.h-l)/2,vw:t.w,vh:t.h,cw:n,ch:r,mirror:e}}sync(t,e,n){const r=this.lastT<0?.03333333333333333:Math.min(.1,Math.max(0,n-this.lastT));this.lastT=n,this.frameDt=r;const s=new Set;for(const a of t){const o=e(a.id);let c=this.wearers.get(a.id);c&&c.def.id!==o&&this.templates.has(o)&&(c.leaving=!0,this.leaving.push(c),this.wearers.delete(a.id),c=void 0),!(!c&&!this.templates.has(o))&&(s.add(a.id),c||(c=this.dress(a.id,o)),c.life=Math.min(1,c.life+r/.35),this.pose(c,a,n))}for(const[a,o]of this.wearers)s.has(a)||this.drop(o);this.leaving=this.leaving.filter(a=>{if(a.life-=r/.35,a.life<=0)return this.drop(a),!1;const o=t.find(c=>c.id===a.trackId);return o&&this.pose(a,o,n),!0})}dress(t,e){const n=this.template(e),r=Cu(n.root),s=new Map;r.traverse(l=>{l.isBone&&s.set(l.name,l)});const a=new Map;r.traverse(l=>{const h=l;if(!h.isMesh)return;const u=d=>{let f=a.get(d);return f||(f=d.clone(),f.onBeforeCompile=d.onBeforeCompile,f.customProgramCacheKey=d.customProgramCacheKey,f.alphaHash=!0,a.set(d,f)),f};h.material=Array.isArray(h.material)?h.material.map(u):u(h.material)});const o=n.def.segs.map(l=>s.get(l.name)).filter(Boolean),c={trackId:t,def:n.def,root:r,rig:new iy(n.def.segs,s),mats:[...a.values()],fade:0,life:0,leaving:!1,boneList:o,hist:Array.from({length:Wa},()=>new Float32Array(o.length*7)),histHead:0,clones:[]};return this.world.add(r),this.wearers.set(t,c),c}drop(t){this.world.remove(t.root);for(const e of t.clones)this.world.remove(e.root,e.shadow);for(const e of t.mats)e.dispose();this.wearers.get(t.trackId)===t&&this.wearers.delete(t.trackId)}pose(t,e,n){const r=t.def,s=t.rig,a=of(e.world),o=e.len.torso/s.torso*(r.fit?.size??1)*this.opts.size,c=r.fit?.limb??0,l=(m,v)=>{const g=1+(v/o/(s.len.get(m)??1)-1)*c;s.setLength(m,Math.min(1.6,Math.max(.65,g)))};for(const m of["L","R"])l("arm"+m,e.len.upperArm),l("thigh"+m,e.len.thigh),l("shin"+m,e.len.shin);const h=s.neckFit(e.len.neck/o);s.setNeck(1+(Math.min(1.25,Math.max(.45,h))-1)*(r.fit?.head??.85)),s.apply(a,n,r.idle?.tail??0,this.frameDt),r.face?.jaw&&s.setJaw((e.face?.jaw??0)*r.face.jaw),t.root.position.set(e.T.x,e.T.y,e.T.z),t.root.scale.setScalar(o);const u=e.presence*Math.max(0,Math.min(1,t.life)),d=u*u*(3-2*u);if(d!==t.fade){for(const m of t.mats)m.opacity=d;t.fade=d}t.root.visible=d>.01&&!this.hideWearers,r.tick?.(t.root,n,e.face??null),t.histHead=(t.histHead+1)%Wa;const f=t.hist[t.histHead];t.boneList.forEach((m,v)=>{m.quaternion.toArray(f,v*7),m.position.toArray(f,v*7+4)}),this.posePyramid(t,o,d,n)}posePyramid(t,e,n,r){const s=this.pyramid?this.wearers.size>1?2:3:0,a=[];for(let v=1;v<=s;v++)for(let g=0;g<=v;g++)a.push([v,g]);for(;t.clones.length>a.length;){const v=t.clones.pop();this.world.remove(v.root,v.shadow)}for(;t.clones.length<a.length;){const v=Cu(t.root);v.traverse(_=>{_.castShadow=!1});const g=new Map;v.traverse(_=>{_.isBone&&g.set(_.name,_)});const[p,y]=a[t.clones.length],M=new Dt(My,_y);M.renderOrder=1,t.clones.push({root:v,bones:t.def.segs.map(_=>g.get(_.name)).filter(Boolean),row:p,col:y,shadow:M}),this.world.add(v,M)}const o=t.rig.torso*e*3.2,c=this.ground,{back:l,side:h}=c.axes(),u=t.root.position,d=c.foot(u),f=c.height(u),m=new Ge().setFromUnitVectors(new N(0,0,1),c.n);for(const v of t.clones){const g=v.col-v.row/2,p=Math.round(v.row*3+Math.abs(g)*1.5),y=t.hist[(t.histHead-p+Wa*4)%Wa];v.bones.forEach((_,w)=>{_.quaternion.fromArray(y,w*7),_.position.fromArray(y,w*7+4)});const M=d.clone().addScaledVector(l,v.row*o*.5).addScaledVector(h,g*o*.55);v.root.position.copy(M).addScaledVector(c.n,f),v.root.scale.copy(t.root.scale),v.root.visible=n>.01,v.shadow.position.copy(M).addScaledVector(c.n,.004),v.shadow.quaternion.copy(m),v.shadow.scale.set(o*.42,o*.26,1),v.shadow.visible=v.root.visible,t.def.tick?.(v.root,r-p/30,null)}}faces(t,e,n){this.world.updateMatrixWorld();const r=this.world.matrixWorld.clone().invert(),s=[],a=[];for(const c of t){if(c.lost&&c.presence<=0)continue;const l=c.face,h=this.wearers.get(c.id),u=h&&h.root.visible&&!this.hideWearers?h:null,d=of(c.world).head,f=(M,_,w)=>new N(M,_,w).applyQuaternion(d),m=new N(c.T.x+c.world[O.nose].x,c.T.y+c.world[O.nose].y,c.T.z+c.world[O.nose].z),v=Math.max(.3,-m.z),g=(M,_,w)=>new N((M*e.w-e.cx)/e.f*v,(e.cy-_*e.h)/e.f*v,-v).addScaledVector(f(0,0,1),w);let p=null,y=null;if(u){u.root.updateMatrixWorld(!0);const M=u.rig.bones.get("head"),_=u.def.segs.find(x=>x.name==="head"),w=M?r.clone().multiply(M.matrixWorld):null,E=u.root.scale.x;if(w&&_&&u.def.face?.eyes){const x=new N(1,0,0).transformDirection(w),b=new N(0,1,0).transformDirection(w),S=new N(0,0,1).transformDirection(w);p=u.def.face.eyes.map(([T,L,D,U])=>({p:new N(T-_.a[0],L-_.a[1],D-_.a[2]).applyMatrix4(w),u:x,v:b,n:S,r:U*E*1.15}))}const A=u.rig.bones.get("jaw"),R=u.def.segs.find(x=>x.name==="jaw");if(A&&R&&u.def.face?.jaw){const x=r.clone().multiply(A.matrixWorld);y={p:new N(R.b[0]-R.a[0],R.b[1]-R.a[1],R.b[2]-R.a[2]).applyMatrix4(x),dir:new N(0,-.2,1).transformDirection(w??x),scale:E*10}}else if(w&&_){const x=new N(0,0,1).transformDirection(w);y={p:(l?g(l.mouth.x,l.mouth.y,0):m.clone()).addScaledVector(x,.12*E*10),dir:x.clone().add(new N(0,-.2,0)).normalize(),scale:E*10}}}if(!p&&l){const M=f(1,0,0),_=f(0,1,0),w=f(0,0,1);p=l.eyes.map(E=>({p:g(E.x,E.y,.02),u:M,v:_,n:w,r:Math.max(.012,E.r*e.w/e.f*v*1.35)}))}!y&&l&&(y={p:g(l.mouth.x,l.mouth.y,.03),dir:f(0,-.2,1).normalize(),scale:1}),s.push({id:c.id,eyes:p,show:c.presence}),y&&l&&a.push({id:c.id,...y,open:l.jaw*c.presence,colors:void 0})}this.googly.update(s,this.ground.n,n,this.googlyOn);const o=this.renderer.getDrawingBufferSize(new dt).y;this.breath.update(a,n,o/(2*Math.tan(es.degToRad(this.camera.fov)/2)),this.breathOn)}setGrain(t,e){this.grain.visible=t;const n=this.grain.material.uniforms;n.uTime.value=e;const r=this.renderer.getDrawingBufferSize(new dt);n.uRes.value.set(r.x/1.5,r.y/1.5)}stageSpots(t,e,n,r,s){const a=this.ground,{back:o,side:c}=a.axes(),l=a.foot(s??new N(0,-.3,-3)),h=l.clone().addScaledVector(o,1.1),u=[16769728,16726696,3856639],d=f=>{const m=os(f,r);return new dt(m.x,1-m.y)};return this.spots.map((f,m)=>{const v=l.clone().addScaledVector(c,(m-1)*2.4).addScaledVector(o,.6).addScaledVector(a.n,3.6),g=h.clone().addScaledVector(c,(m-1)*.9+1.2*Math.sin(e*.33+m*2.1)).addScaledVector(o,.8*Math.cos(e*.27+m*1.3)),p=new Ut(u[m]);f.color.copy(p),f.position.copy(v),f.target.position.copy(g),f.target.updateMatrixWorld(),f.intensity=t?38*(1+.8*n):0;const y=v.distanceTo(g)*Math.tan(f.angle)*.9,M=d(g),_=v.z<-.15?d(v):new dt(M.x,1.4),w=new dt(Math.abs(d(g.clone().addScaledVector(c,y)).x-M.x),Math.abs(d(g.clone().addScaledVector(o,y)).y-M.y));return{L:_,P:M,R:w,C:p.clone().multiplyScalar(1+.8*n)}})}stageLights(t,e,n){const r=[16722324,11796265,16769065,2744575,9187071];this.rims.forEach((s,a)=>{s.intensity=t?2.2+3*n:0;const o=(e*.12+a*.4)%1*r.length,c=Math.floor(o),l=o-c;s.color.setHex(r[c%r.length]).lerp(new Ut(r[(c+1)%r.length]),l)})}people(){return[...this.wearers.values()].filter(t=>t.root.visible).map(t=>t.root.position.clone())}render(t,e,n){this.renderer.shadowMap.enabled=this.opts.shadows,t&&this.light.update(t,e,this.cover.mirror,n,this.people(),this.opts.envLight),this.renderer.render(this.scene,this.camera)}get count(){return this.wearers.size}}const Ti=[{id:"insitu",name:"In Situ",code:12,swatch:"radial-gradient(ellipse at 30% 85%, rgba(255,80,190,0.9), transparent 35%), radial-gradient(ellipse at 72% 80%, rgba(80,220,255,0.9), transparent 35%), linear-gradient(160deg, transparent 40%, rgba(255,240,220,0.35) 50%, transparent 60%), #2a2430"},{id:"pyramid",name:"Pyramid",code:8,swatch:"conic-gradient(from 150deg at 50% 18%, transparent 0 60deg, #ff2d95 60deg 64deg, #b6ff2e 64deg 68deg, transparent 68deg), linear-gradient(#2a0f3d, #08050f)"},{id:"tunnel",name:"Tunnel",code:9,swatch:"repeating-radial-gradient(circle, #ff2d95 0 3px, #12071f 3px 8px, #2ee6ff 8px 11px, #12071f 11px 16px)"},{id:"lasers",name:"Lasers",code:10,swatch:"linear-gradient(115deg, transparent 46%, #b6ff2e 48%, transparent 50%), linear-gradient(65deg, transparent 46%, #ff2d95 48%, transparent 50%), linear-gradient(90deg, transparent 47%, #2ee6ff 49%, transparent 51%), #07040d"},{id:"kaleido",name:"Kaleido",code:11,swatch:"conic-gradient(#ff2d95, #ffe62e, #b6ff2e, #2ee6ff, #8a2eff, #ff2d95)"},{id:"rings",name:"Rings",code:5,swatch:"repeating-radial-gradient(circle, #ff3d7f 0 5px, #ffb23d 5px 10px, #3dd6ff 10px 15px, #8c5cff 15px 20px)"},{id:"neon",name:"Neon",code:4,swatch:"radial-gradient(circle, transparent 0 40%, #39ff9c 42% 50%, transparent 54%), #06030f"},{id:"pop",name:"Pop Art",code:1,swatch:"radial-gradient(circle at 30% 30%, #ffde00 0 22%, transparent 23%), radial-gradient(circle at 70% 70%, #ff2d8a 0 22%, transparent 23%), #19c3ff"},{id:"warhol",name:"Warhol",code:2,swatch:"conic-gradient(#ff5fa2 0 25%, #ffd400 0 50%, #2ad4c4 0 75%, #7b5cff 0)"},{id:"echo",name:"Echoes",code:6,swatch:"linear-gradient(90deg, #1b1033, #ff2db4 40%, #2de2ff 70%, #1b1033)"},{id:"disco",name:"Disco",code:7,swatch:"radial-gradient(circle at 30% 30%, #ff4fd8, transparent 45%), radial-gradient(circle at 70% 60%, #4fd1ff, transparent 45%), radial-gradient(circle at 45% 80%, #ffe14f, transparent 40%), #120820"},{id:"solar",name:"Solarize",code:3,swatch:"linear-gradient(135deg, #1a0b3d, #ff7a00 45%, #00e5ff 55%, #2a0b3d)"},{id:"spot",name:"Spotlight",code:0,swatch:"radial-gradient(circle at 50% 40%, #fff6d8, #6a5a40 45%, #120f0a 75%)"}],Sy=[[2757440,16727435,16756736,16774084],[731722,46023,16740156,16776160],[2951947,9321727,3997598,16382065],[1058330,16723502,3065343,16769520]],fo=12,Xa=`
  varying vec2 vUv;
  void main() { vUv = position.xy * 0.5 + 0.5; gl_Position = vec4(position.xy, 0.0, 1.0); }`,wy=`
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
  }`,Ey=`
  varying vec2 vUv;
  uniform sampler2D uTex, uMask;
  uniform vec4 uOn;
  void main() {
    vec4 m = smoothstep(0.3, 0.7, texture2D(uMask, vec2(vUv.x, 1.0 - vUv.y))) * uOn;
    gl_FragColor = vec4(texture2D(uTex, vUv).rgb, max(max(m.r, m.g), max(m.b, m.a)));
  }`,Ty=`
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
  ${wy}

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
    return texture(uHist, vec3(q, mod(uHead - delay + ${fo}.0 * 8.0, ${fo}.0)));
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
  }`,Ay=`
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
  }`,Ry=`
  varying vec2 vUv;
  uniform sampler2D uSrc;
  uniform vec2 uDir;
  void main() {
    vec3 c = texture2D(uSrc, vUv).rgb * 0.2270270;
    c += (texture2D(uSrc, vUv + uDir * 1.3846154).rgb + texture2D(uSrc, vUv - uDir * 1.3846154).rgb) * 0.3162162;
    c += (texture2D(uSrc, vUv + uDir * 3.2307692).rgb + texture2D(uSrc, vUv - uDir * 3.2307692).rgb) * 0.0702703;
    gl_FragColor = vec4(c, 1.0);
  }`,hf=`
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
  }`;class Cy{material;foreground;_preset=Ti[0];get preset(){return this._preset}set preset(t){t!==this._preset&&(this.fromCode=this._preset.code,this.xfade=this.started?0:1,this._preset=t)}fromCode=0;xfade=1;started=!1;rtOld=null;subjects=2;beat=0;setSpots(t,e){const n=this.scene.uniforms;t.forEach((r,s)=>{n.uSpotL.value[s].copy(r.L),n.uSpotP.value[s].copy(r.P),n.uSpotR.value[s].copy(r.R),n.uSpotC.value[s].copy(r.C)}),n.uSpotK.value=e}clones=!0;maskTex;maskData=new Uint8Array(4);mw=0;mh=0;fw=0;fh=0;fxTex;fxData;chans=[null,null,null,null];chanMask=[null,null,null,null];union;dist;trail;stamp;uOn=new le;box=new le(.35,.1,.65,.7);quad=new Dt(new Si(2,2));quadScene=new Yf;cam=new Wl(-1,1,1,-1,0,1);cut;scene;bright;blur;rtScene=[];rtB1a=null;rtB1b=null;rtB2a=null;rtB2b=null;hist=null;head=0;flip=0;sizeKey="";constructor(t,e){this.maskTex=new is(new Uint8Array(4),1,1,We),this.maskTex.needsUpdate=!0,this.resizeFx(160,90);const n={depthTest:!1,depthWrite:!1,toneMapped:!1};this.cut=new ke({...n,vertexShader:Xa,fragmentShader:Ey,uniforms:{uTex:t.uTex,uMask:{value:this.maskTex},uOn:{value:this.uOn}}}),this.scene=new ke({...n,vertexShader:Xa,fragmentShader:Ty,uniforms:{uTex:t.uTex,uMask:{value:this.maskTex},uFx:{value:this.fxTex},uPrev:{value:null},uHist:{value:null},uHead:{value:0},uClones:{value:1},uSpotL:{value:[0,1,2].map(()=>new dt(.5,1.2))},uSpotP:{value:[0,1,2].map(()=>new dt(.5,.1))},uSpotR:{value:[0,1,2].map(()=>new dt(.1,.04))},uSpotC:{value:[0,1,2].map(()=>new Ut(0,0,0))},uSpotK:{value:0},uClone:{value:Array.from({length:9},()=>new le)},uCloneN:{value:0},uFoot:{value:new dt(.5,.1)},uFootW:{value:.2},uTime:{value:0},uAspect:{value:1},uBeat:{value:0},uLevel:{value:0},uPreset:{value:0},uOn:{value:this.uOn},uBox:{value:this.box},uPal:{value:Sy.flat().map(r=>new Ut(r))}}}),this.bright=new ke({...n,vertexShader:Xa,fragmentShader:Ay,uniforms:{uSrc:{value:null},uTexel:{value:new dt},uThreshold:{value:.72}}}),this.blur=new ke({...n,vertexShader:Xa,fragmentShader:Ry,uniforms:{uSrc:{value:null},uDir:{value:new dt}}}),this.material=new ke({...n,vertexShader:e,fragmentShader:hf,uniforms:{uCrop:t.uCrop,uMirror:t.uMirror,uScene:{value:null},uBloom1:{value:null},uBloom2:{value:null},uTime:{value:0},uBeat:{value:0},uFlash:{value:1},uRes:{value:new dt(1,1)},uOld:{value:null},uMix:{value:1},uCA:{value:1},uBloomK:{value:1}}}),this.foreground=new ke({...n,vertexShader:e,fragmentShader:hf,transparent:!0,defines:{FG:1},uniforms:{...this.material.uniforms,uMask:this.scene.uniforms.uMask,uOn:this.scene.uniforms.uOn}}),this.quad.frustumCulled=!1,this.quadScene.add(this.quad)}resizeFx(t,e){this.fxTex?.dispose(),this.fxData=new Uint8Array(t*e*4),this.fxTex=new is(this.fxData,t,e,We),this.fxTex.magFilter=xe,this.fxTex.minFilter=xe,this.union=new Float32Array(t*e),this.dist=new Float32Array(t*e),this.trail=new Float32Array(t*e),this.stamp=new Float32Array(t*e);for(let n=0;n<t*e;n++)this.fxData[n*4]=255;this.fxTex.needsUpdate=!0,this.fw=t,this.fh=e,this.scene&&(this.scene.uniforms.uFx.value=this.fxTex)}frameDt=1/30;update(t,e,n,r,s,a){this.frameDt=e;const o=this.scene.uniforms;o.uTime.value=n,o.uAspect.value=r,o.uPreset.value=this.preset.code,o.uBeat.value=this.beat,o.uClones.value=this.clones?1:0,this.material.uniforms.uTime.value=n,this.material.uniforms.uBeat.value=this.beat;const c=this.preset.code===12;this.material.uniforms.uCA.value=c?.25:1,this.material.uniforms.uBloomK.value=c?.45:1;const l=r>=1?160:Math.max(48,Math.round(160*r)),h=r>=1?Math.max(48,Math.round(160/r)):160;(l!==this.fw||h!==this.fh)&&this.resizeFx(l,h);const u=t.filter(g=>g.presence>0).sort((g,p)=>p.len.torso/-p.T.z-g.len.torso/-g.T.z).slice(0,this.subjects),d=new Set(u.map(g=>g.id));for(let g=0;g<4;g++)this.chans[g]!==null&&!d.has(this.chans[g])&&(this.chans[g]=null,this.chanMask[g]=null);for(const g of u){let p=this.chans.indexOf(g.id);if(p<0){if(p=this.chans.indexOf(null),p<0)continue;this.chans[p]=g.id}const y=g.det?.mask;if(y){(y.w!==this.mw||y.h!==this.mh)&&this.resizeMask(y.w,y.h);let M=this.chanMask[p];if(!M||M.length!==y.data.length)M=this.chanMask[p]=new Float32Array(y.data.length),M.set(y.data);else{const _=1-Math.exp(-e/.04),w=y.data;for(let E=0;E<w.length;E++)M[E]=M[E]+(w[E]-M[E])*_}}}const f=[0,0,0,0];for(let g=0;g<4;g++){const p=this.chans[g];p!==null&&this.chanMask[g]&&(f[g]=t.find(y=>y.id===p)?.presence??0)}if(this.uOn.set(f[0],f[1],f[2],f[3]),this.fx(e,n,f),this.layPyramid(u[0],s,a,e),!this.mw)return;const m=this.mw*this.mh,v=this.maskData;for(let g=0;g<4;g++){const p=this.chanMask[g];if(!p){for(let y=0;y<m;y++)v[y*4+g]=0;continue}for(let y=0;y<m;y++)v[y*4+g]=p[y]*255}this.maskTex.needsUpdate=!0}cloneSm=Array.from({length:9},()=>new le);cloneSmN=0;layPyramid(t,e,n,r=1/30){const s=this.scene.uniforms;if(!t||!e||!n){s.uCloneN.value=0,this.cloneSmN=0;return}const a=new N(t.T.x,t.T.y,t.T.z),o=e.foot(a),c=Math.max(1.2,Math.min(2.2,e.height(a)*1.9)),{back:l,side:h}=e.axes(),u=os(o,n),d=1-Math.exp(-r/.15),f=s.uFoot.value;this.cloneSmN===0?f.set(u.x,1-u.y):f.lerp(new dt(u.x,1-u.y),d),s.uFootW.value=Math.max(.05,this.box.z-this.box.x);const m=[];for(let g=1;g<=3;g++)for(let p=0;p<=g;p++){const y=p-g/2,M=o.clone().addScaledVector(l,g*c*.5).addScaledVector(h,y*c*.55);if(M.z>-.3)continue;const _=os(M,n);m.push({v:new le(_.x,1-_.y,-o.z/-M.z,g*3+Math.abs(y)*1.5),depth:-M.z})}m.sort((g,p)=>p.depth-g.depth);const v=s.uClone.value;m.forEach((g,p)=>{const y=this.cloneSm[p];this.cloneSmN!==m.length?y.copy(g.v):y.lerp(g.v,d),y.w=g.v.w,v[p].copy(y)}),this.cloneSmN=m.length,s.uCloneN.value=m.length}resizeMask(t,e){this.maskTex.dispose(),this.mw=t,this.mh=e,this.maskData=new Uint8Array(t*e*4),this.maskTex=new is(this.maskData,t,e,We),this.maskTex.magFilter=xe,this.maskTex.minFilter=xe,this.scene.uniforms.uMask.value=this.maskTex,this.cut.uniforms.uMask.value=this.maskTex}fx(t,e,n){const r=this.fw,s=this.fh,a=this.union,o=this.dist;let c=r,l=s,h=-1,u=-1;for(let p=0;p<s;p++){const y=Math.min(this.mh-1,Math.floor((p+.5)/s*this.mh));for(let M=0;M<r;M++){let _=0;if(this.mw){const w=y*this.mw+Math.min(this.mw-1,Math.floor((M+.5)/r*this.mw));for(let E=0;E<4;E++){const A=this.chanMask[E];A&&(_=Math.max(_,A[w]*n[E]))}}a[p*r+M]=_,_>.5&&(M<c&&(c=M),M>h&&(h=M),p<l&&(l=p),p>u&&(u=p))}}if(h>=0){const p=1-Math.exp(-t/.12),y=c/r,M=(h+1)/r,_=1-(u+1)/s,w=1-l/s;this.box.set(this.box.x+(y-this.box.x)*p,this.box.y+(_-this.box.y)*p,this.box.z+(M-this.box.z)*p,this.box.w+(w-this.box.w)*p)}const d=1e6,f=Math.SQRT2;for(let p=0;p<r*s;p++)o[p]=a[p]>.5?0:d;for(let p=0;p<s;p++)for(let y=0;y<r;y++){const M=p*r+y;let _=o[M];y>0&&(_=Math.min(_,o[M-1]+1)),p>0&&(_=Math.min(_,o[M-r]+1),y>0&&(_=Math.min(_,o[M-r-1]+f)),y<r-1&&(_=Math.min(_,o[M-r+1]+f))),o[M]=_}for(let p=s-1;p>=0;p--)for(let y=r-1;y>=0;y--){const M=p*r+y;let _=o[M];y<r-1&&(_=Math.min(_,o[M+1]+1)),p<s-1&&(_=Math.min(_,o[M+r]+1),y<r-1&&(_=Math.min(_,o[M+r+1]+f)),y>0&&(_=Math.min(_,o[M+r-1]+f))),o[M]=_}const m=Math.exp(-t/1.1),v=e*.2%1,g=this.fxData;for(let p=0;p<r*s;p++){const y=a[p];this.trail[p]=Math.max(this.trail[p]*m,y),y>.5&&(this.stamp[p]=v),g[p*4]=Math.min(1,o[p]/48)*255,g[p*4+1]=this.trail[p]*255,g[p*4+2]=this.stamp[p]*255,g[p*4+3]=y*255}this.fxTex.needsUpdate=!0}targets(t,e,n){const s=900/Math.max(e,n),a=Math.max(64,Math.round(e*s)),o=Math.max(64,Math.round(n*s)),c=`${a}x${o}`;if(c===this.sizeKey)return;this.sizeKey=c;for(const p of[...this.rtScene,this.rtB1a,this.rtB1b,this.rtB2a,this.rtB2b,this.rtOld])p?.dispose();this.hist?.dispose();const l=t.extensions,h=l.has("EXT_color_buffer_half_float")||l.has("EXT_color_buffer_float"),u={type:h?Mr:Yn,depthBuffer:!1,magFilter:xe,minFilter:xe};this.bright.uniforms.uThreshold.value=h?.72:.62,this.rtScene=[new rn(a,o,u),new rn(a,o,u)],this.rtOld=new rn(a,o,u);const d=Math.max(16,Math.round(a/4)),f=Math.max(16,Math.round(o/4)),m=Math.max(8,Math.round(a/16)),v=Math.max(8,Math.round(o/16));this.rtB1a=new rn(d,f,u),this.rtB1b=new rn(d,f,u),this.rtB2a=new rn(m,v,u),this.rtB2b=new rn(m,v,u);const g=480/Math.max(e,n);this.hist=new Pp(Math.round(e*g),Math.round(n*g),fo,{depthBuffer:!1}),this.hist.texture.magFilter=xe,this.hist.texture.minFilter=xe,this.scene.uniforms.uHist.value=this.hist.texture,this.material.uniforms.uRes.value.set(a,o)}pass(t,e,n,r=0){this.quad.material=e,t.setRenderTarget(n,r),t.render(this.quadScene,this.cam)}render(t,e,n){this.targets(t,e,n);const r=t.getRenderTarget();this.head=(this.head+1)%fo,this.pass(t,this.cut,this.hist,this.head),this.scene.uniforms.uHead.value=this.head;const s=this.rtScene[this.flip],a=this.rtScene[1-this.flip];this.flip=1-this.flip,this.scene.uniforms.uPrev.value=a.texture,this.pass(t,this.scene,s),this.started=!0;const o=this.material.uniforms;if(this.xfade<1){this.xfade=Math.min(1,this.xfade+this.frameDt/.45);const f=this.scene.uniforms.uPreset.value;this.scene.uniforms.uPreset.value=this.fromCode,this.pass(t,this.scene,this.rtOld),this.scene.uniforms.uPreset.value=f,o.uOld.value=this.rtOld.texture}const c=this.xfade;o.uMix.value=c*c*(3-2*c);const l=this.bright.uniforms,h=this.blur.uniforms;l.uSrc.value=s.texture,l.uTexel.value.set(1/s.width,1/s.height),this.pass(t,this.bright,this.rtB1a);const u=(f,m,v)=>{for(let g=0;g<v;g++)h.uSrc.value=f.texture,h.uDir.value.set(1.4/f.width,0),this.pass(t,this.blur,m),h.uSrc.value=m.texture,h.uDir.value.set(0,1.4/f.height),this.pass(t,this.blur,f)};u(this.rtB1a,this.rtB1b,1),l.uSrc.value=this.rtB1a.texture,l.uTexel.value.set(1/this.rtB1a.width,1/this.rtB1a.height);const d=l.uThreshold.value;l.uThreshold.value=0,this.pass(t,this.bright,this.rtB2a),l.uThreshold.value=d,u(this.rtB2a,this.rtB2b,2),t.setRenderTarget(r),o.uScene.value=s.texture,o.uBloom1.value=this.rtB1a.texture,o.uBloom2.value=this.rtB2a.texture}}class Ly{env=0;level=0;stream=null;ctx=null;an=null;buf=new Uint8Array(0);avg=0;last=0;get on(){return!!this.an}async start(){if(this.an)return;this.stream=await navigator.mediaDevices.getUserMedia({audio:{echoCancellation:!1,noiseSuppression:!1,autoGainControl:!1}});const t=window.AudioContext??window.webkitAudioContext;this.ctx=new t,await this.ctx.resume();const e=this.ctx.createMediaStreamSource(this.stream);this.an=this.ctx.createAnalyser(),this.an.fftSize=1024,this.an.smoothingTimeConstant=0,e.connect(this.an),this.buf=new Uint8Array(this.an.frequencyBinCount)}stop(){for(const t of this.stream?.getTracks()??[])t.stop();this.ctx?.close(),this.stream=null,this.ctx=null,this.an=null,this.env=0,this.level=0}update(t,e){if(this.env*=Math.exp(-t/.18),!this.an||!this.ctx)return;this.an.getByteFrequencyData(this.buf);const n=this.ctx.sampleRate/this.an.fftSize,r=Math.max(1,Math.floor(40/n)),s=Math.max(r+1,Math.ceil(160/n));let a=0;for(let c=r;c<=s;c++)a+=this.buf[c];const o=a/((s-r+1)*255);this.level+=(o-this.level)*Math.min(1,t/.1),this.avg+=(o-this.avg)*Math.min(1,t/1.2),o>this.avg*1.3+.04&&o>.22&&e-this.last>260&&(this.env=1,this.last=e)}}class Py{up=null;listening=!1;async enable(){const t=window.DeviceOrientationEvent;try{if(t?.requestPermission&&await t.requestPermission()!=="granted")return!1}catch{return!1}return this.listening||(this.listening=!0,window.addEventListener("deviceorientation",e=>{if(e.beta===null||e.gamma===null)return;const n=es.degToRad(e.beta),r=es.degToRad(e.gamma);(this.up??=new N).set(-Math.sin(r)*Math.cos(n),Math.sin(n),Math.cos(r)*Math.cos(n)).normalize()})),!0}upInCamera(t){if(!this.up)return null;const e=es.degToRad(screen.orientation?.angle??window.orientation??0),n=this.up.clone().applyAxisAngle(new N(0,0,1),-e);return t==="user"&&(n.x=-n.x,n.z=-n.z),n}}const Mn={tauJaw:.05,tauBlink:.04,tauShape:.1,tauPlace:.05,forgetMs:400};class Dy{lm=null;lastTs=-1;inferMs=0;async load(t){const n=await _f(()=>import("./vision_bundle-Bk4VIwNi.js"),[],import.meta.url),r=await n.FilesetResolver.forVisionTasks("./mediapipe"),s=a=>n.FaceLandmarker.createFromOptions(r,{baseOptions:{modelAssetPath:"./models/face_landmarker.task",delegate:a},runningMode:"VIDEO",numFaces:t,outputFaceBlendshapes:!0,minFaceDetectionConfidence:.4,minFacePresenceConfidence:.4,minTrackingConfidence:.4});try{this.lm=await s("GPU")}catch{this.lm=await s("CPU")}}async setFaces(t){await this.lm?.setOptions({numFaces:t})}detect(t,e){if(!this.lm)return[];e<=this.lastTs&&(e=this.lastTs+1),this.lastTs=e;const n=performance.now(),r=this.lm.detectForVideo(t,e);return this.inferMs=performance.now()-n,r.faceLandmarks.map((s,a)=>{const o=new Map;for(const c of r.faceBlendshapes[a]?.categories??[])o.set(c.categoryName,c.score);return{pts:s,shapes:o}})}close(){this.lm?.close(),this.lm=null}}const Un=(i,t,e,n)=>i+(t-i)*(1-Math.exp(-e/n)),_l=(i,t)=>({x:(i.x+t.x)/2,y:(i.y+t.y)/2}),Qs=(i,t,e)=>Math.hypot((i.x-t.x)*e,i.y-t.y);function Iy(i,t){const e=i.pts,n=(s,a)=>({..._l(e[s],e[a]),r:Qs(e[s],e[a],t)*.62/t}),r=s=>i.shapes.get(s)??0;return{eyes:[n(263,362),n(33,133)],mouth:{..._l(e[13],e[14]),w:Qs(e[61],e[291],t)/t},nose:e[1],jaw:Math.min(1,r("jawOpen")*1.4),blinkL:r("eyeBlinkLeft"),blinkR:r("eyeBlinkRight"),smile:(r("mouthSmileLeft")+r("mouthSmileRight"))/2,pucker:r("mouthPucker"),browUp:r("browInnerUp")}}function Uy(i,t){const e=i.image,n=Qs(e[O.eyeL],e[O.eyeR],t)*.3/t;return{eyes:[{x:e[O.eyeL].x,y:e[O.eyeL].y,r:n},{x:e[O.eyeR].x,y:e[O.eyeR].y,r:n}],mouth:{..._l(e[O.mouthL],e[O.mouthR]),w:Qs(e[O.mouthL],e[O.mouthR],t)/t}}}function Ny(i,t,e,n,r){const s=(t??[]).map(o=>Iy(o,e)),a=new Set;for(const o of i){if(o.lost)continue;const c=o.image[O.nose];let l=-1,h=1/0;s.forEach((v,g)=>{if(a.has(g))return;const p=Qs(v.nose,c,e),y=Math.max(v.mouth.w*3,.03);p<y*1.5&&p<h&&(h=p,l=g)});const u=l>=0?s[l]:null;l>=0&&a.add(l);const d=u??Uy(o,e);let f=o.face;f||(f=o.face={jaw:0,blinkL:0,blinkR:0,smile:0,pucker:0,browUp:0,eyes:d.eyes.map(v=>({...v})),mouth:{...d.mouth},read:!!u,seen:n});{const v=[...d.eyes,d.mouth],g=[...f.eyes,f.mouth];let p=0,y=0;v.forEach((M,_)=>{p+=M.x-g[_].x,y+=M.y-g[_].y}),p/=v.length,y/=v.length;for(const M of g)M.x+=p,M.y+=y}d.eyes.forEach((v,g)=>{const p=f.eyes[g];p.x=Un(p.x,v.x,r,Mn.tauPlace),p.y=Un(p.y,v.y,r,Mn.tauPlace),p.r=Un(p.r,v.r,r,Mn.tauPlace*3)}),f.mouth.x=Un(f.mouth.x,d.mouth.x,r,Mn.tauPlace),f.mouth.y=Un(f.mouth.y,d.mouth.y,r,Mn.tauPlace),f.mouth.w=Un(f.mouth.w,d.mouth.w,r,Mn.tauPlace*3);const m=u??{jaw:0,blinkL:0,blinkR:0,smile:0,pucker:0,browUp:0};f.jaw=Un(f.jaw,m.jaw,r,Mn.tauJaw),f.blinkL=Un(f.blinkL,m.blinkL,r,Mn.tauBlink),f.blinkR=Un(f.blinkR,m.blinkR,r,Mn.tauBlink),f.smile=Un(f.smile,m.smile,r,Mn.tauShape),f.pucker=Un(f.pucker,m.pucker,r,Mn.tauShape),f.browUp=Un(f.browUp,m.browUp,r,Mn.tauShape),u?(f.read=!0,f.seen=n):n-f.seen>Mn.forgetMs&&(f.read=!1)}}const qa={people:2,model:"full",size:1,lens:.85,envLight:!0,shadows:!0,debug:!1,mode:"one",costume:"jimothy",scene:"costume",effect:"insitu",partyCostumes:"behind",music:!1,faces:!0,googly:!1,breath:!0,partyCast:"skeleton",v:3},jd="costuma26.settings";function Fy(){try{const i=JSON.parse(localStorage.getItem(jd)??"{}"),t=i.v??(Object.keys(i).length?1:qa.v),e={...qa,...i},n=e.partyCostumes;return n===!0?e.partyCostumes="on":n!=="behind"&&n!=="on"&&(e.partyCostumes="off"),t<2&&(e.effect="insitu",e.partyCostumes="behind",e.partyCast="skeleton"),t<3&&(e.model="full"),e.costume==="valkyrie"&&(e.costume="violet"),e.partyCast==="valkyrie"&&(e.partyCast="violet"),e.v=qa.v,e}catch{return{...qa}}}function Oy(i){try{localStorage.setItem(jd,JSON.stringify(i))}catch{}}const Ya=i=>`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${i}</svg>`,Bi={qr:Ya('<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><path d="M14 14h3v3h-3zM20 14v.01M14 20h.01M17 20h4v-3"/>'),flip:Ya('<path d="M4 7h3l2-3h6l2 3h3a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1z"/><path d="M9 13a3 3 0 0 1 5-2.2M15 13a3 3 0 0 1-5 2.2"/><path d="M14 9v2h-2M10 17v-2h2"/>'),gear:Ya('<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/>'),camera:Ya('<path d="M4 8h3l2-3h6l2 3h3a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1z"/><circle cx="12" cy="13" r="3.5"/>'),googly:'<svg viewBox="0 0 24 24"><circle cx="7.5" cy="12" r="5.5" fill="#fff" stroke="currentColor" stroke-width="1.5"/><circle cx="16.5" cy="12" r="5.5" fill="#fff" stroke="currentColor" stroke-width="1.5"/><circle cx="6.5" cy="14.2" r="2.4" fill="#111"/><circle cx="17.8" cy="13.6" r="2.4" fill="#111"/></svg>',rec:'<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="7" fill="currentColor"/></svg>',stop:'<svg viewBox="0 0 24 24"><rect x="6" y="6" width="12" height="12" rx="2" fill="currentColor"/></svg>'};function By(i){return i&&i.__esModule&&Object.prototype.hasOwnProperty.call(i,"default")?i.default:i}var dc={exports:{}},uf;function ky(){return uf||(uf=1,(function(i,t){var e=(function(){var n=function(w,E){var A=236,R=17,x=w,b=s[E],S=null,T=0,L=null,D=[],U={},B=function(z,W){T=x*4+17,S=(function(k){for(var K=new Array(k),it=0;it<k;it+=1){K[it]=new Array(k);for(var I=0;I<k;I+=1)K[it][I]=null}return K})(T),X(0,0),X(T-7,0),X(0,T-7),ct(),Q(),vt(z,W),x>=7&&ut(z),L==null&&(L=lt(x,b,D)),Et(L,W)},X=function(z,W){for(var k=-1;k<=7;k+=1)if(!(z+k<=-1||T<=z+k))for(var K=-1;K<=7;K+=1)W+K<=-1||T<=W+K||(0<=k&&k<=6&&(K==0||K==6)||0<=K&&K<=6&&(k==0||k==6)||2<=k&&k<=4&&2<=K&&K<=4?S[z+k][W+K]=!0:S[z+k][W+K]=!1)},H=function(){for(var z=0,W=0,k=0;k<8;k+=1){B(!0,k);var K=o.getLostPoint(U);(k==0||z>K)&&(z=K,W=k)}return W},Q=function(){for(var z=8;z<T-8;z+=1)S[z][6]==null&&(S[z][6]=z%2==0);for(var W=8;W<T-8;W+=1)S[6][W]==null&&(S[6][W]=W%2==0)},ct=function(){for(var z=o.getPatternPosition(x),W=0;W<z.length;W+=1)for(var k=0;k<z.length;k+=1){var K=z[W],it=z[k];if(S[K][it]==null)for(var I=-2;I<=2;I+=1)for(var Z=-2;Z<=2;Z+=1)I==-2||I==2||Z==-2||Z==2||I==0&&Z==0?S[K+I][it+Z]=!0:S[K+I][it+Z]=!1}},ut=function(z){for(var W=o.getBCHTypeNumber(x),k=0;k<18;k+=1){var K=!z&&(W>>k&1)==1;S[Math.floor(k/3)][k%3+T-8-3]=K}for(var k=0;k<18;k+=1){var K=!z&&(W>>k&1)==1;S[k%3+T-8-3][Math.floor(k/3)]=K}},vt=function(z,W){for(var k=b<<3|W,K=o.getBCHTypeInfo(k),it=0;it<15;it+=1){var I=!z&&(K>>it&1)==1;it<6?S[it][8]=I:it<8?S[it+1][8]=I:S[T-15+it][8]=I}for(var it=0;it<15;it+=1){var I=!z&&(K>>it&1)==1;it<8?S[8][T-it-1]=I:it<9?S[8][15-it-1+1]=I:S[8][15-it-1]=I}S[T-8][8]=!z},Et=function(z,W){for(var k=-1,K=T-1,it=7,I=0,Z=o.getMaskFunction(W),j=T-1;j>0;j-=2)for(j==6&&(j-=1);;){for(var et=0;et<2;et+=1)if(S[K][j-et]==null){var st=!1;I<z.length&&(st=(z[I]>>>it&1)==1);var ht=Z(K,j-et);ht&&(st=!st),S[K][j-et]=st,it-=1,it==-1&&(I+=1,it=7)}if(K+=k,K<0||T<=K){K-=k,k=-k;break}}},Nt=function(z,W){for(var k=0,K=0,it=0,I=new Array(W.length),Z=new Array(W.length),j=0;j<W.length;j+=1){var et=W[j].dataCount,st=W[j].totalCount-et;K=Math.max(K,et),it=Math.max(it,st),I[j]=new Array(et);for(var ht=0;ht<I[j].length;ht+=1)I[j][ht]=255&z.getBuffer()[ht+k];k+=et;var pt=o.getErrorCorrectPolynomial(st),xt=l(I[j],pt.getLength()-1),Jt=xt.mod(pt);Z[j]=new Array(pt.getLength()-1);for(var ht=0;ht<Z[j].length;ht+=1){var qt=ht+Jt.getLength()-Z[j].length;Z[j][ht]=qt>=0?Jt.getAt(qt):0}}for(var F=0,ht=0;ht<W.length;ht+=1)F+=W[ht].totalCount;for(var C=new Array(F),$=0,ht=0;ht<K;ht+=1)for(var j=0;j<W.length;j+=1)ht<I[j].length&&(C[$]=I[j][ht],$+=1);for(var ht=0;ht<it;ht+=1)for(var j=0;j<W.length;j+=1)ht<Z[j].length&&(C[$]=Z[j][ht],$+=1);return C},lt=function(z,W,k){for(var K=h.getRSBlocks(z,W),it=u(),I=0;I<k.length;I+=1){var Z=k[I];it.put(Z.getMode(),4),it.put(Z.getLength(),o.getLengthInBits(Z.getMode(),z)),Z.write(it)}for(var j=0,I=0;I<K.length;I+=1)j+=K[I].dataCount;if(it.getLengthInBits()>j*8)throw"code length overflow. ("+it.getLengthInBits()+">"+j*8+")";for(it.getLengthInBits()+4<=j*8&&it.put(0,4);it.getLengthInBits()%8!=0;)it.putBit(!1);for(;!(it.getLengthInBits()>=j*8||(it.put(A,8),it.getLengthInBits()>=j*8));)it.put(R,8);return Nt(it,K)};U.addData=function(z,W){W=W||"Byte";var k=null;switch(W){case"Numeric":k=d(z);break;case"Alphanumeric":k=f(z);break;case"Byte":k=m(z);break;case"Kanji":k=v(z);break;default:throw"mode:"+W}D.push(k),L=null},U.isDark=function(z,W){if(z<0||T<=z||W<0||T<=W)throw z+","+W;return S[z][W]},U.getModuleCount=function(){return T},U.make=function(){if(x<1){for(var z=1;z<40;z++){for(var W=h.getRSBlocks(z,b),k=u(),K=0;K<D.length;K++){var it=D[K];k.put(it.getMode(),4),k.put(it.getLength(),o.getLengthInBits(it.getMode(),z)),it.write(k)}for(var I=0,K=0;K<W.length;K++)I+=W[K].dataCount;if(k.getLengthInBits()<=I*8)break}x=z}B(!1,H())},U.createTableTag=function(z,W){z=z||2,W=typeof W>"u"?z*4:W;var k="";k+='<table style="',k+=" border-width: 0px; border-style: none;",k+=" border-collapse: collapse;",k+=" padding: 0px; margin: "+W+"px;",k+='">',k+="<tbody>";for(var K=0;K<U.getModuleCount();K+=1){k+="<tr>";for(var it=0;it<U.getModuleCount();it+=1)k+='<td style="',k+=" border-width: 0px; border-style: none;",k+=" border-collapse: collapse;",k+=" padding: 0px; margin: 0px;",k+=" width: "+z+"px;",k+=" height: "+z+"px;",k+=" background-color: ",k+=U.isDark(K,it)?"#000000":"#ffffff",k+=";",k+='"/>';k+="</tr>"}return k+="</tbody>",k+="</table>",k},U.createSvgTag=function(z,W,k,K){var it={};typeof arguments[0]=="object"&&(it=arguments[0],z=it.cellSize,W=it.margin,k=it.alt,K=it.title),z=z||2,W=typeof W>"u"?z*4:W,k=typeof k=="string"?{text:k}:k||{},k.text=k.text||null,k.id=k.text?k.id||"qrcode-description":null,K=typeof K=="string"?{text:K}:K||{},K.text=K.text||null,K.id=K.text?K.id||"qrcode-title":null;var I=U.getModuleCount()*z+W*2,Z,j,et,st,ht="",pt;for(pt="l"+z+",0 0,"+z+" -"+z+",0 0,-"+z+"z ",ht+='<svg version="1.1" xmlns="http://www.w3.org/2000/svg"',ht+=it.scalable?"":' width="'+I+'px" height="'+I+'px"',ht+=' viewBox="0 0 '+I+" "+I+'" ',ht+=' preserveAspectRatio="xMinYMin meet"',ht+=K.text||k.text?' role="img" aria-labelledby="'+G([K.id,k.id].join(" ").trim())+'"':"",ht+=">",ht+=K.text?'<title id="'+G(K.id)+'">'+G(K.text)+"</title>":"",ht+=k.text?'<description id="'+G(k.id)+'">'+G(k.text)+"</description>":"",ht+='<rect width="100%" height="100%" fill="white" cx="0" cy="0"/>',ht+='<path d="',et=0;et<U.getModuleCount();et+=1)for(st=et*z+W,Z=0;Z<U.getModuleCount();Z+=1)U.isDark(et,Z)&&(j=Z*z+W,ht+="M"+j+","+st+pt);return ht+='" stroke="transparent" fill="black"/>',ht+="</svg>",ht},U.createDataURL=function(z,W){z=z||2,W=typeof W>"u"?z*4:W;var k=U.getModuleCount()*z+W*2,K=W,it=k-W;return _(k,k,function(I,Z){if(K<=I&&I<it&&K<=Z&&Z<it){var j=Math.floor((I-K)/z),et=Math.floor((Z-K)/z);return U.isDark(et,j)?0:1}else return 1})},U.createImgTag=function(z,W,k){z=z||2,W=typeof W>"u"?z*4:W;var K=U.getModuleCount()*z+W*2,it="";return it+="<img",it+=' src="',it+=U.createDataURL(z,W),it+='"',it+=' width="',it+=K,it+='"',it+=' height="',it+=K,it+='"',k&&(it+=' alt="',it+=G(k),it+='"'),it+="/>",it};var G=function(z){for(var W="",k=0;k<z.length;k+=1){var K=z.charAt(k);switch(K){case"<":W+="&lt;";break;case">":W+="&gt;";break;case"&":W+="&amp;";break;case'"':W+="&quot;";break;default:W+=K;break}}return W},J=function(z){var W=1;z=typeof z>"u"?W*2:z;var k=U.getModuleCount()*W+z*2,K=z,it=k-z,I,Z,j,et,st,ht={"██":"█","█ ":"▀"," █":"▄","  ":" "},pt={"██":"▀","█ ":"▀"," █":" ","  ":" "},xt="";for(I=0;I<k;I+=2){for(j=Math.floor((I-K)/W),et=Math.floor((I+1-K)/W),Z=0;Z<k;Z+=1)st="█",K<=Z&&Z<it&&K<=I&&I<it&&U.isDark(j,Math.floor((Z-K)/W))&&(st=" "),K<=Z&&Z<it&&K<=I+1&&I+1<it&&U.isDark(et,Math.floor((Z-K)/W))?st+=" ":st+="█",xt+=z<1&&I+1>=it?pt[st]:ht[st];xt+=`
`}return k%2&&z>0?xt.substring(0,xt.length-k-1)+Array(k+1).join("▀"):xt.substring(0,xt.length-1)};return U.createASCII=function(z,W){if(z=z||1,z<2)return J(W);z-=1,W=typeof W>"u"?z*2:W;var k=U.getModuleCount()*z+W*2,K=W,it=k-W,I,Z,j,et,st=Array(z+1).join("██"),ht=Array(z+1).join("  "),pt="",xt="";for(I=0;I<k;I+=1){for(j=Math.floor((I-K)/z),xt="",Z=0;Z<k;Z+=1)et=1,K<=Z&&Z<it&&K<=I&&I<it&&U.isDark(j,Math.floor((Z-K)/z))&&(et=0),xt+=et?st:ht;for(j=0;j<z;j+=1)pt+=xt+`
`}return pt.substring(0,pt.length-1)},U.renderTo2dContext=function(z,W){W=W||2;for(var k=U.getModuleCount(),K=0;K<k;K++)for(var it=0;it<k;it++)z.fillStyle=U.isDark(K,it)?"black":"white",z.fillRect(K*W,it*W,W,W)},U};n.stringToBytesFuncs={default:function(w){for(var E=[],A=0;A<w.length;A+=1){var R=w.charCodeAt(A);E.push(R&255)}return E}},n.stringToBytes=n.stringToBytesFuncs.default,n.createStringToBytes=function(w,E){var A=(function(){for(var x=y(w),b=function(){var Q=x.read();if(Q==-1)throw"eof";return Q},S=0,T={};;){var L=x.read();if(L==-1)break;var D=b(),U=b(),B=b(),X=String.fromCharCode(L<<8|D),H=U<<8|B;T[X]=H,S+=1}if(S!=E)throw S+" != "+E;return T})(),R=63;return function(x){for(var b=[],S=0;S<x.length;S+=1){var T=x.charCodeAt(S);if(T<128)b.push(T);else{var L=A[x.charAt(S)];typeof L=="number"?(L&255)==L?b.push(L):(b.push(L>>>8),b.push(L&255)):b.push(R)}}return b}};var r={MODE_NUMBER:1,MODE_ALPHA_NUM:2,MODE_8BIT_BYTE:4,MODE_KANJI:8},s={L:1,M:0,Q:3,H:2},a={PATTERN000:0,PATTERN001:1,PATTERN010:2,PATTERN011:3,PATTERN100:4,PATTERN101:5,PATTERN110:6,PATTERN111:7},o=(function(){var w=[[],[6,18],[6,22],[6,26],[6,30],[6,34],[6,22,38],[6,24,42],[6,26,46],[6,28,50],[6,30,54],[6,32,58],[6,34,62],[6,26,46,66],[6,26,48,70],[6,26,50,74],[6,30,54,78],[6,30,56,82],[6,30,58,86],[6,34,62,90],[6,28,50,72,94],[6,26,50,74,98],[6,30,54,78,102],[6,28,54,80,106],[6,32,58,84,110],[6,30,58,86,114],[6,34,62,90,118],[6,26,50,74,98,122],[6,30,54,78,102,126],[6,26,52,78,104,130],[6,30,56,82,108,134],[6,34,60,86,112,138],[6,30,58,86,114,142],[6,34,62,90,118,146],[6,30,54,78,102,126,150],[6,24,50,76,102,128,154],[6,28,54,80,106,132,158],[6,32,58,84,110,136,162],[6,26,54,82,110,138,166],[6,30,58,86,114,142,170]],E=1335,A=7973,R=21522,x={},b=function(S){for(var T=0;S!=0;)T+=1,S>>>=1;return T};return x.getBCHTypeInfo=function(S){for(var T=S<<10;b(T)-b(E)>=0;)T^=E<<b(T)-b(E);return(S<<10|T)^R},x.getBCHTypeNumber=function(S){for(var T=S<<12;b(T)-b(A)>=0;)T^=A<<b(T)-b(A);return S<<12|T},x.getPatternPosition=function(S){return w[S-1]},x.getMaskFunction=function(S){switch(S){case a.PATTERN000:return function(T,L){return(T+L)%2==0};case a.PATTERN001:return function(T,L){return T%2==0};case a.PATTERN010:return function(T,L){return L%3==0};case a.PATTERN011:return function(T,L){return(T+L)%3==0};case a.PATTERN100:return function(T,L){return(Math.floor(T/2)+Math.floor(L/3))%2==0};case a.PATTERN101:return function(T,L){return T*L%2+T*L%3==0};case a.PATTERN110:return function(T,L){return(T*L%2+T*L%3)%2==0};case a.PATTERN111:return function(T,L){return(T*L%3+(T+L)%2)%2==0};default:throw"bad maskPattern:"+S}},x.getErrorCorrectPolynomial=function(S){for(var T=l([1],0),L=0;L<S;L+=1)T=T.multiply(l([1,c.gexp(L)],0));return T},x.getLengthInBits=function(S,T){if(1<=T&&T<10)switch(S){case r.MODE_NUMBER:return 10;case r.MODE_ALPHA_NUM:return 9;case r.MODE_8BIT_BYTE:return 8;case r.MODE_KANJI:return 8;default:throw"mode:"+S}else if(T<27)switch(S){case r.MODE_NUMBER:return 12;case r.MODE_ALPHA_NUM:return 11;case r.MODE_8BIT_BYTE:return 16;case r.MODE_KANJI:return 10;default:throw"mode:"+S}else if(T<41)switch(S){case r.MODE_NUMBER:return 14;case r.MODE_ALPHA_NUM:return 13;case r.MODE_8BIT_BYTE:return 16;case r.MODE_KANJI:return 12;default:throw"mode:"+S}else throw"type:"+T},x.getLostPoint=function(S){for(var T=S.getModuleCount(),L=0,D=0;D<T;D+=1)for(var U=0;U<T;U+=1){for(var B=0,X=S.isDark(D,U),H=-1;H<=1;H+=1)if(!(D+H<0||T<=D+H))for(var Q=-1;Q<=1;Q+=1)U+Q<0||T<=U+Q||H==0&&Q==0||X==S.isDark(D+H,U+Q)&&(B+=1);B>5&&(L+=3+B-5)}for(var D=0;D<T-1;D+=1)for(var U=0;U<T-1;U+=1){var ct=0;S.isDark(D,U)&&(ct+=1),S.isDark(D+1,U)&&(ct+=1),S.isDark(D,U+1)&&(ct+=1),S.isDark(D+1,U+1)&&(ct+=1),(ct==0||ct==4)&&(L+=3)}for(var D=0;D<T;D+=1)for(var U=0;U<T-6;U+=1)S.isDark(D,U)&&!S.isDark(D,U+1)&&S.isDark(D,U+2)&&S.isDark(D,U+3)&&S.isDark(D,U+4)&&!S.isDark(D,U+5)&&S.isDark(D,U+6)&&(L+=40);for(var U=0;U<T;U+=1)for(var D=0;D<T-6;D+=1)S.isDark(D,U)&&!S.isDark(D+1,U)&&S.isDark(D+2,U)&&S.isDark(D+3,U)&&S.isDark(D+4,U)&&!S.isDark(D+5,U)&&S.isDark(D+6,U)&&(L+=40);for(var ut=0,U=0;U<T;U+=1)for(var D=0;D<T;D+=1)S.isDark(D,U)&&(ut+=1);var vt=Math.abs(100*ut/T/T-50)/5;return L+=vt*10,L},x})(),c=(function(){for(var w=new Array(256),E=new Array(256),A=0;A<8;A+=1)w[A]=1<<A;for(var A=8;A<256;A+=1)w[A]=w[A-4]^w[A-5]^w[A-6]^w[A-8];for(var A=0;A<255;A+=1)E[w[A]]=A;var R={};return R.glog=function(x){if(x<1)throw"glog("+x+")";return E[x]},R.gexp=function(x){for(;x<0;)x+=255;for(;x>=256;)x-=255;return w[x]},R})();function l(w,E){if(typeof w.length>"u")throw w.length+"/"+E;var A=(function(){for(var x=0;x<w.length&&w[x]==0;)x+=1;for(var b=new Array(w.length-x+E),S=0;S<w.length-x;S+=1)b[S]=w[S+x];return b})(),R={};return R.getAt=function(x){return A[x]},R.getLength=function(){return A.length},R.multiply=function(x){for(var b=new Array(R.getLength()+x.getLength()-1),S=0;S<R.getLength();S+=1)for(var T=0;T<x.getLength();T+=1)b[S+T]^=c.gexp(c.glog(R.getAt(S))+c.glog(x.getAt(T)));return l(b,0)},R.mod=function(x){if(R.getLength()-x.getLength()<0)return R;for(var b=c.glog(R.getAt(0))-c.glog(x.getAt(0)),S=new Array(R.getLength()),T=0;T<R.getLength();T+=1)S[T]=R.getAt(T);for(var T=0;T<x.getLength();T+=1)S[T]^=c.gexp(c.glog(x.getAt(T))+b);return l(S,0).mod(x)},R}var h=(function(){var w=[[1,26,19],[1,26,16],[1,26,13],[1,26,9],[1,44,34],[1,44,28],[1,44,22],[1,44,16],[1,70,55],[1,70,44],[2,35,17],[2,35,13],[1,100,80],[2,50,32],[2,50,24],[4,25,9],[1,134,108],[2,67,43],[2,33,15,2,34,16],[2,33,11,2,34,12],[2,86,68],[4,43,27],[4,43,19],[4,43,15],[2,98,78],[4,49,31],[2,32,14,4,33,15],[4,39,13,1,40,14],[2,121,97],[2,60,38,2,61,39],[4,40,18,2,41,19],[4,40,14,2,41,15],[2,146,116],[3,58,36,2,59,37],[4,36,16,4,37,17],[4,36,12,4,37,13],[2,86,68,2,87,69],[4,69,43,1,70,44],[6,43,19,2,44,20],[6,43,15,2,44,16],[4,101,81],[1,80,50,4,81,51],[4,50,22,4,51,23],[3,36,12,8,37,13],[2,116,92,2,117,93],[6,58,36,2,59,37],[4,46,20,6,47,21],[7,42,14,4,43,15],[4,133,107],[8,59,37,1,60,38],[8,44,20,4,45,21],[12,33,11,4,34,12],[3,145,115,1,146,116],[4,64,40,5,65,41],[11,36,16,5,37,17],[11,36,12,5,37,13],[5,109,87,1,110,88],[5,65,41,5,66,42],[5,54,24,7,55,25],[11,36,12,7,37,13],[5,122,98,1,123,99],[7,73,45,3,74,46],[15,43,19,2,44,20],[3,45,15,13,46,16],[1,135,107,5,136,108],[10,74,46,1,75,47],[1,50,22,15,51,23],[2,42,14,17,43,15],[5,150,120,1,151,121],[9,69,43,4,70,44],[17,50,22,1,51,23],[2,42,14,19,43,15],[3,141,113,4,142,114],[3,70,44,11,71,45],[17,47,21,4,48,22],[9,39,13,16,40,14],[3,135,107,5,136,108],[3,67,41,13,68,42],[15,54,24,5,55,25],[15,43,15,10,44,16],[4,144,116,4,145,117],[17,68,42],[17,50,22,6,51,23],[19,46,16,6,47,17],[2,139,111,7,140,112],[17,74,46],[7,54,24,16,55,25],[34,37,13],[4,151,121,5,152,122],[4,75,47,14,76,48],[11,54,24,14,55,25],[16,45,15,14,46,16],[6,147,117,4,148,118],[6,73,45,14,74,46],[11,54,24,16,55,25],[30,46,16,2,47,17],[8,132,106,4,133,107],[8,75,47,13,76,48],[7,54,24,22,55,25],[22,45,15,13,46,16],[10,142,114,2,143,115],[19,74,46,4,75,47],[28,50,22,6,51,23],[33,46,16,4,47,17],[8,152,122,4,153,123],[22,73,45,3,74,46],[8,53,23,26,54,24],[12,45,15,28,46,16],[3,147,117,10,148,118],[3,73,45,23,74,46],[4,54,24,31,55,25],[11,45,15,31,46,16],[7,146,116,7,147,117],[21,73,45,7,74,46],[1,53,23,37,54,24],[19,45,15,26,46,16],[5,145,115,10,146,116],[19,75,47,10,76,48],[15,54,24,25,55,25],[23,45,15,25,46,16],[13,145,115,3,146,116],[2,74,46,29,75,47],[42,54,24,1,55,25],[23,45,15,28,46,16],[17,145,115],[10,74,46,23,75,47],[10,54,24,35,55,25],[19,45,15,35,46,16],[17,145,115,1,146,116],[14,74,46,21,75,47],[29,54,24,19,55,25],[11,45,15,46,46,16],[13,145,115,6,146,116],[14,74,46,23,75,47],[44,54,24,7,55,25],[59,46,16,1,47,17],[12,151,121,7,152,122],[12,75,47,26,76,48],[39,54,24,14,55,25],[22,45,15,41,46,16],[6,151,121,14,152,122],[6,75,47,34,76,48],[46,54,24,10,55,25],[2,45,15,64,46,16],[17,152,122,4,153,123],[29,74,46,14,75,47],[49,54,24,10,55,25],[24,45,15,46,46,16],[4,152,122,18,153,123],[13,74,46,32,75,47],[48,54,24,14,55,25],[42,45,15,32,46,16],[20,147,117,4,148,118],[40,75,47,7,76,48],[43,54,24,22,55,25],[10,45,15,67,46,16],[19,148,118,6,149,119],[18,75,47,31,76,48],[34,54,24,34,55,25],[20,45,15,61,46,16]],E=function(x,b){var S={};return S.totalCount=x,S.dataCount=b,S},A={},R=function(x,b){switch(b){case s.L:return w[(x-1)*4+0];case s.M:return w[(x-1)*4+1];case s.Q:return w[(x-1)*4+2];case s.H:return w[(x-1)*4+3];default:return}};return A.getRSBlocks=function(x,b){var S=R(x,b);if(typeof S>"u")throw"bad rs block @ typeNumber:"+x+"/errorCorrectionLevel:"+b;for(var T=S.length/3,L=[],D=0;D<T;D+=1)for(var U=S[D*3+0],B=S[D*3+1],X=S[D*3+2],H=0;H<U;H+=1)L.push(E(B,X));return L},A})(),u=function(){var w=[],E=0,A={};return A.getBuffer=function(){return w},A.getAt=function(R){var x=Math.floor(R/8);return(w[x]>>>7-R%8&1)==1},A.put=function(R,x){for(var b=0;b<x;b+=1)A.putBit((R>>>x-b-1&1)==1)},A.getLengthInBits=function(){return E},A.putBit=function(R){var x=Math.floor(E/8);w.length<=x&&w.push(0),R&&(w[x]|=128>>>E%8),E+=1},A},d=function(w){var E=r.MODE_NUMBER,A=w,R={};R.getMode=function(){return E},R.getLength=function(S){return A.length},R.write=function(S){for(var T=A,L=0;L+2<T.length;)S.put(x(T.substring(L,L+3)),10),L+=3;L<T.length&&(T.length-L==1?S.put(x(T.substring(L,L+1)),4):T.length-L==2&&S.put(x(T.substring(L,L+2)),7))};var x=function(S){for(var T=0,L=0;L<S.length;L+=1)T=T*10+b(S.charAt(L));return T},b=function(S){if("0"<=S&&S<="9")return S.charCodeAt(0)-48;throw"illegal char :"+S};return R},f=function(w){var E=r.MODE_ALPHA_NUM,A=w,R={};R.getMode=function(){return E},R.getLength=function(b){return A.length},R.write=function(b){for(var S=A,T=0;T+1<S.length;)b.put(x(S.charAt(T))*45+x(S.charAt(T+1)),11),T+=2;T<S.length&&b.put(x(S.charAt(T)),6)};var x=function(b){if("0"<=b&&b<="9")return b.charCodeAt(0)-48;if("A"<=b&&b<="Z")return b.charCodeAt(0)-65+10;switch(b){case" ":return 36;case"$":return 37;case"%":return 38;case"*":return 39;case"+":return 40;case"-":return 41;case".":return 42;case"/":return 43;case":":return 44;default:throw"illegal char :"+b}};return R},m=function(w){var E=r.MODE_8BIT_BYTE,A=n.stringToBytes(w),R={};return R.getMode=function(){return E},R.getLength=function(x){return A.length},R.write=function(x){for(var b=0;b<A.length;b+=1)x.put(A[b],8)},R},v=function(w){var E=r.MODE_KANJI,A=n.stringToBytesFuncs.SJIS;if(!A)throw"sjis not supported.";(function(b,S){var T=A(b);if(T.length!=2||(T[0]<<8|T[1])!=S)throw"sjis not supported."})("友",38726);var R=A(w),x={};return x.getMode=function(){return E},x.getLength=function(b){return~~(R.length/2)},x.write=function(b){for(var S=R,T=0;T+1<S.length;){var L=(255&S[T])<<8|255&S[T+1];if(33088<=L&&L<=40956)L-=33088;else if(57408<=L&&L<=60351)L-=49472;else throw"illegal char at "+(T+1)+"/"+L;L=(L>>>8&255)*192+(L&255),b.put(L,13),T+=2}if(T<S.length)throw"illegal char at "+(T+1)},x},g=function(){var w=[],E={};return E.writeByte=function(A){w.push(A&255)},E.writeShort=function(A){E.writeByte(A),E.writeByte(A>>>8)},E.writeBytes=function(A,R,x){R=R||0,x=x||A.length;for(var b=0;b<x;b+=1)E.writeByte(A[b+R])},E.writeString=function(A){for(var R=0;R<A.length;R+=1)E.writeByte(A.charCodeAt(R))},E.toByteArray=function(){return w},E.toString=function(){var A="";A+="[";for(var R=0;R<w.length;R+=1)R>0&&(A+=","),A+=w[R];return A+="]",A},E},p=function(){var w=0,E=0,A=0,R="",x={},b=function(T){R+=String.fromCharCode(S(T&63))},S=function(T){if(!(T<0)){if(T<26)return 65+T;if(T<52)return 97+(T-26);if(T<62)return 48+(T-52);if(T==62)return 43;if(T==63)return 47}throw"n:"+T};return x.writeByte=function(T){for(w=w<<8|T&255,E+=8,A+=1;E>=6;)b(w>>>E-6),E-=6},x.flush=function(){if(E>0&&(b(w<<6-E),w=0,E=0),A%3!=0)for(var T=3-A%3,L=0;L<T;L+=1)R+="="},x.toString=function(){return R},x},y=function(w){var E=w,A=0,R=0,x=0,b={};b.read=function(){for(;x<8;){if(A>=E.length){if(x==0)return-1;throw"unexpected end of file./"+x}var T=E.charAt(A);if(A+=1,T=="=")return x=0,-1;if(T.match(/^\s$/))continue;R=R<<6|S(T.charCodeAt(0)),x+=6}var L=R>>>x-8&255;return x-=8,L};var S=function(T){if(65<=T&&T<=90)return T-65;if(97<=T&&T<=122)return T-97+26;if(48<=T&&T<=57)return T-48+52;if(T==43)return 62;if(T==47)return 63;throw"c:"+T};return b},M=function(w,E){var A=w,R=E,x=new Array(w*E),b={};b.setPixel=function(D,U,B){x[U*A+D]=B},b.write=function(D){D.writeString("GIF87a"),D.writeShort(A),D.writeShort(R),D.writeByte(128),D.writeByte(0),D.writeByte(0),D.writeByte(0),D.writeByte(0),D.writeByte(0),D.writeByte(255),D.writeByte(255),D.writeByte(255),D.writeString(","),D.writeShort(0),D.writeShort(0),D.writeShort(A),D.writeShort(R),D.writeByte(0);var U=2,B=T(U);D.writeByte(U);for(var X=0;B.length-X>255;)D.writeByte(255),D.writeBytes(B,X,255),X+=255;D.writeByte(B.length-X),D.writeBytes(B,X,B.length-X),D.writeByte(0),D.writeString(";")};var S=function(D){var U=D,B=0,X=0,H={};return H.write=function(Q,ct){if(Q>>>ct)throw"length over";for(;B+ct>=8;)U.writeByte(255&(Q<<B|X)),ct-=8-B,Q>>>=8-B,X=0,B=0;X=Q<<B|X,B=B+ct},H.flush=function(){B>0&&U.writeByte(X)},H},T=function(D){for(var U=1<<D,B=(1<<D)+1,X=D+1,H=L(),Q=0;Q<U;Q+=1)H.add(String.fromCharCode(Q));H.add(String.fromCharCode(U)),H.add(String.fromCharCode(B));var ct=g(),ut=S(ct);ut.write(U,X);var vt=0,Et=String.fromCharCode(x[vt]);for(vt+=1;vt<x.length;){var Nt=String.fromCharCode(x[vt]);vt+=1,H.contains(Et+Nt)?Et=Et+Nt:(ut.write(H.indexOf(Et),X),H.size()<4095&&(H.size()==1<<X&&(X+=1),H.add(Et+Nt)),Et=Nt)}return ut.write(H.indexOf(Et),X),ut.write(B,X),ut.flush(),ct.toByteArray()},L=function(){var D={},U=0,B={};return B.add=function(X){if(B.contains(X))throw"dup key:"+X;D[X]=U,U+=1},B.size=function(){return U},B.indexOf=function(X){return D[X]},B.contains=function(X){return typeof D[X]<"u"},B};return b},_=function(w,E,A){for(var R=M(w,E),x=0;x<E;x+=1)for(var b=0;b<w;b+=1)R.setPixel(b,x,A(b,x));var S=g();R.write(S);for(var T=p(),L=S.toByteArray(),D=0;D<L.length;D+=1)T.writeByte(L[D]);return T.flush(),"data:image/gif;base64,"+T};return n})();(function(){e.stringToBytesFuncs["UTF-8"]=function(n){function r(s){for(var a=[],o=0;o<s.length;o++){var c=s.charCodeAt(o);c<128?a.push(c):c<2048?a.push(192|c>>6,128|c&63):c<55296||c>=57344?a.push(224|c>>12,128|c>>6&63,128|c&63):(o++,c=65536+((c&1023)<<10|s.charCodeAt(o)&1023),a.push(240|c>>18,128|c>>12&63,128|c>>6&63,128|c&63))}return a}return r(n)}})(),(function(n){i.exports=n()})(function(){return e})})(dc)),dc.exports}var zy=ky();const Hy=By(zy);function ks(){return location.origin+location.pathname.replace(/index\.html$/,"")}function Vy(i){const t=Hy(0,"M");return t.addData(i),t.make(),t.createSvgTag({cellSize:8,margin:2,scalable:!0})}async function Gy(i,t){const e=new File([i],t,{type:i.type});if(navigator.canShare?.({files:[e]}))try{return await navigator.share({files:[e],title:"costuma 2026"}),"shared"}catch(r){if(r.name==="AbortError")return"cancelled"}return Jd(i,t),"saved"}function Jd(i,t){const e=document.createElement("a");e.href=URL.createObjectURL(i),e.download=t,document.body.appendChild(e),e.click(),e.remove(),setTimeout(()=>URL.revokeObjectURL(e.href),3e4)}function Wy(){const i=window.MediaRecorder;if(i)return["video/mp4;codecs=avc1","video/mp4","video/webm;codecs=vp9","video/webm;codecs=vp8","video/webm"].find(t=>i.isTypeSupported(t))}const Kt=i=>document.getElementById(i),Xy="./",Re=new URLSearchParams(location.search),th=Re.get("test")==="1",Fn=Number(Re.get("synth")??0),mt=Fy();Re.get("c")&&(mt.costume=Re.get("c"));Je.some(i=>i.id===mt.costume)||(mt.costume=Je[0].id);Re.get("people")&&(mt.people=Number(Re.get("people")));const _i=()=>Oy(mt),Ie=Kt("video"),ta=Kt("stage"),qr=Kt("overlay"),me=qr.getContext("2d"),jt=new by(ta);jt.opts.size=mt.size;jt.opts.shadows=mt.shadows;jt.opts.envLight=mt.envLight;const cn=new Cy(jt.bgUniforms,$d),Hi=new Ly,Zd=new Py;let _r=null,pc=-1;(Re.get("scene")==="party"||Re.get("scene")==="costume")&&(mt.scene=Re.get("scene"));Re.get("fx")&&(mt.effect=Re.get("fx"));Re.get("googly")&&(mt.googly=Re.get("googly")==="1");Re.get("pc")&&(mt.partyCostumes=Re.get("pc")==="behind"?"behind":Re.get("pc")==="1"||Re.get("pc")==="on"?"on":"off");cn.preset=Ti.find(i=>i.id===mt.effect)??Ti[0];const ea=new m0(Ie,Re.get("facing")??void 0);let qn=null;const He=new w0;let sa=!1;const aa=new Map,po=new Map;let Kd=0;function mo(i){const t=aa.get(i);if(t)return t;if(mt.scene==="party")return Je.some(n=>n.id===mt.partyCast)?mt.partyCast:"skeleton";if(mt.mode==="one")return mt.costume;let e=po.get(i);if(!e){const n=Je.findIndex(r=>r.id===mt.costume);e=Je[(n+Kd++)%Je.length].id,po.set(i,e)}return e}const ff=new Set;function yo(i,t=!1){if(jt.hasTemplate(i))return;const e=!ff.has(i);ff.add(i),!t&&e&&Le(`Dressing up as ${Ei(i).name}…`,1800),(e||!t)&&jt.prepare(i,!0).catch(n=>{console.error("build failed",i,n),Le(`${Ei(i).name} failed to build`)})}let df=0;function Le(i,t=1400){const e=Kt("toast");e.textContent=i,e.classList.add("on"),clearTimeout(df),df=window.setTimeout(()=>e.classList.remove("on"),t)}const qy=i=>{const t=Kt("hint");t.textContent=i,t.classList.toggle("on",!!i)},Qd=i=>`${Xy}thumbs/${i}.png`;function t0(){const i=Kt("picker");if(i.innerHTML="",mt.scene==="party"){for(const e of Ti){const n=document.createElement("button");n.className="card fx",n.dataset.id=e.id,n.setAttribute("role","option"),n.innerHTML='<div class="thumb"></div><div class="name"></div>',n.querySelector(".thumb").style.background=e.swatch,n.querySelector(".name").textContent=e.name,n.onclick=()=>eh(e.id),i.appendChild(n)}na();return}const t=(e,n,r="")=>{const s=document.createElement("button");s.className=`card ${r}`,s.dataset.id=e,s.setAttribute("role","option"),s.innerHTML='<div class="thumb"></div><div class="name"></div>',s.querySelector(".name").textContent=n;const a=s.querySelector(".thumb");if(e==="mix")a.textContent="MIX";else{const o=new Image;o.alt="",o.draggable=!1,o.onerror=()=>{o.remove(),a.textContent=n.slice(0,1)},o.src=Qd(e),a.appendChild(o)}s.onclick=()=>e0(e),i.appendChild(s)};t("mix","Mix","mix");for(const e of Je)t(e.id,e.name);na()}function Yy(i){let t=null,e=!1;i.addEventListener("pointerdown",r=>{t={x:r.clientX,left:i.scrollLeft,id:r.pointerId},e=!1}),i.addEventListener("dragstart",r=>r.preventDefault()),i.addEventListener("pointermove",r=>{if(!t||r.pointerId!==t.id)return;const s=r.clientX-t.x;!e&&Math.abs(s)>6&&(e=!0,i.classList.add("dragging")),e&&(i.scrollLeft=t.left-s)});const n=()=>{t=null,i.classList.remove("dragging")};i.addEventListener("pointerup",n),i.addEventListener("pointercancel",n),i.addEventListener("click",r=>{e&&(r.stopPropagation(),r.preventDefault(),e=!1)},!0),i.addEventListener("wheel",r=>{Math.abs(r.deltaY)<=Math.abs(r.deltaX)||(i.scrollLeft+=r.deltaY,r.preventDefault())},{passive:!1})}function na(){for(const i of Kt("picker").querySelectorAll(".card")){const t=mt.scene==="party"?i.dataset.id===mt.effect:mt.mode==="mix"?i.dataset.id==="mix":i.dataset.id===mt.costume;if(i.classList.toggle("on",t),i.setAttribute("aria-selected",String(t)),t){const e=Kt("picker");e.scrollTo({left:i.offsetLeft-(e.clientWidth-i.offsetWidth)/2,behavior:"smooth"})}}}function e0(i){aa.clear(),i==="mix"?(mt.mode="mix",po.clear(),Kd=0,Le("Mix: everyone gets their own")):(mt.mode="one",mt.costume=i,yo(i),jt.hasTemplate(i)&&Le(Ei(i).name,900)),_i(),na()}function eh(i){const t=Ti.find(e=>e.id===i)??Ti[0];mt.effect=t.id,cn.preset=t,_i(),na(),Le(t.name,800)}function pf(i){const t=Kt("dip");t.classList.add("on"),setTimeout(async()=>{try{await i()}finally{requestAnimationFrame(()=>requestAnimationFrame(()=>t.classList.remove("on")))}},190)}function Ml(i){mt.scene=i,_i(),jt.setBackground(i==="party"?cn.material:null),qn?.setOptions({masks:i==="party"});for(const t of document.querySelectorAll(".modes button")){const e=t.dataset.scene===i;t.classList.toggle("on",e),t.setAttribute("aria-selected",String(e))}t0()}function nh(i){Kt(i).classList.remove("hidden")}for(const i of document.querySelectorAll(".modal"))i.addEventListener("click",t=>{(t.target===i||t.target.closest("[data-close]"))&&i.classList.add("hidden")});function mf(){const i=ks();Kt("qr-code").innerHTML=Vy(i),Kt("qr-url").textContent=i,nh("qr")}Kt("btn-copy").onclick=async()=>{try{await navigator.clipboard.writeText(ks()),Le("Link copied")}catch{Le("Could not copy — long-press the link")}};Kt("btn-share-link").onclick=async()=>{if(navigator.share)try{await navigator.share({title:"costuma 2026",text:"Be a 3D costume:",url:ks()})}catch{}else try{await navigator.clipboard.writeText(ks()),Le("Link copied")}catch{Le(ks())}};function $y(){const i=Kt("settings-body");i.innerHTML="";const t=(s,a,o)=>{const c=document.createElement("div");c.className="set";const l=document.createElement("label"),h=document.createElement("span");if(h.textContent=s,a){const u=document.createElement("small");u.textContent=a,h.appendChild(u)}l.append(h,o),c.appendChild(l),i.appendChild(c)},e=(s,a,o)=>{const c=document.createElement("div");c.className="seg";for(const[l,h]of s){const u=document.createElement("button");u.textContent=h,u.classList.toggle("on",a()===l),u.onclick=()=>{o(l),_i();for(const d of c.children)d.classList.remove("on");u.classList.add("on")},c.appendChild(u)}return c},n=(s,a)=>{const o=document.createElement("input");return o.type="checkbox",o.className="switch",o.checked=s(),o.onchange=()=>{a(o.checked),_i()},o},r=(s,a,o,c,l)=>{const h=document.createElement("input");return h.type="range",h.min=String(s),h.max=String(a),h.step=String(o),h.value=String(c()),h.oninput=()=>{l(Number(h.value)),_i()},h};t(mt.scene==="party"?"Subjects":"People",mt.scene==="party"?"How many people to cut out (the nearest)":"How many to dress at once",e([[1,"1"],[2,"2"],[3,"3"],[4,"4"]],()=>mt.people,s=>{mt.people=s,qn?.setOptions({numPoses:s}),_r?.setFaces(s)})),t("Costume size","Bigger hides more of the person",r(.8,1.5,.01,()=>mt.size,s=>{mt.size=s,jt.opts.size=s})),t("Pose model","Accurate is steadier, slower to load and run",e([["lite","Fast"],["full","Accurate"]],()=>mt.model,s=>{mt.model=s,tb()})),t("Light from the camera","The costume is lit by the room it stands in",n(()=>mt.envLight,s=>{mt.envLight=s,jt.opts.envLight=s})),t("Shadows","Off is faster on older phones",n(()=>mt.shadows,s=>{mt.shadows=s,jt.opts.shadows=s})),t("Lens","If costumes look too flat or too deep",r(.55,1.3,.01,()=>mt.lens,s=>{mt.lens=s})),t("React to the music","Listens through the microphone for the beat; clips record the sound",n(()=>mt.music,s=>{mt.music=s,s?Hi.start().then(()=>Le("Listening for the beat",1200)).catch(()=>{mt.music=!1,_i(),Le("No microphone")}):Hi.stop()}));{const s=document.createElement("select");s.className="pick";for(const a of Je){const o=document.createElement("option");o.value=a.id,o.textContent=a.name,s.appendChild(o)}s.value=mt.partyCast,s.onchange=()=>{mt.partyCast=s.value,aa.clear(),_i(),yo(s.value)},t("Party dancers","Who dances behind (or as) you in party mode",s)}t("Costumes in party mode","Behind you: you stay yourself, a pyramid of your costume dances behind you",e([["off","Off"],["behind","Behind"],["on","On you"]],()=>mt.partyCostumes,s=>{mt.partyCostumes=s})),t("Face tracking","Mouths open costumes and breathe sparks; googly eyes find your eyes",n(()=>mt.faces,s=>{mt.faces=s,s&&sh()})),t("Mouth magic","Open your mouth: sparks",n(()=>mt.breath,s=>{mt.breath=s})),t("Show the skeleton","What the pose tracker sees",n(()=>mt.debug,s=>{mt.debug=s}))}let yl=!1,pr=null;function n0(i,t){pr={blob:i,name:t};const e=Kt("preview-media");e.innerHTML="";const n=URL.createObjectURL(i);if(i.type.startsWith("video")){const r=document.createElement("video");r.src=n,r.controls=!0,r.playsInline=!0,r.loop=!0,r.muted=!0,r.play().catch(()=>{}),e.appendChild(r)}else{const r=new Image;r.src=n,e.appendChild(r)}nh("preview")}Kt("btn-share").onclick=async()=>{pr&&await Gy(pr.blob,pr.name)==="saved"&&Le("Saved")};Kt("btn-save").onclick=()=>{pr&&(Jd(pr.blob,pr.name),Le("Saved"))};const i0=()=>new Date().toISOString().slice(0,19).replace(/[:T]/g,"-");let $a=null,gf=0;function jy(){const i=Kt("btn-rec");if($a){$a.stop();return}const t=Wy(),e=ta.captureStream;if(!t||!e){Le("Recording is not supported in this browser");return}const n=[],r=e.call(ta,30);for(const a of Hi.stream?.getAudioTracks()??[])r.addTrack(a);const s=new MediaRecorder(r,{mimeType:t,videoBitsPerSecond:8e6});s.ondataavailable=a=>{a.data.size&&n.push(a.data)},s.onstop=()=>{clearTimeout(gf),$a=null,i.classList.remove("on"),i.innerHTML=Bi.rec;const a=t.split(";")[0];n0(new Blob(n,{type:a}),`costuma-${i0()}.${a.includes("mp4")?"mp4":"webm"}`)},s.start(250),$a=s,i.classList.add("on"),i.innerHTML=Bi.stop,gf=window.setTimeout(()=>s.state==="recording"&&s.stop(),2e4),Le("Recording — tap to stop",1200)}function r0(i){const t=jt.cover,e=i.image,n=(e[O.shL].x+e[O.shR].x+e[O.hipL].x+e[O.hipR].x)/4,r=(e[O.shL].y+e[O.shR].y+e[O.hipL].y+e[O.hipR].y)/4;let s=(n*t.vw-t.ox)*t.s;const a=(r*t.vh-t.oy)*t.s;return t.mirror&&(s=t.cw-s),{x:s,y:a}}ta.addEventListener("click",i=>{if(!sa)return;if(mt.scene==="party"&&mt.partyCostumes==="off"){const a=Ti.findIndex(o=>o.id===mt.effect);eh(Ti[(a+1)%Ti.length].id);return}let t=null,e=1/0;for(const a of He.tracks){if(a.lost)continue;const o=r0(a),c=Math.hypot(o.x-i.clientX,o.y-i.clientY);c<e&&(e=c,t=a)}if(!t||e>Math.max(innerWidth,innerHeight)*.3)return;const n=mo(t.id),r=Je.findIndex(a=>a.id===n),s=Je[(r+1)%Je.length].id;aa.set(t.id,s),yo(s),Le(Ei(s).name,900)});let bl=0,vf=-1,Sl=0,wl=performance.now(),mc=performance.now();const Yr=document.createElement("canvas"),Jy=Yr.getContext("2d");function Zy(){if(mt.scene!=="party")return Ie;const i=Ie.videoWidth||720,t=Ie.videoHeight||1280,e=480/Math.max(i,t),n=Math.round(i*e),r=Math.round(t*e);return(Yr.width!==n||Yr.height!==r)&&(Yr.width=n,Yr.height=r),Jy.drawImage(Ie,0,0,n,r),Yr}let ih=0,gc=performance.now(),vc=0;function rh(){return M0(Ie.videoWidth||720,Ie.videoHeight||1280,mt.lens)}function s0(i){if(requestAnimationFrame(s0),!sa)return;bl++;const t=rh();jt.layout(t,ea.mirrored&&!Fn);let e=null;if(Fn){if(e=P_(Fn,(i-wl)/1e3*(th?0:1)+Number(Re.get("t")??0),t),mt.scene==="party"){const h=t.w/t.h,u=h>=1?240:Math.round(240*h),d=h>=1?Math.round(240/h):240;for(const f of e)f.mask=D_(f,u,d,h)}}else if(qn&&Ie.readyState>=2&&Ie.currentTime!==vf){vf=Ie.currentTime;try{e=qn.detect(Zy(),i)}catch(h){console.error(h)}}if(e&&He.update(e.slice(0,mt.people),i,t),e){let h=null;if(_r&&mt.faces&&!Fn)try{h=_r.detect(Ie,i)}catch(u){console.error(u)}if(Ny(He.tracks,h,t.w/t.h,i,pc<0?1/30:Math.min(.25,(i-pc)/1e3)),pc=i,Fn&&Re.get("jaw"))for(const u of He.tracks)u.face&&(u.face.jaw=Number(Re.get("jaw")))}jt.ground.update(He.tracks,Fn?null:Zd.upInCamera(ea.facing),Math.min(.25,(i-mc)/1e3));const n=mt.scene==="costume"||mt.partyCostumes!=="off";if(n)for(const h of He.tracks)yo(mo(h.id),!0);const r=(i-wl)/1e3,s=Math.min(.25,(i-mc)/1e3);mc=i;const a=n,o=mt.scene==="party",c=o&&mt.partyCostumes==="behind";jt.pyramid=c||o&&mt.partyCostumes==="on"&&cn.preset.id==="pyramid",jt.hideWearers=c,jt.setForeground(c?cn.foreground:null),cn.clones=!jt.pyramid,jt.stageLights(mt.scene==="party"&&cn.preset.id!=="insitu",r,Hi.env);{const h=He.tracks.filter(f=>!f.lost).sort((f,m)=>m.T.z-f.T.z)[0],u=mt.scene==="party"&&cn.preset.id==="insitu",d=jt.stageSpots(u,r,Hi.env,t,h?new N(h.T.x,h.T.y,h.T.z):null);cn.setSpots(d,u?1:0),jt.light.realism=u}jt.setGrain(!0,r),jt.sync(a?He.tracks:[],mo,r),jt.googlyOn=mt.googly&&mt.faces,jt.breathOn=mt.breath&&mt.faces,jt.faces(He.tracks,t,s),Hi.update(s,i),mt.scene==="party"&&(cn.subjects=mt.people,cn.beat=Hi.env,cn.update(He.tracks,s,r,t.w/t.h,jt.ground,t),cn.render(jt.renderer,t.w,t.h)),jt.render(Ie,t,bl),yl&&(yl=!1,ta.toBlob(h=>h&&n0(h,`costuma-${i0()}.jpg`),"image/jpeg",.92)),He.tracks.filter(h=>!h.lost).length&&(Sl=i),qy(i-Sl>2500?"Step back until your head and hips are in view":""),Qy(),vc++,i-gc>1e3&&(ih=vc*1e3/(i-gc),vc=0,gc=i,a0(),Ky())}let ja=0,xf=!1;function Ky(){if(!(th||!sa||He.tracks.length===0)&&(ja=ih<22?ja+1:0,!(ja<3))){if(ja=0,jt.opts.pixelRatio>1.01)jt.opts.pixelRatio=Math.max(1,jt.opts.pixelRatio-.25);else if(jt.opts.shadows)jt.opts.shadows=!1;else return;xf||(xf=!0,Le("Lowering quality to keep up",1500))}}function Qy(){const i=qr.clientWidth,t=qr.clientHeight,e=Math.min(devicePixelRatio||1,2);if(qr.width!==Math.round(i*e)&&(qr.width=Math.round(i*e),qr.height=Math.round(t*e)),me.setTransform(e,0,0,e,0,0),me.clearRect(0,0,i,t),!mt.debug)return;const n=jt.cover,r=s=>{let a=(s.x*n.vw-n.ox)*n.s;return n.mirror&&(a=n.cw-a),[a,(s.y*n.vh-n.oy)*n.s]};{const s=jt.ground,a=rh(),{back:o,side:c}=s.axes(),l=He.tracks.filter(f=>!f.lost).sort((f,m)=>m.T.z-f.T.z)[0],h=s.foot(l?new N(l.T.x,l.T.y,l.T.z):new N(0,0,-3)).addScaledVector(o,-1),u=(f,m)=>h.clone().addScaledVector(c,f).addScaledVector(o,m),d=(f,m)=>{if(f.z>-.2||m.z>-.2)return;const[v,g]=r(os(f,a)),[p,y]=r(os(m,a));me.beginPath(),me.moveTo(v,g),me.lineTo(p,y),me.stroke()};me.strokeStyle="rgba(125, 252, 255, 0.45)",me.lineWidth=1.5;for(let f=-3;f<=3.001;f+=.5)d(u(f,0),u(f,8));for(let f=0;f<=8.001;f+=.5)d(u(-3,f),u(3,f));me.fillStyle="#7dfcff",me.font="600 12px system-ui",me.fillText(`floor: ${s.source}${s.fromFeet?" + feet":""} · camera ${s.cameraHeight.toFixed(2)} m up`,12,n.ch-200)}for(const s of He.tracks){me.globalAlpha=s.presence,me.strokeStyle="#7dfcff",me.lineWidth=3;for(const[o,c]of _0){const l=s.image[o],h=s.image[c];if(Math.min(l.v,h.v)<.4)continue;const[u,d]=r(l),[f,m]=r(h);me.beginPath(),me.moveTo(u,d),me.lineTo(f,m),me.stroke()}me.fillStyle="#ff8a1f";for(const o of s.image){if(o.v<.4)continue;const[c,l]=r(o);me.beginPath(),me.arc(c,l,4,0,Math.PI*2),me.fill()}const a=r0(s);me.fillStyle="#fff",me.font="600 14px system-ui",me.fillText(`#${s.id} ${Ei(mo(s.id)).name} · ${(-s.T.z).toFixed(1)} m`,a.x-40,a.y)}me.globalAlpha=1}function a0(){const i=Kt("readout");if(!i||Kt("settings").classList.contains("hidden"))return;const t=rh();i.textContent=["build 77f3724 · 2026-10-31 21:09Z",`${ih.toFixed(0)} fps · pose ${qn?.inferMs.toFixed(1)??"–"} ms (${qn?.delegate??"–"}, ${mt.model}) · face ${_r?_r.inferMs.toFixed(1)+" ms":mt.faces?"loading":"off"}`,`video ${Ie.videoWidth}×${Ie.videoHeight} · f ${t.f.toFixed(0)} px · ${ea.facing}`,`people ${He.tracks.filter(e=>!e.lost).length} · dressed ${jt.count}`,`pixels ×${jt.opts.pixelRatio.toFixed(2)} · shadows ${jt.opts.shadows?"on":"off"}`,`light mean ${jt.light.mean.toFixed(3)} × ${jt.light.gain.toFixed(2)} · key share ${jt.light.share.toFixed(2)} · every ${yn.every} frames`].join(`
`)}async function tb(){if(Fn)return;const i=qn,t=new Mf(mt.model,mt.people);t.masks=mt.scene==="party",await t.load(e=>Le(e,2500)),qn=t,i?.close(),Le(mt.model==="full"?"Accurate pose model":"Fast pose model",1e3)}async function sh(){if(_r||Fn||!mt.faces)return;const i=new Dy;try{await i.load(mt.people),_r=i}catch(t){console.warn("face model failed",t)}}function eb(){const i=document.createElement("canvas");i.width=720,i.height=1280;const t=i.getContext("2d"),e=()=>{const n=t.createLinearGradient(0,0,0,1280);n.addColorStop(0,"#5a4a63"),n.addColorStop(.62,"#3b3142"),n.addColorStop(.63,"#6b5440"),n.addColorStop(1,"#3a2c22"),t.fillStyle=n,t.fillRect(0,0,720,1280),t.fillStyle="#fff3d6",t.fillRect(40,220,170,330),t.fillStyle="#ffb35a",t.beginPath(),t.arc(600,180,46,0,Math.PI*2),t.fill()};return e(),setInterval(e,500),i.captureStream(30)}async function xc(){const i=Kt("start-status"),t=Kt("btn-start");t.disabled=!0;const e=Fn?Promise.resolve(!1):Zd.enable();try{if(Fn)Ie.srcObject=eb(),await Ie.play().catch(()=>{}),Ie.readyState<2&&await new Promise(r=>Ie.addEventListener("loadeddata",r,{once:!0}));else{if(!navigator.mediaDevices?.getUserMedia)throw new Error(location.protocol!=="https:"?"The camera needs an https:// page.":"This browser has no camera access.");i.textContent="Asking for the camera…",await ea.open(),i.textContent="Loading the pose model…",qn=new Mf(mt.model,mt.people),qn.masks=mt.scene==="party",await qn.load(r=>{i.textContent=r[0].toUpperCase()+r.slice(1)+"…"})}jt.setVideo(Ie),i.textContent=`Dressing up as ${Ei(mt.costume).name}…`,await new Promise(r=>setTimeout(r,30));const n=mt.mode==="one"?mt.costume:Je[0].id;await jt.prepare(n,!0);for(const r of Je)jt.prepare(r.id);sh(),Kt("start").classList.add("hidden"),Kt("hud").classList.remove("hidden"),Ml(mt.scene),sa=!0,wl=performance.now(),Sl=performance.now(),na()}catch(n){console.error(n);const r=n;i.textContent=r.name==="NotAllowedError"?"Camera permission was refused. Allow it in the browser settings and try again.":`Could not start: ${r.message}`,t.disabled=!1}}function nb(){Kt("btn-googly").innerHTML=Bi.googly;const i=()=>Kt("btn-googly").setAttribute("aria-pressed",String(mt.googly));i(),Kt("btn-googly").onclick=()=>{mt.googly=!mt.googly,mt.googly&&!mt.faces&&(mt.faces=!0,sh()),_i(),i(),Le(mt.googly?"Googly eyes":"No googly eyes",800)},Kt("btn-qr").innerHTML=Bi.qr,Kt("btn-flip").innerHTML=Bi.flip,Kt("btn-gear").innerHTML=Bi.gear,Kt("btn-snap").innerHTML=Bi.camera,Kt("btn-rec").innerHTML=Bi.rec,Kt("btn-start").onclick=()=>void xc(),Kt("btn-start-qr").onclick=mf,Kt("btn-qr").onclick=mf,Kt("btn-gear").onclick=()=>{$y(),nh("settings"),a0()},Kt("btn-flip").onclick=async()=>{Fn||pf(async()=>{try{await ea.flip(),jt.setVideo(Ie),He.clear(),aa.clear(),po.clear()}catch(n){Le(`Camera: ${n.message}`)}})},Kt("btn-snap").onclick=()=>{yl=!0;const n=Kt("stage");n.style.filter="brightness(1.8)",setTimeout(()=>n.style.filter="",120)},Kt("btn-rec").onclick=jy;for(const n of document.querySelectorAll(".modes button"))n.onclick=()=>{n.dataset.scene!==mt.scene&&pf(()=>Ml(n.dataset.scene))};const t=Kt("start-cast");for(const n of Je.slice(0,6)){const r=new Image;r.src=Qd(n.id),r.alt=n.name,r.onerror=()=>r.remove(),t.appendChild(r)}t0(),Yy(Kt("picker")),requestAnimationFrame(s0);const e=window;e.__costuma={stage:jt,tracker:He,settings:mt,start:xc,choose:e0,party:cn,beat:Hi,setScene:Ml,chooseEffect:eh,get started(){return sa},get frame(){return bl},LIGHT_TUNE:yn},th&&Fn&&xc()}nb();
