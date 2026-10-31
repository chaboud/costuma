(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))n(r);new MutationObserver(r=>{for(const s of r)if(s.type==="childList")for(const a of s.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&n(a)}).observe(document,{childList:!0,subtree:!0});function e(r){const s={};return r.integrity&&(s.integrity=r.integrity),r.referrerPolicy&&(s.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?s.credentials="include":r.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function n(r){if(r.ep)return;r.ep=!0;const s=e(r);fetch(r.href,s)}})();const Z0=()=>/iPad|iPhone|iPod/.test(navigator.userAgent)||navigator.platform==="MacIntel"&&navigator.maxTouchPoints>1,J0=()=>Z0()||/Android|Mobile/i.test(navigator.userAgent);let K0=class{constructor(t,e){this.video=t,this.facing=e??(J0()?"environment":"user"),t.muted=!0,t.playsInline=!0,t.autoplay=!0,t.setAttribute("playsinline",""),t.setAttribute("muted","")}stream=null;facing;async open(t=this.facing){const e=!!this.stream;this.stop(),e&&await new Promise(r=>setTimeout(r,100));const n={facingMode:t,width:{ideal:1280},height:{ideal:720},frameRate:{ideal:30}};this.stream=await navigator.mediaDevices.getUserMedia({audio:!1,video:n}),this.facing=t,this.video.srcObject=this.stream,await this.video.play().catch(()=>{}),this.video.readyState<2&&await new Promise(r=>this.video.addEventListener("loadeddata",()=>r(),{once:!0}))}async flip(){await this.open(this.facing==="user"?"environment":"user")}get mirrored(){return this.facing==="user"}stop(){if(this.stream){for(const t of this.stream.getTracks())t.stop();this.video.srcObject=null,this.stream=null}}};const Q0="modulepreload",tp=function(i,t){return new URL(i,t).href},Yh={},td=function(t,e,n){let r=Promise.resolve();if(e&&e.length>0){let a=function(h){return Promise.all(h.map(u=>Promise.resolve(u).then(d=>({status:"fulfilled",value:d}),d=>({status:"rejected",reason:d}))))};const o=document.getElementsByTagName("link"),c=document.querySelector("meta[property=csp-nonce]"),l=c?.nonce||c?.getAttribute("nonce");r=a(e.map(h=>{if(h=tp(h,n),h in Yh)return;Yh[h]=!0;const u=h.endsWith(".css"),d=u?'[rel="stylesheet"]':"";if(!!n)for(let v=o.length-1;v>=0;v--){const m=o[v];if(m.href===h&&(!u||m.rel==="stylesheet"))return}else if(document.querySelector(`link[href="${h}"]${d}`))return;const g=document.createElement("link");if(g.rel=u?"stylesheet":Q0,u||(g.as="script"),g.crossOrigin="",g.href=h,l&&g.setAttribute("nonce",l),document.head.appendChild(g),u)return new Promise((v,m)=>{g.addEventListener("load",v),g.addEventListener("error",()=>m(new Error(`Unable to preload CSS for ${h}`)))})}))}function s(a){const o=new Event("vite:preloadError",{cancelable:!0});if(o.payload=a,window.dispatchEvent(o),!o.defaultPrevented)throw a}return r.then(a=>{for(const o of a||[])o.status==="rejected"&&s(o.reason);return t().catch(s)})},O={nose:0,eyeInL:1,eyeL:2,eyeOutL:3,eyeInR:4,eyeR:5,eyeOutR:6,earL:7,earR:8,mouthL:9,mouthR:10,shL:11,shR:12,elL:13,elR:14,wrL:15,wrR:16,pinkyL:17,pinkyR:18,indexL:19,indexR:20,thumbL:21,thumbR:22,hipL:23,hipR:24,knL:25,knR:26,anL:27,anR:28,heelL:29,heelR:30,toeL:31,toeR:32},jc=33;function ep(i){return{x:i.x,y:-i.y,z:-i.z,v:i.visibility??1}}const np=[[O.shL,O.shR],[O.shL,O.elL],[O.elL,O.wrL],[O.shR,O.elR],[O.elR,O.wrR],[O.shL,O.hipL],[O.shR,O.hipR],[O.hipL,O.hipR],[O.hipL,O.knL],[O.knL,O.anL],[O.hipR,O.knR],[O.knR,O.anR],[O.anL,O.toeL],[O.anR,O.toeR],[O.earL,O.eyeL],[O.eyeL,O.nose],[O.nose,O.eyeR],[O.eyeR,O.earR]];class ed{constructor(t,e){this.model=t,this.numPoses=e}lm=null;lastTs=-1;delegate="GPU";inferMs=0;masks=!1;async load(t){t?.("loading the pose engine");const n=await td(()=>import("./vision_bundle-Bk4VIwNi.js"),[],import.meta.url),r=await n.FilesetResolver.forVisionTasks("./mediapipe"),s=a=>n.PoseLandmarker.createFromOptions(r,{baseOptions:{modelAssetPath:`./models/pose_landmarker_${this.model}.task`,delegate:a},runningMode:"VIDEO",numPoses:this.numPoses,minPoseDetectionConfidence:.5,minPosePresenceConfidence:.5,minTrackingConfidence:.5,outputSegmentationMasks:this.masks});t?.(`loading the ${this.model} pose model`);try{this.lm=await s("GPU"),this.delegate="GPU"}catch(a){console.warn("GPU delegate failed, using CPU",a),this.lm=await s("CPU"),this.delegate="CPU"}}async setOptions(t){t.numPoses&&(this.numPoses=t.numPoses,await this.lm?.setOptions({numPoses:t.numPoses})),t.masks!==void 0&&t.masks!==this.masks&&(this.masks=t.masks,await this.lm?.setOptions({outputSegmentationMasks:t.masks}))}detect(t,e){if(!this.lm)return[];e<=this.lastTs&&(e=this.lastTs+1),this.lastTs=e;const n=performance.now(),r=this.lm.detectForVideo(t,e);this.inferMs=performance.now()-n;const s=[];for(let a=0;a<r.landmarks.length;a++){const o=r.landmarks[a],c=r.worldLandmarks[a];if(!c)continue;const l=r.segmentationMasks?.[a];s.push({image:o.map(h=>({x:h.x,y:h.y,z:h.z,v:h.visibility??1})),world:c.map(ep),mask:l?{data:l.getAsFloat32Array().slice(),w:l.width,h:l.height}:void 0})}return r.close(),s}close(){this.lm?.close(),this.lm=null}}function ip(i,t,e=.85){return{f:e*Math.max(i,t),cx:i/2,cy:t/2,w:i,h:t}}function $h(i,t,e,n=.5){let r=0,s=0,a=0,o=0,c=0,l=0,h=0,u=0,d=0;for(let y=0;y<i.length&&y<t.length;y++){const M=i[y],b=t[y],w=Math.min(M.v,b.v);if(w<n)continue;const T=(b.x*e.w-e.cx)/e.f,A=(e.cy-b.y*e.h)/e.f,R=-T*M.z-M.x,x=-A*M.z-M.y;r+=w,s+=w*T,c+=w*T*T,l+=w*R,u+=w*T*R,a+=w,o+=w*A,c+=w*A*A,h+=w*x,u+=w*A*x,d++}if(d<4)return null;const f=c-s*s/r-o*o/a,g=u-s*l/r-o*h/a;if(Math.abs(f)<1e-9)return null;const v=g/f,m=(l-s*v)/r,p=(h-o*v)/a;return!(v<-.2)||!isFinite(m)||!isFinite(p)?null:{x:m,y:p,z:v}}function Es(i,t){const e=-i.z;return{x:(t.cx+t.f*i.x/e)/t.w,y:(t.cy-t.f*i.y/e)/t.h}}const Na=(i,t)=>({x:(i.x+t.x)/2,y:(i.y+t.y)/2,z:(i.z+t.z)/2,v:Math.min(i.v,t.v)}),Qn=(i,t)=>Math.hypot(i.x-t.x,i.y-t.y,i.z-t.z);function jh(i){const t=Qn(Na(i[O.shL],i[O.shR]),Na(i[O.hipL],i[O.hipR])),e=(Qn(i[O.shL],i[O.elL])+Qn(i[O.shR],i[O.elR]))/2,n=(Qn(i[O.elL],i[O.wrL])+Qn(i[O.elR],i[O.wrR]))/2,r=(Qn(i[O.hipL],i[O.knL])+Qn(i[O.hipR],i[O.knR]))/2,s=(Qn(i[O.knL],i[O.anL])+Qn(i[O.knR],i[O.anR]))/2,a=Qn(Na(i[O.shL],i[O.shR]),Na(i[O.earL],i[O.earR]));return{torso:t,upperArm:e,forearm:n,thigh:r,shin:s,neck:a}}const ti={tauWorld:.045,tauImage:.035,tauZ:.14,tauLen:1.5,tauVis:.25,tauCore:.09,fadeIn:.22,fadeOut:.35,forgetAfter:.6,matchRadius:1.3},Zh=i=>{const t=[O.shL,O.shR,O.hipL,O.hipR];let e=0,n=0,r=0;for(const c of t){const l=i[c];e+=l.x,n+=l.y,r++}e/=r,n/=r;const s=(i[O.shL].x+i[O.shR].x)/2-(i[O.hipL].x+i[O.hipR].x)/2,a=(i[O.shL].y+i[O.shR].y)/2-(i[O.hipL].y+i[O.hipR].y)/2,o=Math.hypot(i[O.shL].x-i[O.shR].x,i[O.shL].y-i[O.shR].y);return{x:e,y:n,s:Math.max(Math.hypot(s,a),o,.04)}},us=(i,t,e)=>i+(t-i)*e,Fr=(i,t)=>1-Math.exp(-i/Math.max(t,1e-4)),rp=new Set([0,1,2,3,4,5,6,7,8,9,10,O.shL,O.shR,O.hipL,O.hipR]);function Jh(i,t,e,n,r=e){for(let s=0;s<jc;s++){const a=i[s],o=t[s],c=rp.has(s)?r:e;a.x=us(a.x,o.x,c),a.y=us(a.y,o.y,c),a.z=us(a.z,o.z,c),a.v=us(a.v,o.v,n)}}const Kh=i=>i.map(t=>({...t})),sp=[O.nose,O.eyeL,O.eyeR,O.earL,O.earR,O.shL,O.shR,O.hipL,O.hipR];function ap(i,t){let e=0,n=0,r=0;for(const s of sp){const a=i[s],o=t[s],c=Math.min(a.v,o.v);c<.5||(e+=(o.x-a.x)*c,n+=(o.y-a.y)*c,r+=c)}if(!(r<1.5)){e/=r,n/=r;for(const s of i)s.x+=e,s.y+=n}}class op{tracks=[];nextId=1;last=-1;update(t,e,n){const r=this.last<0?.03333333333333333:Math.min(.25,Math.max(.001,(e-this.last)/1e3));this.last=e;const s=t.map(h=>({d:h,T:$h(h.world,h.image,n),c:Zh(h.image)})).filter(h=>h.T),a=this.tracks.filter(h=>!h.lost||h.presence>0),o=[];a.forEach((h,u)=>{const d=Zh(h.image);s.forEach((f,g)=>{const v=Math.hypot(d.x-f.c.x,d.y-f.c.y)/d.s;v<ti.matchRadius&&o.push({ti:u,di:g,cost:v})})}),o.sort((h,u)=>h.cost-u.cost);const c=new Set,l=new Set;for(const h of o){if(c.has(h.ti)||l.has(h.di))continue;c.add(h.ti),l.add(h.di);const u=a[h.ti],d=s[h.di],f=u.lost,g=f?1:Fr(r,ti.tauVis);Jh(u.world,d.d.world,f?1:Fr(r,ti.tauWorld),g,f?1:Fr(r,ti.tauCore)),f||ap(u.image,d.d.image),Jh(u.image,d.d.image,f?1:Fr(r,ti.tauImage),g);const v=$h(u.world,u.image,n)??d.T;if(f)u.T={...v};else{const y=us(u.T.z,v.z,Fr(r,ti.tauZ)),M=y/v.z;u.T={x:v.x*M,y:v.y*M,z:y}}const m=jh(u.world),p=Fr(r,ti.tauLen);for(const y of Object.keys(m))u.len[y]=us(u.len[y],m[y],p);u.seen=e,u.lost=!1,u.det=d.d}s.forEach((h,u)=>{if(l.has(u))return;const d=Kh(h.d.world);this.tracks.push({id:this.nextId++,born:e,seen:e,image:Kh(h.d.image),world:d,T:{...h.T},len:jh(d),presence:0,lost:!1,det:h.d})});for(const h of this.tracks)h.seen!==e&&(h.lost=!0,h.det=null),h.presence=h.lost?Math.max(0,h.presence-r/ti.fadeOut):Math.min(1,h.presence+r/ti.fadeIn);return this.tracks=this.tracks.filter(h=>!(h.lost&&h.presence<=0&&e-h.seen>ti.forgetAfter*1e3)),this.tracks}clear(){this.tracks=[],this.last=-1}}/**
 * @license
 * Copyright 2010-2025 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const ih="180",cp=0,Qh=1,lp=2,nd=1,id=2,wi=3,Ki=0,vn=1,Ze=2,ji=0,xs=1,Ro=2,tu=3,eu=4,rd=5,ur=100,hp=101,up=102,fp=103,dp=104,sd=200,pp=201,ad=202,mp=203,Zc=204,Jc=205,gp=206,vp=207,xp=208,_p=209,Mp=210,yp=211,bp=212,Sp=213,wp=214,Kc=0,Qc=1,tl=2,Ts=3,el=4,nl=5,il=6,rl=7,od=0,Ep=1,Tp=2,Zi=0,Ap=1,Rp=2,Cp=3,Lp=4,Pp=5,Dp=6,cd=7,nu="attached",Ip="detached",ld=300,As=301,Rs=302,Co=303,sl=304,Wo=306,Cs=1e3,dr=1001,al=1002,An=1003,Up=1004,Fa=1005,_e=1006,Ko=1007,qi=1008,Jn=1009,hd=1010,ud=1011,ha=1012,rh=1013,yr=1014,li=1015,Tr=1016,sh=1017,ah=1018,ua=1020,fd=35902,dd=35899,pd=1021,md=1022,Xe=1023,fa=1026,da=1027,gd=1028,oh=1029,vd=1030,ch=1031,lh=1033,bo=33776,So=33777,wo=33778,Eo=33779,ol=35840,cl=35841,ll=35842,hl=35843,ul=36196,fl=37492,dl=37496,pl=37808,ml=37809,gl=37810,vl=37811,xl=37812,_l=37813,Ml=37814,yl=37815,bl=37816,Sl=37817,wl=37818,El=37819,Tl=37820,Al=37821,Rl=36492,Cl=36494,Ll=36495,Pl=36283,Dl=36284,Il=36285,Ul=36286,Np=3200,Fp=3201,xd=0,Op=1,ci="",an="srgb",br="srgb-linear",Lo="linear",de="srgb",Or=7680,iu=519,Bp=512,kp=513,zp=514,_d=515,Hp=516,Vp=517,Gp=518,Wp=519,Nl=35044,Oa=35048,ru="300 es",hi=2e3,Po=2001;class Ns{addEventListener(t,e){this._listeners===void 0&&(this._listeners={});const n=this._listeners;n[t]===void 0&&(n[t]=[]),n[t].indexOf(e)===-1&&n[t].push(e)}hasEventListener(t,e){const n=this._listeners;return n===void 0?!1:n[t]!==void 0&&n[t].indexOf(e)!==-1}removeEventListener(t,e){const n=this._listeners;if(n===void 0)return;const r=n[t];if(r!==void 0){const s=r.indexOf(e);s!==-1&&r.splice(s,1)}}dispatchEvent(t){const e=this._listeners;if(e===void 0)return;const n=e[t.type];if(n!==void 0){t.target=this;const r=n.slice(0);for(let s=0,a=r.length;s<a;s++)r[s].call(this,t);t.target=null}}}const Ye=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];let su=1234567;const sa=Math.PI/180,Ls=180/Math.PI;function Yn(){const i=Math.random()*4294967295|0,t=Math.random()*4294967295|0,e=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(Ye[i&255]+Ye[i>>8&255]+Ye[i>>16&255]+Ye[i>>24&255]+"-"+Ye[t&255]+Ye[t>>8&255]+"-"+Ye[t>>16&15|64]+Ye[t>>24&255]+"-"+Ye[e&63|128]+Ye[e>>8&255]+"-"+Ye[e>>16&255]+Ye[e>>24&255]+Ye[n&255]+Ye[n>>8&255]+Ye[n>>16&255]+Ye[n>>24&255]).toLowerCase()}function ne(i,t,e){return Math.max(t,Math.min(e,i))}function hh(i,t){return(i%t+t)%t}function Xp(i,t,e,n,r){return n+(i-t)*(r-n)/(e-t)}function qp(i,t,e){return i!==t?(e-i)/(t-i):0}function aa(i,t,e){return(1-e)*i+e*t}function Yp(i,t,e,n){return aa(i,t,1-Math.exp(-e*n))}function $p(i,t=1){return t-Math.abs(hh(i,t*2)-t)}function jp(i,t,e){return i<=t?0:i>=e?1:(i=(i-t)/(e-t),i*i*(3-2*i))}function Zp(i,t,e){return i<=t?0:i>=e?1:(i=(i-t)/(e-t),i*i*i*(i*(i*6-15)+10))}function Jp(i,t){return i+Math.floor(Math.random()*(t-i+1))}function Kp(i,t){return i+Math.random()*(t-i)}function Qp(i){return i*(.5-Math.random())}function t1(i){i!==void 0&&(su=i);let t=su+=1831565813;return t=Math.imul(t^t>>>15,t|1),t^=t+Math.imul(t^t>>>7,t|61),((t^t>>>14)>>>0)/4294967296}function e1(i){return i*sa}function n1(i){return i*Ls}function i1(i){return(i&i-1)===0&&i!==0}function r1(i){return Math.pow(2,Math.ceil(Math.log(i)/Math.LN2))}function s1(i){return Math.pow(2,Math.floor(Math.log(i)/Math.LN2))}function a1(i,t,e,n,r){const s=Math.cos,a=Math.sin,o=s(e/2),c=a(e/2),l=s((t+n)/2),h=a((t+n)/2),u=s((t-n)/2),d=a((t-n)/2),f=s((n-t)/2),g=a((n-t)/2);switch(r){case"XYX":i.set(o*h,c*u,c*d,o*l);break;case"YZY":i.set(c*d,o*h,c*u,o*l);break;case"ZXZ":i.set(c*u,c*d,o*h,o*l);break;case"XZX":i.set(o*h,c*g,c*f,o*l);break;case"YXY":i.set(c*f,o*h,c*g,o*l);break;case"ZYZ":i.set(c*g,c*f,o*h,o*l);break;default:console.warn("THREE.MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+r)}}function Xn(i,t){switch(t.constructor){case Float32Array:return i;case Uint32Array:return i/4294967295;case Uint16Array:return i/65535;case Uint8Array:return i/255;case Int32Array:return Math.max(i/2147483647,-1);case Int16Array:return Math.max(i/32767,-1);case Int8Array:return Math.max(i/127,-1);default:throw new Error("Invalid component type.")}}function ue(i,t){switch(t.constructor){case Float32Array:return i;case Uint32Array:return Math.round(i*4294967295);case Uint16Array:return Math.round(i*65535);case Uint8Array:return Math.round(i*255);case Int32Array:return Math.round(i*2147483647);case Int16Array:return Math.round(i*32767);case Int8Array:return Math.round(i*127);default:throw new Error("Invalid component type.")}}const _s={DEG2RAD:sa,RAD2DEG:Ls,generateUUID:Yn,clamp:ne,euclideanModulo:hh,mapLinear:Xp,inverseLerp:qp,lerp:aa,damp:Yp,pingpong:$p,smoothstep:jp,smootherstep:Zp,randInt:Jp,randFloat:Kp,randFloatSpread:Qp,seededRandom:t1,degToRad:e1,radToDeg:n1,isPowerOfTwo:i1,ceilPowerOfTwo:r1,floorPowerOfTwo:s1,setQuaternionFromProperEuler:a1,normalize:ue,denormalize:Xn};class ft{constructor(t=0,e=0){ft.prototype.isVector2=!0,this.x=t,this.y=e}get width(){return this.x}set width(t){this.x=t}get height(){return this.y}set height(t){this.y=t}set(t,e){return this.x=t,this.y=e,this}setScalar(t){return this.x=t,this.y=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y)}copy(t){return this.x=t.x,this.y=t.y,this}add(t){return this.x+=t.x,this.y+=t.y,this}addScalar(t){return this.x+=t,this.y+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this}subScalar(t){return this.x-=t,this.y-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this}multiply(t){return this.x*=t.x,this.y*=t.y,this}multiplyScalar(t){return this.x*=t,this.y*=t,this}divide(t){return this.x/=t.x,this.y/=t.y,this}divideScalar(t){return this.multiplyScalar(1/t)}applyMatrix3(t){const e=this.x,n=this.y,r=t.elements;return this.x=r[0]*e+r[3]*n+r[6],this.y=r[1]*e+r[4]*n+r[7],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this}clamp(t,e){return this.x=ne(this.x,t.x,e.x),this.y=ne(this.y,t.y,e.y),this}clampScalar(t,e){return this.x=ne(this.x,t,e),this.y=ne(this.y,t,e),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(ne(n,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(t){return this.x*t.x+this.y*t.y}cross(t){return this.x*t.y-this.y*t.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const n=this.dot(t)/e;return Math.acos(ne(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,n=this.y-t.y;return e*e+n*n}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this}equals(t){return t.x===this.x&&t.y===this.y}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this}rotateAround(t,e){const n=Math.cos(e),r=Math.sin(e),s=this.x-t.x,a=this.y-t.y;return this.x=s*n-a*r+t.x,this.y=s*r+a*n+t.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class We{constructor(t=0,e=0,n=0,r=1){this.isQuaternion=!0,this._x=t,this._y=e,this._z=n,this._w=r}static slerpFlat(t,e,n,r,s,a,o){let c=n[r+0],l=n[r+1],h=n[r+2],u=n[r+3];const d=s[a+0],f=s[a+1],g=s[a+2],v=s[a+3];if(o===0){t[e+0]=c,t[e+1]=l,t[e+2]=h,t[e+3]=u;return}if(o===1){t[e+0]=d,t[e+1]=f,t[e+2]=g,t[e+3]=v;return}if(u!==v||c!==d||l!==f||h!==g){let m=1-o;const p=c*d+l*f+h*g+u*v,y=p>=0?1:-1,M=1-p*p;if(M>Number.EPSILON){const w=Math.sqrt(M),T=Math.atan2(w,p*y);m=Math.sin(m*T)/w,o=Math.sin(o*T)/w}const b=o*y;if(c=c*m+d*b,l=l*m+f*b,h=h*m+g*b,u=u*m+v*b,m===1-o){const w=1/Math.sqrt(c*c+l*l+h*h+u*u);c*=w,l*=w,h*=w,u*=w}}t[e]=c,t[e+1]=l,t[e+2]=h,t[e+3]=u}static multiplyQuaternionsFlat(t,e,n,r,s,a){const o=n[r],c=n[r+1],l=n[r+2],h=n[r+3],u=s[a],d=s[a+1],f=s[a+2],g=s[a+3];return t[e]=o*g+h*u+c*f-l*d,t[e+1]=c*g+h*d+l*u-o*f,t[e+2]=l*g+h*f+o*d-c*u,t[e+3]=h*g-o*u-c*d-l*f,t}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get w(){return this._w}set w(t){this._w=t,this._onChangeCallback()}set(t,e,n,r){return this._x=t,this._y=e,this._z=n,this._w=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(t){return this._x=t.x,this._y=t.y,this._z=t.z,this._w=t.w,this._onChangeCallback(),this}setFromEuler(t,e=!0){const n=t._x,r=t._y,s=t._z,a=t._order,o=Math.cos,c=Math.sin,l=o(n/2),h=o(r/2),u=o(s/2),d=c(n/2),f=c(r/2),g=c(s/2);switch(a){case"XYZ":this._x=d*h*u+l*f*g,this._y=l*f*u-d*h*g,this._z=l*h*g+d*f*u,this._w=l*h*u-d*f*g;break;case"YXZ":this._x=d*h*u+l*f*g,this._y=l*f*u-d*h*g,this._z=l*h*g-d*f*u,this._w=l*h*u+d*f*g;break;case"ZXY":this._x=d*h*u-l*f*g,this._y=l*f*u+d*h*g,this._z=l*h*g+d*f*u,this._w=l*h*u-d*f*g;break;case"ZYX":this._x=d*h*u-l*f*g,this._y=l*f*u+d*h*g,this._z=l*h*g-d*f*u,this._w=l*h*u+d*f*g;break;case"YZX":this._x=d*h*u+l*f*g,this._y=l*f*u+d*h*g,this._z=l*h*g-d*f*u,this._w=l*h*u-d*f*g;break;case"XZY":this._x=d*h*u-l*f*g,this._y=l*f*u-d*h*g,this._z=l*h*g+d*f*u,this._w=l*h*u+d*f*g;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+a)}return e===!0&&this._onChangeCallback(),this}setFromAxisAngle(t,e){const n=e/2,r=Math.sin(n);return this._x=t.x*r,this._y=t.y*r,this._z=t.z*r,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(t){const e=t.elements,n=e[0],r=e[4],s=e[8],a=e[1],o=e[5],c=e[9],l=e[2],h=e[6],u=e[10],d=n+o+u;if(d>0){const f=.5/Math.sqrt(d+1);this._w=.25/f,this._x=(h-c)*f,this._y=(s-l)*f,this._z=(a-r)*f}else if(n>o&&n>u){const f=2*Math.sqrt(1+n-o-u);this._w=(h-c)/f,this._x=.25*f,this._y=(r+a)/f,this._z=(s+l)/f}else if(o>u){const f=2*Math.sqrt(1+o-n-u);this._w=(s-l)/f,this._x=(r+a)/f,this._y=.25*f,this._z=(c+h)/f}else{const f=2*Math.sqrt(1+u-n-o);this._w=(a-r)/f,this._x=(s+l)/f,this._y=(c+h)/f,this._z=.25*f}return this._onChangeCallback(),this}setFromUnitVectors(t,e){let n=t.dot(e)+1;return n<1e-8?(n=0,Math.abs(t.x)>Math.abs(t.z)?(this._x=-t.y,this._y=t.x,this._z=0,this._w=n):(this._x=0,this._y=-t.z,this._z=t.y,this._w=n)):(this._x=t.y*e.z-t.z*e.y,this._y=t.z*e.x-t.x*e.z,this._z=t.x*e.y-t.y*e.x,this._w=n),this.normalize()}angleTo(t){return 2*Math.acos(Math.abs(ne(this.dot(t),-1,1)))}rotateTowards(t,e){const n=this.angleTo(t);if(n===0)return this;const r=Math.min(1,e/n);return this.slerp(t,r),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(t){return this._x*t._x+this._y*t._y+this._z*t._z+this._w*t._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let t=this.length();return t===0?(this._x=0,this._y=0,this._z=0,this._w=1):(t=1/t,this._x=this._x*t,this._y=this._y*t,this._z=this._z*t,this._w=this._w*t),this._onChangeCallback(),this}multiply(t){return this.multiplyQuaternions(this,t)}premultiply(t){return this.multiplyQuaternions(t,this)}multiplyQuaternions(t,e){const n=t._x,r=t._y,s=t._z,a=t._w,o=e._x,c=e._y,l=e._z,h=e._w;return this._x=n*h+a*o+r*l-s*c,this._y=r*h+a*c+s*o-n*l,this._z=s*h+a*l+n*c-r*o,this._w=a*h-n*o-r*c-s*l,this._onChangeCallback(),this}slerp(t,e){if(e===0)return this;if(e===1)return this.copy(t);const n=this._x,r=this._y,s=this._z,a=this._w;let o=a*t._w+n*t._x+r*t._y+s*t._z;if(o<0?(this._w=-t._w,this._x=-t._x,this._y=-t._y,this._z=-t._z,o=-o):this.copy(t),o>=1)return this._w=a,this._x=n,this._y=r,this._z=s,this;const c=1-o*o;if(c<=Number.EPSILON){const f=1-e;return this._w=f*a+e*this._w,this._x=f*n+e*this._x,this._y=f*r+e*this._y,this._z=f*s+e*this._z,this.normalize(),this}const l=Math.sqrt(c),h=Math.atan2(l,o),u=Math.sin((1-e)*h)/l,d=Math.sin(e*h)/l;return this._w=a*u+this._w*d,this._x=n*u+this._x*d,this._y=r*u+this._y*d,this._z=s*u+this._z*d,this._onChangeCallback(),this}slerpQuaternions(t,e,n){return this.copy(t).slerp(e,n)}random(){const t=2*Math.PI*Math.random(),e=2*Math.PI*Math.random(),n=Math.random(),r=Math.sqrt(1-n),s=Math.sqrt(n);return this.set(r*Math.sin(t),r*Math.cos(t),s*Math.sin(e),s*Math.cos(e))}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._w===this._w}fromArray(t,e=0){return this._x=t[e],this._y=t[e+1],this._z=t[e+2],this._w=t[e+3],this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._w,t}fromBufferAttribute(t,e){return this._x=t.getX(e),this._y=t.getY(e),this._z=t.getZ(e),this._w=t.getW(e),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class N{constructor(t=0,e=0,n=0){N.prototype.isVector3=!0,this.x=t,this.y=e,this.z=n}set(t,e,n){return n===void 0&&(n=this.z),this.x=t,this.y=e,this.z=n,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this}multiplyVectors(t,e){return this.x=t.x*e.x,this.y=t.y*e.y,this.z=t.z*e.z,this}applyEuler(t){return this.applyQuaternion(au.setFromEuler(t))}applyAxisAngle(t,e){return this.applyQuaternion(au.setFromAxisAngle(t,e))}applyMatrix3(t){const e=this.x,n=this.y,r=this.z,s=t.elements;return this.x=s[0]*e+s[3]*n+s[6]*r,this.y=s[1]*e+s[4]*n+s[7]*r,this.z=s[2]*e+s[5]*n+s[8]*r,this}applyNormalMatrix(t){return this.applyMatrix3(t).normalize()}applyMatrix4(t){const e=this.x,n=this.y,r=this.z,s=t.elements,a=1/(s[3]*e+s[7]*n+s[11]*r+s[15]);return this.x=(s[0]*e+s[4]*n+s[8]*r+s[12])*a,this.y=(s[1]*e+s[5]*n+s[9]*r+s[13])*a,this.z=(s[2]*e+s[6]*n+s[10]*r+s[14])*a,this}applyQuaternion(t){const e=this.x,n=this.y,r=this.z,s=t.x,a=t.y,o=t.z,c=t.w,l=2*(a*r-o*n),h=2*(o*e-s*r),u=2*(s*n-a*e);return this.x=e+c*l+a*u-o*h,this.y=n+c*h+o*l-s*u,this.z=r+c*u+s*h-a*l,this}project(t){return this.applyMatrix4(t.matrixWorldInverse).applyMatrix4(t.projectionMatrix)}unproject(t){return this.applyMatrix4(t.projectionMatrixInverse).applyMatrix4(t.matrixWorld)}transformDirection(t){const e=this.x,n=this.y,r=this.z,s=t.elements;return this.x=s[0]*e+s[4]*n+s[8]*r,this.y=s[1]*e+s[5]*n+s[9]*r,this.z=s[2]*e+s[6]*n+s[10]*r,this.normalize()}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this}divideScalar(t){return this.multiplyScalar(1/t)}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this}clamp(t,e){return this.x=ne(this.x,t.x,e.x),this.y=ne(this.y,t.y,e.y),this.z=ne(this.z,t.z,e.z),this}clampScalar(t,e){return this.x=ne(this.x,t,e),this.y=ne(this.y,t,e),this.z=ne(this.z,t,e),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(ne(n,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this}cross(t){return this.crossVectors(this,t)}crossVectors(t,e){const n=t.x,r=t.y,s=t.z,a=e.x,o=e.y,c=e.z;return this.x=r*c-s*o,this.y=s*a-n*c,this.z=n*o-r*a,this}projectOnVector(t){const e=t.lengthSq();if(e===0)return this.set(0,0,0);const n=t.dot(this)/e;return this.copy(t).multiplyScalar(n)}projectOnPlane(t){return Qo.copy(this).projectOnVector(t),this.sub(Qo)}reflect(t){return this.sub(Qo.copy(t).multiplyScalar(2*this.dot(t)))}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const n=this.dot(t)/e;return Math.acos(ne(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,n=this.y-t.y,r=this.z-t.z;return e*e+n*n+r*r}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)+Math.abs(this.z-t.z)}setFromSpherical(t){return this.setFromSphericalCoords(t.radius,t.phi,t.theta)}setFromSphericalCoords(t,e,n){const r=Math.sin(e)*t;return this.x=r*Math.sin(n),this.y=Math.cos(e)*t,this.z=r*Math.cos(n),this}setFromCylindrical(t){return this.setFromCylindricalCoords(t.radius,t.theta,t.y)}setFromCylindricalCoords(t,e,n){return this.x=t*Math.sin(e),this.y=n,this.z=t*Math.cos(e),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this}setFromMatrixScale(t){const e=this.setFromMatrixColumn(t,0).length(),n=this.setFromMatrixColumn(t,1).length(),r=this.setFromMatrixColumn(t,2).length();return this.x=e,this.y=n,this.z=r,this}setFromMatrixColumn(t,e){return this.fromArray(t.elements,e*4)}setFromMatrix3Column(t,e){return this.fromArray(t.elements,e*3)}setFromEuler(t){return this.x=t._x,this.y=t._y,this.z=t._z,this}setFromColor(t){return this.x=t.r,this.y=t.g,this.z=t.b,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const t=Math.random()*Math.PI*2,e=Math.random()*2-1,n=Math.sqrt(1-e*e);return this.x=n*Math.cos(t),this.y=e,this.z=n*Math.sin(t),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const Qo=new N,au=new We;class te{constructor(t,e,n,r,s,a,o,c,l){te.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],t!==void 0&&this.set(t,e,n,r,s,a,o,c,l)}set(t,e,n,r,s,a,o,c,l){const h=this.elements;return h[0]=t,h[1]=r,h[2]=o,h[3]=e,h[4]=s,h[5]=c,h[6]=n,h[7]=a,h[8]=l,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(t){const e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],this}extractBasis(t,e,n){return t.setFromMatrix3Column(this,0),e.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(t){const e=t.elements;return this.set(e[0],e[4],e[8],e[1],e[5],e[9],e[2],e[6],e[10]),this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const n=t.elements,r=e.elements,s=this.elements,a=n[0],o=n[3],c=n[6],l=n[1],h=n[4],u=n[7],d=n[2],f=n[5],g=n[8],v=r[0],m=r[3],p=r[6],y=r[1],M=r[4],b=r[7],w=r[2],T=r[5],A=r[8];return s[0]=a*v+o*y+c*w,s[3]=a*m+o*M+c*T,s[6]=a*p+o*b+c*A,s[1]=l*v+h*y+u*w,s[4]=l*m+h*M+u*T,s[7]=l*p+h*b+u*A,s[2]=d*v+f*y+g*w,s[5]=d*m+f*M+g*T,s[8]=d*p+f*b+g*A,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[3]*=t,e[6]*=t,e[1]*=t,e[4]*=t,e[7]*=t,e[2]*=t,e[5]*=t,e[8]*=t,this}determinant(){const t=this.elements,e=t[0],n=t[1],r=t[2],s=t[3],a=t[4],o=t[5],c=t[6],l=t[7],h=t[8];return e*a*h-e*o*l-n*s*h+n*o*c+r*s*l-r*a*c}invert(){const t=this.elements,e=t[0],n=t[1],r=t[2],s=t[3],a=t[4],o=t[5],c=t[6],l=t[7],h=t[8],u=h*a-o*l,d=o*c-h*s,f=l*s-a*c,g=e*u+n*d+r*f;if(g===0)return this.set(0,0,0,0,0,0,0,0,0);const v=1/g;return t[0]=u*v,t[1]=(r*l-h*n)*v,t[2]=(o*n-r*a)*v,t[3]=d*v,t[4]=(h*e-r*c)*v,t[5]=(r*s-o*e)*v,t[6]=f*v,t[7]=(n*c-l*e)*v,t[8]=(a*e-n*s)*v,this}transpose(){let t;const e=this.elements;return t=e[1],e[1]=e[3],e[3]=t,t=e[2],e[2]=e[6],e[6]=t,t=e[5],e[5]=e[7],e[7]=t,this}getNormalMatrix(t){return this.setFromMatrix4(t).invert().transpose()}transposeIntoArray(t){const e=this.elements;return t[0]=e[0],t[1]=e[3],t[2]=e[6],t[3]=e[1],t[4]=e[4],t[5]=e[7],t[6]=e[2],t[7]=e[5],t[8]=e[8],this}setUvTransform(t,e,n,r,s,a,o){const c=Math.cos(s),l=Math.sin(s);return this.set(n*c,n*l,-n*(c*a+l*o)+a+t,-r*l,r*c,-r*(-l*a+c*o)+o+e,0,0,1),this}scale(t,e){return this.premultiply(tc.makeScale(t,e)),this}rotate(t){return this.premultiply(tc.makeRotation(-t)),this}translate(t,e){return this.premultiply(tc.makeTranslation(t,e)),this}makeTranslation(t,e){return t.isVector2?this.set(1,0,t.x,0,1,t.y,0,0,1):this.set(1,0,t,0,1,e,0,0,1),this}makeRotation(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,n,e,0,0,0,1),this}makeScale(t,e){return this.set(t,0,0,0,e,0,0,0,1),this}equals(t){const e=this.elements,n=t.elements;for(let r=0;r<9;r++)if(e[r]!==n[r])return!1;return!0}fromArray(t,e=0){for(let n=0;n<9;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){const n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t}clone(){return new this.constructor().fromArray(this.elements)}}const tc=new te;function Md(i){for(let t=i.length-1;t>=0;--t)if(i[t]>=65535)return!0;return!1}function Do(i){return document.createElementNS("http://www.w3.org/1999/xhtml",i)}function o1(){const i=Do("canvas");return i.style.display="block",i}const ou={};function pa(i){i in ou||(ou[i]=!0,console.warn(i))}function c1(i,t,e){return new Promise(function(n,r){function s(){switch(i.clientWaitSync(t,i.SYNC_FLUSH_COMMANDS_BIT,0)){case i.WAIT_FAILED:r();break;case i.TIMEOUT_EXPIRED:setTimeout(s,e);break;default:n()}}setTimeout(s,e)})}const cu=new te().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),lu=new te().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function l1(){const i={enabled:!0,workingColorSpace:br,spaces:{},convert:function(r,s,a){return this.enabled===!1||s===a||!s||!a||(this.spaces[s].transfer===de&&(r.r=Li(r.r),r.g=Li(r.g),r.b=Li(r.b)),this.spaces[s].primaries!==this.spaces[a].primaries&&(r.applyMatrix3(this.spaces[s].toXYZ),r.applyMatrix3(this.spaces[a].fromXYZ)),this.spaces[a].transfer===de&&(r.r=Ms(r.r),r.g=Ms(r.g),r.b=Ms(r.b))),r},workingToColorSpace:function(r,s){return this.convert(r,this.workingColorSpace,s)},colorSpaceToWorking:function(r,s){return this.convert(r,s,this.workingColorSpace)},getPrimaries:function(r){return this.spaces[r].primaries},getTransfer:function(r){return r===ci?Lo:this.spaces[r].transfer},getToneMappingMode:function(r){return this.spaces[r].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(r,s=this.workingColorSpace){return r.fromArray(this.spaces[s].luminanceCoefficients)},define:function(r){Object.assign(this.spaces,r)},_getMatrix:function(r,s,a){return r.copy(this.spaces[s].toXYZ).multiply(this.spaces[a].fromXYZ)},_getDrawingBufferColorSpace:function(r){return this.spaces[r].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(r=this.workingColorSpace){return this.spaces[r].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(r,s){return pa("THREE.ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),i.workingToColorSpace(r,s)},toWorkingColorSpace:function(r,s){return pa("THREE.ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),i.colorSpaceToWorking(r,s)}},t=[.64,.33,.3,.6,.15,.06],e=[.2126,.7152,.0722],n=[.3127,.329];return i.define({[br]:{primaries:t,whitePoint:n,transfer:Lo,toXYZ:cu,fromXYZ:lu,luminanceCoefficients:e,workingColorSpaceConfig:{unpackColorSpace:an},outputColorSpaceConfig:{drawingBufferColorSpace:an}},[an]:{primaries:t,whitePoint:n,transfer:de,toXYZ:cu,fromXYZ:lu,luminanceCoefficients:e,outputColorSpaceConfig:{drawingBufferColorSpace:an}}}),i}const ce=l1();function Li(i){return i<.04045?i*.0773993808:Math.pow(i*.9478672986+.0521327014,2.4)}function Ms(i){return i<.0031308?i*12.92:1.055*Math.pow(i,.41666)-.055}let Br;class h1{static getDataURL(t,e="image/png"){if(/^data:/i.test(t.src)||typeof HTMLCanvasElement>"u")return t.src;let n;if(t instanceof HTMLCanvasElement)n=t;else{Br===void 0&&(Br=Do("canvas")),Br.width=t.width,Br.height=t.height;const r=Br.getContext("2d");t instanceof ImageData?r.putImageData(t,0,0):r.drawImage(t,0,0,t.width,t.height),n=Br}return n.toDataURL(e)}static sRGBToLinear(t){if(typeof HTMLImageElement<"u"&&t instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&t instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&t instanceof ImageBitmap){const e=Do("canvas");e.width=t.width,e.height=t.height;const n=e.getContext("2d");n.drawImage(t,0,0,t.width,t.height);const r=n.getImageData(0,0,t.width,t.height),s=r.data;for(let a=0;a<s.length;a++)s[a]=Li(s[a]/255)*255;return n.putImageData(r,0,0),e}else if(t.data){const e=t.data.slice(0);for(let n=0;n<e.length;n++)e instanceof Uint8Array||e instanceof Uint8ClampedArray?e[n]=Math.floor(Li(e[n]/255)*255):e[n]=Li(e[n]);return{data:e,width:t.width,height:t.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),t}}let u1=0;class uh{constructor(t=null){this.isSource=!0,Object.defineProperty(this,"id",{value:u1++}),this.uuid=Yn(),this.data=t,this.dataReady=!0,this.version=0}getSize(t){const e=this.data;return typeof HTMLVideoElement<"u"&&e instanceof HTMLVideoElement?t.set(e.videoWidth,e.videoHeight,0):e instanceof VideoFrame?t.set(e.displayHeight,e.displayWidth,0):e!==null?t.set(e.width,e.height,e.depth||0):t.set(0,0,0),t}set needsUpdate(t){t===!0&&this.version++}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.images[this.uuid]!==void 0)return t.images[this.uuid];const n={uuid:this.uuid,url:""},r=this.data;if(r!==null){let s;if(Array.isArray(r)){s=[];for(let a=0,o=r.length;a<o;a++)r[a].isDataTexture?s.push(ec(r[a].image)):s.push(ec(r[a]))}else s=ec(r);n.url=s}return e||(t.images[this.uuid]=n),n}}function ec(i){return typeof HTMLImageElement<"u"&&i instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&i instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&i instanceof ImageBitmap?h1.getDataURL(i):i.data?{data:Array.from(i.data),width:i.width,height:i.height,type:i.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}let f1=0;const nc=new N;class qe extends Ns{constructor(t=qe.DEFAULT_IMAGE,e=qe.DEFAULT_MAPPING,n=dr,r=dr,s=_e,a=qi,o=Xe,c=Jn,l=qe.DEFAULT_ANISOTROPY,h=ci){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:f1++}),this.uuid=Yn(),this.name="",this.source=new uh(t),this.mipmaps=[],this.mapping=e,this.channel=0,this.wrapS=n,this.wrapT=r,this.magFilter=s,this.minFilter=a,this.anisotropy=l,this.format=o,this.internalFormat=null,this.type=c,this.offset=new ft(0,0),this.repeat=new ft(1,1),this.center=new ft(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new te,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=h,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(t&&t.depth&&t.depth>1),this.pmremVersion=0}get width(){return this.source.getSize(nc).x}get height(){return this.source.getSize(nc).y}get depth(){return this.source.getSize(nc).z}get image(){return this.source.data}set image(t=null){this.source.data=t}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(t){return this.name=t.name,this.source=t.source,this.mipmaps=t.mipmaps.slice(0),this.mapping=t.mapping,this.channel=t.channel,this.wrapS=t.wrapS,this.wrapT=t.wrapT,this.magFilter=t.magFilter,this.minFilter=t.minFilter,this.anisotropy=t.anisotropy,this.format=t.format,this.internalFormat=t.internalFormat,this.type=t.type,this.offset.copy(t.offset),this.repeat.copy(t.repeat),this.center.copy(t.center),this.rotation=t.rotation,this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrix.copy(t.matrix),this.generateMipmaps=t.generateMipmaps,this.premultiplyAlpha=t.premultiplyAlpha,this.flipY=t.flipY,this.unpackAlignment=t.unpackAlignment,this.colorSpace=t.colorSpace,this.renderTarget=t.renderTarget,this.isRenderTargetTexture=t.isRenderTargetTexture,this.isArrayTexture=t.isArrayTexture,this.userData=JSON.parse(JSON.stringify(t.userData)),this.needsUpdate=!0,this}setValues(t){for(const e in t){const n=t[e];if(n===void 0){console.warn(`THREE.Texture.setValues(): parameter '${e}' has value of undefined.`);continue}const r=this[e];if(r===void 0){console.warn(`THREE.Texture.setValues(): property '${e}' does not exist.`);continue}r&&n&&r.isVector2&&n.isVector2||r&&n&&r.isVector3&&n.isVector3||r&&n&&r.isMatrix3&&n.isMatrix3?r.copy(n):this[e]=n}}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.textures[this.uuid]!==void 0)return t.textures[this.uuid];const n={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(t).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),e||(t.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(t){if(this.mapping!==ld)return t;if(t.applyMatrix3(this.matrix),t.x<0||t.x>1)switch(this.wrapS){case Cs:t.x=t.x-Math.floor(t.x);break;case dr:t.x=t.x<0?0:1;break;case al:Math.abs(Math.floor(t.x)%2)===1?t.x=Math.ceil(t.x)-t.x:t.x=t.x-Math.floor(t.x);break}if(t.y<0||t.y>1)switch(this.wrapT){case Cs:t.y=t.y-Math.floor(t.y);break;case dr:t.y=t.y<0?0:1;break;case al:Math.abs(Math.floor(t.y)%2)===1?t.y=Math.ceil(t.y)-t.y:t.y=t.y-Math.floor(t.y);break}return this.flipY&&(t.y=1-t.y),t}set needsUpdate(t){t===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(t){t===!0&&this.pmremVersion++}}qe.DEFAULT_IMAGE=null;qe.DEFAULT_MAPPING=ld;qe.DEFAULT_ANISOTROPY=1;class le{constructor(t=0,e=0,n=0,r=1){le.prototype.isVector4=!0,this.x=t,this.y=e,this.z=n,this.w=r}get width(){return this.z}set width(t){this.z=t}get height(){return this.w}set height(t){this.w=t}set(t,e,n,r){return this.x=t,this.y=e,this.z=n,this.w=r,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this.w=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setW(t){return this.w=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;case 3:this.w=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this.w=t.w!==void 0?t.w:1,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this.w+=t.w,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this.w+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this.w=t.w+e.w,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this.w+=t.w*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this.w-=t.w,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this.w-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this.w=t.w-e.w,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this.w*=t.w,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this.w*=t,this}applyMatrix4(t){const e=this.x,n=this.y,r=this.z,s=this.w,a=t.elements;return this.x=a[0]*e+a[4]*n+a[8]*r+a[12]*s,this.y=a[1]*e+a[5]*n+a[9]*r+a[13]*s,this.z=a[2]*e+a[6]*n+a[10]*r+a[14]*s,this.w=a[3]*e+a[7]*n+a[11]*r+a[15]*s,this}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this.w/=t.w,this}divideScalar(t){return this.multiplyScalar(1/t)}setAxisAngleFromQuaternion(t){this.w=2*Math.acos(t.w);const e=Math.sqrt(1-t.w*t.w);return e<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=t.x/e,this.y=t.y/e,this.z=t.z/e),this}setAxisAngleFromRotationMatrix(t){let e,n,r,s;const c=t.elements,l=c[0],h=c[4],u=c[8],d=c[1],f=c[5],g=c[9],v=c[2],m=c[6],p=c[10];if(Math.abs(h-d)<.01&&Math.abs(u-v)<.01&&Math.abs(g-m)<.01){if(Math.abs(h+d)<.1&&Math.abs(u+v)<.1&&Math.abs(g+m)<.1&&Math.abs(l+f+p-3)<.1)return this.set(1,0,0,0),this;e=Math.PI;const M=(l+1)/2,b=(f+1)/2,w=(p+1)/2,T=(h+d)/4,A=(u+v)/4,R=(g+m)/4;return M>b&&M>w?M<.01?(n=0,r=.707106781,s=.707106781):(n=Math.sqrt(M),r=T/n,s=A/n):b>w?b<.01?(n=.707106781,r=0,s=.707106781):(r=Math.sqrt(b),n=T/r,s=R/r):w<.01?(n=.707106781,r=.707106781,s=0):(s=Math.sqrt(w),n=A/s,r=R/s),this.set(n,r,s,e),this}let y=Math.sqrt((m-g)*(m-g)+(u-v)*(u-v)+(d-h)*(d-h));return Math.abs(y)<.001&&(y=1),this.x=(m-g)/y,this.y=(u-v)/y,this.z=(d-h)/y,this.w=Math.acos((l+f+p-1)/2),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this.w=e[15],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this.w=Math.min(this.w,t.w),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this.w=Math.max(this.w,t.w),this}clamp(t,e){return this.x=ne(this.x,t.x,e.x),this.y=ne(this.y,t.y,e.y),this.z=ne(this.z,t.z,e.z),this.w=ne(this.w,t.w,e.w),this}clampScalar(t,e){return this.x=ne(this.x,t,e),this.y=ne(this.y,t,e),this.z=ne(this.z,t,e),this.w=ne(this.w,t,e),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(ne(n,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z+this.w*t.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this.w+=(t.w-this.w)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this.w=t.w+(e.w-t.w)*n,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z&&t.w===this.w}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this.w=t[e+3],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t[e+3]=this.w,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this.w=t.getW(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class d1 extends Ns{constructor(t=1,e=1,n={}){super(),n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:_e,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1},n),this.isRenderTarget=!0,this.width=t,this.height=e,this.depth=n.depth,this.scissor=new le(0,0,t,e),this.scissorTest=!1,this.viewport=new le(0,0,t,e);const r={width:t,height:e,depth:n.depth},s=new qe(r);this.textures=[];const a=n.count;for(let o=0;o<a;o++)this.textures[o]=s.clone(),this.textures[o].isRenderTargetTexture=!0,this.textures[o].renderTarget=this;this._setTextureOptions(n),this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this._depthTexture=null,this.depthTexture=n.depthTexture,this.samples=n.samples,this.multiview=n.multiview}_setTextureOptions(t={}){const e={minFilter:_e,generateMipmaps:!1,flipY:!1,internalFormat:null};t.mapping!==void 0&&(e.mapping=t.mapping),t.wrapS!==void 0&&(e.wrapS=t.wrapS),t.wrapT!==void 0&&(e.wrapT=t.wrapT),t.wrapR!==void 0&&(e.wrapR=t.wrapR),t.magFilter!==void 0&&(e.magFilter=t.magFilter),t.minFilter!==void 0&&(e.minFilter=t.minFilter),t.format!==void 0&&(e.format=t.format),t.type!==void 0&&(e.type=t.type),t.anisotropy!==void 0&&(e.anisotropy=t.anisotropy),t.colorSpace!==void 0&&(e.colorSpace=t.colorSpace),t.flipY!==void 0&&(e.flipY=t.flipY),t.generateMipmaps!==void 0&&(e.generateMipmaps=t.generateMipmaps),t.internalFormat!==void 0&&(e.internalFormat=t.internalFormat);for(let n=0;n<this.textures.length;n++)this.textures[n].setValues(e)}get texture(){return this.textures[0]}set texture(t){this.textures[0]=t}set depthTexture(t){this._depthTexture!==null&&(this._depthTexture.renderTarget=null),t!==null&&(t.renderTarget=this),this._depthTexture=t}get depthTexture(){return this._depthTexture}setSize(t,e,n=1){if(this.width!==t||this.height!==e||this.depth!==n){this.width=t,this.height=e,this.depth=n;for(let r=0,s=this.textures.length;r<s;r++)this.textures[r].image.width=t,this.textures[r].image.height=e,this.textures[r].image.depth=n,this.textures[r].isArrayTexture=this.textures[r].image.depth>1;this.dispose()}this.viewport.set(0,0,t,e),this.scissor.set(0,0,t,e)}clone(){return new this.constructor().copy(this)}copy(t){this.width=t.width,this.height=t.height,this.depth=t.depth,this.scissor.copy(t.scissor),this.scissorTest=t.scissorTest,this.viewport.copy(t.viewport),this.textures.length=0;for(let e=0,n=t.textures.length;e<n;e++){this.textures[e]=t.textures[e].clone(),this.textures[e].isRenderTargetTexture=!0,this.textures[e].renderTarget=this;const r=Object.assign({},t.textures[e].image);this.textures[e].source=new uh(r)}return this.depthBuffer=t.depthBuffer,this.stencilBuffer=t.stencilBuffer,this.resolveDepthBuffer=t.resolveDepthBuffer,this.resolveStencilBuffer=t.resolveStencilBuffer,t.depthTexture!==null&&(this.depthTexture=t.depthTexture.clone()),this.samples=t.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class on extends d1{constructor(t=1,e=1,n={}){super(t,e,n),this.isWebGLRenderTarget=!0}}class fh extends qe{constructor(t=null,e=1,n=1,r=1){super(null),this.isDataArrayTexture=!0,this.image={data:t,width:e,height:n,depth:r},this.magFilter=An,this.minFilter=An,this.wrapR=dr,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(t){this.layerUpdates.add(t)}clearLayerUpdates(){this.layerUpdates.clear()}}class p1 extends on{constructor(t=1,e=1,n=1,r={}){super(t,e,r),this.isWebGLArrayRenderTarget=!0,this.depth=n,this.texture=new fh(null,t,e,n),this._setTextureOptions(r),this.texture.isRenderTargetTexture=!0}}class m1 extends qe{constructor(t=null,e=1,n=1,r=1){super(null),this.isData3DTexture=!0,this.image={data:t,width:e,height:n,depth:r},this.magFilter=An,this.minFilter=An,this.wrapR=dr,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class Fs{constructor(t=new N(1/0,1/0,1/0),e=new N(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=t,this.max=e}set(t,e){return this.min.copy(t),this.max.copy(e),this}setFromArray(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e+=3)this.expandByPoint(kn.fromArray(t,e));return this}setFromBufferAttribute(t){this.makeEmpty();for(let e=0,n=t.count;e<n;e++)this.expandByPoint(kn.fromBufferAttribute(t,e));return this}setFromPoints(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e++)this.expandByPoint(t[e]);return this}setFromCenterAndSize(t,e){const n=kn.copy(e).multiplyScalar(.5);return this.min.copy(t).sub(n),this.max.copy(t).add(n),this}setFromObject(t,e=!1){return this.makeEmpty(),this.expandByObject(t,e)}clone(){return new this.constructor().copy(this)}copy(t){return this.min.copy(t.min),this.max.copy(t.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(t){return this.isEmpty()?t.set(0,0,0):t.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(t){return this.isEmpty()?t.set(0,0,0):t.subVectors(this.max,this.min)}expandByPoint(t){return this.min.min(t),this.max.max(t),this}expandByVector(t){return this.min.sub(t),this.max.add(t),this}expandByScalar(t){return this.min.addScalar(-t),this.max.addScalar(t),this}expandByObject(t,e=!1){t.updateWorldMatrix(!1,!1);const n=t.geometry;if(n!==void 0){const s=n.getAttribute("position");if(e===!0&&s!==void 0&&t.isInstancedMesh!==!0)for(let a=0,o=s.count;a<o;a++)t.isMesh===!0?t.getVertexPosition(a,kn):kn.fromBufferAttribute(s,a),kn.applyMatrix4(t.matrixWorld),this.expandByPoint(kn);else t.boundingBox!==void 0?(t.boundingBox===null&&t.computeBoundingBox(),Ba.copy(t.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),Ba.copy(n.boundingBox)),Ba.applyMatrix4(t.matrixWorld),this.union(Ba)}const r=t.children;for(let s=0,a=r.length;s<a;s++)this.expandByObject(r[s],e);return this}containsPoint(t){return t.x>=this.min.x&&t.x<=this.max.x&&t.y>=this.min.y&&t.y<=this.max.y&&t.z>=this.min.z&&t.z<=this.max.z}containsBox(t){return this.min.x<=t.min.x&&t.max.x<=this.max.x&&this.min.y<=t.min.y&&t.max.y<=this.max.y&&this.min.z<=t.min.z&&t.max.z<=this.max.z}getParameter(t,e){return e.set((t.x-this.min.x)/(this.max.x-this.min.x),(t.y-this.min.y)/(this.max.y-this.min.y),(t.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(t){return t.max.x>=this.min.x&&t.min.x<=this.max.x&&t.max.y>=this.min.y&&t.min.y<=this.max.y&&t.max.z>=this.min.z&&t.min.z<=this.max.z}intersectsSphere(t){return this.clampPoint(t.center,kn),kn.distanceToSquared(t.center)<=t.radius*t.radius}intersectsPlane(t){let e,n;return t.normal.x>0?(e=t.normal.x*this.min.x,n=t.normal.x*this.max.x):(e=t.normal.x*this.max.x,n=t.normal.x*this.min.x),t.normal.y>0?(e+=t.normal.y*this.min.y,n+=t.normal.y*this.max.y):(e+=t.normal.y*this.max.y,n+=t.normal.y*this.min.y),t.normal.z>0?(e+=t.normal.z*this.min.z,n+=t.normal.z*this.max.z):(e+=t.normal.z*this.max.z,n+=t.normal.z*this.min.z),e<=-t.constant&&n>=-t.constant}intersectsTriangle(t){if(this.isEmpty())return!1;this.getCenter(Gs),ka.subVectors(this.max,Gs),kr.subVectors(t.a,Gs),zr.subVectors(t.b,Gs),Hr.subVectors(t.c,Gs),Ui.subVectors(zr,kr),Ni.subVectors(Hr,zr),nr.subVectors(kr,Hr);let e=[0,-Ui.z,Ui.y,0,-Ni.z,Ni.y,0,-nr.z,nr.y,Ui.z,0,-Ui.x,Ni.z,0,-Ni.x,nr.z,0,-nr.x,-Ui.y,Ui.x,0,-Ni.y,Ni.x,0,-nr.y,nr.x,0];return!ic(e,kr,zr,Hr,ka)||(e=[1,0,0,0,1,0,0,0,1],!ic(e,kr,zr,Hr,ka))?!1:(za.crossVectors(Ui,Ni),e=[za.x,za.y,za.z],ic(e,kr,zr,Hr,ka))}clampPoint(t,e){return e.copy(t).clamp(this.min,this.max)}distanceToPoint(t){return this.clampPoint(t,kn).distanceTo(t)}getBoundingSphere(t){return this.isEmpty()?t.makeEmpty():(this.getCenter(t.center),t.radius=this.getSize(kn).length()*.5),t}intersect(t){return this.min.max(t.min),this.max.min(t.max),this.isEmpty()&&this.makeEmpty(),this}union(t){return this.min.min(t.min),this.max.max(t.max),this}applyMatrix4(t){return this.isEmpty()?this:(xi[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(t),xi[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(t),xi[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(t),xi[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(t),xi[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(t),xi[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(t),xi[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(t),xi[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(t),this.setFromPoints(xi),this)}translate(t){return this.min.add(t),this.max.add(t),this}equals(t){return t.min.equals(this.min)&&t.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(t){return this.min.fromArray(t.min),this.max.fromArray(t.max),this}}const xi=[new N,new N,new N,new N,new N,new N,new N,new N],kn=new N,Ba=new Fs,kr=new N,zr=new N,Hr=new N,Ui=new N,Ni=new N,nr=new N,Gs=new N,ka=new N,za=new N,ir=new N;function ic(i,t,e,n,r){for(let s=0,a=i.length-3;s<=a;s+=3){ir.fromArray(i,s);const o=r.x*Math.abs(ir.x)+r.y*Math.abs(ir.y)+r.z*Math.abs(ir.z),c=t.dot(ir),l=e.dot(ir),h=n.dot(ir);if(Math.max(-Math.max(c,l,h),Math.min(c,l,h))>o)return!1}return!0}const g1=new Fs,Ws=new N,rc=new N;class Ar{constructor(t=new N,e=-1){this.isSphere=!0,this.center=t,this.radius=e}set(t,e){return this.center.copy(t),this.radius=e,this}setFromPoints(t,e){const n=this.center;e!==void 0?n.copy(e):g1.setFromPoints(t).getCenter(n);let r=0;for(let s=0,a=t.length;s<a;s++)r=Math.max(r,n.distanceToSquared(t[s]));return this.radius=Math.sqrt(r),this}copy(t){return this.center.copy(t.center),this.radius=t.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(t){return t.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(t){return t.distanceTo(this.center)-this.radius}intersectsSphere(t){const e=this.radius+t.radius;return t.center.distanceToSquared(this.center)<=e*e}intersectsBox(t){return t.intersectsSphere(this)}intersectsPlane(t){return Math.abs(t.distanceToPoint(this.center))<=this.radius}clampPoint(t,e){const n=this.center.distanceToSquared(t);return e.copy(t),n>this.radius*this.radius&&(e.sub(this.center).normalize(),e.multiplyScalar(this.radius).add(this.center)),e}getBoundingBox(t){return this.isEmpty()?(t.makeEmpty(),t):(t.set(this.center,this.center),t.expandByScalar(this.radius),t)}applyMatrix4(t){return this.center.applyMatrix4(t),this.radius=this.radius*t.getMaxScaleOnAxis(),this}translate(t){return this.center.add(t),this}expandByPoint(t){if(this.isEmpty())return this.center.copy(t),this.radius=0,this;Ws.subVectors(t,this.center);const e=Ws.lengthSq();if(e>this.radius*this.radius){const n=Math.sqrt(e),r=(n-this.radius)*.5;this.center.addScaledVector(Ws,r/n),this.radius+=r}return this}union(t){return t.isEmpty()?this:this.isEmpty()?(this.copy(t),this):(this.center.equals(t.center)===!0?this.radius=Math.max(this.radius,t.radius):(rc.subVectors(t.center,this.center).setLength(t.radius),this.expandByPoint(Ws.copy(t.center).add(rc)),this.expandByPoint(Ws.copy(t.center).sub(rc))),this)}equals(t){return t.center.equals(this.center)&&t.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(t){return this.radius=t.radius,this.center.fromArray(t.center),this}}const _i=new N,sc=new N,Ha=new N,Fi=new N,ac=new N,Va=new N,oc=new N;class dh{constructor(t=new N,e=new N(0,0,-1)){this.origin=t,this.direction=e}set(t,e){return this.origin.copy(t),this.direction.copy(e),this}copy(t){return this.origin.copy(t.origin),this.direction.copy(t.direction),this}at(t,e){return e.copy(this.origin).addScaledVector(this.direction,t)}lookAt(t){return this.direction.copy(t).sub(this.origin).normalize(),this}recast(t){return this.origin.copy(this.at(t,_i)),this}closestPointToPoint(t,e){e.subVectors(t,this.origin);const n=e.dot(this.direction);return n<0?e.copy(this.origin):e.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(t){return Math.sqrt(this.distanceSqToPoint(t))}distanceSqToPoint(t){const e=_i.subVectors(t,this.origin).dot(this.direction);return e<0?this.origin.distanceToSquared(t):(_i.copy(this.origin).addScaledVector(this.direction,e),_i.distanceToSquared(t))}distanceSqToSegment(t,e,n,r){sc.copy(t).add(e).multiplyScalar(.5),Ha.copy(e).sub(t).normalize(),Fi.copy(this.origin).sub(sc);const s=t.distanceTo(e)*.5,a=-this.direction.dot(Ha),o=Fi.dot(this.direction),c=-Fi.dot(Ha),l=Fi.lengthSq(),h=Math.abs(1-a*a);let u,d,f,g;if(h>0)if(u=a*c-o,d=a*o-c,g=s*h,u>=0)if(d>=-g)if(d<=g){const v=1/h;u*=v,d*=v,f=u*(u+a*d+2*o)+d*(a*u+d+2*c)+l}else d=s,u=Math.max(0,-(a*d+o)),f=-u*u+d*(d+2*c)+l;else d=-s,u=Math.max(0,-(a*d+o)),f=-u*u+d*(d+2*c)+l;else d<=-g?(u=Math.max(0,-(-a*s+o)),d=u>0?-s:Math.min(Math.max(-s,-c),s),f=-u*u+d*(d+2*c)+l):d<=g?(u=0,d=Math.min(Math.max(-s,-c),s),f=d*(d+2*c)+l):(u=Math.max(0,-(a*s+o)),d=u>0?s:Math.min(Math.max(-s,-c),s),f=-u*u+d*(d+2*c)+l);else d=a>0?-s:s,u=Math.max(0,-(a*d+o)),f=-u*u+d*(d+2*c)+l;return n&&n.copy(this.origin).addScaledVector(this.direction,u),r&&r.copy(sc).addScaledVector(Ha,d),f}intersectSphere(t,e){_i.subVectors(t.center,this.origin);const n=_i.dot(this.direction),r=_i.dot(_i)-n*n,s=t.radius*t.radius;if(r>s)return null;const a=Math.sqrt(s-r),o=n-a,c=n+a;return c<0?null:o<0?this.at(c,e):this.at(o,e)}intersectsSphere(t){return t.radius<0?!1:this.distanceSqToPoint(t.center)<=t.radius*t.radius}distanceToPlane(t){const e=t.normal.dot(this.direction);if(e===0)return t.distanceToPoint(this.origin)===0?0:null;const n=-(this.origin.dot(t.normal)+t.constant)/e;return n>=0?n:null}intersectPlane(t,e){const n=this.distanceToPlane(t);return n===null?null:this.at(n,e)}intersectsPlane(t){const e=t.distanceToPoint(this.origin);return e===0||t.normal.dot(this.direction)*e<0}intersectBox(t,e){let n,r,s,a,o,c;const l=1/this.direction.x,h=1/this.direction.y,u=1/this.direction.z,d=this.origin;return l>=0?(n=(t.min.x-d.x)*l,r=(t.max.x-d.x)*l):(n=(t.max.x-d.x)*l,r=(t.min.x-d.x)*l),h>=0?(s=(t.min.y-d.y)*h,a=(t.max.y-d.y)*h):(s=(t.max.y-d.y)*h,a=(t.min.y-d.y)*h),n>a||s>r||((s>n||isNaN(n))&&(n=s),(a<r||isNaN(r))&&(r=a),u>=0?(o=(t.min.z-d.z)*u,c=(t.max.z-d.z)*u):(o=(t.max.z-d.z)*u,c=(t.min.z-d.z)*u),n>c||o>r)||((o>n||n!==n)&&(n=o),(c<r||r!==r)&&(r=c),r<0)?null:this.at(n>=0?n:r,e)}intersectsBox(t){return this.intersectBox(t,_i)!==null}intersectTriangle(t,e,n,r,s){ac.subVectors(e,t),Va.subVectors(n,t),oc.crossVectors(ac,Va);let a=this.direction.dot(oc),o;if(a>0){if(r)return null;o=1}else if(a<0)o=-1,a=-a;else return null;Fi.subVectors(this.origin,t);const c=o*this.direction.dot(Va.crossVectors(Fi,Va));if(c<0)return null;const l=o*this.direction.dot(ac.cross(Fi));if(l<0||c+l>a)return null;const h=-o*Fi.dot(oc);return h<0?null:this.at(h/a,s)}applyMatrix4(t){return this.origin.applyMatrix4(t),this.direction.transformDirection(t),this}equals(t){return t.origin.equals(this.origin)&&t.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class ie{constructor(t,e,n,r,s,a,o,c,l,h,u,d,f,g,v,m){ie.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],t!==void 0&&this.set(t,e,n,r,s,a,o,c,l,h,u,d,f,g,v,m)}set(t,e,n,r,s,a,o,c,l,h,u,d,f,g,v,m){const p=this.elements;return p[0]=t,p[4]=e,p[8]=n,p[12]=r,p[1]=s,p[5]=a,p[9]=o,p[13]=c,p[2]=l,p[6]=h,p[10]=u,p[14]=d,p[3]=f,p[7]=g,p[11]=v,p[15]=m,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new ie().fromArray(this.elements)}copy(t){const e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],e[9]=n[9],e[10]=n[10],e[11]=n[11],e[12]=n[12],e[13]=n[13],e[14]=n[14],e[15]=n[15],this}copyPosition(t){const e=this.elements,n=t.elements;return e[12]=n[12],e[13]=n[13],e[14]=n[14],this}setFromMatrix3(t){const e=t.elements;return this.set(e[0],e[3],e[6],0,e[1],e[4],e[7],0,e[2],e[5],e[8],0,0,0,0,1),this}extractBasis(t,e,n){return t.setFromMatrixColumn(this,0),e.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this}makeBasis(t,e,n){return this.set(t.x,e.x,n.x,0,t.y,e.y,n.y,0,t.z,e.z,n.z,0,0,0,0,1),this}extractRotation(t){const e=this.elements,n=t.elements,r=1/Vr.setFromMatrixColumn(t,0).length(),s=1/Vr.setFromMatrixColumn(t,1).length(),a=1/Vr.setFromMatrixColumn(t,2).length();return e[0]=n[0]*r,e[1]=n[1]*r,e[2]=n[2]*r,e[3]=0,e[4]=n[4]*s,e[5]=n[5]*s,e[6]=n[6]*s,e[7]=0,e[8]=n[8]*a,e[9]=n[9]*a,e[10]=n[10]*a,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromEuler(t){const e=this.elements,n=t.x,r=t.y,s=t.z,a=Math.cos(n),o=Math.sin(n),c=Math.cos(r),l=Math.sin(r),h=Math.cos(s),u=Math.sin(s);if(t.order==="XYZ"){const d=a*h,f=a*u,g=o*h,v=o*u;e[0]=c*h,e[4]=-c*u,e[8]=l,e[1]=f+g*l,e[5]=d-v*l,e[9]=-o*c,e[2]=v-d*l,e[6]=g+f*l,e[10]=a*c}else if(t.order==="YXZ"){const d=c*h,f=c*u,g=l*h,v=l*u;e[0]=d+v*o,e[4]=g*o-f,e[8]=a*l,e[1]=a*u,e[5]=a*h,e[9]=-o,e[2]=f*o-g,e[6]=v+d*o,e[10]=a*c}else if(t.order==="ZXY"){const d=c*h,f=c*u,g=l*h,v=l*u;e[0]=d-v*o,e[4]=-a*u,e[8]=g+f*o,e[1]=f+g*o,e[5]=a*h,e[9]=v-d*o,e[2]=-a*l,e[6]=o,e[10]=a*c}else if(t.order==="ZYX"){const d=a*h,f=a*u,g=o*h,v=o*u;e[0]=c*h,e[4]=g*l-f,e[8]=d*l+v,e[1]=c*u,e[5]=v*l+d,e[9]=f*l-g,e[2]=-l,e[6]=o*c,e[10]=a*c}else if(t.order==="YZX"){const d=a*c,f=a*l,g=o*c,v=o*l;e[0]=c*h,e[4]=v-d*u,e[8]=g*u+f,e[1]=u,e[5]=a*h,e[9]=-o*h,e[2]=-l*h,e[6]=f*u+g,e[10]=d-v*u}else if(t.order==="XZY"){const d=a*c,f=a*l,g=o*c,v=o*l;e[0]=c*h,e[4]=-u,e[8]=l*h,e[1]=d*u+v,e[5]=a*h,e[9]=f*u-g,e[2]=g*u-f,e[6]=o*h,e[10]=v*u+d}return e[3]=0,e[7]=0,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromQuaternion(t){return this.compose(v1,t,x1)}lookAt(t,e,n){const r=this.elements;return Mn.subVectors(t,e),Mn.lengthSq()===0&&(Mn.z=1),Mn.normalize(),Oi.crossVectors(n,Mn),Oi.lengthSq()===0&&(Math.abs(n.z)===1?Mn.x+=1e-4:Mn.z+=1e-4,Mn.normalize(),Oi.crossVectors(n,Mn)),Oi.normalize(),Ga.crossVectors(Mn,Oi),r[0]=Oi.x,r[4]=Ga.x,r[8]=Mn.x,r[1]=Oi.y,r[5]=Ga.y,r[9]=Mn.y,r[2]=Oi.z,r[6]=Ga.z,r[10]=Mn.z,this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const n=t.elements,r=e.elements,s=this.elements,a=n[0],o=n[4],c=n[8],l=n[12],h=n[1],u=n[5],d=n[9],f=n[13],g=n[2],v=n[6],m=n[10],p=n[14],y=n[3],M=n[7],b=n[11],w=n[15],T=r[0],A=r[4],R=r[8],x=r[12],_=r[1],S=r[5],E=r[9],P=r[13],L=r[2],I=r[6],B=r[10],X=r[14],H=r[3],it=r[7],lt=r[11],dt=r[15];return s[0]=a*T+o*_+c*L+l*H,s[4]=a*A+o*S+c*I+l*it,s[8]=a*R+o*E+c*B+l*lt,s[12]=a*x+o*P+c*X+l*dt,s[1]=h*T+u*_+d*L+f*H,s[5]=h*A+u*S+d*I+f*it,s[9]=h*R+u*E+d*B+f*lt,s[13]=h*x+u*P+d*X+f*dt,s[2]=g*T+v*_+m*L+p*H,s[6]=g*A+v*S+m*I+p*it,s[10]=g*R+v*E+m*B+p*lt,s[14]=g*x+v*P+m*X+p*dt,s[3]=y*T+M*_+b*L+w*H,s[7]=y*A+M*S+b*I+w*it,s[11]=y*R+M*E+b*B+w*lt,s[15]=y*x+M*P+b*X+w*dt,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[4]*=t,e[8]*=t,e[12]*=t,e[1]*=t,e[5]*=t,e[9]*=t,e[13]*=t,e[2]*=t,e[6]*=t,e[10]*=t,e[14]*=t,e[3]*=t,e[7]*=t,e[11]*=t,e[15]*=t,this}determinant(){const t=this.elements,e=t[0],n=t[4],r=t[8],s=t[12],a=t[1],o=t[5],c=t[9],l=t[13],h=t[2],u=t[6],d=t[10],f=t[14],g=t[3],v=t[7],m=t[11],p=t[15];return g*(+s*c*u-r*l*u-s*o*d+n*l*d+r*o*f-n*c*f)+v*(+e*c*f-e*l*d+s*a*d-r*a*f+r*l*h-s*c*h)+m*(+e*l*u-e*o*f-s*a*u+n*a*f+s*o*h-n*l*h)+p*(-r*o*h-e*c*u+e*o*d+r*a*u-n*a*d+n*c*h)}transpose(){const t=this.elements;let e;return e=t[1],t[1]=t[4],t[4]=e,e=t[2],t[2]=t[8],t[8]=e,e=t[6],t[6]=t[9],t[9]=e,e=t[3],t[3]=t[12],t[12]=e,e=t[7],t[7]=t[13],t[13]=e,e=t[11],t[11]=t[14],t[14]=e,this}setPosition(t,e,n){const r=this.elements;return t.isVector3?(r[12]=t.x,r[13]=t.y,r[14]=t.z):(r[12]=t,r[13]=e,r[14]=n),this}invert(){const t=this.elements,e=t[0],n=t[1],r=t[2],s=t[3],a=t[4],o=t[5],c=t[6],l=t[7],h=t[8],u=t[9],d=t[10],f=t[11],g=t[12],v=t[13],m=t[14],p=t[15],y=u*m*l-v*d*l+v*c*f-o*m*f-u*c*p+o*d*p,M=g*d*l-h*m*l-g*c*f+a*m*f+h*c*p-a*d*p,b=h*v*l-g*u*l+g*o*f-a*v*f-h*o*p+a*u*p,w=g*u*c-h*v*c-g*o*d+a*v*d+h*o*m-a*u*m,T=e*y+n*M+r*b+s*w;if(T===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const A=1/T;return t[0]=y*A,t[1]=(v*d*s-u*m*s-v*r*f+n*m*f+u*r*p-n*d*p)*A,t[2]=(o*m*s-v*c*s+v*r*l-n*m*l-o*r*p+n*c*p)*A,t[3]=(u*c*s-o*d*s-u*r*l+n*d*l+o*r*f-n*c*f)*A,t[4]=M*A,t[5]=(h*m*s-g*d*s+g*r*f-e*m*f-h*r*p+e*d*p)*A,t[6]=(g*c*s-a*m*s-g*r*l+e*m*l+a*r*p-e*c*p)*A,t[7]=(a*d*s-h*c*s+h*r*l-e*d*l-a*r*f+e*c*f)*A,t[8]=b*A,t[9]=(g*u*s-h*v*s-g*n*f+e*v*f+h*n*p-e*u*p)*A,t[10]=(a*v*s-g*o*s+g*n*l-e*v*l-a*n*p+e*o*p)*A,t[11]=(h*o*s-a*u*s-h*n*l+e*u*l+a*n*f-e*o*f)*A,t[12]=w*A,t[13]=(h*v*r-g*u*r+g*n*d-e*v*d-h*n*m+e*u*m)*A,t[14]=(g*o*r-a*v*r-g*n*c+e*v*c+a*n*m-e*o*m)*A,t[15]=(a*u*r-h*o*r+h*n*c-e*u*c-a*n*d+e*o*d)*A,this}scale(t){const e=this.elements,n=t.x,r=t.y,s=t.z;return e[0]*=n,e[4]*=r,e[8]*=s,e[1]*=n,e[5]*=r,e[9]*=s,e[2]*=n,e[6]*=r,e[10]*=s,e[3]*=n,e[7]*=r,e[11]*=s,this}getMaxScaleOnAxis(){const t=this.elements,e=t[0]*t[0]+t[1]*t[1]+t[2]*t[2],n=t[4]*t[4]+t[5]*t[5]+t[6]*t[6],r=t[8]*t[8]+t[9]*t[9]+t[10]*t[10];return Math.sqrt(Math.max(e,n,r))}makeTranslation(t,e,n){return t.isVector3?this.set(1,0,0,t.x,0,1,0,t.y,0,0,1,t.z,0,0,0,1):this.set(1,0,0,t,0,1,0,e,0,0,1,n,0,0,0,1),this}makeRotationX(t){const e=Math.cos(t),n=Math.sin(t);return this.set(1,0,0,0,0,e,-n,0,0,n,e,0,0,0,0,1),this}makeRotationY(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,0,n,0,0,1,0,0,-n,0,e,0,0,0,0,1),this}makeRotationZ(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,0,n,e,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(t,e){const n=Math.cos(e),r=Math.sin(e),s=1-n,a=t.x,o=t.y,c=t.z,l=s*a,h=s*o;return this.set(l*a+n,l*o-r*c,l*c+r*o,0,l*o+r*c,h*o+n,h*c-r*a,0,l*c-r*o,h*c+r*a,s*c*c+n,0,0,0,0,1),this}makeScale(t,e,n){return this.set(t,0,0,0,0,e,0,0,0,0,n,0,0,0,0,1),this}makeShear(t,e,n,r,s,a){return this.set(1,n,s,0,t,1,a,0,e,r,1,0,0,0,0,1),this}compose(t,e,n){const r=this.elements,s=e._x,a=e._y,o=e._z,c=e._w,l=s+s,h=a+a,u=o+o,d=s*l,f=s*h,g=s*u,v=a*h,m=a*u,p=o*u,y=c*l,M=c*h,b=c*u,w=n.x,T=n.y,A=n.z;return r[0]=(1-(v+p))*w,r[1]=(f+b)*w,r[2]=(g-M)*w,r[3]=0,r[4]=(f-b)*T,r[5]=(1-(d+p))*T,r[6]=(m+y)*T,r[7]=0,r[8]=(g+M)*A,r[9]=(m-y)*A,r[10]=(1-(d+v))*A,r[11]=0,r[12]=t.x,r[13]=t.y,r[14]=t.z,r[15]=1,this}decompose(t,e,n){const r=this.elements;let s=Vr.set(r[0],r[1],r[2]).length();const a=Vr.set(r[4],r[5],r[6]).length(),o=Vr.set(r[8],r[9],r[10]).length();this.determinant()<0&&(s=-s),t.x=r[12],t.y=r[13],t.z=r[14],zn.copy(this);const l=1/s,h=1/a,u=1/o;return zn.elements[0]*=l,zn.elements[1]*=l,zn.elements[2]*=l,zn.elements[4]*=h,zn.elements[5]*=h,zn.elements[6]*=h,zn.elements[8]*=u,zn.elements[9]*=u,zn.elements[10]*=u,e.setFromRotationMatrix(zn),n.x=s,n.y=a,n.z=o,this}makePerspective(t,e,n,r,s,a,o=hi,c=!1){const l=this.elements,h=2*s/(e-t),u=2*s/(n-r),d=(e+t)/(e-t),f=(n+r)/(n-r);let g,v;if(c)g=s/(a-s),v=a*s/(a-s);else if(o===hi)g=-(a+s)/(a-s),v=-2*a*s/(a-s);else if(o===Po)g=-a/(a-s),v=-a*s/(a-s);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+o);return l[0]=h,l[4]=0,l[8]=d,l[12]=0,l[1]=0,l[5]=u,l[9]=f,l[13]=0,l[2]=0,l[6]=0,l[10]=g,l[14]=v,l[3]=0,l[7]=0,l[11]=-1,l[15]=0,this}makeOrthographic(t,e,n,r,s,a,o=hi,c=!1){const l=this.elements,h=2/(e-t),u=2/(n-r),d=-(e+t)/(e-t),f=-(n+r)/(n-r);let g,v;if(c)g=1/(a-s),v=a/(a-s);else if(o===hi)g=-2/(a-s),v=-(a+s)/(a-s);else if(o===Po)g=-1/(a-s),v=-s/(a-s);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+o);return l[0]=h,l[4]=0,l[8]=0,l[12]=d,l[1]=0,l[5]=u,l[9]=0,l[13]=f,l[2]=0,l[6]=0,l[10]=g,l[14]=v,l[3]=0,l[7]=0,l[11]=0,l[15]=1,this}equals(t){const e=this.elements,n=t.elements;for(let r=0;r<16;r++)if(e[r]!==n[r])return!1;return!0}fromArray(t,e=0){for(let n=0;n<16;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){const n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t[e+9]=n[9],t[e+10]=n[10],t[e+11]=n[11],t[e+12]=n[12],t[e+13]=n[13],t[e+14]=n[14],t[e+15]=n[15],t}}const Vr=new N,zn=new ie,v1=new N(0,0,0),x1=new N(1,1,1),Oi=new N,Ga=new N,Mn=new N,hu=new ie,uu=new We;class Bn{constructor(t=0,e=0,n=0,r=Bn.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=e,this._z=n,this._order=r}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get order(){return this._order}set order(t){this._order=t,this._onChangeCallback()}set(t,e,n,r=this._order){return this._x=t,this._y=e,this._z=n,this._order=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(t){return this._x=t._x,this._y=t._y,this._z=t._z,this._order=t._order,this._onChangeCallback(),this}setFromRotationMatrix(t,e=this._order,n=!0){const r=t.elements,s=r[0],a=r[4],o=r[8],c=r[1],l=r[5],h=r[9],u=r[2],d=r[6],f=r[10];switch(e){case"XYZ":this._y=Math.asin(ne(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-h,f),this._z=Math.atan2(-a,s)):(this._x=Math.atan2(d,l),this._z=0);break;case"YXZ":this._x=Math.asin(-ne(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(o,f),this._z=Math.atan2(c,l)):(this._y=Math.atan2(-u,s),this._z=0);break;case"ZXY":this._x=Math.asin(ne(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(-u,f),this._z=Math.atan2(-a,l)):(this._y=0,this._z=Math.atan2(c,s));break;case"ZYX":this._y=Math.asin(-ne(u,-1,1)),Math.abs(u)<.9999999?(this._x=Math.atan2(d,f),this._z=Math.atan2(c,s)):(this._x=0,this._z=Math.atan2(-a,l));break;case"YZX":this._z=Math.asin(ne(c,-1,1)),Math.abs(c)<.9999999?(this._x=Math.atan2(-h,l),this._y=Math.atan2(-u,s)):(this._x=0,this._y=Math.atan2(o,f));break;case"XZY":this._z=Math.asin(-ne(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(d,l),this._y=Math.atan2(o,s)):(this._x=Math.atan2(-h,f),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+e)}return this._order=e,n===!0&&this._onChangeCallback(),this}setFromQuaternion(t,e,n){return hu.makeRotationFromQuaternion(t),this.setFromRotationMatrix(hu,e,n)}setFromVector3(t,e=this._order){return this.set(t.x,t.y,t.z,e)}reorder(t){return uu.setFromEuler(this),this.setFromQuaternion(uu,t)}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._order===this._order}fromArray(t){return this._x=t[0],this._y=t[1],this._z=t[2],t[3]!==void 0&&(this._order=t[3]),this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._order,t}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}Bn.DEFAULT_ORDER="XYZ";class yd{constructor(){this.mask=1}set(t){this.mask=(1<<t|0)>>>0}enable(t){this.mask|=1<<t|0}enableAll(){this.mask=-1}toggle(t){this.mask^=1<<t|0}disable(t){this.mask&=~(1<<t|0)}disableAll(){this.mask=0}test(t){return(this.mask&t.mask)!==0}isEnabled(t){return(this.mask&(1<<t|0))!==0}}let _1=0;const fu=new N,Gr=new We,Mi=new ie,Wa=new N,Xs=new N,M1=new N,y1=new We,du=new N(1,0,0),pu=new N(0,1,0),mu=new N(0,0,1),gu={type:"added"},b1={type:"removed"},Wr={type:"childadded",child:null},cc={type:"childremoved",child:null};class Ce extends Ns{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:_1++}),this.uuid=Yn(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=Ce.DEFAULT_UP.clone();const t=new N,e=new Bn,n=new We,r=new N(1,1,1);function s(){n.setFromEuler(e,!1)}function a(){e.setFromQuaternion(n,void 0,!1)}e._onChange(s),n._onChange(a),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:e},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:r},modelViewMatrix:{value:new ie},normalMatrix:{value:new te}}),this.matrix=new ie,this.matrixWorld=new ie,this.matrixAutoUpdate=Ce.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=Ce.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new yd,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(t){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(t),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(t){return this.quaternion.premultiply(t),this}setRotationFromAxisAngle(t,e){this.quaternion.setFromAxisAngle(t,e)}setRotationFromEuler(t){this.quaternion.setFromEuler(t,!0)}setRotationFromMatrix(t){this.quaternion.setFromRotationMatrix(t)}setRotationFromQuaternion(t){this.quaternion.copy(t)}rotateOnAxis(t,e){return Gr.setFromAxisAngle(t,e),this.quaternion.multiply(Gr),this}rotateOnWorldAxis(t,e){return Gr.setFromAxisAngle(t,e),this.quaternion.premultiply(Gr),this}rotateX(t){return this.rotateOnAxis(du,t)}rotateY(t){return this.rotateOnAxis(pu,t)}rotateZ(t){return this.rotateOnAxis(mu,t)}translateOnAxis(t,e){return fu.copy(t).applyQuaternion(this.quaternion),this.position.add(fu.multiplyScalar(e)),this}translateX(t){return this.translateOnAxis(du,t)}translateY(t){return this.translateOnAxis(pu,t)}translateZ(t){return this.translateOnAxis(mu,t)}localToWorld(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(this.matrixWorld)}worldToLocal(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(Mi.copy(this.matrixWorld).invert())}lookAt(t,e,n){t.isVector3?Wa.copy(t):Wa.set(t,e,n);const r=this.parent;this.updateWorldMatrix(!0,!1),Xs.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Mi.lookAt(Xs,Wa,this.up):Mi.lookAt(Wa,Xs,this.up),this.quaternion.setFromRotationMatrix(Mi),r&&(Mi.extractRotation(r.matrixWorld),Gr.setFromRotationMatrix(Mi),this.quaternion.premultiply(Gr.invert()))}add(t){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.add(arguments[e]);return this}return t===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",t),this):(t&&t.isObject3D?(t.removeFromParent(),t.parent=this,this.children.push(t),t.dispatchEvent(gu),Wr.child=t,this.dispatchEvent(Wr),Wr.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",t),this)}remove(t){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}const e=this.children.indexOf(t);return e!==-1&&(t.parent=null,this.children.splice(e,1),t.dispatchEvent(b1),cc.child=t,this.dispatchEvent(cc),cc.child=null),this}removeFromParent(){const t=this.parent;return t!==null&&t.remove(this),this}clear(){return this.remove(...this.children)}attach(t){return this.updateWorldMatrix(!0,!1),Mi.copy(this.matrixWorld).invert(),t.parent!==null&&(t.parent.updateWorldMatrix(!0,!1),Mi.multiply(t.parent.matrixWorld)),t.applyMatrix4(Mi),t.removeFromParent(),t.parent=this,this.children.push(t),t.updateWorldMatrix(!1,!0),t.dispatchEvent(gu),Wr.child=t,this.dispatchEvent(Wr),Wr.child=null,this}getObjectById(t){return this.getObjectByProperty("id",t)}getObjectByName(t){return this.getObjectByProperty("name",t)}getObjectByProperty(t,e){if(this[t]===e)return this;for(let n=0,r=this.children.length;n<r;n++){const a=this.children[n].getObjectByProperty(t,e);if(a!==void 0)return a}}getObjectsByProperty(t,e,n=[]){this[t]===e&&n.push(this);const r=this.children;for(let s=0,a=r.length;s<a;s++)r[s].getObjectsByProperty(t,e,n);return n}getWorldPosition(t){return this.updateWorldMatrix(!0,!1),t.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Xs,t,M1),t}getWorldScale(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Xs,y1,t),t}getWorldDirection(t){this.updateWorldMatrix(!0,!1);const e=this.matrixWorld.elements;return t.set(e[8],e[9],e[10]).normalize()}raycast(){}traverse(t){t(this);const e=this.children;for(let n=0,r=e.length;n<r;n++)e[n].traverse(t)}traverseVisible(t){if(this.visible===!1)return;t(this);const e=this.children;for(let n=0,r=e.length;n<r;n++)e[n].traverseVisible(t)}traverseAncestors(t){const e=this.parent;e!==null&&(t(e),e.traverseAncestors(t))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(t){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||t)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,t=!0);const e=this.children;for(let n=0,r=e.length;n<r;n++)e[n].updateMatrixWorld(t)}updateWorldMatrix(t,e){const n=this.parent;if(t===!0&&n!==null&&n.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),e===!0){const r=this.children;for(let s=0,a=r.length;s<a;s++)r[s].updateWorldMatrix(!1,!0)}}toJSON(t){const e=t===void 0||typeof t=="string",n={};e&&(t={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});const r={};r.uuid=this.uuid,r.type=this.type,this.name!==""&&(r.name=this.name),this.castShadow===!0&&(r.castShadow=!0),this.receiveShadow===!0&&(r.receiveShadow=!0),this.visible===!1&&(r.visible=!1),this.frustumCulled===!1&&(r.frustumCulled=!1),this.renderOrder!==0&&(r.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(r.userData=this.userData),r.layers=this.layers.mask,r.matrix=this.matrix.toArray(),r.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(r.matrixAutoUpdate=!1),this.isInstancedMesh&&(r.type="InstancedMesh",r.count=this.count,r.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(r.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(r.type="BatchedMesh",r.perObjectFrustumCulled=this.perObjectFrustumCulled,r.sortObjects=this.sortObjects,r.drawRanges=this._drawRanges,r.reservedRanges=this._reservedRanges,r.geometryInfo=this._geometryInfo.map(o=>({...o,boundingBox:o.boundingBox?o.boundingBox.toJSON():void 0,boundingSphere:o.boundingSphere?o.boundingSphere.toJSON():void 0})),r.instanceInfo=this._instanceInfo.map(o=>({...o})),r.availableInstanceIds=this._availableInstanceIds.slice(),r.availableGeometryIds=this._availableGeometryIds.slice(),r.nextIndexStart=this._nextIndexStart,r.nextVertexStart=this._nextVertexStart,r.geometryCount=this._geometryCount,r.maxInstanceCount=this._maxInstanceCount,r.maxVertexCount=this._maxVertexCount,r.maxIndexCount=this._maxIndexCount,r.geometryInitialized=this._geometryInitialized,r.matricesTexture=this._matricesTexture.toJSON(t),r.indirectTexture=this._indirectTexture.toJSON(t),this._colorsTexture!==null&&(r.colorsTexture=this._colorsTexture.toJSON(t)),this.boundingSphere!==null&&(r.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(r.boundingBox=this.boundingBox.toJSON()));function s(o,c){return o[c.uuid]===void 0&&(o[c.uuid]=c.toJSON(t)),c.uuid}if(this.isScene)this.background&&(this.background.isColor?r.background=this.background.toJSON():this.background.isTexture&&(r.background=this.background.toJSON(t).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(r.environment=this.environment.toJSON(t).uuid);else if(this.isMesh||this.isLine||this.isPoints){r.geometry=s(t.geometries,this.geometry);const o=this.geometry.parameters;if(o!==void 0&&o.shapes!==void 0){const c=o.shapes;if(Array.isArray(c))for(let l=0,h=c.length;l<h;l++){const u=c[l];s(t.shapes,u)}else s(t.shapes,c)}}if(this.isSkinnedMesh&&(r.bindMode=this.bindMode,r.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(s(t.skeletons,this.skeleton),r.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const o=[];for(let c=0,l=this.material.length;c<l;c++)o.push(s(t.materials,this.material[c]));r.material=o}else r.material=s(t.materials,this.material);if(this.children.length>0){r.children=[];for(let o=0;o<this.children.length;o++)r.children.push(this.children[o].toJSON(t).object)}if(this.animations.length>0){r.animations=[];for(let o=0;o<this.animations.length;o++){const c=this.animations[o];r.animations.push(s(t.animations,c))}}if(e){const o=a(t.geometries),c=a(t.materials),l=a(t.textures),h=a(t.images),u=a(t.shapes),d=a(t.skeletons),f=a(t.animations),g=a(t.nodes);o.length>0&&(n.geometries=o),c.length>0&&(n.materials=c),l.length>0&&(n.textures=l),h.length>0&&(n.images=h),u.length>0&&(n.shapes=u),d.length>0&&(n.skeletons=d),f.length>0&&(n.animations=f),g.length>0&&(n.nodes=g)}return n.object=r,n;function a(o){const c=[];for(const l in o){const h=o[l];delete h.metadata,c.push(h)}return c}}clone(t){return new this.constructor().copy(this,t)}copy(t,e=!0){if(this.name=t.name,this.up.copy(t.up),this.position.copy(t.position),this.rotation.order=t.rotation.order,this.quaternion.copy(t.quaternion),this.scale.copy(t.scale),this.matrix.copy(t.matrix),this.matrixWorld.copy(t.matrixWorld),this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrixWorldAutoUpdate=t.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=t.matrixWorldNeedsUpdate,this.layers.mask=t.layers.mask,this.visible=t.visible,this.castShadow=t.castShadow,this.receiveShadow=t.receiveShadow,this.frustumCulled=t.frustumCulled,this.renderOrder=t.renderOrder,this.animations=t.animations.slice(),this.userData=JSON.parse(JSON.stringify(t.userData)),e===!0)for(let n=0;n<t.children.length;n++){const r=t.children[n];this.add(r.clone())}return this}}Ce.DEFAULT_UP=new N(0,1,0);Ce.DEFAULT_MATRIX_AUTO_UPDATE=!0;Ce.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const Hn=new N,yi=new N,lc=new N,bi=new N,Xr=new N,qr=new N,vu=new N,hc=new N,uc=new N,fc=new N,dc=new le,pc=new le,mc=new le;class Fn{constructor(t=new N,e=new N,n=new N){this.a=t,this.b=e,this.c=n}static getNormal(t,e,n,r){r.subVectors(n,e),Hn.subVectors(t,e),r.cross(Hn);const s=r.lengthSq();return s>0?r.multiplyScalar(1/Math.sqrt(s)):r.set(0,0,0)}static getBarycoord(t,e,n,r,s){Hn.subVectors(r,e),yi.subVectors(n,e),lc.subVectors(t,e);const a=Hn.dot(Hn),o=Hn.dot(yi),c=Hn.dot(lc),l=yi.dot(yi),h=yi.dot(lc),u=a*l-o*o;if(u===0)return s.set(0,0,0),null;const d=1/u,f=(l*c-o*h)*d,g=(a*h-o*c)*d;return s.set(1-f-g,g,f)}static containsPoint(t,e,n,r){return this.getBarycoord(t,e,n,r,bi)===null?!1:bi.x>=0&&bi.y>=0&&bi.x+bi.y<=1}static getInterpolation(t,e,n,r,s,a,o,c){return this.getBarycoord(t,e,n,r,bi)===null?(c.x=0,c.y=0,"z"in c&&(c.z=0),"w"in c&&(c.w=0),null):(c.setScalar(0),c.addScaledVector(s,bi.x),c.addScaledVector(a,bi.y),c.addScaledVector(o,bi.z),c)}static getInterpolatedAttribute(t,e,n,r,s,a){return dc.setScalar(0),pc.setScalar(0),mc.setScalar(0),dc.fromBufferAttribute(t,e),pc.fromBufferAttribute(t,n),mc.fromBufferAttribute(t,r),a.setScalar(0),a.addScaledVector(dc,s.x),a.addScaledVector(pc,s.y),a.addScaledVector(mc,s.z),a}static isFrontFacing(t,e,n,r){return Hn.subVectors(n,e),yi.subVectors(t,e),Hn.cross(yi).dot(r)<0}set(t,e,n){return this.a.copy(t),this.b.copy(e),this.c.copy(n),this}setFromPointsAndIndices(t,e,n,r){return this.a.copy(t[e]),this.b.copy(t[n]),this.c.copy(t[r]),this}setFromAttributeAndIndices(t,e,n,r){return this.a.fromBufferAttribute(t,e),this.b.fromBufferAttribute(t,n),this.c.fromBufferAttribute(t,r),this}clone(){return new this.constructor().copy(this)}copy(t){return this.a.copy(t.a),this.b.copy(t.b),this.c.copy(t.c),this}getArea(){return Hn.subVectors(this.c,this.b),yi.subVectors(this.a,this.b),Hn.cross(yi).length()*.5}getMidpoint(t){return t.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(t){return Fn.getNormal(this.a,this.b,this.c,t)}getPlane(t){return t.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,e){return Fn.getBarycoord(t,this.a,this.b,this.c,e)}getInterpolation(t,e,n,r,s){return Fn.getInterpolation(t,this.a,this.b,this.c,e,n,r,s)}containsPoint(t){return Fn.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return Fn.isFrontFacing(this.a,this.b,this.c,t)}intersectsBox(t){return t.intersectsTriangle(this)}closestPointToPoint(t,e){const n=this.a,r=this.b,s=this.c;let a,o;Xr.subVectors(r,n),qr.subVectors(s,n),hc.subVectors(t,n);const c=Xr.dot(hc),l=qr.dot(hc);if(c<=0&&l<=0)return e.copy(n);uc.subVectors(t,r);const h=Xr.dot(uc),u=qr.dot(uc);if(h>=0&&u<=h)return e.copy(r);const d=c*u-h*l;if(d<=0&&c>=0&&h<=0)return a=c/(c-h),e.copy(n).addScaledVector(Xr,a);fc.subVectors(t,s);const f=Xr.dot(fc),g=qr.dot(fc);if(g>=0&&f<=g)return e.copy(s);const v=f*l-c*g;if(v<=0&&l>=0&&g<=0)return o=l/(l-g),e.copy(n).addScaledVector(qr,o);const m=h*g-f*u;if(m<=0&&u-h>=0&&f-g>=0)return vu.subVectors(s,r),o=(u-h)/(u-h+(f-g)),e.copy(r).addScaledVector(vu,o);const p=1/(m+v+d);return a=v*p,o=d*p,e.copy(n).addScaledVector(Xr,a).addScaledVector(qr,o)}equals(t){return t.a.equals(this.a)&&t.b.equals(this.b)&&t.c.equals(this.c)}}const bd={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Bi={h:0,s:0,l:0},Xa={h:0,s:0,l:0};function gc(i,t,e){return e<0&&(e+=1),e>1&&(e-=1),e<1/6?i+(t-i)*6*e:e<1/2?t:e<2/3?i+(t-i)*6*(2/3-e):i}class Pt{constructor(t,e,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(t,e,n)}set(t,e,n){if(e===void 0&&n===void 0){const r=t;r&&r.isColor?this.copy(r):typeof r=="number"?this.setHex(r):typeof r=="string"&&this.setStyle(r)}else this.setRGB(t,e,n);return this}setScalar(t){return this.r=t,this.g=t,this.b=t,this}setHex(t,e=an){return t=Math.floor(t),this.r=(t>>16&255)/255,this.g=(t>>8&255)/255,this.b=(t&255)/255,ce.colorSpaceToWorking(this,e),this}setRGB(t,e,n,r=ce.workingColorSpace){return this.r=t,this.g=e,this.b=n,ce.colorSpaceToWorking(this,r),this}setHSL(t,e,n,r=ce.workingColorSpace){if(t=hh(t,1),e=ne(e,0,1),n=ne(n,0,1),e===0)this.r=this.g=this.b=n;else{const s=n<=.5?n*(1+e):n+e-n*e,a=2*n-s;this.r=gc(a,s,t+1/3),this.g=gc(a,s,t),this.b=gc(a,s,t-1/3)}return ce.colorSpaceToWorking(this,r),this}setStyle(t,e=an){function n(s){s!==void 0&&parseFloat(s)<1&&console.warn("THREE.Color: Alpha component of "+t+" will be ignored.")}let r;if(r=/^(\w+)\(([^\)]*)\)/.exec(t)){let s;const a=r[1],o=r[2];switch(a){case"rgb":case"rgba":if(s=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(s[4]),this.setRGB(Math.min(255,parseInt(s[1],10))/255,Math.min(255,parseInt(s[2],10))/255,Math.min(255,parseInt(s[3],10))/255,e);if(s=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(s[4]),this.setRGB(Math.min(100,parseInt(s[1],10))/100,Math.min(100,parseInt(s[2],10))/100,Math.min(100,parseInt(s[3],10))/100,e);break;case"hsl":case"hsla":if(s=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(s[4]),this.setHSL(parseFloat(s[1])/360,parseFloat(s[2])/100,parseFloat(s[3])/100,e);break;default:console.warn("THREE.Color: Unknown color model "+t)}}else if(r=/^\#([A-Fa-f\d]+)$/.exec(t)){const s=r[1],a=s.length;if(a===3)return this.setRGB(parseInt(s.charAt(0),16)/15,parseInt(s.charAt(1),16)/15,parseInt(s.charAt(2),16)/15,e);if(a===6)return this.setHex(parseInt(s,16),e);console.warn("THREE.Color: Invalid hex color "+t)}else if(t&&t.length>0)return this.setColorName(t,e);return this}setColorName(t,e=an){const n=bd[t.toLowerCase()];return n!==void 0?this.setHex(n,e):console.warn("THREE.Color: Unknown color "+t),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(t){return this.r=t.r,this.g=t.g,this.b=t.b,this}copySRGBToLinear(t){return this.r=Li(t.r),this.g=Li(t.g),this.b=Li(t.b),this}copyLinearToSRGB(t){return this.r=Ms(t.r),this.g=Ms(t.g),this.b=Ms(t.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(t=an){return ce.workingToColorSpace($e.copy(this),t),Math.round(ne($e.r*255,0,255))*65536+Math.round(ne($e.g*255,0,255))*256+Math.round(ne($e.b*255,0,255))}getHexString(t=an){return("000000"+this.getHex(t).toString(16)).slice(-6)}getHSL(t,e=ce.workingColorSpace){ce.workingToColorSpace($e.copy(this),e);const n=$e.r,r=$e.g,s=$e.b,a=Math.max(n,r,s),o=Math.min(n,r,s);let c,l;const h=(o+a)/2;if(o===a)c=0,l=0;else{const u=a-o;switch(l=h<=.5?u/(a+o):u/(2-a-o),a){case n:c=(r-s)/u+(r<s?6:0);break;case r:c=(s-n)/u+2;break;case s:c=(n-r)/u+4;break}c/=6}return t.h=c,t.s=l,t.l=h,t}getRGB(t,e=ce.workingColorSpace){return ce.workingToColorSpace($e.copy(this),e),t.r=$e.r,t.g=$e.g,t.b=$e.b,t}getStyle(t=an){ce.workingToColorSpace($e.copy(this),t);const e=$e.r,n=$e.g,r=$e.b;return t!==an?`color(${t} ${e.toFixed(3)} ${n.toFixed(3)} ${r.toFixed(3)})`:`rgb(${Math.round(e*255)},${Math.round(n*255)},${Math.round(r*255)})`}offsetHSL(t,e,n){return this.getHSL(Bi),this.setHSL(Bi.h+t,Bi.s+e,Bi.l+n)}add(t){return this.r+=t.r,this.g+=t.g,this.b+=t.b,this}addColors(t,e){return this.r=t.r+e.r,this.g=t.g+e.g,this.b=t.b+e.b,this}addScalar(t){return this.r+=t,this.g+=t,this.b+=t,this}sub(t){return this.r=Math.max(0,this.r-t.r),this.g=Math.max(0,this.g-t.g),this.b=Math.max(0,this.b-t.b),this}multiply(t){return this.r*=t.r,this.g*=t.g,this.b*=t.b,this}multiplyScalar(t){return this.r*=t,this.g*=t,this.b*=t,this}lerp(t,e){return this.r+=(t.r-this.r)*e,this.g+=(t.g-this.g)*e,this.b+=(t.b-this.b)*e,this}lerpColors(t,e,n){return this.r=t.r+(e.r-t.r)*n,this.g=t.g+(e.g-t.g)*n,this.b=t.b+(e.b-t.b)*n,this}lerpHSL(t,e){this.getHSL(Bi),t.getHSL(Xa);const n=aa(Bi.h,Xa.h,e),r=aa(Bi.s,Xa.s,e),s=aa(Bi.l,Xa.l,e);return this.setHSL(n,r,s),this}setFromVector3(t){return this.r=t.x,this.g=t.y,this.b=t.z,this}applyMatrix3(t){const e=this.r,n=this.g,r=this.b,s=t.elements;return this.r=s[0]*e+s[3]*n+s[6]*r,this.g=s[1]*e+s[4]*n+s[7]*r,this.b=s[2]*e+s[5]*n+s[8]*r,this}equals(t){return t.r===this.r&&t.g===this.g&&t.b===this.b}fromArray(t,e=0){return this.r=t[e],this.g=t[e+1],this.b=t[e+2],this}toArray(t=[],e=0){return t[e]=this.r,t[e+1]=this.g,t[e+2]=this.b,t}fromBufferAttribute(t,e){return this.r=t.getX(e),this.g=t.getY(e),this.b=t.getZ(e),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const $e=new Pt;Pt.NAMES=bd;let S1=0;class Rr extends Ns{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:S1++}),this.uuid=Yn(),this.name="",this.type="Material",this.blending=xs,this.side=Ki,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=Zc,this.blendDst=Jc,this.blendEquation=ur,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Pt(0,0,0),this.blendAlpha=0,this.depthFunc=Ts,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=iu,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Or,this.stencilZFail=Or,this.stencilZPass=Or,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(t){this._alphaTest>0!=t>0&&this.version++,this._alphaTest=t}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(t){if(t!==void 0)for(const e in t){const n=t[e];if(n===void 0){console.warn(`THREE.Material: parameter '${e}' has value of undefined.`);continue}const r=this[e];if(r===void 0){console.warn(`THREE.Material: '${e}' is not a property of THREE.${this.type}.`);continue}r&&r.isColor?r.set(n):r&&r.isVector3&&n&&n.isVector3?r.copy(n):this[e]=n}}toJSON(t){const e=t===void 0||typeof t=="string";e&&(t={textures:{},images:{}});const n={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(t).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(t).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(t).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(n.sheenColorMap=this.sheenColorMap.toJSON(t).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(n.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(t).uuid),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(t).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(t).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(t).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(t).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(t).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(t).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(t).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(t).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(t).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(t).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(t).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(t).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(t).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(t).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(t).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(t).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(t).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(t).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(t).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(t).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(t).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==xs&&(n.blending=this.blending),this.side!==Ki&&(n.side=this.side),this.vertexColors===!0&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=!0),this.blendSrc!==Zc&&(n.blendSrc=this.blendSrc),this.blendDst!==Jc&&(n.blendDst=this.blendDst),this.blendEquation!==ur&&(n.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(n.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(n.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(n.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(n.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(n.blendAlpha=this.blendAlpha),this.depthFunc!==Ts&&(n.depthFunc=this.depthFunc),this.depthTest===!1&&(n.depthTest=this.depthTest),this.depthWrite===!1&&(n.depthWrite=this.depthWrite),this.colorWrite===!1&&(n.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(n.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==iu&&(n.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(n.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(n.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==Or&&(n.stencilFail=this.stencilFail),this.stencilZFail!==Or&&(n.stencilZFail=this.stencilZFail),this.stencilZPass!==Or&&(n.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(n.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=!0),this.alphaToCoverage===!0&&(n.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=!0),this.forceSinglePass===!0&&(n.forceSinglePass=!0),this.wireframe===!0&&(n.wireframe=!0),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=!0),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData);function r(s){const a=[];for(const o in s){const c=s[o];delete c.metadata,a.push(c)}return a}if(e){const s=r(t.textures),a=r(t.images);s.length>0&&(n.textures=s),a.length>0&&(n.images=a)}return n}clone(){return new this.constructor().copy(this)}copy(t){this.name=t.name,this.blending=t.blending,this.side=t.side,this.vertexColors=t.vertexColors,this.opacity=t.opacity,this.transparent=t.transparent,this.blendSrc=t.blendSrc,this.blendDst=t.blendDst,this.blendEquation=t.blendEquation,this.blendSrcAlpha=t.blendSrcAlpha,this.blendDstAlpha=t.blendDstAlpha,this.blendEquationAlpha=t.blendEquationAlpha,this.blendColor.copy(t.blendColor),this.blendAlpha=t.blendAlpha,this.depthFunc=t.depthFunc,this.depthTest=t.depthTest,this.depthWrite=t.depthWrite,this.stencilWriteMask=t.stencilWriteMask,this.stencilFunc=t.stencilFunc,this.stencilRef=t.stencilRef,this.stencilFuncMask=t.stencilFuncMask,this.stencilFail=t.stencilFail,this.stencilZFail=t.stencilZFail,this.stencilZPass=t.stencilZPass,this.stencilWrite=t.stencilWrite;const e=t.clippingPlanes;let n=null;if(e!==null){const r=e.length;n=new Array(r);for(let s=0;s!==r;++s)n[s]=e[s].clone()}return this.clippingPlanes=n,this.clipIntersection=t.clipIntersection,this.clipShadows=t.clipShadows,this.shadowSide=t.shadowSide,this.colorWrite=t.colorWrite,this.precision=t.precision,this.polygonOffset=t.polygonOffset,this.polygonOffsetFactor=t.polygonOffsetFactor,this.polygonOffsetUnits=t.polygonOffsetUnits,this.dithering=t.dithering,this.alphaTest=t.alphaTest,this.alphaHash=t.alphaHash,this.alphaToCoverage=t.alphaToCoverage,this.premultipliedAlpha=t.premultipliedAlpha,this.forceSinglePass=t.forceSinglePass,this.visible=t.visible,this.toneMapped=t.toneMapped,this.userData=JSON.parse(JSON.stringify(t.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(t){t===!0&&this.version++}}class Qi extends Rr{constructor(t){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new Pt(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Bn,this.combine=od,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.fog=t.fog,this}}const Ai=w1();function w1(){const i=new ArrayBuffer(4),t=new Float32Array(i),e=new Uint32Array(i),n=new Uint32Array(512),r=new Uint32Array(512);for(let c=0;c<256;++c){const l=c-127;l<-27?(n[c]=0,n[c|256]=32768,r[c]=24,r[c|256]=24):l<-14?(n[c]=1024>>-l-14,n[c|256]=1024>>-l-14|32768,r[c]=-l-1,r[c|256]=-l-1):l<=15?(n[c]=l+15<<10,n[c|256]=l+15<<10|32768,r[c]=13,r[c|256]=13):l<128?(n[c]=31744,n[c|256]=64512,r[c]=24,r[c|256]=24):(n[c]=31744,n[c|256]=64512,r[c]=13,r[c|256]=13)}const s=new Uint32Array(2048),a=new Uint32Array(64),o=new Uint32Array(64);for(let c=1;c<1024;++c){let l=c<<13,h=0;for(;(l&8388608)===0;)l<<=1,h-=8388608;l&=-8388609,h+=947912704,s[c]=l|h}for(let c=1024;c<2048;++c)s[c]=939524096+(c-1024<<13);for(let c=1;c<31;++c)a[c]=c<<23;a[31]=1199570944,a[32]=2147483648;for(let c=33;c<63;++c)a[c]=2147483648+(c-32<<23);a[63]=3347054592;for(let c=1;c<64;++c)c!==32&&(o[c]=1024);return{floatView:t,uint32View:e,baseTable:n,shiftTable:r,mantissaTable:s,exponentTable:a,offsetTable:o}}function E1(i){Math.abs(i)>65504&&console.warn("THREE.DataUtils.toHalfFloat(): Value out of range."),i=ne(i,-65504,65504),Ai.floatView[0]=i;const t=Ai.uint32View[0],e=t>>23&511;return Ai.baseTable[e]+((t&8388607)>>Ai.shiftTable[e])}function T1(i){const t=i>>10;return Ai.uint32View[0]=Ai.mantissaTable[Ai.offsetTable[t]+(i&1023)]+Ai.exponentTable[t],Ai.floatView[0]}class qa{static toHalfFloat(t){return E1(t)}static fromHalfFloat(t){return T1(t)}}const De=new N,Ya=new ft;let A1=0;class ae{constructor(t,e,n=!1){if(Array.isArray(t))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:A1++}),this.name="",this.array=t,this.itemSize=e,this.count=t!==void 0?t.length/e:0,this.normalized=n,this.usage=Nl,this.updateRanges=[],this.gpuType=li,this.version=0}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.name=t.name,this.array=new t.array.constructor(t.array),this.itemSize=t.itemSize,this.count=t.count,this.normalized=t.normalized,this.usage=t.usage,this.gpuType=t.gpuType,this}copyAt(t,e,n){t*=this.itemSize,n*=e.itemSize;for(let r=0,s=this.itemSize;r<s;r++)this.array[t+r]=e.array[n+r];return this}copyArray(t){return this.array.set(t),this}applyMatrix3(t){if(this.itemSize===2)for(let e=0,n=this.count;e<n;e++)Ya.fromBufferAttribute(this,e),Ya.applyMatrix3(t),this.setXY(e,Ya.x,Ya.y);else if(this.itemSize===3)for(let e=0,n=this.count;e<n;e++)De.fromBufferAttribute(this,e),De.applyMatrix3(t),this.setXYZ(e,De.x,De.y,De.z);return this}applyMatrix4(t){for(let e=0,n=this.count;e<n;e++)De.fromBufferAttribute(this,e),De.applyMatrix4(t),this.setXYZ(e,De.x,De.y,De.z);return this}applyNormalMatrix(t){for(let e=0,n=this.count;e<n;e++)De.fromBufferAttribute(this,e),De.applyNormalMatrix(t),this.setXYZ(e,De.x,De.y,De.z);return this}transformDirection(t){for(let e=0,n=this.count;e<n;e++)De.fromBufferAttribute(this,e),De.transformDirection(t),this.setXYZ(e,De.x,De.y,De.z);return this}set(t,e=0){return this.array.set(t,e),this}getComponent(t,e){let n=this.array[t*this.itemSize+e];return this.normalized&&(n=Xn(n,this.array)),n}setComponent(t,e,n){return this.normalized&&(n=ue(n,this.array)),this.array[t*this.itemSize+e]=n,this}getX(t){let e=this.array[t*this.itemSize];return this.normalized&&(e=Xn(e,this.array)),e}setX(t,e){return this.normalized&&(e=ue(e,this.array)),this.array[t*this.itemSize]=e,this}getY(t){let e=this.array[t*this.itemSize+1];return this.normalized&&(e=Xn(e,this.array)),e}setY(t,e){return this.normalized&&(e=ue(e,this.array)),this.array[t*this.itemSize+1]=e,this}getZ(t){let e=this.array[t*this.itemSize+2];return this.normalized&&(e=Xn(e,this.array)),e}setZ(t,e){return this.normalized&&(e=ue(e,this.array)),this.array[t*this.itemSize+2]=e,this}getW(t){let e=this.array[t*this.itemSize+3];return this.normalized&&(e=Xn(e,this.array)),e}setW(t,e){return this.normalized&&(e=ue(e,this.array)),this.array[t*this.itemSize+3]=e,this}setXY(t,e,n){return t*=this.itemSize,this.normalized&&(e=ue(e,this.array),n=ue(n,this.array)),this.array[t+0]=e,this.array[t+1]=n,this}setXYZ(t,e,n,r){return t*=this.itemSize,this.normalized&&(e=ue(e,this.array),n=ue(n,this.array),r=ue(r,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=r,this}setXYZW(t,e,n,r,s){return t*=this.itemSize,this.normalized&&(e=ue(e,this.array),n=ue(n,this.array),r=ue(r,this.array),s=ue(s,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=r,this.array[t+3]=s,this}onUpload(t){return this.onUploadCallback=t,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const t={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(t.name=this.name),this.usage!==Nl&&(t.usage=this.usage),t}}class Sd extends ae{constructor(t,e,n){super(new Uint16Array(t),e,n)}}class wd extends ae{constructor(t,e,n){super(new Uint32Array(t),e,n)}}class se extends ae{constructor(t,e,n){super(new Float32Array(t),e,n)}}let R1=0;const Ln=new ie,vc=new Ce,Yr=new N,yn=new Fs,qs=new Fs,Be=new N;class Se extends Ns{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:R1++}),this.uuid=Yn(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(t){return Array.isArray(t)?this.index=new(Md(t)?wd:Sd)(t,1):this.index=t,this}setIndirect(t){return this.indirect=t,this}getIndirect(){return this.indirect}getAttribute(t){return this.attributes[t]}setAttribute(t,e){return this.attributes[t]=e,this}deleteAttribute(t){return delete this.attributes[t],this}hasAttribute(t){return this.attributes[t]!==void 0}addGroup(t,e,n=0){this.groups.push({start:t,count:e,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(t,e){this.drawRange.start=t,this.drawRange.count=e}applyMatrix4(t){const e=this.attributes.position;e!==void 0&&(e.applyMatrix4(t),e.needsUpdate=!0);const n=this.attributes.normal;if(n!==void 0){const s=new te().getNormalMatrix(t);n.applyNormalMatrix(s),n.needsUpdate=!0}const r=this.attributes.tangent;return r!==void 0&&(r.transformDirection(t),r.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(t){return Ln.makeRotationFromQuaternion(t),this.applyMatrix4(Ln),this}rotateX(t){return Ln.makeRotationX(t),this.applyMatrix4(Ln),this}rotateY(t){return Ln.makeRotationY(t),this.applyMatrix4(Ln),this}rotateZ(t){return Ln.makeRotationZ(t),this.applyMatrix4(Ln),this}translate(t,e,n){return Ln.makeTranslation(t,e,n),this.applyMatrix4(Ln),this}scale(t,e,n){return Ln.makeScale(t,e,n),this.applyMatrix4(Ln),this}lookAt(t){return vc.lookAt(t),vc.updateMatrix(),this.applyMatrix4(vc.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Yr).negate(),this.translate(Yr.x,Yr.y,Yr.z),this}setFromPoints(t){const e=this.getAttribute("position");if(e===void 0){const n=[];for(let r=0,s=t.length;r<s;r++){const a=t[r];n.push(a.x,a.y,a.z||0)}this.setAttribute("position",new se(n,3))}else{const n=Math.min(t.length,e.count);for(let r=0;r<n;r++){const s=t[r];e.setXYZ(r,s.x,s.y,s.z||0)}t.length>e.count&&console.warn("THREE.BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),e.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new Fs);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new N(-1/0,-1/0,-1/0),new N(1/0,1/0,1/0));return}if(t!==void 0){if(this.boundingBox.setFromBufferAttribute(t),e)for(let n=0,r=e.length;n<r;n++){const s=e[n];yn.setFromBufferAttribute(s),this.morphTargetsRelative?(Be.addVectors(this.boundingBox.min,yn.min),this.boundingBox.expandByPoint(Be),Be.addVectors(this.boundingBox.max,yn.max),this.boundingBox.expandByPoint(Be)):(this.boundingBox.expandByPoint(yn.min),this.boundingBox.expandByPoint(yn.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Ar);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new N,1/0);return}if(t){const n=this.boundingSphere.center;if(yn.setFromBufferAttribute(t),e)for(let s=0,a=e.length;s<a;s++){const o=e[s];qs.setFromBufferAttribute(o),this.morphTargetsRelative?(Be.addVectors(yn.min,qs.min),yn.expandByPoint(Be),Be.addVectors(yn.max,qs.max),yn.expandByPoint(Be)):(yn.expandByPoint(qs.min),yn.expandByPoint(qs.max))}yn.getCenter(n);let r=0;for(let s=0,a=t.count;s<a;s++)Be.fromBufferAttribute(t,s),r=Math.max(r,n.distanceToSquared(Be));if(e)for(let s=0,a=e.length;s<a;s++){const o=e[s],c=this.morphTargetsRelative;for(let l=0,h=o.count;l<h;l++)Be.fromBufferAttribute(o,l),c&&(Yr.fromBufferAttribute(t,l),Be.add(Yr)),r=Math.max(r,n.distanceToSquared(Be))}this.boundingSphere.radius=Math.sqrt(r),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const t=this.index,e=this.attributes;if(t===null||e.position===void 0||e.normal===void 0||e.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const n=e.position,r=e.normal,s=e.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new ae(new Float32Array(4*n.count),4));const a=this.getAttribute("tangent"),o=[],c=[];for(let R=0;R<n.count;R++)o[R]=new N,c[R]=new N;const l=new N,h=new N,u=new N,d=new ft,f=new ft,g=new ft,v=new N,m=new N;function p(R,x,_){l.fromBufferAttribute(n,R),h.fromBufferAttribute(n,x),u.fromBufferAttribute(n,_),d.fromBufferAttribute(s,R),f.fromBufferAttribute(s,x),g.fromBufferAttribute(s,_),h.sub(l),u.sub(l),f.sub(d),g.sub(d);const S=1/(f.x*g.y-g.x*f.y);isFinite(S)&&(v.copy(h).multiplyScalar(g.y).addScaledVector(u,-f.y).multiplyScalar(S),m.copy(u).multiplyScalar(f.x).addScaledVector(h,-g.x).multiplyScalar(S),o[R].add(v),o[x].add(v),o[_].add(v),c[R].add(m),c[x].add(m),c[_].add(m))}let y=this.groups;y.length===0&&(y=[{start:0,count:t.count}]);for(let R=0,x=y.length;R<x;++R){const _=y[R],S=_.start,E=_.count;for(let P=S,L=S+E;P<L;P+=3)p(t.getX(P+0),t.getX(P+1),t.getX(P+2))}const M=new N,b=new N,w=new N,T=new N;function A(R){w.fromBufferAttribute(r,R),T.copy(w);const x=o[R];M.copy(x),M.sub(w.multiplyScalar(w.dot(x))).normalize(),b.crossVectors(T,x);const S=b.dot(c[R])<0?-1:1;a.setXYZW(R,M.x,M.y,M.z,S)}for(let R=0,x=y.length;R<x;++R){const _=y[R],S=_.start,E=_.count;for(let P=S,L=S+E;P<L;P+=3)A(t.getX(P+0)),A(t.getX(P+1)),A(t.getX(P+2))}}computeVertexNormals(){const t=this.index,e=this.getAttribute("position");if(e!==void 0){let n=this.getAttribute("normal");if(n===void 0)n=new ae(new Float32Array(e.count*3),3),this.setAttribute("normal",n);else for(let d=0,f=n.count;d<f;d++)n.setXYZ(d,0,0,0);const r=new N,s=new N,a=new N,o=new N,c=new N,l=new N,h=new N,u=new N;if(t)for(let d=0,f=t.count;d<f;d+=3){const g=t.getX(d+0),v=t.getX(d+1),m=t.getX(d+2);r.fromBufferAttribute(e,g),s.fromBufferAttribute(e,v),a.fromBufferAttribute(e,m),h.subVectors(a,s),u.subVectors(r,s),h.cross(u),o.fromBufferAttribute(n,g),c.fromBufferAttribute(n,v),l.fromBufferAttribute(n,m),o.add(h),c.add(h),l.add(h),n.setXYZ(g,o.x,o.y,o.z),n.setXYZ(v,c.x,c.y,c.z),n.setXYZ(m,l.x,l.y,l.z)}else for(let d=0,f=e.count;d<f;d+=3)r.fromBufferAttribute(e,d+0),s.fromBufferAttribute(e,d+1),a.fromBufferAttribute(e,d+2),h.subVectors(a,s),u.subVectors(r,s),h.cross(u),n.setXYZ(d+0,h.x,h.y,h.z),n.setXYZ(d+1,h.x,h.y,h.z),n.setXYZ(d+2,h.x,h.y,h.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){const t=this.attributes.normal;for(let e=0,n=t.count;e<n;e++)Be.fromBufferAttribute(t,e),Be.normalize(),t.setXYZ(e,Be.x,Be.y,Be.z)}toNonIndexed(){function t(o,c){const l=o.array,h=o.itemSize,u=o.normalized,d=new l.constructor(c.length*h);let f=0,g=0;for(let v=0,m=c.length;v<m;v++){o.isInterleavedBufferAttribute?f=c[v]*o.data.stride+o.offset:f=c[v]*h;for(let p=0;p<h;p++)d[g++]=l[f++]}return new ae(d,h,u)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const e=new Se,n=this.index.array,r=this.attributes;for(const o in r){const c=r[o],l=t(c,n);e.setAttribute(o,l)}const s=this.morphAttributes;for(const o in s){const c=[],l=s[o];for(let h=0,u=l.length;h<u;h++){const d=l[h],f=t(d,n);c.push(f)}e.morphAttributes[o]=c}e.morphTargetsRelative=this.morphTargetsRelative;const a=this.groups;for(let o=0,c=a.length;o<c;o++){const l=a[o];e.addGroup(l.start,l.count,l.materialIndex)}return e}toJSON(){const t={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(t.uuid=this.uuid,t.type=this.type,this.name!==""&&(t.name=this.name),Object.keys(this.userData).length>0&&(t.userData=this.userData),this.parameters!==void 0){const c=this.parameters;for(const l in c)c[l]!==void 0&&(t[l]=c[l]);return t}t.data={attributes:{}};const e=this.index;e!==null&&(t.data.index={type:e.array.constructor.name,array:Array.prototype.slice.call(e.array)});const n=this.attributes;for(const c in n){const l=n[c];t.data.attributes[c]=l.toJSON(t.data)}const r={};let s=!1;for(const c in this.morphAttributes){const l=this.morphAttributes[c],h=[];for(let u=0,d=l.length;u<d;u++){const f=l[u];h.push(f.toJSON(t.data))}h.length>0&&(r[c]=h,s=!0)}s&&(t.data.morphAttributes=r,t.data.morphTargetsRelative=this.morphTargetsRelative);const a=this.groups;a.length>0&&(t.data.groups=JSON.parse(JSON.stringify(a)));const o=this.boundingSphere;return o!==null&&(t.data.boundingSphere=o.toJSON()),t}clone(){return new this.constructor().copy(this)}copy(t){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const e={};this.name=t.name;const n=t.index;n!==null&&this.setIndex(n.clone());const r=t.attributes;for(const l in r){const h=r[l];this.setAttribute(l,h.clone(e))}const s=t.morphAttributes;for(const l in s){const h=[],u=s[l];for(let d=0,f=u.length;d<f;d++)h.push(u[d].clone(e));this.morphAttributes[l]=h}this.morphTargetsRelative=t.morphTargetsRelative;const a=t.groups;for(let l=0,h=a.length;l<h;l++){const u=a[l];this.addGroup(u.start,u.count,u.materialIndex)}const o=t.boundingBox;o!==null&&(this.boundingBox=o.clone());const c=t.boundingSphere;return c!==null&&(this.boundingSphere=c.clone()),this.drawRange.start=t.drawRange.start,this.drawRange.count=t.drawRange.count,this.userData=t.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const xu=new ie,rr=new dh,$a=new Ar,_u=new N,ja=new N,Za=new N,Ja=new N,xc=new N,Ka=new N,Mu=new N,Qa=new N;class It extends Ce{constructor(t=new Se,e=new Qi){super(),this.isMesh=!0,this.type="Mesh",this.geometry=t,this.material=e,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),t.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=t.morphTargetInfluences.slice()),t.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},t.morphTargetDictionary)),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}updateMorphTargets(){const e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){const r=e[n[0]];if(r!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,a=r.length;s<a;s++){const o=r[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=s}}}}getVertexPosition(t,e){const n=this.geometry,r=n.attributes.position,s=n.morphAttributes.position,a=n.morphTargetsRelative;e.fromBufferAttribute(r,t);const o=this.morphTargetInfluences;if(s&&o){Ka.set(0,0,0);for(let c=0,l=s.length;c<l;c++){const h=o[c],u=s[c];h!==0&&(xc.fromBufferAttribute(u,t),a?Ka.addScaledVector(xc,h):Ka.addScaledVector(xc.sub(e),h))}e.add(Ka)}return e}raycast(t,e){const n=this.geometry,r=this.material,s=this.matrixWorld;r!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),$a.copy(n.boundingSphere),$a.applyMatrix4(s),rr.copy(t.ray).recast(t.near),!($a.containsPoint(rr.origin)===!1&&(rr.intersectSphere($a,_u)===null||rr.origin.distanceToSquared(_u)>(t.far-t.near)**2))&&(xu.copy(s).invert(),rr.copy(t.ray).applyMatrix4(xu),!(n.boundingBox!==null&&rr.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(t,e,rr)))}_computeIntersections(t,e,n){let r;const s=this.geometry,a=this.material,o=s.index,c=s.attributes.position,l=s.attributes.uv,h=s.attributes.uv1,u=s.attributes.normal,d=s.groups,f=s.drawRange;if(o!==null)if(Array.isArray(a))for(let g=0,v=d.length;g<v;g++){const m=d[g],p=a[m.materialIndex],y=Math.max(m.start,f.start),M=Math.min(o.count,Math.min(m.start+m.count,f.start+f.count));for(let b=y,w=M;b<w;b+=3){const T=o.getX(b),A=o.getX(b+1),R=o.getX(b+2);r=to(this,p,t,n,l,h,u,T,A,R),r&&(r.faceIndex=Math.floor(b/3),r.face.materialIndex=m.materialIndex,e.push(r))}}else{const g=Math.max(0,f.start),v=Math.min(o.count,f.start+f.count);for(let m=g,p=v;m<p;m+=3){const y=o.getX(m),M=o.getX(m+1),b=o.getX(m+2);r=to(this,a,t,n,l,h,u,y,M,b),r&&(r.faceIndex=Math.floor(m/3),e.push(r))}}else if(c!==void 0)if(Array.isArray(a))for(let g=0,v=d.length;g<v;g++){const m=d[g],p=a[m.materialIndex],y=Math.max(m.start,f.start),M=Math.min(c.count,Math.min(m.start+m.count,f.start+f.count));for(let b=y,w=M;b<w;b+=3){const T=b,A=b+1,R=b+2;r=to(this,p,t,n,l,h,u,T,A,R),r&&(r.faceIndex=Math.floor(b/3),r.face.materialIndex=m.materialIndex,e.push(r))}}else{const g=Math.max(0,f.start),v=Math.min(c.count,f.start+f.count);for(let m=g,p=v;m<p;m+=3){const y=m,M=m+1,b=m+2;r=to(this,a,t,n,l,h,u,y,M,b),r&&(r.faceIndex=Math.floor(m/3),e.push(r))}}}}function C1(i,t,e,n,r,s,a,o){let c;if(t.side===vn?c=n.intersectTriangle(a,s,r,!0,o):c=n.intersectTriangle(r,s,a,t.side===Ki,o),c===null)return null;Qa.copy(o),Qa.applyMatrix4(i.matrixWorld);const l=e.ray.origin.distanceTo(Qa);return l<e.near||l>e.far?null:{distance:l,point:Qa.clone(),object:i}}function to(i,t,e,n,r,s,a,o,c,l){i.getVertexPosition(o,ja),i.getVertexPosition(c,Za),i.getVertexPosition(l,Ja);const h=C1(i,t,e,n,ja,Za,Ja,Mu);if(h){const u=new N;Fn.getBarycoord(Mu,ja,Za,Ja,u),r&&(h.uv=Fn.getInterpolatedAttribute(r,o,c,l,u,new ft)),s&&(h.uv1=Fn.getInterpolatedAttribute(s,o,c,l,u,new ft)),a&&(h.normal=Fn.getInterpolatedAttribute(a,o,c,l,u,new N),h.normal.dot(n.direction)>0&&h.normal.multiplyScalar(-1));const d={a:o,b:c,c:l,normal:new N,materialIndex:0};Fn.getNormal(ja,Za,Ja,d.normal),h.face=d,h.barycoord=u}return h}class Ge extends Se{constructor(t=1,e=1,n=1,r=1,s=1,a=1){super(),this.type="BoxGeometry",this.parameters={width:t,height:e,depth:n,widthSegments:r,heightSegments:s,depthSegments:a};const o=this;r=Math.floor(r),s=Math.floor(s),a=Math.floor(a);const c=[],l=[],h=[],u=[];let d=0,f=0;g("z","y","x",-1,-1,n,e,t,a,s,0),g("z","y","x",1,-1,n,e,-t,a,s,1),g("x","z","y",1,1,t,n,e,r,a,2),g("x","z","y",1,-1,t,n,-e,r,a,3),g("x","y","z",1,-1,t,e,n,r,s,4),g("x","y","z",-1,-1,t,e,-n,r,s,5),this.setIndex(c),this.setAttribute("position",new se(l,3)),this.setAttribute("normal",new se(h,3)),this.setAttribute("uv",new se(u,2));function g(v,m,p,y,M,b,w,T,A,R,x){const _=b/A,S=w/R,E=b/2,P=w/2,L=T/2,I=A+1,B=R+1;let X=0,H=0;const it=new N;for(let lt=0;lt<B;lt++){const dt=lt*S-P;for(let vt=0;vt<I;vt++){const wt=vt*_-E;it[v]=wt*y,it[m]=dt*M,it[p]=L,l.push(it.x,it.y,it.z),it[v]=0,it[m]=0,it[p]=T>0?1:-1,h.push(it.x,it.y,it.z),u.push(vt/A),u.push(1-lt/R),X+=1}}for(let lt=0;lt<R;lt++)for(let dt=0;dt<A;dt++){const vt=d+dt+I*lt,wt=d+dt+I*(lt+1),Ft=d+(dt+1)+I*(lt+1),ot=d+(dt+1)+I*lt;c.push(vt,wt,ot),c.push(wt,Ft,ot),H+=6}o.addGroup(f,H,x),f+=H,d+=X}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Ge(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}}function Ps(i){const t={};for(const e in i){t[e]={};for(const n in i[e]){const r=i[e][n];r&&(r.isColor||r.isMatrix3||r.isMatrix4||r.isVector2||r.isVector3||r.isVector4||r.isTexture||r.isQuaternion)?r.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),t[e][n]=null):t[e][n]=r.clone():Array.isArray(r)?t[e][n]=r.slice():t[e][n]=r}}return t}function en(i){const t={};for(let e=0;e<i.length;e++){const n=Ps(i[e]);for(const r in n)t[r]=n[r]}return t}function L1(i){const t=[];for(let e=0;e<i.length;e++)t.push(i[e].clone());return t}function Ed(i){const t=i.getRenderTarget();return t===null?i.outputColorSpace:t.isXRRenderTarget===!0?t.texture.colorSpace:ce.workingColorSpace}const P1={clone:Ps,merge:en};var D1=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,I1=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class ze extends Rr{constructor(t){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=D1,this.fragmentShader=I1,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,t!==void 0&&this.setValues(t)}copy(t){return super.copy(t),this.fragmentShader=t.fragmentShader,this.vertexShader=t.vertexShader,this.uniforms=Ps(t.uniforms),this.uniformsGroups=L1(t.uniformsGroups),this.defines=Object.assign({},t.defines),this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.fog=t.fog,this.lights=t.lights,this.clipping=t.clipping,this.extensions=Object.assign({},t.extensions),this.glslVersion=t.glslVersion,this}toJSON(t){const e=super.toJSON(t);e.glslVersion=this.glslVersion,e.uniforms={};for(const r in this.uniforms){const a=this.uniforms[r].value;a&&a.isTexture?e.uniforms[r]={type:"t",value:a.toJSON(t).uuid}:a&&a.isColor?e.uniforms[r]={type:"c",value:a.getHex()}:a&&a.isVector2?e.uniforms[r]={type:"v2",value:a.toArray()}:a&&a.isVector3?e.uniforms[r]={type:"v3",value:a.toArray()}:a&&a.isVector4?e.uniforms[r]={type:"v4",value:a.toArray()}:a&&a.isMatrix3?e.uniforms[r]={type:"m3",value:a.toArray()}:a&&a.isMatrix4?e.uniforms[r]={type:"m4",value:a.toArray()}:e.uniforms[r]={value:a}}Object.keys(this.defines).length>0&&(e.defines=this.defines),e.vertexShader=this.vertexShader,e.fragmentShader=this.fragmentShader,e.lights=this.lights,e.clipping=this.clipping;const n={};for(const r in this.extensions)this.extensions[r]===!0&&(n[r]=!0);return Object.keys(n).length>0&&(e.extensions=n),e}}class Td extends Ce{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new ie,this.projectionMatrix=new ie,this.projectionMatrixInverse=new ie,this.coordinateSystem=hi,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(t,e){return super.copy(t,e),this.matrixWorldInverse.copy(t.matrixWorldInverse),this.projectionMatrix.copy(t.projectionMatrix),this.projectionMatrixInverse.copy(t.projectionMatrixInverse),this.coordinateSystem=t.coordinateSystem,this}getWorldDirection(t){return super.getWorldDirection(t).negate()}updateMatrixWorld(t){super.updateMatrixWorld(t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(t,e){super.updateWorldMatrix(t,e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}const ki=new N,yu=new ft,bu=new ft;class bn extends Td{constructor(t=50,e=1,n=.1,r=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=t,this.zoom=1,this.near=n,this.far=r,this.focus=10,this.aspect=e,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.fov=t.fov,this.zoom=t.zoom,this.near=t.near,this.far=t.far,this.focus=t.focus,this.aspect=t.aspect,this.view=t.view===null?null:Object.assign({},t.view),this.filmGauge=t.filmGauge,this.filmOffset=t.filmOffset,this}setFocalLength(t){const e=.5*this.getFilmHeight()/t;this.fov=Ls*2*Math.atan(e),this.updateProjectionMatrix()}getFocalLength(){const t=Math.tan(sa*.5*this.fov);return .5*this.getFilmHeight()/t}getEffectiveFOV(){return Ls*2*Math.atan(Math.tan(sa*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(t,e,n){ki.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),e.set(ki.x,ki.y).multiplyScalar(-t/ki.z),ki.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(ki.x,ki.y).multiplyScalar(-t/ki.z)}getViewSize(t,e){return this.getViewBounds(t,yu,bu),e.subVectors(bu,yu)}setViewOffset(t,e,n,r,s,a){this.aspect=t/e,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=r,this.view.width=s,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=this.near;let e=t*Math.tan(sa*.5*this.fov)/this.zoom,n=2*e,r=this.aspect*n,s=-.5*r;const a=this.view;if(this.view!==null&&this.view.enabled){const c=a.fullWidth,l=a.fullHeight;s+=a.offsetX*r/c,e-=a.offsetY*n/l,r*=a.width/c,n*=a.height/l}const o=this.filmOffset;o!==0&&(s+=t*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(s,s+r,e,e-n,t,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.fov=this.fov,e.object.zoom=this.zoom,e.object.near=this.near,e.object.far=this.far,e.object.focus=this.focus,e.object.aspect=this.aspect,this.view!==null&&(e.object.view=Object.assign({},this.view)),e.object.filmGauge=this.filmGauge,e.object.filmOffset=this.filmOffset,e}}const $r=-90,jr=1;class U1 extends Ce{constructor(t,e,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;const r=new bn($r,jr,t,e);r.layers=this.layers,this.add(r);const s=new bn($r,jr,t,e);s.layers=this.layers,this.add(s);const a=new bn($r,jr,t,e);a.layers=this.layers,this.add(a);const o=new bn($r,jr,t,e);o.layers=this.layers,this.add(o);const c=new bn($r,jr,t,e);c.layers=this.layers,this.add(c);const l=new bn($r,jr,t,e);l.layers=this.layers,this.add(l)}updateCoordinateSystem(){const t=this.coordinateSystem,e=this.children.concat(),[n,r,s,a,o,c]=e;for(const l of e)this.remove(l);if(t===hi)n.up.set(0,1,0),n.lookAt(1,0,0),r.up.set(0,1,0),r.lookAt(-1,0,0),s.up.set(0,0,-1),s.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),c.up.set(0,1,0),c.lookAt(0,0,-1);else if(t===Po)n.up.set(0,-1,0),n.lookAt(-1,0,0),r.up.set(0,-1,0),r.lookAt(1,0,0),s.up.set(0,0,1),s.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),c.up.set(0,-1,0),c.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+t);for(const l of e)this.add(l),l.updateMatrixWorld()}update(t,e){this.parent===null&&this.updateMatrixWorld();const{renderTarget:n,activeMipmapLevel:r}=this;this.coordinateSystem!==t.coordinateSystem&&(this.coordinateSystem=t.coordinateSystem,this.updateCoordinateSystem());const[s,a,o,c,l,h]=this.children,u=t.getRenderTarget(),d=t.getActiveCubeFace(),f=t.getActiveMipmapLevel(),g=t.xr.enabled;t.xr.enabled=!1;const v=n.texture.generateMipmaps;n.texture.generateMipmaps=!1,t.setRenderTarget(n,0,r),t.render(e,s),t.setRenderTarget(n,1,r),t.render(e,a),t.setRenderTarget(n,2,r),t.render(e,o),t.setRenderTarget(n,3,r),t.render(e,c),t.setRenderTarget(n,4,r),t.render(e,l),n.texture.generateMipmaps=v,t.setRenderTarget(n,5,r),t.render(e,h),t.setRenderTarget(u,d,f),t.xr.enabled=g,n.texture.needsPMREMUpdate=!0}}class Ad extends qe{constructor(t=[],e=As,n,r,s,a,o,c,l,h){super(t,e,n,r,s,a,o,c,l,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(t){this.image=t}}class N1 extends on{constructor(t=1,e={}){super(t,t,e),this.isWebGLCubeRenderTarget=!0;const n={width:t,height:t,depth:1},r=[n,n,n,n,n,n];this.texture=new Ad(r),this._setTextureOptions(e),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(t,e){this.texture.type=e.type,this.texture.colorSpace=e.colorSpace,this.texture.generateMipmaps=e.generateMipmaps,this.texture.minFilter=e.minFilter,this.texture.magFilter=e.magFilter;const n={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},r=new Ge(5,5,5),s=new ze({name:"CubemapFromEquirect",uniforms:Ps(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:vn,blending:ji});s.uniforms.tEquirect.value=e;const a=new It(r,s),o=e.minFilter;return e.minFilter===qi&&(e.minFilter=_e),new U1(1,10,this).update(t,a),e.minFilter=o,a.geometry.dispose(),a.material.dispose(),this}clear(t,e=!0,n=!0,r=!0){const s=t.getRenderTarget();for(let a=0;a<6;a++)t.setRenderTarget(this,a),t.clear(e,n,r);t.setRenderTarget(s)}}class He extends Ce{constructor(){super(),this.isGroup=!0,this.type="Group"}}const F1={type:"move"};class _c{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new He,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new He,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new N,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new N),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new He,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new N,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new N),this._grip}dispatchEvent(t){return this._targetRay!==null&&this._targetRay.dispatchEvent(t),this._grip!==null&&this._grip.dispatchEvent(t),this._hand!==null&&this._hand.dispatchEvent(t),this}connect(t){if(t&&t.hand){const e=this._hand;if(e)for(const n of t.hand.values())this._getHandJoint(e,n)}return this.dispatchEvent({type:"connected",data:t}),this}disconnect(t){return this.dispatchEvent({type:"disconnected",data:t}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(t,e,n){let r=null,s=null,a=null;const o=this._targetRay,c=this._grip,l=this._hand;if(t&&e.session.visibilityState!=="visible-blurred"){if(l&&t.hand){a=!0;for(const v of t.hand.values()){const m=e.getJointPose(v,n),p=this._getHandJoint(l,v);m!==null&&(p.matrix.fromArray(m.transform.matrix),p.matrix.decompose(p.position,p.rotation,p.scale),p.matrixWorldNeedsUpdate=!0,p.jointRadius=m.radius),p.visible=m!==null}const h=l.joints["index-finger-tip"],u=l.joints["thumb-tip"],d=h.position.distanceTo(u.position),f=.02,g=.005;l.inputState.pinching&&d>f+g?(l.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:t.handedness,target:this})):!l.inputState.pinching&&d<=f-g&&(l.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:t.handedness,target:this}))}else c!==null&&t.gripSpace&&(s=e.getPose(t.gripSpace,n),s!==null&&(c.matrix.fromArray(s.transform.matrix),c.matrix.decompose(c.position,c.rotation,c.scale),c.matrixWorldNeedsUpdate=!0,s.linearVelocity?(c.hasLinearVelocity=!0,c.linearVelocity.copy(s.linearVelocity)):c.hasLinearVelocity=!1,s.angularVelocity?(c.hasAngularVelocity=!0,c.angularVelocity.copy(s.angularVelocity)):c.hasAngularVelocity=!1));o!==null&&(r=e.getPose(t.targetRaySpace,n),r===null&&s!==null&&(r=s),r!==null&&(o.matrix.fromArray(r.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,r.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(r.linearVelocity)):o.hasLinearVelocity=!1,r.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(r.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(F1)))}return o!==null&&(o.visible=r!==null),c!==null&&(c.visible=s!==null),l!==null&&(l.visible=a!==null),this}_getHandJoint(t,e){if(t.joints[e.jointName]===void 0){const n=new He;n.matrixAutoUpdate=!1,n.visible=!1,t.joints[e.jointName]=n,t.add(n)}return t.joints[e.jointName]}}class Rd extends Ce{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new Bn,this.environmentIntensity=1,this.environmentRotation=new Bn,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(t,e){return super.copy(t,e),t.background!==null&&(this.background=t.background.clone()),t.environment!==null&&(this.environment=t.environment.clone()),t.fog!==null&&(this.fog=t.fog.clone()),this.backgroundBlurriness=t.backgroundBlurriness,this.backgroundIntensity=t.backgroundIntensity,this.backgroundRotation.copy(t.backgroundRotation),this.environmentIntensity=t.environmentIntensity,this.environmentRotation.copy(t.environmentRotation),t.overrideMaterial!==null&&(this.overrideMaterial=t.overrideMaterial.clone()),this.matrixAutoUpdate=t.matrixAutoUpdate,this}toJSON(t){const e=super.toJSON(t);return this.fog!==null&&(e.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(e.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(e.object.backgroundIntensity=this.backgroundIntensity),e.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(e.object.environmentIntensity=this.environmentIntensity),e.object.environmentRotation=this.environmentRotation.toArray(),e}}class O1{constructor(t,e){this.isInterleavedBuffer=!0,this.array=t,this.stride=e,this.count=t!==void 0?t.length/e:0,this.usage=Nl,this.updateRanges=[],this.version=0,this.uuid=Yn()}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.array=new t.array.constructor(t.array),this.count=t.count,this.stride=t.stride,this.usage=t.usage,this}copyAt(t,e,n){t*=this.stride,n*=e.stride;for(let r=0,s=this.stride;r<s;r++)this.array[t+r]=e.array[n+r];return this}set(t,e=0){return this.array.set(t,e),this}clone(t){t.arrayBuffers===void 0&&(t.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=Yn()),t.arrayBuffers[this.array.buffer._uuid]===void 0&&(t.arrayBuffers[this.array.buffer._uuid]=this.array.slice(0).buffer);const e=new this.array.constructor(t.arrayBuffers[this.array.buffer._uuid]),n=new this.constructor(e,this.stride);return n.setUsage(this.usage),n}onUpload(t){return this.onUploadCallback=t,this}toJSON(t){return t.arrayBuffers===void 0&&(t.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=Yn()),t.arrayBuffers[this.array.buffer._uuid]===void 0&&(t.arrayBuffers[this.array.buffer._uuid]=Array.from(new Uint32Array(this.array.buffer))),{uuid:this.uuid,buffer:this.array.buffer._uuid,type:this.array.constructor.name,stride:this.stride}}}const Ke=new N;class Io{constructor(t,e,n,r=!1){this.isInterleavedBufferAttribute=!0,this.name="",this.data=t,this.itemSize=e,this.offset=n,this.normalized=r}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(t){this.data.needsUpdate=t}applyMatrix4(t){for(let e=0,n=this.data.count;e<n;e++)Ke.fromBufferAttribute(this,e),Ke.applyMatrix4(t),this.setXYZ(e,Ke.x,Ke.y,Ke.z);return this}applyNormalMatrix(t){for(let e=0,n=this.count;e<n;e++)Ke.fromBufferAttribute(this,e),Ke.applyNormalMatrix(t),this.setXYZ(e,Ke.x,Ke.y,Ke.z);return this}transformDirection(t){for(let e=0,n=this.count;e<n;e++)Ke.fromBufferAttribute(this,e),Ke.transformDirection(t),this.setXYZ(e,Ke.x,Ke.y,Ke.z);return this}getComponent(t,e){let n=this.array[t*this.data.stride+this.offset+e];return this.normalized&&(n=Xn(n,this.array)),n}setComponent(t,e,n){return this.normalized&&(n=ue(n,this.array)),this.data.array[t*this.data.stride+this.offset+e]=n,this}setX(t,e){return this.normalized&&(e=ue(e,this.array)),this.data.array[t*this.data.stride+this.offset]=e,this}setY(t,e){return this.normalized&&(e=ue(e,this.array)),this.data.array[t*this.data.stride+this.offset+1]=e,this}setZ(t,e){return this.normalized&&(e=ue(e,this.array)),this.data.array[t*this.data.stride+this.offset+2]=e,this}setW(t,e){return this.normalized&&(e=ue(e,this.array)),this.data.array[t*this.data.stride+this.offset+3]=e,this}getX(t){let e=this.data.array[t*this.data.stride+this.offset];return this.normalized&&(e=Xn(e,this.array)),e}getY(t){let e=this.data.array[t*this.data.stride+this.offset+1];return this.normalized&&(e=Xn(e,this.array)),e}getZ(t){let e=this.data.array[t*this.data.stride+this.offset+2];return this.normalized&&(e=Xn(e,this.array)),e}getW(t){let e=this.data.array[t*this.data.stride+this.offset+3];return this.normalized&&(e=Xn(e,this.array)),e}setXY(t,e,n){return t=t*this.data.stride+this.offset,this.normalized&&(e=ue(e,this.array),n=ue(n,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=n,this}setXYZ(t,e,n,r){return t=t*this.data.stride+this.offset,this.normalized&&(e=ue(e,this.array),n=ue(n,this.array),r=ue(r,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=n,this.data.array[t+2]=r,this}setXYZW(t,e,n,r,s){return t=t*this.data.stride+this.offset,this.normalized&&(e=ue(e,this.array),n=ue(n,this.array),r=ue(r,this.array),s=ue(s,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=n,this.data.array[t+2]=r,this.data.array[t+3]=s,this}clone(t){if(t===void 0){console.log("THREE.InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.");const e=[];for(let n=0;n<this.count;n++){const r=n*this.data.stride+this.offset;for(let s=0;s<this.itemSize;s++)e.push(this.data.array[r+s])}return new ae(new this.array.constructor(e),this.itemSize,this.normalized)}else return t.interleavedBuffers===void 0&&(t.interleavedBuffers={}),t.interleavedBuffers[this.data.uuid]===void 0&&(t.interleavedBuffers[this.data.uuid]=this.data.clone(t)),new Io(t.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(t){if(t===void 0){console.log("THREE.InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.");const e=[];for(let n=0;n<this.count;n++){const r=n*this.data.stride+this.offset;for(let s=0;s<this.itemSize;s++)e.push(this.data.array[r+s])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:e,normalized:this.normalized}}else return t.interleavedBuffers===void 0&&(t.interleavedBuffers={}),t.interleavedBuffers[this.data.uuid]===void 0&&(t.interleavedBuffers[this.data.uuid]=this.data.toJSON(t)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}}class Cd extends Rr{constructor(t){super(),this.isSpriteMaterial=!0,this.type="SpriteMaterial",this.color=new Pt(16777215),this.map=null,this.alphaMap=null,this.rotation=0,this.sizeAttenuation=!0,this.transparent=!0,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.alphaMap=t.alphaMap,this.rotation=t.rotation,this.sizeAttenuation=t.sizeAttenuation,this.fog=t.fog,this}}let Zr;const Ys=new N,Jr=new N,Kr=new N,Qr=new ft,$s=new ft,Ld=new ie,eo=new N,js=new N,no=new N,Su=new ft,Mc=new ft,wu=new ft;class B1 extends Ce{constructor(t=new Cd){if(super(),this.isSprite=!0,this.type="Sprite",Zr===void 0){Zr=new Se;const e=new Float32Array([-.5,-.5,0,0,0,.5,-.5,0,1,0,.5,.5,0,1,1,-.5,.5,0,0,1]),n=new O1(e,5);Zr.setIndex([0,1,2,0,2,3]),Zr.setAttribute("position",new Io(n,3,0,!1)),Zr.setAttribute("uv",new Io(n,2,3,!1))}this.geometry=Zr,this.material=t,this.center=new ft(.5,.5),this.count=1}raycast(t,e){t.camera===null&&console.error('THREE.Sprite: "Raycaster.camera" needs to be set in order to raycast against sprites.'),Jr.setFromMatrixScale(this.matrixWorld),Ld.copy(t.camera.matrixWorld),this.modelViewMatrix.multiplyMatrices(t.camera.matrixWorldInverse,this.matrixWorld),Kr.setFromMatrixPosition(this.modelViewMatrix),t.camera.isPerspectiveCamera&&this.material.sizeAttenuation===!1&&Jr.multiplyScalar(-Kr.z);const n=this.material.rotation;let r,s;n!==0&&(s=Math.cos(n),r=Math.sin(n));const a=this.center;io(eo.set(-.5,-.5,0),Kr,a,Jr,r,s),io(js.set(.5,-.5,0),Kr,a,Jr,r,s),io(no.set(.5,.5,0),Kr,a,Jr,r,s),Su.set(0,0),Mc.set(1,0),wu.set(1,1);let o=t.ray.intersectTriangle(eo,js,no,!1,Ys);if(o===null&&(io(js.set(-.5,.5,0),Kr,a,Jr,r,s),Mc.set(0,1),o=t.ray.intersectTriangle(eo,no,js,!1,Ys),o===null))return;const c=t.ray.origin.distanceTo(Ys);c<t.near||c>t.far||e.push({distance:c,point:Ys.clone(),uv:Fn.getInterpolation(Ys,eo,js,no,Su,Mc,wu,new ft),face:null,object:this})}copy(t,e){return super.copy(t,e),t.center!==void 0&&this.center.copy(t.center),this.material=t.material,this}}function io(i,t,e,n,r,s){Qr.subVectors(i,e).addScalar(.5).multiply(n),r!==void 0?($s.x=s*Qr.x-r*Qr.y,$s.y=r*Qr.x+s*Qr.y):$s.copy(Qr),i.copy(t),i.x+=$s.x,i.y+=$s.y,i.applyMatrix4(Ld)}const Eu=new N,Tu=new le,Au=new le,k1=new N,Ru=new ie,ro=new N,yc=new Ar,Cu=new ie,bc=new dh;class Pd extends It{constructor(t,e){super(t,e),this.isSkinnedMesh=!0,this.type="SkinnedMesh",this.bindMode=nu,this.bindMatrix=new ie,this.bindMatrixInverse=new ie,this.boundingBox=null,this.boundingSphere=null}computeBoundingBox(){const t=this.geometry;this.boundingBox===null&&(this.boundingBox=new Fs),this.boundingBox.makeEmpty();const e=t.getAttribute("position");for(let n=0;n<e.count;n++)this.getVertexPosition(n,ro),this.boundingBox.expandByPoint(ro)}computeBoundingSphere(){const t=this.geometry;this.boundingSphere===null&&(this.boundingSphere=new Ar),this.boundingSphere.makeEmpty();const e=t.getAttribute("position");for(let n=0;n<e.count;n++)this.getVertexPosition(n,ro),this.boundingSphere.expandByPoint(ro)}copy(t,e){return super.copy(t,e),this.bindMode=t.bindMode,this.bindMatrix.copy(t.bindMatrix),this.bindMatrixInverse.copy(t.bindMatrixInverse),this.skeleton=t.skeleton,t.boundingBox!==null&&(this.boundingBox=t.boundingBox.clone()),t.boundingSphere!==null&&(this.boundingSphere=t.boundingSphere.clone()),this}raycast(t,e){const n=this.material,r=this.matrixWorld;n!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),yc.copy(this.boundingSphere),yc.applyMatrix4(r),t.ray.intersectsSphere(yc)!==!1&&(Cu.copy(r).invert(),bc.copy(t.ray).applyMatrix4(Cu),!(this.boundingBox!==null&&bc.intersectsBox(this.boundingBox)===!1)&&this._computeIntersections(t,e,bc)))}getVertexPosition(t,e){return super.getVertexPosition(t,e),this.applyBoneTransform(t,e),e}bind(t,e){this.skeleton=t,e===void 0&&(this.updateMatrixWorld(!0),this.skeleton.calculateInverses(),e=this.matrixWorld),this.bindMatrix.copy(e),this.bindMatrixInverse.copy(e).invert()}pose(){this.skeleton.pose()}normalizeSkinWeights(){const t=new le,e=this.geometry.attributes.skinWeight;for(let n=0,r=e.count;n<r;n++){t.fromBufferAttribute(e,n);const s=1/t.manhattanLength();s!==1/0?t.multiplyScalar(s):t.set(1,0,0,0),e.setXYZW(n,t.x,t.y,t.z,t.w)}}updateMatrixWorld(t){super.updateMatrixWorld(t),this.bindMode===nu?this.bindMatrixInverse.copy(this.matrixWorld).invert():this.bindMode===Ip?this.bindMatrixInverse.copy(this.bindMatrix).invert():console.warn("THREE.SkinnedMesh: Unrecognized bindMode: "+this.bindMode)}applyBoneTransform(t,e){const n=this.skeleton,r=this.geometry;Tu.fromBufferAttribute(r.attributes.skinIndex,t),Au.fromBufferAttribute(r.attributes.skinWeight,t),Eu.copy(e).applyMatrix4(this.bindMatrix),e.set(0,0,0);for(let s=0;s<4;s++){const a=Au.getComponent(s);if(a!==0){const o=Tu.getComponent(s);Ru.multiplyMatrices(n.bones[o].matrixWorld,n.boneInverses[o]),e.addScaledVector(k1.copy(Eu).applyMatrix4(Ru),a)}}return e.applyMatrix4(this.bindMatrixInverse)}}class Dd extends Ce{constructor(){super(),this.isBone=!0,this.type="Bone"}}class ys extends qe{constructor(t=null,e=1,n=1,r,s,a,o,c,l=An,h=An,u,d){super(null,a,o,c,l,h,r,s,u,d),this.isDataTexture=!0,this.image={data:t,width:e,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}const Lu=new ie,z1=new ie;class ph{constructor(t=[],e=[]){this.uuid=Yn(),this.bones=t.slice(0),this.boneInverses=e,this.boneMatrices=null,this.boneTexture=null,this.init()}init(){const t=this.bones,e=this.boneInverses;if(this.boneMatrices=new Float32Array(t.length*16),e.length===0)this.calculateInverses();else if(t.length!==e.length){console.warn("THREE.Skeleton: Number of inverse bone matrices does not match amount of bones."),this.boneInverses=[];for(let n=0,r=this.bones.length;n<r;n++)this.boneInverses.push(new ie)}}calculateInverses(){this.boneInverses.length=0;for(let t=0,e=this.bones.length;t<e;t++){const n=new ie;this.bones[t]&&n.copy(this.bones[t].matrixWorld).invert(),this.boneInverses.push(n)}}pose(){for(let t=0,e=this.bones.length;t<e;t++){const n=this.bones[t];n&&n.matrixWorld.copy(this.boneInverses[t]).invert()}for(let t=0,e=this.bones.length;t<e;t++){const n=this.bones[t];n&&(n.parent&&n.parent.isBone?(n.matrix.copy(n.parent.matrixWorld).invert(),n.matrix.multiply(n.matrixWorld)):n.matrix.copy(n.matrixWorld),n.matrix.decompose(n.position,n.quaternion,n.scale))}}update(){const t=this.bones,e=this.boneInverses,n=this.boneMatrices,r=this.boneTexture;for(let s=0,a=t.length;s<a;s++){const o=t[s]?t[s].matrixWorld:z1;Lu.multiplyMatrices(o,e[s]),Lu.toArray(n,s*16)}r!==null&&(r.needsUpdate=!0)}clone(){return new ph(this.bones,this.boneInverses)}computeBoneTexture(){let t=Math.sqrt(this.bones.length*4);t=Math.ceil(t/4)*4,t=Math.max(t,4);const e=new Float32Array(t*t*4);e.set(this.boneMatrices);const n=new ys(e,t,t,Xe,li);return n.needsUpdate=!0,this.boneMatrices=e,this.boneTexture=n,this}getBoneByName(t){for(let e=0,n=this.bones.length;e<n;e++){const r=this.bones[e];if(r.name===t)return r}}dispose(){this.boneTexture!==null&&(this.boneTexture.dispose(),this.boneTexture=null)}fromJSON(t,e){this.uuid=t.uuid;for(let n=0,r=t.bones.length;n<r;n++){const s=t.bones[n];let a=e[s];a===void 0&&(console.warn("THREE.Skeleton: No bone found with UUID:",s),a=new Dd),this.bones.push(a),this.boneInverses.push(new ie().fromArray(t.boneInverses[n]))}return this.init(),this}toJSON(){const t={metadata:{version:4.7,type:"Skeleton",generator:"Skeleton.toJSON"},bones:[],boneInverses:[]};t.uuid=this.uuid;const e=this.bones,n=this.boneInverses;for(let r=0,s=e.length;r<s;r++){const a=e[r];t.bones.push(a.uuid);const o=n[r];t.boneInverses.push(o.toArray())}return t}}const Sc=new N,H1=new N,V1=new te;class lr{constructor(t=new N(1,0,0),e=0){this.isPlane=!0,this.normal=t,this.constant=e}set(t,e){return this.normal.copy(t),this.constant=e,this}setComponents(t,e,n,r){return this.normal.set(t,e,n),this.constant=r,this}setFromNormalAndCoplanarPoint(t,e){return this.normal.copy(t),this.constant=-e.dot(this.normal),this}setFromCoplanarPoints(t,e,n){const r=Sc.subVectors(n,e).cross(H1.subVectors(t,e)).normalize();return this.setFromNormalAndCoplanarPoint(r,t),this}copy(t){return this.normal.copy(t.normal),this.constant=t.constant,this}normalize(){const t=1/this.normal.length();return this.normal.multiplyScalar(t),this.constant*=t,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(t){return this.normal.dot(t)+this.constant}distanceToSphere(t){return this.distanceToPoint(t.center)-t.radius}projectPoint(t,e){return e.copy(t).addScaledVector(this.normal,-this.distanceToPoint(t))}intersectLine(t,e){const n=t.delta(Sc),r=this.normal.dot(n);if(r===0)return this.distanceToPoint(t.start)===0?e.copy(t.start):null;const s=-(t.start.dot(this.normal)+this.constant)/r;return s<0||s>1?null:e.copy(t.start).addScaledVector(n,s)}intersectsLine(t){const e=this.distanceToPoint(t.start),n=this.distanceToPoint(t.end);return e<0&&n>0||n<0&&e>0}intersectsBox(t){return t.intersectsPlane(this)}intersectsSphere(t){return t.intersectsPlane(this)}coplanarPoint(t){return t.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(t,e){const n=e||V1.getNormalMatrix(t),r=this.coplanarPoint(Sc).applyMatrix4(t),s=this.normal.applyMatrix3(n).normalize();return this.constant=-r.dot(s),this}translate(t){return this.constant-=t.dot(this.normal),this}equals(t){return t.normal.equals(this.normal)&&t.constant===this.constant}clone(){return new this.constructor().copy(this)}}const sr=new Ar,G1=new ft(.5,.5),so=new N;class mh{constructor(t=new lr,e=new lr,n=new lr,r=new lr,s=new lr,a=new lr){this.planes=[t,e,n,r,s,a]}set(t,e,n,r,s,a){const o=this.planes;return o[0].copy(t),o[1].copy(e),o[2].copy(n),o[3].copy(r),o[4].copy(s),o[5].copy(a),this}copy(t){const e=this.planes;for(let n=0;n<6;n++)e[n].copy(t.planes[n]);return this}setFromProjectionMatrix(t,e=hi,n=!1){const r=this.planes,s=t.elements,a=s[0],o=s[1],c=s[2],l=s[3],h=s[4],u=s[5],d=s[6],f=s[7],g=s[8],v=s[9],m=s[10],p=s[11],y=s[12],M=s[13],b=s[14],w=s[15];if(r[0].setComponents(l-a,f-h,p-g,w-y).normalize(),r[1].setComponents(l+a,f+h,p+g,w+y).normalize(),r[2].setComponents(l+o,f+u,p+v,w+M).normalize(),r[3].setComponents(l-o,f-u,p-v,w-M).normalize(),n)r[4].setComponents(c,d,m,b).normalize(),r[5].setComponents(l-c,f-d,p-m,w-b).normalize();else if(r[4].setComponents(l-c,f-d,p-m,w-b).normalize(),e===hi)r[5].setComponents(l+c,f+d,p+m,w+b).normalize();else if(e===Po)r[5].setComponents(c,d,m,b).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+e);return this}intersectsObject(t){if(t.boundingSphere!==void 0)t.boundingSphere===null&&t.computeBoundingSphere(),sr.copy(t.boundingSphere).applyMatrix4(t.matrixWorld);else{const e=t.geometry;e.boundingSphere===null&&e.computeBoundingSphere(),sr.copy(e.boundingSphere).applyMatrix4(t.matrixWorld)}return this.intersectsSphere(sr)}intersectsSprite(t){sr.center.set(0,0,0);const e=G1.distanceTo(t.center);return sr.radius=.7071067811865476+e,sr.applyMatrix4(t.matrixWorld),this.intersectsSphere(sr)}intersectsSphere(t){const e=this.planes,n=t.center,r=-t.radius;for(let s=0;s<6;s++)if(e[s].distanceToPoint(n)<r)return!1;return!0}intersectsBox(t){const e=this.planes;for(let n=0;n<6;n++){const r=e[n];if(so.x=r.normal.x>0?t.max.x:t.min.x,so.y=r.normal.y>0?t.max.y:t.min.y,so.z=r.normal.z>0?t.max.z:t.min.z,r.distanceToPoint(so)<0)return!1}return!0}containsPoint(t){const e=this.planes;for(let n=0;n<6;n++)if(e[n].distanceToPoint(t)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}class W1 extends Rr{constructor(t){super(),this.isPointsMaterial=!0,this.type="PointsMaterial",this.color=new Pt(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.alphaMap=t.alphaMap,this.size=t.size,this.sizeAttenuation=t.sizeAttenuation,this.fog=t.fog,this}}const Pu=new ie,Fl=new dh,ao=new Ar,oo=new N;class X1 extends Ce{constructor(t=new Se,e=new W1){super(),this.isPoints=!0,this.type="Points",this.geometry=t,this.material=e,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}raycast(t,e){const n=this.geometry,r=this.matrixWorld,s=t.params.Points.threshold,a=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),ao.copy(n.boundingSphere),ao.applyMatrix4(r),ao.radius+=s,t.ray.intersectsSphere(ao)===!1)return;Pu.copy(r).invert(),Fl.copy(t.ray).applyMatrix4(Pu);const o=s/((this.scale.x+this.scale.y+this.scale.z)/3),c=o*o,l=n.index,u=n.attributes.position;if(l!==null){const d=Math.max(0,a.start),f=Math.min(l.count,a.start+a.count);for(let g=d,v=f;g<v;g++){const m=l.getX(g);oo.fromBufferAttribute(u,m),Du(oo,m,c,r,t,e,this)}}else{const d=Math.max(0,a.start),f=Math.min(u.count,a.start+a.count);for(let g=d,v=f;g<v;g++)oo.fromBufferAttribute(u,g),Du(oo,g,c,r,t,e,this)}}updateMorphTargets(){const e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){const r=e[n[0]];if(r!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,a=r.length;s<a;s++){const o=r[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=s}}}}}function Du(i,t,e,n,r,s,a){const o=Fl.distanceSqToPoint(i);if(o<e){const c=new N;Fl.closestPointToPoint(i,c),c.applyMatrix4(n);const l=r.ray.origin.distanceTo(c);if(l<r.near||l>r.far)return;s.push({distance:l,distanceToRay:Math.sqrt(o),point:c,index:t,face:null,faceIndex:null,barycoord:null,object:a})}}class q1 extends qe{constructor(t,e,n,r,s=_e,a=_e,o,c,l){super(t,e,n,r,s,a,o,c,l),this.isVideoTexture=!0,this.generateMipmaps=!1,this._requestVideoFrameCallbackId=0;const h=this;function u(){h.needsUpdate=!0,h._requestVideoFrameCallbackId=t.requestVideoFrameCallback(u)}"requestVideoFrameCallback"in t&&(this._requestVideoFrameCallbackId=t.requestVideoFrameCallback(u))}clone(){return new this.constructor(this.image).copy(this)}update(){const t=this.image;"requestVideoFrameCallback"in t===!1&&t.readyState>=t.HAVE_CURRENT_DATA&&(this.needsUpdate=!0)}dispose(){this._requestVideoFrameCallbackId!==0&&this.source.data.cancelVideoFrameCallback(this._requestVideoFrameCallbackId),super.dispose()}}class Ol extends qe{constructor(t,e,n,r,s,a,o,c,l){super(t,e,n,r,s,a,o,c,l),this.isCanvasTexture=!0,this.needsUpdate=!0}}class Id extends qe{constructor(t,e,n=yr,r,s,a,o=An,c=An,l,h=fa,u=1){if(h!==fa&&h!==da)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");const d={width:t,height:e,depth:u};super(d,r,s,a,o,c,h,n,l),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(t){return super.copy(t),this.source=new uh(Object.assign({},t.image)),this.compareFunction=t.compareFunction,this}toJSON(t){const e=super.toJSON(t);return this.compareFunction!==null&&(e.compareFunction=this.compareFunction),e}}class Ud extends qe{constructor(t=null){super(),this.sourceTexture=t,this.isExternalTexture=!0}copy(t){return super.copy(t),this.sourceTexture=t.sourceTexture,this}}class gh extends Se{constructor(t=1,e=1,n=4,r=8,s=1){super(),this.type="CapsuleGeometry",this.parameters={radius:t,height:e,capSegments:n,radialSegments:r,heightSegments:s},e=Math.max(0,e),n=Math.max(1,Math.floor(n)),r=Math.max(3,Math.floor(r)),s=Math.max(1,Math.floor(s));const a=[],o=[],c=[],l=[],h=e/2,u=Math.PI/2*t,d=e,f=2*u+d,g=n*2+s,v=r+1,m=new N,p=new N;for(let y=0;y<=g;y++){let M=0,b=0,w=0,T=0;if(y<=n){const x=y/n,_=x*Math.PI/2;b=-h-t*Math.cos(_),w=t*Math.sin(_),T=-t*Math.cos(_),M=x*u}else if(y<=n+s){const x=(y-n)/s;b=-h+x*e,w=t,T=0,M=u+x*d}else{const x=(y-n-s)/n,_=x*Math.PI/2;b=h+t*Math.sin(_),w=t*Math.cos(_),T=t*Math.sin(_),M=u+d+x*u}const A=Math.max(0,Math.min(1,M/f));let R=0;y===0?R=.5/r:y===g&&(R=-.5/r);for(let x=0;x<=r;x++){const _=x/r,S=_*Math.PI*2,E=Math.sin(S),P=Math.cos(S);p.x=-w*P,p.y=b,p.z=w*E,o.push(p.x,p.y,p.z),m.set(-w*P,T,w*E),m.normalize(),c.push(m.x,m.y,m.z),l.push(_+R,A)}if(y>0){const x=(y-1)*v;for(let _=0;_<r;_++){const S=x+_,E=x+_+1,P=y*v+_,L=y*v+_+1;a.push(S,E,P),a.push(E,L,P)}}}this.setIndex(a),this.setAttribute("position",new se(o,3)),this.setAttribute("normal",new se(c,3)),this.setAttribute("uv",new se(l,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new gh(t.radius,t.height,t.capSegments,t.radialSegments,t.heightSegments)}}class Os extends Se{constructor(t=1,e=32,n=0,r=Math.PI*2){super(),this.type="CircleGeometry",this.parameters={radius:t,segments:e,thetaStart:n,thetaLength:r},e=Math.max(3,e);const s=[],a=[],o=[],c=[],l=new N,h=new ft;a.push(0,0,0),o.push(0,0,1),c.push(.5,.5);for(let u=0,d=3;u<=e;u++,d+=3){const f=n+u/e*r;l.x=t*Math.cos(f),l.y=t*Math.sin(f),a.push(l.x,l.y,l.z),o.push(0,0,1),h.x=(a[d]/t+1)/2,h.y=(a[d+1]/t+1)/2,c.push(h.x,h.y)}for(let u=1;u<=e;u++)s.push(u,u+1,0);this.setIndex(s),this.setAttribute("position",new se(a,3)),this.setAttribute("normal",new se(o,3)),this.setAttribute("uv",new se(c,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Os(t.radius,t.segments,t.thetaStart,t.thetaLength)}}class pi extends Se{constructor(t=1,e=1,n=1,r=32,s=1,a=!1,o=0,c=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:t,radiusBottom:e,height:n,radialSegments:r,heightSegments:s,openEnded:a,thetaStart:o,thetaLength:c};const l=this;r=Math.floor(r),s=Math.floor(s);const h=[],u=[],d=[],f=[];let g=0;const v=[],m=n/2;let p=0;y(),a===!1&&(t>0&&M(!0),e>0&&M(!1)),this.setIndex(h),this.setAttribute("position",new se(u,3)),this.setAttribute("normal",new se(d,3)),this.setAttribute("uv",new se(f,2));function y(){const b=new N,w=new N;let T=0;const A=(e-t)/n;for(let R=0;R<=s;R++){const x=[],_=R/s,S=_*(e-t)+t;for(let E=0;E<=r;E++){const P=E/r,L=P*c+o,I=Math.sin(L),B=Math.cos(L);w.x=S*I,w.y=-_*n+m,w.z=S*B,u.push(w.x,w.y,w.z),b.set(I,A,B).normalize(),d.push(b.x,b.y,b.z),f.push(P,1-_),x.push(g++)}v.push(x)}for(let R=0;R<r;R++)for(let x=0;x<s;x++){const _=v[x][R],S=v[x+1][R],E=v[x+1][R+1],P=v[x][R+1];(t>0||x!==0)&&(h.push(_,S,P),T+=3),(e>0||x!==s-1)&&(h.push(S,E,P),T+=3)}l.addGroup(p,T,0),p+=T}function M(b){const w=g,T=new ft,A=new N;let R=0;const x=b===!0?t:e,_=b===!0?1:-1;for(let E=1;E<=r;E++)u.push(0,m*_,0),d.push(0,_,0),f.push(.5,.5),g++;const S=g;for(let E=0;E<=r;E++){const L=E/r*c+o,I=Math.cos(L),B=Math.sin(L);A.x=x*B,A.y=m*_,A.z=x*I,u.push(A.x,A.y,A.z),d.push(0,_,0),T.x=I*.5+.5,T.y=B*.5*_+.5,f.push(T.x,T.y),g++}for(let E=0;E<r;E++){const P=w+E,L=S+E;b===!0?h.push(L,L+1,P):h.push(L+1,L,P),R+=3}l.addGroup(p,R,b===!0?1:2),p+=R}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new pi(t.radiusTop,t.radiusBottom,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}}class Pa extends pi{constructor(t=1,e=1,n=32,r=1,s=!1,a=0,o=Math.PI*2){super(0,t,e,n,r,s,a,o),this.type="ConeGeometry",this.parameters={radius:t,height:e,radialSegments:n,heightSegments:r,openEnded:s,thetaStart:a,thetaLength:o}}static fromJSON(t){return new Pa(t.radius,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}}class gi{constructor(){this.type="Curve",this.arcLengthDivisions=200,this.needsUpdate=!1,this.cacheArcLengths=null}getPoint(){console.warn("THREE.Curve: .getPoint() not implemented.")}getPointAt(t,e){const n=this.getUtoTmapping(t);return this.getPoint(n,e)}getPoints(t=5){const e=[];for(let n=0;n<=t;n++)e.push(this.getPoint(n/t));return e}getSpacedPoints(t=5){const e=[];for(let n=0;n<=t;n++)e.push(this.getPointAt(n/t));return e}getLength(){const t=this.getLengths();return t[t.length-1]}getLengths(t=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===t+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;const e=[];let n,r=this.getPoint(0),s=0;e.push(0);for(let a=1;a<=t;a++)n=this.getPoint(a/t),s+=n.distanceTo(r),e.push(s),r=n;return this.cacheArcLengths=e,e}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(t,e=null){const n=this.getLengths();let r=0;const s=n.length;let a;e?a=e:a=t*n[s-1];let o=0,c=s-1,l;for(;o<=c;)if(r=Math.floor(o+(c-o)/2),l=n[r]-a,l<0)o=r+1;else if(l>0)c=r-1;else{c=r;break}if(r=c,n[r]===a)return r/(s-1);const h=n[r],d=n[r+1]-h,f=(a-h)/d;return(r+f)/(s-1)}getTangent(t,e){let r=t-1e-4,s=t+1e-4;r<0&&(r=0),s>1&&(s=1);const a=this.getPoint(r),o=this.getPoint(s),c=e||(a.isVector2?new ft:new N);return c.copy(o).sub(a).normalize(),c}getTangentAt(t,e){const n=this.getUtoTmapping(t);return this.getTangent(n,e)}computeFrenetFrames(t,e=!1){const n=new N,r=[],s=[],a=[],o=new N,c=new ie;for(let f=0;f<=t;f++){const g=f/t;r[f]=this.getTangentAt(g,new N)}s[0]=new N,a[0]=new N;let l=Number.MAX_VALUE;const h=Math.abs(r[0].x),u=Math.abs(r[0].y),d=Math.abs(r[0].z);h<=l&&(l=h,n.set(1,0,0)),u<=l&&(l=u,n.set(0,1,0)),d<=l&&n.set(0,0,1),o.crossVectors(r[0],n).normalize(),s[0].crossVectors(r[0],o),a[0].crossVectors(r[0],s[0]);for(let f=1;f<=t;f++){if(s[f]=s[f-1].clone(),a[f]=a[f-1].clone(),o.crossVectors(r[f-1],r[f]),o.length()>Number.EPSILON){o.normalize();const g=Math.acos(ne(r[f-1].dot(r[f]),-1,1));s[f].applyMatrix4(c.makeRotationAxis(o,g))}a[f].crossVectors(r[f],s[f])}if(e===!0){let f=Math.acos(ne(s[0].dot(s[t]),-1,1));f/=t,r[0].dot(o.crossVectors(s[0],s[t]))>0&&(f=-f);for(let g=1;g<=t;g++)s[g].applyMatrix4(c.makeRotationAxis(r[g],f*g)),a[g].crossVectors(r[g],s[g])}return{tangents:r,normals:s,binormals:a}}clone(){return new this.constructor().copy(this)}copy(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}toJSON(){const t={metadata:{version:4.7,type:"Curve",generator:"Curve.toJSON"}};return t.arcLengthDivisions=this.arcLengthDivisions,t.type=this.type,t}fromJSON(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}}class vh extends gi{constructor(t=0,e=0,n=1,r=1,s=0,a=Math.PI*2,o=!1,c=0){super(),this.isEllipseCurve=!0,this.type="EllipseCurve",this.aX=t,this.aY=e,this.xRadius=n,this.yRadius=r,this.aStartAngle=s,this.aEndAngle=a,this.aClockwise=o,this.aRotation=c}getPoint(t,e=new ft){const n=e,r=Math.PI*2;let s=this.aEndAngle-this.aStartAngle;const a=Math.abs(s)<Number.EPSILON;for(;s<0;)s+=r;for(;s>r;)s-=r;s<Number.EPSILON&&(a?s=0:s=r),this.aClockwise===!0&&!a&&(s===r?s=-r:s=s-r);const o=this.aStartAngle+t*s;let c=this.aX+this.xRadius*Math.cos(o),l=this.aY+this.yRadius*Math.sin(o);if(this.aRotation!==0){const h=Math.cos(this.aRotation),u=Math.sin(this.aRotation),d=c-this.aX,f=l-this.aY;c=d*h-f*u+this.aX,l=d*u+f*h+this.aY}return n.set(c,l)}copy(t){return super.copy(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}toJSON(){const t=super.toJSON();return t.aX=this.aX,t.aY=this.aY,t.xRadius=this.xRadius,t.yRadius=this.yRadius,t.aStartAngle=this.aStartAngle,t.aEndAngle=this.aEndAngle,t.aClockwise=this.aClockwise,t.aRotation=this.aRotation,t}fromJSON(t){return super.fromJSON(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}}class Y1 extends vh{constructor(t,e,n,r,s,a){super(t,e,n,n,r,s,a),this.isArcCurve=!0,this.type="ArcCurve"}}function xh(){let i=0,t=0,e=0,n=0;function r(s,a,o,c){i=s,t=o,e=-3*s+3*a-2*o-c,n=2*s-2*a+o+c}return{initCatmullRom:function(s,a,o,c,l){r(a,o,l*(o-s),l*(c-a))},initNonuniformCatmullRom:function(s,a,o,c,l,h,u){let d=(a-s)/l-(o-s)/(l+h)+(o-a)/h,f=(o-a)/h-(c-a)/(h+u)+(c-o)/u;d*=h,f*=h,r(a,o,d,f)},calc:function(s){const a=s*s,o=a*s;return i+t*s+e*a+n*o}}}const co=new N,wc=new xh,Ec=new xh,Tc=new xh;class fs extends gi{constructor(t=[],e=!1,n="centripetal",r=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=t,this.closed=e,this.curveType=n,this.tension=r}getPoint(t,e=new N){const n=e,r=this.points,s=r.length,a=(s-(this.closed?0:1))*t;let o=Math.floor(a),c=a-o;this.closed?o+=o>0?0:(Math.floor(Math.abs(o)/s)+1)*s:c===0&&o===s-1&&(o=s-2,c=1);let l,h;this.closed||o>0?l=r[(o-1)%s]:(co.subVectors(r[0],r[1]).add(r[0]),l=co);const u=r[o%s],d=r[(o+1)%s];if(this.closed||o+2<s?h=r[(o+2)%s]:(co.subVectors(r[s-1],r[s-2]).add(r[s-1]),h=co),this.curveType==="centripetal"||this.curveType==="chordal"){const f=this.curveType==="chordal"?.5:.25;let g=Math.pow(l.distanceToSquared(u),f),v=Math.pow(u.distanceToSquared(d),f),m=Math.pow(d.distanceToSquared(h),f);v<1e-4&&(v=1),g<1e-4&&(g=v),m<1e-4&&(m=v),wc.initNonuniformCatmullRom(l.x,u.x,d.x,h.x,g,v,m),Ec.initNonuniformCatmullRom(l.y,u.y,d.y,h.y,g,v,m),Tc.initNonuniformCatmullRom(l.z,u.z,d.z,h.z,g,v,m)}else this.curveType==="catmullrom"&&(wc.initCatmullRom(l.x,u.x,d.x,h.x,this.tension),Ec.initCatmullRom(l.y,u.y,d.y,h.y,this.tension),Tc.initCatmullRom(l.z,u.z,d.z,h.z,this.tension));return n.set(wc.calc(c),Ec.calc(c),Tc.calc(c)),n}copy(t){super.copy(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){const r=t.points[e];this.points.push(r.clone())}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}toJSON(){const t=super.toJSON();t.points=[];for(let e=0,n=this.points.length;e<n;e++){const r=this.points[e];t.points.push(r.toArray())}return t.closed=this.closed,t.curveType=this.curveType,t.tension=this.tension,t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){const r=t.points[e];this.points.push(new N().fromArray(r))}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}}function Iu(i,t,e,n,r){const s=(n-t)*.5,a=(r-e)*.5,o=i*i,c=i*o;return(2*e-2*n+s+a)*c+(-3*e+3*n-2*s-a)*o+s*i+e}function $1(i,t){const e=1-i;return e*e*t}function j1(i,t){return 2*(1-i)*i*t}function Z1(i,t){return i*i*t}function oa(i,t,e,n){return $1(i,t)+j1(i,e)+Z1(i,n)}function J1(i,t){const e=1-i;return e*e*e*t}function K1(i,t){const e=1-i;return 3*e*e*i*t}function Q1(i,t){return 3*(1-i)*i*i*t}function tm(i,t){return i*i*i*t}function ca(i,t,e,n,r){return J1(i,t)+K1(i,e)+Q1(i,n)+tm(i,r)}class Nd extends gi{constructor(t=new ft,e=new ft,n=new ft,r=new ft){super(),this.isCubicBezierCurve=!0,this.type="CubicBezierCurve",this.v0=t,this.v1=e,this.v2=n,this.v3=r}getPoint(t,e=new ft){const n=e,r=this.v0,s=this.v1,a=this.v2,o=this.v3;return n.set(ca(t,r.x,s.x,a.x,o.x),ca(t,r.y,s.y,a.y,o.y)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}}class em extends gi{constructor(t=new N,e=new N,n=new N,r=new N){super(),this.isCubicBezierCurve3=!0,this.type="CubicBezierCurve3",this.v0=t,this.v1=e,this.v2=n,this.v3=r}getPoint(t,e=new N){const n=e,r=this.v0,s=this.v1,a=this.v2,o=this.v3;return n.set(ca(t,r.x,s.x,a.x,o.x),ca(t,r.y,s.y,a.y,o.y),ca(t,r.z,s.z,a.z,o.z)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}}class Fd extends gi{constructor(t=new ft,e=new ft){super(),this.isLineCurve=!0,this.type="LineCurve",this.v1=t,this.v2=e}getPoint(t,e=new ft){const n=e;return t===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(t).add(this.v1)),n}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new ft){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class nm extends gi{constructor(t=new N,e=new N){super(),this.isLineCurve3=!0,this.type="LineCurve3",this.v1=t,this.v2=e}getPoint(t,e=new N){const n=e;return t===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(t).add(this.v1)),n}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new N){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class Od extends gi{constructor(t=new ft,e=new ft,n=new ft){super(),this.isQuadraticBezierCurve=!0,this.type="QuadraticBezierCurve",this.v0=t,this.v1=e,this.v2=n}getPoint(t,e=new ft){const n=e,r=this.v0,s=this.v1,a=this.v2;return n.set(oa(t,r.x,s.x,a.x),oa(t,r.y,s.y,a.y)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class Bd extends gi{constructor(t=new N,e=new N,n=new N){super(),this.isQuadraticBezierCurve3=!0,this.type="QuadraticBezierCurve3",this.v0=t,this.v1=e,this.v2=n}getPoint(t,e=new N){const n=e,r=this.v0,s=this.v1,a=this.v2;return n.set(oa(t,r.x,s.x,a.x),oa(t,r.y,s.y,a.y),oa(t,r.z,s.z,a.z)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class kd extends gi{constructor(t=[]){super(),this.isSplineCurve=!0,this.type="SplineCurve",this.points=t}getPoint(t,e=new ft){const n=e,r=this.points,s=(r.length-1)*t,a=Math.floor(s),o=s-a,c=r[a===0?a:a-1],l=r[a],h=r[a>r.length-2?r.length-1:a+1],u=r[a>r.length-3?r.length-1:a+2];return n.set(Iu(o,c.x,l.x,h.x,u.x),Iu(o,c.y,l.y,h.y,u.y)),n}copy(t){super.copy(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){const r=t.points[e];this.points.push(r.clone())}return this}toJSON(){const t=super.toJSON();t.points=[];for(let e=0,n=this.points.length;e<n;e++){const r=this.points[e];t.points.push(r.toArray())}return t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){const r=t.points[e];this.points.push(new ft().fromArray(r))}return this}}var Uo=Object.freeze({__proto__:null,ArcCurve:Y1,CatmullRomCurve3:fs,CubicBezierCurve:Nd,CubicBezierCurve3:em,EllipseCurve:vh,LineCurve:Fd,LineCurve3:nm,QuadraticBezierCurve:Od,QuadraticBezierCurve3:Bd,SplineCurve:kd});class im extends gi{constructor(){super(),this.type="CurvePath",this.curves=[],this.autoClose=!1}add(t){this.curves.push(t)}closePath(){const t=this.curves[0].getPoint(0),e=this.curves[this.curves.length-1].getPoint(1);if(!t.equals(e)){const n=t.isVector2===!0?"LineCurve":"LineCurve3";this.curves.push(new Uo[n](e,t))}return this}getPoint(t,e){const n=t*this.getLength(),r=this.getCurveLengths();let s=0;for(;s<r.length;){if(r[s]>=n){const a=r[s]-n,o=this.curves[s],c=o.getLength(),l=c===0?0:1-a/c;return o.getPointAt(l,e)}s++}return null}getLength(){const t=this.getCurveLengths();return t[t.length-1]}updateArcLengths(){this.needsUpdate=!0,this.cacheLengths=null,this.getCurveLengths()}getCurveLengths(){if(this.cacheLengths&&this.cacheLengths.length===this.curves.length)return this.cacheLengths;const t=[];let e=0;for(let n=0,r=this.curves.length;n<r;n++)e+=this.curves[n].getLength(),t.push(e);return this.cacheLengths=t,t}getSpacedPoints(t=40){const e=[];for(let n=0;n<=t;n++)e.push(this.getPoint(n/t));return this.autoClose&&e.push(e[0]),e}getPoints(t=12){const e=[];let n;for(let r=0,s=this.curves;r<s.length;r++){const a=s[r],o=a.isEllipseCurve?t*2:a.isLineCurve||a.isLineCurve3?1:a.isSplineCurve?t*a.points.length:t,c=a.getPoints(o);for(let l=0;l<c.length;l++){const h=c[l];n&&n.equals(h)||(e.push(h),n=h)}}return this.autoClose&&e.length>1&&!e[e.length-1].equals(e[0])&&e.push(e[0]),e}copy(t){super.copy(t),this.curves=[];for(let e=0,n=t.curves.length;e<n;e++){const r=t.curves[e];this.curves.push(r.clone())}return this.autoClose=t.autoClose,this}toJSON(){const t=super.toJSON();t.autoClose=this.autoClose,t.curves=[];for(let e=0,n=this.curves.length;e<n;e++){const r=this.curves[e];t.curves.push(r.toJSON())}return t}fromJSON(t){super.fromJSON(t),this.autoClose=t.autoClose,this.curves=[];for(let e=0,n=t.curves.length;e<n;e++){const r=t.curves[e];this.curves.push(new Uo[r.type]().fromJSON(r))}return this}}class Uu extends im{constructor(t){super(),this.type="Path",this.currentPoint=new ft,t&&this.setFromPoints(t)}setFromPoints(t){this.moveTo(t[0].x,t[0].y);for(let e=1,n=t.length;e<n;e++)this.lineTo(t[e].x,t[e].y);return this}moveTo(t,e){return this.currentPoint.set(t,e),this}lineTo(t,e){const n=new Fd(this.currentPoint.clone(),new ft(t,e));return this.curves.push(n),this.currentPoint.set(t,e),this}quadraticCurveTo(t,e,n,r){const s=new Od(this.currentPoint.clone(),new ft(t,e),new ft(n,r));return this.curves.push(s),this.currentPoint.set(n,r),this}bezierCurveTo(t,e,n,r,s,a){const o=new Nd(this.currentPoint.clone(),new ft(t,e),new ft(n,r),new ft(s,a));return this.curves.push(o),this.currentPoint.set(s,a),this}splineThru(t){const e=[this.currentPoint.clone()].concat(t),n=new kd(e);return this.curves.push(n),this.currentPoint.copy(t[t.length-1]),this}arc(t,e,n,r,s,a){const o=this.currentPoint.x,c=this.currentPoint.y;return this.absarc(t+o,e+c,n,r,s,a),this}absarc(t,e,n,r,s,a){return this.absellipse(t,e,n,n,r,s,a),this}ellipse(t,e,n,r,s,a,o,c){const l=this.currentPoint.x,h=this.currentPoint.y;return this.absellipse(t+l,e+h,n,r,s,a,o,c),this}absellipse(t,e,n,r,s,a,o,c){const l=new vh(t,e,n,r,s,a,o,c);if(this.curves.length>0){const u=l.getPoint(0);u.equals(this.currentPoint)||this.lineTo(u.x,u.y)}this.curves.push(l);const h=l.getPoint(1);return this.currentPoint.copy(h),this}copy(t){return super.copy(t),this.currentPoint.copy(t.currentPoint),this}toJSON(){const t=super.toJSON();return t.currentPoint=this.currentPoint.toArray(),t}fromJSON(t){return super.fromJSON(t),this.currentPoint.fromArray(t.currentPoint),this}}class zd extends Uu{constructor(t){super(t),this.uuid=Yn(),this.type="Shape",this.holes=[]}getPointsHoles(t){const e=[];for(let n=0,r=this.holes.length;n<r;n++)e[n]=this.holes[n].getPoints(t);return e}extractPoints(t){return{shape:this.getPoints(t),holes:this.getPointsHoles(t)}}copy(t){super.copy(t),this.holes=[];for(let e=0,n=t.holes.length;e<n;e++){const r=t.holes[e];this.holes.push(r.clone())}return this}toJSON(){const t=super.toJSON();t.uuid=this.uuid,t.holes=[];for(let e=0,n=this.holes.length;e<n;e++){const r=this.holes[e];t.holes.push(r.toJSON())}return t}fromJSON(t){super.fromJSON(t),this.uuid=t.uuid,this.holes=[];for(let e=0,n=t.holes.length;e<n;e++){const r=t.holes[e];this.holes.push(new Uu().fromJSON(r))}return this}}function rm(i,t,e=2){const n=t&&t.length,r=n?t[0]*e:i.length;let s=Hd(i,0,r,e,!0);const a=[];if(!s||s.next===s.prev)return a;let o,c,l;if(n&&(s=lm(i,t,s,e)),i.length>80*e){o=1/0,c=1/0;let h=-1/0,u=-1/0;for(let d=e;d<r;d+=e){const f=i[d],g=i[d+1];f<o&&(o=f),g<c&&(c=g),f>h&&(h=f),g>u&&(u=g)}l=Math.max(h-o,u-c),l=l!==0?32767/l:0}return ma(s,a,e,o,c,l,0),a}function Hd(i,t,e,n,r){let s;if(r===Mm(i,t,e,n)>0)for(let a=t;a<e;a+=n)s=Nu(a/n|0,i[a],i[a+1],s);else for(let a=e-n;a>=t;a-=n)s=Nu(a/n|0,i[a],i[a+1],s);return s&&Ds(s,s.next)&&(va(s),s=s.next),s}function Sr(i,t){if(!i)return i;t||(t=i);let e=i,n;do if(n=!1,!e.steiner&&(Ds(e,e.next)||Ae(e.prev,e,e.next)===0)){if(va(e),e=t=e.prev,e===e.next)break;n=!0}else e=e.next;while(n||e!==t);return t}function ma(i,t,e,n,r,s,a){if(!i)return;!a&&s&&pm(i,n,r,s);let o=i;for(;i.prev!==i.next;){const c=i.prev,l=i.next;if(s?am(i,n,r,s):sm(i)){t.push(c.i,i.i,l.i),va(i),i=l.next,o=l.next;continue}if(i=l,i===o){a?a===1?(i=om(Sr(i),t),ma(i,t,e,n,r,s,2)):a===2&&cm(i,t,e,n,r,s):ma(Sr(i),t,e,n,r,s,1);break}}}function sm(i){const t=i.prev,e=i,n=i.next;if(Ae(t,e,n)>=0)return!1;const r=t.x,s=e.x,a=n.x,o=t.y,c=e.y,l=n.y,h=Math.min(r,s,a),u=Math.min(o,c,l),d=Math.max(r,s,a),f=Math.max(o,c,l);let g=n.next;for(;g!==t;){if(g.x>=h&&g.x<=d&&g.y>=u&&g.y<=f&&ia(r,o,s,c,a,l,g.x,g.y)&&Ae(g.prev,g,g.next)>=0)return!1;g=g.next}return!0}function am(i,t,e,n){const r=i.prev,s=i,a=i.next;if(Ae(r,s,a)>=0)return!1;const o=r.x,c=s.x,l=a.x,h=r.y,u=s.y,d=a.y,f=Math.min(o,c,l),g=Math.min(h,u,d),v=Math.max(o,c,l),m=Math.max(h,u,d),p=Bl(f,g,t,e,n),y=Bl(v,m,t,e,n);let M=i.prevZ,b=i.nextZ;for(;M&&M.z>=p&&b&&b.z<=y;){if(M.x>=f&&M.x<=v&&M.y>=g&&M.y<=m&&M!==r&&M!==a&&ia(o,h,c,u,l,d,M.x,M.y)&&Ae(M.prev,M,M.next)>=0||(M=M.prevZ,b.x>=f&&b.x<=v&&b.y>=g&&b.y<=m&&b!==r&&b!==a&&ia(o,h,c,u,l,d,b.x,b.y)&&Ae(b.prev,b,b.next)>=0))return!1;b=b.nextZ}for(;M&&M.z>=p;){if(M.x>=f&&M.x<=v&&M.y>=g&&M.y<=m&&M!==r&&M!==a&&ia(o,h,c,u,l,d,M.x,M.y)&&Ae(M.prev,M,M.next)>=0)return!1;M=M.prevZ}for(;b&&b.z<=y;){if(b.x>=f&&b.x<=v&&b.y>=g&&b.y<=m&&b!==r&&b!==a&&ia(o,h,c,u,l,d,b.x,b.y)&&Ae(b.prev,b,b.next)>=0)return!1;b=b.nextZ}return!0}function om(i,t){let e=i;do{const n=e.prev,r=e.next.next;!Ds(n,r)&&Gd(n,e,e.next,r)&&ga(n,r)&&ga(r,n)&&(t.push(n.i,e.i,r.i),va(e),va(e.next),e=i=r),e=e.next}while(e!==i);return Sr(e)}function cm(i,t,e,n,r,s){let a=i;do{let o=a.next.next;for(;o!==a.prev;){if(a.i!==o.i&&vm(a,o)){let c=Wd(a,o);a=Sr(a,a.next),c=Sr(c,c.next),ma(a,t,e,n,r,s,0),ma(c,t,e,n,r,s,0);return}o=o.next}a=a.next}while(a!==i)}function lm(i,t,e,n){const r=[];for(let s=0,a=t.length;s<a;s++){const o=t[s]*n,c=s<a-1?t[s+1]*n:i.length,l=Hd(i,o,c,n,!1);l===l.next&&(l.steiner=!0),r.push(gm(l))}r.sort(hm);for(let s=0;s<r.length;s++)e=um(r[s],e);return e}function hm(i,t){let e=i.x-t.x;if(e===0&&(e=i.y-t.y,e===0)){const n=(i.next.y-i.y)/(i.next.x-i.x),r=(t.next.y-t.y)/(t.next.x-t.x);e=n-r}return e}function um(i,t){const e=fm(i,t);if(!e)return t;const n=Wd(e,i);return Sr(n,n.next),Sr(e,e.next)}function fm(i,t){let e=t;const n=i.x,r=i.y;let s=-1/0,a;if(Ds(i,e))return e;do{if(Ds(i,e.next))return e.next;if(r<=e.y&&r>=e.next.y&&e.next.y!==e.y){const u=e.x+(r-e.y)*(e.next.x-e.x)/(e.next.y-e.y);if(u<=n&&u>s&&(s=u,a=e.x<e.next.x?e:e.next,u===n))return a}e=e.next}while(e!==t);if(!a)return null;const o=a,c=a.x,l=a.y;let h=1/0;e=a;do{if(n>=e.x&&e.x>=c&&n!==e.x&&Vd(r<l?n:s,r,c,l,r<l?s:n,r,e.x,e.y)){const u=Math.abs(r-e.y)/(n-e.x);ga(e,i)&&(u<h||u===h&&(e.x>a.x||e.x===a.x&&dm(a,e)))&&(a=e,h=u)}e=e.next}while(e!==o);return a}function dm(i,t){return Ae(i.prev,i,t.prev)<0&&Ae(t.next,i,i.next)<0}function pm(i,t,e,n){let r=i;do r.z===0&&(r.z=Bl(r.x,r.y,t,e,n)),r.prevZ=r.prev,r.nextZ=r.next,r=r.next;while(r!==i);r.prevZ.nextZ=null,r.prevZ=null,mm(r)}function mm(i){let t,e=1;do{let n=i,r;i=null;let s=null;for(t=0;n;){t++;let a=n,o=0;for(let l=0;l<e&&(o++,a=a.nextZ,!!a);l++);let c=e;for(;o>0||c>0&&a;)o!==0&&(c===0||!a||n.z<=a.z)?(r=n,n=n.nextZ,o--):(r=a,a=a.nextZ,c--),s?s.nextZ=r:i=r,r.prevZ=s,s=r;n=a}s.nextZ=null,e*=2}while(t>1);return i}function Bl(i,t,e,n,r){return i=(i-e)*r|0,t=(t-n)*r|0,i=(i|i<<8)&16711935,i=(i|i<<4)&252645135,i=(i|i<<2)&858993459,i=(i|i<<1)&1431655765,t=(t|t<<8)&16711935,t=(t|t<<4)&252645135,t=(t|t<<2)&858993459,t=(t|t<<1)&1431655765,i|t<<1}function gm(i){let t=i,e=i;do(t.x<e.x||t.x===e.x&&t.y<e.y)&&(e=t),t=t.next;while(t!==i);return e}function Vd(i,t,e,n,r,s,a,o){return(r-a)*(t-o)>=(i-a)*(s-o)&&(i-a)*(n-o)>=(e-a)*(t-o)&&(e-a)*(s-o)>=(r-a)*(n-o)}function ia(i,t,e,n,r,s,a,o){return!(i===a&&t===o)&&Vd(i,t,e,n,r,s,a,o)}function vm(i,t){return i.next.i!==t.i&&i.prev.i!==t.i&&!xm(i,t)&&(ga(i,t)&&ga(t,i)&&_m(i,t)&&(Ae(i.prev,i,t.prev)||Ae(i,t.prev,t))||Ds(i,t)&&Ae(i.prev,i,i.next)>0&&Ae(t.prev,t,t.next)>0)}function Ae(i,t,e){return(t.y-i.y)*(e.x-t.x)-(t.x-i.x)*(e.y-t.y)}function Ds(i,t){return i.x===t.x&&i.y===t.y}function Gd(i,t,e,n){const r=ho(Ae(i,t,e)),s=ho(Ae(i,t,n)),a=ho(Ae(e,n,i)),o=ho(Ae(e,n,t));return!!(r!==s&&a!==o||r===0&&lo(i,e,t)||s===0&&lo(i,n,t)||a===0&&lo(e,i,n)||o===0&&lo(e,t,n))}function lo(i,t,e){return t.x<=Math.max(i.x,e.x)&&t.x>=Math.min(i.x,e.x)&&t.y<=Math.max(i.y,e.y)&&t.y>=Math.min(i.y,e.y)}function ho(i){return i>0?1:i<0?-1:0}function xm(i,t){let e=i;do{if(e.i!==i.i&&e.next.i!==i.i&&e.i!==t.i&&e.next.i!==t.i&&Gd(e,e.next,i,t))return!0;e=e.next}while(e!==i);return!1}function ga(i,t){return Ae(i.prev,i,i.next)<0?Ae(i,t,i.next)>=0&&Ae(i,i.prev,t)>=0:Ae(i,t,i.prev)<0||Ae(i,i.next,t)<0}function _m(i,t){let e=i,n=!1;const r=(i.x+t.x)/2,s=(i.y+t.y)/2;do e.y>s!=e.next.y>s&&e.next.y!==e.y&&r<(e.next.x-e.x)*(s-e.y)/(e.next.y-e.y)+e.x&&(n=!n),e=e.next;while(e!==i);return n}function Wd(i,t){const e=kl(i.i,i.x,i.y),n=kl(t.i,t.x,t.y),r=i.next,s=t.prev;return i.next=t,t.prev=i,e.next=r,r.prev=e,n.next=e,e.prev=n,s.next=n,n.prev=s,n}function Nu(i,t,e,n){const r=kl(i,t,e);return n?(r.next=n.next,r.prev=n,n.next.prev=r,n.next=r):(r.prev=r,r.next=r),r}function va(i){i.next.prev=i.prev,i.prev.next=i.next,i.prevZ&&(i.prevZ.nextZ=i.nextZ),i.nextZ&&(i.nextZ.prevZ=i.prevZ)}function kl(i,t,e){return{i,x:t,y:e,prev:null,next:null,z:0,prevZ:null,nextZ:null,steiner:!1}}function Mm(i,t,e,n){let r=0;for(let s=t,a=e-n;s<e;s+=n)r+=(i[a]-i[s])*(i[s+1]+i[a+1]),a=s;return r}class ym{static triangulate(t,e,n=2){return rm(t,e,n)}}class ds{static area(t){const e=t.length;let n=0;for(let r=e-1,s=0;s<e;r=s++)n+=t[r].x*t[s].y-t[s].x*t[r].y;return n*.5}static isClockWise(t){return ds.area(t)<0}static triangulateShape(t,e){const n=[],r=[],s=[];Fu(t),Ou(n,t);let a=t.length;e.forEach(Fu);for(let c=0;c<e.length;c++)r.push(a),a+=e[c].length,Ou(n,e[c]);const o=ym.triangulate(n,r);for(let c=0;c<o.length;c+=3)s.push(o.slice(c,c+3));return s}}function Fu(i){const t=i.length;t>2&&i[t-1].equals(i[0])&&i.pop()}function Ou(i,t){for(let e=0;e<t.length;e++)i.push(t[e].x),i.push(t[e].y)}class _h extends Se{constructor(t=new zd([new ft(.5,.5),new ft(-.5,.5),new ft(-.5,-.5),new ft(.5,-.5)]),e={}){super(),this.type="ExtrudeGeometry",this.parameters={shapes:t,options:e},t=Array.isArray(t)?t:[t];const n=this,r=[],s=[];for(let o=0,c=t.length;o<c;o++){const l=t[o];a(l)}this.setAttribute("position",new se(r,3)),this.setAttribute("uv",new se(s,2)),this.computeVertexNormals();function a(o){const c=[],l=e.curveSegments!==void 0?e.curveSegments:12,h=e.steps!==void 0?e.steps:1,u=e.depth!==void 0?e.depth:1;let d=e.bevelEnabled!==void 0?e.bevelEnabled:!0,f=e.bevelThickness!==void 0?e.bevelThickness:.2,g=e.bevelSize!==void 0?e.bevelSize:f-.1,v=e.bevelOffset!==void 0?e.bevelOffset:0,m=e.bevelSegments!==void 0?e.bevelSegments:3;const p=e.extrudePath,y=e.UVGenerator!==void 0?e.UVGenerator:bm;let M,b=!1,w,T,A,R;p&&(M=p.getSpacedPoints(h),b=!0,d=!1,w=p.computeFrenetFrames(h,!1),T=new N,A=new N,R=new N),d||(m=0,f=0,g=0,v=0);const x=o.extractPoints(l);let _=x.shape;const S=x.holes;if(!ds.isClockWise(_)){_=_.reverse();for(let J=0,j=S.length;J<j;J++){const Q=S[J];ds.isClockWise(Q)&&(S[J]=Q.reverse())}}function P(J){const Q=10000000000000001e-36;let st=J[0];for(let ut=1;ut<=J.length;ut++){const mt=ut%J.length,xt=J[mt],Jt=xt.x-st.x,$t=xt.y-st.y,F=Jt*Jt+$t*$t,C=Math.max(Math.abs(xt.x),Math.abs(xt.y),Math.abs(st.x),Math.abs(st.y)),$=Q*C*C;if(F<=$){J.splice(mt,1),ut--;continue}st=xt}}P(_),S.forEach(P);const L=S.length,I=_;for(let J=0;J<L;J++){const j=S[J];_=_.concat(j)}function B(J,j,Q){return j||console.error("THREE.ExtrudeGeometry: vec does not exist"),J.clone().addScaledVector(j,Q)}const X=_.length;function H(J,j,Q){let st,ut,mt;const xt=J.x-j.x,Jt=J.y-j.y,$t=Q.x-J.x,F=Q.y-J.y,C=xt*xt+Jt*Jt,$=xt*F-Jt*$t;if(Math.abs($)>Number.EPSILON){const at=Math.sqrt(C),gt=Math.sqrt($t*$t+F*F),ht=j.x-Jt/at,Ht=j.y+xt/at,Et=Q.x-F/gt,Bt=Q.y+$t/gt,kt=((Et-ht)*F-(Bt-Ht)*$t)/(xt*F-Jt*$t);st=ht+xt*kt-J.x,ut=Ht+Jt*kt-J.y;const _t=st*st+ut*ut;if(_t<=2)return new ft(st,ut);mt=Math.sqrt(_t/2)}else{let at=!1;xt>Number.EPSILON?$t>Number.EPSILON&&(at=!0):xt<-Number.EPSILON?$t<-Number.EPSILON&&(at=!0):Math.sign(Jt)===Math.sign(F)&&(at=!0),at?(st=-Jt,ut=xt,mt=Math.sqrt(C)):(st=xt,ut=Jt,mt=Math.sqrt(C/2))}return new ft(st/mt,ut/mt)}const it=[];for(let J=0,j=I.length,Q=j-1,st=J+1;J<j;J++,Q++,st++)Q===j&&(Q=0),st===j&&(st=0),it[J]=H(I[J],I[Q],I[st]);const lt=[];let dt,vt=it.concat();for(let J=0,j=L;J<j;J++){const Q=S[J];dt=[];for(let st=0,ut=Q.length,mt=ut-1,xt=st+1;st<ut;st++,mt++,xt++)mt===ut&&(mt=0),xt===ut&&(xt=0),dt[st]=H(Q[st],Q[mt],Q[xt]);lt.push(dt),vt=vt.concat(dt)}let wt;if(m===0)wt=ds.triangulateShape(I,S);else{const J=[],j=[];for(let Q=0;Q<m;Q++){const st=Q/m,ut=f*Math.cos(st*Math.PI/2),mt=g*Math.sin(st*Math.PI/2)+v;for(let xt=0,Jt=I.length;xt<Jt;xt++){const $t=B(I[xt],it[xt],mt);G($t.x,$t.y,-ut),st===0&&J.push($t)}for(let xt=0,Jt=L;xt<Jt;xt++){const $t=S[xt];dt=lt[xt];const F=[];for(let C=0,$=$t.length;C<$;C++){const at=B($t[C],dt[C],mt);G(at.x,at.y,-ut),st===0&&F.push(at)}st===0&&j.push(F)}}wt=ds.triangulateShape(J,j)}const Ft=wt.length,ot=g+v;for(let J=0;J<X;J++){const j=d?B(_[J],vt[J],ot):_[J];b?(A.copy(w.normals[0]).multiplyScalar(j.x),T.copy(w.binormals[0]).multiplyScalar(j.y),R.copy(M[0]).add(A).add(T),G(R.x,R.y,R.z)):G(j.x,j.y,0)}for(let J=1;J<=h;J++)for(let j=0;j<X;j++){const Q=d?B(_[j],vt[j],ot):_[j];b?(A.copy(w.normals[J]).multiplyScalar(Q.x),T.copy(w.binormals[J]).multiplyScalar(Q.y),R.copy(M[J]).add(A).add(T),G(R.x,R.y,R.z)):G(Q.x,Q.y,u/h*J)}for(let J=m-1;J>=0;J--){const j=J/m,Q=f*Math.cos(j*Math.PI/2),st=g*Math.sin(j*Math.PI/2)+v;for(let ut=0,mt=I.length;ut<mt;ut++){const xt=B(I[ut],it[ut],st);G(xt.x,xt.y,u+Q)}for(let ut=0,mt=S.length;ut<mt;ut++){const xt=S[ut];dt=lt[ut];for(let Jt=0,$t=xt.length;Jt<$t;Jt++){const F=B(xt[Jt],dt[Jt],st);b?G(F.x,F.y+M[h-1].y,M[h-1].x+Q):G(F.x,F.y,u+Q)}}}V(),Z();function V(){const J=r.length/3;if(d){let j=0,Q=X*j;for(let st=0;st<Ft;st++){const ut=wt[st];z(ut[2]+Q,ut[1]+Q,ut[0]+Q)}j=h+m*2,Q=X*j;for(let st=0;st<Ft;st++){const ut=wt[st];z(ut[0]+Q,ut[1]+Q,ut[2]+Q)}}else{for(let j=0;j<Ft;j++){const Q=wt[j];z(Q[2],Q[1],Q[0])}for(let j=0;j<Ft;j++){const Q=wt[j];z(Q[0]+X*h,Q[1]+X*h,Q[2]+X*h)}}n.addGroup(J,r.length/3-J,0)}function Z(){const J=r.length/3;let j=0;k(I,j),j+=I.length;for(let Q=0,st=S.length;Q<st;Q++){const ut=S[Q];k(ut,j),j+=ut.length}n.addGroup(J,r.length/3-J,1)}function k(J,j){let Q=J.length;for(;--Q>=0;){const st=Q;let ut=Q-1;ut<0&&(ut=J.length-1);for(let mt=0,xt=h+m*2;mt<xt;mt++){const Jt=X*mt,$t=X*(mt+1),F=j+st+Jt,C=j+ut+Jt,$=j+ut+$t,at=j+st+$t;K(F,C,$,at)}}}function G(J,j,Q){c.push(J),c.push(j),c.push(Q)}function z(J,j,Q){et(J),et(j),et(Q);const st=r.length/3,ut=y.generateTopUV(n,r,st-3,st-2,st-1);U(ut[0]),U(ut[1]),U(ut[2])}function K(J,j,Q,st){et(J),et(j),et(st),et(j),et(Q),et(st);const ut=r.length/3,mt=y.generateSideWallUV(n,r,ut-6,ut-3,ut-2,ut-1);U(mt[0]),U(mt[1]),U(mt[3]),U(mt[1]),U(mt[2]),U(mt[3])}function et(J){r.push(c[J*3+0]),r.push(c[J*3+1]),r.push(c[J*3+2])}function U(J){s.push(J.x),s.push(J.y)}}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}toJSON(){const t=super.toJSON(),e=this.parameters.shapes,n=this.parameters.options;return Sm(e,n,t)}static fromJSON(t,e){const n=[];for(let s=0,a=t.shapes.length;s<a;s++){const o=e[t.shapes[s]];n.push(o)}const r=t.options.extrudePath;return r!==void 0&&(t.options.extrudePath=new Uo[r.type]().fromJSON(r)),new _h(n,t.options)}}const bm={generateTopUV:function(i,t,e,n,r){const s=t[e*3],a=t[e*3+1],o=t[n*3],c=t[n*3+1],l=t[r*3],h=t[r*3+1];return[new ft(s,a),new ft(o,c),new ft(l,h)]},generateSideWallUV:function(i,t,e,n,r,s){const a=t[e*3],o=t[e*3+1],c=t[e*3+2],l=t[n*3],h=t[n*3+1],u=t[n*3+2],d=t[r*3],f=t[r*3+1],g=t[r*3+2],v=t[s*3],m=t[s*3+1],p=t[s*3+2];return Math.abs(o-h)<Math.abs(a-l)?[new ft(a,1-c),new ft(l,1-u),new ft(d,1-g),new ft(v,1-p)]:[new ft(o,1-c),new ft(h,1-u),new ft(f,1-g),new ft(m,1-p)]}};function Sm(i,t,e){if(e.shapes=[],Array.isArray(i))for(let n=0,r=i.length;n<r;n++){const s=i[n];e.shapes.push(s.uuid)}else e.shapes.push(i.uuid);return e.options=Object.assign({},t),t.extrudePath!==void 0&&(e.options.extrudePath=t.extrudePath.toJSON()),e}class Is extends Se{constructor(t=[new ft(0,-.5),new ft(.5,0),new ft(0,.5)],e=12,n=0,r=Math.PI*2){super(),this.type="LatheGeometry",this.parameters={points:t,segments:e,phiStart:n,phiLength:r},e=Math.floor(e),r=ne(r,0,Math.PI*2);const s=[],a=[],o=[],c=[],l=[],h=1/e,u=new N,d=new ft,f=new N,g=new N,v=new N;let m=0,p=0;for(let y=0;y<=t.length-1;y++)switch(y){case 0:m=t[y+1].x-t[y].x,p=t[y+1].y-t[y].y,f.x=p*1,f.y=-m,f.z=p*0,v.copy(f),f.normalize(),c.push(f.x,f.y,f.z);break;case t.length-1:c.push(v.x,v.y,v.z);break;default:m=t[y+1].x-t[y].x,p=t[y+1].y-t[y].y,f.x=p*1,f.y=-m,f.z=p*0,g.copy(f),f.x+=v.x,f.y+=v.y,f.z+=v.z,f.normalize(),c.push(f.x,f.y,f.z),v.copy(g)}for(let y=0;y<=e;y++){const M=n+y*h*r,b=Math.sin(M),w=Math.cos(M);for(let T=0;T<=t.length-1;T++){u.x=t[T].x*b,u.y=t[T].y,u.z=t[T].x*w,a.push(u.x,u.y,u.z),d.x=y/e,d.y=T/(t.length-1),o.push(d.x,d.y);const A=c[3*T+0]*b,R=c[3*T+1],x=c[3*T+0]*w;l.push(A,R,x)}}for(let y=0;y<e;y++)for(let M=0;M<t.length-1;M++){const b=M+y*t.length,w=b,T=b+t.length,A=b+t.length+1,R=b+1;s.push(w,T,R),s.push(A,R,T)}this.setIndex(s),this.setAttribute("position",new se(a,3)),this.setAttribute("uv",new se(o,2)),this.setAttribute("normal",new se(l,3))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Is(t.points,t.segments,t.phiStart,t.phiLength)}}class Pi extends Se{constructor(t=1,e=1,n=1,r=1){super(),this.type="PlaneGeometry",this.parameters={width:t,height:e,widthSegments:n,heightSegments:r};const s=t/2,a=e/2,o=Math.floor(n),c=Math.floor(r),l=o+1,h=c+1,u=t/o,d=e/c,f=[],g=[],v=[],m=[];for(let p=0;p<h;p++){const y=p*d-a;for(let M=0;M<l;M++){const b=M*u-s;g.push(b,-y,0),v.push(0,0,1),m.push(M/o),m.push(1-p/c)}}for(let p=0;p<c;p++)for(let y=0;y<o;y++){const M=y+l*p,b=y+l*(p+1),w=y+1+l*(p+1),T=y+1+l*p;f.push(M,b,T),f.push(b,w,T)}this.setIndex(f),this.setAttribute("position",new se(g,3)),this.setAttribute("normal",new se(v,3)),this.setAttribute("uv",new se(m,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Pi(t.width,t.height,t.widthSegments,t.heightSegments)}}class Mh extends Se{constructor(t=.5,e=1,n=32,r=1,s=0,a=Math.PI*2){super(),this.type="RingGeometry",this.parameters={innerRadius:t,outerRadius:e,thetaSegments:n,phiSegments:r,thetaStart:s,thetaLength:a},n=Math.max(3,n),r=Math.max(1,r);const o=[],c=[],l=[],h=[];let u=t;const d=(e-t)/r,f=new N,g=new ft;for(let v=0;v<=r;v++){for(let m=0;m<=n;m++){const p=s+m/n*a;f.x=u*Math.cos(p),f.y=u*Math.sin(p),c.push(f.x,f.y,f.z),l.push(0,0,1),g.x=(f.x/e+1)/2,g.y=(f.y/e+1)/2,h.push(g.x,g.y)}u+=d}for(let v=0;v<r;v++){const m=v*(n+1);for(let p=0;p<n;p++){const y=p+m,M=y,b=y+n+1,w=y+n+2,T=y+1;o.push(M,b,T),o.push(b,w,T)}}this.setIndex(o),this.setAttribute("position",new se(c,3)),this.setAttribute("normal",new se(l,3)),this.setAttribute("uv",new se(h,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Mh(t.innerRadius,t.outerRadius,t.thetaSegments,t.phiSegments,t.thetaStart,t.thetaLength)}}class Ne extends Se{constructor(t=1,e=32,n=16,r=0,s=Math.PI*2,a=0,o=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:t,widthSegments:e,heightSegments:n,phiStart:r,phiLength:s,thetaStart:a,thetaLength:o},e=Math.max(3,Math.floor(e)),n=Math.max(2,Math.floor(n));const c=Math.min(a+o,Math.PI);let l=0;const h=[],u=new N,d=new N,f=[],g=[],v=[],m=[];for(let p=0;p<=n;p++){const y=[],M=p/n;let b=0;p===0&&a===0?b=.5/e:p===n&&c===Math.PI&&(b=-.5/e);for(let w=0;w<=e;w++){const T=w/e;u.x=-t*Math.cos(r+T*s)*Math.sin(a+M*o),u.y=t*Math.cos(a+M*o),u.z=t*Math.sin(r+T*s)*Math.sin(a+M*o),g.push(u.x,u.y,u.z),d.copy(u).normalize(),v.push(d.x,d.y,d.z),m.push(T+b,1-M),y.push(l++)}h.push(y)}for(let p=0;p<n;p++)for(let y=0;y<e;y++){const M=h[p][y+1],b=h[p][y],w=h[p+1][y],T=h[p+1][y+1];(p!==0||a>0)&&f.push(M,b,T),(p!==n-1||c<Math.PI)&&f.push(b,w,T)}this.setIndex(f),this.setAttribute("position",new se(g,3)),this.setAttribute("normal",new se(v,3)),this.setAttribute("uv",new se(m,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Ne(t.radius,t.widthSegments,t.heightSegments,t.phiStart,t.phiLength,t.thetaStart,t.thetaLength)}}class bs extends Se{constructor(t=1,e=.4,n=12,r=48,s=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:t,tube:e,radialSegments:n,tubularSegments:r,arc:s},n=Math.floor(n),r=Math.floor(r);const a=[],o=[],c=[],l=[],h=new N,u=new N,d=new N;for(let f=0;f<=n;f++)for(let g=0;g<=r;g++){const v=g/r*s,m=f/n*Math.PI*2;u.x=(t+e*Math.cos(m))*Math.cos(v),u.y=(t+e*Math.cos(m))*Math.sin(v),u.z=e*Math.sin(m),o.push(u.x,u.y,u.z),h.x=t*Math.cos(v),h.y=t*Math.sin(v),d.subVectors(u,h).normalize(),c.push(d.x,d.y,d.z),l.push(g/r),l.push(f/n)}for(let f=1;f<=n;f++)for(let g=1;g<=r;g++){const v=(r+1)*f+g-1,m=(r+1)*(f-1)+g-1,p=(r+1)*(f-1)+g,y=(r+1)*f+g;a.push(v,m,y),a.push(m,p,y)}this.setIndex(a),this.setAttribute("position",new se(o,3)),this.setAttribute("normal",new se(c,3)),this.setAttribute("uv",new se(l,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new bs(t.radius,t.tube,t.radialSegments,t.tubularSegments,t.arc)}}class Xo extends Se{constructor(t=new Bd(new N(-1,-1,0),new N(-1,1,0),new N(1,1,0)),e=64,n=1,r=8,s=!1){super(),this.type="TubeGeometry",this.parameters={path:t,tubularSegments:e,radius:n,radialSegments:r,closed:s};const a=t.computeFrenetFrames(e,s);this.tangents=a.tangents,this.normals=a.normals,this.binormals=a.binormals;const o=new N,c=new N,l=new ft;let h=new N;const u=[],d=[],f=[],g=[];v(),this.setIndex(g),this.setAttribute("position",new se(u,3)),this.setAttribute("normal",new se(d,3)),this.setAttribute("uv",new se(f,2));function v(){for(let M=0;M<e;M++)m(M);m(s===!1?e:0),y(),p()}function m(M){h=t.getPointAt(M/e,h);const b=a.normals[M],w=a.binormals[M];for(let T=0;T<=r;T++){const A=T/r*Math.PI*2,R=Math.sin(A),x=-Math.cos(A);c.x=x*b.x+R*w.x,c.y=x*b.y+R*w.y,c.z=x*b.z+R*w.z,c.normalize(),d.push(c.x,c.y,c.z),o.x=h.x+n*c.x,o.y=h.y+n*c.y,o.z=h.z+n*c.z,u.push(o.x,o.y,o.z)}}function p(){for(let M=1;M<=e;M++)for(let b=1;b<=r;b++){const w=(r+1)*(M-1)+(b-1),T=(r+1)*M+(b-1),A=(r+1)*M+b,R=(r+1)*(M-1)+b;g.push(w,T,R),g.push(T,A,R)}}function y(){for(let M=0;M<=e;M++)for(let b=0;b<=r;b++)l.x=M/e,l.y=b/r,f.push(l.x,l.y)}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}toJSON(){const t=super.toJSON();return t.path=this.parameters.path.toJSON(),t}static fromJSON(t){return new Xo(new Uo[t.path.type]().fromJSON(t.path),t.tubularSegments,t.radius,t.radialSegments,t.closed)}}class ui extends Rr{constructor(t){super(),this.isMeshStandardMaterial=!0,this.type="MeshStandardMaterial",this.defines={STANDARD:""},this.color=new Pt(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Pt(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=xd,this.normalScale=new ft(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Bn,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.defines={STANDARD:""},this.color.copy(t.color),this.roughness=t.roughness,this.metalness=t.metalness,this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.emissive.copy(t.emissive),this.emissiveMap=t.emissiveMap,this.emissiveIntensity=t.emissiveIntensity,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.roughnessMap=t.roughnessMap,this.metalnessMap=t.metalnessMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.envMapIntensity=t.envMapIntensity,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.flatShading=t.flatShading,this.fog=t.fog,this}}class wm extends Rr{constructor(t){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=Np,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(t)}copy(t){return super.copy(t),this.depthPacking=t.depthPacking,this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this}}class Em extends Rr{constructor(t){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(t)}copy(t){return super.copy(t),this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this}}class yh extends Ce{constructor(t,e=1){super(),this.isLight=!0,this.type="Light",this.color=new Pt(t),this.intensity=e}dispose(){}copy(t,e){return super.copy(t,e),this.color.copy(t.color),this.intensity=t.intensity,this}toJSON(t){const e=super.toJSON(t);return e.object.color=this.color.getHex(),e.object.intensity=this.intensity,this.groundColor!==void 0&&(e.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(e.object.distance=this.distance),this.angle!==void 0&&(e.object.angle=this.angle),this.decay!==void 0&&(e.object.decay=this.decay),this.penumbra!==void 0&&(e.object.penumbra=this.penumbra),this.shadow!==void 0&&(e.object.shadow=this.shadow.toJSON()),this.target!==void 0&&(e.object.target=this.target.uuid),e}}class Tm extends yh{constructor(t,e,n){super(t,n),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(Ce.DEFAULT_UP),this.updateMatrix(),this.groundColor=new Pt(e)}copy(t,e){return super.copy(t,e),this.groundColor.copy(t.groundColor),this}}const Ac=new ie,Bu=new N,ku=new N;class Xd{constructor(t){this.camera=t,this.intensity=1,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new ft(512,512),this.mapType=Jn,this.map=null,this.mapPass=null,this.matrix=new ie,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new mh,this._frameExtents=new ft(1,1),this._viewportCount=1,this._viewports=[new le(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(t){const e=this.camera,n=this.matrix;Bu.setFromMatrixPosition(t.matrixWorld),e.position.copy(Bu),ku.setFromMatrixPosition(t.target.matrixWorld),e.lookAt(ku),e.updateMatrixWorld(),Ac.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Ac,e.coordinateSystem,e.reversedDepth),e.reversedDepth?n.set(.5,0,0,.5,0,.5,0,.5,0,0,1,0,0,0,0,1):n.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),n.multiply(Ac)}getViewport(t){return this._viewports[t]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(t){return this.camera=t.camera.clone(),this.intensity=t.intensity,this.bias=t.bias,this.radius=t.radius,this.autoUpdate=t.autoUpdate,this.needsUpdate=t.needsUpdate,this.normalBias=t.normalBias,this.blurSamples=t.blurSamples,this.mapSize.copy(t.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){const t={};return this.intensity!==1&&(t.intensity=this.intensity),this.bias!==0&&(t.bias=this.bias),this.normalBias!==0&&(t.normalBias=this.normalBias),this.radius!==1&&(t.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(t.mapSize=this.mapSize.toArray()),t.camera=this.camera.toJSON(!1).object,delete t.camera.matrix,t}}class Am extends Xd{constructor(){super(new bn(50,1,.5,500)),this.isSpotLightShadow=!0,this.focus=1,this.aspect=1}updateMatrices(t){const e=this.camera,n=Ls*2*t.angle*this.focus,r=this.mapSize.width/this.mapSize.height*this.aspect,s=t.distance||e.far;(n!==e.fov||r!==e.aspect||s!==e.far)&&(e.fov=n,e.aspect=r,e.far=s,e.updateProjectionMatrix()),super.updateMatrices(t)}copy(t){return super.copy(t),this.focus=t.focus,this}}class Rm extends yh{constructor(t,e,n=0,r=Math.PI/3,s=0,a=2){super(t,e),this.isSpotLight=!0,this.type="SpotLight",this.position.copy(Ce.DEFAULT_UP),this.updateMatrix(),this.target=new Ce,this.distance=n,this.angle=r,this.penumbra=s,this.decay=a,this.map=null,this.shadow=new Am}get power(){return this.intensity*Math.PI}set power(t){this.intensity=t/Math.PI}dispose(){this.shadow.dispose()}copy(t,e){return super.copy(t,e),this.distance=t.distance,this.angle=t.angle,this.penumbra=t.penumbra,this.decay=t.decay,this.target=t.target.clone(),this.shadow=t.shadow.clone(),this}}class bh extends Td{constructor(t=-1,e=1,n=1,r=-1,s=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=t,this.right=e,this.top=n,this.bottom=r,this.near=s,this.far=a,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.left=t.left,this.right=t.right,this.top=t.top,this.bottom=t.bottom,this.near=t.near,this.far=t.far,this.zoom=t.zoom,this.view=t.view===null?null:Object.assign({},t.view),this}setViewOffset(t,e,n,r,s,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=r,this.view.width=s,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=(this.right-this.left)/(2*this.zoom),e=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,r=(this.top+this.bottom)/2;let s=n-t,a=n+t,o=r+e,c=r-e;if(this.view!==null&&this.view.enabled){const l=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;s+=l*this.view.offsetX,a=s+l*this.view.width,o-=h*this.view.offsetY,c=o-h*this.view.height}this.projectionMatrix.makeOrthographic(s,a,o,c,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.zoom=this.zoom,e.object.left=this.left,e.object.right=this.right,e.object.top=this.top,e.object.bottom=this.bottom,e.object.near=this.near,e.object.far=this.far,this.view!==null&&(e.object.view=Object.assign({},this.view)),e}}class Cm extends Xd{constructor(){super(new bh(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class zl extends yh{constructor(t,e){super(t,e),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(Ce.DEFAULT_UP),this.updateMatrix(),this.target=new Ce,this.shadow=new Cm}dispose(){this.shadow.dispose()}copy(t){return super.copy(t),this.target=t.target.clone(),this.shadow=t.shadow.clone(),this}}class Lm extends bn{constructor(t=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=t}}function zu(i,t,e,n){const r=Pm(n);switch(e){case pd:return i*t;case gd:return i*t/r.components*r.byteLength;case oh:return i*t/r.components*r.byteLength;case vd:return i*t*2/r.components*r.byteLength;case ch:return i*t*2/r.components*r.byteLength;case md:return i*t*3/r.components*r.byteLength;case Xe:return i*t*4/r.components*r.byteLength;case lh:return i*t*4/r.components*r.byteLength;case bo:case So:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*8;case wo:case Eo:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*16;case cl:case hl:return Math.max(i,16)*Math.max(t,8)/4;case ol:case ll:return Math.max(i,8)*Math.max(t,8)/2;case ul:case fl:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*8;case dl:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*16;case pl:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*16;case ml:return Math.floor((i+4)/5)*Math.floor((t+3)/4)*16;case gl:return Math.floor((i+4)/5)*Math.floor((t+4)/5)*16;case vl:return Math.floor((i+5)/6)*Math.floor((t+4)/5)*16;case xl:return Math.floor((i+5)/6)*Math.floor((t+5)/6)*16;case _l:return Math.floor((i+7)/8)*Math.floor((t+4)/5)*16;case Ml:return Math.floor((i+7)/8)*Math.floor((t+5)/6)*16;case yl:return Math.floor((i+7)/8)*Math.floor((t+7)/8)*16;case bl:return Math.floor((i+9)/10)*Math.floor((t+4)/5)*16;case Sl:return Math.floor((i+9)/10)*Math.floor((t+5)/6)*16;case wl:return Math.floor((i+9)/10)*Math.floor((t+7)/8)*16;case El:return Math.floor((i+9)/10)*Math.floor((t+9)/10)*16;case Tl:return Math.floor((i+11)/12)*Math.floor((t+9)/10)*16;case Al:return Math.floor((i+11)/12)*Math.floor((t+11)/12)*16;case Rl:case Cl:case Ll:return Math.ceil(i/4)*Math.ceil(t/4)*16;case Pl:case Dl:return Math.ceil(i/4)*Math.ceil(t/4)*8;case Il:case Ul:return Math.ceil(i/4)*Math.ceil(t/4)*16}throw new Error(`Unable to determine texture byte length for ${e} format.`)}function Pm(i){switch(i){case Jn:case hd:return{byteLength:1,components:1};case ha:case ud:case Tr:return{byteLength:2,components:1};case sh:case ah:return{byteLength:2,components:4};case yr:case rh:case li:return{byteLength:4,components:1};case fd:case dd:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${i}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:ih}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=ih);/**
 * @license
 * Copyright 2010-2025 Three.js Authors
 * SPDX-License-Identifier: MIT
 */function qd(){let i=null,t=!1,e=null,n=null;function r(s,a){e(s,a),n=i.requestAnimationFrame(r)}return{start:function(){t!==!0&&e!==null&&(n=i.requestAnimationFrame(r),t=!0)},stop:function(){i.cancelAnimationFrame(n),t=!1},setAnimationLoop:function(s){e=s},setContext:function(s){i=s}}}function Dm(i){const t=new WeakMap;function e(o,c){const l=o.array,h=o.usage,u=l.byteLength,d=i.createBuffer();i.bindBuffer(c,d),i.bufferData(c,l,h),o.onUploadCallback();let f;if(l instanceof Float32Array)f=i.FLOAT;else if(typeof Float16Array<"u"&&l instanceof Float16Array)f=i.HALF_FLOAT;else if(l instanceof Uint16Array)o.isFloat16BufferAttribute?f=i.HALF_FLOAT:f=i.UNSIGNED_SHORT;else if(l instanceof Int16Array)f=i.SHORT;else if(l instanceof Uint32Array)f=i.UNSIGNED_INT;else if(l instanceof Int32Array)f=i.INT;else if(l instanceof Int8Array)f=i.BYTE;else if(l instanceof Uint8Array)f=i.UNSIGNED_BYTE;else if(l instanceof Uint8ClampedArray)f=i.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+l);return{buffer:d,type:f,bytesPerElement:l.BYTES_PER_ELEMENT,version:o.version,size:u}}function n(o,c,l){const h=c.array,u=c.updateRanges;if(i.bindBuffer(l,o),u.length===0)i.bufferSubData(l,0,h);else{u.sort((f,g)=>f.start-g.start);let d=0;for(let f=1;f<u.length;f++){const g=u[d],v=u[f];v.start<=g.start+g.count+1?g.count=Math.max(g.count,v.start+v.count-g.start):(++d,u[d]=v)}u.length=d+1;for(let f=0,g=u.length;f<g;f++){const v=u[f];i.bufferSubData(l,v.start*h.BYTES_PER_ELEMENT,h,v.start,v.count)}c.clearUpdateRanges()}c.onUploadCallback()}function r(o){return o.isInterleavedBufferAttribute&&(o=o.data),t.get(o)}function s(o){o.isInterleavedBufferAttribute&&(o=o.data);const c=t.get(o);c&&(i.deleteBuffer(c.buffer),t.delete(o))}function a(o,c){if(o.isInterleavedBufferAttribute&&(o=o.data),o.isGLBufferAttribute){const h=t.get(o);(!h||h.version<o.version)&&t.set(o,{buffer:o.buffer,type:o.type,bytesPerElement:o.elementSize,version:o.version});return}const l=t.get(o);if(l===void 0)t.set(o,e(o,c));else if(l.version<o.version){if(l.size!==o.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");n(l.buffer,o,c),l.version=o.version}}return{get:r,remove:s,update:a}}var Im=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,Um=`#ifdef USE_ALPHAHASH
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
#endif`,Nm=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,Fm=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Om=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,Bm=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,km=`#ifdef USE_AOMAP
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
#endif`,zm=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,Hm=`#ifdef USE_BATCHING
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
#endif`,Vm=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,Gm=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,Wm=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,Xm=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,qm=`#ifdef USE_IRIDESCENCE
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
#endif`,Ym=`#ifdef USE_BUMPMAP
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
#endif`,$m=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,jm=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,Zm=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,Jm=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,Km=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,Qm=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,tg=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,eg=`#if defined( USE_COLOR_ALPHA )
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
#endif`,ng=`#define PI 3.141592653589793
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
} // validated`,ig=`#ifdef ENVMAP_TYPE_CUBE_UV
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
#endif`,rg=`vec3 transformedNormal = objectNormal;
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
#endif`,sg=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,ag=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,og=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,cg=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,lg="gl_FragColor = linearToOutputTexel( gl_FragColor );",hg=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,ug=`#ifdef USE_ENVMAP
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
#endif`,fg=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,dg=`#ifdef USE_ENVMAP
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
#endif`,pg=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,mg=`#ifdef USE_ENVMAP
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
#endif`,gg=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,vg=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,xg=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,_g=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,Mg=`#ifdef USE_GRADIENTMAP
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
}`,yg=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,bg=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,Sg=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,wg=`uniform bool receiveShadow;
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
#endif`,Eg=`#ifdef USE_ENVMAP
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
#endif`,Tg=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,Ag=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,Rg=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,Cg=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,Lg=`PhysicalMaterial material;
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
#endif`,Pg=`struct PhysicalMaterial {
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
}`,Dg=`
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
#endif`,Ig=`#if defined( RE_IndirectDiffuse )
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
#endif`,Ug=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,Ng=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,Fg=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Og=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Bg=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,kg=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,zg=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,Hg=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,Vg=`#if defined( USE_POINTS_UV )
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
#endif`,Gg=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,Wg=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,Xg=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,qg=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,Yg=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,$g=`#ifdef USE_MORPHTARGETS
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
#endif`,jg=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Zg=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 nonPerturbedNormal = normal;`,Jg=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
#endif`,Kg=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Qg=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,tv=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,ev=`#ifdef USE_NORMALMAP
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
#endif`,nv=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,iv=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,rv=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,sv=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,av=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,ov=`vec3 packNormalToRGB( const in vec3 normal ) {
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
}`,cv=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,lv=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,hv=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,uv=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,fv=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,dv=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,pv=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,mv=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,gv=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
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
#endif`,vv=`float getShadowMask() {
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
}`,xv=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,_v=`#ifdef USE_SKINNING
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
#endif`,Mv=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,yv=`#ifdef USE_SKINNING
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
#endif`,bv=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,Sv=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,wv=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,Ev=`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,Tv=`#ifdef USE_TRANSMISSION
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
#endif`,Av=`#ifdef USE_TRANSMISSION
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
#endif`,Rv=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,Cv=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,Lv=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,Pv=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const Dv=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,Iv=`uniform sampler2D t2D;
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
}`,Uv=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Nv=`#ifdef ENVMAP_TYPE_CUBE
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
}`,Fv=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Ov=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Bv=`#include <common>
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
}`,kv=`#if DEPTH_PACKING == 3200
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
}`,zv=`#define DISTANCE
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
}`,Hv=`#define DISTANCE
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
}`,Vv=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,Gv=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Wv=`uniform float scale;
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
}`,Xv=`uniform vec3 diffuse;
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
}`,qv=`#include <common>
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
}`,Yv=`uniform vec3 diffuse;
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
}`,$v=`#define LAMBERT
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
}`,jv=`#define LAMBERT
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
}`,Zv=`#define MATCAP
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
}`,Jv=`#define MATCAP
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
}`,Kv=`#define NORMAL
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
}`,Qv=`#define NORMAL
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
}`,tx=`#define PHONG
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
}`,ex=`#define PHONG
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
}`,nx=`#define STANDARD
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
}`,ix=`#define STANDARD
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
}`,rx=`#define TOON
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
}`,sx=`#define TOON
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
}`,ax=`uniform float size;
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
}`,ox=`uniform vec3 diffuse;
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
}`,cx=`#include <common>
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
}`,lx=`uniform vec3 color;
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
}`,hx=`uniform float rotation;
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
}`,ux=`uniform vec3 diffuse;
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
}`,ee={alphahash_fragment:Im,alphahash_pars_fragment:Um,alphamap_fragment:Nm,alphamap_pars_fragment:Fm,alphatest_fragment:Om,alphatest_pars_fragment:Bm,aomap_fragment:km,aomap_pars_fragment:zm,batching_pars_vertex:Hm,batching_vertex:Vm,begin_vertex:Gm,beginnormal_vertex:Wm,bsdfs:Xm,iridescence_fragment:qm,bumpmap_pars_fragment:Ym,clipping_planes_fragment:$m,clipping_planes_pars_fragment:jm,clipping_planes_pars_vertex:Zm,clipping_planes_vertex:Jm,color_fragment:Km,color_pars_fragment:Qm,color_pars_vertex:tg,color_vertex:eg,common:ng,cube_uv_reflection_fragment:ig,defaultnormal_vertex:rg,displacementmap_pars_vertex:sg,displacementmap_vertex:ag,emissivemap_fragment:og,emissivemap_pars_fragment:cg,colorspace_fragment:lg,colorspace_pars_fragment:hg,envmap_fragment:ug,envmap_common_pars_fragment:fg,envmap_pars_fragment:dg,envmap_pars_vertex:pg,envmap_physical_pars_fragment:Eg,envmap_vertex:mg,fog_vertex:gg,fog_pars_vertex:vg,fog_fragment:xg,fog_pars_fragment:_g,gradientmap_pars_fragment:Mg,lightmap_pars_fragment:yg,lights_lambert_fragment:bg,lights_lambert_pars_fragment:Sg,lights_pars_begin:wg,lights_toon_fragment:Tg,lights_toon_pars_fragment:Ag,lights_phong_fragment:Rg,lights_phong_pars_fragment:Cg,lights_physical_fragment:Lg,lights_physical_pars_fragment:Pg,lights_fragment_begin:Dg,lights_fragment_maps:Ig,lights_fragment_end:Ug,logdepthbuf_fragment:Ng,logdepthbuf_pars_fragment:Fg,logdepthbuf_pars_vertex:Og,logdepthbuf_vertex:Bg,map_fragment:kg,map_pars_fragment:zg,map_particle_fragment:Hg,map_particle_pars_fragment:Vg,metalnessmap_fragment:Gg,metalnessmap_pars_fragment:Wg,morphinstance_vertex:Xg,morphcolor_vertex:qg,morphnormal_vertex:Yg,morphtarget_pars_vertex:$g,morphtarget_vertex:jg,normal_fragment_begin:Zg,normal_fragment_maps:Jg,normal_pars_fragment:Kg,normal_pars_vertex:Qg,normal_vertex:tv,normalmap_pars_fragment:ev,clearcoat_normal_fragment_begin:nv,clearcoat_normal_fragment_maps:iv,clearcoat_pars_fragment:rv,iridescence_pars_fragment:sv,opaque_fragment:av,packing:ov,premultiplied_alpha_fragment:cv,project_vertex:lv,dithering_fragment:hv,dithering_pars_fragment:uv,roughnessmap_fragment:fv,roughnessmap_pars_fragment:dv,shadowmap_pars_fragment:pv,shadowmap_pars_vertex:mv,shadowmap_vertex:gv,shadowmask_pars_fragment:vv,skinbase_vertex:xv,skinning_pars_vertex:_v,skinning_vertex:Mv,skinnormal_vertex:yv,specularmap_fragment:bv,specularmap_pars_fragment:Sv,tonemapping_fragment:wv,tonemapping_pars_fragment:Ev,transmission_fragment:Tv,transmission_pars_fragment:Av,uv_pars_fragment:Rv,uv_pars_vertex:Cv,uv_vertex:Lv,worldpos_vertex:Pv,background_vert:Dv,background_frag:Iv,backgroundCube_vert:Uv,backgroundCube_frag:Nv,cube_vert:Fv,cube_frag:Ov,depth_vert:Bv,depth_frag:kv,distanceRGBA_vert:zv,distanceRGBA_frag:Hv,equirect_vert:Vv,equirect_frag:Gv,linedashed_vert:Wv,linedashed_frag:Xv,meshbasic_vert:qv,meshbasic_frag:Yv,meshlambert_vert:$v,meshlambert_frag:jv,meshmatcap_vert:Zv,meshmatcap_frag:Jv,meshnormal_vert:Kv,meshnormal_frag:Qv,meshphong_vert:tx,meshphong_frag:ex,meshphysical_vert:nx,meshphysical_frag:ix,meshtoon_vert:rx,meshtoon_frag:sx,points_vert:ax,points_frag:ox,shadow_vert:cx,shadow_frag:lx,sprite_vert:hx,sprite_frag:ux},At={common:{diffuse:{value:new Pt(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new te},alphaMap:{value:null},alphaMapTransform:{value:new te},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new te}},envmap:{envMap:{value:null},envMapRotation:{value:new te},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new te}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new te}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new te},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new te},normalScale:{value:new ft(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new te},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new te}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new te}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new te}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Pt(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new Pt(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new te},alphaTest:{value:0},uvTransform:{value:new te}},sprite:{diffuse:{value:new Pt(16777215)},opacity:{value:1},center:{value:new ft(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new te},alphaMap:{value:null},alphaMapTransform:{value:new te},alphaTest:{value:0}}},oi={basic:{uniforms:en([At.common,At.specularmap,At.envmap,At.aomap,At.lightmap,At.fog]),vertexShader:ee.meshbasic_vert,fragmentShader:ee.meshbasic_frag},lambert:{uniforms:en([At.common,At.specularmap,At.envmap,At.aomap,At.lightmap,At.emissivemap,At.bumpmap,At.normalmap,At.displacementmap,At.fog,At.lights,{emissive:{value:new Pt(0)}}]),vertexShader:ee.meshlambert_vert,fragmentShader:ee.meshlambert_frag},phong:{uniforms:en([At.common,At.specularmap,At.envmap,At.aomap,At.lightmap,At.emissivemap,At.bumpmap,At.normalmap,At.displacementmap,At.fog,At.lights,{emissive:{value:new Pt(0)},specular:{value:new Pt(1118481)},shininess:{value:30}}]),vertexShader:ee.meshphong_vert,fragmentShader:ee.meshphong_frag},standard:{uniforms:en([At.common,At.envmap,At.aomap,At.lightmap,At.emissivemap,At.bumpmap,At.normalmap,At.displacementmap,At.roughnessmap,At.metalnessmap,At.fog,At.lights,{emissive:{value:new Pt(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:ee.meshphysical_vert,fragmentShader:ee.meshphysical_frag},toon:{uniforms:en([At.common,At.aomap,At.lightmap,At.emissivemap,At.bumpmap,At.normalmap,At.displacementmap,At.gradientmap,At.fog,At.lights,{emissive:{value:new Pt(0)}}]),vertexShader:ee.meshtoon_vert,fragmentShader:ee.meshtoon_frag},matcap:{uniforms:en([At.common,At.bumpmap,At.normalmap,At.displacementmap,At.fog,{matcap:{value:null}}]),vertexShader:ee.meshmatcap_vert,fragmentShader:ee.meshmatcap_frag},points:{uniforms:en([At.points,At.fog]),vertexShader:ee.points_vert,fragmentShader:ee.points_frag},dashed:{uniforms:en([At.common,At.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:ee.linedashed_vert,fragmentShader:ee.linedashed_frag},depth:{uniforms:en([At.common,At.displacementmap]),vertexShader:ee.depth_vert,fragmentShader:ee.depth_frag},normal:{uniforms:en([At.common,At.bumpmap,At.normalmap,At.displacementmap,{opacity:{value:1}}]),vertexShader:ee.meshnormal_vert,fragmentShader:ee.meshnormal_frag},sprite:{uniforms:en([At.sprite,At.fog]),vertexShader:ee.sprite_vert,fragmentShader:ee.sprite_frag},background:{uniforms:{uvTransform:{value:new te},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:ee.background_vert,fragmentShader:ee.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new te}},vertexShader:ee.backgroundCube_vert,fragmentShader:ee.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:ee.cube_vert,fragmentShader:ee.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:ee.equirect_vert,fragmentShader:ee.equirect_frag},distanceRGBA:{uniforms:en([At.common,At.displacementmap,{referencePosition:{value:new N},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:ee.distanceRGBA_vert,fragmentShader:ee.distanceRGBA_frag},shadow:{uniforms:en([At.lights,At.fog,{color:{value:new Pt(0)},opacity:{value:1}}]),vertexShader:ee.shadow_vert,fragmentShader:ee.shadow_frag}};oi.physical={uniforms:en([oi.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new te},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new te},clearcoatNormalScale:{value:new ft(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new te},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new te},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new te},sheen:{value:0},sheenColor:{value:new Pt(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new te},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new te},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new te},transmissionSamplerSize:{value:new ft},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new te},attenuationDistance:{value:0},attenuationColor:{value:new Pt(0)},specularColor:{value:new Pt(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new te},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new te},anisotropyVector:{value:new ft},anisotropyMap:{value:null},anisotropyMapTransform:{value:new te}}]),vertexShader:ee.meshphysical_vert,fragmentShader:ee.meshphysical_frag};const uo={r:0,b:0,g:0},ar=new Bn,fx=new ie;function dx(i,t,e,n,r,s,a){const o=new Pt(0);let c=s===!0?0:1,l,h,u=null,d=0,f=null;function g(M){let b=M.isScene===!0?M.background:null;return b&&b.isTexture&&(b=(M.backgroundBlurriness>0?e:t).get(b)),b}function v(M){let b=!1;const w=g(M);w===null?p(o,c):w&&w.isColor&&(p(w,1),b=!0);const T=i.xr.getEnvironmentBlendMode();T==="additive"?n.buffers.color.setClear(0,0,0,1,a):T==="alpha-blend"&&n.buffers.color.setClear(0,0,0,0,a),(i.autoClear||b)&&(n.buffers.depth.setTest(!0),n.buffers.depth.setMask(!0),n.buffers.color.setMask(!0),i.clear(i.autoClearColor,i.autoClearDepth,i.autoClearStencil))}function m(M,b){const w=g(b);w&&(w.isCubeTexture||w.mapping===Wo)?(h===void 0&&(h=new It(new Ge(1,1,1),new ze({name:"BackgroundCubeMaterial",uniforms:Ps(oi.backgroundCube.uniforms),vertexShader:oi.backgroundCube.vertexShader,fragmentShader:oi.backgroundCube.fragmentShader,side:vn,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),h.geometry.deleteAttribute("normal"),h.geometry.deleteAttribute("uv"),h.onBeforeRender=function(T,A,R){this.matrixWorld.copyPosition(R.matrixWorld)},Object.defineProperty(h.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),r.update(h)),ar.copy(b.backgroundRotation),ar.x*=-1,ar.y*=-1,ar.z*=-1,w.isCubeTexture&&w.isRenderTargetTexture===!1&&(ar.y*=-1,ar.z*=-1),h.material.uniforms.envMap.value=w,h.material.uniforms.flipEnvMap.value=w.isCubeTexture&&w.isRenderTargetTexture===!1?-1:1,h.material.uniforms.backgroundBlurriness.value=b.backgroundBlurriness,h.material.uniforms.backgroundIntensity.value=b.backgroundIntensity,h.material.uniforms.backgroundRotation.value.setFromMatrix4(fx.makeRotationFromEuler(ar)),h.material.toneMapped=ce.getTransfer(w.colorSpace)!==de,(u!==w||d!==w.version||f!==i.toneMapping)&&(h.material.needsUpdate=!0,u=w,d=w.version,f=i.toneMapping),h.layers.enableAll(),M.unshift(h,h.geometry,h.material,0,0,null)):w&&w.isTexture&&(l===void 0&&(l=new It(new Pi(2,2),new ze({name:"BackgroundMaterial",uniforms:Ps(oi.background.uniforms),vertexShader:oi.background.vertexShader,fragmentShader:oi.background.fragmentShader,side:Ki,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),l.geometry.deleteAttribute("normal"),Object.defineProperty(l.material,"map",{get:function(){return this.uniforms.t2D.value}}),r.update(l)),l.material.uniforms.t2D.value=w,l.material.uniforms.backgroundIntensity.value=b.backgroundIntensity,l.material.toneMapped=ce.getTransfer(w.colorSpace)!==de,w.matrixAutoUpdate===!0&&w.updateMatrix(),l.material.uniforms.uvTransform.value.copy(w.matrix),(u!==w||d!==w.version||f!==i.toneMapping)&&(l.material.needsUpdate=!0,u=w,d=w.version,f=i.toneMapping),l.layers.enableAll(),M.unshift(l,l.geometry,l.material,0,0,null))}function p(M,b){M.getRGB(uo,Ed(i)),n.buffers.color.setClear(uo.r,uo.g,uo.b,b,a)}function y(){h!==void 0&&(h.geometry.dispose(),h.material.dispose(),h=void 0),l!==void 0&&(l.geometry.dispose(),l.material.dispose(),l=void 0)}return{getClearColor:function(){return o},setClearColor:function(M,b=1){o.set(M),c=b,p(o,c)},getClearAlpha:function(){return c},setClearAlpha:function(M){c=M,p(o,c)},render:v,addToRenderList:m,dispose:y}}function px(i,t){const e=i.getParameter(i.MAX_VERTEX_ATTRIBS),n={},r=d(null);let s=r,a=!1;function o(_,S,E,P,L){let I=!1;const B=u(P,E,S);s!==B&&(s=B,l(s.object)),I=f(_,P,E,L),I&&g(_,P,E,L),L!==null&&t.update(L,i.ELEMENT_ARRAY_BUFFER),(I||a)&&(a=!1,b(_,S,E,P),L!==null&&i.bindBuffer(i.ELEMENT_ARRAY_BUFFER,t.get(L).buffer))}function c(){return i.createVertexArray()}function l(_){return i.bindVertexArray(_)}function h(_){return i.deleteVertexArray(_)}function u(_,S,E){const P=E.wireframe===!0;let L=n[_.id];L===void 0&&(L={},n[_.id]=L);let I=L[S.id];I===void 0&&(I={},L[S.id]=I);let B=I[P];return B===void 0&&(B=d(c()),I[P]=B),B}function d(_){const S=[],E=[],P=[];for(let L=0;L<e;L++)S[L]=0,E[L]=0,P[L]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:S,enabledAttributes:E,attributeDivisors:P,object:_,attributes:{},index:null}}function f(_,S,E,P){const L=s.attributes,I=S.attributes;let B=0;const X=E.getAttributes();for(const H in X)if(X[H].location>=0){const lt=L[H];let dt=I[H];if(dt===void 0&&(H==="instanceMatrix"&&_.instanceMatrix&&(dt=_.instanceMatrix),H==="instanceColor"&&_.instanceColor&&(dt=_.instanceColor)),lt===void 0||lt.attribute!==dt||dt&&lt.data!==dt.data)return!0;B++}return s.attributesNum!==B||s.index!==P}function g(_,S,E,P){const L={},I=S.attributes;let B=0;const X=E.getAttributes();for(const H in X)if(X[H].location>=0){let lt=I[H];lt===void 0&&(H==="instanceMatrix"&&_.instanceMatrix&&(lt=_.instanceMatrix),H==="instanceColor"&&_.instanceColor&&(lt=_.instanceColor));const dt={};dt.attribute=lt,lt&&lt.data&&(dt.data=lt.data),L[H]=dt,B++}s.attributes=L,s.attributesNum=B,s.index=P}function v(){const _=s.newAttributes;for(let S=0,E=_.length;S<E;S++)_[S]=0}function m(_){p(_,0)}function p(_,S){const E=s.newAttributes,P=s.enabledAttributes,L=s.attributeDivisors;E[_]=1,P[_]===0&&(i.enableVertexAttribArray(_),P[_]=1),L[_]!==S&&(i.vertexAttribDivisor(_,S),L[_]=S)}function y(){const _=s.newAttributes,S=s.enabledAttributes;for(let E=0,P=S.length;E<P;E++)S[E]!==_[E]&&(i.disableVertexAttribArray(E),S[E]=0)}function M(_,S,E,P,L,I,B){B===!0?i.vertexAttribIPointer(_,S,E,L,I):i.vertexAttribPointer(_,S,E,P,L,I)}function b(_,S,E,P){v();const L=P.attributes,I=E.getAttributes(),B=S.defaultAttributeValues;for(const X in I){const H=I[X];if(H.location>=0){let it=L[X];if(it===void 0&&(X==="instanceMatrix"&&_.instanceMatrix&&(it=_.instanceMatrix),X==="instanceColor"&&_.instanceColor&&(it=_.instanceColor)),it!==void 0){const lt=it.normalized,dt=it.itemSize,vt=t.get(it);if(vt===void 0)continue;const wt=vt.buffer,Ft=vt.type,ot=vt.bytesPerElement,V=Ft===i.INT||Ft===i.UNSIGNED_INT||it.gpuType===rh;if(it.isInterleavedBufferAttribute){const Z=it.data,k=Z.stride,G=it.offset;if(Z.isInstancedInterleavedBuffer){for(let z=0;z<H.locationSize;z++)p(H.location+z,Z.meshPerAttribute);_.isInstancedMesh!==!0&&P._maxInstanceCount===void 0&&(P._maxInstanceCount=Z.meshPerAttribute*Z.count)}else for(let z=0;z<H.locationSize;z++)m(H.location+z);i.bindBuffer(i.ARRAY_BUFFER,wt);for(let z=0;z<H.locationSize;z++)M(H.location+z,dt/H.locationSize,Ft,lt,k*ot,(G+dt/H.locationSize*z)*ot,V)}else{if(it.isInstancedBufferAttribute){for(let Z=0;Z<H.locationSize;Z++)p(H.location+Z,it.meshPerAttribute);_.isInstancedMesh!==!0&&P._maxInstanceCount===void 0&&(P._maxInstanceCount=it.meshPerAttribute*it.count)}else for(let Z=0;Z<H.locationSize;Z++)m(H.location+Z);i.bindBuffer(i.ARRAY_BUFFER,wt);for(let Z=0;Z<H.locationSize;Z++)M(H.location+Z,dt/H.locationSize,Ft,lt,dt*ot,dt/H.locationSize*Z*ot,V)}}else if(B!==void 0){const lt=B[X];if(lt!==void 0)switch(lt.length){case 2:i.vertexAttrib2fv(H.location,lt);break;case 3:i.vertexAttrib3fv(H.location,lt);break;case 4:i.vertexAttrib4fv(H.location,lt);break;default:i.vertexAttrib1fv(H.location,lt)}}}}y()}function w(){R();for(const _ in n){const S=n[_];for(const E in S){const P=S[E];for(const L in P)h(P[L].object),delete P[L];delete S[E]}delete n[_]}}function T(_){if(n[_.id]===void 0)return;const S=n[_.id];for(const E in S){const P=S[E];for(const L in P)h(P[L].object),delete P[L];delete S[E]}delete n[_.id]}function A(_){for(const S in n){const E=n[S];if(E[_.id]===void 0)continue;const P=E[_.id];for(const L in P)h(P[L].object),delete P[L];delete E[_.id]}}function R(){x(),a=!0,s!==r&&(s=r,l(s.object))}function x(){r.geometry=null,r.program=null,r.wireframe=!1}return{setup:o,reset:R,resetDefaultState:x,dispose:w,releaseStatesOfGeometry:T,releaseStatesOfProgram:A,initAttributes:v,enableAttribute:m,disableUnusedAttributes:y}}function mx(i,t,e){let n;function r(l){n=l}function s(l,h){i.drawArrays(n,l,h),e.update(h,n,1)}function a(l,h,u){u!==0&&(i.drawArraysInstanced(n,l,h,u),e.update(h,n,u))}function o(l,h,u){if(u===0)return;t.get("WEBGL_multi_draw").multiDrawArraysWEBGL(n,l,0,h,0,u);let f=0;for(let g=0;g<u;g++)f+=h[g];e.update(f,n,1)}function c(l,h,u,d){if(u===0)return;const f=t.get("WEBGL_multi_draw");if(f===null)for(let g=0;g<l.length;g++)a(l[g],h[g],d[g]);else{f.multiDrawArraysInstancedWEBGL(n,l,0,h,0,d,0,u);let g=0;for(let v=0;v<u;v++)g+=h[v]*d[v];e.update(g,n,1)}}this.setMode=r,this.render=s,this.renderInstances=a,this.renderMultiDraw=o,this.renderMultiDrawInstances=c}function gx(i,t,e,n){let r;function s(){if(r!==void 0)return r;if(t.has("EXT_texture_filter_anisotropic")===!0){const A=t.get("EXT_texture_filter_anisotropic");r=i.getParameter(A.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else r=0;return r}function a(A){return!(A!==Xe&&n.convert(A)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_FORMAT))}function o(A){const R=A===Tr&&(t.has("EXT_color_buffer_half_float")||t.has("EXT_color_buffer_float"));return!(A!==Jn&&n.convert(A)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_TYPE)&&A!==li&&!R)}function c(A){if(A==="highp"){if(i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.HIGH_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.HIGH_FLOAT).precision>0)return"highp";A="mediump"}return A==="mediump"&&i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.MEDIUM_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let l=e.precision!==void 0?e.precision:"highp";const h=c(l);h!==l&&(console.warn("THREE.WebGLRenderer:",l,"not supported, using",h,"instead."),l=h);const u=e.logarithmicDepthBuffer===!0,d=e.reversedDepthBuffer===!0&&t.has("EXT_clip_control"),f=i.getParameter(i.MAX_TEXTURE_IMAGE_UNITS),g=i.getParameter(i.MAX_VERTEX_TEXTURE_IMAGE_UNITS),v=i.getParameter(i.MAX_TEXTURE_SIZE),m=i.getParameter(i.MAX_CUBE_MAP_TEXTURE_SIZE),p=i.getParameter(i.MAX_VERTEX_ATTRIBS),y=i.getParameter(i.MAX_VERTEX_UNIFORM_VECTORS),M=i.getParameter(i.MAX_VARYING_VECTORS),b=i.getParameter(i.MAX_FRAGMENT_UNIFORM_VECTORS),w=g>0,T=i.getParameter(i.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:s,getMaxPrecision:c,textureFormatReadable:a,textureTypeReadable:o,precision:l,logarithmicDepthBuffer:u,reversedDepthBuffer:d,maxTextures:f,maxVertexTextures:g,maxTextureSize:v,maxCubemapSize:m,maxAttributes:p,maxVertexUniforms:y,maxVaryings:M,maxFragmentUniforms:b,vertexTextures:w,maxSamples:T}}function vx(i){const t=this;let e=null,n=0,r=!1,s=!1;const a=new lr,o=new te,c={value:null,needsUpdate:!1};this.uniform=c,this.numPlanes=0,this.numIntersection=0,this.init=function(u,d){const f=u.length!==0||d||n!==0||r;return r=d,n=u.length,f},this.beginShadows=function(){s=!0,h(null)},this.endShadows=function(){s=!1},this.setGlobalState=function(u,d){e=h(u,d,0)},this.setState=function(u,d,f){const g=u.clippingPlanes,v=u.clipIntersection,m=u.clipShadows,p=i.get(u);if(!r||g===null||g.length===0||s&&!m)s?h(null):l();else{const y=s?0:n,M=y*4;let b=p.clippingState||null;c.value=b,b=h(g,d,M,f);for(let w=0;w!==M;++w)b[w]=e[w];p.clippingState=b,this.numIntersection=v?this.numPlanes:0,this.numPlanes+=y}};function l(){c.value!==e&&(c.value=e,c.needsUpdate=n>0),t.numPlanes=n,t.numIntersection=0}function h(u,d,f,g){const v=u!==null?u.length:0;let m=null;if(v!==0){if(m=c.value,g!==!0||m===null){const p=f+v*4,y=d.matrixWorldInverse;o.getNormalMatrix(y),(m===null||m.length<p)&&(m=new Float32Array(p));for(let M=0,b=f;M!==v;++M,b+=4)a.copy(u[M]).applyMatrix4(y,o),a.normal.toArray(m,b),m[b+3]=a.constant}c.value=m,c.needsUpdate=!0}return t.numPlanes=v,t.numIntersection=0,m}}function xx(i){let t=new WeakMap;function e(a,o){return o===Co?a.mapping=As:o===sl&&(a.mapping=Rs),a}function n(a){if(a&&a.isTexture){const o=a.mapping;if(o===Co||o===sl)if(t.has(a)){const c=t.get(a).texture;return e(c,a.mapping)}else{const c=a.image;if(c&&c.height>0){const l=new N1(c.height);return l.fromEquirectangularTexture(i,a),t.set(a,l),a.addEventListener("dispose",r),e(l.texture,a.mapping)}else return null}}return a}function r(a){const o=a.target;o.removeEventListener("dispose",r);const c=t.get(o);c!==void 0&&(t.delete(o),c.dispose())}function s(){t=new WeakMap}return{get:n,dispose:s}}const ps=4,Hu=[.125,.215,.35,.446,.526,.582],fr=20,Rc=new bh,Vu=new Pt;let Cc=null,Lc=0,Pc=0,Dc=!1;const hr=(1+Math.sqrt(5))/2,ts=1/hr,Gu=[new N(-hr,ts,0),new N(hr,ts,0),new N(-ts,0,hr),new N(ts,0,hr),new N(0,hr,-ts),new N(0,hr,ts),new N(-1,1,-1),new N(1,1,-1),new N(-1,1,1),new N(1,1,1)],_x=new N;class Hl{constructor(t){this._renderer=t,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(t,e=0,n=.1,r=100,s={}){const{size:a=256,position:o=_x}=s;Cc=this._renderer.getRenderTarget(),Lc=this._renderer.getActiveCubeFace(),Pc=this._renderer.getActiveMipmapLevel(),Dc=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(a);const c=this._allocateTargets();return c.depthBuffer=!0,this._sceneToCubeUV(t,n,r,c,o),e>0&&this._blur(c,0,0,e),this._applyPMREM(c),this._cleanup(c),c}fromEquirectangular(t,e=null){return this._fromTexture(t,e)}fromCubemap(t,e=null){return this._fromTexture(t,e)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=qu(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Xu(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(t){this._lodMax=Math.floor(Math.log2(t)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let t=0;t<this._lodPlanes.length;t++)this._lodPlanes[t].dispose()}_cleanup(t){this._renderer.setRenderTarget(Cc,Lc,Pc),this._renderer.xr.enabled=Dc,t.scissorTest=!1,fo(t,0,0,t.width,t.height)}_fromTexture(t,e){t.mapping===As||t.mapping===Rs?this._setSize(t.image.length===0?16:t.image[0].width||t.image[0].image.width):this._setSize(t.image.width/4),Cc=this._renderer.getRenderTarget(),Lc=this._renderer.getActiveCubeFace(),Pc=this._renderer.getActiveMipmapLevel(),Dc=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const n=e||this._allocateTargets();return this._textureToCubeUV(t,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){const t=3*Math.max(this._cubeSize,112),e=4*this._cubeSize,n={magFilter:_e,minFilter:_e,generateMipmaps:!1,type:Tr,format:Xe,colorSpace:br,depthBuffer:!1},r=Wu(t,e,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==t||this._pingPongRenderTarget.height!==e){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=Wu(t,e,n);const{_lodMax:s}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=Mx(s)),this._blurMaterial=yx(s,t,e)}return r}_compileMaterial(t){const e=new It(this._lodPlanes[0],t);this._renderer.compile(e,Rc)}_sceneToCubeUV(t,e,n,r,s){const c=new bn(90,1,e,n),l=[1,-1,1,1,1,1],h=[1,1,1,-1,-1,-1],u=this._renderer,d=u.autoClear,f=u.toneMapping;u.getClearColor(Vu),u.toneMapping=Zi,u.autoClear=!1,u.state.buffers.depth.getReversed()&&(u.setRenderTarget(r),u.clearDepth(),u.setRenderTarget(null));const v=new Qi({name:"PMREM.Background",side:vn,depthWrite:!1,depthTest:!1}),m=new It(new Ge,v);let p=!1;const y=t.background;y?y.isColor&&(v.color.copy(y),t.background=null,p=!0):(v.color.copy(Vu),p=!0);for(let M=0;M<6;M++){const b=M%3;b===0?(c.up.set(0,l[M],0),c.position.set(s.x,s.y,s.z),c.lookAt(s.x+h[M],s.y,s.z)):b===1?(c.up.set(0,0,l[M]),c.position.set(s.x,s.y,s.z),c.lookAt(s.x,s.y+h[M],s.z)):(c.up.set(0,l[M],0),c.position.set(s.x,s.y,s.z),c.lookAt(s.x,s.y,s.z+h[M]));const w=this._cubeSize;fo(r,b*w,M>2?w:0,w,w),u.setRenderTarget(r),p&&u.render(m,c),u.render(t,c)}m.geometry.dispose(),m.material.dispose(),u.toneMapping=f,u.autoClear=d,t.background=y}_textureToCubeUV(t,e){const n=this._renderer,r=t.mapping===As||t.mapping===Rs;r?(this._cubemapMaterial===null&&(this._cubemapMaterial=qu()),this._cubemapMaterial.uniforms.flipEnvMap.value=t.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=Xu());const s=r?this._cubemapMaterial:this._equirectMaterial,a=new It(this._lodPlanes[0],s),o=s.uniforms;o.envMap.value=t;const c=this._cubeSize;fo(e,0,0,3*c,2*c),n.setRenderTarget(e),n.render(a,Rc)}_applyPMREM(t){const e=this._renderer,n=e.autoClear;e.autoClear=!1;const r=this._lodPlanes.length;for(let s=1;s<r;s++){const a=Math.sqrt(this._sigmas[s]*this._sigmas[s]-this._sigmas[s-1]*this._sigmas[s-1]),o=Gu[(r-s-1)%Gu.length];this._blur(t,s-1,s,a,o)}e.autoClear=n}_blur(t,e,n,r,s){const a=this._pingPongRenderTarget;this._halfBlur(t,a,e,n,r,"latitudinal",s),this._halfBlur(a,t,n,n,r,"longitudinal",s)}_halfBlur(t,e,n,r,s,a,o){const c=this._renderer,l=this._blurMaterial;a!=="latitudinal"&&a!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const h=3,u=new It(this._lodPlanes[r],l),d=l.uniforms,f=this._sizeLods[n]-1,g=isFinite(s)?Math.PI/(2*f):2*Math.PI/(2*fr-1),v=s/g,m=isFinite(s)?1+Math.floor(h*v):fr;m>fr&&console.warn(`sigmaRadians, ${s}, is too large and will clip, as it requested ${m} samples when the maximum is set to ${fr}`);const p=[];let y=0;for(let A=0;A<fr;++A){const R=A/v,x=Math.exp(-R*R/2);p.push(x),A===0?y+=x:A<m&&(y+=2*x)}for(let A=0;A<p.length;A++)p[A]=p[A]/y;d.envMap.value=t.texture,d.samples.value=m,d.weights.value=p,d.latitudinal.value=a==="latitudinal",o&&(d.poleAxis.value=o);const{_lodMax:M}=this;d.dTheta.value=g,d.mipInt.value=M-n;const b=this._sizeLods[r],w=3*b*(r>M-ps?r-M+ps:0),T=4*(this._cubeSize-b);fo(e,w,T,3*b,2*b),c.setRenderTarget(e),c.render(u,Rc)}}function Mx(i){const t=[],e=[],n=[];let r=i;const s=i-ps+1+Hu.length;for(let a=0;a<s;a++){const o=Math.pow(2,r);e.push(o);let c=1/o;a>i-ps?c=Hu[a-i+ps-1]:a===0&&(c=0),n.push(c);const l=1/(o-2),h=-l,u=1+l,d=[h,h,u,h,u,u,h,h,u,u,h,u],f=6,g=6,v=3,m=2,p=1,y=new Float32Array(v*g*f),M=new Float32Array(m*g*f),b=new Float32Array(p*g*f);for(let T=0;T<f;T++){const A=T%3*2/3-1,R=T>2?0:-1,x=[A,R,0,A+2/3,R,0,A+2/3,R+1,0,A,R,0,A+2/3,R+1,0,A,R+1,0];y.set(x,v*g*T),M.set(d,m*g*T);const _=[T,T,T,T,T,T];b.set(_,p*g*T)}const w=new Se;w.setAttribute("position",new ae(y,v)),w.setAttribute("uv",new ae(M,m)),w.setAttribute("faceIndex",new ae(b,p)),t.push(w),r>ps&&r--}return{lodPlanes:t,sizeLods:e,sigmas:n}}function Wu(i,t,e){const n=new on(i,t,e);return n.texture.mapping=Wo,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function fo(i,t,e,n,r){i.viewport.set(t,e,n,r),i.scissor.set(t,e,n,r)}function yx(i,t,e){const n=new Float32Array(fr),r=new N(0,1,0);return new ze({name:"SphericalGaussianBlur",defines:{n:fr,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/e,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:n},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:r}},vertexShader:Sh(),fragmentShader:`

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
		`,blending:ji,depthTest:!1,depthWrite:!1})}function Xu(){return new ze({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:Sh(),fragmentShader:`

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
		`,blending:ji,depthTest:!1,depthWrite:!1})}function qu(){return new ze({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:Sh(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:ji,depthTest:!1,depthWrite:!1})}function Sh(){return`

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
	`}function bx(i){let t=new WeakMap,e=null;function n(o){if(o&&o.isTexture){const c=o.mapping,l=c===Co||c===sl,h=c===As||c===Rs;if(l||h){let u=t.get(o);const d=u!==void 0?u.texture.pmremVersion:0;if(o.isRenderTargetTexture&&o.pmremVersion!==d)return e===null&&(e=new Hl(i)),u=l?e.fromEquirectangular(o,u):e.fromCubemap(o,u),u.texture.pmremVersion=o.pmremVersion,t.set(o,u),u.texture;if(u!==void 0)return u.texture;{const f=o.image;return l&&f&&f.height>0||h&&f&&r(f)?(e===null&&(e=new Hl(i)),u=l?e.fromEquirectangular(o):e.fromCubemap(o),u.texture.pmremVersion=o.pmremVersion,t.set(o,u),o.addEventListener("dispose",s),u.texture):null}}}return o}function r(o){let c=0;const l=6;for(let h=0;h<l;h++)o[h]!==void 0&&c++;return c===l}function s(o){const c=o.target;c.removeEventListener("dispose",s);const l=t.get(c);l!==void 0&&(t.delete(c),l.dispose())}function a(){t=new WeakMap,e!==null&&(e.dispose(),e=null)}return{get:n,dispose:a}}function Sx(i){const t={};function e(n){if(t[n]!==void 0)return t[n];let r;switch(n){case"WEBGL_depth_texture":r=i.getExtension("WEBGL_depth_texture")||i.getExtension("MOZ_WEBGL_depth_texture")||i.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":r=i.getExtension("EXT_texture_filter_anisotropic")||i.getExtension("MOZ_EXT_texture_filter_anisotropic")||i.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":r=i.getExtension("WEBGL_compressed_texture_s3tc")||i.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":r=i.getExtension("WEBGL_compressed_texture_pvrtc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:r=i.getExtension(n)}return t[n]=r,r}return{has:function(n){return e(n)!==null},init:function(){e("EXT_color_buffer_float"),e("WEBGL_clip_cull_distance"),e("OES_texture_float_linear"),e("EXT_color_buffer_half_float"),e("WEBGL_multisampled_render_to_texture"),e("WEBGL_render_shared_exponent")},get:function(n){const r=e(n);return r===null&&pa("THREE.WebGLRenderer: "+n+" extension not supported."),r}}}function wx(i,t,e,n){const r={},s=new WeakMap;function a(u){const d=u.target;d.index!==null&&t.remove(d.index);for(const g in d.attributes)t.remove(d.attributes[g]);d.removeEventListener("dispose",a),delete r[d.id];const f=s.get(d);f&&(t.remove(f),s.delete(d)),n.releaseStatesOfGeometry(d),d.isInstancedBufferGeometry===!0&&delete d._maxInstanceCount,e.memory.geometries--}function o(u,d){return r[d.id]===!0||(d.addEventListener("dispose",a),r[d.id]=!0,e.memory.geometries++),d}function c(u){const d=u.attributes;for(const f in d)t.update(d[f],i.ARRAY_BUFFER)}function l(u){const d=[],f=u.index,g=u.attributes.position;let v=0;if(f!==null){const y=f.array;v=f.version;for(let M=0,b=y.length;M<b;M+=3){const w=y[M+0],T=y[M+1],A=y[M+2];d.push(w,T,T,A,A,w)}}else if(g!==void 0){const y=g.array;v=g.version;for(let M=0,b=y.length/3-1;M<b;M+=3){const w=M+0,T=M+1,A=M+2;d.push(w,T,T,A,A,w)}}else return;const m=new(Md(d)?wd:Sd)(d,1);m.version=v;const p=s.get(u);p&&t.remove(p),s.set(u,m)}function h(u){const d=s.get(u);if(d){const f=u.index;f!==null&&d.version<f.version&&l(u)}else l(u);return s.get(u)}return{get:o,update:c,getWireframeAttribute:h}}function Ex(i,t,e){let n;function r(d){n=d}let s,a;function o(d){s=d.type,a=d.bytesPerElement}function c(d,f){i.drawElements(n,f,s,d*a),e.update(f,n,1)}function l(d,f,g){g!==0&&(i.drawElementsInstanced(n,f,s,d*a,g),e.update(f,n,g))}function h(d,f,g){if(g===0)return;t.get("WEBGL_multi_draw").multiDrawElementsWEBGL(n,f,0,s,d,0,g);let m=0;for(let p=0;p<g;p++)m+=f[p];e.update(m,n,1)}function u(d,f,g,v){if(g===0)return;const m=t.get("WEBGL_multi_draw");if(m===null)for(let p=0;p<d.length;p++)l(d[p]/a,f[p],v[p]);else{m.multiDrawElementsInstancedWEBGL(n,f,0,s,d,0,v,0,g);let p=0;for(let y=0;y<g;y++)p+=f[y]*v[y];e.update(p,n,1)}}this.setMode=r,this.setIndex=o,this.render=c,this.renderInstances=l,this.renderMultiDraw=h,this.renderMultiDrawInstances=u}function Tx(i){const t={geometries:0,textures:0},e={frame:0,calls:0,triangles:0,points:0,lines:0};function n(s,a,o){switch(e.calls++,a){case i.TRIANGLES:e.triangles+=o*(s/3);break;case i.LINES:e.lines+=o*(s/2);break;case i.LINE_STRIP:e.lines+=o*(s-1);break;case i.LINE_LOOP:e.lines+=o*s;break;case i.POINTS:e.points+=o*s;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",a);break}}function r(){e.calls=0,e.triangles=0,e.points=0,e.lines=0}return{memory:t,render:e,programs:null,autoReset:!0,reset:r,update:n}}function Ax(i,t,e){const n=new WeakMap,r=new le;function s(a,o,c){const l=a.morphTargetInfluences,h=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,u=h!==void 0?h.length:0;let d=n.get(o);if(d===void 0||d.count!==u){let x=function(){A.dispose(),n.delete(o),o.removeEventListener("dispose",x)};d!==void 0&&d.texture.dispose();const f=o.morphAttributes.position!==void 0,g=o.morphAttributes.normal!==void 0,v=o.morphAttributes.color!==void 0,m=o.morphAttributes.position||[],p=o.morphAttributes.normal||[],y=o.morphAttributes.color||[];let M=0;f===!0&&(M=1),g===!0&&(M=2),v===!0&&(M=3);let b=o.attributes.position.count*M,w=1;b>t.maxTextureSize&&(w=Math.ceil(b/t.maxTextureSize),b=t.maxTextureSize);const T=new Float32Array(b*w*4*u),A=new fh(T,b,w,u);A.type=li,A.needsUpdate=!0;const R=M*4;for(let _=0;_<u;_++){const S=m[_],E=p[_],P=y[_],L=b*w*4*_;for(let I=0;I<S.count;I++){const B=I*R;f===!0&&(r.fromBufferAttribute(S,I),T[L+B+0]=r.x,T[L+B+1]=r.y,T[L+B+2]=r.z,T[L+B+3]=0),g===!0&&(r.fromBufferAttribute(E,I),T[L+B+4]=r.x,T[L+B+5]=r.y,T[L+B+6]=r.z,T[L+B+7]=0),v===!0&&(r.fromBufferAttribute(P,I),T[L+B+8]=r.x,T[L+B+9]=r.y,T[L+B+10]=r.z,T[L+B+11]=P.itemSize===4?r.w:1)}}d={count:u,texture:A,size:new ft(b,w)},n.set(o,d),o.addEventListener("dispose",x)}if(a.isInstancedMesh===!0&&a.morphTexture!==null)c.getUniforms().setValue(i,"morphTexture",a.morphTexture,e);else{let f=0;for(let v=0;v<l.length;v++)f+=l[v];const g=o.morphTargetsRelative?1:1-f;c.getUniforms().setValue(i,"morphTargetBaseInfluence",g),c.getUniforms().setValue(i,"morphTargetInfluences",l)}c.getUniforms().setValue(i,"morphTargetsTexture",d.texture,e),c.getUniforms().setValue(i,"morphTargetsTextureSize",d.size)}return{update:s}}function Rx(i,t,e,n){let r=new WeakMap;function s(c){const l=n.render.frame,h=c.geometry,u=t.get(c,h);if(r.get(u)!==l&&(t.update(u),r.set(u,l)),c.isInstancedMesh&&(c.hasEventListener("dispose",o)===!1&&c.addEventListener("dispose",o),r.get(c)!==l&&(e.update(c.instanceMatrix,i.ARRAY_BUFFER),c.instanceColor!==null&&e.update(c.instanceColor,i.ARRAY_BUFFER),r.set(c,l))),c.isSkinnedMesh){const d=c.skeleton;r.get(d)!==l&&(d.update(),r.set(d,l))}return u}function a(){r=new WeakMap}function o(c){const l=c.target;l.removeEventListener("dispose",o),e.remove(l.instanceMatrix),l.instanceColor!==null&&e.remove(l.instanceColor)}return{update:s,dispose:a}}const Yd=new qe,Yu=new Id(1,1),$d=new fh,jd=new m1,Zd=new Ad,$u=[],ju=[],Zu=new Float32Array(16),Ju=new Float32Array(9),Ku=new Float32Array(4);function Bs(i,t,e){const n=i[0];if(n<=0||n>0)return i;const r=t*e;let s=$u[r];if(s===void 0&&(s=new Float32Array(r),$u[r]=s),t!==0){n.toArray(s,0);for(let a=1,o=0;a!==t;++a)o+=e,i[a].toArray(s,o)}return s}function Fe(i,t){if(i.length!==t.length)return!1;for(let e=0,n=i.length;e<n;e++)if(i[e]!==t[e])return!1;return!0}function Oe(i,t){for(let e=0,n=t.length;e<n;e++)i[e]=t[e]}function qo(i,t){let e=ju[t];e===void 0&&(e=new Int32Array(t),ju[t]=e);for(let n=0;n!==t;++n)e[n]=i.allocateTextureUnit();return e}function Cx(i,t){const e=this.cache;e[0]!==t&&(i.uniform1f(this.addr,t),e[0]=t)}function Lx(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2f(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Fe(e,t))return;i.uniform2fv(this.addr,t),Oe(e,t)}}function Px(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3f(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else if(t.r!==void 0)(e[0]!==t.r||e[1]!==t.g||e[2]!==t.b)&&(i.uniform3f(this.addr,t.r,t.g,t.b),e[0]=t.r,e[1]=t.g,e[2]=t.b);else{if(Fe(e,t))return;i.uniform3fv(this.addr,t),Oe(e,t)}}function Dx(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4f(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Fe(e,t))return;i.uniform4fv(this.addr,t),Oe(e,t)}}function Ix(i,t){const e=this.cache,n=t.elements;if(n===void 0){if(Fe(e,t))return;i.uniformMatrix2fv(this.addr,!1,t),Oe(e,t)}else{if(Fe(e,n))return;Ku.set(n),i.uniformMatrix2fv(this.addr,!1,Ku),Oe(e,n)}}function Ux(i,t){const e=this.cache,n=t.elements;if(n===void 0){if(Fe(e,t))return;i.uniformMatrix3fv(this.addr,!1,t),Oe(e,t)}else{if(Fe(e,n))return;Ju.set(n),i.uniformMatrix3fv(this.addr,!1,Ju),Oe(e,n)}}function Nx(i,t){const e=this.cache,n=t.elements;if(n===void 0){if(Fe(e,t))return;i.uniformMatrix4fv(this.addr,!1,t),Oe(e,t)}else{if(Fe(e,n))return;Zu.set(n),i.uniformMatrix4fv(this.addr,!1,Zu),Oe(e,n)}}function Fx(i,t){const e=this.cache;e[0]!==t&&(i.uniform1i(this.addr,t),e[0]=t)}function Ox(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2i(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Fe(e,t))return;i.uniform2iv(this.addr,t),Oe(e,t)}}function Bx(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3i(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(Fe(e,t))return;i.uniform3iv(this.addr,t),Oe(e,t)}}function kx(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4i(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Fe(e,t))return;i.uniform4iv(this.addr,t),Oe(e,t)}}function zx(i,t){const e=this.cache;e[0]!==t&&(i.uniform1ui(this.addr,t),e[0]=t)}function Hx(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2ui(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Fe(e,t))return;i.uniform2uiv(this.addr,t),Oe(e,t)}}function Vx(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3ui(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(Fe(e,t))return;i.uniform3uiv(this.addr,t),Oe(e,t)}}function Gx(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4ui(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Fe(e,t))return;i.uniform4uiv(this.addr,t),Oe(e,t)}}function Wx(i,t,e){const n=this.cache,r=e.allocateTextureUnit();n[0]!==r&&(i.uniform1i(this.addr,r),n[0]=r);let s;this.type===i.SAMPLER_2D_SHADOW?(Yu.compareFunction=_d,s=Yu):s=Yd,e.setTexture2D(t||s,r)}function Xx(i,t,e){const n=this.cache,r=e.allocateTextureUnit();n[0]!==r&&(i.uniform1i(this.addr,r),n[0]=r),e.setTexture3D(t||jd,r)}function qx(i,t,e){const n=this.cache,r=e.allocateTextureUnit();n[0]!==r&&(i.uniform1i(this.addr,r),n[0]=r),e.setTextureCube(t||Zd,r)}function Yx(i,t,e){const n=this.cache,r=e.allocateTextureUnit();n[0]!==r&&(i.uniform1i(this.addr,r),n[0]=r),e.setTexture2DArray(t||$d,r)}function $x(i){switch(i){case 5126:return Cx;case 35664:return Lx;case 35665:return Px;case 35666:return Dx;case 35674:return Ix;case 35675:return Ux;case 35676:return Nx;case 5124:case 35670:return Fx;case 35667:case 35671:return Ox;case 35668:case 35672:return Bx;case 35669:case 35673:return kx;case 5125:return zx;case 36294:return Hx;case 36295:return Vx;case 36296:return Gx;case 35678:case 36198:case 36298:case 36306:case 35682:return Wx;case 35679:case 36299:case 36307:return Xx;case 35680:case 36300:case 36308:case 36293:return qx;case 36289:case 36303:case 36311:case 36292:return Yx}}function jx(i,t){i.uniform1fv(this.addr,t)}function Zx(i,t){const e=Bs(t,this.size,2);i.uniform2fv(this.addr,e)}function Jx(i,t){const e=Bs(t,this.size,3);i.uniform3fv(this.addr,e)}function Kx(i,t){const e=Bs(t,this.size,4);i.uniform4fv(this.addr,e)}function Qx(i,t){const e=Bs(t,this.size,4);i.uniformMatrix2fv(this.addr,!1,e)}function t_(i,t){const e=Bs(t,this.size,9);i.uniformMatrix3fv(this.addr,!1,e)}function e_(i,t){const e=Bs(t,this.size,16);i.uniformMatrix4fv(this.addr,!1,e)}function n_(i,t){i.uniform1iv(this.addr,t)}function i_(i,t){i.uniform2iv(this.addr,t)}function r_(i,t){i.uniform3iv(this.addr,t)}function s_(i,t){i.uniform4iv(this.addr,t)}function a_(i,t){i.uniform1uiv(this.addr,t)}function o_(i,t){i.uniform2uiv(this.addr,t)}function c_(i,t){i.uniform3uiv(this.addr,t)}function l_(i,t){i.uniform4uiv(this.addr,t)}function h_(i,t,e){const n=this.cache,r=t.length,s=qo(e,r);Fe(n,s)||(i.uniform1iv(this.addr,s),Oe(n,s));for(let a=0;a!==r;++a)e.setTexture2D(t[a]||Yd,s[a])}function u_(i,t,e){const n=this.cache,r=t.length,s=qo(e,r);Fe(n,s)||(i.uniform1iv(this.addr,s),Oe(n,s));for(let a=0;a!==r;++a)e.setTexture3D(t[a]||jd,s[a])}function f_(i,t,e){const n=this.cache,r=t.length,s=qo(e,r);Fe(n,s)||(i.uniform1iv(this.addr,s),Oe(n,s));for(let a=0;a!==r;++a)e.setTextureCube(t[a]||Zd,s[a])}function d_(i,t,e){const n=this.cache,r=t.length,s=qo(e,r);Fe(n,s)||(i.uniform1iv(this.addr,s),Oe(n,s));for(let a=0;a!==r;++a)e.setTexture2DArray(t[a]||$d,s[a])}function p_(i){switch(i){case 5126:return jx;case 35664:return Zx;case 35665:return Jx;case 35666:return Kx;case 35674:return Qx;case 35675:return t_;case 35676:return e_;case 5124:case 35670:return n_;case 35667:case 35671:return i_;case 35668:case 35672:return r_;case 35669:case 35673:return s_;case 5125:return a_;case 36294:return o_;case 36295:return c_;case 36296:return l_;case 35678:case 36198:case 36298:case 36306:case 35682:return h_;case 35679:case 36299:case 36307:return u_;case 35680:case 36300:case 36308:case 36293:return f_;case 36289:case 36303:case 36311:case 36292:return d_}}class m_{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.setValue=$x(e.type)}}class g_{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.size=e.size,this.setValue=p_(e.type)}}class v_{constructor(t){this.id=t,this.seq=[],this.map={}}setValue(t,e,n){const r=this.seq;for(let s=0,a=r.length;s!==a;++s){const o=r[s];o.setValue(t,e[o.id],n)}}}const Ic=/(\w+)(\])?(\[|\.)?/g;function Qu(i,t){i.seq.push(t),i.map[t.id]=t}function x_(i,t,e){const n=i.name,r=n.length;for(Ic.lastIndex=0;;){const s=Ic.exec(n),a=Ic.lastIndex;let o=s[1];const c=s[2]==="]",l=s[3];if(c&&(o=o|0),l===void 0||l==="["&&a+2===r){Qu(e,l===void 0?new m_(o,i,t):new g_(o,i,t));break}else{let u=e.map[o];u===void 0&&(u=new v_(o),Qu(e,u)),e=u}}}class To{constructor(t,e){this.seq=[],this.map={};const n=t.getProgramParameter(e,t.ACTIVE_UNIFORMS);for(let r=0;r<n;++r){const s=t.getActiveUniform(e,r),a=t.getUniformLocation(e,s.name);x_(s,a,this)}}setValue(t,e,n,r){const s=this.map[e];s!==void 0&&s.setValue(t,n,r)}setOptional(t,e,n){const r=e[n];r!==void 0&&this.setValue(t,n,r)}static upload(t,e,n,r){for(let s=0,a=e.length;s!==a;++s){const o=e[s],c=n[o.id];c.needsUpdate!==!1&&o.setValue(t,c.value,r)}}static seqWithValue(t,e){const n=[];for(let r=0,s=t.length;r!==s;++r){const a=t[r];a.id in e&&n.push(a)}return n}}function tf(i,t,e){const n=i.createShader(t);return i.shaderSource(n,e),i.compileShader(n),n}const __=37297;let M_=0;function y_(i,t){const e=i.split(`
`),n=[],r=Math.max(t-6,0),s=Math.min(t+6,e.length);for(let a=r;a<s;a++){const o=a+1;n.push(`${o===t?">":" "} ${o}: ${e[a]}`)}return n.join(`
`)}const ef=new te;function b_(i){ce._getMatrix(ef,ce.workingColorSpace,i);const t=`mat3( ${ef.elements.map(e=>e.toFixed(4))} )`;switch(ce.getTransfer(i)){case Lo:return[t,"LinearTransferOETF"];case de:return[t,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space: ",i),[t,"LinearTransferOETF"]}}function nf(i,t,e){const n=i.getShaderParameter(t,i.COMPILE_STATUS),s=(i.getShaderInfoLog(t)||"").trim();if(n&&s==="")return"";const a=/ERROR: 0:(\d+)/.exec(s);if(a){const o=parseInt(a[1]);return e.toUpperCase()+`

`+s+`

`+y_(i.getShaderSource(t),o)}else return s}function S_(i,t){const e=b_(t);return[`vec4 ${i}( vec4 value ) {`,`	return ${e[1]}( vec4( value.rgb * ${e[0]}, value.a ) );`,"}"].join(`
`)}function w_(i,t){let e;switch(t){case Ap:e="Linear";break;case Rp:e="Reinhard";break;case Cp:e="Cineon";break;case Lp:e="ACESFilmic";break;case Dp:e="AgX";break;case cd:e="Neutral";break;case Pp:e="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",t),e="Linear"}return"vec3 "+i+"( vec3 color ) { return "+e+"ToneMapping( color ); }"}const po=new N;function E_(){ce.getLuminanceCoefficients(po);const i=po.x.toFixed(4),t=po.y.toFixed(4),e=po.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${i}, ${t}, ${e} );`,"	return dot( weights, rgb );","}"].join(`
`)}function T_(i){return[i.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",i.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(ra).join(`
`)}function A_(i){const t=[];for(const e in i){const n=i[e];n!==!1&&t.push("#define "+e+" "+n)}return t.join(`
`)}function R_(i,t){const e={},n=i.getProgramParameter(t,i.ACTIVE_ATTRIBUTES);for(let r=0;r<n;r++){const s=i.getActiveAttrib(t,r),a=s.name;let o=1;s.type===i.FLOAT_MAT2&&(o=2),s.type===i.FLOAT_MAT3&&(o=3),s.type===i.FLOAT_MAT4&&(o=4),e[a]={type:s.type,location:i.getAttribLocation(t,a),locationSize:o}}return e}function ra(i){return i!==""}function rf(i,t){const e=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return i.replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,e).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows)}function sf(i,t){return i.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}const C_=/^[ \t]*#include +<([\w\d./]+)>/gm;function Vl(i){return i.replace(C_,P_)}const L_=new Map;function P_(i,t){let e=ee[t];if(e===void 0){const n=L_.get(t);if(n!==void 0)e=ee[n],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',t,n);else throw new Error("Can not resolve #include <"+t+">")}return Vl(e)}const D_=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function af(i){return i.replace(D_,I_)}function I_(i,t,e,n){let r="";for(let s=parseInt(t);s<parseInt(e);s++)r+=n.replace(/\[\s*i\s*\]/g,"[ "+s+" ]").replace(/UNROLLED_LOOP_INDEX/g,s);return r}function of(i){let t=`precision ${i.precision} float;
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
#define LOW_PRECISION`),t}function U_(i){let t="SHADOWMAP_TYPE_BASIC";return i.shadowMapType===nd?t="SHADOWMAP_TYPE_PCF":i.shadowMapType===id?t="SHADOWMAP_TYPE_PCF_SOFT":i.shadowMapType===wi&&(t="SHADOWMAP_TYPE_VSM"),t}function N_(i){let t="ENVMAP_TYPE_CUBE";if(i.envMap)switch(i.envMapMode){case As:case Rs:t="ENVMAP_TYPE_CUBE";break;case Wo:t="ENVMAP_TYPE_CUBE_UV";break}return t}function F_(i){let t="ENVMAP_MODE_REFLECTION";if(i.envMap)switch(i.envMapMode){case Rs:t="ENVMAP_MODE_REFRACTION";break}return t}function O_(i){let t="ENVMAP_BLENDING_NONE";if(i.envMap)switch(i.combine){case od:t="ENVMAP_BLENDING_MULTIPLY";break;case Ep:t="ENVMAP_BLENDING_MIX";break;case Tp:t="ENVMAP_BLENDING_ADD";break}return t}function B_(i){const t=i.envMapCubeUVHeight;if(t===null)return null;const e=Math.log2(t)-2,n=1/t;return{texelWidth:1/(3*Math.max(Math.pow(2,e),112)),texelHeight:n,maxMip:e}}function k_(i,t,e,n){const r=i.getContext(),s=e.defines;let a=e.vertexShader,o=e.fragmentShader;const c=U_(e),l=N_(e),h=F_(e),u=O_(e),d=B_(e),f=T_(e),g=A_(s),v=r.createProgram();let m,p,y=e.glslVersion?"#version "+e.glslVersion+`
`:"";e.isRawShaderMaterial?(m=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g].filter(ra).join(`
`),m.length>0&&(m+=`
`),p=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g].filter(ra).join(`
`),p.length>0&&(p+=`
`)):(m=[of(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g,e.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",e.batching?"#define USE_BATCHING":"",e.batchingColor?"#define USE_BATCHING_COLOR":"",e.instancing?"#define USE_INSTANCING":"",e.instancingColor?"#define USE_INSTANCING_COLOR":"",e.instancingMorph?"#define USE_INSTANCING_MORPH":"",e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.map?"#define USE_MAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+h:"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.displacementMap?"#define USE_DISPLACEMENTMAP":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.mapUv?"#define MAP_UV "+e.mapUv:"",e.alphaMapUv?"#define ALPHAMAP_UV "+e.alphaMapUv:"",e.lightMapUv?"#define LIGHTMAP_UV "+e.lightMapUv:"",e.aoMapUv?"#define AOMAP_UV "+e.aoMapUv:"",e.emissiveMapUv?"#define EMISSIVEMAP_UV "+e.emissiveMapUv:"",e.bumpMapUv?"#define BUMPMAP_UV "+e.bumpMapUv:"",e.normalMapUv?"#define NORMALMAP_UV "+e.normalMapUv:"",e.displacementMapUv?"#define DISPLACEMENTMAP_UV "+e.displacementMapUv:"",e.metalnessMapUv?"#define METALNESSMAP_UV "+e.metalnessMapUv:"",e.roughnessMapUv?"#define ROUGHNESSMAP_UV "+e.roughnessMapUv:"",e.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+e.anisotropyMapUv:"",e.clearcoatMapUv?"#define CLEARCOATMAP_UV "+e.clearcoatMapUv:"",e.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+e.clearcoatNormalMapUv:"",e.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+e.clearcoatRoughnessMapUv:"",e.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+e.iridescenceMapUv:"",e.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+e.iridescenceThicknessMapUv:"",e.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+e.sheenColorMapUv:"",e.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+e.sheenRoughnessMapUv:"",e.specularMapUv?"#define SPECULARMAP_UV "+e.specularMapUv:"",e.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+e.specularColorMapUv:"",e.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+e.specularIntensityMapUv:"",e.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+e.transmissionMapUv:"",e.thicknessMapUv?"#define THICKNESSMAP_UV "+e.thicknessMapUv:"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.flatShading?"#define FLAT_SHADED":"",e.skinning?"#define USE_SKINNING":"",e.morphTargets?"#define USE_MORPHTARGETS":"",e.morphNormals&&e.flatShading===!1?"#define USE_MORPHNORMALS":"",e.morphColors?"#define USE_MORPHCOLORS":"",e.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+e.morphTextureStride:"",e.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+e.morphTargetsCount:"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+c:"",e.sizeAttenuation?"#define USE_SIZEATTENUATION":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",e.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(ra).join(`
`),p=[of(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g,e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",e.map?"#define USE_MAP":"",e.matcap?"#define USE_MATCAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+l:"",e.envMap?"#define "+h:"",e.envMap?"#define "+u:"",d?"#define CUBEUV_TEXEL_WIDTH "+d.texelWidth:"",d?"#define CUBEUV_TEXEL_HEIGHT "+d.texelHeight:"",d?"#define CUBEUV_MAX_MIP "+d.maxMip+".0":"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoat?"#define USE_CLEARCOAT":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.dispersion?"#define USE_DISPERSION":"",e.iridescence?"#define USE_IRIDESCENCE":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaTest?"#define USE_ALPHATEST":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.sheen?"#define USE_SHEEN":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors||e.instancingColor||e.batchingColor?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.gradientMap?"#define USE_GRADIENTMAP":"",e.flatShading?"#define FLAT_SHADED":"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+c:"",e.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",e.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",e.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",e.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",e.toneMapping!==Zi?"#define TONE_MAPPING":"",e.toneMapping!==Zi?ee.tonemapping_pars_fragment:"",e.toneMapping!==Zi?w_("toneMapping",e.toneMapping):"",e.dithering?"#define DITHERING":"",e.opaque?"#define OPAQUE":"",ee.colorspace_pars_fragment,S_("linearToOutputTexel",e.outputColorSpace),E_(),e.useDepthPacking?"#define DEPTH_PACKING "+e.depthPacking:"",`
`].filter(ra).join(`
`)),a=Vl(a),a=rf(a,e),a=sf(a,e),o=Vl(o),o=rf(o,e),o=sf(o,e),a=af(a),o=af(o),e.isRawShaderMaterial!==!0&&(y=`#version 300 es
`,m=[f,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+m,p=["#define varying in",e.glslVersion===ru?"":"layout(location = 0) out highp vec4 pc_fragColor;",e.glslVersion===ru?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+p);const M=y+m+a,b=y+p+o,w=tf(r,r.VERTEX_SHADER,M),T=tf(r,r.FRAGMENT_SHADER,b);r.attachShader(v,w),r.attachShader(v,T),e.index0AttributeName!==void 0?r.bindAttribLocation(v,0,e.index0AttributeName):e.morphTargets===!0&&r.bindAttribLocation(v,0,"position"),r.linkProgram(v);function A(S){if(i.debug.checkShaderErrors){const E=r.getProgramInfoLog(v)||"",P=r.getShaderInfoLog(w)||"",L=r.getShaderInfoLog(T)||"",I=E.trim(),B=P.trim(),X=L.trim();let H=!0,it=!0;if(r.getProgramParameter(v,r.LINK_STATUS)===!1)if(H=!1,typeof i.debug.onShaderError=="function")i.debug.onShaderError(r,v,w,T);else{const lt=nf(r,w,"vertex"),dt=nf(r,T,"fragment");console.error("THREE.WebGLProgram: Shader Error "+r.getError()+" - VALIDATE_STATUS "+r.getProgramParameter(v,r.VALIDATE_STATUS)+`

Material Name: `+S.name+`
Material Type: `+S.type+`

Program Info Log: `+I+`
`+lt+`
`+dt)}else I!==""?console.warn("THREE.WebGLProgram: Program Info Log:",I):(B===""||X==="")&&(it=!1);it&&(S.diagnostics={runnable:H,programLog:I,vertexShader:{log:B,prefix:m},fragmentShader:{log:X,prefix:p}})}r.deleteShader(w),r.deleteShader(T),R=new To(r,v),x=R_(r,v)}let R;this.getUniforms=function(){return R===void 0&&A(this),R};let x;this.getAttributes=function(){return x===void 0&&A(this),x};let _=e.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return _===!1&&(_=r.getProgramParameter(v,__)),_},this.destroy=function(){n.releaseStatesOfProgram(this),r.deleteProgram(v),this.program=void 0},this.type=e.shaderType,this.name=e.shaderName,this.id=M_++,this.cacheKey=t,this.usedTimes=1,this.program=v,this.vertexShader=w,this.fragmentShader=T,this}let z_=0;class H_{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(t){const e=t.vertexShader,n=t.fragmentShader,r=this._getShaderStage(e),s=this._getShaderStage(n),a=this._getShaderCacheForMaterial(t);return a.has(r)===!1&&(a.add(r),r.usedTimes++),a.has(s)===!1&&(a.add(s),s.usedTimes++),this}remove(t){const e=this.materialCache.get(t);for(const n of e)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(t),this}getVertexShaderID(t){return this._getShaderStage(t.vertexShader).id}getFragmentShaderID(t){return this._getShaderStage(t.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(t){const e=this.materialCache;let n=e.get(t);return n===void 0&&(n=new Set,e.set(t,n)),n}_getShaderStage(t){const e=this.shaderCache;let n=e.get(t);return n===void 0&&(n=new V_(t),e.set(t,n)),n}}class V_{constructor(t){this.id=z_++,this.code=t,this.usedTimes=0}}function G_(i,t,e,n,r,s,a){const o=new yd,c=new H_,l=new Set,h=[],u=r.logarithmicDepthBuffer,d=r.vertexTextures;let f=r.precision;const g={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function v(x){return l.add(x),x===0?"uv":`uv${x}`}function m(x,_,S,E,P){const L=E.fog,I=P.geometry,B=x.isMeshStandardMaterial?E.environment:null,X=(x.isMeshStandardMaterial?e:t).get(x.envMap||B),H=X&&X.mapping===Wo?X.image.height:null,it=g[x.type];x.precision!==null&&(f=r.getMaxPrecision(x.precision),f!==x.precision&&console.warn("THREE.WebGLProgram.getParameters:",x.precision,"not supported, using",f,"instead."));const lt=I.morphAttributes.position||I.morphAttributes.normal||I.morphAttributes.color,dt=lt!==void 0?lt.length:0;let vt=0;I.morphAttributes.position!==void 0&&(vt=1),I.morphAttributes.normal!==void 0&&(vt=2),I.morphAttributes.color!==void 0&&(vt=3);let wt,Ft,ot,V;if(it){const he=oi[it];wt=he.vertexShader,Ft=he.fragmentShader}else wt=x.vertexShader,Ft=x.fragmentShader,c.update(x),ot=c.getVertexShaderID(x),V=c.getFragmentShaderID(x);const Z=i.getRenderTarget(),k=i.state.buffers.depth.getReversed(),G=P.isInstancedMesh===!0,z=P.isBatchedMesh===!0,K=!!x.map,et=!!x.matcap,U=!!X,J=!!x.aoMap,j=!!x.lightMap,Q=!!x.bumpMap,st=!!x.normalMap,ut=!!x.displacementMap,mt=!!x.emissiveMap,xt=!!x.metalnessMap,Jt=!!x.roughnessMap,$t=x.anisotropy>0,F=x.clearcoat>0,C=x.dispersion>0,$=x.iridescence>0,at=x.sheen>0,gt=x.transmission>0,ht=$t&&!!x.anisotropyMap,Ht=F&&!!x.clearcoatMap,Et=F&&!!x.clearcoatNormalMap,Bt=F&&!!x.clearcoatRoughnessMap,kt=$&&!!x.iridescenceMap,_t=$&&!!x.iridescenceThicknessMap,Lt=at&&!!x.sheenColorMap,jt=at&&!!x.sheenRoughnessMap,Vt=!!x.specularMap,Rt=!!x.specularColorMap,Qt=!!x.specularIntensityMap,W=gt&&!!x.transmissionMap,bt=gt&&!!x.thicknessMap,Tt=!!x.gradientMap,Nt=!!x.alphaMap,Mt=x.alphaTest>0,pt=!!x.alphaHash,zt=!!x.extensions;let Kt=Zi;x.toneMapped&&(Z===null||Z.isXRRenderTarget===!0)&&(Kt=i.toneMapping);const me={shaderID:it,shaderType:x.type,shaderName:x.name,vertexShader:wt,fragmentShader:Ft,defines:x.defines,customVertexShaderID:ot,customFragmentShaderID:V,isRawShaderMaterial:x.isRawShaderMaterial===!0,glslVersion:x.glslVersion,precision:f,batching:z,batchingColor:z&&P._colorsTexture!==null,instancing:G,instancingColor:G&&P.instanceColor!==null,instancingMorph:G&&P.morphTexture!==null,supportsVertexTextures:d,outputColorSpace:Z===null?i.outputColorSpace:Z.isXRRenderTarget===!0?Z.texture.colorSpace:br,alphaToCoverage:!!x.alphaToCoverage,map:K,matcap:et,envMap:U,envMapMode:U&&X.mapping,envMapCubeUVHeight:H,aoMap:J,lightMap:j,bumpMap:Q,normalMap:st,displacementMap:d&&ut,emissiveMap:mt,normalMapObjectSpace:st&&x.normalMapType===Op,normalMapTangentSpace:st&&x.normalMapType===xd,metalnessMap:xt,roughnessMap:Jt,anisotropy:$t,anisotropyMap:ht,clearcoat:F,clearcoatMap:Ht,clearcoatNormalMap:Et,clearcoatRoughnessMap:Bt,dispersion:C,iridescence:$,iridescenceMap:kt,iridescenceThicknessMap:_t,sheen:at,sheenColorMap:Lt,sheenRoughnessMap:jt,specularMap:Vt,specularColorMap:Rt,specularIntensityMap:Qt,transmission:gt,transmissionMap:W,thicknessMap:bt,gradientMap:Tt,opaque:x.transparent===!1&&x.blending===xs&&x.alphaToCoverage===!1,alphaMap:Nt,alphaTest:Mt,alphaHash:pt,combine:x.combine,mapUv:K&&v(x.map.channel),aoMapUv:J&&v(x.aoMap.channel),lightMapUv:j&&v(x.lightMap.channel),bumpMapUv:Q&&v(x.bumpMap.channel),normalMapUv:st&&v(x.normalMap.channel),displacementMapUv:ut&&v(x.displacementMap.channel),emissiveMapUv:mt&&v(x.emissiveMap.channel),metalnessMapUv:xt&&v(x.metalnessMap.channel),roughnessMapUv:Jt&&v(x.roughnessMap.channel),anisotropyMapUv:ht&&v(x.anisotropyMap.channel),clearcoatMapUv:Ht&&v(x.clearcoatMap.channel),clearcoatNormalMapUv:Et&&v(x.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:Bt&&v(x.clearcoatRoughnessMap.channel),iridescenceMapUv:kt&&v(x.iridescenceMap.channel),iridescenceThicknessMapUv:_t&&v(x.iridescenceThicknessMap.channel),sheenColorMapUv:Lt&&v(x.sheenColorMap.channel),sheenRoughnessMapUv:jt&&v(x.sheenRoughnessMap.channel),specularMapUv:Vt&&v(x.specularMap.channel),specularColorMapUv:Rt&&v(x.specularColorMap.channel),specularIntensityMapUv:Qt&&v(x.specularIntensityMap.channel),transmissionMapUv:W&&v(x.transmissionMap.channel),thicknessMapUv:bt&&v(x.thicknessMap.channel),alphaMapUv:Nt&&v(x.alphaMap.channel),vertexTangents:!!I.attributes.tangent&&(st||$t),vertexColors:x.vertexColors,vertexAlphas:x.vertexColors===!0&&!!I.attributes.color&&I.attributes.color.itemSize===4,pointsUvs:P.isPoints===!0&&!!I.attributes.uv&&(K||Nt),fog:!!L,useFog:x.fog===!0,fogExp2:!!L&&L.isFogExp2,flatShading:x.flatShading===!0&&x.wireframe===!1,sizeAttenuation:x.sizeAttenuation===!0,logarithmicDepthBuffer:u,reversedDepthBuffer:k,skinning:P.isSkinnedMesh===!0,morphTargets:I.morphAttributes.position!==void 0,morphNormals:I.morphAttributes.normal!==void 0,morphColors:I.morphAttributes.color!==void 0,morphTargetsCount:dt,morphTextureStride:vt,numDirLights:_.directional.length,numPointLights:_.point.length,numSpotLights:_.spot.length,numSpotLightMaps:_.spotLightMap.length,numRectAreaLights:_.rectArea.length,numHemiLights:_.hemi.length,numDirLightShadows:_.directionalShadowMap.length,numPointLightShadows:_.pointShadowMap.length,numSpotLightShadows:_.spotShadowMap.length,numSpotLightShadowsWithMaps:_.numSpotLightShadowsWithMaps,numLightProbes:_.numLightProbes,numClippingPlanes:a.numPlanes,numClipIntersection:a.numIntersection,dithering:x.dithering,shadowMapEnabled:i.shadowMap.enabled&&S.length>0,shadowMapType:i.shadowMap.type,toneMapping:Kt,decodeVideoTexture:K&&x.map.isVideoTexture===!0&&ce.getTransfer(x.map.colorSpace)===de,decodeVideoTextureEmissive:mt&&x.emissiveMap.isVideoTexture===!0&&ce.getTransfer(x.emissiveMap.colorSpace)===de,premultipliedAlpha:x.premultipliedAlpha,doubleSided:x.side===Ze,flipSided:x.side===vn,useDepthPacking:x.depthPacking>=0,depthPacking:x.depthPacking||0,index0AttributeName:x.index0AttributeName,extensionClipCullDistance:zt&&x.extensions.clipCullDistance===!0&&n.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(zt&&x.extensions.multiDraw===!0||z)&&n.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:n.has("KHR_parallel_shader_compile"),customProgramCacheKey:x.customProgramCacheKey()};return me.vertexUv1s=l.has(1),me.vertexUv2s=l.has(2),me.vertexUv3s=l.has(3),l.clear(),me}function p(x){const _=[];if(x.shaderID?_.push(x.shaderID):(_.push(x.customVertexShaderID),_.push(x.customFragmentShaderID)),x.defines!==void 0)for(const S in x.defines)_.push(S),_.push(x.defines[S]);return x.isRawShaderMaterial===!1&&(y(_,x),M(_,x),_.push(i.outputColorSpace)),_.push(x.customProgramCacheKey),_.join()}function y(x,_){x.push(_.precision),x.push(_.outputColorSpace),x.push(_.envMapMode),x.push(_.envMapCubeUVHeight),x.push(_.mapUv),x.push(_.alphaMapUv),x.push(_.lightMapUv),x.push(_.aoMapUv),x.push(_.bumpMapUv),x.push(_.normalMapUv),x.push(_.displacementMapUv),x.push(_.emissiveMapUv),x.push(_.metalnessMapUv),x.push(_.roughnessMapUv),x.push(_.anisotropyMapUv),x.push(_.clearcoatMapUv),x.push(_.clearcoatNormalMapUv),x.push(_.clearcoatRoughnessMapUv),x.push(_.iridescenceMapUv),x.push(_.iridescenceThicknessMapUv),x.push(_.sheenColorMapUv),x.push(_.sheenRoughnessMapUv),x.push(_.specularMapUv),x.push(_.specularColorMapUv),x.push(_.specularIntensityMapUv),x.push(_.transmissionMapUv),x.push(_.thicknessMapUv),x.push(_.combine),x.push(_.fogExp2),x.push(_.sizeAttenuation),x.push(_.morphTargetsCount),x.push(_.morphAttributeCount),x.push(_.numDirLights),x.push(_.numPointLights),x.push(_.numSpotLights),x.push(_.numSpotLightMaps),x.push(_.numHemiLights),x.push(_.numRectAreaLights),x.push(_.numDirLightShadows),x.push(_.numPointLightShadows),x.push(_.numSpotLightShadows),x.push(_.numSpotLightShadowsWithMaps),x.push(_.numLightProbes),x.push(_.shadowMapType),x.push(_.toneMapping),x.push(_.numClippingPlanes),x.push(_.numClipIntersection),x.push(_.depthPacking)}function M(x,_){o.disableAll(),_.supportsVertexTextures&&o.enable(0),_.instancing&&o.enable(1),_.instancingColor&&o.enable(2),_.instancingMorph&&o.enable(3),_.matcap&&o.enable(4),_.envMap&&o.enable(5),_.normalMapObjectSpace&&o.enable(6),_.normalMapTangentSpace&&o.enable(7),_.clearcoat&&o.enable(8),_.iridescence&&o.enable(9),_.alphaTest&&o.enable(10),_.vertexColors&&o.enable(11),_.vertexAlphas&&o.enable(12),_.vertexUv1s&&o.enable(13),_.vertexUv2s&&o.enable(14),_.vertexUv3s&&o.enable(15),_.vertexTangents&&o.enable(16),_.anisotropy&&o.enable(17),_.alphaHash&&o.enable(18),_.batching&&o.enable(19),_.dispersion&&o.enable(20),_.batchingColor&&o.enable(21),_.gradientMap&&o.enable(22),x.push(o.mask),o.disableAll(),_.fog&&o.enable(0),_.useFog&&o.enable(1),_.flatShading&&o.enable(2),_.logarithmicDepthBuffer&&o.enable(3),_.reversedDepthBuffer&&o.enable(4),_.skinning&&o.enable(5),_.morphTargets&&o.enable(6),_.morphNormals&&o.enable(7),_.morphColors&&o.enable(8),_.premultipliedAlpha&&o.enable(9),_.shadowMapEnabled&&o.enable(10),_.doubleSided&&o.enable(11),_.flipSided&&o.enable(12),_.useDepthPacking&&o.enable(13),_.dithering&&o.enable(14),_.transmission&&o.enable(15),_.sheen&&o.enable(16),_.opaque&&o.enable(17),_.pointsUvs&&o.enable(18),_.decodeVideoTexture&&o.enable(19),_.decodeVideoTextureEmissive&&o.enable(20),_.alphaToCoverage&&o.enable(21),x.push(o.mask)}function b(x){const _=g[x.type];let S;if(_){const E=oi[_];S=P1.clone(E.uniforms)}else S=x.uniforms;return S}function w(x,_){let S;for(let E=0,P=h.length;E<P;E++){const L=h[E];if(L.cacheKey===_){S=L,++S.usedTimes;break}}return S===void 0&&(S=new k_(i,_,x,s),h.push(S)),S}function T(x){if(--x.usedTimes===0){const _=h.indexOf(x);h[_]=h[h.length-1],h.pop(),x.destroy()}}function A(x){c.remove(x)}function R(){c.dispose()}return{getParameters:m,getProgramCacheKey:p,getUniforms:b,acquireProgram:w,releaseProgram:T,releaseShaderCache:A,programs:h,dispose:R}}function W_(){let i=new WeakMap;function t(a){return i.has(a)}function e(a){let o=i.get(a);return o===void 0&&(o={},i.set(a,o)),o}function n(a){i.delete(a)}function r(a,o,c){i.get(a)[o]=c}function s(){i=new WeakMap}return{has:t,get:e,remove:n,update:r,dispose:s}}function X_(i,t){return i.groupOrder!==t.groupOrder?i.groupOrder-t.groupOrder:i.renderOrder!==t.renderOrder?i.renderOrder-t.renderOrder:i.material.id!==t.material.id?i.material.id-t.material.id:i.z!==t.z?i.z-t.z:i.id-t.id}function cf(i,t){return i.groupOrder!==t.groupOrder?i.groupOrder-t.groupOrder:i.renderOrder!==t.renderOrder?i.renderOrder-t.renderOrder:i.z!==t.z?t.z-i.z:i.id-t.id}function lf(){const i=[];let t=0;const e=[],n=[],r=[];function s(){t=0,e.length=0,n.length=0,r.length=0}function a(u,d,f,g,v,m){let p=i[t];return p===void 0?(p={id:u.id,object:u,geometry:d,material:f,groupOrder:g,renderOrder:u.renderOrder,z:v,group:m},i[t]=p):(p.id=u.id,p.object=u,p.geometry=d,p.material=f,p.groupOrder=g,p.renderOrder=u.renderOrder,p.z=v,p.group=m),t++,p}function o(u,d,f,g,v,m){const p=a(u,d,f,g,v,m);f.transmission>0?n.push(p):f.transparent===!0?r.push(p):e.push(p)}function c(u,d,f,g,v,m){const p=a(u,d,f,g,v,m);f.transmission>0?n.unshift(p):f.transparent===!0?r.unshift(p):e.unshift(p)}function l(u,d){e.length>1&&e.sort(u||X_),n.length>1&&n.sort(d||cf),r.length>1&&r.sort(d||cf)}function h(){for(let u=t,d=i.length;u<d;u++){const f=i[u];if(f.id===null)break;f.id=null,f.object=null,f.geometry=null,f.material=null,f.group=null}}return{opaque:e,transmissive:n,transparent:r,init:s,push:o,unshift:c,finish:h,sort:l}}function q_(){let i=new WeakMap;function t(n,r){const s=i.get(n);let a;return s===void 0?(a=new lf,i.set(n,[a])):r>=s.length?(a=new lf,s.push(a)):a=s[r],a}function e(){i=new WeakMap}return{get:t,dispose:e}}function Y_(){const i={};return{get:function(t){if(i[t.id]!==void 0)return i[t.id];let e;switch(t.type){case"DirectionalLight":e={direction:new N,color:new Pt};break;case"SpotLight":e={position:new N,direction:new N,color:new Pt,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":e={position:new N,color:new Pt,distance:0,decay:0};break;case"HemisphereLight":e={direction:new N,skyColor:new Pt,groundColor:new Pt};break;case"RectAreaLight":e={color:new Pt,position:new N,halfWidth:new N,halfHeight:new N};break}return i[t.id]=e,e}}}function $_(){const i={};return{get:function(t){if(i[t.id]!==void 0)return i[t.id];let e;switch(t.type){case"DirectionalLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ft};break;case"SpotLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ft};break;case"PointLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ft,shadowCameraNear:1,shadowCameraFar:1e3};break}return i[t.id]=e,e}}}let j_=0;function Z_(i,t){return(t.castShadow?2:0)-(i.castShadow?2:0)+(t.map?1:0)-(i.map?1:0)}function J_(i){const t=new Y_,e=$_(),n={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let l=0;l<9;l++)n.probe.push(new N);const r=new N,s=new ie,a=new ie;function o(l){let h=0,u=0,d=0;for(let x=0;x<9;x++)n.probe[x].set(0,0,0);let f=0,g=0,v=0,m=0,p=0,y=0,M=0,b=0,w=0,T=0,A=0;l.sort(Z_);for(let x=0,_=l.length;x<_;x++){const S=l[x],E=S.color,P=S.intensity,L=S.distance,I=S.shadow&&S.shadow.map?S.shadow.map.texture:null;if(S.isAmbientLight)h+=E.r*P,u+=E.g*P,d+=E.b*P;else if(S.isLightProbe){for(let B=0;B<9;B++)n.probe[B].addScaledVector(S.sh.coefficients[B],P);A++}else if(S.isDirectionalLight){const B=t.get(S);if(B.color.copy(S.color).multiplyScalar(S.intensity),S.castShadow){const X=S.shadow,H=e.get(S);H.shadowIntensity=X.intensity,H.shadowBias=X.bias,H.shadowNormalBias=X.normalBias,H.shadowRadius=X.radius,H.shadowMapSize=X.mapSize,n.directionalShadow[f]=H,n.directionalShadowMap[f]=I,n.directionalShadowMatrix[f]=S.shadow.matrix,y++}n.directional[f]=B,f++}else if(S.isSpotLight){const B=t.get(S);B.position.setFromMatrixPosition(S.matrixWorld),B.color.copy(E).multiplyScalar(P),B.distance=L,B.coneCos=Math.cos(S.angle),B.penumbraCos=Math.cos(S.angle*(1-S.penumbra)),B.decay=S.decay,n.spot[v]=B;const X=S.shadow;if(S.map&&(n.spotLightMap[w]=S.map,w++,X.updateMatrices(S),S.castShadow&&T++),n.spotLightMatrix[v]=X.matrix,S.castShadow){const H=e.get(S);H.shadowIntensity=X.intensity,H.shadowBias=X.bias,H.shadowNormalBias=X.normalBias,H.shadowRadius=X.radius,H.shadowMapSize=X.mapSize,n.spotShadow[v]=H,n.spotShadowMap[v]=I,b++}v++}else if(S.isRectAreaLight){const B=t.get(S);B.color.copy(E).multiplyScalar(P),B.halfWidth.set(S.width*.5,0,0),B.halfHeight.set(0,S.height*.5,0),n.rectArea[m]=B,m++}else if(S.isPointLight){const B=t.get(S);if(B.color.copy(S.color).multiplyScalar(S.intensity),B.distance=S.distance,B.decay=S.decay,S.castShadow){const X=S.shadow,H=e.get(S);H.shadowIntensity=X.intensity,H.shadowBias=X.bias,H.shadowNormalBias=X.normalBias,H.shadowRadius=X.radius,H.shadowMapSize=X.mapSize,H.shadowCameraNear=X.camera.near,H.shadowCameraFar=X.camera.far,n.pointShadow[g]=H,n.pointShadowMap[g]=I,n.pointShadowMatrix[g]=S.shadow.matrix,M++}n.point[g]=B,g++}else if(S.isHemisphereLight){const B=t.get(S);B.skyColor.copy(S.color).multiplyScalar(P),B.groundColor.copy(S.groundColor).multiplyScalar(P),n.hemi[p]=B,p++}}m>0&&(i.has("OES_texture_float_linear")===!0?(n.rectAreaLTC1=At.LTC_FLOAT_1,n.rectAreaLTC2=At.LTC_FLOAT_2):(n.rectAreaLTC1=At.LTC_HALF_1,n.rectAreaLTC2=At.LTC_HALF_2)),n.ambient[0]=h,n.ambient[1]=u,n.ambient[2]=d;const R=n.hash;(R.directionalLength!==f||R.pointLength!==g||R.spotLength!==v||R.rectAreaLength!==m||R.hemiLength!==p||R.numDirectionalShadows!==y||R.numPointShadows!==M||R.numSpotShadows!==b||R.numSpotMaps!==w||R.numLightProbes!==A)&&(n.directional.length=f,n.spot.length=v,n.rectArea.length=m,n.point.length=g,n.hemi.length=p,n.directionalShadow.length=y,n.directionalShadowMap.length=y,n.pointShadow.length=M,n.pointShadowMap.length=M,n.spotShadow.length=b,n.spotShadowMap.length=b,n.directionalShadowMatrix.length=y,n.pointShadowMatrix.length=M,n.spotLightMatrix.length=b+w-T,n.spotLightMap.length=w,n.numSpotLightShadowsWithMaps=T,n.numLightProbes=A,R.directionalLength=f,R.pointLength=g,R.spotLength=v,R.rectAreaLength=m,R.hemiLength=p,R.numDirectionalShadows=y,R.numPointShadows=M,R.numSpotShadows=b,R.numSpotMaps=w,R.numLightProbes=A,n.version=j_++)}function c(l,h){let u=0,d=0,f=0,g=0,v=0;const m=h.matrixWorldInverse;for(let p=0,y=l.length;p<y;p++){const M=l[p];if(M.isDirectionalLight){const b=n.directional[u];b.direction.setFromMatrixPosition(M.matrixWorld),r.setFromMatrixPosition(M.target.matrixWorld),b.direction.sub(r),b.direction.transformDirection(m),u++}else if(M.isSpotLight){const b=n.spot[f];b.position.setFromMatrixPosition(M.matrixWorld),b.position.applyMatrix4(m),b.direction.setFromMatrixPosition(M.matrixWorld),r.setFromMatrixPosition(M.target.matrixWorld),b.direction.sub(r),b.direction.transformDirection(m),f++}else if(M.isRectAreaLight){const b=n.rectArea[g];b.position.setFromMatrixPosition(M.matrixWorld),b.position.applyMatrix4(m),a.identity(),s.copy(M.matrixWorld),s.premultiply(m),a.extractRotation(s),b.halfWidth.set(M.width*.5,0,0),b.halfHeight.set(0,M.height*.5,0),b.halfWidth.applyMatrix4(a),b.halfHeight.applyMatrix4(a),g++}else if(M.isPointLight){const b=n.point[d];b.position.setFromMatrixPosition(M.matrixWorld),b.position.applyMatrix4(m),d++}else if(M.isHemisphereLight){const b=n.hemi[v];b.direction.setFromMatrixPosition(M.matrixWorld),b.direction.transformDirection(m),v++}}}return{setup:o,setupView:c,state:n}}function hf(i){const t=new J_(i),e=[],n=[];function r(h){l.camera=h,e.length=0,n.length=0}function s(h){e.push(h)}function a(h){n.push(h)}function o(){t.setup(e)}function c(h){t.setupView(e,h)}const l={lightsArray:e,shadowsArray:n,camera:null,lights:t,transmissionRenderTarget:{}};return{init:r,state:l,setupLights:o,setupLightsView:c,pushLight:s,pushShadow:a}}function K_(i){let t=new WeakMap;function e(r,s=0){const a=t.get(r);let o;return a===void 0?(o=new hf(i),t.set(r,[o])):s>=a.length?(o=new hf(i),a.push(o)):o=a[s],o}function n(){t=new WeakMap}return{get:e,dispose:n}}const Q_=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,t2=`uniform sampler2D shadow_pass;
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
}`;function e2(i,t,e){let n=new mh;const r=new ft,s=new ft,a=new le,o=new wm({depthPacking:Fp}),c=new Em,l={},h=e.maxTextureSize,u={[Ki]:vn,[vn]:Ki,[Ze]:Ze},d=new ze({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new ft},radius:{value:4}},vertexShader:Q_,fragmentShader:t2}),f=d.clone();f.defines.HORIZONTAL_PASS=1;const g=new Se;g.setAttribute("position",new ae(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const v=new It(g,d),m=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=nd;let p=this.type;this.render=function(T,A,R){if(m.enabled===!1||m.autoUpdate===!1&&m.needsUpdate===!1||T.length===0)return;const x=i.getRenderTarget(),_=i.getActiveCubeFace(),S=i.getActiveMipmapLevel(),E=i.state;E.setBlending(ji),E.buffers.depth.getReversed()===!0?E.buffers.color.setClear(0,0,0,0):E.buffers.color.setClear(1,1,1,1),E.buffers.depth.setTest(!0),E.setScissorTest(!1);const P=p!==wi&&this.type===wi,L=p===wi&&this.type!==wi;for(let I=0,B=T.length;I<B;I++){const X=T[I],H=X.shadow;if(H===void 0){console.warn("THREE.WebGLShadowMap:",X,"has no shadow.");continue}if(H.autoUpdate===!1&&H.needsUpdate===!1)continue;r.copy(H.mapSize);const it=H.getFrameExtents();if(r.multiply(it),s.copy(H.mapSize),(r.x>h||r.y>h)&&(r.x>h&&(s.x=Math.floor(h/it.x),r.x=s.x*it.x,H.mapSize.x=s.x),r.y>h&&(s.y=Math.floor(h/it.y),r.y=s.y*it.y,H.mapSize.y=s.y)),H.map===null||P===!0||L===!0){const dt=this.type!==wi?{minFilter:An,magFilter:An}:{};H.map!==null&&H.map.dispose(),H.map=new on(r.x,r.y,dt),H.map.texture.name=X.name+".shadowMap",H.camera.updateProjectionMatrix()}i.setRenderTarget(H.map),i.clear();const lt=H.getViewportCount();for(let dt=0;dt<lt;dt++){const vt=H.getViewport(dt);a.set(s.x*vt.x,s.y*vt.y,s.x*vt.z,s.y*vt.w),E.viewport(a),H.updateMatrices(X,dt),n=H.getFrustum(),b(A,R,H.camera,X,this.type)}H.isPointLightShadow!==!0&&this.type===wi&&y(H,R),H.needsUpdate=!1}p=this.type,m.needsUpdate=!1,i.setRenderTarget(x,_,S)};function y(T,A){const R=t.update(v);d.defines.VSM_SAMPLES!==T.blurSamples&&(d.defines.VSM_SAMPLES=T.blurSamples,f.defines.VSM_SAMPLES=T.blurSamples,d.needsUpdate=!0,f.needsUpdate=!0),T.mapPass===null&&(T.mapPass=new on(r.x,r.y)),d.uniforms.shadow_pass.value=T.map.texture,d.uniforms.resolution.value=T.mapSize,d.uniforms.radius.value=T.radius,i.setRenderTarget(T.mapPass),i.clear(),i.renderBufferDirect(A,null,R,d,v,null),f.uniforms.shadow_pass.value=T.mapPass.texture,f.uniforms.resolution.value=T.mapSize,f.uniforms.radius.value=T.radius,i.setRenderTarget(T.map),i.clear(),i.renderBufferDirect(A,null,R,f,v,null)}function M(T,A,R,x){let _=null;const S=R.isPointLight===!0?T.customDistanceMaterial:T.customDepthMaterial;if(S!==void 0)_=S;else if(_=R.isPointLight===!0?c:o,i.localClippingEnabled&&A.clipShadows===!0&&Array.isArray(A.clippingPlanes)&&A.clippingPlanes.length!==0||A.displacementMap&&A.displacementScale!==0||A.alphaMap&&A.alphaTest>0||A.map&&A.alphaTest>0||A.alphaToCoverage===!0){const E=_.uuid,P=A.uuid;let L=l[E];L===void 0&&(L={},l[E]=L);let I=L[P];I===void 0&&(I=_.clone(),L[P]=I,A.addEventListener("dispose",w)),_=I}if(_.visible=A.visible,_.wireframe=A.wireframe,x===wi?_.side=A.shadowSide!==null?A.shadowSide:A.side:_.side=A.shadowSide!==null?A.shadowSide:u[A.side],_.alphaMap=A.alphaMap,_.alphaTest=A.alphaToCoverage===!0?.5:A.alphaTest,_.map=A.map,_.clipShadows=A.clipShadows,_.clippingPlanes=A.clippingPlanes,_.clipIntersection=A.clipIntersection,_.displacementMap=A.displacementMap,_.displacementScale=A.displacementScale,_.displacementBias=A.displacementBias,_.wireframeLinewidth=A.wireframeLinewidth,_.linewidth=A.linewidth,R.isPointLight===!0&&_.isMeshDistanceMaterial===!0){const E=i.properties.get(_);E.light=R}return _}function b(T,A,R,x,_){if(T.visible===!1)return;if(T.layers.test(A.layers)&&(T.isMesh||T.isLine||T.isPoints)&&(T.castShadow||T.receiveShadow&&_===wi)&&(!T.frustumCulled||n.intersectsObject(T))){T.modelViewMatrix.multiplyMatrices(R.matrixWorldInverse,T.matrixWorld);const P=t.update(T),L=T.material;if(Array.isArray(L)){const I=P.groups;for(let B=0,X=I.length;B<X;B++){const H=I[B],it=L[H.materialIndex];if(it&&it.visible){const lt=M(T,it,x,_);T.onBeforeShadow(i,T,A,R,P,lt,H),i.renderBufferDirect(R,null,P,lt,T,H),T.onAfterShadow(i,T,A,R,P,lt,H)}}}else if(L.visible){const I=M(T,L,x,_);T.onBeforeShadow(i,T,A,R,P,I,null),i.renderBufferDirect(R,null,P,I,T,null),T.onAfterShadow(i,T,A,R,P,I,null)}}const E=T.children;for(let P=0,L=E.length;P<L;P++)b(E[P],A,R,x,_)}function w(T){T.target.removeEventListener("dispose",w);for(const R in l){const x=l[R],_=T.target.uuid;_ in x&&(x[_].dispose(),delete x[_])}}}const n2={[Kc]:Qc,[tl]:il,[el]:rl,[Ts]:nl,[Qc]:Kc,[il]:tl,[rl]:el,[nl]:Ts};function i2(i,t){function e(){let W=!1;const bt=new le;let Tt=null;const Nt=new le(0,0,0,0);return{setMask:function(Mt){Tt!==Mt&&!W&&(i.colorMask(Mt,Mt,Mt,Mt),Tt=Mt)},setLocked:function(Mt){W=Mt},setClear:function(Mt,pt,zt,Kt,me){me===!0&&(Mt*=Kt,pt*=Kt,zt*=Kt),bt.set(Mt,pt,zt,Kt),Nt.equals(bt)===!1&&(i.clearColor(Mt,pt,zt,Kt),Nt.copy(bt))},reset:function(){W=!1,Tt=null,Nt.set(-1,0,0,0)}}}function n(){let W=!1,bt=!1,Tt=null,Nt=null,Mt=null;return{setReversed:function(pt){if(bt!==pt){const zt=t.get("EXT_clip_control");pt?zt.clipControlEXT(zt.LOWER_LEFT_EXT,zt.ZERO_TO_ONE_EXT):zt.clipControlEXT(zt.LOWER_LEFT_EXT,zt.NEGATIVE_ONE_TO_ONE_EXT),bt=pt;const Kt=Mt;Mt=null,this.setClear(Kt)}},getReversed:function(){return bt},setTest:function(pt){pt?Z(i.DEPTH_TEST):k(i.DEPTH_TEST)},setMask:function(pt){Tt!==pt&&!W&&(i.depthMask(pt),Tt=pt)},setFunc:function(pt){if(bt&&(pt=n2[pt]),Nt!==pt){switch(pt){case Kc:i.depthFunc(i.NEVER);break;case Qc:i.depthFunc(i.ALWAYS);break;case tl:i.depthFunc(i.LESS);break;case Ts:i.depthFunc(i.LEQUAL);break;case el:i.depthFunc(i.EQUAL);break;case nl:i.depthFunc(i.GEQUAL);break;case il:i.depthFunc(i.GREATER);break;case rl:i.depthFunc(i.NOTEQUAL);break;default:i.depthFunc(i.LEQUAL)}Nt=pt}},setLocked:function(pt){W=pt},setClear:function(pt){Mt!==pt&&(bt&&(pt=1-pt),i.clearDepth(pt),Mt=pt)},reset:function(){W=!1,Tt=null,Nt=null,Mt=null,bt=!1}}}function r(){let W=!1,bt=null,Tt=null,Nt=null,Mt=null,pt=null,zt=null,Kt=null,me=null;return{setTest:function(he){W||(he?Z(i.STENCIL_TEST):k(i.STENCIL_TEST))},setMask:function(he){bt!==he&&!W&&(i.stencilMask(he),bt=he)},setFunc:function(he,vi,Kn){(Tt!==he||Nt!==vi||Mt!==Kn)&&(i.stencilFunc(he,vi,Kn),Tt=he,Nt=vi,Mt=Kn)},setOp:function(he,vi,Kn){(pt!==he||zt!==vi||Kt!==Kn)&&(i.stencilOp(he,vi,Kn),pt=he,zt=vi,Kt=Kn)},setLocked:function(he){W=he},setClear:function(he){me!==he&&(i.clearStencil(he),me=he)},reset:function(){W=!1,bt=null,Tt=null,Nt=null,Mt=null,pt=null,zt=null,Kt=null,me=null}}}const s=new e,a=new n,o=new r,c=new WeakMap,l=new WeakMap;let h={},u={},d=new WeakMap,f=[],g=null,v=!1,m=null,p=null,y=null,M=null,b=null,w=null,T=null,A=new Pt(0,0,0),R=0,x=!1,_=null,S=null,E=null,P=null,L=null;const I=i.getParameter(i.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let B=!1,X=0;const H=i.getParameter(i.VERSION);H.indexOf("WebGL")!==-1?(X=parseFloat(/^WebGL (\d)/.exec(H)[1]),B=X>=1):H.indexOf("OpenGL ES")!==-1&&(X=parseFloat(/^OpenGL ES (\d)/.exec(H)[1]),B=X>=2);let it=null,lt={};const dt=i.getParameter(i.SCISSOR_BOX),vt=i.getParameter(i.VIEWPORT),wt=new le().fromArray(dt),Ft=new le().fromArray(vt);function ot(W,bt,Tt,Nt){const Mt=new Uint8Array(4),pt=i.createTexture();i.bindTexture(W,pt),i.texParameteri(W,i.TEXTURE_MIN_FILTER,i.NEAREST),i.texParameteri(W,i.TEXTURE_MAG_FILTER,i.NEAREST);for(let zt=0;zt<Tt;zt++)W===i.TEXTURE_3D||W===i.TEXTURE_2D_ARRAY?i.texImage3D(bt,0,i.RGBA,1,1,Nt,0,i.RGBA,i.UNSIGNED_BYTE,Mt):i.texImage2D(bt+zt,0,i.RGBA,1,1,0,i.RGBA,i.UNSIGNED_BYTE,Mt);return pt}const V={};V[i.TEXTURE_2D]=ot(i.TEXTURE_2D,i.TEXTURE_2D,1),V[i.TEXTURE_CUBE_MAP]=ot(i.TEXTURE_CUBE_MAP,i.TEXTURE_CUBE_MAP_POSITIVE_X,6),V[i.TEXTURE_2D_ARRAY]=ot(i.TEXTURE_2D_ARRAY,i.TEXTURE_2D_ARRAY,1,1),V[i.TEXTURE_3D]=ot(i.TEXTURE_3D,i.TEXTURE_3D,1,1),s.setClear(0,0,0,1),a.setClear(1),o.setClear(0),Z(i.DEPTH_TEST),a.setFunc(Ts),Q(!1),st(Qh),Z(i.CULL_FACE),J(ji);function Z(W){h[W]!==!0&&(i.enable(W),h[W]=!0)}function k(W){h[W]!==!1&&(i.disable(W),h[W]=!1)}function G(W,bt){return u[W]!==bt?(i.bindFramebuffer(W,bt),u[W]=bt,W===i.DRAW_FRAMEBUFFER&&(u[i.FRAMEBUFFER]=bt),W===i.FRAMEBUFFER&&(u[i.DRAW_FRAMEBUFFER]=bt),!0):!1}function z(W,bt){let Tt=f,Nt=!1;if(W){Tt=d.get(bt),Tt===void 0&&(Tt=[],d.set(bt,Tt));const Mt=W.textures;if(Tt.length!==Mt.length||Tt[0]!==i.COLOR_ATTACHMENT0){for(let pt=0,zt=Mt.length;pt<zt;pt++)Tt[pt]=i.COLOR_ATTACHMENT0+pt;Tt.length=Mt.length,Nt=!0}}else Tt[0]!==i.BACK&&(Tt[0]=i.BACK,Nt=!0);Nt&&i.drawBuffers(Tt)}function K(W){return g!==W?(i.useProgram(W),g=W,!0):!1}const et={[ur]:i.FUNC_ADD,[hp]:i.FUNC_SUBTRACT,[up]:i.FUNC_REVERSE_SUBTRACT};et[fp]=i.MIN,et[dp]=i.MAX;const U={[sd]:i.ZERO,[pp]:i.ONE,[ad]:i.SRC_COLOR,[Zc]:i.SRC_ALPHA,[Mp]:i.SRC_ALPHA_SATURATE,[xp]:i.DST_COLOR,[gp]:i.DST_ALPHA,[mp]:i.ONE_MINUS_SRC_COLOR,[Jc]:i.ONE_MINUS_SRC_ALPHA,[_p]:i.ONE_MINUS_DST_COLOR,[vp]:i.ONE_MINUS_DST_ALPHA,[yp]:i.CONSTANT_COLOR,[bp]:i.ONE_MINUS_CONSTANT_COLOR,[Sp]:i.CONSTANT_ALPHA,[wp]:i.ONE_MINUS_CONSTANT_ALPHA};function J(W,bt,Tt,Nt,Mt,pt,zt,Kt,me,he){if(W===ji){v===!0&&(k(i.BLEND),v=!1);return}if(v===!1&&(Z(i.BLEND),v=!0),W!==rd){if(W!==m||he!==x){if((p!==ur||b!==ur)&&(i.blendEquation(i.FUNC_ADD),p=ur,b=ur),he)switch(W){case xs:i.blendFuncSeparate(i.ONE,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case Ro:i.blendFunc(i.ONE,i.ONE);break;case tu:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case eu:i.blendFuncSeparate(i.DST_COLOR,i.ONE_MINUS_SRC_ALPHA,i.ZERO,i.ONE);break;default:console.error("THREE.WebGLState: Invalid blending: ",W);break}else switch(W){case xs:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case Ro:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE,i.ONE,i.ONE);break;case tu:console.error("THREE.WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case eu:console.error("THREE.WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:console.error("THREE.WebGLState: Invalid blending: ",W);break}y=null,M=null,w=null,T=null,A.set(0,0,0),R=0,m=W,x=he}return}Mt=Mt||bt,pt=pt||Tt,zt=zt||Nt,(bt!==p||Mt!==b)&&(i.blendEquationSeparate(et[bt],et[Mt]),p=bt,b=Mt),(Tt!==y||Nt!==M||pt!==w||zt!==T)&&(i.blendFuncSeparate(U[Tt],U[Nt],U[pt],U[zt]),y=Tt,M=Nt,w=pt,T=zt),(Kt.equals(A)===!1||me!==R)&&(i.blendColor(Kt.r,Kt.g,Kt.b,me),A.copy(Kt),R=me),m=W,x=!1}function j(W,bt){W.side===Ze?k(i.CULL_FACE):Z(i.CULL_FACE);let Tt=W.side===vn;bt&&(Tt=!Tt),Q(Tt),W.blending===xs&&W.transparent===!1?J(ji):J(W.blending,W.blendEquation,W.blendSrc,W.blendDst,W.blendEquationAlpha,W.blendSrcAlpha,W.blendDstAlpha,W.blendColor,W.blendAlpha,W.premultipliedAlpha),a.setFunc(W.depthFunc),a.setTest(W.depthTest),a.setMask(W.depthWrite),s.setMask(W.colorWrite);const Nt=W.stencilWrite;o.setTest(Nt),Nt&&(o.setMask(W.stencilWriteMask),o.setFunc(W.stencilFunc,W.stencilRef,W.stencilFuncMask),o.setOp(W.stencilFail,W.stencilZFail,W.stencilZPass)),mt(W.polygonOffset,W.polygonOffsetFactor,W.polygonOffsetUnits),W.alphaToCoverage===!0?Z(i.SAMPLE_ALPHA_TO_COVERAGE):k(i.SAMPLE_ALPHA_TO_COVERAGE)}function Q(W){_!==W&&(W?i.frontFace(i.CW):i.frontFace(i.CCW),_=W)}function st(W){W!==cp?(Z(i.CULL_FACE),W!==S&&(W===Qh?i.cullFace(i.BACK):W===lp?i.cullFace(i.FRONT):i.cullFace(i.FRONT_AND_BACK))):k(i.CULL_FACE),S=W}function ut(W){W!==E&&(B&&i.lineWidth(W),E=W)}function mt(W,bt,Tt){W?(Z(i.POLYGON_OFFSET_FILL),(P!==bt||L!==Tt)&&(i.polygonOffset(bt,Tt),P=bt,L=Tt)):k(i.POLYGON_OFFSET_FILL)}function xt(W){W?Z(i.SCISSOR_TEST):k(i.SCISSOR_TEST)}function Jt(W){W===void 0&&(W=i.TEXTURE0+I-1),it!==W&&(i.activeTexture(W),it=W)}function $t(W,bt,Tt){Tt===void 0&&(it===null?Tt=i.TEXTURE0+I-1:Tt=it);let Nt=lt[Tt];Nt===void 0&&(Nt={type:void 0,texture:void 0},lt[Tt]=Nt),(Nt.type!==W||Nt.texture!==bt)&&(it!==Tt&&(i.activeTexture(Tt),it=Tt),i.bindTexture(W,bt||V[W]),Nt.type=W,Nt.texture=bt)}function F(){const W=lt[it];W!==void 0&&W.type!==void 0&&(i.bindTexture(W.type,null),W.type=void 0,W.texture=void 0)}function C(){try{i.compressedTexImage2D(...arguments)}catch(W){console.error("THREE.WebGLState:",W)}}function $(){try{i.compressedTexImage3D(...arguments)}catch(W){console.error("THREE.WebGLState:",W)}}function at(){try{i.texSubImage2D(...arguments)}catch(W){console.error("THREE.WebGLState:",W)}}function gt(){try{i.texSubImage3D(...arguments)}catch(W){console.error("THREE.WebGLState:",W)}}function ht(){try{i.compressedTexSubImage2D(...arguments)}catch(W){console.error("THREE.WebGLState:",W)}}function Ht(){try{i.compressedTexSubImage3D(...arguments)}catch(W){console.error("THREE.WebGLState:",W)}}function Et(){try{i.texStorage2D(...arguments)}catch(W){console.error("THREE.WebGLState:",W)}}function Bt(){try{i.texStorage3D(...arguments)}catch(W){console.error("THREE.WebGLState:",W)}}function kt(){try{i.texImage2D(...arguments)}catch(W){console.error("THREE.WebGLState:",W)}}function _t(){try{i.texImage3D(...arguments)}catch(W){console.error("THREE.WebGLState:",W)}}function Lt(W){wt.equals(W)===!1&&(i.scissor(W.x,W.y,W.z,W.w),wt.copy(W))}function jt(W){Ft.equals(W)===!1&&(i.viewport(W.x,W.y,W.z,W.w),Ft.copy(W))}function Vt(W,bt){let Tt=l.get(bt);Tt===void 0&&(Tt=new WeakMap,l.set(bt,Tt));let Nt=Tt.get(W);Nt===void 0&&(Nt=i.getUniformBlockIndex(bt,W.name),Tt.set(W,Nt))}function Rt(W,bt){const Nt=l.get(bt).get(W);c.get(bt)!==Nt&&(i.uniformBlockBinding(bt,Nt,W.__bindingPointIndex),c.set(bt,Nt))}function Qt(){i.disable(i.BLEND),i.disable(i.CULL_FACE),i.disable(i.DEPTH_TEST),i.disable(i.POLYGON_OFFSET_FILL),i.disable(i.SCISSOR_TEST),i.disable(i.STENCIL_TEST),i.disable(i.SAMPLE_ALPHA_TO_COVERAGE),i.blendEquation(i.FUNC_ADD),i.blendFunc(i.ONE,i.ZERO),i.blendFuncSeparate(i.ONE,i.ZERO,i.ONE,i.ZERO),i.blendColor(0,0,0,0),i.colorMask(!0,!0,!0,!0),i.clearColor(0,0,0,0),i.depthMask(!0),i.depthFunc(i.LESS),a.setReversed(!1),i.clearDepth(1),i.stencilMask(4294967295),i.stencilFunc(i.ALWAYS,0,4294967295),i.stencilOp(i.KEEP,i.KEEP,i.KEEP),i.clearStencil(0),i.cullFace(i.BACK),i.frontFace(i.CCW),i.polygonOffset(0,0),i.activeTexture(i.TEXTURE0),i.bindFramebuffer(i.FRAMEBUFFER,null),i.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),i.bindFramebuffer(i.READ_FRAMEBUFFER,null),i.useProgram(null),i.lineWidth(1),i.scissor(0,0,i.canvas.width,i.canvas.height),i.viewport(0,0,i.canvas.width,i.canvas.height),h={},it=null,lt={},u={},d=new WeakMap,f=[],g=null,v=!1,m=null,p=null,y=null,M=null,b=null,w=null,T=null,A=new Pt(0,0,0),R=0,x=!1,_=null,S=null,E=null,P=null,L=null,wt.set(0,0,i.canvas.width,i.canvas.height),Ft.set(0,0,i.canvas.width,i.canvas.height),s.reset(),a.reset(),o.reset()}return{buffers:{color:s,depth:a,stencil:o},enable:Z,disable:k,bindFramebuffer:G,drawBuffers:z,useProgram:K,setBlending:J,setMaterial:j,setFlipSided:Q,setCullFace:st,setLineWidth:ut,setPolygonOffset:mt,setScissorTest:xt,activeTexture:Jt,bindTexture:$t,unbindTexture:F,compressedTexImage2D:C,compressedTexImage3D:$,texImage2D:kt,texImage3D:_t,updateUBOMapping:Vt,uniformBlockBinding:Rt,texStorage2D:Et,texStorage3D:Bt,texSubImage2D:at,texSubImage3D:gt,compressedTexSubImage2D:ht,compressedTexSubImage3D:Ht,scissor:Lt,viewport:jt,reset:Qt}}function r2(i,t,e,n,r,s,a){const o=t.has("WEBGL_multisampled_render_to_texture")?t.get("WEBGL_multisampled_render_to_texture"):null,c=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),l=new ft,h=new WeakMap;let u;const d=new WeakMap;let f=!1;try{f=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function g(F,C){return f?new OffscreenCanvas(F,C):Do("canvas")}function v(F,C,$){let at=1;const gt=$t(F);if((gt.width>$||gt.height>$)&&(at=$/Math.max(gt.width,gt.height)),at<1)if(typeof HTMLImageElement<"u"&&F instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&F instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&F instanceof ImageBitmap||typeof VideoFrame<"u"&&F instanceof VideoFrame){const ht=Math.floor(at*gt.width),Ht=Math.floor(at*gt.height);u===void 0&&(u=g(ht,Ht));const Et=C?g(ht,Ht):u;return Et.width=ht,Et.height=Ht,Et.getContext("2d").drawImage(F,0,0,ht,Ht),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+gt.width+"x"+gt.height+") to ("+ht+"x"+Ht+")."),Et}else return"data"in F&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+gt.width+"x"+gt.height+")."),F;return F}function m(F){return F.generateMipmaps}function p(F){i.generateMipmap(F)}function y(F){return F.isWebGLCubeRenderTarget?i.TEXTURE_CUBE_MAP:F.isWebGL3DRenderTarget?i.TEXTURE_3D:F.isWebGLArrayRenderTarget||F.isCompressedArrayTexture?i.TEXTURE_2D_ARRAY:i.TEXTURE_2D}function M(F,C,$,at,gt=!1){if(F!==null){if(i[F]!==void 0)return i[F];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+F+"'")}let ht=C;if(C===i.RED&&($===i.FLOAT&&(ht=i.R32F),$===i.HALF_FLOAT&&(ht=i.R16F),$===i.UNSIGNED_BYTE&&(ht=i.R8)),C===i.RED_INTEGER&&($===i.UNSIGNED_BYTE&&(ht=i.R8UI),$===i.UNSIGNED_SHORT&&(ht=i.R16UI),$===i.UNSIGNED_INT&&(ht=i.R32UI),$===i.BYTE&&(ht=i.R8I),$===i.SHORT&&(ht=i.R16I),$===i.INT&&(ht=i.R32I)),C===i.RG&&($===i.FLOAT&&(ht=i.RG32F),$===i.HALF_FLOAT&&(ht=i.RG16F),$===i.UNSIGNED_BYTE&&(ht=i.RG8)),C===i.RG_INTEGER&&($===i.UNSIGNED_BYTE&&(ht=i.RG8UI),$===i.UNSIGNED_SHORT&&(ht=i.RG16UI),$===i.UNSIGNED_INT&&(ht=i.RG32UI),$===i.BYTE&&(ht=i.RG8I),$===i.SHORT&&(ht=i.RG16I),$===i.INT&&(ht=i.RG32I)),C===i.RGB_INTEGER&&($===i.UNSIGNED_BYTE&&(ht=i.RGB8UI),$===i.UNSIGNED_SHORT&&(ht=i.RGB16UI),$===i.UNSIGNED_INT&&(ht=i.RGB32UI),$===i.BYTE&&(ht=i.RGB8I),$===i.SHORT&&(ht=i.RGB16I),$===i.INT&&(ht=i.RGB32I)),C===i.RGBA_INTEGER&&($===i.UNSIGNED_BYTE&&(ht=i.RGBA8UI),$===i.UNSIGNED_SHORT&&(ht=i.RGBA16UI),$===i.UNSIGNED_INT&&(ht=i.RGBA32UI),$===i.BYTE&&(ht=i.RGBA8I),$===i.SHORT&&(ht=i.RGBA16I),$===i.INT&&(ht=i.RGBA32I)),C===i.RGB&&($===i.UNSIGNED_INT_5_9_9_9_REV&&(ht=i.RGB9_E5),$===i.UNSIGNED_INT_10F_11F_11F_REV&&(ht=i.R11F_G11F_B10F)),C===i.RGBA){const Ht=gt?Lo:ce.getTransfer(at);$===i.FLOAT&&(ht=i.RGBA32F),$===i.HALF_FLOAT&&(ht=i.RGBA16F),$===i.UNSIGNED_BYTE&&(ht=Ht===de?i.SRGB8_ALPHA8:i.RGBA8),$===i.UNSIGNED_SHORT_4_4_4_4&&(ht=i.RGBA4),$===i.UNSIGNED_SHORT_5_5_5_1&&(ht=i.RGB5_A1)}return(ht===i.R16F||ht===i.R32F||ht===i.RG16F||ht===i.RG32F||ht===i.RGBA16F||ht===i.RGBA32F)&&t.get("EXT_color_buffer_float"),ht}function b(F,C){let $;return F?C===null||C===yr||C===ua?$=i.DEPTH24_STENCIL8:C===li?$=i.DEPTH32F_STENCIL8:C===ha&&($=i.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):C===null||C===yr||C===ua?$=i.DEPTH_COMPONENT24:C===li?$=i.DEPTH_COMPONENT32F:C===ha&&($=i.DEPTH_COMPONENT16),$}function w(F,C){return m(F)===!0||F.isFramebufferTexture&&F.minFilter!==An&&F.minFilter!==_e?Math.log2(Math.max(C.width,C.height))+1:F.mipmaps!==void 0&&F.mipmaps.length>0?F.mipmaps.length:F.isCompressedTexture&&Array.isArray(F.image)?C.mipmaps.length:1}function T(F){const C=F.target;C.removeEventListener("dispose",T),R(C),C.isVideoTexture&&h.delete(C)}function A(F){const C=F.target;C.removeEventListener("dispose",A),_(C)}function R(F){const C=n.get(F);if(C.__webglInit===void 0)return;const $=F.source,at=d.get($);if(at){const gt=at[C.__cacheKey];gt.usedTimes--,gt.usedTimes===0&&x(F),Object.keys(at).length===0&&d.delete($)}n.remove(F)}function x(F){const C=n.get(F);i.deleteTexture(C.__webglTexture);const $=F.source,at=d.get($);delete at[C.__cacheKey],a.memory.textures--}function _(F){const C=n.get(F);if(F.depthTexture&&(F.depthTexture.dispose(),n.remove(F.depthTexture)),F.isWebGLCubeRenderTarget)for(let at=0;at<6;at++){if(Array.isArray(C.__webglFramebuffer[at]))for(let gt=0;gt<C.__webglFramebuffer[at].length;gt++)i.deleteFramebuffer(C.__webglFramebuffer[at][gt]);else i.deleteFramebuffer(C.__webglFramebuffer[at]);C.__webglDepthbuffer&&i.deleteRenderbuffer(C.__webglDepthbuffer[at])}else{if(Array.isArray(C.__webglFramebuffer))for(let at=0;at<C.__webglFramebuffer.length;at++)i.deleteFramebuffer(C.__webglFramebuffer[at]);else i.deleteFramebuffer(C.__webglFramebuffer);if(C.__webglDepthbuffer&&i.deleteRenderbuffer(C.__webglDepthbuffer),C.__webglMultisampledFramebuffer&&i.deleteFramebuffer(C.__webglMultisampledFramebuffer),C.__webglColorRenderbuffer)for(let at=0;at<C.__webglColorRenderbuffer.length;at++)C.__webglColorRenderbuffer[at]&&i.deleteRenderbuffer(C.__webglColorRenderbuffer[at]);C.__webglDepthRenderbuffer&&i.deleteRenderbuffer(C.__webglDepthRenderbuffer)}const $=F.textures;for(let at=0,gt=$.length;at<gt;at++){const ht=n.get($[at]);ht.__webglTexture&&(i.deleteTexture(ht.__webglTexture),a.memory.textures--),n.remove($[at])}n.remove(F)}let S=0;function E(){S=0}function P(){const F=S;return F>=r.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+F+" texture units while this GPU supports only "+r.maxTextures),S+=1,F}function L(F){const C=[];return C.push(F.wrapS),C.push(F.wrapT),C.push(F.wrapR||0),C.push(F.magFilter),C.push(F.minFilter),C.push(F.anisotropy),C.push(F.internalFormat),C.push(F.format),C.push(F.type),C.push(F.generateMipmaps),C.push(F.premultiplyAlpha),C.push(F.flipY),C.push(F.unpackAlignment),C.push(F.colorSpace),C.join()}function I(F,C){const $=n.get(F);if(F.isVideoTexture&&xt(F),F.isRenderTargetTexture===!1&&F.isExternalTexture!==!0&&F.version>0&&$.__version!==F.version){const at=F.image;if(at===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(at.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{V($,F,C);return}}else F.isExternalTexture&&($.__webglTexture=F.sourceTexture?F.sourceTexture:null);e.bindTexture(i.TEXTURE_2D,$.__webglTexture,i.TEXTURE0+C)}function B(F,C){const $=n.get(F);if(F.isRenderTargetTexture===!1&&F.version>0&&$.__version!==F.version){V($,F,C);return}e.bindTexture(i.TEXTURE_2D_ARRAY,$.__webglTexture,i.TEXTURE0+C)}function X(F,C){const $=n.get(F);if(F.isRenderTargetTexture===!1&&F.version>0&&$.__version!==F.version){V($,F,C);return}e.bindTexture(i.TEXTURE_3D,$.__webglTexture,i.TEXTURE0+C)}function H(F,C){const $=n.get(F);if(F.version>0&&$.__version!==F.version){Z($,F,C);return}e.bindTexture(i.TEXTURE_CUBE_MAP,$.__webglTexture,i.TEXTURE0+C)}const it={[Cs]:i.REPEAT,[dr]:i.CLAMP_TO_EDGE,[al]:i.MIRRORED_REPEAT},lt={[An]:i.NEAREST,[Up]:i.NEAREST_MIPMAP_NEAREST,[Fa]:i.NEAREST_MIPMAP_LINEAR,[_e]:i.LINEAR,[Ko]:i.LINEAR_MIPMAP_NEAREST,[qi]:i.LINEAR_MIPMAP_LINEAR},dt={[Bp]:i.NEVER,[Wp]:i.ALWAYS,[kp]:i.LESS,[_d]:i.LEQUAL,[zp]:i.EQUAL,[Gp]:i.GEQUAL,[Hp]:i.GREATER,[Vp]:i.NOTEQUAL};function vt(F,C){if(C.type===li&&t.has("OES_texture_float_linear")===!1&&(C.magFilter===_e||C.magFilter===Ko||C.magFilter===Fa||C.magFilter===qi||C.minFilter===_e||C.minFilter===Ko||C.minFilter===Fa||C.minFilter===qi)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),i.texParameteri(F,i.TEXTURE_WRAP_S,it[C.wrapS]),i.texParameteri(F,i.TEXTURE_WRAP_T,it[C.wrapT]),(F===i.TEXTURE_3D||F===i.TEXTURE_2D_ARRAY)&&i.texParameteri(F,i.TEXTURE_WRAP_R,it[C.wrapR]),i.texParameteri(F,i.TEXTURE_MAG_FILTER,lt[C.magFilter]),i.texParameteri(F,i.TEXTURE_MIN_FILTER,lt[C.minFilter]),C.compareFunction&&(i.texParameteri(F,i.TEXTURE_COMPARE_MODE,i.COMPARE_REF_TO_TEXTURE),i.texParameteri(F,i.TEXTURE_COMPARE_FUNC,dt[C.compareFunction])),t.has("EXT_texture_filter_anisotropic")===!0){if(C.magFilter===An||C.minFilter!==Fa&&C.minFilter!==qi||C.type===li&&t.has("OES_texture_float_linear")===!1)return;if(C.anisotropy>1||n.get(C).__currentAnisotropy){const $=t.get("EXT_texture_filter_anisotropic");i.texParameterf(F,$.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(C.anisotropy,r.getMaxAnisotropy())),n.get(C).__currentAnisotropy=C.anisotropy}}}function wt(F,C){let $=!1;F.__webglInit===void 0&&(F.__webglInit=!0,C.addEventListener("dispose",T));const at=C.source;let gt=d.get(at);gt===void 0&&(gt={},d.set(at,gt));const ht=L(C);if(ht!==F.__cacheKey){gt[ht]===void 0&&(gt[ht]={texture:i.createTexture(),usedTimes:0},a.memory.textures++,$=!0),gt[ht].usedTimes++;const Ht=gt[F.__cacheKey];Ht!==void 0&&(gt[F.__cacheKey].usedTimes--,Ht.usedTimes===0&&x(C)),F.__cacheKey=ht,F.__webglTexture=gt[ht].texture}return $}function Ft(F,C,$){return Math.floor(Math.floor(F/$)/C)}function ot(F,C,$,at){const ht=F.updateRanges;if(ht.length===0)e.texSubImage2D(i.TEXTURE_2D,0,0,0,C.width,C.height,$,at,C.data);else{ht.sort((_t,Lt)=>_t.start-Lt.start);let Ht=0;for(let _t=1;_t<ht.length;_t++){const Lt=ht[Ht],jt=ht[_t],Vt=Lt.start+Lt.count,Rt=Ft(jt.start,C.width,4),Qt=Ft(Lt.start,C.width,4);jt.start<=Vt+1&&Rt===Qt&&Ft(jt.start+jt.count-1,C.width,4)===Rt?Lt.count=Math.max(Lt.count,jt.start+jt.count-Lt.start):(++Ht,ht[Ht]=jt)}ht.length=Ht+1;const Et=i.getParameter(i.UNPACK_ROW_LENGTH),Bt=i.getParameter(i.UNPACK_SKIP_PIXELS),kt=i.getParameter(i.UNPACK_SKIP_ROWS);i.pixelStorei(i.UNPACK_ROW_LENGTH,C.width);for(let _t=0,Lt=ht.length;_t<Lt;_t++){const jt=ht[_t],Vt=Math.floor(jt.start/4),Rt=Math.ceil(jt.count/4),Qt=Vt%C.width,W=Math.floor(Vt/C.width),bt=Rt,Tt=1;i.pixelStorei(i.UNPACK_SKIP_PIXELS,Qt),i.pixelStorei(i.UNPACK_SKIP_ROWS,W),e.texSubImage2D(i.TEXTURE_2D,0,Qt,W,bt,Tt,$,at,C.data)}F.clearUpdateRanges(),i.pixelStorei(i.UNPACK_ROW_LENGTH,Et),i.pixelStorei(i.UNPACK_SKIP_PIXELS,Bt),i.pixelStorei(i.UNPACK_SKIP_ROWS,kt)}}function V(F,C,$){let at=i.TEXTURE_2D;(C.isDataArrayTexture||C.isCompressedArrayTexture)&&(at=i.TEXTURE_2D_ARRAY),C.isData3DTexture&&(at=i.TEXTURE_3D);const gt=wt(F,C),ht=C.source;e.bindTexture(at,F.__webglTexture,i.TEXTURE0+$);const Ht=n.get(ht);if(ht.version!==Ht.__version||gt===!0){e.activeTexture(i.TEXTURE0+$);const Et=ce.getPrimaries(ce.workingColorSpace),Bt=C.colorSpace===ci?null:ce.getPrimaries(C.colorSpace),kt=C.colorSpace===ci||Et===Bt?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,C.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,C.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,C.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,kt);let _t=v(C.image,!1,r.maxTextureSize);_t=Jt(C,_t);const Lt=s.convert(C.format,C.colorSpace),jt=s.convert(C.type);let Vt=M(C.internalFormat,Lt,jt,C.colorSpace,C.isVideoTexture);vt(at,C);let Rt;const Qt=C.mipmaps,W=C.isVideoTexture!==!0,bt=Ht.__version===void 0||gt===!0,Tt=ht.dataReady,Nt=w(C,_t);if(C.isDepthTexture)Vt=b(C.format===da,C.type),bt&&(W?e.texStorage2D(i.TEXTURE_2D,1,Vt,_t.width,_t.height):e.texImage2D(i.TEXTURE_2D,0,Vt,_t.width,_t.height,0,Lt,jt,null));else if(C.isDataTexture)if(Qt.length>0){W&&bt&&e.texStorage2D(i.TEXTURE_2D,Nt,Vt,Qt[0].width,Qt[0].height);for(let Mt=0,pt=Qt.length;Mt<pt;Mt++)Rt=Qt[Mt],W?Tt&&e.texSubImage2D(i.TEXTURE_2D,Mt,0,0,Rt.width,Rt.height,Lt,jt,Rt.data):e.texImage2D(i.TEXTURE_2D,Mt,Vt,Rt.width,Rt.height,0,Lt,jt,Rt.data);C.generateMipmaps=!1}else W?(bt&&e.texStorage2D(i.TEXTURE_2D,Nt,Vt,_t.width,_t.height),Tt&&ot(C,_t,Lt,jt)):e.texImage2D(i.TEXTURE_2D,0,Vt,_t.width,_t.height,0,Lt,jt,_t.data);else if(C.isCompressedTexture)if(C.isCompressedArrayTexture){W&&bt&&e.texStorage3D(i.TEXTURE_2D_ARRAY,Nt,Vt,Qt[0].width,Qt[0].height,_t.depth);for(let Mt=0,pt=Qt.length;Mt<pt;Mt++)if(Rt=Qt[Mt],C.format!==Xe)if(Lt!==null)if(W){if(Tt)if(C.layerUpdates.size>0){const zt=zu(Rt.width,Rt.height,C.format,C.type);for(const Kt of C.layerUpdates){const me=Rt.data.subarray(Kt*zt/Rt.data.BYTES_PER_ELEMENT,(Kt+1)*zt/Rt.data.BYTES_PER_ELEMENT);e.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,Mt,0,0,Kt,Rt.width,Rt.height,1,Lt,me)}C.clearLayerUpdates()}else e.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,Mt,0,0,0,Rt.width,Rt.height,_t.depth,Lt,Rt.data)}else e.compressedTexImage3D(i.TEXTURE_2D_ARRAY,Mt,Vt,Rt.width,Rt.height,_t.depth,0,Rt.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else W?Tt&&e.texSubImage3D(i.TEXTURE_2D_ARRAY,Mt,0,0,0,Rt.width,Rt.height,_t.depth,Lt,jt,Rt.data):e.texImage3D(i.TEXTURE_2D_ARRAY,Mt,Vt,Rt.width,Rt.height,_t.depth,0,Lt,jt,Rt.data)}else{W&&bt&&e.texStorage2D(i.TEXTURE_2D,Nt,Vt,Qt[0].width,Qt[0].height);for(let Mt=0,pt=Qt.length;Mt<pt;Mt++)Rt=Qt[Mt],C.format!==Xe?Lt!==null?W?Tt&&e.compressedTexSubImage2D(i.TEXTURE_2D,Mt,0,0,Rt.width,Rt.height,Lt,Rt.data):e.compressedTexImage2D(i.TEXTURE_2D,Mt,Vt,Rt.width,Rt.height,0,Rt.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):W?Tt&&e.texSubImage2D(i.TEXTURE_2D,Mt,0,0,Rt.width,Rt.height,Lt,jt,Rt.data):e.texImage2D(i.TEXTURE_2D,Mt,Vt,Rt.width,Rt.height,0,Lt,jt,Rt.data)}else if(C.isDataArrayTexture)if(W){if(bt&&e.texStorage3D(i.TEXTURE_2D_ARRAY,Nt,Vt,_t.width,_t.height,_t.depth),Tt)if(C.layerUpdates.size>0){const Mt=zu(_t.width,_t.height,C.format,C.type);for(const pt of C.layerUpdates){const zt=_t.data.subarray(pt*Mt/_t.data.BYTES_PER_ELEMENT,(pt+1)*Mt/_t.data.BYTES_PER_ELEMENT);e.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,pt,_t.width,_t.height,1,Lt,jt,zt)}C.clearLayerUpdates()}else e.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,0,_t.width,_t.height,_t.depth,Lt,jt,_t.data)}else e.texImage3D(i.TEXTURE_2D_ARRAY,0,Vt,_t.width,_t.height,_t.depth,0,Lt,jt,_t.data);else if(C.isData3DTexture)W?(bt&&e.texStorage3D(i.TEXTURE_3D,Nt,Vt,_t.width,_t.height,_t.depth),Tt&&e.texSubImage3D(i.TEXTURE_3D,0,0,0,0,_t.width,_t.height,_t.depth,Lt,jt,_t.data)):e.texImage3D(i.TEXTURE_3D,0,Vt,_t.width,_t.height,_t.depth,0,Lt,jt,_t.data);else if(C.isFramebufferTexture){if(bt)if(W)e.texStorage2D(i.TEXTURE_2D,Nt,Vt,_t.width,_t.height);else{let Mt=_t.width,pt=_t.height;for(let zt=0;zt<Nt;zt++)e.texImage2D(i.TEXTURE_2D,zt,Vt,Mt,pt,0,Lt,jt,null),Mt>>=1,pt>>=1}}else if(Qt.length>0){if(W&&bt){const Mt=$t(Qt[0]);e.texStorage2D(i.TEXTURE_2D,Nt,Vt,Mt.width,Mt.height)}for(let Mt=0,pt=Qt.length;Mt<pt;Mt++)Rt=Qt[Mt],W?Tt&&e.texSubImage2D(i.TEXTURE_2D,Mt,0,0,Lt,jt,Rt):e.texImage2D(i.TEXTURE_2D,Mt,Vt,Lt,jt,Rt);C.generateMipmaps=!1}else if(W){if(bt){const Mt=$t(_t);e.texStorage2D(i.TEXTURE_2D,Nt,Vt,Mt.width,Mt.height)}Tt&&e.texSubImage2D(i.TEXTURE_2D,0,0,0,Lt,jt,_t)}else e.texImage2D(i.TEXTURE_2D,0,Vt,Lt,jt,_t);m(C)&&p(at),Ht.__version=ht.version,C.onUpdate&&C.onUpdate(C)}F.__version=C.version}function Z(F,C,$){if(C.image.length!==6)return;const at=wt(F,C),gt=C.source;e.bindTexture(i.TEXTURE_CUBE_MAP,F.__webglTexture,i.TEXTURE0+$);const ht=n.get(gt);if(gt.version!==ht.__version||at===!0){e.activeTexture(i.TEXTURE0+$);const Ht=ce.getPrimaries(ce.workingColorSpace),Et=C.colorSpace===ci?null:ce.getPrimaries(C.colorSpace),Bt=C.colorSpace===ci||Ht===Et?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,C.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,C.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,C.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,Bt);const kt=C.isCompressedTexture||C.image[0].isCompressedTexture,_t=C.image[0]&&C.image[0].isDataTexture,Lt=[];for(let pt=0;pt<6;pt++)!kt&&!_t?Lt[pt]=v(C.image[pt],!0,r.maxCubemapSize):Lt[pt]=_t?C.image[pt].image:C.image[pt],Lt[pt]=Jt(C,Lt[pt]);const jt=Lt[0],Vt=s.convert(C.format,C.colorSpace),Rt=s.convert(C.type),Qt=M(C.internalFormat,Vt,Rt,C.colorSpace),W=C.isVideoTexture!==!0,bt=ht.__version===void 0||at===!0,Tt=gt.dataReady;let Nt=w(C,jt);vt(i.TEXTURE_CUBE_MAP,C);let Mt;if(kt){W&&bt&&e.texStorage2D(i.TEXTURE_CUBE_MAP,Nt,Qt,jt.width,jt.height);for(let pt=0;pt<6;pt++){Mt=Lt[pt].mipmaps;for(let zt=0;zt<Mt.length;zt++){const Kt=Mt[zt];C.format!==Xe?Vt!==null?W?Tt&&e.compressedTexSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+pt,zt,0,0,Kt.width,Kt.height,Vt,Kt.data):e.compressedTexImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+pt,zt,Qt,Kt.width,Kt.height,0,Kt.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):W?Tt&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+pt,zt,0,0,Kt.width,Kt.height,Vt,Rt,Kt.data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+pt,zt,Qt,Kt.width,Kt.height,0,Vt,Rt,Kt.data)}}}else{if(Mt=C.mipmaps,W&&bt){Mt.length>0&&Nt++;const pt=$t(Lt[0]);e.texStorage2D(i.TEXTURE_CUBE_MAP,Nt,Qt,pt.width,pt.height)}for(let pt=0;pt<6;pt++)if(_t){W?Tt&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+pt,0,0,0,Lt[pt].width,Lt[pt].height,Vt,Rt,Lt[pt].data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+pt,0,Qt,Lt[pt].width,Lt[pt].height,0,Vt,Rt,Lt[pt].data);for(let zt=0;zt<Mt.length;zt++){const me=Mt[zt].image[pt].image;W?Tt&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+pt,zt+1,0,0,me.width,me.height,Vt,Rt,me.data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+pt,zt+1,Qt,me.width,me.height,0,Vt,Rt,me.data)}}else{W?Tt&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+pt,0,0,0,Vt,Rt,Lt[pt]):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+pt,0,Qt,Vt,Rt,Lt[pt]);for(let zt=0;zt<Mt.length;zt++){const Kt=Mt[zt];W?Tt&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+pt,zt+1,0,0,Vt,Rt,Kt.image[pt]):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+pt,zt+1,Qt,Vt,Rt,Kt.image[pt])}}}m(C)&&p(i.TEXTURE_CUBE_MAP),ht.__version=gt.version,C.onUpdate&&C.onUpdate(C)}F.__version=C.version}function k(F,C,$,at,gt,ht){const Ht=s.convert($.format,$.colorSpace),Et=s.convert($.type),Bt=M($.internalFormat,Ht,Et,$.colorSpace),kt=n.get(C),_t=n.get($);if(_t.__renderTarget=C,!kt.__hasExternalTextures){const Lt=Math.max(1,C.width>>ht),jt=Math.max(1,C.height>>ht);gt===i.TEXTURE_3D||gt===i.TEXTURE_2D_ARRAY?e.texImage3D(gt,ht,Bt,Lt,jt,C.depth,0,Ht,Et,null):e.texImage2D(gt,ht,Bt,Lt,jt,0,Ht,Et,null)}e.bindFramebuffer(i.FRAMEBUFFER,F),mt(C)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,at,gt,_t.__webglTexture,0,ut(C)):(gt===i.TEXTURE_2D||gt>=i.TEXTURE_CUBE_MAP_POSITIVE_X&&gt<=i.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&i.framebufferTexture2D(i.FRAMEBUFFER,at,gt,_t.__webglTexture,ht),e.bindFramebuffer(i.FRAMEBUFFER,null)}function G(F,C,$){if(i.bindRenderbuffer(i.RENDERBUFFER,F),C.depthBuffer){const at=C.depthTexture,gt=at&&at.isDepthTexture?at.type:null,ht=b(C.stencilBuffer,gt),Ht=C.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,Et=ut(C);mt(C)?o.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,Et,ht,C.width,C.height):$?i.renderbufferStorageMultisample(i.RENDERBUFFER,Et,ht,C.width,C.height):i.renderbufferStorage(i.RENDERBUFFER,ht,C.width,C.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,Ht,i.RENDERBUFFER,F)}else{const at=C.textures;for(let gt=0;gt<at.length;gt++){const ht=at[gt],Ht=s.convert(ht.format,ht.colorSpace),Et=s.convert(ht.type),Bt=M(ht.internalFormat,Ht,Et,ht.colorSpace),kt=ut(C);$&&mt(C)===!1?i.renderbufferStorageMultisample(i.RENDERBUFFER,kt,Bt,C.width,C.height):mt(C)?o.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,kt,Bt,C.width,C.height):i.renderbufferStorage(i.RENDERBUFFER,Bt,C.width,C.height)}}i.bindRenderbuffer(i.RENDERBUFFER,null)}function z(F,C){if(C&&C.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(e.bindFramebuffer(i.FRAMEBUFFER,F),!(C.depthTexture&&C.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");const at=n.get(C.depthTexture);at.__renderTarget=C,(!at.__webglTexture||C.depthTexture.image.width!==C.width||C.depthTexture.image.height!==C.height)&&(C.depthTexture.image.width=C.width,C.depthTexture.image.height=C.height,C.depthTexture.needsUpdate=!0),I(C.depthTexture,0);const gt=at.__webglTexture,ht=ut(C);if(C.depthTexture.format===fa)mt(C)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,gt,0,ht):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,gt,0);else if(C.depthTexture.format===da)mt(C)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,gt,0,ht):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,gt,0);else throw new Error("Unknown depthTexture format")}function K(F){const C=n.get(F),$=F.isWebGLCubeRenderTarget===!0;if(C.__boundDepthTexture!==F.depthTexture){const at=F.depthTexture;if(C.__depthDisposeCallback&&C.__depthDisposeCallback(),at){const gt=()=>{delete C.__boundDepthTexture,delete C.__depthDisposeCallback,at.removeEventListener("dispose",gt)};at.addEventListener("dispose",gt),C.__depthDisposeCallback=gt}C.__boundDepthTexture=at}if(F.depthTexture&&!C.__autoAllocateDepthBuffer){if($)throw new Error("target.depthTexture not supported in Cube render targets");const at=F.texture.mipmaps;at&&at.length>0?z(C.__webglFramebuffer[0],F):z(C.__webglFramebuffer,F)}else if($){C.__webglDepthbuffer=[];for(let at=0;at<6;at++)if(e.bindFramebuffer(i.FRAMEBUFFER,C.__webglFramebuffer[at]),C.__webglDepthbuffer[at]===void 0)C.__webglDepthbuffer[at]=i.createRenderbuffer(),G(C.__webglDepthbuffer[at],F,!1);else{const gt=F.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,ht=C.__webglDepthbuffer[at];i.bindRenderbuffer(i.RENDERBUFFER,ht),i.framebufferRenderbuffer(i.FRAMEBUFFER,gt,i.RENDERBUFFER,ht)}}else{const at=F.texture.mipmaps;if(at&&at.length>0?e.bindFramebuffer(i.FRAMEBUFFER,C.__webglFramebuffer[0]):e.bindFramebuffer(i.FRAMEBUFFER,C.__webglFramebuffer),C.__webglDepthbuffer===void 0)C.__webglDepthbuffer=i.createRenderbuffer(),G(C.__webglDepthbuffer,F,!1);else{const gt=F.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,ht=C.__webglDepthbuffer;i.bindRenderbuffer(i.RENDERBUFFER,ht),i.framebufferRenderbuffer(i.FRAMEBUFFER,gt,i.RENDERBUFFER,ht)}}e.bindFramebuffer(i.FRAMEBUFFER,null)}function et(F,C,$){const at=n.get(F);C!==void 0&&k(at.__webglFramebuffer,F,F.texture,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,0),$!==void 0&&K(F)}function U(F){const C=F.texture,$=n.get(F),at=n.get(C);F.addEventListener("dispose",A);const gt=F.textures,ht=F.isWebGLCubeRenderTarget===!0,Ht=gt.length>1;if(Ht||(at.__webglTexture===void 0&&(at.__webglTexture=i.createTexture()),at.__version=C.version,a.memory.textures++),ht){$.__webglFramebuffer=[];for(let Et=0;Et<6;Et++)if(C.mipmaps&&C.mipmaps.length>0){$.__webglFramebuffer[Et]=[];for(let Bt=0;Bt<C.mipmaps.length;Bt++)$.__webglFramebuffer[Et][Bt]=i.createFramebuffer()}else $.__webglFramebuffer[Et]=i.createFramebuffer()}else{if(C.mipmaps&&C.mipmaps.length>0){$.__webglFramebuffer=[];for(let Et=0;Et<C.mipmaps.length;Et++)$.__webglFramebuffer[Et]=i.createFramebuffer()}else $.__webglFramebuffer=i.createFramebuffer();if(Ht)for(let Et=0,Bt=gt.length;Et<Bt;Et++){const kt=n.get(gt[Et]);kt.__webglTexture===void 0&&(kt.__webglTexture=i.createTexture(),a.memory.textures++)}if(F.samples>0&&mt(F)===!1){$.__webglMultisampledFramebuffer=i.createFramebuffer(),$.__webglColorRenderbuffer=[],e.bindFramebuffer(i.FRAMEBUFFER,$.__webglMultisampledFramebuffer);for(let Et=0;Et<gt.length;Et++){const Bt=gt[Et];$.__webglColorRenderbuffer[Et]=i.createRenderbuffer(),i.bindRenderbuffer(i.RENDERBUFFER,$.__webglColorRenderbuffer[Et]);const kt=s.convert(Bt.format,Bt.colorSpace),_t=s.convert(Bt.type),Lt=M(Bt.internalFormat,kt,_t,Bt.colorSpace,F.isXRRenderTarget===!0),jt=ut(F);i.renderbufferStorageMultisample(i.RENDERBUFFER,jt,Lt,F.width,F.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+Et,i.RENDERBUFFER,$.__webglColorRenderbuffer[Et])}i.bindRenderbuffer(i.RENDERBUFFER,null),F.depthBuffer&&($.__webglDepthRenderbuffer=i.createRenderbuffer(),G($.__webglDepthRenderbuffer,F,!0)),e.bindFramebuffer(i.FRAMEBUFFER,null)}}if(ht){e.bindTexture(i.TEXTURE_CUBE_MAP,at.__webglTexture),vt(i.TEXTURE_CUBE_MAP,C);for(let Et=0;Et<6;Et++)if(C.mipmaps&&C.mipmaps.length>0)for(let Bt=0;Bt<C.mipmaps.length;Bt++)k($.__webglFramebuffer[Et][Bt],F,C,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+Et,Bt);else k($.__webglFramebuffer[Et],F,C,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+Et,0);m(C)&&p(i.TEXTURE_CUBE_MAP),e.unbindTexture()}else if(Ht){for(let Et=0,Bt=gt.length;Et<Bt;Et++){const kt=gt[Et],_t=n.get(kt);let Lt=i.TEXTURE_2D;(F.isWebGL3DRenderTarget||F.isWebGLArrayRenderTarget)&&(Lt=F.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),e.bindTexture(Lt,_t.__webglTexture),vt(Lt,kt),k($.__webglFramebuffer,F,kt,i.COLOR_ATTACHMENT0+Et,Lt,0),m(kt)&&p(Lt)}e.unbindTexture()}else{let Et=i.TEXTURE_2D;if((F.isWebGL3DRenderTarget||F.isWebGLArrayRenderTarget)&&(Et=F.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),e.bindTexture(Et,at.__webglTexture),vt(Et,C),C.mipmaps&&C.mipmaps.length>0)for(let Bt=0;Bt<C.mipmaps.length;Bt++)k($.__webglFramebuffer[Bt],F,C,i.COLOR_ATTACHMENT0,Et,Bt);else k($.__webglFramebuffer,F,C,i.COLOR_ATTACHMENT0,Et,0);m(C)&&p(Et),e.unbindTexture()}F.depthBuffer&&K(F)}function J(F){const C=F.textures;for(let $=0,at=C.length;$<at;$++){const gt=C[$];if(m(gt)){const ht=y(F),Ht=n.get(gt).__webglTexture;e.bindTexture(ht,Ht),p(ht),e.unbindTexture()}}}const j=[],Q=[];function st(F){if(F.samples>0){if(mt(F)===!1){const C=F.textures,$=F.width,at=F.height;let gt=i.COLOR_BUFFER_BIT;const ht=F.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,Ht=n.get(F),Et=C.length>1;if(Et)for(let kt=0;kt<C.length;kt++)e.bindFramebuffer(i.FRAMEBUFFER,Ht.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+kt,i.RENDERBUFFER,null),e.bindFramebuffer(i.FRAMEBUFFER,Ht.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+kt,i.TEXTURE_2D,null,0);e.bindFramebuffer(i.READ_FRAMEBUFFER,Ht.__webglMultisampledFramebuffer);const Bt=F.texture.mipmaps;Bt&&Bt.length>0?e.bindFramebuffer(i.DRAW_FRAMEBUFFER,Ht.__webglFramebuffer[0]):e.bindFramebuffer(i.DRAW_FRAMEBUFFER,Ht.__webglFramebuffer);for(let kt=0;kt<C.length;kt++){if(F.resolveDepthBuffer&&(F.depthBuffer&&(gt|=i.DEPTH_BUFFER_BIT),F.stencilBuffer&&F.resolveStencilBuffer&&(gt|=i.STENCIL_BUFFER_BIT)),Et){i.framebufferRenderbuffer(i.READ_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.RENDERBUFFER,Ht.__webglColorRenderbuffer[kt]);const _t=n.get(C[kt]).__webglTexture;i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,_t,0)}i.blitFramebuffer(0,0,$,at,0,0,$,at,gt,i.NEAREST),c===!0&&(j.length=0,Q.length=0,j.push(i.COLOR_ATTACHMENT0+kt),F.depthBuffer&&F.resolveDepthBuffer===!1&&(j.push(ht),Q.push(ht),i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,Q)),i.invalidateFramebuffer(i.READ_FRAMEBUFFER,j))}if(e.bindFramebuffer(i.READ_FRAMEBUFFER,null),e.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),Et)for(let kt=0;kt<C.length;kt++){e.bindFramebuffer(i.FRAMEBUFFER,Ht.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+kt,i.RENDERBUFFER,Ht.__webglColorRenderbuffer[kt]);const _t=n.get(C[kt]).__webglTexture;e.bindFramebuffer(i.FRAMEBUFFER,Ht.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+kt,i.TEXTURE_2D,_t,0)}e.bindFramebuffer(i.DRAW_FRAMEBUFFER,Ht.__webglMultisampledFramebuffer)}else if(F.depthBuffer&&F.resolveDepthBuffer===!1&&c){const C=F.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,[C])}}}function ut(F){return Math.min(r.maxSamples,F.samples)}function mt(F){const C=n.get(F);return F.samples>0&&t.has("WEBGL_multisampled_render_to_texture")===!0&&C.__useRenderToTexture!==!1}function xt(F){const C=a.render.frame;h.get(F)!==C&&(h.set(F,C),F.update())}function Jt(F,C){const $=F.colorSpace,at=F.format,gt=F.type;return F.isCompressedTexture===!0||F.isVideoTexture===!0||$!==br&&$!==ci&&(ce.getTransfer($)===de?(at!==Xe||gt!==Jn)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",$)),C}function $t(F){return typeof HTMLImageElement<"u"&&F instanceof HTMLImageElement?(l.width=F.naturalWidth||F.width,l.height=F.naturalHeight||F.height):typeof VideoFrame<"u"&&F instanceof VideoFrame?(l.width=F.displayWidth,l.height=F.displayHeight):(l.width=F.width,l.height=F.height),l}this.allocateTextureUnit=P,this.resetTextureUnits=E,this.setTexture2D=I,this.setTexture2DArray=B,this.setTexture3D=X,this.setTextureCube=H,this.rebindTextures=et,this.setupRenderTarget=U,this.updateRenderTargetMipmap=J,this.updateMultisampleRenderTarget=st,this.setupDepthRenderbuffer=K,this.setupFrameBufferTexture=k,this.useMultisampledRTT=mt}function s2(i,t){function e(n,r=ci){let s;const a=ce.getTransfer(r);if(n===Jn)return i.UNSIGNED_BYTE;if(n===sh)return i.UNSIGNED_SHORT_4_4_4_4;if(n===ah)return i.UNSIGNED_SHORT_5_5_5_1;if(n===fd)return i.UNSIGNED_INT_5_9_9_9_REV;if(n===dd)return i.UNSIGNED_INT_10F_11F_11F_REV;if(n===hd)return i.BYTE;if(n===ud)return i.SHORT;if(n===ha)return i.UNSIGNED_SHORT;if(n===rh)return i.INT;if(n===yr)return i.UNSIGNED_INT;if(n===li)return i.FLOAT;if(n===Tr)return i.HALF_FLOAT;if(n===pd)return i.ALPHA;if(n===md)return i.RGB;if(n===Xe)return i.RGBA;if(n===fa)return i.DEPTH_COMPONENT;if(n===da)return i.DEPTH_STENCIL;if(n===gd)return i.RED;if(n===oh)return i.RED_INTEGER;if(n===vd)return i.RG;if(n===ch)return i.RG_INTEGER;if(n===lh)return i.RGBA_INTEGER;if(n===bo||n===So||n===wo||n===Eo)if(a===de)if(s=t.get("WEBGL_compressed_texture_s3tc_srgb"),s!==null){if(n===bo)return s.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===So)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===wo)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===Eo)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(s=t.get("WEBGL_compressed_texture_s3tc"),s!==null){if(n===bo)return s.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===So)return s.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===wo)return s.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===Eo)return s.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(n===ol||n===cl||n===ll||n===hl)if(s=t.get("WEBGL_compressed_texture_pvrtc"),s!==null){if(n===ol)return s.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===cl)return s.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===ll)return s.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===hl)return s.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(n===ul||n===fl||n===dl)if(s=t.get("WEBGL_compressed_texture_etc"),s!==null){if(n===ul||n===fl)return a===de?s.COMPRESSED_SRGB8_ETC2:s.COMPRESSED_RGB8_ETC2;if(n===dl)return a===de?s.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:s.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(n===pl||n===ml||n===gl||n===vl||n===xl||n===_l||n===Ml||n===yl||n===bl||n===Sl||n===wl||n===El||n===Tl||n===Al)if(s=t.get("WEBGL_compressed_texture_astc"),s!==null){if(n===pl)return a===de?s.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:s.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===ml)return a===de?s.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:s.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===gl)return a===de?s.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:s.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===vl)return a===de?s.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:s.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===xl)return a===de?s.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:s.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===_l)return a===de?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:s.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===Ml)return a===de?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:s.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===yl)return a===de?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:s.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===bl)return a===de?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:s.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===Sl)return a===de?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:s.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===wl)return a===de?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:s.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===El)return a===de?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:s.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===Tl)return a===de?s.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:s.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===Al)return a===de?s.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:s.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(n===Rl||n===Cl||n===Ll)if(s=t.get("EXT_texture_compression_bptc"),s!==null){if(n===Rl)return a===de?s.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:s.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===Cl)return s.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===Ll)return s.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(n===Pl||n===Dl||n===Il||n===Ul)if(s=t.get("EXT_texture_compression_rgtc"),s!==null){if(n===Pl)return s.COMPRESSED_RED_RGTC1_EXT;if(n===Dl)return s.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===Il)return s.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===Ul)return s.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return n===ua?i.UNSIGNED_INT_24_8:i[n]!==void 0?i[n]:null}return{convert:e}}const a2=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,o2=`
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

}`;class c2{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(t,e){if(this.texture===null){const n=new Ud(t.texture);(t.depthNear!==e.depthNear||t.depthFar!==e.depthFar)&&(this.depthNear=t.depthNear,this.depthFar=t.depthFar),this.texture=n}}getMesh(t){if(this.texture!==null&&this.mesh===null){const e=t.cameras[0].viewport,n=new ze({vertexShader:a2,fragmentShader:o2,uniforms:{depthColor:{value:this.texture},depthWidth:{value:e.z},depthHeight:{value:e.w}}});this.mesh=new It(new Pi(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class l2 extends Ns{constructor(t,e){super();const n=this;let r=null,s=1,a=null,o="local-floor",c=1,l=null,h=null,u=null,d=null,f=null,g=null;const v=typeof XRWebGLBinding<"u",m=new c2,p={},y=e.getContextAttributes();let M=null,b=null;const w=[],T=[],A=new ft;let R=null;const x=new bn;x.viewport=new le;const _=new bn;_.viewport=new le;const S=[x,_],E=new Lm;let P=null,L=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(V){let Z=w[V];return Z===void 0&&(Z=new _c,w[V]=Z),Z.getTargetRaySpace()},this.getControllerGrip=function(V){let Z=w[V];return Z===void 0&&(Z=new _c,w[V]=Z),Z.getGripSpace()},this.getHand=function(V){let Z=w[V];return Z===void 0&&(Z=new _c,w[V]=Z),Z.getHandSpace()};function I(V){const Z=T.indexOf(V.inputSource);if(Z===-1)return;const k=w[Z];k!==void 0&&(k.update(V.inputSource,V.frame,l||a),k.dispatchEvent({type:V.type,data:V.inputSource}))}function B(){r.removeEventListener("select",I),r.removeEventListener("selectstart",I),r.removeEventListener("selectend",I),r.removeEventListener("squeeze",I),r.removeEventListener("squeezestart",I),r.removeEventListener("squeezeend",I),r.removeEventListener("end",B),r.removeEventListener("inputsourceschange",X);for(let V=0;V<w.length;V++){const Z=T[V];Z!==null&&(T[V]=null,w[V].disconnect(Z))}P=null,L=null,m.reset();for(const V in p)delete p[V];t.setRenderTarget(M),f=null,d=null,u=null,r=null,b=null,ot.stop(),n.isPresenting=!1,t.setPixelRatio(R),t.setSize(A.width,A.height,!1),n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(V){s=V,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(V){o=V,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return l||a},this.setReferenceSpace=function(V){l=V},this.getBaseLayer=function(){return d!==null?d:f},this.getBinding=function(){return u===null&&v&&(u=new XRWebGLBinding(r,e)),u},this.getFrame=function(){return g},this.getSession=function(){return r},this.setSession=async function(V){if(r=V,r!==null){if(M=t.getRenderTarget(),r.addEventListener("select",I),r.addEventListener("selectstart",I),r.addEventListener("selectend",I),r.addEventListener("squeeze",I),r.addEventListener("squeezestart",I),r.addEventListener("squeezeend",I),r.addEventListener("end",B),r.addEventListener("inputsourceschange",X),y.xrCompatible!==!0&&await e.makeXRCompatible(),R=t.getPixelRatio(),t.getSize(A),v&&"createProjectionLayer"in XRWebGLBinding.prototype){let k=null,G=null,z=null;y.depth&&(z=y.stencil?e.DEPTH24_STENCIL8:e.DEPTH_COMPONENT24,k=y.stencil?da:fa,G=y.stencil?ua:yr);const K={colorFormat:e.RGBA8,depthFormat:z,scaleFactor:s};u=this.getBinding(),d=u.createProjectionLayer(K),r.updateRenderState({layers:[d]}),t.setPixelRatio(1),t.setSize(d.textureWidth,d.textureHeight,!1),b=new on(d.textureWidth,d.textureHeight,{format:Xe,type:Jn,depthTexture:new Id(d.textureWidth,d.textureHeight,G,void 0,void 0,void 0,void 0,void 0,void 0,k),stencilBuffer:y.stencil,colorSpace:t.outputColorSpace,samples:y.antialias?4:0,resolveDepthBuffer:d.ignoreDepthValues===!1,resolveStencilBuffer:d.ignoreDepthValues===!1})}else{const k={antialias:y.antialias,alpha:!0,depth:y.depth,stencil:y.stencil,framebufferScaleFactor:s};f=new XRWebGLLayer(r,e,k),r.updateRenderState({baseLayer:f}),t.setPixelRatio(1),t.setSize(f.framebufferWidth,f.framebufferHeight,!1),b=new on(f.framebufferWidth,f.framebufferHeight,{format:Xe,type:Jn,colorSpace:t.outputColorSpace,stencilBuffer:y.stencil,resolveDepthBuffer:f.ignoreDepthValues===!1,resolveStencilBuffer:f.ignoreDepthValues===!1})}b.isXRRenderTarget=!0,this.setFoveation(c),l=null,a=await r.requestReferenceSpace(o),ot.setContext(r),ot.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(r!==null)return r.environmentBlendMode},this.getDepthTexture=function(){return m.getDepthTexture()};function X(V){for(let Z=0;Z<V.removed.length;Z++){const k=V.removed[Z],G=T.indexOf(k);G>=0&&(T[G]=null,w[G].disconnect(k))}for(let Z=0;Z<V.added.length;Z++){const k=V.added[Z];let G=T.indexOf(k);if(G===-1){for(let K=0;K<w.length;K++)if(K>=T.length){T.push(k),G=K;break}else if(T[K]===null){T[K]=k,G=K;break}if(G===-1)break}const z=w[G];z&&z.connect(k)}}const H=new N,it=new N;function lt(V,Z,k){H.setFromMatrixPosition(Z.matrixWorld),it.setFromMatrixPosition(k.matrixWorld);const G=H.distanceTo(it),z=Z.projectionMatrix.elements,K=k.projectionMatrix.elements,et=z[14]/(z[10]-1),U=z[14]/(z[10]+1),J=(z[9]+1)/z[5],j=(z[9]-1)/z[5],Q=(z[8]-1)/z[0],st=(K[8]+1)/K[0],ut=et*Q,mt=et*st,xt=G/(-Q+st),Jt=xt*-Q;if(Z.matrixWorld.decompose(V.position,V.quaternion,V.scale),V.translateX(Jt),V.translateZ(xt),V.matrixWorld.compose(V.position,V.quaternion,V.scale),V.matrixWorldInverse.copy(V.matrixWorld).invert(),z[10]===-1)V.projectionMatrix.copy(Z.projectionMatrix),V.projectionMatrixInverse.copy(Z.projectionMatrixInverse);else{const $t=et+xt,F=U+xt,C=ut-Jt,$=mt+(G-Jt),at=J*U/F*$t,gt=j*U/F*$t;V.projectionMatrix.makePerspective(C,$,at,gt,$t,F),V.projectionMatrixInverse.copy(V.projectionMatrix).invert()}}function dt(V,Z){Z===null?V.matrixWorld.copy(V.matrix):V.matrixWorld.multiplyMatrices(Z.matrixWorld,V.matrix),V.matrixWorldInverse.copy(V.matrixWorld).invert()}this.updateCamera=function(V){if(r===null)return;let Z=V.near,k=V.far;m.texture!==null&&(m.depthNear>0&&(Z=m.depthNear),m.depthFar>0&&(k=m.depthFar)),E.near=_.near=x.near=Z,E.far=_.far=x.far=k,(P!==E.near||L!==E.far)&&(r.updateRenderState({depthNear:E.near,depthFar:E.far}),P=E.near,L=E.far),E.layers.mask=V.layers.mask|6,x.layers.mask=E.layers.mask&3,_.layers.mask=E.layers.mask&5;const G=V.parent,z=E.cameras;dt(E,G);for(let K=0;K<z.length;K++)dt(z[K],G);z.length===2?lt(E,x,_):E.projectionMatrix.copy(x.projectionMatrix),vt(V,E,G)};function vt(V,Z,k){k===null?V.matrix.copy(Z.matrixWorld):(V.matrix.copy(k.matrixWorld),V.matrix.invert(),V.matrix.multiply(Z.matrixWorld)),V.matrix.decompose(V.position,V.quaternion,V.scale),V.updateMatrixWorld(!0),V.projectionMatrix.copy(Z.projectionMatrix),V.projectionMatrixInverse.copy(Z.projectionMatrixInverse),V.isPerspectiveCamera&&(V.fov=Ls*2*Math.atan(1/V.projectionMatrix.elements[5]),V.zoom=1)}this.getCamera=function(){return E},this.getFoveation=function(){if(!(d===null&&f===null))return c},this.setFoveation=function(V){c=V,d!==null&&(d.fixedFoveation=V),f!==null&&f.fixedFoveation!==void 0&&(f.fixedFoveation=V)},this.hasDepthSensing=function(){return m.texture!==null},this.getDepthSensingMesh=function(){return m.getMesh(E)},this.getCameraTexture=function(V){return p[V]};let wt=null;function Ft(V,Z){if(h=Z.getViewerPose(l||a),g=Z,h!==null){const k=h.views;f!==null&&(t.setRenderTargetFramebuffer(b,f.framebuffer),t.setRenderTarget(b));let G=!1;k.length!==E.cameras.length&&(E.cameras.length=0,G=!0);for(let U=0;U<k.length;U++){const J=k[U];let j=null;if(f!==null)j=f.getViewport(J);else{const st=u.getViewSubImage(d,J);j=st.viewport,U===0&&(t.setRenderTargetTextures(b,st.colorTexture,st.depthStencilTexture),t.setRenderTarget(b))}let Q=S[U];Q===void 0&&(Q=new bn,Q.layers.enable(U),Q.viewport=new le,S[U]=Q),Q.matrix.fromArray(J.transform.matrix),Q.matrix.decompose(Q.position,Q.quaternion,Q.scale),Q.projectionMatrix.fromArray(J.projectionMatrix),Q.projectionMatrixInverse.copy(Q.projectionMatrix).invert(),Q.viewport.set(j.x,j.y,j.width,j.height),U===0&&(E.matrix.copy(Q.matrix),E.matrix.decompose(E.position,E.quaternion,E.scale)),G===!0&&E.cameras.push(Q)}const z=r.enabledFeatures;if(z&&z.includes("depth-sensing")&&r.depthUsage=="gpu-optimized"&&v){u=n.getBinding();const U=u.getDepthInformation(k[0]);U&&U.isValid&&U.texture&&m.init(U,r.renderState)}if(z&&z.includes("camera-access")&&v){t.state.unbindTexture(),u=n.getBinding();for(let U=0;U<k.length;U++){const J=k[U].camera;if(J){let j=p[J];j||(j=new Ud,p[J]=j);const Q=u.getCameraImage(J);j.sourceTexture=Q}}}}for(let k=0;k<w.length;k++){const G=T[k],z=w[k];G!==null&&z!==void 0&&z.update(G,Z,l||a)}wt&&wt(V,Z),Z.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:Z}),g=null}const ot=new qd;ot.setAnimationLoop(Ft),this.setAnimationLoop=function(V){wt=V},this.dispose=function(){}}}const or=new Bn,h2=new ie;function u2(i,t){function e(m,p){m.matrixAutoUpdate===!0&&m.updateMatrix(),p.value.copy(m.matrix)}function n(m,p){p.color.getRGB(m.fogColor.value,Ed(i)),p.isFog?(m.fogNear.value=p.near,m.fogFar.value=p.far):p.isFogExp2&&(m.fogDensity.value=p.density)}function r(m,p,y,M,b){p.isMeshBasicMaterial||p.isMeshLambertMaterial?s(m,p):p.isMeshToonMaterial?(s(m,p),u(m,p)):p.isMeshPhongMaterial?(s(m,p),h(m,p)):p.isMeshStandardMaterial?(s(m,p),d(m,p),p.isMeshPhysicalMaterial&&f(m,p,b)):p.isMeshMatcapMaterial?(s(m,p),g(m,p)):p.isMeshDepthMaterial?s(m,p):p.isMeshDistanceMaterial?(s(m,p),v(m,p)):p.isMeshNormalMaterial?s(m,p):p.isLineBasicMaterial?(a(m,p),p.isLineDashedMaterial&&o(m,p)):p.isPointsMaterial?c(m,p,y,M):p.isSpriteMaterial?l(m,p):p.isShadowMaterial?(m.color.value.copy(p.color),m.opacity.value=p.opacity):p.isShaderMaterial&&(p.uniformsNeedUpdate=!1)}function s(m,p){m.opacity.value=p.opacity,p.color&&m.diffuse.value.copy(p.color),p.emissive&&m.emissive.value.copy(p.emissive).multiplyScalar(p.emissiveIntensity),p.map&&(m.map.value=p.map,e(p.map,m.mapTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,e(p.alphaMap,m.alphaMapTransform)),p.bumpMap&&(m.bumpMap.value=p.bumpMap,e(p.bumpMap,m.bumpMapTransform),m.bumpScale.value=p.bumpScale,p.side===vn&&(m.bumpScale.value*=-1)),p.normalMap&&(m.normalMap.value=p.normalMap,e(p.normalMap,m.normalMapTransform),m.normalScale.value.copy(p.normalScale),p.side===vn&&m.normalScale.value.negate()),p.displacementMap&&(m.displacementMap.value=p.displacementMap,e(p.displacementMap,m.displacementMapTransform),m.displacementScale.value=p.displacementScale,m.displacementBias.value=p.displacementBias),p.emissiveMap&&(m.emissiveMap.value=p.emissiveMap,e(p.emissiveMap,m.emissiveMapTransform)),p.specularMap&&(m.specularMap.value=p.specularMap,e(p.specularMap,m.specularMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest);const y=t.get(p),M=y.envMap,b=y.envMapRotation;M&&(m.envMap.value=M,or.copy(b),or.x*=-1,or.y*=-1,or.z*=-1,M.isCubeTexture&&M.isRenderTargetTexture===!1&&(or.y*=-1,or.z*=-1),m.envMapRotation.value.setFromMatrix4(h2.makeRotationFromEuler(or)),m.flipEnvMap.value=M.isCubeTexture&&M.isRenderTargetTexture===!1?-1:1,m.reflectivity.value=p.reflectivity,m.ior.value=p.ior,m.refractionRatio.value=p.refractionRatio),p.lightMap&&(m.lightMap.value=p.lightMap,m.lightMapIntensity.value=p.lightMapIntensity,e(p.lightMap,m.lightMapTransform)),p.aoMap&&(m.aoMap.value=p.aoMap,m.aoMapIntensity.value=p.aoMapIntensity,e(p.aoMap,m.aoMapTransform))}function a(m,p){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,p.map&&(m.map.value=p.map,e(p.map,m.mapTransform))}function o(m,p){m.dashSize.value=p.dashSize,m.totalSize.value=p.dashSize+p.gapSize,m.scale.value=p.scale}function c(m,p,y,M){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,m.size.value=p.size*y,m.scale.value=M*.5,p.map&&(m.map.value=p.map,e(p.map,m.uvTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,e(p.alphaMap,m.alphaMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest)}function l(m,p){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,m.rotation.value=p.rotation,p.map&&(m.map.value=p.map,e(p.map,m.mapTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,e(p.alphaMap,m.alphaMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest)}function h(m,p){m.specular.value.copy(p.specular),m.shininess.value=Math.max(p.shininess,1e-4)}function u(m,p){p.gradientMap&&(m.gradientMap.value=p.gradientMap)}function d(m,p){m.metalness.value=p.metalness,p.metalnessMap&&(m.metalnessMap.value=p.metalnessMap,e(p.metalnessMap,m.metalnessMapTransform)),m.roughness.value=p.roughness,p.roughnessMap&&(m.roughnessMap.value=p.roughnessMap,e(p.roughnessMap,m.roughnessMapTransform)),p.envMap&&(m.envMapIntensity.value=p.envMapIntensity)}function f(m,p,y){m.ior.value=p.ior,p.sheen>0&&(m.sheenColor.value.copy(p.sheenColor).multiplyScalar(p.sheen),m.sheenRoughness.value=p.sheenRoughness,p.sheenColorMap&&(m.sheenColorMap.value=p.sheenColorMap,e(p.sheenColorMap,m.sheenColorMapTransform)),p.sheenRoughnessMap&&(m.sheenRoughnessMap.value=p.sheenRoughnessMap,e(p.sheenRoughnessMap,m.sheenRoughnessMapTransform))),p.clearcoat>0&&(m.clearcoat.value=p.clearcoat,m.clearcoatRoughness.value=p.clearcoatRoughness,p.clearcoatMap&&(m.clearcoatMap.value=p.clearcoatMap,e(p.clearcoatMap,m.clearcoatMapTransform)),p.clearcoatRoughnessMap&&(m.clearcoatRoughnessMap.value=p.clearcoatRoughnessMap,e(p.clearcoatRoughnessMap,m.clearcoatRoughnessMapTransform)),p.clearcoatNormalMap&&(m.clearcoatNormalMap.value=p.clearcoatNormalMap,e(p.clearcoatNormalMap,m.clearcoatNormalMapTransform),m.clearcoatNormalScale.value.copy(p.clearcoatNormalScale),p.side===vn&&m.clearcoatNormalScale.value.negate())),p.dispersion>0&&(m.dispersion.value=p.dispersion),p.iridescence>0&&(m.iridescence.value=p.iridescence,m.iridescenceIOR.value=p.iridescenceIOR,m.iridescenceThicknessMinimum.value=p.iridescenceThicknessRange[0],m.iridescenceThicknessMaximum.value=p.iridescenceThicknessRange[1],p.iridescenceMap&&(m.iridescenceMap.value=p.iridescenceMap,e(p.iridescenceMap,m.iridescenceMapTransform)),p.iridescenceThicknessMap&&(m.iridescenceThicknessMap.value=p.iridescenceThicknessMap,e(p.iridescenceThicknessMap,m.iridescenceThicknessMapTransform))),p.transmission>0&&(m.transmission.value=p.transmission,m.transmissionSamplerMap.value=y.texture,m.transmissionSamplerSize.value.set(y.width,y.height),p.transmissionMap&&(m.transmissionMap.value=p.transmissionMap,e(p.transmissionMap,m.transmissionMapTransform)),m.thickness.value=p.thickness,p.thicknessMap&&(m.thicknessMap.value=p.thicknessMap,e(p.thicknessMap,m.thicknessMapTransform)),m.attenuationDistance.value=p.attenuationDistance,m.attenuationColor.value.copy(p.attenuationColor)),p.anisotropy>0&&(m.anisotropyVector.value.set(p.anisotropy*Math.cos(p.anisotropyRotation),p.anisotropy*Math.sin(p.anisotropyRotation)),p.anisotropyMap&&(m.anisotropyMap.value=p.anisotropyMap,e(p.anisotropyMap,m.anisotropyMapTransform))),m.specularIntensity.value=p.specularIntensity,m.specularColor.value.copy(p.specularColor),p.specularColorMap&&(m.specularColorMap.value=p.specularColorMap,e(p.specularColorMap,m.specularColorMapTransform)),p.specularIntensityMap&&(m.specularIntensityMap.value=p.specularIntensityMap,e(p.specularIntensityMap,m.specularIntensityMapTransform))}function g(m,p){p.matcap&&(m.matcap.value=p.matcap)}function v(m,p){const y=t.get(p).light;m.referencePosition.value.setFromMatrixPosition(y.matrixWorld),m.nearDistance.value=y.shadow.camera.near,m.farDistance.value=y.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:r}}function f2(i,t,e,n){let r={},s={},a=[];const o=i.getParameter(i.MAX_UNIFORM_BUFFER_BINDINGS);function c(y,M){const b=M.program;n.uniformBlockBinding(y,b)}function l(y,M){let b=r[y.id];b===void 0&&(g(y),b=h(y),r[y.id]=b,y.addEventListener("dispose",m));const w=M.program;n.updateUBOMapping(y,w);const T=t.render.frame;s[y.id]!==T&&(d(y),s[y.id]=T)}function h(y){const M=u();y.__bindingPointIndex=M;const b=i.createBuffer(),w=y.__size,T=y.usage;return i.bindBuffer(i.UNIFORM_BUFFER,b),i.bufferData(i.UNIFORM_BUFFER,w,T),i.bindBuffer(i.UNIFORM_BUFFER,null),i.bindBufferBase(i.UNIFORM_BUFFER,M,b),b}function u(){for(let y=0;y<o;y++)if(a.indexOf(y)===-1)return a.push(y),y;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function d(y){const M=r[y.id],b=y.uniforms,w=y.__cache;i.bindBuffer(i.UNIFORM_BUFFER,M);for(let T=0,A=b.length;T<A;T++){const R=Array.isArray(b[T])?b[T]:[b[T]];for(let x=0,_=R.length;x<_;x++){const S=R[x];if(f(S,T,x,w)===!0){const E=S.__offset,P=Array.isArray(S.value)?S.value:[S.value];let L=0;for(let I=0;I<P.length;I++){const B=P[I],X=v(B);typeof B=="number"||typeof B=="boolean"?(S.__data[0]=B,i.bufferSubData(i.UNIFORM_BUFFER,E+L,S.__data)):B.isMatrix3?(S.__data[0]=B.elements[0],S.__data[1]=B.elements[1],S.__data[2]=B.elements[2],S.__data[3]=0,S.__data[4]=B.elements[3],S.__data[5]=B.elements[4],S.__data[6]=B.elements[5],S.__data[7]=0,S.__data[8]=B.elements[6],S.__data[9]=B.elements[7],S.__data[10]=B.elements[8],S.__data[11]=0):(B.toArray(S.__data,L),L+=X.storage/Float32Array.BYTES_PER_ELEMENT)}i.bufferSubData(i.UNIFORM_BUFFER,E,S.__data)}}}i.bindBuffer(i.UNIFORM_BUFFER,null)}function f(y,M,b,w){const T=y.value,A=M+"_"+b;if(w[A]===void 0)return typeof T=="number"||typeof T=="boolean"?w[A]=T:w[A]=T.clone(),!0;{const R=w[A];if(typeof T=="number"||typeof T=="boolean"){if(R!==T)return w[A]=T,!0}else if(R.equals(T)===!1)return R.copy(T),!0}return!1}function g(y){const M=y.uniforms;let b=0;const w=16;for(let A=0,R=M.length;A<R;A++){const x=Array.isArray(M[A])?M[A]:[M[A]];for(let _=0,S=x.length;_<S;_++){const E=x[_],P=Array.isArray(E.value)?E.value:[E.value];for(let L=0,I=P.length;L<I;L++){const B=P[L],X=v(B),H=b%w,it=H%X.boundary,lt=H+it;b+=it,lt!==0&&w-lt<X.storage&&(b+=w-lt),E.__data=new Float32Array(X.storage/Float32Array.BYTES_PER_ELEMENT),E.__offset=b,b+=X.storage}}}const T=b%w;return T>0&&(b+=w-T),y.__size=b,y.__cache={},this}function v(y){const M={boundary:0,storage:0};return typeof y=="number"||typeof y=="boolean"?(M.boundary=4,M.storage=4):y.isVector2?(M.boundary=8,M.storage=8):y.isVector3||y.isColor?(M.boundary=16,M.storage=12):y.isVector4?(M.boundary=16,M.storage=16):y.isMatrix3?(M.boundary=48,M.storage=48):y.isMatrix4?(M.boundary=64,M.storage=64):y.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",y),M}function m(y){const M=y.target;M.removeEventListener("dispose",m);const b=a.indexOf(M.__bindingPointIndex);a.splice(b,1),i.deleteBuffer(r[M.id]),delete r[M.id],delete s[M.id]}function p(){for(const y in r)i.deleteBuffer(r[y]);a=[],r={},s={}}return{bind:c,update:l,dispose:p}}class d2{constructor(t={}){const{canvas:e=o1(),context:n=null,depth:r=!0,stencil:s=!1,alpha:a=!1,antialias:o=!1,premultipliedAlpha:c=!0,preserveDrawingBuffer:l=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:u=!1,reversedDepthBuffer:d=!1}=t;this.isWebGLRenderer=!0;let f;if(n!==null){if(typeof WebGLRenderingContext<"u"&&n instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");f=n.getContextAttributes().alpha}else f=a;const g=new Uint32Array(4),v=new Int32Array(4);let m=null,p=null;const y=[],M=[];this.domElement=e,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=Zi,this.toneMappingExposure=1,this.transmissionResolutionScale=1;const b=this;let w=!1;this._outputColorSpace=an;let T=0,A=0,R=null,x=-1,_=null;const S=new le,E=new le;let P=null;const L=new Pt(0);let I=0,B=e.width,X=e.height,H=1,it=null,lt=null;const dt=new le(0,0,B,X),vt=new le(0,0,B,X);let wt=!1;const Ft=new mh;let ot=!1,V=!1;const Z=new ie,k=new N,G=new le,z={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let K=!1;function et(){return R===null?H:1}let U=n;function J(D,q){return e.getContext(D,q)}try{const D={alpha:!0,depth:r,stencil:s,antialias:o,premultipliedAlpha:c,preserveDrawingBuffer:l,powerPreference:h,failIfMajorPerformanceCaveat:u};if("setAttribute"in e&&e.setAttribute("data-engine",`three.js r${ih}`),e.addEventListener("webglcontextlost",Tt,!1),e.addEventListener("webglcontextrestored",Nt,!1),e.addEventListener("webglcontextcreationerror",Mt,!1),U===null){const q="webgl2";if(U=J(q,D),U===null)throw J(q)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(D){throw console.error("THREE.WebGLRenderer: "+D.message),D}let j,Q,st,ut,mt,xt,Jt,$t,F,C,$,at,gt,ht,Ht,Et,Bt,kt,_t,Lt,jt,Vt,Rt,Qt;function W(){j=new Sx(U),j.init(),Vt=new s2(U,j),Q=new gx(U,j,t,Vt),st=new i2(U,j),Q.reversedDepthBuffer&&d&&st.buffers.depth.setReversed(!0),ut=new Tx(U),mt=new W_,xt=new r2(U,j,st,mt,Q,Vt,ut),Jt=new xx(b),$t=new bx(b),F=new Dm(U),Rt=new px(U,F),C=new wx(U,F,ut,Rt),$=new Rx(U,C,F,ut),_t=new Ax(U,Q,xt),Et=new vx(mt),at=new G_(b,Jt,$t,j,Q,Rt,Et),gt=new u2(b,mt),ht=new q_,Ht=new K_(j),kt=new dx(b,Jt,$t,st,$,f,c),Bt=new e2(b,$,Q),Qt=new f2(U,ut,Q,st),Lt=new mx(U,j,ut),jt=new Ex(U,j,ut),ut.programs=at.programs,b.capabilities=Q,b.extensions=j,b.properties=mt,b.renderLists=ht,b.shadowMap=Bt,b.state=st,b.info=ut}W();const bt=new l2(b,U);this.xr=bt,this.getContext=function(){return U},this.getContextAttributes=function(){return U.getContextAttributes()},this.forceContextLoss=function(){const D=j.get("WEBGL_lose_context");D&&D.loseContext()},this.forceContextRestore=function(){const D=j.get("WEBGL_lose_context");D&&D.restoreContext()},this.getPixelRatio=function(){return H},this.setPixelRatio=function(D){D!==void 0&&(H=D,this.setSize(B,X,!1))},this.getSize=function(D){return D.set(B,X)},this.setSize=function(D,q,tt=!0){if(bt.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}B=D,X=q,e.width=Math.floor(D*H),e.height=Math.floor(q*H),tt===!0&&(e.style.width=D+"px",e.style.height=q+"px"),this.setViewport(0,0,D,q)},this.getDrawingBufferSize=function(D){return D.set(B*H,X*H).floor()},this.setDrawingBufferSize=function(D,q,tt){B=D,X=q,H=tt,e.width=Math.floor(D*tt),e.height=Math.floor(q*tt),this.setViewport(0,0,D,q)},this.getCurrentViewport=function(D){return D.copy(S)},this.getViewport=function(D){return D.copy(dt)},this.setViewport=function(D,q,tt,nt){D.isVector4?dt.set(D.x,D.y,D.z,D.w):dt.set(D,q,tt,nt),st.viewport(S.copy(dt).multiplyScalar(H).round())},this.getScissor=function(D){return D.copy(vt)},this.setScissor=function(D,q,tt,nt){D.isVector4?vt.set(D.x,D.y,D.z,D.w):vt.set(D,q,tt,nt),st.scissor(E.copy(vt).multiplyScalar(H).round())},this.getScissorTest=function(){return wt},this.setScissorTest=function(D){st.setScissorTest(wt=D)},this.setOpaqueSort=function(D){it=D},this.setTransparentSort=function(D){lt=D},this.getClearColor=function(D){return D.copy(kt.getClearColor())},this.setClearColor=function(){kt.setClearColor(...arguments)},this.getClearAlpha=function(){return kt.getClearAlpha()},this.setClearAlpha=function(){kt.setClearAlpha(...arguments)},this.clear=function(D=!0,q=!0,tt=!0){let nt=0;if(D){let Y=!1;if(R!==null){const yt=R.texture.format;Y=yt===lh||yt===ch||yt===oh}if(Y){const yt=R.texture.type,Ct=yt===Jn||yt===yr||yt===ha||yt===ua||yt===sh||yt===ah,Ot=kt.getClearColor(),Ut=kt.getClearAlpha(),qt=Ot.r,Zt=Ot.g,Gt=Ot.b;Ct?(g[0]=qt,g[1]=Zt,g[2]=Gt,g[3]=Ut,U.clearBufferuiv(U.COLOR,0,g)):(v[0]=qt,v[1]=Zt,v[2]=Gt,v[3]=Ut,U.clearBufferiv(U.COLOR,0,v))}else nt|=U.COLOR_BUFFER_BIT}q&&(nt|=U.DEPTH_BUFFER_BIT),tt&&(nt|=U.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),U.clear(nt)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){e.removeEventListener("webglcontextlost",Tt,!1),e.removeEventListener("webglcontextrestored",Nt,!1),e.removeEventListener("webglcontextcreationerror",Mt,!1),kt.dispose(),ht.dispose(),Ht.dispose(),mt.dispose(),Jt.dispose(),$t.dispose(),$.dispose(),Rt.dispose(),Qt.dispose(),at.dispose(),bt.dispose(),bt.removeEventListener("sessionstart",Kn),bt.removeEventListener("sessionend",Hh),tr.stop()};function Tt(D){D.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),w=!0}function Nt(){console.log("THREE.WebGLRenderer: Context Restored."),w=!1;const D=ut.autoReset,q=Bt.enabled,tt=Bt.autoUpdate,nt=Bt.needsUpdate,Y=Bt.type;W(),ut.autoReset=D,Bt.enabled=q,Bt.autoUpdate=tt,Bt.needsUpdate=nt,Bt.type=Y}function Mt(D){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",D.statusMessage)}function pt(D){const q=D.target;q.removeEventListener("dispose",pt),zt(q)}function zt(D){Kt(D),mt.remove(D)}function Kt(D){const q=mt.get(D).programs;q!==void 0&&(q.forEach(function(tt){at.releaseProgram(tt)}),D.isShaderMaterial&&at.releaseShaderCache(D))}this.renderBufferDirect=function(D,q,tt,nt,Y,yt){q===null&&(q=z);const Ct=Y.isMesh&&Y.matrixWorld.determinant()<0,Ot=W0(D,q,tt,nt,Y);st.setMaterial(nt,Ct);let Ut=tt.index,qt=1;if(nt.wireframe===!0){if(Ut=C.getWireframeAttribute(tt),Ut===void 0)return;qt=2}const Zt=tt.drawRange,Gt=tt.attributes.position;let re=Zt.start*qt,fe=(Zt.start+Zt.count)*qt;yt!==null&&(re=Math.max(re,yt.start*qt),fe=Math.min(fe,(yt.start+yt.count)*qt)),Ut!==null?(re=Math.max(re,0),fe=Math.min(fe,Ut.count)):Gt!=null&&(re=Math.max(re,0),fe=Math.min(fe,Gt.count));const Re=fe-re;if(Re<0||Re===1/0)return;Rt.setup(Y,nt,Ot,tt,Ut);let xe,pe=Lt;if(Ut!==null&&(xe=F.get(Ut),pe=jt,pe.setIndex(xe)),Y.isMesh)nt.wireframe===!0?(st.setLineWidth(nt.wireframeLinewidth*et()),pe.setMode(U.LINES)):pe.setMode(U.TRIANGLES);else if(Y.isLine){let Xt=nt.linewidth;Xt===void 0&&(Xt=1),st.setLineWidth(Xt*et()),Y.isLineSegments?pe.setMode(U.LINES):Y.isLineLoop?pe.setMode(U.LINE_LOOP):pe.setMode(U.LINE_STRIP)}else Y.isPoints?pe.setMode(U.POINTS):Y.isSprite&&pe.setMode(U.TRIANGLES);if(Y.isBatchedMesh)if(Y._multiDrawInstances!==null)pa("THREE.WebGLRenderer: renderMultiDrawInstances has been deprecated and will be removed in r184. Append to renderMultiDraw arguments and use indirection."),pe.renderMultiDrawInstances(Y._multiDrawStarts,Y._multiDrawCounts,Y._multiDrawCount,Y._multiDrawInstances);else if(j.get("WEBGL_multi_draw"))pe.renderMultiDraw(Y._multiDrawStarts,Y._multiDrawCounts,Y._multiDrawCount);else{const Xt=Y._multiDrawStarts,we=Y._multiDrawCounts,oe=Y._multiDrawCount,xn=Ut?F.get(Ut).bytesPerElement:1,Nr=mt.get(nt).currentProgram.getUniforms();for(let _n=0;_n<oe;_n++)Nr.setValue(U,"_gl_DrawID",_n),pe.render(Xt[_n]/xn,we[_n])}else if(Y.isInstancedMesh)pe.renderInstances(re,Re,Y.count);else if(tt.isInstancedBufferGeometry){const Xt=tt._maxInstanceCount!==void 0?tt._maxInstanceCount:1/0,we=Math.min(tt.instanceCount,Xt);pe.renderInstances(re,Re,we)}else pe.render(re,Re)};function me(D,q,tt){D.transparent===!0&&D.side===Ze&&D.forceSinglePass===!1?(D.side=vn,D.needsUpdate=!0,Ua(D,q,tt),D.side=Ki,D.needsUpdate=!0,Ua(D,q,tt),D.side=Ze):Ua(D,q,tt)}this.compile=function(D,q,tt=null){tt===null&&(tt=D),p=Ht.get(tt),p.init(q),M.push(p),tt.traverseVisible(function(Y){Y.isLight&&Y.layers.test(q.layers)&&(p.pushLight(Y),Y.castShadow&&p.pushShadow(Y))}),D!==tt&&D.traverseVisible(function(Y){Y.isLight&&Y.layers.test(q.layers)&&(p.pushLight(Y),Y.castShadow&&p.pushShadow(Y))}),p.setupLights();const nt=new Set;return D.traverse(function(Y){if(!(Y.isMesh||Y.isPoints||Y.isLine||Y.isSprite))return;const yt=Y.material;if(yt)if(Array.isArray(yt))for(let Ct=0;Ct<yt.length;Ct++){const Ot=yt[Ct];me(Ot,tt,Y),nt.add(Ot)}else me(yt,tt,Y),nt.add(yt)}),p=M.pop(),nt},this.compileAsync=function(D,q,tt=null){const nt=this.compile(D,q,tt);return new Promise(Y=>{function yt(){if(nt.forEach(function(Ct){mt.get(Ct).currentProgram.isReady()&&nt.delete(Ct)}),nt.size===0){Y(D);return}setTimeout(yt,10)}j.get("KHR_parallel_shader_compile")!==null?yt():setTimeout(yt,10)})};let he=null;function vi(D){he&&he(D)}function Kn(){tr.stop()}function Hh(){tr.start()}const tr=new qd;tr.setAnimationLoop(vi),typeof self<"u"&&tr.setContext(self),this.setAnimationLoop=function(D){he=D,bt.setAnimationLoop(D),D===null?tr.stop():tr.start()},bt.addEventListener("sessionstart",Kn),bt.addEventListener("sessionend",Hh),this.render=function(D,q){if(q!==void 0&&q.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(w===!0)return;if(D.matrixWorldAutoUpdate===!0&&D.updateMatrixWorld(),q.parent===null&&q.matrixWorldAutoUpdate===!0&&q.updateMatrixWorld(),bt.enabled===!0&&bt.isPresenting===!0&&(bt.cameraAutoUpdate===!0&&bt.updateCamera(q),q=bt.getCamera()),D.isScene===!0&&D.onBeforeRender(b,D,q,R),p=Ht.get(D,M.length),p.init(q),M.push(p),Z.multiplyMatrices(q.projectionMatrix,q.matrixWorldInverse),Ft.setFromProjectionMatrix(Z,hi,q.reversedDepth),V=this.localClippingEnabled,ot=Et.init(this.clippingPlanes,V),m=ht.get(D,y.length),m.init(),y.push(m),bt.enabled===!0&&bt.isPresenting===!0){const yt=b.xr.getDepthSensingMesh();yt!==null&&Zo(yt,q,-1/0,b.sortObjects)}Zo(D,q,0,b.sortObjects),m.finish(),b.sortObjects===!0&&m.sort(it,lt),K=bt.enabled===!1||bt.isPresenting===!1||bt.hasDepthSensing()===!1,K&&kt.addToRenderList(m,D),this.info.render.frame++,ot===!0&&Et.beginShadows();const tt=p.state.shadowsArray;Bt.render(tt,D,q),ot===!0&&Et.endShadows(),this.info.autoReset===!0&&this.info.reset();const nt=m.opaque,Y=m.transmissive;if(p.setupLights(),q.isArrayCamera){const yt=q.cameras;if(Y.length>0)for(let Ct=0,Ot=yt.length;Ct<Ot;Ct++){const Ut=yt[Ct];Gh(nt,Y,D,Ut)}K&&kt.render(D);for(let Ct=0,Ot=yt.length;Ct<Ot;Ct++){const Ut=yt[Ct];Vh(m,D,Ut,Ut.viewport)}}else Y.length>0&&Gh(nt,Y,D,q),K&&kt.render(D),Vh(m,D,q);R!==null&&A===0&&(xt.updateMultisampleRenderTarget(R),xt.updateRenderTargetMipmap(R)),D.isScene===!0&&D.onAfterRender(b,D,q),Rt.resetDefaultState(),x=-1,_=null,M.pop(),M.length>0?(p=M[M.length-1],ot===!0&&Et.setGlobalState(b.clippingPlanes,p.state.camera)):p=null,y.pop(),y.length>0?m=y[y.length-1]:m=null};function Zo(D,q,tt,nt){if(D.visible===!1)return;if(D.layers.test(q.layers)){if(D.isGroup)tt=D.renderOrder;else if(D.isLOD)D.autoUpdate===!0&&D.update(q);else if(D.isLight)p.pushLight(D),D.castShadow&&p.pushShadow(D);else if(D.isSprite){if(!D.frustumCulled||Ft.intersectsSprite(D)){nt&&G.setFromMatrixPosition(D.matrixWorld).applyMatrix4(Z);const Ct=$.update(D),Ot=D.material;Ot.visible&&m.push(D,Ct,Ot,tt,G.z,null)}}else if((D.isMesh||D.isLine||D.isPoints)&&(!D.frustumCulled||Ft.intersectsObject(D))){const Ct=$.update(D),Ot=D.material;if(nt&&(D.boundingSphere!==void 0?(D.boundingSphere===null&&D.computeBoundingSphere(),G.copy(D.boundingSphere.center)):(Ct.boundingSphere===null&&Ct.computeBoundingSphere(),G.copy(Ct.boundingSphere.center)),G.applyMatrix4(D.matrixWorld).applyMatrix4(Z)),Array.isArray(Ot)){const Ut=Ct.groups;for(let qt=0,Zt=Ut.length;qt<Zt;qt++){const Gt=Ut[qt],re=Ot[Gt.materialIndex];re&&re.visible&&m.push(D,Ct,re,tt,G.z,Gt)}}else Ot.visible&&m.push(D,Ct,Ot,tt,G.z,null)}}const yt=D.children;for(let Ct=0,Ot=yt.length;Ct<Ot;Ct++)Zo(yt[Ct],q,tt,nt)}function Vh(D,q,tt,nt){const Y=D.opaque,yt=D.transmissive,Ct=D.transparent;p.setupLightsView(tt),ot===!0&&Et.setGlobalState(b.clippingPlanes,tt),nt&&st.viewport(S.copy(nt)),Y.length>0&&Ia(Y,q,tt),yt.length>0&&Ia(yt,q,tt),Ct.length>0&&Ia(Ct,q,tt),st.buffers.depth.setTest(!0),st.buffers.depth.setMask(!0),st.buffers.color.setMask(!0),st.setPolygonOffset(!1)}function Gh(D,q,tt,nt){if((tt.isScene===!0?tt.overrideMaterial:null)!==null)return;p.state.transmissionRenderTarget[nt.id]===void 0&&(p.state.transmissionRenderTarget[nt.id]=new on(1,1,{generateMipmaps:!0,type:j.has("EXT_color_buffer_half_float")||j.has("EXT_color_buffer_float")?Tr:Jn,minFilter:qi,samples:4,stencilBuffer:s,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:ce.workingColorSpace}));const yt=p.state.transmissionRenderTarget[nt.id],Ct=nt.viewport||S;yt.setSize(Ct.z*b.transmissionResolutionScale,Ct.w*b.transmissionResolutionScale);const Ot=b.getRenderTarget(),Ut=b.getActiveCubeFace(),qt=b.getActiveMipmapLevel();b.setRenderTarget(yt),b.getClearColor(L),I=b.getClearAlpha(),I<1&&b.setClearColor(16777215,.5),b.clear(),K&&kt.render(tt);const Zt=b.toneMapping;b.toneMapping=Zi;const Gt=nt.viewport;if(nt.viewport!==void 0&&(nt.viewport=void 0),p.setupLightsView(nt),ot===!0&&Et.setGlobalState(b.clippingPlanes,nt),Ia(D,tt,nt),xt.updateMultisampleRenderTarget(yt),xt.updateRenderTargetMipmap(yt),j.has("WEBGL_multisampled_render_to_texture")===!1){let re=!1;for(let fe=0,Re=q.length;fe<Re;fe++){const xe=q[fe],pe=xe.object,Xt=xe.geometry,we=xe.material,oe=xe.group;if(we.side===Ze&&pe.layers.test(nt.layers)){const xn=we.side;we.side=vn,we.needsUpdate=!0,Wh(pe,tt,nt,Xt,we,oe),we.side=xn,we.needsUpdate=!0,re=!0}}re===!0&&(xt.updateMultisampleRenderTarget(yt),xt.updateRenderTargetMipmap(yt))}b.setRenderTarget(Ot,Ut,qt),b.setClearColor(L,I),Gt!==void 0&&(nt.viewport=Gt),b.toneMapping=Zt}function Ia(D,q,tt){const nt=q.isScene===!0?q.overrideMaterial:null;for(let Y=0,yt=D.length;Y<yt;Y++){const Ct=D[Y],Ot=Ct.object,Ut=Ct.geometry,qt=Ct.group;let Zt=Ct.material;Zt.allowOverride===!0&&nt!==null&&(Zt=nt),Ot.layers.test(tt.layers)&&Wh(Ot,q,tt,Ut,Zt,qt)}}function Wh(D,q,tt,nt,Y,yt){D.onBeforeRender(b,q,tt,nt,Y,yt),D.modelViewMatrix.multiplyMatrices(tt.matrixWorldInverse,D.matrixWorld),D.normalMatrix.getNormalMatrix(D.modelViewMatrix),Y.onBeforeRender(b,q,tt,nt,D,yt),Y.transparent===!0&&Y.side===Ze&&Y.forceSinglePass===!1?(Y.side=vn,Y.needsUpdate=!0,b.renderBufferDirect(tt,q,nt,Y,D,yt),Y.side=Ki,Y.needsUpdate=!0,b.renderBufferDirect(tt,q,nt,Y,D,yt),Y.side=Ze):b.renderBufferDirect(tt,q,nt,Y,D,yt),D.onAfterRender(b,q,tt,nt,Y,yt)}function Ua(D,q,tt){q.isScene!==!0&&(q=z);const nt=mt.get(D),Y=p.state.lights,yt=p.state.shadowsArray,Ct=Y.state.version,Ot=at.getParameters(D,Y.state,yt,q,tt),Ut=at.getProgramCacheKey(Ot);let qt=nt.programs;nt.environment=D.isMeshStandardMaterial?q.environment:null,nt.fog=q.fog,nt.envMap=(D.isMeshStandardMaterial?$t:Jt).get(D.envMap||nt.environment),nt.envMapRotation=nt.environment!==null&&D.envMap===null?q.environmentRotation:D.envMapRotation,qt===void 0&&(D.addEventListener("dispose",pt),qt=new Map,nt.programs=qt);let Zt=qt.get(Ut);if(Zt!==void 0){if(nt.currentProgram===Zt&&nt.lightsStateVersion===Ct)return qh(D,Ot),Zt}else Ot.uniforms=at.getUniforms(D),D.onBeforeCompile(Ot,b),Zt=at.acquireProgram(Ot,Ut),qt.set(Ut,Zt),nt.uniforms=Ot.uniforms;const Gt=nt.uniforms;return(!D.isShaderMaterial&&!D.isRawShaderMaterial||D.clipping===!0)&&(Gt.clippingPlanes=Et.uniform),qh(D,Ot),nt.needsLights=q0(D),nt.lightsStateVersion=Ct,nt.needsLights&&(Gt.ambientLightColor.value=Y.state.ambient,Gt.lightProbe.value=Y.state.probe,Gt.directionalLights.value=Y.state.directional,Gt.directionalLightShadows.value=Y.state.directionalShadow,Gt.spotLights.value=Y.state.spot,Gt.spotLightShadows.value=Y.state.spotShadow,Gt.rectAreaLights.value=Y.state.rectArea,Gt.ltc_1.value=Y.state.rectAreaLTC1,Gt.ltc_2.value=Y.state.rectAreaLTC2,Gt.pointLights.value=Y.state.point,Gt.pointLightShadows.value=Y.state.pointShadow,Gt.hemisphereLights.value=Y.state.hemi,Gt.directionalShadowMap.value=Y.state.directionalShadowMap,Gt.directionalShadowMatrix.value=Y.state.directionalShadowMatrix,Gt.spotShadowMap.value=Y.state.spotShadowMap,Gt.spotLightMatrix.value=Y.state.spotLightMatrix,Gt.spotLightMap.value=Y.state.spotLightMap,Gt.pointShadowMap.value=Y.state.pointShadowMap,Gt.pointShadowMatrix.value=Y.state.pointShadowMatrix),nt.currentProgram=Zt,nt.uniformsList=null,Zt}function Xh(D){if(D.uniformsList===null){const q=D.currentProgram.getUniforms();D.uniformsList=To.seqWithValue(q.seq,D.uniforms)}return D.uniformsList}function qh(D,q){const tt=mt.get(D);tt.outputColorSpace=q.outputColorSpace,tt.batching=q.batching,tt.batchingColor=q.batchingColor,tt.instancing=q.instancing,tt.instancingColor=q.instancingColor,tt.instancingMorph=q.instancingMorph,tt.skinning=q.skinning,tt.morphTargets=q.morphTargets,tt.morphNormals=q.morphNormals,tt.morphColors=q.morphColors,tt.morphTargetsCount=q.morphTargetsCount,tt.numClippingPlanes=q.numClippingPlanes,tt.numIntersection=q.numClipIntersection,tt.vertexAlphas=q.vertexAlphas,tt.vertexTangents=q.vertexTangents,tt.toneMapping=q.toneMapping}function W0(D,q,tt,nt,Y){q.isScene!==!0&&(q=z),xt.resetTextureUnits();const yt=q.fog,Ct=nt.isMeshStandardMaterial?q.environment:null,Ot=R===null?b.outputColorSpace:R.isXRRenderTarget===!0?R.texture.colorSpace:br,Ut=(nt.isMeshStandardMaterial?$t:Jt).get(nt.envMap||Ct),qt=nt.vertexColors===!0&&!!tt.attributes.color&&tt.attributes.color.itemSize===4,Zt=!!tt.attributes.tangent&&(!!nt.normalMap||nt.anisotropy>0),Gt=!!tt.morphAttributes.position,re=!!tt.morphAttributes.normal,fe=!!tt.morphAttributes.color;let Re=Zi;nt.toneMapped&&(R===null||R.isXRRenderTarget===!0)&&(Re=b.toneMapping);const xe=tt.morphAttributes.position||tt.morphAttributes.normal||tt.morphAttributes.color,pe=xe!==void 0?xe.length:0,Xt=mt.get(nt),we=p.state.lights;if(ot===!0&&(V===!0||D!==_)){const Je=D===_&&nt.id===x;Et.setState(nt,D,Je)}let oe=!1;nt.version===Xt.__version?(Xt.needsLights&&Xt.lightsStateVersion!==we.state.version||Xt.outputColorSpace!==Ot||Y.isBatchedMesh&&Xt.batching===!1||!Y.isBatchedMesh&&Xt.batching===!0||Y.isBatchedMesh&&Xt.batchingColor===!0&&Y.colorTexture===null||Y.isBatchedMesh&&Xt.batchingColor===!1&&Y.colorTexture!==null||Y.isInstancedMesh&&Xt.instancing===!1||!Y.isInstancedMesh&&Xt.instancing===!0||Y.isSkinnedMesh&&Xt.skinning===!1||!Y.isSkinnedMesh&&Xt.skinning===!0||Y.isInstancedMesh&&Xt.instancingColor===!0&&Y.instanceColor===null||Y.isInstancedMesh&&Xt.instancingColor===!1&&Y.instanceColor!==null||Y.isInstancedMesh&&Xt.instancingMorph===!0&&Y.morphTexture===null||Y.isInstancedMesh&&Xt.instancingMorph===!1&&Y.morphTexture!==null||Xt.envMap!==Ut||nt.fog===!0&&Xt.fog!==yt||Xt.numClippingPlanes!==void 0&&(Xt.numClippingPlanes!==Et.numPlanes||Xt.numIntersection!==Et.numIntersection)||Xt.vertexAlphas!==qt||Xt.vertexTangents!==Zt||Xt.morphTargets!==Gt||Xt.morphNormals!==re||Xt.morphColors!==fe||Xt.toneMapping!==Re||Xt.morphTargetsCount!==pe)&&(oe=!0):(oe=!0,Xt.__version=nt.version);let xn=Xt.currentProgram;oe===!0&&(xn=Ua(nt,q,Y));let Nr=!1,_n=!1,Vs=!1;const Ee=xn.getUniforms(),Rn=Xt.uniforms;if(st.useProgram(xn.program)&&(Nr=!0,_n=!0,Vs=!0),nt.id!==x&&(x=nt.id,_n=!0),Nr||_!==D){st.buffers.depth.getReversed()&&D.reversedDepth!==!0&&(D._reversedDepth=!0,D.updateProjectionMatrix()),Ee.setValue(U,"projectionMatrix",D.projectionMatrix),Ee.setValue(U,"viewMatrix",D.matrixWorldInverse);const ln=Ee.map.cameraPosition;ln!==void 0&&ln.setValue(U,k.setFromMatrixPosition(D.matrixWorld)),Q.logarithmicDepthBuffer&&Ee.setValue(U,"logDepthBufFC",2/(Math.log(D.far+1)/Math.LN2)),(nt.isMeshPhongMaterial||nt.isMeshToonMaterial||nt.isMeshLambertMaterial||nt.isMeshBasicMaterial||nt.isMeshStandardMaterial||nt.isShaderMaterial)&&Ee.setValue(U,"isOrthographic",D.isOrthographicCamera===!0),_!==D&&(_=D,_n=!0,Vs=!0)}if(Y.isSkinnedMesh){Ee.setOptional(U,Y,"bindMatrix"),Ee.setOptional(U,Y,"bindMatrixInverse");const Je=Y.skeleton;Je&&(Je.boneTexture===null&&Je.computeBoneTexture(),Ee.setValue(U,"boneTexture",Je.boneTexture,xt))}Y.isBatchedMesh&&(Ee.setOptional(U,Y,"batchingTexture"),Ee.setValue(U,"batchingTexture",Y._matricesTexture,xt),Ee.setOptional(U,Y,"batchingIdTexture"),Ee.setValue(U,"batchingIdTexture",Y._indirectTexture,xt),Ee.setOptional(U,Y,"batchingColorTexture"),Y._colorsTexture!==null&&Ee.setValue(U,"batchingColorTexture",Y._colorsTexture,xt));const Cn=tt.morphAttributes;if((Cn.position!==void 0||Cn.normal!==void 0||Cn.color!==void 0)&&_t.update(Y,tt,xn),(_n||Xt.receiveShadow!==Y.receiveShadow)&&(Xt.receiveShadow=Y.receiveShadow,Ee.setValue(U,"receiveShadow",Y.receiveShadow)),nt.isMeshGouraudMaterial&&nt.envMap!==null&&(Rn.envMap.value=Ut,Rn.flipEnvMap.value=Ut.isCubeTexture&&Ut.isRenderTargetTexture===!1?-1:1),nt.isMeshStandardMaterial&&nt.envMap===null&&q.environment!==null&&(Rn.envMapIntensity.value=q.environmentIntensity),_n&&(Ee.setValue(U,"toneMappingExposure",b.toneMappingExposure),Xt.needsLights&&X0(Rn,Vs),yt&&nt.fog===!0&&gt.refreshFogUniforms(Rn,yt),gt.refreshMaterialUniforms(Rn,nt,H,X,p.state.transmissionRenderTarget[D.id]),To.upload(U,Xh(Xt),Rn,xt)),nt.isShaderMaterial&&nt.uniformsNeedUpdate===!0&&(To.upload(U,Xh(Xt),Rn,xt),nt.uniformsNeedUpdate=!1),nt.isSpriteMaterial&&Ee.setValue(U,"center",Y.center),Ee.setValue(U,"modelViewMatrix",Y.modelViewMatrix),Ee.setValue(U,"normalMatrix",Y.normalMatrix),Ee.setValue(U,"modelMatrix",Y.matrixWorld),nt.isShaderMaterial||nt.isRawShaderMaterial){const Je=nt.uniformsGroups;for(let ln=0,Jo=Je.length;ln<Jo;ln++){const er=Je[ln];Qt.update(er,xn),Qt.bind(er,xn)}}return xn}function X0(D,q){D.ambientLightColor.needsUpdate=q,D.lightProbe.needsUpdate=q,D.directionalLights.needsUpdate=q,D.directionalLightShadows.needsUpdate=q,D.pointLights.needsUpdate=q,D.pointLightShadows.needsUpdate=q,D.spotLights.needsUpdate=q,D.spotLightShadows.needsUpdate=q,D.rectAreaLights.needsUpdate=q,D.hemisphereLights.needsUpdate=q}function q0(D){return D.isMeshLambertMaterial||D.isMeshToonMaterial||D.isMeshPhongMaterial||D.isMeshStandardMaterial||D.isShadowMaterial||D.isShaderMaterial&&D.lights===!0}this.getActiveCubeFace=function(){return T},this.getActiveMipmapLevel=function(){return A},this.getRenderTarget=function(){return R},this.setRenderTargetTextures=function(D,q,tt){const nt=mt.get(D);nt.__autoAllocateDepthBuffer=D.resolveDepthBuffer===!1,nt.__autoAllocateDepthBuffer===!1&&(nt.__useRenderToTexture=!1),mt.get(D.texture).__webglTexture=q,mt.get(D.depthTexture).__webglTexture=nt.__autoAllocateDepthBuffer?void 0:tt,nt.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(D,q){const tt=mt.get(D);tt.__webglFramebuffer=q,tt.__useDefaultFramebuffer=q===void 0};const Y0=U.createFramebuffer();this.setRenderTarget=function(D,q=0,tt=0){R=D,T=q,A=tt;let nt=!0,Y=null,yt=!1,Ct=!1;if(D){const Ut=mt.get(D);if(Ut.__useDefaultFramebuffer!==void 0)st.bindFramebuffer(U.FRAMEBUFFER,null),nt=!1;else if(Ut.__webglFramebuffer===void 0)xt.setupRenderTarget(D);else if(Ut.__hasExternalTextures)xt.rebindTextures(D,mt.get(D.texture).__webglTexture,mt.get(D.depthTexture).__webglTexture);else if(D.depthBuffer){const Gt=D.depthTexture;if(Ut.__boundDepthTexture!==Gt){if(Gt!==null&&mt.has(Gt)&&(D.width!==Gt.image.width||D.height!==Gt.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");xt.setupDepthRenderbuffer(D)}}const qt=D.texture;(qt.isData3DTexture||qt.isDataArrayTexture||qt.isCompressedArrayTexture)&&(Ct=!0);const Zt=mt.get(D).__webglFramebuffer;D.isWebGLCubeRenderTarget?(Array.isArray(Zt[q])?Y=Zt[q][tt]:Y=Zt[q],yt=!0):D.samples>0&&xt.useMultisampledRTT(D)===!1?Y=mt.get(D).__webglMultisampledFramebuffer:Array.isArray(Zt)?Y=Zt[tt]:Y=Zt,S.copy(D.viewport),E.copy(D.scissor),P=D.scissorTest}else S.copy(dt).multiplyScalar(H).floor(),E.copy(vt).multiplyScalar(H).floor(),P=wt;if(tt!==0&&(Y=Y0),st.bindFramebuffer(U.FRAMEBUFFER,Y)&&nt&&st.drawBuffers(D,Y),st.viewport(S),st.scissor(E),st.setScissorTest(P),yt){const Ut=mt.get(D.texture);U.framebufferTexture2D(U.FRAMEBUFFER,U.COLOR_ATTACHMENT0,U.TEXTURE_CUBE_MAP_POSITIVE_X+q,Ut.__webglTexture,tt)}else if(Ct){const Ut=q;for(let qt=0;qt<D.textures.length;qt++){const Zt=mt.get(D.textures[qt]);U.framebufferTextureLayer(U.FRAMEBUFFER,U.COLOR_ATTACHMENT0+qt,Zt.__webglTexture,tt,Ut)}}else if(D!==null&&tt!==0){const Ut=mt.get(D.texture);U.framebufferTexture2D(U.FRAMEBUFFER,U.COLOR_ATTACHMENT0,U.TEXTURE_2D,Ut.__webglTexture,tt)}x=-1},this.readRenderTargetPixels=function(D,q,tt,nt,Y,yt,Ct,Ot=0){if(!(D&&D.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Ut=mt.get(D).__webglFramebuffer;if(D.isWebGLCubeRenderTarget&&Ct!==void 0&&(Ut=Ut[Ct]),Ut){st.bindFramebuffer(U.FRAMEBUFFER,Ut);try{const qt=D.textures[Ot],Zt=qt.format,Gt=qt.type;if(!Q.textureFormatReadable(Zt)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!Q.textureTypeReadable(Gt)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}q>=0&&q<=D.width-nt&&tt>=0&&tt<=D.height-Y&&(D.textures.length>1&&U.readBuffer(U.COLOR_ATTACHMENT0+Ot),U.readPixels(q,tt,nt,Y,Vt.convert(Zt),Vt.convert(Gt),yt))}finally{const qt=R!==null?mt.get(R).__webglFramebuffer:null;st.bindFramebuffer(U.FRAMEBUFFER,qt)}}},this.readRenderTargetPixelsAsync=async function(D,q,tt,nt,Y,yt,Ct,Ot=0){if(!(D&&D.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let Ut=mt.get(D).__webglFramebuffer;if(D.isWebGLCubeRenderTarget&&Ct!==void 0&&(Ut=Ut[Ct]),Ut)if(q>=0&&q<=D.width-nt&&tt>=0&&tt<=D.height-Y){st.bindFramebuffer(U.FRAMEBUFFER,Ut);const qt=D.textures[Ot],Zt=qt.format,Gt=qt.type;if(!Q.textureFormatReadable(Zt))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!Q.textureTypeReadable(Gt))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");const re=U.createBuffer();U.bindBuffer(U.PIXEL_PACK_BUFFER,re),U.bufferData(U.PIXEL_PACK_BUFFER,yt.byteLength,U.STREAM_READ),D.textures.length>1&&U.readBuffer(U.COLOR_ATTACHMENT0+Ot),U.readPixels(q,tt,nt,Y,Vt.convert(Zt),Vt.convert(Gt),0);const fe=R!==null?mt.get(R).__webglFramebuffer:null;st.bindFramebuffer(U.FRAMEBUFFER,fe);const Re=U.fenceSync(U.SYNC_GPU_COMMANDS_COMPLETE,0);return U.flush(),await c1(U,Re,4),U.bindBuffer(U.PIXEL_PACK_BUFFER,re),U.getBufferSubData(U.PIXEL_PACK_BUFFER,0,yt),U.deleteBuffer(re),U.deleteSync(Re),yt}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(D,q=null,tt=0){const nt=Math.pow(2,-tt),Y=Math.floor(D.image.width*nt),yt=Math.floor(D.image.height*nt),Ct=q!==null?q.x:0,Ot=q!==null?q.y:0;xt.setTexture2D(D,0),U.copyTexSubImage2D(U.TEXTURE_2D,tt,0,0,Ct,Ot,Y,yt),st.unbindTexture()};const $0=U.createFramebuffer(),j0=U.createFramebuffer();this.copyTextureToTexture=function(D,q,tt=null,nt=null,Y=0,yt=null){yt===null&&(Y!==0?(pa("WebGLRenderer: copyTextureToTexture function signature has changed to support src and dst mipmap levels."),yt=Y,Y=0):yt=0);let Ct,Ot,Ut,qt,Zt,Gt,re,fe,Re;const xe=D.isCompressedTexture?D.mipmaps[yt]:D.image;if(tt!==null)Ct=tt.max.x-tt.min.x,Ot=tt.max.y-tt.min.y,Ut=tt.isBox3?tt.max.z-tt.min.z:1,qt=tt.min.x,Zt=tt.min.y,Gt=tt.isBox3?tt.min.z:0;else{const Cn=Math.pow(2,-Y);Ct=Math.floor(xe.width*Cn),Ot=Math.floor(xe.height*Cn),D.isDataArrayTexture?Ut=xe.depth:D.isData3DTexture?Ut=Math.floor(xe.depth*Cn):Ut=1,qt=0,Zt=0,Gt=0}nt!==null?(re=nt.x,fe=nt.y,Re=nt.z):(re=0,fe=0,Re=0);const pe=Vt.convert(q.format),Xt=Vt.convert(q.type);let we;q.isData3DTexture?(xt.setTexture3D(q,0),we=U.TEXTURE_3D):q.isDataArrayTexture||q.isCompressedArrayTexture?(xt.setTexture2DArray(q,0),we=U.TEXTURE_2D_ARRAY):(xt.setTexture2D(q,0),we=U.TEXTURE_2D),U.pixelStorei(U.UNPACK_FLIP_Y_WEBGL,q.flipY),U.pixelStorei(U.UNPACK_PREMULTIPLY_ALPHA_WEBGL,q.premultiplyAlpha),U.pixelStorei(U.UNPACK_ALIGNMENT,q.unpackAlignment);const oe=U.getParameter(U.UNPACK_ROW_LENGTH),xn=U.getParameter(U.UNPACK_IMAGE_HEIGHT),Nr=U.getParameter(U.UNPACK_SKIP_PIXELS),_n=U.getParameter(U.UNPACK_SKIP_ROWS),Vs=U.getParameter(U.UNPACK_SKIP_IMAGES);U.pixelStorei(U.UNPACK_ROW_LENGTH,xe.width),U.pixelStorei(U.UNPACK_IMAGE_HEIGHT,xe.height),U.pixelStorei(U.UNPACK_SKIP_PIXELS,qt),U.pixelStorei(U.UNPACK_SKIP_ROWS,Zt),U.pixelStorei(U.UNPACK_SKIP_IMAGES,Gt);const Ee=D.isDataArrayTexture||D.isData3DTexture,Rn=q.isDataArrayTexture||q.isData3DTexture;if(D.isDepthTexture){const Cn=mt.get(D),Je=mt.get(q),ln=mt.get(Cn.__renderTarget),Jo=mt.get(Je.__renderTarget);st.bindFramebuffer(U.READ_FRAMEBUFFER,ln.__webglFramebuffer),st.bindFramebuffer(U.DRAW_FRAMEBUFFER,Jo.__webglFramebuffer);for(let er=0;er<Ut;er++)Ee&&(U.framebufferTextureLayer(U.READ_FRAMEBUFFER,U.COLOR_ATTACHMENT0,mt.get(D).__webglTexture,Y,Gt+er),U.framebufferTextureLayer(U.DRAW_FRAMEBUFFER,U.COLOR_ATTACHMENT0,mt.get(q).__webglTexture,yt,Re+er)),U.blitFramebuffer(qt,Zt,Ct,Ot,re,fe,Ct,Ot,U.DEPTH_BUFFER_BIT,U.NEAREST);st.bindFramebuffer(U.READ_FRAMEBUFFER,null),st.bindFramebuffer(U.DRAW_FRAMEBUFFER,null)}else if(Y!==0||D.isRenderTargetTexture||mt.has(D)){const Cn=mt.get(D),Je=mt.get(q);st.bindFramebuffer(U.READ_FRAMEBUFFER,$0),st.bindFramebuffer(U.DRAW_FRAMEBUFFER,j0);for(let ln=0;ln<Ut;ln++)Ee?U.framebufferTextureLayer(U.READ_FRAMEBUFFER,U.COLOR_ATTACHMENT0,Cn.__webglTexture,Y,Gt+ln):U.framebufferTexture2D(U.READ_FRAMEBUFFER,U.COLOR_ATTACHMENT0,U.TEXTURE_2D,Cn.__webglTexture,Y),Rn?U.framebufferTextureLayer(U.DRAW_FRAMEBUFFER,U.COLOR_ATTACHMENT0,Je.__webglTexture,yt,Re+ln):U.framebufferTexture2D(U.DRAW_FRAMEBUFFER,U.COLOR_ATTACHMENT0,U.TEXTURE_2D,Je.__webglTexture,yt),Y!==0?U.blitFramebuffer(qt,Zt,Ct,Ot,re,fe,Ct,Ot,U.COLOR_BUFFER_BIT,U.NEAREST):Rn?U.copyTexSubImage3D(we,yt,re,fe,Re+ln,qt,Zt,Ct,Ot):U.copyTexSubImage2D(we,yt,re,fe,qt,Zt,Ct,Ot);st.bindFramebuffer(U.READ_FRAMEBUFFER,null),st.bindFramebuffer(U.DRAW_FRAMEBUFFER,null)}else Rn?D.isDataTexture||D.isData3DTexture?U.texSubImage3D(we,yt,re,fe,Re,Ct,Ot,Ut,pe,Xt,xe.data):q.isCompressedArrayTexture?U.compressedTexSubImage3D(we,yt,re,fe,Re,Ct,Ot,Ut,pe,xe.data):U.texSubImage3D(we,yt,re,fe,Re,Ct,Ot,Ut,pe,Xt,xe):D.isDataTexture?U.texSubImage2D(U.TEXTURE_2D,yt,re,fe,Ct,Ot,pe,Xt,xe.data):D.isCompressedTexture?U.compressedTexSubImage2D(U.TEXTURE_2D,yt,re,fe,xe.width,xe.height,pe,xe.data):U.texSubImage2D(U.TEXTURE_2D,yt,re,fe,Ct,Ot,pe,Xt,xe);U.pixelStorei(U.UNPACK_ROW_LENGTH,oe),U.pixelStorei(U.UNPACK_IMAGE_HEIGHT,xn),U.pixelStorei(U.UNPACK_SKIP_PIXELS,Nr),U.pixelStorei(U.UNPACK_SKIP_ROWS,_n),U.pixelStorei(U.UNPACK_SKIP_IMAGES,Vs),yt===0&&q.generateMipmaps&&U.generateMipmap(we),st.unbindTexture()},this.initRenderTarget=function(D){mt.get(D).__webglFramebuffer===void 0&&xt.setupRenderTarget(D)},this.initTexture=function(D){D.isCubeTexture?xt.setTextureCube(D,0):D.isData3DTexture?xt.setTexture3D(D,0):D.isDataArrayTexture||D.isCompressedArrayTexture?xt.setTexture2DArray(D,0):xt.setTexture2D(D,0),st.unbindTexture()},this.resetState=function(){T=0,A=0,R=null,st.reset(),Rt.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return hi}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(t){this._outputColorSpace=t;const e=this.getContext();e.drawingBufferColorSpace=ce._getDrawingBufferColorSpace(t),e.unpackColorSpace=ce._getUnpackColorSpace()}}const p2={armL:[.2,-1,0],forearmL:[.15,-1,.1],armR:[-.2,-1,0],forearmR:[-.15,-1,.1],thighL:[.05,-1,0],shinL:[0,-1,0],footL:[0,-.15,1],thighR:[-.05,-1,0],shinR:[0,-1,0],footR:[0,-.15,1]};function m2(i,t){const e=i.scale??1,n=g=>new N(...i.dir?.[g]??p2[g]).normalize(),r=Array.from({length:jc},()=>new N),s=(g,v)=>r[g].copy(v),a=(g,v,m)=>new N(g,v,m).multiplyScalar(e);s(O.hipL,a(.1,0,0)),s(O.hipR,a(-.1,0,0)),s(O.shL,a(.19,.52,-.02)),s(O.shR,a(-.19,.52,-.02));const o=new We().setFromEuler(new Bn(i.head?.[1]??0,i.head?.[0]??0,0,"YXZ")),c=a(0,.6,-.02),l=(g,v,m)=>a(g,v,m).applyQuaternion(o).add(c);s(O.nose,l(0,.1,.11)),s(O.eyeL,l(.032,.135,.09)),s(O.eyeR,l(-.032,.135,.09)),s(O.eyeInL,l(.018,.135,.095)),s(O.eyeInR,l(-.018,.135,.095)),s(O.eyeOutL,l(.05,.135,.08)),s(O.eyeOutR,l(-.05,.135,.08)),s(O.earL,l(.075,.12,0)),s(O.earR,l(-.075,.12,0)),s(O.mouthL,l(.024,.06,.095)),s(O.mouthR,l(-.024,.06,.095));for(const g of["L","R"]){const v=r[g==="L"?O.shL:O.shR],m=r[g==="L"?O.hipL:O.hipR],p=v.clone().addScaledVector(n(`arm${g}`),.29*e),y=p.clone().addScaledVector(n(`forearm${g}`),.26*e);s(g==="L"?O.elL:O.elR,p),s(g==="L"?O.wrL:O.wrR,y);const M=y.clone().addScaledVector(n(`forearm${g}`),.08*e);s(g==="L"?O.indexL:O.indexR,M.clone().add(a(0,0,.02))),s(g==="L"?O.pinkyL:O.pinkyR,M.clone().add(a(0,0,-.02))),s(g==="L"?O.thumbL:O.thumbR,y.clone().addScaledVector(n(`forearm${g}`),.04*e).add(a(0,0,.04)));const b=m.clone().addScaledVector(n(`thigh${g}`),.43*e),w=b.clone().addScaledVector(n(`shin${g}`),.42*e);s(g==="L"?O.knL:O.knR,b),s(g==="L"?O.anL:O.anR,w);const T=w.clone().add(a(0,-.04,-.05));s(g==="L"?O.heelL:O.heelR,T),s(g==="L"?O.toeL:O.toeR,T.clone().addScaledVector(n(`foot${g}`),.24*e))}const h=new We().setFromAxisAngle(new N(0,1,0),i.yaw??0),u=new Set([O.knL,O.knR,O.anL,O.anR,O.heelL,O.heelR,O.toeL,O.toeR]),d=[],f=[];for(let g=0;g<jc;g++){const v=r[g].clone().applyQuaternion(h),m=u.has(g)?i.legsVis??.98:.98;d.push({x:v.x,y:v.y,z:v.z,v:m});const p=Es({x:v.x+i.T.x,y:v.y+i.T.y,z:v.z+i.T.z},t);f.push({x:p.x,y:p.y,z:0,v:m})}return{world:d,image:f}}function g2(i,t,e){const n=[];for(let r=0;r<i;r++){const s=t*1.3+r*2.1,a=(r-(i-1)/2)*.9+Math.sin(t*.4+r)*.15,o=Math.sin(s);n.push(m2({T:{x:a,y:-.1+.03*Math.sin(s*2),z:-3-r*.6},yaw:Math.sin(t*.5+r)*.5,head:[Math.sin(t*.7+r)*.4,Math.sin(t*.9)*.15],dir:{armR:[-1,.3+.5*o,.1],forearmR:[-.3,1,.1+.3*o],armL:[.5+.4*Math.cos(s),-.8+.6*Math.cos(s*.5),.3],forearmL:[.2,-.3,1],thighL:[.12,-1,.25*Math.max(0,o)],shinL:[.05,-1,-.2*Math.max(0,o)]},scale:1-r*.08},e))}return n}function v2(i,t,e,n){const r=i.image,s=new Float32Array(t*e),a=f=>[r[f].x*n,r[f].y],o=Math.hypot(a(O.shL)[0]-a(O.hipL)[0],a(O.shL)[1]-a(O.hipL)[1]),c=[[O.shL,O.elL,.11],[O.elL,O.wrL,.09],[O.shR,O.elR,.11],[O.elR,O.wrR,.09],[O.hipL,O.knL,.15],[O.knL,O.anL,.11],[O.hipR,O.knR,.15],[O.knR,O.anR,.11],[O.anL,O.toeL,.07],[O.anR,O.toeR,.07],[O.shL,O.hipR,.2],[O.shR,O.hipL,.2],[O.shL,O.shR,.14],[O.hipL,O.hipR,.16]],l=a(O.nose),h=a(O.earL),u=a(O.earR),d=Math.max(Math.hypot(h[0]-u[0],h[1]-u[1])*.9,o*.22);for(let f=0;f<e;f++)for(let g=0;g<t;g++){const v=(g+.5)/t*n,m=(f+.5)/e;let p=Math.hypot(v-l[0],m-(l[1]-d*.2))-d;for(const[y,M,b]of c){const w=a(y),T=a(M),A=T[0]-w[0],R=T[1]-w[1],x=A*A+R*R||1,_=Math.max(0,Math.min(1,((v-w[0])*A+(m-w[1])*R)/x));p=Math.min(p,Math.hypot(v-w[0]-A*_,m-w[1]-R*_)-b*o)}s[f*t+g]=Math.max(0,Math.min(1,.5-p/(o*.04)))}return{data:s,w:t,h:e}}function x2(i){const t=new Map,e=new Map,n=i.clone();return Jd(i,n,function(r,s){t.set(s,r),e.set(r,s)}),n.traverse(function(r){if(!r.isSkinnedMesh)return;const s=r,a=t.get(r),o=a.skeleton.bones;s.skeleton=a.skeleton.clone(),s.bindMatrix.copy(a.bindMatrix),s.skeleton.bones=o.map(function(c){return e.get(c)}),s.bind(s.skeleton,s.bindMatrix)}),n}function Jd(i,t,e){e(i,t);for(let n=0;n<i.children.length;n++)Jd(i.children[n],t.children[n],e)}class Kd extends It{constructor(t,e,n=!1,r=!1,s=1e4){const a=new Se;super(a,e),this.isMarchingCubes=!0;const o=this,c=new Float32Array(36),l=new Float32Array(36),h=new Float32Array(36);this.enableUvs=n,this.enableColors=r,this.init=function(y){this.resolution=y,this.isolation=80,this.size=y,this.size2=this.size*this.size,this.size3=this.size2*this.size,this.halfsize=this.size/2,this.delta=2/this.size,this.yd=this.size,this.zd=this.size2,this.field=new Float32Array(this.size3),this.normal_cache=new Float32Array(this.size3*3),this.palette=new Float32Array(this.size3*3),this.count=0;const M=s*3;this.positionArray=new Float32Array(M*3);const b=new ae(this.positionArray,3);b.setUsage(Oa),a.setAttribute("position",b),this.normalArray=new Float32Array(M*3);const w=new ae(this.normalArray,3);if(w.setUsage(Oa),a.setAttribute("normal",w),this.enableUvs){this.uvArray=new Float32Array(M*2);const T=new ae(this.uvArray,2);T.setUsage(Oa),a.setAttribute("uv",T)}if(this.enableColors){this.colorArray=new Float32Array(M*3);const T=new ae(this.colorArray,3);T.setUsage(Oa),a.setAttribute("color",T)}a.boundingSphere=new Ar(new N,1)};function u(y,M,b){return y+(M-y)*b}function d(y,M,b,w,T,A,R,x,_,S){const E=(b-R)/(x-R),P=o.normal_cache;c[M+0]=w+E*o.delta,c[M+1]=T,c[M+2]=A,l[M+0]=u(P[y+0],P[y+3],E),l[M+1]=u(P[y+1],P[y+4],E),l[M+2]=u(P[y+2],P[y+5],E),h[M+0]=u(o.palette[_*3+0],o.palette[S*3+0],E),h[M+1]=u(o.palette[_*3+1],o.palette[S*3+1],E),h[M+2]=u(o.palette[_*3+2],o.palette[S*3+2],E)}function f(y,M,b,w,T,A,R,x,_,S){const E=(b-R)/(x-R),P=o.normal_cache;c[M+0]=w,c[M+1]=T+E*o.delta,c[M+2]=A;const L=y+o.yd*3;l[M+0]=u(P[y+0],P[L+0],E),l[M+1]=u(P[y+1],P[L+1],E),l[M+2]=u(P[y+2],P[L+2],E),h[M+0]=u(o.palette[_*3+0],o.palette[S*3+0],E),h[M+1]=u(o.palette[_*3+1],o.palette[S*3+1],E),h[M+2]=u(o.palette[_*3+2],o.palette[S*3+2],E)}function g(y,M,b,w,T,A,R,x,_,S){const E=(b-R)/(x-R),P=o.normal_cache;c[M+0]=w,c[M+1]=T,c[M+2]=A+E*o.delta;const L=y+o.zd*3;l[M+0]=u(P[y+0],P[L+0],E),l[M+1]=u(P[y+1],P[L+1],E),l[M+2]=u(P[y+2],P[L+2],E),h[M+0]=u(o.palette[_*3+0],o.palette[S*3+0],E),h[M+1]=u(o.palette[_*3+1],o.palette[S*3+1],E),h[M+2]=u(o.palette[_*3+2],o.palette[S*3+2],E)}function v(y){const M=y*3;o.normal_cache[M]===0&&(o.normal_cache[M+0]=o.field[y-1]-o.field[y+1],o.normal_cache[M+1]=o.field[y-o.yd]-o.field[y+o.yd],o.normal_cache[M+2]=o.field[y-o.zd]-o.field[y+o.zd])}function m(y,M,b,w,T){const A=w+1,R=w+o.yd,x=w+o.zd,_=A+o.yd,S=A+o.zd,E=w+o.yd+o.zd,P=A+o.yd+o.zd;let L=0;const I=o.field[w],B=o.field[A],X=o.field[R],H=o.field[_],it=o.field[x],lt=o.field[S],dt=o.field[E],vt=o.field[P];I<T&&(L|=1),B<T&&(L|=2),X<T&&(L|=8),H<T&&(L|=4),it<T&&(L|=16),lt<T&&(L|=32),dt<T&&(L|=128),vt<T&&(L|=64);const wt=_2[L];if(wt===0)return 0;const Ft=o.delta,ot=y+Ft,V=M+Ft,Z=b+Ft;wt&1&&(v(w),v(A),d(w*3,0,T,y,M,b,I,B,w,A)),wt&2&&(v(A),v(_),f(A*3,3,T,ot,M,b,B,H,A,_)),wt&4&&(v(R),v(_),d(R*3,6,T,y,V,b,X,H,R,_)),wt&8&&(v(w),v(R),f(w*3,9,T,y,M,b,I,X,w,R)),wt&16&&(v(x),v(S),d(x*3,12,T,y,M,Z,it,lt,x,S)),wt&32&&(v(S),v(P),f(S*3,15,T,ot,M,Z,lt,vt,S,P)),wt&64&&(v(E),v(P),d(E*3,18,T,y,V,Z,dt,vt,E,P)),wt&128&&(v(x),v(E),f(x*3,21,T,y,M,Z,it,dt,x,E)),wt&256&&(v(w),v(x),g(w*3,24,T,y,M,b,I,it,w,x)),wt&512&&(v(A),v(S),g(A*3,27,T,ot,M,b,B,lt,A,S)),wt&1024&&(v(_),v(P),g(_*3,30,T,ot,V,b,H,vt,_,P)),wt&2048&&(v(R),v(E),g(R*3,33,T,y,V,b,X,dt,R,E)),L<<=4;let k,G,z,K=0,et=0;for(;mo[L+et]!=-1;)k=L+et,G=k+1,z=k+2,p(c,l,h,3*mo[k],3*mo[G],3*mo[z]),et+=3,K++;return K}function p(y,M,b,w,T,A){const R=o.count*3;if(o.positionArray[R+0]=y[w],o.positionArray[R+1]=y[w+1],o.positionArray[R+2]=y[w+2],o.positionArray[R+3]=y[T],o.positionArray[R+4]=y[T+1],o.positionArray[R+5]=y[T+2],o.positionArray[R+6]=y[A],o.positionArray[R+7]=y[A+1],o.positionArray[R+8]=y[A+2],o.material.flatShading===!0){const x=(M[w+0]+M[T+0]+M[A+0])/3,_=(M[w+1]+M[T+1]+M[A+1])/3,S=(M[w+2]+M[T+2]+M[A+2])/3;o.normalArray[R+0]=x,o.normalArray[R+1]=_,o.normalArray[R+2]=S,o.normalArray[R+3]=x,o.normalArray[R+4]=_,o.normalArray[R+5]=S,o.normalArray[R+6]=x,o.normalArray[R+7]=_,o.normalArray[R+8]=S}else o.normalArray[R+0]=M[w+0],o.normalArray[R+1]=M[w+1],o.normalArray[R+2]=M[w+2],o.normalArray[R+3]=M[T+0],o.normalArray[R+4]=M[T+1],o.normalArray[R+5]=M[T+2],o.normalArray[R+6]=M[A+0],o.normalArray[R+7]=M[A+1],o.normalArray[R+8]=M[A+2];if(o.enableUvs){const x=o.count*2;o.uvArray[x+0]=y[w+0],o.uvArray[x+1]=y[w+2],o.uvArray[x+2]=y[T+0],o.uvArray[x+3]=y[T+2],o.uvArray[x+4]=y[A+0],o.uvArray[x+5]=y[A+2]}o.enableColors&&(o.colorArray[R+0]=b[w+0],o.colorArray[R+1]=b[w+1],o.colorArray[R+2]=b[w+2],o.colorArray[R+3]=b[T+0],o.colorArray[R+4]=b[T+1],o.colorArray[R+5]=b[T+2],o.colorArray[R+6]=b[A+0],o.colorArray[R+7]=b[A+1],o.colorArray[R+8]=b[A+2]),o.count+=3}this.addBall=function(y,M,b,w,T,A){const R=Math.sign(w);w=Math.abs(w);const x=A!=null;let _=new Pt(y,M,b);if(x)try{_=A instanceof Pt?A:Array.isArray(A)?new Pt(Math.min(Math.abs(A[0]),1),Math.min(Math.abs(A[1]),1),Math.min(Math.abs(A[2]),1)):new Pt(A)}catch{_=new Pt(y,M,b)}const S=this.size*Math.sqrt(w/T),E=b*this.size,P=M*this.size,L=y*this.size;let I=Math.floor(E-S);I<1&&(I=1);let B=Math.floor(E+S);B>this.size-1&&(B=this.size-1);let X=Math.floor(P-S);X<1&&(X=1);let H=Math.floor(P+S);H>this.size-1&&(H=this.size-1);let it=Math.floor(L-S);it<1&&(it=1);let lt=Math.floor(L+S);lt>this.size-1&&(lt=this.size-1);let dt,vt,wt,Ft,ot,V,Z,k,G,z,K;for(wt=I;wt<B;wt++)for(ot=this.size2*wt,k=wt/this.size-b,G=k*k,vt=X;vt<H;vt++)for(Ft=ot+this.size*vt,Z=vt/this.size-M,z=Z*Z,dt=it;dt<lt;dt++)if(V=dt/this.size-y,K=w/(1e-6+V*V+z+G)-T,K>0){this.field[Ft+dt]+=K*R;const et=Math.sqrt((dt-L)*(dt-L)+(vt-P)*(vt-P)+(wt-E)*(wt-E))/S,U=1-et*et*et*(et*(et*6-15)+10);this.palette[(Ft+dt)*3+0]+=_.r*U,this.palette[(Ft+dt)*3+1]+=_.g*U,this.palette[(Ft+dt)*3+2]+=_.b*U}},this.addPlaneX=function(y,M){const b=this.size,w=this.yd,T=this.zd,A=this.field;let R,x,_,S,E,P,L,I=b*Math.sqrt(y/M);for(I>b&&(I=b),R=0;R<I;R++)if(P=R/b,S=P*P,E=y/(1e-4+S)-M,E>0)for(x=0;x<b;x++)for(L=R+x*w,_=0;_<b;_++)A[T*_+L]+=E},this.addPlaneY=function(y,M){const b=this.size,w=this.yd,T=this.zd,A=this.field;let R,x,_,S,E,P,L,I,B=b*Math.sqrt(y/M);for(B>b&&(B=b),x=0;x<B;x++)if(P=x/b,S=P*P,E=y/(1e-4+S)-M,E>0)for(L=x*w,R=0;R<b;R++)for(I=L+R,_=0;_<b;_++)A[T*_+I]+=E},this.addPlaneZ=function(y,M){const b=this.size,w=this.yd,T=this.zd,A=this.field;let R,x,_,S,E,P,L,I,B=b*Math.sqrt(y/M);for(B>b&&(B=b),_=0;_<B;_++)if(P=_/b,S=P*P,E=y/(1e-4+S)-M,E>0)for(L=T*_,x=0;x<b;x++)for(I=L+x*w,R=0;R<b;R++)A[I+R]+=E},this.setCell=function(y,M,b,w){const T=this.size2*b+this.size*M+y;this.field[T]=w},this.getCell=function(y,M,b){const w=this.size2*b+this.size*M+y;return this.field[w]},this.blur=function(y=1){const M=this.field,b=M.slice(),w=this.size,T=this.size2;for(let A=0;A<w;A++)for(let R=0;R<w;R++)for(let x=0;x<w;x++){const _=T*x+w*R+A;let S=b[_],E=1;for(let P=-1;P<=1;P+=2){const L=P+A;if(!(L<0||L>=w))for(let I=-1;I<=1;I+=2){const B=I+R;if(!(B<0||B>=w))for(let X=-1;X<=1;X+=2){const H=X+x;if(H<0||H>=w)continue;const it=T*H+w*B+L,lt=b[it];E++,S+=y*(lt-S)/E}}}M[_]=S}},this.reset=function(){for(let y=0;y<this.size3;y++)this.normal_cache[y*3]=0,this.field[y]=0,this.palette[y*3]=this.palette[y*3+1]=this.palette[y*3+2]=0},this.update=function(){this.count=0;const y=this.size-2;for(let M=1;M<y;M++){const b=this.size2*M,w=(M-this.halfsize)/this.halfsize;for(let T=1;T<y;T++){const A=b+this.size*T,R=(T-this.halfsize)/this.halfsize;for(let x=1;x<y;x++){const _=(x-this.halfsize)/this.halfsize,S=A+x;m(_,R,w,S,this.isolation)}}}this.geometry.setDrawRange(0,this.count),a.getAttribute("position").needsUpdate=!0,a.getAttribute("normal").needsUpdate=!0,this.enableUvs&&(a.getAttribute("uv").needsUpdate=!0),this.enableColors&&(a.getAttribute("color").needsUpdate=!0),this.count/3>s&&console.warn("THREE.MarchingCubes: Geometry buffers too small for rendering. Please create an instance with a higher poly count.")},this.init(t)}}const _2=new Int32Array([0,265,515,778,1030,1295,1541,1804,2060,2309,2575,2822,3082,3331,3593,3840,400,153,915,666,1430,1183,1941,1692,2460,2197,2975,2710,3482,3219,3993,3728,560,825,51,314,1590,1855,1077,1340,2620,2869,2111,2358,3642,3891,3129,3376,928,681,419,170,1958,1711,1445,1196,2988,2725,2479,2214,4010,3747,3497,3232,1120,1385,1635,1898,102,367,613,876,3180,3429,3695,3942,2154,2403,2665,2912,1520,1273,2035,1786,502,255,1013,764,3580,3317,4095,3830,2554,2291,3065,2800,1616,1881,1107,1370,598,863,85,348,3676,3925,3167,3414,2650,2899,2137,2384,1984,1737,1475,1226,966,719,453,204,4044,3781,3535,3270,3018,2755,2505,2240,2240,2505,2755,3018,3270,3535,3781,4044,204,453,719,966,1226,1475,1737,1984,2384,2137,2899,2650,3414,3167,3925,3676,348,85,863,598,1370,1107,1881,1616,2800,3065,2291,2554,3830,4095,3317,3580,764,1013,255,502,1786,2035,1273,1520,2912,2665,2403,2154,3942,3695,3429,3180,876,613,367,102,1898,1635,1385,1120,3232,3497,3747,4010,2214,2479,2725,2988,1196,1445,1711,1958,170,419,681,928,3376,3129,3891,3642,2358,2111,2869,2620,1340,1077,1855,1590,314,51,825,560,3728,3993,3219,3482,2710,2975,2197,2460,1692,1941,1183,1430,666,915,153,400,3840,3593,3331,3082,2822,2575,2309,2060,1804,1541,1295,1030,778,515,265,0]),mo=new Int32Array([-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,8,3,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,1,9,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,1,8,3,9,8,1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,1,2,10,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,8,3,1,2,10,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,9,2,10,0,2,9,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,2,8,3,2,10,8,10,9,8,-1,-1,-1,-1,-1,-1,-1,3,11,2,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,11,2,8,11,0,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,1,9,0,2,3,11,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,1,11,2,1,9,11,9,8,11,-1,-1,-1,-1,-1,-1,-1,3,10,1,11,10,3,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,10,1,0,8,10,8,11,10,-1,-1,-1,-1,-1,-1,-1,3,9,0,3,11,9,11,10,9,-1,-1,-1,-1,-1,-1,-1,9,8,10,10,8,11,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,4,7,8,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,4,3,0,7,3,4,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,1,9,8,4,7,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,4,1,9,4,7,1,7,3,1,-1,-1,-1,-1,-1,-1,-1,1,2,10,8,4,7,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,3,4,7,3,0,4,1,2,10,-1,-1,-1,-1,-1,-1,-1,9,2,10,9,0,2,8,4,7,-1,-1,-1,-1,-1,-1,-1,2,10,9,2,9,7,2,7,3,7,9,4,-1,-1,-1,-1,8,4,7,3,11,2,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,11,4,7,11,2,4,2,0,4,-1,-1,-1,-1,-1,-1,-1,9,0,1,8,4,7,2,3,11,-1,-1,-1,-1,-1,-1,-1,4,7,11,9,4,11,9,11,2,9,2,1,-1,-1,-1,-1,3,10,1,3,11,10,7,8,4,-1,-1,-1,-1,-1,-1,-1,1,11,10,1,4,11,1,0,4,7,11,4,-1,-1,-1,-1,4,7,8,9,0,11,9,11,10,11,0,3,-1,-1,-1,-1,4,7,11,4,11,9,9,11,10,-1,-1,-1,-1,-1,-1,-1,9,5,4,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,9,5,4,0,8,3,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,5,4,1,5,0,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,8,5,4,8,3,5,3,1,5,-1,-1,-1,-1,-1,-1,-1,1,2,10,9,5,4,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,3,0,8,1,2,10,4,9,5,-1,-1,-1,-1,-1,-1,-1,5,2,10,5,4,2,4,0,2,-1,-1,-1,-1,-1,-1,-1,2,10,5,3,2,5,3,5,4,3,4,8,-1,-1,-1,-1,9,5,4,2,3,11,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,11,2,0,8,11,4,9,5,-1,-1,-1,-1,-1,-1,-1,0,5,4,0,1,5,2,3,11,-1,-1,-1,-1,-1,-1,-1,2,1,5,2,5,8,2,8,11,4,8,5,-1,-1,-1,-1,10,3,11,10,1,3,9,5,4,-1,-1,-1,-1,-1,-1,-1,4,9,5,0,8,1,8,10,1,8,11,10,-1,-1,-1,-1,5,4,0,5,0,11,5,11,10,11,0,3,-1,-1,-1,-1,5,4,8,5,8,10,10,8,11,-1,-1,-1,-1,-1,-1,-1,9,7,8,5,7,9,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,9,3,0,9,5,3,5,7,3,-1,-1,-1,-1,-1,-1,-1,0,7,8,0,1,7,1,5,7,-1,-1,-1,-1,-1,-1,-1,1,5,3,3,5,7,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,9,7,8,9,5,7,10,1,2,-1,-1,-1,-1,-1,-1,-1,10,1,2,9,5,0,5,3,0,5,7,3,-1,-1,-1,-1,8,0,2,8,2,5,8,5,7,10,5,2,-1,-1,-1,-1,2,10,5,2,5,3,3,5,7,-1,-1,-1,-1,-1,-1,-1,7,9,5,7,8,9,3,11,2,-1,-1,-1,-1,-1,-1,-1,9,5,7,9,7,2,9,2,0,2,7,11,-1,-1,-1,-1,2,3,11,0,1,8,1,7,8,1,5,7,-1,-1,-1,-1,11,2,1,11,1,7,7,1,5,-1,-1,-1,-1,-1,-1,-1,9,5,8,8,5,7,10,1,3,10,3,11,-1,-1,-1,-1,5,7,0,5,0,9,7,11,0,1,0,10,11,10,0,-1,11,10,0,11,0,3,10,5,0,8,0,7,5,7,0,-1,11,10,5,7,11,5,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,10,6,5,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,8,3,5,10,6,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,9,0,1,5,10,6,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,1,8,3,1,9,8,5,10,6,-1,-1,-1,-1,-1,-1,-1,1,6,5,2,6,1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,1,6,5,1,2,6,3,0,8,-1,-1,-1,-1,-1,-1,-1,9,6,5,9,0,6,0,2,6,-1,-1,-1,-1,-1,-1,-1,5,9,8,5,8,2,5,2,6,3,2,8,-1,-1,-1,-1,2,3,11,10,6,5,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,11,0,8,11,2,0,10,6,5,-1,-1,-1,-1,-1,-1,-1,0,1,9,2,3,11,5,10,6,-1,-1,-1,-1,-1,-1,-1,5,10,6,1,9,2,9,11,2,9,8,11,-1,-1,-1,-1,6,3,11,6,5,3,5,1,3,-1,-1,-1,-1,-1,-1,-1,0,8,11,0,11,5,0,5,1,5,11,6,-1,-1,-1,-1,3,11,6,0,3,6,0,6,5,0,5,9,-1,-1,-1,-1,6,5,9,6,9,11,11,9,8,-1,-1,-1,-1,-1,-1,-1,5,10,6,4,7,8,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,4,3,0,4,7,3,6,5,10,-1,-1,-1,-1,-1,-1,-1,1,9,0,5,10,6,8,4,7,-1,-1,-1,-1,-1,-1,-1,10,6,5,1,9,7,1,7,3,7,9,4,-1,-1,-1,-1,6,1,2,6,5,1,4,7,8,-1,-1,-1,-1,-1,-1,-1,1,2,5,5,2,6,3,0,4,3,4,7,-1,-1,-1,-1,8,4,7,9,0,5,0,6,5,0,2,6,-1,-1,-1,-1,7,3,9,7,9,4,3,2,9,5,9,6,2,6,9,-1,3,11,2,7,8,4,10,6,5,-1,-1,-1,-1,-1,-1,-1,5,10,6,4,7,2,4,2,0,2,7,11,-1,-1,-1,-1,0,1,9,4,7,8,2,3,11,5,10,6,-1,-1,-1,-1,9,2,1,9,11,2,9,4,11,7,11,4,5,10,6,-1,8,4,7,3,11,5,3,5,1,5,11,6,-1,-1,-1,-1,5,1,11,5,11,6,1,0,11,7,11,4,0,4,11,-1,0,5,9,0,6,5,0,3,6,11,6,3,8,4,7,-1,6,5,9,6,9,11,4,7,9,7,11,9,-1,-1,-1,-1,10,4,9,6,4,10,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,4,10,6,4,9,10,0,8,3,-1,-1,-1,-1,-1,-1,-1,10,0,1,10,6,0,6,4,0,-1,-1,-1,-1,-1,-1,-1,8,3,1,8,1,6,8,6,4,6,1,10,-1,-1,-1,-1,1,4,9,1,2,4,2,6,4,-1,-1,-1,-1,-1,-1,-1,3,0,8,1,2,9,2,4,9,2,6,4,-1,-1,-1,-1,0,2,4,4,2,6,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,8,3,2,8,2,4,4,2,6,-1,-1,-1,-1,-1,-1,-1,10,4,9,10,6,4,11,2,3,-1,-1,-1,-1,-1,-1,-1,0,8,2,2,8,11,4,9,10,4,10,6,-1,-1,-1,-1,3,11,2,0,1,6,0,6,4,6,1,10,-1,-1,-1,-1,6,4,1,6,1,10,4,8,1,2,1,11,8,11,1,-1,9,6,4,9,3,6,9,1,3,11,6,3,-1,-1,-1,-1,8,11,1,8,1,0,11,6,1,9,1,4,6,4,1,-1,3,11,6,3,6,0,0,6,4,-1,-1,-1,-1,-1,-1,-1,6,4,8,11,6,8,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,7,10,6,7,8,10,8,9,10,-1,-1,-1,-1,-1,-1,-1,0,7,3,0,10,7,0,9,10,6,7,10,-1,-1,-1,-1,10,6,7,1,10,7,1,7,8,1,8,0,-1,-1,-1,-1,10,6,7,10,7,1,1,7,3,-1,-1,-1,-1,-1,-1,-1,1,2,6,1,6,8,1,8,9,8,6,7,-1,-1,-1,-1,2,6,9,2,9,1,6,7,9,0,9,3,7,3,9,-1,7,8,0,7,0,6,6,0,2,-1,-1,-1,-1,-1,-1,-1,7,3,2,6,7,2,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,2,3,11,10,6,8,10,8,9,8,6,7,-1,-1,-1,-1,2,0,7,2,7,11,0,9,7,6,7,10,9,10,7,-1,1,8,0,1,7,8,1,10,7,6,7,10,2,3,11,-1,11,2,1,11,1,7,10,6,1,6,7,1,-1,-1,-1,-1,8,9,6,8,6,7,9,1,6,11,6,3,1,3,6,-1,0,9,1,11,6,7,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,7,8,0,7,0,6,3,11,0,11,6,0,-1,-1,-1,-1,7,11,6,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,7,6,11,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,3,0,8,11,7,6,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,1,9,11,7,6,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,8,1,9,8,3,1,11,7,6,-1,-1,-1,-1,-1,-1,-1,10,1,2,6,11,7,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,1,2,10,3,0,8,6,11,7,-1,-1,-1,-1,-1,-1,-1,2,9,0,2,10,9,6,11,7,-1,-1,-1,-1,-1,-1,-1,6,11,7,2,10,3,10,8,3,10,9,8,-1,-1,-1,-1,7,2,3,6,2,7,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,7,0,8,7,6,0,6,2,0,-1,-1,-1,-1,-1,-1,-1,2,7,6,2,3,7,0,1,9,-1,-1,-1,-1,-1,-1,-1,1,6,2,1,8,6,1,9,8,8,7,6,-1,-1,-1,-1,10,7,6,10,1,7,1,3,7,-1,-1,-1,-1,-1,-1,-1,10,7,6,1,7,10,1,8,7,1,0,8,-1,-1,-1,-1,0,3,7,0,7,10,0,10,9,6,10,7,-1,-1,-1,-1,7,6,10,7,10,8,8,10,9,-1,-1,-1,-1,-1,-1,-1,6,8,4,11,8,6,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,3,6,11,3,0,6,0,4,6,-1,-1,-1,-1,-1,-1,-1,8,6,11,8,4,6,9,0,1,-1,-1,-1,-1,-1,-1,-1,9,4,6,9,6,3,9,3,1,11,3,6,-1,-1,-1,-1,6,8,4,6,11,8,2,10,1,-1,-1,-1,-1,-1,-1,-1,1,2,10,3,0,11,0,6,11,0,4,6,-1,-1,-1,-1,4,11,8,4,6,11,0,2,9,2,10,9,-1,-1,-1,-1,10,9,3,10,3,2,9,4,3,11,3,6,4,6,3,-1,8,2,3,8,4,2,4,6,2,-1,-1,-1,-1,-1,-1,-1,0,4,2,4,6,2,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,1,9,0,2,3,4,2,4,6,4,3,8,-1,-1,-1,-1,1,9,4,1,4,2,2,4,6,-1,-1,-1,-1,-1,-1,-1,8,1,3,8,6,1,8,4,6,6,10,1,-1,-1,-1,-1,10,1,0,10,0,6,6,0,4,-1,-1,-1,-1,-1,-1,-1,4,6,3,4,3,8,6,10,3,0,3,9,10,9,3,-1,10,9,4,6,10,4,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,4,9,5,7,6,11,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,8,3,4,9,5,11,7,6,-1,-1,-1,-1,-1,-1,-1,5,0,1,5,4,0,7,6,11,-1,-1,-1,-1,-1,-1,-1,11,7,6,8,3,4,3,5,4,3,1,5,-1,-1,-1,-1,9,5,4,10,1,2,7,6,11,-1,-1,-1,-1,-1,-1,-1,6,11,7,1,2,10,0,8,3,4,9,5,-1,-1,-1,-1,7,6,11,5,4,10,4,2,10,4,0,2,-1,-1,-1,-1,3,4,8,3,5,4,3,2,5,10,5,2,11,7,6,-1,7,2,3,7,6,2,5,4,9,-1,-1,-1,-1,-1,-1,-1,9,5,4,0,8,6,0,6,2,6,8,7,-1,-1,-1,-1,3,6,2,3,7,6,1,5,0,5,4,0,-1,-1,-1,-1,6,2,8,6,8,7,2,1,8,4,8,5,1,5,8,-1,9,5,4,10,1,6,1,7,6,1,3,7,-1,-1,-1,-1,1,6,10,1,7,6,1,0,7,8,7,0,9,5,4,-1,4,0,10,4,10,5,0,3,10,6,10,7,3,7,10,-1,7,6,10,7,10,8,5,4,10,4,8,10,-1,-1,-1,-1,6,9,5,6,11,9,11,8,9,-1,-1,-1,-1,-1,-1,-1,3,6,11,0,6,3,0,5,6,0,9,5,-1,-1,-1,-1,0,11,8,0,5,11,0,1,5,5,6,11,-1,-1,-1,-1,6,11,3,6,3,5,5,3,1,-1,-1,-1,-1,-1,-1,-1,1,2,10,9,5,11,9,11,8,11,5,6,-1,-1,-1,-1,0,11,3,0,6,11,0,9,6,5,6,9,1,2,10,-1,11,8,5,11,5,6,8,0,5,10,5,2,0,2,5,-1,6,11,3,6,3,5,2,10,3,10,5,3,-1,-1,-1,-1,5,8,9,5,2,8,5,6,2,3,8,2,-1,-1,-1,-1,9,5,6,9,6,0,0,6,2,-1,-1,-1,-1,-1,-1,-1,1,5,8,1,8,0,5,6,8,3,8,2,6,2,8,-1,1,5,6,2,1,6,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,1,3,6,1,6,10,3,8,6,5,6,9,8,9,6,-1,10,1,0,10,0,6,9,5,0,5,6,0,-1,-1,-1,-1,0,3,8,5,6,10,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,10,5,6,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,11,5,10,7,5,11,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,11,5,10,11,7,5,8,3,0,-1,-1,-1,-1,-1,-1,-1,5,11,7,5,10,11,1,9,0,-1,-1,-1,-1,-1,-1,-1,10,7,5,10,11,7,9,8,1,8,3,1,-1,-1,-1,-1,11,1,2,11,7,1,7,5,1,-1,-1,-1,-1,-1,-1,-1,0,8,3,1,2,7,1,7,5,7,2,11,-1,-1,-1,-1,9,7,5,9,2,7,9,0,2,2,11,7,-1,-1,-1,-1,7,5,2,7,2,11,5,9,2,3,2,8,9,8,2,-1,2,5,10,2,3,5,3,7,5,-1,-1,-1,-1,-1,-1,-1,8,2,0,8,5,2,8,7,5,10,2,5,-1,-1,-1,-1,9,0,1,5,10,3,5,3,7,3,10,2,-1,-1,-1,-1,9,8,2,9,2,1,8,7,2,10,2,5,7,5,2,-1,1,3,5,3,7,5,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,8,7,0,7,1,1,7,5,-1,-1,-1,-1,-1,-1,-1,9,0,3,9,3,5,5,3,7,-1,-1,-1,-1,-1,-1,-1,9,8,7,5,9,7,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,5,8,4,5,10,8,10,11,8,-1,-1,-1,-1,-1,-1,-1,5,0,4,5,11,0,5,10,11,11,3,0,-1,-1,-1,-1,0,1,9,8,4,10,8,10,11,10,4,5,-1,-1,-1,-1,10,11,4,10,4,5,11,3,4,9,4,1,3,1,4,-1,2,5,1,2,8,5,2,11,8,4,5,8,-1,-1,-1,-1,0,4,11,0,11,3,4,5,11,2,11,1,5,1,11,-1,0,2,5,0,5,9,2,11,5,4,5,8,11,8,5,-1,9,4,5,2,11,3,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,2,5,10,3,5,2,3,4,5,3,8,4,-1,-1,-1,-1,5,10,2,5,2,4,4,2,0,-1,-1,-1,-1,-1,-1,-1,3,10,2,3,5,10,3,8,5,4,5,8,0,1,9,-1,5,10,2,5,2,4,1,9,2,9,4,2,-1,-1,-1,-1,8,4,5,8,5,3,3,5,1,-1,-1,-1,-1,-1,-1,-1,0,4,5,1,0,5,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,8,4,5,8,5,3,9,0,5,0,3,5,-1,-1,-1,-1,9,4,5,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,4,11,7,4,9,11,9,10,11,-1,-1,-1,-1,-1,-1,-1,0,8,3,4,9,7,9,11,7,9,10,11,-1,-1,-1,-1,1,10,11,1,11,4,1,4,0,7,4,11,-1,-1,-1,-1,3,1,4,3,4,8,1,10,4,7,4,11,10,11,4,-1,4,11,7,9,11,4,9,2,11,9,1,2,-1,-1,-1,-1,9,7,4,9,11,7,9,1,11,2,11,1,0,8,3,-1,11,7,4,11,4,2,2,4,0,-1,-1,-1,-1,-1,-1,-1,11,7,4,11,4,2,8,3,4,3,2,4,-1,-1,-1,-1,2,9,10,2,7,9,2,3,7,7,4,9,-1,-1,-1,-1,9,10,7,9,7,4,10,2,7,8,7,0,2,0,7,-1,3,7,10,3,10,2,7,4,10,1,10,0,4,0,10,-1,1,10,2,8,7,4,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,4,9,1,4,1,7,7,1,3,-1,-1,-1,-1,-1,-1,-1,4,9,1,4,1,7,0,8,1,8,7,1,-1,-1,-1,-1,4,0,3,7,4,3,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,4,8,7,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,9,10,8,10,11,8,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,3,0,9,3,9,11,11,9,10,-1,-1,-1,-1,-1,-1,-1,0,1,10,0,10,8,8,10,11,-1,-1,-1,-1,-1,-1,-1,3,1,10,11,3,10,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,1,2,11,1,11,9,9,11,8,-1,-1,-1,-1,-1,-1,-1,3,0,9,3,9,11,1,2,9,2,11,9,-1,-1,-1,-1,0,2,11,8,0,11,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,3,2,11,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,2,3,8,2,8,10,10,8,9,-1,-1,-1,-1,-1,-1,-1,9,10,2,0,9,2,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,2,3,8,2,8,10,0,1,8,1,10,8,-1,-1,-1,-1,1,10,2,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,1,3,8,9,1,8,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,9,1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,3,8,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1]),Qd={uFurFade:{value:1}},M2=`
  float furHash(vec3 p) { p = fract(p * 0.1031); p += dot(p, p.zyx + 31.32); return fract((p.x + p.y) * p.z); }
  float furNoise(vec3 p) { vec3 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f);
    return mix(mix(mix(furHash(i), furHash(i + vec3(1, 0, 0)), f.x), mix(furHash(i + vec3(0, 1, 0)), furHash(i + vec3(1, 1, 0)), f.x), f.y),
               mix(mix(furHash(i + vec3(0, 0, 1)), furHash(i + vec3(1, 0, 1)), f.x), mix(furHash(i + vec3(0, 1, 1)), furHash(i + vec3(1, 1, 1)), f.x), f.y), f.z); }`;function y2(i,t){const e=new ui({vertexColors:!0,roughness:t.feather?.75:.92,metalness:0}),n={uH:{value:i},uFurLen:{value:t.length},uFurDensity:{value:t.density},uFurTip:{value:t.tip},uFeather:{value:t.feather?1:0}};return e.onBeforeCompile=r=>{Object.assign(r.uniforms,n,Qd),r.vertexShader=r.vertexShader.replace("#include <common>",`#include <common>
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
        ${M2}`).replace("#include <color_fragment>",`#include <color_fragment>
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
        diffuseColor.rgb = mix(diffuseColor.rgb, diffuseColor.rgb * 1.25 + 0.06, uFurTip * smoothstep(0.6, 1.0, t));`)},e.customProgramCacheKey=()=>"kaiju-fur-v2",e}function b2(i,t,e,n){const r=[];for(let s=1;s<=n;s++){const a=new Pd(t,y2(s/n,e));a.castShadow=!1,a.receiveShadow=!0,a.frustumCulled=!1,a.userData.h=s/n,i.add(a),a.bind(i.skeleton,i.bindMatrix),r.push(a)}return r}function S2(i=512){const t=document.createElement("canvas");t.width=t.height=i;const e=t.getContext("2d"),n=document.createElement("canvas");n.width=n.height=i;const r=n.getContext("2d"),s=e.createImageData(i,i),a=r.createImageData(i,i),o=22,c=[];let l=7;const h=()=>(l=l*1664525+1013904223>>>0,l/4294967296);for(let f=0;f<o;f++)for(let g=0;g<o;g++)c.push([(g+.2+h()*.6)/o,(f+.2+h()*.6)/o,.7+h()*.3]);for(let f=0;f<i;f++)for(let g=0;g<i;g++){const v=g/i,m=f/i,p=Math.floor(v*o),y=Math.floor(m*o);let M=9,b=9,w=1;for(let E=-1;E<=1;E++)for(let P=-1;P<=1;P++){const L=(p+P+o)%o,I=(y+E+o)%o,B=c[I*o+L];let X=v-B[0],H=m-B[1];X-=Math.round(X),H-=Math.round(H);const it=Math.sqrt(X*X+H*H);it<M?(b=M,M=it,w=B[2]):it<b&&(b=it)}const T=b-M,A=Math.min(1,T/.02),R=1-Math.min(1,M/(.55/o)),x=(.55+.45*A)*w*(.85+.3*R),_=(f*i+g)*4;s.data[_]=255*x,s.data[_+1]=255*x,s.data[_+2]=255*x,s.data[_+3]=255;const S=.55+.4*(1-A)-.15*R;a.data[_]=255*S,a.data[_+1]=255*S,a.data[_+2]=255*S,a.data[_+3]=255}e.putImageData(s,0,0),r.putImageData(a,0,0);const u=new Ol(t);u.wrapS=u.wrapT=Cs,u.colorSpace=ci;const d=new Ol(n);return d.wrapS=d.wrapT=Cs,{map:u,rough:d}}let go=null;function w2(i=!1,t){if(i)return E2();if(t==="armour")return new ui({vertexColors:!0,roughness:.42,metalness:.45});if(t==="soft")return new ui({vertexColors:!0,roughness:.82,metalness:0});if(t==="suit")return new ui({vertexColors:!0,roughness:.34,metalness:.18});!go&&typeof document<"u"&&(go=S2());const e=new ui({vertexColors:!0,roughness:.7,metalness:.02});return e.onBeforeCompile=n=>{n.uniforms.uScales={value:go?.map??null},n.uniforms.uRough={value:go?.rough??null},n.vertexShader=n.vertexShader.replace("#include <common>",`#include <common>
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
        float roughTex = triplanar(uRough, vBind, bn, sc).r;`).replace("#include <roughnessmap_fragment>","float roughnessFactor = mix(roughTex, 0.9, isBone);")},e.customProgramCacheKey=()=>"kaiju-v1",e}function E2(){const i=new ui({vertexColors:!0,roughness:.95,metalness:0});return i.onBeforeCompile=t=>{Object.assign(t.uniforms,Qd),t.fragmentShader=t.fragmentShader.replace("#include <common>",`#include <common>
 uniform float uFurFade;`).replace("#include <color_fragment>",`#include <color_fragment>
 diffuseColor.rgb *= mix(1.0, 0.6, uFurFade);`)},i.customProgramCacheKey=()=>"kaiju-undercoat-v1",i}function Gl(i){const t=new Se;return t.setAttribute("position",new ae(i.position,3)),t.setAttribute("normal",new ae(i.normal,3)),t.setAttribute("color",new ae(i.color,3)),i.aFur&&t.setAttribute("aFur",new ae(i.aFur,1)),t.setAttribute("skinIndex",new ae(i.skinIndex,4)),t.setAttribute("skinWeight",new ae(i.skinWeight,4)),t}function uf(i,t,e){return Gl(T2(i,t,e))}function T2(i,t,e){const n=i.box,r=(n.min[0]+n.max[0])/2,s=(n.min[1]+n.max[1])/2,a=(n.min[2]+n.max[2])/2,o=(n.max[0]-n.min[0])/2,c=(n.max[1]-n.min[1])/2,l=(n.max[2]-n.min[2])/2,h=new Kd(e,new Qi,!1,!1,4e5);h.isolation=50;const u=h.field,d=e;for(let S=0;S<d;S++){const E=a+(S/(d-1)*2-1)*l;for(let P=0;P<d;P++){const L=s+(P/(d-1)*2-1)*c;for(let I=0;I<d;I++){const B=r+(I/(d-1)*2-1)*o;u[S*d*d+P*d+I]=Math.max(0,Math.min(100,50-i.sdf(B,L,E)*40))}}}h.update();const f=h.count,g=new Float32Array(f*3),v=new Float32Array(f*3),m=new Float32Array(f*3),p=h.positionArray,y=h.normalArray,M=i.palette.map(S=>new Pt(S)),b=new Pt;for(let S=0;S<f;S++){const E=r+p[S*3]*o,P=s+p[S*3+1]*c,L=a+p[S*3+2]*l;g[S*3]=E,g[S*3+1]=P,g[S*3+2]=L;let I=y[S*3]/o,B=y[S*3+1]/c,X=y[S*3+2]/l;const H=Math.hypot(I,B,X)||1;I/=H,B/=H,X/=H,v[S*3]=I,v[S*3+1]=B,v[S*3+2]=X;const it=i.region(E,P,L);b.copy(M[it]??M[0]),i.tint?.(it,E,P,L,b);const lt=.94+.06*Math.sin(P*1.7+L*.9)*Math.cos(E*2.3);m[S*3]=b.r*lt,m[S*3+1]=b.g*lt,m[S*3+2]=b.b*lt}h.geometry.dispose();let w;if(i.fur){w=new Float32Array(f);for(let S=0;S<f;S++)w[S]=i.furLen?i.furLen(g[S*3],g[S*3+1],g[S*3+2]):1}const T=new Uint16Array(f*4),A=new Float32Array(f*4),R=t.map((S,E)=>({i:E,a:S.a,b:S.b,reach:S.reach??1/0,name:S.name})),x=i.capture,_=i.weights??"sharp";for(let S=0;S<f;S++){const E=g[S*3],P=g[S*3+1],L=g[S*3+2];let I=1/0,B=1/0,X=0,H=0;for(const vt of R){if(x&&!x(vt,E,P,L))continue;const wt=vt.b[0]-vt.a[0],Ft=vt.b[1]-vt.a[1],ot=vt.b[2]-vt.a[2],V=E-vt.a[0],Z=P-vt.a[1],k=L-vt.a[2],G=Math.max(0,Math.min(1,(V*wt+Z*Ft+k*ot)/(wt*wt+Ft*Ft+ot*ot||1))),z=Math.hypot(V-wt*G,Z-Ft*G,k-ot*G);z>vt.reach||(z<I?(B=I,H=X,I=z,X=vt.i):z<B&&(B=z,H=vt.i))}isFinite(B)||(B=I,H=X);const it=_==="rigid"?1:_==="soft"?1/Math.pow(I+1.2,2):1/Math.pow(I+.3,4),lt=_==="rigid"?0:_==="soft"?1/Math.pow(B+1.2,2):1/Math.pow(B+.3,4),dt=it+lt;T[S*4]=X,T[S*4+1]=H,A[S*4]=it/dt,A[S*4+1]=lt/dt}return{position:g,normal:v,color:m,skinIndex:T,skinWeight:A,aFur:w}}const A2=(i,t=i.res??88)=>({body:t,fur:Math.max(32,Math.round(t*.6))});function R2(i){const t=new Map;let e=null;for(const n of i){const r=new Dd;if(r.name=n.name,n.parent){const s=i.find(a=>a.name===n.parent);r.position.set(n.a[0]-s.a[0],n.a[1]-s.a[1],n.a[2]-s.a[2]),t.get(n.parent).add(r)}else r.position.set(n.a[0],n.a[1],n.a[2]),e=r;t.set(n.name,r)}return{bones:t,root:e}}function Uc(i,t=i.res??88,e){const n=performance.now(),r=A2(i,t),{bones:s,root:a}=R2(i.segs);let o,c=[];if(i.body){const l=i.body,h=e?Gl(e.body):uf(l,i.segs,r.body),u=l.surface==="scales"||l.surface==="fur"?void 0:l.surface,d=new Pd(h,w2(!!l.fur||l.surface==="fur",u));d.castShadow=!0,d.receiveShadow=!0,d.frustumCulled=!1,d.add(a),d.bind(new ph(i.segs.map(f=>s.get(f.name)))),l.fur&&(i.furShells??10)>0&&(c=b2(d,e?.fur?Gl(e.fur):uf(l,i.segs,r.fur),l.fur,i.furShells??10)),o=d}else{const l=new He;l.add(a),o=l}if(i.dress){const l=new Map;i.dress({bones:s,segs:i.segs,at(h,u,d,f,g){const v=i.segs.find(m=>m.name===u);return h.position.set(d-v.a[0],f-v.a[1],g-v.a[2]),h.traverse(m=>{m.isMesh&&(m.castShadow=!0,m.receiveShadow=!0)}),s.get(u).add(h),h},std(h){const u=JSON.stringify(h);let d=l.get(u);return d||(d=new ui(h),l.set(u,d)),d}})}return o.name=i.id,{def:i,root:o,bones:s,fur:c,ms:performance.now()-n}}const rt=(i,t,e)=>{const n=Math.max(e-Math.abs(i-t),0)/e;return Math.min(i,t)-n*n*e*.25};function Le(i,t,e,n,r,s,a){const o=i-n,c=t-r,l=e-s;return Math.sqrt(o*o+c*c+l*l)-a}function St(i,t,e,n,r,s,a,o,c,l,h){const u=a-n,d=o-r,f=c-s,g=i-n,v=t-r,m=e-s,p=Math.max(0,Math.min(1,(g*u+v*d+m*f)/(u*u+d*d+f*f))),y=g-u*p,M=v-d*p,b=m-f*p;return Math.sqrt(y*y+M*M+b*b)-(l+(h-l)*p)}function Dt(i,t,e,n,r,s,a,o,c){const l=(i-n)/a,h=(t-r)/o,u=(e-s)/c,d=Math.sqrt(l*l+h*h+u*u),f=Math.sqrt(l*l/a+h*h/o+u*u/c);return f>0?d*(d-1)/f:-Math.min(a,o,c)}const wr=2.1,ms=[1.95,6,.2],fi=[wr,3.4,.55],pr=[wr,1,0],ff=[wr,.3,2],si=[2.9,11,.8],Tn=[4.99,10.54,1.28],Ji=[6.76,10.06,1.79],fn=[[0,6.6,-2.6],[.5,4.6,-4.4],[1.6,2.4,-5.3],[3,1.1,-5.2],[4.5,.85,-4.1]],df=[1.15,1.45,1.4,1.2,.75],ye=[0,14.4,.6],C2=[{name:"pelvis",a:[0,6,0],b:[0,7.6,0],parent:null},{name:"spine1",a:[0,7.6,0],b:[0,9.4,.1],parent:"pelvis"},{name:"spine2",a:[0,9.4,.1],b:[0,11.4,.1],parent:"spine1"},{name:"neck",a:[0,11.4,.1],b:[0,ye[1]-1.6,ye[2]-.25],parent:"spine2"},{name:"head",a:[0,ye[1]-1.6,ye[2]-.25],b:[0,ye[1]+1.6,ye[2]+.1],parent:"neck"},{name:"jaw",a:[0,ye[1]-1.1,ye[2]+1.1],b:[0,ye[1]-1.2,ye[2]+2.9],parent:"head",reach:0},{name:"tail1",a:fn[0],b:fn[1],parent:"pelvis"},{name:"tail2",a:fn[1],b:fn[2],parent:"tail1"},{name:"tail3",a:fn[2],b:fn[3],parent:"tail2"},{name:"tail4",a:fn[3],b:fn[4],parent:"tail3"},{name:"thighL",a:ms,b:fi,parent:"pelvis"},{name:"shinL",a:fi,b:pr,parent:"thighL"},{name:"footL",a:pr,b:ff,parent:"shinL"},{name:"thighR",a:ei(ms),b:ei(fi),parent:"pelvis"},{name:"shinR",a:ei(fi),b:ei(pr),parent:"thighR"},{name:"footR",a:ei(pr),b:ei(ff),parent:"shinR"},{name:"armL",a:si,b:Tn,parent:"spine2"},{name:"forearmL",a:Tn,b:Ji,parent:"armL"},{name:"armR",a:ei(si),b:ei(Tn),parent:"spine2"},{name:"forearmR",a:ei(Tn),b:ei(Ji),parent:"armR"}];function ei(i){return[-i[0],i[1],i[2]]}const L2={min:[-8.6,-.4,-7.2],max:[8.6,18.4,5.8]},dn=[.98,ye[1]+.33,ye[2]+1.97],gr=[0,ye[1]-.5,ye[2]+4.05],$n=wh(t0(Ji,Tn)),Nc=wh([-$n[2],0,$n[0]]);function t0(i,t){return[i[0]-t[0],i[1]-t[1],i[2]-t[2]]}function wh(i){const t=Math.hypot(i[0],i[1],i[2]);return[i[0]/t,i[1]/t,i[2]/t]}const Us=(i,t,e,n=0)=>[i[0]+$n[0]*t+Nc[0]*e,i[1]+$n[1]*t+Nc[1]*e+n,i[2]+$n[2]*t+Nc[2]*e],Wn=Us(Ji,.35,0),P2=Us(Wn,1.3,0),e0=(i,t,e)=>(i-Ji[0])*$n[0]+(t-Ji[1])*$n[1]+(e-Ji[2])*$n[2],n0=[-.42,-.14,.14,.42].map(i=>[Us(Wn,.35,i*1.1),Us(Wn,1.15-Math.abs(i)*.5,i*1.35,-.12)]);n0.push([Us(Wn,-.1,.45),Us(Wn,.45,.95,-.1)]);const D2=[-.5,-.17,.17,.5].map(i=>[[wr+i*1.1,.3,1.8],[wr+i*1.3,.22,2.7-Math.abs(i)*.4]]),zi=(i,t,e,n,r,s,a)=>St(i,t,e,n[0],n[1],n[2],r[0],r[1],r[2],s,a),es=2.5;let pf=NaN,mf=NaN,gf=NaN;const Hi={body:0,head:0,arm:0,leg:0,tail:0,min:0};function Da(i,t,e){if(i===pf&&t===mf&&e===gf)return Hi;pf=i,mf=t,gf=e;const n=Math.abs(i);let r=Le(i,t,e,0,9.2,.2,5.6);r<es&&(r=Dt(i,t,e,0,7.7,.35,3.85,3.35,3.4),r=rt(r,Dt(i,t,e,0,10.3,.3,3,2.1,2.7),1.6),r=rt(r,Dt(i,t,e,0,6.9,-1.2,3.4,2.6,2.7),1.2),r=rt(r,Le(n,t,e,si[0],si[1],si[2],.85),.7),r=rt(r,St(i,t,e,0,11,.2,0,ye[1]-1.4,ye[2]-.15,2.1,1.7),.8)),Hi.body=r;const s=t-ye[1],a=e-ye[2];let o=Le(i,s,a,0,.6,.5,4.3);o<es&&(o=Dt(i,s,a,0,0,0,2.38,2.05,2.21),o=rt(o,Dt(n,s,a,1.8,-.66,.25,1.15,1.23,1.31),.66),o=rt(o,St(i,s,a,0,-.25,1.48,0,-.57,3.6,1.11,.45),.5),o=rt(o,St(i,s,a,0,-1.07,1.15,0,-1.23,2.95,.78,.41),.33),o=rt(o,Dt(n,s,a,1.44,2.05,-.66,.78,1.03,.34),.29),o=Math.max(o,-Le(n,t,e,dn[0]+.05,dn[1],dn[2]+.2,.34))),Hi.head=o;let c=zi(n,t,e,si,P2,1.6,1.6);if(c<es&&(c=zi(n,t,e,si,Tn,.72,.8),c=rt(c,Le(n,t,e,(si[0]+Tn[0])/2,(si[1]+Tn[1])/2,(si[2]+Tn[2])/2,.9),.6),c=rt(c,zi(n,t,e,Tn,Ji,.8,.6),.4),Le(n,t,e,Wn[0],Wn[1],Wn[2],1.6)<es)){c=rt(c,Dt(n,t,e,Wn[0],Wn[1],Wn[2],.62,.38,.62),.3);for(const u of n0)c=rt(c,zi(n,t,e,u[0],u[1],.24,.17),.14)}Hi.arm=c;let l=St(n,t,e,ms[0],ms[1],ms[2],wr,.6,1,2,2);if(l<es&&(l=zi(n,t,e,ms,fi,1.42,1.1),l=rt(l,zi(n,t,e,fi,pr,1.08,.85),.5),t<2.6)){l=rt(l,Math.max(Dt(n,t,e,wr,.45,.75,.95,.6,1.75),-t),.45);for(const u of D2)l=rt(l,zi(n,t,e,u[0],u[1],.26,.18),.15)}Hi.leg=l;let h=Le(i,t,e,2,3.4,-4.4,5.4);if(h<es){h=1e9;for(let u=0;u+1<fn.length;u++)h=rt(h,zi(i,t,e,fn[u],fn[u+1],df[u],df[u+1]),.5)}return Hi.tail=h,Hi.min=Math.min(r,o,c,l,h),Hi}function I2(i,t,e){const n=Da(i,t,e);let r=rt(n.body,n.head,.6);return r=rt(r,n.arm,.5),r=rt(r,n.leg,.7),rt(r,n.tail,.6)}function U2(i,t,e){let n=0,r=1/0,s=0;for(let a=0;a+1<fn.length;a++){const o=fn[a],c=fn[a+1],l=c[0]-o[0],h=c[1]-o[1],u=c[2]-o[2],d=l*l+h*h+u*u,f=Math.max(0,Math.min(1,((i-o[0])*l+(t-o[1])*h+(e-o[2])*u)/d)),g=i-o[0]-l*f,v=t-o[1]-h*f,m=e-o[2]-u*f,p=g*g+v*v+m*m;p<r&&(r=p,n=s+f*Math.sqrt(d)),s+=Math.sqrt(d)}return n}function N2(i,t,e){const n=Math.abs(i);if(Math.hypot(i,t-gr[1],e-gr[2])<.62)return 3;const r=Da(i,t,e),s=r.min;if(r.head===s){const a=t-ye[1],o=e-ye[2];if(o>.2&&a>-1.9){const c=n-1.1,l=a-.22+.32*c;if((c/1.25)**2+(l/.66)**2<1||n<.34&&a>-.35&&a<2.4&&o>.6)return 2;const h=n-1.05,u=a-1.12+.18*h;if((h/1)**2+(u/.4)**2<1||a<-.15+.25*Math.max(0,n-1.2)&&o>.5)return 1}return a>2.75&&n>.98?1:0}if(r.tail===s){const a=U2(i,t,e);return a>7.9||a%2<.85?2:4}return r.arm===s?e0(n,t,e)>-.25?5:0:r.leg===s?t<1.3?5:0:e>1.2&&(i/2.4)**2+((t-7.9)/3.1)**2<1?4:0}function F2(i,t,e){const n=Math.abs(i),r=Math.hypot(n-dn[0],t-dn[1],e-dn[2]);if(r<.62||Math.hypot(i,t-gr[1],e-gr[2])<.85)return 0;const s=Da(i,t,e),a=s.min;if(s.head===a){const o=t-ye[1],c=e-ye[2];return o>1.4&&n>.9&&c<.1?.5:n>1.4&&o<0&&c<1.5?1.35:c>1?.35+.4*Math.min(1,(r-.62)/1.3):.9}return s.tail===a?1.4:s.arm===a?e0(n,t,e)>-.25?.25:.9:s.leg===a?t<1.3?.3:1:1.1}const O2=.15,B2=new Map([["pelvis",0],["spine1",0],["spine2",0],["neck",1],["head",2],["jaw",2],["armL",3],["forearmL",3],["armR",4],["forearmR",4],["thighL",5],["shinL",5],["footL",5],["thighR",6],["shinR",6],["footR",6],["tail1",7],["tail2",7],["tail3",7],["tail4",7]]),Fc=wh(t0(pr,fi)),k2=new Map([["forearm",(i,t,e)=>(i-Tn[0])*$n[0]+(t-Tn[1])*$n[1]+(e-Tn[2])*$n[2]>-.9],["shin",(i,t,e)=>(i-fi[0])*Fc[0]+(t-fi[1])*Fc[1]+(e-fi[2])*Fc[2]>-.9],["foot",(i,t)=>t<pr[1]+.7]]),vo=(i,t,e,n)=>{const r=k2.get(i.slice(0,-1));return!r||r(Math.abs(t),e,n)},z2=(i,t,e,n)=>{const r=Da(t,e,n),s=r.min+O2;switch(B2.get(i.name)){case 0:return r.body<=s;case 1:return e>10.6&&(r.body<=s&&Math.abs(t)<2.4||r.head<=s&&e<ye[1]-1.6);case 2:return r.head<=s&&e>ye[1]-2.1||r.body<=s&&e>12&&Math.abs(t)<2;case 3:return r.arm<=s&&t>.5&&vo(i.name,t,e,n);case 4:return r.arm<=s&&t<-.5&&vo(i.name,t,e,n);case 5:return r.leg<=s&&t>.2&&vo(i.name,t,e,n);case 6:return r.leg<=s&&t<-.2&&vo(i.name,t,e,n);case 7:return r.tail<=s;default:return!0}},H2={id:"jimothy",name:"Jimothy",blurb:"The round Seattle raccoon, standing up",segs:C2,body:{sdf:I2,region:N2,box:L2,palette:[7103837,15130834,1841431,657930,9406332,3814192],weights:"soft",capture:z2,fur:{length:1,density:7,tip:.18},furLen:F2,tint(i,t,e,n,r){if(i!==0)return;n<-.5&&r.multiplyScalar(1-.2*Math.min(1,(-.5-n)/2.5));const s=Da(t,e,n);(s.arm===s.min||s.leg===s.min)&&r.multiplyScalar(.82)}},dress(i){const t=i.std({color:328965,roughness:.06,metalness:.1});for(const n of[-1,1])i.at(new It(new Ne(.34,14,10),t),"head",n*dn[0],dn[1],dn[2]);const e=new It(new Ne(.42,14,10),i.std({color:657930,roughness:.25}));e.scale.set(1.15,.8,.75),i.at(e,"head",gr[0],gr[1],gr[2])},fit:{size:1.05,limb:.5},face:{eyes:[[dn[0],dn[1],dn[2]+.18,.36],[-.98,dn[1],dn[2]+.18,.36]]},idle:{tail:.15},res:84,furShells:8},Zs=new N;function Pn(i,t,e,n,r,s){const a=2*Math.PI*r/4,o=Math.max(s-2*r,0),c=Math.PI/4;Zs.copy(t),Zs[n]=0,Zs.normalize();const l=.5*a/(a+o),h=1-Zs.angleTo(i)/c;return Math.sign(Zs[e])===1?h*l:o/(a+o)+l+l*(1-h)}class Eh extends Ge{constructor(t=1,e=1,n=1,r=2,s=.1){const a=r*2+1;if(s=Math.min(t/2,e/2,n/2,s),super(1,1,1,a,a,a),this.type="RoundedBoxGeometry",this.parameters={width:t,height:e,depth:n,segments:r,radius:s},a===1)return;const o=this.toNonIndexed();this.index=null,this.attributes.position=o.attributes.position,this.attributes.normal=o.attributes.normal,this.attributes.uv=o.attributes.uv;const c=new N,l=new N,h=new N(t,e,n).divideScalar(2).subScalar(s),u=this.attributes.position.array,d=this.attributes.normal.array,f=this.attributes.uv.array,g=u.length/6,v=new N,m=.5/a;for(let p=0,y=0;p<u.length;p+=3,y+=2)switch(c.fromArray(u,p),l.copy(c),l.x-=Math.sign(l.x)*m,l.y-=Math.sign(l.y)*m,l.z-=Math.sign(l.z)*m,l.normalize(),u[p+0]=h.x*Math.sign(c.x)+l.x*s,u[p+1]=h.y*Math.sign(c.y)+l.y*s,u[p+2]=h.z*Math.sign(c.z)+l.z*s,d[p+0]=l.x,d[p+1]=l.y,d[p+2]=l.z,Math.floor(p/g)){case 0:v.set(1,0,0),f[y+0]=Pn(v,l,"z","y",s,n),f[y+1]=1-Pn(v,l,"y","z",s,e);break;case 1:v.set(-1,0,0),f[y+0]=1-Pn(v,l,"z","y",s,n),f[y+1]=1-Pn(v,l,"y","z",s,e);break;case 2:v.set(0,1,0),f[y+0]=1-Pn(v,l,"x","z",s,t),f[y+1]=Pn(v,l,"z","x",s,n);break;case 3:v.set(0,-1,0),f[y+0]=1-Pn(v,l,"x","z",s,t),f[y+1]=1-Pn(v,l,"z","x",s,n);break;case 4:v.set(0,0,1),f[y+0]=1-Pn(v,l,"x","y",s,t),f[y+1]=1-Pn(v,l,"y","x",s,e);break;case 5:v.set(0,0,-1),f[y+0]=Pn(v,l,"x","y",s,t),f[y+1]=1-Pn(v,l,"y","x",s,e);break}}static fromJSON(t){return new Eh(t.width,t.height,t.depth,t.segments,t.radius)}}function Th(i,t=!1){const e=i[0].index!==null,n=new Set(Object.keys(i[0].attributes)),r=new Set(Object.keys(i[0].morphAttributes)),s={},a={},o=i[0].morphTargetsRelative,c=new Se;let l=0;for(let h=0;h<i.length;++h){const u=i[h];let d=0;if(e!==(u.index!==null))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". All geometries must have compatible attributes; make sure index attribute exists among all geometries, or in none of them."),null;for(const f in u.attributes){if(!n.has(f))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+'. All geometries must have compatible attributes; make sure "'+f+'" attribute exists among all geometries, or in none of them.'),null;s[f]===void 0&&(s[f]=[]),s[f].push(u.attributes[f]),d++}if(d!==n.size)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". Make sure all geometries have the same number of attributes."),null;if(o!==u.morphTargetsRelative)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". .morphTargetsRelative must be consistent throughout all geometries."),null;for(const f in u.morphAttributes){if(!r.has(f))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+".  .morphAttributes must be consistent throughout all geometries."),null;a[f]===void 0&&(a[f]=[]),a[f].push(u.morphAttributes[f])}if(t){let f;if(e)f=u.index.count;else if(u.attributes.position!==void 0)f=u.attributes.position.count;else return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". The geometry must have either an index or a position attribute"),null;c.addGroup(l,f,h),l+=f}}if(e){let h=0;const u=[];for(let d=0;d<i.length;++d){const f=i[d].index;for(let g=0;g<f.count;++g)u.push(f.getX(g)+h);h+=i[d].attributes.position.count}c.setIndex(u)}for(const h in s){const u=vf(s[h]);if(!u)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+h+" attribute."),null;c.setAttribute(h,u)}for(const h in a){const u=a[h][0].length;if(u===0)break;c.morphAttributes=c.morphAttributes||{},c.morphAttributes[h]=[];for(let d=0;d<u;++d){const f=[];for(let v=0;v<a[h].length;++v)f.push(a[h][v][d]);const g=vf(f);if(!g)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+h+" morphAttribute."),null;c.morphAttributes[h].push(g)}}return c}function vf(i){let t,e,n,r=-1,s=0;for(let l=0;l<i.length;++l){const h=i[l];if(t===void 0&&(t=h.array.constructor),t!==h.array.constructor)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.array must be of consistent array types across matching attributes."),null;if(e===void 0&&(e=h.itemSize),e!==h.itemSize)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.itemSize must be consistent across matching attributes."),null;if(n===void 0&&(n=h.normalized),n!==h.normalized)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.normalized must be consistent across matching attributes."),null;if(r===-1&&(r=h.gpuType),r!==h.gpuType)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.gpuType must be consistent across matching attributes."),null;s+=h.count*e}const a=new t(s),o=new ae(a,e,n);let c=0;for(let l=0;l<i.length;++l){const h=i[l];if(h.isInterleavedBufferAttribute){const u=c/e;for(let d=0,f=h.count;d<f;d++)for(let g=0;g<e;g++){const v=h.getComponent(d,g);o.setComponent(d+u,g,v)}}else a.set(h.array,c);c+=h.count*e}return r!==void 0&&(o.gpuType=r),o}const i0=[{name:"pelvis",a:[0,9.6,0],b:[0,10.8,0],parent:null},{name:"spine1",a:[0,10.8,0],b:[0,12.6,0],parent:"pelvis"},{name:"spine2",a:[0,12.6,0],b:[0,15,0],parent:"spine1"},{name:"neck",a:[0,15,0],b:[0,15.9,0],parent:"spine2"},{name:"head",a:[0,15.9,0],b:[0,18.4,0],parent:"neck"},{name:"jaw",a:[0,16.5,1],b:[0,16.5,1.3],parent:"head",reach:0},{name:"tail1",a:[0,9.4,-.8],b:[0,9.2,-1.2],parent:"pelvis",reach:0},{name:"tail2",a:[0,9.2,-1.2],b:[0,9,-1.6],parent:"tail1",reach:0},{name:"tail3",a:[0,9,-1.6],b:[0,8.8,-2],parent:"tail2",reach:0},{name:"tail4",a:[0,8.8,-2],b:[0,8.6,-2.4],parent:"tail3",reach:0},{name:"thighL",a:[.95,9.6,0],b:[.95,5.3,0],parent:"pelvis"},{name:"shinL",a:[.95,5.3,0],b:[.95,1.2,0],parent:"thighL"},{name:"footL",a:[.95,1.2,0],b:[.95,.4,1.5],parent:"shinL"},{name:"thighR",a:[-.95,9.6,0],b:[-.95,5.3,0],parent:"pelvis"},{name:"shinR",a:[-.95,5.3,0],b:[-.95,1.2,0],parent:"thighR"},{name:"footR",a:[-.95,1.2,0],b:[-.95,.4,1.5],parent:"shinR"},{name:"armL",a:[2.75,14.4,0],b:[2.75,11.9,0],parent:"spine2"},{name:"forearmL",a:[2.75,11.9,0],b:[2.75,9.5,0],parent:"armL"},{name:"armR",a:[-2.75,14.4,0],b:[-2.75,11.9,0],parent:"spine2"},{name:"forearmR",a:[-2.75,11.9,0],b:[-2.75,9.5,0],parent:"armR"}],Ah={y:17.15,a:1.6,b:1.62},Oc=3,jn=10,xf=Math.PI/jn,Rh=.38,gs=[{y0:.35,y1:5.2,r0:7.8,r1:5,bone:"pelvis"},{y0:3.9,y1:8.7,r0:7.1,r1:4.4,bone:"pelvis"},{y0:7.3,y1:12,r0:6.3,r1:3.8,bone:"spine1"},{y0:10.6,y1:15,r0:5.4,r1:3.2,bone:"spine2"},{y0:13.5,y1:20,r0:4.7,r1:2.4,bone:"head",flare:1.8,cols:6,rows:20,hole:Ah},{y0:19.25,y1:23.7,r0:3.4,r1:.05,bone:"head",flare:1}],V2=9425231,G2=2907158,r0=(i,t)=>i.r1+(i.r0-i.r1)*Math.pow(Math.min(1,Math.max(0,1-t)),i.flare??1.25),W2=i=>{const t=Math.sin(i*127.1+311.7)*43758.5453;return t-Math.floor(t)};function xa(i,t){const e=Math.floor(t),n=t-e,r=xf+e/jn*Math.PI*2,s=xf+(e+1)/jn*Math.PI*2;return[i*(Math.sin(r)+(Math.sin(s)-Math.sin(r))*n),i*(Math.cos(r)+(Math.cos(s)-Math.cos(r))*n)]}function s0(i,t,e){const n=r0(i,(e-i.y0)/(i.y1-i.y0));for(let r=0;r<jn;r++){const[s,a]=xa(n,r),[o,c]=xa(n,r+1);if(a+c>0&&(t-s)*(t-o)<=0&&s!==o)return a+(t-s)/(o-s)*(c-a)}return Math.sqrt(Math.max(0,n*n-t*t))}const _f=(i,t,e)=>Math.pow(Math.abs(t/i.a)**Oc+Math.abs((e-i.y)/i.b)**Oc,1/Oc),X2=gs.find(i=>i.hole),vs=s0(X2,0,Ah.y)-.3,Wl=.56,Xl=17.4;function q2(i){const t=i.cols??2,e=i.rows??2,n=jn*t,r=i.y1-i.y0,s=[],a=[],o=new Pt(V2),c=new Pt(G2),l=new Pt;for(let d=0;d<=e;d++){const f=1-d/e,g=r0(i,f);for(let v=0;v<=n;v++){let[m,p]=xa(g,v/t),y=i.y0+f*r;if(d===e&&v%2===0){const b=v%n,w=.6+.8*W2(b+i.y0*7);y-=Rh*w,m*=1.04,p*=1.04}s.push(m,y,p);const M=Math.min(1,Math.max(0,(f-.25)/.4));l.copy(o).lerp(c,M*M*(3-2*M)),a.push(l.r,l.g,l.b)}}const h=[];for(let d=0;d<e;d++)for(let f=0;f<n;f++){const g=d*(n+1)+f,v=g+n+1,m=v+1,p=g+1;h.push(g,v,p,v,m,p)}if(i.hole){const d=i.hole,f=[],g=new Set,v=new Set;for(let m=0;m<h.length;m+=3){const p=[h[m],h[m+1],h[m+2]],y=(s[p[0]*3]+s[p[1]*3]+s[p[2]*3])/3,M=(s[p[0]*3+1]+s[p[1]*3+1]+s[p[2]*3+1])/3;if((s[p[0]*3+2]+s[p[1]*3+2]+s[p[2]*3+2])/3>0&&_f(d,y,M)<1)for(const w of p)g.add(w);else{f.push(...p);for(const w of p)v.add(w)}}for(const m of g){if(!v.has(m))continue;const p=s[m*3],y=s[m*3+1],M=_f(d,p,y);if(M<.3)continue;const b=p/M,w=d.y+(y-d.y)/M;s[m*3]=b,s[m*3+1]=w,s[m*3+2]=s0(i,b,w)}h.length=0,h.push(...f)}const u=new Se;return u.setAttribute("position",new se(s,3)),u.setAttribute("color",new se(a,3)),u.setIndex(h),u.computeVertexNormals(),u}const a0=[[0,-3,.6,2],[0,0,.7,4],[0,2,.55,0],[1,-1,.9,0],[1,1,.6,3],[1,-4,.6,1],[2,-2,.6,1],[2,2,.7,2],[3,-1,.6,4],[3,1,.55,1],[4,-2,.45,1],[4,1,.45,2],[5,-2,.35,0],[5,1,.35,2]],mr=[14165550,2838486,9060304,14699176,15759898],_a=a0.map(([i,t,e,n])=>{const r=gs[i],[s,a]=xa(r.r0*.99,(t%jn+jn)%jn),o=r.y0-Rh*.55;return{bone:r.bone,p:[s,o-e*1.2-.3,a],ci:n}}),Bc=_a.length,Mf=new WeakMap,o0=i=>{let t=Mf.get(i);return t||(t={uOrnPos:{value:_a.map(()=>new N(0,-1e4,0))},uOrnCol:{value:_a.map(()=>new Pt(0,0,0))},uOrnR:{value:.2}},Mf.set(i,t)),t};function Y2(i){i.name="lime",i.onBeforeCompile=function(t){Object.assign(t.uniforms,o0(this)),t.vertexShader=t.vertexShader.replace("#include <common>",`#include <common>
 varying vec3 vOrnW;`).replace("#include <project_vertex>",`#include <project_vertex>
 vOrnW = (modelMatrix * vec4(transformed, 1.0)).xyz;`),t.fragmentShader=t.fragmentShader.replace("#include <common>",`#include <common>
        varying vec3 vOrnW; uniform vec3 uOrnPos[${Bc}]; uniform vec3 uOrnCol[${Bc}]; uniform float uOrnR;`).replace("#include <emissivemap_fragment>",`#include <emissivemap_fragment>
        for (int i = 0; i < ${Bc}; i++) {
          vec3 dv = vOrnW - uOrnPos[i];
          float q = dot(dv, dv) / (uOrnR * uOrnR);
          totalEmissiveRadiance += uOrnCol[i] * diffuseColor.rgb * (1.0 / (1.0 + q * 2.5)) * smoothstep(9.0, 2.0, q);
        }`)},i.customProgramCacheKey=()=>"builder-lime-ornaments-v1"}let Js=null;function $2(){if(Js)return Js;const i=document.createElement("canvas");i.width=i.height=64;const t=i.getContext("2d"),e=t.createRadialGradient(32,32,0,32,32,32);return e.addColorStop(0,"rgba(255,255,255,1)"),e.addColorStop(.18,"rgba(255,255,255,0.75)"),e.addColorStop(.45,"rgba(255,255,255,0.22)"),e.addColorStop(1,"rgba(255,255,255,0)"),t.fillStyle=e,t.fillRect(0,0,64,64),Js=new Ol(i),Js.colorSpace=an,Js}function j2(i){const t=new Map,e=new Set,n=(L,I,B=0,X=0,H=0)=>{L.position.set(B,X,H),L.updateMatrixWorld(!0),L.traverse(it=>{const lt=it;if(!lt.isMesh)return;const dt=lt.material,vt=`${I}|${dt.uuid}|${lt.name}`,wt=lt.geometry.index?lt.geometry.toNonIndexed():lt.geometry.clone();for(const ot of Object.keys(wt.attributes))ot!=="position"&&ot!=="normal"&&ot!=="color"&&wt.deleteAttribute(ot);wt.applyMatrix4(lt.matrixWorld);let Ft=t.get(vt);Ft||(Ft={bone:I,mat:dt,name:lt.name,geos:[]},t.set(vt,Ft)),Ft.geos.push(wt)})},r=(L,I,B="")=>{e.add(L);const X=new It(L,I);return X.name=B,X},s=i.std({color:16777215,vertexColors:!0,roughness:.95,metalness:0,flatShading:!0,side:Ze,emissive:2771474,emissiveIntensity:1}),a=i.std({color:12894672,emissive:12894672,emissiveIntensity:.05,roughness:.75}),o=i.std({color:1315350,roughness:.5}),c=i.std({color:2236962,roughness:.8}),l=mr.map((L,I)=>{const B=new ui({color:L,emissive:L,emissiveIntensity:1.2,roughness:.3,metalness:.1});return B.name=`orn-${I}`,B});Y2(s);const h=i.std({color:1973794,roughness:.45,metalness:.1}),u=i.std({color:15762972,roughness:.45,metalness:.05}),d=i.std({color:15251514,emissive:16758810,emissiveIntensity:.25,roughness:.25,metalness:.85});for(const L of gs)n(r(q2(L),s),L.bone);const f=new Ne(.34,12,8),g=new pi(.035,.035,1,4);for(const[L,I,B,X]of a0){const H=gs[L],[it,lt]=xa(H.r0*.99,(I%jn+jn)%jn),dt=H.y0-Rh*.55,vt=B*1.2,wt=r(g,c);wt.scale.y=vt,n(wt,H.bone,it,dt-vt/2,lt),n(r(f,l[X],`orn-${X}`),H.bone,it,dt-vt-.3,lt)}const v=mr.map((L,I)=>{const B=new Cd({map:$2(),color:L,blending:Ro,depthWrite:!1,transparent:!0,opacity:.85,toneMapped:!1});return B.name=`halo-${I}`,B.userData.keepBlend=!0,B});for(const L of _a){const I=new B1(v[L.ci]);I.name=`halo-${L.ci}`,I.scale.setScalar(3.2),I.renderOrder=5,i.at(I,L.bone,...L.p)}n(r(new Eh(3,3,2.3,3,.8),a),"head",0,Ah.y-.05,vs-1.15);const m=(L,I,B,X)=>{i.at(L,"head",I,B,X).traverse(H=>{H.receiveShadow=!1})};for(const L of[1,-1]){const I=new It(new Ne(.16,10,8),o);I.scale.set(1,1.45,.5),I.name=L>0?"eyeL":"eyeR",m(I,L*Wl,Xl,vs+.02);const B=new It(new Ge(.74,.16,.1),o);B.rotation.z=L*.38,B.name=L>0?"browL":"browR",m(B,L*.62,17.92,vs+.04)}const p=new It(new Ge(.72,.12,.1),o);p.rotation.z=.12,p.name="mouth",m(p,.08,16.5,vs+.03);const y=new He,M=[2.4,2.25,2.45],b=r(new Ne(1,24,10,0,Math.PI*2,0,Math.PI/2),h);b.scale.set(...M),y.add(b);const w=.95;for(let L=0;L<4;L++){const I=r(new Ne(1,8,6,L*(Math.PI/2)+w/2,Math.PI/2-w,.1*Math.PI,.27*Math.PI),u);I.scale.set(M[0]*1.012,M[1]*1.012,M[2]*1.012),y.add(I)}const T=new Is([new ft(.96,0),new ft(1.08,0),new ft(1.08,.12),new ft(.96,.12),new ft(.96,0)],24),A=r(T,h);A.scale.set(M[0],1,M[2]*1.06),A.position.set(0,-.02,.1),y.add(A);const R=r(new Os(1,20),i.std({color:2762272,roughness:.9}));R.rotation.x=Math.PI/2,R.scale.set(M[0]*.99,M[2]*.99,1),R.position.y=.01,y.add(R);const x=new zd;for(let L=0;L<8;L++){const I=Math.PI/2+L*Math.PI/4,B=L%2?.24:.85;L?x.lineTo(Math.cos(I)*B,Math.sin(I)*B):x.moveTo(Math.cos(I)*B,Math.sin(I)*B)}const _=new _h(x,{depth:.12,bevelEnabled:!0,bevelThickness:.06,bevelSize:.05,bevelSegments:1}),S=.95,E=r(_,d);E.scale.setScalar(1.5),E.position.set(0,S,M[2]*Math.sqrt(1-(S/M[1])**2)+.02),E.rotation.x=-.45,y.add(E),y.position.y=-.8;const P=new He;P.add(y),P.rotation.set(.12,0,.36,"ZXY"),n(P,"head",0,gs[gs.length-1].y1,0);for(const L of t.values()){const I=i.segs.find(H=>H.name===L.bone).a,B=Th(L.geos);for(const H of L.geos)H.dispose();if(!B)throw new Error(`builder: parts on ${L.bone} would not merge`);B.translate(-I[0],-I[1],-I[2]);const X=new It(B,L.mat);X.name=L.name,i.at(X,L.bone,I[0],I[1],I[2]),L.mat===a&&(X.receiveShadow=!1)}for(const L of e)L.dispose()}const yf=new WeakMap,Z2=mr.map((i,t)=>({rate:1.3+.37*t,ph:t*1.9}));function J2(i,t,e){let n=yf.get(i);if(!n){const a={eyes:[],brows:[],mouth:null,balls:[],halos:[],lime:null,orn:[]},o=new Map,c=new Map;i.traverse(h=>{h.name==="eyeL"||h.name==="eyeR"?a.eyes.push(h):h.name==="browL"||h.name==="browR"?a.brows.push({o:h,y:h.position.y,z:h.rotation.z}):h.name==="mouth"&&(a.mouth=h);const u=h.material;if(u&&!Array.isArray(u)){const d=/^orn-(\d)$/.exec(u.name),f=/^halo-(\d)$/.exec(u.name);d&&o.set(Number(d[1]),u),f&&c.set(Number(f[1]),u),u.name==="lime"&&(a.lime=u)}}),a.balls=mr.map((h,u)=>o.get(u)).filter(Boolean),a.halos=mr.map((h,u)=>c.get(u)).filter(Boolean);const l=new Map;i.traverse(h=>{h.isBone&&l.set(h.name,h)});for(const h of _a){const u=l.get(h.bone),d=i0.find(f=>f.name===h.bone).a;u&&a.orn.push({bone:u,local:new N(h.p[0]-d[0],h.p[1]-d[1],h.p[2]-d[2]),ci:h.ci})}yf.set(i,n=a)}const r=Z2.map(a=>.55+.45*Math.sin(t*a.rate+a.ph)+.6*Math.max(0,Math.sin(t*a.rate*3.1+a.ph*2)-.85)*6);if(n.balls.forEach((a,o)=>{a.emissiveIntensity=.6+1.6*r[o]}),n.halos.forEach((a,o)=>{a.color.setHex(mr[o]).multiplyScalar(.35+.9*r[o])}),n.lime&&n.orn.length){const a=o0(n.lime);i.updateMatrixWorld(!0);const o=new N().setFromMatrixScale(i.matrixWorld);a.uOrnR.value=2.4*Math.abs(o.y),n.orn.forEach((c,l)=>{a.uOrnPos.value[l].copy(c.local).applyMatrix4(c.bone.matrixWorld),a.uOrnCol.value[l].setHex(mr[c.ci]).multiplyScalar(1.3*r[c.ci])})}const s=e??null;for(const a of n.eyes)a.scale.y=1.45*(1-.88*(s?a.name==="eyeL"?s.blinkL:s.blinkR:0));for(const a of n.brows)a.o.position.y=a.y+.22*(s?.browUp??0),a.o.rotation.z=a.z*(1-.7*(s?.browUp??0));n.mouth&&(n.mouth.scale.y=1+5*(s?.jaw??0),n.mouth.scale.x=1+.4*(s?.smile??0)-.35*(s?.pucker??0))}const K2={id:"builder",name:"Builder",blurb:"A builder in a Christmas tree costume, tipping his hat",segs:i0,dress:j2,tick:J2,fit:{size:1,limb:.2},face:{eyes:[[Wl,Xl,vs+.1,.26],[-Wl,Xl,vs+.1,.26]]}},Q2=[{name:"pelvis",a:[0,9.6,0],b:[0,10.6,0],parent:null},{name:"spine1",a:[0,10.6,0],b:[0,12.4,.1],parent:"pelvis"},{name:"spine2",a:[0,12.4,.1],b:[0,15,.1],parent:"spine1"},{name:"neck",a:[0,15,.1],b:[0,15.9,.15],parent:"spine2"},{name:"head",a:[0,15.9,.15],b:[0,18.4,.3],parent:"neck"},{name:"jaw",a:[0,16.5,-.3],b:[0,15.55,1],parent:"head",reach:0},{name:"tail1",a:[0,10.4,-1],b:[0,9.6,-1.1],parent:"pelvis",reach:0},{name:"tail2",a:[0,9.6,-1.1],b:[0,8.8,-1.2],parent:"tail1",reach:0},{name:"tail3",a:[0,8.8,-1.2],b:[0,8,-1.3],parent:"tail2",reach:0},{name:"tail4",a:[0,8,-1.3],b:[0,7.2,-1.4],parent:"tail3",reach:0},{name:"thighL",a:[1.1,9.6,0],b:[1.2,5.3,.2],parent:"pelvis"},{name:"shinL",a:[1.2,5.3,.2],b:[1.2,1.1,-.1],parent:"thighL"},{name:"footL",a:[1.2,1.1,-.1],b:[1.2,.35,1.4],parent:"shinL"},{name:"thighR",a:[-1.1,9.6,0],b:[-1.2,5.3,.2],parent:"pelvis"},{name:"shinR",a:[-1.2,5.3,.2],b:[-1.2,1.1,-.1],parent:"thighR"},{name:"footR",a:[-1.2,1.1,-.1],b:[-1.2,.35,1.4],parent:"shinR"},{name:"armL",a:[2.4,14.6,0],b:[2.72,11.9,-.05],parent:"spine2"},{name:"forearmL",a:[2.72,11.9,-.05],b:[2.85,9.45,.4],parent:"armL"},{name:"armR",a:[-2.4,14.6,0],b:[-2.72,11.9,-.05],parent:"spine2"},{name:"forearmR",a:[-2.72,11.9,-.05],b:[-2.85,9.45,.4],parent:"armR"}],Ma=i=>new N(i[0],i[1],i[2]);function c0(i,t){const e=Ma(t).sub(Ma(i)).normalize(),n=new N(1,0,0).addScaledVector(e,-e.x);n.lengthSq()<1e-6&&n.set(0,0,1),n.normalize();const r=new N().crossVectors(n,e);return new ie().makeBasis(n,e,r).setPosition(i[0],i[1],i[2])}const Ei=(i,t,e,n,r)=>Xi(i,t,e,n,r,6,5,2);function Xi(i,t,e,n,r,s=12,a=14,o=4){const c=Ma(t).distanceTo(Ma(i)),l=[];for(let u=0;u<=o;u++){const d=-Math.PI/2+u/o*(Math.PI/2);l.push(new ft(Math.max(.001,e*Math.cos(d)),e*.75*Math.sin(d)))}const h=Math.min(.2,1.3*Math.max(e,r)/c);for(let u=1;u<a;u++){const d=u/a,f=n+(e-n)*Math.exp(-((d/h)**2))+(r-n)*Math.exp(-(((1-d)/h)**2));l.push(new ft(f,d*c))}for(let u=0;u<=o;u++){const d=u/o*(Math.PI/2);l.push(new ft(Math.max(.001,r*Math.cos(d)),c+r*.75*Math.sin(d)))}return new Is(l,s).applyMatrix4(c0(i,t))}function Te(i,t,e=[1,1,1],n=12){return new Ne(t,n,Math.max(6,Math.round(n*.7))).scale(e[0],e[1],e[2]).translate(i[0],i[1],i[2])}function tM(i,t,e=24,n=8){return new Xo(new fs(i.map(Ma)),e,t,n,!1)}function ql(i,t,e=24,n=8){return[tM(i,t,e,n),Te(i[0],t,[1,1,1],n),Te(i[i.length-1],t,[1,1,1],n)]}function Dn(i){const t=Th(i.map(e=>e.index?e:e.toNonIndexed()),!1);for(const e of i)e.dispose();return t}const eM=i=>[-i[0],i[1],i[2]];function vr(i,t,e,n,r=6e4){const s=x=>(t.max[x]-t.min[x])*e/(e-7),a=x=>t.min[x]-2.5*s(x)/e,o=a(0)+s(0)/2,c=a(1)+s(1)/2,l=a(2)+s(2)/2,h=s(0)/2,u=s(1)/2,d=s(2)/2,f=new Kd(e,new Qi,!1,!1,r);f.isolation=50;const g=f.field,v=e,m=40;for(let x=0;x<v;x++){const _=l+(2*x/v-1)*d;for(let S=0;S<v;S++){const E=c+(2*S/v-1)*u;for(let P=0;P<v;P++){const L=o+(2*P/v-1)*h;g[x*v*v+S*v+P]=Math.max(0,Math.min(100,50-i(L,E,_)*m))}}}f.update();const p=f.count,y=f.positionArray,M=f.normalArray,b=new Float32Array(p*3),w=new Float32Array(p*3),T=n?new Float32Array(p*3):null,A=new Pt;for(let x=0;x<p;x++){const _=o+y[x*3]*h,S=c+y[x*3+1]*u,E=l+y[x*3+2]*d;b[x*3]=_,b[x*3+1]=S,b[x*3+2]=E;let P=M[x*3]/h,L=M[x*3+1]/u,I=M[x*3+2]/d;const B=Math.hypot(P,L,I)||1;P/=B,L/=B,I/=B,w[x*3]=P,w[x*3+1]=L,w[x*3+2]=I,T&&(A.setRGB(1,1,1),n(_,S,E,A),T[x*3]=A.r,T[x*3+1]=A.g,T[x*3+2]=A.b)}f.geometry.dispose();const R=new Se;return R.setAttribute("position",new ae(b,3)),R.setAttribute("normal",new ae(w,3)),T&&R.setAttribute("color",new ae(T,3)),R.computeBoundingSphere(),R}const Ks=(i,t,e)=>-rt(-i,-t,e),Ss=[.43,17.02,1.06],bf=[.43,16.99,.74];function l0(i,t,e,n,r){const s=Math.abs(i),o=e-n,c=r,l=Math.hypot(o,c),h=(s*o+(t-e)*c)/l;return Math.max(h,n-t)}function nM(i,t,e){const n=Math.abs(i);let r=Dt(i,t,e,0,17.45,-.12,1.1,1.13,1.32);r=rt(r,Dt(i,t,e,0,16.8,-.35,.98,.62,.95),.3),r=rt(r,Dt(i,t,e,0,16.68,.58,.8,.74,.72),.35),r=rt(r,Dt(n,t,e,.78,16.86,.55,.33,.3,.48),.22),r=rt(r,St(n,t,e,.86,16.8,.35,.98,16.68,-.42,.15,.13),.15),r=rt(r,St(n,t,e,.12,17.32,1.12,.78,17.36,.95,.17,.15),.2),r=Ks(r,-Dt(n,t,e,1.32,16.95,.05,.38,.5,.55),.18),r=Ks(r,-Dt(n,t,e,Ss[0],Ss[1],Ss[2],.36,.34,.5),.07);const s=Math.min(l0(i,t,16.86,16.42,.19),Math.hypot(n-.08,t-16.47)-.11);return r=Ks(r,-Math.max(s,.8-e),.04),r=Ks(r,16.08-t,.1),r=Ks(r,-Dt(n,t,e,.8,16.25,.62,.22,.3,.35),.12),r}function iM(i,t,e,n){const r=Math.abs(i),s=Dt(r,t,e,Ss[0],Ss[1],Ss[2],.42,.4,.56),a=Math.max(Math.min(l0(i,t,16.86,16.42,.19),Math.hypot(r-.08,t-16.47)-.11),.8-e)-.06,c=Math.max(0,Math.min(1,-Math.min(s,a)/.05))*(.75+.25*Math.max(0,Math.min(1,(1.2-e)/.4)));n.copy(lM).lerp(hM,c),c===0&&n.multiplyScalar(.94+.06*Math.max(0,Math.min(1,(t-16.3)/1.2)))}function rM(i,t,e,n,r,s,a){const o=r-e,c=s-n,l=Math.max(0,Math.min(1,((i-e)*o+(t-n)*c)/(o*o+c*c)));return Math.hypot(i-e-o*l,t-n-c*l)-a}function sM(i,t,e){const n=Math.abs(i);let r=St(n,t,e,0,15.62,1,.5,15.66,.66,.17,.17);return r=rt(r,St(n,t,e,.5,15.66,.66,.78,15.74,-.12,.17,.16),.1),r=rt(r,Math.max(rM(t,e,15.74,-.14,16.4,-.3,.2),Math.abs(n-.8)-.07),.08),r=rt(r,Dt(n,t,e,.82,16.45,-.3,.15,.11,.13),.06),r=rt(r,Dt(i,t,e,0,15.6,1,.33,.21,.17),.1),r=rt(r,St(n,t,e,0,15.8,1.02,.52,15.8,.62,.12,.12),.08),r}function aM(i,t,e){const n=Math.abs(i),r=Math.abs(Math.hypot(n-.25,t-10.95,e-.75)-1.4)-.09;let s=Math.max(r,Dt(n,t,e,1.2,10.5,-.18,.78,.7,.85));return s=rt(s,St(n,t,e,.6,11,-.45,1.55,11.05,.2,.1,.1),.12),s=rt(s,Dt(i,t,e,0,9.95,-.78,.48,.72,.22),.15),s=rt(s,St(n,t,e,.38,10.35,-.72,.85,10.4,-.45,.17,.15),.12),s=rt(s,St(n,t,e,1.25,10.15,-.15,1,9.62,0,.24,.24),.15),s=rt(s,Le(n,t,e,.92,9.6,0,.32),.12),s=Math.min(s,Math.hypot(Math.hypot(t-9.6,e)-.36,n-1)-.1),s=rt(s,St(n,t,e,.95,9.48,.28,.12,9.3,.72,.15,.14),.1),s=rt(s,St(n,t,e,.12,9.32,.72,.1,9.02,.66,.15,.15),.1),s=rt(s,St(n,t,e,1,9.38,-.2,.78,8.92,-.05,.18,.17),.1),s=rt(s,St(n,t,e,.78,8.92,-.05,.12,9.04,.62,.13,.12),.1),s}function kc(i,t,e,n,r){return[new pi(t,t*1.08,e,12).translate(i[0],i[1],i[2]),new Ge(n,e*.42,.18).translate(i[0],i[1]+.02,i[2]-t*.6),new Ge(.15,e*.55,r).rotateX(.35).translate(i[0],i[1]-.05,i[2]-t-r*.42)]}function Sf(i){const t=[],e=[1.05,1.42,1.64,1.76,1.8,1.74,1.6],n=[.95,1.06,1.12,1.14,1.12,1.06,.96],r=[.32,.48,.62,.72,.8,.85,.85];for(let s=0;s<7;s++){const a=14.55-s*.4,o=e[s],c=.98,l=n[s],h=s>=5,u=[[.26,a+.04,-.78]],d=h?.74*Math.PI:Math.PI-Math.asin(Math.min(.9,.42/o));for(let f=0;f<=7;f++){const g=.14*Math.PI+f/7*(d-.14*Math.PI),v=-Math.cos(g)*(g<Math.PI/2?c:l),m=a-r[s]*Math.pow((g-.14*Math.PI)/(.86*Math.PI),1.3);u.push([o*Math.sin(g),m,v])}if(h){const f=u[u.length-1];u.push([.62,f[1]+.25+(s-5)*.2,1.02],[.26,12.62,1.06])}else u.push([.24,u[u.length-1][1]+.04,l*.98]);t.push(...ql(u.map(f=>[f[0]*i,f[1],f[2]]),s===0?.13:.12,28,7))}return t}function oM(i,t){const e=c0(i,[i[0]+t[0],i[1]+t[1],i[2]+t[2]]),n=1.35,r=(u,d,f)=>{const g=new N(u*n,d*n,f*n).applyMatrix4(e);return[g.x,g.y,g.z]},s=[];for(const[u,d,f]of[[0,.1,.16],[0,.1,-.02],[0,.1,-.2],[.02,.3,.2],[.02,.3,0],[.02,.3,-.18]])s.push(Te(r(u,d,f),.14,[1,1,1],8));const a=[[.21,1],[.07,1.08],[-.07,1],[-.2,.82]];for(const[u,d]of a){const f=r(.02,.4,u*.85),g=r(0,.4+.55*d,u),v=r(-.07,.4+.92*d,u*1.05),m=r(-.17,.4+1.15*d,u*1.08),p=r(-.28,.4+1.3*d,u*1.08);s.push(Ei(f,g,.1,.075,.105),Ei(g,v,.1,.07,.095),Ei(v,m,.09,.065,.085),Ei(m,p,.08,.06,.065))}const o=r(0,.25,.26),c=r(-.05,.6,.48),l=r(-.1,.88,.58),h=r(-.16,1.08,.62);return s.push(Ei(o,c,.11,.085,.1),Ei(c,l,.1,.075,.09),Ei(l,h,.09,.065,.065)),s}function cM(){const i=[];i.push(Te([1.2,.88,0],.27)),i.push(Te([1.24,.44,-.3],1,[.27,.32,.44]));for(const[s,a,o]of[[.98,.62,.36],[1.22,.62,.34],[1.46,.55,.22],[1.08,.55,.6],[1.32,.52,.56]])i.push(Te([s,a,o],.17,[1,1,1],8));const t=[.95,1.12,1.28,1.42,1.55],e=[.84,1.08,1.3,1.5,1.68],n=[.1,.075,.07,.065,.065],r=[.42,.34,.3,.27,.24];for(let s=0;s<5;s++){const a=[t[s],.5,.62],o=[e[s],.22,1.38-s*.05];i.push(Ei(a,o,n[s]*1.3,n[s],n[s]*1.35));const c=[o[0]+(s===0?-.02:.02*s),.15,o[2]+r[s]];i.push(Ei(o,c,n[s]*1.05,n[s]*.8,n[s]*.85))}return i}const h0=15656396,lM=new Pt(h0),hM=new Pt(1905164),uM=5832490;function fM(i){const t=i.std({color:h0,roughness:.42,metalness:0,emissive:2894368,emissiveIntensity:1}),e=i.std({color:16777215,vertexColors:!0,roughness:.42,metalness:0,emissive:2894368,emissiveIntensity:1}),n=i.std({color:1182214,roughness:.9}),r=i.std({color:0,emissive:uM,emissiveIntensity:1,roughness:1}),s=(f,g,v=t)=>{for(const m of["L","R"]){const p=new It(f,v);p.name=`skelly-${g}${m}`,m==="R"&&(p.scale.x=-1),i.at(p,g+m,0,0,0)}},a=(f,g,v=t,m=`skelly-${g}`)=>{const p=new It(f,v);return p.name=m,i.at(p,g,0,0,0),p},o=vr(nM,{min:[-1.25,15.95,-1.5],max:[1.25,18.65,1.4]},52,iM,4e4);a(o,"head",e);const c=Dn([Te(bf,.1,[1,1.1,.7],10),Te(eM(bf),.1,[1,1.1,.7],10)]);a(c,"head",r,"skelly-embers");const l=(f,g,v,m,p)=>{const y=[];for(let M=0;M<10;M++){const b=-1.05+M/9*2.1;y.push(new gh(.075,g,2,7).scale(1,1,.75).rotateY(b).translate(v*Math.sin(b),f,p+m*Math.cos(b)))}return y};a(Dn(l(16.15,.17,.6,.78,.47)),"head",t,"skelly-teeth"),a(Dn([Te([0,15.98,.8],1,[.58,.24,.4])]),"head",n,"skelly-mouth"),a(vr(sM,{min:[-1,15.36,-.55],max:[1,16.6,1.22]},36,void 0,12e3),"jaw"),a(Dn(l(15.88,.15,.56,.74,.47)),"jaw",t,"skelly-lowerteeth"),a(Dn([0,1,2,3].flatMap(f=>kc([0,15.12+f*.25,-.22],.25,.19,.72,.3))),"neck"),a(Dn([...[0,1,2,3,4,5].flatMap(f=>kc([0,12.55+f*.4,-.82],.25,.26,.6,.28)),...Sf(1),...Sf(-1),Te([0,13.55,1.08],1,[.26,1.05,.12],12),Te([0,14.42,1],1,[.36,.32,.13],10),...ql([[.22,14.72,1.02],[.85,14.86,.9],[1.55,14.98,.42],[2.18,15.02,.02]],.13,20,8),...ql([[-.22,14.72,1.02],[-.85,14.86,.9],[-1.55,14.98,.42],[-2.18,15.02,.02]],.13,20,8),Te([1.25,13.95,-1],1,[.62,.85,.09],12),Te([-1.25,13.95,-1],1,[.62,.85,.09],12)]),"spine2"),a(Dn([0,1,2,3].flatMap(f=>kc([0,10.85+f*.42,-.42],.36,.3,1.15,.45))),"spine1"),a(vr(aM,{min:[-1.75,8.72,-1.05],max:[1.75,11.2,1.05]},40,void 0,24e3),"pelvis"),s(Dn([Te([2.33,14.56,-.03],.36),Xi([2.4,14.45,0],[2.71,12.08,-.05],.3,.2,.28),Te([2.53,11.98,-.05],.21,[1,.9,1],10),Te([2.88,11.98,-.06],.2,[1,.9,1],10)]),"arm");const h=[2.72,11.9,-.05],u=[2.85,9.45,.4],d=[u[0]-h[0],u[1]-h[1],u[2]-h[2]];s(Dn([Te([2.74,11.98,-.25],.21,[1,1.1,1],10),Xi([2.76,11.85,-.2],[2.86,9.62,.22],.19,.13,.16,10),Xi([2.66,11.72,.12],[2.86,9.62,.54],.16,.13,.21,10),...oM([u[0],u[1]-.05,u[2]],d)]),"forearm"),s(Dn([Te([1.12,9.62,.02],.36),Xi([1.12,9.6,0],[1.55,9.24,-.03],.2,.18,.2,10),Te([1.64,9.3,-.08],.3,[1,1.2,1]),Xi([1.56,9.22,0],[1.22,5.62,.18],.28,.21,.34),Te([1,5.5,.12],.29),Te([1.42,5.5,.12],.29)]),"thigh"),s(Dn([Xi([1.19,5.12,.18],[1.16,1.28,-.08],.36,.18,.24),Te([1,1.16,-.05],.17,[1,1.2,1],10),Xi([1.52,4.95,.02],[1.47,1.3,-.16],.16,.09,.17,10),Te([1.2,5.36,.62],.27,[1,1.1,.55])]),"shin"),s(Dn(cM()),"foot")}const wf=new WeakMap,dM={id:"skeleton",name:"Skelly",blurb:"Bones, a grin, and green embers for eyes",segs:Q2,dress:fM,fit:{size:1.04,limb:.3},face:{eyes:[[.43,17.02,1.3,.36],[-.43,17.02,1.3,.36]]},tick(i,t,e){let n=wf.get(i);if(!n){const s=[];i.traverse(a=>{a.name==="skelly-embers"&&s.push(a.material)}),n={jaw:i.getObjectByName("jaw")??null,embers:s},wf.set(i,n)}const r=.95+.3*Math.sin(t*2.1)+.1*Math.sin(t*7.3+1.1);for(const s of n.embers)s.emissiveIntensity=r;if(n.jaw){const s=t%4.6;n.jaw.rotation.x=e&&e.jaw>.05?.02+.55*e.jaw:s<.75?.05+.07*Math.abs(Math.sin(s*25)):.02}}},pM=[{name:"pelvis",a:[0,9.6,0],b:[0,10.6,0],parent:null},{name:"spine1",a:[0,10.6,0],b:[0,12.4,.1],parent:"pelvis"},{name:"spine2",a:[0,12.4,.1],b:[0,15,.1],parent:"spine1"},{name:"neck",a:[0,15,.1],b:[0,15.9,.15],parent:"spine2",reach:.8},{name:"head",a:[0,15.9,.15],b:[0,18.4,.3],parent:"neck"},{name:"jaw",a:[0,16.4,.9],b:[0,16.4,1.2],parent:"head",reach:0},{name:"tail1",a:[0,14.8,-1.2],b:[0,12.6,-1.4],parent:"spine2",reach:0},{name:"tail2",a:[0,12.6,-1.4],b:[0,10.4,-1.6],parent:"tail1",reach:0},{name:"tail3",a:[0,10.4,-1.6],b:[0,8.2,-1.8],parent:"tail2",reach:0},{name:"tail4",a:[0,8.2,-1.8],b:[0,6.2,-2],parent:"tail3",reach:0},{name:"thighL",a:[1.1,9.6,0],b:[1.2,5.3,.2],parent:"pelvis"},{name:"shinL",a:[1.2,5.3,.2],b:[1.2,1.1,-.1],parent:"thighL"},{name:"footL",a:[1.2,1.1,-.1],b:[1.2,.35,1.4],parent:"shinL"},{name:"thighR",a:[-1.1,9.6,0],b:[-1.2,5.3,.2],parent:"pelvis"},{name:"shinR",a:[-1.2,5.3,.2],b:[-1.2,1.1,-.1],parent:"thighR"},{name:"footR",a:[-1.2,1.1,-.1],b:[-1.2,.35,1.4],parent:"shinR"},{name:"armL",a:[2.5,14.55,0],b:[2.95,11.95,-.05],parent:"spine2"},{name:"forearmL",a:[2.95,11.95,-.05],b:[3.12,9.6,.35],parent:"armL"},{name:"armR",a:[-2.5,14.55,0],b:[-2.95,11.95,-.05],parent:"spine2"},{name:"forearmR",a:[-2.95,11.95,-.05],b:[-3.12,9.6,.35],parent:"armR"}],mM={min:[-4.2,-.5,-1.9],max:[4.2,17.1,2.3]},gM=[3.12,9.6,.35],u0=(i,t,e)=>St(i,t,e,3.05,10.55,.2,3.16,9,.45,.3,.3);function Ch(i,t,e){const n=Math.abs(i);let r=4;if(t>8.4&&(r=Dt(i,t,e,0,13,.05,1.74,2.15,1.2),r=rt(r,Dt(i,t,e,0,11.35,.15,1.62,1.1,1.12),.5),t>13.2&&(r=rt(r,St(n,t,e,0,15,-.05,2.15,14.62,0,.5,.56),.5),r=rt(r,Math.hypot(Math.hypot(i,(e+.02)*1.15)-.78,t-15.18)-.2,.12),r=rt(r,St(i,t,e,0,14.9,.05,0,15.6,.12,.62,.55),.2)),t<11.6&&(r=rt(r,Dt(i,t,e,0,10.05,0,1.78,1.05,1.15),.4))),t<10.9&&(r=rt(r,St(n,t,e,1.08,9.6,0,1.2,5.3,.15,.88,.74),.35),t<6.4&&(r=rt(r,St(n,t,e,1.2,5.3,.15,1.22,2.1,-.05,.74,.7),.25))),n>1.5&&t>8.8){const s=St(n,t,e,2.5,14.55,0,2.95,11.95,-.05,.6,.55);r=t>14?rt(r,s,.3):Math.min(r,s),t<12.9&&(r=rt(r,St(n,t,e,2.95,11.95,-.05,3.08,10,.28,.55,.52),.25),r=Math.max(r,-u0(n,t,e)))}if(t<3.4){const s=rt(St(n,t,e,1.22,2.3,-.05,1.22,.6,-.05,.5,.52),Math.max(Dt(n,t,e,1.22,.5,.55,.58,.5,1.3),-t),.3);r=Math.min(r,s)}return r}const Yl=0,f0=1,vM=2,d0=3,xM=4;function p0(i,t,e){const n=Math.abs(i);return u0(n,t,e)<.06?xM:t<2.25&&n>.4?vM:t>15.38&&n<.8?d0:n>2.1&&t>9.2||t>10.72?Yl:f0}const _M=`
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
  }`;function MM(){const i=new ui({vertexColors:!0,roughness:.88,metalness:0});return i.onBeforeCompile=t=>{t.vertexShader=t.vertexShader.replace("#include <common>",`#include <common>
 attribute vec3 aCloth; varying vec3 vCloth; varying vec3 vBind; varying vec3 vBindN;`).replace("#include <begin_vertex>",`#include <begin_vertex>
 vBind = position; vBindN = normal; vCloth = aCloth;`),t.fragmentShader=t.fragmentShader.replace("#include <common>",`#include <common>
`+_M).replace("#include <color_fragment>",`#include <color_fragment>
 diffuseColor.rgb = cloth(diffuseColor.rgb, vBind, normalize(vBindN), vCloth);`)},i.customProgramCacheKey=()=>"jack-cloth-v2",i}const ke=[0,17.15,.22],yM=1.82,qn=1.38,m0=.24;function Lh(i,t,e){const n=i-ke[0],r=t-ke[1],s=e-ke[2],a=Math.hypot(n,s),o=Math.atan2(s,n),c=1-Math.sqrt(Math.abs(Math.cos(5*(o-Math.PI/2)))),l=1-.06*c;let h=(Math.hypot(a/l/yM,r/qn)-1)*qn;return h+=.32*Math.exp(-((a/.6)**2))*Math.min(1,Math.abs(r)/qn),{d:h,groove:c}}function Ef(i,t,e,n,r,s,a=0){const o=(n+r)/2,c=Math.cos(a),l=Math.sin(a),h=(i-e)*c-(t-o)*l,u=(i-e)*l+(t-o)*c+o,d=n-r,f=Math.hypot(d,s);return Math.max((Math.abs(h)*d+(u-n)*s)/f,r-u)}const Tf=(i,t,e,n,r,s)=>(Math.hypot((i-e)/r,(t-n)/s)-1)*Math.min(r,s),Af=(i,t,e,n,r,s)=>{const a=Math.abs(i-e)-r,o=Math.abs(t-n)-s;return Math.hypot(Math.max(a,0),Math.max(o,0))+Math.min(Math.max(a,o),0)};function bM(i,t){const e=Math.abs(i);let n=Ef(e,t,.66,.74,.14,.36,-.12);n=Math.min(n,Ef(i,t,0,.1,-.2,.17));let r=Math.max(Tf(i,t,0,-.36,1.2,.64),-Tf(i,t,0,-.08,1.34,.56));return r=Math.max(r,-Af(e,t,.32,-.7,.11,.12)),r=Math.max(r,-Af(i,t,0,-.93,.12,.13)),Math.min(n,r)}function SM(i,t,e){const n=Lh(i,t,e).d;let r=Math.max(n,-(n+m0));const s=Math.max(bM(i-ke[0],t-ke[1]),ke[2]+.4-e);return r=Math.max(r,-s),r}const wM=new Pt(15233038),EM=new Pt(10108936),TM=new Pt(16757820),AM=new Pt(16737290);function RM(i,t,e,n){const{d:r,groove:s}=Lh(i,t,e);if(r<-.05){n.copy(TM).lerp(AM,Math.max(0,Math.min(1,(t-ke[1]-qn*.2)/(qn*.8))));return}n.copy(wM).lerp(EM,Math.min(1,s*1.3)),n.multiplyScalar(.85+.15*(1-Math.abs(t-ke[1])/qn))}function CM(i){const t=i.std({color:16777215,vertexColors:!0,roughness:.5,metalness:0,emissive:16777215,emissiveIntensity:1});return t.onBeforeCompile=e=>{e.vertexShader=e.vertexShader.replace("#include <common>",`#include <common>
 attribute float aGlow; varying float vGlow;`).replace("#include <begin_vertex>",`#include <begin_vertex>
 vGlow = aGlow;`),e.fragmentShader=e.fragmentShader.replace("#include <common>",`#include <common>
 varying float vGlow;`).replace("#include <color_fragment>",`#include <color_fragment>
 vec3 glowHue = diffuseColor.rgb; diffuseColor.rgb *= 1.0 - 0.92 * vGlow;`).replace("#include <emissivemap_fragment>",`#include <emissivemap_fragment>
 totalEmissiveRadiance *= vGlow * glowHue;`)},t.customProgramCacheKey=()=>"jack-shell-v2",t}let Ao=1;const un=()=>(Ao=Ao*1664525+1013904223>>>0,Ao/4294967296),LM=new N(0,1,0),Rf=[15255146,13937738,15916172,12884540].map(i=>new Pt(i));function Qs(i,t,e,n){const r=new Pa(n,e,4,1).translate(0,e/2,0);r.applyQuaternion(new We().setFromUnitVectors(LM,t.clone().normalize())).translate(i.x,i.y,i.z);const s=Rf[Math.floor(un()*Rf.length)],a=r.attributes.position.count,o=new Float32Array(a*3);for(let c=0;c<a;c++)o[c*3]=s.r,o[c*3+1]=s.g,o[c*3+2]=s.b;return r.setAttribute("color",new ae(o,3)),r}function ta(i,t){const e=i.clone().normalize(),n=Math.abs(e.y)<.9?new N(0,1,0):new N(1,0,0),r=new N().crossVectors(e,n).normalize(),s=new N().crossVectors(e,r),a=un()*Math.PI*2,o=Math.tan(t*Math.sqrt(un()));return e.addScaledVector(r,Math.cos(a)*o).addScaledVector(s,Math.sin(a)*o).normalize()}function Si(i){const t=Th(i.map(e=>e.index?e.toNonIndexed():e),!1);for(const e of i)e.dispose();return t}function zc(i,t){let e=0,n=3;for(let r=0;r<30;r++){const s=(e+n)/2;Ch(i,t,s)<0?e=s:n=s}return e}function Cf(i,t,e){let n=0,r=3;for(let s=0;s<26;s++){const a=(n+r)/2;Ch(Math.cos(t)*a,i,e+Math.sin(t)*a)<0?n=a:r=a}return n}function xo(i,t,e,n){const r=Math.max(8,Math.round(t*18)),s=new Xo(i,r,e,7,n),a=s.attributes.uv,o=a.count,c=new Float32Array(o*3),l=new Pt(13150312),h=new Pt(9071160),u=new Pt;for(let d=0;d<o;d++){const f=.5+.5*Math.sin((a.getX(d)*t*4.5+a.getY(d))*Math.PI*2);u.copy(l).lerp(h,f*f),c[d*3]=u.r,c[d*3+1]=u.g,c[d*3+2]=u.b}return s.setAttribute("color",new ae(c,3)),s}function PM(i){Ao=7;const t=i.bones.get("pelvis").parent;if(t?.isSkinnedMesh){const ot=t.geometry.attributes.position,V=new Float32Array(ot.count*3);for(let Z=0;Z<ot.count;Z++){const k=p0(ot.getX(Z),ot.getY(Z),ot.getZ(Z));V[Z*3]=k===Yl?1:0,V[Z*3+1]=k===f0?1:0,V[Z*3+2]=k===d0?1:0}t.geometry.setAttribute("aCloth",new ae(V,3)),t.material.dispose(),t.material=MM()}const e=i.std({color:16777215,vertexColors:!0,roughness:.75,metalness:0}),n=i.std({color:16777215,vertexColors:!0,roughness:.9,metalness:0}),r=(ot,V,Z,k)=>{for(const G of["L","R"]){const z=new It(ot,Z);z.name=`jack-${k}${G}`,G==="R"&&(z.scale.x=-1),i.at(z,V+G,0,0,0)}},s=vr(SM,{min:[-1.92,ke[1]-qn-.05,ke[2]-1.92],max:[1.92,ke[1]+qn+.05,ke[2]+1.92]},48,RM,4e4),a=s.attributes.position,o=new Float32Array(a.count);for(let ot=0;ot<a.count;ot++)o[ot]=Math.max(0,Math.min(1,-Lh(a.getX(ot),a.getY(ot),a.getZ(ot)).d/.16));s.setAttribute("aGlow",new ae(o,1));const c=new It(s,CM(i));c.name="jack-pumpkin",i.at(c,"head",0,0,0);const l=ke[1]-qn+m0+.3,h=new He;h.name="jack-flame";const u=new It(Si([new Ne(.15,10,8).scale(1,1.1,1).translate(0,.15,0),new Pa(.148,.42,10,1,!0).translate(0,.36,0)]),i.std({color:0,emissive:16762976,emissiveIntensity:2.4}));u.name="jack-flamecore",h.add(u),i.at(h,"head",0,l,ke[2]-.15);const d=ke[1]+qn-.22,f=new pi(.16,.26,1.5,7,8).translate(0,.75,0);{const ot=f.attributes.position;for(let V=0;V<ot.count;V++){const Z=ot.getY(V)/1.5,k=1+.6*Math.max(0,1-Z*5);ot.setXYZ(V,ot.getX(V)*k+.5*Z*Z,ot.getY(V),ot.getZ(V)*k-.1*Z*Z)}f.computeVertexNormals()}i.at(new It(f.translate(0,d,ke[2]-.05),i.std({color:5990956,roughness:.85})),"head",0,0,0);const g=i.std({color:4863526,roughness:.95,side:Ze}),v=[];for(let ot=0;ot<=10;ot++){const V=1.08+ot/10*1.12;v.push(new ft(V,-.22*((V-1.08)/1.12)**2))}const m=[];for(let ot=0;ot<=10;ot++){const V=ot/10;m.push(new ft(1.1-.24*V-(V>.85?(V-.85)*3.6:0),V*1.2))}const p=Si([new Is(v,28),new Is(m,28)]);{const ot=p.attributes.position;for(let V=0;V<ot.count;V++){const Z=ot.getX(V),k=ot.getY(V),G=ot.getZ(V),z=k>.7?.2*Math.exp(-((Z/.5)**2))*Math.max(0,G):0;ot.setXYZ(V,Z,k-.07*Math.max(0,Z)*Math.max(0,Math.hypot(Z,G)-1.08)-z*.6,G-z)}p.computeVertexNormals()}const y=new bs(1.07,.08,6,28).rotateX(Math.PI/2).scale(1,2.4,1).translate(0,.2,0),M=new He;M.add(new It(p,g),new It(y,i.std({color:1971986,roughness:.8}))),M.rotation.set(-.08,0,-.2),i.at(M,"head",.08,ke[1]+qn-.1,ke[2]-.1);const b=[];for(let ot=0;ot<34;ot++){const V=ot/34*Math.PI*2+un()*.15,Z=.72,k=new N(Math.cos(V)*Z,15.3+un()*.1,Math.sin(V)*Z*.9),G=ta(new N(Math.cos(V)*.9,.7,Math.sin(V)*.9),.35);b.push(Qs(k,G,.45+un()*.5,.05))}const w=new It(Si(b),e);w.name="jack-collar",i.at(w,"spine2",0,0,0);const T=new N(2.95,11.95,-.05),A=new N(...gM),R=A.clone().sub(T).normalize(),x=[];for(let ot=0;ot<46;ot++){const V=un()*Math.PI*2,Z=.26*Math.sqrt(un()),k=new N(Math.cos(V)*Z,0,Math.sin(V)*Z),G=A.clone().addScaledVector(R,.55).add(k);x.push(Qs(G,ta(R.clone().addScaledVector(k,1.4),.3),.8+un()*.9,.055))}r(Si(x),"forearm",e,"hand");const _=[];for(let ot=0;ot<26;ot++){const V=ot/26*Math.PI*2+un()*.2,Z=new N(1.22+Math.cos(V)*.62,2.2+un()*.12,-.05+Math.sin(V)*.62);_.push(Qs(Z,ta(new N(Math.cos(V),-1.1,Math.sin(V)),.3),.4+un()*.45,.05))}r(Si(_),"shin",e,"ankle");const S=[];for(let ot=0;ot<14;ot++){const V=ot/14*Math.PI*2,Z=Cf(15.62,V,.1)+.04;S.push(new N(Math.cos(V)*Z,15.62,.1+Math.sin(V)*Z))}i.at(new It(xo(new fs(S,!0),3.6,.09,!0),n),"neck",0,0,0);const E=10.72,P=[];for(let ot=0;ot<24;ot++){const V=ot/24*Math.PI*2,Z=Cf(E,V,.05)+.06;P.push(new N(Math.cos(V)*Z,E,.05+Math.sin(V)*Z))}const L=new fs(P,!0),I=.55,B=zc(I,E)+.1,X=new fs([new N(I,E-.05,B),new N(I+.12,E-.6,B+.12),new N(I+.05,E-1.25,B+.08)]),H=new fs([new N(I,E-.05,B),new N(I-.12,E-.5,B+.14),new N(I-.02,E-1,B+.1)]),it=[];for(const ot of[X,H]){const V=ot.getPoint(1);for(let Z=0;Z<7;Z++)it.push(Qs(V,ta(new N(0,-1,.1),.35),.22+un()*.2,.035))}const lt=new Ne(.22,10,8).scale(1.2,.9,.8).translate(I,E,B),dt=new Float32Array(lt.attributes.position.count*3),vt=new Pt(11571288);for(let ot=0;ot<dt.length;ot+=3)dt[ot]=vt.r,dt[ot+1]=vt.g,dt[ot+2]=vt.b;lt.setAttribute("color",new ae(dt,3)),i.at(new It(Si([xo(L,11,.13,!0),xo(X,1.3,.1,!1),xo(H,1,.1,!1),lt]),n),"pelvis",0,0,0),i.at(new It(Si(it),e),"pelvis",0,0,0);const wt=[],Ft=[];for(const ot of[14.25,13.45,12.65]){const V=zc(.13,ot);wt.push(new pi(.12,.12,.07,10).rotateX(Math.PI/2).translate(.13,ot,V+.02))}for(let ot=0;ot<5;ot++)Ft.push(Qs(new N(.13,13.05,zc(.13,13.05)-.05),ta(new N(.4,.3,1),.4),.35+un()*.25,.035));i.at(new It(Si(wt),i.std({color:2759698,roughness:.5})),"spine2",0,0,0),i.at(new It(Si(Ft),e),"spine2",0,0,0)}const DM=(i,t,e,n)=>i.name.startsWith("thigh")?n>-1.6&&e<i.a[1]+.8&&Math.abs(Math.abs(t)-Math.abs(i.a[0]))<(e<i.a[1]+.3?1.3:.9):i.name.startsWith("arm")||i.name.startsWith("forearm")?Math.abs(t)>(e<12?2.2:e<14.1?1.88:2.1):!0,Lf=new WeakMap,IM={id:"pumpkin",name:"Jack",blurb:"A scarecrow with a candle-lit pumpkin head",segs:pM,body:{sdf:Ch,region:p0,box:mM,palette:[9181716,2307418,3810326,11044954,1708556],surface:"soft",weights:"sharp",capture:DM},dress:PM,fit:{size:1.08,limb:.6},face:{eyes:[[.66,17.75,2.02,.38],[-.66,17.75,2.02,.38]]},res:76,tick(i,t,e){let n=Lf.get(i);if(!n){const o=[],c=[];i.traverse(l=>{l.name==="jack-pumpkin"&&o.push(l.material),l.name==="jack-flamecore"&&c.push(l.material)}),n={shell:o,core:c,flame:i.getObjectByName("jack-flame")??null},Lf.set(i,n)}const r=.5*Math.sin(t*1.7)+.3*Math.sin(t*7.9+1.3)+.22*Math.sin(t*13.3+.4)+.15*Math.sin(t*23.7+2.2),s=Math.max(0,Math.sin(t*.83+.5)-.92)*6,a=Math.max(.35,1+.36*r-s)*(1+1.3*(e?.jaw??0));for(const o of n.shell)o.emissiveIntensity=a;for(const o of n.core)o.emissiveIntensity=2.4*a;n.flame&&(n.flame.scale.set(1-.08*r,a*(1+.12*Math.sin(t*17)),1-.08*r),n.flame.rotation.z=.12*Math.sin(t*5.3))}},ya=[1.2,7.9,0],Sn=[1.32,4.5,.15],wn=[1.32,1.35,-.1],Pf=[1.32,1,2],Yi=[2.55,12.1,0],cn=[3.4,9.7,-.1],Gn=[3.95,7.4,.15],Di=9.4,xr=6.1,No=2.9,ni=i=>[-i[0],i[1],i[2]],Me=[0,13.6,.25],Hc=[1.9,1.95,1.8],gn=1.1,Yo=i=>[Me[0]+(i[0]-Me[0])*gn,Me[1]+(i[1]-Me[1])*gn,Me[2]+(i[2]-Me[2])*gn],sn=[.88,14.55,1.5],je=[.5,.62,.44],ba=[0,13.2,1.3],Fo=i=>ba[1]-.13*(i-ba[2]),ns=Yo(sn),Df=je[0]*gn,UM=Yo(ba),NM=[{name:"pelvis",a:[0,7.9,0],b:[0,8.9,0],parent:null},{name:"spine1",a:[0,8.9,0],b:[0,10.3,.05],parent:"pelvis"},{name:"spine2",a:[0,10.3,.05],b:[0,11.5,.05],parent:"spine1"},{name:"neck",a:[0,11.5,.05],b:[0,11.9,.1],parent:"spine2"},{name:"head",a:[0,11.9,.1],b:[0,15.3,.4],parent:"neck"},{name:"jaw",a:UM,b:Yo([0,12.85,3.75]),parent:"head",reach:0},{name:"tail1",a:[0,6.5,-1.2],b:[0,6,-2],parent:"pelvis",reach:1.3},{name:"tail2",a:[0,6,-2],b:[0,5.6,-2.6],parent:"tail1",reach:1.2},{name:"tail3",a:[0,5.6,-2.6],b:[0,5.35,-3],parent:"tail2",reach:1},{name:"tail4",a:[0,5.35,-3],b:[0,5.2,-3.3],parent:"tail3",reach:.9},{name:"thighL",a:ya,b:Sn,parent:"pelvis"},{name:"shinL",a:Sn,b:wn,parent:"thighL"},{name:"footL",a:wn,b:Pf,parent:"shinL"},{name:"thighR",a:ni(ya),b:ni(Sn),parent:"pelvis"},{name:"shinR",a:ni(Sn),b:ni(wn),parent:"thighR"},{name:"footR",a:ni(wn),b:ni(Pf),parent:"shinR"},{name:"armL",a:Yi,b:cn,parent:"spine2"},{name:"forearmL",a:cn,b:Gn,parent:"armL"},{name:"armR",a:ni(Yi),b:ni(cn),parent:"spine2"},{name:"forearmR",a:ni(cn),b:ni(Gn),parent:"armR"}],FM={min:[-4.6,.5,-3.8],max:[4.6,18.3,2.5]},En=(i,t,e)=>{const n=Math.min(1,Math.max(0,(e-i)/(t-i)));return n*n*(3-2*n)},Un=(i,t,e)=>{const n=Math.sin(i*127.1+t*311.7+e*74.7)*43758.5453;return n-Math.floor(n)};function OM(i,t,e){const n=Math.floor(i),r=Math.floor(t),s=Math.floor(e),a=i-n,o=t-r,c=e-s,l=a*a*(3-2*a),h=o*o*(3-2*o),u=c*c*(3-2*c),d=(f,g,v)=>f+(g-f)*v;return d(d(d(Un(n,r,s),Un(n+1,r,s),l),d(Un(n,r+1,s),Un(n+1,r+1,s),l),h),d(d(Un(n,r,s+1),Un(n+1,r,s+1),l),d(Un(n,r+1,s+1),Un(n+1,r+1,s+1),l),h),u)}function g0(i,t,e){if(t<6.5)return 7.3-t;if(t>13.4)return t-12.6;const n=Math.abs(i);let r=Dt(i,t,e,0,10,.1,1.85,2.4,1.5);return r=rt(r,Dt(i,t,e,0,10.8,.4,1.5,1.25,1.2),.6),r=rt(r,Dt(i,t,e,0,11.45,0,2,1,1.35),.7),r=rt(r,Le(n,t,e,2.25,11.85,0,.68),.5),rt(r,Dt(i,t,e,0,8.3,-.1,1.6,1,1.35),.6)}function v0(i,t,e){return t>Di+.6||t<xr-.6?Math.max(t-Di,xr-t):Math.max(x0(i,t,e),t-Di,xr-t)}function x0(i,t,e){const n=Math.min(1,Math.max(0,(Di-t)/(Di-xr))),r=1-(1-n)*(1-n),s=1+.025*r*Math.cos(Math.atan2(i,e)*12),a=(1.7+.8*r)*s,o=(1.42+.72*r)*s,c=.05-.1*r;return(Math.hypot(i/a,(e-c)/o)-1)*Math.min(a,o)}const BM=[[0,.25,2.1,.45],[.42,.05,1.6,.55],[-.42,.05,1.6,.55],[.22,-.4,1.75,.85],[-.22,-.4,1.75,.85]];function kM(i,t,e){const n=Math.abs(i);let r=Dt(i,t,e,Me[0],Me[1],Me[2],Hc[0],Hc[1],Hc[2]);if(r=rt(r,Dt(n,t,e,.9,13,.7,1.05,.9,1),.5),t>14.6)for(const[s,a,o,c]of BM)r=rt(r,St(i,t,e,s*.5,15,a,s*1.4,15.2+o,a-c,.45,.08),.4);return Math.max(r,-Dt(n,t,e,sn[0],sn[1],sn[2],je[0]+.05,je[1]+.05,je[2]+.05))}const zM=(i,t,e,n)=>n(Me[0]+(i-Me[0])/gn,Me[1]+(t-Me[1])/gn,Me[2]+(e-Me[2])/gn)*gn;function _0(i,t,e){return t<10.6?11.4-t:zM(i,t,e,kM)}function M0(i,t,e){if(i<1)return 1.7-i;if(t>13.4)return t-12.8;if(t<4.6)return 5.2-t;let n=St(i,t,e,...Yi,...cn,.6,.56);const r=1.75;n=rt(n,St(i,t,e/r,cn[0],cn[1],cn[2]/r,Gn[0],Gn[1],Gn[2]/r,.5,.4),.45);for(let s=0;s<4;s++){const a=-.75+s*.5,o=1.2+.35*(1-Math.abs(a)/.75);n=rt(n,St(i,t,e,Gn[0]-.05,Gn[1]+.5,a*.8+.1,Gn[0]+.12,Gn[1]-o,a*1.1+.15,.32,.12),.25)}return n}function y0(i,t,e){if(t>9.4)return t-8.7;if(i>3)return i-2.1;let n=St(i,t,e,...ya,...Sn,.75,.55);return n=rt(n,Le(i,t,e,...Sn,.57),.3),rt(n,St(i,t,e,...Sn,...wn,.53,.42),.3)}function b0(i,t,e){if(e>0)return e+.85;if(t>7.6)return t-6.9;let n=1e9;for(const r of[-1,0,1]){const s=1-Math.abs(r);n=rt(n,St(i,t,e,r*.25,6.5,-1.2,r*.7,5.4-s*.2,-3-s*.3,.38,.14),.3)}return n}function HM(i,t,e){const n=Math.abs(i);let r=rt(g0(i,t,e),_0(i,t,e),.8);return r=rt(r,y0(n,t,e),.55),r=rt(r,M0(n,t,e),.05+.5*En(10.9,11.8,t)),Math.min(r,v0(i,t,e),b0(i,t,e))}const Ri=0,_r=1,Sa=2,wa=3,ws=4,Oo=5,ai=new Float64Array(6);let If=NaN,Uf=NaN,Nf=NaN,Bo=0;function $o(i,t,e){if(i===If&&t===Uf&&e===Nf)return Bo;const n=Math.abs(i);ai[Ri]=g0(i,t,e),ai[_r]=v0(i,t,e),ai[Sa]=_0(i,t,e),ai[wa]=M0(n,t,e),ai[ws]=y0(n,t,e),ai[Oo]=b0(i,t,e);let r=0;for(let s=1;s<6;s++)ai[s]<ai[r]&&(r=s);return If=i,Uf=t,Nf=e,Bo=r,r}const VM=.25,Qe=i=>ai[i]<=ai[Bo]+VM,GM=(i,t,e,n)=>{$o(t,e,n);const r=i.name,s=r.endsWith("L")?1:r.endsWith("R")?-1:0;return s!==0&&t*s<-.05?!1:r==="pelvis"?Qe(Ri)||Qe(_r)||Qe(Oo)||Qe(ws):r==="spine1"?Qe(Ri)||Qe(_r):r==="spine2"?Qe(Ri):r==="neck"?Qe(Ri)||Qe(Sa):r==="head"?Qe(Sa):r==="jaw"||r.startsWith("foot")?!1:r.startsWith("tail")?Qe(Oo):r.startsWith("arm")||r.startsWith("forearm")?Qe(wa)&&(Bo===wa||e>11.3):r.startsWith("shin")?Qe(ws):r.startsWith("thigh")?Qe(ws)?!0:Qe(_r)&&n>-.4&&e<ya[1]+.8&&Math.abs(Math.abs(t)-ya[0])<1.35:!0},S0=12166120,WM=14998264,XM=1578014,qM=10126548,w0=16053239,E0=1315352,$l=(i,t)=>(t>0?11.2+.55*En(.15,1,i):11.65)-.6*En(1.35,1.9,i),YM=new Pt(w0),Ff=new Pt(E0),$M=new Pt(S0).multiplyScalar(1/1.6),jM=(i,t,e)=>1-En(t-e,t+e,Math.abs(i));function ZM(i,t,e,n,r){r.copy(YM),i===Ri&&r.lerp($M,En($l(Math.abs(t),n)-.05,$l(Math.abs(t),n)+.08,e)),r.lerp(Ff,jM(e-(Di-.15),.27,.08)),i===_r&&r.lerp(Ff,(1-En(xr+.4,xr+.56,e))*(x0(t,e,n)>-.12?1:0))}function Of(i,t,e){const r=Math.floor(i/.8),s=Math.floor(t/(.8*1.4)),a=Math.floor(e/.8);for(let o=-1;o<=1;o++)for(let c=-1;c<=1;c++)for(let l=-1;l<=1;l++){const h=r+c,u=s+o,d=a+l;if(Un(h,u,d)>.45)continue;const f=(h+.2+.6*Un(h+7,u,d))*.8,g=(u+.2+.6*Un(h,u+7,d))*.8*1.4,v=(d+.2+.6*Un(h,u,d+7))*.8;if(((i-f)/.44)**2+((t-g)/.75)**2+((e-v)/.44)**2<1)return!0}return!1}function T0(i,t,e){const n=Math.abs(i),r=$o(i,t,e);if(r===_r)return t<xr+.48||t>Di-.45?3:2;if(r===Ri){const s=$l(n,e);return t>s+.3?t>11.2&&n>1.5&&Of(i,t,e)?1:0:t>s-.05?2:t<Di+.12&&t>Di-.42?3:2}if(r===Sa){const s=Me[1]+(t-Me[1])/gn,a=Me[2]+(e-Me[2])/gn;return s>15.2||s>14.2&&a<-.6?5:0}if(r===wa){if(t<6.6)return 6;const s=t>cn[1]?Yi[0]+(cn[0]-Yi[0])*(Yi[1]-t)/(Yi[1]-cn[1]):cn[0]+(Gn[0]-cn[0])*Math.min(1,(cn[1]-t)/(cn[1]-Gn[1]));return n-s>-.25&&Of(i,t,e)?1:0}return r===ws&&t<No-.05?4:0}function JM(i,t,e){const n=T0(i,t,e);if(n===2||n===3||n===4)return 0;const r=$o(i,t,e),s=Math.abs(i),a=.6+.8*OM(i*1.4+3.1,t*1.4,e*1.4);let o=1;if(r===Sa){const c=s/gn,l=Me[1]+(t-Me[1])/gn,h=Me[2]+(e-Me[2])/gn,u=Math.hypot((c-sn[0])/je[0],(l-sn[1])/je[1],(h-sn[2])/je[2]);if(u<1.5||h>.95&&c<1.15&&l<13.95&&l>12.2)return 0;const d=En(.2,1.2,h)*(1-En(1,1.6,c))*(1-En(15.2,15.6,l));o=.3*Math.min(1,(u-1.5)/.8)*d+1.3*(1-d),l>15.2?o=1.5:l<12.6&&h>.3&&(o=Math.min(o,.25))}else if(r===Ri)o=(t>11?1.25:.9)*(e>0?1-.55*(1-En(.5,1.2,s)):1);else if(r===wa){const c=En(-.4,.4,-e)*.4+En(-.2,.3,Yi[0]+.6-s)*.4;o=(t<7.2?1.3:1)+c}else r===ws?o=t<No+.7?1.25:.9:r===Oo&&(o=1.2);return n===1&&(o*=1.2),o*a}const A0=(i,t,e)=>rt(St(i/1.5,t,e,0,13.55,1.2,0,13.05,3.85,.7,.4)*.88,St(i/1.3,t,e,0,13.85,1,0,13.5,2.7,.42,.32),.4),KM=(i,t,e)=>Math.max(A0(i,t,e),Fo(e)-t),R0=(i,t,e)=>St(i/1.42,t,e,0,13.1,1.2,0,12.8,3.65,.55,.32)*.9,QM=(i,t,e)=>Math.max(R0(i,t,e),t-Fo(e)+.03),ty=new Pt(4211536),ey=new Pt(8817306),jl=5903396,ny=13130354,Bf=i=>(t,e,n,r)=>{const s=(i?R0:A0)(Math.abs(t)+.09,e,n)<0&&n<3.6;!i&&s&&e<Fo(n)+.05?r.setHex(jl):i&&s&&e>Fo(n)-.08?r.setHex(Math.abs(t)<.35&&n>1.7?ny:jl):r.copy(ty).lerp(ey,En(2.9,4.1,n))};function iy(i,t,e){const n=wn[1];let r=Math.max(Dt(i,t,e,0,.32-n,.65,.84,.4,1.72),-(t+n));return r=rt(r,Dt(i,t,e,0,.78-n,.55,.74,.6,1.5),.2),r=rt(r,Dt(i,t,e,0,.62-n,1.5,.7,.46,.85),.25),r=rt(r,St(i,t,e,0,.95-n,-.2,0,1.4-n,-.15,.62,.6),.3),Math.max(r,-St(i,t,e,0,1.4-n,-.15,0,3-n,-.15,.47,.47))}function ry(i,t,e,n){const r=t+wn[1];r<.42||e>1.75&&r<.9?n.setHex(16448252):Math.abs(i)<.3&&e>.25&&e<1.55&&r>1?n.setHex(16777215):Math.abs(r-.47)<.05?n.setHex(12105924):n.setHex(14474468)}function sy(){const e=new Uint8Array(65536);for(let r=0;r<128;r++)for(let s=0;s<128;s++){const a=(r+.5)/128,o=(s+.5)/128*Math.PI*2,h=((a*2.6-.38*Math.abs(Math.sin(o)))%.85+.85)%.85<.4&&a<.84;e.set(h?[168,142,224,255]:[246,244,250,255],(r*128+s)*4)}const n=new ys(e,128,128,Xe);return n.colorSpace=an,n.wrapS=Cs,n.magFilter=_e,n.minFilter=qi,n.generateMipmaps=!0,n.needsUpdate=!0,n}function ea(i,t,e,n="head"){t.scale.multiplyScalar(gn);const r=Yo(e);i.at(t,n,r[0],r[1],r[2])}function ay(i){const t=i.std({color:16514047,roughness:.15}),e=i.std({color:2761284,roughness:.1}),n=i.std({color:328712,roughness:.06}),r=i.std({color:1314840,roughness:.5}),s=i.std({color:16777215,emissive:16777215,emissiveIntensity:.8,roughness:.2});for(const A of[1,-1]){const R=new He;R.scale.set(1,je[1]/je[0],je[2]/je[0]),R.add(new It(new Ne(je[0],22,16),t));const x=new He;x.rotation.set(.12,-A*.14,0);for(const[E,P,L]of[[e,.012,.62],[n,.02,.3]]){const I=new It(new Ne(je[0]+P,22,6,0,Math.PI*2,0,L),E);I.rotation.x=Math.PI/2,x.add(I)}const _=new It(new Ne(.07,8,6),s);_.position.set(A*.1,.12,je[0]+.02),x.add(_),R.add(x);const S=new It(new bs(je[0]+.01,.055,6,24,Math.PI*.8),r);S.rotation.set(.45,0,Math.PI*.1),R.add(S),ea(i,R,[A*sn[0],sn[1],sn[2]])}const a=i.std({color:14263361,roughness:.32,metalness:.65}),o=.76,c=sn[2]+je[2]+.14,l=.3,h=new He;for(const A of[1,-1]){const R=new It(new bs(o,.12,12,48),a);R.rotation.y=A*l,R.position.set(A*sn[0],0,c),h.add(R);const x=new N(A*(sn[0]+o*Math.cos(l)),.05,c-o*Math.sin(l)),_=new N(A*1.84,.05,-.2),S=new It(new pi(.07,.07,x.distanceTo(_),8),a);S.quaternion.setFromUnitVectors(new N(0,1,0),_.clone().sub(x).normalize()),S.position.copy(x).add(_).multiplyScalar(.5),h.add(S)}const u=new It(new bs(sn[0]-o*Math.cos(l),.1,8,16,Math.PI),a);u.position.set(0,.05,c+o*Math.sin(l)),h.add(u),ea(i,h,[0,sn[1],0]);const d=i.std({vertexColors:!0,roughness:.55,metalness:.02}),f=new It(vr(KM,{min:[-1.15,12.45,.9],max:[1.15,14.35,4.35]},34,Bf(!1),12e3),d);f.position.set(-0,-13.6,-.25);const g=new It(vr(QM,{min:[-.85,12.45,.9],max:[.85,13.25,4]},30,Bf(!0),1e4),d);g.position.set(-0,-13.6,-.25);const v=new He;v.add(f),ea(i,v,Me);const m=new He;m.add(g),ea(i,m,Me,"jaw");const p=new It(new Ne(1,16,10),i.std({color:jl,roughness:.6}));p.scale.set(.6,.36,.55),ea(i,p,[0,ba[1]-.05,ba[2]+.35]);const y=new ui({map:sy(),roughness:.85,side:Ze}),M=1.2,b=A=>Sn[2]+(wn[2]-Sn[2])*(Sn[1]-A)/(Sn[1]-wn[1]);for(const[A,R]of[["shinL",1],["shinR",-1]]){const x=new N(R*Sn[0],M,b(M)),_=new N(R*Sn[0],No,b(No)),S=new It(new pi(.6,.53,x.distanceTo(_),40,1,!0),y);S.quaternion.setFromUnitVectors(new N(0,1,0),_.clone().sub(x).normalize());const E=x.add(_).multiplyScalar(.5);i.at(S,A,E.x,E.y,E.z)}const w=vr(iy,{min:[-.95,-wn[1]-.05,-1.2],max:[.95,.75,2.45]},26,ry,1e4),T=i.std({vertexColors:!0,roughness:.55});for(const[A,R]of[["footL",1],["footR",-1]])i.at(new It(w,T),A,R*wn[0],wn[1],wn[2])}const oy={id:"violet",name:"Violet",blurb:"The Valkyries’ lavender raven, in gold glasses",segs:NM,body:{sdf:HM,region:T0,box:FM,palette:[S0,XM,w0,E0,16184570,WM,qM],surface:"soft",capture:GM,fur:{length:1,density:4.5,tip:.3},furLen:JM,tint(i,t,e,n,r){const s=$o(t,e,n);(i===2||i===3)&&(s===Ri||s===_r)&&ZM(s,t,e,n,r),i>=2&&i<=4&&r.multiplyScalar(1.6),i!==2&&i!==3&&n<-.6&&r.multiplyScalar(1-.12*Math.min(1,(-.6-n)/1.5))}},dress:ay,fit:{size:1.1,limb:.55},idle:{tail:.12},face:{jaw:.45,eyes:[[ns[0],ns[1],ns[2],Df],[-ns[0],ns[1],ns[2],Df]]},res:72,furShells:9},Cr=[{name:"pelvis",a:[0,9.6,0],b:[0,10.6,0],parent:null},{name:"spine1",a:[0,10.6,0],b:[0,12.4,.1],parent:"pelvis"},{name:"spine2",a:[0,12.4,.1],b:[0,15,.1],parent:"spine1"},{name:"neck",a:[0,15,.1],b:[0,15.9,.15],parent:"spine2",reach:.8},{name:"head",a:[0,15.9,.15],b:[0,18.4,.3],parent:"neck"},{name:"jaw",a:[0,16.4,.9],b:[0,16.4,1.2],parent:"head",reach:0},{name:"tail1",a:[0,14.8,-1.2],b:[0,12.6,-1.4],parent:"spine2",reach:1},{name:"tail2",a:[0,12.6,-1.4],b:[0,10.4,-1.6],parent:"tail1",reach:1},{name:"tail3",a:[0,10.4,-1.6],b:[0,8.2,-1.8],parent:"tail2",reach:1},{name:"tail4",a:[0,8.2,-1.8],b:[0,6.2,-2],parent:"tail3",reach:1},{name:"thighL",a:[1.1,9.6,0],b:[1.2,5.3,.2],parent:"pelvis"},{name:"shinL",a:[1.2,5.3,.2],b:[1.2,1.1,-.1],parent:"thighL"},{name:"footL",a:[1.2,1.1,-.1],b:[1.2,.35,1.4],parent:"shinL"},{name:"thighR",a:[-1.1,9.6,0],b:[-1.2,5.3,.2],parent:"pelvis"},{name:"shinR",a:[-1.2,5.3,.2],b:[-1.2,1.1,-.1],parent:"thighR"},{name:"footR",a:[-1.2,1.1,-.1],b:[-1.2,.35,1.4],parent:"shinR"},{name:"armL",a:[2.4,14.6,0],b:[2.72,11.9,-.05],parent:"spine2"},{name:"forearmL",a:[2.72,11.9,-.05],b:[2.85,9.45,.4],parent:"armL"},{name:"armR",a:[-2.4,14.6,0],b:[-2.72,11.9,-.05],parent:"spine2"},{name:"forearmR",a:[-2.72,11.9,-.05],b:[-2.85,9.45,.4],parent:"armR"}],Lr={min:[-4.2,-.4,-2.8],max:[4.2,20.4,2.6]};function cy(i,t,e,n){const r=Math.abs(i),s=1-.08*n;let a=Dt(i,t,e,0,13.35,.1,1.8*s,1.95,1.05*s);return a=rt(a,Dt(r,t,e,.85*s,13.75,.75,.95*s,.68,.5),.45),a=rt(a,Dt(i,t,e,0,13.75,-.35,1.95*s,1.3,.62),.4),a=rt(a,St(r,t,e,0,15.35,-.2,1.85*s,14.95,-.1,.5,.36),.5),a=rt(a,Dt(i,t,e,0,11.6,.12,1.35*s,1.45,.92*s),.6),a=rt(a,Dt(i,t,e,0,10,0,1.68*s,1,1.02*s),.6),a=rt(a,Dt(r,t,e,.72,9.55,-.5,.82*s,.85,.62),.4),a=Math.max(a,-St(i,t,e,0,14.6,-1.12,0,10.6,-.98,.16,.14)),a=rt(a,St(i,t,e,0,14.9,-.05,0,16.3,.12,.6,.52),.4),a=rt(a,Dt(i,t,e,0,17.3,.1,.95,1.12,1.08),.3),a=rt(a,Dt(i,t,e,0,16.55,.4,.74,.74,.82),.35),a=rt(a,Dt(r,t,e,2.3*s,14.5,0,.7*s,.92,.78),.4),a=rt(a,St(r,t,e,2.4,14.4,0,2.72,11.95,-.05,.56*s,.42*s),.3),a=rt(a,Dt(r,t,e,2.56,13.15,.12,.5*s,.95,.5*s),.3),a=rt(a,St(r,t,e,2.72,11.9,-.05,2.85,9.6,.38,.46*s,.3*s),.25),a=rt(a,Dt(r,t,e,2.76,11.2,.05,.48*s,.8,.48*s),.3),a=rt(a,Dt(r,t,e,2.87,9,.48,.24,.52,.42),.2),a=rt(a,St(r,t,e,2.8,9.35,.75,2.72,8.85,.95,.15,.12),.12),a=rt(a,St(r,t,e,1.02,9.6,0,1.15,5.45,.2,.9*s,.56*s),.45),a=rt(a,Dt(r,t,e,1.12,7.7,.28,.8*s,1.6,.72*s),.4),a=rt(a,Dt(r,t,e,.8,8.3,0,.55*s,1.3,.6),.4),a=rt(a,Le(r,t,e,1.17,5.3,.32,.52*s),.3),a=rt(a,St(r,t,e,1.18,5.25,.15,1.2,1.15,-.1,.5*s,.3*s),.3),a=rt(a,Dt(r,t,e,1.2,3.95,-.28,.56*s,1.3,.6*s),.35),a=rt(a,Math.max(Dt(r,t,e,1.2,.5,.55,.46,.5,1.25),-t),.25),a}function Pr(i,t,e,n,r=0){const s=Math.abs(i);let a=cy(i,t,e,0);return a=rt(a,Dt(i,t,e,0,17.3,.12,1.08,1.24,1.18),.25),a=rt(a,Dt(i,t,e,0,16.5,.45,.82,.72,.86),.25),a=rt(a,St(i,t,e,0,18.42,-.7,0,18.5,.85,.16,.12),.2),a=rt(a,Dt(i,t,e,0,10.55,.05,1.55,.38,1.1),.15),a=rt(a,Dt(i,t,e,0,10.55,1.05,.55,.42,.22),.1),a=rt(a,St(s,t,e,2.82,10.25,.3,2.86,9.5,.42,.4,.38),.15),a=rt(a,St(s,t,e,1.2,3.2,-.05,1.2,1,-.08,.52,.48),.2),a-r}function Dr(i,t,e,n){const r=Math.abs(i);if(t>16.75&&t<17.5&&e>.9&&r<.95)return 2;if(Math.abs(t-10.6)<.45&&e>-1.5)return 3;if(t<3.2||t<10.4&&r>2.3&&t>8.2)return 1;if(e>.7&&r<1.7){const s=t-12.6-r*.55;if(s>0&&s<.35||s>.75&&s<1.1)return 1}return 0}const ly=[{name:"pelvis",a:[0,9.4,-.6],b:[0,10.4,0],parent:null},{name:"spine1",a:[0,10.4,0],b:[0,12.6,.8],parent:"pelvis"},{name:"spine2",a:[0,12.6,.8],b:[0,14.8,1.9],parent:"spine1"},{name:"neck",a:[0,14.8,1.9],b:[0,16,3],parent:"spine2",reach:1.6},{name:"head",a:[0,16,3],b:[0,16.6,5.8],parent:"neck"},{name:"jaw",a:[0,15.5,3.9],b:[0,15.3,6.6],parent:"head",reach:.8},{name:"tail1",a:[0,9.2,-1.6],b:[0,8.2,-3.6],parent:"pelvis",reach:1.8},{name:"tail2",a:[0,8.2,-3.6],b:[0,6.8,-5.2],parent:"tail1",reach:1.8},{name:"tail3",a:[0,6.8,-5.2],b:[0,5.3,-6.4],parent:"tail2",reach:1.6},{name:"tail4",a:[0,5.3,-6.4],b:[0,4,-7.2],parent:"tail3",reach:1.4},{name:"thighL",a:[1.6,9.2,-.3],b:[1.9,6,1.3],parent:"pelvis"},{name:"shinL",a:[1.9,6,1.3],b:[1.9,2.8,-.9],parent:"thighL"},{name:"footL",a:[1.9,2.8,-.9],b:[1.9,.4,1],parent:"shinL"},{name:"thighR",a:[-1.6,9.2,-.3],b:[-1.9,6,1.3],parent:"pelvis"},{name:"shinR",a:[-1.9,6,1.3],b:[-1.9,2.8,-.9],parent:"thighR"},{name:"footR",a:[-1.9,2.8,-.9],b:[-1.9,.4,1],parent:"shinR"},{name:"armL",a:[2.7,14.3,1.6],b:[3.3,11.2,2],parent:"spine2"},{name:"forearmL",a:[3.3,11.2,2],b:[3.2,8.2,3.2],parent:"armL"},{name:"armR",a:[-2.7,14.3,1.6],b:[-3.3,11.2,2],parent:"spine2"},{name:"forearmR",a:[-3.3,11.2,2],b:[-3.2,8.2,3.2],parent:"armR"}],hy={min:[-5,-.5,-8.6],max:[5,20.4,8.6]},pn=[.62,17.05,4.75],kf=[0,16.35,7.35];function uy(i,t,e,n=0){const r=Math.abs(i);let s=Dt(i,t,e,0,13.4,1.4,2.6,2.5,2.1);s=rt(s,Dt(i,t,e,0,11.2,.4,1.7,1.6,1.4),.9),s=rt(s,Dt(i,t,e,0,9.8,-.4,2,1.2,1.5),.7),s=rt(s,Dt(i,t,e,0,15.1,1.6,2.3,1.5,2),.8),s=rt(s,Le(r,t,e,2.5,14.2,1.5,1.05),.7);let a=Dt(i,t,e,0,16.9,3.6,1.35,1.25,1.55);a=rt(a,St(i,t,e,0,16.7,4.6,0,16.3,7.1,.82,.45),.5),a=rt(a,St(i,t,e,0,15.8,4.4,0,15.75,6.7,.55,.32),.35),a=rt(a,Dt(r,t,e,1.15,16.5,3.6,.55,.75,.9),.4),a=rt(a,St(r,t,e,.75,17.8,3.1,1.05,19.4,2.7,.5,.06),.3),a=Math.max(a,-Le(r,t,e,pn[0],pn[1],pn[2]+.12,.3)),s=rt(s,a,.6),s=rt(s,St(r,t,e,2.7,14.3,1.6,3.3,11.2,2,.9,.72),.5),s=rt(s,St(r,t,e,3.3,11.2,2,3.2,8.4,3.1,.78,.55),.35),s=rt(s,Dt(r,t,e,3.2,7.9,3.35,.55,.75,.55),.3),s=rt(s,St(r,t,e,1.6,9.2,-.3,1.9,6,1.3,1.25,.85),.6),s=rt(s,St(r,t,e,1.9,6,1.3,1.9,2.8,-.9,.75,.48),.4),s=rt(s,St(r,t,e,1.9,2.8,-.9,1.9,.5,.9,.5,.42),.3);const o=[[0,9.2,-1.6,.6],[0,8.2,-3.6,1],[0,6.8,-5.2,1.15],[0,5.3,-6.4,.9],[0,4,-7.2,.35]];for(let c=0;c+1<o.length;c++){const l=o[c],h=o[c+1];s=rt(s,St(i,t,e,l[0],l[1],l[2],h[0],h[1],h[2],l[3],h[3]),.5)}s-=n;for(const c of[-1.5,-.5,.5,1.5])s=rt(s,St(r,t,e,3.2+c*.17,7.4,3.5,3.2+c*.22,6.5,3.85,.17,.03),.1);for(const c of[-1,0,1])s=rt(s,St(r,t,e,1.9+c*.28,.4,1.2,1.9+c*.34,.1,1.85,.2,.03),.1);return s}function C0(i,t,e){const n=Math.abs(i);return Math.hypot(i,t-kf[1],e-kf[2])<.45||t<7.6&&t>6.2&&e>3.4&&n>2.6||t<.5&&e>1.2?3:t>17.4&&n>.6&&e<3.2||e<-6.3?2:t>15.4&&t<16.4&&e>4.4||t>14.6&&t<15.8&&e>2.8&&n<1.2||e>2.2&&t>10.2&&t<15&&n<1.8?1:t>12.4&&e<.8&&n<1.9&&t>12.4+.5*n?2:0}function fy(i,t,e){const n=Math.abs(i);return C0(i,t,e)===3||Math.hypot(n-pn[0],t-pn[1],e-pn[2])<.65?0:e>4.6&&t>15.2?.35:t>17.6?.4:t>14&&t<16.4&&e<3.4||e<-1.4&&t<9.6?1.4:t<3?.45:1}const dy=[{name:"pelvis",a:[0,7.6,-.4],b:[0,8.8,0],parent:null},{name:"spine1",a:[0,8.8,0],b:[0,10.8,.3],parent:"pelvis"},{name:"spine2",a:[0,10.8,.3],b:[0,12.6,.6],parent:"spine1"},{name:"neck",a:[0,12.6,.6],b:[0,15.6,1.3],parent:"spine2",reach:1.9},{name:"head",a:[0,15.6,1.3],b:[0,17.6,2.4],parent:"neck"},{name:"jaw",a:[0,15.9,2.6],b:[0,15.7,4.4],parent:"head",reach:.7},{name:"tail1",a:[0,7.4,-2.6],b:[0,6.8,-3.6],parent:"pelvis",reach:1.4},{name:"tail2",a:[0,6.8,-3.6],b:[0,6.2,-4.5],parent:"tail1",reach:1.4},{name:"tail3",a:[0,6.2,-4.5],b:[0,5.7,-5.2],parent:"tail2",reach:1.2},{name:"tail4",a:[0,5.7,-5.2],b:[0,5.3,-5.7],parent:"tail3",reach:1},{name:"thighL",a:[1.4,7.4,0],b:[1.5,4.6,.3],parent:"pelvis"},{name:"shinL",a:[1.5,4.6,.3],b:[1.5,.9,-.2],parent:"thighL"},{name:"footL",a:[1.5,.9,-.2],b:[1.5,.3,1.8],parent:"shinL"},{name:"thighR",a:[-1.4,7.4,0],b:[-1.5,4.6,.3],parent:"pelvis"},{name:"shinR",a:[-1.5,4.6,.3],b:[-1.5,.9,-.2],parent:"thighR"},{name:"footR",a:[-1.5,.9,-.2],b:[-1.5,.3,1.8],parent:"shinR"},{name:"armL",a:[2.7,11.6,.2],b:[3.3,9.2,-.1],parent:"spine2"},{name:"forearmL",a:[3.3,9.2,-.1],b:[3.2,7,.3],parent:"armL"},{name:"armR",a:[-2.7,11.6,.2],b:[-3.3,9.2,-.1],parent:"spine2"},{name:"forearmR",a:[-3.3,9.2,-.1],b:[-3.2,7,.3],parent:"armR"}],py={min:[-5,-.4,-7.2],max:[5,21.4,6.6]},mn=[.72,17.25,2.75];function my(i,t,e,n=0){const r=Math.abs(i);let s=Dt(i,t,e,0,9.2,-.2,3.3,3.5,3);s=rt(s,Dt(i,t,e,0,11.4,.5,2.5,2.2,2.3),1),s=rt(s,St(i,t,e,0,12.2,.5,0,15.8,1.4,1.25,.95),.8);let a=Le(i,t,e,0,16.9,1.8,1.55);a=rt(a,St(i,t,e,0,16.55,2.9,0,16.1,5,.72,.18),.3),a=rt(a,St(i,t,e,0,15.85,2.8,0,15.75,4.4,.5,.14),.25);for(const[o,c]of[[0,1],[.6,.82],[-.6,.82]])a=rt(a,St(i,t,e,o*.5,18.1,1.6,o*1.3,18.1+2.7*c,1-.7*c,.34,.12),.3);a=Math.max(a,-Le(r,t,e,mn[0],mn[1],mn[2],.5)),s=rt(s,a,.5),s=rt(s,Dt(r,t,e,3,9.8,0,.75,2.6,1.7),.7);for(const o of[-1,0,1])s=rt(s,St(r,t,e,3.2,8.4,o*.6,3.25,6.6+Math.abs(o)*.4,o*.75+.2,.42,.14),.3);for(const o of[-1,0,1])s=rt(s,St(i,t,e,o*.3,7.6,-2.6,o*1.1,7+(1-Math.abs(o))*.5,-5.6,.5,.2),.4);s=rt(s,St(r,t,e,1.4,7.4,0,1.5,4.8,.3,1,.55),.5),s=rt(s,St(r,t,e,1.5,4.8,.3,1.5,1,-.2,.42,.36),.25),s-=n;for(const o of[-1,0,1])s=rt(s,St(r,t,e,1.5,.5,.1,1.5+o*.85,.3,2-Math.abs(o)*.3,.34,.16),.2);return s=rt(s,St(r,t,e,1.5,.5,-.2,1.5,.3,-1.1,.3,.14),.15),s}function L0(i,t,e){const n=Math.abs(i);return t>15.6&&t<17.1&&e>2.6&&n<.85||t<5&&n>.9&&n<2.6||t<1?3:t>18.4||e<-4.6?2:e>1.2&&t>9.4&&t<13.4&&n<1.8||e>2.2&&t>16.2&&t<18.2&&n<1.25?1:0}function gy(i,t,e){const n=Math.abs(i),r=L0(i,t,e);return r===3||Math.hypot(n-mn[0],t-mn[1],e-mn[2])<.9?0:r===2?.6:t>16?.45:t>14.6&&e>1.6?.3:t>12.2?1.25:e<-2.4?1.4:1}const Ph=[{name:"pelvis",a:[0,9.2,0],b:[0,10.4,0],parent:null},{name:"spine1",a:[0,10.4,0],b:[0,12.4,.1],parent:"pelvis"},{name:"spine2",a:[0,12.4,.1],b:[0,15.4,.2],parent:"spine1"},{name:"neck",a:[0,15.4,.2],b:[0,16.2,.3],parent:"spine2",reach:.9},{name:"head",a:[0,16.2,.3],b:[0,18.4,.6],parent:"neck"},{name:"jaw",a:[0,16.4,1.2],b:[0,16.4,1.6],parent:"head",reach:0},{name:"tail1",a:[0,9.2,-.5],b:[0,9,-1],parent:"pelvis",reach:0},{name:"tail2",a:[0,9,-1],b:[0,8.8,-1.5],parent:"tail1",reach:0},{name:"tail3",a:[0,8.8,-1.5],b:[0,8.6,-2],parent:"tail2",reach:0},{name:"tail4",a:[0,8.6,-2],b:[0,8.4,-2.5],parent:"tail3",reach:0},{name:"thighL",a:[2.1,9.2,0],b:[2.3,5.2,.3],parent:"pelvis"},{name:"shinL",a:[2.3,5.2,.3],b:[2.3,1.2,-.1],parent:"thighL"},{name:"footL",a:[2.3,1.2,-.1],b:[2.3,.4,1.8],parent:"shinL"},{name:"thighR",a:[-2.1,9.2,0],b:[-2.3,5.2,.3],parent:"pelvis"},{name:"shinR",a:[-2.3,5.2,.3],b:[-2.3,1.2,-.1],parent:"thighR"},{name:"footR",a:[-2.3,1.2,-.1],b:[-2.3,.4,1.8],parent:"shinR"},{name:"armL",a:[4.1,14.7,.2],b:[4.5,11.6,.4],parent:"spine2"},{name:"forearmL",a:[4.5,11.6,.4],b:[4.5,8.4,1],parent:"armL"},{name:"armR",a:[-4.1,14.7,.2],b:[-4.5,11.6,.4],parent:"spine2"},{name:"forearmR",a:[-4.5,11.6,.4],b:[-4.5,8.4,1],parent:"armR"}],vy={min:[-6.4,-.4,-4.4],max:[6.4,19.8,4]};function Ie(i,t,e,n,r,s,a,o,c,l){const h=Math.abs(i-n)-a+l,u=Math.abs(t-r)-o+l,d=Math.abs(e-s)-c+l;return Math.hypot(Math.max(h,0),Math.max(u,0),Math.max(d,0))+Math.min(Math.max(h,u,d),0)-l}function zf(i,t,e,n,r,s,a,o,c){const l=Math.abs(i-n)-a+c,h=Math.hypot(t-r,e-s)-o+c;return Math.hypot(Math.max(l,0),Math.max(h,0))+Math.min(Math.max(l,h),0)-c}function P0(i,t,e,n,r,s,a,o){let c=i-n,l=t-r,h=e-s;const u=Math.cos(a),d=Math.sin(a);[c,h]=[c*u-h*d,c*d+h*u];const f=Math.cos(o),g=Math.sin(o);return[c,l]=[c*f+l*g,-c*g+l*f],[c,l,h]}const nn={hx:1.5,hy:14.6,hz:-2.15,yaw:.4,roll:.62,w:1.1,h:.85,t:.12};function xy(i,t,e){const[n,r,s]=P0(i,t,e,nn.hx,nn.hy,nn.hz,nn.yaw,nn.roll);return Ie(n,r,s,nn.w,nn.h,0,nn.w,nn.h,nn.t,.1)}function _y(i,t,e,n=0){const r=Math.abs(i);let s=1e9;{const a=Ie(i,t,e,0,13.75,.25,2.9,1.75,1.75,.3),o=(e-(2-Math.max(0,t-13.4)*.6))*.86;s=Math.max(a,o)}return s=rt(s,Ie(i,t,e,0,12.2,.3,2.3,.6,1.5,.3),.3),s=Math.min(s,Ie(i,t,e,0,12.55,1.95,2.5,.22,.28,.1)),s=Math.min(s,Ie(r,t,e,2.2,13.1,1.92,.42,.26,.15,.08)),s=Math.min(s,Ie(i,t,e,0,11.1,.75,1.15,.9,.55,.25)),s=rt(s,Ie(i,t,e,0,11,0,1.2,1,1.05,.3),.2),s=rt(s,Ie(i,t,e,0,9.75,0,2.2,.75,1.4,.3),.25),s=Math.min(s,Ie(i,t,e,0,9.45,1.35,.7,.7,.25,.15)),s=Math.min(s,Ie(i,t,e,0,13.5,-1.85,2.2,1.6,.55,.25)),s=Math.min(s,xy(r,t,e)),s=Math.min(s,St(i,t,e,0,15.3,.25,0,16.3,.35,.6,.55)),s=Math.min(s,Ie(i,t,e,0,17.25,.45,.82,.92,.9,.35)),s=Math.min(s,Ie(i,t,e,0,16.55,.95,.55,.38,.42,.18)),s=Math.min(s,Ie(i,t,e,0,18.2,.35,.12,.35,.75,.08)),s=Math.min(s,Ie(r,t,e,.95,17.55,.25,.12,.62,.3,.08)),s=Math.min(s,Ie(r,t,e,4.05,15.05,.2,1.15,.8,1.35,.3)),s=Math.min(s,zf(r,t,e,5.4,14.7,.2,.32,.92,.12)),s=Math.min(s,Le(r,t,e,4.1,14.4,.2,.75)),s=Math.min(s,St(r,t,e,4.1,14.2,.2,4.5,11.8,.4,.62,.58)),s=Math.min(s,Le(r,t,e,4.5,11.6,.4,.72)),s=Math.min(s,Ie(r,t,e,4.55,10,.6,.9,1.5,1,.3)),s=Math.min(s,Ie(r,t,e,4.55,8.05,1,.75,.75,.8,.28)),s=Math.min(s,St(r,t,e,2.1,9.1,0,2.3,5.6,.25,1.05,.95)),s=Math.min(s,Ie(r,t,e,2.3,5.25,.85,.85,.75,.55,.25)),s=Math.min(s,Ie(r,t,e,2.3,3,.05,1.25,2.15,1.35,.35)),s=Math.min(s,zf(r,t,e,3.75,2.6,-.35,.3,.9,.12)),s=Math.min(s,Ie(r,t,e,2.3,.5,.65,1.15,.5,2,.2)),s-n}function My(i,t,e){const n=Math.abs(i);if(n>5&&Math.hypot(t-14.7,e-.2)<1)return Math.hypot(t-14.7,e-.2)<.42?1:5;if(n>3.38&&Math.hypot(t-2.6,e+.35)<.98)return Math.hypot(t-2.6,e+.35)<.4?1:5;if(t>16.95&&t<17.3&&e>1.2&&n>.12&&n<.62||t>12.85&&t<13.35&&e>1.95&&n>1.85&&n<2.6)return 2;if(t>13.55&&t<15.35&&n<2.55&&n>.18&&e>1.75-Math.max(0,t-13.4)*.6)return 4;if(t>16.15&&t<16.95&&e>1.25&&n<.6)return 6;if(e<-1.9&&t>13.8){const[r,s,a]=P0(n,t,e,nn.hx,nn.hy,nn.hz,nn.yaw,nn.roll);if(Math.abs(a)<.3&&r>.25&&r<1.75&&s>.85&&s<1.5)return 4}return t>12.3&&t<12.8&&e>1.65||t>14.25&&t<15.9&&n>2.9&&n<5.15||t>4.5&&t<6&&e>.4&&n>1.4&&n<3.2||t<1.1&&e>1.6||t>17.9&&n<.2?1:Math.hypot(n-4.1,t-14.4,e-.2)<.85&&t<14.25||Math.hypot(n-4.5,t-11.6,e-.4)<.8||t>15.2&&t<16.2&&n<.7||t>10.2&&t<11.6&&e<1.25&&n<1.25?3:0}function ve(i,t,e,n,r,s,a,o,c,l){const h=Math.abs(i-n)-a+l,u=Math.abs(t-r)-o+l,d=Math.abs(e-s)-c+l;return Math.hypot(Math.max(h,0),Math.max(u,0),Math.max(d,0))+Math.min(Math.max(h,u,d),0)-l}const yy={min:[-6.8,-.4,-4.6],max:[6.8,20.2,5]};function by(i,t,e,n=0){const r=Math.abs(i);let s=1e9;s=Math.min(s,ve(i,t,e,0,13.6,.2,3.1,2.1,2,.5)),s=Math.min(s,Dt(i,t,e,0,14.3,2.15,1.05,.7,.75)),s=Math.min(s,ve(i,t,e,0,12.4,2,.9,1,.4,.3)),s=Math.min(s,ve(r,t,e,1.7,15.6,-2.3,.18,2.4,1.1,.12)),s=Math.min(s,ve(i,t,e,0,13,-2.3,2.2,1.6,.6,.3)),s=rt(s,ve(i,t,e,0,11.2,.1,1.9,1.1,1.35,.35),.3),s=rt(s,ve(i,t,e,0,9.7,0,2.5,.95,1.55,.3),.3),s=Math.min(s,ve(i,t,e,0,9.4,1.4,.8,.9,.35,.2)),s=Math.min(s,St(i,t,e,0,15.3,.2,0,16.4,.3,.75,.7)),s=Math.min(s,ve(i,t,e,0,17.2,.4,1,1,1.1,.4)),s=Math.min(s,ve(i,t,e,0,16.6,1.25,.65,.45,.35,.15)),s=Math.min(s,ve(i,t,e,0,18.6,.3,.13,.75,.9,.08)),s=Math.min(s,St(r,t,e,.95,17.7,.4,1.5,18.5,.2,.2,.08)),s=Math.min(s,ve(r,t,e,4.2,15.4,.1,1.55,.85,1.7,.35)),s=Math.min(s,St(r,t,e,4.2,15.5,1.6,4.2,15.5,3.9,.3,.26)),s=Math.min(s,Le(r,t,e,4.1,14.4,.2,1)),s=Math.min(s,St(r,t,e,4.1,14.2,.2,4.5,11.8,.4,.85,.8)),s=Math.min(s,Le(r,t,e,4.5,11.6,.4,.9)),s=Math.min(s,ve(r,t,e,4.8,10,.6,1,1.7,1.3,.3)),s=Math.min(s,ve(r,t,e,5.85,10,.6,.22,1.8,1.35,.18)),s=Math.min(s,ve(r,t,e,4.75,7.9,1,.85,.85,.95,.3)),s=Math.min(s,St(r,t,e,2.1,9.1,0,2.3,5.8,.25,1.15,1.1)),s=Math.min(s,ve(r,t,e,2.3,5.4,.6,1.15,1.05,1,.3)),s=Math.min(s,ve(r,t,e,2.3,3,0,1.2,2,1.25,.3));for(const a of[3.8,1.9])s=Math.min(s,St(r,t,e,3.35,a,-.4,3.75,a,-.4,.75,.75));return s=Math.min(s,ve(r,t,e,2.3,.55,.65,1.15,.55,2,.2)),s-n}function Sy(i,t,e){const n=Math.abs(i),r=i>0;return t>13.7&&t<15&&e>1.6&&n<1.1||t>16.5&&t<17&&e>1.4&&n<.5&&n>.12?2:n>3.9&&n<4.5&&t>15.1&&t<15.9&&e>1.7||n>5.55&&t>8.2&&t<11.8||n>3.1&&t<4.6&&t>1.1&&e<.4||t>5.5&&t<6.3&&e>1.4&&n>1.3&&n<3.3||Math.hypot(n-4.1,t-14.4,e-.2)<1.05&&t<14.6||Math.hypot(n-4.5,t-11.6,e-.4)<.95&&t>11.3||t>10.7&&t<11&&n<2||t>8.6&&t<8.9&&n>1&&n<3.6?3:n>3.55&&t>6.4&&t<16.4||n>2.9&&t>11.4&&t<16.4?r?4:5:t<8.8&&n>.95?r?6:7:t>15.2||n>1.4&&n<2&&e<-1.2||t<11.3||e<-1.7?1:0}const wy={min:[-7.6,-.4,-6.6],max:[7.6,21,4.4]};function Ey(i,t,e,n,r,s,a,o,c,l,h,u){const d=(r+o)/2;return St(i,d+(t-d)/u,e,n,r,s,a,o,c,l,h)*u}function Ty(i,t,e,n,r,s,a,o,c,l,h,u){const d=(n+a)/2;return St(d+(i-d)/u,t,e,n,r,s,a,o,c,l,h)*u}function Ay(i,t,e,n=0){const r=Math.abs(i);let s=1e9;return s=Math.min(s,ve(i,t,e,0,13.7,.1,2.5,1.9,1.7,.6)),s=Math.min(s,Dt(i,t,e,0,14.4,1.75,.95,.75,.85)),s=rt(s,ve(i,t,e,0,11.4,0,1.5,1.2,1.15,.4),.4),s=rt(s,ve(i,t,e,0,9.8,0,2.2,.85,1.35,.35),.3),s=Math.min(s,St(i,t,e,0,15.2,-2,0,10.8,-2.3,.75,.2)),s=Math.min(s,Ey(r,t,e,1.4,13.6,-2.2,6.8,12.4,-5.6,1.9,.4,.17)),s=Math.min(s,Ty(r,t,e,1.5,14.2,-2.4,1.65,17.8,-3.7,.95,.22,.2)),s=Math.min(s,ve(r,t,e,3.4,15.2,.2,1.15,.9,1.5,.3)),s=Math.min(s,ve(r,t,e,3.4,16.4,-.1,.85,.45,1.1,.2)),s=Math.min(s,St(i,t,e,0,15.3,.1,0,16.3,.2,.6,.55)),s=Math.min(s,Dt(i,t,e,0,17.1,.35,.85,1,1.15)),s=Math.min(s,St(r,t,e,.45,17.8,.6,1,19.4,-.9,.16,.05)),s=Math.min(s,Le(r,t,e,4.1,14.5,.2,.8)),s=Math.min(s,St(r,t,e,4.1,14.3,.2,4.5,11.8,.4,.65,.6)),s=Math.min(s,Le(r,t,e,4.5,11.6,.4,.7)),s=Math.min(s,ve(r,t,e,4.5,10,.6,.8,1.6,.85,.3)),s=Math.min(s,ve(r,t,e,4.5,8,.95,.6,.65,.6,.25)),s=Math.min(s,St(r,t,e,2.1,9.1,0,2.3,5.6,.25,1.1,1)),s=Math.min(s,ve(r,t,e,2.3,5.2,.7,.75,.65,.5,.25)),s=Math.min(s,St(r,t,e,2.3,4.8,-.1,2.3,1.7,-.3,1.25,1.15)),s=Math.min(s,St(r,t,e,2.3,1.6,-.6,2.3,1.1,-1.4,1,1.1)),s=Math.min(s,ve(r,t,e,2.3,.45,.9,.75,.45,1.5,.2)),s-n}function Ry(i,t,e){const n=Math.abs(i);return t>13.8&&t<15.1&&e>1.2&&n<1||t>16.8&&t<17.4&&e>1&&n<.75?2:t<1.9&&e<-.9||Math.hypot(n-4.1,t-14.5,e-.2)<.85&&t<14.5||Math.hypot(n-4.5,t-11.6,e-.4)<.75||t>10.4&&t<10.8&&n<1.6?3:n>2.5&&n<4.3&&t>16&&t<16.9||e<-1.9&&n>1.5&&n<7&&Math.abs(t-(13.6-(n-1.4)*.22))<.3||t>12.6&&t<13&&n<2.3&&e>.8?4:n>3.6&&t<13.8&&t>7.2||t<5&&n>1?1:0}function Ir(i){const t=!!i.mech,e=!!i.cape,n=i.tail??null;return(r,s,a,o)=>r.name.startsWith("thigh")?o>-1.6&&a<r.a[1]+(t?1.4:.8)&&Math.abs(Math.abs(s)-Math.abs(r.a[0]))<(a<r.a[1]+.3?t?1.45:1.3:t?1.4:.9):r.name.startsWith("tail")?n!==null?o<n:e&&o<-1.55:!t&&(r.name.startsWith("arm")||r.name.startsWith("forearm"))?Math.abs(s)>2&&o>-1.2:t&&r.name.startsWith("arm")?o>-1.5:!0}const D0=(i,t,e=2.2)=>i.std({color:t,emissive:t,emissiveIntensity:e,roughness:.3}),Cy={id:"crimson",name:"Crimson",blurb:"A suited hero, visor and all",segs:Cr,body:{sdf:(i,t,e)=>Pr(i,t,e),region:(i,t,e)=>Dr(i,t,e),box:Lr,palette:[13114922,16053492,1052692,12633292],surface:"suit",capture:Ir({})},dress(i){const t=i.std({color:526348,roughness:.08,metalness:.6});for(const e of[-1,1]){const n=new It(new Ge(1,.38,.4),t);n.rotation.set(0,e*.42,e*-.32),i.at(n,"head",e*.46,17.12,1.12)}},fit:{size:1.08,limb:.7},face:{eyes:[[.46,17.12,1.35,.32],[-.46,17.12,1.35,.32]]}};Ir({cape:!0});const Ly=ly.map(i=>/^(arm|forearm)/.test(i.name)?{...i,reach:1.95}:i),Py={id:"howler",name:"Howler",blurb:"A wolf man with amber eyes",segs:Ly,body:{sdf:(i,t,e)=>uy(i,t,e),region:C0,box:hy,palette:[7827562,12103584,3420204,1183760],capture:Ir({tail:-1.5}),fur:{length:.8,density:7,tip:.22},furLen:fy},dress(i){const t=D0(i,16756768,1.8);for(const e of[-1,1]){const n=new It(new Ne(.24,12,8),t);n.scale.set(1.2,.8,.8),i.at(n,"head",e*pn[0],pn[1],pn[2])}},fit:{size:1.1,limb:.6},idle:{tail:.25},face:{jaw:.45,eyes:[[pn[0],pn[1],pn[2]+.12,.3],[-.62,pn[1],pn[2]+.12,.3]]}},Dy={id:"plume",name:"Plume",blurb:"A big, friendly, feathered bird",segs:dy,body:{sdf:(i,t,e)=>my(i,t,e),region:L0,box:py,palette:[16036872,16770976,15224972,15762468],surface:"soft",capture:Ir({tail:-2.4}),fur:{length:1.5,density:1.6,tip:.3,feather:!0},furLen:gy},dress(i){const t=i.std({color:16316660,roughness:.2}),e=i.std({color:657936,roughness:.1});for(const n of[-1,1]){const r=new It(new Ne(.52,18,12),t),s=new It(new Ne(.24,12,8),e);s.position.set(-n*.1,.02,.36),s.scale.set(1,1.2,.6),r.add(s),i.at(r,"head",n*mn[0],mn[1],mn[2])}},fit:{size:1.12,limb:.5},idle:{tail:.15},face:{jaw:.4,eyes:[[mn[0],mn[1],mn[2]+.45,.5],[-.72,mn[1],mn[2]+.45,.5]]}};function Dh(i,t){return e=>{const n=D0(e,t);if(i==="bastion"){for(const a of[-1,1]){const o=new It(new Ge(.42,.2,.1),n);o.rotation.z=a*-.12,e.at(o,"head",a*.36,17.12,1.36);const c=new It(new Ge(.62,.36,.1),n);e.at(c,"spine2",a*2.2,13.1,2.08)}return}const r=i==="unison",s=new It(new Ne(1,20,12),n);if(s.scale.set(r?.95:.85,r?.55:.6,r?.45:.35),e.at(s,"spine2",0,14.35,r?2.55:1.95),r)for(const a of[-1,1]){const o=new It(new Ge(.42,.16,.1),n);o.rotation.z=a*.25,e.at(o,"head",a*.32,16.85,1.62)}else e.at(new It(new Ge(1.3,.3,.12),n),"head",0,17.1,1.42);if(r){const a=e.std({color:14673130,roughness:.2,metalness:.9}),o=e.std({color:14198832,roughness:.3,metalness:.8}),c=new He,l=new It(new Ge(.22,8,.9),a);l.position.y=-4.5,c.add(l);const h=new It(new Pa(.64,1.4,4),a);h.rotation.z=Math.PI,h.position.y=-9.2,h.scale.set(.35,1,1),c.add(h),c.rotation.x=-.95;const u=new It(new Ge(.5,.4,3),o);u.position.y=-.3,c.add(u);const d=new It(new pi(.22,.22,1.6,8),o);d.position.y=.6,c.add(d),e.at(c,"forearmR",-4.75,8,2.1)}}}const Iy={id:"bastion",name:"Bastion",blurb:"An armoured truck that stands up",segs:Ph,body:{sdf:(i,t,e)=>_y(i,t,e),region:My,box:vy,palette:[4871266,14262322,9431295,1842980,7118020,1316377,12896462],surface:"armour",weights:"rigid",capture:Ir({mech:!0})},dress:Dh("bastion",9431295),fit:{size:1,limb:.6},face:{eyes:[[.4,17.12,1.5,.28],[-.4,17.12,1.5,.28]]}},Uy={id:"kestrel",name:"Kestrel",blurb:"A jet that stands up",segs:Ph,body:{sdf:(i,t,e)=>Ay(i,t,e),region:Ry,box:wy,palette:[15132908,5661306,16756800,1842980,13117498],surface:"armour",weights:"rigid",capture:Ir({mech:!0})},dress:Dh("kestrel",16756800),fit:{size:1,limb:.6},face:{eyes:[[.36,17.12,1.56,.26],[-.36,17.12,1.56,.26]]}},Ny={id:"unison",name:"Unison",blurb:"Five machines locked into one",segs:Ph,body:{sdf:(i,t,e)=>by(i,t,e),region:Sy,box:yy,palette:[15527666,2503274,8382719,1842980,15234090,2271388,15254056,12855866],surface:"armour",weights:"rigid",capture:Ir({mech:!0})},dress:Dh("unison",8382719),fit:{size:1,limb:.6},face:{eyes:[[.34,16.9,1.72,.25],[-.34,16.9,1.72,.25]]}},Fy={id:"kaiju",name:"Kaiju",blurb:"coming soon",segs:Cr,body:{sdf:(i,t,e)=>Pr(i,t,e),region:(i,t,e)=>Dr(i,t,e),box:Lr,palette:[7829367,11184810,2236962,10066329],surface:"suit"},fit:{size:1.08,limb:.7}},Oy={id:"catrina",name:"Catrina",blurb:"coming soon",segs:Cr,body:{sdf:(i,t,e)=>Pr(i,t,e),region:(i,t,e)=>Dr(i,t,e),box:Lr,palette:[7829367,11184810,2236962,10066329],surface:"suit"},fit:{size:1.08,limb:.7}},By={id:"ghost",name:"Ghost",blurb:"coming soon",segs:Cr,body:{sdf:(i,t,e)=>Pr(i,t,e),region:(i,t,e)=>Dr(i,t,e),box:Lr,palette:[7829367,11184810,2236962,10066329],surface:"suit"},fit:{size:1.08,limb:.7}},ky={id:"mummy",name:"Mummy",blurb:"coming soon",segs:Cr,body:{sdf:(i,t,e)=>Pr(i,t,e),region:(i,t,e)=>Dr(i,t,e),box:Lr,palette:[7829367,11184810,2236962,10066329],surface:"suit"},fit:{size:1.08,limb:.7}},zy={id:"vampire",name:"Vampire",blurb:"coming soon",segs:Cr,body:{sdf:(i,t,e)=>Pr(i,t,e),region:(i,t,e)=>Dr(i,t,e),box:Lr,palette:[7829367,11184810,2236962,10066329],surface:"suit"},fit:{size:1.08,limb:.7}},Hy={id:"witch",name:"Witch",blurb:"coming soon",segs:Cr,body:{sdf:(i,t,e)=>Pr(i,t,e),region:(i,t,e)=>Dr(i,t,e),box:Lr,palette:[7829367,11184810,2236962,10066329],surface:"suit"},fit:{size:1.08,limb:.7}},mi=[H2,K2,dM,IM,Py,oy,Dy,Fy,Oy,By,ky,zy,Hy,Cy,Iy,Uy,Ny],Zl=["jimothy","builder","skeleton","pumpkin","howler","violet","plume"],di=i=>mi.find(t=>t.id===i)??mi[0],Vy=i=>new N(i.x,i.y,i.z),is=(i,t,e)=>{const n=Math.min(1,Math.max(0,(e-i)/(t-i)));return n*n*(3-2*n)};function Hf(i,t){const e=t.clone().normalize(),n=new N().crossVectors(i,e).normalize(),r=new N().crossVectors(e,n).normalize();return new We().setFromRotationMatrix(new ie().makeBasis(r,e,n))}function Gy(i,t){const e=i.clone().normalize(),n=new N().crossVectors(t,e).normalize(),r=new N().crossVectors(e,n).normalize();return new We().setFromRotationMatrix(new ie().makeBasis(e,n,r))}function Vf(i){const t=b=>Vy(i[b]),e=(...b)=>Math.min(...b.map(w=>i[w].v)),n=t(O.hipL),r=t(O.hipR),s=t(O.shL),a=t(O.shR),o=n.clone().add(r).multiplyScalar(.5),c=s.clone().add(a).multiplyScalar(.5),l=c.clone().sub(o),h=Hf(n.clone().sub(r),l),u=Hf(s.clone().sub(a),l),d=t(O.earL),f=t(O.earR),g=t(O.nose),v=d.clone().add(f).multiplyScalar(.5),m=Gy(d.clone().sub(f),g.clone().sub(v));m.multiply(new We().setFromAxisAngle(new N(1,0,0),-.32));const p=(b,w)=>t(w).sub(t(b)).normalize(),y={armL:p(O.shL,O.elL),forearmL:p(O.elL,O.wrL),armR:p(O.shR,O.elR),forearmR:p(O.elR,O.wrR),thighL:p(O.hipL,O.knL),shinL:p(O.knL,O.anL),footL:p(O.heelL,O.toeL),thighR:p(O.hipR,O.knR),shinR:p(O.knR,O.anR),footR:p(O.heelR,O.toeR)},M={armL:e(O.shL,O.elL),forearmL:e(O.elL,O.wrL),armR:e(O.shR,O.elR),forearmR:e(O.elR,O.wrR),thighL:e(O.hipL,O.knL),shinL:e(O.knL,O.anL),footL:e(O.heelL,O.toeL),thighR:e(O.hipR,O.knR),shinR:e(O.knR,O.anR),footR:e(O.heelR,O.toeR)};return{pelvis:h,chest:u,head:m,headVis:e(O.earL,O.earR,O.nose),neck:v.sub(c).normalize(),dir:y,vis:M}}const Wy={armL:new N(1,0,0),armR:new N(-1,0,0),thighL:new N(0,-1,0),thighR:new N(0,-1,0),neck:new N(0,1,0)},Gf={forearmL:"armL",forearmR:"armR",shinL:"thighL",shinR:"thighR",footL:"shinL",footR:"shinR"};class Xy{bones;rest=new Map;qm=new Map;hipRest;pelvisA;torso;len=new Map;segs;constructor(t,e){this.segs=t,this.bones=e;const n=l=>t.find(h=>h.name===l);for(const l of t){const h=new N(l.b[0]-l.a[0],l.b[1]-l.a[1],l.b[2]-l.a[2]);this.len.set(l.name,h.length()),h.lengthSq()>1e-9?h.normalize():h.set(0,1,0);const u=l.parent?n(l.parent):null,d=u?new N(l.a[0]-u.a[0],l.a[1]-u.a[1],l.a[2]-u.a[2]):new N(...l.a);let f=Wy[l.name];if(!f&&Gf[l.name]){const g=n(Gf[l.name]);f=new N(g.b[0]-g.a[0],g.b[1]-g.a[1],g.b[2]-g.a[2]).normalize(),l.name.startsWith("foot")&&(f=h.clone())}f??=h.clone(),this.rest.set(l.name,{dir:h,offset:d,pre:new We().setFromUnitVectors(h,f),canon:f})}this.pelvisA=new N(...n("pelvis").a);const r=n("thighL").a,s=n("thighR").a,a=n("armL").a,o=n("armR").a;this.hipRest=new N((r[0]+s[0])/2,(r[1]+s[1])/2,(r[2]+s[2])/2);const c=new N((a[0]+o[0])/2,(a[1]+o[1])/2,(a[2]+o[2])/2);this.torso=c.distanceTo(this.hipRest)}setLength(t,e){const n=this.segs.find(a=>a.parent===t&&!a.name.startsWith("tail")&&a.name!=="jaw");if(!n)return;const r=this.bones.get(n.name),s=this.rest.get(n.name);r.position.copy(s.offset).multiplyScalar(e)}neckFit(t){const e=l=>this.segs.find(h=>h.name===l),n=e("spine2"),r=e("neck"),s=e("head"),a=(e("armL").a[1]+e("armR").a[1])/2-n.a[1],o=r.a[1]-n.a[1]+(s.a[1]-r.a[1]),c=(s.a[1]+s.b[1])/2-s.a[1];return o>.001?(a+t-c)/o:1}setNeck(t){for(const e of["neck","head"]){const n=this.bones.get(e),r=this.rest.get(e);n&&r&&n.position.copy(r.offset).multiplyScalar(t)}}swing(t,e,n,r){const s=this.rest.get(t),a=n.clone().applyQuaternion(e.clone().invert()).normalize(),o=new We().setFromUnitVectors(s.canon,a).multiply(s.pre);return r<1&&o.slerp(new We,1-Math.max(0,r)),o}glide=0;primed=new Set;set(t,e,n){const r=this.bones.get(t);r&&(this.glide>0&&this.primed.has(t)&&(e=r.quaternion.clone().slerp(e,this.glide)),r.quaternion.copy(e),this.primed.add(t));const s=n?n.clone().multiply(e):e.clone();return this.qm.set(t,s),s}apply(t,e=0,n=0,r=0){this.glide=r>0?1-Math.exp(-r/.025):0;const s=this.set("pelvis",t.pelvis,null),a=this.hipRest.clone().sub(this.pelvisA).applyQuaternion(t.pelvis);this.bones.get("pelvis").position.copy(a.negate());const o=t.pelvis.clone().slerp(t.chest,.5),c=this.set("spine1",s.clone().invert().multiply(o),s),l=this.set("spine2",c.clone().invert().multiply(t.chest),c),h=is(.3,.7,t.headVis),u=this.set("neck",this.swing("neck",l,t.neck,h*.6),l),d=u.clone().invert().multiply(t.head);h<1&&d.slerp(new We,1-h),this.set("head",d,u);for(const g of["L","R"]){const v=this.set("arm"+g,this.swing("arm"+g,l,t.dir[`arm${g}`],is(.35,.7,t.vis[`arm${g}`])),l);this.set("forearm"+g,this.swing("forearm"+g,v,t.dir[`forearm${g}`],is(.35,.7,t.vis[`forearm${g}`])),v);const m=this.set("thigh"+g,this.swing("thigh"+g,s,t.dir[`thigh${g}`],is(.4,.75,t.vis[`thigh${g}`])),s),p=this.set("shin"+g,this.swing("shin"+g,m,t.dir[`shin${g}`],is(.4,.75,t.vis[`shin${g}`])),m);this.set("foot"+g,this.swing("foot"+g,p,t.dir[`foot${g}`],is(.5,.8,t.vis[`foot${g}`])),p)}let f=s;for(let g=1;g<=4;g++){const v="tail"+g;if(!this.bones.has(v))break;const m=new We().setFromEuler(new Bn(0,Math.sin(e*2.1-g*.7)*n,Math.sin(e*1.3-g*.5)*n*.3));f=this.set(v,m,g===1?this.qm.get(this.segs.find(p=>p.name==="tail1")?.parent??"pelvis")??s:f)}}setJaw(t){this.bones.get("jaw")?.quaternion.setFromAxisAngle(new N(1,0,0),t)}dirOf(t){return this.rest.get(t).dir.clone().applyQuaternion(this.qm.get(t))}}const Vi=128,rs=64,In=96,ii=72,Gi=12,ss=9,ri=24,Vn={spread:1,back:.9,envIntensity:1.15,key:5,every:6,targetMean:.22,maxGain:2.8,fill:.35},as=new Float32Array(256).map((i,t)=>{const e=t/255;return e<=.04045?e/12.92:Math.pow((e+.055)/1.055,2.4)});class qy{constructor(t,e,n){this.renderer=t,this.scene=e,this.cv=document.createElement("canvas"),this.cv.width=In,this.cv.height=ii,this.ctx=this.cv.getContext("2d",{willReadFrequently:!0}),this.fcv=document.createElement("canvas"),this.fcv.width=this.fcv.height=ri,this.fctx=this.fcv.getContext("2d",{willReadFrequently:!0}),this.tex=new ys(this.data,Vi,rs,Xe,Tr),this.tex.mapping=Co,this.tex.colorSpace=br,this.tex.magFilter=_e,this.tex.minFilter=_e,this.pmrem=new Hl(t),this.key.castShadow=!0,this.key.shadow.mapSize.set(1024,1024),this.key.shadow.bias=-5e-4,this.key.shadow.normalBias=.02,this.key.shadow.radius=4,e.add(this.key),e.add(this.key.target),e.add(this.fill),this.fill.intensity=1}key=new zl(16777215,1);fill=new Tm(16777215,4473924,0);cv;ctx;lin=new Float32Array(In*ii*3);blur=new Float32Array(Gi*ss*3);data=new Uint16Array(Vi*rs*4);smooth=new Float32Array(Vi*rs*3);primed=!1;keyDir=new N(0,1,1).normalize();keyI=0;tex;pmrem;rt=null;mean=0;share=0;gain=1;realism=!1;face=null;faceDir=new N(0,0,1);faceLum=0;faceConf=0;fcv;fctx;dir=new N(0,1,1).normalize();target=new N(0,0,-2);update(t,e,n,r,s,a){if(this.aimShadows(s,n),!a){this.scene.environment=null,this.fill.intensity=1.2,this.key.intensity=1.6,this.key.position.copy(this.target).add(new N(1.5,3,2.5));return}if(r%Vn.every!==0&&this.rt||t.readyState<2||!t.videoWidth)return;this.ctx.drawImage(t,0,0,In,ii);const o=this.ctx.getImageData(0,0,In,ii).data;let c=0;for(let _=0,S=0;_<In*ii;_++,S+=4){const E=as[o[S]],P=as[o[S+1]],L=as[o[S+2]];this.lin[_*3]=E,this.lin[_*3+1]=P,this.lin[_*3+2]=L,c+=.2126*E+.7152*P+.0722*L}this.mean=c/(In*ii),this.gain=Math.min(this.realism?1.25:Vn.maxGain,Math.max(1,Vn.targetMean/Math.max(this.mean,.001)));const l=this.gain;this.readFace(t,n),this.blur.fill(0);const h=In/Gi,u=ii/ss;for(let _=0;_<ii;_++)for(let S=0;S<In;S++){const E=(Math.floor(_/u)*Gi+Math.floor(S/h))*3,P=(_*In+S)*3,L=this.blur;L[E]=L[E]+this.lin[P],L[E+1]=L[E+1]+this.lin[P+1],L[E+2]=L[E+2]+this.lin[P+2]}for(let _=0;_<this.blur.length;_++)this.blur[_]=this.blur[_]/(h*u);const d=e.f/e.w,f=e.f/e.h;let g=0;for(let _=0;_<Gi*ss;_++)g+=.2126*this.blur[_*3]+.7152*this.blur[_*3+1]+.0722*this.blur[_*3+2];g/=Gi*ss;const v=this.faceConf>0?Math.min(2.5,Math.max(.4,this.faceLum/.35/Math.max(g*2.2,.001))):1,m=Vn.back*(1+(v-1)*this.faceConf);let p=0,y=0,M=0,b=0;for(let _=0;_<rs;_++){const S=((_+.5)/rs-.5)*Math.PI,E=Math.sin(S),P=Math.cos(S);for(let L=0;L<Vi;L++){const I=((L+.5)/Vi-.5)*Math.PI*2;let B=Math.cos(I)*P;const X=Math.sin(I)*P,H=n?-B:B,it=X<0,lt=Math.max(Math.abs(X),.05),dt=.5+H/lt*d/Vn.spread,vt=.5-E/lt*f/Vn.spread,wt=Math.min(1,Math.max(0,dt)),Ft=Math.min(1,Math.max(0,vt)),ot=(Math.min(ss-1,Math.floor(Ft*ss))*Gi+Math.min(Gi-1,Math.floor(wt*Gi)))*3;let V,Z,k;if(it){const J=(Math.min(ii-1,Math.floor(Ft*ii))*In+Math.min(In-1,Math.floor(wt*In)))*3,j=Math.max(Math.abs(dt-.5)-.5,Math.abs(vt-.5)-.5,0),Q=Math.min(1,j/.4);V=this.lin[J]+(this.blur[ot]-this.lin[J])*Q,Z=this.lin[J+1]+(this.blur[ot+1]-this.lin[J+1])*Q,k=this.lin[J+2]+(this.blur[ot+2]-this.lin[J+2])*Q}else V=this.blur[ot]*m,Z=this.blur[ot+1]*m,k=this.blur[ot+2]*m;V*=l,Z*=l,k*=l;const G=(_*Vi+L)*3,z=this.primed?.28:1;V=this.smooth[G]=this.smooth[G]+(V-this.smooth[G])*z,Z=this.smooth[G+1]=this.smooth[G+1]+(Z-this.smooth[G+1])*z,k=this.smooth[G+2]=this.smooth[G+2]+(k-this.smooth[G+2])*z;const K=(_*Vi+L)*4;this.data[K]=qa.toHalfFloat(V),this.data[K+1]=qa.toHalfFloat(Z),this.data[K+2]=qa.toHalfFloat(k),this.data[K+3]=qa.toHalfFloat(1);const et=.2126*V+.7152*Z+.0722*k,U=et*P;B=Math.cos(I)*P,p+=U*B,y+=U*E,M+=U*X,b+=U}}this.primed=!0,this.tex.needsUpdate=!0,this.rt=this.pmrem.fromEquirectangular(this.tex,this.rt),this.scene.environment=this.rt.texture,this.scene.environmentIntensity=Vn.envIntensity;const w=Math.hypot(p,y,M);this.share=b>0?w/b:0;const A=(w>1e-6?new N(p/w,y/w,M/w):this.keyDir.clone()).clone().lerp(this.faceDir,.65*this.faceConf).normalize();this.keyDir.lerp(A,.25).normalize(),this.dir.copy(this.keyDir),this.dir.y<.15&&(this.dir.y=.15,this.dir.normalize());const R=this.faceConf>0?Math.min(1,this.faceDir.clone().setZ(0).length()*1.4):this.share,x=Vn.key*(this.share+(R-this.share)*this.faceConf*.6)*(b/(Vi*rs))*2;this.keyI+=(x-this.keyI)*(this.keyI===0?1:.25),this.key.intensity=this.keyI,this.fill.intensity=Vn.fill*(this.realism?.25:1)*Math.min(1,Math.max(0,1-this.mean/.22)),this.key.position.copy(this.target).addScaledVector(this.dir,4)}readFace(t,e){const n=this.face;if(!n||n.w<.04){this.faceConf*=.9;return}const r=n.probe.map(P=>P.x),s=n.probe.map(P=>P.y),a=Math.min(...r),o=Math.max(...r),c=Math.min(...s),l=Math.max(...s),h=.15,u=(o-a)*(1+h*2),d=(l-c)*(1+h*2),f=a-(o-a)*h,g=c-(l-c)*h,v=t.videoWidth,m=t.videoHeight;if(u<=0||d<=0||!v)return;this.fctx.drawImage(t,f*v,g*m,u*v,d*m,0,0,ri,ri);const p=this.fctx.getImageData(0,0,ri,ri).data,y=n.probe.map(P=>{const L=Math.round((P.x-f)/u*(ri-1)),I=Math.round((P.y-g)/d*(ri-1));let B=0,X=0;for(let H=-1;H<=1;H++)for(let it=-1;it<=1;it++){const lt=Math.min(ri-1,Math.max(0,L+it)),dt=Math.min(ri-1,Math.max(0,I+H)),vt=(dt*ri+lt)*4;B+=.2126*as[p[vt]]+.7152*as[p[vt+1]]+.0722*as[p[vt+2]],X++}return B/X}),[M,b,w,T,A]=y,R=(M+b+w+T+A)/5,x=(w-T)/Math.max(w+T,1e-4),_=(M-b)/Math.max(M+b,1e-4),S=new N(x*2.2*(e?-1:1),Math.max(.1,_*1+.35),.75).normalize(),E=Math.min(1,Math.max(0,(n.w-.04)/.08));this.faceDir.lerp(S,.3).normalize(),this.faceLum+=(R-this.faceLum)*.3,this.faceConf+=(E-this.faceConf)*.3}aimShadows(t,e){if(!t.length)return;const n=new N;for(const a of t)n.add(a);n.multiplyScalar(1/t.length),e&&(n.x=-n.x);let r=1.4;for(const a of t)r=Math.max(r,Math.hypot((e?-a.x:a.x)-n.x,a.y-n.y,a.z-n.z)+1.4);this.target.copy(n),this.key.target.position.copy(n),this.key.position.copy(n).addScaledVector(this.dir,4);const s=this.key.shadow.camera;s.right!==r&&(s.left=-r,s.right=r,s.top=r,s.bottom=-r,s.near=.1,s.far=4+r*2,s.updateProjectionMatrix())}}const os={tauN:1,tauH:.6,imuAgree:35,footVis:.5};class Yy{n=new N(0,1,0);h=-1.4;source="assumed";fromFeet=!1;bodyUp=new N(0,1,0);bodyW=0;update(t,e,n){const r=1-Math.exp(-n/os.tauN),s=1-Math.exp(-n/os.tauH),a=new N;let o=0;for(const f of t){if(f.lost||f.presence<.5)continue;const g=M=>new N(f.world[M].x,f.world[M].y,f.world[M].z),v=g(O.shL).add(g(O.shR)).multiplyScalar(.5),m=Math.min(f.world[O.anL].v,f.world[O.anR].v),p=m>os.footVis?g(O.anL).add(g(O.anR)).multiplyScalar(.5):g(O.hipL).add(g(O.hipR)).multiplyScalar(.5),y=v.sub(p);y.lengthSq()<1e-4||(a.addScaledVector(y.normalize(),f.presence*(m>os.footVis?1:.6)),o+=f.presence)}o>0&&a.lengthSq()>1e-6&&(a.normalize(),this.bodyUp.lerp(a,this.bodyW>0?r*.5:1).normalize(),this.bodyW=Math.min(1,this.bodyW+n));let c=null;const l=Math.cos(_s.degToRad(os.imuAgree));e&&(this.bodyW===0||e.dot(this.bodyUp)>l)?(c=e,this.source="motion"):this.bodyW>0&&(c=this.bodyUp,this.source="body"),c&&this.n.lerp(c,r).normalize();let h=0,u=0,d=!1;for(const f of t){if(f.lost||f.presence<.5)continue;const g=y=>this.n.x*(f.T.x+f.world[y].x)+this.n.y*(f.T.y+f.world[y].y)+this.n.z*(f.T.z+f.world[y].z);let v=1/0;for(const[y,M]of[[O.heelL,.02],[O.heelR,.02],[O.toeL,.02],[O.toeR,.02],[O.anL,.08],[O.anR,.08]])f.world[y].v>os.footVis&&(v=Math.min(v,g(y)-M));if(v<1/0){h+=v*f.presence,u+=f.presence,d=!0;continue}const m=(g(O.hipL)+g(O.hipR))/2,p=Math.max(.6,Math.min(1.1,f.len.thigh+f.len.shin+.08));h+=(m-p)*f.presence*.4,u+=f.presence*.4}u>0&&(this.h+=(h/u-this.h)*s,this.fromFeet=d)}foot(t,e=new N){return e.copy(t).addScaledVector(this.n,this.h-this.n.dot(t))}height(t){return this.n.dot(t)-this.h}axes(){const t=new N(0,0,-1).addScaledVector(this.n,this.n.z).normalize(),e=new N().crossVectors(t,this.n).normalize();return{back:t,side:e}}get cameraHeight(){return-this.h}}const cr={coupling:.08,deadzone:2,restitution:.55,pupil:.46},$y=new Qi({color:16777215,side:Ze,depthTest:!1,toneMapped:!1}),jy=new Qi({color:657930,side:Ze,depthTest:!1,toneMapped:!1}),Zy=new Qi({color:10132122,side:Ze,depthTest:!1,toneMapped:!1}),Jy=new Qi({color:16777215,side:Ze,depthTest:!1,transparent:!0,opacity:.85,toneMapped:!1}),Ky=new Os(1,40),Qy=new Mh(.95,1.05,40),tb=new Os(1,28),eb=new Os(.16,16);class Wf{g=new He;pupil;q=new ft(0,-.5);w=new ft;prev=[];sm=new N;primed=!1;constructor(){const t=new It(Ky,$y),e=new It(Qy,Zy);this.pupil=new It(tb,jy),this.pupil.scale.setScalar(cr.pupil);const n=new It(eb,Jy);n.position.set(-.38,.42,.003),this.pupil.position.z=.0015,e.position.z=.001,this.g.add(t,e,this.pupil,n),this.g.traverse(r=>{r.renderOrder=1100,r.frustumCulled=!1})}update(t,e,n,r){this.primed||(this.sm.copy(t.p),this.primed=!0),this.sm.lerp(t.p,1-Math.exp(-n/.05)),this.prev.push(this.sm.clone()),this.prev.length>3&&this.prev.shift();const s=new N;if(this.prev.length===3&&n>0){s.copy(this.prev[2]).addScaledVector(this.prev[1],-2).add(this.prev[0]).divideScalar(n*n);const d=s.length();s.multiplyScalar(d>cr.deadzone?(d-cr.deadzone)/d:0)}const a=new N().addScaledVector(e,-9.8).addScaledVector(s,-1).multiplyScalar(cr.coupling/Math.max(t.r,.005)),o=a.dot(t.u),c=a.dot(t.v),l=1-cr.pupil,h=4,u=Math.min(n,.1)/h;for(let d=0;d<h;d++){this.w.x+=o*u,this.w.y+=c*u,this.w.multiplyScalar(Math.exp(-2.2*u)),this.q.addScaledVector(this.w,u);const f=this.q.length();if(f>l){const g=this.q.x/f,v=this.q.y/f;this.q.set(g*l,v*l);const m=this.w.x*g+this.w.y*v;if(m>0){const p=this.w.x-m*g,y=this.w.y-m*v;this.w.set(p*.9-cr.restitution*m*g,y*.9-cr.restitution*m*v)}}}this.g.position.copy(t.p),this.g.quaternion.setFromRotationMatrix(new ie().makeBasis(t.u,t.v,t.n)),this.g.scale.setScalar(t.r*r),this.g.visible=r>.02,this.pupil.position.set(this.q.x,this.q.y,.0015)}}class nb{group=new He;eyes=new Map;update(t,e,n,r){this.group.visible=r;const s=new Set;if(r)for(const a of t){if(!a.eyes)continue;s.add(a.id);let o=this.eyes.get(a.id);if(!o){o=[new Wf,new Wf];for(const c of o)this.group.add(c.g);this.eyes.set(a.id,o)}a.eyes.forEach((c,l)=>o[l]?.update(c,e,n,a.show))}for(const[a,o]of this.eyes)if(!s.has(a)){for(const c of o)this.group.remove(c.g);this.eyes.delete(a)}}}const Wi=900,ib=`
  attribute float aSize; attribute float aLife; attribute vec3 aColor;
  uniform float uScale;
  varying float vLife; varying vec3 vColor;
  void main() {
    vLife = aLife; vColor = aColor;
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = aLife > 0.0 ? aSize * uScale / max(-mv.z, 0.05) : 0.0;
  }`,rb=`
  varying float vLife; varying vec3 vColor;
  void main() {
    vec2 c = gl_PointCoord - 0.5;
    float d = length(c) * 2.0;
    if (d > 1.0 || vLife <= 0.0) discard;
    float core = exp(-d * d * 5.0), halo = exp(-d * d * 1.6) * 0.45;
    float fade = smoothstep(0.0, 0.25, vLife) * smoothstep(1.0, 0.85, vLife);
    gl_FragColor = vec4(vColor * (core * 1.6 + halo) * fade, 1.0);
  }`,sb=[16722324,11796265,16769065,2744575,9187071].map(i=>new Pt(i));class ab{points;pos=new Float32Array(Wi*3);vel=new Float32Array(Wi*3);col=new Float32Array(Wi*3);size=new Float32Array(Wi);life=new Float32Array(Wi);span=new Float32Array(Wi);next=0;owed=new Map;mat;constructor(){const t=new Se;t.setAttribute("position",new ae(this.pos,3)),t.setAttribute("aColor",new ae(this.col,3)),t.setAttribute("aSize",new ae(this.size,1)),t.setAttribute("aLife",new ae(this.life,1)),this.mat=new ze({vertexShader:ib,fragmentShader:rb,uniforms:{uScale:{value:800}},transparent:!0,depthWrite:!1,blending:Ro,toneMapped:!1}),this.points=new X1(t,this.mat),this.points.frustumCulled=!1,this.points.renderOrder=1050}update(t,e,n,r){if(this.mat.uniforms.uScale.value=n,this.points.visible=r,!r)return;for(const o of t){const c=Math.min(1,Math.max(0,(o.open-.3)/.45));let l=(this.owed.get(o.id)??0)+c*c*110*(o.rate??1)*e;const h=o.colors?.length?o.colors:sb;for(;l>=1;){l-=1;const u=this.next;this.next=(this.next+1)%Wi;const d=.35,f=Math.random()*Math.PI*2,g=Math.random()*d,v=new N(1,0,0).cross(o.dir);v.lengthSq()<1e-4&&v.set(0,1,0),v.normalize();const m=new N().crossVectors(o.dir,v).normalize(),p=o.dir.clone().addScaledVector(v,Math.cos(f)*g).addScaledVector(m,Math.sin(f)*g-.15).normalize(),y=(1.1+Math.random()*1.1)*o.scale*(o.speed??1);this.pos[u*3]=o.p.x,this.pos[u*3+1]=o.p.y,this.pos[u*3+2]=o.p.z,this.vel[u*3]=p.x*y,this.vel[u*3+1]=p.y*y,this.vel[u*3+2]=p.z*y;const M=h[Math.floor(Math.random()*h.length)];this.col[u*3]=M.r,this.col[u*3+1]=M.g,this.col[u*3+2]=M.b,this.size[u]=(.025+Math.random()*.045)*o.scale*(o.size??1),this.span[u]=.9+Math.random()*.6,this.life[u]=1}this.owed.set(o.id,l)}const s=Math.exp(-1.6*e);for(let o=0;o<Wi;o++)this.life[o]<=0||(this.life[o]=this.life[o]-e/this.span[o],this.vel[o*3]=this.vel[o*3]*s,this.vel[o*3+2]=this.vel[o*3+2]*s,this.vel[o*3+1]=this.vel[o*3+1]*s+.5*e,this.pos[o*3]=this.pos[o*3]+this.vel[o*3]*e,this.pos[o*3+1]=this.pos[o*3+1]+this.vel[o*3+1]*e,this.pos[o*3+2]=this.pos[o*3+2]+this.vel[o*3+2]*e);const a=this.points.geometry;for(const o of["position","aColor","aSize","aLife"])a.getAttribute(o).needsUpdate=!0}}const ob=new ze({transparent:!0,depthWrite:!1,toneMapped:!1,vertexShader:"varying vec2 vUv; void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }",fragmentShader:"varying vec2 vUv; void main() { float r = length(vUv - 0.5) * 2.0; gl_FragColor = vec4(0.0, 0.0, 0.0, 0.5 * pow(clamp(1.0 - r, 0.0, 1.0), 1.6)); }"}),cb=new Pi(1,1),Vc=12,lb=i=>({pelvis:i.pelvis.clone(),chest:i.chest.clone(),head:i.head.clone(),headVis:i.headVis,neck:i.neck.clone(),dir:Object.fromEntries(Object.entries(i.dir).map(([t,e])=>[t,e.clone()])),vis:{...i.vis}}),I0=`
  varying vec2 vUv;
  uniform vec4 uCrop; // u0, v0, du, dv of the video shown
  uniform float uMirror;
  void main() {
    vec2 uv = position.xy * 0.5 + 0.5;
    uv.x = mix(uv.x, 1.0 - uv.x, uMirror);
    vUv = uCrop.xy + uv * uCrop.zw;
    gl_Position = vec4(position.xy, 1.0, 1.0);
  }`,hb=`
  varying vec2 vUv;
  uniform sampler2D uTex;
  void main() { gl_FragColor = vec4(texture2D(uTex, vUv).rgb, 1.0); }`;class ub{constructor(t){this.canvas=t,this.renderer=new d2({canvas:t,antialias:!0,alpha:!1,powerPreference:"high-performance",preserveDrawingBuffer:!1}),this.renderer.outputColorSpace=an,this.renderer.toneMapping=cd,this.renderer.toneMappingExposure=1,this.renderer.shadowMap.enabled=!0,this.renderer.shadowMap.type=id,this.renderer.setPixelRatio(this.opts.pixelRatio),this.plainBg=new ze({vertexShader:I0,fragmentShader:hb,depthTest:!1,depthWrite:!1,toneMapped:!1,uniforms:this.bgUniforms}),this.bg=new It(new Pi(2,2),this.plainBg),this.fg=new It(new Pi(2,2),this.plainBg),this.fg.frustumCulled=!1,this.fg.renderOrder=1e3,this.fg.visible=!1,this.bg.frustumCulled=!1,this.bg.renderOrder=-1e3,this.scene.add(this.bg),this.scene.add(this.fg),this.scene.add(this.world),this.world.add(this.googly.group,this.breath.points);for(const e of this.spots)this.world.add(e,e.target);this.grain=new It(new Pi(2,2),new ze({vertexShader:"varying vec2 vUv; void main() { vUv = position.xy * 0.5 + 0.5; gl_Position = vec4(position.xy, 0.0, 1.0); }",fragmentShader:`varying vec2 vUv; uniform float uTime; uniform vec2 uRes;
        float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
        void main() {
          vec2 d = vUv - 0.5; d.y *= 1.15;
          float vig = 1.0 - 0.35 * dot(d, d);
          float n = hash(floor(vUv * uRes) + fract(uTime * 7.31) * 97.0);
          gl_FragColor = vec4(vec3(vig * (0.965 + 0.035 * n)), 1.0);
        }`,uniforms:{uTime:{value:0},uRes:{value:new ft(1,1)}},depthTest:!1,depthWrite:!1,toneMapped:!1,transparent:!0,blending:rd,blendSrc:sd,blendDst:ad})),this.grain.frustumCulled=!1,this.grain.renderOrder=1200,this.grain.visible=!1,this.scene.add(this.grain),this.scene.add(this.camera),this.light=new qy(this.renderer,this.scene,this.world),this.rims[0].position.set(-3,2.5,-6),this.rims[1].position.set(3,2.5,-6);for(const e of this.rims)e.target.position.set(0,0,-3),this.scene.add(e,e.target)}renderer;scene=new Rd;camera=new bn(50,1,.05,60);world=new He;light;bg;bgUniforms={uTex:{value:null},uCrop:{value:new le(0,0,1,1)},uMirror:{value:0}};plainBg;videoTex=null;templates=new Map;wearers=new Map;leaving=[];lastT=-1;frameDt=0;pyramid=!1;hideWearers=!1;cloneCast=t=>t;ground=new Yy;googly=new nb;breath=new ab;googlyOn=!1;breathOn=!0;spots=[0,1,2].map(()=>new Rm(16777215,0,0,.24,.65,2));grain;fg;rims=[new zl(16723349,0),new zl(3073791,0)];opts={size:1,shadows:!0,envLight:!0,pixelRatio:Math.min(window.devicePixelRatio||1,2)};cover={s:1,ox:0,oy:0,vw:1,vh:1,cw:1,ch:1,mirror:!1};setVideo(t){this.videoTex?.dispose();const e=new q1(t);e.colorSpace=ci,e.minFilter=_e,e.magFilter=_e,e.generateMipmaps=!1,this.videoTex=e,this.bgUniforms.uTex.value=e}setBackground(t){this.bg.material=t??this.plainBg}setForeground(t){this.fg.visible=!!t,t&&(this.fg.material=t)}template(t){let e=this.templates.get(t);return e||(e=Uc(di(t)),this.templates.set(t,e)),e}hasTemplate(t){return this.templates.has(t)}worker=null;queue=[];busy=null;waiting=new Map;workerMs=new Map;prepare(t,e=!1){const n=this.templates.get(t);if(n)return Promise.resolve(n);const r=new Promise(s=>{const a=this.waiting.get(t)??[];a.push(s),this.waiting.set(t,a)});return this.busy!==t&&(this.queue=this.queue.filter(s=>s!==t),e?this.queue.unshift(t):this.queue.push(t)),this.pump(),r}isPreparing(t){return this.busy===t||this.queue.includes(t)}pump(){if(!(this.busy||!this.queue.length)){if(!this.worker)try{this.worker=new Worker(new URL(""+new URL("build.worker-C5DFrrDI.js",import.meta.url).href,import.meta.url),{type:"module"}),this.worker.onmessage=t=>{const{id:e,body:n,fur:r,ms:s}=t.data;this.workerMs.set(e,s);const a=Uc(di(e),void 0,n?{body:n,fur:r}:void 0);this.finish(e,a)},this.worker.onerror=t=>{console.warn("costume worker failed; building on the main thread",t),this.worker=null,this.workerDead=!0,this.fallback()}}catch{this.workerDead=!0}if(this.workerDead){this.fallback();return}this.busy=this.queue.shift(),this.worker.postMessage({id:this.busy})}}workerDead=!1;fallback(){const t=this.busy??this.queue.shift();t&&(this.busy=t,setTimeout(()=>this.finish(t,Uc(di(t))),16))}finish(t,e){this.templates.has(t)||this.templates.set(t,e);const n=this.templates.get(t);for(const r of this.waiting.get(t)??[])r(n);this.waiting.delete(t),this.busy=null,this.pump()}layout(t,e){const n=this.canvas.clientWidth||window.innerWidth,r=this.canvas.clientHeight||window.innerHeight,s=this.opts.pixelRatio;this.renderer.getPixelRatio()!==s&&this.renderer.setPixelRatio(s);const a=this.renderer.getSize(new ft);(a.x!==n||a.y!==r)&&this.renderer.setSize(n,r,!1);const o=Math.max(n/t.w,r/t.h),c=n/o,l=r/o,h=(t.w-c)/2/t.w,u=(t.h-l)/2/t.h;this.bgUniforms.uCrop.value.set(h,u,c/t.w,l/t.h),this.bgUniforms.uMirror.value=e?1:0,this.camera.fov=_s.radToDeg(2*Math.atan(l/2/t.f)),this.camera.aspect=n/r,this.camera.updateProjectionMatrix(),this.world.scale.x=e?-1:1,this.cover={s:o,ox:(t.w-c)/2,oy:(t.h-l)/2,vw:t.w,vh:t.h,cw:n,ch:r,mirror:e}}sync(t,e,n){const r=this.lastT<0?.03333333333333333:Math.min(.1,Math.max(0,n-this.lastT));this.lastT=n,this.frameDt=r;const s=new Set;for(const a of t){const o=e(a.id);let c=this.wearers.get(a.id);c&&c.def.id!==o&&this.templates.has(o)&&(c.leaving=!0,this.leaving.push(c),this.wearers.delete(a.id),c=void 0),!(!c&&!this.templates.has(o))&&(s.add(a.id),c||(c=this.dress(a.id,o)),c.life=Math.min(1,c.life+r/.35),this.pose(c,a,n))}for(const[a,o]of this.wearers)s.has(a)||this.drop(o);this.leaving=this.leaving.filter(a=>{if(a.life-=r/.35,a.life<=0)return this.drop(a),!1;const o=t.find(c=>c.id===a.trackId);return o&&this.pose(a,o,n),!0})}dress(t,e){const{def:n,root:r,rig:s,mats:a}=this.instance(e),o={trackId:t,def:n,root:r,rig:s,mats:a,fade:0,life:0,leaving:!1,poses:[],head:0,len:null,clones:[]};return this.world.add(r),this.wearers.set(t,o),o}instance(t){const e=this.template(t),n=x2(e.root),r=new Map;n.traverse(a=>{a.isBone&&r.set(a.name,a)});const s=new Map;return n.traverse(a=>{const o=a;if(!o.isMesh&&!a.isSprite)return;const c=l=>{let h=s.get(l);return h||(h=l.clone(),h.onBeforeCompile=l.onBeforeCompile,h.customProgramCacheKey=l.customProgramCacheKey,l.userData.keepBlend?h.userData.baseOpacity=l.opacity:h.alphaHash=!0,s.set(l,h)),h};o.material=Array.isArray(o.material)?o.material.map(c):c(o.material)}),{def:e.def,root:n,rig:new Xy(e.def.segs,r),mats:[...s.values()]}}drop(t){this.world.remove(t.root);for(const e of t.clones)this.dropClone(e);for(const e of t.mats)e.dispose();this.wearers.get(t.trackId)===t&&this.wearers.delete(t.trackId)}pose(t,e,n){const r=t.def,s=t.rig,a=Vf(e.world),o=this.fit(s,r,e.len);s.apply(a,n,r.idle?.tail??0,this.frameDt),r.face?.jaw&&s.setJaw((e.face?.jaw??0)*r.face.jaw),t.root.position.set(e.T.x,e.T.y,e.T.z),t.root.scale.setScalar(o);const c=e.presence*Math.max(0,Math.min(1,t.life)),l=c*c*(3-2*c);if(l!==t.fade){for(const h of t.mats)h.opacity=l*(h.userData.baseOpacity??1);t.fade=l}t.root.visible=l>.01&&!this.hideWearers,r.tick?.(t.root,n,e.face??null),t.head=(t.head+1)%Vc,t.poses[t.head]=lb(a),t.len=e.len,this.posePyramid(t,o,l,n)}fit(t,e,n){const r=n.torso/t.torso*(e.fit?.size??1)*this.opts.size,s=e.fit?.limb??0,a=(c,l)=>{const h=1+(l/r/(t.len.get(c)??1)-1)*s;t.setLength(c,Math.min(1.6,Math.max(.65,h)))};for(const c of["L","R"])a("arm"+c,n.upperArm),a("thigh"+c,n.thigh),a("shin"+c,n.shin);const o=t.neckFit(n.neck/r);return t.setNeck(1+(Math.min(1.25,Math.max(.45,o))-1)*(e.fit?.head??.85)),r}dropClone(t){this.world.remove(t.root,t.shadow);for(const e of t.mats)e.dispose()}posePyramid(t,e,n,r){const s=this.pyramid?this.wearers.size>1?2:3:0,a=[];for(let v=1;v<=s;v++)for(let m=0;m<=v;m++)a.push({row:v,col:m,id:this.cloneCast(t.def.id,a.length)});for(let v=0;v<t.clones.length;v++){const m=t.clones[v],p=a[v];if(!p){this.dropClone(m),t.clones.splice(v--,1);continue}m.id!==p.id&&this.templates.has(p.id)&&(this.dropClone(m),t.clones[v]=this.makeClone(p))}for(;t.clones.length<a.length;){const v=a[t.clones.length];if(!this.templates.has(v.id)){this.prepare(v.id);break}t.clones.push(this.makeClone(v))}const o=t.rig.torso*e*3.2,c=this.ground,{back:l,side:h}=c.axes(),u=t.root.position,d=c.foot(u),f=c.height(u),g=new We().setFromUnitVectors(new N(0,0,1),c.n);for(const v of t.clones){const m=v.col-v.row/2,p=Math.round(v.row*3+Math.abs(m)*1.5);let y;for(let w=p;w>=0&&!y;w--)y=t.poses[(t.head-w+Vc*4)%Vc];const M=t.len?this.fit(v.rig,v.def,t.len):e;y&&v.rig.apply(y,r-p/30,v.def.idle?.tail??0);const b=d.clone().addScaledVector(l,v.row*o*.5).addScaledVector(h,m*o*.55);v.root.position.copy(b).addScaledVector(c.n,f),v.root.scale.setScalar(M),v.root.visible=n>.01;for(const w of v.mats)w.opacity=n*(w.userData.baseOpacity??1);v.shadow.position.copy(b).addScaledVector(c.n,.004),v.shadow.quaternion.copy(g),v.shadow.scale.set(o*.42,o*.26,1),v.shadow.visible=v.root.visible,v.def.tick?.(v.root,r-p/30,null)}}makeClone(t){const{def:e,root:n,rig:r,mats:s}=this.instance(t.id);n.traverse(o=>{o.castShadow=!1});const a=new It(cb,ob);return a.renderOrder=1,this.world.add(n,a),{id:t.id,def:e,root:n,rig:r,mats:s,row:t.row,col:t.col,shadow:a}}faces(t,e,n){this.world.updateMatrixWorld();const r=this.world.matrixWorld.clone().invert(),s=[],a=[];for(const l of t){if(l.lost&&l.presence<=0)continue;const h=l.face,u=this.wearers.get(l.id),d=u&&u.root.visible&&!this.hideWearers?u:null,f=Vf(l.world).head,g=(w,T,A)=>new N(w,T,A).applyQuaternion(f),v=new N(l.T.x+l.world[O.nose].x,l.T.y+l.world[O.nose].y,l.T.z+l.world[O.nose].z),m=Math.max(.3,-v.z),p=(w,T,A)=>new N((w*e.w-e.cx)/e.f*m,(e.cy-T*e.h)/e.f*m,-m).addScaledVector(g(0,0,1),A);let y=null,M=null;if(d){d.root.updateMatrixWorld(!0);const w=d.rig.bones.get("head"),T=d.def.segs.find(S=>S.name==="head"),A=w?r.clone().multiply(w.matrixWorld):null,R=d.root.scale.x;if(A&&T&&d.def.face?.eyes){const S=new N(1,0,0).transformDirection(A),E=new N(0,1,0).transformDirection(A),P=new N(0,0,1).transformDirection(A);y=d.def.face.eyes.map(([L,I,B,X])=>({p:new N(L-T.a[0],I-T.a[1],B-T.a[2]).applyMatrix4(A),u:S,v:E,n:P,r:X*R*1.15}))}const x=d.rig.bones.get("jaw"),_=d.def.segs.find(S=>S.name==="jaw");if(x&&_&&d.def.face?.jaw){const S=r.clone().multiply(x.matrixWorld);M={p:new N(_.b[0]-_.a[0],_.b[1]-_.a[1],_.b[2]-_.a[2]).applyMatrix4(S),dir:new N(0,-.2,1).transformDirection(A??S),scale:R*10}}else if(A&&T){const S=new N(0,0,1).transformDirection(A);M={p:(h?p(h.mouth.x,h.mouth.y,0):v.clone()).addScaledVector(S,.12*R*10),dir:S.clone().add(new N(0,-.2,0)).normalize(),scale:R*10}}}if(!y&&h){const w=g(1,0,0),T=g(0,1,0),A=g(0,0,1);y=h.eyes.map(R=>({p:p(R.x,R.y,.02),u:w,v:T,n:A,r:Math.max(.012,R.r*e.w/e.f*m*1.35)}))}!M&&h&&(M={p:p(h.mouth.x,h.mouth.y,.03),dir:g(0,-.2,1).normalize(),scale:1}),s.push({id:l.id,eyes:y,show:l.presence});const b=d?.def.face?.breath;M&&h&&a.push({id:l.id,...M,open:h.jaw*l.presence,colors:b?.colors.map(w=>new Pt(w)),rate:b?.rate,speed:b?.speed,size:b?.size})}this.googly.update(s,this.ground.n,n,this.googlyOn);let o=null;for(const l of t)!l.lost&&l.face?.read&&l.face.probe&&(!o||l.face.mouth.w>o.face.mouth.w)&&(o=l);this.light.face=o?{probe:o.face.probe,w:o.face.mouth.w*2.4}:null;const c=this.renderer.getDrawingBufferSize(new ft).y;this.breath.update(a,n,c/(2*Math.tan(_s.degToRad(this.camera.fov)/2)),this.breathOn)}setGrain(t,e){this.grain.visible=t;const n=this.grain.material.uniforms;n.uTime.value=e;const r=this.renderer.getDrawingBufferSize(new ft);n.uRes.value.set(r.x/1.5,r.y/1.5)}stageSpots(t,e,n,r,s){const a=this.ground,{back:o,side:c}=a.axes(),l=a.foot(s??new N(0,-.3,-3)),h=l.clone().addScaledVector(o,1.1),u=[16769728,16726696,3856639],d=f=>{const g=Es(f,r);return new ft(g.x,1-g.y)};return this.spots.map((f,g)=>{const v=l.clone().addScaledVector(c,(g-1)*2.4).addScaledVector(o,.6).addScaledVector(a.n,3.6),m=h.clone().addScaledVector(c,(g-1)*.9+1.2*Math.sin(e*.33+g*2.1)).addScaledVector(o,.8*Math.cos(e*.27+g*1.3)),p=new Pt(u[g]);f.color.copy(p),f.position.copy(v),f.target.position.copy(m),f.target.updateMatrixWorld(),f.intensity=t?38*(1+.8*n):0;const y=v.distanceTo(m)*Math.tan(f.angle)*.9,M=d(m),b=v.z<-.15?d(v):new ft(M.x,1.4),w=new ft(Math.abs(d(m.clone().addScaledVector(c,y)).x-M.x),Math.abs(d(m.clone().addScaledVector(o,y)).y-M.y));return{L:b,P:M,R:w,C:p.clone().multiplyScalar(1+.8*n)}})}stageLights(t,e,n){const r=[16722324,11796265,16769065,2744575,9187071];this.rims.forEach((s,a)=>{s.intensity=t?2.2+3*n:0;const o=(e*.12+a*.4)%1*r.length,c=Math.floor(o),l=o-c;s.color.setHex(r[c%r.length]).lerp(new Pt(r[(c+1)%r.length]),l)})}people(){return[...this.wearers.values()].filter(t=>t.root.visible).map(t=>t.root.position.clone())}render(t,e,n){this.renderer.shadowMap.enabled=this.opts.shadows,t&&this.light.update(t,e,this.cover.mirror,n,this.people(),this.opts.envLight),this.renderer.render(this.scene,this.camera)}get count(){return this.wearers.size}}const Ii=[{id:"insitu",name:"In Situ",code:12,swatch:"radial-gradient(ellipse at 30% 85%, rgba(255,80,190,0.9), transparent 35%), radial-gradient(ellipse at 72% 80%, rgba(80,220,255,0.9), transparent 35%), linear-gradient(160deg, transparent 40%, rgba(255,240,220,0.35) 50%, transparent 60%), #2a2430"},{id:"tunnel",name:"Tunnel",code:9,swatch:"repeating-radial-gradient(circle, #ff2d95 0 3px, #12071f 3px 8px, #2ee6ff 8px 11px, #12071f 11px 16px)"},{id:"lasers",name:"Lasers",code:10,swatch:"linear-gradient(115deg, transparent 46%, #b6ff2e 48%, transparent 50%), linear-gradient(65deg, transparent 46%, #ff2d95 48%, transparent 50%), linear-gradient(90deg, transparent 47%, #2ee6ff 49%, transparent 51%), #07040d"},{id:"kaleido",name:"Kaleido",code:11,swatch:"conic-gradient(#ff2d95, #ffe62e, #b6ff2e, #2ee6ff, #8a2eff, #ff2d95)"},{id:"rings",name:"Rings",code:5,swatch:"repeating-radial-gradient(circle, #ff3d7f 0 5px, #ffb23d 5px 10px, #3dd6ff 10px 15px, #8c5cff 15px 20px)"},{id:"neon",name:"Neon",code:4,swatch:"radial-gradient(circle, transparent 0 40%, #39ff9c 42% 50%, transparent 54%), #06030f"},{id:"pop",name:"Pop Art",code:1,swatch:"radial-gradient(circle at 30% 30%, #ffde00 0 22%, transparent 23%), radial-gradient(circle at 70% 70%, #ff2d8a 0 22%, transparent 23%), #19c3ff"},{id:"warhol",name:"Warhol",code:2,swatch:"conic-gradient(#ff5fa2 0 25%, #ffd400 0 50%, #2ad4c4 0 75%, #7b5cff 0)"},{id:"echo",name:"Echoes",code:6,swatch:"linear-gradient(90deg, #1b1033, #ff2db4 40%, #2de2ff 70%, #1b1033)"},{id:"disco",name:"Disco",code:7,swatch:"radial-gradient(circle at 30% 30%, #ff4fd8, transparent 45%), radial-gradient(circle at 70% 60%, #4fd1ff, transparent 45%), radial-gradient(circle at 45% 80%, #ffe14f, transparent 40%), #120820"},{id:"solar",name:"Solarize",code:3,swatch:"linear-gradient(135deg, #1a0b3d, #ff7a00 45%, #00e5ff 55%, #2a0b3d)"},{id:"spot",name:"Spotlight",code:0,swatch:"radial-gradient(circle at 50% 40%, #fff6d8, #6a5a40 45%, #120f0a 75%)"}],fb=[[2757440,16727435,16756736,16774084],[731722,46023,16740156,16776160],[2951947,9321727,3997598,16382065],[1058330,16723502,3065343,16769520]],ko=12,_o=`
  varying vec2 vUv;
  void main() { vUv = position.xy * 0.5 + 0.5; gl_Position = vec4(position.xy, 0.0, 1.0); }`,db=`
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
  }`,pb=`
  varying vec2 vUv;
  uniform sampler2D uTex, uMask;
  uniform vec4 uOn;
  void main() {
    vec4 m = smoothstep(0.3, 0.7, texture2D(uMask, vec2(vUv.x, 1.0 - vUv.y))) * uOn;
    gl_FragColor = vec4(texture2D(uTex, vUv).rgb, max(max(m.r, m.g), max(m.b, m.a)));
  }`,mb=`
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
  ${db}

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
    return texture(uHist, vec3(q, mod(uHead - delay + ${ko}.0 * 8.0, ${ko}.0)));
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
  }`,gb=`
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
  }`,vb=`
  varying vec2 vUv;
  uniform sampler2D uSrc;
  uniform vec2 uDir;
  void main() {
    vec3 c = texture2D(uSrc, vUv).rgb * 0.2270270;
    c += (texture2D(uSrc, vUv + uDir * 1.3846154).rgb + texture2D(uSrc, vUv - uDir * 1.3846154).rgb) * 0.3162162;
    c += (texture2D(uSrc, vUv + uDir * 3.2307692).rgb + texture2D(uSrc, vUv - uDir * 3.2307692).rgb) * 0.0702703;
    gl_FragColor = vec4(c, 1.0);
  }`,Xf=`
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
  }`;class xb{material;foreground;_preset=Ii[0];get preset(){return this._preset}set preset(t){t!==this._preset&&(this.fromCode=this._preset.code,this.xfade=this.started?0:1,this._preset=t)}fromCode=0;xfade=1;started=!1;rtOld=null;subjects=2;beat=0;setSpots(t,e){const n=this.scene.uniforms;t.forEach((r,s)=>{n.uSpotL.value[s].copy(r.L),n.uSpotP.value[s].copy(r.P),n.uSpotR.value[s].copy(r.R),n.uSpotC.value[s].copy(r.C)}),n.uSpotK.value=e}clones=!0;pyramid=!0;maskTex;maskData=new Uint8Array(4);mw=0;mh=0;fw=0;fh=0;fxTex;fxData;chans=[null,null,null,null];chanMask=[null,null,null,null];union;dist;trail;stamp;uOn=new le;box=new le(.35,.1,.65,.7);quad=new It(new Pi(2,2));quadScene=new Rd;cam=new bh(-1,1,1,-1,0,1);cut;scene;bright;blur;rtScene=[];rtB1a=null;rtB1b=null;rtB2a=null;rtB2b=null;hist=null;head=0;flip=0;sizeKey="";constructor(t,e){this.maskTex=new ys(new Uint8Array(4),1,1,Xe),this.maskTex.needsUpdate=!0,this.resizeFx(160,90);const n={depthTest:!1,depthWrite:!1,toneMapped:!1};this.cut=new ze({...n,vertexShader:_o,fragmentShader:pb,uniforms:{uTex:t.uTex,uMask:{value:this.maskTex},uOn:{value:this.uOn}}}),this.scene=new ze({...n,vertexShader:_o,fragmentShader:mb,uniforms:{uTex:t.uTex,uMask:{value:this.maskTex},uFx:{value:this.fxTex},uPrev:{value:null},uHist:{value:null},uHead:{value:0},uClones:{value:1},uPyramid:{value:1},uSpotL:{value:[0,1,2].map(()=>new ft(.5,1.2))},uSpotP:{value:[0,1,2].map(()=>new ft(.5,.1))},uSpotR:{value:[0,1,2].map(()=>new ft(.1,.04))},uSpotC:{value:[0,1,2].map(()=>new Pt(0,0,0))},uSpotK:{value:0},uClone:{value:Array.from({length:9},()=>new le)},uCloneN:{value:0},uFoot:{value:new ft(.5,.1)},uFootW:{value:.2},uTime:{value:0},uAspect:{value:1},uBeat:{value:0},uLevel:{value:0},uPreset:{value:0},uOn:{value:this.uOn},uBox:{value:this.box},uPal:{value:fb.flat().map(r=>new Pt(r))}}}),this.bright=new ze({...n,vertexShader:_o,fragmentShader:gb,uniforms:{uSrc:{value:null},uTexel:{value:new ft},uThreshold:{value:.72}}}),this.blur=new ze({...n,vertexShader:_o,fragmentShader:vb,uniforms:{uSrc:{value:null},uDir:{value:new ft}}}),this.material=new ze({...n,vertexShader:e,fragmentShader:Xf,uniforms:{uCrop:t.uCrop,uMirror:t.uMirror,uScene:{value:null},uBloom1:{value:null},uBloom2:{value:null},uTime:{value:0},uBeat:{value:0},uFlash:{value:1},uRes:{value:new ft(1,1)},uOld:{value:null},uMix:{value:1},uCA:{value:1},uBloomK:{value:1}}}),this.foreground=new ze({...n,vertexShader:e,fragmentShader:Xf,transparent:!0,defines:{FG:1},uniforms:{...this.material.uniforms,uMask:this.scene.uniforms.uMask,uOn:this.scene.uniforms.uOn}}),this.quad.frustumCulled=!1,this.quadScene.add(this.quad)}resizeFx(t,e){this.fxTex?.dispose(),this.fxData=new Uint8Array(t*e*4),this.fxTex=new ys(this.fxData,t,e,Xe),this.fxTex.magFilter=_e,this.fxTex.minFilter=_e,this.union=new Float32Array(t*e),this.dist=new Float32Array(t*e),this.trail=new Float32Array(t*e),this.stamp=new Float32Array(t*e);for(let n=0;n<t*e;n++)this.fxData[n*4]=255;this.fxTex.needsUpdate=!0,this.fw=t,this.fh=e,this.scene&&(this.scene.uniforms.uFx.value=this.fxTex)}frameDt=1/30;update(t,e,n,r,s,a){this.frameDt=e;const o=this.scene.uniforms;o.uTime.value=n,o.uAspect.value=r,o.uPreset.value=this.preset.code,o.uBeat.value=this.beat,o.uClones.value=this.clones?1:0,o.uPyramid.value=this.pyramid?1:0,this.material.uniforms.uTime.value=n,this.material.uniforms.uBeat.value=this.beat;const c=this.preset.code===12;this.material.uniforms.uCA.value=c?.25:1,this.material.uniforms.uBloomK.value=c?.45:1;const l=r>=1?160:Math.max(48,Math.round(160*r)),h=r>=1?Math.max(48,Math.round(160/r)):160;(l!==this.fw||h!==this.fh)&&this.resizeFx(l,h);const u=t.filter(m=>m.presence>0).sort((m,p)=>p.len.torso/-p.T.z-m.len.torso/-m.T.z).slice(0,this.subjects),d=new Set(u.map(m=>m.id));for(let m=0;m<4;m++)this.chans[m]!==null&&!d.has(this.chans[m])&&(this.chans[m]=null,this.chanMask[m]=null);for(const m of u){let p=this.chans.indexOf(m.id);if(p<0){if(p=this.chans.indexOf(null),p<0)continue;this.chans[p]=m.id}const y=m.det?.mask;if(y){(y.w!==this.mw||y.h!==this.mh)&&this.resizeMask(y.w,y.h);let M=this.chanMask[p];if(!M||M.length!==y.data.length)M=this.chanMask[p]=new Float32Array(y.data.length),M.set(y.data);else{const b=1-Math.exp(-e/.04),w=y.data;for(let T=0;T<w.length;T++)M[T]=M[T]+(w[T]-M[T])*b}}}const f=[0,0,0,0];for(let m=0;m<4;m++){const p=this.chans[m];p!==null&&this.chanMask[m]&&(f[m]=t.find(y=>y.id===p)?.presence??0)}if(this.uOn.set(f[0],f[1],f[2],f[3]),this.fx(e,n,f),this.layPyramid(u[0],s,a,e),!this.mw)return;const g=this.mw*this.mh,v=this.maskData;for(let m=0;m<4;m++){const p=this.chanMask[m];if(!p){for(let y=0;y<g;y++)v[y*4+m]=0;continue}for(let y=0;y<g;y++)v[y*4+m]=p[y]*255}this.maskTex.needsUpdate=!0}cloneSm=Array.from({length:9},()=>new le);cloneSmN=0;layPyramid(t,e,n,r=1/30){const s=this.scene.uniforms;if(!t||!e||!n){s.uCloneN.value=0,this.cloneSmN=0;return}const a=new N(t.T.x,t.T.y,t.T.z),o=e.foot(a),c=Math.max(1.2,Math.min(2.2,e.height(a)*1.9)),{back:l,side:h}=e.axes(),u=Es(o,n),d=1-Math.exp(-r/.15),f=s.uFoot.value;this.cloneSmN===0?f.set(u.x,1-u.y):f.lerp(new ft(u.x,1-u.y),d),s.uFootW.value=Math.max(.05,this.box.z-this.box.x);const g=[];for(let m=1;m<=3;m++)for(let p=0;p<=m;p++){const y=p-m/2,M=o.clone().addScaledVector(l,m*c*.5).addScaledVector(h,y*c*.55);if(M.z>-.3)continue;const b=Es(M,n);g.push({v:new le(b.x,1-b.y,-o.z/-M.z,m*3+Math.abs(y)*1.5),depth:-M.z})}g.sort((m,p)=>p.depth-m.depth);const v=s.uClone.value;g.forEach((m,p)=>{const y=this.cloneSm[p];this.cloneSmN!==g.length?y.copy(m.v):y.lerp(m.v,d),y.w=m.v.w,v[p].copy(y)}),this.cloneSmN=g.length,s.uCloneN.value=g.length}resizeMask(t,e){this.maskTex.dispose(),this.mw=t,this.mh=e,this.maskData=new Uint8Array(t*e*4),this.maskTex=new ys(this.maskData,t,e,Xe),this.maskTex.magFilter=_e,this.maskTex.minFilter=_e,this.scene.uniforms.uMask.value=this.maskTex,this.cut.uniforms.uMask.value=this.maskTex}fx(t,e,n){const r=this.fw,s=this.fh,a=this.union,o=this.dist;let c=r,l=s,h=-1,u=-1;for(let p=0;p<s;p++){const y=Math.min(this.mh-1,Math.floor((p+.5)/s*this.mh));for(let M=0;M<r;M++){let b=0;if(this.mw){const w=y*this.mw+Math.min(this.mw-1,Math.floor((M+.5)/r*this.mw));for(let T=0;T<4;T++){const A=this.chanMask[T];A&&(b=Math.max(b,A[w]*n[T]))}}a[p*r+M]=b,b>.5&&(M<c&&(c=M),M>h&&(h=M),p<l&&(l=p),p>u&&(u=p))}}if(h>=0){const p=1-Math.exp(-t/.12),y=c/r,M=(h+1)/r,b=1-(u+1)/s,w=1-l/s;this.box.set(this.box.x+(y-this.box.x)*p,this.box.y+(b-this.box.y)*p,this.box.z+(M-this.box.z)*p,this.box.w+(w-this.box.w)*p)}const d=1e6,f=Math.SQRT2;for(let p=0;p<r*s;p++)o[p]=a[p]>.5?0:d;for(let p=0;p<s;p++)for(let y=0;y<r;y++){const M=p*r+y;let b=o[M];y>0&&(b=Math.min(b,o[M-1]+1)),p>0&&(b=Math.min(b,o[M-r]+1),y>0&&(b=Math.min(b,o[M-r-1]+f)),y<r-1&&(b=Math.min(b,o[M-r+1]+f))),o[M]=b}for(let p=s-1;p>=0;p--)for(let y=r-1;y>=0;y--){const M=p*r+y;let b=o[M];y<r-1&&(b=Math.min(b,o[M+1]+1)),p<s-1&&(b=Math.min(b,o[M+r]+1),y<r-1&&(b=Math.min(b,o[M+r+1]+f)),y>0&&(b=Math.min(b,o[M+r-1]+f))),o[M]=b}const g=Math.exp(-t/1.1),v=e*.2%1,m=this.fxData;for(let p=0;p<r*s;p++){const y=a[p];this.trail[p]=Math.max(this.trail[p]*g,y),y>.5&&(this.stamp[p]=v),m[p*4]=Math.min(1,o[p]/48)*255,m[p*4+1]=this.trail[p]*255,m[p*4+2]=this.stamp[p]*255,m[p*4+3]=y*255}this.fxTex.needsUpdate=!0}targets(t,e,n){const s=900/Math.max(e,n),a=Math.max(64,Math.round(e*s)),o=Math.max(64,Math.round(n*s)),c=`${a}x${o}`;if(c===this.sizeKey)return;this.sizeKey=c;for(const p of[...this.rtScene,this.rtB1a,this.rtB1b,this.rtB2a,this.rtB2b,this.rtOld])p?.dispose();this.hist?.dispose();const l=t.extensions,h=l.has("EXT_color_buffer_half_float")||l.has("EXT_color_buffer_float"),u={type:h?Tr:Jn,depthBuffer:!1,magFilter:_e,minFilter:_e};this.bright.uniforms.uThreshold.value=h?.72:.62,this.rtScene=[new on(a,o,u),new on(a,o,u)],this.rtOld=new on(a,o,u);const d=Math.max(16,Math.round(a/4)),f=Math.max(16,Math.round(o/4)),g=Math.max(8,Math.round(a/16)),v=Math.max(8,Math.round(o/16));this.rtB1a=new on(d,f,u),this.rtB1b=new on(d,f,u),this.rtB2a=new on(g,v,u),this.rtB2b=new on(g,v,u);const m=480/Math.max(e,n);this.hist=new p1(Math.round(e*m),Math.round(n*m),ko,{depthBuffer:!1}),this.hist.texture.magFilter=_e,this.hist.texture.minFilter=_e,this.scene.uniforms.uHist.value=this.hist.texture,this.material.uniforms.uRes.value.set(a,o)}pass(t,e,n,r=0){this.quad.material=e,t.setRenderTarget(n,r),t.render(this.quadScene,this.cam)}render(t,e,n){this.targets(t,e,n);const r=t.getRenderTarget();this.head=(this.head+1)%ko,this.pass(t,this.cut,this.hist,this.head),this.scene.uniforms.uHead.value=this.head;const s=this.rtScene[this.flip],a=this.rtScene[1-this.flip];this.flip=1-this.flip,this.scene.uniforms.uPrev.value=a.texture,this.pass(t,this.scene,s),this.started=!0;const o=this.material.uniforms;if(this.xfade<1){this.xfade=Math.min(1,this.xfade+this.frameDt/.45);const f=this.scene.uniforms.uPreset.value;this.scene.uniforms.uPreset.value=this.fromCode,this.pass(t,this.scene,this.rtOld),this.scene.uniforms.uPreset.value=f,o.uOld.value=this.rtOld.texture}const c=this.xfade;o.uMix.value=c*c*(3-2*c);const l=this.bright.uniforms,h=this.blur.uniforms;l.uSrc.value=s.texture,l.uTexel.value.set(1/s.width,1/s.height),this.pass(t,this.bright,this.rtB1a);const u=(f,g,v)=>{for(let m=0;m<v;m++)h.uSrc.value=f.texture,h.uDir.value.set(1.4/f.width,0),this.pass(t,this.blur,g),h.uSrc.value=g.texture,h.uDir.value.set(0,1.4/f.height),this.pass(t,this.blur,f)};u(this.rtB1a,this.rtB1b,1),l.uSrc.value=this.rtB1a.texture,l.uTexel.value.set(1/this.rtB1a.width,1/this.rtB1a.height);const d=l.uThreshold.value;l.uThreshold.value=0,this.pass(t,this.bright,this.rtB2a),l.uThreshold.value=d,u(this.rtB2a,this.rtB2b,2),t.setRenderTarget(r),o.uScene.value=s.texture,o.uBloom1.value=this.rtB1a.texture,o.uBloom2.value=this.rtB2a.texture}}class _b{env=0;level=0;stream=null;ctx=null;an=null;buf=new Uint8Array(0);avg=0;last=0;get on(){return!!this.an}async start(){if(this.an)return;this.stream=await navigator.mediaDevices.getUserMedia({audio:{echoCancellation:!1,noiseSuppression:!1,autoGainControl:!1}});const t=window.AudioContext??window.webkitAudioContext;this.ctx=new t,await this.ctx.resume();const e=this.ctx.createMediaStreamSource(this.stream);this.an=this.ctx.createAnalyser(),this.an.fftSize=1024,this.an.smoothingTimeConstant=0,e.connect(this.an),this.buf=new Uint8Array(this.an.frequencyBinCount)}stop(){for(const t of this.stream?.getTracks()??[])t.stop();this.ctx?.close(),this.stream=null,this.ctx=null,this.an=null,this.env=0,this.level=0}update(t,e){if(this.env*=Math.exp(-t/.18),!this.an||!this.ctx)return;this.an.getByteFrequencyData(this.buf);const n=this.ctx.sampleRate/this.an.fftSize,r=Math.max(1,Math.floor(40/n)),s=Math.max(r+1,Math.ceil(160/n));let a=0;for(let c=r;c<=s;c++)a+=this.buf[c];const o=a/((s-r+1)*255);this.level+=(o-this.level)*Math.min(1,t/.1),this.avg+=(o-this.avg)*Math.min(1,t/1.2),o>this.avg*1.3+.04&&o>.22&&e-this.last>260&&(this.env=1,this.last=e)}}class Mb{up=null;listening=!1;async enable(){const t=window.DeviceOrientationEvent;try{if(t?.requestPermission&&await t.requestPermission()!=="granted")return!1}catch{return!1}return this.listening||(this.listening=!0,window.addEventListener("deviceorientation",e=>{if(e.beta===null||e.gamma===null)return;const n=_s.degToRad(e.beta),r=_s.degToRad(e.gamma);(this.up??=new N).set(-Math.sin(r)*Math.cos(n),Math.sin(n),Math.cos(r)*Math.cos(n)).normalize()})),!0}upInCamera(t){if(!this.up)return null;const e=_s.degToRad(screen.orientation?.angle??window.orientation??0),n=this.up.clone().applyAxisAngle(new N(0,0,1),-e);return t==="user"&&(n.x=-n.x,n.z=-n.z),n}}const tn={tauJaw:.05,tauBlink:.04,tauShape:.1,tauPlace:.05,forgetMs:400};class yb{lm=null;lastTs=-1;inferMs=0;async load(t){const n=await td(()=>import("./vision_bundle-Bk4VIwNi.js"),[],import.meta.url),r=await n.FilesetResolver.forVisionTasks("./mediapipe"),s=a=>n.FaceLandmarker.createFromOptions(r,{baseOptions:{modelAssetPath:"./models/face_landmarker.task",delegate:a},runningMode:"VIDEO",numFaces:t,outputFaceBlendshapes:!0,minFaceDetectionConfidence:.4,minFacePresenceConfidence:.4,minTrackingConfidence:.4});try{this.lm=await s("GPU")}catch{this.lm=await s("CPU")}}async setFaces(t){await this.lm?.setOptions({numFaces:t})}detect(t,e){if(!this.lm)return[];e<=this.lastTs&&(e=this.lastTs+1),this.lastTs=e;const n=performance.now(),r=this.lm.detectForVideo(t,e);return this.inferMs=performance.now()-n,r.faceLandmarks.map((s,a)=>{const o=new Map;for(const c of r.faceBlendshapes[a]?.categories??[])o.set(c.categoryName,c.score);return{pts:s,shapes:o}})}close(){this.lm?.close(),this.lm=null}}const hn=(i,t,e,n)=>i+(t-i)*(1-Math.exp(-e/n)),Jl=(i,t)=>({x:(i.x+t.x)/2,y:(i.y+t.y)/2}),Ea=(i,t,e)=>Math.hypot((i.x-t.x)*e,i.y-t.y);function bb(i,t){const e=i.pts,n=(s,a)=>({...Jl(e[s],e[a]),r:Ea(e[s],e[a],t)*.62/t}),r=s=>i.shapes.get(s)??0;return{eyes:[n(263,362),n(33,133)],mouth:{...Jl(e[13],e[14]),w:Ea(e[61],e[291],t)/t},nose:e[1],probe:[e[151],e[152],e[425],e[205],e[1]].map(s=>({x:s.x,y:s.y})),jaw:Math.min(1,r("jawOpen")*1.4),blinkL:r("eyeBlinkLeft"),blinkR:r("eyeBlinkRight"),smile:(r("mouthSmileLeft")+r("mouthSmileRight"))/2,pucker:r("mouthPucker"),browUp:r("browInnerUp")}}function Sb(i,t){const e=i.image,n=Ea(e[O.eyeL],e[O.eyeR],t)*.3/t;return{eyes:[{x:e[O.eyeL].x,y:e[O.eyeL].y,r:n},{x:e[O.eyeR].x,y:e[O.eyeR].y,r:n}],mouth:{...Jl(e[O.mouthL],e[O.mouthR]),w:Ea(e[O.mouthL],e[O.mouthR],t)/t}}}function wb(i,t,e,n,r){const s=(t??[]).map(o=>bb(o,e)),a=new Set;for(const o of i){if(o.lost)continue;const c=o.image[O.nose];let l=-1,h=1/0;s.forEach((v,m)=>{if(a.has(m))return;const p=Ea(v.nose,c,e),y=Math.max(v.mouth.w*3,.03);p<y*1.5&&p<h&&(h=p,l=m)});const u=l>=0?s[l]:null;l>=0&&a.add(l);const d=u??Sb(o,e);let f=o.face;f||(f=o.face={jaw:0,blinkL:0,blinkR:0,smile:0,pucker:0,browUp:0,eyes:d.eyes.map(v=>({...v})),mouth:{...d.mouth},read:!!u,seen:n});{const v=[...d.eyes,d.mouth],m=[...f.eyes,f.mouth];let p=0,y=0;v.forEach((M,b)=>{p+=M.x-m[b].x,y+=M.y-m[b].y}),p/=v.length,y/=v.length;for(const M of m)M.x+=p,M.y+=y}d.eyes.forEach((v,m)=>{const p=f.eyes[m];p.x=hn(p.x,v.x,r,tn.tauPlace),p.y=hn(p.y,v.y,r,tn.tauPlace),p.r=hn(p.r,v.r,r,tn.tauPlace*3)}),f.mouth.x=hn(f.mouth.x,d.mouth.x,r,tn.tauPlace),f.mouth.y=hn(f.mouth.y,d.mouth.y,r,tn.tauPlace),f.mouth.w=hn(f.mouth.w,d.mouth.w,r,tn.tauPlace*3);const g=u??{jaw:0,blinkL:0,blinkR:0,smile:0,pucker:0,browUp:0};f.jaw=hn(f.jaw,g.jaw,r,tn.tauJaw),f.blinkL=hn(f.blinkL,g.blinkL,r,tn.tauBlink),f.blinkR=hn(f.blinkR,g.blinkR,r,tn.tauBlink),f.smile=hn(f.smile,g.smile,r,tn.tauShape),f.pucker=hn(f.pucker,g.pucker,r,tn.tauShape),f.browUp=hn(f.browUp,g.browUp,r,tn.tauShape),u?(f.probe?u.probe.forEach((v,m)=>{const p=f.probe[m];p.x=hn(p.x,v.x,r,tn.tauPlace),p.y=hn(p.y,v.y,r,tn.tauPlace)}):f.probe=u.probe.map(v=>({...v})),f.read=!0,f.seen=n):n-f.seen>tn.forgetMs&&(f.read=!1,f.probe=void 0)}}const cs={people:2,model:"full",size:1,lens:.85,envLight:!0,shadows:!0,debug:!1,mode:"one",costume:"jimothy",scene:"costume",effect:"insitu",partyCostumes:"behind",music:!1,faces:!0,googly:!1,breath:!0,partyCast:"skeleton",pyramid:!0,cast:["jimothy","builder","skeleton","pumpkin","howler","violet","plume"],v:5},U0="costuma26.settings";function Eb(){try{const i=JSON.parse(localStorage.getItem(U0)??"{}"),t=i.v??(Object.keys(i).length?1:cs.v),e={...cs,...i},n=e.partyCostumes;return n===!0?e.partyCostumes="on":n!=="behind"&&n!=="on"&&(e.partyCostumes="off"),t<2&&(e.effect="insitu",e.partyCostumes="behind",e.partyCast="skeleton"),t<3&&(e.model="full"),t<4&&(e.effect==="pyramid"&&(e.effect="insitu"),e.pyramid=!0),t<5&&(e.cast=[...cs.cast]),(!Array.isArray(e.cast)||!e.cast.length)&&(e.cast=[...cs.cast]),e.costume==="valkyrie"&&(e.costume="violet"),e.partyCast==="valkyrie"&&(e.partyCast="violet"),e.v=cs.v,e}catch{return{...cs}}}function Tb(i){try{localStorage.setItem(U0,JSON.stringify(i))}catch{}}const na=i=>`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${i}</svg>`,Ti={qr:na('<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><path d="M14 14h3v3h-3zM20 14v.01M14 20h.01M17 20h4v-3"/>'),flip:na('<path d="M4 7h3l2-3h6l2 3h3a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1z"/><path d="M9 13a3 3 0 0 1 5-2.2M15 13a3 3 0 0 1-5 2.2"/><path d="M14 9v2h-2M10 17v-2h2"/>'),gear:na('<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/>'),camera:na('<path d="M4 8h3l2-3h6l2 3h3a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1z"/><circle cx="12" cy="13" r="3.5"/>'),googly:'<svg viewBox="0 0 24 24"><circle cx="7.5" cy="12" r="5.5" fill="#fff" stroke="currentColor" stroke-width="1.5"/><circle cx="16.5" cy="12" r="5.5" fill="#fff" stroke="currentColor" stroke-width="1.5"/><circle cx="6.5" cy="14.2" r="2.4" fill="#111"/><circle cx="17.8" cy="13.6" r="2.4" fill="#111"/></svg>',pyramid:na('<circle cx="12" cy="5" r="2"/><circle cx="8" cy="12" r="2"/><circle cx="16" cy="12" r="2"/><circle cx="4" cy="19" r="2"/><circle cx="12" cy="19" r="2"/><circle cx="20" cy="19" r="2"/>'),rec:'<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="7" fill="currentColor"/></svg>',stop:'<svg viewBox="0 0 24 24"><rect x="6" y="6" width="12" height="12" rx="2" fill="currentColor"/></svg>'};function Ab(i){return i&&i.__esModule&&Object.prototype.hasOwnProperty.call(i,"default")?i.default:i}var Gc={exports:{}},qf;function Rb(){return qf||(qf=1,(function(i,t){var e=(function(){var n=function(w,T){var A=236,R=17,x=w,_=s[T],S=null,E=0,P=null,L=[],I={},B=function(k,G){E=x*4+17,S=(function(z){for(var K=new Array(z),et=0;et<z;et+=1){K[et]=new Array(z);for(var U=0;U<z;U+=1)K[et][U]=null}return K})(E),X(0,0),X(E-7,0),X(0,E-7),lt(),it(),vt(k,G),x>=7&&dt(k),P==null&&(P=ot(x,_,L)),wt(P,G)},X=function(k,G){for(var z=-1;z<=7;z+=1)if(!(k+z<=-1||E<=k+z))for(var K=-1;K<=7;K+=1)G+K<=-1||E<=G+K||(0<=z&&z<=6&&(K==0||K==6)||0<=K&&K<=6&&(z==0||z==6)||2<=z&&z<=4&&2<=K&&K<=4?S[k+z][G+K]=!0:S[k+z][G+K]=!1)},H=function(){for(var k=0,G=0,z=0;z<8;z+=1){B(!0,z);var K=o.getLostPoint(I);(z==0||k>K)&&(k=K,G=z)}return G},it=function(){for(var k=8;k<E-8;k+=1)S[k][6]==null&&(S[k][6]=k%2==0);for(var G=8;G<E-8;G+=1)S[6][G]==null&&(S[6][G]=G%2==0)},lt=function(){for(var k=o.getPatternPosition(x),G=0;G<k.length;G+=1)for(var z=0;z<k.length;z+=1){var K=k[G],et=k[z];if(S[K][et]==null)for(var U=-2;U<=2;U+=1)for(var J=-2;J<=2;J+=1)U==-2||U==2||J==-2||J==2||U==0&&J==0?S[K+U][et+J]=!0:S[K+U][et+J]=!1}},dt=function(k){for(var G=o.getBCHTypeNumber(x),z=0;z<18;z+=1){var K=!k&&(G>>z&1)==1;S[Math.floor(z/3)][z%3+E-8-3]=K}for(var z=0;z<18;z+=1){var K=!k&&(G>>z&1)==1;S[z%3+E-8-3][Math.floor(z/3)]=K}},vt=function(k,G){for(var z=_<<3|G,K=o.getBCHTypeInfo(z),et=0;et<15;et+=1){var U=!k&&(K>>et&1)==1;et<6?S[et][8]=U:et<8?S[et+1][8]=U:S[E-15+et][8]=U}for(var et=0;et<15;et+=1){var U=!k&&(K>>et&1)==1;et<8?S[8][E-et-1]=U:et<9?S[8][15-et-1+1]=U:S[8][15-et-1]=U}S[E-8][8]=!k},wt=function(k,G){for(var z=-1,K=E-1,et=7,U=0,J=o.getMaskFunction(G),j=E-1;j>0;j-=2)for(j==6&&(j-=1);;){for(var Q=0;Q<2;Q+=1)if(S[K][j-Q]==null){var st=!1;U<k.length&&(st=(k[U]>>>et&1)==1);var ut=J(K,j-Q);ut&&(st=!st),S[K][j-Q]=st,et-=1,et==-1&&(U+=1,et=7)}if(K+=z,K<0||E<=K){K-=z,z=-z;break}}},Ft=function(k,G){for(var z=0,K=0,et=0,U=new Array(G.length),J=new Array(G.length),j=0;j<G.length;j+=1){var Q=G[j].dataCount,st=G[j].totalCount-Q;K=Math.max(K,Q),et=Math.max(et,st),U[j]=new Array(Q);for(var ut=0;ut<U[j].length;ut+=1)U[j][ut]=255&k.getBuffer()[ut+z];z+=Q;var mt=o.getErrorCorrectPolynomial(st),xt=l(U[j],mt.getLength()-1),Jt=xt.mod(mt);J[j]=new Array(mt.getLength()-1);for(var ut=0;ut<J[j].length;ut+=1){var $t=ut+Jt.getLength()-J[j].length;J[j][ut]=$t>=0?Jt.getAt($t):0}}for(var F=0,ut=0;ut<G.length;ut+=1)F+=G[ut].totalCount;for(var C=new Array(F),$=0,ut=0;ut<K;ut+=1)for(var j=0;j<G.length;j+=1)ut<U[j].length&&(C[$]=U[j][ut],$+=1);for(var ut=0;ut<et;ut+=1)for(var j=0;j<G.length;j+=1)ut<J[j].length&&(C[$]=J[j][ut],$+=1);return C},ot=function(k,G,z){for(var K=h.getRSBlocks(k,G),et=u(),U=0;U<z.length;U+=1){var J=z[U];et.put(J.getMode(),4),et.put(J.getLength(),o.getLengthInBits(J.getMode(),k)),J.write(et)}for(var j=0,U=0;U<K.length;U+=1)j+=K[U].dataCount;if(et.getLengthInBits()>j*8)throw"code length overflow. ("+et.getLengthInBits()+">"+j*8+")";for(et.getLengthInBits()+4<=j*8&&et.put(0,4);et.getLengthInBits()%8!=0;)et.putBit(!1);for(;!(et.getLengthInBits()>=j*8||(et.put(A,8),et.getLengthInBits()>=j*8));)et.put(R,8);return Ft(et,K)};I.addData=function(k,G){G=G||"Byte";var z=null;switch(G){case"Numeric":z=d(k);break;case"Alphanumeric":z=f(k);break;case"Byte":z=g(k);break;case"Kanji":z=v(k);break;default:throw"mode:"+G}L.push(z),P=null},I.isDark=function(k,G){if(k<0||E<=k||G<0||E<=G)throw k+","+G;return S[k][G]},I.getModuleCount=function(){return E},I.make=function(){if(x<1){for(var k=1;k<40;k++){for(var G=h.getRSBlocks(k,_),z=u(),K=0;K<L.length;K++){var et=L[K];z.put(et.getMode(),4),z.put(et.getLength(),o.getLengthInBits(et.getMode(),k)),et.write(z)}for(var U=0,K=0;K<G.length;K++)U+=G[K].dataCount;if(z.getLengthInBits()<=U*8)break}x=k}B(!1,H())},I.createTableTag=function(k,G){k=k||2,G=typeof G>"u"?k*4:G;var z="";z+='<table style="',z+=" border-width: 0px; border-style: none;",z+=" border-collapse: collapse;",z+=" padding: 0px; margin: "+G+"px;",z+='">',z+="<tbody>";for(var K=0;K<I.getModuleCount();K+=1){z+="<tr>";for(var et=0;et<I.getModuleCount();et+=1)z+='<td style="',z+=" border-width: 0px; border-style: none;",z+=" border-collapse: collapse;",z+=" padding: 0px; margin: 0px;",z+=" width: "+k+"px;",z+=" height: "+k+"px;",z+=" background-color: ",z+=I.isDark(K,et)?"#000000":"#ffffff",z+=";",z+='"/>';z+="</tr>"}return z+="</tbody>",z+="</table>",z},I.createSvgTag=function(k,G,z,K){var et={};typeof arguments[0]=="object"&&(et=arguments[0],k=et.cellSize,G=et.margin,z=et.alt,K=et.title),k=k||2,G=typeof G>"u"?k*4:G,z=typeof z=="string"?{text:z}:z||{},z.text=z.text||null,z.id=z.text?z.id||"qrcode-description":null,K=typeof K=="string"?{text:K}:K||{},K.text=K.text||null,K.id=K.text?K.id||"qrcode-title":null;var U=I.getModuleCount()*k+G*2,J,j,Q,st,ut="",mt;for(mt="l"+k+",0 0,"+k+" -"+k+",0 0,-"+k+"z ",ut+='<svg version="1.1" xmlns="http://www.w3.org/2000/svg"',ut+=et.scalable?"":' width="'+U+'px" height="'+U+'px"',ut+=' viewBox="0 0 '+U+" "+U+'" ',ut+=' preserveAspectRatio="xMinYMin meet"',ut+=K.text||z.text?' role="img" aria-labelledby="'+V([K.id,z.id].join(" ").trim())+'"':"",ut+=">",ut+=K.text?'<title id="'+V(K.id)+'">'+V(K.text)+"</title>":"",ut+=z.text?'<description id="'+V(z.id)+'">'+V(z.text)+"</description>":"",ut+='<rect width="100%" height="100%" fill="white" cx="0" cy="0"/>',ut+='<path d="',Q=0;Q<I.getModuleCount();Q+=1)for(st=Q*k+G,J=0;J<I.getModuleCount();J+=1)I.isDark(Q,J)&&(j=J*k+G,ut+="M"+j+","+st+mt);return ut+='" stroke="transparent" fill="black"/>',ut+="</svg>",ut},I.createDataURL=function(k,G){k=k||2,G=typeof G>"u"?k*4:G;var z=I.getModuleCount()*k+G*2,K=G,et=z-G;return b(z,z,function(U,J){if(K<=U&&U<et&&K<=J&&J<et){var j=Math.floor((U-K)/k),Q=Math.floor((J-K)/k);return I.isDark(Q,j)?0:1}else return 1})},I.createImgTag=function(k,G,z){k=k||2,G=typeof G>"u"?k*4:G;var K=I.getModuleCount()*k+G*2,et="";return et+="<img",et+=' src="',et+=I.createDataURL(k,G),et+='"',et+=' width="',et+=K,et+='"',et+=' height="',et+=K,et+='"',z&&(et+=' alt="',et+=V(z),et+='"'),et+="/>",et};var V=function(k){for(var G="",z=0;z<k.length;z+=1){var K=k.charAt(z);switch(K){case"<":G+="&lt;";break;case">":G+="&gt;";break;case"&":G+="&amp;";break;case'"':G+="&quot;";break;default:G+=K;break}}return G},Z=function(k){var G=1;k=typeof k>"u"?G*2:k;var z=I.getModuleCount()*G+k*2,K=k,et=z-k,U,J,j,Q,st,ut={"██":"█","█ ":"▀"," █":"▄","  ":" "},mt={"██":"▀","█ ":"▀"," █":" ","  ":" "},xt="";for(U=0;U<z;U+=2){for(j=Math.floor((U-K)/G),Q=Math.floor((U+1-K)/G),J=0;J<z;J+=1)st="█",K<=J&&J<et&&K<=U&&U<et&&I.isDark(j,Math.floor((J-K)/G))&&(st=" "),K<=J&&J<et&&K<=U+1&&U+1<et&&I.isDark(Q,Math.floor((J-K)/G))?st+=" ":st+="█",xt+=k<1&&U+1>=et?mt[st]:ut[st];xt+=`
`}return z%2&&k>0?xt.substring(0,xt.length-z-1)+Array(z+1).join("▀"):xt.substring(0,xt.length-1)};return I.createASCII=function(k,G){if(k=k||1,k<2)return Z(G);k-=1,G=typeof G>"u"?k*2:G;var z=I.getModuleCount()*k+G*2,K=G,et=z-G,U,J,j,Q,st=Array(k+1).join("██"),ut=Array(k+1).join("  "),mt="",xt="";for(U=0;U<z;U+=1){for(j=Math.floor((U-K)/k),xt="",J=0;J<z;J+=1)Q=1,K<=J&&J<et&&K<=U&&U<et&&I.isDark(j,Math.floor((J-K)/k))&&(Q=0),xt+=Q?st:ut;for(j=0;j<k;j+=1)mt+=xt+`
`}return mt.substring(0,mt.length-1)},I.renderTo2dContext=function(k,G){G=G||2;for(var z=I.getModuleCount(),K=0;K<z;K++)for(var et=0;et<z;et++)k.fillStyle=I.isDark(K,et)?"black":"white",k.fillRect(K*G,et*G,G,G)},I};n.stringToBytesFuncs={default:function(w){for(var T=[],A=0;A<w.length;A+=1){var R=w.charCodeAt(A);T.push(R&255)}return T}},n.stringToBytes=n.stringToBytesFuncs.default,n.createStringToBytes=function(w,T){var A=(function(){for(var x=y(w),_=function(){var it=x.read();if(it==-1)throw"eof";return it},S=0,E={};;){var P=x.read();if(P==-1)break;var L=_(),I=_(),B=_(),X=String.fromCharCode(P<<8|L),H=I<<8|B;E[X]=H,S+=1}if(S!=T)throw S+" != "+T;return E})(),R=63;return function(x){for(var _=[],S=0;S<x.length;S+=1){var E=x.charCodeAt(S);if(E<128)_.push(E);else{var P=A[x.charAt(S)];typeof P=="number"?(P&255)==P?_.push(P):(_.push(P>>>8),_.push(P&255)):_.push(R)}}return _}};var r={MODE_NUMBER:1,MODE_ALPHA_NUM:2,MODE_8BIT_BYTE:4,MODE_KANJI:8},s={L:1,M:0,Q:3,H:2},a={PATTERN000:0,PATTERN001:1,PATTERN010:2,PATTERN011:3,PATTERN100:4,PATTERN101:5,PATTERN110:6,PATTERN111:7},o=(function(){var w=[[],[6,18],[6,22],[6,26],[6,30],[6,34],[6,22,38],[6,24,42],[6,26,46],[6,28,50],[6,30,54],[6,32,58],[6,34,62],[6,26,46,66],[6,26,48,70],[6,26,50,74],[6,30,54,78],[6,30,56,82],[6,30,58,86],[6,34,62,90],[6,28,50,72,94],[6,26,50,74,98],[6,30,54,78,102],[6,28,54,80,106],[6,32,58,84,110],[6,30,58,86,114],[6,34,62,90,118],[6,26,50,74,98,122],[6,30,54,78,102,126],[6,26,52,78,104,130],[6,30,56,82,108,134],[6,34,60,86,112,138],[6,30,58,86,114,142],[6,34,62,90,118,146],[6,30,54,78,102,126,150],[6,24,50,76,102,128,154],[6,28,54,80,106,132,158],[6,32,58,84,110,136,162],[6,26,54,82,110,138,166],[6,30,58,86,114,142,170]],T=1335,A=7973,R=21522,x={},_=function(S){for(var E=0;S!=0;)E+=1,S>>>=1;return E};return x.getBCHTypeInfo=function(S){for(var E=S<<10;_(E)-_(T)>=0;)E^=T<<_(E)-_(T);return(S<<10|E)^R},x.getBCHTypeNumber=function(S){for(var E=S<<12;_(E)-_(A)>=0;)E^=A<<_(E)-_(A);return S<<12|E},x.getPatternPosition=function(S){return w[S-1]},x.getMaskFunction=function(S){switch(S){case a.PATTERN000:return function(E,P){return(E+P)%2==0};case a.PATTERN001:return function(E,P){return E%2==0};case a.PATTERN010:return function(E,P){return P%3==0};case a.PATTERN011:return function(E,P){return(E+P)%3==0};case a.PATTERN100:return function(E,P){return(Math.floor(E/2)+Math.floor(P/3))%2==0};case a.PATTERN101:return function(E,P){return E*P%2+E*P%3==0};case a.PATTERN110:return function(E,P){return(E*P%2+E*P%3)%2==0};case a.PATTERN111:return function(E,P){return(E*P%3+(E+P)%2)%2==0};default:throw"bad maskPattern:"+S}},x.getErrorCorrectPolynomial=function(S){for(var E=l([1],0),P=0;P<S;P+=1)E=E.multiply(l([1,c.gexp(P)],0));return E},x.getLengthInBits=function(S,E){if(1<=E&&E<10)switch(S){case r.MODE_NUMBER:return 10;case r.MODE_ALPHA_NUM:return 9;case r.MODE_8BIT_BYTE:return 8;case r.MODE_KANJI:return 8;default:throw"mode:"+S}else if(E<27)switch(S){case r.MODE_NUMBER:return 12;case r.MODE_ALPHA_NUM:return 11;case r.MODE_8BIT_BYTE:return 16;case r.MODE_KANJI:return 10;default:throw"mode:"+S}else if(E<41)switch(S){case r.MODE_NUMBER:return 14;case r.MODE_ALPHA_NUM:return 13;case r.MODE_8BIT_BYTE:return 16;case r.MODE_KANJI:return 12;default:throw"mode:"+S}else throw"type:"+E},x.getLostPoint=function(S){for(var E=S.getModuleCount(),P=0,L=0;L<E;L+=1)for(var I=0;I<E;I+=1){for(var B=0,X=S.isDark(L,I),H=-1;H<=1;H+=1)if(!(L+H<0||E<=L+H))for(var it=-1;it<=1;it+=1)I+it<0||E<=I+it||H==0&&it==0||X==S.isDark(L+H,I+it)&&(B+=1);B>5&&(P+=3+B-5)}for(var L=0;L<E-1;L+=1)for(var I=0;I<E-1;I+=1){var lt=0;S.isDark(L,I)&&(lt+=1),S.isDark(L+1,I)&&(lt+=1),S.isDark(L,I+1)&&(lt+=1),S.isDark(L+1,I+1)&&(lt+=1),(lt==0||lt==4)&&(P+=3)}for(var L=0;L<E;L+=1)for(var I=0;I<E-6;I+=1)S.isDark(L,I)&&!S.isDark(L,I+1)&&S.isDark(L,I+2)&&S.isDark(L,I+3)&&S.isDark(L,I+4)&&!S.isDark(L,I+5)&&S.isDark(L,I+6)&&(P+=40);for(var I=0;I<E;I+=1)for(var L=0;L<E-6;L+=1)S.isDark(L,I)&&!S.isDark(L+1,I)&&S.isDark(L+2,I)&&S.isDark(L+3,I)&&S.isDark(L+4,I)&&!S.isDark(L+5,I)&&S.isDark(L+6,I)&&(P+=40);for(var dt=0,I=0;I<E;I+=1)for(var L=0;L<E;L+=1)S.isDark(L,I)&&(dt+=1);var vt=Math.abs(100*dt/E/E-50)/5;return P+=vt*10,P},x})(),c=(function(){for(var w=new Array(256),T=new Array(256),A=0;A<8;A+=1)w[A]=1<<A;for(var A=8;A<256;A+=1)w[A]=w[A-4]^w[A-5]^w[A-6]^w[A-8];for(var A=0;A<255;A+=1)T[w[A]]=A;var R={};return R.glog=function(x){if(x<1)throw"glog("+x+")";return T[x]},R.gexp=function(x){for(;x<0;)x+=255;for(;x>=256;)x-=255;return w[x]},R})();function l(w,T){if(typeof w.length>"u")throw w.length+"/"+T;var A=(function(){for(var x=0;x<w.length&&w[x]==0;)x+=1;for(var _=new Array(w.length-x+T),S=0;S<w.length-x;S+=1)_[S]=w[S+x];return _})(),R={};return R.getAt=function(x){return A[x]},R.getLength=function(){return A.length},R.multiply=function(x){for(var _=new Array(R.getLength()+x.getLength()-1),S=0;S<R.getLength();S+=1)for(var E=0;E<x.getLength();E+=1)_[S+E]^=c.gexp(c.glog(R.getAt(S))+c.glog(x.getAt(E)));return l(_,0)},R.mod=function(x){if(R.getLength()-x.getLength()<0)return R;for(var _=c.glog(R.getAt(0))-c.glog(x.getAt(0)),S=new Array(R.getLength()),E=0;E<R.getLength();E+=1)S[E]=R.getAt(E);for(var E=0;E<x.getLength();E+=1)S[E]^=c.gexp(c.glog(x.getAt(E))+_);return l(S,0).mod(x)},R}var h=(function(){var w=[[1,26,19],[1,26,16],[1,26,13],[1,26,9],[1,44,34],[1,44,28],[1,44,22],[1,44,16],[1,70,55],[1,70,44],[2,35,17],[2,35,13],[1,100,80],[2,50,32],[2,50,24],[4,25,9],[1,134,108],[2,67,43],[2,33,15,2,34,16],[2,33,11,2,34,12],[2,86,68],[4,43,27],[4,43,19],[4,43,15],[2,98,78],[4,49,31],[2,32,14,4,33,15],[4,39,13,1,40,14],[2,121,97],[2,60,38,2,61,39],[4,40,18,2,41,19],[4,40,14,2,41,15],[2,146,116],[3,58,36,2,59,37],[4,36,16,4,37,17],[4,36,12,4,37,13],[2,86,68,2,87,69],[4,69,43,1,70,44],[6,43,19,2,44,20],[6,43,15,2,44,16],[4,101,81],[1,80,50,4,81,51],[4,50,22,4,51,23],[3,36,12,8,37,13],[2,116,92,2,117,93],[6,58,36,2,59,37],[4,46,20,6,47,21],[7,42,14,4,43,15],[4,133,107],[8,59,37,1,60,38],[8,44,20,4,45,21],[12,33,11,4,34,12],[3,145,115,1,146,116],[4,64,40,5,65,41],[11,36,16,5,37,17],[11,36,12,5,37,13],[5,109,87,1,110,88],[5,65,41,5,66,42],[5,54,24,7,55,25],[11,36,12,7,37,13],[5,122,98,1,123,99],[7,73,45,3,74,46],[15,43,19,2,44,20],[3,45,15,13,46,16],[1,135,107,5,136,108],[10,74,46,1,75,47],[1,50,22,15,51,23],[2,42,14,17,43,15],[5,150,120,1,151,121],[9,69,43,4,70,44],[17,50,22,1,51,23],[2,42,14,19,43,15],[3,141,113,4,142,114],[3,70,44,11,71,45],[17,47,21,4,48,22],[9,39,13,16,40,14],[3,135,107,5,136,108],[3,67,41,13,68,42],[15,54,24,5,55,25],[15,43,15,10,44,16],[4,144,116,4,145,117],[17,68,42],[17,50,22,6,51,23],[19,46,16,6,47,17],[2,139,111,7,140,112],[17,74,46],[7,54,24,16,55,25],[34,37,13],[4,151,121,5,152,122],[4,75,47,14,76,48],[11,54,24,14,55,25],[16,45,15,14,46,16],[6,147,117,4,148,118],[6,73,45,14,74,46],[11,54,24,16,55,25],[30,46,16,2,47,17],[8,132,106,4,133,107],[8,75,47,13,76,48],[7,54,24,22,55,25],[22,45,15,13,46,16],[10,142,114,2,143,115],[19,74,46,4,75,47],[28,50,22,6,51,23],[33,46,16,4,47,17],[8,152,122,4,153,123],[22,73,45,3,74,46],[8,53,23,26,54,24],[12,45,15,28,46,16],[3,147,117,10,148,118],[3,73,45,23,74,46],[4,54,24,31,55,25],[11,45,15,31,46,16],[7,146,116,7,147,117],[21,73,45,7,74,46],[1,53,23,37,54,24],[19,45,15,26,46,16],[5,145,115,10,146,116],[19,75,47,10,76,48],[15,54,24,25,55,25],[23,45,15,25,46,16],[13,145,115,3,146,116],[2,74,46,29,75,47],[42,54,24,1,55,25],[23,45,15,28,46,16],[17,145,115],[10,74,46,23,75,47],[10,54,24,35,55,25],[19,45,15,35,46,16],[17,145,115,1,146,116],[14,74,46,21,75,47],[29,54,24,19,55,25],[11,45,15,46,46,16],[13,145,115,6,146,116],[14,74,46,23,75,47],[44,54,24,7,55,25],[59,46,16,1,47,17],[12,151,121,7,152,122],[12,75,47,26,76,48],[39,54,24,14,55,25],[22,45,15,41,46,16],[6,151,121,14,152,122],[6,75,47,34,76,48],[46,54,24,10,55,25],[2,45,15,64,46,16],[17,152,122,4,153,123],[29,74,46,14,75,47],[49,54,24,10,55,25],[24,45,15,46,46,16],[4,152,122,18,153,123],[13,74,46,32,75,47],[48,54,24,14,55,25],[42,45,15,32,46,16],[20,147,117,4,148,118],[40,75,47,7,76,48],[43,54,24,22,55,25],[10,45,15,67,46,16],[19,148,118,6,149,119],[18,75,47,31,76,48],[34,54,24,34,55,25],[20,45,15,61,46,16]],T=function(x,_){var S={};return S.totalCount=x,S.dataCount=_,S},A={},R=function(x,_){switch(_){case s.L:return w[(x-1)*4+0];case s.M:return w[(x-1)*4+1];case s.Q:return w[(x-1)*4+2];case s.H:return w[(x-1)*4+3];default:return}};return A.getRSBlocks=function(x,_){var S=R(x,_);if(typeof S>"u")throw"bad rs block @ typeNumber:"+x+"/errorCorrectionLevel:"+_;for(var E=S.length/3,P=[],L=0;L<E;L+=1)for(var I=S[L*3+0],B=S[L*3+1],X=S[L*3+2],H=0;H<I;H+=1)P.push(T(B,X));return P},A})(),u=function(){var w=[],T=0,A={};return A.getBuffer=function(){return w},A.getAt=function(R){var x=Math.floor(R/8);return(w[x]>>>7-R%8&1)==1},A.put=function(R,x){for(var _=0;_<x;_+=1)A.putBit((R>>>x-_-1&1)==1)},A.getLengthInBits=function(){return T},A.putBit=function(R){var x=Math.floor(T/8);w.length<=x&&w.push(0),R&&(w[x]|=128>>>T%8),T+=1},A},d=function(w){var T=r.MODE_NUMBER,A=w,R={};R.getMode=function(){return T},R.getLength=function(S){return A.length},R.write=function(S){for(var E=A,P=0;P+2<E.length;)S.put(x(E.substring(P,P+3)),10),P+=3;P<E.length&&(E.length-P==1?S.put(x(E.substring(P,P+1)),4):E.length-P==2&&S.put(x(E.substring(P,P+2)),7))};var x=function(S){for(var E=0,P=0;P<S.length;P+=1)E=E*10+_(S.charAt(P));return E},_=function(S){if("0"<=S&&S<="9")return S.charCodeAt(0)-48;throw"illegal char :"+S};return R},f=function(w){var T=r.MODE_ALPHA_NUM,A=w,R={};R.getMode=function(){return T},R.getLength=function(_){return A.length},R.write=function(_){for(var S=A,E=0;E+1<S.length;)_.put(x(S.charAt(E))*45+x(S.charAt(E+1)),11),E+=2;E<S.length&&_.put(x(S.charAt(E)),6)};var x=function(_){if("0"<=_&&_<="9")return _.charCodeAt(0)-48;if("A"<=_&&_<="Z")return _.charCodeAt(0)-65+10;switch(_){case" ":return 36;case"$":return 37;case"%":return 38;case"*":return 39;case"+":return 40;case"-":return 41;case".":return 42;case"/":return 43;case":":return 44;default:throw"illegal char :"+_}};return R},g=function(w){var T=r.MODE_8BIT_BYTE,A=n.stringToBytes(w),R={};return R.getMode=function(){return T},R.getLength=function(x){return A.length},R.write=function(x){for(var _=0;_<A.length;_+=1)x.put(A[_],8)},R},v=function(w){var T=r.MODE_KANJI,A=n.stringToBytesFuncs.SJIS;if(!A)throw"sjis not supported.";(function(_,S){var E=A(_);if(E.length!=2||(E[0]<<8|E[1])!=S)throw"sjis not supported."})("友",38726);var R=A(w),x={};return x.getMode=function(){return T},x.getLength=function(_){return~~(R.length/2)},x.write=function(_){for(var S=R,E=0;E+1<S.length;){var P=(255&S[E])<<8|255&S[E+1];if(33088<=P&&P<=40956)P-=33088;else if(57408<=P&&P<=60351)P-=49472;else throw"illegal char at "+(E+1)+"/"+P;P=(P>>>8&255)*192+(P&255),_.put(P,13),E+=2}if(E<S.length)throw"illegal char at "+(E+1)},x},m=function(){var w=[],T={};return T.writeByte=function(A){w.push(A&255)},T.writeShort=function(A){T.writeByte(A),T.writeByte(A>>>8)},T.writeBytes=function(A,R,x){R=R||0,x=x||A.length;for(var _=0;_<x;_+=1)T.writeByte(A[_+R])},T.writeString=function(A){for(var R=0;R<A.length;R+=1)T.writeByte(A.charCodeAt(R))},T.toByteArray=function(){return w},T.toString=function(){var A="";A+="[";for(var R=0;R<w.length;R+=1)R>0&&(A+=","),A+=w[R];return A+="]",A},T},p=function(){var w=0,T=0,A=0,R="",x={},_=function(E){R+=String.fromCharCode(S(E&63))},S=function(E){if(!(E<0)){if(E<26)return 65+E;if(E<52)return 97+(E-26);if(E<62)return 48+(E-52);if(E==62)return 43;if(E==63)return 47}throw"n:"+E};return x.writeByte=function(E){for(w=w<<8|E&255,T+=8,A+=1;T>=6;)_(w>>>T-6),T-=6},x.flush=function(){if(T>0&&(_(w<<6-T),w=0,T=0),A%3!=0)for(var E=3-A%3,P=0;P<E;P+=1)R+="="},x.toString=function(){return R},x},y=function(w){var T=w,A=0,R=0,x=0,_={};_.read=function(){for(;x<8;){if(A>=T.length){if(x==0)return-1;throw"unexpected end of file./"+x}var E=T.charAt(A);if(A+=1,E=="=")return x=0,-1;if(E.match(/^\s$/))continue;R=R<<6|S(E.charCodeAt(0)),x+=6}var P=R>>>x-8&255;return x-=8,P};var S=function(E){if(65<=E&&E<=90)return E-65;if(97<=E&&E<=122)return E-97+26;if(48<=E&&E<=57)return E-48+52;if(E==43)return 62;if(E==47)return 63;throw"c:"+E};return _},M=function(w,T){var A=w,R=T,x=new Array(w*T),_={};_.setPixel=function(L,I,B){x[I*A+L]=B},_.write=function(L){L.writeString("GIF87a"),L.writeShort(A),L.writeShort(R),L.writeByte(128),L.writeByte(0),L.writeByte(0),L.writeByte(0),L.writeByte(0),L.writeByte(0),L.writeByte(255),L.writeByte(255),L.writeByte(255),L.writeString(","),L.writeShort(0),L.writeShort(0),L.writeShort(A),L.writeShort(R),L.writeByte(0);var I=2,B=E(I);L.writeByte(I);for(var X=0;B.length-X>255;)L.writeByte(255),L.writeBytes(B,X,255),X+=255;L.writeByte(B.length-X),L.writeBytes(B,X,B.length-X),L.writeByte(0),L.writeString(";")};var S=function(L){var I=L,B=0,X=0,H={};return H.write=function(it,lt){if(it>>>lt)throw"length over";for(;B+lt>=8;)I.writeByte(255&(it<<B|X)),lt-=8-B,it>>>=8-B,X=0,B=0;X=it<<B|X,B=B+lt},H.flush=function(){B>0&&I.writeByte(X)},H},E=function(L){for(var I=1<<L,B=(1<<L)+1,X=L+1,H=P(),it=0;it<I;it+=1)H.add(String.fromCharCode(it));H.add(String.fromCharCode(I)),H.add(String.fromCharCode(B));var lt=m(),dt=S(lt);dt.write(I,X);var vt=0,wt=String.fromCharCode(x[vt]);for(vt+=1;vt<x.length;){var Ft=String.fromCharCode(x[vt]);vt+=1,H.contains(wt+Ft)?wt=wt+Ft:(dt.write(H.indexOf(wt),X),H.size()<4095&&(H.size()==1<<X&&(X+=1),H.add(wt+Ft)),wt=Ft)}return dt.write(H.indexOf(wt),X),dt.write(B,X),dt.flush(),lt.toByteArray()},P=function(){var L={},I=0,B={};return B.add=function(X){if(B.contains(X))throw"dup key:"+X;L[X]=I,I+=1},B.size=function(){return I},B.indexOf=function(X){return L[X]},B.contains=function(X){return typeof L[X]<"u"},B};return _},b=function(w,T,A){for(var R=M(w,T),x=0;x<T;x+=1)for(var _=0;_<w;_+=1)R.setPixel(_,x,A(_,x));var S=m();R.write(S);for(var E=p(),P=S.toByteArray(),L=0;L<P.length;L+=1)E.writeByte(P[L]);return E.flush(),"data:image/gif;base64,"+E};return n})();(function(){e.stringToBytesFuncs["UTF-8"]=function(n){function r(s){for(var a=[],o=0;o<s.length;o++){var c=s.charCodeAt(o);c<128?a.push(c):c<2048?a.push(192|c>>6,128|c&63):c<55296||c>=57344?a.push(224|c>>12,128|c>>6&63,128|c&63):(o++,c=65536+((c&1023)<<10|s.charCodeAt(o)&1023),a.push(240|c>>18,128|c>>12&63,128|c>>6&63,128|c&63))}return a}return r(n)}})(),(function(n){i.exports=n()})(function(){return e})})(Gc)),Gc.exports}var Cb=Rb();const Lb=Ab(Cb);function la(){return location.origin+location.pathname.replace(/index\.html$/,"")}function Pb(i){const t=Lb(0,"M");return t.addData(i),t.make(),t.createSvgTag({cellSize:8,margin:2,scalable:!0})}async function Db(i,t){const e=new File([i],t,{type:i.type});if(navigator.canShare?.({files:[e]}))try{return await navigator.share({files:[e],title:"costuma 2026"}),"shared"}catch(r){if(r.name==="AbortError")return"cancelled"}return N0(i,t),"saved"}function N0(i,t){const e=document.createElement("a");e.href=URL.createObjectURL(i),e.download=t,document.body.appendChild(e),e.click(),e.remove(),setTimeout(()=>URL.revokeObjectURL(e.href),3e4)}function Ib(){const i=window.MediaRecorder;if(i)return["video/mp4;codecs=avc1","video/mp4","video/webm;codecs=vp9","video/webm;codecs=vp8","video/webm"].find(t=>i.isTypeSupported(t))}const Yt=i=>document.getElementById(i),Ub="./",Pe=new URLSearchParams(location.search),Ih=Pe.get("test")==="1",Nn=Number(Pe.get("synth")??0),ct=Eb();Pe.get("c")&&(ct.costume=Pe.get("c"));mi.some(i=>i.id===ct.costume)||(ct.costume=mi[0].id);Pe.get("people")&&(ct.people=Number(Pe.get("people")));const On=()=>Tb(ct),Ue=Yt("video"),Ta=Yt("stage"),ls=Yt("overlay"),ge=ls.getContext("2d"),Wt=new ub(Ta);Wt.opts.size=ct.size;Wt.opts.shadows=ct.shadows;Wt.opts.envLight=ct.envLight;const rn=new xb(Wt.bgUniforms,I0);Wt.cloneCast=(i,t)=>ct.scene==="party"&&ct.partyCast==="mix"?zo(Uh(i)+1+t+Ca):i;const $i=new _b,F0=new Mb;let Er=null,Wc=-1;(Pe.get("scene")==="party"||Pe.get("scene")==="costume")&&(ct.scene=Pe.get("scene"));Pe.get("fx")&&(ct.effect=Pe.get("fx"));Pe.get("googly")&&(ct.googly=Pe.get("googly")==="1");Pe.get("pc")&&(ct.partyCostumes=Pe.get("pc")==="behind"?"behind":Pe.get("pc")==="1"||Pe.get("pc")==="on"?"on":"off");rn.preset=Ii.find(i=>i.id===ct.effect)??Ii[0];const Aa=new K0(Ue,Pe.get("facing")??void 0);let Zn=null;const Ve=new op;let ks=!1;const zs=new Map,Ci=new Map;let Ra=0,Ca=0;function Ur(){const i=mi.filter(t=>ct.cast.includes(t.id));return i.length?i:mi.filter(t=>Zl.includes(t.id))}const zo=i=>{const t=Ur();return t[(i%t.length+t.length)%t.length].id},Uh=i=>Math.max(0,Ur().findIndex(t=>t.id===i));function Ho(i){const t=zs.get(i);if(t)return t;if(ct.scene==="party"){if(ct.partyCast!=="mix")return mi.some(r=>r.id===ct.partyCast)?ct.partyCast:"skeleton";let n=Ci.get(i);return n||(n=zo(Ca+Ra++*3),Ci.set(i,n)),n}if(ct.mode==="one")return ct.costume;let e=Ci.get(i);return e||(e=zo(Uh(ct.costume)+Ca+Ra++),Ci.set(i,e)),e}const Yf=new Set;function Hs(i,t=!1){if(Wt.hasTemplate(i))return;const e=!Yf.has(i);Yf.add(i),!t&&e&&be(`Dressing up as ${di(i).name}…`,1800),(e||!t)&&Wt.prepare(i,!0).catch(n=>{console.error("build failed",i,n),be(`${di(i).name} failed to build`)})}let $f=0;function be(i,t=1400){const e=Yt("toast");e.textContent=i,e.classList.add("on"),clearTimeout($f),$f=window.setTimeout(()=>e.classList.remove("on"),t)}const Nb=i=>{const t=Yt("hint");t.textContent=i,t.classList.toggle("on",!!i)},Nh=i=>`${Ub}thumbs/${i}.png`;function Fh(){const i=Yt("picker");if(i.innerHTML="",ct.scene==="party"){for(const n of Ii){const r=document.createElement("button");r.className="card fx",r.dataset.id=n.id,r.setAttribute("role","option"),r.innerHTML='<div class="thumb"></div><div class="name"></div>',r.querySelector(".thumb").style.background=n.swatch,r.querySelector(".name").textContent=n.name,r.onclick=()=>Oh(n.id),i.appendChild(r)}La();return}const t=(n,r,s="")=>{const a=document.createElement("button");a.className=`card ${s}`,a.dataset.id=n,a.setAttribute("role","option"),a.innerHTML='<div class="thumb"></div><div class="name"></div>',a.querySelector(".name").textContent=r;const o=a.querySelector(".thumb");if(n==="mix")o.textContent="MIX";else{const c=new Image;c.alt="",c.draggable=!1,c.onerror=()=>{c.remove(),o.textContent=r.slice(0,1)},c.src=Nh(n),o.appendChild(c)}a.onclick=()=>O0(n),i.appendChild(a)};t("mix","Mix","mix");for(const n of Ur())t(n.id,n.name);const e=document.createElement("button");e.className="card more",e.innerHTML='<div class="thumb">+</div><div class="name">More</div>',e.onclick=Bb,i.appendChild(e),La()}function Fb(i){let t=null,e=!1;i.addEventListener("pointerdown",r=>{t={x:r.clientX,left:i.scrollLeft,id:r.pointerId},e=!1}),i.addEventListener("dragstart",r=>r.preventDefault()),i.addEventListener("pointermove",r=>{if(!t||r.pointerId!==t.id)return;const s=r.clientX-t.x;!e&&Math.abs(s)>6&&(e=!0,i.classList.add("dragging")),e&&(i.scrollLeft=t.left-s)});const n=()=>{t=null,i.classList.remove("dragging")};i.addEventListener("pointerup",n),i.addEventListener("pointercancel",n),i.addEventListener("click",r=>{e&&(r.stopPropagation(),r.preventDefault(),e=!1)},!0),i.addEventListener("wheel",r=>{Math.abs(r.deltaY)<=Math.abs(r.deltaX)||(i.scrollLeft+=r.deltaY,r.preventDefault())},{passive:!1})}function La(){for(const i of Yt("picker").querySelectorAll(".card")){const t=ct.scene==="party"?i.dataset.id===ct.effect:ct.mode==="mix"?i.dataset.id==="mix":i.dataset.id===ct.costume;if(i.classList.toggle("on",t),i.setAttribute("aria-selected",String(t)),t){const e=Yt("picker");e.scrollTo({left:i.offsetLeft-(e.clientWidth-i.offsetWidth)/2,behavior:"smooth"})}}}function O0(i){if(zs.clear(),i==="mix"){const t=ct.mode==="mix";ct.mode="mix",t&&Ca++,Ci.clear(),Ra=0,be(t?"Shuffled":"Mix: everyone gets their own")}else ct.mode="one",ct.costume=i,Hs(i),Wt.hasTemplate(i)&&be(di(i).name,900);On(),La()}const Ob=()=>[...Ur().map(i=>i.id),"mix"];function Oh(i){const t=Ii.find(e=>e.id===i)??Ii[0];if(ct.effect===t.id&&rn.preset.id===t.id){const e=Ob(),n=e.indexOf(ct.partyCast);ct.partyCast=e[(n+1)%e.length],ct.partyCast==="mix"&&Ca++,zs.clear(),Ci.clear(),Ra=0,ct.partyCast!=="mix"&&Hs(ct.partyCast),ct.partyCostumes==="off"&&(ct.partyCostumes="behind"),On(),be(ct.partyCast==="mix"?"Dancers: a mix":`Dancers: ${di(ct.partyCast).name}`,1e3);return}ct.effect=t.id,rn.preset=t,On(),La(),be(t.name,800)}function jf(i){const t=Yt("dip");t.classList.add("on"),setTimeout(async()=>{try{await i()}finally{requestAnimationFrame(()=>requestAnimationFrame(()=>t.classList.remove("on")))}},190)}function Kl(i){ct.scene=i,On(),Wt.setBackground(i==="party"?rn.material:null),Zn?.setOptions({masks:i==="party"}),Yt("btn-pyramid").classList.toggle("hidden",i!=="party");for(const t of document.querySelectorAll(".modes button")){const e=t.dataset.scene===i;t.classList.toggle("on",e),t.setAttribute("aria-selected",String(e))}Fh()}function Bb(){const i=Yt("more-body");i.innerHTML="";const t=mi.filter(n=>!Zl.includes(n.id)),e=(n,r)=>{const s=document.createElement("h3");s.textContent=n,i.appendChild(s);const a=document.createElement("div");a.className="more-grid";for(const o of r){const c=document.createElement("button");c.className="more-card",c.innerHTML='<div class="thumb"></div><div class="name"></div><div class="tick"></div>';const l=new Image;l.alt="",l.draggable=!1,l.src=Nh(o.id),l.onerror=()=>l.remove(),c.querySelector(".thumb").appendChild(l),c.querySelector(".name").textContent=o.name;const h=()=>{const u=ct.cast.includes(o.id);c.classList.toggle("on",u),c.querySelector(".tick").textContent=u?"✓":"✕",c.setAttribute("aria-pressed",String(u))};h(),c.onclick=()=>{const u=ct.cast.includes(o.id);if(u&&ct.cast.length<=1){be("Keep at least one");return}ct.cast=u?ct.cast.filter(d=>d!==o.id):[...ct.cast,o.id],u||Hs(o.id,!0),Ci.clear(),Ra=0,On(),h(),Fh()},a.appendChild(c)}i.appendChild(a)};e("The usual crowd",mi.filter(n=>Zl.includes(n.id))),e("Advanced & trash",t),jo("more")}function jo(i){Yt(i).classList.remove("hidden")}for(const i of document.querySelectorAll(".modal"))i.addEventListener("click",t=>{(t.target===i||t.target.closest("[data-close]"))&&i.classList.add("hidden")});function Zf(){const i=la();Yt("qr-code").innerHTML=Pb(i),Yt("qr-url").textContent=i,jo("qr")}Yt("btn-copy").onclick=async()=>{try{await navigator.clipboard.writeText(la()),be("Link copied")}catch{be("Could not copy — long-press the link")}};Yt("btn-share-link").onclick=async()=>{if(navigator.share)try{await navigator.share({title:"costuma 2026",text:"Be a 3D costume:",url:la()})}catch{}else try{await navigator.clipboard.writeText(la()),be("Link copied")}catch{be(la())}};function kb(){const i=Yt("settings-body");i.innerHTML="";const t=(s,a,o)=>{const c=document.createElement("div");c.className="set";const l=document.createElement("label"),h=document.createElement("span");if(h.textContent=s,a){const u=document.createElement("small");u.textContent=a,h.appendChild(u)}l.append(h,o),c.appendChild(l),i.appendChild(c)},e=(s,a,o)=>{const c=document.createElement("div");c.className="seg";for(const[l,h]of s){const u=document.createElement("button");u.textContent=h,u.classList.toggle("on",a()===l),u.onclick=()=>{o(l),On();for(const d of c.children)d.classList.remove("on");u.classList.add("on")},c.appendChild(u)}return c},n=(s,a)=>{const o=document.createElement("input");return o.type="checkbox",o.className="switch",o.checked=s(),o.onchange=()=>{a(o.checked),On()},o},r=(s,a,o,c,l)=>{const h=document.createElement("input");return h.type="range",h.min=String(s),h.max=String(a),h.step=String(o),h.value=String(c()),h.oninput=()=>{l(Number(h.value)),On()},h};t(ct.scene==="party"?"Subjects":"People",ct.scene==="party"?"How many people to cut out (the nearest)":"How many to dress at once",e([[1,"1"],[2,"2"],[3,"3"],[4,"4"]],()=>ct.people,s=>{ct.people=s,Zn?.setOptions({numPoses:s}),Er?.setFaces(s)})),t("Costume size","Bigger hides more of the person",r(.8,1.5,.01,()=>ct.size,s=>{ct.size=s,Wt.opts.size=s})),t("Pose model","Accurate is steadier, slower to load and run",e([["lite","Fast"],["full","Accurate"]],()=>ct.model,s=>{ct.model=s,Yb()})),t("Light from the camera","The costume is lit by the room it stands in",n(()=>ct.envLight,s=>{ct.envLight=s,Wt.opts.envLight=s})),t("Shadows","Off is faster on older phones",n(()=>ct.shadows,s=>{ct.shadows=s,Wt.opts.shadows=s})),t("Lens","If costumes look too flat or too deep",r(.55,1.3,.01,()=>ct.lens,s=>{ct.lens=s})),t("React to the music","Listens through the microphone for the beat; clips record the sound",n(()=>ct.music,s=>{ct.music=s,s?$i.start().then(()=>be("Listening for the beat",1200)).catch(()=>{ct.music=!1,On(),be("No microphone")}):$i.stop()}));{const s=document.createElement("select");s.className="pick";for(const a of Ur()){const o=document.createElement("option");o.value=a.id,o.textContent=a.name,s.appendChild(o)}{const a=document.createElement("option");a.value="mix",a.textContent="A mix",s.appendChild(a)}s.value=ct.partyCast,s.onchange=()=>{ct.partyCast=s.value,zs.clear(),Ci.clear(),On(),s.value!=="mix"&&Hs(s.value)},t("Party dancers","Who dances behind (or as) you in party mode",s)}t("Costumes in party mode","Behind you: you stay yourself, a pyramid of your costume dances behind you",e([["off","Off"],["behind","Behind"],["on","On you"]],()=>ct.partyCostumes,s=>{ct.partyCostumes=s})),t("Face tracking","Mouths open costumes and breathe sparks; googly eyes find your eyes",n(()=>ct.faces,s=>{ct.faces=s,s&&zh()})),t("Mouth magic","Open your mouth: sparks",n(()=>ct.breath,s=>{ct.breath=s})),t("Show the skeleton","What the pose tracker sees",n(()=>ct.debug,s=>{ct.debug=s}))}let Ql=!1,Mr=null;function B0(i,t){Mr={blob:i,name:t};const e=Yt("preview-media");e.innerHTML="";const n=URL.createObjectURL(i);if(i.type.startsWith("video")){const r=document.createElement("video");r.src=n,r.controls=!0,r.playsInline=!0,r.loop=!0,r.muted=!0,r.play().catch(()=>{}),e.appendChild(r)}else{const r=new Image;r.src=n,e.appendChild(r)}jo("preview")}Yt("btn-share").onclick=async()=>{Mr&&await Db(Mr.blob,Mr.name)==="saved"&&be("Saved")};Yt("btn-save").onclick=()=>{Mr&&(N0(Mr.blob,Mr.name),be("Saved"))};const k0=()=>new Date().toISOString().slice(0,19).replace(/[:T]/g,"-");let Mo=null,Jf=0;function zb(){const i=Yt("btn-rec");if(Mo){Mo.stop();return}const t=Ib(),e=Ta.captureStream;if(!t||!e){be("Recording is not supported in this browser");return}const n=[],r=e.call(Ta,30);for(const a of $i.stream?.getAudioTracks()??[])r.addTrack(a);const s=new MediaRecorder(r,{mimeType:t,videoBitsPerSecond:8e6});s.ondataavailable=a=>{a.data.size&&n.push(a.data)},s.onstop=()=>{clearTimeout(Jf),Mo=null,i.classList.remove("on"),i.innerHTML=Ti.rec;const a=t.split(";")[0];B0(new Blob(n,{type:a}),`costuma-${k0()}.${a.includes("mp4")?"mp4":"webm"}`)},s.start(250),Mo=s,i.classList.add("on"),i.innerHTML=Ti.stop,Jf=window.setTimeout(()=>s.state==="recording"&&s.stop(),2e4),be("Recording — tap to stop",1200)}const Hb=4500;let z0=performance.now(),Vo=!1;const Go=()=>Yt("hud");function Vb(){z0=performance.now(),Go().classList.contains("idle")&&(Go().classList.remove("idle"),Vo=!0,setTimeout(()=>Vo=!1,400))}for(const i of["pointerdown","keydown","wheel"])window.addEventListener(i,Vb,{capture:!0,passive:!0});setInterval(()=>{const i=[...document.querySelectorAll(".modal")].some(e=>!e.classList.contains("hidden")),t=ks&&!i&&performance.now()-z0>Hb;t!==Go().classList.contains("idle")&&Go().classList.toggle("idle",t)},300);function H0(i){const t=Wt.cover,e=i.image,n=(e[O.shL].x+e[O.shR].x+e[O.hipL].x+e[O.hipR].x)/4,r=(e[O.shL].y+e[O.shR].y+e[O.hipL].y+e[O.hipR].y)/4;let s=(n*t.vw-t.ox)*t.s;const a=(r*t.vh-t.oy)*t.s;return t.mirror&&(s=t.cw-s),{x:s,y:a}}Ta.addEventListener("click",i=>{if(!ks)return;if(Vo){Vo=!1;return}if(ct.scene==="party"&&ct.partyCostumes==="off"){const s=Ii.findIndex(a=>a.id===ct.effect);Oh(Ii[(s+1)%Ii.length].id);return}let t=null,e=1/0;for(const s of Ve.tracks){if(s.lost)continue;const a=H0(s),o=Math.hypot(a.x-i.clientX,a.y-i.clientY);o<e&&(e=o,t=s)}if(!t||e>Math.max(innerWidth,innerHeight)*.3)return;const n=Ho(t.id),r=zo(Uh(n)+1);zs.set(t.id,r),Hs(r),be(di(r).name,900)});let th=0,Kf=-1,eh=0,nh=performance.now(),Xc=performance.now();const hs=document.createElement("canvas"),Gb=hs.getContext("2d");function Wb(){if(ct.scene!=="party")return Ue;const i=Ue.videoWidth||720,t=Ue.videoHeight||1280,e=480/Math.max(i,t),n=Math.round(i*e),r=Math.round(t*e);return(hs.width!==n||hs.height!==r)&&(hs.width=n,hs.height=r),Gb.drawImage(Ue,0,0,n,r),hs}let Bh=0,qc=performance.now(),Yc=0;function kh(){return ip(Ue.videoWidth||720,Ue.videoHeight||1280,ct.lens)}function V0(i){if(requestAnimationFrame(V0),!ks)return;th++;const t=kh();Wt.layout(t,Aa.mirrored&&!Nn);let e=null;if(Nn){if(e=g2(Nn,(i-nh)/1e3*(Ih?0:1)+Number(Pe.get("t")??0),t),ct.scene==="party"){const h=t.w/t.h,u=h>=1?240:Math.round(240*h),d=h>=1?Math.round(240/h):240;for(const f of e)f.mask=v2(f,u,d,h)}}else if(Zn&&Ue.readyState>=2&&Ue.currentTime!==Kf){Kf=Ue.currentTime;try{e=Zn.detect(Wb(),i)}catch(h){console.error(h)}}if(e&&Ve.update(e.slice(0,ct.people),i,t),e){let h=null;if(Er&&ct.faces&&!Nn)try{h=Er.detect(Ue,i)}catch(u){console.error(u)}if(wb(Ve.tracks,h,t.w/t.h,i,Wc<0?1/30:Math.min(.25,(i-Wc)/1e3)),Wc=i,Nn&&Pe.get("jaw"))for(const u of Ve.tracks)u.face&&(u.face.jaw=Number(Pe.get("jaw")))}Wt.ground.update(Ve.tracks,Nn?null:F0.upInCamera(Aa.facing),Math.min(.25,(i-Xc)/1e3));const n=ct.scene==="costume"||ct.partyCostumes!=="off";if(n)for(const h of Ve.tracks)Hs(Ho(h.id),!0);const r=(i-nh)/1e3,s=Math.min(.25,(i-Xc)/1e3);Xc=i;const a=n,o=ct.scene==="party",c=o&&ct.partyCostumes==="behind";Wt.pyramid=o&&ct.pyramid&&ct.partyCostumes!=="off",Wt.hideWearers=c,rn.pyramid=ct.pyramid,Wt.setForeground(c?rn.foreground:null),rn.clones=!Wt.pyramid,Wt.stageLights(ct.scene==="party"&&rn.preset.id!=="insitu",r,$i.env);{const h=Ve.tracks.filter(f=>!f.lost).sort((f,g)=>g.T.z-f.T.z)[0],u=ct.scene==="party"&&rn.preset.id==="insitu",d=Wt.stageSpots(u,r,$i.env,t,h?new N(h.T.x,h.T.y,h.T.z):null);rn.setSpots(d,u?1:0),Wt.light.realism=u}Wt.setGrain(!0,r),Wt.sync(a?Ve.tracks:[],Ho,r),Wt.googlyOn=ct.googly&&ct.faces,Wt.breathOn=ct.breath&&ct.faces,Wt.faces(Ve.tracks,t,s),$i.update(s,i),ct.scene==="party"&&(rn.subjects=ct.people,rn.beat=$i.env,rn.update(Ve.tracks,s,r,t.w/t.h,Wt.ground,t),rn.render(Wt.renderer,t.w,t.h)),Wt.render(Ue,t,th),Ql&&(Ql=!1,Ta.toBlob(h=>h&&B0(h,`costuma-${k0()}.jpg`),"image/jpeg",.92)),Ve.tracks.filter(h=>!h.lost).length&&(eh=i),Nb(i-eh>2500?"Step back until your head and hips are in view":""),qb(),Yc++,i-qc>1e3&&(Bh=Yc*1e3/(i-qc),Yc=0,qc=i,G0(),Xb())}let yo=0,Qf=!1;function Xb(){if(!(Ih||!ks||Ve.tracks.length===0)&&(yo=Bh<22?yo+1:0,!(yo<3))){if(yo=0,Wt.opts.pixelRatio>1.01)Wt.opts.pixelRatio=Math.max(1,Wt.opts.pixelRatio-.25);else if(Wt.opts.shadows)Wt.opts.shadows=!1;else return;Qf||(Qf=!0,be("Lowering quality to keep up",1500))}}function qb(){const i=ls.clientWidth,t=ls.clientHeight,e=Math.min(devicePixelRatio||1,2);if(ls.width!==Math.round(i*e)&&(ls.width=Math.round(i*e),ls.height=Math.round(t*e)),ge.setTransform(e,0,0,e,0,0),ge.clearRect(0,0,i,t),!ct.debug)return;const n=Wt.cover,r=s=>{let a=(s.x*n.vw-n.ox)*n.s;return n.mirror&&(a=n.cw-a),[a,(s.y*n.vh-n.oy)*n.s]};{const s=Wt.ground,a=kh(),{back:o,side:c}=s.axes(),l=Ve.tracks.filter(f=>!f.lost).sort((f,g)=>g.T.z-f.T.z)[0],h=s.foot(l?new N(l.T.x,l.T.y,l.T.z):new N(0,0,-3)).addScaledVector(o,-1),u=(f,g)=>h.clone().addScaledVector(c,f).addScaledVector(o,g),d=(f,g)=>{if(f.z>-.2||g.z>-.2)return;const[v,m]=r(Es(f,a)),[p,y]=r(Es(g,a));ge.beginPath(),ge.moveTo(v,m),ge.lineTo(p,y),ge.stroke()};ge.strokeStyle="rgba(125, 252, 255, 0.45)",ge.lineWidth=1.5;for(let f=-3;f<=3.001;f+=.5)d(u(f,0),u(f,8));for(let f=0;f<=8.001;f+=.5)d(u(-3,f),u(3,f));ge.fillStyle="#7dfcff",ge.font="600 12px system-ui",ge.fillText(`floor: ${s.source}${s.fromFeet?" + feet":""} · camera ${s.cameraHeight.toFixed(2)} m up`,12,n.ch-200)}for(const s of Ve.tracks){ge.globalAlpha=s.presence,ge.strokeStyle="#7dfcff",ge.lineWidth=3;for(const[o,c]of np){const l=s.image[o],h=s.image[c];if(Math.min(l.v,h.v)<.4)continue;const[u,d]=r(l),[f,g]=r(h);ge.beginPath(),ge.moveTo(u,d),ge.lineTo(f,g),ge.stroke()}ge.fillStyle="#ff8a1f";for(const o of s.image){if(o.v<.4)continue;const[c,l]=r(o);ge.beginPath(),ge.arc(c,l,4,0,Math.PI*2),ge.fill()}const a=H0(s);ge.fillStyle="#fff",ge.font="600 14px system-ui",ge.fillText(`#${s.id} ${di(Ho(s.id)).name} · ${(-s.T.z).toFixed(1)} m`,a.x-40,a.y)}ge.globalAlpha=1}function G0(){const i=Yt("readout");if(!i||Yt("settings").classList.contains("hidden"))return;const t=kh();i.textContent=["build 9166c6c · 2026-10-31 22:33Z",`${Bh.toFixed(0)} fps · pose ${Zn?.inferMs.toFixed(1)??"–"} ms (${Zn?.delegate??"–"}, ${ct.model}) · face ${Er?Er.inferMs.toFixed(1)+" ms":ct.faces?"loading":"off"}`,`video ${Ue.videoWidth}×${Ue.videoHeight} · f ${t.f.toFixed(0)} px · ${Aa.facing}`,`people ${Ve.tracks.filter(e=>!e.lost).length} · dressed ${Wt.count}`,`pixels ×${Wt.opts.pixelRatio.toFixed(2)} · shadows ${Wt.opts.shadows?"on":"off"}`,`face light ${Wt.light.faceConf>.05?`${Wt.light.faceLum.toFixed(3)} from (${Wt.light.faceDir.x.toFixed(2)}, ${Wt.light.faceDir.y.toFixed(2)}) ×${Wt.light.faceConf.toFixed(2)}`:"—"}`,`light mean ${Wt.light.mean.toFixed(3)} × ${Wt.light.gain.toFixed(2)} · key share ${Wt.light.share.toFixed(2)} · every ${Vn.every} frames`].join(`
`)}async function Yb(){if(Nn)return;const i=Zn,t=new ed(ct.model,ct.people);t.masks=ct.scene==="party",await t.load(e=>be(e,2500)),Zn=t,i?.close(),be(ct.model==="full"?"Accurate pose model":"Fast pose model",1e3)}async function zh(){if(Er||Nn||!ct.faces)return;const i=new yb;try{await i.load(ct.people),Er=i}catch(t){console.warn("face model failed",t)}}function $b(){const i=document.createElement("canvas");i.width=720,i.height=1280;const t=i.getContext("2d"),e=()=>{const n=t.createLinearGradient(0,0,0,1280);n.addColorStop(0,"#5a4a63"),n.addColorStop(.62,"#3b3142"),n.addColorStop(.63,"#6b5440"),n.addColorStop(1,"#3a2c22"),t.fillStyle=n,t.fillRect(0,0,720,1280),t.fillStyle="#fff3d6",t.fillRect(40,220,170,330),t.fillStyle="#ffb35a",t.beginPath(),t.arc(600,180,46,0,Math.PI*2),t.fill()};return e(),setInterval(e,500),i.captureStream(30)}async function $c(){const i=Yt("start-status"),t=Yt("btn-start");t.disabled=!0;const e=Nn?Promise.resolve(!1):F0.enable();try{if(Nn)Ue.srcObject=$b(),await Ue.play().catch(()=>{}),Ue.readyState<2&&await new Promise(r=>Ue.addEventListener("loadeddata",r,{once:!0}));else{if(!navigator.mediaDevices?.getUserMedia)throw new Error(location.protocol!=="https:"?"The camera needs an https:// page.":"This browser has no camera access.");i.textContent="Asking for the camera…",await Aa.open(),i.textContent="Loading the pose model…",Zn=new ed(ct.model,ct.people),Zn.masks=ct.scene==="party",await Zn.load(r=>{i.textContent=r[0].toUpperCase()+r.slice(1)+"…"})}Wt.setVideo(Ue),i.textContent=`Dressing up as ${di(ct.costume).name}…`,await new Promise(r=>setTimeout(r,30));const n=ct.mode==="one"?ct.costume:mi[0].id;await Wt.prepare(n,!0);for(const r of Ur())Wt.prepare(r.id);zh(),Yt("start").classList.add("hidden"),Yt("hud").classList.remove("hidden"),Kl(ct.scene),ks=!0,nh=performance.now(),eh=performance.now(),La()}catch(n){console.error(n);const r=n;i.textContent=r.name==="NotAllowedError"?"Camera permission was refused. Allow it in the browser settings and try again.":`Could not start: ${r.message}`,t.disabled=!1}}function jb(){Yt("btn-pyramid").innerHTML=Ti.pyramid;const i=()=>Yt("btn-pyramid").setAttribute("aria-pressed",String(ct.pyramid));i(),Yt("btn-pyramid").onclick=()=>{ct.pyramid=!ct.pyramid,On(),i(),be(ct.pyramid?"Dance pyramid":"No pyramid",800)},Yt("btn-googly").innerHTML=Ti.googly;const t=()=>Yt("btn-googly").setAttribute("aria-pressed",String(ct.googly));t(),Yt("btn-googly").onclick=()=>{ct.googly=!ct.googly,ct.googly&&!ct.faces&&(ct.faces=!0,zh()),On(),t(),be(ct.googly?"Googly eyes":"No googly eyes",800)},Yt("btn-qr").innerHTML=Ti.qr,Yt("btn-flip").innerHTML=Ti.flip,Yt("btn-gear").innerHTML=Ti.gear,Yt("btn-snap").innerHTML=Ti.camera,Yt("btn-rec").innerHTML=Ti.rec,Yt("btn-start").onclick=()=>void $c(),Yt("btn-start-qr").onclick=Zf,Yt("btn-qr").onclick=Zf,Yt("btn-gear").onclick=()=>{kb(),jo("settings"),G0()},Yt("btn-flip").onclick=async()=>{Nn||jf(async()=>{try{await Aa.flip(),Wt.setVideo(Ue),Ve.clear(),zs.clear(),Ci.clear()}catch(r){be(`Camera: ${r.message}`)}})},Yt("btn-snap").onclick=()=>{Ql=!0;const r=Yt("stage");r.style.filter="brightness(1.8)",setTimeout(()=>r.style.filter="",120)},Yt("btn-rec").onclick=zb;for(const r of document.querySelectorAll(".modes button"))r.onclick=()=>{r.dataset.scene!==ct.scene&&jf(()=>Kl(r.dataset.scene))};const e=Yt("start-cast");for(const r of Ur().slice(0,6)){const s=new Image;s.src=Nh(r.id),s.alt=r.name,s.onerror=()=>s.remove(),e.appendChild(s)}Fh(),Fb(Yt("picker")),requestAnimationFrame(V0);const n=window;n.__costuma={stage:Wt,tracker:Ve,settings:ct,start:$c,choose:O0,party:rn,beat:$i,setScene:Kl,chooseEffect:Oh,get started(){return ks},get frame(){return th},LIGHT_TUNE:Vn},Ih&&Nn&&$c()}jb();
