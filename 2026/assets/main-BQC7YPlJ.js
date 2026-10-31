(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))n(r);new MutationObserver(r=>{for(const s of r)if(s.type==="childList")for(const a of s.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&n(a)}).observe(document,{childList:!0,subtree:!0});function e(r){const s={};return r.integrity&&(s.integrity=r.integrity),r.referrerPolicy&&(s.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?s.credentials="include":r.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function n(r){if(r.ep)return;r.ep=!0;const s=e(r);fetch(r.href,s)}})();const gf=()=>/iPad|iPhone|iPod/.test(navigator.userAgent)||navigator.platform==="MacIntel"&&navigator.maxTouchPoints>1,vf=()=>gf()||/Android|Mobile/i.test(navigator.userAgent);let _f=class{constructor(t,e){this.video=t,this.facing=e??(vf()?"environment":"user"),t.muted=!0,t.playsInline=!0,t.autoplay=!0,t.setAttribute("playsinline",""),t.setAttribute("muted","")}stream=null;facing;async open(t=this.facing){const e=!!this.stream;this.stop(),e&&await new Promise(r=>setTimeout(r,100));const n={facingMode:t,width:{ideal:1280},height:{ideal:720},frameRate:{ideal:30}};this.stream=await navigator.mediaDevices.getUserMedia({audio:!1,video:n}),this.facing=t,this.video.srcObject=this.stream,await this.video.play().catch(()=>{}),this.video.readyState<2&&await new Promise(r=>this.video.addEventListener("loadeddata",()=>r(),{once:!0}))}async flip(){await this.open(this.facing==="user"?"environment":"user")}get mirrored(){return this.facing==="user"}stop(){if(this.stream){for(const t of this.stream.getTracks())t.stop();this.video.srcObject=null,this.stream=null}}};const xf="modulepreload",Mf=function(i,t){return new URL(i,t).href},$c={},bf=function(t,e,n){let r=Promise.resolve();if(e&&e.length>0){let a=function(h){return Promise.all(h.map(u=>Promise.resolve(u).then(d=>({status:"fulfilled",value:d}),d=>({status:"rejected",reason:d}))))};const o=document.getElementsByTagName("link"),c=document.querySelector("meta[property=csp-nonce]"),l=c?.nonce||c?.getAttribute("nonce");r=a(e.map(h=>{if(h=Mf(h,n),h in $c)return;$c[h]=!0;const u=h.endsWith(".css"),d=u?'[rel="stylesheet"]':"";if(!!n)for(let v=o.length-1;v>=0;v--){const m=o[v];if(m.href===h&&(!u||m.rel==="stylesheet"))return}else if(document.querySelector(`link[href="${h}"]${d}`))return;const g=document.createElement("link");if(g.rel=u?"stylesheet":xf,u||(g.as="script"),g.crossOrigin="",g.href=h,l&&g.setAttribute("nonce",l),document.head.appendChild(g),u)return new Promise((v,m)=>{g.addEventListener("load",v),g.addEventListener("error",()=>m(new Error(`Unable to preload CSS for ${h}`)))})}))}function s(a){const o=new Event("vite:preloadError",{cancelable:!0});if(o.payload=a,window.dispatchEvent(o),!o.defaultPrevented)throw a}return r.then(a=>{for(const o of a||[])o.status==="rejected"&&s(o.reason);return t().catch(s)})},z={nose:0,eyeInL:1,eyeL:2,eyeOutL:3,eyeInR:4,eyeR:5,eyeOutR:6,earL:7,earR:8,mouthL:9,mouthR:10,shL:11,shR:12,elL:13,elR:14,wrL:15,wrR:16,pinkyL:17,pinkyR:18,indexL:19,indexR:20,thumbL:21,thumbR:22,hipL:23,hipR:24,knL:25,knR:26,anL:27,anR:28,heelL:29,heelR:30,toeL:31,toeR:32},go=33;function yf(i){return{x:i.x,y:-i.y,z:-i.z,v:i.visibility??1}}const Sf=[[z.shL,z.shR],[z.shL,z.elL],[z.elL,z.wrL],[z.shR,z.elR],[z.elR,z.wrR],[z.shL,z.hipL],[z.shR,z.hipR],[z.hipL,z.hipR],[z.hipL,z.knL],[z.knL,z.anL],[z.hipR,z.knR],[z.knR,z.anR],[z.anL,z.toeL],[z.anR,z.toeR],[z.earL,z.eyeL],[z.eyeL,z.nose],[z.nose,z.eyeR],[z.eyeR,z.earR]];class Vh{constructor(t,e){this.model=t,this.numPoses=e}lm=null;lastTs=-1;delegate="GPU";inferMs=0;masks=!1;async load(t){t?.("loading the pose engine");const n=await bf(()=>import("./vision_bundle-Bk4VIwNi.js"),[],import.meta.url),r=await n.FilesetResolver.forVisionTasks("./mediapipe"),s=a=>n.PoseLandmarker.createFromOptions(r,{baseOptions:{modelAssetPath:`./models/pose_landmarker_${this.model}.task`,delegate:a},runningMode:"VIDEO",numPoses:this.numPoses,minPoseDetectionConfidence:.5,minPosePresenceConfidence:.5,minTrackingConfidence:.5,outputSegmentationMasks:this.masks});t?.(`loading the ${this.model} pose model`);try{this.lm=await s("GPU"),this.delegate="GPU"}catch(a){console.warn("GPU delegate failed, using CPU",a),this.lm=await s("CPU"),this.delegate="CPU"}}async setOptions(t){t.numPoses&&(this.numPoses=t.numPoses,await this.lm?.setOptions({numPoses:t.numPoses})),t.masks!==void 0&&t.masks!==this.masks&&(this.masks=t.masks,await this.lm?.setOptions({outputSegmentationMasks:t.masks}))}detect(t,e){if(!this.lm)return[];e<=this.lastTs&&(e=this.lastTs+1),this.lastTs=e;const n=performance.now(),r=this.lm.detectForVideo(t,e);this.inferMs=performance.now()-n;const s=[];for(let a=0;a<r.landmarks.length;a++){const o=r.landmarks[a],c=r.worldLandmarks[a];if(!c)continue;const l=r.segmentationMasks?.[a];s.push({image:o.map(h=>({x:h.x,y:h.y,z:h.z,v:h.visibility??1})),world:c.map(yf),mask:l?{data:l.getAsFloat32Array().slice(),w:l.width,h:l.height}:void 0})}return r.close(),s}close(){this.lm?.close(),this.lm=null}}function Ef(i,t,e=.85){return{f:e*Math.max(i,t),cx:i/2,cy:t/2,w:i,h:t}}function wf(i,t,e,n=.5){let r=0,s=0,a=0,o=0,c=0,l=0,h=0,u=0,d=0;for(let S=0;S<i.length&&S<t.length;S++){const b=i[S],M=t[S],E=Math.min(b.v,M.v);if(E<n)continue;const T=(M.x*e.w-e.cx)/e.f,A=(e.cy-M.y*e.h)/e.f,R=-T*b.z-b.x,_=-A*b.z-b.y;r+=E,s+=E*T,c+=E*T*T,l+=E*R,u+=E*T*R,a+=E,o+=E*A,c+=E*A*A,h+=E*_,u+=E*A*_,d++}if(d<4)return null;const f=c-s*s/r-o*o/a,g=u-s*l/r-o*h/a;if(Math.abs(f)<1e-9)return null;const v=g/f,m=(l-s*v)/r,p=(h-o*v)/a;return!(v<-.2)||!isFinite(m)||!isFinite(p)?null:{x:m,y:p,z:v}}function ns(i,t){const e=-i.z;return{x:(t.cx+t.f*i.x/e)/t.w,y:(t.cy-t.f*i.y/e)/t.h}}const xs=(i,t)=>({x:(i.x+t.x)/2,y:(i.y+t.y)/2,z:(i.z+t.z)/2,v:Math.min(i.v,t.v)}),In=(i,t)=>Math.hypot(i.x-t.x,i.y-t.y,i.z-t.z);function jc(i){const t=In(xs(i[z.shL],i[z.shR]),xs(i[z.hipL],i[z.hipR])),e=(In(i[z.shL],i[z.elL])+In(i[z.shR],i[z.elR]))/2,n=(In(i[z.elL],i[z.wrL])+In(i[z.elR],i[z.wrR]))/2,r=(In(i[z.hipL],i[z.knL])+In(i[z.hipR],i[z.knR]))/2,s=(In(i[z.knL],i[z.anL])+In(i[z.knR],i[z.anR]))/2,a=In(xs(i[z.shL],i[z.shR]),xs(i[z.earL],i[z.earR]));return{torso:t,upperArm:e,forearm:n,thigh:r,shin:s,neck:a}}const xn={tauWorld:.045,tauImage:.035,tauXY:.05,tauZ:.14,tauLen:1.5,tauVis:.25,tauCore:.09,fadeIn:.22,fadeOut:.35,forgetAfter:.6,matchRadius:1.3},Zc=i=>{const t=[z.shL,z.shR,z.hipL,z.hipR];let e=0,n=0,r=0;for(const c of t){const l=i[c];e+=l.x,n+=l.y,r++}e/=r,n/=r;const s=(i[z.shL].x+i[z.shR].x)/2-(i[z.hipL].x+i[z.hipR].x)/2,a=(i[z.shL].y+i[z.shR].y)/2-(i[z.hipL].y+i[z.hipR].y)/2,o=Math.hypot(i[z.shL].x-i[z.shR].x,i[z.shL].y-i[z.shR].y);return{x:e,y:n,s:Math.max(Math.hypot(s,a),o,.04)}},_i=(i,t,e)=>i+(t-i)*e,Ai=(i,t)=>1-Math.exp(-i/Math.max(t,1e-4)),Tf=new Set([0,1,2,3,4,5,6,7,8,9,10,z.shL,z.shR,z.hipL,z.hipR]);function Kc(i,t,e,n,r=e){for(let s=0;s<go;s++){const a=i[s],o=t[s],c=Tf.has(s)?r:e;a.x=_i(a.x,o.x,c),a.y=_i(a.y,o.y,c),a.z=_i(a.z,o.z,c),a.v=_i(a.v,o.v,n)}}const Jc=i=>i.map(t=>({...t}));class Af{tracks=[];nextId=1;last=-1;update(t,e,n){const r=this.last<0?.03333333333333333:Math.min(.25,Math.max(.001,(e-this.last)/1e3));this.last=e;const s=t.map(h=>({d:h,T:wf(h.world,h.image,n),c:Zc(h.image)})).filter(h=>h.T),a=this.tracks.filter(h=>!h.lost||h.presence>0),o=[];a.forEach((h,u)=>{const d=Zc(h.image);s.forEach((f,g)=>{const v=Math.hypot(d.x-f.c.x,d.y-f.c.y)/d.s;v<xn.matchRadius&&o.push({ti:u,di:g,cost:v})})}),o.sort((h,u)=>h.cost-u.cost);const c=new Set,l=new Set;for(const h of o){if(c.has(h.ti)||l.has(h.di))continue;c.add(h.ti),l.add(h.di);const u=a[h.ti],d=s[h.di],f=u.lost,g=f?1:Ai(r,xn.tauVis);Kc(u.world,d.d.world,f?1:Ai(r,xn.tauWorld),g,f?1:Ai(r,xn.tauCore)),Kc(u.image,d.d.image,f?1:Ai(r,xn.tauImage),g);const v=f?1:Ai(r,xn.tauXY),m=f?1:Ai(r,xn.tauZ);u.T={x:_i(u.T.x,d.T.x,v),y:_i(u.T.y,d.T.y,v),z:_i(u.T.z,d.T.z,m)};const p=jc(u.world),S=Ai(r,xn.tauLen);for(const b of Object.keys(p))u.len[b]=_i(u.len[b],p[b],S);u.seen=e,u.lost=!1,u.det=d.d}s.forEach((h,u)=>{if(l.has(u))return;const d=Jc(h.d.world);this.tracks.push({id:this.nextId++,born:e,seen:e,image:Jc(h.d.image),world:d,T:{...h.T},len:jc(d),presence:0,lost:!1,det:h.d})});for(const h of this.tracks)h.seen!==e&&(h.lost=!0,h.det=null),h.presence=h.lost?Math.max(0,h.presence-r/xn.fadeOut):Math.min(1,h.presence+r/xn.fadeIn);return this.tracks=this.tracks.filter(h=>!(h.lost&&h.presence<=0&&e-h.seen>xn.forgetAfter*1e3)),this.tracks}clear(){this.tracks=[],this.last=-1}}/**
 * @license
 * Copyright 2010-2025 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const dc="180",Rf=0,Qc=1,Cf=2,Gh=1,Wh=2,Zn=3,Si=0,Je=1,wn=2,Mi=0,Er=1,tl=2,el=3,nl=4,Lf=5,Fi=100,Pf=101,Df=102,If=103,Uf=104,Nf=200,Ff=201,Of=202,Bf=203,vo=204,_o=205,kf=206,zf=207,Hf=208,Vf=209,Gf=210,Wf=211,Xf=212,qf=213,Yf=214,xo=0,Mo=1,bo=2,Ar=3,yo=4,So=5,Eo=6,wo=7,Xh=0,$f=1,jf=2,bi=0,Zf=1,Kf=2,Jf=3,Qf=4,td=5,ed=6,qh=7,il="attached",nd="detached",Yh=300,Rr=301,Cr=302,ca=303,To=304,ma=306,is=1e3,ki=1001,Ao=1002,un=1003,id=1004,Ms=1005,_e=1006,ba=1007,zi=1008,Ln=1009,$h=1010,jh=1011,rs=1012,pc=1013,qi=1014,zn=1015,ji=1016,mc=1017,gc=1018,ss=1020,Zh=35902,Kh=35899,Jh=1021,Qh=1022,Ve=1023,as=1026,os=1027,tu=1028,vc=1029,eu=1030,_c=1031,xc=1033,ea=33776,na=33777,ia=33778,ra=33779,Ro=35840,Co=35841,Lo=35842,Po=35843,Do=36196,Io=37492,Uo=37496,No=37808,Fo=37809,Oo=37810,Bo=37811,ko=37812,zo=37813,Ho=37814,Vo=37815,Go=37816,Wo=37817,Xo=37818,qo=37819,Yo=37820,$o=37821,jo=36492,Zo=36494,Ko=36495,Jo=36283,Qo=36284,tc=36285,ec=36286,rd=3200,sd=3201,nu=0,ad=1,kn="",on="srgb",Yi="srgb-linear",la="linear",le="srgb",tr=7680,rl=519,od=512,cd=513,ld=514,iu=515,hd=516,ud=517,fd=518,dd=519,sl=35044,bs=35048,al="300 es",Hn=2e3,ha=2001;class Ur{addEventListener(t,e){this._listeners===void 0&&(this._listeners={});const n=this._listeners;n[t]===void 0&&(n[t]=[]),n[t].indexOf(e)===-1&&n[t].push(e)}hasEventListener(t,e){const n=this._listeners;return n===void 0?!1:n[t]!==void 0&&n[t].indexOf(e)!==-1}removeEventListener(t,e){const n=this._listeners;if(n===void 0)return;const r=n[t];if(r!==void 0){const s=r.indexOf(e);s!==-1&&r.splice(s,1)}}dispatchEvent(t){const e=this._listeners;if(e===void 0)return;const n=e[t.type];if(n!==void 0){t.target=this;const r=n.slice(0);for(let s=0,a=r.length;s<a;s++)r[s].call(this,t);t.target=null}}}const ke=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];let ol=1234567;const $r=Math.PI/180,cs=180/Math.PI;function Zi(){const i=Math.random()*4294967295|0,t=Math.random()*4294967295|0,e=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(ke[i&255]+ke[i>>8&255]+ke[i>>16&255]+ke[i>>24&255]+"-"+ke[t&255]+ke[t>>8&255]+"-"+ke[t>>16&15|64]+ke[t>>24&255]+"-"+ke[e&63|128]+ke[e>>8&255]+"-"+ke[e>>16&255]+ke[e>>24&255]+ke[n&255]+ke[n>>8&255]+ke[n>>16&255]+ke[n>>24&255]).toLowerCase()}function Qt(i,t,e){return Math.max(t,Math.min(e,i))}function Mc(i,t){return(i%t+t)%t}function pd(i,t,e,n,r){return n+(i-t)*(r-n)/(e-t)}function md(i,t,e){return i!==t?(e-i)/(t-i):0}function jr(i,t,e){return(1-e)*i+e*t}function gd(i,t,e,n){return jr(i,t,1-Math.exp(-e*n))}function vd(i,t=1){return t-Math.abs(Mc(i,t*2)-t)}function _d(i,t,e){return i<=t?0:i>=e?1:(i=(i-t)/(e-t),i*i*(3-2*i))}function xd(i,t,e){return i<=t?0:i>=e?1:(i=(i-t)/(e-t),i*i*i*(i*(i*6-15)+10))}function Md(i,t){return i+Math.floor(Math.random()*(t-i+1))}function bd(i,t){return i+Math.random()*(t-i)}function yd(i){return i*(.5-Math.random())}function Sd(i){i!==void 0&&(ol=i);let t=ol+=1831565813;return t=Math.imul(t^t>>>15,t|1),t^=t+Math.imul(t^t>>>7,t|61),((t^t>>>14)>>>0)/4294967296}function Ed(i){return i*$r}function wd(i){return i*cs}function Td(i){return(i&i-1)===0&&i!==0}function Ad(i){return Math.pow(2,Math.ceil(Math.log(i)/Math.LN2))}function Rd(i){return Math.pow(2,Math.floor(Math.log(i)/Math.LN2))}function Cd(i,t,e,n,r){const s=Math.cos,a=Math.sin,o=s(e/2),c=a(e/2),l=s((t+n)/2),h=a((t+n)/2),u=s((t-n)/2),d=a((t-n)/2),f=s((n-t)/2),g=a((n-t)/2);switch(r){case"XYX":i.set(o*h,c*u,c*d,o*l);break;case"YZY":i.set(c*d,o*h,c*u,o*l);break;case"ZXZ":i.set(c*u,c*d,o*h,o*l);break;case"XZX":i.set(o*h,c*g,c*f,o*l);break;case"YXY":i.set(c*f,o*h,c*g,o*l);break;case"ZYZ":i.set(c*g,c*f,o*h,o*l);break;default:console.warn("THREE.MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+r)}}function xr(i,t){switch(t.constructor){case Float32Array:return i;case Uint32Array:return i/4294967295;case Uint16Array:return i/65535;case Uint8Array:return i/255;case Int32Array:return Math.max(i/2147483647,-1);case Int16Array:return Math.max(i/32767,-1);case Int8Array:return Math.max(i/127,-1);default:throw new Error("Invalid component type.")}}function We(i,t){switch(t.constructor){case Float32Array:return i;case Uint32Array:return Math.round(i*4294967295);case Uint16Array:return Math.round(i*65535);case Uint8Array:return Math.round(i*255);case Int32Array:return Math.round(i*2147483647);case Int16Array:return Math.round(i*32767);case Int8Array:return Math.round(i*127);default:throw new Error("Invalid component type.")}}const Zr={DEG2RAD:$r,RAD2DEG:cs,generateUUID:Zi,clamp:Qt,euclideanModulo:Mc,mapLinear:pd,inverseLerp:md,lerp:jr,damp:gd,pingpong:vd,smoothstep:_d,smootherstep:xd,randInt:Md,randFloat:bd,randFloatSpread:yd,seededRandom:Sd,degToRad:Ed,radToDeg:wd,isPowerOfTwo:Td,ceilPowerOfTwo:Ad,floorPowerOfTwo:Rd,setQuaternionFromProperEuler:Cd,normalize:We,denormalize:xr};class Rt{constructor(t=0,e=0){Rt.prototype.isVector2=!0,this.x=t,this.y=e}get width(){return this.x}set width(t){this.x=t}get height(){return this.y}set height(t){this.y=t}set(t,e){return this.x=t,this.y=e,this}setScalar(t){return this.x=t,this.y=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y)}copy(t){return this.x=t.x,this.y=t.y,this}add(t){return this.x+=t.x,this.y+=t.y,this}addScalar(t){return this.x+=t,this.y+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this}subScalar(t){return this.x-=t,this.y-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this}multiply(t){return this.x*=t.x,this.y*=t.y,this}multiplyScalar(t){return this.x*=t,this.y*=t,this}divide(t){return this.x/=t.x,this.y/=t.y,this}divideScalar(t){return this.multiplyScalar(1/t)}applyMatrix3(t){const e=this.x,n=this.y,r=t.elements;return this.x=r[0]*e+r[3]*n+r[6],this.y=r[1]*e+r[4]*n+r[7],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this}clamp(t,e){return this.x=Qt(this.x,t.x,e.x),this.y=Qt(this.y,t.y,e.y),this}clampScalar(t,e){return this.x=Qt(this.x,t,e),this.y=Qt(this.y,t,e),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Qt(n,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(t){return this.x*t.x+this.y*t.y}cross(t){return this.x*t.y-this.y*t.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const n=this.dot(t)/e;return Math.acos(Qt(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,n=this.y-t.y;return e*e+n*n}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this}equals(t){return t.x===this.x&&t.y===this.y}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this}rotateAround(t,e){const n=Math.cos(e),r=Math.sin(e),s=this.x-t.x,a=this.y-t.y;return this.x=s*n-a*r+t.x,this.y=s*r+a*n+t.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class Fe{constructor(t=0,e=0,n=0,r=1){this.isQuaternion=!0,this._x=t,this._y=e,this._z=n,this._w=r}static slerpFlat(t,e,n,r,s,a,o){let c=n[r+0],l=n[r+1],h=n[r+2],u=n[r+3];const d=s[a+0],f=s[a+1],g=s[a+2],v=s[a+3];if(o===0){t[e+0]=c,t[e+1]=l,t[e+2]=h,t[e+3]=u;return}if(o===1){t[e+0]=d,t[e+1]=f,t[e+2]=g,t[e+3]=v;return}if(u!==v||c!==d||l!==f||h!==g){let m=1-o;const p=c*d+l*f+h*g+u*v,S=p>=0?1:-1,b=1-p*p;if(b>Number.EPSILON){const E=Math.sqrt(b),T=Math.atan2(E,p*S);m=Math.sin(m*T)/E,o=Math.sin(o*T)/E}const M=o*S;if(c=c*m+d*M,l=l*m+f*M,h=h*m+g*M,u=u*m+v*M,m===1-o){const E=1/Math.sqrt(c*c+l*l+h*h+u*u);c*=E,l*=E,h*=E,u*=E}}t[e]=c,t[e+1]=l,t[e+2]=h,t[e+3]=u}static multiplyQuaternionsFlat(t,e,n,r,s,a){const o=n[r],c=n[r+1],l=n[r+2],h=n[r+3],u=s[a],d=s[a+1],f=s[a+2],g=s[a+3];return t[e]=o*g+h*u+c*f-l*d,t[e+1]=c*g+h*d+l*u-o*f,t[e+2]=l*g+h*f+o*d-c*u,t[e+3]=h*g-o*u-c*d-l*f,t}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get w(){return this._w}set w(t){this._w=t,this._onChangeCallback()}set(t,e,n,r){return this._x=t,this._y=e,this._z=n,this._w=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(t){return this._x=t.x,this._y=t.y,this._z=t.z,this._w=t.w,this._onChangeCallback(),this}setFromEuler(t,e=!0){const n=t._x,r=t._y,s=t._z,a=t._order,o=Math.cos,c=Math.sin,l=o(n/2),h=o(r/2),u=o(s/2),d=c(n/2),f=c(r/2),g=c(s/2);switch(a){case"XYZ":this._x=d*h*u+l*f*g,this._y=l*f*u-d*h*g,this._z=l*h*g+d*f*u,this._w=l*h*u-d*f*g;break;case"YXZ":this._x=d*h*u+l*f*g,this._y=l*f*u-d*h*g,this._z=l*h*g-d*f*u,this._w=l*h*u+d*f*g;break;case"ZXY":this._x=d*h*u-l*f*g,this._y=l*f*u+d*h*g,this._z=l*h*g+d*f*u,this._w=l*h*u-d*f*g;break;case"ZYX":this._x=d*h*u-l*f*g,this._y=l*f*u+d*h*g,this._z=l*h*g-d*f*u,this._w=l*h*u+d*f*g;break;case"YZX":this._x=d*h*u+l*f*g,this._y=l*f*u+d*h*g,this._z=l*h*g-d*f*u,this._w=l*h*u-d*f*g;break;case"XZY":this._x=d*h*u-l*f*g,this._y=l*f*u-d*h*g,this._z=l*h*g+d*f*u,this._w=l*h*u+d*f*g;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+a)}return e===!0&&this._onChangeCallback(),this}setFromAxisAngle(t,e){const n=e/2,r=Math.sin(n);return this._x=t.x*r,this._y=t.y*r,this._z=t.z*r,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(t){const e=t.elements,n=e[0],r=e[4],s=e[8],a=e[1],o=e[5],c=e[9],l=e[2],h=e[6],u=e[10],d=n+o+u;if(d>0){const f=.5/Math.sqrt(d+1);this._w=.25/f,this._x=(h-c)*f,this._y=(s-l)*f,this._z=(a-r)*f}else if(n>o&&n>u){const f=2*Math.sqrt(1+n-o-u);this._w=(h-c)/f,this._x=.25*f,this._y=(r+a)/f,this._z=(s+l)/f}else if(o>u){const f=2*Math.sqrt(1+o-n-u);this._w=(s-l)/f,this._x=(r+a)/f,this._y=.25*f,this._z=(c+h)/f}else{const f=2*Math.sqrt(1+u-n-o);this._w=(a-r)/f,this._x=(s+l)/f,this._y=(c+h)/f,this._z=.25*f}return this._onChangeCallback(),this}setFromUnitVectors(t,e){let n=t.dot(e)+1;return n<1e-8?(n=0,Math.abs(t.x)>Math.abs(t.z)?(this._x=-t.y,this._y=t.x,this._z=0,this._w=n):(this._x=0,this._y=-t.z,this._z=t.y,this._w=n)):(this._x=t.y*e.z-t.z*e.y,this._y=t.z*e.x-t.x*e.z,this._z=t.x*e.y-t.y*e.x,this._w=n),this.normalize()}angleTo(t){return 2*Math.acos(Math.abs(Qt(this.dot(t),-1,1)))}rotateTowards(t,e){const n=this.angleTo(t);if(n===0)return this;const r=Math.min(1,e/n);return this.slerp(t,r),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(t){return this._x*t._x+this._y*t._y+this._z*t._z+this._w*t._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let t=this.length();return t===0?(this._x=0,this._y=0,this._z=0,this._w=1):(t=1/t,this._x=this._x*t,this._y=this._y*t,this._z=this._z*t,this._w=this._w*t),this._onChangeCallback(),this}multiply(t){return this.multiplyQuaternions(this,t)}premultiply(t){return this.multiplyQuaternions(t,this)}multiplyQuaternions(t,e){const n=t._x,r=t._y,s=t._z,a=t._w,o=e._x,c=e._y,l=e._z,h=e._w;return this._x=n*h+a*o+r*l-s*c,this._y=r*h+a*c+s*o-n*l,this._z=s*h+a*l+n*c-r*o,this._w=a*h-n*o-r*c-s*l,this._onChangeCallback(),this}slerp(t,e){if(e===0)return this;if(e===1)return this.copy(t);const n=this._x,r=this._y,s=this._z,a=this._w;let o=a*t._w+n*t._x+r*t._y+s*t._z;if(o<0?(this._w=-t._w,this._x=-t._x,this._y=-t._y,this._z=-t._z,o=-o):this.copy(t),o>=1)return this._w=a,this._x=n,this._y=r,this._z=s,this;const c=1-o*o;if(c<=Number.EPSILON){const f=1-e;return this._w=f*a+e*this._w,this._x=f*n+e*this._x,this._y=f*r+e*this._y,this._z=f*s+e*this._z,this.normalize(),this}const l=Math.sqrt(c),h=Math.atan2(l,o),u=Math.sin((1-e)*h)/l,d=Math.sin(e*h)/l;return this._w=a*u+this._w*d,this._x=n*u+this._x*d,this._y=r*u+this._y*d,this._z=s*u+this._z*d,this._onChangeCallback(),this}slerpQuaternions(t,e,n){return this.copy(t).slerp(e,n)}random(){const t=2*Math.PI*Math.random(),e=2*Math.PI*Math.random(),n=Math.random(),r=Math.sqrt(1-n),s=Math.sqrt(n);return this.set(r*Math.sin(t),r*Math.cos(t),s*Math.sin(e),s*Math.cos(e))}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._w===this._w}fromArray(t,e=0){return this._x=t[e],this._y=t[e+1],this._z=t[e+2],this._w=t[e+3],this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._w,t}fromBufferAttribute(t,e){return this._x=t.getX(e),this._y=t.getY(e),this._z=t.getZ(e),this._w=t.getW(e),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class U{constructor(t=0,e=0,n=0){U.prototype.isVector3=!0,this.x=t,this.y=e,this.z=n}set(t,e,n){return n===void 0&&(n=this.z),this.x=t,this.y=e,this.z=n,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this}multiplyVectors(t,e){return this.x=t.x*e.x,this.y=t.y*e.y,this.z=t.z*e.z,this}applyEuler(t){return this.applyQuaternion(cl.setFromEuler(t))}applyAxisAngle(t,e){return this.applyQuaternion(cl.setFromAxisAngle(t,e))}applyMatrix3(t){const e=this.x,n=this.y,r=this.z,s=t.elements;return this.x=s[0]*e+s[3]*n+s[6]*r,this.y=s[1]*e+s[4]*n+s[7]*r,this.z=s[2]*e+s[5]*n+s[8]*r,this}applyNormalMatrix(t){return this.applyMatrix3(t).normalize()}applyMatrix4(t){const e=this.x,n=this.y,r=this.z,s=t.elements,a=1/(s[3]*e+s[7]*n+s[11]*r+s[15]);return this.x=(s[0]*e+s[4]*n+s[8]*r+s[12])*a,this.y=(s[1]*e+s[5]*n+s[9]*r+s[13])*a,this.z=(s[2]*e+s[6]*n+s[10]*r+s[14])*a,this}applyQuaternion(t){const e=this.x,n=this.y,r=this.z,s=t.x,a=t.y,o=t.z,c=t.w,l=2*(a*r-o*n),h=2*(o*e-s*r),u=2*(s*n-a*e);return this.x=e+c*l+a*u-o*h,this.y=n+c*h+o*l-s*u,this.z=r+c*u+s*h-a*l,this}project(t){return this.applyMatrix4(t.matrixWorldInverse).applyMatrix4(t.projectionMatrix)}unproject(t){return this.applyMatrix4(t.projectionMatrixInverse).applyMatrix4(t.matrixWorld)}transformDirection(t){const e=this.x,n=this.y,r=this.z,s=t.elements;return this.x=s[0]*e+s[4]*n+s[8]*r,this.y=s[1]*e+s[5]*n+s[9]*r,this.z=s[2]*e+s[6]*n+s[10]*r,this.normalize()}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this}divideScalar(t){return this.multiplyScalar(1/t)}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this}clamp(t,e){return this.x=Qt(this.x,t.x,e.x),this.y=Qt(this.y,t.y,e.y),this.z=Qt(this.z,t.z,e.z),this}clampScalar(t,e){return this.x=Qt(this.x,t,e),this.y=Qt(this.y,t,e),this.z=Qt(this.z,t,e),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Qt(n,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this}cross(t){return this.crossVectors(this,t)}crossVectors(t,e){const n=t.x,r=t.y,s=t.z,a=e.x,o=e.y,c=e.z;return this.x=r*c-s*o,this.y=s*a-n*c,this.z=n*o-r*a,this}projectOnVector(t){const e=t.lengthSq();if(e===0)return this.set(0,0,0);const n=t.dot(this)/e;return this.copy(t).multiplyScalar(n)}projectOnPlane(t){return ya.copy(this).projectOnVector(t),this.sub(ya)}reflect(t){return this.sub(ya.copy(t).multiplyScalar(2*this.dot(t)))}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const n=this.dot(t)/e;return Math.acos(Qt(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,n=this.y-t.y,r=this.z-t.z;return e*e+n*n+r*r}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)+Math.abs(this.z-t.z)}setFromSpherical(t){return this.setFromSphericalCoords(t.radius,t.phi,t.theta)}setFromSphericalCoords(t,e,n){const r=Math.sin(e)*t;return this.x=r*Math.sin(n),this.y=Math.cos(e)*t,this.z=r*Math.cos(n),this}setFromCylindrical(t){return this.setFromCylindricalCoords(t.radius,t.theta,t.y)}setFromCylindricalCoords(t,e,n){return this.x=t*Math.sin(e),this.y=n,this.z=t*Math.cos(e),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this}setFromMatrixScale(t){const e=this.setFromMatrixColumn(t,0).length(),n=this.setFromMatrixColumn(t,1).length(),r=this.setFromMatrixColumn(t,2).length();return this.x=e,this.y=n,this.z=r,this}setFromMatrixColumn(t,e){return this.fromArray(t.elements,e*4)}setFromMatrix3Column(t,e){return this.fromArray(t.elements,e*3)}setFromEuler(t){return this.x=t._x,this.y=t._y,this.z=t._z,this}setFromColor(t){return this.x=t.r,this.y=t.g,this.z=t.b,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const t=Math.random()*Math.PI*2,e=Math.random()*2-1,n=Math.sqrt(1-e*e);return this.x=n*Math.cos(t),this.y=e,this.z=n*Math.sin(t),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const ya=new U,cl=new Fe;class Zt{constructor(t,e,n,r,s,a,o,c,l){Zt.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],t!==void 0&&this.set(t,e,n,r,s,a,o,c,l)}set(t,e,n,r,s,a,o,c,l){const h=this.elements;return h[0]=t,h[1]=r,h[2]=o,h[3]=e,h[4]=s,h[5]=c,h[6]=n,h[7]=a,h[8]=l,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(t){const e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],this}extractBasis(t,e,n){return t.setFromMatrix3Column(this,0),e.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(t){const e=t.elements;return this.set(e[0],e[4],e[8],e[1],e[5],e[9],e[2],e[6],e[10]),this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const n=t.elements,r=e.elements,s=this.elements,a=n[0],o=n[3],c=n[6],l=n[1],h=n[4],u=n[7],d=n[2],f=n[5],g=n[8],v=r[0],m=r[3],p=r[6],S=r[1],b=r[4],M=r[7],E=r[2],T=r[5],A=r[8];return s[0]=a*v+o*S+c*E,s[3]=a*m+o*b+c*T,s[6]=a*p+o*M+c*A,s[1]=l*v+h*S+u*E,s[4]=l*m+h*b+u*T,s[7]=l*p+h*M+u*A,s[2]=d*v+f*S+g*E,s[5]=d*m+f*b+g*T,s[8]=d*p+f*M+g*A,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[3]*=t,e[6]*=t,e[1]*=t,e[4]*=t,e[7]*=t,e[2]*=t,e[5]*=t,e[8]*=t,this}determinant(){const t=this.elements,e=t[0],n=t[1],r=t[2],s=t[3],a=t[4],o=t[5],c=t[6],l=t[7],h=t[8];return e*a*h-e*o*l-n*s*h+n*o*c+r*s*l-r*a*c}invert(){const t=this.elements,e=t[0],n=t[1],r=t[2],s=t[3],a=t[4],o=t[5],c=t[6],l=t[7],h=t[8],u=h*a-o*l,d=o*c-h*s,f=l*s-a*c,g=e*u+n*d+r*f;if(g===0)return this.set(0,0,0,0,0,0,0,0,0);const v=1/g;return t[0]=u*v,t[1]=(r*l-h*n)*v,t[2]=(o*n-r*a)*v,t[3]=d*v,t[4]=(h*e-r*c)*v,t[5]=(r*s-o*e)*v,t[6]=f*v,t[7]=(n*c-l*e)*v,t[8]=(a*e-n*s)*v,this}transpose(){let t;const e=this.elements;return t=e[1],e[1]=e[3],e[3]=t,t=e[2],e[2]=e[6],e[6]=t,t=e[5],e[5]=e[7],e[7]=t,this}getNormalMatrix(t){return this.setFromMatrix4(t).invert().transpose()}transposeIntoArray(t){const e=this.elements;return t[0]=e[0],t[1]=e[3],t[2]=e[6],t[3]=e[1],t[4]=e[4],t[5]=e[7],t[6]=e[2],t[7]=e[5],t[8]=e[8],this}setUvTransform(t,e,n,r,s,a,o){const c=Math.cos(s),l=Math.sin(s);return this.set(n*c,n*l,-n*(c*a+l*o)+a+t,-r*l,r*c,-r*(-l*a+c*o)+o+e,0,0,1),this}scale(t,e){return this.premultiply(Sa.makeScale(t,e)),this}rotate(t){return this.premultiply(Sa.makeRotation(-t)),this}translate(t,e){return this.premultiply(Sa.makeTranslation(t,e)),this}makeTranslation(t,e){return t.isVector2?this.set(1,0,t.x,0,1,t.y,0,0,1):this.set(1,0,t,0,1,e,0,0,1),this}makeRotation(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,n,e,0,0,0,1),this}makeScale(t,e){return this.set(t,0,0,0,e,0,0,0,1),this}equals(t){const e=this.elements,n=t.elements;for(let r=0;r<9;r++)if(e[r]!==n[r])return!1;return!0}fromArray(t,e=0){for(let n=0;n<9;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){const n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t}clone(){return new this.constructor().fromArray(this.elements)}}const Sa=new Zt;function ru(i){for(let t=i.length-1;t>=0;--t)if(i[t]>=65535)return!0;return!1}function ua(i){return document.createElementNS("http://www.w3.org/1999/xhtml",i)}function Ld(){const i=ua("canvas");return i.style.display="block",i}const ll={};function ls(i){i in ll||(ll[i]=!0,console.warn(i))}function Pd(i,t,e){return new Promise(function(n,r){function s(){switch(i.clientWaitSync(t,i.SYNC_FLUSH_COMMANDS_BIT,0)){case i.WAIT_FAILED:r();break;case i.TIMEOUT_EXPIRED:setTimeout(s,e);break;default:n()}}setTimeout(s,e)})}const hl=new Zt().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),ul=new Zt().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function Dd(){const i={enabled:!0,workingColorSpace:Yi,spaces:{},convert:function(r,s,a){return this.enabled===!1||s===a||!s||!a||(this.spaces[s].transfer===le&&(r.r=ei(r.r),r.g=ei(r.g),r.b=ei(r.b)),this.spaces[s].primaries!==this.spaces[a].primaries&&(r.applyMatrix3(this.spaces[s].toXYZ),r.applyMatrix3(this.spaces[a].fromXYZ)),this.spaces[a].transfer===le&&(r.r=wr(r.r),r.g=wr(r.g),r.b=wr(r.b))),r},workingToColorSpace:function(r,s){return this.convert(r,this.workingColorSpace,s)},colorSpaceToWorking:function(r,s){return this.convert(r,s,this.workingColorSpace)},getPrimaries:function(r){return this.spaces[r].primaries},getTransfer:function(r){return r===kn?la:this.spaces[r].transfer},getToneMappingMode:function(r){return this.spaces[r].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(r,s=this.workingColorSpace){return r.fromArray(this.spaces[s].luminanceCoefficients)},define:function(r){Object.assign(this.spaces,r)},_getMatrix:function(r,s,a){return r.copy(this.spaces[s].toXYZ).multiply(this.spaces[a].fromXYZ)},_getDrawingBufferColorSpace:function(r){return this.spaces[r].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(r=this.workingColorSpace){return this.spaces[r].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(r,s){return ls("THREE.ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),i.workingToColorSpace(r,s)},toWorkingColorSpace:function(r,s){return ls("THREE.ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),i.colorSpaceToWorking(r,s)}},t=[.64,.33,.3,.6,.15,.06],e=[.2126,.7152,.0722],n=[.3127,.329];return i.define({[Yi]:{primaries:t,whitePoint:n,transfer:la,toXYZ:hl,fromXYZ:ul,luminanceCoefficients:e,workingColorSpaceConfig:{unpackColorSpace:on},outputColorSpaceConfig:{drawingBufferColorSpace:on}},[on]:{primaries:t,whitePoint:n,transfer:le,toXYZ:hl,fromXYZ:ul,luminanceCoefficients:e,outputColorSpaceConfig:{drawingBufferColorSpace:on}}}),i}const re=Dd();function ei(i){return i<.04045?i*.0773993808:Math.pow(i*.9478672986+.0521327014,2.4)}function wr(i){return i<.0031308?i*12.92:1.055*Math.pow(i,.41666)-.055}let er;class Id{static getDataURL(t,e="image/png"){if(/^data:/i.test(t.src)||typeof HTMLCanvasElement>"u")return t.src;let n;if(t instanceof HTMLCanvasElement)n=t;else{er===void 0&&(er=ua("canvas")),er.width=t.width,er.height=t.height;const r=er.getContext("2d");t instanceof ImageData?r.putImageData(t,0,0):r.drawImage(t,0,0,t.width,t.height),n=er}return n.toDataURL(e)}static sRGBToLinear(t){if(typeof HTMLImageElement<"u"&&t instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&t instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&t instanceof ImageBitmap){const e=ua("canvas");e.width=t.width,e.height=t.height;const n=e.getContext("2d");n.drawImage(t,0,0,t.width,t.height);const r=n.getImageData(0,0,t.width,t.height),s=r.data;for(let a=0;a<s.length;a++)s[a]=ei(s[a]/255)*255;return n.putImageData(r,0,0),e}else if(t.data){const e=t.data.slice(0);for(let n=0;n<e.length;n++)e instanceof Uint8Array||e instanceof Uint8ClampedArray?e[n]=Math.floor(ei(e[n]/255)*255):e[n]=ei(e[n]);return{data:e,width:t.width,height:t.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),t}}let Ud=0;class bc{constructor(t=null){this.isSource=!0,Object.defineProperty(this,"id",{value:Ud++}),this.uuid=Zi(),this.data=t,this.dataReady=!0,this.version=0}getSize(t){const e=this.data;return typeof HTMLVideoElement<"u"&&e instanceof HTMLVideoElement?t.set(e.videoWidth,e.videoHeight,0):e instanceof VideoFrame?t.set(e.displayHeight,e.displayWidth,0):e!==null?t.set(e.width,e.height,e.depth||0):t.set(0,0,0),t}set needsUpdate(t){t===!0&&this.version++}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.images[this.uuid]!==void 0)return t.images[this.uuid];const n={uuid:this.uuid,url:""},r=this.data;if(r!==null){let s;if(Array.isArray(r)){s=[];for(let a=0,o=r.length;a<o;a++)r[a].isDataTexture?s.push(Ea(r[a].image)):s.push(Ea(r[a]))}else s=Ea(r);n.url=s}return e||(t.images[this.uuid]=n),n}}function Ea(i){return typeof HTMLImageElement<"u"&&i instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&i instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&i instanceof ImageBitmap?Id.getDataURL(i):i.data?{data:Array.from(i.data),width:i.width,height:i.height,type:i.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}let Nd=0;const wa=new U;class Be extends Ur{constructor(t=Be.DEFAULT_IMAGE,e=Be.DEFAULT_MAPPING,n=ki,r=ki,s=_e,a=zi,o=Ve,c=Ln,l=Be.DEFAULT_ANISOTROPY,h=kn){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:Nd++}),this.uuid=Zi(),this.name="",this.source=new bc(t),this.mipmaps=[],this.mapping=e,this.channel=0,this.wrapS=n,this.wrapT=r,this.magFilter=s,this.minFilter=a,this.anisotropy=l,this.format=o,this.internalFormat=null,this.type=c,this.offset=new Rt(0,0),this.repeat=new Rt(1,1),this.center=new Rt(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Zt,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=h,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(t&&t.depth&&t.depth>1),this.pmremVersion=0}get width(){return this.source.getSize(wa).x}get height(){return this.source.getSize(wa).y}get depth(){return this.source.getSize(wa).z}get image(){return this.source.data}set image(t=null){this.source.data=t}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(t){return this.name=t.name,this.source=t.source,this.mipmaps=t.mipmaps.slice(0),this.mapping=t.mapping,this.channel=t.channel,this.wrapS=t.wrapS,this.wrapT=t.wrapT,this.magFilter=t.magFilter,this.minFilter=t.minFilter,this.anisotropy=t.anisotropy,this.format=t.format,this.internalFormat=t.internalFormat,this.type=t.type,this.offset.copy(t.offset),this.repeat.copy(t.repeat),this.center.copy(t.center),this.rotation=t.rotation,this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrix.copy(t.matrix),this.generateMipmaps=t.generateMipmaps,this.premultiplyAlpha=t.premultiplyAlpha,this.flipY=t.flipY,this.unpackAlignment=t.unpackAlignment,this.colorSpace=t.colorSpace,this.renderTarget=t.renderTarget,this.isRenderTargetTexture=t.isRenderTargetTexture,this.isArrayTexture=t.isArrayTexture,this.userData=JSON.parse(JSON.stringify(t.userData)),this.needsUpdate=!0,this}setValues(t){for(const e in t){const n=t[e];if(n===void 0){console.warn(`THREE.Texture.setValues(): parameter '${e}' has value of undefined.`);continue}const r=this[e];if(r===void 0){console.warn(`THREE.Texture.setValues(): property '${e}' does not exist.`);continue}r&&n&&r.isVector2&&n.isVector2||r&&n&&r.isVector3&&n.isVector3||r&&n&&r.isMatrix3&&n.isMatrix3?r.copy(n):this[e]=n}}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.textures[this.uuid]!==void 0)return t.textures[this.uuid];const n={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(t).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),e||(t.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(t){if(this.mapping!==Yh)return t;if(t.applyMatrix3(this.matrix),t.x<0||t.x>1)switch(this.wrapS){case is:t.x=t.x-Math.floor(t.x);break;case ki:t.x=t.x<0?0:1;break;case Ao:Math.abs(Math.floor(t.x)%2)===1?t.x=Math.ceil(t.x)-t.x:t.x=t.x-Math.floor(t.x);break}if(t.y<0||t.y>1)switch(this.wrapT){case is:t.y=t.y-Math.floor(t.y);break;case ki:t.y=t.y<0?0:1;break;case Ao:Math.abs(Math.floor(t.y)%2)===1?t.y=Math.ceil(t.y)-t.y:t.y=t.y-Math.floor(t.y);break}return this.flipY&&(t.y=1-t.y),t}set needsUpdate(t){t===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(t){t===!0&&this.pmremVersion++}}Be.DEFAULT_IMAGE=null;Be.DEFAULT_MAPPING=Yh;Be.DEFAULT_ANISOTROPY=1;class se{constructor(t=0,e=0,n=0,r=1){se.prototype.isVector4=!0,this.x=t,this.y=e,this.z=n,this.w=r}get width(){return this.z}set width(t){this.z=t}get height(){return this.w}set height(t){this.w=t}set(t,e,n,r){return this.x=t,this.y=e,this.z=n,this.w=r,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this.w=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setW(t){return this.w=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;case 3:this.w=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this.w=t.w!==void 0?t.w:1,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this.w+=t.w,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this.w+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this.w=t.w+e.w,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this.w+=t.w*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this.w-=t.w,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this.w-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this.w=t.w-e.w,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this.w*=t.w,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this.w*=t,this}applyMatrix4(t){const e=this.x,n=this.y,r=this.z,s=this.w,a=t.elements;return this.x=a[0]*e+a[4]*n+a[8]*r+a[12]*s,this.y=a[1]*e+a[5]*n+a[9]*r+a[13]*s,this.z=a[2]*e+a[6]*n+a[10]*r+a[14]*s,this.w=a[3]*e+a[7]*n+a[11]*r+a[15]*s,this}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this.w/=t.w,this}divideScalar(t){return this.multiplyScalar(1/t)}setAxisAngleFromQuaternion(t){this.w=2*Math.acos(t.w);const e=Math.sqrt(1-t.w*t.w);return e<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=t.x/e,this.y=t.y/e,this.z=t.z/e),this}setAxisAngleFromRotationMatrix(t){let e,n,r,s;const c=t.elements,l=c[0],h=c[4],u=c[8],d=c[1],f=c[5],g=c[9],v=c[2],m=c[6],p=c[10];if(Math.abs(h-d)<.01&&Math.abs(u-v)<.01&&Math.abs(g-m)<.01){if(Math.abs(h+d)<.1&&Math.abs(u+v)<.1&&Math.abs(g+m)<.1&&Math.abs(l+f+p-3)<.1)return this.set(1,0,0,0),this;e=Math.PI;const b=(l+1)/2,M=(f+1)/2,E=(p+1)/2,T=(h+d)/4,A=(u+v)/4,R=(g+m)/4;return b>M&&b>E?b<.01?(n=0,r=.707106781,s=.707106781):(n=Math.sqrt(b),r=T/n,s=A/n):M>E?M<.01?(n=.707106781,r=0,s=.707106781):(r=Math.sqrt(M),n=T/r,s=R/r):E<.01?(n=.707106781,r=.707106781,s=0):(s=Math.sqrt(E),n=A/s,r=R/s),this.set(n,r,s,e),this}let S=Math.sqrt((m-g)*(m-g)+(u-v)*(u-v)+(d-h)*(d-h));return Math.abs(S)<.001&&(S=1),this.x=(m-g)/S,this.y=(u-v)/S,this.z=(d-h)/S,this.w=Math.acos((l+f+p-1)/2),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this.w=e[15],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this.w=Math.min(this.w,t.w),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this.w=Math.max(this.w,t.w),this}clamp(t,e){return this.x=Qt(this.x,t.x,e.x),this.y=Qt(this.y,t.y,e.y),this.z=Qt(this.z,t.z,e.z),this.w=Qt(this.w,t.w,e.w),this}clampScalar(t,e){return this.x=Qt(this.x,t,e),this.y=Qt(this.y,t,e),this.z=Qt(this.z,t,e),this.w=Qt(this.w,t,e),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Qt(n,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z+this.w*t.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this.w+=(t.w-this.w)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this.w=t.w+(e.w-t.w)*n,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z&&t.w===this.w}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this.w=t[e+3],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t[e+3]=this.w,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this.w=t.getW(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class Fd extends Ur{constructor(t=1,e=1,n={}){super(),n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:_e,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1},n),this.isRenderTarget=!0,this.width=t,this.height=e,this.depth=n.depth,this.scissor=new se(0,0,t,e),this.scissorTest=!1,this.viewport=new se(0,0,t,e);const r={width:t,height:e,depth:n.depth},s=new Be(r);this.textures=[];const a=n.count;for(let o=0;o<a;o++)this.textures[o]=s.clone(),this.textures[o].isRenderTargetTexture=!0,this.textures[o].renderTarget=this;this._setTextureOptions(n),this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this._depthTexture=null,this.depthTexture=n.depthTexture,this.samples=n.samples,this.multiview=n.multiview}_setTextureOptions(t={}){const e={minFilter:_e,generateMipmaps:!1,flipY:!1,internalFormat:null};t.mapping!==void 0&&(e.mapping=t.mapping),t.wrapS!==void 0&&(e.wrapS=t.wrapS),t.wrapT!==void 0&&(e.wrapT=t.wrapT),t.wrapR!==void 0&&(e.wrapR=t.wrapR),t.magFilter!==void 0&&(e.magFilter=t.magFilter),t.minFilter!==void 0&&(e.minFilter=t.minFilter),t.format!==void 0&&(e.format=t.format),t.type!==void 0&&(e.type=t.type),t.anisotropy!==void 0&&(e.anisotropy=t.anisotropy),t.colorSpace!==void 0&&(e.colorSpace=t.colorSpace),t.flipY!==void 0&&(e.flipY=t.flipY),t.generateMipmaps!==void 0&&(e.generateMipmaps=t.generateMipmaps),t.internalFormat!==void 0&&(e.internalFormat=t.internalFormat);for(let n=0;n<this.textures.length;n++)this.textures[n].setValues(e)}get texture(){return this.textures[0]}set texture(t){this.textures[0]=t}set depthTexture(t){this._depthTexture!==null&&(this._depthTexture.renderTarget=null),t!==null&&(t.renderTarget=this),this._depthTexture=t}get depthTexture(){return this._depthTexture}setSize(t,e,n=1){if(this.width!==t||this.height!==e||this.depth!==n){this.width=t,this.height=e,this.depth=n;for(let r=0,s=this.textures.length;r<s;r++)this.textures[r].image.width=t,this.textures[r].image.height=e,this.textures[r].image.depth=n,this.textures[r].isArrayTexture=this.textures[r].image.depth>1;this.dispose()}this.viewport.set(0,0,t,e),this.scissor.set(0,0,t,e)}clone(){return new this.constructor().copy(this)}copy(t){this.width=t.width,this.height=t.height,this.depth=t.depth,this.scissor.copy(t.scissor),this.scissorTest=t.scissorTest,this.viewport.copy(t.viewport),this.textures.length=0;for(let e=0,n=t.textures.length;e<n;e++){this.textures[e]=t.textures[e].clone(),this.textures[e].isRenderTargetTexture=!0,this.textures[e].renderTarget=this;const r=Object.assign({},t.textures[e].image);this.textures[e].source=new bc(r)}return this.depthBuffer=t.depthBuffer,this.stencilBuffer=t.stencilBuffer,this.resolveDepthBuffer=t.resolveDepthBuffer,this.resolveStencilBuffer=t.resolveStencilBuffer,t.depthTexture!==null&&(this.depthTexture=t.depthTexture.clone()),this.samples=t.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class Ye extends Fd{constructor(t=1,e=1,n={}){super(t,e,n),this.isWebGLRenderTarget=!0}}class yc extends Be{constructor(t=null,e=1,n=1,r=1){super(null),this.isDataArrayTexture=!0,this.image={data:t,width:e,height:n,depth:r},this.magFilter=un,this.minFilter=un,this.wrapR=ki,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(t){this.layerUpdates.add(t)}clearLayerUpdates(){this.layerUpdates.clear()}}class Od extends Ye{constructor(t=1,e=1,n=1,r={}){super(t,e,r),this.isWebGLArrayRenderTarget=!0,this.depth=n,this.texture=new yc(null,t,e,n),this._setTextureOptions(r),this.texture.isRenderTargetTexture=!0}}class Bd extends Be{constructor(t=null,e=1,n=1,r=1){super(null),this.isData3DTexture=!0,this.image={data:t,width:e,height:n,depth:r},this.magFilter=un,this.minFilter=un,this.wrapR=ki,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class Nr{constructor(t=new U(1/0,1/0,1/0),e=new U(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=t,this.max=e}set(t,e){return this.min.copy(t),this.max.copy(e),this}setFromArray(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e+=3)this.expandByPoint(Mn.fromArray(t,e));return this}setFromBufferAttribute(t){this.makeEmpty();for(let e=0,n=t.count;e<n;e++)this.expandByPoint(Mn.fromBufferAttribute(t,e));return this}setFromPoints(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e++)this.expandByPoint(t[e]);return this}setFromCenterAndSize(t,e){const n=Mn.copy(e).multiplyScalar(.5);return this.min.copy(t).sub(n),this.max.copy(t).add(n),this}setFromObject(t,e=!1){return this.makeEmpty(),this.expandByObject(t,e)}clone(){return new this.constructor().copy(this)}copy(t){return this.min.copy(t.min),this.max.copy(t.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(t){return this.isEmpty()?t.set(0,0,0):t.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(t){return this.isEmpty()?t.set(0,0,0):t.subVectors(this.max,this.min)}expandByPoint(t){return this.min.min(t),this.max.max(t),this}expandByVector(t){return this.min.sub(t),this.max.add(t),this}expandByScalar(t){return this.min.addScalar(-t),this.max.addScalar(t),this}expandByObject(t,e=!1){t.updateWorldMatrix(!1,!1);const n=t.geometry;if(n!==void 0){const s=n.getAttribute("position");if(e===!0&&s!==void 0&&t.isInstancedMesh!==!0)for(let a=0,o=s.count;a<o;a++)t.isMesh===!0?t.getVertexPosition(a,Mn):Mn.fromBufferAttribute(s,a),Mn.applyMatrix4(t.matrixWorld),this.expandByPoint(Mn);else t.boundingBox!==void 0?(t.boundingBox===null&&t.computeBoundingBox(),ys.copy(t.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),ys.copy(n.boundingBox)),ys.applyMatrix4(t.matrixWorld),this.union(ys)}const r=t.children;for(let s=0,a=r.length;s<a;s++)this.expandByObject(r[s],e);return this}containsPoint(t){return t.x>=this.min.x&&t.x<=this.max.x&&t.y>=this.min.y&&t.y<=this.max.y&&t.z>=this.min.z&&t.z<=this.max.z}containsBox(t){return this.min.x<=t.min.x&&t.max.x<=this.max.x&&this.min.y<=t.min.y&&t.max.y<=this.max.y&&this.min.z<=t.min.z&&t.max.z<=this.max.z}getParameter(t,e){return e.set((t.x-this.min.x)/(this.max.x-this.min.x),(t.y-this.min.y)/(this.max.y-this.min.y),(t.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(t){return t.max.x>=this.min.x&&t.min.x<=this.max.x&&t.max.y>=this.min.y&&t.min.y<=this.max.y&&t.max.z>=this.min.z&&t.min.z<=this.max.z}intersectsSphere(t){return this.clampPoint(t.center,Mn),Mn.distanceToSquared(t.center)<=t.radius*t.radius}intersectsPlane(t){let e,n;return t.normal.x>0?(e=t.normal.x*this.min.x,n=t.normal.x*this.max.x):(e=t.normal.x*this.max.x,n=t.normal.x*this.min.x),t.normal.y>0?(e+=t.normal.y*this.min.y,n+=t.normal.y*this.max.y):(e+=t.normal.y*this.max.y,n+=t.normal.y*this.min.y),t.normal.z>0?(e+=t.normal.z*this.min.z,n+=t.normal.z*this.max.z):(e+=t.normal.z*this.max.z,n+=t.normal.z*this.min.z),e<=-t.constant&&n>=-t.constant}intersectsTriangle(t){if(this.isEmpty())return!1;this.getCenter(zr),Ss.subVectors(this.max,zr),nr.subVectors(t.a,zr),ir.subVectors(t.b,zr),rr.subVectors(t.c,zr),ci.subVectors(ir,nr),li.subVectors(rr,ir),Ri.subVectors(nr,rr);let e=[0,-ci.z,ci.y,0,-li.z,li.y,0,-Ri.z,Ri.y,ci.z,0,-ci.x,li.z,0,-li.x,Ri.z,0,-Ri.x,-ci.y,ci.x,0,-li.y,li.x,0,-Ri.y,Ri.x,0];return!Ta(e,nr,ir,rr,Ss)||(e=[1,0,0,0,1,0,0,0,1],!Ta(e,nr,ir,rr,Ss))?!1:(Es.crossVectors(ci,li),e=[Es.x,Es.y,Es.z],Ta(e,nr,ir,rr,Ss))}clampPoint(t,e){return e.copy(t).clamp(this.min,this.max)}distanceToPoint(t){return this.clampPoint(t,Mn).distanceTo(t)}getBoundingSphere(t){return this.isEmpty()?t.makeEmpty():(this.getCenter(t.center),t.radius=this.getSize(Mn).length()*.5),t}intersect(t){return this.min.max(t.min),this.max.min(t.max),this.isEmpty()&&this.makeEmpty(),this}union(t){return this.min.min(t.min),this.max.max(t.max),this}applyMatrix4(t){return this.isEmpty()?this:(Wn[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(t),Wn[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(t),Wn[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(t),Wn[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(t),Wn[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(t),Wn[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(t),Wn[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(t),Wn[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(t),this.setFromPoints(Wn),this)}translate(t){return this.min.add(t),this.max.add(t),this}equals(t){return t.min.equals(this.min)&&t.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(t){return this.min.fromArray(t.min),this.max.fromArray(t.max),this}}const Wn=[new U,new U,new U,new U,new U,new U,new U,new U],Mn=new U,ys=new Nr,nr=new U,ir=new U,rr=new U,ci=new U,li=new U,Ri=new U,zr=new U,Ss=new U,Es=new U,Ci=new U;function Ta(i,t,e,n,r){for(let s=0,a=i.length-3;s<=a;s+=3){Ci.fromArray(i,s);const o=r.x*Math.abs(Ci.x)+r.y*Math.abs(Ci.y)+r.z*Math.abs(Ci.z),c=t.dot(Ci),l=e.dot(Ci),h=n.dot(Ci);if(Math.max(-Math.max(c,l,h),Math.min(c,l,h))>o)return!1}return!0}const kd=new Nr,Hr=new U,Aa=new U;class Fr{constructor(t=new U,e=-1){this.isSphere=!0,this.center=t,this.radius=e}set(t,e){return this.center.copy(t),this.radius=e,this}setFromPoints(t,e){const n=this.center;e!==void 0?n.copy(e):kd.setFromPoints(t).getCenter(n);let r=0;for(let s=0,a=t.length;s<a;s++)r=Math.max(r,n.distanceToSquared(t[s]));return this.radius=Math.sqrt(r),this}copy(t){return this.center.copy(t.center),this.radius=t.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(t){return t.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(t){return t.distanceTo(this.center)-this.radius}intersectsSphere(t){const e=this.radius+t.radius;return t.center.distanceToSquared(this.center)<=e*e}intersectsBox(t){return t.intersectsSphere(this)}intersectsPlane(t){return Math.abs(t.distanceToPoint(this.center))<=this.radius}clampPoint(t,e){const n=this.center.distanceToSquared(t);return e.copy(t),n>this.radius*this.radius&&(e.sub(this.center).normalize(),e.multiplyScalar(this.radius).add(this.center)),e}getBoundingBox(t){return this.isEmpty()?(t.makeEmpty(),t):(t.set(this.center,this.center),t.expandByScalar(this.radius),t)}applyMatrix4(t){return this.center.applyMatrix4(t),this.radius=this.radius*t.getMaxScaleOnAxis(),this}translate(t){return this.center.add(t),this}expandByPoint(t){if(this.isEmpty())return this.center.copy(t),this.radius=0,this;Hr.subVectors(t,this.center);const e=Hr.lengthSq();if(e>this.radius*this.radius){const n=Math.sqrt(e),r=(n-this.radius)*.5;this.center.addScaledVector(Hr,r/n),this.radius+=r}return this}union(t){return t.isEmpty()?this:this.isEmpty()?(this.copy(t),this):(this.center.equals(t.center)===!0?this.radius=Math.max(this.radius,t.radius):(Aa.subVectors(t.center,this.center).setLength(t.radius),this.expandByPoint(Hr.copy(t.center).add(Aa)),this.expandByPoint(Hr.copy(t.center).sub(Aa))),this)}equals(t){return t.center.equals(this.center)&&t.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(t){return this.radius=t.radius,this.center.fromArray(t.center),this}}const Xn=new U,Ra=new U,ws=new U,hi=new U,Ca=new U,Ts=new U,La=new U;class su{constructor(t=new U,e=new U(0,0,-1)){this.origin=t,this.direction=e}set(t,e){return this.origin.copy(t),this.direction.copy(e),this}copy(t){return this.origin.copy(t.origin),this.direction.copy(t.direction),this}at(t,e){return e.copy(this.origin).addScaledVector(this.direction,t)}lookAt(t){return this.direction.copy(t).sub(this.origin).normalize(),this}recast(t){return this.origin.copy(this.at(t,Xn)),this}closestPointToPoint(t,e){e.subVectors(t,this.origin);const n=e.dot(this.direction);return n<0?e.copy(this.origin):e.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(t){return Math.sqrt(this.distanceSqToPoint(t))}distanceSqToPoint(t){const e=Xn.subVectors(t,this.origin).dot(this.direction);return e<0?this.origin.distanceToSquared(t):(Xn.copy(this.origin).addScaledVector(this.direction,e),Xn.distanceToSquared(t))}distanceSqToSegment(t,e,n,r){Ra.copy(t).add(e).multiplyScalar(.5),ws.copy(e).sub(t).normalize(),hi.copy(this.origin).sub(Ra);const s=t.distanceTo(e)*.5,a=-this.direction.dot(ws),o=hi.dot(this.direction),c=-hi.dot(ws),l=hi.lengthSq(),h=Math.abs(1-a*a);let u,d,f,g;if(h>0)if(u=a*c-o,d=a*o-c,g=s*h,u>=0)if(d>=-g)if(d<=g){const v=1/h;u*=v,d*=v,f=u*(u+a*d+2*o)+d*(a*u+d+2*c)+l}else d=s,u=Math.max(0,-(a*d+o)),f=-u*u+d*(d+2*c)+l;else d=-s,u=Math.max(0,-(a*d+o)),f=-u*u+d*(d+2*c)+l;else d<=-g?(u=Math.max(0,-(-a*s+o)),d=u>0?-s:Math.min(Math.max(-s,-c),s),f=-u*u+d*(d+2*c)+l):d<=g?(u=0,d=Math.min(Math.max(-s,-c),s),f=d*(d+2*c)+l):(u=Math.max(0,-(a*s+o)),d=u>0?s:Math.min(Math.max(-s,-c),s),f=-u*u+d*(d+2*c)+l);else d=a>0?-s:s,u=Math.max(0,-(a*d+o)),f=-u*u+d*(d+2*c)+l;return n&&n.copy(this.origin).addScaledVector(this.direction,u),r&&r.copy(Ra).addScaledVector(ws,d),f}intersectSphere(t,e){Xn.subVectors(t.center,this.origin);const n=Xn.dot(this.direction),r=Xn.dot(Xn)-n*n,s=t.radius*t.radius;if(r>s)return null;const a=Math.sqrt(s-r),o=n-a,c=n+a;return c<0?null:o<0?this.at(c,e):this.at(o,e)}intersectsSphere(t){return t.radius<0?!1:this.distanceSqToPoint(t.center)<=t.radius*t.radius}distanceToPlane(t){const e=t.normal.dot(this.direction);if(e===0)return t.distanceToPoint(this.origin)===0?0:null;const n=-(this.origin.dot(t.normal)+t.constant)/e;return n>=0?n:null}intersectPlane(t,e){const n=this.distanceToPlane(t);return n===null?null:this.at(n,e)}intersectsPlane(t){const e=t.distanceToPoint(this.origin);return e===0||t.normal.dot(this.direction)*e<0}intersectBox(t,e){let n,r,s,a,o,c;const l=1/this.direction.x,h=1/this.direction.y,u=1/this.direction.z,d=this.origin;return l>=0?(n=(t.min.x-d.x)*l,r=(t.max.x-d.x)*l):(n=(t.max.x-d.x)*l,r=(t.min.x-d.x)*l),h>=0?(s=(t.min.y-d.y)*h,a=(t.max.y-d.y)*h):(s=(t.max.y-d.y)*h,a=(t.min.y-d.y)*h),n>a||s>r||((s>n||isNaN(n))&&(n=s),(a<r||isNaN(r))&&(r=a),u>=0?(o=(t.min.z-d.z)*u,c=(t.max.z-d.z)*u):(o=(t.max.z-d.z)*u,c=(t.min.z-d.z)*u),n>c||o>r)||((o>n||n!==n)&&(n=o),(c<r||r!==r)&&(r=c),r<0)?null:this.at(n>=0?n:r,e)}intersectsBox(t){return this.intersectBox(t,Xn)!==null}intersectTriangle(t,e,n,r,s){Ca.subVectors(e,t),Ts.subVectors(n,t),La.crossVectors(Ca,Ts);let a=this.direction.dot(La),o;if(a>0){if(r)return null;o=1}else if(a<0)o=-1,a=-a;else return null;hi.subVectors(this.origin,t);const c=o*this.direction.dot(Ts.crossVectors(hi,Ts));if(c<0)return null;const l=o*this.direction.dot(Ca.cross(hi));if(l<0||c+l>a)return null;const h=-o*hi.dot(La);return h<0?null:this.at(h/a,s)}applyMatrix4(t){return this.origin.applyMatrix4(t),this.direction.transformDirection(t),this}equals(t){return t.origin.equals(this.origin)&&t.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class ne{constructor(t,e,n,r,s,a,o,c,l,h,u,d,f,g,v,m){ne.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],t!==void 0&&this.set(t,e,n,r,s,a,o,c,l,h,u,d,f,g,v,m)}set(t,e,n,r,s,a,o,c,l,h,u,d,f,g,v,m){const p=this.elements;return p[0]=t,p[4]=e,p[8]=n,p[12]=r,p[1]=s,p[5]=a,p[9]=o,p[13]=c,p[2]=l,p[6]=h,p[10]=u,p[14]=d,p[3]=f,p[7]=g,p[11]=v,p[15]=m,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new ne().fromArray(this.elements)}copy(t){const e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],e[9]=n[9],e[10]=n[10],e[11]=n[11],e[12]=n[12],e[13]=n[13],e[14]=n[14],e[15]=n[15],this}copyPosition(t){const e=this.elements,n=t.elements;return e[12]=n[12],e[13]=n[13],e[14]=n[14],this}setFromMatrix3(t){const e=t.elements;return this.set(e[0],e[3],e[6],0,e[1],e[4],e[7],0,e[2],e[5],e[8],0,0,0,0,1),this}extractBasis(t,e,n){return t.setFromMatrixColumn(this,0),e.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this}makeBasis(t,e,n){return this.set(t.x,e.x,n.x,0,t.y,e.y,n.y,0,t.z,e.z,n.z,0,0,0,0,1),this}extractRotation(t){const e=this.elements,n=t.elements,r=1/sr.setFromMatrixColumn(t,0).length(),s=1/sr.setFromMatrixColumn(t,1).length(),a=1/sr.setFromMatrixColumn(t,2).length();return e[0]=n[0]*r,e[1]=n[1]*r,e[2]=n[2]*r,e[3]=0,e[4]=n[4]*s,e[5]=n[5]*s,e[6]=n[6]*s,e[7]=0,e[8]=n[8]*a,e[9]=n[9]*a,e[10]=n[10]*a,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromEuler(t){const e=this.elements,n=t.x,r=t.y,s=t.z,a=Math.cos(n),o=Math.sin(n),c=Math.cos(r),l=Math.sin(r),h=Math.cos(s),u=Math.sin(s);if(t.order==="XYZ"){const d=a*h,f=a*u,g=o*h,v=o*u;e[0]=c*h,e[4]=-c*u,e[8]=l,e[1]=f+g*l,e[5]=d-v*l,e[9]=-o*c,e[2]=v-d*l,e[6]=g+f*l,e[10]=a*c}else if(t.order==="YXZ"){const d=c*h,f=c*u,g=l*h,v=l*u;e[0]=d+v*o,e[4]=g*o-f,e[8]=a*l,e[1]=a*u,e[5]=a*h,e[9]=-o,e[2]=f*o-g,e[6]=v+d*o,e[10]=a*c}else if(t.order==="ZXY"){const d=c*h,f=c*u,g=l*h,v=l*u;e[0]=d-v*o,e[4]=-a*u,e[8]=g+f*o,e[1]=f+g*o,e[5]=a*h,e[9]=v-d*o,e[2]=-a*l,e[6]=o,e[10]=a*c}else if(t.order==="ZYX"){const d=a*h,f=a*u,g=o*h,v=o*u;e[0]=c*h,e[4]=g*l-f,e[8]=d*l+v,e[1]=c*u,e[5]=v*l+d,e[9]=f*l-g,e[2]=-l,e[6]=o*c,e[10]=a*c}else if(t.order==="YZX"){const d=a*c,f=a*l,g=o*c,v=o*l;e[0]=c*h,e[4]=v-d*u,e[8]=g*u+f,e[1]=u,e[5]=a*h,e[9]=-o*h,e[2]=-l*h,e[6]=f*u+g,e[10]=d-v*u}else if(t.order==="XZY"){const d=a*c,f=a*l,g=o*c,v=o*l;e[0]=c*h,e[4]=-u,e[8]=l*h,e[1]=d*u+v,e[5]=a*h,e[9]=f*u-g,e[2]=g*u-f,e[6]=o*h,e[10]=v*u+d}return e[3]=0,e[7]=0,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromQuaternion(t){return this.compose(zd,t,Hd)}lookAt(t,e,n){const r=this.elements;return nn.subVectors(t,e),nn.lengthSq()===0&&(nn.z=1),nn.normalize(),ui.crossVectors(n,nn),ui.lengthSq()===0&&(Math.abs(n.z)===1?nn.x+=1e-4:nn.z+=1e-4,nn.normalize(),ui.crossVectors(n,nn)),ui.normalize(),As.crossVectors(nn,ui),r[0]=ui.x,r[4]=As.x,r[8]=nn.x,r[1]=ui.y,r[5]=As.y,r[9]=nn.y,r[2]=ui.z,r[6]=As.z,r[10]=nn.z,this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const n=t.elements,r=e.elements,s=this.elements,a=n[0],o=n[4],c=n[8],l=n[12],h=n[1],u=n[5],d=n[9],f=n[13],g=n[2],v=n[6],m=n[10],p=n[14],S=n[3],b=n[7],M=n[11],E=n[15],T=r[0],A=r[4],R=r[8],_=r[12],x=r[1],y=r[5],w=r[9],D=r[13],I=r[2],F=r[6],H=r[10],$=r[14],V=r[3],Q=r[7],rt=r[11],ct=r[15];return s[0]=a*T+o*x+c*I+l*V,s[4]=a*A+o*y+c*F+l*Q,s[8]=a*R+o*w+c*H+l*rt,s[12]=a*_+o*D+c*$+l*ct,s[1]=h*T+u*x+d*I+f*V,s[5]=h*A+u*y+d*F+f*Q,s[9]=h*R+u*w+d*H+f*rt,s[13]=h*_+u*D+d*$+f*ct,s[2]=g*T+v*x+m*I+p*V,s[6]=g*A+v*y+m*F+p*Q,s[10]=g*R+v*w+m*H+p*rt,s[14]=g*_+v*D+m*$+p*ct,s[3]=S*T+b*x+M*I+E*V,s[7]=S*A+b*y+M*F+E*Q,s[11]=S*R+b*w+M*H+E*rt,s[15]=S*_+b*D+M*$+E*ct,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[4]*=t,e[8]*=t,e[12]*=t,e[1]*=t,e[5]*=t,e[9]*=t,e[13]*=t,e[2]*=t,e[6]*=t,e[10]*=t,e[14]*=t,e[3]*=t,e[7]*=t,e[11]*=t,e[15]*=t,this}determinant(){const t=this.elements,e=t[0],n=t[4],r=t[8],s=t[12],a=t[1],o=t[5],c=t[9],l=t[13],h=t[2],u=t[6],d=t[10],f=t[14],g=t[3],v=t[7],m=t[11],p=t[15];return g*(+s*c*u-r*l*u-s*o*d+n*l*d+r*o*f-n*c*f)+v*(+e*c*f-e*l*d+s*a*d-r*a*f+r*l*h-s*c*h)+m*(+e*l*u-e*o*f-s*a*u+n*a*f+s*o*h-n*l*h)+p*(-r*o*h-e*c*u+e*o*d+r*a*u-n*a*d+n*c*h)}transpose(){const t=this.elements;let e;return e=t[1],t[1]=t[4],t[4]=e,e=t[2],t[2]=t[8],t[8]=e,e=t[6],t[6]=t[9],t[9]=e,e=t[3],t[3]=t[12],t[12]=e,e=t[7],t[7]=t[13],t[13]=e,e=t[11],t[11]=t[14],t[14]=e,this}setPosition(t,e,n){const r=this.elements;return t.isVector3?(r[12]=t.x,r[13]=t.y,r[14]=t.z):(r[12]=t,r[13]=e,r[14]=n),this}invert(){const t=this.elements,e=t[0],n=t[1],r=t[2],s=t[3],a=t[4],o=t[5],c=t[6],l=t[7],h=t[8],u=t[9],d=t[10],f=t[11],g=t[12],v=t[13],m=t[14],p=t[15],S=u*m*l-v*d*l+v*c*f-o*m*f-u*c*p+o*d*p,b=g*d*l-h*m*l-g*c*f+a*m*f+h*c*p-a*d*p,M=h*v*l-g*u*l+g*o*f-a*v*f-h*o*p+a*u*p,E=g*u*c-h*v*c-g*o*d+a*v*d+h*o*m-a*u*m,T=e*S+n*b+r*M+s*E;if(T===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const A=1/T;return t[0]=S*A,t[1]=(v*d*s-u*m*s-v*r*f+n*m*f+u*r*p-n*d*p)*A,t[2]=(o*m*s-v*c*s+v*r*l-n*m*l-o*r*p+n*c*p)*A,t[3]=(u*c*s-o*d*s-u*r*l+n*d*l+o*r*f-n*c*f)*A,t[4]=b*A,t[5]=(h*m*s-g*d*s+g*r*f-e*m*f-h*r*p+e*d*p)*A,t[6]=(g*c*s-a*m*s-g*r*l+e*m*l+a*r*p-e*c*p)*A,t[7]=(a*d*s-h*c*s+h*r*l-e*d*l-a*r*f+e*c*f)*A,t[8]=M*A,t[9]=(g*u*s-h*v*s-g*n*f+e*v*f+h*n*p-e*u*p)*A,t[10]=(a*v*s-g*o*s+g*n*l-e*v*l-a*n*p+e*o*p)*A,t[11]=(h*o*s-a*u*s-h*n*l+e*u*l+a*n*f-e*o*f)*A,t[12]=E*A,t[13]=(h*v*r-g*u*r+g*n*d-e*v*d-h*n*m+e*u*m)*A,t[14]=(g*o*r-a*v*r-g*n*c+e*v*c+a*n*m-e*o*m)*A,t[15]=(a*u*r-h*o*r+h*n*c-e*u*c-a*n*d+e*o*d)*A,this}scale(t){const e=this.elements,n=t.x,r=t.y,s=t.z;return e[0]*=n,e[4]*=r,e[8]*=s,e[1]*=n,e[5]*=r,e[9]*=s,e[2]*=n,e[6]*=r,e[10]*=s,e[3]*=n,e[7]*=r,e[11]*=s,this}getMaxScaleOnAxis(){const t=this.elements,e=t[0]*t[0]+t[1]*t[1]+t[2]*t[2],n=t[4]*t[4]+t[5]*t[5]+t[6]*t[6],r=t[8]*t[8]+t[9]*t[9]+t[10]*t[10];return Math.sqrt(Math.max(e,n,r))}makeTranslation(t,e,n){return t.isVector3?this.set(1,0,0,t.x,0,1,0,t.y,0,0,1,t.z,0,0,0,1):this.set(1,0,0,t,0,1,0,e,0,0,1,n,0,0,0,1),this}makeRotationX(t){const e=Math.cos(t),n=Math.sin(t);return this.set(1,0,0,0,0,e,-n,0,0,n,e,0,0,0,0,1),this}makeRotationY(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,0,n,0,0,1,0,0,-n,0,e,0,0,0,0,1),this}makeRotationZ(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,0,n,e,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(t,e){const n=Math.cos(e),r=Math.sin(e),s=1-n,a=t.x,o=t.y,c=t.z,l=s*a,h=s*o;return this.set(l*a+n,l*o-r*c,l*c+r*o,0,l*o+r*c,h*o+n,h*c-r*a,0,l*c-r*o,h*c+r*a,s*c*c+n,0,0,0,0,1),this}makeScale(t,e,n){return this.set(t,0,0,0,0,e,0,0,0,0,n,0,0,0,0,1),this}makeShear(t,e,n,r,s,a){return this.set(1,n,s,0,t,1,a,0,e,r,1,0,0,0,0,1),this}compose(t,e,n){const r=this.elements,s=e._x,a=e._y,o=e._z,c=e._w,l=s+s,h=a+a,u=o+o,d=s*l,f=s*h,g=s*u,v=a*h,m=a*u,p=o*u,S=c*l,b=c*h,M=c*u,E=n.x,T=n.y,A=n.z;return r[0]=(1-(v+p))*E,r[1]=(f+M)*E,r[2]=(g-b)*E,r[3]=0,r[4]=(f-M)*T,r[5]=(1-(d+p))*T,r[6]=(m+S)*T,r[7]=0,r[8]=(g+b)*A,r[9]=(m-S)*A,r[10]=(1-(d+v))*A,r[11]=0,r[12]=t.x,r[13]=t.y,r[14]=t.z,r[15]=1,this}decompose(t,e,n){const r=this.elements;let s=sr.set(r[0],r[1],r[2]).length();const a=sr.set(r[4],r[5],r[6]).length(),o=sr.set(r[8],r[9],r[10]).length();this.determinant()<0&&(s=-s),t.x=r[12],t.y=r[13],t.z=r[14],bn.copy(this);const l=1/s,h=1/a,u=1/o;return bn.elements[0]*=l,bn.elements[1]*=l,bn.elements[2]*=l,bn.elements[4]*=h,bn.elements[5]*=h,bn.elements[6]*=h,bn.elements[8]*=u,bn.elements[9]*=u,bn.elements[10]*=u,e.setFromRotationMatrix(bn),n.x=s,n.y=a,n.z=o,this}makePerspective(t,e,n,r,s,a,o=Hn,c=!1){const l=this.elements,h=2*s/(e-t),u=2*s/(n-r),d=(e+t)/(e-t),f=(n+r)/(n-r);let g,v;if(c)g=s/(a-s),v=a*s/(a-s);else if(o===Hn)g=-(a+s)/(a-s),v=-2*a*s/(a-s);else if(o===ha)g=-a/(a-s),v=-a*s/(a-s);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+o);return l[0]=h,l[4]=0,l[8]=d,l[12]=0,l[1]=0,l[5]=u,l[9]=f,l[13]=0,l[2]=0,l[6]=0,l[10]=g,l[14]=v,l[3]=0,l[7]=0,l[11]=-1,l[15]=0,this}makeOrthographic(t,e,n,r,s,a,o=Hn,c=!1){const l=this.elements,h=2/(e-t),u=2/(n-r),d=-(e+t)/(e-t),f=-(n+r)/(n-r);let g,v;if(c)g=1/(a-s),v=a/(a-s);else if(o===Hn)g=-2/(a-s),v=-(a+s)/(a-s);else if(o===ha)g=-1/(a-s),v=-s/(a-s);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+o);return l[0]=h,l[4]=0,l[8]=0,l[12]=d,l[1]=0,l[5]=u,l[9]=0,l[13]=f,l[2]=0,l[6]=0,l[10]=g,l[14]=v,l[3]=0,l[7]=0,l[11]=0,l[15]=1,this}equals(t){const e=this.elements,n=t.elements;for(let r=0;r<16;r++)if(e[r]!==n[r])return!1;return!0}fromArray(t,e=0){for(let n=0;n<16;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){const n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t[e+9]=n[9],t[e+10]=n[10],t[e+11]=n[11],t[e+12]=n[12],t[e+13]=n[13],t[e+14]=n[14],t[e+15]=n[15],t}}const sr=new U,bn=new ne,zd=new U(0,0,0),Hd=new U(1,1,1),ui=new U,As=new U,nn=new U,fl=new ne,dl=new Fe;class _n{constructor(t=0,e=0,n=0,r=_n.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=e,this._z=n,this._order=r}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get order(){return this._order}set order(t){this._order=t,this._onChangeCallback()}set(t,e,n,r=this._order){return this._x=t,this._y=e,this._z=n,this._order=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(t){return this._x=t._x,this._y=t._y,this._z=t._z,this._order=t._order,this._onChangeCallback(),this}setFromRotationMatrix(t,e=this._order,n=!0){const r=t.elements,s=r[0],a=r[4],o=r[8],c=r[1],l=r[5],h=r[9],u=r[2],d=r[6],f=r[10];switch(e){case"XYZ":this._y=Math.asin(Qt(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-h,f),this._z=Math.atan2(-a,s)):(this._x=Math.atan2(d,l),this._z=0);break;case"YXZ":this._x=Math.asin(-Qt(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(o,f),this._z=Math.atan2(c,l)):(this._y=Math.atan2(-u,s),this._z=0);break;case"ZXY":this._x=Math.asin(Qt(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(-u,f),this._z=Math.atan2(-a,l)):(this._y=0,this._z=Math.atan2(c,s));break;case"ZYX":this._y=Math.asin(-Qt(u,-1,1)),Math.abs(u)<.9999999?(this._x=Math.atan2(d,f),this._z=Math.atan2(c,s)):(this._x=0,this._z=Math.atan2(-a,l));break;case"YZX":this._z=Math.asin(Qt(c,-1,1)),Math.abs(c)<.9999999?(this._x=Math.atan2(-h,l),this._y=Math.atan2(-u,s)):(this._x=0,this._y=Math.atan2(o,f));break;case"XZY":this._z=Math.asin(-Qt(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(d,l),this._y=Math.atan2(o,s)):(this._x=Math.atan2(-h,f),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+e)}return this._order=e,n===!0&&this._onChangeCallback(),this}setFromQuaternion(t,e,n){return fl.makeRotationFromQuaternion(t),this.setFromRotationMatrix(fl,e,n)}setFromVector3(t,e=this._order){return this.set(t.x,t.y,t.z,e)}reorder(t){return dl.setFromEuler(this),this.setFromQuaternion(dl,t)}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._order===this._order}fromArray(t){return this._x=t[0],this._y=t[1],this._z=t[2],t[3]!==void 0&&(this._order=t[3]),this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._order,t}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}_n.DEFAULT_ORDER="XYZ";class au{constructor(){this.mask=1}set(t){this.mask=(1<<t|0)>>>0}enable(t){this.mask|=1<<t|0}enableAll(){this.mask=-1}toggle(t){this.mask^=1<<t|0}disable(t){this.mask&=~(1<<t|0)}disableAll(){this.mask=0}test(t){return(this.mask&t.mask)!==0}isEnabled(t){return(this.mask&(1<<t|0))!==0}}let Vd=0;const pl=new U,ar=new Fe,qn=new ne,Rs=new U,Vr=new U,Gd=new U,Wd=new Fe,ml=new U(1,0,0),gl=new U(0,1,0),vl=new U(0,0,1),_l={type:"added"},Xd={type:"removed"},or={type:"childadded",child:null},Pa={type:"childremoved",child:null};class Ue extends Ur{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:Vd++}),this.uuid=Zi(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=Ue.DEFAULT_UP.clone();const t=new U,e=new _n,n=new Fe,r=new U(1,1,1);function s(){n.setFromEuler(e,!1)}function a(){e.setFromQuaternion(n,void 0,!1)}e._onChange(s),n._onChange(a),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:e},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:r},modelViewMatrix:{value:new ne},normalMatrix:{value:new Zt}}),this.matrix=new ne,this.matrixWorld=new ne,this.matrixAutoUpdate=Ue.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=Ue.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new au,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(t){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(t),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(t){return this.quaternion.premultiply(t),this}setRotationFromAxisAngle(t,e){this.quaternion.setFromAxisAngle(t,e)}setRotationFromEuler(t){this.quaternion.setFromEuler(t,!0)}setRotationFromMatrix(t){this.quaternion.setFromRotationMatrix(t)}setRotationFromQuaternion(t){this.quaternion.copy(t)}rotateOnAxis(t,e){return ar.setFromAxisAngle(t,e),this.quaternion.multiply(ar),this}rotateOnWorldAxis(t,e){return ar.setFromAxisAngle(t,e),this.quaternion.premultiply(ar),this}rotateX(t){return this.rotateOnAxis(ml,t)}rotateY(t){return this.rotateOnAxis(gl,t)}rotateZ(t){return this.rotateOnAxis(vl,t)}translateOnAxis(t,e){return pl.copy(t).applyQuaternion(this.quaternion),this.position.add(pl.multiplyScalar(e)),this}translateX(t){return this.translateOnAxis(ml,t)}translateY(t){return this.translateOnAxis(gl,t)}translateZ(t){return this.translateOnAxis(vl,t)}localToWorld(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(this.matrixWorld)}worldToLocal(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(qn.copy(this.matrixWorld).invert())}lookAt(t,e,n){t.isVector3?Rs.copy(t):Rs.set(t,e,n);const r=this.parent;this.updateWorldMatrix(!0,!1),Vr.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?qn.lookAt(Vr,Rs,this.up):qn.lookAt(Rs,Vr,this.up),this.quaternion.setFromRotationMatrix(qn),r&&(qn.extractRotation(r.matrixWorld),ar.setFromRotationMatrix(qn),this.quaternion.premultiply(ar.invert()))}add(t){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.add(arguments[e]);return this}return t===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",t),this):(t&&t.isObject3D?(t.removeFromParent(),t.parent=this,this.children.push(t),t.dispatchEvent(_l),or.child=t,this.dispatchEvent(or),or.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",t),this)}remove(t){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}const e=this.children.indexOf(t);return e!==-1&&(t.parent=null,this.children.splice(e,1),t.dispatchEvent(Xd),Pa.child=t,this.dispatchEvent(Pa),Pa.child=null),this}removeFromParent(){const t=this.parent;return t!==null&&t.remove(this),this}clear(){return this.remove(...this.children)}attach(t){return this.updateWorldMatrix(!0,!1),qn.copy(this.matrixWorld).invert(),t.parent!==null&&(t.parent.updateWorldMatrix(!0,!1),qn.multiply(t.parent.matrixWorld)),t.applyMatrix4(qn),t.removeFromParent(),t.parent=this,this.children.push(t),t.updateWorldMatrix(!1,!0),t.dispatchEvent(_l),or.child=t,this.dispatchEvent(or),or.child=null,this}getObjectById(t){return this.getObjectByProperty("id",t)}getObjectByName(t){return this.getObjectByProperty("name",t)}getObjectByProperty(t,e){if(this[t]===e)return this;for(let n=0,r=this.children.length;n<r;n++){const a=this.children[n].getObjectByProperty(t,e);if(a!==void 0)return a}}getObjectsByProperty(t,e,n=[]){this[t]===e&&n.push(this);const r=this.children;for(let s=0,a=r.length;s<a;s++)r[s].getObjectsByProperty(t,e,n);return n}getWorldPosition(t){return this.updateWorldMatrix(!0,!1),t.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Vr,t,Gd),t}getWorldScale(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Vr,Wd,t),t}getWorldDirection(t){this.updateWorldMatrix(!0,!1);const e=this.matrixWorld.elements;return t.set(e[8],e[9],e[10]).normalize()}raycast(){}traverse(t){t(this);const e=this.children;for(let n=0,r=e.length;n<r;n++)e[n].traverse(t)}traverseVisible(t){if(this.visible===!1)return;t(this);const e=this.children;for(let n=0,r=e.length;n<r;n++)e[n].traverseVisible(t)}traverseAncestors(t){const e=this.parent;e!==null&&(t(e),e.traverseAncestors(t))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(t){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||t)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,t=!0);const e=this.children;for(let n=0,r=e.length;n<r;n++)e[n].updateMatrixWorld(t)}updateWorldMatrix(t,e){const n=this.parent;if(t===!0&&n!==null&&n.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),e===!0){const r=this.children;for(let s=0,a=r.length;s<a;s++)r[s].updateWorldMatrix(!1,!0)}}toJSON(t){const e=t===void 0||typeof t=="string",n={};e&&(t={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});const r={};r.uuid=this.uuid,r.type=this.type,this.name!==""&&(r.name=this.name),this.castShadow===!0&&(r.castShadow=!0),this.receiveShadow===!0&&(r.receiveShadow=!0),this.visible===!1&&(r.visible=!1),this.frustumCulled===!1&&(r.frustumCulled=!1),this.renderOrder!==0&&(r.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(r.userData=this.userData),r.layers=this.layers.mask,r.matrix=this.matrix.toArray(),r.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(r.matrixAutoUpdate=!1),this.isInstancedMesh&&(r.type="InstancedMesh",r.count=this.count,r.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(r.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(r.type="BatchedMesh",r.perObjectFrustumCulled=this.perObjectFrustumCulled,r.sortObjects=this.sortObjects,r.drawRanges=this._drawRanges,r.reservedRanges=this._reservedRanges,r.geometryInfo=this._geometryInfo.map(o=>({...o,boundingBox:o.boundingBox?o.boundingBox.toJSON():void 0,boundingSphere:o.boundingSphere?o.boundingSphere.toJSON():void 0})),r.instanceInfo=this._instanceInfo.map(o=>({...o})),r.availableInstanceIds=this._availableInstanceIds.slice(),r.availableGeometryIds=this._availableGeometryIds.slice(),r.nextIndexStart=this._nextIndexStart,r.nextVertexStart=this._nextVertexStart,r.geometryCount=this._geometryCount,r.maxInstanceCount=this._maxInstanceCount,r.maxVertexCount=this._maxVertexCount,r.maxIndexCount=this._maxIndexCount,r.geometryInitialized=this._geometryInitialized,r.matricesTexture=this._matricesTexture.toJSON(t),r.indirectTexture=this._indirectTexture.toJSON(t),this._colorsTexture!==null&&(r.colorsTexture=this._colorsTexture.toJSON(t)),this.boundingSphere!==null&&(r.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(r.boundingBox=this.boundingBox.toJSON()));function s(o,c){return o[c.uuid]===void 0&&(o[c.uuid]=c.toJSON(t)),c.uuid}if(this.isScene)this.background&&(this.background.isColor?r.background=this.background.toJSON():this.background.isTexture&&(r.background=this.background.toJSON(t).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(r.environment=this.environment.toJSON(t).uuid);else if(this.isMesh||this.isLine||this.isPoints){r.geometry=s(t.geometries,this.geometry);const o=this.geometry.parameters;if(o!==void 0&&o.shapes!==void 0){const c=o.shapes;if(Array.isArray(c))for(let l=0,h=c.length;l<h;l++){const u=c[l];s(t.shapes,u)}else s(t.shapes,c)}}if(this.isSkinnedMesh&&(r.bindMode=this.bindMode,r.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(s(t.skeletons,this.skeleton),r.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const o=[];for(let c=0,l=this.material.length;c<l;c++)o.push(s(t.materials,this.material[c]));r.material=o}else r.material=s(t.materials,this.material);if(this.children.length>0){r.children=[];for(let o=0;o<this.children.length;o++)r.children.push(this.children[o].toJSON(t).object)}if(this.animations.length>0){r.animations=[];for(let o=0;o<this.animations.length;o++){const c=this.animations[o];r.animations.push(s(t.animations,c))}}if(e){const o=a(t.geometries),c=a(t.materials),l=a(t.textures),h=a(t.images),u=a(t.shapes),d=a(t.skeletons),f=a(t.animations),g=a(t.nodes);o.length>0&&(n.geometries=o),c.length>0&&(n.materials=c),l.length>0&&(n.textures=l),h.length>0&&(n.images=h),u.length>0&&(n.shapes=u),d.length>0&&(n.skeletons=d),f.length>0&&(n.animations=f),g.length>0&&(n.nodes=g)}return n.object=r,n;function a(o){const c=[];for(const l in o){const h=o[l];delete h.metadata,c.push(h)}return c}}clone(t){return new this.constructor().copy(this,t)}copy(t,e=!0){if(this.name=t.name,this.up.copy(t.up),this.position.copy(t.position),this.rotation.order=t.rotation.order,this.quaternion.copy(t.quaternion),this.scale.copy(t.scale),this.matrix.copy(t.matrix),this.matrixWorld.copy(t.matrixWorld),this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrixWorldAutoUpdate=t.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=t.matrixWorldNeedsUpdate,this.layers.mask=t.layers.mask,this.visible=t.visible,this.castShadow=t.castShadow,this.receiveShadow=t.receiveShadow,this.frustumCulled=t.frustumCulled,this.renderOrder=t.renderOrder,this.animations=t.animations.slice(),this.userData=JSON.parse(JSON.stringify(t.userData)),e===!0)for(let n=0;n<t.children.length;n++){const r=t.children[n];this.add(r.clone())}return this}}Ue.DEFAULT_UP=new U(0,1,0);Ue.DEFAULT_MATRIX_AUTO_UPDATE=!0;Ue.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const yn=new U,Yn=new U,Da=new U,$n=new U,cr=new U,lr=new U,xl=new U,Ia=new U,Ua=new U,Na=new U,Fa=new se,Oa=new se,Ba=new se;class Tn{constructor(t=new U,e=new U,n=new U){this.a=t,this.b=e,this.c=n}static getNormal(t,e,n,r){r.subVectors(n,e),yn.subVectors(t,e),r.cross(yn);const s=r.lengthSq();return s>0?r.multiplyScalar(1/Math.sqrt(s)):r.set(0,0,0)}static getBarycoord(t,e,n,r,s){yn.subVectors(r,e),Yn.subVectors(n,e),Da.subVectors(t,e);const a=yn.dot(yn),o=yn.dot(Yn),c=yn.dot(Da),l=Yn.dot(Yn),h=Yn.dot(Da),u=a*l-o*o;if(u===0)return s.set(0,0,0),null;const d=1/u,f=(l*c-o*h)*d,g=(a*h-o*c)*d;return s.set(1-f-g,g,f)}static containsPoint(t,e,n,r){return this.getBarycoord(t,e,n,r,$n)===null?!1:$n.x>=0&&$n.y>=0&&$n.x+$n.y<=1}static getInterpolation(t,e,n,r,s,a,o,c){return this.getBarycoord(t,e,n,r,$n)===null?(c.x=0,c.y=0,"z"in c&&(c.z=0),"w"in c&&(c.w=0),null):(c.setScalar(0),c.addScaledVector(s,$n.x),c.addScaledVector(a,$n.y),c.addScaledVector(o,$n.z),c)}static getInterpolatedAttribute(t,e,n,r,s,a){return Fa.setScalar(0),Oa.setScalar(0),Ba.setScalar(0),Fa.fromBufferAttribute(t,e),Oa.fromBufferAttribute(t,n),Ba.fromBufferAttribute(t,r),a.setScalar(0),a.addScaledVector(Fa,s.x),a.addScaledVector(Oa,s.y),a.addScaledVector(Ba,s.z),a}static isFrontFacing(t,e,n,r){return yn.subVectors(n,e),Yn.subVectors(t,e),yn.cross(Yn).dot(r)<0}set(t,e,n){return this.a.copy(t),this.b.copy(e),this.c.copy(n),this}setFromPointsAndIndices(t,e,n,r){return this.a.copy(t[e]),this.b.copy(t[n]),this.c.copy(t[r]),this}setFromAttributeAndIndices(t,e,n,r){return this.a.fromBufferAttribute(t,e),this.b.fromBufferAttribute(t,n),this.c.fromBufferAttribute(t,r),this}clone(){return new this.constructor().copy(this)}copy(t){return this.a.copy(t.a),this.b.copy(t.b),this.c.copy(t.c),this}getArea(){return yn.subVectors(this.c,this.b),Yn.subVectors(this.a,this.b),yn.cross(Yn).length()*.5}getMidpoint(t){return t.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(t){return Tn.getNormal(this.a,this.b,this.c,t)}getPlane(t){return t.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,e){return Tn.getBarycoord(t,this.a,this.b,this.c,e)}getInterpolation(t,e,n,r,s){return Tn.getInterpolation(t,this.a,this.b,this.c,e,n,r,s)}containsPoint(t){return Tn.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return Tn.isFrontFacing(this.a,this.b,this.c,t)}intersectsBox(t){return t.intersectsTriangle(this)}closestPointToPoint(t,e){const n=this.a,r=this.b,s=this.c;let a,o;cr.subVectors(r,n),lr.subVectors(s,n),Ia.subVectors(t,n);const c=cr.dot(Ia),l=lr.dot(Ia);if(c<=0&&l<=0)return e.copy(n);Ua.subVectors(t,r);const h=cr.dot(Ua),u=lr.dot(Ua);if(h>=0&&u<=h)return e.copy(r);const d=c*u-h*l;if(d<=0&&c>=0&&h<=0)return a=c/(c-h),e.copy(n).addScaledVector(cr,a);Na.subVectors(t,s);const f=cr.dot(Na),g=lr.dot(Na);if(g>=0&&f<=g)return e.copy(s);const v=f*l-c*g;if(v<=0&&l>=0&&g<=0)return o=l/(l-g),e.copy(n).addScaledVector(lr,o);const m=h*g-f*u;if(m<=0&&u-h>=0&&f-g>=0)return xl.subVectors(s,r),o=(u-h)/(u-h+(f-g)),e.copy(r).addScaledVector(xl,o);const p=1/(m+v+d);return a=v*p,o=d*p,e.copy(n).addScaledVector(cr,a).addScaledVector(lr,o)}equals(t){return t.a.equals(this.a)&&t.b.equals(this.b)&&t.c.equals(this.c)}}const ou={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},fi={h:0,s:0,l:0},Cs={h:0,s:0,l:0};function ka(i,t,e){return e<0&&(e+=1),e>1&&(e-=1),e<1/6?i+(t-i)*6*e:e<1/2?t:e<2/3?i+(t-i)*6*(2/3-e):i}class Ht{constructor(t,e,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(t,e,n)}set(t,e,n){if(e===void 0&&n===void 0){const r=t;r&&r.isColor?this.copy(r):typeof r=="number"?this.setHex(r):typeof r=="string"&&this.setStyle(r)}else this.setRGB(t,e,n);return this}setScalar(t){return this.r=t,this.g=t,this.b=t,this}setHex(t,e=on){return t=Math.floor(t),this.r=(t>>16&255)/255,this.g=(t>>8&255)/255,this.b=(t&255)/255,re.colorSpaceToWorking(this,e),this}setRGB(t,e,n,r=re.workingColorSpace){return this.r=t,this.g=e,this.b=n,re.colorSpaceToWorking(this,r),this}setHSL(t,e,n,r=re.workingColorSpace){if(t=Mc(t,1),e=Qt(e,0,1),n=Qt(n,0,1),e===0)this.r=this.g=this.b=n;else{const s=n<=.5?n*(1+e):n+e-n*e,a=2*n-s;this.r=ka(a,s,t+1/3),this.g=ka(a,s,t),this.b=ka(a,s,t-1/3)}return re.colorSpaceToWorking(this,r),this}setStyle(t,e=on){function n(s){s!==void 0&&parseFloat(s)<1&&console.warn("THREE.Color: Alpha component of "+t+" will be ignored.")}let r;if(r=/^(\w+)\(([^\)]*)\)/.exec(t)){let s;const a=r[1],o=r[2];switch(a){case"rgb":case"rgba":if(s=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(s[4]),this.setRGB(Math.min(255,parseInt(s[1],10))/255,Math.min(255,parseInt(s[2],10))/255,Math.min(255,parseInt(s[3],10))/255,e);if(s=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(s[4]),this.setRGB(Math.min(100,parseInt(s[1],10))/100,Math.min(100,parseInt(s[2],10))/100,Math.min(100,parseInt(s[3],10))/100,e);break;case"hsl":case"hsla":if(s=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(s[4]),this.setHSL(parseFloat(s[1])/360,parseFloat(s[2])/100,parseFloat(s[3])/100,e);break;default:console.warn("THREE.Color: Unknown color model "+t)}}else if(r=/^\#([A-Fa-f\d]+)$/.exec(t)){const s=r[1],a=s.length;if(a===3)return this.setRGB(parseInt(s.charAt(0),16)/15,parseInt(s.charAt(1),16)/15,parseInt(s.charAt(2),16)/15,e);if(a===6)return this.setHex(parseInt(s,16),e);console.warn("THREE.Color: Invalid hex color "+t)}else if(t&&t.length>0)return this.setColorName(t,e);return this}setColorName(t,e=on){const n=ou[t.toLowerCase()];return n!==void 0?this.setHex(n,e):console.warn("THREE.Color: Unknown color "+t),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(t){return this.r=t.r,this.g=t.g,this.b=t.b,this}copySRGBToLinear(t){return this.r=ei(t.r),this.g=ei(t.g),this.b=ei(t.b),this}copyLinearToSRGB(t){return this.r=wr(t.r),this.g=wr(t.g),this.b=wr(t.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(t=on){return re.workingToColorSpace(ze.copy(this),t),Math.round(Qt(ze.r*255,0,255))*65536+Math.round(Qt(ze.g*255,0,255))*256+Math.round(Qt(ze.b*255,0,255))}getHexString(t=on){return("000000"+this.getHex(t).toString(16)).slice(-6)}getHSL(t,e=re.workingColorSpace){re.workingToColorSpace(ze.copy(this),e);const n=ze.r,r=ze.g,s=ze.b,a=Math.max(n,r,s),o=Math.min(n,r,s);let c,l;const h=(o+a)/2;if(o===a)c=0,l=0;else{const u=a-o;switch(l=h<=.5?u/(a+o):u/(2-a-o),a){case n:c=(r-s)/u+(r<s?6:0);break;case r:c=(s-n)/u+2;break;case s:c=(n-r)/u+4;break}c/=6}return t.h=c,t.s=l,t.l=h,t}getRGB(t,e=re.workingColorSpace){return re.workingToColorSpace(ze.copy(this),e),t.r=ze.r,t.g=ze.g,t.b=ze.b,t}getStyle(t=on){re.workingToColorSpace(ze.copy(this),t);const e=ze.r,n=ze.g,r=ze.b;return t!==on?`color(${t} ${e.toFixed(3)} ${n.toFixed(3)} ${r.toFixed(3)})`:`rgb(${Math.round(e*255)},${Math.round(n*255)},${Math.round(r*255)})`}offsetHSL(t,e,n){return this.getHSL(fi),this.setHSL(fi.h+t,fi.s+e,fi.l+n)}add(t){return this.r+=t.r,this.g+=t.g,this.b+=t.b,this}addColors(t,e){return this.r=t.r+e.r,this.g=t.g+e.g,this.b=t.b+e.b,this}addScalar(t){return this.r+=t,this.g+=t,this.b+=t,this}sub(t){return this.r=Math.max(0,this.r-t.r),this.g=Math.max(0,this.g-t.g),this.b=Math.max(0,this.b-t.b),this}multiply(t){return this.r*=t.r,this.g*=t.g,this.b*=t.b,this}multiplyScalar(t){return this.r*=t,this.g*=t,this.b*=t,this}lerp(t,e){return this.r+=(t.r-this.r)*e,this.g+=(t.g-this.g)*e,this.b+=(t.b-this.b)*e,this}lerpColors(t,e,n){return this.r=t.r+(e.r-t.r)*n,this.g=t.g+(e.g-t.g)*n,this.b=t.b+(e.b-t.b)*n,this}lerpHSL(t,e){this.getHSL(fi),t.getHSL(Cs);const n=jr(fi.h,Cs.h,e),r=jr(fi.s,Cs.s,e),s=jr(fi.l,Cs.l,e);return this.setHSL(n,r,s),this}setFromVector3(t){return this.r=t.x,this.g=t.y,this.b=t.z,this}applyMatrix3(t){const e=this.r,n=this.g,r=this.b,s=t.elements;return this.r=s[0]*e+s[3]*n+s[6]*r,this.g=s[1]*e+s[4]*n+s[7]*r,this.b=s[2]*e+s[5]*n+s[8]*r,this}equals(t){return t.r===this.r&&t.g===this.g&&t.b===this.b}fromArray(t,e=0){return this.r=t[e],this.g=t[e+1],this.b=t[e+2],this}toArray(t=[],e=0){return t[e]=this.r,t[e+1]=this.g,t[e+2]=this.b,t}fromBufferAttribute(t,e){return this.r=t.getX(e),this.g=t.getY(e),this.b=t.getZ(e),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const ze=new Ht;Ht.NAMES=ou;let qd=0;class ps extends Ur{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:qd++}),this.uuid=Zi(),this.name="",this.type="Material",this.blending=Er,this.side=Si,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=vo,this.blendDst=_o,this.blendEquation=Fi,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Ht(0,0,0),this.blendAlpha=0,this.depthFunc=Ar,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=rl,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=tr,this.stencilZFail=tr,this.stencilZPass=tr,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(t){this._alphaTest>0!=t>0&&this.version++,this._alphaTest=t}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(t){if(t!==void 0)for(const e in t){const n=t[e];if(n===void 0){console.warn(`THREE.Material: parameter '${e}' has value of undefined.`);continue}const r=this[e];if(r===void 0){console.warn(`THREE.Material: '${e}' is not a property of THREE.${this.type}.`);continue}r&&r.isColor?r.set(n):r&&r.isVector3&&n&&n.isVector3?r.copy(n):this[e]=n}}toJSON(t){const e=t===void 0||typeof t=="string";e&&(t={textures:{},images:{}});const n={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(t).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(t).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(t).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(n.sheenColorMap=this.sheenColorMap.toJSON(t).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(n.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(t).uuid),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(t).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(t).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(t).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(t).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(t).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(t).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(t).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(t).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(t).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(t).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(t).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(t).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(t).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(t).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(t).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(t).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(t).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(t).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(t).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(t).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(t).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==Er&&(n.blending=this.blending),this.side!==Si&&(n.side=this.side),this.vertexColors===!0&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=!0),this.blendSrc!==vo&&(n.blendSrc=this.blendSrc),this.blendDst!==_o&&(n.blendDst=this.blendDst),this.blendEquation!==Fi&&(n.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(n.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(n.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(n.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(n.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(n.blendAlpha=this.blendAlpha),this.depthFunc!==Ar&&(n.depthFunc=this.depthFunc),this.depthTest===!1&&(n.depthTest=this.depthTest),this.depthWrite===!1&&(n.depthWrite=this.depthWrite),this.colorWrite===!1&&(n.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(n.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==rl&&(n.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(n.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(n.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==tr&&(n.stencilFail=this.stencilFail),this.stencilZFail!==tr&&(n.stencilZFail=this.stencilZFail),this.stencilZPass!==tr&&(n.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(n.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=!0),this.alphaToCoverage===!0&&(n.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=!0),this.forceSinglePass===!0&&(n.forceSinglePass=!0),this.wireframe===!0&&(n.wireframe=!0),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=!0),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData);function r(s){const a=[];for(const o in s){const c=s[o];delete c.metadata,a.push(c)}return a}if(e){const s=r(t.textures),a=r(t.images);s.length>0&&(n.textures=s),a.length>0&&(n.images=a)}return n}clone(){return new this.constructor().copy(this)}copy(t){this.name=t.name,this.blending=t.blending,this.side=t.side,this.vertexColors=t.vertexColors,this.opacity=t.opacity,this.transparent=t.transparent,this.blendSrc=t.blendSrc,this.blendDst=t.blendDst,this.blendEquation=t.blendEquation,this.blendSrcAlpha=t.blendSrcAlpha,this.blendDstAlpha=t.blendDstAlpha,this.blendEquationAlpha=t.blendEquationAlpha,this.blendColor.copy(t.blendColor),this.blendAlpha=t.blendAlpha,this.depthFunc=t.depthFunc,this.depthTest=t.depthTest,this.depthWrite=t.depthWrite,this.stencilWriteMask=t.stencilWriteMask,this.stencilFunc=t.stencilFunc,this.stencilRef=t.stencilRef,this.stencilFuncMask=t.stencilFuncMask,this.stencilFail=t.stencilFail,this.stencilZFail=t.stencilZFail,this.stencilZPass=t.stencilZPass,this.stencilWrite=t.stencilWrite;const e=t.clippingPlanes;let n=null;if(e!==null){const r=e.length;n=new Array(r);for(let s=0;s!==r;++s)n[s]=e[s].clone()}return this.clippingPlanes=n,this.clipIntersection=t.clipIntersection,this.clipShadows=t.clipShadows,this.shadowSide=t.shadowSide,this.colorWrite=t.colorWrite,this.precision=t.precision,this.polygonOffset=t.polygonOffset,this.polygonOffsetFactor=t.polygonOffsetFactor,this.polygonOffsetUnits=t.polygonOffsetUnits,this.dithering=t.dithering,this.alphaTest=t.alphaTest,this.alphaHash=t.alphaHash,this.alphaToCoverage=t.alphaToCoverage,this.premultipliedAlpha=t.premultipliedAlpha,this.forceSinglePass=t.forceSinglePass,this.visible=t.visible,this.toneMapped=t.toneMapped,this.userData=JSON.parse(JSON.stringify(t.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(t){t===!0&&this.version++}}class ga extends ps{constructor(t){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new Ht(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new _n,this.combine=Xh,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.fog=t.fog,this}}const Jn=Yd();function Yd(){const i=new ArrayBuffer(4),t=new Float32Array(i),e=new Uint32Array(i),n=new Uint32Array(512),r=new Uint32Array(512);for(let c=0;c<256;++c){const l=c-127;l<-27?(n[c]=0,n[c|256]=32768,r[c]=24,r[c|256]=24):l<-14?(n[c]=1024>>-l-14,n[c|256]=1024>>-l-14|32768,r[c]=-l-1,r[c|256]=-l-1):l<=15?(n[c]=l+15<<10,n[c|256]=l+15<<10|32768,r[c]=13,r[c|256]=13):l<128?(n[c]=31744,n[c|256]=64512,r[c]=24,r[c|256]=24):(n[c]=31744,n[c|256]=64512,r[c]=13,r[c|256]=13)}const s=new Uint32Array(2048),a=new Uint32Array(64),o=new Uint32Array(64);for(let c=1;c<1024;++c){let l=c<<13,h=0;for(;(l&8388608)===0;)l<<=1,h-=8388608;l&=-8388609,h+=947912704,s[c]=l|h}for(let c=1024;c<2048;++c)s[c]=939524096+(c-1024<<13);for(let c=1;c<31;++c)a[c]=c<<23;a[31]=1199570944,a[32]=2147483648;for(let c=33;c<63;++c)a[c]=2147483648+(c-32<<23);a[63]=3347054592;for(let c=1;c<64;++c)c!==32&&(o[c]=1024);return{floatView:t,uint32View:e,baseTable:n,shiftTable:r,mantissaTable:s,exponentTable:a,offsetTable:o}}function $d(i){Math.abs(i)>65504&&console.warn("THREE.DataUtils.toHalfFloat(): Value out of range."),i=Qt(i,-65504,65504),Jn.floatView[0]=i;const t=Jn.uint32View[0],e=t>>23&511;return Jn.baseTable[e]+((t&8388607)>>Jn.shiftTable[e])}function jd(i){const t=i>>10;return Jn.uint32View[0]=Jn.mantissaTable[Jn.offsetTable[t]+(i&1023)]+Jn.exponentTable[t],Jn.floatView[0]}class Ls{static toHalfFloat(t){return $d(t)}static fromHalfFloat(t){return jd(t)}}const we=new U,Ps=new Rt;let Zd=0;class oe{constructor(t,e,n=!1){if(Array.isArray(t))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:Zd++}),this.name="",this.array=t,this.itemSize=e,this.count=t!==void 0?t.length/e:0,this.normalized=n,this.usage=sl,this.updateRanges=[],this.gpuType=zn,this.version=0}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.name=t.name,this.array=new t.array.constructor(t.array),this.itemSize=t.itemSize,this.count=t.count,this.normalized=t.normalized,this.usage=t.usage,this.gpuType=t.gpuType,this}copyAt(t,e,n){t*=this.itemSize,n*=e.itemSize;for(let r=0,s=this.itemSize;r<s;r++)this.array[t+r]=e.array[n+r];return this}copyArray(t){return this.array.set(t),this}applyMatrix3(t){if(this.itemSize===2)for(let e=0,n=this.count;e<n;e++)Ps.fromBufferAttribute(this,e),Ps.applyMatrix3(t),this.setXY(e,Ps.x,Ps.y);else if(this.itemSize===3)for(let e=0,n=this.count;e<n;e++)we.fromBufferAttribute(this,e),we.applyMatrix3(t),this.setXYZ(e,we.x,we.y,we.z);return this}applyMatrix4(t){for(let e=0,n=this.count;e<n;e++)we.fromBufferAttribute(this,e),we.applyMatrix4(t),this.setXYZ(e,we.x,we.y,we.z);return this}applyNormalMatrix(t){for(let e=0,n=this.count;e<n;e++)we.fromBufferAttribute(this,e),we.applyNormalMatrix(t),this.setXYZ(e,we.x,we.y,we.z);return this}transformDirection(t){for(let e=0,n=this.count;e<n;e++)we.fromBufferAttribute(this,e),we.transformDirection(t),this.setXYZ(e,we.x,we.y,we.z);return this}set(t,e=0){return this.array.set(t,e),this}getComponent(t,e){let n=this.array[t*this.itemSize+e];return this.normalized&&(n=xr(n,this.array)),n}setComponent(t,e,n){return this.normalized&&(n=We(n,this.array)),this.array[t*this.itemSize+e]=n,this}getX(t){let e=this.array[t*this.itemSize];return this.normalized&&(e=xr(e,this.array)),e}setX(t,e){return this.normalized&&(e=We(e,this.array)),this.array[t*this.itemSize]=e,this}getY(t){let e=this.array[t*this.itemSize+1];return this.normalized&&(e=xr(e,this.array)),e}setY(t,e){return this.normalized&&(e=We(e,this.array)),this.array[t*this.itemSize+1]=e,this}getZ(t){let e=this.array[t*this.itemSize+2];return this.normalized&&(e=xr(e,this.array)),e}setZ(t,e){return this.normalized&&(e=We(e,this.array)),this.array[t*this.itemSize+2]=e,this}getW(t){let e=this.array[t*this.itemSize+3];return this.normalized&&(e=xr(e,this.array)),e}setW(t,e){return this.normalized&&(e=We(e,this.array)),this.array[t*this.itemSize+3]=e,this}setXY(t,e,n){return t*=this.itemSize,this.normalized&&(e=We(e,this.array),n=We(n,this.array)),this.array[t+0]=e,this.array[t+1]=n,this}setXYZ(t,e,n,r){return t*=this.itemSize,this.normalized&&(e=We(e,this.array),n=We(n,this.array),r=We(r,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=r,this}setXYZW(t,e,n,r,s){return t*=this.itemSize,this.normalized&&(e=We(e,this.array),n=We(n,this.array),r=We(r,this.array),s=We(s,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=r,this.array[t+3]=s,this}onUpload(t){return this.onUploadCallback=t,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const t={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(t.name=this.name),this.usage!==sl&&(t.usage=this.usage),t}}class cu extends oe{constructor(t,e,n){super(new Uint16Array(t),e,n)}}class lu extends oe{constructor(t,e,n){super(new Uint32Array(t),e,n)}}class he extends oe{constructor(t,e,n){super(new Float32Array(t),e,n)}}let Kd=0;const pn=new ne,za=new Ue,hr=new U,rn=new Nr,Gr=new Nr,De=new U;class Ne extends Ur{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:Kd++}),this.uuid=Zi(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(t){return Array.isArray(t)?this.index=new(ru(t)?lu:cu)(t,1):this.index=t,this}setIndirect(t){return this.indirect=t,this}getIndirect(){return this.indirect}getAttribute(t){return this.attributes[t]}setAttribute(t,e){return this.attributes[t]=e,this}deleteAttribute(t){return delete this.attributes[t],this}hasAttribute(t){return this.attributes[t]!==void 0}addGroup(t,e,n=0){this.groups.push({start:t,count:e,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(t,e){this.drawRange.start=t,this.drawRange.count=e}applyMatrix4(t){const e=this.attributes.position;e!==void 0&&(e.applyMatrix4(t),e.needsUpdate=!0);const n=this.attributes.normal;if(n!==void 0){const s=new Zt().getNormalMatrix(t);n.applyNormalMatrix(s),n.needsUpdate=!0}const r=this.attributes.tangent;return r!==void 0&&(r.transformDirection(t),r.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(t){return pn.makeRotationFromQuaternion(t),this.applyMatrix4(pn),this}rotateX(t){return pn.makeRotationX(t),this.applyMatrix4(pn),this}rotateY(t){return pn.makeRotationY(t),this.applyMatrix4(pn),this}rotateZ(t){return pn.makeRotationZ(t),this.applyMatrix4(pn),this}translate(t,e,n){return pn.makeTranslation(t,e,n),this.applyMatrix4(pn),this}scale(t,e,n){return pn.makeScale(t,e,n),this.applyMatrix4(pn),this}lookAt(t){return za.lookAt(t),za.updateMatrix(),this.applyMatrix4(za.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(hr).negate(),this.translate(hr.x,hr.y,hr.z),this}setFromPoints(t){const e=this.getAttribute("position");if(e===void 0){const n=[];for(let r=0,s=t.length;r<s;r++){const a=t[r];n.push(a.x,a.y,a.z||0)}this.setAttribute("position",new he(n,3))}else{const n=Math.min(t.length,e.count);for(let r=0;r<n;r++){const s=t[r];e.setXYZ(r,s.x,s.y,s.z||0)}t.length>e.count&&console.warn("THREE.BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),e.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new Nr);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new U(-1/0,-1/0,-1/0),new U(1/0,1/0,1/0));return}if(t!==void 0){if(this.boundingBox.setFromBufferAttribute(t),e)for(let n=0,r=e.length;n<r;n++){const s=e[n];rn.setFromBufferAttribute(s),this.morphTargetsRelative?(De.addVectors(this.boundingBox.min,rn.min),this.boundingBox.expandByPoint(De),De.addVectors(this.boundingBox.max,rn.max),this.boundingBox.expandByPoint(De)):(this.boundingBox.expandByPoint(rn.min),this.boundingBox.expandByPoint(rn.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Fr);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new U,1/0);return}if(t){const n=this.boundingSphere.center;if(rn.setFromBufferAttribute(t),e)for(let s=0,a=e.length;s<a;s++){const o=e[s];Gr.setFromBufferAttribute(o),this.morphTargetsRelative?(De.addVectors(rn.min,Gr.min),rn.expandByPoint(De),De.addVectors(rn.max,Gr.max),rn.expandByPoint(De)):(rn.expandByPoint(Gr.min),rn.expandByPoint(Gr.max))}rn.getCenter(n);let r=0;for(let s=0,a=t.count;s<a;s++)De.fromBufferAttribute(t,s),r=Math.max(r,n.distanceToSquared(De));if(e)for(let s=0,a=e.length;s<a;s++){const o=e[s],c=this.morphTargetsRelative;for(let l=0,h=o.count;l<h;l++)De.fromBufferAttribute(o,l),c&&(hr.fromBufferAttribute(t,l),De.add(hr)),r=Math.max(r,n.distanceToSquared(De))}this.boundingSphere.radius=Math.sqrt(r),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const t=this.index,e=this.attributes;if(t===null||e.position===void 0||e.normal===void 0||e.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const n=e.position,r=e.normal,s=e.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new oe(new Float32Array(4*n.count),4));const a=this.getAttribute("tangent"),o=[],c=[];for(let R=0;R<n.count;R++)o[R]=new U,c[R]=new U;const l=new U,h=new U,u=new U,d=new Rt,f=new Rt,g=new Rt,v=new U,m=new U;function p(R,_,x){l.fromBufferAttribute(n,R),h.fromBufferAttribute(n,_),u.fromBufferAttribute(n,x),d.fromBufferAttribute(s,R),f.fromBufferAttribute(s,_),g.fromBufferAttribute(s,x),h.sub(l),u.sub(l),f.sub(d),g.sub(d);const y=1/(f.x*g.y-g.x*f.y);isFinite(y)&&(v.copy(h).multiplyScalar(g.y).addScaledVector(u,-f.y).multiplyScalar(y),m.copy(u).multiplyScalar(f.x).addScaledVector(h,-g.x).multiplyScalar(y),o[R].add(v),o[_].add(v),o[x].add(v),c[R].add(m),c[_].add(m),c[x].add(m))}let S=this.groups;S.length===0&&(S=[{start:0,count:t.count}]);for(let R=0,_=S.length;R<_;++R){const x=S[R],y=x.start,w=x.count;for(let D=y,I=y+w;D<I;D+=3)p(t.getX(D+0),t.getX(D+1),t.getX(D+2))}const b=new U,M=new U,E=new U,T=new U;function A(R){E.fromBufferAttribute(r,R),T.copy(E);const _=o[R];b.copy(_),b.sub(E.multiplyScalar(E.dot(_))).normalize(),M.crossVectors(T,_);const y=M.dot(c[R])<0?-1:1;a.setXYZW(R,b.x,b.y,b.z,y)}for(let R=0,_=S.length;R<_;++R){const x=S[R],y=x.start,w=x.count;for(let D=y,I=y+w;D<I;D+=3)A(t.getX(D+0)),A(t.getX(D+1)),A(t.getX(D+2))}}computeVertexNormals(){const t=this.index,e=this.getAttribute("position");if(e!==void 0){let n=this.getAttribute("normal");if(n===void 0)n=new oe(new Float32Array(e.count*3),3),this.setAttribute("normal",n);else for(let d=0,f=n.count;d<f;d++)n.setXYZ(d,0,0,0);const r=new U,s=new U,a=new U,o=new U,c=new U,l=new U,h=new U,u=new U;if(t)for(let d=0,f=t.count;d<f;d+=3){const g=t.getX(d+0),v=t.getX(d+1),m=t.getX(d+2);r.fromBufferAttribute(e,g),s.fromBufferAttribute(e,v),a.fromBufferAttribute(e,m),h.subVectors(a,s),u.subVectors(r,s),h.cross(u),o.fromBufferAttribute(n,g),c.fromBufferAttribute(n,v),l.fromBufferAttribute(n,m),o.add(h),c.add(h),l.add(h),n.setXYZ(g,o.x,o.y,o.z),n.setXYZ(v,c.x,c.y,c.z),n.setXYZ(m,l.x,l.y,l.z)}else for(let d=0,f=e.count;d<f;d+=3)r.fromBufferAttribute(e,d+0),s.fromBufferAttribute(e,d+1),a.fromBufferAttribute(e,d+2),h.subVectors(a,s),u.subVectors(r,s),h.cross(u),n.setXYZ(d+0,h.x,h.y,h.z),n.setXYZ(d+1,h.x,h.y,h.z),n.setXYZ(d+2,h.x,h.y,h.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){const t=this.attributes.normal;for(let e=0,n=t.count;e<n;e++)De.fromBufferAttribute(t,e),De.normalize(),t.setXYZ(e,De.x,De.y,De.z)}toNonIndexed(){function t(o,c){const l=o.array,h=o.itemSize,u=o.normalized,d=new l.constructor(c.length*h);let f=0,g=0;for(let v=0,m=c.length;v<m;v++){o.isInterleavedBufferAttribute?f=c[v]*o.data.stride+o.offset:f=c[v]*h;for(let p=0;p<h;p++)d[g++]=l[f++]}return new oe(d,h,u)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const e=new Ne,n=this.index.array,r=this.attributes;for(const o in r){const c=r[o],l=t(c,n);e.setAttribute(o,l)}const s=this.morphAttributes;for(const o in s){const c=[],l=s[o];for(let h=0,u=l.length;h<u;h++){const d=l[h],f=t(d,n);c.push(f)}e.morphAttributes[o]=c}e.morphTargetsRelative=this.morphTargetsRelative;const a=this.groups;for(let o=0,c=a.length;o<c;o++){const l=a[o];e.addGroup(l.start,l.count,l.materialIndex)}return e}toJSON(){const t={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(t.uuid=this.uuid,t.type=this.type,this.name!==""&&(t.name=this.name),Object.keys(this.userData).length>0&&(t.userData=this.userData),this.parameters!==void 0){const c=this.parameters;for(const l in c)c[l]!==void 0&&(t[l]=c[l]);return t}t.data={attributes:{}};const e=this.index;e!==null&&(t.data.index={type:e.array.constructor.name,array:Array.prototype.slice.call(e.array)});const n=this.attributes;for(const c in n){const l=n[c];t.data.attributes[c]=l.toJSON(t.data)}const r={};let s=!1;for(const c in this.morphAttributes){const l=this.morphAttributes[c],h=[];for(let u=0,d=l.length;u<d;u++){const f=l[u];h.push(f.toJSON(t.data))}h.length>0&&(r[c]=h,s=!0)}s&&(t.data.morphAttributes=r,t.data.morphTargetsRelative=this.morphTargetsRelative);const a=this.groups;a.length>0&&(t.data.groups=JSON.parse(JSON.stringify(a)));const o=this.boundingSphere;return o!==null&&(t.data.boundingSphere=o.toJSON()),t}clone(){return new this.constructor().copy(this)}copy(t){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const e={};this.name=t.name;const n=t.index;n!==null&&this.setIndex(n.clone());const r=t.attributes;for(const l in r){const h=r[l];this.setAttribute(l,h.clone(e))}const s=t.morphAttributes;for(const l in s){const h=[],u=s[l];for(let d=0,f=u.length;d<f;d++)h.push(u[d].clone(e));this.morphAttributes[l]=h}this.morphTargetsRelative=t.morphTargetsRelative;const a=t.groups;for(let l=0,h=a.length;l<h;l++){const u=a[l];this.addGroup(u.start,u.count,u.materialIndex)}const o=t.boundingBox;o!==null&&(this.boundingBox=o.clone());const c=t.boundingSphere;return c!==null&&(this.boundingSphere=c.clone()),this.drawRange.start=t.drawRange.start,this.drawRange.count=t.drawRange.count,this.userData=t.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const Ml=new ne,Li=new su,Ds=new Fr,bl=new U,Is=new U,Us=new U,Ns=new U,Ha=new U,Fs=new U,yl=new U,Os=new U;class Gt extends Ue{constructor(t=new Ne,e=new ga){super(),this.isMesh=!0,this.type="Mesh",this.geometry=t,this.material=e,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),t.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=t.morphTargetInfluences.slice()),t.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},t.morphTargetDictionary)),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}updateMorphTargets(){const e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){const r=e[n[0]];if(r!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,a=r.length;s<a;s++){const o=r[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=s}}}}getVertexPosition(t,e){const n=this.geometry,r=n.attributes.position,s=n.morphAttributes.position,a=n.morphTargetsRelative;e.fromBufferAttribute(r,t);const o=this.morphTargetInfluences;if(s&&o){Fs.set(0,0,0);for(let c=0,l=s.length;c<l;c++){const h=o[c],u=s[c];h!==0&&(Ha.fromBufferAttribute(u,t),a?Fs.addScaledVector(Ha,h):Fs.addScaledVector(Ha.sub(e),h))}e.add(Fs)}return e}raycast(t,e){const n=this.geometry,r=this.material,s=this.matrixWorld;r!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),Ds.copy(n.boundingSphere),Ds.applyMatrix4(s),Li.copy(t.ray).recast(t.near),!(Ds.containsPoint(Li.origin)===!1&&(Li.intersectSphere(Ds,bl)===null||Li.origin.distanceToSquared(bl)>(t.far-t.near)**2))&&(Ml.copy(s).invert(),Li.copy(t.ray).applyMatrix4(Ml),!(n.boundingBox!==null&&Li.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(t,e,Li)))}_computeIntersections(t,e,n){let r;const s=this.geometry,a=this.material,o=s.index,c=s.attributes.position,l=s.attributes.uv,h=s.attributes.uv1,u=s.attributes.normal,d=s.groups,f=s.drawRange;if(o!==null)if(Array.isArray(a))for(let g=0,v=d.length;g<v;g++){const m=d[g],p=a[m.materialIndex],S=Math.max(m.start,f.start),b=Math.min(o.count,Math.min(m.start+m.count,f.start+f.count));for(let M=S,E=b;M<E;M+=3){const T=o.getX(M),A=o.getX(M+1),R=o.getX(M+2);r=Bs(this,p,t,n,l,h,u,T,A,R),r&&(r.faceIndex=Math.floor(M/3),r.face.materialIndex=m.materialIndex,e.push(r))}}else{const g=Math.max(0,f.start),v=Math.min(o.count,f.start+f.count);for(let m=g,p=v;m<p;m+=3){const S=o.getX(m),b=o.getX(m+1),M=o.getX(m+2);r=Bs(this,a,t,n,l,h,u,S,b,M),r&&(r.faceIndex=Math.floor(m/3),e.push(r))}}else if(c!==void 0)if(Array.isArray(a))for(let g=0,v=d.length;g<v;g++){const m=d[g],p=a[m.materialIndex],S=Math.max(m.start,f.start),b=Math.min(c.count,Math.min(m.start+m.count,f.start+f.count));for(let M=S,E=b;M<E;M+=3){const T=M,A=M+1,R=M+2;r=Bs(this,p,t,n,l,h,u,T,A,R),r&&(r.faceIndex=Math.floor(M/3),r.face.materialIndex=m.materialIndex,e.push(r))}}else{const g=Math.max(0,f.start),v=Math.min(c.count,f.start+f.count);for(let m=g,p=v;m<p;m+=3){const S=m,b=m+1,M=m+2;r=Bs(this,a,t,n,l,h,u,S,b,M),r&&(r.faceIndex=Math.floor(m/3),e.push(r))}}}}function Jd(i,t,e,n,r,s,a,o){let c;if(t.side===Je?c=n.intersectTriangle(a,s,r,!0,o):c=n.intersectTriangle(r,s,a,t.side===Si,o),c===null)return null;Os.copy(o),Os.applyMatrix4(i.matrixWorld);const l=e.ray.origin.distanceTo(Os);return l<e.near||l>e.far?null:{distance:l,point:Os.clone(),object:i}}function Bs(i,t,e,n,r,s,a,o,c,l){i.getVertexPosition(o,Is),i.getVertexPosition(c,Us),i.getVertexPosition(l,Ns);const h=Jd(i,t,e,n,Is,Us,Ns,yl);if(h){const u=new U;Tn.getBarycoord(yl,Is,Us,Ns,u),r&&(h.uv=Tn.getInterpolatedAttribute(r,o,c,l,u,new Rt)),s&&(h.uv1=Tn.getInterpolatedAttribute(s,o,c,l,u,new Rt)),a&&(h.normal=Tn.getInterpolatedAttribute(a,o,c,l,u,new U),h.normal.dot(n.direction)>0&&h.normal.multiplyScalar(-1));const d={a:o,b:c,c:l,normal:new U,materialIndex:0};Tn.getNormal(Is,Us,Ns,d.normal),h.face=d,h.barycoord=u}return h}class $e extends Ne{constructor(t=1,e=1,n=1,r=1,s=1,a=1){super(),this.type="BoxGeometry",this.parameters={width:t,height:e,depth:n,widthSegments:r,heightSegments:s,depthSegments:a};const o=this;r=Math.floor(r),s=Math.floor(s),a=Math.floor(a);const c=[],l=[],h=[],u=[];let d=0,f=0;g("z","y","x",-1,-1,n,e,t,a,s,0),g("z","y","x",1,-1,n,e,-t,a,s,1),g("x","z","y",1,1,t,n,e,r,a,2),g("x","z","y",1,-1,t,n,-e,r,a,3),g("x","y","z",1,-1,t,e,n,r,s,4),g("x","y","z",-1,-1,t,e,-n,r,s,5),this.setIndex(c),this.setAttribute("position",new he(l,3)),this.setAttribute("normal",new he(h,3)),this.setAttribute("uv",new he(u,2));function g(v,m,p,S,b,M,E,T,A,R,_){const x=M/A,y=E/R,w=M/2,D=E/2,I=T/2,F=A+1,H=R+1;let $=0,V=0;const Q=new U;for(let rt=0;rt<H;rt++){const ct=rt*y-D;for(let gt=0;gt<F;gt++){const Ct=gt*x-w;Q[v]=Ct*S,Q[m]=ct*b,Q[p]=I,l.push(Q.x,Q.y,Q.z),Q[v]=0,Q[m]=0,Q[p]=T>0?1:-1,h.push(Q.x,Q.y,Q.z),u.push(gt/A),u.push(1-rt/R),$+=1}}for(let rt=0;rt<R;rt++)for(let ct=0;ct<A;ct++){const gt=d+ct+F*rt,Ct=d+ct+F*(rt+1),Nt=d+(ct+1)+F*(rt+1),et=d+(ct+1)+F*rt;c.push(gt,Ct,et),c.push(Ct,Nt,et),V+=6}o.addGroup(f,V,_),f+=V,d+=$}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new $e(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}}function Lr(i){const t={};for(const e in i){t[e]={};for(const n in i[e]){const r=i[e][n];r&&(r.isColor||r.isMatrix3||r.isMatrix4||r.isVector2||r.isVector3||r.isVector4||r.isTexture||r.isQuaternion)?r.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),t[e][n]=null):t[e][n]=r.clone():Array.isArray(r)?t[e][n]=r.slice():t[e][n]=r}}return t}function Xe(i){const t={};for(let e=0;e<i.length;e++){const n=Lr(i[e]);for(const r in n)t[r]=n[r]}return t}function Qd(i){const t=[];for(let e=0;e<i.length;e++)t.push(i[e].clone());return t}function hu(i){const t=i.getRenderTarget();return t===null?i.outputColorSpace:t.isXRRenderTarget===!0?t.texture.colorSpace:re.workingColorSpace}const t0={clone:Lr,merge:Xe};var e0=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,n0=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class He extends ps{constructor(t){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=e0,this.fragmentShader=n0,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,t!==void 0&&this.setValues(t)}copy(t){return super.copy(t),this.fragmentShader=t.fragmentShader,this.vertexShader=t.vertexShader,this.uniforms=Lr(t.uniforms),this.uniformsGroups=Qd(t.uniformsGroups),this.defines=Object.assign({},t.defines),this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.fog=t.fog,this.lights=t.lights,this.clipping=t.clipping,this.extensions=Object.assign({},t.extensions),this.glslVersion=t.glslVersion,this}toJSON(t){const e=super.toJSON(t);e.glslVersion=this.glslVersion,e.uniforms={};for(const r in this.uniforms){const a=this.uniforms[r].value;a&&a.isTexture?e.uniforms[r]={type:"t",value:a.toJSON(t).uuid}:a&&a.isColor?e.uniforms[r]={type:"c",value:a.getHex()}:a&&a.isVector2?e.uniforms[r]={type:"v2",value:a.toArray()}:a&&a.isVector3?e.uniforms[r]={type:"v3",value:a.toArray()}:a&&a.isVector4?e.uniforms[r]={type:"v4",value:a.toArray()}:a&&a.isMatrix3?e.uniforms[r]={type:"m3",value:a.toArray()}:a&&a.isMatrix4?e.uniforms[r]={type:"m4",value:a.toArray()}:e.uniforms[r]={value:a}}Object.keys(this.defines).length>0&&(e.defines=this.defines),e.vertexShader=this.vertexShader,e.fragmentShader=this.fragmentShader,e.lights=this.lights,e.clipping=this.clipping;const n={};for(const r in this.extensions)this.extensions[r]===!0&&(n[r]=!0);return Object.keys(n).length>0&&(e.extensions=n),e}}class uu extends Ue{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new ne,this.projectionMatrix=new ne,this.projectionMatrixInverse=new ne,this.coordinateSystem=Hn,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(t,e){return super.copy(t,e),this.matrixWorldInverse.copy(t.matrixWorldInverse),this.projectionMatrix.copy(t.projectionMatrix),this.projectionMatrixInverse.copy(t.projectionMatrixInverse),this.coordinateSystem=t.coordinateSystem,this}getWorldDirection(t){return super.getWorldDirection(t).negate()}updateMatrixWorld(t){super.updateMatrixWorld(t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(t,e){super.updateWorldMatrix(t,e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}const di=new U,Sl=new Rt,El=new Rt;class vn extends uu{constructor(t=50,e=1,n=.1,r=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=t,this.zoom=1,this.near=n,this.far=r,this.focus=10,this.aspect=e,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.fov=t.fov,this.zoom=t.zoom,this.near=t.near,this.far=t.far,this.focus=t.focus,this.aspect=t.aspect,this.view=t.view===null?null:Object.assign({},t.view),this.filmGauge=t.filmGauge,this.filmOffset=t.filmOffset,this}setFocalLength(t){const e=.5*this.getFilmHeight()/t;this.fov=cs*2*Math.atan(e),this.updateProjectionMatrix()}getFocalLength(){const t=Math.tan($r*.5*this.fov);return .5*this.getFilmHeight()/t}getEffectiveFOV(){return cs*2*Math.atan(Math.tan($r*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(t,e,n){di.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),e.set(di.x,di.y).multiplyScalar(-t/di.z),di.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(di.x,di.y).multiplyScalar(-t/di.z)}getViewSize(t,e){return this.getViewBounds(t,Sl,El),e.subVectors(El,Sl)}setViewOffset(t,e,n,r,s,a){this.aspect=t/e,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=r,this.view.width=s,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=this.near;let e=t*Math.tan($r*.5*this.fov)/this.zoom,n=2*e,r=this.aspect*n,s=-.5*r;const a=this.view;if(this.view!==null&&this.view.enabled){const c=a.fullWidth,l=a.fullHeight;s+=a.offsetX*r/c,e-=a.offsetY*n/l,r*=a.width/c,n*=a.height/l}const o=this.filmOffset;o!==0&&(s+=t*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(s,s+r,e,e-n,t,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.fov=this.fov,e.object.zoom=this.zoom,e.object.near=this.near,e.object.far=this.far,e.object.focus=this.focus,e.object.aspect=this.aspect,this.view!==null&&(e.object.view=Object.assign({},this.view)),e.object.filmGauge=this.filmGauge,e.object.filmOffset=this.filmOffset,e}}const ur=-90,fr=1;class i0 extends Ue{constructor(t,e,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;const r=new vn(ur,fr,t,e);r.layers=this.layers,this.add(r);const s=new vn(ur,fr,t,e);s.layers=this.layers,this.add(s);const a=new vn(ur,fr,t,e);a.layers=this.layers,this.add(a);const o=new vn(ur,fr,t,e);o.layers=this.layers,this.add(o);const c=new vn(ur,fr,t,e);c.layers=this.layers,this.add(c);const l=new vn(ur,fr,t,e);l.layers=this.layers,this.add(l)}updateCoordinateSystem(){const t=this.coordinateSystem,e=this.children.concat(),[n,r,s,a,o,c]=e;for(const l of e)this.remove(l);if(t===Hn)n.up.set(0,1,0),n.lookAt(1,0,0),r.up.set(0,1,0),r.lookAt(-1,0,0),s.up.set(0,0,-1),s.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),c.up.set(0,1,0),c.lookAt(0,0,-1);else if(t===ha)n.up.set(0,-1,0),n.lookAt(-1,0,0),r.up.set(0,-1,0),r.lookAt(1,0,0),s.up.set(0,0,1),s.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),c.up.set(0,-1,0),c.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+t);for(const l of e)this.add(l),l.updateMatrixWorld()}update(t,e){this.parent===null&&this.updateMatrixWorld();const{renderTarget:n,activeMipmapLevel:r}=this;this.coordinateSystem!==t.coordinateSystem&&(this.coordinateSystem=t.coordinateSystem,this.updateCoordinateSystem());const[s,a,o,c,l,h]=this.children,u=t.getRenderTarget(),d=t.getActiveCubeFace(),f=t.getActiveMipmapLevel(),g=t.xr.enabled;t.xr.enabled=!1;const v=n.texture.generateMipmaps;n.texture.generateMipmaps=!1,t.setRenderTarget(n,0,r),t.render(e,s),t.setRenderTarget(n,1,r),t.render(e,a),t.setRenderTarget(n,2,r),t.render(e,o),t.setRenderTarget(n,3,r),t.render(e,c),t.setRenderTarget(n,4,r),t.render(e,l),n.texture.generateMipmaps=v,t.setRenderTarget(n,5,r),t.render(e,h),t.setRenderTarget(u,d,f),t.xr.enabled=g,n.texture.needsPMREMUpdate=!0}}class fu extends Be{constructor(t=[],e=Rr,n,r,s,a,o,c,l,h){super(t,e,n,r,s,a,o,c,l,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(t){this.image=t}}class r0 extends Ye{constructor(t=1,e={}){super(t,t,e),this.isWebGLCubeRenderTarget=!0;const n={width:t,height:t,depth:1},r=[n,n,n,n,n,n];this.texture=new fu(r),this._setTextureOptions(e),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(t,e){this.texture.type=e.type,this.texture.colorSpace=e.colorSpace,this.texture.generateMipmaps=e.generateMipmaps,this.texture.minFilter=e.minFilter,this.texture.magFilter=e.magFilter;const n={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},r=new $e(5,5,5),s=new He({name:"CubemapFromEquirect",uniforms:Lr(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:Je,blending:Mi});s.uniforms.tEquirect.value=e;const a=new Gt(r,s),o=e.minFilter;return e.minFilter===zi&&(e.minFilter=_e),new i0(1,10,this).update(t,a),e.minFilter=o,a.geometry.dispose(),a.material.dispose(),this}clear(t,e=!0,n=!0,r=!0){const s=t.getRenderTarget();for(let a=0;a<6;a++)t.setRenderTarget(this,a),t.clear(e,n,r);t.setRenderTarget(s)}}class hn extends Ue{constructor(){super(),this.isGroup=!0,this.type="Group"}}const s0={type:"move"};class Va{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new hn,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new hn,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new U,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new U),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new hn,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new U,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new U),this._grip}dispatchEvent(t){return this._targetRay!==null&&this._targetRay.dispatchEvent(t),this._grip!==null&&this._grip.dispatchEvent(t),this._hand!==null&&this._hand.dispatchEvent(t),this}connect(t){if(t&&t.hand){const e=this._hand;if(e)for(const n of t.hand.values())this._getHandJoint(e,n)}return this.dispatchEvent({type:"connected",data:t}),this}disconnect(t){return this.dispatchEvent({type:"disconnected",data:t}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(t,e,n){let r=null,s=null,a=null;const o=this._targetRay,c=this._grip,l=this._hand;if(t&&e.session.visibilityState!=="visible-blurred"){if(l&&t.hand){a=!0;for(const v of t.hand.values()){const m=e.getJointPose(v,n),p=this._getHandJoint(l,v);m!==null&&(p.matrix.fromArray(m.transform.matrix),p.matrix.decompose(p.position,p.rotation,p.scale),p.matrixWorldNeedsUpdate=!0,p.jointRadius=m.radius),p.visible=m!==null}const h=l.joints["index-finger-tip"],u=l.joints["thumb-tip"],d=h.position.distanceTo(u.position),f=.02,g=.005;l.inputState.pinching&&d>f+g?(l.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:t.handedness,target:this})):!l.inputState.pinching&&d<=f-g&&(l.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:t.handedness,target:this}))}else c!==null&&t.gripSpace&&(s=e.getPose(t.gripSpace,n),s!==null&&(c.matrix.fromArray(s.transform.matrix),c.matrix.decompose(c.position,c.rotation,c.scale),c.matrixWorldNeedsUpdate=!0,s.linearVelocity?(c.hasLinearVelocity=!0,c.linearVelocity.copy(s.linearVelocity)):c.hasLinearVelocity=!1,s.angularVelocity?(c.hasAngularVelocity=!0,c.angularVelocity.copy(s.angularVelocity)):c.hasAngularVelocity=!1));o!==null&&(r=e.getPose(t.targetRaySpace,n),r===null&&s!==null&&(r=s),r!==null&&(o.matrix.fromArray(r.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,r.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(r.linearVelocity)):o.hasLinearVelocity=!1,r.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(r.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(s0)))}return o!==null&&(o.visible=r!==null),c!==null&&(c.visible=s!==null),l!==null&&(l.visible=a!==null),this}_getHandJoint(t,e){if(t.joints[e.jointName]===void 0){const n=new hn;n.matrixAutoUpdate=!1,n.visible=!1,t.joints[e.jointName]=n,t.add(n)}return t.joints[e.jointName]}}class du extends Ue{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new _n,this.environmentIntensity=1,this.environmentRotation=new _n,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(t,e){return super.copy(t,e),t.background!==null&&(this.background=t.background.clone()),t.environment!==null&&(this.environment=t.environment.clone()),t.fog!==null&&(this.fog=t.fog.clone()),this.backgroundBlurriness=t.backgroundBlurriness,this.backgroundIntensity=t.backgroundIntensity,this.backgroundRotation.copy(t.backgroundRotation),this.environmentIntensity=t.environmentIntensity,this.environmentRotation.copy(t.environmentRotation),t.overrideMaterial!==null&&(this.overrideMaterial=t.overrideMaterial.clone()),this.matrixAutoUpdate=t.matrixAutoUpdate,this}toJSON(t){const e=super.toJSON(t);return this.fog!==null&&(e.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(e.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(e.object.backgroundIntensity=this.backgroundIntensity),e.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(e.object.environmentIntensity=this.environmentIntensity),e.object.environmentRotation=this.environmentRotation.toArray(),e}}const wl=new U,Tl=new se,Al=new se,a0=new U,Rl=new ne,ks=new U,Ga=new Fr,Cl=new ne,Wa=new su;class pu extends Gt{constructor(t,e){super(t,e),this.isSkinnedMesh=!0,this.type="SkinnedMesh",this.bindMode=il,this.bindMatrix=new ne,this.bindMatrixInverse=new ne,this.boundingBox=null,this.boundingSphere=null}computeBoundingBox(){const t=this.geometry;this.boundingBox===null&&(this.boundingBox=new Nr),this.boundingBox.makeEmpty();const e=t.getAttribute("position");for(let n=0;n<e.count;n++)this.getVertexPosition(n,ks),this.boundingBox.expandByPoint(ks)}computeBoundingSphere(){const t=this.geometry;this.boundingSphere===null&&(this.boundingSphere=new Fr),this.boundingSphere.makeEmpty();const e=t.getAttribute("position");for(let n=0;n<e.count;n++)this.getVertexPosition(n,ks),this.boundingSphere.expandByPoint(ks)}copy(t,e){return super.copy(t,e),this.bindMode=t.bindMode,this.bindMatrix.copy(t.bindMatrix),this.bindMatrixInverse.copy(t.bindMatrixInverse),this.skeleton=t.skeleton,t.boundingBox!==null&&(this.boundingBox=t.boundingBox.clone()),t.boundingSphere!==null&&(this.boundingSphere=t.boundingSphere.clone()),this}raycast(t,e){const n=this.material,r=this.matrixWorld;n!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),Ga.copy(this.boundingSphere),Ga.applyMatrix4(r),t.ray.intersectsSphere(Ga)!==!1&&(Cl.copy(r).invert(),Wa.copy(t.ray).applyMatrix4(Cl),!(this.boundingBox!==null&&Wa.intersectsBox(this.boundingBox)===!1)&&this._computeIntersections(t,e,Wa)))}getVertexPosition(t,e){return super.getVertexPosition(t,e),this.applyBoneTransform(t,e),e}bind(t,e){this.skeleton=t,e===void 0&&(this.updateMatrixWorld(!0),this.skeleton.calculateInverses(),e=this.matrixWorld),this.bindMatrix.copy(e),this.bindMatrixInverse.copy(e).invert()}pose(){this.skeleton.pose()}normalizeSkinWeights(){const t=new se,e=this.geometry.attributes.skinWeight;for(let n=0,r=e.count;n<r;n++){t.fromBufferAttribute(e,n);const s=1/t.manhattanLength();s!==1/0?t.multiplyScalar(s):t.set(1,0,0,0),e.setXYZW(n,t.x,t.y,t.z,t.w)}}updateMatrixWorld(t){super.updateMatrixWorld(t),this.bindMode===il?this.bindMatrixInverse.copy(this.matrixWorld).invert():this.bindMode===nd?this.bindMatrixInverse.copy(this.bindMatrix).invert():console.warn("THREE.SkinnedMesh: Unrecognized bindMode: "+this.bindMode)}applyBoneTransform(t,e){const n=this.skeleton,r=this.geometry;Tl.fromBufferAttribute(r.attributes.skinIndex,t),Al.fromBufferAttribute(r.attributes.skinWeight,t),wl.copy(e).applyMatrix4(this.bindMatrix),e.set(0,0,0);for(let s=0;s<4;s++){const a=Al.getComponent(s);if(a!==0){const o=Tl.getComponent(s);Rl.multiplyMatrices(n.bones[o].matrixWorld,n.boneInverses[o]),e.addScaledVector(a0.copy(wl).applyMatrix4(Rl),a)}}return e.applyMatrix4(this.bindMatrixInverse)}}class mu extends Ue{constructor(){super(),this.isBone=!0,this.type="Bone"}}class Kr extends Be{constructor(t=null,e=1,n=1,r,s,a,o,c,l=un,h=un,u,d){super(null,a,o,c,l,h,r,s,u,d),this.isDataTexture=!0,this.image={data:t,width:e,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}const Ll=new ne,o0=new ne;class Sc{constructor(t=[],e=[]){this.uuid=Zi(),this.bones=t.slice(0),this.boneInverses=e,this.boneMatrices=null,this.boneTexture=null,this.init()}init(){const t=this.bones,e=this.boneInverses;if(this.boneMatrices=new Float32Array(t.length*16),e.length===0)this.calculateInverses();else if(t.length!==e.length){console.warn("THREE.Skeleton: Number of inverse bone matrices does not match amount of bones."),this.boneInverses=[];for(let n=0,r=this.bones.length;n<r;n++)this.boneInverses.push(new ne)}}calculateInverses(){this.boneInverses.length=0;for(let t=0,e=this.bones.length;t<e;t++){const n=new ne;this.bones[t]&&n.copy(this.bones[t].matrixWorld).invert(),this.boneInverses.push(n)}}pose(){for(let t=0,e=this.bones.length;t<e;t++){const n=this.bones[t];n&&n.matrixWorld.copy(this.boneInverses[t]).invert()}for(let t=0,e=this.bones.length;t<e;t++){const n=this.bones[t];n&&(n.parent&&n.parent.isBone?(n.matrix.copy(n.parent.matrixWorld).invert(),n.matrix.multiply(n.matrixWorld)):n.matrix.copy(n.matrixWorld),n.matrix.decompose(n.position,n.quaternion,n.scale))}}update(){const t=this.bones,e=this.boneInverses,n=this.boneMatrices,r=this.boneTexture;for(let s=0,a=t.length;s<a;s++){const o=t[s]?t[s].matrixWorld:o0;Ll.multiplyMatrices(o,e[s]),Ll.toArray(n,s*16)}r!==null&&(r.needsUpdate=!0)}clone(){return new Sc(this.bones,this.boneInverses)}computeBoneTexture(){let t=Math.sqrt(this.bones.length*4);t=Math.ceil(t/4)*4,t=Math.max(t,4);const e=new Float32Array(t*t*4);e.set(this.boneMatrices);const n=new Kr(e,t,t,Ve,zn);return n.needsUpdate=!0,this.boneMatrices=e,this.boneTexture=n,this}getBoneByName(t){for(let e=0,n=this.bones.length;e<n;e++){const r=this.bones[e];if(r.name===t)return r}}dispose(){this.boneTexture!==null&&(this.boneTexture.dispose(),this.boneTexture=null)}fromJSON(t,e){this.uuid=t.uuid;for(let n=0,r=t.bones.length;n<r;n++){const s=t.bones[n];let a=e[s];a===void 0&&(console.warn("THREE.Skeleton: No bone found with UUID:",s),a=new mu),this.bones.push(a),this.boneInverses.push(new ne().fromArray(t.boneInverses[n]))}return this.init(),this}toJSON(){const t={metadata:{version:4.7,type:"Skeleton",generator:"Skeleton.toJSON"},bones:[],boneInverses:[]};t.uuid=this.uuid;const e=this.bones,n=this.boneInverses;for(let r=0,s=e.length;r<s;r++){const a=e[r];t.bones.push(a.uuid);const o=n[r];t.boneInverses.push(o.toArray())}return t}}const Xa=new U,c0=new U,l0=new Zt;class Ui{constructor(t=new U(1,0,0),e=0){this.isPlane=!0,this.normal=t,this.constant=e}set(t,e){return this.normal.copy(t),this.constant=e,this}setComponents(t,e,n,r){return this.normal.set(t,e,n),this.constant=r,this}setFromNormalAndCoplanarPoint(t,e){return this.normal.copy(t),this.constant=-e.dot(this.normal),this}setFromCoplanarPoints(t,e,n){const r=Xa.subVectors(n,e).cross(c0.subVectors(t,e)).normalize();return this.setFromNormalAndCoplanarPoint(r,t),this}copy(t){return this.normal.copy(t.normal),this.constant=t.constant,this}normalize(){const t=1/this.normal.length();return this.normal.multiplyScalar(t),this.constant*=t,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(t){return this.normal.dot(t)+this.constant}distanceToSphere(t){return this.distanceToPoint(t.center)-t.radius}projectPoint(t,e){return e.copy(t).addScaledVector(this.normal,-this.distanceToPoint(t))}intersectLine(t,e){const n=t.delta(Xa),r=this.normal.dot(n);if(r===0)return this.distanceToPoint(t.start)===0?e.copy(t.start):null;const s=-(t.start.dot(this.normal)+this.constant)/r;return s<0||s>1?null:e.copy(t.start).addScaledVector(n,s)}intersectsLine(t){const e=this.distanceToPoint(t.start),n=this.distanceToPoint(t.end);return e<0&&n>0||n<0&&e>0}intersectsBox(t){return t.intersectsPlane(this)}intersectsSphere(t){return t.intersectsPlane(this)}coplanarPoint(t){return t.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(t,e){const n=e||l0.getNormalMatrix(t),r=this.coplanarPoint(Xa).applyMatrix4(t),s=this.normal.applyMatrix3(n).normalize();return this.constant=-r.dot(s),this}translate(t){return this.constant-=t.dot(this.normal),this}equals(t){return t.normal.equals(this.normal)&&t.constant===this.constant}clone(){return new this.constructor().copy(this)}}const Pi=new Fr,h0=new Rt(.5,.5),zs=new U;class Ec{constructor(t=new Ui,e=new Ui,n=new Ui,r=new Ui,s=new Ui,a=new Ui){this.planes=[t,e,n,r,s,a]}set(t,e,n,r,s,a){const o=this.planes;return o[0].copy(t),o[1].copy(e),o[2].copy(n),o[3].copy(r),o[4].copy(s),o[5].copy(a),this}copy(t){const e=this.planes;for(let n=0;n<6;n++)e[n].copy(t.planes[n]);return this}setFromProjectionMatrix(t,e=Hn,n=!1){const r=this.planes,s=t.elements,a=s[0],o=s[1],c=s[2],l=s[3],h=s[4],u=s[5],d=s[6],f=s[7],g=s[8],v=s[9],m=s[10],p=s[11],S=s[12],b=s[13],M=s[14],E=s[15];if(r[0].setComponents(l-a,f-h,p-g,E-S).normalize(),r[1].setComponents(l+a,f+h,p+g,E+S).normalize(),r[2].setComponents(l+o,f+u,p+v,E+b).normalize(),r[3].setComponents(l-o,f-u,p-v,E-b).normalize(),n)r[4].setComponents(c,d,m,M).normalize(),r[5].setComponents(l-c,f-d,p-m,E-M).normalize();else if(r[4].setComponents(l-c,f-d,p-m,E-M).normalize(),e===Hn)r[5].setComponents(l+c,f+d,p+m,E+M).normalize();else if(e===ha)r[5].setComponents(c,d,m,M).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+e);return this}intersectsObject(t){if(t.boundingSphere!==void 0)t.boundingSphere===null&&t.computeBoundingSphere(),Pi.copy(t.boundingSphere).applyMatrix4(t.matrixWorld);else{const e=t.geometry;e.boundingSphere===null&&e.computeBoundingSphere(),Pi.copy(e.boundingSphere).applyMatrix4(t.matrixWorld)}return this.intersectsSphere(Pi)}intersectsSprite(t){Pi.center.set(0,0,0);const e=h0.distanceTo(t.center);return Pi.radius=.7071067811865476+e,Pi.applyMatrix4(t.matrixWorld),this.intersectsSphere(Pi)}intersectsSphere(t){const e=this.planes,n=t.center,r=-t.radius;for(let s=0;s<6;s++)if(e[s].distanceToPoint(n)<r)return!1;return!0}intersectsBox(t){const e=this.planes;for(let n=0;n<6;n++){const r=e[n];if(zs.x=r.normal.x>0?t.max.x:t.min.x,zs.y=r.normal.y>0?t.max.y:t.min.y,zs.z=r.normal.z>0?t.max.z:t.min.z,r.distanceToPoint(zs)<0)return!1}return!0}containsPoint(t){const e=this.planes;for(let n=0;n<6;n++)if(e[n].distanceToPoint(t)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}class u0 extends Be{constructor(t,e,n,r,s=_e,a=_e,o,c,l){super(t,e,n,r,s,a,o,c,l),this.isVideoTexture=!0,this.generateMipmaps=!1,this._requestVideoFrameCallbackId=0;const h=this;function u(){h.needsUpdate=!0,h._requestVideoFrameCallbackId=t.requestVideoFrameCallback(u)}"requestVideoFrameCallback"in t&&(this._requestVideoFrameCallbackId=t.requestVideoFrameCallback(u))}clone(){return new this.constructor(this.image).copy(this)}update(){const t=this.image;"requestVideoFrameCallback"in t===!1&&t.readyState>=t.HAVE_CURRENT_DATA&&(this.needsUpdate=!0)}dispose(){this._requestVideoFrameCallbackId!==0&&this.source.data.cancelVideoFrameCallback(this._requestVideoFrameCallbackId),super.dispose()}}class Pl extends Be{constructor(t,e,n,r,s,a,o,c,l){super(t,e,n,r,s,a,o,c,l),this.isCanvasTexture=!0,this.needsUpdate=!0}}class gu extends Be{constructor(t,e,n=qi,r,s,a,o=un,c=un,l,h=as,u=1){if(h!==as&&h!==os)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");const d={width:t,height:e,depth:u};super(d,r,s,a,o,c,h,n,l),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(t){return super.copy(t),this.source=new bc(Object.assign({},t.image)),this.compareFunction=t.compareFunction,this}toJSON(t){const e=super.toJSON(t);return this.compareFunction!==null&&(e.compareFunction=this.compareFunction),e}}class vu extends Be{constructor(t=null){super(),this.sourceTexture=t,this.isExternalTexture=!0}copy(t){return super.copy(t),this.sourceTexture=t.sourceTexture,this}}class wc extends Ne{constructor(t=1,e=1,n=4,r=8,s=1){super(),this.type="CapsuleGeometry",this.parameters={radius:t,height:e,capSegments:n,radialSegments:r,heightSegments:s},e=Math.max(0,e),n=Math.max(1,Math.floor(n)),r=Math.max(3,Math.floor(r)),s=Math.max(1,Math.floor(s));const a=[],o=[],c=[],l=[],h=e/2,u=Math.PI/2*t,d=e,f=2*u+d,g=n*2+s,v=r+1,m=new U,p=new U;for(let S=0;S<=g;S++){let b=0,M=0,E=0,T=0;if(S<=n){const _=S/n,x=_*Math.PI/2;M=-h-t*Math.cos(x),E=t*Math.sin(x),T=-t*Math.cos(x),b=_*u}else if(S<=n+s){const _=(S-n)/s;M=-h+_*e,E=t,T=0,b=u+_*d}else{const _=(S-n-s)/n,x=_*Math.PI/2;M=h+t*Math.sin(x),E=t*Math.cos(x),T=t*Math.sin(x),b=u+d+_*u}const A=Math.max(0,Math.min(1,b/f));let R=0;S===0?R=.5/r:S===g&&(R=-.5/r);for(let _=0;_<=r;_++){const x=_/r,y=x*Math.PI*2,w=Math.sin(y),D=Math.cos(y);p.x=-E*D,p.y=M,p.z=E*w,o.push(p.x,p.y,p.z),m.set(-E*D,T,E*w),m.normalize(),c.push(m.x,m.y,m.z),l.push(x+R,A)}if(S>0){const _=(S-1)*v;for(let x=0;x<r;x++){const y=_+x,w=_+x+1,D=S*v+x,I=S*v+x+1;a.push(y,w,D),a.push(w,I,D)}}}this.setIndex(a),this.setAttribute("position",new he(o,3)),this.setAttribute("normal",new he(c,3)),this.setAttribute("uv",new he(l,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new wc(t.radius,t.height,t.capSegments,t.radialSegments,t.heightSegments)}}class Tc extends Ne{constructor(t=1,e=32,n=0,r=Math.PI*2){super(),this.type="CircleGeometry",this.parameters={radius:t,segments:e,thetaStart:n,thetaLength:r},e=Math.max(3,e);const s=[],a=[],o=[],c=[],l=new U,h=new Rt;a.push(0,0,0),o.push(0,0,1),c.push(.5,.5);for(let u=0,d=3;u<=e;u++,d+=3){const f=n+u/e*r;l.x=t*Math.cos(f),l.y=t*Math.sin(f),a.push(l.x,l.y,l.z),o.push(0,0,1),h.x=(a[d]/t+1)/2,h.y=(a[d+1]/t+1)/2,c.push(h.x,h.y)}for(let u=1;u<=e;u++)s.push(u,u+1,0);this.setIndex(s),this.setAttribute("position",new he(a,3)),this.setAttribute("normal",new he(o,3)),this.setAttribute("uv",new he(c,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Tc(t.radius,t.segments,t.thetaStart,t.thetaLength)}}class Pn extends Ne{constructor(t=1,e=1,n=1,r=32,s=1,a=!1,o=0,c=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:t,radiusBottom:e,height:n,radialSegments:r,heightSegments:s,openEnded:a,thetaStart:o,thetaLength:c};const l=this;r=Math.floor(r),s=Math.floor(s);const h=[],u=[],d=[],f=[];let g=0;const v=[],m=n/2;let p=0;S(),a===!1&&(t>0&&b(!0),e>0&&b(!1)),this.setIndex(h),this.setAttribute("position",new he(u,3)),this.setAttribute("normal",new he(d,3)),this.setAttribute("uv",new he(f,2));function S(){const M=new U,E=new U;let T=0;const A=(e-t)/n;for(let R=0;R<=s;R++){const _=[],x=R/s,y=x*(e-t)+t;for(let w=0;w<=r;w++){const D=w/r,I=D*c+o,F=Math.sin(I),H=Math.cos(I);E.x=y*F,E.y=-x*n+m,E.z=y*H,u.push(E.x,E.y,E.z),M.set(F,A,H).normalize(),d.push(M.x,M.y,M.z),f.push(D,1-x),_.push(g++)}v.push(_)}for(let R=0;R<r;R++)for(let _=0;_<s;_++){const x=v[_][R],y=v[_+1][R],w=v[_+1][R+1],D=v[_][R+1];(t>0||_!==0)&&(h.push(x,y,D),T+=3),(e>0||_!==s-1)&&(h.push(y,w,D),T+=3)}l.addGroup(p,T,0),p+=T}function b(M){const E=g,T=new Rt,A=new U;let R=0;const _=M===!0?t:e,x=M===!0?1:-1;for(let w=1;w<=r;w++)u.push(0,m*x,0),d.push(0,x,0),f.push(.5,.5),g++;const y=g;for(let w=0;w<=r;w++){const I=w/r*c+o,F=Math.cos(I),H=Math.sin(I);A.x=_*H,A.y=m*x,A.z=_*F,u.push(A.x,A.y,A.z),d.push(0,x,0),T.x=F*.5+.5,T.y=H*.5*x+.5,f.push(T.x,T.y),g++}for(let w=0;w<r;w++){const D=E+w,I=y+w;M===!0?h.push(I,I+1,D):h.push(I+1,I,D),R+=3}l.addGroup(p,R,M===!0?1:2),p+=R}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Pn(t.radiusTop,t.radiusBottom,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}}class Ki extends Pn{constructor(t=1,e=1,n=32,r=1,s=!1,a=0,o=Math.PI*2){super(0,t,e,n,r,s,a,o),this.type="ConeGeometry",this.parameters={radius:t,height:e,radialSegments:n,heightSegments:r,openEnded:s,thetaStart:a,thetaLength:o}}static fromJSON(t){return new Ki(t.radius,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}}class oi{constructor(){this.type="Curve",this.arcLengthDivisions=200,this.needsUpdate=!1,this.cacheArcLengths=null}getPoint(){console.warn("THREE.Curve: .getPoint() not implemented.")}getPointAt(t,e){const n=this.getUtoTmapping(t);return this.getPoint(n,e)}getPoints(t=5){const e=[];for(let n=0;n<=t;n++)e.push(this.getPoint(n/t));return e}getSpacedPoints(t=5){const e=[];for(let n=0;n<=t;n++)e.push(this.getPointAt(n/t));return e}getLength(){const t=this.getLengths();return t[t.length-1]}getLengths(t=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===t+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;const e=[];let n,r=this.getPoint(0),s=0;e.push(0);for(let a=1;a<=t;a++)n=this.getPoint(a/t),s+=n.distanceTo(r),e.push(s),r=n;return this.cacheArcLengths=e,e}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(t,e=null){const n=this.getLengths();let r=0;const s=n.length;let a;e?a=e:a=t*n[s-1];let o=0,c=s-1,l;for(;o<=c;)if(r=Math.floor(o+(c-o)/2),l=n[r]-a,l<0)o=r+1;else if(l>0)c=r-1;else{c=r;break}if(r=c,n[r]===a)return r/(s-1);const h=n[r],d=n[r+1]-h,f=(a-h)/d;return(r+f)/(s-1)}getTangent(t,e){let r=t-1e-4,s=t+1e-4;r<0&&(r=0),s>1&&(s=1);const a=this.getPoint(r),o=this.getPoint(s),c=e||(a.isVector2?new Rt:new U);return c.copy(o).sub(a).normalize(),c}getTangentAt(t,e){const n=this.getUtoTmapping(t);return this.getTangent(n,e)}computeFrenetFrames(t,e=!1){const n=new U,r=[],s=[],a=[],o=new U,c=new ne;for(let f=0;f<=t;f++){const g=f/t;r[f]=this.getTangentAt(g,new U)}s[0]=new U,a[0]=new U;let l=Number.MAX_VALUE;const h=Math.abs(r[0].x),u=Math.abs(r[0].y),d=Math.abs(r[0].z);h<=l&&(l=h,n.set(1,0,0)),u<=l&&(l=u,n.set(0,1,0)),d<=l&&n.set(0,0,1),o.crossVectors(r[0],n).normalize(),s[0].crossVectors(r[0],o),a[0].crossVectors(r[0],s[0]);for(let f=1;f<=t;f++){if(s[f]=s[f-1].clone(),a[f]=a[f-1].clone(),o.crossVectors(r[f-1],r[f]),o.length()>Number.EPSILON){o.normalize();const g=Math.acos(Qt(r[f-1].dot(r[f]),-1,1));s[f].applyMatrix4(c.makeRotationAxis(o,g))}a[f].crossVectors(r[f],s[f])}if(e===!0){let f=Math.acos(Qt(s[0].dot(s[t]),-1,1));f/=t,r[0].dot(o.crossVectors(s[0],s[t]))>0&&(f=-f);for(let g=1;g<=t;g++)s[g].applyMatrix4(c.makeRotationAxis(r[g],f*g)),a[g].crossVectors(r[g],s[g])}return{tangents:r,normals:s,binormals:a}}clone(){return new this.constructor().copy(this)}copy(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}toJSON(){const t={metadata:{version:4.7,type:"Curve",generator:"Curve.toJSON"}};return t.arcLengthDivisions=this.arcLengthDivisions,t.type=this.type,t}fromJSON(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}}class _u extends oi{constructor(t=0,e=0,n=1,r=1,s=0,a=Math.PI*2,o=!1,c=0){super(),this.isEllipseCurve=!0,this.type="EllipseCurve",this.aX=t,this.aY=e,this.xRadius=n,this.yRadius=r,this.aStartAngle=s,this.aEndAngle=a,this.aClockwise=o,this.aRotation=c}getPoint(t,e=new Rt){const n=e,r=Math.PI*2;let s=this.aEndAngle-this.aStartAngle;const a=Math.abs(s)<Number.EPSILON;for(;s<0;)s+=r;for(;s>r;)s-=r;s<Number.EPSILON&&(a?s=0:s=r),this.aClockwise===!0&&!a&&(s===r?s=-r:s=s-r);const o=this.aStartAngle+t*s;let c=this.aX+this.xRadius*Math.cos(o),l=this.aY+this.yRadius*Math.sin(o);if(this.aRotation!==0){const h=Math.cos(this.aRotation),u=Math.sin(this.aRotation),d=c-this.aX,f=l-this.aY;c=d*h-f*u+this.aX,l=d*u+f*h+this.aY}return n.set(c,l)}copy(t){return super.copy(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}toJSON(){const t=super.toJSON();return t.aX=this.aX,t.aY=this.aY,t.xRadius=this.xRadius,t.yRadius=this.yRadius,t.aStartAngle=this.aStartAngle,t.aEndAngle=this.aEndAngle,t.aClockwise=this.aClockwise,t.aRotation=this.aRotation,t}fromJSON(t){return super.fromJSON(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}}class f0 extends _u{constructor(t,e,n,r,s,a){super(t,e,n,n,r,s,a),this.isArcCurve=!0,this.type="ArcCurve"}}function Ac(){let i=0,t=0,e=0,n=0;function r(s,a,o,c){i=s,t=o,e=-3*s+3*a-2*o-c,n=2*s-2*a+o+c}return{initCatmullRom:function(s,a,o,c,l){r(a,o,l*(o-s),l*(c-a))},initNonuniformCatmullRom:function(s,a,o,c,l,h,u){let d=(a-s)/l-(o-s)/(l+h)+(o-a)/h,f=(o-a)/h-(c-a)/(h+u)+(c-o)/u;d*=h,f*=h,r(a,o,d,f)},calc:function(s){const a=s*s,o=a*s;return i+t*s+e*a+n*o}}}const Hs=new U,qa=new Ac,Ya=new Ac,$a=new Ac;class Qn extends oi{constructor(t=[],e=!1,n="centripetal",r=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=t,this.closed=e,this.curveType=n,this.tension=r}getPoint(t,e=new U){const n=e,r=this.points,s=r.length,a=(s-(this.closed?0:1))*t;let o=Math.floor(a),c=a-o;this.closed?o+=o>0?0:(Math.floor(Math.abs(o)/s)+1)*s:c===0&&o===s-1&&(o=s-2,c=1);let l,h;this.closed||o>0?l=r[(o-1)%s]:(Hs.subVectors(r[0],r[1]).add(r[0]),l=Hs);const u=r[o%s],d=r[(o+1)%s];if(this.closed||o+2<s?h=r[(o+2)%s]:(Hs.subVectors(r[s-1],r[s-2]).add(r[s-1]),h=Hs),this.curveType==="centripetal"||this.curveType==="chordal"){const f=this.curveType==="chordal"?.5:.25;let g=Math.pow(l.distanceToSquared(u),f),v=Math.pow(u.distanceToSquared(d),f),m=Math.pow(d.distanceToSquared(h),f);v<1e-4&&(v=1),g<1e-4&&(g=v),m<1e-4&&(m=v),qa.initNonuniformCatmullRom(l.x,u.x,d.x,h.x,g,v,m),Ya.initNonuniformCatmullRom(l.y,u.y,d.y,h.y,g,v,m),$a.initNonuniformCatmullRom(l.z,u.z,d.z,h.z,g,v,m)}else this.curveType==="catmullrom"&&(qa.initCatmullRom(l.x,u.x,d.x,h.x,this.tension),Ya.initCatmullRom(l.y,u.y,d.y,h.y,this.tension),$a.initCatmullRom(l.z,u.z,d.z,h.z,this.tension));return n.set(qa.calc(c),Ya.calc(c),$a.calc(c)),n}copy(t){super.copy(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){const r=t.points[e];this.points.push(r.clone())}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}toJSON(){const t=super.toJSON();t.points=[];for(let e=0,n=this.points.length;e<n;e++){const r=this.points[e];t.points.push(r.toArray())}return t.closed=this.closed,t.curveType=this.curveType,t.tension=this.tension,t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){const r=t.points[e];this.points.push(new U().fromArray(r))}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}}function Dl(i,t,e,n,r){const s=(n-t)*.5,a=(r-e)*.5,o=i*i,c=i*o;return(2*e-2*n+s+a)*c+(-3*e+3*n-2*s-a)*o+s*i+e}function d0(i,t){const e=1-i;return e*e*t}function p0(i,t){return 2*(1-i)*i*t}function m0(i,t){return i*i*t}function Jr(i,t,e,n){return d0(i,t)+p0(i,e)+m0(i,n)}function g0(i,t){const e=1-i;return e*e*e*t}function v0(i,t){const e=1-i;return 3*e*e*i*t}function _0(i,t){return 3*(1-i)*i*i*t}function x0(i,t){return i*i*i*t}function Qr(i,t,e,n,r){return g0(i,t)+v0(i,e)+_0(i,n)+x0(i,r)}class M0 extends oi{constructor(t=new Rt,e=new Rt,n=new Rt,r=new Rt){super(),this.isCubicBezierCurve=!0,this.type="CubicBezierCurve",this.v0=t,this.v1=e,this.v2=n,this.v3=r}getPoint(t,e=new Rt){const n=e,r=this.v0,s=this.v1,a=this.v2,o=this.v3;return n.set(Qr(t,r.x,s.x,a.x,o.x),Qr(t,r.y,s.y,a.y,o.y)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}}class b0 extends oi{constructor(t=new U,e=new U,n=new U,r=new U){super(),this.isCubicBezierCurve3=!0,this.type="CubicBezierCurve3",this.v0=t,this.v1=e,this.v2=n,this.v3=r}getPoint(t,e=new U){const n=e,r=this.v0,s=this.v1,a=this.v2,o=this.v3;return n.set(Qr(t,r.x,s.x,a.x,o.x),Qr(t,r.y,s.y,a.y,o.y),Qr(t,r.z,s.z,a.z,o.z)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}}class y0 extends oi{constructor(t=new Rt,e=new Rt){super(),this.isLineCurve=!0,this.type="LineCurve",this.v1=t,this.v2=e}getPoint(t,e=new Rt){const n=e;return t===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(t).add(this.v1)),n}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new Rt){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class S0 extends oi{constructor(t=new U,e=new U){super(),this.isLineCurve3=!0,this.type="LineCurve3",this.v1=t,this.v2=e}getPoint(t,e=new U){const n=e;return t===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(t).add(this.v1)),n}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new U){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class E0 extends oi{constructor(t=new Rt,e=new Rt,n=new Rt){super(),this.isQuadraticBezierCurve=!0,this.type="QuadraticBezierCurve",this.v0=t,this.v1=e,this.v2=n}getPoint(t,e=new Rt){const n=e,r=this.v0,s=this.v1,a=this.v2;return n.set(Jr(t,r.x,s.x,a.x),Jr(t,r.y,s.y,a.y)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class xu extends oi{constructor(t=new U,e=new U,n=new U){super(),this.isQuadraticBezierCurve3=!0,this.type="QuadraticBezierCurve3",this.v0=t,this.v1=e,this.v2=n}getPoint(t,e=new U){const n=e,r=this.v0,s=this.v1,a=this.v2;return n.set(Jr(t,r.x,s.x,a.x),Jr(t,r.y,s.y,a.y),Jr(t,r.z,s.z,a.z)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class w0 extends oi{constructor(t=[]){super(),this.isSplineCurve=!0,this.type="SplineCurve",this.points=t}getPoint(t,e=new Rt){const n=e,r=this.points,s=(r.length-1)*t,a=Math.floor(s),o=s-a,c=r[a===0?a:a-1],l=r[a],h=r[a>r.length-2?r.length-1:a+1],u=r[a>r.length-3?r.length-1:a+2];return n.set(Dl(o,c.x,l.x,h.x,u.x),Dl(o,c.y,l.y,h.y,u.y)),n}copy(t){super.copy(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){const r=t.points[e];this.points.push(r.clone())}return this}toJSON(){const t=super.toJSON();t.points=[];for(let e=0,n=this.points.length;e<n;e++){const r=this.points[e];t.points.push(r.toArray())}return t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){const r=t.points[e];this.points.push(new Rt().fromArray(r))}return this}}var T0=Object.freeze({__proto__:null,ArcCurve:f0,CatmullRomCurve3:Qn,CubicBezierCurve:M0,CubicBezierCurve3:b0,EllipseCurve:_u,LineCurve:y0,LineCurve3:S0,QuadraticBezierCurve:E0,QuadraticBezierCurve3:xu,SplineCurve:w0});class Pr extends Ne{constructor(t=[new Rt(0,-.5),new Rt(.5,0),new Rt(0,.5)],e=12,n=0,r=Math.PI*2){super(),this.type="LatheGeometry",this.parameters={points:t,segments:e,phiStart:n,phiLength:r},e=Math.floor(e),r=Qt(r,0,Math.PI*2);const s=[],a=[],o=[],c=[],l=[],h=1/e,u=new U,d=new Rt,f=new U,g=new U,v=new U;let m=0,p=0;for(let S=0;S<=t.length-1;S++)switch(S){case 0:m=t[S+1].x-t[S].x,p=t[S+1].y-t[S].y,f.x=p*1,f.y=-m,f.z=p*0,v.copy(f),f.normalize(),c.push(f.x,f.y,f.z);break;case t.length-1:c.push(v.x,v.y,v.z);break;default:m=t[S+1].x-t[S].x,p=t[S+1].y-t[S].y,f.x=p*1,f.y=-m,f.z=p*0,g.copy(f),f.x+=v.x,f.y+=v.y,f.z+=v.z,f.normalize(),c.push(f.x,f.y,f.z),v.copy(g)}for(let S=0;S<=e;S++){const b=n+S*h*r,M=Math.sin(b),E=Math.cos(b);for(let T=0;T<=t.length-1;T++){u.x=t[T].x*M,u.y=t[T].y,u.z=t[T].x*E,a.push(u.x,u.y,u.z),d.x=S/e,d.y=T/(t.length-1),o.push(d.x,d.y);const A=c[3*T+0]*M,R=c[3*T+1],_=c[3*T+0]*E;l.push(A,R,_)}}for(let S=0;S<e;S++)for(let b=0;b<t.length-1;b++){const M=b+S*t.length,E=M,T=M+t.length,A=M+t.length+1,R=M+1;s.push(E,T,R),s.push(A,R,T)}this.setIndex(s),this.setAttribute("position",new he(a,3)),this.setAttribute("uv",new he(o,2)),this.setAttribute("normal",new he(l,3))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Pr(t.points,t.segments,t.phiStart,t.phiLength)}}class Ei extends Ne{constructor(t=1,e=1,n=1,r=1){super(),this.type="PlaneGeometry",this.parameters={width:t,height:e,widthSegments:n,heightSegments:r};const s=t/2,a=e/2,o=Math.floor(n),c=Math.floor(r),l=o+1,h=c+1,u=t/o,d=e/c,f=[],g=[],v=[],m=[];for(let p=0;p<h;p++){const S=p*d-a;for(let b=0;b<l;b++){const M=b*u-s;g.push(M,-S,0),v.push(0,0,1),m.push(b/o),m.push(1-p/c)}}for(let p=0;p<c;p++)for(let S=0;S<o;S++){const b=S+l*p,M=S+l*(p+1),E=S+1+l*(p+1),T=S+1+l*p;f.push(b,M,T),f.push(M,E,T)}this.setIndex(f),this.setAttribute("position",new he(g,3)),this.setAttribute("normal",new he(v,3)),this.setAttribute("uv",new he(m,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Ei(t.width,t.height,t.widthSegments,t.heightSegments)}}class Re extends Ne{constructor(t=1,e=32,n=16,r=0,s=Math.PI*2,a=0,o=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:t,widthSegments:e,heightSegments:n,phiStart:r,phiLength:s,thetaStart:a,thetaLength:o},e=Math.max(3,Math.floor(e)),n=Math.max(2,Math.floor(n));const c=Math.min(a+o,Math.PI);let l=0;const h=[],u=new U,d=new U,f=[],g=[],v=[],m=[];for(let p=0;p<=n;p++){const S=[],b=p/n;let M=0;p===0&&a===0?M=.5/e:p===n&&c===Math.PI&&(M=-.5/e);for(let E=0;E<=e;E++){const T=E/e;u.x=-t*Math.cos(r+T*s)*Math.sin(a+b*o),u.y=t*Math.cos(a+b*o),u.z=t*Math.sin(r+T*s)*Math.sin(a+b*o),g.push(u.x,u.y,u.z),d.copy(u).normalize(),v.push(d.x,d.y,d.z),m.push(T+M,1-b),S.push(l++)}h.push(S)}for(let p=0;p<n;p++)for(let S=0;S<e;S++){const b=h[p][S+1],M=h[p][S],E=h[p+1][S],T=h[p+1][S+1];(p!==0||a>0)&&f.push(b,M,T),(p!==n-1||c<Math.PI)&&f.push(M,E,T)}this.setIndex(f),this.setAttribute("position",new he(g,3)),this.setAttribute("normal",new he(v,3)),this.setAttribute("uv",new he(m,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Re(t.radius,t.widthSegments,t.heightSegments,t.phiStart,t.phiLength,t.thetaStart,t.thetaLength)}}class Dr extends Ne{constructor(t=1,e=.4,n=12,r=48,s=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:t,tube:e,radialSegments:n,tubularSegments:r,arc:s},n=Math.floor(n),r=Math.floor(r);const a=[],o=[],c=[],l=[],h=new U,u=new U,d=new U;for(let f=0;f<=n;f++)for(let g=0;g<=r;g++){const v=g/r*s,m=f/n*Math.PI*2;u.x=(t+e*Math.cos(m))*Math.cos(v),u.y=(t+e*Math.cos(m))*Math.sin(v),u.z=e*Math.sin(m),o.push(u.x,u.y,u.z),h.x=t*Math.cos(v),h.y=t*Math.sin(v),d.subVectors(u,h).normalize(),c.push(d.x,d.y,d.z),l.push(g/r),l.push(f/n)}for(let f=1;f<=n;f++)for(let g=1;g<=r;g++){const v=(r+1)*f+g-1,m=(r+1)*(f-1)+g-1,p=(r+1)*(f-1)+g,S=(r+1)*f+g;a.push(v,m,S),a.push(m,p,S)}this.setIndex(a),this.setAttribute("position",new he(o,3)),this.setAttribute("normal",new he(c,3)),this.setAttribute("uv",new he(l,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Dr(t.radius,t.tube,t.radialSegments,t.tubularSegments,t.arc)}}class Or extends Ne{constructor(t=new xu(new U(-1,-1,0),new U(-1,1,0),new U(1,1,0)),e=64,n=1,r=8,s=!1){super(),this.type="TubeGeometry",this.parameters={path:t,tubularSegments:e,radius:n,radialSegments:r,closed:s};const a=t.computeFrenetFrames(e,s);this.tangents=a.tangents,this.normals=a.normals,this.binormals=a.binormals;const o=new U,c=new U,l=new Rt;let h=new U;const u=[],d=[],f=[],g=[];v(),this.setIndex(g),this.setAttribute("position",new he(u,3)),this.setAttribute("normal",new he(d,3)),this.setAttribute("uv",new he(f,2));function v(){for(let b=0;b<e;b++)m(b);m(s===!1?e:0),S(),p()}function m(b){h=t.getPointAt(b/e,h);const M=a.normals[b],E=a.binormals[b];for(let T=0;T<=r;T++){const A=T/r*Math.PI*2,R=Math.sin(A),_=-Math.cos(A);c.x=_*M.x+R*E.x,c.y=_*M.y+R*E.y,c.z=_*M.z+R*E.z,c.normalize(),d.push(c.x,c.y,c.z),o.x=h.x+n*c.x,o.y=h.y+n*c.y,o.z=h.z+n*c.z,u.push(o.x,o.y,o.z)}}function p(){for(let b=1;b<=e;b++)for(let M=1;M<=r;M++){const E=(r+1)*(b-1)+(M-1),T=(r+1)*b+(M-1),A=(r+1)*b+M,R=(r+1)*(b-1)+M;g.push(E,T,R),g.push(T,A,R)}}function S(){for(let b=0;b<=e;b++)for(let M=0;M<=r;M++)l.x=b/e,l.y=M/r,f.push(l.x,l.y)}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}toJSON(){const t=super.toJSON();return t.path=this.parameters.path.toJSON(),t}static fromJSON(t){return new Or(new T0[t.path.type]().fromJSON(t.path),t.tubularSegments,t.radius,t.radialSegments,t.closed)}}class xi extends ps{constructor(t){super(),this.isMeshStandardMaterial=!0,this.type="MeshStandardMaterial",this.defines={STANDARD:""},this.color=new Ht(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Ht(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=nu,this.normalScale=new Rt(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new _n,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.defines={STANDARD:""},this.color.copy(t.color),this.roughness=t.roughness,this.metalness=t.metalness,this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.emissive.copy(t.emissive),this.emissiveMap=t.emissiveMap,this.emissiveIntensity=t.emissiveIntensity,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.roughnessMap=t.roughnessMap,this.metalnessMap=t.metalnessMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.envMapIntensity=t.envMapIntensity,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.flatShading=t.flatShading,this.fog=t.fog,this}}class A0 extends ps{constructor(t){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=rd,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(t)}copy(t){return super.copy(t),this.depthPacking=t.depthPacking,this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this}}class R0 extends ps{constructor(t){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(t)}copy(t){return super.copy(t),this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this}}class Mu extends Ue{constructor(t,e=1){super(),this.isLight=!0,this.type="Light",this.color=new Ht(t),this.intensity=e}dispose(){}copy(t,e){return super.copy(t,e),this.color.copy(t.color),this.intensity=t.intensity,this}toJSON(t){const e=super.toJSON(t);return e.object.color=this.color.getHex(),e.object.intensity=this.intensity,this.groundColor!==void 0&&(e.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(e.object.distance=this.distance),this.angle!==void 0&&(e.object.angle=this.angle),this.decay!==void 0&&(e.object.decay=this.decay),this.penumbra!==void 0&&(e.object.penumbra=this.penumbra),this.shadow!==void 0&&(e.object.shadow=this.shadow.toJSON()),this.target!==void 0&&(e.object.target=this.target.uuid),e}}class C0 extends Mu{constructor(t,e,n){super(t,n),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(Ue.DEFAULT_UP),this.updateMatrix(),this.groundColor=new Ht(e)}copy(t,e){return super.copy(t,e),this.groundColor.copy(t.groundColor),this}}const ja=new ne,Il=new U,Ul=new U;class L0{constructor(t){this.camera=t,this.intensity=1,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new Rt(512,512),this.mapType=Ln,this.map=null,this.mapPass=null,this.matrix=new ne,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new Ec,this._frameExtents=new Rt(1,1),this._viewportCount=1,this._viewports=[new se(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(t){const e=this.camera,n=this.matrix;Il.setFromMatrixPosition(t.matrixWorld),e.position.copy(Il),Ul.setFromMatrixPosition(t.target.matrixWorld),e.lookAt(Ul),e.updateMatrixWorld(),ja.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),this._frustum.setFromProjectionMatrix(ja,e.coordinateSystem,e.reversedDepth),e.reversedDepth?n.set(.5,0,0,.5,0,.5,0,.5,0,0,1,0,0,0,0,1):n.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),n.multiply(ja)}getViewport(t){return this._viewports[t]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(t){return this.camera=t.camera.clone(),this.intensity=t.intensity,this.bias=t.bias,this.radius=t.radius,this.autoUpdate=t.autoUpdate,this.needsUpdate=t.needsUpdate,this.normalBias=t.normalBias,this.blurSamples=t.blurSamples,this.mapSize.copy(t.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){const t={};return this.intensity!==1&&(t.intensity=this.intensity),this.bias!==0&&(t.bias=this.bias),this.normalBias!==0&&(t.normalBias=this.normalBias),this.radius!==1&&(t.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(t.mapSize=this.mapSize.toArray()),t.camera=this.camera.toJSON(!1).object,delete t.camera.matrix,t}}class Rc extends uu{constructor(t=-1,e=1,n=1,r=-1,s=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=t,this.right=e,this.top=n,this.bottom=r,this.near=s,this.far=a,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.left=t.left,this.right=t.right,this.top=t.top,this.bottom=t.bottom,this.near=t.near,this.far=t.far,this.zoom=t.zoom,this.view=t.view===null?null:Object.assign({},t.view),this}setViewOffset(t,e,n,r,s,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=r,this.view.width=s,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=(this.right-this.left)/(2*this.zoom),e=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,r=(this.top+this.bottom)/2;let s=n-t,a=n+t,o=r+e,c=r-e;if(this.view!==null&&this.view.enabled){const l=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;s+=l*this.view.offsetX,a=s+l*this.view.width,o-=h*this.view.offsetY,c=o-h*this.view.height}this.projectionMatrix.makeOrthographic(s,a,o,c,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.zoom=this.zoom,e.object.left=this.left,e.object.right=this.right,e.object.top=this.top,e.object.bottom=this.bottom,e.object.near=this.near,e.object.far=this.far,this.view!==null&&(e.object.view=Object.assign({},this.view)),e}}class P0 extends L0{constructor(){super(new Rc(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class nc extends Mu{constructor(t,e){super(t,e),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(Ue.DEFAULT_UP),this.updateMatrix(),this.target=new Ue,this.shadow=new P0}dispose(){this.shadow.dispose()}copy(t){return super.copy(t),this.target=t.target.clone(),this.shadow=t.shadow.clone(),this}}class D0 extends vn{constructor(t=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=t}}function Nl(i,t,e,n){const r=I0(n);switch(e){case Jh:return i*t;case tu:return i*t/r.components*r.byteLength;case vc:return i*t/r.components*r.byteLength;case eu:return i*t*2/r.components*r.byteLength;case _c:return i*t*2/r.components*r.byteLength;case Qh:return i*t*3/r.components*r.byteLength;case Ve:return i*t*4/r.components*r.byteLength;case xc:return i*t*4/r.components*r.byteLength;case ea:case na:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*8;case ia:case ra:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*16;case Co:case Po:return Math.max(i,16)*Math.max(t,8)/4;case Ro:case Lo:return Math.max(i,8)*Math.max(t,8)/2;case Do:case Io:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*8;case Uo:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*16;case No:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*16;case Fo:return Math.floor((i+4)/5)*Math.floor((t+3)/4)*16;case Oo:return Math.floor((i+4)/5)*Math.floor((t+4)/5)*16;case Bo:return Math.floor((i+5)/6)*Math.floor((t+4)/5)*16;case ko:return Math.floor((i+5)/6)*Math.floor((t+5)/6)*16;case zo:return Math.floor((i+7)/8)*Math.floor((t+4)/5)*16;case Ho:return Math.floor((i+7)/8)*Math.floor((t+5)/6)*16;case Vo:return Math.floor((i+7)/8)*Math.floor((t+7)/8)*16;case Go:return Math.floor((i+9)/10)*Math.floor((t+4)/5)*16;case Wo:return Math.floor((i+9)/10)*Math.floor((t+5)/6)*16;case Xo:return Math.floor((i+9)/10)*Math.floor((t+7)/8)*16;case qo:return Math.floor((i+9)/10)*Math.floor((t+9)/10)*16;case Yo:return Math.floor((i+11)/12)*Math.floor((t+9)/10)*16;case $o:return Math.floor((i+11)/12)*Math.floor((t+11)/12)*16;case jo:case Zo:case Ko:return Math.ceil(i/4)*Math.ceil(t/4)*16;case Jo:case Qo:return Math.ceil(i/4)*Math.ceil(t/4)*8;case tc:case ec:return Math.ceil(i/4)*Math.ceil(t/4)*16}throw new Error(`Unable to determine texture byte length for ${e} format.`)}function I0(i){switch(i){case Ln:case $h:return{byteLength:1,components:1};case rs:case jh:case ji:return{byteLength:2,components:1};case mc:case gc:return{byteLength:2,components:4};case qi:case pc:case zn:return{byteLength:4,components:1};case Zh:case Kh:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${i}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:dc}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=dc);/**
 * @license
 * Copyright 2010-2025 Three.js Authors
 * SPDX-License-Identifier: MIT
 */function bu(){let i=null,t=!1,e=null,n=null;function r(s,a){e(s,a),n=i.requestAnimationFrame(r)}return{start:function(){t!==!0&&e!==null&&(n=i.requestAnimationFrame(r),t=!0)},stop:function(){i.cancelAnimationFrame(n),t=!1},setAnimationLoop:function(s){e=s},setContext:function(s){i=s}}}function U0(i){const t=new WeakMap;function e(o,c){const l=o.array,h=o.usage,u=l.byteLength,d=i.createBuffer();i.bindBuffer(c,d),i.bufferData(c,l,h),o.onUploadCallback();let f;if(l instanceof Float32Array)f=i.FLOAT;else if(typeof Float16Array<"u"&&l instanceof Float16Array)f=i.HALF_FLOAT;else if(l instanceof Uint16Array)o.isFloat16BufferAttribute?f=i.HALF_FLOAT:f=i.UNSIGNED_SHORT;else if(l instanceof Int16Array)f=i.SHORT;else if(l instanceof Uint32Array)f=i.UNSIGNED_INT;else if(l instanceof Int32Array)f=i.INT;else if(l instanceof Int8Array)f=i.BYTE;else if(l instanceof Uint8Array)f=i.UNSIGNED_BYTE;else if(l instanceof Uint8ClampedArray)f=i.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+l);return{buffer:d,type:f,bytesPerElement:l.BYTES_PER_ELEMENT,version:o.version,size:u}}function n(o,c,l){const h=c.array,u=c.updateRanges;if(i.bindBuffer(l,o),u.length===0)i.bufferSubData(l,0,h);else{u.sort((f,g)=>f.start-g.start);let d=0;for(let f=1;f<u.length;f++){const g=u[d],v=u[f];v.start<=g.start+g.count+1?g.count=Math.max(g.count,v.start+v.count-g.start):(++d,u[d]=v)}u.length=d+1;for(let f=0,g=u.length;f<g;f++){const v=u[f];i.bufferSubData(l,v.start*h.BYTES_PER_ELEMENT,h,v.start,v.count)}c.clearUpdateRanges()}c.onUploadCallback()}function r(o){return o.isInterleavedBufferAttribute&&(o=o.data),t.get(o)}function s(o){o.isInterleavedBufferAttribute&&(o=o.data);const c=t.get(o);c&&(i.deleteBuffer(c.buffer),t.delete(o))}function a(o,c){if(o.isInterleavedBufferAttribute&&(o=o.data),o.isGLBufferAttribute){const h=t.get(o);(!h||h.version<o.version)&&t.set(o,{buffer:o.buffer,type:o.type,bytesPerElement:o.elementSize,version:o.version});return}const l=t.get(o);if(l===void 0)t.set(o,e(o,c));else if(l.version<o.version){if(l.size!==o.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");n(l.buffer,o,c),l.version=o.version}}return{get:r,remove:s,update:a}}var N0=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,F0=`#ifdef USE_ALPHAHASH
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
#endif`,O0=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,B0=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,k0=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,z0=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,H0=`#ifdef USE_AOMAP
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
#endif`,V0=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,G0=`#ifdef USE_BATCHING
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
#endif`,W0=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,X0=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,q0=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,Y0=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,$0=`#ifdef USE_IRIDESCENCE
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
#endif`,j0=`#ifdef USE_BUMPMAP
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
#endif`,Z0=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,K0=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,J0=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,Q0=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,tp=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,ep=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,np=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,ip=`#if defined( USE_COLOR_ALPHA )
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
#endif`,rp=`#define PI 3.141592653589793
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
} // validated`,sp=`#ifdef ENVMAP_TYPE_CUBE_UV
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
#endif`,ap=`vec3 transformedNormal = objectNormal;
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
#endif`,op=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,cp=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,lp=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,hp=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,up="gl_FragColor = linearToOutputTexel( gl_FragColor );",fp=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,dp=`#ifdef USE_ENVMAP
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
#endif`,pp=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,mp=`#ifdef USE_ENVMAP
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
#endif`,gp=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,vp=`#ifdef USE_ENVMAP
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
#endif`,_p=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,xp=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,Mp=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,bp=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,yp=`#ifdef USE_GRADIENTMAP
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
}`,Sp=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,Ep=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,wp=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,Tp=`uniform bool receiveShadow;
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
#endif`,Ap=`#ifdef USE_ENVMAP
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
#endif`,Rp=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,Cp=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,Lp=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,Pp=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,Dp=`PhysicalMaterial material;
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
#endif`,Ip=`struct PhysicalMaterial {
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
}`,Up=`
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
#endif`,Np=`#if defined( RE_IndirectDiffuse )
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
#endif`,Fp=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,Op=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,Bp=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,kp=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,zp=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,Hp=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,Vp=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,Gp=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,Wp=`#if defined( USE_POINTS_UV )
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
#endif`,Xp=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,qp=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,Yp=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,$p=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,jp=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Zp=`#ifdef USE_MORPHTARGETS
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
#endif`,Kp=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Jp=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 nonPerturbedNormal = normal;`,Qp=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
#endif`,t1=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,e1=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,n1=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,i1=`#ifdef USE_NORMALMAP
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
#endif`,r1=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,s1=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,a1=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,o1=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,c1=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,l1=`vec3 packNormalToRGB( const in vec3 normal ) {
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
}`,h1=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,u1=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,f1=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,d1=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,p1=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,m1=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,g1=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,v1=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,_1=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
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
#endif`,x1=`float getShadowMask() {
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
}`,M1=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,b1=`#ifdef USE_SKINNING
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
#endif`,y1=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,S1=`#ifdef USE_SKINNING
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
#endif`,E1=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,w1=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,T1=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,A1=`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,R1=`#ifdef USE_TRANSMISSION
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
#endif`,C1=`#ifdef USE_TRANSMISSION
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
#endif`,L1=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,P1=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,D1=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,I1=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const U1=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,N1=`uniform sampler2D t2D;
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
}`,F1=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,O1=`#ifdef ENVMAP_TYPE_CUBE
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
}`,B1=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,k1=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,z1=`#include <common>
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
}`,H1=`#if DEPTH_PACKING == 3200
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
}`,V1=`#define DISTANCE
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
}`,G1=`#define DISTANCE
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
}`,W1=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,X1=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,q1=`uniform float scale;
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
}`,Y1=`uniform vec3 diffuse;
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
}`,$1=`#include <common>
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
}`,j1=`uniform vec3 diffuse;
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
}`,Z1=`#define LAMBERT
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
}`,K1=`#define LAMBERT
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
}`,J1=`#define MATCAP
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
}`,Q1=`#define MATCAP
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
}`,tm=`#define NORMAL
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
}`,em=`#define NORMAL
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
}`,nm=`#define PHONG
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
}`,im=`#define PHONG
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
}`,rm=`#define STANDARD
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
}`,sm=`#define STANDARD
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
}`,am=`#define TOON
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
}`,om=`#define TOON
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
}`,cm=`uniform float size;
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
}`,lm=`uniform vec3 diffuse;
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
}`,hm=`#include <common>
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
}`,um=`uniform vec3 color;
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
}`,fm=`uniform float rotation;
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
}`,dm=`uniform vec3 diffuse;
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
}`,Jt={alphahash_fragment:N0,alphahash_pars_fragment:F0,alphamap_fragment:O0,alphamap_pars_fragment:B0,alphatest_fragment:k0,alphatest_pars_fragment:z0,aomap_fragment:H0,aomap_pars_fragment:V0,batching_pars_vertex:G0,batching_vertex:W0,begin_vertex:X0,beginnormal_vertex:q0,bsdfs:Y0,iridescence_fragment:$0,bumpmap_pars_fragment:j0,clipping_planes_fragment:Z0,clipping_planes_pars_fragment:K0,clipping_planes_pars_vertex:J0,clipping_planes_vertex:Q0,color_fragment:tp,color_pars_fragment:ep,color_pars_vertex:np,color_vertex:ip,common:rp,cube_uv_reflection_fragment:sp,defaultnormal_vertex:ap,displacementmap_pars_vertex:op,displacementmap_vertex:cp,emissivemap_fragment:lp,emissivemap_pars_fragment:hp,colorspace_fragment:up,colorspace_pars_fragment:fp,envmap_fragment:dp,envmap_common_pars_fragment:pp,envmap_pars_fragment:mp,envmap_pars_vertex:gp,envmap_physical_pars_fragment:Ap,envmap_vertex:vp,fog_vertex:_p,fog_pars_vertex:xp,fog_fragment:Mp,fog_pars_fragment:bp,gradientmap_pars_fragment:yp,lightmap_pars_fragment:Sp,lights_lambert_fragment:Ep,lights_lambert_pars_fragment:wp,lights_pars_begin:Tp,lights_toon_fragment:Rp,lights_toon_pars_fragment:Cp,lights_phong_fragment:Lp,lights_phong_pars_fragment:Pp,lights_physical_fragment:Dp,lights_physical_pars_fragment:Ip,lights_fragment_begin:Up,lights_fragment_maps:Np,lights_fragment_end:Fp,logdepthbuf_fragment:Op,logdepthbuf_pars_fragment:Bp,logdepthbuf_pars_vertex:kp,logdepthbuf_vertex:zp,map_fragment:Hp,map_pars_fragment:Vp,map_particle_fragment:Gp,map_particle_pars_fragment:Wp,metalnessmap_fragment:Xp,metalnessmap_pars_fragment:qp,morphinstance_vertex:Yp,morphcolor_vertex:$p,morphnormal_vertex:jp,morphtarget_pars_vertex:Zp,morphtarget_vertex:Kp,normal_fragment_begin:Jp,normal_fragment_maps:Qp,normal_pars_fragment:t1,normal_pars_vertex:e1,normal_vertex:n1,normalmap_pars_fragment:i1,clearcoat_normal_fragment_begin:r1,clearcoat_normal_fragment_maps:s1,clearcoat_pars_fragment:a1,iridescence_pars_fragment:o1,opaque_fragment:c1,packing:l1,premultiplied_alpha_fragment:h1,project_vertex:u1,dithering_fragment:f1,dithering_pars_fragment:d1,roughnessmap_fragment:p1,roughnessmap_pars_fragment:m1,shadowmap_pars_fragment:g1,shadowmap_pars_vertex:v1,shadowmap_vertex:_1,shadowmask_pars_fragment:x1,skinbase_vertex:M1,skinning_pars_vertex:b1,skinning_vertex:y1,skinnormal_vertex:S1,specularmap_fragment:E1,specularmap_pars_fragment:w1,tonemapping_fragment:T1,tonemapping_pars_fragment:A1,transmission_fragment:R1,transmission_pars_fragment:C1,uv_pars_fragment:L1,uv_pars_vertex:P1,uv_vertex:D1,worldpos_vertex:I1,background_vert:U1,background_frag:N1,backgroundCube_vert:F1,backgroundCube_frag:O1,cube_vert:B1,cube_frag:k1,depth_vert:z1,depth_frag:H1,distanceRGBA_vert:V1,distanceRGBA_frag:G1,equirect_vert:W1,equirect_frag:X1,linedashed_vert:q1,linedashed_frag:Y1,meshbasic_vert:$1,meshbasic_frag:j1,meshlambert_vert:Z1,meshlambert_frag:K1,meshmatcap_vert:J1,meshmatcap_frag:Q1,meshnormal_vert:tm,meshnormal_frag:em,meshphong_vert:nm,meshphong_frag:im,meshphysical_vert:rm,meshphysical_frag:sm,meshtoon_vert:am,meshtoon_frag:om,points_vert:cm,points_frag:lm,shadow_vert:hm,shadow_frag:um,sprite_vert:fm,sprite_frag:dm},Et={common:{diffuse:{value:new Ht(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Zt},alphaMap:{value:null},alphaMapTransform:{value:new Zt},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Zt}},envmap:{envMap:{value:null},envMapRotation:{value:new Zt},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Zt}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Zt}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Zt},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Zt},normalScale:{value:new Rt(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Zt},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Zt}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Zt}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Zt}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Ht(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new Ht(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Zt},alphaTest:{value:0},uvTransform:{value:new Zt}},sprite:{diffuse:{value:new Ht(16777215)},opacity:{value:1},center:{value:new Rt(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Zt},alphaMap:{value:null},alphaMapTransform:{value:new Zt},alphaTest:{value:0}}},Bn={basic:{uniforms:Xe([Et.common,Et.specularmap,Et.envmap,Et.aomap,Et.lightmap,Et.fog]),vertexShader:Jt.meshbasic_vert,fragmentShader:Jt.meshbasic_frag},lambert:{uniforms:Xe([Et.common,Et.specularmap,Et.envmap,Et.aomap,Et.lightmap,Et.emissivemap,Et.bumpmap,Et.normalmap,Et.displacementmap,Et.fog,Et.lights,{emissive:{value:new Ht(0)}}]),vertexShader:Jt.meshlambert_vert,fragmentShader:Jt.meshlambert_frag},phong:{uniforms:Xe([Et.common,Et.specularmap,Et.envmap,Et.aomap,Et.lightmap,Et.emissivemap,Et.bumpmap,Et.normalmap,Et.displacementmap,Et.fog,Et.lights,{emissive:{value:new Ht(0)},specular:{value:new Ht(1118481)},shininess:{value:30}}]),vertexShader:Jt.meshphong_vert,fragmentShader:Jt.meshphong_frag},standard:{uniforms:Xe([Et.common,Et.envmap,Et.aomap,Et.lightmap,Et.emissivemap,Et.bumpmap,Et.normalmap,Et.displacementmap,Et.roughnessmap,Et.metalnessmap,Et.fog,Et.lights,{emissive:{value:new Ht(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Jt.meshphysical_vert,fragmentShader:Jt.meshphysical_frag},toon:{uniforms:Xe([Et.common,Et.aomap,Et.lightmap,Et.emissivemap,Et.bumpmap,Et.normalmap,Et.displacementmap,Et.gradientmap,Et.fog,Et.lights,{emissive:{value:new Ht(0)}}]),vertexShader:Jt.meshtoon_vert,fragmentShader:Jt.meshtoon_frag},matcap:{uniforms:Xe([Et.common,Et.bumpmap,Et.normalmap,Et.displacementmap,Et.fog,{matcap:{value:null}}]),vertexShader:Jt.meshmatcap_vert,fragmentShader:Jt.meshmatcap_frag},points:{uniforms:Xe([Et.points,Et.fog]),vertexShader:Jt.points_vert,fragmentShader:Jt.points_frag},dashed:{uniforms:Xe([Et.common,Et.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Jt.linedashed_vert,fragmentShader:Jt.linedashed_frag},depth:{uniforms:Xe([Et.common,Et.displacementmap]),vertexShader:Jt.depth_vert,fragmentShader:Jt.depth_frag},normal:{uniforms:Xe([Et.common,Et.bumpmap,Et.normalmap,Et.displacementmap,{opacity:{value:1}}]),vertexShader:Jt.meshnormal_vert,fragmentShader:Jt.meshnormal_frag},sprite:{uniforms:Xe([Et.sprite,Et.fog]),vertexShader:Jt.sprite_vert,fragmentShader:Jt.sprite_frag},background:{uniforms:{uvTransform:{value:new Zt},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Jt.background_vert,fragmentShader:Jt.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new Zt}},vertexShader:Jt.backgroundCube_vert,fragmentShader:Jt.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Jt.cube_vert,fragmentShader:Jt.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Jt.equirect_vert,fragmentShader:Jt.equirect_frag},distanceRGBA:{uniforms:Xe([Et.common,Et.displacementmap,{referencePosition:{value:new U},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Jt.distanceRGBA_vert,fragmentShader:Jt.distanceRGBA_frag},shadow:{uniforms:Xe([Et.lights,Et.fog,{color:{value:new Ht(0)},opacity:{value:1}}]),vertexShader:Jt.shadow_vert,fragmentShader:Jt.shadow_frag}};Bn.physical={uniforms:Xe([Bn.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Zt},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Zt},clearcoatNormalScale:{value:new Rt(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Zt},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Zt},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Zt},sheen:{value:0},sheenColor:{value:new Ht(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Zt},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Zt},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Zt},transmissionSamplerSize:{value:new Rt},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Zt},attenuationDistance:{value:0},attenuationColor:{value:new Ht(0)},specularColor:{value:new Ht(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Zt},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Zt},anisotropyVector:{value:new Rt},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Zt}}]),vertexShader:Jt.meshphysical_vert,fragmentShader:Jt.meshphysical_frag};const Vs={r:0,b:0,g:0},Di=new _n,pm=new ne;function mm(i,t,e,n,r,s,a){const o=new Ht(0);let c=s===!0?0:1,l,h,u=null,d=0,f=null;function g(b){let M=b.isScene===!0?b.background:null;return M&&M.isTexture&&(M=(b.backgroundBlurriness>0?e:t).get(M)),M}function v(b){let M=!1;const E=g(b);E===null?p(o,c):E&&E.isColor&&(p(E,1),M=!0);const T=i.xr.getEnvironmentBlendMode();T==="additive"?n.buffers.color.setClear(0,0,0,1,a):T==="alpha-blend"&&n.buffers.color.setClear(0,0,0,0,a),(i.autoClear||M)&&(n.buffers.depth.setTest(!0),n.buffers.depth.setMask(!0),n.buffers.color.setMask(!0),i.clear(i.autoClearColor,i.autoClearDepth,i.autoClearStencil))}function m(b,M){const E=g(M);E&&(E.isCubeTexture||E.mapping===ma)?(h===void 0&&(h=new Gt(new $e(1,1,1),new He({name:"BackgroundCubeMaterial",uniforms:Lr(Bn.backgroundCube.uniforms),vertexShader:Bn.backgroundCube.vertexShader,fragmentShader:Bn.backgroundCube.fragmentShader,side:Je,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),h.geometry.deleteAttribute("normal"),h.geometry.deleteAttribute("uv"),h.onBeforeRender=function(T,A,R){this.matrixWorld.copyPosition(R.matrixWorld)},Object.defineProperty(h.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),r.update(h)),Di.copy(M.backgroundRotation),Di.x*=-1,Di.y*=-1,Di.z*=-1,E.isCubeTexture&&E.isRenderTargetTexture===!1&&(Di.y*=-1,Di.z*=-1),h.material.uniforms.envMap.value=E,h.material.uniforms.flipEnvMap.value=E.isCubeTexture&&E.isRenderTargetTexture===!1?-1:1,h.material.uniforms.backgroundBlurriness.value=M.backgroundBlurriness,h.material.uniforms.backgroundIntensity.value=M.backgroundIntensity,h.material.uniforms.backgroundRotation.value.setFromMatrix4(pm.makeRotationFromEuler(Di)),h.material.toneMapped=re.getTransfer(E.colorSpace)!==le,(u!==E||d!==E.version||f!==i.toneMapping)&&(h.material.needsUpdate=!0,u=E,d=E.version,f=i.toneMapping),h.layers.enableAll(),b.unshift(h,h.geometry,h.material,0,0,null)):E&&E.isTexture&&(l===void 0&&(l=new Gt(new Ei(2,2),new He({name:"BackgroundMaterial",uniforms:Lr(Bn.background.uniforms),vertexShader:Bn.background.vertexShader,fragmentShader:Bn.background.fragmentShader,side:Si,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),l.geometry.deleteAttribute("normal"),Object.defineProperty(l.material,"map",{get:function(){return this.uniforms.t2D.value}}),r.update(l)),l.material.uniforms.t2D.value=E,l.material.uniforms.backgroundIntensity.value=M.backgroundIntensity,l.material.toneMapped=re.getTransfer(E.colorSpace)!==le,E.matrixAutoUpdate===!0&&E.updateMatrix(),l.material.uniforms.uvTransform.value.copy(E.matrix),(u!==E||d!==E.version||f!==i.toneMapping)&&(l.material.needsUpdate=!0,u=E,d=E.version,f=i.toneMapping),l.layers.enableAll(),b.unshift(l,l.geometry,l.material,0,0,null))}function p(b,M){b.getRGB(Vs,hu(i)),n.buffers.color.setClear(Vs.r,Vs.g,Vs.b,M,a)}function S(){h!==void 0&&(h.geometry.dispose(),h.material.dispose(),h=void 0),l!==void 0&&(l.geometry.dispose(),l.material.dispose(),l=void 0)}return{getClearColor:function(){return o},setClearColor:function(b,M=1){o.set(b),c=M,p(o,c)},getClearAlpha:function(){return c},setClearAlpha:function(b){c=b,p(o,c)},render:v,addToRenderList:m,dispose:S}}function gm(i,t){const e=i.getParameter(i.MAX_VERTEX_ATTRIBS),n={},r=d(null);let s=r,a=!1;function o(x,y,w,D,I){let F=!1;const H=u(D,w,y);s!==H&&(s=H,l(s.object)),F=f(x,D,w,I),F&&g(x,D,w,I),I!==null&&t.update(I,i.ELEMENT_ARRAY_BUFFER),(F||a)&&(a=!1,M(x,y,w,D),I!==null&&i.bindBuffer(i.ELEMENT_ARRAY_BUFFER,t.get(I).buffer))}function c(){return i.createVertexArray()}function l(x){return i.bindVertexArray(x)}function h(x){return i.deleteVertexArray(x)}function u(x,y,w){const D=w.wireframe===!0;let I=n[x.id];I===void 0&&(I={},n[x.id]=I);let F=I[y.id];F===void 0&&(F={},I[y.id]=F);let H=F[D];return H===void 0&&(H=d(c()),F[D]=H),H}function d(x){const y=[],w=[],D=[];for(let I=0;I<e;I++)y[I]=0,w[I]=0,D[I]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:y,enabledAttributes:w,attributeDivisors:D,object:x,attributes:{},index:null}}function f(x,y,w,D){const I=s.attributes,F=y.attributes;let H=0;const $=w.getAttributes();for(const V in $)if($[V].location>=0){const rt=I[V];let ct=F[V];if(ct===void 0&&(V==="instanceMatrix"&&x.instanceMatrix&&(ct=x.instanceMatrix),V==="instanceColor"&&x.instanceColor&&(ct=x.instanceColor)),rt===void 0||rt.attribute!==ct||ct&&rt.data!==ct.data)return!0;H++}return s.attributesNum!==H||s.index!==D}function g(x,y,w,D){const I={},F=y.attributes;let H=0;const $=w.getAttributes();for(const V in $)if($[V].location>=0){let rt=F[V];rt===void 0&&(V==="instanceMatrix"&&x.instanceMatrix&&(rt=x.instanceMatrix),V==="instanceColor"&&x.instanceColor&&(rt=x.instanceColor));const ct={};ct.attribute=rt,rt&&rt.data&&(ct.data=rt.data),I[V]=ct,H++}s.attributes=I,s.attributesNum=H,s.index=D}function v(){const x=s.newAttributes;for(let y=0,w=x.length;y<w;y++)x[y]=0}function m(x){p(x,0)}function p(x,y){const w=s.newAttributes,D=s.enabledAttributes,I=s.attributeDivisors;w[x]=1,D[x]===0&&(i.enableVertexAttribArray(x),D[x]=1),I[x]!==y&&(i.vertexAttribDivisor(x,y),I[x]=y)}function S(){const x=s.newAttributes,y=s.enabledAttributes;for(let w=0,D=y.length;w<D;w++)y[w]!==x[w]&&(i.disableVertexAttribArray(w),y[w]=0)}function b(x,y,w,D,I,F,H){H===!0?i.vertexAttribIPointer(x,y,w,I,F):i.vertexAttribPointer(x,y,w,D,I,F)}function M(x,y,w,D){v();const I=D.attributes,F=w.getAttributes(),H=y.defaultAttributeValues;for(const $ in F){const V=F[$];if(V.location>=0){let Q=I[$];if(Q===void 0&&($==="instanceMatrix"&&x.instanceMatrix&&(Q=x.instanceMatrix),$==="instanceColor"&&x.instanceColor&&(Q=x.instanceColor)),Q!==void 0){const rt=Q.normalized,ct=Q.itemSize,gt=t.get(Q);if(gt===void 0)continue;const Ct=gt.buffer,Nt=gt.type,et=gt.bytesPerElement,W=Nt===i.INT||Nt===i.UNSIGNED_INT||Q.gpuType===pc;if(Q.isInterleavedBufferAttribute){const Z=Q.data,N=Z.stride,B=Q.offset;if(Z.isInstancedInterleavedBuffer){for(let k=0;k<V.locationSize;k++)p(V.location+k,Z.meshPerAttribute);x.isInstancedMesh!==!0&&D._maxInstanceCount===void 0&&(D._maxInstanceCount=Z.meshPerAttribute*Z.count)}else for(let k=0;k<V.locationSize;k++)m(V.location+k);i.bindBuffer(i.ARRAY_BUFFER,Ct);for(let k=0;k<V.locationSize;k++)b(V.location+k,ct/V.locationSize,Nt,rt,N*et,(B+ct/V.locationSize*k)*et,W)}else{if(Q.isInstancedBufferAttribute){for(let Z=0;Z<V.locationSize;Z++)p(V.location+Z,Q.meshPerAttribute);x.isInstancedMesh!==!0&&D._maxInstanceCount===void 0&&(D._maxInstanceCount=Q.meshPerAttribute*Q.count)}else for(let Z=0;Z<V.locationSize;Z++)m(V.location+Z);i.bindBuffer(i.ARRAY_BUFFER,Ct);for(let Z=0;Z<V.locationSize;Z++)b(V.location+Z,ct/V.locationSize,Nt,rt,ct*et,ct/V.locationSize*Z*et,W)}}else if(H!==void 0){const rt=H[$];if(rt!==void 0)switch(rt.length){case 2:i.vertexAttrib2fv(V.location,rt);break;case 3:i.vertexAttrib3fv(V.location,rt);break;case 4:i.vertexAttrib4fv(V.location,rt);break;default:i.vertexAttrib1fv(V.location,rt)}}}}S()}function E(){R();for(const x in n){const y=n[x];for(const w in y){const D=y[w];for(const I in D)h(D[I].object),delete D[I];delete y[w]}delete n[x]}}function T(x){if(n[x.id]===void 0)return;const y=n[x.id];for(const w in y){const D=y[w];for(const I in D)h(D[I].object),delete D[I];delete y[w]}delete n[x.id]}function A(x){for(const y in n){const w=n[y];if(w[x.id]===void 0)continue;const D=w[x.id];for(const I in D)h(D[I].object),delete D[I];delete w[x.id]}}function R(){_(),a=!0,s!==r&&(s=r,l(s.object))}function _(){r.geometry=null,r.program=null,r.wireframe=!1}return{setup:o,reset:R,resetDefaultState:_,dispose:E,releaseStatesOfGeometry:T,releaseStatesOfProgram:A,initAttributes:v,enableAttribute:m,disableUnusedAttributes:S}}function vm(i,t,e){let n;function r(l){n=l}function s(l,h){i.drawArrays(n,l,h),e.update(h,n,1)}function a(l,h,u){u!==0&&(i.drawArraysInstanced(n,l,h,u),e.update(h,n,u))}function o(l,h,u){if(u===0)return;t.get("WEBGL_multi_draw").multiDrawArraysWEBGL(n,l,0,h,0,u);let f=0;for(let g=0;g<u;g++)f+=h[g];e.update(f,n,1)}function c(l,h,u,d){if(u===0)return;const f=t.get("WEBGL_multi_draw");if(f===null)for(let g=0;g<l.length;g++)a(l[g],h[g],d[g]);else{f.multiDrawArraysInstancedWEBGL(n,l,0,h,0,d,0,u);let g=0;for(let v=0;v<u;v++)g+=h[v]*d[v];e.update(g,n,1)}}this.setMode=r,this.render=s,this.renderInstances=a,this.renderMultiDraw=o,this.renderMultiDrawInstances=c}function _m(i,t,e,n){let r;function s(){if(r!==void 0)return r;if(t.has("EXT_texture_filter_anisotropic")===!0){const A=t.get("EXT_texture_filter_anisotropic");r=i.getParameter(A.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else r=0;return r}function a(A){return!(A!==Ve&&n.convert(A)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_FORMAT))}function o(A){const R=A===ji&&(t.has("EXT_color_buffer_half_float")||t.has("EXT_color_buffer_float"));return!(A!==Ln&&n.convert(A)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_TYPE)&&A!==zn&&!R)}function c(A){if(A==="highp"){if(i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.HIGH_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.HIGH_FLOAT).precision>0)return"highp";A="mediump"}return A==="mediump"&&i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.MEDIUM_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let l=e.precision!==void 0?e.precision:"highp";const h=c(l);h!==l&&(console.warn("THREE.WebGLRenderer:",l,"not supported, using",h,"instead."),l=h);const u=e.logarithmicDepthBuffer===!0,d=e.reversedDepthBuffer===!0&&t.has("EXT_clip_control"),f=i.getParameter(i.MAX_TEXTURE_IMAGE_UNITS),g=i.getParameter(i.MAX_VERTEX_TEXTURE_IMAGE_UNITS),v=i.getParameter(i.MAX_TEXTURE_SIZE),m=i.getParameter(i.MAX_CUBE_MAP_TEXTURE_SIZE),p=i.getParameter(i.MAX_VERTEX_ATTRIBS),S=i.getParameter(i.MAX_VERTEX_UNIFORM_VECTORS),b=i.getParameter(i.MAX_VARYING_VECTORS),M=i.getParameter(i.MAX_FRAGMENT_UNIFORM_VECTORS),E=g>0,T=i.getParameter(i.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:s,getMaxPrecision:c,textureFormatReadable:a,textureTypeReadable:o,precision:l,logarithmicDepthBuffer:u,reversedDepthBuffer:d,maxTextures:f,maxVertexTextures:g,maxTextureSize:v,maxCubemapSize:m,maxAttributes:p,maxVertexUniforms:S,maxVaryings:b,maxFragmentUniforms:M,vertexTextures:E,maxSamples:T}}function xm(i){const t=this;let e=null,n=0,r=!1,s=!1;const a=new Ui,o=new Zt,c={value:null,needsUpdate:!1};this.uniform=c,this.numPlanes=0,this.numIntersection=0,this.init=function(u,d){const f=u.length!==0||d||n!==0||r;return r=d,n=u.length,f},this.beginShadows=function(){s=!0,h(null)},this.endShadows=function(){s=!1},this.setGlobalState=function(u,d){e=h(u,d,0)},this.setState=function(u,d,f){const g=u.clippingPlanes,v=u.clipIntersection,m=u.clipShadows,p=i.get(u);if(!r||g===null||g.length===0||s&&!m)s?h(null):l();else{const S=s?0:n,b=S*4;let M=p.clippingState||null;c.value=M,M=h(g,d,b,f);for(let E=0;E!==b;++E)M[E]=e[E];p.clippingState=M,this.numIntersection=v?this.numPlanes:0,this.numPlanes+=S}};function l(){c.value!==e&&(c.value=e,c.needsUpdate=n>0),t.numPlanes=n,t.numIntersection=0}function h(u,d,f,g){const v=u!==null?u.length:0;let m=null;if(v!==0){if(m=c.value,g!==!0||m===null){const p=f+v*4,S=d.matrixWorldInverse;o.getNormalMatrix(S),(m===null||m.length<p)&&(m=new Float32Array(p));for(let b=0,M=f;b!==v;++b,M+=4)a.copy(u[b]).applyMatrix4(S,o),a.normal.toArray(m,M),m[M+3]=a.constant}c.value=m,c.needsUpdate=!0}return t.numPlanes=v,t.numIntersection=0,m}}function Mm(i){let t=new WeakMap;function e(a,o){return o===ca?a.mapping=Rr:o===To&&(a.mapping=Cr),a}function n(a){if(a&&a.isTexture){const o=a.mapping;if(o===ca||o===To)if(t.has(a)){const c=t.get(a).texture;return e(c,a.mapping)}else{const c=a.image;if(c&&c.height>0){const l=new r0(c.height);return l.fromEquirectangularTexture(i,a),t.set(a,l),a.addEventListener("dispose",r),e(l.texture,a.mapping)}else return null}}return a}function r(a){const o=a.target;o.removeEventListener("dispose",r);const c=t.get(o);c!==void 0&&(t.delete(o),c.dispose())}function s(){t=new WeakMap}return{get:n,dispose:s}}const yr=4,Fl=[.125,.215,.35,.446,.526,.582],Oi=20,Za=new Rc,Ol=new Ht;let Ka=null,Ja=0,Qa=0,to=!1;const Ni=(1+Math.sqrt(5))/2,dr=1/Ni,Bl=[new U(-Ni,dr,0),new U(Ni,dr,0),new U(-dr,0,Ni),new U(dr,0,Ni),new U(0,Ni,-dr),new U(0,Ni,dr),new U(-1,1,-1),new U(1,1,-1),new U(-1,1,1),new U(1,1,1)],bm=new U;class ic{constructor(t){this._renderer=t,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(t,e=0,n=.1,r=100,s={}){const{size:a=256,position:o=bm}=s;Ka=this._renderer.getRenderTarget(),Ja=this._renderer.getActiveCubeFace(),Qa=this._renderer.getActiveMipmapLevel(),to=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(a);const c=this._allocateTargets();return c.depthBuffer=!0,this._sceneToCubeUV(t,n,r,c,o),e>0&&this._blur(c,0,0,e),this._applyPMREM(c),this._cleanup(c),c}fromEquirectangular(t,e=null){return this._fromTexture(t,e)}fromCubemap(t,e=null){return this._fromTexture(t,e)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Hl(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=zl(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(t){this._lodMax=Math.floor(Math.log2(t)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let t=0;t<this._lodPlanes.length;t++)this._lodPlanes[t].dispose()}_cleanup(t){this._renderer.setRenderTarget(Ka,Ja,Qa),this._renderer.xr.enabled=to,t.scissorTest=!1,Gs(t,0,0,t.width,t.height)}_fromTexture(t,e){t.mapping===Rr||t.mapping===Cr?this._setSize(t.image.length===0?16:t.image[0].width||t.image[0].image.width):this._setSize(t.image.width/4),Ka=this._renderer.getRenderTarget(),Ja=this._renderer.getActiveCubeFace(),Qa=this._renderer.getActiveMipmapLevel(),to=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const n=e||this._allocateTargets();return this._textureToCubeUV(t,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){const t=3*Math.max(this._cubeSize,112),e=4*this._cubeSize,n={magFilter:_e,minFilter:_e,generateMipmaps:!1,type:ji,format:Ve,colorSpace:Yi,depthBuffer:!1},r=kl(t,e,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==t||this._pingPongRenderTarget.height!==e){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=kl(t,e,n);const{_lodMax:s}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=ym(s)),this._blurMaterial=Sm(s,t,e)}return r}_compileMaterial(t){const e=new Gt(this._lodPlanes[0],t);this._renderer.compile(e,Za)}_sceneToCubeUV(t,e,n,r,s){const c=new vn(90,1,e,n),l=[1,-1,1,1,1,1],h=[1,1,1,-1,-1,-1],u=this._renderer,d=u.autoClear,f=u.toneMapping;u.getClearColor(Ol),u.toneMapping=bi,u.autoClear=!1,u.state.buffers.depth.getReversed()&&(u.setRenderTarget(r),u.clearDepth(),u.setRenderTarget(null));const v=new ga({name:"PMREM.Background",side:Je,depthWrite:!1,depthTest:!1}),m=new Gt(new $e,v);let p=!1;const S=t.background;S?S.isColor&&(v.color.copy(S),t.background=null,p=!0):(v.color.copy(Ol),p=!0);for(let b=0;b<6;b++){const M=b%3;M===0?(c.up.set(0,l[b],0),c.position.set(s.x,s.y,s.z),c.lookAt(s.x+h[b],s.y,s.z)):M===1?(c.up.set(0,0,l[b]),c.position.set(s.x,s.y,s.z),c.lookAt(s.x,s.y+h[b],s.z)):(c.up.set(0,l[b],0),c.position.set(s.x,s.y,s.z),c.lookAt(s.x,s.y,s.z+h[b]));const E=this._cubeSize;Gs(r,M*E,b>2?E:0,E,E),u.setRenderTarget(r),p&&u.render(m,c),u.render(t,c)}m.geometry.dispose(),m.material.dispose(),u.toneMapping=f,u.autoClear=d,t.background=S}_textureToCubeUV(t,e){const n=this._renderer,r=t.mapping===Rr||t.mapping===Cr;r?(this._cubemapMaterial===null&&(this._cubemapMaterial=Hl()),this._cubemapMaterial.uniforms.flipEnvMap.value=t.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=zl());const s=r?this._cubemapMaterial:this._equirectMaterial,a=new Gt(this._lodPlanes[0],s),o=s.uniforms;o.envMap.value=t;const c=this._cubeSize;Gs(e,0,0,3*c,2*c),n.setRenderTarget(e),n.render(a,Za)}_applyPMREM(t){const e=this._renderer,n=e.autoClear;e.autoClear=!1;const r=this._lodPlanes.length;for(let s=1;s<r;s++){const a=Math.sqrt(this._sigmas[s]*this._sigmas[s]-this._sigmas[s-1]*this._sigmas[s-1]),o=Bl[(r-s-1)%Bl.length];this._blur(t,s-1,s,a,o)}e.autoClear=n}_blur(t,e,n,r,s){const a=this._pingPongRenderTarget;this._halfBlur(t,a,e,n,r,"latitudinal",s),this._halfBlur(a,t,n,n,r,"longitudinal",s)}_halfBlur(t,e,n,r,s,a,o){const c=this._renderer,l=this._blurMaterial;a!=="latitudinal"&&a!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const h=3,u=new Gt(this._lodPlanes[r],l),d=l.uniforms,f=this._sizeLods[n]-1,g=isFinite(s)?Math.PI/(2*f):2*Math.PI/(2*Oi-1),v=s/g,m=isFinite(s)?1+Math.floor(h*v):Oi;m>Oi&&console.warn(`sigmaRadians, ${s}, is too large and will clip, as it requested ${m} samples when the maximum is set to ${Oi}`);const p=[];let S=0;for(let A=0;A<Oi;++A){const R=A/v,_=Math.exp(-R*R/2);p.push(_),A===0?S+=_:A<m&&(S+=2*_)}for(let A=0;A<p.length;A++)p[A]=p[A]/S;d.envMap.value=t.texture,d.samples.value=m,d.weights.value=p,d.latitudinal.value=a==="latitudinal",o&&(d.poleAxis.value=o);const{_lodMax:b}=this;d.dTheta.value=g,d.mipInt.value=b-n;const M=this._sizeLods[r],E=3*M*(r>b-yr?r-b+yr:0),T=4*(this._cubeSize-M);Gs(e,E,T,3*M,2*M),c.setRenderTarget(e),c.render(u,Za)}}function ym(i){const t=[],e=[],n=[];let r=i;const s=i-yr+1+Fl.length;for(let a=0;a<s;a++){const o=Math.pow(2,r);e.push(o);let c=1/o;a>i-yr?c=Fl[a-i+yr-1]:a===0&&(c=0),n.push(c);const l=1/(o-2),h=-l,u=1+l,d=[h,h,u,h,u,u,h,h,u,u,h,u],f=6,g=6,v=3,m=2,p=1,S=new Float32Array(v*g*f),b=new Float32Array(m*g*f),M=new Float32Array(p*g*f);for(let T=0;T<f;T++){const A=T%3*2/3-1,R=T>2?0:-1,_=[A,R,0,A+2/3,R,0,A+2/3,R+1,0,A,R,0,A+2/3,R+1,0,A,R+1,0];S.set(_,v*g*T),b.set(d,m*g*T);const x=[T,T,T,T,T,T];M.set(x,p*g*T)}const E=new Ne;E.setAttribute("position",new oe(S,v)),E.setAttribute("uv",new oe(b,m)),E.setAttribute("faceIndex",new oe(M,p)),t.push(E),r>yr&&r--}return{lodPlanes:t,sizeLods:e,sigmas:n}}function kl(i,t,e){const n=new Ye(i,t,e);return n.texture.mapping=ma,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function Gs(i,t,e,n,r){i.viewport.set(t,e,n,r),i.scissor.set(t,e,n,r)}function Sm(i,t,e){const n=new Float32Array(Oi),r=new U(0,1,0);return new He({name:"SphericalGaussianBlur",defines:{n:Oi,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/e,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:n},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:r}},vertexShader:Cc(),fragmentShader:`

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
		`,blending:Mi,depthTest:!1,depthWrite:!1})}function zl(){return new He({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:Cc(),fragmentShader:`

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
		`,blending:Mi,depthTest:!1,depthWrite:!1})}function Hl(){return new He({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:Cc(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:Mi,depthTest:!1,depthWrite:!1})}function Cc(){return`

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
	`}function Em(i){let t=new WeakMap,e=null;function n(o){if(o&&o.isTexture){const c=o.mapping,l=c===ca||c===To,h=c===Rr||c===Cr;if(l||h){let u=t.get(o);const d=u!==void 0?u.texture.pmremVersion:0;if(o.isRenderTargetTexture&&o.pmremVersion!==d)return e===null&&(e=new ic(i)),u=l?e.fromEquirectangular(o,u):e.fromCubemap(o,u),u.texture.pmremVersion=o.pmremVersion,t.set(o,u),u.texture;if(u!==void 0)return u.texture;{const f=o.image;return l&&f&&f.height>0||h&&f&&r(f)?(e===null&&(e=new ic(i)),u=l?e.fromEquirectangular(o):e.fromCubemap(o),u.texture.pmremVersion=o.pmremVersion,t.set(o,u),o.addEventListener("dispose",s),u.texture):null}}}return o}function r(o){let c=0;const l=6;for(let h=0;h<l;h++)o[h]!==void 0&&c++;return c===l}function s(o){const c=o.target;c.removeEventListener("dispose",s);const l=t.get(c);l!==void 0&&(t.delete(c),l.dispose())}function a(){t=new WeakMap,e!==null&&(e.dispose(),e=null)}return{get:n,dispose:a}}function wm(i){const t={};function e(n){if(t[n]!==void 0)return t[n];let r;switch(n){case"WEBGL_depth_texture":r=i.getExtension("WEBGL_depth_texture")||i.getExtension("MOZ_WEBGL_depth_texture")||i.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":r=i.getExtension("EXT_texture_filter_anisotropic")||i.getExtension("MOZ_EXT_texture_filter_anisotropic")||i.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":r=i.getExtension("WEBGL_compressed_texture_s3tc")||i.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":r=i.getExtension("WEBGL_compressed_texture_pvrtc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:r=i.getExtension(n)}return t[n]=r,r}return{has:function(n){return e(n)!==null},init:function(){e("EXT_color_buffer_float"),e("WEBGL_clip_cull_distance"),e("OES_texture_float_linear"),e("EXT_color_buffer_half_float"),e("WEBGL_multisampled_render_to_texture"),e("WEBGL_render_shared_exponent")},get:function(n){const r=e(n);return r===null&&ls("THREE.WebGLRenderer: "+n+" extension not supported."),r}}}function Tm(i,t,e,n){const r={},s=new WeakMap;function a(u){const d=u.target;d.index!==null&&t.remove(d.index);for(const g in d.attributes)t.remove(d.attributes[g]);d.removeEventListener("dispose",a),delete r[d.id];const f=s.get(d);f&&(t.remove(f),s.delete(d)),n.releaseStatesOfGeometry(d),d.isInstancedBufferGeometry===!0&&delete d._maxInstanceCount,e.memory.geometries--}function o(u,d){return r[d.id]===!0||(d.addEventListener("dispose",a),r[d.id]=!0,e.memory.geometries++),d}function c(u){const d=u.attributes;for(const f in d)t.update(d[f],i.ARRAY_BUFFER)}function l(u){const d=[],f=u.index,g=u.attributes.position;let v=0;if(f!==null){const S=f.array;v=f.version;for(let b=0,M=S.length;b<M;b+=3){const E=S[b+0],T=S[b+1],A=S[b+2];d.push(E,T,T,A,A,E)}}else if(g!==void 0){const S=g.array;v=g.version;for(let b=0,M=S.length/3-1;b<M;b+=3){const E=b+0,T=b+1,A=b+2;d.push(E,T,T,A,A,E)}}else return;const m=new(ru(d)?lu:cu)(d,1);m.version=v;const p=s.get(u);p&&t.remove(p),s.set(u,m)}function h(u){const d=s.get(u);if(d){const f=u.index;f!==null&&d.version<f.version&&l(u)}else l(u);return s.get(u)}return{get:o,update:c,getWireframeAttribute:h}}function Am(i,t,e){let n;function r(d){n=d}let s,a;function o(d){s=d.type,a=d.bytesPerElement}function c(d,f){i.drawElements(n,f,s,d*a),e.update(f,n,1)}function l(d,f,g){g!==0&&(i.drawElementsInstanced(n,f,s,d*a,g),e.update(f,n,g))}function h(d,f,g){if(g===0)return;t.get("WEBGL_multi_draw").multiDrawElementsWEBGL(n,f,0,s,d,0,g);let m=0;for(let p=0;p<g;p++)m+=f[p];e.update(m,n,1)}function u(d,f,g,v){if(g===0)return;const m=t.get("WEBGL_multi_draw");if(m===null)for(let p=0;p<d.length;p++)l(d[p]/a,f[p],v[p]);else{m.multiDrawElementsInstancedWEBGL(n,f,0,s,d,0,v,0,g);let p=0;for(let S=0;S<g;S++)p+=f[S]*v[S];e.update(p,n,1)}}this.setMode=r,this.setIndex=o,this.render=c,this.renderInstances=l,this.renderMultiDraw=h,this.renderMultiDrawInstances=u}function Rm(i){const t={geometries:0,textures:0},e={frame:0,calls:0,triangles:0,points:0,lines:0};function n(s,a,o){switch(e.calls++,a){case i.TRIANGLES:e.triangles+=o*(s/3);break;case i.LINES:e.lines+=o*(s/2);break;case i.LINE_STRIP:e.lines+=o*(s-1);break;case i.LINE_LOOP:e.lines+=o*s;break;case i.POINTS:e.points+=o*s;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",a);break}}function r(){e.calls=0,e.triangles=0,e.points=0,e.lines=0}return{memory:t,render:e,programs:null,autoReset:!0,reset:r,update:n}}function Cm(i,t,e){const n=new WeakMap,r=new se;function s(a,o,c){const l=a.morphTargetInfluences,h=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,u=h!==void 0?h.length:0;let d=n.get(o);if(d===void 0||d.count!==u){let _=function(){A.dispose(),n.delete(o),o.removeEventListener("dispose",_)};d!==void 0&&d.texture.dispose();const f=o.morphAttributes.position!==void 0,g=o.morphAttributes.normal!==void 0,v=o.morphAttributes.color!==void 0,m=o.morphAttributes.position||[],p=o.morphAttributes.normal||[],S=o.morphAttributes.color||[];let b=0;f===!0&&(b=1),g===!0&&(b=2),v===!0&&(b=3);let M=o.attributes.position.count*b,E=1;M>t.maxTextureSize&&(E=Math.ceil(M/t.maxTextureSize),M=t.maxTextureSize);const T=new Float32Array(M*E*4*u),A=new yc(T,M,E,u);A.type=zn,A.needsUpdate=!0;const R=b*4;for(let x=0;x<u;x++){const y=m[x],w=p[x],D=S[x],I=M*E*4*x;for(let F=0;F<y.count;F++){const H=F*R;f===!0&&(r.fromBufferAttribute(y,F),T[I+H+0]=r.x,T[I+H+1]=r.y,T[I+H+2]=r.z,T[I+H+3]=0),g===!0&&(r.fromBufferAttribute(w,F),T[I+H+4]=r.x,T[I+H+5]=r.y,T[I+H+6]=r.z,T[I+H+7]=0),v===!0&&(r.fromBufferAttribute(D,F),T[I+H+8]=r.x,T[I+H+9]=r.y,T[I+H+10]=r.z,T[I+H+11]=D.itemSize===4?r.w:1)}}d={count:u,texture:A,size:new Rt(M,E)},n.set(o,d),o.addEventListener("dispose",_)}if(a.isInstancedMesh===!0&&a.morphTexture!==null)c.getUniforms().setValue(i,"morphTexture",a.morphTexture,e);else{let f=0;for(let v=0;v<l.length;v++)f+=l[v];const g=o.morphTargetsRelative?1:1-f;c.getUniforms().setValue(i,"morphTargetBaseInfluence",g),c.getUniforms().setValue(i,"morphTargetInfluences",l)}c.getUniforms().setValue(i,"morphTargetsTexture",d.texture,e),c.getUniforms().setValue(i,"morphTargetsTextureSize",d.size)}return{update:s}}function Lm(i,t,e,n){let r=new WeakMap;function s(c){const l=n.render.frame,h=c.geometry,u=t.get(c,h);if(r.get(u)!==l&&(t.update(u),r.set(u,l)),c.isInstancedMesh&&(c.hasEventListener("dispose",o)===!1&&c.addEventListener("dispose",o),r.get(c)!==l&&(e.update(c.instanceMatrix,i.ARRAY_BUFFER),c.instanceColor!==null&&e.update(c.instanceColor,i.ARRAY_BUFFER),r.set(c,l))),c.isSkinnedMesh){const d=c.skeleton;r.get(d)!==l&&(d.update(),r.set(d,l))}return u}function a(){r=new WeakMap}function o(c){const l=c.target;l.removeEventListener("dispose",o),e.remove(l.instanceMatrix),l.instanceColor!==null&&e.remove(l.instanceColor)}return{update:s,dispose:a}}const yu=new Be,Vl=new gu(1,1),Su=new yc,Eu=new Bd,wu=new fu,Gl=[],Wl=[],Xl=new Float32Array(16),ql=new Float32Array(9),Yl=new Float32Array(4);function Br(i,t,e){const n=i[0];if(n<=0||n>0)return i;const r=t*e;let s=Gl[r];if(s===void 0&&(s=new Float32Array(r),Gl[r]=s),t!==0){n.toArray(s,0);for(let a=1,o=0;a!==t;++a)o+=e,i[a].toArray(s,o)}return s}function Le(i,t){if(i.length!==t.length)return!1;for(let e=0,n=i.length;e<n;e++)if(i[e]!==t[e])return!1;return!0}function Pe(i,t){for(let e=0,n=t.length;e<n;e++)i[e]=t[e]}function va(i,t){let e=Wl[t];e===void 0&&(e=new Int32Array(t),Wl[t]=e);for(let n=0;n!==t;++n)e[n]=i.allocateTextureUnit();return e}function Pm(i,t){const e=this.cache;e[0]!==t&&(i.uniform1f(this.addr,t),e[0]=t)}function Dm(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2f(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Le(e,t))return;i.uniform2fv(this.addr,t),Pe(e,t)}}function Im(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3f(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else if(t.r!==void 0)(e[0]!==t.r||e[1]!==t.g||e[2]!==t.b)&&(i.uniform3f(this.addr,t.r,t.g,t.b),e[0]=t.r,e[1]=t.g,e[2]=t.b);else{if(Le(e,t))return;i.uniform3fv(this.addr,t),Pe(e,t)}}function Um(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4f(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Le(e,t))return;i.uniform4fv(this.addr,t),Pe(e,t)}}function Nm(i,t){const e=this.cache,n=t.elements;if(n===void 0){if(Le(e,t))return;i.uniformMatrix2fv(this.addr,!1,t),Pe(e,t)}else{if(Le(e,n))return;Yl.set(n),i.uniformMatrix2fv(this.addr,!1,Yl),Pe(e,n)}}function Fm(i,t){const e=this.cache,n=t.elements;if(n===void 0){if(Le(e,t))return;i.uniformMatrix3fv(this.addr,!1,t),Pe(e,t)}else{if(Le(e,n))return;ql.set(n),i.uniformMatrix3fv(this.addr,!1,ql),Pe(e,n)}}function Om(i,t){const e=this.cache,n=t.elements;if(n===void 0){if(Le(e,t))return;i.uniformMatrix4fv(this.addr,!1,t),Pe(e,t)}else{if(Le(e,n))return;Xl.set(n),i.uniformMatrix4fv(this.addr,!1,Xl),Pe(e,n)}}function Bm(i,t){const e=this.cache;e[0]!==t&&(i.uniform1i(this.addr,t),e[0]=t)}function km(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2i(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Le(e,t))return;i.uniform2iv(this.addr,t),Pe(e,t)}}function zm(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3i(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(Le(e,t))return;i.uniform3iv(this.addr,t),Pe(e,t)}}function Hm(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4i(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Le(e,t))return;i.uniform4iv(this.addr,t),Pe(e,t)}}function Vm(i,t){const e=this.cache;e[0]!==t&&(i.uniform1ui(this.addr,t),e[0]=t)}function Gm(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2ui(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Le(e,t))return;i.uniform2uiv(this.addr,t),Pe(e,t)}}function Wm(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3ui(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(Le(e,t))return;i.uniform3uiv(this.addr,t),Pe(e,t)}}function Xm(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4ui(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Le(e,t))return;i.uniform4uiv(this.addr,t),Pe(e,t)}}function qm(i,t,e){const n=this.cache,r=e.allocateTextureUnit();n[0]!==r&&(i.uniform1i(this.addr,r),n[0]=r);let s;this.type===i.SAMPLER_2D_SHADOW?(Vl.compareFunction=iu,s=Vl):s=yu,e.setTexture2D(t||s,r)}function Ym(i,t,e){const n=this.cache,r=e.allocateTextureUnit();n[0]!==r&&(i.uniform1i(this.addr,r),n[0]=r),e.setTexture3D(t||Eu,r)}function $m(i,t,e){const n=this.cache,r=e.allocateTextureUnit();n[0]!==r&&(i.uniform1i(this.addr,r),n[0]=r),e.setTextureCube(t||wu,r)}function jm(i,t,e){const n=this.cache,r=e.allocateTextureUnit();n[0]!==r&&(i.uniform1i(this.addr,r),n[0]=r),e.setTexture2DArray(t||Su,r)}function Zm(i){switch(i){case 5126:return Pm;case 35664:return Dm;case 35665:return Im;case 35666:return Um;case 35674:return Nm;case 35675:return Fm;case 35676:return Om;case 5124:case 35670:return Bm;case 35667:case 35671:return km;case 35668:case 35672:return zm;case 35669:case 35673:return Hm;case 5125:return Vm;case 36294:return Gm;case 36295:return Wm;case 36296:return Xm;case 35678:case 36198:case 36298:case 36306:case 35682:return qm;case 35679:case 36299:case 36307:return Ym;case 35680:case 36300:case 36308:case 36293:return $m;case 36289:case 36303:case 36311:case 36292:return jm}}function Km(i,t){i.uniform1fv(this.addr,t)}function Jm(i,t){const e=Br(t,this.size,2);i.uniform2fv(this.addr,e)}function Qm(i,t){const e=Br(t,this.size,3);i.uniform3fv(this.addr,e)}function tg(i,t){const e=Br(t,this.size,4);i.uniform4fv(this.addr,e)}function eg(i,t){const e=Br(t,this.size,4);i.uniformMatrix2fv(this.addr,!1,e)}function ng(i,t){const e=Br(t,this.size,9);i.uniformMatrix3fv(this.addr,!1,e)}function ig(i,t){const e=Br(t,this.size,16);i.uniformMatrix4fv(this.addr,!1,e)}function rg(i,t){i.uniform1iv(this.addr,t)}function sg(i,t){i.uniform2iv(this.addr,t)}function ag(i,t){i.uniform3iv(this.addr,t)}function og(i,t){i.uniform4iv(this.addr,t)}function cg(i,t){i.uniform1uiv(this.addr,t)}function lg(i,t){i.uniform2uiv(this.addr,t)}function hg(i,t){i.uniform3uiv(this.addr,t)}function ug(i,t){i.uniform4uiv(this.addr,t)}function fg(i,t,e){const n=this.cache,r=t.length,s=va(e,r);Le(n,s)||(i.uniform1iv(this.addr,s),Pe(n,s));for(let a=0;a!==r;++a)e.setTexture2D(t[a]||yu,s[a])}function dg(i,t,e){const n=this.cache,r=t.length,s=va(e,r);Le(n,s)||(i.uniform1iv(this.addr,s),Pe(n,s));for(let a=0;a!==r;++a)e.setTexture3D(t[a]||Eu,s[a])}function pg(i,t,e){const n=this.cache,r=t.length,s=va(e,r);Le(n,s)||(i.uniform1iv(this.addr,s),Pe(n,s));for(let a=0;a!==r;++a)e.setTextureCube(t[a]||wu,s[a])}function mg(i,t,e){const n=this.cache,r=t.length,s=va(e,r);Le(n,s)||(i.uniform1iv(this.addr,s),Pe(n,s));for(let a=0;a!==r;++a)e.setTexture2DArray(t[a]||Su,s[a])}function gg(i){switch(i){case 5126:return Km;case 35664:return Jm;case 35665:return Qm;case 35666:return tg;case 35674:return eg;case 35675:return ng;case 35676:return ig;case 5124:case 35670:return rg;case 35667:case 35671:return sg;case 35668:case 35672:return ag;case 35669:case 35673:return og;case 5125:return cg;case 36294:return lg;case 36295:return hg;case 36296:return ug;case 35678:case 36198:case 36298:case 36306:case 35682:return fg;case 35679:case 36299:case 36307:return dg;case 35680:case 36300:case 36308:case 36293:return pg;case 36289:case 36303:case 36311:case 36292:return mg}}class vg{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.setValue=Zm(e.type)}}class _g{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.size=e.size,this.setValue=gg(e.type)}}class xg{constructor(t){this.id=t,this.seq=[],this.map={}}setValue(t,e,n){const r=this.seq;for(let s=0,a=r.length;s!==a;++s){const o=r[s];o.setValue(t,e[o.id],n)}}}const eo=/(\w+)(\])?(\[|\.)?/g;function $l(i,t){i.seq.push(t),i.map[t.id]=t}function Mg(i,t,e){const n=i.name,r=n.length;for(eo.lastIndex=0;;){const s=eo.exec(n),a=eo.lastIndex;let o=s[1];const c=s[2]==="]",l=s[3];if(c&&(o=o|0),l===void 0||l==="["&&a+2===r){$l(e,l===void 0?new vg(o,i,t):new _g(o,i,t));break}else{let u=e.map[o];u===void 0&&(u=new xg(o),$l(e,u)),e=u}}}class sa{constructor(t,e){this.seq=[],this.map={};const n=t.getProgramParameter(e,t.ACTIVE_UNIFORMS);for(let r=0;r<n;++r){const s=t.getActiveUniform(e,r),a=t.getUniformLocation(e,s.name);Mg(s,a,this)}}setValue(t,e,n,r){const s=this.map[e];s!==void 0&&s.setValue(t,n,r)}setOptional(t,e,n){const r=e[n];r!==void 0&&this.setValue(t,n,r)}static upload(t,e,n,r){for(let s=0,a=e.length;s!==a;++s){const o=e[s],c=n[o.id];c.needsUpdate!==!1&&o.setValue(t,c.value,r)}}static seqWithValue(t,e){const n=[];for(let r=0,s=t.length;r!==s;++r){const a=t[r];a.id in e&&n.push(a)}return n}}function jl(i,t,e){const n=i.createShader(t);return i.shaderSource(n,e),i.compileShader(n),n}const bg=37297;let yg=0;function Sg(i,t){const e=i.split(`
`),n=[],r=Math.max(t-6,0),s=Math.min(t+6,e.length);for(let a=r;a<s;a++){const o=a+1;n.push(`${o===t?">":" "} ${o}: ${e[a]}`)}return n.join(`
`)}const Zl=new Zt;function Eg(i){re._getMatrix(Zl,re.workingColorSpace,i);const t=`mat3( ${Zl.elements.map(e=>e.toFixed(4))} )`;switch(re.getTransfer(i)){case la:return[t,"LinearTransferOETF"];case le:return[t,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space: ",i),[t,"LinearTransferOETF"]}}function Kl(i,t,e){const n=i.getShaderParameter(t,i.COMPILE_STATUS),s=(i.getShaderInfoLog(t)||"").trim();if(n&&s==="")return"";const a=/ERROR: 0:(\d+)/.exec(s);if(a){const o=parseInt(a[1]);return e.toUpperCase()+`

`+s+`

`+Sg(i.getShaderSource(t),o)}else return s}function wg(i,t){const e=Eg(t);return[`vec4 ${i}( vec4 value ) {`,`	return ${e[1]}( vec4( value.rgb * ${e[0]}, value.a ) );`,"}"].join(`
`)}function Tg(i,t){let e;switch(t){case Zf:e="Linear";break;case Kf:e="Reinhard";break;case Jf:e="Cineon";break;case Qf:e="ACESFilmic";break;case ed:e="AgX";break;case qh:e="Neutral";break;case td:e="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",t),e="Linear"}return"vec3 "+i+"( vec3 color ) { return "+e+"ToneMapping( color ); }"}const Ws=new U;function Ag(){re.getLuminanceCoefficients(Ws);const i=Ws.x.toFixed(4),t=Ws.y.toFixed(4),e=Ws.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${i}, ${t}, ${e} );`,"	return dot( weights, rgb );","}"].join(`
`)}function Rg(i){return[i.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",i.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(Yr).join(`
`)}function Cg(i){const t=[];for(const e in i){const n=i[e];n!==!1&&t.push("#define "+e+" "+n)}return t.join(`
`)}function Lg(i,t){const e={},n=i.getProgramParameter(t,i.ACTIVE_ATTRIBUTES);for(let r=0;r<n;r++){const s=i.getActiveAttrib(t,r),a=s.name;let o=1;s.type===i.FLOAT_MAT2&&(o=2),s.type===i.FLOAT_MAT3&&(o=3),s.type===i.FLOAT_MAT4&&(o=4),e[a]={type:s.type,location:i.getAttribLocation(t,a),locationSize:o}}return e}function Yr(i){return i!==""}function Jl(i,t){const e=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return i.replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,e).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows)}function Ql(i,t){return i.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}const Pg=/^[ \t]*#include +<([\w\d./]+)>/gm;function rc(i){return i.replace(Pg,Ig)}const Dg=new Map;function Ig(i,t){let e=Jt[t];if(e===void 0){const n=Dg.get(t);if(n!==void 0)e=Jt[n],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',t,n);else throw new Error("Can not resolve #include <"+t+">")}return rc(e)}const Ug=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function th(i){return i.replace(Ug,Ng)}function Ng(i,t,e,n){let r="";for(let s=parseInt(t);s<parseInt(e);s++)r+=n.replace(/\[\s*i\s*\]/g,"[ "+s+" ]").replace(/UNROLLED_LOOP_INDEX/g,s);return r}function eh(i){let t=`precision ${i.precision} float;
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
#define LOW_PRECISION`),t}function Fg(i){let t="SHADOWMAP_TYPE_BASIC";return i.shadowMapType===Gh?t="SHADOWMAP_TYPE_PCF":i.shadowMapType===Wh?t="SHADOWMAP_TYPE_PCF_SOFT":i.shadowMapType===Zn&&(t="SHADOWMAP_TYPE_VSM"),t}function Og(i){let t="ENVMAP_TYPE_CUBE";if(i.envMap)switch(i.envMapMode){case Rr:case Cr:t="ENVMAP_TYPE_CUBE";break;case ma:t="ENVMAP_TYPE_CUBE_UV";break}return t}function Bg(i){let t="ENVMAP_MODE_REFLECTION";if(i.envMap)switch(i.envMapMode){case Cr:t="ENVMAP_MODE_REFRACTION";break}return t}function kg(i){let t="ENVMAP_BLENDING_NONE";if(i.envMap)switch(i.combine){case Xh:t="ENVMAP_BLENDING_MULTIPLY";break;case $f:t="ENVMAP_BLENDING_MIX";break;case jf:t="ENVMAP_BLENDING_ADD";break}return t}function zg(i){const t=i.envMapCubeUVHeight;if(t===null)return null;const e=Math.log2(t)-2,n=1/t;return{texelWidth:1/(3*Math.max(Math.pow(2,e),112)),texelHeight:n,maxMip:e}}function Hg(i,t,e,n){const r=i.getContext(),s=e.defines;let a=e.vertexShader,o=e.fragmentShader;const c=Fg(e),l=Og(e),h=Bg(e),u=kg(e),d=zg(e),f=Rg(e),g=Cg(s),v=r.createProgram();let m,p,S=e.glslVersion?"#version "+e.glslVersion+`
`:"";e.isRawShaderMaterial?(m=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g].filter(Yr).join(`
`),m.length>0&&(m+=`
`),p=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g].filter(Yr).join(`
`),p.length>0&&(p+=`
`)):(m=[eh(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g,e.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",e.batching?"#define USE_BATCHING":"",e.batchingColor?"#define USE_BATCHING_COLOR":"",e.instancing?"#define USE_INSTANCING":"",e.instancingColor?"#define USE_INSTANCING_COLOR":"",e.instancingMorph?"#define USE_INSTANCING_MORPH":"",e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.map?"#define USE_MAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+h:"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.displacementMap?"#define USE_DISPLACEMENTMAP":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.mapUv?"#define MAP_UV "+e.mapUv:"",e.alphaMapUv?"#define ALPHAMAP_UV "+e.alphaMapUv:"",e.lightMapUv?"#define LIGHTMAP_UV "+e.lightMapUv:"",e.aoMapUv?"#define AOMAP_UV "+e.aoMapUv:"",e.emissiveMapUv?"#define EMISSIVEMAP_UV "+e.emissiveMapUv:"",e.bumpMapUv?"#define BUMPMAP_UV "+e.bumpMapUv:"",e.normalMapUv?"#define NORMALMAP_UV "+e.normalMapUv:"",e.displacementMapUv?"#define DISPLACEMENTMAP_UV "+e.displacementMapUv:"",e.metalnessMapUv?"#define METALNESSMAP_UV "+e.metalnessMapUv:"",e.roughnessMapUv?"#define ROUGHNESSMAP_UV "+e.roughnessMapUv:"",e.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+e.anisotropyMapUv:"",e.clearcoatMapUv?"#define CLEARCOATMAP_UV "+e.clearcoatMapUv:"",e.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+e.clearcoatNormalMapUv:"",e.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+e.clearcoatRoughnessMapUv:"",e.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+e.iridescenceMapUv:"",e.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+e.iridescenceThicknessMapUv:"",e.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+e.sheenColorMapUv:"",e.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+e.sheenRoughnessMapUv:"",e.specularMapUv?"#define SPECULARMAP_UV "+e.specularMapUv:"",e.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+e.specularColorMapUv:"",e.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+e.specularIntensityMapUv:"",e.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+e.transmissionMapUv:"",e.thicknessMapUv?"#define THICKNESSMAP_UV "+e.thicknessMapUv:"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.flatShading?"#define FLAT_SHADED":"",e.skinning?"#define USE_SKINNING":"",e.morphTargets?"#define USE_MORPHTARGETS":"",e.morphNormals&&e.flatShading===!1?"#define USE_MORPHNORMALS":"",e.morphColors?"#define USE_MORPHCOLORS":"",e.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+e.morphTextureStride:"",e.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+e.morphTargetsCount:"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+c:"",e.sizeAttenuation?"#define USE_SIZEATTENUATION":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",e.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(Yr).join(`
`),p=[eh(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g,e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",e.map?"#define USE_MAP":"",e.matcap?"#define USE_MATCAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+l:"",e.envMap?"#define "+h:"",e.envMap?"#define "+u:"",d?"#define CUBEUV_TEXEL_WIDTH "+d.texelWidth:"",d?"#define CUBEUV_TEXEL_HEIGHT "+d.texelHeight:"",d?"#define CUBEUV_MAX_MIP "+d.maxMip+".0":"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoat?"#define USE_CLEARCOAT":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.dispersion?"#define USE_DISPERSION":"",e.iridescence?"#define USE_IRIDESCENCE":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaTest?"#define USE_ALPHATEST":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.sheen?"#define USE_SHEEN":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors||e.instancingColor||e.batchingColor?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.gradientMap?"#define USE_GRADIENTMAP":"",e.flatShading?"#define FLAT_SHADED":"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+c:"",e.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",e.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",e.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",e.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",e.toneMapping!==bi?"#define TONE_MAPPING":"",e.toneMapping!==bi?Jt.tonemapping_pars_fragment:"",e.toneMapping!==bi?Tg("toneMapping",e.toneMapping):"",e.dithering?"#define DITHERING":"",e.opaque?"#define OPAQUE":"",Jt.colorspace_pars_fragment,wg("linearToOutputTexel",e.outputColorSpace),Ag(),e.useDepthPacking?"#define DEPTH_PACKING "+e.depthPacking:"",`
`].filter(Yr).join(`
`)),a=rc(a),a=Jl(a,e),a=Ql(a,e),o=rc(o),o=Jl(o,e),o=Ql(o,e),a=th(a),o=th(o),e.isRawShaderMaterial!==!0&&(S=`#version 300 es
`,m=[f,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+m,p=["#define varying in",e.glslVersion===al?"":"layout(location = 0) out highp vec4 pc_fragColor;",e.glslVersion===al?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+p);const b=S+m+a,M=S+p+o,E=jl(r,r.VERTEX_SHADER,b),T=jl(r,r.FRAGMENT_SHADER,M);r.attachShader(v,E),r.attachShader(v,T),e.index0AttributeName!==void 0?r.bindAttribLocation(v,0,e.index0AttributeName):e.morphTargets===!0&&r.bindAttribLocation(v,0,"position"),r.linkProgram(v);function A(y){if(i.debug.checkShaderErrors){const w=r.getProgramInfoLog(v)||"",D=r.getShaderInfoLog(E)||"",I=r.getShaderInfoLog(T)||"",F=w.trim(),H=D.trim(),$=I.trim();let V=!0,Q=!0;if(r.getProgramParameter(v,r.LINK_STATUS)===!1)if(V=!1,typeof i.debug.onShaderError=="function")i.debug.onShaderError(r,v,E,T);else{const rt=Kl(r,E,"vertex"),ct=Kl(r,T,"fragment");console.error("THREE.WebGLProgram: Shader Error "+r.getError()+" - VALIDATE_STATUS "+r.getProgramParameter(v,r.VALIDATE_STATUS)+`

Material Name: `+y.name+`
Material Type: `+y.type+`

Program Info Log: `+F+`
`+rt+`
`+ct)}else F!==""?console.warn("THREE.WebGLProgram: Program Info Log:",F):(H===""||$==="")&&(Q=!1);Q&&(y.diagnostics={runnable:V,programLog:F,vertexShader:{log:H,prefix:m},fragmentShader:{log:$,prefix:p}})}r.deleteShader(E),r.deleteShader(T),R=new sa(r,v),_=Lg(r,v)}let R;this.getUniforms=function(){return R===void 0&&A(this),R};let _;this.getAttributes=function(){return _===void 0&&A(this),_};let x=e.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return x===!1&&(x=r.getProgramParameter(v,bg)),x},this.destroy=function(){n.releaseStatesOfProgram(this),r.deleteProgram(v),this.program=void 0},this.type=e.shaderType,this.name=e.shaderName,this.id=yg++,this.cacheKey=t,this.usedTimes=1,this.program=v,this.vertexShader=E,this.fragmentShader=T,this}let Vg=0;class Gg{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(t){const e=t.vertexShader,n=t.fragmentShader,r=this._getShaderStage(e),s=this._getShaderStage(n),a=this._getShaderCacheForMaterial(t);return a.has(r)===!1&&(a.add(r),r.usedTimes++),a.has(s)===!1&&(a.add(s),s.usedTimes++),this}remove(t){const e=this.materialCache.get(t);for(const n of e)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(t),this}getVertexShaderID(t){return this._getShaderStage(t.vertexShader).id}getFragmentShaderID(t){return this._getShaderStage(t.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(t){const e=this.materialCache;let n=e.get(t);return n===void 0&&(n=new Set,e.set(t,n)),n}_getShaderStage(t){const e=this.shaderCache;let n=e.get(t);return n===void 0&&(n=new Wg(t),e.set(t,n)),n}}class Wg{constructor(t){this.id=Vg++,this.code=t,this.usedTimes=0}}function Xg(i,t,e,n,r,s,a){const o=new au,c=new Gg,l=new Set,h=[],u=r.logarithmicDepthBuffer,d=r.vertexTextures;let f=r.precision;const g={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function v(_){return l.add(_),_===0?"uv":`uv${_}`}function m(_,x,y,w,D){const I=w.fog,F=D.geometry,H=_.isMeshStandardMaterial?w.environment:null,$=(_.isMeshStandardMaterial?e:t).get(_.envMap||H),V=$&&$.mapping===ma?$.image.height:null,Q=g[_.type];_.precision!==null&&(f=r.getMaxPrecision(_.precision),f!==_.precision&&console.warn("THREE.WebGLProgram.getParameters:",_.precision,"not supported, using",f,"instead."));const rt=F.morphAttributes.position||F.morphAttributes.normal||F.morphAttributes.color,ct=rt!==void 0?rt.length:0;let gt=0;F.morphAttributes.position!==void 0&&(gt=1),F.morphAttributes.normal!==void 0&&(gt=2),F.morphAttributes.color!==void 0&&(gt=3);let Ct,Nt,et,W;if(Q){const ae=Bn[Q];Ct=ae.vertexShader,Nt=ae.fragmentShader}else Ct=_.vertexShader,Nt=_.fragmentShader,c.update(_),et=c.getVertexShaderID(_),W=c.getFragmentShaderID(_);const Z=i.getRenderTarget(),N=i.state.buffers.depth.getReversed(),B=D.isInstancedMesh===!0,k=D.isBatchedMesh===!0,X=!!_.map,K=!!_.matcap,P=!!$,ht=!!_.aoMap,at=!!_.lightMap,_t=!!_.bumpMap,ft=!!_.normalMap,vt=!!_.displacementMap,xt=!!_.emissiveMap,Ft=!!_.metalnessMap,Se=!!_.roughnessMap,ge=_.anisotropy>0,O=_.clearcoat>0,C=_.dispersion>0,j=_.iridescence>0,st=_.sheen>0,lt=_.transmission>0,it=ge&&!!_.anisotropyMap,zt=O&&!!_.clearcoatMap,Mt=O&&!!_.clearcoatNormalMap,Ot=O&&!!_.clearcoatRoughnessMap,Bt=j&&!!_.iridescenceMap,pt=j&&!!_.iridescenceThicknessMap,At=st&&!!_.sheenColorMap,qt=st&&!!_.sheenRoughnessMap,kt=!!_.specularMap,wt=!!_.specularColorMap,jt=!!_.specularIntensityMap,G=lt&&!!_.transmissionMap,mt=lt&&!!_.thicknessMap,bt=!!_.gradientMap,Pt=!!_.alphaMap,ut=_.alphaTest>0,ot=!!_.alphaHash,It=!!_.extensions;let $t=bi;_.toneMapped&&(Z===null||Z.isXRRenderTarget===!0)&&($t=i.toneMapping);const fe={shaderID:Q,shaderType:_.type,shaderName:_.name,vertexShader:Ct,fragmentShader:Nt,defines:_.defines,customVertexShaderID:et,customFragmentShaderID:W,isRawShaderMaterial:_.isRawShaderMaterial===!0,glslVersion:_.glslVersion,precision:f,batching:k,batchingColor:k&&D._colorsTexture!==null,instancing:B,instancingColor:B&&D.instanceColor!==null,instancingMorph:B&&D.morphTexture!==null,supportsVertexTextures:d,outputColorSpace:Z===null?i.outputColorSpace:Z.isXRRenderTarget===!0?Z.texture.colorSpace:Yi,alphaToCoverage:!!_.alphaToCoverage,map:X,matcap:K,envMap:P,envMapMode:P&&$.mapping,envMapCubeUVHeight:V,aoMap:ht,lightMap:at,bumpMap:_t,normalMap:ft,displacementMap:d&&vt,emissiveMap:xt,normalMapObjectSpace:ft&&_.normalMapType===ad,normalMapTangentSpace:ft&&_.normalMapType===nu,metalnessMap:Ft,roughnessMap:Se,anisotropy:ge,anisotropyMap:it,clearcoat:O,clearcoatMap:zt,clearcoatNormalMap:Mt,clearcoatRoughnessMap:Ot,dispersion:C,iridescence:j,iridescenceMap:Bt,iridescenceThicknessMap:pt,sheen:st,sheenColorMap:At,sheenRoughnessMap:qt,specularMap:kt,specularColorMap:wt,specularIntensityMap:jt,transmission:lt,transmissionMap:G,thicknessMap:mt,gradientMap:bt,opaque:_.transparent===!1&&_.blending===Er&&_.alphaToCoverage===!1,alphaMap:Pt,alphaTest:ut,alphaHash:ot,combine:_.combine,mapUv:X&&v(_.map.channel),aoMapUv:ht&&v(_.aoMap.channel),lightMapUv:at&&v(_.lightMap.channel),bumpMapUv:_t&&v(_.bumpMap.channel),normalMapUv:ft&&v(_.normalMap.channel),displacementMapUv:vt&&v(_.displacementMap.channel),emissiveMapUv:xt&&v(_.emissiveMap.channel),metalnessMapUv:Ft&&v(_.metalnessMap.channel),roughnessMapUv:Se&&v(_.roughnessMap.channel),anisotropyMapUv:it&&v(_.anisotropyMap.channel),clearcoatMapUv:zt&&v(_.clearcoatMap.channel),clearcoatNormalMapUv:Mt&&v(_.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:Ot&&v(_.clearcoatRoughnessMap.channel),iridescenceMapUv:Bt&&v(_.iridescenceMap.channel),iridescenceThicknessMapUv:pt&&v(_.iridescenceThicknessMap.channel),sheenColorMapUv:At&&v(_.sheenColorMap.channel),sheenRoughnessMapUv:qt&&v(_.sheenRoughnessMap.channel),specularMapUv:kt&&v(_.specularMap.channel),specularColorMapUv:wt&&v(_.specularColorMap.channel),specularIntensityMapUv:jt&&v(_.specularIntensityMap.channel),transmissionMapUv:G&&v(_.transmissionMap.channel),thicknessMapUv:mt&&v(_.thicknessMap.channel),alphaMapUv:Pt&&v(_.alphaMap.channel),vertexTangents:!!F.attributes.tangent&&(ft||ge),vertexColors:_.vertexColors,vertexAlphas:_.vertexColors===!0&&!!F.attributes.color&&F.attributes.color.itemSize===4,pointsUvs:D.isPoints===!0&&!!F.attributes.uv&&(X||Pt),fog:!!I,useFog:_.fog===!0,fogExp2:!!I&&I.isFogExp2,flatShading:_.flatShading===!0&&_.wireframe===!1,sizeAttenuation:_.sizeAttenuation===!0,logarithmicDepthBuffer:u,reversedDepthBuffer:N,skinning:D.isSkinnedMesh===!0,morphTargets:F.morphAttributes.position!==void 0,morphNormals:F.morphAttributes.normal!==void 0,morphColors:F.morphAttributes.color!==void 0,morphTargetsCount:ct,morphTextureStride:gt,numDirLights:x.directional.length,numPointLights:x.point.length,numSpotLights:x.spot.length,numSpotLightMaps:x.spotLightMap.length,numRectAreaLights:x.rectArea.length,numHemiLights:x.hemi.length,numDirLightShadows:x.directionalShadowMap.length,numPointLightShadows:x.pointShadowMap.length,numSpotLightShadows:x.spotShadowMap.length,numSpotLightShadowsWithMaps:x.numSpotLightShadowsWithMaps,numLightProbes:x.numLightProbes,numClippingPlanes:a.numPlanes,numClipIntersection:a.numIntersection,dithering:_.dithering,shadowMapEnabled:i.shadowMap.enabled&&y.length>0,shadowMapType:i.shadowMap.type,toneMapping:$t,decodeVideoTexture:X&&_.map.isVideoTexture===!0&&re.getTransfer(_.map.colorSpace)===le,decodeVideoTextureEmissive:xt&&_.emissiveMap.isVideoTexture===!0&&re.getTransfer(_.emissiveMap.colorSpace)===le,premultipliedAlpha:_.premultipliedAlpha,doubleSided:_.side===wn,flipSided:_.side===Je,useDepthPacking:_.depthPacking>=0,depthPacking:_.depthPacking||0,index0AttributeName:_.index0AttributeName,extensionClipCullDistance:It&&_.extensions.clipCullDistance===!0&&n.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(It&&_.extensions.multiDraw===!0||k)&&n.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:n.has("KHR_parallel_shader_compile"),customProgramCacheKey:_.customProgramCacheKey()};return fe.vertexUv1s=l.has(1),fe.vertexUv2s=l.has(2),fe.vertexUv3s=l.has(3),l.clear(),fe}function p(_){const x=[];if(_.shaderID?x.push(_.shaderID):(x.push(_.customVertexShaderID),x.push(_.customFragmentShaderID)),_.defines!==void 0)for(const y in _.defines)x.push(y),x.push(_.defines[y]);return _.isRawShaderMaterial===!1&&(S(x,_),b(x,_),x.push(i.outputColorSpace)),x.push(_.customProgramCacheKey),x.join()}function S(_,x){_.push(x.precision),_.push(x.outputColorSpace),_.push(x.envMapMode),_.push(x.envMapCubeUVHeight),_.push(x.mapUv),_.push(x.alphaMapUv),_.push(x.lightMapUv),_.push(x.aoMapUv),_.push(x.bumpMapUv),_.push(x.normalMapUv),_.push(x.displacementMapUv),_.push(x.emissiveMapUv),_.push(x.metalnessMapUv),_.push(x.roughnessMapUv),_.push(x.anisotropyMapUv),_.push(x.clearcoatMapUv),_.push(x.clearcoatNormalMapUv),_.push(x.clearcoatRoughnessMapUv),_.push(x.iridescenceMapUv),_.push(x.iridescenceThicknessMapUv),_.push(x.sheenColorMapUv),_.push(x.sheenRoughnessMapUv),_.push(x.specularMapUv),_.push(x.specularColorMapUv),_.push(x.specularIntensityMapUv),_.push(x.transmissionMapUv),_.push(x.thicknessMapUv),_.push(x.combine),_.push(x.fogExp2),_.push(x.sizeAttenuation),_.push(x.morphTargetsCount),_.push(x.morphAttributeCount),_.push(x.numDirLights),_.push(x.numPointLights),_.push(x.numSpotLights),_.push(x.numSpotLightMaps),_.push(x.numHemiLights),_.push(x.numRectAreaLights),_.push(x.numDirLightShadows),_.push(x.numPointLightShadows),_.push(x.numSpotLightShadows),_.push(x.numSpotLightShadowsWithMaps),_.push(x.numLightProbes),_.push(x.shadowMapType),_.push(x.toneMapping),_.push(x.numClippingPlanes),_.push(x.numClipIntersection),_.push(x.depthPacking)}function b(_,x){o.disableAll(),x.supportsVertexTextures&&o.enable(0),x.instancing&&o.enable(1),x.instancingColor&&o.enable(2),x.instancingMorph&&o.enable(3),x.matcap&&o.enable(4),x.envMap&&o.enable(5),x.normalMapObjectSpace&&o.enable(6),x.normalMapTangentSpace&&o.enable(7),x.clearcoat&&o.enable(8),x.iridescence&&o.enable(9),x.alphaTest&&o.enable(10),x.vertexColors&&o.enable(11),x.vertexAlphas&&o.enable(12),x.vertexUv1s&&o.enable(13),x.vertexUv2s&&o.enable(14),x.vertexUv3s&&o.enable(15),x.vertexTangents&&o.enable(16),x.anisotropy&&o.enable(17),x.alphaHash&&o.enable(18),x.batching&&o.enable(19),x.dispersion&&o.enable(20),x.batchingColor&&o.enable(21),x.gradientMap&&o.enable(22),_.push(o.mask),o.disableAll(),x.fog&&o.enable(0),x.useFog&&o.enable(1),x.flatShading&&o.enable(2),x.logarithmicDepthBuffer&&o.enable(3),x.reversedDepthBuffer&&o.enable(4),x.skinning&&o.enable(5),x.morphTargets&&o.enable(6),x.morphNormals&&o.enable(7),x.morphColors&&o.enable(8),x.premultipliedAlpha&&o.enable(9),x.shadowMapEnabled&&o.enable(10),x.doubleSided&&o.enable(11),x.flipSided&&o.enable(12),x.useDepthPacking&&o.enable(13),x.dithering&&o.enable(14),x.transmission&&o.enable(15),x.sheen&&o.enable(16),x.opaque&&o.enable(17),x.pointsUvs&&o.enable(18),x.decodeVideoTexture&&o.enable(19),x.decodeVideoTextureEmissive&&o.enable(20),x.alphaToCoverage&&o.enable(21),_.push(o.mask)}function M(_){const x=g[_.type];let y;if(x){const w=Bn[x];y=t0.clone(w.uniforms)}else y=_.uniforms;return y}function E(_,x){let y;for(let w=0,D=h.length;w<D;w++){const I=h[w];if(I.cacheKey===x){y=I,++y.usedTimes;break}}return y===void 0&&(y=new Hg(i,x,_,s),h.push(y)),y}function T(_){if(--_.usedTimes===0){const x=h.indexOf(_);h[x]=h[h.length-1],h.pop(),_.destroy()}}function A(_){c.remove(_)}function R(){c.dispose()}return{getParameters:m,getProgramCacheKey:p,getUniforms:M,acquireProgram:E,releaseProgram:T,releaseShaderCache:A,programs:h,dispose:R}}function qg(){let i=new WeakMap;function t(a){return i.has(a)}function e(a){let o=i.get(a);return o===void 0&&(o={},i.set(a,o)),o}function n(a){i.delete(a)}function r(a,o,c){i.get(a)[o]=c}function s(){i=new WeakMap}return{has:t,get:e,remove:n,update:r,dispose:s}}function Yg(i,t){return i.groupOrder!==t.groupOrder?i.groupOrder-t.groupOrder:i.renderOrder!==t.renderOrder?i.renderOrder-t.renderOrder:i.material.id!==t.material.id?i.material.id-t.material.id:i.z!==t.z?i.z-t.z:i.id-t.id}function nh(i,t){return i.groupOrder!==t.groupOrder?i.groupOrder-t.groupOrder:i.renderOrder!==t.renderOrder?i.renderOrder-t.renderOrder:i.z!==t.z?t.z-i.z:i.id-t.id}function ih(){const i=[];let t=0;const e=[],n=[],r=[];function s(){t=0,e.length=0,n.length=0,r.length=0}function a(u,d,f,g,v,m){let p=i[t];return p===void 0?(p={id:u.id,object:u,geometry:d,material:f,groupOrder:g,renderOrder:u.renderOrder,z:v,group:m},i[t]=p):(p.id=u.id,p.object=u,p.geometry=d,p.material=f,p.groupOrder=g,p.renderOrder=u.renderOrder,p.z=v,p.group=m),t++,p}function o(u,d,f,g,v,m){const p=a(u,d,f,g,v,m);f.transmission>0?n.push(p):f.transparent===!0?r.push(p):e.push(p)}function c(u,d,f,g,v,m){const p=a(u,d,f,g,v,m);f.transmission>0?n.unshift(p):f.transparent===!0?r.unshift(p):e.unshift(p)}function l(u,d){e.length>1&&e.sort(u||Yg),n.length>1&&n.sort(d||nh),r.length>1&&r.sort(d||nh)}function h(){for(let u=t,d=i.length;u<d;u++){const f=i[u];if(f.id===null)break;f.id=null,f.object=null,f.geometry=null,f.material=null,f.group=null}}return{opaque:e,transmissive:n,transparent:r,init:s,push:o,unshift:c,finish:h,sort:l}}function $g(){let i=new WeakMap;function t(n,r){const s=i.get(n);let a;return s===void 0?(a=new ih,i.set(n,[a])):r>=s.length?(a=new ih,s.push(a)):a=s[r],a}function e(){i=new WeakMap}return{get:t,dispose:e}}function jg(){const i={};return{get:function(t){if(i[t.id]!==void 0)return i[t.id];let e;switch(t.type){case"DirectionalLight":e={direction:new U,color:new Ht};break;case"SpotLight":e={position:new U,direction:new U,color:new Ht,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":e={position:new U,color:new Ht,distance:0,decay:0};break;case"HemisphereLight":e={direction:new U,skyColor:new Ht,groundColor:new Ht};break;case"RectAreaLight":e={color:new Ht,position:new U,halfWidth:new U,halfHeight:new U};break}return i[t.id]=e,e}}}function Zg(){const i={};return{get:function(t){if(i[t.id]!==void 0)return i[t.id];let e;switch(t.type){case"DirectionalLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Rt};break;case"SpotLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Rt};break;case"PointLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Rt,shadowCameraNear:1,shadowCameraFar:1e3};break}return i[t.id]=e,e}}}let Kg=0;function Jg(i,t){return(t.castShadow?2:0)-(i.castShadow?2:0)+(t.map?1:0)-(i.map?1:0)}function Qg(i){const t=new jg,e=Zg(),n={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let l=0;l<9;l++)n.probe.push(new U);const r=new U,s=new ne,a=new ne;function o(l){let h=0,u=0,d=0;for(let _=0;_<9;_++)n.probe[_].set(0,0,0);let f=0,g=0,v=0,m=0,p=0,S=0,b=0,M=0,E=0,T=0,A=0;l.sort(Jg);for(let _=0,x=l.length;_<x;_++){const y=l[_],w=y.color,D=y.intensity,I=y.distance,F=y.shadow&&y.shadow.map?y.shadow.map.texture:null;if(y.isAmbientLight)h+=w.r*D,u+=w.g*D,d+=w.b*D;else if(y.isLightProbe){for(let H=0;H<9;H++)n.probe[H].addScaledVector(y.sh.coefficients[H],D);A++}else if(y.isDirectionalLight){const H=t.get(y);if(H.color.copy(y.color).multiplyScalar(y.intensity),y.castShadow){const $=y.shadow,V=e.get(y);V.shadowIntensity=$.intensity,V.shadowBias=$.bias,V.shadowNormalBias=$.normalBias,V.shadowRadius=$.radius,V.shadowMapSize=$.mapSize,n.directionalShadow[f]=V,n.directionalShadowMap[f]=F,n.directionalShadowMatrix[f]=y.shadow.matrix,S++}n.directional[f]=H,f++}else if(y.isSpotLight){const H=t.get(y);H.position.setFromMatrixPosition(y.matrixWorld),H.color.copy(w).multiplyScalar(D),H.distance=I,H.coneCos=Math.cos(y.angle),H.penumbraCos=Math.cos(y.angle*(1-y.penumbra)),H.decay=y.decay,n.spot[v]=H;const $=y.shadow;if(y.map&&(n.spotLightMap[E]=y.map,E++,$.updateMatrices(y),y.castShadow&&T++),n.spotLightMatrix[v]=$.matrix,y.castShadow){const V=e.get(y);V.shadowIntensity=$.intensity,V.shadowBias=$.bias,V.shadowNormalBias=$.normalBias,V.shadowRadius=$.radius,V.shadowMapSize=$.mapSize,n.spotShadow[v]=V,n.spotShadowMap[v]=F,M++}v++}else if(y.isRectAreaLight){const H=t.get(y);H.color.copy(w).multiplyScalar(D),H.halfWidth.set(y.width*.5,0,0),H.halfHeight.set(0,y.height*.5,0),n.rectArea[m]=H,m++}else if(y.isPointLight){const H=t.get(y);if(H.color.copy(y.color).multiplyScalar(y.intensity),H.distance=y.distance,H.decay=y.decay,y.castShadow){const $=y.shadow,V=e.get(y);V.shadowIntensity=$.intensity,V.shadowBias=$.bias,V.shadowNormalBias=$.normalBias,V.shadowRadius=$.radius,V.shadowMapSize=$.mapSize,V.shadowCameraNear=$.camera.near,V.shadowCameraFar=$.camera.far,n.pointShadow[g]=V,n.pointShadowMap[g]=F,n.pointShadowMatrix[g]=y.shadow.matrix,b++}n.point[g]=H,g++}else if(y.isHemisphereLight){const H=t.get(y);H.skyColor.copy(y.color).multiplyScalar(D),H.groundColor.copy(y.groundColor).multiplyScalar(D),n.hemi[p]=H,p++}}m>0&&(i.has("OES_texture_float_linear")===!0?(n.rectAreaLTC1=Et.LTC_FLOAT_1,n.rectAreaLTC2=Et.LTC_FLOAT_2):(n.rectAreaLTC1=Et.LTC_HALF_1,n.rectAreaLTC2=Et.LTC_HALF_2)),n.ambient[0]=h,n.ambient[1]=u,n.ambient[2]=d;const R=n.hash;(R.directionalLength!==f||R.pointLength!==g||R.spotLength!==v||R.rectAreaLength!==m||R.hemiLength!==p||R.numDirectionalShadows!==S||R.numPointShadows!==b||R.numSpotShadows!==M||R.numSpotMaps!==E||R.numLightProbes!==A)&&(n.directional.length=f,n.spot.length=v,n.rectArea.length=m,n.point.length=g,n.hemi.length=p,n.directionalShadow.length=S,n.directionalShadowMap.length=S,n.pointShadow.length=b,n.pointShadowMap.length=b,n.spotShadow.length=M,n.spotShadowMap.length=M,n.directionalShadowMatrix.length=S,n.pointShadowMatrix.length=b,n.spotLightMatrix.length=M+E-T,n.spotLightMap.length=E,n.numSpotLightShadowsWithMaps=T,n.numLightProbes=A,R.directionalLength=f,R.pointLength=g,R.spotLength=v,R.rectAreaLength=m,R.hemiLength=p,R.numDirectionalShadows=S,R.numPointShadows=b,R.numSpotShadows=M,R.numSpotMaps=E,R.numLightProbes=A,n.version=Kg++)}function c(l,h){let u=0,d=0,f=0,g=0,v=0;const m=h.matrixWorldInverse;for(let p=0,S=l.length;p<S;p++){const b=l[p];if(b.isDirectionalLight){const M=n.directional[u];M.direction.setFromMatrixPosition(b.matrixWorld),r.setFromMatrixPosition(b.target.matrixWorld),M.direction.sub(r),M.direction.transformDirection(m),u++}else if(b.isSpotLight){const M=n.spot[f];M.position.setFromMatrixPosition(b.matrixWorld),M.position.applyMatrix4(m),M.direction.setFromMatrixPosition(b.matrixWorld),r.setFromMatrixPosition(b.target.matrixWorld),M.direction.sub(r),M.direction.transformDirection(m),f++}else if(b.isRectAreaLight){const M=n.rectArea[g];M.position.setFromMatrixPosition(b.matrixWorld),M.position.applyMatrix4(m),a.identity(),s.copy(b.matrixWorld),s.premultiply(m),a.extractRotation(s),M.halfWidth.set(b.width*.5,0,0),M.halfHeight.set(0,b.height*.5,0),M.halfWidth.applyMatrix4(a),M.halfHeight.applyMatrix4(a),g++}else if(b.isPointLight){const M=n.point[d];M.position.setFromMatrixPosition(b.matrixWorld),M.position.applyMatrix4(m),d++}else if(b.isHemisphereLight){const M=n.hemi[v];M.direction.setFromMatrixPosition(b.matrixWorld),M.direction.transformDirection(m),v++}}}return{setup:o,setupView:c,state:n}}function rh(i){const t=new Qg(i),e=[],n=[];function r(h){l.camera=h,e.length=0,n.length=0}function s(h){e.push(h)}function a(h){n.push(h)}function o(){t.setup(e)}function c(h){t.setupView(e,h)}const l={lightsArray:e,shadowsArray:n,camera:null,lights:t,transmissionRenderTarget:{}};return{init:r,state:l,setupLights:o,setupLightsView:c,pushLight:s,pushShadow:a}}function tv(i){let t=new WeakMap;function e(r,s=0){const a=t.get(r);let o;return a===void 0?(o=new rh(i),t.set(r,[o])):s>=a.length?(o=new rh(i),a.push(o)):o=a[s],o}function n(){t=new WeakMap}return{get:e,dispose:n}}const ev=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,nv=`uniform sampler2D shadow_pass;
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
}`;function iv(i,t,e){let n=new Ec;const r=new Rt,s=new Rt,a=new se,o=new A0({depthPacking:sd}),c=new R0,l={},h=e.maxTextureSize,u={[Si]:Je,[Je]:Si,[wn]:wn},d=new He({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new Rt},radius:{value:4}},vertexShader:ev,fragmentShader:nv}),f=d.clone();f.defines.HORIZONTAL_PASS=1;const g=new Ne;g.setAttribute("position",new oe(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const v=new Gt(g,d),m=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=Gh;let p=this.type;this.render=function(T,A,R){if(m.enabled===!1||m.autoUpdate===!1&&m.needsUpdate===!1||T.length===0)return;const _=i.getRenderTarget(),x=i.getActiveCubeFace(),y=i.getActiveMipmapLevel(),w=i.state;w.setBlending(Mi),w.buffers.depth.getReversed()===!0?w.buffers.color.setClear(0,0,0,0):w.buffers.color.setClear(1,1,1,1),w.buffers.depth.setTest(!0),w.setScissorTest(!1);const D=p!==Zn&&this.type===Zn,I=p===Zn&&this.type!==Zn;for(let F=0,H=T.length;F<H;F++){const $=T[F],V=$.shadow;if(V===void 0){console.warn("THREE.WebGLShadowMap:",$,"has no shadow.");continue}if(V.autoUpdate===!1&&V.needsUpdate===!1)continue;r.copy(V.mapSize);const Q=V.getFrameExtents();if(r.multiply(Q),s.copy(V.mapSize),(r.x>h||r.y>h)&&(r.x>h&&(s.x=Math.floor(h/Q.x),r.x=s.x*Q.x,V.mapSize.x=s.x),r.y>h&&(s.y=Math.floor(h/Q.y),r.y=s.y*Q.y,V.mapSize.y=s.y)),V.map===null||D===!0||I===!0){const ct=this.type!==Zn?{minFilter:un,magFilter:un}:{};V.map!==null&&V.map.dispose(),V.map=new Ye(r.x,r.y,ct),V.map.texture.name=$.name+".shadowMap",V.camera.updateProjectionMatrix()}i.setRenderTarget(V.map),i.clear();const rt=V.getViewportCount();for(let ct=0;ct<rt;ct++){const gt=V.getViewport(ct);a.set(s.x*gt.x,s.y*gt.y,s.x*gt.z,s.y*gt.w),w.viewport(a),V.updateMatrices($,ct),n=V.getFrustum(),M(A,R,V.camera,$,this.type)}V.isPointLightShadow!==!0&&this.type===Zn&&S(V,R),V.needsUpdate=!1}p=this.type,m.needsUpdate=!1,i.setRenderTarget(_,x,y)};function S(T,A){const R=t.update(v);d.defines.VSM_SAMPLES!==T.blurSamples&&(d.defines.VSM_SAMPLES=T.blurSamples,f.defines.VSM_SAMPLES=T.blurSamples,d.needsUpdate=!0,f.needsUpdate=!0),T.mapPass===null&&(T.mapPass=new Ye(r.x,r.y)),d.uniforms.shadow_pass.value=T.map.texture,d.uniforms.resolution.value=T.mapSize,d.uniforms.radius.value=T.radius,i.setRenderTarget(T.mapPass),i.clear(),i.renderBufferDirect(A,null,R,d,v,null),f.uniforms.shadow_pass.value=T.mapPass.texture,f.uniforms.resolution.value=T.mapSize,f.uniforms.radius.value=T.radius,i.setRenderTarget(T.map),i.clear(),i.renderBufferDirect(A,null,R,f,v,null)}function b(T,A,R,_){let x=null;const y=R.isPointLight===!0?T.customDistanceMaterial:T.customDepthMaterial;if(y!==void 0)x=y;else if(x=R.isPointLight===!0?c:o,i.localClippingEnabled&&A.clipShadows===!0&&Array.isArray(A.clippingPlanes)&&A.clippingPlanes.length!==0||A.displacementMap&&A.displacementScale!==0||A.alphaMap&&A.alphaTest>0||A.map&&A.alphaTest>0||A.alphaToCoverage===!0){const w=x.uuid,D=A.uuid;let I=l[w];I===void 0&&(I={},l[w]=I);let F=I[D];F===void 0&&(F=x.clone(),I[D]=F,A.addEventListener("dispose",E)),x=F}if(x.visible=A.visible,x.wireframe=A.wireframe,_===Zn?x.side=A.shadowSide!==null?A.shadowSide:A.side:x.side=A.shadowSide!==null?A.shadowSide:u[A.side],x.alphaMap=A.alphaMap,x.alphaTest=A.alphaToCoverage===!0?.5:A.alphaTest,x.map=A.map,x.clipShadows=A.clipShadows,x.clippingPlanes=A.clippingPlanes,x.clipIntersection=A.clipIntersection,x.displacementMap=A.displacementMap,x.displacementScale=A.displacementScale,x.displacementBias=A.displacementBias,x.wireframeLinewidth=A.wireframeLinewidth,x.linewidth=A.linewidth,R.isPointLight===!0&&x.isMeshDistanceMaterial===!0){const w=i.properties.get(x);w.light=R}return x}function M(T,A,R,_,x){if(T.visible===!1)return;if(T.layers.test(A.layers)&&(T.isMesh||T.isLine||T.isPoints)&&(T.castShadow||T.receiveShadow&&x===Zn)&&(!T.frustumCulled||n.intersectsObject(T))){T.modelViewMatrix.multiplyMatrices(R.matrixWorldInverse,T.matrixWorld);const D=t.update(T),I=T.material;if(Array.isArray(I)){const F=D.groups;for(let H=0,$=F.length;H<$;H++){const V=F[H],Q=I[V.materialIndex];if(Q&&Q.visible){const rt=b(T,Q,_,x);T.onBeforeShadow(i,T,A,R,D,rt,V),i.renderBufferDirect(R,null,D,rt,T,V),T.onAfterShadow(i,T,A,R,D,rt,V)}}}else if(I.visible){const F=b(T,I,_,x);T.onBeforeShadow(i,T,A,R,D,F,null),i.renderBufferDirect(R,null,D,F,T,null),T.onAfterShadow(i,T,A,R,D,F,null)}}const w=T.children;for(let D=0,I=w.length;D<I;D++)M(w[D],A,R,_,x)}function E(T){T.target.removeEventListener("dispose",E);for(const R in l){const _=l[R],x=T.target.uuid;x in _&&(_[x].dispose(),delete _[x])}}}const rv={[xo]:Mo,[bo]:Eo,[yo]:wo,[Ar]:So,[Mo]:xo,[Eo]:bo,[wo]:yo,[So]:Ar};function sv(i,t){function e(){let G=!1;const mt=new se;let bt=null;const Pt=new se(0,0,0,0);return{setMask:function(ut){bt!==ut&&!G&&(i.colorMask(ut,ut,ut,ut),bt=ut)},setLocked:function(ut){G=ut},setClear:function(ut,ot,It,$t,fe){fe===!0&&(ut*=$t,ot*=$t,It*=$t),mt.set(ut,ot,It,$t),Pt.equals(mt)===!1&&(i.clearColor(ut,ot,It,$t),Pt.copy(mt))},reset:function(){G=!1,bt=null,Pt.set(-1,0,0,0)}}}function n(){let G=!1,mt=!1,bt=null,Pt=null,ut=null;return{setReversed:function(ot){if(mt!==ot){const It=t.get("EXT_clip_control");ot?It.clipControlEXT(It.LOWER_LEFT_EXT,It.ZERO_TO_ONE_EXT):It.clipControlEXT(It.LOWER_LEFT_EXT,It.NEGATIVE_ONE_TO_ONE_EXT),mt=ot;const $t=ut;ut=null,this.setClear($t)}},getReversed:function(){return mt},setTest:function(ot){ot?Z(i.DEPTH_TEST):N(i.DEPTH_TEST)},setMask:function(ot){bt!==ot&&!G&&(i.depthMask(ot),bt=ot)},setFunc:function(ot){if(mt&&(ot=rv[ot]),Pt!==ot){switch(ot){case xo:i.depthFunc(i.NEVER);break;case Mo:i.depthFunc(i.ALWAYS);break;case bo:i.depthFunc(i.LESS);break;case Ar:i.depthFunc(i.LEQUAL);break;case yo:i.depthFunc(i.EQUAL);break;case So:i.depthFunc(i.GEQUAL);break;case Eo:i.depthFunc(i.GREATER);break;case wo:i.depthFunc(i.NOTEQUAL);break;default:i.depthFunc(i.LEQUAL)}Pt=ot}},setLocked:function(ot){G=ot},setClear:function(ot){ut!==ot&&(mt&&(ot=1-ot),i.clearDepth(ot),ut=ot)},reset:function(){G=!1,bt=null,Pt=null,ut=null,mt=!1}}}function r(){let G=!1,mt=null,bt=null,Pt=null,ut=null,ot=null,It=null,$t=null,fe=null;return{setTest:function(ae){G||(ae?Z(i.STENCIL_TEST):N(i.STENCIL_TEST))},setMask:function(ae){mt!==ae&&!G&&(i.stencilMask(ae),mt=ae)},setFunc:function(ae,Gn,Dn){(bt!==ae||Pt!==Gn||ut!==Dn)&&(i.stencilFunc(ae,Gn,Dn),bt=ae,Pt=Gn,ut=Dn)},setOp:function(ae,Gn,Dn){(ot!==ae||It!==Gn||$t!==Dn)&&(i.stencilOp(ae,Gn,Dn),ot=ae,It=Gn,$t=Dn)},setLocked:function(ae){G=ae},setClear:function(ae){fe!==ae&&(i.clearStencil(ae),fe=ae)},reset:function(){G=!1,mt=null,bt=null,Pt=null,ut=null,ot=null,It=null,$t=null,fe=null}}}const s=new e,a=new n,o=new r,c=new WeakMap,l=new WeakMap;let h={},u={},d=new WeakMap,f=[],g=null,v=!1,m=null,p=null,S=null,b=null,M=null,E=null,T=null,A=new Ht(0,0,0),R=0,_=!1,x=null,y=null,w=null,D=null,I=null;const F=i.getParameter(i.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let H=!1,$=0;const V=i.getParameter(i.VERSION);V.indexOf("WebGL")!==-1?($=parseFloat(/^WebGL (\d)/.exec(V)[1]),H=$>=1):V.indexOf("OpenGL ES")!==-1&&($=parseFloat(/^OpenGL ES (\d)/.exec(V)[1]),H=$>=2);let Q=null,rt={};const ct=i.getParameter(i.SCISSOR_BOX),gt=i.getParameter(i.VIEWPORT),Ct=new se().fromArray(ct),Nt=new se().fromArray(gt);function et(G,mt,bt,Pt){const ut=new Uint8Array(4),ot=i.createTexture();i.bindTexture(G,ot),i.texParameteri(G,i.TEXTURE_MIN_FILTER,i.NEAREST),i.texParameteri(G,i.TEXTURE_MAG_FILTER,i.NEAREST);for(let It=0;It<bt;It++)G===i.TEXTURE_3D||G===i.TEXTURE_2D_ARRAY?i.texImage3D(mt,0,i.RGBA,1,1,Pt,0,i.RGBA,i.UNSIGNED_BYTE,ut):i.texImage2D(mt+It,0,i.RGBA,1,1,0,i.RGBA,i.UNSIGNED_BYTE,ut);return ot}const W={};W[i.TEXTURE_2D]=et(i.TEXTURE_2D,i.TEXTURE_2D,1),W[i.TEXTURE_CUBE_MAP]=et(i.TEXTURE_CUBE_MAP,i.TEXTURE_CUBE_MAP_POSITIVE_X,6),W[i.TEXTURE_2D_ARRAY]=et(i.TEXTURE_2D_ARRAY,i.TEXTURE_2D_ARRAY,1,1),W[i.TEXTURE_3D]=et(i.TEXTURE_3D,i.TEXTURE_3D,1,1),s.setClear(0,0,0,1),a.setClear(1),o.setClear(0),Z(i.DEPTH_TEST),a.setFunc(Ar),_t(!1),ft(Qc),Z(i.CULL_FACE),ht(Mi);function Z(G){h[G]!==!0&&(i.enable(G),h[G]=!0)}function N(G){h[G]!==!1&&(i.disable(G),h[G]=!1)}function B(G,mt){return u[G]!==mt?(i.bindFramebuffer(G,mt),u[G]=mt,G===i.DRAW_FRAMEBUFFER&&(u[i.FRAMEBUFFER]=mt),G===i.FRAMEBUFFER&&(u[i.DRAW_FRAMEBUFFER]=mt),!0):!1}function k(G,mt){let bt=f,Pt=!1;if(G){bt=d.get(mt),bt===void 0&&(bt=[],d.set(mt,bt));const ut=G.textures;if(bt.length!==ut.length||bt[0]!==i.COLOR_ATTACHMENT0){for(let ot=0,It=ut.length;ot<It;ot++)bt[ot]=i.COLOR_ATTACHMENT0+ot;bt.length=ut.length,Pt=!0}}else bt[0]!==i.BACK&&(bt[0]=i.BACK,Pt=!0);Pt&&i.drawBuffers(bt)}function X(G){return g!==G?(i.useProgram(G),g=G,!0):!1}const K={[Fi]:i.FUNC_ADD,[Pf]:i.FUNC_SUBTRACT,[Df]:i.FUNC_REVERSE_SUBTRACT};K[If]=i.MIN,K[Uf]=i.MAX;const P={[Nf]:i.ZERO,[Ff]:i.ONE,[Of]:i.SRC_COLOR,[vo]:i.SRC_ALPHA,[Gf]:i.SRC_ALPHA_SATURATE,[Hf]:i.DST_COLOR,[kf]:i.DST_ALPHA,[Bf]:i.ONE_MINUS_SRC_COLOR,[_o]:i.ONE_MINUS_SRC_ALPHA,[Vf]:i.ONE_MINUS_DST_COLOR,[zf]:i.ONE_MINUS_DST_ALPHA,[Wf]:i.CONSTANT_COLOR,[Xf]:i.ONE_MINUS_CONSTANT_COLOR,[qf]:i.CONSTANT_ALPHA,[Yf]:i.ONE_MINUS_CONSTANT_ALPHA};function ht(G,mt,bt,Pt,ut,ot,It,$t,fe,ae){if(G===Mi){v===!0&&(N(i.BLEND),v=!1);return}if(v===!1&&(Z(i.BLEND),v=!0),G!==Lf){if(G!==m||ae!==_){if((p!==Fi||M!==Fi)&&(i.blendEquation(i.FUNC_ADD),p=Fi,M=Fi),ae)switch(G){case Er:i.blendFuncSeparate(i.ONE,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case tl:i.blendFunc(i.ONE,i.ONE);break;case el:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case nl:i.blendFuncSeparate(i.DST_COLOR,i.ONE_MINUS_SRC_ALPHA,i.ZERO,i.ONE);break;default:console.error("THREE.WebGLState: Invalid blending: ",G);break}else switch(G){case Er:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case tl:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE,i.ONE,i.ONE);break;case el:console.error("THREE.WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case nl:console.error("THREE.WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:console.error("THREE.WebGLState: Invalid blending: ",G);break}S=null,b=null,E=null,T=null,A.set(0,0,0),R=0,m=G,_=ae}return}ut=ut||mt,ot=ot||bt,It=It||Pt,(mt!==p||ut!==M)&&(i.blendEquationSeparate(K[mt],K[ut]),p=mt,M=ut),(bt!==S||Pt!==b||ot!==E||It!==T)&&(i.blendFuncSeparate(P[bt],P[Pt],P[ot],P[It]),S=bt,b=Pt,E=ot,T=It),($t.equals(A)===!1||fe!==R)&&(i.blendColor($t.r,$t.g,$t.b,fe),A.copy($t),R=fe),m=G,_=!1}function at(G,mt){G.side===wn?N(i.CULL_FACE):Z(i.CULL_FACE);let bt=G.side===Je;mt&&(bt=!bt),_t(bt),G.blending===Er&&G.transparent===!1?ht(Mi):ht(G.blending,G.blendEquation,G.blendSrc,G.blendDst,G.blendEquationAlpha,G.blendSrcAlpha,G.blendDstAlpha,G.blendColor,G.blendAlpha,G.premultipliedAlpha),a.setFunc(G.depthFunc),a.setTest(G.depthTest),a.setMask(G.depthWrite),s.setMask(G.colorWrite);const Pt=G.stencilWrite;o.setTest(Pt),Pt&&(o.setMask(G.stencilWriteMask),o.setFunc(G.stencilFunc,G.stencilRef,G.stencilFuncMask),o.setOp(G.stencilFail,G.stencilZFail,G.stencilZPass)),xt(G.polygonOffset,G.polygonOffsetFactor,G.polygonOffsetUnits),G.alphaToCoverage===!0?Z(i.SAMPLE_ALPHA_TO_COVERAGE):N(i.SAMPLE_ALPHA_TO_COVERAGE)}function _t(G){x!==G&&(G?i.frontFace(i.CW):i.frontFace(i.CCW),x=G)}function ft(G){G!==Rf?(Z(i.CULL_FACE),G!==y&&(G===Qc?i.cullFace(i.BACK):G===Cf?i.cullFace(i.FRONT):i.cullFace(i.FRONT_AND_BACK))):N(i.CULL_FACE),y=G}function vt(G){G!==w&&(H&&i.lineWidth(G),w=G)}function xt(G,mt,bt){G?(Z(i.POLYGON_OFFSET_FILL),(D!==mt||I!==bt)&&(i.polygonOffset(mt,bt),D=mt,I=bt)):N(i.POLYGON_OFFSET_FILL)}function Ft(G){G?Z(i.SCISSOR_TEST):N(i.SCISSOR_TEST)}function Se(G){G===void 0&&(G=i.TEXTURE0+F-1),Q!==G&&(i.activeTexture(G),Q=G)}function ge(G,mt,bt){bt===void 0&&(Q===null?bt=i.TEXTURE0+F-1:bt=Q);let Pt=rt[bt];Pt===void 0&&(Pt={type:void 0,texture:void 0},rt[bt]=Pt),(Pt.type!==G||Pt.texture!==mt)&&(Q!==bt&&(i.activeTexture(bt),Q=bt),i.bindTexture(G,mt||W[G]),Pt.type=G,Pt.texture=mt)}function O(){const G=rt[Q];G!==void 0&&G.type!==void 0&&(i.bindTexture(G.type,null),G.type=void 0,G.texture=void 0)}function C(){try{i.compressedTexImage2D(...arguments)}catch(G){console.error("THREE.WebGLState:",G)}}function j(){try{i.compressedTexImage3D(...arguments)}catch(G){console.error("THREE.WebGLState:",G)}}function st(){try{i.texSubImage2D(...arguments)}catch(G){console.error("THREE.WebGLState:",G)}}function lt(){try{i.texSubImage3D(...arguments)}catch(G){console.error("THREE.WebGLState:",G)}}function it(){try{i.compressedTexSubImage2D(...arguments)}catch(G){console.error("THREE.WebGLState:",G)}}function zt(){try{i.compressedTexSubImage3D(...arguments)}catch(G){console.error("THREE.WebGLState:",G)}}function Mt(){try{i.texStorage2D(...arguments)}catch(G){console.error("THREE.WebGLState:",G)}}function Ot(){try{i.texStorage3D(...arguments)}catch(G){console.error("THREE.WebGLState:",G)}}function Bt(){try{i.texImage2D(...arguments)}catch(G){console.error("THREE.WebGLState:",G)}}function pt(){try{i.texImage3D(...arguments)}catch(G){console.error("THREE.WebGLState:",G)}}function At(G){Ct.equals(G)===!1&&(i.scissor(G.x,G.y,G.z,G.w),Ct.copy(G))}function qt(G){Nt.equals(G)===!1&&(i.viewport(G.x,G.y,G.z,G.w),Nt.copy(G))}function kt(G,mt){let bt=l.get(mt);bt===void 0&&(bt=new WeakMap,l.set(mt,bt));let Pt=bt.get(G);Pt===void 0&&(Pt=i.getUniformBlockIndex(mt,G.name),bt.set(G,Pt))}function wt(G,mt){const Pt=l.get(mt).get(G);c.get(mt)!==Pt&&(i.uniformBlockBinding(mt,Pt,G.__bindingPointIndex),c.set(mt,Pt))}function jt(){i.disable(i.BLEND),i.disable(i.CULL_FACE),i.disable(i.DEPTH_TEST),i.disable(i.POLYGON_OFFSET_FILL),i.disable(i.SCISSOR_TEST),i.disable(i.STENCIL_TEST),i.disable(i.SAMPLE_ALPHA_TO_COVERAGE),i.blendEquation(i.FUNC_ADD),i.blendFunc(i.ONE,i.ZERO),i.blendFuncSeparate(i.ONE,i.ZERO,i.ONE,i.ZERO),i.blendColor(0,0,0,0),i.colorMask(!0,!0,!0,!0),i.clearColor(0,0,0,0),i.depthMask(!0),i.depthFunc(i.LESS),a.setReversed(!1),i.clearDepth(1),i.stencilMask(4294967295),i.stencilFunc(i.ALWAYS,0,4294967295),i.stencilOp(i.KEEP,i.KEEP,i.KEEP),i.clearStencil(0),i.cullFace(i.BACK),i.frontFace(i.CCW),i.polygonOffset(0,0),i.activeTexture(i.TEXTURE0),i.bindFramebuffer(i.FRAMEBUFFER,null),i.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),i.bindFramebuffer(i.READ_FRAMEBUFFER,null),i.useProgram(null),i.lineWidth(1),i.scissor(0,0,i.canvas.width,i.canvas.height),i.viewport(0,0,i.canvas.width,i.canvas.height),h={},Q=null,rt={},u={},d=new WeakMap,f=[],g=null,v=!1,m=null,p=null,S=null,b=null,M=null,E=null,T=null,A=new Ht(0,0,0),R=0,_=!1,x=null,y=null,w=null,D=null,I=null,Ct.set(0,0,i.canvas.width,i.canvas.height),Nt.set(0,0,i.canvas.width,i.canvas.height),s.reset(),a.reset(),o.reset()}return{buffers:{color:s,depth:a,stencil:o},enable:Z,disable:N,bindFramebuffer:B,drawBuffers:k,useProgram:X,setBlending:ht,setMaterial:at,setFlipSided:_t,setCullFace:ft,setLineWidth:vt,setPolygonOffset:xt,setScissorTest:Ft,activeTexture:Se,bindTexture:ge,unbindTexture:O,compressedTexImage2D:C,compressedTexImage3D:j,texImage2D:Bt,texImage3D:pt,updateUBOMapping:kt,uniformBlockBinding:wt,texStorage2D:Mt,texStorage3D:Ot,texSubImage2D:st,texSubImage3D:lt,compressedTexSubImage2D:it,compressedTexSubImage3D:zt,scissor:At,viewport:qt,reset:jt}}function av(i,t,e,n,r,s,a){const o=t.has("WEBGL_multisampled_render_to_texture")?t.get("WEBGL_multisampled_render_to_texture"):null,c=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),l=new Rt,h=new WeakMap;let u;const d=new WeakMap;let f=!1;try{f=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function g(O,C){return f?new OffscreenCanvas(O,C):ua("canvas")}function v(O,C,j){let st=1;const lt=ge(O);if((lt.width>j||lt.height>j)&&(st=j/Math.max(lt.width,lt.height)),st<1)if(typeof HTMLImageElement<"u"&&O instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&O instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&O instanceof ImageBitmap||typeof VideoFrame<"u"&&O instanceof VideoFrame){const it=Math.floor(st*lt.width),zt=Math.floor(st*lt.height);u===void 0&&(u=g(it,zt));const Mt=C?g(it,zt):u;return Mt.width=it,Mt.height=zt,Mt.getContext("2d").drawImage(O,0,0,it,zt),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+lt.width+"x"+lt.height+") to ("+it+"x"+zt+")."),Mt}else return"data"in O&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+lt.width+"x"+lt.height+")."),O;return O}function m(O){return O.generateMipmaps}function p(O){i.generateMipmap(O)}function S(O){return O.isWebGLCubeRenderTarget?i.TEXTURE_CUBE_MAP:O.isWebGL3DRenderTarget?i.TEXTURE_3D:O.isWebGLArrayRenderTarget||O.isCompressedArrayTexture?i.TEXTURE_2D_ARRAY:i.TEXTURE_2D}function b(O,C,j,st,lt=!1){if(O!==null){if(i[O]!==void 0)return i[O];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+O+"'")}let it=C;if(C===i.RED&&(j===i.FLOAT&&(it=i.R32F),j===i.HALF_FLOAT&&(it=i.R16F),j===i.UNSIGNED_BYTE&&(it=i.R8)),C===i.RED_INTEGER&&(j===i.UNSIGNED_BYTE&&(it=i.R8UI),j===i.UNSIGNED_SHORT&&(it=i.R16UI),j===i.UNSIGNED_INT&&(it=i.R32UI),j===i.BYTE&&(it=i.R8I),j===i.SHORT&&(it=i.R16I),j===i.INT&&(it=i.R32I)),C===i.RG&&(j===i.FLOAT&&(it=i.RG32F),j===i.HALF_FLOAT&&(it=i.RG16F),j===i.UNSIGNED_BYTE&&(it=i.RG8)),C===i.RG_INTEGER&&(j===i.UNSIGNED_BYTE&&(it=i.RG8UI),j===i.UNSIGNED_SHORT&&(it=i.RG16UI),j===i.UNSIGNED_INT&&(it=i.RG32UI),j===i.BYTE&&(it=i.RG8I),j===i.SHORT&&(it=i.RG16I),j===i.INT&&(it=i.RG32I)),C===i.RGB_INTEGER&&(j===i.UNSIGNED_BYTE&&(it=i.RGB8UI),j===i.UNSIGNED_SHORT&&(it=i.RGB16UI),j===i.UNSIGNED_INT&&(it=i.RGB32UI),j===i.BYTE&&(it=i.RGB8I),j===i.SHORT&&(it=i.RGB16I),j===i.INT&&(it=i.RGB32I)),C===i.RGBA_INTEGER&&(j===i.UNSIGNED_BYTE&&(it=i.RGBA8UI),j===i.UNSIGNED_SHORT&&(it=i.RGBA16UI),j===i.UNSIGNED_INT&&(it=i.RGBA32UI),j===i.BYTE&&(it=i.RGBA8I),j===i.SHORT&&(it=i.RGBA16I),j===i.INT&&(it=i.RGBA32I)),C===i.RGB&&(j===i.UNSIGNED_INT_5_9_9_9_REV&&(it=i.RGB9_E5),j===i.UNSIGNED_INT_10F_11F_11F_REV&&(it=i.R11F_G11F_B10F)),C===i.RGBA){const zt=lt?la:re.getTransfer(st);j===i.FLOAT&&(it=i.RGBA32F),j===i.HALF_FLOAT&&(it=i.RGBA16F),j===i.UNSIGNED_BYTE&&(it=zt===le?i.SRGB8_ALPHA8:i.RGBA8),j===i.UNSIGNED_SHORT_4_4_4_4&&(it=i.RGBA4),j===i.UNSIGNED_SHORT_5_5_5_1&&(it=i.RGB5_A1)}return(it===i.R16F||it===i.R32F||it===i.RG16F||it===i.RG32F||it===i.RGBA16F||it===i.RGBA32F)&&t.get("EXT_color_buffer_float"),it}function M(O,C){let j;return O?C===null||C===qi||C===ss?j=i.DEPTH24_STENCIL8:C===zn?j=i.DEPTH32F_STENCIL8:C===rs&&(j=i.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):C===null||C===qi||C===ss?j=i.DEPTH_COMPONENT24:C===zn?j=i.DEPTH_COMPONENT32F:C===rs&&(j=i.DEPTH_COMPONENT16),j}function E(O,C){return m(O)===!0||O.isFramebufferTexture&&O.minFilter!==un&&O.minFilter!==_e?Math.log2(Math.max(C.width,C.height))+1:O.mipmaps!==void 0&&O.mipmaps.length>0?O.mipmaps.length:O.isCompressedTexture&&Array.isArray(O.image)?C.mipmaps.length:1}function T(O){const C=O.target;C.removeEventListener("dispose",T),R(C),C.isVideoTexture&&h.delete(C)}function A(O){const C=O.target;C.removeEventListener("dispose",A),x(C)}function R(O){const C=n.get(O);if(C.__webglInit===void 0)return;const j=O.source,st=d.get(j);if(st){const lt=st[C.__cacheKey];lt.usedTimes--,lt.usedTimes===0&&_(O),Object.keys(st).length===0&&d.delete(j)}n.remove(O)}function _(O){const C=n.get(O);i.deleteTexture(C.__webglTexture);const j=O.source,st=d.get(j);delete st[C.__cacheKey],a.memory.textures--}function x(O){const C=n.get(O);if(O.depthTexture&&(O.depthTexture.dispose(),n.remove(O.depthTexture)),O.isWebGLCubeRenderTarget)for(let st=0;st<6;st++){if(Array.isArray(C.__webglFramebuffer[st]))for(let lt=0;lt<C.__webglFramebuffer[st].length;lt++)i.deleteFramebuffer(C.__webglFramebuffer[st][lt]);else i.deleteFramebuffer(C.__webglFramebuffer[st]);C.__webglDepthbuffer&&i.deleteRenderbuffer(C.__webglDepthbuffer[st])}else{if(Array.isArray(C.__webglFramebuffer))for(let st=0;st<C.__webglFramebuffer.length;st++)i.deleteFramebuffer(C.__webglFramebuffer[st]);else i.deleteFramebuffer(C.__webglFramebuffer);if(C.__webglDepthbuffer&&i.deleteRenderbuffer(C.__webglDepthbuffer),C.__webglMultisampledFramebuffer&&i.deleteFramebuffer(C.__webglMultisampledFramebuffer),C.__webglColorRenderbuffer)for(let st=0;st<C.__webglColorRenderbuffer.length;st++)C.__webglColorRenderbuffer[st]&&i.deleteRenderbuffer(C.__webglColorRenderbuffer[st]);C.__webglDepthRenderbuffer&&i.deleteRenderbuffer(C.__webglDepthRenderbuffer)}const j=O.textures;for(let st=0,lt=j.length;st<lt;st++){const it=n.get(j[st]);it.__webglTexture&&(i.deleteTexture(it.__webglTexture),a.memory.textures--),n.remove(j[st])}n.remove(O)}let y=0;function w(){y=0}function D(){const O=y;return O>=r.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+O+" texture units while this GPU supports only "+r.maxTextures),y+=1,O}function I(O){const C=[];return C.push(O.wrapS),C.push(O.wrapT),C.push(O.wrapR||0),C.push(O.magFilter),C.push(O.minFilter),C.push(O.anisotropy),C.push(O.internalFormat),C.push(O.format),C.push(O.type),C.push(O.generateMipmaps),C.push(O.premultiplyAlpha),C.push(O.flipY),C.push(O.unpackAlignment),C.push(O.colorSpace),C.join()}function F(O,C){const j=n.get(O);if(O.isVideoTexture&&Ft(O),O.isRenderTargetTexture===!1&&O.isExternalTexture!==!0&&O.version>0&&j.__version!==O.version){const st=O.image;if(st===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(st.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{W(j,O,C);return}}else O.isExternalTexture&&(j.__webglTexture=O.sourceTexture?O.sourceTexture:null);e.bindTexture(i.TEXTURE_2D,j.__webglTexture,i.TEXTURE0+C)}function H(O,C){const j=n.get(O);if(O.isRenderTargetTexture===!1&&O.version>0&&j.__version!==O.version){W(j,O,C);return}e.bindTexture(i.TEXTURE_2D_ARRAY,j.__webglTexture,i.TEXTURE0+C)}function $(O,C){const j=n.get(O);if(O.isRenderTargetTexture===!1&&O.version>0&&j.__version!==O.version){W(j,O,C);return}e.bindTexture(i.TEXTURE_3D,j.__webglTexture,i.TEXTURE0+C)}function V(O,C){const j=n.get(O);if(O.version>0&&j.__version!==O.version){Z(j,O,C);return}e.bindTexture(i.TEXTURE_CUBE_MAP,j.__webglTexture,i.TEXTURE0+C)}const Q={[is]:i.REPEAT,[ki]:i.CLAMP_TO_EDGE,[Ao]:i.MIRRORED_REPEAT},rt={[un]:i.NEAREST,[id]:i.NEAREST_MIPMAP_NEAREST,[Ms]:i.NEAREST_MIPMAP_LINEAR,[_e]:i.LINEAR,[ba]:i.LINEAR_MIPMAP_NEAREST,[zi]:i.LINEAR_MIPMAP_LINEAR},ct={[od]:i.NEVER,[dd]:i.ALWAYS,[cd]:i.LESS,[iu]:i.LEQUAL,[ld]:i.EQUAL,[fd]:i.GEQUAL,[hd]:i.GREATER,[ud]:i.NOTEQUAL};function gt(O,C){if(C.type===zn&&t.has("OES_texture_float_linear")===!1&&(C.magFilter===_e||C.magFilter===ba||C.magFilter===Ms||C.magFilter===zi||C.minFilter===_e||C.minFilter===ba||C.minFilter===Ms||C.minFilter===zi)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),i.texParameteri(O,i.TEXTURE_WRAP_S,Q[C.wrapS]),i.texParameteri(O,i.TEXTURE_WRAP_T,Q[C.wrapT]),(O===i.TEXTURE_3D||O===i.TEXTURE_2D_ARRAY)&&i.texParameteri(O,i.TEXTURE_WRAP_R,Q[C.wrapR]),i.texParameteri(O,i.TEXTURE_MAG_FILTER,rt[C.magFilter]),i.texParameteri(O,i.TEXTURE_MIN_FILTER,rt[C.minFilter]),C.compareFunction&&(i.texParameteri(O,i.TEXTURE_COMPARE_MODE,i.COMPARE_REF_TO_TEXTURE),i.texParameteri(O,i.TEXTURE_COMPARE_FUNC,ct[C.compareFunction])),t.has("EXT_texture_filter_anisotropic")===!0){if(C.magFilter===un||C.minFilter!==Ms&&C.minFilter!==zi||C.type===zn&&t.has("OES_texture_float_linear")===!1)return;if(C.anisotropy>1||n.get(C).__currentAnisotropy){const j=t.get("EXT_texture_filter_anisotropic");i.texParameterf(O,j.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(C.anisotropy,r.getMaxAnisotropy())),n.get(C).__currentAnisotropy=C.anisotropy}}}function Ct(O,C){let j=!1;O.__webglInit===void 0&&(O.__webglInit=!0,C.addEventListener("dispose",T));const st=C.source;let lt=d.get(st);lt===void 0&&(lt={},d.set(st,lt));const it=I(C);if(it!==O.__cacheKey){lt[it]===void 0&&(lt[it]={texture:i.createTexture(),usedTimes:0},a.memory.textures++,j=!0),lt[it].usedTimes++;const zt=lt[O.__cacheKey];zt!==void 0&&(lt[O.__cacheKey].usedTimes--,zt.usedTimes===0&&_(C)),O.__cacheKey=it,O.__webglTexture=lt[it].texture}return j}function Nt(O,C,j){return Math.floor(Math.floor(O/j)/C)}function et(O,C,j,st){const it=O.updateRanges;if(it.length===0)e.texSubImage2D(i.TEXTURE_2D,0,0,0,C.width,C.height,j,st,C.data);else{it.sort((pt,At)=>pt.start-At.start);let zt=0;for(let pt=1;pt<it.length;pt++){const At=it[zt],qt=it[pt],kt=At.start+At.count,wt=Nt(qt.start,C.width,4),jt=Nt(At.start,C.width,4);qt.start<=kt+1&&wt===jt&&Nt(qt.start+qt.count-1,C.width,4)===wt?At.count=Math.max(At.count,qt.start+qt.count-At.start):(++zt,it[zt]=qt)}it.length=zt+1;const Mt=i.getParameter(i.UNPACK_ROW_LENGTH),Ot=i.getParameter(i.UNPACK_SKIP_PIXELS),Bt=i.getParameter(i.UNPACK_SKIP_ROWS);i.pixelStorei(i.UNPACK_ROW_LENGTH,C.width);for(let pt=0,At=it.length;pt<At;pt++){const qt=it[pt],kt=Math.floor(qt.start/4),wt=Math.ceil(qt.count/4),jt=kt%C.width,G=Math.floor(kt/C.width),mt=wt,bt=1;i.pixelStorei(i.UNPACK_SKIP_PIXELS,jt),i.pixelStorei(i.UNPACK_SKIP_ROWS,G),e.texSubImage2D(i.TEXTURE_2D,0,jt,G,mt,bt,j,st,C.data)}O.clearUpdateRanges(),i.pixelStorei(i.UNPACK_ROW_LENGTH,Mt),i.pixelStorei(i.UNPACK_SKIP_PIXELS,Ot),i.pixelStorei(i.UNPACK_SKIP_ROWS,Bt)}}function W(O,C,j){let st=i.TEXTURE_2D;(C.isDataArrayTexture||C.isCompressedArrayTexture)&&(st=i.TEXTURE_2D_ARRAY),C.isData3DTexture&&(st=i.TEXTURE_3D);const lt=Ct(O,C),it=C.source;e.bindTexture(st,O.__webglTexture,i.TEXTURE0+j);const zt=n.get(it);if(it.version!==zt.__version||lt===!0){e.activeTexture(i.TEXTURE0+j);const Mt=re.getPrimaries(re.workingColorSpace),Ot=C.colorSpace===kn?null:re.getPrimaries(C.colorSpace),Bt=C.colorSpace===kn||Mt===Ot?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,C.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,C.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,C.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,Bt);let pt=v(C.image,!1,r.maxTextureSize);pt=Se(C,pt);const At=s.convert(C.format,C.colorSpace),qt=s.convert(C.type);let kt=b(C.internalFormat,At,qt,C.colorSpace,C.isVideoTexture);gt(st,C);let wt;const jt=C.mipmaps,G=C.isVideoTexture!==!0,mt=zt.__version===void 0||lt===!0,bt=it.dataReady,Pt=E(C,pt);if(C.isDepthTexture)kt=M(C.format===os,C.type),mt&&(G?e.texStorage2D(i.TEXTURE_2D,1,kt,pt.width,pt.height):e.texImage2D(i.TEXTURE_2D,0,kt,pt.width,pt.height,0,At,qt,null));else if(C.isDataTexture)if(jt.length>0){G&&mt&&e.texStorage2D(i.TEXTURE_2D,Pt,kt,jt[0].width,jt[0].height);for(let ut=0,ot=jt.length;ut<ot;ut++)wt=jt[ut],G?bt&&e.texSubImage2D(i.TEXTURE_2D,ut,0,0,wt.width,wt.height,At,qt,wt.data):e.texImage2D(i.TEXTURE_2D,ut,kt,wt.width,wt.height,0,At,qt,wt.data);C.generateMipmaps=!1}else G?(mt&&e.texStorage2D(i.TEXTURE_2D,Pt,kt,pt.width,pt.height),bt&&et(C,pt,At,qt)):e.texImage2D(i.TEXTURE_2D,0,kt,pt.width,pt.height,0,At,qt,pt.data);else if(C.isCompressedTexture)if(C.isCompressedArrayTexture){G&&mt&&e.texStorage3D(i.TEXTURE_2D_ARRAY,Pt,kt,jt[0].width,jt[0].height,pt.depth);for(let ut=0,ot=jt.length;ut<ot;ut++)if(wt=jt[ut],C.format!==Ve)if(At!==null)if(G){if(bt)if(C.layerUpdates.size>0){const It=Nl(wt.width,wt.height,C.format,C.type);for(const $t of C.layerUpdates){const fe=wt.data.subarray($t*It/wt.data.BYTES_PER_ELEMENT,($t+1)*It/wt.data.BYTES_PER_ELEMENT);e.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,ut,0,0,$t,wt.width,wt.height,1,At,fe)}C.clearLayerUpdates()}else e.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,ut,0,0,0,wt.width,wt.height,pt.depth,At,wt.data)}else e.compressedTexImage3D(i.TEXTURE_2D_ARRAY,ut,kt,wt.width,wt.height,pt.depth,0,wt.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else G?bt&&e.texSubImage3D(i.TEXTURE_2D_ARRAY,ut,0,0,0,wt.width,wt.height,pt.depth,At,qt,wt.data):e.texImage3D(i.TEXTURE_2D_ARRAY,ut,kt,wt.width,wt.height,pt.depth,0,At,qt,wt.data)}else{G&&mt&&e.texStorage2D(i.TEXTURE_2D,Pt,kt,jt[0].width,jt[0].height);for(let ut=0,ot=jt.length;ut<ot;ut++)wt=jt[ut],C.format!==Ve?At!==null?G?bt&&e.compressedTexSubImage2D(i.TEXTURE_2D,ut,0,0,wt.width,wt.height,At,wt.data):e.compressedTexImage2D(i.TEXTURE_2D,ut,kt,wt.width,wt.height,0,wt.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):G?bt&&e.texSubImage2D(i.TEXTURE_2D,ut,0,0,wt.width,wt.height,At,qt,wt.data):e.texImage2D(i.TEXTURE_2D,ut,kt,wt.width,wt.height,0,At,qt,wt.data)}else if(C.isDataArrayTexture)if(G){if(mt&&e.texStorage3D(i.TEXTURE_2D_ARRAY,Pt,kt,pt.width,pt.height,pt.depth),bt)if(C.layerUpdates.size>0){const ut=Nl(pt.width,pt.height,C.format,C.type);for(const ot of C.layerUpdates){const It=pt.data.subarray(ot*ut/pt.data.BYTES_PER_ELEMENT,(ot+1)*ut/pt.data.BYTES_PER_ELEMENT);e.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,ot,pt.width,pt.height,1,At,qt,It)}C.clearLayerUpdates()}else e.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,0,pt.width,pt.height,pt.depth,At,qt,pt.data)}else e.texImage3D(i.TEXTURE_2D_ARRAY,0,kt,pt.width,pt.height,pt.depth,0,At,qt,pt.data);else if(C.isData3DTexture)G?(mt&&e.texStorage3D(i.TEXTURE_3D,Pt,kt,pt.width,pt.height,pt.depth),bt&&e.texSubImage3D(i.TEXTURE_3D,0,0,0,0,pt.width,pt.height,pt.depth,At,qt,pt.data)):e.texImage3D(i.TEXTURE_3D,0,kt,pt.width,pt.height,pt.depth,0,At,qt,pt.data);else if(C.isFramebufferTexture){if(mt)if(G)e.texStorage2D(i.TEXTURE_2D,Pt,kt,pt.width,pt.height);else{let ut=pt.width,ot=pt.height;for(let It=0;It<Pt;It++)e.texImage2D(i.TEXTURE_2D,It,kt,ut,ot,0,At,qt,null),ut>>=1,ot>>=1}}else if(jt.length>0){if(G&&mt){const ut=ge(jt[0]);e.texStorage2D(i.TEXTURE_2D,Pt,kt,ut.width,ut.height)}for(let ut=0,ot=jt.length;ut<ot;ut++)wt=jt[ut],G?bt&&e.texSubImage2D(i.TEXTURE_2D,ut,0,0,At,qt,wt):e.texImage2D(i.TEXTURE_2D,ut,kt,At,qt,wt);C.generateMipmaps=!1}else if(G){if(mt){const ut=ge(pt);e.texStorage2D(i.TEXTURE_2D,Pt,kt,ut.width,ut.height)}bt&&e.texSubImage2D(i.TEXTURE_2D,0,0,0,At,qt,pt)}else e.texImage2D(i.TEXTURE_2D,0,kt,At,qt,pt);m(C)&&p(st),zt.__version=it.version,C.onUpdate&&C.onUpdate(C)}O.__version=C.version}function Z(O,C,j){if(C.image.length!==6)return;const st=Ct(O,C),lt=C.source;e.bindTexture(i.TEXTURE_CUBE_MAP,O.__webglTexture,i.TEXTURE0+j);const it=n.get(lt);if(lt.version!==it.__version||st===!0){e.activeTexture(i.TEXTURE0+j);const zt=re.getPrimaries(re.workingColorSpace),Mt=C.colorSpace===kn?null:re.getPrimaries(C.colorSpace),Ot=C.colorSpace===kn||zt===Mt?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,C.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,C.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,C.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,Ot);const Bt=C.isCompressedTexture||C.image[0].isCompressedTexture,pt=C.image[0]&&C.image[0].isDataTexture,At=[];for(let ot=0;ot<6;ot++)!Bt&&!pt?At[ot]=v(C.image[ot],!0,r.maxCubemapSize):At[ot]=pt?C.image[ot].image:C.image[ot],At[ot]=Se(C,At[ot]);const qt=At[0],kt=s.convert(C.format,C.colorSpace),wt=s.convert(C.type),jt=b(C.internalFormat,kt,wt,C.colorSpace),G=C.isVideoTexture!==!0,mt=it.__version===void 0||st===!0,bt=lt.dataReady;let Pt=E(C,qt);gt(i.TEXTURE_CUBE_MAP,C);let ut;if(Bt){G&&mt&&e.texStorage2D(i.TEXTURE_CUBE_MAP,Pt,jt,qt.width,qt.height);for(let ot=0;ot<6;ot++){ut=At[ot].mipmaps;for(let It=0;It<ut.length;It++){const $t=ut[It];C.format!==Ve?kt!==null?G?bt&&e.compressedTexSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ot,It,0,0,$t.width,$t.height,kt,$t.data):e.compressedTexImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ot,It,jt,$t.width,$t.height,0,$t.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):G?bt&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ot,It,0,0,$t.width,$t.height,kt,wt,$t.data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ot,It,jt,$t.width,$t.height,0,kt,wt,$t.data)}}}else{if(ut=C.mipmaps,G&&mt){ut.length>0&&Pt++;const ot=ge(At[0]);e.texStorage2D(i.TEXTURE_CUBE_MAP,Pt,jt,ot.width,ot.height)}for(let ot=0;ot<6;ot++)if(pt){G?bt&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ot,0,0,0,At[ot].width,At[ot].height,kt,wt,At[ot].data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ot,0,jt,At[ot].width,At[ot].height,0,kt,wt,At[ot].data);for(let It=0;It<ut.length;It++){const fe=ut[It].image[ot].image;G?bt&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ot,It+1,0,0,fe.width,fe.height,kt,wt,fe.data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ot,It+1,jt,fe.width,fe.height,0,kt,wt,fe.data)}}else{G?bt&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ot,0,0,0,kt,wt,At[ot]):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ot,0,jt,kt,wt,At[ot]);for(let It=0;It<ut.length;It++){const $t=ut[It];G?bt&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ot,It+1,0,0,kt,wt,$t.image[ot]):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ot,It+1,jt,kt,wt,$t.image[ot])}}}m(C)&&p(i.TEXTURE_CUBE_MAP),it.__version=lt.version,C.onUpdate&&C.onUpdate(C)}O.__version=C.version}function N(O,C,j,st,lt,it){const zt=s.convert(j.format,j.colorSpace),Mt=s.convert(j.type),Ot=b(j.internalFormat,zt,Mt,j.colorSpace),Bt=n.get(C),pt=n.get(j);if(pt.__renderTarget=C,!Bt.__hasExternalTextures){const At=Math.max(1,C.width>>it),qt=Math.max(1,C.height>>it);lt===i.TEXTURE_3D||lt===i.TEXTURE_2D_ARRAY?e.texImage3D(lt,it,Ot,At,qt,C.depth,0,zt,Mt,null):e.texImage2D(lt,it,Ot,At,qt,0,zt,Mt,null)}e.bindFramebuffer(i.FRAMEBUFFER,O),xt(C)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,st,lt,pt.__webglTexture,0,vt(C)):(lt===i.TEXTURE_2D||lt>=i.TEXTURE_CUBE_MAP_POSITIVE_X&&lt<=i.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&i.framebufferTexture2D(i.FRAMEBUFFER,st,lt,pt.__webglTexture,it),e.bindFramebuffer(i.FRAMEBUFFER,null)}function B(O,C,j){if(i.bindRenderbuffer(i.RENDERBUFFER,O),C.depthBuffer){const st=C.depthTexture,lt=st&&st.isDepthTexture?st.type:null,it=M(C.stencilBuffer,lt),zt=C.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,Mt=vt(C);xt(C)?o.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,Mt,it,C.width,C.height):j?i.renderbufferStorageMultisample(i.RENDERBUFFER,Mt,it,C.width,C.height):i.renderbufferStorage(i.RENDERBUFFER,it,C.width,C.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,zt,i.RENDERBUFFER,O)}else{const st=C.textures;for(let lt=0;lt<st.length;lt++){const it=st[lt],zt=s.convert(it.format,it.colorSpace),Mt=s.convert(it.type),Ot=b(it.internalFormat,zt,Mt,it.colorSpace),Bt=vt(C);j&&xt(C)===!1?i.renderbufferStorageMultisample(i.RENDERBUFFER,Bt,Ot,C.width,C.height):xt(C)?o.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,Bt,Ot,C.width,C.height):i.renderbufferStorage(i.RENDERBUFFER,Ot,C.width,C.height)}}i.bindRenderbuffer(i.RENDERBUFFER,null)}function k(O,C){if(C&&C.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(e.bindFramebuffer(i.FRAMEBUFFER,O),!(C.depthTexture&&C.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");const st=n.get(C.depthTexture);st.__renderTarget=C,(!st.__webglTexture||C.depthTexture.image.width!==C.width||C.depthTexture.image.height!==C.height)&&(C.depthTexture.image.width=C.width,C.depthTexture.image.height=C.height,C.depthTexture.needsUpdate=!0),F(C.depthTexture,0);const lt=st.__webglTexture,it=vt(C);if(C.depthTexture.format===as)xt(C)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,lt,0,it):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,lt,0);else if(C.depthTexture.format===os)xt(C)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,lt,0,it):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,lt,0);else throw new Error("Unknown depthTexture format")}function X(O){const C=n.get(O),j=O.isWebGLCubeRenderTarget===!0;if(C.__boundDepthTexture!==O.depthTexture){const st=O.depthTexture;if(C.__depthDisposeCallback&&C.__depthDisposeCallback(),st){const lt=()=>{delete C.__boundDepthTexture,delete C.__depthDisposeCallback,st.removeEventListener("dispose",lt)};st.addEventListener("dispose",lt),C.__depthDisposeCallback=lt}C.__boundDepthTexture=st}if(O.depthTexture&&!C.__autoAllocateDepthBuffer){if(j)throw new Error("target.depthTexture not supported in Cube render targets");const st=O.texture.mipmaps;st&&st.length>0?k(C.__webglFramebuffer[0],O):k(C.__webglFramebuffer,O)}else if(j){C.__webglDepthbuffer=[];for(let st=0;st<6;st++)if(e.bindFramebuffer(i.FRAMEBUFFER,C.__webglFramebuffer[st]),C.__webglDepthbuffer[st]===void 0)C.__webglDepthbuffer[st]=i.createRenderbuffer(),B(C.__webglDepthbuffer[st],O,!1);else{const lt=O.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,it=C.__webglDepthbuffer[st];i.bindRenderbuffer(i.RENDERBUFFER,it),i.framebufferRenderbuffer(i.FRAMEBUFFER,lt,i.RENDERBUFFER,it)}}else{const st=O.texture.mipmaps;if(st&&st.length>0?e.bindFramebuffer(i.FRAMEBUFFER,C.__webglFramebuffer[0]):e.bindFramebuffer(i.FRAMEBUFFER,C.__webglFramebuffer),C.__webglDepthbuffer===void 0)C.__webglDepthbuffer=i.createRenderbuffer(),B(C.__webglDepthbuffer,O,!1);else{const lt=O.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,it=C.__webglDepthbuffer;i.bindRenderbuffer(i.RENDERBUFFER,it),i.framebufferRenderbuffer(i.FRAMEBUFFER,lt,i.RENDERBUFFER,it)}}e.bindFramebuffer(i.FRAMEBUFFER,null)}function K(O,C,j){const st=n.get(O);C!==void 0&&N(st.__webglFramebuffer,O,O.texture,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,0),j!==void 0&&X(O)}function P(O){const C=O.texture,j=n.get(O),st=n.get(C);O.addEventListener("dispose",A);const lt=O.textures,it=O.isWebGLCubeRenderTarget===!0,zt=lt.length>1;if(zt||(st.__webglTexture===void 0&&(st.__webglTexture=i.createTexture()),st.__version=C.version,a.memory.textures++),it){j.__webglFramebuffer=[];for(let Mt=0;Mt<6;Mt++)if(C.mipmaps&&C.mipmaps.length>0){j.__webglFramebuffer[Mt]=[];for(let Ot=0;Ot<C.mipmaps.length;Ot++)j.__webglFramebuffer[Mt][Ot]=i.createFramebuffer()}else j.__webglFramebuffer[Mt]=i.createFramebuffer()}else{if(C.mipmaps&&C.mipmaps.length>0){j.__webglFramebuffer=[];for(let Mt=0;Mt<C.mipmaps.length;Mt++)j.__webglFramebuffer[Mt]=i.createFramebuffer()}else j.__webglFramebuffer=i.createFramebuffer();if(zt)for(let Mt=0,Ot=lt.length;Mt<Ot;Mt++){const Bt=n.get(lt[Mt]);Bt.__webglTexture===void 0&&(Bt.__webglTexture=i.createTexture(),a.memory.textures++)}if(O.samples>0&&xt(O)===!1){j.__webglMultisampledFramebuffer=i.createFramebuffer(),j.__webglColorRenderbuffer=[],e.bindFramebuffer(i.FRAMEBUFFER,j.__webglMultisampledFramebuffer);for(let Mt=0;Mt<lt.length;Mt++){const Ot=lt[Mt];j.__webglColorRenderbuffer[Mt]=i.createRenderbuffer(),i.bindRenderbuffer(i.RENDERBUFFER,j.__webglColorRenderbuffer[Mt]);const Bt=s.convert(Ot.format,Ot.colorSpace),pt=s.convert(Ot.type),At=b(Ot.internalFormat,Bt,pt,Ot.colorSpace,O.isXRRenderTarget===!0),qt=vt(O);i.renderbufferStorageMultisample(i.RENDERBUFFER,qt,At,O.width,O.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+Mt,i.RENDERBUFFER,j.__webglColorRenderbuffer[Mt])}i.bindRenderbuffer(i.RENDERBUFFER,null),O.depthBuffer&&(j.__webglDepthRenderbuffer=i.createRenderbuffer(),B(j.__webglDepthRenderbuffer,O,!0)),e.bindFramebuffer(i.FRAMEBUFFER,null)}}if(it){e.bindTexture(i.TEXTURE_CUBE_MAP,st.__webglTexture),gt(i.TEXTURE_CUBE_MAP,C);for(let Mt=0;Mt<6;Mt++)if(C.mipmaps&&C.mipmaps.length>0)for(let Ot=0;Ot<C.mipmaps.length;Ot++)N(j.__webglFramebuffer[Mt][Ot],O,C,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+Mt,Ot);else N(j.__webglFramebuffer[Mt],O,C,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+Mt,0);m(C)&&p(i.TEXTURE_CUBE_MAP),e.unbindTexture()}else if(zt){for(let Mt=0,Ot=lt.length;Mt<Ot;Mt++){const Bt=lt[Mt],pt=n.get(Bt);let At=i.TEXTURE_2D;(O.isWebGL3DRenderTarget||O.isWebGLArrayRenderTarget)&&(At=O.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),e.bindTexture(At,pt.__webglTexture),gt(At,Bt),N(j.__webglFramebuffer,O,Bt,i.COLOR_ATTACHMENT0+Mt,At,0),m(Bt)&&p(At)}e.unbindTexture()}else{let Mt=i.TEXTURE_2D;if((O.isWebGL3DRenderTarget||O.isWebGLArrayRenderTarget)&&(Mt=O.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),e.bindTexture(Mt,st.__webglTexture),gt(Mt,C),C.mipmaps&&C.mipmaps.length>0)for(let Ot=0;Ot<C.mipmaps.length;Ot++)N(j.__webglFramebuffer[Ot],O,C,i.COLOR_ATTACHMENT0,Mt,Ot);else N(j.__webglFramebuffer,O,C,i.COLOR_ATTACHMENT0,Mt,0);m(C)&&p(Mt),e.unbindTexture()}O.depthBuffer&&X(O)}function ht(O){const C=O.textures;for(let j=0,st=C.length;j<st;j++){const lt=C[j];if(m(lt)){const it=S(O),zt=n.get(lt).__webglTexture;e.bindTexture(it,zt),p(it),e.unbindTexture()}}}const at=[],_t=[];function ft(O){if(O.samples>0){if(xt(O)===!1){const C=O.textures,j=O.width,st=O.height;let lt=i.COLOR_BUFFER_BIT;const it=O.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,zt=n.get(O),Mt=C.length>1;if(Mt)for(let Bt=0;Bt<C.length;Bt++)e.bindFramebuffer(i.FRAMEBUFFER,zt.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+Bt,i.RENDERBUFFER,null),e.bindFramebuffer(i.FRAMEBUFFER,zt.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+Bt,i.TEXTURE_2D,null,0);e.bindFramebuffer(i.READ_FRAMEBUFFER,zt.__webglMultisampledFramebuffer);const Ot=O.texture.mipmaps;Ot&&Ot.length>0?e.bindFramebuffer(i.DRAW_FRAMEBUFFER,zt.__webglFramebuffer[0]):e.bindFramebuffer(i.DRAW_FRAMEBUFFER,zt.__webglFramebuffer);for(let Bt=0;Bt<C.length;Bt++){if(O.resolveDepthBuffer&&(O.depthBuffer&&(lt|=i.DEPTH_BUFFER_BIT),O.stencilBuffer&&O.resolveStencilBuffer&&(lt|=i.STENCIL_BUFFER_BIT)),Mt){i.framebufferRenderbuffer(i.READ_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.RENDERBUFFER,zt.__webglColorRenderbuffer[Bt]);const pt=n.get(C[Bt]).__webglTexture;i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,pt,0)}i.blitFramebuffer(0,0,j,st,0,0,j,st,lt,i.NEAREST),c===!0&&(at.length=0,_t.length=0,at.push(i.COLOR_ATTACHMENT0+Bt),O.depthBuffer&&O.resolveDepthBuffer===!1&&(at.push(it),_t.push(it),i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,_t)),i.invalidateFramebuffer(i.READ_FRAMEBUFFER,at))}if(e.bindFramebuffer(i.READ_FRAMEBUFFER,null),e.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),Mt)for(let Bt=0;Bt<C.length;Bt++){e.bindFramebuffer(i.FRAMEBUFFER,zt.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+Bt,i.RENDERBUFFER,zt.__webglColorRenderbuffer[Bt]);const pt=n.get(C[Bt]).__webglTexture;e.bindFramebuffer(i.FRAMEBUFFER,zt.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+Bt,i.TEXTURE_2D,pt,0)}e.bindFramebuffer(i.DRAW_FRAMEBUFFER,zt.__webglMultisampledFramebuffer)}else if(O.depthBuffer&&O.resolveDepthBuffer===!1&&c){const C=O.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,[C])}}}function vt(O){return Math.min(r.maxSamples,O.samples)}function xt(O){const C=n.get(O);return O.samples>0&&t.has("WEBGL_multisampled_render_to_texture")===!0&&C.__useRenderToTexture!==!1}function Ft(O){const C=a.render.frame;h.get(O)!==C&&(h.set(O,C),O.update())}function Se(O,C){const j=O.colorSpace,st=O.format,lt=O.type;return O.isCompressedTexture===!0||O.isVideoTexture===!0||j!==Yi&&j!==kn&&(re.getTransfer(j)===le?(st!==Ve||lt!==Ln)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",j)),C}function ge(O){return typeof HTMLImageElement<"u"&&O instanceof HTMLImageElement?(l.width=O.naturalWidth||O.width,l.height=O.naturalHeight||O.height):typeof VideoFrame<"u"&&O instanceof VideoFrame?(l.width=O.displayWidth,l.height=O.displayHeight):(l.width=O.width,l.height=O.height),l}this.allocateTextureUnit=D,this.resetTextureUnits=w,this.setTexture2D=F,this.setTexture2DArray=H,this.setTexture3D=$,this.setTextureCube=V,this.rebindTextures=K,this.setupRenderTarget=P,this.updateRenderTargetMipmap=ht,this.updateMultisampleRenderTarget=ft,this.setupDepthRenderbuffer=X,this.setupFrameBufferTexture=N,this.useMultisampledRTT=xt}function ov(i,t){function e(n,r=kn){let s;const a=re.getTransfer(r);if(n===Ln)return i.UNSIGNED_BYTE;if(n===mc)return i.UNSIGNED_SHORT_4_4_4_4;if(n===gc)return i.UNSIGNED_SHORT_5_5_5_1;if(n===Zh)return i.UNSIGNED_INT_5_9_9_9_REV;if(n===Kh)return i.UNSIGNED_INT_10F_11F_11F_REV;if(n===$h)return i.BYTE;if(n===jh)return i.SHORT;if(n===rs)return i.UNSIGNED_SHORT;if(n===pc)return i.INT;if(n===qi)return i.UNSIGNED_INT;if(n===zn)return i.FLOAT;if(n===ji)return i.HALF_FLOAT;if(n===Jh)return i.ALPHA;if(n===Qh)return i.RGB;if(n===Ve)return i.RGBA;if(n===as)return i.DEPTH_COMPONENT;if(n===os)return i.DEPTH_STENCIL;if(n===tu)return i.RED;if(n===vc)return i.RED_INTEGER;if(n===eu)return i.RG;if(n===_c)return i.RG_INTEGER;if(n===xc)return i.RGBA_INTEGER;if(n===ea||n===na||n===ia||n===ra)if(a===le)if(s=t.get("WEBGL_compressed_texture_s3tc_srgb"),s!==null){if(n===ea)return s.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===na)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===ia)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===ra)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(s=t.get("WEBGL_compressed_texture_s3tc"),s!==null){if(n===ea)return s.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===na)return s.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===ia)return s.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===ra)return s.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(n===Ro||n===Co||n===Lo||n===Po)if(s=t.get("WEBGL_compressed_texture_pvrtc"),s!==null){if(n===Ro)return s.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===Co)return s.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===Lo)return s.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===Po)return s.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(n===Do||n===Io||n===Uo)if(s=t.get("WEBGL_compressed_texture_etc"),s!==null){if(n===Do||n===Io)return a===le?s.COMPRESSED_SRGB8_ETC2:s.COMPRESSED_RGB8_ETC2;if(n===Uo)return a===le?s.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:s.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(n===No||n===Fo||n===Oo||n===Bo||n===ko||n===zo||n===Ho||n===Vo||n===Go||n===Wo||n===Xo||n===qo||n===Yo||n===$o)if(s=t.get("WEBGL_compressed_texture_astc"),s!==null){if(n===No)return a===le?s.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:s.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===Fo)return a===le?s.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:s.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===Oo)return a===le?s.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:s.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===Bo)return a===le?s.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:s.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===ko)return a===le?s.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:s.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===zo)return a===le?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:s.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===Ho)return a===le?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:s.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===Vo)return a===le?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:s.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===Go)return a===le?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:s.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===Wo)return a===le?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:s.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===Xo)return a===le?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:s.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===qo)return a===le?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:s.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===Yo)return a===le?s.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:s.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===$o)return a===le?s.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:s.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(n===jo||n===Zo||n===Ko)if(s=t.get("EXT_texture_compression_bptc"),s!==null){if(n===jo)return a===le?s.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:s.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===Zo)return s.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===Ko)return s.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(n===Jo||n===Qo||n===tc||n===ec)if(s=t.get("EXT_texture_compression_rgtc"),s!==null){if(n===Jo)return s.COMPRESSED_RED_RGTC1_EXT;if(n===Qo)return s.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===tc)return s.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===ec)return s.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return n===ss?i.UNSIGNED_INT_24_8:i[n]!==void 0?i[n]:null}return{convert:e}}const cv=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,lv=`
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

}`;class hv{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(t,e){if(this.texture===null){const n=new vu(t.texture);(t.depthNear!==e.depthNear||t.depthFar!==e.depthFar)&&(this.depthNear=t.depthNear,this.depthFar=t.depthFar),this.texture=n}}getMesh(t){if(this.texture!==null&&this.mesh===null){const e=t.cameras[0].viewport,n=new He({vertexShader:cv,fragmentShader:lv,uniforms:{depthColor:{value:this.texture},depthWidth:{value:e.z},depthHeight:{value:e.w}}});this.mesh=new Gt(new Ei(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class uv extends Ur{constructor(t,e){super();const n=this;let r=null,s=1,a=null,o="local-floor",c=1,l=null,h=null,u=null,d=null,f=null,g=null;const v=typeof XRWebGLBinding<"u",m=new hv,p={},S=e.getContextAttributes();let b=null,M=null;const E=[],T=[],A=new Rt;let R=null;const _=new vn;_.viewport=new se;const x=new vn;x.viewport=new se;const y=[_,x],w=new D0;let D=null,I=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(W){let Z=E[W];return Z===void 0&&(Z=new Va,E[W]=Z),Z.getTargetRaySpace()},this.getControllerGrip=function(W){let Z=E[W];return Z===void 0&&(Z=new Va,E[W]=Z),Z.getGripSpace()},this.getHand=function(W){let Z=E[W];return Z===void 0&&(Z=new Va,E[W]=Z),Z.getHandSpace()};function F(W){const Z=T.indexOf(W.inputSource);if(Z===-1)return;const N=E[Z];N!==void 0&&(N.update(W.inputSource,W.frame,l||a),N.dispatchEvent({type:W.type,data:W.inputSource}))}function H(){r.removeEventListener("select",F),r.removeEventListener("selectstart",F),r.removeEventListener("selectend",F),r.removeEventListener("squeeze",F),r.removeEventListener("squeezestart",F),r.removeEventListener("squeezeend",F),r.removeEventListener("end",H),r.removeEventListener("inputsourceschange",$);for(let W=0;W<E.length;W++){const Z=T[W];Z!==null&&(T[W]=null,E[W].disconnect(Z))}D=null,I=null,m.reset();for(const W in p)delete p[W];t.setRenderTarget(b),f=null,d=null,u=null,r=null,M=null,et.stop(),n.isPresenting=!1,t.setPixelRatio(R),t.setSize(A.width,A.height,!1),n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(W){s=W,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(W){o=W,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return l||a},this.setReferenceSpace=function(W){l=W},this.getBaseLayer=function(){return d!==null?d:f},this.getBinding=function(){return u===null&&v&&(u=new XRWebGLBinding(r,e)),u},this.getFrame=function(){return g},this.getSession=function(){return r},this.setSession=async function(W){if(r=W,r!==null){if(b=t.getRenderTarget(),r.addEventListener("select",F),r.addEventListener("selectstart",F),r.addEventListener("selectend",F),r.addEventListener("squeeze",F),r.addEventListener("squeezestart",F),r.addEventListener("squeezeend",F),r.addEventListener("end",H),r.addEventListener("inputsourceschange",$),S.xrCompatible!==!0&&await e.makeXRCompatible(),R=t.getPixelRatio(),t.getSize(A),v&&"createProjectionLayer"in XRWebGLBinding.prototype){let N=null,B=null,k=null;S.depth&&(k=S.stencil?e.DEPTH24_STENCIL8:e.DEPTH_COMPONENT24,N=S.stencil?os:as,B=S.stencil?ss:qi);const X={colorFormat:e.RGBA8,depthFormat:k,scaleFactor:s};u=this.getBinding(),d=u.createProjectionLayer(X),r.updateRenderState({layers:[d]}),t.setPixelRatio(1),t.setSize(d.textureWidth,d.textureHeight,!1),M=new Ye(d.textureWidth,d.textureHeight,{format:Ve,type:Ln,depthTexture:new gu(d.textureWidth,d.textureHeight,B,void 0,void 0,void 0,void 0,void 0,void 0,N),stencilBuffer:S.stencil,colorSpace:t.outputColorSpace,samples:S.antialias?4:0,resolveDepthBuffer:d.ignoreDepthValues===!1,resolveStencilBuffer:d.ignoreDepthValues===!1})}else{const N={antialias:S.antialias,alpha:!0,depth:S.depth,stencil:S.stencil,framebufferScaleFactor:s};f=new XRWebGLLayer(r,e,N),r.updateRenderState({baseLayer:f}),t.setPixelRatio(1),t.setSize(f.framebufferWidth,f.framebufferHeight,!1),M=new Ye(f.framebufferWidth,f.framebufferHeight,{format:Ve,type:Ln,colorSpace:t.outputColorSpace,stencilBuffer:S.stencil,resolveDepthBuffer:f.ignoreDepthValues===!1,resolveStencilBuffer:f.ignoreDepthValues===!1})}M.isXRRenderTarget=!0,this.setFoveation(c),l=null,a=await r.requestReferenceSpace(o),et.setContext(r),et.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(r!==null)return r.environmentBlendMode},this.getDepthTexture=function(){return m.getDepthTexture()};function $(W){for(let Z=0;Z<W.removed.length;Z++){const N=W.removed[Z],B=T.indexOf(N);B>=0&&(T[B]=null,E[B].disconnect(N))}for(let Z=0;Z<W.added.length;Z++){const N=W.added[Z];let B=T.indexOf(N);if(B===-1){for(let X=0;X<E.length;X++)if(X>=T.length){T.push(N),B=X;break}else if(T[X]===null){T[X]=N,B=X;break}if(B===-1)break}const k=E[B];k&&k.connect(N)}}const V=new U,Q=new U;function rt(W,Z,N){V.setFromMatrixPosition(Z.matrixWorld),Q.setFromMatrixPosition(N.matrixWorld);const B=V.distanceTo(Q),k=Z.projectionMatrix.elements,X=N.projectionMatrix.elements,K=k[14]/(k[10]-1),P=k[14]/(k[10]+1),ht=(k[9]+1)/k[5],at=(k[9]-1)/k[5],_t=(k[8]-1)/k[0],ft=(X[8]+1)/X[0],vt=K*_t,xt=K*ft,Ft=B/(-_t+ft),Se=Ft*-_t;if(Z.matrixWorld.decompose(W.position,W.quaternion,W.scale),W.translateX(Se),W.translateZ(Ft),W.matrixWorld.compose(W.position,W.quaternion,W.scale),W.matrixWorldInverse.copy(W.matrixWorld).invert(),k[10]===-1)W.projectionMatrix.copy(Z.projectionMatrix),W.projectionMatrixInverse.copy(Z.projectionMatrixInverse);else{const ge=K+Ft,O=P+Ft,C=vt-Se,j=xt+(B-Se),st=ht*P/O*ge,lt=at*P/O*ge;W.projectionMatrix.makePerspective(C,j,st,lt,ge,O),W.projectionMatrixInverse.copy(W.projectionMatrix).invert()}}function ct(W,Z){Z===null?W.matrixWorld.copy(W.matrix):W.matrixWorld.multiplyMatrices(Z.matrixWorld,W.matrix),W.matrixWorldInverse.copy(W.matrixWorld).invert()}this.updateCamera=function(W){if(r===null)return;let Z=W.near,N=W.far;m.texture!==null&&(m.depthNear>0&&(Z=m.depthNear),m.depthFar>0&&(N=m.depthFar)),w.near=x.near=_.near=Z,w.far=x.far=_.far=N,(D!==w.near||I!==w.far)&&(r.updateRenderState({depthNear:w.near,depthFar:w.far}),D=w.near,I=w.far),w.layers.mask=W.layers.mask|6,_.layers.mask=w.layers.mask&3,x.layers.mask=w.layers.mask&5;const B=W.parent,k=w.cameras;ct(w,B);for(let X=0;X<k.length;X++)ct(k[X],B);k.length===2?rt(w,_,x):w.projectionMatrix.copy(_.projectionMatrix),gt(W,w,B)};function gt(W,Z,N){N===null?W.matrix.copy(Z.matrixWorld):(W.matrix.copy(N.matrixWorld),W.matrix.invert(),W.matrix.multiply(Z.matrixWorld)),W.matrix.decompose(W.position,W.quaternion,W.scale),W.updateMatrixWorld(!0),W.projectionMatrix.copy(Z.projectionMatrix),W.projectionMatrixInverse.copy(Z.projectionMatrixInverse),W.isPerspectiveCamera&&(W.fov=cs*2*Math.atan(1/W.projectionMatrix.elements[5]),W.zoom=1)}this.getCamera=function(){return w},this.getFoveation=function(){if(!(d===null&&f===null))return c},this.setFoveation=function(W){c=W,d!==null&&(d.fixedFoveation=W),f!==null&&f.fixedFoveation!==void 0&&(f.fixedFoveation=W)},this.hasDepthSensing=function(){return m.texture!==null},this.getDepthSensingMesh=function(){return m.getMesh(w)},this.getCameraTexture=function(W){return p[W]};let Ct=null;function Nt(W,Z){if(h=Z.getViewerPose(l||a),g=Z,h!==null){const N=h.views;f!==null&&(t.setRenderTargetFramebuffer(M,f.framebuffer),t.setRenderTarget(M));let B=!1;N.length!==w.cameras.length&&(w.cameras.length=0,B=!0);for(let P=0;P<N.length;P++){const ht=N[P];let at=null;if(f!==null)at=f.getViewport(ht);else{const ft=u.getViewSubImage(d,ht);at=ft.viewport,P===0&&(t.setRenderTargetTextures(M,ft.colorTexture,ft.depthStencilTexture),t.setRenderTarget(M))}let _t=y[P];_t===void 0&&(_t=new vn,_t.layers.enable(P),_t.viewport=new se,y[P]=_t),_t.matrix.fromArray(ht.transform.matrix),_t.matrix.decompose(_t.position,_t.quaternion,_t.scale),_t.projectionMatrix.fromArray(ht.projectionMatrix),_t.projectionMatrixInverse.copy(_t.projectionMatrix).invert(),_t.viewport.set(at.x,at.y,at.width,at.height),P===0&&(w.matrix.copy(_t.matrix),w.matrix.decompose(w.position,w.quaternion,w.scale)),B===!0&&w.cameras.push(_t)}const k=r.enabledFeatures;if(k&&k.includes("depth-sensing")&&r.depthUsage=="gpu-optimized"&&v){u=n.getBinding();const P=u.getDepthInformation(N[0]);P&&P.isValid&&P.texture&&m.init(P,r.renderState)}if(k&&k.includes("camera-access")&&v){t.state.unbindTexture(),u=n.getBinding();for(let P=0;P<N.length;P++){const ht=N[P].camera;if(ht){let at=p[ht];at||(at=new vu,p[ht]=at);const _t=u.getCameraImage(ht);at.sourceTexture=_t}}}}for(let N=0;N<E.length;N++){const B=T[N],k=E[N];B!==null&&k!==void 0&&k.update(B,Z,l||a)}Ct&&Ct(W,Z),Z.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:Z}),g=null}const et=new bu;et.setAnimationLoop(Nt),this.setAnimationLoop=function(W){Ct=W},this.dispose=function(){}}}const Ii=new _n,fv=new ne;function dv(i,t){function e(m,p){m.matrixAutoUpdate===!0&&m.updateMatrix(),p.value.copy(m.matrix)}function n(m,p){p.color.getRGB(m.fogColor.value,hu(i)),p.isFog?(m.fogNear.value=p.near,m.fogFar.value=p.far):p.isFogExp2&&(m.fogDensity.value=p.density)}function r(m,p,S,b,M){p.isMeshBasicMaterial||p.isMeshLambertMaterial?s(m,p):p.isMeshToonMaterial?(s(m,p),u(m,p)):p.isMeshPhongMaterial?(s(m,p),h(m,p)):p.isMeshStandardMaterial?(s(m,p),d(m,p),p.isMeshPhysicalMaterial&&f(m,p,M)):p.isMeshMatcapMaterial?(s(m,p),g(m,p)):p.isMeshDepthMaterial?s(m,p):p.isMeshDistanceMaterial?(s(m,p),v(m,p)):p.isMeshNormalMaterial?s(m,p):p.isLineBasicMaterial?(a(m,p),p.isLineDashedMaterial&&o(m,p)):p.isPointsMaterial?c(m,p,S,b):p.isSpriteMaterial?l(m,p):p.isShadowMaterial?(m.color.value.copy(p.color),m.opacity.value=p.opacity):p.isShaderMaterial&&(p.uniformsNeedUpdate=!1)}function s(m,p){m.opacity.value=p.opacity,p.color&&m.diffuse.value.copy(p.color),p.emissive&&m.emissive.value.copy(p.emissive).multiplyScalar(p.emissiveIntensity),p.map&&(m.map.value=p.map,e(p.map,m.mapTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,e(p.alphaMap,m.alphaMapTransform)),p.bumpMap&&(m.bumpMap.value=p.bumpMap,e(p.bumpMap,m.bumpMapTransform),m.bumpScale.value=p.bumpScale,p.side===Je&&(m.bumpScale.value*=-1)),p.normalMap&&(m.normalMap.value=p.normalMap,e(p.normalMap,m.normalMapTransform),m.normalScale.value.copy(p.normalScale),p.side===Je&&m.normalScale.value.negate()),p.displacementMap&&(m.displacementMap.value=p.displacementMap,e(p.displacementMap,m.displacementMapTransform),m.displacementScale.value=p.displacementScale,m.displacementBias.value=p.displacementBias),p.emissiveMap&&(m.emissiveMap.value=p.emissiveMap,e(p.emissiveMap,m.emissiveMapTransform)),p.specularMap&&(m.specularMap.value=p.specularMap,e(p.specularMap,m.specularMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest);const S=t.get(p),b=S.envMap,M=S.envMapRotation;b&&(m.envMap.value=b,Ii.copy(M),Ii.x*=-1,Ii.y*=-1,Ii.z*=-1,b.isCubeTexture&&b.isRenderTargetTexture===!1&&(Ii.y*=-1,Ii.z*=-1),m.envMapRotation.value.setFromMatrix4(fv.makeRotationFromEuler(Ii)),m.flipEnvMap.value=b.isCubeTexture&&b.isRenderTargetTexture===!1?-1:1,m.reflectivity.value=p.reflectivity,m.ior.value=p.ior,m.refractionRatio.value=p.refractionRatio),p.lightMap&&(m.lightMap.value=p.lightMap,m.lightMapIntensity.value=p.lightMapIntensity,e(p.lightMap,m.lightMapTransform)),p.aoMap&&(m.aoMap.value=p.aoMap,m.aoMapIntensity.value=p.aoMapIntensity,e(p.aoMap,m.aoMapTransform))}function a(m,p){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,p.map&&(m.map.value=p.map,e(p.map,m.mapTransform))}function o(m,p){m.dashSize.value=p.dashSize,m.totalSize.value=p.dashSize+p.gapSize,m.scale.value=p.scale}function c(m,p,S,b){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,m.size.value=p.size*S,m.scale.value=b*.5,p.map&&(m.map.value=p.map,e(p.map,m.uvTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,e(p.alphaMap,m.alphaMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest)}function l(m,p){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,m.rotation.value=p.rotation,p.map&&(m.map.value=p.map,e(p.map,m.mapTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,e(p.alphaMap,m.alphaMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest)}function h(m,p){m.specular.value.copy(p.specular),m.shininess.value=Math.max(p.shininess,1e-4)}function u(m,p){p.gradientMap&&(m.gradientMap.value=p.gradientMap)}function d(m,p){m.metalness.value=p.metalness,p.metalnessMap&&(m.metalnessMap.value=p.metalnessMap,e(p.metalnessMap,m.metalnessMapTransform)),m.roughness.value=p.roughness,p.roughnessMap&&(m.roughnessMap.value=p.roughnessMap,e(p.roughnessMap,m.roughnessMapTransform)),p.envMap&&(m.envMapIntensity.value=p.envMapIntensity)}function f(m,p,S){m.ior.value=p.ior,p.sheen>0&&(m.sheenColor.value.copy(p.sheenColor).multiplyScalar(p.sheen),m.sheenRoughness.value=p.sheenRoughness,p.sheenColorMap&&(m.sheenColorMap.value=p.sheenColorMap,e(p.sheenColorMap,m.sheenColorMapTransform)),p.sheenRoughnessMap&&(m.sheenRoughnessMap.value=p.sheenRoughnessMap,e(p.sheenRoughnessMap,m.sheenRoughnessMapTransform))),p.clearcoat>0&&(m.clearcoat.value=p.clearcoat,m.clearcoatRoughness.value=p.clearcoatRoughness,p.clearcoatMap&&(m.clearcoatMap.value=p.clearcoatMap,e(p.clearcoatMap,m.clearcoatMapTransform)),p.clearcoatRoughnessMap&&(m.clearcoatRoughnessMap.value=p.clearcoatRoughnessMap,e(p.clearcoatRoughnessMap,m.clearcoatRoughnessMapTransform)),p.clearcoatNormalMap&&(m.clearcoatNormalMap.value=p.clearcoatNormalMap,e(p.clearcoatNormalMap,m.clearcoatNormalMapTransform),m.clearcoatNormalScale.value.copy(p.clearcoatNormalScale),p.side===Je&&m.clearcoatNormalScale.value.negate())),p.dispersion>0&&(m.dispersion.value=p.dispersion),p.iridescence>0&&(m.iridescence.value=p.iridescence,m.iridescenceIOR.value=p.iridescenceIOR,m.iridescenceThicknessMinimum.value=p.iridescenceThicknessRange[0],m.iridescenceThicknessMaximum.value=p.iridescenceThicknessRange[1],p.iridescenceMap&&(m.iridescenceMap.value=p.iridescenceMap,e(p.iridescenceMap,m.iridescenceMapTransform)),p.iridescenceThicknessMap&&(m.iridescenceThicknessMap.value=p.iridescenceThicknessMap,e(p.iridescenceThicknessMap,m.iridescenceThicknessMapTransform))),p.transmission>0&&(m.transmission.value=p.transmission,m.transmissionSamplerMap.value=S.texture,m.transmissionSamplerSize.value.set(S.width,S.height),p.transmissionMap&&(m.transmissionMap.value=p.transmissionMap,e(p.transmissionMap,m.transmissionMapTransform)),m.thickness.value=p.thickness,p.thicknessMap&&(m.thicknessMap.value=p.thicknessMap,e(p.thicknessMap,m.thicknessMapTransform)),m.attenuationDistance.value=p.attenuationDistance,m.attenuationColor.value.copy(p.attenuationColor)),p.anisotropy>0&&(m.anisotropyVector.value.set(p.anisotropy*Math.cos(p.anisotropyRotation),p.anisotropy*Math.sin(p.anisotropyRotation)),p.anisotropyMap&&(m.anisotropyMap.value=p.anisotropyMap,e(p.anisotropyMap,m.anisotropyMapTransform))),m.specularIntensity.value=p.specularIntensity,m.specularColor.value.copy(p.specularColor),p.specularColorMap&&(m.specularColorMap.value=p.specularColorMap,e(p.specularColorMap,m.specularColorMapTransform)),p.specularIntensityMap&&(m.specularIntensityMap.value=p.specularIntensityMap,e(p.specularIntensityMap,m.specularIntensityMapTransform))}function g(m,p){p.matcap&&(m.matcap.value=p.matcap)}function v(m,p){const S=t.get(p).light;m.referencePosition.value.setFromMatrixPosition(S.matrixWorld),m.nearDistance.value=S.shadow.camera.near,m.farDistance.value=S.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:r}}function pv(i,t,e,n){let r={},s={},a=[];const o=i.getParameter(i.MAX_UNIFORM_BUFFER_BINDINGS);function c(S,b){const M=b.program;n.uniformBlockBinding(S,M)}function l(S,b){let M=r[S.id];M===void 0&&(g(S),M=h(S),r[S.id]=M,S.addEventListener("dispose",m));const E=b.program;n.updateUBOMapping(S,E);const T=t.render.frame;s[S.id]!==T&&(d(S),s[S.id]=T)}function h(S){const b=u();S.__bindingPointIndex=b;const M=i.createBuffer(),E=S.__size,T=S.usage;return i.bindBuffer(i.UNIFORM_BUFFER,M),i.bufferData(i.UNIFORM_BUFFER,E,T),i.bindBuffer(i.UNIFORM_BUFFER,null),i.bindBufferBase(i.UNIFORM_BUFFER,b,M),M}function u(){for(let S=0;S<o;S++)if(a.indexOf(S)===-1)return a.push(S),S;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function d(S){const b=r[S.id],M=S.uniforms,E=S.__cache;i.bindBuffer(i.UNIFORM_BUFFER,b);for(let T=0,A=M.length;T<A;T++){const R=Array.isArray(M[T])?M[T]:[M[T]];for(let _=0,x=R.length;_<x;_++){const y=R[_];if(f(y,T,_,E)===!0){const w=y.__offset,D=Array.isArray(y.value)?y.value:[y.value];let I=0;for(let F=0;F<D.length;F++){const H=D[F],$=v(H);typeof H=="number"||typeof H=="boolean"?(y.__data[0]=H,i.bufferSubData(i.UNIFORM_BUFFER,w+I,y.__data)):H.isMatrix3?(y.__data[0]=H.elements[0],y.__data[1]=H.elements[1],y.__data[2]=H.elements[2],y.__data[3]=0,y.__data[4]=H.elements[3],y.__data[5]=H.elements[4],y.__data[6]=H.elements[5],y.__data[7]=0,y.__data[8]=H.elements[6],y.__data[9]=H.elements[7],y.__data[10]=H.elements[8],y.__data[11]=0):(H.toArray(y.__data,I),I+=$.storage/Float32Array.BYTES_PER_ELEMENT)}i.bufferSubData(i.UNIFORM_BUFFER,w,y.__data)}}}i.bindBuffer(i.UNIFORM_BUFFER,null)}function f(S,b,M,E){const T=S.value,A=b+"_"+M;if(E[A]===void 0)return typeof T=="number"||typeof T=="boolean"?E[A]=T:E[A]=T.clone(),!0;{const R=E[A];if(typeof T=="number"||typeof T=="boolean"){if(R!==T)return E[A]=T,!0}else if(R.equals(T)===!1)return R.copy(T),!0}return!1}function g(S){const b=S.uniforms;let M=0;const E=16;for(let A=0,R=b.length;A<R;A++){const _=Array.isArray(b[A])?b[A]:[b[A]];for(let x=0,y=_.length;x<y;x++){const w=_[x],D=Array.isArray(w.value)?w.value:[w.value];for(let I=0,F=D.length;I<F;I++){const H=D[I],$=v(H),V=M%E,Q=V%$.boundary,rt=V+Q;M+=Q,rt!==0&&E-rt<$.storage&&(M+=E-rt),w.__data=new Float32Array($.storage/Float32Array.BYTES_PER_ELEMENT),w.__offset=M,M+=$.storage}}}const T=M%E;return T>0&&(M+=E-T),S.__size=M,S.__cache={},this}function v(S){const b={boundary:0,storage:0};return typeof S=="number"||typeof S=="boolean"?(b.boundary=4,b.storage=4):S.isVector2?(b.boundary=8,b.storage=8):S.isVector3||S.isColor?(b.boundary=16,b.storage=12):S.isVector4?(b.boundary=16,b.storage=16):S.isMatrix3?(b.boundary=48,b.storage=48):S.isMatrix4?(b.boundary=64,b.storage=64):S.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",S),b}function m(S){const b=S.target;b.removeEventListener("dispose",m);const M=a.indexOf(b.__bindingPointIndex);a.splice(M,1),i.deleteBuffer(r[b.id]),delete r[b.id],delete s[b.id]}function p(){for(const S in r)i.deleteBuffer(r[S]);a=[],r={},s={}}return{bind:c,update:l,dispose:p}}class mv{constructor(t={}){const{canvas:e=Ld(),context:n=null,depth:r=!0,stencil:s=!1,alpha:a=!1,antialias:o=!1,premultipliedAlpha:c=!0,preserveDrawingBuffer:l=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:u=!1,reversedDepthBuffer:d=!1}=t;this.isWebGLRenderer=!0;let f;if(n!==null){if(typeof WebGLRenderingContext<"u"&&n instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");f=n.getContextAttributes().alpha}else f=a;const g=new Uint32Array(4),v=new Int32Array(4);let m=null,p=null;const S=[],b=[];this.domElement=e,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=bi,this.toneMappingExposure=1,this.transmissionResolutionScale=1;const M=this;let E=!1;this._outputColorSpace=on;let T=0,A=0,R=null,_=-1,x=null;const y=new se,w=new se;let D=null;const I=new Ht(0);let F=0,H=e.width,$=e.height,V=1,Q=null,rt=null;const ct=new se(0,0,H,$),gt=new se(0,0,H,$);let Ct=!1;const Nt=new Ec;let et=!1,W=!1;const Z=new ne,N=new U,B=new se,k={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let X=!1;function K(){return R===null?V:1}let P=n;function ht(L,q){return e.getContext(L,q)}try{const L={alpha:!0,depth:r,stencil:s,antialias:o,premultipliedAlpha:c,preserveDrawingBuffer:l,powerPreference:h,failIfMajorPerformanceCaveat:u};if("setAttribute"in e&&e.setAttribute("data-engine",`three.js r${dc}`),e.addEventListener("webglcontextlost",bt,!1),e.addEventListener("webglcontextrestored",Pt,!1),e.addEventListener("webglcontextcreationerror",ut,!1),P===null){const q="webgl2";if(P=ht(q,L),P===null)throw ht(q)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(L){throw console.error("THREE.WebGLRenderer: "+L.message),L}let at,_t,ft,vt,xt,Ft,Se,ge,O,C,j,st,lt,it,zt,Mt,Ot,Bt,pt,At,qt,kt,wt,jt;function G(){at=new wm(P),at.init(),kt=new ov(P,at),_t=new _m(P,at,t,kt),ft=new sv(P,at),_t.reversedDepthBuffer&&d&&ft.buffers.depth.setReversed(!0),vt=new Rm(P),xt=new qg,Ft=new av(P,at,ft,xt,_t,kt,vt),Se=new Mm(M),ge=new Em(M),O=new U0(P),wt=new gm(P,O),C=new Tm(P,O,vt,wt),j=new Lm(P,C,O,vt),pt=new Cm(P,_t,Ft),Mt=new xm(xt),st=new Xg(M,Se,ge,at,_t,wt,Mt),lt=new dv(M,xt),it=new $g,zt=new tv(at),Bt=new mm(M,Se,ge,ft,j,f,c),Ot=new iv(M,j,_t),jt=new pv(P,vt,_t,ft),At=new vm(P,at,vt),qt=new Am(P,at,vt),vt.programs=st.programs,M.capabilities=_t,M.extensions=at,M.properties=xt,M.renderLists=it,M.shadowMap=Ot,M.state=ft,M.info=vt}G();const mt=new uv(M,P);this.xr=mt,this.getContext=function(){return P},this.getContextAttributes=function(){return P.getContextAttributes()},this.forceContextLoss=function(){const L=at.get("WEBGL_lose_context");L&&L.loseContext()},this.forceContextRestore=function(){const L=at.get("WEBGL_lose_context");L&&L.restoreContext()},this.getPixelRatio=function(){return V},this.setPixelRatio=function(L){L!==void 0&&(V=L,this.setSize(H,$,!1))},this.getSize=function(L){return L.set(H,$)},this.setSize=function(L,q,J=!0){if(mt.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}H=L,$=q,e.width=Math.floor(L*V),e.height=Math.floor(q*V),J===!0&&(e.style.width=L+"px",e.style.height=q+"px"),this.setViewport(0,0,L,q)},this.getDrawingBufferSize=function(L){return L.set(H*V,$*V).floor()},this.setDrawingBufferSize=function(L,q,J){H=L,$=q,V=J,e.width=Math.floor(L*J),e.height=Math.floor(q*J),this.setViewport(0,0,L,q)},this.getCurrentViewport=function(L){return L.copy(y)},this.getViewport=function(L){return L.copy(ct)},this.setViewport=function(L,q,J,tt){L.isVector4?ct.set(L.x,L.y,L.z,L.w):ct.set(L,q,J,tt),ft.viewport(y.copy(ct).multiplyScalar(V).round())},this.getScissor=function(L){return L.copy(gt)},this.setScissor=function(L,q,J,tt){L.isVector4?gt.set(L.x,L.y,L.z,L.w):gt.set(L,q,J,tt),ft.scissor(w.copy(gt).multiplyScalar(V).round())},this.getScissorTest=function(){return Ct},this.setScissorTest=function(L){ft.setScissorTest(Ct=L)},this.setOpaqueSort=function(L){Q=L},this.setTransparentSort=function(L){rt=L},this.getClearColor=function(L){return L.copy(Bt.getClearColor())},this.setClearColor=function(){Bt.setClearColor(...arguments)},this.getClearAlpha=function(){return Bt.getClearAlpha()},this.setClearAlpha=function(){Bt.setClearAlpha(...arguments)},this.clear=function(L=!0,q=!0,J=!0){let tt=0;if(L){let Y=!1;if(R!==null){const dt=R.texture.format;Y=dt===xc||dt===_c||dt===vc}if(Y){const dt=R.texture.type,Tt=dt===Ln||dt===qi||dt===rs||dt===ss||dt===mc||dt===gc,Dt=Bt.getClearColor(),Lt=Bt.getClearAlpha(),Xt=Dt.r,Yt=Dt.g,Vt=Dt.b;Tt?(g[0]=Xt,g[1]=Yt,g[2]=Vt,g[3]=Lt,P.clearBufferuiv(P.COLOR,0,g)):(v[0]=Xt,v[1]=Yt,v[2]=Vt,v[3]=Lt,P.clearBufferiv(P.COLOR,0,v))}else tt|=P.COLOR_BUFFER_BIT}q&&(tt|=P.DEPTH_BUFFER_BIT),J&&(tt|=P.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),P.clear(tt)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){e.removeEventListener("webglcontextlost",bt,!1),e.removeEventListener("webglcontextrestored",Pt,!1),e.removeEventListener("webglcontextcreationerror",ut,!1),Bt.dispose(),it.dispose(),zt.dispose(),xt.dispose(),Se.dispose(),ge.dispose(),j.dispose(),wt.dispose(),jt.dispose(),st.dispose(),mt.dispose(),mt.removeEventListener("sessionstart",Dn),mt.removeEventListener("sessionend",Vc),wi.stop()};function bt(L){L.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),E=!0}function Pt(){console.log("THREE.WebGLRenderer: Context Restored."),E=!1;const L=vt.autoReset,q=Ot.enabled,J=Ot.autoUpdate,tt=Ot.needsUpdate,Y=Ot.type;G(),vt.autoReset=L,Ot.enabled=q,Ot.autoUpdate=J,Ot.needsUpdate=tt,Ot.type=Y}function ut(L){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",L.statusMessage)}function ot(L){const q=L.target;q.removeEventListener("dispose",ot),It(q)}function It(L){$t(L),xt.remove(L)}function $t(L){const q=xt.get(L).programs;q!==void 0&&(q.forEach(function(J){st.releaseProgram(J)}),L.isShaderMaterial&&st.releaseShaderCache(L))}this.renderBufferDirect=function(L,q,J,tt,Y,dt){q===null&&(q=k);const Tt=Y.isMesh&&Y.matrixWorld.determinant()<0,Dt=hf(L,q,J,tt,Y);ft.setMaterial(tt,Tt);let Lt=J.index,Xt=1;if(tt.wireframe===!0){if(Lt=C.getWireframeAttribute(J),Lt===void 0)return;Xt=2}const Yt=J.drawRange,Vt=J.attributes.position;let ee=Yt.start*Xt,ce=(Yt.start+Yt.count)*Xt;dt!==null&&(ee=Math.max(ee,dt.start*Xt),ce=Math.min(ce,(dt.start+dt.count)*Xt)),Lt!==null?(ee=Math.max(ee,0),ce=Math.min(ce,Lt.count)):Vt!=null&&(ee=Math.max(ee,0),ce=Math.min(ce,Vt.count));const ye=ce-ee;if(ye<0||ye===1/0)return;wt.setup(Y,tt,Dt,J,Lt);let me,ue=At;if(Lt!==null&&(me=O.get(Lt),ue=qt,ue.setIndex(me)),Y.isMesh)tt.wireframe===!0?(ft.setLineWidth(tt.wireframeLinewidth*K()),ue.setMode(P.LINES)):ue.setMode(P.TRIANGLES);else if(Y.isLine){let Wt=tt.linewidth;Wt===void 0&&(Wt=1),ft.setLineWidth(Wt*K()),Y.isLineSegments?ue.setMode(P.LINES):Y.isLineLoop?ue.setMode(P.LINE_LOOP):ue.setMode(P.LINE_STRIP)}else Y.isPoints?ue.setMode(P.POINTS):Y.isSprite&&ue.setMode(P.TRIANGLES);if(Y.isBatchedMesh)if(Y._multiDrawInstances!==null)ls("THREE.WebGLRenderer: renderMultiDrawInstances has been deprecated and will be removed in r184. Append to renderMultiDraw arguments and use indirection."),ue.renderMultiDrawInstances(Y._multiDrawStarts,Y._multiDrawCounts,Y._multiDrawCount,Y._multiDrawInstances);else if(at.get("WEBGL_multi_draw"))ue.renderMultiDraw(Y._multiDrawStarts,Y._multiDrawCounts,Y._multiDrawCount);else{const Wt=Y._multiDrawStarts,xe=Y._multiDrawCounts,ie=Y._multiDrawCount,tn=Lt?O.get(Lt).bytesPerElement:1,Qi=xt.get(tt).currentProgram.getUniforms();for(let en=0;en<ie;en++)Qi.setValue(P,"_gl_DrawID",en),ue.render(Wt[en]/tn,xe[en])}else if(Y.isInstancedMesh)ue.renderInstances(ee,ye,Y.count);else if(J.isInstancedBufferGeometry){const Wt=J._maxInstanceCount!==void 0?J._maxInstanceCount:1/0,xe=Math.min(J.instanceCount,Wt);ue.renderInstances(ee,ye,xe)}else ue.render(ee,ye)};function fe(L,q,J){L.transparent===!0&&L.side===wn&&L.forceSinglePass===!1?(L.side=Je,L.needsUpdate=!0,_s(L,q,J),L.side=Si,L.needsUpdate=!0,_s(L,q,J),L.side=wn):_s(L,q,J)}this.compile=function(L,q,J=null){J===null&&(J=L),p=zt.get(J),p.init(q),b.push(p),J.traverseVisible(function(Y){Y.isLight&&Y.layers.test(q.layers)&&(p.pushLight(Y),Y.castShadow&&p.pushShadow(Y))}),L!==J&&L.traverseVisible(function(Y){Y.isLight&&Y.layers.test(q.layers)&&(p.pushLight(Y),Y.castShadow&&p.pushShadow(Y))}),p.setupLights();const tt=new Set;return L.traverse(function(Y){if(!(Y.isMesh||Y.isPoints||Y.isLine||Y.isSprite))return;const dt=Y.material;if(dt)if(Array.isArray(dt))for(let Tt=0;Tt<dt.length;Tt++){const Dt=dt[Tt];fe(Dt,J,Y),tt.add(Dt)}else fe(dt,J,Y),tt.add(dt)}),p=b.pop(),tt},this.compileAsync=function(L,q,J=null){const tt=this.compile(L,q,J);return new Promise(Y=>{function dt(){if(tt.forEach(function(Tt){xt.get(Tt).currentProgram.isReady()&&tt.delete(Tt)}),tt.size===0){Y(L);return}setTimeout(dt,10)}at.get("KHR_parallel_shader_compile")!==null?dt():setTimeout(dt,10)})};let ae=null;function Gn(L){ae&&ae(L)}function Dn(){wi.stop()}function Vc(){wi.start()}const wi=new bu;wi.setAnimationLoop(Gn),typeof self<"u"&&wi.setContext(self),this.setAnimationLoop=function(L){ae=L,mt.setAnimationLoop(L),L===null?wi.stop():wi.start()},mt.addEventListener("sessionstart",Dn),mt.addEventListener("sessionend",Vc),this.render=function(L,q){if(q!==void 0&&q.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(E===!0)return;if(L.matrixWorldAutoUpdate===!0&&L.updateMatrixWorld(),q.parent===null&&q.matrixWorldAutoUpdate===!0&&q.updateMatrixWorld(),mt.enabled===!0&&mt.isPresenting===!0&&(mt.cameraAutoUpdate===!0&&mt.updateCamera(q),q=mt.getCamera()),L.isScene===!0&&L.onBeforeRender(M,L,q,R),p=zt.get(L,b.length),p.init(q),b.push(p),Z.multiplyMatrices(q.projectionMatrix,q.matrixWorldInverse),Nt.setFromProjectionMatrix(Z,Hn,q.reversedDepth),W=this.localClippingEnabled,et=Mt.init(this.clippingPlanes,W),m=it.get(L,S.length),m.init(),S.push(m),mt.enabled===!0&&mt.isPresenting===!0){const dt=M.xr.getDepthSensingMesh();dt!==null&&xa(dt,q,-1/0,M.sortObjects)}xa(L,q,0,M.sortObjects),m.finish(),M.sortObjects===!0&&m.sort(Q,rt),X=mt.enabled===!1||mt.isPresenting===!1||mt.hasDepthSensing()===!1,X&&Bt.addToRenderList(m,L),this.info.render.frame++,et===!0&&Mt.beginShadows();const J=p.state.shadowsArray;Ot.render(J,L,q),et===!0&&Mt.endShadows(),this.info.autoReset===!0&&this.info.reset();const tt=m.opaque,Y=m.transmissive;if(p.setupLights(),q.isArrayCamera){const dt=q.cameras;if(Y.length>0)for(let Tt=0,Dt=dt.length;Tt<Dt;Tt++){const Lt=dt[Tt];Wc(tt,Y,L,Lt)}X&&Bt.render(L);for(let Tt=0,Dt=dt.length;Tt<Dt;Tt++){const Lt=dt[Tt];Gc(m,L,Lt,Lt.viewport)}}else Y.length>0&&Wc(tt,Y,L,q),X&&Bt.render(L),Gc(m,L,q);R!==null&&A===0&&(Ft.updateMultisampleRenderTarget(R),Ft.updateRenderTargetMipmap(R)),L.isScene===!0&&L.onAfterRender(M,L,q),wt.resetDefaultState(),_=-1,x=null,b.pop(),b.length>0?(p=b[b.length-1],et===!0&&Mt.setGlobalState(M.clippingPlanes,p.state.camera)):p=null,S.pop(),S.length>0?m=S[S.length-1]:m=null};function xa(L,q,J,tt){if(L.visible===!1)return;if(L.layers.test(q.layers)){if(L.isGroup)J=L.renderOrder;else if(L.isLOD)L.autoUpdate===!0&&L.update(q);else if(L.isLight)p.pushLight(L),L.castShadow&&p.pushShadow(L);else if(L.isSprite){if(!L.frustumCulled||Nt.intersectsSprite(L)){tt&&B.setFromMatrixPosition(L.matrixWorld).applyMatrix4(Z);const Tt=j.update(L),Dt=L.material;Dt.visible&&m.push(L,Tt,Dt,J,B.z,null)}}else if((L.isMesh||L.isLine||L.isPoints)&&(!L.frustumCulled||Nt.intersectsObject(L))){const Tt=j.update(L),Dt=L.material;if(tt&&(L.boundingSphere!==void 0?(L.boundingSphere===null&&L.computeBoundingSphere(),B.copy(L.boundingSphere.center)):(Tt.boundingSphere===null&&Tt.computeBoundingSphere(),B.copy(Tt.boundingSphere.center)),B.applyMatrix4(L.matrixWorld).applyMatrix4(Z)),Array.isArray(Dt)){const Lt=Tt.groups;for(let Xt=0,Yt=Lt.length;Xt<Yt;Xt++){const Vt=Lt[Xt],ee=Dt[Vt.materialIndex];ee&&ee.visible&&m.push(L,Tt,ee,J,B.z,Vt)}}else Dt.visible&&m.push(L,Tt,Dt,J,B.z,null)}}const dt=L.children;for(let Tt=0,Dt=dt.length;Tt<Dt;Tt++)xa(dt[Tt],q,J,tt)}function Gc(L,q,J,tt){const Y=L.opaque,dt=L.transmissive,Tt=L.transparent;p.setupLightsView(J),et===!0&&Mt.setGlobalState(M.clippingPlanes,J),tt&&ft.viewport(y.copy(tt)),Y.length>0&&vs(Y,q,J),dt.length>0&&vs(dt,q,J),Tt.length>0&&vs(Tt,q,J),ft.buffers.depth.setTest(!0),ft.buffers.depth.setMask(!0),ft.buffers.color.setMask(!0),ft.setPolygonOffset(!1)}function Wc(L,q,J,tt){if((J.isScene===!0?J.overrideMaterial:null)!==null)return;p.state.transmissionRenderTarget[tt.id]===void 0&&(p.state.transmissionRenderTarget[tt.id]=new Ye(1,1,{generateMipmaps:!0,type:at.has("EXT_color_buffer_half_float")||at.has("EXT_color_buffer_float")?ji:Ln,minFilter:zi,samples:4,stencilBuffer:s,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:re.workingColorSpace}));const dt=p.state.transmissionRenderTarget[tt.id],Tt=tt.viewport||y;dt.setSize(Tt.z*M.transmissionResolutionScale,Tt.w*M.transmissionResolutionScale);const Dt=M.getRenderTarget(),Lt=M.getActiveCubeFace(),Xt=M.getActiveMipmapLevel();M.setRenderTarget(dt),M.getClearColor(I),F=M.getClearAlpha(),F<1&&M.setClearColor(16777215,.5),M.clear(),X&&Bt.render(J);const Yt=M.toneMapping;M.toneMapping=bi;const Vt=tt.viewport;if(tt.viewport!==void 0&&(tt.viewport=void 0),p.setupLightsView(tt),et===!0&&Mt.setGlobalState(M.clippingPlanes,tt),vs(L,J,tt),Ft.updateMultisampleRenderTarget(dt),Ft.updateRenderTargetMipmap(dt),at.has("WEBGL_multisampled_render_to_texture")===!1){let ee=!1;for(let ce=0,ye=q.length;ce<ye;ce++){const me=q[ce],ue=me.object,Wt=me.geometry,xe=me.material,ie=me.group;if(xe.side===wn&&ue.layers.test(tt.layers)){const tn=xe.side;xe.side=Je,xe.needsUpdate=!0,Xc(ue,J,tt,Wt,xe,ie),xe.side=tn,xe.needsUpdate=!0,ee=!0}}ee===!0&&(Ft.updateMultisampleRenderTarget(dt),Ft.updateRenderTargetMipmap(dt))}M.setRenderTarget(Dt,Lt,Xt),M.setClearColor(I,F),Vt!==void 0&&(tt.viewport=Vt),M.toneMapping=Yt}function vs(L,q,J){const tt=q.isScene===!0?q.overrideMaterial:null;for(let Y=0,dt=L.length;Y<dt;Y++){const Tt=L[Y],Dt=Tt.object,Lt=Tt.geometry,Xt=Tt.group;let Yt=Tt.material;Yt.allowOverride===!0&&tt!==null&&(Yt=tt),Dt.layers.test(J.layers)&&Xc(Dt,q,J,Lt,Yt,Xt)}}function Xc(L,q,J,tt,Y,dt){L.onBeforeRender(M,q,J,tt,Y,dt),L.modelViewMatrix.multiplyMatrices(J.matrixWorldInverse,L.matrixWorld),L.normalMatrix.getNormalMatrix(L.modelViewMatrix),Y.onBeforeRender(M,q,J,tt,L,dt),Y.transparent===!0&&Y.side===wn&&Y.forceSinglePass===!1?(Y.side=Je,Y.needsUpdate=!0,M.renderBufferDirect(J,q,tt,Y,L,dt),Y.side=Si,Y.needsUpdate=!0,M.renderBufferDirect(J,q,tt,Y,L,dt),Y.side=wn):M.renderBufferDirect(J,q,tt,Y,L,dt),L.onAfterRender(M,q,J,tt,Y,dt)}function _s(L,q,J){q.isScene!==!0&&(q=k);const tt=xt.get(L),Y=p.state.lights,dt=p.state.shadowsArray,Tt=Y.state.version,Dt=st.getParameters(L,Y.state,dt,q,J),Lt=st.getProgramCacheKey(Dt);let Xt=tt.programs;tt.environment=L.isMeshStandardMaterial?q.environment:null,tt.fog=q.fog,tt.envMap=(L.isMeshStandardMaterial?ge:Se).get(L.envMap||tt.environment),tt.envMapRotation=tt.environment!==null&&L.envMap===null?q.environmentRotation:L.envMapRotation,Xt===void 0&&(L.addEventListener("dispose",ot),Xt=new Map,tt.programs=Xt);let Yt=Xt.get(Lt);if(Yt!==void 0){if(tt.currentProgram===Yt&&tt.lightsStateVersion===Tt)return Yc(L,Dt),Yt}else Dt.uniforms=st.getUniforms(L),L.onBeforeCompile(Dt,M),Yt=st.acquireProgram(Dt,Lt),Xt.set(Lt,Yt),tt.uniforms=Dt.uniforms;const Vt=tt.uniforms;return(!L.isShaderMaterial&&!L.isRawShaderMaterial||L.clipping===!0)&&(Vt.clippingPlanes=Mt.uniform),Yc(L,Dt),tt.needsLights=ff(L),tt.lightsStateVersion=Tt,tt.needsLights&&(Vt.ambientLightColor.value=Y.state.ambient,Vt.lightProbe.value=Y.state.probe,Vt.directionalLights.value=Y.state.directional,Vt.directionalLightShadows.value=Y.state.directionalShadow,Vt.spotLights.value=Y.state.spot,Vt.spotLightShadows.value=Y.state.spotShadow,Vt.rectAreaLights.value=Y.state.rectArea,Vt.ltc_1.value=Y.state.rectAreaLTC1,Vt.ltc_2.value=Y.state.rectAreaLTC2,Vt.pointLights.value=Y.state.point,Vt.pointLightShadows.value=Y.state.pointShadow,Vt.hemisphereLights.value=Y.state.hemi,Vt.directionalShadowMap.value=Y.state.directionalShadowMap,Vt.directionalShadowMatrix.value=Y.state.directionalShadowMatrix,Vt.spotShadowMap.value=Y.state.spotShadowMap,Vt.spotLightMatrix.value=Y.state.spotLightMatrix,Vt.spotLightMap.value=Y.state.spotLightMap,Vt.pointShadowMap.value=Y.state.pointShadowMap,Vt.pointShadowMatrix.value=Y.state.pointShadowMatrix),tt.currentProgram=Yt,tt.uniformsList=null,Yt}function qc(L){if(L.uniformsList===null){const q=L.currentProgram.getUniforms();L.uniformsList=sa.seqWithValue(q.seq,L.uniforms)}return L.uniformsList}function Yc(L,q){const J=xt.get(L);J.outputColorSpace=q.outputColorSpace,J.batching=q.batching,J.batchingColor=q.batchingColor,J.instancing=q.instancing,J.instancingColor=q.instancingColor,J.instancingMorph=q.instancingMorph,J.skinning=q.skinning,J.morphTargets=q.morphTargets,J.morphNormals=q.morphNormals,J.morphColors=q.morphColors,J.morphTargetsCount=q.morphTargetsCount,J.numClippingPlanes=q.numClippingPlanes,J.numIntersection=q.numClipIntersection,J.vertexAlphas=q.vertexAlphas,J.vertexTangents=q.vertexTangents,J.toneMapping=q.toneMapping}function hf(L,q,J,tt,Y){q.isScene!==!0&&(q=k),Ft.resetTextureUnits();const dt=q.fog,Tt=tt.isMeshStandardMaterial?q.environment:null,Dt=R===null?M.outputColorSpace:R.isXRRenderTarget===!0?R.texture.colorSpace:Yi,Lt=(tt.isMeshStandardMaterial?ge:Se).get(tt.envMap||Tt),Xt=tt.vertexColors===!0&&!!J.attributes.color&&J.attributes.color.itemSize===4,Yt=!!J.attributes.tangent&&(!!tt.normalMap||tt.anisotropy>0),Vt=!!J.morphAttributes.position,ee=!!J.morphAttributes.normal,ce=!!J.morphAttributes.color;let ye=bi;tt.toneMapped&&(R===null||R.isXRRenderTarget===!0)&&(ye=M.toneMapping);const me=J.morphAttributes.position||J.morphAttributes.normal||J.morphAttributes.color,ue=me!==void 0?me.length:0,Wt=xt.get(tt),xe=p.state.lights;if(et===!0&&(W===!0||L!==x)){const Ge=L===x&&tt.id===_;Mt.setState(tt,L,Ge)}let ie=!1;tt.version===Wt.__version?(Wt.needsLights&&Wt.lightsStateVersion!==xe.state.version||Wt.outputColorSpace!==Dt||Y.isBatchedMesh&&Wt.batching===!1||!Y.isBatchedMesh&&Wt.batching===!0||Y.isBatchedMesh&&Wt.batchingColor===!0&&Y.colorTexture===null||Y.isBatchedMesh&&Wt.batchingColor===!1&&Y.colorTexture!==null||Y.isInstancedMesh&&Wt.instancing===!1||!Y.isInstancedMesh&&Wt.instancing===!0||Y.isSkinnedMesh&&Wt.skinning===!1||!Y.isSkinnedMesh&&Wt.skinning===!0||Y.isInstancedMesh&&Wt.instancingColor===!0&&Y.instanceColor===null||Y.isInstancedMesh&&Wt.instancingColor===!1&&Y.instanceColor!==null||Y.isInstancedMesh&&Wt.instancingMorph===!0&&Y.morphTexture===null||Y.isInstancedMesh&&Wt.instancingMorph===!1&&Y.morphTexture!==null||Wt.envMap!==Lt||tt.fog===!0&&Wt.fog!==dt||Wt.numClippingPlanes!==void 0&&(Wt.numClippingPlanes!==Mt.numPlanes||Wt.numIntersection!==Mt.numIntersection)||Wt.vertexAlphas!==Xt||Wt.vertexTangents!==Yt||Wt.morphTargets!==Vt||Wt.morphNormals!==ee||Wt.morphColors!==ce||Wt.toneMapping!==ye||Wt.morphTargetsCount!==ue)&&(ie=!0):(ie=!0,Wt.__version=tt.version);let tn=Wt.currentProgram;ie===!0&&(tn=_s(tt,q,Y));let Qi=!1,en=!1,kr=!1;const Me=tn.getUniforms(),fn=Wt.uniforms;if(ft.useProgram(tn.program)&&(Qi=!0,en=!0,kr=!0),tt.id!==_&&(_=tt.id,en=!0),Qi||x!==L){ft.buffers.depth.getReversed()&&L.reversedDepth!==!0&&(L._reversedDepth=!0,L.updateProjectionMatrix()),Me.setValue(P,"projectionMatrix",L.projectionMatrix),Me.setValue(P,"viewMatrix",L.matrixWorldInverse);const je=Me.map.cameraPosition;je!==void 0&&je.setValue(P,N.setFromMatrixPosition(L.matrixWorld)),_t.logarithmicDepthBuffer&&Me.setValue(P,"logDepthBufFC",2/(Math.log(L.far+1)/Math.LN2)),(tt.isMeshPhongMaterial||tt.isMeshToonMaterial||tt.isMeshLambertMaterial||tt.isMeshBasicMaterial||tt.isMeshStandardMaterial||tt.isShaderMaterial)&&Me.setValue(P,"isOrthographic",L.isOrthographicCamera===!0),x!==L&&(x=L,en=!0,kr=!0)}if(Y.isSkinnedMesh){Me.setOptional(P,Y,"bindMatrix"),Me.setOptional(P,Y,"bindMatrixInverse");const Ge=Y.skeleton;Ge&&(Ge.boneTexture===null&&Ge.computeBoneTexture(),Me.setValue(P,"boneTexture",Ge.boneTexture,Ft))}Y.isBatchedMesh&&(Me.setOptional(P,Y,"batchingTexture"),Me.setValue(P,"batchingTexture",Y._matricesTexture,Ft),Me.setOptional(P,Y,"batchingIdTexture"),Me.setValue(P,"batchingIdTexture",Y._indirectTexture,Ft),Me.setOptional(P,Y,"batchingColorTexture"),Y._colorsTexture!==null&&Me.setValue(P,"batchingColorTexture",Y._colorsTexture,Ft));const dn=J.morphAttributes;if((dn.position!==void 0||dn.normal!==void 0||dn.color!==void 0)&&pt.update(Y,J,tn),(en||Wt.receiveShadow!==Y.receiveShadow)&&(Wt.receiveShadow=Y.receiveShadow,Me.setValue(P,"receiveShadow",Y.receiveShadow)),tt.isMeshGouraudMaterial&&tt.envMap!==null&&(fn.envMap.value=Lt,fn.flipEnvMap.value=Lt.isCubeTexture&&Lt.isRenderTargetTexture===!1?-1:1),tt.isMeshStandardMaterial&&tt.envMap===null&&q.environment!==null&&(fn.envMapIntensity.value=q.environmentIntensity),en&&(Me.setValue(P,"toneMappingExposure",M.toneMappingExposure),Wt.needsLights&&uf(fn,kr),dt&&tt.fog===!0&&lt.refreshFogUniforms(fn,dt),lt.refreshMaterialUniforms(fn,tt,V,$,p.state.transmissionRenderTarget[L.id]),sa.upload(P,qc(Wt),fn,Ft)),tt.isShaderMaterial&&tt.uniformsNeedUpdate===!0&&(sa.upload(P,qc(Wt),fn,Ft),tt.uniformsNeedUpdate=!1),tt.isSpriteMaterial&&Me.setValue(P,"center",Y.center),Me.setValue(P,"modelViewMatrix",Y.modelViewMatrix),Me.setValue(P,"normalMatrix",Y.normalMatrix),Me.setValue(P,"modelMatrix",Y.matrixWorld),tt.isShaderMaterial||tt.isRawShaderMaterial){const Ge=tt.uniformsGroups;for(let je=0,Ma=Ge.length;je<Ma;je++){const Ti=Ge[je];jt.update(Ti,tn),jt.bind(Ti,tn)}}return tn}function uf(L,q){L.ambientLightColor.needsUpdate=q,L.lightProbe.needsUpdate=q,L.directionalLights.needsUpdate=q,L.directionalLightShadows.needsUpdate=q,L.pointLights.needsUpdate=q,L.pointLightShadows.needsUpdate=q,L.spotLights.needsUpdate=q,L.spotLightShadows.needsUpdate=q,L.rectAreaLights.needsUpdate=q,L.hemisphereLights.needsUpdate=q}function ff(L){return L.isMeshLambertMaterial||L.isMeshToonMaterial||L.isMeshPhongMaterial||L.isMeshStandardMaterial||L.isShadowMaterial||L.isShaderMaterial&&L.lights===!0}this.getActiveCubeFace=function(){return T},this.getActiveMipmapLevel=function(){return A},this.getRenderTarget=function(){return R},this.setRenderTargetTextures=function(L,q,J){const tt=xt.get(L);tt.__autoAllocateDepthBuffer=L.resolveDepthBuffer===!1,tt.__autoAllocateDepthBuffer===!1&&(tt.__useRenderToTexture=!1),xt.get(L.texture).__webglTexture=q,xt.get(L.depthTexture).__webglTexture=tt.__autoAllocateDepthBuffer?void 0:J,tt.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(L,q){const J=xt.get(L);J.__webglFramebuffer=q,J.__useDefaultFramebuffer=q===void 0};const df=P.createFramebuffer();this.setRenderTarget=function(L,q=0,J=0){R=L,T=q,A=J;let tt=!0,Y=null,dt=!1,Tt=!1;if(L){const Lt=xt.get(L);if(Lt.__useDefaultFramebuffer!==void 0)ft.bindFramebuffer(P.FRAMEBUFFER,null),tt=!1;else if(Lt.__webglFramebuffer===void 0)Ft.setupRenderTarget(L);else if(Lt.__hasExternalTextures)Ft.rebindTextures(L,xt.get(L.texture).__webglTexture,xt.get(L.depthTexture).__webglTexture);else if(L.depthBuffer){const Vt=L.depthTexture;if(Lt.__boundDepthTexture!==Vt){if(Vt!==null&&xt.has(Vt)&&(L.width!==Vt.image.width||L.height!==Vt.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");Ft.setupDepthRenderbuffer(L)}}const Xt=L.texture;(Xt.isData3DTexture||Xt.isDataArrayTexture||Xt.isCompressedArrayTexture)&&(Tt=!0);const Yt=xt.get(L).__webglFramebuffer;L.isWebGLCubeRenderTarget?(Array.isArray(Yt[q])?Y=Yt[q][J]:Y=Yt[q],dt=!0):L.samples>0&&Ft.useMultisampledRTT(L)===!1?Y=xt.get(L).__webglMultisampledFramebuffer:Array.isArray(Yt)?Y=Yt[J]:Y=Yt,y.copy(L.viewport),w.copy(L.scissor),D=L.scissorTest}else y.copy(ct).multiplyScalar(V).floor(),w.copy(gt).multiplyScalar(V).floor(),D=Ct;if(J!==0&&(Y=df),ft.bindFramebuffer(P.FRAMEBUFFER,Y)&&tt&&ft.drawBuffers(L,Y),ft.viewport(y),ft.scissor(w),ft.setScissorTest(D),dt){const Lt=xt.get(L.texture);P.framebufferTexture2D(P.FRAMEBUFFER,P.COLOR_ATTACHMENT0,P.TEXTURE_CUBE_MAP_POSITIVE_X+q,Lt.__webglTexture,J)}else if(Tt){const Lt=q;for(let Xt=0;Xt<L.textures.length;Xt++){const Yt=xt.get(L.textures[Xt]);P.framebufferTextureLayer(P.FRAMEBUFFER,P.COLOR_ATTACHMENT0+Xt,Yt.__webglTexture,J,Lt)}}else if(L!==null&&J!==0){const Lt=xt.get(L.texture);P.framebufferTexture2D(P.FRAMEBUFFER,P.COLOR_ATTACHMENT0,P.TEXTURE_2D,Lt.__webglTexture,J)}_=-1},this.readRenderTargetPixels=function(L,q,J,tt,Y,dt,Tt,Dt=0){if(!(L&&L.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Lt=xt.get(L).__webglFramebuffer;if(L.isWebGLCubeRenderTarget&&Tt!==void 0&&(Lt=Lt[Tt]),Lt){ft.bindFramebuffer(P.FRAMEBUFFER,Lt);try{const Xt=L.textures[Dt],Yt=Xt.format,Vt=Xt.type;if(!_t.textureFormatReadable(Yt)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!_t.textureTypeReadable(Vt)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}q>=0&&q<=L.width-tt&&J>=0&&J<=L.height-Y&&(L.textures.length>1&&P.readBuffer(P.COLOR_ATTACHMENT0+Dt),P.readPixels(q,J,tt,Y,kt.convert(Yt),kt.convert(Vt),dt))}finally{const Xt=R!==null?xt.get(R).__webglFramebuffer:null;ft.bindFramebuffer(P.FRAMEBUFFER,Xt)}}},this.readRenderTargetPixelsAsync=async function(L,q,J,tt,Y,dt,Tt,Dt=0){if(!(L&&L.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let Lt=xt.get(L).__webglFramebuffer;if(L.isWebGLCubeRenderTarget&&Tt!==void 0&&(Lt=Lt[Tt]),Lt)if(q>=0&&q<=L.width-tt&&J>=0&&J<=L.height-Y){ft.bindFramebuffer(P.FRAMEBUFFER,Lt);const Xt=L.textures[Dt],Yt=Xt.format,Vt=Xt.type;if(!_t.textureFormatReadable(Yt))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!_t.textureTypeReadable(Vt))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");const ee=P.createBuffer();P.bindBuffer(P.PIXEL_PACK_BUFFER,ee),P.bufferData(P.PIXEL_PACK_BUFFER,dt.byteLength,P.STREAM_READ),L.textures.length>1&&P.readBuffer(P.COLOR_ATTACHMENT0+Dt),P.readPixels(q,J,tt,Y,kt.convert(Yt),kt.convert(Vt),0);const ce=R!==null?xt.get(R).__webglFramebuffer:null;ft.bindFramebuffer(P.FRAMEBUFFER,ce);const ye=P.fenceSync(P.SYNC_GPU_COMMANDS_COMPLETE,0);return P.flush(),await Pd(P,ye,4),P.bindBuffer(P.PIXEL_PACK_BUFFER,ee),P.getBufferSubData(P.PIXEL_PACK_BUFFER,0,dt),P.deleteBuffer(ee),P.deleteSync(ye),dt}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(L,q=null,J=0){const tt=Math.pow(2,-J),Y=Math.floor(L.image.width*tt),dt=Math.floor(L.image.height*tt),Tt=q!==null?q.x:0,Dt=q!==null?q.y:0;Ft.setTexture2D(L,0),P.copyTexSubImage2D(P.TEXTURE_2D,J,0,0,Tt,Dt,Y,dt),ft.unbindTexture()};const pf=P.createFramebuffer(),mf=P.createFramebuffer();this.copyTextureToTexture=function(L,q,J=null,tt=null,Y=0,dt=null){dt===null&&(Y!==0?(ls("WebGLRenderer: copyTextureToTexture function signature has changed to support src and dst mipmap levels."),dt=Y,Y=0):dt=0);let Tt,Dt,Lt,Xt,Yt,Vt,ee,ce,ye;const me=L.isCompressedTexture?L.mipmaps[dt]:L.image;if(J!==null)Tt=J.max.x-J.min.x,Dt=J.max.y-J.min.y,Lt=J.isBox3?J.max.z-J.min.z:1,Xt=J.min.x,Yt=J.min.y,Vt=J.isBox3?J.min.z:0;else{const dn=Math.pow(2,-Y);Tt=Math.floor(me.width*dn),Dt=Math.floor(me.height*dn),L.isDataArrayTexture?Lt=me.depth:L.isData3DTexture?Lt=Math.floor(me.depth*dn):Lt=1,Xt=0,Yt=0,Vt=0}tt!==null?(ee=tt.x,ce=tt.y,ye=tt.z):(ee=0,ce=0,ye=0);const ue=kt.convert(q.format),Wt=kt.convert(q.type);let xe;q.isData3DTexture?(Ft.setTexture3D(q,0),xe=P.TEXTURE_3D):q.isDataArrayTexture||q.isCompressedArrayTexture?(Ft.setTexture2DArray(q,0),xe=P.TEXTURE_2D_ARRAY):(Ft.setTexture2D(q,0),xe=P.TEXTURE_2D),P.pixelStorei(P.UNPACK_FLIP_Y_WEBGL,q.flipY),P.pixelStorei(P.UNPACK_PREMULTIPLY_ALPHA_WEBGL,q.premultiplyAlpha),P.pixelStorei(P.UNPACK_ALIGNMENT,q.unpackAlignment);const ie=P.getParameter(P.UNPACK_ROW_LENGTH),tn=P.getParameter(P.UNPACK_IMAGE_HEIGHT),Qi=P.getParameter(P.UNPACK_SKIP_PIXELS),en=P.getParameter(P.UNPACK_SKIP_ROWS),kr=P.getParameter(P.UNPACK_SKIP_IMAGES);P.pixelStorei(P.UNPACK_ROW_LENGTH,me.width),P.pixelStorei(P.UNPACK_IMAGE_HEIGHT,me.height),P.pixelStorei(P.UNPACK_SKIP_PIXELS,Xt),P.pixelStorei(P.UNPACK_SKIP_ROWS,Yt),P.pixelStorei(P.UNPACK_SKIP_IMAGES,Vt);const Me=L.isDataArrayTexture||L.isData3DTexture,fn=q.isDataArrayTexture||q.isData3DTexture;if(L.isDepthTexture){const dn=xt.get(L),Ge=xt.get(q),je=xt.get(dn.__renderTarget),Ma=xt.get(Ge.__renderTarget);ft.bindFramebuffer(P.READ_FRAMEBUFFER,je.__webglFramebuffer),ft.bindFramebuffer(P.DRAW_FRAMEBUFFER,Ma.__webglFramebuffer);for(let Ti=0;Ti<Lt;Ti++)Me&&(P.framebufferTextureLayer(P.READ_FRAMEBUFFER,P.COLOR_ATTACHMENT0,xt.get(L).__webglTexture,Y,Vt+Ti),P.framebufferTextureLayer(P.DRAW_FRAMEBUFFER,P.COLOR_ATTACHMENT0,xt.get(q).__webglTexture,dt,ye+Ti)),P.blitFramebuffer(Xt,Yt,Tt,Dt,ee,ce,Tt,Dt,P.DEPTH_BUFFER_BIT,P.NEAREST);ft.bindFramebuffer(P.READ_FRAMEBUFFER,null),ft.bindFramebuffer(P.DRAW_FRAMEBUFFER,null)}else if(Y!==0||L.isRenderTargetTexture||xt.has(L)){const dn=xt.get(L),Ge=xt.get(q);ft.bindFramebuffer(P.READ_FRAMEBUFFER,pf),ft.bindFramebuffer(P.DRAW_FRAMEBUFFER,mf);for(let je=0;je<Lt;je++)Me?P.framebufferTextureLayer(P.READ_FRAMEBUFFER,P.COLOR_ATTACHMENT0,dn.__webglTexture,Y,Vt+je):P.framebufferTexture2D(P.READ_FRAMEBUFFER,P.COLOR_ATTACHMENT0,P.TEXTURE_2D,dn.__webglTexture,Y),fn?P.framebufferTextureLayer(P.DRAW_FRAMEBUFFER,P.COLOR_ATTACHMENT0,Ge.__webglTexture,dt,ye+je):P.framebufferTexture2D(P.DRAW_FRAMEBUFFER,P.COLOR_ATTACHMENT0,P.TEXTURE_2D,Ge.__webglTexture,dt),Y!==0?P.blitFramebuffer(Xt,Yt,Tt,Dt,ee,ce,Tt,Dt,P.COLOR_BUFFER_BIT,P.NEAREST):fn?P.copyTexSubImage3D(xe,dt,ee,ce,ye+je,Xt,Yt,Tt,Dt):P.copyTexSubImage2D(xe,dt,ee,ce,Xt,Yt,Tt,Dt);ft.bindFramebuffer(P.READ_FRAMEBUFFER,null),ft.bindFramebuffer(P.DRAW_FRAMEBUFFER,null)}else fn?L.isDataTexture||L.isData3DTexture?P.texSubImage3D(xe,dt,ee,ce,ye,Tt,Dt,Lt,ue,Wt,me.data):q.isCompressedArrayTexture?P.compressedTexSubImage3D(xe,dt,ee,ce,ye,Tt,Dt,Lt,ue,me.data):P.texSubImage3D(xe,dt,ee,ce,ye,Tt,Dt,Lt,ue,Wt,me):L.isDataTexture?P.texSubImage2D(P.TEXTURE_2D,dt,ee,ce,Tt,Dt,ue,Wt,me.data):L.isCompressedTexture?P.compressedTexSubImage2D(P.TEXTURE_2D,dt,ee,ce,me.width,me.height,ue,me.data):P.texSubImage2D(P.TEXTURE_2D,dt,ee,ce,Tt,Dt,ue,Wt,me);P.pixelStorei(P.UNPACK_ROW_LENGTH,ie),P.pixelStorei(P.UNPACK_IMAGE_HEIGHT,tn),P.pixelStorei(P.UNPACK_SKIP_PIXELS,Qi),P.pixelStorei(P.UNPACK_SKIP_ROWS,en),P.pixelStorei(P.UNPACK_SKIP_IMAGES,kr),dt===0&&q.generateMipmaps&&P.generateMipmap(xe),ft.unbindTexture()},this.initRenderTarget=function(L){xt.get(L).__webglFramebuffer===void 0&&Ft.setupRenderTarget(L)},this.initTexture=function(L){L.isCubeTexture?Ft.setTextureCube(L,0):L.isData3DTexture?Ft.setTexture3D(L,0):L.isDataArrayTexture||L.isCompressedArrayTexture?Ft.setTexture2DArray(L,0):Ft.setTexture2D(L,0),ft.unbindTexture()},this.resetState=function(){T=0,A=0,R=null,ft.reset(),wt.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return Hn}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(t){this._outputColorSpace=t;const e=this.getContext();e.drawingBufferColorSpace=re._getDrawingBufferColorSpace(t),e.unpackColorSpace=re._getUnpackColorSpace()}}const gv={armL:[.2,-1,0],forearmL:[.15,-1,.1],armR:[-.2,-1,0],forearmR:[-.15,-1,.1],thighL:[.05,-1,0],shinL:[0,-1,0],footL:[0,-.15,1],thighR:[-.05,-1,0],shinR:[0,-1,0],footR:[0,-.15,1]};function vv(i,t){const e=i.scale??1,n=g=>new U(...i.dir?.[g]??gv[g]).normalize(),r=Array.from({length:go},()=>new U),s=(g,v)=>r[g].copy(v),a=(g,v,m)=>new U(g,v,m).multiplyScalar(e);s(z.hipL,a(.1,0,0)),s(z.hipR,a(-.1,0,0)),s(z.shL,a(.19,.52,-.02)),s(z.shR,a(-.19,.52,-.02));const o=new Fe().setFromEuler(new _n(i.head?.[1]??0,i.head?.[0]??0,0,"YXZ")),c=a(0,.6,-.02),l=(g,v,m)=>a(g,v,m).applyQuaternion(o).add(c);s(z.nose,l(0,.1,.11)),s(z.eyeL,l(.032,.135,.09)),s(z.eyeR,l(-.032,.135,.09)),s(z.eyeInL,l(.018,.135,.095)),s(z.eyeInR,l(-.018,.135,.095)),s(z.eyeOutL,l(.05,.135,.08)),s(z.eyeOutR,l(-.05,.135,.08)),s(z.earL,l(.075,.12,0)),s(z.earR,l(-.075,.12,0)),s(z.mouthL,l(.024,.06,.095)),s(z.mouthR,l(-.024,.06,.095));for(const g of["L","R"]){const v=r[g==="L"?z.shL:z.shR],m=r[g==="L"?z.hipL:z.hipR],p=v.clone().addScaledVector(n(`arm${g}`),.29*e),S=p.clone().addScaledVector(n(`forearm${g}`),.26*e);s(g==="L"?z.elL:z.elR,p),s(g==="L"?z.wrL:z.wrR,S);const b=S.clone().addScaledVector(n(`forearm${g}`),.08*e);s(g==="L"?z.indexL:z.indexR,b.clone().add(a(0,0,.02))),s(g==="L"?z.pinkyL:z.pinkyR,b.clone().add(a(0,0,-.02))),s(g==="L"?z.thumbL:z.thumbR,S.clone().addScaledVector(n(`forearm${g}`),.04*e).add(a(0,0,.04)));const M=m.clone().addScaledVector(n(`thigh${g}`),.43*e),E=M.clone().addScaledVector(n(`shin${g}`),.42*e);s(g==="L"?z.knL:z.knR,M),s(g==="L"?z.anL:z.anR,E);const T=E.clone().add(a(0,-.04,-.05));s(g==="L"?z.heelL:z.heelR,T),s(g==="L"?z.toeL:z.toeR,T.clone().addScaledVector(n(`foot${g}`),.24*e))}const h=new Fe().setFromAxisAngle(new U(0,1,0),i.yaw??0),u=new Set([z.knL,z.knR,z.anL,z.anR,z.heelL,z.heelR,z.toeL,z.toeR]),d=[],f=[];for(let g=0;g<go;g++){const v=r[g].clone().applyQuaternion(h),m=u.has(g)?i.legsVis??.98:.98;d.push({x:v.x,y:v.y,z:v.z,v:m});const p=ns({x:v.x+i.T.x,y:v.y+i.T.y,z:v.z+i.T.z},t);f.push({x:p.x,y:p.y,z:0,v:m})}return{world:d,image:f}}function _v(i,t,e){const n=[];for(let r=0;r<i;r++){const s=t*1.3+r*2.1,a=(r-(i-1)/2)*.9+Math.sin(t*.4+r)*.15,o=Math.sin(s);n.push(vv({T:{x:a,y:-.1+.03*Math.sin(s*2),z:-3-r*.6},yaw:Math.sin(t*.5+r)*.5,head:[Math.sin(t*.7+r)*.4,Math.sin(t*.9)*.15],dir:{armR:[-1,.3+.5*o,.1],forearmR:[-.3,1,.1+.3*o],armL:[.5+.4*Math.cos(s),-.8+.6*Math.cos(s*.5),.3],forearmL:[.2,-.3,1],thighL:[.12,-1,.25*Math.max(0,o)],shinL:[.05,-1,-.2*Math.max(0,o)]},scale:1-r*.08},e))}return n}function xv(i,t,e,n){const r=i.image,s=new Float32Array(t*e),a=f=>[r[f].x*n,r[f].y],o=Math.hypot(a(z.shL)[0]-a(z.hipL)[0],a(z.shL)[1]-a(z.hipL)[1]),c=[[z.shL,z.elL,.11],[z.elL,z.wrL,.09],[z.shR,z.elR,.11],[z.elR,z.wrR,.09],[z.hipL,z.knL,.15],[z.knL,z.anL,.11],[z.hipR,z.knR,.15],[z.knR,z.anR,.11],[z.anL,z.toeL,.07],[z.anR,z.toeR,.07],[z.shL,z.hipR,.2],[z.shR,z.hipL,.2],[z.shL,z.shR,.14],[z.hipL,z.hipR,.16]],l=a(z.nose),h=a(z.earL),u=a(z.earR),d=Math.max(Math.hypot(h[0]-u[0],h[1]-u[1])*.9,o*.22);for(let f=0;f<e;f++)for(let g=0;g<t;g++){const v=(g+.5)/t*n,m=(f+.5)/e;let p=Math.hypot(v-l[0],m-(l[1]-d*.2))-d;for(const[S,b,M]of c){const E=a(S),T=a(b),A=T[0]-E[0],R=T[1]-E[1],_=A*A+R*R||1,x=Math.max(0,Math.min(1,((v-E[0])*A+(m-E[1])*R)/_));p=Math.min(p,Math.hypot(v-E[0]-A*x,m-E[1]-R*x)-M*o)}s[f*t+g]=Math.max(0,Math.min(1,.5-p/(o*.04)))}return{data:s,w:t,h:e}}function sh(i){const t=new Map,e=new Map,n=i.clone();return Tu(i,n,function(r,s){t.set(s,r),e.set(r,s)}),n.traverse(function(r){if(!r.isSkinnedMesh)return;const s=r,a=t.get(r),o=a.skeleton.bones;s.skeleton=a.skeleton.clone(),s.bindMatrix.copy(a.bindMatrix),s.skeleton.bones=o.map(function(c){return e.get(c)}),s.bind(s.skeleton,s.bindMatrix)}),n}function Tu(i,t,e){e(i,t);for(let n=0;n<i.children.length;n++)Tu(i.children[n],t.children[n],e)}class Au extends Gt{constructor(t,e,n=!1,r=!1,s=1e4){const a=new Ne;super(a,e),this.isMarchingCubes=!0;const o=this,c=new Float32Array(36),l=new Float32Array(36),h=new Float32Array(36);this.enableUvs=n,this.enableColors=r,this.init=function(S){this.resolution=S,this.isolation=80,this.size=S,this.size2=this.size*this.size,this.size3=this.size2*this.size,this.halfsize=this.size/2,this.delta=2/this.size,this.yd=this.size,this.zd=this.size2,this.field=new Float32Array(this.size3),this.normal_cache=new Float32Array(this.size3*3),this.palette=new Float32Array(this.size3*3),this.count=0;const b=s*3;this.positionArray=new Float32Array(b*3);const M=new oe(this.positionArray,3);M.setUsage(bs),a.setAttribute("position",M),this.normalArray=new Float32Array(b*3);const E=new oe(this.normalArray,3);if(E.setUsage(bs),a.setAttribute("normal",E),this.enableUvs){this.uvArray=new Float32Array(b*2);const T=new oe(this.uvArray,2);T.setUsage(bs),a.setAttribute("uv",T)}if(this.enableColors){this.colorArray=new Float32Array(b*3);const T=new oe(this.colorArray,3);T.setUsage(bs),a.setAttribute("color",T)}a.boundingSphere=new Fr(new U,1)};function u(S,b,M){return S+(b-S)*M}function d(S,b,M,E,T,A,R,_,x,y){const w=(M-R)/(_-R),D=o.normal_cache;c[b+0]=E+w*o.delta,c[b+1]=T,c[b+2]=A,l[b+0]=u(D[S+0],D[S+3],w),l[b+1]=u(D[S+1],D[S+4],w),l[b+2]=u(D[S+2],D[S+5],w),h[b+0]=u(o.palette[x*3+0],o.palette[y*3+0],w),h[b+1]=u(o.palette[x*3+1],o.palette[y*3+1],w),h[b+2]=u(o.palette[x*3+2],o.palette[y*3+2],w)}function f(S,b,M,E,T,A,R,_,x,y){const w=(M-R)/(_-R),D=o.normal_cache;c[b+0]=E,c[b+1]=T+w*o.delta,c[b+2]=A;const I=S+o.yd*3;l[b+0]=u(D[S+0],D[I+0],w),l[b+1]=u(D[S+1],D[I+1],w),l[b+2]=u(D[S+2],D[I+2],w),h[b+0]=u(o.palette[x*3+0],o.palette[y*3+0],w),h[b+1]=u(o.palette[x*3+1],o.palette[y*3+1],w),h[b+2]=u(o.palette[x*3+2],o.palette[y*3+2],w)}function g(S,b,M,E,T,A,R,_,x,y){const w=(M-R)/(_-R),D=o.normal_cache;c[b+0]=E,c[b+1]=T,c[b+2]=A+w*o.delta;const I=S+o.zd*3;l[b+0]=u(D[S+0],D[I+0],w),l[b+1]=u(D[S+1],D[I+1],w),l[b+2]=u(D[S+2],D[I+2],w),h[b+0]=u(o.palette[x*3+0],o.palette[y*3+0],w),h[b+1]=u(o.palette[x*3+1],o.palette[y*3+1],w),h[b+2]=u(o.palette[x*3+2],o.palette[y*3+2],w)}function v(S){const b=S*3;o.normal_cache[b]===0&&(o.normal_cache[b+0]=o.field[S-1]-o.field[S+1],o.normal_cache[b+1]=o.field[S-o.yd]-o.field[S+o.yd],o.normal_cache[b+2]=o.field[S-o.zd]-o.field[S+o.zd])}function m(S,b,M,E,T){const A=E+1,R=E+o.yd,_=E+o.zd,x=A+o.yd,y=A+o.zd,w=E+o.yd+o.zd,D=A+o.yd+o.zd;let I=0;const F=o.field[E],H=o.field[A],$=o.field[R],V=o.field[x],Q=o.field[_],rt=o.field[y],ct=o.field[w],gt=o.field[D];F<T&&(I|=1),H<T&&(I|=2),$<T&&(I|=8),V<T&&(I|=4),Q<T&&(I|=16),rt<T&&(I|=32),ct<T&&(I|=128),gt<T&&(I|=64);const Ct=Mv[I];if(Ct===0)return 0;const Nt=o.delta,et=S+Nt,W=b+Nt,Z=M+Nt;Ct&1&&(v(E),v(A),d(E*3,0,T,S,b,M,F,H,E,A)),Ct&2&&(v(A),v(x),f(A*3,3,T,et,b,M,H,V,A,x)),Ct&4&&(v(R),v(x),d(R*3,6,T,S,W,M,$,V,R,x)),Ct&8&&(v(E),v(R),f(E*3,9,T,S,b,M,F,$,E,R)),Ct&16&&(v(_),v(y),d(_*3,12,T,S,b,Z,Q,rt,_,y)),Ct&32&&(v(y),v(D),f(y*3,15,T,et,b,Z,rt,gt,y,D)),Ct&64&&(v(w),v(D),d(w*3,18,T,S,W,Z,ct,gt,w,D)),Ct&128&&(v(_),v(w),f(_*3,21,T,S,b,Z,Q,ct,_,w)),Ct&256&&(v(E),v(_),g(E*3,24,T,S,b,M,F,Q,E,_)),Ct&512&&(v(A),v(y),g(A*3,27,T,et,b,M,H,rt,A,y)),Ct&1024&&(v(x),v(D),g(x*3,30,T,et,W,M,V,gt,x,D)),Ct&2048&&(v(R),v(w),g(R*3,33,T,S,W,M,$,ct,R,w)),I<<=4;let N,B,k,X=0,K=0;for(;Xs[I+K]!=-1;)N=I+K,B=N+1,k=N+2,p(c,l,h,3*Xs[N],3*Xs[B],3*Xs[k]),K+=3,X++;return X}function p(S,b,M,E,T,A){const R=o.count*3;if(o.positionArray[R+0]=S[E],o.positionArray[R+1]=S[E+1],o.positionArray[R+2]=S[E+2],o.positionArray[R+3]=S[T],o.positionArray[R+4]=S[T+1],o.positionArray[R+5]=S[T+2],o.positionArray[R+6]=S[A],o.positionArray[R+7]=S[A+1],o.positionArray[R+8]=S[A+2],o.material.flatShading===!0){const _=(b[E+0]+b[T+0]+b[A+0])/3,x=(b[E+1]+b[T+1]+b[A+1])/3,y=(b[E+2]+b[T+2]+b[A+2])/3;o.normalArray[R+0]=_,o.normalArray[R+1]=x,o.normalArray[R+2]=y,o.normalArray[R+3]=_,o.normalArray[R+4]=x,o.normalArray[R+5]=y,o.normalArray[R+6]=_,o.normalArray[R+7]=x,o.normalArray[R+8]=y}else o.normalArray[R+0]=b[E+0],o.normalArray[R+1]=b[E+1],o.normalArray[R+2]=b[E+2],o.normalArray[R+3]=b[T+0],o.normalArray[R+4]=b[T+1],o.normalArray[R+5]=b[T+2],o.normalArray[R+6]=b[A+0],o.normalArray[R+7]=b[A+1],o.normalArray[R+8]=b[A+2];if(o.enableUvs){const _=o.count*2;o.uvArray[_+0]=S[E+0],o.uvArray[_+1]=S[E+2],o.uvArray[_+2]=S[T+0],o.uvArray[_+3]=S[T+2],o.uvArray[_+4]=S[A+0],o.uvArray[_+5]=S[A+2]}o.enableColors&&(o.colorArray[R+0]=M[E+0],o.colorArray[R+1]=M[E+1],o.colorArray[R+2]=M[E+2],o.colorArray[R+3]=M[T+0],o.colorArray[R+4]=M[T+1],o.colorArray[R+5]=M[T+2],o.colorArray[R+6]=M[A+0],o.colorArray[R+7]=M[A+1],o.colorArray[R+8]=M[A+2]),o.count+=3}this.addBall=function(S,b,M,E,T,A){const R=Math.sign(E);E=Math.abs(E);const _=A!=null;let x=new Ht(S,b,M);if(_)try{x=A instanceof Ht?A:Array.isArray(A)?new Ht(Math.min(Math.abs(A[0]),1),Math.min(Math.abs(A[1]),1),Math.min(Math.abs(A[2]),1)):new Ht(A)}catch{x=new Ht(S,b,M)}const y=this.size*Math.sqrt(E/T),w=M*this.size,D=b*this.size,I=S*this.size;let F=Math.floor(w-y);F<1&&(F=1);let H=Math.floor(w+y);H>this.size-1&&(H=this.size-1);let $=Math.floor(D-y);$<1&&($=1);let V=Math.floor(D+y);V>this.size-1&&(V=this.size-1);let Q=Math.floor(I-y);Q<1&&(Q=1);let rt=Math.floor(I+y);rt>this.size-1&&(rt=this.size-1);let ct,gt,Ct,Nt,et,W,Z,N,B,k,X;for(Ct=F;Ct<H;Ct++)for(et=this.size2*Ct,N=Ct/this.size-M,B=N*N,gt=$;gt<V;gt++)for(Nt=et+this.size*gt,Z=gt/this.size-b,k=Z*Z,ct=Q;ct<rt;ct++)if(W=ct/this.size-S,X=E/(1e-6+W*W+k+B)-T,X>0){this.field[Nt+ct]+=X*R;const K=Math.sqrt((ct-I)*(ct-I)+(gt-D)*(gt-D)+(Ct-w)*(Ct-w))/y,P=1-K*K*K*(K*(K*6-15)+10);this.palette[(Nt+ct)*3+0]+=x.r*P,this.palette[(Nt+ct)*3+1]+=x.g*P,this.palette[(Nt+ct)*3+2]+=x.b*P}},this.addPlaneX=function(S,b){const M=this.size,E=this.yd,T=this.zd,A=this.field;let R,_,x,y,w,D,I,F=M*Math.sqrt(S/b);for(F>M&&(F=M),R=0;R<F;R++)if(D=R/M,y=D*D,w=S/(1e-4+y)-b,w>0)for(_=0;_<M;_++)for(I=R+_*E,x=0;x<M;x++)A[T*x+I]+=w},this.addPlaneY=function(S,b){const M=this.size,E=this.yd,T=this.zd,A=this.field;let R,_,x,y,w,D,I,F,H=M*Math.sqrt(S/b);for(H>M&&(H=M),_=0;_<H;_++)if(D=_/M,y=D*D,w=S/(1e-4+y)-b,w>0)for(I=_*E,R=0;R<M;R++)for(F=I+R,x=0;x<M;x++)A[T*x+F]+=w},this.addPlaneZ=function(S,b){const M=this.size,E=this.yd,T=this.zd,A=this.field;let R,_,x,y,w,D,I,F,H=M*Math.sqrt(S/b);for(H>M&&(H=M),x=0;x<H;x++)if(D=x/M,y=D*D,w=S/(1e-4+y)-b,w>0)for(I=T*x,_=0;_<M;_++)for(F=I+_*E,R=0;R<M;R++)A[F+R]+=w},this.setCell=function(S,b,M,E){const T=this.size2*M+this.size*b+S;this.field[T]=E},this.getCell=function(S,b,M){const E=this.size2*M+this.size*b+S;return this.field[E]},this.blur=function(S=1){const b=this.field,M=b.slice(),E=this.size,T=this.size2;for(let A=0;A<E;A++)for(let R=0;R<E;R++)for(let _=0;_<E;_++){const x=T*_+E*R+A;let y=M[x],w=1;for(let D=-1;D<=1;D+=2){const I=D+A;if(!(I<0||I>=E))for(let F=-1;F<=1;F+=2){const H=F+R;if(!(H<0||H>=E))for(let $=-1;$<=1;$+=2){const V=$+_;if(V<0||V>=E)continue;const Q=T*V+E*H+I,rt=M[Q];w++,y+=S*(rt-y)/w}}}b[x]=y}},this.reset=function(){for(let S=0;S<this.size3;S++)this.normal_cache[S*3]=0,this.field[S]=0,this.palette[S*3]=this.palette[S*3+1]=this.palette[S*3+2]=0},this.update=function(){this.count=0;const S=this.size-2;for(let b=1;b<S;b++){const M=this.size2*b,E=(b-this.halfsize)/this.halfsize;for(let T=1;T<S;T++){const A=M+this.size*T,R=(T-this.halfsize)/this.halfsize;for(let _=1;_<S;_++){const x=(_-this.halfsize)/this.halfsize,y=A+_;m(x,R,E,y,this.isolation)}}}this.geometry.setDrawRange(0,this.count),a.getAttribute("position").needsUpdate=!0,a.getAttribute("normal").needsUpdate=!0,this.enableUvs&&(a.getAttribute("uv").needsUpdate=!0),this.enableColors&&(a.getAttribute("color").needsUpdate=!0),this.count/3>s&&console.warn("THREE.MarchingCubes: Geometry buffers too small for rendering. Please create an instance with a higher poly count.")},this.init(t)}}const Mv=new Int32Array([0,265,515,778,1030,1295,1541,1804,2060,2309,2575,2822,3082,3331,3593,3840,400,153,915,666,1430,1183,1941,1692,2460,2197,2975,2710,3482,3219,3993,3728,560,825,51,314,1590,1855,1077,1340,2620,2869,2111,2358,3642,3891,3129,3376,928,681,419,170,1958,1711,1445,1196,2988,2725,2479,2214,4010,3747,3497,3232,1120,1385,1635,1898,102,367,613,876,3180,3429,3695,3942,2154,2403,2665,2912,1520,1273,2035,1786,502,255,1013,764,3580,3317,4095,3830,2554,2291,3065,2800,1616,1881,1107,1370,598,863,85,348,3676,3925,3167,3414,2650,2899,2137,2384,1984,1737,1475,1226,966,719,453,204,4044,3781,3535,3270,3018,2755,2505,2240,2240,2505,2755,3018,3270,3535,3781,4044,204,453,719,966,1226,1475,1737,1984,2384,2137,2899,2650,3414,3167,3925,3676,348,85,863,598,1370,1107,1881,1616,2800,3065,2291,2554,3830,4095,3317,3580,764,1013,255,502,1786,2035,1273,1520,2912,2665,2403,2154,3942,3695,3429,3180,876,613,367,102,1898,1635,1385,1120,3232,3497,3747,4010,2214,2479,2725,2988,1196,1445,1711,1958,170,419,681,928,3376,3129,3891,3642,2358,2111,2869,2620,1340,1077,1855,1590,314,51,825,560,3728,3993,3219,3482,2710,2975,2197,2460,1692,1941,1183,1430,666,915,153,400,3840,3593,3331,3082,2822,2575,2309,2060,1804,1541,1295,1030,778,515,265,0]),Xs=new Int32Array([-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,8,3,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,1,9,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,1,8,3,9,8,1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,1,2,10,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,8,3,1,2,10,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,9,2,10,0,2,9,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,2,8,3,2,10,8,10,9,8,-1,-1,-1,-1,-1,-1,-1,3,11,2,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,11,2,8,11,0,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,1,9,0,2,3,11,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,1,11,2,1,9,11,9,8,11,-1,-1,-1,-1,-1,-1,-1,3,10,1,11,10,3,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,10,1,0,8,10,8,11,10,-1,-1,-1,-1,-1,-1,-1,3,9,0,3,11,9,11,10,9,-1,-1,-1,-1,-1,-1,-1,9,8,10,10,8,11,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,4,7,8,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,4,3,0,7,3,4,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,1,9,8,4,7,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,4,1,9,4,7,1,7,3,1,-1,-1,-1,-1,-1,-1,-1,1,2,10,8,4,7,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,3,4,7,3,0,4,1,2,10,-1,-1,-1,-1,-1,-1,-1,9,2,10,9,0,2,8,4,7,-1,-1,-1,-1,-1,-1,-1,2,10,9,2,9,7,2,7,3,7,9,4,-1,-1,-1,-1,8,4,7,3,11,2,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,11,4,7,11,2,4,2,0,4,-1,-1,-1,-1,-1,-1,-1,9,0,1,8,4,7,2,3,11,-1,-1,-1,-1,-1,-1,-1,4,7,11,9,4,11,9,11,2,9,2,1,-1,-1,-1,-1,3,10,1,3,11,10,7,8,4,-1,-1,-1,-1,-1,-1,-1,1,11,10,1,4,11,1,0,4,7,11,4,-1,-1,-1,-1,4,7,8,9,0,11,9,11,10,11,0,3,-1,-1,-1,-1,4,7,11,4,11,9,9,11,10,-1,-1,-1,-1,-1,-1,-1,9,5,4,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,9,5,4,0,8,3,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,5,4,1,5,0,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,8,5,4,8,3,5,3,1,5,-1,-1,-1,-1,-1,-1,-1,1,2,10,9,5,4,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,3,0,8,1,2,10,4,9,5,-1,-1,-1,-1,-1,-1,-1,5,2,10,5,4,2,4,0,2,-1,-1,-1,-1,-1,-1,-1,2,10,5,3,2,5,3,5,4,3,4,8,-1,-1,-1,-1,9,5,4,2,3,11,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,11,2,0,8,11,4,9,5,-1,-1,-1,-1,-1,-1,-1,0,5,4,0,1,5,2,3,11,-1,-1,-1,-1,-1,-1,-1,2,1,5,2,5,8,2,8,11,4,8,5,-1,-1,-1,-1,10,3,11,10,1,3,9,5,4,-1,-1,-1,-1,-1,-1,-1,4,9,5,0,8,1,8,10,1,8,11,10,-1,-1,-1,-1,5,4,0,5,0,11,5,11,10,11,0,3,-1,-1,-1,-1,5,4,8,5,8,10,10,8,11,-1,-1,-1,-1,-1,-1,-1,9,7,8,5,7,9,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,9,3,0,9,5,3,5,7,3,-1,-1,-1,-1,-1,-1,-1,0,7,8,0,1,7,1,5,7,-1,-1,-1,-1,-1,-1,-1,1,5,3,3,5,7,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,9,7,8,9,5,7,10,1,2,-1,-1,-1,-1,-1,-1,-1,10,1,2,9,5,0,5,3,0,5,7,3,-1,-1,-1,-1,8,0,2,8,2,5,8,5,7,10,5,2,-1,-1,-1,-1,2,10,5,2,5,3,3,5,7,-1,-1,-1,-1,-1,-1,-1,7,9,5,7,8,9,3,11,2,-1,-1,-1,-1,-1,-1,-1,9,5,7,9,7,2,9,2,0,2,7,11,-1,-1,-1,-1,2,3,11,0,1,8,1,7,8,1,5,7,-1,-1,-1,-1,11,2,1,11,1,7,7,1,5,-1,-1,-1,-1,-1,-1,-1,9,5,8,8,5,7,10,1,3,10,3,11,-1,-1,-1,-1,5,7,0,5,0,9,7,11,0,1,0,10,11,10,0,-1,11,10,0,11,0,3,10,5,0,8,0,7,5,7,0,-1,11,10,5,7,11,5,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,10,6,5,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,8,3,5,10,6,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,9,0,1,5,10,6,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,1,8,3,1,9,8,5,10,6,-1,-1,-1,-1,-1,-1,-1,1,6,5,2,6,1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,1,6,5,1,2,6,3,0,8,-1,-1,-1,-1,-1,-1,-1,9,6,5,9,0,6,0,2,6,-1,-1,-1,-1,-1,-1,-1,5,9,8,5,8,2,5,2,6,3,2,8,-1,-1,-1,-1,2,3,11,10,6,5,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,11,0,8,11,2,0,10,6,5,-1,-1,-1,-1,-1,-1,-1,0,1,9,2,3,11,5,10,6,-1,-1,-1,-1,-1,-1,-1,5,10,6,1,9,2,9,11,2,9,8,11,-1,-1,-1,-1,6,3,11,6,5,3,5,1,3,-1,-1,-1,-1,-1,-1,-1,0,8,11,0,11,5,0,5,1,5,11,6,-1,-1,-1,-1,3,11,6,0,3,6,0,6,5,0,5,9,-1,-1,-1,-1,6,5,9,6,9,11,11,9,8,-1,-1,-1,-1,-1,-1,-1,5,10,6,4,7,8,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,4,3,0,4,7,3,6,5,10,-1,-1,-1,-1,-1,-1,-1,1,9,0,5,10,6,8,4,7,-1,-1,-1,-1,-1,-1,-1,10,6,5,1,9,7,1,7,3,7,9,4,-1,-1,-1,-1,6,1,2,6,5,1,4,7,8,-1,-1,-1,-1,-1,-1,-1,1,2,5,5,2,6,3,0,4,3,4,7,-1,-1,-1,-1,8,4,7,9,0,5,0,6,5,0,2,6,-1,-1,-1,-1,7,3,9,7,9,4,3,2,9,5,9,6,2,6,9,-1,3,11,2,7,8,4,10,6,5,-1,-1,-1,-1,-1,-1,-1,5,10,6,4,7,2,4,2,0,2,7,11,-1,-1,-1,-1,0,1,9,4,7,8,2,3,11,5,10,6,-1,-1,-1,-1,9,2,1,9,11,2,9,4,11,7,11,4,5,10,6,-1,8,4,7,3,11,5,3,5,1,5,11,6,-1,-1,-1,-1,5,1,11,5,11,6,1,0,11,7,11,4,0,4,11,-1,0,5,9,0,6,5,0,3,6,11,6,3,8,4,7,-1,6,5,9,6,9,11,4,7,9,7,11,9,-1,-1,-1,-1,10,4,9,6,4,10,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,4,10,6,4,9,10,0,8,3,-1,-1,-1,-1,-1,-1,-1,10,0,1,10,6,0,6,4,0,-1,-1,-1,-1,-1,-1,-1,8,3,1,8,1,6,8,6,4,6,1,10,-1,-1,-1,-1,1,4,9,1,2,4,2,6,4,-1,-1,-1,-1,-1,-1,-1,3,0,8,1,2,9,2,4,9,2,6,4,-1,-1,-1,-1,0,2,4,4,2,6,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,8,3,2,8,2,4,4,2,6,-1,-1,-1,-1,-1,-1,-1,10,4,9,10,6,4,11,2,3,-1,-1,-1,-1,-1,-1,-1,0,8,2,2,8,11,4,9,10,4,10,6,-1,-1,-1,-1,3,11,2,0,1,6,0,6,4,6,1,10,-1,-1,-1,-1,6,4,1,6,1,10,4,8,1,2,1,11,8,11,1,-1,9,6,4,9,3,6,9,1,3,11,6,3,-1,-1,-1,-1,8,11,1,8,1,0,11,6,1,9,1,4,6,4,1,-1,3,11,6,3,6,0,0,6,4,-1,-1,-1,-1,-1,-1,-1,6,4,8,11,6,8,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,7,10,6,7,8,10,8,9,10,-1,-1,-1,-1,-1,-1,-1,0,7,3,0,10,7,0,9,10,6,7,10,-1,-1,-1,-1,10,6,7,1,10,7,1,7,8,1,8,0,-1,-1,-1,-1,10,6,7,10,7,1,1,7,3,-1,-1,-1,-1,-1,-1,-1,1,2,6,1,6,8,1,8,9,8,6,7,-1,-1,-1,-1,2,6,9,2,9,1,6,7,9,0,9,3,7,3,9,-1,7,8,0,7,0,6,6,0,2,-1,-1,-1,-1,-1,-1,-1,7,3,2,6,7,2,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,2,3,11,10,6,8,10,8,9,8,6,7,-1,-1,-1,-1,2,0,7,2,7,11,0,9,7,6,7,10,9,10,7,-1,1,8,0,1,7,8,1,10,7,6,7,10,2,3,11,-1,11,2,1,11,1,7,10,6,1,6,7,1,-1,-1,-1,-1,8,9,6,8,6,7,9,1,6,11,6,3,1,3,6,-1,0,9,1,11,6,7,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,7,8,0,7,0,6,3,11,0,11,6,0,-1,-1,-1,-1,7,11,6,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,7,6,11,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,3,0,8,11,7,6,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,1,9,11,7,6,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,8,1,9,8,3,1,11,7,6,-1,-1,-1,-1,-1,-1,-1,10,1,2,6,11,7,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,1,2,10,3,0,8,6,11,7,-1,-1,-1,-1,-1,-1,-1,2,9,0,2,10,9,6,11,7,-1,-1,-1,-1,-1,-1,-1,6,11,7,2,10,3,10,8,3,10,9,8,-1,-1,-1,-1,7,2,3,6,2,7,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,7,0,8,7,6,0,6,2,0,-1,-1,-1,-1,-1,-1,-1,2,7,6,2,3,7,0,1,9,-1,-1,-1,-1,-1,-1,-1,1,6,2,1,8,6,1,9,8,8,7,6,-1,-1,-1,-1,10,7,6,10,1,7,1,3,7,-1,-1,-1,-1,-1,-1,-1,10,7,6,1,7,10,1,8,7,1,0,8,-1,-1,-1,-1,0,3,7,0,7,10,0,10,9,6,10,7,-1,-1,-1,-1,7,6,10,7,10,8,8,10,9,-1,-1,-1,-1,-1,-1,-1,6,8,4,11,8,6,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,3,6,11,3,0,6,0,4,6,-1,-1,-1,-1,-1,-1,-1,8,6,11,8,4,6,9,0,1,-1,-1,-1,-1,-1,-1,-1,9,4,6,9,6,3,9,3,1,11,3,6,-1,-1,-1,-1,6,8,4,6,11,8,2,10,1,-1,-1,-1,-1,-1,-1,-1,1,2,10,3,0,11,0,6,11,0,4,6,-1,-1,-1,-1,4,11,8,4,6,11,0,2,9,2,10,9,-1,-1,-1,-1,10,9,3,10,3,2,9,4,3,11,3,6,4,6,3,-1,8,2,3,8,4,2,4,6,2,-1,-1,-1,-1,-1,-1,-1,0,4,2,4,6,2,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,1,9,0,2,3,4,2,4,6,4,3,8,-1,-1,-1,-1,1,9,4,1,4,2,2,4,6,-1,-1,-1,-1,-1,-1,-1,8,1,3,8,6,1,8,4,6,6,10,1,-1,-1,-1,-1,10,1,0,10,0,6,6,0,4,-1,-1,-1,-1,-1,-1,-1,4,6,3,4,3,8,6,10,3,0,3,9,10,9,3,-1,10,9,4,6,10,4,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,4,9,5,7,6,11,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,8,3,4,9,5,11,7,6,-1,-1,-1,-1,-1,-1,-1,5,0,1,5,4,0,7,6,11,-1,-1,-1,-1,-1,-1,-1,11,7,6,8,3,4,3,5,4,3,1,5,-1,-1,-1,-1,9,5,4,10,1,2,7,6,11,-1,-1,-1,-1,-1,-1,-1,6,11,7,1,2,10,0,8,3,4,9,5,-1,-1,-1,-1,7,6,11,5,4,10,4,2,10,4,0,2,-1,-1,-1,-1,3,4,8,3,5,4,3,2,5,10,5,2,11,7,6,-1,7,2,3,7,6,2,5,4,9,-1,-1,-1,-1,-1,-1,-1,9,5,4,0,8,6,0,6,2,6,8,7,-1,-1,-1,-1,3,6,2,3,7,6,1,5,0,5,4,0,-1,-1,-1,-1,6,2,8,6,8,7,2,1,8,4,8,5,1,5,8,-1,9,5,4,10,1,6,1,7,6,1,3,7,-1,-1,-1,-1,1,6,10,1,7,6,1,0,7,8,7,0,9,5,4,-1,4,0,10,4,10,5,0,3,10,6,10,7,3,7,10,-1,7,6,10,7,10,8,5,4,10,4,8,10,-1,-1,-1,-1,6,9,5,6,11,9,11,8,9,-1,-1,-1,-1,-1,-1,-1,3,6,11,0,6,3,0,5,6,0,9,5,-1,-1,-1,-1,0,11,8,0,5,11,0,1,5,5,6,11,-1,-1,-1,-1,6,11,3,6,3,5,5,3,1,-1,-1,-1,-1,-1,-1,-1,1,2,10,9,5,11,9,11,8,11,5,6,-1,-1,-1,-1,0,11,3,0,6,11,0,9,6,5,6,9,1,2,10,-1,11,8,5,11,5,6,8,0,5,10,5,2,0,2,5,-1,6,11,3,6,3,5,2,10,3,10,5,3,-1,-1,-1,-1,5,8,9,5,2,8,5,6,2,3,8,2,-1,-1,-1,-1,9,5,6,9,6,0,0,6,2,-1,-1,-1,-1,-1,-1,-1,1,5,8,1,8,0,5,6,8,3,8,2,6,2,8,-1,1,5,6,2,1,6,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,1,3,6,1,6,10,3,8,6,5,6,9,8,9,6,-1,10,1,0,10,0,6,9,5,0,5,6,0,-1,-1,-1,-1,0,3,8,5,6,10,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,10,5,6,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,11,5,10,7,5,11,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,11,5,10,11,7,5,8,3,0,-1,-1,-1,-1,-1,-1,-1,5,11,7,5,10,11,1,9,0,-1,-1,-1,-1,-1,-1,-1,10,7,5,10,11,7,9,8,1,8,3,1,-1,-1,-1,-1,11,1,2,11,7,1,7,5,1,-1,-1,-1,-1,-1,-1,-1,0,8,3,1,2,7,1,7,5,7,2,11,-1,-1,-1,-1,9,7,5,9,2,7,9,0,2,2,11,7,-1,-1,-1,-1,7,5,2,7,2,11,5,9,2,3,2,8,9,8,2,-1,2,5,10,2,3,5,3,7,5,-1,-1,-1,-1,-1,-1,-1,8,2,0,8,5,2,8,7,5,10,2,5,-1,-1,-1,-1,9,0,1,5,10,3,5,3,7,3,10,2,-1,-1,-1,-1,9,8,2,9,2,1,8,7,2,10,2,5,7,5,2,-1,1,3,5,3,7,5,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,8,7,0,7,1,1,7,5,-1,-1,-1,-1,-1,-1,-1,9,0,3,9,3,5,5,3,7,-1,-1,-1,-1,-1,-1,-1,9,8,7,5,9,7,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,5,8,4,5,10,8,10,11,8,-1,-1,-1,-1,-1,-1,-1,5,0,4,5,11,0,5,10,11,11,3,0,-1,-1,-1,-1,0,1,9,8,4,10,8,10,11,10,4,5,-1,-1,-1,-1,10,11,4,10,4,5,11,3,4,9,4,1,3,1,4,-1,2,5,1,2,8,5,2,11,8,4,5,8,-1,-1,-1,-1,0,4,11,0,11,3,4,5,11,2,11,1,5,1,11,-1,0,2,5,0,5,9,2,11,5,4,5,8,11,8,5,-1,9,4,5,2,11,3,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,2,5,10,3,5,2,3,4,5,3,8,4,-1,-1,-1,-1,5,10,2,5,2,4,4,2,0,-1,-1,-1,-1,-1,-1,-1,3,10,2,3,5,10,3,8,5,4,5,8,0,1,9,-1,5,10,2,5,2,4,1,9,2,9,4,2,-1,-1,-1,-1,8,4,5,8,5,3,3,5,1,-1,-1,-1,-1,-1,-1,-1,0,4,5,1,0,5,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,8,4,5,8,5,3,9,0,5,0,3,5,-1,-1,-1,-1,9,4,5,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,4,11,7,4,9,11,9,10,11,-1,-1,-1,-1,-1,-1,-1,0,8,3,4,9,7,9,11,7,9,10,11,-1,-1,-1,-1,1,10,11,1,11,4,1,4,0,7,4,11,-1,-1,-1,-1,3,1,4,3,4,8,1,10,4,7,4,11,10,11,4,-1,4,11,7,9,11,4,9,2,11,9,1,2,-1,-1,-1,-1,9,7,4,9,11,7,9,1,11,2,11,1,0,8,3,-1,11,7,4,11,4,2,2,4,0,-1,-1,-1,-1,-1,-1,-1,11,7,4,11,4,2,8,3,4,3,2,4,-1,-1,-1,-1,2,9,10,2,7,9,2,3,7,7,4,9,-1,-1,-1,-1,9,10,7,9,7,4,10,2,7,8,7,0,2,0,7,-1,3,7,10,3,10,2,7,4,10,1,10,0,4,0,10,-1,1,10,2,8,7,4,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,4,9,1,4,1,7,7,1,3,-1,-1,-1,-1,-1,-1,-1,4,9,1,4,1,7,0,8,1,8,7,1,-1,-1,-1,-1,4,0,3,7,4,3,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,4,8,7,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,9,10,8,10,11,8,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,3,0,9,3,9,11,11,9,10,-1,-1,-1,-1,-1,-1,-1,0,1,10,0,10,8,8,10,11,-1,-1,-1,-1,-1,-1,-1,3,1,10,11,3,10,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,1,2,11,1,11,9,9,11,8,-1,-1,-1,-1,-1,-1,-1,3,0,9,3,9,11,1,2,9,2,11,9,-1,-1,-1,-1,0,2,11,8,0,11,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,3,2,11,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,2,3,8,2,8,10,10,8,9,-1,-1,-1,-1,-1,-1,-1,9,10,2,0,9,2,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,2,3,8,2,8,10,0,1,8,1,10,8,-1,-1,-1,-1,1,10,2,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,1,3,8,9,1,8,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,9,1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,3,8,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1]),Ru={uFurFade:{value:1}},bv=`
  float furHash(vec3 p) { p = fract(p * 0.1031); p += dot(p, p.zyx + 31.32); return fract((p.x + p.y) * p.z); }
  float furNoise(vec3 p) { vec3 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f);
    return mix(mix(mix(furHash(i), furHash(i + vec3(1, 0, 0)), f.x), mix(furHash(i + vec3(0, 1, 0)), furHash(i + vec3(1, 1, 0)), f.x), f.y),
               mix(mix(furHash(i + vec3(0, 0, 1)), furHash(i + vec3(1, 0, 1)), f.x), mix(furHash(i + vec3(0, 1, 1)), furHash(i + vec3(1, 1, 1)), f.x), f.y), f.z); }`;function yv(i,t){const e=new xi({vertexColors:!0,roughness:t.feather?.75:.92,metalness:0}),n={uH:{value:i},uFurLen:{value:t.length},uFurDensity:{value:t.density},uFurTip:{value:t.tip},uFeather:{value:t.feather?1:0}};return e.onBeforeCompile=r=>{Object.assign(r.uniforms,n,Ru),r.vertexShader=r.vertexShader.replace("#include <common>",`#include <common>
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
        ${bv}`).replace("#include <color_fragment>",`#include <color_fragment>
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
        diffuseColor.rgb = mix(diffuseColor.rgb, diffuseColor.rgb * 1.25 + 0.06, uFurTip * smoothstep(0.6, 1.0, t));`)},e.customProgramCacheKey=()=>"kaiju-fur-v2",e}function Sv(i,t,e,n){const r=[];for(let s=1;s<=n;s++){const a=new pu(t,yv(s/n,e));a.castShadow=!1,a.receiveShadow=!0,a.frustumCulled=!1,a.userData.h=s/n,i.add(a),a.bind(i.skeleton,i.bindMatrix),r.push(a)}return r}function Ev(i=512){const t=document.createElement("canvas");t.width=t.height=i;const e=t.getContext("2d"),n=document.createElement("canvas");n.width=n.height=i;const r=n.getContext("2d"),s=e.createImageData(i,i),a=r.createImageData(i,i),o=22,c=[];let l=7;const h=()=>(l=l*1664525+1013904223>>>0,l/4294967296);for(let f=0;f<o;f++)for(let g=0;g<o;g++)c.push([(g+.2+h()*.6)/o,(f+.2+h()*.6)/o,.7+h()*.3]);for(let f=0;f<i;f++)for(let g=0;g<i;g++){const v=g/i,m=f/i,p=Math.floor(v*o),S=Math.floor(m*o);let b=9,M=9,E=1;for(let w=-1;w<=1;w++)for(let D=-1;D<=1;D++){const I=(p+D+o)%o,F=(S+w+o)%o,H=c[F*o+I];let $=v-H[0],V=m-H[1];$-=Math.round($),V-=Math.round(V);const Q=Math.sqrt($*$+V*V);Q<b?(M=b,b=Q,E=H[2]):Q<M&&(M=Q)}const T=M-b,A=Math.min(1,T/.02),R=1-Math.min(1,b/(.55/o)),_=(.55+.45*A)*E*(.85+.3*R),x=(f*i+g)*4;s.data[x]=255*_,s.data[x+1]=255*_,s.data[x+2]=255*_,s.data[x+3]=255;const y=.55+.4*(1-A)-.15*R;a.data[x]=255*y,a.data[x+1]=255*y,a.data[x+2]=255*y,a.data[x+3]=255}e.putImageData(s,0,0),r.putImageData(a,0,0);const u=new Pl(t);u.wrapS=u.wrapT=is,u.colorSpace=kn;const d=new Pl(n);return d.wrapS=d.wrapT=is,{map:u,rough:d}}let qs=null;function wv(i=!1,t){if(i)return Tv();if(t==="armour")return new xi({vertexColors:!0,roughness:.42,metalness:.45});if(t==="soft")return new xi({vertexColors:!0,roughness:.82,metalness:0});if(t==="suit")return new xi({vertexColors:!0,roughness:.34,metalness:.18});!qs&&typeof document<"u"&&(qs=Ev());const e=new xi({vertexColors:!0,roughness:.7,metalness:.02});return e.onBeforeCompile=n=>{n.uniforms.uScales={value:qs?.map??null},n.uniforms.uRough={value:qs?.rough??null},n.vertexShader=n.vertexShader.replace("#include <common>",`#include <common>
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
        float roughTex = triplanar(uRough, vBind, bn, sc).r;`).replace("#include <roughnessmap_fragment>","float roughnessFactor = mix(roughTex, 0.9, isBone);")},e.customProgramCacheKey=()=>"kaiju-v1",e}function Tv(){const i=new xi({vertexColors:!0,roughness:.95,metalness:0});return i.onBeforeCompile=t=>{Object.assign(t.uniforms,Ru),t.fragmentShader=t.fragmentShader.replace("#include <common>",`#include <common>
 uniform float uFurFade;`).replace("#include <color_fragment>",`#include <color_fragment>
 diffuseColor.rgb *= mix(1.0, 0.6, uFurFade);`)},i.customProgramCacheKey=()=>"kaiju-undercoat-v1",i}function sc(i){const t=new Ne;return t.setAttribute("position",new oe(i.position,3)),t.setAttribute("normal",new oe(i.normal,3)),t.setAttribute("color",new oe(i.color,3)),i.aFur&&t.setAttribute("aFur",new oe(i.aFur,1)),t.setAttribute("skinIndex",new oe(i.skinIndex,4)),t.setAttribute("skinWeight",new oe(i.skinWeight,4)),t}function ah(i,t,e){return sc(Av(i,t,e))}function Av(i,t,e){const n=i.box,r=(n.min[0]+n.max[0])/2,s=(n.min[1]+n.max[1])/2,a=(n.min[2]+n.max[2])/2,o=(n.max[0]-n.min[0])/2,c=(n.max[1]-n.min[1])/2,l=(n.max[2]-n.min[2])/2,h=new Au(e,new ga,!1,!1,4e5);h.isolation=50;const u=h.field,d=e;for(let y=0;y<d;y++){const w=a+(y/(d-1)*2-1)*l;for(let D=0;D<d;D++){const I=s+(D/(d-1)*2-1)*c;for(let F=0;F<d;F++){const H=r+(F/(d-1)*2-1)*o;u[y*d*d+D*d+F]=Math.max(0,Math.min(100,50-i.sdf(H,I,w)*40))}}}h.update();const f=h.count,g=new Float32Array(f*3),v=new Float32Array(f*3),m=new Float32Array(f*3),p=h.positionArray,S=h.normalArray,b=i.palette.map(y=>new Ht(y)),M=new Ht;for(let y=0;y<f;y++){const w=r+p[y*3]*o,D=s+p[y*3+1]*c,I=a+p[y*3+2]*l;g[y*3]=w,g[y*3+1]=D,g[y*3+2]=I;let F=S[y*3]/o,H=S[y*3+1]/c,$=S[y*3+2]/l;const V=Math.hypot(F,H,$)||1;F/=V,H/=V,$/=V,v[y*3]=F,v[y*3+1]=H,v[y*3+2]=$;const Q=i.region(w,D,I);M.copy(b[Q]??b[0]),i.tint?.(Q,w,D,I,M);const rt=.94+.06*Math.sin(D*1.7+I*.9)*Math.cos(w*2.3);m[y*3]=M.r*rt,m[y*3+1]=M.g*rt,m[y*3+2]=M.b*rt}h.geometry.dispose();let E;if(i.fur){E=new Float32Array(f);for(let y=0;y<f;y++)E[y]=i.furLen?i.furLen(g[y*3],g[y*3+1],g[y*3+2]):1}const T=new Uint16Array(f*4),A=new Float32Array(f*4),R=t.map((y,w)=>({i:w,a:y.a,b:y.b,reach:y.reach??1/0,name:y.name})),_=i.capture,x=i.weights??"sharp";for(let y=0;y<f;y++){const w=g[y*3],D=g[y*3+1],I=g[y*3+2];let F=1/0,H=1/0,$=0,V=0;for(const gt of R){if(_&&!_(gt,w,D,I))continue;const Ct=gt.b[0]-gt.a[0],Nt=gt.b[1]-gt.a[1],et=gt.b[2]-gt.a[2],W=w-gt.a[0],Z=D-gt.a[1],N=I-gt.a[2],B=Math.max(0,Math.min(1,(W*Ct+Z*Nt+N*et)/(Ct*Ct+Nt*Nt+et*et||1))),k=Math.hypot(W-Ct*B,Z-Nt*B,N-et*B);k>gt.reach||(k<F?(H=F,V=$,F=k,$=gt.i):k<H&&(H=k,V=gt.i))}isFinite(H)||(H=F,V=$);const Q=x==="rigid"?1:x==="soft"?1/Math.pow(F+1.2,2):1/Math.pow(F+.3,4),rt=x==="rigid"?0:x==="soft"?1/Math.pow(H+1.2,2):1/Math.pow(H+.3,4),ct=Q+rt;T[y*4]=$,T[y*4+1]=V,A[y*4]=Q/ct,A[y*4+1]=rt/ct}return{position:g,normal:v,color:m,skinIndex:T,skinWeight:A,aFur:E}}const Rv=(i,t=i.res??88)=>({body:t,fur:Math.max(32,Math.round(t*.6))});function Cv(i){const t=new Map;let e=null;for(const n of i){const r=new mu;if(r.name=n.name,n.parent){const s=i.find(a=>a.name===n.parent);r.position.set(n.a[0]-s.a[0],n.a[1]-s.a[1],n.a[2]-s.a[2]),t.get(n.parent).add(r)}else r.position.set(n.a[0],n.a[1],n.a[2]),e=r;t.set(n.name,r)}return{bones:t,root:e}}function no(i,t=i.res??88,e){const n=performance.now(),r=Rv(i,t),{bones:s,root:a}=Cv(i.segs);let o,c=[];if(i.body){const l=i.body,h=e?sc(e.body):ah(l,i.segs,r.body),u=l.surface==="scales"||l.surface==="fur"?void 0:l.surface,d=new pu(h,wv(!!l.fur||l.surface==="fur",u));d.castShadow=!0,d.receiveShadow=!0,d.frustumCulled=!1,d.add(a),d.bind(new Sc(i.segs.map(f=>s.get(f.name)))),l.fur&&(i.furShells??10)>0&&(c=Sv(d,e?.fur?sc(e.fur):ah(l,i.segs,r.fur),l.fur,i.furShells??10)),o=d}else{const l=new hn;l.add(a),o=l}if(i.dress){const l=new Map;i.dress({bones:s,segs:i.segs,at(h,u,d,f,g){const v=i.segs.find(m=>m.name===u);return h.position.set(d-v.a[0],f-v.a[1],g-v.a[2]),h.traverse(m=>{m.isMesh&&(m.castShadow=!0,m.receiveShadow=!0)}),s.get(u).add(h),h},std(h){const u=JSON.stringify(h);let d=l.get(u);return d||(d=new xi(h),l.set(u,d)),d}})}return o.name=i.id,{def:i,root:o,bones:s,fur:c,ms:performance.now()-n}}const nt=(i,t,e)=>{const n=Math.max(e-Math.abs(i-t),0)/e;return Math.min(i,t)-n*n*e*.25};function Ee(i,t,e,n,r,s,a){const o=i-n,c=t-r,l=e-s;return Math.sqrt(o*o+c*c+l*l)-a}function yt(i,t,e,n,r,s,a,o,c,l,h){const u=a-n,d=o-r,f=c-s,g=i-n,v=t-r,m=e-s,p=Math.max(0,Math.min(1,(g*u+v*d+m*f)/(u*u+d*d+f*f))),S=g-u*p,b=v-d*p,M=m-f*p;return Math.sqrt(S*S+b*b+M*M)-(l+(h-l)*p)}function Ut(i,t,e,n,r,s,a,o,c){const l=(i-n)/a,h=(t-r)/o,u=(e-s)/c,d=Math.sqrt(l*l+h*h+u*u),f=Math.sqrt(l*l/a+h*h/o+u*u/c);return f>0?d*(d-1)/f:-Math.min(a,o,c)}const $i=2.1,Sr=[1.95,6,.2],Vn=[$i,3.4,.55],Hi=[$i,1,0],oh=[$i,.3,2],Fn=[2.9,11,.8],ln=[4.99,10.54,1.28],yi=[6.76,10.06,1.79],Ke=[[0,6.6,-2.6],[.5,4.6,-4.4],[1.6,2.4,-5.3],[3,1.1,-5.2],[4.5,.85,-4.1]],ch=[1.15,1.45,1.4,1.2,.75],ve=[0,14.4,.6],Lv=[{name:"pelvis",a:[0,6,0],b:[0,7.6,0],parent:null},{name:"spine1",a:[0,7.6,0],b:[0,9.4,.1],parent:"pelvis"},{name:"spine2",a:[0,9.4,.1],b:[0,11.4,.1],parent:"spine1"},{name:"neck",a:[0,11.4,.1],b:[0,ve[1]-1.6,ve[2]-.25],parent:"spine2"},{name:"head",a:[0,ve[1]-1.6,ve[2]-.25],b:[0,ve[1]+1.6,ve[2]+.1],parent:"neck"},{name:"jaw",a:[0,ve[1]-1.1,ve[2]+1.1],b:[0,ve[1]-1.2,ve[2]+2.9],parent:"head",reach:0},{name:"tail1",a:Ke[0],b:Ke[1],parent:"pelvis"},{name:"tail2",a:Ke[1],b:Ke[2],parent:"tail1"},{name:"tail3",a:Ke[2],b:Ke[3],parent:"tail2"},{name:"tail4",a:Ke[3],b:Ke[4],parent:"tail3"},{name:"thighL",a:Sr,b:Vn,parent:"pelvis"},{name:"shinL",a:Vn,b:Hi,parent:"thighL"},{name:"footL",a:Hi,b:oh,parent:"shinL"},{name:"thighR",a:Un(Sr),b:Un(Vn),parent:"pelvis"},{name:"shinR",a:Un(Vn),b:Un(Hi),parent:"thighR"},{name:"footR",a:Un(Hi),b:Un(oh),parent:"shinR"},{name:"armL",a:Fn,b:ln,parent:"spine2"},{name:"forearmL",a:ln,b:yi,parent:"armL"},{name:"armR",a:Un(Fn),b:Un(ln),parent:"spine2"},{name:"forearmR",a:Un(ln),b:Un(yi),parent:"armR"}];function Un(i){return[-i[0],i[1],i[2]]}const Pv={min:[-8.6,-.4,-7.2],max:[8.6,18.4,5.8]},ni=[.98,ve[1]+.33,ve[2]+1.97],Gi=[0,ve[1]-.5,ve[2]+4.05],Rn=Lc(Cu(yi,ln)),io=Lc([-Rn[2],0,Rn[0]]);function Cu(i,t){return[i[0]-t[0],i[1]-t[1],i[2]-t[2]]}function Lc(i){const t=Math.hypot(i[0],i[1],i[2]);return[i[0]/t,i[1]/t,i[2]/t]}const Ir=(i,t,e,n=0)=>[i[0]+Rn[0]*t+io[0]*e,i[1]+Rn[1]*t+io[1]*e+n,i[2]+Rn[2]*t+io[2]*e],En=Ir(yi,.35,0),Dv=Ir(En,1.3,0),Lu=(i,t,e)=>(i-yi[0])*Rn[0]+(t-yi[1])*Rn[1]+(e-yi[2])*Rn[2],Pu=[-.42,-.14,.14,.42].map(i=>[Ir(En,.35,i*1.1),Ir(En,1.15-Math.abs(i)*.5,i*1.35,-.12)]);Pu.push([Ir(En,-.1,.45),Ir(En,.45,.95,-.1)]);const Iv=[-.5,-.17,.17,.5].map(i=>[[$i+i*1.1,.3,1.8],[$i+i*1.3,.22,2.7-Math.abs(i)*.4]]),pi=(i,t,e,n,r,s,a)=>yt(i,t,e,n[0],n[1],n[2],r[0],r[1],r[2],s,a),pr=2.5;let lh=NaN,hh=NaN,uh=NaN;const mi={body:0,head:0,arm:0,leg:0,tail:0,min:0};function ms(i,t,e){if(i===lh&&t===hh&&e===uh)return mi;lh=i,hh=t,uh=e;const n=Math.abs(i);let r=Ee(i,t,e,0,9.2,.2,5.6);r<pr&&(r=Ut(i,t,e,0,7.7,.35,3.85,3.35,3.4),r=nt(r,Ut(i,t,e,0,10.3,.3,3,2.1,2.7),1.6),r=nt(r,Ut(i,t,e,0,6.9,-1.2,3.4,2.6,2.7),1.2),r=nt(r,Ee(n,t,e,Fn[0],Fn[1],Fn[2],.85),.7),r=nt(r,yt(i,t,e,0,11,.2,0,ve[1]-1.4,ve[2]-.15,2.1,1.7),.8)),mi.body=r;const s=t-ve[1],a=e-ve[2];let o=Ee(i,s,a,0,.6,.5,4.3);o<pr&&(o=Ut(i,s,a,0,0,0,2.38,2.05,2.21),o=nt(o,Ut(n,s,a,1.8,-.66,.25,1.15,1.23,1.31),.66),o=nt(o,yt(i,s,a,0,-.25,1.48,0,-.57,3.6,1.11,.45),.5),o=nt(o,yt(i,s,a,0,-1.07,1.15,0,-1.23,2.95,.78,.41),.33),o=nt(o,Ut(n,s,a,1.44,2.05,-.66,.78,1.03,.34),.29),o=Math.max(o,-Ee(n,t,e,ni[0]+.05,ni[1],ni[2]+.2,.34))),mi.head=o;let c=pi(n,t,e,Fn,Dv,1.6,1.6);if(c<pr&&(c=pi(n,t,e,Fn,ln,.72,.8),c=nt(c,Ee(n,t,e,(Fn[0]+ln[0])/2,(Fn[1]+ln[1])/2,(Fn[2]+ln[2])/2,.9),.6),c=nt(c,pi(n,t,e,ln,yi,.8,.6),.4),Ee(n,t,e,En[0],En[1],En[2],1.6)<pr)){c=nt(c,Ut(n,t,e,En[0],En[1],En[2],.62,.38,.62),.3);for(const u of Pu)c=nt(c,pi(n,t,e,u[0],u[1],.24,.17),.14)}mi.arm=c;let l=yt(n,t,e,Sr[0],Sr[1],Sr[2],$i,.6,1,2,2);if(l<pr&&(l=pi(n,t,e,Sr,Vn,1.42,1.1),l=nt(l,pi(n,t,e,Vn,Hi,1.08,.85),.5),t<2.6)){l=nt(l,Math.max(Ut(n,t,e,$i,.45,.75,.95,.6,1.75),-t),.45);for(const u of Iv)l=nt(l,pi(n,t,e,u[0],u[1],.26,.18),.15)}mi.leg=l;let h=Ee(i,t,e,2,3.4,-4.4,5.4);if(h<pr){h=1e9;for(let u=0;u+1<Ke.length;u++)h=nt(h,pi(i,t,e,Ke[u],Ke[u+1],ch[u],ch[u+1]),.5)}return mi.tail=h,mi.min=Math.min(r,o,c,l,h),mi}function Uv(i,t,e){const n=ms(i,t,e);let r=nt(n.body,n.head,.6);return r=nt(r,n.arm,.5),r=nt(r,n.leg,.7),nt(r,n.tail,.6)}function Nv(i,t,e){let n=0,r=1/0,s=0;for(let a=0;a+1<Ke.length;a++){const o=Ke[a],c=Ke[a+1],l=c[0]-o[0],h=c[1]-o[1],u=c[2]-o[2],d=l*l+h*h+u*u,f=Math.max(0,Math.min(1,((i-o[0])*l+(t-o[1])*h+(e-o[2])*u)/d)),g=i-o[0]-l*f,v=t-o[1]-h*f,m=e-o[2]-u*f,p=g*g+v*v+m*m;p<r&&(r=p,n=s+f*Math.sqrt(d)),s+=Math.sqrt(d)}return n}function Fv(i,t,e){const n=Math.abs(i);if(Math.hypot(i,t-Gi[1],e-Gi[2])<.62)return 3;const r=ms(i,t,e),s=r.min;if(r.head===s){const a=t-ve[1],o=e-ve[2];if(o>.2&&a>-1.9){const c=n-1.1,l=a-.22+.32*c;if((c/1.25)**2+(l/.66)**2<1||n<.34&&a>-.35&&a<2.4&&o>.6)return 2;const h=n-1.05,u=a-1.12+.18*h;if((h/1)**2+(u/.4)**2<1||a<-.15+.25*Math.max(0,n-1.2)&&o>.5)return 1}return a>2.75&&n>.98?1:0}if(r.tail===s){const a=Nv(i,t,e);return a>7.9||a%2<.85?2:4}return r.arm===s?Lu(n,t,e)>-.25?5:0:r.leg===s?t<1.3?5:0:e>1.2&&(i/2.4)**2+((t-7.9)/3.1)**2<1?4:0}function Ov(i,t,e){const n=Math.abs(i),r=Math.hypot(n-ni[0],t-ni[1],e-ni[2]);if(r<.62||Math.hypot(i,t-Gi[1],e-Gi[2])<.85)return 0;const s=ms(i,t,e),a=s.min;if(s.head===a){const o=t-ve[1],c=e-ve[2];return o>1.4&&n>.9&&c<.1?.5:n>1.4&&o<0&&c<1.5?1.35:c>1?.35+.4*Math.min(1,(r-.62)/1.3):.9}return s.tail===a?1.4:s.arm===a?Lu(n,t,e)>-.25?.25:.9:s.leg===a?t<1.3?.3:1:1.1}const Bv=.15,kv=new Map([["pelvis",0],["spine1",0],["spine2",0],["neck",1],["head",2],["jaw",2],["armL",3],["forearmL",3],["armR",4],["forearmR",4],["thighL",5],["shinL",5],["footL",5],["thighR",6],["shinR",6],["footR",6],["tail1",7],["tail2",7],["tail3",7],["tail4",7]]),ro=Lc(Cu(Hi,Vn)),zv=new Map([["forearm",(i,t,e)=>(i-ln[0])*Rn[0]+(t-ln[1])*Rn[1]+(e-ln[2])*Rn[2]>-.9],["shin",(i,t,e)=>(i-Vn[0])*ro[0]+(t-Vn[1])*ro[1]+(e-Vn[2])*ro[2]>-.9],["foot",(i,t)=>t<Hi[1]+.7]]),Ys=(i,t,e,n)=>{const r=zv.get(i.slice(0,-1));return!r||r(Math.abs(t),e,n)},Hv=(i,t,e,n)=>{const r=ms(t,e,n),s=r.min+Bv;switch(kv.get(i.name)){case 0:return r.body<=s;case 1:return e>10.6&&(r.body<=s&&Math.abs(t)<2.4||r.head<=s&&e<ve[1]-1.6);case 2:return r.head<=s&&e>ve[1]-2.1||r.body<=s&&e>12&&Math.abs(t)<2;case 3:return r.arm<=s&&t>.5&&Ys(i.name,t,e,n);case 4:return r.arm<=s&&t<-.5&&Ys(i.name,t,e,n);case 5:return r.leg<=s&&t>.2&&Ys(i.name,t,e,n);case 6:return r.leg<=s&&t<-.2&&Ys(i.name,t,e,n);case 7:return r.tail<=s;default:return!0}},Vv={id:"jimothy",name:"Jimothy",blurb:"The round Seattle raccoon, standing up",segs:Lv,body:{sdf:Uv,region:Fv,box:Pv,palette:[7103837,15130834,1841431,657930,9406332,3814192],weights:"soft",capture:Hv,fur:{length:1,density:7,tip:.18},furLen:Ov,tint(i,t,e,n,r){if(i!==0)return;n<-.5&&r.multiplyScalar(1-.2*Math.min(1,(-.5-n)/2.5));const s=ms(t,e,n);(s.arm===s.min||s.leg===s.min)&&r.multiplyScalar(.82)}},dress(i){const t=i.std({color:328965,roughness:.06,metalness:.1});for(const n of[-1,1])i.at(new Gt(new Re(.34,14,10),t),"head",n*ni[0],ni[1],ni[2]);const e=new Gt(new Re(.42,14,10),i.std({color:657930,roughness:.25}));e.scale.set(1.15,.8,.75),i.at(e,"head",Gi[0],Gi[1],Gi[2])},fit:{size:1.05,limb:.5},idle:{tail:.15},res:84,furShells:8};function Pc(i,t=!1){const e=i[0].index!==null,n=new Set(Object.keys(i[0].attributes)),r=new Set(Object.keys(i[0].morphAttributes)),s={},a={},o=i[0].morphTargetsRelative,c=new Ne;let l=0;for(let h=0;h<i.length;++h){const u=i[h];let d=0;if(e!==(u.index!==null))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". All geometries must have compatible attributes; make sure index attribute exists among all geometries, or in none of them."),null;for(const f in u.attributes){if(!n.has(f))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+'. All geometries must have compatible attributes; make sure "'+f+'" attribute exists among all geometries, or in none of them.'),null;s[f]===void 0&&(s[f]=[]),s[f].push(u.attributes[f]),d++}if(d!==n.size)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". Make sure all geometries have the same number of attributes."),null;if(o!==u.morphTargetsRelative)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". .morphTargetsRelative must be consistent throughout all geometries."),null;for(const f in u.morphAttributes){if(!r.has(f))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+".  .morphAttributes must be consistent throughout all geometries."),null;a[f]===void 0&&(a[f]=[]),a[f].push(u.morphAttributes[f])}if(t){let f;if(e)f=u.index.count;else if(u.attributes.position!==void 0)f=u.attributes.position.count;else return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". The geometry must have either an index or a position attribute"),null;c.addGroup(l,f,h),l+=f}}if(e){let h=0;const u=[];for(let d=0;d<i.length;++d){const f=i[d].index;for(let g=0;g<f.count;++g)u.push(f.getX(g)+h);h+=i[d].attributes.position.count}c.setIndex(u)}for(const h in s){const u=fh(s[h]);if(!u)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+h+" attribute."),null;c.setAttribute(h,u)}for(const h in a){const u=a[h][0].length;if(u===0)break;c.morphAttributes=c.morphAttributes||{},c.morphAttributes[h]=[];for(let d=0;d<u;++d){const f=[];for(let v=0;v<a[h].length;++v)f.push(a[h][v][d]);const g=fh(f);if(!g)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+h+" morphAttribute."),null;c.morphAttributes[h].push(g)}}return c}function fh(i){let t,e,n,r=-1,s=0;for(let l=0;l<i.length;++l){const h=i[l];if(t===void 0&&(t=h.array.constructor),t!==h.array.constructor)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.array must be of consistent array types across matching attributes."),null;if(e===void 0&&(e=h.itemSize),e!==h.itemSize)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.itemSize must be consistent across matching attributes."),null;if(n===void 0&&(n=h.normalized),n!==h.normalized)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.normalized must be consistent across matching attributes."),null;if(r===-1&&(r=h.gpuType),r!==h.gpuType)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.gpuType must be consistent across matching attributes."),null;s+=h.count*e}const a=new t(s),o=new oe(a,e,n);let c=0;for(let l=0;l<i.length;++l){const h=i[l];if(h.isInterleavedBufferAttribute){const u=c/e;for(let d=0,f=h.count;d<f;d++)for(let g=0;g<e;g++){const v=h.getComponent(d,g);o.setComponent(d+u,g,v)}}else a.set(h.array,c);c+=h.count*e}return r!==void 0&&(o.gpuType=r),o}const On=2.75,Gv=[{name:"pelvis",a:[0,9.6,0],b:[0,10.8,0],parent:null},{name:"spine1",a:[0,10.8,0],b:[0,12.6,0],parent:"pelvis"},{name:"spine2",a:[0,12.6,0],b:[0,15,0],parent:"spine1"},{name:"neck",a:[0,15,0],b:[0,15.9,0],parent:"spine2"},{name:"head",a:[0,15.9,0],b:[0,18.4,0],parent:"neck"},{name:"jaw",a:[0,16.5,1],b:[0,16.5,1.3],parent:"head",reach:0},{name:"tail1",a:[0,9.4,-.8],b:[0,9.2,-1.2],parent:"pelvis",reach:0},{name:"tail2",a:[0,9.2,-1.2],b:[0,9,-1.6],parent:"tail1",reach:0},{name:"tail3",a:[0,9,-1.6],b:[0,8.8,-2],parent:"tail2",reach:0},{name:"tail4",a:[0,8.8,-2],b:[0,8.6,-2.4],parent:"tail3",reach:0},{name:"thighL",a:[.95,9.6,0],b:[.95,5.3,0],parent:"pelvis"},{name:"shinL",a:[.95,5.3,0],b:[.95,1.2,0],parent:"thighL"},{name:"footL",a:[.95,1.2,0],b:[.95,.4,1.5],parent:"shinL"},{name:"thighR",a:[-.95,9.6,0],b:[-.95,5.3,0],parent:"pelvis"},{name:"shinR",a:[-.95,5.3,0],b:[-.95,1.2,0],parent:"thighR"},{name:"footR",a:[-.95,1.2,0],b:[-.95,.4,1.5],parent:"shinR"},{name:"armL",a:[On,14.4,0],b:[On,11.9,0],parent:"spine2"},{name:"forearmL",a:[On,11.9,0],b:[On,9.5,0],parent:"armL"},{name:"armR",a:[-On,14.4,0],b:[-On,11.9,0],parent:"spine2"},{name:"forearmR",a:[-On,11.9,0],b:[-On,9.5,0],parent:"armR"}],sn={y:17.15,a:1.4,b:1.22},dh=.3,ph=[{y0:.45,y1:5.4,r0:6,r1:2.9,n:13,bone:"pelvis",baubles:!0,garland:!0,lights:[.62,.3]},{y0:3.8,y1:8.4,r0:5.2,r1:2.5,n:12,bone:"pelvis",turn:.3,baubles:!0,garland:!0,lights:[.62,.3]},{y0:6.7,y1:11,r0:4.45,r1:2.15,n:11,bone:"pelvis",baubles:!0,garland:!0,lights:[.62,.3]},{y0:9.4,y1:13,r0:3.8,r1:1.8,n:9,bone:"spine1",turn:.2,baubles:!0,garland:!0,lights:[.62,.3]},{y0:11.7,y1:14.8,r0:3.25,r1:1.6,n:8,bone:"spine2",baubles:!0,garland:!0,lights:[.62,.3]},{y0:13.5,y1:16.2,r0:2.9,r1:1.45,n:8,bone:"spine2",turn:.4,baubles:!0,garland:!0,lights:[.6,.28]},{y0:15,y1:19.1,r0:2.75,r1:1.35,n:8,bone:"head",flare:.85,k:3,rows:16,hole:sn,baubles:!0},{y0:18.55,y1:20.3,r0:1.8,r1:.6,n:6,bone:"head",turn:Math.PI/6,baubles:!0,garland:!0,lights:[.62,.25]}];function mh(i){const t=i*On,e=i>0?"L":"R";return[{y0:12.1,y1:14.9,r0:1.3,r1:.55,n:7,bone:"arm"+e,x:t,drop:.35,rows:2},{y0:10.6,y1:12.7,r0:1.15,r1:.5,n:7,bone:"forearm"+e,x:t,turn:.4,drop:.32,rows:2},{y0:9.1,y1:11.3,r0:.95,r1:.42,n:6,bone:"forearm"+e,x:t,drop:.3,rows:2},{y0:7.7,y1:9.8,r0:.72,r1:.3,n:5,bone:"forearm"+e,x:t,turn:.3,drop:.25,rows:2}]}const Du=.5,Wv=1.4,Xv=4168267,qv=1195289,ts=(i,t)=>i.r1+(i.r0-i.r1)*Math.pow(Math.min(1,Math.max(0,1-t)),i.flare??Wv),so=(i,t)=>(t-i.y0)/(i.y1-i.y0),Iu=(i,t,e,n,r=0)=>n>0&&(t/(i.a+r))**2+((e-i.y)/(i.b+r))**2<1;function Yv(i){const t=i.k??1,e=i.n*2*t,n=i.y1-i.y0,r=(i.y0+i.y1)/2,s=i.x??0,a=i.turn??0,o=new Pn(i.r1,i.r0,n,e,i.rows??4,!0),c=o.attributes.position,l=new Float32Array(c.count*3),h=new Ht(Xv),u=new Ht(qv),d=new Ht;for(let f=0;f<c.count;f++){const g=c.getX(f),v=c.getY(f),m=c.getZ(f),p=(v+n/2)/n,S=Math.atan2(g,m);let b=ts(i,p),M=0;if(p<1e-4){const E=Math.round(S/(Math.PI*2/e)),T=(E%(2*t)+2*t)%(2*t),A=1-Math.min(T,2*t-T)/t;M=-(i.drop??Du)*A,b*=1+.05*A}c.setXYZ(f,s+Math.sin(S+a)*b,r+v+M,Math.cos(S+a)*b),d.copy(h).lerp(u,Math.pow(Math.min(1,Math.max(0,p)),.8)),l[f*3]=d.r,l[f*3+1]=d.g,l[f*3+2]=d.b}if(o.setAttribute("color",new oe(l,3)),i.hole){const f=o.index.array,g=[];for(let v=0;v<f.length;v+=3){const m=f[v],p=f[v+1],S=f[v+2],b=(c.getX(m)+c.getX(p)+c.getX(S))/3,M=(c.getY(m)+c.getY(p)+c.getY(S))/3,E=(c.getZ(m)+c.getZ(p)+c.getZ(S))/3;Iu(i.hole,b,M,E)||g.push(m,p,S)}o.setIndex(g)}return o.computeVertexNormals(),o}function gh(i,t,e,n){const r=ts(i,e)+n;return new U((i.x??0)+Math.sin(t)*r,i.y0+e*(i.y1-i.y0),Math.cos(t)*r)}function ao(i,t,e,n){const s=new Or(i,t,e,6,n),a=s.attributes.position,o=s.attributes.normal;for(let c=0;c<=t;c++)for(let l=0;l<=6;l++){const h=c*7+l,u=.42*Math.sin(c*2.2+l*(Math.PI*2*2/6));a.setXYZ(h,a.getX(h)+o.getX(h)*e*u,a.getY(h)+o.getY(h)*e*u,a.getZ(h)+o.getZ(h)*e*u)}return s.computeVertexNormals(),s}const vh=[16719904,16755216,2781439,16724160],$v=2;function jv(i){const t=new Map,e=new Set,n=(N,B,k=0,X=0,K=0)=>{N.position.set(k,X,K),N.updateMatrixWorld(!0),N.traverse(P=>{const ht=P;if(!ht.isMesh)return;const at=ht.material,_t=`${B}|${at.uuid}|${ht.name}`,ft=ht.geometry.index?ht.geometry.toNonIndexed():ht.geometry.clone();for(const xt of Object.keys(ft.attributes))xt!=="position"&&xt!=="normal"&&xt!=="color"&&ft.deleteAttribute(xt);ft.applyMatrix4(ht.matrixWorld);let vt=t.get(_t);vt||(vt={bone:B,mat:at,name:ht.name,geos:[]},t.set(_t,vt)),vt.geos.push(ft)})},r=(N,B,k="")=>{e.add(N);const X=new Gt(N,B);return X.name=k,X},s=i.std({color:15909267,emissive:15909267,emissiveIntensity:.18,roughness:.6}),a=i.std({color:1380623,roughness:.35}),o=i.std({color:5978656,roughness:.8}),c=i.std({color:15899278,roughness:.7}),l=i.std({color:16237849,roughness:.35,metalness:.05}),h=i.std({color:16777215,vertexColors:!0,roughness:.8,flatShading:!0,side:wn}),u=i.std({color:2055722,roughness:.85,flatShading:!0}),d=i.std({color:15250746,roughness:.3,metalness:.9}),f=i.std({color:15777605,roughness:.25,metalness:.9,flatShading:!0}),g=i.std({color:1522205,roughness:.7}),v=[i.std({color:13705003,roughness:.18,metalness:.55}),i.std({color:15316028,roughness:.2,metalness:.9}),i.std({color:2315209,roughness:.18,metalness:.55})],m=[];for(let N=0;N<$v;N++)for(let B=0;B<vh.length;B++){const k=i.std({color:2105376,emissive:vh[B],emissiveIntensity:1.2,roughness:.3,name:`bulb-${B}-${N}`});k.userData.phase=B*1.9+N*Math.PI,k.userData.rate=1.5+.6*((B+N*3)%4),m.push(k)}const p=new Re(.36,12,8),S=new Pn(.1,.1,.16,6),b=new Re(.24,8,6);let M=0,E=0;const T=(N,B,k=1)=>{const X=r(p,v[M++%v.length]);X.scale.setScalar(k),n(X,N,B.x,B.y,B.z);const K=r(S,d);K.scale.setScalar(k),n(K,N,B.x,B.y+.38*k,B.z)},A=(N,B,k=1)=>{const X=r(b,m[(E++*5+M)%m.length],"bulb");X.scale.set(k,1.3*k,k),n(X,N,B.x,B.y,B.z)};for(const[N,B]of[...ph,...mh(1),...mh(-1)].entries()){n(r(Yv(B),h),B.bone);const k=X=>B.bone!=="head"||!Iu(sn,X.x,X.y,X.z,dh+.5);if(B.baubles){const X=Math.PI*2/B.n,K=Math.min(1.25,.75+B.r0*.1);for(let P=N%2;P<B.n;P+=2){const ht=P*X+(B.turn??0),at=B.r0*1.05+.1*K,_t=B.y0-(B.drop??Du)-.36*K,ft=new U(Math.sin(ht)*at,_t,Math.cos(ht)*at);k(ft)&&T(B.bone,ft,K)}}if(B.garland){const X=[],K=N*1.9;for(let P=0;P<=48;P++){const ht=P/48;X.push(gh(B,K+ht*Math.PI*2,.18+.64*ht,.13))}n(r(ao(new Qn(X),120,.15+B.r0*.012,!1),f),B.bone)}if(B.lights){const[X,K]=B.lights,P=B.n-2,ht=.4+N*.7,at=Math.min(1.3,.8+B.r0*.1),_t=vt=>{const xt=Math.sin(vt*Math.PI*P);return gh(B,ht+vt*Math.PI*2,X-K*xt*xt,.1)},ft=[];for(let vt=0;vt<96;vt++)ft.push(_t(vt/96));n(r(new Or(new Qn(ft,!0),192,.045,4,!0),g),B.bone);for(let vt=0;vt<P;vt++)for(const xt of[.3,.7]){const Ft=_t((vt+xt)/P);k(Ft)&&A(B.bone,new U(Ft.x*1.04,Ft.y-.22*at,Ft.z*1.04),at)}}}for(const N of[-1,1]){const B=N>0?"L":"R",k=N*On,X=r(new Re(.75,10,6),u);n(X,"arm"+B,k,14.55,0);const K=r(new Ki(.42,1.5,8),u);K.rotation.x=Math.PI,n(K,"forearm"+B,k,7.1,0),T("forearm"+B,new U(k+N*.75,9.95,.35),.8),T("forearm"+B,new U(k-N*.2,8.55,.7),.7);for(const[P,ht]of[[11.6,.3],[10.2,-.5],[8.8,.9],[12.9,-.2]]){const at=.95-(12.9-P)*.1;A("forearm"+B,new U(k+Math.sin(ht*N)*at,P,Math.cos(ht)*at),.85)}}const R=ph.find(N=>N.hole),x=ts(R,so(R,sn.y))-.6,y=1.5,w=1.32,D=.55,I=(N,B)=>x+D*Math.sqrt(Math.max(0,1-(N/y)**2-((B-sn.y)/w)**2)),F=r(new Re(1,24,16),s);F.scale.set(y,w,D),n(F,"head",0,sn.y,x);const H=new Re(.2,12,8);for(const N of[-1,1]){const B=r(H,a);B.scale.set(.8,1.3,.45),n(B,"head",N*.5,17.5,I(N*.5,17.5));const k=r(H,c);k.scale.set(1.3,.8,.3),n(k,"head",N*.88,16.95,I(N*.88,16.95)-.02);const X=r(new $e(.78,.32,.3),o);X.rotation.set(0,N*.25,N*-.22),n(X,"head",N*.37,16.9,I(N*.37,16.9)+.02)}const $=r(new Dr(.46,.075,6,18,2.3),a);$.rotation.z=-Math.PI/2-1.15,n($,"head",0,16.85,I(0,16.4)+.02);const V=(N,B,k)=>{const X=[];for(let K=0;K<64;K++){const P=K/64*Math.PI*2,ht=Math.cos(P)*N,at=sn.y+Math.sin(P)*B,_t=ts(R,so(R,at))+k;X.push(new U(ht,at,Math.sqrt(Math.max(0,_t*_t-ht*ht))))}return new Qn(X,!0)};n(r(ao(V(sn.a,sn.b,.05),96,dh,!0),u),"head"),n(r(ao(V(sn.a+.38,sn.b+.38,.06),96,.12,!0),f),"head");for(let N=0;N<12;N++){const B=(N+.5)/12*Math.PI*2,k=Math.cos(B)*(sn.a+.72),X=sn.y+Math.sin(B)*(sn.b+.72),K=ts(R,so(R,X))+.12;A("head",new U(k,X,Math.sqrt(Math.max(0,K*K-k*k))),.9)}const Q=1.2,rt=new hn,ct=r(new Re(1,24,10,0,Math.PI*2,0,Math.PI/2),l);ct.scale.set(1.66*Q,1.42*Q,1.72*Q),rt.add(ct);const gt=r(new Dr(1,.11,6,20,Math.PI),l);gt.rotation.y=Math.PI/2,gt.scale.copy(ct.scale),rt.add(gt);const Ct=new Pr([new Rt(.8,0),new Rt(1,0),new Rt(1,.09),new Rt(.8,.09),new Rt(.8,0)],32),Nt=r(Ct,l);Nt.scale.set(2.05*Q,1,2.2*Q),Nt.position.set(0,-.02,.22*Q),rt.add(Nt);const et=r(new Tc(1,24),i.std({color:8022610,roughness:.9}));et.rotation.x=Math.PI/2,et.scale.set(1.62*Q,1.68*Q,1),et.position.y=.04,rt.add(et);const W=-1.3*Q;rt.position.set(0,0,-W);const Z=new hn;Z.add(rt),Z.rotation.set(-.26,0,.5,"ZXY"),n(Z,"head",0,19.65,W);for(const N of t.values()){const B=i.segs.find(K=>K.name===N.bone).a,k=Pc(N.geos);for(const K of N.geos)K.dispose();if(!k)throw new Error(`builder: parts on ${N.bone} would not merge`);k.translate(-B[0],-B[1],-B[2]);const X=new Gt(k,N.mat);X.name=N.name,i.at(X,N.bone,B[0],B[1],B[2]),(N.mat===s||N.mat===a||N.mat===c||N.mat===o)&&(X.receiveShadow=!1)}for(const N of e)N.dispose()}const _h=new WeakMap;function Zv(i,t){let e=_h.get(i);if(!e){const n=new Set;i.traverse(r=>{const s=r.material;r.name==="bulb"&&s&&n.add(s)}),e=[...n],_h.set(i,e)}for(const n of e){const r=.5+.5*Math.sin(t*n.userData.rate+n.userData.phase);n.emissiveIntensity=.55+1.35*r*r*r}}const Kv={id:"builder",name:"Builder",blurb:"A builder in a Christmas tree costume, tipping his hat",segs:Gv,dress:jv,tick:Zv,fit:{size:1,limb:.2}},Jv=[{name:"pelvis",a:[0,9.6,0],b:[0,10.6,0],parent:null},{name:"spine1",a:[0,10.6,0],b:[0,12.4,.1],parent:"pelvis"},{name:"spine2",a:[0,12.4,.1],b:[0,15,.1],parent:"spine1"},{name:"neck",a:[0,15,.1],b:[0,15.9,.15],parent:"spine2"},{name:"head",a:[0,15.9,.15],b:[0,18.4,.3],parent:"neck"},{name:"jaw",a:[0,16.5,-.3],b:[0,15.55,1],parent:"head",reach:0},{name:"tail1",a:[0,10.4,-1],b:[0,9.6,-1.1],parent:"pelvis",reach:0},{name:"tail2",a:[0,9.6,-1.1],b:[0,8.8,-1.2],parent:"tail1",reach:0},{name:"tail3",a:[0,8.8,-1.2],b:[0,8,-1.3],parent:"tail2",reach:0},{name:"tail4",a:[0,8,-1.3],b:[0,7.2,-1.4],parent:"tail3",reach:0},{name:"thighL",a:[1.1,9.6,0],b:[1.2,5.3,.2],parent:"pelvis"},{name:"shinL",a:[1.2,5.3,.2],b:[1.2,1.1,-.1],parent:"thighL"},{name:"footL",a:[1.2,1.1,-.1],b:[1.2,.35,1.4],parent:"shinL"},{name:"thighR",a:[-1.1,9.6,0],b:[-1.2,5.3,.2],parent:"pelvis"},{name:"shinR",a:[-1.2,5.3,.2],b:[-1.2,1.1,-.1],parent:"thighR"},{name:"footR",a:[-1.2,1.1,-.1],b:[-1.2,.35,1.4],parent:"shinR"},{name:"armL",a:[2.4,14.6,0],b:[2.72,11.9,-.05],parent:"spine2"},{name:"forearmL",a:[2.72,11.9,-.05],b:[2.85,9.45,.4],parent:"armL"},{name:"armR",a:[-2.4,14.6,0],b:[-2.72,11.9,-.05],parent:"spine2"},{name:"forearmR",a:[-2.72,11.9,-.05],b:[-2.85,9.45,.4],parent:"armR"}],hs=i=>new U(i[0],i[1],i[2]);function Uu(i,t){const e=hs(t).sub(hs(i)).normalize(),n=new U(1,0,0).addScaledVector(e,-e.x);n.lengthSq()<1e-6&&n.set(0,0,1),n.normalize();const r=new U().crossVectors(n,e);return new ne().makeBasis(n,e,r).setPosition(i[0],i[1],i[2])}const Kn=(i,t,e,n,r)=>vi(i,t,e,n,r,6,5,2);function vi(i,t,e,n,r,s=12,a=14,o=4){const c=hs(t).distanceTo(hs(i)),l=[];for(let u=0;u<=o;u++){const d=-Math.PI/2+u/o*(Math.PI/2);l.push(new Rt(Math.max(.001,e*Math.cos(d)),e*.75*Math.sin(d)))}const h=Math.min(.2,1.3*Math.max(e,r)/c);for(let u=1;u<a;u++){const d=u/a,f=n+(e-n)*Math.exp(-((d/h)**2))+(r-n)*Math.exp(-(((1-d)/h)**2));l.push(new Rt(f,d*c))}for(let u=0;u<=o;u++){const d=u/o*(Math.PI/2);l.push(new Rt(Math.max(.001,r*Math.cos(d)),c+r*.75*Math.sin(d)))}return new Pr(l,s).applyMatrix4(Uu(i,t))}function be(i,t,e=[1,1,1],n=12){return new Re(t,n,Math.max(6,Math.round(n*.7))).scale(e[0],e[1],e[2]).translate(i[0],i[1],i[2])}function Qv(i,t,e=24,n=8){return new Or(new Qn(i.map(hs)),e,t,n,!1)}function ac(i,t,e=24,n=8){return[Qv(i,t,e,n),be(i[0],t,[1,1,1],n),be(i[i.length-1],t,[1,1,1],n)]}function mn(i){const t=Pc(i.map(e=>e.index?e:e.toNonIndexed()),!1);for(const e of i)e.dispose();return t}const t_=i=>[-i[0],i[1],i[2]];function aa(i,t,e,n,r=6e4){const s=_=>(t.max[_]-t.min[_])*e/(e-7),a=_=>t.min[_]-2.5*s(_)/e,o=a(0)+s(0)/2,c=a(1)+s(1)/2,l=a(2)+s(2)/2,h=s(0)/2,u=s(1)/2,d=s(2)/2,f=new Au(e,new ga,!1,!1,r);f.isolation=50;const g=f.field,v=e,m=40;for(let _=0;_<v;_++){const x=l+(2*_/v-1)*d;for(let y=0;y<v;y++){const w=c+(2*y/v-1)*u;for(let D=0;D<v;D++){const I=o+(2*D/v-1)*h;g[_*v*v+y*v+D]=Math.max(0,Math.min(100,50-i(I,w,x)*m))}}}f.update();const p=f.count,S=f.positionArray,b=f.normalArray,M=new Float32Array(p*3),E=new Float32Array(p*3),T=n?new Float32Array(p*3):null,A=new Ht;for(let _=0;_<p;_++){const x=o+S[_*3]*h,y=c+S[_*3+1]*u,w=l+S[_*3+2]*d;M[_*3]=x,M[_*3+1]=y,M[_*3+2]=w;let D=b[_*3]/h,I=b[_*3+1]/u,F=b[_*3+2]/d;const H=Math.hypot(D,I,F)||1;D/=H,I/=H,F/=H,E[_*3]=D,E[_*3+1]=I,E[_*3+2]=F,T&&(A.setRGB(1,1,1),n(x,y,w,A),T[_*3]=A.r,T[_*3+1]=A.g,T[_*3+2]=A.b)}f.geometry.dispose();const R=new Ne;return R.setAttribute("position",new oe(M,3)),R.setAttribute("normal",new oe(E,3)),T&&R.setAttribute("color",new oe(T,3)),R.computeBoundingSphere(),R}const Wr=(i,t,e)=>-nt(-i,-t,e),Tr=[.43,17.02,1.06],xh=[.43,16.99,.74];function Nu(i,t,e,n,r){const s=Math.abs(i),o=e-n,c=r,l=Math.hypot(o,c),h=(s*o+(t-e)*c)/l;return Math.max(h,n-t)}function e_(i,t,e){const n=Math.abs(i);let r=Ut(i,t,e,0,17.45,-.12,1.1,1.13,1.32);r=nt(r,Ut(i,t,e,0,16.8,-.35,.98,.62,.95),.3),r=nt(r,Ut(i,t,e,0,16.68,.58,.8,.74,.72),.35),r=nt(r,Ut(n,t,e,.78,16.86,.55,.33,.3,.48),.22),r=nt(r,yt(n,t,e,.86,16.8,.35,.98,16.68,-.42,.15,.13),.15),r=nt(r,yt(n,t,e,.12,17.32,1.12,.78,17.36,.95,.17,.15),.2),r=Wr(r,-Ut(n,t,e,1.32,16.95,.05,.38,.5,.55),.18),r=Wr(r,-Ut(n,t,e,Tr[0],Tr[1],Tr[2],.36,.34,.5),.07);const s=Math.min(Nu(i,t,16.86,16.42,.19),Math.hypot(n-.08,t-16.47)-.11);return r=Wr(r,-Math.max(s,.8-e),.04),r=Wr(r,16.08-t,.1),r=Wr(r,-Ut(n,t,e,.8,16.25,.62,.22,.3,.35),.12),r}function n_(i,t,e,n){const r=Math.abs(i),s=Ut(r,t,e,Tr[0],Tr[1],Tr[2],.42,.4,.56),a=Math.max(Math.min(Nu(i,t,16.86,16.42,.19),Math.hypot(r-.08,t-16.47)-.11),.8-e)-.06,c=Math.max(0,Math.min(1,-Math.min(s,a)/.05))*(.75+.25*Math.max(0,Math.min(1,(1.2-e)/.4)));n.copy(c_).lerp(l_,c),c===0&&n.multiplyScalar(.94+.06*Math.max(0,Math.min(1,(t-16.3)/1.2)))}function i_(i,t,e,n,r,s,a){const o=r-e,c=s-n,l=Math.max(0,Math.min(1,((i-e)*o+(t-n)*c)/(o*o+c*c)));return Math.hypot(i-e-o*l,t-n-c*l)-a}function r_(i,t,e){const n=Math.abs(i);let r=yt(n,t,e,0,15.62,1,.5,15.66,.66,.17,.17);return r=nt(r,yt(n,t,e,.5,15.66,.66,.78,15.74,-.12,.17,.16),.1),r=nt(r,Math.max(i_(t,e,15.74,-.14,16.4,-.3,.2),Math.abs(n-.8)-.07),.08),r=nt(r,Ut(n,t,e,.82,16.45,-.3,.15,.11,.13),.06),r=nt(r,Ut(i,t,e,0,15.6,1,.33,.21,.17),.1),r=nt(r,yt(n,t,e,0,15.8,1.02,.52,15.8,.62,.12,.12),.08),r}function s_(i,t,e){const n=Math.abs(i),r=Math.abs(Math.hypot(n-.25,t-10.95,e-.75)-1.4)-.09;let s=Math.max(r,Ut(n,t,e,1.2,10.5,-.18,.78,.7,.85));return s=nt(s,yt(n,t,e,.6,11,-.45,1.55,11.05,.2,.1,.1),.12),s=nt(s,Ut(i,t,e,0,9.95,-.78,.48,.72,.22),.15),s=nt(s,yt(n,t,e,.38,10.35,-.72,.85,10.4,-.45,.17,.15),.12),s=nt(s,yt(n,t,e,1.25,10.15,-.15,1,9.62,0,.24,.24),.15),s=nt(s,Ee(n,t,e,.92,9.6,0,.32),.12),s=Math.min(s,Math.hypot(Math.hypot(t-9.6,e)-.36,n-1)-.1),s=nt(s,yt(n,t,e,.95,9.48,.28,.12,9.3,.72,.15,.14),.1),s=nt(s,yt(n,t,e,.12,9.32,.72,.1,9.02,.66,.15,.15),.1),s=nt(s,yt(n,t,e,1,9.38,-.2,.78,8.92,-.05,.18,.17),.1),s=nt(s,yt(n,t,e,.78,8.92,-.05,.12,9.04,.62,.13,.12),.1),s}function oo(i,t,e,n,r){return[new Pn(t,t*1.08,e,12).translate(i[0],i[1],i[2]),new $e(n,e*.42,.18).translate(i[0],i[1]+.02,i[2]-t*.6),new $e(.15,e*.55,r).rotateX(.35).translate(i[0],i[1]-.05,i[2]-t-r*.42)]}function Mh(i){const t=[],e=[1.05,1.42,1.64,1.76,1.8,1.74,1.6],n=[.95,1.06,1.12,1.14,1.12,1.06,.96],r=[.32,.48,.62,.72,.8,.85,.85];for(let s=0;s<7;s++){const a=14.55-s*.4,o=e[s],c=.98,l=n[s],h=s>=5,u=[[.26,a+.04,-.78]],d=h?.74*Math.PI:Math.PI-Math.asin(Math.min(.9,.42/o));for(let f=0;f<=7;f++){const g=.14*Math.PI+f/7*(d-.14*Math.PI),v=-Math.cos(g)*(g<Math.PI/2?c:l),m=a-r[s]*Math.pow((g-.14*Math.PI)/(.86*Math.PI),1.3);u.push([o*Math.sin(g),m,v])}if(h){const f=u[u.length-1];u.push([.62,f[1]+.25+(s-5)*.2,1.02],[.26,12.62,1.06])}else u.push([.24,u[u.length-1][1]+.04,l*.98]);t.push(...ac(u.map(f=>[f[0]*i,f[1],f[2]]),s===0?.13:.12,28,7))}return t}function a_(i,t){const e=Uu(i,[i[0]+t[0],i[1]+t[1],i[2]+t[2]]),n=1.35,r=(u,d,f)=>{const g=new U(u*n,d*n,f*n).applyMatrix4(e);return[g.x,g.y,g.z]},s=[];for(const[u,d,f]of[[0,.1,.16],[0,.1,-.02],[0,.1,-.2],[.02,.3,.2],[.02,.3,0],[.02,.3,-.18]])s.push(be(r(u,d,f),.14,[1,1,1],8));const a=[[.21,1],[.07,1.08],[-.07,1],[-.2,.82]];for(const[u,d]of a){const f=r(.02,.4,u*.85),g=r(0,.4+.55*d,u),v=r(-.07,.4+.92*d,u*1.05),m=r(-.17,.4+1.15*d,u*1.08),p=r(-.28,.4+1.3*d,u*1.08);s.push(Kn(f,g,.1,.075,.105),Kn(g,v,.1,.07,.095),Kn(v,m,.09,.065,.085),Kn(m,p,.08,.06,.065))}const o=r(0,.25,.26),c=r(-.05,.6,.48),l=r(-.1,.88,.58),h=r(-.16,1.08,.62);return s.push(Kn(o,c,.11,.085,.1),Kn(c,l,.1,.075,.09),Kn(l,h,.09,.065,.065)),s}function o_(){const i=[];i.push(be([1.2,.88,0],.27)),i.push(be([1.24,.44,-.3],1,[.27,.32,.44]));for(const[s,a,o]of[[.98,.62,.36],[1.22,.62,.34],[1.46,.55,.22],[1.08,.55,.6],[1.32,.52,.56]])i.push(be([s,a,o],.17,[1,1,1],8));const t=[.95,1.12,1.28,1.42,1.55],e=[.84,1.08,1.3,1.5,1.68],n=[.1,.075,.07,.065,.065],r=[.42,.34,.3,.27,.24];for(let s=0;s<5;s++){const a=[t[s],.5,.62],o=[e[s],.22,1.38-s*.05];i.push(Kn(a,o,n[s]*1.3,n[s],n[s]*1.35));const c=[o[0]+(s===0?-.02:.02*s),.15,o[2]+r[s]];i.push(Kn(o,c,n[s]*1.05,n[s]*.8,n[s]*.85))}return i}const Fu=15656396,c_=new Ht(Fu),l_=new Ht(1905164),h_=5832490;function u_(i){const t=i.std({color:Fu,roughness:.42,metalness:0,emissive:2894368,emissiveIntensity:1}),e=i.std({color:16777215,vertexColors:!0,roughness:.42,metalness:0,emissive:2894368,emissiveIntensity:1}),n=i.std({color:1182214,roughness:.9}),r=i.std({color:0,emissive:h_,emissiveIntensity:1,roughness:1}),s=(f,g,v=t)=>{for(const m of["L","R"]){const p=new Gt(f,v);p.name=`skelly-${g}${m}`,m==="R"&&(p.scale.x=-1),i.at(p,g+m,0,0,0)}},a=(f,g,v=t,m=`skelly-${g}`)=>{const p=new Gt(f,v);return p.name=m,i.at(p,g,0,0,0),p},o=aa(e_,{min:[-1.25,15.95,-1.5],max:[1.25,18.65,1.4]},52,n_,4e4);a(o,"head",e);const c=mn([be(xh,.1,[1,1.1,.7],10),be(t_(xh),.1,[1,1.1,.7],10)]);a(c,"head",r,"skelly-embers");const l=(f,g,v,m,p)=>{const S=[];for(let b=0;b<10;b++){const M=-1.05+b/9*2.1;S.push(new wc(.075,g,2,7).scale(1,1,.75).rotateY(M).translate(v*Math.sin(M),f,p+m*Math.cos(M)))}return S};a(mn(l(16.15,.17,.6,.78,.47)),"head",t,"skelly-teeth"),a(mn([be([0,15.98,.8],1,[.58,.24,.4])]),"head",n,"skelly-mouth"),a(aa(r_,{min:[-1,15.36,-.55],max:[1,16.6,1.22]},36,void 0,12e3),"jaw"),a(mn(l(15.88,.15,.56,.74,.47)),"jaw",t,"skelly-lowerteeth"),a(mn([0,1,2,3].flatMap(f=>oo([0,15.12+f*.25,-.22],.25,.19,.72,.3))),"neck"),a(mn([...[0,1,2,3,4,5].flatMap(f=>oo([0,12.55+f*.4,-.82],.25,.26,.6,.28)),...Mh(1),...Mh(-1),be([0,13.55,1.08],1,[.26,1.05,.12],12),be([0,14.42,1],1,[.36,.32,.13],10),...ac([[.22,14.72,1.02],[.85,14.86,.9],[1.55,14.98,.42],[2.18,15.02,.02]],.13,20,8),...ac([[-.22,14.72,1.02],[-.85,14.86,.9],[-1.55,14.98,.42],[-2.18,15.02,.02]],.13,20,8),be([1.25,13.95,-1],1,[.62,.85,.09],12),be([-1.25,13.95,-1],1,[.62,.85,.09],12)]),"spine2"),a(mn([0,1,2,3].flatMap(f=>oo([0,10.85+f*.42,-.42],.36,.3,1.15,.45))),"spine1"),a(aa(s_,{min:[-1.75,8.72,-1.05],max:[1.75,11.2,1.05]},40,void 0,24e3),"pelvis"),s(mn([be([2.33,14.56,-.03],.36),vi([2.4,14.45,0],[2.71,12.08,-.05],.3,.2,.28),be([2.53,11.98,-.05],.21,[1,.9,1],10),be([2.88,11.98,-.06],.2,[1,.9,1],10)]),"arm");const h=[2.72,11.9,-.05],u=[2.85,9.45,.4],d=[u[0]-h[0],u[1]-h[1],u[2]-h[2]];s(mn([be([2.74,11.98,-.25],.21,[1,1.1,1],10),vi([2.76,11.85,-.2],[2.86,9.62,.22],.19,.13,.16,10),vi([2.66,11.72,.12],[2.86,9.62,.54],.16,.13,.21,10),...a_([u[0],u[1]-.05,u[2]],d)]),"forearm"),s(mn([be([1.12,9.62,.02],.36),vi([1.12,9.6,0],[1.55,9.24,-.03],.2,.18,.2,10),be([1.64,9.3,-.08],.3,[1,1.2,1]),vi([1.56,9.22,0],[1.22,5.62,.18],.28,.21,.34),be([1,5.5,.12],.29),be([1.42,5.5,.12],.29)]),"thigh"),s(mn([vi([1.19,5.12,.18],[1.16,1.28,-.08],.36,.18,.24),be([1,1.16,-.05],.17,[1,1.2,1],10),vi([1.52,4.95,.02],[1.47,1.3,-.16],.16,.09,.17,10),be([1.2,5.36,.62],.27,[1,1.1,.55])]),"shin"),s(mn(o_()),"foot")}const bh=new WeakMap,f_={id:"skeleton",name:"Skelly",blurb:"Bones, a grin, and green embers for eyes",segs:Jv,dress:u_,fit:{size:1.04,limb:.3},tick(i,t){let e=bh.get(i);if(!e){const r=[];i.traverse(s=>{s.name==="skelly-embers"&&r.push(s.material)}),e={jaw:i.getObjectByName("jaw")??null,embers:r},bh.set(i,e)}const n=.95+.3*Math.sin(t*2.1)+.1*Math.sin(t*7.3+1.1);for(const r of e.embers)r.emissiveIntensity=n;if(e.jaw){const r=t%4.6;e.jaw.rotation.x=r<.75?.05+.07*Math.abs(Math.sin(r*25)):.02}}},d_=[{name:"pelvis",a:[0,9.6,0],b:[0,10.6,0],parent:null},{name:"spine1",a:[0,10.6,0],b:[0,12.4,.1],parent:"pelvis"},{name:"spine2",a:[0,12.4,.1],b:[0,15,.1],parent:"spine1"},{name:"neck",a:[0,15,.1],b:[0,15.9,.15],parent:"spine2",reach:.8},{name:"head",a:[0,15.9,.15],b:[0,18.4,.3],parent:"neck"},{name:"jaw",a:[0,16.4,.9],b:[0,16.4,1.2],parent:"head",reach:0},{name:"tail1",a:[0,14.8,-1.2],b:[0,12.6,-1.4],parent:"spine2",reach:0},{name:"tail2",a:[0,12.6,-1.4],b:[0,10.4,-1.6],parent:"tail1",reach:0},{name:"tail3",a:[0,10.4,-1.6],b:[0,8.2,-1.8],parent:"tail2",reach:0},{name:"tail4",a:[0,8.2,-1.8],b:[0,6.2,-2],parent:"tail3",reach:0},{name:"thighL",a:[1.1,9.6,0],b:[1.2,5.3,.2],parent:"pelvis"},{name:"shinL",a:[1.2,5.3,.2],b:[1.2,1.1,-.1],parent:"thighL"},{name:"footL",a:[1.2,1.1,-.1],b:[1.2,.35,1.4],parent:"shinL"},{name:"thighR",a:[-1.1,9.6,0],b:[-1.2,5.3,.2],parent:"pelvis"},{name:"shinR",a:[-1.2,5.3,.2],b:[-1.2,1.1,-.1],parent:"thighR"},{name:"footR",a:[-1.2,1.1,-.1],b:[-1.2,.35,1.4],parent:"shinR"},{name:"armL",a:[2.5,14.55,0],b:[2.95,11.95,-.05],parent:"spine2"},{name:"forearmL",a:[2.95,11.95,-.05],b:[3.12,9.6,.35],parent:"armL"},{name:"armR",a:[-2.5,14.55,0],b:[-2.95,11.95,-.05],parent:"spine2"},{name:"forearmR",a:[-2.95,11.95,-.05],b:[-3.12,9.6,.35],parent:"armR"}],p_={min:[-4.2,-.5,-1.9],max:[4.2,17.1,2.3]},m_=[3.12,9.6,.35],Ou=(i,t,e)=>yt(i,t,e,3.05,10.55,.2,3.16,9,.45,.3,.3);function Dc(i,t,e){const n=Math.abs(i);let r=4;if(t>8.4&&(r=Ut(i,t,e,0,13,.05,1.74,2.15,1.2),r=nt(r,Ut(i,t,e,0,11.35,.15,1.62,1.1,1.12),.5),t>13.2&&(r=nt(r,yt(n,t,e,0,15,-.05,2.15,14.62,0,.5,.56),.5),r=nt(r,Math.hypot(Math.hypot(i,(e+.02)*1.15)-.78,t-15.18)-.2,.12),r=nt(r,yt(i,t,e,0,14.9,.05,0,15.6,.12,.62,.55),.2)),t<11.6&&(r=nt(r,Ut(i,t,e,0,10.05,0,1.78,1.05,1.15),.4))),t<10.9&&(r=nt(r,yt(n,t,e,1.08,9.6,0,1.2,5.3,.15,.88,.74),.35),t<6.4&&(r=nt(r,yt(n,t,e,1.2,5.3,.15,1.22,2.1,-.05,.74,.7),.25))),n>1.5&&t>8.8){const s=yt(n,t,e,2.5,14.55,0,2.95,11.95,-.05,.6,.55);r=t>14?nt(r,s,.3):Math.min(r,s),t<12.9&&(r=nt(r,yt(n,t,e,2.95,11.95,-.05,3.08,10,.28,.55,.52),.25),r=Math.max(r,-Ou(n,t,e)))}if(t<3.4){const s=nt(yt(n,t,e,1.22,2.3,-.05,1.22,.6,-.05,.5,.52),Math.max(Ut(n,t,e,1.22,.5,.55,.58,.5,1.3),-t),.3);r=Math.min(r,s)}return r}const oc=0,Bu=1,g_=2,ku=3,v_=4;function zu(i,t,e){const n=Math.abs(i);return Ou(n,t,e)<.06?v_:t<2.25&&n>.4?g_:t>15.38&&n<.8?ku:n>2.1&&t>9.2||t>10.72?oc:Bu}const __=`
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
  }`;function x_(){const i=new xi({vertexColors:!0,roughness:.88,metalness:0});return i.onBeforeCompile=t=>{t.vertexShader=t.vertexShader.replace("#include <common>",`#include <common>
 attribute vec3 aCloth; varying vec3 vCloth; varying vec3 vBind; varying vec3 vBindN;`).replace("#include <begin_vertex>",`#include <begin_vertex>
 vBind = position; vBindN = normal; vCloth = aCloth;`),t.fragmentShader=t.fragmentShader.replace("#include <common>",`#include <common>
`+__).replace("#include <color_fragment>",`#include <color_fragment>
 diffuseColor.rgb = cloth(diffuseColor.rgb, vBind, normalize(vBindN), vCloth);`)},i.customProgramCacheKey=()=>"jack-cloth-v2",i}const Ie=[0,17.15,.22],M_=1.82,An=1.38,Hu=.24;function Ic(i,t,e){const n=i-Ie[0],r=t-Ie[1],s=e-Ie[2],a=Math.hypot(n,s),o=Math.atan2(s,n),c=1-Math.sqrt(Math.abs(Math.cos(5*(o-Math.PI/2)))),l=1-.06*c;let h=(Math.hypot(a/l/M_,r/An)-1)*An;return h+=.32*Math.exp(-((a/.6)**2))*Math.min(1,Math.abs(r)/An),{d:h,groove:c}}function yh(i,t,e,n,r,s,a=0){const o=(n+r)/2,c=Math.cos(a),l=Math.sin(a),h=(i-e)*c-(t-o)*l,u=(i-e)*l+(t-o)*c+o,d=n-r,f=Math.hypot(d,s);return Math.max((Math.abs(h)*d+(u-n)*s)/f,r-u)}const Sh=(i,t,e,n,r,s)=>(Math.hypot((i-e)/r,(t-n)/s)-1)*Math.min(r,s),Eh=(i,t,e,n,r,s)=>{const a=Math.abs(i-e)-r,o=Math.abs(t-n)-s;return Math.hypot(Math.max(a,0),Math.max(o,0))+Math.min(Math.max(a,o),0)};function b_(i,t){const e=Math.abs(i);let n=yh(e,t,.66,.74,.14,.36,-.12);n=Math.min(n,yh(i,t,0,.1,-.2,.17));let r=Math.max(Sh(i,t,0,-.36,1.2,.64),-Sh(i,t,0,-.08,1.34,.56));return r=Math.max(r,-Eh(e,t,.32,-.7,.11,.12)),r=Math.max(r,-Eh(i,t,0,-.93,.12,.13)),Math.min(n,r)}function y_(i,t,e){const n=Ic(i,t,e).d;let r=Math.max(n,-(n+Hu));const s=Math.max(b_(i-Ie[0],t-Ie[1]),Ie[2]+.4-e);return r=Math.max(r,-s),r}const S_=new Ht(15233038),E_=new Ht(10108936),w_=new Ht(16757820),T_=new Ht(16737290);function A_(i,t,e,n){const{d:r,groove:s}=Ic(i,t,e);if(r<-.05){n.copy(w_).lerp(T_,Math.max(0,Math.min(1,(t-Ie[1]-An*.2)/(An*.8))));return}n.copy(S_).lerp(E_,Math.min(1,s*1.3)),n.multiplyScalar(.85+.15*(1-Math.abs(t-Ie[1])/An))}function R_(i){const t=i.std({color:16777215,vertexColors:!0,roughness:.5,metalness:0,emissive:16777215,emissiveIntensity:1});return t.onBeforeCompile=e=>{e.vertexShader=e.vertexShader.replace("#include <common>",`#include <common>
 attribute float aGlow; varying float vGlow;`).replace("#include <begin_vertex>",`#include <begin_vertex>
 vGlow = aGlow;`),e.fragmentShader=e.fragmentShader.replace("#include <common>",`#include <common>
 varying float vGlow;`).replace("#include <color_fragment>",`#include <color_fragment>
 vec3 glowHue = diffuseColor.rgb; diffuseColor.rgb *= 1.0 - 0.92 * vGlow;`).replace("#include <emissivemap_fragment>",`#include <emissivemap_fragment>
 totalEmissiveRadiance *= vGlow * glowHue;`)},t.customProgramCacheKey=()=>"jack-shell-v2",t}let oa=1;const Ze=()=>(oa=oa*1664525+1013904223>>>0,oa/4294967296),C_=new U(0,1,0),wh=[15255146,13937738,15916172,12884540].map(i=>new Ht(i));function Xr(i,t,e,n){const r=new Ki(n,e,4,1).translate(0,e/2,0);r.applyQuaternion(new Fe().setFromUnitVectors(C_,t.clone().normalize())).translate(i.x,i.y,i.z);const s=wh[Math.floor(Ze()*wh.length)],a=r.attributes.position.count,o=new Float32Array(a*3);for(let c=0;c<a;c++)o[c*3]=s.r,o[c*3+1]=s.g,o[c*3+2]=s.b;return r.setAttribute("color",new oe(o,3)),r}function qr(i,t){const e=i.clone().normalize(),n=Math.abs(e.y)<.9?new U(0,1,0):new U(1,0,0),r=new U().crossVectors(e,n).normalize(),s=new U().crossVectors(e,r),a=Ze()*Math.PI*2,o=Math.tan(t*Math.sqrt(Ze()));return e.addScaledVector(r,Math.cos(a)*o).addScaledVector(s,Math.sin(a)*o).normalize()}function jn(i){const t=Pc(i.map(e=>e.index?e.toNonIndexed():e),!1);for(const e of i)e.dispose();return t}function co(i,t){let e=0,n=3;for(let r=0;r<30;r++){const s=(e+n)/2;Dc(i,t,s)<0?e=s:n=s}return e}function Th(i,t,e){let n=0,r=3;for(let s=0;s<26;s++){const a=(n+r)/2;Dc(Math.cos(t)*a,i,e+Math.sin(t)*a)<0?n=a:r=a}return n}function $s(i,t,e,n){const r=Math.max(8,Math.round(t*18)),s=new Or(i,r,e,7,n),a=s.attributes.uv,o=a.count,c=new Float32Array(o*3),l=new Ht(13150312),h=new Ht(9071160),u=new Ht;for(let d=0;d<o;d++){const f=.5+.5*Math.sin((a.getX(d)*t*4.5+a.getY(d))*Math.PI*2);u.copy(l).lerp(h,f*f),c[d*3]=u.r,c[d*3+1]=u.g,c[d*3+2]=u.b}return s.setAttribute("color",new oe(c,3)),s}function L_(i){oa=7;const t=i.bones.get("pelvis").parent;if(t?.isSkinnedMesh){const et=t.geometry.attributes.position,W=new Float32Array(et.count*3);for(let Z=0;Z<et.count;Z++){const N=zu(et.getX(Z),et.getY(Z),et.getZ(Z));W[Z*3]=N===oc?1:0,W[Z*3+1]=N===Bu?1:0,W[Z*3+2]=N===ku?1:0}t.geometry.setAttribute("aCloth",new oe(W,3)),t.material.dispose(),t.material=x_()}const e=i.std({color:16777215,vertexColors:!0,roughness:.75,metalness:0}),n=i.std({color:16777215,vertexColors:!0,roughness:.9,metalness:0}),r=(et,W,Z,N)=>{for(const B of["L","R"]){const k=new Gt(et,Z);k.name=`jack-${N}${B}`,B==="R"&&(k.scale.x=-1),i.at(k,W+B,0,0,0)}},s=aa(y_,{min:[-1.92,Ie[1]-An-.05,Ie[2]-1.92],max:[1.92,Ie[1]+An+.05,Ie[2]+1.92]},48,A_,4e4),a=s.attributes.position,o=new Float32Array(a.count);for(let et=0;et<a.count;et++)o[et]=Math.max(0,Math.min(1,-Ic(a.getX(et),a.getY(et),a.getZ(et)).d/.16));s.setAttribute("aGlow",new oe(o,1));const c=new Gt(s,R_(i));c.name="jack-pumpkin",i.at(c,"head",0,0,0);const l=Ie[1]-An+Hu+.3,h=new hn;h.name="jack-flame";const u=new Gt(jn([new Re(.15,10,8).scale(1,1.1,1).translate(0,.15,0),new Ki(.148,.42,10,1,!0).translate(0,.36,0)]),i.std({color:0,emissive:16762976,emissiveIntensity:2.4}));u.name="jack-flamecore",h.add(u),i.at(h,"head",0,l,Ie[2]-.15);const d=Ie[1]+An-.22,f=new Pn(.16,.26,1.5,7,8).translate(0,.75,0);{const et=f.attributes.position;for(let W=0;W<et.count;W++){const Z=et.getY(W)/1.5,N=1+.6*Math.max(0,1-Z*5);et.setXYZ(W,et.getX(W)*N+.5*Z*Z,et.getY(W),et.getZ(W)*N-.1*Z*Z)}f.computeVertexNormals()}i.at(new Gt(f.translate(0,d,Ie[2]-.05),i.std({color:5990956,roughness:.85})),"head",0,0,0);const g=i.std({color:4863526,roughness:.95,side:wn}),v=[];for(let et=0;et<=10;et++){const W=1.08+et/10*1.12;v.push(new Rt(W,-.22*((W-1.08)/1.12)**2))}const m=[];for(let et=0;et<=10;et++){const W=et/10;m.push(new Rt(1.1-.24*W-(W>.85?(W-.85)*3.6:0),W*1.2))}const p=jn([new Pr(v,28),new Pr(m,28)]);{const et=p.attributes.position;for(let W=0;W<et.count;W++){const Z=et.getX(W),N=et.getY(W),B=et.getZ(W),k=N>.7?.2*Math.exp(-((Z/.5)**2))*Math.max(0,B):0;et.setXYZ(W,Z,N-.07*Math.max(0,Z)*Math.max(0,Math.hypot(Z,B)-1.08)-k*.6,B-k)}p.computeVertexNormals()}const S=new Dr(1.07,.08,6,28).rotateX(Math.PI/2).scale(1,2.4,1).translate(0,.2,0),b=new hn;b.add(new Gt(p,g),new Gt(S,i.std({color:1971986,roughness:.8}))),b.rotation.set(-.08,0,-.2),i.at(b,"head",.08,Ie[1]+An-.1,Ie[2]-.1);const M=[];for(let et=0;et<34;et++){const W=et/34*Math.PI*2+Ze()*.15,Z=.72,N=new U(Math.cos(W)*Z,15.3+Ze()*.1,Math.sin(W)*Z*.9),B=qr(new U(Math.cos(W)*.9,.7,Math.sin(W)*.9),.35);M.push(Xr(N,B,.45+Ze()*.5,.05))}const E=new Gt(jn(M),e);E.name="jack-collar",i.at(E,"spine2",0,0,0);const T=new U(2.95,11.95,-.05),A=new U(...m_),R=A.clone().sub(T).normalize(),_=[];for(let et=0;et<46;et++){const W=Ze()*Math.PI*2,Z=.26*Math.sqrt(Ze()),N=new U(Math.cos(W)*Z,0,Math.sin(W)*Z),B=A.clone().addScaledVector(R,.55).add(N);_.push(Xr(B,qr(R.clone().addScaledVector(N,1.4),.3),.8+Ze()*.9,.055))}r(jn(_),"forearm",e,"hand");const x=[];for(let et=0;et<26;et++){const W=et/26*Math.PI*2+Ze()*.2,Z=new U(1.22+Math.cos(W)*.62,2.2+Ze()*.12,-.05+Math.sin(W)*.62);x.push(Xr(Z,qr(new U(Math.cos(W),-1.1,Math.sin(W)),.3),.4+Ze()*.45,.05))}r(jn(x),"shin",e,"ankle");const y=[];for(let et=0;et<14;et++){const W=et/14*Math.PI*2,Z=Th(15.62,W,.1)+.04;y.push(new U(Math.cos(W)*Z,15.62,.1+Math.sin(W)*Z))}i.at(new Gt($s(new Qn(y,!0),3.6,.09,!0),n),"neck",0,0,0);const w=10.72,D=[];for(let et=0;et<24;et++){const W=et/24*Math.PI*2,Z=Th(w,W,.05)+.06;D.push(new U(Math.cos(W)*Z,w,.05+Math.sin(W)*Z))}const I=new Qn(D,!0),F=.55,H=co(F,w)+.1,$=new Qn([new U(F,w-.05,H),new U(F+.12,w-.6,H+.12),new U(F+.05,w-1.25,H+.08)]),V=new Qn([new U(F,w-.05,H),new U(F-.12,w-.5,H+.14),new U(F-.02,w-1,H+.1)]),Q=[];for(const et of[$,V]){const W=et.getPoint(1);for(let Z=0;Z<7;Z++)Q.push(Xr(W,qr(new U(0,-1,.1),.35),.22+Ze()*.2,.035))}const rt=new Re(.22,10,8).scale(1.2,.9,.8).translate(F,w,H),ct=new Float32Array(rt.attributes.position.count*3),gt=new Ht(11571288);for(let et=0;et<ct.length;et+=3)ct[et]=gt.r,ct[et+1]=gt.g,ct[et+2]=gt.b;rt.setAttribute("color",new oe(ct,3)),i.at(new Gt(jn([$s(I,11,.13,!0),$s($,1.3,.1,!1),$s(V,1,.1,!1),rt]),n),"pelvis",0,0,0),i.at(new Gt(jn(Q),e),"pelvis",0,0,0);const Ct=[],Nt=[];for(const et of[14.25,13.45,12.65]){const W=co(.13,et);Ct.push(new Pn(.12,.12,.07,10).rotateX(Math.PI/2).translate(.13,et,W+.02))}for(let et=0;et<5;et++)Nt.push(Xr(new U(.13,13.05,co(.13,13.05)-.05),qr(new U(.4,.3,1),.4),.35+Ze()*.25,.035));i.at(new Gt(jn(Ct),i.std({color:2759698,roughness:.5})),"spine2",0,0,0),i.at(new Gt(jn(Nt),e),"spine2",0,0,0)}const P_=(i,t,e,n)=>i.name.startsWith("thigh")?n>-1.6&&e<i.a[1]+.8&&Math.abs(Math.abs(t)-Math.abs(i.a[0]))<(e<i.a[1]+.3?1.3:.9):i.name.startsWith("arm")||i.name.startsWith("forearm")?Math.abs(t)>(e<12?2.2:e<14.1?1.88:2.1):!0,Ah=new WeakMap,D_={id:"pumpkin",name:"Jack",blurb:"A scarecrow with a candle-lit pumpkin head",segs:d_,body:{sdf:Dc,region:zu,box:p_,palette:[9181716,2307418,3810326,11044954,1708556],surface:"soft",weights:"sharp",capture:P_},dress:L_,fit:{size:1.08,limb:.6},res:76,tick(i,t){let e=Ah.get(i);if(!e){const a=[],o=[];i.traverse(c=>{c.name==="jack-pumpkin"&&a.push(c.material),c.name==="jack-flamecore"&&o.push(c.material)}),e={shell:a,core:o,flame:i.getObjectByName("jack-flame")??null},Ah.set(i,e)}const n=.5*Math.sin(t*1.7)+.3*Math.sin(t*7.9+1.3)+.22*Math.sin(t*13.3+.4)+.15*Math.sin(t*23.7+2.2),r=Math.max(0,Math.sin(t*.83+.5)-.92)*6,s=Math.max(.35,1+.36*n-r);for(const a of e.shell)a.emissiveIntensity=s;for(const a of e.core)a.emissiveIntensity=2.4*s;e.flame&&(e.flame.scale.set(1-.08*n,s*(1+.12*Math.sin(t*17)),1-.08*n),e.flame.rotation.z=.12*Math.sin(t*5.3))}},Vu=[{name:"pelvis",a:[0,9.6,0],b:[0,10.6,0],parent:null},{name:"spine1",a:[0,10.6,0],b:[0,12.4,.1],parent:"pelvis"},{name:"spine2",a:[0,12.4,.1],b:[0,15,.1],parent:"spine1"},{name:"neck",a:[0,15,.1],b:[0,15.9,.15],parent:"spine2",reach:.8},{name:"head",a:[0,15.9,.15],b:[0,18.4,.3],parent:"neck"},{name:"jaw",a:[0,16.4,.9],b:[0,16.4,1.2],parent:"head",reach:0},{name:"tail1",a:[0,14.8,-1.2],b:[0,12.6,-1.4],parent:"spine2",reach:1},{name:"tail2",a:[0,12.6,-1.4],b:[0,10.4,-1.6],parent:"tail1",reach:1},{name:"tail3",a:[0,10.4,-1.6],b:[0,8.2,-1.8],parent:"tail2",reach:1},{name:"tail4",a:[0,8.2,-1.8],b:[0,6.2,-2],parent:"tail3",reach:1},{name:"thighL",a:[1.1,9.6,0],b:[1.2,5.3,.2],parent:"pelvis"},{name:"shinL",a:[1.2,5.3,.2],b:[1.2,1.1,-.1],parent:"thighL"},{name:"footL",a:[1.2,1.1,-.1],b:[1.2,.35,1.4],parent:"shinL"},{name:"thighR",a:[-1.1,9.6,0],b:[-1.2,5.3,.2],parent:"pelvis"},{name:"shinR",a:[-1.2,5.3,.2],b:[-1.2,1.1,-.1],parent:"thighR"},{name:"footR",a:[-1.2,1.1,-.1],b:[-1.2,.35,1.4],parent:"shinR"},{name:"armL",a:[2.4,14.6,0],b:[2.72,11.9,-.05],parent:"spine2"},{name:"forearmL",a:[2.72,11.9,-.05],b:[2.85,9.45,.4],parent:"armL"},{name:"armR",a:[-2.4,14.6,0],b:[-2.72,11.9,-.05],parent:"spine2"},{name:"forearmR",a:[-2.72,11.9,-.05],b:[-2.85,9.45,.4],parent:"armR"}],Gu={min:[-4.2,-.4,-2.8],max:[4.2,20.4,2.6]};function I_(i,t,e,n){const r=Math.abs(i),s=1-.08*n;let a=Ut(i,t,e,0,13.35,.1,1.8*s,1.95,1.05*s);return a=nt(a,Ut(r,t,e,.85*s,13.75,.75,.95*s,.68,.5),.45),a=nt(a,Ut(i,t,e,0,13.75,-.35,1.95*s,1.3,.62),.4),a=nt(a,yt(r,t,e,0,15.35,-.2,1.85*s,14.95,-.1,.5,.36),.5),a=nt(a,Ut(i,t,e,0,11.6,.12,1.35*s,1.45,.92*s),.6),a=nt(a,Ut(i,t,e,0,10,0,1.68*s,1,1.02*s),.6),a=nt(a,Ut(r,t,e,.72,9.55,-.5,.82*s,.85,.62),.4),a=Math.max(a,-yt(i,t,e,0,14.6,-1.12,0,10.6,-.98,.16,.14)),a=nt(a,yt(i,t,e,0,14.9,-.05,0,16.3,.12,.6,.52),.4),a=nt(a,Ut(i,t,e,0,17.3,.1,.95,1.12,1.08),.3),a=nt(a,Ut(i,t,e,0,16.55,.4,.74,.74,.82),.35),a=nt(a,Ut(r,t,e,2.3*s,14.5,0,.7*s,.92,.78),.4),a=nt(a,yt(r,t,e,2.4,14.4,0,2.72,11.95,-.05,.56*s,.42*s),.3),a=nt(a,Ut(r,t,e,2.56,13.15,.12,.5*s,.95,.5*s),.3),a=nt(a,yt(r,t,e,2.72,11.9,-.05,2.85,9.6,.38,.46*s,.3*s),.25),a=nt(a,Ut(r,t,e,2.76,11.2,.05,.48*s,.8,.48*s),.3),a=nt(a,Ut(r,t,e,2.87,9,.48,.24,.52,.42),.2),a=nt(a,yt(r,t,e,2.8,9.35,.75,2.72,8.85,.95,.15,.12),.12),a=nt(a,yt(r,t,e,1.02,9.6,0,1.15,5.45,.2,.9*s,.56*s),.45),a=nt(a,Ut(r,t,e,1.12,7.7,.28,.8*s,1.6,.72*s),.4),a=nt(a,Ut(r,t,e,.8,8.3,0,.55*s,1.3,.6),.4),a=nt(a,Ee(r,t,e,1.17,5.3,.32,.52*s),.3),a=nt(a,yt(r,t,e,1.18,5.25,.15,1.2,1.15,-.1,.5*s,.3*s),.3),a=nt(a,Ut(r,t,e,1.2,3.95,-.28,.56*s,1.3,.6*s),.35),a=nt(a,Math.max(Ut(r,t,e,1.2,.5,.55,.46,.5,1.25),-t),.25),a}function Wu(i,t,e,n,r=0){const s=Math.abs(i);let a=I_(i,t,e,n==="valkyrie"?1:0);if(n==="valkyrie"){a=nt(a,Ut(i,t,e,0,13.6,.55,2.2,1.5,1),.4);{const o=Math.max(0,Math.min(1,(10.8-t)/3.4)),c=1.6+.75*o,l=Math.hypot(i/1.05,e/.8)-c;a=Math.min(a,Math.max(l,Math.abs(t-9.1)-1.7,-(Math.hypot(i/1.05,e/.8)-c+.32)))}a=nt(a,Ee(s,t,e,2.38,14.9,0,1),.3),a=nt(a,yt(s,t,e,1.2,4.6,.35,1.2,1.4,.2,.75,.62),.2),a=nt(a,Ee(i,t,e,0,17,.25,1.32),.3),a=nt(a,Ut(i,t,e,0,17.4,.2,1.42,1,1.42),.2);for(let o=0;o<3;o++)a=nt(a,yt(s,t,e,1.3,17.6+o*.25,.2-o*.35,2.3+o*.25,19+o*.35,-1-o*.5,.32-o*.06,.1),.2);a=nt(a,yt(i,t,e,0,16.6,-1.1,0,12.6,-1.5,.42,.26),.3);{const o=2.3+(14.8-t)*.12;a=Math.min(a,Math.max(Math.abs(i)-o,Math.abs(e+1.75+(14.8-t)*.03)-.2,t-14.8,4.6-t)-.08)}}else a=nt(a,Ut(i,t,e,0,17.3,.12,1.08,1.24,1.18),.25),a=nt(a,Ut(i,t,e,0,16.5,.45,.82,.72,.86),.25),a=nt(a,yt(i,t,e,0,18.42,-.7,0,18.5,.85,.16,.12),.2),a=nt(a,Ut(i,t,e,0,10.55,.05,1.55,.38,1.1),.15),a=nt(a,Ut(i,t,e,0,10.55,1.05,.55,.42,.22),.1),a=nt(a,yt(s,t,e,2.82,10.25,.3,2.86,9.5,.42,.4,.38),.15),a=nt(a,yt(s,t,e,1.2,3.2,-.05,1.2,1,-.08,.52,.48),.2);return a-r}function Xu(i,t,e,n){const r=Math.abs(i);if(n==="valkyrie")return t>17.6&&r>1.2||e<-.9&&t>12.4&&t<16.8&&r<.6?2:t>15.9&&t<17.2&&e>.6&&r<1?3:t>16.9&&t<17.3&&e>.6||Math.abs(t-10.85)<.25||t<7.6&&t>7.3||t>13.5&&t<14&&e>.8||r>2&&Math.abs(t-14.9)<.35?1:0;if(t>16.75&&t<17.5&&e>.9&&r<.95)return 2;if(Math.abs(t-10.6)<.45&&e>-1.5)return 3;if(t<3.2||t<10.4&&r>2.3&&t>8.2)return 1;if(e>.7&&r<1.7){const s=t-12.6-r*.55;if(s>0&&s<.35||s>.75&&s<1.1)return 1}return 0}const U_=[{name:"pelvis",a:[0,9.4,-.6],b:[0,10.4,0],parent:null},{name:"spine1",a:[0,10.4,0],b:[0,12.6,.8],parent:"pelvis"},{name:"spine2",a:[0,12.6,.8],b:[0,14.8,1.9],parent:"spine1"},{name:"neck",a:[0,14.8,1.9],b:[0,16,3],parent:"spine2",reach:1.6},{name:"head",a:[0,16,3],b:[0,16.6,5.8],parent:"neck"},{name:"jaw",a:[0,15.5,3.9],b:[0,15.3,6.6],parent:"head",reach:.8},{name:"tail1",a:[0,9.2,-1.6],b:[0,8.2,-3.6],parent:"pelvis",reach:1.8},{name:"tail2",a:[0,8.2,-3.6],b:[0,6.8,-5.2],parent:"tail1",reach:1.8},{name:"tail3",a:[0,6.8,-5.2],b:[0,5.3,-6.4],parent:"tail2",reach:1.6},{name:"tail4",a:[0,5.3,-6.4],b:[0,4,-7.2],parent:"tail3",reach:1.4},{name:"thighL",a:[1.6,9.2,-.3],b:[1.9,6,1.3],parent:"pelvis"},{name:"shinL",a:[1.9,6,1.3],b:[1.9,2.8,-.9],parent:"thighL"},{name:"footL",a:[1.9,2.8,-.9],b:[1.9,.4,1],parent:"shinL"},{name:"thighR",a:[-1.6,9.2,-.3],b:[-1.9,6,1.3],parent:"pelvis"},{name:"shinR",a:[-1.9,6,1.3],b:[-1.9,2.8,-.9],parent:"thighR"},{name:"footR",a:[-1.9,2.8,-.9],b:[-1.9,.4,1],parent:"shinR"},{name:"armL",a:[2.7,14.3,1.6],b:[3.3,11.2,2],parent:"spine2"},{name:"forearmL",a:[3.3,11.2,2],b:[3.2,8.2,3.2],parent:"armL"},{name:"armR",a:[-2.7,14.3,1.6],b:[-3.3,11.2,2],parent:"spine2"},{name:"forearmR",a:[-3.3,11.2,2],b:[-3.2,8.2,3.2],parent:"armR"}],N_={min:[-5,-.5,-8.6],max:[5,20.4,8.6]},ii=[.62,17.05,4.75],Rh=[0,16.35,7.35];function F_(i,t,e,n=0){const r=Math.abs(i);let s=Ut(i,t,e,0,13.4,1.4,2.6,2.5,2.1);s=nt(s,Ut(i,t,e,0,11.2,.4,1.7,1.6,1.4),.9),s=nt(s,Ut(i,t,e,0,9.8,-.4,2,1.2,1.5),.7),s=nt(s,Ut(i,t,e,0,15.1,1.6,2.3,1.5,2),.8),s=nt(s,Ee(r,t,e,2.5,14.2,1.5,1.05),.7);let a=Ut(i,t,e,0,16.9,3.6,1.35,1.25,1.55);a=nt(a,yt(i,t,e,0,16.7,4.6,0,16.3,7.1,.82,.45),.5),a=nt(a,yt(i,t,e,0,15.8,4.4,0,15.75,6.7,.55,.32),.35),a=nt(a,Ut(r,t,e,1.15,16.5,3.6,.55,.75,.9),.4),a=nt(a,yt(r,t,e,.75,17.8,3.1,1.05,19.4,2.7,.5,.06),.3),a=Math.max(a,-Ee(r,t,e,ii[0],ii[1],ii[2]+.12,.3)),s=nt(s,a,.6),s=nt(s,yt(r,t,e,2.7,14.3,1.6,3.3,11.2,2,.9,.72),.5),s=nt(s,yt(r,t,e,3.3,11.2,2,3.2,8.4,3.1,.78,.55),.35),s=nt(s,Ut(r,t,e,3.2,7.9,3.35,.55,.75,.55),.3),s=nt(s,yt(r,t,e,1.6,9.2,-.3,1.9,6,1.3,1.25,.85),.6),s=nt(s,yt(r,t,e,1.9,6,1.3,1.9,2.8,-.9,.75,.48),.4),s=nt(s,yt(r,t,e,1.9,2.8,-.9,1.9,.5,.9,.5,.42),.3);const o=[[0,9.2,-1.6,.6],[0,8.2,-3.6,1],[0,6.8,-5.2,1.15],[0,5.3,-6.4,.9],[0,4,-7.2,.35]];for(let c=0;c+1<o.length;c++){const l=o[c],h=o[c+1];s=nt(s,yt(i,t,e,l[0],l[1],l[2],h[0],h[1],h[2],l[3],h[3]),.5)}s-=n;for(const c of[-1.5,-.5,.5,1.5])s=nt(s,yt(r,t,e,3.2+c*.17,7.4,3.5,3.2+c*.22,6.5,3.85,.17,.03),.1);for(const c of[-1,0,1])s=nt(s,yt(r,t,e,1.9+c*.28,.4,1.2,1.9+c*.34,.1,1.85,.2,.03),.1);return s}function qu(i,t,e){const n=Math.abs(i);return Math.hypot(i,t-Rh[1],e-Rh[2])<.45||t<7.6&&t>6.2&&e>3.4&&n>2.6||t<.5&&e>1.2?3:t>17.4&&n>.6&&e<3.2||e<-6.3?2:t>15.4&&t<16.4&&e>4.4||t>14.6&&t<15.8&&e>2.8&&n<1.2||e>2.2&&t>10.2&&t<15&&n<1.8?1:t>12.4&&e<.8&&n<1.9&&t>12.4+.5*n?2:0}function O_(i,t,e){const n=Math.abs(i);return qu(i,t,e)===3||Math.hypot(n-ii[0],t-ii[1],e-ii[2])<.65?0:e>4.6&&t>15.2?.35:t>17.6?.4:t>14&&t<16.4&&e<3.4||e<-1.4&&t<9.6?1.4:t<3?.45:1}const B_=[{name:"pelvis",a:[0,7.6,-.4],b:[0,8.8,0],parent:null},{name:"spine1",a:[0,8.8,0],b:[0,10.8,.3],parent:"pelvis"},{name:"spine2",a:[0,10.8,.3],b:[0,12.6,.6],parent:"spine1"},{name:"neck",a:[0,12.6,.6],b:[0,15.6,1.3],parent:"spine2",reach:1.9},{name:"head",a:[0,15.6,1.3],b:[0,17.6,2.4],parent:"neck"},{name:"jaw",a:[0,15.9,2.6],b:[0,15.7,4.4],parent:"head",reach:.7},{name:"tail1",a:[0,7.4,-2.6],b:[0,6.8,-3.6],parent:"pelvis",reach:1.4},{name:"tail2",a:[0,6.8,-3.6],b:[0,6.2,-4.5],parent:"tail1",reach:1.4},{name:"tail3",a:[0,6.2,-4.5],b:[0,5.7,-5.2],parent:"tail2",reach:1.2},{name:"tail4",a:[0,5.7,-5.2],b:[0,5.3,-5.7],parent:"tail3",reach:1},{name:"thighL",a:[1.4,7.4,0],b:[1.5,4.6,.3],parent:"pelvis"},{name:"shinL",a:[1.5,4.6,.3],b:[1.5,.9,-.2],parent:"thighL"},{name:"footL",a:[1.5,.9,-.2],b:[1.5,.3,1.8],parent:"shinL"},{name:"thighR",a:[-1.4,7.4,0],b:[-1.5,4.6,.3],parent:"pelvis"},{name:"shinR",a:[-1.5,4.6,.3],b:[-1.5,.9,-.2],parent:"thighR"},{name:"footR",a:[-1.5,.9,-.2],b:[-1.5,.3,1.8],parent:"shinR"},{name:"armL",a:[2.7,11.6,.2],b:[3.3,9.2,-.1],parent:"spine2"},{name:"forearmL",a:[3.3,9.2,-.1],b:[3.2,7,.3],parent:"armL"},{name:"armR",a:[-2.7,11.6,.2],b:[-3.3,9.2,-.1],parent:"spine2"},{name:"forearmR",a:[-3.3,9.2,-.1],b:[-3.2,7,.3],parent:"armR"}],k_={min:[-5,-.4,-7.2],max:[5,21.4,6.6]},ri=[.72,17.25,2.75];function z_(i,t,e,n=0){const r=Math.abs(i);let s=Ut(i,t,e,0,9.2,-.2,3.3,3.5,3);s=nt(s,Ut(i,t,e,0,11.4,.5,2.5,2.2,2.3),1),s=nt(s,yt(i,t,e,0,12.2,.5,0,15.8,1.4,1.25,.95),.8);let a=Ee(i,t,e,0,16.9,1.8,1.55);a=nt(a,yt(i,t,e,0,16.55,2.9,0,16.1,5,.72,.18),.3),a=nt(a,yt(i,t,e,0,15.85,2.8,0,15.75,4.4,.5,.14),.25);for(const[o,c]of[[0,1],[.6,.82],[-.6,.82]])a=nt(a,yt(i,t,e,o*.5,18.1,1.6,o*1.3,18.1+2.7*c,1-.7*c,.34,.12),.3);a=Math.max(a,-Ee(r,t,e,ri[0],ri[1],ri[2],.5)),s=nt(s,a,.5),s=nt(s,Ut(r,t,e,3,9.8,0,.75,2.6,1.7),.7);for(const o of[-1,0,1])s=nt(s,yt(r,t,e,3.2,8.4,o*.6,3.25,6.6+Math.abs(o)*.4,o*.75+.2,.42,.14),.3);for(const o of[-1,0,1])s=nt(s,yt(i,t,e,o*.3,7.6,-2.6,o*1.1,7+(1-Math.abs(o))*.5,-5.6,.5,.2),.4);s=nt(s,yt(r,t,e,1.4,7.4,0,1.5,4.8,.3,1,.55),.5),s=nt(s,yt(r,t,e,1.5,4.8,.3,1.5,1,-.2,.42,.36),.25),s-=n;for(const o of[-1,0,1])s=nt(s,yt(r,t,e,1.5,.5,.1,1.5+o*.85,.3,2-Math.abs(o)*.3,.34,.16),.2);return s=nt(s,yt(r,t,e,1.5,.5,-.2,1.5,.3,-1.1,.3,.14),.15),s}function Yu(i,t,e){const n=Math.abs(i);return t>15.6&&t<17.1&&e>2.6&&n<.85||t<5&&n>.9&&n<2.6||t<1?3:t>18.4||e<-4.6?2:e>1.2&&t>9.4&&t<13.4&&n<1.8||e>2.2&&t>16.2&&t<18.2&&n<1.25?1:0}function H_(i,t,e){const n=Math.abs(i),r=Yu(i,t,e);return r===3||Math.hypot(n-ri[0],t-ri[1],e-ri[2])<.9?0:r===2?.6:t>16?.45:t>14.6&&e>1.6?.3:t>12.2?1.25:e<-2.4?1.4:1}const Uc=[{name:"pelvis",a:[0,9.2,0],b:[0,10.4,0],parent:null},{name:"spine1",a:[0,10.4,0],b:[0,12.4,.1],parent:"pelvis"},{name:"spine2",a:[0,12.4,.1],b:[0,15.4,.2],parent:"spine1"},{name:"neck",a:[0,15.4,.2],b:[0,16.2,.3],parent:"spine2",reach:.9},{name:"head",a:[0,16.2,.3],b:[0,18.4,.6],parent:"neck"},{name:"jaw",a:[0,16.4,1.2],b:[0,16.4,1.6],parent:"head",reach:0},{name:"tail1",a:[0,9.2,-.5],b:[0,9,-1],parent:"pelvis",reach:0},{name:"tail2",a:[0,9,-1],b:[0,8.8,-1.5],parent:"tail1",reach:0},{name:"tail3",a:[0,8.8,-1.5],b:[0,8.6,-2],parent:"tail2",reach:0},{name:"tail4",a:[0,8.6,-2],b:[0,8.4,-2.5],parent:"tail3",reach:0},{name:"thighL",a:[2.1,9.2,0],b:[2.3,5.2,.3],parent:"pelvis"},{name:"shinL",a:[2.3,5.2,.3],b:[2.3,1.2,-.1],parent:"thighL"},{name:"footL",a:[2.3,1.2,-.1],b:[2.3,.4,1.8],parent:"shinL"},{name:"thighR",a:[-2.1,9.2,0],b:[-2.3,5.2,.3],parent:"pelvis"},{name:"shinR",a:[-2.3,5.2,.3],b:[-2.3,1.2,-.1],parent:"thighR"},{name:"footR",a:[-2.3,1.2,-.1],b:[-2.3,.4,1.8],parent:"shinR"},{name:"armL",a:[4.1,14.7,.2],b:[4.5,11.6,.4],parent:"spine2"},{name:"forearmL",a:[4.5,11.6,.4],b:[4.5,8.4,1],parent:"armL"},{name:"armR",a:[-4.1,14.7,.2],b:[-4.5,11.6,.4],parent:"spine2"},{name:"forearmR",a:[-4.5,11.6,.4],b:[-4.5,8.4,1],parent:"armR"}],V_={min:[-6.4,-.4,-4.4],max:[6.4,19.8,4]};function Te(i,t,e,n,r,s,a,o,c,l){const h=Math.abs(i-n)-a+l,u=Math.abs(t-r)-o+l,d=Math.abs(e-s)-c+l;return Math.hypot(Math.max(h,0),Math.max(u,0),Math.max(d,0))+Math.min(Math.max(h,u,d),0)-l}function Ch(i,t,e,n,r,s,a,o,c){const l=Math.abs(i-n)-a+c,h=Math.hypot(t-r,e-s)-o+c;return Math.hypot(Math.max(l,0),Math.max(h,0))+Math.min(Math.max(l,h),0)-c}function $u(i,t,e,n,r,s,a,o){let c=i-n,l=t-r,h=e-s;const u=Math.cos(a),d=Math.sin(a);[c,h]=[c*u-h*d,c*d+h*u];const f=Math.cos(o),g=Math.sin(o);return[c,l]=[c*f+l*g,-c*g+l*f],[c,l,h]}const qe={hx:1.5,hy:14.6,hz:-2.15,yaw:.4,roll:.62,w:1.1,h:.85,t:.12};function G_(i,t,e){const[n,r,s]=$u(i,t,e,qe.hx,qe.hy,qe.hz,qe.yaw,qe.roll);return Te(n,r,s,qe.w,qe.h,0,qe.w,qe.h,qe.t,.1)}function W_(i,t,e,n=0){const r=Math.abs(i);let s=1e9;{const a=Te(i,t,e,0,13.75,.25,2.9,1.75,1.75,.3),o=(e-(2-Math.max(0,t-13.4)*.6))*.86;s=Math.max(a,o)}return s=nt(s,Te(i,t,e,0,12.2,.3,2.3,.6,1.5,.3),.3),s=Math.min(s,Te(i,t,e,0,12.55,1.95,2.5,.22,.28,.1)),s=Math.min(s,Te(r,t,e,2.2,13.1,1.92,.42,.26,.15,.08)),s=Math.min(s,Te(i,t,e,0,11.1,.75,1.15,.9,.55,.25)),s=nt(s,Te(i,t,e,0,11,0,1.2,1,1.05,.3),.2),s=nt(s,Te(i,t,e,0,9.75,0,2.2,.75,1.4,.3),.25),s=Math.min(s,Te(i,t,e,0,9.45,1.35,.7,.7,.25,.15)),s=Math.min(s,Te(i,t,e,0,13.5,-1.85,2.2,1.6,.55,.25)),s=Math.min(s,G_(r,t,e)),s=Math.min(s,yt(i,t,e,0,15.3,.25,0,16.3,.35,.6,.55)),s=Math.min(s,Te(i,t,e,0,17.25,.45,.82,.92,.9,.35)),s=Math.min(s,Te(i,t,e,0,16.55,.95,.55,.38,.42,.18)),s=Math.min(s,Te(i,t,e,0,18.2,.35,.12,.35,.75,.08)),s=Math.min(s,Te(r,t,e,.95,17.55,.25,.12,.62,.3,.08)),s=Math.min(s,Te(r,t,e,4.05,15.05,.2,1.15,.8,1.35,.3)),s=Math.min(s,Ch(r,t,e,5.4,14.7,.2,.32,.92,.12)),s=Math.min(s,Ee(r,t,e,4.1,14.4,.2,.75)),s=Math.min(s,yt(r,t,e,4.1,14.2,.2,4.5,11.8,.4,.62,.58)),s=Math.min(s,Ee(r,t,e,4.5,11.6,.4,.72)),s=Math.min(s,Te(r,t,e,4.55,10,.6,.9,1.5,1,.3)),s=Math.min(s,Te(r,t,e,4.55,8.05,1,.75,.75,.8,.28)),s=Math.min(s,yt(r,t,e,2.1,9.1,0,2.3,5.6,.25,1.05,.95)),s=Math.min(s,Te(r,t,e,2.3,5.25,.85,.85,.75,.55,.25)),s=Math.min(s,Te(r,t,e,2.3,3,.05,1.25,2.15,1.35,.35)),s=Math.min(s,Ch(r,t,e,3.75,2.6,-.35,.3,.9,.12)),s=Math.min(s,Te(r,t,e,2.3,.5,.65,1.15,.5,2,.2)),s-n}function X_(i,t,e){const n=Math.abs(i);if(n>5&&Math.hypot(t-14.7,e-.2)<1)return Math.hypot(t-14.7,e-.2)<.42?1:5;if(n>3.38&&Math.hypot(t-2.6,e+.35)<.98)return Math.hypot(t-2.6,e+.35)<.4?1:5;if(t>16.95&&t<17.3&&e>1.2&&n>.12&&n<.62||t>12.85&&t<13.35&&e>1.95&&n>1.85&&n<2.6)return 2;if(t>13.55&&t<15.35&&n<2.55&&n>.18&&e>1.75-Math.max(0,t-13.4)*.6)return 4;if(t>16.15&&t<16.95&&e>1.25&&n<.6)return 6;if(e<-1.9&&t>13.8){const[r,s,a]=$u(n,t,e,qe.hx,qe.hy,qe.hz,qe.yaw,qe.roll);if(Math.abs(a)<.3&&r>.25&&r<1.75&&s>.85&&s<1.5)return 4}return t>12.3&&t<12.8&&e>1.65||t>14.25&&t<15.9&&n>2.9&&n<5.15||t>4.5&&t<6&&e>.4&&n>1.4&&n<3.2||t<1.1&&e>1.6||t>17.9&&n<.2?1:Math.hypot(n-4.1,t-14.4,e-.2)<.85&&t<14.25||Math.hypot(n-4.5,t-11.6,e-.4)<.8||t>15.2&&t<16.2&&n<.7||t>10.2&&t<11.6&&e<1.25&&n<1.25?3:0}function pe(i,t,e,n,r,s,a,o,c,l){const h=Math.abs(i-n)-a+l,u=Math.abs(t-r)-o+l,d=Math.abs(e-s)-c+l;return Math.hypot(Math.max(h,0),Math.max(u,0),Math.max(d,0))+Math.min(Math.max(h,u,d),0)-l}const q_={min:[-6.8,-.4,-4.6],max:[6.8,20.2,5]};function Y_(i,t,e,n=0){const r=Math.abs(i);let s=1e9;s=Math.min(s,pe(i,t,e,0,13.6,.2,3.1,2.1,2,.5)),s=Math.min(s,Ut(i,t,e,0,14.3,2.15,1.05,.7,.75)),s=Math.min(s,pe(i,t,e,0,12.4,2,.9,1,.4,.3)),s=Math.min(s,pe(r,t,e,1.7,15.6,-2.3,.18,2.4,1.1,.12)),s=Math.min(s,pe(i,t,e,0,13,-2.3,2.2,1.6,.6,.3)),s=nt(s,pe(i,t,e,0,11.2,.1,1.9,1.1,1.35,.35),.3),s=nt(s,pe(i,t,e,0,9.7,0,2.5,.95,1.55,.3),.3),s=Math.min(s,pe(i,t,e,0,9.4,1.4,.8,.9,.35,.2)),s=Math.min(s,yt(i,t,e,0,15.3,.2,0,16.4,.3,.75,.7)),s=Math.min(s,pe(i,t,e,0,17.2,.4,1,1,1.1,.4)),s=Math.min(s,pe(i,t,e,0,16.6,1.25,.65,.45,.35,.15)),s=Math.min(s,pe(i,t,e,0,18.6,.3,.13,.75,.9,.08)),s=Math.min(s,yt(r,t,e,.95,17.7,.4,1.5,18.5,.2,.2,.08)),s=Math.min(s,pe(r,t,e,4.2,15.4,.1,1.55,.85,1.7,.35)),s=Math.min(s,yt(r,t,e,4.2,15.5,1.6,4.2,15.5,3.9,.3,.26)),s=Math.min(s,Ee(r,t,e,4.1,14.4,.2,1)),s=Math.min(s,yt(r,t,e,4.1,14.2,.2,4.5,11.8,.4,.85,.8)),s=Math.min(s,Ee(r,t,e,4.5,11.6,.4,.9)),s=Math.min(s,pe(r,t,e,4.8,10,.6,1,1.7,1.3,.3)),s=Math.min(s,pe(r,t,e,5.85,10,.6,.22,1.8,1.35,.18)),s=Math.min(s,pe(r,t,e,4.75,7.9,1,.85,.85,.95,.3)),s=Math.min(s,yt(r,t,e,2.1,9.1,0,2.3,5.8,.25,1.15,1.1)),s=Math.min(s,pe(r,t,e,2.3,5.4,.6,1.15,1.05,1,.3)),s=Math.min(s,pe(r,t,e,2.3,3,0,1.2,2,1.25,.3));for(const a of[3.8,1.9])s=Math.min(s,yt(r,t,e,3.35,a,-.4,3.75,a,-.4,.75,.75));return s=Math.min(s,pe(r,t,e,2.3,.55,.65,1.15,.55,2,.2)),s-n}function $_(i,t,e){const n=Math.abs(i),r=i>0;return t>13.7&&t<15&&e>1.6&&n<1.1||t>16.5&&t<17&&e>1.4&&n<.5&&n>.12?2:n>3.9&&n<4.5&&t>15.1&&t<15.9&&e>1.7||n>5.55&&t>8.2&&t<11.8||n>3.1&&t<4.6&&t>1.1&&e<.4||t>5.5&&t<6.3&&e>1.4&&n>1.3&&n<3.3||Math.hypot(n-4.1,t-14.4,e-.2)<1.05&&t<14.6||Math.hypot(n-4.5,t-11.6,e-.4)<.95&&t>11.3||t>10.7&&t<11&&n<2||t>8.6&&t<8.9&&n>1&&n<3.6?3:n>3.55&&t>6.4&&t<16.4||n>2.9&&t>11.4&&t<16.4?r?4:5:t<8.8&&n>.95?r?6:7:t>15.2||n>1.4&&n<2&&e<-1.2||t<11.3||e<-1.7?1:0}const j_={min:[-7.6,-.4,-6.6],max:[7.6,21,4.4]};function Z_(i,t,e,n,r,s,a,o,c,l,h,u){const d=(r+o)/2;return yt(i,d+(t-d)/u,e,n,r,s,a,o,c,l,h)*u}function K_(i,t,e,n,r,s,a,o,c,l,h,u){const d=(n+a)/2;return yt(d+(i-d)/u,t,e,n,r,s,a,o,c,l,h)*u}function J_(i,t,e,n=0){const r=Math.abs(i);let s=1e9;return s=Math.min(s,pe(i,t,e,0,13.7,.1,2.5,1.9,1.7,.6)),s=Math.min(s,Ut(i,t,e,0,14.4,1.75,.95,.75,.85)),s=nt(s,pe(i,t,e,0,11.4,0,1.5,1.2,1.15,.4),.4),s=nt(s,pe(i,t,e,0,9.8,0,2.2,.85,1.35,.35),.3),s=Math.min(s,yt(i,t,e,0,15.2,-2,0,10.8,-2.3,.75,.2)),s=Math.min(s,Z_(r,t,e,1.4,13.6,-2.2,6.8,12.4,-5.6,1.9,.4,.17)),s=Math.min(s,K_(r,t,e,1.5,14.2,-2.4,1.65,17.8,-3.7,.95,.22,.2)),s=Math.min(s,pe(r,t,e,3.4,15.2,.2,1.15,.9,1.5,.3)),s=Math.min(s,pe(r,t,e,3.4,16.4,-.1,.85,.45,1.1,.2)),s=Math.min(s,yt(i,t,e,0,15.3,.1,0,16.3,.2,.6,.55)),s=Math.min(s,Ut(i,t,e,0,17.1,.35,.85,1,1.15)),s=Math.min(s,yt(r,t,e,.45,17.8,.6,1,19.4,-.9,.16,.05)),s=Math.min(s,Ee(r,t,e,4.1,14.5,.2,.8)),s=Math.min(s,yt(r,t,e,4.1,14.3,.2,4.5,11.8,.4,.65,.6)),s=Math.min(s,Ee(r,t,e,4.5,11.6,.4,.7)),s=Math.min(s,pe(r,t,e,4.5,10,.6,.8,1.6,.85,.3)),s=Math.min(s,pe(r,t,e,4.5,8,.95,.6,.65,.6,.25)),s=Math.min(s,yt(r,t,e,2.1,9.1,0,2.3,5.6,.25,1.1,1)),s=Math.min(s,pe(r,t,e,2.3,5.2,.7,.75,.65,.5,.25)),s=Math.min(s,yt(r,t,e,2.3,4.8,-.1,2.3,1.7,-.3,1.25,1.15)),s=Math.min(s,yt(r,t,e,2.3,1.6,-.6,2.3,1.1,-1.4,1,1.1)),s=Math.min(s,pe(r,t,e,2.3,.45,.9,.75,.45,1.5,.2)),s-n}function Q_(i,t,e){const n=Math.abs(i);return t>13.8&&t<15.1&&e>1.2&&n<1||t>16.8&&t<17.4&&e>1&&n<.75?2:t<1.9&&e<-.9||Math.hypot(n-4.1,t-14.5,e-.2)<.85&&t<14.5||Math.hypot(n-4.5,t-11.6,e-.4)<.75||t>10.4&&t<10.8&&n<1.6?3:n>2.5&&n<4.3&&t>16&&t<16.9||e<-1.9&&n>1.5&&n<7&&Math.abs(t-(13.6-(n-1.4)*.22))<.3||t>12.6&&t<13&&n<2.3&&e>.8?4:n>3.6&&t<13.8&&t>7.2||t<5&&n>1?1:0}function Ji(i){const t=!!i.mech,e=!!i.cape,n=i.tail??null;return(r,s,a,o)=>r.name.startsWith("thigh")?o>-1.6&&a<r.a[1]+(t?1.4:.8)&&Math.abs(Math.abs(s)-Math.abs(r.a[0]))<(a<r.a[1]+.3?t?1.45:1.3:t?1.4:.9):r.name.startsWith("tail")?n!==null?o<n:e&&o<-1.55:!t&&(r.name.startsWith("arm")||r.name.startsWith("forearm"))?Math.abs(s)>2&&o>-1.2:t&&r.name.startsWith("arm")?o>-1.5:!0}const ju=(i,t,e=2.2)=>i.std({color:t,emissive:t,emissiveIntensity:e,roughness:.3}),tx={id:"crimson",name:"Crimson",blurb:"A suited hero, visor and all",segs:Vu,body:{sdf:(i,t,e)=>Wu(i,t,e,"crimson"),region:(i,t,e)=>Xu(i,t,e,"crimson"),box:Gu,palette:[13114922,16053492,1052692,12633292],surface:"suit",capture:Ji({})},dress(i){const t=i.std({color:526348,roughness:.08,metalness:.6});for(const e of[-1,1]){const n=new Gt(new $e(1,.38,.4),t);n.rotation.set(0,e*.42,e*-.32),i.at(n,"head",e*.46,17.12,1.12)}},fit:{size:1.08,limb:.7}},ex={id:"valkyrie",name:"Valkyrie",blurb:"Winged helm, spear and shield",segs:Vu,body:{sdf:(i,t,e)=>Wu(i,t,e,"valkyrie"),region:(i,t,e)=>Xu(i,t,e,"valkyrie"),box:Gu,palette:[7028640,14725184,15657716,15251606],surface:"suit",capture:Ji({cape:!0})},dress(i){const t=i.std({color:1708064,roughness:.2});for(const h of[-1,1]){const u=new Gt(new Re(.17,12,8),t);u.scale.set(1,1.3,.6),i.at(u,"head",h*.42,16.8,1.5)}const e=i.std({color:5916210,roughness:.6}),n=i.std({color:14211296,roughness:.25,metalness:.85}),r=new hn;r.add(new Gt(new Pn(.16,.16,17,10),e));const s=new Gt(new Ki(.42,2.4,10),n);s.position.y=9.6,r.add(s),i.at(r,"forearmR",-2.9,11,.85);const a=new hn,o=new Gt(new Pn(2.1,2.1,.3,28),i.std({color:7028640,roughness:.4,metalness:.3}));o.rotation.z=Math.PI/2,a.add(o);const c=new Gt(new Dr(2.1,.16,8,32),i.std({color:14725184,roughness:.3,metalness:.7}));c.rotation.y=Math.PI/2,a.add(c);const l=new Gt(new Re(.55,14,10),n);l.position.x=.2,a.add(l),i.at(a,"forearmL",3.38,10.4,.45)},fit:{size:1.08,limb:.7},idle:{tail:.05}},nx=U_.map(i=>/^(arm|forearm)/.test(i.name)?{...i,reach:1.95}:i),ix={id:"howler",name:"Howler",blurb:"A wolf man with amber eyes",segs:nx,body:{sdf:(i,t,e)=>F_(i,t,e),region:qu,box:N_,palette:[7827562,12103584,3420204,1183760],capture:Ji({tail:-1.5}),fur:{length:.8,density:7,tip:.22},furLen:O_},dress(i){const t=ju(i,16756768,1.8);for(const e of[-1,1]){const n=new Gt(new Re(.24,12,8),t);n.scale.set(1.2,.8,.8),i.at(n,"head",e*ii[0],ii[1],ii[2])}},fit:{size:1.1,limb:.6},idle:{tail:.25}},rx={id:"plume",name:"Plume",blurb:"A big, friendly, feathered bird",segs:B_,body:{sdf:(i,t,e)=>z_(i,t,e),region:Yu,box:k_,palette:[16036872,16770976,15224972,15762468],surface:"soft",capture:Ji({tail:-2.4}),fur:{length:1.5,density:1.6,tip:.3,feather:!0},furLen:H_},dress(i){const t=i.std({color:16316660,roughness:.2}),e=i.std({color:657936,roughness:.1});for(const n of[-1,1]){const r=new Gt(new Re(.52,18,12),t),s=new Gt(new Re(.24,12,8),e);s.position.set(-n*.1,.02,.36),s.scale.set(1,1.2,.6),r.add(s),i.at(r,"head",n*ri[0],ri[1],ri[2])}},fit:{size:1.12,limb:.5},idle:{tail:.15}};function Nc(i,t){return e=>{const n=ju(e,t);if(i==="bastion"){for(const a of[-1,1]){const o=new Gt(new $e(.42,.2,.1),n);o.rotation.z=a*-.12,e.at(o,"head",a*.36,17.12,1.36);const c=new Gt(new $e(.62,.36,.1),n);e.at(c,"spine2",a*2.2,13.1,2.08)}return}const r=i==="unison",s=new Gt(new Re(1,20,12),n);if(s.scale.set(r?.95:.85,r?.55:.6,r?.45:.35),e.at(s,"spine2",0,14.35,r?2.55:1.95),r)for(const a of[-1,1]){const o=new Gt(new $e(.42,.16,.1),n);o.rotation.z=a*.25,e.at(o,"head",a*.32,16.85,1.62)}else e.at(new Gt(new $e(1.3,.3,.12),n),"head",0,17.1,1.42);if(r){const a=e.std({color:14673130,roughness:.2,metalness:.9}),o=e.std({color:14198832,roughness:.3,metalness:.8}),c=new hn,l=new Gt(new $e(.22,8,.9),a);l.position.y=-4.5,c.add(l);const h=new Gt(new Ki(.64,1.4,4),a);h.rotation.z=Math.PI,h.position.y=-9.2,h.scale.set(.35,1,1),c.add(h),c.rotation.x=-.95;const u=new Gt(new $e(.5,.4,3),o);u.position.y=-.3,c.add(u);const d=new Gt(new Pn(.22,.22,1.6,8),o);d.position.y=.6,c.add(d),e.at(c,"forearmR",-4.75,8,2.1)}}}const sx={id:"bastion",name:"Bastion",blurb:"An armoured truck that stands up",segs:Uc,body:{sdf:(i,t,e)=>W_(i,t,e),region:X_,box:V_,palette:[4871266,14262322,9431295,1842980,7118020,1316377,12896462],surface:"armour",weights:"rigid",capture:Ji({mech:!0})},dress:Nc("bastion",9431295),fit:{size:1,limb:.6}},ax={id:"kestrel",name:"Kestrel",blurb:"A jet that stands up",segs:Uc,body:{sdf:(i,t,e)=>J_(i,t,e),region:Q_,box:j_,palette:[15132908,5661306,16756800,1842980,13117498],surface:"armour",weights:"rigid",capture:Ji({mech:!0})},dress:Nc("kestrel",16756800),fit:{size:1,limb:.6}},ox={id:"unison",name:"Unison",blurb:"Five machines locked into one",segs:Uc,body:{sdf:(i,t,e)=>Y_(i,t,e),region:$_,box:q_,palette:[15527666,2503274,8382719,1842980,15234090,2271388,15254056,12855866],surface:"armour",weights:"rigid",capture:Ji({mech:!0})},dress:Nc("unison",8382719),fit:{size:1,limb:.6}},Qe=[Vv,Kv,f_,D_,ix,tx,ex,rx,sx,ax,ox],si=i=>Qe.find(t=>t.id===i)??Qe[0],cx=i=>new U(i.x,i.y,i.z),mr=(i,t,e)=>{const n=Math.min(1,Math.max(0,(e-i)/(t-i)));return n*n*(3-2*n)};function Lh(i,t){const e=t.clone().normalize(),n=new U().crossVectors(i,e).normalize(),r=new U().crossVectors(e,n).normalize();return new Fe().setFromRotationMatrix(new ne().makeBasis(r,e,n))}function lx(i,t){const e=i.clone().normalize(),n=new U().crossVectors(t,e).normalize(),r=new U().crossVectors(e,n).normalize();return new Fe().setFromRotationMatrix(new ne().makeBasis(e,n,r))}function hx(i){const t=M=>cx(i[M]),e=(...M)=>Math.min(...M.map(E=>i[E].v)),n=t(z.hipL),r=t(z.hipR),s=t(z.shL),a=t(z.shR),o=n.clone().add(r).multiplyScalar(.5),c=s.clone().add(a).multiplyScalar(.5),l=c.clone().sub(o),h=Lh(n.clone().sub(r),l),u=Lh(s.clone().sub(a),l),d=t(z.earL),f=t(z.earR),g=t(z.nose),v=d.clone().add(f).multiplyScalar(.5),m=lx(d.clone().sub(f),g.clone().sub(v));m.multiply(new Fe().setFromAxisAngle(new U(1,0,0),-.32));const p=(M,E)=>t(E).sub(t(M)).normalize(),S={armL:p(z.shL,z.elL),forearmL:p(z.elL,z.wrL),armR:p(z.shR,z.elR),forearmR:p(z.elR,z.wrR),thighL:p(z.hipL,z.knL),shinL:p(z.knL,z.anL),footL:p(z.heelL,z.toeL),thighR:p(z.hipR,z.knR),shinR:p(z.knR,z.anR),footR:p(z.heelR,z.toeR)},b={armL:e(z.shL,z.elL),forearmL:e(z.elL,z.wrL),armR:e(z.shR,z.elR),forearmR:e(z.elR,z.wrR),thighL:e(z.hipL,z.knL),shinL:e(z.knL,z.anL),footL:e(z.heelL,z.toeL),thighR:e(z.hipR,z.knR),shinR:e(z.knR,z.anR),footR:e(z.heelR,z.toeR)};return{pelvis:h,chest:u,head:m,headVis:e(z.earL,z.earR,z.nose),neck:v.sub(c).normalize(),dir:S,vis:b}}const ux={armL:new U(1,0,0),armR:new U(-1,0,0),thighL:new U(0,-1,0),thighR:new U(0,-1,0),neck:new U(0,1,0)},Ph={forearmL:"armL",forearmR:"armR",shinL:"thighL",shinR:"thighR",footL:"shinL",footR:"shinR"};class fx{bones;rest=new Map;qm=new Map;hipRest;pelvisA;torso;len=new Map;segs;constructor(t,e){this.segs=t,this.bones=e;const n=l=>t.find(h=>h.name===l);for(const l of t){const h=new U(l.b[0]-l.a[0],l.b[1]-l.a[1],l.b[2]-l.a[2]);this.len.set(l.name,h.length()),h.lengthSq()>1e-9?h.normalize():h.set(0,1,0);const u=l.parent?n(l.parent):null,d=u?new U(l.a[0]-u.a[0],l.a[1]-u.a[1],l.a[2]-u.a[2]):new U(...l.a);let f=ux[l.name];if(!f&&Ph[l.name]){const g=n(Ph[l.name]);f=new U(g.b[0]-g.a[0],g.b[1]-g.a[1],g.b[2]-g.a[2]).normalize(),l.name.startsWith("foot")&&(f=h.clone())}f??=h.clone(),this.rest.set(l.name,{dir:h,offset:d,pre:new Fe().setFromUnitVectors(h,f),canon:f})}this.pelvisA=new U(...n("pelvis").a);const r=n("thighL").a,s=n("thighR").a,a=n("armL").a,o=n("armR").a;this.hipRest=new U((r[0]+s[0])/2,(r[1]+s[1])/2,(r[2]+s[2])/2);const c=new U((a[0]+o[0])/2,(a[1]+o[1])/2,(a[2]+o[2])/2);this.torso=c.distanceTo(this.hipRest)}setLength(t,e){const n=this.segs.find(a=>a.parent===t&&!a.name.startsWith("tail")&&a.name!=="jaw");if(!n)return;const r=this.bones.get(n.name),s=this.rest.get(n.name);r.position.copy(s.offset).multiplyScalar(e)}neckFit(t){const e=l=>this.segs.find(h=>h.name===l),n=e("spine2"),r=e("neck"),s=e("head"),a=(e("armL").a[1]+e("armR").a[1])/2-n.a[1],o=r.a[1]-n.a[1]+(s.a[1]-r.a[1]),c=(s.a[1]+s.b[1])/2-s.a[1];return o>.001?(a+t-c)/o:1}setNeck(t){for(const e of["neck","head"]){const n=this.bones.get(e),r=this.rest.get(e);n&&r&&n.position.copy(r.offset).multiplyScalar(t)}}swing(t,e,n,r){const s=this.rest.get(t),a=n.clone().applyQuaternion(e.clone().invert()).normalize(),o=new Fe().setFromUnitVectors(s.canon,a).multiply(s.pre);return r<1&&o.slerp(new Fe,1-Math.max(0,r)),o}set(t,e,n){const r=this.bones.get(t);r&&r.quaternion.copy(e);const s=n?n.clone().multiply(e):e.clone();return this.qm.set(t,s),s}apply(t,e=0,n=0){const r=this.set("pelvis",t.pelvis,null),s=this.hipRest.clone().sub(this.pelvisA).applyQuaternion(t.pelvis);this.bones.get("pelvis").position.copy(s.negate());const a=t.pelvis.clone().slerp(t.chest,.5),o=this.set("spine1",r.clone().invert().multiply(a),r),c=this.set("spine2",o.clone().invert().multiply(t.chest),o),l=mr(.3,.7,t.headVis),h=this.set("neck",this.swing("neck",c,t.neck,l*.6),c),u=h.clone().invert().multiply(t.head);l<1&&u.slerp(new Fe,1-l),this.set("head",u,h);for(const f of["L","R"]){const g=this.set("arm"+f,this.swing("arm"+f,c,t.dir[`arm${f}`],mr(.35,.7,t.vis[`arm${f}`])),c);this.set("forearm"+f,this.swing("forearm"+f,g,t.dir[`forearm${f}`],mr(.35,.7,t.vis[`forearm${f}`])),g);const v=this.set("thigh"+f,this.swing("thigh"+f,r,t.dir[`thigh${f}`],mr(.4,.75,t.vis[`thigh${f}`])),r),m=this.set("shin"+f,this.swing("shin"+f,v,t.dir[`shin${f}`],mr(.4,.75,t.vis[`shin${f}`])),v);this.set("foot"+f,this.swing("foot"+f,m,t.dir[`foot${f}`],mr(.5,.8,t.vis[`foot${f}`])),m)}let d=r;for(let f=1;f<=4;f++){const g="tail"+f;if(!this.bones.has(g))break;const v=new Fe().setFromEuler(new _n(0,Math.sin(e*2.1-f*.7)*n,Math.sin(e*1.3-f*.5)*n*.3));d=this.set(g,v,f===1?this.qm.get(this.segs.find(m=>m.name==="tail1")?.parent??"pelvis")??r:d)}}dirOf(t){return this.rest.get(t).dir.clone().applyQuaternion(this.qm.get(t))}}const gi=64,gr=32,gn=48,Nn=36,vr=12,js=9,an={spread:1.6,back:.9,envIntensity:1.15,key:5,every:6,targetMean:.22,maxGain:2.8,fill:.35},lo=new Float32Array(256).map((i,t)=>{const e=t/255;return e<=.04045?e/12.92:Math.pow((e+.055)/1.055,2.4)});class dx{constructor(t,e,n){this.renderer=t,this.scene=e,this.cv=document.createElement("canvas"),this.cv.width=gn,this.cv.height=Nn,this.ctx=this.cv.getContext("2d",{willReadFrequently:!0}),this.tex=new Kr(this.data,gi,gr,Ve,ji),this.tex.mapping=ca,this.tex.colorSpace=Yi,this.tex.magFilter=_e,this.tex.minFilter=_e,this.pmrem=new ic(t),this.key.castShadow=!0,this.key.shadow.mapSize.set(1024,1024),this.key.shadow.bias=-5e-4,this.key.shadow.normalBias=.02,this.key.shadow.radius=4,e.add(this.key),e.add(this.key.target),e.add(this.fill),this.fill.intensity=1}key=new nc(16777215,1);fill=new C0(16777215,4473924,0);cv;ctx;lin=new Float32Array(gn*Nn*3);blur=new Float32Array(vr*js*3);data=new Uint16Array(gi*gr*4);smooth=new Float32Array(gi*gr*3);primed=!1;keyDir=new U(0,1,1).normalize();keyI=0;tex;pmrem;rt=null;mean=0;share=0;gain=1;dir=new U(0,1,1).normalize();target=new U(0,0,-2);update(t,e,n,r,s,a){if(this.aimShadows(s,n),!a){this.scene.environment=null,this.fill.intensity=1.2,this.key.intensity=1.6,this.key.position.copy(this.target).add(new U(1.5,3,2.5));return}if(r%an.every!==0&&this.rt||t.readyState<2||!t.videoWidth)return;this.ctx.drawImage(t,0,0,gn,Nn);const o=this.ctx.getImageData(0,0,gn,Nn).data;let c=0;for(let M=0,E=0;M<gn*Nn;M++,E+=4){const T=lo[o[E]],A=lo[o[E+1]],R=lo[o[E+2]];this.lin[M*3]=T,this.lin[M*3+1]=A,this.lin[M*3+2]=R,c+=.2126*T+.7152*A+.0722*R}this.mean=c/(gn*Nn),this.gain=Math.min(an.maxGain,Math.max(1,an.targetMean/Math.max(this.mean,.001)));const l=this.gain;this.blur.fill(0);const h=gn/vr,u=Nn/js;for(let M=0;M<Nn;M++)for(let E=0;E<gn;E++){const T=(Math.floor(M/u)*vr+Math.floor(E/h))*3,A=(M*gn+E)*3,R=this.blur;R[T]=R[T]+this.lin[A],R[T+1]=R[T+1]+this.lin[A+1],R[T+2]=R[T+2]+this.lin[A+2]}for(let M=0;M<this.blur.length;M++)this.blur[M]=this.blur[M]/(h*u);const d=e.f/e.w,f=e.f/e.h;let g=0,v=0,m=0,p=0;for(let M=0;M<gr;M++){const E=((M+.5)/gr-.5)*Math.PI,T=Math.sin(E),A=Math.cos(E);for(let R=0;R<gi;R++){const _=((R+.5)/gi-.5)*Math.PI*2;let x=Math.cos(_)*A;const y=Math.sin(_)*A,w=n?-x:x,D=y<0,I=Math.max(Math.abs(y),.08),F=Math.min(1,Math.max(0,.5+w/I*d/an.spread)),H=Math.min(1,Math.max(0,.5-T/I*f/an.spread));let $,V,Q;if(D){const et=(Math.min(Nn-1,Math.floor(H*Nn))*gn+Math.min(gn-1,Math.floor(F*gn)))*3;$=this.lin[et],V=this.lin[et+1],Q=this.lin[et+2]}else{const et=(Math.min(js-1,Math.floor(H*js))*vr+Math.min(vr-1,Math.floor(F*vr)))*3;$=this.blur[et]*an.back,V=this.blur[et+1]*an.back,Q=this.blur[et+2]*an.back}$*=l,V*=l,Q*=l;const rt=(M*gi+R)*3,ct=this.primed?.28:1;$=this.smooth[rt]=this.smooth[rt]+($-this.smooth[rt])*ct,V=this.smooth[rt+1]=this.smooth[rt+1]+(V-this.smooth[rt+1])*ct,Q=this.smooth[rt+2]=this.smooth[rt+2]+(Q-this.smooth[rt+2])*ct;const gt=(M*gi+R)*4;this.data[gt]=Ls.toHalfFloat($),this.data[gt+1]=Ls.toHalfFloat(V),this.data[gt+2]=Ls.toHalfFloat(Q),this.data[gt+3]=Ls.toHalfFloat(1);const Ct=.2126*$+.7152*V+.0722*Q,Nt=Ct*A;x=Math.cos(_)*A,g+=Nt*x,v+=Nt*T,m+=Nt*y,p+=Nt}}this.primed=!0,this.tex.needsUpdate=!0,this.rt=this.pmrem.fromEquirectangular(this.tex,this.rt),this.scene.environment=this.rt.texture,this.scene.environmentIntensity=an.envIntensity;const S=Math.hypot(g,v,m);this.share=p>0?S/p:0,S>1e-6&&this.keyDir.lerp(new U(g/S,v/S,m/S),.25).normalize(),this.dir.copy(this.keyDir),this.dir.y<.15&&(this.dir.y=.15,this.dir.normalize());const b=an.key*this.share*(p/(gi*gr))*2;this.keyI+=(b-this.keyI)*(this.keyI===0?1:.25),this.key.intensity=this.keyI,this.fill.intensity=an.fill,this.key.position.copy(this.target).addScaledVector(this.dir,4)}aimShadows(t,e){if(!t.length)return;const n=new U;for(const a of t)n.add(a);n.multiplyScalar(1/t.length),e&&(n.x=-n.x);let r=1.4;for(const a of t)r=Math.max(r,Math.hypot((e?-a.x:a.x)-n.x,a.y-n.y,a.z-n.z)+1.4);this.target.copy(n),this.key.target.position.copy(n),this.key.position.copy(n).addScaledVector(this.dir,4);const s=this.key.shadow.camera;s.right!==r&&(s.left=-r,s.right=r,s.top=r,s.bottom=-r,s.near=.1,s.far=4+r*2,s.updateProjectionMatrix())}}const _r={tauN:1,tauH:.6,imuAgree:35,footVis:.5};class px{n=new U(0,1,0);h=-1.4;source="assumed";fromFeet=!1;bodyUp=new U(0,1,0);bodyW=0;update(t,e,n){const r=1-Math.exp(-n/_r.tauN),s=1-Math.exp(-n/_r.tauH),a=new U;let o=0;for(const f of t){if(f.lost||f.presence<.5)continue;const g=b=>new U(f.world[b].x,f.world[b].y,f.world[b].z),v=g(z.shL).add(g(z.shR)).multiplyScalar(.5),m=Math.min(f.world[z.anL].v,f.world[z.anR].v),p=m>_r.footVis?g(z.anL).add(g(z.anR)).multiplyScalar(.5):g(z.hipL).add(g(z.hipR)).multiplyScalar(.5),S=v.sub(p);S.lengthSq()<1e-4||(a.addScaledVector(S.normalize(),f.presence*(m>_r.footVis?1:.6)),o+=f.presence)}o>0&&a.lengthSq()>1e-6&&(a.normalize(),this.bodyUp.lerp(a,this.bodyW>0?r*.5:1).normalize(),this.bodyW=Math.min(1,this.bodyW+n));let c=null;const l=Math.cos(Zr.degToRad(_r.imuAgree));e&&(this.bodyW===0||e.dot(this.bodyUp)>l)?(c=e,this.source="motion"):this.bodyW>0&&(c=this.bodyUp,this.source="body"),c&&this.n.lerp(c,r).normalize();let h=0,u=0,d=!1;for(const f of t){if(f.lost||f.presence<.5)continue;const g=S=>this.n.x*(f.T.x+f.world[S].x)+this.n.y*(f.T.y+f.world[S].y)+this.n.z*(f.T.z+f.world[S].z);let v=1/0;for(const[S,b]of[[z.heelL,.02],[z.heelR,.02],[z.toeL,.02],[z.toeR,.02],[z.anL,.08],[z.anR,.08]])f.world[S].v>_r.footVis&&(v=Math.min(v,g(S)-b));if(v<1/0){h+=v*f.presence,u+=f.presence,d=!0;continue}const m=(g(z.hipL)+g(z.hipR))/2,p=Math.max(.6,Math.min(1.1,f.len.thigh+f.len.shin+.08));h+=(m-p)*f.presence*.4,u+=f.presence*.4}u>0&&(this.h+=(h/u-this.h)*s,this.fromFeet=d)}foot(t,e=new U){return e.copy(t).addScaledVector(this.n,this.h-this.n.dot(t))}height(t){return this.n.dot(t)-this.h}axes(){const t=new U(0,0,-1).addScaledVector(this.n,this.n.z).normalize(),e=new U().crossVectors(t,this.n).normalize();return{back:t,side:e}}get cameraHeight(){return-this.h}}const mx=new He({transparent:!0,depthWrite:!1,toneMapped:!1,vertexShader:"varying vec2 vUv; void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }",fragmentShader:"varying vec2 vUv; void main() { float r = length(vUv - 0.5) * 2.0; gl_FragColor = vec4(0.0, 0.0, 0.0, 0.5 * pow(clamp(1.0 - r, 0.0, 1.0), 1.6)); }"}),gx=new Ei(1,1),Zs=12,Zu=`
  varying vec2 vUv;
  uniform vec4 uCrop; // u0, v0, du, dv of the video shown
  uniform float uMirror;
  void main() {
    vec2 uv = position.xy * 0.5 + 0.5;
    uv.x = mix(uv.x, 1.0 - uv.x, uMirror);
    vUv = uCrop.xy + uv * uCrop.zw;
    gl_Position = vec4(position.xy, 1.0, 1.0);
  }`,vx=`
  varying vec2 vUv;
  uniform sampler2D uTex;
  void main() { gl_FragColor = vec4(texture2D(uTex, vUv).rgb, 1.0); }`;class _x{constructor(t){this.canvas=t,this.renderer=new mv({canvas:t,antialias:!0,alpha:!1,powerPreference:"high-performance",preserveDrawingBuffer:!1}),this.renderer.outputColorSpace=on,this.renderer.toneMapping=qh,this.renderer.toneMappingExposure=1,this.renderer.shadowMap.enabled=!0,this.renderer.shadowMap.type=Wh,this.renderer.setPixelRatio(this.opts.pixelRatio),this.plainBg=new He({vertexShader:Zu,fragmentShader:vx,depthTest:!1,depthWrite:!1,toneMapped:!1,uniforms:this.bgUniforms}),this.bg=new Gt(new Ei(2,2),this.plainBg),this.fg=new Gt(new Ei(2,2),this.plainBg),this.fg.frustumCulled=!1,this.fg.renderOrder=1e3,this.fg.visible=!1,this.bg.frustumCulled=!1,this.bg.renderOrder=-1e3,this.scene.add(this.bg),this.scene.add(this.fg),this.scene.add(this.world),this.scene.add(this.camera),this.light=new dx(this.renderer,this.scene,this.world),this.rims[0].position.set(-3,2.5,-6),this.rims[1].position.set(3,2.5,-6);for(const e of this.rims)e.target.position.set(0,0,-3),this.scene.add(e,e.target)}renderer;scene=new du;camera=new vn(50,1,.05,60);world=new hn;light;bg;bgUniforms={uTex:{value:null},uCrop:{value:new se(0,0,1,1)},uMirror:{value:0}};plainBg;videoTex=null;templates=new Map;wearers=new Map;leaving=[];lastT=-1;pyramid=!1;hideWearers=!1;ground=new px;fg;rims=[new nc(16723349,0),new nc(3073791,0)];opts={size:1,shadows:!0,envLight:!0,pixelRatio:Math.min(window.devicePixelRatio||1,2)};cover={s:1,ox:0,oy:0,vw:1,vh:1,cw:1,ch:1,mirror:!1};setVideo(t){this.videoTex?.dispose();const e=new u0(t);e.colorSpace=kn,e.minFilter=_e,e.magFilter=_e,e.generateMipmaps=!1,this.videoTex=e,this.bgUniforms.uTex.value=e}setBackground(t){this.bg.material=t??this.plainBg}setForeground(t){this.fg.visible=!!t,t&&(this.fg.material=t)}template(t){let e=this.templates.get(t);return e||(e=no(si(t)),this.templates.set(t,e)),e}hasTemplate(t){return this.templates.has(t)}worker=null;queue=[];busy=null;waiting=new Map;workerMs=new Map;prepare(t,e=!1){const n=this.templates.get(t);if(n)return Promise.resolve(n);const r=new Promise(s=>{const a=this.waiting.get(t)??[];a.push(s),this.waiting.set(t,a)});return this.busy!==t&&(this.queue=this.queue.filter(s=>s!==t),e?this.queue.unshift(t):this.queue.push(t)),this.pump(),r}isPreparing(t){return this.busy===t||this.queue.includes(t)}pump(){if(!(this.busy||!this.queue.length)){if(!this.worker)try{this.worker=new Worker(new URL(""+new URL("build.worker-BlmGOZUs.js",import.meta.url).href,import.meta.url),{type:"module"}),this.worker.onmessage=t=>{const{id:e,body:n,fur:r,ms:s}=t.data;this.workerMs.set(e,s);const a=no(si(e),void 0,n?{body:n,fur:r}:void 0);this.finish(e,a)},this.worker.onerror=t=>{console.warn("costume worker failed; building on the main thread",t),this.worker=null,this.workerDead=!0,this.fallback()}}catch{this.workerDead=!0}if(this.workerDead){this.fallback();return}this.busy=this.queue.shift(),this.worker.postMessage({id:this.busy})}}workerDead=!1;fallback(){const t=this.busy??this.queue.shift();t&&(this.busy=t,setTimeout(()=>this.finish(t,no(si(t))),16))}finish(t,e){this.templates.has(t)||this.templates.set(t,e);const n=this.templates.get(t);for(const r of this.waiting.get(t)??[])r(n);this.waiting.delete(t),this.busy=null,this.pump()}layout(t,e){const n=this.canvas.clientWidth||window.innerWidth,r=this.canvas.clientHeight||window.innerHeight,s=this.opts.pixelRatio;this.renderer.getPixelRatio()!==s&&this.renderer.setPixelRatio(s);const a=this.renderer.getSize(new Rt);(a.x!==n||a.y!==r)&&this.renderer.setSize(n,r,!1);const o=Math.max(n/t.w,r/t.h),c=n/o,l=r/o,h=(t.w-c)/2/t.w,u=(t.h-l)/2/t.h;this.bgUniforms.uCrop.value.set(h,u,c/t.w,l/t.h),this.bgUniforms.uMirror.value=e?1:0,this.camera.fov=Zr.radToDeg(2*Math.atan(l/2/t.f)),this.camera.aspect=n/r,this.camera.updateProjectionMatrix(),this.world.scale.x=e?-1:1,this.cover={s:o,ox:(t.w-c)/2,oy:(t.h-l)/2,vw:t.w,vh:t.h,cw:n,ch:r,mirror:e}}sync(t,e,n){const r=this.lastT<0?.03333333333333333:Math.min(.1,Math.max(0,n-this.lastT));this.lastT=n;const s=new Set;for(const a of t){const o=e(a.id);let c=this.wearers.get(a.id);c&&c.def.id!==o&&this.templates.has(o)&&(c.leaving=!0,this.leaving.push(c),this.wearers.delete(a.id),c=void 0),!(!c&&!this.templates.has(o))&&(s.add(a.id),c||(c=this.dress(a.id,o)),c.life=Math.min(1,c.life+r/.35),this.pose(c,a,n))}for(const[a,o]of this.wearers)s.has(a)||this.drop(o);this.leaving=this.leaving.filter(a=>{if(a.life-=r/.35,a.life<=0)return this.drop(a),!1;const o=t.find(c=>c.id===a.trackId);return o&&this.pose(a,o,n),!0})}dress(t,e){const n=this.template(e),r=sh(n.root),s=new Map;r.traverse(l=>{l.isBone&&s.set(l.name,l)});const a=new Map;r.traverse(l=>{const h=l;if(!h.isMesh)return;const u=d=>{let f=a.get(d);return f||(f=d.clone(),f.onBeforeCompile=d.onBeforeCompile,f.customProgramCacheKey=d.customProgramCacheKey,f.alphaHash=!0,a.set(d,f)),f};h.material=Array.isArray(h.material)?h.material.map(u):u(h.material)});const o=n.def.segs.map(l=>s.get(l.name)).filter(Boolean),c={trackId:t,def:n.def,root:r,rig:new fx(n.def.segs,s),mats:[...a.values()],fade:0,life:0,leaving:!1,boneList:o,hist:Array.from({length:Zs},()=>new Float32Array(o.length*7)),histHead:0,clones:[]};return this.world.add(r),this.wearers.set(t,c),c}drop(t){this.world.remove(t.root);for(const e of t.clones)this.world.remove(e.root,e.shadow);for(const e of t.mats)e.dispose();this.wearers.get(t.trackId)===t&&this.wearers.delete(t.trackId)}pose(t,e,n){const r=t.def,s=t.rig,a=hx(e.world),o=e.len.torso/s.torso*(r.fit?.size??1)*this.opts.size,c=r.fit?.limb??0,l=(g,v)=>{const m=1+(v/o/(s.len.get(g)??1)-1)*c;s.setLength(g,Math.min(1.6,Math.max(.65,m)))};for(const g of["L","R"])l("arm"+g,e.len.upperArm),l("thigh"+g,e.len.thigh),l("shin"+g,e.len.shin);const h=s.neckFit(e.len.neck/o);s.setNeck(1+(Math.min(1.25,Math.max(.45,h))-1)*(r.fit?.head??.85)),s.apply(a,n,r.idle?.tail??0),t.root.position.set(e.T.x,e.T.y,e.T.z),t.root.scale.setScalar(o);const u=e.presence*Math.max(0,Math.min(1,t.life)),d=u*u*(3-2*u);if(d!==t.fade){for(const g of t.mats)g.opacity=d;t.fade=d}t.root.visible=d>.01&&!this.hideWearers,r.tick?.(t.root,n),t.histHead=(t.histHead+1)%Zs;const f=t.hist[t.histHead];t.boneList.forEach((g,v)=>{g.quaternion.toArray(f,v*7),g.position.toArray(f,v*7+4)}),this.posePyramid(t,o,d,n)}posePyramid(t,e,n,r){const s=this.pyramid?this.wearers.size>1?2:3:0,a=[];for(let v=1;v<=s;v++)for(let m=0;m<=v;m++)a.push([v,m]);for(;t.clones.length>a.length;){const v=t.clones.pop();this.world.remove(v.root,v.shadow)}for(;t.clones.length<a.length;){const v=sh(t.root);v.traverse(M=>{M.castShadow=!1});const m=new Map;v.traverse(M=>{M.isBone&&m.set(M.name,M)});const[p,S]=a[t.clones.length],b=new Gt(gx,mx);b.renderOrder=1,t.clones.push({root:v,bones:t.def.segs.map(M=>m.get(M.name)).filter(Boolean),row:p,col:S,shadow:b}),this.world.add(v,b)}const o=t.rig.torso*e*3.2,c=this.ground,{back:l,side:h}=c.axes(),u=t.root.position,d=c.foot(u),f=c.height(u),g=new Fe().setFromUnitVectors(new U(0,0,1),c.n);for(const v of t.clones){const m=v.col-v.row/2,p=Math.round(v.row*3+Math.abs(m)*1.5),S=t.hist[(t.histHead-p+Zs*4)%Zs];v.bones.forEach((M,E)=>{M.quaternion.fromArray(S,E*7),M.position.fromArray(S,E*7+4)});const b=d.clone().addScaledVector(l,v.row*o*.5).addScaledVector(h,m*o*.55);v.root.position.copy(b).addScaledVector(c.n,f),v.root.scale.copy(t.root.scale),v.root.visible=n>.01,v.shadow.position.copy(b).addScaledVector(c.n,.004),v.shadow.quaternion.copy(g),v.shadow.scale.set(o*.42,o*.26,1),v.shadow.visible=v.root.visible,t.def.tick?.(v.root,r-p/30)}}stageLights(t,e,n){const r=[16722324,11796265,16769065,2744575,9187071];this.rims.forEach((s,a)=>{s.intensity=t?2.2+3*n:0;const o=(e*.12+a*.4)%1*r.length,c=Math.floor(o),l=o-c;s.color.setHex(r[c%r.length]).lerp(new Ht(r[(c+1)%r.length]),l)})}people(){return[...this.wearers.values()].filter(t=>t.root.visible).map(t=>t.root.position.clone())}render(t,e,n){this.renderer.shadowMap.enabled=this.opts.shadows,t&&this.light.update(t,e,this.cover.mirror,n,this.people(),this.opts.envLight),this.renderer.render(this.scene,this.camera)}get count(){return this.wearers.size}}const ai=[{id:"pyramid",name:"Pyramid",code:8,swatch:"conic-gradient(from 150deg at 50% 18%, transparent 0 60deg, #ff2d95 60deg 64deg, #b6ff2e 64deg 68deg, transparent 68deg), linear-gradient(#2a0f3d, #08050f)"},{id:"tunnel",name:"Tunnel",code:9,swatch:"repeating-radial-gradient(circle, #ff2d95 0 3px, #12071f 3px 8px, #2ee6ff 8px 11px, #12071f 11px 16px)"},{id:"lasers",name:"Lasers",code:10,swatch:"linear-gradient(115deg, transparent 46%, #b6ff2e 48%, transparent 50%), linear-gradient(65deg, transparent 46%, #ff2d95 48%, transparent 50%), linear-gradient(90deg, transparent 47%, #2ee6ff 49%, transparent 51%), #07040d"},{id:"kaleido",name:"Kaleido",code:11,swatch:"conic-gradient(#ff2d95, #ffe62e, #b6ff2e, #2ee6ff, #8a2eff, #ff2d95)"},{id:"rings",name:"Rings",code:5,swatch:"repeating-radial-gradient(circle, #ff3d7f 0 5px, #ffb23d 5px 10px, #3dd6ff 10px 15px, #8c5cff 15px 20px)"},{id:"neon",name:"Neon",code:4,swatch:"radial-gradient(circle, transparent 0 40%, #39ff9c 42% 50%, transparent 54%), #06030f"},{id:"pop",name:"Pop Art",code:1,swatch:"radial-gradient(circle at 30% 30%, #ffde00 0 22%, transparent 23%), radial-gradient(circle at 70% 70%, #ff2d8a 0 22%, transparent 23%), #19c3ff"},{id:"warhol",name:"Warhol",code:2,swatch:"conic-gradient(#ff5fa2 0 25%, #ffd400 0 50%, #2ad4c4 0 75%, #7b5cff 0)"},{id:"echo",name:"Echoes",code:6,swatch:"linear-gradient(90deg, #1b1033, #ff2db4 40%, #2de2ff 70%, #1b1033)"},{id:"disco",name:"Disco",code:7,swatch:"radial-gradient(circle at 30% 30%, #ff4fd8, transparent 45%), radial-gradient(circle at 70% 60%, #4fd1ff, transparent 45%), radial-gradient(circle at 45% 80%, #ffe14f, transparent 40%), #120820"},{id:"solar",name:"Solarize",code:3,swatch:"linear-gradient(135deg, #1a0b3d, #ff7a00 45%, #00e5ff 55%, #2a0b3d)"},{id:"spot",name:"Spotlight",code:0,swatch:"radial-gradient(circle at 50% 40%, #fff6d8, #6a5a40 45%, #120f0a 75%)"}],xx=[[2757440,16727435,16756736,16774084],[731722,46023,16740156,16776160],[2951947,9321727,3997598,16382065],[1058330,16723502,3065343,16769520]],fa=12,Ks=`
  varying vec2 vUv;
  void main() { vUv = position.xy * 0.5 + 0.5; gl_Position = vec4(position.xy, 0.0, 1.0); }`,Mx=`
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
  }`,bx=`
  varying vec2 vUv;
  uniform sampler2D uTex, uMask;
  uniform vec4 uOn;
  void main() {
    vec4 m = smoothstep(0.3, 0.7, texture2D(uMask, vec2(vUv.x, 1.0 - vUv.y))) * uOn;
    gl_FragColor = vec4(texture2D(uTex, vUv).rgb, max(max(m.r, m.g), max(m.b, m.a)));
  }`,yx=`
  varying vec2 vUv;
  uniform sampler2D uTex, uMask, uFx, uPrev;
  uniform highp sampler2DArray uHist;
  uniform float uHead, uTime, uAspect, uBeat, uLevel, uClones;
  uniform int uPreset;
  uniform vec4 uOn, uBox;
  // the pyramid, laid out on the floor (pose/ground.ts) and projected: each clone's feet in uv, its scale against the
  // subject, its delay in frames; back to front. uFoot: the subject's own feet in uv; uFootW: their width in uv
  uniform vec4 uClone[9];
  uniform int uCloneN;
  uniform vec2 uFoot;
  uniform float uFootW;
  uniform vec3 uPal[16];
  ${Mx}

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
    return texture(uHist, vec3(q, mod(uHead - delay + ${fa}.0 * 8.0, ${fa}.0)));
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
    if (uPreset != 1 && uPreset != 2 && uPreset != 0) bg += halo * (uPreset == 4 ? 0.0 : 1.0);
    gl_FragColor = vec4(mix(bg, fg, subj), 1.0);
  }`,Sx=`
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
  }`,Ex=`
  varying vec2 vUv;
  uniform sampler2D uSrc;
  uniform vec2 uDir;
  void main() {
    vec3 c = texture2D(uSrc, vUv).rgb * 0.2270270;
    c += (texture2D(uSrc, vUv + uDir * 1.3846154).rgb + texture2D(uSrc, vUv - uDir * 1.3846154).rgb) * 0.3162162;
    c += (texture2D(uSrc, vUv + uDir * 3.2307692).rgb + texture2D(uSrc, vUv - uDir * 3.2307692).rgb) * 0.0702703;
    gl_FragColor = vec4(c, 1.0);
  }`,Dh=`
  varying vec2 vUv;
  uniform sampler2D uScene, uBloom1, uBloom2, uOld;
  uniform float uMix;
  #ifdef FG
  uniform sampler2D uMask;
  uniform vec4 uOn;
  #endif
  uniform float uTime, uBeat, uFlash;
  uniform vec2 uRes;
  float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
  void main() {
    vec2 d = vUv - 0.5;
    float ca = 0.006 + 0.012 * uBeat;
    vec3 c = vec3(texture2D(uScene, vUv + d * ca).r, texture2D(uScene, vUv).g, texture2D(uScene, vUv - d * ca).b);
    if (uMix < 1.0) c = mix(texture2D(uOld, vUv).rgb, c, uMix);
    c += texture2D(uBloom1, vUv).rgb * 0.75 + texture2D(uBloom2, vUv).rgb * 0.9;
    vec2 v = d * vec2(1.0, 1.15);
    c *= 1.0 - 0.55 * dot(v, v);
    c += uBeat * uFlash * 0.07;
    // the highlights roll off instead of clipping: neon stays a colour
    vec3 hi = max(c - 0.8, 0.0);
    c = min(c, 0.8) + 0.2 * (1.0 - exp(-hi * 3.0)) + hi * 0.05;
    c += (hash(vUv * uRes + fract(uTime * 7.31) * 100.0) - 0.5) * 0.04;
    #ifdef FG
    // the subjects again, over whatever the 3D scene drew: the same grade, only where they stand
    vec4 m = smoothstep(0.3, 0.7, texture2D(uMask, vec2(vUv.x, 1.0 - vUv.y))) * uOn;
    gl_FragColor = vec4(c, max(max(m.r, m.g), max(m.b, m.a)));
    #else
    gl_FragColor = vec4(c, 1.0);
    #endif
  }`;class wx{material;foreground;_preset=ai[0];get preset(){return this._preset}set preset(t){t!==this._preset&&(this.fromCode=this._preset.code,this.xfade=this.started?0:1,this._preset=t)}fromCode=0;xfade=1;started=!1;rtOld=null;subjects=2;beat=0;clones=!0;maskTex;maskData=new Uint8Array(4);mw=0;mh=0;fw=0;fh=0;fxTex;fxData;chans=[null,null,null,null];chanMask=[null,null,null,null];union;dist;trail;stamp;uOn=new se;box=new se(.35,.1,.65,.7);quad=new Gt(new Ei(2,2));quadScene=new du;cam=new Rc(-1,1,1,-1,0,1);cut;scene;bright;blur;rtScene=[];rtB1a=null;rtB1b=null;rtB2a=null;rtB2b=null;hist=null;head=0;flip=0;sizeKey="";constructor(t,e){this.maskTex=new Kr(new Uint8Array(4),1,1,Ve),this.maskTex.needsUpdate=!0,this.resizeFx(160,90);const n={depthTest:!1,depthWrite:!1,toneMapped:!1};this.cut=new He({...n,vertexShader:Ks,fragmentShader:bx,uniforms:{uTex:t.uTex,uMask:{value:this.maskTex},uOn:{value:this.uOn}}}),this.scene=new He({...n,vertexShader:Ks,fragmentShader:yx,uniforms:{uTex:t.uTex,uMask:{value:this.maskTex},uFx:{value:this.fxTex},uPrev:{value:null},uHist:{value:null},uHead:{value:0},uClones:{value:1},uClone:{value:Array.from({length:9},()=>new se)},uCloneN:{value:0},uFoot:{value:new Rt(.5,.1)},uFootW:{value:.2},uTime:{value:0},uAspect:{value:1},uBeat:{value:0},uLevel:{value:0},uPreset:{value:0},uOn:{value:this.uOn},uBox:{value:this.box},uPal:{value:xx.flat().map(r=>new Ht(r))}}}),this.bright=new He({...n,vertexShader:Ks,fragmentShader:Sx,uniforms:{uSrc:{value:null},uTexel:{value:new Rt},uThreshold:{value:.72}}}),this.blur=new He({...n,vertexShader:Ks,fragmentShader:Ex,uniforms:{uSrc:{value:null},uDir:{value:new Rt}}}),this.material=new He({...n,vertexShader:e,fragmentShader:Dh,uniforms:{uCrop:t.uCrop,uMirror:t.uMirror,uScene:{value:null},uBloom1:{value:null},uBloom2:{value:null},uTime:{value:0},uBeat:{value:0},uFlash:{value:1},uRes:{value:new Rt(1,1)},uOld:{value:null},uMix:{value:1}}}),this.foreground=new He({...n,vertexShader:e,fragmentShader:Dh,transparent:!0,defines:{FG:1},uniforms:{...this.material.uniforms,uMask:this.scene.uniforms.uMask,uOn:this.scene.uniforms.uOn}}),this.quad.frustumCulled=!1,this.quadScene.add(this.quad)}resizeFx(t,e){this.fxTex?.dispose(),this.fxData=new Uint8Array(t*e*4),this.fxTex=new Kr(this.fxData,t,e,Ve),this.fxTex.magFilter=_e,this.fxTex.minFilter=_e,this.union=new Float32Array(t*e),this.dist=new Float32Array(t*e),this.trail=new Float32Array(t*e),this.stamp=new Float32Array(t*e);for(let n=0;n<t*e;n++)this.fxData[n*4]=255;this.fxTex.needsUpdate=!0,this.fw=t,this.fh=e,this.scene&&(this.scene.uniforms.uFx.value=this.fxTex)}frameDt=1/30;update(t,e,n,r,s,a){this.frameDt=e;const o=this.scene.uniforms;o.uTime.value=n,o.uAspect.value=r,o.uPreset.value=this.preset.code,o.uBeat.value=this.beat,o.uClones.value=this.clones?1:0,this.material.uniforms.uTime.value=n,this.material.uniforms.uBeat.value=this.beat;const c=r>=1?160:Math.max(48,Math.round(160*r)),l=r>=1?Math.max(48,Math.round(160/r)):160;(c!==this.fw||l!==this.fh)&&this.resizeFx(c,l);const h=t.filter(v=>v.presence>0).sort((v,m)=>m.len.torso/-m.T.z-v.len.torso/-v.T.z).slice(0,this.subjects),u=new Set(h.map(v=>v.id));for(let v=0;v<4;v++)this.chans[v]!==null&&!u.has(this.chans[v])&&(this.chans[v]=null,this.chanMask[v]=null);for(const v of h){let m=this.chans.indexOf(v.id);if(m<0){if(m=this.chans.indexOf(null),m<0)continue;this.chans[m]=v.id}const p=v.det?.mask;if(p){(p.w!==this.mw||p.h!==this.mh)&&this.resizeMask(p.w,p.h);let S=this.chanMask[m];if(!S||S.length!==p.data.length)S=this.chanMask[m]=new Float32Array(p.data.length),S.set(p.data);else{const b=1-Math.exp(-e/.04),M=p.data;for(let E=0;E<M.length;E++)S[E]=S[E]+(M[E]-S[E])*b}}}const d=[0,0,0,0];for(let v=0;v<4;v++){const m=this.chans[v];m!==null&&this.chanMask[v]&&(d[v]=t.find(p=>p.id===m)?.presence??0)}if(this.uOn.set(d[0],d[1],d[2],d[3]),this.fx(e,n,d),this.layPyramid(h[0],s,a,e),!this.mw)return;const f=this.mw*this.mh,g=this.maskData;for(let v=0;v<4;v++){const m=this.chanMask[v];if(!m){for(let p=0;p<f;p++)g[p*4+v]=0;continue}for(let p=0;p<f;p++)g[p*4+v]=m[p]*255}this.maskTex.needsUpdate=!0}cloneSm=Array.from({length:9},()=>new se);cloneSmN=0;layPyramid(t,e,n,r=1/30){const s=this.scene.uniforms;if(!t||!e||!n){s.uCloneN.value=0,this.cloneSmN=0;return}const a=new U(t.T.x,t.T.y,t.T.z),o=e.foot(a),c=Math.max(1.2,Math.min(2.2,e.height(a)*1.9)),{back:l,side:h}=e.axes(),u=ns(o,n),d=1-Math.exp(-r/.15),f=s.uFoot.value;this.cloneSmN===0?f.set(u.x,1-u.y):f.lerp(new Rt(u.x,1-u.y),d),s.uFootW.value=Math.max(.05,this.box.z-this.box.x);const g=[];for(let m=1;m<=3;m++)for(let p=0;p<=m;p++){const S=p-m/2,b=o.clone().addScaledVector(l,m*c*.5).addScaledVector(h,S*c*.55);if(b.z>-.3)continue;const M=ns(b,n);g.push({v:new se(M.x,1-M.y,-o.z/-b.z,m*3+Math.abs(S)*1.5),depth:-b.z})}g.sort((m,p)=>p.depth-m.depth);const v=s.uClone.value;g.forEach((m,p)=>{const S=this.cloneSm[p];this.cloneSmN!==g.length?S.copy(m.v):S.lerp(m.v,d),S.w=m.v.w,v[p].copy(S)}),this.cloneSmN=g.length,s.uCloneN.value=g.length}resizeMask(t,e){this.maskTex.dispose(),this.mw=t,this.mh=e,this.maskData=new Uint8Array(t*e*4),this.maskTex=new Kr(this.maskData,t,e,Ve),this.maskTex.magFilter=_e,this.maskTex.minFilter=_e,this.scene.uniforms.uMask.value=this.maskTex,this.cut.uniforms.uMask.value=this.maskTex}fx(t,e,n){const r=this.fw,s=this.fh,a=this.union,o=this.dist;let c=r,l=s,h=-1,u=-1;for(let p=0;p<s;p++){const S=Math.min(this.mh-1,Math.floor((p+.5)/s*this.mh));for(let b=0;b<r;b++){let M=0;if(this.mw){const E=S*this.mw+Math.min(this.mw-1,Math.floor((b+.5)/r*this.mw));for(let T=0;T<4;T++){const A=this.chanMask[T];A&&(M=Math.max(M,A[E]*n[T]))}}a[p*r+b]=M,M>.5&&(b<c&&(c=b),b>h&&(h=b),p<l&&(l=p),p>u&&(u=p))}}if(h>=0){const p=1-Math.exp(-t/.12),S=c/r,b=(h+1)/r,M=1-(u+1)/s,E=1-l/s;this.box.set(this.box.x+(S-this.box.x)*p,this.box.y+(M-this.box.y)*p,this.box.z+(b-this.box.z)*p,this.box.w+(E-this.box.w)*p)}const d=1e6,f=Math.SQRT2;for(let p=0;p<r*s;p++)o[p]=a[p]>.5?0:d;for(let p=0;p<s;p++)for(let S=0;S<r;S++){const b=p*r+S;let M=o[b];S>0&&(M=Math.min(M,o[b-1]+1)),p>0&&(M=Math.min(M,o[b-r]+1),S>0&&(M=Math.min(M,o[b-r-1]+f)),S<r-1&&(M=Math.min(M,o[b-r+1]+f))),o[b]=M}for(let p=s-1;p>=0;p--)for(let S=r-1;S>=0;S--){const b=p*r+S;let M=o[b];S<r-1&&(M=Math.min(M,o[b+1]+1)),p<s-1&&(M=Math.min(M,o[b+r]+1),S<r-1&&(M=Math.min(M,o[b+r+1]+f)),S>0&&(M=Math.min(M,o[b+r-1]+f))),o[b]=M}const g=Math.exp(-t/1.1),v=e*.2%1,m=this.fxData;for(let p=0;p<r*s;p++){const S=a[p];this.trail[p]=Math.max(this.trail[p]*g,S),S>.5&&(this.stamp[p]=v),m[p*4]=Math.min(1,o[p]/48)*255,m[p*4+1]=this.trail[p]*255,m[p*4+2]=this.stamp[p]*255,m[p*4+3]=S*255}this.fxTex.needsUpdate=!0}targets(t,e,n){const s=900/Math.max(e,n),a=Math.max(64,Math.round(e*s)),o=Math.max(64,Math.round(n*s)),c=`${a}x${o}`;if(c===this.sizeKey)return;this.sizeKey=c;for(const p of[...this.rtScene,this.rtB1a,this.rtB1b,this.rtB2a,this.rtB2b,this.rtOld])p?.dispose();this.hist?.dispose();const l=t.extensions,h=l.has("EXT_color_buffer_half_float")||l.has("EXT_color_buffer_float"),u={type:h?ji:Ln,depthBuffer:!1,magFilter:_e,minFilter:_e};this.bright.uniforms.uThreshold.value=h?.72:.62,this.rtScene=[new Ye(a,o,u),new Ye(a,o,u)],this.rtOld=new Ye(a,o,u);const d=Math.max(16,Math.round(a/4)),f=Math.max(16,Math.round(o/4)),g=Math.max(8,Math.round(a/16)),v=Math.max(8,Math.round(o/16));this.rtB1a=new Ye(d,f,u),this.rtB1b=new Ye(d,f,u),this.rtB2a=new Ye(g,v,u),this.rtB2b=new Ye(g,v,u);const m=480/Math.max(e,n);this.hist=new Od(Math.round(e*m),Math.round(n*m),fa,{depthBuffer:!1}),this.hist.texture.magFilter=_e,this.hist.texture.minFilter=_e,this.scene.uniforms.uHist.value=this.hist.texture,this.material.uniforms.uRes.value.set(a,o)}pass(t,e,n,r=0){this.quad.material=e,t.setRenderTarget(n,r),t.render(this.quadScene,this.cam)}render(t,e,n){this.targets(t,e,n);const r=t.getRenderTarget();this.head=(this.head+1)%fa,this.pass(t,this.cut,this.hist,this.head),this.scene.uniforms.uHead.value=this.head;const s=this.rtScene[this.flip],a=this.rtScene[1-this.flip];this.flip=1-this.flip,this.scene.uniforms.uPrev.value=a.texture,this.pass(t,this.scene,s),this.started=!0;const o=this.material.uniforms;if(this.xfade<1){this.xfade=Math.min(1,this.xfade+this.frameDt/.45);const f=this.scene.uniforms.uPreset.value;this.scene.uniforms.uPreset.value=this.fromCode,this.pass(t,this.scene,this.rtOld),this.scene.uniforms.uPreset.value=f,o.uOld.value=this.rtOld.texture}const c=this.xfade;o.uMix.value=c*c*(3-2*c);const l=this.bright.uniforms,h=this.blur.uniforms;l.uSrc.value=s.texture,l.uTexel.value.set(1/s.width,1/s.height),this.pass(t,this.bright,this.rtB1a);const u=(f,g,v)=>{for(let m=0;m<v;m++)h.uSrc.value=f.texture,h.uDir.value.set(1.4/f.width,0),this.pass(t,this.blur,g),h.uSrc.value=g.texture,h.uDir.value.set(0,1.4/f.height),this.pass(t,this.blur,f)};u(this.rtB1a,this.rtB1b,1),l.uSrc.value=this.rtB1a.texture,l.uTexel.value.set(1/this.rtB1a.width,1/this.rtB1a.height);const d=l.uThreshold.value;l.uThreshold.value=0,this.pass(t,this.bright,this.rtB2a),l.uThreshold.value=d,u(this.rtB2a,this.rtB2b,2),t.setRenderTarget(r),o.uScene.value=s.texture,o.uBloom1.value=this.rtB1a.texture,o.uBloom2.value=this.rtB2a.texture}}class Tx{env=0;level=0;stream=null;ctx=null;an=null;buf=new Uint8Array(0);avg=0;last=0;get on(){return!!this.an}async start(){if(this.an)return;this.stream=await navigator.mediaDevices.getUserMedia({audio:{echoCancellation:!1,noiseSuppression:!1,autoGainControl:!1}});const t=window.AudioContext??window.webkitAudioContext;this.ctx=new t,await this.ctx.resume();const e=this.ctx.createMediaStreamSource(this.stream);this.an=this.ctx.createAnalyser(),this.an.fftSize=1024,this.an.smoothingTimeConstant=0,e.connect(this.an),this.buf=new Uint8Array(this.an.frequencyBinCount)}stop(){for(const t of this.stream?.getTracks()??[])t.stop();this.ctx?.close(),this.stream=null,this.ctx=null,this.an=null,this.env=0,this.level=0}update(t,e){if(this.env*=Math.exp(-t/.18),!this.an||!this.ctx)return;this.an.getByteFrequencyData(this.buf);const n=this.ctx.sampleRate/this.an.fftSize,r=Math.max(1,Math.floor(40/n)),s=Math.max(r+1,Math.ceil(160/n));let a=0;for(let c=r;c<=s;c++)a+=this.buf[c];const o=a/((s-r+1)*255);this.level+=(o-this.level)*Math.min(1,t/.1),this.avg+=(o-this.avg)*Math.min(1,t/1.2),o>this.avg*1.3+.04&&o>.22&&e-this.last>260&&(this.env=1,this.last=e)}}class Ax{up=null;listening=!1;async enable(){const t=window.DeviceOrientationEvent;try{if(t?.requestPermission&&await t.requestPermission()!=="granted")return!1}catch{return!1}return this.listening||(this.listening=!0,window.addEventListener("deviceorientation",e=>{if(e.beta===null||e.gamma===null)return;const n=Zr.degToRad(e.beta),r=Zr.degToRad(e.gamma);(this.up??=new U).set(-Math.sin(r)*Math.cos(n),Math.sin(n),Math.cos(r)*Math.cos(n)).normalize()})),!0}upInCamera(t){if(!this.up)return null;const e=Zr.degToRad(screen.orientation?.angle??window.orientation??0),n=this.up.clone().applyAxisAngle(new U(0,0,1),-e);return t==="user"&&(n.x=-n.x,n.z=-n.z),n}}const Ih={people:2,model:"lite",size:1,lens:.85,envLight:!0,shadows:!0,debug:!1,mode:"one",costume:"jimothy",scene:"costume",effect:"pop",partyCostumes:"off",music:!1},Ku="costuma26.settings";function Rx(){try{const i={...Ih,...JSON.parse(localStorage.getItem(Ku)??"{}")},t=i.partyCostumes;return t===!0?i.partyCostumes="on":t!=="behind"&&t!=="on"&&(i.partyCostumes="off"),i}catch{return{...Ih}}}function Cx(i){try{localStorage.setItem(Ku,JSON.stringify(i))}catch{}}const Js=i=>`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${i}</svg>`,Bi={qr:Js('<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><path d="M14 14h3v3h-3zM20 14v.01M14 20h.01M17 20h4v-3"/>'),flip:Js('<path d="M4 7h3l2-3h6l2 3h3a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1z"/><path d="M9 13a3 3 0 0 1 5-2.2M15 13a3 3 0 0 1-5 2.2"/><path d="M14 9v2h-2M10 17v-2h2"/>'),gear:Js('<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/>'),camera:Js('<path d="M4 8h3l2-3h6l2 3h3a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1z"/><circle cx="12" cy="13" r="3.5"/>'),rec:'<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="7" fill="currentColor"/></svg>',stop:'<svg viewBox="0 0 24 24"><rect x="6" y="6" width="12" height="12" rx="2" fill="currentColor"/></svg>'};function Lx(i){return i&&i.__esModule&&Object.prototype.hasOwnProperty.call(i,"default")?i.default:i}var ho={exports:{}},Uh;function Px(){return Uh||(Uh=1,(function(i,t){var e=(function(){var n=function(E,T){var A=236,R=17,_=E,x=s[T],y=null,w=0,D=null,I=[],F={},H=function(N,B){w=_*4+17,y=(function(k){for(var X=new Array(k),K=0;K<k;K+=1){X[K]=new Array(k);for(var P=0;P<k;P+=1)X[K][P]=null}return X})(w),$(0,0),$(w-7,0),$(0,w-7),rt(),Q(),gt(N,B),_>=7&&ct(N),D==null&&(D=et(_,x,I)),Ct(D,B)},$=function(N,B){for(var k=-1;k<=7;k+=1)if(!(N+k<=-1||w<=N+k))for(var X=-1;X<=7;X+=1)B+X<=-1||w<=B+X||(0<=k&&k<=6&&(X==0||X==6)||0<=X&&X<=6&&(k==0||k==6)||2<=k&&k<=4&&2<=X&&X<=4?y[N+k][B+X]=!0:y[N+k][B+X]=!1)},V=function(){for(var N=0,B=0,k=0;k<8;k+=1){H(!0,k);var X=o.getLostPoint(F);(k==0||N>X)&&(N=X,B=k)}return B},Q=function(){for(var N=8;N<w-8;N+=1)y[N][6]==null&&(y[N][6]=N%2==0);for(var B=8;B<w-8;B+=1)y[6][B]==null&&(y[6][B]=B%2==0)},rt=function(){for(var N=o.getPatternPosition(_),B=0;B<N.length;B+=1)for(var k=0;k<N.length;k+=1){var X=N[B],K=N[k];if(y[X][K]==null)for(var P=-2;P<=2;P+=1)for(var ht=-2;ht<=2;ht+=1)P==-2||P==2||ht==-2||ht==2||P==0&&ht==0?y[X+P][K+ht]=!0:y[X+P][K+ht]=!1}},ct=function(N){for(var B=o.getBCHTypeNumber(_),k=0;k<18;k+=1){var X=!N&&(B>>k&1)==1;y[Math.floor(k/3)][k%3+w-8-3]=X}for(var k=0;k<18;k+=1){var X=!N&&(B>>k&1)==1;y[k%3+w-8-3][Math.floor(k/3)]=X}},gt=function(N,B){for(var k=x<<3|B,X=o.getBCHTypeInfo(k),K=0;K<15;K+=1){var P=!N&&(X>>K&1)==1;K<6?y[K][8]=P:K<8?y[K+1][8]=P:y[w-15+K][8]=P}for(var K=0;K<15;K+=1){var P=!N&&(X>>K&1)==1;K<8?y[8][w-K-1]=P:K<9?y[8][15-K-1+1]=P:y[8][15-K-1]=P}y[w-8][8]=!N},Ct=function(N,B){for(var k=-1,X=w-1,K=7,P=0,ht=o.getMaskFunction(B),at=w-1;at>0;at-=2)for(at==6&&(at-=1);;){for(var _t=0;_t<2;_t+=1)if(y[X][at-_t]==null){var ft=!1;P<N.length&&(ft=(N[P]>>>K&1)==1);var vt=ht(X,at-_t);vt&&(ft=!ft),y[X][at-_t]=ft,K-=1,K==-1&&(P+=1,K=7)}if(X+=k,X<0||w<=X){X-=k,k=-k;break}}},Nt=function(N,B){for(var k=0,X=0,K=0,P=new Array(B.length),ht=new Array(B.length),at=0;at<B.length;at+=1){var _t=B[at].dataCount,ft=B[at].totalCount-_t;X=Math.max(X,_t),K=Math.max(K,ft),P[at]=new Array(_t);for(var vt=0;vt<P[at].length;vt+=1)P[at][vt]=255&N.getBuffer()[vt+k];k+=_t;var xt=o.getErrorCorrectPolynomial(ft),Ft=l(P[at],xt.getLength()-1),Se=Ft.mod(xt);ht[at]=new Array(xt.getLength()-1);for(var vt=0;vt<ht[at].length;vt+=1){var ge=vt+Se.getLength()-ht[at].length;ht[at][vt]=ge>=0?Se.getAt(ge):0}}for(var O=0,vt=0;vt<B.length;vt+=1)O+=B[vt].totalCount;for(var C=new Array(O),j=0,vt=0;vt<X;vt+=1)for(var at=0;at<B.length;at+=1)vt<P[at].length&&(C[j]=P[at][vt],j+=1);for(var vt=0;vt<K;vt+=1)for(var at=0;at<B.length;at+=1)vt<ht[at].length&&(C[j]=ht[at][vt],j+=1);return C},et=function(N,B,k){for(var X=h.getRSBlocks(N,B),K=u(),P=0;P<k.length;P+=1){var ht=k[P];K.put(ht.getMode(),4),K.put(ht.getLength(),o.getLengthInBits(ht.getMode(),N)),ht.write(K)}for(var at=0,P=0;P<X.length;P+=1)at+=X[P].dataCount;if(K.getLengthInBits()>at*8)throw"code length overflow. ("+K.getLengthInBits()+">"+at*8+")";for(K.getLengthInBits()+4<=at*8&&K.put(0,4);K.getLengthInBits()%8!=0;)K.putBit(!1);for(;!(K.getLengthInBits()>=at*8||(K.put(A,8),K.getLengthInBits()>=at*8));)K.put(R,8);return Nt(K,X)};F.addData=function(N,B){B=B||"Byte";var k=null;switch(B){case"Numeric":k=d(N);break;case"Alphanumeric":k=f(N);break;case"Byte":k=g(N);break;case"Kanji":k=v(N);break;default:throw"mode:"+B}I.push(k),D=null},F.isDark=function(N,B){if(N<0||w<=N||B<0||w<=B)throw N+","+B;return y[N][B]},F.getModuleCount=function(){return w},F.make=function(){if(_<1){for(var N=1;N<40;N++){for(var B=h.getRSBlocks(N,x),k=u(),X=0;X<I.length;X++){var K=I[X];k.put(K.getMode(),4),k.put(K.getLength(),o.getLengthInBits(K.getMode(),N)),K.write(k)}for(var P=0,X=0;X<B.length;X++)P+=B[X].dataCount;if(k.getLengthInBits()<=P*8)break}_=N}H(!1,V())},F.createTableTag=function(N,B){N=N||2,B=typeof B>"u"?N*4:B;var k="";k+='<table style="',k+=" border-width: 0px; border-style: none;",k+=" border-collapse: collapse;",k+=" padding: 0px; margin: "+B+"px;",k+='">',k+="<tbody>";for(var X=0;X<F.getModuleCount();X+=1){k+="<tr>";for(var K=0;K<F.getModuleCount();K+=1)k+='<td style="',k+=" border-width: 0px; border-style: none;",k+=" border-collapse: collapse;",k+=" padding: 0px; margin: 0px;",k+=" width: "+N+"px;",k+=" height: "+N+"px;",k+=" background-color: ",k+=F.isDark(X,K)?"#000000":"#ffffff",k+=";",k+='"/>';k+="</tr>"}return k+="</tbody>",k+="</table>",k},F.createSvgTag=function(N,B,k,X){var K={};typeof arguments[0]=="object"&&(K=arguments[0],N=K.cellSize,B=K.margin,k=K.alt,X=K.title),N=N||2,B=typeof B>"u"?N*4:B,k=typeof k=="string"?{text:k}:k||{},k.text=k.text||null,k.id=k.text?k.id||"qrcode-description":null,X=typeof X=="string"?{text:X}:X||{},X.text=X.text||null,X.id=X.text?X.id||"qrcode-title":null;var P=F.getModuleCount()*N+B*2,ht,at,_t,ft,vt="",xt;for(xt="l"+N+",0 0,"+N+" -"+N+",0 0,-"+N+"z ",vt+='<svg version="1.1" xmlns="http://www.w3.org/2000/svg"',vt+=K.scalable?"":' width="'+P+'px" height="'+P+'px"',vt+=' viewBox="0 0 '+P+" "+P+'" ',vt+=' preserveAspectRatio="xMinYMin meet"',vt+=X.text||k.text?' role="img" aria-labelledby="'+W([X.id,k.id].join(" ").trim())+'"':"",vt+=">",vt+=X.text?'<title id="'+W(X.id)+'">'+W(X.text)+"</title>":"",vt+=k.text?'<description id="'+W(k.id)+'">'+W(k.text)+"</description>":"",vt+='<rect width="100%" height="100%" fill="white" cx="0" cy="0"/>',vt+='<path d="',_t=0;_t<F.getModuleCount();_t+=1)for(ft=_t*N+B,ht=0;ht<F.getModuleCount();ht+=1)F.isDark(_t,ht)&&(at=ht*N+B,vt+="M"+at+","+ft+xt);return vt+='" stroke="transparent" fill="black"/>',vt+="</svg>",vt},F.createDataURL=function(N,B){N=N||2,B=typeof B>"u"?N*4:B;var k=F.getModuleCount()*N+B*2,X=B,K=k-B;return M(k,k,function(P,ht){if(X<=P&&P<K&&X<=ht&&ht<K){var at=Math.floor((P-X)/N),_t=Math.floor((ht-X)/N);return F.isDark(_t,at)?0:1}else return 1})},F.createImgTag=function(N,B,k){N=N||2,B=typeof B>"u"?N*4:B;var X=F.getModuleCount()*N+B*2,K="";return K+="<img",K+=' src="',K+=F.createDataURL(N,B),K+='"',K+=' width="',K+=X,K+='"',K+=' height="',K+=X,K+='"',k&&(K+=' alt="',K+=W(k),K+='"'),K+="/>",K};var W=function(N){for(var B="",k=0;k<N.length;k+=1){var X=N.charAt(k);switch(X){case"<":B+="&lt;";break;case">":B+="&gt;";break;case"&":B+="&amp;";break;case'"':B+="&quot;";break;default:B+=X;break}}return B},Z=function(N){var B=1;N=typeof N>"u"?B*2:N;var k=F.getModuleCount()*B+N*2,X=N,K=k-N,P,ht,at,_t,ft,vt={"██":"█","█ ":"▀"," █":"▄","  ":" "},xt={"██":"▀","█ ":"▀"," █":" ","  ":" "},Ft="";for(P=0;P<k;P+=2){for(at=Math.floor((P-X)/B),_t=Math.floor((P+1-X)/B),ht=0;ht<k;ht+=1)ft="█",X<=ht&&ht<K&&X<=P&&P<K&&F.isDark(at,Math.floor((ht-X)/B))&&(ft=" "),X<=ht&&ht<K&&X<=P+1&&P+1<K&&F.isDark(_t,Math.floor((ht-X)/B))?ft+=" ":ft+="█",Ft+=N<1&&P+1>=K?xt[ft]:vt[ft];Ft+=`
`}return k%2&&N>0?Ft.substring(0,Ft.length-k-1)+Array(k+1).join("▀"):Ft.substring(0,Ft.length-1)};return F.createASCII=function(N,B){if(N=N||1,N<2)return Z(B);N-=1,B=typeof B>"u"?N*2:B;var k=F.getModuleCount()*N+B*2,X=B,K=k-B,P,ht,at,_t,ft=Array(N+1).join("██"),vt=Array(N+1).join("  "),xt="",Ft="";for(P=0;P<k;P+=1){for(at=Math.floor((P-X)/N),Ft="",ht=0;ht<k;ht+=1)_t=1,X<=ht&&ht<K&&X<=P&&P<K&&F.isDark(at,Math.floor((ht-X)/N))&&(_t=0),Ft+=_t?ft:vt;for(at=0;at<N;at+=1)xt+=Ft+`
`}return xt.substring(0,xt.length-1)},F.renderTo2dContext=function(N,B){B=B||2;for(var k=F.getModuleCount(),X=0;X<k;X++)for(var K=0;K<k;K++)N.fillStyle=F.isDark(X,K)?"black":"white",N.fillRect(X*B,K*B,B,B)},F};n.stringToBytesFuncs={default:function(E){for(var T=[],A=0;A<E.length;A+=1){var R=E.charCodeAt(A);T.push(R&255)}return T}},n.stringToBytes=n.stringToBytesFuncs.default,n.createStringToBytes=function(E,T){var A=(function(){for(var _=S(E),x=function(){var Q=_.read();if(Q==-1)throw"eof";return Q},y=0,w={};;){var D=_.read();if(D==-1)break;var I=x(),F=x(),H=x(),$=String.fromCharCode(D<<8|I),V=F<<8|H;w[$]=V,y+=1}if(y!=T)throw y+" != "+T;return w})(),R=63;return function(_){for(var x=[],y=0;y<_.length;y+=1){var w=_.charCodeAt(y);if(w<128)x.push(w);else{var D=A[_.charAt(y)];typeof D=="number"?(D&255)==D?x.push(D):(x.push(D>>>8),x.push(D&255)):x.push(R)}}return x}};var r={MODE_NUMBER:1,MODE_ALPHA_NUM:2,MODE_8BIT_BYTE:4,MODE_KANJI:8},s={L:1,M:0,Q:3,H:2},a={PATTERN000:0,PATTERN001:1,PATTERN010:2,PATTERN011:3,PATTERN100:4,PATTERN101:5,PATTERN110:6,PATTERN111:7},o=(function(){var E=[[],[6,18],[6,22],[6,26],[6,30],[6,34],[6,22,38],[6,24,42],[6,26,46],[6,28,50],[6,30,54],[6,32,58],[6,34,62],[6,26,46,66],[6,26,48,70],[6,26,50,74],[6,30,54,78],[6,30,56,82],[6,30,58,86],[6,34,62,90],[6,28,50,72,94],[6,26,50,74,98],[6,30,54,78,102],[6,28,54,80,106],[6,32,58,84,110],[6,30,58,86,114],[6,34,62,90,118],[6,26,50,74,98,122],[6,30,54,78,102,126],[6,26,52,78,104,130],[6,30,56,82,108,134],[6,34,60,86,112,138],[6,30,58,86,114,142],[6,34,62,90,118,146],[6,30,54,78,102,126,150],[6,24,50,76,102,128,154],[6,28,54,80,106,132,158],[6,32,58,84,110,136,162],[6,26,54,82,110,138,166],[6,30,58,86,114,142,170]],T=1335,A=7973,R=21522,_={},x=function(y){for(var w=0;y!=0;)w+=1,y>>>=1;return w};return _.getBCHTypeInfo=function(y){for(var w=y<<10;x(w)-x(T)>=0;)w^=T<<x(w)-x(T);return(y<<10|w)^R},_.getBCHTypeNumber=function(y){for(var w=y<<12;x(w)-x(A)>=0;)w^=A<<x(w)-x(A);return y<<12|w},_.getPatternPosition=function(y){return E[y-1]},_.getMaskFunction=function(y){switch(y){case a.PATTERN000:return function(w,D){return(w+D)%2==0};case a.PATTERN001:return function(w,D){return w%2==0};case a.PATTERN010:return function(w,D){return D%3==0};case a.PATTERN011:return function(w,D){return(w+D)%3==0};case a.PATTERN100:return function(w,D){return(Math.floor(w/2)+Math.floor(D/3))%2==0};case a.PATTERN101:return function(w,D){return w*D%2+w*D%3==0};case a.PATTERN110:return function(w,D){return(w*D%2+w*D%3)%2==0};case a.PATTERN111:return function(w,D){return(w*D%3+(w+D)%2)%2==0};default:throw"bad maskPattern:"+y}},_.getErrorCorrectPolynomial=function(y){for(var w=l([1],0),D=0;D<y;D+=1)w=w.multiply(l([1,c.gexp(D)],0));return w},_.getLengthInBits=function(y,w){if(1<=w&&w<10)switch(y){case r.MODE_NUMBER:return 10;case r.MODE_ALPHA_NUM:return 9;case r.MODE_8BIT_BYTE:return 8;case r.MODE_KANJI:return 8;default:throw"mode:"+y}else if(w<27)switch(y){case r.MODE_NUMBER:return 12;case r.MODE_ALPHA_NUM:return 11;case r.MODE_8BIT_BYTE:return 16;case r.MODE_KANJI:return 10;default:throw"mode:"+y}else if(w<41)switch(y){case r.MODE_NUMBER:return 14;case r.MODE_ALPHA_NUM:return 13;case r.MODE_8BIT_BYTE:return 16;case r.MODE_KANJI:return 12;default:throw"mode:"+y}else throw"type:"+w},_.getLostPoint=function(y){for(var w=y.getModuleCount(),D=0,I=0;I<w;I+=1)for(var F=0;F<w;F+=1){for(var H=0,$=y.isDark(I,F),V=-1;V<=1;V+=1)if(!(I+V<0||w<=I+V))for(var Q=-1;Q<=1;Q+=1)F+Q<0||w<=F+Q||V==0&&Q==0||$==y.isDark(I+V,F+Q)&&(H+=1);H>5&&(D+=3+H-5)}for(var I=0;I<w-1;I+=1)for(var F=0;F<w-1;F+=1){var rt=0;y.isDark(I,F)&&(rt+=1),y.isDark(I+1,F)&&(rt+=1),y.isDark(I,F+1)&&(rt+=1),y.isDark(I+1,F+1)&&(rt+=1),(rt==0||rt==4)&&(D+=3)}for(var I=0;I<w;I+=1)for(var F=0;F<w-6;F+=1)y.isDark(I,F)&&!y.isDark(I,F+1)&&y.isDark(I,F+2)&&y.isDark(I,F+3)&&y.isDark(I,F+4)&&!y.isDark(I,F+5)&&y.isDark(I,F+6)&&(D+=40);for(var F=0;F<w;F+=1)for(var I=0;I<w-6;I+=1)y.isDark(I,F)&&!y.isDark(I+1,F)&&y.isDark(I+2,F)&&y.isDark(I+3,F)&&y.isDark(I+4,F)&&!y.isDark(I+5,F)&&y.isDark(I+6,F)&&(D+=40);for(var ct=0,F=0;F<w;F+=1)for(var I=0;I<w;I+=1)y.isDark(I,F)&&(ct+=1);var gt=Math.abs(100*ct/w/w-50)/5;return D+=gt*10,D},_})(),c=(function(){for(var E=new Array(256),T=new Array(256),A=0;A<8;A+=1)E[A]=1<<A;for(var A=8;A<256;A+=1)E[A]=E[A-4]^E[A-5]^E[A-6]^E[A-8];for(var A=0;A<255;A+=1)T[E[A]]=A;var R={};return R.glog=function(_){if(_<1)throw"glog("+_+")";return T[_]},R.gexp=function(_){for(;_<0;)_+=255;for(;_>=256;)_-=255;return E[_]},R})();function l(E,T){if(typeof E.length>"u")throw E.length+"/"+T;var A=(function(){for(var _=0;_<E.length&&E[_]==0;)_+=1;for(var x=new Array(E.length-_+T),y=0;y<E.length-_;y+=1)x[y]=E[y+_];return x})(),R={};return R.getAt=function(_){return A[_]},R.getLength=function(){return A.length},R.multiply=function(_){for(var x=new Array(R.getLength()+_.getLength()-1),y=0;y<R.getLength();y+=1)for(var w=0;w<_.getLength();w+=1)x[y+w]^=c.gexp(c.glog(R.getAt(y))+c.glog(_.getAt(w)));return l(x,0)},R.mod=function(_){if(R.getLength()-_.getLength()<0)return R;for(var x=c.glog(R.getAt(0))-c.glog(_.getAt(0)),y=new Array(R.getLength()),w=0;w<R.getLength();w+=1)y[w]=R.getAt(w);for(var w=0;w<_.getLength();w+=1)y[w]^=c.gexp(c.glog(_.getAt(w))+x);return l(y,0).mod(_)},R}var h=(function(){var E=[[1,26,19],[1,26,16],[1,26,13],[1,26,9],[1,44,34],[1,44,28],[1,44,22],[1,44,16],[1,70,55],[1,70,44],[2,35,17],[2,35,13],[1,100,80],[2,50,32],[2,50,24],[4,25,9],[1,134,108],[2,67,43],[2,33,15,2,34,16],[2,33,11,2,34,12],[2,86,68],[4,43,27],[4,43,19],[4,43,15],[2,98,78],[4,49,31],[2,32,14,4,33,15],[4,39,13,1,40,14],[2,121,97],[2,60,38,2,61,39],[4,40,18,2,41,19],[4,40,14,2,41,15],[2,146,116],[3,58,36,2,59,37],[4,36,16,4,37,17],[4,36,12,4,37,13],[2,86,68,2,87,69],[4,69,43,1,70,44],[6,43,19,2,44,20],[6,43,15,2,44,16],[4,101,81],[1,80,50,4,81,51],[4,50,22,4,51,23],[3,36,12,8,37,13],[2,116,92,2,117,93],[6,58,36,2,59,37],[4,46,20,6,47,21],[7,42,14,4,43,15],[4,133,107],[8,59,37,1,60,38],[8,44,20,4,45,21],[12,33,11,4,34,12],[3,145,115,1,146,116],[4,64,40,5,65,41],[11,36,16,5,37,17],[11,36,12,5,37,13],[5,109,87,1,110,88],[5,65,41,5,66,42],[5,54,24,7,55,25],[11,36,12,7,37,13],[5,122,98,1,123,99],[7,73,45,3,74,46],[15,43,19,2,44,20],[3,45,15,13,46,16],[1,135,107,5,136,108],[10,74,46,1,75,47],[1,50,22,15,51,23],[2,42,14,17,43,15],[5,150,120,1,151,121],[9,69,43,4,70,44],[17,50,22,1,51,23],[2,42,14,19,43,15],[3,141,113,4,142,114],[3,70,44,11,71,45],[17,47,21,4,48,22],[9,39,13,16,40,14],[3,135,107,5,136,108],[3,67,41,13,68,42],[15,54,24,5,55,25],[15,43,15,10,44,16],[4,144,116,4,145,117],[17,68,42],[17,50,22,6,51,23],[19,46,16,6,47,17],[2,139,111,7,140,112],[17,74,46],[7,54,24,16,55,25],[34,37,13],[4,151,121,5,152,122],[4,75,47,14,76,48],[11,54,24,14,55,25],[16,45,15,14,46,16],[6,147,117,4,148,118],[6,73,45,14,74,46],[11,54,24,16,55,25],[30,46,16,2,47,17],[8,132,106,4,133,107],[8,75,47,13,76,48],[7,54,24,22,55,25],[22,45,15,13,46,16],[10,142,114,2,143,115],[19,74,46,4,75,47],[28,50,22,6,51,23],[33,46,16,4,47,17],[8,152,122,4,153,123],[22,73,45,3,74,46],[8,53,23,26,54,24],[12,45,15,28,46,16],[3,147,117,10,148,118],[3,73,45,23,74,46],[4,54,24,31,55,25],[11,45,15,31,46,16],[7,146,116,7,147,117],[21,73,45,7,74,46],[1,53,23,37,54,24],[19,45,15,26,46,16],[5,145,115,10,146,116],[19,75,47,10,76,48],[15,54,24,25,55,25],[23,45,15,25,46,16],[13,145,115,3,146,116],[2,74,46,29,75,47],[42,54,24,1,55,25],[23,45,15,28,46,16],[17,145,115],[10,74,46,23,75,47],[10,54,24,35,55,25],[19,45,15,35,46,16],[17,145,115,1,146,116],[14,74,46,21,75,47],[29,54,24,19,55,25],[11,45,15,46,46,16],[13,145,115,6,146,116],[14,74,46,23,75,47],[44,54,24,7,55,25],[59,46,16,1,47,17],[12,151,121,7,152,122],[12,75,47,26,76,48],[39,54,24,14,55,25],[22,45,15,41,46,16],[6,151,121,14,152,122],[6,75,47,34,76,48],[46,54,24,10,55,25],[2,45,15,64,46,16],[17,152,122,4,153,123],[29,74,46,14,75,47],[49,54,24,10,55,25],[24,45,15,46,46,16],[4,152,122,18,153,123],[13,74,46,32,75,47],[48,54,24,14,55,25],[42,45,15,32,46,16],[20,147,117,4,148,118],[40,75,47,7,76,48],[43,54,24,22,55,25],[10,45,15,67,46,16],[19,148,118,6,149,119],[18,75,47,31,76,48],[34,54,24,34,55,25],[20,45,15,61,46,16]],T=function(_,x){var y={};return y.totalCount=_,y.dataCount=x,y},A={},R=function(_,x){switch(x){case s.L:return E[(_-1)*4+0];case s.M:return E[(_-1)*4+1];case s.Q:return E[(_-1)*4+2];case s.H:return E[(_-1)*4+3];default:return}};return A.getRSBlocks=function(_,x){var y=R(_,x);if(typeof y>"u")throw"bad rs block @ typeNumber:"+_+"/errorCorrectionLevel:"+x;for(var w=y.length/3,D=[],I=0;I<w;I+=1)for(var F=y[I*3+0],H=y[I*3+1],$=y[I*3+2],V=0;V<F;V+=1)D.push(T(H,$));return D},A})(),u=function(){var E=[],T=0,A={};return A.getBuffer=function(){return E},A.getAt=function(R){var _=Math.floor(R/8);return(E[_]>>>7-R%8&1)==1},A.put=function(R,_){for(var x=0;x<_;x+=1)A.putBit((R>>>_-x-1&1)==1)},A.getLengthInBits=function(){return T},A.putBit=function(R){var _=Math.floor(T/8);E.length<=_&&E.push(0),R&&(E[_]|=128>>>T%8),T+=1},A},d=function(E){var T=r.MODE_NUMBER,A=E,R={};R.getMode=function(){return T},R.getLength=function(y){return A.length},R.write=function(y){for(var w=A,D=0;D+2<w.length;)y.put(_(w.substring(D,D+3)),10),D+=3;D<w.length&&(w.length-D==1?y.put(_(w.substring(D,D+1)),4):w.length-D==2&&y.put(_(w.substring(D,D+2)),7))};var _=function(y){for(var w=0,D=0;D<y.length;D+=1)w=w*10+x(y.charAt(D));return w},x=function(y){if("0"<=y&&y<="9")return y.charCodeAt(0)-48;throw"illegal char :"+y};return R},f=function(E){var T=r.MODE_ALPHA_NUM,A=E,R={};R.getMode=function(){return T},R.getLength=function(x){return A.length},R.write=function(x){for(var y=A,w=0;w+1<y.length;)x.put(_(y.charAt(w))*45+_(y.charAt(w+1)),11),w+=2;w<y.length&&x.put(_(y.charAt(w)),6)};var _=function(x){if("0"<=x&&x<="9")return x.charCodeAt(0)-48;if("A"<=x&&x<="Z")return x.charCodeAt(0)-65+10;switch(x){case" ":return 36;case"$":return 37;case"%":return 38;case"*":return 39;case"+":return 40;case"-":return 41;case".":return 42;case"/":return 43;case":":return 44;default:throw"illegal char :"+x}};return R},g=function(E){var T=r.MODE_8BIT_BYTE,A=n.stringToBytes(E),R={};return R.getMode=function(){return T},R.getLength=function(_){return A.length},R.write=function(_){for(var x=0;x<A.length;x+=1)_.put(A[x],8)},R},v=function(E){var T=r.MODE_KANJI,A=n.stringToBytesFuncs.SJIS;if(!A)throw"sjis not supported.";(function(x,y){var w=A(x);if(w.length!=2||(w[0]<<8|w[1])!=y)throw"sjis not supported."})("友",38726);var R=A(E),_={};return _.getMode=function(){return T},_.getLength=function(x){return~~(R.length/2)},_.write=function(x){for(var y=R,w=0;w+1<y.length;){var D=(255&y[w])<<8|255&y[w+1];if(33088<=D&&D<=40956)D-=33088;else if(57408<=D&&D<=60351)D-=49472;else throw"illegal char at "+(w+1)+"/"+D;D=(D>>>8&255)*192+(D&255),x.put(D,13),w+=2}if(w<y.length)throw"illegal char at "+(w+1)},_},m=function(){var E=[],T={};return T.writeByte=function(A){E.push(A&255)},T.writeShort=function(A){T.writeByte(A),T.writeByte(A>>>8)},T.writeBytes=function(A,R,_){R=R||0,_=_||A.length;for(var x=0;x<_;x+=1)T.writeByte(A[x+R])},T.writeString=function(A){for(var R=0;R<A.length;R+=1)T.writeByte(A.charCodeAt(R))},T.toByteArray=function(){return E},T.toString=function(){var A="";A+="[";for(var R=0;R<E.length;R+=1)R>0&&(A+=","),A+=E[R];return A+="]",A},T},p=function(){var E=0,T=0,A=0,R="",_={},x=function(w){R+=String.fromCharCode(y(w&63))},y=function(w){if(!(w<0)){if(w<26)return 65+w;if(w<52)return 97+(w-26);if(w<62)return 48+(w-52);if(w==62)return 43;if(w==63)return 47}throw"n:"+w};return _.writeByte=function(w){for(E=E<<8|w&255,T+=8,A+=1;T>=6;)x(E>>>T-6),T-=6},_.flush=function(){if(T>0&&(x(E<<6-T),E=0,T=0),A%3!=0)for(var w=3-A%3,D=0;D<w;D+=1)R+="="},_.toString=function(){return R},_},S=function(E){var T=E,A=0,R=0,_=0,x={};x.read=function(){for(;_<8;){if(A>=T.length){if(_==0)return-1;throw"unexpected end of file./"+_}var w=T.charAt(A);if(A+=1,w=="=")return _=0,-1;if(w.match(/^\s$/))continue;R=R<<6|y(w.charCodeAt(0)),_+=6}var D=R>>>_-8&255;return _-=8,D};var y=function(w){if(65<=w&&w<=90)return w-65;if(97<=w&&w<=122)return w-97+26;if(48<=w&&w<=57)return w-48+52;if(w==43)return 62;if(w==47)return 63;throw"c:"+w};return x},b=function(E,T){var A=E,R=T,_=new Array(E*T),x={};x.setPixel=function(I,F,H){_[F*A+I]=H},x.write=function(I){I.writeString("GIF87a"),I.writeShort(A),I.writeShort(R),I.writeByte(128),I.writeByte(0),I.writeByte(0),I.writeByte(0),I.writeByte(0),I.writeByte(0),I.writeByte(255),I.writeByte(255),I.writeByte(255),I.writeString(","),I.writeShort(0),I.writeShort(0),I.writeShort(A),I.writeShort(R),I.writeByte(0);var F=2,H=w(F);I.writeByte(F);for(var $=0;H.length-$>255;)I.writeByte(255),I.writeBytes(H,$,255),$+=255;I.writeByte(H.length-$),I.writeBytes(H,$,H.length-$),I.writeByte(0),I.writeString(";")};var y=function(I){var F=I,H=0,$=0,V={};return V.write=function(Q,rt){if(Q>>>rt)throw"length over";for(;H+rt>=8;)F.writeByte(255&(Q<<H|$)),rt-=8-H,Q>>>=8-H,$=0,H=0;$=Q<<H|$,H=H+rt},V.flush=function(){H>0&&F.writeByte($)},V},w=function(I){for(var F=1<<I,H=(1<<I)+1,$=I+1,V=D(),Q=0;Q<F;Q+=1)V.add(String.fromCharCode(Q));V.add(String.fromCharCode(F)),V.add(String.fromCharCode(H));var rt=m(),ct=y(rt);ct.write(F,$);var gt=0,Ct=String.fromCharCode(_[gt]);for(gt+=1;gt<_.length;){var Nt=String.fromCharCode(_[gt]);gt+=1,V.contains(Ct+Nt)?Ct=Ct+Nt:(ct.write(V.indexOf(Ct),$),V.size()<4095&&(V.size()==1<<$&&($+=1),V.add(Ct+Nt)),Ct=Nt)}return ct.write(V.indexOf(Ct),$),ct.write(H,$),ct.flush(),rt.toByteArray()},D=function(){var I={},F=0,H={};return H.add=function($){if(H.contains($))throw"dup key:"+$;I[$]=F,F+=1},H.size=function(){return F},H.indexOf=function($){return I[$]},H.contains=function($){return typeof I[$]<"u"},H};return x},M=function(E,T,A){for(var R=b(E,T),_=0;_<T;_+=1)for(var x=0;x<E;x+=1)R.setPixel(x,_,A(x,_));var y=m();R.write(y);for(var w=p(),D=y.toByteArray(),I=0;I<D.length;I+=1)w.writeByte(D[I]);return w.flush(),"data:image/gif;base64,"+w};return n})();(function(){e.stringToBytesFuncs["UTF-8"]=function(n){function r(s){for(var a=[],o=0;o<s.length;o++){var c=s.charCodeAt(o);c<128?a.push(c):c<2048?a.push(192|c>>6,128|c&63):c<55296||c>=57344?a.push(224|c>>12,128|c>>6&63,128|c&63):(o++,c=65536+((c&1023)<<10|s.charCodeAt(o)&1023),a.push(240|c>>18,128|c>>12&63,128|c>>6&63,128|c&63))}return a}return r(n)}})(),(function(n){i.exports=n()})(function(){return e})})(ho)),ho.exports}var Dx=Px();const Ix=Lx(Dx);function es(){return location.origin+location.pathname.replace(/index\.html$/,"")}function Ux(i){const t=Ix(0,"M");return t.addData(i),t.make(),t.createSvgTag({cellSize:8,margin:2,scalable:!0})}async function Nx(i,t){const e=new File([i],t,{type:i.type});if(navigator.canShare?.({files:[e]}))try{return await navigator.share({files:[e],title:"costuma 2026"}),"shared"}catch(r){if(r.name==="AbortError")return"cancelled"}return Ju(i,t),"saved"}function Ju(i,t){const e=document.createElement("a");e.href=URL.createObjectURL(i),e.download=t,document.body.appendChild(e),e.click(),e.remove(),setTimeout(()=>URL.revokeObjectURL(e.href),3e4)}function Fx(){const i=window.MediaRecorder;if(i)return["video/mp4;codecs=avc1","video/mp4","video/webm;codecs=vp9","video/webm;codecs=vp8","video/webm"].find(t=>i.isTypeSupported(t))}const te=i=>document.getElementById(i),Ox="./",Oe=new URLSearchParams(location.search),Fc=Oe.get("test")==="1",ti=Number(Oe.get("synth")??0),St=Rx();Oe.get("c")&&(St.costume=Oe.get("c"));Qe.some(i=>i.id===St.costume)||(St.costume=Qe[0].id);Oe.get("people")&&(St.people=Number(Oe.get("people")));const Vi=()=>Cx(St),Ce=te("video"),us=te("stage"),Mr=te("overlay"),de=Mr.getContext("2d"),Kt=new _x(us);Kt.opts.size=St.size;Kt.opts.shadows=St.shadows;Kt.opts.envLight=St.envLight;const Sn=new wx(Kt.bgUniforms,Zu),Wi=new Tx,Qu=new Ax;(Oe.get("scene")==="party"||Oe.get("scene")==="costume")&&(St.scene=Oe.get("scene"));Oe.get("fx")&&(St.effect=Oe.get("fx"));Oe.get("pc")&&(St.partyCostumes=Oe.get("pc")==="behind"?"behind":Oe.get("pc")==="1"||Oe.get("pc")==="on"?"on":"off");Sn.preset=ai.find(i=>i.id===St.effect)??ai[0];const fs=new _f(Ce,Oe.get("facing")??void 0);let Cn=null;const cn=new Af;let gs=!1;const _a=new Map,da=new Map;let tf=0;function pa(i){const t=_a.get(i);if(t)return t;if(St.mode==="one")return St.costume;let e=da.get(i);if(!e){const n=Qe.findIndex(r=>r.id===St.costume);e=Qe[(n+tf++)%Qe.length].id,da.set(i,e)}return e}const Nh=new Set;function Oc(i,t=!1){if(Kt.hasTemplate(i))return;const e=!Nh.has(i);Nh.add(i),!t&&e&&Ae(`Dressing up as ${si(i).name}…`,1800),(e||!t)&&Kt.prepare(i,!0).catch(n=>{console.error("build failed",i,n),Ae(`${si(i).name} failed to build`)})}let Fh=0;function Ae(i,t=1400){const e=te("toast");e.textContent=i,e.classList.add("on"),clearTimeout(Fh),Fh=window.setTimeout(()=>e.classList.remove("on"),t)}const Bx=i=>{const t=te("hint");t.textContent=i,t.classList.toggle("on",!!i)},ef=i=>`${Ox}thumbs/${i}.png`;function nf(){const i=te("picker");if(i.innerHTML="",St.scene==="party"){for(const e of ai){const n=document.createElement("button");n.className="card fx",n.dataset.id=e.id,n.setAttribute("role","option"),n.innerHTML='<div class="thumb"></div><div class="name"></div>',n.querySelector(".thumb").style.background=e.swatch,n.querySelector(".name").textContent=e.name,n.onclick=()=>Bc(e.id),i.appendChild(n)}ds();return}const t=(e,n,r="")=>{const s=document.createElement("button");s.className=`card ${r}`,s.dataset.id=e,s.setAttribute("role","option"),s.innerHTML='<div class="thumb"></div><div class="name"></div>',s.querySelector(".name").textContent=n;const a=s.querySelector(".thumb");if(e==="mix")a.textContent="MIX";else{const o=new Image;o.alt="",o.onerror=()=>{o.remove(),a.textContent=n.slice(0,1)},o.src=ef(e),a.appendChild(o)}s.onclick=()=>rf(e),i.appendChild(s)};t("mix","Mix","mix");for(const e of Qe)t(e.id,e.name);ds()}function ds(){for(const i of te("picker").querySelectorAll(".card")){const t=St.scene==="party"?i.dataset.id===St.effect:St.mode==="mix"?i.dataset.id==="mix":i.dataset.id===St.costume;i.classList.toggle("on",t),i.setAttribute("aria-selected",String(t)),t&&i.scrollIntoView({behavior:"smooth",inline:"center",block:"nearest"})}}function rf(i){_a.clear(),i==="mix"?(St.mode="mix",da.clear(),tf=0,Ae("Mix: everyone gets their own")):(St.mode="one",St.costume=i,Oc(i),Kt.hasTemplate(i)&&Ae(si(i).name,900)),Vi(),ds()}function Bc(i){const t=ai.find(e=>e.id===i)??ai[0];St.effect=t.id,Sn.preset=t,Vi(),ds(),Ae(t.name,800)}function Oh(i){const t=te("dip");t.classList.add("on"),setTimeout(async()=>{try{await i()}finally{requestAnimationFrame(()=>requestAnimationFrame(()=>t.classList.remove("on")))}},190)}function cc(i){St.scene=i,Vi(),Kt.setBackground(i==="party"?Sn.material:null),Cn?.setOptions({masks:i==="party"});for(const t of document.querySelectorAll(".modes button")){const e=t.dataset.scene===i;t.classList.toggle("on",e),t.setAttribute("aria-selected",String(e))}nf()}function kc(i){te(i).classList.remove("hidden")}for(const i of document.querySelectorAll(".modal"))i.addEventListener("click",t=>{(t.target===i||t.target.closest("[data-close]"))&&i.classList.add("hidden")});function Bh(){const i=es();te("qr-code").innerHTML=Ux(i),te("qr-url").textContent=i,kc("qr")}te("btn-copy").onclick=async()=>{try{await navigator.clipboard.writeText(es()),Ae("Link copied")}catch{Ae("Could not copy — long-press the link")}};te("btn-share-link").onclick=async()=>{if(navigator.share)try{await navigator.share({title:"costuma 2026",text:"Be a 3D costume:",url:es()})}catch{}else try{await navigator.clipboard.writeText(es()),Ae("Link copied")}catch{Ae(es())}};function kx(){const i=te("settings-body");i.innerHTML="";const t=(s,a,o)=>{const c=document.createElement("div");c.className="set";const l=document.createElement("label"),h=document.createElement("span");if(h.textContent=s,a){const u=document.createElement("small");u.textContent=a,h.appendChild(u)}l.append(h,o),c.appendChild(l),i.appendChild(c)},e=(s,a,o)=>{const c=document.createElement("div");c.className="seg";for(const[l,h]of s){const u=document.createElement("button");u.textContent=h,u.classList.toggle("on",a()===l),u.onclick=()=>{o(l),Vi();for(const d of c.children)d.classList.remove("on");u.classList.add("on")},c.appendChild(u)}return c},n=(s,a)=>{const o=document.createElement("input");return o.type="checkbox",o.className="switch",o.checked=s(),o.onchange=()=>{a(o.checked),Vi()},o},r=(s,a,o,c,l)=>{const h=document.createElement("input");return h.type="range",h.min=String(s),h.max=String(a),h.step=String(o),h.value=String(c()),h.oninput=()=>{l(Number(h.value)),Vi()},h};t(St.scene==="party"?"Subjects":"People",St.scene==="party"?"How many people to cut out (the nearest)":"How many to dress at once",e([[1,"1"],[2,"2"],[3,"3"],[4,"4"]],()=>St.people,s=>{St.people=s,Cn?.setOptions({numPoses:s})})),t("Costume size","Bigger hides more of the person",r(.8,1.5,.01,()=>St.size,s=>{St.size=s,Kt.opts.size=s})),t("Pose model","Accurate is steadier, slower to load and run",e([["lite","Fast"],["full","Accurate"]],()=>St.model,s=>{St.model=s,Xx()})),t("Light from the camera","The costume is lit by the room it stands in",n(()=>St.envLight,s=>{St.envLight=s,Kt.opts.envLight=s})),t("Shadows","Off is faster on older phones",n(()=>St.shadows,s=>{St.shadows=s,Kt.opts.shadows=s})),t("Lens","If costumes look too flat or too deep",r(.55,1.3,.01,()=>St.lens,s=>{St.lens=s})),t("React to the music","Listens through the microphone for the beat; clips record the sound",n(()=>St.music,s=>{St.music=s,s?Wi.start().then(()=>Ae("Listening for the beat",1200)).catch(()=>{St.music=!1,Vi(),Ae("No microphone")}):Wi.stop()})),t("Costumes in party mode","Behind you: you stay yourself, a pyramid of your costume dances behind you",e([["off","Off"],["behind","Behind"],["on","On you"]],()=>St.partyCostumes,s=>{St.partyCostumes=s})),t("Show the skeleton","What the pose tracker sees",n(()=>St.debug,s=>{St.debug=s}))}let lc=!1,Xi=null;function sf(i,t){Xi={blob:i,name:t};const e=te("preview-media");e.innerHTML="";const n=URL.createObjectURL(i);if(i.type.startsWith("video")){const r=document.createElement("video");r.src=n,r.controls=!0,r.playsInline=!0,r.loop=!0,r.muted=!0,r.play().catch(()=>{}),e.appendChild(r)}else{const r=new Image;r.src=n,e.appendChild(r)}kc("preview")}te("btn-share").onclick=async()=>{Xi&&await Nx(Xi.blob,Xi.name)==="saved"&&Ae("Saved")};te("btn-save").onclick=()=>{Xi&&(Ju(Xi.blob,Xi.name),Ae("Saved"))};const af=()=>new Date().toISOString().slice(0,19).replace(/[:T]/g,"-");let Qs=null,kh=0;function zx(){const i=te("btn-rec");if(Qs){Qs.stop();return}const t=Fx(),e=us.captureStream;if(!t||!e){Ae("Recording is not supported in this browser");return}const n=[],r=e.call(us,30);for(const a of Wi.stream?.getAudioTracks()??[])r.addTrack(a);const s=new MediaRecorder(r,{mimeType:t,videoBitsPerSecond:8e6});s.ondataavailable=a=>{a.data.size&&n.push(a.data)},s.onstop=()=>{clearTimeout(kh),Qs=null,i.classList.remove("on"),i.innerHTML=Bi.rec;const a=t.split(";")[0];sf(new Blob(n,{type:a}),`costuma-${af()}.${a.includes("mp4")?"mp4":"webm"}`)},s.start(250),Qs=s,i.classList.add("on"),i.innerHTML=Bi.stop,kh=window.setTimeout(()=>s.state==="recording"&&s.stop(),2e4),Ae("Recording — tap to stop",1200)}function of(i){const t=Kt.cover,e=i.image,n=(e[z.shL].x+e[z.shR].x+e[z.hipL].x+e[z.hipR].x)/4,r=(e[z.shL].y+e[z.shR].y+e[z.hipL].y+e[z.hipR].y)/4;let s=(n*t.vw-t.ox)*t.s;const a=(r*t.vh-t.oy)*t.s;return t.mirror&&(s=t.cw-s),{x:s,y:a}}us.addEventListener("click",i=>{if(!gs)return;if(St.scene==="party"&&St.partyCostumes==="off"){const a=ai.findIndex(o=>o.id===St.effect);Bc(ai[(a+1)%ai.length].id);return}let t=null,e=1/0;for(const a of cn.tracks){if(a.lost)continue;const o=of(a),c=Math.hypot(o.x-i.clientX,o.y-i.clientY);c<e&&(e=c,t=a)}if(!t||e>Math.max(innerWidth,innerHeight)*.3)return;const n=pa(t.id),r=Qe.findIndex(a=>a.id===n),s=Qe[(r+1)%Qe.length].id;_a.set(t.id,s),Oc(s),Ae(si(s).name,900)});let hc=0,zh=-1,uc=0,fc=performance.now(),uo=performance.now();const br=document.createElement("canvas"),Hx=br.getContext("2d");function Vx(){if(St.scene!=="party")return Ce;const i=Ce.videoWidth||720,t=Ce.videoHeight||1280,e=480/Math.max(i,t),n=Math.round(i*e),r=Math.round(t*e);return(br.width!==n||br.height!==r)&&(br.width=n,br.height=r),Hx.drawImage(Ce,0,0,n,r),br}let zc=0,fo=performance.now(),po=0;function Hc(){return Ef(Ce.videoWidth||720,Ce.videoHeight||1280,St.lens)}function cf(i){if(requestAnimationFrame(cf),!gs)return;hc++;const t=Hc();Kt.layout(t,fs.mirrored&&!ti);let e=null;if(ti){if(e=_v(ti,(i-fc)/1e3*(Fc?0:1)+Number(Oe.get("t")??0),t),St.scene==="party"){const h=t.w/t.h,u=h>=1?240:Math.round(240*h),d=h>=1?Math.round(240/h):240;for(const f of e)f.mask=xv(f,u,d,h)}}else if(Cn&&Ce.readyState>=2&&Ce.currentTime!==zh){zh=Ce.currentTime;try{e=Cn.detect(Vx(),i)}catch(h){console.error(h)}}e&&cn.update(e.slice(0,St.people),i,t),Kt.ground.update(cn.tracks,ti?null:Qu.upInCamera(fs.facing),Math.min(.25,(i-uo)/1e3));const n=St.scene==="costume"||St.partyCostumes!=="off";if(n)for(const h of cn.tracks)Oc(pa(h.id),!0);const r=(i-fc)/1e3,s=Math.min(.25,(i-uo)/1e3);uo=i;const a=n,o=St.scene==="party",c=o&&St.partyCostumes==="behind";Kt.pyramid=c||o&&St.partyCostumes==="on"&&Sn.preset.id==="pyramid",Kt.hideWearers=c,Kt.setForeground(c?Sn.foreground:null),Sn.clones=!Kt.pyramid,Kt.stageLights(St.scene==="party",r,Wi.env),Kt.sync(a?cn.tracks:[],pa,r),Wi.update(s,i),St.scene==="party"&&(Sn.subjects=St.people,Sn.beat=Wi.env,Sn.update(cn.tracks,s,r,t.w/t.h,Kt.ground,t),Sn.render(Kt.renderer,t.w,t.h)),Kt.render(Ce,t,hc),lc&&(lc=!1,us.toBlob(h=>h&&sf(h,`costuma-${af()}.jpg`),"image/jpeg",.92)),cn.tracks.filter(h=>!h.lost).length&&(uc=i),Bx(i-uc>2500?"Step back until your head and hips are in view":""),Wx(),po++,i-fo>1e3&&(zc=po*1e3/(i-fo),po=0,fo=i,lf(),Gx())}let ta=0,Hh=!1;function Gx(){if(!(Fc||!gs||cn.tracks.length===0)&&(ta=zc<22?ta+1:0,!(ta<3))){if(ta=0,Kt.opts.pixelRatio>1.01)Kt.opts.pixelRatio=Math.max(1,Kt.opts.pixelRatio-.25);else if(Kt.opts.shadows)Kt.opts.shadows=!1;else return;Hh||(Hh=!0,Ae("Lowering quality to keep up",1500))}}function Wx(){const i=Mr.clientWidth,t=Mr.clientHeight,e=Math.min(devicePixelRatio||1,2);if(Mr.width!==Math.round(i*e)&&(Mr.width=Math.round(i*e),Mr.height=Math.round(t*e)),de.setTransform(e,0,0,e,0,0),de.clearRect(0,0,i,t),!St.debug)return;const n=Kt.cover,r=s=>{let a=(s.x*n.vw-n.ox)*n.s;return n.mirror&&(a=n.cw-a),[a,(s.y*n.vh-n.oy)*n.s]};{const s=Kt.ground,a=Hc(),{back:o,side:c}=s.axes(),l=cn.tracks.filter(f=>!f.lost).sort((f,g)=>g.T.z-f.T.z)[0],h=s.foot(l?new U(l.T.x,l.T.y,l.T.z):new U(0,0,-3)).addScaledVector(o,-1),u=(f,g)=>h.clone().addScaledVector(c,f).addScaledVector(o,g),d=(f,g)=>{if(f.z>-.2||g.z>-.2)return;const[v,m]=r(ns(f,a)),[p,S]=r(ns(g,a));de.beginPath(),de.moveTo(v,m),de.lineTo(p,S),de.stroke()};de.strokeStyle="rgba(125, 252, 255, 0.45)",de.lineWidth=1.5;for(let f=-3;f<=3.001;f+=.5)d(u(f,0),u(f,8));for(let f=0;f<=8.001;f+=.5)d(u(-3,f),u(3,f));de.fillStyle="#7dfcff",de.font="600 12px system-ui",de.fillText(`floor: ${s.source}${s.fromFeet?" + feet":""} · camera ${s.cameraHeight.toFixed(2)} m up`,12,n.ch-200)}for(const s of cn.tracks){de.globalAlpha=s.presence,de.strokeStyle="#7dfcff",de.lineWidth=3;for(const[o,c]of Sf){const l=s.image[o],h=s.image[c];if(Math.min(l.v,h.v)<.4)continue;const[u,d]=r(l),[f,g]=r(h);de.beginPath(),de.moveTo(u,d),de.lineTo(f,g),de.stroke()}de.fillStyle="#ff8a1f";for(const o of s.image){if(o.v<.4)continue;const[c,l]=r(o);de.beginPath(),de.arc(c,l,4,0,Math.PI*2),de.fill()}const a=of(s);de.fillStyle="#fff",de.font="600 14px system-ui",de.fillText(`#${s.id} ${si(pa(s.id)).name} · ${(-s.T.z).toFixed(1)} m`,a.x-40,a.y)}de.globalAlpha=1}function lf(){const i=te("readout");if(!i||te("settings").classList.contains("hidden"))return;const t=Hc();i.textContent=["build 1a80ecb · 2026-10-31 19:05Z",`${zc.toFixed(0)} fps · pose ${Cn?.inferMs.toFixed(1)??"–"} ms (${Cn?.delegate??"–"}, ${St.model})`,`video ${Ce.videoWidth}×${Ce.videoHeight} · f ${t.f.toFixed(0)} px · ${fs.facing}`,`people ${cn.tracks.filter(e=>!e.lost).length} · dressed ${Kt.count}`,`pixels ×${Kt.opts.pixelRatio.toFixed(2)} · shadows ${Kt.opts.shadows?"on":"off"}`,`light mean ${Kt.light.mean.toFixed(3)} × ${Kt.light.gain.toFixed(2)} · key share ${Kt.light.share.toFixed(2)} · every ${an.every} frames`].join(`
`)}async function Xx(){if(ti)return;const i=Cn,t=new Vh(St.model,St.people);t.masks=St.scene==="party",await t.load(e=>Ae(e,2500)),Cn=t,i?.close(),Ae(St.model==="full"?"Accurate pose model":"Fast pose model",1e3)}function qx(){const i=document.createElement("canvas");i.width=720,i.height=1280;const t=i.getContext("2d"),e=()=>{const n=t.createLinearGradient(0,0,0,1280);n.addColorStop(0,"#5a4a63"),n.addColorStop(.62,"#3b3142"),n.addColorStop(.63,"#6b5440"),n.addColorStop(1,"#3a2c22"),t.fillStyle=n,t.fillRect(0,0,720,1280),t.fillStyle="#fff3d6",t.fillRect(40,220,170,330),t.fillStyle="#ffb35a",t.beginPath(),t.arc(600,180,46,0,Math.PI*2),t.fill()};return e(),setInterval(e,500),i.captureStream(30)}async function mo(){const i=te("start-status"),t=te("btn-start");t.disabled=!0;const e=ti?Promise.resolve(!1):Qu.enable();try{if(ti)Ce.srcObject=qx(),await Ce.play().catch(()=>{}),Ce.readyState<2&&await new Promise(r=>Ce.addEventListener("loadeddata",r,{once:!0}));else{if(!navigator.mediaDevices?.getUserMedia)throw new Error(location.protocol!=="https:"?"The camera needs an https:// page.":"This browser has no camera access.");i.textContent="Asking for the camera…",await fs.open(),i.textContent="Loading the pose model…",Cn=new Vh(St.model,St.people),Cn.masks=St.scene==="party",await Cn.load(r=>{i.textContent=r[0].toUpperCase()+r.slice(1)+"…"})}Kt.setVideo(Ce),i.textContent=`Dressing up as ${si(St.costume).name}…`,await new Promise(r=>setTimeout(r,30));const n=St.mode==="one"?St.costume:Qe[0].id;await Kt.prepare(n,!0);for(const r of Qe)Kt.prepare(r.id);te("start").classList.add("hidden"),te("hud").classList.remove("hidden"),cc(St.scene),gs=!0,fc=performance.now(),uc=performance.now(),ds()}catch(n){console.error(n);const r=n;i.textContent=r.name==="NotAllowedError"?"Camera permission was refused. Allow it in the browser settings and try again.":`Could not start: ${r.message}`,t.disabled=!1}}function Yx(){te("btn-qr").innerHTML=Bi.qr,te("btn-flip").innerHTML=Bi.flip,te("btn-gear").innerHTML=Bi.gear,te("btn-snap").innerHTML=Bi.camera,te("btn-rec").innerHTML=Bi.rec,te("btn-start").onclick=()=>void mo(),te("btn-start-qr").onclick=Bh,te("btn-qr").onclick=Bh,te("btn-gear").onclick=()=>{kx(),kc("settings"),lf()},te("btn-flip").onclick=async()=>{ti||Oh(async()=>{try{await fs.flip(),Kt.setVideo(Ce),cn.clear(),_a.clear(),da.clear()}catch(e){Ae(`Camera: ${e.message}`)}})},te("btn-snap").onclick=()=>{lc=!0;const e=te("stage");e.style.filter="brightness(1.8)",setTimeout(()=>e.style.filter="",120)},te("btn-rec").onclick=zx;for(const e of document.querySelectorAll(".modes button"))e.onclick=()=>{e.dataset.scene!==St.scene&&Oh(()=>cc(e.dataset.scene))};const i=te("start-cast");for(const e of Qe.slice(0,6)){const n=new Image;n.src=ef(e.id),n.alt=e.name,n.onerror=()=>n.remove(),i.appendChild(n)}nf(),requestAnimationFrame(cf);const t=window;t.__costuma={stage:Kt,tracker:cn,settings:St,start:mo,choose:rf,party:Sn,beat:Wi,setScene:cc,chooseEffect:Bc,get started(){return gs},get frame(){return hc},LIGHT_TUNE:an},Fc&&ti&&mo()}Yx();
