(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))n(r);new MutationObserver(r=>{for(const s of r)if(s.type==="childList")for(const a of s.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&n(a)}).observe(document,{childList:!0,subtree:!0});function e(r){const s={};return r.integrity&&(s.integrity=r.integrity),r.referrerPolicy&&(s.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?s.credentials="include":r.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function n(r){if(r.ep)return;r.ep=!0;const s=e(r);fetch(r.href,s)}})();const cf=()=>/iPad|iPhone|iPod/.test(navigator.userAgent)||navigator.platform==="MacIntel"&&navigator.maxTouchPoints>1,lf=()=>cf()||/Android|Mobile/i.test(navigator.userAgent);let hf=class{constructor(t,e){this.video=t,this.facing=e??(lf()?"environment":"user"),t.muted=!0,t.playsInline=!0,t.autoplay=!0,t.setAttribute("playsinline",""),t.setAttribute("muted","")}stream=null;facing;async open(t=this.facing){const e=!!this.stream;this.stop(),e&&await new Promise(r=>setTimeout(r,100));const n={facingMode:t,width:{ideal:1280},height:{ideal:720},frameRate:{ideal:30}};this.stream=await navigator.mediaDevices.getUserMedia({audio:!1,video:n}),this.facing=t,this.video.srcObject=this.stream,await this.video.play().catch(()=>{}),this.video.readyState<2&&await new Promise(r=>this.video.addEventListener("loadeddata",()=>r(),{once:!0}))}async flip(){await this.open(this.facing==="user"?"environment":"user")}get mirrored(){return this.facing==="user"}stop(){if(this.stream){for(const t of this.stream.getTracks())t.stop();this.video.srcObject=null,this.stream=null}}};const uf="modulepreload",ff=function(i,t){return new URL(i,t).href},Vc={},df=function(t,e,n){let r=Promise.resolve();if(e&&e.length>0){let a=function(h){return Promise.all(h.map(u=>Promise.resolve(u).then(d=>({status:"fulfilled",value:d}),d=>({status:"rejected",reason:d}))))};const o=document.getElementsByTagName("link"),c=document.querySelector("meta[property=csp-nonce]"),l=c?.nonce||c?.getAttribute("nonce");r=a(e.map(h=>{if(h=ff(h,n),h in Vc)return;Vc[h]=!0;const u=h.endsWith(".css"),d=u?'[rel="stylesheet"]':"";if(!!n)for(let x=o.length-1;x>=0;x--){const g=o[x];if(g.href===h&&(!u||g.rel==="stylesheet"))return}else if(document.querySelector(`link[href="${h}"]${d}`))return;const m=document.createElement("link");if(m.rel=u?"stylesheet":uf,u||(m.as="script"),m.crossOrigin="",m.href=h,l&&m.setAttribute("nonce",l),document.head.appendChild(m),u)return new Promise((x,g)=>{m.addEventListener("load",x),m.addEventListener("error",()=>g(new Error(`Unable to preload CSS for ${h}`)))})}))}function s(a){const o=new Event("vite:preloadError",{cancelable:!0});if(o.payload=a,window.dispatchEvent(o),!o.defaultPrevented)throw a}return r.then(a=>{for(const o of a||[])o.status==="rejected"&&s(o.reason);return t().catch(s)})},z={nose:0,eyeInL:1,eyeL:2,eyeOutL:3,eyeInR:4,eyeR:5,eyeOutR:6,earL:7,earR:8,mouthL:9,mouthR:10,shL:11,shR:12,elL:13,elR:14,wrL:15,wrR:16,pinkyL:17,pinkyR:18,indexL:19,indexR:20,thumbL:21,thumbR:22,hipL:23,hipR:24,knL:25,knR:26,anL:27,anR:28,heelL:29,heelR:30,toeL:31,toeR:32},uo=33;function pf(i){return{x:i.x,y:-i.y,z:-i.z,v:i.visibility??1}}const mf=[[z.shL,z.shR],[z.shL,z.elL],[z.elL,z.wrL],[z.shR,z.elR],[z.elR,z.wrR],[z.shL,z.hipL],[z.shR,z.hipR],[z.hipL,z.hipR],[z.hipL,z.knL],[z.knL,z.anL],[z.hipR,z.knR],[z.knR,z.anR],[z.anL,z.toeL],[z.anR,z.toeR],[z.earL,z.eyeL],[z.eyeL,z.nose],[z.nose,z.eyeR],[z.eyeR,z.earR]];class Uh{constructor(t,e){this.model=t,this.numPoses=e}lm=null;lastTs=-1;delegate="GPU";inferMs=0;masks=!1;async load(t){t?.("loading the pose engine");const n=await df(()=>import("./vision_bundle-Bk4VIwNi.js"),[],import.meta.url),r=await n.FilesetResolver.forVisionTasks("./mediapipe"),s=a=>n.PoseLandmarker.createFromOptions(r,{baseOptions:{modelAssetPath:`./models/pose_landmarker_${this.model}.task`,delegate:a},runningMode:"VIDEO",numPoses:this.numPoses,minPoseDetectionConfidence:.5,minPosePresenceConfidence:.5,minTrackingConfidence:.5,outputSegmentationMasks:this.masks});t?.(`loading the ${this.model} pose model`);try{this.lm=await s("GPU"),this.delegate="GPU"}catch(a){console.warn("GPU delegate failed, using CPU",a),this.lm=await s("CPU"),this.delegate="CPU"}}async setOptions(t){t.numPoses&&(this.numPoses=t.numPoses,await this.lm?.setOptions({numPoses:t.numPoses})),t.masks!==void 0&&t.masks!==this.masks&&(this.masks=t.masks,await this.lm?.setOptions({outputSegmentationMasks:t.masks}))}detect(t,e){if(!this.lm)return[];e<=this.lastTs&&(e=this.lastTs+1),this.lastTs=e;const n=performance.now(),r=this.lm.detectForVideo(t,e);this.inferMs=performance.now()-n;const s=[];for(let a=0;a<r.landmarks.length;a++){const o=r.landmarks[a],c=r.worldLandmarks[a];if(!c)continue;const l=r.segmentationMasks?.[a];s.push({image:o.map(h=>({x:h.x,y:h.y,z:h.z,v:h.visibility??1})),world:c.map(pf),mask:l?{data:l.getAsFloat32Array().slice(),w:l.width,h:l.height}:void 0})}return r.close(),s}close(){this.lm?.close(),this.lm=null}}function gf(i,t,e=.85){return{f:e*Math.max(i,t),cx:i/2,cy:t/2,w:i,h:t}}function vf(i,t,e,n=.5){let r=0,s=0,a=0,o=0,c=0,l=0,h=0,u=0,d=0;for(let E=0;E<i.length&&E<t.length;E++){const b=i[E],M=t[E],T=Math.min(b.v,M.v);if(T<n)continue;const w=(M.x*e.w-e.cx)/e.f,A=(e.cy-M.y*e.h)/e.f,R=-w*b.z-b.x,v=-A*b.z-b.y;r+=T,s+=T*w,c+=T*w*w,l+=T*R,u+=T*w*R,a+=T,o+=T*A,c+=T*A*A,h+=T*v,u+=T*A*v,d++}if(d<4)return null;const f=c-s*s/r-o*o/a,m=u-s*l/r-o*h/a;if(Math.abs(f)<1e-9)return null;const x=m/f,g=(l-s*x)/r,p=(h-o*x)/a;return!(x<-.2)||!isFinite(g)||!isFinite(p)?null:{x:g,y:p,z:x}}function _f(i,t){const e=-i.z;return{x:(t.cx+t.f*i.x/e)/t.w,y:(t.cy-t.f*i.y/e)/t.h}}const ms=(i,t)=>({x:(i.x+t.x)/2,y:(i.y+t.y)/2,z:(i.z+t.z)/2,v:Math.min(i.v,t.v)}),Pn=(i,t)=>Math.hypot(i.x-t.x,i.y-t.y,i.z-t.z);function Gc(i){const t=Pn(ms(i[z.shL],i[z.shR]),ms(i[z.hipL],i[z.hipR])),e=(Pn(i[z.shL],i[z.elL])+Pn(i[z.shR],i[z.elR]))/2,n=(Pn(i[z.elL],i[z.wrL])+Pn(i[z.elR],i[z.wrR]))/2,r=(Pn(i[z.hipL],i[z.knL])+Pn(i[z.hipR],i[z.knR]))/2,s=(Pn(i[z.knL],i[z.anL])+Pn(i[z.knR],i[z.anR]))/2,a=Pn(ms(i[z.shL],i[z.shR]),ms(i[z.earL],i[z.earR]));return{torso:t,upperArm:e,forearm:n,thigh:r,shin:s,neck:a}}const Gn={tauWorld:.045,tauImage:.035,tauXY:.05,tauZ:.14,tauLen:1.5,fadeIn:.22,fadeOut:.35,forgetAfter:.6,matchRadius:1.3},Wc=i=>{const t=[z.shL,z.shR,z.hipL,z.hipR];let e=0,n=0,r=0;for(const c of t){const l=i[c];e+=l.x,n+=l.y,r++}e/=r,n/=r;const s=(i[z.shL].x+i[z.shR].x)/2-(i[z.hipL].x+i[z.hipR].x)/2,a=(i[z.shL].y+i[z.shR].y)/2-(i[z.hipL].y+i[z.hipR].y)/2,o=Math.hypot(i[z.shL].x-i[z.shR].x,i[z.shL].y-i[z.shR].y);return{x:e,y:n,s:Math.max(Math.hypot(s,a),o,.04)}},mi=(i,t,e)=>i+(t-i)*e,Or=(i,t)=>1-Math.exp(-i/Math.max(t,1e-4));function Xc(i,t,e){for(let n=0;n<uo;n++){const r=i[n],s=t[n];r.x=mi(r.x,s.x,e),r.y=mi(r.y,s.y,e),r.z=mi(r.z,s.z,e),r.v=mi(r.v,s.v,Math.min(1,e*1.5))}}const qc=i=>i.map(t=>({...t}));class xf{tracks=[];nextId=1;last=-1;update(t,e,n){const r=this.last<0?.03333333333333333:Math.min(.25,Math.max(.001,(e-this.last)/1e3));this.last=e;const s=t.map(h=>({d:h,T:vf(h.world,h.image,n),c:Wc(h.image)})).filter(h=>h.T),a=this.tracks.filter(h=>!h.lost||h.presence>0),o=[];a.forEach((h,u)=>{const d=Wc(h.image);s.forEach((f,m)=>{const x=Math.hypot(d.x-f.c.x,d.y-f.c.y)/d.s;x<Gn.matchRadius&&o.push({ti:u,di:m,cost:x})})}),o.sort((h,u)=>h.cost-u.cost);const c=new Set,l=new Set;for(const h of o){if(c.has(h.ti)||l.has(h.di))continue;c.add(h.ti),l.add(h.di);const u=a[h.ti],d=s[h.di],f=u.lost;Xc(u.world,d.d.world,f?1:Or(r,Gn.tauWorld)),Xc(u.image,d.d.image,f?1:Or(r,Gn.tauImage));const m=f?1:Or(r,Gn.tauXY),x=f?1:Or(r,Gn.tauZ);u.T={x:mi(u.T.x,d.T.x,m),y:mi(u.T.y,d.T.y,m),z:mi(u.T.z,d.T.z,x)};const g=Gc(u.world),p=Or(r,Gn.tauLen);for(const E of Object.keys(g))u.len[E]=mi(u.len[E],g[E],p);u.seen=e,u.lost=!1,u.det=d.d}s.forEach((h,u)=>{if(l.has(u))return;const d=qc(h.d.world);this.tracks.push({id:this.nextId++,born:e,seen:e,image:qc(h.d.image),world:d,T:{...h.T},len:Gc(d),presence:0,lost:!1,det:h.d})});for(const h of this.tracks)h.seen!==e&&(h.lost=!0,h.det=null),h.presence=h.lost?Math.max(0,h.presence-r/Gn.fadeOut):Math.min(1,h.presence+r/Gn.fadeIn);return this.tracks=this.tracks.filter(h=>!(h.lost&&h.presence<=0&&e-h.seen>Gn.forgetAfter*1e3)),this.tracks}clear(){this.tracks=[],this.last=-1}}/**
 * @license
 * Copyright 2010-2025 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const cc="180",Mf=0,Yc=1,bf=2,Nh=1,Fh=2,Zn=3,Mi=0,Je=1,Sn=2,vi=0,Mr=1,$c=2,jc=3,Zc=4,Sf=5,Pi=100,yf=101,Ef=102,wf=103,Tf=104,Af=200,Rf=201,Cf=202,Lf=203,fo=204,po=205,Pf=206,Df=207,If=208,Uf=209,Nf=210,Ff=211,Of=212,Bf=213,kf=214,mo=0,go=1,vo=2,yr=3,_o=4,xo=5,Mo=6,bo=7,Oh=0,Hf=1,zf=2,_i=0,Vf=1,Gf=2,Wf=3,Xf=4,qf=5,Yf=6,Bh=7,Kc="attached",$f="detached",kh=300,Er=301,wr=302,ra=303,So=304,ua=306,ts=1e3,Ui=1001,yo=1002,on=1003,jf=1004,gs=1005,ve=1006,_a=1007,Ni=1008,Rn=1009,Hh=1010,zh=1011,es=1012,lc=1013,Vi=1014,kn=1015,qi=1016,hc=1017,uc=1018,ns=1020,Vh=35902,Gh=35899,Wh=1021,Xh=1022,He=1023,is=1026,rs=1027,qh=1028,fc=1029,Yh=1030,dc=1031,pc=1033,Ks=33776,Js=33777,Qs=33778,ta=33779,Eo=35840,wo=35841,To=35842,Ao=35843,Ro=36196,Co=37492,Lo=37496,Po=37808,Do=37809,Io=37810,Uo=37811,No=37812,Fo=37813,Oo=37814,Bo=37815,ko=37816,Ho=37817,zo=37818,Vo=37819,Go=37820,Wo=37821,Xo=36492,qo=36494,Yo=36495,$o=36283,jo=36284,Zo=36285,Ko=36286,Zf=3200,Kf=3201,$h=0,Jf=1,Bn="",rn="srgb",Gi="srgb-linear",sa="linear",ce="srgb",Ki=7680,Jc=519,Qf=512,td=513,ed=514,jh=515,nd=516,id=517,rd=518,sd=519,Qc=35044,vs=35048,tl="300 es",Hn=2e3,aa=2001;class Lr{addEventListener(t,e){this._listeners===void 0&&(this._listeners={});const n=this._listeners;n[t]===void 0&&(n[t]=[]),n[t].indexOf(e)===-1&&n[t].push(e)}hasEventListener(t,e){const n=this._listeners;return n===void 0?!1:n[t]!==void 0&&n[t].indexOf(e)!==-1}removeEventListener(t,e){const n=this._listeners;if(n===void 0)return;const r=n[t];if(r!==void 0){const s=r.indexOf(e);s!==-1&&r.splice(s,1)}}dispatchEvent(t){const e=this._listeners;if(e===void 0)return;const n=e[t.type];if(n!==void 0){t.target=this;const r=n.slice(0);for(let s=0,a=r.length;s<a;s++)r[s].call(this,t);t.target=null}}}const Oe=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];let el=1234567;const Yr=Math.PI/180,ss=180/Math.PI;function Yi(){const i=Math.random()*4294967295|0,t=Math.random()*4294967295|0,e=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(Oe[i&255]+Oe[i>>8&255]+Oe[i>>16&255]+Oe[i>>24&255]+"-"+Oe[t&255]+Oe[t>>8&255]+"-"+Oe[t>>16&15|64]+Oe[t>>24&255]+"-"+Oe[e&63|128]+Oe[e>>8&255]+"-"+Oe[e>>16&255]+Oe[e>>24&255]+Oe[n&255]+Oe[n>>8&255]+Oe[n>>16&255]+Oe[n>>24&255]).toLowerCase()}function Jt(i,t,e){return Math.max(t,Math.min(e,i))}function mc(i,t){return(i%t+t)%t}function ad(i,t,e,n,r){return n+(i-t)*(r-n)/(e-t)}function od(i,t,e){return i!==t?(e-i)/(t-i):0}function $r(i,t,e){return(1-e)*i+e*t}function cd(i,t,e,n){return $r(i,t,1-Math.exp(-e*n))}function ld(i,t=1){return t-Math.abs(mc(i,t*2)-t)}function hd(i,t,e){return i<=t?0:i>=e?1:(i=(i-t)/(e-t),i*i*(3-2*i))}function ud(i,t,e){return i<=t?0:i>=e?1:(i=(i-t)/(e-t),i*i*i*(i*(i*6-15)+10))}function fd(i,t){return i+Math.floor(Math.random()*(t-i+1))}function dd(i,t){return i+Math.random()*(t-i)}function pd(i){return i*(.5-Math.random())}function md(i){i!==void 0&&(el=i);let t=el+=1831565813;return t=Math.imul(t^t>>>15,t|1),t^=t+Math.imul(t^t>>>7,t|61),((t^t>>>14)>>>0)/4294967296}function gd(i){return i*Yr}function vd(i){return i*ss}function _d(i){return(i&i-1)===0&&i!==0}function xd(i){return Math.pow(2,Math.ceil(Math.log(i)/Math.LN2))}function Md(i){return Math.pow(2,Math.floor(Math.log(i)/Math.LN2))}function bd(i,t,e,n,r){const s=Math.cos,a=Math.sin,o=s(e/2),c=a(e/2),l=s((t+n)/2),h=a((t+n)/2),u=s((t-n)/2),d=a((t-n)/2),f=s((n-t)/2),m=a((n-t)/2);switch(r){case"XYX":i.set(o*h,c*u,c*d,o*l);break;case"YZY":i.set(c*d,o*h,c*u,o*l);break;case"ZXZ":i.set(c*u,c*d,o*h,o*l);break;case"XZX":i.set(o*h,c*m,c*f,o*l);break;case"YXY":i.set(c*f,o*h,c*m,o*l);break;case"ZYZ":i.set(c*m,c*f,o*h,o*l);break;default:console.warn("THREE.MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+r)}}function mr(i,t){switch(t.constructor){case Float32Array:return i;case Uint32Array:return i/4294967295;case Uint16Array:return i/65535;case Uint8Array:return i/255;case Int32Array:return Math.max(i/2147483647,-1);case Int16Array:return Math.max(i/32767,-1);case Int8Array:return Math.max(i/127,-1);default:throw new Error("Invalid component type.")}}function Ve(i,t){switch(t.constructor){case Float32Array:return i;case Uint32Array:return Math.round(i*4294967295);case Uint16Array:return Math.round(i*65535);case Uint8Array:return Math.round(i*255);case Int32Array:return Math.round(i*2147483647);case Int16Array:return Math.round(i*32767);case Int8Array:return Math.round(i*127);default:throw new Error("Invalid component type.")}}const Sd={DEG2RAD:Yr,RAD2DEG:ss,generateUUID:Yi,clamp:Jt,euclideanModulo:mc,mapLinear:ad,inverseLerp:od,lerp:$r,damp:cd,pingpong:ld,smoothstep:hd,smootherstep:ud,randInt:fd,randFloat:dd,randFloatSpread:pd,seededRandom:md,degToRad:gd,radToDeg:vd,isPowerOfTwo:_d,ceilPowerOfTwo:xd,floorPowerOfTwo:Md,setQuaternionFromProperEuler:bd,normalize:Ve,denormalize:mr};class Rt{constructor(t=0,e=0){Rt.prototype.isVector2=!0,this.x=t,this.y=e}get width(){return this.x}set width(t){this.x=t}get height(){return this.y}set height(t){this.y=t}set(t,e){return this.x=t,this.y=e,this}setScalar(t){return this.x=t,this.y=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y)}copy(t){return this.x=t.x,this.y=t.y,this}add(t){return this.x+=t.x,this.y+=t.y,this}addScalar(t){return this.x+=t,this.y+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this}subScalar(t){return this.x-=t,this.y-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this}multiply(t){return this.x*=t.x,this.y*=t.y,this}multiplyScalar(t){return this.x*=t,this.y*=t,this}divide(t){return this.x/=t.x,this.y/=t.y,this}divideScalar(t){return this.multiplyScalar(1/t)}applyMatrix3(t){const e=this.x,n=this.y,r=t.elements;return this.x=r[0]*e+r[3]*n+r[6],this.y=r[1]*e+r[4]*n+r[7],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this}clamp(t,e){return this.x=Jt(this.x,t.x,e.x),this.y=Jt(this.y,t.y,e.y),this}clampScalar(t,e){return this.x=Jt(this.x,t,e),this.y=Jt(this.y,t,e),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Jt(n,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(t){return this.x*t.x+this.y*t.y}cross(t){return this.x*t.y-this.y*t.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const n=this.dot(t)/e;return Math.acos(Jt(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,n=this.y-t.y;return e*e+n*n}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this}equals(t){return t.x===this.x&&t.y===this.y}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this}rotateAround(t,e){const n=Math.cos(e),r=Math.sin(e),s=this.x-t.x,a=this.y-t.y;return this.x=s*n-a*r+t.x,this.y=s*r+a*n+t.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class ke{constructor(t=0,e=0,n=0,r=1){this.isQuaternion=!0,this._x=t,this._y=e,this._z=n,this._w=r}static slerpFlat(t,e,n,r,s,a,o){let c=n[r+0],l=n[r+1],h=n[r+2],u=n[r+3];const d=s[a+0],f=s[a+1],m=s[a+2],x=s[a+3];if(o===0){t[e+0]=c,t[e+1]=l,t[e+2]=h,t[e+3]=u;return}if(o===1){t[e+0]=d,t[e+1]=f,t[e+2]=m,t[e+3]=x;return}if(u!==x||c!==d||l!==f||h!==m){let g=1-o;const p=c*d+l*f+h*m+u*x,E=p>=0?1:-1,b=1-p*p;if(b>Number.EPSILON){const T=Math.sqrt(b),w=Math.atan2(T,p*E);g=Math.sin(g*w)/T,o=Math.sin(o*w)/T}const M=o*E;if(c=c*g+d*M,l=l*g+f*M,h=h*g+m*M,u=u*g+x*M,g===1-o){const T=1/Math.sqrt(c*c+l*l+h*h+u*u);c*=T,l*=T,h*=T,u*=T}}t[e]=c,t[e+1]=l,t[e+2]=h,t[e+3]=u}static multiplyQuaternionsFlat(t,e,n,r,s,a){const o=n[r],c=n[r+1],l=n[r+2],h=n[r+3],u=s[a],d=s[a+1],f=s[a+2],m=s[a+3];return t[e]=o*m+h*u+c*f-l*d,t[e+1]=c*m+h*d+l*u-o*f,t[e+2]=l*m+h*f+o*d-c*u,t[e+3]=h*m-o*u-c*d-l*f,t}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get w(){return this._w}set w(t){this._w=t,this._onChangeCallback()}set(t,e,n,r){return this._x=t,this._y=e,this._z=n,this._w=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(t){return this._x=t.x,this._y=t.y,this._z=t.z,this._w=t.w,this._onChangeCallback(),this}setFromEuler(t,e=!0){const n=t._x,r=t._y,s=t._z,a=t._order,o=Math.cos,c=Math.sin,l=o(n/2),h=o(r/2),u=o(s/2),d=c(n/2),f=c(r/2),m=c(s/2);switch(a){case"XYZ":this._x=d*h*u+l*f*m,this._y=l*f*u-d*h*m,this._z=l*h*m+d*f*u,this._w=l*h*u-d*f*m;break;case"YXZ":this._x=d*h*u+l*f*m,this._y=l*f*u-d*h*m,this._z=l*h*m-d*f*u,this._w=l*h*u+d*f*m;break;case"ZXY":this._x=d*h*u-l*f*m,this._y=l*f*u+d*h*m,this._z=l*h*m+d*f*u,this._w=l*h*u-d*f*m;break;case"ZYX":this._x=d*h*u-l*f*m,this._y=l*f*u+d*h*m,this._z=l*h*m-d*f*u,this._w=l*h*u+d*f*m;break;case"YZX":this._x=d*h*u+l*f*m,this._y=l*f*u+d*h*m,this._z=l*h*m-d*f*u,this._w=l*h*u-d*f*m;break;case"XZY":this._x=d*h*u-l*f*m,this._y=l*f*u-d*h*m,this._z=l*h*m+d*f*u,this._w=l*h*u+d*f*m;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+a)}return e===!0&&this._onChangeCallback(),this}setFromAxisAngle(t,e){const n=e/2,r=Math.sin(n);return this._x=t.x*r,this._y=t.y*r,this._z=t.z*r,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(t){const e=t.elements,n=e[0],r=e[4],s=e[8],a=e[1],o=e[5],c=e[9],l=e[2],h=e[6],u=e[10],d=n+o+u;if(d>0){const f=.5/Math.sqrt(d+1);this._w=.25/f,this._x=(h-c)*f,this._y=(s-l)*f,this._z=(a-r)*f}else if(n>o&&n>u){const f=2*Math.sqrt(1+n-o-u);this._w=(h-c)/f,this._x=.25*f,this._y=(r+a)/f,this._z=(s+l)/f}else if(o>u){const f=2*Math.sqrt(1+o-n-u);this._w=(s-l)/f,this._x=(r+a)/f,this._y=.25*f,this._z=(c+h)/f}else{const f=2*Math.sqrt(1+u-n-o);this._w=(a-r)/f,this._x=(s+l)/f,this._y=(c+h)/f,this._z=.25*f}return this._onChangeCallback(),this}setFromUnitVectors(t,e){let n=t.dot(e)+1;return n<1e-8?(n=0,Math.abs(t.x)>Math.abs(t.z)?(this._x=-t.y,this._y=t.x,this._z=0,this._w=n):(this._x=0,this._y=-t.z,this._z=t.y,this._w=n)):(this._x=t.y*e.z-t.z*e.y,this._y=t.z*e.x-t.x*e.z,this._z=t.x*e.y-t.y*e.x,this._w=n),this.normalize()}angleTo(t){return 2*Math.acos(Math.abs(Jt(this.dot(t),-1,1)))}rotateTowards(t,e){const n=this.angleTo(t);if(n===0)return this;const r=Math.min(1,e/n);return this.slerp(t,r),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(t){return this._x*t._x+this._y*t._y+this._z*t._z+this._w*t._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let t=this.length();return t===0?(this._x=0,this._y=0,this._z=0,this._w=1):(t=1/t,this._x=this._x*t,this._y=this._y*t,this._z=this._z*t,this._w=this._w*t),this._onChangeCallback(),this}multiply(t){return this.multiplyQuaternions(this,t)}premultiply(t){return this.multiplyQuaternions(t,this)}multiplyQuaternions(t,e){const n=t._x,r=t._y,s=t._z,a=t._w,o=e._x,c=e._y,l=e._z,h=e._w;return this._x=n*h+a*o+r*l-s*c,this._y=r*h+a*c+s*o-n*l,this._z=s*h+a*l+n*c-r*o,this._w=a*h-n*o-r*c-s*l,this._onChangeCallback(),this}slerp(t,e){if(e===0)return this;if(e===1)return this.copy(t);const n=this._x,r=this._y,s=this._z,a=this._w;let o=a*t._w+n*t._x+r*t._y+s*t._z;if(o<0?(this._w=-t._w,this._x=-t._x,this._y=-t._y,this._z=-t._z,o=-o):this.copy(t),o>=1)return this._w=a,this._x=n,this._y=r,this._z=s,this;const c=1-o*o;if(c<=Number.EPSILON){const f=1-e;return this._w=f*a+e*this._w,this._x=f*n+e*this._x,this._y=f*r+e*this._y,this._z=f*s+e*this._z,this.normalize(),this}const l=Math.sqrt(c),h=Math.atan2(l,o),u=Math.sin((1-e)*h)/l,d=Math.sin(e*h)/l;return this._w=a*u+this._w*d,this._x=n*u+this._x*d,this._y=r*u+this._y*d,this._z=s*u+this._z*d,this._onChangeCallback(),this}slerpQuaternions(t,e,n){return this.copy(t).slerp(e,n)}random(){const t=2*Math.PI*Math.random(),e=2*Math.PI*Math.random(),n=Math.random(),r=Math.sqrt(1-n),s=Math.sqrt(n);return this.set(r*Math.sin(t),r*Math.cos(t),s*Math.sin(e),s*Math.cos(e))}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._w===this._w}fromArray(t,e=0){return this._x=t[e],this._y=t[e+1],this._z=t[e+2],this._w=t[e+3],this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._w,t}fromBufferAttribute(t,e){return this._x=t.getX(e),this._y=t.getY(e),this._z=t.getZ(e),this._w=t.getW(e),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class O{constructor(t=0,e=0,n=0){O.prototype.isVector3=!0,this.x=t,this.y=e,this.z=n}set(t,e,n){return n===void 0&&(n=this.z),this.x=t,this.y=e,this.z=n,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this}multiplyVectors(t,e){return this.x=t.x*e.x,this.y=t.y*e.y,this.z=t.z*e.z,this}applyEuler(t){return this.applyQuaternion(nl.setFromEuler(t))}applyAxisAngle(t,e){return this.applyQuaternion(nl.setFromAxisAngle(t,e))}applyMatrix3(t){const e=this.x,n=this.y,r=this.z,s=t.elements;return this.x=s[0]*e+s[3]*n+s[6]*r,this.y=s[1]*e+s[4]*n+s[7]*r,this.z=s[2]*e+s[5]*n+s[8]*r,this}applyNormalMatrix(t){return this.applyMatrix3(t).normalize()}applyMatrix4(t){const e=this.x,n=this.y,r=this.z,s=t.elements,a=1/(s[3]*e+s[7]*n+s[11]*r+s[15]);return this.x=(s[0]*e+s[4]*n+s[8]*r+s[12])*a,this.y=(s[1]*e+s[5]*n+s[9]*r+s[13])*a,this.z=(s[2]*e+s[6]*n+s[10]*r+s[14])*a,this}applyQuaternion(t){const e=this.x,n=this.y,r=this.z,s=t.x,a=t.y,o=t.z,c=t.w,l=2*(a*r-o*n),h=2*(o*e-s*r),u=2*(s*n-a*e);return this.x=e+c*l+a*u-o*h,this.y=n+c*h+o*l-s*u,this.z=r+c*u+s*h-a*l,this}project(t){return this.applyMatrix4(t.matrixWorldInverse).applyMatrix4(t.projectionMatrix)}unproject(t){return this.applyMatrix4(t.projectionMatrixInverse).applyMatrix4(t.matrixWorld)}transformDirection(t){const e=this.x,n=this.y,r=this.z,s=t.elements;return this.x=s[0]*e+s[4]*n+s[8]*r,this.y=s[1]*e+s[5]*n+s[9]*r,this.z=s[2]*e+s[6]*n+s[10]*r,this.normalize()}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this}divideScalar(t){return this.multiplyScalar(1/t)}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this}clamp(t,e){return this.x=Jt(this.x,t.x,e.x),this.y=Jt(this.y,t.y,e.y),this.z=Jt(this.z,t.z,e.z),this}clampScalar(t,e){return this.x=Jt(this.x,t,e),this.y=Jt(this.y,t,e),this.z=Jt(this.z,t,e),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Jt(n,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this}cross(t){return this.crossVectors(this,t)}crossVectors(t,e){const n=t.x,r=t.y,s=t.z,a=e.x,o=e.y,c=e.z;return this.x=r*c-s*o,this.y=s*a-n*c,this.z=n*o-r*a,this}projectOnVector(t){const e=t.lengthSq();if(e===0)return this.set(0,0,0);const n=t.dot(this)/e;return this.copy(t).multiplyScalar(n)}projectOnPlane(t){return xa.copy(this).projectOnVector(t),this.sub(xa)}reflect(t){return this.sub(xa.copy(t).multiplyScalar(2*this.dot(t)))}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const n=this.dot(t)/e;return Math.acos(Jt(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,n=this.y-t.y,r=this.z-t.z;return e*e+n*n+r*r}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)+Math.abs(this.z-t.z)}setFromSpherical(t){return this.setFromSphericalCoords(t.radius,t.phi,t.theta)}setFromSphericalCoords(t,e,n){const r=Math.sin(e)*t;return this.x=r*Math.sin(n),this.y=Math.cos(e)*t,this.z=r*Math.cos(n),this}setFromCylindrical(t){return this.setFromCylindricalCoords(t.radius,t.theta,t.y)}setFromCylindricalCoords(t,e,n){return this.x=t*Math.sin(e),this.y=n,this.z=t*Math.cos(e),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this}setFromMatrixScale(t){const e=this.setFromMatrixColumn(t,0).length(),n=this.setFromMatrixColumn(t,1).length(),r=this.setFromMatrixColumn(t,2).length();return this.x=e,this.y=n,this.z=r,this}setFromMatrixColumn(t,e){return this.fromArray(t.elements,e*4)}setFromMatrix3Column(t,e){return this.fromArray(t.elements,e*3)}setFromEuler(t){return this.x=t._x,this.y=t._y,this.z=t._z,this}setFromColor(t){return this.x=t.r,this.y=t.g,this.z=t.b,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const t=Math.random()*Math.PI*2,e=Math.random()*2-1,n=Math.sqrt(1-e*e);return this.x=n*Math.cos(t),this.y=e,this.z=n*Math.sin(t),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const xa=new O,nl=new ke;class Zt{constructor(t,e,n,r,s,a,o,c,l){Zt.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],t!==void 0&&this.set(t,e,n,r,s,a,o,c,l)}set(t,e,n,r,s,a,o,c,l){const h=this.elements;return h[0]=t,h[1]=r,h[2]=o,h[3]=e,h[4]=s,h[5]=c,h[6]=n,h[7]=a,h[8]=l,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(t){const e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],this}extractBasis(t,e,n){return t.setFromMatrix3Column(this,0),e.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(t){const e=t.elements;return this.set(e[0],e[4],e[8],e[1],e[5],e[9],e[2],e[6],e[10]),this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const n=t.elements,r=e.elements,s=this.elements,a=n[0],o=n[3],c=n[6],l=n[1],h=n[4],u=n[7],d=n[2],f=n[5],m=n[8],x=r[0],g=r[3],p=r[6],E=r[1],b=r[4],M=r[7],T=r[2],w=r[5],A=r[8];return s[0]=a*x+o*E+c*T,s[3]=a*g+o*b+c*w,s[6]=a*p+o*M+c*A,s[1]=l*x+h*E+u*T,s[4]=l*g+h*b+u*w,s[7]=l*p+h*M+u*A,s[2]=d*x+f*E+m*T,s[5]=d*g+f*b+m*w,s[8]=d*p+f*M+m*A,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[3]*=t,e[6]*=t,e[1]*=t,e[4]*=t,e[7]*=t,e[2]*=t,e[5]*=t,e[8]*=t,this}determinant(){const t=this.elements,e=t[0],n=t[1],r=t[2],s=t[3],a=t[4],o=t[5],c=t[6],l=t[7],h=t[8];return e*a*h-e*o*l-n*s*h+n*o*c+r*s*l-r*a*c}invert(){const t=this.elements,e=t[0],n=t[1],r=t[2],s=t[3],a=t[4],o=t[5],c=t[6],l=t[7],h=t[8],u=h*a-o*l,d=o*c-h*s,f=l*s-a*c,m=e*u+n*d+r*f;if(m===0)return this.set(0,0,0,0,0,0,0,0,0);const x=1/m;return t[0]=u*x,t[1]=(r*l-h*n)*x,t[2]=(o*n-r*a)*x,t[3]=d*x,t[4]=(h*e-r*c)*x,t[5]=(r*s-o*e)*x,t[6]=f*x,t[7]=(n*c-l*e)*x,t[8]=(a*e-n*s)*x,this}transpose(){let t;const e=this.elements;return t=e[1],e[1]=e[3],e[3]=t,t=e[2],e[2]=e[6],e[6]=t,t=e[5],e[5]=e[7],e[7]=t,this}getNormalMatrix(t){return this.setFromMatrix4(t).invert().transpose()}transposeIntoArray(t){const e=this.elements;return t[0]=e[0],t[1]=e[3],t[2]=e[6],t[3]=e[1],t[4]=e[4],t[5]=e[7],t[6]=e[2],t[7]=e[5],t[8]=e[8],this}setUvTransform(t,e,n,r,s,a,o){const c=Math.cos(s),l=Math.sin(s);return this.set(n*c,n*l,-n*(c*a+l*o)+a+t,-r*l,r*c,-r*(-l*a+c*o)+o+e,0,0,1),this}scale(t,e){return this.premultiply(Ma.makeScale(t,e)),this}rotate(t){return this.premultiply(Ma.makeRotation(-t)),this}translate(t,e){return this.premultiply(Ma.makeTranslation(t,e)),this}makeTranslation(t,e){return t.isVector2?this.set(1,0,t.x,0,1,t.y,0,0,1):this.set(1,0,t,0,1,e,0,0,1),this}makeRotation(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,n,e,0,0,0,1),this}makeScale(t,e){return this.set(t,0,0,0,e,0,0,0,1),this}equals(t){const e=this.elements,n=t.elements;for(let r=0;r<9;r++)if(e[r]!==n[r])return!1;return!0}fromArray(t,e=0){for(let n=0;n<9;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){const n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t}clone(){return new this.constructor().fromArray(this.elements)}}const Ma=new Zt;function Zh(i){for(let t=i.length-1;t>=0;--t)if(i[t]>=65535)return!0;return!1}function oa(i){return document.createElementNS("http://www.w3.org/1999/xhtml",i)}function yd(){const i=oa("canvas");return i.style.display="block",i}const il={};function as(i){i in il||(il[i]=!0,console.warn(i))}function Ed(i,t,e){return new Promise(function(n,r){function s(){switch(i.clientWaitSync(t,i.SYNC_FLUSH_COMMANDS_BIT,0)){case i.WAIT_FAILED:r();break;case i.TIMEOUT_EXPIRED:setTimeout(s,e);break;default:n()}}setTimeout(s,e)})}const rl=new Zt().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),sl=new Zt().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function wd(){const i={enabled:!0,workingColorSpace:Gi,spaces:{},convert:function(r,s,a){return this.enabled===!1||s===a||!s||!a||(this.spaces[s].transfer===ce&&(r.r=ti(r.r),r.g=ti(r.g),r.b=ti(r.b)),this.spaces[s].primaries!==this.spaces[a].primaries&&(r.applyMatrix3(this.spaces[s].toXYZ),r.applyMatrix3(this.spaces[a].fromXYZ)),this.spaces[a].transfer===ce&&(r.r=br(r.r),r.g=br(r.g),r.b=br(r.b))),r},workingToColorSpace:function(r,s){return this.convert(r,this.workingColorSpace,s)},colorSpaceToWorking:function(r,s){return this.convert(r,s,this.workingColorSpace)},getPrimaries:function(r){return this.spaces[r].primaries},getTransfer:function(r){return r===Bn?sa:this.spaces[r].transfer},getToneMappingMode:function(r){return this.spaces[r].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(r,s=this.workingColorSpace){return r.fromArray(this.spaces[s].luminanceCoefficients)},define:function(r){Object.assign(this.spaces,r)},_getMatrix:function(r,s,a){return r.copy(this.spaces[s].toXYZ).multiply(this.spaces[a].fromXYZ)},_getDrawingBufferColorSpace:function(r){return this.spaces[r].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(r=this.workingColorSpace){return this.spaces[r].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(r,s){return as("THREE.ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),i.workingToColorSpace(r,s)},toWorkingColorSpace:function(r,s){return as("THREE.ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),i.colorSpaceToWorking(r,s)}},t=[.64,.33,.3,.6,.15,.06],e=[.2126,.7152,.0722],n=[.3127,.329];return i.define({[Gi]:{primaries:t,whitePoint:n,transfer:sa,toXYZ:rl,fromXYZ:sl,luminanceCoefficients:e,workingColorSpaceConfig:{unpackColorSpace:rn},outputColorSpaceConfig:{drawingBufferColorSpace:rn}},[rn]:{primaries:t,whitePoint:n,transfer:ce,toXYZ:rl,fromXYZ:sl,luminanceCoefficients:e,outputColorSpaceConfig:{drawingBufferColorSpace:rn}}}),i}const re=wd();function ti(i){return i<.04045?i*.0773993808:Math.pow(i*.9478672986+.0521327014,2.4)}function br(i){return i<.0031308?i*12.92:1.055*Math.pow(i,.41666)-.055}let Ji;class Td{static getDataURL(t,e="image/png"){if(/^data:/i.test(t.src)||typeof HTMLCanvasElement>"u")return t.src;let n;if(t instanceof HTMLCanvasElement)n=t;else{Ji===void 0&&(Ji=oa("canvas")),Ji.width=t.width,Ji.height=t.height;const r=Ji.getContext("2d");t instanceof ImageData?r.putImageData(t,0,0):r.drawImage(t,0,0,t.width,t.height),n=Ji}return n.toDataURL(e)}static sRGBToLinear(t){if(typeof HTMLImageElement<"u"&&t instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&t instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&t instanceof ImageBitmap){const e=oa("canvas");e.width=t.width,e.height=t.height;const n=e.getContext("2d");n.drawImage(t,0,0,t.width,t.height);const r=n.getImageData(0,0,t.width,t.height),s=r.data;for(let a=0;a<s.length;a++)s[a]=ti(s[a]/255)*255;return n.putImageData(r,0,0),e}else if(t.data){const e=t.data.slice(0);for(let n=0;n<e.length;n++)e instanceof Uint8Array||e instanceof Uint8ClampedArray?e[n]=Math.floor(ti(e[n]/255)*255):e[n]=ti(e[n]);return{data:e,width:t.width,height:t.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),t}}let Ad=0;class gc{constructor(t=null){this.isSource=!0,Object.defineProperty(this,"id",{value:Ad++}),this.uuid=Yi(),this.data=t,this.dataReady=!0,this.version=0}getSize(t){const e=this.data;return typeof HTMLVideoElement<"u"&&e instanceof HTMLVideoElement?t.set(e.videoWidth,e.videoHeight,0):e instanceof VideoFrame?t.set(e.displayHeight,e.displayWidth,0):e!==null?t.set(e.width,e.height,e.depth||0):t.set(0,0,0),t}set needsUpdate(t){t===!0&&this.version++}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.images[this.uuid]!==void 0)return t.images[this.uuid];const n={uuid:this.uuid,url:""},r=this.data;if(r!==null){let s;if(Array.isArray(r)){s=[];for(let a=0,o=r.length;a<o;a++)r[a].isDataTexture?s.push(ba(r[a].image)):s.push(ba(r[a]))}else s=ba(r);n.url=s}return e||(t.images[this.uuid]=n),n}}function ba(i){return typeof HTMLImageElement<"u"&&i instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&i instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&i instanceof ImageBitmap?Td.getDataURL(i):i.data?{data:Array.from(i.data),width:i.width,height:i.height,type:i.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}let Rd=0;const Sa=new O;class Fe extends Lr{constructor(t=Fe.DEFAULT_IMAGE,e=Fe.DEFAULT_MAPPING,n=Ui,r=Ui,s=ve,a=Ni,o=He,c=Rn,l=Fe.DEFAULT_ANISOTROPY,h=Bn){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:Rd++}),this.uuid=Yi(),this.name="",this.source=new gc(t),this.mipmaps=[],this.mapping=e,this.channel=0,this.wrapS=n,this.wrapT=r,this.magFilter=s,this.minFilter=a,this.anisotropy=l,this.format=o,this.internalFormat=null,this.type=c,this.offset=new Rt(0,0),this.repeat=new Rt(1,1),this.center=new Rt(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Zt,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=h,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(t&&t.depth&&t.depth>1),this.pmremVersion=0}get width(){return this.source.getSize(Sa).x}get height(){return this.source.getSize(Sa).y}get depth(){return this.source.getSize(Sa).z}get image(){return this.source.data}set image(t=null){this.source.data=t}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(t){return this.name=t.name,this.source=t.source,this.mipmaps=t.mipmaps.slice(0),this.mapping=t.mapping,this.channel=t.channel,this.wrapS=t.wrapS,this.wrapT=t.wrapT,this.magFilter=t.magFilter,this.minFilter=t.minFilter,this.anisotropy=t.anisotropy,this.format=t.format,this.internalFormat=t.internalFormat,this.type=t.type,this.offset.copy(t.offset),this.repeat.copy(t.repeat),this.center.copy(t.center),this.rotation=t.rotation,this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrix.copy(t.matrix),this.generateMipmaps=t.generateMipmaps,this.premultiplyAlpha=t.premultiplyAlpha,this.flipY=t.flipY,this.unpackAlignment=t.unpackAlignment,this.colorSpace=t.colorSpace,this.renderTarget=t.renderTarget,this.isRenderTargetTexture=t.isRenderTargetTexture,this.isArrayTexture=t.isArrayTexture,this.userData=JSON.parse(JSON.stringify(t.userData)),this.needsUpdate=!0,this}setValues(t){for(const e in t){const n=t[e];if(n===void 0){console.warn(`THREE.Texture.setValues(): parameter '${e}' has value of undefined.`);continue}const r=this[e];if(r===void 0){console.warn(`THREE.Texture.setValues(): property '${e}' does not exist.`);continue}r&&n&&r.isVector2&&n.isVector2||r&&n&&r.isVector3&&n.isVector3||r&&n&&r.isMatrix3&&n.isMatrix3?r.copy(n):this[e]=n}}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.textures[this.uuid]!==void 0)return t.textures[this.uuid];const n={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(t).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),e||(t.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(t){if(this.mapping!==kh)return t;if(t.applyMatrix3(this.matrix),t.x<0||t.x>1)switch(this.wrapS){case ts:t.x=t.x-Math.floor(t.x);break;case Ui:t.x=t.x<0?0:1;break;case yo:Math.abs(Math.floor(t.x)%2)===1?t.x=Math.ceil(t.x)-t.x:t.x=t.x-Math.floor(t.x);break}if(t.y<0||t.y>1)switch(this.wrapT){case ts:t.y=t.y-Math.floor(t.y);break;case Ui:t.y=t.y<0?0:1;break;case yo:Math.abs(Math.floor(t.y)%2)===1?t.y=Math.ceil(t.y)-t.y:t.y=t.y-Math.floor(t.y);break}return this.flipY&&(t.y=1-t.y),t}set needsUpdate(t){t===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(t){t===!0&&this.pmremVersion++}}Fe.DEFAULT_IMAGE=null;Fe.DEFAULT_MAPPING=kh;Fe.DEFAULT_ANISOTROPY=1;class le{constructor(t=0,e=0,n=0,r=1){le.prototype.isVector4=!0,this.x=t,this.y=e,this.z=n,this.w=r}get width(){return this.z}set width(t){this.z=t}get height(){return this.w}set height(t){this.w=t}set(t,e,n,r){return this.x=t,this.y=e,this.z=n,this.w=r,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this.w=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setW(t){return this.w=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;case 3:this.w=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this.w=t.w!==void 0?t.w:1,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this.w+=t.w,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this.w+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this.w=t.w+e.w,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this.w+=t.w*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this.w-=t.w,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this.w-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this.w=t.w-e.w,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this.w*=t.w,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this.w*=t,this}applyMatrix4(t){const e=this.x,n=this.y,r=this.z,s=this.w,a=t.elements;return this.x=a[0]*e+a[4]*n+a[8]*r+a[12]*s,this.y=a[1]*e+a[5]*n+a[9]*r+a[13]*s,this.z=a[2]*e+a[6]*n+a[10]*r+a[14]*s,this.w=a[3]*e+a[7]*n+a[11]*r+a[15]*s,this}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this.w/=t.w,this}divideScalar(t){return this.multiplyScalar(1/t)}setAxisAngleFromQuaternion(t){this.w=2*Math.acos(t.w);const e=Math.sqrt(1-t.w*t.w);return e<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=t.x/e,this.y=t.y/e,this.z=t.z/e),this}setAxisAngleFromRotationMatrix(t){let e,n,r,s;const c=t.elements,l=c[0],h=c[4],u=c[8],d=c[1],f=c[5],m=c[9],x=c[2],g=c[6],p=c[10];if(Math.abs(h-d)<.01&&Math.abs(u-x)<.01&&Math.abs(m-g)<.01){if(Math.abs(h+d)<.1&&Math.abs(u+x)<.1&&Math.abs(m+g)<.1&&Math.abs(l+f+p-3)<.1)return this.set(1,0,0,0),this;e=Math.PI;const b=(l+1)/2,M=(f+1)/2,T=(p+1)/2,w=(h+d)/4,A=(u+x)/4,R=(m+g)/4;return b>M&&b>T?b<.01?(n=0,r=.707106781,s=.707106781):(n=Math.sqrt(b),r=w/n,s=A/n):M>T?M<.01?(n=.707106781,r=0,s=.707106781):(r=Math.sqrt(M),n=w/r,s=R/r):T<.01?(n=.707106781,r=.707106781,s=0):(s=Math.sqrt(T),n=A/s,r=R/s),this.set(n,r,s,e),this}let E=Math.sqrt((g-m)*(g-m)+(u-x)*(u-x)+(d-h)*(d-h));return Math.abs(E)<.001&&(E=1),this.x=(g-m)/E,this.y=(u-x)/E,this.z=(d-h)/E,this.w=Math.acos((l+f+p-1)/2),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this.w=e[15],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this.w=Math.min(this.w,t.w),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this.w=Math.max(this.w,t.w),this}clamp(t,e){return this.x=Jt(this.x,t.x,e.x),this.y=Jt(this.y,t.y,e.y),this.z=Jt(this.z,t.z,e.z),this.w=Jt(this.w,t.w,e.w),this}clampScalar(t,e){return this.x=Jt(this.x,t,e),this.y=Jt(this.y,t,e),this.z=Jt(this.z,t,e),this.w=Jt(this.w,t,e),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Jt(n,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z+this.w*t.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this.w+=(t.w-this.w)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this.w=t.w+(e.w-t.w)*n,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z&&t.w===this.w}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this.w=t[e+3],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t[e+3]=this.w,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this.w=t.getW(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class Cd extends Lr{constructor(t=1,e=1,n={}){super(),n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:ve,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1},n),this.isRenderTarget=!0,this.width=t,this.height=e,this.depth=n.depth,this.scissor=new le(0,0,t,e),this.scissorTest=!1,this.viewport=new le(0,0,t,e);const r={width:t,height:e,depth:n.depth},s=new Fe(r);this.textures=[];const a=n.count;for(let o=0;o<a;o++)this.textures[o]=s.clone(),this.textures[o].isRenderTargetTexture=!0,this.textures[o].renderTarget=this;this._setTextureOptions(n),this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this._depthTexture=null,this.depthTexture=n.depthTexture,this.samples=n.samples,this.multiview=n.multiview}_setTextureOptions(t={}){const e={minFilter:ve,generateMipmaps:!1,flipY:!1,internalFormat:null};t.mapping!==void 0&&(e.mapping=t.mapping),t.wrapS!==void 0&&(e.wrapS=t.wrapS),t.wrapT!==void 0&&(e.wrapT=t.wrapT),t.wrapR!==void 0&&(e.wrapR=t.wrapR),t.magFilter!==void 0&&(e.magFilter=t.magFilter),t.minFilter!==void 0&&(e.minFilter=t.minFilter),t.format!==void 0&&(e.format=t.format),t.type!==void 0&&(e.type=t.type),t.anisotropy!==void 0&&(e.anisotropy=t.anisotropy),t.colorSpace!==void 0&&(e.colorSpace=t.colorSpace),t.flipY!==void 0&&(e.flipY=t.flipY),t.generateMipmaps!==void 0&&(e.generateMipmaps=t.generateMipmaps),t.internalFormat!==void 0&&(e.internalFormat=t.internalFormat);for(let n=0;n<this.textures.length;n++)this.textures[n].setValues(e)}get texture(){return this.textures[0]}set texture(t){this.textures[0]=t}set depthTexture(t){this._depthTexture!==null&&(this._depthTexture.renderTarget=null),t!==null&&(t.renderTarget=this),this._depthTexture=t}get depthTexture(){return this._depthTexture}setSize(t,e,n=1){if(this.width!==t||this.height!==e||this.depth!==n){this.width=t,this.height=e,this.depth=n;for(let r=0,s=this.textures.length;r<s;r++)this.textures[r].image.width=t,this.textures[r].image.height=e,this.textures[r].image.depth=n,this.textures[r].isArrayTexture=this.textures[r].image.depth>1;this.dispose()}this.viewport.set(0,0,t,e),this.scissor.set(0,0,t,e)}clone(){return new this.constructor().copy(this)}copy(t){this.width=t.width,this.height=t.height,this.depth=t.depth,this.scissor.copy(t.scissor),this.scissorTest=t.scissorTest,this.viewport.copy(t.viewport),this.textures.length=0;for(let e=0,n=t.textures.length;e<n;e++){this.textures[e]=t.textures[e].clone(),this.textures[e].isRenderTargetTexture=!0,this.textures[e].renderTarget=this;const r=Object.assign({},t.textures[e].image);this.textures[e].source=new gc(r)}return this.depthBuffer=t.depthBuffer,this.stencilBuffer=t.stencilBuffer,this.resolveDepthBuffer=t.resolveDepthBuffer,this.resolveStencilBuffer=t.resolveStencilBuffer,t.depthTexture!==null&&(this.depthTexture=t.depthTexture.clone()),this.samples=t.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class Ze extends Cd{constructor(t=1,e=1,n={}){super(t,e,n),this.isWebGLRenderTarget=!0}}class vc extends Fe{constructor(t=null,e=1,n=1,r=1){super(null),this.isDataArrayTexture=!0,this.image={data:t,width:e,height:n,depth:r},this.magFilter=on,this.minFilter=on,this.wrapR=Ui,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(t){this.layerUpdates.add(t)}clearLayerUpdates(){this.layerUpdates.clear()}}class Ld extends Ze{constructor(t=1,e=1,n=1,r={}){super(t,e,r),this.isWebGLArrayRenderTarget=!0,this.depth=n,this.texture=new vc(null,t,e,n),this._setTextureOptions(r),this.texture.isRenderTargetTexture=!0}}class Pd extends Fe{constructor(t=null,e=1,n=1,r=1){super(null),this.isData3DTexture=!0,this.image={data:t,width:e,height:n,depth:r},this.magFilter=on,this.minFilter=on,this.wrapR=Ui,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class Pr{constructor(t=new O(1/0,1/0,1/0),e=new O(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=t,this.max=e}set(t,e){return this.min.copy(t),this.max.copy(e),this}setFromArray(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e+=3)this.expandByPoint(_n.fromArray(t,e));return this}setFromBufferAttribute(t){this.makeEmpty();for(let e=0,n=t.count;e<n;e++)this.expandByPoint(_n.fromBufferAttribute(t,e));return this}setFromPoints(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e++)this.expandByPoint(t[e]);return this}setFromCenterAndSize(t,e){const n=_n.copy(e).multiplyScalar(.5);return this.min.copy(t).sub(n),this.max.copy(t).add(n),this}setFromObject(t,e=!1){return this.makeEmpty(),this.expandByObject(t,e)}clone(){return new this.constructor().copy(this)}copy(t){return this.min.copy(t.min),this.max.copy(t.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(t){return this.isEmpty()?t.set(0,0,0):t.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(t){return this.isEmpty()?t.set(0,0,0):t.subVectors(this.max,this.min)}expandByPoint(t){return this.min.min(t),this.max.max(t),this}expandByVector(t){return this.min.sub(t),this.max.add(t),this}expandByScalar(t){return this.min.addScalar(-t),this.max.addScalar(t),this}expandByObject(t,e=!1){t.updateWorldMatrix(!1,!1);const n=t.geometry;if(n!==void 0){const s=n.getAttribute("position");if(e===!0&&s!==void 0&&t.isInstancedMesh!==!0)for(let a=0,o=s.count;a<o;a++)t.isMesh===!0?t.getVertexPosition(a,_n):_n.fromBufferAttribute(s,a),_n.applyMatrix4(t.matrixWorld),this.expandByPoint(_n);else t.boundingBox!==void 0?(t.boundingBox===null&&t.computeBoundingBox(),_s.copy(t.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),_s.copy(n.boundingBox)),_s.applyMatrix4(t.matrixWorld),this.union(_s)}const r=t.children;for(let s=0,a=r.length;s<a;s++)this.expandByObject(r[s],e);return this}containsPoint(t){return t.x>=this.min.x&&t.x<=this.max.x&&t.y>=this.min.y&&t.y<=this.max.y&&t.z>=this.min.z&&t.z<=this.max.z}containsBox(t){return this.min.x<=t.min.x&&t.max.x<=this.max.x&&this.min.y<=t.min.y&&t.max.y<=this.max.y&&this.min.z<=t.min.z&&t.max.z<=this.max.z}getParameter(t,e){return e.set((t.x-this.min.x)/(this.max.x-this.min.x),(t.y-this.min.y)/(this.max.y-this.min.y),(t.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(t){return t.max.x>=this.min.x&&t.min.x<=this.max.x&&t.max.y>=this.min.y&&t.min.y<=this.max.y&&t.max.z>=this.min.z&&t.min.z<=this.max.z}intersectsSphere(t){return this.clampPoint(t.center,_n),_n.distanceToSquared(t.center)<=t.radius*t.radius}intersectsPlane(t){let e,n;return t.normal.x>0?(e=t.normal.x*this.min.x,n=t.normal.x*this.max.x):(e=t.normal.x*this.max.x,n=t.normal.x*this.min.x),t.normal.y>0?(e+=t.normal.y*this.min.y,n+=t.normal.y*this.max.y):(e+=t.normal.y*this.max.y,n+=t.normal.y*this.min.y),t.normal.z>0?(e+=t.normal.z*this.min.z,n+=t.normal.z*this.max.z):(e+=t.normal.z*this.max.z,n+=t.normal.z*this.min.z),e<=-t.constant&&n>=-t.constant}intersectsTriangle(t){if(this.isEmpty())return!1;this.getCenter(Br),xs.subVectors(this.max,Br),Qi.subVectors(t.a,Br),tr.subVectors(t.b,Br),er.subVectors(t.c,Br),ai.subVectors(tr,Qi),oi.subVectors(er,tr),yi.subVectors(Qi,er);let e=[0,-ai.z,ai.y,0,-oi.z,oi.y,0,-yi.z,yi.y,ai.z,0,-ai.x,oi.z,0,-oi.x,yi.z,0,-yi.x,-ai.y,ai.x,0,-oi.y,oi.x,0,-yi.y,yi.x,0];return!ya(e,Qi,tr,er,xs)||(e=[1,0,0,0,1,0,0,0,1],!ya(e,Qi,tr,er,xs))?!1:(Ms.crossVectors(ai,oi),e=[Ms.x,Ms.y,Ms.z],ya(e,Qi,tr,er,xs))}clampPoint(t,e){return e.copy(t).clamp(this.min,this.max)}distanceToPoint(t){return this.clampPoint(t,_n).distanceTo(t)}getBoundingSphere(t){return this.isEmpty()?t.makeEmpty():(this.getCenter(t.center),t.radius=this.getSize(_n).length()*.5),t}intersect(t){return this.min.max(t.min),this.max.min(t.max),this.isEmpty()&&this.makeEmpty(),this}union(t){return this.min.min(t.min),this.max.max(t.max),this}applyMatrix4(t){return this.isEmpty()?this:(Wn[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(t),Wn[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(t),Wn[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(t),Wn[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(t),Wn[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(t),Wn[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(t),Wn[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(t),Wn[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(t),this.setFromPoints(Wn),this)}translate(t){return this.min.add(t),this.max.add(t),this}equals(t){return t.min.equals(this.min)&&t.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(t){return this.min.fromArray(t.min),this.max.fromArray(t.max),this}}const Wn=[new O,new O,new O,new O,new O,new O,new O,new O],_n=new O,_s=new Pr,Qi=new O,tr=new O,er=new O,ai=new O,oi=new O,yi=new O,Br=new O,xs=new O,Ms=new O,Ei=new O;function ya(i,t,e,n,r){for(let s=0,a=i.length-3;s<=a;s+=3){Ei.fromArray(i,s);const o=r.x*Math.abs(Ei.x)+r.y*Math.abs(Ei.y)+r.z*Math.abs(Ei.z),c=t.dot(Ei),l=e.dot(Ei),h=n.dot(Ei);if(Math.max(-Math.max(c,l,h),Math.min(c,l,h))>o)return!1}return!0}const Dd=new Pr,kr=new O,Ea=new O;class Dr{constructor(t=new O,e=-1){this.isSphere=!0,this.center=t,this.radius=e}set(t,e){return this.center.copy(t),this.radius=e,this}setFromPoints(t,e){const n=this.center;e!==void 0?n.copy(e):Dd.setFromPoints(t).getCenter(n);let r=0;for(let s=0,a=t.length;s<a;s++)r=Math.max(r,n.distanceToSquared(t[s]));return this.radius=Math.sqrt(r),this}copy(t){return this.center.copy(t.center),this.radius=t.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(t){return t.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(t){return t.distanceTo(this.center)-this.radius}intersectsSphere(t){const e=this.radius+t.radius;return t.center.distanceToSquared(this.center)<=e*e}intersectsBox(t){return t.intersectsSphere(this)}intersectsPlane(t){return Math.abs(t.distanceToPoint(this.center))<=this.radius}clampPoint(t,e){const n=this.center.distanceToSquared(t);return e.copy(t),n>this.radius*this.radius&&(e.sub(this.center).normalize(),e.multiplyScalar(this.radius).add(this.center)),e}getBoundingBox(t){return this.isEmpty()?(t.makeEmpty(),t):(t.set(this.center,this.center),t.expandByScalar(this.radius),t)}applyMatrix4(t){return this.center.applyMatrix4(t),this.radius=this.radius*t.getMaxScaleOnAxis(),this}translate(t){return this.center.add(t),this}expandByPoint(t){if(this.isEmpty())return this.center.copy(t),this.radius=0,this;kr.subVectors(t,this.center);const e=kr.lengthSq();if(e>this.radius*this.radius){const n=Math.sqrt(e),r=(n-this.radius)*.5;this.center.addScaledVector(kr,r/n),this.radius+=r}return this}union(t){return t.isEmpty()?this:this.isEmpty()?(this.copy(t),this):(this.center.equals(t.center)===!0?this.radius=Math.max(this.radius,t.radius):(Ea.subVectors(t.center,this.center).setLength(t.radius),this.expandByPoint(kr.copy(t.center).add(Ea)),this.expandByPoint(kr.copy(t.center).sub(Ea))),this)}equals(t){return t.center.equals(this.center)&&t.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(t){return this.radius=t.radius,this.center.fromArray(t.center),this}}const Xn=new O,wa=new O,bs=new O,ci=new O,Ta=new O,Ss=new O,Aa=new O;class Kh{constructor(t=new O,e=new O(0,0,-1)){this.origin=t,this.direction=e}set(t,e){return this.origin.copy(t),this.direction.copy(e),this}copy(t){return this.origin.copy(t.origin),this.direction.copy(t.direction),this}at(t,e){return e.copy(this.origin).addScaledVector(this.direction,t)}lookAt(t){return this.direction.copy(t).sub(this.origin).normalize(),this}recast(t){return this.origin.copy(this.at(t,Xn)),this}closestPointToPoint(t,e){e.subVectors(t,this.origin);const n=e.dot(this.direction);return n<0?e.copy(this.origin):e.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(t){return Math.sqrt(this.distanceSqToPoint(t))}distanceSqToPoint(t){const e=Xn.subVectors(t,this.origin).dot(this.direction);return e<0?this.origin.distanceToSquared(t):(Xn.copy(this.origin).addScaledVector(this.direction,e),Xn.distanceToSquared(t))}distanceSqToSegment(t,e,n,r){wa.copy(t).add(e).multiplyScalar(.5),bs.copy(e).sub(t).normalize(),ci.copy(this.origin).sub(wa);const s=t.distanceTo(e)*.5,a=-this.direction.dot(bs),o=ci.dot(this.direction),c=-ci.dot(bs),l=ci.lengthSq(),h=Math.abs(1-a*a);let u,d,f,m;if(h>0)if(u=a*c-o,d=a*o-c,m=s*h,u>=0)if(d>=-m)if(d<=m){const x=1/h;u*=x,d*=x,f=u*(u+a*d+2*o)+d*(a*u+d+2*c)+l}else d=s,u=Math.max(0,-(a*d+o)),f=-u*u+d*(d+2*c)+l;else d=-s,u=Math.max(0,-(a*d+o)),f=-u*u+d*(d+2*c)+l;else d<=-m?(u=Math.max(0,-(-a*s+o)),d=u>0?-s:Math.min(Math.max(-s,-c),s),f=-u*u+d*(d+2*c)+l):d<=m?(u=0,d=Math.min(Math.max(-s,-c),s),f=d*(d+2*c)+l):(u=Math.max(0,-(a*s+o)),d=u>0?s:Math.min(Math.max(-s,-c),s),f=-u*u+d*(d+2*c)+l);else d=a>0?-s:s,u=Math.max(0,-(a*d+o)),f=-u*u+d*(d+2*c)+l;return n&&n.copy(this.origin).addScaledVector(this.direction,u),r&&r.copy(wa).addScaledVector(bs,d),f}intersectSphere(t,e){Xn.subVectors(t.center,this.origin);const n=Xn.dot(this.direction),r=Xn.dot(Xn)-n*n,s=t.radius*t.radius;if(r>s)return null;const a=Math.sqrt(s-r),o=n-a,c=n+a;return c<0?null:o<0?this.at(c,e):this.at(o,e)}intersectsSphere(t){return t.radius<0?!1:this.distanceSqToPoint(t.center)<=t.radius*t.radius}distanceToPlane(t){const e=t.normal.dot(this.direction);if(e===0)return t.distanceToPoint(this.origin)===0?0:null;const n=-(this.origin.dot(t.normal)+t.constant)/e;return n>=0?n:null}intersectPlane(t,e){const n=this.distanceToPlane(t);return n===null?null:this.at(n,e)}intersectsPlane(t){const e=t.distanceToPoint(this.origin);return e===0||t.normal.dot(this.direction)*e<0}intersectBox(t,e){let n,r,s,a,o,c;const l=1/this.direction.x,h=1/this.direction.y,u=1/this.direction.z,d=this.origin;return l>=0?(n=(t.min.x-d.x)*l,r=(t.max.x-d.x)*l):(n=(t.max.x-d.x)*l,r=(t.min.x-d.x)*l),h>=0?(s=(t.min.y-d.y)*h,a=(t.max.y-d.y)*h):(s=(t.max.y-d.y)*h,a=(t.min.y-d.y)*h),n>a||s>r||((s>n||isNaN(n))&&(n=s),(a<r||isNaN(r))&&(r=a),u>=0?(o=(t.min.z-d.z)*u,c=(t.max.z-d.z)*u):(o=(t.max.z-d.z)*u,c=(t.min.z-d.z)*u),n>c||o>r)||((o>n||n!==n)&&(n=o),(c<r||r!==r)&&(r=c),r<0)?null:this.at(n>=0?n:r,e)}intersectsBox(t){return this.intersectBox(t,Xn)!==null}intersectTriangle(t,e,n,r,s){Ta.subVectors(e,t),Ss.subVectors(n,t),Aa.crossVectors(Ta,Ss);let a=this.direction.dot(Aa),o;if(a>0){if(r)return null;o=1}else if(a<0)o=-1,a=-a;else return null;ci.subVectors(this.origin,t);const c=o*this.direction.dot(Ss.crossVectors(ci,Ss));if(c<0)return null;const l=o*this.direction.dot(Ta.cross(ci));if(l<0||c+l>a)return null;const h=-o*ci.dot(Aa);return h<0?null:this.at(h/a,s)}applyMatrix4(t){return this.origin.applyMatrix4(t),this.direction.transformDirection(t),this}equals(t){return t.origin.equals(this.origin)&&t.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class ne{constructor(t,e,n,r,s,a,o,c,l,h,u,d,f,m,x,g){ne.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],t!==void 0&&this.set(t,e,n,r,s,a,o,c,l,h,u,d,f,m,x,g)}set(t,e,n,r,s,a,o,c,l,h,u,d,f,m,x,g){const p=this.elements;return p[0]=t,p[4]=e,p[8]=n,p[12]=r,p[1]=s,p[5]=a,p[9]=o,p[13]=c,p[2]=l,p[6]=h,p[10]=u,p[14]=d,p[3]=f,p[7]=m,p[11]=x,p[15]=g,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new ne().fromArray(this.elements)}copy(t){const e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],e[9]=n[9],e[10]=n[10],e[11]=n[11],e[12]=n[12],e[13]=n[13],e[14]=n[14],e[15]=n[15],this}copyPosition(t){const e=this.elements,n=t.elements;return e[12]=n[12],e[13]=n[13],e[14]=n[14],this}setFromMatrix3(t){const e=t.elements;return this.set(e[0],e[3],e[6],0,e[1],e[4],e[7],0,e[2],e[5],e[8],0,0,0,0,1),this}extractBasis(t,e,n){return t.setFromMatrixColumn(this,0),e.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this}makeBasis(t,e,n){return this.set(t.x,e.x,n.x,0,t.y,e.y,n.y,0,t.z,e.z,n.z,0,0,0,0,1),this}extractRotation(t){const e=this.elements,n=t.elements,r=1/nr.setFromMatrixColumn(t,0).length(),s=1/nr.setFromMatrixColumn(t,1).length(),a=1/nr.setFromMatrixColumn(t,2).length();return e[0]=n[0]*r,e[1]=n[1]*r,e[2]=n[2]*r,e[3]=0,e[4]=n[4]*s,e[5]=n[5]*s,e[6]=n[6]*s,e[7]=0,e[8]=n[8]*a,e[9]=n[9]*a,e[10]=n[10]*a,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromEuler(t){const e=this.elements,n=t.x,r=t.y,s=t.z,a=Math.cos(n),o=Math.sin(n),c=Math.cos(r),l=Math.sin(r),h=Math.cos(s),u=Math.sin(s);if(t.order==="XYZ"){const d=a*h,f=a*u,m=o*h,x=o*u;e[0]=c*h,e[4]=-c*u,e[8]=l,e[1]=f+m*l,e[5]=d-x*l,e[9]=-o*c,e[2]=x-d*l,e[6]=m+f*l,e[10]=a*c}else if(t.order==="YXZ"){const d=c*h,f=c*u,m=l*h,x=l*u;e[0]=d+x*o,e[4]=m*o-f,e[8]=a*l,e[1]=a*u,e[5]=a*h,e[9]=-o,e[2]=f*o-m,e[6]=x+d*o,e[10]=a*c}else if(t.order==="ZXY"){const d=c*h,f=c*u,m=l*h,x=l*u;e[0]=d-x*o,e[4]=-a*u,e[8]=m+f*o,e[1]=f+m*o,e[5]=a*h,e[9]=x-d*o,e[2]=-a*l,e[6]=o,e[10]=a*c}else if(t.order==="ZYX"){const d=a*h,f=a*u,m=o*h,x=o*u;e[0]=c*h,e[4]=m*l-f,e[8]=d*l+x,e[1]=c*u,e[5]=x*l+d,e[9]=f*l-m,e[2]=-l,e[6]=o*c,e[10]=a*c}else if(t.order==="YZX"){const d=a*c,f=a*l,m=o*c,x=o*l;e[0]=c*h,e[4]=x-d*u,e[8]=m*u+f,e[1]=u,e[5]=a*h,e[9]=-o*h,e[2]=-l*h,e[6]=f*u+m,e[10]=d-x*u}else if(t.order==="XZY"){const d=a*c,f=a*l,m=o*c,x=o*l;e[0]=c*h,e[4]=-u,e[8]=l*h,e[1]=d*u+x,e[5]=a*h,e[9]=f*u-m,e[2]=m*u-f,e[6]=o*h,e[10]=x*u+d}return e[3]=0,e[7]=0,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromQuaternion(t){return this.compose(Id,t,Ud)}lookAt(t,e,n){const r=this.elements;return en.subVectors(t,e),en.lengthSq()===0&&(en.z=1),en.normalize(),li.crossVectors(n,en),li.lengthSq()===0&&(Math.abs(n.z)===1?en.x+=1e-4:en.z+=1e-4,en.normalize(),li.crossVectors(n,en)),li.normalize(),ys.crossVectors(en,li),r[0]=li.x,r[4]=ys.x,r[8]=en.x,r[1]=li.y,r[5]=ys.y,r[9]=en.y,r[2]=li.z,r[6]=ys.z,r[10]=en.z,this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const n=t.elements,r=e.elements,s=this.elements,a=n[0],o=n[4],c=n[8],l=n[12],h=n[1],u=n[5],d=n[9],f=n[13],m=n[2],x=n[6],g=n[10],p=n[14],E=n[3],b=n[7],M=n[11],T=n[15],w=r[0],A=r[4],R=r[8],v=r[12],_=r[1],S=r[5],y=r[9],D=r[13],I=r[2],U=r[6],H=r[10],$=r[14],V=r[3],tt=r[7],st=r[11],ct=r[15];return s[0]=a*w+o*_+c*I+l*V,s[4]=a*A+o*S+c*U+l*tt,s[8]=a*R+o*y+c*H+l*st,s[12]=a*v+o*D+c*$+l*ct,s[1]=h*w+u*_+d*I+f*V,s[5]=h*A+u*S+d*U+f*tt,s[9]=h*R+u*y+d*H+f*st,s[13]=h*v+u*D+d*$+f*ct,s[2]=m*w+x*_+g*I+p*V,s[6]=m*A+x*S+g*U+p*tt,s[10]=m*R+x*y+g*H+p*st,s[14]=m*v+x*D+g*$+p*ct,s[3]=E*w+b*_+M*I+T*V,s[7]=E*A+b*S+M*U+T*tt,s[11]=E*R+b*y+M*H+T*st,s[15]=E*v+b*D+M*$+T*ct,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[4]*=t,e[8]*=t,e[12]*=t,e[1]*=t,e[5]*=t,e[9]*=t,e[13]*=t,e[2]*=t,e[6]*=t,e[10]*=t,e[14]*=t,e[3]*=t,e[7]*=t,e[11]*=t,e[15]*=t,this}determinant(){const t=this.elements,e=t[0],n=t[4],r=t[8],s=t[12],a=t[1],o=t[5],c=t[9],l=t[13],h=t[2],u=t[6],d=t[10],f=t[14],m=t[3],x=t[7],g=t[11],p=t[15];return m*(+s*c*u-r*l*u-s*o*d+n*l*d+r*o*f-n*c*f)+x*(+e*c*f-e*l*d+s*a*d-r*a*f+r*l*h-s*c*h)+g*(+e*l*u-e*o*f-s*a*u+n*a*f+s*o*h-n*l*h)+p*(-r*o*h-e*c*u+e*o*d+r*a*u-n*a*d+n*c*h)}transpose(){const t=this.elements;let e;return e=t[1],t[1]=t[4],t[4]=e,e=t[2],t[2]=t[8],t[8]=e,e=t[6],t[6]=t[9],t[9]=e,e=t[3],t[3]=t[12],t[12]=e,e=t[7],t[7]=t[13],t[13]=e,e=t[11],t[11]=t[14],t[14]=e,this}setPosition(t,e,n){const r=this.elements;return t.isVector3?(r[12]=t.x,r[13]=t.y,r[14]=t.z):(r[12]=t,r[13]=e,r[14]=n),this}invert(){const t=this.elements,e=t[0],n=t[1],r=t[2],s=t[3],a=t[4],o=t[5],c=t[6],l=t[7],h=t[8],u=t[9],d=t[10],f=t[11],m=t[12],x=t[13],g=t[14],p=t[15],E=u*g*l-x*d*l+x*c*f-o*g*f-u*c*p+o*d*p,b=m*d*l-h*g*l-m*c*f+a*g*f+h*c*p-a*d*p,M=h*x*l-m*u*l+m*o*f-a*x*f-h*o*p+a*u*p,T=m*u*c-h*x*c-m*o*d+a*x*d+h*o*g-a*u*g,w=e*E+n*b+r*M+s*T;if(w===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const A=1/w;return t[0]=E*A,t[1]=(x*d*s-u*g*s-x*r*f+n*g*f+u*r*p-n*d*p)*A,t[2]=(o*g*s-x*c*s+x*r*l-n*g*l-o*r*p+n*c*p)*A,t[3]=(u*c*s-o*d*s-u*r*l+n*d*l+o*r*f-n*c*f)*A,t[4]=b*A,t[5]=(h*g*s-m*d*s+m*r*f-e*g*f-h*r*p+e*d*p)*A,t[6]=(m*c*s-a*g*s-m*r*l+e*g*l+a*r*p-e*c*p)*A,t[7]=(a*d*s-h*c*s+h*r*l-e*d*l-a*r*f+e*c*f)*A,t[8]=M*A,t[9]=(m*u*s-h*x*s-m*n*f+e*x*f+h*n*p-e*u*p)*A,t[10]=(a*x*s-m*o*s+m*n*l-e*x*l-a*n*p+e*o*p)*A,t[11]=(h*o*s-a*u*s-h*n*l+e*u*l+a*n*f-e*o*f)*A,t[12]=T*A,t[13]=(h*x*r-m*u*r+m*n*d-e*x*d-h*n*g+e*u*g)*A,t[14]=(m*o*r-a*x*r-m*n*c+e*x*c+a*n*g-e*o*g)*A,t[15]=(a*u*r-h*o*r+h*n*c-e*u*c-a*n*d+e*o*d)*A,this}scale(t){const e=this.elements,n=t.x,r=t.y,s=t.z;return e[0]*=n,e[4]*=r,e[8]*=s,e[1]*=n,e[5]*=r,e[9]*=s,e[2]*=n,e[6]*=r,e[10]*=s,e[3]*=n,e[7]*=r,e[11]*=s,this}getMaxScaleOnAxis(){const t=this.elements,e=t[0]*t[0]+t[1]*t[1]+t[2]*t[2],n=t[4]*t[4]+t[5]*t[5]+t[6]*t[6],r=t[8]*t[8]+t[9]*t[9]+t[10]*t[10];return Math.sqrt(Math.max(e,n,r))}makeTranslation(t,e,n){return t.isVector3?this.set(1,0,0,t.x,0,1,0,t.y,0,0,1,t.z,0,0,0,1):this.set(1,0,0,t,0,1,0,e,0,0,1,n,0,0,0,1),this}makeRotationX(t){const e=Math.cos(t),n=Math.sin(t);return this.set(1,0,0,0,0,e,-n,0,0,n,e,0,0,0,0,1),this}makeRotationY(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,0,n,0,0,1,0,0,-n,0,e,0,0,0,0,1),this}makeRotationZ(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,0,n,e,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(t,e){const n=Math.cos(e),r=Math.sin(e),s=1-n,a=t.x,o=t.y,c=t.z,l=s*a,h=s*o;return this.set(l*a+n,l*o-r*c,l*c+r*o,0,l*o+r*c,h*o+n,h*c-r*a,0,l*c-r*o,h*c+r*a,s*c*c+n,0,0,0,0,1),this}makeScale(t,e,n){return this.set(t,0,0,0,0,e,0,0,0,0,n,0,0,0,0,1),this}makeShear(t,e,n,r,s,a){return this.set(1,n,s,0,t,1,a,0,e,r,1,0,0,0,0,1),this}compose(t,e,n){const r=this.elements,s=e._x,a=e._y,o=e._z,c=e._w,l=s+s,h=a+a,u=o+o,d=s*l,f=s*h,m=s*u,x=a*h,g=a*u,p=o*u,E=c*l,b=c*h,M=c*u,T=n.x,w=n.y,A=n.z;return r[0]=(1-(x+p))*T,r[1]=(f+M)*T,r[2]=(m-b)*T,r[3]=0,r[4]=(f-M)*w,r[5]=(1-(d+p))*w,r[6]=(g+E)*w,r[7]=0,r[8]=(m+b)*A,r[9]=(g-E)*A,r[10]=(1-(d+x))*A,r[11]=0,r[12]=t.x,r[13]=t.y,r[14]=t.z,r[15]=1,this}decompose(t,e,n){const r=this.elements;let s=nr.set(r[0],r[1],r[2]).length();const a=nr.set(r[4],r[5],r[6]).length(),o=nr.set(r[8],r[9],r[10]).length();this.determinant()<0&&(s=-s),t.x=r[12],t.y=r[13],t.z=r[14],xn.copy(this);const l=1/s,h=1/a,u=1/o;return xn.elements[0]*=l,xn.elements[1]*=l,xn.elements[2]*=l,xn.elements[4]*=h,xn.elements[5]*=h,xn.elements[6]*=h,xn.elements[8]*=u,xn.elements[9]*=u,xn.elements[10]*=u,e.setFromRotationMatrix(xn),n.x=s,n.y=a,n.z=o,this}makePerspective(t,e,n,r,s,a,o=Hn,c=!1){const l=this.elements,h=2*s/(e-t),u=2*s/(n-r),d=(e+t)/(e-t),f=(n+r)/(n-r);let m,x;if(c)m=s/(a-s),x=a*s/(a-s);else if(o===Hn)m=-(a+s)/(a-s),x=-2*a*s/(a-s);else if(o===aa)m=-a/(a-s),x=-a*s/(a-s);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+o);return l[0]=h,l[4]=0,l[8]=d,l[12]=0,l[1]=0,l[5]=u,l[9]=f,l[13]=0,l[2]=0,l[6]=0,l[10]=m,l[14]=x,l[3]=0,l[7]=0,l[11]=-1,l[15]=0,this}makeOrthographic(t,e,n,r,s,a,o=Hn,c=!1){const l=this.elements,h=2/(e-t),u=2/(n-r),d=-(e+t)/(e-t),f=-(n+r)/(n-r);let m,x;if(c)m=1/(a-s),x=a/(a-s);else if(o===Hn)m=-2/(a-s),x=-(a+s)/(a-s);else if(o===aa)m=-1/(a-s),x=-s/(a-s);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+o);return l[0]=h,l[4]=0,l[8]=0,l[12]=d,l[1]=0,l[5]=u,l[9]=0,l[13]=f,l[2]=0,l[6]=0,l[10]=m,l[14]=x,l[3]=0,l[7]=0,l[11]=0,l[15]=1,this}equals(t){const e=this.elements,n=t.elements;for(let r=0;r<16;r++)if(e[r]!==n[r])return!1;return!0}fromArray(t,e=0){for(let n=0;n<16;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){const n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t[e+9]=n[9],t[e+10]=n[10],t[e+11]=n[11],t[e+12]=n[12],t[e+13]=n[13],t[e+14]=n[14],t[e+15]=n[15],t}}const nr=new O,xn=new ne,Id=new O(0,0,0),Ud=new O(1,1,1),li=new O,ys=new O,en=new O,al=new ne,ol=new ke;class vn{constructor(t=0,e=0,n=0,r=vn.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=e,this._z=n,this._order=r}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get order(){return this._order}set order(t){this._order=t,this._onChangeCallback()}set(t,e,n,r=this._order){return this._x=t,this._y=e,this._z=n,this._order=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(t){return this._x=t._x,this._y=t._y,this._z=t._z,this._order=t._order,this._onChangeCallback(),this}setFromRotationMatrix(t,e=this._order,n=!0){const r=t.elements,s=r[0],a=r[4],o=r[8],c=r[1],l=r[5],h=r[9],u=r[2],d=r[6],f=r[10];switch(e){case"XYZ":this._y=Math.asin(Jt(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-h,f),this._z=Math.atan2(-a,s)):(this._x=Math.atan2(d,l),this._z=0);break;case"YXZ":this._x=Math.asin(-Jt(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(o,f),this._z=Math.atan2(c,l)):(this._y=Math.atan2(-u,s),this._z=0);break;case"ZXY":this._x=Math.asin(Jt(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(-u,f),this._z=Math.atan2(-a,l)):(this._y=0,this._z=Math.atan2(c,s));break;case"ZYX":this._y=Math.asin(-Jt(u,-1,1)),Math.abs(u)<.9999999?(this._x=Math.atan2(d,f),this._z=Math.atan2(c,s)):(this._x=0,this._z=Math.atan2(-a,l));break;case"YZX":this._z=Math.asin(Jt(c,-1,1)),Math.abs(c)<.9999999?(this._x=Math.atan2(-h,l),this._y=Math.atan2(-u,s)):(this._x=0,this._y=Math.atan2(o,f));break;case"XZY":this._z=Math.asin(-Jt(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(d,l),this._y=Math.atan2(o,s)):(this._x=Math.atan2(-h,f),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+e)}return this._order=e,n===!0&&this._onChangeCallback(),this}setFromQuaternion(t,e,n){return al.makeRotationFromQuaternion(t),this.setFromRotationMatrix(al,e,n)}setFromVector3(t,e=this._order){return this.set(t.x,t.y,t.z,e)}reorder(t){return ol.setFromEuler(this),this.setFromQuaternion(ol,t)}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._order===this._order}fromArray(t){return this._x=t[0],this._y=t[1],this._z=t[2],t[3]!==void 0&&(this._order=t[3]),this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._order,t}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}vn.DEFAULT_ORDER="XYZ";class Jh{constructor(){this.mask=1}set(t){this.mask=(1<<t|0)>>>0}enable(t){this.mask|=1<<t|0}enableAll(){this.mask=-1}toggle(t){this.mask^=1<<t|0}disable(t){this.mask&=~(1<<t|0)}disableAll(){this.mask=0}test(t){return(this.mask&t.mask)!==0}isEnabled(t){return(this.mask&(1<<t|0))!==0}}let Nd=0;const cl=new O,ir=new ke,qn=new ne,Es=new O,Hr=new O,Fd=new O,Od=new ke,ll=new O(1,0,0),hl=new O(0,1,0),ul=new O(0,0,1),fl={type:"added"},Bd={type:"removed"},rr={type:"childadded",child:null},Ra={type:"childremoved",child:null};class Ie extends Lr{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:Nd++}),this.uuid=Yi(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=Ie.DEFAULT_UP.clone();const t=new O,e=new vn,n=new ke,r=new O(1,1,1);function s(){n.setFromEuler(e,!1)}function a(){e.setFromQuaternion(n,void 0,!1)}e._onChange(s),n._onChange(a),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:e},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:r},modelViewMatrix:{value:new ne},normalMatrix:{value:new Zt}}),this.matrix=new ne,this.matrixWorld=new ne,this.matrixAutoUpdate=Ie.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=Ie.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new Jh,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(t){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(t),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(t){return this.quaternion.premultiply(t),this}setRotationFromAxisAngle(t,e){this.quaternion.setFromAxisAngle(t,e)}setRotationFromEuler(t){this.quaternion.setFromEuler(t,!0)}setRotationFromMatrix(t){this.quaternion.setFromRotationMatrix(t)}setRotationFromQuaternion(t){this.quaternion.copy(t)}rotateOnAxis(t,e){return ir.setFromAxisAngle(t,e),this.quaternion.multiply(ir),this}rotateOnWorldAxis(t,e){return ir.setFromAxisAngle(t,e),this.quaternion.premultiply(ir),this}rotateX(t){return this.rotateOnAxis(ll,t)}rotateY(t){return this.rotateOnAxis(hl,t)}rotateZ(t){return this.rotateOnAxis(ul,t)}translateOnAxis(t,e){return cl.copy(t).applyQuaternion(this.quaternion),this.position.add(cl.multiplyScalar(e)),this}translateX(t){return this.translateOnAxis(ll,t)}translateY(t){return this.translateOnAxis(hl,t)}translateZ(t){return this.translateOnAxis(ul,t)}localToWorld(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(this.matrixWorld)}worldToLocal(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(qn.copy(this.matrixWorld).invert())}lookAt(t,e,n){t.isVector3?Es.copy(t):Es.set(t,e,n);const r=this.parent;this.updateWorldMatrix(!0,!1),Hr.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?qn.lookAt(Hr,Es,this.up):qn.lookAt(Es,Hr,this.up),this.quaternion.setFromRotationMatrix(qn),r&&(qn.extractRotation(r.matrixWorld),ir.setFromRotationMatrix(qn),this.quaternion.premultiply(ir.invert()))}add(t){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.add(arguments[e]);return this}return t===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",t),this):(t&&t.isObject3D?(t.removeFromParent(),t.parent=this,this.children.push(t),t.dispatchEvent(fl),rr.child=t,this.dispatchEvent(rr),rr.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",t),this)}remove(t){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}const e=this.children.indexOf(t);return e!==-1&&(t.parent=null,this.children.splice(e,1),t.dispatchEvent(Bd),Ra.child=t,this.dispatchEvent(Ra),Ra.child=null),this}removeFromParent(){const t=this.parent;return t!==null&&t.remove(this),this}clear(){return this.remove(...this.children)}attach(t){return this.updateWorldMatrix(!0,!1),qn.copy(this.matrixWorld).invert(),t.parent!==null&&(t.parent.updateWorldMatrix(!0,!1),qn.multiply(t.parent.matrixWorld)),t.applyMatrix4(qn),t.removeFromParent(),t.parent=this,this.children.push(t),t.updateWorldMatrix(!1,!0),t.dispatchEvent(fl),rr.child=t,this.dispatchEvent(rr),rr.child=null,this}getObjectById(t){return this.getObjectByProperty("id",t)}getObjectByName(t){return this.getObjectByProperty("name",t)}getObjectByProperty(t,e){if(this[t]===e)return this;for(let n=0,r=this.children.length;n<r;n++){const a=this.children[n].getObjectByProperty(t,e);if(a!==void 0)return a}}getObjectsByProperty(t,e,n=[]){this[t]===e&&n.push(this);const r=this.children;for(let s=0,a=r.length;s<a;s++)r[s].getObjectsByProperty(t,e,n);return n}getWorldPosition(t){return this.updateWorldMatrix(!0,!1),t.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Hr,t,Fd),t}getWorldScale(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Hr,Od,t),t}getWorldDirection(t){this.updateWorldMatrix(!0,!1);const e=this.matrixWorld.elements;return t.set(e[8],e[9],e[10]).normalize()}raycast(){}traverse(t){t(this);const e=this.children;for(let n=0,r=e.length;n<r;n++)e[n].traverse(t)}traverseVisible(t){if(this.visible===!1)return;t(this);const e=this.children;for(let n=0,r=e.length;n<r;n++)e[n].traverseVisible(t)}traverseAncestors(t){const e=this.parent;e!==null&&(t(e),e.traverseAncestors(t))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(t){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||t)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,t=!0);const e=this.children;for(let n=0,r=e.length;n<r;n++)e[n].updateMatrixWorld(t)}updateWorldMatrix(t,e){const n=this.parent;if(t===!0&&n!==null&&n.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),e===!0){const r=this.children;for(let s=0,a=r.length;s<a;s++)r[s].updateWorldMatrix(!1,!0)}}toJSON(t){const e=t===void 0||typeof t=="string",n={};e&&(t={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});const r={};r.uuid=this.uuid,r.type=this.type,this.name!==""&&(r.name=this.name),this.castShadow===!0&&(r.castShadow=!0),this.receiveShadow===!0&&(r.receiveShadow=!0),this.visible===!1&&(r.visible=!1),this.frustumCulled===!1&&(r.frustumCulled=!1),this.renderOrder!==0&&(r.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(r.userData=this.userData),r.layers=this.layers.mask,r.matrix=this.matrix.toArray(),r.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(r.matrixAutoUpdate=!1),this.isInstancedMesh&&(r.type="InstancedMesh",r.count=this.count,r.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(r.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(r.type="BatchedMesh",r.perObjectFrustumCulled=this.perObjectFrustumCulled,r.sortObjects=this.sortObjects,r.drawRanges=this._drawRanges,r.reservedRanges=this._reservedRanges,r.geometryInfo=this._geometryInfo.map(o=>({...o,boundingBox:o.boundingBox?o.boundingBox.toJSON():void 0,boundingSphere:o.boundingSphere?o.boundingSphere.toJSON():void 0})),r.instanceInfo=this._instanceInfo.map(o=>({...o})),r.availableInstanceIds=this._availableInstanceIds.slice(),r.availableGeometryIds=this._availableGeometryIds.slice(),r.nextIndexStart=this._nextIndexStart,r.nextVertexStart=this._nextVertexStart,r.geometryCount=this._geometryCount,r.maxInstanceCount=this._maxInstanceCount,r.maxVertexCount=this._maxVertexCount,r.maxIndexCount=this._maxIndexCount,r.geometryInitialized=this._geometryInitialized,r.matricesTexture=this._matricesTexture.toJSON(t),r.indirectTexture=this._indirectTexture.toJSON(t),this._colorsTexture!==null&&(r.colorsTexture=this._colorsTexture.toJSON(t)),this.boundingSphere!==null&&(r.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(r.boundingBox=this.boundingBox.toJSON()));function s(o,c){return o[c.uuid]===void 0&&(o[c.uuid]=c.toJSON(t)),c.uuid}if(this.isScene)this.background&&(this.background.isColor?r.background=this.background.toJSON():this.background.isTexture&&(r.background=this.background.toJSON(t).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(r.environment=this.environment.toJSON(t).uuid);else if(this.isMesh||this.isLine||this.isPoints){r.geometry=s(t.geometries,this.geometry);const o=this.geometry.parameters;if(o!==void 0&&o.shapes!==void 0){const c=o.shapes;if(Array.isArray(c))for(let l=0,h=c.length;l<h;l++){const u=c[l];s(t.shapes,u)}else s(t.shapes,c)}}if(this.isSkinnedMesh&&(r.bindMode=this.bindMode,r.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(s(t.skeletons,this.skeleton),r.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const o=[];for(let c=0,l=this.material.length;c<l;c++)o.push(s(t.materials,this.material[c]));r.material=o}else r.material=s(t.materials,this.material);if(this.children.length>0){r.children=[];for(let o=0;o<this.children.length;o++)r.children.push(this.children[o].toJSON(t).object)}if(this.animations.length>0){r.animations=[];for(let o=0;o<this.animations.length;o++){const c=this.animations[o];r.animations.push(s(t.animations,c))}}if(e){const o=a(t.geometries),c=a(t.materials),l=a(t.textures),h=a(t.images),u=a(t.shapes),d=a(t.skeletons),f=a(t.animations),m=a(t.nodes);o.length>0&&(n.geometries=o),c.length>0&&(n.materials=c),l.length>0&&(n.textures=l),h.length>0&&(n.images=h),u.length>0&&(n.shapes=u),d.length>0&&(n.skeletons=d),f.length>0&&(n.animations=f),m.length>0&&(n.nodes=m)}return n.object=r,n;function a(o){const c=[];for(const l in o){const h=o[l];delete h.metadata,c.push(h)}return c}}clone(t){return new this.constructor().copy(this,t)}copy(t,e=!0){if(this.name=t.name,this.up.copy(t.up),this.position.copy(t.position),this.rotation.order=t.rotation.order,this.quaternion.copy(t.quaternion),this.scale.copy(t.scale),this.matrix.copy(t.matrix),this.matrixWorld.copy(t.matrixWorld),this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrixWorldAutoUpdate=t.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=t.matrixWorldNeedsUpdate,this.layers.mask=t.layers.mask,this.visible=t.visible,this.castShadow=t.castShadow,this.receiveShadow=t.receiveShadow,this.frustumCulled=t.frustumCulled,this.renderOrder=t.renderOrder,this.animations=t.animations.slice(),this.userData=JSON.parse(JSON.stringify(t.userData)),e===!0)for(let n=0;n<t.children.length;n++){const r=t.children[n];this.add(r.clone())}return this}}Ie.DEFAULT_UP=new O(0,1,0);Ie.DEFAULT_MATRIX_AUTO_UPDATE=!0;Ie.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const Mn=new O,Yn=new O,Ca=new O,$n=new O,sr=new O,ar=new O,dl=new O,La=new O,Pa=new O,Da=new O,Ia=new le,Ua=new le,Na=new le;class yn{constructor(t=new O,e=new O,n=new O){this.a=t,this.b=e,this.c=n}static getNormal(t,e,n,r){r.subVectors(n,e),Mn.subVectors(t,e),r.cross(Mn);const s=r.lengthSq();return s>0?r.multiplyScalar(1/Math.sqrt(s)):r.set(0,0,0)}static getBarycoord(t,e,n,r,s){Mn.subVectors(r,e),Yn.subVectors(n,e),Ca.subVectors(t,e);const a=Mn.dot(Mn),o=Mn.dot(Yn),c=Mn.dot(Ca),l=Yn.dot(Yn),h=Yn.dot(Ca),u=a*l-o*o;if(u===0)return s.set(0,0,0),null;const d=1/u,f=(l*c-o*h)*d,m=(a*h-o*c)*d;return s.set(1-f-m,m,f)}static containsPoint(t,e,n,r){return this.getBarycoord(t,e,n,r,$n)===null?!1:$n.x>=0&&$n.y>=0&&$n.x+$n.y<=1}static getInterpolation(t,e,n,r,s,a,o,c){return this.getBarycoord(t,e,n,r,$n)===null?(c.x=0,c.y=0,"z"in c&&(c.z=0),"w"in c&&(c.w=0),null):(c.setScalar(0),c.addScaledVector(s,$n.x),c.addScaledVector(a,$n.y),c.addScaledVector(o,$n.z),c)}static getInterpolatedAttribute(t,e,n,r,s,a){return Ia.setScalar(0),Ua.setScalar(0),Na.setScalar(0),Ia.fromBufferAttribute(t,e),Ua.fromBufferAttribute(t,n),Na.fromBufferAttribute(t,r),a.setScalar(0),a.addScaledVector(Ia,s.x),a.addScaledVector(Ua,s.y),a.addScaledVector(Na,s.z),a}static isFrontFacing(t,e,n,r){return Mn.subVectors(n,e),Yn.subVectors(t,e),Mn.cross(Yn).dot(r)<0}set(t,e,n){return this.a.copy(t),this.b.copy(e),this.c.copy(n),this}setFromPointsAndIndices(t,e,n,r){return this.a.copy(t[e]),this.b.copy(t[n]),this.c.copy(t[r]),this}setFromAttributeAndIndices(t,e,n,r){return this.a.fromBufferAttribute(t,e),this.b.fromBufferAttribute(t,n),this.c.fromBufferAttribute(t,r),this}clone(){return new this.constructor().copy(this)}copy(t){return this.a.copy(t.a),this.b.copy(t.b),this.c.copy(t.c),this}getArea(){return Mn.subVectors(this.c,this.b),Yn.subVectors(this.a,this.b),Mn.cross(Yn).length()*.5}getMidpoint(t){return t.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(t){return yn.getNormal(this.a,this.b,this.c,t)}getPlane(t){return t.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,e){return yn.getBarycoord(t,this.a,this.b,this.c,e)}getInterpolation(t,e,n,r,s){return yn.getInterpolation(t,this.a,this.b,this.c,e,n,r,s)}containsPoint(t){return yn.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return yn.isFrontFacing(this.a,this.b,this.c,t)}intersectsBox(t){return t.intersectsTriangle(this)}closestPointToPoint(t,e){const n=this.a,r=this.b,s=this.c;let a,o;sr.subVectors(r,n),ar.subVectors(s,n),La.subVectors(t,n);const c=sr.dot(La),l=ar.dot(La);if(c<=0&&l<=0)return e.copy(n);Pa.subVectors(t,r);const h=sr.dot(Pa),u=ar.dot(Pa);if(h>=0&&u<=h)return e.copy(r);const d=c*u-h*l;if(d<=0&&c>=0&&h<=0)return a=c/(c-h),e.copy(n).addScaledVector(sr,a);Da.subVectors(t,s);const f=sr.dot(Da),m=ar.dot(Da);if(m>=0&&f<=m)return e.copy(s);const x=f*l-c*m;if(x<=0&&l>=0&&m<=0)return o=l/(l-m),e.copy(n).addScaledVector(ar,o);const g=h*m-f*u;if(g<=0&&u-h>=0&&f-m>=0)return dl.subVectors(s,r),o=(u-h)/(u-h+(f-m)),e.copy(r).addScaledVector(dl,o);const p=1/(g+x+d);return a=x*p,o=d*p,e.copy(n).addScaledVector(sr,a).addScaledVector(ar,o)}equals(t){return t.a.equals(this.a)&&t.b.equals(this.b)&&t.c.equals(this.c)}}const Qh={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},hi={h:0,s:0,l:0},ws={h:0,s:0,l:0};function Fa(i,t,e){return e<0&&(e+=1),e>1&&(e-=1),e<1/6?i+(t-i)*6*e:e<1/2?t:e<2/3?i+(t-i)*6*(2/3-e):i}class Ht{constructor(t,e,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(t,e,n)}set(t,e,n){if(e===void 0&&n===void 0){const r=t;r&&r.isColor?this.copy(r):typeof r=="number"?this.setHex(r):typeof r=="string"&&this.setStyle(r)}else this.setRGB(t,e,n);return this}setScalar(t){return this.r=t,this.g=t,this.b=t,this}setHex(t,e=rn){return t=Math.floor(t),this.r=(t>>16&255)/255,this.g=(t>>8&255)/255,this.b=(t&255)/255,re.colorSpaceToWorking(this,e),this}setRGB(t,e,n,r=re.workingColorSpace){return this.r=t,this.g=e,this.b=n,re.colorSpaceToWorking(this,r),this}setHSL(t,e,n,r=re.workingColorSpace){if(t=mc(t,1),e=Jt(e,0,1),n=Jt(n,0,1),e===0)this.r=this.g=this.b=n;else{const s=n<=.5?n*(1+e):n+e-n*e,a=2*n-s;this.r=Fa(a,s,t+1/3),this.g=Fa(a,s,t),this.b=Fa(a,s,t-1/3)}return re.colorSpaceToWorking(this,r),this}setStyle(t,e=rn){function n(s){s!==void 0&&parseFloat(s)<1&&console.warn("THREE.Color: Alpha component of "+t+" will be ignored.")}let r;if(r=/^(\w+)\(([^\)]*)\)/.exec(t)){let s;const a=r[1],o=r[2];switch(a){case"rgb":case"rgba":if(s=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(s[4]),this.setRGB(Math.min(255,parseInt(s[1],10))/255,Math.min(255,parseInt(s[2],10))/255,Math.min(255,parseInt(s[3],10))/255,e);if(s=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(s[4]),this.setRGB(Math.min(100,parseInt(s[1],10))/100,Math.min(100,parseInt(s[2],10))/100,Math.min(100,parseInt(s[3],10))/100,e);break;case"hsl":case"hsla":if(s=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(s[4]),this.setHSL(parseFloat(s[1])/360,parseFloat(s[2])/100,parseFloat(s[3])/100,e);break;default:console.warn("THREE.Color: Unknown color model "+t)}}else if(r=/^\#([A-Fa-f\d]+)$/.exec(t)){const s=r[1],a=s.length;if(a===3)return this.setRGB(parseInt(s.charAt(0),16)/15,parseInt(s.charAt(1),16)/15,parseInt(s.charAt(2),16)/15,e);if(a===6)return this.setHex(parseInt(s,16),e);console.warn("THREE.Color: Invalid hex color "+t)}else if(t&&t.length>0)return this.setColorName(t,e);return this}setColorName(t,e=rn){const n=Qh[t.toLowerCase()];return n!==void 0?this.setHex(n,e):console.warn("THREE.Color: Unknown color "+t),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(t){return this.r=t.r,this.g=t.g,this.b=t.b,this}copySRGBToLinear(t){return this.r=ti(t.r),this.g=ti(t.g),this.b=ti(t.b),this}copyLinearToSRGB(t){return this.r=br(t.r),this.g=br(t.g),this.b=br(t.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(t=rn){return re.workingToColorSpace(Be.copy(this),t),Math.round(Jt(Be.r*255,0,255))*65536+Math.round(Jt(Be.g*255,0,255))*256+Math.round(Jt(Be.b*255,0,255))}getHexString(t=rn){return("000000"+this.getHex(t).toString(16)).slice(-6)}getHSL(t,e=re.workingColorSpace){re.workingToColorSpace(Be.copy(this),e);const n=Be.r,r=Be.g,s=Be.b,a=Math.max(n,r,s),o=Math.min(n,r,s);let c,l;const h=(o+a)/2;if(o===a)c=0,l=0;else{const u=a-o;switch(l=h<=.5?u/(a+o):u/(2-a-o),a){case n:c=(r-s)/u+(r<s?6:0);break;case r:c=(s-n)/u+2;break;case s:c=(n-r)/u+4;break}c/=6}return t.h=c,t.s=l,t.l=h,t}getRGB(t,e=re.workingColorSpace){return re.workingToColorSpace(Be.copy(this),e),t.r=Be.r,t.g=Be.g,t.b=Be.b,t}getStyle(t=rn){re.workingToColorSpace(Be.copy(this),t);const e=Be.r,n=Be.g,r=Be.b;return t!==rn?`color(${t} ${e.toFixed(3)} ${n.toFixed(3)} ${r.toFixed(3)})`:`rgb(${Math.round(e*255)},${Math.round(n*255)},${Math.round(r*255)})`}offsetHSL(t,e,n){return this.getHSL(hi),this.setHSL(hi.h+t,hi.s+e,hi.l+n)}add(t){return this.r+=t.r,this.g+=t.g,this.b+=t.b,this}addColors(t,e){return this.r=t.r+e.r,this.g=t.g+e.g,this.b=t.b+e.b,this}addScalar(t){return this.r+=t,this.g+=t,this.b+=t,this}sub(t){return this.r=Math.max(0,this.r-t.r),this.g=Math.max(0,this.g-t.g),this.b=Math.max(0,this.b-t.b),this}multiply(t){return this.r*=t.r,this.g*=t.g,this.b*=t.b,this}multiplyScalar(t){return this.r*=t,this.g*=t,this.b*=t,this}lerp(t,e){return this.r+=(t.r-this.r)*e,this.g+=(t.g-this.g)*e,this.b+=(t.b-this.b)*e,this}lerpColors(t,e,n){return this.r=t.r+(e.r-t.r)*n,this.g=t.g+(e.g-t.g)*n,this.b=t.b+(e.b-t.b)*n,this}lerpHSL(t,e){this.getHSL(hi),t.getHSL(ws);const n=$r(hi.h,ws.h,e),r=$r(hi.s,ws.s,e),s=$r(hi.l,ws.l,e);return this.setHSL(n,r,s),this}setFromVector3(t){return this.r=t.x,this.g=t.y,this.b=t.z,this}applyMatrix3(t){const e=this.r,n=this.g,r=this.b,s=t.elements;return this.r=s[0]*e+s[3]*n+s[6]*r,this.g=s[1]*e+s[4]*n+s[7]*r,this.b=s[2]*e+s[5]*n+s[8]*r,this}equals(t){return t.r===this.r&&t.g===this.g&&t.b===this.b}fromArray(t,e=0){return this.r=t[e],this.g=t[e+1],this.b=t[e+2],this}toArray(t=[],e=0){return t[e]=this.r,t[e+1]=this.g,t[e+2]=this.b,t}fromBufferAttribute(t,e){return this.r=t.getX(e),this.g=t.getY(e),this.b=t.getZ(e),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const Be=new Ht;Ht.NAMES=Qh;let kd=0;class hs extends Lr{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:kd++}),this.uuid=Yi(),this.name="",this.type="Material",this.blending=Mr,this.side=Mi,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=fo,this.blendDst=po,this.blendEquation=Pi,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Ht(0,0,0),this.blendAlpha=0,this.depthFunc=yr,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=Jc,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Ki,this.stencilZFail=Ki,this.stencilZPass=Ki,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(t){this._alphaTest>0!=t>0&&this.version++,this._alphaTest=t}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(t){if(t!==void 0)for(const e in t){const n=t[e];if(n===void 0){console.warn(`THREE.Material: parameter '${e}' has value of undefined.`);continue}const r=this[e];if(r===void 0){console.warn(`THREE.Material: '${e}' is not a property of THREE.${this.type}.`);continue}r&&r.isColor?r.set(n):r&&r.isVector3&&n&&n.isVector3?r.copy(n):this[e]=n}}toJSON(t){const e=t===void 0||typeof t=="string";e&&(t={textures:{},images:{}});const n={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(t).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(t).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(t).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(n.sheenColorMap=this.sheenColorMap.toJSON(t).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(n.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(t).uuid),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(t).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(t).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(t).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(t).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(t).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(t).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(t).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(t).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(t).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(t).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(t).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(t).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(t).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(t).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(t).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(t).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(t).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(t).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(t).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(t).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(t).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==Mr&&(n.blending=this.blending),this.side!==Mi&&(n.side=this.side),this.vertexColors===!0&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=!0),this.blendSrc!==fo&&(n.blendSrc=this.blendSrc),this.blendDst!==po&&(n.blendDst=this.blendDst),this.blendEquation!==Pi&&(n.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(n.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(n.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(n.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(n.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(n.blendAlpha=this.blendAlpha),this.depthFunc!==yr&&(n.depthFunc=this.depthFunc),this.depthTest===!1&&(n.depthTest=this.depthTest),this.depthWrite===!1&&(n.depthWrite=this.depthWrite),this.colorWrite===!1&&(n.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(n.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==Jc&&(n.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(n.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(n.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==Ki&&(n.stencilFail=this.stencilFail),this.stencilZFail!==Ki&&(n.stencilZFail=this.stencilZFail),this.stencilZPass!==Ki&&(n.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(n.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=!0),this.alphaToCoverage===!0&&(n.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=!0),this.forceSinglePass===!0&&(n.forceSinglePass=!0),this.wireframe===!0&&(n.wireframe=!0),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=!0),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData);function r(s){const a=[];for(const o in s){const c=s[o];delete c.metadata,a.push(c)}return a}if(e){const s=r(t.textures),a=r(t.images);s.length>0&&(n.textures=s),a.length>0&&(n.images=a)}return n}clone(){return new this.constructor().copy(this)}copy(t){this.name=t.name,this.blending=t.blending,this.side=t.side,this.vertexColors=t.vertexColors,this.opacity=t.opacity,this.transparent=t.transparent,this.blendSrc=t.blendSrc,this.blendDst=t.blendDst,this.blendEquation=t.blendEquation,this.blendSrcAlpha=t.blendSrcAlpha,this.blendDstAlpha=t.blendDstAlpha,this.blendEquationAlpha=t.blendEquationAlpha,this.blendColor.copy(t.blendColor),this.blendAlpha=t.blendAlpha,this.depthFunc=t.depthFunc,this.depthTest=t.depthTest,this.depthWrite=t.depthWrite,this.stencilWriteMask=t.stencilWriteMask,this.stencilFunc=t.stencilFunc,this.stencilRef=t.stencilRef,this.stencilFuncMask=t.stencilFuncMask,this.stencilFail=t.stencilFail,this.stencilZFail=t.stencilZFail,this.stencilZPass=t.stencilZPass,this.stencilWrite=t.stencilWrite;const e=t.clippingPlanes;let n=null;if(e!==null){const r=e.length;n=new Array(r);for(let s=0;s!==r;++s)n[s]=e[s].clone()}return this.clippingPlanes=n,this.clipIntersection=t.clipIntersection,this.clipShadows=t.clipShadows,this.shadowSide=t.shadowSide,this.colorWrite=t.colorWrite,this.precision=t.precision,this.polygonOffset=t.polygonOffset,this.polygonOffsetFactor=t.polygonOffsetFactor,this.polygonOffsetUnits=t.polygonOffsetUnits,this.dithering=t.dithering,this.alphaTest=t.alphaTest,this.alphaHash=t.alphaHash,this.alphaToCoverage=t.alphaToCoverage,this.premultipliedAlpha=t.premultipliedAlpha,this.forceSinglePass=t.forceSinglePass,this.visible=t.visible,this.toneMapped=t.toneMapped,this.userData=JSON.parse(JSON.stringify(t.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(t){t===!0&&this.version++}}class fa extends hs{constructor(t){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new Ht(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new vn,this.combine=Oh,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.fog=t.fog,this}}const Jn=Hd();function Hd(){const i=new ArrayBuffer(4),t=new Float32Array(i),e=new Uint32Array(i),n=new Uint32Array(512),r=new Uint32Array(512);for(let c=0;c<256;++c){const l=c-127;l<-27?(n[c]=0,n[c|256]=32768,r[c]=24,r[c|256]=24):l<-14?(n[c]=1024>>-l-14,n[c|256]=1024>>-l-14|32768,r[c]=-l-1,r[c|256]=-l-1):l<=15?(n[c]=l+15<<10,n[c|256]=l+15<<10|32768,r[c]=13,r[c|256]=13):l<128?(n[c]=31744,n[c|256]=64512,r[c]=24,r[c|256]=24):(n[c]=31744,n[c|256]=64512,r[c]=13,r[c|256]=13)}const s=new Uint32Array(2048),a=new Uint32Array(64),o=new Uint32Array(64);for(let c=1;c<1024;++c){let l=c<<13,h=0;for(;(l&8388608)===0;)l<<=1,h-=8388608;l&=-8388609,h+=947912704,s[c]=l|h}for(let c=1024;c<2048;++c)s[c]=939524096+(c-1024<<13);for(let c=1;c<31;++c)a[c]=c<<23;a[31]=1199570944,a[32]=2147483648;for(let c=33;c<63;++c)a[c]=2147483648+(c-32<<23);a[63]=3347054592;for(let c=1;c<64;++c)c!==32&&(o[c]=1024);return{floatView:t,uint32View:e,baseTable:n,shiftTable:r,mantissaTable:s,exponentTable:a,offsetTable:o}}function zd(i){Math.abs(i)>65504&&console.warn("THREE.DataUtils.toHalfFloat(): Value out of range."),i=Jt(i,-65504,65504),Jn.floatView[0]=i;const t=Jn.uint32View[0],e=t>>23&511;return Jn.baseTable[e]+((t&8388607)>>Jn.shiftTable[e])}function Vd(i){const t=i>>10;return Jn.uint32View[0]=Jn.mantissaTable[Jn.offsetTable[t]+(i&1023)]+Jn.exponentTable[t],Jn.floatView[0]}class Ts{static toHalfFloat(t){return zd(t)}static fromHalfFloat(t){return Vd(t)}}const Ee=new O,As=new Rt;let Gd=0;class ae{constructor(t,e,n=!1){if(Array.isArray(t))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:Gd++}),this.name="",this.array=t,this.itemSize=e,this.count=t!==void 0?t.length/e:0,this.normalized=n,this.usage=Qc,this.updateRanges=[],this.gpuType=kn,this.version=0}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.name=t.name,this.array=new t.array.constructor(t.array),this.itemSize=t.itemSize,this.count=t.count,this.normalized=t.normalized,this.usage=t.usage,this.gpuType=t.gpuType,this}copyAt(t,e,n){t*=this.itemSize,n*=e.itemSize;for(let r=0,s=this.itemSize;r<s;r++)this.array[t+r]=e.array[n+r];return this}copyArray(t){return this.array.set(t),this}applyMatrix3(t){if(this.itemSize===2)for(let e=0,n=this.count;e<n;e++)As.fromBufferAttribute(this,e),As.applyMatrix3(t),this.setXY(e,As.x,As.y);else if(this.itemSize===3)for(let e=0,n=this.count;e<n;e++)Ee.fromBufferAttribute(this,e),Ee.applyMatrix3(t),this.setXYZ(e,Ee.x,Ee.y,Ee.z);return this}applyMatrix4(t){for(let e=0,n=this.count;e<n;e++)Ee.fromBufferAttribute(this,e),Ee.applyMatrix4(t),this.setXYZ(e,Ee.x,Ee.y,Ee.z);return this}applyNormalMatrix(t){for(let e=0,n=this.count;e<n;e++)Ee.fromBufferAttribute(this,e),Ee.applyNormalMatrix(t),this.setXYZ(e,Ee.x,Ee.y,Ee.z);return this}transformDirection(t){for(let e=0,n=this.count;e<n;e++)Ee.fromBufferAttribute(this,e),Ee.transformDirection(t),this.setXYZ(e,Ee.x,Ee.y,Ee.z);return this}set(t,e=0){return this.array.set(t,e),this}getComponent(t,e){let n=this.array[t*this.itemSize+e];return this.normalized&&(n=mr(n,this.array)),n}setComponent(t,e,n){return this.normalized&&(n=Ve(n,this.array)),this.array[t*this.itemSize+e]=n,this}getX(t){let e=this.array[t*this.itemSize];return this.normalized&&(e=mr(e,this.array)),e}setX(t,e){return this.normalized&&(e=Ve(e,this.array)),this.array[t*this.itemSize]=e,this}getY(t){let e=this.array[t*this.itemSize+1];return this.normalized&&(e=mr(e,this.array)),e}setY(t,e){return this.normalized&&(e=Ve(e,this.array)),this.array[t*this.itemSize+1]=e,this}getZ(t){let e=this.array[t*this.itemSize+2];return this.normalized&&(e=mr(e,this.array)),e}setZ(t,e){return this.normalized&&(e=Ve(e,this.array)),this.array[t*this.itemSize+2]=e,this}getW(t){let e=this.array[t*this.itemSize+3];return this.normalized&&(e=mr(e,this.array)),e}setW(t,e){return this.normalized&&(e=Ve(e,this.array)),this.array[t*this.itemSize+3]=e,this}setXY(t,e,n){return t*=this.itemSize,this.normalized&&(e=Ve(e,this.array),n=Ve(n,this.array)),this.array[t+0]=e,this.array[t+1]=n,this}setXYZ(t,e,n,r){return t*=this.itemSize,this.normalized&&(e=Ve(e,this.array),n=Ve(n,this.array),r=Ve(r,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=r,this}setXYZW(t,e,n,r,s){return t*=this.itemSize,this.normalized&&(e=Ve(e,this.array),n=Ve(n,this.array),r=Ve(r,this.array),s=Ve(s,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=r,this.array[t+3]=s,this}onUpload(t){return this.onUploadCallback=t,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const t={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(t.name=this.name),this.usage!==Qc&&(t.usage=this.usage),t}}class tu extends ae{constructor(t,e,n){super(new Uint16Array(t),e,n)}}class eu extends ae{constructor(t,e,n){super(new Uint32Array(t),e,n)}}class he extends ae{constructor(t,e,n){super(new Float32Array(t),e,n)}}let Wd=0;const un=new ne,Oa=new Ie,or=new O,nn=new Pr,zr=new Pr,Pe=new O;class Ue extends Lr{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:Wd++}),this.uuid=Yi(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(t){return Array.isArray(t)?this.index=new(Zh(t)?eu:tu)(t,1):this.index=t,this}setIndirect(t){return this.indirect=t,this}getIndirect(){return this.indirect}getAttribute(t){return this.attributes[t]}setAttribute(t,e){return this.attributes[t]=e,this}deleteAttribute(t){return delete this.attributes[t],this}hasAttribute(t){return this.attributes[t]!==void 0}addGroup(t,e,n=0){this.groups.push({start:t,count:e,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(t,e){this.drawRange.start=t,this.drawRange.count=e}applyMatrix4(t){const e=this.attributes.position;e!==void 0&&(e.applyMatrix4(t),e.needsUpdate=!0);const n=this.attributes.normal;if(n!==void 0){const s=new Zt().getNormalMatrix(t);n.applyNormalMatrix(s),n.needsUpdate=!0}const r=this.attributes.tangent;return r!==void 0&&(r.transformDirection(t),r.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(t){return un.makeRotationFromQuaternion(t),this.applyMatrix4(un),this}rotateX(t){return un.makeRotationX(t),this.applyMatrix4(un),this}rotateY(t){return un.makeRotationY(t),this.applyMatrix4(un),this}rotateZ(t){return un.makeRotationZ(t),this.applyMatrix4(un),this}translate(t,e,n){return un.makeTranslation(t,e,n),this.applyMatrix4(un),this}scale(t,e,n){return un.makeScale(t,e,n),this.applyMatrix4(un),this}lookAt(t){return Oa.lookAt(t),Oa.updateMatrix(),this.applyMatrix4(Oa.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(or).negate(),this.translate(or.x,or.y,or.z),this}setFromPoints(t){const e=this.getAttribute("position");if(e===void 0){const n=[];for(let r=0,s=t.length;r<s;r++){const a=t[r];n.push(a.x,a.y,a.z||0)}this.setAttribute("position",new he(n,3))}else{const n=Math.min(t.length,e.count);for(let r=0;r<n;r++){const s=t[r];e.setXYZ(r,s.x,s.y,s.z||0)}t.length>e.count&&console.warn("THREE.BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),e.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new Pr);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new O(-1/0,-1/0,-1/0),new O(1/0,1/0,1/0));return}if(t!==void 0){if(this.boundingBox.setFromBufferAttribute(t),e)for(let n=0,r=e.length;n<r;n++){const s=e[n];nn.setFromBufferAttribute(s),this.morphTargetsRelative?(Pe.addVectors(this.boundingBox.min,nn.min),this.boundingBox.expandByPoint(Pe),Pe.addVectors(this.boundingBox.max,nn.max),this.boundingBox.expandByPoint(Pe)):(this.boundingBox.expandByPoint(nn.min),this.boundingBox.expandByPoint(nn.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Dr);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new O,1/0);return}if(t){const n=this.boundingSphere.center;if(nn.setFromBufferAttribute(t),e)for(let s=0,a=e.length;s<a;s++){const o=e[s];zr.setFromBufferAttribute(o),this.morphTargetsRelative?(Pe.addVectors(nn.min,zr.min),nn.expandByPoint(Pe),Pe.addVectors(nn.max,zr.max),nn.expandByPoint(Pe)):(nn.expandByPoint(zr.min),nn.expandByPoint(zr.max))}nn.getCenter(n);let r=0;for(let s=0,a=t.count;s<a;s++)Pe.fromBufferAttribute(t,s),r=Math.max(r,n.distanceToSquared(Pe));if(e)for(let s=0,a=e.length;s<a;s++){const o=e[s],c=this.morphTargetsRelative;for(let l=0,h=o.count;l<h;l++)Pe.fromBufferAttribute(o,l),c&&(or.fromBufferAttribute(t,l),Pe.add(or)),r=Math.max(r,n.distanceToSquared(Pe))}this.boundingSphere.radius=Math.sqrt(r),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const t=this.index,e=this.attributes;if(t===null||e.position===void 0||e.normal===void 0||e.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const n=e.position,r=e.normal,s=e.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new ae(new Float32Array(4*n.count),4));const a=this.getAttribute("tangent"),o=[],c=[];for(let R=0;R<n.count;R++)o[R]=new O,c[R]=new O;const l=new O,h=new O,u=new O,d=new Rt,f=new Rt,m=new Rt,x=new O,g=new O;function p(R,v,_){l.fromBufferAttribute(n,R),h.fromBufferAttribute(n,v),u.fromBufferAttribute(n,_),d.fromBufferAttribute(s,R),f.fromBufferAttribute(s,v),m.fromBufferAttribute(s,_),h.sub(l),u.sub(l),f.sub(d),m.sub(d);const S=1/(f.x*m.y-m.x*f.y);isFinite(S)&&(x.copy(h).multiplyScalar(m.y).addScaledVector(u,-f.y).multiplyScalar(S),g.copy(u).multiplyScalar(f.x).addScaledVector(h,-m.x).multiplyScalar(S),o[R].add(x),o[v].add(x),o[_].add(x),c[R].add(g),c[v].add(g),c[_].add(g))}let E=this.groups;E.length===0&&(E=[{start:0,count:t.count}]);for(let R=0,v=E.length;R<v;++R){const _=E[R],S=_.start,y=_.count;for(let D=S,I=S+y;D<I;D+=3)p(t.getX(D+0),t.getX(D+1),t.getX(D+2))}const b=new O,M=new O,T=new O,w=new O;function A(R){T.fromBufferAttribute(r,R),w.copy(T);const v=o[R];b.copy(v),b.sub(T.multiplyScalar(T.dot(v))).normalize(),M.crossVectors(w,v);const S=M.dot(c[R])<0?-1:1;a.setXYZW(R,b.x,b.y,b.z,S)}for(let R=0,v=E.length;R<v;++R){const _=E[R],S=_.start,y=_.count;for(let D=S,I=S+y;D<I;D+=3)A(t.getX(D+0)),A(t.getX(D+1)),A(t.getX(D+2))}}computeVertexNormals(){const t=this.index,e=this.getAttribute("position");if(e!==void 0){let n=this.getAttribute("normal");if(n===void 0)n=new ae(new Float32Array(e.count*3),3),this.setAttribute("normal",n);else for(let d=0,f=n.count;d<f;d++)n.setXYZ(d,0,0,0);const r=new O,s=new O,a=new O,o=new O,c=new O,l=new O,h=new O,u=new O;if(t)for(let d=0,f=t.count;d<f;d+=3){const m=t.getX(d+0),x=t.getX(d+1),g=t.getX(d+2);r.fromBufferAttribute(e,m),s.fromBufferAttribute(e,x),a.fromBufferAttribute(e,g),h.subVectors(a,s),u.subVectors(r,s),h.cross(u),o.fromBufferAttribute(n,m),c.fromBufferAttribute(n,x),l.fromBufferAttribute(n,g),o.add(h),c.add(h),l.add(h),n.setXYZ(m,o.x,o.y,o.z),n.setXYZ(x,c.x,c.y,c.z),n.setXYZ(g,l.x,l.y,l.z)}else for(let d=0,f=e.count;d<f;d+=3)r.fromBufferAttribute(e,d+0),s.fromBufferAttribute(e,d+1),a.fromBufferAttribute(e,d+2),h.subVectors(a,s),u.subVectors(r,s),h.cross(u),n.setXYZ(d+0,h.x,h.y,h.z),n.setXYZ(d+1,h.x,h.y,h.z),n.setXYZ(d+2,h.x,h.y,h.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){const t=this.attributes.normal;for(let e=0,n=t.count;e<n;e++)Pe.fromBufferAttribute(t,e),Pe.normalize(),t.setXYZ(e,Pe.x,Pe.y,Pe.z)}toNonIndexed(){function t(o,c){const l=o.array,h=o.itemSize,u=o.normalized,d=new l.constructor(c.length*h);let f=0,m=0;for(let x=0,g=c.length;x<g;x++){o.isInterleavedBufferAttribute?f=c[x]*o.data.stride+o.offset:f=c[x]*h;for(let p=0;p<h;p++)d[m++]=l[f++]}return new ae(d,h,u)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const e=new Ue,n=this.index.array,r=this.attributes;for(const o in r){const c=r[o],l=t(c,n);e.setAttribute(o,l)}const s=this.morphAttributes;for(const o in s){const c=[],l=s[o];for(let h=0,u=l.length;h<u;h++){const d=l[h],f=t(d,n);c.push(f)}e.morphAttributes[o]=c}e.morphTargetsRelative=this.morphTargetsRelative;const a=this.groups;for(let o=0,c=a.length;o<c;o++){const l=a[o];e.addGroup(l.start,l.count,l.materialIndex)}return e}toJSON(){const t={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(t.uuid=this.uuid,t.type=this.type,this.name!==""&&(t.name=this.name),Object.keys(this.userData).length>0&&(t.userData=this.userData),this.parameters!==void 0){const c=this.parameters;for(const l in c)c[l]!==void 0&&(t[l]=c[l]);return t}t.data={attributes:{}};const e=this.index;e!==null&&(t.data.index={type:e.array.constructor.name,array:Array.prototype.slice.call(e.array)});const n=this.attributes;for(const c in n){const l=n[c];t.data.attributes[c]=l.toJSON(t.data)}const r={};let s=!1;for(const c in this.morphAttributes){const l=this.morphAttributes[c],h=[];for(let u=0,d=l.length;u<d;u++){const f=l[u];h.push(f.toJSON(t.data))}h.length>0&&(r[c]=h,s=!0)}s&&(t.data.morphAttributes=r,t.data.morphTargetsRelative=this.morphTargetsRelative);const a=this.groups;a.length>0&&(t.data.groups=JSON.parse(JSON.stringify(a)));const o=this.boundingSphere;return o!==null&&(t.data.boundingSphere=o.toJSON()),t}clone(){return new this.constructor().copy(this)}copy(t){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const e={};this.name=t.name;const n=t.index;n!==null&&this.setIndex(n.clone());const r=t.attributes;for(const l in r){const h=r[l];this.setAttribute(l,h.clone(e))}const s=t.morphAttributes;for(const l in s){const h=[],u=s[l];for(let d=0,f=u.length;d<f;d++)h.push(u[d].clone(e));this.morphAttributes[l]=h}this.morphTargetsRelative=t.morphTargetsRelative;const a=t.groups;for(let l=0,h=a.length;l<h;l++){const u=a[l];this.addGroup(u.start,u.count,u.materialIndex)}const o=t.boundingBox;o!==null&&(this.boundingBox=o.clone());const c=t.boundingSphere;return c!==null&&(this.boundingSphere=c.clone()),this.drawRange.start=t.drawRange.start,this.drawRange.count=t.drawRange.count,this.userData=t.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const pl=new ne,wi=new Kh,Rs=new Dr,ml=new O,Cs=new O,Ls=new O,Ps=new O,Ba=new O,Ds=new O,gl=new O,Is=new O;class Wt extends Ie{constructor(t=new Ue,e=new fa){super(),this.isMesh=!0,this.type="Mesh",this.geometry=t,this.material=e,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),t.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=t.morphTargetInfluences.slice()),t.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},t.morphTargetDictionary)),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}updateMorphTargets(){const e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){const r=e[n[0]];if(r!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,a=r.length;s<a;s++){const o=r[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=s}}}}getVertexPosition(t,e){const n=this.geometry,r=n.attributes.position,s=n.morphAttributes.position,a=n.morphTargetsRelative;e.fromBufferAttribute(r,t);const o=this.morphTargetInfluences;if(s&&o){Ds.set(0,0,0);for(let c=0,l=s.length;c<l;c++){const h=o[c],u=s[c];h!==0&&(Ba.fromBufferAttribute(u,t),a?Ds.addScaledVector(Ba,h):Ds.addScaledVector(Ba.sub(e),h))}e.add(Ds)}return e}raycast(t,e){const n=this.geometry,r=this.material,s=this.matrixWorld;r!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),Rs.copy(n.boundingSphere),Rs.applyMatrix4(s),wi.copy(t.ray).recast(t.near),!(Rs.containsPoint(wi.origin)===!1&&(wi.intersectSphere(Rs,ml)===null||wi.origin.distanceToSquared(ml)>(t.far-t.near)**2))&&(pl.copy(s).invert(),wi.copy(t.ray).applyMatrix4(pl),!(n.boundingBox!==null&&wi.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(t,e,wi)))}_computeIntersections(t,e,n){let r;const s=this.geometry,a=this.material,o=s.index,c=s.attributes.position,l=s.attributes.uv,h=s.attributes.uv1,u=s.attributes.normal,d=s.groups,f=s.drawRange;if(o!==null)if(Array.isArray(a))for(let m=0,x=d.length;m<x;m++){const g=d[m],p=a[g.materialIndex],E=Math.max(g.start,f.start),b=Math.min(o.count,Math.min(g.start+g.count,f.start+f.count));for(let M=E,T=b;M<T;M+=3){const w=o.getX(M),A=o.getX(M+1),R=o.getX(M+2);r=Us(this,p,t,n,l,h,u,w,A,R),r&&(r.faceIndex=Math.floor(M/3),r.face.materialIndex=g.materialIndex,e.push(r))}}else{const m=Math.max(0,f.start),x=Math.min(o.count,f.start+f.count);for(let g=m,p=x;g<p;g+=3){const E=o.getX(g),b=o.getX(g+1),M=o.getX(g+2);r=Us(this,a,t,n,l,h,u,E,b,M),r&&(r.faceIndex=Math.floor(g/3),e.push(r))}}else if(c!==void 0)if(Array.isArray(a))for(let m=0,x=d.length;m<x;m++){const g=d[m],p=a[g.materialIndex],E=Math.max(g.start,f.start),b=Math.min(c.count,Math.min(g.start+g.count,f.start+f.count));for(let M=E,T=b;M<T;M+=3){const w=M,A=M+1,R=M+2;r=Us(this,p,t,n,l,h,u,w,A,R),r&&(r.faceIndex=Math.floor(M/3),r.face.materialIndex=g.materialIndex,e.push(r))}}else{const m=Math.max(0,f.start),x=Math.min(c.count,f.start+f.count);for(let g=m,p=x;g<p;g+=3){const E=g,b=g+1,M=g+2;r=Us(this,a,t,n,l,h,u,E,b,M),r&&(r.faceIndex=Math.floor(g/3),e.push(r))}}}}function Xd(i,t,e,n,r,s,a,o){let c;if(t.side===Je?c=n.intersectTriangle(a,s,r,!0,o):c=n.intersectTriangle(r,s,a,t.side===Mi,o),c===null)return null;Is.copy(o),Is.applyMatrix4(i.matrixWorld);const l=e.ray.origin.distanceTo(Is);return l<e.near||l>e.far?null:{distance:l,point:Is.clone(),object:i}}function Us(i,t,e,n,r,s,a,o,c,l){i.getVertexPosition(o,Cs),i.getVertexPosition(c,Ls),i.getVertexPosition(l,Ps);const h=Xd(i,t,e,n,Cs,Ls,Ps,gl);if(h){const u=new O;yn.getBarycoord(gl,Cs,Ls,Ps,u),r&&(h.uv=yn.getInterpolatedAttribute(r,o,c,l,u,new Rt)),s&&(h.uv1=yn.getInterpolatedAttribute(s,o,c,l,u,new Rt)),a&&(h.normal=yn.getInterpolatedAttribute(a,o,c,l,u,new O),h.normal.dot(n.direction)>0&&h.normal.multiplyScalar(-1));const d={a:o,b:c,c:l,normal:new O,materialIndex:0};yn.getNormal(Cs,Ls,Ps,d.normal),h.face=d,h.barycoord=u}return h}class Xe extends Ue{constructor(t=1,e=1,n=1,r=1,s=1,a=1){super(),this.type="BoxGeometry",this.parameters={width:t,height:e,depth:n,widthSegments:r,heightSegments:s,depthSegments:a};const o=this;r=Math.floor(r),s=Math.floor(s),a=Math.floor(a);const c=[],l=[],h=[],u=[];let d=0,f=0;m("z","y","x",-1,-1,n,e,t,a,s,0),m("z","y","x",1,-1,n,e,-t,a,s,1),m("x","z","y",1,1,t,n,e,r,a,2),m("x","z","y",1,-1,t,n,-e,r,a,3),m("x","y","z",1,-1,t,e,n,r,s,4),m("x","y","z",-1,-1,t,e,-n,r,s,5),this.setIndex(c),this.setAttribute("position",new he(l,3)),this.setAttribute("normal",new he(h,3)),this.setAttribute("uv",new he(u,2));function m(x,g,p,E,b,M,T,w,A,R,v){const _=M/A,S=T/R,y=M/2,D=T/2,I=w/2,U=A+1,H=R+1;let $=0,V=0;const tt=new O;for(let st=0;st<H;st++){const ct=st*S-D;for(let ft=0;ft<U;ft++){const Ct=ft*_-y;tt[x]=Ct*E,tt[g]=ct*b,tt[p]=I,l.push(tt.x,tt.y,tt.z),tt[x]=0,tt[g]=0,tt[p]=w>0?1:-1,h.push(tt.x,tt.y,tt.z),u.push(ft/A),u.push(1-st/R),$+=1}}for(let st=0;st<R;st++)for(let ct=0;ct<A;ct++){const ft=d+ct+U*st,Ct=d+ct+U*(st+1),zt=d+(ct+1)+U*(st+1),it=d+(ct+1)+U*st;c.push(ft,Ct,it),c.push(Ct,zt,it),V+=6}o.addGroup(f,V,v),f+=V,d+=$}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Xe(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}}function Tr(i){const t={};for(const e in i){t[e]={};for(const n in i[e]){const r=i[e][n];r&&(r.isColor||r.isMatrix3||r.isMatrix4||r.isVector2||r.isVector3||r.isVector4||r.isTexture||r.isQuaternion)?r.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),t[e][n]=null):t[e][n]=r.clone():Array.isArray(r)?t[e][n]=r.slice():t[e][n]=r}}return t}function Ge(i){const t={};for(let e=0;e<i.length;e++){const n=Tr(i[e]);for(const r in n)t[r]=n[r]}return t}function qd(i){const t=[];for(let e=0;e<i.length;e++)t.push(i[e].clone());return t}function nu(i){const t=i.getRenderTarget();return t===null?i.outputColorSpace:t.isXRRenderTarget===!0?t.texture.colorSpace:re.workingColorSpace}const Yd={clone:Tr,merge:Ge};var $d=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,jd=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class Ke extends hs{constructor(t){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=$d,this.fragmentShader=jd,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,t!==void 0&&this.setValues(t)}copy(t){return super.copy(t),this.fragmentShader=t.fragmentShader,this.vertexShader=t.vertexShader,this.uniforms=Tr(t.uniforms),this.uniformsGroups=qd(t.uniformsGroups),this.defines=Object.assign({},t.defines),this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.fog=t.fog,this.lights=t.lights,this.clipping=t.clipping,this.extensions=Object.assign({},t.extensions),this.glslVersion=t.glslVersion,this}toJSON(t){const e=super.toJSON(t);e.glslVersion=this.glslVersion,e.uniforms={};for(const r in this.uniforms){const a=this.uniforms[r].value;a&&a.isTexture?e.uniforms[r]={type:"t",value:a.toJSON(t).uuid}:a&&a.isColor?e.uniforms[r]={type:"c",value:a.getHex()}:a&&a.isVector2?e.uniforms[r]={type:"v2",value:a.toArray()}:a&&a.isVector3?e.uniforms[r]={type:"v3",value:a.toArray()}:a&&a.isVector4?e.uniforms[r]={type:"v4",value:a.toArray()}:a&&a.isMatrix3?e.uniforms[r]={type:"m3",value:a.toArray()}:a&&a.isMatrix4?e.uniforms[r]={type:"m4",value:a.toArray()}:e.uniforms[r]={value:a}}Object.keys(this.defines).length>0&&(e.defines=this.defines),e.vertexShader=this.vertexShader,e.fragmentShader=this.fragmentShader,e.lights=this.lights,e.clipping=this.clipping;const n={};for(const r in this.extensions)this.extensions[r]===!0&&(n[r]=!0);return Object.keys(n).length>0&&(e.extensions=n),e}}class iu extends Ie{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new ne,this.projectionMatrix=new ne,this.projectionMatrixInverse=new ne,this.coordinateSystem=Hn,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(t,e){return super.copy(t,e),this.matrixWorldInverse.copy(t.matrixWorldInverse),this.projectionMatrix.copy(t.projectionMatrix),this.projectionMatrixInverse.copy(t.projectionMatrixInverse),this.coordinateSystem=t.coordinateSystem,this}getWorldDirection(t){return super.getWorldDirection(t).negate()}updateMatrixWorld(t){super.updateMatrixWorld(t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(t,e){super.updateWorldMatrix(t,e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}const ui=new O,vl=new Rt,_l=new Rt;class gn extends iu{constructor(t=50,e=1,n=.1,r=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=t,this.zoom=1,this.near=n,this.far=r,this.focus=10,this.aspect=e,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.fov=t.fov,this.zoom=t.zoom,this.near=t.near,this.far=t.far,this.focus=t.focus,this.aspect=t.aspect,this.view=t.view===null?null:Object.assign({},t.view),this.filmGauge=t.filmGauge,this.filmOffset=t.filmOffset,this}setFocalLength(t){const e=.5*this.getFilmHeight()/t;this.fov=ss*2*Math.atan(e),this.updateProjectionMatrix()}getFocalLength(){const t=Math.tan(Yr*.5*this.fov);return .5*this.getFilmHeight()/t}getEffectiveFOV(){return ss*2*Math.atan(Math.tan(Yr*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(t,e,n){ui.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),e.set(ui.x,ui.y).multiplyScalar(-t/ui.z),ui.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(ui.x,ui.y).multiplyScalar(-t/ui.z)}getViewSize(t,e){return this.getViewBounds(t,vl,_l),e.subVectors(_l,vl)}setViewOffset(t,e,n,r,s,a){this.aspect=t/e,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=r,this.view.width=s,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=this.near;let e=t*Math.tan(Yr*.5*this.fov)/this.zoom,n=2*e,r=this.aspect*n,s=-.5*r;const a=this.view;if(this.view!==null&&this.view.enabled){const c=a.fullWidth,l=a.fullHeight;s+=a.offsetX*r/c,e-=a.offsetY*n/l,r*=a.width/c,n*=a.height/l}const o=this.filmOffset;o!==0&&(s+=t*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(s,s+r,e,e-n,t,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.fov=this.fov,e.object.zoom=this.zoom,e.object.near=this.near,e.object.far=this.far,e.object.focus=this.focus,e.object.aspect=this.aspect,this.view!==null&&(e.object.view=Object.assign({},this.view)),e.object.filmGauge=this.filmGauge,e.object.filmOffset=this.filmOffset,e}}const cr=-90,lr=1;class Zd extends Ie{constructor(t,e,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;const r=new gn(cr,lr,t,e);r.layers=this.layers,this.add(r);const s=new gn(cr,lr,t,e);s.layers=this.layers,this.add(s);const a=new gn(cr,lr,t,e);a.layers=this.layers,this.add(a);const o=new gn(cr,lr,t,e);o.layers=this.layers,this.add(o);const c=new gn(cr,lr,t,e);c.layers=this.layers,this.add(c);const l=new gn(cr,lr,t,e);l.layers=this.layers,this.add(l)}updateCoordinateSystem(){const t=this.coordinateSystem,e=this.children.concat(),[n,r,s,a,o,c]=e;for(const l of e)this.remove(l);if(t===Hn)n.up.set(0,1,0),n.lookAt(1,0,0),r.up.set(0,1,0),r.lookAt(-1,0,0),s.up.set(0,0,-1),s.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),c.up.set(0,1,0),c.lookAt(0,0,-1);else if(t===aa)n.up.set(0,-1,0),n.lookAt(-1,0,0),r.up.set(0,-1,0),r.lookAt(1,0,0),s.up.set(0,0,1),s.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),c.up.set(0,-1,0),c.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+t);for(const l of e)this.add(l),l.updateMatrixWorld()}update(t,e){this.parent===null&&this.updateMatrixWorld();const{renderTarget:n,activeMipmapLevel:r}=this;this.coordinateSystem!==t.coordinateSystem&&(this.coordinateSystem=t.coordinateSystem,this.updateCoordinateSystem());const[s,a,o,c,l,h]=this.children,u=t.getRenderTarget(),d=t.getActiveCubeFace(),f=t.getActiveMipmapLevel(),m=t.xr.enabled;t.xr.enabled=!1;const x=n.texture.generateMipmaps;n.texture.generateMipmaps=!1,t.setRenderTarget(n,0,r),t.render(e,s),t.setRenderTarget(n,1,r),t.render(e,a),t.setRenderTarget(n,2,r),t.render(e,o),t.setRenderTarget(n,3,r),t.render(e,c),t.setRenderTarget(n,4,r),t.render(e,l),n.texture.generateMipmaps=x,t.setRenderTarget(n,5,r),t.render(e,h),t.setRenderTarget(u,d,f),t.xr.enabled=m,n.texture.needsPMREMUpdate=!0}}class ru extends Fe{constructor(t=[],e=Er,n,r,s,a,o,c,l,h){super(t,e,n,r,s,a,o,c,l,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(t){this.image=t}}class Kd extends Ze{constructor(t=1,e={}){super(t,t,e),this.isWebGLCubeRenderTarget=!0;const n={width:t,height:t,depth:1},r=[n,n,n,n,n,n];this.texture=new ru(r),this._setTextureOptions(e),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(t,e){this.texture.type=e.type,this.texture.colorSpace=e.colorSpace,this.texture.generateMipmaps=e.generateMipmaps,this.texture.minFilter=e.minFilter,this.texture.magFilter=e.magFilter;const n={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},r=new Xe(5,5,5),s=new Ke({name:"CubemapFromEquirect",uniforms:Tr(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:Je,blending:vi});s.uniforms.tEquirect.value=e;const a=new Wt(r,s),o=e.minFilter;return e.minFilter===Ni&&(e.minFilter=ve),new Zd(1,10,this).update(t,a),e.minFilter=o,a.geometry.dispose(),a.material.dispose(),this}clear(t,e=!0,n=!0,r=!0){const s=t.getRenderTarget();for(let a=0;a<6;a++)t.setRenderTarget(this,a),t.clear(e,n,r);t.setRenderTarget(s)}}class an extends Ie{constructor(){super(),this.isGroup=!0,this.type="Group"}}const Jd={type:"move"};class ka{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new an,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new an,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new O,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new O),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new an,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new O,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new O),this._grip}dispatchEvent(t){return this._targetRay!==null&&this._targetRay.dispatchEvent(t),this._grip!==null&&this._grip.dispatchEvent(t),this._hand!==null&&this._hand.dispatchEvent(t),this}connect(t){if(t&&t.hand){const e=this._hand;if(e)for(const n of t.hand.values())this._getHandJoint(e,n)}return this.dispatchEvent({type:"connected",data:t}),this}disconnect(t){return this.dispatchEvent({type:"disconnected",data:t}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(t,e,n){let r=null,s=null,a=null;const o=this._targetRay,c=this._grip,l=this._hand;if(t&&e.session.visibilityState!=="visible-blurred"){if(l&&t.hand){a=!0;for(const x of t.hand.values()){const g=e.getJointPose(x,n),p=this._getHandJoint(l,x);g!==null&&(p.matrix.fromArray(g.transform.matrix),p.matrix.decompose(p.position,p.rotation,p.scale),p.matrixWorldNeedsUpdate=!0,p.jointRadius=g.radius),p.visible=g!==null}const h=l.joints["index-finger-tip"],u=l.joints["thumb-tip"],d=h.position.distanceTo(u.position),f=.02,m=.005;l.inputState.pinching&&d>f+m?(l.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:t.handedness,target:this})):!l.inputState.pinching&&d<=f-m&&(l.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:t.handedness,target:this}))}else c!==null&&t.gripSpace&&(s=e.getPose(t.gripSpace,n),s!==null&&(c.matrix.fromArray(s.transform.matrix),c.matrix.decompose(c.position,c.rotation,c.scale),c.matrixWorldNeedsUpdate=!0,s.linearVelocity?(c.hasLinearVelocity=!0,c.linearVelocity.copy(s.linearVelocity)):c.hasLinearVelocity=!1,s.angularVelocity?(c.hasAngularVelocity=!0,c.angularVelocity.copy(s.angularVelocity)):c.hasAngularVelocity=!1));o!==null&&(r=e.getPose(t.targetRaySpace,n),r===null&&s!==null&&(r=s),r!==null&&(o.matrix.fromArray(r.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,r.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(r.linearVelocity)):o.hasLinearVelocity=!1,r.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(r.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(Jd)))}return o!==null&&(o.visible=r!==null),c!==null&&(c.visible=s!==null),l!==null&&(l.visible=a!==null),this}_getHandJoint(t,e){if(t.joints[e.jointName]===void 0){const n=new an;n.matrixAutoUpdate=!1,n.visible=!1,t.joints[e.jointName]=n,t.add(n)}return t.joints[e.jointName]}}class su extends Ie{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new vn,this.environmentIntensity=1,this.environmentRotation=new vn,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(t,e){return super.copy(t,e),t.background!==null&&(this.background=t.background.clone()),t.environment!==null&&(this.environment=t.environment.clone()),t.fog!==null&&(this.fog=t.fog.clone()),this.backgroundBlurriness=t.backgroundBlurriness,this.backgroundIntensity=t.backgroundIntensity,this.backgroundRotation.copy(t.backgroundRotation),this.environmentIntensity=t.environmentIntensity,this.environmentRotation.copy(t.environmentRotation),t.overrideMaterial!==null&&(this.overrideMaterial=t.overrideMaterial.clone()),this.matrixAutoUpdate=t.matrixAutoUpdate,this}toJSON(t){const e=super.toJSON(t);return this.fog!==null&&(e.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(e.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(e.object.backgroundIntensity=this.backgroundIntensity),e.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(e.object.environmentIntensity=this.environmentIntensity),e.object.environmentRotation=this.environmentRotation.toArray(),e}}const xl=new O,Ml=new le,bl=new le,Qd=new O,Sl=new ne,Ns=new O,Ha=new Dr,yl=new ne,za=new Kh;class au extends Wt{constructor(t,e){super(t,e),this.isSkinnedMesh=!0,this.type="SkinnedMesh",this.bindMode=Kc,this.bindMatrix=new ne,this.bindMatrixInverse=new ne,this.boundingBox=null,this.boundingSphere=null}computeBoundingBox(){const t=this.geometry;this.boundingBox===null&&(this.boundingBox=new Pr),this.boundingBox.makeEmpty();const e=t.getAttribute("position");for(let n=0;n<e.count;n++)this.getVertexPosition(n,Ns),this.boundingBox.expandByPoint(Ns)}computeBoundingSphere(){const t=this.geometry;this.boundingSphere===null&&(this.boundingSphere=new Dr),this.boundingSphere.makeEmpty();const e=t.getAttribute("position");for(let n=0;n<e.count;n++)this.getVertexPosition(n,Ns),this.boundingSphere.expandByPoint(Ns)}copy(t,e){return super.copy(t,e),this.bindMode=t.bindMode,this.bindMatrix.copy(t.bindMatrix),this.bindMatrixInverse.copy(t.bindMatrixInverse),this.skeleton=t.skeleton,t.boundingBox!==null&&(this.boundingBox=t.boundingBox.clone()),t.boundingSphere!==null&&(this.boundingSphere=t.boundingSphere.clone()),this}raycast(t,e){const n=this.material,r=this.matrixWorld;n!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),Ha.copy(this.boundingSphere),Ha.applyMatrix4(r),t.ray.intersectsSphere(Ha)!==!1&&(yl.copy(r).invert(),za.copy(t.ray).applyMatrix4(yl),!(this.boundingBox!==null&&za.intersectsBox(this.boundingBox)===!1)&&this._computeIntersections(t,e,za)))}getVertexPosition(t,e){return super.getVertexPosition(t,e),this.applyBoneTransform(t,e),e}bind(t,e){this.skeleton=t,e===void 0&&(this.updateMatrixWorld(!0),this.skeleton.calculateInverses(),e=this.matrixWorld),this.bindMatrix.copy(e),this.bindMatrixInverse.copy(e).invert()}pose(){this.skeleton.pose()}normalizeSkinWeights(){const t=new le,e=this.geometry.attributes.skinWeight;for(let n=0,r=e.count;n<r;n++){t.fromBufferAttribute(e,n);const s=1/t.manhattanLength();s!==1/0?t.multiplyScalar(s):t.set(1,0,0,0),e.setXYZW(n,t.x,t.y,t.z,t.w)}}updateMatrixWorld(t){super.updateMatrixWorld(t),this.bindMode===Kc?this.bindMatrixInverse.copy(this.matrixWorld).invert():this.bindMode===$f?this.bindMatrixInverse.copy(this.bindMatrix).invert():console.warn("THREE.SkinnedMesh: Unrecognized bindMode: "+this.bindMode)}applyBoneTransform(t,e){const n=this.skeleton,r=this.geometry;Ml.fromBufferAttribute(r.attributes.skinIndex,t),bl.fromBufferAttribute(r.attributes.skinWeight,t),xl.copy(e).applyMatrix4(this.bindMatrix),e.set(0,0,0);for(let s=0;s<4;s++){const a=bl.getComponent(s);if(a!==0){const o=Ml.getComponent(s);Sl.multiplyMatrices(n.bones[o].matrixWorld,n.boneInverses[o]),e.addScaledVector(Qd.copy(xl).applyMatrix4(Sl),a)}}return e.applyMatrix4(this.bindMatrixInverse)}}class ou extends Ie{constructor(){super(),this.isBone=!0,this.type="Bone"}}class jr extends Fe{constructor(t=null,e=1,n=1,r,s,a,o,c,l=on,h=on,u,d){super(null,a,o,c,l,h,r,s,u,d),this.isDataTexture=!0,this.image={data:t,width:e,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}const El=new ne,t0=new ne;class _c{constructor(t=[],e=[]){this.uuid=Yi(),this.bones=t.slice(0),this.boneInverses=e,this.boneMatrices=null,this.boneTexture=null,this.init()}init(){const t=this.bones,e=this.boneInverses;if(this.boneMatrices=new Float32Array(t.length*16),e.length===0)this.calculateInverses();else if(t.length!==e.length){console.warn("THREE.Skeleton: Number of inverse bone matrices does not match amount of bones."),this.boneInverses=[];for(let n=0,r=this.bones.length;n<r;n++)this.boneInverses.push(new ne)}}calculateInverses(){this.boneInverses.length=0;for(let t=0,e=this.bones.length;t<e;t++){const n=new ne;this.bones[t]&&n.copy(this.bones[t].matrixWorld).invert(),this.boneInverses.push(n)}}pose(){for(let t=0,e=this.bones.length;t<e;t++){const n=this.bones[t];n&&n.matrixWorld.copy(this.boneInverses[t]).invert()}for(let t=0,e=this.bones.length;t<e;t++){const n=this.bones[t];n&&(n.parent&&n.parent.isBone?(n.matrix.copy(n.parent.matrixWorld).invert(),n.matrix.multiply(n.matrixWorld)):n.matrix.copy(n.matrixWorld),n.matrix.decompose(n.position,n.quaternion,n.scale))}}update(){const t=this.bones,e=this.boneInverses,n=this.boneMatrices,r=this.boneTexture;for(let s=0,a=t.length;s<a;s++){const o=t[s]?t[s].matrixWorld:t0;El.multiplyMatrices(o,e[s]),El.toArray(n,s*16)}r!==null&&(r.needsUpdate=!0)}clone(){return new _c(this.bones,this.boneInverses)}computeBoneTexture(){let t=Math.sqrt(this.bones.length*4);t=Math.ceil(t/4)*4,t=Math.max(t,4);const e=new Float32Array(t*t*4);e.set(this.boneMatrices);const n=new jr(e,t,t,He,kn);return n.needsUpdate=!0,this.boneMatrices=e,this.boneTexture=n,this}getBoneByName(t){for(let e=0,n=this.bones.length;e<n;e++){const r=this.bones[e];if(r.name===t)return r}}dispose(){this.boneTexture!==null&&(this.boneTexture.dispose(),this.boneTexture=null)}fromJSON(t,e){this.uuid=t.uuid;for(let n=0,r=t.bones.length;n<r;n++){const s=t.bones[n];let a=e[s];a===void 0&&(console.warn("THREE.Skeleton: No bone found with UUID:",s),a=new ou),this.bones.push(a),this.boneInverses.push(new ne().fromArray(t.boneInverses[n]))}return this.init(),this}toJSON(){const t={metadata:{version:4.7,type:"Skeleton",generator:"Skeleton.toJSON"},bones:[],boneInverses:[]};t.uuid=this.uuid;const e=this.bones,n=this.boneInverses;for(let r=0,s=e.length;r<s;r++){const a=e[r];t.bones.push(a.uuid);const o=n[r];t.boneInverses.push(o.toArray())}return t}}const Va=new O,e0=new O,n0=new Zt;class Ci{constructor(t=new O(1,0,0),e=0){this.isPlane=!0,this.normal=t,this.constant=e}set(t,e){return this.normal.copy(t),this.constant=e,this}setComponents(t,e,n,r){return this.normal.set(t,e,n),this.constant=r,this}setFromNormalAndCoplanarPoint(t,e){return this.normal.copy(t),this.constant=-e.dot(this.normal),this}setFromCoplanarPoints(t,e,n){const r=Va.subVectors(n,e).cross(e0.subVectors(t,e)).normalize();return this.setFromNormalAndCoplanarPoint(r,t),this}copy(t){return this.normal.copy(t.normal),this.constant=t.constant,this}normalize(){const t=1/this.normal.length();return this.normal.multiplyScalar(t),this.constant*=t,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(t){return this.normal.dot(t)+this.constant}distanceToSphere(t){return this.distanceToPoint(t.center)-t.radius}projectPoint(t,e){return e.copy(t).addScaledVector(this.normal,-this.distanceToPoint(t))}intersectLine(t,e){const n=t.delta(Va),r=this.normal.dot(n);if(r===0)return this.distanceToPoint(t.start)===0?e.copy(t.start):null;const s=-(t.start.dot(this.normal)+this.constant)/r;return s<0||s>1?null:e.copy(t.start).addScaledVector(n,s)}intersectsLine(t){const e=this.distanceToPoint(t.start),n=this.distanceToPoint(t.end);return e<0&&n>0||n<0&&e>0}intersectsBox(t){return t.intersectsPlane(this)}intersectsSphere(t){return t.intersectsPlane(this)}coplanarPoint(t){return t.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(t,e){const n=e||n0.getNormalMatrix(t),r=this.coplanarPoint(Va).applyMatrix4(t),s=this.normal.applyMatrix3(n).normalize();return this.constant=-r.dot(s),this}translate(t){return this.constant-=t.dot(this.normal),this}equals(t){return t.normal.equals(this.normal)&&t.constant===this.constant}clone(){return new this.constructor().copy(this)}}const Ti=new Dr,i0=new Rt(.5,.5),Fs=new O;class xc{constructor(t=new Ci,e=new Ci,n=new Ci,r=new Ci,s=new Ci,a=new Ci){this.planes=[t,e,n,r,s,a]}set(t,e,n,r,s,a){const o=this.planes;return o[0].copy(t),o[1].copy(e),o[2].copy(n),o[3].copy(r),o[4].copy(s),o[5].copy(a),this}copy(t){const e=this.planes;for(let n=0;n<6;n++)e[n].copy(t.planes[n]);return this}setFromProjectionMatrix(t,e=Hn,n=!1){const r=this.planes,s=t.elements,a=s[0],o=s[1],c=s[2],l=s[3],h=s[4],u=s[5],d=s[6],f=s[7],m=s[8],x=s[9],g=s[10],p=s[11],E=s[12],b=s[13],M=s[14],T=s[15];if(r[0].setComponents(l-a,f-h,p-m,T-E).normalize(),r[1].setComponents(l+a,f+h,p+m,T+E).normalize(),r[2].setComponents(l+o,f+u,p+x,T+b).normalize(),r[3].setComponents(l-o,f-u,p-x,T-b).normalize(),n)r[4].setComponents(c,d,g,M).normalize(),r[5].setComponents(l-c,f-d,p-g,T-M).normalize();else if(r[4].setComponents(l-c,f-d,p-g,T-M).normalize(),e===Hn)r[5].setComponents(l+c,f+d,p+g,T+M).normalize();else if(e===aa)r[5].setComponents(c,d,g,M).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+e);return this}intersectsObject(t){if(t.boundingSphere!==void 0)t.boundingSphere===null&&t.computeBoundingSphere(),Ti.copy(t.boundingSphere).applyMatrix4(t.matrixWorld);else{const e=t.geometry;e.boundingSphere===null&&e.computeBoundingSphere(),Ti.copy(e.boundingSphere).applyMatrix4(t.matrixWorld)}return this.intersectsSphere(Ti)}intersectsSprite(t){Ti.center.set(0,0,0);const e=i0.distanceTo(t.center);return Ti.radius=.7071067811865476+e,Ti.applyMatrix4(t.matrixWorld),this.intersectsSphere(Ti)}intersectsSphere(t){const e=this.planes,n=t.center,r=-t.radius;for(let s=0;s<6;s++)if(e[s].distanceToPoint(n)<r)return!1;return!0}intersectsBox(t){const e=this.planes;for(let n=0;n<6;n++){const r=e[n];if(Fs.x=r.normal.x>0?t.max.x:t.min.x,Fs.y=r.normal.y>0?t.max.y:t.min.y,Fs.z=r.normal.z>0?t.max.z:t.min.z,r.distanceToPoint(Fs)<0)return!1}return!0}containsPoint(t){const e=this.planes;for(let n=0;n<6;n++)if(e[n].distanceToPoint(t)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}class r0 extends Fe{constructor(t,e,n,r,s=ve,a=ve,o,c,l){super(t,e,n,r,s,a,o,c,l),this.isVideoTexture=!0,this.generateMipmaps=!1,this._requestVideoFrameCallbackId=0;const h=this;function u(){h.needsUpdate=!0,h._requestVideoFrameCallbackId=t.requestVideoFrameCallback(u)}"requestVideoFrameCallback"in t&&(this._requestVideoFrameCallbackId=t.requestVideoFrameCallback(u))}clone(){return new this.constructor(this.image).copy(this)}update(){const t=this.image;"requestVideoFrameCallback"in t===!1&&t.readyState>=t.HAVE_CURRENT_DATA&&(this.needsUpdate=!0)}dispose(){this._requestVideoFrameCallbackId!==0&&this.source.data.cancelVideoFrameCallback(this._requestVideoFrameCallbackId),super.dispose()}}class wl extends Fe{constructor(t,e,n,r,s,a,o,c,l){super(t,e,n,r,s,a,o,c,l),this.isCanvasTexture=!0,this.needsUpdate=!0}}class cu extends Fe{constructor(t,e,n=Vi,r,s,a,o=on,c=on,l,h=is,u=1){if(h!==is&&h!==rs)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");const d={width:t,height:e,depth:u};super(d,r,s,a,o,c,h,n,l),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(t){return super.copy(t),this.source=new gc(Object.assign({},t.image)),this.compareFunction=t.compareFunction,this}toJSON(t){const e=super.toJSON(t);return this.compareFunction!==null&&(e.compareFunction=this.compareFunction),e}}class lu extends Fe{constructor(t=null){super(),this.sourceTexture=t,this.isExternalTexture=!0}copy(t){return super.copy(t),this.sourceTexture=t.sourceTexture,this}}class Mc extends Ue{constructor(t=1,e=1,n=4,r=8,s=1){super(),this.type="CapsuleGeometry",this.parameters={radius:t,height:e,capSegments:n,radialSegments:r,heightSegments:s},e=Math.max(0,e),n=Math.max(1,Math.floor(n)),r=Math.max(3,Math.floor(r)),s=Math.max(1,Math.floor(s));const a=[],o=[],c=[],l=[],h=e/2,u=Math.PI/2*t,d=e,f=2*u+d,m=n*2+s,x=r+1,g=new O,p=new O;for(let E=0;E<=m;E++){let b=0,M=0,T=0,w=0;if(E<=n){const v=E/n,_=v*Math.PI/2;M=-h-t*Math.cos(_),T=t*Math.sin(_),w=-t*Math.cos(_),b=v*u}else if(E<=n+s){const v=(E-n)/s;M=-h+v*e,T=t,w=0,b=u+v*d}else{const v=(E-n-s)/n,_=v*Math.PI/2;M=h+t*Math.sin(_),T=t*Math.cos(_),w=t*Math.sin(_),b=u+d+v*u}const A=Math.max(0,Math.min(1,b/f));let R=0;E===0?R=.5/r:E===m&&(R=-.5/r);for(let v=0;v<=r;v++){const _=v/r,S=_*Math.PI*2,y=Math.sin(S),D=Math.cos(S);p.x=-T*D,p.y=M,p.z=T*y,o.push(p.x,p.y,p.z),g.set(-T*D,w,T*y),g.normalize(),c.push(g.x,g.y,g.z),l.push(_+R,A)}if(E>0){const v=(E-1)*x;for(let _=0;_<r;_++){const S=v+_,y=v+_+1,D=E*x+_,I=E*x+_+1;a.push(S,y,D),a.push(y,I,D)}}}this.setIndex(a),this.setAttribute("position",new he(o,3)),this.setAttribute("normal",new he(c,3)),this.setAttribute("uv",new he(l,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Mc(t.radius,t.height,t.capSegments,t.radialSegments,t.heightSegments)}}class bc extends Ue{constructor(t=1,e=32,n=0,r=Math.PI*2){super(),this.type="CircleGeometry",this.parameters={radius:t,segments:e,thetaStart:n,thetaLength:r},e=Math.max(3,e);const s=[],a=[],o=[],c=[],l=new O,h=new Rt;a.push(0,0,0),o.push(0,0,1),c.push(.5,.5);for(let u=0,d=3;u<=e;u++,d+=3){const f=n+u/e*r;l.x=t*Math.cos(f),l.y=t*Math.sin(f),a.push(l.x,l.y,l.z),o.push(0,0,1),h.x=(a[d]/t+1)/2,h.y=(a[d+1]/t+1)/2,c.push(h.x,h.y)}for(let u=1;u<=e;u++)s.push(u,u+1,0);this.setIndex(s),this.setAttribute("position",new he(a,3)),this.setAttribute("normal",new he(o,3)),this.setAttribute("uv",new he(c,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new bc(t.radius,t.segments,t.thetaStart,t.thetaLength)}}class Cn extends Ue{constructor(t=1,e=1,n=1,r=32,s=1,a=!1,o=0,c=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:t,radiusBottom:e,height:n,radialSegments:r,heightSegments:s,openEnded:a,thetaStart:o,thetaLength:c};const l=this;r=Math.floor(r),s=Math.floor(s);const h=[],u=[],d=[],f=[];let m=0;const x=[],g=n/2;let p=0;E(),a===!1&&(t>0&&b(!0),e>0&&b(!1)),this.setIndex(h),this.setAttribute("position",new he(u,3)),this.setAttribute("normal",new he(d,3)),this.setAttribute("uv",new he(f,2));function E(){const M=new O,T=new O;let w=0;const A=(e-t)/n;for(let R=0;R<=s;R++){const v=[],_=R/s,S=_*(e-t)+t;for(let y=0;y<=r;y++){const D=y/r,I=D*c+o,U=Math.sin(I),H=Math.cos(I);T.x=S*U,T.y=-_*n+g,T.z=S*H,u.push(T.x,T.y,T.z),M.set(U,A,H).normalize(),d.push(M.x,M.y,M.z),f.push(D,1-_),v.push(m++)}x.push(v)}for(let R=0;R<r;R++)for(let v=0;v<s;v++){const _=x[v][R],S=x[v+1][R],y=x[v+1][R+1],D=x[v][R+1];(t>0||v!==0)&&(h.push(_,S,D),w+=3),(e>0||v!==s-1)&&(h.push(S,y,D),w+=3)}l.addGroup(p,w,0),p+=w}function b(M){const T=m,w=new Rt,A=new O;let R=0;const v=M===!0?t:e,_=M===!0?1:-1;for(let y=1;y<=r;y++)u.push(0,g*_,0),d.push(0,_,0),f.push(.5,.5),m++;const S=m;for(let y=0;y<=r;y++){const I=y/r*c+o,U=Math.cos(I),H=Math.sin(I);A.x=v*H,A.y=g*_,A.z=v*U,u.push(A.x,A.y,A.z),d.push(0,_,0),w.x=U*.5+.5,w.y=H*.5*_+.5,f.push(w.x,w.y),m++}for(let y=0;y<r;y++){const D=T+y,I=S+y;M===!0?h.push(I,I+1,D):h.push(I+1,I,D),R+=3}l.addGroup(p,R,M===!0?1:2),p+=R}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Cn(t.radiusTop,t.radiusBottom,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}}class $i extends Cn{constructor(t=1,e=1,n=32,r=1,s=!1,a=0,o=Math.PI*2){super(0,t,e,n,r,s,a,o),this.type="ConeGeometry",this.parameters={radius:t,height:e,radialSegments:n,heightSegments:r,openEnded:s,thetaStart:a,thetaLength:o}}static fromJSON(t){return new $i(t.radius,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}}class si{constructor(){this.type="Curve",this.arcLengthDivisions=200,this.needsUpdate=!1,this.cacheArcLengths=null}getPoint(){console.warn("THREE.Curve: .getPoint() not implemented.")}getPointAt(t,e){const n=this.getUtoTmapping(t);return this.getPoint(n,e)}getPoints(t=5){const e=[];for(let n=0;n<=t;n++)e.push(this.getPoint(n/t));return e}getSpacedPoints(t=5){const e=[];for(let n=0;n<=t;n++)e.push(this.getPointAt(n/t));return e}getLength(){const t=this.getLengths();return t[t.length-1]}getLengths(t=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===t+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;const e=[];let n,r=this.getPoint(0),s=0;e.push(0);for(let a=1;a<=t;a++)n=this.getPoint(a/t),s+=n.distanceTo(r),e.push(s),r=n;return this.cacheArcLengths=e,e}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(t,e=null){const n=this.getLengths();let r=0;const s=n.length;let a;e?a=e:a=t*n[s-1];let o=0,c=s-1,l;for(;o<=c;)if(r=Math.floor(o+(c-o)/2),l=n[r]-a,l<0)o=r+1;else if(l>0)c=r-1;else{c=r;break}if(r=c,n[r]===a)return r/(s-1);const h=n[r],d=n[r+1]-h,f=(a-h)/d;return(r+f)/(s-1)}getTangent(t,e){let r=t-1e-4,s=t+1e-4;r<0&&(r=0),s>1&&(s=1);const a=this.getPoint(r),o=this.getPoint(s),c=e||(a.isVector2?new Rt:new O);return c.copy(o).sub(a).normalize(),c}getTangentAt(t,e){const n=this.getUtoTmapping(t);return this.getTangent(n,e)}computeFrenetFrames(t,e=!1){const n=new O,r=[],s=[],a=[],o=new O,c=new ne;for(let f=0;f<=t;f++){const m=f/t;r[f]=this.getTangentAt(m,new O)}s[0]=new O,a[0]=new O;let l=Number.MAX_VALUE;const h=Math.abs(r[0].x),u=Math.abs(r[0].y),d=Math.abs(r[0].z);h<=l&&(l=h,n.set(1,0,0)),u<=l&&(l=u,n.set(0,1,0)),d<=l&&n.set(0,0,1),o.crossVectors(r[0],n).normalize(),s[0].crossVectors(r[0],o),a[0].crossVectors(r[0],s[0]);for(let f=1;f<=t;f++){if(s[f]=s[f-1].clone(),a[f]=a[f-1].clone(),o.crossVectors(r[f-1],r[f]),o.length()>Number.EPSILON){o.normalize();const m=Math.acos(Jt(r[f-1].dot(r[f]),-1,1));s[f].applyMatrix4(c.makeRotationAxis(o,m))}a[f].crossVectors(r[f],s[f])}if(e===!0){let f=Math.acos(Jt(s[0].dot(s[t]),-1,1));f/=t,r[0].dot(o.crossVectors(s[0],s[t]))>0&&(f=-f);for(let m=1;m<=t;m++)s[m].applyMatrix4(c.makeRotationAxis(r[m],f*m)),a[m].crossVectors(r[m],s[m])}return{tangents:r,normals:s,binormals:a}}clone(){return new this.constructor().copy(this)}copy(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}toJSON(){const t={metadata:{version:4.7,type:"Curve",generator:"Curve.toJSON"}};return t.arcLengthDivisions=this.arcLengthDivisions,t.type=this.type,t}fromJSON(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}}class hu extends si{constructor(t=0,e=0,n=1,r=1,s=0,a=Math.PI*2,o=!1,c=0){super(),this.isEllipseCurve=!0,this.type="EllipseCurve",this.aX=t,this.aY=e,this.xRadius=n,this.yRadius=r,this.aStartAngle=s,this.aEndAngle=a,this.aClockwise=o,this.aRotation=c}getPoint(t,e=new Rt){const n=e,r=Math.PI*2;let s=this.aEndAngle-this.aStartAngle;const a=Math.abs(s)<Number.EPSILON;for(;s<0;)s+=r;for(;s>r;)s-=r;s<Number.EPSILON&&(a?s=0:s=r),this.aClockwise===!0&&!a&&(s===r?s=-r:s=s-r);const o=this.aStartAngle+t*s;let c=this.aX+this.xRadius*Math.cos(o),l=this.aY+this.yRadius*Math.sin(o);if(this.aRotation!==0){const h=Math.cos(this.aRotation),u=Math.sin(this.aRotation),d=c-this.aX,f=l-this.aY;c=d*h-f*u+this.aX,l=d*u+f*h+this.aY}return n.set(c,l)}copy(t){return super.copy(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}toJSON(){const t=super.toJSON();return t.aX=this.aX,t.aY=this.aY,t.xRadius=this.xRadius,t.yRadius=this.yRadius,t.aStartAngle=this.aStartAngle,t.aEndAngle=this.aEndAngle,t.aClockwise=this.aClockwise,t.aRotation=this.aRotation,t}fromJSON(t){return super.fromJSON(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}}class s0 extends hu{constructor(t,e,n,r,s,a){super(t,e,n,n,r,s,a),this.isArcCurve=!0,this.type="ArcCurve"}}function Sc(){let i=0,t=0,e=0,n=0;function r(s,a,o,c){i=s,t=o,e=-3*s+3*a-2*o-c,n=2*s-2*a+o+c}return{initCatmullRom:function(s,a,o,c,l){r(a,o,l*(o-s),l*(c-a))},initNonuniformCatmullRom:function(s,a,o,c,l,h,u){let d=(a-s)/l-(o-s)/(l+h)+(o-a)/h,f=(o-a)/h-(c-a)/(h+u)+(c-o)/u;d*=h,f*=h,r(a,o,d,f)},calc:function(s){const a=s*s,o=a*s;return i+t*s+e*a+n*o}}}const Os=new O,Ga=new Sc,Wa=new Sc,Xa=new Sc;class Qn extends si{constructor(t=[],e=!1,n="centripetal",r=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=t,this.closed=e,this.curveType=n,this.tension=r}getPoint(t,e=new O){const n=e,r=this.points,s=r.length,a=(s-(this.closed?0:1))*t;let o=Math.floor(a),c=a-o;this.closed?o+=o>0?0:(Math.floor(Math.abs(o)/s)+1)*s:c===0&&o===s-1&&(o=s-2,c=1);let l,h;this.closed||o>0?l=r[(o-1)%s]:(Os.subVectors(r[0],r[1]).add(r[0]),l=Os);const u=r[o%s],d=r[(o+1)%s];if(this.closed||o+2<s?h=r[(o+2)%s]:(Os.subVectors(r[s-1],r[s-2]).add(r[s-1]),h=Os),this.curveType==="centripetal"||this.curveType==="chordal"){const f=this.curveType==="chordal"?.5:.25;let m=Math.pow(l.distanceToSquared(u),f),x=Math.pow(u.distanceToSquared(d),f),g=Math.pow(d.distanceToSquared(h),f);x<1e-4&&(x=1),m<1e-4&&(m=x),g<1e-4&&(g=x),Ga.initNonuniformCatmullRom(l.x,u.x,d.x,h.x,m,x,g),Wa.initNonuniformCatmullRom(l.y,u.y,d.y,h.y,m,x,g),Xa.initNonuniformCatmullRom(l.z,u.z,d.z,h.z,m,x,g)}else this.curveType==="catmullrom"&&(Ga.initCatmullRom(l.x,u.x,d.x,h.x,this.tension),Wa.initCatmullRom(l.y,u.y,d.y,h.y,this.tension),Xa.initCatmullRom(l.z,u.z,d.z,h.z,this.tension));return n.set(Ga.calc(c),Wa.calc(c),Xa.calc(c)),n}copy(t){super.copy(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){const r=t.points[e];this.points.push(r.clone())}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}toJSON(){const t=super.toJSON();t.points=[];for(let e=0,n=this.points.length;e<n;e++){const r=this.points[e];t.points.push(r.toArray())}return t.closed=this.closed,t.curveType=this.curveType,t.tension=this.tension,t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){const r=t.points[e];this.points.push(new O().fromArray(r))}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}}function Tl(i,t,e,n,r){const s=(n-t)*.5,a=(r-e)*.5,o=i*i,c=i*o;return(2*e-2*n+s+a)*c+(-3*e+3*n-2*s-a)*o+s*i+e}function a0(i,t){const e=1-i;return e*e*t}function o0(i,t){return 2*(1-i)*i*t}function c0(i,t){return i*i*t}function Zr(i,t,e,n){return a0(i,t)+o0(i,e)+c0(i,n)}function l0(i,t){const e=1-i;return e*e*e*t}function h0(i,t){const e=1-i;return 3*e*e*i*t}function u0(i,t){return 3*(1-i)*i*i*t}function f0(i,t){return i*i*i*t}function Kr(i,t,e,n,r){return l0(i,t)+h0(i,e)+u0(i,n)+f0(i,r)}class d0 extends si{constructor(t=new Rt,e=new Rt,n=new Rt,r=new Rt){super(),this.isCubicBezierCurve=!0,this.type="CubicBezierCurve",this.v0=t,this.v1=e,this.v2=n,this.v3=r}getPoint(t,e=new Rt){const n=e,r=this.v0,s=this.v1,a=this.v2,o=this.v3;return n.set(Kr(t,r.x,s.x,a.x,o.x),Kr(t,r.y,s.y,a.y,o.y)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}}class p0 extends si{constructor(t=new O,e=new O,n=new O,r=new O){super(),this.isCubicBezierCurve3=!0,this.type="CubicBezierCurve3",this.v0=t,this.v1=e,this.v2=n,this.v3=r}getPoint(t,e=new O){const n=e,r=this.v0,s=this.v1,a=this.v2,o=this.v3;return n.set(Kr(t,r.x,s.x,a.x,o.x),Kr(t,r.y,s.y,a.y,o.y),Kr(t,r.z,s.z,a.z,o.z)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}}class m0 extends si{constructor(t=new Rt,e=new Rt){super(),this.isLineCurve=!0,this.type="LineCurve",this.v1=t,this.v2=e}getPoint(t,e=new Rt){const n=e;return t===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(t).add(this.v1)),n}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new Rt){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class g0 extends si{constructor(t=new O,e=new O){super(),this.isLineCurve3=!0,this.type="LineCurve3",this.v1=t,this.v2=e}getPoint(t,e=new O){const n=e;return t===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(t).add(this.v1)),n}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new O){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class v0 extends si{constructor(t=new Rt,e=new Rt,n=new Rt){super(),this.isQuadraticBezierCurve=!0,this.type="QuadraticBezierCurve",this.v0=t,this.v1=e,this.v2=n}getPoint(t,e=new Rt){const n=e,r=this.v0,s=this.v1,a=this.v2;return n.set(Zr(t,r.x,s.x,a.x),Zr(t,r.y,s.y,a.y)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class uu extends si{constructor(t=new O,e=new O,n=new O){super(),this.isQuadraticBezierCurve3=!0,this.type="QuadraticBezierCurve3",this.v0=t,this.v1=e,this.v2=n}getPoint(t,e=new O){const n=e,r=this.v0,s=this.v1,a=this.v2;return n.set(Zr(t,r.x,s.x,a.x),Zr(t,r.y,s.y,a.y),Zr(t,r.z,s.z,a.z)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class _0 extends si{constructor(t=[]){super(),this.isSplineCurve=!0,this.type="SplineCurve",this.points=t}getPoint(t,e=new Rt){const n=e,r=this.points,s=(r.length-1)*t,a=Math.floor(s),o=s-a,c=r[a===0?a:a-1],l=r[a],h=r[a>r.length-2?r.length-1:a+1],u=r[a>r.length-3?r.length-1:a+2];return n.set(Tl(o,c.x,l.x,h.x,u.x),Tl(o,c.y,l.y,h.y,u.y)),n}copy(t){super.copy(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){const r=t.points[e];this.points.push(r.clone())}return this}toJSON(){const t=super.toJSON();t.points=[];for(let e=0,n=this.points.length;e<n;e++){const r=this.points[e];t.points.push(r.toArray())}return t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){const r=t.points[e];this.points.push(new Rt().fromArray(r))}return this}}var x0=Object.freeze({__proto__:null,ArcCurve:s0,CatmullRomCurve3:Qn,CubicBezierCurve:d0,CubicBezierCurve3:p0,EllipseCurve:hu,LineCurve:m0,LineCurve3:g0,QuadraticBezierCurve:v0,QuadraticBezierCurve3:uu,SplineCurve:_0});class Ar extends Ue{constructor(t=[new Rt(0,-.5),new Rt(.5,0),new Rt(0,.5)],e=12,n=0,r=Math.PI*2){super(),this.type="LatheGeometry",this.parameters={points:t,segments:e,phiStart:n,phiLength:r},e=Math.floor(e),r=Jt(r,0,Math.PI*2);const s=[],a=[],o=[],c=[],l=[],h=1/e,u=new O,d=new Rt,f=new O,m=new O,x=new O;let g=0,p=0;for(let E=0;E<=t.length-1;E++)switch(E){case 0:g=t[E+1].x-t[E].x,p=t[E+1].y-t[E].y,f.x=p*1,f.y=-g,f.z=p*0,x.copy(f),f.normalize(),c.push(f.x,f.y,f.z);break;case t.length-1:c.push(x.x,x.y,x.z);break;default:g=t[E+1].x-t[E].x,p=t[E+1].y-t[E].y,f.x=p*1,f.y=-g,f.z=p*0,m.copy(f),f.x+=x.x,f.y+=x.y,f.z+=x.z,f.normalize(),c.push(f.x,f.y,f.z),x.copy(m)}for(let E=0;E<=e;E++){const b=n+E*h*r,M=Math.sin(b),T=Math.cos(b);for(let w=0;w<=t.length-1;w++){u.x=t[w].x*M,u.y=t[w].y,u.z=t[w].x*T,a.push(u.x,u.y,u.z),d.x=E/e,d.y=w/(t.length-1),o.push(d.x,d.y);const A=c[3*w+0]*M,R=c[3*w+1],v=c[3*w+0]*T;l.push(A,R,v)}}for(let E=0;E<e;E++)for(let b=0;b<t.length-1;b++){const M=b+E*t.length,T=M,w=M+t.length,A=M+t.length+1,R=M+1;s.push(T,w,R),s.push(A,R,w)}this.setIndex(s),this.setAttribute("position",new he(a,3)),this.setAttribute("uv",new he(o,2)),this.setAttribute("normal",new he(l,3))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Ar(t.points,t.segments,t.phiStart,t.phiLength)}}class Ir extends Ue{constructor(t=1,e=1,n=1,r=1){super(),this.type="PlaneGeometry",this.parameters={width:t,height:e,widthSegments:n,heightSegments:r};const s=t/2,a=e/2,o=Math.floor(n),c=Math.floor(r),l=o+1,h=c+1,u=t/o,d=e/c,f=[],m=[],x=[],g=[];for(let p=0;p<h;p++){const E=p*d-a;for(let b=0;b<l;b++){const M=b*u-s;m.push(M,-E,0),x.push(0,0,1),g.push(b/o),g.push(1-p/c)}}for(let p=0;p<c;p++)for(let E=0;E<o;E++){const b=E+l*p,M=E+l*(p+1),T=E+1+l*(p+1),w=E+1+l*p;f.push(b,M,w),f.push(M,T,w)}this.setIndex(f),this.setAttribute("position",new he(m,3)),this.setAttribute("normal",new he(x,3)),this.setAttribute("uv",new he(g,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Ir(t.width,t.height,t.widthSegments,t.heightSegments)}}class Ae extends Ue{constructor(t=1,e=32,n=16,r=0,s=Math.PI*2,a=0,o=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:t,widthSegments:e,heightSegments:n,phiStart:r,phiLength:s,thetaStart:a,thetaLength:o},e=Math.max(3,Math.floor(e)),n=Math.max(2,Math.floor(n));const c=Math.min(a+o,Math.PI);let l=0;const h=[],u=new O,d=new O,f=[],m=[],x=[],g=[];for(let p=0;p<=n;p++){const E=[],b=p/n;let M=0;p===0&&a===0?M=.5/e:p===n&&c===Math.PI&&(M=-.5/e);for(let T=0;T<=e;T++){const w=T/e;u.x=-t*Math.cos(r+w*s)*Math.sin(a+b*o),u.y=t*Math.cos(a+b*o),u.z=t*Math.sin(r+w*s)*Math.sin(a+b*o),m.push(u.x,u.y,u.z),d.copy(u).normalize(),x.push(d.x,d.y,d.z),g.push(w+M,1-b),E.push(l++)}h.push(E)}for(let p=0;p<n;p++)for(let E=0;E<e;E++){const b=h[p][E+1],M=h[p][E],T=h[p+1][E],w=h[p+1][E+1];(p!==0||a>0)&&f.push(b,M,w),(p!==n-1||c<Math.PI)&&f.push(M,T,w)}this.setIndex(f),this.setAttribute("position",new he(m,3)),this.setAttribute("normal",new he(x,3)),this.setAttribute("uv",new he(g,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Ae(t.radius,t.widthSegments,t.heightSegments,t.phiStart,t.phiLength,t.thetaStart,t.thetaLength)}}class Rr extends Ue{constructor(t=1,e=.4,n=12,r=48,s=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:t,tube:e,radialSegments:n,tubularSegments:r,arc:s},n=Math.floor(n),r=Math.floor(r);const a=[],o=[],c=[],l=[],h=new O,u=new O,d=new O;for(let f=0;f<=n;f++)for(let m=0;m<=r;m++){const x=m/r*s,g=f/n*Math.PI*2;u.x=(t+e*Math.cos(g))*Math.cos(x),u.y=(t+e*Math.cos(g))*Math.sin(x),u.z=e*Math.sin(g),o.push(u.x,u.y,u.z),h.x=t*Math.cos(x),h.y=t*Math.sin(x),d.subVectors(u,h).normalize(),c.push(d.x,d.y,d.z),l.push(m/r),l.push(f/n)}for(let f=1;f<=n;f++)for(let m=1;m<=r;m++){const x=(r+1)*f+m-1,g=(r+1)*(f-1)+m-1,p=(r+1)*(f-1)+m,E=(r+1)*f+m;a.push(x,g,E),a.push(g,p,E)}this.setIndex(a),this.setAttribute("position",new he(o,3)),this.setAttribute("normal",new he(c,3)),this.setAttribute("uv",new he(l,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Rr(t.radius,t.tube,t.radialSegments,t.tubularSegments,t.arc)}}class Ur extends Ue{constructor(t=new uu(new O(-1,-1,0),new O(-1,1,0),new O(1,1,0)),e=64,n=1,r=8,s=!1){super(),this.type="TubeGeometry",this.parameters={path:t,tubularSegments:e,radius:n,radialSegments:r,closed:s};const a=t.computeFrenetFrames(e,s);this.tangents=a.tangents,this.normals=a.normals,this.binormals=a.binormals;const o=new O,c=new O,l=new Rt;let h=new O;const u=[],d=[],f=[],m=[];x(),this.setIndex(m),this.setAttribute("position",new he(u,3)),this.setAttribute("normal",new he(d,3)),this.setAttribute("uv",new he(f,2));function x(){for(let b=0;b<e;b++)g(b);g(s===!1?e:0),E(),p()}function g(b){h=t.getPointAt(b/e,h);const M=a.normals[b],T=a.binormals[b];for(let w=0;w<=r;w++){const A=w/r*Math.PI*2,R=Math.sin(A),v=-Math.cos(A);c.x=v*M.x+R*T.x,c.y=v*M.y+R*T.y,c.z=v*M.z+R*T.z,c.normalize(),d.push(c.x,c.y,c.z),o.x=h.x+n*c.x,o.y=h.y+n*c.y,o.z=h.z+n*c.z,u.push(o.x,o.y,o.z)}}function p(){for(let b=1;b<=e;b++)for(let M=1;M<=r;M++){const T=(r+1)*(b-1)+(M-1),w=(r+1)*b+(M-1),A=(r+1)*b+M,R=(r+1)*(b-1)+M;m.push(T,w,R),m.push(w,A,R)}}function E(){for(let b=0;b<=e;b++)for(let M=0;M<=r;M++)l.x=b/e,l.y=M/r,f.push(l.x,l.y)}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}toJSON(){const t=super.toJSON();return t.path=this.parameters.path.toJSON(),t}static fromJSON(t){return new Ur(new x0[t.path.type]().fromJSON(t.path),t.tubularSegments,t.radius,t.radialSegments,t.closed)}}class gi extends hs{constructor(t){super(),this.isMeshStandardMaterial=!0,this.type="MeshStandardMaterial",this.defines={STANDARD:""},this.color=new Ht(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Ht(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=$h,this.normalScale=new Rt(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new vn,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.defines={STANDARD:""},this.color.copy(t.color),this.roughness=t.roughness,this.metalness=t.metalness,this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.emissive.copy(t.emissive),this.emissiveMap=t.emissiveMap,this.emissiveIntensity=t.emissiveIntensity,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.roughnessMap=t.roughnessMap,this.metalnessMap=t.metalnessMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.envMapIntensity=t.envMapIntensity,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.flatShading=t.flatShading,this.fog=t.fog,this}}class M0 extends hs{constructor(t){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=Zf,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(t)}copy(t){return super.copy(t),this.depthPacking=t.depthPacking,this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this}}class b0 extends hs{constructor(t){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(t)}copy(t){return super.copy(t),this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this}}class fu extends Ie{constructor(t,e=1){super(),this.isLight=!0,this.type="Light",this.color=new Ht(t),this.intensity=e}dispose(){}copy(t,e){return super.copy(t,e),this.color.copy(t.color),this.intensity=t.intensity,this}toJSON(t){const e=super.toJSON(t);return e.object.color=this.color.getHex(),e.object.intensity=this.intensity,this.groundColor!==void 0&&(e.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(e.object.distance=this.distance),this.angle!==void 0&&(e.object.angle=this.angle),this.decay!==void 0&&(e.object.decay=this.decay),this.penumbra!==void 0&&(e.object.penumbra=this.penumbra),this.shadow!==void 0&&(e.object.shadow=this.shadow.toJSON()),this.target!==void 0&&(e.object.target=this.target.uuid),e}}class S0 extends fu{constructor(t,e,n){super(t,n),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(Ie.DEFAULT_UP),this.updateMatrix(),this.groundColor=new Ht(e)}copy(t,e){return super.copy(t,e),this.groundColor.copy(t.groundColor),this}}const qa=new ne,Al=new O,Rl=new O;class y0{constructor(t){this.camera=t,this.intensity=1,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new Rt(512,512),this.mapType=Rn,this.map=null,this.mapPass=null,this.matrix=new ne,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new xc,this._frameExtents=new Rt(1,1),this._viewportCount=1,this._viewports=[new le(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(t){const e=this.camera,n=this.matrix;Al.setFromMatrixPosition(t.matrixWorld),e.position.copy(Al),Rl.setFromMatrixPosition(t.target.matrixWorld),e.lookAt(Rl),e.updateMatrixWorld(),qa.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),this._frustum.setFromProjectionMatrix(qa,e.coordinateSystem,e.reversedDepth),e.reversedDepth?n.set(.5,0,0,.5,0,.5,0,.5,0,0,1,0,0,0,0,1):n.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),n.multiply(qa)}getViewport(t){return this._viewports[t]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(t){return this.camera=t.camera.clone(),this.intensity=t.intensity,this.bias=t.bias,this.radius=t.radius,this.autoUpdate=t.autoUpdate,this.needsUpdate=t.needsUpdate,this.normalBias=t.normalBias,this.blurSamples=t.blurSamples,this.mapSize.copy(t.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){const t={};return this.intensity!==1&&(t.intensity=this.intensity),this.bias!==0&&(t.bias=this.bias),this.normalBias!==0&&(t.normalBias=this.normalBias),this.radius!==1&&(t.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(t.mapSize=this.mapSize.toArray()),t.camera=this.camera.toJSON(!1).object,delete t.camera.matrix,t}}class yc extends iu{constructor(t=-1,e=1,n=1,r=-1,s=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=t,this.right=e,this.top=n,this.bottom=r,this.near=s,this.far=a,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.left=t.left,this.right=t.right,this.top=t.top,this.bottom=t.bottom,this.near=t.near,this.far=t.far,this.zoom=t.zoom,this.view=t.view===null?null:Object.assign({},t.view),this}setViewOffset(t,e,n,r,s,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=r,this.view.width=s,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=(this.right-this.left)/(2*this.zoom),e=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,r=(this.top+this.bottom)/2;let s=n-t,a=n+t,o=r+e,c=r-e;if(this.view!==null&&this.view.enabled){const l=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;s+=l*this.view.offsetX,a=s+l*this.view.width,o-=h*this.view.offsetY,c=o-h*this.view.height}this.projectionMatrix.makeOrthographic(s,a,o,c,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.zoom=this.zoom,e.object.left=this.left,e.object.right=this.right,e.object.top=this.top,e.object.bottom=this.bottom,e.object.near=this.near,e.object.far=this.far,this.view!==null&&(e.object.view=Object.assign({},this.view)),e}}class E0 extends y0{constructor(){super(new yc(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class Jo extends fu{constructor(t,e){super(t,e),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(Ie.DEFAULT_UP),this.updateMatrix(),this.target=new Ie,this.shadow=new E0}dispose(){this.shadow.dispose()}copy(t){return super.copy(t),this.target=t.target.clone(),this.shadow=t.shadow.clone(),this}}class w0 extends gn{constructor(t=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=t}}function Cl(i,t,e,n){const r=T0(n);switch(e){case Wh:return i*t;case qh:return i*t/r.components*r.byteLength;case fc:return i*t/r.components*r.byteLength;case Yh:return i*t*2/r.components*r.byteLength;case dc:return i*t*2/r.components*r.byteLength;case Xh:return i*t*3/r.components*r.byteLength;case He:return i*t*4/r.components*r.byteLength;case pc:return i*t*4/r.components*r.byteLength;case Ks:case Js:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*8;case Qs:case ta:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*16;case wo:case Ao:return Math.max(i,16)*Math.max(t,8)/4;case Eo:case To:return Math.max(i,8)*Math.max(t,8)/2;case Ro:case Co:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*8;case Lo:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*16;case Po:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*16;case Do:return Math.floor((i+4)/5)*Math.floor((t+3)/4)*16;case Io:return Math.floor((i+4)/5)*Math.floor((t+4)/5)*16;case Uo:return Math.floor((i+5)/6)*Math.floor((t+4)/5)*16;case No:return Math.floor((i+5)/6)*Math.floor((t+5)/6)*16;case Fo:return Math.floor((i+7)/8)*Math.floor((t+4)/5)*16;case Oo:return Math.floor((i+7)/8)*Math.floor((t+5)/6)*16;case Bo:return Math.floor((i+7)/8)*Math.floor((t+7)/8)*16;case ko:return Math.floor((i+9)/10)*Math.floor((t+4)/5)*16;case Ho:return Math.floor((i+9)/10)*Math.floor((t+5)/6)*16;case zo:return Math.floor((i+9)/10)*Math.floor((t+7)/8)*16;case Vo:return Math.floor((i+9)/10)*Math.floor((t+9)/10)*16;case Go:return Math.floor((i+11)/12)*Math.floor((t+9)/10)*16;case Wo:return Math.floor((i+11)/12)*Math.floor((t+11)/12)*16;case Xo:case qo:case Yo:return Math.ceil(i/4)*Math.ceil(t/4)*16;case $o:case jo:return Math.ceil(i/4)*Math.ceil(t/4)*8;case Zo:case Ko:return Math.ceil(i/4)*Math.ceil(t/4)*16}throw new Error(`Unable to determine texture byte length for ${e} format.`)}function T0(i){switch(i){case Rn:case Hh:return{byteLength:1,components:1};case es:case zh:case qi:return{byteLength:2,components:1};case hc:case uc:return{byteLength:2,components:4};case Vi:case lc:case kn:return{byteLength:4,components:1};case Vh:case Gh:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${i}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:cc}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=cc);/**
 * @license
 * Copyright 2010-2025 Three.js Authors
 * SPDX-License-Identifier: MIT
 */function du(){let i=null,t=!1,e=null,n=null;function r(s,a){e(s,a),n=i.requestAnimationFrame(r)}return{start:function(){t!==!0&&e!==null&&(n=i.requestAnimationFrame(r),t=!0)},stop:function(){i.cancelAnimationFrame(n),t=!1},setAnimationLoop:function(s){e=s},setContext:function(s){i=s}}}function A0(i){const t=new WeakMap;function e(o,c){const l=o.array,h=o.usage,u=l.byteLength,d=i.createBuffer();i.bindBuffer(c,d),i.bufferData(c,l,h),o.onUploadCallback();let f;if(l instanceof Float32Array)f=i.FLOAT;else if(typeof Float16Array<"u"&&l instanceof Float16Array)f=i.HALF_FLOAT;else if(l instanceof Uint16Array)o.isFloat16BufferAttribute?f=i.HALF_FLOAT:f=i.UNSIGNED_SHORT;else if(l instanceof Int16Array)f=i.SHORT;else if(l instanceof Uint32Array)f=i.UNSIGNED_INT;else if(l instanceof Int32Array)f=i.INT;else if(l instanceof Int8Array)f=i.BYTE;else if(l instanceof Uint8Array)f=i.UNSIGNED_BYTE;else if(l instanceof Uint8ClampedArray)f=i.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+l);return{buffer:d,type:f,bytesPerElement:l.BYTES_PER_ELEMENT,version:o.version,size:u}}function n(o,c,l){const h=c.array,u=c.updateRanges;if(i.bindBuffer(l,o),u.length===0)i.bufferSubData(l,0,h);else{u.sort((f,m)=>f.start-m.start);let d=0;for(let f=1;f<u.length;f++){const m=u[d],x=u[f];x.start<=m.start+m.count+1?m.count=Math.max(m.count,x.start+x.count-m.start):(++d,u[d]=x)}u.length=d+1;for(let f=0,m=u.length;f<m;f++){const x=u[f];i.bufferSubData(l,x.start*h.BYTES_PER_ELEMENT,h,x.start,x.count)}c.clearUpdateRanges()}c.onUploadCallback()}function r(o){return o.isInterleavedBufferAttribute&&(o=o.data),t.get(o)}function s(o){o.isInterleavedBufferAttribute&&(o=o.data);const c=t.get(o);c&&(i.deleteBuffer(c.buffer),t.delete(o))}function a(o,c){if(o.isInterleavedBufferAttribute&&(o=o.data),o.isGLBufferAttribute){const h=t.get(o);(!h||h.version<o.version)&&t.set(o,{buffer:o.buffer,type:o.type,bytesPerElement:o.elementSize,version:o.version});return}const l=t.get(o);if(l===void 0)t.set(o,e(o,c));else if(l.version<o.version){if(l.size!==o.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");n(l.buffer,o,c),l.version=o.version}}return{get:r,remove:s,update:a}}var R0=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,C0=`#ifdef USE_ALPHAHASH
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
#endif`,L0=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,P0=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,D0=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,I0=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,U0=`#ifdef USE_AOMAP
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
#endif`,N0=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,F0=`#ifdef USE_BATCHING
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
#endif`,O0=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,B0=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,k0=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,H0=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,z0=`#ifdef USE_IRIDESCENCE
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
#endif`,V0=`#ifdef USE_BUMPMAP
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
#endif`,G0=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,W0=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,X0=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,q0=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,Y0=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,$0=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,j0=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,Z0=`#if defined( USE_COLOR_ALPHA )
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
#endif`,K0=`#define PI 3.141592653589793
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
} // validated`,J0=`#ifdef ENVMAP_TYPE_CUBE_UV
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
#endif`,Q0=`vec3 transformedNormal = objectNormal;
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
#endif`,tp=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,ep=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,np=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,ip=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,rp="gl_FragColor = linearToOutputTexel( gl_FragColor );",sp=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,ap=`#ifdef USE_ENVMAP
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
#endif`,op=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,cp=`#ifdef USE_ENVMAP
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
#endif`,lp=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,hp=`#ifdef USE_ENVMAP
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
#endif`,up=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,fp=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,dp=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,pp=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,mp=`#ifdef USE_GRADIENTMAP
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
}`,gp=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,vp=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,_p=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,xp=`uniform bool receiveShadow;
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
#endif`,Mp=`#ifdef USE_ENVMAP
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
#endif`,bp=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,Sp=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,yp=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,Ep=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,wp=`PhysicalMaterial material;
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
#endif`,Tp=`struct PhysicalMaterial {
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
}`,Ap=`
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
#endif`,Rp=`#if defined( RE_IndirectDiffuse )
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
#endif`,Cp=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,Lp=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,Pp=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Dp=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Ip=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,Up=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,Np=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,Fp=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,Op=`#if defined( USE_POINTS_UV )
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
#endif`,Bp=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,kp=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,Hp=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,zp=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,Vp=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Gp=`#ifdef USE_MORPHTARGETS
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
#endif`,Wp=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Xp=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 nonPerturbedNormal = normal;`,qp=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
#endif`,Yp=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,$p=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,jp=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,Zp=`#ifdef USE_NORMALMAP
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
#endif`,Kp=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,Jp=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,Qp=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,t1=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,e1=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,n1=`vec3 packNormalToRGB( const in vec3 normal ) {
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
}`,i1=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,r1=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,s1=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,a1=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,o1=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,c1=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,l1=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,h1=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,u1=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
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
#endif`,f1=`float getShadowMask() {
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
}`,d1=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,p1=`#ifdef USE_SKINNING
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
#endif`,m1=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,g1=`#ifdef USE_SKINNING
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
#endif`,v1=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,_1=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,x1=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,M1=`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,b1=`#ifdef USE_TRANSMISSION
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
#endif`,S1=`#ifdef USE_TRANSMISSION
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
#endif`,y1=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,E1=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,w1=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,T1=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const A1=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,R1=`uniform sampler2D t2D;
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
}`,C1=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,L1=`#ifdef ENVMAP_TYPE_CUBE
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
}`,P1=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,D1=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,I1=`#include <common>
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
}`,U1=`#if DEPTH_PACKING == 3200
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
}`,N1=`#define DISTANCE
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
}`,F1=`#define DISTANCE
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
}`,O1=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,B1=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,k1=`uniform float scale;
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
}`,H1=`uniform vec3 diffuse;
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
}`,z1=`#include <common>
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
}`,V1=`uniform vec3 diffuse;
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
}`,G1=`#define LAMBERT
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
}`,W1=`#define LAMBERT
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
}`,X1=`#define MATCAP
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
}`,q1=`#define MATCAP
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
}`,Y1=`#define NORMAL
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
}`,$1=`#define NORMAL
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
}`,j1=`#define PHONG
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
}`,Z1=`#define PHONG
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
}`,K1=`#define STANDARD
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
}`,J1=`#define STANDARD
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
}`,Q1=`#define TOON
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
}`,tm=`#define TOON
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
}`,em=`uniform float size;
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
}`,nm=`uniform vec3 diffuse;
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
}`,im=`#include <common>
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
}`,rm=`uniform vec3 color;
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
}`,sm=`uniform float rotation;
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
}`,am=`uniform vec3 diffuse;
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
}`,Kt={alphahash_fragment:R0,alphahash_pars_fragment:C0,alphamap_fragment:L0,alphamap_pars_fragment:P0,alphatest_fragment:D0,alphatest_pars_fragment:I0,aomap_fragment:U0,aomap_pars_fragment:N0,batching_pars_vertex:F0,batching_vertex:O0,begin_vertex:B0,beginnormal_vertex:k0,bsdfs:H0,iridescence_fragment:z0,bumpmap_pars_fragment:V0,clipping_planes_fragment:G0,clipping_planes_pars_fragment:W0,clipping_planes_pars_vertex:X0,clipping_planes_vertex:q0,color_fragment:Y0,color_pars_fragment:$0,color_pars_vertex:j0,color_vertex:Z0,common:K0,cube_uv_reflection_fragment:J0,defaultnormal_vertex:Q0,displacementmap_pars_vertex:tp,displacementmap_vertex:ep,emissivemap_fragment:np,emissivemap_pars_fragment:ip,colorspace_fragment:rp,colorspace_pars_fragment:sp,envmap_fragment:ap,envmap_common_pars_fragment:op,envmap_pars_fragment:cp,envmap_pars_vertex:lp,envmap_physical_pars_fragment:Mp,envmap_vertex:hp,fog_vertex:up,fog_pars_vertex:fp,fog_fragment:dp,fog_pars_fragment:pp,gradientmap_pars_fragment:mp,lightmap_pars_fragment:gp,lights_lambert_fragment:vp,lights_lambert_pars_fragment:_p,lights_pars_begin:xp,lights_toon_fragment:bp,lights_toon_pars_fragment:Sp,lights_phong_fragment:yp,lights_phong_pars_fragment:Ep,lights_physical_fragment:wp,lights_physical_pars_fragment:Tp,lights_fragment_begin:Ap,lights_fragment_maps:Rp,lights_fragment_end:Cp,logdepthbuf_fragment:Lp,logdepthbuf_pars_fragment:Pp,logdepthbuf_pars_vertex:Dp,logdepthbuf_vertex:Ip,map_fragment:Up,map_pars_fragment:Np,map_particle_fragment:Fp,map_particle_pars_fragment:Op,metalnessmap_fragment:Bp,metalnessmap_pars_fragment:kp,morphinstance_vertex:Hp,morphcolor_vertex:zp,morphnormal_vertex:Vp,morphtarget_pars_vertex:Gp,morphtarget_vertex:Wp,normal_fragment_begin:Xp,normal_fragment_maps:qp,normal_pars_fragment:Yp,normal_pars_vertex:$p,normal_vertex:jp,normalmap_pars_fragment:Zp,clearcoat_normal_fragment_begin:Kp,clearcoat_normal_fragment_maps:Jp,clearcoat_pars_fragment:Qp,iridescence_pars_fragment:t1,opaque_fragment:e1,packing:n1,premultiplied_alpha_fragment:i1,project_vertex:r1,dithering_fragment:s1,dithering_pars_fragment:a1,roughnessmap_fragment:o1,roughnessmap_pars_fragment:c1,shadowmap_pars_fragment:l1,shadowmap_pars_vertex:h1,shadowmap_vertex:u1,shadowmask_pars_fragment:f1,skinbase_vertex:d1,skinning_pars_vertex:p1,skinning_vertex:m1,skinnormal_vertex:g1,specularmap_fragment:v1,specularmap_pars_fragment:_1,tonemapping_fragment:x1,tonemapping_pars_fragment:M1,transmission_fragment:b1,transmission_pars_fragment:S1,uv_pars_fragment:y1,uv_pars_vertex:E1,uv_vertex:w1,worldpos_vertex:T1,background_vert:A1,background_frag:R1,backgroundCube_vert:C1,backgroundCube_frag:L1,cube_vert:P1,cube_frag:D1,depth_vert:I1,depth_frag:U1,distanceRGBA_vert:N1,distanceRGBA_frag:F1,equirect_vert:O1,equirect_frag:B1,linedashed_vert:k1,linedashed_frag:H1,meshbasic_vert:z1,meshbasic_frag:V1,meshlambert_vert:G1,meshlambert_frag:W1,meshmatcap_vert:X1,meshmatcap_frag:q1,meshnormal_vert:Y1,meshnormal_frag:$1,meshphong_vert:j1,meshphong_frag:Z1,meshphysical_vert:K1,meshphysical_frag:J1,meshtoon_vert:Q1,meshtoon_frag:tm,points_vert:em,points_frag:nm,shadow_vert:im,shadow_frag:rm,sprite_vert:sm,sprite_frag:am},Et={common:{diffuse:{value:new Ht(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Zt},alphaMap:{value:null},alphaMapTransform:{value:new Zt},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Zt}},envmap:{envMap:{value:null},envMapRotation:{value:new Zt},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Zt}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Zt}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Zt},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Zt},normalScale:{value:new Rt(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Zt},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Zt}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Zt}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Zt}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Ht(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new Ht(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Zt},alphaTest:{value:0},uvTransform:{value:new Zt}},sprite:{diffuse:{value:new Ht(16777215)},opacity:{value:1},center:{value:new Rt(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Zt},alphaMap:{value:null},alphaMapTransform:{value:new Zt},alphaTest:{value:0}}},Fn={basic:{uniforms:Ge([Et.common,Et.specularmap,Et.envmap,Et.aomap,Et.lightmap,Et.fog]),vertexShader:Kt.meshbasic_vert,fragmentShader:Kt.meshbasic_frag},lambert:{uniforms:Ge([Et.common,Et.specularmap,Et.envmap,Et.aomap,Et.lightmap,Et.emissivemap,Et.bumpmap,Et.normalmap,Et.displacementmap,Et.fog,Et.lights,{emissive:{value:new Ht(0)}}]),vertexShader:Kt.meshlambert_vert,fragmentShader:Kt.meshlambert_frag},phong:{uniforms:Ge([Et.common,Et.specularmap,Et.envmap,Et.aomap,Et.lightmap,Et.emissivemap,Et.bumpmap,Et.normalmap,Et.displacementmap,Et.fog,Et.lights,{emissive:{value:new Ht(0)},specular:{value:new Ht(1118481)},shininess:{value:30}}]),vertexShader:Kt.meshphong_vert,fragmentShader:Kt.meshphong_frag},standard:{uniforms:Ge([Et.common,Et.envmap,Et.aomap,Et.lightmap,Et.emissivemap,Et.bumpmap,Et.normalmap,Et.displacementmap,Et.roughnessmap,Et.metalnessmap,Et.fog,Et.lights,{emissive:{value:new Ht(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Kt.meshphysical_vert,fragmentShader:Kt.meshphysical_frag},toon:{uniforms:Ge([Et.common,Et.aomap,Et.lightmap,Et.emissivemap,Et.bumpmap,Et.normalmap,Et.displacementmap,Et.gradientmap,Et.fog,Et.lights,{emissive:{value:new Ht(0)}}]),vertexShader:Kt.meshtoon_vert,fragmentShader:Kt.meshtoon_frag},matcap:{uniforms:Ge([Et.common,Et.bumpmap,Et.normalmap,Et.displacementmap,Et.fog,{matcap:{value:null}}]),vertexShader:Kt.meshmatcap_vert,fragmentShader:Kt.meshmatcap_frag},points:{uniforms:Ge([Et.points,Et.fog]),vertexShader:Kt.points_vert,fragmentShader:Kt.points_frag},dashed:{uniforms:Ge([Et.common,Et.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Kt.linedashed_vert,fragmentShader:Kt.linedashed_frag},depth:{uniforms:Ge([Et.common,Et.displacementmap]),vertexShader:Kt.depth_vert,fragmentShader:Kt.depth_frag},normal:{uniforms:Ge([Et.common,Et.bumpmap,Et.normalmap,Et.displacementmap,{opacity:{value:1}}]),vertexShader:Kt.meshnormal_vert,fragmentShader:Kt.meshnormal_frag},sprite:{uniforms:Ge([Et.sprite,Et.fog]),vertexShader:Kt.sprite_vert,fragmentShader:Kt.sprite_frag},background:{uniforms:{uvTransform:{value:new Zt},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Kt.background_vert,fragmentShader:Kt.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new Zt}},vertexShader:Kt.backgroundCube_vert,fragmentShader:Kt.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Kt.cube_vert,fragmentShader:Kt.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Kt.equirect_vert,fragmentShader:Kt.equirect_frag},distanceRGBA:{uniforms:Ge([Et.common,Et.displacementmap,{referencePosition:{value:new O},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Kt.distanceRGBA_vert,fragmentShader:Kt.distanceRGBA_frag},shadow:{uniforms:Ge([Et.lights,Et.fog,{color:{value:new Ht(0)},opacity:{value:1}}]),vertexShader:Kt.shadow_vert,fragmentShader:Kt.shadow_frag}};Fn.physical={uniforms:Ge([Fn.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Zt},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Zt},clearcoatNormalScale:{value:new Rt(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Zt},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Zt},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Zt},sheen:{value:0},sheenColor:{value:new Ht(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Zt},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Zt},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Zt},transmissionSamplerSize:{value:new Rt},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Zt},attenuationDistance:{value:0},attenuationColor:{value:new Ht(0)},specularColor:{value:new Ht(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Zt},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Zt},anisotropyVector:{value:new Rt},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Zt}}]),vertexShader:Kt.meshphysical_vert,fragmentShader:Kt.meshphysical_frag};const Bs={r:0,b:0,g:0},Ai=new vn,om=new ne;function cm(i,t,e,n,r,s,a){const o=new Ht(0);let c=s===!0?0:1,l,h,u=null,d=0,f=null;function m(b){let M=b.isScene===!0?b.background:null;return M&&M.isTexture&&(M=(b.backgroundBlurriness>0?e:t).get(M)),M}function x(b){let M=!1;const T=m(b);T===null?p(o,c):T&&T.isColor&&(p(T,1),M=!0);const w=i.xr.getEnvironmentBlendMode();w==="additive"?n.buffers.color.setClear(0,0,0,1,a):w==="alpha-blend"&&n.buffers.color.setClear(0,0,0,0,a),(i.autoClear||M)&&(n.buffers.depth.setTest(!0),n.buffers.depth.setMask(!0),n.buffers.color.setMask(!0),i.clear(i.autoClearColor,i.autoClearDepth,i.autoClearStencil))}function g(b,M){const T=m(M);T&&(T.isCubeTexture||T.mapping===ua)?(h===void 0&&(h=new Wt(new Xe(1,1,1),new Ke({name:"BackgroundCubeMaterial",uniforms:Tr(Fn.backgroundCube.uniforms),vertexShader:Fn.backgroundCube.vertexShader,fragmentShader:Fn.backgroundCube.fragmentShader,side:Je,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),h.geometry.deleteAttribute("normal"),h.geometry.deleteAttribute("uv"),h.onBeforeRender=function(w,A,R){this.matrixWorld.copyPosition(R.matrixWorld)},Object.defineProperty(h.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),r.update(h)),Ai.copy(M.backgroundRotation),Ai.x*=-1,Ai.y*=-1,Ai.z*=-1,T.isCubeTexture&&T.isRenderTargetTexture===!1&&(Ai.y*=-1,Ai.z*=-1),h.material.uniforms.envMap.value=T,h.material.uniforms.flipEnvMap.value=T.isCubeTexture&&T.isRenderTargetTexture===!1?-1:1,h.material.uniforms.backgroundBlurriness.value=M.backgroundBlurriness,h.material.uniforms.backgroundIntensity.value=M.backgroundIntensity,h.material.uniforms.backgroundRotation.value.setFromMatrix4(om.makeRotationFromEuler(Ai)),h.material.toneMapped=re.getTransfer(T.colorSpace)!==ce,(u!==T||d!==T.version||f!==i.toneMapping)&&(h.material.needsUpdate=!0,u=T,d=T.version,f=i.toneMapping),h.layers.enableAll(),b.unshift(h,h.geometry,h.material,0,0,null)):T&&T.isTexture&&(l===void 0&&(l=new Wt(new Ir(2,2),new Ke({name:"BackgroundMaterial",uniforms:Tr(Fn.background.uniforms),vertexShader:Fn.background.vertexShader,fragmentShader:Fn.background.fragmentShader,side:Mi,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),l.geometry.deleteAttribute("normal"),Object.defineProperty(l.material,"map",{get:function(){return this.uniforms.t2D.value}}),r.update(l)),l.material.uniforms.t2D.value=T,l.material.uniforms.backgroundIntensity.value=M.backgroundIntensity,l.material.toneMapped=re.getTransfer(T.colorSpace)!==ce,T.matrixAutoUpdate===!0&&T.updateMatrix(),l.material.uniforms.uvTransform.value.copy(T.matrix),(u!==T||d!==T.version||f!==i.toneMapping)&&(l.material.needsUpdate=!0,u=T,d=T.version,f=i.toneMapping),l.layers.enableAll(),b.unshift(l,l.geometry,l.material,0,0,null))}function p(b,M){b.getRGB(Bs,nu(i)),n.buffers.color.setClear(Bs.r,Bs.g,Bs.b,M,a)}function E(){h!==void 0&&(h.geometry.dispose(),h.material.dispose(),h=void 0),l!==void 0&&(l.geometry.dispose(),l.material.dispose(),l=void 0)}return{getClearColor:function(){return o},setClearColor:function(b,M=1){o.set(b),c=M,p(o,c)},getClearAlpha:function(){return c},setClearAlpha:function(b){c=b,p(o,c)},render:x,addToRenderList:g,dispose:E}}function lm(i,t){const e=i.getParameter(i.MAX_VERTEX_ATTRIBS),n={},r=d(null);let s=r,a=!1;function o(_,S,y,D,I){let U=!1;const H=u(D,y,S);s!==H&&(s=H,l(s.object)),U=f(_,D,y,I),U&&m(_,D,y,I),I!==null&&t.update(I,i.ELEMENT_ARRAY_BUFFER),(U||a)&&(a=!1,M(_,S,y,D),I!==null&&i.bindBuffer(i.ELEMENT_ARRAY_BUFFER,t.get(I).buffer))}function c(){return i.createVertexArray()}function l(_){return i.bindVertexArray(_)}function h(_){return i.deleteVertexArray(_)}function u(_,S,y){const D=y.wireframe===!0;let I=n[_.id];I===void 0&&(I={},n[_.id]=I);let U=I[S.id];U===void 0&&(U={},I[S.id]=U);let H=U[D];return H===void 0&&(H=d(c()),U[D]=H),H}function d(_){const S=[],y=[],D=[];for(let I=0;I<e;I++)S[I]=0,y[I]=0,D[I]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:S,enabledAttributes:y,attributeDivisors:D,object:_,attributes:{},index:null}}function f(_,S,y,D){const I=s.attributes,U=S.attributes;let H=0;const $=y.getAttributes();for(const V in $)if($[V].location>=0){const st=I[V];let ct=U[V];if(ct===void 0&&(V==="instanceMatrix"&&_.instanceMatrix&&(ct=_.instanceMatrix),V==="instanceColor"&&_.instanceColor&&(ct=_.instanceColor)),st===void 0||st.attribute!==ct||ct&&st.data!==ct.data)return!0;H++}return s.attributesNum!==H||s.index!==D}function m(_,S,y,D){const I={},U=S.attributes;let H=0;const $=y.getAttributes();for(const V in $)if($[V].location>=0){let st=U[V];st===void 0&&(V==="instanceMatrix"&&_.instanceMatrix&&(st=_.instanceMatrix),V==="instanceColor"&&_.instanceColor&&(st=_.instanceColor));const ct={};ct.attribute=st,st&&st.data&&(ct.data=st.data),I[V]=ct,H++}s.attributes=I,s.attributesNum=H,s.index=D}function x(){const _=s.newAttributes;for(let S=0,y=_.length;S<y;S++)_[S]=0}function g(_){p(_,0)}function p(_,S){const y=s.newAttributes,D=s.enabledAttributes,I=s.attributeDivisors;y[_]=1,D[_]===0&&(i.enableVertexAttribArray(_),D[_]=1),I[_]!==S&&(i.vertexAttribDivisor(_,S),I[_]=S)}function E(){const _=s.newAttributes,S=s.enabledAttributes;for(let y=0,D=S.length;y<D;y++)S[y]!==_[y]&&(i.disableVertexAttribArray(y),S[y]=0)}function b(_,S,y,D,I,U,H){H===!0?i.vertexAttribIPointer(_,S,y,I,U):i.vertexAttribPointer(_,S,y,D,I,U)}function M(_,S,y,D){x();const I=D.attributes,U=y.getAttributes(),H=S.defaultAttributeValues;for(const $ in U){const V=U[$];if(V.location>=0){let tt=I[$];if(tt===void 0&&($==="instanceMatrix"&&_.instanceMatrix&&(tt=_.instanceMatrix),$==="instanceColor"&&_.instanceColor&&(tt=_.instanceColor)),tt!==void 0){const st=tt.normalized,ct=tt.itemSize,ft=t.get(tt);if(ft===void 0)continue;const Ct=ft.buffer,zt=ft.type,it=ft.bytesPerElement,W=zt===i.INT||zt===i.UNSIGNED_INT||tt.gpuType===lc;if(tt.isInterleavedBufferAttribute){const Z=tt.data,F=Z.stride,B=tt.offset;if(Z.isInstancedInterleavedBuffer){for(let k=0;k<V.locationSize;k++)p(V.location+k,Z.meshPerAttribute);_.isInstancedMesh!==!0&&D._maxInstanceCount===void 0&&(D._maxInstanceCount=Z.meshPerAttribute*Z.count)}else for(let k=0;k<V.locationSize;k++)g(V.location+k);i.bindBuffer(i.ARRAY_BUFFER,Ct);for(let k=0;k<V.locationSize;k++)b(V.location+k,ct/V.locationSize,zt,st,F*it,(B+ct/V.locationSize*k)*it,W)}else{if(tt.isInstancedBufferAttribute){for(let Z=0;Z<V.locationSize;Z++)p(V.location+Z,tt.meshPerAttribute);_.isInstancedMesh!==!0&&D._maxInstanceCount===void 0&&(D._maxInstanceCount=tt.meshPerAttribute*tt.count)}else for(let Z=0;Z<V.locationSize;Z++)g(V.location+Z);i.bindBuffer(i.ARRAY_BUFFER,Ct);for(let Z=0;Z<V.locationSize;Z++)b(V.location+Z,ct/V.locationSize,zt,st,ct*it,ct/V.locationSize*Z*it,W)}}else if(H!==void 0){const st=H[$];if(st!==void 0)switch(st.length){case 2:i.vertexAttrib2fv(V.location,st);break;case 3:i.vertexAttrib3fv(V.location,st);break;case 4:i.vertexAttrib4fv(V.location,st);break;default:i.vertexAttrib1fv(V.location,st)}}}}E()}function T(){R();for(const _ in n){const S=n[_];for(const y in S){const D=S[y];for(const I in D)h(D[I].object),delete D[I];delete S[y]}delete n[_]}}function w(_){if(n[_.id]===void 0)return;const S=n[_.id];for(const y in S){const D=S[y];for(const I in D)h(D[I].object),delete D[I];delete S[y]}delete n[_.id]}function A(_){for(const S in n){const y=n[S];if(y[_.id]===void 0)continue;const D=y[_.id];for(const I in D)h(D[I].object),delete D[I];delete y[_.id]}}function R(){v(),a=!0,s!==r&&(s=r,l(s.object))}function v(){r.geometry=null,r.program=null,r.wireframe=!1}return{setup:o,reset:R,resetDefaultState:v,dispose:T,releaseStatesOfGeometry:w,releaseStatesOfProgram:A,initAttributes:x,enableAttribute:g,disableUnusedAttributes:E}}function hm(i,t,e){let n;function r(l){n=l}function s(l,h){i.drawArrays(n,l,h),e.update(h,n,1)}function a(l,h,u){u!==0&&(i.drawArraysInstanced(n,l,h,u),e.update(h,n,u))}function o(l,h,u){if(u===0)return;t.get("WEBGL_multi_draw").multiDrawArraysWEBGL(n,l,0,h,0,u);let f=0;for(let m=0;m<u;m++)f+=h[m];e.update(f,n,1)}function c(l,h,u,d){if(u===0)return;const f=t.get("WEBGL_multi_draw");if(f===null)for(let m=0;m<l.length;m++)a(l[m],h[m],d[m]);else{f.multiDrawArraysInstancedWEBGL(n,l,0,h,0,d,0,u);let m=0;for(let x=0;x<u;x++)m+=h[x]*d[x];e.update(m,n,1)}}this.setMode=r,this.render=s,this.renderInstances=a,this.renderMultiDraw=o,this.renderMultiDrawInstances=c}function um(i,t,e,n){let r;function s(){if(r!==void 0)return r;if(t.has("EXT_texture_filter_anisotropic")===!0){const A=t.get("EXT_texture_filter_anisotropic");r=i.getParameter(A.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else r=0;return r}function a(A){return!(A!==He&&n.convert(A)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_FORMAT))}function o(A){const R=A===qi&&(t.has("EXT_color_buffer_half_float")||t.has("EXT_color_buffer_float"));return!(A!==Rn&&n.convert(A)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_TYPE)&&A!==kn&&!R)}function c(A){if(A==="highp"){if(i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.HIGH_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.HIGH_FLOAT).precision>0)return"highp";A="mediump"}return A==="mediump"&&i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.MEDIUM_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let l=e.precision!==void 0?e.precision:"highp";const h=c(l);h!==l&&(console.warn("THREE.WebGLRenderer:",l,"not supported, using",h,"instead."),l=h);const u=e.logarithmicDepthBuffer===!0,d=e.reversedDepthBuffer===!0&&t.has("EXT_clip_control"),f=i.getParameter(i.MAX_TEXTURE_IMAGE_UNITS),m=i.getParameter(i.MAX_VERTEX_TEXTURE_IMAGE_UNITS),x=i.getParameter(i.MAX_TEXTURE_SIZE),g=i.getParameter(i.MAX_CUBE_MAP_TEXTURE_SIZE),p=i.getParameter(i.MAX_VERTEX_ATTRIBS),E=i.getParameter(i.MAX_VERTEX_UNIFORM_VECTORS),b=i.getParameter(i.MAX_VARYING_VECTORS),M=i.getParameter(i.MAX_FRAGMENT_UNIFORM_VECTORS),T=m>0,w=i.getParameter(i.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:s,getMaxPrecision:c,textureFormatReadable:a,textureTypeReadable:o,precision:l,logarithmicDepthBuffer:u,reversedDepthBuffer:d,maxTextures:f,maxVertexTextures:m,maxTextureSize:x,maxCubemapSize:g,maxAttributes:p,maxVertexUniforms:E,maxVaryings:b,maxFragmentUniforms:M,vertexTextures:T,maxSamples:w}}function fm(i){const t=this;let e=null,n=0,r=!1,s=!1;const a=new Ci,o=new Zt,c={value:null,needsUpdate:!1};this.uniform=c,this.numPlanes=0,this.numIntersection=0,this.init=function(u,d){const f=u.length!==0||d||n!==0||r;return r=d,n=u.length,f},this.beginShadows=function(){s=!0,h(null)},this.endShadows=function(){s=!1},this.setGlobalState=function(u,d){e=h(u,d,0)},this.setState=function(u,d,f){const m=u.clippingPlanes,x=u.clipIntersection,g=u.clipShadows,p=i.get(u);if(!r||m===null||m.length===0||s&&!g)s?h(null):l();else{const E=s?0:n,b=E*4;let M=p.clippingState||null;c.value=M,M=h(m,d,b,f);for(let T=0;T!==b;++T)M[T]=e[T];p.clippingState=M,this.numIntersection=x?this.numPlanes:0,this.numPlanes+=E}};function l(){c.value!==e&&(c.value=e,c.needsUpdate=n>0),t.numPlanes=n,t.numIntersection=0}function h(u,d,f,m){const x=u!==null?u.length:0;let g=null;if(x!==0){if(g=c.value,m!==!0||g===null){const p=f+x*4,E=d.matrixWorldInverse;o.getNormalMatrix(E),(g===null||g.length<p)&&(g=new Float32Array(p));for(let b=0,M=f;b!==x;++b,M+=4)a.copy(u[b]).applyMatrix4(E,o),a.normal.toArray(g,M),g[M+3]=a.constant}c.value=g,c.needsUpdate=!0}return t.numPlanes=x,t.numIntersection=0,g}}function dm(i){let t=new WeakMap;function e(a,o){return o===ra?a.mapping=Er:o===So&&(a.mapping=wr),a}function n(a){if(a&&a.isTexture){const o=a.mapping;if(o===ra||o===So)if(t.has(a)){const c=t.get(a).texture;return e(c,a.mapping)}else{const c=a.image;if(c&&c.height>0){const l=new Kd(c.height);return l.fromEquirectangularTexture(i,a),t.set(a,l),a.addEventListener("dispose",r),e(l.texture,a.mapping)}else return null}}return a}function r(a){const o=a.target;o.removeEventListener("dispose",r);const c=t.get(o);c!==void 0&&(t.delete(o),c.dispose())}function s(){t=new WeakMap}return{get:n,dispose:s}}const _r=4,Ll=[.125,.215,.35,.446,.526,.582],Di=20,Ya=new yc,Pl=new Ht;let $a=null,ja=0,Za=0,Ka=!1;const Li=(1+Math.sqrt(5))/2,hr=1/Li,Dl=[new O(-Li,hr,0),new O(Li,hr,0),new O(-hr,0,Li),new O(hr,0,Li),new O(0,Li,-hr),new O(0,Li,hr),new O(-1,1,-1),new O(1,1,-1),new O(-1,1,1),new O(1,1,1)],pm=new O;class Qo{constructor(t){this._renderer=t,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(t,e=0,n=.1,r=100,s={}){const{size:a=256,position:o=pm}=s;$a=this._renderer.getRenderTarget(),ja=this._renderer.getActiveCubeFace(),Za=this._renderer.getActiveMipmapLevel(),Ka=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(a);const c=this._allocateTargets();return c.depthBuffer=!0,this._sceneToCubeUV(t,n,r,c,o),e>0&&this._blur(c,0,0,e),this._applyPMREM(c),this._cleanup(c),c}fromEquirectangular(t,e=null){return this._fromTexture(t,e)}fromCubemap(t,e=null){return this._fromTexture(t,e)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Nl(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Ul(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(t){this._lodMax=Math.floor(Math.log2(t)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let t=0;t<this._lodPlanes.length;t++)this._lodPlanes[t].dispose()}_cleanup(t){this._renderer.setRenderTarget($a,ja,Za),this._renderer.xr.enabled=Ka,t.scissorTest=!1,ks(t,0,0,t.width,t.height)}_fromTexture(t,e){t.mapping===Er||t.mapping===wr?this._setSize(t.image.length===0?16:t.image[0].width||t.image[0].image.width):this._setSize(t.image.width/4),$a=this._renderer.getRenderTarget(),ja=this._renderer.getActiveCubeFace(),Za=this._renderer.getActiveMipmapLevel(),Ka=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const n=e||this._allocateTargets();return this._textureToCubeUV(t,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){const t=3*Math.max(this._cubeSize,112),e=4*this._cubeSize,n={magFilter:ve,minFilter:ve,generateMipmaps:!1,type:qi,format:He,colorSpace:Gi,depthBuffer:!1},r=Il(t,e,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==t||this._pingPongRenderTarget.height!==e){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=Il(t,e,n);const{_lodMax:s}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=mm(s)),this._blurMaterial=gm(s,t,e)}return r}_compileMaterial(t){const e=new Wt(this._lodPlanes[0],t);this._renderer.compile(e,Ya)}_sceneToCubeUV(t,e,n,r,s){const c=new gn(90,1,e,n),l=[1,-1,1,1,1,1],h=[1,1,1,-1,-1,-1],u=this._renderer,d=u.autoClear,f=u.toneMapping;u.getClearColor(Pl),u.toneMapping=_i,u.autoClear=!1,u.state.buffers.depth.getReversed()&&(u.setRenderTarget(r),u.clearDepth(),u.setRenderTarget(null));const x=new fa({name:"PMREM.Background",side:Je,depthWrite:!1,depthTest:!1}),g=new Wt(new Xe,x);let p=!1;const E=t.background;E?E.isColor&&(x.color.copy(E),t.background=null,p=!0):(x.color.copy(Pl),p=!0);for(let b=0;b<6;b++){const M=b%3;M===0?(c.up.set(0,l[b],0),c.position.set(s.x,s.y,s.z),c.lookAt(s.x+h[b],s.y,s.z)):M===1?(c.up.set(0,0,l[b]),c.position.set(s.x,s.y,s.z),c.lookAt(s.x,s.y+h[b],s.z)):(c.up.set(0,l[b],0),c.position.set(s.x,s.y,s.z),c.lookAt(s.x,s.y,s.z+h[b]));const T=this._cubeSize;ks(r,M*T,b>2?T:0,T,T),u.setRenderTarget(r),p&&u.render(g,c),u.render(t,c)}g.geometry.dispose(),g.material.dispose(),u.toneMapping=f,u.autoClear=d,t.background=E}_textureToCubeUV(t,e){const n=this._renderer,r=t.mapping===Er||t.mapping===wr;r?(this._cubemapMaterial===null&&(this._cubemapMaterial=Nl()),this._cubemapMaterial.uniforms.flipEnvMap.value=t.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=Ul());const s=r?this._cubemapMaterial:this._equirectMaterial,a=new Wt(this._lodPlanes[0],s),o=s.uniforms;o.envMap.value=t;const c=this._cubeSize;ks(e,0,0,3*c,2*c),n.setRenderTarget(e),n.render(a,Ya)}_applyPMREM(t){const e=this._renderer,n=e.autoClear;e.autoClear=!1;const r=this._lodPlanes.length;for(let s=1;s<r;s++){const a=Math.sqrt(this._sigmas[s]*this._sigmas[s]-this._sigmas[s-1]*this._sigmas[s-1]),o=Dl[(r-s-1)%Dl.length];this._blur(t,s-1,s,a,o)}e.autoClear=n}_blur(t,e,n,r,s){const a=this._pingPongRenderTarget;this._halfBlur(t,a,e,n,r,"latitudinal",s),this._halfBlur(a,t,n,n,r,"longitudinal",s)}_halfBlur(t,e,n,r,s,a,o){const c=this._renderer,l=this._blurMaterial;a!=="latitudinal"&&a!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const h=3,u=new Wt(this._lodPlanes[r],l),d=l.uniforms,f=this._sizeLods[n]-1,m=isFinite(s)?Math.PI/(2*f):2*Math.PI/(2*Di-1),x=s/m,g=isFinite(s)?1+Math.floor(h*x):Di;g>Di&&console.warn(`sigmaRadians, ${s}, is too large and will clip, as it requested ${g} samples when the maximum is set to ${Di}`);const p=[];let E=0;for(let A=0;A<Di;++A){const R=A/x,v=Math.exp(-R*R/2);p.push(v),A===0?E+=v:A<g&&(E+=2*v)}for(let A=0;A<p.length;A++)p[A]=p[A]/E;d.envMap.value=t.texture,d.samples.value=g,d.weights.value=p,d.latitudinal.value=a==="latitudinal",o&&(d.poleAxis.value=o);const{_lodMax:b}=this;d.dTheta.value=m,d.mipInt.value=b-n;const M=this._sizeLods[r],T=3*M*(r>b-_r?r-b+_r:0),w=4*(this._cubeSize-M);ks(e,T,w,3*M,2*M),c.setRenderTarget(e),c.render(u,Ya)}}function mm(i){const t=[],e=[],n=[];let r=i;const s=i-_r+1+Ll.length;for(let a=0;a<s;a++){const o=Math.pow(2,r);e.push(o);let c=1/o;a>i-_r?c=Ll[a-i+_r-1]:a===0&&(c=0),n.push(c);const l=1/(o-2),h=-l,u=1+l,d=[h,h,u,h,u,u,h,h,u,u,h,u],f=6,m=6,x=3,g=2,p=1,E=new Float32Array(x*m*f),b=new Float32Array(g*m*f),M=new Float32Array(p*m*f);for(let w=0;w<f;w++){const A=w%3*2/3-1,R=w>2?0:-1,v=[A,R,0,A+2/3,R,0,A+2/3,R+1,0,A,R,0,A+2/3,R+1,0,A,R+1,0];E.set(v,x*m*w),b.set(d,g*m*w);const _=[w,w,w,w,w,w];M.set(_,p*m*w)}const T=new Ue;T.setAttribute("position",new ae(E,x)),T.setAttribute("uv",new ae(b,g)),T.setAttribute("faceIndex",new ae(M,p)),t.push(T),r>_r&&r--}return{lodPlanes:t,sizeLods:e,sigmas:n}}function Il(i,t,e){const n=new Ze(i,t,e);return n.texture.mapping=ua,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function ks(i,t,e,n,r){i.viewport.set(t,e,n,r),i.scissor.set(t,e,n,r)}function gm(i,t,e){const n=new Float32Array(Di),r=new O(0,1,0);return new Ke({name:"SphericalGaussianBlur",defines:{n:Di,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/e,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:n},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:r}},vertexShader:Ec(),fragmentShader:`

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
		`,blending:vi,depthTest:!1,depthWrite:!1})}function Ul(){return new Ke({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:Ec(),fragmentShader:`

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
		`,blending:vi,depthTest:!1,depthWrite:!1})}function Nl(){return new Ke({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:Ec(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:vi,depthTest:!1,depthWrite:!1})}function Ec(){return`

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
	`}function vm(i){let t=new WeakMap,e=null;function n(o){if(o&&o.isTexture){const c=o.mapping,l=c===ra||c===So,h=c===Er||c===wr;if(l||h){let u=t.get(o);const d=u!==void 0?u.texture.pmremVersion:0;if(o.isRenderTargetTexture&&o.pmremVersion!==d)return e===null&&(e=new Qo(i)),u=l?e.fromEquirectangular(o,u):e.fromCubemap(o,u),u.texture.pmremVersion=o.pmremVersion,t.set(o,u),u.texture;if(u!==void 0)return u.texture;{const f=o.image;return l&&f&&f.height>0||h&&f&&r(f)?(e===null&&(e=new Qo(i)),u=l?e.fromEquirectangular(o):e.fromCubemap(o),u.texture.pmremVersion=o.pmremVersion,t.set(o,u),o.addEventListener("dispose",s),u.texture):null}}}return o}function r(o){let c=0;const l=6;for(let h=0;h<l;h++)o[h]!==void 0&&c++;return c===l}function s(o){const c=o.target;c.removeEventListener("dispose",s);const l=t.get(c);l!==void 0&&(t.delete(c),l.dispose())}function a(){t=new WeakMap,e!==null&&(e.dispose(),e=null)}return{get:n,dispose:a}}function _m(i){const t={};function e(n){if(t[n]!==void 0)return t[n];let r;switch(n){case"WEBGL_depth_texture":r=i.getExtension("WEBGL_depth_texture")||i.getExtension("MOZ_WEBGL_depth_texture")||i.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":r=i.getExtension("EXT_texture_filter_anisotropic")||i.getExtension("MOZ_EXT_texture_filter_anisotropic")||i.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":r=i.getExtension("WEBGL_compressed_texture_s3tc")||i.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":r=i.getExtension("WEBGL_compressed_texture_pvrtc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:r=i.getExtension(n)}return t[n]=r,r}return{has:function(n){return e(n)!==null},init:function(){e("EXT_color_buffer_float"),e("WEBGL_clip_cull_distance"),e("OES_texture_float_linear"),e("EXT_color_buffer_half_float"),e("WEBGL_multisampled_render_to_texture"),e("WEBGL_render_shared_exponent")},get:function(n){const r=e(n);return r===null&&as("THREE.WebGLRenderer: "+n+" extension not supported."),r}}}function xm(i,t,e,n){const r={},s=new WeakMap;function a(u){const d=u.target;d.index!==null&&t.remove(d.index);for(const m in d.attributes)t.remove(d.attributes[m]);d.removeEventListener("dispose",a),delete r[d.id];const f=s.get(d);f&&(t.remove(f),s.delete(d)),n.releaseStatesOfGeometry(d),d.isInstancedBufferGeometry===!0&&delete d._maxInstanceCount,e.memory.geometries--}function o(u,d){return r[d.id]===!0||(d.addEventListener("dispose",a),r[d.id]=!0,e.memory.geometries++),d}function c(u){const d=u.attributes;for(const f in d)t.update(d[f],i.ARRAY_BUFFER)}function l(u){const d=[],f=u.index,m=u.attributes.position;let x=0;if(f!==null){const E=f.array;x=f.version;for(let b=0,M=E.length;b<M;b+=3){const T=E[b+0],w=E[b+1],A=E[b+2];d.push(T,w,w,A,A,T)}}else if(m!==void 0){const E=m.array;x=m.version;for(let b=0,M=E.length/3-1;b<M;b+=3){const T=b+0,w=b+1,A=b+2;d.push(T,w,w,A,A,T)}}else return;const g=new(Zh(d)?eu:tu)(d,1);g.version=x;const p=s.get(u);p&&t.remove(p),s.set(u,g)}function h(u){const d=s.get(u);if(d){const f=u.index;f!==null&&d.version<f.version&&l(u)}else l(u);return s.get(u)}return{get:o,update:c,getWireframeAttribute:h}}function Mm(i,t,e){let n;function r(d){n=d}let s,a;function o(d){s=d.type,a=d.bytesPerElement}function c(d,f){i.drawElements(n,f,s,d*a),e.update(f,n,1)}function l(d,f,m){m!==0&&(i.drawElementsInstanced(n,f,s,d*a,m),e.update(f,n,m))}function h(d,f,m){if(m===0)return;t.get("WEBGL_multi_draw").multiDrawElementsWEBGL(n,f,0,s,d,0,m);let g=0;for(let p=0;p<m;p++)g+=f[p];e.update(g,n,1)}function u(d,f,m,x){if(m===0)return;const g=t.get("WEBGL_multi_draw");if(g===null)for(let p=0;p<d.length;p++)l(d[p]/a,f[p],x[p]);else{g.multiDrawElementsInstancedWEBGL(n,f,0,s,d,0,x,0,m);let p=0;for(let E=0;E<m;E++)p+=f[E]*x[E];e.update(p,n,1)}}this.setMode=r,this.setIndex=o,this.render=c,this.renderInstances=l,this.renderMultiDraw=h,this.renderMultiDrawInstances=u}function bm(i){const t={geometries:0,textures:0},e={frame:0,calls:0,triangles:0,points:0,lines:0};function n(s,a,o){switch(e.calls++,a){case i.TRIANGLES:e.triangles+=o*(s/3);break;case i.LINES:e.lines+=o*(s/2);break;case i.LINE_STRIP:e.lines+=o*(s-1);break;case i.LINE_LOOP:e.lines+=o*s;break;case i.POINTS:e.points+=o*s;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",a);break}}function r(){e.calls=0,e.triangles=0,e.points=0,e.lines=0}return{memory:t,render:e,programs:null,autoReset:!0,reset:r,update:n}}function Sm(i,t,e){const n=new WeakMap,r=new le;function s(a,o,c){const l=a.morphTargetInfluences,h=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,u=h!==void 0?h.length:0;let d=n.get(o);if(d===void 0||d.count!==u){let v=function(){A.dispose(),n.delete(o),o.removeEventListener("dispose",v)};d!==void 0&&d.texture.dispose();const f=o.morphAttributes.position!==void 0,m=o.morphAttributes.normal!==void 0,x=o.morphAttributes.color!==void 0,g=o.morphAttributes.position||[],p=o.morphAttributes.normal||[],E=o.morphAttributes.color||[];let b=0;f===!0&&(b=1),m===!0&&(b=2),x===!0&&(b=3);let M=o.attributes.position.count*b,T=1;M>t.maxTextureSize&&(T=Math.ceil(M/t.maxTextureSize),M=t.maxTextureSize);const w=new Float32Array(M*T*4*u),A=new vc(w,M,T,u);A.type=kn,A.needsUpdate=!0;const R=b*4;for(let _=0;_<u;_++){const S=g[_],y=p[_],D=E[_],I=M*T*4*_;for(let U=0;U<S.count;U++){const H=U*R;f===!0&&(r.fromBufferAttribute(S,U),w[I+H+0]=r.x,w[I+H+1]=r.y,w[I+H+2]=r.z,w[I+H+3]=0),m===!0&&(r.fromBufferAttribute(y,U),w[I+H+4]=r.x,w[I+H+5]=r.y,w[I+H+6]=r.z,w[I+H+7]=0),x===!0&&(r.fromBufferAttribute(D,U),w[I+H+8]=r.x,w[I+H+9]=r.y,w[I+H+10]=r.z,w[I+H+11]=D.itemSize===4?r.w:1)}}d={count:u,texture:A,size:new Rt(M,T)},n.set(o,d),o.addEventListener("dispose",v)}if(a.isInstancedMesh===!0&&a.morphTexture!==null)c.getUniforms().setValue(i,"morphTexture",a.morphTexture,e);else{let f=0;for(let x=0;x<l.length;x++)f+=l[x];const m=o.morphTargetsRelative?1:1-f;c.getUniforms().setValue(i,"morphTargetBaseInfluence",m),c.getUniforms().setValue(i,"morphTargetInfluences",l)}c.getUniforms().setValue(i,"morphTargetsTexture",d.texture,e),c.getUniforms().setValue(i,"morphTargetsTextureSize",d.size)}return{update:s}}function ym(i,t,e,n){let r=new WeakMap;function s(c){const l=n.render.frame,h=c.geometry,u=t.get(c,h);if(r.get(u)!==l&&(t.update(u),r.set(u,l)),c.isInstancedMesh&&(c.hasEventListener("dispose",o)===!1&&c.addEventListener("dispose",o),r.get(c)!==l&&(e.update(c.instanceMatrix,i.ARRAY_BUFFER),c.instanceColor!==null&&e.update(c.instanceColor,i.ARRAY_BUFFER),r.set(c,l))),c.isSkinnedMesh){const d=c.skeleton;r.get(d)!==l&&(d.update(),r.set(d,l))}return u}function a(){r=new WeakMap}function o(c){const l=c.target;l.removeEventListener("dispose",o),e.remove(l.instanceMatrix),l.instanceColor!==null&&e.remove(l.instanceColor)}return{update:s,dispose:a}}const pu=new Fe,Fl=new cu(1,1),mu=new vc,gu=new Pd,vu=new ru,Ol=[],Bl=[],kl=new Float32Array(16),Hl=new Float32Array(9),zl=new Float32Array(4);function Nr(i,t,e){const n=i[0];if(n<=0||n>0)return i;const r=t*e;let s=Ol[r];if(s===void 0&&(s=new Float32Array(r),Ol[r]=s),t!==0){n.toArray(s,0);for(let a=1,o=0;a!==t;++a)o+=e,i[a].toArray(s,o)}return s}function Ce(i,t){if(i.length!==t.length)return!1;for(let e=0,n=i.length;e<n;e++)if(i[e]!==t[e])return!1;return!0}function Le(i,t){for(let e=0,n=t.length;e<n;e++)i[e]=t[e]}function da(i,t){let e=Bl[t];e===void 0&&(e=new Int32Array(t),Bl[t]=e);for(let n=0;n!==t;++n)e[n]=i.allocateTextureUnit();return e}function Em(i,t){const e=this.cache;e[0]!==t&&(i.uniform1f(this.addr,t),e[0]=t)}function wm(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2f(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Ce(e,t))return;i.uniform2fv(this.addr,t),Le(e,t)}}function Tm(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3f(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else if(t.r!==void 0)(e[0]!==t.r||e[1]!==t.g||e[2]!==t.b)&&(i.uniform3f(this.addr,t.r,t.g,t.b),e[0]=t.r,e[1]=t.g,e[2]=t.b);else{if(Ce(e,t))return;i.uniform3fv(this.addr,t),Le(e,t)}}function Am(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4f(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Ce(e,t))return;i.uniform4fv(this.addr,t),Le(e,t)}}function Rm(i,t){const e=this.cache,n=t.elements;if(n===void 0){if(Ce(e,t))return;i.uniformMatrix2fv(this.addr,!1,t),Le(e,t)}else{if(Ce(e,n))return;zl.set(n),i.uniformMatrix2fv(this.addr,!1,zl),Le(e,n)}}function Cm(i,t){const e=this.cache,n=t.elements;if(n===void 0){if(Ce(e,t))return;i.uniformMatrix3fv(this.addr,!1,t),Le(e,t)}else{if(Ce(e,n))return;Hl.set(n),i.uniformMatrix3fv(this.addr,!1,Hl),Le(e,n)}}function Lm(i,t){const e=this.cache,n=t.elements;if(n===void 0){if(Ce(e,t))return;i.uniformMatrix4fv(this.addr,!1,t),Le(e,t)}else{if(Ce(e,n))return;kl.set(n),i.uniformMatrix4fv(this.addr,!1,kl),Le(e,n)}}function Pm(i,t){const e=this.cache;e[0]!==t&&(i.uniform1i(this.addr,t),e[0]=t)}function Dm(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2i(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Ce(e,t))return;i.uniform2iv(this.addr,t),Le(e,t)}}function Im(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3i(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(Ce(e,t))return;i.uniform3iv(this.addr,t),Le(e,t)}}function Um(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4i(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Ce(e,t))return;i.uniform4iv(this.addr,t),Le(e,t)}}function Nm(i,t){const e=this.cache;e[0]!==t&&(i.uniform1ui(this.addr,t),e[0]=t)}function Fm(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2ui(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Ce(e,t))return;i.uniform2uiv(this.addr,t),Le(e,t)}}function Om(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3ui(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(Ce(e,t))return;i.uniform3uiv(this.addr,t),Le(e,t)}}function Bm(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4ui(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Ce(e,t))return;i.uniform4uiv(this.addr,t),Le(e,t)}}function km(i,t,e){const n=this.cache,r=e.allocateTextureUnit();n[0]!==r&&(i.uniform1i(this.addr,r),n[0]=r);let s;this.type===i.SAMPLER_2D_SHADOW?(Fl.compareFunction=jh,s=Fl):s=pu,e.setTexture2D(t||s,r)}function Hm(i,t,e){const n=this.cache,r=e.allocateTextureUnit();n[0]!==r&&(i.uniform1i(this.addr,r),n[0]=r),e.setTexture3D(t||gu,r)}function zm(i,t,e){const n=this.cache,r=e.allocateTextureUnit();n[0]!==r&&(i.uniform1i(this.addr,r),n[0]=r),e.setTextureCube(t||vu,r)}function Vm(i,t,e){const n=this.cache,r=e.allocateTextureUnit();n[0]!==r&&(i.uniform1i(this.addr,r),n[0]=r),e.setTexture2DArray(t||mu,r)}function Gm(i){switch(i){case 5126:return Em;case 35664:return wm;case 35665:return Tm;case 35666:return Am;case 35674:return Rm;case 35675:return Cm;case 35676:return Lm;case 5124:case 35670:return Pm;case 35667:case 35671:return Dm;case 35668:case 35672:return Im;case 35669:case 35673:return Um;case 5125:return Nm;case 36294:return Fm;case 36295:return Om;case 36296:return Bm;case 35678:case 36198:case 36298:case 36306:case 35682:return km;case 35679:case 36299:case 36307:return Hm;case 35680:case 36300:case 36308:case 36293:return zm;case 36289:case 36303:case 36311:case 36292:return Vm}}function Wm(i,t){i.uniform1fv(this.addr,t)}function Xm(i,t){const e=Nr(t,this.size,2);i.uniform2fv(this.addr,e)}function qm(i,t){const e=Nr(t,this.size,3);i.uniform3fv(this.addr,e)}function Ym(i,t){const e=Nr(t,this.size,4);i.uniform4fv(this.addr,e)}function $m(i,t){const e=Nr(t,this.size,4);i.uniformMatrix2fv(this.addr,!1,e)}function jm(i,t){const e=Nr(t,this.size,9);i.uniformMatrix3fv(this.addr,!1,e)}function Zm(i,t){const e=Nr(t,this.size,16);i.uniformMatrix4fv(this.addr,!1,e)}function Km(i,t){i.uniform1iv(this.addr,t)}function Jm(i,t){i.uniform2iv(this.addr,t)}function Qm(i,t){i.uniform3iv(this.addr,t)}function tg(i,t){i.uniform4iv(this.addr,t)}function eg(i,t){i.uniform1uiv(this.addr,t)}function ng(i,t){i.uniform2uiv(this.addr,t)}function ig(i,t){i.uniform3uiv(this.addr,t)}function rg(i,t){i.uniform4uiv(this.addr,t)}function sg(i,t,e){const n=this.cache,r=t.length,s=da(e,r);Ce(n,s)||(i.uniform1iv(this.addr,s),Le(n,s));for(let a=0;a!==r;++a)e.setTexture2D(t[a]||pu,s[a])}function ag(i,t,e){const n=this.cache,r=t.length,s=da(e,r);Ce(n,s)||(i.uniform1iv(this.addr,s),Le(n,s));for(let a=0;a!==r;++a)e.setTexture3D(t[a]||gu,s[a])}function og(i,t,e){const n=this.cache,r=t.length,s=da(e,r);Ce(n,s)||(i.uniform1iv(this.addr,s),Le(n,s));for(let a=0;a!==r;++a)e.setTextureCube(t[a]||vu,s[a])}function cg(i,t,e){const n=this.cache,r=t.length,s=da(e,r);Ce(n,s)||(i.uniform1iv(this.addr,s),Le(n,s));for(let a=0;a!==r;++a)e.setTexture2DArray(t[a]||mu,s[a])}function lg(i){switch(i){case 5126:return Wm;case 35664:return Xm;case 35665:return qm;case 35666:return Ym;case 35674:return $m;case 35675:return jm;case 35676:return Zm;case 5124:case 35670:return Km;case 35667:case 35671:return Jm;case 35668:case 35672:return Qm;case 35669:case 35673:return tg;case 5125:return eg;case 36294:return ng;case 36295:return ig;case 36296:return rg;case 35678:case 36198:case 36298:case 36306:case 35682:return sg;case 35679:case 36299:case 36307:return ag;case 35680:case 36300:case 36308:case 36293:return og;case 36289:case 36303:case 36311:case 36292:return cg}}class hg{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.setValue=Gm(e.type)}}class ug{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.size=e.size,this.setValue=lg(e.type)}}class fg{constructor(t){this.id=t,this.seq=[],this.map={}}setValue(t,e,n){const r=this.seq;for(let s=0,a=r.length;s!==a;++s){const o=r[s];o.setValue(t,e[o.id],n)}}}const Ja=/(\w+)(\])?(\[|\.)?/g;function Vl(i,t){i.seq.push(t),i.map[t.id]=t}function dg(i,t,e){const n=i.name,r=n.length;for(Ja.lastIndex=0;;){const s=Ja.exec(n),a=Ja.lastIndex;let o=s[1];const c=s[2]==="]",l=s[3];if(c&&(o=o|0),l===void 0||l==="["&&a+2===r){Vl(e,l===void 0?new hg(o,i,t):new ug(o,i,t));break}else{let u=e.map[o];u===void 0&&(u=new fg(o),Vl(e,u)),e=u}}}class ea{constructor(t,e){this.seq=[],this.map={};const n=t.getProgramParameter(e,t.ACTIVE_UNIFORMS);for(let r=0;r<n;++r){const s=t.getActiveUniform(e,r),a=t.getUniformLocation(e,s.name);dg(s,a,this)}}setValue(t,e,n,r){const s=this.map[e];s!==void 0&&s.setValue(t,n,r)}setOptional(t,e,n){const r=e[n];r!==void 0&&this.setValue(t,n,r)}static upload(t,e,n,r){for(let s=0,a=e.length;s!==a;++s){const o=e[s],c=n[o.id];c.needsUpdate!==!1&&o.setValue(t,c.value,r)}}static seqWithValue(t,e){const n=[];for(let r=0,s=t.length;r!==s;++r){const a=t[r];a.id in e&&n.push(a)}return n}}function Gl(i,t,e){const n=i.createShader(t);return i.shaderSource(n,e),i.compileShader(n),n}const pg=37297;let mg=0;function gg(i,t){const e=i.split(`
`),n=[],r=Math.max(t-6,0),s=Math.min(t+6,e.length);for(let a=r;a<s;a++){const o=a+1;n.push(`${o===t?">":" "} ${o}: ${e[a]}`)}return n.join(`
`)}const Wl=new Zt;function vg(i){re._getMatrix(Wl,re.workingColorSpace,i);const t=`mat3( ${Wl.elements.map(e=>e.toFixed(4))} )`;switch(re.getTransfer(i)){case sa:return[t,"LinearTransferOETF"];case ce:return[t,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space: ",i),[t,"LinearTransferOETF"]}}function Xl(i,t,e){const n=i.getShaderParameter(t,i.COMPILE_STATUS),s=(i.getShaderInfoLog(t)||"").trim();if(n&&s==="")return"";const a=/ERROR: 0:(\d+)/.exec(s);if(a){const o=parseInt(a[1]);return e.toUpperCase()+`

`+s+`

`+gg(i.getShaderSource(t),o)}else return s}function _g(i,t){const e=vg(t);return[`vec4 ${i}( vec4 value ) {`,`	return ${e[1]}( vec4( value.rgb * ${e[0]}, value.a ) );`,"}"].join(`
`)}function xg(i,t){let e;switch(t){case Vf:e="Linear";break;case Gf:e="Reinhard";break;case Wf:e="Cineon";break;case Xf:e="ACESFilmic";break;case Yf:e="AgX";break;case Bh:e="Neutral";break;case qf:e="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",t),e="Linear"}return"vec3 "+i+"( vec3 color ) { return "+e+"ToneMapping( color ); }"}const Hs=new O;function Mg(){re.getLuminanceCoefficients(Hs);const i=Hs.x.toFixed(4),t=Hs.y.toFixed(4),e=Hs.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${i}, ${t}, ${e} );`,"	return dot( weights, rgb );","}"].join(`
`)}function bg(i){return[i.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",i.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(qr).join(`
`)}function Sg(i){const t=[];for(const e in i){const n=i[e];n!==!1&&t.push("#define "+e+" "+n)}return t.join(`
`)}function yg(i,t){const e={},n=i.getProgramParameter(t,i.ACTIVE_ATTRIBUTES);for(let r=0;r<n;r++){const s=i.getActiveAttrib(t,r),a=s.name;let o=1;s.type===i.FLOAT_MAT2&&(o=2),s.type===i.FLOAT_MAT3&&(o=3),s.type===i.FLOAT_MAT4&&(o=4),e[a]={type:s.type,location:i.getAttribLocation(t,a),locationSize:o}}return e}function qr(i){return i!==""}function ql(i,t){const e=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return i.replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,e).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows)}function Yl(i,t){return i.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}const Eg=/^[ \t]*#include +<([\w\d./]+)>/gm;function tc(i){return i.replace(Eg,Tg)}const wg=new Map;function Tg(i,t){let e=Kt[t];if(e===void 0){const n=wg.get(t);if(n!==void 0)e=Kt[n],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',t,n);else throw new Error("Can not resolve #include <"+t+">")}return tc(e)}const Ag=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function $l(i){return i.replace(Ag,Rg)}function Rg(i,t,e,n){let r="";for(let s=parseInt(t);s<parseInt(e);s++)r+=n.replace(/\[\s*i\s*\]/g,"[ "+s+" ]").replace(/UNROLLED_LOOP_INDEX/g,s);return r}function jl(i){let t=`precision ${i.precision} float;
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
#define LOW_PRECISION`),t}function Cg(i){let t="SHADOWMAP_TYPE_BASIC";return i.shadowMapType===Nh?t="SHADOWMAP_TYPE_PCF":i.shadowMapType===Fh?t="SHADOWMAP_TYPE_PCF_SOFT":i.shadowMapType===Zn&&(t="SHADOWMAP_TYPE_VSM"),t}function Lg(i){let t="ENVMAP_TYPE_CUBE";if(i.envMap)switch(i.envMapMode){case Er:case wr:t="ENVMAP_TYPE_CUBE";break;case ua:t="ENVMAP_TYPE_CUBE_UV";break}return t}function Pg(i){let t="ENVMAP_MODE_REFLECTION";if(i.envMap)switch(i.envMapMode){case wr:t="ENVMAP_MODE_REFRACTION";break}return t}function Dg(i){let t="ENVMAP_BLENDING_NONE";if(i.envMap)switch(i.combine){case Oh:t="ENVMAP_BLENDING_MULTIPLY";break;case Hf:t="ENVMAP_BLENDING_MIX";break;case zf:t="ENVMAP_BLENDING_ADD";break}return t}function Ig(i){const t=i.envMapCubeUVHeight;if(t===null)return null;const e=Math.log2(t)-2,n=1/t;return{texelWidth:1/(3*Math.max(Math.pow(2,e),112)),texelHeight:n,maxMip:e}}function Ug(i,t,e,n){const r=i.getContext(),s=e.defines;let a=e.vertexShader,o=e.fragmentShader;const c=Cg(e),l=Lg(e),h=Pg(e),u=Dg(e),d=Ig(e),f=bg(e),m=Sg(s),x=r.createProgram();let g,p,E=e.glslVersion?"#version "+e.glslVersion+`
`:"";e.isRawShaderMaterial?(g=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,m].filter(qr).join(`
`),g.length>0&&(g+=`
`),p=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,m].filter(qr).join(`
`),p.length>0&&(p+=`
`)):(g=[jl(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,m,e.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",e.batching?"#define USE_BATCHING":"",e.batchingColor?"#define USE_BATCHING_COLOR":"",e.instancing?"#define USE_INSTANCING":"",e.instancingColor?"#define USE_INSTANCING_COLOR":"",e.instancingMorph?"#define USE_INSTANCING_MORPH":"",e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.map?"#define USE_MAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+h:"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.displacementMap?"#define USE_DISPLACEMENTMAP":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.mapUv?"#define MAP_UV "+e.mapUv:"",e.alphaMapUv?"#define ALPHAMAP_UV "+e.alphaMapUv:"",e.lightMapUv?"#define LIGHTMAP_UV "+e.lightMapUv:"",e.aoMapUv?"#define AOMAP_UV "+e.aoMapUv:"",e.emissiveMapUv?"#define EMISSIVEMAP_UV "+e.emissiveMapUv:"",e.bumpMapUv?"#define BUMPMAP_UV "+e.bumpMapUv:"",e.normalMapUv?"#define NORMALMAP_UV "+e.normalMapUv:"",e.displacementMapUv?"#define DISPLACEMENTMAP_UV "+e.displacementMapUv:"",e.metalnessMapUv?"#define METALNESSMAP_UV "+e.metalnessMapUv:"",e.roughnessMapUv?"#define ROUGHNESSMAP_UV "+e.roughnessMapUv:"",e.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+e.anisotropyMapUv:"",e.clearcoatMapUv?"#define CLEARCOATMAP_UV "+e.clearcoatMapUv:"",e.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+e.clearcoatNormalMapUv:"",e.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+e.clearcoatRoughnessMapUv:"",e.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+e.iridescenceMapUv:"",e.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+e.iridescenceThicknessMapUv:"",e.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+e.sheenColorMapUv:"",e.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+e.sheenRoughnessMapUv:"",e.specularMapUv?"#define SPECULARMAP_UV "+e.specularMapUv:"",e.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+e.specularColorMapUv:"",e.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+e.specularIntensityMapUv:"",e.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+e.transmissionMapUv:"",e.thicknessMapUv?"#define THICKNESSMAP_UV "+e.thicknessMapUv:"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.flatShading?"#define FLAT_SHADED":"",e.skinning?"#define USE_SKINNING":"",e.morphTargets?"#define USE_MORPHTARGETS":"",e.morphNormals&&e.flatShading===!1?"#define USE_MORPHNORMALS":"",e.morphColors?"#define USE_MORPHCOLORS":"",e.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+e.morphTextureStride:"",e.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+e.morphTargetsCount:"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+c:"",e.sizeAttenuation?"#define USE_SIZEATTENUATION":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",e.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(qr).join(`
`),p=[jl(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,m,e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",e.map?"#define USE_MAP":"",e.matcap?"#define USE_MATCAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+l:"",e.envMap?"#define "+h:"",e.envMap?"#define "+u:"",d?"#define CUBEUV_TEXEL_WIDTH "+d.texelWidth:"",d?"#define CUBEUV_TEXEL_HEIGHT "+d.texelHeight:"",d?"#define CUBEUV_MAX_MIP "+d.maxMip+".0":"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoat?"#define USE_CLEARCOAT":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.dispersion?"#define USE_DISPERSION":"",e.iridescence?"#define USE_IRIDESCENCE":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaTest?"#define USE_ALPHATEST":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.sheen?"#define USE_SHEEN":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors||e.instancingColor||e.batchingColor?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.gradientMap?"#define USE_GRADIENTMAP":"",e.flatShading?"#define FLAT_SHADED":"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+c:"",e.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",e.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",e.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",e.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",e.toneMapping!==_i?"#define TONE_MAPPING":"",e.toneMapping!==_i?Kt.tonemapping_pars_fragment:"",e.toneMapping!==_i?xg("toneMapping",e.toneMapping):"",e.dithering?"#define DITHERING":"",e.opaque?"#define OPAQUE":"",Kt.colorspace_pars_fragment,_g("linearToOutputTexel",e.outputColorSpace),Mg(),e.useDepthPacking?"#define DEPTH_PACKING "+e.depthPacking:"",`
`].filter(qr).join(`
`)),a=tc(a),a=ql(a,e),a=Yl(a,e),o=tc(o),o=ql(o,e),o=Yl(o,e),a=$l(a),o=$l(o),e.isRawShaderMaterial!==!0&&(E=`#version 300 es
`,g=[f,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+g,p=["#define varying in",e.glslVersion===tl?"":"layout(location = 0) out highp vec4 pc_fragColor;",e.glslVersion===tl?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+p);const b=E+g+a,M=E+p+o,T=Gl(r,r.VERTEX_SHADER,b),w=Gl(r,r.FRAGMENT_SHADER,M);r.attachShader(x,T),r.attachShader(x,w),e.index0AttributeName!==void 0?r.bindAttribLocation(x,0,e.index0AttributeName):e.morphTargets===!0&&r.bindAttribLocation(x,0,"position"),r.linkProgram(x);function A(S){if(i.debug.checkShaderErrors){const y=r.getProgramInfoLog(x)||"",D=r.getShaderInfoLog(T)||"",I=r.getShaderInfoLog(w)||"",U=y.trim(),H=D.trim(),$=I.trim();let V=!0,tt=!0;if(r.getProgramParameter(x,r.LINK_STATUS)===!1)if(V=!1,typeof i.debug.onShaderError=="function")i.debug.onShaderError(r,x,T,w);else{const st=Xl(r,T,"vertex"),ct=Xl(r,w,"fragment");console.error("THREE.WebGLProgram: Shader Error "+r.getError()+" - VALIDATE_STATUS "+r.getProgramParameter(x,r.VALIDATE_STATUS)+`

Material Name: `+S.name+`
Material Type: `+S.type+`

Program Info Log: `+U+`
`+st+`
`+ct)}else U!==""?console.warn("THREE.WebGLProgram: Program Info Log:",U):(H===""||$==="")&&(tt=!1);tt&&(S.diagnostics={runnable:V,programLog:U,vertexShader:{log:H,prefix:g},fragmentShader:{log:$,prefix:p}})}r.deleteShader(T),r.deleteShader(w),R=new ea(r,x),v=yg(r,x)}let R;this.getUniforms=function(){return R===void 0&&A(this),R};let v;this.getAttributes=function(){return v===void 0&&A(this),v};let _=e.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return _===!1&&(_=r.getProgramParameter(x,pg)),_},this.destroy=function(){n.releaseStatesOfProgram(this),r.deleteProgram(x),this.program=void 0},this.type=e.shaderType,this.name=e.shaderName,this.id=mg++,this.cacheKey=t,this.usedTimes=1,this.program=x,this.vertexShader=T,this.fragmentShader=w,this}let Ng=0;class Fg{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(t){const e=t.vertexShader,n=t.fragmentShader,r=this._getShaderStage(e),s=this._getShaderStage(n),a=this._getShaderCacheForMaterial(t);return a.has(r)===!1&&(a.add(r),r.usedTimes++),a.has(s)===!1&&(a.add(s),s.usedTimes++),this}remove(t){const e=this.materialCache.get(t);for(const n of e)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(t),this}getVertexShaderID(t){return this._getShaderStage(t.vertexShader).id}getFragmentShaderID(t){return this._getShaderStage(t.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(t){const e=this.materialCache;let n=e.get(t);return n===void 0&&(n=new Set,e.set(t,n)),n}_getShaderStage(t){const e=this.shaderCache;let n=e.get(t);return n===void 0&&(n=new Og(t),e.set(t,n)),n}}class Og{constructor(t){this.id=Ng++,this.code=t,this.usedTimes=0}}function Bg(i,t,e,n,r,s,a){const o=new Jh,c=new Fg,l=new Set,h=[],u=r.logarithmicDepthBuffer,d=r.vertexTextures;let f=r.precision;const m={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function x(v){return l.add(v),v===0?"uv":`uv${v}`}function g(v,_,S,y,D){const I=y.fog,U=D.geometry,H=v.isMeshStandardMaterial?y.environment:null,$=(v.isMeshStandardMaterial?e:t).get(v.envMap||H),V=$&&$.mapping===ua?$.image.height:null,tt=m[v.type];v.precision!==null&&(f=r.getMaxPrecision(v.precision),f!==v.precision&&console.warn("THREE.WebGLProgram.getParameters:",v.precision,"not supported, using",f,"instead."));const st=U.morphAttributes.position||U.morphAttributes.normal||U.morphAttributes.color,ct=st!==void 0?st.length:0;let ft=0;U.morphAttributes.position!==void 0&&(ft=1),U.morphAttributes.normal!==void 0&&(ft=2),U.morphAttributes.color!==void 0&&(ft=3);let Ct,zt,it,W;if(tt){const se=Fn[tt];Ct=se.vertexShader,zt=se.fragmentShader}else Ct=v.vertexShader,zt=v.fragmentShader,c.update(v),it=c.getVertexShaderID(v),W=c.getFragmentShaderID(v);const Z=i.getRenderTarget(),F=i.state.buffers.depth.getReversed(),B=D.isInstancedMesh===!0,k=D.isBatchedMesh===!0,X=!!v.map,K=!!v.matcap,P=!!$,ht=!!v.aoMap,at=!!v.lightMap,_t=!!v.bumpMap,gt=!!v.normalMap,vt=!!v.displacementMap,xt=!!v.emissiveMap,Nt=!!v.metalnessMap,Se=!!v.roughnessMap,me=v.anisotropy>0,N=v.clearcoat>0,C=v.dispersion>0,j=v.iridescence>0,rt=v.sheen>0,lt=v.transmission>0,nt=me&&!!v.anisotropyMap,kt=N&&!!v.clearcoatMap,Mt=N&&!!v.clearcoatNormalMap,Ft=N&&!!v.clearcoatRoughnessMap,Ot=j&&!!v.iridescenceMap,pt=j&&!!v.iridescenceThicknessMap,At=rt&&!!v.sheenColorMap,qt=rt&&!!v.sheenRoughnessMap,Bt=!!v.specularMap,wt=!!v.specularColorMap,jt=!!v.specularIntensityMap,G=lt&&!!v.transmissionMap,mt=lt&&!!v.thicknessMap,bt=!!v.gradientMap,Pt=!!v.alphaMap,ut=v.alphaTest>0,ot=!!v.alphaHash,It=!!v.extensions;let $t=_i;v.toneMapped&&(Z===null||Z.isXRRenderTarget===!0)&&($t=i.toneMapping);const fe={shaderID:tt,shaderType:v.type,shaderName:v.name,vertexShader:Ct,fragmentShader:zt,defines:v.defines,customVertexShaderID:it,customFragmentShaderID:W,isRawShaderMaterial:v.isRawShaderMaterial===!0,glslVersion:v.glslVersion,precision:f,batching:k,batchingColor:k&&D._colorsTexture!==null,instancing:B,instancingColor:B&&D.instanceColor!==null,instancingMorph:B&&D.morphTexture!==null,supportsVertexTextures:d,outputColorSpace:Z===null?i.outputColorSpace:Z.isXRRenderTarget===!0?Z.texture.colorSpace:Gi,alphaToCoverage:!!v.alphaToCoverage,map:X,matcap:K,envMap:P,envMapMode:P&&$.mapping,envMapCubeUVHeight:V,aoMap:ht,lightMap:at,bumpMap:_t,normalMap:gt,displacementMap:d&&vt,emissiveMap:xt,normalMapObjectSpace:gt&&v.normalMapType===Jf,normalMapTangentSpace:gt&&v.normalMapType===$h,metalnessMap:Nt,roughnessMap:Se,anisotropy:me,anisotropyMap:nt,clearcoat:N,clearcoatMap:kt,clearcoatNormalMap:Mt,clearcoatRoughnessMap:Ft,dispersion:C,iridescence:j,iridescenceMap:Ot,iridescenceThicknessMap:pt,sheen:rt,sheenColorMap:At,sheenRoughnessMap:qt,specularMap:Bt,specularColorMap:wt,specularIntensityMap:jt,transmission:lt,transmissionMap:G,thicknessMap:mt,gradientMap:bt,opaque:v.transparent===!1&&v.blending===Mr&&v.alphaToCoverage===!1,alphaMap:Pt,alphaTest:ut,alphaHash:ot,combine:v.combine,mapUv:X&&x(v.map.channel),aoMapUv:ht&&x(v.aoMap.channel),lightMapUv:at&&x(v.lightMap.channel),bumpMapUv:_t&&x(v.bumpMap.channel),normalMapUv:gt&&x(v.normalMap.channel),displacementMapUv:vt&&x(v.displacementMap.channel),emissiveMapUv:xt&&x(v.emissiveMap.channel),metalnessMapUv:Nt&&x(v.metalnessMap.channel),roughnessMapUv:Se&&x(v.roughnessMap.channel),anisotropyMapUv:nt&&x(v.anisotropyMap.channel),clearcoatMapUv:kt&&x(v.clearcoatMap.channel),clearcoatNormalMapUv:Mt&&x(v.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:Ft&&x(v.clearcoatRoughnessMap.channel),iridescenceMapUv:Ot&&x(v.iridescenceMap.channel),iridescenceThicknessMapUv:pt&&x(v.iridescenceThicknessMap.channel),sheenColorMapUv:At&&x(v.sheenColorMap.channel),sheenRoughnessMapUv:qt&&x(v.sheenRoughnessMap.channel),specularMapUv:Bt&&x(v.specularMap.channel),specularColorMapUv:wt&&x(v.specularColorMap.channel),specularIntensityMapUv:jt&&x(v.specularIntensityMap.channel),transmissionMapUv:G&&x(v.transmissionMap.channel),thicknessMapUv:mt&&x(v.thicknessMap.channel),alphaMapUv:Pt&&x(v.alphaMap.channel),vertexTangents:!!U.attributes.tangent&&(gt||me),vertexColors:v.vertexColors,vertexAlphas:v.vertexColors===!0&&!!U.attributes.color&&U.attributes.color.itemSize===4,pointsUvs:D.isPoints===!0&&!!U.attributes.uv&&(X||Pt),fog:!!I,useFog:v.fog===!0,fogExp2:!!I&&I.isFogExp2,flatShading:v.flatShading===!0&&v.wireframe===!1,sizeAttenuation:v.sizeAttenuation===!0,logarithmicDepthBuffer:u,reversedDepthBuffer:F,skinning:D.isSkinnedMesh===!0,morphTargets:U.morphAttributes.position!==void 0,morphNormals:U.morphAttributes.normal!==void 0,morphColors:U.morphAttributes.color!==void 0,morphTargetsCount:ct,morphTextureStride:ft,numDirLights:_.directional.length,numPointLights:_.point.length,numSpotLights:_.spot.length,numSpotLightMaps:_.spotLightMap.length,numRectAreaLights:_.rectArea.length,numHemiLights:_.hemi.length,numDirLightShadows:_.directionalShadowMap.length,numPointLightShadows:_.pointShadowMap.length,numSpotLightShadows:_.spotShadowMap.length,numSpotLightShadowsWithMaps:_.numSpotLightShadowsWithMaps,numLightProbes:_.numLightProbes,numClippingPlanes:a.numPlanes,numClipIntersection:a.numIntersection,dithering:v.dithering,shadowMapEnabled:i.shadowMap.enabled&&S.length>0,shadowMapType:i.shadowMap.type,toneMapping:$t,decodeVideoTexture:X&&v.map.isVideoTexture===!0&&re.getTransfer(v.map.colorSpace)===ce,decodeVideoTextureEmissive:xt&&v.emissiveMap.isVideoTexture===!0&&re.getTransfer(v.emissiveMap.colorSpace)===ce,premultipliedAlpha:v.premultipliedAlpha,doubleSided:v.side===Sn,flipSided:v.side===Je,useDepthPacking:v.depthPacking>=0,depthPacking:v.depthPacking||0,index0AttributeName:v.index0AttributeName,extensionClipCullDistance:It&&v.extensions.clipCullDistance===!0&&n.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(It&&v.extensions.multiDraw===!0||k)&&n.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:n.has("KHR_parallel_shader_compile"),customProgramCacheKey:v.customProgramCacheKey()};return fe.vertexUv1s=l.has(1),fe.vertexUv2s=l.has(2),fe.vertexUv3s=l.has(3),l.clear(),fe}function p(v){const _=[];if(v.shaderID?_.push(v.shaderID):(_.push(v.customVertexShaderID),_.push(v.customFragmentShaderID)),v.defines!==void 0)for(const S in v.defines)_.push(S),_.push(v.defines[S]);return v.isRawShaderMaterial===!1&&(E(_,v),b(_,v),_.push(i.outputColorSpace)),_.push(v.customProgramCacheKey),_.join()}function E(v,_){v.push(_.precision),v.push(_.outputColorSpace),v.push(_.envMapMode),v.push(_.envMapCubeUVHeight),v.push(_.mapUv),v.push(_.alphaMapUv),v.push(_.lightMapUv),v.push(_.aoMapUv),v.push(_.bumpMapUv),v.push(_.normalMapUv),v.push(_.displacementMapUv),v.push(_.emissiveMapUv),v.push(_.metalnessMapUv),v.push(_.roughnessMapUv),v.push(_.anisotropyMapUv),v.push(_.clearcoatMapUv),v.push(_.clearcoatNormalMapUv),v.push(_.clearcoatRoughnessMapUv),v.push(_.iridescenceMapUv),v.push(_.iridescenceThicknessMapUv),v.push(_.sheenColorMapUv),v.push(_.sheenRoughnessMapUv),v.push(_.specularMapUv),v.push(_.specularColorMapUv),v.push(_.specularIntensityMapUv),v.push(_.transmissionMapUv),v.push(_.thicknessMapUv),v.push(_.combine),v.push(_.fogExp2),v.push(_.sizeAttenuation),v.push(_.morphTargetsCount),v.push(_.morphAttributeCount),v.push(_.numDirLights),v.push(_.numPointLights),v.push(_.numSpotLights),v.push(_.numSpotLightMaps),v.push(_.numHemiLights),v.push(_.numRectAreaLights),v.push(_.numDirLightShadows),v.push(_.numPointLightShadows),v.push(_.numSpotLightShadows),v.push(_.numSpotLightShadowsWithMaps),v.push(_.numLightProbes),v.push(_.shadowMapType),v.push(_.toneMapping),v.push(_.numClippingPlanes),v.push(_.numClipIntersection),v.push(_.depthPacking)}function b(v,_){o.disableAll(),_.supportsVertexTextures&&o.enable(0),_.instancing&&o.enable(1),_.instancingColor&&o.enable(2),_.instancingMorph&&o.enable(3),_.matcap&&o.enable(4),_.envMap&&o.enable(5),_.normalMapObjectSpace&&o.enable(6),_.normalMapTangentSpace&&o.enable(7),_.clearcoat&&o.enable(8),_.iridescence&&o.enable(9),_.alphaTest&&o.enable(10),_.vertexColors&&o.enable(11),_.vertexAlphas&&o.enable(12),_.vertexUv1s&&o.enable(13),_.vertexUv2s&&o.enable(14),_.vertexUv3s&&o.enable(15),_.vertexTangents&&o.enable(16),_.anisotropy&&o.enable(17),_.alphaHash&&o.enable(18),_.batching&&o.enable(19),_.dispersion&&o.enable(20),_.batchingColor&&o.enable(21),_.gradientMap&&o.enable(22),v.push(o.mask),o.disableAll(),_.fog&&o.enable(0),_.useFog&&o.enable(1),_.flatShading&&o.enable(2),_.logarithmicDepthBuffer&&o.enable(3),_.reversedDepthBuffer&&o.enable(4),_.skinning&&o.enable(5),_.morphTargets&&o.enable(6),_.morphNormals&&o.enable(7),_.morphColors&&o.enable(8),_.premultipliedAlpha&&o.enable(9),_.shadowMapEnabled&&o.enable(10),_.doubleSided&&o.enable(11),_.flipSided&&o.enable(12),_.useDepthPacking&&o.enable(13),_.dithering&&o.enable(14),_.transmission&&o.enable(15),_.sheen&&o.enable(16),_.opaque&&o.enable(17),_.pointsUvs&&o.enable(18),_.decodeVideoTexture&&o.enable(19),_.decodeVideoTextureEmissive&&o.enable(20),_.alphaToCoverage&&o.enable(21),v.push(o.mask)}function M(v){const _=m[v.type];let S;if(_){const y=Fn[_];S=Yd.clone(y.uniforms)}else S=v.uniforms;return S}function T(v,_){let S;for(let y=0,D=h.length;y<D;y++){const I=h[y];if(I.cacheKey===_){S=I,++S.usedTimes;break}}return S===void 0&&(S=new Ug(i,_,v,s),h.push(S)),S}function w(v){if(--v.usedTimes===0){const _=h.indexOf(v);h[_]=h[h.length-1],h.pop(),v.destroy()}}function A(v){c.remove(v)}function R(){c.dispose()}return{getParameters:g,getProgramCacheKey:p,getUniforms:M,acquireProgram:T,releaseProgram:w,releaseShaderCache:A,programs:h,dispose:R}}function kg(){let i=new WeakMap;function t(a){return i.has(a)}function e(a){let o=i.get(a);return o===void 0&&(o={},i.set(a,o)),o}function n(a){i.delete(a)}function r(a,o,c){i.get(a)[o]=c}function s(){i=new WeakMap}return{has:t,get:e,remove:n,update:r,dispose:s}}function Hg(i,t){return i.groupOrder!==t.groupOrder?i.groupOrder-t.groupOrder:i.renderOrder!==t.renderOrder?i.renderOrder-t.renderOrder:i.material.id!==t.material.id?i.material.id-t.material.id:i.z!==t.z?i.z-t.z:i.id-t.id}function Zl(i,t){return i.groupOrder!==t.groupOrder?i.groupOrder-t.groupOrder:i.renderOrder!==t.renderOrder?i.renderOrder-t.renderOrder:i.z!==t.z?t.z-i.z:i.id-t.id}function Kl(){const i=[];let t=0;const e=[],n=[],r=[];function s(){t=0,e.length=0,n.length=0,r.length=0}function a(u,d,f,m,x,g){let p=i[t];return p===void 0?(p={id:u.id,object:u,geometry:d,material:f,groupOrder:m,renderOrder:u.renderOrder,z:x,group:g},i[t]=p):(p.id=u.id,p.object=u,p.geometry=d,p.material=f,p.groupOrder=m,p.renderOrder=u.renderOrder,p.z=x,p.group=g),t++,p}function o(u,d,f,m,x,g){const p=a(u,d,f,m,x,g);f.transmission>0?n.push(p):f.transparent===!0?r.push(p):e.push(p)}function c(u,d,f,m,x,g){const p=a(u,d,f,m,x,g);f.transmission>0?n.unshift(p):f.transparent===!0?r.unshift(p):e.unshift(p)}function l(u,d){e.length>1&&e.sort(u||Hg),n.length>1&&n.sort(d||Zl),r.length>1&&r.sort(d||Zl)}function h(){for(let u=t,d=i.length;u<d;u++){const f=i[u];if(f.id===null)break;f.id=null,f.object=null,f.geometry=null,f.material=null,f.group=null}}return{opaque:e,transmissive:n,transparent:r,init:s,push:o,unshift:c,finish:h,sort:l}}function zg(){let i=new WeakMap;function t(n,r){const s=i.get(n);let a;return s===void 0?(a=new Kl,i.set(n,[a])):r>=s.length?(a=new Kl,s.push(a)):a=s[r],a}function e(){i=new WeakMap}return{get:t,dispose:e}}function Vg(){const i={};return{get:function(t){if(i[t.id]!==void 0)return i[t.id];let e;switch(t.type){case"DirectionalLight":e={direction:new O,color:new Ht};break;case"SpotLight":e={position:new O,direction:new O,color:new Ht,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":e={position:new O,color:new Ht,distance:0,decay:0};break;case"HemisphereLight":e={direction:new O,skyColor:new Ht,groundColor:new Ht};break;case"RectAreaLight":e={color:new Ht,position:new O,halfWidth:new O,halfHeight:new O};break}return i[t.id]=e,e}}}function Gg(){const i={};return{get:function(t){if(i[t.id]!==void 0)return i[t.id];let e;switch(t.type){case"DirectionalLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Rt};break;case"SpotLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Rt};break;case"PointLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Rt,shadowCameraNear:1,shadowCameraFar:1e3};break}return i[t.id]=e,e}}}let Wg=0;function Xg(i,t){return(t.castShadow?2:0)-(i.castShadow?2:0)+(t.map?1:0)-(i.map?1:0)}function qg(i){const t=new Vg,e=Gg(),n={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let l=0;l<9;l++)n.probe.push(new O);const r=new O,s=new ne,a=new ne;function o(l){let h=0,u=0,d=0;for(let v=0;v<9;v++)n.probe[v].set(0,0,0);let f=0,m=0,x=0,g=0,p=0,E=0,b=0,M=0,T=0,w=0,A=0;l.sort(Xg);for(let v=0,_=l.length;v<_;v++){const S=l[v],y=S.color,D=S.intensity,I=S.distance,U=S.shadow&&S.shadow.map?S.shadow.map.texture:null;if(S.isAmbientLight)h+=y.r*D,u+=y.g*D,d+=y.b*D;else if(S.isLightProbe){for(let H=0;H<9;H++)n.probe[H].addScaledVector(S.sh.coefficients[H],D);A++}else if(S.isDirectionalLight){const H=t.get(S);if(H.color.copy(S.color).multiplyScalar(S.intensity),S.castShadow){const $=S.shadow,V=e.get(S);V.shadowIntensity=$.intensity,V.shadowBias=$.bias,V.shadowNormalBias=$.normalBias,V.shadowRadius=$.radius,V.shadowMapSize=$.mapSize,n.directionalShadow[f]=V,n.directionalShadowMap[f]=U,n.directionalShadowMatrix[f]=S.shadow.matrix,E++}n.directional[f]=H,f++}else if(S.isSpotLight){const H=t.get(S);H.position.setFromMatrixPosition(S.matrixWorld),H.color.copy(y).multiplyScalar(D),H.distance=I,H.coneCos=Math.cos(S.angle),H.penumbraCos=Math.cos(S.angle*(1-S.penumbra)),H.decay=S.decay,n.spot[x]=H;const $=S.shadow;if(S.map&&(n.spotLightMap[T]=S.map,T++,$.updateMatrices(S),S.castShadow&&w++),n.spotLightMatrix[x]=$.matrix,S.castShadow){const V=e.get(S);V.shadowIntensity=$.intensity,V.shadowBias=$.bias,V.shadowNormalBias=$.normalBias,V.shadowRadius=$.radius,V.shadowMapSize=$.mapSize,n.spotShadow[x]=V,n.spotShadowMap[x]=U,M++}x++}else if(S.isRectAreaLight){const H=t.get(S);H.color.copy(y).multiplyScalar(D),H.halfWidth.set(S.width*.5,0,0),H.halfHeight.set(0,S.height*.5,0),n.rectArea[g]=H,g++}else if(S.isPointLight){const H=t.get(S);if(H.color.copy(S.color).multiplyScalar(S.intensity),H.distance=S.distance,H.decay=S.decay,S.castShadow){const $=S.shadow,V=e.get(S);V.shadowIntensity=$.intensity,V.shadowBias=$.bias,V.shadowNormalBias=$.normalBias,V.shadowRadius=$.radius,V.shadowMapSize=$.mapSize,V.shadowCameraNear=$.camera.near,V.shadowCameraFar=$.camera.far,n.pointShadow[m]=V,n.pointShadowMap[m]=U,n.pointShadowMatrix[m]=S.shadow.matrix,b++}n.point[m]=H,m++}else if(S.isHemisphereLight){const H=t.get(S);H.skyColor.copy(S.color).multiplyScalar(D),H.groundColor.copy(S.groundColor).multiplyScalar(D),n.hemi[p]=H,p++}}g>0&&(i.has("OES_texture_float_linear")===!0?(n.rectAreaLTC1=Et.LTC_FLOAT_1,n.rectAreaLTC2=Et.LTC_FLOAT_2):(n.rectAreaLTC1=Et.LTC_HALF_1,n.rectAreaLTC2=Et.LTC_HALF_2)),n.ambient[0]=h,n.ambient[1]=u,n.ambient[2]=d;const R=n.hash;(R.directionalLength!==f||R.pointLength!==m||R.spotLength!==x||R.rectAreaLength!==g||R.hemiLength!==p||R.numDirectionalShadows!==E||R.numPointShadows!==b||R.numSpotShadows!==M||R.numSpotMaps!==T||R.numLightProbes!==A)&&(n.directional.length=f,n.spot.length=x,n.rectArea.length=g,n.point.length=m,n.hemi.length=p,n.directionalShadow.length=E,n.directionalShadowMap.length=E,n.pointShadow.length=b,n.pointShadowMap.length=b,n.spotShadow.length=M,n.spotShadowMap.length=M,n.directionalShadowMatrix.length=E,n.pointShadowMatrix.length=b,n.spotLightMatrix.length=M+T-w,n.spotLightMap.length=T,n.numSpotLightShadowsWithMaps=w,n.numLightProbes=A,R.directionalLength=f,R.pointLength=m,R.spotLength=x,R.rectAreaLength=g,R.hemiLength=p,R.numDirectionalShadows=E,R.numPointShadows=b,R.numSpotShadows=M,R.numSpotMaps=T,R.numLightProbes=A,n.version=Wg++)}function c(l,h){let u=0,d=0,f=0,m=0,x=0;const g=h.matrixWorldInverse;for(let p=0,E=l.length;p<E;p++){const b=l[p];if(b.isDirectionalLight){const M=n.directional[u];M.direction.setFromMatrixPosition(b.matrixWorld),r.setFromMatrixPosition(b.target.matrixWorld),M.direction.sub(r),M.direction.transformDirection(g),u++}else if(b.isSpotLight){const M=n.spot[f];M.position.setFromMatrixPosition(b.matrixWorld),M.position.applyMatrix4(g),M.direction.setFromMatrixPosition(b.matrixWorld),r.setFromMatrixPosition(b.target.matrixWorld),M.direction.sub(r),M.direction.transformDirection(g),f++}else if(b.isRectAreaLight){const M=n.rectArea[m];M.position.setFromMatrixPosition(b.matrixWorld),M.position.applyMatrix4(g),a.identity(),s.copy(b.matrixWorld),s.premultiply(g),a.extractRotation(s),M.halfWidth.set(b.width*.5,0,0),M.halfHeight.set(0,b.height*.5,0),M.halfWidth.applyMatrix4(a),M.halfHeight.applyMatrix4(a),m++}else if(b.isPointLight){const M=n.point[d];M.position.setFromMatrixPosition(b.matrixWorld),M.position.applyMatrix4(g),d++}else if(b.isHemisphereLight){const M=n.hemi[x];M.direction.setFromMatrixPosition(b.matrixWorld),M.direction.transformDirection(g),x++}}}return{setup:o,setupView:c,state:n}}function Jl(i){const t=new qg(i),e=[],n=[];function r(h){l.camera=h,e.length=0,n.length=0}function s(h){e.push(h)}function a(h){n.push(h)}function o(){t.setup(e)}function c(h){t.setupView(e,h)}const l={lightsArray:e,shadowsArray:n,camera:null,lights:t,transmissionRenderTarget:{}};return{init:r,state:l,setupLights:o,setupLightsView:c,pushLight:s,pushShadow:a}}function Yg(i){let t=new WeakMap;function e(r,s=0){const a=t.get(r);let o;return a===void 0?(o=new Jl(i),t.set(r,[o])):s>=a.length?(o=new Jl(i),a.push(o)):o=a[s],o}function n(){t=new WeakMap}return{get:e,dispose:n}}const $g=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,jg=`uniform sampler2D shadow_pass;
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
}`;function Zg(i,t,e){let n=new xc;const r=new Rt,s=new Rt,a=new le,o=new M0({depthPacking:Kf}),c=new b0,l={},h=e.maxTextureSize,u={[Mi]:Je,[Je]:Mi,[Sn]:Sn},d=new Ke({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new Rt},radius:{value:4}},vertexShader:$g,fragmentShader:jg}),f=d.clone();f.defines.HORIZONTAL_PASS=1;const m=new Ue;m.setAttribute("position",new ae(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const x=new Wt(m,d),g=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=Nh;let p=this.type;this.render=function(w,A,R){if(g.enabled===!1||g.autoUpdate===!1&&g.needsUpdate===!1||w.length===0)return;const v=i.getRenderTarget(),_=i.getActiveCubeFace(),S=i.getActiveMipmapLevel(),y=i.state;y.setBlending(vi),y.buffers.depth.getReversed()===!0?y.buffers.color.setClear(0,0,0,0):y.buffers.color.setClear(1,1,1,1),y.buffers.depth.setTest(!0),y.setScissorTest(!1);const D=p!==Zn&&this.type===Zn,I=p===Zn&&this.type!==Zn;for(let U=0,H=w.length;U<H;U++){const $=w[U],V=$.shadow;if(V===void 0){console.warn("THREE.WebGLShadowMap:",$,"has no shadow.");continue}if(V.autoUpdate===!1&&V.needsUpdate===!1)continue;r.copy(V.mapSize);const tt=V.getFrameExtents();if(r.multiply(tt),s.copy(V.mapSize),(r.x>h||r.y>h)&&(r.x>h&&(s.x=Math.floor(h/tt.x),r.x=s.x*tt.x,V.mapSize.x=s.x),r.y>h&&(s.y=Math.floor(h/tt.y),r.y=s.y*tt.y,V.mapSize.y=s.y)),V.map===null||D===!0||I===!0){const ct=this.type!==Zn?{minFilter:on,magFilter:on}:{};V.map!==null&&V.map.dispose(),V.map=new Ze(r.x,r.y,ct),V.map.texture.name=$.name+".shadowMap",V.camera.updateProjectionMatrix()}i.setRenderTarget(V.map),i.clear();const st=V.getViewportCount();for(let ct=0;ct<st;ct++){const ft=V.getViewport(ct);a.set(s.x*ft.x,s.y*ft.y,s.x*ft.z,s.y*ft.w),y.viewport(a),V.updateMatrices($,ct),n=V.getFrustum(),M(A,R,V.camera,$,this.type)}V.isPointLightShadow!==!0&&this.type===Zn&&E(V,R),V.needsUpdate=!1}p=this.type,g.needsUpdate=!1,i.setRenderTarget(v,_,S)};function E(w,A){const R=t.update(x);d.defines.VSM_SAMPLES!==w.blurSamples&&(d.defines.VSM_SAMPLES=w.blurSamples,f.defines.VSM_SAMPLES=w.blurSamples,d.needsUpdate=!0,f.needsUpdate=!0),w.mapPass===null&&(w.mapPass=new Ze(r.x,r.y)),d.uniforms.shadow_pass.value=w.map.texture,d.uniforms.resolution.value=w.mapSize,d.uniforms.radius.value=w.radius,i.setRenderTarget(w.mapPass),i.clear(),i.renderBufferDirect(A,null,R,d,x,null),f.uniforms.shadow_pass.value=w.mapPass.texture,f.uniforms.resolution.value=w.mapSize,f.uniforms.radius.value=w.radius,i.setRenderTarget(w.map),i.clear(),i.renderBufferDirect(A,null,R,f,x,null)}function b(w,A,R,v){let _=null;const S=R.isPointLight===!0?w.customDistanceMaterial:w.customDepthMaterial;if(S!==void 0)_=S;else if(_=R.isPointLight===!0?c:o,i.localClippingEnabled&&A.clipShadows===!0&&Array.isArray(A.clippingPlanes)&&A.clippingPlanes.length!==0||A.displacementMap&&A.displacementScale!==0||A.alphaMap&&A.alphaTest>0||A.map&&A.alphaTest>0||A.alphaToCoverage===!0){const y=_.uuid,D=A.uuid;let I=l[y];I===void 0&&(I={},l[y]=I);let U=I[D];U===void 0&&(U=_.clone(),I[D]=U,A.addEventListener("dispose",T)),_=U}if(_.visible=A.visible,_.wireframe=A.wireframe,v===Zn?_.side=A.shadowSide!==null?A.shadowSide:A.side:_.side=A.shadowSide!==null?A.shadowSide:u[A.side],_.alphaMap=A.alphaMap,_.alphaTest=A.alphaToCoverage===!0?.5:A.alphaTest,_.map=A.map,_.clipShadows=A.clipShadows,_.clippingPlanes=A.clippingPlanes,_.clipIntersection=A.clipIntersection,_.displacementMap=A.displacementMap,_.displacementScale=A.displacementScale,_.displacementBias=A.displacementBias,_.wireframeLinewidth=A.wireframeLinewidth,_.linewidth=A.linewidth,R.isPointLight===!0&&_.isMeshDistanceMaterial===!0){const y=i.properties.get(_);y.light=R}return _}function M(w,A,R,v,_){if(w.visible===!1)return;if(w.layers.test(A.layers)&&(w.isMesh||w.isLine||w.isPoints)&&(w.castShadow||w.receiveShadow&&_===Zn)&&(!w.frustumCulled||n.intersectsObject(w))){w.modelViewMatrix.multiplyMatrices(R.matrixWorldInverse,w.matrixWorld);const D=t.update(w),I=w.material;if(Array.isArray(I)){const U=D.groups;for(let H=0,$=U.length;H<$;H++){const V=U[H],tt=I[V.materialIndex];if(tt&&tt.visible){const st=b(w,tt,v,_);w.onBeforeShadow(i,w,A,R,D,st,V),i.renderBufferDirect(R,null,D,st,w,V),w.onAfterShadow(i,w,A,R,D,st,V)}}}else if(I.visible){const U=b(w,I,v,_);w.onBeforeShadow(i,w,A,R,D,U,null),i.renderBufferDirect(R,null,D,U,w,null),w.onAfterShadow(i,w,A,R,D,U,null)}}const y=w.children;for(let D=0,I=y.length;D<I;D++)M(y[D],A,R,v,_)}function T(w){w.target.removeEventListener("dispose",T);for(const R in l){const v=l[R],_=w.target.uuid;_ in v&&(v[_].dispose(),delete v[_])}}}const Kg={[mo]:go,[vo]:Mo,[_o]:bo,[yr]:xo,[go]:mo,[Mo]:vo,[bo]:_o,[xo]:yr};function Jg(i,t){function e(){let G=!1;const mt=new le;let bt=null;const Pt=new le(0,0,0,0);return{setMask:function(ut){bt!==ut&&!G&&(i.colorMask(ut,ut,ut,ut),bt=ut)},setLocked:function(ut){G=ut},setClear:function(ut,ot,It,$t,fe){fe===!0&&(ut*=$t,ot*=$t,It*=$t),mt.set(ut,ot,It,$t),Pt.equals(mt)===!1&&(i.clearColor(ut,ot,It,$t),Pt.copy(mt))},reset:function(){G=!1,bt=null,Pt.set(-1,0,0,0)}}}function n(){let G=!1,mt=!1,bt=null,Pt=null,ut=null;return{setReversed:function(ot){if(mt!==ot){const It=t.get("EXT_clip_control");ot?It.clipControlEXT(It.LOWER_LEFT_EXT,It.ZERO_TO_ONE_EXT):It.clipControlEXT(It.LOWER_LEFT_EXT,It.NEGATIVE_ONE_TO_ONE_EXT),mt=ot;const $t=ut;ut=null,this.setClear($t)}},getReversed:function(){return mt},setTest:function(ot){ot?Z(i.DEPTH_TEST):F(i.DEPTH_TEST)},setMask:function(ot){bt!==ot&&!G&&(i.depthMask(ot),bt=ot)},setFunc:function(ot){if(mt&&(ot=Kg[ot]),Pt!==ot){switch(ot){case mo:i.depthFunc(i.NEVER);break;case go:i.depthFunc(i.ALWAYS);break;case vo:i.depthFunc(i.LESS);break;case yr:i.depthFunc(i.LEQUAL);break;case _o:i.depthFunc(i.EQUAL);break;case xo:i.depthFunc(i.GEQUAL);break;case Mo:i.depthFunc(i.GREATER);break;case bo:i.depthFunc(i.NOTEQUAL);break;default:i.depthFunc(i.LEQUAL)}Pt=ot}},setLocked:function(ot){G=ot},setClear:function(ot){ut!==ot&&(mt&&(ot=1-ot),i.clearDepth(ot),ut=ot)},reset:function(){G=!1,bt=null,Pt=null,ut=null,mt=!1}}}function r(){let G=!1,mt=null,bt=null,Pt=null,ut=null,ot=null,It=null,$t=null,fe=null;return{setTest:function(se){G||(se?Z(i.STENCIL_TEST):F(i.STENCIL_TEST))},setMask:function(se){mt!==se&&!G&&(i.stencilMask(se),mt=se)},setFunc:function(se,Vn,Ln){(bt!==se||Pt!==Vn||ut!==Ln)&&(i.stencilFunc(se,Vn,Ln),bt=se,Pt=Vn,ut=Ln)},setOp:function(se,Vn,Ln){(ot!==se||It!==Vn||$t!==Ln)&&(i.stencilOp(se,Vn,Ln),ot=se,It=Vn,$t=Ln)},setLocked:function(se){G=se},setClear:function(se){fe!==se&&(i.clearStencil(se),fe=se)},reset:function(){G=!1,mt=null,bt=null,Pt=null,ut=null,ot=null,It=null,$t=null,fe=null}}}const s=new e,a=new n,o=new r,c=new WeakMap,l=new WeakMap;let h={},u={},d=new WeakMap,f=[],m=null,x=!1,g=null,p=null,E=null,b=null,M=null,T=null,w=null,A=new Ht(0,0,0),R=0,v=!1,_=null,S=null,y=null,D=null,I=null;const U=i.getParameter(i.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let H=!1,$=0;const V=i.getParameter(i.VERSION);V.indexOf("WebGL")!==-1?($=parseFloat(/^WebGL (\d)/.exec(V)[1]),H=$>=1):V.indexOf("OpenGL ES")!==-1&&($=parseFloat(/^OpenGL ES (\d)/.exec(V)[1]),H=$>=2);let tt=null,st={};const ct=i.getParameter(i.SCISSOR_BOX),ft=i.getParameter(i.VIEWPORT),Ct=new le().fromArray(ct),zt=new le().fromArray(ft);function it(G,mt,bt,Pt){const ut=new Uint8Array(4),ot=i.createTexture();i.bindTexture(G,ot),i.texParameteri(G,i.TEXTURE_MIN_FILTER,i.NEAREST),i.texParameteri(G,i.TEXTURE_MAG_FILTER,i.NEAREST);for(let It=0;It<bt;It++)G===i.TEXTURE_3D||G===i.TEXTURE_2D_ARRAY?i.texImage3D(mt,0,i.RGBA,1,1,Pt,0,i.RGBA,i.UNSIGNED_BYTE,ut):i.texImage2D(mt+It,0,i.RGBA,1,1,0,i.RGBA,i.UNSIGNED_BYTE,ut);return ot}const W={};W[i.TEXTURE_2D]=it(i.TEXTURE_2D,i.TEXTURE_2D,1),W[i.TEXTURE_CUBE_MAP]=it(i.TEXTURE_CUBE_MAP,i.TEXTURE_CUBE_MAP_POSITIVE_X,6),W[i.TEXTURE_2D_ARRAY]=it(i.TEXTURE_2D_ARRAY,i.TEXTURE_2D_ARRAY,1,1),W[i.TEXTURE_3D]=it(i.TEXTURE_3D,i.TEXTURE_3D,1,1),s.setClear(0,0,0,1),a.setClear(1),o.setClear(0),Z(i.DEPTH_TEST),a.setFunc(yr),_t(!1),gt(Yc),Z(i.CULL_FACE),ht(vi);function Z(G){h[G]!==!0&&(i.enable(G),h[G]=!0)}function F(G){h[G]!==!1&&(i.disable(G),h[G]=!1)}function B(G,mt){return u[G]!==mt?(i.bindFramebuffer(G,mt),u[G]=mt,G===i.DRAW_FRAMEBUFFER&&(u[i.FRAMEBUFFER]=mt),G===i.FRAMEBUFFER&&(u[i.DRAW_FRAMEBUFFER]=mt),!0):!1}function k(G,mt){let bt=f,Pt=!1;if(G){bt=d.get(mt),bt===void 0&&(bt=[],d.set(mt,bt));const ut=G.textures;if(bt.length!==ut.length||bt[0]!==i.COLOR_ATTACHMENT0){for(let ot=0,It=ut.length;ot<It;ot++)bt[ot]=i.COLOR_ATTACHMENT0+ot;bt.length=ut.length,Pt=!0}}else bt[0]!==i.BACK&&(bt[0]=i.BACK,Pt=!0);Pt&&i.drawBuffers(bt)}function X(G){return m!==G?(i.useProgram(G),m=G,!0):!1}const K={[Pi]:i.FUNC_ADD,[yf]:i.FUNC_SUBTRACT,[Ef]:i.FUNC_REVERSE_SUBTRACT};K[wf]=i.MIN,K[Tf]=i.MAX;const P={[Af]:i.ZERO,[Rf]:i.ONE,[Cf]:i.SRC_COLOR,[fo]:i.SRC_ALPHA,[Nf]:i.SRC_ALPHA_SATURATE,[If]:i.DST_COLOR,[Pf]:i.DST_ALPHA,[Lf]:i.ONE_MINUS_SRC_COLOR,[po]:i.ONE_MINUS_SRC_ALPHA,[Uf]:i.ONE_MINUS_DST_COLOR,[Df]:i.ONE_MINUS_DST_ALPHA,[Ff]:i.CONSTANT_COLOR,[Of]:i.ONE_MINUS_CONSTANT_COLOR,[Bf]:i.CONSTANT_ALPHA,[kf]:i.ONE_MINUS_CONSTANT_ALPHA};function ht(G,mt,bt,Pt,ut,ot,It,$t,fe,se){if(G===vi){x===!0&&(F(i.BLEND),x=!1);return}if(x===!1&&(Z(i.BLEND),x=!0),G!==Sf){if(G!==g||se!==v){if((p!==Pi||M!==Pi)&&(i.blendEquation(i.FUNC_ADD),p=Pi,M=Pi),se)switch(G){case Mr:i.blendFuncSeparate(i.ONE,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case $c:i.blendFunc(i.ONE,i.ONE);break;case jc:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case Zc:i.blendFuncSeparate(i.DST_COLOR,i.ONE_MINUS_SRC_ALPHA,i.ZERO,i.ONE);break;default:console.error("THREE.WebGLState: Invalid blending: ",G);break}else switch(G){case Mr:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case $c:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE,i.ONE,i.ONE);break;case jc:console.error("THREE.WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case Zc:console.error("THREE.WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:console.error("THREE.WebGLState: Invalid blending: ",G);break}E=null,b=null,T=null,w=null,A.set(0,0,0),R=0,g=G,v=se}return}ut=ut||mt,ot=ot||bt,It=It||Pt,(mt!==p||ut!==M)&&(i.blendEquationSeparate(K[mt],K[ut]),p=mt,M=ut),(bt!==E||Pt!==b||ot!==T||It!==w)&&(i.blendFuncSeparate(P[bt],P[Pt],P[ot],P[It]),E=bt,b=Pt,T=ot,w=It),($t.equals(A)===!1||fe!==R)&&(i.blendColor($t.r,$t.g,$t.b,fe),A.copy($t),R=fe),g=G,v=!1}function at(G,mt){G.side===Sn?F(i.CULL_FACE):Z(i.CULL_FACE);let bt=G.side===Je;mt&&(bt=!bt),_t(bt),G.blending===Mr&&G.transparent===!1?ht(vi):ht(G.blending,G.blendEquation,G.blendSrc,G.blendDst,G.blendEquationAlpha,G.blendSrcAlpha,G.blendDstAlpha,G.blendColor,G.blendAlpha,G.premultipliedAlpha),a.setFunc(G.depthFunc),a.setTest(G.depthTest),a.setMask(G.depthWrite),s.setMask(G.colorWrite);const Pt=G.stencilWrite;o.setTest(Pt),Pt&&(o.setMask(G.stencilWriteMask),o.setFunc(G.stencilFunc,G.stencilRef,G.stencilFuncMask),o.setOp(G.stencilFail,G.stencilZFail,G.stencilZPass)),xt(G.polygonOffset,G.polygonOffsetFactor,G.polygonOffsetUnits),G.alphaToCoverage===!0?Z(i.SAMPLE_ALPHA_TO_COVERAGE):F(i.SAMPLE_ALPHA_TO_COVERAGE)}function _t(G){_!==G&&(G?i.frontFace(i.CW):i.frontFace(i.CCW),_=G)}function gt(G){G!==Mf?(Z(i.CULL_FACE),G!==S&&(G===Yc?i.cullFace(i.BACK):G===bf?i.cullFace(i.FRONT):i.cullFace(i.FRONT_AND_BACK))):F(i.CULL_FACE),S=G}function vt(G){G!==y&&(H&&i.lineWidth(G),y=G)}function xt(G,mt,bt){G?(Z(i.POLYGON_OFFSET_FILL),(D!==mt||I!==bt)&&(i.polygonOffset(mt,bt),D=mt,I=bt)):F(i.POLYGON_OFFSET_FILL)}function Nt(G){G?Z(i.SCISSOR_TEST):F(i.SCISSOR_TEST)}function Se(G){G===void 0&&(G=i.TEXTURE0+U-1),tt!==G&&(i.activeTexture(G),tt=G)}function me(G,mt,bt){bt===void 0&&(tt===null?bt=i.TEXTURE0+U-1:bt=tt);let Pt=st[bt];Pt===void 0&&(Pt={type:void 0,texture:void 0},st[bt]=Pt),(Pt.type!==G||Pt.texture!==mt)&&(tt!==bt&&(i.activeTexture(bt),tt=bt),i.bindTexture(G,mt||W[G]),Pt.type=G,Pt.texture=mt)}function N(){const G=st[tt];G!==void 0&&G.type!==void 0&&(i.bindTexture(G.type,null),G.type=void 0,G.texture=void 0)}function C(){try{i.compressedTexImage2D(...arguments)}catch(G){console.error("THREE.WebGLState:",G)}}function j(){try{i.compressedTexImage3D(...arguments)}catch(G){console.error("THREE.WebGLState:",G)}}function rt(){try{i.texSubImage2D(...arguments)}catch(G){console.error("THREE.WebGLState:",G)}}function lt(){try{i.texSubImage3D(...arguments)}catch(G){console.error("THREE.WebGLState:",G)}}function nt(){try{i.compressedTexSubImage2D(...arguments)}catch(G){console.error("THREE.WebGLState:",G)}}function kt(){try{i.compressedTexSubImage3D(...arguments)}catch(G){console.error("THREE.WebGLState:",G)}}function Mt(){try{i.texStorage2D(...arguments)}catch(G){console.error("THREE.WebGLState:",G)}}function Ft(){try{i.texStorage3D(...arguments)}catch(G){console.error("THREE.WebGLState:",G)}}function Ot(){try{i.texImage2D(...arguments)}catch(G){console.error("THREE.WebGLState:",G)}}function pt(){try{i.texImage3D(...arguments)}catch(G){console.error("THREE.WebGLState:",G)}}function At(G){Ct.equals(G)===!1&&(i.scissor(G.x,G.y,G.z,G.w),Ct.copy(G))}function qt(G){zt.equals(G)===!1&&(i.viewport(G.x,G.y,G.z,G.w),zt.copy(G))}function Bt(G,mt){let bt=l.get(mt);bt===void 0&&(bt=new WeakMap,l.set(mt,bt));let Pt=bt.get(G);Pt===void 0&&(Pt=i.getUniformBlockIndex(mt,G.name),bt.set(G,Pt))}function wt(G,mt){const Pt=l.get(mt).get(G);c.get(mt)!==Pt&&(i.uniformBlockBinding(mt,Pt,G.__bindingPointIndex),c.set(mt,Pt))}function jt(){i.disable(i.BLEND),i.disable(i.CULL_FACE),i.disable(i.DEPTH_TEST),i.disable(i.POLYGON_OFFSET_FILL),i.disable(i.SCISSOR_TEST),i.disable(i.STENCIL_TEST),i.disable(i.SAMPLE_ALPHA_TO_COVERAGE),i.blendEquation(i.FUNC_ADD),i.blendFunc(i.ONE,i.ZERO),i.blendFuncSeparate(i.ONE,i.ZERO,i.ONE,i.ZERO),i.blendColor(0,0,0,0),i.colorMask(!0,!0,!0,!0),i.clearColor(0,0,0,0),i.depthMask(!0),i.depthFunc(i.LESS),a.setReversed(!1),i.clearDepth(1),i.stencilMask(4294967295),i.stencilFunc(i.ALWAYS,0,4294967295),i.stencilOp(i.KEEP,i.KEEP,i.KEEP),i.clearStencil(0),i.cullFace(i.BACK),i.frontFace(i.CCW),i.polygonOffset(0,0),i.activeTexture(i.TEXTURE0),i.bindFramebuffer(i.FRAMEBUFFER,null),i.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),i.bindFramebuffer(i.READ_FRAMEBUFFER,null),i.useProgram(null),i.lineWidth(1),i.scissor(0,0,i.canvas.width,i.canvas.height),i.viewport(0,0,i.canvas.width,i.canvas.height),h={},tt=null,st={},u={},d=new WeakMap,f=[],m=null,x=!1,g=null,p=null,E=null,b=null,M=null,T=null,w=null,A=new Ht(0,0,0),R=0,v=!1,_=null,S=null,y=null,D=null,I=null,Ct.set(0,0,i.canvas.width,i.canvas.height),zt.set(0,0,i.canvas.width,i.canvas.height),s.reset(),a.reset(),o.reset()}return{buffers:{color:s,depth:a,stencil:o},enable:Z,disable:F,bindFramebuffer:B,drawBuffers:k,useProgram:X,setBlending:ht,setMaterial:at,setFlipSided:_t,setCullFace:gt,setLineWidth:vt,setPolygonOffset:xt,setScissorTest:Nt,activeTexture:Se,bindTexture:me,unbindTexture:N,compressedTexImage2D:C,compressedTexImage3D:j,texImage2D:Ot,texImage3D:pt,updateUBOMapping:Bt,uniformBlockBinding:wt,texStorage2D:Mt,texStorage3D:Ft,texSubImage2D:rt,texSubImage3D:lt,compressedTexSubImage2D:nt,compressedTexSubImage3D:kt,scissor:At,viewport:qt,reset:jt}}function Qg(i,t,e,n,r,s,a){const o=t.has("WEBGL_multisampled_render_to_texture")?t.get("WEBGL_multisampled_render_to_texture"):null,c=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),l=new Rt,h=new WeakMap;let u;const d=new WeakMap;let f=!1;try{f=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function m(N,C){return f?new OffscreenCanvas(N,C):oa("canvas")}function x(N,C,j){let rt=1;const lt=me(N);if((lt.width>j||lt.height>j)&&(rt=j/Math.max(lt.width,lt.height)),rt<1)if(typeof HTMLImageElement<"u"&&N instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&N instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&N instanceof ImageBitmap||typeof VideoFrame<"u"&&N instanceof VideoFrame){const nt=Math.floor(rt*lt.width),kt=Math.floor(rt*lt.height);u===void 0&&(u=m(nt,kt));const Mt=C?m(nt,kt):u;return Mt.width=nt,Mt.height=kt,Mt.getContext("2d").drawImage(N,0,0,nt,kt),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+lt.width+"x"+lt.height+") to ("+nt+"x"+kt+")."),Mt}else return"data"in N&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+lt.width+"x"+lt.height+")."),N;return N}function g(N){return N.generateMipmaps}function p(N){i.generateMipmap(N)}function E(N){return N.isWebGLCubeRenderTarget?i.TEXTURE_CUBE_MAP:N.isWebGL3DRenderTarget?i.TEXTURE_3D:N.isWebGLArrayRenderTarget||N.isCompressedArrayTexture?i.TEXTURE_2D_ARRAY:i.TEXTURE_2D}function b(N,C,j,rt,lt=!1){if(N!==null){if(i[N]!==void 0)return i[N];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+N+"'")}let nt=C;if(C===i.RED&&(j===i.FLOAT&&(nt=i.R32F),j===i.HALF_FLOAT&&(nt=i.R16F),j===i.UNSIGNED_BYTE&&(nt=i.R8)),C===i.RED_INTEGER&&(j===i.UNSIGNED_BYTE&&(nt=i.R8UI),j===i.UNSIGNED_SHORT&&(nt=i.R16UI),j===i.UNSIGNED_INT&&(nt=i.R32UI),j===i.BYTE&&(nt=i.R8I),j===i.SHORT&&(nt=i.R16I),j===i.INT&&(nt=i.R32I)),C===i.RG&&(j===i.FLOAT&&(nt=i.RG32F),j===i.HALF_FLOAT&&(nt=i.RG16F),j===i.UNSIGNED_BYTE&&(nt=i.RG8)),C===i.RG_INTEGER&&(j===i.UNSIGNED_BYTE&&(nt=i.RG8UI),j===i.UNSIGNED_SHORT&&(nt=i.RG16UI),j===i.UNSIGNED_INT&&(nt=i.RG32UI),j===i.BYTE&&(nt=i.RG8I),j===i.SHORT&&(nt=i.RG16I),j===i.INT&&(nt=i.RG32I)),C===i.RGB_INTEGER&&(j===i.UNSIGNED_BYTE&&(nt=i.RGB8UI),j===i.UNSIGNED_SHORT&&(nt=i.RGB16UI),j===i.UNSIGNED_INT&&(nt=i.RGB32UI),j===i.BYTE&&(nt=i.RGB8I),j===i.SHORT&&(nt=i.RGB16I),j===i.INT&&(nt=i.RGB32I)),C===i.RGBA_INTEGER&&(j===i.UNSIGNED_BYTE&&(nt=i.RGBA8UI),j===i.UNSIGNED_SHORT&&(nt=i.RGBA16UI),j===i.UNSIGNED_INT&&(nt=i.RGBA32UI),j===i.BYTE&&(nt=i.RGBA8I),j===i.SHORT&&(nt=i.RGBA16I),j===i.INT&&(nt=i.RGBA32I)),C===i.RGB&&(j===i.UNSIGNED_INT_5_9_9_9_REV&&(nt=i.RGB9_E5),j===i.UNSIGNED_INT_10F_11F_11F_REV&&(nt=i.R11F_G11F_B10F)),C===i.RGBA){const kt=lt?sa:re.getTransfer(rt);j===i.FLOAT&&(nt=i.RGBA32F),j===i.HALF_FLOAT&&(nt=i.RGBA16F),j===i.UNSIGNED_BYTE&&(nt=kt===ce?i.SRGB8_ALPHA8:i.RGBA8),j===i.UNSIGNED_SHORT_4_4_4_4&&(nt=i.RGBA4),j===i.UNSIGNED_SHORT_5_5_5_1&&(nt=i.RGB5_A1)}return(nt===i.R16F||nt===i.R32F||nt===i.RG16F||nt===i.RG32F||nt===i.RGBA16F||nt===i.RGBA32F)&&t.get("EXT_color_buffer_float"),nt}function M(N,C){let j;return N?C===null||C===Vi||C===ns?j=i.DEPTH24_STENCIL8:C===kn?j=i.DEPTH32F_STENCIL8:C===es&&(j=i.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):C===null||C===Vi||C===ns?j=i.DEPTH_COMPONENT24:C===kn?j=i.DEPTH_COMPONENT32F:C===es&&(j=i.DEPTH_COMPONENT16),j}function T(N,C){return g(N)===!0||N.isFramebufferTexture&&N.minFilter!==on&&N.minFilter!==ve?Math.log2(Math.max(C.width,C.height))+1:N.mipmaps!==void 0&&N.mipmaps.length>0?N.mipmaps.length:N.isCompressedTexture&&Array.isArray(N.image)?C.mipmaps.length:1}function w(N){const C=N.target;C.removeEventListener("dispose",w),R(C),C.isVideoTexture&&h.delete(C)}function A(N){const C=N.target;C.removeEventListener("dispose",A),_(C)}function R(N){const C=n.get(N);if(C.__webglInit===void 0)return;const j=N.source,rt=d.get(j);if(rt){const lt=rt[C.__cacheKey];lt.usedTimes--,lt.usedTimes===0&&v(N),Object.keys(rt).length===0&&d.delete(j)}n.remove(N)}function v(N){const C=n.get(N);i.deleteTexture(C.__webglTexture);const j=N.source,rt=d.get(j);delete rt[C.__cacheKey],a.memory.textures--}function _(N){const C=n.get(N);if(N.depthTexture&&(N.depthTexture.dispose(),n.remove(N.depthTexture)),N.isWebGLCubeRenderTarget)for(let rt=0;rt<6;rt++){if(Array.isArray(C.__webglFramebuffer[rt]))for(let lt=0;lt<C.__webglFramebuffer[rt].length;lt++)i.deleteFramebuffer(C.__webglFramebuffer[rt][lt]);else i.deleteFramebuffer(C.__webglFramebuffer[rt]);C.__webglDepthbuffer&&i.deleteRenderbuffer(C.__webglDepthbuffer[rt])}else{if(Array.isArray(C.__webglFramebuffer))for(let rt=0;rt<C.__webglFramebuffer.length;rt++)i.deleteFramebuffer(C.__webglFramebuffer[rt]);else i.deleteFramebuffer(C.__webglFramebuffer);if(C.__webglDepthbuffer&&i.deleteRenderbuffer(C.__webglDepthbuffer),C.__webglMultisampledFramebuffer&&i.deleteFramebuffer(C.__webglMultisampledFramebuffer),C.__webglColorRenderbuffer)for(let rt=0;rt<C.__webglColorRenderbuffer.length;rt++)C.__webglColorRenderbuffer[rt]&&i.deleteRenderbuffer(C.__webglColorRenderbuffer[rt]);C.__webglDepthRenderbuffer&&i.deleteRenderbuffer(C.__webglDepthRenderbuffer)}const j=N.textures;for(let rt=0,lt=j.length;rt<lt;rt++){const nt=n.get(j[rt]);nt.__webglTexture&&(i.deleteTexture(nt.__webglTexture),a.memory.textures--),n.remove(j[rt])}n.remove(N)}let S=0;function y(){S=0}function D(){const N=S;return N>=r.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+N+" texture units while this GPU supports only "+r.maxTextures),S+=1,N}function I(N){const C=[];return C.push(N.wrapS),C.push(N.wrapT),C.push(N.wrapR||0),C.push(N.magFilter),C.push(N.minFilter),C.push(N.anisotropy),C.push(N.internalFormat),C.push(N.format),C.push(N.type),C.push(N.generateMipmaps),C.push(N.premultiplyAlpha),C.push(N.flipY),C.push(N.unpackAlignment),C.push(N.colorSpace),C.join()}function U(N,C){const j=n.get(N);if(N.isVideoTexture&&Nt(N),N.isRenderTargetTexture===!1&&N.isExternalTexture!==!0&&N.version>0&&j.__version!==N.version){const rt=N.image;if(rt===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(rt.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{W(j,N,C);return}}else N.isExternalTexture&&(j.__webglTexture=N.sourceTexture?N.sourceTexture:null);e.bindTexture(i.TEXTURE_2D,j.__webglTexture,i.TEXTURE0+C)}function H(N,C){const j=n.get(N);if(N.isRenderTargetTexture===!1&&N.version>0&&j.__version!==N.version){W(j,N,C);return}e.bindTexture(i.TEXTURE_2D_ARRAY,j.__webglTexture,i.TEXTURE0+C)}function $(N,C){const j=n.get(N);if(N.isRenderTargetTexture===!1&&N.version>0&&j.__version!==N.version){W(j,N,C);return}e.bindTexture(i.TEXTURE_3D,j.__webglTexture,i.TEXTURE0+C)}function V(N,C){const j=n.get(N);if(N.version>0&&j.__version!==N.version){Z(j,N,C);return}e.bindTexture(i.TEXTURE_CUBE_MAP,j.__webglTexture,i.TEXTURE0+C)}const tt={[ts]:i.REPEAT,[Ui]:i.CLAMP_TO_EDGE,[yo]:i.MIRRORED_REPEAT},st={[on]:i.NEAREST,[jf]:i.NEAREST_MIPMAP_NEAREST,[gs]:i.NEAREST_MIPMAP_LINEAR,[ve]:i.LINEAR,[_a]:i.LINEAR_MIPMAP_NEAREST,[Ni]:i.LINEAR_MIPMAP_LINEAR},ct={[Qf]:i.NEVER,[sd]:i.ALWAYS,[td]:i.LESS,[jh]:i.LEQUAL,[ed]:i.EQUAL,[rd]:i.GEQUAL,[nd]:i.GREATER,[id]:i.NOTEQUAL};function ft(N,C){if(C.type===kn&&t.has("OES_texture_float_linear")===!1&&(C.magFilter===ve||C.magFilter===_a||C.magFilter===gs||C.magFilter===Ni||C.minFilter===ve||C.minFilter===_a||C.minFilter===gs||C.minFilter===Ni)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),i.texParameteri(N,i.TEXTURE_WRAP_S,tt[C.wrapS]),i.texParameteri(N,i.TEXTURE_WRAP_T,tt[C.wrapT]),(N===i.TEXTURE_3D||N===i.TEXTURE_2D_ARRAY)&&i.texParameteri(N,i.TEXTURE_WRAP_R,tt[C.wrapR]),i.texParameteri(N,i.TEXTURE_MAG_FILTER,st[C.magFilter]),i.texParameteri(N,i.TEXTURE_MIN_FILTER,st[C.minFilter]),C.compareFunction&&(i.texParameteri(N,i.TEXTURE_COMPARE_MODE,i.COMPARE_REF_TO_TEXTURE),i.texParameteri(N,i.TEXTURE_COMPARE_FUNC,ct[C.compareFunction])),t.has("EXT_texture_filter_anisotropic")===!0){if(C.magFilter===on||C.minFilter!==gs&&C.minFilter!==Ni||C.type===kn&&t.has("OES_texture_float_linear")===!1)return;if(C.anisotropy>1||n.get(C).__currentAnisotropy){const j=t.get("EXT_texture_filter_anisotropic");i.texParameterf(N,j.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(C.anisotropy,r.getMaxAnisotropy())),n.get(C).__currentAnisotropy=C.anisotropy}}}function Ct(N,C){let j=!1;N.__webglInit===void 0&&(N.__webglInit=!0,C.addEventListener("dispose",w));const rt=C.source;let lt=d.get(rt);lt===void 0&&(lt={},d.set(rt,lt));const nt=I(C);if(nt!==N.__cacheKey){lt[nt]===void 0&&(lt[nt]={texture:i.createTexture(),usedTimes:0},a.memory.textures++,j=!0),lt[nt].usedTimes++;const kt=lt[N.__cacheKey];kt!==void 0&&(lt[N.__cacheKey].usedTimes--,kt.usedTimes===0&&v(C)),N.__cacheKey=nt,N.__webglTexture=lt[nt].texture}return j}function zt(N,C,j){return Math.floor(Math.floor(N/j)/C)}function it(N,C,j,rt){const nt=N.updateRanges;if(nt.length===0)e.texSubImage2D(i.TEXTURE_2D,0,0,0,C.width,C.height,j,rt,C.data);else{nt.sort((pt,At)=>pt.start-At.start);let kt=0;for(let pt=1;pt<nt.length;pt++){const At=nt[kt],qt=nt[pt],Bt=At.start+At.count,wt=zt(qt.start,C.width,4),jt=zt(At.start,C.width,4);qt.start<=Bt+1&&wt===jt&&zt(qt.start+qt.count-1,C.width,4)===wt?At.count=Math.max(At.count,qt.start+qt.count-At.start):(++kt,nt[kt]=qt)}nt.length=kt+1;const Mt=i.getParameter(i.UNPACK_ROW_LENGTH),Ft=i.getParameter(i.UNPACK_SKIP_PIXELS),Ot=i.getParameter(i.UNPACK_SKIP_ROWS);i.pixelStorei(i.UNPACK_ROW_LENGTH,C.width);for(let pt=0,At=nt.length;pt<At;pt++){const qt=nt[pt],Bt=Math.floor(qt.start/4),wt=Math.ceil(qt.count/4),jt=Bt%C.width,G=Math.floor(Bt/C.width),mt=wt,bt=1;i.pixelStorei(i.UNPACK_SKIP_PIXELS,jt),i.pixelStorei(i.UNPACK_SKIP_ROWS,G),e.texSubImage2D(i.TEXTURE_2D,0,jt,G,mt,bt,j,rt,C.data)}N.clearUpdateRanges(),i.pixelStorei(i.UNPACK_ROW_LENGTH,Mt),i.pixelStorei(i.UNPACK_SKIP_PIXELS,Ft),i.pixelStorei(i.UNPACK_SKIP_ROWS,Ot)}}function W(N,C,j){let rt=i.TEXTURE_2D;(C.isDataArrayTexture||C.isCompressedArrayTexture)&&(rt=i.TEXTURE_2D_ARRAY),C.isData3DTexture&&(rt=i.TEXTURE_3D);const lt=Ct(N,C),nt=C.source;e.bindTexture(rt,N.__webglTexture,i.TEXTURE0+j);const kt=n.get(nt);if(nt.version!==kt.__version||lt===!0){e.activeTexture(i.TEXTURE0+j);const Mt=re.getPrimaries(re.workingColorSpace),Ft=C.colorSpace===Bn?null:re.getPrimaries(C.colorSpace),Ot=C.colorSpace===Bn||Mt===Ft?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,C.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,C.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,C.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,Ot);let pt=x(C.image,!1,r.maxTextureSize);pt=Se(C,pt);const At=s.convert(C.format,C.colorSpace),qt=s.convert(C.type);let Bt=b(C.internalFormat,At,qt,C.colorSpace,C.isVideoTexture);ft(rt,C);let wt;const jt=C.mipmaps,G=C.isVideoTexture!==!0,mt=kt.__version===void 0||lt===!0,bt=nt.dataReady,Pt=T(C,pt);if(C.isDepthTexture)Bt=M(C.format===rs,C.type),mt&&(G?e.texStorage2D(i.TEXTURE_2D,1,Bt,pt.width,pt.height):e.texImage2D(i.TEXTURE_2D,0,Bt,pt.width,pt.height,0,At,qt,null));else if(C.isDataTexture)if(jt.length>0){G&&mt&&e.texStorage2D(i.TEXTURE_2D,Pt,Bt,jt[0].width,jt[0].height);for(let ut=0,ot=jt.length;ut<ot;ut++)wt=jt[ut],G?bt&&e.texSubImage2D(i.TEXTURE_2D,ut,0,0,wt.width,wt.height,At,qt,wt.data):e.texImage2D(i.TEXTURE_2D,ut,Bt,wt.width,wt.height,0,At,qt,wt.data);C.generateMipmaps=!1}else G?(mt&&e.texStorage2D(i.TEXTURE_2D,Pt,Bt,pt.width,pt.height),bt&&it(C,pt,At,qt)):e.texImage2D(i.TEXTURE_2D,0,Bt,pt.width,pt.height,0,At,qt,pt.data);else if(C.isCompressedTexture)if(C.isCompressedArrayTexture){G&&mt&&e.texStorage3D(i.TEXTURE_2D_ARRAY,Pt,Bt,jt[0].width,jt[0].height,pt.depth);for(let ut=0,ot=jt.length;ut<ot;ut++)if(wt=jt[ut],C.format!==He)if(At!==null)if(G){if(bt)if(C.layerUpdates.size>0){const It=Cl(wt.width,wt.height,C.format,C.type);for(const $t of C.layerUpdates){const fe=wt.data.subarray($t*It/wt.data.BYTES_PER_ELEMENT,($t+1)*It/wt.data.BYTES_PER_ELEMENT);e.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,ut,0,0,$t,wt.width,wt.height,1,At,fe)}C.clearLayerUpdates()}else e.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,ut,0,0,0,wt.width,wt.height,pt.depth,At,wt.data)}else e.compressedTexImage3D(i.TEXTURE_2D_ARRAY,ut,Bt,wt.width,wt.height,pt.depth,0,wt.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else G?bt&&e.texSubImage3D(i.TEXTURE_2D_ARRAY,ut,0,0,0,wt.width,wt.height,pt.depth,At,qt,wt.data):e.texImage3D(i.TEXTURE_2D_ARRAY,ut,Bt,wt.width,wt.height,pt.depth,0,At,qt,wt.data)}else{G&&mt&&e.texStorage2D(i.TEXTURE_2D,Pt,Bt,jt[0].width,jt[0].height);for(let ut=0,ot=jt.length;ut<ot;ut++)wt=jt[ut],C.format!==He?At!==null?G?bt&&e.compressedTexSubImage2D(i.TEXTURE_2D,ut,0,0,wt.width,wt.height,At,wt.data):e.compressedTexImage2D(i.TEXTURE_2D,ut,Bt,wt.width,wt.height,0,wt.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):G?bt&&e.texSubImage2D(i.TEXTURE_2D,ut,0,0,wt.width,wt.height,At,qt,wt.data):e.texImage2D(i.TEXTURE_2D,ut,Bt,wt.width,wt.height,0,At,qt,wt.data)}else if(C.isDataArrayTexture)if(G){if(mt&&e.texStorage3D(i.TEXTURE_2D_ARRAY,Pt,Bt,pt.width,pt.height,pt.depth),bt)if(C.layerUpdates.size>0){const ut=Cl(pt.width,pt.height,C.format,C.type);for(const ot of C.layerUpdates){const It=pt.data.subarray(ot*ut/pt.data.BYTES_PER_ELEMENT,(ot+1)*ut/pt.data.BYTES_PER_ELEMENT);e.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,ot,pt.width,pt.height,1,At,qt,It)}C.clearLayerUpdates()}else e.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,0,pt.width,pt.height,pt.depth,At,qt,pt.data)}else e.texImage3D(i.TEXTURE_2D_ARRAY,0,Bt,pt.width,pt.height,pt.depth,0,At,qt,pt.data);else if(C.isData3DTexture)G?(mt&&e.texStorage3D(i.TEXTURE_3D,Pt,Bt,pt.width,pt.height,pt.depth),bt&&e.texSubImage3D(i.TEXTURE_3D,0,0,0,0,pt.width,pt.height,pt.depth,At,qt,pt.data)):e.texImage3D(i.TEXTURE_3D,0,Bt,pt.width,pt.height,pt.depth,0,At,qt,pt.data);else if(C.isFramebufferTexture){if(mt)if(G)e.texStorage2D(i.TEXTURE_2D,Pt,Bt,pt.width,pt.height);else{let ut=pt.width,ot=pt.height;for(let It=0;It<Pt;It++)e.texImage2D(i.TEXTURE_2D,It,Bt,ut,ot,0,At,qt,null),ut>>=1,ot>>=1}}else if(jt.length>0){if(G&&mt){const ut=me(jt[0]);e.texStorage2D(i.TEXTURE_2D,Pt,Bt,ut.width,ut.height)}for(let ut=0,ot=jt.length;ut<ot;ut++)wt=jt[ut],G?bt&&e.texSubImage2D(i.TEXTURE_2D,ut,0,0,At,qt,wt):e.texImage2D(i.TEXTURE_2D,ut,Bt,At,qt,wt);C.generateMipmaps=!1}else if(G){if(mt){const ut=me(pt);e.texStorage2D(i.TEXTURE_2D,Pt,Bt,ut.width,ut.height)}bt&&e.texSubImage2D(i.TEXTURE_2D,0,0,0,At,qt,pt)}else e.texImage2D(i.TEXTURE_2D,0,Bt,At,qt,pt);g(C)&&p(rt),kt.__version=nt.version,C.onUpdate&&C.onUpdate(C)}N.__version=C.version}function Z(N,C,j){if(C.image.length!==6)return;const rt=Ct(N,C),lt=C.source;e.bindTexture(i.TEXTURE_CUBE_MAP,N.__webglTexture,i.TEXTURE0+j);const nt=n.get(lt);if(lt.version!==nt.__version||rt===!0){e.activeTexture(i.TEXTURE0+j);const kt=re.getPrimaries(re.workingColorSpace),Mt=C.colorSpace===Bn?null:re.getPrimaries(C.colorSpace),Ft=C.colorSpace===Bn||kt===Mt?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,C.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,C.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,C.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,Ft);const Ot=C.isCompressedTexture||C.image[0].isCompressedTexture,pt=C.image[0]&&C.image[0].isDataTexture,At=[];for(let ot=0;ot<6;ot++)!Ot&&!pt?At[ot]=x(C.image[ot],!0,r.maxCubemapSize):At[ot]=pt?C.image[ot].image:C.image[ot],At[ot]=Se(C,At[ot]);const qt=At[0],Bt=s.convert(C.format,C.colorSpace),wt=s.convert(C.type),jt=b(C.internalFormat,Bt,wt,C.colorSpace),G=C.isVideoTexture!==!0,mt=nt.__version===void 0||rt===!0,bt=lt.dataReady;let Pt=T(C,qt);ft(i.TEXTURE_CUBE_MAP,C);let ut;if(Ot){G&&mt&&e.texStorage2D(i.TEXTURE_CUBE_MAP,Pt,jt,qt.width,qt.height);for(let ot=0;ot<6;ot++){ut=At[ot].mipmaps;for(let It=0;It<ut.length;It++){const $t=ut[It];C.format!==He?Bt!==null?G?bt&&e.compressedTexSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ot,It,0,0,$t.width,$t.height,Bt,$t.data):e.compressedTexImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ot,It,jt,$t.width,$t.height,0,$t.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):G?bt&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ot,It,0,0,$t.width,$t.height,Bt,wt,$t.data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ot,It,jt,$t.width,$t.height,0,Bt,wt,$t.data)}}}else{if(ut=C.mipmaps,G&&mt){ut.length>0&&Pt++;const ot=me(At[0]);e.texStorage2D(i.TEXTURE_CUBE_MAP,Pt,jt,ot.width,ot.height)}for(let ot=0;ot<6;ot++)if(pt){G?bt&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ot,0,0,0,At[ot].width,At[ot].height,Bt,wt,At[ot].data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ot,0,jt,At[ot].width,At[ot].height,0,Bt,wt,At[ot].data);for(let It=0;It<ut.length;It++){const fe=ut[It].image[ot].image;G?bt&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ot,It+1,0,0,fe.width,fe.height,Bt,wt,fe.data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ot,It+1,jt,fe.width,fe.height,0,Bt,wt,fe.data)}}else{G?bt&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ot,0,0,0,Bt,wt,At[ot]):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ot,0,jt,Bt,wt,At[ot]);for(let It=0;It<ut.length;It++){const $t=ut[It];G?bt&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ot,It+1,0,0,Bt,wt,$t.image[ot]):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ot,It+1,jt,Bt,wt,$t.image[ot])}}}g(C)&&p(i.TEXTURE_CUBE_MAP),nt.__version=lt.version,C.onUpdate&&C.onUpdate(C)}N.__version=C.version}function F(N,C,j,rt,lt,nt){const kt=s.convert(j.format,j.colorSpace),Mt=s.convert(j.type),Ft=b(j.internalFormat,kt,Mt,j.colorSpace),Ot=n.get(C),pt=n.get(j);if(pt.__renderTarget=C,!Ot.__hasExternalTextures){const At=Math.max(1,C.width>>nt),qt=Math.max(1,C.height>>nt);lt===i.TEXTURE_3D||lt===i.TEXTURE_2D_ARRAY?e.texImage3D(lt,nt,Ft,At,qt,C.depth,0,kt,Mt,null):e.texImage2D(lt,nt,Ft,At,qt,0,kt,Mt,null)}e.bindFramebuffer(i.FRAMEBUFFER,N),xt(C)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,rt,lt,pt.__webglTexture,0,vt(C)):(lt===i.TEXTURE_2D||lt>=i.TEXTURE_CUBE_MAP_POSITIVE_X&&lt<=i.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&i.framebufferTexture2D(i.FRAMEBUFFER,rt,lt,pt.__webglTexture,nt),e.bindFramebuffer(i.FRAMEBUFFER,null)}function B(N,C,j){if(i.bindRenderbuffer(i.RENDERBUFFER,N),C.depthBuffer){const rt=C.depthTexture,lt=rt&&rt.isDepthTexture?rt.type:null,nt=M(C.stencilBuffer,lt),kt=C.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,Mt=vt(C);xt(C)?o.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,Mt,nt,C.width,C.height):j?i.renderbufferStorageMultisample(i.RENDERBUFFER,Mt,nt,C.width,C.height):i.renderbufferStorage(i.RENDERBUFFER,nt,C.width,C.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,kt,i.RENDERBUFFER,N)}else{const rt=C.textures;for(let lt=0;lt<rt.length;lt++){const nt=rt[lt],kt=s.convert(nt.format,nt.colorSpace),Mt=s.convert(nt.type),Ft=b(nt.internalFormat,kt,Mt,nt.colorSpace),Ot=vt(C);j&&xt(C)===!1?i.renderbufferStorageMultisample(i.RENDERBUFFER,Ot,Ft,C.width,C.height):xt(C)?o.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,Ot,Ft,C.width,C.height):i.renderbufferStorage(i.RENDERBUFFER,Ft,C.width,C.height)}}i.bindRenderbuffer(i.RENDERBUFFER,null)}function k(N,C){if(C&&C.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(e.bindFramebuffer(i.FRAMEBUFFER,N),!(C.depthTexture&&C.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");const rt=n.get(C.depthTexture);rt.__renderTarget=C,(!rt.__webglTexture||C.depthTexture.image.width!==C.width||C.depthTexture.image.height!==C.height)&&(C.depthTexture.image.width=C.width,C.depthTexture.image.height=C.height,C.depthTexture.needsUpdate=!0),U(C.depthTexture,0);const lt=rt.__webglTexture,nt=vt(C);if(C.depthTexture.format===is)xt(C)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,lt,0,nt):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,lt,0);else if(C.depthTexture.format===rs)xt(C)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,lt,0,nt):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,lt,0);else throw new Error("Unknown depthTexture format")}function X(N){const C=n.get(N),j=N.isWebGLCubeRenderTarget===!0;if(C.__boundDepthTexture!==N.depthTexture){const rt=N.depthTexture;if(C.__depthDisposeCallback&&C.__depthDisposeCallback(),rt){const lt=()=>{delete C.__boundDepthTexture,delete C.__depthDisposeCallback,rt.removeEventListener("dispose",lt)};rt.addEventListener("dispose",lt),C.__depthDisposeCallback=lt}C.__boundDepthTexture=rt}if(N.depthTexture&&!C.__autoAllocateDepthBuffer){if(j)throw new Error("target.depthTexture not supported in Cube render targets");const rt=N.texture.mipmaps;rt&&rt.length>0?k(C.__webglFramebuffer[0],N):k(C.__webglFramebuffer,N)}else if(j){C.__webglDepthbuffer=[];for(let rt=0;rt<6;rt++)if(e.bindFramebuffer(i.FRAMEBUFFER,C.__webglFramebuffer[rt]),C.__webglDepthbuffer[rt]===void 0)C.__webglDepthbuffer[rt]=i.createRenderbuffer(),B(C.__webglDepthbuffer[rt],N,!1);else{const lt=N.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,nt=C.__webglDepthbuffer[rt];i.bindRenderbuffer(i.RENDERBUFFER,nt),i.framebufferRenderbuffer(i.FRAMEBUFFER,lt,i.RENDERBUFFER,nt)}}else{const rt=N.texture.mipmaps;if(rt&&rt.length>0?e.bindFramebuffer(i.FRAMEBUFFER,C.__webglFramebuffer[0]):e.bindFramebuffer(i.FRAMEBUFFER,C.__webglFramebuffer),C.__webglDepthbuffer===void 0)C.__webglDepthbuffer=i.createRenderbuffer(),B(C.__webglDepthbuffer,N,!1);else{const lt=N.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,nt=C.__webglDepthbuffer;i.bindRenderbuffer(i.RENDERBUFFER,nt),i.framebufferRenderbuffer(i.FRAMEBUFFER,lt,i.RENDERBUFFER,nt)}}e.bindFramebuffer(i.FRAMEBUFFER,null)}function K(N,C,j){const rt=n.get(N);C!==void 0&&F(rt.__webglFramebuffer,N,N.texture,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,0),j!==void 0&&X(N)}function P(N){const C=N.texture,j=n.get(N),rt=n.get(C);N.addEventListener("dispose",A);const lt=N.textures,nt=N.isWebGLCubeRenderTarget===!0,kt=lt.length>1;if(kt||(rt.__webglTexture===void 0&&(rt.__webglTexture=i.createTexture()),rt.__version=C.version,a.memory.textures++),nt){j.__webglFramebuffer=[];for(let Mt=0;Mt<6;Mt++)if(C.mipmaps&&C.mipmaps.length>0){j.__webglFramebuffer[Mt]=[];for(let Ft=0;Ft<C.mipmaps.length;Ft++)j.__webglFramebuffer[Mt][Ft]=i.createFramebuffer()}else j.__webglFramebuffer[Mt]=i.createFramebuffer()}else{if(C.mipmaps&&C.mipmaps.length>0){j.__webglFramebuffer=[];for(let Mt=0;Mt<C.mipmaps.length;Mt++)j.__webglFramebuffer[Mt]=i.createFramebuffer()}else j.__webglFramebuffer=i.createFramebuffer();if(kt)for(let Mt=0,Ft=lt.length;Mt<Ft;Mt++){const Ot=n.get(lt[Mt]);Ot.__webglTexture===void 0&&(Ot.__webglTexture=i.createTexture(),a.memory.textures++)}if(N.samples>0&&xt(N)===!1){j.__webglMultisampledFramebuffer=i.createFramebuffer(),j.__webglColorRenderbuffer=[],e.bindFramebuffer(i.FRAMEBUFFER,j.__webglMultisampledFramebuffer);for(let Mt=0;Mt<lt.length;Mt++){const Ft=lt[Mt];j.__webglColorRenderbuffer[Mt]=i.createRenderbuffer(),i.bindRenderbuffer(i.RENDERBUFFER,j.__webglColorRenderbuffer[Mt]);const Ot=s.convert(Ft.format,Ft.colorSpace),pt=s.convert(Ft.type),At=b(Ft.internalFormat,Ot,pt,Ft.colorSpace,N.isXRRenderTarget===!0),qt=vt(N);i.renderbufferStorageMultisample(i.RENDERBUFFER,qt,At,N.width,N.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+Mt,i.RENDERBUFFER,j.__webglColorRenderbuffer[Mt])}i.bindRenderbuffer(i.RENDERBUFFER,null),N.depthBuffer&&(j.__webglDepthRenderbuffer=i.createRenderbuffer(),B(j.__webglDepthRenderbuffer,N,!0)),e.bindFramebuffer(i.FRAMEBUFFER,null)}}if(nt){e.bindTexture(i.TEXTURE_CUBE_MAP,rt.__webglTexture),ft(i.TEXTURE_CUBE_MAP,C);for(let Mt=0;Mt<6;Mt++)if(C.mipmaps&&C.mipmaps.length>0)for(let Ft=0;Ft<C.mipmaps.length;Ft++)F(j.__webglFramebuffer[Mt][Ft],N,C,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+Mt,Ft);else F(j.__webglFramebuffer[Mt],N,C,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+Mt,0);g(C)&&p(i.TEXTURE_CUBE_MAP),e.unbindTexture()}else if(kt){for(let Mt=0,Ft=lt.length;Mt<Ft;Mt++){const Ot=lt[Mt],pt=n.get(Ot);let At=i.TEXTURE_2D;(N.isWebGL3DRenderTarget||N.isWebGLArrayRenderTarget)&&(At=N.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),e.bindTexture(At,pt.__webglTexture),ft(At,Ot),F(j.__webglFramebuffer,N,Ot,i.COLOR_ATTACHMENT0+Mt,At,0),g(Ot)&&p(At)}e.unbindTexture()}else{let Mt=i.TEXTURE_2D;if((N.isWebGL3DRenderTarget||N.isWebGLArrayRenderTarget)&&(Mt=N.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),e.bindTexture(Mt,rt.__webglTexture),ft(Mt,C),C.mipmaps&&C.mipmaps.length>0)for(let Ft=0;Ft<C.mipmaps.length;Ft++)F(j.__webglFramebuffer[Ft],N,C,i.COLOR_ATTACHMENT0,Mt,Ft);else F(j.__webglFramebuffer,N,C,i.COLOR_ATTACHMENT0,Mt,0);g(C)&&p(Mt),e.unbindTexture()}N.depthBuffer&&X(N)}function ht(N){const C=N.textures;for(let j=0,rt=C.length;j<rt;j++){const lt=C[j];if(g(lt)){const nt=E(N),kt=n.get(lt).__webglTexture;e.bindTexture(nt,kt),p(nt),e.unbindTexture()}}}const at=[],_t=[];function gt(N){if(N.samples>0){if(xt(N)===!1){const C=N.textures,j=N.width,rt=N.height;let lt=i.COLOR_BUFFER_BIT;const nt=N.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,kt=n.get(N),Mt=C.length>1;if(Mt)for(let Ot=0;Ot<C.length;Ot++)e.bindFramebuffer(i.FRAMEBUFFER,kt.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+Ot,i.RENDERBUFFER,null),e.bindFramebuffer(i.FRAMEBUFFER,kt.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+Ot,i.TEXTURE_2D,null,0);e.bindFramebuffer(i.READ_FRAMEBUFFER,kt.__webglMultisampledFramebuffer);const Ft=N.texture.mipmaps;Ft&&Ft.length>0?e.bindFramebuffer(i.DRAW_FRAMEBUFFER,kt.__webglFramebuffer[0]):e.bindFramebuffer(i.DRAW_FRAMEBUFFER,kt.__webglFramebuffer);for(let Ot=0;Ot<C.length;Ot++){if(N.resolveDepthBuffer&&(N.depthBuffer&&(lt|=i.DEPTH_BUFFER_BIT),N.stencilBuffer&&N.resolveStencilBuffer&&(lt|=i.STENCIL_BUFFER_BIT)),Mt){i.framebufferRenderbuffer(i.READ_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.RENDERBUFFER,kt.__webglColorRenderbuffer[Ot]);const pt=n.get(C[Ot]).__webglTexture;i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,pt,0)}i.blitFramebuffer(0,0,j,rt,0,0,j,rt,lt,i.NEAREST),c===!0&&(at.length=0,_t.length=0,at.push(i.COLOR_ATTACHMENT0+Ot),N.depthBuffer&&N.resolveDepthBuffer===!1&&(at.push(nt),_t.push(nt),i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,_t)),i.invalidateFramebuffer(i.READ_FRAMEBUFFER,at))}if(e.bindFramebuffer(i.READ_FRAMEBUFFER,null),e.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),Mt)for(let Ot=0;Ot<C.length;Ot++){e.bindFramebuffer(i.FRAMEBUFFER,kt.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+Ot,i.RENDERBUFFER,kt.__webglColorRenderbuffer[Ot]);const pt=n.get(C[Ot]).__webglTexture;e.bindFramebuffer(i.FRAMEBUFFER,kt.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+Ot,i.TEXTURE_2D,pt,0)}e.bindFramebuffer(i.DRAW_FRAMEBUFFER,kt.__webglMultisampledFramebuffer)}else if(N.depthBuffer&&N.resolveDepthBuffer===!1&&c){const C=N.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,[C])}}}function vt(N){return Math.min(r.maxSamples,N.samples)}function xt(N){const C=n.get(N);return N.samples>0&&t.has("WEBGL_multisampled_render_to_texture")===!0&&C.__useRenderToTexture!==!1}function Nt(N){const C=a.render.frame;h.get(N)!==C&&(h.set(N,C),N.update())}function Se(N,C){const j=N.colorSpace,rt=N.format,lt=N.type;return N.isCompressedTexture===!0||N.isVideoTexture===!0||j!==Gi&&j!==Bn&&(re.getTransfer(j)===ce?(rt!==He||lt!==Rn)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",j)),C}function me(N){return typeof HTMLImageElement<"u"&&N instanceof HTMLImageElement?(l.width=N.naturalWidth||N.width,l.height=N.naturalHeight||N.height):typeof VideoFrame<"u"&&N instanceof VideoFrame?(l.width=N.displayWidth,l.height=N.displayHeight):(l.width=N.width,l.height=N.height),l}this.allocateTextureUnit=D,this.resetTextureUnits=y,this.setTexture2D=U,this.setTexture2DArray=H,this.setTexture3D=$,this.setTextureCube=V,this.rebindTextures=K,this.setupRenderTarget=P,this.updateRenderTargetMipmap=ht,this.updateMultisampleRenderTarget=gt,this.setupDepthRenderbuffer=X,this.setupFrameBufferTexture=F,this.useMultisampledRTT=xt}function tv(i,t){function e(n,r=Bn){let s;const a=re.getTransfer(r);if(n===Rn)return i.UNSIGNED_BYTE;if(n===hc)return i.UNSIGNED_SHORT_4_4_4_4;if(n===uc)return i.UNSIGNED_SHORT_5_5_5_1;if(n===Vh)return i.UNSIGNED_INT_5_9_9_9_REV;if(n===Gh)return i.UNSIGNED_INT_10F_11F_11F_REV;if(n===Hh)return i.BYTE;if(n===zh)return i.SHORT;if(n===es)return i.UNSIGNED_SHORT;if(n===lc)return i.INT;if(n===Vi)return i.UNSIGNED_INT;if(n===kn)return i.FLOAT;if(n===qi)return i.HALF_FLOAT;if(n===Wh)return i.ALPHA;if(n===Xh)return i.RGB;if(n===He)return i.RGBA;if(n===is)return i.DEPTH_COMPONENT;if(n===rs)return i.DEPTH_STENCIL;if(n===qh)return i.RED;if(n===fc)return i.RED_INTEGER;if(n===Yh)return i.RG;if(n===dc)return i.RG_INTEGER;if(n===pc)return i.RGBA_INTEGER;if(n===Ks||n===Js||n===Qs||n===ta)if(a===ce)if(s=t.get("WEBGL_compressed_texture_s3tc_srgb"),s!==null){if(n===Ks)return s.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===Js)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===Qs)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===ta)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(s=t.get("WEBGL_compressed_texture_s3tc"),s!==null){if(n===Ks)return s.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===Js)return s.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===Qs)return s.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===ta)return s.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(n===Eo||n===wo||n===To||n===Ao)if(s=t.get("WEBGL_compressed_texture_pvrtc"),s!==null){if(n===Eo)return s.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===wo)return s.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===To)return s.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===Ao)return s.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(n===Ro||n===Co||n===Lo)if(s=t.get("WEBGL_compressed_texture_etc"),s!==null){if(n===Ro||n===Co)return a===ce?s.COMPRESSED_SRGB8_ETC2:s.COMPRESSED_RGB8_ETC2;if(n===Lo)return a===ce?s.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:s.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(n===Po||n===Do||n===Io||n===Uo||n===No||n===Fo||n===Oo||n===Bo||n===ko||n===Ho||n===zo||n===Vo||n===Go||n===Wo)if(s=t.get("WEBGL_compressed_texture_astc"),s!==null){if(n===Po)return a===ce?s.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:s.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===Do)return a===ce?s.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:s.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===Io)return a===ce?s.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:s.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===Uo)return a===ce?s.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:s.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===No)return a===ce?s.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:s.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===Fo)return a===ce?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:s.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===Oo)return a===ce?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:s.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===Bo)return a===ce?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:s.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===ko)return a===ce?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:s.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===Ho)return a===ce?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:s.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===zo)return a===ce?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:s.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===Vo)return a===ce?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:s.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===Go)return a===ce?s.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:s.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===Wo)return a===ce?s.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:s.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(n===Xo||n===qo||n===Yo)if(s=t.get("EXT_texture_compression_bptc"),s!==null){if(n===Xo)return a===ce?s.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:s.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===qo)return s.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===Yo)return s.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(n===$o||n===jo||n===Zo||n===Ko)if(s=t.get("EXT_texture_compression_rgtc"),s!==null){if(n===$o)return s.COMPRESSED_RED_RGTC1_EXT;if(n===jo)return s.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===Zo)return s.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===Ko)return s.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return n===ns?i.UNSIGNED_INT_24_8:i[n]!==void 0?i[n]:null}return{convert:e}}const ev=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,nv=`
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

}`;class iv{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(t,e){if(this.texture===null){const n=new lu(t.texture);(t.depthNear!==e.depthNear||t.depthFar!==e.depthFar)&&(this.depthNear=t.depthNear,this.depthFar=t.depthFar),this.texture=n}}getMesh(t){if(this.texture!==null&&this.mesh===null){const e=t.cameras[0].viewport,n=new Ke({vertexShader:ev,fragmentShader:nv,uniforms:{depthColor:{value:this.texture},depthWidth:{value:e.z},depthHeight:{value:e.w}}});this.mesh=new Wt(new Ir(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class rv extends Lr{constructor(t,e){super();const n=this;let r=null,s=1,a=null,o="local-floor",c=1,l=null,h=null,u=null,d=null,f=null,m=null;const x=typeof XRWebGLBinding<"u",g=new iv,p={},E=e.getContextAttributes();let b=null,M=null;const T=[],w=[],A=new Rt;let R=null;const v=new gn;v.viewport=new le;const _=new gn;_.viewport=new le;const S=[v,_],y=new w0;let D=null,I=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(W){let Z=T[W];return Z===void 0&&(Z=new ka,T[W]=Z),Z.getTargetRaySpace()},this.getControllerGrip=function(W){let Z=T[W];return Z===void 0&&(Z=new ka,T[W]=Z),Z.getGripSpace()},this.getHand=function(W){let Z=T[W];return Z===void 0&&(Z=new ka,T[W]=Z),Z.getHandSpace()};function U(W){const Z=w.indexOf(W.inputSource);if(Z===-1)return;const F=T[Z];F!==void 0&&(F.update(W.inputSource,W.frame,l||a),F.dispatchEvent({type:W.type,data:W.inputSource}))}function H(){r.removeEventListener("select",U),r.removeEventListener("selectstart",U),r.removeEventListener("selectend",U),r.removeEventListener("squeeze",U),r.removeEventListener("squeezestart",U),r.removeEventListener("squeezeend",U),r.removeEventListener("end",H),r.removeEventListener("inputsourceschange",$);for(let W=0;W<T.length;W++){const Z=w[W];Z!==null&&(w[W]=null,T[W].disconnect(Z))}D=null,I=null,g.reset();for(const W in p)delete p[W];t.setRenderTarget(b),f=null,d=null,u=null,r=null,M=null,it.stop(),n.isPresenting=!1,t.setPixelRatio(R),t.setSize(A.width,A.height,!1),n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(W){s=W,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(W){o=W,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return l||a},this.setReferenceSpace=function(W){l=W},this.getBaseLayer=function(){return d!==null?d:f},this.getBinding=function(){return u===null&&x&&(u=new XRWebGLBinding(r,e)),u},this.getFrame=function(){return m},this.getSession=function(){return r},this.setSession=async function(W){if(r=W,r!==null){if(b=t.getRenderTarget(),r.addEventListener("select",U),r.addEventListener("selectstart",U),r.addEventListener("selectend",U),r.addEventListener("squeeze",U),r.addEventListener("squeezestart",U),r.addEventListener("squeezeend",U),r.addEventListener("end",H),r.addEventListener("inputsourceschange",$),E.xrCompatible!==!0&&await e.makeXRCompatible(),R=t.getPixelRatio(),t.getSize(A),x&&"createProjectionLayer"in XRWebGLBinding.prototype){let F=null,B=null,k=null;E.depth&&(k=E.stencil?e.DEPTH24_STENCIL8:e.DEPTH_COMPONENT24,F=E.stencil?rs:is,B=E.stencil?ns:Vi);const X={colorFormat:e.RGBA8,depthFormat:k,scaleFactor:s};u=this.getBinding(),d=u.createProjectionLayer(X),r.updateRenderState({layers:[d]}),t.setPixelRatio(1),t.setSize(d.textureWidth,d.textureHeight,!1),M=new Ze(d.textureWidth,d.textureHeight,{format:He,type:Rn,depthTexture:new cu(d.textureWidth,d.textureHeight,B,void 0,void 0,void 0,void 0,void 0,void 0,F),stencilBuffer:E.stencil,colorSpace:t.outputColorSpace,samples:E.antialias?4:0,resolveDepthBuffer:d.ignoreDepthValues===!1,resolveStencilBuffer:d.ignoreDepthValues===!1})}else{const F={antialias:E.antialias,alpha:!0,depth:E.depth,stencil:E.stencil,framebufferScaleFactor:s};f=new XRWebGLLayer(r,e,F),r.updateRenderState({baseLayer:f}),t.setPixelRatio(1),t.setSize(f.framebufferWidth,f.framebufferHeight,!1),M=new Ze(f.framebufferWidth,f.framebufferHeight,{format:He,type:Rn,colorSpace:t.outputColorSpace,stencilBuffer:E.stencil,resolveDepthBuffer:f.ignoreDepthValues===!1,resolveStencilBuffer:f.ignoreDepthValues===!1})}M.isXRRenderTarget=!0,this.setFoveation(c),l=null,a=await r.requestReferenceSpace(o),it.setContext(r),it.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(r!==null)return r.environmentBlendMode},this.getDepthTexture=function(){return g.getDepthTexture()};function $(W){for(let Z=0;Z<W.removed.length;Z++){const F=W.removed[Z],B=w.indexOf(F);B>=0&&(w[B]=null,T[B].disconnect(F))}for(let Z=0;Z<W.added.length;Z++){const F=W.added[Z];let B=w.indexOf(F);if(B===-1){for(let X=0;X<T.length;X++)if(X>=w.length){w.push(F),B=X;break}else if(w[X]===null){w[X]=F,B=X;break}if(B===-1)break}const k=T[B];k&&k.connect(F)}}const V=new O,tt=new O;function st(W,Z,F){V.setFromMatrixPosition(Z.matrixWorld),tt.setFromMatrixPosition(F.matrixWorld);const B=V.distanceTo(tt),k=Z.projectionMatrix.elements,X=F.projectionMatrix.elements,K=k[14]/(k[10]-1),P=k[14]/(k[10]+1),ht=(k[9]+1)/k[5],at=(k[9]-1)/k[5],_t=(k[8]-1)/k[0],gt=(X[8]+1)/X[0],vt=K*_t,xt=K*gt,Nt=B/(-_t+gt),Se=Nt*-_t;if(Z.matrixWorld.decompose(W.position,W.quaternion,W.scale),W.translateX(Se),W.translateZ(Nt),W.matrixWorld.compose(W.position,W.quaternion,W.scale),W.matrixWorldInverse.copy(W.matrixWorld).invert(),k[10]===-1)W.projectionMatrix.copy(Z.projectionMatrix),W.projectionMatrixInverse.copy(Z.projectionMatrixInverse);else{const me=K+Nt,N=P+Nt,C=vt-Se,j=xt+(B-Se),rt=ht*P/N*me,lt=at*P/N*me;W.projectionMatrix.makePerspective(C,j,rt,lt,me,N),W.projectionMatrixInverse.copy(W.projectionMatrix).invert()}}function ct(W,Z){Z===null?W.matrixWorld.copy(W.matrix):W.matrixWorld.multiplyMatrices(Z.matrixWorld,W.matrix),W.matrixWorldInverse.copy(W.matrixWorld).invert()}this.updateCamera=function(W){if(r===null)return;let Z=W.near,F=W.far;g.texture!==null&&(g.depthNear>0&&(Z=g.depthNear),g.depthFar>0&&(F=g.depthFar)),y.near=_.near=v.near=Z,y.far=_.far=v.far=F,(D!==y.near||I!==y.far)&&(r.updateRenderState({depthNear:y.near,depthFar:y.far}),D=y.near,I=y.far),y.layers.mask=W.layers.mask|6,v.layers.mask=y.layers.mask&3,_.layers.mask=y.layers.mask&5;const B=W.parent,k=y.cameras;ct(y,B);for(let X=0;X<k.length;X++)ct(k[X],B);k.length===2?st(y,v,_):y.projectionMatrix.copy(v.projectionMatrix),ft(W,y,B)};function ft(W,Z,F){F===null?W.matrix.copy(Z.matrixWorld):(W.matrix.copy(F.matrixWorld),W.matrix.invert(),W.matrix.multiply(Z.matrixWorld)),W.matrix.decompose(W.position,W.quaternion,W.scale),W.updateMatrixWorld(!0),W.projectionMatrix.copy(Z.projectionMatrix),W.projectionMatrixInverse.copy(Z.projectionMatrixInverse),W.isPerspectiveCamera&&(W.fov=ss*2*Math.atan(1/W.projectionMatrix.elements[5]),W.zoom=1)}this.getCamera=function(){return y},this.getFoveation=function(){if(!(d===null&&f===null))return c},this.setFoveation=function(W){c=W,d!==null&&(d.fixedFoveation=W),f!==null&&f.fixedFoveation!==void 0&&(f.fixedFoveation=W)},this.hasDepthSensing=function(){return g.texture!==null},this.getDepthSensingMesh=function(){return g.getMesh(y)},this.getCameraTexture=function(W){return p[W]};let Ct=null;function zt(W,Z){if(h=Z.getViewerPose(l||a),m=Z,h!==null){const F=h.views;f!==null&&(t.setRenderTargetFramebuffer(M,f.framebuffer),t.setRenderTarget(M));let B=!1;F.length!==y.cameras.length&&(y.cameras.length=0,B=!0);for(let P=0;P<F.length;P++){const ht=F[P];let at=null;if(f!==null)at=f.getViewport(ht);else{const gt=u.getViewSubImage(d,ht);at=gt.viewport,P===0&&(t.setRenderTargetTextures(M,gt.colorTexture,gt.depthStencilTexture),t.setRenderTarget(M))}let _t=S[P];_t===void 0&&(_t=new gn,_t.layers.enable(P),_t.viewport=new le,S[P]=_t),_t.matrix.fromArray(ht.transform.matrix),_t.matrix.decompose(_t.position,_t.quaternion,_t.scale),_t.projectionMatrix.fromArray(ht.projectionMatrix),_t.projectionMatrixInverse.copy(_t.projectionMatrix).invert(),_t.viewport.set(at.x,at.y,at.width,at.height),P===0&&(y.matrix.copy(_t.matrix),y.matrix.decompose(y.position,y.quaternion,y.scale)),B===!0&&y.cameras.push(_t)}const k=r.enabledFeatures;if(k&&k.includes("depth-sensing")&&r.depthUsage=="gpu-optimized"&&x){u=n.getBinding();const P=u.getDepthInformation(F[0]);P&&P.isValid&&P.texture&&g.init(P,r.renderState)}if(k&&k.includes("camera-access")&&x){t.state.unbindTexture(),u=n.getBinding();for(let P=0;P<F.length;P++){const ht=F[P].camera;if(ht){let at=p[ht];at||(at=new lu,p[ht]=at);const _t=u.getCameraImage(ht);at.sourceTexture=_t}}}}for(let F=0;F<T.length;F++){const B=w[F],k=T[F];B!==null&&k!==void 0&&k.update(B,Z,l||a)}Ct&&Ct(W,Z),Z.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:Z}),m=null}const it=new du;it.setAnimationLoop(zt),this.setAnimationLoop=function(W){Ct=W},this.dispose=function(){}}}const Ri=new vn,sv=new ne;function av(i,t){function e(g,p){g.matrixAutoUpdate===!0&&g.updateMatrix(),p.value.copy(g.matrix)}function n(g,p){p.color.getRGB(g.fogColor.value,nu(i)),p.isFog?(g.fogNear.value=p.near,g.fogFar.value=p.far):p.isFogExp2&&(g.fogDensity.value=p.density)}function r(g,p,E,b,M){p.isMeshBasicMaterial||p.isMeshLambertMaterial?s(g,p):p.isMeshToonMaterial?(s(g,p),u(g,p)):p.isMeshPhongMaterial?(s(g,p),h(g,p)):p.isMeshStandardMaterial?(s(g,p),d(g,p),p.isMeshPhysicalMaterial&&f(g,p,M)):p.isMeshMatcapMaterial?(s(g,p),m(g,p)):p.isMeshDepthMaterial?s(g,p):p.isMeshDistanceMaterial?(s(g,p),x(g,p)):p.isMeshNormalMaterial?s(g,p):p.isLineBasicMaterial?(a(g,p),p.isLineDashedMaterial&&o(g,p)):p.isPointsMaterial?c(g,p,E,b):p.isSpriteMaterial?l(g,p):p.isShadowMaterial?(g.color.value.copy(p.color),g.opacity.value=p.opacity):p.isShaderMaterial&&(p.uniformsNeedUpdate=!1)}function s(g,p){g.opacity.value=p.opacity,p.color&&g.diffuse.value.copy(p.color),p.emissive&&g.emissive.value.copy(p.emissive).multiplyScalar(p.emissiveIntensity),p.map&&(g.map.value=p.map,e(p.map,g.mapTransform)),p.alphaMap&&(g.alphaMap.value=p.alphaMap,e(p.alphaMap,g.alphaMapTransform)),p.bumpMap&&(g.bumpMap.value=p.bumpMap,e(p.bumpMap,g.bumpMapTransform),g.bumpScale.value=p.bumpScale,p.side===Je&&(g.bumpScale.value*=-1)),p.normalMap&&(g.normalMap.value=p.normalMap,e(p.normalMap,g.normalMapTransform),g.normalScale.value.copy(p.normalScale),p.side===Je&&g.normalScale.value.negate()),p.displacementMap&&(g.displacementMap.value=p.displacementMap,e(p.displacementMap,g.displacementMapTransform),g.displacementScale.value=p.displacementScale,g.displacementBias.value=p.displacementBias),p.emissiveMap&&(g.emissiveMap.value=p.emissiveMap,e(p.emissiveMap,g.emissiveMapTransform)),p.specularMap&&(g.specularMap.value=p.specularMap,e(p.specularMap,g.specularMapTransform)),p.alphaTest>0&&(g.alphaTest.value=p.alphaTest);const E=t.get(p),b=E.envMap,M=E.envMapRotation;b&&(g.envMap.value=b,Ri.copy(M),Ri.x*=-1,Ri.y*=-1,Ri.z*=-1,b.isCubeTexture&&b.isRenderTargetTexture===!1&&(Ri.y*=-1,Ri.z*=-1),g.envMapRotation.value.setFromMatrix4(sv.makeRotationFromEuler(Ri)),g.flipEnvMap.value=b.isCubeTexture&&b.isRenderTargetTexture===!1?-1:1,g.reflectivity.value=p.reflectivity,g.ior.value=p.ior,g.refractionRatio.value=p.refractionRatio),p.lightMap&&(g.lightMap.value=p.lightMap,g.lightMapIntensity.value=p.lightMapIntensity,e(p.lightMap,g.lightMapTransform)),p.aoMap&&(g.aoMap.value=p.aoMap,g.aoMapIntensity.value=p.aoMapIntensity,e(p.aoMap,g.aoMapTransform))}function a(g,p){g.diffuse.value.copy(p.color),g.opacity.value=p.opacity,p.map&&(g.map.value=p.map,e(p.map,g.mapTransform))}function o(g,p){g.dashSize.value=p.dashSize,g.totalSize.value=p.dashSize+p.gapSize,g.scale.value=p.scale}function c(g,p,E,b){g.diffuse.value.copy(p.color),g.opacity.value=p.opacity,g.size.value=p.size*E,g.scale.value=b*.5,p.map&&(g.map.value=p.map,e(p.map,g.uvTransform)),p.alphaMap&&(g.alphaMap.value=p.alphaMap,e(p.alphaMap,g.alphaMapTransform)),p.alphaTest>0&&(g.alphaTest.value=p.alphaTest)}function l(g,p){g.diffuse.value.copy(p.color),g.opacity.value=p.opacity,g.rotation.value=p.rotation,p.map&&(g.map.value=p.map,e(p.map,g.mapTransform)),p.alphaMap&&(g.alphaMap.value=p.alphaMap,e(p.alphaMap,g.alphaMapTransform)),p.alphaTest>0&&(g.alphaTest.value=p.alphaTest)}function h(g,p){g.specular.value.copy(p.specular),g.shininess.value=Math.max(p.shininess,1e-4)}function u(g,p){p.gradientMap&&(g.gradientMap.value=p.gradientMap)}function d(g,p){g.metalness.value=p.metalness,p.metalnessMap&&(g.metalnessMap.value=p.metalnessMap,e(p.metalnessMap,g.metalnessMapTransform)),g.roughness.value=p.roughness,p.roughnessMap&&(g.roughnessMap.value=p.roughnessMap,e(p.roughnessMap,g.roughnessMapTransform)),p.envMap&&(g.envMapIntensity.value=p.envMapIntensity)}function f(g,p,E){g.ior.value=p.ior,p.sheen>0&&(g.sheenColor.value.copy(p.sheenColor).multiplyScalar(p.sheen),g.sheenRoughness.value=p.sheenRoughness,p.sheenColorMap&&(g.sheenColorMap.value=p.sheenColorMap,e(p.sheenColorMap,g.sheenColorMapTransform)),p.sheenRoughnessMap&&(g.sheenRoughnessMap.value=p.sheenRoughnessMap,e(p.sheenRoughnessMap,g.sheenRoughnessMapTransform))),p.clearcoat>0&&(g.clearcoat.value=p.clearcoat,g.clearcoatRoughness.value=p.clearcoatRoughness,p.clearcoatMap&&(g.clearcoatMap.value=p.clearcoatMap,e(p.clearcoatMap,g.clearcoatMapTransform)),p.clearcoatRoughnessMap&&(g.clearcoatRoughnessMap.value=p.clearcoatRoughnessMap,e(p.clearcoatRoughnessMap,g.clearcoatRoughnessMapTransform)),p.clearcoatNormalMap&&(g.clearcoatNormalMap.value=p.clearcoatNormalMap,e(p.clearcoatNormalMap,g.clearcoatNormalMapTransform),g.clearcoatNormalScale.value.copy(p.clearcoatNormalScale),p.side===Je&&g.clearcoatNormalScale.value.negate())),p.dispersion>0&&(g.dispersion.value=p.dispersion),p.iridescence>0&&(g.iridescence.value=p.iridescence,g.iridescenceIOR.value=p.iridescenceIOR,g.iridescenceThicknessMinimum.value=p.iridescenceThicknessRange[0],g.iridescenceThicknessMaximum.value=p.iridescenceThicknessRange[1],p.iridescenceMap&&(g.iridescenceMap.value=p.iridescenceMap,e(p.iridescenceMap,g.iridescenceMapTransform)),p.iridescenceThicknessMap&&(g.iridescenceThicknessMap.value=p.iridescenceThicknessMap,e(p.iridescenceThicknessMap,g.iridescenceThicknessMapTransform))),p.transmission>0&&(g.transmission.value=p.transmission,g.transmissionSamplerMap.value=E.texture,g.transmissionSamplerSize.value.set(E.width,E.height),p.transmissionMap&&(g.transmissionMap.value=p.transmissionMap,e(p.transmissionMap,g.transmissionMapTransform)),g.thickness.value=p.thickness,p.thicknessMap&&(g.thicknessMap.value=p.thicknessMap,e(p.thicknessMap,g.thicknessMapTransform)),g.attenuationDistance.value=p.attenuationDistance,g.attenuationColor.value.copy(p.attenuationColor)),p.anisotropy>0&&(g.anisotropyVector.value.set(p.anisotropy*Math.cos(p.anisotropyRotation),p.anisotropy*Math.sin(p.anisotropyRotation)),p.anisotropyMap&&(g.anisotropyMap.value=p.anisotropyMap,e(p.anisotropyMap,g.anisotropyMapTransform))),g.specularIntensity.value=p.specularIntensity,g.specularColor.value.copy(p.specularColor),p.specularColorMap&&(g.specularColorMap.value=p.specularColorMap,e(p.specularColorMap,g.specularColorMapTransform)),p.specularIntensityMap&&(g.specularIntensityMap.value=p.specularIntensityMap,e(p.specularIntensityMap,g.specularIntensityMapTransform))}function m(g,p){p.matcap&&(g.matcap.value=p.matcap)}function x(g,p){const E=t.get(p).light;g.referencePosition.value.setFromMatrixPosition(E.matrixWorld),g.nearDistance.value=E.shadow.camera.near,g.farDistance.value=E.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:r}}function ov(i,t,e,n){let r={},s={},a=[];const o=i.getParameter(i.MAX_UNIFORM_BUFFER_BINDINGS);function c(E,b){const M=b.program;n.uniformBlockBinding(E,M)}function l(E,b){let M=r[E.id];M===void 0&&(m(E),M=h(E),r[E.id]=M,E.addEventListener("dispose",g));const T=b.program;n.updateUBOMapping(E,T);const w=t.render.frame;s[E.id]!==w&&(d(E),s[E.id]=w)}function h(E){const b=u();E.__bindingPointIndex=b;const M=i.createBuffer(),T=E.__size,w=E.usage;return i.bindBuffer(i.UNIFORM_BUFFER,M),i.bufferData(i.UNIFORM_BUFFER,T,w),i.bindBuffer(i.UNIFORM_BUFFER,null),i.bindBufferBase(i.UNIFORM_BUFFER,b,M),M}function u(){for(let E=0;E<o;E++)if(a.indexOf(E)===-1)return a.push(E),E;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function d(E){const b=r[E.id],M=E.uniforms,T=E.__cache;i.bindBuffer(i.UNIFORM_BUFFER,b);for(let w=0,A=M.length;w<A;w++){const R=Array.isArray(M[w])?M[w]:[M[w]];for(let v=0,_=R.length;v<_;v++){const S=R[v];if(f(S,w,v,T)===!0){const y=S.__offset,D=Array.isArray(S.value)?S.value:[S.value];let I=0;for(let U=0;U<D.length;U++){const H=D[U],$=x(H);typeof H=="number"||typeof H=="boolean"?(S.__data[0]=H,i.bufferSubData(i.UNIFORM_BUFFER,y+I,S.__data)):H.isMatrix3?(S.__data[0]=H.elements[0],S.__data[1]=H.elements[1],S.__data[2]=H.elements[2],S.__data[3]=0,S.__data[4]=H.elements[3],S.__data[5]=H.elements[4],S.__data[6]=H.elements[5],S.__data[7]=0,S.__data[8]=H.elements[6],S.__data[9]=H.elements[7],S.__data[10]=H.elements[8],S.__data[11]=0):(H.toArray(S.__data,I),I+=$.storage/Float32Array.BYTES_PER_ELEMENT)}i.bufferSubData(i.UNIFORM_BUFFER,y,S.__data)}}}i.bindBuffer(i.UNIFORM_BUFFER,null)}function f(E,b,M,T){const w=E.value,A=b+"_"+M;if(T[A]===void 0)return typeof w=="number"||typeof w=="boolean"?T[A]=w:T[A]=w.clone(),!0;{const R=T[A];if(typeof w=="number"||typeof w=="boolean"){if(R!==w)return T[A]=w,!0}else if(R.equals(w)===!1)return R.copy(w),!0}return!1}function m(E){const b=E.uniforms;let M=0;const T=16;for(let A=0,R=b.length;A<R;A++){const v=Array.isArray(b[A])?b[A]:[b[A]];for(let _=0,S=v.length;_<S;_++){const y=v[_],D=Array.isArray(y.value)?y.value:[y.value];for(let I=0,U=D.length;I<U;I++){const H=D[I],$=x(H),V=M%T,tt=V%$.boundary,st=V+tt;M+=tt,st!==0&&T-st<$.storage&&(M+=T-st),y.__data=new Float32Array($.storage/Float32Array.BYTES_PER_ELEMENT),y.__offset=M,M+=$.storage}}}const w=M%T;return w>0&&(M+=T-w),E.__size=M,E.__cache={},this}function x(E){const b={boundary:0,storage:0};return typeof E=="number"||typeof E=="boolean"?(b.boundary=4,b.storage=4):E.isVector2?(b.boundary=8,b.storage=8):E.isVector3||E.isColor?(b.boundary=16,b.storage=12):E.isVector4?(b.boundary=16,b.storage=16):E.isMatrix3?(b.boundary=48,b.storage=48):E.isMatrix4?(b.boundary=64,b.storage=64):E.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",E),b}function g(E){const b=E.target;b.removeEventListener("dispose",g);const M=a.indexOf(b.__bindingPointIndex);a.splice(M,1),i.deleteBuffer(r[b.id]),delete r[b.id],delete s[b.id]}function p(){for(const E in r)i.deleteBuffer(r[E]);a=[],r={},s={}}return{bind:c,update:l,dispose:p}}class cv{constructor(t={}){const{canvas:e=yd(),context:n=null,depth:r=!0,stencil:s=!1,alpha:a=!1,antialias:o=!1,premultipliedAlpha:c=!0,preserveDrawingBuffer:l=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:u=!1,reversedDepthBuffer:d=!1}=t;this.isWebGLRenderer=!0;let f;if(n!==null){if(typeof WebGLRenderingContext<"u"&&n instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");f=n.getContextAttributes().alpha}else f=a;const m=new Uint32Array(4),x=new Int32Array(4);let g=null,p=null;const E=[],b=[];this.domElement=e,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=_i,this.toneMappingExposure=1,this.transmissionResolutionScale=1;const M=this;let T=!1;this._outputColorSpace=rn;let w=0,A=0,R=null,v=-1,_=null;const S=new le,y=new le;let D=null;const I=new Ht(0);let U=0,H=e.width,$=e.height,V=1,tt=null,st=null;const ct=new le(0,0,H,$),ft=new le(0,0,H,$);let Ct=!1;const zt=new xc;let it=!1,W=!1;const Z=new ne,F=new O,B=new le,k={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let X=!1;function K(){return R===null?V:1}let P=n;function ht(L,q){return e.getContext(L,q)}try{const L={alpha:!0,depth:r,stencil:s,antialias:o,premultipliedAlpha:c,preserveDrawingBuffer:l,powerPreference:h,failIfMajorPerformanceCaveat:u};if("setAttribute"in e&&e.setAttribute("data-engine",`three.js r${cc}`),e.addEventListener("webglcontextlost",bt,!1),e.addEventListener("webglcontextrestored",Pt,!1),e.addEventListener("webglcontextcreationerror",ut,!1),P===null){const q="webgl2";if(P=ht(q,L),P===null)throw ht(q)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(L){throw console.error("THREE.WebGLRenderer: "+L.message),L}let at,_t,gt,vt,xt,Nt,Se,me,N,C,j,rt,lt,nt,kt,Mt,Ft,Ot,pt,At,qt,Bt,wt,jt;function G(){at=new _m(P),at.init(),Bt=new tv(P,at),_t=new um(P,at,t,Bt),gt=new Jg(P,at),_t.reversedDepthBuffer&&d&&gt.buffers.depth.setReversed(!0),vt=new bm(P),xt=new kg,Nt=new Qg(P,at,gt,xt,_t,Bt,vt),Se=new dm(M),me=new vm(M),N=new A0(P),wt=new lm(P,N),C=new xm(P,N,vt,wt),j=new ym(P,C,N,vt),pt=new Sm(P,_t,Nt),Mt=new fm(xt),rt=new Bg(M,Se,me,at,_t,wt,Mt),lt=new av(M,xt),nt=new zg,kt=new Yg(at),Ot=new cm(M,Se,me,gt,j,f,c),Ft=new Zg(M,j,_t),jt=new ov(P,vt,_t,gt),At=new hm(P,at,vt),qt=new Mm(P,at,vt),vt.programs=rt.programs,M.capabilities=_t,M.extensions=at,M.properties=xt,M.renderLists=nt,M.shadowMap=Ft,M.state=gt,M.info=vt}G();const mt=new rv(M,P);this.xr=mt,this.getContext=function(){return P},this.getContextAttributes=function(){return P.getContextAttributes()},this.forceContextLoss=function(){const L=at.get("WEBGL_lose_context");L&&L.loseContext()},this.forceContextRestore=function(){const L=at.get("WEBGL_lose_context");L&&L.restoreContext()},this.getPixelRatio=function(){return V},this.setPixelRatio=function(L){L!==void 0&&(V=L,this.setSize(H,$,!1))},this.getSize=function(L){return L.set(H,$)},this.setSize=function(L,q,J=!0){if(mt.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}H=L,$=q,e.width=Math.floor(L*V),e.height=Math.floor(q*V),J===!0&&(e.style.width=L+"px",e.style.height=q+"px"),this.setViewport(0,0,L,q)},this.getDrawingBufferSize=function(L){return L.set(H*V,$*V).floor()},this.setDrawingBufferSize=function(L,q,J){H=L,$=q,V=J,e.width=Math.floor(L*J),e.height=Math.floor(q*J),this.setViewport(0,0,L,q)},this.getCurrentViewport=function(L){return L.copy(S)},this.getViewport=function(L){return L.copy(ct)},this.setViewport=function(L,q,J,Q){L.isVector4?ct.set(L.x,L.y,L.z,L.w):ct.set(L,q,J,Q),gt.viewport(S.copy(ct).multiplyScalar(V).round())},this.getScissor=function(L){return L.copy(ft)},this.setScissor=function(L,q,J,Q){L.isVector4?ft.set(L.x,L.y,L.z,L.w):ft.set(L,q,J,Q),gt.scissor(y.copy(ft).multiplyScalar(V).round())},this.getScissorTest=function(){return Ct},this.setScissorTest=function(L){gt.setScissorTest(Ct=L)},this.setOpaqueSort=function(L){tt=L},this.setTransparentSort=function(L){st=L},this.getClearColor=function(L){return L.copy(Ot.getClearColor())},this.setClearColor=function(){Ot.setClearColor(...arguments)},this.getClearAlpha=function(){return Ot.getClearAlpha()},this.setClearAlpha=function(){Ot.setClearAlpha(...arguments)},this.clear=function(L=!0,q=!0,J=!0){let Q=0;if(L){let Y=!1;if(R!==null){const dt=R.texture.format;Y=dt===pc||dt===dc||dt===fc}if(Y){const dt=R.texture.type,Tt=dt===Rn||dt===Vi||dt===es||dt===ns||dt===hc||dt===uc,Dt=Ot.getClearColor(),Lt=Ot.getClearAlpha(),Xt=Dt.r,Yt=Dt.g,Vt=Dt.b;Tt?(m[0]=Xt,m[1]=Yt,m[2]=Vt,m[3]=Lt,P.clearBufferuiv(P.COLOR,0,m)):(x[0]=Xt,x[1]=Yt,x[2]=Vt,x[3]=Lt,P.clearBufferiv(P.COLOR,0,x))}else Q|=P.COLOR_BUFFER_BIT}q&&(Q|=P.DEPTH_BUFFER_BIT),J&&(Q|=P.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),P.clear(Q)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){e.removeEventListener("webglcontextlost",bt,!1),e.removeEventListener("webglcontextrestored",Pt,!1),e.removeEventListener("webglcontextcreationerror",ut,!1),Ot.dispose(),nt.dispose(),kt.dispose(),xt.dispose(),Se.dispose(),me.dispose(),j.dispose(),wt.dispose(),jt.dispose(),rt.dispose(),mt.dispose(),mt.removeEventListener("sessionstart",Ln),mt.removeEventListener("sessionend",Fc),bi.stop()};function bt(L){L.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),T=!0}function Pt(){console.log("THREE.WebGLRenderer: Context Restored."),T=!1;const L=vt.autoReset,q=Ft.enabled,J=Ft.autoUpdate,Q=Ft.needsUpdate,Y=Ft.type;G(),vt.autoReset=L,Ft.enabled=q,Ft.autoUpdate=J,Ft.needsUpdate=Q,Ft.type=Y}function ut(L){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",L.statusMessage)}function ot(L){const q=L.target;q.removeEventListener("dispose",ot),It(q)}function It(L){$t(L),xt.remove(L)}function $t(L){const q=xt.get(L).programs;q!==void 0&&(q.forEach(function(J){rt.releaseProgram(J)}),L.isShaderMaterial&&rt.releaseShaderCache(L))}this.renderBufferDirect=function(L,q,J,Q,Y,dt){q===null&&(q=k);const Tt=Y.isMesh&&Y.matrixWorld.determinant()<0,Dt=ef(L,q,J,Q,Y);gt.setMaterial(Q,Tt);let Lt=J.index,Xt=1;if(Q.wireframe===!0){if(Lt=C.getWireframeAttribute(J),Lt===void 0)return;Xt=2}const Yt=J.drawRange,Vt=J.attributes.position;let te=Yt.start*Xt,oe=(Yt.start+Yt.count)*Xt;dt!==null&&(te=Math.max(te,dt.start*Xt),oe=Math.min(oe,(dt.start+dt.count)*Xt)),Lt!==null?(te=Math.max(te,0),oe=Math.min(oe,Lt.count)):Vt!=null&&(te=Math.max(te,0),oe=Math.min(oe,Vt.count));const be=oe-te;if(be<0||be===1/0)return;wt.setup(Y,Q,Dt,J,Lt);let pe,ue=At;if(Lt!==null&&(pe=N.get(Lt),ue=qt,ue.setIndex(pe)),Y.isMesh)Q.wireframe===!0?(gt.setLineWidth(Q.wireframeLinewidth*K()),ue.setMode(P.LINES)):ue.setMode(P.TRIANGLES);else if(Y.isLine){let Gt=Q.linewidth;Gt===void 0&&(Gt=1),gt.setLineWidth(Gt*K()),Y.isLineSegments?ue.setMode(P.LINES):Y.isLineLoop?ue.setMode(P.LINE_LOOP):ue.setMode(P.LINE_STRIP)}else Y.isPoints?ue.setMode(P.POINTS):Y.isSprite&&ue.setMode(P.TRIANGLES);if(Y.isBatchedMesh)if(Y._multiDrawInstances!==null)as("THREE.WebGLRenderer: renderMultiDrawInstances has been deprecated and will be removed in r184. Append to renderMultiDraw arguments and use indirection."),ue.renderMultiDrawInstances(Y._multiDrawStarts,Y._multiDrawCounts,Y._multiDrawCount,Y._multiDrawInstances);else if(at.get("WEBGL_multi_draw"))ue.renderMultiDraw(Y._multiDrawStarts,Y._multiDrawCounts,Y._multiDrawCount);else{const Gt=Y._multiDrawStarts,_e=Y._multiDrawCounts,ie=Y._multiDrawCount,Qe=Lt?N.get(Lt).bytesPerElement:1,Zi=xt.get(Q).currentProgram.getUniforms();for(let tn=0;tn<ie;tn++)Zi.setValue(P,"_gl_DrawID",tn),ue.render(Gt[tn]/Qe,_e[tn])}else if(Y.isInstancedMesh)ue.renderInstances(te,be,Y.count);else if(J.isInstancedBufferGeometry){const Gt=J._maxInstanceCount!==void 0?J._maxInstanceCount:1/0,_e=Math.min(J.instanceCount,Gt);ue.renderInstances(te,be,_e)}else ue.render(te,be)};function fe(L,q,J){L.transparent===!0&&L.side===Sn&&L.forceSinglePass===!1?(L.side=Je,L.needsUpdate=!0,ps(L,q,J),L.side=Mi,L.needsUpdate=!0,ps(L,q,J),L.side=Sn):ps(L,q,J)}this.compile=function(L,q,J=null){J===null&&(J=L),p=kt.get(J),p.init(q),b.push(p),J.traverseVisible(function(Y){Y.isLight&&Y.layers.test(q.layers)&&(p.pushLight(Y),Y.castShadow&&p.pushShadow(Y))}),L!==J&&L.traverseVisible(function(Y){Y.isLight&&Y.layers.test(q.layers)&&(p.pushLight(Y),Y.castShadow&&p.pushShadow(Y))}),p.setupLights();const Q=new Set;return L.traverse(function(Y){if(!(Y.isMesh||Y.isPoints||Y.isLine||Y.isSprite))return;const dt=Y.material;if(dt)if(Array.isArray(dt))for(let Tt=0;Tt<dt.length;Tt++){const Dt=dt[Tt];fe(Dt,J,Y),Q.add(Dt)}else fe(dt,J,Y),Q.add(dt)}),p=b.pop(),Q},this.compileAsync=function(L,q,J=null){const Q=this.compile(L,q,J);return new Promise(Y=>{function dt(){if(Q.forEach(function(Tt){xt.get(Tt).currentProgram.isReady()&&Q.delete(Tt)}),Q.size===0){Y(L);return}setTimeout(dt,10)}at.get("KHR_parallel_shader_compile")!==null?dt():setTimeout(dt,10)})};let se=null;function Vn(L){se&&se(L)}function Ln(){bi.stop()}function Fc(){bi.start()}const bi=new du;bi.setAnimationLoop(Vn),typeof self<"u"&&bi.setContext(self),this.setAnimationLoop=function(L){se=L,mt.setAnimationLoop(L),L===null?bi.stop():bi.start()},mt.addEventListener("sessionstart",Ln),mt.addEventListener("sessionend",Fc),this.render=function(L,q){if(q!==void 0&&q.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(T===!0)return;if(L.matrixWorldAutoUpdate===!0&&L.updateMatrixWorld(),q.parent===null&&q.matrixWorldAutoUpdate===!0&&q.updateMatrixWorld(),mt.enabled===!0&&mt.isPresenting===!0&&(mt.cameraAutoUpdate===!0&&mt.updateCamera(q),q=mt.getCamera()),L.isScene===!0&&L.onBeforeRender(M,L,q,R),p=kt.get(L,b.length),p.init(q),b.push(p),Z.multiplyMatrices(q.projectionMatrix,q.matrixWorldInverse),zt.setFromProjectionMatrix(Z,Hn,q.reversedDepth),W=this.localClippingEnabled,it=Mt.init(this.clippingPlanes,W),g=nt.get(L,E.length),g.init(),E.push(g),mt.enabled===!0&&mt.isPresenting===!0){const dt=M.xr.getDepthSensingMesh();dt!==null&&ga(dt,q,-1/0,M.sortObjects)}ga(L,q,0,M.sortObjects),g.finish(),M.sortObjects===!0&&g.sort(tt,st),X=mt.enabled===!1||mt.isPresenting===!1||mt.hasDepthSensing()===!1,X&&Ot.addToRenderList(g,L),this.info.render.frame++,it===!0&&Mt.beginShadows();const J=p.state.shadowsArray;Ft.render(J,L,q),it===!0&&Mt.endShadows(),this.info.autoReset===!0&&this.info.reset();const Q=g.opaque,Y=g.transmissive;if(p.setupLights(),q.isArrayCamera){const dt=q.cameras;if(Y.length>0)for(let Tt=0,Dt=dt.length;Tt<Dt;Tt++){const Lt=dt[Tt];Bc(Q,Y,L,Lt)}X&&Ot.render(L);for(let Tt=0,Dt=dt.length;Tt<Dt;Tt++){const Lt=dt[Tt];Oc(g,L,Lt,Lt.viewport)}}else Y.length>0&&Bc(Q,Y,L,q),X&&Ot.render(L),Oc(g,L,q);R!==null&&A===0&&(Nt.updateMultisampleRenderTarget(R),Nt.updateRenderTargetMipmap(R)),L.isScene===!0&&L.onAfterRender(M,L,q),wt.resetDefaultState(),v=-1,_=null,b.pop(),b.length>0?(p=b[b.length-1],it===!0&&Mt.setGlobalState(M.clippingPlanes,p.state.camera)):p=null,E.pop(),E.length>0?g=E[E.length-1]:g=null};function ga(L,q,J,Q){if(L.visible===!1)return;if(L.layers.test(q.layers)){if(L.isGroup)J=L.renderOrder;else if(L.isLOD)L.autoUpdate===!0&&L.update(q);else if(L.isLight)p.pushLight(L),L.castShadow&&p.pushShadow(L);else if(L.isSprite){if(!L.frustumCulled||zt.intersectsSprite(L)){Q&&B.setFromMatrixPosition(L.matrixWorld).applyMatrix4(Z);const Tt=j.update(L),Dt=L.material;Dt.visible&&g.push(L,Tt,Dt,J,B.z,null)}}else if((L.isMesh||L.isLine||L.isPoints)&&(!L.frustumCulled||zt.intersectsObject(L))){const Tt=j.update(L),Dt=L.material;if(Q&&(L.boundingSphere!==void 0?(L.boundingSphere===null&&L.computeBoundingSphere(),B.copy(L.boundingSphere.center)):(Tt.boundingSphere===null&&Tt.computeBoundingSphere(),B.copy(Tt.boundingSphere.center)),B.applyMatrix4(L.matrixWorld).applyMatrix4(Z)),Array.isArray(Dt)){const Lt=Tt.groups;for(let Xt=0,Yt=Lt.length;Xt<Yt;Xt++){const Vt=Lt[Xt],te=Dt[Vt.materialIndex];te&&te.visible&&g.push(L,Tt,te,J,B.z,Vt)}}else Dt.visible&&g.push(L,Tt,Dt,J,B.z,null)}}const dt=L.children;for(let Tt=0,Dt=dt.length;Tt<Dt;Tt++)ga(dt[Tt],q,J,Q)}function Oc(L,q,J,Q){const Y=L.opaque,dt=L.transmissive,Tt=L.transparent;p.setupLightsView(J),it===!0&&Mt.setGlobalState(M.clippingPlanes,J),Q&&gt.viewport(S.copy(Q)),Y.length>0&&ds(Y,q,J),dt.length>0&&ds(dt,q,J),Tt.length>0&&ds(Tt,q,J),gt.buffers.depth.setTest(!0),gt.buffers.depth.setMask(!0),gt.buffers.color.setMask(!0),gt.setPolygonOffset(!1)}function Bc(L,q,J,Q){if((J.isScene===!0?J.overrideMaterial:null)!==null)return;p.state.transmissionRenderTarget[Q.id]===void 0&&(p.state.transmissionRenderTarget[Q.id]=new Ze(1,1,{generateMipmaps:!0,type:at.has("EXT_color_buffer_half_float")||at.has("EXT_color_buffer_float")?qi:Rn,minFilter:Ni,samples:4,stencilBuffer:s,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:re.workingColorSpace}));const dt=p.state.transmissionRenderTarget[Q.id],Tt=Q.viewport||S;dt.setSize(Tt.z*M.transmissionResolutionScale,Tt.w*M.transmissionResolutionScale);const Dt=M.getRenderTarget(),Lt=M.getActiveCubeFace(),Xt=M.getActiveMipmapLevel();M.setRenderTarget(dt),M.getClearColor(I),U=M.getClearAlpha(),U<1&&M.setClearColor(16777215,.5),M.clear(),X&&Ot.render(J);const Yt=M.toneMapping;M.toneMapping=_i;const Vt=Q.viewport;if(Q.viewport!==void 0&&(Q.viewport=void 0),p.setupLightsView(Q),it===!0&&Mt.setGlobalState(M.clippingPlanes,Q),ds(L,J,Q),Nt.updateMultisampleRenderTarget(dt),Nt.updateRenderTargetMipmap(dt),at.has("WEBGL_multisampled_render_to_texture")===!1){let te=!1;for(let oe=0,be=q.length;oe<be;oe++){const pe=q[oe],ue=pe.object,Gt=pe.geometry,_e=pe.material,ie=pe.group;if(_e.side===Sn&&ue.layers.test(Q.layers)){const Qe=_e.side;_e.side=Je,_e.needsUpdate=!0,kc(ue,J,Q,Gt,_e,ie),_e.side=Qe,_e.needsUpdate=!0,te=!0}}te===!0&&(Nt.updateMultisampleRenderTarget(dt),Nt.updateRenderTargetMipmap(dt))}M.setRenderTarget(Dt,Lt,Xt),M.setClearColor(I,U),Vt!==void 0&&(Q.viewport=Vt),M.toneMapping=Yt}function ds(L,q,J){const Q=q.isScene===!0?q.overrideMaterial:null;for(let Y=0,dt=L.length;Y<dt;Y++){const Tt=L[Y],Dt=Tt.object,Lt=Tt.geometry,Xt=Tt.group;let Yt=Tt.material;Yt.allowOverride===!0&&Q!==null&&(Yt=Q),Dt.layers.test(J.layers)&&kc(Dt,q,J,Lt,Yt,Xt)}}function kc(L,q,J,Q,Y,dt){L.onBeforeRender(M,q,J,Q,Y,dt),L.modelViewMatrix.multiplyMatrices(J.matrixWorldInverse,L.matrixWorld),L.normalMatrix.getNormalMatrix(L.modelViewMatrix),Y.onBeforeRender(M,q,J,Q,L,dt),Y.transparent===!0&&Y.side===Sn&&Y.forceSinglePass===!1?(Y.side=Je,Y.needsUpdate=!0,M.renderBufferDirect(J,q,Q,Y,L,dt),Y.side=Mi,Y.needsUpdate=!0,M.renderBufferDirect(J,q,Q,Y,L,dt),Y.side=Sn):M.renderBufferDirect(J,q,Q,Y,L,dt),L.onAfterRender(M,q,J,Q,Y,dt)}function ps(L,q,J){q.isScene!==!0&&(q=k);const Q=xt.get(L),Y=p.state.lights,dt=p.state.shadowsArray,Tt=Y.state.version,Dt=rt.getParameters(L,Y.state,dt,q,J),Lt=rt.getProgramCacheKey(Dt);let Xt=Q.programs;Q.environment=L.isMeshStandardMaterial?q.environment:null,Q.fog=q.fog,Q.envMap=(L.isMeshStandardMaterial?me:Se).get(L.envMap||Q.environment),Q.envMapRotation=Q.environment!==null&&L.envMap===null?q.environmentRotation:L.envMapRotation,Xt===void 0&&(L.addEventListener("dispose",ot),Xt=new Map,Q.programs=Xt);let Yt=Xt.get(Lt);if(Yt!==void 0){if(Q.currentProgram===Yt&&Q.lightsStateVersion===Tt)return zc(L,Dt),Yt}else Dt.uniforms=rt.getUniforms(L),L.onBeforeCompile(Dt,M),Yt=rt.acquireProgram(Dt,Lt),Xt.set(Lt,Yt),Q.uniforms=Dt.uniforms;const Vt=Q.uniforms;return(!L.isShaderMaterial&&!L.isRawShaderMaterial||L.clipping===!0)&&(Vt.clippingPlanes=Mt.uniform),zc(L,Dt),Q.needsLights=rf(L),Q.lightsStateVersion=Tt,Q.needsLights&&(Vt.ambientLightColor.value=Y.state.ambient,Vt.lightProbe.value=Y.state.probe,Vt.directionalLights.value=Y.state.directional,Vt.directionalLightShadows.value=Y.state.directionalShadow,Vt.spotLights.value=Y.state.spot,Vt.spotLightShadows.value=Y.state.spotShadow,Vt.rectAreaLights.value=Y.state.rectArea,Vt.ltc_1.value=Y.state.rectAreaLTC1,Vt.ltc_2.value=Y.state.rectAreaLTC2,Vt.pointLights.value=Y.state.point,Vt.pointLightShadows.value=Y.state.pointShadow,Vt.hemisphereLights.value=Y.state.hemi,Vt.directionalShadowMap.value=Y.state.directionalShadowMap,Vt.directionalShadowMatrix.value=Y.state.directionalShadowMatrix,Vt.spotShadowMap.value=Y.state.spotShadowMap,Vt.spotLightMatrix.value=Y.state.spotLightMatrix,Vt.spotLightMap.value=Y.state.spotLightMap,Vt.pointShadowMap.value=Y.state.pointShadowMap,Vt.pointShadowMatrix.value=Y.state.pointShadowMatrix),Q.currentProgram=Yt,Q.uniformsList=null,Yt}function Hc(L){if(L.uniformsList===null){const q=L.currentProgram.getUniforms();L.uniformsList=ea.seqWithValue(q.seq,L.uniforms)}return L.uniformsList}function zc(L,q){const J=xt.get(L);J.outputColorSpace=q.outputColorSpace,J.batching=q.batching,J.batchingColor=q.batchingColor,J.instancing=q.instancing,J.instancingColor=q.instancingColor,J.instancingMorph=q.instancingMorph,J.skinning=q.skinning,J.morphTargets=q.morphTargets,J.morphNormals=q.morphNormals,J.morphColors=q.morphColors,J.morphTargetsCount=q.morphTargetsCount,J.numClippingPlanes=q.numClippingPlanes,J.numIntersection=q.numClipIntersection,J.vertexAlphas=q.vertexAlphas,J.vertexTangents=q.vertexTangents,J.toneMapping=q.toneMapping}function ef(L,q,J,Q,Y){q.isScene!==!0&&(q=k),Nt.resetTextureUnits();const dt=q.fog,Tt=Q.isMeshStandardMaterial?q.environment:null,Dt=R===null?M.outputColorSpace:R.isXRRenderTarget===!0?R.texture.colorSpace:Gi,Lt=(Q.isMeshStandardMaterial?me:Se).get(Q.envMap||Tt),Xt=Q.vertexColors===!0&&!!J.attributes.color&&J.attributes.color.itemSize===4,Yt=!!J.attributes.tangent&&(!!Q.normalMap||Q.anisotropy>0),Vt=!!J.morphAttributes.position,te=!!J.morphAttributes.normal,oe=!!J.morphAttributes.color;let be=_i;Q.toneMapped&&(R===null||R.isXRRenderTarget===!0)&&(be=M.toneMapping);const pe=J.morphAttributes.position||J.morphAttributes.normal||J.morphAttributes.color,ue=pe!==void 0?pe.length:0,Gt=xt.get(Q),_e=p.state.lights;if(it===!0&&(W===!0||L!==_)){const ze=L===_&&Q.id===v;Mt.setState(Q,L,ze)}let ie=!1;Q.version===Gt.__version?(Gt.needsLights&&Gt.lightsStateVersion!==_e.state.version||Gt.outputColorSpace!==Dt||Y.isBatchedMesh&&Gt.batching===!1||!Y.isBatchedMesh&&Gt.batching===!0||Y.isBatchedMesh&&Gt.batchingColor===!0&&Y.colorTexture===null||Y.isBatchedMesh&&Gt.batchingColor===!1&&Y.colorTexture!==null||Y.isInstancedMesh&&Gt.instancing===!1||!Y.isInstancedMesh&&Gt.instancing===!0||Y.isSkinnedMesh&&Gt.skinning===!1||!Y.isSkinnedMesh&&Gt.skinning===!0||Y.isInstancedMesh&&Gt.instancingColor===!0&&Y.instanceColor===null||Y.isInstancedMesh&&Gt.instancingColor===!1&&Y.instanceColor!==null||Y.isInstancedMesh&&Gt.instancingMorph===!0&&Y.morphTexture===null||Y.isInstancedMesh&&Gt.instancingMorph===!1&&Y.morphTexture!==null||Gt.envMap!==Lt||Q.fog===!0&&Gt.fog!==dt||Gt.numClippingPlanes!==void 0&&(Gt.numClippingPlanes!==Mt.numPlanes||Gt.numIntersection!==Mt.numIntersection)||Gt.vertexAlphas!==Xt||Gt.vertexTangents!==Yt||Gt.morphTargets!==Vt||Gt.morphNormals!==te||Gt.morphColors!==oe||Gt.toneMapping!==be||Gt.morphTargetsCount!==ue)&&(ie=!0):(ie=!0,Gt.__version=Q.version);let Qe=Gt.currentProgram;ie===!0&&(Qe=ps(Q,q,Y));let Zi=!1,tn=!1,Fr=!1;const xe=Qe.getUniforms(),ln=Gt.uniforms;if(gt.useProgram(Qe.program)&&(Zi=!0,tn=!0,Fr=!0),Q.id!==v&&(v=Q.id,tn=!0),Zi||_!==L){gt.buffers.depth.getReversed()&&L.reversedDepth!==!0&&(L._reversedDepth=!0,L.updateProjectionMatrix()),xe.setValue(P,"projectionMatrix",L.projectionMatrix),xe.setValue(P,"viewMatrix",L.matrixWorldInverse);const Ye=xe.map.cameraPosition;Ye!==void 0&&Ye.setValue(P,F.setFromMatrixPosition(L.matrixWorld)),_t.logarithmicDepthBuffer&&xe.setValue(P,"logDepthBufFC",2/(Math.log(L.far+1)/Math.LN2)),(Q.isMeshPhongMaterial||Q.isMeshToonMaterial||Q.isMeshLambertMaterial||Q.isMeshBasicMaterial||Q.isMeshStandardMaterial||Q.isShaderMaterial)&&xe.setValue(P,"isOrthographic",L.isOrthographicCamera===!0),_!==L&&(_=L,tn=!0,Fr=!0)}if(Y.isSkinnedMesh){xe.setOptional(P,Y,"bindMatrix"),xe.setOptional(P,Y,"bindMatrixInverse");const ze=Y.skeleton;ze&&(ze.boneTexture===null&&ze.computeBoneTexture(),xe.setValue(P,"boneTexture",ze.boneTexture,Nt))}Y.isBatchedMesh&&(xe.setOptional(P,Y,"batchingTexture"),xe.setValue(P,"batchingTexture",Y._matricesTexture,Nt),xe.setOptional(P,Y,"batchingIdTexture"),xe.setValue(P,"batchingIdTexture",Y._indirectTexture,Nt),xe.setOptional(P,Y,"batchingColorTexture"),Y._colorsTexture!==null&&xe.setValue(P,"batchingColorTexture",Y._colorsTexture,Nt));const hn=J.morphAttributes;if((hn.position!==void 0||hn.normal!==void 0||hn.color!==void 0)&&pt.update(Y,J,Qe),(tn||Gt.receiveShadow!==Y.receiveShadow)&&(Gt.receiveShadow=Y.receiveShadow,xe.setValue(P,"receiveShadow",Y.receiveShadow)),Q.isMeshGouraudMaterial&&Q.envMap!==null&&(ln.envMap.value=Lt,ln.flipEnvMap.value=Lt.isCubeTexture&&Lt.isRenderTargetTexture===!1?-1:1),Q.isMeshStandardMaterial&&Q.envMap===null&&q.environment!==null&&(ln.envMapIntensity.value=q.environmentIntensity),tn&&(xe.setValue(P,"toneMappingExposure",M.toneMappingExposure),Gt.needsLights&&nf(ln,Fr),dt&&Q.fog===!0&&lt.refreshFogUniforms(ln,dt),lt.refreshMaterialUniforms(ln,Q,V,$,p.state.transmissionRenderTarget[L.id]),ea.upload(P,Hc(Gt),ln,Nt)),Q.isShaderMaterial&&Q.uniformsNeedUpdate===!0&&(ea.upload(P,Hc(Gt),ln,Nt),Q.uniformsNeedUpdate=!1),Q.isSpriteMaterial&&xe.setValue(P,"center",Y.center),xe.setValue(P,"modelViewMatrix",Y.modelViewMatrix),xe.setValue(P,"normalMatrix",Y.normalMatrix),xe.setValue(P,"modelMatrix",Y.matrixWorld),Q.isShaderMaterial||Q.isRawShaderMaterial){const ze=Q.uniformsGroups;for(let Ye=0,va=ze.length;Ye<va;Ye++){const Si=ze[Ye];jt.update(Si,Qe),jt.bind(Si,Qe)}}return Qe}function nf(L,q){L.ambientLightColor.needsUpdate=q,L.lightProbe.needsUpdate=q,L.directionalLights.needsUpdate=q,L.directionalLightShadows.needsUpdate=q,L.pointLights.needsUpdate=q,L.pointLightShadows.needsUpdate=q,L.spotLights.needsUpdate=q,L.spotLightShadows.needsUpdate=q,L.rectAreaLights.needsUpdate=q,L.hemisphereLights.needsUpdate=q}function rf(L){return L.isMeshLambertMaterial||L.isMeshToonMaterial||L.isMeshPhongMaterial||L.isMeshStandardMaterial||L.isShadowMaterial||L.isShaderMaterial&&L.lights===!0}this.getActiveCubeFace=function(){return w},this.getActiveMipmapLevel=function(){return A},this.getRenderTarget=function(){return R},this.setRenderTargetTextures=function(L,q,J){const Q=xt.get(L);Q.__autoAllocateDepthBuffer=L.resolveDepthBuffer===!1,Q.__autoAllocateDepthBuffer===!1&&(Q.__useRenderToTexture=!1),xt.get(L.texture).__webglTexture=q,xt.get(L.depthTexture).__webglTexture=Q.__autoAllocateDepthBuffer?void 0:J,Q.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(L,q){const J=xt.get(L);J.__webglFramebuffer=q,J.__useDefaultFramebuffer=q===void 0};const sf=P.createFramebuffer();this.setRenderTarget=function(L,q=0,J=0){R=L,w=q,A=J;let Q=!0,Y=null,dt=!1,Tt=!1;if(L){const Lt=xt.get(L);if(Lt.__useDefaultFramebuffer!==void 0)gt.bindFramebuffer(P.FRAMEBUFFER,null),Q=!1;else if(Lt.__webglFramebuffer===void 0)Nt.setupRenderTarget(L);else if(Lt.__hasExternalTextures)Nt.rebindTextures(L,xt.get(L.texture).__webglTexture,xt.get(L.depthTexture).__webglTexture);else if(L.depthBuffer){const Vt=L.depthTexture;if(Lt.__boundDepthTexture!==Vt){if(Vt!==null&&xt.has(Vt)&&(L.width!==Vt.image.width||L.height!==Vt.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");Nt.setupDepthRenderbuffer(L)}}const Xt=L.texture;(Xt.isData3DTexture||Xt.isDataArrayTexture||Xt.isCompressedArrayTexture)&&(Tt=!0);const Yt=xt.get(L).__webglFramebuffer;L.isWebGLCubeRenderTarget?(Array.isArray(Yt[q])?Y=Yt[q][J]:Y=Yt[q],dt=!0):L.samples>0&&Nt.useMultisampledRTT(L)===!1?Y=xt.get(L).__webglMultisampledFramebuffer:Array.isArray(Yt)?Y=Yt[J]:Y=Yt,S.copy(L.viewport),y.copy(L.scissor),D=L.scissorTest}else S.copy(ct).multiplyScalar(V).floor(),y.copy(ft).multiplyScalar(V).floor(),D=Ct;if(J!==0&&(Y=sf),gt.bindFramebuffer(P.FRAMEBUFFER,Y)&&Q&&gt.drawBuffers(L,Y),gt.viewport(S),gt.scissor(y),gt.setScissorTest(D),dt){const Lt=xt.get(L.texture);P.framebufferTexture2D(P.FRAMEBUFFER,P.COLOR_ATTACHMENT0,P.TEXTURE_CUBE_MAP_POSITIVE_X+q,Lt.__webglTexture,J)}else if(Tt){const Lt=q;for(let Xt=0;Xt<L.textures.length;Xt++){const Yt=xt.get(L.textures[Xt]);P.framebufferTextureLayer(P.FRAMEBUFFER,P.COLOR_ATTACHMENT0+Xt,Yt.__webglTexture,J,Lt)}}else if(L!==null&&J!==0){const Lt=xt.get(L.texture);P.framebufferTexture2D(P.FRAMEBUFFER,P.COLOR_ATTACHMENT0,P.TEXTURE_2D,Lt.__webglTexture,J)}v=-1},this.readRenderTargetPixels=function(L,q,J,Q,Y,dt,Tt,Dt=0){if(!(L&&L.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Lt=xt.get(L).__webglFramebuffer;if(L.isWebGLCubeRenderTarget&&Tt!==void 0&&(Lt=Lt[Tt]),Lt){gt.bindFramebuffer(P.FRAMEBUFFER,Lt);try{const Xt=L.textures[Dt],Yt=Xt.format,Vt=Xt.type;if(!_t.textureFormatReadable(Yt)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!_t.textureTypeReadable(Vt)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}q>=0&&q<=L.width-Q&&J>=0&&J<=L.height-Y&&(L.textures.length>1&&P.readBuffer(P.COLOR_ATTACHMENT0+Dt),P.readPixels(q,J,Q,Y,Bt.convert(Yt),Bt.convert(Vt),dt))}finally{const Xt=R!==null?xt.get(R).__webglFramebuffer:null;gt.bindFramebuffer(P.FRAMEBUFFER,Xt)}}},this.readRenderTargetPixelsAsync=async function(L,q,J,Q,Y,dt,Tt,Dt=0){if(!(L&&L.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let Lt=xt.get(L).__webglFramebuffer;if(L.isWebGLCubeRenderTarget&&Tt!==void 0&&(Lt=Lt[Tt]),Lt)if(q>=0&&q<=L.width-Q&&J>=0&&J<=L.height-Y){gt.bindFramebuffer(P.FRAMEBUFFER,Lt);const Xt=L.textures[Dt],Yt=Xt.format,Vt=Xt.type;if(!_t.textureFormatReadable(Yt))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!_t.textureTypeReadable(Vt))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");const te=P.createBuffer();P.bindBuffer(P.PIXEL_PACK_BUFFER,te),P.bufferData(P.PIXEL_PACK_BUFFER,dt.byteLength,P.STREAM_READ),L.textures.length>1&&P.readBuffer(P.COLOR_ATTACHMENT0+Dt),P.readPixels(q,J,Q,Y,Bt.convert(Yt),Bt.convert(Vt),0);const oe=R!==null?xt.get(R).__webglFramebuffer:null;gt.bindFramebuffer(P.FRAMEBUFFER,oe);const be=P.fenceSync(P.SYNC_GPU_COMMANDS_COMPLETE,0);return P.flush(),await Ed(P,be,4),P.bindBuffer(P.PIXEL_PACK_BUFFER,te),P.getBufferSubData(P.PIXEL_PACK_BUFFER,0,dt),P.deleteBuffer(te),P.deleteSync(be),dt}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(L,q=null,J=0){const Q=Math.pow(2,-J),Y=Math.floor(L.image.width*Q),dt=Math.floor(L.image.height*Q),Tt=q!==null?q.x:0,Dt=q!==null?q.y:0;Nt.setTexture2D(L,0),P.copyTexSubImage2D(P.TEXTURE_2D,J,0,0,Tt,Dt,Y,dt),gt.unbindTexture()};const af=P.createFramebuffer(),of=P.createFramebuffer();this.copyTextureToTexture=function(L,q,J=null,Q=null,Y=0,dt=null){dt===null&&(Y!==0?(as("WebGLRenderer: copyTextureToTexture function signature has changed to support src and dst mipmap levels."),dt=Y,Y=0):dt=0);let Tt,Dt,Lt,Xt,Yt,Vt,te,oe,be;const pe=L.isCompressedTexture?L.mipmaps[dt]:L.image;if(J!==null)Tt=J.max.x-J.min.x,Dt=J.max.y-J.min.y,Lt=J.isBox3?J.max.z-J.min.z:1,Xt=J.min.x,Yt=J.min.y,Vt=J.isBox3?J.min.z:0;else{const hn=Math.pow(2,-Y);Tt=Math.floor(pe.width*hn),Dt=Math.floor(pe.height*hn),L.isDataArrayTexture?Lt=pe.depth:L.isData3DTexture?Lt=Math.floor(pe.depth*hn):Lt=1,Xt=0,Yt=0,Vt=0}Q!==null?(te=Q.x,oe=Q.y,be=Q.z):(te=0,oe=0,be=0);const ue=Bt.convert(q.format),Gt=Bt.convert(q.type);let _e;q.isData3DTexture?(Nt.setTexture3D(q,0),_e=P.TEXTURE_3D):q.isDataArrayTexture||q.isCompressedArrayTexture?(Nt.setTexture2DArray(q,0),_e=P.TEXTURE_2D_ARRAY):(Nt.setTexture2D(q,0),_e=P.TEXTURE_2D),P.pixelStorei(P.UNPACK_FLIP_Y_WEBGL,q.flipY),P.pixelStorei(P.UNPACK_PREMULTIPLY_ALPHA_WEBGL,q.premultiplyAlpha),P.pixelStorei(P.UNPACK_ALIGNMENT,q.unpackAlignment);const ie=P.getParameter(P.UNPACK_ROW_LENGTH),Qe=P.getParameter(P.UNPACK_IMAGE_HEIGHT),Zi=P.getParameter(P.UNPACK_SKIP_PIXELS),tn=P.getParameter(P.UNPACK_SKIP_ROWS),Fr=P.getParameter(P.UNPACK_SKIP_IMAGES);P.pixelStorei(P.UNPACK_ROW_LENGTH,pe.width),P.pixelStorei(P.UNPACK_IMAGE_HEIGHT,pe.height),P.pixelStorei(P.UNPACK_SKIP_PIXELS,Xt),P.pixelStorei(P.UNPACK_SKIP_ROWS,Yt),P.pixelStorei(P.UNPACK_SKIP_IMAGES,Vt);const xe=L.isDataArrayTexture||L.isData3DTexture,ln=q.isDataArrayTexture||q.isData3DTexture;if(L.isDepthTexture){const hn=xt.get(L),ze=xt.get(q),Ye=xt.get(hn.__renderTarget),va=xt.get(ze.__renderTarget);gt.bindFramebuffer(P.READ_FRAMEBUFFER,Ye.__webglFramebuffer),gt.bindFramebuffer(P.DRAW_FRAMEBUFFER,va.__webglFramebuffer);for(let Si=0;Si<Lt;Si++)xe&&(P.framebufferTextureLayer(P.READ_FRAMEBUFFER,P.COLOR_ATTACHMENT0,xt.get(L).__webglTexture,Y,Vt+Si),P.framebufferTextureLayer(P.DRAW_FRAMEBUFFER,P.COLOR_ATTACHMENT0,xt.get(q).__webglTexture,dt,be+Si)),P.blitFramebuffer(Xt,Yt,Tt,Dt,te,oe,Tt,Dt,P.DEPTH_BUFFER_BIT,P.NEAREST);gt.bindFramebuffer(P.READ_FRAMEBUFFER,null),gt.bindFramebuffer(P.DRAW_FRAMEBUFFER,null)}else if(Y!==0||L.isRenderTargetTexture||xt.has(L)){const hn=xt.get(L),ze=xt.get(q);gt.bindFramebuffer(P.READ_FRAMEBUFFER,af),gt.bindFramebuffer(P.DRAW_FRAMEBUFFER,of);for(let Ye=0;Ye<Lt;Ye++)xe?P.framebufferTextureLayer(P.READ_FRAMEBUFFER,P.COLOR_ATTACHMENT0,hn.__webglTexture,Y,Vt+Ye):P.framebufferTexture2D(P.READ_FRAMEBUFFER,P.COLOR_ATTACHMENT0,P.TEXTURE_2D,hn.__webglTexture,Y),ln?P.framebufferTextureLayer(P.DRAW_FRAMEBUFFER,P.COLOR_ATTACHMENT0,ze.__webglTexture,dt,be+Ye):P.framebufferTexture2D(P.DRAW_FRAMEBUFFER,P.COLOR_ATTACHMENT0,P.TEXTURE_2D,ze.__webglTexture,dt),Y!==0?P.blitFramebuffer(Xt,Yt,Tt,Dt,te,oe,Tt,Dt,P.COLOR_BUFFER_BIT,P.NEAREST):ln?P.copyTexSubImage3D(_e,dt,te,oe,be+Ye,Xt,Yt,Tt,Dt):P.copyTexSubImage2D(_e,dt,te,oe,Xt,Yt,Tt,Dt);gt.bindFramebuffer(P.READ_FRAMEBUFFER,null),gt.bindFramebuffer(P.DRAW_FRAMEBUFFER,null)}else ln?L.isDataTexture||L.isData3DTexture?P.texSubImage3D(_e,dt,te,oe,be,Tt,Dt,Lt,ue,Gt,pe.data):q.isCompressedArrayTexture?P.compressedTexSubImage3D(_e,dt,te,oe,be,Tt,Dt,Lt,ue,pe.data):P.texSubImage3D(_e,dt,te,oe,be,Tt,Dt,Lt,ue,Gt,pe):L.isDataTexture?P.texSubImage2D(P.TEXTURE_2D,dt,te,oe,Tt,Dt,ue,Gt,pe.data):L.isCompressedTexture?P.compressedTexSubImage2D(P.TEXTURE_2D,dt,te,oe,pe.width,pe.height,ue,pe.data):P.texSubImage2D(P.TEXTURE_2D,dt,te,oe,Tt,Dt,ue,Gt,pe);P.pixelStorei(P.UNPACK_ROW_LENGTH,ie),P.pixelStorei(P.UNPACK_IMAGE_HEIGHT,Qe),P.pixelStorei(P.UNPACK_SKIP_PIXELS,Zi),P.pixelStorei(P.UNPACK_SKIP_ROWS,tn),P.pixelStorei(P.UNPACK_SKIP_IMAGES,Fr),dt===0&&q.generateMipmaps&&P.generateMipmap(_e),gt.unbindTexture()},this.initRenderTarget=function(L){xt.get(L).__webglFramebuffer===void 0&&Nt.setupRenderTarget(L)},this.initTexture=function(L){L.isCubeTexture?Nt.setTextureCube(L,0):L.isData3DTexture?Nt.setTexture3D(L,0):L.isDataArrayTexture||L.isCompressedArrayTexture?Nt.setTexture2DArray(L,0):Nt.setTexture2D(L,0),gt.unbindTexture()},this.resetState=function(){w=0,A=0,R=null,gt.reset(),wt.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return Hn}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(t){this._outputColorSpace=t;const e=this.getContext();e.drawingBufferColorSpace=re._getDrawingBufferColorSpace(t),e.unpackColorSpace=re._getUnpackColorSpace()}}const lv={armL:[.2,-1,0],forearmL:[.15,-1,.1],armR:[-.2,-1,0],forearmR:[-.15,-1,.1],thighL:[.05,-1,0],shinL:[0,-1,0],footL:[0,-.15,1],thighR:[-.05,-1,0],shinR:[0,-1,0],footR:[0,-.15,1]};function hv(i,t){const e=i.scale??1,n=m=>new O(...i.dir?.[m]??lv[m]).normalize(),r=Array.from({length:uo},()=>new O),s=(m,x)=>r[m].copy(x),a=(m,x,g)=>new O(m,x,g).multiplyScalar(e);s(z.hipL,a(.1,0,0)),s(z.hipR,a(-.1,0,0)),s(z.shL,a(.19,.52,-.02)),s(z.shR,a(-.19,.52,-.02));const o=new ke().setFromEuler(new vn(i.head?.[1]??0,i.head?.[0]??0,0,"YXZ")),c=a(0,.6,-.02),l=(m,x,g)=>a(m,x,g).applyQuaternion(o).add(c);s(z.nose,l(0,.1,.11)),s(z.eyeL,l(.032,.135,.09)),s(z.eyeR,l(-.032,.135,.09)),s(z.eyeInL,l(.018,.135,.095)),s(z.eyeInR,l(-.018,.135,.095)),s(z.eyeOutL,l(.05,.135,.08)),s(z.eyeOutR,l(-.05,.135,.08)),s(z.earL,l(.075,.12,0)),s(z.earR,l(-.075,.12,0)),s(z.mouthL,l(.024,.06,.095)),s(z.mouthR,l(-.024,.06,.095));for(const m of["L","R"]){const x=r[m==="L"?z.shL:z.shR],g=r[m==="L"?z.hipL:z.hipR],p=x.clone().addScaledVector(n(`arm${m}`),.29*e),E=p.clone().addScaledVector(n(`forearm${m}`),.26*e);s(m==="L"?z.elL:z.elR,p),s(m==="L"?z.wrL:z.wrR,E);const b=E.clone().addScaledVector(n(`forearm${m}`),.08*e);s(m==="L"?z.indexL:z.indexR,b.clone().add(a(0,0,.02))),s(m==="L"?z.pinkyL:z.pinkyR,b.clone().add(a(0,0,-.02))),s(m==="L"?z.thumbL:z.thumbR,E.clone().addScaledVector(n(`forearm${m}`),.04*e).add(a(0,0,.04)));const M=g.clone().addScaledVector(n(`thigh${m}`),.43*e),T=M.clone().addScaledVector(n(`shin${m}`),.42*e);s(m==="L"?z.knL:z.knR,M),s(m==="L"?z.anL:z.anR,T);const w=T.clone().add(a(0,-.04,-.05));s(m==="L"?z.heelL:z.heelR,w),s(m==="L"?z.toeL:z.toeR,w.clone().addScaledVector(n(`foot${m}`),.24*e))}const h=new ke().setFromAxisAngle(new O(0,1,0),i.yaw??0),u=new Set([z.knL,z.knR,z.anL,z.anR,z.heelL,z.heelR,z.toeL,z.toeR]),d=[],f=[];for(let m=0;m<uo;m++){const x=r[m].clone().applyQuaternion(h),g=u.has(m)?i.legsVis??.98:.98;d.push({x:x.x,y:x.y,z:x.z,v:g});const p=_f({x:x.x+i.T.x,y:x.y+i.T.y,z:x.z+i.T.z},t);f.push({x:p.x,y:p.y,z:0,v:g})}return{world:d,image:f}}function uv(i,t,e){const n=[];for(let r=0;r<i;r++){const s=t*1.3+r*2.1,a=(r-(i-1)/2)*.9+Math.sin(t*.4+r)*.15,o=Math.sin(s);n.push(hv({T:{x:a,y:-.1+.03*Math.sin(s*2),z:-3-r*.6},yaw:Math.sin(t*.5+r)*.5,head:[Math.sin(t*.7+r)*.4,Math.sin(t*.9)*.15],dir:{armR:[-1,.3+.5*o,.1],forearmR:[-.3,1,.1+.3*o],armL:[.5+.4*Math.cos(s),-.8+.6*Math.cos(s*.5),.3],forearmL:[.2,-.3,1],thighL:[.12,-1,.25*Math.max(0,o)],shinL:[.05,-1,-.2*Math.max(0,o)]},scale:1-r*.08},e))}return n}function fv(i,t,e,n){const r=i.image,s=new Float32Array(t*e),a=f=>[r[f].x*n,r[f].y],o=Math.hypot(a(z.shL)[0]-a(z.hipL)[0],a(z.shL)[1]-a(z.hipL)[1]),c=[[z.shL,z.elL,.11],[z.elL,z.wrL,.09],[z.shR,z.elR,.11],[z.elR,z.wrR,.09],[z.hipL,z.knL,.15],[z.knL,z.anL,.11],[z.hipR,z.knR,.15],[z.knR,z.anR,.11],[z.anL,z.toeL,.07],[z.anR,z.toeR,.07],[z.shL,z.hipR,.2],[z.shR,z.hipL,.2],[z.shL,z.shR,.14],[z.hipL,z.hipR,.16]],l=a(z.nose),h=a(z.earL),u=a(z.earR),d=Math.max(Math.hypot(h[0]-u[0],h[1]-u[1])*.9,o*.22);for(let f=0;f<e;f++)for(let m=0;m<t;m++){const x=(m+.5)/t*n,g=(f+.5)/e;let p=Math.hypot(x-l[0],g-(l[1]-d*.2))-d;for(const[E,b,M]of c){const T=a(E),w=a(b),A=w[0]-T[0],R=w[1]-T[1],v=A*A+R*R||1,_=Math.max(0,Math.min(1,((x-T[0])*A+(g-T[1])*R)/v));p=Math.min(p,Math.hypot(x-T[0]-A*_,g-T[1]-R*_)-M*o)}s[f*t+m]=Math.max(0,Math.min(1,.5-p/(o*.04)))}return{data:s,w:t,h:e}}function Ql(i){const t=new Map,e=new Map,n=i.clone();return _u(i,n,function(r,s){t.set(s,r),e.set(r,s)}),n.traverse(function(r){if(!r.isSkinnedMesh)return;const s=r,a=t.get(r),o=a.skeleton.bones;s.skeleton=a.skeleton.clone(),s.bindMatrix.copy(a.bindMatrix),s.skeleton.bones=o.map(function(c){return e.get(c)}),s.bind(s.skeleton,s.bindMatrix)}),n}function _u(i,t,e){e(i,t);for(let n=0;n<i.children.length;n++)_u(i.children[n],t.children[n],e)}class xu extends Wt{constructor(t,e,n=!1,r=!1,s=1e4){const a=new Ue;super(a,e),this.isMarchingCubes=!0;const o=this,c=new Float32Array(36),l=new Float32Array(36),h=new Float32Array(36);this.enableUvs=n,this.enableColors=r,this.init=function(E){this.resolution=E,this.isolation=80,this.size=E,this.size2=this.size*this.size,this.size3=this.size2*this.size,this.halfsize=this.size/2,this.delta=2/this.size,this.yd=this.size,this.zd=this.size2,this.field=new Float32Array(this.size3),this.normal_cache=new Float32Array(this.size3*3),this.palette=new Float32Array(this.size3*3),this.count=0;const b=s*3;this.positionArray=new Float32Array(b*3);const M=new ae(this.positionArray,3);M.setUsage(vs),a.setAttribute("position",M),this.normalArray=new Float32Array(b*3);const T=new ae(this.normalArray,3);if(T.setUsage(vs),a.setAttribute("normal",T),this.enableUvs){this.uvArray=new Float32Array(b*2);const w=new ae(this.uvArray,2);w.setUsage(vs),a.setAttribute("uv",w)}if(this.enableColors){this.colorArray=new Float32Array(b*3);const w=new ae(this.colorArray,3);w.setUsage(vs),a.setAttribute("color",w)}a.boundingSphere=new Dr(new O,1)};function u(E,b,M){return E+(b-E)*M}function d(E,b,M,T,w,A,R,v,_,S){const y=(M-R)/(v-R),D=o.normal_cache;c[b+0]=T+y*o.delta,c[b+1]=w,c[b+2]=A,l[b+0]=u(D[E+0],D[E+3],y),l[b+1]=u(D[E+1],D[E+4],y),l[b+2]=u(D[E+2],D[E+5],y),h[b+0]=u(o.palette[_*3+0],o.palette[S*3+0],y),h[b+1]=u(o.palette[_*3+1],o.palette[S*3+1],y),h[b+2]=u(o.palette[_*3+2],o.palette[S*3+2],y)}function f(E,b,M,T,w,A,R,v,_,S){const y=(M-R)/(v-R),D=o.normal_cache;c[b+0]=T,c[b+1]=w+y*o.delta,c[b+2]=A;const I=E+o.yd*3;l[b+0]=u(D[E+0],D[I+0],y),l[b+1]=u(D[E+1],D[I+1],y),l[b+2]=u(D[E+2],D[I+2],y),h[b+0]=u(o.palette[_*3+0],o.palette[S*3+0],y),h[b+1]=u(o.palette[_*3+1],o.palette[S*3+1],y),h[b+2]=u(o.palette[_*3+2],o.palette[S*3+2],y)}function m(E,b,M,T,w,A,R,v,_,S){const y=(M-R)/(v-R),D=o.normal_cache;c[b+0]=T,c[b+1]=w,c[b+2]=A+y*o.delta;const I=E+o.zd*3;l[b+0]=u(D[E+0],D[I+0],y),l[b+1]=u(D[E+1],D[I+1],y),l[b+2]=u(D[E+2],D[I+2],y),h[b+0]=u(o.palette[_*3+0],o.palette[S*3+0],y),h[b+1]=u(o.palette[_*3+1],o.palette[S*3+1],y),h[b+2]=u(o.palette[_*3+2],o.palette[S*3+2],y)}function x(E){const b=E*3;o.normal_cache[b]===0&&(o.normal_cache[b+0]=o.field[E-1]-o.field[E+1],o.normal_cache[b+1]=o.field[E-o.yd]-o.field[E+o.yd],o.normal_cache[b+2]=o.field[E-o.zd]-o.field[E+o.zd])}function g(E,b,M,T,w){const A=T+1,R=T+o.yd,v=T+o.zd,_=A+o.yd,S=A+o.zd,y=T+o.yd+o.zd,D=A+o.yd+o.zd;let I=0;const U=o.field[T],H=o.field[A],$=o.field[R],V=o.field[_],tt=o.field[v],st=o.field[S],ct=o.field[y],ft=o.field[D];U<w&&(I|=1),H<w&&(I|=2),$<w&&(I|=8),V<w&&(I|=4),tt<w&&(I|=16),st<w&&(I|=32),ct<w&&(I|=128),ft<w&&(I|=64);const Ct=dv[I];if(Ct===0)return 0;const zt=o.delta,it=E+zt,W=b+zt,Z=M+zt;Ct&1&&(x(T),x(A),d(T*3,0,w,E,b,M,U,H,T,A)),Ct&2&&(x(A),x(_),f(A*3,3,w,it,b,M,H,V,A,_)),Ct&4&&(x(R),x(_),d(R*3,6,w,E,W,M,$,V,R,_)),Ct&8&&(x(T),x(R),f(T*3,9,w,E,b,M,U,$,T,R)),Ct&16&&(x(v),x(S),d(v*3,12,w,E,b,Z,tt,st,v,S)),Ct&32&&(x(S),x(D),f(S*3,15,w,it,b,Z,st,ft,S,D)),Ct&64&&(x(y),x(D),d(y*3,18,w,E,W,Z,ct,ft,y,D)),Ct&128&&(x(v),x(y),f(v*3,21,w,E,b,Z,tt,ct,v,y)),Ct&256&&(x(T),x(v),m(T*3,24,w,E,b,M,U,tt,T,v)),Ct&512&&(x(A),x(S),m(A*3,27,w,it,b,M,H,st,A,S)),Ct&1024&&(x(_),x(D),m(_*3,30,w,it,W,M,V,ft,_,D)),Ct&2048&&(x(R),x(y),m(R*3,33,w,E,W,M,$,ct,R,y)),I<<=4;let F,B,k,X=0,K=0;for(;zs[I+K]!=-1;)F=I+K,B=F+1,k=F+2,p(c,l,h,3*zs[F],3*zs[B],3*zs[k]),K+=3,X++;return X}function p(E,b,M,T,w,A){const R=o.count*3;if(o.positionArray[R+0]=E[T],o.positionArray[R+1]=E[T+1],o.positionArray[R+2]=E[T+2],o.positionArray[R+3]=E[w],o.positionArray[R+4]=E[w+1],o.positionArray[R+5]=E[w+2],o.positionArray[R+6]=E[A],o.positionArray[R+7]=E[A+1],o.positionArray[R+8]=E[A+2],o.material.flatShading===!0){const v=(b[T+0]+b[w+0]+b[A+0])/3,_=(b[T+1]+b[w+1]+b[A+1])/3,S=(b[T+2]+b[w+2]+b[A+2])/3;o.normalArray[R+0]=v,o.normalArray[R+1]=_,o.normalArray[R+2]=S,o.normalArray[R+3]=v,o.normalArray[R+4]=_,o.normalArray[R+5]=S,o.normalArray[R+6]=v,o.normalArray[R+7]=_,o.normalArray[R+8]=S}else o.normalArray[R+0]=b[T+0],o.normalArray[R+1]=b[T+1],o.normalArray[R+2]=b[T+2],o.normalArray[R+3]=b[w+0],o.normalArray[R+4]=b[w+1],o.normalArray[R+5]=b[w+2],o.normalArray[R+6]=b[A+0],o.normalArray[R+7]=b[A+1],o.normalArray[R+8]=b[A+2];if(o.enableUvs){const v=o.count*2;o.uvArray[v+0]=E[T+0],o.uvArray[v+1]=E[T+2],o.uvArray[v+2]=E[w+0],o.uvArray[v+3]=E[w+2],o.uvArray[v+4]=E[A+0],o.uvArray[v+5]=E[A+2]}o.enableColors&&(o.colorArray[R+0]=M[T+0],o.colorArray[R+1]=M[T+1],o.colorArray[R+2]=M[T+2],o.colorArray[R+3]=M[w+0],o.colorArray[R+4]=M[w+1],o.colorArray[R+5]=M[w+2],o.colorArray[R+6]=M[A+0],o.colorArray[R+7]=M[A+1],o.colorArray[R+8]=M[A+2]),o.count+=3}this.addBall=function(E,b,M,T,w,A){const R=Math.sign(T);T=Math.abs(T);const v=A!=null;let _=new Ht(E,b,M);if(v)try{_=A instanceof Ht?A:Array.isArray(A)?new Ht(Math.min(Math.abs(A[0]),1),Math.min(Math.abs(A[1]),1),Math.min(Math.abs(A[2]),1)):new Ht(A)}catch{_=new Ht(E,b,M)}const S=this.size*Math.sqrt(T/w),y=M*this.size,D=b*this.size,I=E*this.size;let U=Math.floor(y-S);U<1&&(U=1);let H=Math.floor(y+S);H>this.size-1&&(H=this.size-1);let $=Math.floor(D-S);$<1&&($=1);let V=Math.floor(D+S);V>this.size-1&&(V=this.size-1);let tt=Math.floor(I-S);tt<1&&(tt=1);let st=Math.floor(I+S);st>this.size-1&&(st=this.size-1);let ct,ft,Ct,zt,it,W,Z,F,B,k,X;for(Ct=U;Ct<H;Ct++)for(it=this.size2*Ct,F=Ct/this.size-M,B=F*F,ft=$;ft<V;ft++)for(zt=it+this.size*ft,Z=ft/this.size-b,k=Z*Z,ct=tt;ct<st;ct++)if(W=ct/this.size-E,X=T/(1e-6+W*W+k+B)-w,X>0){this.field[zt+ct]+=X*R;const K=Math.sqrt((ct-I)*(ct-I)+(ft-D)*(ft-D)+(Ct-y)*(Ct-y))/S,P=1-K*K*K*(K*(K*6-15)+10);this.palette[(zt+ct)*3+0]+=_.r*P,this.palette[(zt+ct)*3+1]+=_.g*P,this.palette[(zt+ct)*3+2]+=_.b*P}},this.addPlaneX=function(E,b){const M=this.size,T=this.yd,w=this.zd,A=this.field;let R,v,_,S,y,D,I,U=M*Math.sqrt(E/b);for(U>M&&(U=M),R=0;R<U;R++)if(D=R/M,S=D*D,y=E/(1e-4+S)-b,y>0)for(v=0;v<M;v++)for(I=R+v*T,_=0;_<M;_++)A[w*_+I]+=y},this.addPlaneY=function(E,b){const M=this.size,T=this.yd,w=this.zd,A=this.field;let R,v,_,S,y,D,I,U,H=M*Math.sqrt(E/b);for(H>M&&(H=M),v=0;v<H;v++)if(D=v/M,S=D*D,y=E/(1e-4+S)-b,y>0)for(I=v*T,R=0;R<M;R++)for(U=I+R,_=0;_<M;_++)A[w*_+U]+=y},this.addPlaneZ=function(E,b){const M=this.size,T=this.yd,w=this.zd,A=this.field;let R,v,_,S,y,D,I,U,H=M*Math.sqrt(E/b);for(H>M&&(H=M),_=0;_<H;_++)if(D=_/M,S=D*D,y=E/(1e-4+S)-b,y>0)for(I=w*_,v=0;v<M;v++)for(U=I+v*T,R=0;R<M;R++)A[U+R]+=y},this.setCell=function(E,b,M,T){const w=this.size2*M+this.size*b+E;this.field[w]=T},this.getCell=function(E,b,M){const T=this.size2*M+this.size*b+E;return this.field[T]},this.blur=function(E=1){const b=this.field,M=b.slice(),T=this.size,w=this.size2;for(let A=0;A<T;A++)for(let R=0;R<T;R++)for(let v=0;v<T;v++){const _=w*v+T*R+A;let S=M[_],y=1;for(let D=-1;D<=1;D+=2){const I=D+A;if(!(I<0||I>=T))for(let U=-1;U<=1;U+=2){const H=U+R;if(!(H<0||H>=T))for(let $=-1;$<=1;$+=2){const V=$+v;if(V<0||V>=T)continue;const tt=w*V+T*H+I,st=M[tt];y++,S+=E*(st-S)/y}}}b[_]=S}},this.reset=function(){for(let E=0;E<this.size3;E++)this.normal_cache[E*3]=0,this.field[E]=0,this.palette[E*3]=this.palette[E*3+1]=this.palette[E*3+2]=0},this.update=function(){this.count=0;const E=this.size-2;for(let b=1;b<E;b++){const M=this.size2*b,T=(b-this.halfsize)/this.halfsize;for(let w=1;w<E;w++){const A=M+this.size*w,R=(w-this.halfsize)/this.halfsize;for(let v=1;v<E;v++){const _=(v-this.halfsize)/this.halfsize,S=A+v;g(_,R,T,S,this.isolation)}}}this.geometry.setDrawRange(0,this.count),a.getAttribute("position").needsUpdate=!0,a.getAttribute("normal").needsUpdate=!0,this.enableUvs&&(a.getAttribute("uv").needsUpdate=!0),this.enableColors&&(a.getAttribute("color").needsUpdate=!0),this.count/3>s&&console.warn("THREE.MarchingCubes: Geometry buffers too small for rendering. Please create an instance with a higher poly count.")},this.init(t)}}const dv=new Int32Array([0,265,515,778,1030,1295,1541,1804,2060,2309,2575,2822,3082,3331,3593,3840,400,153,915,666,1430,1183,1941,1692,2460,2197,2975,2710,3482,3219,3993,3728,560,825,51,314,1590,1855,1077,1340,2620,2869,2111,2358,3642,3891,3129,3376,928,681,419,170,1958,1711,1445,1196,2988,2725,2479,2214,4010,3747,3497,3232,1120,1385,1635,1898,102,367,613,876,3180,3429,3695,3942,2154,2403,2665,2912,1520,1273,2035,1786,502,255,1013,764,3580,3317,4095,3830,2554,2291,3065,2800,1616,1881,1107,1370,598,863,85,348,3676,3925,3167,3414,2650,2899,2137,2384,1984,1737,1475,1226,966,719,453,204,4044,3781,3535,3270,3018,2755,2505,2240,2240,2505,2755,3018,3270,3535,3781,4044,204,453,719,966,1226,1475,1737,1984,2384,2137,2899,2650,3414,3167,3925,3676,348,85,863,598,1370,1107,1881,1616,2800,3065,2291,2554,3830,4095,3317,3580,764,1013,255,502,1786,2035,1273,1520,2912,2665,2403,2154,3942,3695,3429,3180,876,613,367,102,1898,1635,1385,1120,3232,3497,3747,4010,2214,2479,2725,2988,1196,1445,1711,1958,170,419,681,928,3376,3129,3891,3642,2358,2111,2869,2620,1340,1077,1855,1590,314,51,825,560,3728,3993,3219,3482,2710,2975,2197,2460,1692,1941,1183,1430,666,915,153,400,3840,3593,3331,3082,2822,2575,2309,2060,1804,1541,1295,1030,778,515,265,0]),zs=new Int32Array([-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,8,3,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,1,9,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,1,8,3,9,8,1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,1,2,10,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,8,3,1,2,10,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,9,2,10,0,2,9,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,2,8,3,2,10,8,10,9,8,-1,-1,-1,-1,-1,-1,-1,3,11,2,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,11,2,8,11,0,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,1,9,0,2,3,11,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,1,11,2,1,9,11,9,8,11,-1,-1,-1,-1,-1,-1,-1,3,10,1,11,10,3,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,10,1,0,8,10,8,11,10,-1,-1,-1,-1,-1,-1,-1,3,9,0,3,11,9,11,10,9,-1,-1,-1,-1,-1,-1,-1,9,8,10,10,8,11,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,4,7,8,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,4,3,0,7,3,4,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,1,9,8,4,7,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,4,1,9,4,7,1,7,3,1,-1,-1,-1,-1,-1,-1,-1,1,2,10,8,4,7,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,3,4,7,3,0,4,1,2,10,-1,-1,-1,-1,-1,-1,-1,9,2,10,9,0,2,8,4,7,-1,-1,-1,-1,-1,-1,-1,2,10,9,2,9,7,2,7,3,7,9,4,-1,-1,-1,-1,8,4,7,3,11,2,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,11,4,7,11,2,4,2,0,4,-1,-1,-1,-1,-1,-1,-1,9,0,1,8,4,7,2,3,11,-1,-1,-1,-1,-1,-1,-1,4,7,11,9,4,11,9,11,2,9,2,1,-1,-1,-1,-1,3,10,1,3,11,10,7,8,4,-1,-1,-1,-1,-1,-1,-1,1,11,10,1,4,11,1,0,4,7,11,4,-1,-1,-1,-1,4,7,8,9,0,11,9,11,10,11,0,3,-1,-1,-1,-1,4,7,11,4,11,9,9,11,10,-1,-1,-1,-1,-1,-1,-1,9,5,4,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,9,5,4,0,8,3,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,5,4,1,5,0,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,8,5,4,8,3,5,3,1,5,-1,-1,-1,-1,-1,-1,-1,1,2,10,9,5,4,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,3,0,8,1,2,10,4,9,5,-1,-1,-1,-1,-1,-1,-1,5,2,10,5,4,2,4,0,2,-1,-1,-1,-1,-1,-1,-1,2,10,5,3,2,5,3,5,4,3,4,8,-1,-1,-1,-1,9,5,4,2,3,11,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,11,2,0,8,11,4,9,5,-1,-1,-1,-1,-1,-1,-1,0,5,4,0,1,5,2,3,11,-1,-1,-1,-1,-1,-1,-1,2,1,5,2,5,8,2,8,11,4,8,5,-1,-1,-1,-1,10,3,11,10,1,3,9,5,4,-1,-1,-1,-1,-1,-1,-1,4,9,5,0,8,1,8,10,1,8,11,10,-1,-1,-1,-1,5,4,0,5,0,11,5,11,10,11,0,3,-1,-1,-1,-1,5,4,8,5,8,10,10,8,11,-1,-1,-1,-1,-1,-1,-1,9,7,8,5,7,9,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,9,3,0,9,5,3,5,7,3,-1,-1,-1,-1,-1,-1,-1,0,7,8,0,1,7,1,5,7,-1,-1,-1,-1,-1,-1,-1,1,5,3,3,5,7,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,9,7,8,9,5,7,10,1,2,-1,-1,-1,-1,-1,-1,-1,10,1,2,9,5,0,5,3,0,5,7,3,-1,-1,-1,-1,8,0,2,8,2,5,8,5,7,10,5,2,-1,-1,-1,-1,2,10,5,2,5,3,3,5,7,-1,-1,-1,-1,-1,-1,-1,7,9,5,7,8,9,3,11,2,-1,-1,-1,-1,-1,-1,-1,9,5,7,9,7,2,9,2,0,2,7,11,-1,-1,-1,-1,2,3,11,0,1,8,1,7,8,1,5,7,-1,-1,-1,-1,11,2,1,11,1,7,7,1,5,-1,-1,-1,-1,-1,-1,-1,9,5,8,8,5,7,10,1,3,10,3,11,-1,-1,-1,-1,5,7,0,5,0,9,7,11,0,1,0,10,11,10,0,-1,11,10,0,11,0,3,10,5,0,8,0,7,5,7,0,-1,11,10,5,7,11,5,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,10,6,5,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,8,3,5,10,6,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,9,0,1,5,10,6,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,1,8,3,1,9,8,5,10,6,-1,-1,-1,-1,-1,-1,-1,1,6,5,2,6,1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,1,6,5,1,2,6,3,0,8,-1,-1,-1,-1,-1,-1,-1,9,6,5,9,0,6,0,2,6,-1,-1,-1,-1,-1,-1,-1,5,9,8,5,8,2,5,2,6,3,2,8,-1,-1,-1,-1,2,3,11,10,6,5,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,11,0,8,11,2,0,10,6,5,-1,-1,-1,-1,-1,-1,-1,0,1,9,2,3,11,5,10,6,-1,-1,-1,-1,-1,-1,-1,5,10,6,1,9,2,9,11,2,9,8,11,-1,-1,-1,-1,6,3,11,6,5,3,5,1,3,-1,-1,-1,-1,-1,-1,-1,0,8,11,0,11,5,0,5,1,5,11,6,-1,-1,-1,-1,3,11,6,0,3,6,0,6,5,0,5,9,-1,-1,-1,-1,6,5,9,6,9,11,11,9,8,-1,-1,-1,-1,-1,-1,-1,5,10,6,4,7,8,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,4,3,0,4,7,3,6,5,10,-1,-1,-1,-1,-1,-1,-1,1,9,0,5,10,6,8,4,7,-1,-1,-1,-1,-1,-1,-1,10,6,5,1,9,7,1,7,3,7,9,4,-1,-1,-1,-1,6,1,2,6,5,1,4,7,8,-1,-1,-1,-1,-1,-1,-1,1,2,5,5,2,6,3,0,4,3,4,7,-1,-1,-1,-1,8,4,7,9,0,5,0,6,5,0,2,6,-1,-1,-1,-1,7,3,9,7,9,4,3,2,9,5,9,6,2,6,9,-1,3,11,2,7,8,4,10,6,5,-1,-1,-1,-1,-1,-1,-1,5,10,6,4,7,2,4,2,0,2,7,11,-1,-1,-1,-1,0,1,9,4,7,8,2,3,11,5,10,6,-1,-1,-1,-1,9,2,1,9,11,2,9,4,11,7,11,4,5,10,6,-1,8,4,7,3,11,5,3,5,1,5,11,6,-1,-1,-1,-1,5,1,11,5,11,6,1,0,11,7,11,4,0,4,11,-1,0,5,9,0,6,5,0,3,6,11,6,3,8,4,7,-1,6,5,9,6,9,11,4,7,9,7,11,9,-1,-1,-1,-1,10,4,9,6,4,10,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,4,10,6,4,9,10,0,8,3,-1,-1,-1,-1,-1,-1,-1,10,0,1,10,6,0,6,4,0,-1,-1,-1,-1,-1,-1,-1,8,3,1,8,1,6,8,6,4,6,1,10,-1,-1,-1,-1,1,4,9,1,2,4,2,6,4,-1,-1,-1,-1,-1,-1,-1,3,0,8,1,2,9,2,4,9,2,6,4,-1,-1,-1,-1,0,2,4,4,2,6,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,8,3,2,8,2,4,4,2,6,-1,-1,-1,-1,-1,-1,-1,10,4,9,10,6,4,11,2,3,-1,-1,-1,-1,-1,-1,-1,0,8,2,2,8,11,4,9,10,4,10,6,-1,-1,-1,-1,3,11,2,0,1,6,0,6,4,6,1,10,-1,-1,-1,-1,6,4,1,6,1,10,4,8,1,2,1,11,8,11,1,-1,9,6,4,9,3,6,9,1,3,11,6,3,-1,-1,-1,-1,8,11,1,8,1,0,11,6,1,9,1,4,6,4,1,-1,3,11,6,3,6,0,0,6,4,-1,-1,-1,-1,-1,-1,-1,6,4,8,11,6,8,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,7,10,6,7,8,10,8,9,10,-1,-1,-1,-1,-1,-1,-1,0,7,3,0,10,7,0,9,10,6,7,10,-1,-1,-1,-1,10,6,7,1,10,7,1,7,8,1,8,0,-1,-1,-1,-1,10,6,7,10,7,1,1,7,3,-1,-1,-1,-1,-1,-1,-1,1,2,6,1,6,8,1,8,9,8,6,7,-1,-1,-1,-1,2,6,9,2,9,1,6,7,9,0,9,3,7,3,9,-1,7,8,0,7,0,6,6,0,2,-1,-1,-1,-1,-1,-1,-1,7,3,2,6,7,2,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,2,3,11,10,6,8,10,8,9,8,6,7,-1,-1,-1,-1,2,0,7,2,7,11,0,9,7,6,7,10,9,10,7,-1,1,8,0,1,7,8,1,10,7,6,7,10,2,3,11,-1,11,2,1,11,1,7,10,6,1,6,7,1,-1,-1,-1,-1,8,9,6,8,6,7,9,1,6,11,6,3,1,3,6,-1,0,9,1,11,6,7,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,7,8,0,7,0,6,3,11,0,11,6,0,-1,-1,-1,-1,7,11,6,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,7,6,11,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,3,0,8,11,7,6,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,1,9,11,7,6,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,8,1,9,8,3,1,11,7,6,-1,-1,-1,-1,-1,-1,-1,10,1,2,6,11,7,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,1,2,10,3,0,8,6,11,7,-1,-1,-1,-1,-1,-1,-1,2,9,0,2,10,9,6,11,7,-1,-1,-1,-1,-1,-1,-1,6,11,7,2,10,3,10,8,3,10,9,8,-1,-1,-1,-1,7,2,3,6,2,7,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,7,0,8,7,6,0,6,2,0,-1,-1,-1,-1,-1,-1,-1,2,7,6,2,3,7,0,1,9,-1,-1,-1,-1,-1,-1,-1,1,6,2,1,8,6,1,9,8,8,7,6,-1,-1,-1,-1,10,7,6,10,1,7,1,3,7,-1,-1,-1,-1,-1,-1,-1,10,7,6,1,7,10,1,8,7,1,0,8,-1,-1,-1,-1,0,3,7,0,7,10,0,10,9,6,10,7,-1,-1,-1,-1,7,6,10,7,10,8,8,10,9,-1,-1,-1,-1,-1,-1,-1,6,8,4,11,8,6,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,3,6,11,3,0,6,0,4,6,-1,-1,-1,-1,-1,-1,-1,8,6,11,8,4,6,9,0,1,-1,-1,-1,-1,-1,-1,-1,9,4,6,9,6,3,9,3,1,11,3,6,-1,-1,-1,-1,6,8,4,6,11,8,2,10,1,-1,-1,-1,-1,-1,-1,-1,1,2,10,3,0,11,0,6,11,0,4,6,-1,-1,-1,-1,4,11,8,4,6,11,0,2,9,2,10,9,-1,-1,-1,-1,10,9,3,10,3,2,9,4,3,11,3,6,4,6,3,-1,8,2,3,8,4,2,4,6,2,-1,-1,-1,-1,-1,-1,-1,0,4,2,4,6,2,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,1,9,0,2,3,4,2,4,6,4,3,8,-1,-1,-1,-1,1,9,4,1,4,2,2,4,6,-1,-1,-1,-1,-1,-1,-1,8,1,3,8,6,1,8,4,6,6,10,1,-1,-1,-1,-1,10,1,0,10,0,6,6,0,4,-1,-1,-1,-1,-1,-1,-1,4,6,3,4,3,8,6,10,3,0,3,9,10,9,3,-1,10,9,4,6,10,4,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,4,9,5,7,6,11,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,8,3,4,9,5,11,7,6,-1,-1,-1,-1,-1,-1,-1,5,0,1,5,4,0,7,6,11,-1,-1,-1,-1,-1,-1,-1,11,7,6,8,3,4,3,5,4,3,1,5,-1,-1,-1,-1,9,5,4,10,1,2,7,6,11,-1,-1,-1,-1,-1,-1,-1,6,11,7,1,2,10,0,8,3,4,9,5,-1,-1,-1,-1,7,6,11,5,4,10,4,2,10,4,0,2,-1,-1,-1,-1,3,4,8,3,5,4,3,2,5,10,5,2,11,7,6,-1,7,2,3,7,6,2,5,4,9,-1,-1,-1,-1,-1,-1,-1,9,5,4,0,8,6,0,6,2,6,8,7,-1,-1,-1,-1,3,6,2,3,7,6,1,5,0,5,4,0,-1,-1,-1,-1,6,2,8,6,8,7,2,1,8,4,8,5,1,5,8,-1,9,5,4,10,1,6,1,7,6,1,3,7,-1,-1,-1,-1,1,6,10,1,7,6,1,0,7,8,7,0,9,5,4,-1,4,0,10,4,10,5,0,3,10,6,10,7,3,7,10,-1,7,6,10,7,10,8,5,4,10,4,8,10,-1,-1,-1,-1,6,9,5,6,11,9,11,8,9,-1,-1,-1,-1,-1,-1,-1,3,6,11,0,6,3,0,5,6,0,9,5,-1,-1,-1,-1,0,11,8,0,5,11,0,1,5,5,6,11,-1,-1,-1,-1,6,11,3,6,3,5,5,3,1,-1,-1,-1,-1,-1,-1,-1,1,2,10,9,5,11,9,11,8,11,5,6,-1,-1,-1,-1,0,11,3,0,6,11,0,9,6,5,6,9,1,2,10,-1,11,8,5,11,5,6,8,0,5,10,5,2,0,2,5,-1,6,11,3,6,3,5,2,10,3,10,5,3,-1,-1,-1,-1,5,8,9,5,2,8,5,6,2,3,8,2,-1,-1,-1,-1,9,5,6,9,6,0,0,6,2,-1,-1,-1,-1,-1,-1,-1,1,5,8,1,8,0,5,6,8,3,8,2,6,2,8,-1,1,5,6,2,1,6,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,1,3,6,1,6,10,3,8,6,5,6,9,8,9,6,-1,10,1,0,10,0,6,9,5,0,5,6,0,-1,-1,-1,-1,0,3,8,5,6,10,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,10,5,6,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,11,5,10,7,5,11,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,11,5,10,11,7,5,8,3,0,-1,-1,-1,-1,-1,-1,-1,5,11,7,5,10,11,1,9,0,-1,-1,-1,-1,-1,-1,-1,10,7,5,10,11,7,9,8,1,8,3,1,-1,-1,-1,-1,11,1,2,11,7,1,7,5,1,-1,-1,-1,-1,-1,-1,-1,0,8,3,1,2,7,1,7,5,7,2,11,-1,-1,-1,-1,9,7,5,9,2,7,9,0,2,2,11,7,-1,-1,-1,-1,7,5,2,7,2,11,5,9,2,3,2,8,9,8,2,-1,2,5,10,2,3,5,3,7,5,-1,-1,-1,-1,-1,-1,-1,8,2,0,8,5,2,8,7,5,10,2,5,-1,-1,-1,-1,9,0,1,5,10,3,5,3,7,3,10,2,-1,-1,-1,-1,9,8,2,9,2,1,8,7,2,10,2,5,7,5,2,-1,1,3,5,3,7,5,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,8,7,0,7,1,1,7,5,-1,-1,-1,-1,-1,-1,-1,9,0,3,9,3,5,5,3,7,-1,-1,-1,-1,-1,-1,-1,9,8,7,5,9,7,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,5,8,4,5,10,8,10,11,8,-1,-1,-1,-1,-1,-1,-1,5,0,4,5,11,0,5,10,11,11,3,0,-1,-1,-1,-1,0,1,9,8,4,10,8,10,11,10,4,5,-1,-1,-1,-1,10,11,4,10,4,5,11,3,4,9,4,1,3,1,4,-1,2,5,1,2,8,5,2,11,8,4,5,8,-1,-1,-1,-1,0,4,11,0,11,3,4,5,11,2,11,1,5,1,11,-1,0,2,5,0,5,9,2,11,5,4,5,8,11,8,5,-1,9,4,5,2,11,3,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,2,5,10,3,5,2,3,4,5,3,8,4,-1,-1,-1,-1,5,10,2,5,2,4,4,2,0,-1,-1,-1,-1,-1,-1,-1,3,10,2,3,5,10,3,8,5,4,5,8,0,1,9,-1,5,10,2,5,2,4,1,9,2,9,4,2,-1,-1,-1,-1,8,4,5,8,5,3,3,5,1,-1,-1,-1,-1,-1,-1,-1,0,4,5,1,0,5,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,8,4,5,8,5,3,9,0,5,0,3,5,-1,-1,-1,-1,9,4,5,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,4,11,7,4,9,11,9,10,11,-1,-1,-1,-1,-1,-1,-1,0,8,3,4,9,7,9,11,7,9,10,11,-1,-1,-1,-1,1,10,11,1,11,4,1,4,0,7,4,11,-1,-1,-1,-1,3,1,4,3,4,8,1,10,4,7,4,11,10,11,4,-1,4,11,7,9,11,4,9,2,11,9,1,2,-1,-1,-1,-1,9,7,4,9,11,7,9,1,11,2,11,1,0,8,3,-1,11,7,4,11,4,2,2,4,0,-1,-1,-1,-1,-1,-1,-1,11,7,4,11,4,2,8,3,4,3,2,4,-1,-1,-1,-1,2,9,10,2,7,9,2,3,7,7,4,9,-1,-1,-1,-1,9,10,7,9,7,4,10,2,7,8,7,0,2,0,7,-1,3,7,10,3,10,2,7,4,10,1,10,0,4,0,10,-1,1,10,2,8,7,4,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,4,9,1,4,1,7,7,1,3,-1,-1,-1,-1,-1,-1,-1,4,9,1,4,1,7,0,8,1,8,7,1,-1,-1,-1,-1,4,0,3,7,4,3,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,4,8,7,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,9,10,8,10,11,8,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,3,0,9,3,9,11,11,9,10,-1,-1,-1,-1,-1,-1,-1,0,1,10,0,10,8,8,10,11,-1,-1,-1,-1,-1,-1,-1,3,1,10,11,3,10,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,1,2,11,1,11,9,9,11,8,-1,-1,-1,-1,-1,-1,-1,3,0,9,3,9,11,1,2,9,2,11,9,-1,-1,-1,-1,0,2,11,8,0,11,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,3,2,11,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,2,3,8,2,8,10,10,8,9,-1,-1,-1,-1,-1,-1,-1,9,10,2,0,9,2,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,2,3,8,2,8,10,0,1,8,1,10,8,-1,-1,-1,-1,1,10,2,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,1,3,8,9,1,8,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,9,1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,3,8,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1]),Mu={uFurFade:{value:1}},pv=`
  float furHash(vec3 p) { p = fract(p * 0.1031); p += dot(p, p.zyx + 31.32); return fract((p.x + p.y) * p.z); }
  float furNoise(vec3 p) { vec3 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f);
    return mix(mix(mix(furHash(i), furHash(i + vec3(1, 0, 0)), f.x), mix(furHash(i + vec3(0, 1, 0)), furHash(i + vec3(1, 1, 0)), f.x), f.y),
               mix(mix(furHash(i + vec3(0, 0, 1)), furHash(i + vec3(1, 0, 1)), f.x), mix(furHash(i + vec3(0, 1, 1)), furHash(i + vec3(1, 1, 1)), f.x), f.y), f.z); }`;function mv(i,t){const e=new gi({vertexColors:!0,roughness:t.feather?.75:.92,metalness:0}),n={uH:{value:i},uFurLen:{value:t.length},uFurDensity:{value:t.density},uFurTip:{value:t.tip},uFeather:{value:t.feather?1:0}};return e.onBeforeCompile=r=>{Object.assign(r.uniforms,n,Mu),r.vertexShader=r.vertexShader.replace("#include <common>",`#include <common>
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
        ${pv}`).replace("#include <color_fragment>",`#include <color_fragment>
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
        diffuseColor.rgb = mix(diffuseColor.rgb, diffuseColor.rgb * 1.25 + 0.06, uFurTip * smoothstep(0.6, 1.0, t));`)},e.customProgramCacheKey=()=>"kaiju-fur-v2",e}function gv(i,t,e,n){const r=[];for(let s=1;s<=n;s++){const a=new au(t,mv(s/n,e));a.castShadow=!1,a.receiveShadow=!0,a.frustumCulled=!1,a.userData.h=s/n,i.add(a),a.bind(i.skeleton,i.bindMatrix),r.push(a)}return r}function vv(i=512){const t=document.createElement("canvas");t.width=t.height=i;const e=t.getContext("2d"),n=document.createElement("canvas");n.width=n.height=i;const r=n.getContext("2d"),s=e.createImageData(i,i),a=r.createImageData(i,i),o=22,c=[];let l=7;const h=()=>(l=l*1664525+1013904223>>>0,l/4294967296);for(let f=0;f<o;f++)for(let m=0;m<o;m++)c.push([(m+.2+h()*.6)/o,(f+.2+h()*.6)/o,.7+h()*.3]);for(let f=0;f<i;f++)for(let m=0;m<i;m++){const x=m/i,g=f/i,p=Math.floor(x*o),E=Math.floor(g*o);let b=9,M=9,T=1;for(let y=-1;y<=1;y++)for(let D=-1;D<=1;D++){const I=(p+D+o)%o,U=(E+y+o)%o,H=c[U*o+I];let $=x-H[0],V=g-H[1];$-=Math.round($),V-=Math.round(V);const tt=Math.sqrt($*$+V*V);tt<b?(M=b,b=tt,T=H[2]):tt<M&&(M=tt)}const w=M-b,A=Math.min(1,w/.02),R=1-Math.min(1,b/(.55/o)),v=(.55+.45*A)*T*(.85+.3*R),_=(f*i+m)*4;s.data[_]=255*v,s.data[_+1]=255*v,s.data[_+2]=255*v,s.data[_+3]=255;const S=.55+.4*(1-A)-.15*R;a.data[_]=255*S,a.data[_+1]=255*S,a.data[_+2]=255*S,a.data[_+3]=255}e.putImageData(s,0,0),r.putImageData(a,0,0);const u=new wl(t);u.wrapS=u.wrapT=ts,u.colorSpace=Bn;const d=new wl(n);return d.wrapS=d.wrapT=ts,{map:u,rough:d}}let Vs=null;function _v(i=!1,t){if(i)return xv();if(t==="armour")return new gi({vertexColors:!0,roughness:.42,metalness:.45});if(t==="soft")return new gi({vertexColors:!0,roughness:.82,metalness:0});if(t==="suit")return new gi({vertexColors:!0,roughness:.34,metalness:.18});!Vs&&typeof document<"u"&&(Vs=vv());const e=new gi({vertexColors:!0,roughness:.7,metalness:.02});return e.onBeforeCompile=n=>{n.uniforms.uScales={value:Vs?.map??null},n.uniforms.uRough={value:Vs?.rough??null},n.vertexShader=n.vertexShader.replace("#include <common>",`#include <common>
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
        float roughTex = triplanar(uRough, vBind, bn, sc).r;`).replace("#include <roughnessmap_fragment>","float roughnessFactor = mix(roughTex, 0.9, isBone);")},e.customProgramCacheKey=()=>"kaiju-v1",e}function xv(){const i=new gi({vertexColors:!0,roughness:.95,metalness:0});return i.onBeforeCompile=t=>{Object.assign(t.uniforms,Mu),t.fragmentShader=t.fragmentShader.replace("#include <common>",`#include <common>
 uniform float uFurFade;`).replace("#include <color_fragment>",`#include <color_fragment>
 diffuseColor.rgb *= mix(1.0, 0.6, uFurFade);`)},i.customProgramCacheKey=()=>"kaiju-undercoat-v1",i}function th(i,t,e){const n=i.box,r=(n.min[0]+n.max[0])/2,s=(n.min[1]+n.max[1])/2,a=(n.min[2]+n.max[2])/2,o=(n.max[0]-n.min[0])/2,c=(n.max[1]-n.min[1])/2,l=(n.max[2]-n.min[2])/2,h=new xu(e,new fa,!1,!1,4e5);h.isolation=50;const u=h.field,d=e;for(let S=0;S<d;S++){const y=a+(S/(d-1)*2-1)*l;for(let D=0;D<d;D++){const I=s+(D/(d-1)*2-1)*c;for(let U=0;U<d;U++){const H=r+(U/(d-1)*2-1)*o;u[S*d*d+D*d+U]=Math.max(0,Math.min(100,50-i.sdf(H,I,y)*40))}}}h.update();const f=h.count,m=new Float32Array(f*3),x=new Float32Array(f*3),g=new Float32Array(f*3),p=h.positionArray,E=h.normalArray,b=i.palette.map(S=>new Ht(S)),M=new Ht;for(let S=0;S<f;S++){const y=r+p[S*3]*o,D=s+p[S*3+1]*c,I=a+p[S*3+2]*l;m[S*3]=y,m[S*3+1]=D,m[S*3+2]=I;let U=E[S*3]/o,H=E[S*3+1]/c,$=E[S*3+2]/l;const V=Math.hypot(U,H,$)||1;U/=V,H/=V,$/=V,x[S*3]=U,x[S*3+1]=H,x[S*3+2]=$;const tt=i.region(y,D,I);M.copy(b[tt]??b[0]),i.tint?.(tt,y,D,I,M);const st=.94+.06*Math.sin(D*1.7+I*.9)*Math.cos(y*2.3);g[S*3]=M.r*st,g[S*3+1]=M.g*st,g[S*3+2]=M.b*st}h.geometry.dispose();const T=new Ue;if(T.setAttribute("position",new ae(m,3)),T.setAttribute("normal",new ae(x,3)),T.setAttribute("color",new ae(g,3)),i.fur){const S=new Float32Array(f);for(let y=0;y<f;y++)S[y]=i.furLen?i.furLen(m[y*3],m[y*3+1],m[y*3+2]):1;T.setAttribute("aFur",new ae(S,1))}const w=new Uint16Array(f*4),A=new Float32Array(f*4),R=t.map((S,y)=>({i:y,a:S.a,b:S.b,reach:S.reach??1/0,name:S.name})),v=i.capture,_=i.weights??"sharp";for(let S=0;S<f;S++){const y=m[S*3],D=m[S*3+1],I=m[S*3+2];let U=1/0,H=1/0,$=0,V=0;for(const ft of R){if(v&&!v(ft,y,D,I))continue;const Ct=ft.b[0]-ft.a[0],zt=ft.b[1]-ft.a[1],it=ft.b[2]-ft.a[2],W=y-ft.a[0],Z=D-ft.a[1],F=I-ft.a[2],B=Math.max(0,Math.min(1,(W*Ct+Z*zt+F*it)/(Ct*Ct+zt*zt+it*it||1))),k=Math.hypot(W-Ct*B,Z-zt*B,F-it*B);k>ft.reach||(k<U?(H=U,V=$,U=k,$=ft.i):k<H&&(H=k,V=ft.i))}isFinite(H)||(H=U,V=$);const tt=_==="rigid"?1:_==="soft"?1/Math.pow(U+1.2,2):1/Math.pow(U+.3,4),st=_==="rigid"?0:_==="soft"?1/Math.pow(H+1.2,2):1/Math.pow(H+.3,4),ct=tt+st;w[S*4]=$,w[S*4+1]=V,A[S*4]=tt/ct,A[S*4+1]=st/ct}return T.setAttribute("skinIndex",new ae(w,4)),T.setAttribute("skinWeight",new ae(A,4)),T}function Mv(i){const t=new Map;let e=null;for(const n of i){const r=new ou;if(r.name=n.name,n.parent){const s=i.find(a=>a.name===n.parent);r.position.set(n.a[0]-s.a[0],n.a[1]-s.a[1],n.a[2]-s.a[2]),t.get(n.parent).add(r)}else r.position.set(n.a[0],n.a[1],n.a[2]),e=r;t.set(n.name,r)}return{bones:t,root:e}}function bv(i,t=i.res??88){const e=performance.now(),{bones:n,root:r}=Mv(i.segs);let s,a=[];if(i.body){const o=i.body,c=th(o,i.segs,t),l=o.surface==="scales"||o.surface==="fur"?void 0:o.surface,h=new au(c,_v(!!o.fur||o.surface==="fur",l));h.castShadow=!0,h.receiveShadow=!0,h.frustumCulled=!1,h.add(r),h.bind(new _c(i.segs.map(u=>n.get(u.name)))),o.fur&&(i.furShells??10)>0&&(a=gv(h,th(o,i.segs,Math.max(32,Math.round(t*.6))),o.fur,i.furShells??10)),s=h}else{const o=new an;o.add(r),s=o}if(i.dress){const o=new Map;i.dress({bones:n,segs:i.segs,at(c,l,h,u,d){const f=i.segs.find(m=>m.name===l);return c.position.set(h-f.a[0],u-f.a[1],d-f.a[2]),c.traverse(m=>{m.isMesh&&(m.castShadow=!0,m.receiveShadow=!0)}),n.get(l).add(c),c},std(c){const l=JSON.stringify(c);let h=o.get(l);return h||(h=new gi(c),o.set(l,h)),h}})}return s.name=i.id,{def:i,root:s,bones:n,fur:a,ms:performance.now()-e}}const et=(i,t,e)=>{const n=Math.max(e-Math.abs(i-t),0)/e;return Math.min(i,t)-n*n*e*.25};function ye(i,t,e,n,r,s,a){const o=i-n,c=t-r,l=e-s;return Math.sqrt(o*o+c*c+l*l)-a}function St(i,t,e,n,r,s,a,o,c,l,h){const u=a-n,d=o-r,f=c-s,m=i-n,x=t-r,g=e-s,p=Math.max(0,Math.min(1,(m*u+x*d+g*f)/(u*u+d*d+f*f))),E=m-u*p,b=x-d*p,M=g-f*p;return Math.sqrt(E*E+b*b+M*M)-(l+(h-l)*p)}function Ut(i,t,e,n,r,s,a,o,c){const l=(i-n)/a,h=(t-r)/o,u=(e-s)/c,d=Math.sqrt(l*l+h*h+u*u),f=Math.sqrt(l*l/a+h*h/o+u*u/c);return f>0?d*(d-1)/f:-Math.min(a,o,c)}const Wi=2.1,xr=[1.95,6,.2],zn=[Wi,3.4,.55],Fi=[Wi,1,0],eh=[Wi,.3,2],Un=[2.9,11,.8],sn=[4.99,10.54,1.28],xi=[6.76,10.06,1.79],je=[[0,6.6,-2.6],[.5,4.6,-4.4],[1.6,2.4,-5.3],[3,1.1,-5.2],[4.5,.85,-4.1]],nh=[1.15,1.45,1.4,1.2,.75],ge=[0,14.4,.6],Sv=[{name:"pelvis",a:[0,6,0],b:[0,7.6,0],parent:null},{name:"spine1",a:[0,7.6,0],b:[0,9.4,.1],parent:"pelvis"},{name:"spine2",a:[0,9.4,.1],b:[0,11.4,.1],parent:"spine1"},{name:"neck",a:[0,11.4,.1],b:[0,ge[1]-1.6,ge[2]-.25],parent:"spine2"},{name:"head",a:[0,ge[1]-1.6,ge[2]-.25],b:[0,ge[1]+1.6,ge[2]+.1],parent:"neck"},{name:"jaw",a:[0,ge[1]-1.1,ge[2]+1.1],b:[0,ge[1]-1.2,ge[2]+2.9],parent:"head",reach:0},{name:"tail1",a:je[0],b:je[1],parent:"pelvis"},{name:"tail2",a:je[1],b:je[2],parent:"tail1"},{name:"tail3",a:je[2],b:je[3],parent:"tail2"},{name:"tail4",a:je[3],b:je[4],parent:"tail3"},{name:"thighL",a:xr,b:zn,parent:"pelvis"},{name:"shinL",a:zn,b:Fi,parent:"thighL"},{name:"footL",a:Fi,b:eh,parent:"shinL"},{name:"thighR",a:Dn(xr),b:Dn(zn),parent:"pelvis"},{name:"shinR",a:Dn(zn),b:Dn(Fi),parent:"thighR"},{name:"footR",a:Dn(Fi),b:Dn(eh),parent:"shinR"},{name:"armL",a:Un,b:sn,parent:"spine2"},{name:"forearmL",a:sn,b:xi,parent:"armL"},{name:"armR",a:Dn(Un),b:Dn(sn),parent:"spine2"},{name:"forearmR",a:Dn(sn),b:Dn(xi),parent:"armR"}];function Dn(i){return[-i[0],i[1],i[2]]}const yv={min:[-8.6,-.4,-7.2],max:[8.6,18.4,5.8]},ei=[.98,ge[1]+.33,ge[2]+1.97],Bi=[0,ge[1]-.5,ge[2]+4.05],Tn=wc(bu(xi,sn)),Qa=wc([-Tn[2],0,Tn[0]]);function bu(i,t){return[i[0]-t[0],i[1]-t[1],i[2]-t[2]]}function wc(i){const t=Math.hypot(i[0],i[1],i[2]);return[i[0]/t,i[1]/t,i[2]/t]}const Cr=(i,t,e,n=0)=>[i[0]+Tn[0]*t+Qa[0]*e,i[1]+Tn[1]*t+Qa[1]*e+n,i[2]+Tn[2]*t+Qa[2]*e],bn=Cr(xi,.35,0),Ev=Cr(bn,1.3,0),Su=(i,t,e)=>(i-xi[0])*Tn[0]+(t-xi[1])*Tn[1]+(e-xi[2])*Tn[2],yu=[-.42,-.14,.14,.42].map(i=>[Cr(bn,.35,i*1.1),Cr(bn,1.15-Math.abs(i)*.5,i*1.35,-.12)]);yu.push([Cr(bn,-.1,.45),Cr(bn,.45,.95,-.1)]);const wv=[-.5,-.17,.17,.5].map(i=>[[Wi+i*1.1,.3,1.8],[Wi+i*1.3,.22,2.7-Math.abs(i)*.4]]),fi=(i,t,e,n,r,s,a)=>St(i,t,e,n[0],n[1],n[2],r[0],r[1],r[2],s,a),ur=2.5;let ih=NaN,rh=NaN,sh=NaN;const di={body:0,head:0,arm:0,leg:0,tail:0,min:0};function us(i,t,e){if(i===ih&&t===rh&&e===sh)return di;ih=i,rh=t,sh=e;const n=Math.abs(i);let r=ye(i,t,e,0,9.2,.2,5.6);r<ur&&(r=Ut(i,t,e,0,7.7,.35,3.85,3.35,3.4),r=et(r,Ut(i,t,e,0,10.3,.3,3,2.1,2.7),1.6),r=et(r,Ut(i,t,e,0,6.9,-1.2,3.4,2.6,2.7),1.2),r=et(r,ye(n,t,e,Un[0],Un[1],Un[2],.85),.7),r=et(r,St(i,t,e,0,11,.2,0,ge[1]-1.4,ge[2]-.15,2.1,1.7),.8)),di.body=r;const s=t-ge[1],a=e-ge[2];let o=ye(i,s,a,0,.6,.5,4.3);o<ur&&(o=Ut(i,s,a,0,0,0,2.38,2.05,2.21),o=et(o,Ut(n,s,a,1.8,-.66,.25,1.15,1.23,1.31),.66),o=et(o,St(i,s,a,0,-.25,1.48,0,-.57,3.6,1.11,.45),.5),o=et(o,St(i,s,a,0,-1.07,1.15,0,-1.23,2.95,.78,.41),.33),o=et(o,Ut(n,s,a,1.44,2.05,-.66,.78,1.03,.34),.29),o=Math.max(o,-ye(n,t,e,ei[0]+.05,ei[1],ei[2]+.2,.34))),di.head=o;let c=fi(n,t,e,Un,Ev,1.6,1.6);if(c<ur&&(c=fi(n,t,e,Un,sn,.72,.8),c=et(c,ye(n,t,e,(Un[0]+sn[0])/2,(Un[1]+sn[1])/2,(Un[2]+sn[2])/2,.9),.6),c=et(c,fi(n,t,e,sn,xi,.8,.6),.4),ye(n,t,e,bn[0],bn[1],bn[2],1.6)<ur)){c=et(c,Ut(n,t,e,bn[0],bn[1],bn[2],.62,.38,.62),.3);for(const u of yu)c=et(c,fi(n,t,e,u[0],u[1],.24,.17),.14)}di.arm=c;let l=St(n,t,e,xr[0],xr[1],xr[2],Wi,.6,1,2,2);if(l<ur&&(l=fi(n,t,e,xr,zn,1.42,1.1),l=et(l,fi(n,t,e,zn,Fi,1.08,.85),.5),t<2.6)){l=et(l,Math.max(Ut(n,t,e,Wi,.45,.75,.95,.6,1.75),-t),.45);for(const u of wv)l=et(l,fi(n,t,e,u[0],u[1],.26,.18),.15)}di.leg=l;let h=ye(i,t,e,2,3.4,-4.4,5.4);if(h<ur){h=1e9;for(let u=0;u+1<je.length;u++)h=et(h,fi(i,t,e,je[u],je[u+1],nh[u],nh[u+1]),.5)}return di.tail=h,di.min=Math.min(r,o,c,l,h),di}function Tv(i,t,e){const n=us(i,t,e);let r=et(n.body,n.head,.6);return r=et(r,n.arm,.5),r=et(r,n.leg,.7),et(r,n.tail,.6)}function Av(i,t,e){let n=0,r=1/0,s=0;for(let a=0;a+1<je.length;a++){const o=je[a],c=je[a+1],l=c[0]-o[0],h=c[1]-o[1],u=c[2]-o[2],d=l*l+h*h+u*u,f=Math.max(0,Math.min(1,((i-o[0])*l+(t-o[1])*h+(e-o[2])*u)/d)),m=i-o[0]-l*f,x=t-o[1]-h*f,g=e-o[2]-u*f,p=m*m+x*x+g*g;p<r&&(r=p,n=s+f*Math.sqrt(d)),s+=Math.sqrt(d)}return n}function Rv(i,t,e){const n=Math.abs(i);if(Math.hypot(i,t-Bi[1],e-Bi[2])<.62)return 3;const r=us(i,t,e),s=r.min;if(r.head===s){const a=t-ge[1],o=e-ge[2];if(o>.2&&a>-1.9){const c=n-1.1,l=a-.22+.32*c;if((c/1.25)**2+(l/.66)**2<1||n<.34&&a>-.35&&a<2.4&&o>.6)return 2;const h=n-1.05,u=a-1.12+.18*h;if((h/1)**2+(u/.4)**2<1||a<-.15+.25*Math.max(0,n-1.2)&&o>.5)return 1}return a>2.75&&n>.98?1:0}if(r.tail===s){const a=Av(i,t,e);return a>7.9||a%2<.85?2:4}return r.arm===s?Su(n,t,e)>-.25?5:0:r.leg===s?t<1.3?5:0:e>1.2&&(i/2.4)**2+((t-7.9)/3.1)**2<1?4:0}function Cv(i,t,e){const n=Math.abs(i),r=Math.hypot(n-ei[0],t-ei[1],e-ei[2]);if(r<.62||Math.hypot(i,t-Bi[1],e-Bi[2])<.85)return 0;const s=us(i,t,e),a=s.min;if(s.head===a){const o=t-ge[1],c=e-ge[2];return o>1.4&&n>.9&&c<.1?.5:n>1.4&&o<0&&c<1.5?1.35:c>1?.35+.4*Math.min(1,(r-.62)/1.3):.9}return s.tail===a?1.4:s.arm===a?Su(n,t,e)>-.25?.25:.9:s.leg===a?t<1.3?.3:1:1.1}const Lv=.15,Pv=new Map([["pelvis",0],["spine1",0],["spine2",0],["neck",1],["head",2],["jaw",2],["armL",3],["forearmL",3],["armR",4],["forearmR",4],["thighL",5],["shinL",5],["footL",5],["thighR",6],["shinR",6],["footR",6],["tail1",7],["tail2",7],["tail3",7],["tail4",7]]),to=wc(bu(Fi,zn)),Dv=new Map([["forearm",(i,t,e)=>(i-sn[0])*Tn[0]+(t-sn[1])*Tn[1]+(e-sn[2])*Tn[2]>-.9],["shin",(i,t,e)=>(i-zn[0])*to[0]+(t-zn[1])*to[1]+(e-zn[2])*to[2]>-.9],["foot",(i,t)=>t<Fi[1]+.7]]),Gs=(i,t,e,n)=>{const r=Dv.get(i.slice(0,-1));return!r||r(Math.abs(t),e,n)},Iv=(i,t,e,n)=>{const r=us(t,e,n),s=r.min+Lv;switch(Pv.get(i.name)){case 0:return r.body<=s;case 1:return e>10.6&&(r.body<=s&&Math.abs(t)<2.4||r.head<=s&&e<ge[1]-1.6);case 2:return r.head<=s&&e>ge[1]-2.1||r.body<=s&&e>12&&Math.abs(t)<2;case 3:return r.arm<=s&&t>.5&&Gs(i.name,t,e,n);case 4:return r.arm<=s&&t<-.5&&Gs(i.name,t,e,n);case 5:return r.leg<=s&&t>.2&&Gs(i.name,t,e,n);case 6:return r.leg<=s&&t<-.2&&Gs(i.name,t,e,n);case 7:return r.tail<=s;default:return!0}},Uv={id:"jimothy",name:"Jimothy",blurb:"The round Seattle raccoon, standing up",segs:Sv,body:{sdf:Tv,region:Rv,box:yv,palette:[7103837,15130834,1841431,657930,9406332,3814192],weights:"soft",capture:Iv,fur:{length:1,density:7,tip:.18},furLen:Cv,tint(i,t,e,n,r){if(i!==0)return;n<-.5&&r.multiplyScalar(1-.2*Math.min(1,(-.5-n)/2.5));const s=us(t,e,n);(s.arm===s.min||s.leg===s.min)&&r.multiplyScalar(.82)}},dress(i){const t=i.std({color:328965,roughness:.06,metalness:.1});for(const n of[-1,1])i.at(new Wt(new Ae(.34,14,10),t),"head",n*ei[0],ei[1],ei[2]);const e=new Wt(new Ae(.42,14,10),i.std({color:657930,roughness:.25}));e.scale.set(1.15,.8,.75),i.at(e,"head",Bi[0],Bi[1],Bi[2])},fit:{size:1.05,limb:.5},idle:{tail:.15},res:84,furShells:8};function Tc(i,t=!1){const e=i[0].index!==null,n=new Set(Object.keys(i[0].attributes)),r=new Set(Object.keys(i[0].morphAttributes)),s={},a={},o=i[0].morphTargetsRelative,c=new Ue;let l=0;for(let h=0;h<i.length;++h){const u=i[h];let d=0;if(e!==(u.index!==null))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". All geometries must have compatible attributes; make sure index attribute exists among all geometries, or in none of them."),null;for(const f in u.attributes){if(!n.has(f))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+'. All geometries must have compatible attributes; make sure "'+f+'" attribute exists among all geometries, or in none of them.'),null;s[f]===void 0&&(s[f]=[]),s[f].push(u.attributes[f]),d++}if(d!==n.size)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". Make sure all geometries have the same number of attributes."),null;if(o!==u.morphTargetsRelative)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". .morphTargetsRelative must be consistent throughout all geometries."),null;for(const f in u.morphAttributes){if(!r.has(f))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+".  .morphAttributes must be consistent throughout all geometries."),null;a[f]===void 0&&(a[f]=[]),a[f].push(u.morphAttributes[f])}if(t){let f;if(e)f=u.index.count;else if(u.attributes.position!==void 0)f=u.attributes.position.count;else return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". The geometry must have either an index or a position attribute"),null;c.addGroup(l,f,h),l+=f}}if(e){let h=0;const u=[];for(let d=0;d<i.length;++d){const f=i[d].index;for(let m=0;m<f.count;++m)u.push(f.getX(m)+h);h+=i[d].attributes.position.count}c.setIndex(u)}for(const h in s){const u=ah(s[h]);if(!u)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+h+" attribute."),null;c.setAttribute(h,u)}for(const h in a){const u=a[h][0].length;if(u===0)break;c.morphAttributes=c.morphAttributes||{},c.morphAttributes[h]=[];for(let d=0;d<u;++d){const f=[];for(let x=0;x<a[h].length;++x)f.push(a[h][x][d]);const m=ah(f);if(!m)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+h+" morphAttribute."),null;c.morphAttributes[h].push(m)}}return c}function ah(i){let t,e,n,r=-1,s=0;for(let l=0;l<i.length;++l){const h=i[l];if(t===void 0&&(t=h.array.constructor),t!==h.array.constructor)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.array must be of consistent array types across matching attributes."),null;if(e===void 0&&(e=h.itemSize),e!==h.itemSize)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.itemSize must be consistent across matching attributes."),null;if(n===void 0&&(n=h.normalized),n!==h.normalized)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.normalized must be consistent across matching attributes."),null;if(r===-1&&(r=h.gpuType),r!==h.gpuType)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.gpuType must be consistent across matching attributes."),null;s+=h.count*e}const a=new t(s),o=new ae(a,e,n);let c=0;for(let l=0;l<i.length;++l){const h=i[l];if(h.isInterleavedBufferAttribute){const u=c/e;for(let d=0,f=h.count;d<f;d++)for(let m=0;m<e;m++){const x=h.getComponent(d,m);o.setComponent(d+u,m,x)}}else a.set(h.array,c);c+=h.count*e}return r!==void 0&&(o.gpuType=r),o}const Nn=2.75,Nv=[{name:"pelvis",a:[0,9.6,0],b:[0,10.8,0],parent:null},{name:"spine1",a:[0,10.8,0],b:[0,12.6,0],parent:"pelvis"},{name:"spine2",a:[0,12.6,0],b:[0,15,0],parent:"spine1"},{name:"neck",a:[0,15,0],b:[0,15.9,0],parent:"spine2"},{name:"head",a:[0,15.9,0],b:[0,18.4,0],parent:"neck"},{name:"jaw",a:[0,16.5,1],b:[0,16.5,1.3],parent:"head",reach:0},{name:"tail1",a:[0,9.4,-.8],b:[0,9.2,-1.2],parent:"pelvis",reach:0},{name:"tail2",a:[0,9.2,-1.2],b:[0,9,-1.6],parent:"tail1",reach:0},{name:"tail3",a:[0,9,-1.6],b:[0,8.8,-2],parent:"tail2",reach:0},{name:"tail4",a:[0,8.8,-2],b:[0,8.6,-2.4],parent:"tail3",reach:0},{name:"thighL",a:[.95,9.6,0],b:[.95,5.3,0],parent:"pelvis"},{name:"shinL",a:[.95,5.3,0],b:[.95,1.2,0],parent:"thighL"},{name:"footL",a:[.95,1.2,0],b:[.95,.4,1.5],parent:"shinL"},{name:"thighR",a:[-.95,9.6,0],b:[-.95,5.3,0],parent:"pelvis"},{name:"shinR",a:[-.95,5.3,0],b:[-.95,1.2,0],parent:"thighR"},{name:"footR",a:[-.95,1.2,0],b:[-.95,.4,1.5],parent:"shinR"},{name:"armL",a:[Nn,14.4,0],b:[Nn,11.9,0],parent:"spine2"},{name:"forearmL",a:[Nn,11.9,0],b:[Nn,9.5,0],parent:"armL"},{name:"armR",a:[-Nn,14.4,0],b:[-Nn,11.9,0],parent:"spine2"},{name:"forearmR",a:[-Nn,11.9,0],b:[-Nn,9.5,0],parent:"armR"}],pn={y:17.15,a:1.4,b:1.22},oh=.3,ch=[{y0:.45,y1:5.4,r0:6,r1:2.9,n:13,bone:"pelvis",baubles:!0,garland:!0,lights:[.62,.3]},{y0:3.8,y1:8.4,r0:5.2,r1:2.5,n:12,bone:"pelvis",turn:.3,baubles:!0,garland:!0,lights:[.62,.3]},{y0:6.7,y1:11,r0:4.45,r1:2.15,n:11,bone:"pelvis",baubles:!0,garland:!0,lights:[.62,.3]},{y0:9.4,y1:13,r0:3.8,r1:1.8,n:9,bone:"spine1",turn:.2,baubles:!0,garland:!0,lights:[.62,.3]},{y0:11.7,y1:14.8,r0:3.25,r1:1.6,n:8,bone:"spine2",baubles:!0,garland:!0,lights:[.62,.3]},{y0:13.5,y1:16.2,r0:2.9,r1:1.45,n:8,bone:"spine2",turn:.4,baubles:!0,garland:!0,lights:[.6,.28]},{y0:15,y1:19.1,r0:2.75,r1:1.35,n:8,bone:"head",flare:.85,k:3,rows:16,hole:pn,baubles:!0},{y0:18.55,y1:20.3,r0:1.8,r1:.6,n:6,bone:"head",turn:Math.PI/6,baubles:!0,garland:!0,lights:[.62,.25]}];function lh(i){const t=i*Nn,e=i>0?"L":"R";return[{y0:12.1,y1:14.9,r0:1.3,r1:.55,n:7,bone:"arm"+e,x:t,drop:.35,rows:2},{y0:10.6,y1:12.7,r0:1.15,r1:.5,n:7,bone:"forearm"+e,x:t,turn:.4,drop:.32,rows:2},{y0:9.1,y1:11.3,r0:.95,r1:.42,n:6,bone:"forearm"+e,x:t,drop:.3,rows:2},{y0:7.7,y1:9.8,r0:.72,r1:.3,n:5,bone:"forearm"+e,x:t,turn:.3,drop:.25,rows:2}]}const Eu=.5,Fv=1.4,Ov=4168267,Bv=1195289,Jr=(i,t)=>i.r1+(i.r0-i.r1)*Math.pow(Math.min(1,Math.max(0,1-t)),i.flare??Fv),eo=(i,t)=>(t-i.y0)/(i.y1-i.y0),wu=(i,t,e,n,r=0)=>n>0&&(t/(i.a+r))**2+((e-i.y)/(i.b+r))**2<1;function kv(i){const t=i.k??1,e=i.n*2*t,n=i.y1-i.y0,r=(i.y0+i.y1)/2,s=i.x??0,a=i.turn??0,o=new Cn(i.r1,i.r0,n,e,i.rows??4,!0),c=o.attributes.position,l=new Float32Array(c.count*3),h=new Ht(Ov),u=new Ht(Bv),d=new Ht;for(let f=0;f<c.count;f++){const m=c.getX(f),x=c.getY(f),g=c.getZ(f),p=(x+n/2)/n,E=Math.atan2(m,g);let b=Jr(i,p),M=0;if(p<1e-4){const T=Math.round(E/(Math.PI*2/e)),w=(T%(2*t)+2*t)%(2*t),A=1-Math.min(w,2*t-w)/t;M=-(i.drop??Eu)*A,b*=1+.05*A}c.setXYZ(f,s+Math.sin(E+a)*b,r+x+M,Math.cos(E+a)*b),d.copy(h).lerp(u,Math.pow(Math.min(1,Math.max(0,p)),.8)),l[f*3]=d.r,l[f*3+1]=d.g,l[f*3+2]=d.b}if(o.setAttribute("color",new ae(l,3)),i.hole){const f=o.index.array,m=[];for(let x=0;x<f.length;x+=3){const g=f[x],p=f[x+1],E=f[x+2],b=(c.getX(g)+c.getX(p)+c.getX(E))/3,M=(c.getY(g)+c.getY(p)+c.getY(E))/3,T=(c.getZ(g)+c.getZ(p)+c.getZ(E))/3;wu(i.hole,b,M,T)||m.push(g,p,E)}o.setIndex(m)}return o.computeVertexNormals(),o}function hh(i,t,e,n){const r=Jr(i,e)+n;return new O((i.x??0)+Math.sin(t)*r,i.y0+e*(i.y1-i.y0),Math.cos(t)*r)}function no(i,t,e,n){const s=new Ur(i,t,e,6,n),a=s.attributes.position,o=s.attributes.normal;for(let c=0;c<=t;c++)for(let l=0;l<=6;l++){const h=c*7+l,u=.42*Math.sin(c*2.2+l*(Math.PI*2*2/6));a.setXYZ(h,a.getX(h)+o.getX(h)*e*u,a.getY(h)+o.getY(h)*e*u,a.getZ(h)+o.getZ(h)*e*u)}return s.computeVertexNormals(),s}const uh=[16719904,16755216,2781439,16724160],Hv=2;function zv(i){const t=new Map,e=new Set,n=(F,B,k=0,X=0,K=0)=>{F.position.set(k,X,K),F.updateMatrixWorld(!0),F.traverse(P=>{const ht=P;if(!ht.isMesh)return;const at=ht.material,_t=`${B}|${at.uuid}|${ht.name}`,gt=ht.geometry.index?ht.geometry.toNonIndexed():ht.geometry.clone();for(const xt of Object.keys(gt.attributes))xt!=="position"&&xt!=="normal"&&xt!=="color"&&gt.deleteAttribute(xt);gt.applyMatrix4(ht.matrixWorld);let vt=t.get(_t);vt||(vt={bone:B,mat:at,name:ht.name,geos:[]},t.set(_t,vt)),vt.geos.push(gt)})},r=(F,B,k="")=>{e.add(F);const X=new Wt(F,B);return X.name=k,X},s=i.std({color:15909267,roughness:.6}),a=i.std({color:1380623,roughness:.35}),o=i.std({color:5978656,roughness:.8}),c=i.std({color:15899278,roughness:.7}),l=i.std({color:16237849,roughness:.35,metalness:.05}),h=i.std({color:16777215,vertexColors:!0,roughness:.8,flatShading:!0,side:Sn}),u=i.std({color:2055722,roughness:.85,flatShading:!0}),d=i.std({color:15250746,roughness:.3,metalness:.9}),f=i.std({color:15777605,roughness:.25,metalness:.9,flatShading:!0}),m=i.std({color:1522205,roughness:.7}),x=[i.std({color:13705003,roughness:.18,metalness:.55}),i.std({color:15316028,roughness:.2,metalness:.9}),i.std({color:2315209,roughness:.18,metalness:.55})],g=[];for(let F=0;F<Hv;F++)for(let B=0;B<uh.length;B++){const k=i.std({color:2105376,emissive:uh[B],emissiveIntensity:1.2,roughness:.3,name:`bulb-${B}-${F}`});k.userData.phase=B*1.9+F*Math.PI,k.userData.rate=1.5+.6*((B+F*3)%4),g.push(k)}const p=new Ae(.36,12,8),E=new Cn(.1,.1,.16,6),b=new Ae(.24,8,6);let M=0,T=0;const w=(F,B,k=1)=>{const X=r(p,x[M++%x.length]);X.scale.setScalar(k),n(X,F,B.x,B.y,B.z);const K=r(E,d);K.scale.setScalar(k),n(K,F,B.x,B.y+.38*k,B.z)},A=(F,B,k=1)=>{const X=r(b,g[(T++*5+M)%g.length],"bulb");X.scale.set(k,1.3*k,k),n(X,F,B.x,B.y,B.z)};for(const[F,B]of[...ch,...lh(1),...lh(-1)].entries()){n(r(kv(B),h),B.bone);const k=X=>!B.hole||!wu(B.hole,X.x,X.y,X.z,oh+.45);if(B.baubles){const X=Math.PI*2/B.n,K=Math.min(1.25,.75+B.r0*.1);for(let P=F%2;P<B.n;P+=2){const ht=P*X+(B.turn??0),at=B.r0*1.05+.1*K,_t=B.y0-(B.drop??Eu)-.36*K;w(B.bone,new O(Math.sin(ht)*at,_t,Math.cos(ht)*at),K)}}if(B.garland){const X=[],K=F*1.9;for(let P=0;P<=48;P++){const ht=P/48;X.push(hh(B,K+ht*Math.PI*2,.18+.64*ht,.13))}n(r(no(new Qn(X),120,.15+B.r0*.012,!1),f),B.bone)}if(B.lights){const[X,K]=B.lights,P=B.n-2,ht=.4+F*.7,at=Math.min(1.3,.8+B.r0*.1),_t=vt=>{const xt=Math.sin(vt*Math.PI*P);return hh(B,ht+vt*Math.PI*2,X-K*xt*xt,.1)},gt=[];for(let vt=0;vt<96;vt++)gt.push(_t(vt/96));n(r(new Ur(new Qn(gt,!0),192,.045,4,!0),m),B.bone);for(let vt=0;vt<P;vt++)for(const xt of[.3,.7]){const Nt=_t((vt+xt)/P);k(Nt)&&A(B.bone,new O(Nt.x*1.04,Nt.y-.22*at,Nt.z*1.04),at)}}}for(const F of[-1,1]){const B=F>0?"L":"R",k=F*Nn,X=r(new Ae(.75,10,6),u);n(X,"arm"+B,k,14.55,0);const K=r(new $i(.42,1.5,8),u);K.rotation.x=Math.PI,n(K,"forearm"+B,k,7.1,0),w("forearm"+B,new O(k+F*.75,9.95,.35),.8),w("forearm"+B,new O(k-F*.2,8.55,.7),.7);for(const[P,ht]of[[11.6,.3],[10.2,-.5],[8.8,.9],[12.9,-.2]]){const at=.95-(12.9-P)*.1;A("forearm"+B,new O(k+Math.sin(ht*F)*at,P,Math.cos(ht)*at),.85)}}const R=ch.find(F=>F.hole),_=Jr(R,eo(R,pn.y))-.72,S=1.5,y=1.32,D=.55,I=(F,B)=>_+D*Math.sqrt(Math.max(0,1-(F/S)**2-((B-pn.y)/y)**2)),U=r(new Ae(1,24,16),s);U.scale.set(S,y,D),n(U,"head",0,pn.y,_);const H=new Ae(.2,12,8);for(const F of[-1,1]){const B=r(H,a);B.scale.set(.8,1.3,.45),n(B,"head",F*.5,17.5,I(F*.5,17.5));const k=r(H,c);k.scale.set(1.3,.8,.3),n(k,"head",F*.88,16.95,I(F*.88,16.95)-.02);const X=r(new Xe(.78,.32,.3),o);X.rotation.set(0,F*.25,F*-.22),n(X,"head",F*.37,16.9,I(F*.37,16.9)+.02)}const $=r(new Rr(.46,.075,6,18,2.3),a);$.rotation.z=-Math.PI/2-1.15,n($,"head",0,16.85,I(0,16.4)+.02);const V=(F,B,k)=>{const X=[];for(let K=0;K<64;K++){const P=K/64*Math.PI*2,ht=Math.cos(P)*F,at=pn.y+Math.sin(P)*B,_t=Jr(R,eo(R,at))+k;X.push(new O(ht,at,Math.sqrt(Math.max(0,_t*_t-ht*ht))))}return new Qn(X,!0)};n(r(no(V(pn.a,pn.b,.05),96,oh,!0),u),"head"),n(r(no(V(pn.a+.38,pn.b+.38,.06),96,.12,!0),f),"head");for(let F=0;F<12;F++){const B=(F+.5)/12*Math.PI*2,k=Math.cos(B)*(pn.a+.72),X=pn.y+Math.sin(B)*(pn.b+.72),K=Jr(R,eo(R,X))+.12;A("head",new O(k,X,Math.sqrt(Math.max(0,K*K-k*k))),.9)}const tt=1.2,st=new an,ct=r(new Ae(1,24,10,0,Math.PI*2,0,Math.PI/2),l);ct.scale.set(1.66*tt,1.42*tt,1.72*tt),st.add(ct);const ft=r(new Rr(1,.11,6,20,Math.PI),l);ft.rotation.y=Math.PI/2,ft.scale.copy(ct.scale),st.add(ft);const Ct=new Ar([new Rt(.8,0),new Rt(1,0),new Rt(1,.09),new Rt(.8,.09),new Rt(.8,0)],32),zt=r(Ct,l);zt.scale.set(2.05*tt,1,2.2*tt),zt.position.set(0,-.02,.22*tt),st.add(zt);const it=r(new bc(1,24),i.std({color:8022610,roughness:.9}));it.rotation.x=Math.PI/2,it.scale.set(1.62*tt,1.68*tt,1),it.position.y=.04,st.add(it);const W=-1.3*tt;st.position.set(0,0,-W);const Z=new an;Z.add(st),Z.rotation.set(-.26,0,.5,"ZXY"),n(Z,"head",0,19.65,W);for(const F of t.values()){const B=i.segs.find(K=>K.name===F.bone).a,k=Tc(F.geos);for(const K of F.geos)K.dispose();if(!k)throw new Error(`builder: parts on ${F.bone} would not merge`);k.translate(-B[0],-B[1],-B[2]);const X=new Wt(k,F.mat);X.name=F.name,i.at(X,F.bone,B[0],B[1],B[2])}for(const F of e)F.dispose()}const fh=new WeakMap;function Vv(i,t){let e=fh.get(i);if(!e){const n=new Set;i.traverse(r=>{const s=r.material;r.name==="bulb"&&s&&n.add(s)}),e=[...n],fh.set(i,e)}for(const n of e){const r=.5+.5*Math.sin(t*n.userData.rate+n.userData.phase);n.emissiveIntensity=.55+1.35*r*r*r}}const Gv={id:"builder",name:"Builder",blurb:"A builder in a Christmas tree costume, tipping his hat",segs:Nv,dress:zv,tick:Vv,fit:{size:1,limb:.2}},Wv=[{name:"pelvis",a:[0,9.6,0],b:[0,10.6,0],parent:null},{name:"spine1",a:[0,10.6,0],b:[0,12.4,.1],parent:"pelvis"},{name:"spine2",a:[0,12.4,.1],b:[0,15,.1],parent:"spine1"},{name:"neck",a:[0,15,.1],b:[0,15.9,.15],parent:"spine2"},{name:"head",a:[0,15.9,.15],b:[0,18.4,.3],parent:"neck"},{name:"jaw",a:[0,16.5,-.3],b:[0,15.55,1],parent:"head",reach:0},{name:"tail1",a:[0,10.4,-1],b:[0,9.6,-1.1],parent:"pelvis",reach:0},{name:"tail2",a:[0,9.6,-1.1],b:[0,8.8,-1.2],parent:"tail1",reach:0},{name:"tail3",a:[0,8.8,-1.2],b:[0,8,-1.3],parent:"tail2",reach:0},{name:"tail4",a:[0,8,-1.3],b:[0,7.2,-1.4],parent:"tail3",reach:0},{name:"thighL",a:[1.1,9.6,0],b:[1.2,5.3,.2],parent:"pelvis"},{name:"shinL",a:[1.2,5.3,.2],b:[1.2,1.1,-.1],parent:"thighL"},{name:"footL",a:[1.2,1.1,-.1],b:[1.2,.35,1.4],parent:"shinL"},{name:"thighR",a:[-1.1,9.6,0],b:[-1.2,5.3,.2],parent:"pelvis"},{name:"shinR",a:[-1.2,5.3,.2],b:[-1.2,1.1,-.1],parent:"thighR"},{name:"footR",a:[-1.2,1.1,-.1],b:[-1.2,.35,1.4],parent:"shinR"},{name:"armL",a:[2.4,14.6,0],b:[2.72,11.9,-.05],parent:"spine2"},{name:"forearmL",a:[2.72,11.9,-.05],b:[2.85,9.45,.4],parent:"armL"},{name:"armR",a:[-2.4,14.6,0],b:[-2.72,11.9,-.05],parent:"spine2"},{name:"forearmR",a:[-2.72,11.9,-.05],b:[-2.85,9.45,.4],parent:"armR"}],os=i=>new O(i[0],i[1],i[2]);function Tu(i,t){const e=os(t).sub(os(i)).normalize(),n=new O(1,0,0).addScaledVector(e,-e.x);n.lengthSq()<1e-6&&n.set(0,0,1),n.normalize();const r=new O().crossVectors(n,e);return new ne().makeBasis(n,e,r).setPosition(i[0],i[1],i[2])}const Kn=(i,t,e,n,r)=>pi(i,t,e,n,r,6,5,2);function pi(i,t,e,n,r,s=12,a=14,o=4){const c=os(t).distanceTo(os(i)),l=[];for(let u=0;u<=o;u++){const d=-Math.PI/2+u/o*(Math.PI/2);l.push(new Rt(Math.max(.001,e*Math.cos(d)),e*.75*Math.sin(d)))}const h=Math.min(.2,1.3*Math.max(e,r)/c);for(let u=1;u<a;u++){const d=u/a,f=n+(e-n)*Math.exp(-((d/h)**2))+(r-n)*Math.exp(-(((1-d)/h)**2));l.push(new Rt(f,d*c))}for(let u=0;u<=o;u++){const d=u/o*(Math.PI/2);l.push(new Rt(Math.max(.001,r*Math.cos(d)),c+r*.75*Math.sin(d)))}return new Ar(l,s).applyMatrix4(Tu(i,t))}function Me(i,t,e=[1,1,1],n=12){return new Ae(t,n,Math.max(6,Math.round(n*.7))).scale(e[0],e[1],e[2]).translate(i[0],i[1],i[2])}function Xv(i,t,e=24,n=8){return new Ur(new Qn(i.map(os)),e,t,n,!1)}function ec(i,t,e=24,n=8){return[Xv(i,t,e,n),Me(i[0],t,[1,1,1],n),Me(i[i.length-1],t,[1,1,1],n)]}function fn(i){const t=Tc(i.map(e=>e.index?e:e.toNonIndexed()),!1);for(const e of i)e.dispose();return t}const qv=i=>[-i[0],i[1],i[2]];function na(i,t,e,n,r=6e4){const s=v=>(t.max[v]-t.min[v])*e/(e-7),a=v=>t.min[v]-2.5*s(v)/e,o=a(0)+s(0)/2,c=a(1)+s(1)/2,l=a(2)+s(2)/2,h=s(0)/2,u=s(1)/2,d=s(2)/2,f=new xu(e,new fa,!1,!1,r);f.isolation=50;const m=f.field,x=e,g=40;for(let v=0;v<x;v++){const _=l+(2*v/x-1)*d;for(let S=0;S<x;S++){const y=c+(2*S/x-1)*u;for(let D=0;D<x;D++){const I=o+(2*D/x-1)*h;m[v*x*x+S*x+D]=Math.max(0,Math.min(100,50-i(I,y,_)*g))}}}f.update();const p=f.count,E=f.positionArray,b=f.normalArray,M=new Float32Array(p*3),T=new Float32Array(p*3),w=n?new Float32Array(p*3):null,A=new Ht;for(let v=0;v<p;v++){const _=o+E[v*3]*h,S=c+E[v*3+1]*u,y=l+E[v*3+2]*d;M[v*3]=_,M[v*3+1]=S,M[v*3+2]=y;let D=b[v*3]/h,I=b[v*3+1]/u,U=b[v*3+2]/d;const H=Math.hypot(D,I,U)||1;D/=H,I/=H,U/=H,T[v*3]=D,T[v*3+1]=I,T[v*3+2]=U,w&&(A.setRGB(1,1,1),n(_,S,y,A),w[v*3]=A.r,w[v*3+1]=A.g,w[v*3+2]=A.b)}f.geometry.dispose();const R=new Ue;return R.setAttribute("position",new ae(M,3)),R.setAttribute("normal",new ae(T,3)),w&&R.setAttribute("color",new ae(w,3)),R.computeBoundingSphere(),R}const Vr=(i,t,e)=>-et(-i,-t,e),Sr=[.43,17.02,1.06],dh=[.43,16.99,.74];function Au(i,t,e,n,r){const s=Math.abs(i),o=e-n,c=r,l=Math.hypot(o,c),h=(s*o+(t-e)*c)/l;return Math.max(h,n-t)}function Yv(i,t,e){const n=Math.abs(i);let r=Ut(i,t,e,0,17.45,-.12,1.1,1.13,1.32);r=et(r,Ut(i,t,e,0,16.8,-.35,.98,.62,.95),.3),r=et(r,Ut(i,t,e,0,16.68,.58,.8,.74,.72),.35),r=et(r,Ut(n,t,e,.78,16.86,.55,.33,.3,.48),.22),r=et(r,St(n,t,e,.86,16.8,.35,.98,16.68,-.42,.15,.13),.15),r=et(r,St(n,t,e,.12,17.32,1.12,.78,17.36,.95,.17,.15),.2),r=Vr(r,-Ut(n,t,e,1.32,16.95,.05,.38,.5,.55),.18),r=Vr(r,-Ut(n,t,e,Sr[0],Sr[1],Sr[2],.36,.34,.5),.07);const s=Math.min(Au(i,t,16.86,16.42,.19),Math.hypot(n-.08,t-16.47)-.11);return r=Vr(r,-Math.max(s,.8-e),.04),r=Vr(r,16.08-t,.1),r=Vr(r,-Ut(n,t,e,.8,16.25,.62,.22,.3,.35),.12),r}function $v(i,t,e,n){const r=Math.abs(i),s=Ut(r,t,e,Sr[0],Sr[1],Sr[2],.42,.4,.56),a=Math.max(Math.min(Au(i,t,16.86,16.42,.19),Math.hypot(r-.08,t-16.47)-.11),.8-e)-.06,c=Math.max(0,Math.min(1,-Math.min(s,a)/.05))*(.75+.25*Math.max(0,Math.min(1,(1.2-e)/.4)));n.copy(t_).lerp(e_,c),c===0&&n.multiplyScalar(.94+.06*Math.max(0,Math.min(1,(t-16.3)/1.2)))}function jv(i,t,e,n,r,s,a){const o=r-e,c=s-n,l=Math.max(0,Math.min(1,((i-e)*o+(t-n)*c)/(o*o+c*c)));return Math.hypot(i-e-o*l,t-n-c*l)-a}function Zv(i,t,e){const n=Math.abs(i);let r=St(n,t,e,0,15.62,1,.5,15.66,.66,.17,.17);return r=et(r,St(n,t,e,.5,15.66,.66,.78,15.74,-.12,.17,.16),.1),r=et(r,Math.max(jv(t,e,15.74,-.14,16.4,-.3,.2),Math.abs(n-.8)-.07),.08),r=et(r,Ut(n,t,e,.82,16.45,-.3,.15,.11,.13),.06),r=et(r,Ut(i,t,e,0,15.6,1,.33,.21,.17),.1),r=et(r,St(n,t,e,0,15.8,1.02,.52,15.8,.62,.12,.12),.08),r}function Kv(i,t,e){const n=Math.abs(i),r=Math.abs(Math.hypot(n-.25,t-10.95,e-.75)-1.4)-.09;let s=Math.max(r,Ut(n,t,e,1.2,10.5,-.18,.78,.7,.85));return s=et(s,St(n,t,e,.6,11,-.45,1.55,11.05,.2,.1,.1),.12),s=et(s,Ut(i,t,e,0,9.95,-.78,.48,.72,.22),.15),s=et(s,St(n,t,e,.38,10.35,-.72,.85,10.4,-.45,.17,.15),.12),s=et(s,St(n,t,e,1.25,10.15,-.15,1,9.62,0,.24,.24),.15),s=et(s,ye(n,t,e,.92,9.6,0,.32),.12),s=Math.min(s,Math.hypot(Math.hypot(t-9.6,e)-.36,n-1)-.1),s=et(s,St(n,t,e,.95,9.48,.28,.12,9.3,.72,.15,.14),.1),s=et(s,St(n,t,e,.12,9.32,.72,.1,9.02,.66,.15,.15),.1),s=et(s,St(n,t,e,1,9.38,-.2,.78,8.92,-.05,.18,.17),.1),s=et(s,St(n,t,e,.78,8.92,-.05,.12,9.04,.62,.13,.12),.1),s}function io(i,t,e,n,r){return[new Cn(t,t*1.08,e,12).translate(i[0],i[1],i[2]),new Xe(n,e*.42,.18).translate(i[0],i[1]+.02,i[2]-t*.6),new Xe(.15,e*.55,r).rotateX(.35).translate(i[0],i[1]-.05,i[2]-t-r*.42)]}function ph(i){const t=[],e=[1.05,1.42,1.64,1.76,1.8,1.74,1.6],n=[.95,1.06,1.12,1.14,1.12,1.06,.96],r=[.32,.48,.62,.72,.8,.85,.85];for(let s=0;s<7;s++){const a=14.55-s*.4,o=e[s],c=.98,l=n[s],h=s>=5,u=[[.26,a+.04,-.78]],d=h?.74*Math.PI:Math.PI-Math.asin(Math.min(.9,.42/o));for(let f=0;f<=7;f++){const m=.14*Math.PI+f/7*(d-.14*Math.PI),x=-Math.cos(m)*(m<Math.PI/2?c:l),g=a-r[s]*Math.pow((m-.14*Math.PI)/(.86*Math.PI),1.3);u.push([o*Math.sin(m),g,x])}if(h){const f=u[u.length-1];u.push([.62,f[1]+.25+(s-5)*.2,1.02],[.26,12.62,1.06])}else u.push([.24,u[u.length-1][1]+.04,l*.98]);t.push(...ec(u.map(f=>[f[0]*i,f[1],f[2]]),s===0?.13:.12,28,7))}return t}function Jv(i,t){const e=Tu(i,[i[0]+t[0],i[1]+t[1],i[2]+t[2]]),n=1.35,r=(u,d,f)=>{const m=new O(u*n,d*n,f*n).applyMatrix4(e);return[m.x,m.y,m.z]},s=[];for(const[u,d,f]of[[0,.1,.16],[0,.1,-.02],[0,.1,-.2],[.02,.3,.2],[.02,.3,0],[.02,.3,-.18]])s.push(Me(r(u,d,f),.14,[1,1,1],8));const a=[[.21,1],[.07,1.08],[-.07,1],[-.2,.82]];for(const[u,d]of a){const f=r(.02,.4,u*.85),m=r(0,.4+.55*d,u),x=r(-.07,.4+.92*d,u*1.05),g=r(-.17,.4+1.15*d,u*1.08),p=r(-.28,.4+1.3*d,u*1.08);s.push(Kn(f,m,.1,.075,.105),Kn(m,x,.1,.07,.095),Kn(x,g,.09,.065,.085),Kn(g,p,.08,.06,.065))}const o=r(0,.25,.26),c=r(-.05,.6,.48),l=r(-.1,.88,.58),h=r(-.16,1.08,.62);return s.push(Kn(o,c,.11,.085,.1),Kn(c,l,.1,.075,.09),Kn(l,h,.09,.065,.065)),s}function Qv(){const i=[];i.push(Me([1.2,.88,0],.27)),i.push(Me([1.24,.44,-.3],1,[.27,.32,.44]));for(const[s,a,o]of[[.98,.62,.36],[1.22,.62,.34],[1.46,.55,.22],[1.08,.55,.6],[1.32,.52,.56]])i.push(Me([s,a,o],.17,[1,1,1],8));const t=[.95,1.12,1.28,1.42,1.55],e=[.84,1.08,1.3,1.5,1.68],n=[.1,.075,.07,.065,.065],r=[.42,.34,.3,.27,.24];for(let s=0;s<5;s++){const a=[t[s],.5,.62],o=[e[s],.22,1.38-s*.05];i.push(Kn(a,o,n[s]*1.3,n[s],n[s]*1.35));const c=[o[0]+(s===0?-.02:.02*s),.15,o[2]+r[s]];i.push(Kn(o,c,n[s]*1.05,n[s]*.8,n[s]*.85))}return i}const Ru=15656396,t_=new Ht(Ru),e_=new Ht(1905164),n_=5832490;function i_(i){const t=i.std({color:Ru,roughness:.42,metalness:0,emissive:2894368,emissiveIntensity:1}),e=i.std({color:16777215,vertexColors:!0,roughness:.42,metalness:0,emissive:2894368,emissiveIntensity:1}),n=i.std({color:1182214,roughness:.9}),r=i.std({color:0,emissive:n_,emissiveIntensity:1,roughness:1}),s=(f,m,x=t)=>{for(const g of["L","R"]){const p=new Wt(f,x);p.name=`skelly-${m}${g}`,g==="R"&&(p.scale.x=-1),i.at(p,m+g,0,0,0)}},a=(f,m,x=t,g=`skelly-${m}`)=>{const p=new Wt(f,x);return p.name=g,i.at(p,m,0,0,0),p},o=na(Yv,{min:[-1.25,15.95,-1.5],max:[1.25,18.65,1.4]},52,$v,4e4);a(o,"head",e);const c=fn([Me(dh,.1,[1,1.1,.7],10),Me(qv(dh),.1,[1,1.1,.7],10)]);a(c,"head",r,"skelly-embers");const l=(f,m,x,g,p)=>{const E=[];for(let b=0;b<10;b++){const M=-1.05+b/9*2.1;E.push(new Mc(.075,m,2,7).scale(1,1,.75).rotateY(M).translate(x*Math.sin(M),f,p+g*Math.cos(M)))}return E};a(fn(l(16.15,.17,.6,.78,.47)),"head",t,"skelly-teeth"),a(fn([Me([0,15.98,.8],1,[.58,.24,.4])]),"head",n,"skelly-mouth"),a(na(Zv,{min:[-1,15.36,-.55],max:[1,16.6,1.22]},36,void 0,12e3),"jaw"),a(fn(l(15.88,.15,.56,.74,.47)),"jaw",t,"skelly-lowerteeth"),a(fn([0,1,2,3].flatMap(f=>io([0,15.12+f*.25,-.22],.25,.19,.72,.3))),"neck"),a(fn([...[0,1,2,3,4,5].flatMap(f=>io([0,12.55+f*.4,-.82],.25,.26,.6,.28)),...ph(1),...ph(-1),Me([0,13.55,1.08],1,[.26,1.05,.12],12),Me([0,14.42,1],1,[.36,.32,.13],10),...ec([[.22,14.72,1.02],[.85,14.86,.9],[1.55,14.98,.42],[2.18,15.02,.02]],.13,20,8),...ec([[-.22,14.72,1.02],[-.85,14.86,.9],[-1.55,14.98,.42],[-2.18,15.02,.02]],.13,20,8),Me([1.25,13.95,-1],1,[.62,.85,.09],12),Me([-1.25,13.95,-1],1,[.62,.85,.09],12)]),"spine2"),a(fn([0,1,2,3].flatMap(f=>io([0,10.85+f*.42,-.42],.36,.3,1.15,.45))),"spine1"),a(na(Kv,{min:[-1.75,8.72,-1.05],max:[1.75,11.2,1.05]},40,void 0,24e3),"pelvis"),s(fn([Me([2.33,14.56,-.03],.36),pi([2.4,14.45,0],[2.71,12.08,-.05],.3,.2,.28),Me([2.53,11.98,-.05],.21,[1,.9,1],10),Me([2.88,11.98,-.06],.2,[1,.9,1],10)]),"arm");const h=[2.72,11.9,-.05],u=[2.85,9.45,.4],d=[u[0]-h[0],u[1]-h[1],u[2]-h[2]];s(fn([Me([2.74,11.98,-.25],.21,[1,1.1,1],10),pi([2.76,11.85,-.2],[2.86,9.62,.22],.19,.13,.16,10),pi([2.66,11.72,.12],[2.86,9.62,.54],.16,.13,.21,10),...Jv([u[0],u[1]-.05,u[2]],d)]),"forearm"),s(fn([Me([1.12,9.62,.02],.36),pi([1.12,9.6,0],[1.55,9.24,-.03],.2,.18,.2,10),Me([1.64,9.3,-.08],.3,[1,1.2,1]),pi([1.56,9.22,0],[1.22,5.62,.18],.28,.21,.34),Me([1,5.5,.12],.29),Me([1.42,5.5,.12],.29)]),"thigh"),s(fn([pi([1.19,5.12,.18],[1.16,1.28,-.08],.36,.18,.24),Me([1,1.16,-.05],.17,[1,1.2,1],10),pi([1.52,4.95,.02],[1.47,1.3,-.16],.16,.09,.17,10),Me([1.2,5.36,.62],.27,[1,1.1,.55])]),"shin"),s(fn(Qv()),"foot")}const mh=new WeakMap,r_={id:"skeleton",name:"Skelly",blurb:"Bones, a grin, and green embers for eyes",segs:Wv,dress:i_,fit:{size:1.04,limb:.3},tick(i,t){let e=mh.get(i);if(!e){const r=[];i.traverse(s=>{s.name==="skelly-embers"&&r.push(s.material)}),e={jaw:i.getObjectByName("jaw")??null,embers:r},mh.set(i,e)}const n=.95+.3*Math.sin(t*2.1)+.1*Math.sin(t*7.3+1.1);for(const r of e.embers)r.emissiveIntensity=n;if(e.jaw){const r=t%4.6;e.jaw.rotation.x=r<.75?.05+.07*Math.abs(Math.sin(r*25)):.02}}},s_=[{name:"pelvis",a:[0,9.6,0],b:[0,10.6,0],parent:null},{name:"spine1",a:[0,10.6,0],b:[0,12.4,.1],parent:"pelvis"},{name:"spine2",a:[0,12.4,.1],b:[0,15,.1],parent:"spine1"},{name:"neck",a:[0,15,.1],b:[0,15.9,.15],parent:"spine2",reach:.8},{name:"head",a:[0,15.9,.15],b:[0,18.4,.3],parent:"neck"},{name:"jaw",a:[0,16.4,.9],b:[0,16.4,1.2],parent:"head",reach:0},{name:"tail1",a:[0,14.8,-1.2],b:[0,12.6,-1.4],parent:"spine2",reach:0},{name:"tail2",a:[0,12.6,-1.4],b:[0,10.4,-1.6],parent:"tail1",reach:0},{name:"tail3",a:[0,10.4,-1.6],b:[0,8.2,-1.8],parent:"tail2",reach:0},{name:"tail4",a:[0,8.2,-1.8],b:[0,6.2,-2],parent:"tail3",reach:0},{name:"thighL",a:[1.1,9.6,0],b:[1.2,5.3,.2],parent:"pelvis"},{name:"shinL",a:[1.2,5.3,.2],b:[1.2,1.1,-.1],parent:"thighL"},{name:"footL",a:[1.2,1.1,-.1],b:[1.2,.35,1.4],parent:"shinL"},{name:"thighR",a:[-1.1,9.6,0],b:[-1.2,5.3,.2],parent:"pelvis"},{name:"shinR",a:[-1.2,5.3,.2],b:[-1.2,1.1,-.1],parent:"thighR"},{name:"footR",a:[-1.2,1.1,-.1],b:[-1.2,.35,1.4],parent:"shinR"},{name:"armL",a:[2.5,14.55,0],b:[2.95,11.95,-.05],parent:"spine2"},{name:"forearmL",a:[2.95,11.95,-.05],b:[3.12,9.6,.35],parent:"armL"},{name:"armR",a:[-2.5,14.55,0],b:[-2.95,11.95,-.05],parent:"spine2"},{name:"forearmR",a:[-2.95,11.95,-.05],b:[-3.12,9.6,.35],parent:"armR"}],a_={min:[-4.2,-.5,-1.9],max:[4.2,17.1,2.3]},o_=[3.12,9.6,.35],Cu=(i,t,e)=>St(i,t,e,3.05,10.55,.2,3.16,9,.45,.3,.3);function Ac(i,t,e){const n=Math.abs(i);let r=4;if(t>8.4&&(r=Ut(i,t,e,0,13,.05,1.74,2.15,1.2),r=et(r,Ut(i,t,e,0,11.35,.15,1.62,1.1,1.12),.5),t>13.2&&(r=et(r,St(n,t,e,0,15,-.05,2.15,14.62,0,.5,.56),.5),r=et(r,Math.hypot(Math.hypot(i,(e+.02)*1.15)-.78,t-15.18)-.2,.12),r=et(r,St(i,t,e,0,14.9,.05,0,15.6,.12,.62,.55),.2)),t<11.6&&(r=et(r,Ut(i,t,e,0,10.05,0,1.78,1.05,1.15),.4))),t<10.9&&(r=et(r,St(n,t,e,1.08,9.6,0,1.2,5.3,.15,.88,.74),.35),t<6.4&&(r=et(r,St(n,t,e,1.2,5.3,.15,1.22,2.1,-.05,.74,.7),.25))),n>1.5&&t>8.8){const s=St(n,t,e,2.5,14.55,0,2.95,11.95,-.05,.6,.55);r=t>14?et(r,s,.3):Math.min(r,s),t<12.9&&(r=et(r,St(n,t,e,2.95,11.95,-.05,3.08,10,.28,.55,.52),.25),r=Math.max(r,-Cu(n,t,e)))}if(t<3.4){const s=et(St(n,t,e,1.22,2.3,-.05,1.22,.6,-.05,.5,.52),Math.max(Ut(n,t,e,1.22,.5,.55,.58,.5,1.3),-t),.3);r=Math.min(r,s)}return r}const nc=0,Lu=1,c_=2,Pu=3,l_=4;function Du(i,t,e){const n=Math.abs(i);return Cu(n,t,e)<.06?l_:t<2.25&&n>.4?c_:t>15.38&&n<.8?Pu:n>2.1&&t>9.2||t>10.72?nc:Lu}const h_=`
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
  }`;function u_(){const i=new gi({vertexColors:!0,roughness:.88,metalness:0});return i.onBeforeCompile=t=>{t.vertexShader=t.vertexShader.replace("#include <common>",`#include <common>
 attribute vec3 aCloth; varying vec3 vCloth; varying vec3 vBind; varying vec3 vBindN;`).replace("#include <begin_vertex>",`#include <begin_vertex>
 vBind = position; vBindN = normal; vCloth = aCloth;`),t.fragmentShader=t.fragmentShader.replace("#include <common>",`#include <common>
`+h_).replace("#include <color_fragment>",`#include <color_fragment>
 diffuseColor.rgb = cloth(diffuseColor.rgb, vBind, normalize(vBindN), vCloth);`)},i.customProgramCacheKey=()=>"jack-cloth-v2",i}const De=[0,17.15,.22],f_=1.82,En=1.38,Iu=.24;function Rc(i,t,e){const n=i-De[0],r=t-De[1],s=e-De[2],a=Math.hypot(n,s),o=Math.atan2(s,n),c=1-Math.sqrt(Math.abs(Math.cos(5*(o-Math.PI/2)))),l=1-.06*c;let h=(Math.hypot(a/l/f_,r/En)-1)*En;return h+=.32*Math.exp(-((a/.6)**2))*Math.min(1,Math.abs(r)/En),{d:h,groove:c}}function gh(i,t,e,n,r,s,a=0){const o=(n+r)/2,c=Math.cos(a),l=Math.sin(a),h=(i-e)*c-(t-o)*l,u=(i-e)*l+(t-o)*c+o,d=n-r,f=Math.hypot(d,s);return Math.max((Math.abs(h)*d+(u-n)*s)/f,r-u)}const vh=(i,t,e,n,r,s)=>(Math.hypot((i-e)/r,(t-n)/s)-1)*Math.min(r,s),_h=(i,t,e,n,r,s)=>{const a=Math.abs(i-e)-r,o=Math.abs(t-n)-s;return Math.hypot(Math.max(a,0),Math.max(o,0))+Math.min(Math.max(a,o),0)};function d_(i,t){const e=Math.abs(i);let n=gh(e,t,.66,.74,.14,.36,-.12);n=Math.min(n,gh(i,t,0,.1,-.2,.17));let r=Math.max(vh(i,t,0,-.36,1.2,.64),-vh(i,t,0,-.08,1.34,.56));return r=Math.max(r,-_h(e,t,.32,-.7,.11,.12)),r=Math.max(r,-_h(i,t,0,-.93,.12,.13)),Math.min(n,r)}function p_(i,t,e){const n=Rc(i,t,e).d;let r=Math.max(n,-(n+Iu));const s=Math.max(d_(i-De[0],t-De[1]),De[2]+.4-e);return r=Math.max(r,-s),r}const m_=new Ht(15233038),g_=new Ht(10108936),v_=new Ht(16757820),__=new Ht(16737290);function x_(i,t,e,n){const{d:r,groove:s}=Rc(i,t,e);if(r<-.05){n.copy(v_).lerp(__,Math.max(0,Math.min(1,(t-De[1]-En*.2)/(En*.8))));return}n.copy(m_).lerp(g_,Math.min(1,s*1.3)),n.multiplyScalar(.85+.15*(1-Math.abs(t-De[1])/En))}function M_(i){const t=i.std({color:16777215,vertexColors:!0,roughness:.5,metalness:0,emissive:16777215,emissiveIntensity:1});return t.onBeforeCompile=e=>{e.vertexShader=e.vertexShader.replace("#include <common>",`#include <common>
 attribute float aGlow; varying float vGlow;`).replace("#include <begin_vertex>",`#include <begin_vertex>
 vGlow = aGlow;`),e.fragmentShader=e.fragmentShader.replace("#include <common>",`#include <common>
 varying float vGlow;`).replace("#include <color_fragment>",`#include <color_fragment>
 vec3 glowHue = diffuseColor.rgb; diffuseColor.rgb *= 1.0 - 0.92 * vGlow;`).replace("#include <emissivemap_fragment>",`#include <emissivemap_fragment>
 totalEmissiveRadiance *= vGlow * glowHue;`)},t.customProgramCacheKey=()=>"jack-shell-v2",t}let ia=1;const $e=()=>(ia=ia*1664525+1013904223>>>0,ia/4294967296),b_=new O(0,1,0),xh=[15255146,13937738,15916172,12884540].map(i=>new Ht(i));function Gr(i,t,e,n){const r=new $i(n,e,4,1).translate(0,e/2,0);r.applyQuaternion(new ke().setFromUnitVectors(b_,t.clone().normalize())).translate(i.x,i.y,i.z);const s=xh[Math.floor($e()*xh.length)],a=r.attributes.position.count,o=new Float32Array(a*3);for(let c=0;c<a;c++)o[c*3]=s.r,o[c*3+1]=s.g,o[c*3+2]=s.b;return r.setAttribute("color",new ae(o,3)),r}function Wr(i,t){const e=i.clone().normalize(),n=Math.abs(e.y)<.9?new O(0,1,0):new O(1,0,0),r=new O().crossVectors(e,n).normalize(),s=new O().crossVectors(e,r),a=$e()*Math.PI*2,o=Math.tan(t*Math.sqrt($e()));return e.addScaledVector(r,Math.cos(a)*o).addScaledVector(s,Math.sin(a)*o).normalize()}function jn(i){const t=Tc(i.map(e=>e.index?e.toNonIndexed():e),!1);for(const e of i)e.dispose();return t}function ro(i,t){let e=0,n=3;for(let r=0;r<30;r++){const s=(e+n)/2;Ac(i,t,s)<0?e=s:n=s}return e}function Mh(i,t,e){let n=0,r=3;for(let s=0;s<26;s++){const a=(n+r)/2;Ac(Math.cos(t)*a,i,e+Math.sin(t)*a)<0?n=a:r=a}return n}function Ws(i,t,e,n){const r=Math.max(8,Math.round(t*18)),s=new Ur(i,r,e,7,n),a=s.attributes.uv,o=a.count,c=new Float32Array(o*3),l=new Ht(13150312),h=new Ht(9071160),u=new Ht;for(let d=0;d<o;d++){const f=.5+.5*Math.sin((a.getX(d)*t*4.5+a.getY(d))*Math.PI*2);u.copy(l).lerp(h,f*f),c[d*3]=u.r,c[d*3+1]=u.g,c[d*3+2]=u.b}return s.setAttribute("color",new ae(c,3)),s}function S_(i){ia=7;const t=i.bones.get("pelvis").parent;if(t?.isSkinnedMesh){const it=t.geometry.attributes.position,W=new Float32Array(it.count*3);for(let Z=0;Z<it.count;Z++){const F=Du(it.getX(Z),it.getY(Z),it.getZ(Z));W[Z*3]=F===nc?1:0,W[Z*3+1]=F===Lu?1:0,W[Z*3+2]=F===Pu?1:0}t.geometry.setAttribute("aCloth",new ae(W,3)),t.material.dispose(),t.material=u_()}const e=i.std({color:16777215,vertexColors:!0,roughness:.75,metalness:0}),n=i.std({color:16777215,vertexColors:!0,roughness:.9,metalness:0}),r=(it,W,Z,F)=>{for(const B of["L","R"]){const k=new Wt(it,Z);k.name=`jack-${F}${B}`,B==="R"&&(k.scale.x=-1),i.at(k,W+B,0,0,0)}},s=na(p_,{min:[-1.92,De[1]-En-.05,De[2]-1.92],max:[1.92,De[1]+En+.05,De[2]+1.92]},48,x_,4e4),a=s.attributes.position,o=new Float32Array(a.count);for(let it=0;it<a.count;it++)o[it]=Math.max(0,Math.min(1,-Rc(a.getX(it),a.getY(it),a.getZ(it)).d/.16));s.setAttribute("aGlow",new ae(o,1));const c=new Wt(s,M_(i));c.name="jack-pumpkin",i.at(c,"head",0,0,0);const l=De[1]-En+Iu+.3,h=new an;h.name="jack-flame";const u=new Wt(jn([new Ae(.15,10,8).scale(1,1.1,1).translate(0,.15,0),new $i(.148,.42,10,1,!0).translate(0,.36,0)]),i.std({color:0,emissive:16762976,emissiveIntensity:2.4}));u.name="jack-flamecore",h.add(u),i.at(h,"head",0,l,De[2]-.15);const d=De[1]+En-.22,f=new Cn(.16,.26,1.5,7,8).translate(0,.75,0);{const it=f.attributes.position;for(let W=0;W<it.count;W++){const Z=it.getY(W)/1.5,F=1+.6*Math.max(0,1-Z*5);it.setXYZ(W,it.getX(W)*F+.5*Z*Z,it.getY(W),it.getZ(W)*F-.1*Z*Z)}f.computeVertexNormals()}i.at(new Wt(f.translate(0,d,De[2]-.05),i.std({color:5990956,roughness:.85})),"head",0,0,0);const m=i.std({color:4863526,roughness:.95,side:Sn}),x=[];for(let it=0;it<=10;it++){const W=1.08+it/10*1.12;x.push(new Rt(W,-.22*((W-1.08)/1.12)**2))}const g=[];for(let it=0;it<=10;it++){const W=it/10;g.push(new Rt(1.1-.24*W-(W>.85?(W-.85)*3.6:0),W*1.2))}const p=jn([new Ar(x,28),new Ar(g,28)]);{const it=p.attributes.position;for(let W=0;W<it.count;W++){const Z=it.getX(W),F=it.getY(W),B=it.getZ(W),k=F>.7?.2*Math.exp(-((Z/.5)**2))*Math.max(0,B):0;it.setXYZ(W,Z,F-.07*Math.max(0,Z)*Math.max(0,Math.hypot(Z,B)-1.08)-k*.6,B-k)}p.computeVertexNormals()}const E=new Rr(1.07,.08,6,28).rotateX(Math.PI/2).scale(1,2.4,1).translate(0,.2,0),b=new an;b.add(new Wt(p,m),new Wt(E,i.std({color:1971986,roughness:.8}))),b.rotation.set(-.08,0,-.2),i.at(b,"head",.08,De[1]+En-.1,De[2]-.1);const M=[];for(let it=0;it<34;it++){const W=it/34*Math.PI*2+$e()*.15,Z=.72,F=new O(Math.cos(W)*Z,15.3+$e()*.1,Math.sin(W)*Z*.9),B=Wr(new O(Math.cos(W)*.9,.7,Math.sin(W)*.9),.35);M.push(Gr(F,B,.45+$e()*.5,.05))}const T=new Wt(jn(M),e);T.name="jack-collar",i.at(T,"spine2",0,0,0);const w=new O(2.95,11.95,-.05),A=new O(...o_),R=A.clone().sub(w).normalize(),v=[];for(let it=0;it<46;it++){const W=$e()*Math.PI*2,Z=.26*Math.sqrt($e()),F=new O(Math.cos(W)*Z,0,Math.sin(W)*Z),B=A.clone().addScaledVector(R,.55).add(F);v.push(Gr(B,Wr(R.clone().addScaledVector(F,1.4),.3),.8+$e()*.9,.055))}r(jn(v),"forearm",e,"hand");const _=[];for(let it=0;it<26;it++){const W=it/26*Math.PI*2+$e()*.2,Z=new O(1.22+Math.cos(W)*.62,2.2+$e()*.12,-.05+Math.sin(W)*.62);_.push(Gr(Z,Wr(new O(Math.cos(W),-1.1,Math.sin(W)),.3),.4+$e()*.45,.05))}r(jn(_),"shin",e,"ankle");const S=[];for(let it=0;it<14;it++){const W=it/14*Math.PI*2,Z=Mh(15.62,W,.1)+.04;S.push(new O(Math.cos(W)*Z,15.62,.1+Math.sin(W)*Z))}i.at(new Wt(Ws(new Qn(S,!0),3.6,.09,!0),n),"neck",0,0,0);const y=10.72,D=[];for(let it=0;it<24;it++){const W=it/24*Math.PI*2,Z=Mh(y,W,.05)+.06;D.push(new O(Math.cos(W)*Z,y,.05+Math.sin(W)*Z))}const I=new Qn(D,!0),U=.55,H=ro(U,y)+.1,$=new Qn([new O(U,y-.05,H),new O(U+.12,y-.6,H+.12),new O(U+.05,y-1.25,H+.08)]),V=new Qn([new O(U,y-.05,H),new O(U-.12,y-.5,H+.14),new O(U-.02,y-1,H+.1)]),tt=[];for(const it of[$,V]){const W=it.getPoint(1);for(let Z=0;Z<7;Z++)tt.push(Gr(W,Wr(new O(0,-1,.1),.35),.22+$e()*.2,.035))}const st=new Ae(.22,10,8).scale(1.2,.9,.8).translate(U,y,H),ct=new Float32Array(st.attributes.position.count*3),ft=new Ht(11571288);for(let it=0;it<ct.length;it+=3)ct[it]=ft.r,ct[it+1]=ft.g,ct[it+2]=ft.b;st.setAttribute("color",new ae(ct,3)),i.at(new Wt(jn([Ws(I,11,.13,!0),Ws($,1.3,.1,!1),Ws(V,1,.1,!1),st]),n),"pelvis",0,0,0),i.at(new Wt(jn(tt),e),"pelvis",0,0,0);const Ct=[],zt=[];for(const it of[14.25,13.45,12.65]){const W=ro(.13,it);Ct.push(new Cn(.12,.12,.07,10).rotateX(Math.PI/2).translate(.13,it,W+.02))}for(let it=0;it<5;it++)zt.push(Gr(new O(.13,13.05,ro(.13,13.05)-.05),Wr(new O(.4,.3,1),.4),.35+$e()*.25,.035));i.at(new Wt(jn(Ct),i.std({color:2759698,roughness:.5})),"spine2",0,0,0),i.at(new Wt(jn(zt),e),"spine2",0,0,0)}const y_=(i,t,e,n)=>i.name.startsWith("thigh")?n>-1.6&&e<i.a[1]+.8&&Math.abs(Math.abs(t)-Math.abs(i.a[0]))<(e<i.a[1]+.3?1.3:.9):i.name.startsWith("arm")||i.name.startsWith("forearm")?Math.abs(t)>(e<12?2.2:e<14.1?1.88:2.1):!0,bh=new WeakMap,E_={id:"pumpkin",name:"Jack",blurb:"A scarecrow with a candle-lit pumpkin head",segs:s_,body:{sdf:Ac,region:Du,box:a_,palette:[9181716,2307418,3810326,11044954,1708556],surface:"soft",weights:"sharp",capture:y_},dress:S_,fit:{size:1.08,limb:.6},res:76,tick(i,t){let e=bh.get(i);if(!e){const a=[],o=[];i.traverse(c=>{c.name==="jack-pumpkin"&&a.push(c.material),c.name==="jack-flamecore"&&o.push(c.material)}),e={shell:a,core:o,flame:i.getObjectByName("jack-flame")??null},bh.set(i,e)}const n=.5*Math.sin(t*1.7)+.3*Math.sin(t*7.9+1.3)+.22*Math.sin(t*13.3+.4)+.15*Math.sin(t*23.7+2.2),r=Math.max(0,Math.sin(t*.83+.5)-.92)*6,s=Math.max(.35,1+.36*n-r);for(const a of e.shell)a.emissiveIntensity=s;for(const a of e.core)a.emissiveIntensity=2.4*s;e.flame&&(e.flame.scale.set(1-.08*n,s*(1+.12*Math.sin(t*17)),1-.08*n),e.flame.rotation.z=.12*Math.sin(t*5.3))}},Uu=[{name:"pelvis",a:[0,9.6,0],b:[0,10.6,0],parent:null},{name:"spine1",a:[0,10.6,0],b:[0,12.4,.1],parent:"pelvis"},{name:"spine2",a:[0,12.4,.1],b:[0,15,.1],parent:"spine1"},{name:"neck",a:[0,15,.1],b:[0,15.9,.15],parent:"spine2",reach:.8},{name:"head",a:[0,15.9,.15],b:[0,18.4,.3],parent:"neck"},{name:"jaw",a:[0,16.4,.9],b:[0,16.4,1.2],parent:"head",reach:0},{name:"tail1",a:[0,14.8,-1.2],b:[0,12.6,-1.4],parent:"spine2",reach:1},{name:"tail2",a:[0,12.6,-1.4],b:[0,10.4,-1.6],parent:"tail1",reach:1},{name:"tail3",a:[0,10.4,-1.6],b:[0,8.2,-1.8],parent:"tail2",reach:1},{name:"tail4",a:[0,8.2,-1.8],b:[0,6.2,-2],parent:"tail3",reach:1},{name:"thighL",a:[1.1,9.6,0],b:[1.2,5.3,.2],parent:"pelvis"},{name:"shinL",a:[1.2,5.3,.2],b:[1.2,1.1,-.1],parent:"thighL"},{name:"footL",a:[1.2,1.1,-.1],b:[1.2,.35,1.4],parent:"shinL"},{name:"thighR",a:[-1.1,9.6,0],b:[-1.2,5.3,.2],parent:"pelvis"},{name:"shinR",a:[-1.2,5.3,.2],b:[-1.2,1.1,-.1],parent:"thighR"},{name:"footR",a:[-1.2,1.1,-.1],b:[-1.2,.35,1.4],parent:"shinR"},{name:"armL",a:[2.4,14.6,0],b:[2.72,11.9,-.05],parent:"spine2"},{name:"forearmL",a:[2.72,11.9,-.05],b:[2.85,9.45,.4],parent:"armL"},{name:"armR",a:[-2.4,14.6,0],b:[-2.72,11.9,-.05],parent:"spine2"},{name:"forearmR",a:[-2.72,11.9,-.05],b:[-2.85,9.45,.4],parent:"armR"}],Nu={min:[-4.2,-.4,-2.8],max:[4.2,20.4,2.6]};function w_(i,t,e,n){const r=Math.abs(i),s=1-.08*n;let a=Ut(i,t,e,0,13.35,.1,1.8*s,1.95,1.05*s);return a=et(a,Ut(r,t,e,.85*s,13.75,.75,.95*s,.68,.5),.45),a=et(a,Ut(i,t,e,0,13.75,-.35,1.95*s,1.3,.62),.4),a=et(a,St(r,t,e,0,15.35,-.2,1.85*s,14.95,-.1,.5,.36),.5),a=et(a,Ut(i,t,e,0,11.6,.12,1.35*s,1.45,.92*s),.6),a=et(a,Ut(i,t,e,0,10,0,1.68*s,1,1.02*s),.6),a=et(a,Ut(r,t,e,.72,9.55,-.5,.82*s,.85,.62),.4),a=Math.max(a,-St(i,t,e,0,14.6,-1.12,0,10.6,-.98,.16,.14)),a=et(a,St(i,t,e,0,14.9,-.05,0,16.3,.12,.6,.52),.4),a=et(a,Ut(i,t,e,0,17.3,.1,.95,1.12,1.08),.3),a=et(a,Ut(i,t,e,0,16.55,.4,.74,.74,.82),.35),a=et(a,Ut(r,t,e,2.3*s,14.5,0,.7*s,.92,.78),.4),a=et(a,St(r,t,e,2.4,14.4,0,2.72,11.95,-.05,.56*s,.42*s),.3),a=et(a,Ut(r,t,e,2.56,13.15,.12,.5*s,.95,.5*s),.3),a=et(a,St(r,t,e,2.72,11.9,-.05,2.85,9.6,.38,.46*s,.3*s),.25),a=et(a,Ut(r,t,e,2.76,11.2,.05,.48*s,.8,.48*s),.3),a=et(a,Ut(r,t,e,2.87,9,.48,.24,.52,.42),.2),a=et(a,St(r,t,e,2.8,9.35,.75,2.72,8.85,.95,.15,.12),.12),a=et(a,St(r,t,e,1.02,9.6,0,1.15,5.45,.2,.9*s,.56*s),.45),a=et(a,Ut(r,t,e,1.12,7.7,.28,.8*s,1.6,.72*s),.4),a=et(a,Ut(r,t,e,.8,8.3,0,.55*s,1.3,.6),.4),a=et(a,ye(r,t,e,1.17,5.3,.32,.52*s),.3),a=et(a,St(r,t,e,1.18,5.25,.15,1.2,1.15,-.1,.5*s,.3*s),.3),a=et(a,Ut(r,t,e,1.2,3.95,-.28,.56*s,1.3,.6*s),.35),a=et(a,Math.max(Ut(r,t,e,1.2,.5,.55,.46,.5,1.25),-t),.25),a}function Fu(i,t,e,n,r=0){const s=Math.abs(i);let a=w_(i,t,e,n==="valkyrie"?1:0);if(n==="valkyrie"){a=et(a,Ut(i,t,e,0,13.6,.55,2.2,1.5,1),.4);{const o=Math.max(0,Math.min(1,(10.8-t)/3.4)),c=1.6+.75*o,l=Math.hypot(i/1.05,e/.8)-c;a=Math.min(a,Math.max(l,Math.abs(t-9.1)-1.7,-(Math.hypot(i/1.05,e/.8)-c+.32)))}a=et(a,ye(s,t,e,2.38,14.9,0,1),.3),a=et(a,St(s,t,e,1.2,4.6,.35,1.2,1.4,.2,.75,.62),.2),a=et(a,ye(i,t,e,0,17,.25,1.32),.3),a=et(a,Ut(i,t,e,0,17.4,.2,1.42,1,1.42),.2);for(let o=0;o<3;o++)a=et(a,St(s,t,e,1.3,17.6+o*.25,.2-o*.35,2.3+o*.25,19+o*.35,-1-o*.5,.32-o*.06,.1),.2);a=et(a,St(i,t,e,0,16.6,-1.1,0,12.6,-1.5,.42,.26),.3);{const o=2.3+(14.8-t)*.12;a=Math.min(a,Math.max(Math.abs(i)-o,Math.abs(e+1.75+(14.8-t)*.03)-.2,t-14.8,4.6-t)-.08)}}else a=et(a,Ut(i,t,e,0,17.3,.12,1.08,1.24,1.18),.25),a=et(a,Ut(i,t,e,0,16.5,.45,.82,.72,.86),.25),a=et(a,St(i,t,e,0,18.42,-.7,0,18.5,.85,.16,.12),.2),a=et(a,Ut(i,t,e,0,10.55,.05,1.55,.38,1.1),.15),a=et(a,Ut(i,t,e,0,10.55,1.05,.55,.42,.22),.1),a=et(a,St(s,t,e,2.82,10.25,.3,2.86,9.5,.42,.4,.38),.15),a=et(a,St(s,t,e,1.2,3.2,-.05,1.2,1,-.08,.52,.48),.2);return a-r}function Ou(i,t,e,n){const r=Math.abs(i);if(n==="valkyrie")return t>17.6&&r>1.2||e<-.9&&t>12.4&&t<16.8&&r<.6?2:t>15.9&&t<17.2&&e>.6&&r<1?3:t>16.9&&t<17.3&&e>.6||Math.abs(t-10.85)<.25||t<7.6&&t>7.3||t>13.5&&t<14&&e>.8||r>2&&Math.abs(t-14.9)<.35?1:0;if(t>16.75&&t<17.5&&e>.9&&r<.95)return 2;if(Math.abs(t-10.6)<.45&&e>-1.5)return 3;if(t<3.2||t<10.4&&r>2.3&&t>8.2)return 1;if(e>.7&&r<1.7){const s=t-12.6-r*.55;if(s>0&&s<.35||s>.75&&s<1.1)return 1}return 0}const T_=[{name:"pelvis",a:[0,9.4,-.6],b:[0,10.4,0],parent:null},{name:"spine1",a:[0,10.4,0],b:[0,12.6,.8],parent:"pelvis"},{name:"spine2",a:[0,12.6,.8],b:[0,14.8,1.9],parent:"spine1"},{name:"neck",a:[0,14.8,1.9],b:[0,16,3],parent:"spine2",reach:1.6},{name:"head",a:[0,16,3],b:[0,16.6,5.8],parent:"neck"},{name:"jaw",a:[0,15.5,3.9],b:[0,15.3,6.6],parent:"head",reach:.8},{name:"tail1",a:[0,9.2,-1.6],b:[0,8.2,-3.6],parent:"pelvis",reach:1.8},{name:"tail2",a:[0,8.2,-3.6],b:[0,6.8,-5.2],parent:"tail1",reach:1.8},{name:"tail3",a:[0,6.8,-5.2],b:[0,5.3,-6.4],parent:"tail2",reach:1.6},{name:"tail4",a:[0,5.3,-6.4],b:[0,4,-7.2],parent:"tail3",reach:1.4},{name:"thighL",a:[1.6,9.2,-.3],b:[1.9,6,1.3],parent:"pelvis"},{name:"shinL",a:[1.9,6,1.3],b:[1.9,2.8,-.9],parent:"thighL"},{name:"footL",a:[1.9,2.8,-.9],b:[1.9,.4,1],parent:"shinL"},{name:"thighR",a:[-1.6,9.2,-.3],b:[-1.9,6,1.3],parent:"pelvis"},{name:"shinR",a:[-1.9,6,1.3],b:[-1.9,2.8,-.9],parent:"thighR"},{name:"footR",a:[-1.9,2.8,-.9],b:[-1.9,.4,1],parent:"shinR"},{name:"armL",a:[2.7,14.3,1.6],b:[3.3,11.2,2],parent:"spine2"},{name:"forearmL",a:[3.3,11.2,2],b:[3.2,8.2,3.2],parent:"armL"},{name:"armR",a:[-2.7,14.3,1.6],b:[-3.3,11.2,2],parent:"spine2"},{name:"forearmR",a:[-3.3,11.2,2],b:[-3.2,8.2,3.2],parent:"armR"}],A_={min:[-5,-.5,-8.6],max:[5,20.4,8.6]},ni=[.62,17.05,4.75],Sh=[0,16.35,7.35];function R_(i,t,e,n=0){const r=Math.abs(i);let s=Ut(i,t,e,0,13.4,1.4,2.6,2.5,2.1);s=et(s,Ut(i,t,e,0,11.2,.4,1.7,1.6,1.4),.9),s=et(s,Ut(i,t,e,0,9.8,-.4,2,1.2,1.5),.7),s=et(s,Ut(i,t,e,0,15.1,1.6,2.3,1.5,2),.8),s=et(s,ye(r,t,e,2.5,14.2,1.5,1.05),.7);let a=Ut(i,t,e,0,16.9,3.6,1.35,1.25,1.55);a=et(a,St(i,t,e,0,16.7,4.6,0,16.3,7.1,.82,.45),.5),a=et(a,St(i,t,e,0,15.8,4.4,0,15.75,6.7,.55,.32),.35),a=et(a,Ut(r,t,e,1.15,16.5,3.6,.55,.75,.9),.4),a=et(a,St(r,t,e,.75,17.8,3.1,1.05,19.4,2.7,.5,.06),.3),a=Math.max(a,-ye(r,t,e,ni[0],ni[1],ni[2]+.12,.3)),s=et(s,a,.6),s=et(s,St(r,t,e,2.7,14.3,1.6,3.3,11.2,2,.9,.72),.5),s=et(s,St(r,t,e,3.3,11.2,2,3.2,8.4,3.1,.78,.55),.35),s=et(s,Ut(r,t,e,3.2,7.9,3.35,.55,.75,.55),.3),s=et(s,St(r,t,e,1.6,9.2,-.3,1.9,6,1.3,1.25,.85),.6),s=et(s,St(r,t,e,1.9,6,1.3,1.9,2.8,-.9,.75,.48),.4),s=et(s,St(r,t,e,1.9,2.8,-.9,1.9,.5,.9,.5,.42),.3);const o=[[0,9.2,-1.6,.6],[0,8.2,-3.6,1],[0,6.8,-5.2,1.15],[0,5.3,-6.4,.9],[0,4,-7.2,.35]];for(let c=0;c+1<o.length;c++){const l=o[c],h=o[c+1];s=et(s,St(i,t,e,l[0],l[1],l[2],h[0],h[1],h[2],l[3],h[3]),.5)}s-=n;for(const c of[-1.5,-.5,.5,1.5])s=et(s,St(r,t,e,3.2+c*.17,7.4,3.5,3.2+c*.22,6.5,3.85,.17,.03),.1);for(const c of[-1,0,1])s=et(s,St(r,t,e,1.9+c*.28,.4,1.2,1.9+c*.34,.1,1.85,.2,.03),.1);return s}function Bu(i,t,e){const n=Math.abs(i);return Math.hypot(i,t-Sh[1],e-Sh[2])<.45||t<7.6&&t>6.2&&e>3.4&&n>2.6||t<.5&&e>1.2?3:t>17.4&&n>.6&&e<3.2||e<-6.3?2:t>15.4&&t<16.4&&e>4.4||t>14.6&&t<15.8&&e>2.8&&n<1.2||e>2.2&&t>10.2&&t<15&&n<1.8?1:t>12.4&&e<.8&&n<1.9&&t>12.4+.5*n?2:0}function C_(i,t,e){const n=Math.abs(i);return Bu(i,t,e)===3||Math.hypot(n-ni[0],t-ni[1],e-ni[2])<.65?0:e>4.6&&t>15.2?.35:t>17.6?.4:t>14&&t<16.4&&e<3.4||e<-1.4&&t<9.6?1.4:t<3?.45:1}const L_=[{name:"pelvis",a:[0,7.6,-.4],b:[0,8.8,0],parent:null},{name:"spine1",a:[0,8.8,0],b:[0,10.8,.3],parent:"pelvis"},{name:"spine2",a:[0,10.8,.3],b:[0,12.6,.6],parent:"spine1"},{name:"neck",a:[0,12.6,.6],b:[0,15.6,1.3],parent:"spine2",reach:1.9},{name:"head",a:[0,15.6,1.3],b:[0,17.6,2.4],parent:"neck"},{name:"jaw",a:[0,15.9,2.6],b:[0,15.7,4.4],parent:"head",reach:.7},{name:"tail1",a:[0,7.4,-2.6],b:[0,6.8,-3.6],parent:"pelvis",reach:1.4},{name:"tail2",a:[0,6.8,-3.6],b:[0,6.2,-4.5],parent:"tail1",reach:1.4},{name:"tail3",a:[0,6.2,-4.5],b:[0,5.7,-5.2],parent:"tail2",reach:1.2},{name:"tail4",a:[0,5.7,-5.2],b:[0,5.3,-5.7],parent:"tail3",reach:1},{name:"thighL",a:[1.4,7.4,0],b:[1.5,4.6,.3],parent:"pelvis"},{name:"shinL",a:[1.5,4.6,.3],b:[1.5,.9,-.2],parent:"thighL"},{name:"footL",a:[1.5,.9,-.2],b:[1.5,.3,1.8],parent:"shinL"},{name:"thighR",a:[-1.4,7.4,0],b:[-1.5,4.6,.3],parent:"pelvis"},{name:"shinR",a:[-1.5,4.6,.3],b:[-1.5,.9,-.2],parent:"thighR"},{name:"footR",a:[-1.5,.9,-.2],b:[-1.5,.3,1.8],parent:"shinR"},{name:"armL",a:[2.7,11.6,.2],b:[3.3,9.2,-.1],parent:"spine2"},{name:"forearmL",a:[3.3,9.2,-.1],b:[3.2,7,.3],parent:"armL"},{name:"armR",a:[-2.7,11.6,.2],b:[-3.3,9.2,-.1],parent:"spine2"},{name:"forearmR",a:[-3.3,9.2,-.1],b:[-3.2,7,.3],parent:"armR"}],P_={min:[-5,-.4,-7.2],max:[5,21.4,6.6]},ii=[.72,17.25,2.75];function D_(i,t,e,n=0){const r=Math.abs(i);let s=Ut(i,t,e,0,9.2,-.2,3.3,3.5,3);s=et(s,Ut(i,t,e,0,11.4,.5,2.5,2.2,2.3),1),s=et(s,St(i,t,e,0,12.2,.5,0,15.8,1.4,1.25,.95),.8);let a=ye(i,t,e,0,16.9,1.8,1.55);a=et(a,St(i,t,e,0,16.55,2.9,0,16.1,5,.72,.18),.3),a=et(a,St(i,t,e,0,15.85,2.8,0,15.75,4.4,.5,.14),.25);for(const[o,c]of[[0,1],[.6,.82],[-.6,.82]])a=et(a,St(i,t,e,o*.5,18.1,1.6,o*1.3,18.1+2.7*c,1-.7*c,.34,.12),.3);a=Math.max(a,-ye(r,t,e,ii[0],ii[1],ii[2],.5)),s=et(s,a,.5),s=et(s,Ut(r,t,e,3,9.8,0,.75,2.6,1.7),.7);for(const o of[-1,0,1])s=et(s,St(r,t,e,3.2,8.4,o*.6,3.25,6.6+Math.abs(o)*.4,o*.75+.2,.42,.14),.3);for(const o of[-1,0,1])s=et(s,St(i,t,e,o*.3,7.6,-2.6,o*1.1,7+(1-Math.abs(o))*.5,-5.6,.5,.2),.4);s=et(s,St(r,t,e,1.4,7.4,0,1.5,4.8,.3,1,.55),.5),s=et(s,St(r,t,e,1.5,4.8,.3,1.5,1,-.2,.42,.36),.25),s-=n;for(const o of[-1,0,1])s=et(s,St(r,t,e,1.5,.5,.1,1.5+o*.85,.3,2-Math.abs(o)*.3,.34,.16),.2);return s=et(s,St(r,t,e,1.5,.5,-.2,1.5,.3,-1.1,.3,.14),.15),s}function ku(i,t,e){const n=Math.abs(i);return t>15.6&&t<17.1&&e>2.6&&n<.85||t<5&&n>.9&&n<2.6||t<1?3:t>18.4||e<-4.6?2:e>1.2&&t>9.4&&t<13.4&&n<1.8||e>2.2&&t>16.2&&t<18.2&&n<1.25?1:0}function I_(i,t,e){const n=Math.abs(i),r=ku(i,t,e);return r===3||Math.hypot(n-ii[0],t-ii[1],e-ii[2])<.9?0:r===2?.6:t>16?.45:t>14.6&&e>1.6?.3:t>12.2?1.25:e<-2.4?1.4:1}const Cc=[{name:"pelvis",a:[0,9.2,0],b:[0,10.4,0],parent:null},{name:"spine1",a:[0,10.4,0],b:[0,12.4,.1],parent:"pelvis"},{name:"spine2",a:[0,12.4,.1],b:[0,15.4,.2],parent:"spine1"},{name:"neck",a:[0,15.4,.2],b:[0,16.2,.3],parent:"spine2",reach:.9},{name:"head",a:[0,16.2,.3],b:[0,18.4,.6],parent:"neck"},{name:"jaw",a:[0,16.4,1.2],b:[0,16.4,1.6],parent:"head",reach:0},{name:"tail1",a:[0,9.2,-.5],b:[0,9,-1],parent:"pelvis",reach:0},{name:"tail2",a:[0,9,-1],b:[0,8.8,-1.5],parent:"tail1",reach:0},{name:"tail3",a:[0,8.8,-1.5],b:[0,8.6,-2],parent:"tail2",reach:0},{name:"tail4",a:[0,8.6,-2],b:[0,8.4,-2.5],parent:"tail3",reach:0},{name:"thighL",a:[2.1,9.2,0],b:[2.3,5.2,.3],parent:"pelvis"},{name:"shinL",a:[2.3,5.2,.3],b:[2.3,1.2,-.1],parent:"thighL"},{name:"footL",a:[2.3,1.2,-.1],b:[2.3,.4,1.8],parent:"shinL"},{name:"thighR",a:[-2.1,9.2,0],b:[-2.3,5.2,.3],parent:"pelvis"},{name:"shinR",a:[-2.3,5.2,.3],b:[-2.3,1.2,-.1],parent:"thighR"},{name:"footR",a:[-2.3,1.2,-.1],b:[-2.3,.4,1.8],parent:"shinR"},{name:"armL",a:[4.1,14.7,.2],b:[4.5,11.6,.4],parent:"spine2"},{name:"forearmL",a:[4.5,11.6,.4],b:[4.5,8.4,1],parent:"armL"},{name:"armR",a:[-4.1,14.7,.2],b:[-4.5,11.6,.4],parent:"spine2"},{name:"forearmR",a:[-4.5,11.6,.4],b:[-4.5,8.4,1],parent:"armR"}],U_={min:[-6.4,-.4,-4.4],max:[6.4,19.8,4]};function we(i,t,e,n,r,s,a,o,c,l){const h=Math.abs(i-n)-a+l,u=Math.abs(t-r)-o+l,d=Math.abs(e-s)-c+l;return Math.hypot(Math.max(h,0),Math.max(u,0),Math.max(d,0))+Math.min(Math.max(h,u,d),0)-l}function yh(i,t,e,n,r,s,a,o,c){const l=Math.abs(i-n)-a+c,h=Math.hypot(t-r,e-s)-o+c;return Math.hypot(Math.max(l,0),Math.max(h,0))+Math.min(Math.max(l,h),0)-c}function Hu(i,t,e,n,r,s,a,o){let c=i-n,l=t-r,h=e-s;const u=Math.cos(a),d=Math.sin(a);[c,h]=[c*u-h*d,c*d+h*u];const f=Math.cos(o),m=Math.sin(o);return[c,l]=[c*f+l*m,-c*m+l*f],[c,l,h]}const We={hx:1.5,hy:14.6,hz:-2.15,yaw:.4,roll:.62,w:1.1,h:.85,t:.12};function N_(i,t,e){const[n,r,s]=Hu(i,t,e,We.hx,We.hy,We.hz,We.yaw,We.roll);return we(n,r,s,We.w,We.h,0,We.w,We.h,We.t,.1)}function F_(i,t,e,n=0){const r=Math.abs(i);let s=1e9;{const a=we(i,t,e,0,13.75,.25,2.9,1.75,1.75,.3),o=(e-(2-Math.max(0,t-13.4)*.6))*.86;s=Math.max(a,o)}return s=et(s,we(i,t,e,0,12.2,.3,2.3,.6,1.5,.3),.3),s=Math.min(s,we(i,t,e,0,12.55,1.95,2.5,.22,.28,.1)),s=Math.min(s,we(r,t,e,2.2,13.1,1.92,.42,.26,.15,.08)),s=Math.min(s,we(i,t,e,0,11.1,.75,1.15,.9,.55,.25)),s=et(s,we(i,t,e,0,11,0,1.2,1,1.05,.3),.2),s=et(s,we(i,t,e,0,9.75,0,2.2,.75,1.4,.3),.25),s=Math.min(s,we(i,t,e,0,9.45,1.35,.7,.7,.25,.15)),s=Math.min(s,we(i,t,e,0,13.5,-1.85,2.2,1.6,.55,.25)),s=Math.min(s,N_(r,t,e)),s=Math.min(s,St(i,t,e,0,15.3,.25,0,16.3,.35,.6,.55)),s=Math.min(s,we(i,t,e,0,17.25,.45,.82,.92,.9,.35)),s=Math.min(s,we(i,t,e,0,16.55,.95,.55,.38,.42,.18)),s=Math.min(s,we(i,t,e,0,18.2,.35,.12,.35,.75,.08)),s=Math.min(s,we(r,t,e,.95,17.55,.25,.12,.62,.3,.08)),s=Math.min(s,we(r,t,e,4.05,15.05,.2,1.15,.8,1.35,.3)),s=Math.min(s,yh(r,t,e,5.4,14.7,.2,.32,.92,.12)),s=Math.min(s,ye(r,t,e,4.1,14.4,.2,.75)),s=Math.min(s,St(r,t,e,4.1,14.2,.2,4.5,11.8,.4,.62,.58)),s=Math.min(s,ye(r,t,e,4.5,11.6,.4,.72)),s=Math.min(s,we(r,t,e,4.55,10,.6,.9,1.5,1,.3)),s=Math.min(s,we(r,t,e,4.55,8.05,1,.75,.75,.8,.28)),s=Math.min(s,St(r,t,e,2.1,9.1,0,2.3,5.6,.25,1.05,.95)),s=Math.min(s,we(r,t,e,2.3,5.25,.85,.85,.75,.55,.25)),s=Math.min(s,we(r,t,e,2.3,3,.05,1.25,2.15,1.35,.35)),s=Math.min(s,yh(r,t,e,3.75,2.6,-.35,.3,.9,.12)),s=Math.min(s,we(r,t,e,2.3,.5,.65,1.15,.5,2,.2)),s-n}function O_(i,t,e){const n=Math.abs(i);if(n>5&&Math.hypot(t-14.7,e-.2)<1)return Math.hypot(t-14.7,e-.2)<.42?1:5;if(n>3.38&&Math.hypot(t-2.6,e+.35)<.98)return Math.hypot(t-2.6,e+.35)<.4?1:5;if(t>16.95&&t<17.3&&e>1.2&&n>.12&&n<.62||t>12.85&&t<13.35&&e>1.95&&n>1.85&&n<2.6)return 2;if(t>13.55&&t<15.35&&n<2.55&&n>.18&&e>1.75-Math.max(0,t-13.4)*.6)return 4;if(t>16.15&&t<16.95&&e>1.25&&n<.6)return 6;if(e<-1.9&&t>13.8){const[r,s,a]=Hu(n,t,e,We.hx,We.hy,We.hz,We.yaw,We.roll);if(Math.abs(a)<.3&&r>.25&&r<1.75&&s>.85&&s<1.5)return 4}return t>12.3&&t<12.8&&e>1.65||t>14.25&&t<15.9&&n>2.9&&n<5.15||t>4.5&&t<6&&e>.4&&n>1.4&&n<3.2||t<1.1&&e>1.6||t>17.9&&n<.2?1:Math.hypot(n-4.1,t-14.4,e-.2)<.85&&t<14.25||Math.hypot(n-4.5,t-11.6,e-.4)<.8||t>15.2&&t<16.2&&n<.7||t>10.2&&t<11.6&&e<1.25&&n<1.25?3:0}function de(i,t,e,n,r,s,a,o,c,l){const h=Math.abs(i-n)-a+l,u=Math.abs(t-r)-o+l,d=Math.abs(e-s)-c+l;return Math.hypot(Math.max(h,0),Math.max(u,0),Math.max(d,0))+Math.min(Math.max(h,u,d),0)-l}const B_={min:[-6.8,-.4,-4.6],max:[6.8,20.2,5]};function k_(i,t,e,n=0){const r=Math.abs(i);let s=1e9;s=Math.min(s,de(i,t,e,0,13.6,.2,3.1,2.1,2,.5)),s=Math.min(s,Ut(i,t,e,0,14.3,2.15,1.05,.7,.75)),s=Math.min(s,de(i,t,e,0,12.4,2,.9,1,.4,.3)),s=Math.min(s,de(r,t,e,1.7,15.6,-2.3,.18,2.4,1.1,.12)),s=Math.min(s,de(i,t,e,0,13,-2.3,2.2,1.6,.6,.3)),s=et(s,de(i,t,e,0,11.2,.1,1.9,1.1,1.35,.35),.3),s=et(s,de(i,t,e,0,9.7,0,2.5,.95,1.55,.3),.3),s=Math.min(s,de(i,t,e,0,9.4,1.4,.8,.9,.35,.2)),s=Math.min(s,St(i,t,e,0,15.3,.2,0,16.4,.3,.75,.7)),s=Math.min(s,de(i,t,e,0,17.2,.4,1,1,1.1,.4)),s=Math.min(s,de(i,t,e,0,16.6,1.25,.65,.45,.35,.15)),s=Math.min(s,de(i,t,e,0,18.6,.3,.13,.75,.9,.08)),s=Math.min(s,St(r,t,e,.95,17.7,.4,1.5,18.5,.2,.2,.08)),s=Math.min(s,de(r,t,e,4.2,15.4,.1,1.55,.85,1.7,.35)),s=Math.min(s,St(r,t,e,4.2,15.5,1.6,4.2,15.5,3.9,.3,.26)),s=Math.min(s,ye(r,t,e,4.1,14.4,.2,1)),s=Math.min(s,St(r,t,e,4.1,14.2,.2,4.5,11.8,.4,.85,.8)),s=Math.min(s,ye(r,t,e,4.5,11.6,.4,.9)),s=Math.min(s,de(r,t,e,4.8,10,.6,1,1.7,1.3,.3)),s=Math.min(s,de(r,t,e,5.85,10,.6,.22,1.8,1.35,.18)),s=Math.min(s,de(r,t,e,4.75,7.9,1,.85,.85,.95,.3)),s=Math.min(s,St(r,t,e,2.1,9.1,0,2.3,5.8,.25,1.15,1.1)),s=Math.min(s,de(r,t,e,2.3,5.4,.6,1.15,1.05,1,.3)),s=Math.min(s,de(r,t,e,2.3,3,0,1.2,2,1.25,.3));for(const a of[3.8,1.9])s=Math.min(s,St(r,t,e,3.35,a,-.4,3.75,a,-.4,.75,.75));return s=Math.min(s,de(r,t,e,2.3,.55,.65,1.15,.55,2,.2)),s-n}function H_(i,t,e){const n=Math.abs(i),r=i>0;return t>13.7&&t<15&&e>1.6&&n<1.1||t>16.5&&t<17&&e>1.4&&n<.5&&n>.12?2:n>3.9&&n<4.5&&t>15.1&&t<15.9&&e>1.7||n>5.55&&t>8.2&&t<11.8||n>3.1&&t<4.6&&t>1.1&&e<.4||t>5.5&&t<6.3&&e>1.4&&n>1.3&&n<3.3||Math.hypot(n-4.1,t-14.4,e-.2)<1.05&&t<14.6||Math.hypot(n-4.5,t-11.6,e-.4)<.95&&t>11.3||t>10.7&&t<11&&n<2||t>8.6&&t<8.9&&n>1&&n<3.6?3:n>3.55&&t>6.4&&t<16.4||n>2.9&&t>11.4&&t<16.4?r?4:5:t<8.8&&n>.95?r?6:7:t>15.2||n>1.4&&n<2&&e<-1.2||t<11.3||e<-1.7?1:0}const z_={min:[-7.6,-.4,-6.6],max:[7.6,21,4.4]};function V_(i,t,e,n,r,s,a,o,c,l,h,u){const d=(r+o)/2;return St(i,d+(t-d)/u,e,n,r,s,a,o,c,l,h)*u}function G_(i,t,e,n,r,s,a,o,c,l,h,u){const d=(n+a)/2;return St(d+(i-d)/u,t,e,n,r,s,a,o,c,l,h)*u}function W_(i,t,e,n=0){const r=Math.abs(i);let s=1e9;return s=Math.min(s,de(i,t,e,0,13.7,.1,2.5,1.9,1.7,.6)),s=Math.min(s,Ut(i,t,e,0,14.4,1.75,.95,.75,.85)),s=et(s,de(i,t,e,0,11.4,0,1.5,1.2,1.15,.4),.4),s=et(s,de(i,t,e,0,9.8,0,2.2,.85,1.35,.35),.3),s=Math.min(s,St(i,t,e,0,15.2,-2,0,10.8,-2.3,.75,.2)),s=Math.min(s,V_(r,t,e,1.4,13.6,-2.2,6.8,12.4,-5.6,1.9,.4,.17)),s=Math.min(s,G_(r,t,e,1.5,14.2,-2.4,1.65,17.8,-3.7,.95,.22,.2)),s=Math.min(s,de(r,t,e,3.4,15.2,.2,1.15,.9,1.5,.3)),s=Math.min(s,de(r,t,e,3.4,16.4,-.1,.85,.45,1.1,.2)),s=Math.min(s,St(i,t,e,0,15.3,.1,0,16.3,.2,.6,.55)),s=Math.min(s,Ut(i,t,e,0,17.1,.35,.85,1,1.15)),s=Math.min(s,St(r,t,e,.45,17.8,.6,1,19.4,-.9,.16,.05)),s=Math.min(s,ye(r,t,e,4.1,14.5,.2,.8)),s=Math.min(s,St(r,t,e,4.1,14.3,.2,4.5,11.8,.4,.65,.6)),s=Math.min(s,ye(r,t,e,4.5,11.6,.4,.7)),s=Math.min(s,de(r,t,e,4.5,10,.6,.8,1.6,.85,.3)),s=Math.min(s,de(r,t,e,4.5,8,.95,.6,.65,.6,.25)),s=Math.min(s,St(r,t,e,2.1,9.1,0,2.3,5.6,.25,1.1,1)),s=Math.min(s,de(r,t,e,2.3,5.2,.7,.75,.65,.5,.25)),s=Math.min(s,St(r,t,e,2.3,4.8,-.1,2.3,1.7,-.3,1.25,1.15)),s=Math.min(s,St(r,t,e,2.3,1.6,-.6,2.3,1.1,-1.4,1,1.1)),s=Math.min(s,de(r,t,e,2.3,.45,.9,.75,.45,1.5,.2)),s-n}function X_(i,t,e){const n=Math.abs(i);return t>13.8&&t<15.1&&e>1.2&&n<1||t>16.8&&t<17.4&&e>1&&n<.75?2:t<1.9&&e<-.9||Math.hypot(n-4.1,t-14.5,e-.2)<.85&&t<14.5||Math.hypot(n-4.5,t-11.6,e-.4)<.75||t>10.4&&t<10.8&&n<1.6?3:n>2.5&&n<4.3&&t>16&&t<16.9||e<-1.9&&n>1.5&&n<7&&Math.abs(t-(13.6-(n-1.4)*.22))<.3||t>12.6&&t<13&&n<2.3&&e>.8?4:n>3.6&&t<13.8&&t>7.2||t<5&&n>1?1:0}function ji(i){const t=!!i.mech,e=!!i.cape,n=i.tail??null;return(r,s,a,o)=>r.name.startsWith("thigh")?o>-1.6&&a<r.a[1]+(t?1.4:.8)&&Math.abs(Math.abs(s)-Math.abs(r.a[0]))<(a<r.a[1]+.3?t?1.45:1.3:t?1.4:.9):r.name.startsWith("tail")?n!==null?o<n:e&&o<-1.55:!t&&(r.name.startsWith("arm")||r.name.startsWith("forearm"))?Math.abs(s)>2&&o>-1.2:t&&r.name.startsWith("arm")?o>-1.5:!0}const zu=(i,t,e=2.2)=>i.std({color:t,emissive:t,emissiveIntensity:e,roughness:.3}),q_={id:"crimson",name:"Crimson",blurb:"A suited hero, visor and all",segs:Uu,body:{sdf:(i,t,e)=>Fu(i,t,e,"crimson"),region:(i,t,e)=>Ou(i,t,e,"crimson"),box:Nu,palette:[13114922,16053492,1052692,12633292],surface:"suit",capture:ji({})},dress(i){const t=i.std({color:526348,roughness:.08,metalness:.6});for(const e of[-1,1]){const n=new Wt(new Xe(1,.38,.4),t);n.rotation.set(0,e*.42,e*-.32),i.at(n,"head",e*.46,17.12,1.12)}},fit:{size:1.08,limb:.7}},Y_={id:"valkyrie",name:"Valkyrie",blurb:"Winged helm, spear and shield",segs:Uu,body:{sdf:(i,t,e)=>Fu(i,t,e,"valkyrie"),region:(i,t,e)=>Ou(i,t,e,"valkyrie"),box:Nu,palette:[7028640,14725184,15657716,15251606],surface:"suit",capture:ji({cape:!0})},dress(i){const t=i.std({color:1708064,roughness:.2});for(const h of[-1,1]){const u=new Wt(new Ae(.17,12,8),t);u.scale.set(1,1.3,.6),i.at(u,"head",h*.42,16.8,1.5)}const e=i.std({color:5916210,roughness:.6}),n=i.std({color:14211296,roughness:.25,metalness:.85}),r=new an;r.add(new Wt(new Cn(.16,.16,17,10),e));const s=new Wt(new $i(.42,2.4,10),n);s.position.y=9.6,r.add(s),i.at(r,"forearmR",-2.9,11,.85);const a=new an,o=new Wt(new Cn(2.1,2.1,.3,28),i.std({color:7028640,roughness:.4,metalness:.3}));o.rotation.z=Math.PI/2,a.add(o);const c=new Wt(new Rr(2.1,.16,8,32),i.std({color:14725184,roughness:.3,metalness:.7}));c.rotation.y=Math.PI/2,a.add(c);const l=new Wt(new Ae(.55,14,10),n);l.position.x=.2,a.add(l),i.at(a,"forearmL",3.38,10.4,.45)},fit:{size:1.08,limb:.7},idle:{tail:.05}},$_=T_.map(i=>/^(arm|forearm)/.test(i.name)?{...i,reach:1.95}:i),j_={id:"howler",name:"Howler",blurb:"A wolf man with amber eyes",segs:$_,body:{sdf:(i,t,e)=>R_(i,t,e),region:Bu,box:A_,palette:[7827562,12103584,3420204,1183760],capture:ji({tail:-1.5}),fur:{length:.8,density:7,tip:.22},furLen:C_},dress(i){const t=zu(i,16756768,1.8);for(const e of[-1,1]){const n=new Wt(new Ae(.24,12,8),t);n.scale.set(1.2,.8,.8),i.at(n,"head",e*ni[0],ni[1],ni[2])}},fit:{size:1.1,limb:.6},idle:{tail:.25}},Z_={id:"plume",name:"Plume",blurb:"A big, friendly, feathered bird",segs:L_,body:{sdf:(i,t,e)=>D_(i,t,e),region:ku,box:P_,palette:[16036872,16770976,15224972,15762468],surface:"soft",capture:ji({tail:-2.4}),fur:{length:1.5,density:1.6,tip:.3,feather:!0},furLen:I_},dress(i){const t=i.std({color:16316660,roughness:.2}),e=i.std({color:657936,roughness:.1});for(const n of[-1,1]){const r=new Wt(new Ae(.52,18,12),t),s=new Wt(new Ae(.24,12,8),e);s.position.set(-n*.1,.02,.36),s.scale.set(1,1.2,.6),r.add(s),i.at(r,"head",n*ii[0],ii[1],ii[2])}},fit:{size:1.12,limb:.5},idle:{tail:.15}};function Lc(i,t){return e=>{const n=zu(e,t);if(i==="bastion"){for(const a of[-1,1]){const o=new Wt(new Xe(.42,.2,.1),n);o.rotation.z=a*-.12,e.at(o,"head",a*.36,17.12,1.36);const c=new Wt(new Xe(.62,.36,.1),n);e.at(c,"spine2",a*2.2,13.1,2.08)}return}const r=i==="unison",s=new Wt(new Ae(1,20,12),n);if(s.scale.set(r?.95:.85,r?.55:.6,r?.45:.35),e.at(s,"spine2",0,14.35,r?2.55:1.95),r)for(const a of[-1,1]){const o=new Wt(new Xe(.42,.16,.1),n);o.rotation.z=a*.25,e.at(o,"head",a*.32,16.85,1.62)}else e.at(new Wt(new Xe(1.3,.3,.12),n),"head",0,17.1,1.42);if(r){const a=e.std({color:14673130,roughness:.2,metalness:.9}),o=e.std({color:14198832,roughness:.3,metalness:.8}),c=new an,l=new Wt(new Xe(.22,8,.9),a);l.position.y=-4.5,c.add(l);const h=new Wt(new $i(.64,1.4,4),a);h.rotation.z=Math.PI,h.position.y=-9.2,h.scale.set(.35,1,1),c.add(h),c.rotation.x=-.95;const u=new Wt(new Xe(.5,.4,3),o);u.position.y=-.3,c.add(u);const d=new Wt(new Cn(.22,.22,1.6,8),o);d.position.y=.6,c.add(d),e.at(c,"forearmR",-4.75,8,2.1)}}}const K_={id:"bastion",name:"Bastion",blurb:"An armoured truck that stands up",segs:Cc,body:{sdf:(i,t,e)=>F_(i,t,e),region:O_,box:U_,palette:[4871266,14262322,9431295,1842980,7118020,1316377,12896462],surface:"armour",weights:"rigid",capture:ji({mech:!0})},dress:Lc("bastion",9431295),fit:{size:1,limb:.6}},J_={id:"kestrel",name:"Kestrel",blurb:"A jet that stands up",segs:Cc,body:{sdf:(i,t,e)=>W_(i,t,e),region:X_,box:z_,palette:[15132908,5661306,16756800,1842980,13117498],surface:"armour",weights:"rigid",capture:ji({mech:!0})},dress:Lc("kestrel",16756800),fit:{size:1,limb:.6}},Q_={id:"unison",name:"Unison",blurb:"Five machines locked into one",segs:Cc,body:{sdf:(i,t,e)=>k_(i,t,e),region:H_,box:B_,palette:[15527666,2503274,8382719,1842980,15234090,2271388,15254056,12855866],surface:"armour",weights:"rigid",capture:ji({mech:!0})},dress:Lc("unison",8382719),fit:{size:1,limb:.6}},cn=[Uv,Gv,r_,E_,j_,q_,Y_,Z_,K_,J_,Q_],Xi=i=>cn.find(t=>t.id===i)??cn[0],tx=i=>new O(i.x,i.y,i.z),fr=(i,t,e)=>{const n=Math.min(1,Math.max(0,(e-i)/(t-i)));return n*n*(3-2*n)};function Eh(i,t){const e=t.clone().normalize(),n=new O().crossVectors(i,e).normalize(),r=new O().crossVectors(e,n).normalize();return new ke().setFromRotationMatrix(new ne().makeBasis(r,e,n))}function ex(i,t){const e=i.clone().normalize(),n=new O().crossVectors(t,e).normalize(),r=new O().crossVectors(e,n).normalize();return new ke().setFromRotationMatrix(new ne().makeBasis(e,n,r))}function nx(i){const t=M=>tx(i[M]),e=(...M)=>Math.min(...M.map(T=>i[T].v)),n=t(z.hipL),r=t(z.hipR),s=t(z.shL),a=t(z.shR),o=n.clone().add(r).multiplyScalar(.5),c=s.clone().add(a).multiplyScalar(.5),l=c.clone().sub(o),h=Eh(n.clone().sub(r),l),u=Eh(s.clone().sub(a),l),d=t(z.earL),f=t(z.earR),m=t(z.nose),x=d.clone().add(f).multiplyScalar(.5),g=ex(d.clone().sub(f),m.clone().sub(x));g.multiply(new ke().setFromAxisAngle(new O(1,0,0),-.32));const p=(M,T)=>t(T).sub(t(M)).normalize(),E={armL:p(z.shL,z.elL),forearmL:p(z.elL,z.wrL),armR:p(z.shR,z.elR),forearmR:p(z.elR,z.wrR),thighL:p(z.hipL,z.knL),shinL:p(z.knL,z.anL),footL:p(z.heelL,z.toeL),thighR:p(z.hipR,z.knR),shinR:p(z.knR,z.anR),footR:p(z.heelR,z.toeR)},b={armL:e(z.shL,z.elL),forearmL:e(z.elL,z.wrL),armR:e(z.shR,z.elR),forearmR:e(z.elR,z.wrR),thighL:e(z.hipL,z.knL),shinL:e(z.knL,z.anL),footL:e(z.heelL,z.toeL),thighR:e(z.hipR,z.knR),shinR:e(z.knR,z.anR),footR:e(z.heelR,z.toeR)};return{pelvis:h,chest:u,head:g,headVis:e(z.earL,z.earR,z.nose),neck:x.sub(c).normalize(),dir:E,vis:b}}const ix={armL:new O(1,0,0),armR:new O(-1,0,0),thighL:new O(0,-1,0),thighR:new O(0,-1,0),neck:new O(0,1,0)},wh={forearmL:"armL",forearmR:"armR",shinL:"thighL",shinR:"thighR",footL:"shinL",footR:"shinR"};class rx{bones;rest=new Map;qm=new Map;hipRest;pelvisA;torso;len=new Map;segs;constructor(t,e){this.segs=t,this.bones=e;const n=l=>t.find(h=>h.name===l);for(const l of t){const h=new O(l.b[0]-l.a[0],l.b[1]-l.a[1],l.b[2]-l.a[2]);this.len.set(l.name,h.length()),h.lengthSq()>1e-9?h.normalize():h.set(0,1,0);const u=l.parent?n(l.parent):null,d=u?new O(l.a[0]-u.a[0],l.a[1]-u.a[1],l.a[2]-u.a[2]):new O(...l.a);let f=ix[l.name];if(!f&&wh[l.name]){const m=n(wh[l.name]);f=new O(m.b[0]-m.a[0],m.b[1]-m.a[1],m.b[2]-m.a[2]).normalize(),l.name.startsWith("foot")&&(f=h.clone())}f??=h.clone(),this.rest.set(l.name,{dir:h,offset:d,pre:new ke().setFromUnitVectors(h,f),canon:f})}this.pelvisA=new O(...n("pelvis").a);const r=n("thighL").a,s=n("thighR").a,a=n("armL").a,o=n("armR").a;this.hipRest=new O((r[0]+s[0])/2,(r[1]+s[1])/2,(r[2]+s[2])/2);const c=new O((a[0]+o[0])/2,(a[1]+o[1])/2,(a[2]+o[2])/2);this.torso=c.distanceTo(this.hipRest)}setLength(t,e){const n=this.segs.find(a=>a.parent===t&&!a.name.startsWith("tail")&&a.name!=="jaw");if(!n)return;const r=this.bones.get(n.name),s=this.rest.get(n.name);r.position.copy(s.offset).multiplyScalar(e)}neckFit(t){const e=l=>this.segs.find(h=>h.name===l),n=e("spine2"),r=e("neck"),s=e("head"),a=(e("armL").a[1]+e("armR").a[1])/2-n.a[1],o=r.a[1]-n.a[1]+(s.a[1]-r.a[1]),c=(s.a[1]+s.b[1])/2-s.a[1];return o>.001?(a+t-c)/o:1}setNeck(t){for(const e of["neck","head"]){const n=this.bones.get(e),r=this.rest.get(e);n&&r&&n.position.copy(r.offset).multiplyScalar(t)}}swing(t,e,n,r){const s=this.rest.get(t),a=n.clone().applyQuaternion(e.clone().invert()).normalize(),o=new ke().setFromUnitVectors(s.canon,a).multiply(s.pre);return r<1&&o.slerp(new ke,1-Math.max(0,r)),o}set(t,e,n){const r=this.bones.get(t);r&&r.quaternion.copy(e);const s=n?n.clone().multiply(e):e.clone();return this.qm.set(t,s),s}apply(t,e=0,n=0){const r=this.set("pelvis",t.pelvis,null),s=this.hipRest.clone().sub(this.pelvisA).applyQuaternion(t.pelvis);this.bones.get("pelvis").position.copy(s.negate());const a=t.pelvis.clone().slerp(t.chest,.5),o=this.set("spine1",r.clone().invert().multiply(a),r),c=this.set("spine2",o.clone().invert().multiply(t.chest),o),l=fr(.3,.7,t.headVis),h=this.set("neck",this.swing("neck",c,t.neck,l*.6),c),u=h.clone().invert().multiply(t.head);l<1&&u.slerp(new ke,1-l),this.set("head",u,h);for(const f of["L","R"]){const m=this.set("arm"+f,this.swing("arm"+f,c,t.dir[`arm${f}`],fr(.35,.7,t.vis[`arm${f}`])),c);this.set("forearm"+f,this.swing("forearm"+f,m,t.dir[`forearm${f}`],fr(.35,.7,t.vis[`forearm${f}`])),m);const x=this.set("thigh"+f,this.swing("thigh"+f,r,t.dir[`thigh${f}`],fr(.4,.75,t.vis[`thigh${f}`])),r),g=this.set("shin"+f,this.swing("shin"+f,x,t.dir[`shin${f}`],fr(.4,.75,t.vis[`shin${f}`])),x);this.set("foot"+f,this.swing("foot"+f,g,t.dir[`foot${f}`],fr(.5,.8,t.vis[`foot${f}`])),g)}let d=r;for(let f=1;f<=4;f++){const m="tail"+f;if(!this.bones.has(m))break;const x=new ke().setFromEuler(new vn(0,Math.sin(e*2.1-f*.7)*n,Math.sin(e*1.3-f*.5)*n*.3));d=this.set(m,x,f===1?this.qm.get(this.segs.find(g=>g.name==="tail1")?.parent??"pelvis")??r:d)}}dirOf(t){return this.rest.get(t).dir.clone().applyQuaternion(this.qm.get(t))}}const dr=64,Xr=32,dn=48,In=36,pr=12,Xs=9,mn={spread:1.6,back:.9,envIntensity:1.15,key:5,every:6,targetMean:.2,maxGain:2.6},so=new Float32Array(256).map((i,t)=>{const e=t/255;return e<=.04045?e/12.92:Math.pow((e+.055)/1.055,2.4)});class sx{constructor(t,e,n){this.renderer=t,this.scene=e,this.cv=document.createElement("canvas"),this.cv.width=dn,this.cv.height=In,this.ctx=this.cv.getContext("2d",{willReadFrequently:!0}),this.tex=new jr(this.data,dr,Xr,He,qi),this.tex.mapping=ra,this.tex.colorSpace=Gi,this.tex.magFilter=ve,this.tex.minFilter=ve,this.pmrem=new Qo(t),this.key.castShadow=!0,this.key.shadow.mapSize.set(1024,1024),this.key.shadow.bias=-5e-4,this.key.shadow.normalBias=.02,this.key.shadow.radius=4,e.add(this.key),e.add(this.key.target),e.add(this.fill),this.fill.intensity=1}key=new Jo(16777215,1);fill=new S0(16777215,4473924,0);cv;ctx;lin=new Float32Array(dn*In*3);blur=new Float32Array(pr*Xs*3);data=new Uint16Array(dr*Xr*4);tex;pmrem;rt=null;mean=0;share=0;gain=1;dir=new O(0,1,1).normalize();target=new O(0,0,-2);update(t,e,n,r,s,a){if(this.aimShadows(s,n),!a){this.scene.environment=null,this.fill.intensity=1.2,this.key.intensity=1.6,this.key.position.copy(this.target).add(new O(1.5,3,2.5));return}if(r%mn.every!==0&&this.rt||t.readyState<2||!t.videoWidth)return;this.ctx.drawImage(t,0,0,dn,In);const o=this.ctx.getImageData(0,0,dn,In).data;let c=0;for(let b=0,M=0;b<dn*In;b++,M+=4){const T=so[o[M]],w=so[o[M+1]],A=so[o[M+2]];this.lin[b*3]=T,this.lin[b*3+1]=w,this.lin[b*3+2]=A,c+=.2126*T+.7152*w+.0722*A}this.mean=c/(dn*In),this.gain=Math.min(mn.maxGain,Math.max(1,mn.targetMean/Math.max(this.mean,.001)));const l=this.gain;this.blur.fill(0);const h=dn/pr,u=In/Xs;for(let b=0;b<In;b++)for(let M=0;M<dn;M++){const T=(Math.floor(b/u)*pr+Math.floor(M/h))*3,w=(b*dn+M)*3,A=this.blur;A[T]=A[T]+this.lin[w],A[T+1]=A[T+1]+this.lin[w+1],A[T+2]=A[T+2]+this.lin[w+2]}for(let b=0;b<this.blur.length;b++)this.blur[b]=this.blur[b]/(h*u);const d=e.f/e.w,f=e.f/e.h;let m=0,x=0,g=0,p=0;for(let b=0;b<Xr;b++){const M=((b+.5)/Xr-.5)*Math.PI,T=Math.sin(M),w=Math.cos(M);for(let A=0;A<dr;A++){const R=((A+.5)/dr-.5)*Math.PI*2;let v=Math.cos(R)*w;const _=Math.sin(R)*w,S=n?-v:v,y=_<0,D=Math.max(Math.abs(_),.08),I=Math.min(1,Math.max(0,.5+S/D*d/mn.spread)),U=Math.min(1,Math.max(0,.5-T/D*f/mn.spread));let H,$,V;if(y){const ft=(Math.min(In-1,Math.floor(U*In))*dn+Math.min(dn-1,Math.floor(I*dn)))*3;H=this.lin[ft],$=this.lin[ft+1],V=this.lin[ft+2]}else{const ft=(Math.min(Xs-1,Math.floor(U*Xs))*pr+Math.min(pr-1,Math.floor(I*pr)))*3;H=this.blur[ft]*mn.back,$=this.blur[ft+1]*mn.back,V=this.blur[ft+2]*mn.back}H*=l,$*=l,V*=l;const tt=(b*dr+A)*4;this.data[tt]=Ts.toHalfFloat(H),this.data[tt+1]=Ts.toHalfFloat($),this.data[tt+2]=Ts.toHalfFloat(V),this.data[tt+3]=Ts.toHalfFloat(1);const st=.2126*H+.7152*$+.0722*V,ct=st*w;v=Math.cos(R)*w,m+=ct*v,x+=ct*T,g+=ct*_,p+=ct}}this.tex.needsUpdate=!0,this.rt=this.pmrem.fromEquirectangular(this.tex,this.rt),this.scene.environment=this.rt.texture,this.scene.environmentIntensity=mn.envIntensity;const E=Math.hypot(m,x,g);this.share=p>0?E/p:0,E>1e-6&&this.dir.set(m/E,x/E,g/E),this.dir.y<.15&&(this.dir.y=.15,this.dir.normalize()),this.key.intensity=mn.key*this.share*(p/(dr*Xr))*2,this.fill.intensity=0,this.key.position.copy(this.target).addScaledVector(this.dir,4)}aimShadows(t,e){if(!t.length)return;const n=new O;for(const a of t)n.add(a);n.multiplyScalar(1/t.length),e&&(n.x=-n.x);let r=1.4;for(const a of t)r=Math.max(r,Math.hypot((e?-a.x:a.x)-n.x,a.y-n.y,a.z-n.z)+1.4);this.target.copy(n),this.key.target.position.copy(n),this.key.position.copy(n).addScaledVector(this.dir,4);const s=this.key.shadow.camera;s.right!==r&&(s.left=-r,s.right=r,s.top=r,s.bottom=-r,s.near=.1,s.far=4+r*2,s.updateProjectionMatrix())}}const qs=12,Vu=`
  varying vec2 vUv;
  uniform vec4 uCrop; // u0, v0, du, dv of the video shown
  uniform float uMirror;
  void main() {
    vec2 uv = position.xy * 0.5 + 0.5;
    uv.x = mix(uv.x, 1.0 - uv.x, uMirror);
    vUv = uCrop.xy + uv * uCrop.zw;
    gl_Position = vec4(position.xy, 1.0, 1.0);
  }`,ax=`
  varying vec2 vUv;
  uniform sampler2D uTex;
  void main() { gl_FragColor = vec4(texture2D(uTex, vUv).rgb, 1.0); }`;class ox{constructor(t){this.canvas=t,this.renderer=new cv({canvas:t,antialias:!0,alpha:!1,powerPreference:"high-performance",preserveDrawingBuffer:!1}),this.renderer.outputColorSpace=rn,this.renderer.toneMapping=Bh,this.renderer.toneMappingExposure=1,this.renderer.shadowMap.enabled=!0,this.renderer.shadowMap.type=Fh,this.renderer.setPixelRatio(this.opts.pixelRatio),this.plainBg=new Ke({vertexShader:Vu,fragmentShader:ax,depthTest:!1,depthWrite:!1,toneMapped:!1,uniforms:this.bgUniforms}),this.bg=new Wt(new Ir(2,2),this.plainBg),this.bg.frustumCulled=!1,this.bg.renderOrder=-1e3,this.scene.add(this.bg),this.scene.add(this.world),this.scene.add(this.camera),this.light=new sx(this.renderer,this.scene,this.world),this.rims[0].position.set(-3,2.5,-6),this.rims[1].position.set(3,2.5,-6);for(const e of this.rims)e.target.position.set(0,0,-3),this.scene.add(e,e.target)}renderer;scene=new su;camera=new gn(50,1,.05,60);world=new an;light;bg;bgUniforms={uTex:{value:null},uCrop:{value:new le(0,0,1,1)},uMirror:{value:0}};plainBg;videoTex=null;templates=new Map;wearers=new Map;pyramid=!1;rims=[new Jo(16723349,0),new Jo(3073791,0)];opts={size:1,shadows:!0,envLight:!0,pixelRatio:Math.min(window.devicePixelRatio||1,2)};cover={s:1,ox:0,oy:0,vw:1,vh:1,cw:1,ch:1,mirror:!1};setVideo(t){this.videoTex?.dispose();const e=new r0(t);e.colorSpace=Bn,e.minFilter=ve,e.magFilter=ve,e.generateMipmaps=!1,this.videoTex=e,this.bgUniforms.uTex.value=e}setBackground(t){this.bg.material=t??this.plainBg}template(t){let e=this.templates.get(t);return e||(e=bv(Xi(t)),this.templates.set(t,e)),e}hasTemplate(t){return this.templates.has(t)}layout(t,e){const n=this.canvas.clientWidth||window.innerWidth,r=this.canvas.clientHeight||window.innerHeight,s=this.opts.pixelRatio;this.renderer.getPixelRatio()!==s&&this.renderer.setPixelRatio(s);const a=this.renderer.getSize(new Rt);(a.x!==n||a.y!==r)&&this.renderer.setSize(n,r,!1);const o=Math.max(n/t.w,r/t.h),c=n/o,l=r/o,h=(t.w-c)/2/t.w,u=(t.h-l)/2/t.h;this.bgUniforms.uCrop.value.set(h,u,c/t.w,l/t.h),this.bgUniforms.uMirror.value=e?1:0,this.camera.fov=Sd.radToDeg(2*Math.atan(l/2/t.f)),this.camera.aspect=n/r,this.camera.updateProjectionMatrix(),this.world.scale.x=e?-1:1,this.cover={s:o,ox:(t.w-c)/2,oy:(t.h-l)/2,vw:t.w,vh:t.h,cw:n,ch:r,mirror:e}}sync(t,e,n){const r=new Set;for(const s of t){const a=e(s.id);if(!this.templates.has(a))continue;r.add(s.id);let o=this.wearers.get(s.id);o&&o.def.id!==a&&(this.drop(o),o=void 0),o||(o=this.dress(s.id,a)),this.pose(o,s,n)}for(const[s,a]of this.wearers)r.has(s)||this.drop(a)}dress(t,e){const n=this.template(e),r=Ql(n.root),s=new Map;r.traverse(l=>{l.isBone&&s.set(l.name,l)});const a=new Map;r.traverse(l=>{const h=l;if(!h.isMesh)return;const u=d=>{let f=a.get(d);return f||(f=d.clone(),f.onBeforeCompile=d.onBeforeCompile,f.customProgramCacheKey=d.customProgramCacheKey,f.alphaHash=!0,a.set(d,f)),f};h.material=Array.isArray(h.material)?h.material.map(u):u(h.material)});const o=n.def.segs.map(l=>s.get(l.name)).filter(Boolean),c={trackId:t,def:n.def,root:r,rig:new rx(n.def.segs,s),mats:[...a.values()],fade:0,boneList:o,hist:Array.from({length:qs},()=>new Float32Array(o.length*7)),histHead:0,clones:[]};return this.world.add(r),this.wearers.set(t,c),c}drop(t){this.world.remove(t.root);for(const e of t.clones)this.world.remove(e.root);for(const e of t.mats)e.dispose();this.wearers.delete(t.trackId)}pose(t,e,n){const r=t.def,s=t.rig,a=nx(e.world),o=e.len.torso/s.torso*(r.fit?.size??1)*this.opts.size,c=r.fit?.limb??0,l=(f,m)=>{const x=1+(m/o/(s.len.get(f)??1)-1)*c;s.setLength(f,Math.min(1.6,Math.max(.65,x)))};for(const f of["L","R"])l("arm"+f,e.len.upperArm),l("thigh"+f,e.len.thigh),l("shin"+f,e.len.shin);const h=s.neckFit(e.len.neck/o);s.setNeck(1+(Math.min(1.25,Math.max(.45,h))-1)*(r.fit?.head??.85)),s.apply(a,n,r.idle?.tail??0),t.root.position.set(e.T.x,e.T.y,e.T.z),t.root.scale.setScalar(o);const u=e.presence*e.presence*(3-2*e.presence);if(u!==t.fade){for(const f of t.mats)f.opacity=u;t.fade=u}t.root.visible=u>.01,r.tick?.(t.root,n),t.histHead=(t.histHead+1)%qs;const d=t.hist[t.histHead];t.boneList.forEach((f,m)=>{f.quaternion.toArray(d,m*7),f.position.toArray(d,m*7+4)}),this.posePyramid(t,o,u,n)}posePyramid(t,e,n,r){const s=this.pyramid?this.wearers.size>1?2:3:0,a=[];for(let c=1;c<=s;c++)for(let l=0;l<=c;l++)a.push([c,l]);for(;t.clones.length>a.length;)this.world.remove(t.clones.pop().root);for(;t.clones.length<a.length;){const c=Ql(t.root);c.traverse(d=>{d.castShadow=!1});const l=new Map;c.traverse(d=>{d.isBone&&l.set(d.name,d)});const[h,u]=a[t.clones.length];t.clones.push({root:c,bones:t.def.segs.map(d=>l.get(d.name)).filter(Boolean),row:h,col:u}),this.world.add(c)}const o=t.rig.torso*e*3.2;for(const c of t.clones){const l=c.col-c.row/2,h=Math.round(c.row*3+Math.abs(l)*1.5),u=t.hist[(t.histHead-h+qs*4)%qs];c.bones.forEach((d,f)=>{d.quaternion.fromArray(u,f*7),d.position.fromArray(u,f*7+4)}),c.root.position.set(t.root.position.x+l*o*.62,t.root.position.y+c.row*o*.3,t.root.position.z-c.row*o*.9),c.root.scale.copy(t.root.scale),c.root.visible=t.root.visible,t.def.tick?.(c.root,r-h/30)}}stageLights(t,e,n){const r=[16722324,11796265,16769065,2744575,9187071];this.rims.forEach((s,a)=>{s.intensity=t?2.2+3*n:0;const o=(e*.12+a*.4)%1*r.length,c=Math.floor(o),l=o-c;s.color.setHex(r[c%r.length]).lerp(new Ht(r[(c+1)%r.length]),l)})}people(){return[...this.wearers.values()].filter(t=>t.root.visible).map(t=>t.root.position.clone())}render(t,e,n){this.renderer.shadowMap.enabled=this.opts.shadows,t&&this.light.update(t,e,this.cover.mirror,n,this.people(),this.opts.envLight),this.renderer.render(this.scene,this.camera)}get count(){return this.wearers.size}}const ri=[{id:"pyramid",name:"Pyramid",code:8,swatch:"conic-gradient(from 150deg at 50% 18%, transparent 0 60deg, #ff2d95 60deg 64deg, #b6ff2e 64deg 68deg, transparent 68deg), linear-gradient(#2a0f3d, #08050f)"},{id:"tunnel",name:"Tunnel",code:9,swatch:"repeating-radial-gradient(circle, #ff2d95 0 3px, #12071f 3px 8px, #2ee6ff 8px 11px, #12071f 11px 16px)"},{id:"lasers",name:"Lasers",code:10,swatch:"linear-gradient(115deg, transparent 46%, #b6ff2e 48%, transparent 50%), linear-gradient(65deg, transparent 46%, #ff2d95 48%, transparent 50%), linear-gradient(90deg, transparent 47%, #2ee6ff 49%, transparent 51%), #07040d"},{id:"kaleido",name:"Kaleido",code:11,swatch:"conic-gradient(#ff2d95, #ffe62e, #b6ff2e, #2ee6ff, #8a2eff, #ff2d95)"},{id:"rings",name:"Rings",code:5,swatch:"repeating-radial-gradient(circle, #ff3d7f 0 5px, #ffb23d 5px 10px, #3dd6ff 10px 15px, #8c5cff 15px 20px)"},{id:"neon",name:"Neon",code:4,swatch:"radial-gradient(circle, transparent 0 40%, #39ff9c 42% 50%, transparent 54%), #06030f"},{id:"pop",name:"Pop Art",code:1,swatch:"radial-gradient(circle at 30% 30%, #ffde00 0 22%, transparent 23%), radial-gradient(circle at 70% 70%, #ff2d8a 0 22%, transparent 23%), #19c3ff"},{id:"warhol",name:"Warhol",code:2,swatch:"conic-gradient(#ff5fa2 0 25%, #ffd400 0 50%, #2ad4c4 0 75%, #7b5cff 0)"},{id:"echo",name:"Echoes",code:6,swatch:"linear-gradient(90deg, #1b1033, #ff2db4 40%, #2de2ff 70%, #1b1033)"},{id:"disco",name:"Disco",code:7,swatch:"radial-gradient(circle at 30% 30%, #ff4fd8, transparent 45%), radial-gradient(circle at 70% 60%, #4fd1ff, transparent 45%), radial-gradient(circle at 45% 80%, #ffe14f, transparent 40%), #120820"},{id:"solar",name:"Solarize",code:3,swatch:"linear-gradient(135deg, #1a0b3d, #ff7a00 45%, #00e5ff 55%, #2a0b3d)"},{id:"spot",name:"Spotlight",code:0,swatch:"radial-gradient(circle at 50% 40%, #fff6d8, #6a5a40 45%, #120f0a 75%)"}],cx=[[2757440,16727435,16756736,16774084],[731722,46023,16740156,16776160],[2951947,9321727,3997598,16382065],[1058330,16723502,3065343,16769520]],ca=12,Ys=`
  varying vec2 vUv;
  void main() { vUv = position.xy * 0.5 + 0.5; gl_Position = vec4(position.xy, 0.0, 1.0); }`,lx=`
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
  }`,hx=`
  varying vec2 vUv;
  uniform sampler2D uTex, uMask;
  uniform vec4 uOn;
  void main() {
    vec4 m = smoothstep(0.3, 0.7, texture2D(uMask, vec2(vUv.x, 1.0 - vUv.y))) * uOn;
    gl_FragColor = vec4(texture2D(uTex, vUv).rgb, max(max(m.r, m.g), max(m.b, m.a)));
  }`,ux=`
  varying vec2 vUv;
  uniform sampler2D uTex, uMask, uFx, uPrev;
  uniform highp sampler2DArray uHist;
  uniform float uHead, uTime, uAspect, uBeat, uLevel, uClones;
  uniform int uPreset;
  uniform vec4 uOn, uBox;
  uniform vec3 uPal[16];
  ${lx}

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
    return texture(uHist, vec3(q, mod(uHead - delay + ${ca}.0 * 8.0, ${ca}.0)));
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
      // the dance pyramid: the subjects cloned behind and above themselves, each row smaller and later — a canon
      float y = uv.y;
      float scan = pow(0.5 + 0.5 * sin(y * 90.0 - t * 5.0), 10.0);
      bg = neon(y * 0.5 - t * 0.07) * (0.06 + 0.22 * scan + 0.05 * beat) + vid * 0.04;
      vec2 base = vec2((uBox.x + uBox.z) * 0.5, uBox.y);
      float W = max(uBox.z - uBox.x, 0.08), H = max(uBox.w - uBox.y, 0.12);
      vec3 col = bg;
      for (int r = 3; r >= 1; r--) {
        if (uClones < 0.5) break;
        float fr = float(r), s = pow(0.74, fr);
        for (int j = 0; j <= 3; j++) {
          if (j > r) break;
          float fj = float(j) - fr * 0.5;
          vec2 off = vec2(fj * W * 1.05 * s * 1.25, fr * H * 0.27);
          vec2 q = base + (uv - base - off) / s;
          vec4 c = past(q, fr * 3.0 + abs(fj) * 1.5);
          vec3 tint = neon(fr * 0.27 + float(j) * 0.11 + t * 0.05);
          vec3 cc = mix(c.rgb, tint * (0.25 + 1.6 * luma(c.rgb)), 0.65) + tint * clamp(1.0 - abs(c.a - 0.5) * 2.0, 0.0, 1.0) * 1.8;
          col = mix(col, cc * (1.0 - 0.12 * fr), c.a);
        }
      }
      // a floor of light under the front row
      col += neon(t * 0.05) * exp(-pow((uv.y - uBox.y) * 18.0, 2.0)) * exp(-pow((uv.x - base.x) / (W * 2.5), 2.0)) * 0.5;
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
  }`,fx=`
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
  }`,dx=`
  varying vec2 vUv;
  uniform sampler2D uSrc;
  uniform vec2 uDir;
  void main() {
    vec3 c = texture2D(uSrc, vUv).rgb * 0.2270270;
    c += (texture2D(uSrc, vUv + uDir * 1.3846154).rgb + texture2D(uSrc, vUv - uDir * 1.3846154).rgb) * 0.3162162;
    c += (texture2D(uSrc, vUv + uDir * 3.2307692).rgb + texture2D(uSrc, vUv - uDir * 3.2307692).rgb) * 0.0702703;
    gl_FragColor = vec4(c, 1.0);
  }`,px=`
  varying vec2 vUv;
  uniform sampler2D uScene, uBloom1, uBloom2;
  uniform float uTime, uBeat, uFlash;
  uniform vec2 uRes;
  float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
  void main() {
    vec2 d = vUv - 0.5;
    float ca = 0.006 + 0.012 * uBeat;
    vec3 c = vec3(texture2D(uScene, vUv + d * ca).r, texture2D(uScene, vUv).g, texture2D(uScene, vUv - d * ca).b);
    c += texture2D(uBloom1, vUv).rgb * 0.75 + texture2D(uBloom2, vUv).rgb * 0.9;
    vec2 v = d * vec2(1.0, 1.15);
    c *= 1.0 - 0.55 * dot(v, v);
    c += uBeat * uFlash * 0.07;
    // the highlights roll off instead of clipping: neon stays a colour
    vec3 hi = max(c - 0.8, 0.0);
    c = min(c, 0.8) + 0.2 * (1.0 - exp(-hi * 3.0)) + hi * 0.05;
    c += (hash(vUv * uRes + fract(uTime * 7.31) * 100.0) - 0.5) * 0.04;
    gl_FragColor = vec4(c, 1.0);
  }`;class mx{material;preset=ri[0];subjects=2;beat=0;clones=!0;maskTex;maskData=new Uint8Array(4);mw=0;mh=0;fw=0;fh=0;fxTex;fxData;chans=[null,null,null,null];chanMask=[null,null,null,null];union;dist;trail;stamp;uOn=new le;box=new le(.35,.1,.65,.7);quad=new Wt(new Ir(2,2));quadScene=new su;cam=new yc(-1,1,1,-1,0,1);cut;scene;bright;blur;rtScene=[];rtB1a=null;rtB1b=null;rtB2a=null;rtB2b=null;hist=null;head=0;flip=0;sizeKey="";constructor(t,e){this.maskTex=new jr(new Uint8Array(4),1,1,He),this.maskTex.needsUpdate=!0,this.resizeFx(160,90);const n={depthTest:!1,depthWrite:!1,toneMapped:!1};this.cut=new Ke({...n,vertexShader:Ys,fragmentShader:hx,uniforms:{uTex:t.uTex,uMask:{value:this.maskTex},uOn:{value:this.uOn}}}),this.scene=new Ke({...n,vertexShader:Ys,fragmentShader:ux,uniforms:{uTex:t.uTex,uMask:{value:this.maskTex},uFx:{value:this.fxTex},uPrev:{value:null},uHist:{value:null},uHead:{value:0},uClones:{value:1},uTime:{value:0},uAspect:{value:1},uBeat:{value:0},uLevel:{value:0},uPreset:{value:0},uOn:{value:this.uOn},uBox:{value:this.box},uPal:{value:cx.flat().map(r=>new Ht(r))}}}),this.bright=new Ke({...n,vertexShader:Ys,fragmentShader:fx,uniforms:{uSrc:{value:null},uTexel:{value:new Rt},uThreshold:{value:.72}}}),this.blur=new Ke({...n,vertexShader:Ys,fragmentShader:dx,uniforms:{uSrc:{value:null},uDir:{value:new Rt}}}),this.material=new Ke({...n,vertexShader:e,fragmentShader:px,uniforms:{uCrop:t.uCrop,uMirror:t.uMirror,uScene:{value:null},uBloom1:{value:null},uBloom2:{value:null},uTime:{value:0},uBeat:{value:0},uFlash:{value:1},uRes:{value:new Rt(1,1)}}}),this.quad.frustumCulled=!1,this.quadScene.add(this.quad)}resizeFx(t,e){this.fxTex?.dispose(),this.fxData=new Uint8Array(t*e*4),this.fxTex=new jr(this.fxData,t,e,He),this.fxTex.magFilter=ve,this.fxTex.minFilter=ve,this.union=new Float32Array(t*e),this.dist=new Float32Array(t*e),this.trail=new Float32Array(t*e),this.stamp=new Float32Array(t*e);for(let n=0;n<t*e;n++)this.fxData[n*4]=255;this.fxTex.needsUpdate=!0,this.fw=t,this.fh=e,this.scene&&(this.scene.uniforms.uFx.value=this.fxTex)}update(t,e,n,r){const s=this.scene.uniforms;s.uTime.value=n,s.uAspect.value=r,s.uPreset.value=this.preset.code,s.uBeat.value=this.beat,s.uClones.value=this.clones?1:0,this.material.uniforms.uTime.value=n,this.material.uniforms.uBeat.value=this.beat;const a=r>=1?160:Math.max(48,Math.round(160*r)),o=r>=1?Math.max(48,Math.round(160/r)):160;(a!==this.fw||o!==this.fh)&&this.resizeFx(a,o);const c=t.filter(f=>f.presence>0).sort((f,m)=>m.len.torso/-m.T.z-f.len.torso/-f.T.z).slice(0,this.subjects),l=new Set(c.map(f=>f.id));for(let f=0;f<4;f++)this.chans[f]!==null&&!l.has(this.chans[f])&&(this.chans[f]=null,this.chanMask[f]=null);for(const f of c){let m=this.chans.indexOf(f.id);if(m<0){if(m=this.chans.indexOf(null),m<0)continue;this.chans[m]=f.id}const x=f.det?.mask;if(x){(x.w!==this.mw||x.h!==this.mh)&&this.resizeMask(x.w,x.h);let g=this.chanMask[m];(!g||g.length!==x.data.length)&&(g=this.chanMask[m]=new Float32Array(x.data.length)),g.set(x.data)}}const h=[0,0,0,0];for(let f=0;f<4;f++){const m=this.chans[f];m!==null&&this.chanMask[f]&&(h[f]=t.find(x=>x.id===m)?.presence??0)}if(this.uOn.set(h[0],h[1],h[2],h[3]),this.fx(e,n,h),!this.mw)return;const u=this.mw*this.mh,d=this.maskData;for(let f=0;f<4;f++){const m=this.chanMask[f];if(!m){for(let x=0;x<u;x++)d[x*4+f]=0;continue}for(let x=0;x<u;x++)d[x*4+f]=m[x]*255}this.maskTex.needsUpdate=!0}resizeMask(t,e){this.maskTex.dispose(),this.mw=t,this.mh=e,this.maskData=new Uint8Array(t*e*4),this.maskTex=new jr(this.maskData,t,e,He),this.maskTex.magFilter=ve,this.maskTex.minFilter=ve,this.scene.uniforms.uMask.value=this.maskTex,this.cut.uniforms.uMask.value=this.maskTex}fx(t,e,n){const r=this.fw,s=this.fh,a=this.union,o=this.dist;let c=r,l=s,h=-1,u=-1;for(let p=0;p<s;p++){const E=Math.min(this.mh-1,Math.floor((p+.5)/s*this.mh));for(let b=0;b<r;b++){let M=0;if(this.mw){const T=E*this.mw+Math.min(this.mw-1,Math.floor((b+.5)/r*this.mw));for(let w=0;w<4;w++){const A=this.chanMask[w];A&&(M=Math.max(M,A[T]*n[w]))}}a[p*r+b]=M,M>.5&&(b<c&&(c=b),b>h&&(h=b),p<l&&(l=p),p>u&&(u=p))}}if(h>=0){const p=1-Math.exp(-t/.12),E=c/r,b=(h+1)/r,M=1-(u+1)/s,T=1-l/s;this.box.set(this.box.x+(E-this.box.x)*p,this.box.y+(M-this.box.y)*p,this.box.z+(b-this.box.z)*p,this.box.w+(T-this.box.w)*p)}const d=1e6,f=Math.SQRT2;for(let p=0;p<r*s;p++)o[p]=a[p]>.5?0:d;for(let p=0;p<s;p++)for(let E=0;E<r;E++){const b=p*r+E;let M=o[b];E>0&&(M=Math.min(M,o[b-1]+1)),p>0&&(M=Math.min(M,o[b-r]+1),E>0&&(M=Math.min(M,o[b-r-1]+f)),E<r-1&&(M=Math.min(M,o[b-r+1]+f))),o[b]=M}for(let p=s-1;p>=0;p--)for(let E=r-1;E>=0;E--){const b=p*r+E;let M=o[b];E<r-1&&(M=Math.min(M,o[b+1]+1)),p<s-1&&(M=Math.min(M,o[b+r]+1),E<r-1&&(M=Math.min(M,o[b+r+1]+f)),E>0&&(M=Math.min(M,o[b+r-1]+f))),o[b]=M}const m=Math.exp(-t/1.1),x=e*.2%1,g=this.fxData;for(let p=0;p<r*s;p++){const E=a[p];this.trail[p]=Math.max(this.trail[p]*m,E),E>.5&&(this.stamp[p]=x),g[p*4]=Math.min(1,o[p]/48)*255,g[p*4+1]=this.trail[p]*255,g[p*4+2]=this.stamp[p]*255,g[p*4+3]=E*255}this.fxTex.needsUpdate=!0}targets(t,e,n){const s=900/Math.max(e,n),a=Math.max(64,Math.round(e*s)),o=Math.max(64,Math.round(n*s)),c=`${a}x${o}`;if(c===this.sizeKey)return;this.sizeKey=c;for(const p of[...this.rtScene,this.rtB1a,this.rtB1b,this.rtB2a,this.rtB2b])p?.dispose();this.hist?.dispose();const l=t.extensions,h=l.has("EXT_color_buffer_half_float")||l.has("EXT_color_buffer_float"),u={type:h?qi:Rn,depthBuffer:!1,magFilter:ve,minFilter:ve};this.bright.uniforms.uThreshold.value=h?.72:.62,this.rtScene=[new Ze(a,o,u),new Ze(a,o,u)];const d=Math.max(16,Math.round(a/4)),f=Math.max(16,Math.round(o/4)),m=Math.max(8,Math.round(a/16)),x=Math.max(8,Math.round(o/16));this.rtB1a=new Ze(d,f,u),this.rtB1b=new Ze(d,f,u),this.rtB2a=new Ze(m,x,u),this.rtB2b=new Ze(m,x,u);const g=480/Math.max(e,n);this.hist=new Ld(Math.round(e*g),Math.round(n*g),ca,{depthBuffer:!1}),this.hist.texture.magFilter=ve,this.hist.texture.minFilter=ve,this.scene.uniforms.uHist.value=this.hist.texture,this.material.uniforms.uRes.value.set(a,o)}pass(t,e,n,r=0){this.quad.material=e,t.setRenderTarget(n,r),t.render(this.quadScene,this.cam)}render(t,e,n){this.targets(t,e,n);const r=t.getRenderTarget();this.head=(this.head+1)%ca,this.pass(t,this.cut,this.hist,this.head),this.scene.uniforms.uHead.value=this.head;const s=this.rtScene[this.flip],a=this.rtScene[1-this.flip];this.flip=1-this.flip,this.scene.uniforms.uPrev.value=a.texture,this.pass(t,this.scene,s);const o=this.bright.uniforms,c=this.blur.uniforms;o.uSrc.value=s.texture,o.uTexel.value.set(1/s.width,1/s.height),this.pass(t,this.bright,this.rtB1a);const l=(d,f,m)=>{for(let x=0;x<m;x++)c.uSrc.value=d.texture,c.uDir.value.set(1.4/d.width,0),this.pass(t,this.blur,f),c.uSrc.value=f.texture,c.uDir.value.set(0,1.4/d.height),this.pass(t,this.blur,d)};l(this.rtB1a,this.rtB1b,1),o.uSrc.value=this.rtB1a.texture,o.uTexel.value.set(1/this.rtB1a.width,1/this.rtB1a.height);const h=o.uThreshold.value;o.uThreshold.value=0,this.pass(t,this.bright,this.rtB2a),o.uThreshold.value=h,l(this.rtB2a,this.rtB2b,2),t.setRenderTarget(r);const u=this.material.uniforms;u.uScene.value=s.texture,u.uBloom1.value=this.rtB1a.texture,u.uBloom2.value=this.rtB2a.texture}}class gx{env=0;level=0;stream=null;ctx=null;an=null;buf=new Uint8Array(0);avg=0;last=0;get on(){return!!this.an}async start(){if(this.an)return;this.stream=await navigator.mediaDevices.getUserMedia({audio:{echoCancellation:!1,noiseSuppression:!1,autoGainControl:!1}});const t=window.AudioContext??window.webkitAudioContext;this.ctx=new t,await this.ctx.resume();const e=this.ctx.createMediaStreamSource(this.stream);this.an=this.ctx.createAnalyser(),this.an.fftSize=1024,this.an.smoothingTimeConstant=0,e.connect(this.an),this.buf=new Uint8Array(this.an.frequencyBinCount)}stop(){for(const t of this.stream?.getTracks()??[])t.stop();this.ctx?.close(),this.stream=null,this.ctx=null,this.an=null,this.env=0,this.level=0}update(t,e){if(this.env*=Math.exp(-t/.18),!this.an||!this.ctx)return;this.an.getByteFrequencyData(this.buf);const n=this.ctx.sampleRate/this.an.fftSize,r=Math.max(1,Math.floor(40/n)),s=Math.max(r+1,Math.ceil(160/n));let a=0;for(let c=r;c<=s;c++)a+=this.buf[c];const o=a/((s-r+1)*255);this.level+=(o-this.level)*Math.min(1,t/.1),this.avg+=(o-this.avg)*Math.min(1,t/1.2),o>this.avg*1.3+.04&&o>.22&&e-this.last>260&&(this.env=1,this.last=e)}}const Th={people:2,model:"lite",size:1,lens:.85,envLight:!0,shadows:!0,debug:!1,mode:"one",costume:"jimothy",scene:"costume",effect:"pop",partyCostumes:!1,music:!1},Gu="costuma26.settings";function vx(){try{return{...Th,...JSON.parse(localStorage.getItem(Gu)??"{}")}}catch{return{...Th}}}function _x(i){try{localStorage.setItem(Gu,JSON.stringify(i))}catch{}}const $s=i=>`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${i}</svg>`,Ii={qr:$s('<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><path d="M14 14h3v3h-3zM20 14v.01M14 20h.01M17 20h4v-3"/>'),flip:$s('<path d="M4 7h3l2-3h6l2 3h3a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1z"/><path d="M9 13a3 3 0 0 1 5-2.2M15 13a3 3 0 0 1-5 2.2"/><path d="M14 9v2h-2M10 17v-2h2"/>'),gear:$s('<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/>'),camera:$s('<path d="M4 8h3l2-3h6l2 3h3a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1z"/><circle cx="12" cy="13" r="3.5"/>'),rec:'<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="7" fill="currentColor"/></svg>',stop:'<svg viewBox="0 0 24 24"><rect x="6" y="6" width="12" height="12" rx="2" fill="currentColor"/></svg>'};function xx(i){return i&&i.__esModule&&Object.prototype.hasOwnProperty.call(i,"default")?i.default:i}var ao={exports:{}},Ah;function Mx(){return Ah||(Ah=1,(function(i,t){var e=(function(){var n=function(T,w){var A=236,R=17,v=T,_=s[w],S=null,y=0,D=null,I=[],U={},H=function(F,B){y=v*4+17,S=(function(k){for(var X=new Array(k),K=0;K<k;K+=1){X[K]=new Array(k);for(var P=0;P<k;P+=1)X[K][P]=null}return X})(y),$(0,0),$(y-7,0),$(0,y-7),st(),tt(),ft(F,B),v>=7&&ct(F),D==null&&(D=it(v,_,I)),Ct(D,B)},$=function(F,B){for(var k=-1;k<=7;k+=1)if(!(F+k<=-1||y<=F+k))for(var X=-1;X<=7;X+=1)B+X<=-1||y<=B+X||(0<=k&&k<=6&&(X==0||X==6)||0<=X&&X<=6&&(k==0||k==6)||2<=k&&k<=4&&2<=X&&X<=4?S[F+k][B+X]=!0:S[F+k][B+X]=!1)},V=function(){for(var F=0,B=0,k=0;k<8;k+=1){H(!0,k);var X=o.getLostPoint(U);(k==0||F>X)&&(F=X,B=k)}return B},tt=function(){for(var F=8;F<y-8;F+=1)S[F][6]==null&&(S[F][6]=F%2==0);for(var B=8;B<y-8;B+=1)S[6][B]==null&&(S[6][B]=B%2==0)},st=function(){for(var F=o.getPatternPosition(v),B=0;B<F.length;B+=1)for(var k=0;k<F.length;k+=1){var X=F[B],K=F[k];if(S[X][K]==null)for(var P=-2;P<=2;P+=1)for(var ht=-2;ht<=2;ht+=1)P==-2||P==2||ht==-2||ht==2||P==0&&ht==0?S[X+P][K+ht]=!0:S[X+P][K+ht]=!1}},ct=function(F){for(var B=o.getBCHTypeNumber(v),k=0;k<18;k+=1){var X=!F&&(B>>k&1)==1;S[Math.floor(k/3)][k%3+y-8-3]=X}for(var k=0;k<18;k+=1){var X=!F&&(B>>k&1)==1;S[k%3+y-8-3][Math.floor(k/3)]=X}},ft=function(F,B){for(var k=_<<3|B,X=o.getBCHTypeInfo(k),K=0;K<15;K+=1){var P=!F&&(X>>K&1)==1;K<6?S[K][8]=P:K<8?S[K+1][8]=P:S[y-15+K][8]=P}for(var K=0;K<15;K+=1){var P=!F&&(X>>K&1)==1;K<8?S[8][y-K-1]=P:K<9?S[8][15-K-1+1]=P:S[8][15-K-1]=P}S[y-8][8]=!F},Ct=function(F,B){for(var k=-1,X=y-1,K=7,P=0,ht=o.getMaskFunction(B),at=y-1;at>0;at-=2)for(at==6&&(at-=1);;){for(var _t=0;_t<2;_t+=1)if(S[X][at-_t]==null){var gt=!1;P<F.length&&(gt=(F[P]>>>K&1)==1);var vt=ht(X,at-_t);vt&&(gt=!gt),S[X][at-_t]=gt,K-=1,K==-1&&(P+=1,K=7)}if(X+=k,X<0||y<=X){X-=k,k=-k;break}}},zt=function(F,B){for(var k=0,X=0,K=0,P=new Array(B.length),ht=new Array(B.length),at=0;at<B.length;at+=1){var _t=B[at].dataCount,gt=B[at].totalCount-_t;X=Math.max(X,_t),K=Math.max(K,gt),P[at]=new Array(_t);for(var vt=0;vt<P[at].length;vt+=1)P[at][vt]=255&F.getBuffer()[vt+k];k+=_t;var xt=o.getErrorCorrectPolynomial(gt),Nt=l(P[at],xt.getLength()-1),Se=Nt.mod(xt);ht[at]=new Array(xt.getLength()-1);for(var vt=0;vt<ht[at].length;vt+=1){var me=vt+Se.getLength()-ht[at].length;ht[at][vt]=me>=0?Se.getAt(me):0}}for(var N=0,vt=0;vt<B.length;vt+=1)N+=B[vt].totalCount;for(var C=new Array(N),j=0,vt=0;vt<X;vt+=1)for(var at=0;at<B.length;at+=1)vt<P[at].length&&(C[j]=P[at][vt],j+=1);for(var vt=0;vt<K;vt+=1)for(var at=0;at<B.length;at+=1)vt<ht[at].length&&(C[j]=ht[at][vt],j+=1);return C},it=function(F,B,k){for(var X=h.getRSBlocks(F,B),K=u(),P=0;P<k.length;P+=1){var ht=k[P];K.put(ht.getMode(),4),K.put(ht.getLength(),o.getLengthInBits(ht.getMode(),F)),ht.write(K)}for(var at=0,P=0;P<X.length;P+=1)at+=X[P].dataCount;if(K.getLengthInBits()>at*8)throw"code length overflow. ("+K.getLengthInBits()+">"+at*8+")";for(K.getLengthInBits()+4<=at*8&&K.put(0,4);K.getLengthInBits()%8!=0;)K.putBit(!1);for(;!(K.getLengthInBits()>=at*8||(K.put(A,8),K.getLengthInBits()>=at*8));)K.put(R,8);return zt(K,X)};U.addData=function(F,B){B=B||"Byte";var k=null;switch(B){case"Numeric":k=d(F);break;case"Alphanumeric":k=f(F);break;case"Byte":k=m(F);break;case"Kanji":k=x(F);break;default:throw"mode:"+B}I.push(k),D=null},U.isDark=function(F,B){if(F<0||y<=F||B<0||y<=B)throw F+","+B;return S[F][B]},U.getModuleCount=function(){return y},U.make=function(){if(v<1){for(var F=1;F<40;F++){for(var B=h.getRSBlocks(F,_),k=u(),X=0;X<I.length;X++){var K=I[X];k.put(K.getMode(),4),k.put(K.getLength(),o.getLengthInBits(K.getMode(),F)),K.write(k)}for(var P=0,X=0;X<B.length;X++)P+=B[X].dataCount;if(k.getLengthInBits()<=P*8)break}v=F}H(!1,V())},U.createTableTag=function(F,B){F=F||2,B=typeof B>"u"?F*4:B;var k="";k+='<table style="',k+=" border-width: 0px; border-style: none;",k+=" border-collapse: collapse;",k+=" padding: 0px; margin: "+B+"px;",k+='">',k+="<tbody>";for(var X=0;X<U.getModuleCount();X+=1){k+="<tr>";for(var K=0;K<U.getModuleCount();K+=1)k+='<td style="',k+=" border-width: 0px; border-style: none;",k+=" border-collapse: collapse;",k+=" padding: 0px; margin: 0px;",k+=" width: "+F+"px;",k+=" height: "+F+"px;",k+=" background-color: ",k+=U.isDark(X,K)?"#000000":"#ffffff",k+=";",k+='"/>';k+="</tr>"}return k+="</tbody>",k+="</table>",k},U.createSvgTag=function(F,B,k,X){var K={};typeof arguments[0]=="object"&&(K=arguments[0],F=K.cellSize,B=K.margin,k=K.alt,X=K.title),F=F||2,B=typeof B>"u"?F*4:B,k=typeof k=="string"?{text:k}:k||{},k.text=k.text||null,k.id=k.text?k.id||"qrcode-description":null,X=typeof X=="string"?{text:X}:X||{},X.text=X.text||null,X.id=X.text?X.id||"qrcode-title":null;var P=U.getModuleCount()*F+B*2,ht,at,_t,gt,vt="",xt;for(xt="l"+F+",0 0,"+F+" -"+F+",0 0,-"+F+"z ",vt+='<svg version="1.1" xmlns="http://www.w3.org/2000/svg"',vt+=K.scalable?"":' width="'+P+'px" height="'+P+'px"',vt+=' viewBox="0 0 '+P+" "+P+'" ',vt+=' preserveAspectRatio="xMinYMin meet"',vt+=X.text||k.text?' role="img" aria-labelledby="'+W([X.id,k.id].join(" ").trim())+'"':"",vt+=">",vt+=X.text?'<title id="'+W(X.id)+'">'+W(X.text)+"</title>":"",vt+=k.text?'<description id="'+W(k.id)+'">'+W(k.text)+"</description>":"",vt+='<rect width="100%" height="100%" fill="white" cx="0" cy="0"/>',vt+='<path d="',_t=0;_t<U.getModuleCount();_t+=1)for(gt=_t*F+B,ht=0;ht<U.getModuleCount();ht+=1)U.isDark(_t,ht)&&(at=ht*F+B,vt+="M"+at+","+gt+xt);return vt+='" stroke="transparent" fill="black"/>',vt+="</svg>",vt},U.createDataURL=function(F,B){F=F||2,B=typeof B>"u"?F*4:B;var k=U.getModuleCount()*F+B*2,X=B,K=k-B;return M(k,k,function(P,ht){if(X<=P&&P<K&&X<=ht&&ht<K){var at=Math.floor((P-X)/F),_t=Math.floor((ht-X)/F);return U.isDark(_t,at)?0:1}else return 1})},U.createImgTag=function(F,B,k){F=F||2,B=typeof B>"u"?F*4:B;var X=U.getModuleCount()*F+B*2,K="";return K+="<img",K+=' src="',K+=U.createDataURL(F,B),K+='"',K+=' width="',K+=X,K+='"',K+=' height="',K+=X,K+='"',k&&(K+=' alt="',K+=W(k),K+='"'),K+="/>",K};var W=function(F){for(var B="",k=0;k<F.length;k+=1){var X=F.charAt(k);switch(X){case"<":B+="&lt;";break;case">":B+="&gt;";break;case"&":B+="&amp;";break;case'"':B+="&quot;";break;default:B+=X;break}}return B},Z=function(F){var B=1;F=typeof F>"u"?B*2:F;var k=U.getModuleCount()*B+F*2,X=F,K=k-F,P,ht,at,_t,gt,vt={"██":"█","█ ":"▀"," █":"▄","  ":" "},xt={"██":"▀","█ ":"▀"," █":" ","  ":" "},Nt="";for(P=0;P<k;P+=2){for(at=Math.floor((P-X)/B),_t=Math.floor((P+1-X)/B),ht=0;ht<k;ht+=1)gt="█",X<=ht&&ht<K&&X<=P&&P<K&&U.isDark(at,Math.floor((ht-X)/B))&&(gt=" "),X<=ht&&ht<K&&X<=P+1&&P+1<K&&U.isDark(_t,Math.floor((ht-X)/B))?gt+=" ":gt+="█",Nt+=F<1&&P+1>=K?xt[gt]:vt[gt];Nt+=`
`}return k%2&&F>0?Nt.substring(0,Nt.length-k-1)+Array(k+1).join("▀"):Nt.substring(0,Nt.length-1)};return U.createASCII=function(F,B){if(F=F||1,F<2)return Z(B);F-=1,B=typeof B>"u"?F*2:B;var k=U.getModuleCount()*F+B*2,X=B,K=k-B,P,ht,at,_t,gt=Array(F+1).join("██"),vt=Array(F+1).join("  "),xt="",Nt="";for(P=0;P<k;P+=1){for(at=Math.floor((P-X)/F),Nt="",ht=0;ht<k;ht+=1)_t=1,X<=ht&&ht<K&&X<=P&&P<K&&U.isDark(at,Math.floor((ht-X)/F))&&(_t=0),Nt+=_t?gt:vt;for(at=0;at<F;at+=1)xt+=Nt+`
`}return xt.substring(0,xt.length-1)},U.renderTo2dContext=function(F,B){B=B||2;for(var k=U.getModuleCount(),X=0;X<k;X++)for(var K=0;K<k;K++)F.fillStyle=U.isDark(X,K)?"black":"white",F.fillRect(X*B,K*B,B,B)},U};n.stringToBytesFuncs={default:function(T){for(var w=[],A=0;A<T.length;A+=1){var R=T.charCodeAt(A);w.push(R&255)}return w}},n.stringToBytes=n.stringToBytesFuncs.default,n.createStringToBytes=function(T,w){var A=(function(){for(var v=E(T),_=function(){var tt=v.read();if(tt==-1)throw"eof";return tt},S=0,y={};;){var D=v.read();if(D==-1)break;var I=_(),U=_(),H=_(),$=String.fromCharCode(D<<8|I),V=U<<8|H;y[$]=V,S+=1}if(S!=w)throw S+" != "+w;return y})(),R=63;return function(v){for(var _=[],S=0;S<v.length;S+=1){var y=v.charCodeAt(S);if(y<128)_.push(y);else{var D=A[v.charAt(S)];typeof D=="number"?(D&255)==D?_.push(D):(_.push(D>>>8),_.push(D&255)):_.push(R)}}return _}};var r={MODE_NUMBER:1,MODE_ALPHA_NUM:2,MODE_8BIT_BYTE:4,MODE_KANJI:8},s={L:1,M:0,Q:3,H:2},a={PATTERN000:0,PATTERN001:1,PATTERN010:2,PATTERN011:3,PATTERN100:4,PATTERN101:5,PATTERN110:6,PATTERN111:7},o=(function(){var T=[[],[6,18],[6,22],[6,26],[6,30],[6,34],[6,22,38],[6,24,42],[6,26,46],[6,28,50],[6,30,54],[6,32,58],[6,34,62],[6,26,46,66],[6,26,48,70],[6,26,50,74],[6,30,54,78],[6,30,56,82],[6,30,58,86],[6,34,62,90],[6,28,50,72,94],[6,26,50,74,98],[6,30,54,78,102],[6,28,54,80,106],[6,32,58,84,110],[6,30,58,86,114],[6,34,62,90,118],[6,26,50,74,98,122],[6,30,54,78,102,126],[6,26,52,78,104,130],[6,30,56,82,108,134],[6,34,60,86,112,138],[6,30,58,86,114,142],[6,34,62,90,118,146],[6,30,54,78,102,126,150],[6,24,50,76,102,128,154],[6,28,54,80,106,132,158],[6,32,58,84,110,136,162],[6,26,54,82,110,138,166],[6,30,58,86,114,142,170]],w=1335,A=7973,R=21522,v={},_=function(S){for(var y=0;S!=0;)y+=1,S>>>=1;return y};return v.getBCHTypeInfo=function(S){for(var y=S<<10;_(y)-_(w)>=0;)y^=w<<_(y)-_(w);return(S<<10|y)^R},v.getBCHTypeNumber=function(S){for(var y=S<<12;_(y)-_(A)>=0;)y^=A<<_(y)-_(A);return S<<12|y},v.getPatternPosition=function(S){return T[S-1]},v.getMaskFunction=function(S){switch(S){case a.PATTERN000:return function(y,D){return(y+D)%2==0};case a.PATTERN001:return function(y,D){return y%2==0};case a.PATTERN010:return function(y,D){return D%3==0};case a.PATTERN011:return function(y,D){return(y+D)%3==0};case a.PATTERN100:return function(y,D){return(Math.floor(y/2)+Math.floor(D/3))%2==0};case a.PATTERN101:return function(y,D){return y*D%2+y*D%3==0};case a.PATTERN110:return function(y,D){return(y*D%2+y*D%3)%2==0};case a.PATTERN111:return function(y,D){return(y*D%3+(y+D)%2)%2==0};default:throw"bad maskPattern:"+S}},v.getErrorCorrectPolynomial=function(S){for(var y=l([1],0),D=0;D<S;D+=1)y=y.multiply(l([1,c.gexp(D)],0));return y},v.getLengthInBits=function(S,y){if(1<=y&&y<10)switch(S){case r.MODE_NUMBER:return 10;case r.MODE_ALPHA_NUM:return 9;case r.MODE_8BIT_BYTE:return 8;case r.MODE_KANJI:return 8;default:throw"mode:"+S}else if(y<27)switch(S){case r.MODE_NUMBER:return 12;case r.MODE_ALPHA_NUM:return 11;case r.MODE_8BIT_BYTE:return 16;case r.MODE_KANJI:return 10;default:throw"mode:"+S}else if(y<41)switch(S){case r.MODE_NUMBER:return 14;case r.MODE_ALPHA_NUM:return 13;case r.MODE_8BIT_BYTE:return 16;case r.MODE_KANJI:return 12;default:throw"mode:"+S}else throw"type:"+y},v.getLostPoint=function(S){for(var y=S.getModuleCount(),D=0,I=0;I<y;I+=1)for(var U=0;U<y;U+=1){for(var H=0,$=S.isDark(I,U),V=-1;V<=1;V+=1)if(!(I+V<0||y<=I+V))for(var tt=-1;tt<=1;tt+=1)U+tt<0||y<=U+tt||V==0&&tt==0||$==S.isDark(I+V,U+tt)&&(H+=1);H>5&&(D+=3+H-5)}for(var I=0;I<y-1;I+=1)for(var U=0;U<y-1;U+=1){var st=0;S.isDark(I,U)&&(st+=1),S.isDark(I+1,U)&&(st+=1),S.isDark(I,U+1)&&(st+=1),S.isDark(I+1,U+1)&&(st+=1),(st==0||st==4)&&(D+=3)}for(var I=0;I<y;I+=1)for(var U=0;U<y-6;U+=1)S.isDark(I,U)&&!S.isDark(I,U+1)&&S.isDark(I,U+2)&&S.isDark(I,U+3)&&S.isDark(I,U+4)&&!S.isDark(I,U+5)&&S.isDark(I,U+6)&&(D+=40);for(var U=0;U<y;U+=1)for(var I=0;I<y-6;I+=1)S.isDark(I,U)&&!S.isDark(I+1,U)&&S.isDark(I+2,U)&&S.isDark(I+3,U)&&S.isDark(I+4,U)&&!S.isDark(I+5,U)&&S.isDark(I+6,U)&&(D+=40);for(var ct=0,U=0;U<y;U+=1)for(var I=0;I<y;I+=1)S.isDark(I,U)&&(ct+=1);var ft=Math.abs(100*ct/y/y-50)/5;return D+=ft*10,D},v})(),c=(function(){for(var T=new Array(256),w=new Array(256),A=0;A<8;A+=1)T[A]=1<<A;for(var A=8;A<256;A+=1)T[A]=T[A-4]^T[A-5]^T[A-6]^T[A-8];for(var A=0;A<255;A+=1)w[T[A]]=A;var R={};return R.glog=function(v){if(v<1)throw"glog("+v+")";return w[v]},R.gexp=function(v){for(;v<0;)v+=255;for(;v>=256;)v-=255;return T[v]},R})();function l(T,w){if(typeof T.length>"u")throw T.length+"/"+w;var A=(function(){for(var v=0;v<T.length&&T[v]==0;)v+=1;for(var _=new Array(T.length-v+w),S=0;S<T.length-v;S+=1)_[S]=T[S+v];return _})(),R={};return R.getAt=function(v){return A[v]},R.getLength=function(){return A.length},R.multiply=function(v){for(var _=new Array(R.getLength()+v.getLength()-1),S=0;S<R.getLength();S+=1)for(var y=0;y<v.getLength();y+=1)_[S+y]^=c.gexp(c.glog(R.getAt(S))+c.glog(v.getAt(y)));return l(_,0)},R.mod=function(v){if(R.getLength()-v.getLength()<0)return R;for(var _=c.glog(R.getAt(0))-c.glog(v.getAt(0)),S=new Array(R.getLength()),y=0;y<R.getLength();y+=1)S[y]=R.getAt(y);for(var y=0;y<v.getLength();y+=1)S[y]^=c.gexp(c.glog(v.getAt(y))+_);return l(S,0).mod(v)},R}var h=(function(){var T=[[1,26,19],[1,26,16],[1,26,13],[1,26,9],[1,44,34],[1,44,28],[1,44,22],[1,44,16],[1,70,55],[1,70,44],[2,35,17],[2,35,13],[1,100,80],[2,50,32],[2,50,24],[4,25,9],[1,134,108],[2,67,43],[2,33,15,2,34,16],[2,33,11,2,34,12],[2,86,68],[4,43,27],[4,43,19],[4,43,15],[2,98,78],[4,49,31],[2,32,14,4,33,15],[4,39,13,1,40,14],[2,121,97],[2,60,38,2,61,39],[4,40,18,2,41,19],[4,40,14,2,41,15],[2,146,116],[3,58,36,2,59,37],[4,36,16,4,37,17],[4,36,12,4,37,13],[2,86,68,2,87,69],[4,69,43,1,70,44],[6,43,19,2,44,20],[6,43,15,2,44,16],[4,101,81],[1,80,50,4,81,51],[4,50,22,4,51,23],[3,36,12,8,37,13],[2,116,92,2,117,93],[6,58,36,2,59,37],[4,46,20,6,47,21],[7,42,14,4,43,15],[4,133,107],[8,59,37,1,60,38],[8,44,20,4,45,21],[12,33,11,4,34,12],[3,145,115,1,146,116],[4,64,40,5,65,41],[11,36,16,5,37,17],[11,36,12,5,37,13],[5,109,87,1,110,88],[5,65,41,5,66,42],[5,54,24,7,55,25],[11,36,12,7,37,13],[5,122,98,1,123,99],[7,73,45,3,74,46],[15,43,19,2,44,20],[3,45,15,13,46,16],[1,135,107,5,136,108],[10,74,46,1,75,47],[1,50,22,15,51,23],[2,42,14,17,43,15],[5,150,120,1,151,121],[9,69,43,4,70,44],[17,50,22,1,51,23],[2,42,14,19,43,15],[3,141,113,4,142,114],[3,70,44,11,71,45],[17,47,21,4,48,22],[9,39,13,16,40,14],[3,135,107,5,136,108],[3,67,41,13,68,42],[15,54,24,5,55,25],[15,43,15,10,44,16],[4,144,116,4,145,117],[17,68,42],[17,50,22,6,51,23],[19,46,16,6,47,17],[2,139,111,7,140,112],[17,74,46],[7,54,24,16,55,25],[34,37,13],[4,151,121,5,152,122],[4,75,47,14,76,48],[11,54,24,14,55,25],[16,45,15,14,46,16],[6,147,117,4,148,118],[6,73,45,14,74,46],[11,54,24,16,55,25],[30,46,16,2,47,17],[8,132,106,4,133,107],[8,75,47,13,76,48],[7,54,24,22,55,25],[22,45,15,13,46,16],[10,142,114,2,143,115],[19,74,46,4,75,47],[28,50,22,6,51,23],[33,46,16,4,47,17],[8,152,122,4,153,123],[22,73,45,3,74,46],[8,53,23,26,54,24],[12,45,15,28,46,16],[3,147,117,10,148,118],[3,73,45,23,74,46],[4,54,24,31,55,25],[11,45,15,31,46,16],[7,146,116,7,147,117],[21,73,45,7,74,46],[1,53,23,37,54,24],[19,45,15,26,46,16],[5,145,115,10,146,116],[19,75,47,10,76,48],[15,54,24,25,55,25],[23,45,15,25,46,16],[13,145,115,3,146,116],[2,74,46,29,75,47],[42,54,24,1,55,25],[23,45,15,28,46,16],[17,145,115],[10,74,46,23,75,47],[10,54,24,35,55,25],[19,45,15,35,46,16],[17,145,115,1,146,116],[14,74,46,21,75,47],[29,54,24,19,55,25],[11,45,15,46,46,16],[13,145,115,6,146,116],[14,74,46,23,75,47],[44,54,24,7,55,25],[59,46,16,1,47,17],[12,151,121,7,152,122],[12,75,47,26,76,48],[39,54,24,14,55,25],[22,45,15,41,46,16],[6,151,121,14,152,122],[6,75,47,34,76,48],[46,54,24,10,55,25],[2,45,15,64,46,16],[17,152,122,4,153,123],[29,74,46,14,75,47],[49,54,24,10,55,25],[24,45,15,46,46,16],[4,152,122,18,153,123],[13,74,46,32,75,47],[48,54,24,14,55,25],[42,45,15,32,46,16],[20,147,117,4,148,118],[40,75,47,7,76,48],[43,54,24,22,55,25],[10,45,15,67,46,16],[19,148,118,6,149,119],[18,75,47,31,76,48],[34,54,24,34,55,25],[20,45,15,61,46,16]],w=function(v,_){var S={};return S.totalCount=v,S.dataCount=_,S},A={},R=function(v,_){switch(_){case s.L:return T[(v-1)*4+0];case s.M:return T[(v-1)*4+1];case s.Q:return T[(v-1)*4+2];case s.H:return T[(v-1)*4+3];default:return}};return A.getRSBlocks=function(v,_){var S=R(v,_);if(typeof S>"u")throw"bad rs block @ typeNumber:"+v+"/errorCorrectionLevel:"+_;for(var y=S.length/3,D=[],I=0;I<y;I+=1)for(var U=S[I*3+0],H=S[I*3+1],$=S[I*3+2],V=0;V<U;V+=1)D.push(w(H,$));return D},A})(),u=function(){var T=[],w=0,A={};return A.getBuffer=function(){return T},A.getAt=function(R){var v=Math.floor(R/8);return(T[v]>>>7-R%8&1)==1},A.put=function(R,v){for(var _=0;_<v;_+=1)A.putBit((R>>>v-_-1&1)==1)},A.getLengthInBits=function(){return w},A.putBit=function(R){var v=Math.floor(w/8);T.length<=v&&T.push(0),R&&(T[v]|=128>>>w%8),w+=1},A},d=function(T){var w=r.MODE_NUMBER,A=T,R={};R.getMode=function(){return w},R.getLength=function(S){return A.length},R.write=function(S){for(var y=A,D=0;D+2<y.length;)S.put(v(y.substring(D,D+3)),10),D+=3;D<y.length&&(y.length-D==1?S.put(v(y.substring(D,D+1)),4):y.length-D==2&&S.put(v(y.substring(D,D+2)),7))};var v=function(S){for(var y=0,D=0;D<S.length;D+=1)y=y*10+_(S.charAt(D));return y},_=function(S){if("0"<=S&&S<="9")return S.charCodeAt(0)-48;throw"illegal char :"+S};return R},f=function(T){var w=r.MODE_ALPHA_NUM,A=T,R={};R.getMode=function(){return w},R.getLength=function(_){return A.length},R.write=function(_){for(var S=A,y=0;y+1<S.length;)_.put(v(S.charAt(y))*45+v(S.charAt(y+1)),11),y+=2;y<S.length&&_.put(v(S.charAt(y)),6)};var v=function(_){if("0"<=_&&_<="9")return _.charCodeAt(0)-48;if("A"<=_&&_<="Z")return _.charCodeAt(0)-65+10;switch(_){case" ":return 36;case"$":return 37;case"%":return 38;case"*":return 39;case"+":return 40;case"-":return 41;case".":return 42;case"/":return 43;case":":return 44;default:throw"illegal char :"+_}};return R},m=function(T){var w=r.MODE_8BIT_BYTE,A=n.stringToBytes(T),R={};return R.getMode=function(){return w},R.getLength=function(v){return A.length},R.write=function(v){for(var _=0;_<A.length;_+=1)v.put(A[_],8)},R},x=function(T){var w=r.MODE_KANJI,A=n.stringToBytesFuncs.SJIS;if(!A)throw"sjis not supported.";(function(_,S){var y=A(_);if(y.length!=2||(y[0]<<8|y[1])!=S)throw"sjis not supported."})("友",38726);var R=A(T),v={};return v.getMode=function(){return w},v.getLength=function(_){return~~(R.length/2)},v.write=function(_){for(var S=R,y=0;y+1<S.length;){var D=(255&S[y])<<8|255&S[y+1];if(33088<=D&&D<=40956)D-=33088;else if(57408<=D&&D<=60351)D-=49472;else throw"illegal char at "+(y+1)+"/"+D;D=(D>>>8&255)*192+(D&255),_.put(D,13),y+=2}if(y<S.length)throw"illegal char at "+(y+1)},v},g=function(){var T=[],w={};return w.writeByte=function(A){T.push(A&255)},w.writeShort=function(A){w.writeByte(A),w.writeByte(A>>>8)},w.writeBytes=function(A,R,v){R=R||0,v=v||A.length;for(var _=0;_<v;_+=1)w.writeByte(A[_+R])},w.writeString=function(A){for(var R=0;R<A.length;R+=1)w.writeByte(A.charCodeAt(R))},w.toByteArray=function(){return T},w.toString=function(){var A="";A+="[";for(var R=0;R<T.length;R+=1)R>0&&(A+=","),A+=T[R];return A+="]",A},w},p=function(){var T=0,w=0,A=0,R="",v={},_=function(y){R+=String.fromCharCode(S(y&63))},S=function(y){if(!(y<0)){if(y<26)return 65+y;if(y<52)return 97+(y-26);if(y<62)return 48+(y-52);if(y==62)return 43;if(y==63)return 47}throw"n:"+y};return v.writeByte=function(y){for(T=T<<8|y&255,w+=8,A+=1;w>=6;)_(T>>>w-6),w-=6},v.flush=function(){if(w>0&&(_(T<<6-w),T=0,w=0),A%3!=0)for(var y=3-A%3,D=0;D<y;D+=1)R+="="},v.toString=function(){return R},v},E=function(T){var w=T,A=0,R=0,v=0,_={};_.read=function(){for(;v<8;){if(A>=w.length){if(v==0)return-1;throw"unexpected end of file./"+v}var y=w.charAt(A);if(A+=1,y=="=")return v=0,-1;if(y.match(/^\s$/))continue;R=R<<6|S(y.charCodeAt(0)),v+=6}var D=R>>>v-8&255;return v-=8,D};var S=function(y){if(65<=y&&y<=90)return y-65;if(97<=y&&y<=122)return y-97+26;if(48<=y&&y<=57)return y-48+52;if(y==43)return 62;if(y==47)return 63;throw"c:"+y};return _},b=function(T,w){var A=T,R=w,v=new Array(T*w),_={};_.setPixel=function(I,U,H){v[U*A+I]=H},_.write=function(I){I.writeString("GIF87a"),I.writeShort(A),I.writeShort(R),I.writeByte(128),I.writeByte(0),I.writeByte(0),I.writeByte(0),I.writeByte(0),I.writeByte(0),I.writeByte(255),I.writeByte(255),I.writeByte(255),I.writeString(","),I.writeShort(0),I.writeShort(0),I.writeShort(A),I.writeShort(R),I.writeByte(0);var U=2,H=y(U);I.writeByte(U);for(var $=0;H.length-$>255;)I.writeByte(255),I.writeBytes(H,$,255),$+=255;I.writeByte(H.length-$),I.writeBytes(H,$,H.length-$),I.writeByte(0),I.writeString(";")};var S=function(I){var U=I,H=0,$=0,V={};return V.write=function(tt,st){if(tt>>>st)throw"length over";for(;H+st>=8;)U.writeByte(255&(tt<<H|$)),st-=8-H,tt>>>=8-H,$=0,H=0;$=tt<<H|$,H=H+st},V.flush=function(){H>0&&U.writeByte($)},V},y=function(I){for(var U=1<<I,H=(1<<I)+1,$=I+1,V=D(),tt=0;tt<U;tt+=1)V.add(String.fromCharCode(tt));V.add(String.fromCharCode(U)),V.add(String.fromCharCode(H));var st=g(),ct=S(st);ct.write(U,$);var ft=0,Ct=String.fromCharCode(v[ft]);for(ft+=1;ft<v.length;){var zt=String.fromCharCode(v[ft]);ft+=1,V.contains(Ct+zt)?Ct=Ct+zt:(ct.write(V.indexOf(Ct),$),V.size()<4095&&(V.size()==1<<$&&($+=1),V.add(Ct+zt)),Ct=zt)}return ct.write(V.indexOf(Ct),$),ct.write(H,$),ct.flush(),st.toByteArray()},D=function(){var I={},U=0,H={};return H.add=function($){if(H.contains($))throw"dup key:"+$;I[$]=U,U+=1},H.size=function(){return U},H.indexOf=function($){return I[$]},H.contains=function($){return typeof I[$]<"u"},H};return _},M=function(T,w,A){for(var R=b(T,w),v=0;v<w;v+=1)for(var _=0;_<T;_+=1)R.setPixel(_,v,A(_,v));var S=g();R.write(S);for(var y=p(),D=S.toByteArray(),I=0;I<D.length;I+=1)y.writeByte(D[I]);return y.flush(),"data:image/gif;base64,"+y};return n})();(function(){e.stringToBytesFuncs["UTF-8"]=function(n){function r(s){for(var a=[],o=0;o<s.length;o++){var c=s.charCodeAt(o);c<128?a.push(c):c<2048?a.push(192|c>>6,128|c&63):c<55296||c>=57344?a.push(224|c>>12,128|c>>6&63,128|c&63):(o++,c=65536+((c&1023)<<10|s.charCodeAt(o)&1023),a.push(240|c>>18,128|c>>12&63,128|c>>6&63,128|c&63))}return a}return r(n)}})(),(function(n){i.exports=n()})(function(){return e})})(ao)),ao.exports}var bx=Mx();const Sx=xx(bx);function Qr(){return location.origin+location.pathname.replace(/index\.html$/,"")}function yx(i){const t=Sx(0,"M");return t.addData(i),t.make(),t.createSvgTag({cellSize:8,margin:2,scalable:!0})}async function Ex(i,t){const e=new File([i],t,{type:i.type});if(navigator.canShare?.({files:[e]}))try{return await navigator.share({files:[e],title:"costuma 2026"}),"shared"}catch(r){if(r.name==="AbortError")return"cancelled"}return Wu(i,t),"saved"}function Wu(i,t){const e=document.createElement("a");e.href=URL.createObjectURL(i),e.download=t,document.body.appendChild(e),e.click(),e.remove(),setTimeout(()=>URL.revokeObjectURL(e.href),3e4)}function wx(){const i=window.MediaRecorder;if(i)return["video/mp4;codecs=avc1","video/mp4","video/webm;codecs=vp9","video/webm;codecs=vp8","video/webm"].find(t=>i.isTypeSupported(t))}const Qt=i=>document.getElementById(i),Tx="./",qe=new URLSearchParams(location.search),Pc=qe.get("test")==="1",ki=Number(qe.get("synth")??0),yt=vx();qe.get("c")&&(yt.costume=qe.get("c"));cn.some(i=>i.id===yt.costume)||(yt.costume=cn[0].id);qe.get("people")&&(yt.people=Number(qe.get("people")));const Oi=()=>_x(yt),Re=Qt("video"),cs=Qt("stage"),gr=Qt("overlay"),Ne=gr.getContext("2d"),ee=new ox(cs);ee.opts.size=yt.size;ee.opts.shadows=yt.shadows;ee.opts.envLight=yt.envLight;const On=new mx(ee.bgUniforms,Vu),Hi=new gx;(qe.get("scene")==="party"||qe.get("scene")==="costume")&&(yt.scene=qe.get("scene"));qe.get("fx")&&(yt.effect=qe.get("fx"));qe.get("pc")&&(yt.partyCostumes=qe.get("pc")==="1");On.preset=ri.find(i=>i.id===yt.effect)??ri[0];const pa=new hf(Re,qe.get("facing")??void 0);let An=null;const wn=new xf;let fs=!1;const ma=new Map,la=new Map;let Xu=0;function ha(i){const t=ma.get(i);if(t)return t;if(yt.mode==="one")return yt.costume;let e=la.get(i);if(!e){const n=cn.findIndex(r=>r.id===yt.costume);e=cn[(n+Xu++)%cn.length].id,la.set(i,e)}return e}const oo=new Set;function Dc(i,t=!1){ee.hasTemplate(i)||oo.has(i)||(oo.add(i),t||Te(`Dressing up as ${Xi(i).name}…`,1800),requestAnimationFrame(()=>setTimeout(()=>{try{ee.template(i)}catch(e){console.error("build failed",i,e),Te(`${Xi(i).name} failed to build`)}oo.delete(i)},20)))}let Rh=0;function Te(i,t=1400){const e=Qt("toast");e.textContent=i,e.classList.add("on"),clearTimeout(Rh),Rh=window.setTimeout(()=>e.classList.remove("on"),t)}const Ax=i=>{const t=Qt("hint");t.textContent=i,t.classList.toggle("on",!!i)},qu=i=>`${Tx}thumbs/${i}.png`;function Yu(){const i=Qt("picker");if(i.innerHTML="",yt.scene==="party"){for(const e of ri){const n=document.createElement("button");n.className="card fx",n.dataset.id=e.id,n.setAttribute("role","option"),n.innerHTML='<div class="thumb"></div><div class="name"></div>',n.querySelector(".thumb").style.background=e.swatch,n.querySelector(".name").textContent=e.name,n.onclick=()=>Ic(e.id),i.appendChild(n)}ls();return}const t=(e,n,r="")=>{const s=document.createElement("button");s.className=`card ${r}`,s.dataset.id=e,s.setAttribute("role","option"),s.innerHTML='<div class="thumb"></div><div class="name"></div>',s.querySelector(".name").textContent=n;const a=s.querySelector(".thumb");if(e==="mix")a.textContent="MIX";else{const o=new Image;o.alt="",o.onerror=()=>{o.remove(),a.textContent=n.slice(0,1)},o.src=qu(e),a.appendChild(o)}s.onclick=()=>$u(e),i.appendChild(s)};t("mix","Mix","mix");for(const e of cn)t(e.id,e.name);ls()}function ls(){for(const i of Qt("picker").querySelectorAll(".card")){const t=yt.scene==="party"?i.dataset.id===yt.effect:yt.mode==="mix"?i.dataset.id==="mix":i.dataset.id===yt.costume;i.classList.toggle("on",t),i.setAttribute("aria-selected",String(t)),t&&i.scrollIntoView({behavior:"smooth",inline:"center",block:"nearest"})}}function $u(i){ma.clear(),i==="mix"?(yt.mode="mix",la.clear(),Xu=0,Te("Mix: everyone gets their own")):(yt.mode="one",yt.costume=i,Dc(i),ee.hasTemplate(i)&&Te(Xi(i).name,900)),Oi(),ls()}function Ic(i){const t=ri.find(e=>e.id===i)??ri[0];yt.effect=t.id,On.preset=t,Oi(),ls(),Te(t.name,800)}function ic(i){yt.scene=i,Oi(),ee.setBackground(i==="party"?On.material:null),An?.setOptions({masks:i==="party"});for(const t of document.querySelectorAll(".modes button")){const e=t.dataset.scene===i;t.classList.toggle("on",e),t.setAttribute("aria-selected",String(e))}Yu()}function Uc(i){Qt(i).classList.remove("hidden")}for(const i of document.querySelectorAll(".modal"))i.addEventListener("click",t=>{(t.target===i||t.target.closest("[data-close]"))&&i.classList.add("hidden")});function Ch(){const i=Qr();Qt("qr-code").innerHTML=yx(i),Qt("qr-url").textContent=i,Uc("qr")}Qt("btn-copy").onclick=async()=>{try{await navigator.clipboard.writeText(Qr()),Te("Link copied")}catch{Te("Could not copy — long-press the link")}};Qt("btn-share-link").onclick=async()=>{if(navigator.share)try{await navigator.share({title:"costuma 2026",text:"Be a 3D costume:",url:Qr()})}catch{}else try{await navigator.clipboard.writeText(Qr()),Te("Link copied")}catch{Te(Qr())}};function Rx(){const i=Qt("settings-body");i.innerHTML="";const t=(s,a,o)=>{const c=document.createElement("div");c.className="set";const l=document.createElement("label"),h=document.createElement("span");if(h.textContent=s,a){const u=document.createElement("small");u.textContent=a,h.appendChild(u)}l.append(h,o),c.appendChild(l),i.appendChild(c)},e=(s,a,o)=>{const c=document.createElement("div");c.className="seg";for(const[l,h]of s){const u=document.createElement("button");u.textContent=h,u.classList.toggle("on",a()===l),u.onclick=()=>{o(l),Oi();for(const d of c.children)d.classList.remove("on");u.classList.add("on")},c.appendChild(u)}return c},n=(s,a)=>{const o=document.createElement("input");return o.type="checkbox",o.className="switch",o.checked=s(),o.onchange=()=>{a(o.checked),Oi()},o},r=(s,a,o,c,l)=>{const h=document.createElement("input");return h.type="range",h.min=String(s),h.max=String(a),h.step=String(o),h.value=String(c()),h.oninput=()=>{l(Number(h.value)),Oi()},h};t(yt.scene==="party"?"Subjects":"People",yt.scene==="party"?"How many people to cut out (the nearest)":"How many to dress at once",e([[1,"1"],[2,"2"],[3,"3"],[4,"4"]],()=>yt.people,s=>{yt.people=s,An?.setOptions({numPoses:s})})),t("Costume size","Bigger hides more of the person",r(.8,1.5,.01,()=>yt.size,s=>{yt.size=s,ee.opts.size=s})),t("Pose model","Accurate is steadier, slower to load and run",e([["lite","Fast"],["full","Accurate"]],()=>yt.model,s=>{yt.model=s,Ux()})),t("Light from the camera","The costume is lit by the room it stands in",n(()=>yt.envLight,s=>{yt.envLight=s,ee.opts.envLight=s})),t("Shadows","Off is faster on older phones",n(()=>yt.shadows,s=>{yt.shadows=s,ee.opts.shadows=s})),t("Lens","If costumes look too flat or too deep",r(.55,1.3,.01,()=>yt.lens,s=>{yt.lens=s})),t("React to the music","Listens through the microphone for the beat; clips record the sound",n(()=>yt.music,s=>{yt.music=s,s?Hi.start().then(()=>Te("Listening for the beat",1200)).catch(()=>{yt.music=!1,Oi(),Te("No microphone")}):Hi.stop()})),t("Costumes in party mode","Wear your costume while the room parties",n(()=>yt.partyCostumes,s=>{yt.partyCostumes=s})),t("Show the skeleton","What the pose tracker sees",n(()=>yt.debug,s=>{yt.debug=s}))}let rc=!1,zi=null;function ju(i,t){zi={blob:i,name:t};const e=Qt("preview-media");e.innerHTML="";const n=URL.createObjectURL(i);if(i.type.startsWith("video")){const r=document.createElement("video");r.src=n,r.controls=!0,r.playsInline=!0,r.loop=!0,r.muted=!0,r.play().catch(()=>{}),e.appendChild(r)}else{const r=new Image;r.src=n,e.appendChild(r)}Uc("preview")}Qt("btn-share").onclick=async()=>{zi&&await Ex(zi.blob,zi.name)==="saved"&&Te("Saved")};Qt("btn-save").onclick=()=>{zi&&(Wu(zi.blob,zi.name),Te("Saved"))};const Zu=()=>new Date().toISOString().slice(0,19).replace(/[:T]/g,"-");let js=null,Lh=0;function Cx(){const i=Qt("btn-rec");if(js){js.stop();return}const t=wx(),e=cs.captureStream;if(!t||!e){Te("Recording is not supported in this browser");return}const n=[],r=e.call(cs,30);for(const a of Hi.stream?.getAudioTracks()??[])r.addTrack(a);const s=new MediaRecorder(r,{mimeType:t,videoBitsPerSecond:8e6});s.ondataavailable=a=>{a.data.size&&n.push(a.data)},s.onstop=()=>{clearTimeout(Lh),js=null,i.classList.remove("on"),i.innerHTML=Ii.rec;const a=t.split(";")[0];ju(new Blob(n,{type:a}),`costuma-${Zu()}.${a.includes("mp4")?"mp4":"webm"}`)},s.start(250),js=s,i.classList.add("on"),i.innerHTML=Ii.stop,Lh=window.setTimeout(()=>s.state==="recording"&&s.stop(),2e4),Te("Recording — tap to stop",1200)}function Ku(i){const t=ee.cover,e=i.image,n=(e[z.shL].x+e[z.shR].x+e[z.hipL].x+e[z.hipR].x)/4,r=(e[z.shL].y+e[z.shR].y+e[z.hipL].y+e[z.hipR].y)/4;let s=(n*t.vw-t.ox)*t.s;const a=(r*t.vh-t.oy)*t.s;return t.mirror&&(s=t.cw-s),{x:s,y:a}}cs.addEventListener("click",i=>{if(!fs)return;if(yt.scene==="party"&&!yt.partyCostumes){const a=ri.findIndex(o=>o.id===yt.effect);Ic(ri[(a+1)%ri.length].id);return}let t=null,e=1/0;for(const a of wn.tracks){if(a.lost)continue;const o=Ku(a),c=Math.hypot(o.x-i.clientX,o.y-i.clientY);c<e&&(e=c,t=a)}if(!t||e>Math.max(innerWidth,innerHeight)*.3)return;const n=ha(t.id),r=cn.findIndex(a=>a.id===n),s=cn[(r+1)%cn.length].id;ma.set(t.id,s),Dc(s),Te(Xi(s).name,900)});let sc=0,Ph=-1,ac=0,oc=performance.now(),Dh=performance.now();const vr=document.createElement("canvas"),Lx=vr.getContext("2d");function Px(){if(yt.scene!=="party")return Re;const i=Re.videoWidth||720,t=Re.videoHeight||1280,e=480/Math.max(i,t),n=Math.round(i*e),r=Math.round(t*e);return(vr.width!==n||vr.height!==r)&&(vr.width=n,vr.height=r),Lx.drawImage(Re,0,0,n,r),vr}let Nc=0,co=performance.now(),lo=0;function Ju(){return gf(Re.videoWidth||720,Re.videoHeight||1280,yt.lens)}function Qu(i){if(requestAnimationFrame(Qu),!fs)return;sc++;const t=Ju();ee.layout(t,pa.mirrored&&!ki);let e=null;if(ki){if(e=uv(ki,(i-oc)/1e3*(Pc?0:1)+Number(qe.get("t")??0),t),yt.scene==="party"){const o=t.w/t.h,c=o>=1?240:Math.round(240*o),l=o>=1?Math.round(240/o):240;for(const h of e)h.mask=fv(h,c,l,o)}}else if(An&&Re.readyState>=2&&Re.currentTime!==Ph){Ph=Re.currentTime;try{e=An.detect(Px(),i)}catch(o){console.error(o)}}if(e&&wn.update(e.slice(0,yt.people),i,t),yt.scene==="costume"||yt.partyCostumes)for(const o of wn.tracks)Dc(ha(o.id),!0);const n=(i-oc)/1e3,r=Math.min(.25,(i-Dh)/1e3);Dh=i;const s=yt.scene==="costume"||yt.partyCostumes;ee.pyramid=yt.scene==="party"&&yt.partyCostumes&&On.preset.id==="pyramid",On.clones=!ee.pyramid,ee.stageLights(yt.scene==="party",n,Hi.env),ee.sync(s?wn.tracks:[],ha,n),Hi.update(r,i),yt.scene==="party"&&(On.subjects=yt.people,On.beat=Hi.env,On.update(wn.tracks,r,n,t.w/t.h),On.render(ee.renderer,t.w,t.h)),ee.render(Re,t,sc),rc&&(rc=!1,cs.toBlob(o=>o&&ju(o,`costuma-${Zu()}.jpg`),"image/jpeg",.92)),wn.tracks.filter(o=>!o.lost).length&&(ac=i),Ax(i-ac>2500?"Step back until your head and hips are in view":""),Ix(),lo++,i-co>1e3&&(Nc=lo*1e3/(i-co),lo=0,co=i,tf(),Dx())}let Zs=0,Ih=!1;function Dx(){if(!(Pc||!fs||wn.tracks.length===0)&&(Zs=Nc<22?Zs+1:0,!(Zs<3))){if(Zs=0,ee.opts.pixelRatio>1.01)ee.opts.pixelRatio=Math.max(1,ee.opts.pixelRatio-.25);else if(ee.opts.shadows)ee.opts.shadows=!1;else return;Ih||(Ih=!0,Te("Lowering quality to keep up",1500))}}function Ix(){const i=gr.clientWidth,t=gr.clientHeight,e=Math.min(devicePixelRatio||1,2);if(gr.width!==Math.round(i*e)&&(gr.width=Math.round(i*e),gr.height=Math.round(t*e)),Ne.setTransform(e,0,0,e,0,0),Ne.clearRect(0,0,i,t),!yt.debug)return;const n=ee.cover,r=s=>{let a=(s.x*n.vw-n.ox)*n.s;return n.mirror&&(a=n.cw-a),[a,(s.y*n.vh-n.oy)*n.s]};for(const s of wn.tracks){Ne.globalAlpha=s.presence,Ne.strokeStyle="#7dfcff",Ne.lineWidth=3;for(const[o,c]of mf){const l=s.image[o],h=s.image[c];if(Math.min(l.v,h.v)<.4)continue;const[u,d]=r(l),[f,m]=r(h);Ne.beginPath(),Ne.moveTo(u,d),Ne.lineTo(f,m),Ne.stroke()}Ne.fillStyle="#ff8a1f";for(const o of s.image){if(o.v<.4)continue;const[c,l]=r(o);Ne.beginPath(),Ne.arc(c,l,4,0,Math.PI*2),Ne.fill()}const a=Ku(s);Ne.fillStyle="#fff",Ne.font="600 14px system-ui",Ne.fillText(`#${s.id} ${Xi(ha(s.id)).name} · ${(-s.T.z).toFixed(1)} m`,a.x-40,a.y)}Ne.globalAlpha=1}function tf(){const i=Qt("readout");if(!i||Qt("settings").classList.contains("hidden"))return;const t=Ju();i.textContent=["build 194534a · 2026-10-31 18:43Z",`${Nc.toFixed(0)} fps · pose ${An?.inferMs.toFixed(1)??"–"} ms (${An?.delegate??"–"}, ${yt.model})`,`video ${Re.videoWidth}×${Re.videoHeight} · f ${t.f.toFixed(0)} px · ${pa.facing}`,`people ${wn.tracks.filter(e=>!e.lost).length} · dressed ${ee.count}`,`pixels ×${ee.opts.pixelRatio.toFixed(2)} · shadows ${ee.opts.shadows?"on":"off"}`,`light mean ${ee.light.mean.toFixed(3)} × ${ee.light.gain.toFixed(2)} · key share ${ee.light.share.toFixed(2)} · every ${mn.every} frames`].join(`
`)}async function Ux(){if(ki)return;const i=An,t=new Uh(yt.model,yt.people);t.masks=yt.scene==="party",await t.load(e=>Te(e,2500)),An=t,i?.close(),Te(yt.model==="full"?"Accurate pose model":"Fast pose model",1e3)}function Nx(){const i=document.createElement("canvas");i.width=720,i.height=1280;const t=i.getContext("2d"),e=()=>{const n=t.createLinearGradient(0,0,0,1280);n.addColorStop(0,"#5a4a63"),n.addColorStop(.62,"#3b3142"),n.addColorStop(.63,"#6b5440"),n.addColorStop(1,"#3a2c22"),t.fillStyle=n,t.fillRect(0,0,720,1280),t.fillStyle="#fff3d6",t.fillRect(40,220,170,330),t.fillStyle="#ffb35a",t.beginPath(),t.arc(600,180,46,0,Math.PI*2),t.fill()};return e(),setInterval(e,500),i.captureStream(30)}async function ho(){const i=Qt("start-status"),t=Qt("btn-start");t.disabled=!0;try{if(ki)Re.srcObject=Nx(),await Re.play().catch(()=>{}),Re.readyState<2&&await new Promise(e=>Re.addEventListener("loadeddata",e,{once:!0}));else{if(!navigator.mediaDevices?.getUserMedia)throw new Error(location.protocol!=="https:"?"The camera needs an https:// page.":"This browser has no camera access.");i.textContent="Asking for the camera…",await pa.open(),i.textContent="Loading the pose model…",An=new Uh(yt.model,yt.people),An.masks=yt.scene==="party",await An.load(e=>{i.textContent=e[0].toUpperCase()+e.slice(1)+"…"})}ee.setVideo(Re),i.textContent=`Dressing up as ${Xi(yt.costume).name}…`,await new Promise(e=>setTimeout(e,30)),ee.template(yt.mode==="one"?yt.costume:cn[0].id),Qt("start").classList.add("hidden"),Qt("hud").classList.remove("hidden"),ic(yt.scene),fs=!0,oc=performance.now(),ac=performance.now(),ls()}catch(e){console.error(e);const n=e;i.textContent=n.name==="NotAllowedError"?"Camera permission was refused. Allow it in the browser settings and try again.":`Could not start: ${n.message}`,t.disabled=!1}}function Fx(){Qt("btn-qr").innerHTML=Ii.qr,Qt("btn-flip").innerHTML=Ii.flip,Qt("btn-gear").innerHTML=Ii.gear,Qt("btn-snap").innerHTML=Ii.camera,Qt("btn-rec").innerHTML=Ii.rec,Qt("btn-start").onclick=()=>void ho(),Qt("btn-start-qr").onclick=Ch,Qt("btn-qr").onclick=Ch,Qt("btn-gear").onclick=()=>{Rx(),Uc("settings"),tf()},Qt("btn-flip").onclick=async()=>{if(!ki)try{await pa.flip(),ee.setVideo(Re),wn.clear(),ma.clear(),la.clear()}catch(e){Te(`Camera: ${e.message}`)}},Qt("btn-snap").onclick=()=>{rc=!0;const e=Qt("stage");e.style.filter="brightness(1.8)",setTimeout(()=>e.style.filter="",120)},Qt("btn-rec").onclick=Cx;for(const e of document.querySelectorAll(".modes button"))e.onclick=()=>ic(e.dataset.scene);const i=Qt("start-cast");for(const e of cn.slice(0,6)){const n=new Image;n.src=qu(e.id),n.alt=e.name,n.onerror=()=>n.remove(),i.appendChild(n)}Yu(),requestAnimationFrame(Qu);const t=window;t.__costuma={stage:ee,tracker:wn,settings:yt,start:ho,choose:$u,party:On,beat:Hi,setScene:ic,chooseEffect:Ic,get started(){return fs},get frame(){return sc},LIGHT_TUNE:mn},Pc&&ki&&ho()}Fx();
