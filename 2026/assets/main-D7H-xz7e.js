(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))i(s);new MutationObserver(s=>{for(const r of s)if(r.type==="childList")for(const a of r.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&i(a)}).observe(document,{childList:!0,subtree:!0});function e(s){const r={};return s.integrity&&(r.integrity=s.integrity),s.referrerPolicy&&(r.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?r.credentials="include":s.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function i(s){if(s.ep)return;s.ep=!0;const r=e(s);fetch(s.href,r)}})();const tc=()=>/iPad|iPhone|iPod/.test(navigator.userAgent)||navigator.platform==="MacIntel"&&navigator.maxTouchPoints>1,ox=()=>tc()||/Android|Mobile/i.test(navigator.userAgent);let cx=class{constructor(t,e){this.video=t,this.facing=e??(ox()?"environment":"user"),t.muted=!0,t.playsInline=!0,t.autoplay=!0,t.setAttribute("playsinline",""),t.setAttribute("muted","")}stream=null;facing;zoom=1;zoomRange=null;lenses=[];lens=0;async open(t=this.facing,e=1,i){const s=!!this.stream;this.stop(),s&&await new Promise(a=>setTimeout(a,100));const r={width:{ideal:1280},height:{ideal:720},frameRate:{ideal:30}};i&&!tc()?r.deviceId={exact:i}:r.facingMode=t,this.stream=await navigator.mediaDevices.getUserMedia({audio:!1,video:r}),this.facing=t,this.video.srcObject=this.stream,await this.video.play().catch(()=>{}),this.video.readyState<2&&await new Promise(a=>this.video.addEventListener("loadeddata",()=>a(),{once:!0})),await this.readLenses(),this.zoomRange&&e!==this.zoom&&await this.setZoom(e)}get track(){return this.stream?.getVideoTracks()[0]??null}async readLenses(){const t=this.track;if(this.zoomRange=null,this.zoom=1,this.lenses=[],this.lens=0,!t)return;const e=t.getCapabilities?.()??{};if(e.zoom&&e.zoom.max>e.zoom.min){this.zoomRange={min:e.zoom.min,max:e.zoom.max},this.zoom=t.getSettings().zoom??1;return}if(!tc())try{const i=this.facing==="environment"?/back|rear|environment/i:/front|user|face/i,s=(await navigator.mediaDevices.enumerateDevices()).filter(r=>r.kind==="videoinput"&&i.test(r.label));s.length>1&&(this.lenses=s.map(r=>({id:r.deviceId,label:r.label})),this.lens=Math.max(0,s.findIndex(r=>r.deviceId===t.getSettings().deviceId)))}catch{}}stops(){if(this.zoomRange){const{min:t,max:e}=this.zoomRange,i=[];t<.95&&i.push({zoom:t,label:String(Math.round(t*10)/10).replace(/^0/,"")});for(const s of[1,2,3,5])s>=t-.001&&s<=e+.001&&i.push({zoom:s,label:String(s)});return i.length>1?i:[]}return this.lenses.map((t,e)=>({zoom:-1-e,label:String(e+1)}))}async setZoom(t){const e=this.track;if(!e||!this.zoomRange)return this.zoom;t=Math.min(this.zoomRange.max,Math.max(this.zoomRange.min,t));try{await e.applyConstraints({advanced:[{zoom:t}]}),this.zoom=e.getSettings().zoom??t}catch{}return this.zoom}async nextLens(t=(this.lens+1)%Math.max(1,this.lenses.length)){const e=this.lenses[t];if(!e)return;const i=this.lenses;await this.open(this.facing,1,e.id),this.lenses=i,this.lens=t}async flip(t=1){await this.open(this.facing==="user"?"environment":"user",t)}get mirrored(){return this.facing==="user"}describe(){const t=this.track,e=this.zoomRange?`zoom ${this.zoom.toFixed(2)} of ${this.zoomRange.min}–${this.zoomRange.max}`:"no zoom",i=this.lenses.length?` · lenses ${this.lenses.map((s,r)=>r===this.lens?"["+s.label+"]":s.label).join(", ")}`:"";return`${e}${i}${t?.label?` · ${t.label}`:""}`}stop(){if(this.stream){for(const t of this.stream.getTracks())t.stop();this.video.srcObject=null,this.stream=null}}};const lx="modulepreload",hx=function(n,t){return new URL(n,t).href},Vd={},Xm=function(t,e,i){let s=Promise.resolve();if(e&&e.length>0){let a=function(h){return Promise.all(h.map(u=>Promise.resolve(u).then(f=>({status:"fulfilled",value:f}),f=>({status:"rejected",reason:f}))))};const o=document.getElementsByTagName("link"),c=document.querySelector("meta[property=csp-nonce]"),l=c?.nonce||c?.getAttribute("nonce");s=a(e.map(h=>{if(h=hx(h,i),h in Vd)return;Vd[h]=!0;const u=h.endsWith(".css"),f=u?'[rel="stylesheet"]':"";if(!!i)for(let v=o.length-1;v>=0;v--){const g=o[v];if(g.href===h&&(!u||g.rel==="stylesheet"))return}else if(document.querySelector(`link[href="${h}"]${f}`))return;const m=document.createElement("link");if(m.rel=u?"stylesheet":lx,u||(m.as="script"),m.crossOrigin="",m.href=h,l&&m.setAttribute("nonce",l),document.head.appendChild(m),u)return new Promise((v,g)=>{m.addEventListener("load",v),m.addEventListener("error",()=>g(new Error(`Unable to preload CSS for ${h}`)))})}))}function r(a){const o=new Event("vite:preloadError",{cancelable:!0});if(o.payload=a,window.dispatchEvent(o),!o.defaultPrevented)throw a}return s.then(a=>{for(const o of a||[])o.status==="rejected"&&r(o.reason);return t().catch(r)})},U={nose:0,eyeInL:1,eyeL:2,eyeOutL:3,eyeInR:4,eyeR:5,eyeOutR:6,earL:7,earR:8,mouthL:9,mouthR:10,shL:11,shR:12,elL:13,elR:14,wrL:15,wrR:16,pinkyL:17,pinkyR:18,indexL:19,indexR:20,thumbL:21,thumbR:22,hipL:23,hipR:24,knL:25,knR:26,anL:27,anR:28,heelL:29,heelR:30,toeL:31,toeR:32},Q0=33;function ux(n){return{x:n.x,y:-n.y,z:-n.z,v:n.visibility??1}}const fx=[[U.shL,U.shR],[U.shL,U.elL],[U.elL,U.wrL],[U.shR,U.elR],[U.elR,U.wrR],[U.shL,U.hipL],[U.shR,U.hipR],[U.hipL,U.hipR],[U.hipL,U.knL],[U.knL,U.anL],[U.hipR,U.knR],[U.knR,U.anR],[U.anL,U.toeL],[U.anR,U.toeR],[U.earL,U.eyeL],[U.eyeL,U.nose],[U.nose,U.eyeR],[U.eyeR,U.earR]];class qm{constructor(t,e,i=.65){this.model=t,this.numPoses=e,this.conf=i}lm=null;lastTs=-1;delegate="GPU";inferMs=0;masks=!1;async load(t){t?.("loading the pose engine");const i=await Xm(()=>import("./vision_bundle-Bk4VIwNi.js"),[],import.meta.url),s=await i.FilesetResolver.forVisionTasks("./mediapipe"),r=a=>i.PoseLandmarker.createFromOptions(s,{baseOptions:{modelAssetPath:`./models/pose_landmarker_${this.model}.task`,delegate:a},runningMode:"VIDEO",numPoses:this.numPoses,minPoseDetectionConfidence:this.conf,minPosePresenceConfidence:this.conf,minTrackingConfidence:.5,outputSegmentationMasks:this.masks});t?.(`loading the ${this.model} pose model`);try{this.lm=await r("GPU"),this.delegate="GPU"}catch(a){console.warn("GPU delegate failed, using CPU",a),this.lm=await r("CPU"),this.delegate="CPU"}}async setOptions(t){t.conf!==void 0&&t.conf!==this.conf&&(this.conf=t.conf,await this.lm?.setOptions({minPoseDetectionConfidence:t.conf,minPosePresenceConfidence:t.conf})),t.numPoses&&(this.numPoses=t.numPoses,await this.lm?.setOptions({numPoses:t.numPoses})),t.masks!==void 0&&t.masks!==this.masks&&(this.masks=t.masks,await this.lm?.setOptions({outputSegmentationMasks:t.masks}))}detect(t,e){if(!this.lm)return[];e<=this.lastTs&&(e=this.lastTs+1),this.lastTs=e;const i=performance.now(),s=this.lm.detectForVideo(t,e);this.inferMs=performance.now()-i;const r=[];for(let a=0;a<s.landmarks.length;a++){const o=s.landmarks[a],c=s.worldLandmarks[a];if(!c)continue;const l=s.segmentationMasks?.[a];r.push({image:o.map(h=>({x:h.x,y:h.y,z:h.z,v:h.visibility??1})),world:c.map(ux),mask:l?{data:l.getAsFloat32Array().slice(),w:l.width,h:l.height}:void 0})}return s.close(),r}close(){this.lm?.close(),this.lm=null}}/**
 * @license
 * Copyright 2010-2025 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const Rf="180",dx=0,Gd=1,px=2,$m=1,Ym=2,vs=3,ir=0,Fn=1,Se=2,Ks=0,za=1,Or=2,Wd=3,Xd=4,jm=5,wr=100,mx=101,gx=102,vx=103,xx=104,Zm=200,_x=201,Jm=202,Mx=203,tu=204,eu=205,bx=206,wx=207,yx=208,Sx=209,Ex=210,Tx=211,Ax=212,Rx=213,Cx=214,nu=0,iu=1,su=2,eo=3,ru=4,au=5,ou=6,cu=7,Km=0,Lx=1,Px=2,Qs=0,Ix=1,Dx=2,Ux=3,Nx=4,Fx=5,kx=6,Qm=7,qd="attached",Ox="detached",tg=300,no=301,io=302,Gl=303,lu=304,xh=306,so=1e3,Sr=1001,hu=1002,ni=1003,Bx=1004,Pc=1005,Ie=1006,Ih=1007,$s=1008,Oi=1009,eg=1010,ng=1011,ec=1012,Cf=1013,Br=1014,es=1015,Xr=1016,Lf=1017,Pf=1018,nc=1020,ig=35902,sg=35899,rg=1021,ag=1022,cn=1023,ic=1026,sc=1027,og=1028,If=1029,cg=1030,Df=1031,Uf=1033,El=33776,Tl=33777,Al=33778,Rl=33779,uu=35840,fu=35841,du=35842,pu=35843,mu=36196,gu=37492,vu=37496,xu=37808,_u=37809,Mu=37810,bu=37811,wu=37812,yu=37813,Su=37814,Eu=37815,Tu=37816,Au=37817,Ru=37818,Cu=37819,Lu=37820,Pu=37821,Iu=36492,Du=36494,Uu=36495,Nu=36283,Fu=36284,ku=36285,Ou=36286,Hx=3200,zx=3201,lg=0,Vx=1,Ji="",gn="srgb",Hr="srgb-linear",Wl="linear",we="srgb",Zr=7680,$d=519,Gx=512,Wx=513,Xx=514,hg=515,qx=516,$x=517,Yx=518,jx=519,Bu=35044,Ic=35048,Yd="300 es",ns=2e3,Xl=2001;class po{addEventListener(t,e){this._listeners===void 0&&(this._listeners={});const i=this._listeners;i[t]===void 0&&(i[t]=[]),i[t].indexOf(e)===-1&&i[t].push(e)}hasEventListener(t,e){const i=this._listeners;return i===void 0?!1:i[t]!==void 0&&i[t].indexOf(e)!==-1}removeEventListener(t,e){const i=this._listeners;if(i===void 0)return;const s=i[t];if(s!==void 0){const r=s.indexOf(e);r!==-1&&s.splice(r,1)}}dispatchEvent(t){const e=this._listeners;if(e===void 0)return;const i=e[t.type];if(i!==void 0){t.target=this;const s=i.slice(0);for(let r=0,a=s.length;r<a;r++)s[r].call(this,t);t.target=null}}}const un=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];let jd=1234567;const Wo=Math.PI/180,ro=180/Math.PI;function Ni(){const n=Math.random()*4294967295|0,t=Math.random()*4294967295|0,e=Math.random()*4294967295|0,i=Math.random()*4294967295|0;return(un[n&255]+un[n>>8&255]+un[n>>16&255]+un[n>>24&255]+"-"+un[t&255]+un[t>>8&255]+"-"+un[t>>16&15|64]+un[t>>24&255]+"-"+un[e&63|128]+un[e>>8&255]+"-"+un[e>>16&255]+un[e>>24&255]+un[i&255]+un[i>>8&255]+un[i>>16&255]+un[i>>24&255]).toLowerCase()}function ne(n,t,e){return Math.max(t,Math.min(e,n))}function Nf(n,t){return(n%t+t)%t}function Zx(n,t,e,i,s){return i+(n-t)*(s-i)/(e-t)}function Jx(n,t,e){return n!==t?(e-n)/(t-n):0}function Xo(n,t,e){return(1-e)*n+e*t}function Kx(n,t,e,i){return Xo(n,t,1-Math.exp(-e*i))}function Qx(n,t=1){return t-Math.abs(Nf(n,t*2)-t)}function t_(n,t,e){return n<=t?0:n>=e?1:(n=(n-t)/(e-t),n*n*(3-2*n))}function e_(n,t,e){return n<=t?0:n>=e?1:(n=(n-t)/(e-t),n*n*n*(n*(n*6-15)+10))}function n_(n,t){return n+Math.floor(Math.random()*(t-n+1))}function i_(n,t){return n+Math.random()*(t-n)}function s_(n){return n*(.5-Math.random())}function r_(n){n!==void 0&&(jd=n);let t=jd+=1831565813;return t=Math.imul(t^t>>>15,t|1),t^=t+Math.imul(t^t>>>7,t|61),((t^t>>>14)>>>0)/4294967296}function a_(n){return n*Wo}function o_(n){return n*ro}function c_(n){return(n&n-1)===0&&n!==0}function l_(n){return Math.pow(2,Math.ceil(Math.log(n)/Math.LN2))}function h_(n){return Math.pow(2,Math.floor(Math.log(n)/Math.LN2))}function u_(n,t,e,i,s){const r=Math.cos,a=Math.sin,o=r(e/2),c=a(e/2),l=r((t+i)/2),h=a((t+i)/2),u=r((t-i)/2),f=a((t-i)/2),d=r((i-t)/2),m=a((i-t)/2);switch(s){case"XYX":n.set(o*h,c*u,c*f,o*l);break;case"YZY":n.set(c*f,o*h,c*u,o*l);break;case"ZXZ":n.set(c*u,c*f,o*h,o*l);break;case"XZX":n.set(o*h,c*m,c*d,o*l);break;case"YXY":n.set(c*d,o*h,c*m,o*l);break;case"ZYZ":n.set(c*m,c*d,o*h,o*l);break;default:console.warn("THREE.MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+s)}}function Ii(n,t){switch(t.constructor){case Float32Array:return n;case Uint32Array:return n/4294967295;case Uint16Array:return n/65535;case Uint8Array:return n/255;case Int32Array:return Math.max(n/2147483647,-1);case Int16Array:return Math.max(n/32767,-1);case Int8Array:return Math.max(n/127,-1);default:throw new Error("Invalid component type.")}}function Me(n,t){switch(t.constructor){case Float32Array:return n;case Uint32Array:return Math.round(n*4294967295);case Uint16Array:return Math.round(n*65535);case Uint8Array:return Math.round(n*255);case Int32Array:return Math.round(n*2147483647);case Int16Array:return Math.round(n*32767);case Int8Array:return Math.round(n*127);default:throw new Error("Invalid component type.")}}const ss={DEG2RAD:Wo,RAD2DEG:ro,generateUUID:Ni,clamp:ne,euclideanModulo:Nf,mapLinear:Zx,inverseLerp:Jx,lerp:Xo,damp:Kx,pingpong:Qx,smoothstep:t_,smootherstep:e_,randInt:n_,randFloat:i_,randFloatSpread:s_,seededRandom:r_,degToRad:a_,radToDeg:o_,isPowerOfTwo:c_,ceilPowerOfTwo:l_,floorPowerOfTwo:h_,setQuaternionFromProperEuler:u_,normalize:Me,denormalize:Ii};class ft{constructor(t=0,e=0){ft.prototype.isVector2=!0,this.x=t,this.y=e}get width(){return this.x}set width(t){this.x=t}get height(){return this.y}set height(t){this.y=t}set(t,e){return this.x=t,this.y=e,this}setScalar(t){return this.x=t,this.y=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y)}copy(t){return this.x=t.x,this.y=t.y,this}add(t){return this.x+=t.x,this.y+=t.y,this}addScalar(t){return this.x+=t,this.y+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this}subScalar(t){return this.x-=t,this.y-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this}multiply(t){return this.x*=t.x,this.y*=t.y,this}multiplyScalar(t){return this.x*=t,this.y*=t,this}divide(t){return this.x/=t.x,this.y/=t.y,this}divideScalar(t){return this.multiplyScalar(1/t)}applyMatrix3(t){const e=this.x,i=this.y,s=t.elements;return this.x=s[0]*e+s[3]*i+s[6],this.y=s[1]*e+s[4]*i+s[7],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this}clamp(t,e){return this.x=ne(this.x,t.x,e.x),this.y=ne(this.y,t.y,e.y),this}clampScalar(t,e){return this.x=ne(this.x,t,e),this.y=ne(this.y,t,e),this}clampLength(t,e){const i=this.length();return this.divideScalar(i||1).multiplyScalar(ne(i,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(t){return this.x*t.x+this.y*t.y}cross(t){return this.x*t.y-this.y*t.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const i=this.dot(t)/e;return Math.acos(ne(i,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,i=this.y-t.y;return e*e+i*i}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this}lerpVectors(t,e,i){return this.x=t.x+(e.x-t.x)*i,this.y=t.y+(e.y-t.y)*i,this}equals(t){return t.x===this.x&&t.y===this.y}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this}rotateAround(t,e){const i=Math.cos(e),s=Math.sin(e),r=this.x-t.x,a=this.y-t.y;return this.x=r*i-a*s+t.x,this.y=r*s+a*i+t.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class le{constructor(t=0,e=0,i=0,s=1){this.isQuaternion=!0,this._x=t,this._y=e,this._z=i,this._w=s}static slerpFlat(t,e,i,s,r,a,o){let c=i[s+0],l=i[s+1],h=i[s+2],u=i[s+3];const f=r[a+0],d=r[a+1],m=r[a+2],v=r[a+3];if(o===0){t[e+0]=c,t[e+1]=l,t[e+2]=h,t[e+3]=u;return}if(o===1){t[e+0]=f,t[e+1]=d,t[e+2]=m,t[e+3]=v;return}if(u!==v||c!==f||l!==d||h!==m){let g=1-o;const p=c*f+l*d+h*m+u*v,_=p>=0?1:-1,x=1-p*p;if(x>Number.EPSILON){const w=Math.sqrt(x),S=Math.atan2(w,p*_);g=Math.sin(g*S)/w,o=Math.sin(o*S)/w}const M=o*_;if(c=c*g+f*M,l=l*g+d*M,h=h*g+m*M,u=u*g+v*M,g===1-o){const w=1/Math.sqrt(c*c+l*l+h*h+u*u);c*=w,l*=w,h*=w,u*=w}}t[e]=c,t[e+1]=l,t[e+2]=h,t[e+3]=u}static multiplyQuaternionsFlat(t,e,i,s,r,a){const o=i[s],c=i[s+1],l=i[s+2],h=i[s+3],u=r[a],f=r[a+1],d=r[a+2],m=r[a+3];return t[e]=o*m+h*u+c*d-l*f,t[e+1]=c*m+h*f+l*u-o*d,t[e+2]=l*m+h*d+o*f-c*u,t[e+3]=h*m-o*u-c*f-l*d,t}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get w(){return this._w}set w(t){this._w=t,this._onChangeCallback()}set(t,e,i,s){return this._x=t,this._y=e,this._z=i,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(t){return this._x=t.x,this._y=t.y,this._z=t.z,this._w=t.w,this._onChangeCallback(),this}setFromEuler(t,e=!0){const i=t._x,s=t._y,r=t._z,a=t._order,o=Math.cos,c=Math.sin,l=o(i/2),h=o(s/2),u=o(r/2),f=c(i/2),d=c(s/2),m=c(r/2);switch(a){case"XYZ":this._x=f*h*u+l*d*m,this._y=l*d*u-f*h*m,this._z=l*h*m+f*d*u,this._w=l*h*u-f*d*m;break;case"YXZ":this._x=f*h*u+l*d*m,this._y=l*d*u-f*h*m,this._z=l*h*m-f*d*u,this._w=l*h*u+f*d*m;break;case"ZXY":this._x=f*h*u-l*d*m,this._y=l*d*u+f*h*m,this._z=l*h*m+f*d*u,this._w=l*h*u-f*d*m;break;case"ZYX":this._x=f*h*u-l*d*m,this._y=l*d*u+f*h*m,this._z=l*h*m-f*d*u,this._w=l*h*u+f*d*m;break;case"YZX":this._x=f*h*u+l*d*m,this._y=l*d*u+f*h*m,this._z=l*h*m-f*d*u,this._w=l*h*u-f*d*m;break;case"XZY":this._x=f*h*u-l*d*m,this._y=l*d*u-f*h*m,this._z=l*h*m+f*d*u,this._w=l*h*u+f*d*m;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+a)}return e===!0&&this._onChangeCallback(),this}setFromAxisAngle(t,e){const i=e/2,s=Math.sin(i);return this._x=t.x*s,this._y=t.y*s,this._z=t.z*s,this._w=Math.cos(i),this._onChangeCallback(),this}setFromRotationMatrix(t){const e=t.elements,i=e[0],s=e[4],r=e[8],a=e[1],o=e[5],c=e[9],l=e[2],h=e[6],u=e[10],f=i+o+u;if(f>0){const d=.5/Math.sqrt(f+1);this._w=.25/d,this._x=(h-c)*d,this._y=(r-l)*d,this._z=(a-s)*d}else if(i>o&&i>u){const d=2*Math.sqrt(1+i-o-u);this._w=(h-c)/d,this._x=.25*d,this._y=(s+a)/d,this._z=(r+l)/d}else if(o>u){const d=2*Math.sqrt(1+o-i-u);this._w=(r-l)/d,this._x=(s+a)/d,this._y=.25*d,this._z=(c+h)/d}else{const d=2*Math.sqrt(1+u-i-o);this._w=(a-s)/d,this._x=(r+l)/d,this._y=(c+h)/d,this._z=.25*d}return this._onChangeCallback(),this}setFromUnitVectors(t,e){let i=t.dot(e)+1;return i<1e-8?(i=0,Math.abs(t.x)>Math.abs(t.z)?(this._x=-t.y,this._y=t.x,this._z=0,this._w=i):(this._x=0,this._y=-t.z,this._z=t.y,this._w=i)):(this._x=t.y*e.z-t.z*e.y,this._y=t.z*e.x-t.x*e.z,this._z=t.x*e.y-t.y*e.x,this._w=i),this.normalize()}angleTo(t){return 2*Math.acos(Math.abs(ne(this.dot(t),-1,1)))}rotateTowards(t,e){const i=this.angleTo(t);if(i===0)return this;const s=Math.min(1,e/i);return this.slerp(t,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(t){return this._x*t._x+this._y*t._y+this._z*t._z+this._w*t._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let t=this.length();return t===0?(this._x=0,this._y=0,this._z=0,this._w=1):(t=1/t,this._x=this._x*t,this._y=this._y*t,this._z=this._z*t,this._w=this._w*t),this._onChangeCallback(),this}multiply(t){return this.multiplyQuaternions(this,t)}premultiply(t){return this.multiplyQuaternions(t,this)}multiplyQuaternions(t,e){const i=t._x,s=t._y,r=t._z,a=t._w,o=e._x,c=e._y,l=e._z,h=e._w;return this._x=i*h+a*o+s*l-r*c,this._y=s*h+a*c+r*o-i*l,this._z=r*h+a*l+i*c-s*o,this._w=a*h-i*o-s*c-r*l,this._onChangeCallback(),this}slerp(t,e){if(e===0)return this;if(e===1)return this.copy(t);const i=this._x,s=this._y,r=this._z,a=this._w;let o=a*t._w+i*t._x+s*t._y+r*t._z;if(o<0?(this._w=-t._w,this._x=-t._x,this._y=-t._y,this._z=-t._z,o=-o):this.copy(t),o>=1)return this._w=a,this._x=i,this._y=s,this._z=r,this;const c=1-o*o;if(c<=Number.EPSILON){const d=1-e;return this._w=d*a+e*this._w,this._x=d*i+e*this._x,this._y=d*s+e*this._y,this._z=d*r+e*this._z,this.normalize(),this}const l=Math.sqrt(c),h=Math.atan2(l,o),u=Math.sin((1-e)*h)/l,f=Math.sin(e*h)/l;return this._w=a*u+this._w*f,this._x=i*u+this._x*f,this._y=s*u+this._y*f,this._z=r*u+this._z*f,this._onChangeCallback(),this}slerpQuaternions(t,e,i){return this.copy(t).slerp(e,i)}random(){const t=2*Math.PI*Math.random(),e=2*Math.PI*Math.random(),i=Math.random(),s=Math.sqrt(1-i),r=Math.sqrt(i);return this.set(s*Math.sin(t),s*Math.cos(t),r*Math.sin(e),r*Math.cos(e))}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._w===this._w}fromArray(t,e=0){return this._x=t[e],this._y=t[e+1],this._z=t[e+2],this._w=t[e+3],this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._w,t}fromBufferAttribute(t,e){return this._x=t.getX(e),this._y=t.getY(e),this._z=t.getZ(e),this._w=t.getW(e),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class C{constructor(t=0,e=0,i=0){C.prototype.isVector3=!0,this.x=t,this.y=e,this.z=i}set(t,e,i){return i===void 0&&(i=this.z),this.x=t,this.y=e,this.z=i,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this}multiplyVectors(t,e){return this.x=t.x*e.x,this.y=t.y*e.y,this.z=t.z*e.z,this}applyEuler(t){return this.applyQuaternion(Zd.setFromEuler(t))}applyAxisAngle(t,e){return this.applyQuaternion(Zd.setFromAxisAngle(t,e))}applyMatrix3(t){const e=this.x,i=this.y,s=this.z,r=t.elements;return this.x=r[0]*e+r[3]*i+r[6]*s,this.y=r[1]*e+r[4]*i+r[7]*s,this.z=r[2]*e+r[5]*i+r[8]*s,this}applyNormalMatrix(t){return this.applyMatrix3(t).normalize()}applyMatrix4(t){const e=this.x,i=this.y,s=this.z,r=t.elements,a=1/(r[3]*e+r[7]*i+r[11]*s+r[15]);return this.x=(r[0]*e+r[4]*i+r[8]*s+r[12])*a,this.y=(r[1]*e+r[5]*i+r[9]*s+r[13])*a,this.z=(r[2]*e+r[6]*i+r[10]*s+r[14])*a,this}applyQuaternion(t){const e=this.x,i=this.y,s=this.z,r=t.x,a=t.y,o=t.z,c=t.w,l=2*(a*s-o*i),h=2*(o*e-r*s),u=2*(r*i-a*e);return this.x=e+c*l+a*u-o*h,this.y=i+c*h+o*l-r*u,this.z=s+c*u+r*h-a*l,this}project(t){return this.applyMatrix4(t.matrixWorldInverse).applyMatrix4(t.projectionMatrix)}unproject(t){return this.applyMatrix4(t.projectionMatrixInverse).applyMatrix4(t.matrixWorld)}transformDirection(t){const e=this.x,i=this.y,s=this.z,r=t.elements;return this.x=r[0]*e+r[4]*i+r[8]*s,this.y=r[1]*e+r[5]*i+r[9]*s,this.z=r[2]*e+r[6]*i+r[10]*s,this.normalize()}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this}divideScalar(t){return this.multiplyScalar(1/t)}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this}clamp(t,e){return this.x=ne(this.x,t.x,e.x),this.y=ne(this.y,t.y,e.y),this.z=ne(this.z,t.z,e.z),this}clampScalar(t,e){return this.x=ne(this.x,t,e),this.y=ne(this.y,t,e),this.z=ne(this.z,t,e),this}clampLength(t,e){const i=this.length();return this.divideScalar(i||1).multiplyScalar(ne(i,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this}lerpVectors(t,e,i){return this.x=t.x+(e.x-t.x)*i,this.y=t.y+(e.y-t.y)*i,this.z=t.z+(e.z-t.z)*i,this}cross(t){return this.crossVectors(this,t)}crossVectors(t,e){const i=t.x,s=t.y,r=t.z,a=e.x,o=e.y,c=e.z;return this.x=s*c-r*o,this.y=r*a-i*c,this.z=i*o-s*a,this}projectOnVector(t){const e=t.lengthSq();if(e===0)return this.set(0,0,0);const i=t.dot(this)/e;return this.copy(t).multiplyScalar(i)}projectOnPlane(t){return Dh.copy(this).projectOnVector(t),this.sub(Dh)}reflect(t){return this.sub(Dh.copy(t).multiplyScalar(2*this.dot(t)))}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const i=this.dot(t)/e;return Math.acos(ne(i,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,i=this.y-t.y,s=this.z-t.z;return e*e+i*i+s*s}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)+Math.abs(this.z-t.z)}setFromSpherical(t){return this.setFromSphericalCoords(t.radius,t.phi,t.theta)}setFromSphericalCoords(t,e,i){const s=Math.sin(e)*t;return this.x=s*Math.sin(i),this.y=Math.cos(e)*t,this.z=s*Math.cos(i),this}setFromCylindrical(t){return this.setFromCylindricalCoords(t.radius,t.theta,t.y)}setFromCylindricalCoords(t,e,i){return this.x=t*Math.sin(e),this.y=i,this.z=t*Math.cos(e),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this}setFromMatrixScale(t){const e=this.setFromMatrixColumn(t,0).length(),i=this.setFromMatrixColumn(t,1).length(),s=this.setFromMatrixColumn(t,2).length();return this.x=e,this.y=i,this.z=s,this}setFromMatrixColumn(t,e){return this.fromArray(t.elements,e*4)}setFromMatrix3Column(t,e){return this.fromArray(t.elements,e*3)}setFromEuler(t){return this.x=t._x,this.y=t._y,this.z=t._z,this}setFromColor(t){return this.x=t.r,this.y=t.g,this.z=t.b,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const t=Math.random()*Math.PI*2,e=Math.random()*2-1,i=Math.sqrt(1-e*e);return this.x=i*Math.cos(t),this.y=e,this.z=i*Math.sin(t),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const Dh=new C,Zd=new le;class oe{constructor(t,e,i,s,r,a,o,c,l){oe.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],t!==void 0&&this.set(t,e,i,s,r,a,o,c,l)}set(t,e,i,s,r,a,o,c,l){const h=this.elements;return h[0]=t,h[1]=s,h[2]=o,h[3]=e,h[4]=r,h[5]=c,h[6]=i,h[7]=a,h[8]=l,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(t){const e=this.elements,i=t.elements;return e[0]=i[0],e[1]=i[1],e[2]=i[2],e[3]=i[3],e[4]=i[4],e[5]=i[5],e[6]=i[6],e[7]=i[7],e[8]=i[8],this}extractBasis(t,e,i){return t.setFromMatrix3Column(this,0),e.setFromMatrix3Column(this,1),i.setFromMatrix3Column(this,2),this}setFromMatrix4(t){const e=t.elements;return this.set(e[0],e[4],e[8],e[1],e[5],e[9],e[2],e[6],e[10]),this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const i=t.elements,s=e.elements,r=this.elements,a=i[0],o=i[3],c=i[6],l=i[1],h=i[4],u=i[7],f=i[2],d=i[5],m=i[8],v=s[0],g=s[3],p=s[6],_=s[1],x=s[4],M=s[7],w=s[2],S=s[5],T=s[8];return r[0]=a*v+o*_+c*w,r[3]=a*g+o*x+c*S,r[6]=a*p+o*M+c*T,r[1]=l*v+h*_+u*w,r[4]=l*g+h*x+u*S,r[7]=l*p+h*M+u*T,r[2]=f*v+d*_+m*w,r[5]=f*g+d*x+m*S,r[8]=f*p+d*M+m*T,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[3]*=t,e[6]*=t,e[1]*=t,e[4]*=t,e[7]*=t,e[2]*=t,e[5]*=t,e[8]*=t,this}determinant(){const t=this.elements,e=t[0],i=t[1],s=t[2],r=t[3],a=t[4],o=t[5],c=t[6],l=t[7],h=t[8];return e*a*h-e*o*l-i*r*h+i*o*c+s*r*l-s*a*c}invert(){const t=this.elements,e=t[0],i=t[1],s=t[2],r=t[3],a=t[4],o=t[5],c=t[6],l=t[7],h=t[8],u=h*a-o*l,f=o*c-h*r,d=l*r-a*c,m=e*u+i*f+s*d;if(m===0)return this.set(0,0,0,0,0,0,0,0,0);const v=1/m;return t[0]=u*v,t[1]=(s*l-h*i)*v,t[2]=(o*i-s*a)*v,t[3]=f*v,t[4]=(h*e-s*c)*v,t[5]=(s*r-o*e)*v,t[6]=d*v,t[7]=(i*c-l*e)*v,t[8]=(a*e-i*r)*v,this}transpose(){let t;const e=this.elements;return t=e[1],e[1]=e[3],e[3]=t,t=e[2],e[2]=e[6],e[6]=t,t=e[5],e[5]=e[7],e[7]=t,this}getNormalMatrix(t){return this.setFromMatrix4(t).invert().transpose()}transposeIntoArray(t){const e=this.elements;return t[0]=e[0],t[1]=e[3],t[2]=e[6],t[3]=e[1],t[4]=e[4],t[5]=e[7],t[6]=e[2],t[7]=e[5],t[8]=e[8],this}setUvTransform(t,e,i,s,r,a,o){const c=Math.cos(r),l=Math.sin(r);return this.set(i*c,i*l,-i*(c*a+l*o)+a+t,-s*l,s*c,-s*(-l*a+c*o)+o+e,0,0,1),this}scale(t,e){return this.premultiply(Uh.makeScale(t,e)),this}rotate(t){return this.premultiply(Uh.makeRotation(-t)),this}translate(t,e){return this.premultiply(Uh.makeTranslation(t,e)),this}makeTranslation(t,e){return t.isVector2?this.set(1,0,t.x,0,1,t.y,0,0,1):this.set(1,0,t,0,1,e,0,0,1),this}makeRotation(t){const e=Math.cos(t),i=Math.sin(t);return this.set(e,-i,0,i,e,0,0,0,1),this}makeScale(t,e){return this.set(t,0,0,0,e,0,0,0,1),this}equals(t){const e=this.elements,i=t.elements;for(let s=0;s<9;s++)if(e[s]!==i[s])return!1;return!0}fromArray(t,e=0){for(let i=0;i<9;i++)this.elements[i]=t[i+e];return this}toArray(t=[],e=0){const i=this.elements;return t[e]=i[0],t[e+1]=i[1],t[e+2]=i[2],t[e+3]=i[3],t[e+4]=i[4],t[e+5]=i[5],t[e+6]=i[6],t[e+7]=i[7],t[e+8]=i[8],t}clone(){return new this.constructor().fromArray(this.elements)}}const Uh=new oe;function ug(n){for(let t=n.length-1;t>=0;--t)if(n[t]>=65535)return!0;return!1}function ql(n){return document.createElementNS("http://www.w3.org/1999/xhtml",n)}function f_(){const n=ql("canvas");return n.style.display="block",n}const Jd={};function rc(n){n in Jd||(Jd[n]=!0,console.warn(n))}function d_(n,t,e){return new Promise(function(i,s){function r(){switch(n.clientWaitSync(t,n.SYNC_FLUSH_COMMANDS_BIT,0)){case n.WAIT_FAILED:s();break;case n.TIMEOUT_EXPIRED:setTimeout(r,e);break;default:i()}}setTimeout(r,e)})}const Kd=new oe().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),Qd=new oe().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function p_(){const n={enabled:!0,workingColorSpace:Hr,spaces:{},convert:function(s,r,a){return this.enabled===!1||r===a||!r||!a||(this.spaces[r].transfer===we&&(s.r=Ts(s.r),s.g=Ts(s.g),s.b=Ts(s.b)),this.spaces[r].primaries!==this.spaces[a].primaries&&(s.applyMatrix3(this.spaces[r].toXYZ),s.applyMatrix3(this.spaces[a].fromXYZ)),this.spaces[a].transfer===we&&(s.r=Va(s.r),s.g=Va(s.g),s.b=Va(s.b))),s},workingToColorSpace:function(s,r){return this.convert(s,this.workingColorSpace,r)},colorSpaceToWorking:function(s,r){return this.convert(s,r,this.workingColorSpace)},getPrimaries:function(s){return this.spaces[s].primaries},getTransfer:function(s){return s===Ji?Wl:this.spaces[s].transfer},getToneMappingMode:function(s){return this.spaces[s].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(s,r=this.workingColorSpace){return s.fromArray(this.spaces[r].luminanceCoefficients)},define:function(s){Object.assign(this.spaces,s)},_getMatrix:function(s,r,a){return s.copy(this.spaces[r].toXYZ).multiply(this.spaces[a].fromXYZ)},_getDrawingBufferColorSpace:function(s){return this.spaces[s].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(s=this.workingColorSpace){return this.spaces[s].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(s,r){return rc("THREE.ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),n.workingToColorSpace(s,r)},toWorkingColorSpace:function(s,r){return rc("THREE.ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),n.colorSpaceToWorking(s,r)}},t=[.64,.33,.3,.6,.15,.06],e=[.2126,.7152,.0722],i=[.3127,.329];return n.define({[Hr]:{primaries:t,whitePoint:i,transfer:Wl,toXYZ:Kd,fromXYZ:Qd,luminanceCoefficients:e,workingColorSpaceConfig:{unpackColorSpace:gn},outputColorSpaceConfig:{drawingBufferColorSpace:gn}},[gn]:{primaries:t,whitePoint:i,transfer:we,toXYZ:Kd,fromXYZ:Qd,luminanceCoefficients:e,outputColorSpaceConfig:{drawingBufferColorSpace:gn}}}),n}const ge=p_();function Ts(n){return n<.04045?n*.0773993808:Math.pow(n*.9478672986+.0521327014,2.4)}function Va(n){return n<.0031308?n*12.92:1.055*Math.pow(n,.41666)-.055}let Jr;class m_{static getDataURL(t,e="image/png"){if(/^data:/i.test(t.src)||typeof HTMLCanvasElement>"u")return t.src;let i;if(t instanceof HTMLCanvasElement)i=t;else{Jr===void 0&&(Jr=ql("canvas")),Jr.width=t.width,Jr.height=t.height;const s=Jr.getContext("2d");t instanceof ImageData?s.putImageData(t,0,0):s.drawImage(t,0,0,t.width,t.height),i=Jr}return i.toDataURL(e)}static sRGBToLinear(t){if(typeof HTMLImageElement<"u"&&t instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&t instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&t instanceof ImageBitmap){const e=ql("canvas");e.width=t.width,e.height=t.height;const i=e.getContext("2d");i.drawImage(t,0,0,t.width,t.height);const s=i.getImageData(0,0,t.width,t.height),r=s.data;for(let a=0;a<r.length;a++)r[a]=Ts(r[a]/255)*255;return i.putImageData(s,0,0),e}else if(t.data){const e=t.data.slice(0);for(let i=0;i<e.length;i++)e instanceof Uint8Array||e instanceof Uint8ClampedArray?e[i]=Math.floor(Ts(e[i]/255)*255):e[i]=Ts(e[i]);return{data:e,width:t.width,height:t.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),t}}let g_=0;class Ff{constructor(t=null){this.isSource=!0,Object.defineProperty(this,"id",{value:g_++}),this.uuid=Ni(),this.data=t,this.dataReady=!0,this.version=0}getSize(t){const e=this.data;return typeof HTMLVideoElement<"u"&&e instanceof HTMLVideoElement?t.set(e.videoWidth,e.videoHeight,0):e instanceof VideoFrame?t.set(e.displayHeight,e.displayWidth,0):e!==null?t.set(e.width,e.height,e.depth||0):t.set(0,0,0),t}set needsUpdate(t){t===!0&&this.version++}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.images[this.uuid]!==void 0)return t.images[this.uuid];const i={uuid:this.uuid,url:""},s=this.data;if(s!==null){let r;if(Array.isArray(s)){r=[];for(let a=0,o=s.length;a<o;a++)s[a].isDataTexture?r.push(Nh(s[a].image)):r.push(Nh(s[a]))}else r=Nh(s);i.url=r}return e||(t.images[this.uuid]=i),i}}function Nh(n){return typeof HTMLImageElement<"u"&&n instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&n instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&n instanceof ImageBitmap?m_.getDataURL(n):n.data?{data:Array.from(n.data),width:n.width,height:n.height,type:n.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}let v_=0;const Fh=new C;class hn extends po{constructor(t=hn.DEFAULT_IMAGE,e=hn.DEFAULT_MAPPING,i=Sr,s=Sr,r=Ie,a=$s,o=cn,c=Oi,l=hn.DEFAULT_ANISOTROPY,h=Ji){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:v_++}),this.uuid=Ni(),this.name="",this.source=new Ff(t),this.mipmaps=[],this.mapping=e,this.channel=0,this.wrapS=i,this.wrapT=s,this.magFilter=r,this.minFilter=a,this.anisotropy=l,this.format=o,this.internalFormat=null,this.type=c,this.offset=new ft(0,0),this.repeat=new ft(1,1),this.center=new ft(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new oe,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=h,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(t&&t.depth&&t.depth>1),this.pmremVersion=0}get width(){return this.source.getSize(Fh).x}get height(){return this.source.getSize(Fh).y}get depth(){return this.source.getSize(Fh).z}get image(){return this.source.data}set image(t=null){this.source.data=t}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(t){return this.name=t.name,this.source=t.source,this.mipmaps=t.mipmaps.slice(0),this.mapping=t.mapping,this.channel=t.channel,this.wrapS=t.wrapS,this.wrapT=t.wrapT,this.magFilter=t.magFilter,this.minFilter=t.minFilter,this.anisotropy=t.anisotropy,this.format=t.format,this.internalFormat=t.internalFormat,this.type=t.type,this.offset.copy(t.offset),this.repeat.copy(t.repeat),this.center.copy(t.center),this.rotation=t.rotation,this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrix.copy(t.matrix),this.generateMipmaps=t.generateMipmaps,this.premultiplyAlpha=t.premultiplyAlpha,this.flipY=t.flipY,this.unpackAlignment=t.unpackAlignment,this.colorSpace=t.colorSpace,this.renderTarget=t.renderTarget,this.isRenderTargetTexture=t.isRenderTargetTexture,this.isArrayTexture=t.isArrayTexture,this.userData=JSON.parse(JSON.stringify(t.userData)),this.needsUpdate=!0,this}setValues(t){for(const e in t){const i=t[e];if(i===void 0){console.warn(`THREE.Texture.setValues(): parameter '${e}' has value of undefined.`);continue}const s=this[e];if(s===void 0){console.warn(`THREE.Texture.setValues(): property '${e}' does not exist.`);continue}s&&i&&s.isVector2&&i.isVector2||s&&i&&s.isVector3&&i.isVector3||s&&i&&s.isMatrix3&&i.isMatrix3?s.copy(i):this[e]=i}}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.textures[this.uuid]!==void 0)return t.textures[this.uuid];const i={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(t).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(i.userData=this.userData),e||(t.textures[this.uuid]=i),i}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(t){if(this.mapping!==tg)return t;if(t.applyMatrix3(this.matrix),t.x<0||t.x>1)switch(this.wrapS){case so:t.x=t.x-Math.floor(t.x);break;case Sr:t.x=t.x<0?0:1;break;case hu:Math.abs(Math.floor(t.x)%2)===1?t.x=Math.ceil(t.x)-t.x:t.x=t.x-Math.floor(t.x);break}if(t.y<0||t.y>1)switch(this.wrapT){case so:t.y=t.y-Math.floor(t.y);break;case Sr:t.y=t.y<0?0:1;break;case hu:Math.abs(Math.floor(t.y)%2)===1?t.y=Math.ceil(t.y)-t.y:t.y=t.y-Math.floor(t.y);break}return this.flipY&&(t.y=1-t.y),t}set needsUpdate(t){t===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(t){t===!0&&this.pmremVersion++}}hn.DEFAULT_IMAGE=null;hn.DEFAULT_MAPPING=tg;hn.DEFAULT_ANISOTROPY=1;class de{constructor(t=0,e=0,i=0,s=1){de.prototype.isVector4=!0,this.x=t,this.y=e,this.z=i,this.w=s}get width(){return this.z}set width(t){this.z=t}get height(){return this.w}set height(t){this.w=t}set(t,e,i,s){return this.x=t,this.y=e,this.z=i,this.w=s,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this.w=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setW(t){return this.w=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;case 3:this.w=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this.w=t.w!==void 0?t.w:1,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this.w+=t.w,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this.w+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this.w=t.w+e.w,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this.w+=t.w*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this.w-=t.w,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this.w-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this.w=t.w-e.w,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this.w*=t.w,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this.w*=t,this}applyMatrix4(t){const e=this.x,i=this.y,s=this.z,r=this.w,a=t.elements;return this.x=a[0]*e+a[4]*i+a[8]*s+a[12]*r,this.y=a[1]*e+a[5]*i+a[9]*s+a[13]*r,this.z=a[2]*e+a[6]*i+a[10]*s+a[14]*r,this.w=a[3]*e+a[7]*i+a[11]*s+a[15]*r,this}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this.w/=t.w,this}divideScalar(t){return this.multiplyScalar(1/t)}setAxisAngleFromQuaternion(t){this.w=2*Math.acos(t.w);const e=Math.sqrt(1-t.w*t.w);return e<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=t.x/e,this.y=t.y/e,this.z=t.z/e),this}setAxisAngleFromRotationMatrix(t){let e,i,s,r;const c=t.elements,l=c[0],h=c[4],u=c[8],f=c[1],d=c[5],m=c[9],v=c[2],g=c[6],p=c[10];if(Math.abs(h-f)<.01&&Math.abs(u-v)<.01&&Math.abs(m-g)<.01){if(Math.abs(h+f)<.1&&Math.abs(u+v)<.1&&Math.abs(m+g)<.1&&Math.abs(l+d+p-3)<.1)return this.set(1,0,0,0),this;e=Math.PI;const x=(l+1)/2,M=(d+1)/2,w=(p+1)/2,S=(h+f)/4,T=(u+v)/4,A=(m+g)/4;return x>M&&x>w?x<.01?(i=0,s=.707106781,r=.707106781):(i=Math.sqrt(x),s=S/i,r=T/i):M>w?M<.01?(i=.707106781,s=0,r=.707106781):(s=Math.sqrt(M),i=S/s,r=A/s):w<.01?(i=.707106781,s=.707106781,r=0):(r=Math.sqrt(w),i=T/r,s=A/r),this.set(i,s,r,e),this}let _=Math.sqrt((g-m)*(g-m)+(u-v)*(u-v)+(f-h)*(f-h));return Math.abs(_)<.001&&(_=1),this.x=(g-m)/_,this.y=(u-v)/_,this.z=(f-h)/_,this.w=Math.acos((l+d+p-1)/2),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this.w=e[15],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this.w=Math.min(this.w,t.w),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this.w=Math.max(this.w,t.w),this}clamp(t,e){return this.x=ne(this.x,t.x,e.x),this.y=ne(this.y,t.y,e.y),this.z=ne(this.z,t.z,e.z),this.w=ne(this.w,t.w,e.w),this}clampScalar(t,e){return this.x=ne(this.x,t,e),this.y=ne(this.y,t,e),this.z=ne(this.z,t,e),this.w=ne(this.w,t,e),this}clampLength(t,e){const i=this.length();return this.divideScalar(i||1).multiplyScalar(ne(i,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z+this.w*t.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this.w+=(t.w-this.w)*e,this}lerpVectors(t,e,i){return this.x=t.x+(e.x-t.x)*i,this.y=t.y+(e.y-t.y)*i,this.z=t.z+(e.z-t.z)*i,this.w=t.w+(e.w-t.w)*i,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z&&t.w===this.w}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this.w=t[e+3],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t[e+3]=this.w,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this.w=t.getW(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class x_ extends po{constructor(t=1,e=1,i={}){super(),i=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:Ie,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1},i),this.isRenderTarget=!0,this.width=t,this.height=e,this.depth=i.depth,this.scissor=new de(0,0,t,e),this.scissorTest=!1,this.viewport=new de(0,0,t,e);const s={width:t,height:e,depth:i.depth},r=new hn(s);this.textures=[];const a=i.count;for(let o=0;o<a;o++)this.textures[o]=r.clone(),this.textures[o].isRenderTargetTexture=!0,this.textures[o].renderTarget=this;this._setTextureOptions(i),this.depthBuffer=i.depthBuffer,this.stencilBuffer=i.stencilBuffer,this.resolveDepthBuffer=i.resolveDepthBuffer,this.resolveStencilBuffer=i.resolveStencilBuffer,this._depthTexture=null,this.depthTexture=i.depthTexture,this.samples=i.samples,this.multiview=i.multiview}_setTextureOptions(t={}){const e={minFilter:Ie,generateMipmaps:!1,flipY:!1,internalFormat:null};t.mapping!==void 0&&(e.mapping=t.mapping),t.wrapS!==void 0&&(e.wrapS=t.wrapS),t.wrapT!==void 0&&(e.wrapT=t.wrapT),t.wrapR!==void 0&&(e.wrapR=t.wrapR),t.magFilter!==void 0&&(e.magFilter=t.magFilter),t.minFilter!==void 0&&(e.minFilter=t.minFilter),t.format!==void 0&&(e.format=t.format),t.type!==void 0&&(e.type=t.type),t.anisotropy!==void 0&&(e.anisotropy=t.anisotropy),t.colorSpace!==void 0&&(e.colorSpace=t.colorSpace),t.flipY!==void 0&&(e.flipY=t.flipY),t.generateMipmaps!==void 0&&(e.generateMipmaps=t.generateMipmaps),t.internalFormat!==void 0&&(e.internalFormat=t.internalFormat);for(let i=0;i<this.textures.length;i++)this.textures[i].setValues(e)}get texture(){return this.textures[0]}set texture(t){this.textures[0]=t}set depthTexture(t){this._depthTexture!==null&&(this._depthTexture.renderTarget=null),t!==null&&(t.renderTarget=this),this._depthTexture=t}get depthTexture(){return this._depthTexture}setSize(t,e,i=1){if(this.width!==t||this.height!==e||this.depth!==i){this.width=t,this.height=e,this.depth=i;for(let s=0,r=this.textures.length;s<r;s++)this.textures[s].image.width=t,this.textures[s].image.height=e,this.textures[s].image.depth=i,this.textures[s].isArrayTexture=this.textures[s].image.depth>1;this.dispose()}this.viewport.set(0,0,t,e),this.scissor.set(0,0,t,e)}clone(){return new this.constructor().copy(this)}copy(t){this.width=t.width,this.height=t.height,this.depth=t.depth,this.scissor.copy(t.scissor),this.scissorTest=t.scissorTest,this.viewport.copy(t.viewport),this.textures.length=0;for(let e=0,i=t.textures.length;e<i;e++){this.textures[e]=t.textures[e].clone(),this.textures[e].isRenderTargetTexture=!0,this.textures[e].renderTarget=this;const s=Object.assign({},t.textures[e].image);this.textures[e].source=new Ff(s)}return this.depthBuffer=t.depthBuffer,this.stencilBuffer=t.stencilBuffer,this.resolveDepthBuffer=t.resolveDepthBuffer,this.resolveStencilBuffer=t.resolveStencilBuffer,t.depthTexture!==null&&(this.depthTexture=t.depthTexture.clone()),this.samples=t.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class yn extends x_{constructor(t=1,e=1,i={}){super(t,e,i),this.isWebGLRenderTarget=!0}}class kf extends hn{constructor(t=null,e=1,i=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:t,width:e,height:i,depth:s},this.magFilter=ni,this.minFilter=ni,this.wrapR=Sr,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(t){this.layerUpdates.add(t)}clearLayerUpdates(){this.layerUpdates.clear()}}class __ extends yn{constructor(t=1,e=1,i=1,s={}){super(t,e,s),this.isWebGLArrayRenderTarget=!0,this.depth=i,this.texture=new kf(null,t,e,i),this._setTextureOptions(s),this.texture.isRenderTargetTexture=!0}}class M_ extends hn{constructor(t=null,e=1,i=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:t,width:e,height:i,depth:s},this.magFilter=ni,this.minFilter=ni,this.wrapR=Sr,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class mo{constructor(t=new C(1/0,1/0,1/0),e=new C(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=t,this.max=e}set(t,e){return this.min.copy(t),this.max.copy(e),this}setFromArray(t){this.makeEmpty();for(let e=0,i=t.length;e<i;e+=3)this.expandByPoint(Mi.fromArray(t,e));return this}setFromBufferAttribute(t){this.makeEmpty();for(let e=0,i=t.count;e<i;e++)this.expandByPoint(Mi.fromBufferAttribute(t,e));return this}setFromPoints(t){this.makeEmpty();for(let e=0,i=t.length;e<i;e++)this.expandByPoint(t[e]);return this}setFromCenterAndSize(t,e){const i=Mi.copy(e).multiplyScalar(.5);return this.min.copy(t).sub(i),this.max.copy(t).add(i),this}setFromObject(t,e=!1){return this.makeEmpty(),this.expandByObject(t,e)}clone(){return new this.constructor().copy(this)}copy(t){return this.min.copy(t.min),this.max.copy(t.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(t){return this.isEmpty()?t.set(0,0,0):t.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(t){return this.isEmpty()?t.set(0,0,0):t.subVectors(this.max,this.min)}expandByPoint(t){return this.min.min(t),this.max.max(t),this}expandByVector(t){return this.min.sub(t),this.max.add(t),this}expandByScalar(t){return this.min.addScalar(-t),this.max.addScalar(t),this}expandByObject(t,e=!1){t.updateWorldMatrix(!1,!1);const i=t.geometry;if(i!==void 0){const r=i.getAttribute("position");if(e===!0&&r!==void 0&&t.isInstancedMesh!==!0)for(let a=0,o=r.count;a<o;a++)t.isMesh===!0?t.getVertexPosition(a,Mi):Mi.fromBufferAttribute(r,a),Mi.applyMatrix4(t.matrixWorld),this.expandByPoint(Mi);else t.boundingBox!==void 0?(t.boundingBox===null&&t.computeBoundingBox(),Dc.copy(t.boundingBox)):(i.boundingBox===null&&i.computeBoundingBox(),Dc.copy(i.boundingBox)),Dc.applyMatrix4(t.matrixWorld),this.union(Dc)}const s=t.children;for(let r=0,a=s.length;r<a;r++)this.expandByObject(s[r],e);return this}containsPoint(t){return t.x>=this.min.x&&t.x<=this.max.x&&t.y>=this.min.y&&t.y<=this.max.y&&t.z>=this.min.z&&t.z<=this.max.z}containsBox(t){return this.min.x<=t.min.x&&t.max.x<=this.max.x&&this.min.y<=t.min.y&&t.max.y<=this.max.y&&this.min.z<=t.min.z&&t.max.z<=this.max.z}getParameter(t,e){return e.set((t.x-this.min.x)/(this.max.x-this.min.x),(t.y-this.min.y)/(this.max.y-this.min.y),(t.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(t){return t.max.x>=this.min.x&&t.min.x<=this.max.x&&t.max.y>=this.min.y&&t.min.y<=this.max.y&&t.max.z>=this.min.z&&t.min.z<=this.max.z}intersectsSphere(t){return this.clampPoint(t.center,Mi),Mi.distanceToSquared(t.center)<=t.radius*t.radius}intersectsPlane(t){let e,i;return t.normal.x>0?(e=t.normal.x*this.min.x,i=t.normal.x*this.max.x):(e=t.normal.x*this.max.x,i=t.normal.x*this.min.x),t.normal.y>0?(e+=t.normal.y*this.min.y,i+=t.normal.y*this.max.y):(e+=t.normal.y*this.max.y,i+=t.normal.y*this.min.y),t.normal.z>0?(e+=t.normal.z*this.min.z,i+=t.normal.z*this.max.z):(e+=t.normal.z*this.max.z,i+=t.normal.z*this.min.z),e<=-t.constant&&i>=-t.constant}intersectsTriangle(t){if(this.isEmpty())return!1;this.getCenter(wo),Uc.subVectors(this.max,wo),Kr.subVectors(t.a,wo),Qr.subVectors(t.b,wo),ta.subVectors(t.c,wo),Ls.subVectors(Qr,Kr),Ps.subVectors(ta,Qr),lr.subVectors(Kr,ta);let e=[0,-Ls.z,Ls.y,0,-Ps.z,Ps.y,0,-lr.z,lr.y,Ls.z,0,-Ls.x,Ps.z,0,-Ps.x,lr.z,0,-lr.x,-Ls.y,Ls.x,0,-Ps.y,Ps.x,0,-lr.y,lr.x,0];return!kh(e,Kr,Qr,ta,Uc)||(e=[1,0,0,0,1,0,0,0,1],!kh(e,Kr,Qr,ta,Uc))?!1:(Nc.crossVectors(Ls,Ps),e=[Nc.x,Nc.y,Nc.z],kh(e,Kr,Qr,ta,Uc))}clampPoint(t,e){return e.copy(t).clamp(this.min,this.max)}distanceToPoint(t){return this.clampPoint(t,Mi).distanceTo(t)}getBoundingSphere(t){return this.isEmpty()?t.makeEmpty():(this.getCenter(t.center),t.radius=this.getSize(Mi).length()*.5),t}intersect(t){return this.min.max(t.min),this.max.min(t.max),this.isEmpty()&&this.makeEmpty(),this}union(t){return this.min.min(t.min),this.max.max(t.max),this}applyMatrix4(t){return this.isEmpty()?this:(hs[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(t),hs[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(t),hs[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(t),hs[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(t),hs[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(t),hs[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(t),hs[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(t),hs[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(t),this.setFromPoints(hs),this)}translate(t){return this.min.add(t),this.max.add(t),this}equals(t){return t.min.equals(this.min)&&t.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(t){return this.min.fromArray(t.min),this.max.fromArray(t.max),this}}const hs=[new C,new C,new C,new C,new C,new C,new C,new C],Mi=new C,Dc=new mo,Kr=new C,Qr=new C,ta=new C,Ls=new C,Ps=new C,lr=new C,wo=new C,Uc=new C,Nc=new C,hr=new C;function kh(n,t,e,i,s){for(let r=0,a=n.length-3;r<=a;r+=3){hr.fromArray(n,r);const o=s.x*Math.abs(hr.x)+s.y*Math.abs(hr.y)+s.z*Math.abs(hr.z),c=t.dot(hr),l=e.dot(hr),h=i.dot(hr);if(Math.max(-Math.max(c,l,h),Math.min(c,l,h))>o)return!1}return!0}const b_=new mo,yo=new C,Oh=new C;class rr{constructor(t=new C,e=-1){this.isSphere=!0,this.center=t,this.radius=e}set(t,e){return this.center.copy(t),this.radius=e,this}setFromPoints(t,e){const i=this.center;e!==void 0?i.copy(e):b_.setFromPoints(t).getCenter(i);let s=0;for(let r=0,a=t.length;r<a;r++)s=Math.max(s,i.distanceToSquared(t[r]));return this.radius=Math.sqrt(s),this}copy(t){return this.center.copy(t.center),this.radius=t.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(t){return t.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(t){return t.distanceTo(this.center)-this.radius}intersectsSphere(t){const e=this.radius+t.radius;return t.center.distanceToSquared(this.center)<=e*e}intersectsBox(t){return t.intersectsSphere(this)}intersectsPlane(t){return Math.abs(t.distanceToPoint(this.center))<=this.radius}clampPoint(t,e){const i=this.center.distanceToSquared(t);return e.copy(t),i>this.radius*this.radius&&(e.sub(this.center).normalize(),e.multiplyScalar(this.radius).add(this.center)),e}getBoundingBox(t){return this.isEmpty()?(t.makeEmpty(),t):(t.set(this.center,this.center),t.expandByScalar(this.radius),t)}applyMatrix4(t){return this.center.applyMatrix4(t),this.radius=this.radius*t.getMaxScaleOnAxis(),this}translate(t){return this.center.add(t),this}expandByPoint(t){if(this.isEmpty())return this.center.copy(t),this.radius=0,this;yo.subVectors(t,this.center);const e=yo.lengthSq();if(e>this.radius*this.radius){const i=Math.sqrt(e),s=(i-this.radius)*.5;this.center.addScaledVector(yo,s/i),this.radius+=s}return this}union(t){return t.isEmpty()?this:this.isEmpty()?(this.copy(t),this):(this.center.equals(t.center)===!0?this.radius=Math.max(this.radius,t.radius):(Oh.subVectors(t.center,this.center).setLength(t.radius),this.expandByPoint(yo.copy(t.center).add(Oh)),this.expandByPoint(yo.copy(t.center).sub(Oh))),this)}equals(t){return t.center.equals(this.center)&&t.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(t){return this.radius=t.radius,this.center.fromArray(t.center),this}}const us=new C,Bh=new C,Fc=new C,Is=new C,Hh=new C,kc=new C,zh=new C;class Of{constructor(t=new C,e=new C(0,0,-1)){this.origin=t,this.direction=e}set(t,e){return this.origin.copy(t),this.direction.copy(e),this}copy(t){return this.origin.copy(t.origin),this.direction.copy(t.direction),this}at(t,e){return e.copy(this.origin).addScaledVector(this.direction,t)}lookAt(t){return this.direction.copy(t).sub(this.origin).normalize(),this}recast(t){return this.origin.copy(this.at(t,us)),this}closestPointToPoint(t,e){e.subVectors(t,this.origin);const i=e.dot(this.direction);return i<0?e.copy(this.origin):e.copy(this.origin).addScaledVector(this.direction,i)}distanceToPoint(t){return Math.sqrt(this.distanceSqToPoint(t))}distanceSqToPoint(t){const e=us.subVectors(t,this.origin).dot(this.direction);return e<0?this.origin.distanceToSquared(t):(us.copy(this.origin).addScaledVector(this.direction,e),us.distanceToSquared(t))}distanceSqToSegment(t,e,i,s){Bh.copy(t).add(e).multiplyScalar(.5),Fc.copy(e).sub(t).normalize(),Is.copy(this.origin).sub(Bh);const r=t.distanceTo(e)*.5,a=-this.direction.dot(Fc),o=Is.dot(this.direction),c=-Is.dot(Fc),l=Is.lengthSq(),h=Math.abs(1-a*a);let u,f,d,m;if(h>0)if(u=a*c-o,f=a*o-c,m=r*h,u>=0)if(f>=-m)if(f<=m){const v=1/h;u*=v,f*=v,d=u*(u+a*f+2*o)+f*(a*u+f+2*c)+l}else f=r,u=Math.max(0,-(a*f+o)),d=-u*u+f*(f+2*c)+l;else f=-r,u=Math.max(0,-(a*f+o)),d=-u*u+f*(f+2*c)+l;else f<=-m?(u=Math.max(0,-(-a*r+o)),f=u>0?-r:Math.min(Math.max(-r,-c),r),d=-u*u+f*(f+2*c)+l):f<=m?(u=0,f=Math.min(Math.max(-r,-c),r),d=f*(f+2*c)+l):(u=Math.max(0,-(a*r+o)),f=u>0?r:Math.min(Math.max(-r,-c),r),d=-u*u+f*(f+2*c)+l);else f=a>0?-r:r,u=Math.max(0,-(a*f+o)),d=-u*u+f*(f+2*c)+l;return i&&i.copy(this.origin).addScaledVector(this.direction,u),s&&s.copy(Bh).addScaledVector(Fc,f),d}intersectSphere(t,e){us.subVectors(t.center,this.origin);const i=us.dot(this.direction),s=us.dot(us)-i*i,r=t.radius*t.radius;if(s>r)return null;const a=Math.sqrt(r-s),o=i-a,c=i+a;return c<0?null:o<0?this.at(c,e):this.at(o,e)}intersectsSphere(t){return t.radius<0?!1:this.distanceSqToPoint(t.center)<=t.radius*t.radius}distanceToPlane(t){const e=t.normal.dot(this.direction);if(e===0)return t.distanceToPoint(this.origin)===0?0:null;const i=-(this.origin.dot(t.normal)+t.constant)/e;return i>=0?i:null}intersectPlane(t,e){const i=this.distanceToPlane(t);return i===null?null:this.at(i,e)}intersectsPlane(t){const e=t.distanceToPoint(this.origin);return e===0||t.normal.dot(this.direction)*e<0}intersectBox(t,e){let i,s,r,a,o,c;const l=1/this.direction.x,h=1/this.direction.y,u=1/this.direction.z,f=this.origin;return l>=0?(i=(t.min.x-f.x)*l,s=(t.max.x-f.x)*l):(i=(t.max.x-f.x)*l,s=(t.min.x-f.x)*l),h>=0?(r=(t.min.y-f.y)*h,a=(t.max.y-f.y)*h):(r=(t.max.y-f.y)*h,a=(t.min.y-f.y)*h),i>a||r>s||((r>i||isNaN(i))&&(i=r),(a<s||isNaN(s))&&(s=a),u>=0?(o=(t.min.z-f.z)*u,c=(t.max.z-f.z)*u):(o=(t.max.z-f.z)*u,c=(t.min.z-f.z)*u),i>c||o>s)||((o>i||i!==i)&&(i=o),(c<s||s!==s)&&(s=c),s<0)?null:this.at(i>=0?i:s,e)}intersectsBox(t){return this.intersectBox(t,us)!==null}intersectTriangle(t,e,i,s,r){Hh.subVectors(e,t),kc.subVectors(i,t),zh.crossVectors(Hh,kc);let a=this.direction.dot(zh),o;if(a>0){if(s)return null;o=1}else if(a<0)o=-1,a=-a;else return null;Is.subVectors(this.origin,t);const c=o*this.direction.dot(kc.crossVectors(Is,kc));if(c<0)return null;const l=o*this.direction.dot(Hh.cross(Is));if(l<0||c+l>a)return null;const h=-o*Is.dot(zh);return h<0?null:this.at(h/a,r)}applyMatrix4(t){return this.origin.applyMatrix4(t),this.direction.transformDirection(t),this}equals(t){return t.origin.equals(this.origin)&&t.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class re{constructor(t,e,i,s,r,a,o,c,l,h,u,f,d,m,v,g){re.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],t!==void 0&&this.set(t,e,i,s,r,a,o,c,l,h,u,f,d,m,v,g)}set(t,e,i,s,r,a,o,c,l,h,u,f,d,m,v,g){const p=this.elements;return p[0]=t,p[4]=e,p[8]=i,p[12]=s,p[1]=r,p[5]=a,p[9]=o,p[13]=c,p[2]=l,p[6]=h,p[10]=u,p[14]=f,p[3]=d,p[7]=m,p[11]=v,p[15]=g,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new re().fromArray(this.elements)}copy(t){const e=this.elements,i=t.elements;return e[0]=i[0],e[1]=i[1],e[2]=i[2],e[3]=i[3],e[4]=i[4],e[5]=i[5],e[6]=i[6],e[7]=i[7],e[8]=i[8],e[9]=i[9],e[10]=i[10],e[11]=i[11],e[12]=i[12],e[13]=i[13],e[14]=i[14],e[15]=i[15],this}copyPosition(t){const e=this.elements,i=t.elements;return e[12]=i[12],e[13]=i[13],e[14]=i[14],this}setFromMatrix3(t){const e=t.elements;return this.set(e[0],e[3],e[6],0,e[1],e[4],e[7],0,e[2],e[5],e[8],0,0,0,0,1),this}extractBasis(t,e,i){return t.setFromMatrixColumn(this,0),e.setFromMatrixColumn(this,1),i.setFromMatrixColumn(this,2),this}makeBasis(t,e,i){return this.set(t.x,e.x,i.x,0,t.y,e.y,i.y,0,t.z,e.z,i.z,0,0,0,0,1),this}extractRotation(t){const e=this.elements,i=t.elements,s=1/ea.setFromMatrixColumn(t,0).length(),r=1/ea.setFromMatrixColumn(t,1).length(),a=1/ea.setFromMatrixColumn(t,2).length();return e[0]=i[0]*s,e[1]=i[1]*s,e[2]=i[2]*s,e[3]=0,e[4]=i[4]*r,e[5]=i[5]*r,e[6]=i[6]*r,e[7]=0,e[8]=i[8]*a,e[9]=i[9]*a,e[10]=i[10]*a,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromEuler(t){const e=this.elements,i=t.x,s=t.y,r=t.z,a=Math.cos(i),o=Math.sin(i),c=Math.cos(s),l=Math.sin(s),h=Math.cos(r),u=Math.sin(r);if(t.order==="XYZ"){const f=a*h,d=a*u,m=o*h,v=o*u;e[0]=c*h,e[4]=-c*u,e[8]=l,e[1]=d+m*l,e[5]=f-v*l,e[9]=-o*c,e[2]=v-f*l,e[6]=m+d*l,e[10]=a*c}else if(t.order==="YXZ"){const f=c*h,d=c*u,m=l*h,v=l*u;e[0]=f+v*o,e[4]=m*o-d,e[8]=a*l,e[1]=a*u,e[5]=a*h,e[9]=-o,e[2]=d*o-m,e[6]=v+f*o,e[10]=a*c}else if(t.order==="ZXY"){const f=c*h,d=c*u,m=l*h,v=l*u;e[0]=f-v*o,e[4]=-a*u,e[8]=m+d*o,e[1]=d+m*o,e[5]=a*h,e[9]=v-f*o,e[2]=-a*l,e[6]=o,e[10]=a*c}else if(t.order==="ZYX"){const f=a*h,d=a*u,m=o*h,v=o*u;e[0]=c*h,e[4]=m*l-d,e[8]=f*l+v,e[1]=c*u,e[5]=v*l+f,e[9]=d*l-m,e[2]=-l,e[6]=o*c,e[10]=a*c}else if(t.order==="YZX"){const f=a*c,d=a*l,m=o*c,v=o*l;e[0]=c*h,e[4]=v-f*u,e[8]=m*u+d,e[1]=u,e[5]=a*h,e[9]=-o*h,e[2]=-l*h,e[6]=d*u+m,e[10]=f-v*u}else if(t.order==="XZY"){const f=a*c,d=a*l,m=o*c,v=o*l;e[0]=c*h,e[4]=-u,e[8]=l*h,e[1]=f*u+v,e[5]=a*h,e[9]=d*u-m,e[2]=m*u-d,e[6]=o*h,e[10]=v*u+f}return e[3]=0,e[7]=0,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromQuaternion(t){return this.compose(w_,t,y_)}lookAt(t,e,i){const s=this.elements;return zn.subVectors(t,e),zn.lengthSq()===0&&(zn.z=1),zn.normalize(),Ds.crossVectors(i,zn),Ds.lengthSq()===0&&(Math.abs(i.z)===1?zn.x+=1e-4:zn.z+=1e-4,zn.normalize(),Ds.crossVectors(i,zn)),Ds.normalize(),Oc.crossVectors(zn,Ds),s[0]=Ds.x,s[4]=Oc.x,s[8]=zn.x,s[1]=Ds.y,s[5]=Oc.y,s[9]=zn.y,s[2]=Ds.z,s[6]=Oc.z,s[10]=zn.z,this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const i=t.elements,s=e.elements,r=this.elements,a=i[0],o=i[4],c=i[8],l=i[12],h=i[1],u=i[5],f=i[9],d=i[13],m=i[2],v=i[6],g=i[10],p=i[14],_=i[3],x=i[7],M=i[11],w=i[15],S=s[0],T=s[4],A=s[8],b=s[12],y=s[1],E=s[5],R=s[9],P=s[13],I=s[2],F=s[6],H=s[10],$=s[14],B=s[3],Y=s[7],it=s[11],mt=s[15];return r[0]=a*S+o*y+c*I+l*B,r[4]=a*T+o*E+c*F+l*Y,r[8]=a*A+o*R+c*H+l*it,r[12]=a*b+o*P+c*$+l*mt,r[1]=h*S+u*y+f*I+d*B,r[5]=h*T+u*E+f*F+d*Y,r[9]=h*A+u*R+f*H+d*it,r[13]=h*b+u*P+f*$+d*mt,r[2]=m*S+v*y+g*I+p*B,r[6]=m*T+v*E+g*F+p*Y,r[10]=m*A+v*R+g*H+p*it,r[14]=m*b+v*P+g*$+p*mt,r[3]=_*S+x*y+M*I+w*B,r[7]=_*T+x*E+M*F+w*Y,r[11]=_*A+x*R+M*H+w*it,r[15]=_*b+x*P+M*$+w*mt,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[4]*=t,e[8]*=t,e[12]*=t,e[1]*=t,e[5]*=t,e[9]*=t,e[13]*=t,e[2]*=t,e[6]*=t,e[10]*=t,e[14]*=t,e[3]*=t,e[7]*=t,e[11]*=t,e[15]*=t,this}determinant(){const t=this.elements,e=t[0],i=t[4],s=t[8],r=t[12],a=t[1],o=t[5],c=t[9],l=t[13],h=t[2],u=t[6],f=t[10],d=t[14],m=t[3],v=t[7],g=t[11],p=t[15];return m*(+r*c*u-s*l*u-r*o*f+i*l*f+s*o*d-i*c*d)+v*(+e*c*d-e*l*f+r*a*f-s*a*d+s*l*h-r*c*h)+g*(+e*l*u-e*o*d-r*a*u+i*a*d+r*o*h-i*l*h)+p*(-s*o*h-e*c*u+e*o*f+s*a*u-i*a*f+i*c*h)}transpose(){const t=this.elements;let e;return e=t[1],t[1]=t[4],t[4]=e,e=t[2],t[2]=t[8],t[8]=e,e=t[6],t[6]=t[9],t[9]=e,e=t[3],t[3]=t[12],t[12]=e,e=t[7],t[7]=t[13],t[13]=e,e=t[11],t[11]=t[14],t[14]=e,this}setPosition(t,e,i){const s=this.elements;return t.isVector3?(s[12]=t.x,s[13]=t.y,s[14]=t.z):(s[12]=t,s[13]=e,s[14]=i),this}invert(){const t=this.elements,e=t[0],i=t[1],s=t[2],r=t[3],a=t[4],o=t[5],c=t[6],l=t[7],h=t[8],u=t[9],f=t[10],d=t[11],m=t[12],v=t[13],g=t[14],p=t[15],_=u*g*l-v*f*l+v*c*d-o*g*d-u*c*p+o*f*p,x=m*f*l-h*g*l-m*c*d+a*g*d+h*c*p-a*f*p,M=h*v*l-m*u*l+m*o*d-a*v*d-h*o*p+a*u*p,w=m*u*c-h*v*c-m*o*f+a*v*f+h*o*g-a*u*g,S=e*_+i*x+s*M+r*w;if(S===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const T=1/S;return t[0]=_*T,t[1]=(v*f*r-u*g*r-v*s*d+i*g*d+u*s*p-i*f*p)*T,t[2]=(o*g*r-v*c*r+v*s*l-i*g*l-o*s*p+i*c*p)*T,t[3]=(u*c*r-o*f*r-u*s*l+i*f*l+o*s*d-i*c*d)*T,t[4]=x*T,t[5]=(h*g*r-m*f*r+m*s*d-e*g*d-h*s*p+e*f*p)*T,t[6]=(m*c*r-a*g*r-m*s*l+e*g*l+a*s*p-e*c*p)*T,t[7]=(a*f*r-h*c*r+h*s*l-e*f*l-a*s*d+e*c*d)*T,t[8]=M*T,t[9]=(m*u*r-h*v*r-m*i*d+e*v*d+h*i*p-e*u*p)*T,t[10]=(a*v*r-m*o*r+m*i*l-e*v*l-a*i*p+e*o*p)*T,t[11]=(h*o*r-a*u*r-h*i*l+e*u*l+a*i*d-e*o*d)*T,t[12]=w*T,t[13]=(h*v*s-m*u*s+m*i*f-e*v*f-h*i*g+e*u*g)*T,t[14]=(m*o*s-a*v*s-m*i*c+e*v*c+a*i*g-e*o*g)*T,t[15]=(a*u*s-h*o*s+h*i*c-e*u*c-a*i*f+e*o*f)*T,this}scale(t){const e=this.elements,i=t.x,s=t.y,r=t.z;return e[0]*=i,e[4]*=s,e[8]*=r,e[1]*=i,e[5]*=s,e[9]*=r,e[2]*=i,e[6]*=s,e[10]*=r,e[3]*=i,e[7]*=s,e[11]*=r,this}getMaxScaleOnAxis(){const t=this.elements,e=t[0]*t[0]+t[1]*t[1]+t[2]*t[2],i=t[4]*t[4]+t[5]*t[5]+t[6]*t[6],s=t[8]*t[8]+t[9]*t[9]+t[10]*t[10];return Math.sqrt(Math.max(e,i,s))}makeTranslation(t,e,i){return t.isVector3?this.set(1,0,0,t.x,0,1,0,t.y,0,0,1,t.z,0,0,0,1):this.set(1,0,0,t,0,1,0,e,0,0,1,i,0,0,0,1),this}makeRotationX(t){const e=Math.cos(t),i=Math.sin(t);return this.set(1,0,0,0,0,e,-i,0,0,i,e,0,0,0,0,1),this}makeRotationY(t){const e=Math.cos(t),i=Math.sin(t);return this.set(e,0,i,0,0,1,0,0,-i,0,e,0,0,0,0,1),this}makeRotationZ(t){const e=Math.cos(t),i=Math.sin(t);return this.set(e,-i,0,0,i,e,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(t,e){const i=Math.cos(e),s=Math.sin(e),r=1-i,a=t.x,o=t.y,c=t.z,l=r*a,h=r*o;return this.set(l*a+i,l*o-s*c,l*c+s*o,0,l*o+s*c,h*o+i,h*c-s*a,0,l*c-s*o,h*c+s*a,r*c*c+i,0,0,0,0,1),this}makeScale(t,e,i){return this.set(t,0,0,0,0,e,0,0,0,0,i,0,0,0,0,1),this}makeShear(t,e,i,s,r,a){return this.set(1,i,r,0,t,1,a,0,e,s,1,0,0,0,0,1),this}compose(t,e,i){const s=this.elements,r=e._x,a=e._y,o=e._z,c=e._w,l=r+r,h=a+a,u=o+o,f=r*l,d=r*h,m=r*u,v=a*h,g=a*u,p=o*u,_=c*l,x=c*h,M=c*u,w=i.x,S=i.y,T=i.z;return s[0]=(1-(v+p))*w,s[1]=(d+M)*w,s[2]=(m-x)*w,s[3]=0,s[4]=(d-M)*S,s[5]=(1-(f+p))*S,s[6]=(g+_)*S,s[7]=0,s[8]=(m+x)*T,s[9]=(g-_)*T,s[10]=(1-(f+v))*T,s[11]=0,s[12]=t.x,s[13]=t.y,s[14]=t.z,s[15]=1,this}decompose(t,e,i){const s=this.elements;let r=ea.set(s[0],s[1],s[2]).length();const a=ea.set(s[4],s[5],s[6]).length(),o=ea.set(s[8],s[9],s[10]).length();this.determinant()<0&&(r=-r),t.x=s[12],t.y=s[13],t.z=s[14],bi.copy(this);const l=1/r,h=1/a,u=1/o;return bi.elements[0]*=l,bi.elements[1]*=l,bi.elements[2]*=l,bi.elements[4]*=h,bi.elements[5]*=h,bi.elements[6]*=h,bi.elements[8]*=u,bi.elements[9]*=u,bi.elements[10]*=u,e.setFromRotationMatrix(bi),i.x=r,i.y=a,i.z=o,this}makePerspective(t,e,i,s,r,a,o=ns,c=!1){const l=this.elements,h=2*r/(e-t),u=2*r/(i-s),f=(e+t)/(e-t),d=(i+s)/(i-s);let m,v;if(c)m=r/(a-r),v=a*r/(a-r);else if(o===ns)m=-(a+r)/(a-r),v=-2*a*r/(a-r);else if(o===Xl)m=-a/(a-r),v=-a*r/(a-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+o);return l[0]=h,l[4]=0,l[8]=f,l[12]=0,l[1]=0,l[5]=u,l[9]=d,l[13]=0,l[2]=0,l[6]=0,l[10]=m,l[14]=v,l[3]=0,l[7]=0,l[11]=-1,l[15]=0,this}makeOrthographic(t,e,i,s,r,a,o=ns,c=!1){const l=this.elements,h=2/(e-t),u=2/(i-s),f=-(e+t)/(e-t),d=-(i+s)/(i-s);let m,v;if(c)m=1/(a-r),v=a/(a-r);else if(o===ns)m=-2/(a-r),v=-(a+r)/(a-r);else if(o===Xl)m=-1/(a-r),v=-r/(a-r);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+o);return l[0]=h,l[4]=0,l[8]=0,l[12]=f,l[1]=0,l[5]=u,l[9]=0,l[13]=d,l[2]=0,l[6]=0,l[10]=m,l[14]=v,l[3]=0,l[7]=0,l[11]=0,l[15]=1,this}equals(t){const e=this.elements,i=t.elements;for(let s=0;s<16;s++)if(e[s]!==i[s])return!1;return!0}fromArray(t,e=0){for(let i=0;i<16;i++)this.elements[i]=t[i+e];return this}toArray(t=[],e=0){const i=this.elements;return t[e]=i[0],t[e+1]=i[1],t[e+2]=i[2],t[e+3]=i[3],t[e+4]=i[4],t[e+5]=i[5],t[e+6]=i[6],t[e+7]=i[7],t[e+8]=i[8],t[e+9]=i[9],t[e+10]=i[10],t[e+11]=i[11],t[e+12]=i[12],t[e+13]=i[13],t[e+14]=i[14],t[e+15]=i[15],t}}const ea=new C,bi=new re,w_=new C(0,0,0),y_=new C(1,1,1),Ds=new C,Oc=new C,zn=new C,t1=new re,e1=new le;class Tn{constructor(t=0,e=0,i=0,s=Tn.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=e,this._z=i,this._order=s}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get order(){return this._order}set order(t){this._order=t,this._onChangeCallback()}set(t,e,i,s=this._order){return this._x=t,this._y=e,this._z=i,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(t){return this._x=t._x,this._y=t._y,this._z=t._z,this._order=t._order,this._onChangeCallback(),this}setFromRotationMatrix(t,e=this._order,i=!0){const s=t.elements,r=s[0],a=s[4],o=s[8],c=s[1],l=s[5],h=s[9],u=s[2],f=s[6],d=s[10];switch(e){case"XYZ":this._y=Math.asin(ne(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-h,d),this._z=Math.atan2(-a,r)):(this._x=Math.atan2(f,l),this._z=0);break;case"YXZ":this._x=Math.asin(-ne(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(o,d),this._z=Math.atan2(c,l)):(this._y=Math.atan2(-u,r),this._z=0);break;case"ZXY":this._x=Math.asin(ne(f,-1,1)),Math.abs(f)<.9999999?(this._y=Math.atan2(-u,d),this._z=Math.atan2(-a,l)):(this._y=0,this._z=Math.atan2(c,r));break;case"ZYX":this._y=Math.asin(-ne(u,-1,1)),Math.abs(u)<.9999999?(this._x=Math.atan2(f,d),this._z=Math.atan2(c,r)):(this._x=0,this._z=Math.atan2(-a,l));break;case"YZX":this._z=Math.asin(ne(c,-1,1)),Math.abs(c)<.9999999?(this._x=Math.atan2(-h,l),this._y=Math.atan2(-u,r)):(this._x=0,this._y=Math.atan2(o,d));break;case"XZY":this._z=Math.asin(-ne(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(f,l),this._y=Math.atan2(o,r)):(this._x=Math.atan2(-h,d),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+e)}return this._order=e,i===!0&&this._onChangeCallback(),this}setFromQuaternion(t,e,i){return t1.makeRotationFromQuaternion(t),this.setFromRotationMatrix(t1,e,i)}setFromVector3(t,e=this._order){return this.set(t.x,t.y,t.z,e)}reorder(t){return e1.setFromEuler(this),this.setFromQuaternion(e1,t)}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._order===this._order}fromArray(t){return this._x=t[0],this._y=t[1],this._z=t[2],t[3]!==void 0&&(this._order=t[3]),this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._order,t}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}Tn.DEFAULT_ORDER="XYZ";class fg{constructor(){this.mask=1}set(t){this.mask=(1<<t|0)>>>0}enable(t){this.mask|=1<<t|0}enableAll(){this.mask=-1}toggle(t){this.mask^=1<<t|0}disable(t){this.mask&=~(1<<t|0)}disableAll(){this.mask=0}test(t){return(this.mask&t.mask)!==0}isEnabled(t){return(this.mask&(1<<t|0))!==0}}let S_=0;const n1=new C,na=new le,fs=new re,Bc=new C,So=new C,E_=new C,T_=new le,i1=new C(1,0,0),s1=new C(0,1,0),r1=new C(0,0,1),a1={type:"added"},A_={type:"removed"},ia={type:"childadded",child:null},Vh={type:"childremoved",child:null};class ze extends po{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:S_++}),this.uuid=Ni(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=ze.DEFAULT_UP.clone();const t=new C,e=new Tn,i=new le,s=new C(1,1,1);function r(){i.setFromEuler(e,!1)}function a(){e.setFromQuaternion(i,void 0,!1)}e._onChange(r),i._onChange(a),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:e},quaternion:{configurable:!0,enumerable:!0,value:i},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new re},normalMatrix:{value:new oe}}),this.matrix=new re,this.matrixWorld=new re,this.matrixAutoUpdate=ze.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=ze.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new fg,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(t){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(t),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(t){return this.quaternion.premultiply(t),this}setRotationFromAxisAngle(t,e){this.quaternion.setFromAxisAngle(t,e)}setRotationFromEuler(t){this.quaternion.setFromEuler(t,!0)}setRotationFromMatrix(t){this.quaternion.setFromRotationMatrix(t)}setRotationFromQuaternion(t){this.quaternion.copy(t)}rotateOnAxis(t,e){return na.setFromAxisAngle(t,e),this.quaternion.multiply(na),this}rotateOnWorldAxis(t,e){return na.setFromAxisAngle(t,e),this.quaternion.premultiply(na),this}rotateX(t){return this.rotateOnAxis(i1,t)}rotateY(t){return this.rotateOnAxis(s1,t)}rotateZ(t){return this.rotateOnAxis(r1,t)}translateOnAxis(t,e){return n1.copy(t).applyQuaternion(this.quaternion),this.position.add(n1.multiplyScalar(e)),this}translateX(t){return this.translateOnAxis(i1,t)}translateY(t){return this.translateOnAxis(s1,t)}translateZ(t){return this.translateOnAxis(r1,t)}localToWorld(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(this.matrixWorld)}worldToLocal(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(fs.copy(this.matrixWorld).invert())}lookAt(t,e,i){t.isVector3?Bc.copy(t):Bc.set(t,e,i);const s=this.parent;this.updateWorldMatrix(!0,!1),So.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?fs.lookAt(So,Bc,this.up):fs.lookAt(Bc,So,this.up),this.quaternion.setFromRotationMatrix(fs),s&&(fs.extractRotation(s.matrixWorld),na.setFromRotationMatrix(fs),this.quaternion.premultiply(na.invert()))}add(t){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.add(arguments[e]);return this}return t===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",t),this):(t&&t.isObject3D?(t.removeFromParent(),t.parent=this,this.children.push(t),t.dispatchEvent(a1),ia.child=t,this.dispatchEvent(ia),ia.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",t),this)}remove(t){if(arguments.length>1){for(let i=0;i<arguments.length;i++)this.remove(arguments[i]);return this}const e=this.children.indexOf(t);return e!==-1&&(t.parent=null,this.children.splice(e,1),t.dispatchEvent(A_),Vh.child=t,this.dispatchEvent(Vh),Vh.child=null),this}removeFromParent(){const t=this.parent;return t!==null&&t.remove(this),this}clear(){return this.remove(...this.children)}attach(t){return this.updateWorldMatrix(!0,!1),fs.copy(this.matrixWorld).invert(),t.parent!==null&&(t.parent.updateWorldMatrix(!0,!1),fs.multiply(t.parent.matrixWorld)),t.applyMatrix4(fs),t.removeFromParent(),t.parent=this,this.children.push(t),t.updateWorldMatrix(!1,!0),t.dispatchEvent(a1),ia.child=t,this.dispatchEvent(ia),ia.child=null,this}getObjectById(t){return this.getObjectByProperty("id",t)}getObjectByName(t){return this.getObjectByProperty("name",t)}getObjectByProperty(t,e){if(this[t]===e)return this;for(let i=0,s=this.children.length;i<s;i++){const a=this.children[i].getObjectByProperty(t,e);if(a!==void 0)return a}}getObjectsByProperty(t,e,i=[]){this[t]===e&&i.push(this);const s=this.children;for(let r=0,a=s.length;r<a;r++)s[r].getObjectsByProperty(t,e,i);return i}getWorldPosition(t){return this.updateWorldMatrix(!0,!1),t.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(So,t,E_),t}getWorldScale(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(So,T_,t),t}getWorldDirection(t){this.updateWorldMatrix(!0,!1);const e=this.matrixWorld.elements;return t.set(e[8],e[9],e[10]).normalize()}raycast(){}traverse(t){t(this);const e=this.children;for(let i=0,s=e.length;i<s;i++)e[i].traverse(t)}traverseVisible(t){if(this.visible===!1)return;t(this);const e=this.children;for(let i=0,s=e.length;i<s;i++)e[i].traverseVisible(t)}traverseAncestors(t){const e=this.parent;e!==null&&(t(e),e.traverseAncestors(t))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(t){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||t)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,t=!0);const e=this.children;for(let i=0,s=e.length;i<s;i++)e[i].updateMatrixWorld(t)}updateWorldMatrix(t,e){const i=this.parent;if(t===!0&&i!==null&&i.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),e===!0){const s=this.children;for(let r=0,a=s.length;r<a;r++)s[r].updateWorldMatrix(!1,!0)}}toJSON(t){const e=t===void 0||typeof t=="string",i={};e&&(t={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},i.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});const s={};s.uuid=this.uuid,s.type=this.type,this.name!==""&&(s.name=this.name),this.castShadow===!0&&(s.castShadow=!0),this.receiveShadow===!0&&(s.receiveShadow=!0),this.visible===!1&&(s.visible=!1),this.frustumCulled===!1&&(s.frustumCulled=!1),this.renderOrder!==0&&(s.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(s.matrixAutoUpdate=!1),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.geometryInfo=this._geometryInfo.map(o=>({...o,boundingBox:o.boundingBox?o.boundingBox.toJSON():void 0,boundingSphere:o.boundingSphere?o.boundingSphere.toJSON():void 0})),s.instanceInfo=this._instanceInfo.map(o=>({...o})),s.availableInstanceIds=this._availableInstanceIds.slice(),s.availableGeometryIds=this._availableGeometryIds.slice(),s.nextIndexStart=this._nextIndexStart,s.nextVertexStart=this._nextVertexStart,s.geometryCount=this._geometryCount,s.maxInstanceCount=this._maxInstanceCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.matricesTexture=this._matricesTexture.toJSON(t),s.indirectTexture=this._indirectTexture.toJSON(t),this._colorsTexture!==null&&(s.colorsTexture=this._colorsTexture.toJSON(t)),this.boundingSphere!==null&&(s.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(s.boundingBox=this.boundingBox.toJSON()));function r(o,c){return o[c.uuid]===void 0&&(o[c.uuid]=c.toJSON(t)),c.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(t).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(t).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=r(t.geometries,this.geometry);const o=this.geometry.parameters;if(o!==void 0&&o.shapes!==void 0){const c=o.shapes;if(Array.isArray(c))for(let l=0,h=c.length;l<h;l++){const u=c[l];r(t.shapes,u)}else r(t.shapes,c)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(t.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const o=[];for(let c=0,l=this.material.length;c<l;c++)o.push(r(t.materials,this.material[c]));s.material=o}else s.material=r(t.materials,this.material);if(this.children.length>0){s.children=[];for(let o=0;o<this.children.length;o++)s.children.push(this.children[o].toJSON(t).object)}if(this.animations.length>0){s.animations=[];for(let o=0;o<this.animations.length;o++){const c=this.animations[o];s.animations.push(r(t.animations,c))}}if(e){const o=a(t.geometries),c=a(t.materials),l=a(t.textures),h=a(t.images),u=a(t.shapes),f=a(t.skeletons),d=a(t.animations),m=a(t.nodes);o.length>0&&(i.geometries=o),c.length>0&&(i.materials=c),l.length>0&&(i.textures=l),h.length>0&&(i.images=h),u.length>0&&(i.shapes=u),f.length>0&&(i.skeletons=f),d.length>0&&(i.animations=d),m.length>0&&(i.nodes=m)}return i.object=s,i;function a(o){const c=[];for(const l in o){const h=o[l];delete h.metadata,c.push(h)}return c}}clone(t){return new this.constructor().copy(this,t)}copy(t,e=!0){if(this.name=t.name,this.up.copy(t.up),this.position.copy(t.position),this.rotation.order=t.rotation.order,this.quaternion.copy(t.quaternion),this.scale.copy(t.scale),this.matrix.copy(t.matrix),this.matrixWorld.copy(t.matrixWorld),this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrixWorldAutoUpdate=t.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=t.matrixWorldNeedsUpdate,this.layers.mask=t.layers.mask,this.visible=t.visible,this.castShadow=t.castShadow,this.receiveShadow=t.receiveShadow,this.frustumCulled=t.frustumCulled,this.renderOrder=t.renderOrder,this.animations=t.animations.slice(),this.userData=JSON.parse(JSON.stringify(t.userData)),e===!0)for(let i=0;i<t.children.length;i++){const s=t.children[i];this.add(s.clone())}return this}}ze.DEFAULT_UP=new C(0,1,0);ze.DEFAULT_MATRIX_AUTO_UPDATE=!0;ze.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const wi=new C,ds=new C,Gh=new C,ps=new C,sa=new C,ra=new C,o1=new C,Wh=new C,Xh=new C,qh=new C,$h=new de,Yh=new de,jh=new de;class pi{constructor(t=new C,e=new C,i=new C){this.a=t,this.b=e,this.c=i}static getNormal(t,e,i,s){s.subVectors(i,e),wi.subVectors(t,e),s.cross(wi);const r=s.lengthSq();return r>0?s.multiplyScalar(1/Math.sqrt(r)):s.set(0,0,0)}static getBarycoord(t,e,i,s,r){wi.subVectors(s,e),ds.subVectors(i,e),Gh.subVectors(t,e);const a=wi.dot(wi),o=wi.dot(ds),c=wi.dot(Gh),l=ds.dot(ds),h=ds.dot(Gh),u=a*l-o*o;if(u===0)return r.set(0,0,0),null;const f=1/u,d=(l*c-o*h)*f,m=(a*h-o*c)*f;return r.set(1-d-m,m,d)}static containsPoint(t,e,i,s){return this.getBarycoord(t,e,i,s,ps)===null?!1:ps.x>=0&&ps.y>=0&&ps.x+ps.y<=1}static getInterpolation(t,e,i,s,r,a,o,c){return this.getBarycoord(t,e,i,s,ps)===null?(c.x=0,c.y=0,"z"in c&&(c.z=0),"w"in c&&(c.w=0),null):(c.setScalar(0),c.addScaledVector(r,ps.x),c.addScaledVector(a,ps.y),c.addScaledVector(o,ps.z),c)}static getInterpolatedAttribute(t,e,i,s,r,a){return $h.setScalar(0),Yh.setScalar(0),jh.setScalar(0),$h.fromBufferAttribute(t,e),Yh.fromBufferAttribute(t,i),jh.fromBufferAttribute(t,s),a.setScalar(0),a.addScaledVector($h,r.x),a.addScaledVector(Yh,r.y),a.addScaledVector(jh,r.z),a}static isFrontFacing(t,e,i,s){return wi.subVectors(i,e),ds.subVectors(t,e),wi.cross(ds).dot(s)<0}set(t,e,i){return this.a.copy(t),this.b.copy(e),this.c.copy(i),this}setFromPointsAndIndices(t,e,i,s){return this.a.copy(t[e]),this.b.copy(t[i]),this.c.copy(t[s]),this}setFromAttributeAndIndices(t,e,i,s){return this.a.fromBufferAttribute(t,e),this.b.fromBufferAttribute(t,i),this.c.fromBufferAttribute(t,s),this}clone(){return new this.constructor().copy(this)}copy(t){return this.a.copy(t.a),this.b.copy(t.b),this.c.copy(t.c),this}getArea(){return wi.subVectors(this.c,this.b),ds.subVectors(this.a,this.b),wi.cross(ds).length()*.5}getMidpoint(t){return t.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(t){return pi.getNormal(this.a,this.b,this.c,t)}getPlane(t){return t.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,e){return pi.getBarycoord(t,this.a,this.b,this.c,e)}getInterpolation(t,e,i,s,r){return pi.getInterpolation(t,this.a,this.b,this.c,e,i,s,r)}containsPoint(t){return pi.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return pi.isFrontFacing(this.a,this.b,this.c,t)}intersectsBox(t){return t.intersectsTriangle(this)}closestPointToPoint(t,e){const i=this.a,s=this.b,r=this.c;let a,o;sa.subVectors(s,i),ra.subVectors(r,i),Wh.subVectors(t,i);const c=sa.dot(Wh),l=ra.dot(Wh);if(c<=0&&l<=0)return e.copy(i);Xh.subVectors(t,s);const h=sa.dot(Xh),u=ra.dot(Xh);if(h>=0&&u<=h)return e.copy(s);const f=c*u-h*l;if(f<=0&&c>=0&&h<=0)return a=c/(c-h),e.copy(i).addScaledVector(sa,a);qh.subVectors(t,r);const d=sa.dot(qh),m=ra.dot(qh);if(m>=0&&d<=m)return e.copy(r);const v=d*l-c*m;if(v<=0&&l>=0&&m<=0)return o=l/(l-m),e.copy(i).addScaledVector(ra,o);const g=h*m-d*u;if(g<=0&&u-h>=0&&d-m>=0)return o1.subVectors(r,s),o=(u-h)/(u-h+(d-m)),e.copy(s).addScaledVector(o1,o);const p=1/(g+v+f);return a=v*p,o=f*p,e.copy(i).addScaledVector(sa,a).addScaledVector(ra,o)}equals(t){return t.a.equals(this.a)&&t.b.equals(this.b)&&t.c.equals(this.c)}}const dg={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Us={h:0,s:0,l:0},Hc={h:0,s:0,l:0};function Zh(n,t,e){return e<0&&(e+=1),e>1&&(e-=1),e<1/6?n+(t-n)*6*e:e<1/2?t:e<2/3?n+(t-n)*6*(2/3-e):n}class gt{constructor(t,e,i){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(t,e,i)}set(t,e,i){if(e===void 0&&i===void 0){const s=t;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(t,e,i);return this}setScalar(t){return this.r=t,this.g=t,this.b=t,this}setHex(t,e=gn){return t=Math.floor(t),this.r=(t>>16&255)/255,this.g=(t>>8&255)/255,this.b=(t&255)/255,ge.colorSpaceToWorking(this,e),this}setRGB(t,e,i,s=ge.workingColorSpace){return this.r=t,this.g=e,this.b=i,ge.colorSpaceToWorking(this,s),this}setHSL(t,e,i,s=ge.workingColorSpace){if(t=Nf(t,1),e=ne(e,0,1),i=ne(i,0,1),e===0)this.r=this.g=this.b=i;else{const r=i<=.5?i*(1+e):i+e-i*e,a=2*i-r;this.r=Zh(a,r,t+1/3),this.g=Zh(a,r,t),this.b=Zh(a,r,t-1/3)}return ge.colorSpaceToWorking(this,s),this}setStyle(t,e=gn){function i(r){r!==void 0&&parseFloat(r)<1&&console.warn("THREE.Color: Alpha component of "+t+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(t)){let r;const a=s[1],o=s[2];switch(a){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return i(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,e);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return i(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,e);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return i(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,e);break;default:console.warn("THREE.Color: Unknown color model "+t)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(t)){const r=s[1],a=r.length;if(a===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,e);if(a===6)return this.setHex(parseInt(r,16),e);console.warn("THREE.Color: Invalid hex color "+t)}else if(t&&t.length>0)return this.setColorName(t,e);return this}setColorName(t,e=gn){const i=dg[t.toLowerCase()];return i!==void 0?this.setHex(i,e):console.warn("THREE.Color: Unknown color "+t),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(t){return this.r=t.r,this.g=t.g,this.b=t.b,this}copySRGBToLinear(t){return this.r=Ts(t.r),this.g=Ts(t.g),this.b=Ts(t.b),this}copyLinearToSRGB(t){return this.r=Va(t.r),this.g=Va(t.g),this.b=Va(t.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(t=gn){return ge.workingToColorSpace(fn.copy(this),t),Math.round(ne(fn.r*255,0,255))*65536+Math.round(ne(fn.g*255,0,255))*256+Math.round(ne(fn.b*255,0,255))}getHexString(t=gn){return("000000"+this.getHex(t).toString(16)).slice(-6)}getHSL(t,e=ge.workingColorSpace){ge.workingToColorSpace(fn.copy(this),e);const i=fn.r,s=fn.g,r=fn.b,a=Math.max(i,s,r),o=Math.min(i,s,r);let c,l;const h=(o+a)/2;if(o===a)c=0,l=0;else{const u=a-o;switch(l=h<=.5?u/(a+o):u/(2-a-o),a){case i:c=(s-r)/u+(s<r?6:0);break;case s:c=(r-i)/u+2;break;case r:c=(i-s)/u+4;break}c/=6}return t.h=c,t.s=l,t.l=h,t}getRGB(t,e=ge.workingColorSpace){return ge.workingToColorSpace(fn.copy(this),e),t.r=fn.r,t.g=fn.g,t.b=fn.b,t}getStyle(t=gn){ge.workingToColorSpace(fn.copy(this),t);const e=fn.r,i=fn.g,s=fn.b;return t!==gn?`color(${t} ${e.toFixed(3)} ${i.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(e*255)},${Math.round(i*255)},${Math.round(s*255)})`}offsetHSL(t,e,i){return this.getHSL(Us),this.setHSL(Us.h+t,Us.s+e,Us.l+i)}add(t){return this.r+=t.r,this.g+=t.g,this.b+=t.b,this}addColors(t,e){return this.r=t.r+e.r,this.g=t.g+e.g,this.b=t.b+e.b,this}addScalar(t){return this.r+=t,this.g+=t,this.b+=t,this}sub(t){return this.r=Math.max(0,this.r-t.r),this.g=Math.max(0,this.g-t.g),this.b=Math.max(0,this.b-t.b),this}multiply(t){return this.r*=t.r,this.g*=t.g,this.b*=t.b,this}multiplyScalar(t){return this.r*=t,this.g*=t,this.b*=t,this}lerp(t,e){return this.r+=(t.r-this.r)*e,this.g+=(t.g-this.g)*e,this.b+=(t.b-this.b)*e,this}lerpColors(t,e,i){return this.r=t.r+(e.r-t.r)*i,this.g=t.g+(e.g-t.g)*i,this.b=t.b+(e.b-t.b)*i,this}lerpHSL(t,e){this.getHSL(Us),t.getHSL(Hc);const i=Xo(Us.h,Hc.h,e),s=Xo(Us.s,Hc.s,e),r=Xo(Us.l,Hc.l,e);return this.setHSL(i,s,r),this}setFromVector3(t){return this.r=t.x,this.g=t.y,this.b=t.z,this}applyMatrix3(t){const e=this.r,i=this.g,s=this.b,r=t.elements;return this.r=r[0]*e+r[3]*i+r[6]*s,this.g=r[1]*e+r[4]*i+r[7]*s,this.b=r[2]*e+r[5]*i+r[8]*s,this}equals(t){return t.r===this.r&&t.g===this.g&&t.b===this.b}fromArray(t,e=0){return this.r=t[e],this.g=t[e+1],this.b=t[e+2],this}toArray(t=[],e=0){return t[e]=this.r,t[e+1]=this.g,t[e+2]=this.b,t}fromBufferAttribute(t,e){return this.r=t.getX(e),this.g=t.getY(e),this.b=t.getZ(e),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const fn=new gt;gt.NAMES=dg;let R_=0;class qr extends po{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:R_++}),this.uuid=Ni(),this.name="",this.type="Material",this.blending=za,this.side=ir,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=tu,this.blendDst=eu,this.blendEquation=wr,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new gt(0,0,0),this.blendAlpha=0,this.depthFunc=eo,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=$d,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Zr,this.stencilZFail=Zr,this.stencilZPass=Zr,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(t){this._alphaTest>0!=t>0&&this.version++,this._alphaTest=t}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(t){if(t!==void 0)for(const e in t){const i=t[e];if(i===void 0){console.warn(`THREE.Material: parameter '${e}' has value of undefined.`);continue}const s=this[e];if(s===void 0){console.warn(`THREE.Material: '${e}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(i):s&&s.isVector3&&i&&i.isVector3?s.copy(i):this[e]=i}}toJSON(t){const e=t===void 0||typeof t=="string";e&&(t={textures:{},images:{}});const i={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};i.uuid=this.uuid,i.type=this.type,this.name!==""&&(i.name=this.name),this.color&&this.color.isColor&&(i.color=this.color.getHex()),this.roughness!==void 0&&(i.roughness=this.roughness),this.metalness!==void 0&&(i.metalness=this.metalness),this.sheen!==void 0&&(i.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(i.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(i.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(i.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(i.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(i.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(i.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(i.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(i.shininess=this.shininess),this.clearcoat!==void 0&&(i.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(i.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(i.clearcoatMap=this.clearcoatMap.toJSON(t).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(i.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(t).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(i.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(t).uuid,i.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(i.sheenColorMap=this.sheenColorMap.toJSON(t).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(i.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(t).uuid),this.dispersion!==void 0&&(i.dispersion=this.dispersion),this.iridescence!==void 0&&(i.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(i.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(i.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(i.iridescenceMap=this.iridescenceMap.toJSON(t).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(i.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(t).uuid),this.anisotropy!==void 0&&(i.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(i.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(i.anisotropyMap=this.anisotropyMap.toJSON(t).uuid),this.map&&this.map.isTexture&&(i.map=this.map.toJSON(t).uuid),this.matcap&&this.matcap.isTexture&&(i.matcap=this.matcap.toJSON(t).uuid),this.alphaMap&&this.alphaMap.isTexture&&(i.alphaMap=this.alphaMap.toJSON(t).uuid),this.lightMap&&this.lightMap.isTexture&&(i.lightMap=this.lightMap.toJSON(t).uuid,i.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(i.aoMap=this.aoMap.toJSON(t).uuid,i.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(i.bumpMap=this.bumpMap.toJSON(t).uuid,i.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(i.normalMap=this.normalMap.toJSON(t).uuid,i.normalMapType=this.normalMapType,i.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(i.displacementMap=this.displacementMap.toJSON(t).uuid,i.displacementScale=this.displacementScale,i.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(i.roughnessMap=this.roughnessMap.toJSON(t).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(i.metalnessMap=this.metalnessMap.toJSON(t).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(i.emissiveMap=this.emissiveMap.toJSON(t).uuid),this.specularMap&&this.specularMap.isTexture&&(i.specularMap=this.specularMap.toJSON(t).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(i.specularIntensityMap=this.specularIntensityMap.toJSON(t).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(i.specularColorMap=this.specularColorMap.toJSON(t).uuid),this.envMap&&this.envMap.isTexture&&(i.envMap=this.envMap.toJSON(t).uuid,this.combine!==void 0&&(i.combine=this.combine)),this.envMapRotation!==void 0&&(i.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(i.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(i.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(i.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(i.gradientMap=this.gradientMap.toJSON(t).uuid),this.transmission!==void 0&&(i.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(i.transmissionMap=this.transmissionMap.toJSON(t).uuid),this.thickness!==void 0&&(i.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(i.thicknessMap=this.thicknessMap.toJSON(t).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(i.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(i.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(i.size=this.size),this.shadowSide!==null&&(i.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(i.sizeAttenuation=this.sizeAttenuation),this.blending!==za&&(i.blending=this.blending),this.side!==ir&&(i.side=this.side),this.vertexColors===!0&&(i.vertexColors=!0),this.opacity<1&&(i.opacity=this.opacity),this.transparent===!0&&(i.transparent=!0),this.blendSrc!==tu&&(i.blendSrc=this.blendSrc),this.blendDst!==eu&&(i.blendDst=this.blendDst),this.blendEquation!==wr&&(i.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(i.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(i.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(i.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(i.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(i.blendAlpha=this.blendAlpha),this.depthFunc!==eo&&(i.depthFunc=this.depthFunc),this.depthTest===!1&&(i.depthTest=this.depthTest),this.depthWrite===!1&&(i.depthWrite=this.depthWrite),this.colorWrite===!1&&(i.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(i.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==$d&&(i.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(i.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(i.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==Zr&&(i.stencilFail=this.stencilFail),this.stencilZFail!==Zr&&(i.stencilZFail=this.stencilZFail),this.stencilZPass!==Zr&&(i.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(i.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(i.rotation=this.rotation),this.polygonOffset===!0&&(i.polygonOffset=!0),this.polygonOffsetFactor!==0&&(i.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(i.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(i.linewidth=this.linewidth),this.dashSize!==void 0&&(i.dashSize=this.dashSize),this.gapSize!==void 0&&(i.gapSize=this.gapSize),this.scale!==void 0&&(i.scale=this.scale),this.dithering===!0&&(i.dithering=!0),this.alphaTest>0&&(i.alphaTest=this.alphaTest),this.alphaHash===!0&&(i.alphaHash=!0),this.alphaToCoverage===!0&&(i.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(i.premultipliedAlpha=!0),this.forceSinglePass===!0&&(i.forceSinglePass=!0),this.wireframe===!0&&(i.wireframe=!0),this.wireframeLinewidth>1&&(i.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(i.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(i.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(i.flatShading=!0),this.visible===!1&&(i.visible=!1),this.toneMapped===!1&&(i.toneMapped=!1),this.fog===!1&&(i.fog=!1),Object.keys(this.userData).length>0&&(i.userData=this.userData);function s(r){const a=[];for(const o in r){const c=r[o];delete c.metadata,a.push(c)}return a}if(e){const r=s(t.textures),a=s(t.images);r.length>0&&(i.textures=r),a.length>0&&(i.images=a)}return i}clone(){return new this.constructor().copy(this)}copy(t){this.name=t.name,this.blending=t.blending,this.side=t.side,this.vertexColors=t.vertexColors,this.opacity=t.opacity,this.transparent=t.transparent,this.blendSrc=t.blendSrc,this.blendDst=t.blendDst,this.blendEquation=t.blendEquation,this.blendSrcAlpha=t.blendSrcAlpha,this.blendDstAlpha=t.blendDstAlpha,this.blendEquationAlpha=t.blendEquationAlpha,this.blendColor.copy(t.blendColor),this.blendAlpha=t.blendAlpha,this.depthFunc=t.depthFunc,this.depthTest=t.depthTest,this.depthWrite=t.depthWrite,this.stencilWriteMask=t.stencilWriteMask,this.stencilFunc=t.stencilFunc,this.stencilRef=t.stencilRef,this.stencilFuncMask=t.stencilFuncMask,this.stencilFail=t.stencilFail,this.stencilZFail=t.stencilZFail,this.stencilZPass=t.stencilZPass,this.stencilWrite=t.stencilWrite;const e=t.clippingPlanes;let i=null;if(e!==null){const s=e.length;i=new Array(s);for(let r=0;r!==s;++r)i[r]=e[r].clone()}return this.clippingPlanes=i,this.clipIntersection=t.clipIntersection,this.clipShadows=t.clipShadows,this.shadowSide=t.shadowSide,this.colorWrite=t.colorWrite,this.precision=t.precision,this.polygonOffset=t.polygonOffset,this.polygonOffsetFactor=t.polygonOffsetFactor,this.polygonOffsetUnits=t.polygonOffsetUnits,this.dithering=t.dithering,this.alphaTest=t.alphaTest,this.alphaHash=t.alphaHash,this.alphaToCoverage=t.alphaToCoverage,this.premultipliedAlpha=t.premultipliedAlpha,this.forceSinglePass=t.forceSinglePass,this.visible=t.visible,this.toneMapped=t.toneMapped,this.userData=JSON.parse(JSON.stringify(t.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(t){t===!0&&this.version++}}class os extends qr{constructor(t){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new gt(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Tn,this.combine=Km,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.fog=t.fog,this}}const ys=C_();function C_(){const n=new ArrayBuffer(4),t=new Float32Array(n),e=new Uint32Array(n),i=new Uint32Array(512),s=new Uint32Array(512);for(let c=0;c<256;++c){const l=c-127;l<-27?(i[c]=0,i[c|256]=32768,s[c]=24,s[c|256]=24):l<-14?(i[c]=1024>>-l-14,i[c|256]=1024>>-l-14|32768,s[c]=-l-1,s[c|256]=-l-1):l<=15?(i[c]=l+15<<10,i[c|256]=l+15<<10|32768,s[c]=13,s[c|256]=13):l<128?(i[c]=31744,i[c|256]=64512,s[c]=24,s[c|256]=24):(i[c]=31744,i[c|256]=64512,s[c]=13,s[c|256]=13)}const r=new Uint32Array(2048),a=new Uint32Array(64),o=new Uint32Array(64);for(let c=1;c<1024;++c){let l=c<<13,h=0;for(;(l&8388608)===0;)l<<=1,h-=8388608;l&=-8388609,h+=947912704,r[c]=l|h}for(let c=1024;c<2048;++c)r[c]=939524096+(c-1024<<13);for(let c=1;c<31;++c)a[c]=c<<23;a[31]=1199570944,a[32]=2147483648;for(let c=33;c<63;++c)a[c]=2147483648+(c-32<<23);a[63]=3347054592;for(let c=1;c<64;++c)c!==32&&(o[c]=1024);return{floatView:t,uint32View:e,baseTable:i,shiftTable:s,mantissaTable:r,exponentTable:a,offsetTable:o}}function L_(n){Math.abs(n)>65504&&console.warn("THREE.DataUtils.toHalfFloat(): Value out of range."),n=ne(n,-65504,65504),ys.floatView[0]=n;const t=ys.uint32View[0],e=t>>23&511;return ys.baseTable[e]+((t&8388607)>>ys.shiftTable[e])}function P_(n){const t=n>>10;return ys.uint32View[0]=ys.mantissaTable[ys.offsetTable[t]+(n&1023)]+ys.exponentTable[t],ys.floatView[0]}class zc{static toHalfFloat(t){return L_(t)}static fromHalfFloat(t){return P_(t)}}const Xe=new C,Vc=new ft;let I_=0;class $t{constructor(t,e,i=!1){if(Array.isArray(t))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:I_++}),this.name="",this.array=t,this.itemSize=e,this.count=t!==void 0?t.length/e:0,this.normalized=i,this.usage=Bu,this.updateRanges=[],this.gpuType=es,this.version=0}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.name=t.name,this.array=new t.array.constructor(t.array),this.itemSize=t.itemSize,this.count=t.count,this.normalized=t.normalized,this.usage=t.usage,this.gpuType=t.gpuType,this}copyAt(t,e,i){t*=this.itemSize,i*=e.itemSize;for(let s=0,r=this.itemSize;s<r;s++)this.array[t+s]=e.array[i+s];return this}copyArray(t){return this.array.set(t),this}applyMatrix3(t){if(this.itemSize===2)for(let e=0,i=this.count;e<i;e++)Vc.fromBufferAttribute(this,e),Vc.applyMatrix3(t),this.setXY(e,Vc.x,Vc.y);else if(this.itemSize===3)for(let e=0,i=this.count;e<i;e++)Xe.fromBufferAttribute(this,e),Xe.applyMatrix3(t),this.setXYZ(e,Xe.x,Xe.y,Xe.z);return this}applyMatrix4(t){for(let e=0,i=this.count;e<i;e++)Xe.fromBufferAttribute(this,e),Xe.applyMatrix4(t),this.setXYZ(e,Xe.x,Xe.y,Xe.z);return this}applyNormalMatrix(t){for(let e=0,i=this.count;e<i;e++)Xe.fromBufferAttribute(this,e),Xe.applyNormalMatrix(t),this.setXYZ(e,Xe.x,Xe.y,Xe.z);return this}transformDirection(t){for(let e=0,i=this.count;e<i;e++)Xe.fromBufferAttribute(this,e),Xe.transformDirection(t),this.setXYZ(e,Xe.x,Xe.y,Xe.z);return this}set(t,e=0){return this.array.set(t,e),this}getComponent(t,e){let i=this.array[t*this.itemSize+e];return this.normalized&&(i=Ii(i,this.array)),i}setComponent(t,e,i){return this.normalized&&(i=Me(i,this.array)),this.array[t*this.itemSize+e]=i,this}getX(t){let e=this.array[t*this.itemSize];return this.normalized&&(e=Ii(e,this.array)),e}setX(t,e){return this.normalized&&(e=Me(e,this.array)),this.array[t*this.itemSize]=e,this}getY(t){let e=this.array[t*this.itemSize+1];return this.normalized&&(e=Ii(e,this.array)),e}setY(t,e){return this.normalized&&(e=Me(e,this.array)),this.array[t*this.itemSize+1]=e,this}getZ(t){let e=this.array[t*this.itemSize+2];return this.normalized&&(e=Ii(e,this.array)),e}setZ(t,e){return this.normalized&&(e=Me(e,this.array)),this.array[t*this.itemSize+2]=e,this}getW(t){let e=this.array[t*this.itemSize+3];return this.normalized&&(e=Ii(e,this.array)),e}setW(t,e){return this.normalized&&(e=Me(e,this.array)),this.array[t*this.itemSize+3]=e,this}setXY(t,e,i){return t*=this.itemSize,this.normalized&&(e=Me(e,this.array),i=Me(i,this.array)),this.array[t+0]=e,this.array[t+1]=i,this}setXYZ(t,e,i,s){return t*=this.itemSize,this.normalized&&(e=Me(e,this.array),i=Me(i,this.array),s=Me(s,this.array)),this.array[t+0]=e,this.array[t+1]=i,this.array[t+2]=s,this}setXYZW(t,e,i,s,r){return t*=this.itemSize,this.normalized&&(e=Me(e,this.array),i=Me(i,this.array),s=Me(s,this.array),r=Me(r,this.array)),this.array[t+0]=e,this.array[t+1]=i,this.array[t+2]=s,this.array[t+3]=r,this}onUpload(t){return this.onUploadCallback=t,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const t={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(t.name=this.name),this.usage!==Bu&&(t.usage=this.usage),t}}class Bf extends $t{constructor(t,e,i){super(new Uint16Array(t),e,i)}}class pg extends $t{constructor(t,e,i){super(new Uint32Array(t),e,i)}}class ie extends $t{constructor(t,e,i){super(new Float32Array(t),e,i)}}let D_=0;const ai=new re,Jh=new ze,aa=new C,Vn=new mo,Eo=new mo,Ke=new C;class xe extends po{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:D_++}),this.uuid=Ni(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(t){return Array.isArray(t)?this.index=new(ug(t)?pg:Bf)(t,1):this.index=t,this}setIndirect(t){return this.indirect=t,this}getIndirect(){return this.indirect}getAttribute(t){return this.attributes[t]}setAttribute(t,e){return this.attributes[t]=e,this}deleteAttribute(t){return delete this.attributes[t],this}hasAttribute(t){return this.attributes[t]!==void 0}addGroup(t,e,i=0){this.groups.push({start:t,count:e,materialIndex:i})}clearGroups(){this.groups=[]}setDrawRange(t,e){this.drawRange.start=t,this.drawRange.count=e}applyMatrix4(t){const e=this.attributes.position;e!==void 0&&(e.applyMatrix4(t),e.needsUpdate=!0);const i=this.attributes.normal;if(i!==void 0){const r=new oe().getNormalMatrix(t);i.applyNormalMatrix(r),i.needsUpdate=!0}const s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(t),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(t){return ai.makeRotationFromQuaternion(t),this.applyMatrix4(ai),this}rotateX(t){return ai.makeRotationX(t),this.applyMatrix4(ai),this}rotateY(t){return ai.makeRotationY(t),this.applyMatrix4(ai),this}rotateZ(t){return ai.makeRotationZ(t),this.applyMatrix4(ai),this}translate(t,e,i){return ai.makeTranslation(t,e,i),this.applyMatrix4(ai),this}scale(t,e,i){return ai.makeScale(t,e,i),this.applyMatrix4(ai),this}lookAt(t){return Jh.lookAt(t),Jh.updateMatrix(),this.applyMatrix4(Jh.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(aa).negate(),this.translate(aa.x,aa.y,aa.z),this}setFromPoints(t){const e=this.getAttribute("position");if(e===void 0){const i=[];for(let s=0,r=t.length;s<r;s++){const a=t[s];i.push(a.x,a.y,a.z||0)}this.setAttribute("position",new ie(i,3))}else{const i=Math.min(t.length,e.count);for(let s=0;s<i;s++){const r=t[s];e.setXYZ(s,r.x,r.y,r.z||0)}t.length>e.count&&console.warn("THREE.BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),e.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new mo);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new C(-1/0,-1/0,-1/0),new C(1/0,1/0,1/0));return}if(t!==void 0){if(this.boundingBox.setFromBufferAttribute(t),e)for(let i=0,s=e.length;i<s;i++){const r=e[i];Vn.setFromBufferAttribute(r),this.morphTargetsRelative?(Ke.addVectors(this.boundingBox.min,Vn.min),this.boundingBox.expandByPoint(Ke),Ke.addVectors(this.boundingBox.max,Vn.max),this.boundingBox.expandByPoint(Ke)):(this.boundingBox.expandByPoint(Vn.min),this.boundingBox.expandByPoint(Vn.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new rr);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new C,1/0);return}if(t){const i=this.boundingSphere.center;if(Vn.setFromBufferAttribute(t),e)for(let r=0,a=e.length;r<a;r++){const o=e[r];Eo.setFromBufferAttribute(o),this.morphTargetsRelative?(Ke.addVectors(Vn.min,Eo.min),Vn.expandByPoint(Ke),Ke.addVectors(Vn.max,Eo.max),Vn.expandByPoint(Ke)):(Vn.expandByPoint(Eo.min),Vn.expandByPoint(Eo.max))}Vn.getCenter(i);let s=0;for(let r=0,a=t.count;r<a;r++)Ke.fromBufferAttribute(t,r),s=Math.max(s,i.distanceToSquared(Ke));if(e)for(let r=0,a=e.length;r<a;r++){const o=e[r],c=this.morphTargetsRelative;for(let l=0,h=o.count;l<h;l++)Ke.fromBufferAttribute(o,l),c&&(aa.fromBufferAttribute(t,l),Ke.add(aa)),s=Math.max(s,i.distanceToSquared(Ke))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const t=this.index,e=this.attributes;if(t===null||e.position===void 0||e.normal===void 0||e.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const i=e.position,s=e.normal,r=e.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new $t(new Float32Array(4*i.count),4));const a=this.getAttribute("tangent"),o=[],c=[];for(let A=0;A<i.count;A++)o[A]=new C,c[A]=new C;const l=new C,h=new C,u=new C,f=new ft,d=new ft,m=new ft,v=new C,g=new C;function p(A,b,y){l.fromBufferAttribute(i,A),h.fromBufferAttribute(i,b),u.fromBufferAttribute(i,y),f.fromBufferAttribute(r,A),d.fromBufferAttribute(r,b),m.fromBufferAttribute(r,y),h.sub(l),u.sub(l),d.sub(f),m.sub(f);const E=1/(d.x*m.y-m.x*d.y);isFinite(E)&&(v.copy(h).multiplyScalar(m.y).addScaledVector(u,-d.y).multiplyScalar(E),g.copy(u).multiplyScalar(d.x).addScaledVector(h,-m.x).multiplyScalar(E),o[A].add(v),o[b].add(v),o[y].add(v),c[A].add(g),c[b].add(g),c[y].add(g))}let _=this.groups;_.length===0&&(_=[{start:0,count:t.count}]);for(let A=0,b=_.length;A<b;++A){const y=_[A],E=y.start,R=y.count;for(let P=E,I=E+R;P<I;P+=3)p(t.getX(P+0),t.getX(P+1),t.getX(P+2))}const x=new C,M=new C,w=new C,S=new C;function T(A){w.fromBufferAttribute(s,A),S.copy(w);const b=o[A];x.copy(b),x.sub(w.multiplyScalar(w.dot(b))).normalize(),M.crossVectors(S,b);const E=M.dot(c[A])<0?-1:1;a.setXYZW(A,x.x,x.y,x.z,E)}for(let A=0,b=_.length;A<b;++A){const y=_[A],E=y.start,R=y.count;for(let P=E,I=E+R;P<I;P+=3)T(t.getX(P+0)),T(t.getX(P+1)),T(t.getX(P+2))}}computeVertexNormals(){const t=this.index,e=this.getAttribute("position");if(e!==void 0){let i=this.getAttribute("normal");if(i===void 0)i=new $t(new Float32Array(e.count*3),3),this.setAttribute("normal",i);else for(let f=0,d=i.count;f<d;f++)i.setXYZ(f,0,0,0);const s=new C,r=new C,a=new C,o=new C,c=new C,l=new C,h=new C,u=new C;if(t)for(let f=0,d=t.count;f<d;f+=3){const m=t.getX(f+0),v=t.getX(f+1),g=t.getX(f+2);s.fromBufferAttribute(e,m),r.fromBufferAttribute(e,v),a.fromBufferAttribute(e,g),h.subVectors(a,r),u.subVectors(s,r),h.cross(u),o.fromBufferAttribute(i,m),c.fromBufferAttribute(i,v),l.fromBufferAttribute(i,g),o.add(h),c.add(h),l.add(h),i.setXYZ(m,o.x,o.y,o.z),i.setXYZ(v,c.x,c.y,c.z),i.setXYZ(g,l.x,l.y,l.z)}else for(let f=0,d=e.count;f<d;f+=3)s.fromBufferAttribute(e,f+0),r.fromBufferAttribute(e,f+1),a.fromBufferAttribute(e,f+2),h.subVectors(a,r),u.subVectors(s,r),h.cross(u),i.setXYZ(f+0,h.x,h.y,h.z),i.setXYZ(f+1,h.x,h.y,h.z),i.setXYZ(f+2,h.x,h.y,h.z);this.normalizeNormals(),i.needsUpdate=!0}}normalizeNormals(){const t=this.attributes.normal;for(let e=0,i=t.count;e<i;e++)Ke.fromBufferAttribute(t,e),Ke.normalize(),t.setXYZ(e,Ke.x,Ke.y,Ke.z)}toNonIndexed(){function t(o,c){const l=o.array,h=o.itemSize,u=o.normalized,f=new l.constructor(c.length*h);let d=0,m=0;for(let v=0,g=c.length;v<g;v++){o.isInterleavedBufferAttribute?d=c[v]*o.data.stride+o.offset:d=c[v]*h;for(let p=0;p<h;p++)f[m++]=l[d++]}return new $t(f,h,u)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const e=new xe,i=this.index.array,s=this.attributes;for(const o in s){const c=s[o],l=t(c,i);e.setAttribute(o,l)}const r=this.morphAttributes;for(const o in r){const c=[],l=r[o];for(let h=0,u=l.length;h<u;h++){const f=l[h],d=t(f,i);c.push(d)}e.morphAttributes[o]=c}e.morphTargetsRelative=this.morphTargetsRelative;const a=this.groups;for(let o=0,c=a.length;o<c;o++){const l=a[o];e.addGroup(l.start,l.count,l.materialIndex)}return e}toJSON(){const t={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(t.uuid=this.uuid,t.type=this.type,this.name!==""&&(t.name=this.name),Object.keys(this.userData).length>0&&(t.userData=this.userData),this.parameters!==void 0){const c=this.parameters;for(const l in c)c[l]!==void 0&&(t[l]=c[l]);return t}t.data={attributes:{}};const e=this.index;e!==null&&(t.data.index={type:e.array.constructor.name,array:Array.prototype.slice.call(e.array)});const i=this.attributes;for(const c in i){const l=i[c];t.data.attributes[c]=l.toJSON(t.data)}const s={};let r=!1;for(const c in this.morphAttributes){const l=this.morphAttributes[c],h=[];for(let u=0,f=l.length;u<f;u++){const d=l[u];h.push(d.toJSON(t.data))}h.length>0&&(s[c]=h,r=!0)}r&&(t.data.morphAttributes=s,t.data.morphTargetsRelative=this.morphTargetsRelative);const a=this.groups;a.length>0&&(t.data.groups=JSON.parse(JSON.stringify(a)));const o=this.boundingSphere;return o!==null&&(t.data.boundingSphere=o.toJSON()),t}clone(){return new this.constructor().copy(this)}copy(t){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const e={};this.name=t.name;const i=t.index;i!==null&&this.setIndex(i.clone());const s=t.attributes;for(const l in s){const h=s[l];this.setAttribute(l,h.clone(e))}const r=t.morphAttributes;for(const l in r){const h=[],u=r[l];for(let f=0,d=u.length;f<d;f++)h.push(u[f].clone(e));this.morphAttributes[l]=h}this.morphTargetsRelative=t.morphTargetsRelative;const a=t.groups;for(let l=0,h=a.length;l<h;l++){const u=a[l];this.addGroup(u.start,u.count,u.materialIndex)}const o=t.boundingBox;o!==null&&(this.boundingBox=o.clone());const c=t.boundingSphere;return c!==null&&(this.boundingSphere=c.clone()),this.drawRange.start=t.drawRange.start,this.drawRange.count=t.drawRange.count,this.userData=t.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const c1=new re,ur=new Of,Gc=new rr,l1=new C,Wc=new C,Xc=new C,qc=new C,Kh=new C,$c=new C,h1=new C,Yc=new C;class nt extends ze{constructor(t=new xe,e=new os){super(),this.isMesh=!0,this.type="Mesh",this.geometry=t,this.material=e,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),t.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=t.morphTargetInfluences.slice()),t.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},t.morphTargetDictionary)),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}updateMorphTargets(){const e=this.geometry.morphAttributes,i=Object.keys(e);if(i.length>0){const s=e[i[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=s.length;r<a;r++){const o=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}getVertexPosition(t,e){const i=this.geometry,s=i.attributes.position,r=i.morphAttributes.position,a=i.morphTargetsRelative;e.fromBufferAttribute(s,t);const o=this.morphTargetInfluences;if(r&&o){$c.set(0,0,0);for(let c=0,l=r.length;c<l;c++){const h=o[c],u=r[c];h!==0&&(Kh.fromBufferAttribute(u,t),a?$c.addScaledVector(Kh,h):$c.addScaledVector(Kh.sub(e),h))}e.add($c)}return e}raycast(t,e){const i=this.geometry,s=this.material,r=this.matrixWorld;s!==void 0&&(i.boundingSphere===null&&i.computeBoundingSphere(),Gc.copy(i.boundingSphere),Gc.applyMatrix4(r),ur.copy(t.ray).recast(t.near),!(Gc.containsPoint(ur.origin)===!1&&(ur.intersectSphere(Gc,l1)===null||ur.origin.distanceToSquared(l1)>(t.far-t.near)**2))&&(c1.copy(r).invert(),ur.copy(t.ray).applyMatrix4(c1),!(i.boundingBox!==null&&ur.intersectsBox(i.boundingBox)===!1)&&this._computeIntersections(t,e,ur)))}_computeIntersections(t,e,i){let s;const r=this.geometry,a=this.material,o=r.index,c=r.attributes.position,l=r.attributes.uv,h=r.attributes.uv1,u=r.attributes.normal,f=r.groups,d=r.drawRange;if(o!==null)if(Array.isArray(a))for(let m=0,v=f.length;m<v;m++){const g=f[m],p=a[g.materialIndex],_=Math.max(g.start,d.start),x=Math.min(o.count,Math.min(g.start+g.count,d.start+d.count));for(let M=_,w=x;M<w;M+=3){const S=o.getX(M),T=o.getX(M+1),A=o.getX(M+2);s=jc(this,p,t,i,l,h,u,S,T,A),s&&(s.faceIndex=Math.floor(M/3),s.face.materialIndex=g.materialIndex,e.push(s))}}else{const m=Math.max(0,d.start),v=Math.min(o.count,d.start+d.count);for(let g=m,p=v;g<p;g+=3){const _=o.getX(g),x=o.getX(g+1),M=o.getX(g+2);s=jc(this,a,t,i,l,h,u,_,x,M),s&&(s.faceIndex=Math.floor(g/3),e.push(s))}}else if(c!==void 0)if(Array.isArray(a))for(let m=0,v=f.length;m<v;m++){const g=f[m],p=a[g.materialIndex],_=Math.max(g.start,d.start),x=Math.min(c.count,Math.min(g.start+g.count,d.start+d.count));for(let M=_,w=x;M<w;M+=3){const S=M,T=M+1,A=M+2;s=jc(this,p,t,i,l,h,u,S,T,A),s&&(s.faceIndex=Math.floor(M/3),s.face.materialIndex=g.materialIndex,e.push(s))}}else{const m=Math.max(0,d.start),v=Math.min(c.count,d.start+d.count);for(let g=m,p=v;g<p;g+=3){const _=g,x=g+1,M=g+2;s=jc(this,a,t,i,l,h,u,_,x,M),s&&(s.faceIndex=Math.floor(g/3),e.push(s))}}}}function U_(n,t,e,i,s,r,a,o){let c;if(t.side===Fn?c=i.intersectTriangle(a,r,s,!0,o):c=i.intersectTriangle(s,r,a,t.side===ir,o),c===null)return null;Yc.copy(o),Yc.applyMatrix4(n.matrixWorld);const l=e.ray.origin.distanceTo(Yc);return l<e.near||l>e.far?null:{distance:l,point:Yc.clone(),object:n}}function jc(n,t,e,i,s,r,a,o,c,l){n.getVertexPosition(o,Wc),n.getVertexPosition(c,Xc),n.getVertexPosition(l,qc);const h=U_(n,t,e,i,Wc,Xc,qc,h1);if(h){const u=new C;pi.getBarycoord(h1,Wc,Xc,qc,u),s&&(h.uv=pi.getInterpolatedAttribute(s,o,c,l,u,new ft)),r&&(h.uv1=pi.getInterpolatedAttribute(r,o,c,l,u,new ft)),a&&(h.normal=pi.getInterpolatedAttribute(a,o,c,l,u,new C),h.normal.dot(i.direction)>0&&h.normal.multiplyScalar(-1));const f={a:o,b:c,c:l,normal:new C,materialIndex:0};pi.getNormal(Wc,Xc,qc,f.normal),h.face=f,h.barycoord=u}return h}class Ce extends xe{constructor(t=1,e=1,i=1,s=1,r=1,a=1){super(),this.type="BoxGeometry",this.parameters={width:t,height:e,depth:i,widthSegments:s,heightSegments:r,depthSegments:a};const o=this;s=Math.floor(s),r=Math.floor(r),a=Math.floor(a);const c=[],l=[],h=[],u=[];let f=0,d=0;m("z","y","x",-1,-1,i,e,t,a,r,0),m("z","y","x",1,-1,i,e,-t,a,r,1),m("x","z","y",1,1,t,i,e,s,a,2),m("x","z","y",1,-1,t,i,-e,s,a,3),m("x","y","z",1,-1,t,e,i,s,r,4),m("x","y","z",-1,-1,t,e,-i,s,r,5),this.setIndex(c),this.setAttribute("position",new ie(l,3)),this.setAttribute("normal",new ie(h,3)),this.setAttribute("uv",new ie(u,2));function m(v,g,p,_,x,M,w,S,T,A,b){const y=M/T,E=w/A,R=M/2,P=w/2,I=S/2,F=T+1,H=A+1;let $=0,B=0;const Y=new C;for(let it=0;it<H;it++){const mt=it*E-P;for(let vt=0;vt<F;vt++){const St=vt*y-R;Y[v]=St*_,Y[g]=mt*x,Y[p]=I,l.push(Y.x,Y.y,Y.z),Y[v]=0,Y[g]=0,Y[p]=S>0?1:-1,h.push(Y.x,Y.y,Y.z),u.push(vt/T),u.push(1-it/A),$+=1}}for(let it=0;it<A;it++)for(let mt=0;mt<T;mt++){const vt=f+mt+F*it,St=f+mt+F*(it+1),Ct=f+(mt+1)+F*(it+1),Ut=f+(mt+1)+F*it;c.push(vt,St,Ut),c.push(St,Ct,Ut),B+=6}o.addGroup(d,B,b),d+=B,f+=$}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Ce(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}}function ao(n){const t={};for(const e in n){t[e]={};for(const i in n[e]){const s=n[e][i];s&&(s.isColor||s.isMatrix3||s.isMatrix4||s.isVector2||s.isVector3||s.isVector4||s.isTexture||s.isQuaternion)?s.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),t[e][i]=null):t[e][i]=s.clone():Array.isArray(s)?t[e][i]=s.slice():t[e][i]=s}}return t}function Mn(n){const t={};for(let e=0;e<n.length;e++){const i=ao(n[e]);for(const s in i)t[s]=i[s]}return t}function N_(n){const t=[];for(let e=0;e<n.length;e++)t.push(n[e].clone());return t}function mg(n){const t=n.getRenderTarget();return t===null?n.outputColorSpace:t.isXRRenderTarget===!0?t.texture.colorSpace:ge.workingColorSpace}const F_={clone:ao,merge:Mn};var k_=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,O_=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class en extends qr{constructor(t){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=k_,this.fragmentShader=O_,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,t!==void 0&&this.setValues(t)}copy(t){return super.copy(t),this.fragmentShader=t.fragmentShader,this.vertexShader=t.vertexShader,this.uniforms=ao(t.uniforms),this.uniformsGroups=N_(t.uniformsGroups),this.defines=Object.assign({},t.defines),this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.fog=t.fog,this.lights=t.lights,this.clipping=t.clipping,this.extensions=Object.assign({},t.extensions),this.glslVersion=t.glslVersion,this}toJSON(t){const e=super.toJSON(t);e.glslVersion=this.glslVersion,e.uniforms={};for(const s in this.uniforms){const a=this.uniforms[s].value;a&&a.isTexture?e.uniforms[s]={type:"t",value:a.toJSON(t).uuid}:a&&a.isColor?e.uniforms[s]={type:"c",value:a.getHex()}:a&&a.isVector2?e.uniforms[s]={type:"v2",value:a.toArray()}:a&&a.isVector3?e.uniforms[s]={type:"v3",value:a.toArray()}:a&&a.isVector4?e.uniforms[s]={type:"v4",value:a.toArray()}:a&&a.isMatrix3?e.uniforms[s]={type:"m3",value:a.toArray()}:a&&a.isMatrix4?e.uniforms[s]={type:"m4",value:a.toArray()}:e.uniforms[s]={value:a}}Object.keys(this.defines).length>0&&(e.defines=this.defines),e.vertexShader=this.vertexShader,e.fragmentShader=this.fragmentShader,e.lights=this.lights,e.clipping=this.clipping;const i={};for(const s in this.extensions)this.extensions[s]===!0&&(i[s]=!0);return Object.keys(i).length>0&&(e.extensions=i),e}}class gg extends ze{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new re,this.projectionMatrix=new re,this.projectionMatrixInverse=new re,this.coordinateSystem=ns,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(t,e){return super.copy(t,e),this.matrixWorldInverse.copy(t.matrixWorldInverse),this.projectionMatrix.copy(t.projectionMatrix),this.projectionMatrixInverse.copy(t.projectionMatrixInverse),this.coordinateSystem=t.coordinateSystem,this}getWorldDirection(t){return super.getWorldDirection(t).negate()}updateMatrixWorld(t){super.updateMatrixWorld(t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(t,e){super.updateWorldMatrix(t,e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}const Ns=new C,u1=new ft,f1=new ft;class qn extends gg{constructor(t=50,e=1,i=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=t,this.zoom=1,this.near=i,this.far=s,this.focus=10,this.aspect=e,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.fov=t.fov,this.zoom=t.zoom,this.near=t.near,this.far=t.far,this.focus=t.focus,this.aspect=t.aspect,this.view=t.view===null?null:Object.assign({},t.view),this.filmGauge=t.filmGauge,this.filmOffset=t.filmOffset,this}setFocalLength(t){const e=.5*this.getFilmHeight()/t;this.fov=ro*2*Math.atan(e),this.updateProjectionMatrix()}getFocalLength(){const t=Math.tan(Wo*.5*this.fov);return .5*this.getFilmHeight()/t}getEffectiveFOV(){return ro*2*Math.atan(Math.tan(Wo*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(t,e,i){Ns.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),e.set(Ns.x,Ns.y).multiplyScalar(-t/Ns.z),Ns.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),i.set(Ns.x,Ns.y).multiplyScalar(-t/Ns.z)}getViewSize(t,e){return this.getViewBounds(t,u1,f1),e.subVectors(f1,u1)}setViewOffset(t,e,i,s,r,a){this.aspect=t/e,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=i,this.view.offsetY=s,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=this.near;let e=t*Math.tan(Wo*.5*this.fov)/this.zoom,i=2*e,s=this.aspect*i,r=-.5*s;const a=this.view;if(this.view!==null&&this.view.enabled){const c=a.fullWidth,l=a.fullHeight;r+=a.offsetX*s/c,e-=a.offsetY*i/l,s*=a.width/c,i*=a.height/l}const o=this.filmOffset;o!==0&&(r+=t*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+s,e,e-i,t,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.fov=this.fov,e.object.zoom=this.zoom,e.object.near=this.near,e.object.far=this.far,e.object.focus=this.focus,e.object.aspect=this.aspect,this.view!==null&&(e.object.view=Object.assign({},this.view)),e.object.filmGauge=this.filmGauge,e.object.filmOffset=this.filmOffset,e}}const oa=-90,ca=1;class B_ extends ze{constructor(t,e,i){super(),this.type="CubeCamera",this.renderTarget=i,this.coordinateSystem=null,this.activeMipmapLevel=0;const s=new qn(oa,ca,t,e);s.layers=this.layers,this.add(s);const r=new qn(oa,ca,t,e);r.layers=this.layers,this.add(r);const a=new qn(oa,ca,t,e);a.layers=this.layers,this.add(a);const o=new qn(oa,ca,t,e);o.layers=this.layers,this.add(o);const c=new qn(oa,ca,t,e);c.layers=this.layers,this.add(c);const l=new qn(oa,ca,t,e);l.layers=this.layers,this.add(l)}updateCoordinateSystem(){const t=this.coordinateSystem,e=this.children.concat(),[i,s,r,a,o,c]=e;for(const l of e)this.remove(l);if(t===ns)i.up.set(0,1,0),i.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),c.up.set(0,1,0),c.lookAt(0,0,-1);else if(t===Xl)i.up.set(0,-1,0),i.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),c.up.set(0,-1,0),c.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+t);for(const l of e)this.add(l),l.updateMatrixWorld()}update(t,e){this.parent===null&&this.updateMatrixWorld();const{renderTarget:i,activeMipmapLevel:s}=this;this.coordinateSystem!==t.coordinateSystem&&(this.coordinateSystem=t.coordinateSystem,this.updateCoordinateSystem());const[r,a,o,c,l,h]=this.children,u=t.getRenderTarget(),f=t.getActiveCubeFace(),d=t.getActiveMipmapLevel(),m=t.xr.enabled;t.xr.enabled=!1;const v=i.texture.generateMipmaps;i.texture.generateMipmaps=!1,t.setRenderTarget(i,0,s),t.render(e,r),t.setRenderTarget(i,1,s),t.render(e,a),t.setRenderTarget(i,2,s),t.render(e,o),t.setRenderTarget(i,3,s),t.render(e,c),t.setRenderTarget(i,4,s),t.render(e,l),i.texture.generateMipmaps=v,t.setRenderTarget(i,5,s),t.render(e,h),t.setRenderTarget(u,f,d),t.xr.enabled=m,i.texture.needsPMREMUpdate=!0}}class vg extends hn{constructor(t=[],e=no,i,s,r,a,o,c,l,h){super(t,e,i,s,r,a,o,c,l,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(t){this.image=t}}class H_ extends yn{constructor(t=1,e={}){super(t,t,e),this.isWebGLCubeRenderTarget=!0;const i={width:t,height:t,depth:1},s=[i,i,i,i,i,i];this.texture=new vg(s),this._setTextureOptions(e),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(t,e){this.texture.type=e.type,this.texture.colorSpace=e.colorSpace,this.texture.generateMipmaps=e.generateMipmaps,this.texture.minFilter=e.minFilter,this.texture.magFilter=e.magFilter;const i={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},s=new Ce(5,5,5),r=new en({name:"CubemapFromEquirect",uniforms:ao(i.uniforms),vertexShader:i.vertexShader,fragmentShader:i.fragmentShader,side:Fn,blending:Ks});r.uniforms.tEquirect.value=e;const a=new nt(s,r),o=e.minFilter;return e.minFilter===$s&&(e.minFilter=Ie),new B_(1,10,this).update(t,a),e.minFilter=o,a.geometry.dispose(),a.material.dispose(),this}clear(t,e=!0,i=!0,s=!0){const r=t.getRenderTarget();for(let a=0;a<6;a++)t.setRenderTarget(this,a),t.clear(e,i,s);t.setRenderTarget(r)}}class ue extends ze{constructor(){super(),this.isGroup=!0,this.type="Group"}}const z_={type:"move"};class Qh{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new ue,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new ue,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new C,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new C),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new ue,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new C,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new C),this._grip}dispatchEvent(t){return this._targetRay!==null&&this._targetRay.dispatchEvent(t),this._grip!==null&&this._grip.dispatchEvent(t),this._hand!==null&&this._hand.dispatchEvent(t),this}connect(t){if(t&&t.hand){const e=this._hand;if(e)for(const i of t.hand.values())this._getHandJoint(e,i)}return this.dispatchEvent({type:"connected",data:t}),this}disconnect(t){return this.dispatchEvent({type:"disconnected",data:t}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(t,e,i){let s=null,r=null,a=null;const o=this._targetRay,c=this._grip,l=this._hand;if(t&&e.session.visibilityState!=="visible-blurred"){if(l&&t.hand){a=!0;for(const v of t.hand.values()){const g=e.getJointPose(v,i),p=this._getHandJoint(l,v);g!==null&&(p.matrix.fromArray(g.transform.matrix),p.matrix.decompose(p.position,p.rotation,p.scale),p.matrixWorldNeedsUpdate=!0,p.jointRadius=g.radius),p.visible=g!==null}const h=l.joints["index-finger-tip"],u=l.joints["thumb-tip"],f=h.position.distanceTo(u.position),d=.02,m=.005;l.inputState.pinching&&f>d+m?(l.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:t.handedness,target:this})):!l.inputState.pinching&&f<=d-m&&(l.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:t.handedness,target:this}))}else c!==null&&t.gripSpace&&(r=e.getPose(t.gripSpace,i),r!==null&&(c.matrix.fromArray(r.transform.matrix),c.matrix.decompose(c.position,c.rotation,c.scale),c.matrixWorldNeedsUpdate=!0,r.linearVelocity?(c.hasLinearVelocity=!0,c.linearVelocity.copy(r.linearVelocity)):c.hasLinearVelocity=!1,r.angularVelocity?(c.hasAngularVelocity=!0,c.angularVelocity.copy(r.angularVelocity)):c.hasAngularVelocity=!1));o!==null&&(s=e.getPose(t.targetRaySpace,i),s===null&&r!==null&&(s=r),s!==null&&(o.matrix.fromArray(s.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,s.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(s.linearVelocity)):o.hasLinearVelocity=!1,s.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(s.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(z_)))}return o!==null&&(o.visible=s!==null),c!==null&&(c.visible=r!==null),l!==null&&(l.visible=a!==null),this}_getHandJoint(t,e){if(t.joints[e.jointName]===void 0){const i=new ue;i.matrixAutoUpdate=!1,i.visible=!1,t.joints[e.jointName]=i,t.add(i)}return t.joints[e.jointName]}}class xg extends ze{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new Tn,this.environmentIntensity=1,this.environmentRotation=new Tn,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(t,e){return super.copy(t,e),t.background!==null&&(this.background=t.background.clone()),t.environment!==null&&(this.environment=t.environment.clone()),t.fog!==null&&(this.fog=t.fog.clone()),this.backgroundBlurriness=t.backgroundBlurriness,this.backgroundIntensity=t.backgroundIntensity,this.backgroundRotation.copy(t.backgroundRotation),this.environmentIntensity=t.environmentIntensity,this.environmentRotation.copy(t.environmentRotation),t.overrideMaterial!==null&&(this.overrideMaterial=t.overrideMaterial.clone()),this.matrixAutoUpdate=t.matrixAutoUpdate,this}toJSON(t){const e=super.toJSON(t);return this.fog!==null&&(e.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(e.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(e.object.backgroundIntensity=this.backgroundIntensity),e.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(e.object.environmentIntensity=this.environmentIntensity),e.object.environmentRotation=this.environmentRotation.toArray(),e}}class V_{constructor(t,e){this.isInterleavedBuffer=!0,this.array=t,this.stride=e,this.count=t!==void 0?t.length/e:0,this.usage=Bu,this.updateRanges=[],this.version=0,this.uuid=Ni()}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.array=new t.array.constructor(t.array),this.count=t.count,this.stride=t.stride,this.usage=t.usage,this}copyAt(t,e,i){t*=this.stride,i*=e.stride;for(let s=0,r=this.stride;s<r;s++)this.array[t+s]=e.array[i+s];return this}set(t,e=0){return this.array.set(t,e),this}clone(t){t.arrayBuffers===void 0&&(t.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=Ni()),t.arrayBuffers[this.array.buffer._uuid]===void 0&&(t.arrayBuffers[this.array.buffer._uuid]=this.array.slice(0).buffer);const e=new this.array.constructor(t.arrayBuffers[this.array.buffer._uuid]),i=new this.constructor(e,this.stride);return i.setUsage(this.usage),i}onUpload(t){return this.onUploadCallback=t,this}toJSON(t){return t.arrayBuffers===void 0&&(t.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=Ni()),t.arrayBuffers[this.array.buffer._uuid]===void 0&&(t.arrayBuffers[this.array.buffer._uuid]=Array.from(new Uint32Array(this.array.buffer))),{uuid:this.uuid,buffer:this.array.buffer._uuid,type:this.array.constructor.name,stride:this.stride}}}const _n=new C;class $l{constructor(t,e,i,s=!1){this.isInterleavedBufferAttribute=!0,this.name="",this.data=t,this.itemSize=e,this.offset=i,this.normalized=s}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(t){this.data.needsUpdate=t}applyMatrix4(t){for(let e=0,i=this.data.count;e<i;e++)_n.fromBufferAttribute(this,e),_n.applyMatrix4(t),this.setXYZ(e,_n.x,_n.y,_n.z);return this}applyNormalMatrix(t){for(let e=0,i=this.count;e<i;e++)_n.fromBufferAttribute(this,e),_n.applyNormalMatrix(t),this.setXYZ(e,_n.x,_n.y,_n.z);return this}transformDirection(t){for(let e=0,i=this.count;e<i;e++)_n.fromBufferAttribute(this,e),_n.transformDirection(t),this.setXYZ(e,_n.x,_n.y,_n.z);return this}getComponent(t,e){let i=this.array[t*this.data.stride+this.offset+e];return this.normalized&&(i=Ii(i,this.array)),i}setComponent(t,e,i){return this.normalized&&(i=Me(i,this.array)),this.data.array[t*this.data.stride+this.offset+e]=i,this}setX(t,e){return this.normalized&&(e=Me(e,this.array)),this.data.array[t*this.data.stride+this.offset]=e,this}setY(t,e){return this.normalized&&(e=Me(e,this.array)),this.data.array[t*this.data.stride+this.offset+1]=e,this}setZ(t,e){return this.normalized&&(e=Me(e,this.array)),this.data.array[t*this.data.stride+this.offset+2]=e,this}setW(t,e){return this.normalized&&(e=Me(e,this.array)),this.data.array[t*this.data.stride+this.offset+3]=e,this}getX(t){let e=this.data.array[t*this.data.stride+this.offset];return this.normalized&&(e=Ii(e,this.array)),e}getY(t){let e=this.data.array[t*this.data.stride+this.offset+1];return this.normalized&&(e=Ii(e,this.array)),e}getZ(t){let e=this.data.array[t*this.data.stride+this.offset+2];return this.normalized&&(e=Ii(e,this.array)),e}getW(t){let e=this.data.array[t*this.data.stride+this.offset+3];return this.normalized&&(e=Ii(e,this.array)),e}setXY(t,e,i){return t=t*this.data.stride+this.offset,this.normalized&&(e=Me(e,this.array),i=Me(i,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=i,this}setXYZ(t,e,i,s){return t=t*this.data.stride+this.offset,this.normalized&&(e=Me(e,this.array),i=Me(i,this.array),s=Me(s,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=i,this.data.array[t+2]=s,this}setXYZW(t,e,i,s,r){return t=t*this.data.stride+this.offset,this.normalized&&(e=Me(e,this.array),i=Me(i,this.array),s=Me(s,this.array),r=Me(r,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=i,this.data.array[t+2]=s,this.data.array[t+3]=r,this}clone(t){if(t===void 0){console.log("THREE.InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.");const e=[];for(let i=0;i<this.count;i++){const s=i*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)e.push(this.data.array[s+r])}return new $t(new this.array.constructor(e),this.itemSize,this.normalized)}else return t.interleavedBuffers===void 0&&(t.interleavedBuffers={}),t.interleavedBuffers[this.data.uuid]===void 0&&(t.interleavedBuffers[this.data.uuid]=this.data.clone(t)),new $l(t.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(t){if(t===void 0){console.log("THREE.InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.");const e=[];for(let i=0;i<this.count;i++){const s=i*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)e.push(this.data.array[s+r])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:e,normalized:this.normalized}}else return t.interleavedBuffers===void 0&&(t.interleavedBuffers={}),t.interleavedBuffers[this.data.uuid]===void 0&&(t.interleavedBuffers[this.data.uuid]=this.data.toJSON(t)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}}class Hf extends qr{constructor(t){super(),this.isSpriteMaterial=!0,this.type="SpriteMaterial",this.color=new gt(16777215),this.map=null,this.alphaMap=null,this.rotation=0,this.sizeAttenuation=!0,this.transparent=!0,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.alphaMap=t.alphaMap,this.rotation=t.rotation,this.sizeAttenuation=t.sizeAttenuation,this.fog=t.fog,this}}let la;const To=new C,ha=new C,ua=new C,fa=new ft,Ao=new ft,_g=new re,Zc=new C,Ro=new C,Jc=new C,d1=new ft,t0=new ft,p1=new ft;class Mg extends ze{constructor(t=new Hf){if(super(),this.isSprite=!0,this.type="Sprite",la===void 0){la=new xe;const e=new Float32Array([-.5,-.5,0,0,0,.5,-.5,0,1,0,.5,.5,0,1,1,-.5,.5,0,0,1]),i=new V_(e,5);la.setIndex([0,1,2,0,2,3]),la.setAttribute("position",new $l(i,3,0,!1)),la.setAttribute("uv",new $l(i,2,3,!1))}this.geometry=la,this.material=t,this.center=new ft(.5,.5),this.count=1}raycast(t,e){t.camera===null&&console.error('THREE.Sprite: "Raycaster.camera" needs to be set in order to raycast against sprites.'),ha.setFromMatrixScale(this.matrixWorld),_g.copy(t.camera.matrixWorld),this.modelViewMatrix.multiplyMatrices(t.camera.matrixWorldInverse,this.matrixWorld),ua.setFromMatrixPosition(this.modelViewMatrix),t.camera.isPerspectiveCamera&&this.material.sizeAttenuation===!1&&ha.multiplyScalar(-ua.z);const i=this.material.rotation;let s,r;i!==0&&(r=Math.cos(i),s=Math.sin(i));const a=this.center;Kc(Zc.set(-.5,-.5,0),ua,a,ha,s,r),Kc(Ro.set(.5,-.5,0),ua,a,ha,s,r),Kc(Jc.set(.5,.5,0),ua,a,ha,s,r),d1.set(0,0),t0.set(1,0),p1.set(1,1);let o=t.ray.intersectTriangle(Zc,Ro,Jc,!1,To);if(o===null&&(Kc(Ro.set(-.5,.5,0),ua,a,ha,s,r),t0.set(0,1),o=t.ray.intersectTriangle(Zc,Jc,Ro,!1,To),o===null))return;const c=t.ray.origin.distanceTo(To);c<t.near||c>t.far||e.push({distance:c,point:To.clone(),uv:pi.getInterpolation(To,Zc,Ro,Jc,d1,t0,p1,new ft),face:null,object:this})}copy(t,e){return super.copy(t,e),t.center!==void 0&&this.center.copy(t.center),this.material=t.material,this}}function Kc(n,t,e,i,s,r){fa.subVectors(n,e).addScalar(.5).multiply(i),s!==void 0?(Ao.x=r*fa.x-s*fa.y,Ao.y=s*fa.x+r*fa.y):Ao.copy(fa),n.copy(t),n.x+=Ao.x,n.y+=Ao.y,n.applyMatrix4(_g)}const m1=new C,g1=new de,v1=new de,G_=new C,x1=new re,Qc=new C,e0=new rr,_1=new re,n0=new Of;class Sc extends nt{constructor(t,e){super(t,e),this.isSkinnedMesh=!0,this.type="SkinnedMesh",this.bindMode=qd,this.bindMatrix=new re,this.bindMatrixInverse=new re,this.boundingBox=null,this.boundingSphere=null}computeBoundingBox(){const t=this.geometry;this.boundingBox===null&&(this.boundingBox=new mo),this.boundingBox.makeEmpty();const e=t.getAttribute("position");for(let i=0;i<e.count;i++)this.getVertexPosition(i,Qc),this.boundingBox.expandByPoint(Qc)}computeBoundingSphere(){const t=this.geometry;this.boundingSphere===null&&(this.boundingSphere=new rr),this.boundingSphere.makeEmpty();const e=t.getAttribute("position");for(let i=0;i<e.count;i++)this.getVertexPosition(i,Qc),this.boundingSphere.expandByPoint(Qc)}copy(t,e){return super.copy(t,e),this.bindMode=t.bindMode,this.bindMatrix.copy(t.bindMatrix),this.bindMatrixInverse.copy(t.bindMatrixInverse),this.skeleton=t.skeleton,t.boundingBox!==null&&(this.boundingBox=t.boundingBox.clone()),t.boundingSphere!==null&&(this.boundingSphere=t.boundingSphere.clone()),this}raycast(t,e){const i=this.material,s=this.matrixWorld;i!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),e0.copy(this.boundingSphere),e0.applyMatrix4(s),t.ray.intersectsSphere(e0)!==!1&&(_1.copy(s).invert(),n0.copy(t.ray).applyMatrix4(_1),!(this.boundingBox!==null&&n0.intersectsBox(this.boundingBox)===!1)&&this._computeIntersections(t,e,n0)))}getVertexPosition(t,e){return super.getVertexPosition(t,e),this.applyBoneTransform(t,e),e}bind(t,e){this.skeleton=t,e===void 0&&(this.updateMatrixWorld(!0),this.skeleton.calculateInverses(),e=this.matrixWorld),this.bindMatrix.copy(e),this.bindMatrixInverse.copy(e).invert()}pose(){this.skeleton.pose()}normalizeSkinWeights(){const t=new de,e=this.geometry.attributes.skinWeight;for(let i=0,s=e.count;i<s;i++){t.fromBufferAttribute(e,i);const r=1/t.manhattanLength();r!==1/0?t.multiplyScalar(r):t.set(1,0,0,0),e.setXYZW(i,t.x,t.y,t.z,t.w)}}updateMatrixWorld(t){super.updateMatrixWorld(t),this.bindMode===qd?this.bindMatrixInverse.copy(this.matrixWorld).invert():this.bindMode===Ox?this.bindMatrixInverse.copy(this.bindMatrix).invert():console.warn("THREE.SkinnedMesh: Unrecognized bindMode: "+this.bindMode)}applyBoneTransform(t,e){const i=this.skeleton,s=this.geometry;g1.fromBufferAttribute(s.attributes.skinIndex,t),v1.fromBufferAttribute(s.attributes.skinWeight,t),m1.copy(e).applyMatrix4(this.bindMatrix),e.set(0,0,0);for(let r=0;r<4;r++){const a=v1.getComponent(r);if(a!==0){const o=g1.getComponent(r);x1.multiplyMatrices(i.bones[o].matrixWorld,i.boneInverses[o]),e.addScaledVector(G_.copy(m1).applyMatrix4(x1),a)}}return e.applyMatrix4(this.bindMatrixInverse)}}class bg extends ze{constructor(){super(),this.isBone=!0,this.type="Bone"}}class Ga extends hn{constructor(t=null,e=1,i=1,s,r,a,o,c,l=ni,h=ni,u,f){super(null,a,o,c,l,h,s,r,u,f),this.isDataTexture=!0,this.image={data:t,width:e,height:i},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}const M1=new re,W_=new re;class zf{constructor(t=[],e=[]){this.uuid=Ni(),this.bones=t.slice(0),this.boneInverses=e,this.boneMatrices=null,this.boneTexture=null,this.init()}init(){const t=this.bones,e=this.boneInverses;if(this.boneMatrices=new Float32Array(t.length*16),e.length===0)this.calculateInverses();else if(t.length!==e.length){console.warn("THREE.Skeleton: Number of inverse bone matrices does not match amount of bones."),this.boneInverses=[];for(let i=0,s=this.bones.length;i<s;i++)this.boneInverses.push(new re)}}calculateInverses(){this.boneInverses.length=0;for(let t=0,e=this.bones.length;t<e;t++){const i=new re;this.bones[t]&&i.copy(this.bones[t].matrixWorld).invert(),this.boneInverses.push(i)}}pose(){for(let t=0,e=this.bones.length;t<e;t++){const i=this.bones[t];i&&i.matrixWorld.copy(this.boneInverses[t]).invert()}for(let t=0,e=this.bones.length;t<e;t++){const i=this.bones[t];i&&(i.parent&&i.parent.isBone?(i.matrix.copy(i.parent.matrixWorld).invert(),i.matrix.multiply(i.matrixWorld)):i.matrix.copy(i.matrixWorld),i.matrix.decompose(i.position,i.quaternion,i.scale))}}update(){const t=this.bones,e=this.boneInverses,i=this.boneMatrices,s=this.boneTexture;for(let r=0,a=t.length;r<a;r++){const o=t[r]?t[r].matrixWorld:W_;M1.multiplyMatrices(o,e[r]),M1.toArray(i,r*16)}s!==null&&(s.needsUpdate=!0)}clone(){return new zf(this.bones,this.boneInverses)}computeBoneTexture(){let t=Math.sqrt(this.bones.length*4);t=Math.ceil(t/4)*4,t=Math.max(t,4);const e=new Float32Array(t*t*4);e.set(this.boneMatrices);const i=new Ga(e,t,t,cn,es);return i.needsUpdate=!0,this.boneMatrices=e,this.boneTexture=i,this}getBoneByName(t){for(let e=0,i=this.bones.length;e<i;e++){const s=this.bones[e];if(s.name===t)return s}}dispose(){this.boneTexture!==null&&(this.boneTexture.dispose(),this.boneTexture=null)}fromJSON(t,e){this.uuid=t.uuid;for(let i=0,s=t.bones.length;i<s;i++){const r=t.bones[i];let a=e[r];a===void 0&&(console.warn("THREE.Skeleton: No bone found with UUID:",r),a=new bg),this.bones.push(a),this.boneInverses.push(new re().fromArray(t.boneInverses[i]))}return this.init(),this}toJSON(){const t={metadata:{version:4.7,type:"Skeleton",generator:"Skeleton.toJSON"},bones:[],boneInverses:[]};t.uuid=this.uuid;const e=this.bones,i=this.boneInverses;for(let s=0,r=e.length;s<r;s++){const a=e[s];t.bones.push(a.uuid);const o=i[s];t.boneInverses.push(o.toArray())}return t}}const i0=new C,X_=new C,q_=new oe;class Mr{constructor(t=new C(1,0,0),e=0){this.isPlane=!0,this.normal=t,this.constant=e}set(t,e){return this.normal.copy(t),this.constant=e,this}setComponents(t,e,i,s){return this.normal.set(t,e,i),this.constant=s,this}setFromNormalAndCoplanarPoint(t,e){return this.normal.copy(t),this.constant=-e.dot(this.normal),this}setFromCoplanarPoints(t,e,i){const s=i0.subVectors(i,e).cross(X_.subVectors(t,e)).normalize();return this.setFromNormalAndCoplanarPoint(s,t),this}copy(t){return this.normal.copy(t.normal),this.constant=t.constant,this}normalize(){const t=1/this.normal.length();return this.normal.multiplyScalar(t),this.constant*=t,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(t){return this.normal.dot(t)+this.constant}distanceToSphere(t){return this.distanceToPoint(t.center)-t.radius}projectPoint(t,e){return e.copy(t).addScaledVector(this.normal,-this.distanceToPoint(t))}intersectLine(t,e){const i=t.delta(i0),s=this.normal.dot(i);if(s===0)return this.distanceToPoint(t.start)===0?e.copy(t.start):null;const r=-(t.start.dot(this.normal)+this.constant)/s;return r<0||r>1?null:e.copy(t.start).addScaledVector(i,r)}intersectsLine(t){const e=this.distanceToPoint(t.start),i=this.distanceToPoint(t.end);return e<0&&i>0||i<0&&e>0}intersectsBox(t){return t.intersectsPlane(this)}intersectsSphere(t){return t.intersectsPlane(this)}coplanarPoint(t){return t.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(t,e){const i=e||q_.getNormalMatrix(t),s=this.coplanarPoint(i0).applyMatrix4(t),r=this.normal.applyMatrix3(i).normalize();return this.constant=-s.dot(r),this}translate(t){return this.constant-=t.dot(this.normal),this}equals(t){return t.normal.equals(this.normal)&&t.constant===this.constant}clone(){return new this.constructor().copy(this)}}const fr=new rr,$_=new ft(.5,.5),tl=new C;class Vf{constructor(t=new Mr,e=new Mr,i=new Mr,s=new Mr,r=new Mr,a=new Mr){this.planes=[t,e,i,s,r,a]}set(t,e,i,s,r,a){const o=this.planes;return o[0].copy(t),o[1].copy(e),o[2].copy(i),o[3].copy(s),o[4].copy(r),o[5].copy(a),this}copy(t){const e=this.planes;for(let i=0;i<6;i++)e[i].copy(t.planes[i]);return this}setFromProjectionMatrix(t,e=ns,i=!1){const s=this.planes,r=t.elements,a=r[0],o=r[1],c=r[2],l=r[3],h=r[4],u=r[5],f=r[6],d=r[7],m=r[8],v=r[9],g=r[10],p=r[11],_=r[12],x=r[13],M=r[14],w=r[15];if(s[0].setComponents(l-a,d-h,p-m,w-_).normalize(),s[1].setComponents(l+a,d+h,p+m,w+_).normalize(),s[2].setComponents(l+o,d+u,p+v,w+x).normalize(),s[3].setComponents(l-o,d-u,p-v,w-x).normalize(),i)s[4].setComponents(c,f,g,M).normalize(),s[5].setComponents(l-c,d-f,p-g,w-M).normalize();else if(s[4].setComponents(l-c,d-f,p-g,w-M).normalize(),e===ns)s[5].setComponents(l+c,d+f,p+g,w+M).normalize();else if(e===Xl)s[5].setComponents(c,f,g,M).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+e);return this}intersectsObject(t){if(t.boundingSphere!==void 0)t.boundingSphere===null&&t.computeBoundingSphere(),fr.copy(t.boundingSphere).applyMatrix4(t.matrixWorld);else{const e=t.geometry;e.boundingSphere===null&&e.computeBoundingSphere(),fr.copy(e.boundingSphere).applyMatrix4(t.matrixWorld)}return this.intersectsSphere(fr)}intersectsSprite(t){fr.center.set(0,0,0);const e=$_.distanceTo(t.center);return fr.radius=.7071067811865476+e,fr.applyMatrix4(t.matrixWorld),this.intersectsSphere(fr)}intersectsSphere(t){const e=this.planes,i=t.center,s=-t.radius;for(let r=0;r<6;r++)if(e[r].distanceToPoint(i)<s)return!1;return!0}intersectsBox(t){const e=this.planes;for(let i=0;i<6;i++){const s=e[i];if(tl.x=s.normal.x>0?t.max.x:t.min.x,tl.y=s.normal.y>0?t.max.y:t.min.y,tl.z=s.normal.z>0?t.max.z:t.min.z,s.distanceToPoint(tl)<0)return!1}return!0}containsPoint(t){const e=this.planes;for(let i=0;i<6;i++)if(e[i].distanceToPoint(t)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}class Y_ extends qr{constructor(t){super(),this.isPointsMaterial=!0,this.type="PointsMaterial",this.color=new gt(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.alphaMap=t.alphaMap,this.size=t.size,this.sizeAttenuation=t.sizeAttenuation,this.fog=t.fog,this}}const b1=new re,Hu=new Of,el=new rr,nl=new C;class j_ extends ze{constructor(t=new xe,e=new Y_){super(),this.isPoints=!0,this.type="Points",this.geometry=t,this.material=e,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}raycast(t,e){const i=this.geometry,s=this.matrixWorld,r=t.params.Points.threshold,a=i.drawRange;if(i.boundingSphere===null&&i.computeBoundingSphere(),el.copy(i.boundingSphere),el.applyMatrix4(s),el.radius+=r,t.ray.intersectsSphere(el)===!1)return;b1.copy(s).invert(),Hu.copy(t.ray).applyMatrix4(b1);const o=r/((this.scale.x+this.scale.y+this.scale.z)/3),c=o*o,l=i.index,u=i.attributes.position;if(l!==null){const f=Math.max(0,a.start),d=Math.min(l.count,a.start+a.count);for(let m=f,v=d;m<v;m++){const g=l.getX(m);nl.fromBufferAttribute(u,g),w1(nl,g,c,s,t,e,this)}}else{const f=Math.max(0,a.start),d=Math.min(u.count,a.start+a.count);for(let m=f,v=d;m<v;m++)nl.fromBufferAttribute(u,m),w1(nl,m,c,s,t,e,this)}}updateMorphTargets(){const e=this.geometry.morphAttributes,i=Object.keys(e);if(i.length>0){const s=e[i[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=s.length;r<a;r++){const o=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}}function w1(n,t,e,i,s,r,a){const o=Hu.distanceSqToPoint(n);if(o<e){const c=new C;Hu.closestPointToPoint(n,c),c.applyMatrix4(i);const l=s.ray.origin.distanceTo(c);if(l<s.near||l>s.far)return;r.push({distance:l,distanceToRay:Math.sqrt(o),point:c,index:t,face:null,faceIndex:null,barycoord:null,object:a})}}class Z_ extends hn{constructor(t,e,i,s,r=Ie,a=Ie,o,c,l){super(t,e,i,s,r,a,o,c,l),this.isVideoTexture=!0,this.generateMipmaps=!1,this._requestVideoFrameCallbackId=0;const h=this;function u(){h.needsUpdate=!0,h._requestVideoFrameCallbackId=t.requestVideoFrameCallback(u)}"requestVideoFrameCallback"in t&&(this._requestVideoFrameCallbackId=t.requestVideoFrameCallback(u))}clone(){return new this.constructor(this.image).copy(this)}update(){const t=this.image;"requestVideoFrameCallback"in t===!1&&t.readyState>=t.HAVE_CURRENT_DATA&&(this.needsUpdate=!0)}dispose(){this._requestVideoFrameCallbackId!==0&&this.source.data.cancelVideoFrameCallback(this._requestVideoFrameCallbackId),super.dispose()}}class Yl extends hn{constructor(t,e,i,s,r,a,o,c,l){super(t,e,i,s,r,a,o,c,l),this.isCanvasTexture=!0,this.needsUpdate=!0}}class wg extends hn{constructor(t,e,i=Br,s,r,a,o=ni,c=ni,l,h=ic,u=1){if(h!==ic&&h!==sc)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");const f={width:t,height:e,depth:u};super(f,s,r,a,o,c,h,i,l),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(t){return super.copy(t),this.source=new Ff(Object.assign({},t.image)),this.compareFunction=t.compareFunction,this}toJSON(t){const e=super.toJSON(t);return this.compareFunction!==null&&(e.compareFunction=this.compareFunction),e}}class yg extends hn{constructor(t=null){super(),this.sourceTexture=t,this.isExternalTexture=!0}copy(t){return super.copy(t),this.sourceTexture=t.sourceTexture,this}}class ac extends xe{constructor(t=1,e=1,i=4,s=8,r=1){super(),this.type="CapsuleGeometry",this.parameters={radius:t,height:e,capSegments:i,radialSegments:s,heightSegments:r},e=Math.max(0,e),i=Math.max(1,Math.floor(i)),s=Math.max(3,Math.floor(s)),r=Math.max(1,Math.floor(r));const a=[],o=[],c=[],l=[],h=e/2,u=Math.PI/2*t,f=e,d=2*u+f,m=i*2+r,v=s+1,g=new C,p=new C;for(let _=0;_<=m;_++){let x=0,M=0,w=0,S=0;if(_<=i){const b=_/i,y=b*Math.PI/2;M=-h-t*Math.cos(y),w=t*Math.sin(y),S=-t*Math.cos(y),x=b*u}else if(_<=i+r){const b=(_-i)/r;M=-h+b*e,w=t,S=0,x=u+b*f}else{const b=(_-i-r)/i,y=b*Math.PI/2;M=h+t*Math.sin(y),w=t*Math.cos(y),S=t*Math.sin(y),x=u+f+b*u}const T=Math.max(0,Math.min(1,x/d));let A=0;_===0?A=.5/s:_===m&&(A=-.5/s);for(let b=0;b<=s;b++){const y=b/s,E=y*Math.PI*2,R=Math.sin(E),P=Math.cos(E);p.x=-w*P,p.y=M,p.z=w*R,o.push(p.x,p.y,p.z),g.set(-w*P,S,w*R),g.normalize(),c.push(g.x,g.y,g.z),l.push(y+A,T)}if(_>0){const b=(_-1)*v;for(let y=0;y<s;y++){const E=b+y,R=b+y+1,P=_*v+y,I=_*v+y+1;a.push(E,R,P),a.push(R,I,P)}}}this.setIndex(a),this.setAttribute("position",new ie(o,3)),this.setAttribute("normal",new ie(c,3)),this.setAttribute("uv",new ie(l,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new ac(t.radius,t.height,t.capSegments,t.radialSegments,t.heightSegments)}}class zr extends xe{constructor(t=1,e=32,i=0,s=Math.PI*2){super(),this.type="CircleGeometry",this.parameters={radius:t,segments:e,thetaStart:i,thetaLength:s},e=Math.max(3,e);const r=[],a=[],o=[],c=[],l=new C,h=new ft;a.push(0,0,0),o.push(0,0,1),c.push(.5,.5);for(let u=0,f=3;u<=e;u++,f+=3){const d=i+u/e*s;l.x=t*Math.cos(d),l.y=t*Math.sin(d),a.push(l.x,l.y,l.z),o.push(0,0,1),h.x=(a[f]/t+1)/2,h.y=(a[f+1]/t+1)/2,c.push(h.x,h.y)}for(let u=1;u<=e;u++)r.push(u,u+1,0);this.setIndex(r),this.setAttribute("position",new ie(a,3)),this.setAttribute("normal",new ie(o,3)),this.setAttribute("uv",new ie(c,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new zr(t.radius,t.segments,t.thetaStart,t.thetaLength)}}class vn extends xe{constructor(t=1,e=1,i=1,s=32,r=1,a=!1,o=0,c=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:t,radiusBottom:e,height:i,radialSegments:s,heightSegments:r,openEnded:a,thetaStart:o,thetaLength:c};const l=this;s=Math.floor(s),r=Math.floor(r);const h=[],u=[],f=[],d=[];let m=0;const v=[],g=i/2;let p=0;_(),a===!1&&(t>0&&x(!0),e>0&&x(!1)),this.setIndex(h),this.setAttribute("position",new ie(u,3)),this.setAttribute("normal",new ie(f,3)),this.setAttribute("uv",new ie(d,2));function _(){const M=new C,w=new C;let S=0;const T=(e-t)/i;for(let A=0;A<=r;A++){const b=[],y=A/r,E=y*(e-t)+t;for(let R=0;R<=s;R++){const P=R/s,I=P*c+o,F=Math.sin(I),H=Math.cos(I);w.x=E*F,w.y=-y*i+g,w.z=E*H,u.push(w.x,w.y,w.z),M.set(F,T,H).normalize(),f.push(M.x,M.y,M.z),d.push(P,1-y),b.push(m++)}v.push(b)}for(let A=0;A<s;A++)for(let b=0;b<r;b++){const y=v[b][A],E=v[b+1][A],R=v[b+1][A+1],P=v[b][A+1];(t>0||b!==0)&&(h.push(y,E,P),S+=3),(e>0||b!==r-1)&&(h.push(E,R,P),S+=3)}l.addGroup(p,S,0),p+=S}function x(M){const w=m,S=new ft,T=new C;let A=0;const b=M===!0?t:e,y=M===!0?1:-1;for(let R=1;R<=s;R++)u.push(0,g*y,0),f.push(0,y,0),d.push(.5,.5),m++;const E=m;for(let R=0;R<=s;R++){const I=R/s*c+o,F=Math.cos(I),H=Math.sin(I);T.x=b*H,T.y=g*y,T.z=b*F,u.push(T.x,T.y,T.z),f.push(0,y,0),S.x=F*.5+.5,S.y=H*.5*y+.5,d.push(S.x,S.y),m++}for(let R=0;R<s;R++){const P=w+R,I=E+R;M===!0?h.push(I,I+1,P):h.push(I+1,I,P),A+=3}l.addGroup(p,A,M===!0?1:2),p+=A}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new vn(t.radiusTop,t.radiusBottom,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}}class ii extends vn{constructor(t=1,e=1,i=32,s=1,r=!1,a=0,o=Math.PI*2){super(0,t,e,i,s,r,a,o),this.type="ConeGeometry",this.parameters={radius:t,height:e,radialSegments:i,heightSegments:s,openEnded:r,thetaStart:a,thetaLength:o}}static fromJSON(t){return new ii(t.radius,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}}class cs{constructor(){this.type="Curve",this.arcLengthDivisions=200,this.needsUpdate=!1,this.cacheArcLengths=null}getPoint(){console.warn("THREE.Curve: .getPoint() not implemented.")}getPointAt(t,e){const i=this.getUtoTmapping(t);return this.getPoint(i,e)}getPoints(t=5){const e=[];for(let i=0;i<=t;i++)e.push(this.getPoint(i/t));return e}getSpacedPoints(t=5){const e=[];for(let i=0;i<=t;i++)e.push(this.getPointAt(i/t));return e}getLength(){const t=this.getLengths();return t[t.length-1]}getLengths(t=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===t+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;const e=[];let i,s=this.getPoint(0),r=0;e.push(0);for(let a=1;a<=t;a++)i=this.getPoint(a/t),r+=i.distanceTo(s),e.push(r),s=i;return this.cacheArcLengths=e,e}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(t,e=null){const i=this.getLengths();let s=0;const r=i.length;let a;e?a=e:a=t*i[r-1];let o=0,c=r-1,l;for(;o<=c;)if(s=Math.floor(o+(c-o)/2),l=i[s]-a,l<0)o=s+1;else if(l>0)c=s-1;else{c=s;break}if(s=c,i[s]===a)return s/(r-1);const h=i[s],f=i[s+1]-h,d=(a-h)/f;return(s+d)/(r-1)}getTangent(t,e){let s=t-1e-4,r=t+1e-4;s<0&&(s=0),r>1&&(r=1);const a=this.getPoint(s),o=this.getPoint(r),c=e||(a.isVector2?new ft:new C);return c.copy(o).sub(a).normalize(),c}getTangentAt(t,e){const i=this.getUtoTmapping(t);return this.getTangent(i,e)}computeFrenetFrames(t,e=!1){const i=new C,s=[],r=[],a=[],o=new C,c=new re;for(let d=0;d<=t;d++){const m=d/t;s[d]=this.getTangentAt(m,new C)}r[0]=new C,a[0]=new C;let l=Number.MAX_VALUE;const h=Math.abs(s[0].x),u=Math.abs(s[0].y),f=Math.abs(s[0].z);h<=l&&(l=h,i.set(1,0,0)),u<=l&&(l=u,i.set(0,1,0)),f<=l&&i.set(0,0,1),o.crossVectors(s[0],i).normalize(),r[0].crossVectors(s[0],o),a[0].crossVectors(s[0],r[0]);for(let d=1;d<=t;d++){if(r[d]=r[d-1].clone(),a[d]=a[d-1].clone(),o.crossVectors(s[d-1],s[d]),o.length()>Number.EPSILON){o.normalize();const m=Math.acos(ne(s[d-1].dot(s[d]),-1,1));r[d].applyMatrix4(c.makeRotationAxis(o,m))}a[d].crossVectors(s[d],r[d])}if(e===!0){let d=Math.acos(ne(r[0].dot(r[t]),-1,1));d/=t,s[0].dot(o.crossVectors(r[0],r[t]))>0&&(d=-d);for(let m=1;m<=t;m++)r[m].applyMatrix4(c.makeRotationAxis(s[m],d*m)),a[m].crossVectors(s[m],r[m])}return{tangents:s,normals:r,binormals:a}}clone(){return new this.constructor().copy(this)}copy(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}toJSON(){const t={metadata:{version:4.7,type:"Curve",generator:"Curve.toJSON"}};return t.arcLengthDivisions=this.arcLengthDivisions,t.type=this.type,t}fromJSON(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}}class Gf extends cs{constructor(t=0,e=0,i=1,s=1,r=0,a=Math.PI*2,o=!1,c=0){super(),this.isEllipseCurve=!0,this.type="EllipseCurve",this.aX=t,this.aY=e,this.xRadius=i,this.yRadius=s,this.aStartAngle=r,this.aEndAngle=a,this.aClockwise=o,this.aRotation=c}getPoint(t,e=new ft){const i=e,s=Math.PI*2;let r=this.aEndAngle-this.aStartAngle;const a=Math.abs(r)<Number.EPSILON;for(;r<0;)r+=s;for(;r>s;)r-=s;r<Number.EPSILON&&(a?r=0:r=s),this.aClockwise===!0&&!a&&(r===s?r=-s:r=r-s);const o=this.aStartAngle+t*r;let c=this.aX+this.xRadius*Math.cos(o),l=this.aY+this.yRadius*Math.sin(o);if(this.aRotation!==0){const h=Math.cos(this.aRotation),u=Math.sin(this.aRotation),f=c-this.aX,d=l-this.aY;c=f*h-d*u+this.aX,l=f*u+d*h+this.aY}return i.set(c,l)}copy(t){return super.copy(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}toJSON(){const t=super.toJSON();return t.aX=this.aX,t.aY=this.aY,t.xRadius=this.xRadius,t.yRadius=this.yRadius,t.aStartAngle=this.aStartAngle,t.aEndAngle=this.aEndAngle,t.aClockwise=this.aClockwise,t.aRotation=this.aRotation,t}fromJSON(t){return super.fromJSON(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}}class J_ extends Gf{constructor(t,e,i,s,r,a){super(t,e,i,i,s,r,a),this.isArcCurve=!0,this.type="ArcCurve"}}function Wf(){let n=0,t=0,e=0,i=0;function s(r,a,o,c){n=r,t=o,e=-3*r+3*a-2*o-c,i=2*r-2*a+o+c}return{initCatmullRom:function(r,a,o,c,l){s(a,o,l*(o-r),l*(c-a))},initNonuniformCatmullRom:function(r,a,o,c,l,h,u){let f=(a-r)/l-(o-r)/(l+h)+(o-a)/h,d=(o-a)/h-(c-a)/(h+u)+(c-o)/u;f*=h,d*=h,s(a,o,f,d)},calc:function(r){const a=r*r,o=a*r;return n+t*r+e*a+i*o}}}const il=new C,s0=new Wf,r0=new Wf,a0=new Wf;class vi extends cs{constructor(t=[],e=!1,i="centripetal",s=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=t,this.closed=e,this.curveType=i,this.tension=s}getPoint(t,e=new C){const i=e,s=this.points,r=s.length,a=(r-(this.closed?0:1))*t;let o=Math.floor(a),c=a-o;this.closed?o+=o>0?0:(Math.floor(Math.abs(o)/r)+1)*r:c===0&&o===r-1&&(o=r-2,c=1);let l,h;this.closed||o>0?l=s[(o-1)%r]:(il.subVectors(s[0],s[1]).add(s[0]),l=il);const u=s[o%r],f=s[(o+1)%r];if(this.closed||o+2<r?h=s[(o+2)%r]:(il.subVectors(s[r-1],s[r-2]).add(s[r-1]),h=il),this.curveType==="centripetal"||this.curveType==="chordal"){const d=this.curveType==="chordal"?.5:.25;let m=Math.pow(l.distanceToSquared(u),d),v=Math.pow(u.distanceToSquared(f),d),g=Math.pow(f.distanceToSquared(h),d);v<1e-4&&(v=1),m<1e-4&&(m=v),g<1e-4&&(g=v),s0.initNonuniformCatmullRom(l.x,u.x,f.x,h.x,m,v,g),r0.initNonuniformCatmullRom(l.y,u.y,f.y,h.y,m,v,g),a0.initNonuniformCatmullRom(l.z,u.z,f.z,h.z,m,v,g)}else this.curveType==="catmullrom"&&(s0.initCatmullRom(l.x,u.x,f.x,h.x,this.tension),r0.initCatmullRom(l.y,u.y,f.y,h.y,this.tension),a0.initCatmullRom(l.z,u.z,f.z,h.z,this.tension));return i.set(s0.calc(c),r0.calc(c),a0.calc(c)),i}copy(t){super.copy(t),this.points=[];for(let e=0,i=t.points.length;e<i;e++){const s=t.points[e];this.points.push(s.clone())}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}toJSON(){const t=super.toJSON();t.points=[];for(let e=0,i=this.points.length;e<i;e++){const s=this.points[e];t.points.push(s.toArray())}return t.closed=this.closed,t.curveType=this.curveType,t.tension=this.tension,t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,i=t.points.length;e<i;e++){const s=t.points[e];this.points.push(new C().fromArray(s))}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}}function y1(n,t,e,i,s){const r=(i-t)*.5,a=(s-e)*.5,o=n*n,c=n*o;return(2*e-2*i+r+a)*c+(-3*e+3*i-2*r-a)*o+r*n+e}function K_(n,t){const e=1-n;return e*e*t}function Q_(n,t){return 2*(1-n)*n*t}function tM(n,t){return n*n*t}function qo(n,t,e,i){return K_(n,t)+Q_(n,e)+tM(n,i)}function eM(n,t){const e=1-n;return e*e*e*t}function nM(n,t){const e=1-n;return 3*e*e*n*t}function iM(n,t){return 3*(1-n)*n*n*t}function sM(n,t){return n*n*n*t}function $o(n,t,e,i,s){return eM(n,t)+nM(n,e)+iM(n,i)+sM(n,s)}class Sg extends cs{constructor(t=new ft,e=new ft,i=new ft,s=new ft){super(),this.isCubicBezierCurve=!0,this.type="CubicBezierCurve",this.v0=t,this.v1=e,this.v2=i,this.v3=s}getPoint(t,e=new ft){const i=e,s=this.v0,r=this.v1,a=this.v2,o=this.v3;return i.set($o(t,s.x,r.x,a.x,o.x),$o(t,s.y,r.y,a.y,o.y)),i}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}}class rM extends cs{constructor(t=new C,e=new C,i=new C,s=new C){super(),this.isCubicBezierCurve3=!0,this.type="CubicBezierCurve3",this.v0=t,this.v1=e,this.v2=i,this.v3=s}getPoint(t,e=new C){const i=e,s=this.v0,r=this.v1,a=this.v2,o=this.v3;return i.set($o(t,s.x,r.x,a.x,o.x),$o(t,s.y,r.y,a.y,o.y),$o(t,s.z,r.z,a.z,o.z)),i}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}}class Eg extends cs{constructor(t=new ft,e=new ft){super(),this.isLineCurve=!0,this.type="LineCurve",this.v1=t,this.v2=e}getPoint(t,e=new ft){const i=e;return t===1?i.copy(this.v2):(i.copy(this.v2).sub(this.v1),i.multiplyScalar(t).add(this.v1)),i}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new ft){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class aM extends cs{constructor(t=new C,e=new C){super(),this.isLineCurve3=!0,this.type="LineCurve3",this.v1=t,this.v2=e}getPoint(t,e=new C){const i=e;return t===1?i.copy(this.v2):(i.copy(this.v2).sub(this.v1),i.multiplyScalar(t).add(this.v1)),i}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new C){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class Tg extends cs{constructor(t=new ft,e=new ft,i=new ft){super(),this.isQuadraticBezierCurve=!0,this.type="QuadraticBezierCurve",this.v0=t,this.v1=e,this.v2=i}getPoint(t,e=new ft){const i=e,s=this.v0,r=this.v1,a=this.v2;return i.set(qo(t,s.x,r.x,a.x),qo(t,s.y,r.y,a.y)),i}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class Ag extends cs{constructor(t=new C,e=new C,i=new C){super(),this.isQuadraticBezierCurve3=!0,this.type="QuadraticBezierCurve3",this.v0=t,this.v1=e,this.v2=i}getPoint(t,e=new C){const i=e,s=this.v0,r=this.v1,a=this.v2;return i.set(qo(t,s.x,r.x,a.x),qo(t,s.y,r.y,a.y),qo(t,s.z,r.z,a.z)),i}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class Rg extends cs{constructor(t=[]){super(),this.isSplineCurve=!0,this.type="SplineCurve",this.points=t}getPoint(t,e=new ft){const i=e,s=this.points,r=(s.length-1)*t,a=Math.floor(r),o=r-a,c=s[a===0?a:a-1],l=s[a],h=s[a>s.length-2?s.length-1:a+1],u=s[a>s.length-3?s.length-1:a+2];return i.set(y1(o,c.x,l.x,h.x,u.x),y1(o,c.y,l.y,h.y,u.y)),i}copy(t){super.copy(t),this.points=[];for(let e=0,i=t.points.length;e<i;e++){const s=t.points[e];this.points.push(s.clone())}return this}toJSON(){const t=super.toJSON();t.points=[];for(let e=0,i=this.points.length;e<i;e++){const s=this.points[e];t.points.push(s.toArray())}return t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,i=t.points.length;e<i;e++){const s=t.points[e];this.points.push(new ft().fromArray(s))}return this}}var jl=Object.freeze({__proto__:null,ArcCurve:J_,CatmullRomCurve3:vi,CubicBezierCurve:Sg,CubicBezierCurve3:rM,EllipseCurve:Gf,LineCurve:Eg,LineCurve3:aM,QuadraticBezierCurve:Tg,QuadraticBezierCurve3:Ag,SplineCurve:Rg});class oM extends cs{constructor(){super(),this.type="CurvePath",this.curves=[],this.autoClose=!1}add(t){this.curves.push(t)}closePath(){const t=this.curves[0].getPoint(0),e=this.curves[this.curves.length-1].getPoint(1);if(!t.equals(e)){const i=t.isVector2===!0?"LineCurve":"LineCurve3";this.curves.push(new jl[i](e,t))}return this}getPoint(t,e){const i=t*this.getLength(),s=this.getCurveLengths();let r=0;for(;r<s.length;){if(s[r]>=i){const a=s[r]-i,o=this.curves[r],c=o.getLength(),l=c===0?0:1-a/c;return o.getPointAt(l,e)}r++}return null}getLength(){const t=this.getCurveLengths();return t[t.length-1]}updateArcLengths(){this.needsUpdate=!0,this.cacheLengths=null,this.getCurveLengths()}getCurveLengths(){if(this.cacheLengths&&this.cacheLengths.length===this.curves.length)return this.cacheLengths;const t=[];let e=0;for(let i=0,s=this.curves.length;i<s;i++)e+=this.curves[i].getLength(),t.push(e);return this.cacheLengths=t,t}getSpacedPoints(t=40){const e=[];for(let i=0;i<=t;i++)e.push(this.getPoint(i/t));return this.autoClose&&e.push(e[0]),e}getPoints(t=12){const e=[];let i;for(let s=0,r=this.curves;s<r.length;s++){const a=r[s],o=a.isEllipseCurve?t*2:a.isLineCurve||a.isLineCurve3?1:a.isSplineCurve?t*a.points.length:t,c=a.getPoints(o);for(let l=0;l<c.length;l++){const h=c[l];i&&i.equals(h)||(e.push(h),i=h)}}return this.autoClose&&e.length>1&&!e[e.length-1].equals(e[0])&&e.push(e[0]),e}copy(t){super.copy(t),this.curves=[];for(let e=0,i=t.curves.length;e<i;e++){const s=t.curves[e];this.curves.push(s.clone())}return this.autoClose=t.autoClose,this}toJSON(){const t=super.toJSON();t.autoClose=this.autoClose,t.curves=[];for(let e=0,i=this.curves.length;e<i;e++){const s=this.curves[e];t.curves.push(s.toJSON())}return t}fromJSON(t){super.fromJSON(t),this.autoClose=t.autoClose,this.curves=[];for(let e=0,i=t.curves.length;e<i;e++){const s=t.curves[e];this.curves.push(new jl[s.type]().fromJSON(s))}return this}}class S1 extends oM{constructor(t){super(),this.type="Path",this.currentPoint=new ft,t&&this.setFromPoints(t)}setFromPoints(t){this.moveTo(t[0].x,t[0].y);for(let e=1,i=t.length;e<i;e++)this.lineTo(t[e].x,t[e].y);return this}moveTo(t,e){return this.currentPoint.set(t,e),this}lineTo(t,e){const i=new Eg(this.currentPoint.clone(),new ft(t,e));return this.curves.push(i),this.currentPoint.set(t,e),this}quadraticCurveTo(t,e,i,s){const r=new Tg(this.currentPoint.clone(),new ft(t,e),new ft(i,s));return this.curves.push(r),this.currentPoint.set(i,s),this}bezierCurveTo(t,e,i,s,r,a){const o=new Sg(this.currentPoint.clone(),new ft(t,e),new ft(i,s),new ft(r,a));return this.curves.push(o),this.currentPoint.set(r,a),this}splineThru(t){const e=[this.currentPoint.clone()].concat(t),i=new Rg(e);return this.curves.push(i),this.currentPoint.copy(t[t.length-1]),this}arc(t,e,i,s,r,a){const o=this.currentPoint.x,c=this.currentPoint.y;return this.absarc(t+o,e+c,i,s,r,a),this}absarc(t,e,i,s,r,a){return this.absellipse(t,e,i,i,s,r,a),this}ellipse(t,e,i,s,r,a,o,c){const l=this.currentPoint.x,h=this.currentPoint.y;return this.absellipse(t+l,e+h,i,s,r,a,o,c),this}absellipse(t,e,i,s,r,a,o,c){const l=new Gf(t,e,i,s,r,a,o,c);if(this.curves.length>0){const u=l.getPoint(0);u.equals(this.currentPoint)||this.lineTo(u.x,u.y)}this.curves.push(l);const h=l.getPoint(1);return this.currentPoint.copy(h),this}copy(t){return super.copy(t),this.currentPoint.copy(t.currentPoint),this}toJSON(){const t=super.toJSON();return t.currentPoint=this.currentPoint.toArray(),t}fromJSON(t){return super.fromJSON(t),this.currentPoint.fromArray(t.currentPoint),this}}class Xf extends S1{constructor(t){super(t),this.uuid=Ni(),this.type="Shape",this.holes=[]}getPointsHoles(t){const e=[];for(let i=0,s=this.holes.length;i<s;i++)e[i]=this.holes[i].getPoints(t);return e}extractPoints(t){return{shape:this.getPoints(t),holes:this.getPointsHoles(t)}}copy(t){super.copy(t),this.holes=[];for(let e=0,i=t.holes.length;e<i;e++){const s=t.holes[e];this.holes.push(s.clone())}return this}toJSON(){const t=super.toJSON();t.uuid=this.uuid,t.holes=[];for(let e=0,i=this.holes.length;e<i;e++){const s=this.holes[e];t.holes.push(s.toJSON())}return t}fromJSON(t){super.fromJSON(t),this.uuid=t.uuid,this.holes=[];for(let e=0,i=t.holes.length;e<i;e++){const s=t.holes[e];this.holes.push(new S1().fromJSON(s))}return this}}function cM(n,t,e=2){const i=t&&t.length,s=i?t[0]*e:n.length;let r=Cg(n,0,s,e,!0);const a=[];if(!r||r.next===r.prev)return a;let o,c,l;if(i&&(r=dM(n,t,r,e)),n.length>80*e){o=1/0,c=1/0;let h=-1/0,u=-1/0;for(let f=e;f<s;f+=e){const d=n[f],m=n[f+1];d<o&&(o=d),m<c&&(c=m),d>h&&(h=d),m>u&&(u=m)}l=Math.max(h-o,u-c),l=l!==0?32767/l:0}return oc(r,a,e,o,c,l,0),a}function Cg(n,t,e,i,s){let r;if(s===SM(n,t,e,i)>0)for(let a=t;a<e;a+=i)r=E1(a/i|0,n[a],n[a+1],r);else for(let a=e-i;a>=t;a-=i)r=E1(a/i|0,n[a],n[a+1],r);return r&&oo(r,r.next)&&(lc(r),r=r.next),r}function Vr(n,t){if(!n)return n;t||(t=n);let e=n,i;do if(i=!1,!e.steiner&&(oo(e,e.next)||Fe(e.prev,e,e.next)===0)){if(lc(e),e=t=e.prev,e===e.next)break;i=!0}else e=e.next;while(i||e!==t);return t}function oc(n,t,e,i,s,r,a){if(!n)return;!a&&r&&xM(n,i,s,r);let o=n;for(;n.prev!==n.next;){const c=n.prev,l=n.next;if(r?hM(n,i,s,r):lM(n)){t.push(c.i,n.i,l.i),lc(n),n=l.next,o=l.next;continue}if(n=l,n===o){a?a===1?(n=uM(Vr(n),t),oc(n,t,e,i,s,r,2)):a===2&&fM(n,t,e,i,s,r):oc(Vr(n),t,e,i,s,r,1);break}}}function lM(n){const t=n.prev,e=n,i=n.next;if(Fe(t,e,i)>=0)return!1;const s=t.x,r=e.x,a=i.x,o=t.y,c=e.y,l=i.y,h=Math.min(s,r,a),u=Math.min(o,c,l),f=Math.max(s,r,a),d=Math.max(o,c,l);let m=i.next;for(;m!==t;){if(m.x>=h&&m.x<=f&&m.y>=u&&m.y<=d&&Ho(s,o,r,c,a,l,m.x,m.y)&&Fe(m.prev,m,m.next)>=0)return!1;m=m.next}return!0}function hM(n,t,e,i){const s=n.prev,r=n,a=n.next;if(Fe(s,r,a)>=0)return!1;const o=s.x,c=r.x,l=a.x,h=s.y,u=r.y,f=a.y,d=Math.min(o,c,l),m=Math.min(h,u,f),v=Math.max(o,c,l),g=Math.max(h,u,f),p=zu(d,m,t,e,i),_=zu(v,g,t,e,i);let x=n.prevZ,M=n.nextZ;for(;x&&x.z>=p&&M&&M.z<=_;){if(x.x>=d&&x.x<=v&&x.y>=m&&x.y<=g&&x!==s&&x!==a&&Ho(o,h,c,u,l,f,x.x,x.y)&&Fe(x.prev,x,x.next)>=0||(x=x.prevZ,M.x>=d&&M.x<=v&&M.y>=m&&M.y<=g&&M!==s&&M!==a&&Ho(o,h,c,u,l,f,M.x,M.y)&&Fe(M.prev,M,M.next)>=0))return!1;M=M.nextZ}for(;x&&x.z>=p;){if(x.x>=d&&x.x<=v&&x.y>=m&&x.y<=g&&x!==s&&x!==a&&Ho(o,h,c,u,l,f,x.x,x.y)&&Fe(x.prev,x,x.next)>=0)return!1;x=x.prevZ}for(;M&&M.z<=_;){if(M.x>=d&&M.x<=v&&M.y>=m&&M.y<=g&&M!==s&&M!==a&&Ho(o,h,c,u,l,f,M.x,M.y)&&Fe(M.prev,M,M.next)>=0)return!1;M=M.nextZ}return!0}function uM(n,t){let e=n;do{const i=e.prev,s=e.next.next;!oo(i,s)&&Pg(i,e,e.next,s)&&cc(i,s)&&cc(s,i)&&(t.push(i.i,e.i,s.i),lc(e),lc(e.next),e=n=s),e=e.next}while(e!==n);return Vr(e)}function fM(n,t,e,i,s,r){let a=n;do{let o=a.next.next;for(;o!==a.prev;){if(a.i!==o.i&&bM(a,o)){let c=Ig(a,o);a=Vr(a,a.next),c=Vr(c,c.next),oc(a,t,e,i,s,r,0),oc(c,t,e,i,s,r,0);return}o=o.next}a=a.next}while(a!==n)}function dM(n,t,e,i){const s=[];for(let r=0,a=t.length;r<a;r++){const o=t[r]*i,c=r<a-1?t[r+1]*i:n.length,l=Cg(n,o,c,i,!1);l===l.next&&(l.steiner=!0),s.push(MM(l))}s.sort(pM);for(let r=0;r<s.length;r++)e=mM(s[r],e);return e}function pM(n,t){let e=n.x-t.x;if(e===0&&(e=n.y-t.y,e===0)){const i=(n.next.y-n.y)/(n.next.x-n.x),s=(t.next.y-t.y)/(t.next.x-t.x);e=i-s}return e}function mM(n,t){const e=gM(n,t);if(!e)return t;const i=Ig(e,n);return Vr(i,i.next),Vr(e,e.next)}function gM(n,t){let e=t;const i=n.x,s=n.y;let r=-1/0,a;if(oo(n,e))return e;do{if(oo(n,e.next))return e.next;if(s<=e.y&&s>=e.next.y&&e.next.y!==e.y){const u=e.x+(s-e.y)*(e.next.x-e.x)/(e.next.y-e.y);if(u<=i&&u>r&&(r=u,a=e.x<e.next.x?e:e.next,u===i))return a}e=e.next}while(e!==t);if(!a)return null;const o=a,c=a.x,l=a.y;let h=1/0;e=a;do{if(i>=e.x&&e.x>=c&&i!==e.x&&Lg(s<l?i:r,s,c,l,s<l?r:i,s,e.x,e.y)){const u=Math.abs(s-e.y)/(i-e.x);cc(e,n)&&(u<h||u===h&&(e.x>a.x||e.x===a.x&&vM(a,e)))&&(a=e,h=u)}e=e.next}while(e!==o);return a}function vM(n,t){return Fe(n.prev,n,t.prev)<0&&Fe(t.next,n,n.next)<0}function xM(n,t,e,i){let s=n;do s.z===0&&(s.z=zu(s.x,s.y,t,e,i)),s.prevZ=s.prev,s.nextZ=s.next,s=s.next;while(s!==n);s.prevZ.nextZ=null,s.prevZ=null,_M(s)}function _M(n){let t,e=1;do{let i=n,s;n=null;let r=null;for(t=0;i;){t++;let a=i,o=0;for(let l=0;l<e&&(o++,a=a.nextZ,!!a);l++);let c=e;for(;o>0||c>0&&a;)o!==0&&(c===0||!a||i.z<=a.z)?(s=i,i=i.nextZ,o--):(s=a,a=a.nextZ,c--),r?r.nextZ=s:n=s,s.prevZ=r,r=s;i=a}r.nextZ=null,e*=2}while(t>1);return n}function zu(n,t,e,i,s){return n=(n-e)*s|0,t=(t-i)*s|0,n=(n|n<<8)&16711935,n=(n|n<<4)&252645135,n=(n|n<<2)&858993459,n=(n|n<<1)&1431655765,t=(t|t<<8)&16711935,t=(t|t<<4)&252645135,t=(t|t<<2)&858993459,t=(t|t<<1)&1431655765,n|t<<1}function MM(n){let t=n,e=n;do(t.x<e.x||t.x===e.x&&t.y<e.y)&&(e=t),t=t.next;while(t!==n);return e}function Lg(n,t,e,i,s,r,a,o){return(s-a)*(t-o)>=(n-a)*(r-o)&&(n-a)*(i-o)>=(e-a)*(t-o)&&(e-a)*(r-o)>=(s-a)*(i-o)}function Ho(n,t,e,i,s,r,a,o){return!(n===a&&t===o)&&Lg(n,t,e,i,s,r,a,o)}function bM(n,t){return n.next.i!==t.i&&n.prev.i!==t.i&&!wM(n,t)&&(cc(n,t)&&cc(t,n)&&yM(n,t)&&(Fe(n.prev,n,t.prev)||Fe(n,t.prev,t))||oo(n,t)&&Fe(n.prev,n,n.next)>0&&Fe(t.prev,t,t.next)>0)}function Fe(n,t,e){return(t.y-n.y)*(e.x-t.x)-(t.x-n.x)*(e.y-t.y)}function oo(n,t){return n.x===t.x&&n.y===t.y}function Pg(n,t,e,i){const s=rl(Fe(n,t,e)),r=rl(Fe(n,t,i)),a=rl(Fe(e,i,n)),o=rl(Fe(e,i,t));return!!(s!==r&&a!==o||s===0&&sl(n,e,t)||r===0&&sl(n,i,t)||a===0&&sl(e,n,i)||o===0&&sl(e,t,i))}function sl(n,t,e){return t.x<=Math.max(n.x,e.x)&&t.x>=Math.min(n.x,e.x)&&t.y<=Math.max(n.y,e.y)&&t.y>=Math.min(n.y,e.y)}function rl(n){return n>0?1:n<0?-1:0}function wM(n,t){let e=n;do{if(e.i!==n.i&&e.next.i!==n.i&&e.i!==t.i&&e.next.i!==t.i&&Pg(e,e.next,n,t))return!0;e=e.next}while(e!==n);return!1}function cc(n,t){return Fe(n.prev,n,n.next)<0?Fe(n,t,n.next)>=0&&Fe(n,n.prev,t)>=0:Fe(n,t,n.prev)<0||Fe(n,n.next,t)<0}function yM(n,t){let e=n,i=!1;const s=(n.x+t.x)/2,r=(n.y+t.y)/2;do e.y>r!=e.next.y>r&&e.next.y!==e.y&&s<(e.next.x-e.x)*(r-e.y)/(e.next.y-e.y)+e.x&&(i=!i),e=e.next;while(e!==n);return i}function Ig(n,t){const e=Vu(n.i,n.x,n.y),i=Vu(t.i,t.x,t.y),s=n.next,r=t.prev;return n.next=t,t.prev=n,e.next=s,s.prev=e,i.next=e,e.prev=i,r.next=i,i.prev=r,i}function E1(n,t,e,i){const s=Vu(n,t,e);return i?(s.next=i.next,s.prev=i,i.next.prev=s,i.next=s):(s.prev=s,s.next=s),s}function lc(n){n.next.prev=n.prev,n.prev.next=n.next,n.prevZ&&(n.prevZ.nextZ=n.nextZ),n.nextZ&&(n.nextZ.prevZ=n.prevZ)}function Vu(n,t,e){return{i:n,x:t,y:e,prev:null,next:null,z:0,prevZ:null,nextZ:null,steiner:!1}}function SM(n,t,e,i){let s=0;for(let r=t,a=e-i;r<e;r+=i)s+=(n[a]-n[r])*(n[r+1]+n[a+1]),a=r;return s}class EM{static triangulate(t,e,i=2){return cM(t,e,i)}}class Ia{static area(t){const e=t.length;let i=0;for(let s=e-1,r=0;r<e;s=r++)i+=t[s].x*t[r].y-t[r].x*t[s].y;return i*.5}static isClockWise(t){return Ia.area(t)<0}static triangulateShape(t,e){const i=[],s=[],r=[];T1(t),A1(i,t);let a=t.length;e.forEach(T1);for(let c=0;c<e.length;c++)s.push(a),a+=e[c].length,A1(i,e[c]);const o=EM.triangulate(i,s);for(let c=0;c<o.length;c+=3)r.push(o.slice(c,c+3));return r}}function T1(n){const t=n.length;t>2&&n[t-1].equals(n[0])&&n.pop()}function A1(n,t){for(let e=0;e<t.length;e++)n.push(t[e].x),n.push(t[e].y)}class _h extends xe{constructor(t=new Xf([new ft(.5,.5),new ft(-.5,.5),new ft(-.5,-.5),new ft(.5,-.5)]),e={}){super(),this.type="ExtrudeGeometry",this.parameters={shapes:t,options:e},t=Array.isArray(t)?t:[t];const i=this,s=[],r=[];for(let o=0,c=t.length;o<c;o++){const l=t[o];a(l)}this.setAttribute("position",new ie(s,3)),this.setAttribute("uv",new ie(r,2)),this.computeVertexNormals();function a(o){const c=[],l=e.curveSegments!==void 0?e.curveSegments:12,h=e.steps!==void 0?e.steps:1,u=e.depth!==void 0?e.depth:1;let f=e.bevelEnabled!==void 0?e.bevelEnabled:!0,d=e.bevelThickness!==void 0?e.bevelThickness:.2,m=e.bevelSize!==void 0?e.bevelSize:d-.1,v=e.bevelOffset!==void 0?e.bevelOffset:0,g=e.bevelSegments!==void 0?e.bevelSegments:3;const p=e.extrudePath,_=e.UVGenerator!==void 0?e.UVGenerator:TM;let x,M=!1,w,S,T,A;p&&(x=p.getSpacedPoints(h),M=!0,f=!1,w=p.computeFrenetFrames(h,!1),S=new C,T=new C,A=new C),f||(g=0,d=0,m=0,v=0);const b=o.extractPoints(l);let y=b.shape;const E=b.holes;if(!Ia.isClockWise(y)){y=y.reverse();for(let et=0,Q=E.length;et<Q;et++){const st=E[et];Ia.isClockWise(st)&&(E[et]=st.reverse())}}function P(et){const st=10000000000000001e-36;let ht=et[0];for(let pt=1;pt<=et.length;pt++){const _t=pt%et.length,bt=et[_t],ee=bt.x-ht.x,Kt=bt.y-ht.y,k=ee*ee+Kt*Kt,L=Math.max(Math.abs(bt.x),Math.abs(bt.y),Math.abs(ht.x),Math.abs(ht.y)),J=st*L*L;if(k<=J){et.splice(_t,1),pt--;continue}ht=bt}}P(y),E.forEach(P);const I=E.length,F=y;for(let et=0;et<I;et++){const Q=E[et];y=y.concat(Q)}function H(et,Q,st){return Q||console.error("THREE.ExtrudeGeometry: vec does not exist"),et.clone().addScaledVector(Q,st)}const $=y.length;function B(et,Q,st){let ht,pt,_t;const bt=et.x-Q.x,ee=et.y-Q.y,Kt=st.x-et.x,k=st.y-et.y,L=bt*bt+ee*ee,J=bt*k-ee*Kt;if(Math.abs(J)>Number.EPSILON){const ut=Math.sqrt(L),Mt=Math.sqrt(Kt*Kt+k*k),dt=Q.x-ee/ut,Vt=Q.y+bt/ut,At=st.x-k/Mt,Bt=st.y+Kt/Mt,Ht=((At-dt)*k-(Bt-Vt)*Kt)/(bt*k-ee*Kt);ht=dt+bt*Ht-et.x,pt=Vt+ee*Ht-et.y;const wt=ht*ht+pt*pt;if(wt<=2)return new ft(ht,pt);_t=Math.sqrt(wt/2)}else{let ut=!1;bt>Number.EPSILON?Kt>Number.EPSILON&&(ut=!0):bt<-Number.EPSILON?Kt<-Number.EPSILON&&(ut=!0):Math.sign(ee)===Math.sign(k)&&(ut=!0),ut?(ht=-ee,pt=bt,_t=Math.sqrt(L)):(ht=bt,pt=ee,_t=Math.sqrt(L/2))}return new ft(ht/_t,pt/_t)}const Y=[];for(let et=0,Q=F.length,st=Q-1,ht=et+1;et<Q;et++,st++,ht++)st===Q&&(st=0),ht===Q&&(ht=0),Y[et]=B(F[et],F[st],F[ht]);const it=[];let mt,vt=Y.concat();for(let et=0,Q=I;et<Q;et++){const st=E[et];mt=[];for(let ht=0,pt=st.length,_t=pt-1,bt=ht+1;ht<pt;ht++,_t++,bt++)_t===pt&&(_t=0),bt===pt&&(bt=0),mt[ht]=B(st[ht],st[_t],st[bt]);it.push(mt),vt=vt.concat(mt)}let St;if(g===0)St=Ia.triangulateShape(F,E);else{const et=[],Q=[];for(let st=0;st<g;st++){const ht=st/g,pt=d*Math.cos(ht*Math.PI/2),_t=m*Math.sin(ht*Math.PI/2)+v;for(let bt=0,ee=F.length;bt<ee;bt++){const Kt=H(F[bt],Y[bt],_t);W(Kt.x,Kt.y,-pt),ht===0&&et.push(Kt)}for(let bt=0,ee=I;bt<ee;bt++){const Kt=E[bt];mt=it[bt];const k=[];for(let L=0,J=Kt.length;L<J;L++){const ut=H(Kt[L],mt[L],_t);W(ut.x,ut.y,-pt),ht===0&&k.push(ut)}ht===0&&Q.push(k)}}St=Ia.triangulateShape(et,Q)}const Ct=St.length,Ut=m+v;for(let et=0;et<$;et++){const Q=f?H(y[et],vt[et],Ut):y[et];M?(T.copy(w.normals[0]).multiplyScalar(Q.x),S.copy(w.binormals[0]).multiplyScalar(Q.y),A.copy(x[0]).add(T).add(S),W(A.x,A.y,A.z)):W(Q.x,Q.y,0)}for(let et=1;et<=h;et++)for(let Q=0;Q<$;Q++){const st=f?H(y[Q],vt[Q],Ut):y[Q];M?(T.copy(w.normals[et]).multiplyScalar(st.x),S.copy(w.binormals[et]).multiplyScalar(st.y),A.copy(x[et]).add(T).add(S),W(A.x,A.y,A.z)):W(st.x,st.y,u/h*et)}for(let et=g-1;et>=0;et--){const Q=et/g,st=d*Math.cos(Q*Math.PI/2),ht=m*Math.sin(Q*Math.PI/2)+v;for(let pt=0,_t=F.length;pt<_t;pt++){const bt=H(F[pt],Y[pt],ht);W(bt.x,bt.y,u+st)}for(let pt=0,_t=E.length;pt<_t;pt++){const bt=E[pt];mt=it[pt];for(let ee=0,Kt=bt.length;ee<Kt;ee++){const k=H(bt[ee],mt[ee],ht);M?W(k.x,k.y+x[h-1].y,x[h-1].x+st):W(k.x,k.y,u+st)}}}V(),X();function V(){const et=s.length/3;if(f){let Q=0,st=$*Q;for(let ht=0;ht<Ct;ht++){const pt=St[ht];G(pt[2]+st,pt[1]+st,pt[0]+st)}Q=h+g*2,st=$*Q;for(let ht=0;ht<Ct;ht++){const pt=St[ht];G(pt[0]+st,pt[1]+st,pt[2]+st)}}else{for(let Q=0;Q<Ct;Q++){const st=St[Q];G(st[2],st[1],st[0])}for(let Q=0;Q<Ct;Q++){const st=St[Q];G(st[0]+$*h,st[1]+$*h,st[2]+$*h)}}i.addGroup(et,s.length/3-et,0)}function X(){const et=s.length/3;let Q=0;z(F,Q),Q+=F.length;for(let st=0,ht=E.length;st<ht;st++){const pt=E[st];z(pt,Q),Q+=pt.length}i.addGroup(et,s.length/3-et,1)}function z(et,Q){let st=et.length;for(;--st>=0;){const ht=st;let pt=st-1;pt<0&&(pt=et.length-1);for(let _t=0,bt=h+g*2;_t<bt;_t++){const ee=$*_t,Kt=$*(_t+1),k=Q+ht+ee,L=Q+pt+ee,J=Q+pt+Kt,ut=Q+ht+Kt;tt(k,L,J,ut)}}}function W(et,Q,st){c.push(et),c.push(Q),c.push(st)}function G(et,Q,st){at(et),at(Q),at(st);const ht=s.length/3,pt=_.generateTopUV(i,s,ht-3,ht-2,ht-1);N(pt[0]),N(pt[1]),N(pt[2])}function tt(et,Q,st,ht){at(et),at(Q),at(ht),at(Q),at(st),at(ht);const pt=s.length/3,_t=_.generateSideWallUV(i,s,pt-6,pt-3,pt-2,pt-1);N(_t[0]),N(_t[1]),N(_t[3]),N(_t[1]),N(_t[2]),N(_t[3])}function at(et){s.push(c[et*3+0]),s.push(c[et*3+1]),s.push(c[et*3+2])}function N(et){r.push(et.x),r.push(et.y)}}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}toJSON(){const t=super.toJSON(),e=this.parameters.shapes,i=this.parameters.options;return AM(e,i,t)}static fromJSON(t,e){const i=[];for(let r=0,a=t.shapes.length;r<a;r++){const o=e[t.shapes[r]];i.push(o)}const s=t.options.extrudePath;return s!==void 0&&(t.options.extrudePath=new jl[s.type]().fromJSON(s)),new _h(i,t.options)}}const TM={generateTopUV:function(n,t,e,i,s){const r=t[e*3],a=t[e*3+1],o=t[i*3],c=t[i*3+1],l=t[s*3],h=t[s*3+1];return[new ft(r,a),new ft(o,c),new ft(l,h)]},generateSideWallUV:function(n,t,e,i,s,r){const a=t[e*3],o=t[e*3+1],c=t[e*3+2],l=t[i*3],h=t[i*3+1],u=t[i*3+2],f=t[s*3],d=t[s*3+1],m=t[s*3+2],v=t[r*3],g=t[r*3+1],p=t[r*3+2];return Math.abs(o-h)<Math.abs(a-l)?[new ft(a,1-c),new ft(l,1-u),new ft(f,1-m),new ft(v,1-p)]:[new ft(o,1-c),new ft(h,1-u),new ft(d,1-m),new ft(g,1-p)]}};function AM(n,t,e){if(e.shapes=[],Array.isArray(n))for(let i=0,s=n.length;i<s;i++){const r=n[i];e.shapes.push(r.uuid)}else e.shapes.push(n.uuid);return e.options=Object.assign({},t),t.extrudePath!==void 0&&(e.options.extrudePath=t.extrudePath.toJSON()),e}class Bi extends xe{constructor(t=[new ft(0,-.5),new ft(.5,0),new ft(0,.5)],e=12,i=0,s=Math.PI*2){super(),this.type="LatheGeometry",this.parameters={points:t,segments:e,phiStart:i,phiLength:s},e=Math.floor(e),s=ne(s,0,Math.PI*2);const r=[],a=[],o=[],c=[],l=[],h=1/e,u=new C,f=new ft,d=new C,m=new C,v=new C;let g=0,p=0;for(let _=0;_<=t.length-1;_++)switch(_){case 0:g=t[_+1].x-t[_].x,p=t[_+1].y-t[_].y,d.x=p*1,d.y=-g,d.z=p*0,v.copy(d),d.normalize(),c.push(d.x,d.y,d.z);break;case t.length-1:c.push(v.x,v.y,v.z);break;default:g=t[_+1].x-t[_].x,p=t[_+1].y-t[_].y,d.x=p*1,d.y=-g,d.z=p*0,m.copy(d),d.x+=v.x,d.y+=v.y,d.z+=v.z,d.normalize(),c.push(d.x,d.y,d.z),v.copy(m)}for(let _=0;_<=e;_++){const x=i+_*h*s,M=Math.sin(x),w=Math.cos(x);for(let S=0;S<=t.length-1;S++){u.x=t[S].x*M,u.y=t[S].y,u.z=t[S].x*w,a.push(u.x,u.y,u.z),f.x=_/e,f.y=S/(t.length-1),o.push(f.x,f.y);const T=c[3*S+0]*M,A=c[3*S+1],b=c[3*S+0]*w;l.push(T,A,b)}}for(let _=0;_<e;_++)for(let x=0;x<t.length-1;x++){const M=x+_*t.length,w=M,S=M+t.length,T=M+t.length+1,A=M+1;r.push(w,S,A),r.push(T,A,S)}this.setIndex(r),this.setAttribute("position",new ie(a,3)),this.setAttribute("uv",new ie(o,2)),this.setAttribute("normal",new ie(l,3))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Bi(t.points,t.segments,t.phiStart,t.phiLength)}}class xi extends xe{constructor(t=1,e=1,i=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:t,height:e,widthSegments:i,heightSegments:s};const r=t/2,a=e/2,o=Math.floor(i),c=Math.floor(s),l=o+1,h=c+1,u=t/o,f=e/c,d=[],m=[],v=[],g=[];for(let p=0;p<h;p++){const _=p*f-a;for(let x=0;x<l;x++){const M=x*u-r;m.push(M,-_,0),v.push(0,0,1),g.push(x/o),g.push(1-p/c)}}for(let p=0;p<c;p++)for(let _=0;_<o;_++){const x=_+l*p,M=_+l*(p+1),w=_+1+l*(p+1),S=_+1+l*p;d.push(x,M,S),d.push(M,w,S)}this.setIndex(d),this.setAttribute("position",new ie(m,3)),this.setAttribute("normal",new ie(v,3)),this.setAttribute("uv",new ie(g,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new xi(t.width,t.height,t.widthSegments,t.heightSegments)}}class qf extends xe{constructor(t=.5,e=1,i=32,s=1,r=0,a=Math.PI*2){super(),this.type="RingGeometry",this.parameters={innerRadius:t,outerRadius:e,thetaSegments:i,phiSegments:s,thetaStart:r,thetaLength:a},i=Math.max(3,i),s=Math.max(1,s);const o=[],c=[],l=[],h=[];let u=t;const f=(e-t)/s,d=new C,m=new ft;for(let v=0;v<=s;v++){for(let g=0;g<=i;g++){const p=r+g/i*a;d.x=u*Math.cos(p),d.y=u*Math.sin(p),c.push(d.x,d.y,d.z),l.push(0,0,1),m.x=(d.x/e+1)/2,m.y=(d.y/e+1)/2,h.push(m.x,m.y)}u+=f}for(let v=0;v<s;v++){const g=v*(i+1);for(let p=0;p<i;p++){const _=p+g,x=_,M=_+i+1,w=_+i+2,S=_+1;o.push(x,M,S),o.push(M,w,S)}}this.setIndex(o),this.setAttribute("position",new ie(c,3)),this.setAttribute("normal",new ie(l,3)),this.setAttribute("uv",new ie(h,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new qf(t.innerRadius,t.outerRadius,t.thetaSegments,t.phiSegments,t.thetaStart,t.thetaLength)}}class Wt extends xe{constructor(t=1,e=32,i=16,s=0,r=Math.PI*2,a=0,o=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:t,widthSegments:e,heightSegments:i,phiStart:s,phiLength:r,thetaStart:a,thetaLength:o},e=Math.max(3,Math.floor(e)),i=Math.max(2,Math.floor(i));const c=Math.min(a+o,Math.PI);let l=0;const h=[],u=new C,f=new C,d=[],m=[],v=[],g=[];for(let p=0;p<=i;p++){const _=[],x=p/i;let M=0;p===0&&a===0?M=.5/e:p===i&&c===Math.PI&&(M=-.5/e);for(let w=0;w<=e;w++){const S=w/e;u.x=-t*Math.cos(s+S*r)*Math.sin(a+x*o),u.y=t*Math.cos(a+x*o),u.z=t*Math.sin(s+S*r)*Math.sin(a+x*o),m.push(u.x,u.y,u.z),f.copy(u).normalize(),v.push(f.x,f.y,f.z),g.push(S+M,1-x),_.push(l++)}h.push(_)}for(let p=0;p<i;p++)for(let _=0;_<e;_++){const x=h[p][_+1],M=h[p][_],w=h[p+1][_],S=h[p+1][_+1];(p!==0||a>0)&&d.push(x,M,S),(p!==i-1||c<Math.PI)&&d.push(M,w,S)}this.setIndex(d),this.setAttribute("position",new ie(m,3)),this.setAttribute("normal",new ie(v,3)),this.setAttribute("uv",new ie(g,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Wt(t.radius,t.widthSegments,t.heightSegments,t.phiStart,t.phiLength,t.thetaStart,t.thetaLength)}}class kn extends xe{constructor(t=1,e=.4,i=12,s=48,r=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:t,tube:e,radialSegments:i,tubularSegments:s,arc:r},i=Math.floor(i),s=Math.floor(s);const a=[],o=[],c=[],l=[],h=new C,u=new C,f=new C;for(let d=0;d<=i;d++)for(let m=0;m<=s;m++){const v=m/s*r,g=d/i*Math.PI*2;u.x=(t+e*Math.cos(g))*Math.cos(v),u.y=(t+e*Math.cos(g))*Math.sin(v),u.z=e*Math.sin(g),o.push(u.x,u.y,u.z),h.x=t*Math.cos(v),h.y=t*Math.sin(v),f.subVectors(u,h).normalize(),c.push(f.x,f.y,f.z),l.push(m/s),l.push(d/i)}for(let d=1;d<=i;d++)for(let m=1;m<=s;m++){const v=(s+1)*d+m-1,g=(s+1)*(d-1)+m-1,p=(s+1)*(d-1)+m,_=(s+1)*d+m;a.push(v,g,_),a.push(g,p,_)}this.setIndex(a),this.setAttribute("position",new ie(o,3)),this.setAttribute("normal",new ie(c,3)),this.setAttribute("uv",new ie(l,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new kn(t.radius,t.tube,t.radialSegments,t.tubularSegments,t.arc)}}class Cs extends xe{constructor(t=new Ag(new C(-1,-1,0),new C(-1,1,0),new C(1,1,0)),e=64,i=1,s=8,r=!1){super(),this.type="TubeGeometry",this.parameters={path:t,tubularSegments:e,radius:i,radialSegments:s,closed:r};const a=t.computeFrenetFrames(e,r);this.tangents=a.tangents,this.normals=a.normals,this.binormals=a.binormals;const o=new C,c=new C,l=new ft;let h=new C;const u=[],f=[],d=[],m=[];v(),this.setIndex(m),this.setAttribute("position",new ie(u,3)),this.setAttribute("normal",new ie(f,3)),this.setAttribute("uv",new ie(d,2));function v(){for(let x=0;x<e;x++)g(x);g(r===!1?e:0),_(),p()}function g(x){h=t.getPointAt(x/e,h);const M=a.normals[x],w=a.binormals[x];for(let S=0;S<=s;S++){const T=S/s*Math.PI*2,A=Math.sin(T),b=-Math.cos(T);c.x=b*M.x+A*w.x,c.y=b*M.y+A*w.y,c.z=b*M.z+A*w.z,c.normalize(),f.push(c.x,c.y,c.z),o.x=h.x+i*c.x,o.y=h.y+i*c.y,o.z=h.z+i*c.z,u.push(o.x,o.y,o.z)}}function p(){for(let x=1;x<=e;x++)for(let M=1;M<=s;M++){const w=(s+1)*(x-1)+(M-1),S=(s+1)*x+(M-1),T=(s+1)*x+M,A=(s+1)*(x-1)+M;m.push(w,S,A),m.push(S,T,A)}}function _(){for(let x=0;x<=e;x++)for(let M=0;M<=s;M++)l.x=x/e,l.y=M/s,d.push(l.x,l.y)}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}toJSON(){const t=super.toJSON();return t.path=this.parameters.path.toJSON(),t}static fromJSON(t){return new Cs(new jl[t.path.type]().fromJSON(t.path),t.tubularSegments,t.radius,t.radialSegments,t.closed)}}class $e extends qr{constructor(t){super(),this.isMeshStandardMaterial=!0,this.type="MeshStandardMaterial",this.defines={STANDARD:""},this.color=new gt(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new gt(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=lg,this.normalScale=new ft(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Tn,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.defines={STANDARD:""},this.color.copy(t.color),this.roughness=t.roughness,this.metalness=t.metalness,this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.emissive.copy(t.emissive),this.emissiveMap=t.emissiveMap,this.emissiveIntensity=t.emissiveIntensity,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.roughnessMap=t.roughnessMap,this.metalnessMap=t.metalnessMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.envMapIntensity=t.envMapIntensity,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.flatShading=t.flatShading,this.fog=t.fog,this}}class RM extends qr{constructor(t){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=Hx,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(t)}copy(t){return super.copy(t),this.depthPacking=t.depthPacking,this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this}}class CM extends qr{constructor(t){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(t)}copy(t){return super.copy(t),this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this}}class $f extends ze{constructor(t,e=1){super(),this.isLight=!0,this.type="Light",this.color=new gt(t),this.intensity=e}dispose(){}copy(t,e){return super.copy(t,e),this.color.copy(t.color),this.intensity=t.intensity,this}toJSON(t){const e=super.toJSON(t);return e.object.color=this.color.getHex(),e.object.intensity=this.intensity,this.groundColor!==void 0&&(e.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(e.object.distance=this.distance),this.angle!==void 0&&(e.object.angle=this.angle),this.decay!==void 0&&(e.object.decay=this.decay),this.penumbra!==void 0&&(e.object.penumbra=this.penumbra),this.shadow!==void 0&&(e.object.shadow=this.shadow.toJSON()),this.target!==void 0&&(e.object.target=this.target.uuid),e}}class LM extends $f{constructor(t,e,i){super(t,i),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(ze.DEFAULT_UP),this.updateMatrix(),this.groundColor=new gt(e)}copy(t,e){return super.copy(t,e),this.groundColor.copy(t.groundColor),this}}const o0=new re,R1=new C,C1=new C;class Dg{constructor(t){this.camera=t,this.intensity=1,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new ft(512,512),this.mapType=Oi,this.map=null,this.mapPass=null,this.matrix=new re,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new Vf,this._frameExtents=new ft(1,1),this._viewportCount=1,this._viewports=[new de(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(t){const e=this.camera,i=this.matrix;R1.setFromMatrixPosition(t.matrixWorld),e.position.copy(R1),C1.setFromMatrixPosition(t.target.matrixWorld),e.lookAt(C1),e.updateMatrixWorld(),o0.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),this._frustum.setFromProjectionMatrix(o0,e.coordinateSystem,e.reversedDepth),e.reversedDepth?i.set(.5,0,0,.5,0,.5,0,.5,0,0,1,0,0,0,0,1):i.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),i.multiply(o0)}getViewport(t){return this._viewports[t]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(t){return this.camera=t.camera.clone(),this.intensity=t.intensity,this.bias=t.bias,this.radius=t.radius,this.autoUpdate=t.autoUpdate,this.needsUpdate=t.needsUpdate,this.normalBias=t.normalBias,this.blurSamples=t.blurSamples,this.mapSize.copy(t.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){const t={};return this.intensity!==1&&(t.intensity=this.intensity),this.bias!==0&&(t.bias=this.bias),this.normalBias!==0&&(t.normalBias=this.normalBias),this.radius!==1&&(t.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(t.mapSize=this.mapSize.toArray()),t.camera=this.camera.toJSON(!1).object,delete t.camera.matrix,t}}class PM extends Dg{constructor(){super(new qn(50,1,.5,500)),this.isSpotLightShadow=!0,this.focus=1,this.aspect=1}updateMatrices(t){const e=this.camera,i=ro*2*t.angle*this.focus,s=this.mapSize.width/this.mapSize.height*this.aspect,r=t.distance||e.far;(i!==e.fov||s!==e.aspect||r!==e.far)&&(e.fov=i,e.aspect=s,e.far=r,e.updateProjectionMatrix()),super.updateMatrices(t)}copy(t){return super.copy(t),this.focus=t.focus,this}}class IM extends $f{constructor(t,e,i=0,s=Math.PI/3,r=0,a=2){super(t,e),this.isSpotLight=!0,this.type="SpotLight",this.position.copy(ze.DEFAULT_UP),this.updateMatrix(),this.target=new ze,this.distance=i,this.angle=s,this.penumbra=r,this.decay=a,this.map=null,this.shadow=new PM}get power(){return this.intensity*Math.PI}set power(t){this.intensity=t/Math.PI}dispose(){this.shadow.dispose()}copy(t,e){return super.copy(t,e),this.distance=t.distance,this.angle=t.angle,this.penumbra=t.penumbra,this.decay=t.decay,this.target=t.target.clone(),this.shadow=t.shadow.clone(),this}}class Yf extends gg{constructor(t=-1,e=1,i=1,s=-1,r=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=t,this.right=e,this.top=i,this.bottom=s,this.near=r,this.far=a,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.left=t.left,this.right=t.right,this.top=t.top,this.bottom=t.bottom,this.near=t.near,this.far=t.far,this.zoom=t.zoom,this.view=t.view===null?null:Object.assign({},t.view),this}setViewOffset(t,e,i,s,r,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=i,this.view.offsetY=s,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=(this.right-this.left)/(2*this.zoom),e=(this.top-this.bottom)/(2*this.zoom),i=(this.right+this.left)/2,s=(this.top+this.bottom)/2;let r=i-t,a=i+t,o=s+e,c=s-e;if(this.view!==null&&this.view.enabled){const l=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=l*this.view.offsetX,a=r+l*this.view.width,o-=h*this.view.offsetY,c=o-h*this.view.height}this.projectionMatrix.makeOrthographic(r,a,o,c,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.zoom=this.zoom,e.object.left=this.left,e.object.right=this.right,e.object.top=this.top,e.object.bottom=this.bottom,e.object.near=this.near,e.object.far=this.far,this.view!==null&&(e.object.view=Object.assign({},this.view)),e}}class DM extends Dg{constructor(){super(new Yf(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class Gu extends $f{constructor(t,e){super(t,e),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(ze.DEFAULT_UP),this.updateMatrix(),this.target=new ze,this.shadow=new DM}dispose(){this.shadow.dispose()}copy(t){return super.copy(t),this.target=t.target.clone(),this.shadow=t.shadow.clone(),this}}class UM extends qn{constructor(t=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=t}}const L1=new C,al=new C,da=new C,pa=new C,c0=new C,NM=new C,FM=new C;class kM{constructor(t=new C,e=new C){this.start=t,this.end=e}set(t,e){return this.start.copy(t),this.end.copy(e),this}copy(t){return this.start.copy(t.start),this.end.copy(t.end),this}getCenter(t){return t.addVectors(this.start,this.end).multiplyScalar(.5)}delta(t){return t.subVectors(this.end,this.start)}distanceSq(){return this.start.distanceToSquared(this.end)}distance(){return this.start.distanceTo(this.end)}at(t,e){return this.delta(e).multiplyScalar(t).add(this.start)}closestPointToPointParameter(t,e){L1.subVectors(t,this.start),al.subVectors(this.end,this.start);const i=al.dot(al);let r=al.dot(L1)/i;return e&&(r=ne(r,0,1)),r}closestPointToPoint(t,e,i){const s=this.closestPointToPointParameter(t,e);return this.delta(i).multiplyScalar(s).add(this.start)}distanceSqToLine3(t,e=NM,i=FM){const s=10000000000000001e-32;let r,a;const o=this.start,c=t.start,l=this.end,h=t.end;da.subVectors(l,o),pa.subVectors(h,c),c0.subVectors(o,c);const u=da.dot(da),f=pa.dot(pa),d=pa.dot(c0);if(u<=s&&f<=s)return e.copy(o),i.copy(c),e.sub(i),e.dot(e);if(u<=s)r=0,a=d/f,a=ne(a,0,1);else{const m=da.dot(c0);if(f<=s)a=0,r=ne(-m/u,0,1);else{const v=da.dot(pa),g=u*f-v*v;g!==0?r=ne((v*d-m*f)/g,0,1):r=0,a=(v*r+d)/f,a<0?(a=0,r=ne(-m/u,0,1)):a>1&&(a=1,r=ne((v-m)/u,0,1))}}return e.copy(o).add(da.multiplyScalar(r)),i.copy(c).add(pa.multiplyScalar(a)),e.sub(i),e.dot(e)}applyMatrix4(t){return this.start.applyMatrix4(t),this.end.applyMatrix4(t),this}equals(t){return t.start.equals(this.start)&&t.end.equals(this.end)}clone(){return new this.constructor().copy(this)}}function P1(n,t,e,i){const s=OM(i);switch(e){case rg:return n*t;case og:return n*t/s.components*s.byteLength;case If:return n*t/s.components*s.byteLength;case cg:return n*t*2/s.components*s.byteLength;case Df:return n*t*2/s.components*s.byteLength;case ag:return n*t*3/s.components*s.byteLength;case cn:return n*t*4/s.components*s.byteLength;case Uf:return n*t*4/s.components*s.byteLength;case El:case Tl:return Math.floor((n+3)/4)*Math.floor((t+3)/4)*8;case Al:case Rl:return Math.floor((n+3)/4)*Math.floor((t+3)/4)*16;case fu:case pu:return Math.max(n,16)*Math.max(t,8)/4;case uu:case du:return Math.max(n,8)*Math.max(t,8)/2;case mu:case gu:return Math.floor((n+3)/4)*Math.floor((t+3)/4)*8;case vu:return Math.floor((n+3)/4)*Math.floor((t+3)/4)*16;case xu:return Math.floor((n+3)/4)*Math.floor((t+3)/4)*16;case _u:return Math.floor((n+4)/5)*Math.floor((t+3)/4)*16;case Mu:return Math.floor((n+4)/5)*Math.floor((t+4)/5)*16;case bu:return Math.floor((n+5)/6)*Math.floor((t+4)/5)*16;case wu:return Math.floor((n+5)/6)*Math.floor((t+5)/6)*16;case yu:return Math.floor((n+7)/8)*Math.floor((t+4)/5)*16;case Su:return Math.floor((n+7)/8)*Math.floor((t+5)/6)*16;case Eu:return Math.floor((n+7)/8)*Math.floor((t+7)/8)*16;case Tu:return Math.floor((n+9)/10)*Math.floor((t+4)/5)*16;case Au:return Math.floor((n+9)/10)*Math.floor((t+5)/6)*16;case Ru:return Math.floor((n+9)/10)*Math.floor((t+7)/8)*16;case Cu:return Math.floor((n+9)/10)*Math.floor((t+9)/10)*16;case Lu:return Math.floor((n+11)/12)*Math.floor((t+9)/10)*16;case Pu:return Math.floor((n+11)/12)*Math.floor((t+11)/12)*16;case Iu:case Du:case Uu:return Math.ceil(n/4)*Math.ceil(t/4)*16;case Nu:case Fu:return Math.ceil(n/4)*Math.ceil(t/4)*8;case ku:case Ou:return Math.ceil(n/4)*Math.ceil(t/4)*16}throw new Error(`Unable to determine texture byte length for ${e} format.`)}function OM(n){switch(n){case Oi:case eg:return{byteLength:1,components:1};case ec:case ng:case Xr:return{byteLength:2,components:1};case Lf:case Pf:return{byteLength:2,components:4};case Br:case Cf:case es:return{byteLength:4,components:1};case ig:case sg:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${n}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:Rf}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=Rf);/**
 * @license
 * Copyright 2010-2025 Three.js Authors
 * SPDX-License-Identifier: MIT
 */function Ug(){let n=null,t=!1,e=null,i=null;function s(r,a){e(r,a),i=n.requestAnimationFrame(s)}return{start:function(){t!==!0&&e!==null&&(i=n.requestAnimationFrame(s),t=!0)},stop:function(){n.cancelAnimationFrame(i),t=!1},setAnimationLoop:function(r){e=r},setContext:function(r){n=r}}}function BM(n){const t=new WeakMap;function e(o,c){const l=o.array,h=o.usage,u=l.byteLength,f=n.createBuffer();n.bindBuffer(c,f),n.bufferData(c,l,h),o.onUploadCallback();let d;if(l instanceof Float32Array)d=n.FLOAT;else if(typeof Float16Array<"u"&&l instanceof Float16Array)d=n.HALF_FLOAT;else if(l instanceof Uint16Array)o.isFloat16BufferAttribute?d=n.HALF_FLOAT:d=n.UNSIGNED_SHORT;else if(l instanceof Int16Array)d=n.SHORT;else if(l instanceof Uint32Array)d=n.UNSIGNED_INT;else if(l instanceof Int32Array)d=n.INT;else if(l instanceof Int8Array)d=n.BYTE;else if(l instanceof Uint8Array)d=n.UNSIGNED_BYTE;else if(l instanceof Uint8ClampedArray)d=n.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+l);return{buffer:f,type:d,bytesPerElement:l.BYTES_PER_ELEMENT,version:o.version,size:u}}function i(o,c,l){const h=c.array,u=c.updateRanges;if(n.bindBuffer(l,o),u.length===0)n.bufferSubData(l,0,h);else{u.sort((d,m)=>d.start-m.start);let f=0;for(let d=1;d<u.length;d++){const m=u[f],v=u[d];v.start<=m.start+m.count+1?m.count=Math.max(m.count,v.start+v.count-m.start):(++f,u[f]=v)}u.length=f+1;for(let d=0,m=u.length;d<m;d++){const v=u[d];n.bufferSubData(l,v.start*h.BYTES_PER_ELEMENT,h,v.start,v.count)}c.clearUpdateRanges()}c.onUploadCallback()}function s(o){return o.isInterleavedBufferAttribute&&(o=o.data),t.get(o)}function r(o){o.isInterleavedBufferAttribute&&(o=o.data);const c=t.get(o);c&&(n.deleteBuffer(c.buffer),t.delete(o))}function a(o,c){if(o.isInterleavedBufferAttribute&&(o=o.data),o.isGLBufferAttribute){const h=t.get(o);(!h||h.version<o.version)&&t.set(o,{buffer:o.buffer,type:o.type,bytesPerElement:o.elementSize,version:o.version});return}const l=t.get(o);if(l===void 0)t.set(o,e(o,c));else if(l.version<o.version){if(l.size!==o.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");i(l.buffer,o,c),l.version=o.version}}return{get:s,remove:r,update:a}}var HM=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,zM=`#ifdef USE_ALPHAHASH
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
#endif`,VM=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,GM=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,WM=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,XM=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,qM=`#ifdef USE_AOMAP
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
#endif`,$M=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,YM=`#ifdef USE_BATCHING
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
#endif`,jM=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,ZM=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,JM=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,KM=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,QM=`#ifdef USE_IRIDESCENCE
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
#endif`,t3=`#ifdef USE_BUMPMAP
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
#endif`,e3=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,n3=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,i3=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,s3=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,r3=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,a3=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,o3=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,c3=`#if defined( USE_COLOR_ALPHA )
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
#endif`,l3=`#define PI 3.141592653589793
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
} // validated`,h3=`#ifdef ENVMAP_TYPE_CUBE_UV
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
#endif`,u3=`vec3 transformedNormal = objectNormal;
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
#endif`,f3=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,d3=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,p3=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,m3=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,g3="gl_FragColor = linearToOutputTexel( gl_FragColor );",v3=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,x3=`#ifdef USE_ENVMAP
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
#endif`,_3=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,M3=`#ifdef USE_ENVMAP
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
#endif`,b3=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,w3=`#ifdef USE_ENVMAP
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
#endif`,y3=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,S3=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,E3=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,T3=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,A3=`#ifdef USE_GRADIENTMAP
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
}`,R3=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,C3=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,L3=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,P3=`uniform bool receiveShadow;
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
#endif`,I3=`#ifdef USE_ENVMAP
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
#endif`,D3=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,U3=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,N3=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,F3=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,k3=`PhysicalMaterial material;
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
#endif`,O3=`struct PhysicalMaterial {
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
}`,B3=`
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
#endif`,H3=`#if defined( RE_IndirectDiffuse )
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
#endif`,z3=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,V3=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,G3=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,W3=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,X3=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,q3=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,$3=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,Y3=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,j3=`#if defined( USE_POINTS_UV )
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
#endif`,Z3=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,J3=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,K3=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,Q3=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,t5=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,e5=`#ifdef USE_MORPHTARGETS
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
#endif`,n5=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,i5=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 nonPerturbedNormal = normal;`,s5=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
#endif`,r5=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,a5=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,o5=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,c5=`#ifdef USE_NORMALMAP
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
#endif`,l5=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,h5=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,u5=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,f5=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,d5=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,p5=`vec3 packNormalToRGB( const in vec3 normal ) {
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
}`,m5=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,g5=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,v5=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,x5=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,_5=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,M5=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,b5=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,w5=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,y5=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
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
#endif`,S5=`float getShadowMask() {
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
}`,E5=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,T5=`#ifdef USE_SKINNING
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
#endif`,A5=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,R5=`#ifdef USE_SKINNING
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
#endif`,C5=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,L5=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,P5=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,I5=`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,D5=`#ifdef USE_TRANSMISSION
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
#endif`,U5=`#ifdef USE_TRANSMISSION
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
#endif`,N5=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,F5=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,k5=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,O5=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const B5=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,H5=`uniform sampler2D t2D;
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
}`,z5=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,V5=`#ifdef ENVMAP_TYPE_CUBE
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
}`,G5=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,W5=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,X5=`#include <common>
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
}`,q5=`#if DEPTH_PACKING == 3200
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
}`,$5=`#define DISTANCE
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
}`,Y5=`#define DISTANCE
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
}`,j5=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,Z5=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,J5=`uniform float scale;
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
}`,K5=`uniform vec3 diffuse;
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
}`,Q5=`#include <common>
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
}`,tb=`uniform vec3 diffuse;
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
}`,eb=`#define LAMBERT
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
}`,nb=`#define LAMBERT
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
}`,ib=`#define MATCAP
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
}`,sb=`#define MATCAP
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
}`,rb=`#define NORMAL
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
}`,ab=`#define NORMAL
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
}`,ob=`#define PHONG
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
}`,cb=`#define PHONG
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
}`,lb=`#define STANDARD
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
}`,hb=`#define STANDARD
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
}`,ub=`#define TOON
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
}`,fb=`#define TOON
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
}`,db=`uniform float size;
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
}`,pb=`uniform vec3 diffuse;
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
}`,mb=`#include <common>
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
}`,gb=`uniform vec3 color;
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
}`,vb=`uniform float rotation;
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
}`,xb=`uniform vec3 diffuse;
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
}`,ce={alphahash_fragment:HM,alphahash_pars_fragment:zM,alphamap_fragment:VM,alphamap_pars_fragment:GM,alphatest_fragment:WM,alphatest_pars_fragment:XM,aomap_fragment:qM,aomap_pars_fragment:$M,batching_pars_vertex:YM,batching_vertex:jM,begin_vertex:ZM,beginnormal_vertex:JM,bsdfs:KM,iridescence_fragment:QM,bumpmap_pars_fragment:t3,clipping_planes_fragment:e3,clipping_planes_pars_fragment:n3,clipping_planes_pars_vertex:i3,clipping_planes_vertex:s3,color_fragment:r3,color_pars_fragment:a3,color_pars_vertex:o3,color_vertex:c3,common:l3,cube_uv_reflection_fragment:h3,defaultnormal_vertex:u3,displacementmap_pars_vertex:f3,displacementmap_vertex:d3,emissivemap_fragment:p3,emissivemap_pars_fragment:m3,colorspace_fragment:g3,colorspace_pars_fragment:v3,envmap_fragment:x3,envmap_common_pars_fragment:_3,envmap_pars_fragment:M3,envmap_pars_vertex:b3,envmap_physical_pars_fragment:I3,envmap_vertex:w3,fog_vertex:y3,fog_pars_vertex:S3,fog_fragment:E3,fog_pars_fragment:T3,gradientmap_pars_fragment:A3,lightmap_pars_fragment:R3,lights_lambert_fragment:C3,lights_lambert_pars_fragment:L3,lights_pars_begin:P3,lights_toon_fragment:D3,lights_toon_pars_fragment:U3,lights_phong_fragment:N3,lights_phong_pars_fragment:F3,lights_physical_fragment:k3,lights_physical_pars_fragment:O3,lights_fragment_begin:B3,lights_fragment_maps:H3,lights_fragment_end:z3,logdepthbuf_fragment:V3,logdepthbuf_pars_fragment:G3,logdepthbuf_pars_vertex:W3,logdepthbuf_vertex:X3,map_fragment:q3,map_pars_fragment:$3,map_particle_fragment:Y3,map_particle_pars_fragment:j3,metalnessmap_fragment:Z3,metalnessmap_pars_fragment:J3,morphinstance_vertex:K3,morphcolor_vertex:Q3,morphnormal_vertex:t5,morphtarget_pars_vertex:e5,morphtarget_vertex:n5,normal_fragment_begin:i5,normal_fragment_maps:s5,normal_pars_fragment:r5,normal_pars_vertex:a5,normal_vertex:o5,normalmap_pars_fragment:c5,clearcoat_normal_fragment_begin:l5,clearcoat_normal_fragment_maps:h5,clearcoat_pars_fragment:u5,iridescence_pars_fragment:f5,opaque_fragment:d5,packing:p5,premultiplied_alpha_fragment:m5,project_vertex:g5,dithering_fragment:v5,dithering_pars_fragment:x5,roughnessmap_fragment:_5,roughnessmap_pars_fragment:M5,shadowmap_pars_fragment:b5,shadowmap_pars_vertex:w5,shadowmap_vertex:y5,shadowmask_pars_fragment:S5,skinbase_vertex:E5,skinning_pars_vertex:T5,skinning_vertex:A5,skinnormal_vertex:R5,specularmap_fragment:C5,specularmap_pars_fragment:L5,tonemapping_fragment:P5,tonemapping_pars_fragment:I5,transmission_fragment:D5,transmission_pars_fragment:U5,uv_pars_fragment:N5,uv_pars_vertex:F5,uv_vertex:k5,worldpos_vertex:O5,background_vert:B5,background_frag:H5,backgroundCube_vert:z5,backgroundCube_frag:V5,cube_vert:G5,cube_frag:W5,depth_vert:X5,depth_frag:q5,distanceRGBA_vert:$5,distanceRGBA_frag:Y5,equirect_vert:j5,equirect_frag:Z5,linedashed_vert:J5,linedashed_frag:K5,meshbasic_vert:Q5,meshbasic_frag:tb,meshlambert_vert:eb,meshlambert_frag:nb,meshmatcap_vert:ib,meshmatcap_frag:sb,meshnormal_vert:rb,meshnormal_frag:ab,meshphong_vert:ob,meshphong_frag:cb,meshphysical_vert:lb,meshphysical_frag:hb,meshtoon_vert:ub,meshtoon_frag:fb,points_vert:db,points_frag:pb,shadow_vert:mb,shadow_frag:gb,sprite_vert:vb,sprite_frag:xb},Lt={common:{diffuse:{value:new gt(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new oe},alphaMap:{value:null},alphaMapTransform:{value:new oe},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new oe}},envmap:{envMap:{value:null},envMapRotation:{value:new oe},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new oe}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new oe}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new oe},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new oe},normalScale:{value:new ft(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new oe},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new oe}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new oe}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new oe}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new gt(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new gt(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new oe},alphaTest:{value:0},uvTransform:{value:new oe}},sprite:{diffuse:{value:new gt(16777215)},opacity:{value:1},center:{value:new ft(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new oe},alphaMap:{value:null},alphaMapTransform:{value:new oe},alphaTest:{value:0}}},Yi={basic:{uniforms:Mn([Lt.common,Lt.specularmap,Lt.envmap,Lt.aomap,Lt.lightmap,Lt.fog]),vertexShader:ce.meshbasic_vert,fragmentShader:ce.meshbasic_frag},lambert:{uniforms:Mn([Lt.common,Lt.specularmap,Lt.envmap,Lt.aomap,Lt.lightmap,Lt.emissivemap,Lt.bumpmap,Lt.normalmap,Lt.displacementmap,Lt.fog,Lt.lights,{emissive:{value:new gt(0)}}]),vertexShader:ce.meshlambert_vert,fragmentShader:ce.meshlambert_frag},phong:{uniforms:Mn([Lt.common,Lt.specularmap,Lt.envmap,Lt.aomap,Lt.lightmap,Lt.emissivemap,Lt.bumpmap,Lt.normalmap,Lt.displacementmap,Lt.fog,Lt.lights,{emissive:{value:new gt(0)},specular:{value:new gt(1118481)},shininess:{value:30}}]),vertexShader:ce.meshphong_vert,fragmentShader:ce.meshphong_frag},standard:{uniforms:Mn([Lt.common,Lt.envmap,Lt.aomap,Lt.lightmap,Lt.emissivemap,Lt.bumpmap,Lt.normalmap,Lt.displacementmap,Lt.roughnessmap,Lt.metalnessmap,Lt.fog,Lt.lights,{emissive:{value:new gt(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:ce.meshphysical_vert,fragmentShader:ce.meshphysical_frag},toon:{uniforms:Mn([Lt.common,Lt.aomap,Lt.lightmap,Lt.emissivemap,Lt.bumpmap,Lt.normalmap,Lt.displacementmap,Lt.gradientmap,Lt.fog,Lt.lights,{emissive:{value:new gt(0)}}]),vertexShader:ce.meshtoon_vert,fragmentShader:ce.meshtoon_frag},matcap:{uniforms:Mn([Lt.common,Lt.bumpmap,Lt.normalmap,Lt.displacementmap,Lt.fog,{matcap:{value:null}}]),vertexShader:ce.meshmatcap_vert,fragmentShader:ce.meshmatcap_frag},points:{uniforms:Mn([Lt.points,Lt.fog]),vertexShader:ce.points_vert,fragmentShader:ce.points_frag},dashed:{uniforms:Mn([Lt.common,Lt.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:ce.linedashed_vert,fragmentShader:ce.linedashed_frag},depth:{uniforms:Mn([Lt.common,Lt.displacementmap]),vertexShader:ce.depth_vert,fragmentShader:ce.depth_frag},normal:{uniforms:Mn([Lt.common,Lt.bumpmap,Lt.normalmap,Lt.displacementmap,{opacity:{value:1}}]),vertexShader:ce.meshnormal_vert,fragmentShader:ce.meshnormal_frag},sprite:{uniforms:Mn([Lt.sprite,Lt.fog]),vertexShader:ce.sprite_vert,fragmentShader:ce.sprite_frag},background:{uniforms:{uvTransform:{value:new oe},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:ce.background_vert,fragmentShader:ce.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new oe}},vertexShader:ce.backgroundCube_vert,fragmentShader:ce.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:ce.cube_vert,fragmentShader:ce.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:ce.equirect_vert,fragmentShader:ce.equirect_frag},distanceRGBA:{uniforms:Mn([Lt.common,Lt.displacementmap,{referencePosition:{value:new C},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:ce.distanceRGBA_vert,fragmentShader:ce.distanceRGBA_frag},shadow:{uniforms:Mn([Lt.lights,Lt.fog,{color:{value:new gt(0)},opacity:{value:1}}]),vertexShader:ce.shadow_vert,fragmentShader:ce.shadow_frag}};Yi.physical={uniforms:Mn([Yi.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new oe},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new oe},clearcoatNormalScale:{value:new ft(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new oe},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new oe},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new oe},sheen:{value:0},sheenColor:{value:new gt(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new oe},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new oe},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new oe},transmissionSamplerSize:{value:new ft},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new oe},attenuationDistance:{value:0},attenuationColor:{value:new gt(0)},specularColor:{value:new gt(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new oe},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new oe},anisotropyVector:{value:new ft},anisotropyMap:{value:null},anisotropyMapTransform:{value:new oe}}]),vertexShader:ce.meshphysical_vert,fragmentShader:ce.meshphysical_frag};const ol={r:0,b:0,g:0},dr=new Tn,_b=new re;function Mb(n,t,e,i,s,r,a){const o=new gt(0);let c=r===!0?0:1,l,h,u=null,f=0,d=null;function m(x){let M=x.isScene===!0?x.background:null;return M&&M.isTexture&&(M=(x.backgroundBlurriness>0?e:t).get(M)),M}function v(x){let M=!1;const w=m(x);w===null?p(o,c):w&&w.isColor&&(p(w,1),M=!0);const S=n.xr.getEnvironmentBlendMode();S==="additive"?i.buffers.color.setClear(0,0,0,1,a):S==="alpha-blend"&&i.buffers.color.setClear(0,0,0,0,a),(n.autoClear||M)&&(i.buffers.depth.setTest(!0),i.buffers.depth.setMask(!0),i.buffers.color.setMask(!0),n.clear(n.autoClearColor,n.autoClearDepth,n.autoClearStencil))}function g(x,M){const w=m(M);w&&(w.isCubeTexture||w.mapping===xh)?(h===void 0&&(h=new nt(new Ce(1,1,1),new en({name:"BackgroundCubeMaterial",uniforms:ao(Yi.backgroundCube.uniforms),vertexShader:Yi.backgroundCube.vertexShader,fragmentShader:Yi.backgroundCube.fragmentShader,side:Fn,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),h.geometry.deleteAttribute("normal"),h.geometry.deleteAttribute("uv"),h.onBeforeRender=function(S,T,A){this.matrixWorld.copyPosition(A.matrixWorld)},Object.defineProperty(h.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),s.update(h)),dr.copy(M.backgroundRotation),dr.x*=-1,dr.y*=-1,dr.z*=-1,w.isCubeTexture&&w.isRenderTargetTexture===!1&&(dr.y*=-1,dr.z*=-1),h.material.uniforms.envMap.value=w,h.material.uniforms.flipEnvMap.value=w.isCubeTexture&&w.isRenderTargetTexture===!1?-1:1,h.material.uniforms.backgroundBlurriness.value=M.backgroundBlurriness,h.material.uniforms.backgroundIntensity.value=M.backgroundIntensity,h.material.uniforms.backgroundRotation.value.setFromMatrix4(_b.makeRotationFromEuler(dr)),h.material.toneMapped=ge.getTransfer(w.colorSpace)!==we,(u!==w||f!==w.version||d!==n.toneMapping)&&(h.material.needsUpdate=!0,u=w,f=w.version,d=n.toneMapping),h.layers.enableAll(),x.unshift(h,h.geometry,h.material,0,0,null)):w&&w.isTexture&&(l===void 0&&(l=new nt(new xi(2,2),new en({name:"BackgroundMaterial",uniforms:ao(Yi.background.uniforms),vertexShader:Yi.background.vertexShader,fragmentShader:Yi.background.fragmentShader,side:ir,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),l.geometry.deleteAttribute("normal"),Object.defineProperty(l.material,"map",{get:function(){return this.uniforms.t2D.value}}),s.update(l)),l.material.uniforms.t2D.value=w,l.material.uniforms.backgroundIntensity.value=M.backgroundIntensity,l.material.toneMapped=ge.getTransfer(w.colorSpace)!==we,w.matrixAutoUpdate===!0&&w.updateMatrix(),l.material.uniforms.uvTransform.value.copy(w.matrix),(u!==w||f!==w.version||d!==n.toneMapping)&&(l.material.needsUpdate=!0,u=w,f=w.version,d=n.toneMapping),l.layers.enableAll(),x.unshift(l,l.geometry,l.material,0,0,null))}function p(x,M){x.getRGB(ol,mg(n)),i.buffers.color.setClear(ol.r,ol.g,ol.b,M,a)}function _(){h!==void 0&&(h.geometry.dispose(),h.material.dispose(),h=void 0),l!==void 0&&(l.geometry.dispose(),l.material.dispose(),l=void 0)}return{getClearColor:function(){return o},setClearColor:function(x,M=1){o.set(x),c=M,p(o,c)},getClearAlpha:function(){return c},setClearAlpha:function(x){c=x,p(o,c)},render:v,addToRenderList:g,dispose:_}}function bb(n,t){const e=n.getParameter(n.MAX_VERTEX_ATTRIBS),i={},s=f(null);let r=s,a=!1;function o(y,E,R,P,I){let F=!1;const H=u(P,R,E);r!==H&&(r=H,l(r.object)),F=d(y,P,R,I),F&&m(y,P,R,I),I!==null&&t.update(I,n.ELEMENT_ARRAY_BUFFER),(F||a)&&(a=!1,M(y,E,R,P),I!==null&&n.bindBuffer(n.ELEMENT_ARRAY_BUFFER,t.get(I).buffer))}function c(){return n.createVertexArray()}function l(y){return n.bindVertexArray(y)}function h(y){return n.deleteVertexArray(y)}function u(y,E,R){const P=R.wireframe===!0;let I=i[y.id];I===void 0&&(I={},i[y.id]=I);let F=I[E.id];F===void 0&&(F={},I[E.id]=F);let H=F[P];return H===void 0&&(H=f(c()),F[P]=H),H}function f(y){const E=[],R=[],P=[];for(let I=0;I<e;I++)E[I]=0,R[I]=0,P[I]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:E,enabledAttributes:R,attributeDivisors:P,object:y,attributes:{},index:null}}function d(y,E,R,P){const I=r.attributes,F=E.attributes;let H=0;const $=R.getAttributes();for(const B in $)if($[B].location>=0){const it=I[B];let mt=F[B];if(mt===void 0&&(B==="instanceMatrix"&&y.instanceMatrix&&(mt=y.instanceMatrix),B==="instanceColor"&&y.instanceColor&&(mt=y.instanceColor)),it===void 0||it.attribute!==mt||mt&&it.data!==mt.data)return!0;H++}return r.attributesNum!==H||r.index!==P}function m(y,E,R,P){const I={},F=E.attributes;let H=0;const $=R.getAttributes();for(const B in $)if($[B].location>=0){let it=F[B];it===void 0&&(B==="instanceMatrix"&&y.instanceMatrix&&(it=y.instanceMatrix),B==="instanceColor"&&y.instanceColor&&(it=y.instanceColor));const mt={};mt.attribute=it,it&&it.data&&(mt.data=it.data),I[B]=mt,H++}r.attributes=I,r.attributesNum=H,r.index=P}function v(){const y=r.newAttributes;for(let E=0,R=y.length;E<R;E++)y[E]=0}function g(y){p(y,0)}function p(y,E){const R=r.newAttributes,P=r.enabledAttributes,I=r.attributeDivisors;R[y]=1,P[y]===0&&(n.enableVertexAttribArray(y),P[y]=1),I[y]!==E&&(n.vertexAttribDivisor(y,E),I[y]=E)}function _(){const y=r.newAttributes,E=r.enabledAttributes;for(let R=0,P=E.length;R<P;R++)E[R]!==y[R]&&(n.disableVertexAttribArray(R),E[R]=0)}function x(y,E,R,P,I,F,H){H===!0?n.vertexAttribIPointer(y,E,R,I,F):n.vertexAttribPointer(y,E,R,P,I,F)}function M(y,E,R,P){v();const I=P.attributes,F=R.getAttributes(),H=E.defaultAttributeValues;for(const $ in F){const B=F[$];if(B.location>=0){let Y=I[$];if(Y===void 0&&($==="instanceMatrix"&&y.instanceMatrix&&(Y=y.instanceMatrix),$==="instanceColor"&&y.instanceColor&&(Y=y.instanceColor)),Y!==void 0){const it=Y.normalized,mt=Y.itemSize,vt=t.get(Y);if(vt===void 0)continue;const St=vt.buffer,Ct=vt.type,Ut=vt.bytesPerElement,V=Ct===n.INT||Ct===n.UNSIGNED_INT||Y.gpuType===Cf;if(Y.isInterleavedBufferAttribute){const X=Y.data,z=X.stride,W=Y.offset;if(X.isInstancedInterleavedBuffer){for(let G=0;G<B.locationSize;G++)p(B.location+G,X.meshPerAttribute);y.isInstancedMesh!==!0&&P._maxInstanceCount===void 0&&(P._maxInstanceCount=X.meshPerAttribute*X.count)}else for(let G=0;G<B.locationSize;G++)g(B.location+G);n.bindBuffer(n.ARRAY_BUFFER,St);for(let G=0;G<B.locationSize;G++)x(B.location+G,mt/B.locationSize,Ct,it,z*Ut,(W+mt/B.locationSize*G)*Ut,V)}else{if(Y.isInstancedBufferAttribute){for(let X=0;X<B.locationSize;X++)p(B.location+X,Y.meshPerAttribute);y.isInstancedMesh!==!0&&P._maxInstanceCount===void 0&&(P._maxInstanceCount=Y.meshPerAttribute*Y.count)}else for(let X=0;X<B.locationSize;X++)g(B.location+X);n.bindBuffer(n.ARRAY_BUFFER,St);for(let X=0;X<B.locationSize;X++)x(B.location+X,mt/B.locationSize,Ct,it,mt*Ut,mt/B.locationSize*X*Ut,V)}}else if(H!==void 0){const it=H[$];if(it!==void 0)switch(it.length){case 2:n.vertexAttrib2fv(B.location,it);break;case 3:n.vertexAttrib3fv(B.location,it);break;case 4:n.vertexAttrib4fv(B.location,it);break;default:n.vertexAttrib1fv(B.location,it)}}}}_()}function w(){A();for(const y in i){const E=i[y];for(const R in E){const P=E[R];for(const I in P)h(P[I].object),delete P[I];delete E[R]}delete i[y]}}function S(y){if(i[y.id]===void 0)return;const E=i[y.id];for(const R in E){const P=E[R];for(const I in P)h(P[I].object),delete P[I];delete E[R]}delete i[y.id]}function T(y){for(const E in i){const R=i[E];if(R[y.id]===void 0)continue;const P=R[y.id];for(const I in P)h(P[I].object),delete P[I];delete R[y.id]}}function A(){b(),a=!0,r!==s&&(r=s,l(r.object))}function b(){s.geometry=null,s.program=null,s.wireframe=!1}return{setup:o,reset:A,resetDefaultState:b,dispose:w,releaseStatesOfGeometry:S,releaseStatesOfProgram:T,initAttributes:v,enableAttribute:g,disableUnusedAttributes:_}}function wb(n,t,e){let i;function s(l){i=l}function r(l,h){n.drawArrays(i,l,h),e.update(h,i,1)}function a(l,h,u){u!==0&&(n.drawArraysInstanced(i,l,h,u),e.update(h,i,u))}function o(l,h,u){if(u===0)return;t.get("WEBGL_multi_draw").multiDrawArraysWEBGL(i,l,0,h,0,u);let d=0;for(let m=0;m<u;m++)d+=h[m];e.update(d,i,1)}function c(l,h,u,f){if(u===0)return;const d=t.get("WEBGL_multi_draw");if(d===null)for(let m=0;m<l.length;m++)a(l[m],h[m],f[m]);else{d.multiDrawArraysInstancedWEBGL(i,l,0,h,0,f,0,u);let m=0;for(let v=0;v<u;v++)m+=h[v]*f[v];e.update(m,i,1)}}this.setMode=s,this.render=r,this.renderInstances=a,this.renderMultiDraw=o,this.renderMultiDrawInstances=c}function yb(n,t,e,i){let s;function r(){if(s!==void 0)return s;if(t.has("EXT_texture_filter_anisotropic")===!0){const T=t.get("EXT_texture_filter_anisotropic");s=n.getParameter(T.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else s=0;return s}function a(T){return!(T!==cn&&i.convert(T)!==n.getParameter(n.IMPLEMENTATION_COLOR_READ_FORMAT))}function o(T){const A=T===Xr&&(t.has("EXT_color_buffer_half_float")||t.has("EXT_color_buffer_float"));return!(T!==Oi&&i.convert(T)!==n.getParameter(n.IMPLEMENTATION_COLOR_READ_TYPE)&&T!==es&&!A)}function c(T){if(T==="highp"){if(n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.HIGH_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.HIGH_FLOAT).precision>0)return"highp";T="mediump"}return T==="mediump"&&n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.MEDIUM_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let l=e.precision!==void 0?e.precision:"highp";const h=c(l);h!==l&&(console.warn("THREE.WebGLRenderer:",l,"not supported, using",h,"instead."),l=h);const u=e.logarithmicDepthBuffer===!0,f=e.reversedDepthBuffer===!0&&t.has("EXT_clip_control"),d=n.getParameter(n.MAX_TEXTURE_IMAGE_UNITS),m=n.getParameter(n.MAX_VERTEX_TEXTURE_IMAGE_UNITS),v=n.getParameter(n.MAX_TEXTURE_SIZE),g=n.getParameter(n.MAX_CUBE_MAP_TEXTURE_SIZE),p=n.getParameter(n.MAX_VERTEX_ATTRIBS),_=n.getParameter(n.MAX_VERTEX_UNIFORM_VECTORS),x=n.getParameter(n.MAX_VARYING_VECTORS),M=n.getParameter(n.MAX_FRAGMENT_UNIFORM_VECTORS),w=m>0,S=n.getParameter(n.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:r,getMaxPrecision:c,textureFormatReadable:a,textureTypeReadable:o,precision:l,logarithmicDepthBuffer:u,reversedDepthBuffer:f,maxTextures:d,maxVertexTextures:m,maxTextureSize:v,maxCubemapSize:g,maxAttributes:p,maxVertexUniforms:_,maxVaryings:x,maxFragmentUniforms:M,vertexTextures:w,maxSamples:S}}function Sb(n){const t=this;let e=null,i=0,s=!1,r=!1;const a=new Mr,o=new oe,c={value:null,needsUpdate:!1};this.uniform=c,this.numPlanes=0,this.numIntersection=0,this.init=function(u,f){const d=u.length!==0||f||i!==0||s;return s=f,i=u.length,d},this.beginShadows=function(){r=!0,h(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(u,f){e=h(u,f,0)},this.setState=function(u,f,d){const m=u.clippingPlanes,v=u.clipIntersection,g=u.clipShadows,p=n.get(u);if(!s||m===null||m.length===0||r&&!g)r?h(null):l();else{const _=r?0:i,x=_*4;let M=p.clippingState||null;c.value=M,M=h(m,f,x,d);for(let w=0;w!==x;++w)M[w]=e[w];p.clippingState=M,this.numIntersection=v?this.numPlanes:0,this.numPlanes+=_}};function l(){c.value!==e&&(c.value=e,c.needsUpdate=i>0),t.numPlanes=i,t.numIntersection=0}function h(u,f,d,m){const v=u!==null?u.length:0;let g=null;if(v!==0){if(g=c.value,m!==!0||g===null){const p=d+v*4,_=f.matrixWorldInverse;o.getNormalMatrix(_),(g===null||g.length<p)&&(g=new Float32Array(p));for(let x=0,M=d;x!==v;++x,M+=4)a.copy(u[x]).applyMatrix4(_,o),a.normal.toArray(g,M),g[M+3]=a.constant}c.value=g,c.needsUpdate=!0}return t.numPlanes=v,t.numIntersection=0,g}}function Eb(n){let t=new WeakMap;function e(a,o){return o===Gl?a.mapping=no:o===lu&&(a.mapping=io),a}function i(a){if(a&&a.isTexture){const o=a.mapping;if(o===Gl||o===lu)if(t.has(a)){const c=t.get(a).texture;return e(c,a.mapping)}else{const c=a.image;if(c&&c.height>0){const l=new H_(c.height);return l.fromEquirectangularTexture(n,a),t.set(a,l),a.addEventListener("dispose",s),e(l.texture,a.mapping)}else return null}}return a}function s(a){const o=a.target;o.removeEventListener("dispose",s);const c=t.get(o);c!==void 0&&(t.delete(o),c.dispose())}function r(){t=new WeakMap}return{get:i,dispose:r}}const Da=4,I1=[.125,.215,.35,.446,.526,.582],yr=20,l0=new Yf,D1=new gt;let h0=null,u0=0,f0=0,d0=!1;const br=(1+Math.sqrt(5))/2,ma=1/br,U1=[new C(-br,ma,0),new C(br,ma,0),new C(-ma,0,br),new C(ma,0,br),new C(0,br,-ma),new C(0,br,ma),new C(-1,1,-1),new C(1,1,-1),new C(-1,1,1),new C(1,1,1)],Tb=new C;class Wu{constructor(t){this._renderer=t,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(t,e=0,i=.1,s=100,r={}){const{size:a=256,position:o=Tb}=r;h0=this._renderer.getRenderTarget(),u0=this._renderer.getActiveCubeFace(),f0=this._renderer.getActiveMipmapLevel(),d0=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(a);const c=this._allocateTargets();return c.depthBuffer=!0,this._sceneToCubeUV(t,i,s,c,o),e>0&&this._blur(c,0,0,e),this._applyPMREM(c),this._cleanup(c),c}fromEquirectangular(t,e=null){return this._fromTexture(t,e)}fromCubemap(t,e=null){return this._fromTexture(t,e)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=k1(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=F1(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(t){this._lodMax=Math.floor(Math.log2(t)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let t=0;t<this._lodPlanes.length;t++)this._lodPlanes[t].dispose()}_cleanup(t){this._renderer.setRenderTarget(h0,u0,f0),this._renderer.xr.enabled=d0,t.scissorTest=!1,cl(t,0,0,t.width,t.height)}_fromTexture(t,e){t.mapping===no||t.mapping===io?this._setSize(t.image.length===0?16:t.image[0].width||t.image[0].image.width):this._setSize(t.image.width/4),h0=this._renderer.getRenderTarget(),u0=this._renderer.getActiveCubeFace(),f0=this._renderer.getActiveMipmapLevel(),d0=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const i=e||this._allocateTargets();return this._textureToCubeUV(t,i),this._applyPMREM(i),this._cleanup(i),i}_allocateTargets(){const t=3*Math.max(this._cubeSize,112),e=4*this._cubeSize,i={magFilter:Ie,minFilter:Ie,generateMipmaps:!1,type:Xr,format:cn,colorSpace:Hr,depthBuffer:!1},s=N1(t,e,i);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==t||this._pingPongRenderTarget.height!==e){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=N1(t,e,i);const{_lodMax:r}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=Ab(r)),this._blurMaterial=Rb(r,t,e)}return s}_compileMaterial(t){const e=new nt(this._lodPlanes[0],t);this._renderer.compile(e,l0)}_sceneToCubeUV(t,e,i,s,r){const c=new qn(90,1,e,i),l=[1,-1,1,1,1,1],h=[1,1,1,-1,-1,-1],u=this._renderer,f=u.autoClear,d=u.toneMapping;u.getClearColor(D1),u.toneMapping=Qs,u.autoClear=!1,u.state.buffers.depth.getReversed()&&(u.setRenderTarget(s),u.clearDepth(),u.setRenderTarget(null));const v=new os({name:"PMREM.Background",side:Fn,depthWrite:!1,depthTest:!1}),g=new nt(new Ce,v);let p=!1;const _=t.background;_?_.isColor&&(v.color.copy(_),t.background=null,p=!0):(v.color.copy(D1),p=!0);for(let x=0;x<6;x++){const M=x%3;M===0?(c.up.set(0,l[x],0),c.position.set(r.x,r.y,r.z),c.lookAt(r.x+h[x],r.y,r.z)):M===1?(c.up.set(0,0,l[x]),c.position.set(r.x,r.y,r.z),c.lookAt(r.x,r.y+h[x],r.z)):(c.up.set(0,l[x],0),c.position.set(r.x,r.y,r.z),c.lookAt(r.x,r.y,r.z+h[x]));const w=this._cubeSize;cl(s,M*w,x>2?w:0,w,w),u.setRenderTarget(s),p&&u.render(g,c),u.render(t,c)}g.geometry.dispose(),g.material.dispose(),u.toneMapping=d,u.autoClear=f,t.background=_}_textureToCubeUV(t,e){const i=this._renderer,s=t.mapping===no||t.mapping===io;s?(this._cubemapMaterial===null&&(this._cubemapMaterial=k1()),this._cubemapMaterial.uniforms.flipEnvMap.value=t.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=F1());const r=s?this._cubemapMaterial:this._equirectMaterial,a=new nt(this._lodPlanes[0],r),o=r.uniforms;o.envMap.value=t;const c=this._cubeSize;cl(e,0,0,3*c,2*c),i.setRenderTarget(e),i.render(a,l0)}_applyPMREM(t){const e=this._renderer,i=e.autoClear;e.autoClear=!1;const s=this._lodPlanes.length;for(let r=1;r<s;r++){const a=Math.sqrt(this._sigmas[r]*this._sigmas[r]-this._sigmas[r-1]*this._sigmas[r-1]),o=U1[(s-r-1)%U1.length];this._blur(t,r-1,r,a,o)}e.autoClear=i}_blur(t,e,i,s,r){const a=this._pingPongRenderTarget;this._halfBlur(t,a,e,i,s,"latitudinal",r),this._halfBlur(a,t,i,i,s,"longitudinal",r)}_halfBlur(t,e,i,s,r,a,o){const c=this._renderer,l=this._blurMaterial;a!=="latitudinal"&&a!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const h=3,u=new nt(this._lodPlanes[s],l),f=l.uniforms,d=this._sizeLods[i]-1,m=isFinite(r)?Math.PI/(2*d):2*Math.PI/(2*yr-1),v=r/m,g=isFinite(r)?1+Math.floor(h*v):yr;g>yr&&console.warn(`sigmaRadians, ${r}, is too large and will clip, as it requested ${g} samples when the maximum is set to ${yr}`);const p=[];let _=0;for(let T=0;T<yr;++T){const A=T/v,b=Math.exp(-A*A/2);p.push(b),T===0?_+=b:T<g&&(_+=2*b)}for(let T=0;T<p.length;T++)p[T]=p[T]/_;f.envMap.value=t.texture,f.samples.value=g,f.weights.value=p,f.latitudinal.value=a==="latitudinal",o&&(f.poleAxis.value=o);const{_lodMax:x}=this;f.dTheta.value=m,f.mipInt.value=x-i;const M=this._sizeLods[s],w=3*M*(s>x-Da?s-x+Da:0),S=4*(this._cubeSize-M);cl(e,w,S,3*M,2*M),c.setRenderTarget(e),c.render(u,l0)}}function Ab(n){const t=[],e=[],i=[];let s=n;const r=n-Da+1+I1.length;for(let a=0;a<r;a++){const o=Math.pow(2,s);e.push(o);let c=1/o;a>n-Da?c=I1[a-n+Da-1]:a===0&&(c=0),i.push(c);const l=1/(o-2),h=-l,u=1+l,f=[h,h,u,h,u,u,h,h,u,u,h,u],d=6,m=6,v=3,g=2,p=1,_=new Float32Array(v*m*d),x=new Float32Array(g*m*d),M=new Float32Array(p*m*d);for(let S=0;S<d;S++){const T=S%3*2/3-1,A=S>2?0:-1,b=[T,A,0,T+2/3,A,0,T+2/3,A+1,0,T,A,0,T+2/3,A+1,0,T,A+1,0];_.set(b,v*m*S),x.set(f,g*m*S);const y=[S,S,S,S,S,S];M.set(y,p*m*S)}const w=new xe;w.setAttribute("position",new $t(_,v)),w.setAttribute("uv",new $t(x,g)),w.setAttribute("faceIndex",new $t(M,p)),t.push(w),s>Da&&s--}return{lodPlanes:t,sizeLods:e,sigmas:i}}function N1(n,t,e){const i=new yn(n,t,e);return i.texture.mapping=xh,i.texture.name="PMREM.cubeUv",i.scissorTest=!0,i}function cl(n,t,e,i,s){n.viewport.set(t,e,i,s),n.scissor.set(t,e,i,s)}function Rb(n,t,e){const i=new Float32Array(yr),s=new C(0,1,0);return new en({name:"SphericalGaussianBlur",defines:{n:yr,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/e,CUBEUV_MAX_MIP:`${n}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:i},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:s}},vertexShader:jf(),fragmentShader:`

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
		`,blending:Ks,depthTest:!1,depthWrite:!1})}function F1(){return new en({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:jf(),fragmentShader:`

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
		`,blending:Ks,depthTest:!1,depthWrite:!1})}function k1(){return new en({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:jf(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:Ks,depthTest:!1,depthWrite:!1})}function jf(){return`

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
	`}function Cb(n){let t=new WeakMap,e=null;function i(o){if(o&&o.isTexture){const c=o.mapping,l=c===Gl||c===lu,h=c===no||c===io;if(l||h){let u=t.get(o);const f=u!==void 0?u.texture.pmremVersion:0;if(o.isRenderTargetTexture&&o.pmremVersion!==f)return e===null&&(e=new Wu(n)),u=l?e.fromEquirectangular(o,u):e.fromCubemap(o,u),u.texture.pmremVersion=o.pmremVersion,t.set(o,u),u.texture;if(u!==void 0)return u.texture;{const d=o.image;return l&&d&&d.height>0||h&&d&&s(d)?(e===null&&(e=new Wu(n)),u=l?e.fromEquirectangular(o):e.fromCubemap(o),u.texture.pmremVersion=o.pmremVersion,t.set(o,u),o.addEventListener("dispose",r),u.texture):null}}}return o}function s(o){let c=0;const l=6;for(let h=0;h<l;h++)o[h]!==void 0&&c++;return c===l}function r(o){const c=o.target;c.removeEventListener("dispose",r);const l=t.get(c);l!==void 0&&(t.delete(c),l.dispose())}function a(){t=new WeakMap,e!==null&&(e.dispose(),e=null)}return{get:i,dispose:a}}function Lb(n){const t={};function e(i){if(t[i]!==void 0)return t[i];let s;switch(i){case"WEBGL_depth_texture":s=n.getExtension("WEBGL_depth_texture")||n.getExtension("MOZ_WEBGL_depth_texture")||n.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":s=n.getExtension("EXT_texture_filter_anisotropic")||n.getExtension("MOZ_EXT_texture_filter_anisotropic")||n.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":s=n.getExtension("WEBGL_compressed_texture_s3tc")||n.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||n.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":s=n.getExtension("WEBGL_compressed_texture_pvrtc")||n.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:s=n.getExtension(i)}return t[i]=s,s}return{has:function(i){return e(i)!==null},init:function(){e("EXT_color_buffer_float"),e("WEBGL_clip_cull_distance"),e("OES_texture_float_linear"),e("EXT_color_buffer_half_float"),e("WEBGL_multisampled_render_to_texture"),e("WEBGL_render_shared_exponent")},get:function(i){const s=e(i);return s===null&&rc("THREE.WebGLRenderer: "+i+" extension not supported."),s}}}function Pb(n,t,e,i){const s={},r=new WeakMap;function a(u){const f=u.target;f.index!==null&&t.remove(f.index);for(const m in f.attributes)t.remove(f.attributes[m]);f.removeEventListener("dispose",a),delete s[f.id];const d=r.get(f);d&&(t.remove(d),r.delete(f)),i.releaseStatesOfGeometry(f),f.isInstancedBufferGeometry===!0&&delete f._maxInstanceCount,e.memory.geometries--}function o(u,f){return s[f.id]===!0||(f.addEventListener("dispose",a),s[f.id]=!0,e.memory.geometries++),f}function c(u){const f=u.attributes;for(const d in f)t.update(f[d],n.ARRAY_BUFFER)}function l(u){const f=[],d=u.index,m=u.attributes.position;let v=0;if(d!==null){const _=d.array;v=d.version;for(let x=0,M=_.length;x<M;x+=3){const w=_[x+0],S=_[x+1],T=_[x+2];f.push(w,S,S,T,T,w)}}else if(m!==void 0){const _=m.array;v=m.version;for(let x=0,M=_.length/3-1;x<M;x+=3){const w=x+0,S=x+1,T=x+2;f.push(w,S,S,T,T,w)}}else return;const g=new(ug(f)?pg:Bf)(f,1);g.version=v;const p=r.get(u);p&&t.remove(p),r.set(u,g)}function h(u){const f=r.get(u);if(f){const d=u.index;d!==null&&f.version<d.version&&l(u)}else l(u);return r.get(u)}return{get:o,update:c,getWireframeAttribute:h}}function Ib(n,t,e){let i;function s(f){i=f}let r,a;function o(f){r=f.type,a=f.bytesPerElement}function c(f,d){n.drawElements(i,d,r,f*a),e.update(d,i,1)}function l(f,d,m){m!==0&&(n.drawElementsInstanced(i,d,r,f*a,m),e.update(d,i,m))}function h(f,d,m){if(m===0)return;t.get("WEBGL_multi_draw").multiDrawElementsWEBGL(i,d,0,r,f,0,m);let g=0;for(let p=0;p<m;p++)g+=d[p];e.update(g,i,1)}function u(f,d,m,v){if(m===0)return;const g=t.get("WEBGL_multi_draw");if(g===null)for(let p=0;p<f.length;p++)l(f[p]/a,d[p],v[p]);else{g.multiDrawElementsInstancedWEBGL(i,d,0,r,f,0,v,0,m);let p=0;for(let _=0;_<m;_++)p+=d[_]*v[_];e.update(p,i,1)}}this.setMode=s,this.setIndex=o,this.render=c,this.renderInstances=l,this.renderMultiDraw=h,this.renderMultiDrawInstances=u}function Db(n){const t={geometries:0,textures:0},e={frame:0,calls:0,triangles:0,points:0,lines:0};function i(r,a,o){switch(e.calls++,a){case n.TRIANGLES:e.triangles+=o*(r/3);break;case n.LINES:e.lines+=o*(r/2);break;case n.LINE_STRIP:e.lines+=o*(r-1);break;case n.LINE_LOOP:e.lines+=o*r;break;case n.POINTS:e.points+=o*r;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",a);break}}function s(){e.calls=0,e.triangles=0,e.points=0,e.lines=0}return{memory:t,render:e,programs:null,autoReset:!0,reset:s,update:i}}function Ub(n,t,e){const i=new WeakMap,s=new de;function r(a,o,c){const l=a.morphTargetInfluences,h=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,u=h!==void 0?h.length:0;let f=i.get(o);if(f===void 0||f.count!==u){let b=function(){T.dispose(),i.delete(o),o.removeEventListener("dispose",b)};f!==void 0&&f.texture.dispose();const d=o.morphAttributes.position!==void 0,m=o.morphAttributes.normal!==void 0,v=o.morphAttributes.color!==void 0,g=o.morphAttributes.position||[],p=o.morphAttributes.normal||[],_=o.morphAttributes.color||[];let x=0;d===!0&&(x=1),m===!0&&(x=2),v===!0&&(x=3);let M=o.attributes.position.count*x,w=1;M>t.maxTextureSize&&(w=Math.ceil(M/t.maxTextureSize),M=t.maxTextureSize);const S=new Float32Array(M*w*4*u),T=new kf(S,M,w,u);T.type=es,T.needsUpdate=!0;const A=x*4;for(let y=0;y<u;y++){const E=g[y],R=p[y],P=_[y],I=M*w*4*y;for(let F=0;F<E.count;F++){const H=F*A;d===!0&&(s.fromBufferAttribute(E,F),S[I+H+0]=s.x,S[I+H+1]=s.y,S[I+H+2]=s.z,S[I+H+3]=0),m===!0&&(s.fromBufferAttribute(R,F),S[I+H+4]=s.x,S[I+H+5]=s.y,S[I+H+6]=s.z,S[I+H+7]=0),v===!0&&(s.fromBufferAttribute(P,F),S[I+H+8]=s.x,S[I+H+9]=s.y,S[I+H+10]=s.z,S[I+H+11]=P.itemSize===4?s.w:1)}}f={count:u,texture:T,size:new ft(M,w)},i.set(o,f),o.addEventListener("dispose",b)}if(a.isInstancedMesh===!0&&a.morphTexture!==null)c.getUniforms().setValue(n,"morphTexture",a.morphTexture,e);else{let d=0;for(let v=0;v<l.length;v++)d+=l[v];const m=o.morphTargetsRelative?1:1-d;c.getUniforms().setValue(n,"morphTargetBaseInfluence",m),c.getUniforms().setValue(n,"morphTargetInfluences",l)}c.getUniforms().setValue(n,"morphTargetsTexture",f.texture,e),c.getUniforms().setValue(n,"morphTargetsTextureSize",f.size)}return{update:r}}function Nb(n,t,e,i){let s=new WeakMap;function r(c){const l=i.render.frame,h=c.geometry,u=t.get(c,h);if(s.get(u)!==l&&(t.update(u),s.set(u,l)),c.isInstancedMesh&&(c.hasEventListener("dispose",o)===!1&&c.addEventListener("dispose",o),s.get(c)!==l&&(e.update(c.instanceMatrix,n.ARRAY_BUFFER),c.instanceColor!==null&&e.update(c.instanceColor,n.ARRAY_BUFFER),s.set(c,l))),c.isSkinnedMesh){const f=c.skeleton;s.get(f)!==l&&(f.update(),s.set(f,l))}return u}function a(){s=new WeakMap}function o(c){const l=c.target;l.removeEventListener("dispose",o),e.remove(l.instanceMatrix),l.instanceColor!==null&&e.remove(l.instanceColor)}return{update:r,dispose:a}}const Ng=new hn,O1=new wg(1,1),Fg=new kf,kg=new M_,Og=new vg,B1=[],H1=[],z1=new Float32Array(16),V1=new Float32Array(9),G1=new Float32Array(4);function go(n,t,e){const i=n[0];if(i<=0||i>0)return n;const s=t*e;let r=B1[s];if(r===void 0&&(r=new Float32Array(s),B1[s]=r),t!==0){i.toArray(r,0);for(let a=1,o=0;a!==t;++a)o+=e,n[a].toArray(r,o)}return r}function Ze(n,t){if(n.length!==t.length)return!1;for(let e=0,i=n.length;e<i;e++)if(n[e]!==t[e])return!1;return!0}function Je(n,t){for(let e=0,i=t.length;e<i;e++)n[e]=t[e]}function Mh(n,t){let e=H1[t];e===void 0&&(e=new Int32Array(t),H1[t]=e);for(let i=0;i!==t;++i)e[i]=n.allocateTextureUnit();return e}function Fb(n,t){const e=this.cache;e[0]!==t&&(n.uniform1f(this.addr,t),e[0]=t)}function kb(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(n.uniform2f(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Ze(e,t))return;n.uniform2fv(this.addr,t),Je(e,t)}}function Ob(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(n.uniform3f(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else if(t.r!==void 0)(e[0]!==t.r||e[1]!==t.g||e[2]!==t.b)&&(n.uniform3f(this.addr,t.r,t.g,t.b),e[0]=t.r,e[1]=t.g,e[2]=t.b);else{if(Ze(e,t))return;n.uniform3fv(this.addr,t),Je(e,t)}}function Bb(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(n.uniform4f(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Ze(e,t))return;n.uniform4fv(this.addr,t),Je(e,t)}}function Hb(n,t){const e=this.cache,i=t.elements;if(i===void 0){if(Ze(e,t))return;n.uniformMatrix2fv(this.addr,!1,t),Je(e,t)}else{if(Ze(e,i))return;G1.set(i),n.uniformMatrix2fv(this.addr,!1,G1),Je(e,i)}}function zb(n,t){const e=this.cache,i=t.elements;if(i===void 0){if(Ze(e,t))return;n.uniformMatrix3fv(this.addr,!1,t),Je(e,t)}else{if(Ze(e,i))return;V1.set(i),n.uniformMatrix3fv(this.addr,!1,V1),Je(e,i)}}function Vb(n,t){const e=this.cache,i=t.elements;if(i===void 0){if(Ze(e,t))return;n.uniformMatrix4fv(this.addr,!1,t),Je(e,t)}else{if(Ze(e,i))return;z1.set(i),n.uniformMatrix4fv(this.addr,!1,z1),Je(e,i)}}function Gb(n,t){const e=this.cache;e[0]!==t&&(n.uniform1i(this.addr,t),e[0]=t)}function Wb(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(n.uniform2i(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Ze(e,t))return;n.uniform2iv(this.addr,t),Je(e,t)}}function Xb(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(n.uniform3i(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(Ze(e,t))return;n.uniform3iv(this.addr,t),Je(e,t)}}function qb(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(n.uniform4i(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Ze(e,t))return;n.uniform4iv(this.addr,t),Je(e,t)}}function $b(n,t){const e=this.cache;e[0]!==t&&(n.uniform1ui(this.addr,t),e[0]=t)}function Yb(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(n.uniform2ui(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Ze(e,t))return;n.uniform2uiv(this.addr,t),Je(e,t)}}function jb(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(n.uniform3ui(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(Ze(e,t))return;n.uniform3uiv(this.addr,t),Je(e,t)}}function Zb(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(n.uniform4ui(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Ze(e,t))return;n.uniform4uiv(this.addr,t),Je(e,t)}}function Jb(n,t,e){const i=this.cache,s=e.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s);let r;this.type===n.SAMPLER_2D_SHADOW?(O1.compareFunction=hg,r=O1):r=Ng,e.setTexture2D(t||r,s)}function Kb(n,t,e){const i=this.cache,s=e.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s),e.setTexture3D(t||kg,s)}function Qb(n,t,e){const i=this.cache,s=e.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s),e.setTextureCube(t||Og,s)}function tw(n,t,e){const i=this.cache,s=e.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s),e.setTexture2DArray(t||Fg,s)}function ew(n){switch(n){case 5126:return Fb;case 35664:return kb;case 35665:return Ob;case 35666:return Bb;case 35674:return Hb;case 35675:return zb;case 35676:return Vb;case 5124:case 35670:return Gb;case 35667:case 35671:return Wb;case 35668:case 35672:return Xb;case 35669:case 35673:return qb;case 5125:return $b;case 36294:return Yb;case 36295:return jb;case 36296:return Zb;case 35678:case 36198:case 36298:case 36306:case 35682:return Jb;case 35679:case 36299:case 36307:return Kb;case 35680:case 36300:case 36308:case 36293:return Qb;case 36289:case 36303:case 36311:case 36292:return tw}}function nw(n,t){n.uniform1fv(this.addr,t)}function iw(n,t){const e=go(t,this.size,2);n.uniform2fv(this.addr,e)}function sw(n,t){const e=go(t,this.size,3);n.uniform3fv(this.addr,e)}function rw(n,t){const e=go(t,this.size,4);n.uniform4fv(this.addr,e)}function aw(n,t){const e=go(t,this.size,4);n.uniformMatrix2fv(this.addr,!1,e)}function ow(n,t){const e=go(t,this.size,9);n.uniformMatrix3fv(this.addr,!1,e)}function cw(n,t){const e=go(t,this.size,16);n.uniformMatrix4fv(this.addr,!1,e)}function lw(n,t){n.uniform1iv(this.addr,t)}function hw(n,t){n.uniform2iv(this.addr,t)}function uw(n,t){n.uniform3iv(this.addr,t)}function fw(n,t){n.uniform4iv(this.addr,t)}function dw(n,t){n.uniform1uiv(this.addr,t)}function pw(n,t){n.uniform2uiv(this.addr,t)}function mw(n,t){n.uniform3uiv(this.addr,t)}function gw(n,t){n.uniform4uiv(this.addr,t)}function vw(n,t,e){const i=this.cache,s=t.length,r=Mh(e,s);Ze(i,r)||(n.uniform1iv(this.addr,r),Je(i,r));for(let a=0;a!==s;++a)e.setTexture2D(t[a]||Ng,r[a])}function xw(n,t,e){const i=this.cache,s=t.length,r=Mh(e,s);Ze(i,r)||(n.uniform1iv(this.addr,r),Je(i,r));for(let a=0;a!==s;++a)e.setTexture3D(t[a]||kg,r[a])}function _w(n,t,e){const i=this.cache,s=t.length,r=Mh(e,s);Ze(i,r)||(n.uniform1iv(this.addr,r),Je(i,r));for(let a=0;a!==s;++a)e.setTextureCube(t[a]||Og,r[a])}function Mw(n,t,e){const i=this.cache,s=t.length,r=Mh(e,s);Ze(i,r)||(n.uniform1iv(this.addr,r),Je(i,r));for(let a=0;a!==s;++a)e.setTexture2DArray(t[a]||Fg,r[a])}function bw(n){switch(n){case 5126:return nw;case 35664:return iw;case 35665:return sw;case 35666:return rw;case 35674:return aw;case 35675:return ow;case 35676:return cw;case 5124:case 35670:return lw;case 35667:case 35671:return hw;case 35668:case 35672:return uw;case 35669:case 35673:return fw;case 5125:return dw;case 36294:return pw;case 36295:return mw;case 36296:return gw;case 35678:case 36198:case 36298:case 36306:case 35682:return vw;case 35679:case 36299:case 36307:return xw;case 35680:case 36300:case 36308:case 36293:return _w;case 36289:case 36303:case 36311:case 36292:return Mw}}class ww{constructor(t,e,i){this.id=t,this.addr=i,this.cache=[],this.type=e.type,this.setValue=ew(e.type)}}class yw{constructor(t,e,i){this.id=t,this.addr=i,this.cache=[],this.type=e.type,this.size=e.size,this.setValue=bw(e.type)}}class Sw{constructor(t){this.id=t,this.seq=[],this.map={}}setValue(t,e,i){const s=this.seq;for(let r=0,a=s.length;r!==a;++r){const o=s[r];o.setValue(t,e[o.id],i)}}}const p0=/(\w+)(\])?(\[|\.)?/g;function W1(n,t){n.seq.push(t),n.map[t.id]=t}function Ew(n,t,e){const i=n.name,s=i.length;for(p0.lastIndex=0;;){const r=p0.exec(i),a=p0.lastIndex;let o=r[1];const c=r[2]==="]",l=r[3];if(c&&(o=o|0),l===void 0||l==="["&&a+2===s){W1(e,l===void 0?new ww(o,n,t):new yw(o,n,t));break}else{let u=e.map[o];u===void 0&&(u=new Sw(o),W1(e,u)),e=u}}}class Cl{constructor(t,e){this.seq=[],this.map={};const i=t.getProgramParameter(e,t.ACTIVE_UNIFORMS);for(let s=0;s<i;++s){const r=t.getActiveUniform(e,s),a=t.getUniformLocation(e,r.name);Ew(r,a,this)}}setValue(t,e,i,s){const r=this.map[e];r!==void 0&&r.setValue(t,i,s)}setOptional(t,e,i){const s=e[i];s!==void 0&&this.setValue(t,i,s)}static upload(t,e,i,s){for(let r=0,a=e.length;r!==a;++r){const o=e[r],c=i[o.id];c.needsUpdate!==!1&&o.setValue(t,c.value,s)}}static seqWithValue(t,e){const i=[];for(let s=0,r=t.length;s!==r;++s){const a=t[s];a.id in e&&i.push(a)}return i}}function X1(n,t,e){const i=n.createShader(t);return n.shaderSource(i,e),n.compileShader(i),i}const Tw=37297;let Aw=0;function Rw(n,t){const e=n.split(`
`),i=[],s=Math.max(t-6,0),r=Math.min(t+6,e.length);for(let a=s;a<r;a++){const o=a+1;i.push(`${o===t?">":" "} ${o}: ${e[a]}`)}return i.join(`
`)}const q1=new oe;function Cw(n){ge._getMatrix(q1,ge.workingColorSpace,n);const t=`mat3( ${q1.elements.map(e=>e.toFixed(4))} )`;switch(ge.getTransfer(n)){case Wl:return[t,"LinearTransferOETF"];case we:return[t,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space: ",n),[t,"LinearTransferOETF"]}}function $1(n,t,e){const i=n.getShaderParameter(t,n.COMPILE_STATUS),r=(n.getShaderInfoLog(t)||"").trim();if(i&&r==="")return"";const a=/ERROR: 0:(\d+)/.exec(r);if(a){const o=parseInt(a[1]);return e.toUpperCase()+`

`+r+`

`+Rw(n.getShaderSource(t),o)}else return r}function Lw(n,t){const e=Cw(t);return[`vec4 ${n}( vec4 value ) {`,`	return ${e[1]}( vec4( value.rgb * ${e[0]}, value.a ) );`,"}"].join(`
`)}function Pw(n,t){let e;switch(t){case Ix:e="Linear";break;case Dx:e="Reinhard";break;case Ux:e="Cineon";break;case Nx:e="ACESFilmic";break;case kx:e="AgX";break;case Qm:e="Neutral";break;case Fx:e="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",t),e="Linear"}return"vec3 "+n+"( vec3 color ) { return "+e+"ToneMapping( color ); }"}const ll=new C;function Iw(){ge.getLuminanceCoefficients(ll);const n=ll.x.toFixed(4),t=ll.y.toFixed(4),e=ll.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${n}, ${t}, ${e} );`,"	return dot( weights, rgb );","}"].join(`
`)}function Dw(n){return[n.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",n.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(zo).join(`
`)}function Uw(n){const t=[];for(const e in n){const i=n[e];i!==!1&&t.push("#define "+e+" "+i)}return t.join(`
`)}function Nw(n,t){const e={},i=n.getProgramParameter(t,n.ACTIVE_ATTRIBUTES);for(let s=0;s<i;s++){const r=n.getActiveAttrib(t,s),a=r.name;let o=1;r.type===n.FLOAT_MAT2&&(o=2),r.type===n.FLOAT_MAT3&&(o=3),r.type===n.FLOAT_MAT4&&(o=4),e[a]={type:r.type,location:n.getAttribLocation(t,a),locationSize:o}}return e}function zo(n){return n!==""}function Y1(n,t){const e=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return n.replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,e).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows)}function j1(n,t){return n.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}const Fw=/^[ \t]*#include +<([\w\d./]+)>/gm;function Xu(n){return n.replace(Fw,Ow)}const kw=new Map;function Ow(n,t){let e=ce[t];if(e===void 0){const i=kw.get(t);if(i!==void 0)e=ce[i],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',t,i);else throw new Error("Can not resolve #include <"+t+">")}return Xu(e)}const Bw=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function Z1(n){return n.replace(Bw,Hw)}function Hw(n,t,e,i){let s="";for(let r=parseInt(t);r<parseInt(e);r++)s+=i.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return s}function J1(n){let t=`precision ${n.precision} float;
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
#define LOW_PRECISION`),t}function zw(n){let t="SHADOWMAP_TYPE_BASIC";return n.shadowMapType===$m?t="SHADOWMAP_TYPE_PCF":n.shadowMapType===Ym?t="SHADOWMAP_TYPE_PCF_SOFT":n.shadowMapType===vs&&(t="SHADOWMAP_TYPE_VSM"),t}function Vw(n){let t="ENVMAP_TYPE_CUBE";if(n.envMap)switch(n.envMapMode){case no:case io:t="ENVMAP_TYPE_CUBE";break;case xh:t="ENVMAP_TYPE_CUBE_UV";break}return t}function Gw(n){let t="ENVMAP_MODE_REFLECTION";if(n.envMap)switch(n.envMapMode){case io:t="ENVMAP_MODE_REFRACTION";break}return t}function Ww(n){let t="ENVMAP_BLENDING_NONE";if(n.envMap)switch(n.combine){case Km:t="ENVMAP_BLENDING_MULTIPLY";break;case Lx:t="ENVMAP_BLENDING_MIX";break;case Px:t="ENVMAP_BLENDING_ADD";break}return t}function Xw(n){const t=n.envMapCubeUVHeight;if(t===null)return null;const e=Math.log2(t)-2,i=1/t;return{texelWidth:1/(3*Math.max(Math.pow(2,e),112)),texelHeight:i,maxMip:e}}function qw(n,t,e,i){const s=n.getContext(),r=e.defines;let a=e.vertexShader,o=e.fragmentShader;const c=zw(e),l=Vw(e),h=Gw(e),u=Ww(e),f=Xw(e),d=Dw(e),m=Uw(r),v=s.createProgram();let g,p,_=e.glslVersion?"#version "+e.glslVersion+`
`:"";e.isRawShaderMaterial?(g=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,m].filter(zo).join(`
`),g.length>0&&(g+=`
`),p=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,m].filter(zo).join(`
`),p.length>0&&(p+=`
`)):(g=[J1(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,m,e.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",e.batching?"#define USE_BATCHING":"",e.batchingColor?"#define USE_BATCHING_COLOR":"",e.instancing?"#define USE_INSTANCING":"",e.instancingColor?"#define USE_INSTANCING_COLOR":"",e.instancingMorph?"#define USE_INSTANCING_MORPH":"",e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.map?"#define USE_MAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+h:"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.displacementMap?"#define USE_DISPLACEMENTMAP":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.mapUv?"#define MAP_UV "+e.mapUv:"",e.alphaMapUv?"#define ALPHAMAP_UV "+e.alphaMapUv:"",e.lightMapUv?"#define LIGHTMAP_UV "+e.lightMapUv:"",e.aoMapUv?"#define AOMAP_UV "+e.aoMapUv:"",e.emissiveMapUv?"#define EMISSIVEMAP_UV "+e.emissiveMapUv:"",e.bumpMapUv?"#define BUMPMAP_UV "+e.bumpMapUv:"",e.normalMapUv?"#define NORMALMAP_UV "+e.normalMapUv:"",e.displacementMapUv?"#define DISPLACEMENTMAP_UV "+e.displacementMapUv:"",e.metalnessMapUv?"#define METALNESSMAP_UV "+e.metalnessMapUv:"",e.roughnessMapUv?"#define ROUGHNESSMAP_UV "+e.roughnessMapUv:"",e.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+e.anisotropyMapUv:"",e.clearcoatMapUv?"#define CLEARCOATMAP_UV "+e.clearcoatMapUv:"",e.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+e.clearcoatNormalMapUv:"",e.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+e.clearcoatRoughnessMapUv:"",e.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+e.iridescenceMapUv:"",e.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+e.iridescenceThicknessMapUv:"",e.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+e.sheenColorMapUv:"",e.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+e.sheenRoughnessMapUv:"",e.specularMapUv?"#define SPECULARMAP_UV "+e.specularMapUv:"",e.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+e.specularColorMapUv:"",e.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+e.specularIntensityMapUv:"",e.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+e.transmissionMapUv:"",e.thicknessMapUv?"#define THICKNESSMAP_UV "+e.thicknessMapUv:"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.flatShading?"#define FLAT_SHADED":"",e.skinning?"#define USE_SKINNING":"",e.morphTargets?"#define USE_MORPHTARGETS":"",e.morphNormals&&e.flatShading===!1?"#define USE_MORPHNORMALS":"",e.morphColors?"#define USE_MORPHCOLORS":"",e.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+e.morphTextureStride:"",e.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+e.morphTargetsCount:"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+c:"",e.sizeAttenuation?"#define USE_SIZEATTENUATION":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",e.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(zo).join(`
`),p=[J1(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,m,e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",e.map?"#define USE_MAP":"",e.matcap?"#define USE_MATCAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+l:"",e.envMap?"#define "+h:"",e.envMap?"#define "+u:"",f?"#define CUBEUV_TEXEL_WIDTH "+f.texelWidth:"",f?"#define CUBEUV_TEXEL_HEIGHT "+f.texelHeight:"",f?"#define CUBEUV_MAX_MIP "+f.maxMip+".0":"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoat?"#define USE_CLEARCOAT":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.dispersion?"#define USE_DISPERSION":"",e.iridescence?"#define USE_IRIDESCENCE":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaTest?"#define USE_ALPHATEST":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.sheen?"#define USE_SHEEN":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors||e.instancingColor||e.batchingColor?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.gradientMap?"#define USE_GRADIENTMAP":"",e.flatShading?"#define FLAT_SHADED":"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+c:"",e.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",e.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",e.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",e.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",e.toneMapping!==Qs?"#define TONE_MAPPING":"",e.toneMapping!==Qs?ce.tonemapping_pars_fragment:"",e.toneMapping!==Qs?Pw("toneMapping",e.toneMapping):"",e.dithering?"#define DITHERING":"",e.opaque?"#define OPAQUE":"",ce.colorspace_pars_fragment,Lw("linearToOutputTexel",e.outputColorSpace),Iw(),e.useDepthPacking?"#define DEPTH_PACKING "+e.depthPacking:"",`
`].filter(zo).join(`
`)),a=Xu(a),a=Y1(a,e),a=j1(a,e),o=Xu(o),o=Y1(o,e),o=j1(o,e),a=Z1(a),o=Z1(o),e.isRawShaderMaterial!==!0&&(_=`#version 300 es
`,g=[d,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+g,p=["#define varying in",e.glslVersion===Yd?"":"layout(location = 0) out highp vec4 pc_fragColor;",e.glslVersion===Yd?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+p);const x=_+g+a,M=_+p+o,w=X1(s,s.VERTEX_SHADER,x),S=X1(s,s.FRAGMENT_SHADER,M);s.attachShader(v,w),s.attachShader(v,S),e.index0AttributeName!==void 0?s.bindAttribLocation(v,0,e.index0AttributeName):e.morphTargets===!0&&s.bindAttribLocation(v,0,"position"),s.linkProgram(v);function T(E){if(n.debug.checkShaderErrors){const R=s.getProgramInfoLog(v)||"",P=s.getShaderInfoLog(w)||"",I=s.getShaderInfoLog(S)||"",F=R.trim(),H=P.trim(),$=I.trim();let B=!0,Y=!0;if(s.getProgramParameter(v,s.LINK_STATUS)===!1)if(B=!1,typeof n.debug.onShaderError=="function")n.debug.onShaderError(s,v,w,S);else{const it=$1(s,w,"vertex"),mt=$1(s,S,"fragment");console.error("THREE.WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(v,s.VALIDATE_STATUS)+`

Material Name: `+E.name+`
Material Type: `+E.type+`

Program Info Log: `+F+`
`+it+`
`+mt)}else F!==""?console.warn("THREE.WebGLProgram: Program Info Log:",F):(H===""||$==="")&&(Y=!1);Y&&(E.diagnostics={runnable:B,programLog:F,vertexShader:{log:H,prefix:g},fragmentShader:{log:$,prefix:p}})}s.deleteShader(w),s.deleteShader(S),A=new Cl(s,v),b=Nw(s,v)}let A;this.getUniforms=function(){return A===void 0&&T(this),A};let b;this.getAttributes=function(){return b===void 0&&T(this),b};let y=e.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return y===!1&&(y=s.getProgramParameter(v,Tw)),y},this.destroy=function(){i.releaseStatesOfProgram(this),s.deleteProgram(v),this.program=void 0},this.type=e.shaderType,this.name=e.shaderName,this.id=Aw++,this.cacheKey=t,this.usedTimes=1,this.program=v,this.vertexShader=w,this.fragmentShader=S,this}let $w=0;class Yw{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(t){const e=t.vertexShader,i=t.fragmentShader,s=this._getShaderStage(e),r=this._getShaderStage(i),a=this._getShaderCacheForMaterial(t);return a.has(s)===!1&&(a.add(s),s.usedTimes++),a.has(r)===!1&&(a.add(r),r.usedTimes++),this}remove(t){const e=this.materialCache.get(t);for(const i of e)i.usedTimes--,i.usedTimes===0&&this.shaderCache.delete(i.code);return this.materialCache.delete(t),this}getVertexShaderID(t){return this._getShaderStage(t.vertexShader).id}getFragmentShaderID(t){return this._getShaderStage(t.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(t){const e=this.materialCache;let i=e.get(t);return i===void 0&&(i=new Set,e.set(t,i)),i}_getShaderStage(t){const e=this.shaderCache;let i=e.get(t);return i===void 0&&(i=new jw(t),e.set(t,i)),i}}class jw{constructor(t){this.id=$w++,this.code=t,this.usedTimes=0}}function Zw(n,t,e,i,s,r,a){const o=new fg,c=new Yw,l=new Set,h=[],u=s.logarithmicDepthBuffer,f=s.vertexTextures;let d=s.precision;const m={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function v(b){return l.add(b),b===0?"uv":`uv${b}`}function g(b,y,E,R,P){const I=R.fog,F=P.geometry,H=b.isMeshStandardMaterial?R.environment:null,$=(b.isMeshStandardMaterial?e:t).get(b.envMap||H),B=$&&$.mapping===xh?$.image.height:null,Y=m[b.type];b.precision!==null&&(d=s.getMaxPrecision(b.precision),d!==b.precision&&console.warn("THREE.WebGLProgram.getParameters:",b.precision,"not supported, using",d,"instead."));const it=F.morphAttributes.position||F.morphAttributes.normal||F.morphAttributes.color,mt=it!==void 0?it.length:0;let vt=0;F.morphAttributes.position!==void 0&&(vt=1),F.morphAttributes.normal!==void 0&&(vt=2),F.morphAttributes.color!==void 0&&(vt=3);let St,Ct,Ut,V;if(Y){const _e=Yi[Y];St=_e.vertexShader,Ct=_e.fragmentShader}else St=b.vertexShader,Ct=b.fragmentShader,c.update(b),Ut=c.getVertexShaderID(b),V=c.getFragmentShaderID(b);const X=n.getRenderTarget(),z=n.state.buffers.depth.getReversed(),W=P.isInstancedMesh===!0,G=P.isBatchedMesh===!0,tt=!!b.map,at=!!b.matcap,N=!!$,et=!!b.aoMap,Q=!!b.lightMap,st=!!b.bumpMap,ht=!!b.normalMap,pt=!!b.displacementMap,_t=!!b.emissiveMap,bt=!!b.metalnessMap,ee=!!b.roughnessMap,Kt=b.anisotropy>0,k=b.clearcoat>0,L=b.dispersion>0,J=b.iridescence>0,ut=b.sheen>0,Mt=b.transmission>0,dt=Kt&&!!b.anisotropyMap,Vt=k&&!!b.clearcoatMap,At=k&&!!b.clearcoatNormalMap,Bt=k&&!!b.clearcoatRoughnessMap,Ht=J&&!!b.iridescenceMap,wt=J&&!!b.iridescenceThicknessMap,Nt=ut&&!!b.sheenColorMap,Qt=ut&&!!b.sheenRoughnessMap,Gt=!!b.specularMap,It=!!b.specularColorMap,ae=!!b.specularIntensityMap,q=Mt&&!!b.transmissionMap,Tt=Mt&&!!b.thicknessMap,Rt=!!b.gradientMap,kt=!!b.alphaMap,yt=b.alphaTest>0,xt=!!b.alphaHash,zt=!!b.extensions;let se=Qs;b.toneMapped&&(X===null||X.isXRRenderTarget===!0)&&(se=n.toneMapping);const Te={shaderID:Y,shaderType:b.type,shaderName:b.name,vertexShader:St,fragmentShader:Ct,defines:b.defines,customVertexShaderID:Ut,customFragmentShaderID:V,isRawShaderMaterial:b.isRawShaderMaterial===!0,glslVersion:b.glslVersion,precision:d,batching:G,batchingColor:G&&P._colorsTexture!==null,instancing:W,instancingColor:W&&P.instanceColor!==null,instancingMorph:W&&P.morphTexture!==null,supportsVertexTextures:f,outputColorSpace:X===null?n.outputColorSpace:X.isXRRenderTarget===!0?X.texture.colorSpace:Hr,alphaToCoverage:!!b.alphaToCoverage,map:tt,matcap:at,envMap:N,envMapMode:N&&$.mapping,envMapCubeUVHeight:B,aoMap:et,lightMap:Q,bumpMap:st,normalMap:ht,displacementMap:f&&pt,emissiveMap:_t,normalMapObjectSpace:ht&&b.normalMapType===Vx,normalMapTangentSpace:ht&&b.normalMapType===lg,metalnessMap:bt,roughnessMap:ee,anisotropy:Kt,anisotropyMap:dt,clearcoat:k,clearcoatMap:Vt,clearcoatNormalMap:At,clearcoatRoughnessMap:Bt,dispersion:L,iridescence:J,iridescenceMap:Ht,iridescenceThicknessMap:wt,sheen:ut,sheenColorMap:Nt,sheenRoughnessMap:Qt,specularMap:Gt,specularColorMap:It,specularIntensityMap:ae,transmission:Mt,transmissionMap:q,thicknessMap:Tt,gradientMap:Rt,opaque:b.transparent===!1&&b.blending===za&&b.alphaToCoverage===!1,alphaMap:kt,alphaTest:yt,alphaHash:xt,combine:b.combine,mapUv:tt&&v(b.map.channel),aoMapUv:et&&v(b.aoMap.channel),lightMapUv:Q&&v(b.lightMap.channel),bumpMapUv:st&&v(b.bumpMap.channel),normalMapUv:ht&&v(b.normalMap.channel),displacementMapUv:pt&&v(b.displacementMap.channel),emissiveMapUv:_t&&v(b.emissiveMap.channel),metalnessMapUv:bt&&v(b.metalnessMap.channel),roughnessMapUv:ee&&v(b.roughnessMap.channel),anisotropyMapUv:dt&&v(b.anisotropyMap.channel),clearcoatMapUv:Vt&&v(b.clearcoatMap.channel),clearcoatNormalMapUv:At&&v(b.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:Bt&&v(b.clearcoatRoughnessMap.channel),iridescenceMapUv:Ht&&v(b.iridescenceMap.channel),iridescenceThicknessMapUv:wt&&v(b.iridescenceThicknessMap.channel),sheenColorMapUv:Nt&&v(b.sheenColorMap.channel),sheenRoughnessMapUv:Qt&&v(b.sheenRoughnessMap.channel),specularMapUv:Gt&&v(b.specularMap.channel),specularColorMapUv:It&&v(b.specularColorMap.channel),specularIntensityMapUv:ae&&v(b.specularIntensityMap.channel),transmissionMapUv:q&&v(b.transmissionMap.channel),thicknessMapUv:Tt&&v(b.thicknessMap.channel),alphaMapUv:kt&&v(b.alphaMap.channel),vertexTangents:!!F.attributes.tangent&&(ht||Kt),vertexColors:b.vertexColors,vertexAlphas:b.vertexColors===!0&&!!F.attributes.color&&F.attributes.color.itemSize===4,pointsUvs:P.isPoints===!0&&!!F.attributes.uv&&(tt||kt),fog:!!I,useFog:b.fog===!0,fogExp2:!!I&&I.isFogExp2,flatShading:b.flatShading===!0&&b.wireframe===!1,sizeAttenuation:b.sizeAttenuation===!0,logarithmicDepthBuffer:u,reversedDepthBuffer:z,skinning:P.isSkinnedMesh===!0,morphTargets:F.morphAttributes.position!==void 0,morphNormals:F.morphAttributes.normal!==void 0,morphColors:F.morphAttributes.color!==void 0,morphTargetsCount:mt,morphTextureStride:vt,numDirLights:y.directional.length,numPointLights:y.point.length,numSpotLights:y.spot.length,numSpotLightMaps:y.spotLightMap.length,numRectAreaLights:y.rectArea.length,numHemiLights:y.hemi.length,numDirLightShadows:y.directionalShadowMap.length,numPointLightShadows:y.pointShadowMap.length,numSpotLightShadows:y.spotShadowMap.length,numSpotLightShadowsWithMaps:y.numSpotLightShadowsWithMaps,numLightProbes:y.numLightProbes,numClippingPlanes:a.numPlanes,numClipIntersection:a.numIntersection,dithering:b.dithering,shadowMapEnabled:n.shadowMap.enabled&&E.length>0,shadowMapType:n.shadowMap.type,toneMapping:se,decodeVideoTexture:tt&&b.map.isVideoTexture===!0&&ge.getTransfer(b.map.colorSpace)===we,decodeVideoTextureEmissive:_t&&b.emissiveMap.isVideoTexture===!0&&ge.getTransfer(b.emissiveMap.colorSpace)===we,premultipliedAlpha:b.premultipliedAlpha,doubleSided:b.side===Se,flipSided:b.side===Fn,useDepthPacking:b.depthPacking>=0,depthPacking:b.depthPacking||0,index0AttributeName:b.index0AttributeName,extensionClipCullDistance:zt&&b.extensions.clipCullDistance===!0&&i.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(zt&&b.extensions.multiDraw===!0||G)&&i.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:i.has("KHR_parallel_shader_compile"),customProgramCacheKey:b.customProgramCacheKey()};return Te.vertexUv1s=l.has(1),Te.vertexUv2s=l.has(2),Te.vertexUv3s=l.has(3),l.clear(),Te}function p(b){const y=[];if(b.shaderID?y.push(b.shaderID):(y.push(b.customVertexShaderID),y.push(b.customFragmentShaderID)),b.defines!==void 0)for(const E in b.defines)y.push(E),y.push(b.defines[E]);return b.isRawShaderMaterial===!1&&(_(y,b),x(y,b),y.push(n.outputColorSpace)),y.push(b.customProgramCacheKey),y.join()}function _(b,y){b.push(y.precision),b.push(y.outputColorSpace),b.push(y.envMapMode),b.push(y.envMapCubeUVHeight),b.push(y.mapUv),b.push(y.alphaMapUv),b.push(y.lightMapUv),b.push(y.aoMapUv),b.push(y.bumpMapUv),b.push(y.normalMapUv),b.push(y.displacementMapUv),b.push(y.emissiveMapUv),b.push(y.metalnessMapUv),b.push(y.roughnessMapUv),b.push(y.anisotropyMapUv),b.push(y.clearcoatMapUv),b.push(y.clearcoatNormalMapUv),b.push(y.clearcoatRoughnessMapUv),b.push(y.iridescenceMapUv),b.push(y.iridescenceThicknessMapUv),b.push(y.sheenColorMapUv),b.push(y.sheenRoughnessMapUv),b.push(y.specularMapUv),b.push(y.specularColorMapUv),b.push(y.specularIntensityMapUv),b.push(y.transmissionMapUv),b.push(y.thicknessMapUv),b.push(y.combine),b.push(y.fogExp2),b.push(y.sizeAttenuation),b.push(y.morphTargetsCount),b.push(y.morphAttributeCount),b.push(y.numDirLights),b.push(y.numPointLights),b.push(y.numSpotLights),b.push(y.numSpotLightMaps),b.push(y.numHemiLights),b.push(y.numRectAreaLights),b.push(y.numDirLightShadows),b.push(y.numPointLightShadows),b.push(y.numSpotLightShadows),b.push(y.numSpotLightShadowsWithMaps),b.push(y.numLightProbes),b.push(y.shadowMapType),b.push(y.toneMapping),b.push(y.numClippingPlanes),b.push(y.numClipIntersection),b.push(y.depthPacking)}function x(b,y){o.disableAll(),y.supportsVertexTextures&&o.enable(0),y.instancing&&o.enable(1),y.instancingColor&&o.enable(2),y.instancingMorph&&o.enable(3),y.matcap&&o.enable(4),y.envMap&&o.enable(5),y.normalMapObjectSpace&&o.enable(6),y.normalMapTangentSpace&&o.enable(7),y.clearcoat&&o.enable(8),y.iridescence&&o.enable(9),y.alphaTest&&o.enable(10),y.vertexColors&&o.enable(11),y.vertexAlphas&&o.enable(12),y.vertexUv1s&&o.enable(13),y.vertexUv2s&&o.enable(14),y.vertexUv3s&&o.enable(15),y.vertexTangents&&o.enable(16),y.anisotropy&&o.enable(17),y.alphaHash&&o.enable(18),y.batching&&o.enable(19),y.dispersion&&o.enable(20),y.batchingColor&&o.enable(21),y.gradientMap&&o.enable(22),b.push(o.mask),o.disableAll(),y.fog&&o.enable(0),y.useFog&&o.enable(1),y.flatShading&&o.enable(2),y.logarithmicDepthBuffer&&o.enable(3),y.reversedDepthBuffer&&o.enable(4),y.skinning&&o.enable(5),y.morphTargets&&o.enable(6),y.morphNormals&&o.enable(7),y.morphColors&&o.enable(8),y.premultipliedAlpha&&o.enable(9),y.shadowMapEnabled&&o.enable(10),y.doubleSided&&o.enable(11),y.flipSided&&o.enable(12),y.useDepthPacking&&o.enable(13),y.dithering&&o.enable(14),y.transmission&&o.enable(15),y.sheen&&o.enable(16),y.opaque&&o.enable(17),y.pointsUvs&&o.enable(18),y.decodeVideoTexture&&o.enable(19),y.decodeVideoTextureEmissive&&o.enable(20),y.alphaToCoverage&&o.enable(21),b.push(o.mask)}function M(b){const y=m[b.type];let E;if(y){const R=Yi[y];E=F_.clone(R.uniforms)}else E=b.uniforms;return E}function w(b,y){let E;for(let R=0,P=h.length;R<P;R++){const I=h[R];if(I.cacheKey===y){E=I,++E.usedTimes;break}}return E===void 0&&(E=new qw(n,y,b,r),h.push(E)),E}function S(b){if(--b.usedTimes===0){const y=h.indexOf(b);h[y]=h[h.length-1],h.pop(),b.destroy()}}function T(b){c.remove(b)}function A(){c.dispose()}return{getParameters:g,getProgramCacheKey:p,getUniforms:M,acquireProgram:w,releaseProgram:S,releaseShaderCache:T,programs:h,dispose:A}}function Jw(){let n=new WeakMap;function t(a){return n.has(a)}function e(a){let o=n.get(a);return o===void 0&&(o={},n.set(a,o)),o}function i(a){n.delete(a)}function s(a,o,c){n.get(a)[o]=c}function r(){n=new WeakMap}return{has:t,get:e,remove:i,update:s,dispose:r}}function Kw(n,t){return n.groupOrder!==t.groupOrder?n.groupOrder-t.groupOrder:n.renderOrder!==t.renderOrder?n.renderOrder-t.renderOrder:n.material.id!==t.material.id?n.material.id-t.material.id:n.z!==t.z?n.z-t.z:n.id-t.id}function K1(n,t){return n.groupOrder!==t.groupOrder?n.groupOrder-t.groupOrder:n.renderOrder!==t.renderOrder?n.renderOrder-t.renderOrder:n.z!==t.z?t.z-n.z:n.id-t.id}function Q1(){const n=[];let t=0;const e=[],i=[],s=[];function r(){t=0,e.length=0,i.length=0,s.length=0}function a(u,f,d,m,v,g){let p=n[t];return p===void 0?(p={id:u.id,object:u,geometry:f,material:d,groupOrder:m,renderOrder:u.renderOrder,z:v,group:g},n[t]=p):(p.id=u.id,p.object=u,p.geometry=f,p.material=d,p.groupOrder=m,p.renderOrder=u.renderOrder,p.z=v,p.group=g),t++,p}function o(u,f,d,m,v,g){const p=a(u,f,d,m,v,g);d.transmission>0?i.push(p):d.transparent===!0?s.push(p):e.push(p)}function c(u,f,d,m,v,g){const p=a(u,f,d,m,v,g);d.transmission>0?i.unshift(p):d.transparent===!0?s.unshift(p):e.unshift(p)}function l(u,f){e.length>1&&e.sort(u||Kw),i.length>1&&i.sort(f||K1),s.length>1&&s.sort(f||K1)}function h(){for(let u=t,f=n.length;u<f;u++){const d=n[u];if(d.id===null)break;d.id=null,d.object=null,d.geometry=null,d.material=null,d.group=null}}return{opaque:e,transmissive:i,transparent:s,init:r,push:o,unshift:c,finish:h,sort:l}}function Qw(){let n=new WeakMap;function t(i,s){const r=n.get(i);let a;return r===void 0?(a=new Q1,n.set(i,[a])):s>=r.length?(a=new Q1,r.push(a)):a=r[s],a}function e(){n=new WeakMap}return{get:t,dispose:e}}function ty(){const n={};return{get:function(t){if(n[t.id]!==void 0)return n[t.id];let e;switch(t.type){case"DirectionalLight":e={direction:new C,color:new gt};break;case"SpotLight":e={position:new C,direction:new C,color:new gt,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":e={position:new C,color:new gt,distance:0,decay:0};break;case"HemisphereLight":e={direction:new C,skyColor:new gt,groundColor:new gt};break;case"RectAreaLight":e={color:new gt,position:new C,halfWidth:new C,halfHeight:new C};break}return n[t.id]=e,e}}}function ey(){const n={};return{get:function(t){if(n[t.id]!==void 0)return n[t.id];let e;switch(t.type){case"DirectionalLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ft};break;case"SpotLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ft};break;case"PointLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ft,shadowCameraNear:1,shadowCameraFar:1e3};break}return n[t.id]=e,e}}}let ny=0;function iy(n,t){return(t.castShadow?2:0)-(n.castShadow?2:0)+(t.map?1:0)-(n.map?1:0)}function sy(n){const t=new ty,e=ey(),i={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let l=0;l<9;l++)i.probe.push(new C);const s=new C,r=new re,a=new re;function o(l){let h=0,u=0,f=0;for(let b=0;b<9;b++)i.probe[b].set(0,0,0);let d=0,m=0,v=0,g=0,p=0,_=0,x=0,M=0,w=0,S=0,T=0;l.sort(iy);for(let b=0,y=l.length;b<y;b++){const E=l[b],R=E.color,P=E.intensity,I=E.distance,F=E.shadow&&E.shadow.map?E.shadow.map.texture:null;if(E.isAmbientLight)h+=R.r*P,u+=R.g*P,f+=R.b*P;else if(E.isLightProbe){for(let H=0;H<9;H++)i.probe[H].addScaledVector(E.sh.coefficients[H],P);T++}else if(E.isDirectionalLight){const H=t.get(E);if(H.color.copy(E.color).multiplyScalar(E.intensity),E.castShadow){const $=E.shadow,B=e.get(E);B.shadowIntensity=$.intensity,B.shadowBias=$.bias,B.shadowNormalBias=$.normalBias,B.shadowRadius=$.radius,B.shadowMapSize=$.mapSize,i.directionalShadow[d]=B,i.directionalShadowMap[d]=F,i.directionalShadowMatrix[d]=E.shadow.matrix,_++}i.directional[d]=H,d++}else if(E.isSpotLight){const H=t.get(E);H.position.setFromMatrixPosition(E.matrixWorld),H.color.copy(R).multiplyScalar(P),H.distance=I,H.coneCos=Math.cos(E.angle),H.penumbraCos=Math.cos(E.angle*(1-E.penumbra)),H.decay=E.decay,i.spot[v]=H;const $=E.shadow;if(E.map&&(i.spotLightMap[w]=E.map,w++,$.updateMatrices(E),E.castShadow&&S++),i.spotLightMatrix[v]=$.matrix,E.castShadow){const B=e.get(E);B.shadowIntensity=$.intensity,B.shadowBias=$.bias,B.shadowNormalBias=$.normalBias,B.shadowRadius=$.radius,B.shadowMapSize=$.mapSize,i.spotShadow[v]=B,i.spotShadowMap[v]=F,M++}v++}else if(E.isRectAreaLight){const H=t.get(E);H.color.copy(R).multiplyScalar(P),H.halfWidth.set(E.width*.5,0,0),H.halfHeight.set(0,E.height*.5,0),i.rectArea[g]=H,g++}else if(E.isPointLight){const H=t.get(E);if(H.color.copy(E.color).multiplyScalar(E.intensity),H.distance=E.distance,H.decay=E.decay,E.castShadow){const $=E.shadow,B=e.get(E);B.shadowIntensity=$.intensity,B.shadowBias=$.bias,B.shadowNormalBias=$.normalBias,B.shadowRadius=$.radius,B.shadowMapSize=$.mapSize,B.shadowCameraNear=$.camera.near,B.shadowCameraFar=$.camera.far,i.pointShadow[m]=B,i.pointShadowMap[m]=F,i.pointShadowMatrix[m]=E.shadow.matrix,x++}i.point[m]=H,m++}else if(E.isHemisphereLight){const H=t.get(E);H.skyColor.copy(E.color).multiplyScalar(P),H.groundColor.copy(E.groundColor).multiplyScalar(P),i.hemi[p]=H,p++}}g>0&&(n.has("OES_texture_float_linear")===!0?(i.rectAreaLTC1=Lt.LTC_FLOAT_1,i.rectAreaLTC2=Lt.LTC_FLOAT_2):(i.rectAreaLTC1=Lt.LTC_HALF_1,i.rectAreaLTC2=Lt.LTC_HALF_2)),i.ambient[0]=h,i.ambient[1]=u,i.ambient[2]=f;const A=i.hash;(A.directionalLength!==d||A.pointLength!==m||A.spotLength!==v||A.rectAreaLength!==g||A.hemiLength!==p||A.numDirectionalShadows!==_||A.numPointShadows!==x||A.numSpotShadows!==M||A.numSpotMaps!==w||A.numLightProbes!==T)&&(i.directional.length=d,i.spot.length=v,i.rectArea.length=g,i.point.length=m,i.hemi.length=p,i.directionalShadow.length=_,i.directionalShadowMap.length=_,i.pointShadow.length=x,i.pointShadowMap.length=x,i.spotShadow.length=M,i.spotShadowMap.length=M,i.directionalShadowMatrix.length=_,i.pointShadowMatrix.length=x,i.spotLightMatrix.length=M+w-S,i.spotLightMap.length=w,i.numSpotLightShadowsWithMaps=S,i.numLightProbes=T,A.directionalLength=d,A.pointLength=m,A.spotLength=v,A.rectAreaLength=g,A.hemiLength=p,A.numDirectionalShadows=_,A.numPointShadows=x,A.numSpotShadows=M,A.numSpotMaps=w,A.numLightProbes=T,i.version=ny++)}function c(l,h){let u=0,f=0,d=0,m=0,v=0;const g=h.matrixWorldInverse;for(let p=0,_=l.length;p<_;p++){const x=l[p];if(x.isDirectionalLight){const M=i.directional[u];M.direction.setFromMatrixPosition(x.matrixWorld),s.setFromMatrixPosition(x.target.matrixWorld),M.direction.sub(s),M.direction.transformDirection(g),u++}else if(x.isSpotLight){const M=i.spot[d];M.position.setFromMatrixPosition(x.matrixWorld),M.position.applyMatrix4(g),M.direction.setFromMatrixPosition(x.matrixWorld),s.setFromMatrixPosition(x.target.matrixWorld),M.direction.sub(s),M.direction.transformDirection(g),d++}else if(x.isRectAreaLight){const M=i.rectArea[m];M.position.setFromMatrixPosition(x.matrixWorld),M.position.applyMatrix4(g),a.identity(),r.copy(x.matrixWorld),r.premultiply(g),a.extractRotation(r),M.halfWidth.set(x.width*.5,0,0),M.halfHeight.set(0,x.height*.5,0),M.halfWidth.applyMatrix4(a),M.halfHeight.applyMatrix4(a),m++}else if(x.isPointLight){const M=i.point[f];M.position.setFromMatrixPosition(x.matrixWorld),M.position.applyMatrix4(g),f++}else if(x.isHemisphereLight){const M=i.hemi[v];M.direction.setFromMatrixPosition(x.matrixWorld),M.direction.transformDirection(g),v++}}}return{setup:o,setupView:c,state:i}}function tp(n){const t=new sy(n),e=[],i=[];function s(h){l.camera=h,e.length=0,i.length=0}function r(h){e.push(h)}function a(h){i.push(h)}function o(){t.setup(e)}function c(h){t.setupView(e,h)}const l={lightsArray:e,shadowsArray:i,camera:null,lights:t,transmissionRenderTarget:{}};return{init:s,state:l,setupLights:o,setupLightsView:c,pushLight:r,pushShadow:a}}function ry(n){let t=new WeakMap;function e(s,r=0){const a=t.get(s);let o;return a===void 0?(o=new tp(n),t.set(s,[o])):r>=a.length?(o=new tp(n),a.push(o)):o=a[r],o}function i(){t=new WeakMap}return{get:e,dispose:i}}const ay=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,oy=`uniform sampler2D shadow_pass;
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
}`;function cy(n,t,e){let i=new Vf;const s=new ft,r=new ft,a=new de,o=new RM({depthPacking:zx}),c=new CM,l={},h=e.maxTextureSize,u={[ir]:Fn,[Fn]:ir,[Se]:Se},f=new en({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new ft},radius:{value:4}},vertexShader:ay,fragmentShader:oy}),d=f.clone();d.defines.HORIZONTAL_PASS=1;const m=new xe;m.setAttribute("position",new $t(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const v=new nt(m,f),g=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=$m;let p=this.type;this.render=function(S,T,A){if(g.enabled===!1||g.autoUpdate===!1&&g.needsUpdate===!1||S.length===0)return;const b=n.getRenderTarget(),y=n.getActiveCubeFace(),E=n.getActiveMipmapLevel(),R=n.state;R.setBlending(Ks),R.buffers.depth.getReversed()===!0?R.buffers.color.setClear(0,0,0,0):R.buffers.color.setClear(1,1,1,1),R.buffers.depth.setTest(!0),R.setScissorTest(!1);const P=p!==vs&&this.type===vs,I=p===vs&&this.type!==vs;for(let F=0,H=S.length;F<H;F++){const $=S[F],B=$.shadow;if(B===void 0){console.warn("THREE.WebGLShadowMap:",$,"has no shadow.");continue}if(B.autoUpdate===!1&&B.needsUpdate===!1)continue;s.copy(B.mapSize);const Y=B.getFrameExtents();if(s.multiply(Y),r.copy(B.mapSize),(s.x>h||s.y>h)&&(s.x>h&&(r.x=Math.floor(h/Y.x),s.x=r.x*Y.x,B.mapSize.x=r.x),s.y>h&&(r.y=Math.floor(h/Y.y),s.y=r.y*Y.y,B.mapSize.y=r.y)),B.map===null||P===!0||I===!0){const mt=this.type!==vs?{minFilter:ni,magFilter:ni}:{};B.map!==null&&B.map.dispose(),B.map=new yn(s.x,s.y,mt),B.map.texture.name=$.name+".shadowMap",B.camera.updateProjectionMatrix()}n.setRenderTarget(B.map),n.clear();const it=B.getViewportCount();for(let mt=0;mt<it;mt++){const vt=B.getViewport(mt);a.set(r.x*vt.x,r.y*vt.y,r.x*vt.z,r.y*vt.w),R.viewport(a),B.updateMatrices($,mt),i=B.getFrustum(),M(T,A,B.camera,$,this.type)}B.isPointLightShadow!==!0&&this.type===vs&&_(B,A),B.needsUpdate=!1}p=this.type,g.needsUpdate=!1,n.setRenderTarget(b,y,E)};function _(S,T){const A=t.update(v);f.defines.VSM_SAMPLES!==S.blurSamples&&(f.defines.VSM_SAMPLES=S.blurSamples,d.defines.VSM_SAMPLES=S.blurSamples,f.needsUpdate=!0,d.needsUpdate=!0),S.mapPass===null&&(S.mapPass=new yn(s.x,s.y)),f.uniforms.shadow_pass.value=S.map.texture,f.uniforms.resolution.value=S.mapSize,f.uniforms.radius.value=S.radius,n.setRenderTarget(S.mapPass),n.clear(),n.renderBufferDirect(T,null,A,f,v,null),d.uniforms.shadow_pass.value=S.mapPass.texture,d.uniforms.resolution.value=S.mapSize,d.uniforms.radius.value=S.radius,n.setRenderTarget(S.map),n.clear(),n.renderBufferDirect(T,null,A,d,v,null)}function x(S,T,A,b){let y=null;const E=A.isPointLight===!0?S.customDistanceMaterial:S.customDepthMaterial;if(E!==void 0)y=E;else if(y=A.isPointLight===!0?c:o,n.localClippingEnabled&&T.clipShadows===!0&&Array.isArray(T.clippingPlanes)&&T.clippingPlanes.length!==0||T.displacementMap&&T.displacementScale!==0||T.alphaMap&&T.alphaTest>0||T.map&&T.alphaTest>0||T.alphaToCoverage===!0){const R=y.uuid,P=T.uuid;let I=l[R];I===void 0&&(I={},l[R]=I);let F=I[P];F===void 0&&(F=y.clone(),I[P]=F,T.addEventListener("dispose",w)),y=F}if(y.visible=T.visible,y.wireframe=T.wireframe,b===vs?y.side=T.shadowSide!==null?T.shadowSide:T.side:y.side=T.shadowSide!==null?T.shadowSide:u[T.side],y.alphaMap=T.alphaMap,y.alphaTest=T.alphaToCoverage===!0?.5:T.alphaTest,y.map=T.map,y.clipShadows=T.clipShadows,y.clippingPlanes=T.clippingPlanes,y.clipIntersection=T.clipIntersection,y.displacementMap=T.displacementMap,y.displacementScale=T.displacementScale,y.displacementBias=T.displacementBias,y.wireframeLinewidth=T.wireframeLinewidth,y.linewidth=T.linewidth,A.isPointLight===!0&&y.isMeshDistanceMaterial===!0){const R=n.properties.get(y);R.light=A}return y}function M(S,T,A,b,y){if(S.visible===!1)return;if(S.layers.test(T.layers)&&(S.isMesh||S.isLine||S.isPoints)&&(S.castShadow||S.receiveShadow&&y===vs)&&(!S.frustumCulled||i.intersectsObject(S))){S.modelViewMatrix.multiplyMatrices(A.matrixWorldInverse,S.matrixWorld);const P=t.update(S),I=S.material;if(Array.isArray(I)){const F=P.groups;for(let H=0,$=F.length;H<$;H++){const B=F[H],Y=I[B.materialIndex];if(Y&&Y.visible){const it=x(S,Y,b,y);S.onBeforeShadow(n,S,T,A,P,it,B),n.renderBufferDirect(A,null,P,it,S,B),S.onAfterShadow(n,S,T,A,P,it,B)}}}else if(I.visible){const F=x(S,I,b,y);S.onBeforeShadow(n,S,T,A,P,F,null),n.renderBufferDirect(A,null,P,F,S,null),S.onAfterShadow(n,S,T,A,P,F,null)}}const R=S.children;for(let P=0,I=R.length;P<I;P++)M(R[P],T,A,b,y)}function w(S){S.target.removeEventListener("dispose",w);for(const A in l){const b=l[A],y=S.target.uuid;y in b&&(b[y].dispose(),delete b[y])}}}const ly={[nu]:iu,[su]:ou,[ru]:cu,[eo]:au,[iu]:nu,[ou]:su,[cu]:ru,[au]:eo};function hy(n,t){function e(){let q=!1;const Tt=new de;let Rt=null;const kt=new de(0,0,0,0);return{setMask:function(yt){Rt!==yt&&!q&&(n.colorMask(yt,yt,yt,yt),Rt=yt)},setLocked:function(yt){q=yt},setClear:function(yt,xt,zt,se,Te){Te===!0&&(yt*=se,xt*=se,zt*=se),Tt.set(yt,xt,zt,se),kt.equals(Tt)===!1&&(n.clearColor(yt,xt,zt,se),kt.copy(Tt))},reset:function(){q=!1,Rt=null,kt.set(-1,0,0,0)}}}function i(){let q=!1,Tt=!1,Rt=null,kt=null,yt=null;return{setReversed:function(xt){if(Tt!==xt){const zt=t.get("EXT_clip_control");xt?zt.clipControlEXT(zt.LOWER_LEFT_EXT,zt.ZERO_TO_ONE_EXT):zt.clipControlEXT(zt.LOWER_LEFT_EXT,zt.NEGATIVE_ONE_TO_ONE_EXT),Tt=xt;const se=yt;yt=null,this.setClear(se)}},getReversed:function(){return Tt},setTest:function(xt){xt?X(n.DEPTH_TEST):z(n.DEPTH_TEST)},setMask:function(xt){Rt!==xt&&!q&&(n.depthMask(xt),Rt=xt)},setFunc:function(xt){if(Tt&&(xt=ly[xt]),kt!==xt){switch(xt){case nu:n.depthFunc(n.NEVER);break;case iu:n.depthFunc(n.ALWAYS);break;case su:n.depthFunc(n.LESS);break;case eo:n.depthFunc(n.LEQUAL);break;case ru:n.depthFunc(n.EQUAL);break;case au:n.depthFunc(n.GEQUAL);break;case ou:n.depthFunc(n.GREATER);break;case cu:n.depthFunc(n.NOTEQUAL);break;default:n.depthFunc(n.LEQUAL)}kt=xt}},setLocked:function(xt){q=xt},setClear:function(xt){yt!==xt&&(Tt&&(xt=1-xt),n.clearDepth(xt),yt=xt)},reset:function(){q=!1,Rt=null,kt=null,yt=null,Tt=!1}}}function s(){let q=!1,Tt=null,Rt=null,kt=null,yt=null,xt=null,zt=null,se=null,Te=null;return{setTest:function(_e){q||(_e?X(n.STENCIL_TEST):z(n.STENCIL_TEST))},setMask:function(_e){Tt!==_e&&!q&&(n.stencilMask(_e),Tt=_e)},setFunc:function(_e,ls,Hi){(Rt!==_e||kt!==ls||yt!==Hi)&&(n.stencilFunc(_e,ls,Hi),Rt=_e,kt=ls,yt=Hi)},setOp:function(_e,ls,Hi){(xt!==_e||zt!==ls||se!==Hi)&&(n.stencilOp(_e,ls,Hi),xt=_e,zt=ls,se=Hi)},setLocked:function(_e){q=_e},setClear:function(_e){Te!==_e&&(n.clearStencil(_e),Te=_e)},reset:function(){q=!1,Tt=null,Rt=null,kt=null,yt=null,xt=null,zt=null,se=null,Te=null}}}const r=new e,a=new i,o=new s,c=new WeakMap,l=new WeakMap;let h={},u={},f=new WeakMap,d=[],m=null,v=!1,g=null,p=null,_=null,x=null,M=null,w=null,S=null,T=new gt(0,0,0),A=0,b=!1,y=null,E=null,R=null,P=null,I=null;const F=n.getParameter(n.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let H=!1,$=0;const B=n.getParameter(n.VERSION);B.indexOf("WebGL")!==-1?($=parseFloat(/^WebGL (\d)/.exec(B)[1]),H=$>=1):B.indexOf("OpenGL ES")!==-1&&($=parseFloat(/^OpenGL ES (\d)/.exec(B)[1]),H=$>=2);let Y=null,it={};const mt=n.getParameter(n.SCISSOR_BOX),vt=n.getParameter(n.VIEWPORT),St=new de().fromArray(mt),Ct=new de().fromArray(vt);function Ut(q,Tt,Rt,kt){const yt=new Uint8Array(4),xt=n.createTexture();n.bindTexture(q,xt),n.texParameteri(q,n.TEXTURE_MIN_FILTER,n.NEAREST),n.texParameteri(q,n.TEXTURE_MAG_FILTER,n.NEAREST);for(let zt=0;zt<Rt;zt++)q===n.TEXTURE_3D||q===n.TEXTURE_2D_ARRAY?n.texImage3D(Tt,0,n.RGBA,1,1,kt,0,n.RGBA,n.UNSIGNED_BYTE,yt):n.texImage2D(Tt+zt,0,n.RGBA,1,1,0,n.RGBA,n.UNSIGNED_BYTE,yt);return xt}const V={};V[n.TEXTURE_2D]=Ut(n.TEXTURE_2D,n.TEXTURE_2D,1),V[n.TEXTURE_CUBE_MAP]=Ut(n.TEXTURE_CUBE_MAP,n.TEXTURE_CUBE_MAP_POSITIVE_X,6),V[n.TEXTURE_2D_ARRAY]=Ut(n.TEXTURE_2D_ARRAY,n.TEXTURE_2D_ARRAY,1,1),V[n.TEXTURE_3D]=Ut(n.TEXTURE_3D,n.TEXTURE_3D,1,1),r.setClear(0,0,0,1),a.setClear(1),o.setClear(0),X(n.DEPTH_TEST),a.setFunc(eo),st(!1),ht(Gd),X(n.CULL_FACE),et(Ks);function X(q){h[q]!==!0&&(n.enable(q),h[q]=!0)}function z(q){h[q]!==!1&&(n.disable(q),h[q]=!1)}function W(q,Tt){return u[q]!==Tt?(n.bindFramebuffer(q,Tt),u[q]=Tt,q===n.DRAW_FRAMEBUFFER&&(u[n.FRAMEBUFFER]=Tt),q===n.FRAMEBUFFER&&(u[n.DRAW_FRAMEBUFFER]=Tt),!0):!1}function G(q,Tt){let Rt=d,kt=!1;if(q){Rt=f.get(Tt),Rt===void 0&&(Rt=[],f.set(Tt,Rt));const yt=q.textures;if(Rt.length!==yt.length||Rt[0]!==n.COLOR_ATTACHMENT0){for(let xt=0,zt=yt.length;xt<zt;xt++)Rt[xt]=n.COLOR_ATTACHMENT0+xt;Rt.length=yt.length,kt=!0}}else Rt[0]!==n.BACK&&(Rt[0]=n.BACK,kt=!0);kt&&n.drawBuffers(Rt)}function tt(q){return m!==q?(n.useProgram(q),m=q,!0):!1}const at={[wr]:n.FUNC_ADD,[mx]:n.FUNC_SUBTRACT,[gx]:n.FUNC_REVERSE_SUBTRACT};at[vx]=n.MIN,at[xx]=n.MAX;const N={[Zm]:n.ZERO,[_x]:n.ONE,[Jm]:n.SRC_COLOR,[tu]:n.SRC_ALPHA,[Ex]:n.SRC_ALPHA_SATURATE,[yx]:n.DST_COLOR,[bx]:n.DST_ALPHA,[Mx]:n.ONE_MINUS_SRC_COLOR,[eu]:n.ONE_MINUS_SRC_ALPHA,[Sx]:n.ONE_MINUS_DST_COLOR,[wx]:n.ONE_MINUS_DST_ALPHA,[Tx]:n.CONSTANT_COLOR,[Ax]:n.ONE_MINUS_CONSTANT_COLOR,[Rx]:n.CONSTANT_ALPHA,[Cx]:n.ONE_MINUS_CONSTANT_ALPHA};function et(q,Tt,Rt,kt,yt,xt,zt,se,Te,_e){if(q===Ks){v===!0&&(z(n.BLEND),v=!1);return}if(v===!1&&(X(n.BLEND),v=!0),q!==jm){if(q!==g||_e!==b){if((p!==wr||M!==wr)&&(n.blendEquation(n.FUNC_ADD),p=wr,M=wr),_e)switch(q){case za:n.blendFuncSeparate(n.ONE,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case Or:n.blendFunc(n.ONE,n.ONE);break;case Wd:n.blendFuncSeparate(n.ZERO,n.ONE_MINUS_SRC_COLOR,n.ZERO,n.ONE);break;case Xd:n.blendFuncSeparate(n.DST_COLOR,n.ONE_MINUS_SRC_ALPHA,n.ZERO,n.ONE);break;default:console.error("THREE.WebGLState: Invalid blending: ",q);break}else switch(q){case za:n.blendFuncSeparate(n.SRC_ALPHA,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case Or:n.blendFuncSeparate(n.SRC_ALPHA,n.ONE,n.ONE,n.ONE);break;case Wd:console.error("THREE.WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case Xd:console.error("THREE.WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:console.error("THREE.WebGLState: Invalid blending: ",q);break}_=null,x=null,w=null,S=null,T.set(0,0,0),A=0,g=q,b=_e}return}yt=yt||Tt,xt=xt||Rt,zt=zt||kt,(Tt!==p||yt!==M)&&(n.blendEquationSeparate(at[Tt],at[yt]),p=Tt,M=yt),(Rt!==_||kt!==x||xt!==w||zt!==S)&&(n.blendFuncSeparate(N[Rt],N[kt],N[xt],N[zt]),_=Rt,x=kt,w=xt,S=zt),(se.equals(T)===!1||Te!==A)&&(n.blendColor(se.r,se.g,se.b,Te),T.copy(se),A=Te),g=q,b=!1}function Q(q,Tt){q.side===Se?z(n.CULL_FACE):X(n.CULL_FACE);let Rt=q.side===Fn;Tt&&(Rt=!Rt),st(Rt),q.blending===za&&q.transparent===!1?et(Ks):et(q.blending,q.blendEquation,q.blendSrc,q.blendDst,q.blendEquationAlpha,q.blendSrcAlpha,q.blendDstAlpha,q.blendColor,q.blendAlpha,q.premultipliedAlpha),a.setFunc(q.depthFunc),a.setTest(q.depthTest),a.setMask(q.depthWrite),r.setMask(q.colorWrite);const kt=q.stencilWrite;o.setTest(kt),kt&&(o.setMask(q.stencilWriteMask),o.setFunc(q.stencilFunc,q.stencilRef,q.stencilFuncMask),o.setOp(q.stencilFail,q.stencilZFail,q.stencilZPass)),_t(q.polygonOffset,q.polygonOffsetFactor,q.polygonOffsetUnits),q.alphaToCoverage===!0?X(n.SAMPLE_ALPHA_TO_COVERAGE):z(n.SAMPLE_ALPHA_TO_COVERAGE)}function st(q){y!==q&&(q?n.frontFace(n.CW):n.frontFace(n.CCW),y=q)}function ht(q){q!==dx?(X(n.CULL_FACE),q!==E&&(q===Gd?n.cullFace(n.BACK):q===px?n.cullFace(n.FRONT):n.cullFace(n.FRONT_AND_BACK))):z(n.CULL_FACE),E=q}function pt(q){q!==R&&(H&&n.lineWidth(q),R=q)}function _t(q,Tt,Rt){q?(X(n.POLYGON_OFFSET_FILL),(P!==Tt||I!==Rt)&&(n.polygonOffset(Tt,Rt),P=Tt,I=Rt)):z(n.POLYGON_OFFSET_FILL)}function bt(q){q?X(n.SCISSOR_TEST):z(n.SCISSOR_TEST)}function ee(q){q===void 0&&(q=n.TEXTURE0+F-1),Y!==q&&(n.activeTexture(q),Y=q)}function Kt(q,Tt,Rt){Rt===void 0&&(Y===null?Rt=n.TEXTURE0+F-1:Rt=Y);let kt=it[Rt];kt===void 0&&(kt={type:void 0,texture:void 0},it[Rt]=kt),(kt.type!==q||kt.texture!==Tt)&&(Y!==Rt&&(n.activeTexture(Rt),Y=Rt),n.bindTexture(q,Tt||V[q]),kt.type=q,kt.texture=Tt)}function k(){const q=it[Y];q!==void 0&&q.type!==void 0&&(n.bindTexture(q.type,null),q.type=void 0,q.texture=void 0)}function L(){try{n.compressedTexImage2D(...arguments)}catch(q){console.error("THREE.WebGLState:",q)}}function J(){try{n.compressedTexImage3D(...arguments)}catch(q){console.error("THREE.WebGLState:",q)}}function ut(){try{n.texSubImage2D(...arguments)}catch(q){console.error("THREE.WebGLState:",q)}}function Mt(){try{n.texSubImage3D(...arguments)}catch(q){console.error("THREE.WebGLState:",q)}}function dt(){try{n.compressedTexSubImage2D(...arguments)}catch(q){console.error("THREE.WebGLState:",q)}}function Vt(){try{n.compressedTexSubImage3D(...arguments)}catch(q){console.error("THREE.WebGLState:",q)}}function At(){try{n.texStorage2D(...arguments)}catch(q){console.error("THREE.WebGLState:",q)}}function Bt(){try{n.texStorage3D(...arguments)}catch(q){console.error("THREE.WebGLState:",q)}}function Ht(){try{n.texImage2D(...arguments)}catch(q){console.error("THREE.WebGLState:",q)}}function wt(){try{n.texImage3D(...arguments)}catch(q){console.error("THREE.WebGLState:",q)}}function Nt(q){St.equals(q)===!1&&(n.scissor(q.x,q.y,q.z,q.w),St.copy(q))}function Qt(q){Ct.equals(q)===!1&&(n.viewport(q.x,q.y,q.z,q.w),Ct.copy(q))}function Gt(q,Tt){let Rt=l.get(Tt);Rt===void 0&&(Rt=new WeakMap,l.set(Tt,Rt));let kt=Rt.get(q);kt===void 0&&(kt=n.getUniformBlockIndex(Tt,q.name),Rt.set(q,kt))}function It(q,Tt){const kt=l.get(Tt).get(q);c.get(Tt)!==kt&&(n.uniformBlockBinding(Tt,kt,q.__bindingPointIndex),c.set(Tt,kt))}function ae(){n.disable(n.BLEND),n.disable(n.CULL_FACE),n.disable(n.DEPTH_TEST),n.disable(n.POLYGON_OFFSET_FILL),n.disable(n.SCISSOR_TEST),n.disable(n.STENCIL_TEST),n.disable(n.SAMPLE_ALPHA_TO_COVERAGE),n.blendEquation(n.FUNC_ADD),n.blendFunc(n.ONE,n.ZERO),n.blendFuncSeparate(n.ONE,n.ZERO,n.ONE,n.ZERO),n.blendColor(0,0,0,0),n.colorMask(!0,!0,!0,!0),n.clearColor(0,0,0,0),n.depthMask(!0),n.depthFunc(n.LESS),a.setReversed(!1),n.clearDepth(1),n.stencilMask(4294967295),n.stencilFunc(n.ALWAYS,0,4294967295),n.stencilOp(n.KEEP,n.KEEP,n.KEEP),n.clearStencil(0),n.cullFace(n.BACK),n.frontFace(n.CCW),n.polygonOffset(0,0),n.activeTexture(n.TEXTURE0),n.bindFramebuffer(n.FRAMEBUFFER,null),n.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),n.bindFramebuffer(n.READ_FRAMEBUFFER,null),n.useProgram(null),n.lineWidth(1),n.scissor(0,0,n.canvas.width,n.canvas.height),n.viewport(0,0,n.canvas.width,n.canvas.height),h={},Y=null,it={},u={},f=new WeakMap,d=[],m=null,v=!1,g=null,p=null,_=null,x=null,M=null,w=null,S=null,T=new gt(0,0,0),A=0,b=!1,y=null,E=null,R=null,P=null,I=null,St.set(0,0,n.canvas.width,n.canvas.height),Ct.set(0,0,n.canvas.width,n.canvas.height),r.reset(),a.reset(),o.reset()}return{buffers:{color:r,depth:a,stencil:o},enable:X,disable:z,bindFramebuffer:W,drawBuffers:G,useProgram:tt,setBlending:et,setMaterial:Q,setFlipSided:st,setCullFace:ht,setLineWidth:pt,setPolygonOffset:_t,setScissorTest:bt,activeTexture:ee,bindTexture:Kt,unbindTexture:k,compressedTexImage2D:L,compressedTexImage3D:J,texImage2D:Ht,texImage3D:wt,updateUBOMapping:Gt,uniformBlockBinding:It,texStorage2D:At,texStorage3D:Bt,texSubImage2D:ut,texSubImage3D:Mt,compressedTexSubImage2D:dt,compressedTexSubImage3D:Vt,scissor:Nt,viewport:Qt,reset:ae}}function uy(n,t,e,i,s,r,a){const o=t.has("WEBGL_multisampled_render_to_texture")?t.get("WEBGL_multisampled_render_to_texture"):null,c=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),l=new ft,h=new WeakMap;let u;const f=new WeakMap;let d=!1;try{d=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function m(k,L){return d?new OffscreenCanvas(k,L):ql("canvas")}function v(k,L,J){let ut=1;const Mt=Kt(k);if((Mt.width>J||Mt.height>J)&&(ut=J/Math.max(Mt.width,Mt.height)),ut<1)if(typeof HTMLImageElement<"u"&&k instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&k instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&k instanceof ImageBitmap||typeof VideoFrame<"u"&&k instanceof VideoFrame){const dt=Math.floor(ut*Mt.width),Vt=Math.floor(ut*Mt.height);u===void 0&&(u=m(dt,Vt));const At=L?m(dt,Vt):u;return At.width=dt,At.height=Vt,At.getContext("2d").drawImage(k,0,0,dt,Vt),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+Mt.width+"x"+Mt.height+") to ("+dt+"x"+Vt+")."),At}else return"data"in k&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+Mt.width+"x"+Mt.height+")."),k;return k}function g(k){return k.generateMipmaps}function p(k){n.generateMipmap(k)}function _(k){return k.isWebGLCubeRenderTarget?n.TEXTURE_CUBE_MAP:k.isWebGL3DRenderTarget?n.TEXTURE_3D:k.isWebGLArrayRenderTarget||k.isCompressedArrayTexture?n.TEXTURE_2D_ARRAY:n.TEXTURE_2D}function x(k,L,J,ut,Mt=!1){if(k!==null){if(n[k]!==void 0)return n[k];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+k+"'")}let dt=L;if(L===n.RED&&(J===n.FLOAT&&(dt=n.R32F),J===n.HALF_FLOAT&&(dt=n.R16F),J===n.UNSIGNED_BYTE&&(dt=n.R8)),L===n.RED_INTEGER&&(J===n.UNSIGNED_BYTE&&(dt=n.R8UI),J===n.UNSIGNED_SHORT&&(dt=n.R16UI),J===n.UNSIGNED_INT&&(dt=n.R32UI),J===n.BYTE&&(dt=n.R8I),J===n.SHORT&&(dt=n.R16I),J===n.INT&&(dt=n.R32I)),L===n.RG&&(J===n.FLOAT&&(dt=n.RG32F),J===n.HALF_FLOAT&&(dt=n.RG16F),J===n.UNSIGNED_BYTE&&(dt=n.RG8)),L===n.RG_INTEGER&&(J===n.UNSIGNED_BYTE&&(dt=n.RG8UI),J===n.UNSIGNED_SHORT&&(dt=n.RG16UI),J===n.UNSIGNED_INT&&(dt=n.RG32UI),J===n.BYTE&&(dt=n.RG8I),J===n.SHORT&&(dt=n.RG16I),J===n.INT&&(dt=n.RG32I)),L===n.RGB_INTEGER&&(J===n.UNSIGNED_BYTE&&(dt=n.RGB8UI),J===n.UNSIGNED_SHORT&&(dt=n.RGB16UI),J===n.UNSIGNED_INT&&(dt=n.RGB32UI),J===n.BYTE&&(dt=n.RGB8I),J===n.SHORT&&(dt=n.RGB16I),J===n.INT&&(dt=n.RGB32I)),L===n.RGBA_INTEGER&&(J===n.UNSIGNED_BYTE&&(dt=n.RGBA8UI),J===n.UNSIGNED_SHORT&&(dt=n.RGBA16UI),J===n.UNSIGNED_INT&&(dt=n.RGBA32UI),J===n.BYTE&&(dt=n.RGBA8I),J===n.SHORT&&(dt=n.RGBA16I),J===n.INT&&(dt=n.RGBA32I)),L===n.RGB&&(J===n.UNSIGNED_INT_5_9_9_9_REV&&(dt=n.RGB9_E5),J===n.UNSIGNED_INT_10F_11F_11F_REV&&(dt=n.R11F_G11F_B10F)),L===n.RGBA){const Vt=Mt?Wl:ge.getTransfer(ut);J===n.FLOAT&&(dt=n.RGBA32F),J===n.HALF_FLOAT&&(dt=n.RGBA16F),J===n.UNSIGNED_BYTE&&(dt=Vt===we?n.SRGB8_ALPHA8:n.RGBA8),J===n.UNSIGNED_SHORT_4_4_4_4&&(dt=n.RGBA4),J===n.UNSIGNED_SHORT_5_5_5_1&&(dt=n.RGB5_A1)}return(dt===n.R16F||dt===n.R32F||dt===n.RG16F||dt===n.RG32F||dt===n.RGBA16F||dt===n.RGBA32F)&&t.get("EXT_color_buffer_float"),dt}function M(k,L){let J;return k?L===null||L===Br||L===nc?J=n.DEPTH24_STENCIL8:L===es?J=n.DEPTH32F_STENCIL8:L===ec&&(J=n.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):L===null||L===Br||L===nc?J=n.DEPTH_COMPONENT24:L===es?J=n.DEPTH_COMPONENT32F:L===ec&&(J=n.DEPTH_COMPONENT16),J}function w(k,L){return g(k)===!0||k.isFramebufferTexture&&k.minFilter!==ni&&k.minFilter!==Ie?Math.log2(Math.max(L.width,L.height))+1:k.mipmaps!==void 0&&k.mipmaps.length>0?k.mipmaps.length:k.isCompressedTexture&&Array.isArray(k.image)?L.mipmaps.length:1}function S(k){const L=k.target;L.removeEventListener("dispose",S),A(L),L.isVideoTexture&&h.delete(L)}function T(k){const L=k.target;L.removeEventListener("dispose",T),y(L)}function A(k){const L=i.get(k);if(L.__webglInit===void 0)return;const J=k.source,ut=f.get(J);if(ut){const Mt=ut[L.__cacheKey];Mt.usedTimes--,Mt.usedTimes===0&&b(k),Object.keys(ut).length===0&&f.delete(J)}i.remove(k)}function b(k){const L=i.get(k);n.deleteTexture(L.__webglTexture);const J=k.source,ut=f.get(J);delete ut[L.__cacheKey],a.memory.textures--}function y(k){const L=i.get(k);if(k.depthTexture&&(k.depthTexture.dispose(),i.remove(k.depthTexture)),k.isWebGLCubeRenderTarget)for(let ut=0;ut<6;ut++){if(Array.isArray(L.__webglFramebuffer[ut]))for(let Mt=0;Mt<L.__webglFramebuffer[ut].length;Mt++)n.deleteFramebuffer(L.__webglFramebuffer[ut][Mt]);else n.deleteFramebuffer(L.__webglFramebuffer[ut]);L.__webglDepthbuffer&&n.deleteRenderbuffer(L.__webglDepthbuffer[ut])}else{if(Array.isArray(L.__webglFramebuffer))for(let ut=0;ut<L.__webglFramebuffer.length;ut++)n.deleteFramebuffer(L.__webglFramebuffer[ut]);else n.deleteFramebuffer(L.__webglFramebuffer);if(L.__webglDepthbuffer&&n.deleteRenderbuffer(L.__webglDepthbuffer),L.__webglMultisampledFramebuffer&&n.deleteFramebuffer(L.__webglMultisampledFramebuffer),L.__webglColorRenderbuffer)for(let ut=0;ut<L.__webglColorRenderbuffer.length;ut++)L.__webglColorRenderbuffer[ut]&&n.deleteRenderbuffer(L.__webglColorRenderbuffer[ut]);L.__webglDepthRenderbuffer&&n.deleteRenderbuffer(L.__webglDepthRenderbuffer)}const J=k.textures;for(let ut=0,Mt=J.length;ut<Mt;ut++){const dt=i.get(J[ut]);dt.__webglTexture&&(n.deleteTexture(dt.__webglTexture),a.memory.textures--),i.remove(J[ut])}i.remove(k)}let E=0;function R(){E=0}function P(){const k=E;return k>=s.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+k+" texture units while this GPU supports only "+s.maxTextures),E+=1,k}function I(k){const L=[];return L.push(k.wrapS),L.push(k.wrapT),L.push(k.wrapR||0),L.push(k.magFilter),L.push(k.minFilter),L.push(k.anisotropy),L.push(k.internalFormat),L.push(k.format),L.push(k.type),L.push(k.generateMipmaps),L.push(k.premultiplyAlpha),L.push(k.flipY),L.push(k.unpackAlignment),L.push(k.colorSpace),L.join()}function F(k,L){const J=i.get(k);if(k.isVideoTexture&&bt(k),k.isRenderTargetTexture===!1&&k.isExternalTexture!==!0&&k.version>0&&J.__version!==k.version){const ut=k.image;if(ut===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(ut.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{V(J,k,L);return}}else k.isExternalTexture&&(J.__webglTexture=k.sourceTexture?k.sourceTexture:null);e.bindTexture(n.TEXTURE_2D,J.__webglTexture,n.TEXTURE0+L)}function H(k,L){const J=i.get(k);if(k.isRenderTargetTexture===!1&&k.version>0&&J.__version!==k.version){V(J,k,L);return}e.bindTexture(n.TEXTURE_2D_ARRAY,J.__webglTexture,n.TEXTURE0+L)}function $(k,L){const J=i.get(k);if(k.isRenderTargetTexture===!1&&k.version>0&&J.__version!==k.version){V(J,k,L);return}e.bindTexture(n.TEXTURE_3D,J.__webglTexture,n.TEXTURE0+L)}function B(k,L){const J=i.get(k);if(k.version>0&&J.__version!==k.version){X(J,k,L);return}e.bindTexture(n.TEXTURE_CUBE_MAP,J.__webglTexture,n.TEXTURE0+L)}const Y={[so]:n.REPEAT,[Sr]:n.CLAMP_TO_EDGE,[hu]:n.MIRRORED_REPEAT},it={[ni]:n.NEAREST,[Bx]:n.NEAREST_MIPMAP_NEAREST,[Pc]:n.NEAREST_MIPMAP_LINEAR,[Ie]:n.LINEAR,[Ih]:n.LINEAR_MIPMAP_NEAREST,[$s]:n.LINEAR_MIPMAP_LINEAR},mt={[Gx]:n.NEVER,[jx]:n.ALWAYS,[Wx]:n.LESS,[hg]:n.LEQUAL,[Xx]:n.EQUAL,[Yx]:n.GEQUAL,[qx]:n.GREATER,[$x]:n.NOTEQUAL};function vt(k,L){if(L.type===es&&t.has("OES_texture_float_linear")===!1&&(L.magFilter===Ie||L.magFilter===Ih||L.magFilter===Pc||L.magFilter===$s||L.minFilter===Ie||L.minFilter===Ih||L.minFilter===Pc||L.minFilter===$s)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),n.texParameteri(k,n.TEXTURE_WRAP_S,Y[L.wrapS]),n.texParameteri(k,n.TEXTURE_WRAP_T,Y[L.wrapT]),(k===n.TEXTURE_3D||k===n.TEXTURE_2D_ARRAY)&&n.texParameteri(k,n.TEXTURE_WRAP_R,Y[L.wrapR]),n.texParameteri(k,n.TEXTURE_MAG_FILTER,it[L.magFilter]),n.texParameteri(k,n.TEXTURE_MIN_FILTER,it[L.minFilter]),L.compareFunction&&(n.texParameteri(k,n.TEXTURE_COMPARE_MODE,n.COMPARE_REF_TO_TEXTURE),n.texParameteri(k,n.TEXTURE_COMPARE_FUNC,mt[L.compareFunction])),t.has("EXT_texture_filter_anisotropic")===!0){if(L.magFilter===ni||L.minFilter!==Pc&&L.minFilter!==$s||L.type===es&&t.has("OES_texture_float_linear")===!1)return;if(L.anisotropy>1||i.get(L).__currentAnisotropy){const J=t.get("EXT_texture_filter_anisotropic");n.texParameterf(k,J.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(L.anisotropy,s.getMaxAnisotropy())),i.get(L).__currentAnisotropy=L.anisotropy}}}function St(k,L){let J=!1;k.__webglInit===void 0&&(k.__webglInit=!0,L.addEventListener("dispose",S));const ut=L.source;let Mt=f.get(ut);Mt===void 0&&(Mt={},f.set(ut,Mt));const dt=I(L);if(dt!==k.__cacheKey){Mt[dt]===void 0&&(Mt[dt]={texture:n.createTexture(),usedTimes:0},a.memory.textures++,J=!0),Mt[dt].usedTimes++;const Vt=Mt[k.__cacheKey];Vt!==void 0&&(Mt[k.__cacheKey].usedTimes--,Vt.usedTimes===0&&b(L)),k.__cacheKey=dt,k.__webglTexture=Mt[dt].texture}return J}function Ct(k,L,J){return Math.floor(Math.floor(k/J)/L)}function Ut(k,L,J,ut){const dt=k.updateRanges;if(dt.length===0)e.texSubImage2D(n.TEXTURE_2D,0,0,0,L.width,L.height,J,ut,L.data);else{dt.sort((wt,Nt)=>wt.start-Nt.start);let Vt=0;for(let wt=1;wt<dt.length;wt++){const Nt=dt[Vt],Qt=dt[wt],Gt=Nt.start+Nt.count,It=Ct(Qt.start,L.width,4),ae=Ct(Nt.start,L.width,4);Qt.start<=Gt+1&&It===ae&&Ct(Qt.start+Qt.count-1,L.width,4)===It?Nt.count=Math.max(Nt.count,Qt.start+Qt.count-Nt.start):(++Vt,dt[Vt]=Qt)}dt.length=Vt+1;const At=n.getParameter(n.UNPACK_ROW_LENGTH),Bt=n.getParameter(n.UNPACK_SKIP_PIXELS),Ht=n.getParameter(n.UNPACK_SKIP_ROWS);n.pixelStorei(n.UNPACK_ROW_LENGTH,L.width);for(let wt=0,Nt=dt.length;wt<Nt;wt++){const Qt=dt[wt],Gt=Math.floor(Qt.start/4),It=Math.ceil(Qt.count/4),ae=Gt%L.width,q=Math.floor(Gt/L.width),Tt=It,Rt=1;n.pixelStorei(n.UNPACK_SKIP_PIXELS,ae),n.pixelStorei(n.UNPACK_SKIP_ROWS,q),e.texSubImage2D(n.TEXTURE_2D,0,ae,q,Tt,Rt,J,ut,L.data)}k.clearUpdateRanges(),n.pixelStorei(n.UNPACK_ROW_LENGTH,At),n.pixelStorei(n.UNPACK_SKIP_PIXELS,Bt),n.pixelStorei(n.UNPACK_SKIP_ROWS,Ht)}}function V(k,L,J){let ut=n.TEXTURE_2D;(L.isDataArrayTexture||L.isCompressedArrayTexture)&&(ut=n.TEXTURE_2D_ARRAY),L.isData3DTexture&&(ut=n.TEXTURE_3D);const Mt=St(k,L),dt=L.source;e.bindTexture(ut,k.__webglTexture,n.TEXTURE0+J);const Vt=i.get(dt);if(dt.version!==Vt.__version||Mt===!0){e.activeTexture(n.TEXTURE0+J);const At=ge.getPrimaries(ge.workingColorSpace),Bt=L.colorSpace===Ji?null:ge.getPrimaries(L.colorSpace),Ht=L.colorSpace===Ji||At===Bt?n.NONE:n.BROWSER_DEFAULT_WEBGL;n.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,L.flipY),n.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,L.premultiplyAlpha),n.pixelStorei(n.UNPACK_ALIGNMENT,L.unpackAlignment),n.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,Ht);let wt=v(L.image,!1,s.maxTextureSize);wt=ee(L,wt);const Nt=r.convert(L.format,L.colorSpace),Qt=r.convert(L.type);let Gt=x(L.internalFormat,Nt,Qt,L.colorSpace,L.isVideoTexture);vt(ut,L);let It;const ae=L.mipmaps,q=L.isVideoTexture!==!0,Tt=Vt.__version===void 0||Mt===!0,Rt=dt.dataReady,kt=w(L,wt);if(L.isDepthTexture)Gt=M(L.format===sc,L.type),Tt&&(q?e.texStorage2D(n.TEXTURE_2D,1,Gt,wt.width,wt.height):e.texImage2D(n.TEXTURE_2D,0,Gt,wt.width,wt.height,0,Nt,Qt,null));else if(L.isDataTexture)if(ae.length>0){q&&Tt&&e.texStorage2D(n.TEXTURE_2D,kt,Gt,ae[0].width,ae[0].height);for(let yt=0,xt=ae.length;yt<xt;yt++)It=ae[yt],q?Rt&&e.texSubImage2D(n.TEXTURE_2D,yt,0,0,It.width,It.height,Nt,Qt,It.data):e.texImage2D(n.TEXTURE_2D,yt,Gt,It.width,It.height,0,Nt,Qt,It.data);L.generateMipmaps=!1}else q?(Tt&&e.texStorage2D(n.TEXTURE_2D,kt,Gt,wt.width,wt.height),Rt&&Ut(L,wt,Nt,Qt)):e.texImage2D(n.TEXTURE_2D,0,Gt,wt.width,wt.height,0,Nt,Qt,wt.data);else if(L.isCompressedTexture)if(L.isCompressedArrayTexture){q&&Tt&&e.texStorage3D(n.TEXTURE_2D_ARRAY,kt,Gt,ae[0].width,ae[0].height,wt.depth);for(let yt=0,xt=ae.length;yt<xt;yt++)if(It=ae[yt],L.format!==cn)if(Nt!==null)if(q){if(Rt)if(L.layerUpdates.size>0){const zt=P1(It.width,It.height,L.format,L.type);for(const se of L.layerUpdates){const Te=It.data.subarray(se*zt/It.data.BYTES_PER_ELEMENT,(se+1)*zt/It.data.BYTES_PER_ELEMENT);e.compressedTexSubImage3D(n.TEXTURE_2D_ARRAY,yt,0,0,se,It.width,It.height,1,Nt,Te)}L.clearLayerUpdates()}else e.compressedTexSubImage3D(n.TEXTURE_2D_ARRAY,yt,0,0,0,It.width,It.height,wt.depth,Nt,It.data)}else e.compressedTexImage3D(n.TEXTURE_2D_ARRAY,yt,Gt,It.width,It.height,wt.depth,0,It.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else q?Rt&&e.texSubImage3D(n.TEXTURE_2D_ARRAY,yt,0,0,0,It.width,It.height,wt.depth,Nt,Qt,It.data):e.texImage3D(n.TEXTURE_2D_ARRAY,yt,Gt,It.width,It.height,wt.depth,0,Nt,Qt,It.data)}else{q&&Tt&&e.texStorage2D(n.TEXTURE_2D,kt,Gt,ae[0].width,ae[0].height);for(let yt=0,xt=ae.length;yt<xt;yt++)It=ae[yt],L.format!==cn?Nt!==null?q?Rt&&e.compressedTexSubImage2D(n.TEXTURE_2D,yt,0,0,It.width,It.height,Nt,It.data):e.compressedTexImage2D(n.TEXTURE_2D,yt,Gt,It.width,It.height,0,It.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):q?Rt&&e.texSubImage2D(n.TEXTURE_2D,yt,0,0,It.width,It.height,Nt,Qt,It.data):e.texImage2D(n.TEXTURE_2D,yt,Gt,It.width,It.height,0,Nt,Qt,It.data)}else if(L.isDataArrayTexture)if(q){if(Tt&&e.texStorage3D(n.TEXTURE_2D_ARRAY,kt,Gt,wt.width,wt.height,wt.depth),Rt)if(L.layerUpdates.size>0){const yt=P1(wt.width,wt.height,L.format,L.type);for(const xt of L.layerUpdates){const zt=wt.data.subarray(xt*yt/wt.data.BYTES_PER_ELEMENT,(xt+1)*yt/wt.data.BYTES_PER_ELEMENT);e.texSubImage3D(n.TEXTURE_2D_ARRAY,0,0,0,xt,wt.width,wt.height,1,Nt,Qt,zt)}L.clearLayerUpdates()}else e.texSubImage3D(n.TEXTURE_2D_ARRAY,0,0,0,0,wt.width,wt.height,wt.depth,Nt,Qt,wt.data)}else e.texImage3D(n.TEXTURE_2D_ARRAY,0,Gt,wt.width,wt.height,wt.depth,0,Nt,Qt,wt.data);else if(L.isData3DTexture)q?(Tt&&e.texStorage3D(n.TEXTURE_3D,kt,Gt,wt.width,wt.height,wt.depth),Rt&&e.texSubImage3D(n.TEXTURE_3D,0,0,0,0,wt.width,wt.height,wt.depth,Nt,Qt,wt.data)):e.texImage3D(n.TEXTURE_3D,0,Gt,wt.width,wt.height,wt.depth,0,Nt,Qt,wt.data);else if(L.isFramebufferTexture){if(Tt)if(q)e.texStorage2D(n.TEXTURE_2D,kt,Gt,wt.width,wt.height);else{let yt=wt.width,xt=wt.height;for(let zt=0;zt<kt;zt++)e.texImage2D(n.TEXTURE_2D,zt,Gt,yt,xt,0,Nt,Qt,null),yt>>=1,xt>>=1}}else if(ae.length>0){if(q&&Tt){const yt=Kt(ae[0]);e.texStorage2D(n.TEXTURE_2D,kt,Gt,yt.width,yt.height)}for(let yt=0,xt=ae.length;yt<xt;yt++)It=ae[yt],q?Rt&&e.texSubImage2D(n.TEXTURE_2D,yt,0,0,Nt,Qt,It):e.texImage2D(n.TEXTURE_2D,yt,Gt,Nt,Qt,It);L.generateMipmaps=!1}else if(q){if(Tt){const yt=Kt(wt);e.texStorage2D(n.TEXTURE_2D,kt,Gt,yt.width,yt.height)}Rt&&e.texSubImage2D(n.TEXTURE_2D,0,0,0,Nt,Qt,wt)}else e.texImage2D(n.TEXTURE_2D,0,Gt,Nt,Qt,wt);g(L)&&p(ut),Vt.__version=dt.version,L.onUpdate&&L.onUpdate(L)}k.__version=L.version}function X(k,L,J){if(L.image.length!==6)return;const ut=St(k,L),Mt=L.source;e.bindTexture(n.TEXTURE_CUBE_MAP,k.__webglTexture,n.TEXTURE0+J);const dt=i.get(Mt);if(Mt.version!==dt.__version||ut===!0){e.activeTexture(n.TEXTURE0+J);const Vt=ge.getPrimaries(ge.workingColorSpace),At=L.colorSpace===Ji?null:ge.getPrimaries(L.colorSpace),Bt=L.colorSpace===Ji||Vt===At?n.NONE:n.BROWSER_DEFAULT_WEBGL;n.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,L.flipY),n.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,L.premultiplyAlpha),n.pixelStorei(n.UNPACK_ALIGNMENT,L.unpackAlignment),n.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,Bt);const Ht=L.isCompressedTexture||L.image[0].isCompressedTexture,wt=L.image[0]&&L.image[0].isDataTexture,Nt=[];for(let xt=0;xt<6;xt++)!Ht&&!wt?Nt[xt]=v(L.image[xt],!0,s.maxCubemapSize):Nt[xt]=wt?L.image[xt].image:L.image[xt],Nt[xt]=ee(L,Nt[xt]);const Qt=Nt[0],Gt=r.convert(L.format,L.colorSpace),It=r.convert(L.type),ae=x(L.internalFormat,Gt,It,L.colorSpace),q=L.isVideoTexture!==!0,Tt=dt.__version===void 0||ut===!0,Rt=Mt.dataReady;let kt=w(L,Qt);vt(n.TEXTURE_CUBE_MAP,L);let yt;if(Ht){q&&Tt&&e.texStorage2D(n.TEXTURE_CUBE_MAP,kt,ae,Qt.width,Qt.height);for(let xt=0;xt<6;xt++){yt=Nt[xt].mipmaps;for(let zt=0;zt<yt.length;zt++){const se=yt[zt];L.format!==cn?Gt!==null?q?Rt&&e.compressedTexSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+xt,zt,0,0,se.width,se.height,Gt,se.data):e.compressedTexImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+xt,zt,ae,se.width,se.height,0,se.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):q?Rt&&e.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+xt,zt,0,0,se.width,se.height,Gt,It,se.data):e.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+xt,zt,ae,se.width,se.height,0,Gt,It,se.data)}}}else{if(yt=L.mipmaps,q&&Tt){yt.length>0&&kt++;const xt=Kt(Nt[0]);e.texStorage2D(n.TEXTURE_CUBE_MAP,kt,ae,xt.width,xt.height)}for(let xt=0;xt<6;xt++)if(wt){q?Rt&&e.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+xt,0,0,0,Nt[xt].width,Nt[xt].height,Gt,It,Nt[xt].data):e.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+xt,0,ae,Nt[xt].width,Nt[xt].height,0,Gt,It,Nt[xt].data);for(let zt=0;zt<yt.length;zt++){const Te=yt[zt].image[xt].image;q?Rt&&e.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+xt,zt+1,0,0,Te.width,Te.height,Gt,It,Te.data):e.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+xt,zt+1,ae,Te.width,Te.height,0,Gt,It,Te.data)}}else{q?Rt&&e.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+xt,0,0,0,Gt,It,Nt[xt]):e.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+xt,0,ae,Gt,It,Nt[xt]);for(let zt=0;zt<yt.length;zt++){const se=yt[zt];q?Rt&&e.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+xt,zt+1,0,0,Gt,It,se.image[xt]):e.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+xt,zt+1,ae,Gt,It,se.image[xt])}}}g(L)&&p(n.TEXTURE_CUBE_MAP),dt.__version=Mt.version,L.onUpdate&&L.onUpdate(L)}k.__version=L.version}function z(k,L,J,ut,Mt,dt){const Vt=r.convert(J.format,J.colorSpace),At=r.convert(J.type),Bt=x(J.internalFormat,Vt,At,J.colorSpace),Ht=i.get(L),wt=i.get(J);if(wt.__renderTarget=L,!Ht.__hasExternalTextures){const Nt=Math.max(1,L.width>>dt),Qt=Math.max(1,L.height>>dt);Mt===n.TEXTURE_3D||Mt===n.TEXTURE_2D_ARRAY?e.texImage3D(Mt,dt,Bt,Nt,Qt,L.depth,0,Vt,At,null):e.texImage2D(Mt,dt,Bt,Nt,Qt,0,Vt,At,null)}e.bindFramebuffer(n.FRAMEBUFFER,k),_t(L)?o.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,ut,Mt,wt.__webglTexture,0,pt(L)):(Mt===n.TEXTURE_2D||Mt>=n.TEXTURE_CUBE_MAP_POSITIVE_X&&Mt<=n.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&n.framebufferTexture2D(n.FRAMEBUFFER,ut,Mt,wt.__webglTexture,dt),e.bindFramebuffer(n.FRAMEBUFFER,null)}function W(k,L,J){if(n.bindRenderbuffer(n.RENDERBUFFER,k),L.depthBuffer){const ut=L.depthTexture,Mt=ut&&ut.isDepthTexture?ut.type:null,dt=M(L.stencilBuffer,Mt),Vt=L.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,At=pt(L);_t(L)?o.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,At,dt,L.width,L.height):J?n.renderbufferStorageMultisample(n.RENDERBUFFER,At,dt,L.width,L.height):n.renderbufferStorage(n.RENDERBUFFER,dt,L.width,L.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,Vt,n.RENDERBUFFER,k)}else{const ut=L.textures;for(let Mt=0;Mt<ut.length;Mt++){const dt=ut[Mt],Vt=r.convert(dt.format,dt.colorSpace),At=r.convert(dt.type),Bt=x(dt.internalFormat,Vt,At,dt.colorSpace),Ht=pt(L);J&&_t(L)===!1?n.renderbufferStorageMultisample(n.RENDERBUFFER,Ht,Bt,L.width,L.height):_t(L)?o.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,Ht,Bt,L.width,L.height):n.renderbufferStorage(n.RENDERBUFFER,Bt,L.width,L.height)}}n.bindRenderbuffer(n.RENDERBUFFER,null)}function G(k,L){if(L&&L.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(e.bindFramebuffer(n.FRAMEBUFFER,k),!(L.depthTexture&&L.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");const ut=i.get(L.depthTexture);ut.__renderTarget=L,(!ut.__webglTexture||L.depthTexture.image.width!==L.width||L.depthTexture.image.height!==L.height)&&(L.depthTexture.image.width=L.width,L.depthTexture.image.height=L.height,L.depthTexture.needsUpdate=!0),F(L.depthTexture,0);const Mt=ut.__webglTexture,dt=pt(L);if(L.depthTexture.format===ic)_t(L)?o.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,n.DEPTH_ATTACHMENT,n.TEXTURE_2D,Mt,0,dt):n.framebufferTexture2D(n.FRAMEBUFFER,n.DEPTH_ATTACHMENT,n.TEXTURE_2D,Mt,0);else if(L.depthTexture.format===sc)_t(L)?o.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,n.DEPTH_STENCIL_ATTACHMENT,n.TEXTURE_2D,Mt,0,dt):n.framebufferTexture2D(n.FRAMEBUFFER,n.DEPTH_STENCIL_ATTACHMENT,n.TEXTURE_2D,Mt,0);else throw new Error("Unknown depthTexture format")}function tt(k){const L=i.get(k),J=k.isWebGLCubeRenderTarget===!0;if(L.__boundDepthTexture!==k.depthTexture){const ut=k.depthTexture;if(L.__depthDisposeCallback&&L.__depthDisposeCallback(),ut){const Mt=()=>{delete L.__boundDepthTexture,delete L.__depthDisposeCallback,ut.removeEventListener("dispose",Mt)};ut.addEventListener("dispose",Mt),L.__depthDisposeCallback=Mt}L.__boundDepthTexture=ut}if(k.depthTexture&&!L.__autoAllocateDepthBuffer){if(J)throw new Error("target.depthTexture not supported in Cube render targets");const ut=k.texture.mipmaps;ut&&ut.length>0?G(L.__webglFramebuffer[0],k):G(L.__webglFramebuffer,k)}else if(J){L.__webglDepthbuffer=[];for(let ut=0;ut<6;ut++)if(e.bindFramebuffer(n.FRAMEBUFFER,L.__webglFramebuffer[ut]),L.__webglDepthbuffer[ut]===void 0)L.__webglDepthbuffer[ut]=n.createRenderbuffer(),W(L.__webglDepthbuffer[ut],k,!1);else{const Mt=k.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,dt=L.__webglDepthbuffer[ut];n.bindRenderbuffer(n.RENDERBUFFER,dt),n.framebufferRenderbuffer(n.FRAMEBUFFER,Mt,n.RENDERBUFFER,dt)}}else{const ut=k.texture.mipmaps;if(ut&&ut.length>0?e.bindFramebuffer(n.FRAMEBUFFER,L.__webglFramebuffer[0]):e.bindFramebuffer(n.FRAMEBUFFER,L.__webglFramebuffer),L.__webglDepthbuffer===void 0)L.__webglDepthbuffer=n.createRenderbuffer(),W(L.__webglDepthbuffer,k,!1);else{const Mt=k.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,dt=L.__webglDepthbuffer;n.bindRenderbuffer(n.RENDERBUFFER,dt),n.framebufferRenderbuffer(n.FRAMEBUFFER,Mt,n.RENDERBUFFER,dt)}}e.bindFramebuffer(n.FRAMEBUFFER,null)}function at(k,L,J){const ut=i.get(k);L!==void 0&&z(ut.__webglFramebuffer,k,k.texture,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,0),J!==void 0&&tt(k)}function N(k){const L=k.texture,J=i.get(k),ut=i.get(L);k.addEventListener("dispose",T);const Mt=k.textures,dt=k.isWebGLCubeRenderTarget===!0,Vt=Mt.length>1;if(Vt||(ut.__webglTexture===void 0&&(ut.__webglTexture=n.createTexture()),ut.__version=L.version,a.memory.textures++),dt){J.__webglFramebuffer=[];for(let At=0;At<6;At++)if(L.mipmaps&&L.mipmaps.length>0){J.__webglFramebuffer[At]=[];for(let Bt=0;Bt<L.mipmaps.length;Bt++)J.__webglFramebuffer[At][Bt]=n.createFramebuffer()}else J.__webglFramebuffer[At]=n.createFramebuffer()}else{if(L.mipmaps&&L.mipmaps.length>0){J.__webglFramebuffer=[];for(let At=0;At<L.mipmaps.length;At++)J.__webglFramebuffer[At]=n.createFramebuffer()}else J.__webglFramebuffer=n.createFramebuffer();if(Vt)for(let At=0,Bt=Mt.length;At<Bt;At++){const Ht=i.get(Mt[At]);Ht.__webglTexture===void 0&&(Ht.__webglTexture=n.createTexture(),a.memory.textures++)}if(k.samples>0&&_t(k)===!1){J.__webglMultisampledFramebuffer=n.createFramebuffer(),J.__webglColorRenderbuffer=[],e.bindFramebuffer(n.FRAMEBUFFER,J.__webglMultisampledFramebuffer);for(let At=0;At<Mt.length;At++){const Bt=Mt[At];J.__webglColorRenderbuffer[At]=n.createRenderbuffer(),n.bindRenderbuffer(n.RENDERBUFFER,J.__webglColorRenderbuffer[At]);const Ht=r.convert(Bt.format,Bt.colorSpace),wt=r.convert(Bt.type),Nt=x(Bt.internalFormat,Ht,wt,Bt.colorSpace,k.isXRRenderTarget===!0),Qt=pt(k);n.renderbufferStorageMultisample(n.RENDERBUFFER,Qt,Nt,k.width,k.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+At,n.RENDERBUFFER,J.__webglColorRenderbuffer[At])}n.bindRenderbuffer(n.RENDERBUFFER,null),k.depthBuffer&&(J.__webglDepthRenderbuffer=n.createRenderbuffer(),W(J.__webglDepthRenderbuffer,k,!0)),e.bindFramebuffer(n.FRAMEBUFFER,null)}}if(dt){e.bindTexture(n.TEXTURE_CUBE_MAP,ut.__webglTexture),vt(n.TEXTURE_CUBE_MAP,L);for(let At=0;At<6;At++)if(L.mipmaps&&L.mipmaps.length>0)for(let Bt=0;Bt<L.mipmaps.length;Bt++)z(J.__webglFramebuffer[At][Bt],k,L,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+At,Bt);else z(J.__webglFramebuffer[At],k,L,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+At,0);g(L)&&p(n.TEXTURE_CUBE_MAP),e.unbindTexture()}else if(Vt){for(let At=0,Bt=Mt.length;At<Bt;At++){const Ht=Mt[At],wt=i.get(Ht);let Nt=n.TEXTURE_2D;(k.isWebGL3DRenderTarget||k.isWebGLArrayRenderTarget)&&(Nt=k.isWebGL3DRenderTarget?n.TEXTURE_3D:n.TEXTURE_2D_ARRAY),e.bindTexture(Nt,wt.__webglTexture),vt(Nt,Ht),z(J.__webglFramebuffer,k,Ht,n.COLOR_ATTACHMENT0+At,Nt,0),g(Ht)&&p(Nt)}e.unbindTexture()}else{let At=n.TEXTURE_2D;if((k.isWebGL3DRenderTarget||k.isWebGLArrayRenderTarget)&&(At=k.isWebGL3DRenderTarget?n.TEXTURE_3D:n.TEXTURE_2D_ARRAY),e.bindTexture(At,ut.__webglTexture),vt(At,L),L.mipmaps&&L.mipmaps.length>0)for(let Bt=0;Bt<L.mipmaps.length;Bt++)z(J.__webglFramebuffer[Bt],k,L,n.COLOR_ATTACHMENT0,At,Bt);else z(J.__webglFramebuffer,k,L,n.COLOR_ATTACHMENT0,At,0);g(L)&&p(At),e.unbindTexture()}k.depthBuffer&&tt(k)}function et(k){const L=k.textures;for(let J=0,ut=L.length;J<ut;J++){const Mt=L[J];if(g(Mt)){const dt=_(k),Vt=i.get(Mt).__webglTexture;e.bindTexture(dt,Vt),p(dt),e.unbindTexture()}}}const Q=[],st=[];function ht(k){if(k.samples>0){if(_t(k)===!1){const L=k.textures,J=k.width,ut=k.height;let Mt=n.COLOR_BUFFER_BIT;const dt=k.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,Vt=i.get(k),At=L.length>1;if(At)for(let Ht=0;Ht<L.length;Ht++)e.bindFramebuffer(n.FRAMEBUFFER,Vt.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+Ht,n.RENDERBUFFER,null),e.bindFramebuffer(n.FRAMEBUFFER,Vt.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+Ht,n.TEXTURE_2D,null,0);e.bindFramebuffer(n.READ_FRAMEBUFFER,Vt.__webglMultisampledFramebuffer);const Bt=k.texture.mipmaps;Bt&&Bt.length>0?e.bindFramebuffer(n.DRAW_FRAMEBUFFER,Vt.__webglFramebuffer[0]):e.bindFramebuffer(n.DRAW_FRAMEBUFFER,Vt.__webglFramebuffer);for(let Ht=0;Ht<L.length;Ht++){if(k.resolveDepthBuffer&&(k.depthBuffer&&(Mt|=n.DEPTH_BUFFER_BIT),k.stencilBuffer&&k.resolveStencilBuffer&&(Mt|=n.STENCIL_BUFFER_BIT)),At){n.framebufferRenderbuffer(n.READ_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.RENDERBUFFER,Vt.__webglColorRenderbuffer[Ht]);const wt=i.get(L[Ht]).__webglTexture;n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,wt,0)}n.blitFramebuffer(0,0,J,ut,0,0,J,ut,Mt,n.NEAREST),c===!0&&(Q.length=0,st.length=0,Q.push(n.COLOR_ATTACHMENT0+Ht),k.depthBuffer&&k.resolveDepthBuffer===!1&&(Q.push(dt),st.push(dt),n.invalidateFramebuffer(n.DRAW_FRAMEBUFFER,st)),n.invalidateFramebuffer(n.READ_FRAMEBUFFER,Q))}if(e.bindFramebuffer(n.READ_FRAMEBUFFER,null),e.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),At)for(let Ht=0;Ht<L.length;Ht++){e.bindFramebuffer(n.FRAMEBUFFER,Vt.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+Ht,n.RENDERBUFFER,Vt.__webglColorRenderbuffer[Ht]);const wt=i.get(L[Ht]).__webglTexture;e.bindFramebuffer(n.FRAMEBUFFER,Vt.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+Ht,n.TEXTURE_2D,wt,0)}e.bindFramebuffer(n.DRAW_FRAMEBUFFER,Vt.__webglMultisampledFramebuffer)}else if(k.depthBuffer&&k.resolveDepthBuffer===!1&&c){const L=k.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT;n.invalidateFramebuffer(n.DRAW_FRAMEBUFFER,[L])}}}function pt(k){return Math.min(s.maxSamples,k.samples)}function _t(k){const L=i.get(k);return k.samples>0&&t.has("WEBGL_multisampled_render_to_texture")===!0&&L.__useRenderToTexture!==!1}function bt(k){const L=a.render.frame;h.get(k)!==L&&(h.set(k,L),k.update())}function ee(k,L){const J=k.colorSpace,ut=k.format,Mt=k.type;return k.isCompressedTexture===!0||k.isVideoTexture===!0||J!==Hr&&J!==Ji&&(ge.getTransfer(J)===we?(ut!==cn||Mt!==Oi)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",J)),L}function Kt(k){return typeof HTMLImageElement<"u"&&k instanceof HTMLImageElement?(l.width=k.naturalWidth||k.width,l.height=k.naturalHeight||k.height):typeof VideoFrame<"u"&&k instanceof VideoFrame?(l.width=k.displayWidth,l.height=k.displayHeight):(l.width=k.width,l.height=k.height),l}this.allocateTextureUnit=P,this.resetTextureUnits=R,this.setTexture2D=F,this.setTexture2DArray=H,this.setTexture3D=$,this.setTextureCube=B,this.rebindTextures=at,this.setupRenderTarget=N,this.updateRenderTargetMipmap=et,this.updateMultisampleRenderTarget=ht,this.setupDepthRenderbuffer=tt,this.setupFrameBufferTexture=z,this.useMultisampledRTT=_t}function fy(n,t){function e(i,s=Ji){let r;const a=ge.getTransfer(s);if(i===Oi)return n.UNSIGNED_BYTE;if(i===Lf)return n.UNSIGNED_SHORT_4_4_4_4;if(i===Pf)return n.UNSIGNED_SHORT_5_5_5_1;if(i===ig)return n.UNSIGNED_INT_5_9_9_9_REV;if(i===sg)return n.UNSIGNED_INT_10F_11F_11F_REV;if(i===eg)return n.BYTE;if(i===ng)return n.SHORT;if(i===ec)return n.UNSIGNED_SHORT;if(i===Cf)return n.INT;if(i===Br)return n.UNSIGNED_INT;if(i===es)return n.FLOAT;if(i===Xr)return n.HALF_FLOAT;if(i===rg)return n.ALPHA;if(i===ag)return n.RGB;if(i===cn)return n.RGBA;if(i===ic)return n.DEPTH_COMPONENT;if(i===sc)return n.DEPTH_STENCIL;if(i===og)return n.RED;if(i===If)return n.RED_INTEGER;if(i===cg)return n.RG;if(i===Df)return n.RG_INTEGER;if(i===Uf)return n.RGBA_INTEGER;if(i===El||i===Tl||i===Al||i===Rl)if(a===we)if(r=t.get("WEBGL_compressed_texture_s3tc_srgb"),r!==null){if(i===El)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(i===Tl)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(i===Al)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(i===Rl)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(r=t.get("WEBGL_compressed_texture_s3tc"),r!==null){if(i===El)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(i===Tl)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(i===Al)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(i===Rl)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(i===uu||i===fu||i===du||i===pu)if(r=t.get("WEBGL_compressed_texture_pvrtc"),r!==null){if(i===uu)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(i===fu)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(i===du)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(i===pu)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(i===mu||i===gu||i===vu)if(r=t.get("WEBGL_compressed_texture_etc"),r!==null){if(i===mu||i===gu)return a===we?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(i===vu)return a===we?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(i===xu||i===_u||i===Mu||i===bu||i===wu||i===yu||i===Su||i===Eu||i===Tu||i===Au||i===Ru||i===Cu||i===Lu||i===Pu)if(r=t.get("WEBGL_compressed_texture_astc"),r!==null){if(i===xu)return a===we?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(i===_u)return a===we?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(i===Mu)return a===we?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(i===bu)return a===we?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(i===wu)return a===we?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(i===yu)return a===we?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(i===Su)return a===we?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(i===Eu)return a===we?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(i===Tu)return a===we?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(i===Au)return a===we?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(i===Ru)return a===we?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(i===Cu)return a===we?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(i===Lu)return a===we?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(i===Pu)return a===we?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(i===Iu||i===Du||i===Uu)if(r=t.get("EXT_texture_compression_bptc"),r!==null){if(i===Iu)return a===we?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(i===Du)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(i===Uu)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(i===Nu||i===Fu||i===ku||i===Ou)if(r=t.get("EXT_texture_compression_rgtc"),r!==null){if(i===Nu)return r.COMPRESSED_RED_RGTC1_EXT;if(i===Fu)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(i===ku)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(i===Ou)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return i===nc?n.UNSIGNED_INT_24_8:n[i]!==void 0?n[i]:null}return{convert:e}}const dy=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,py=`
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

}`;class my{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(t,e){if(this.texture===null){const i=new yg(t.texture);(t.depthNear!==e.depthNear||t.depthFar!==e.depthFar)&&(this.depthNear=t.depthNear,this.depthFar=t.depthFar),this.texture=i}}getMesh(t){if(this.texture!==null&&this.mesh===null){const e=t.cameras[0].viewport,i=new en({vertexShader:dy,fragmentShader:py,uniforms:{depthColor:{value:this.texture},depthWidth:{value:e.z},depthHeight:{value:e.w}}});this.mesh=new nt(new xi(20,20),i)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class gy extends po{constructor(t,e){super();const i=this;let s=null,r=1,a=null,o="local-floor",c=1,l=null,h=null,u=null,f=null,d=null,m=null;const v=typeof XRWebGLBinding<"u",g=new my,p={},_=e.getContextAttributes();let x=null,M=null;const w=[],S=[],T=new ft;let A=null;const b=new qn;b.viewport=new de;const y=new qn;y.viewport=new de;const E=[b,y],R=new UM;let P=null,I=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(V){let X=w[V];return X===void 0&&(X=new Qh,w[V]=X),X.getTargetRaySpace()},this.getControllerGrip=function(V){let X=w[V];return X===void 0&&(X=new Qh,w[V]=X),X.getGripSpace()},this.getHand=function(V){let X=w[V];return X===void 0&&(X=new Qh,w[V]=X),X.getHandSpace()};function F(V){const X=S.indexOf(V.inputSource);if(X===-1)return;const z=w[X];z!==void 0&&(z.update(V.inputSource,V.frame,l||a),z.dispatchEvent({type:V.type,data:V.inputSource}))}function H(){s.removeEventListener("select",F),s.removeEventListener("selectstart",F),s.removeEventListener("selectend",F),s.removeEventListener("squeeze",F),s.removeEventListener("squeezestart",F),s.removeEventListener("squeezeend",F),s.removeEventListener("end",H),s.removeEventListener("inputsourceschange",$);for(let V=0;V<w.length;V++){const X=S[V];X!==null&&(S[V]=null,w[V].disconnect(X))}P=null,I=null,g.reset();for(const V in p)delete p[V];t.setRenderTarget(x),d=null,f=null,u=null,s=null,M=null,Ut.stop(),i.isPresenting=!1,t.setPixelRatio(A),t.setSize(T.width,T.height,!1),i.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(V){r=V,i.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(V){o=V,i.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return l||a},this.setReferenceSpace=function(V){l=V},this.getBaseLayer=function(){return f!==null?f:d},this.getBinding=function(){return u===null&&v&&(u=new XRWebGLBinding(s,e)),u},this.getFrame=function(){return m},this.getSession=function(){return s},this.setSession=async function(V){if(s=V,s!==null){if(x=t.getRenderTarget(),s.addEventListener("select",F),s.addEventListener("selectstart",F),s.addEventListener("selectend",F),s.addEventListener("squeeze",F),s.addEventListener("squeezestart",F),s.addEventListener("squeezeend",F),s.addEventListener("end",H),s.addEventListener("inputsourceschange",$),_.xrCompatible!==!0&&await e.makeXRCompatible(),A=t.getPixelRatio(),t.getSize(T),v&&"createProjectionLayer"in XRWebGLBinding.prototype){let z=null,W=null,G=null;_.depth&&(G=_.stencil?e.DEPTH24_STENCIL8:e.DEPTH_COMPONENT24,z=_.stencil?sc:ic,W=_.stencil?nc:Br);const tt={colorFormat:e.RGBA8,depthFormat:G,scaleFactor:r};u=this.getBinding(),f=u.createProjectionLayer(tt),s.updateRenderState({layers:[f]}),t.setPixelRatio(1),t.setSize(f.textureWidth,f.textureHeight,!1),M=new yn(f.textureWidth,f.textureHeight,{format:cn,type:Oi,depthTexture:new wg(f.textureWidth,f.textureHeight,W,void 0,void 0,void 0,void 0,void 0,void 0,z),stencilBuffer:_.stencil,colorSpace:t.outputColorSpace,samples:_.antialias?4:0,resolveDepthBuffer:f.ignoreDepthValues===!1,resolveStencilBuffer:f.ignoreDepthValues===!1})}else{const z={antialias:_.antialias,alpha:!0,depth:_.depth,stencil:_.stencil,framebufferScaleFactor:r};d=new XRWebGLLayer(s,e,z),s.updateRenderState({baseLayer:d}),t.setPixelRatio(1),t.setSize(d.framebufferWidth,d.framebufferHeight,!1),M=new yn(d.framebufferWidth,d.framebufferHeight,{format:cn,type:Oi,colorSpace:t.outputColorSpace,stencilBuffer:_.stencil,resolveDepthBuffer:d.ignoreDepthValues===!1,resolveStencilBuffer:d.ignoreDepthValues===!1})}M.isXRRenderTarget=!0,this.setFoveation(c),l=null,a=await s.requestReferenceSpace(o),Ut.setContext(s),Ut.start(),i.isPresenting=!0,i.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode},this.getDepthTexture=function(){return g.getDepthTexture()};function $(V){for(let X=0;X<V.removed.length;X++){const z=V.removed[X],W=S.indexOf(z);W>=0&&(S[W]=null,w[W].disconnect(z))}for(let X=0;X<V.added.length;X++){const z=V.added[X];let W=S.indexOf(z);if(W===-1){for(let tt=0;tt<w.length;tt++)if(tt>=S.length){S.push(z),W=tt;break}else if(S[tt]===null){S[tt]=z,W=tt;break}if(W===-1)break}const G=w[W];G&&G.connect(z)}}const B=new C,Y=new C;function it(V,X,z){B.setFromMatrixPosition(X.matrixWorld),Y.setFromMatrixPosition(z.matrixWorld);const W=B.distanceTo(Y),G=X.projectionMatrix.elements,tt=z.projectionMatrix.elements,at=G[14]/(G[10]-1),N=G[14]/(G[10]+1),et=(G[9]+1)/G[5],Q=(G[9]-1)/G[5],st=(G[8]-1)/G[0],ht=(tt[8]+1)/tt[0],pt=at*st,_t=at*ht,bt=W/(-st+ht),ee=bt*-st;if(X.matrixWorld.decompose(V.position,V.quaternion,V.scale),V.translateX(ee),V.translateZ(bt),V.matrixWorld.compose(V.position,V.quaternion,V.scale),V.matrixWorldInverse.copy(V.matrixWorld).invert(),G[10]===-1)V.projectionMatrix.copy(X.projectionMatrix),V.projectionMatrixInverse.copy(X.projectionMatrixInverse);else{const Kt=at+bt,k=N+bt,L=pt-ee,J=_t+(W-ee),ut=et*N/k*Kt,Mt=Q*N/k*Kt;V.projectionMatrix.makePerspective(L,J,ut,Mt,Kt,k),V.projectionMatrixInverse.copy(V.projectionMatrix).invert()}}function mt(V,X){X===null?V.matrixWorld.copy(V.matrix):V.matrixWorld.multiplyMatrices(X.matrixWorld,V.matrix),V.matrixWorldInverse.copy(V.matrixWorld).invert()}this.updateCamera=function(V){if(s===null)return;let X=V.near,z=V.far;g.texture!==null&&(g.depthNear>0&&(X=g.depthNear),g.depthFar>0&&(z=g.depthFar)),R.near=y.near=b.near=X,R.far=y.far=b.far=z,(P!==R.near||I!==R.far)&&(s.updateRenderState({depthNear:R.near,depthFar:R.far}),P=R.near,I=R.far),R.layers.mask=V.layers.mask|6,b.layers.mask=R.layers.mask&3,y.layers.mask=R.layers.mask&5;const W=V.parent,G=R.cameras;mt(R,W);for(let tt=0;tt<G.length;tt++)mt(G[tt],W);G.length===2?it(R,b,y):R.projectionMatrix.copy(b.projectionMatrix),vt(V,R,W)};function vt(V,X,z){z===null?V.matrix.copy(X.matrixWorld):(V.matrix.copy(z.matrixWorld),V.matrix.invert(),V.matrix.multiply(X.matrixWorld)),V.matrix.decompose(V.position,V.quaternion,V.scale),V.updateMatrixWorld(!0),V.projectionMatrix.copy(X.projectionMatrix),V.projectionMatrixInverse.copy(X.projectionMatrixInverse),V.isPerspectiveCamera&&(V.fov=ro*2*Math.atan(1/V.projectionMatrix.elements[5]),V.zoom=1)}this.getCamera=function(){return R},this.getFoveation=function(){if(!(f===null&&d===null))return c},this.setFoveation=function(V){c=V,f!==null&&(f.fixedFoveation=V),d!==null&&d.fixedFoveation!==void 0&&(d.fixedFoveation=V)},this.hasDepthSensing=function(){return g.texture!==null},this.getDepthSensingMesh=function(){return g.getMesh(R)},this.getCameraTexture=function(V){return p[V]};let St=null;function Ct(V,X){if(h=X.getViewerPose(l||a),m=X,h!==null){const z=h.views;d!==null&&(t.setRenderTargetFramebuffer(M,d.framebuffer),t.setRenderTarget(M));let W=!1;z.length!==R.cameras.length&&(R.cameras.length=0,W=!0);for(let N=0;N<z.length;N++){const et=z[N];let Q=null;if(d!==null)Q=d.getViewport(et);else{const ht=u.getViewSubImage(f,et);Q=ht.viewport,N===0&&(t.setRenderTargetTextures(M,ht.colorTexture,ht.depthStencilTexture),t.setRenderTarget(M))}let st=E[N];st===void 0&&(st=new qn,st.layers.enable(N),st.viewport=new de,E[N]=st),st.matrix.fromArray(et.transform.matrix),st.matrix.decompose(st.position,st.quaternion,st.scale),st.projectionMatrix.fromArray(et.projectionMatrix),st.projectionMatrixInverse.copy(st.projectionMatrix).invert(),st.viewport.set(Q.x,Q.y,Q.width,Q.height),N===0&&(R.matrix.copy(st.matrix),R.matrix.decompose(R.position,R.quaternion,R.scale)),W===!0&&R.cameras.push(st)}const G=s.enabledFeatures;if(G&&G.includes("depth-sensing")&&s.depthUsage=="gpu-optimized"&&v){u=i.getBinding();const N=u.getDepthInformation(z[0]);N&&N.isValid&&N.texture&&g.init(N,s.renderState)}if(G&&G.includes("camera-access")&&v){t.state.unbindTexture(),u=i.getBinding();for(let N=0;N<z.length;N++){const et=z[N].camera;if(et){let Q=p[et];Q||(Q=new yg,p[et]=Q);const st=u.getCameraImage(et);Q.sourceTexture=st}}}}for(let z=0;z<w.length;z++){const W=S[z],G=w[z];W!==null&&G!==void 0&&G.update(W,X,l||a)}St&&St(V,X),X.detectedPlanes&&i.dispatchEvent({type:"planesdetected",data:X}),m=null}const Ut=new Ug;Ut.setAnimationLoop(Ct),this.setAnimationLoop=function(V){St=V},this.dispose=function(){}}}const pr=new Tn,vy=new re;function xy(n,t){function e(g,p){g.matrixAutoUpdate===!0&&g.updateMatrix(),p.value.copy(g.matrix)}function i(g,p){p.color.getRGB(g.fogColor.value,mg(n)),p.isFog?(g.fogNear.value=p.near,g.fogFar.value=p.far):p.isFogExp2&&(g.fogDensity.value=p.density)}function s(g,p,_,x,M){p.isMeshBasicMaterial||p.isMeshLambertMaterial?r(g,p):p.isMeshToonMaterial?(r(g,p),u(g,p)):p.isMeshPhongMaterial?(r(g,p),h(g,p)):p.isMeshStandardMaterial?(r(g,p),f(g,p),p.isMeshPhysicalMaterial&&d(g,p,M)):p.isMeshMatcapMaterial?(r(g,p),m(g,p)):p.isMeshDepthMaterial?r(g,p):p.isMeshDistanceMaterial?(r(g,p),v(g,p)):p.isMeshNormalMaterial?r(g,p):p.isLineBasicMaterial?(a(g,p),p.isLineDashedMaterial&&o(g,p)):p.isPointsMaterial?c(g,p,_,x):p.isSpriteMaterial?l(g,p):p.isShadowMaterial?(g.color.value.copy(p.color),g.opacity.value=p.opacity):p.isShaderMaterial&&(p.uniformsNeedUpdate=!1)}function r(g,p){g.opacity.value=p.opacity,p.color&&g.diffuse.value.copy(p.color),p.emissive&&g.emissive.value.copy(p.emissive).multiplyScalar(p.emissiveIntensity),p.map&&(g.map.value=p.map,e(p.map,g.mapTransform)),p.alphaMap&&(g.alphaMap.value=p.alphaMap,e(p.alphaMap,g.alphaMapTransform)),p.bumpMap&&(g.bumpMap.value=p.bumpMap,e(p.bumpMap,g.bumpMapTransform),g.bumpScale.value=p.bumpScale,p.side===Fn&&(g.bumpScale.value*=-1)),p.normalMap&&(g.normalMap.value=p.normalMap,e(p.normalMap,g.normalMapTransform),g.normalScale.value.copy(p.normalScale),p.side===Fn&&g.normalScale.value.negate()),p.displacementMap&&(g.displacementMap.value=p.displacementMap,e(p.displacementMap,g.displacementMapTransform),g.displacementScale.value=p.displacementScale,g.displacementBias.value=p.displacementBias),p.emissiveMap&&(g.emissiveMap.value=p.emissiveMap,e(p.emissiveMap,g.emissiveMapTransform)),p.specularMap&&(g.specularMap.value=p.specularMap,e(p.specularMap,g.specularMapTransform)),p.alphaTest>0&&(g.alphaTest.value=p.alphaTest);const _=t.get(p),x=_.envMap,M=_.envMapRotation;x&&(g.envMap.value=x,pr.copy(M),pr.x*=-1,pr.y*=-1,pr.z*=-1,x.isCubeTexture&&x.isRenderTargetTexture===!1&&(pr.y*=-1,pr.z*=-1),g.envMapRotation.value.setFromMatrix4(vy.makeRotationFromEuler(pr)),g.flipEnvMap.value=x.isCubeTexture&&x.isRenderTargetTexture===!1?-1:1,g.reflectivity.value=p.reflectivity,g.ior.value=p.ior,g.refractionRatio.value=p.refractionRatio),p.lightMap&&(g.lightMap.value=p.lightMap,g.lightMapIntensity.value=p.lightMapIntensity,e(p.lightMap,g.lightMapTransform)),p.aoMap&&(g.aoMap.value=p.aoMap,g.aoMapIntensity.value=p.aoMapIntensity,e(p.aoMap,g.aoMapTransform))}function a(g,p){g.diffuse.value.copy(p.color),g.opacity.value=p.opacity,p.map&&(g.map.value=p.map,e(p.map,g.mapTransform))}function o(g,p){g.dashSize.value=p.dashSize,g.totalSize.value=p.dashSize+p.gapSize,g.scale.value=p.scale}function c(g,p,_,x){g.diffuse.value.copy(p.color),g.opacity.value=p.opacity,g.size.value=p.size*_,g.scale.value=x*.5,p.map&&(g.map.value=p.map,e(p.map,g.uvTransform)),p.alphaMap&&(g.alphaMap.value=p.alphaMap,e(p.alphaMap,g.alphaMapTransform)),p.alphaTest>0&&(g.alphaTest.value=p.alphaTest)}function l(g,p){g.diffuse.value.copy(p.color),g.opacity.value=p.opacity,g.rotation.value=p.rotation,p.map&&(g.map.value=p.map,e(p.map,g.mapTransform)),p.alphaMap&&(g.alphaMap.value=p.alphaMap,e(p.alphaMap,g.alphaMapTransform)),p.alphaTest>0&&(g.alphaTest.value=p.alphaTest)}function h(g,p){g.specular.value.copy(p.specular),g.shininess.value=Math.max(p.shininess,1e-4)}function u(g,p){p.gradientMap&&(g.gradientMap.value=p.gradientMap)}function f(g,p){g.metalness.value=p.metalness,p.metalnessMap&&(g.metalnessMap.value=p.metalnessMap,e(p.metalnessMap,g.metalnessMapTransform)),g.roughness.value=p.roughness,p.roughnessMap&&(g.roughnessMap.value=p.roughnessMap,e(p.roughnessMap,g.roughnessMapTransform)),p.envMap&&(g.envMapIntensity.value=p.envMapIntensity)}function d(g,p,_){g.ior.value=p.ior,p.sheen>0&&(g.sheenColor.value.copy(p.sheenColor).multiplyScalar(p.sheen),g.sheenRoughness.value=p.sheenRoughness,p.sheenColorMap&&(g.sheenColorMap.value=p.sheenColorMap,e(p.sheenColorMap,g.sheenColorMapTransform)),p.sheenRoughnessMap&&(g.sheenRoughnessMap.value=p.sheenRoughnessMap,e(p.sheenRoughnessMap,g.sheenRoughnessMapTransform))),p.clearcoat>0&&(g.clearcoat.value=p.clearcoat,g.clearcoatRoughness.value=p.clearcoatRoughness,p.clearcoatMap&&(g.clearcoatMap.value=p.clearcoatMap,e(p.clearcoatMap,g.clearcoatMapTransform)),p.clearcoatRoughnessMap&&(g.clearcoatRoughnessMap.value=p.clearcoatRoughnessMap,e(p.clearcoatRoughnessMap,g.clearcoatRoughnessMapTransform)),p.clearcoatNormalMap&&(g.clearcoatNormalMap.value=p.clearcoatNormalMap,e(p.clearcoatNormalMap,g.clearcoatNormalMapTransform),g.clearcoatNormalScale.value.copy(p.clearcoatNormalScale),p.side===Fn&&g.clearcoatNormalScale.value.negate())),p.dispersion>0&&(g.dispersion.value=p.dispersion),p.iridescence>0&&(g.iridescence.value=p.iridescence,g.iridescenceIOR.value=p.iridescenceIOR,g.iridescenceThicknessMinimum.value=p.iridescenceThicknessRange[0],g.iridescenceThicknessMaximum.value=p.iridescenceThicknessRange[1],p.iridescenceMap&&(g.iridescenceMap.value=p.iridescenceMap,e(p.iridescenceMap,g.iridescenceMapTransform)),p.iridescenceThicknessMap&&(g.iridescenceThicknessMap.value=p.iridescenceThicknessMap,e(p.iridescenceThicknessMap,g.iridescenceThicknessMapTransform))),p.transmission>0&&(g.transmission.value=p.transmission,g.transmissionSamplerMap.value=_.texture,g.transmissionSamplerSize.value.set(_.width,_.height),p.transmissionMap&&(g.transmissionMap.value=p.transmissionMap,e(p.transmissionMap,g.transmissionMapTransform)),g.thickness.value=p.thickness,p.thicknessMap&&(g.thicknessMap.value=p.thicknessMap,e(p.thicknessMap,g.thicknessMapTransform)),g.attenuationDistance.value=p.attenuationDistance,g.attenuationColor.value.copy(p.attenuationColor)),p.anisotropy>0&&(g.anisotropyVector.value.set(p.anisotropy*Math.cos(p.anisotropyRotation),p.anisotropy*Math.sin(p.anisotropyRotation)),p.anisotropyMap&&(g.anisotropyMap.value=p.anisotropyMap,e(p.anisotropyMap,g.anisotropyMapTransform))),g.specularIntensity.value=p.specularIntensity,g.specularColor.value.copy(p.specularColor),p.specularColorMap&&(g.specularColorMap.value=p.specularColorMap,e(p.specularColorMap,g.specularColorMapTransform)),p.specularIntensityMap&&(g.specularIntensityMap.value=p.specularIntensityMap,e(p.specularIntensityMap,g.specularIntensityMapTransform))}function m(g,p){p.matcap&&(g.matcap.value=p.matcap)}function v(g,p){const _=t.get(p).light;g.referencePosition.value.setFromMatrixPosition(_.matrixWorld),g.nearDistance.value=_.shadow.camera.near,g.farDistance.value=_.shadow.camera.far}return{refreshFogUniforms:i,refreshMaterialUniforms:s}}function _y(n,t,e,i){let s={},r={},a=[];const o=n.getParameter(n.MAX_UNIFORM_BUFFER_BINDINGS);function c(_,x){const M=x.program;i.uniformBlockBinding(_,M)}function l(_,x){let M=s[_.id];M===void 0&&(m(_),M=h(_),s[_.id]=M,_.addEventListener("dispose",g));const w=x.program;i.updateUBOMapping(_,w);const S=t.render.frame;r[_.id]!==S&&(f(_),r[_.id]=S)}function h(_){const x=u();_.__bindingPointIndex=x;const M=n.createBuffer(),w=_.__size,S=_.usage;return n.bindBuffer(n.UNIFORM_BUFFER,M),n.bufferData(n.UNIFORM_BUFFER,w,S),n.bindBuffer(n.UNIFORM_BUFFER,null),n.bindBufferBase(n.UNIFORM_BUFFER,x,M),M}function u(){for(let _=0;_<o;_++)if(a.indexOf(_)===-1)return a.push(_),_;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function f(_){const x=s[_.id],M=_.uniforms,w=_.__cache;n.bindBuffer(n.UNIFORM_BUFFER,x);for(let S=0,T=M.length;S<T;S++){const A=Array.isArray(M[S])?M[S]:[M[S]];for(let b=0,y=A.length;b<y;b++){const E=A[b];if(d(E,S,b,w)===!0){const R=E.__offset,P=Array.isArray(E.value)?E.value:[E.value];let I=0;for(let F=0;F<P.length;F++){const H=P[F],$=v(H);typeof H=="number"||typeof H=="boolean"?(E.__data[0]=H,n.bufferSubData(n.UNIFORM_BUFFER,R+I,E.__data)):H.isMatrix3?(E.__data[0]=H.elements[0],E.__data[1]=H.elements[1],E.__data[2]=H.elements[2],E.__data[3]=0,E.__data[4]=H.elements[3],E.__data[5]=H.elements[4],E.__data[6]=H.elements[5],E.__data[7]=0,E.__data[8]=H.elements[6],E.__data[9]=H.elements[7],E.__data[10]=H.elements[8],E.__data[11]=0):(H.toArray(E.__data,I),I+=$.storage/Float32Array.BYTES_PER_ELEMENT)}n.bufferSubData(n.UNIFORM_BUFFER,R,E.__data)}}}n.bindBuffer(n.UNIFORM_BUFFER,null)}function d(_,x,M,w){const S=_.value,T=x+"_"+M;if(w[T]===void 0)return typeof S=="number"||typeof S=="boolean"?w[T]=S:w[T]=S.clone(),!0;{const A=w[T];if(typeof S=="number"||typeof S=="boolean"){if(A!==S)return w[T]=S,!0}else if(A.equals(S)===!1)return A.copy(S),!0}return!1}function m(_){const x=_.uniforms;let M=0;const w=16;for(let T=0,A=x.length;T<A;T++){const b=Array.isArray(x[T])?x[T]:[x[T]];for(let y=0,E=b.length;y<E;y++){const R=b[y],P=Array.isArray(R.value)?R.value:[R.value];for(let I=0,F=P.length;I<F;I++){const H=P[I],$=v(H),B=M%w,Y=B%$.boundary,it=B+Y;M+=Y,it!==0&&w-it<$.storage&&(M+=w-it),R.__data=new Float32Array($.storage/Float32Array.BYTES_PER_ELEMENT),R.__offset=M,M+=$.storage}}}const S=M%w;return S>0&&(M+=w-S),_.__size=M,_.__cache={},this}function v(_){const x={boundary:0,storage:0};return typeof _=="number"||typeof _=="boolean"?(x.boundary=4,x.storage=4):_.isVector2?(x.boundary=8,x.storage=8):_.isVector3||_.isColor?(x.boundary=16,x.storage=12):_.isVector4?(x.boundary=16,x.storage=16):_.isMatrix3?(x.boundary=48,x.storage=48):_.isMatrix4?(x.boundary=64,x.storage=64):_.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",_),x}function g(_){const x=_.target;x.removeEventListener("dispose",g);const M=a.indexOf(x.__bindingPointIndex);a.splice(M,1),n.deleteBuffer(s[x.id]),delete s[x.id],delete r[x.id]}function p(){for(const _ in s)n.deleteBuffer(s[_]);a=[],s={},r={}}return{bind:c,update:l,dispose:p}}class My{constructor(t={}){const{canvas:e=f_(),context:i=null,depth:s=!0,stencil:r=!1,alpha:a=!1,antialias:o=!1,premultipliedAlpha:c=!0,preserveDrawingBuffer:l=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:u=!1,reversedDepthBuffer:f=!1}=t;this.isWebGLRenderer=!0;let d;if(i!==null){if(typeof WebGLRenderingContext<"u"&&i instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");d=i.getContextAttributes().alpha}else d=a;const m=new Uint32Array(4),v=new Int32Array(4);let g=null,p=null;const _=[],x=[];this.domElement=e,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=Qs,this.toneMappingExposure=1,this.transmissionResolutionScale=1;const M=this;let w=!1;this._outputColorSpace=gn;let S=0,T=0,A=null,b=-1,y=null;const E=new de,R=new de;let P=null;const I=new gt(0);let F=0,H=e.width,$=e.height,B=1,Y=null,it=null;const mt=new de(0,0,H,$),vt=new de(0,0,H,$);let St=!1;const Ct=new Vf;let Ut=!1,V=!1;const X=new re,z=new C,W=new de,G={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let tt=!1;function at(){return A===null?B:1}let N=i;function et(D,j){return e.getContext(D,j)}try{const D={alpha:!0,depth:s,stencil:r,antialias:o,premultipliedAlpha:c,preserveDrawingBuffer:l,powerPreference:h,failIfMajorPerformanceCaveat:u};if("setAttribute"in e&&e.setAttribute("data-engine",`three.js r${Rf}`),e.addEventListener("webglcontextlost",Rt,!1),e.addEventListener("webglcontextrestored",kt,!1),e.addEventListener("webglcontextcreationerror",yt,!1),N===null){const j="webgl2";if(N=et(j,D),N===null)throw et(j)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(D){throw console.error("THREE.WebGLRenderer: "+D.message),D}let Q,st,ht,pt,_t,bt,ee,Kt,k,L,J,ut,Mt,dt,Vt,At,Bt,Ht,wt,Nt,Qt,Gt,It,ae;function q(){Q=new Lb(N),Q.init(),Gt=new fy(N,Q),st=new yb(N,Q,t,Gt),ht=new hy(N,Q),st.reversedDepthBuffer&&f&&ht.buffers.depth.setReversed(!0),pt=new Db(N),_t=new Jw,bt=new uy(N,Q,ht,_t,st,Gt,pt),ee=new Eb(M),Kt=new Cb(M),k=new BM(N),It=new bb(N,k),L=new Pb(N,k,pt,It),J=new Nb(N,L,k,pt),wt=new Ub(N,st,bt),At=new Sb(_t),ut=new Zw(M,ee,Kt,Q,st,It,At),Mt=new xy(M,_t),dt=new Qw,Vt=new ry(Q),Ht=new Mb(M,ee,Kt,ht,J,d,c),Bt=new cy(M,J,st),ae=new _y(N,pt,st,ht),Nt=new wb(N,Q,pt),Qt=new Ib(N,Q,pt),pt.programs=ut.programs,M.capabilities=st,M.extensions=Q,M.properties=_t,M.renderLists=dt,M.shadowMap=Bt,M.state=ht,M.info=pt}q();const Tt=new gy(M,N);this.xr=Tt,this.getContext=function(){return N},this.getContextAttributes=function(){return N.getContextAttributes()},this.forceContextLoss=function(){const D=Q.get("WEBGL_lose_context");D&&D.loseContext()},this.forceContextRestore=function(){const D=Q.get("WEBGL_lose_context");D&&D.restoreContext()},this.getPixelRatio=function(){return B},this.setPixelRatio=function(D){D!==void 0&&(B=D,this.setSize(H,$,!1))},this.getSize=function(D){return D.set(H,$)},this.setSize=function(D,j,rt=!0){if(Tt.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}H=D,$=j,e.width=Math.floor(D*B),e.height=Math.floor(j*B),rt===!0&&(e.style.width=D+"px",e.style.height=j+"px"),this.setViewport(0,0,D,j)},this.getDrawingBufferSize=function(D){return D.set(H*B,$*B).floor()},this.setDrawingBufferSize=function(D,j,rt){H=D,$=j,B=rt,e.width=Math.floor(D*rt),e.height=Math.floor(j*rt),this.setViewport(0,0,D,j)},this.getCurrentViewport=function(D){return D.copy(E)},this.getViewport=function(D){return D.copy(mt)},this.setViewport=function(D,j,rt,ot){D.isVector4?mt.set(D.x,D.y,D.z,D.w):mt.set(D,j,rt,ot),ht.viewport(E.copy(mt).multiplyScalar(B).round())},this.getScissor=function(D){return D.copy(vt)},this.setScissor=function(D,j,rt,ot){D.isVector4?vt.set(D.x,D.y,D.z,D.w):vt.set(D,j,rt,ot),ht.scissor(R.copy(vt).multiplyScalar(B).round())},this.getScissorTest=function(){return St},this.setScissorTest=function(D){ht.setScissorTest(St=D)},this.setOpaqueSort=function(D){Y=D},this.setTransparentSort=function(D){it=D},this.getClearColor=function(D){return D.copy(Ht.getClearColor())},this.setClearColor=function(){Ht.setClearColor(...arguments)},this.getClearAlpha=function(){return Ht.getClearAlpha()},this.setClearAlpha=function(){Ht.setClearAlpha(...arguments)},this.clear=function(D=!0,j=!0,rt=!0){let ot=0;if(D){let Z=!1;if(A!==null){const Et=A.texture.format;Z=Et===Uf||Et===Df||Et===If}if(Z){const Et=A.texture.type,Dt=Et===Oi||Et===Br||Et===ec||Et===nc||Et===Lf||Et===Pf,Ot=Ht.getClearColor(),Ft=Ht.getClearAlpha(),Jt=Ot.r,te=Ot.g,Yt=Ot.b;Dt?(m[0]=Jt,m[1]=te,m[2]=Yt,m[3]=Ft,N.clearBufferuiv(N.COLOR,0,m)):(v[0]=Jt,v[1]=te,v[2]=Yt,v[3]=Ft,N.clearBufferiv(N.COLOR,0,v))}else ot|=N.COLOR_BUFFER_BIT}j&&(ot|=N.DEPTH_BUFFER_BIT),rt&&(ot|=N.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),N.clear(ot)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){e.removeEventListener("webglcontextlost",Rt,!1),e.removeEventListener("webglcontextrestored",kt,!1),e.removeEventListener("webglcontextcreationerror",yt,!1),Ht.dispose(),dt.dispose(),Vt.dispose(),_t.dispose(),ee.dispose(),Kt.dispose(),J.dispose(),It.dispose(),ae.dispose(),ut.dispose(),Tt.dispose(),Tt.removeEventListener("sessionstart",Hi),Tt.removeEventListener("sessionend",Fd),or.stop()};function Rt(D){D.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),w=!0}function kt(){console.log("THREE.WebGLRenderer: Context Restored."),w=!1;const D=pt.autoReset,j=Bt.enabled,rt=Bt.autoUpdate,ot=Bt.needsUpdate,Z=Bt.type;q(),pt.autoReset=D,Bt.enabled=j,Bt.autoUpdate=rt,Bt.needsUpdate=ot,Bt.type=Z}function yt(D){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",D.statusMessage)}function xt(D){const j=D.target;j.removeEventListener("dispose",xt),zt(j)}function zt(D){se(D),_t.remove(D)}function se(D){const j=_t.get(D).programs;j!==void 0&&(j.forEach(function(rt){ut.releaseProgram(rt)}),D.isShaderMaterial&&ut.releaseShaderCache(D))}this.renderBufferDirect=function(D,j,rt,ot,Z,Et){j===null&&(j=G);const Dt=Z.isMesh&&Z.matrixWorld.determinant()<0,Ot=ex(D,j,rt,ot,Z);ht.setMaterial(ot,Dt);let Ft=rt.index,Jt=1;if(ot.wireframe===!0){if(Ft=L.getWireframeAttribute(rt),Ft===void 0)return;Jt=2}const te=rt.drawRange,Yt=rt.attributes.position;let fe=te.start*Jt,be=(te.start+te.count)*Jt;Et!==null&&(fe=Math.max(fe,Et.start*Jt),be=Math.min(be,(Et.start+Et.count)*Jt)),Ft!==null?(fe=Math.max(fe,0),be=Math.min(be,Ft.count)):Yt!=null&&(fe=Math.max(fe,0),be=Math.min(be,Yt.count));const Be=be-fe;if(Be<0||Be===1/0)return;It.setup(Z,ot,Ot,rt,Ft);let Pe,Ee=Nt;if(Ft!==null&&(Pe=k.get(Ft),Ee=Qt,Ee.setIndex(Pe)),Z.isMesh)ot.wireframe===!0?(ht.setLineWidth(ot.wireframeLinewidth*at()),Ee.setMode(N.LINES)):Ee.setMode(N.TRIANGLES);else if(Z.isLine){let Zt=ot.linewidth;Zt===void 0&&(Zt=1),ht.setLineWidth(Zt*at()),Z.isLineSegments?Ee.setMode(N.LINES):Z.isLineLoop?Ee.setMode(N.LINE_LOOP):Ee.setMode(N.LINE_STRIP)}else Z.isPoints?Ee.setMode(N.POINTS):Z.isSprite&&Ee.setMode(N.TRIANGLES);if(Z.isBatchedMesh)if(Z._multiDrawInstances!==null)rc("THREE.WebGLRenderer: renderMultiDrawInstances has been deprecated and will be removed in r184. Append to renderMultiDraw arguments and use indirection."),Ee.renderMultiDrawInstances(Z._multiDrawStarts,Z._multiDrawCounts,Z._multiDrawCount,Z._multiDrawInstances);else if(Q.get("WEBGL_multi_draw"))Ee.renderMultiDraw(Z._multiDrawStarts,Z._multiDrawCounts,Z._multiDrawCount);else{const Zt=Z._multiDrawStarts,Ue=Z._multiDrawCounts,me=Z._multiDrawCount,Bn=Ft?k.get(Ft).bytesPerElement:1,jr=_t.get(ot).currentProgram.getUniforms();for(let Hn=0;Hn<me;Hn++)jr.setValue(N,"_gl_DrawID",Hn),Ee.render(Zt[Hn]/Bn,Ue[Hn])}else if(Z.isInstancedMesh)Ee.renderInstances(fe,Be,Z.count);else if(rt.isInstancedBufferGeometry){const Zt=rt._maxInstanceCount!==void 0?rt._maxInstanceCount:1/0,Ue=Math.min(rt.instanceCount,Zt);Ee.renderInstances(fe,Be,Ue)}else Ee.render(fe,Be)};function Te(D,j,rt){D.transparent===!0&&D.side===Se&&D.forceSinglePass===!1?(D.side=Fn,D.needsUpdate=!0,Lc(D,j,rt),D.side=ir,D.needsUpdate=!0,Lc(D,j,rt),D.side=Se):Lc(D,j,rt)}this.compile=function(D,j,rt=null){rt===null&&(rt=D),p=Vt.get(rt),p.init(j),x.push(p),rt.traverseVisible(function(Z){Z.isLight&&Z.layers.test(j.layers)&&(p.pushLight(Z),Z.castShadow&&p.pushShadow(Z))}),D!==rt&&D.traverseVisible(function(Z){Z.isLight&&Z.layers.test(j.layers)&&(p.pushLight(Z),Z.castShadow&&p.pushShadow(Z))}),p.setupLights();const ot=new Set;return D.traverse(function(Z){if(!(Z.isMesh||Z.isPoints||Z.isLine||Z.isSprite))return;const Et=Z.material;if(Et)if(Array.isArray(Et))for(let Dt=0;Dt<Et.length;Dt++){const Ot=Et[Dt];Te(Ot,rt,Z),ot.add(Ot)}else Te(Et,rt,Z),ot.add(Et)}),p=x.pop(),ot},this.compileAsync=function(D,j,rt=null){const ot=this.compile(D,j,rt);return new Promise(Z=>{function Et(){if(ot.forEach(function(Dt){_t.get(Dt).currentProgram.isReady()&&ot.delete(Dt)}),ot.size===0){Z(D);return}setTimeout(Et,10)}Q.get("KHR_parallel_shader_compile")!==null?Et():setTimeout(Et,10)})};let _e=null;function ls(D){_e&&_e(D)}function Hi(){or.stop()}function Fd(){or.start()}const or=new Ug;or.setAnimationLoop(ls),typeof self<"u"&&or.setContext(self),this.setAnimationLoop=function(D){_e=D,Tt.setAnimationLoop(D),D===null?or.stop():or.start()},Tt.addEventListener("sessionstart",Hi),Tt.addEventListener("sessionend",Fd),this.render=function(D,j){if(j!==void 0&&j.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(w===!0)return;if(D.matrixWorldAutoUpdate===!0&&D.updateMatrixWorld(),j.parent===null&&j.matrixWorldAutoUpdate===!0&&j.updateMatrixWorld(),Tt.enabled===!0&&Tt.isPresenting===!0&&(Tt.cameraAutoUpdate===!0&&Tt.updateCamera(j),j=Tt.getCamera()),D.isScene===!0&&D.onBeforeRender(M,D,j,A),p=Vt.get(D,x.length),p.init(j),x.push(p),X.multiplyMatrices(j.projectionMatrix,j.matrixWorldInverse),Ct.setFromProjectionMatrix(X,ns,j.reversedDepth),V=this.localClippingEnabled,Ut=At.init(this.clippingPlanes,V),g=dt.get(D,_.length),g.init(),_.push(g),Tt.enabled===!0&&Tt.isPresenting===!0){const Et=M.xr.getDepthSensingMesh();Et!==null&&Lh(Et,j,-1/0,M.sortObjects)}Lh(D,j,0,M.sortObjects),g.finish(),M.sortObjects===!0&&g.sort(Y,it),tt=Tt.enabled===!1||Tt.isPresenting===!1||Tt.hasDepthSensing()===!1,tt&&Ht.addToRenderList(g,D),this.info.render.frame++,Ut===!0&&At.beginShadows();const rt=p.state.shadowsArray;Bt.render(rt,D,j),Ut===!0&&At.endShadows(),this.info.autoReset===!0&&this.info.reset();const ot=g.opaque,Z=g.transmissive;if(p.setupLights(),j.isArrayCamera){const Et=j.cameras;if(Z.length>0)for(let Dt=0,Ot=Et.length;Dt<Ot;Dt++){const Ft=Et[Dt];Od(ot,Z,D,Ft)}tt&&Ht.render(D);for(let Dt=0,Ot=Et.length;Dt<Ot;Dt++){const Ft=Et[Dt];kd(g,D,Ft,Ft.viewport)}}else Z.length>0&&Od(ot,Z,D,j),tt&&Ht.render(D),kd(g,D,j);A!==null&&T===0&&(bt.updateMultisampleRenderTarget(A),bt.updateRenderTargetMipmap(A)),D.isScene===!0&&D.onAfterRender(M,D,j),It.resetDefaultState(),b=-1,y=null,x.pop(),x.length>0?(p=x[x.length-1],Ut===!0&&At.setGlobalState(M.clippingPlanes,p.state.camera)):p=null,_.pop(),_.length>0?g=_[_.length-1]:g=null};function Lh(D,j,rt,ot){if(D.visible===!1)return;if(D.layers.test(j.layers)){if(D.isGroup)rt=D.renderOrder;else if(D.isLOD)D.autoUpdate===!0&&D.update(j);else if(D.isLight)p.pushLight(D),D.castShadow&&p.pushShadow(D);else if(D.isSprite){if(!D.frustumCulled||Ct.intersectsSprite(D)){ot&&W.setFromMatrixPosition(D.matrixWorld).applyMatrix4(X);const Dt=J.update(D),Ot=D.material;Ot.visible&&g.push(D,Dt,Ot,rt,W.z,null)}}else if((D.isMesh||D.isLine||D.isPoints)&&(!D.frustumCulled||Ct.intersectsObject(D))){const Dt=J.update(D),Ot=D.material;if(ot&&(D.boundingSphere!==void 0?(D.boundingSphere===null&&D.computeBoundingSphere(),W.copy(D.boundingSphere.center)):(Dt.boundingSphere===null&&Dt.computeBoundingSphere(),W.copy(Dt.boundingSphere.center)),W.applyMatrix4(D.matrixWorld).applyMatrix4(X)),Array.isArray(Ot)){const Ft=Dt.groups;for(let Jt=0,te=Ft.length;Jt<te;Jt++){const Yt=Ft[Jt],fe=Ot[Yt.materialIndex];fe&&fe.visible&&g.push(D,Dt,fe,rt,W.z,Yt)}}else Ot.visible&&g.push(D,Dt,Ot,rt,W.z,null)}}const Et=D.children;for(let Dt=0,Ot=Et.length;Dt<Ot;Dt++)Lh(Et[Dt],j,rt,ot)}function kd(D,j,rt,ot){const Z=D.opaque,Et=D.transmissive,Dt=D.transparent;p.setupLightsView(rt),Ut===!0&&At.setGlobalState(M.clippingPlanes,rt),ot&&ht.viewport(E.copy(ot)),Z.length>0&&Cc(Z,j,rt),Et.length>0&&Cc(Et,j,rt),Dt.length>0&&Cc(Dt,j,rt),ht.buffers.depth.setTest(!0),ht.buffers.depth.setMask(!0),ht.buffers.color.setMask(!0),ht.setPolygonOffset(!1)}function Od(D,j,rt,ot){if((rt.isScene===!0?rt.overrideMaterial:null)!==null)return;p.state.transmissionRenderTarget[ot.id]===void 0&&(p.state.transmissionRenderTarget[ot.id]=new yn(1,1,{generateMipmaps:!0,type:Q.has("EXT_color_buffer_half_float")||Q.has("EXT_color_buffer_float")?Xr:Oi,minFilter:$s,samples:4,stencilBuffer:r,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:ge.workingColorSpace}));const Et=p.state.transmissionRenderTarget[ot.id],Dt=ot.viewport||E;Et.setSize(Dt.z*M.transmissionResolutionScale,Dt.w*M.transmissionResolutionScale);const Ot=M.getRenderTarget(),Ft=M.getActiveCubeFace(),Jt=M.getActiveMipmapLevel();M.setRenderTarget(Et),M.getClearColor(I),F=M.getClearAlpha(),F<1&&M.setClearColor(16777215,.5),M.clear(),tt&&Ht.render(rt);const te=M.toneMapping;M.toneMapping=Qs;const Yt=ot.viewport;if(ot.viewport!==void 0&&(ot.viewport=void 0),p.setupLightsView(ot),Ut===!0&&At.setGlobalState(M.clippingPlanes,ot),Cc(D,rt,ot),bt.updateMultisampleRenderTarget(Et),bt.updateRenderTargetMipmap(Et),Q.has("WEBGL_multisampled_render_to_texture")===!1){let fe=!1;for(let be=0,Be=j.length;be<Be;be++){const Pe=j[be],Ee=Pe.object,Zt=Pe.geometry,Ue=Pe.material,me=Pe.group;if(Ue.side===Se&&Ee.layers.test(ot.layers)){const Bn=Ue.side;Ue.side=Fn,Ue.needsUpdate=!0,Bd(Ee,rt,ot,Zt,Ue,me),Ue.side=Bn,Ue.needsUpdate=!0,fe=!0}}fe===!0&&(bt.updateMultisampleRenderTarget(Et),bt.updateRenderTargetMipmap(Et))}M.setRenderTarget(Ot,Ft,Jt),M.setClearColor(I,F),Yt!==void 0&&(ot.viewport=Yt),M.toneMapping=te}function Cc(D,j,rt){const ot=j.isScene===!0?j.overrideMaterial:null;for(let Z=0,Et=D.length;Z<Et;Z++){const Dt=D[Z],Ot=Dt.object,Ft=Dt.geometry,Jt=Dt.group;let te=Dt.material;te.allowOverride===!0&&ot!==null&&(te=ot),Ot.layers.test(rt.layers)&&Bd(Ot,j,rt,Ft,te,Jt)}}function Bd(D,j,rt,ot,Z,Et){D.onBeforeRender(M,j,rt,ot,Z,Et),D.modelViewMatrix.multiplyMatrices(rt.matrixWorldInverse,D.matrixWorld),D.normalMatrix.getNormalMatrix(D.modelViewMatrix),Z.onBeforeRender(M,j,rt,ot,D,Et),Z.transparent===!0&&Z.side===Se&&Z.forceSinglePass===!1?(Z.side=Fn,Z.needsUpdate=!0,M.renderBufferDirect(rt,j,ot,Z,D,Et),Z.side=ir,Z.needsUpdate=!0,M.renderBufferDirect(rt,j,ot,Z,D,Et),Z.side=Se):M.renderBufferDirect(rt,j,ot,Z,D,Et),D.onAfterRender(M,j,rt,ot,Z,Et)}function Lc(D,j,rt){j.isScene!==!0&&(j=G);const ot=_t.get(D),Z=p.state.lights,Et=p.state.shadowsArray,Dt=Z.state.version,Ot=ut.getParameters(D,Z.state,Et,j,rt),Ft=ut.getProgramCacheKey(Ot);let Jt=ot.programs;ot.environment=D.isMeshStandardMaterial?j.environment:null,ot.fog=j.fog,ot.envMap=(D.isMeshStandardMaterial?Kt:ee).get(D.envMap||ot.environment),ot.envMapRotation=ot.environment!==null&&D.envMap===null?j.environmentRotation:D.envMapRotation,Jt===void 0&&(D.addEventListener("dispose",xt),Jt=new Map,ot.programs=Jt);let te=Jt.get(Ft);if(te!==void 0){if(ot.currentProgram===te&&ot.lightsStateVersion===Dt)return zd(D,Ot),te}else Ot.uniforms=ut.getUniforms(D),D.onBeforeCompile(Ot,M),te=ut.acquireProgram(Ot,Ft),Jt.set(Ft,te),ot.uniforms=Ot.uniforms;const Yt=ot.uniforms;return(!D.isShaderMaterial&&!D.isRawShaderMaterial||D.clipping===!0)&&(Yt.clippingPlanes=At.uniform),zd(D,Ot),ot.needsLights=ix(D),ot.lightsStateVersion=Dt,ot.needsLights&&(Yt.ambientLightColor.value=Z.state.ambient,Yt.lightProbe.value=Z.state.probe,Yt.directionalLights.value=Z.state.directional,Yt.directionalLightShadows.value=Z.state.directionalShadow,Yt.spotLights.value=Z.state.spot,Yt.spotLightShadows.value=Z.state.spotShadow,Yt.rectAreaLights.value=Z.state.rectArea,Yt.ltc_1.value=Z.state.rectAreaLTC1,Yt.ltc_2.value=Z.state.rectAreaLTC2,Yt.pointLights.value=Z.state.point,Yt.pointLightShadows.value=Z.state.pointShadow,Yt.hemisphereLights.value=Z.state.hemi,Yt.directionalShadowMap.value=Z.state.directionalShadowMap,Yt.directionalShadowMatrix.value=Z.state.directionalShadowMatrix,Yt.spotShadowMap.value=Z.state.spotShadowMap,Yt.spotLightMatrix.value=Z.state.spotLightMatrix,Yt.spotLightMap.value=Z.state.spotLightMap,Yt.pointShadowMap.value=Z.state.pointShadowMap,Yt.pointShadowMatrix.value=Z.state.pointShadowMatrix),ot.currentProgram=te,ot.uniformsList=null,te}function Hd(D){if(D.uniformsList===null){const j=D.currentProgram.getUniforms();D.uniformsList=Cl.seqWithValue(j.seq,D.uniforms)}return D.uniformsList}function zd(D,j){const rt=_t.get(D);rt.outputColorSpace=j.outputColorSpace,rt.batching=j.batching,rt.batchingColor=j.batchingColor,rt.instancing=j.instancing,rt.instancingColor=j.instancingColor,rt.instancingMorph=j.instancingMorph,rt.skinning=j.skinning,rt.morphTargets=j.morphTargets,rt.morphNormals=j.morphNormals,rt.morphColors=j.morphColors,rt.morphTargetsCount=j.morphTargetsCount,rt.numClippingPlanes=j.numClippingPlanes,rt.numIntersection=j.numClipIntersection,rt.vertexAlphas=j.vertexAlphas,rt.vertexTangents=j.vertexTangents,rt.toneMapping=j.toneMapping}function ex(D,j,rt,ot,Z){j.isScene!==!0&&(j=G),bt.resetTextureUnits();const Et=j.fog,Dt=ot.isMeshStandardMaterial?j.environment:null,Ot=A===null?M.outputColorSpace:A.isXRRenderTarget===!0?A.texture.colorSpace:Hr,Ft=(ot.isMeshStandardMaterial?Kt:ee).get(ot.envMap||Dt),Jt=ot.vertexColors===!0&&!!rt.attributes.color&&rt.attributes.color.itemSize===4,te=!!rt.attributes.tangent&&(!!ot.normalMap||ot.anisotropy>0),Yt=!!rt.morphAttributes.position,fe=!!rt.morphAttributes.normal,be=!!rt.morphAttributes.color;let Be=Qs;ot.toneMapped&&(A===null||A.isXRRenderTarget===!0)&&(Be=M.toneMapping);const Pe=rt.morphAttributes.position||rt.morphAttributes.normal||rt.morphAttributes.color,Ee=Pe!==void 0?Pe.length:0,Zt=_t.get(ot),Ue=p.state.lights;if(Ut===!0&&(V===!0||D!==y)){const xn=D===y&&ot.id===b;At.setState(ot,D,xn)}let me=!1;ot.version===Zt.__version?(Zt.needsLights&&Zt.lightsStateVersion!==Ue.state.version||Zt.outputColorSpace!==Ot||Z.isBatchedMesh&&Zt.batching===!1||!Z.isBatchedMesh&&Zt.batching===!0||Z.isBatchedMesh&&Zt.batchingColor===!0&&Z.colorTexture===null||Z.isBatchedMesh&&Zt.batchingColor===!1&&Z.colorTexture!==null||Z.isInstancedMesh&&Zt.instancing===!1||!Z.isInstancedMesh&&Zt.instancing===!0||Z.isSkinnedMesh&&Zt.skinning===!1||!Z.isSkinnedMesh&&Zt.skinning===!0||Z.isInstancedMesh&&Zt.instancingColor===!0&&Z.instanceColor===null||Z.isInstancedMesh&&Zt.instancingColor===!1&&Z.instanceColor!==null||Z.isInstancedMesh&&Zt.instancingMorph===!0&&Z.morphTexture===null||Z.isInstancedMesh&&Zt.instancingMorph===!1&&Z.morphTexture!==null||Zt.envMap!==Ft||ot.fog===!0&&Zt.fog!==Et||Zt.numClippingPlanes!==void 0&&(Zt.numClippingPlanes!==At.numPlanes||Zt.numIntersection!==At.numIntersection)||Zt.vertexAlphas!==Jt||Zt.vertexTangents!==te||Zt.morphTargets!==Yt||Zt.morphNormals!==fe||Zt.morphColors!==be||Zt.toneMapping!==Be||Zt.morphTargetsCount!==Ee)&&(me=!0):(me=!0,Zt.__version=ot.version);let Bn=Zt.currentProgram;me===!0&&(Bn=Lc(ot,j,Z));let jr=!1,Hn=!1,bo=!1;const Ne=Bn.getUniforms(),si=Zt.uniforms;if(ht.useProgram(Bn.program)&&(jr=!0,Hn=!0,bo=!0),ot.id!==b&&(b=ot.id,Hn=!0),jr||y!==D){ht.buffers.depth.getReversed()&&D.reversedDepth!==!0&&(D._reversedDepth=!0,D.updateProjectionMatrix()),Ne.setValue(N,"projectionMatrix",D.projectionMatrix),Ne.setValue(N,"viewMatrix",D.matrixWorldInverse);const An=Ne.map.cameraPosition;An!==void 0&&An.setValue(N,z.setFromMatrixPosition(D.matrixWorld)),st.logarithmicDepthBuffer&&Ne.setValue(N,"logDepthBufFC",2/(Math.log(D.far+1)/Math.LN2)),(ot.isMeshPhongMaterial||ot.isMeshToonMaterial||ot.isMeshLambertMaterial||ot.isMeshBasicMaterial||ot.isMeshStandardMaterial||ot.isShaderMaterial)&&Ne.setValue(N,"isOrthographic",D.isOrthographicCamera===!0),y!==D&&(y=D,Hn=!0,bo=!0)}if(Z.isSkinnedMesh){Ne.setOptional(N,Z,"bindMatrix"),Ne.setOptional(N,Z,"bindMatrixInverse");const xn=Z.skeleton;xn&&(xn.boneTexture===null&&xn.computeBoneTexture(),Ne.setValue(N,"boneTexture",xn.boneTexture,bt))}Z.isBatchedMesh&&(Ne.setOptional(N,Z,"batchingTexture"),Ne.setValue(N,"batchingTexture",Z._matricesTexture,bt),Ne.setOptional(N,Z,"batchingIdTexture"),Ne.setValue(N,"batchingIdTexture",Z._indirectTexture,bt),Ne.setOptional(N,Z,"batchingColorTexture"),Z._colorsTexture!==null&&Ne.setValue(N,"batchingColorTexture",Z._colorsTexture,bt));const ri=rt.morphAttributes;if((ri.position!==void 0||ri.normal!==void 0||ri.color!==void 0)&&wt.update(Z,rt,Bn),(Hn||Zt.receiveShadow!==Z.receiveShadow)&&(Zt.receiveShadow=Z.receiveShadow,Ne.setValue(N,"receiveShadow",Z.receiveShadow)),ot.isMeshGouraudMaterial&&ot.envMap!==null&&(si.envMap.value=Ft,si.flipEnvMap.value=Ft.isCubeTexture&&Ft.isRenderTargetTexture===!1?-1:1),ot.isMeshStandardMaterial&&ot.envMap===null&&j.environment!==null&&(si.envMapIntensity.value=j.environmentIntensity),Hn&&(Ne.setValue(N,"toneMappingExposure",M.toneMappingExposure),Zt.needsLights&&nx(si,bo),Et&&ot.fog===!0&&Mt.refreshFogUniforms(si,Et),Mt.refreshMaterialUniforms(si,ot,B,$,p.state.transmissionRenderTarget[D.id]),Cl.upload(N,Hd(Zt),si,bt)),ot.isShaderMaterial&&ot.uniformsNeedUpdate===!0&&(Cl.upload(N,Hd(Zt),si,bt),ot.uniformsNeedUpdate=!1),ot.isSpriteMaterial&&Ne.setValue(N,"center",Z.center),Ne.setValue(N,"modelViewMatrix",Z.modelViewMatrix),Ne.setValue(N,"normalMatrix",Z.normalMatrix),Ne.setValue(N,"modelMatrix",Z.matrixWorld),ot.isShaderMaterial||ot.isRawShaderMaterial){const xn=ot.uniformsGroups;for(let An=0,Ph=xn.length;An<Ph;An++){const cr=xn[An];ae.update(cr,Bn),ae.bind(cr,Bn)}}return Bn}function nx(D,j){D.ambientLightColor.needsUpdate=j,D.lightProbe.needsUpdate=j,D.directionalLights.needsUpdate=j,D.directionalLightShadows.needsUpdate=j,D.pointLights.needsUpdate=j,D.pointLightShadows.needsUpdate=j,D.spotLights.needsUpdate=j,D.spotLightShadows.needsUpdate=j,D.rectAreaLights.needsUpdate=j,D.hemisphereLights.needsUpdate=j}function ix(D){return D.isMeshLambertMaterial||D.isMeshToonMaterial||D.isMeshPhongMaterial||D.isMeshStandardMaterial||D.isShadowMaterial||D.isShaderMaterial&&D.lights===!0}this.getActiveCubeFace=function(){return S},this.getActiveMipmapLevel=function(){return T},this.getRenderTarget=function(){return A},this.setRenderTargetTextures=function(D,j,rt){const ot=_t.get(D);ot.__autoAllocateDepthBuffer=D.resolveDepthBuffer===!1,ot.__autoAllocateDepthBuffer===!1&&(ot.__useRenderToTexture=!1),_t.get(D.texture).__webglTexture=j,_t.get(D.depthTexture).__webglTexture=ot.__autoAllocateDepthBuffer?void 0:rt,ot.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(D,j){const rt=_t.get(D);rt.__webglFramebuffer=j,rt.__useDefaultFramebuffer=j===void 0};const sx=N.createFramebuffer();this.setRenderTarget=function(D,j=0,rt=0){A=D,S=j,T=rt;let ot=!0,Z=null,Et=!1,Dt=!1;if(D){const Ft=_t.get(D);if(Ft.__useDefaultFramebuffer!==void 0)ht.bindFramebuffer(N.FRAMEBUFFER,null),ot=!1;else if(Ft.__webglFramebuffer===void 0)bt.setupRenderTarget(D);else if(Ft.__hasExternalTextures)bt.rebindTextures(D,_t.get(D.texture).__webglTexture,_t.get(D.depthTexture).__webglTexture);else if(D.depthBuffer){const Yt=D.depthTexture;if(Ft.__boundDepthTexture!==Yt){if(Yt!==null&&_t.has(Yt)&&(D.width!==Yt.image.width||D.height!==Yt.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");bt.setupDepthRenderbuffer(D)}}const Jt=D.texture;(Jt.isData3DTexture||Jt.isDataArrayTexture||Jt.isCompressedArrayTexture)&&(Dt=!0);const te=_t.get(D).__webglFramebuffer;D.isWebGLCubeRenderTarget?(Array.isArray(te[j])?Z=te[j][rt]:Z=te[j],Et=!0):D.samples>0&&bt.useMultisampledRTT(D)===!1?Z=_t.get(D).__webglMultisampledFramebuffer:Array.isArray(te)?Z=te[rt]:Z=te,E.copy(D.viewport),R.copy(D.scissor),P=D.scissorTest}else E.copy(mt).multiplyScalar(B).floor(),R.copy(vt).multiplyScalar(B).floor(),P=St;if(rt!==0&&(Z=sx),ht.bindFramebuffer(N.FRAMEBUFFER,Z)&&ot&&ht.drawBuffers(D,Z),ht.viewport(E),ht.scissor(R),ht.setScissorTest(P),Et){const Ft=_t.get(D.texture);N.framebufferTexture2D(N.FRAMEBUFFER,N.COLOR_ATTACHMENT0,N.TEXTURE_CUBE_MAP_POSITIVE_X+j,Ft.__webglTexture,rt)}else if(Dt){const Ft=j;for(let Jt=0;Jt<D.textures.length;Jt++){const te=_t.get(D.textures[Jt]);N.framebufferTextureLayer(N.FRAMEBUFFER,N.COLOR_ATTACHMENT0+Jt,te.__webglTexture,rt,Ft)}}else if(D!==null&&rt!==0){const Ft=_t.get(D.texture);N.framebufferTexture2D(N.FRAMEBUFFER,N.COLOR_ATTACHMENT0,N.TEXTURE_2D,Ft.__webglTexture,rt)}b=-1},this.readRenderTargetPixels=function(D,j,rt,ot,Z,Et,Dt,Ot=0){if(!(D&&D.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Ft=_t.get(D).__webglFramebuffer;if(D.isWebGLCubeRenderTarget&&Dt!==void 0&&(Ft=Ft[Dt]),Ft){ht.bindFramebuffer(N.FRAMEBUFFER,Ft);try{const Jt=D.textures[Ot],te=Jt.format,Yt=Jt.type;if(!st.textureFormatReadable(te)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!st.textureTypeReadable(Yt)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}j>=0&&j<=D.width-ot&&rt>=0&&rt<=D.height-Z&&(D.textures.length>1&&N.readBuffer(N.COLOR_ATTACHMENT0+Ot),N.readPixels(j,rt,ot,Z,Gt.convert(te),Gt.convert(Yt),Et))}finally{const Jt=A!==null?_t.get(A).__webglFramebuffer:null;ht.bindFramebuffer(N.FRAMEBUFFER,Jt)}}},this.readRenderTargetPixelsAsync=async function(D,j,rt,ot,Z,Et,Dt,Ot=0){if(!(D&&D.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let Ft=_t.get(D).__webglFramebuffer;if(D.isWebGLCubeRenderTarget&&Dt!==void 0&&(Ft=Ft[Dt]),Ft)if(j>=0&&j<=D.width-ot&&rt>=0&&rt<=D.height-Z){ht.bindFramebuffer(N.FRAMEBUFFER,Ft);const Jt=D.textures[Ot],te=Jt.format,Yt=Jt.type;if(!st.textureFormatReadable(te))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!st.textureTypeReadable(Yt))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");const fe=N.createBuffer();N.bindBuffer(N.PIXEL_PACK_BUFFER,fe),N.bufferData(N.PIXEL_PACK_BUFFER,Et.byteLength,N.STREAM_READ),D.textures.length>1&&N.readBuffer(N.COLOR_ATTACHMENT0+Ot),N.readPixels(j,rt,ot,Z,Gt.convert(te),Gt.convert(Yt),0);const be=A!==null?_t.get(A).__webglFramebuffer:null;ht.bindFramebuffer(N.FRAMEBUFFER,be);const Be=N.fenceSync(N.SYNC_GPU_COMMANDS_COMPLETE,0);return N.flush(),await d_(N,Be,4),N.bindBuffer(N.PIXEL_PACK_BUFFER,fe),N.getBufferSubData(N.PIXEL_PACK_BUFFER,0,Et),N.deleteBuffer(fe),N.deleteSync(Be),Et}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(D,j=null,rt=0){const ot=Math.pow(2,-rt),Z=Math.floor(D.image.width*ot),Et=Math.floor(D.image.height*ot),Dt=j!==null?j.x:0,Ot=j!==null?j.y:0;bt.setTexture2D(D,0),N.copyTexSubImage2D(N.TEXTURE_2D,rt,0,0,Dt,Ot,Z,Et),ht.unbindTexture()};const rx=N.createFramebuffer(),ax=N.createFramebuffer();this.copyTextureToTexture=function(D,j,rt=null,ot=null,Z=0,Et=null){Et===null&&(Z!==0?(rc("WebGLRenderer: copyTextureToTexture function signature has changed to support src and dst mipmap levels."),Et=Z,Z=0):Et=0);let Dt,Ot,Ft,Jt,te,Yt,fe,be,Be;const Pe=D.isCompressedTexture?D.mipmaps[Et]:D.image;if(rt!==null)Dt=rt.max.x-rt.min.x,Ot=rt.max.y-rt.min.y,Ft=rt.isBox3?rt.max.z-rt.min.z:1,Jt=rt.min.x,te=rt.min.y,Yt=rt.isBox3?rt.min.z:0;else{const ri=Math.pow(2,-Z);Dt=Math.floor(Pe.width*ri),Ot=Math.floor(Pe.height*ri),D.isDataArrayTexture?Ft=Pe.depth:D.isData3DTexture?Ft=Math.floor(Pe.depth*ri):Ft=1,Jt=0,te=0,Yt=0}ot!==null?(fe=ot.x,be=ot.y,Be=ot.z):(fe=0,be=0,Be=0);const Ee=Gt.convert(j.format),Zt=Gt.convert(j.type);let Ue;j.isData3DTexture?(bt.setTexture3D(j,0),Ue=N.TEXTURE_3D):j.isDataArrayTexture||j.isCompressedArrayTexture?(bt.setTexture2DArray(j,0),Ue=N.TEXTURE_2D_ARRAY):(bt.setTexture2D(j,0),Ue=N.TEXTURE_2D),N.pixelStorei(N.UNPACK_FLIP_Y_WEBGL,j.flipY),N.pixelStorei(N.UNPACK_PREMULTIPLY_ALPHA_WEBGL,j.premultiplyAlpha),N.pixelStorei(N.UNPACK_ALIGNMENT,j.unpackAlignment);const me=N.getParameter(N.UNPACK_ROW_LENGTH),Bn=N.getParameter(N.UNPACK_IMAGE_HEIGHT),jr=N.getParameter(N.UNPACK_SKIP_PIXELS),Hn=N.getParameter(N.UNPACK_SKIP_ROWS),bo=N.getParameter(N.UNPACK_SKIP_IMAGES);N.pixelStorei(N.UNPACK_ROW_LENGTH,Pe.width),N.pixelStorei(N.UNPACK_IMAGE_HEIGHT,Pe.height),N.pixelStorei(N.UNPACK_SKIP_PIXELS,Jt),N.pixelStorei(N.UNPACK_SKIP_ROWS,te),N.pixelStorei(N.UNPACK_SKIP_IMAGES,Yt);const Ne=D.isDataArrayTexture||D.isData3DTexture,si=j.isDataArrayTexture||j.isData3DTexture;if(D.isDepthTexture){const ri=_t.get(D),xn=_t.get(j),An=_t.get(ri.__renderTarget),Ph=_t.get(xn.__renderTarget);ht.bindFramebuffer(N.READ_FRAMEBUFFER,An.__webglFramebuffer),ht.bindFramebuffer(N.DRAW_FRAMEBUFFER,Ph.__webglFramebuffer);for(let cr=0;cr<Ft;cr++)Ne&&(N.framebufferTextureLayer(N.READ_FRAMEBUFFER,N.COLOR_ATTACHMENT0,_t.get(D).__webglTexture,Z,Yt+cr),N.framebufferTextureLayer(N.DRAW_FRAMEBUFFER,N.COLOR_ATTACHMENT0,_t.get(j).__webglTexture,Et,Be+cr)),N.blitFramebuffer(Jt,te,Dt,Ot,fe,be,Dt,Ot,N.DEPTH_BUFFER_BIT,N.NEAREST);ht.bindFramebuffer(N.READ_FRAMEBUFFER,null),ht.bindFramebuffer(N.DRAW_FRAMEBUFFER,null)}else if(Z!==0||D.isRenderTargetTexture||_t.has(D)){const ri=_t.get(D),xn=_t.get(j);ht.bindFramebuffer(N.READ_FRAMEBUFFER,rx),ht.bindFramebuffer(N.DRAW_FRAMEBUFFER,ax);for(let An=0;An<Ft;An++)Ne?N.framebufferTextureLayer(N.READ_FRAMEBUFFER,N.COLOR_ATTACHMENT0,ri.__webglTexture,Z,Yt+An):N.framebufferTexture2D(N.READ_FRAMEBUFFER,N.COLOR_ATTACHMENT0,N.TEXTURE_2D,ri.__webglTexture,Z),si?N.framebufferTextureLayer(N.DRAW_FRAMEBUFFER,N.COLOR_ATTACHMENT0,xn.__webglTexture,Et,Be+An):N.framebufferTexture2D(N.DRAW_FRAMEBUFFER,N.COLOR_ATTACHMENT0,N.TEXTURE_2D,xn.__webglTexture,Et),Z!==0?N.blitFramebuffer(Jt,te,Dt,Ot,fe,be,Dt,Ot,N.COLOR_BUFFER_BIT,N.NEAREST):si?N.copyTexSubImage3D(Ue,Et,fe,be,Be+An,Jt,te,Dt,Ot):N.copyTexSubImage2D(Ue,Et,fe,be,Jt,te,Dt,Ot);ht.bindFramebuffer(N.READ_FRAMEBUFFER,null),ht.bindFramebuffer(N.DRAW_FRAMEBUFFER,null)}else si?D.isDataTexture||D.isData3DTexture?N.texSubImage3D(Ue,Et,fe,be,Be,Dt,Ot,Ft,Ee,Zt,Pe.data):j.isCompressedArrayTexture?N.compressedTexSubImage3D(Ue,Et,fe,be,Be,Dt,Ot,Ft,Ee,Pe.data):N.texSubImage3D(Ue,Et,fe,be,Be,Dt,Ot,Ft,Ee,Zt,Pe):D.isDataTexture?N.texSubImage2D(N.TEXTURE_2D,Et,fe,be,Dt,Ot,Ee,Zt,Pe.data):D.isCompressedTexture?N.compressedTexSubImage2D(N.TEXTURE_2D,Et,fe,be,Pe.width,Pe.height,Ee,Pe.data):N.texSubImage2D(N.TEXTURE_2D,Et,fe,be,Dt,Ot,Ee,Zt,Pe);N.pixelStorei(N.UNPACK_ROW_LENGTH,me),N.pixelStorei(N.UNPACK_IMAGE_HEIGHT,Bn),N.pixelStorei(N.UNPACK_SKIP_PIXELS,jr),N.pixelStorei(N.UNPACK_SKIP_ROWS,Hn),N.pixelStorei(N.UNPACK_SKIP_IMAGES,bo),Et===0&&j.generateMipmaps&&N.generateMipmap(Ue),ht.unbindTexture()},this.initRenderTarget=function(D){_t.get(D).__webglFramebuffer===void 0&&bt.setupRenderTarget(D)},this.initTexture=function(D){D.isCubeTexture?bt.setTextureCube(D,0):D.isData3DTexture?bt.setTexture3D(D,0):D.isDataArrayTexture||D.isCompressedArrayTexture?bt.setTexture2DArray(D,0):bt.setTexture2D(D,0),ht.unbindTexture()},this.resetState=function(){S=0,T=0,A=null,ht.reset(),It.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return ns}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(t){this._outputColorSpace=t;const e=this.getContext();e.drawingBufferColorSpace=ge._getDrawingBufferColorSpace(t),e.unpackColorSpace=ge._getUnpackColorSpace()}}function by(n,t,e=.85){return{f:e*Math.max(n,t),cx:n/2,cy:t/2,w:n,h:t}}function m0(n,t,e,i=.5){let s=0,r=0,a=0,o=0,c=0,l=0,h=0,u=0,f=0;for(let _=0;_<n.length&&_<t.length;_++){const x=n[_],M=t[_],w=Math.min(x.v,M.v);if(w<i)continue;const S=(M.x*e.w-e.cx)/e.f,T=(e.cy-M.y*e.h)/e.f,A=-S*x.z-x.x,b=-T*x.z-x.y;s+=w,r+=w*S,c+=w*S*S,l+=w*A,u+=w*S*A,a+=w,o+=w*T,c+=w*T*T,h+=w*b,u+=w*T*b,f++}if(f<4)return null;const d=c-r*r/s-o*o/a,m=u-r*l/s-o*h/a;if(Math.abs(d)<1e-9)return null;const v=m/d,g=(l-r*v)/s,p=(h-o*v)/a;return!(v<-.2)||!isFinite(g)||!isFinite(p)?null:{x:g,y:p,z:v}}function co(n,t){const e=-n.z;return{x:(t.cx+t.f*n.x/e)/t.w,y:(t.cy-t.f*n.y/e)/t.h}}const hl=(n,t)=>({x:(n.x+t.x)/2,y:(n.y+t.y)/2,z:(n.z+t.z)/2,v:Math.min(n.v,t.v)}),zi=(n,t)=>Math.hypot(n.x-t.x,n.y-t.y,n.z-t.z);function ep(n){const t=zi(hl(n[U.shL],n[U.shR]),hl(n[U.hipL],n[U.hipR])),e=(zi(n[U.shL],n[U.elL])+zi(n[U.shR],n[U.elR]))/2,i=(zi(n[U.elL],n[U.wrL])+zi(n[U.elR],n[U.wrR]))/2,s=(zi(n[U.hipL],n[U.knL])+zi(n[U.hipR],n[U.knR]))/2,r=(zi(n[U.knL],n[U.anL])+zi(n[U.knR],n[U.anR]))/2,a=zi(hl(n[U.shL],n[U.shR]),hl(n[U.earL],n[U.earR]));return{torso:t,upperArm:e,forearm:i,thigh:s,shin:r,neck:a}}const qu={hipSeen:.5,keep:.5,keepWithin:ss.degToRad(30),flat:ss.degToRad(50),holdS:.35,screenUp:ss.degToRad(35),screenLen:.7},hc=n=>new C(n.x,n.y,n.z),lo=(n,t)=>hc(n).add(hc(t)).multiplyScalar(.5),wy=[U.hipL,U.hipR,U.knL,U.knR,U.anL,U.anR,U.heelL,U.heelR,U.toeL,U.toeR];function $u(n,t,e){const i=lo(n[U.shL],n[U.shR]),s=lo(n[U.hipL],n[U.hipR]),r=i.clone().sub(s),a=new le().setFromUnitVectors(r.clone().normalize(),t),o=i.clone().addScaledVector(t,-e),c=s.clone().sub(i).applyQuaternion(a).add(i),l=o.clone().sub(c),h=n.map(u=>({...u}));for(const u of wy){const f=hc(n[u]).sub(i).applyQuaternion(a).add(i).add(l);h[u]={x:f.x,y:f.y,z:f.z,v:n[u].v}}for(const u of h)u.x-=o.x,u.y-=o.y,u.z-=o.z;return h}function Bg(n,t,e,i,s){const r=hc(n[U.shL]).sub(hc(n[U.shR]));if(r.lengthSq()<1e-8)return null;r.normalize();const a=t.clone().addScaledVector(r,-t.dot(r));if(a.lengthSq()<.05)return null;a.normalize();const o=e.clone().addScaledVector(r,-e.dot(r));if(o.lengthSq()<1e-8)return a;o.normalize();const c=Math.atan2(new C().crossVectors(a,o).dot(r),a.dot(o)),l=Math.abs(c)<=s?i:0;return a.applyAxisAngle(r,c*l)}function yy(n,t,e,i){const s=qu,r=lo(n[U.shL],n[U.shR]),a=lo(n[U.hipL],n[U.hipR]),o=r.clone().sub(a),c=i.len&&i.len>.2?i.len:o.length();if(o.lengthSq()<1e-8)return{world:n,verdict:"kept"};const l=o.clone().normalize();if(!(Math.min(t[U.hipL].v,t[U.hipR].v)>=s.hipSeen))return i.state.flatSince=null,{world:n,verdict:"torso shot"};if(l.angleTo(e)<=s.flat)return i.state.flatSince=null,{world:n,verdict:"kept"};const f=i.aspect??1,d=((t[U.shL].x+t[U.shR].x)/2-(t[U.hipL].x+t[U.hipR].x)/2)*f,m=(t[U.shL].y+t[U.shR].y)/2-(t[U.hipL].y+t[U.hipR].y)/2,v=new ft(e.x,-e.y),g=new ft(d,m),p=v.lengthSq()>1e-6&&g.lengthSq()>1e-10?Math.acos(Math.max(-1,Math.min(1,v.normalize().dot(g.clone().normalize())))):Math.PI,_=i.f&&i.depth?c*i.f/i.depth:0;if(p<s.screenUp&&(!_||g.length()>=s.screenLen*_)){i.state.flatSince=null;const M=Bg(n,e,l,s.keep,s.keepWithin);return M?{world:$u(n,M,c),verdict:"stood up"}:{world:n,verdict:"kept"}}if(i.state.flatSince===null&&(i.state.flatSince=i.now),i.now-i.state.flatSince<s.holdS*1e3){const M=new C().crossVectors(e,l);if(M.lengthSq()<1e-8)return{world:n,verdict:"holding"};const w=e.clone().applyAxisAngle(M.normalize(),s.flat);return{world:$u(n,w,c),verdict:"holding"}}return{world:n,verdict:"accepted"}}const Sy=(n,t,e)=>{const i=Math.min(1,Math.max(0,(e-n)/(t-n)));return i*i*(3-2*i)};function Ey(n,t,e,i){const s=Sy(.3,.7,i);if(s>=1)return n.map(h=>({...h}));const r=lo(n[U.shL],n[U.shR]),a=lo(n[U.hipL],n[U.hipR]),o=r.sub(a);if(o.lengthSq()<1e-8)return n.map(h=>({...h}));const c=Bg(n,t,o.normalize(),qu.keep,qu.keepWithin);if(!c)return n.map(h=>({...h}));const l=$u(n,c,e>.2?e:o.length());return s<=0?l:l.map((h,u)=>{const f=n[u];return{x:h.x+(f.x-h.x)*s,y:h.y+(f.y-h.y)*s,z:h.z+(f.z-h.z)*s,v:f.v}})}const Rn={tauWorld:.068,tauImage:.053,tauZ:.21,tauLen:1.5,tauVis:.25,tauCore:.135,fadeIn:.22,fadeOut:.35,forgetAfter:.6,confirm:3,matchRadius:1.3,rDepth:.03},np=n=>{const t=[U.shL,U.shR,U.hipL,U.hipR];let e=0,i=0,s=0;for(const c of t){const l=n[c];e+=l.x,i+=l.y,s++}e/=s,i/=s;const r=(n[U.shL].x+n[U.shR].x)/2-(n[U.hipL].x+n[U.hipR].x)/2,a=(n[U.shL].y+n[U.shR].y)/2-(n[U.hipL].y+n[U.hipR].y)/2,o=Math.hypot(n[U.shL].x-n[U.shR].x,n[U.shL].y-n[U.shR].y);return{x:e,y:i,s:Math.max(Math.hypot(r,a),o,.04)}},Ua=(n,t,e)=>n+(t-n)*e,ga=(n,t)=>1-Math.exp(-n/Math.max(t,1e-4)),Ty=new Set([0,1,2,3,4,5,6,7,8,9,10,U.shL,U.shR,U.hipL,U.hipR]);function ip(n,t,e,i,s=e){for(let r=0;r<Q0;r++){const a=n[r],o=t[r],c=Ty.has(r)?s:e;a.x=Ua(a.x,o.x,c),a.y=Ua(a.y,o.y,c),a.z=Ua(a.z,o.z,c),a.v=Ua(a.v,o.v,i)}}const sp=n=>n.map(t=>({...t})),Ay=[U.nose,U.eyeL,U.eyeR,U.earL,U.earR,U.shL,U.shR,U.hipL,U.hipR];function Ry(n,t){let e=0,i=0,s=0;for(const r of Ay){const a=n[r],o=t[r],c=Math.min(a.v,o.v);c<.5||(e+=(o.x-a.x)*c,i+=(o.y-a.y)*c,s+=c)}if(s<1.5)return{dx:0,dy:0};e/=s,i/=s;for(const r of n)r.x+=e,r.y+=i;return{dx:e,dy:i}}const Cy=new C(0,1,0),Ly=[U.shL,U.shR,U.hipL,U.hipR];function Py(n,t){let e=0,i=0,s=0;for(const a of Ly){const o=n.image[a],c=n.world[a],l=Math.max(0,Math.min(1,(o.v-.4)/.4));if(l<=0)continue;const h=-(n.T.z+c.z);if(h<=.05)continue;const u=t.cx+t.f*(n.T.x+c.x)/h,f=t.cy-t.f*(n.T.y+c.y)/h;e+=(o.x*t.w-u)*l,i+=(o.y*t.h-f)*l,s+=l}if(s<.5)return;const r=-n.T.z;n.T={x:n.T.x+e/s*r/t.f,y:n.T.y-i/s*r/t.f,z:n.T.z}}class Iy{tracks=[];all=[];nextId=1;last=-1;shaped(t,e,i,s){return Ey(t,s,i,Math.min(e[U.hipL].v,e[U.hipR].v))}check(t,e,i,s,r,a){return yy(e.world,e.image,r,{len:t.len?.torso,f:s.f/s.h,aspect:s.w/s.h,depth:-i.z,now:a,state:t.up})}update(t,e,i,s=Cy){const r=this.last<0?.03333333333333333:Math.min(.25,Math.max(.001,(e-this.last)/1e3));this.last=e;const a=t.map(u=>({d:u,T:m0(u.world,u.image,i),c:np(u.image)})).filter(u=>u.T),o=this.all.filter(u=>!u.lost||u.presence>0),c=[];o.forEach((u,f)=>{const d=np(u.image);a.forEach((m,v)=>{const g=Math.hypot(d.x-m.c.x,d.y-m.c.y)/d.s;g<Rn.matchRadius&&c.push({ti:f,di:v,cost:g})})}),c.sort((u,f)=>u.cost-f.cost);const l=new Set,h=new Set;for(const u of c){if(l.has(u.ti)||h.has(u.di))continue;l.add(u.ti),h.add(u.di);const f=o[u.ti],d=a[u.di],m=f.lost,v=m?1:ga(r,Rn.tauVis),g=this.check(f,d.d,f.T,i,s,e);f.verdict=g.verdict,ip(f.wsm,g.world,m?1:ga(r,Rn.tauWorld),v,m?1:ga(r,Rn.tauCore)),m||Ry(f.image,d.d.image),ip(f.image,d.d.image,m?1:ga(r,Rn.tauImage),v),f.world=this.shaped(f.wsm,f.image,f.len.torso,s),Math.min(f.image[U.hipL].v,f.image[U.hipR].v)<.7&&f.verdict==="kept"&&(f.verdict="torso shot");const p=m0(f.world,f.image,i)??d.T;if(m)f.T={...p},f.kf?.z.reset(0,p.z,Rn.rDepth**2);else{const M=Ua(f.T.z,p.z,ga(r,Rn.tauZ)),w=M/p.z;f.T={x:p.x*w,y:p.y*w,z:M}}Py(f,i);const _=ep(f.wsm),x=ga(r,Rn.tauLen);for(const M of Object.keys(_))f.len[M]=Ua(f.len[M],_[M],x);f.seen=e,f.lost=!1,f.det=d.d,f.hits++}a.forEach((u,f)=>{if(h.has(f))return;const d={flatSince:null},m=this.check({up:d},u.d,u.T,i,s,e),v=sp(m.world),g=sp(u.d.image),p=ep(v),_=this.shaped(v,g,p.torso,s),x=m0(_,g,i)??u.T;this.all.push({id:this.nextId++,born:e,seen:e,image:g,world:_,wsm:v,T:{...x},len:p,presence:0,hits:1,lost:!1,det:u.d,up:d,verdict:m.verdict,kf:null})});for(const u of this.all){u.seen!==e&&(u.lost=!0,u.det=null);const f=u.hits>=Rn.confirm;u.presence=u.lost?Math.max(0,u.presence-r/Rn.fadeOut):f?Math.min(1,u.presence+r/Rn.fadeIn):0}return this.all=this.all.filter(u=>!(u.lost&&u.hits<Rn.confirm)&&!(u.lost&&u.presence<=0&&e-u.seen>Rn.forgetAfter*1e3)),this.tracks=this.all.filter(u=>u.hits>=Rn.confirm),this.tracks}clear(){this.tracks=[],this.all=[],this.last=-1}}const Dy={armL:[.2,-1,0],forearmL:[.15,-1,.1],armR:[-.2,-1,0],forearmR:[-.15,-1,.1],thighL:[.05,-1,0],shinL:[0,-1,0],footL:[0,-.15,1],thighR:[-.05,-1,0],shinR:[0,-1,0],footR:[0,-.15,1]};function Uy(n,t){const e=n.scale??1,i=m=>new C(...n.dir?.[m]??Dy[m]).normalize(),s=Array.from({length:Q0},()=>new C),r=(m,v)=>s[m].copy(v),a=(m,v,g)=>new C(m,v,g).multiplyScalar(e);r(U.hipL,a(.1,0,0)),r(U.hipR,a(-.1,0,0)),r(U.shL,a(.19,.52,-.02)),r(U.shR,a(-.19,.52,-.02));const o=new le().setFromEuler(new Tn(n.head?.[1]??0,n.head?.[0]??0,0,"YXZ")),c=a(0,.6,-.02),l=(m,v,g)=>a(m,v,g).applyQuaternion(o).add(c);r(U.nose,l(0,.1,.11)),r(U.eyeL,l(.032,.135,.09)),r(U.eyeR,l(-.032,.135,.09)),r(U.eyeInL,l(.018,.135,.095)),r(U.eyeInR,l(-.018,.135,.095)),r(U.eyeOutL,l(.05,.135,.08)),r(U.eyeOutR,l(-.05,.135,.08)),r(U.earL,l(.075,.12,0)),r(U.earR,l(-.075,.12,0)),r(U.mouthL,l(.024,.06,.095)),r(U.mouthR,l(-.024,.06,.095));for(const m of["L","R"]){const v=s[m==="L"?U.shL:U.shR],g=s[m==="L"?U.hipL:U.hipR],p=v.clone().addScaledVector(i(`arm${m}`),.29*e),_=p.clone().addScaledVector(i(`forearm${m}`),.26*e);r(m==="L"?U.elL:U.elR,p),r(m==="L"?U.wrL:U.wrR,_);const x=_.clone().addScaledVector(i(`forearm${m}`),.08*e);r(m==="L"?U.indexL:U.indexR,x.clone().add(a(0,0,.02))),r(m==="L"?U.pinkyL:U.pinkyR,x.clone().add(a(0,0,-.02))),r(m==="L"?U.thumbL:U.thumbR,_.clone().addScaledVector(i(`forearm${m}`),.04*e).add(a(0,0,.04)));const M=g.clone().addScaledVector(i(`thigh${m}`),.43*e),w=M.clone().addScaledVector(i(`shin${m}`),.42*e);r(m==="L"?U.knL:U.knR,M),r(m==="L"?U.anL:U.anR,w);const S=w.clone().add(a(0,-.04,-.05));r(m==="L"?U.heelL:U.heelR,S),r(m==="L"?U.toeL:U.toeR,S.clone().addScaledVector(i(`foot${m}`),.24*e))}const h=new le().setFromAxisAngle(new C(0,1,0),n.yaw??0),u=new Set([U.knL,U.knR,U.anL,U.anR,U.heelL,U.heelR,U.toeL,U.toeR]),f=[],d=[];for(let m=0;m<Q0;m++){const v=s[m].clone().applyQuaternion(h),g=u.has(m)?n.legsVis??.98:.98;f.push({x:v.x,y:v.y,z:v.z,v:g});const p=co({x:v.x+n.T.x,y:v.y+n.T.y,z:v.z+n.T.z},t);d.push({x:p.x,y:p.y,z:0,v:g})}return{world:f,image:d}}function Ny(n,t,e){const i=[];for(let s=0;s<n;s++){const r=t*1.3+s*2.1,a=(s-(n-1)/2)*.9+Math.sin(t*.4+s)*.15,o=Math.sin(r);i.push(Uy({T:{x:a,y:-.1+.03*Math.sin(r*2),z:-3-s*.6},yaw:Math.sin(t*.5+s)*.5,head:[Math.sin(t*.7+s)*.4,Math.sin(t*.9)*.15],dir:{armR:[-1,.3+.5*o,.1],forearmR:[-.3,1,.1+.3*o],armL:[.5+.4*Math.cos(r),-.8+.6*Math.cos(r*.5),.3],forearmL:[.2,-.3,1],thighL:[.12,-1,.25*Math.max(0,o)],shinL:[.05,-1,-.2*Math.max(0,o)]},scale:1-s*.08},e))}return i}function Fy(n,t,e,i){const s=n.image,r=new Float32Array(t*e),a=d=>[s[d].x*i,s[d].y],o=Math.hypot(a(U.shL)[0]-a(U.hipL)[0],a(U.shL)[1]-a(U.hipL)[1]),c=[[U.shL,U.elL,.11],[U.elL,U.wrL,.09],[U.shR,U.elR,.11],[U.elR,U.wrR,.09],[U.hipL,U.knL,.15],[U.knL,U.anL,.11],[U.hipR,U.knR,.15],[U.knR,U.anR,.11],[U.anL,U.toeL,.07],[U.anR,U.toeR,.07],[U.shL,U.hipR,.2],[U.shR,U.hipL,.2],[U.shL,U.shR,.14],[U.hipL,U.hipR,.16]],l=a(U.nose),h=a(U.earL),u=a(U.earR),f=Math.max(Math.hypot(h[0]-u[0],h[1]-u[1])*.9,o*.22);for(let d=0;d<e;d++)for(let m=0;m<t;m++){const v=(m+.5)/t*i,g=(d+.5)/e;let p=Math.hypot(v-l[0],g-(l[1]-f*.2))-f;for(const[_,x,M]of c){const w=a(_),S=a(x),T=S[0]-w[0],A=S[1]-w[1],b=T*T+A*A||1,y=Math.max(0,Math.min(1,((v-w[0])*T+(g-w[1])*A)/b));p=Math.min(p,Math.hypot(v-w[0]-T*y,g-w[1]-A*y)-M*o)}r[d*t+m]=Math.max(0,Math.min(1,.5-p/(o*.04)))}return{data:r,w:t,h:e}}function ky(n){const t=new Map,e=new Map,i=n.clone();return Hg(n,i,function(s,r){t.set(r,s),e.set(s,r)}),i.traverse(function(s){if(!s.isSkinnedMesh)return;const r=s,a=t.get(s),o=a.skeleton.bones;r.skeleton=a.skeleton.clone(),r.bindMatrix.copy(a.bindMatrix),r.skeleton.bones=o.map(function(c){return e.get(c)}),r.bind(r.skeleton,r.bindMatrix)}),i}function Hg(n,t,e){e(n,t);for(let i=0;i<n.children.length;i++)Hg(n.children[i],t.children[i],e)}class zg extends nt{constructor(t,e,i=!1,s=!1,r=1e4){const a=new xe;super(a,e),this.isMarchingCubes=!0;const o=this,c=new Float32Array(36),l=new Float32Array(36),h=new Float32Array(36);this.enableUvs=i,this.enableColors=s,this.init=function(_){this.resolution=_,this.isolation=80,this.size=_,this.size2=this.size*this.size,this.size3=this.size2*this.size,this.halfsize=this.size/2,this.delta=2/this.size,this.yd=this.size,this.zd=this.size2,this.field=new Float32Array(this.size3),this.normal_cache=new Float32Array(this.size3*3),this.palette=new Float32Array(this.size3*3),this.count=0;const x=r*3;this.positionArray=new Float32Array(x*3);const M=new $t(this.positionArray,3);M.setUsage(Ic),a.setAttribute("position",M),this.normalArray=new Float32Array(x*3);const w=new $t(this.normalArray,3);if(w.setUsage(Ic),a.setAttribute("normal",w),this.enableUvs){this.uvArray=new Float32Array(x*2);const S=new $t(this.uvArray,2);S.setUsage(Ic),a.setAttribute("uv",S)}if(this.enableColors){this.colorArray=new Float32Array(x*3);const S=new $t(this.colorArray,3);S.setUsage(Ic),a.setAttribute("color",S)}a.boundingSphere=new rr(new C,1)};function u(_,x,M){return _+(x-_)*M}function f(_,x,M,w,S,T,A,b,y,E){const R=(M-A)/(b-A),P=o.normal_cache;c[x+0]=w+R*o.delta,c[x+1]=S,c[x+2]=T,l[x+0]=u(P[_+0],P[_+3],R),l[x+1]=u(P[_+1],P[_+4],R),l[x+2]=u(P[_+2],P[_+5],R),h[x+0]=u(o.palette[y*3+0],o.palette[E*3+0],R),h[x+1]=u(o.palette[y*3+1],o.palette[E*3+1],R),h[x+2]=u(o.palette[y*3+2],o.palette[E*3+2],R)}function d(_,x,M,w,S,T,A,b,y,E){const R=(M-A)/(b-A),P=o.normal_cache;c[x+0]=w,c[x+1]=S+R*o.delta,c[x+2]=T;const I=_+o.yd*3;l[x+0]=u(P[_+0],P[I+0],R),l[x+1]=u(P[_+1],P[I+1],R),l[x+2]=u(P[_+2],P[I+2],R),h[x+0]=u(o.palette[y*3+0],o.palette[E*3+0],R),h[x+1]=u(o.palette[y*3+1],o.palette[E*3+1],R),h[x+2]=u(o.palette[y*3+2],o.palette[E*3+2],R)}function m(_,x,M,w,S,T,A,b,y,E){const R=(M-A)/(b-A),P=o.normal_cache;c[x+0]=w,c[x+1]=S,c[x+2]=T+R*o.delta;const I=_+o.zd*3;l[x+0]=u(P[_+0],P[I+0],R),l[x+1]=u(P[_+1],P[I+1],R),l[x+2]=u(P[_+2],P[I+2],R),h[x+0]=u(o.palette[y*3+0],o.palette[E*3+0],R),h[x+1]=u(o.palette[y*3+1],o.palette[E*3+1],R),h[x+2]=u(o.palette[y*3+2],o.palette[E*3+2],R)}function v(_){const x=_*3;o.normal_cache[x]===0&&(o.normal_cache[x+0]=o.field[_-1]-o.field[_+1],o.normal_cache[x+1]=o.field[_-o.yd]-o.field[_+o.yd],o.normal_cache[x+2]=o.field[_-o.zd]-o.field[_+o.zd])}function g(_,x,M,w,S){const T=w+1,A=w+o.yd,b=w+o.zd,y=T+o.yd,E=T+o.zd,R=w+o.yd+o.zd,P=T+o.yd+o.zd;let I=0;const F=o.field[w],H=o.field[T],$=o.field[A],B=o.field[y],Y=o.field[b],it=o.field[E],mt=o.field[R],vt=o.field[P];F<S&&(I|=1),H<S&&(I|=2),$<S&&(I|=8),B<S&&(I|=4),Y<S&&(I|=16),it<S&&(I|=32),mt<S&&(I|=128),vt<S&&(I|=64);const St=Oy[I];if(St===0)return 0;const Ct=o.delta,Ut=_+Ct,V=x+Ct,X=M+Ct;St&1&&(v(w),v(T),f(w*3,0,S,_,x,M,F,H,w,T)),St&2&&(v(T),v(y),d(T*3,3,S,Ut,x,M,H,B,T,y)),St&4&&(v(A),v(y),f(A*3,6,S,_,V,M,$,B,A,y)),St&8&&(v(w),v(A),d(w*3,9,S,_,x,M,F,$,w,A)),St&16&&(v(b),v(E),f(b*3,12,S,_,x,X,Y,it,b,E)),St&32&&(v(E),v(P),d(E*3,15,S,Ut,x,X,it,vt,E,P)),St&64&&(v(R),v(P),f(R*3,18,S,_,V,X,mt,vt,R,P)),St&128&&(v(b),v(R),d(b*3,21,S,_,x,X,Y,mt,b,R)),St&256&&(v(w),v(b),m(w*3,24,S,_,x,M,F,Y,w,b)),St&512&&(v(T),v(E),m(T*3,27,S,Ut,x,M,H,it,T,E)),St&1024&&(v(y),v(P),m(y*3,30,S,Ut,V,M,B,vt,y,P)),St&2048&&(v(A),v(R),m(A*3,33,S,_,V,M,$,mt,A,R)),I<<=4;let z,W,G,tt=0,at=0;for(;ul[I+at]!=-1;)z=I+at,W=z+1,G=z+2,p(c,l,h,3*ul[z],3*ul[W],3*ul[G]),at+=3,tt++;return tt}function p(_,x,M,w,S,T){const A=o.count*3;if(o.positionArray[A+0]=_[w],o.positionArray[A+1]=_[w+1],o.positionArray[A+2]=_[w+2],o.positionArray[A+3]=_[S],o.positionArray[A+4]=_[S+1],o.positionArray[A+5]=_[S+2],o.positionArray[A+6]=_[T],o.positionArray[A+7]=_[T+1],o.positionArray[A+8]=_[T+2],o.material.flatShading===!0){const b=(x[w+0]+x[S+0]+x[T+0])/3,y=(x[w+1]+x[S+1]+x[T+1])/3,E=(x[w+2]+x[S+2]+x[T+2])/3;o.normalArray[A+0]=b,o.normalArray[A+1]=y,o.normalArray[A+2]=E,o.normalArray[A+3]=b,o.normalArray[A+4]=y,o.normalArray[A+5]=E,o.normalArray[A+6]=b,o.normalArray[A+7]=y,o.normalArray[A+8]=E}else o.normalArray[A+0]=x[w+0],o.normalArray[A+1]=x[w+1],o.normalArray[A+2]=x[w+2],o.normalArray[A+3]=x[S+0],o.normalArray[A+4]=x[S+1],o.normalArray[A+5]=x[S+2],o.normalArray[A+6]=x[T+0],o.normalArray[A+7]=x[T+1],o.normalArray[A+8]=x[T+2];if(o.enableUvs){const b=o.count*2;o.uvArray[b+0]=_[w+0],o.uvArray[b+1]=_[w+2],o.uvArray[b+2]=_[S+0],o.uvArray[b+3]=_[S+2],o.uvArray[b+4]=_[T+0],o.uvArray[b+5]=_[T+2]}o.enableColors&&(o.colorArray[A+0]=M[w+0],o.colorArray[A+1]=M[w+1],o.colorArray[A+2]=M[w+2],o.colorArray[A+3]=M[S+0],o.colorArray[A+4]=M[S+1],o.colorArray[A+5]=M[S+2],o.colorArray[A+6]=M[T+0],o.colorArray[A+7]=M[T+1],o.colorArray[A+8]=M[T+2]),o.count+=3}this.addBall=function(_,x,M,w,S,T){const A=Math.sign(w);w=Math.abs(w);const b=T!=null;let y=new gt(_,x,M);if(b)try{y=T instanceof gt?T:Array.isArray(T)?new gt(Math.min(Math.abs(T[0]),1),Math.min(Math.abs(T[1]),1),Math.min(Math.abs(T[2]),1)):new gt(T)}catch{y=new gt(_,x,M)}const E=this.size*Math.sqrt(w/S),R=M*this.size,P=x*this.size,I=_*this.size;let F=Math.floor(R-E);F<1&&(F=1);let H=Math.floor(R+E);H>this.size-1&&(H=this.size-1);let $=Math.floor(P-E);$<1&&($=1);let B=Math.floor(P+E);B>this.size-1&&(B=this.size-1);let Y=Math.floor(I-E);Y<1&&(Y=1);let it=Math.floor(I+E);it>this.size-1&&(it=this.size-1);let mt,vt,St,Ct,Ut,V,X,z,W,G,tt;for(St=F;St<H;St++)for(Ut=this.size2*St,z=St/this.size-M,W=z*z,vt=$;vt<B;vt++)for(Ct=Ut+this.size*vt,X=vt/this.size-x,G=X*X,mt=Y;mt<it;mt++)if(V=mt/this.size-_,tt=w/(1e-6+V*V+G+W)-S,tt>0){this.field[Ct+mt]+=tt*A;const at=Math.sqrt((mt-I)*(mt-I)+(vt-P)*(vt-P)+(St-R)*(St-R))/E,N=1-at*at*at*(at*(at*6-15)+10);this.palette[(Ct+mt)*3+0]+=y.r*N,this.palette[(Ct+mt)*3+1]+=y.g*N,this.palette[(Ct+mt)*3+2]+=y.b*N}},this.addPlaneX=function(_,x){const M=this.size,w=this.yd,S=this.zd,T=this.field;let A,b,y,E,R,P,I,F=M*Math.sqrt(_/x);for(F>M&&(F=M),A=0;A<F;A++)if(P=A/M,E=P*P,R=_/(1e-4+E)-x,R>0)for(b=0;b<M;b++)for(I=A+b*w,y=0;y<M;y++)T[S*y+I]+=R},this.addPlaneY=function(_,x){const M=this.size,w=this.yd,S=this.zd,T=this.field;let A,b,y,E,R,P,I,F,H=M*Math.sqrt(_/x);for(H>M&&(H=M),b=0;b<H;b++)if(P=b/M,E=P*P,R=_/(1e-4+E)-x,R>0)for(I=b*w,A=0;A<M;A++)for(F=I+A,y=0;y<M;y++)T[S*y+F]+=R},this.addPlaneZ=function(_,x){const M=this.size,w=this.yd,S=this.zd,T=this.field;let A,b,y,E,R,P,I,F,H=M*Math.sqrt(_/x);for(H>M&&(H=M),y=0;y<H;y++)if(P=y/M,E=P*P,R=_/(1e-4+E)-x,R>0)for(I=S*y,b=0;b<M;b++)for(F=I+b*w,A=0;A<M;A++)T[F+A]+=R},this.setCell=function(_,x,M,w){const S=this.size2*M+this.size*x+_;this.field[S]=w},this.getCell=function(_,x,M){const w=this.size2*M+this.size*x+_;return this.field[w]},this.blur=function(_=1){const x=this.field,M=x.slice(),w=this.size,S=this.size2;for(let T=0;T<w;T++)for(let A=0;A<w;A++)for(let b=0;b<w;b++){const y=S*b+w*A+T;let E=M[y],R=1;for(let P=-1;P<=1;P+=2){const I=P+T;if(!(I<0||I>=w))for(let F=-1;F<=1;F+=2){const H=F+A;if(!(H<0||H>=w))for(let $=-1;$<=1;$+=2){const B=$+b;if(B<0||B>=w)continue;const Y=S*B+w*H+I,it=M[Y];R++,E+=_*(it-E)/R}}}x[y]=E}},this.reset=function(){for(let _=0;_<this.size3;_++)this.normal_cache[_*3]=0,this.field[_]=0,this.palette[_*3]=this.palette[_*3+1]=this.palette[_*3+2]=0},this.update=function(){this.count=0;const _=this.size-2;for(let x=1;x<_;x++){const M=this.size2*x,w=(x-this.halfsize)/this.halfsize;for(let S=1;S<_;S++){const T=M+this.size*S,A=(S-this.halfsize)/this.halfsize;for(let b=1;b<_;b++){const y=(b-this.halfsize)/this.halfsize,E=T+b;g(y,A,w,E,this.isolation)}}}this.geometry.setDrawRange(0,this.count),a.getAttribute("position").needsUpdate=!0,a.getAttribute("normal").needsUpdate=!0,this.enableUvs&&(a.getAttribute("uv").needsUpdate=!0),this.enableColors&&(a.getAttribute("color").needsUpdate=!0),this.count/3>r&&console.warn("THREE.MarchingCubes: Geometry buffers too small for rendering. Please create an instance with a higher poly count.")},this.init(t)}}const Oy=new Int32Array([0,265,515,778,1030,1295,1541,1804,2060,2309,2575,2822,3082,3331,3593,3840,400,153,915,666,1430,1183,1941,1692,2460,2197,2975,2710,3482,3219,3993,3728,560,825,51,314,1590,1855,1077,1340,2620,2869,2111,2358,3642,3891,3129,3376,928,681,419,170,1958,1711,1445,1196,2988,2725,2479,2214,4010,3747,3497,3232,1120,1385,1635,1898,102,367,613,876,3180,3429,3695,3942,2154,2403,2665,2912,1520,1273,2035,1786,502,255,1013,764,3580,3317,4095,3830,2554,2291,3065,2800,1616,1881,1107,1370,598,863,85,348,3676,3925,3167,3414,2650,2899,2137,2384,1984,1737,1475,1226,966,719,453,204,4044,3781,3535,3270,3018,2755,2505,2240,2240,2505,2755,3018,3270,3535,3781,4044,204,453,719,966,1226,1475,1737,1984,2384,2137,2899,2650,3414,3167,3925,3676,348,85,863,598,1370,1107,1881,1616,2800,3065,2291,2554,3830,4095,3317,3580,764,1013,255,502,1786,2035,1273,1520,2912,2665,2403,2154,3942,3695,3429,3180,876,613,367,102,1898,1635,1385,1120,3232,3497,3747,4010,2214,2479,2725,2988,1196,1445,1711,1958,170,419,681,928,3376,3129,3891,3642,2358,2111,2869,2620,1340,1077,1855,1590,314,51,825,560,3728,3993,3219,3482,2710,2975,2197,2460,1692,1941,1183,1430,666,915,153,400,3840,3593,3331,3082,2822,2575,2309,2060,1804,1541,1295,1030,778,515,265,0]),ul=new Int32Array([-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,8,3,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,1,9,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,1,8,3,9,8,1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,1,2,10,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,8,3,1,2,10,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,9,2,10,0,2,9,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,2,8,3,2,10,8,10,9,8,-1,-1,-1,-1,-1,-1,-1,3,11,2,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,11,2,8,11,0,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,1,9,0,2,3,11,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,1,11,2,1,9,11,9,8,11,-1,-1,-1,-1,-1,-1,-1,3,10,1,11,10,3,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,10,1,0,8,10,8,11,10,-1,-1,-1,-1,-1,-1,-1,3,9,0,3,11,9,11,10,9,-1,-1,-1,-1,-1,-1,-1,9,8,10,10,8,11,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,4,7,8,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,4,3,0,7,3,4,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,1,9,8,4,7,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,4,1,9,4,7,1,7,3,1,-1,-1,-1,-1,-1,-1,-1,1,2,10,8,4,7,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,3,4,7,3,0,4,1,2,10,-1,-1,-1,-1,-1,-1,-1,9,2,10,9,0,2,8,4,7,-1,-1,-1,-1,-1,-1,-1,2,10,9,2,9,7,2,7,3,7,9,4,-1,-1,-1,-1,8,4,7,3,11,2,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,11,4,7,11,2,4,2,0,4,-1,-1,-1,-1,-1,-1,-1,9,0,1,8,4,7,2,3,11,-1,-1,-1,-1,-1,-1,-1,4,7,11,9,4,11,9,11,2,9,2,1,-1,-1,-1,-1,3,10,1,3,11,10,7,8,4,-1,-1,-1,-1,-1,-1,-1,1,11,10,1,4,11,1,0,4,7,11,4,-1,-1,-1,-1,4,7,8,9,0,11,9,11,10,11,0,3,-1,-1,-1,-1,4,7,11,4,11,9,9,11,10,-1,-1,-1,-1,-1,-1,-1,9,5,4,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,9,5,4,0,8,3,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,5,4,1,5,0,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,8,5,4,8,3,5,3,1,5,-1,-1,-1,-1,-1,-1,-1,1,2,10,9,5,4,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,3,0,8,1,2,10,4,9,5,-1,-1,-1,-1,-1,-1,-1,5,2,10,5,4,2,4,0,2,-1,-1,-1,-1,-1,-1,-1,2,10,5,3,2,5,3,5,4,3,4,8,-1,-1,-1,-1,9,5,4,2,3,11,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,11,2,0,8,11,4,9,5,-1,-1,-1,-1,-1,-1,-1,0,5,4,0,1,5,2,3,11,-1,-1,-1,-1,-1,-1,-1,2,1,5,2,5,8,2,8,11,4,8,5,-1,-1,-1,-1,10,3,11,10,1,3,9,5,4,-1,-1,-1,-1,-1,-1,-1,4,9,5,0,8,1,8,10,1,8,11,10,-1,-1,-1,-1,5,4,0,5,0,11,5,11,10,11,0,3,-1,-1,-1,-1,5,4,8,5,8,10,10,8,11,-1,-1,-1,-1,-1,-1,-1,9,7,8,5,7,9,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,9,3,0,9,5,3,5,7,3,-1,-1,-1,-1,-1,-1,-1,0,7,8,0,1,7,1,5,7,-1,-1,-1,-1,-1,-1,-1,1,5,3,3,5,7,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,9,7,8,9,5,7,10,1,2,-1,-1,-1,-1,-1,-1,-1,10,1,2,9,5,0,5,3,0,5,7,3,-1,-1,-1,-1,8,0,2,8,2,5,8,5,7,10,5,2,-1,-1,-1,-1,2,10,5,2,5,3,3,5,7,-1,-1,-1,-1,-1,-1,-1,7,9,5,7,8,9,3,11,2,-1,-1,-1,-1,-1,-1,-1,9,5,7,9,7,2,9,2,0,2,7,11,-1,-1,-1,-1,2,3,11,0,1,8,1,7,8,1,5,7,-1,-1,-1,-1,11,2,1,11,1,7,7,1,5,-1,-1,-1,-1,-1,-1,-1,9,5,8,8,5,7,10,1,3,10,3,11,-1,-1,-1,-1,5,7,0,5,0,9,7,11,0,1,0,10,11,10,0,-1,11,10,0,11,0,3,10,5,0,8,0,7,5,7,0,-1,11,10,5,7,11,5,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,10,6,5,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,8,3,5,10,6,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,9,0,1,5,10,6,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,1,8,3,1,9,8,5,10,6,-1,-1,-1,-1,-1,-1,-1,1,6,5,2,6,1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,1,6,5,1,2,6,3,0,8,-1,-1,-1,-1,-1,-1,-1,9,6,5,9,0,6,0,2,6,-1,-1,-1,-1,-1,-1,-1,5,9,8,5,8,2,5,2,6,3,2,8,-1,-1,-1,-1,2,3,11,10,6,5,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,11,0,8,11,2,0,10,6,5,-1,-1,-1,-1,-1,-1,-1,0,1,9,2,3,11,5,10,6,-1,-1,-1,-1,-1,-1,-1,5,10,6,1,9,2,9,11,2,9,8,11,-1,-1,-1,-1,6,3,11,6,5,3,5,1,3,-1,-1,-1,-1,-1,-1,-1,0,8,11,0,11,5,0,5,1,5,11,6,-1,-1,-1,-1,3,11,6,0,3,6,0,6,5,0,5,9,-1,-1,-1,-1,6,5,9,6,9,11,11,9,8,-1,-1,-1,-1,-1,-1,-1,5,10,6,4,7,8,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,4,3,0,4,7,3,6,5,10,-1,-1,-1,-1,-1,-1,-1,1,9,0,5,10,6,8,4,7,-1,-1,-1,-1,-1,-1,-1,10,6,5,1,9,7,1,7,3,7,9,4,-1,-1,-1,-1,6,1,2,6,5,1,4,7,8,-1,-1,-1,-1,-1,-1,-1,1,2,5,5,2,6,3,0,4,3,4,7,-1,-1,-1,-1,8,4,7,9,0,5,0,6,5,0,2,6,-1,-1,-1,-1,7,3,9,7,9,4,3,2,9,5,9,6,2,6,9,-1,3,11,2,7,8,4,10,6,5,-1,-1,-1,-1,-1,-1,-1,5,10,6,4,7,2,4,2,0,2,7,11,-1,-1,-1,-1,0,1,9,4,7,8,2,3,11,5,10,6,-1,-1,-1,-1,9,2,1,9,11,2,9,4,11,7,11,4,5,10,6,-1,8,4,7,3,11,5,3,5,1,5,11,6,-1,-1,-1,-1,5,1,11,5,11,6,1,0,11,7,11,4,0,4,11,-1,0,5,9,0,6,5,0,3,6,11,6,3,8,4,7,-1,6,5,9,6,9,11,4,7,9,7,11,9,-1,-1,-1,-1,10,4,9,6,4,10,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,4,10,6,4,9,10,0,8,3,-1,-1,-1,-1,-1,-1,-1,10,0,1,10,6,0,6,4,0,-1,-1,-1,-1,-1,-1,-1,8,3,1,8,1,6,8,6,4,6,1,10,-1,-1,-1,-1,1,4,9,1,2,4,2,6,4,-1,-1,-1,-1,-1,-1,-1,3,0,8,1,2,9,2,4,9,2,6,4,-1,-1,-1,-1,0,2,4,4,2,6,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,8,3,2,8,2,4,4,2,6,-1,-1,-1,-1,-1,-1,-1,10,4,9,10,6,4,11,2,3,-1,-1,-1,-1,-1,-1,-1,0,8,2,2,8,11,4,9,10,4,10,6,-1,-1,-1,-1,3,11,2,0,1,6,0,6,4,6,1,10,-1,-1,-1,-1,6,4,1,6,1,10,4,8,1,2,1,11,8,11,1,-1,9,6,4,9,3,6,9,1,3,11,6,3,-1,-1,-1,-1,8,11,1,8,1,0,11,6,1,9,1,4,6,4,1,-1,3,11,6,3,6,0,0,6,4,-1,-1,-1,-1,-1,-1,-1,6,4,8,11,6,8,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,7,10,6,7,8,10,8,9,10,-1,-1,-1,-1,-1,-1,-1,0,7,3,0,10,7,0,9,10,6,7,10,-1,-1,-1,-1,10,6,7,1,10,7,1,7,8,1,8,0,-1,-1,-1,-1,10,6,7,10,7,1,1,7,3,-1,-1,-1,-1,-1,-1,-1,1,2,6,1,6,8,1,8,9,8,6,7,-1,-1,-1,-1,2,6,9,2,9,1,6,7,9,0,9,3,7,3,9,-1,7,8,0,7,0,6,6,0,2,-1,-1,-1,-1,-1,-1,-1,7,3,2,6,7,2,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,2,3,11,10,6,8,10,8,9,8,6,7,-1,-1,-1,-1,2,0,7,2,7,11,0,9,7,6,7,10,9,10,7,-1,1,8,0,1,7,8,1,10,7,6,7,10,2,3,11,-1,11,2,1,11,1,7,10,6,1,6,7,1,-1,-1,-1,-1,8,9,6,8,6,7,9,1,6,11,6,3,1,3,6,-1,0,9,1,11,6,7,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,7,8,0,7,0,6,3,11,0,11,6,0,-1,-1,-1,-1,7,11,6,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,7,6,11,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,3,0,8,11,7,6,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,1,9,11,7,6,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,8,1,9,8,3,1,11,7,6,-1,-1,-1,-1,-1,-1,-1,10,1,2,6,11,7,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,1,2,10,3,0,8,6,11,7,-1,-1,-1,-1,-1,-1,-1,2,9,0,2,10,9,6,11,7,-1,-1,-1,-1,-1,-1,-1,6,11,7,2,10,3,10,8,3,10,9,8,-1,-1,-1,-1,7,2,3,6,2,7,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,7,0,8,7,6,0,6,2,0,-1,-1,-1,-1,-1,-1,-1,2,7,6,2,3,7,0,1,9,-1,-1,-1,-1,-1,-1,-1,1,6,2,1,8,6,1,9,8,8,7,6,-1,-1,-1,-1,10,7,6,10,1,7,1,3,7,-1,-1,-1,-1,-1,-1,-1,10,7,6,1,7,10,1,8,7,1,0,8,-1,-1,-1,-1,0,3,7,0,7,10,0,10,9,6,10,7,-1,-1,-1,-1,7,6,10,7,10,8,8,10,9,-1,-1,-1,-1,-1,-1,-1,6,8,4,11,8,6,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,3,6,11,3,0,6,0,4,6,-1,-1,-1,-1,-1,-1,-1,8,6,11,8,4,6,9,0,1,-1,-1,-1,-1,-1,-1,-1,9,4,6,9,6,3,9,3,1,11,3,6,-1,-1,-1,-1,6,8,4,6,11,8,2,10,1,-1,-1,-1,-1,-1,-1,-1,1,2,10,3,0,11,0,6,11,0,4,6,-1,-1,-1,-1,4,11,8,4,6,11,0,2,9,2,10,9,-1,-1,-1,-1,10,9,3,10,3,2,9,4,3,11,3,6,4,6,3,-1,8,2,3,8,4,2,4,6,2,-1,-1,-1,-1,-1,-1,-1,0,4,2,4,6,2,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,1,9,0,2,3,4,2,4,6,4,3,8,-1,-1,-1,-1,1,9,4,1,4,2,2,4,6,-1,-1,-1,-1,-1,-1,-1,8,1,3,8,6,1,8,4,6,6,10,1,-1,-1,-1,-1,10,1,0,10,0,6,6,0,4,-1,-1,-1,-1,-1,-1,-1,4,6,3,4,3,8,6,10,3,0,3,9,10,9,3,-1,10,9,4,6,10,4,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,4,9,5,7,6,11,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,8,3,4,9,5,11,7,6,-1,-1,-1,-1,-1,-1,-1,5,0,1,5,4,0,7,6,11,-1,-1,-1,-1,-1,-1,-1,11,7,6,8,3,4,3,5,4,3,1,5,-1,-1,-1,-1,9,5,4,10,1,2,7,6,11,-1,-1,-1,-1,-1,-1,-1,6,11,7,1,2,10,0,8,3,4,9,5,-1,-1,-1,-1,7,6,11,5,4,10,4,2,10,4,0,2,-1,-1,-1,-1,3,4,8,3,5,4,3,2,5,10,5,2,11,7,6,-1,7,2,3,7,6,2,5,4,9,-1,-1,-1,-1,-1,-1,-1,9,5,4,0,8,6,0,6,2,6,8,7,-1,-1,-1,-1,3,6,2,3,7,6,1,5,0,5,4,0,-1,-1,-1,-1,6,2,8,6,8,7,2,1,8,4,8,5,1,5,8,-1,9,5,4,10,1,6,1,7,6,1,3,7,-1,-1,-1,-1,1,6,10,1,7,6,1,0,7,8,7,0,9,5,4,-1,4,0,10,4,10,5,0,3,10,6,10,7,3,7,10,-1,7,6,10,7,10,8,5,4,10,4,8,10,-1,-1,-1,-1,6,9,5,6,11,9,11,8,9,-1,-1,-1,-1,-1,-1,-1,3,6,11,0,6,3,0,5,6,0,9,5,-1,-1,-1,-1,0,11,8,0,5,11,0,1,5,5,6,11,-1,-1,-1,-1,6,11,3,6,3,5,5,3,1,-1,-1,-1,-1,-1,-1,-1,1,2,10,9,5,11,9,11,8,11,5,6,-1,-1,-1,-1,0,11,3,0,6,11,0,9,6,5,6,9,1,2,10,-1,11,8,5,11,5,6,8,0,5,10,5,2,0,2,5,-1,6,11,3,6,3,5,2,10,3,10,5,3,-1,-1,-1,-1,5,8,9,5,2,8,5,6,2,3,8,2,-1,-1,-1,-1,9,5,6,9,6,0,0,6,2,-1,-1,-1,-1,-1,-1,-1,1,5,8,1,8,0,5,6,8,3,8,2,6,2,8,-1,1,5,6,2,1,6,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,1,3,6,1,6,10,3,8,6,5,6,9,8,9,6,-1,10,1,0,10,0,6,9,5,0,5,6,0,-1,-1,-1,-1,0,3,8,5,6,10,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,10,5,6,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,11,5,10,7,5,11,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,11,5,10,11,7,5,8,3,0,-1,-1,-1,-1,-1,-1,-1,5,11,7,5,10,11,1,9,0,-1,-1,-1,-1,-1,-1,-1,10,7,5,10,11,7,9,8,1,8,3,1,-1,-1,-1,-1,11,1,2,11,7,1,7,5,1,-1,-1,-1,-1,-1,-1,-1,0,8,3,1,2,7,1,7,5,7,2,11,-1,-1,-1,-1,9,7,5,9,2,7,9,0,2,2,11,7,-1,-1,-1,-1,7,5,2,7,2,11,5,9,2,3,2,8,9,8,2,-1,2,5,10,2,3,5,3,7,5,-1,-1,-1,-1,-1,-1,-1,8,2,0,8,5,2,8,7,5,10,2,5,-1,-1,-1,-1,9,0,1,5,10,3,5,3,7,3,10,2,-1,-1,-1,-1,9,8,2,9,2,1,8,7,2,10,2,5,7,5,2,-1,1,3,5,3,7,5,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,8,7,0,7,1,1,7,5,-1,-1,-1,-1,-1,-1,-1,9,0,3,9,3,5,5,3,7,-1,-1,-1,-1,-1,-1,-1,9,8,7,5,9,7,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,5,8,4,5,10,8,10,11,8,-1,-1,-1,-1,-1,-1,-1,5,0,4,5,11,0,5,10,11,11,3,0,-1,-1,-1,-1,0,1,9,8,4,10,8,10,11,10,4,5,-1,-1,-1,-1,10,11,4,10,4,5,11,3,4,9,4,1,3,1,4,-1,2,5,1,2,8,5,2,11,8,4,5,8,-1,-1,-1,-1,0,4,11,0,11,3,4,5,11,2,11,1,5,1,11,-1,0,2,5,0,5,9,2,11,5,4,5,8,11,8,5,-1,9,4,5,2,11,3,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,2,5,10,3,5,2,3,4,5,3,8,4,-1,-1,-1,-1,5,10,2,5,2,4,4,2,0,-1,-1,-1,-1,-1,-1,-1,3,10,2,3,5,10,3,8,5,4,5,8,0,1,9,-1,5,10,2,5,2,4,1,9,2,9,4,2,-1,-1,-1,-1,8,4,5,8,5,3,3,5,1,-1,-1,-1,-1,-1,-1,-1,0,4,5,1,0,5,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,8,4,5,8,5,3,9,0,5,0,3,5,-1,-1,-1,-1,9,4,5,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,4,11,7,4,9,11,9,10,11,-1,-1,-1,-1,-1,-1,-1,0,8,3,4,9,7,9,11,7,9,10,11,-1,-1,-1,-1,1,10,11,1,11,4,1,4,0,7,4,11,-1,-1,-1,-1,3,1,4,3,4,8,1,10,4,7,4,11,10,11,4,-1,4,11,7,9,11,4,9,2,11,9,1,2,-1,-1,-1,-1,9,7,4,9,11,7,9,1,11,2,11,1,0,8,3,-1,11,7,4,11,4,2,2,4,0,-1,-1,-1,-1,-1,-1,-1,11,7,4,11,4,2,8,3,4,3,2,4,-1,-1,-1,-1,2,9,10,2,7,9,2,3,7,7,4,9,-1,-1,-1,-1,9,10,7,9,7,4,10,2,7,8,7,0,2,0,7,-1,3,7,10,3,10,2,7,4,10,1,10,0,4,0,10,-1,1,10,2,8,7,4,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,4,9,1,4,1,7,7,1,3,-1,-1,-1,-1,-1,-1,-1,4,9,1,4,1,7,0,8,1,8,7,1,-1,-1,-1,-1,4,0,3,7,4,3,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,4,8,7,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,9,10,8,10,11,8,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,3,0,9,3,9,11,11,9,10,-1,-1,-1,-1,-1,-1,-1,0,1,10,0,10,8,8,10,11,-1,-1,-1,-1,-1,-1,-1,3,1,10,11,3,10,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,1,2,11,1,11,9,9,11,8,-1,-1,-1,-1,-1,-1,-1,3,0,9,3,9,11,1,2,9,2,11,9,-1,-1,-1,-1,0,2,11,8,0,11,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,3,2,11,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,2,3,8,2,8,10,10,8,9,-1,-1,-1,-1,-1,-1,-1,9,10,2,0,9,2,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,2,3,8,2,8,10,0,1,8,1,10,8,-1,-1,-1,-1,1,10,2,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,1,3,8,9,1,8,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,9,1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,3,8,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1]),Vg={uFurFade:{value:1}},By=`
  float furHash(vec3 p) { p = fract(p * 0.1031); p += dot(p, p.zyx + 31.32); return fract((p.x + p.y) * p.z); }
  float furNoise(vec3 p) { vec3 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f);
    return mix(mix(mix(furHash(i), furHash(i + vec3(1, 0, 0)), f.x), mix(furHash(i + vec3(0, 1, 0)), furHash(i + vec3(1, 1, 0)), f.x), f.y),
               mix(mix(furHash(i + vec3(0, 0, 1)), furHash(i + vec3(1, 0, 1)), f.x), mix(furHash(i + vec3(0, 1, 1)), furHash(i + vec3(1, 1, 1)), f.x), f.y), f.z); }`;function Hy(n,t){const e=new $e({vertexColors:!0,roughness:t.feather?.75:.92,metalness:0}),i={uH:{value:n},uFurLen:{value:t.length},uFurDensity:{value:t.density},uFurTip:{value:t.tip},uFeather:{value:t.feather?1:0}};return e.onBeforeCompile=s=>{Object.assign(s.uniforms,i,Vg),s.vertexShader=s.vertexShader.replace("#include <common>",`#include <common>
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
        ${By}`).replace("#include <color_fragment>",`#include <color_fragment>
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
        diffuseColor.rgb = mix(diffuseColor.rgb, diffuseColor.rgb * 1.25 + 0.06, uFurTip * smoothstep(0.6, 1.0, t));`)},e.customProgramCacheKey=()=>"kaiju-fur-v2",e}function Gg(n,t,e,i){const s=[];for(let r=1;r<=i;r++){const a=new Sc(t,Hy(r/i,e));a.castShadow=!1,a.receiveShadow=!0,a.frustumCulled=!1,a.userData.h=r/i,n.add(a),a.bind(n.skeleton,n.bindMatrix),s.push(a)}return s}function zy(n=512){const t=document.createElement("canvas");t.width=t.height=n;const e=t.getContext("2d"),i=document.createElement("canvas");i.width=i.height=n;const s=i.getContext("2d"),r=e.createImageData(n,n),a=s.createImageData(n,n),o=22,c=[];let l=7;const h=()=>(l=l*1664525+1013904223>>>0,l/4294967296);for(let d=0;d<o;d++)for(let m=0;m<o;m++)c.push([(m+.2+h()*.6)/o,(d+.2+h()*.6)/o,.7+h()*.3]);for(let d=0;d<n;d++)for(let m=0;m<n;m++){const v=m/n,g=d/n,p=Math.floor(v*o),_=Math.floor(g*o);let x=9,M=9,w=1;for(let R=-1;R<=1;R++)for(let P=-1;P<=1;P++){const I=(p+P+o)%o,F=(_+R+o)%o,H=c[F*o+I];let $=v-H[0],B=g-H[1];$-=Math.round($),B-=Math.round(B);const Y=Math.sqrt($*$+B*B);Y<x?(M=x,x=Y,w=H[2]):Y<M&&(M=Y)}const S=M-x,T=Math.min(1,S/.02),A=1-Math.min(1,x/(.55/o)),b=(.55+.45*T)*w*(.85+.3*A),y=(d*n+m)*4;r.data[y]=255*b,r.data[y+1]=255*b,r.data[y+2]=255*b,r.data[y+3]=255;const E=.55+.4*(1-T)-.15*A;a.data[y]=255*E,a.data[y+1]=255*E,a.data[y+2]=255*E,a.data[y+3]=255}e.putImageData(r,0,0),s.putImageData(a,0,0);const u=new Yl(t);u.wrapS=u.wrapT=so,u.colorSpace=Ji;const f=new Yl(i);return f.wrapS=f.wrapT=so,{map:u,rough:f}}let fl=null;function Zl(n=!1,t){if(n)return Vy();if(t==="armour")return new $e({vertexColors:!0,roughness:.42,metalness:.45});if(t==="soft")return new $e({vertexColors:!0,roughness:.82,metalness:0});if(t==="suit")return new $e({vertexColors:!0,roughness:.34,metalness:.18});!fl&&typeof document<"u"&&(fl=zy());const e=new $e({vertexColors:!0,roughness:.7,metalness:.02});return e.onBeforeCompile=i=>{i.uniforms.uScales={value:fl?.map??null},i.uniforms.uRough={value:fl?.rough??null},i.vertexShader=i.vertexShader.replace("#include <common>",`#include <common>
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
        float roughTex = triplanar(uRough, vBind, bn, sc).r;`).replace("#include <roughnessmap_fragment>","float roughnessFactor = mix(roughTex, 0.9, isBone);")},e.customProgramCacheKey=()=>"kaiju-v1",e}function Vy(){const n=new $e({vertexColors:!0,roughness:.95,metalness:0});return n.onBeforeCompile=t=>{Object.assign(t.uniforms,Vg),t.fragmentShader=t.fragmentShader.replace("#include <common>",`#include <common>
 uniform float uFurFade;`).replace("#include <color_fragment>",`#include <color_fragment>
 diffuseColor.rgb *= mix(1.0, 0.6, uFurFade);`)},n.customProgramCacheKey=()=>"kaiju-undercoat-v1",n}const uc={jaw:0,blinkL:0,blinkR:0,smile:0,pucker:0,browUp:0,smileL:0,smileR:0,frown:0,browDownL:0,browDownR:0,browOuterL:0,browOuterR:0,squintL:0,squintR:0,wideL:0,wideR:0,lookX:0,lookY:0,jawSide:0,puff:0,funnel:0,sneer:0};function Gy(n,t={}){const e={...uc,...t};for(const i of(n??"").split(",")){const[s,r]=i.split(":");s&&s in e&&r!==void 0&&Number.isFinite(Number(r))&&(e[s]=Number(r))}return e}function Yu(n){const t=new xe;return t.setAttribute("position",new $t(n.position,3)),t.setAttribute("normal",new $t(n.normal,3)),t.setAttribute("color",new $t(n.color,3)),n.aFur&&t.setAttribute("aFur",new $t(n.aFur,1)),t.setAttribute("skinIndex",new $t(n.skinIndex,4)),t.setAttribute("skinWeight",new $t(n.skinWeight,4)),t}function rp(n,t,e){return Yu(Wy(n,t,e))}function Wy(n,t,e){const i=n.box,s=(i.min[0]+i.max[0])/2,r=(i.min[1]+i.max[1])/2,a=(i.min[2]+i.max[2])/2,o=(i.max[0]-i.min[0])/2,c=(i.max[1]-i.min[1])/2,l=(i.max[2]-i.min[2])/2,h=new zg(e,new os,!1,!1,4e5);h.isolation=50;const u=h.field,f=e;for(let E=0;E<f;E++){const R=a+(E/(f-1)*2-1)*l;for(let P=0;P<f;P++){const I=r+(P/(f-1)*2-1)*c;for(let F=0;F<f;F++){const H=s+(F/(f-1)*2-1)*o;u[E*f*f+P*f+F]=Math.max(0,Math.min(100,50-n.sdf(H,I,R)*40))}}}h.update();const d=h.count,m=new Float32Array(d*3),v=new Float32Array(d*3),g=new Float32Array(d*3),p=h.positionArray,_=h.normalArray,x=n.palette.map(E=>new gt(E)),M=new gt;for(let E=0;E<d;E++){const R=s+p[E*3]*o,P=r+p[E*3+1]*c,I=a+p[E*3+2]*l;m[E*3]=R,m[E*3+1]=P,m[E*3+2]=I;let F=_[E*3]/o,H=_[E*3+1]/c,$=_[E*3+2]/l;const B=Math.hypot(F,H,$)||1;F/=B,H/=B,$/=B,v[E*3]=F,v[E*3+1]=H,v[E*3+2]=$;const Y=n.region(R,P,I);M.copy(x[Y]??x[0]),n.tint?.(Y,R,P,I,M);const it=.94+.06*Math.sin(P*1.7+I*.9)*Math.cos(R*2.3);g[E*3]=M.r*it,g[E*3+1]=M.g*it,g[E*3+2]=M.b*it}h.geometry.dispose();let w;if(n.fur){w=new Float32Array(d);for(let E=0;E<d;E++)w[E]=n.furLen?n.furLen(m[E*3],m[E*3+1],m[E*3+2]):1}const S=new Uint16Array(d*4),T=new Float32Array(d*4),A=t.map((E,R)=>({i:R,a:E.a,b:E.b,reach:E.reach??1/0,name:E.name})),b=n.capture,y=n.weights??"sharp";for(let E=0;E<d;E++){const R=m[E*3],P=m[E*3+1],I=m[E*3+2];let F=1/0,H=1/0,$=0,B=0;for(const vt of A){if(b&&!b(vt,R,P,I))continue;const St=vt.b[0]-vt.a[0],Ct=vt.b[1]-vt.a[1],Ut=vt.b[2]-vt.a[2],V=R-vt.a[0],X=P-vt.a[1],z=I-vt.a[2],W=Math.max(0,Math.min(1,(V*St+X*Ct+z*Ut)/(St*St+Ct*Ct+Ut*Ut||1))),G=Math.hypot(V-St*W,X-Ct*W,z-Ut*W);G>vt.reach||(G<F?(H=F,B=$,F=G,$=vt.i):G<H&&(H=G,B=vt.i))}isFinite(H)||(H=F,B=$);const Y=y==="rigid"?1:y==="soft"?1/Math.pow(F+1.2,2):1/Math.pow(F+.3,4),it=y==="rigid"?0:y==="soft"?1/Math.pow(H+1.2,2):1/Math.pow(H+.3,4),mt=Y+it;S[E*4]=$,S[E*4+1]=B,T[E*4]=Y/mt,T[E*4+1]=it/mt}return{position:m,normal:v,color:g,skinIndex:S,skinWeight:T,aFur:w}}const Xy=(n,t=n.res??88)=>({body:t,fur:Math.max(32,Math.round(t*.6))});function qy(n){const t=new Map;let e=null;for(const i of n){const s=new bg;if(s.name=i.name,i.parent){const r=n.find(a=>a.name===i.parent);s.position.set(i.a[0]-r.a[0],i.a[1]-r.a[1],i.a[2]-r.a[2]),t.get(i.parent).add(s)}else s.position.set(i.a[0],i.a[1],i.a[2]),e=s;t.set(i.name,s)}return{bones:t,root:e}}function g0(n,t=n.res??88,e){const i=performance.now(),s=Xy(n,t),{bones:r,root:a}=qy(n.segs);let o,c=[];if(n.body){const l=n.body,h=e?Yu(e.body):rp(l,n.segs,s.body),u=l.surface==="scales"||l.surface==="fur"?void 0:l.surface,f=new Sc(h,Zl(!!l.fur||l.surface==="fur",u));f.castShadow=!0,f.receiveShadow=!0,f.frustumCulled=!1,f.add(a),f.bind(new zf(n.segs.map(d=>r.get(d.name)))),l.fur&&(n.furShells??10)>0&&(c=Gg(f,e?.fur?Yu(e.fur):rp(l,n.segs,s.fur),l.fur,n.furShells??10)),o=f}else{const l=new ue;l.add(a),o=l}if(n.dress){const l=new Map;n.dress({bones:r,segs:n.segs,at(h,u,f,d,m){const v=n.segs.find(g=>g.name===u);return h.position.set(f-v.a[0],d-v.a[1],m-v.a[2]),h.traverse(g=>{g.isMesh&&(g.castShadow=!0,g.receiveShadow=!0)}),r.get(u).add(h),h},std(h){const u=JSON.stringify(h);let f=l.get(u);return f||(f=new $e(h),l.set(u,f)),f}})}return o.name=n.id,{def:n,root:o,bones:r,fur:c,ms:performance.now()-i}}function On(n,t=!1){const e=n[0].index!==null,i=new Set(Object.keys(n[0].attributes)),s=new Set(Object.keys(n[0].morphAttributes)),r={},a={},o=n[0].morphTargetsRelative,c=new xe;let l=0;for(let h=0;h<n.length;++h){const u=n[h];let f=0;if(e!==(u.index!==null))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". All geometries must have compatible attributes; make sure index attribute exists among all geometries, or in none of them."),null;for(const d in u.attributes){if(!i.has(d))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+'. All geometries must have compatible attributes; make sure "'+d+'" attribute exists among all geometries, or in none of them.'),null;r[d]===void 0&&(r[d]=[]),r[d].push(u.attributes[d]),f++}if(f!==i.size)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". Make sure all geometries have the same number of attributes."),null;if(o!==u.morphTargetsRelative)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". .morphTargetsRelative must be consistent throughout all geometries."),null;for(const d in u.morphAttributes){if(!s.has(d))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+".  .morphAttributes must be consistent throughout all geometries."),null;a[d]===void 0&&(a[d]=[]),a[d].push(u.morphAttributes[d])}if(t){let d;if(e)d=u.index.count;else if(u.attributes.position!==void 0)d=u.attributes.position.count;else return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". The geometry must have either an index or a position attribute"),null;c.addGroup(l,d,h),l+=d}}if(e){let h=0;const u=[];for(let f=0;f<n.length;++f){const d=n[f].index;for(let m=0;m<d.count;++m)u.push(d.getX(m)+h);h+=n[f].attributes.position.count}c.setIndex(u)}for(const h in r){const u=ap(r[h]);if(!u)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+h+" attribute."),null;c.setAttribute(h,u)}for(const h in a){const u=a[h][0].length;if(u===0)break;c.morphAttributes=c.morphAttributes||{},c.morphAttributes[h]=[];for(let f=0;f<u;++f){const d=[];for(let v=0;v<a[h].length;++v)d.push(a[h][v][f]);const m=ap(d);if(!m)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+h+" morphAttribute."),null;c.morphAttributes[h].push(m)}}return c}function ap(n){let t,e,i,s=-1,r=0;for(let l=0;l<n.length;++l){const h=n[l];if(t===void 0&&(t=h.array.constructor),t!==h.array.constructor)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.array must be of consistent array types across matching attributes."),null;if(e===void 0&&(e=h.itemSize),e!==h.itemSize)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.itemSize must be consistent across matching attributes."),null;if(i===void 0&&(i=h.normalized),i!==h.normalized)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.normalized must be consistent across matching attributes."),null;if(s===-1&&(s=h.gpuType),s!==h.gpuType)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.gpuType must be consistent across matching attributes."),null;r+=h.count*e}const a=new t(r),o=new $t(a,e,i);let c=0;for(let l=0;l<n.length;++l){const h=n[l];if(h.isInterleavedBufferAttribute){const u=c/e;for(let f=0,d=h.count;f<d;f++)for(let m=0;m<e;m++){const v=h.getComponent(f,m);o.setComponent(f+u,m,v)}}else a.set(h.array,c);c+=h.count*e}return s!==void 0&&(o.gpuType=s),o}const $y=-1.05,Yy=.72,op=.07;function Ec(n,t,e,i={}){const s=new ue;s.name=n;const r=t*(1+(i.gap??.08)),a=new nt(new Wt(r,28,10,0,Math.PI*2,0,Math.PI/2),e),o=new nt(new Wt(r,28,10,0,Math.PI*2,Math.PI/2,Math.PI/2),e);return a.name=n+"-up",o.name=n+"-lo",s.add(a,o),s.rotation.z=i.tilt??0,s.userData.open=i.open??1,ho(s,0,0,0),s}function ho(n,t,e,i){const s=n.children[0],r=n.children[1];if(!s||!r)return;const a=n.userData.open??1,o=Math.min(1,Math.max(0,t)),c=$y*a-.3*i,l=(Yy-.45*e)*a;s.rotation.x=c+(op-c)*o,r.rotation.x=l+(-op-l)*o}function Zf(n,t,e=.4){let i=n.userData.lookRest;i||(n.userData.lookRest=i=n.rotation.clone());const s=t?.lookX??0,r=t?.lookY??0;n.rotation.set(i.x-r*e*.67,i.y+s*e,i.z)}const O=(n,t,e)=>{const i=Math.max(e-Math.abs(n-t),0)/e;return Math.min(n,t)-i*i*e*.25};function ve(n,t,e,i,s,r,a){const o=n-i,c=t-s,l=e-r;return Math.sqrt(o*o+c*c+l*l)-a}function K(n,t,e,i,s,r,a,o,c,l,h){const u=a-i,f=o-s,d=c-r,m=n-i,v=t-s,g=e-r,p=Math.max(0,Math.min(1,(m*u+v*f+g*d)/(u*u+f*f+d*d))),_=m-u*p,x=v-f*p,M=g-d*p;return Math.sqrt(_*_+x*x+M*M)-(l+(h-l)*p)}function ct(n,t,e,i,s,r,a,o,c){const l=(n-i)/a,h=(t-s)/o,u=(e-r)/c,f=Math.sqrt(l*l+h*h+u*u),d=Math.sqrt(l*l/a+h*h/o+u*u/c);return d>0?f*(f-1)/d:-Math.min(a,o,c)}const Wg=[{name:"pelvis",a:[0,9.6,0],b:[0,10.6,0],parent:null},{name:"spine1",a:[0,10.6,0],b:[0,12.4,.1],parent:"pelvis"},{name:"spine2",a:[0,12.4,.1],b:[0,15,.1],parent:"spine1"},{name:"neck",a:[0,15,.1],b:[0,15.9,.15],parent:"spine2"},{name:"head",a:[0,15.9,.15],b:[0,18.4,.3],parent:"neck"},{name:"jaw",a:[0,16.5,-.3],b:[0,16,1.25],parent:"head",reach:0},{name:"tail1",a:[0,10.4,-1],b:[0,9.6,-1.1],parent:"pelvis",reach:0},{name:"tail2",a:[0,9.6,-1.1],b:[0,8.8,-1.2],parent:"tail1",reach:0},{name:"tail3",a:[0,8.8,-1.2],b:[0,8,-1.3],parent:"tail2",reach:0},{name:"tail4",a:[0,8,-1.3],b:[0,7.2,-1.4],parent:"tail3",reach:0},{name:"thighL",a:[1.1,9.6,0],b:[1.2,5.3,.2],parent:"pelvis"},{name:"shinL",a:[1.2,5.3,.2],b:[1.2,1.1,-.1],parent:"thighL"},{name:"footL",a:[1.2,1.1,-.1],b:[1.2,.35,1.4],parent:"shinL"},{name:"thighR",a:[-1.1,9.6,0],b:[-1.2,5.3,.2],parent:"pelvis"},{name:"shinR",a:[-1.2,5.3,.2],b:[-1.2,1.1,-.1],parent:"thighR"},{name:"footR",a:[-1.2,1.1,-.1],b:[-1.2,.35,1.4],parent:"shinR"},{name:"armL",a:[2.4,14.6,0],b:[2.72,11.9,-.05],parent:"spine2"},{name:"forearmL",a:[2.72,11.9,-.05],b:[2.85,9.45,.4],parent:"armL"},{name:"armR",a:[-2.4,14.6,0],b:[-2.72,11.9,-.05],parent:"spine2"},{name:"forearmR",a:[-2.72,11.9,-.05],b:[-2.85,9.45,.4],parent:"armR"}],fc=n=>new C(n[0],n[1],n[2]);function Xg(n,t){const e=fc(t).sub(fc(n)).normalize(),i=new C(1,0,0).addScaledVector(e,-e.x);i.lengthSq()<1e-6&&i.set(0,0,1),i.normalize();const s=new C().crossVectors(i,e);return new re().makeBasis(i,e,s).setPosition(n[0],n[1],n[2])}const xs=(n,t,e,i,s)=>Vs(n,t,e,i,s,6,5,2);function Vs(n,t,e,i,s,r=12,a=14,o=4){const c=fc(t).distanceTo(fc(n)),l=[];for(let u=0;u<=o;u++){const f=-Math.PI/2+u/o*(Math.PI/2);l.push(new ft(Math.max(.001,e*Math.cos(f)),e*.75*Math.sin(f)))}const h=Math.min(.2,1.3*Math.max(e,s)/c);for(let u=1;u<a;u++){const f=u/a,d=i+(e-i)*Math.exp(-((f/h)**2))+(s-i)*Math.exp(-(((1-f)/h)**2));l.push(new ft(d,f*c))}for(let u=0;u<=o;u++){const f=u/o*(Math.PI/2);l.push(new ft(Math.max(.001,s*Math.cos(f)),c+s*.75*Math.sin(f)))}return new Bi(l,r).applyMatrix4(Xg(n,t))}function Ve(n,t,e=[1,1,1],i=12){return new Wt(t,i,Math.max(6,Math.round(i*.7))).scale(e[0],e[1],e[2]).translate(n[0],n[1],n[2])}function jy(n,t,e=24,i=8){return new Cs(new vi(n.map(fc)),e,t,i,!1)}function ju(n,t,e=24,i=8){return[jy(n,t,e,i),Ve(n[0],t,[1,1,1],i),Ve(n[n.length-1],t,[1,1,1],i)]}function yi(n){const t=On(n.map(e=>e.index?e:e.toNonIndexed()),!1);for(const e of n)e.dispose();return t}function sn(n,t,e,i,s=6e4){const r=b=>(t.max[b]-t.min[b])*e/(e-7),a=b=>t.min[b]-2.5*r(b)/e,o=a(0)+r(0)/2,c=a(1)+r(1)/2,l=a(2)+r(2)/2,h=r(0)/2,u=r(1)/2,f=r(2)/2,d=new zg(e,new os,!1,!1,s);d.isolation=50;const m=d.field,v=e,g=40;for(let b=0;b<v;b++){const y=l+(2*b/v-1)*f;for(let E=0;E<v;E++){const R=c+(2*E/v-1)*u;for(let P=0;P<v;P++){const I=o+(2*P/v-1)*h;m[b*v*v+E*v+P]=Math.max(0,Math.min(100,50-n(I,R,y)*g))}}}d.update();const p=d.count,_=d.positionArray,x=d.normalArray,M=new Float32Array(p*3),w=new Float32Array(p*3),S=i?new Float32Array(p*3):null,T=new gt;for(let b=0;b<p;b++){const y=o+_[b*3]*h,E=c+_[b*3+1]*u,R=l+_[b*3+2]*f;M[b*3]=y,M[b*3+1]=E,M[b*3+2]=R;let P=x[b*3]/h,I=x[b*3+1]/u,F=x[b*3+2]/f;const H=Math.hypot(P,I,F)||1;P/=H,I/=H,F/=H,w[b*3]=P,w[b*3+1]=I,w[b*3+2]=F,S&&(T.setRGB(1,1,1),i(y,E,R,T),S[b*3]=T.r,S[b*3+1]=T.g,S[b*3+2]=T.b)}d.geometry.dispose();const A=new xe;return A.setAttribute("position",new $t(M,3)),A.setAttribute("normal",new $t(w,3)),S&&A.setAttribute("color",new $t(S,3)),A.computeBoundingSphere(),A}const Co=(n,t,e)=>-O(-n,-t,e),Wa=[.43,17.02,1.06],Xa=[.43,16.99,.8];function qg(n,t,e,i,s){const r=Math.abs(n),o=e-i,c=s,l=Math.hypot(o,c),h=(r*o+(t-e)*c)/l;return Math.max(h,i-t)}function Zy(n,t,e){const i=Math.abs(n);let s=ct(n,t,e,0,17.45,-.12,1.1,1.13,1.32);s=O(s,ct(n,t,e,0,16.8,-.35,.98,.62,.95),.3),s=O(s,ct(n,t,e,0,16.68,.58,.8,.74,.72),.35),s=O(s,ct(i,t,e,.78,16.86,.55,.33,.3,.48),.22),s=O(s,K(i,t,e,.86,16.8,.35,.98,16.68,-.42,.15,.13),.15),s=O(s,K(i,t,e,.12,17.32,1.12,.78,17.36,.95,.17,.15),.2),s=Co(s,-ct(i,t,e,1.32,16.95,.05,.38,.5,.55),.18),s=Co(s,-ct(i,t,e,Wa[0],Wa[1],Wa[2],.36,.34,.5),.07);const r=Math.min(qg(n,t,16.86,16.42,.19),Math.hypot(i-.08,t-16.47)-.11);return s=Co(s,-Math.max(r,.8-e),.04),s=Co(s,16.08-t,.1),s=Co(s,-ct(i,t,e,.8,16.25,.62,.22,.3,.35),.12),s}function Jy(n,t,e,i){const s=Math.abs(n),r=ct(s,t,e,Wa[0],Wa[1],Wa[2],.42,.4,.56),a=Math.max(Math.min(qg(n,t,16.86,16.42,.19),Math.hypot(s-.08,t-16.47)-.11),.8-e)-.06,c=Math.max(0,Math.min(1,-Math.min(r,a)/.05))*(.75+.25*Math.max(0,Math.min(1,(1.2-e)/.4)));i.copy(iS).lerp(sS,c),c===0&&i.multiplyScalar(.94+.06*Math.max(0,Math.min(1,(t-16.3)/1.2)))}function Ky(n,t,e,i,s,r,a){const o=s-e,c=r-i,l=Math.max(0,Math.min(1,((n-e)*o+(t-i)*c)/(o*o+c*c)));return Math.hypot(n-e-o*l,t-i-c*l)-a}function Qy(n,t,e){const i=Math.abs(n);let s=K(i,t,e,0,15.62,1,.5,15.66,.66,.17,.17);return s=O(s,K(i,t,e,.5,15.66,.66,.78,15.74,-.12,.17,.16),.1),s=O(s,Math.max(Ky(t,e,15.74,-.14,16.4,-.3,.2),Math.abs(i-.8)-.07),.08),s=O(s,ct(i,t,e,.82,16.45,-.3,.15,.11,.13),.06),s=O(s,ct(n,t,e,0,15.6,1,.33,.21,.17),.1),s=O(s,K(i,t,e,0,15.8,1.02,.52,15.8,.62,.12,.12),.08),s}function tS(n,t,e){const i=Math.abs(n),s=Math.abs(Math.hypot(i-.25,t-10.95,e-.75)-1.4)-.09;let r=Math.max(s,ct(i,t,e,1.2,10.5,-.18,.78,.7,.85));return r=O(r,K(i,t,e,.6,11,-.45,1.55,11.05,.2,.1,.1),.12),r=O(r,ct(n,t,e,0,9.95,-.78,.48,.72,.22),.15),r=O(r,K(i,t,e,.38,10.35,-.72,.85,10.4,-.45,.17,.15),.12),r=O(r,K(i,t,e,1.25,10.15,-.15,1,9.62,0,.24,.24),.15),r=O(r,ve(i,t,e,.92,9.6,0,.32),.12),r=Math.min(r,Math.hypot(Math.hypot(t-9.6,e)-.36,i-1)-.1),r=O(r,K(i,t,e,.95,9.48,.28,.12,9.3,.72,.15,.14),.1),r=O(r,K(i,t,e,.12,9.32,.72,.1,9.02,.66,.15,.15),.1),r=O(r,K(i,t,e,1,9.38,-.2,.78,8.92,-.05,.18,.17),.1),r=O(r,K(i,t,e,.78,8.92,-.05,.12,9.04,.62,.13,.12),.1),r}function v0(n,t,e,i,s){return[new vn(t,t*1.08,e,12).translate(n[0],n[1],n[2]),new Ce(i,e*.42,.18).translate(n[0],n[1]+.02,n[2]-t*.6),new Ce(.15,e*.55,s).rotateX(.35).translate(n[0],n[1]-.05,n[2]-t-s*.42)]}function cp(n){const t=[],e=[1.05,1.42,1.64,1.76,1.8,1.74,1.6],i=[.95,1.06,1.12,1.14,1.12,1.06,.96],s=[.32,.48,.62,.72,.8,.85,.85];for(let r=0;r<7;r++){const a=14.55-r*.4,o=e[r],c=.98,l=i[r],h=r>=5,u=[[.26,a+.04,-.78]],f=h?.74*Math.PI:Math.PI-Math.asin(Math.min(.9,.42/o));for(let d=0;d<=7;d++){const m=.14*Math.PI+d/7*(f-.14*Math.PI),v=-Math.cos(m)*(m<Math.PI/2?c:l),g=a-s[r]*Math.pow((m-.14*Math.PI)/(.86*Math.PI),1.3);u.push([o*Math.sin(m),g,v])}if(h){const d=u[u.length-1];u.push([.62,d[1]+.25+(r-5)*.2,1.02],[.26,12.62,1.06])}else u.push([.24,u[u.length-1][1]+.04,l*.98]);t.push(...ju(u.map(d=>[d[0]*n,d[1],d[2]]),r===0?.13:.12,28,7))}return t}function eS(n,t){const e=Xg(n,[n[0]+t[0],n[1]+t[1],n[2]+t[2]]),i=1.35,s=(u,f,d)=>{const m=new C(u*i,f*i,d*i).applyMatrix4(e);return[m.x,m.y,m.z]},r=[];for(const[u,f,d]of[[0,.1,.16],[0,.1,-.02],[0,.1,-.2],[.02,.3,.2],[.02,.3,0],[.02,.3,-.18]])r.push(Ve(s(u,f,d),.14,[1,1,1],8));const a=[[.21,1],[.07,1.08],[-.07,1],[-.2,.82]];for(const[u,f]of a){const d=s(.02,.4,u*.85),m=s(0,.4+.55*f,u),v=s(-.07,.4+.92*f,u*1.05),g=s(-.17,.4+1.15*f,u*1.08),p=s(-.28,.4+1.3*f,u*1.08);r.push(xs(d,m,.1,.075,.105),xs(m,v,.1,.07,.095),xs(v,g,.09,.065,.085),xs(g,p,.08,.06,.065))}const o=s(0,.25,.26),c=s(-.05,.6,.48),l=s(-.1,.88,.58),h=s(-.16,1.08,.62);return r.push(xs(o,c,.11,.085,.1),xs(c,l,.1,.075,.09),xs(l,h,.09,.065,.065)),r}function nS(){const n=[];n.push(Ve([1.2,.88,0],.27)),n.push(Ve([1.24,.44,-.3],1,[.27,.32,.44]));for(const[r,a,o]of[[.98,.62,.36],[1.22,.62,.34],[1.46,.55,.22],[1.08,.55,.6],[1.32,.52,.56]])n.push(Ve([r,a,o],.17,[1,1,1],8));const t=[.95,1.12,1.28,1.42,1.55],e=[.84,1.08,1.3,1.5,1.68],i=[.1,.075,.07,.065,.065],s=[.42,.34,.3,.27,.24];for(let r=0;r<5;r++){const a=[t[r],.5,.62],o=[e[r],.22,1.38-r*.05];n.push(xs(a,o,i[r]*1.3,i[r],i[r]*1.35));const c=[o[0]+(r===0?-.02:.02*r),.15,o[2]+s[r]];n.push(xs(o,c,i[r]*1.05,i[r]*.8,i[r]*.85))}return n}function $g(n,t=2.2){const e=new os({color:n,transparent:!0,opacity:1,blending:Or,depthWrite:!1,toneMapped:!1});return e.userData.keepBlend=!0,e.onBeforeCompile=i=>{i.vertexShader=i.vertexShader.replace("#include <common>",`#include <common>
 varying vec3 vGlowN; varying vec3 vGlowV;`).replace("#include <project_vertex>",`#include <project_vertex>
 vGlowN = normalize(normalMatrix * normal); vGlowV = -mvPosition.xyz;`),i.fragmentShader=i.fragmentShader.replace("#include <common>",`#include <common>
 varying vec3 vGlowN; varying vec3 vGlowV;`).replace("#include <color_fragment>",`#include <color_fragment>
 diffuseColor.a *= pow(clamp(dot(normalize(vGlowN), normalize(vGlowV)), 0.0, 1.0), ${t.toFixed(2)});`)},e.customProgramCacheKey=()=>`skelly-glow-v1-${t.toFixed(2)}`,e}const Yg=15656396,iS=new gt(Yg),sS=new gt(1905164),Zu=5832490;function rS(n){const t=n.std({color:Yg,roughness:.42,metalness:0,emissive:2894368,emissiveIntensity:1}),e=n.std({color:16777215,vertexColors:!0,roughness:.42,metalness:0,emissive:2894368,emissiveIntensity:1}),i=n.std({color:1182214,roughness:.9}),s=(v,g,p=t)=>{for(const _ of["L","R"]){const x=new nt(v,p);x.name=`skelly-${g}${_}`,_==="R"&&(x.scale.x=-1),n.at(x,g+_,0,0,0)}},r=(v,g,p=t,_=`skelly-${g}`)=>{const x=new nt(v,p);return x.name=_,n.at(x,g,0,0,0),x},a=sn(Zy,{min:[-1.25,15.95,-1.5],max:[1.25,18.65,1.4]},52,Jy,4e4);r(a,"head",e);const o=new Wt(.1,14,10),c=new Wt(.042,10,8),l=new Wt(.1,16,10),h=n.std({color:0,emissive:15925222,emissiveIntensity:1.4,roughness:1});for(const v of["L","R"]){const g=new ue;g.name=`skelly-eye${v}`;const p=new nt(o,new $e({color:0,emissive:Zu,emissiveIntensity:1,roughness:1}));p.name=`skelly-pupil${v}`,p.scale.set(1,1.1,.7);const _=new nt(c,h);_.position.z=.075,p.add(_);const x=new nt(l,$g(Zu,4));x.name=`skelly-halo${v}`,x.scale.set(2.1,2,1.2),x.renderOrder=2,g.add(p,x),n.at(g,"head",v==="L"?Xa[0]:-.43,Xa[1],Xa[2]),g.traverse(M=>{M.castShadow=!1,M.receiveShadow=!1})}const u=(v,g,p,_,x)=>{const M=[];for(let w=0;w<10;w++){const S=-1.05+w/9*2.1;M.push(new ac(.075,g,2,7).scale(1,1,.75).rotateY(S).translate(p*Math.sin(S),v,x+_*Math.cos(S)))}return M};r(yi(u(16.15,.17,.6,.78,.47)),"head",t,"skelly-teeth"),r(yi([Ve([0,15.98,.8],1,[.58,.24,.4])]),"head",i,"skelly-mouth"),r(sn(Qy,{min:[-1,15.36,-.55],max:[1,16.6,1.22]},36,void 0,12e3),"jaw"),r(yi(u(15.88,.15,.56,.74,.47)),"jaw",t,"skelly-lowerteeth"),r(yi([0,1,2,3].flatMap(v=>v0([0,15.12+v*.25,-.22],.25,.19,.72,.3))),"neck"),r(yi([...[0,1,2,3,4,5].flatMap(v=>v0([0,12.55+v*.4,-.82],.25,.26,.6,.28)),...cp(1),...cp(-1),Ve([0,13.55,1.08],1,[.26,1.05,.12],12),Ve([0,14.42,1],1,[.36,.32,.13],10),...ju([[.22,14.72,1.02],[.85,14.86,.9],[1.55,14.98,.42],[2.18,15.02,.02]],.13,20,8),...ju([[-.22,14.72,1.02],[-.85,14.86,.9],[-1.55,14.98,.42],[-2.18,15.02,.02]],.13,20,8),Ve([1.25,13.95,-1],1,[.62,.85,.09],12),Ve([-1.25,13.95,-1],1,[.62,.85,.09],12)]),"spine2"),r(yi([0,1,2,3].flatMap(v=>v0([0,10.85+v*.42,-.42],.36,.3,1.15,.45))),"spine1"),r(sn(tS,{min:[-1.75,8.72,-1.05],max:[1.75,11.2,1.05]},40,void 0,24e3),"pelvis"),s(yi([Ve([2.33,14.56,-.03],.36),Vs([2.4,14.45,0],[2.71,12.08,-.05],.3,.2,.28),Ve([2.53,11.98,-.05],.21,[1,.9,1],10),Ve([2.88,11.98,-.06],.2,[1,.9,1],10)]),"arm");const f=[2.72,11.9,-.05],d=[2.85,9.45,.4],m=[d[0]-f[0],d[1]-f[1],d[2]-f[2]];s(yi([Ve([2.74,11.98,-.25],.21,[1,1.1,1],10),Vs([2.76,11.85,-.2],[2.86,9.62,.22],.19,.13,.16,10),Vs([2.66,11.72,.12],[2.86,9.62,.54],.16,.13,.21,10),...eS([d[0],d[1]-.05,d[2]],m)]),"forearm"),s(yi([Ve([1.12,9.62,.02],.36),Vs([1.12,9.6,0],[1.55,9.24,-.03],.2,.18,.2,10),Ve([1.64,9.3,-.08],.3,[1,1.2,1]),Vs([1.56,9.22,0],[1.22,5.62,.18],.28,.21,.34),Ve([1,5.5,.12],.29),Ve([1.42,5.5,.12],.29)]),"thigh"),s(yi([Vs([1.19,5.12,.18],[1.16,1.28,-.08],.36,.18,.24),Ve([1,1.16,-.05],.17,[1,1.2,1],10),Vs([1.52,4.95,.02],[1.47,1.3,-.16],.16,.09,.17,10),Ve([1.2,5.36,.62],.27,[1,1.1,.55])]),"shin"),s(yi(nS()),"foot")}const lp=new WeakMap,hp=.015,up=.55,aS=.22,oS=.12,cS=.11,x0=Wg.find(n=>n.name==="head").a,fp=new C(1,0,0),lS=new C(0,1,0),dp=new le,hS=new le,uS=new gt(Zu),fS=new gt(16726546),_0=new gt,Lo=n=>n<0?0:n>1?1:n,dS={id:"skeleton",name:"Skelly",blurb:"Bones, a grin, and green embers for eyes",segs:Wg,dress:rS,fit:{size:1.04,limb:.3},face:{jaw:up,eyes:[[.43,17.02,1.3,.36],[-.43,17.02,1.3,.36]],breath:{colors:[5832490,11861894,15269846,2817952]}},tick(n,t,e){let i=lp.get(n);if(!i){const l=[];for(const h of["L","R"]){const u=n.getObjectByName(`skelly-eye${h}`),f=n.getObjectByName(`skelly-pupil${h}`),d=n.getObjectByName(`skelly-halo${h}`);u&&f&&d&&l.push({g:u,pupil:f,halo:d,pm:f.material,hm:d.material,sx:h==="L"?1:-1})}i={jaw:n.getObjectByName("jaw")??null,eyes:l},lp.set(n,i)}const s=e??null,r=(.95+.3*Math.sin(t*2.1)+.1*Math.sin(t*7.3+1.1))*(1+.45*(s?.jaw??0)),a=(t+1.3)%6.1<.16?1:0,o=s?s.lookX:.5*Math.sin(t*.31+.8*Math.sin(t*.13)),c=s?s.lookY:.2*Math.sin(t*.23+1);for(const l of i.eyes){const h=l.sx>0,u=Lo(s?h?s.blinkL:s.blinkR:a),f=s?h?s.squintL:s.squintR:0,d=s?Lo(Math.max(h?s.wideL:s.wideR,s.browUp,.8*(h?s.browOuterL:s.browOuterR))):0,m=s?Lo(Math.max(h?s.browDownL:s.browDownR,.6*s.sneer)):0,v=s?Lo(s.frown):0,g=s?Lo(Math.max(h?s.smileL:s.smileR,s.smile)):0,p=1-u,_=1+.5*d-.1*m,x=1.1*_*p*(1-.5*f)*(1-.55*m)*(1-.3*g)*(1-.3*v);l.pupil.scale.set(_*(1+.35*u+.15*f+.25*m),Math.max(.001,x),.7*_),l.g.position.set(l.sx*Xa[0]-x0[0]+oS*o,Xa[1]-x0[1]+cS*c-.03*m+.025*g-.02*v,Xa[2]-x0[2]),l.g.rotation.z=l.sx*(.5*m-.4*v),_0.copy(uS).lerp(fS,m),l.pm.emissive.copy(_0),l.pm.emissiveIntensity=r*(.5+.5*p)*(1+.35*d+.3*m),l.halo.scale.set(2.1*(1+.15*d),2*(.4+.6*p)*(1+.15*d)*(1-.3*m),1.2),l.hm.color.copy(_0).multiplyScalar(.2*r*p*(1+.9*d+.4*m))}if(i.jaw)if(s)dp.setFromAxisAngle(lS,aS*s.jawSide),i.jaw.quaternion.copy(dp).multiply(hS.setFromAxisAngle(fp,hp+up*s.jaw));else{const l=t%4.6;i.jaw.quaternion.setFromAxisAngle(fp,l<.75?.05+.07*Math.abs(Math.sin(l*25)):hp)}}},Di=(n,t,e)=>{const i=Math.max(0,Math.min(1,(e-n)/(t-n)));return i*i*(3-2*i)},bh=(n,t,e)=>-O(-n,-t,e);function jg(n,t){const e=n.bones.get("pelvis").parent;if(!e?.isSkinnedMesh)return;const i=new Set([e.geometry]);for(const c of e.children)c.isSkinnedMesh&&c.userData.h!==void 0&&i.add(c.geometry);const s=n.segs.findIndex(c=>c.name==="head"),r=t.map(c=>n.segs.findIndex(l=>l.name===c.bone)),a=[0,0],o=[0,0];for(const c of i){const l=c.attributes.position,h=c.attributes.skinIndex,u=c.attributes.skinWeight;for(let f=0;f<l.count;f++){const d=h.getX(f),m=h.getY(f)===d,v=m?0:h.getY(f);let g=u.getX(f)+(m?u.getY(f):0),p=m?0:u.getY(f);const _=(d===s?g:0)+(v===s?p:0);if(_<1e-4)continue;const x=l.getX(f),M=l.getY(f),w=l.getZ(f);let S=0,T=_;for(let b=0;b<t.length&&S<2;b++){const y=t[b].w(x,M,w);y<.002||(a[S]=T*Math.min(1,y),o[S]=r[b],T-=a[S],S++)}if(!S)continue;const A=T/_;d===s&&(g*=A),v===s&&(p*=A),h.setXYZW(f,d,v,o[0],S>1?o[1]:0),u.setXYZW(f,g,p,a[0],S>1?a[1]:0)}h.needsUpdate=!0,u.needsUpdate=!0}}function Zg(n,t,e,i,s,r,a,o,c,l){const h=n.bones.get("pelvis").parent;if(!h?.isSkinnedMesh)return null;const u=sn(i,s,r,a,24e3),f=u.attributes.position.count,d=u.attributes.position,m=new Uint16Array(f*4),v=new Float32Array(f*4),g=new Float32Array(f),p=n.segs.findIndex(x=>x.name===e);for(let x=0;x<f;x++)m[x*4]=p,v[x*4]=1,g[x]=l(d.getX(x),d.getY(x),d.getZ(x));u.setAttribute("skinIndex",new $t(m,4)),u.setAttribute("skinWeight",new $t(v,4)),u.setAttribute("aFur",new $t(g,1));const _=new Sc(u,Zl(!!o));return _.name=t,_.castShadow=!0,_.receiveShadow=!0,_.frustumCulled=!1,h.add(_),_.bind(h.skeleton,h.bindMatrix),o&&c>0&&Gg(_,u,o,c),_}function Jg(n,t,e,i){const s=n.bones.get("pelvis").parent;if(!s?.isSkinnedMesh)return null;const r=n.segs.findIndex(g=>g.name==="head"),a=n.segs.findIndex(g=>g.name==="jaw"),o=4,c=e.length,l=[],h=[],u=[],f=[],d=[];for(const g of[1,-1]){const p=l.length/3;for(const _ of e)for(let x=0;x<=o;x++)l.push(g*_[0],_[1],_[2]),h.push(g,0,0),u.push(r,a,0,0),f.push(1-x/o,x/o,0,0);for(let _=0;_+1<c;_++)for(let x=0;x<o;x++){const M=p+_*(o+1)+x,w=M+o+1;d.push(M,w,M+1,w,w+1,M+1)}}const m=new xe;m.setAttribute("position",new ie(l,3)),m.setAttribute("normal",new ie(h,3)),m.setAttribute("skinIndex",new Bf(u,4)),m.setAttribute("skinWeight",new ie(f,4)),m.setIndex(d);const v=new Sc(m,n.std({color:i,roughness:.8,side:Se}));return v.name=t,v.frustumCulled=!1,v.receiveShadow=!0,s.add(v),v.bind(s.skeleton,s.bindMatrix),v}function Kg(n,t){for(let e=0;e<2;e++){const i=n[e],s=e===0;if(!i)continue;const r=Math.max(s?t.squintL:t.squintR,.75*(s?t.smileL:t.smileR));ho(i,Math.max(s?t.blinkL:t.blinkR,.3*r),r,s?t.wideL:t.wideR)}}const Qg=n=>{const t=(n+1.3)%4.6;return t<.16?Math.sin(t/.16*Math.PI):0},ln=16,tr=3.75,Jf=.66,Kf=(n,t,e)=>Math.max(t-ln,tr-e,n-Jf),Yo=[.8,17.85,3.05],jo=[1.05,19.4,2.7],Ln=[.6,17.45,4.8],Ai=[.38,16.15,6.55],dl=n=>[-n[0],n[1],n[2]],t2=[{name:"pelvis",a:[0,9.4,-.6],b:[0,10.4,0],parent:null},{name:"spine1",a:[0,10.4,0],b:[0,12.6,.8],parent:"pelvis"},{name:"spine2",a:[0,12.6,.8],b:[0,14.8,1.9],parent:"spine1"},{name:"neck",a:[0,14.8,1.9],b:[0,16,3],parent:"spine2",reach:1.6},{name:"head",a:[0,16,3],b:[0,16.6,5.8],parent:"neck"},{name:"jaw",a:[0,ln,tr],b:[0,ln-.15,6.2],parent:"head",reach:0},{name:"tail1",a:[0,9.2,-1.6],b:[0,8.2,-3.6],parent:"pelvis",reach:1.8},{name:"tail2",a:[0,8.2,-3.6],b:[0,6.8,-5.2],parent:"tail1",reach:1.8},{name:"tail3",a:[0,6.8,-5.2],b:[0,5.3,-6.4],parent:"tail2",reach:1.6},{name:"tail4",a:[0,5.3,-6.4],b:[0,4,-7.2],parent:"tail3",reach:1.4},{name:"thighL",a:[1.6,9.2,-.3],b:[1.9,6,1.3],parent:"pelvis"},{name:"shinL",a:[1.9,6,1.3],b:[1.9,2.8,-.9],parent:"thighL"},{name:"footL",a:[1.9,2.8,-.9],b:[1.9,.4,1],parent:"shinL"},{name:"thighR",a:[-1.6,9.2,-.3],b:[-1.9,6,1.3],parent:"pelvis"},{name:"shinR",a:[-1.9,6,1.3],b:[-1.9,2.8,-.9],parent:"thighR"},{name:"footR",a:[-1.9,2.8,-.9],b:[-1.9,.4,1],parent:"shinR"},{name:"armL",a:[2.7,14.3,1.6],b:[3.3,11.2,2],parent:"spine2"},{name:"forearmL",a:[3.3,11.2,2],b:[3.2,8.2,3.2],parent:"armL"},{name:"armR",a:[-2.7,14.3,1.6],b:[-3.3,11.2,2],parent:"spine2"},{name:"forearmR",a:[-3.3,11.2,2],b:[-3.2,8.2,3.2],parent:"armR"},{name:"earL",a:Yo,b:jo,parent:"head",reach:0},{name:"earR",a:dl(Yo),b:dl(jo),parent:"head",reach:0},{name:"browL",a:Ln,b:[Ln[0]+.45,Ln[1],Ln[2]-.35],parent:"head",reach:0},{name:"browR",a:dl(Ln),b:[-Ln[0]-.45,Ln[1],Ln[2]-.35],parent:"head",reach:0},{name:"lipL",a:Ai,b:[Ai[0]+.08,Ai[1]-.1,Ai[2]-1.9],parent:"head",reach:0},{name:"lipR",a:dl(Ai),b:[-Ai[0]-.08,Ai[1]-.1,Ai[2]-1.9],parent:"head",reach:0}],pS={min:[-5,-.5,-8.6],max:[5,20.4,8.6]},an=[.62,17.05,4.75],pp=[0,16.35,7.35];function wh(n,t,e,i){let s=ct(n,e,i,0,16.9,3.6,1.35,1.25,1.55);return s=O(s,K(n,e,i,0,16.7,4.6,0,16.3,7.1,.82,.45),.5),s=O(s,ct(t,e,i,.36,16,5.4,.27,.24,1.55),.3),s=O(s,ct(t,e,i,1.15,16.5,3.6,.55,.75,.9),.4),s=O(s,K(t,e,i,.22,17.4,4.95,.95,17.5,4.45,.2,.17),.22),s=O(s,K(t,e,i,.75,17.8,3.1,1.05,19.4,2.7,.5,.06),.3),Math.max(s,-ve(t,e,i,an[0],an[1],an[2]+.12,.3))}function mS(n,t,e){const i=Math.abs(n),s=Kf(i,t,e);if(s>.08||s<-.6)return!1;const r=wh(n,i,t,e);return-s>r-.02&&r<-.06}function gS(n,t,e){const i=Math.abs(n);let s=bh(wh(n,i,t,e),Kf(i,t,e),.06);return s=O(s,K(n,t,e,0,15.8,4.4,0,15.75,6.7,.55,.32),.25),Math.max(s,t-ln,tr-.3-e)}const vS={min:[-.9,15,3.3],max:[.9,ln+.05,7.3]};function xS(n,t,e,i=0){const s=Math.abs(n);let r=ct(n,t,e,0,13.4,1.4,2.6,2.5,2.1);r=O(r,ct(n,t,e,0,11.2,.4,1.7,1.6,1.4),.9),r=O(r,ct(n,t,e,0,9.8,-.4,2,1.2,1.5),.7),r=O(r,ct(n,t,e,0,15.1,1.6,2.3,1.5,2),.8),r=O(r,ve(s,t,e,2.5,14.2,1.5,1.05),.7),r=O(r,bh(wh(n,s,t,e),-Kf(s,t,e),.08),.6),r=O(r,K(s,t,e,2.7,14.3,1.6,3.3,11.2,2,.9,.72),.5),r=O(r,K(s,t,e,3.3,11.2,2,3.2,8.4,3.1,.78,.55),.35),r=O(r,ct(s,t,e,3.2,7.9,3.35,.55,.75,.55),.3),r=O(r,K(s,t,e,1.6,9.2,-.3,1.9,6,1.3,1.25,.85),.6),r=O(r,K(s,t,e,1.9,6,1.3,1.9,2.8,-.9,.75,.48),.4),r=O(r,K(s,t,e,1.9,2.8,-.9,1.9,.5,.9,.5,.42),.3);const a=[[0,9.2,-1.6,.6],[0,8.2,-3.6,1],[0,6.8,-5.2,1.15],[0,5.3,-6.4,.9],[0,4,-7.2,.35]];for(let o=0;o+1<a.length;o++){const c=a[o],l=a[o+1];r=O(r,K(n,t,e,c[0],c[1],c[2],l[0],l[1],l[2],c[3],l[3]),.5)}r-=i;for(const o of[-1.5,-.5,.5,1.5])r=O(r,K(s,t,e,3.2+o*.17,7.4,3.5,3.2+o*.22,6.5,3.85,.17,.03),.1);for(const o of[-1,0,1])r=O(r,K(s,t,e,1.9+o*.28,.4,1.2,1.9+o*.34,.1,1.85,.2,.03),.1);return r}const Ll=[7827562,12103584,3420204,1183760,4856864];function Qf(n,t,e){const i=Math.abs(n);return Math.hypot(n,t-pp[1],e-pp[2])<.45?3:mS(n,t,e)?4:t>ln-.08&&t<ln+.1&&e>tr+.85&&e<7.4||t<7.6&&t>6.2&&e>3.4&&i>2.6||t<.5&&e>1.2?3:t>17.4&&i>.6&&e<3.2||e<-6.3?2:t>15.4&&t<16.4&&e>4.4||t>14.6&&t<15.8&&e>2.8&&i<1.2||e>2.2&&t>10.2&&t<15&&i<1.8?1:t>12.4&&e<.8&&i<1.9&&t>12.4+.5*i?2:0}function e2(n,t,e){const i=Math.abs(n);return Qf(n,t,e)>=3||Math.abs(t-ln)<.16&&e>tr-.2&&i<Jf+.12||Math.hypot(i-an[0],t-an[1],e-an[2])<.65?0:e>4.6&&t>15.2?.35:t>17.6?.4:t>14&&t<16.4&&e<3.4||e<-1.4&&t<9.6?1.4:t<3?.45:1}const mp=n=>Di(-.12,.12,n),_S=[1,-1].flatMap(n=>{const t=n>0?"L":"R",e=l=>n>0?mp(l):1-mp(l),i=[n*Yo[0],Yo[1],Yo[2]],s=[n*jo[0],jo[1],jo[2]],r=s[0]-i[0],a=s[1]-i[1],o=s[2]-i[2],c=r*r+a*a+o*o;return[{bone:"ear"+t,w:(l,h,u)=>{const f=((l-i[0])*r+(h-i[1])*a+(u-i[2])*o)/c,d=K(l,h,u,i[0],i[1],i[2],s[0],s[1],s[2],.5,.06);return e(l)*Di(.03,.3,f)*Di(.6,.2,d)}},{bone:"brow"+t,w:(l,h,u)=>{const f=Math.hypot((n*l-Ln[0])/.6,(h-Ln[1])/.42,(u-Ln[2])/.65);return e(l)*(1-Di(.4,1,f))}},{bone:"lip"+t,w:(l,h,u)=>{const f=Math.hypot((n*l-.42)/.42,(h-16.12)/.48,(u-5.85)/1.3);return e(l)*(1-Di(.4,1,f))*Di(ln-.3,ln-.05,h+.25)}}]});function MS(n,t,e,i){const s=t>ln-.05,r=s&&wh(n,Math.abs(n),ln+.02,e)<-.15;i.setHex(r?Ll[4]:s?Ll[3]:Ll[Qf(n,t,e)])}const bS=(n,t,e)=>t>ln-.08||Math.abs(n)>Jf-.06?0:e2(n,t,e),wS={length:.8,density:7,tip:.22};function yS(n){jg(n,_S);const t=n.std({color:16756768,emissive:16756768,emissiveIntensity:1.8,roughness:.3}),e=n.std({color:788486,roughness:.3}),i=n.std({color:5130308,roughness:.9});for(const[u,f]of[[1,"L"],[-1,"R"]]){const d=new ue;d.name="howl-eye"+f,d.add(new nt(new Wt(.24,16,12),t));const m=new nt(new Wt(.1,10,8),e);m.position.z=.205,m.scale.set(.62,1.2,.4),d.add(m),n.at(d,"head",u*an[0],an[1],an[2]),n.at(Ec("howl-lid"+f,.24,i,{gap:.1,tilt:u*.3,open:.85}),"head",u*an[0],an[1],an[2])}Zg(n,"howl-jaw","jaw",gS,vS,26,MS,wS,5,bS);const s=new Wt(1,18,10).scale(.3,.12,.95).translate(0,ln-.13,5.35);n.at(new nt(s,n.std({color:12079196,roughness:.45})),"jaw",0,0,0);const r=n.std({color:15788760,roughness:.35}),a=(u,f,d,m,v,g=.25)=>{const p=new ii(m,d,7);return v&&p.rotateX(Math.PI),p.translate(u,ln+(v?g-d/2:d/2-g),f)},o=[],c=[];for(const u of[1,-1]){o.push(a(u*.35,6.3,.85,.095,!0,.4),a(u*.38,5.6,.52,.065,!0,.36),a(u*.38,5.05,.48,.065,!0,.36)),c.push(a(u*.24,6.45,.55,.085,!1),a(u*.27,5.5,.3,.06,!1));for(const f of[.07,.19])o.push(a(u*f,6.95,.42,.045,!0,.3)),c.push(a(u*f,6.6,.34,.04,!1))}n.at(new nt(On(o),r),"head",0,0,0),n.at(new nt(On(c),r),"jaw",0,0,0);const l=[];for(let u=0;u<=8;u++){const f=tr+.05+u/8*2;l.push([.5-.08*(f-tr),ln,f])}Jg(n,"howl-mouth",l,2757140);const h=new Wt(1,14,8).scale(.45,.3,.5).translate(0,ln-.32,tr+.55);n.at(new nt(h,n.std({color:1706764,roughness:.9})),"head",0,0,0)}const gp=new WeakMap,qa=t2.find(n=>n.name==="head").a,M0=[Ln[0]-qa[0],Ln[1]-qa[1],Ln[2]-qa[2]],b0=[Ai[0]-qa[0],Ai[1]-qa[1],Ai[2]-qa[2]],SS=(n,t)=>{const e=(n+t)%7.3;return e<.35?.16*Math.sin(e/.35*Math.PI*2)*(1-e/.35):0};function ES(n,t,e){let i=gp.get(n);if(!i){const c=h=>n.getObjectByName(h)??null,l=h=>[c(h+"L"),c(h+"R")];i={eyes:l("howl-eye"),lids:l("howl-lid"),ears:l("ear"),brows:l("brow"),lips:l("lip")},gp.set(n,i)}const s=e??null;if(s)Kg(i.lids,s);else{const c=Qg(t);for(const l of i.lids)l&&ho(l,c,0,0)}for(const c of i.eyes)c&&Zf(c,s,.5);const r=s?.browUp??0,a=s?.frown??0,o=s?.sneer??0;for(let c=0;c<2;c++){const l=c===0,h=l?1:-1,u=s?l?s.browOuterL:s.browOuterR:0,f=s?l?s.browDownL:s.browDownR:0,d=s?l?s.wideL:s.wideR:0,m=s?l?s.smileL:s.smileR:0,v=i.brows[c];v&&(v.position.set(h*M0[0],M0[1]+.26*(.55*r+.45*u)-.2*f,M0[2]+.05*f),v.rotation.z=h*(.3*(u-r)+.35*f));const g=i.ears[c];if(g){const _=Math.max(d,.8*r,u),x=Math.max(f,o,.8*a);g.rotation.set(.18*_-.75*x+SS(t,l?2.4:5),0,-h*(.35*x-.12*_))}const p=i.lips[c];p&&(p.position.set(h*(b0[0]+.06*o),b0[1]+.36*o+.08*m-.06*a,b0[2]-.14*m),p.rotation.x=.16*m-.1*a-.06*o)}}const Gr=2.1,Na=[1.95,6,.2],is=[Gr,3.4,.55],Er=[Gr,1,0],vp=[Gr,.3,2],qi=[2.9,11,.8],ti=[4.99,10.54,1.28],er=[6.76,10.06,1.79],Pn=[[0,6.6,-2.6],[.5,4.6,-4.4],[1.6,2.4,-5.3],[3,1.1,-5.2],[4.5,.85,-4.1]],xp=[1.15,1.45,1.4,1.2,.75],qt=[0,14.4,.6],Jl=-1.25,Wr=.9,td=.08,ed=.74,Tc=(n,t)=>n-Jl-td*(t-Wr),n2=(n,t,e)=>Math.max(Tc(t,e),Wr-e,n-ed),Fs=[1.44,qt[1]+1.5,qt[2]-.66],In=[1.1,qt[1]+1.1,qt[2]+1.5],Dn=[1.8,qt[1]-.66,qt[2]+.25],i2=[{name:"pelvis",a:[0,6,0],b:[0,7.6,0],parent:null},{name:"spine1",a:[0,7.6,0],b:[0,9.4,.1],parent:"pelvis"},{name:"spine2",a:[0,9.4,.1],b:[0,11.4,.1],parent:"spine1"},{name:"neck",a:[0,11.4,.1],b:[0,qt[1]-1.6,qt[2]-.25],parent:"spine2"},{name:"head",a:[0,qt[1]-1.6,qt[2]-.25],b:[0,qt[1]+1.6,qt[2]+.1],parent:"neck"},{name:"jaw",a:[0,qt[1]+Jl,qt[2]+Wr],b:[0,qt[1]+Jl+td*2.1-.15,qt[2]+3],parent:"head",reach:0},{name:"tail1",a:Pn[0],b:Pn[1],parent:"pelvis"},{name:"tail2",a:Pn[1],b:Pn[2],parent:"tail1"},{name:"tail3",a:Pn[2],b:Pn[3],parent:"tail2"},{name:"tail4",a:Pn[3],b:Pn[4],parent:"tail3"},{name:"thighL",a:Na,b:is,parent:"pelvis"},{name:"shinL",a:is,b:Er,parent:"thighL"},{name:"footL",a:Er,b:vp,parent:"shinL"},{name:"thighR",a:Gn(Na),b:Gn(is),parent:"pelvis"},{name:"shinR",a:Gn(is),b:Gn(Er),parent:"thighR"},{name:"footR",a:Gn(Er),b:Gn(vp),parent:"shinR"},{name:"armL",a:qi,b:ti,parent:"spine2"},{name:"forearmL",a:ti,b:er,parent:"armL"},{name:"armR",a:Gn(qi),b:Gn(ti),parent:"spine2"},{name:"forearmR",a:Gn(ti),b:Gn(er),parent:"armR"},{name:"earL",a:Fs,b:[Fs[0],Fs[1]+1.5,Fs[2]],parent:"head",reach:0},{name:"earR",a:Gn(Fs),b:[-Fs[0],Fs[1]+1.5,Fs[2]],parent:"head",reach:0},{name:"browL",a:In,b:[In[0]+.8,In[1]-.15,In[2]-.4],parent:"head",reach:0},{name:"browR",a:Gn(In),b:[-In[0]-.8,In[1]-.15,In[2]-.4],parent:"head",reach:0},{name:"cheekL",a:Dn,b:[Dn[0]+1,Dn[1],Dn[2]],parent:"head",reach:0},{name:"cheekR",a:Gn(Dn),b:[-Dn[0]-1,Dn[1],Dn[2]],parent:"head",reach:0}];function Gn(n){return[-n[0],n[1],n[2]]}const TS={min:[-8.6,-.4,-7.2],max:[8.6,18.4,5.8]},on=[.98,qt[1]+.33,qt[2]+1.97],Ir=[0,qt[1]-.5,qt[2]+4.05],Fi=nd(s2(er,ti)),w0=nd([-Fi[2],0,Fi[0]]);function s2(n,t){return[n[0]-t[0],n[1]-t[1],n[2]-t[2]]}function nd(n){const t=Math.hypot(n[0],n[1],n[2]);return[n[0]/t,n[1]/t,n[2]/t]}const uo=(n,t,e,i=0)=>[n[0]+Fi[0]*t+w0[0]*e,n[1]+Fi[1]*t+w0[1]*e+i,n[2]+Fi[2]*t+w0[2]*e],Pi=uo(er,.35,0),AS=uo(Pi,1.3,0),r2=(n,t,e)=>(n-er[0])*Fi[0]+(t-er[1])*Fi[1]+(e-er[2])*Fi[2],a2=[-.42,-.14,.14,.42].map(n=>[uo(Pi,.35,n*1.1),uo(Pi,1.15-Math.abs(n)*.5,n*1.35,-.12)]);a2.push([uo(Pi,-.1,.45),uo(Pi,.45,.95,-.1)]);const RS=[-.5,-.17,.17,.5].map(n=>[[Gr+n*1.1,.3,1.8],[Gr+n*1.3,.22,2.7-Math.abs(n)*.4]]),ks=(n,t,e,i,s,r,a)=>K(n,t,e,i[0],i[1],i[2],s[0],s[1],s[2],r,a),va=2.5;let _p=NaN,Mp=NaN,bp=NaN;const Si={body:0,head:0,arm:0,leg:0,tail:0,min:0,raw:0,cut:0};function id(n,t,e,i){let s=ct(n,e,i,0,0,0,2.38,2.05,2.21);return s=O(s,ct(t,e,i,1.8,-.66,.25,1.15,1.23,1.31),.66),s=O(s,K(n,e,i,0,-.25,1.48,0,-.57,3.6,1.11,.45),.5),s=O(s,ct(t,e,i,.3,-.86,2.75,.4,.3,.62),.3),s=O(s,ct(t,e,i,1.44,2.05,-.66,.78,1.03,.34),.29),Math.max(s,-ve(t,e,i,on[0]+.05,on[1]-qt[1],on[2]-qt[2]+.2,.34))}const o2=n=>n.cut<.08&&-n.cut>n.raw-.02;function CS(n,t,e){const i=Math.abs(n),s=t-qt[1],r=e-qt[2];let a=bh(id(n,i,s,r),n2(i,s,r),.06);return a=O(a,K(n,s,r,0,-1.07,1.15,0,-1.23,2.95,.78,.41),.2),Math.max(a,Tc(s,r),Wr-.3-r)}const LS={min:[-1,qt[1]-2.1,qt[2]+.5],max:[1,qt[1]-.8,qt[2]+3.6]};function Ac(n,t,e){if(n===_p&&t===Mp&&e===bp)return Si;_p=n,Mp=t,bp=e;const i=Math.abs(n);let s=ve(n,t,e,0,9.2,.2,5.6);s<va&&(s=ct(n,t,e,0,7.7,.35,3.85,3.35,3.4),s=O(s,ct(n,t,e,0,10.3,.3,3,2.1,2.7),1.6),s=O(s,ct(n,t,e,0,6.9,-1.2,3.4,2.6,2.7),1.2),s=O(s,ve(i,t,e,qi[0],qi[1],qi[2],.85),.7),s=O(s,K(n,t,e,0,11,.2,0,qt[1]-1.4,qt[2]-.15,2.1,1.7),.8)),Si.body=s;const r=t-qt[1],a=e-qt[2];let o=ve(n,r,a,0,.6,.5,4.3),c=9;Si.raw=o,o<va&&(Si.raw=o=id(n,i,r,a),c=n2(i,r,a),o=bh(o,-c,.08)),Si.head=o,Si.cut=c;let l=ks(i,t,e,qi,AS,1.6,1.6);if(l<va&&(l=ks(i,t,e,qi,ti,.72,.8),l=O(l,ve(i,t,e,(qi[0]+ti[0])/2,(qi[1]+ti[1])/2,(qi[2]+ti[2])/2,.9),.6),l=O(l,ks(i,t,e,ti,er,.8,.6),.4),ve(i,t,e,Pi[0],Pi[1],Pi[2],1.6)<va)){l=O(l,ct(i,t,e,Pi[0],Pi[1],Pi[2],.62,.38,.62),.3);for(const f of a2)l=O(l,ks(i,t,e,f[0],f[1],.24,.17),.14)}Si.arm=l;let h=K(i,t,e,Na[0],Na[1],Na[2],Gr,.6,1,2,2);if(h<va&&(h=ks(i,t,e,Na,is,1.42,1.1),h=O(h,ks(i,t,e,is,Er,1.08,.85),.5),t<2.6)){h=O(h,Math.max(ct(i,t,e,Gr,.45,.75,.95,.6,1.75),-t),.45);for(const f of RS)h=O(h,ks(i,t,e,f[0],f[1],.26,.18),.15)}Si.leg=h;let u=ve(n,t,e,2,3.4,-4.4,5.4);if(u<va){u=1e9;for(let f=0;f+1<Pn.length;f++)u=O(u,ks(n,t,e,Pn[f],Pn[f+1],xp[f],xp[f+1]),.5)}return Si.tail=u,Si.min=Math.min(s,o,l,h,u),Si}function PS(n,t,e){const i=Ac(n,t,e);let s=O(i.body,i.head,.6);return s=O(s,i.arm,.5),s=O(s,i.leg,.7),O(s,i.tail,.6)}function IS(n,t,e){let i=0,s=1/0,r=0;for(let a=0;a+1<Pn.length;a++){const o=Pn[a],c=Pn[a+1],l=c[0]-o[0],h=c[1]-o[1],u=c[2]-o[2],f=l*l+h*h+u*u,d=Math.max(0,Math.min(1,((n-o[0])*l+(t-o[1])*h+(e-o[2])*u)/f)),m=n-o[0]-l*d,v=t-o[1]-h*d,g=e-o[2]-u*d,p=m*m+v*v+g*g;p<s&&(s=p,i=r+d*Math.sqrt(f)),r+=Math.sqrt(f)}return i}function DS(n,t,e){const i=Math.abs(n);if(Math.hypot(n,t-Ir[1],e-Ir[2])<.62)return 3;const s=Ac(n,t,e),r=s.min;if(s.head===r&&o2(s))return s.raw<-.08?6:2;if(s.head===r){const a=t-qt[1],o=e-qt[2];if(o>.2&&a>-1.9){const c=i-1.1,l=a-.22+.32*c;if((c/1.25)**2+(l/.66)**2<1||i<.34&&a>-.35&&a<2.4&&o>.6)return 2;const h=i-1.05,u=a-1.12+.18*h;if((h/1)**2+(u/.4)**2<1||a<-.15+.25*Math.max(0,i-1.2)&&o>.5)return 1}return a>2.75&&i>.98?1:0}if(s.tail===r){const a=IS(n,t,e);return a>7.9||a%2<.85?2:4}return s.arm===r?r2(i,t,e)>-.25?5:0:s.leg===r?t<1.3?5:0:e>1.2&&(n/2.4)**2+((t-7.9)/3.1)**2<1?4:0}function US(n,t,e){const i=Math.abs(n),s=Math.hypot(i-on[0],t-on[1],e-on[2]);if(s<.62||Math.hypot(n,t-Ir[1],e-Ir[2])<.85)return 0;const r=Ac(n,t,e),a=r.min;if(r.head===a){if(o2(r)||Math.abs(Tc(t-qt[1],e-qt[2]))<.09&&e-qt[2]>Wr-.2&&i<ed+.1)return 0;const o=t-qt[1],c=e-qt[2];return o>1.4&&i>.9&&c<.1?.5:i>1.4&&o<0&&c<1.5?1.35:c>1?.35+.4*Math.min(1,(s-.62)/1.3):.9}return r.tail===a?1.4:r.arm===a?r2(i,t,e)>-.25?.25:.9:r.leg===a?t<1.3?.3:1:1.1}const NS=.15,FS=new Map([["pelvis",0],["spine1",0],["spine2",0],["neck",1],["head",2],["jaw",2],["armL",3],["forearmL",3],["armR",4],["forearmR",4],["thighL",5],["shinL",5],["footL",5],["thighR",6],["shinR",6],["footR",6],["tail1",7],["tail2",7],["tail3",7],["tail4",7]]),y0=nd(s2(Er,is)),kS=new Map([["forearm",(n,t,e)=>(n-ti[0])*Fi[0]+(t-ti[1])*Fi[1]+(e-ti[2])*Fi[2]>-.9],["shin",(n,t,e)=>(n-is[0])*y0[0]+(t-is[1])*y0[1]+(e-is[2])*y0[2]>-.9],["foot",(n,t)=>t<Er[1]+.7]]),pl=(n,t,e,i)=>{const s=kS.get(n.slice(0,-1));return!s||s(Math.abs(t),e,i)},OS=(n,t,e,i)=>{const s=Ac(t,e,i),r=s.min+NS;switch(FS.get(n.name)){case 0:return s.body<=r;case 1:return e>10.6&&(s.body<=r&&Math.abs(t)<2.4||s.head<=r&&e<qt[1]-1.6);case 2:return s.head<=r&&e>qt[1]-2.1||s.body<=r&&e>12&&Math.abs(t)<2;case 3:return s.arm<=r&&t>.5&&pl(n.name,t,e,i);case 4:return s.arm<=r&&t<-.5&&pl(n.name,t,e,i);case 5:return s.leg<=r&&t>.2&&pl(n.name,t,e,i);case 6:return s.leg<=r&&t<-.2&&pl(n.name,t,e,i);case 7:return s.tail<=r;default:return!0}},c2={length:1,density:7,tip:.18},BS=new gt(15130834),HS=new gt(5908010),zS=new gt(2761760);function VS(n,t,e,i){const s=t-qt[1],r=e-qt[2],a=Tc(s,r)>-.06;i.copy(a?id(n,Math.abs(n),s+.02,r)<-.15?HS:zS:BS)}function GS(n,t,e){return Tc(t-qt[1],e-qt[2])>-.08||Math.abs(n)>ed-.06?0:.42}const wp=n=>Di(-.12,.12,n),WS=[1,-1].flatMap(n=>{const t=n>0?"L":"R",e=i=>n>0?wp(i):1-wp(i);return[{bone:"ear"+t,w:(i,s,r)=>{const a=n*i,o=s-qt[1],c=r-qt[2],l=Math.hypot(i/2.38,o/2.05,c/2.21),h=Math.hypot((a-1.44)/.78,(o-2.05)/1.03,(c+.66)/.34);return e(i)*Di(1,1.14,l)*Di(1.75,1.25,h)}},{bone:"brow"+t,w:(i,s,r)=>{const a=Math.hypot((n*i-In[0])/.85,(s-In[1])/.55,(r-In[2])/1);return e(i)*(1-Di(.45,1,a))}},{bone:"cheek"+t,w:(i,s,r)=>{const a=Math.hypot((n*i-Dn[0])/1.6,(s-Dn[1])/1.4,(r-Dn[2])/1.6);return e(i)*(1-Di(.45,1.05,a))}}]});function XS(n){jg(n,WS);const t=n.std({color:328965,roughness:.06,metalness:.1}),e=n.std({color:16777215,emissive:16777215,emissiveIntensity:1.1,roughness:.3}),i=n.std({color:2169881,roughness:1});for(const[m,v]of[[1,"L"],[-1,"R"]]){const g=new ue;g.name="jim-eye"+v,g.add(new nt(new Wt(.34,14,10),t));const p=new nt(new Wt(.075,8,6),e);p.position.set(.1,.15,.28),p.scale.set(1,1,.35),g.add(p),n.at(g,"head",m*on[0],on[1],on[2]),n.at(Ec("jim-lid"+v,.34,i,{gap:.1}),"head",m*on[0],on[1],on[2])}const s=new nt(new Wt(.42,14,10),n.std({color:657930,roughness:.25}));s.scale.set(1.15,.8,.75),n.at(s,"head",Ir[0],Ir[1],Ir[2]),Zg(n,"jim-jaw","jaw",CS,LS,24,VS,c2,5,GS);const r=m=>qt[1]+Jl+td*(m-Wr),a=new Wt(1,18,10).scale(.34,.14,.78).translate(0,r(2.05)-.12,qt[2]+2.05);n.at(new nt(a,n.std({color:13132910,roughness:.45})),"jaw",0,0,0);const o=n.std({color:15920868,roughness:.35}),c=(m,v,g,p,_)=>{const x=new ii(p,g,7);return _&&x.rotateX(Math.PI),x.translate(m,r(v)+(_?.1-g/2:g/2-.1),qt[2]+v)},l=[c(.3,2.62,.34,.065,!0),c(-.3,2.62,.34,.065,!0)];for(const m of[-.19,-.065,.065,.19])l.push(c(m,3.08,.2,.034,!0));const h=[c(.23,2.45,.3,.055,!1),c(-.23,2.45,.3,.055,!1)];n.at(new nt(On(l),o),"head",0,0,0),n.at(new nt(On(h),o),"jaw",0,0,0);const u=[];for(let m=0;m<=8;m++){const v=Wr+.05+m/8*1.5;u.push([.68-.13*(v-1),r(v),qt[2]+v])}Jg(n,"jim-mouth",u,2757140);const f=new Wt(1,14,8).scale(.5,.3,.45).translate(0,qt[1]-1.35,qt[2]+1.35);n.at(new nt(f,n.std({color:1706764,roughness:.9})),"head",0,0,0);const d=n.std({color:1775638,roughness:.5});for(const[m,v]of[[1,"L"],[-1,"R"]]){const g=[];for(const[x,M,w,S,T]of[[.09,-.04,.12,-.32,1.9],[-.02,.06,-.02,-.2,2.1],[-.12,.15,-.17,-.1,1.8]]){const A=new C(m,w,S).normalize();g.push(new vn(.01,.035,T,5).translate(0,T/2,0).applyQuaternion(new le().setFromUnitVectors(new C(0,1,0),A)).translate(0,x,M))}const p=new nt(On(g),d);p.castShadow=!1;const _=new ue;_.name="jim-whisk"+v,_.add(p),n.at(_,"head",m*.55,qt[1]-.82,qt[2]+2.8)}}const yp=new WeakMap,$a=i2.find(n=>n.name==="head").a,S0=[In[0]-$a[0],In[1]-$a[1],In[2]-$a[2]],E0=[Dn[0]-$a[0],Dn[1]-$a[1],Dn[2]-$a[2]],qS=(n,t)=>{const e=(n+t)%6.1;return e<.4?.22*Math.sin(e/.4*Math.PI*2)*(1-e/.4):0},$S=n=>{const t=(n+2.2)%3.7;return t<.45?.07*Math.sin(t*42)*(1-t/.45):0};function YS(n,t,e){let i=yp.get(n);if(!i){const l=u=>n.getObjectByName(u)??null,h=u=>[l(u+"L"),l(u+"R")];i={eyes:h("jim-eye"),lids:h("jim-lid"),ears:h("ear"),brows:h("brow"),cheeks:h("cheek"),whisk:h("jim-whisk")},yp.set(n,i)}const s=e??null;if(s)Kg(i.lids,s);else{const l=Qg(t);for(const h of i.lids)h&&ho(h,l,0,0)}for(const l of i.eyes)l&&Zf(l,s,.75);const r=s?.frown??0,a=s?.sneer??0,o=s?.puff??0,c=s?.browUp??0;for(let l=0;l<2;l++){const h=l===0,u=h?1:-1,f=s?h?s.browOuterL:s.browOuterR:0,d=s?h?s.browDownL:s.browDownR:0,m=s?h?s.wideL:s.wideR:0,v=s?h?s.smileL:s.smileR:0,g=i.brows[l];g&&(g.position.set(u*S0[0],S0[1]+.36*(.55*c+.45*f)-.26*d,S0[2]+.06*d),g.rotation.z=u*(.32*(f-c)+.3*d));const p=i.ears[l];if(p){const M=Math.max(m,.8*c,f),w=Math.max(d,.6*a),S=r;p.rotation.set(.2*M-.55*w-.12*S+qS(t,h?3.1:.4),0,-u*(.45*w+.4*S-.15*M))}const _=i.cheeks[l];_&&(_.position.set(u*(E0[0]+.12*o+.06*v),E0[1]+.34*v+.12*a-.14*r,E0[2]-.1*v+.08*o),_.scale.setScalar(1+.22*o+.08*v));const x=i.whisk[l];x&&x.rotation.set(0,-u*.3*v,u*(.28*a+.2*o-.12*r+$S(t)))}}const jS={id:"jimothy",name:"Jimothy",blurb:"The round Seattle raccoon, standing up",segs:i2,body:{sdf:PS,region:DS,box:TS,palette:[7103837,15130834,1841431,657930,9406332,3814192,4858406],weights:"soft",capture:OS,fur:c2,furLen:US,tint(n,t,e,i,s){if(n!==0)return;i<-.5&&s.multiplyScalar(1-.2*Math.min(1,(-.5-i)/2.5));const r=Ac(t,e,i);(r.arm===r.min||r.leg===r.min)&&s.multiplyScalar(.82)}},dress:XS,tick:YS,fit:{size:1.05,limb:.5},face:{jaw:.55,eyes:[[on[0],on[1],on[2]+.18,.36],[-.98,on[1],on[2]+.18,.36]]},idle:{tail:.15},res:84,furShells:8},Po=new C;function oi(n,t,e,i,s,r){const a=2*Math.PI*s/4,o=Math.max(r-2*s,0),c=Math.PI/4;Po.copy(t),Po[i]=0,Po.normalize();const l=.5*a/(a+o),h=1-Po.angleTo(n)/c;return Math.sign(Po[e])===1?h*l:o/(a+o)+l+l*(1-h)}class sd extends Ce{constructor(t=1,e=1,i=1,s=2,r=.1){const a=s*2+1;if(r=Math.min(t/2,e/2,i/2,r),super(1,1,1,a,a,a),this.type="RoundedBoxGeometry",this.parameters={width:t,height:e,depth:i,segments:s,radius:r},a===1)return;const o=this.toNonIndexed();this.index=null,this.attributes.position=o.attributes.position,this.attributes.normal=o.attributes.normal,this.attributes.uv=o.attributes.uv;const c=new C,l=new C,h=new C(t,e,i).divideScalar(2).subScalar(r),u=this.attributes.position.array,f=this.attributes.normal.array,d=this.attributes.uv.array,m=u.length/6,v=new C,g=.5/a;for(let p=0,_=0;p<u.length;p+=3,_+=2)switch(c.fromArray(u,p),l.copy(c),l.x-=Math.sign(l.x)*g,l.y-=Math.sign(l.y)*g,l.z-=Math.sign(l.z)*g,l.normalize(),u[p+0]=h.x*Math.sign(c.x)+l.x*r,u[p+1]=h.y*Math.sign(c.y)+l.y*r,u[p+2]=h.z*Math.sign(c.z)+l.z*r,f[p+0]=l.x,f[p+1]=l.y,f[p+2]=l.z,Math.floor(p/m)){case 0:v.set(1,0,0),d[_+0]=oi(v,l,"z","y",r,i),d[_+1]=1-oi(v,l,"y","z",r,e);break;case 1:v.set(-1,0,0),d[_+0]=1-oi(v,l,"z","y",r,i),d[_+1]=1-oi(v,l,"y","z",r,e);break;case 2:v.set(0,1,0),d[_+0]=1-oi(v,l,"x","z",r,t),d[_+1]=oi(v,l,"z","x",r,i);break;case 3:v.set(0,-1,0),d[_+0]=1-oi(v,l,"x","z",r,t),d[_+1]=1-oi(v,l,"z","x",r,i);break;case 4:v.set(0,0,1),d[_+0]=1-oi(v,l,"x","y",r,t),d[_+1]=1-oi(v,l,"y","x",r,e);break;case 5:v.set(0,0,-1),d[_+0]=oi(v,l,"x","y",r,t),d[_+1]=1-oi(v,l,"y","x",r,e);break}}static fromJSON(t){return new sd(t.width,t.height,t.depth,t.segments,t.radius)}}const rd=[{name:"pelvis",a:[0,9.6,0],b:[0,10.8,0],parent:null},{name:"spine1",a:[0,10.8,0],b:[0,12.6,0],parent:"pelvis"},{name:"spine2",a:[0,12.6,0],b:[0,15,0],parent:"spine1"},{name:"neck",a:[0,15,0],b:[0,15.9,0],parent:"spine2"},{name:"head",a:[0,15.9,0],b:[0,18.4,0],parent:"neck"},{name:"jaw",a:[0,16.5,1],b:[0,16.5,1.3],parent:"head",reach:0},{name:"tail1",a:[0,9.4,-.8],b:[0,9.2,-1.2],parent:"pelvis",reach:0},{name:"tail2",a:[0,9.2,-1.2],b:[0,9,-1.6],parent:"tail1",reach:0},{name:"tail3",a:[0,9,-1.6],b:[0,8.8,-2],parent:"tail2",reach:0},{name:"tail4",a:[0,8.8,-2],b:[0,8.6,-2.4],parent:"tail3",reach:0},{name:"thighL",a:[.95,9.6,0],b:[.95,5.3,0],parent:"pelvis"},{name:"shinL",a:[.95,5.3,0],b:[.95,1.2,0],parent:"thighL"},{name:"footL",a:[.95,1.2,0],b:[.95,.4,1.5],parent:"shinL"},{name:"thighR",a:[-.95,9.6,0],b:[-.95,5.3,0],parent:"pelvis"},{name:"shinR",a:[-.95,5.3,0],b:[-.95,1.2,0],parent:"thighR"},{name:"footR",a:[-.95,1.2,0],b:[-.95,.4,1.5],parent:"shinR"},{name:"armL",a:[2.75,14.4,0],b:[2.75,11.9,0],parent:"spine2"},{name:"forearmL",a:[2.75,11.9,0],b:[2.75,9.5,0],parent:"armL"},{name:"armR",a:[-2.75,14.4,0],b:[-2.75,11.9,0],parent:"spine2"},{name:"forearmR",a:[-2.75,11.9,0],b:[-2.75,9.5,0],parent:"armR"}],ad={y:17.15,a:1.6,b:1.62},T0=3,ki=10,Sp=Math.PI/ki,od=.38,Fa=[{y0:.35,y1:5.2,r0:7.8,r1:5,bone:"pelvis"},{y0:3.9,y1:8.7,r0:7.1,r1:4.4,bone:"pelvis"},{y0:7.3,y1:12,r0:6.3,r1:3.8,bone:"spine1"},{y0:10.6,y1:15,r0:5.4,r1:3.2,bone:"spine2"},{y0:13.5,y1:20,r0:4.7,r1:2.4,bone:"head",flare:1.8,cols:6,rows:20,hole:ad},{y0:19.25,y1:23.7,r0:3.4,r1:.05,bone:"head",flare:1}],ZS=9425231,JS=2907158,l2=(n,t)=>n.r1+(n.r0-n.r1)*Math.pow(Math.min(1,Math.max(0,1-t)),n.flare??1.25),Ju=n=>{const t=Math.sin(n*127.1+311.7)*43758.5453;return t-Math.floor(t)};function dc(n,t){const e=Math.floor(t),i=t-e,s=Sp+e/ki*Math.PI*2,r=Sp+(e+1)/ki*Math.PI*2;return[n*(Math.sin(s)+(Math.sin(r)-Math.sin(s))*i),n*(Math.cos(s)+(Math.cos(r)-Math.cos(s))*i)]}function h2(n,t,e){const i=l2(n,(e-n.y0)/(n.y1-n.y0));for(let s=0;s<ki;s++){const[r,a]=dc(i,s),[o,c]=dc(i,s+1);if(a+c>0&&(t-r)*(t-o)<=0&&r!==o)return a+(t-r)/(o-r)*(c-a)}return Math.sqrt(Math.max(0,i*i-t*t))}const Ep=(n,t,e)=>Math.pow(Math.abs(t/n.a)**T0+Math.abs((e-n.y)/n.b)**T0,1/T0),KS=Fa.find(n=>n.hole),Wn=h2(KS,0,ad.y)-.3,Tr=.56,Ar=17.4,Ku=.16,Qu=1.45,u2=.62,f2=17.92,cd=.37,d2=.38,Tp=cd*Math.sin(d2),tf=.08,ef=16.5,p2=.72,QS=.12,Ap=.03,tE=0,Rp=.05,eE=.056,m2=.06,g2=.25,v2=.4,xa=rd.find(n=>n.name==="head").a[1],x2=ad.y-.05,ka=.8,nE=x2+1.5-ka,Dr=21,Kl={cl:-.035,cr:-.035,mid:0,slant:.043,w:1,wl:1,wr:1,t:QS,o:0,round:0,lift:0},_2=[{cl:.21,wl:1.12,t:.13},{cr:.21,wr:1.12,t:.13},{cl:-.2,cr:-.2,mid:.025,w:.92},{o:.46,w:.96},{o:.22,w:.5,round:1,slant:0,cl:0,cr:0},{o:.03,w:.46,round:.65,t:.2,slant:.01,cl:0,cr:0},{lift:.13,t:.14}];function Ql(n){const t=new Float32Array(Dr*6);for(let e=0;e<Dr;e++){const i=-1+2*e/(Dr-1),s=Math.max(0,1-i*i),r=i*(p2/2)*n.w*(i>0?n.wl:n.wr),a=(i>0?n.cl:n.cr)*i*i+n.mid*s+n.slant*i,o=n.t/2*((1-.55*i**4)*(1-n.round)+Math.sqrt(s)*n.round),c=Math.sqrt(s)*n.o,l=n.lift*Math.exp(-(((Math.abs(i)-.42)/.3)**2));t.set([r,a+o+.15*c+l,0,r,a-o-c,0],e*6)}return t}const Pl=(Dr-1)/2*2,A0=Pl+1;function iE(){const n=Ql(Kl),t=new xe;t.setAttribute("position",new $t(n,3));const e=new Float32Array(Dr*6);for(let s=0;s<Dr*2;s++)e[s*3+2]=1;t.setAttribute("normal",new $t(e,3));const i=[];for(let s=0;s<Dr-1;s++){const r=s*2;i.push(r,r+1,r+2,r+1,r+3,r+2)}return t.setIndex(i),t.morphAttributes.position=_2.map(s=>{const r=Ql({...Kl,...s});for(let a=0;a<r.length;a++)r[a]-=n[a];return new $t(r,3)}),t.morphTargetsRelative=!0,t.boundingSphere=new rr(new C(0,-.2,0),.75),t}const ml=(()=>{const n=Ql(Kl),t=(i,s)=>i[s*3+1],e=_2.map(i=>Ql({...Kl,...i}));return{up:t(n,Pl),lo:t(n,A0),dUp:e.map(i=>t(i,Pl)-t(n,Pl)),dLo:e.map(i=>t(i,A0)-t(n,A0))}})(),sE=.98,rE=16.55,M2=-.75;function aE(n){const t=n.cols??2,e=n.rows??2,i=ki*t,s=n.y1-n.y0,r=[],a=[],o=new gt(ZS),c=new gt(JS),l=new gt;for(let f=0;f<=e;f++){const d=1-f/e,m=l2(n,d);for(let v=0;v<=i;v++){let[g,p]=dc(m,v/t),_=n.y0+d*s;if(f===e&&v%2===0){const M=v%i,w=.6+.8*Ju(M+n.y0*7);_-=od*w,g*=1.04,p*=1.04}r.push(g,_,p);const x=Math.min(1,Math.max(0,(d-.25)/.4));l.copy(o).lerp(c,x*x*(3-2*x)),a.push(l.r,l.g,l.b)}}const h=[];for(let f=0;f<e;f++)for(let d=0;d<i;d++){const m=f*(i+1)+d,v=m+i+1,g=v+1,p=m+1;h.push(m,v,p,v,g,p)}if(n.hole){const f=n.hole,d=[],m=new Set,v=new Set;for(let g=0;g<h.length;g+=3){const p=[h[g],h[g+1],h[g+2]],_=(r[p[0]*3]+r[p[1]*3]+r[p[2]*3])/3,x=(r[p[0]*3+1]+r[p[1]*3+1]+r[p[2]*3+1])/3;if((r[p[0]*3+2]+r[p[1]*3+2]+r[p[2]*3+2])/3>0&&Ep(f,_,x)<1)for(const w of p)m.add(w);else{d.push(...p);for(const w of p)v.add(w)}}for(const g of m){if(!v.has(g))continue;const p=r[g*3],_=r[g*3+1],x=Ep(f,p,_);if(x<.3)continue;const M=p/x,w=f.y+(_-f.y)/x;r[g*3]=M,r[g*3+1]=w,r[g*3+2]=h2(n,M,w)}h.length=0,h.push(...d)}const u=new xe;return u.setAttribute("position",new ie(r,3)),u.setAttribute("color",new ie(a,3)),u.setIndex(h),u.computeVertexNormals(),u}const b2=[[0,-3,.6,2],[0,0,.7,4],[0,2,.55,0],[1,-1,.9,0],[1,1,.6,3],[1,-4,.6,1],[2,-2,.6,1],[2,2,.7,2],[3,-1,.6,4],[3,1,.55,1],[4,-2,.45,1],[4,1,.45,2],[5,-2,.35,0],[5,1,.35,2]],Ws=[14165550,2838486,9060304,14699176,15759898],pc=b2.map(([n,t,e,i])=>{const s=Fa[n],[r,a]=dc(s.r0*.99,(t%ki+ki)%ki),o=s.y0-od*.55;return{bone:s.bone,p:[r,o-e*1.2-.3,a],ci:i}}),R0=pc.length,Cp=new WeakMap,w2=n=>{let t=Cp.get(n);return t||(t={uOrnPos:{value:pc.map(()=>new C(0,-1e4,0))},uOrnCol:{value:pc.map(()=>new gt(0,0,0))},uOrnR:{value:.2}},Cp.set(n,t)),t};function oE(n){n.name="lime",n.onBeforeCompile=function(t){Object.assign(t.uniforms,w2(this)),t.vertexShader=t.vertexShader.replace("#include <common>",`#include <common>
 varying vec3 vOrnW;`).replace("#include <project_vertex>",`#include <project_vertex>
 vOrnW = (modelMatrix * vec4(transformed, 1.0)).xyz;`),t.fragmentShader=t.fragmentShader.replace("#include <common>",`#include <common>
        varying vec3 vOrnW; uniform vec3 uOrnPos[${R0}]; uniform vec3 uOrnCol[${R0}]; uniform float uOrnR;`).replace("#include <emissivemap_fragment>",`#include <emissivemap_fragment>
        for (int i = 0; i < ${R0}; i++) {
          vec3 dv = vOrnW - uOrnPos[i];
          float q = dot(dv, dv) / (uOrnR * uOrnR);
          totalEmissiveRadiance += uOrnCol[i] * diffuseColor.rgb * (1.0 / (1.0 + q * 2.5)) * smoothstep(9.0, 2.0, q);
        }`)},n.customProgramCacheKey=()=>"builder-lime-ornaments-v1"}let Io=null;function cE(){if(Io)return Io;const n=document.createElement("canvas");n.width=n.height=64;const t=n.getContext("2d"),e=t.createRadialGradient(32,32,0,32,32,32);return e.addColorStop(0,"rgba(255,255,255,1)"),e.addColorStop(.18,"rgba(255,255,255,0.75)"),e.addColorStop(.45,"rgba(255,255,255,0.22)"),e.addColorStop(1,"rgba(255,255,255,0)"),t.fillStyle=e,t.fillRect(0,0,64,64),Io=new Yl(n),Io.colorSpace=gn,Io}function lE(n){const t=new Map,e=new Set,i=(B,Y,it=0,mt=0,vt=0)=>{B.position.set(it,mt,vt),B.updateMatrixWorld(!0),B.traverse(St=>{const Ct=St;if(!Ct.isMesh)return;const Ut=Ct.material,V=`${Y}|${Ut.uuid}|${Ct.name}`,X=Ct.geometry.index?Ct.geometry.toNonIndexed():Ct.geometry.clone();for(const W of Object.keys(X.attributes))W!=="position"&&W!=="normal"&&W!=="color"&&X.deleteAttribute(W);X.applyMatrix4(Ct.matrixWorld);let z=t.get(V);z||(z={bone:Y,mat:Ut,name:Ct.name,geos:[]},t.set(V,z)),z.geos.push(X)})},s=(B,Y,it="")=>{e.add(B);const mt=new nt(B,Y);return mt.name=it,mt},r=n.std({color:16777215,vertexColors:!0,roughness:.95,metalness:0,flatShading:!0,side:Se,emissive:2771474,emissiveIntensity:1}),a=n.std({color:12894672,emissive:12894672,emissiveIntensity:.05,roughness:.75}),o=n.std({color:1315350,roughness:.5}),c=n.std({color:2236962,roughness:.8}),l=Ws.map((B,Y)=>{const it=new $e({color:B,emissive:B,emissiveIntensity:1.2,roughness:.3,metalness:.1});return it.name=`orn-${Y}`,it});oE(r);const h=n.std({color:1973794,roughness:.45,metalness:.1}),u=n.std({color:15762972,roughness:.45,metalness:.05}),f=n.std({color:15251514,emissive:16758810,emissiveIntensity:.25,roughness:.25,metalness:.85});for(const B of Fa)i(s(aE(B),r),B.bone);const d=new Wt(.34,12,8),m=new vn(.035,.035,1,4);for(const[B,Y,it,mt]of b2){const vt=Fa[B],[St,Ct]=dc(vt.r0*.99,(Y%ki+ki)%ki),Ut=vt.y0-od*.55,V=it*1.2,X=s(m,c);X.scale.y=V,i(X,vt.bone,St,Ut-V/2,Ct),i(s(d,l[mt],`orn-${mt}`),vt.bone,St,Ut-V-.3,Ct)}const v=Ws.map((B,Y)=>{const it=new Hf({map:cE(),color:B,blending:Or,depthWrite:!1,transparent:!0,opacity:.85,toneMapped:!1});return it.name=`halo-${Y}`,it.userData.keepBlend=!0,it});for(const B of pc){const Y=new Mg(v[B.ci]);Y.name=`halo-${B.ci}`,Y.scale.setScalar(3.2),Y.renderOrder=5,n.at(Y,B.bone,...B.p)}i(s(new sd(3,3,2.3,3,ka),a),"head",0,x2,Wn-1.15);const g=(B,Y,it,mt,vt=!0)=>{n.at(B,"head",Y,it,mt).traverse(St=>{St.receiveShadow=!1,vt||(St.castShadow=!1)})},p=new xi(.62,1).translate(0,-.5,0),_=new xi(.62,1).translate(0,.5,0),x=new xi(v2,1);for(const B of[1,-1]){const Y=B>0?"L":"R",it=new nt(new Wt(Ku,12,10),o);it.scale.set(1,Qu,g2),it.name="eye"+Y,g(it,B*Tr,Ar,Wn+tE);const mt=new nt(p,a);mt.name="lidUp"+Y,g(mt,B*Tr,Ar,Wn+Rp,!1);const vt=new nt(_,a);vt.name="lidLo"+Y,g(vt,B*Tr,Ar,Wn+Rp,!1);const St=new nt(x,o);St.name="lash"+Y,g(St,B*Tr,Ar,Wn+eE,!1);const Ct=new nt(new Ce(cd*2,.16,.1),o);Ct.rotation.z=B*d2,Ct.name="brow"+Y,g(Ct,B*u2,f2,Wn+m2);const Ut=new nt(new Wt(.42,16,12),a);Ut.name="cheek"+Y,Ut.visible=!1,g(Ut,B*sE,rE,Wn+M2,!1)}const M=new nt(iE(),o);M.name="mouth",g(M,tf,ef,Wn+Ap,!1);const w=new nt(new zr(1,20),n.std({color:11027023,roughness:.6}));w.name="tongue",w.visible=!1,g(w,tf,ef,Wn+Ap+.008,!1);const S=new ue,T=[2.4,2.25,2.45],A=s(new Wt(1,24,10,0,Math.PI*2,0,Math.PI/2),h);A.scale.set(...T),S.add(A);const b=.95;for(let B=0;B<4;B++){const Y=s(new Wt(1,8,6,B*(Math.PI/2)+b/2,Math.PI/2-b,.1*Math.PI,.27*Math.PI),u);Y.scale.set(T[0]*1.012,T[1]*1.012,T[2]*1.012),S.add(Y)}const y=new Bi([new ft(.96,0),new ft(1.08,0),new ft(1.08,.12),new ft(.96,.12),new ft(.96,0)],24),E=s(y,h);E.scale.set(T[0],1,T[2]*1.06),E.position.set(0,-.02,.1),S.add(E);const R=s(new zr(1,20),n.std({color:2762272,roughness:.9}));R.rotation.x=Math.PI/2,R.scale.set(T[0]*.99,T[2]*.99,1),R.position.y=.01,S.add(R);const P=new Xf;for(let B=0;B<8;B++){const Y=Math.PI/2+B*Math.PI/4,it=B%2?.24:.85;B?P.lineTo(Math.cos(Y)*it,Math.sin(Y)*it):P.moveTo(Math.cos(Y)*it,Math.sin(Y)*it)}const I=new _h(P,{depth:.12,bevelEnabled:!0,bevelThickness:.06,bevelSize:.05,bevelSegments:1}),F=.95,H=s(I,f);H.scale.setScalar(1.5),H.position.set(0,F,T[2]*Math.sqrt(1-(F/T[1])**2)+.02),H.rotation.x=-.45,S.add(H),S.position.y=-.8;const $=new ue;$.add(S),$.rotation.set(.12,0,.36,"ZXY"),i($,"head",0,Fa[Fa.length-1].y1,0);for(const B of t.values()){const Y=n.segs.find(vt=>vt.name===B.bone).a,it=On(B.geos);for(const vt of B.geos)vt.dispose();if(!it)throw new Error(`builder: parts on ${B.bone} would not merge`);it.translate(-Y[0],-Y[1],-Y[2]);const mt=new nt(it,B.mat);mt.name=B.name,n.at(mt,B.bone,Y[0],Y[1],Y[2]),B.mat===a&&(mt.receiveShadow=!1)}for(const B of e)B.dispose()}const Lp=new WeakMap,hE=new C,Ya=n=>Math.max(0,Math.min(1,n)),nf=(n,t,e)=>{const i=Ya((e-n)/(t-n));return i*i*(3-2*i)},Qe=(n,t,e)=>Ya((n-t)/(e-t)),uE=.2,fE=.22,Pt={blink:[0,0],squint:[0,0],wide:[0,0],down:[0,0],outer:[0,0],smile:[0,0],up:0,frown:0,jaw:0,funnel:0,pucker:0,sneer:0,puff:0,lookX:0,lookY:0,side:0};function dE(n,t){if(n){const l=Math.max(0,n.smile-(n.smileL+n.smileR)/2);Pt.blink[0]=Qe(n.blinkL,.15,.65),Pt.blink[1]=Qe(n.blinkR,.15,.65),Pt.squint[0]=Qe(n.squintL,.2,.7),Pt.squint[1]=Qe(n.squintR,.2,.7),Pt.wide[0]=Qe(n.wideL,.08,.5),Pt.wide[1]=Qe(n.wideR,.08,.5),Pt.down[0]=Qe(n.browDownL,.08,.55),Pt.down[1]=Qe(n.browDownR,.08,.55),Pt.outer[0]=Qe(n.browOuterL,.08,.6),Pt.outer[1]=Qe(n.browOuterR,.08,.6),Pt.smile[0]=Qe(n.smileL+l,.06,.7),Pt.smile[1]=Qe(n.smileR+l,.06,.7),Pt.up=Qe(n.browUp,.1,.65),Pt.frown=Qe(n.frown,.03,.35),Pt.jaw=Ya(n.jaw),Pt.funnel=Qe(n.funnel,.06,.5),Pt.pucker=Qe(n.pucker,.2,.85),Pt.sneer=Qe(n.sneer,.06,.5),Pt.puff=Qe(n.puff,.04,.4),Pt.lookX=n.lookX,Pt.lookY=n.lookY,Pt.side=n.jawSide;return}const e=t%13.2,i=e%4.4,s=i<.16?Math.sin(i/.16*Math.PI):e>8.8&&i>.24&&i<.4?Math.sin((i-.24)/.16*Math.PI):0;Pt.blink[0]=Pt.blink[1]=s;const r=Math.floor(t/2.9),a=nf(0,.22,t-r*2.9),o=l=>l%3===0?0:(Ju(l*7.3)*2-1)*.75,c=l=>l%3===0?0:(Ju(l*3.1+5)-.6)*.6;Pt.lookX=o(r-1)+(o(r)-o(r-1))*a,Pt.lookY=c(r-1)+(c(r)-c(r-1))*a,Pt.squint[0]=Pt.squint[1]=Pt.wide[0]=Pt.wide[1]=Pt.down[0]=Pt.down[1]=Pt.outer[0]=Pt.outer[1]=Pt.smile[0]=Pt.smile[1]=0,Pt.up=Pt.frown=Pt.jaw=Pt.funnel=Pt.pucker=Pt.sneer=Pt.puff=Pt.side=0}function pE(n){for(let a=0;a<2;a++){const o=n.side[a],c=a===0?1:-1,l=Pt.blink[a],h=Pt.squint[a],u=Pt.wide[a],f=Pt.down[a],d=Pt.outer[a],m=Pt.smile[a],v=1+.14*u-.06*h,g=c*Tr+.14*Pt.lookX,p=Ar+.09*Pt.lookY,_=Ku*Qu*v;o.eye&&(o.eye.position.x=g,o.eye.position.y=p-xa,o.eye.scale.set(v,Qu*v,g2));const x=Math.max(l,Ya(uE+.5*f+.3*h+.2*Pt.sneer-.6*u-.3*Pt.up-.3*d-.2*Pt.lookY)),M=Math.max(l,Ya(.5*h+.35*m+.15*Pt.sneer)),w=p+_+.025,S=p-.03,T=p-_-.025;let A=w+(S-w)*x,b=T+(S-T)*M;b>A&&(A=b=(A+b)/2);const y=c*(fE+.3*f-.45*Pt.up),E=y*(.35+.65*l);if(o.up){const R=(w+.01-A)/Math.cos(y);o.up.visible=R>.004,o.up.position.x=g-R*Math.sin(y),o.up.position.y=w+.01-xa,o.up.rotation.z=y,o.up.scale.y=Math.max(.001,R)}if(o.lo){const R=(b-(T-.01))/Math.cos(E);o.lo.visible=R>.004,o.lo.position.x=g+R*Math.sin(E),o.lo.position.y=T-.01-xa,o.lo.rotation.z=E,o.lo.scale.y=Math.max(.001,R)}if(o.lash){const R=.075*nf(.6,.95,x),P=(A-p)/_,I=Ku*v*Math.sqrt(Math.max(0,1-P*P));o.lash.visible=R>.003&&I>.02,o.lash.position.x=g,o.lash.position.y=A-xa,o.lash.rotation.z=y,o.lash.scale.set((2*I+.05)/v2,Math.max(.001,R),1)}if(o.brow){const R=-Tp+.4*Pt.up-.22*f+.18*d-.08*Pt.sneer,P=Tp+.06*Pt.up-.08*f+.26*d-.03*Pt.sneer,I=f2+(R+P)/2,F=Math.min(ka*.8,Math.max(0,I+.06-nE));o.brow.position.x=c*(u2-.05*f),o.brow.position.y=I-xa,o.brow.position.z=Wn+m2-(ka-Math.sqrt(ka*ka-F*F)),o.brow.rotation.z=c*Math.asin(Math.max(-.95,Math.min(.95,(P-R)/(2*cd))))}if(o.cheek){const R=Pt.puff;o.cheek.visible=R>.01,o.cheek.position.z=Wn+M2+.4*R,o.cheek.scale.setScalar(1+.08*R)}}const t=n.mouth,e=t?.morphTargetInfluences;if(!t||!e)return;const i=Pt.funnel,s=Ya(Pt.pucker+.6*Pt.puff),r=Math.max(1,i+s);if(e[0]=Pt.smile[0],e[1]=Pt.smile[1],e[2]=Pt.frown*(1-.6*Math.max(Pt.smile[0],Pt.smile[1])),e[3]=Pt.jaw,e[4]=i/r,e[5]=s/r,e[6]=Pt.sneer,t.position.x=tf+.12*Pt.side,n.tongue){let a=ml.up,o=ml.lo;for(let u=0;u<e.length;u++)a+=e[u]*ml.dUp[u],o+=e[u]*ml.dLo[u];const c=nf(.12,.45,Pt.jaw),l=1-.04*e[3]-.5*e[4]-.54*e[5]-.08*e[2],h=.24*(a-o)*c;n.tongue.visible=h>.01,n.tongue.position.x=t.position.x,n.tongue.position.y=ef+o+h*1.25-xa,n.tongue.scale.set(Math.max(.001,p2/2*l*.46*c),Math.max(.001,h),1)}}const Pp=Ws.map((n,t)=>({rate:1.3+.37*t,ph:t*1.9}));function mE(n,t,e){let i=Lp.get(n);if(!i){const r=()=>({eye:null,up:null,lo:null,lash:null,brow:null,cheek:null}),a={side:[r(),r()],mouth:null,tongue:null,balls:[],halos:[],lime:null,orn:[],k:Ws.map(()=>0)},o=new Map,c=new Map,l=/^(eye|lidUp|lidLo|lash|brow|cheek)([LR])$/,h={eye:"eye",lidUp:"up",lidLo:"lo",lash:"lash",brow:"brow",cheek:"cheek"};n.traverse(f=>{const d=l.exec(f.name);d?a.side[d[2]==="L"?0:1][h[d[1]]]=f:f.name==="mouth"?a.mouth=f:f.name==="tongue"&&(a.tongue=f);const m=f.material;if(m&&!Array.isArray(m)){const v=/^orn-(\d)$/.exec(m.name),g=/^halo-(\d)$/.exec(m.name);v&&o.set(Number(v[1]),m),g&&c.set(Number(g[1]),m),m.name==="lime"&&(a.lime=m)}}),a.balls=Ws.map((f,d)=>o.get(d)).filter(Boolean),a.halos=Ws.map((f,d)=>c.get(d)).filter(Boolean);const u=new Map;n.traverse(f=>{f.isBone&&u.set(f.name,f)});for(const f of pc){const d=u.get(f.bone),m=rd.find(v=>v.name===f.bone).a;d&&a.orn.push({bone:d,local:new C(f.p[0]-m[0],f.p[1]-m[1],f.p[2]-m[2]),ci:f.ci})}Lp.set(n,i=a)}const s=i.k;for(let r=0;r<Pp.length;r++){const a=Pp[r];s[r]=.55+.45*Math.sin(t*a.rate+a.ph)+.6*Math.max(0,Math.sin(t*a.rate*3.1+a.ph*2)-.85)*6}for(let r=0;r<i.balls.length;r++)i.balls[r].emissiveIntensity=.6+1.6*s[r];for(let r=0;r<i.halos.length;r++)i.halos[r].color.setHex(Ws[r]).multiplyScalar(.35+.9*s[r]);if(i.lime&&i.orn.length){const r=w2(i.lime);n.updateMatrixWorld(!0),r.uOrnR.value=2.4*Math.abs(hE.setFromMatrixScale(n.matrixWorld).y);for(let a=0;a<i.orn.length;a++){const o=i.orn[a];r.uOrnPos.value[a].copy(o.local).applyMatrix4(o.bone.matrixWorld),r.uOrnCol.value[a].setHex(Ws[o.ci]).multiplyScalar(1.3*s[o.ci])}}dE(e,t),pE(i)}const gE={id:"builder",name:"Builder",blurb:"A builder in a Christmas tree costume, tipping his hat",segs:rd,dress:lE,tick:mE,fit:{size:1,limb:.2},face:{eyes:[[Tr,Ar,Wn+.1,.26],[-Tr,Ar,Wn+.1,.26]]}},y2=[{name:"pelvis",a:[0,9.6,0],b:[0,10.6,0],parent:null},{name:"spine1",a:[0,10.6,0],b:[0,12.4,.1],parent:"pelvis"},{name:"spine2",a:[0,12.4,.1],b:[0,15,.1],parent:"spine1"},{name:"neck",a:[0,15,.1],b:[0,15.9,.15],parent:"spine2",reach:.8},{name:"head",a:[0,15.9,.15],b:[0,18.4,.3],parent:"neck"},{name:"jaw",a:[0,16.4,.9],b:[0,16.4,1.2],parent:"head",reach:0},{name:"tail1",a:[0,14.8,-1.2],b:[0,12.6,-1.4],parent:"spine2",reach:0},{name:"tail2",a:[0,12.6,-1.4],b:[0,10.4,-1.6],parent:"tail1",reach:0},{name:"tail3",a:[0,10.4,-1.6],b:[0,8.2,-1.8],parent:"tail2",reach:0},{name:"tail4",a:[0,8.2,-1.8],b:[0,6.2,-2],parent:"tail3",reach:0},{name:"thighL",a:[1.1,9.6,0],b:[1.2,5.3,.2],parent:"pelvis"},{name:"shinL",a:[1.2,5.3,.2],b:[1.2,1.1,-.1],parent:"thighL"},{name:"footL",a:[1.2,1.1,-.1],b:[1.2,.35,1.4],parent:"shinL"},{name:"thighR",a:[-1.1,9.6,0],b:[-1.2,5.3,.2],parent:"pelvis"},{name:"shinR",a:[-1.2,5.3,.2],b:[-1.2,1.1,-.1],parent:"thighR"},{name:"footR",a:[-1.2,1.1,-.1],b:[-1.2,.35,1.4],parent:"shinR"},{name:"armL",a:[2.5,14.55,0],b:[2.95,11.95,-.05],parent:"spine2"},{name:"forearmL",a:[2.95,11.95,-.05],b:[3.12,9.6,.35],parent:"armL"},{name:"armR",a:[-2.5,14.55,0],b:[-2.95,11.95,-.05],parent:"spine2"},{name:"forearmR",a:[-2.95,11.95,-.05],b:[-3.12,9.6,.35],parent:"armR"}],vE={min:[-4.2,-.5,-1.9],max:[4.2,17.1,2.3]},xE=[3.12,9.6,.35],S2=(n,t,e)=>K(n,t,e,3.05,10.55,.2,3.16,9,.45,.3,.3);function ld(n,t,e){const i=Math.abs(n);let s=4;if(t>8.4&&(s=ct(n,t,e,0,13,.05,1.74,2.15,1.2),s=O(s,ct(n,t,e,0,11.35,.15,1.62,1.1,1.12),.5),t>13.2&&(s=O(s,K(i,t,e,0,15,-.05,2.15,14.62,0,.5,.56),.5),s=O(s,Math.hypot(Math.hypot(n,(e+.02)*1.15)-.78,t-15.18)-.2,.12),s=O(s,K(n,t,e,0,14.9,.05,0,15.6,.12,.62,.55),.2)),t<11.6&&(s=O(s,ct(n,t,e,0,10.05,0,1.78,1.05,1.15),.4))),t<10.9&&(s=O(s,K(i,t,e,1.08,9.6,0,1.2,5.3,.15,.88,.74),.35),t<6.4&&(s=O(s,K(i,t,e,1.2,5.3,.15,1.22,2.1,-.05,.74,.7),.25))),i>1.5&&t>8.8){const r=K(i,t,e,2.5,14.55,0,2.95,11.95,-.05,.6,.55);s=t>14?O(s,r,.3):Math.min(s,r),t<12.9&&(s=O(s,K(i,t,e,2.95,11.95,-.05,3.08,10,.28,.55,.52),.25),s=Math.max(s,-S2(i,t,e)))}if(t<3.4){const r=O(K(i,t,e,1.22,2.3,-.05,1.22,.6,-.05,.5,.52),Math.max(ct(i,t,e,1.22,.5,.55,.58,.5,1.3),-t),.3);s=Math.min(s,r)}return s}const sf=0,E2=1,_E=2,T2=3,ME=4;function A2(n,t,e){const i=Math.abs(n);return S2(i,t,e)<.06?ME:t<2.25&&i>.4?_E:t>15.38&&i<.8?T2:i>2.1&&t>9.2||t>10.72?sf:E2}const bE=`
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
  }`;function wE(){const n=new $e({vertexColors:!0,roughness:.88,metalness:0});return n.onBeforeCompile=t=>{t.vertexShader=t.vertexShader.replace("#include <common>",`#include <common>
 attribute vec3 aCloth; varying vec3 vCloth; varying vec3 vBind; varying vec3 vBindN;`).replace("#include <begin_vertex>",`#include <begin_vertex>
 vBind = position; vBindN = normal; vCloth = aCloth;`),t.fragmentShader=t.fragmentShader.replace("#include <common>",`#include <common>
`+bE).replace("#include <color_fragment>",`#include <color_fragment>
 diffuseColor.rgb = cloth(diffuseColor.rgb, vBind, normalize(vBindN), vCloth);`)},n.customProgramCacheKey=()=>"jack-cloth-v2",n}const Ge=[0,17.15,.22],R2=1.82,mi=1.38,C2=.24;function hd(n,t,e){const i=n-Ge[0],s=t-Ge[1],r=e-Ge[2],a=Math.hypot(i,r),o=Math.atan2(r,i),c=1-Math.sqrt(Math.abs(Math.cos(5*(o-Math.PI/2)))),l=1-.06*c;let h=(Math.hypot(a/l/R2,s/mi)-1)*mi;return h+=.32*Math.exp(-((a/.6)**2))*Math.min(1,Math.abs(s)/mi),{d:h,groove:c}}function Ip(n,t,e,i,s,r,a=0){const o=(i+s)/2,c=Math.cos(a),l=Math.sin(a),h=(n-e)*c-(t-o)*l,u=(n-e)*l+(t-o)*c+o,f=i-s,d=Math.hypot(f,r);return Math.max((Math.abs(h)*f+(u-i)*r)/d,s-u)}const Dp=(n,t,e,i,s,r)=>(Math.hypot((n-e)/s,(t-i)/r)-1)*Math.min(s,r),Up=(n,t,e,i,s,r)=>{const a=Math.abs(n-e)-s,o=Math.abs(t-i)-r;return Math.hypot(Math.max(a,0),Math.max(o,0))+Math.min(Math.max(a,o),0)},tn={cx:.66,top:.74,bot:.14,w:.36,tilt:-.12},ui={lo:{cy:-.36,rx:1.2,ry:.64},up:{cy:-.08,rx:1.34,ry:.56}},C0={u:1.2,v:-.36};function yE(n,t){const e=Math.abs(n);let i=Ip(e,t,tn.cx,tn.top,tn.bot,tn.w,tn.tilt);i=Math.min(i,Ip(n,t,0,.1,-.2,.17));let s=Math.max(Dp(n,t,0,ui.lo.cy,ui.lo.rx,ui.lo.ry),-Dp(n,t,0,ui.up.cy,ui.up.rx,ui.up.ry));return s=Math.max(s,-Up(e,t,.32,-.7,.11,.12)),s=Math.max(s,-Up(n,t,0,-.93,.12,.13)),Math.min(i,s)}function SE(n,t,e){const i=hd(n,t,e).d;let s=Math.max(i,-(i+C2));const r=Math.max(yE(n-Ge[0],t-Ge[1]),Ge[2]+.4-e);return s=Math.max(s,-r),s}const EE=new gt(15233038),TE=new gt(10108936),AE=new gt(16757820),RE=new gt(16737290);function CE(n,t,e,i){const{d:s,groove:r}=hd(n,t,e);if(s<-.05){i.copy(AE).lerp(RE,Math.max(0,Math.min(1,(t-Ge[1]-mi*.2)/(mi*.8))));return}i.copy(EE).lerp(TE,Math.min(1,r*1.3)),i.multiplyScalar(.85+.15*(1-Math.abs(t-Ge[1])/mi))}const LE=`
  uniform vec4 uEyeL; uniform vec4 uEyeR; uniform vec4 uMouth; uniform vec4 uMouth2;
  const vec3 PC = vec3(${Ge.map(n=>n.toFixed(3)).join(", ")});
  const float PR = ${R2.toFixed(3)}, PH = ${mi.toFixed(3)};
  // the left eye (q mirrored for the right): its displacement in the face plane
  vec2 eyeWarp(vec2 q, vec4 e) {
    const float CS = ${Math.cos(tn.tilt).toFixed(5)}, SN = ${Math.sin(tn.tilt).toFixed(5)};
    const float YB = ${((tn.bot-tn.top)/2).toFixed(3)}, YT = ${((tn.top-tn.bot)/2).toFixed(3)}, W = ${tn.w.toFixed(3)}, M = 0.26;
    vec2 d = q - vec2(${tn.cx.toFixed(3)}, ${((tn.top+tn.bot)/2).toFixed(3)});
    vec2 r = vec2(d.x * CS - d.y * SN, d.x * SN + d.y * CS); // the eye's own frame (tri2's)
    float inner = clamp(-r.x / W, -1.0, 1.0) * 0.5 + 0.5;
    float c = min(1.0, e.x + max(e.z, 0.0) * inner + max(-e.z, 0.0) * (1.0 - inner));
    float ys = mix(YB, YT, e.y), a = 1.0 - c, y = r.y, y2 = y;
    // squashed (or stretched) toward ys inside the carving, the rind a margin round it taking up the difference
    if (y >= YB && y <= YT) y2 = ys + (y - ys) * a;
    else if (y > YT && y < YT + M) y2 = mix(ys + (YT - ys) * a, YT + M, (y - YT) / M);
    else if (y < YB && y > YB - M) y2 = mix(YB - M, ys + (YB - ys) * a, (y - YB + M) / M);
    float lift = e.w * (1.0 - smoothstep(YT, YT + M, y)) * smoothstep(YB - M, YB, y);
    float dy = (y2 - y + lift) * (1.0 - smoothstep(W + 0.04, W + 0.24, abs(r.x)));
    return vec2(dy * SN, dy * CS);
  }
  float lipLo(float u) { float k = u / ${ui.lo.rx.toFixed(3)}; return ${ui.lo.cy.toFixed(3)} - ${ui.lo.ry.toFixed(3)} * sqrt(max(0.0, 1.0 - k * k)); }
  float lipUp(float u) { float k = u / ${ui.up.rx.toFixed(3)}; return ${ui.up.cy.toFixed(3)} - ${ui.up.ry.toFixed(3)} * sqrt(max(0.0, 1.0 - k * k)); }
  // where the mouth parts: inside the grin, above the bottom tooth and below the top two
  float parting(float au) {
    float c = min(au, ${C0.u.toFixed(3)});
    float teeth = mix(-0.72, -0.885, smoothstep(0.155, 0.185, c));
    return mix(teeth, 0.5 * (lipLo(c) + lipUp(c)), smoothstep(0.45, 0.62, c));
  }
  vec3 faceWarp(vec3 pos) {
    vec3 p = pos - PC;
    vec2 q = p.xy;
    float au = abs(q.x);
    vec2 wl = eyeWarp(q, uEyeL), wr = eyeWarp(vec2(-q.x, q.y), uEyeR);
    vec2 s = wl + vec2(-wr.x, wr.y);
    vec2 cd = vec2((au - ${C0.u.toFixed(3)}) / 0.42, (q.y - ${C0.v.toFixed(3)}) / 0.36);
    s.y += 0.16 * (q.x > 0.0 ? uMouth.y : uMouth.z) * exp(-dot(cd, cd));
    s.x -= uMouth.w * 0.26 * q.x * (1.0 - smoothstep(1.0, 1.75, au)) * (1.0 - smoothstep(0.45, 0.8, abs(q.y + 0.66)));
    // the face is on the front: the back of the shell, at the same u and v, stays put
    float front = smoothstep(0.3, 0.9, p.z);
    s *= front;
    if (front > 0.0) {
      // slid in the plane, kept on its own shell (the ellipsoid through it, scaled): no dents
      float k2 = (p.x * p.x + p.z * p.z) / (PR * PR) + p.y * p.y / (PH * PH);
      vec2 q2 = q + s;
      p.z = sqrt(max((k2 - q2.y * q2.y / (PH * PH)) * PR * PR - q2.x * q2.x, 0.0));
    }
    float w = mix(0.08, 0.4, smoothstep(1.05, 1.4, au)), cut = parting(au);
    float jaw = (1.0 - smoothstep(cut - 0.5 * w, cut + 0.5 * w, q.y)) * (1.0 - smoothstep(0.85, 1.75, au)) * smoothstep(-0.2, 0.9, p.z);
    return PC + vec3(q + s + vec2(0.14 * uMouth2.x, -0.3 * uMouth.x) * jaw, p.z);
  }`,Np=new WeakMap;function L2(n){let t=Np.get(n);return t||(t={uEyeL:{value:new de},uEyeR:{value:new de},uMouth:{value:new de},uMouth2:{value:new de}},Np.set(n,t)),t}function PE(n){const t=n.std({color:16777215,vertexColors:!0,roughness:.5,metalness:0,emissive:16777215,emissiveIntensity:1});return t.onBeforeCompile=function(e){Object.assign(e.uniforms,L2(this)),e.vertexShader=e.vertexShader.replace("#include <common>",`#include <common>
 attribute float aGlow; varying float vGlow;
`+LE).replace("#include <begin_vertex>",`#include <begin_vertex>
 vGlow = aGlow; transformed = faceWarp(transformed);`),e.fragmentShader=e.fragmentShader.replace("#include <common>",`#include <common>
 varying float vGlow;`).replace("#include <color_fragment>",`#include <color_fragment>
 vec3 glowHue = diffuseColor.rgb; diffuseColor.rgb *= 1.0 - 0.92 * vGlow;`).replace("#include <emissivemap_fragment>",`#include <emissivemap_fragment>
 totalEmissiveRadiance *= vGlow * glowHue;`)},t.customProgramCacheKey=()=>"jack-shell-v3",t}let Il=1;const Cn=()=>(Il=Il*1664525+1013904223>>>0,Il/4294967296),IE=new C(0,1,0),Fp=[15255146,13937738,15916172,12884540].map(n=>new gt(n));function Do(n,t,e,i){const s=new ii(i,e,4,1).translate(0,e/2,0);s.applyQuaternion(new le().setFromUnitVectors(IE,t.clone().normalize())).translate(n.x,n.y,n.z);const r=Fp[Math.floor(Cn()*Fp.length)],a=s.attributes.position.count,o=new Float32Array(a*3);for(let c=0;c<a;c++)o[c*3]=r.r,o[c*3+1]=r.g,o[c*3+2]=r.b;return s.setAttribute("color",new $t(o,3)),s}function Uo(n,t){const e=n.clone().normalize(),i=Math.abs(e.y)<.9?new C(0,1,0):new C(1,0,0),s=new C().crossVectors(e,i).normalize(),r=new C().crossVectors(e,s),a=Cn()*Math.PI*2,o=Math.tan(t*Math.sqrt(Cn()));return e.addScaledVector(s,Math.cos(a)*o).addScaledVector(r,Math.sin(a)*o).normalize()}function ms(n){const t=On(n.map(e=>e.index?e.toNonIndexed():e),!1);for(const e of n)e.dispose();return t}function L0(n,t){let e=0,i=3;for(let s=0;s<30;s++){const r=(e+i)/2;ld(n,t,r)<0?e=r:i=r}return e}function kp(n,t,e){let i=0,s=3;for(let r=0;r<26;r++){const a=(i+s)/2;ld(Math.cos(t)*a,n,e+Math.sin(t)*a)<0?i=a:s=a}return i}function gl(n,t,e,i){const s=Math.max(8,Math.round(t*18)),r=new Cs(n,s,e,7,i),a=r.attributes.uv,o=a.count,c=new Float32Array(o*3),l=new gt(13150312),h=new gt(9071160),u=new gt;for(let f=0;f<o;f++){const d=.5+.5*Math.sin((a.getX(f)*t*4.5+a.getY(f))*Math.PI*2);u.copy(l).lerp(h,d*d),c[f*3]=u.r,c[f*3+1]=u.g,c[f*3+2]=u.b}return r.setAttribute("color",new $t(c,3)),r}function DE(n){Il=7;const t=n.bones.get("pelvis").parent;if(t?.isSkinnedMesh){const V=t.geometry.attributes.position,X=new Float32Array(V.count*3);for(let z=0;z<V.count;z++){const W=A2(V.getX(z),V.getY(z),V.getZ(z));X[z*3]=W===sf?1:0,X[z*3+1]=W===E2?1:0,X[z*3+2]=W===T2?1:0}t.geometry.setAttribute("aCloth",new $t(X,3)),t.material.dispose(),t.material=wE()}const e=n.std({color:16777215,vertexColors:!0,roughness:.75,metalness:0}),i=n.std({color:16777215,vertexColors:!0,roughness:.9,metalness:0}),s=(V,X,z,W)=>{for(const G of["L","R"]){const tt=new nt(V,z);tt.name=`jack-${W}${G}`,G==="R"&&(tt.scale.x=-1),n.at(tt,X+G,0,0,0)}},r=sn(SE,{min:[-1.92,Ge[1]-mi-.05,Ge[2]-1.92],max:[1.92,Ge[1]+mi+.05,Ge[2]+1.92]},48,CE,4e4),a=r.attributes.position,o=new Float32Array(a.count);for(let V=0;V<a.count;V++)o[V]=Math.max(0,Math.min(1,-hd(a.getX(V),a.getY(V),a.getZ(V)).d/.16));r.setAttribute("aGlow",new $t(o,1));const c=new nt(r,PE(n));c.name="jack-pumpkin",n.at(c,"head",0,0,0);const l=Ge[1]-mi+C2+.3,h=new ue;h.name="jack-flame";const u=new nt(ms([new Wt(.15,10,8).scale(1,1.1,1).translate(0,.15,0),new ii(.148,.42,10,1,!0).translate(0,.36,0)]),n.std({color:0,emissive:16762976,emissiveIntensity:2.4}));u.name="jack-flamecore",h.add(u),n.at(h,"head",0,l,Ge[2]-.15);const f=new Wt(.1,16,10);for(const V of["L","R"]){const X=new nt(f,$g(P2,2.5));X.name=`jack-spot${V}`,X.scale.set(2.3,2.1,.8),X.renderOrder=2,n.at(X,"head",(V==="L"?1:-1)*ja[0],ja[1],ja[2]),X.castShadow=!1,X.receiveShadow=!1}const d=Ge[1]+mi-.22,m=new vn(.16,.26,1.5,7,8).translate(0,.75,0);{const V=m.attributes.position;for(let X=0;X<V.count;X++){const z=V.getY(X)/1.5,W=1+.6*Math.max(0,1-z*5);V.setXYZ(X,V.getX(X)*W+.5*z*z,V.getY(X),V.getZ(X)*W-.1*z*z)}m.computeVertexNormals()}n.at(new nt(m.translate(0,d,Ge[2]-.05),n.std({color:5990956,roughness:.85})),"head",0,0,0);const v=n.std({color:4863526,roughness:.95,side:Se}),g=[];for(let V=0;V<=10;V++){const X=1.08+V/10*1.12;g.push(new ft(X,-.22*((X-1.08)/1.12)**2))}const p=[];for(let V=0;V<=10;V++){const X=V/10;p.push(new ft(1.1-.24*X-(X>.85?(X-.85)*3.6:0),X*1.2))}const _=ms([new Bi(g,28),new Bi(p,28)]);{const V=_.attributes.position;for(let X=0;X<V.count;X++){const z=V.getX(X),W=V.getY(X),G=V.getZ(X),tt=W>.7?.2*Math.exp(-((z/.5)**2))*Math.max(0,G):0;V.setXYZ(X,z,W-.07*Math.max(0,z)*Math.max(0,Math.hypot(z,G)-1.08)-tt*.6,G-tt)}_.computeVertexNormals()}const x=new kn(1.07,.08,6,28).rotateX(Math.PI/2).scale(1,2.4,1).translate(0,.2,0),M=new ue;M.add(new nt(_,v),new nt(x,n.std({color:1971986,roughness:.8}))),M.rotation.set(-.08,0,-.2),n.at(M,"head",.08,Ge[1]+mi-.1,Ge[2]-.1);const w=[];for(let V=0;V<34;V++){const X=V/34*Math.PI*2+Cn()*.15,z=.72,W=new C(Math.cos(X)*z,15.3+Cn()*.1,Math.sin(X)*z*.9),G=Uo(new C(Math.cos(X)*.9,.7,Math.sin(X)*.9),.35);w.push(Do(W,G,.45+Cn()*.5,.05))}const S=new nt(ms(w),e);S.name="jack-collar",n.at(S,"spine2",0,0,0);const T=new C(2.95,11.95,-.05),A=new C(...xE),b=A.clone().sub(T).normalize(),y=[];for(let V=0;V<46;V++){const X=Cn()*Math.PI*2,z=.26*Math.sqrt(Cn()),W=new C(Math.cos(X)*z,0,Math.sin(X)*z),G=A.clone().addScaledVector(b,.55).add(W);y.push(Do(G,Uo(b.clone().addScaledVector(W,1.4),.3),.8+Cn()*.9,.055))}s(ms(y),"forearm",e,"hand");const E=[];for(let V=0;V<26;V++){const X=V/26*Math.PI*2+Cn()*.2,z=new C(1.22+Math.cos(X)*.62,2.2+Cn()*.12,-.05+Math.sin(X)*.62);E.push(Do(z,Uo(new C(Math.cos(X),-1.1,Math.sin(X)),.3),.4+Cn()*.45,.05))}s(ms(E),"shin",e,"ankle");const R=[];for(let V=0;V<14;V++){const X=V/14*Math.PI*2,z=kp(15.62,X,.1)+.04;R.push(new C(Math.cos(X)*z,15.62,.1+Math.sin(X)*z))}n.at(new nt(gl(new vi(R,!0),3.6,.09,!0),i),"neck",0,0,0);const P=10.72,I=[];for(let V=0;V<24;V++){const X=V/24*Math.PI*2,z=kp(P,X,.05)+.06;I.push(new C(Math.cos(X)*z,P,.05+Math.sin(X)*z))}const F=new vi(I,!0),H=.55,$=L0(H,P)+.1,B=new vi([new C(H,P-.05,$),new C(H+.12,P-.6,$+.12),new C(H+.05,P-1.25,$+.08)]),Y=new vi([new C(H,P-.05,$),new C(H-.12,P-.5,$+.14),new C(H-.02,P-1,$+.1)]),it=[];for(const V of[B,Y]){const X=V.getPoint(1);for(let z=0;z<7;z++)it.push(Do(X,Uo(new C(0,-1,.1),.35),.22+Cn()*.2,.035))}const mt=new Wt(.22,10,8).scale(1.2,.9,.8).translate(H,P,$),vt=new Float32Array(mt.attributes.position.count*3),St=new gt(11571288);for(let V=0;V<vt.length;V+=3)vt[V]=St.r,vt[V+1]=St.g,vt[V+2]=St.b;mt.setAttribute("color",new $t(vt,3)),n.at(new nt(ms([gl(F,11,.13,!0),gl(B,1.3,.1,!1),gl(Y,1,.1,!1),mt]),i),"pelvis",0,0,0),n.at(new nt(ms(it),e),"pelvis",0,0,0);const Ct=[],Ut=[];for(const V of[14.25,13.45,12.65]){const X=L0(.13,V);Ct.push(new vn(.12,.12,.07,10).rotateX(Math.PI/2).translate(.13,V,X+.02))}for(let V=0;V<5;V++)Ut.push(Do(new C(.13,13.05,L0(.13,13.05)-.05),Uo(new C(.4,.3,1),.4),.35+Cn()*.25,.035));n.at(new nt(ms(Ct),n.std({color:2759698,roughness:.5})),"spine2",0,0,0),n.at(new nt(ms(Ut),e),"spine2",0,0,0)}const UE=(n,t,e,i)=>n.name.startsWith("thigh")?i>-1.6&&e<n.a[1]+.8&&Math.abs(Math.abs(t)-Math.abs(n.a[0]))<(e<n.a[1]+.3?1.3:.9):n.name.startsWith("arm")||n.name.startsWith("forearm")?Math.abs(t)>(e<12?2.2:e<14.1?1.88:2.1):!0,ja=[tn.cx,Ge[1]+(tn.top+tn.bot)/2-.04,Ge[2]+1.2],P2=16770976,NE=.2,FE=.14,P0=y2.find(n=>n.name==="head").a,kE=new gt(P2),Xs=n=>n<0?0:n>1?1:n,Op=new WeakMap;function Bp(n,t,e,i){const s=Xs(t?e?t.blinkL:t.blinkR:i);if(!t)return n.set(s,.1,0,0),s;const r=e?t.browOuterL:t.browOuterR,a=Math.max(e?t.smileL:t.smileR,t.smile),o=Xs((e?t.squintL:t.squintR)+.4*a),c=Xs(Math.max(e?t.wideL:t.wideR,.7*t.browUp,.7*r)),l=Xs(Math.max(e?t.browDownL:t.browDownR,.6*t.sneer)),h=1-(1-s)*(1-.55*o)*(1-.15*l)*(1+.35*c),u=.1+.55*o*(1-s);return n.set(h,u,.95*l-.5*Xs(t.frown),.1*Math.max(t.browUp,r)-.05*l),s}const OE={id:"pumpkin",name:"Jack",blurb:"A scarecrow with a candle-lit pumpkin head",segs:y2,body:{sdf:ld,region:A2,box:vE,palette:[9181716,2307418,3810326,11044954,1708556],surface:"soft",weights:"sharp",capture:UE},dress:DE,fit:{size:1.08,limb:.6},face:{eyes:[[.66,17.75,2.02,.38],[-.66,17.75,2.02,.38]]},res:76,tick(n,t,e){let i=Op.get(n);if(!i){const m=[],v=[];n.traverse(p=>{p.name==="jack-pumpkin"&&m.push(p.material),p.name==="jack-flamecore"&&v.push(p.material)});const g=[];for(const p of["L","R"]){const _=n.getObjectByName(`jack-spot${p}`);_&&g.push({o:_,m:_.material,sx:p==="L"?1:-1})}i={shell:m,carve:m.map(L2),core:v,flame:n.getObjectByName("jack-flame")??null,spots:g},Op.set(n,i)}const s=e??null,r=.5*Math.sin(t*1.7)+.3*Math.sin(t*7.9+1.3)+.22*Math.sin(t*13.3+.4)+.15*Math.sin(t*23.7+2.2),a=Math.max(0,Math.sin(t*.83+.5)-.92)*6,o=s?Xs(Math.max(s.puff,.8*s.funnel,.5*s.pucker)):0,c=Math.max(.35,1+.36*r-a)*(1+1.3*(s?.jaw??0))*(1+.35*o);for(const m of i.shell)m.emissiveIntensity=c;for(const m of i.core)m.emissiveIntensity=2.4*c;if(i.flame){const m=Math.sin(t*19)+.6*Math.sin(t*31+1.1);i.flame.scale.set(1-.08*r-.15*o,c*(1+.12*Math.sin(t*17))*(1+.6*o),1-.08*r-.15*o),i.flame.rotation.set(-.35*o+.08*o*m,0,.12*Math.sin(t*5.3)+.15*o*m)}const l=(t+.4)%5.7<.15?1:0;let h=0,u=0;for(const m of i.carve)h=Bp(m.uEyeL.value,s,!0,l),u=Bp(m.uEyeR.value,s,!1,l),s?(m.uMouth.value.set(Xs(s.jaw+.35*s.funnel),Math.max(s.smileL,s.smile)-s.frown,Math.max(s.smileR,s.smile)-s.frown,Xs(Math.max(s.pucker,.7*s.funnel))),m.uMouth2.value.set(s.jawSide,0,0,0)):(m.uMouth.value.set(0,0,0,0),m.uMouth2.value.set(0,0,0,0));const f=s?s.lookX:.45*Math.sin(t*.29+.6*Math.sin(t*.11)),d=s?s.lookY:.2*Math.sin(t*.21+2);for(const m of i.spots)m.o.position.set(m.sx*ja[0]-P0[0]+NE*f,ja[1]-P0[1]+FE*d,ja[2]-P0[2]),m.m.color.copy(kE).multiplyScalar(.55*Math.min(1.6,c)*(1-(m.sx>0?h:u)))}},mc=[1.2,7.9,0],$n=[1.32,4.5,.15],Yn=[1.32,1.35,-.1],Hp=[1.32,1,2],Ys=[2.55,12.1,0],Sn=[3.4,9.7,-.1],Ci=[3.95,7.4,.15],As=9.4,Ur=6.1,th=2.9,Vi=n=>[-n[0],n[1],n[2]],ye=[0,13.6,.25],I0=[1.9,1.95,1.8],Oe=1.1,ar=n=>[ye[0]+(n[0]-ye[0])*Oe,ye[1]+(n[1]-ye[1])*Oe,ye[2]+(n[2]-ye[2])*Oe],mn=[.88,14.55,1.5],pn=[.5,.62,.44],Za=[0,13.2,1.3],eh=n=>Za[1]-.13*(n-Za[2]),_a=ar(mn),zp=pn[0]*Oe,BE=ar(Za),I2=[[0,.25,2.1,.45],[.42,.05,1.6,.55],[-.42,.05,1.6,.55],[.22,-.4,1.75,.85],[-.22,-.4,1.75,.85]];function Vp(n,t,e){let i=1e9;for(const[s,r,a,o]of I2)i=Math.min(i,K(n,t,e,s*.5,15,r,s*1.4,15.2+a,r-o,.45,.08));return i}const No=n=>ye[1]+(n-ye[1])/Oe,D0=n=>ye[2]+(n-ye[2])/Oe,HE=ar([0,15.1,.05]),zE=ar([0,17,-.55]),vl=ar([.62,13,.45]),xl=ar([1.2,12.85,.85]),VE=[{name:"pelvis",a:[0,7.9,0],b:[0,8.9,0],parent:null},{name:"spine1",a:[0,8.9,0],b:[0,10.3,.05],parent:"pelvis"},{name:"spine2",a:[0,10.3,.05],b:[0,11.5,.05],parent:"spine1"},{name:"neck",a:[0,11.5,.05],b:[0,11.9,.1],parent:"spine2"},{name:"head",a:[0,11.9,.1],b:[0,15.3,.4],parent:"neck"},{name:"jaw",a:BE,b:ar([0,12.85,3.75]),parent:"head",reach:0},{name:"crest",a:HE,b:zE,parent:"head"},{name:"cheekL",a:vl,b:xl,parent:"head"},{name:"cheekR",a:[-vl[0],vl[1],vl[2]],b:[-xl[0],xl[1],xl[2]],parent:"head"},{name:"tail1",a:[0,6.5,-1.2],b:[0,6,-2],parent:"pelvis",reach:1.3},{name:"tail2",a:[0,6,-2],b:[0,5.6,-2.6],parent:"tail1",reach:1.2},{name:"tail3",a:[0,5.6,-2.6],b:[0,5.35,-3],parent:"tail2",reach:1},{name:"tail4",a:[0,5.35,-3],b:[0,5.2,-3.3],parent:"tail3",reach:.9},{name:"thighL",a:mc,b:$n,parent:"pelvis"},{name:"shinL",a:$n,b:Yn,parent:"thighL"},{name:"footL",a:Yn,b:Hp,parent:"shinL"},{name:"thighR",a:Vi(mc),b:Vi($n),parent:"pelvis"},{name:"shinR",a:Vi($n),b:Vi(Yn),parent:"thighR"},{name:"footR",a:Vi(Yn),b:Vi(Hp),parent:"shinR"},{name:"armL",a:Ys,b:Sn,parent:"spine2"},{name:"forearmL",a:Sn,b:Ci,parent:"armL"},{name:"armR",a:Vi(Ys),b:Vi(Sn),parent:"spine2"},{name:"forearmR",a:Vi(Sn),b:Vi(Ci),parent:"armR"}],GE={min:[-4.6,.5,-3.8],max:[4.6,18.3,2.5]},jn=(n,t,e)=>{const i=Math.min(1,Math.max(0,(e-n)/(t-n)));return i*i*(3-2*i)},li=(n,t,e)=>{const i=Math.sin(n*127.1+t*311.7+e*74.7)*43758.5453;return i-Math.floor(i)};function WE(n,t,e){const i=Math.floor(n),s=Math.floor(t),r=Math.floor(e),a=n-i,o=t-s,c=e-r,l=a*a*(3-2*a),h=o*o*(3-2*o),u=c*c*(3-2*c),f=(d,m,v)=>d+(m-d)*v;return f(f(f(li(i,s,r),li(i+1,s,r),l),f(li(i,s+1,r),li(i+1,s+1,r),l),h),f(f(li(i,s,r+1),li(i+1,s,r+1),l),f(li(i,s+1,r+1),li(i+1,s+1,r+1),l),h),u)}function D2(n,t,e){if(t<6.5)return 7.3-t;if(t>13.4)return t-12.6;const i=Math.abs(n);let s=ct(n,t,e,0,10,.1,1.85,2.4,1.5);return s=O(s,ct(n,t,e,0,10.8,.4,1.5,1.25,1.2),.6),s=O(s,ct(n,t,e,0,11.45,0,2,1,1.35),.7),s=O(s,ve(i,t,e,2.25,11.85,0,.68),.5),O(s,ct(n,t,e,0,8.3,-.1,1.6,1,1.35),.6)}function U2(n,t,e){return t>As+.6||t<Ur-.6?Math.max(t-As,Ur-t):Math.max(N2(n,t,e),t-As,Ur-t)}function N2(n,t,e){const i=Math.min(1,Math.max(0,(As-t)/(As-Ur))),s=1-(1-i)*(1-i),r=1+.025*s*Math.cos(Math.atan2(n,e)*12),a=(1.7+.8*s)*r,o=(1.42+.72*s)*r,c=.05-.1*s;return(Math.hypot(n/a,(e-c)/o)-1)*Math.min(a,o)}function XE(n,t,e){const i=Math.abs(n);let s=ct(n,t,e,ye[0],ye[1],ye[2],I0[0],I0[1],I0[2]);if(s=O(s,ct(i,t,e,.9,13,.7,1.05,.9,1),.5),t>14.6)for(const[r,a,o,c]of I2)s=O(s,K(n,t,e,r*.5,15,a,r*1.4,15.2+o,a-c,.45,.08),.4);return Math.max(s,-ct(i,t,e,mn[0],mn[1],mn[2],pn[0]+.05,pn[1]+.05,pn[2]+.05))}const qE=(n,t,e,i)=>i(ye[0]+(n-ye[0])/Oe,ye[1]+(t-ye[1])/Oe,ye[2]+(e-ye[2])/Oe)*Oe;function F2(n,t,e){return t<10.6?11.4-t:qE(n,t,e,XE)}function k2(n,t,e){if(n<1)return 1.7-n;if(t>13.4)return t-12.8;if(t<4.6)return 5.2-t;let i=K(n,t,e,...Ys,...Sn,.6,.56);const s=1.75;i=O(i,K(n,t,e/s,Sn[0],Sn[1],Sn[2]/s,Ci[0],Ci[1],Ci[2]/s,.5,.4),.45);for(let r=0;r<4;r++){const a=-.75+r*.5,o=1.2+.35*(1-Math.abs(a)/.75);i=O(i,K(n,t,e,Ci[0]-.05,Ci[1]+.5,a*.8+.1,Ci[0]+.12,Ci[1]-o,a*1.1+.15,.32,.12),.25)}return i}function O2(n,t,e){if(t>9.4)return t-8.7;if(n>3)return n-2.1;let i=K(n,t,e,...mc,...$n,.75,.55);return i=O(i,ve(n,t,e,...$n,.57),.3),O(i,K(n,t,e,...$n,...Yn,.53,.42),.3)}function B2(n,t,e){if(e>0)return e+.85;if(t>7.6)return t-6.9;let i=1e9;for(const s of[-1,0,1]){const r=1-Math.abs(s);i=O(i,K(n,t,e,s*.25,6.5,-1.2,s*.7,5.4-r*.2,-3-r*.3,.38,.14),.3)}return i}function $E(n,t,e){const i=Math.abs(n);let s=O(D2(n,t,e),F2(n,t,e),.8);return s=O(s,O2(i,t,e),.55),s=O(s,k2(i,t,e),.05+.5*jn(10.9,11.8,t)),Math.min(s,U2(n,t,e),B2(n,t,e))}const Ss=0,Nr=1,Rr=2,gc=3,Ja=4,nh=5,$i=new Float64Array(6);let Gp=NaN,Wp=NaN,Xp=NaN,ih=0;function yh(n,t,e){if(n===Gp&&t===Wp&&e===Xp)return ih;const i=Math.abs(n);$i[Ss]=D2(n,t,e),$i[Nr]=U2(n,t,e),$i[Rr]=F2(n,t,e),$i[gc]=k2(i,t,e),$i[Ja]=O2(i,t,e),$i[nh]=B2(n,t,e);let s=0;for(let r=1;r<6;r++)$i[r]<$i[s]&&(s=r);return Gp=n,Wp=t,Xp=e,ih=s,s}const YE=.25,rn=n=>$i[n]<=$i[ih]+YE,jE=(n,t,e,i)=>{yh(t,e,i);const s=n.name,r=s.endsWith("L")?1:s.endsWith("R")?-1:0;if(r!==0&&t*r<-.05)return!1;if(s==="pelvis")return rn(Ss)||rn(Nr)||rn(nh)||rn(Ja);if(s==="spine1")return rn(Ss)||rn(Nr);if(s==="spine2")return rn(Ss);if(s==="neck")return rn(Ss)||rn(Rr);if(s==="crest")return rn(Rr)&&No(e)>15.05&&Vp(t/Oe,No(e),D0(i))<.32;if(s==="cheekL"||s==="cheekR"){const a=No(e);return rn(Rr)&&a<13.85&&a>12.1&&D0(i)>-.2&&Math.abs(t)/Oe>.5}return s==="head"?rn(Rr)&&!(No(e)>15.95&&Vp(t/Oe,No(e),D0(i))<.32):s==="jaw"||s.startsWith("foot")?!1:s.startsWith("tail")?rn(nh):s.startsWith("arm")||s.startsWith("forearm")?rn(gc)&&(ih===gc||e>11.3):s.startsWith("shin")?rn(Ja):s.startsWith("thigh")?rn(Ja)?!0:rn(Nr)&&i>-.4&&e<mc[1]+.8&&Math.abs(Math.abs(t)-mc[0])<1.35:!0},H2=12166120,ZE=14998264,JE=1578014,KE=10126548,z2=16053239,V2=1315352,rf=(n,t)=>(t>0?11.2+.55*jn(.15,1,n):11.65)-.6*jn(1.35,1.9,n),QE=new gt(z2),qp=new gt(V2),t4=new gt(H2).multiplyScalar(1/1.6),e4=(n,t,e)=>1-jn(t-e,t+e,Math.abs(n));function n4(n,t,e,i,s){s.copy(QE),n===Ss&&s.lerp(t4,jn(rf(Math.abs(t),i)-.05,rf(Math.abs(t),i)+.08,e)),s.lerp(qp,e4(e-(As-.15),.27,.08)),n===Nr&&s.lerp(qp,(1-jn(Ur+.4,Ur+.56,e))*(N2(t,e,i)>-.12?1:0))}function $p(n,t,e){const s=Math.floor(n/.8),r=Math.floor(t/(.8*1.4)),a=Math.floor(e/.8);for(let o=-1;o<=1;o++)for(let c=-1;c<=1;c++)for(let l=-1;l<=1;l++){const h=s+c,u=r+o,f=a+l;if(li(h,u,f)>.45)continue;const d=(h+.2+.6*li(h+7,u,f))*.8,m=(u+.2+.6*li(h,u+7,f))*.8*1.4,v=(f+.2+.6*li(h,u,f+7))*.8;if(((n-d)/.44)**2+((t-m)/.75)**2+((e-v)/.44)**2<1)return!0}return!1}function G2(n,t,e){const i=Math.abs(n),s=yh(n,t,e);if(s===Nr)return t<Ur+.48||t>As-.45?3:2;if(s===Ss){const r=rf(i,e);return t>r+.3?t>11.2&&i>1.5&&$p(n,t,e)?1:0:t>r-.05?2:t<As+.12&&t>As-.42?3:2}if(s===Rr){const r=ye[1]+(t-ye[1])/Oe,a=ye[2]+(e-ye[2])/Oe;return r>15.2||r>14.2&&a<-.6?5:0}if(s===gc){if(t<6.6)return 6;const r=t>Sn[1]?Ys[0]+(Sn[0]-Ys[0])*(Ys[1]-t)/(Ys[1]-Sn[1]):Sn[0]+(Ci[0]-Sn[0])*Math.min(1,(Sn[1]-t)/(Sn[1]-Ci[1]));return i-r>-.25&&$p(n,t,e)?1:0}return s===Ja&&t<th-.05?4:0}function i4(n,t,e){const i=G2(n,t,e);if(i===2||i===3||i===4)return 0;const s=yh(n,t,e),r=Math.abs(n),a=.6+.8*WE(n*1.4+3.1,t*1.4,e*1.4);let o=1;if(s===Rr){const c=r/Oe,l=ye[1]+(t-ye[1])/Oe,h=ye[2]+(e-ye[2])/Oe,u=Math.hypot((c-mn[0])/pn[0],(l-mn[1])/pn[1],(h-mn[2])/pn[2]);if(u<1.5||h>.95&&c<1.15&&l<13.95&&l>12.2)return 0;const f=jn(.2,1.2,h)*(1-jn(1,1.6,c))*(1-jn(15.2,15.6,l));o=.3*Math.min(1,(u-1.5)/.8)*f+1.3*(1-f),l>15.2?o=1.5:l<12.6&&h>.3&&(o=Math.min(o,.25))}else if(s===Ss)o=(t>11?1.25:.9)*(e>0?1-.55*(1-jn(.5,1.2,r)):1);else if(s===gc){const c=jn(-.4,.4,-e)*.4+jn(-.2,.3,Ys[0]+.6-r)*.4;o=(t<7.2?1.3:1)+c}else s===Ja?o=t<th+.7?1.25:.9:s===nh&&(o=1.2);return i===1&&(o*=1.2),o*a}const W2=(n,t,e)=>O(K(n/1.5,t,e,0,13.55,1.2,0,13.05,3.85,.7,.4)*.88,K(n/1.3,t,e,0,13.85,1,0,13.5,2.7,.42,.32),.4),s4=(n,t,e)=>Math.max(W2(n,t,e),eh(e)-t),X2=(n,t,e)=>K(n/1.42,t,e,0,13.1,1.2,0,12.8,3.65,.55,.32)*.9,r4=(n,t,e)=>Math.max(X2(n,t,e),t-eh(e)+.03),a4=new gt(4211536),o4=new gt(8817306),af=5903396,c4=13130354,Yp=n=>(t,e,i,s)=>{const r=(n?X2:W2)(Math.abs(t)+.09,e,i)<0&&i<3.6;!n&&r&&e<eh(i)+.05?s.setHex(af):n&&r&&e>eh(i)-.08?s.setHex(Math.abs(t)<.35&&i>1.7?c4:af):s.copy(a4).lerp(o4,jn(2.9,4.1,i))};function l4(n,t,e){const i=Yn[1];let s=Math.max(ct(n,t,e,0,.32-i,.65,.84,.4,1.72),-(t+i));return s=O(s,ct(n,t,e,0,.78-i,.55,.74,.6,1.5),.2),s=O(s,ct(n,t,e,0,.62-i,1.5,.7,.46,.85),.25),s=O(s,K(n,t,e,0,.95-i,-.2,0,1.4-i,-.15,.62,.6),.3),Math.max(s,-K(n,t,e,0,1.4-i,-.15,0,3-i,-.15,.47,.47))}function h4(n,t,e,i){const s=t+Yn[1];s<.42||e>1.75&&s<.9?i.setHex(16448252):Math.abs(n)<.3&&e>.25&&e<1.55&&s>1?i.setHex(16777215):Math.abs(s-.47)<.05?i.setHex(12105924):i.setHex(14474468)}function u4(){const e=new Uint8Array(65536);for(let s=0;s<128;s++)for(let r=0;r<128;r++){const a=(s+.5)/128,o=(r+.5)/128*Math.PI*2,h=((a*2.6-.38*Math.abs(Math.sin(o)))%.85+.85)%.85<.4&&a<.84;e.set(h?[168,142,224,255]:[246,244,250,255],(s*128+r)*4)}const i=new Ga(e,128,128,cn);return i.colorSpace=gn,i.wrapS=so,i.magFilter=Ie,i.minFilter=$s,i.generateMipmaps=!0,i.needsUpdate=!0,i}function Fo(n,t,e,i="head"){t.scale.multiplyScalar(Oe);const s=ar(e);n.at(t,i,s[0],s[1],s[2])}function f4(n){const t=n.std({color:16514047,roughness:.15}),e=n.std({color:2761284,roughness:.1}),i=n.std({color:328712,roughness:.06}),s=n.std({color:1314840,roughness:.5}),r=n.std({color:16777215,emissive:16777215,emissiveIntensity:.8,roughness:.2}),a=n.std({color:11047644,roughness:.85});for(const A of[1,-1]){const b=A>0?"L":"R",y=new ue;y.name="vi-eye"+b,y.scale.set(1,pn[1]/pn[0],pn[2]/pn[0]),y.add(new nt(new Wt(pn[0],22,16),t));const E=new ue;E.name="vi-look"+b,E.rotation.set(.12,-A*.14,0);for(const[F,H,$]of[[e,.012,.62],[i,.02,.3]]){const B=new nt(new Wt(pn[0]+H,22,6,0,Math.PI*2,0,$),F);B.rotation.x=Math.PI/2,E.add(B)}const R=new nt(new Wt(.07,8,6),r);R.position.set(A*.1,.12,.45),E.add(R),y.add(E);const P=Ec("vi-lid"+b,pn[0],a,{gap:.14});P.rotation.z=0;for(const F of P.children)F.rotation.order="ZXY";const I=new nt(new kn(pn[0]*1.14+.005,.055,6,24,Math.PI*.8),s);I.rotation.set(Math.PI/2,0,Math.PI*.1),P.children[0].add(I),q2(P,0,0,0,0,0),y.add(P),Fo(n,y,[A*mn[0],mn[1],mn[2]])}const o=n.std({color:14263361,roughness:.32,metalness:.65}),c=.76,l=mn[2]+pn[2]+.14,h=.3,u=new ue;u.name="vi-glasses";for(const A of[1,-1]){const b=new nt(new kn(c,.12,12,48),o);b.rotation.y=A*h,b.position.set(A*mn[0],0,l),u.add(b);const y=new C(A*(mn[0]+c*Math.cos(h)),.05,l-c*Math.sin(h)),E=new C(A*1.84,.05,-.2),R=new nt(new vn(.07,.07,y.distanceTo(E),8),o);R.quaternion.setFromUnitVectors(new C(0,1,0),E.clone().sub(y).normalize()),R.position.copy(y).add(E).multiplyScalar(.5),u.add(R)}const f=new nt(new kn(mn[0]-c*Math.cos(h),.1,8,16,Math.PI),o);f.position.set(0,.05,l+c*Math.sin(h)),u.add(f),Fo(n,u,[0,mn[1],0]);const d=n.std({vertexColors:!0,roughness:.55,metalness:.02}),m=new nt(sn(s4,{min:[-1.15,12.45,.9],max:[1.15,14.35,4.35]},34,Yp(!1),12e3),d);m.position.set(-0,-13.2,-1.3);const v=new nt(sn(r4,{min:[-.85,12.45,.9],max:[.85,13.25,4]},30,Yp(!0),1e4),d);v.position.set(-0,-13.6,-.25);const g=new ue;g.name="vi-upper",g.add(m),Fo(n,g,Za);const p=new ue;p.add(v),Fo(n,p,ye,"jaw");const _=new nt(new Wt(1,16,10),n.std({color:af,roughness:.6}));_.scale.set(.6,.36,.55),Fo(n,_,[0,Za[1]-.05,Za[2]+.35]);const x=new $e({map:u4(),roughness:.85,side:Se}),M=1.2,w=A=>$n[2]+(Yn[2]-$n[2])*($n[1]-A)/($n[1]-Yn[1]);for(const[A,b]of[["shinL",1],["shinR",-1]]){const y=new C(b*$n[0],M,w(M)),E=new C(b*$n[0],th,w(th)),R=new nt(new vn(.6,.53,y.distanceTo(E),40,1,!0),x);R.quaternion.setFromUnitVectors(new C(0,1,0),E.clone().sub(y).normalize());const P=y.add(E).multiplyScalar(.5);n.at(R,A,P.x,P.y,P.z)}const S=sn(l4,{min:[-.95,-Yn[1]-.05,-1.2],max:[.95,.75,2.45]},26,h4,1e4),T=n.std({vertexColors:!0,roughness:.55});for(const[A,b]of[["footL",1],["footR",-1]])n.at(new nt(S,T),A,b*Yn[0],Yn[1],Yn[2])}const Dl=n=>n<0?0:n>1?1:n,d4=-1.12,p4=.95,m4=.2,g4=.04;function q2(n,t,e,i,s,r){const a=n.children[0],o=n.children[1];if(!a||!o)return;const c=Dl(t),l=d4-.38*i+.3*e+.55*s,h=p4+.2*i-.62*e;a.rotation.x=l+(m4-l)*c,o.rotation.x=h+(g4-h)*c,a.rotation.z=r*(1-c)}function U0(n,t,e,i,s){const r=Math.min(12,Math.ceil(e/.008)),a=r>0?e/r:0;for(let o=0;o<r;o++)n.v+=(i*i*(t-n.x)-2*s*i*n.v)*a,n.x+=n.v*a}const jp=new WeakMap;function v4(n){let t=jp.get(n);if(t)return t;const e=o=>n.getObjectByName(o)??null,i=[e("vi-lookL"),e("vi-lookR")],s=[e("cheekL"),e("cheekR")],r=e("vi-glasses"),a=e("head");return t={lids:[e("vi-lidL"),e("vi-lidR")],looks:i,lookRest:i.flatMap(o=>[o?.rotation.x??0,o?.rotation.y??0]),glasses:r,glassesY:r?.position.y??0,upper:e("vi-upper"),crest:e("crest"),cheeks:s,cheekRest:s.map(o=>o?.position.clone()??new C),head:a,prev:a?.quaternion.clone()??new le,dq:new le,t:NaN,cx:{x:0,v:0},cy:{x:0,v:0},cz:{x:0,v:0}},jp.set(n,t),t}function x4(n,t,e){const i=v4(n),s=Number.isNaN(i.t),r=s?0:Math.min(.1,Math.max(0,t-i.t));i.t=t;const a=(t+1.3)%4.4,o=a<.18?Math.sin(a/.18*Math.PI):0,c=e?e.smileL||e.smileR?e.smileL:e.smile:0,l=e?e.smileL||e.smileR?e.smileR:e.smile:0,h=e?.browDownL??0,u=e?.browDownR??0,f=e?.browUp??0,d=e?.browOuterL??0,m=e?.browOuterR??0,v=e?.puff??0,g=e?.jaw??0;for(let p=0;p<2;p++){const _=i.lids[p];if(!_)continue;const x=p===0?1:-1,M=e?p===0?e.blinkL:e.blinkR:o,w=e?Dl(Math.max(p===0?e.squintL:e.squintR,.6*(p===0?c:l))):0,S=e?p===0?e.wideL:e.wideR:0,T=p===0?h:u;q2(_,M,w,S,T,x*(.3*T-.22*f))}for(let p=0;p<2;p++){const _=i.looks[p];_&&_.rotation.set(i.lookRest[p*2]-(e?.lookY??0)*.34,i.lookRest[p*2+1]+(e?.lookX??0)*.5,0)}if(i.glasses){const p=Math.max(-.13,Math.min(.13,.1*(d-m)+.08*(u-h)+.04*(c-l))),_=.16*f+.08*(d+m)+.05*(c+l)+mn[0]*Math.abs(Math.sin(p));i.glasses.position.y=i.glassesY+_*Oe,i.glasses.rotation.z=p}i.upper&&(i.upper.rotation.x=-(.1*g+.08*(e?.sneer??0)));for(let p=0;p<2;p++){const _=i.cheeks[p];if(!_)continue;const x=p===0?1:-1,M=p===0?c:l,w=i.cheekRest[p];_.position.set(w.x+x*.3*v*Oe,w.y+(.16*M-.05*v)*Oe,w.z+(.14*v+.04*M)*Oe),_.scale.setScalar(1+.14*v+.05*M)}if(i.crest){const p=e?Dl(Math.max(f,.5*(d+m))+.25*(e.wideL+e.wideR)+.35*g*f):0,_=e?Dl(Math.max(.5*(h+u),.7*e.frown)):0,x=.45*p-.6*_+(e?0:.05*Math.sin(t*1.1)),M=e?.3*(d-m)+.25*(u-h):.03*Math.sin(t*.7);if(s&&(i.cx.x=x,i.cz.x=M,i.cy.x=0),i.head&&!s){const w=i.dq.copy(i.prev).invert().multiply(i.head.quaternion),S=w.w<0?-2:2;i.cx.x-=.9*w.x*S,i.cy.x-=.6*w.y*S,i.cz.x-=.9*w.z*S}i.head&&i.prev.copy(i.head.quaternion),U0(i.cx,x,r,11,.3),U0(i.cy,0,r,10,.3),U0(i.cz,M,r,11,.3),i.cx.x=Math.max(-1,Math.min(.8,i.cx.x)),i.cy.x=Math.max(-.5,Math.min(.5,i.cy.x)),i.cz.x=Math.max(-.6,Math.min(.6,i.cz.x)),i.crest.rotation.set(i.cx.x,i.cy.x,i.cz.x),i.crest.scale.set(1,1+.14*p-.08*_,1)}}const _4={id:"violet",name:"Violet",blurb:"The Valkyries’ lavender raven, in gold glasses",segs:VE,body:{sdf:$E,region:G2,box:GE,palette:[H2,JE,z2,V2,16184570,ZE,KE],surface:"soft",capture:jE,fur:{length:1,density:4.5,tip:.3},furLen:i4,tint(n,t,e,i,s){const r=yh(t,e,i);(n===2||n===3)&&(r===Ss||r===Nr)&&n4(r,t,e,i,s),n>=2&&n<=4&&s.multiplyScalar(1.6),n!==2&&n!==3&&i<-.6&&s.multiplyScalar(1-.12*Math.min(1,(-.6-i)/1.5))}},dress:f4,tick:x4,fit:{size:1.1,limb:.55},idle:{tail:.12},face:{jaw:.45,eyes:[[_a[0],_a[1],_a[2],zp],[-_a[0],_a[1],_a[2],zp]]},res:72,furShells:9},$2=[{name:"pelvis",a:[0,9.6,0],b:[0,10.6,0],parent:null},{name:"spine1",a:[0,10.6,0],b:[0,12.4,.1],parent:"pelvis"},{name:"spine2",a:[0,12.4,.1],b:[0,15,.1],parent:"spine1"},{name:"neck",a:[0,15,.1],b:[0,15.9,.15],parent:"spine2",reach:.8},{name:"head",a:[0,15.9,.15],b:[0,18.4,.3],parent:"neck"},{name:"jaw",a:[0,16.4,.9],b:[0,16.4,1.2],parent:"head",reach:0},{name:"tail1",a:[0,14.8,-1.2],b:[0,12.6,-1.4],parent:"spine2",reach:1},{name:"tail2",a:[0,12.6,-1.4],b:[0,10.4,-1.6],parent:"tail1",reach:1},{name:"tail3",a:[0,10.4,-1.6],b:[0,8.2,-1.8],parent:"tail2",reach:1},{name:"tail4",a:[0,8.2,-1.8],b:[0,6.2,-2],parent:"tail3",reach:1},{name:"thighL",a:[1.1,9.6,0],b:[1.2,5.3,.2],parent:"pelvis"},{name:"shinL",a:[1.2,5.3,.2],b:[1.2,1.1,-.1],parent:"thighL"},{name:"footL",a:[1.2,1.1,-.1],b:[1.2,.35,1.4],parent:"shinL"},{name:"thighR",a:[-1.1,9.6,0],b:[-1.2,5.3,.2],parent:"pelvis"},{name:"shinR",a:[-1.2,5.3,.2],b:[-1.2,1.1,-.1],parent:"thighR"},{name:"footR",a:[-1.2,1.1,-.1],b:[-1.2,.35,1.4],parent:"shinR"},{name:"armL",a:[2.4,14.6,0],b:[2.72,11.9,-.05],parent:"spine2"},{name:"forearmL",a:[2.72,11.9,-.05],b:[2.85,9.45,.4],parent:"armL"},{name:"armR",a:[-2.4,14.6,0],b:[-2.72,11.9,-.05],parent:"spine2"},{name:"forearmR",a:[-2.72,11.9,-.05],b:[-2.85,9.45,.4],parent:"armR"}],M4={min:[-4.2,-.4,-2.8],max:[4.2,20.4,2.6]};function b4(n,t,e,i){const s=Math.abs(n),r=1-.08*i;let a=ct(n,t,e,0,13.35,.1,1.8*r,1.95,1.05*r);return a=O(a,ct(s,t,e,.85*r,13.75,.75,.95*r,.68,.5),.45),a=O(a,ct(n,t,e,0,13.75,-.35,1.95*r,1.3,.62),.4),a=O(a,K(s,t,e,0,15.35,-.2,1.85*r,14.95,-.1,.5,.36),.5),a=O(a,ct(n,t,e,0,11.6,.12,1.35*r,1.45,.92*r),.6),a=O(a,ct(n,t,e,0,10,0,1.68*r,1,1.02*r),.6),a=O(a,ct(s,t,e,.72,9.55,-.5,.82*r,.85,.62),.4),a=Math.max(a,-K(n,t,e,0,14.6,-1.12,0,10.6,-.98,.16,.14)),a=O(a,K(n,t,e,0,14.9,-.05,0,16.3,.12,.6,.52),.4),a=O(a,ct(n,t,e,0,17.3,.1,.95,1.12,1.08),.3),a=O(a,ct(n,t,e,0,16.55,.4,.74,.74,.82),.35),a=O(a,ct(s,t,e,2.3*r,14.5,0,.7*r,.92,.78),.4),a=O(a,K(s,t,e,2.4,14.4,0,2.72,11.95,-.05,.56*r,.42*r),.3),a=O(a,ct(s,t,e,2.56,13.15,.12,.5*r,.95,.5*r),.3),a=O(a,K(s,t,e,2.72,11.9,-.05,2.85,9.6,.38,.46*r,.3*r),.25),a=O(a,ct(s,t,e,2.76,11.2,.05,.48*r,.8,.48*r),.3),a=O(a,ct(s,t,e,2.87,9,.48,.24,.52,.42),.2),a=O(a,K(s,t,e,2.8,9.35,.75,2.72,8.85,.95,.15,.12),.12),a=O(a,K(s,t,e,1.02,9.6,0,1.15,5.45,.2,.9*r,.56*r),.45),a=O(a,ct(s,t,e,1.12,7.7,.28,.8*r,1.6,.72*r),.4),a=O(a,ct(s,t,e,.8,8.3,0,.55*r,1.3,.6),.4),a=O(a,ve(s,t,e,1.17,5.3,.32,.52*r),.3),a=O(a,K(s,t,e,1.18,5.25,.15,1.2,1.15,-.1,.5*r,.3*r),.3),a=O(a,ct(s,t,e,1.2,3.95,-.28,.56*r,1.3,.6*r),.35),a=O(a,Math.max(ct(s,t,e,1.2,.5,.55,.46,.5,1.25),-t),.25),a}function w4(n,t,e,i,s=0){const r=Math.abs(n);let a=b4(n,t,e,0);return a=O(a,ct(n,t,e,0,17.3,.12,1.08,1.24,1.18),.25),a=O(a,ct(n,t,e,0,16.5,.45,.82,.72,.86),.25),a=O(a,K(n,t,e,0,18.42,-.7,0,18.5,.85,.16,.12),.2),a=O(a,ct(n,t,e,0,10.55,.05,1.55,.38,1.1),.15),a=O(a,ct(n,t,e,0,10.55,1.05,.55,.42,.22),.1),a=O(a,K(r,t,e,2.82,10.25,.3,2.86,9.5,.42,.4,.38),.15),a=O(a,K(r,t,e,1.2,3.2,-.05,1.2,1,-.08,.52,.48),.2),a-s}function y4(n,t,e,i){const s=Math.abs(n);if(t>16.75&&t<17.5&&e>.9&&s<.95)return 2;if(Math.abs(t-10.6)<.45&&e>-1.5)return 3;if(t<3.2||t<10.4&&s>2.3&&t>8.2)return 1;if(e>.7&&s<1.7){const r=t-12.6-s*.55;if(r>0&&r<.35||r>.75&&r<1.1)return 1}return 0}const S4=[{name:"pelvis",a:[0,7.6,-.4],b:[0,8.8,0],parent:null},{name:"spine1",a:[0,8.8,0],b:[0,10.8,.3],parent:"pelvis"},{name:"spine2",a:[0,10.8,.3],b:[0,12.6,.6],parent:"spine1"},{name:"neck",a:[0,12.6,.6],b:[0,15.6,1.3],parent:"spine2",reach:1.9},{name:"head",a:[0,15.6,1.3],b:[0,17.6,2.4],parent:"neck"},{name:"jaw",a:[0,15.9,2.6],b:[0,15.7,4.4],parent:"head",reach:0},{name:"crest",a:[0,18.05,1.55],b:[0,20.6,.4],parent:"head"},{name:"cheekL",a:[.6,16.3,2.15],b:[1.15,16.15,2.6],parent:"head"},{name:"cheekR",a:[-.6,16.3,2.15],b:[-1.15,16.15,2.6],parent:"head"},{name:"tail1",a:[0,7.4,-2.6],b:[0,6.8,-3.6],parent:"pelvis",reach:1.4},{name:"tail2",a:[0,6.8,-3.6],b:[0,6.2,-4.5],parent:"tail1",reach:1.4},{name:"tail3",a:[0,6.2,-4.5],b:[0,5.7,-5.2],parent:"tail2",reach:1.2},{name:"tail4",a:[0,5.7,-5.2],b:[0,5.3,-5.7],parent:"tail3",reach:1},{name:"thighL",a:[1.4,7.4,0],b:[1.5,4.6,.3],parent:"pelvis"},{name:"shinL",a:[1.5,4.6,.3],b:[1.5,.9,-.2],parent:"thighL"},{name:"footL",a:[1.5,.9,-.2],b:[1.5,.3,1.8],parent:"shinL"},{name:"thighR",a:[-1.4,7.4,0],b:[-1.5,4.6,.3],parent:"pelvis"},{name:"shinR",a:[-1.5,4.6,.3],b:[-1.5,.9,-.2],parent:"thighR"},{name:"footR",a:[-1.5,.9,-.2],b:[-1.5,.3,1.8],parent:"shinR"},{name:"armL",a:[2.7,11.6,.2],b:[3.3,9.2,-.1],parent:"spine2"},{name:"forearmL",a:[3.3,9.2,-.1],b:[3.2,7,.3],parent:"armL"},{name:"armR",a:[-2.7,11.6,.2],b:[-3.3,9.2,-.1],parent:"spine2"},{name:"forearmR",a:[-3.3,9.2,-.1],b:[-3.2,7,.3],parent:"armR"}],E4={min:[-5,-.4,-7.2],max:[5,21.4,6.6]},Nn=[.72,17.25,2.75],_l=.52;function Zp(n,t,e){let i=1e9;for(const[s,r]of[[0,1],[.6,.82],[-.6,.82]])i=Math.min(i,K(n,t,e,s*.5,18.1,1.6,s*1.3,18.1+2.7*r,1-.7*r,.34,.12));return i}function T4(n,t,e,i=0){const s=Math.abs(n);let r=ct(n,t,e,0,9.2,-.2,3.3,3.5,3);r=O(r,ct(n,t,e,0,11.4,.5,2.5,2.2,2.3),1),r=O(r,K(n,t,e,0,12.2,.5,0,15.8,1.4,1.25,.95),.8);let a=ve(n,t,e,0,16.9,1.8,1.55);if(t>17.4)for(const[o,c]of[[0,1],[.6,.82],[-.6,.82]])a=O(a,K(n,t,e,o*.5,18.1,1.6,o*1.3,18.1+2.7*c,1-.7*c,.34,.12),.3);a=Math.max(a,-ve(s,t,e,Nn[0],Nn[1],Nn[2],.5)),r=O(r,a,.5),r=O(r,ct(s,t,e,3,9.8,0,.75,2.6,1.7),.7);for(const o of[-1,0,1])r=O(r,K(s,t,e,3.2,8.4,o*.6,3.25,6.6+Math.abs(o)*.4,o*.75+.2,.42,.14),.3);for(const o of[-1,0,1])r=O(r,K(n,t,e,o*.3,7.6,-2.6,o*1.1,7+(1-Math.abs(o))*.5,-5.6,.5,.2),.4);r=O(r,K(s,t,e,1.4,7.4,0,1.5,4.8,.3,1,.55),.5),r=O(r,K(s,t,e,1.5,4.8,.3,1.5,1,-.2,.42,.36),.25),r-=i;for(const o of[-1,0,1])r=O(r,K(s,t,e,1.5,.5,.1,1.5+o*.85,.3,2-Math.abs(o)*.3,.34,.16),.2);return r=O(r,K(s,t,e,1.5,.5,-.2,1.5,.3,-1.1,.3,.14),.15),r}function Y2(n,t,e){const i=Math.abs(n);return t>15.6&&t<17.1&&e>2.6&&i<.85||t<5&&i>.9&&i<2.6||t<1?3:t>18.4||e<-4.6?2:e>1.2&&t>9.4&&t<13.4&&i<1.8||e>2.2&&t>16.2&&t<18.2&&i<1.25?1:0}function A4(n,t,e){const i=Math.abs(n),s=Y2(n,t,e);return s===3||Math.hypot(i-Nn[0],t-Nn[1],e-Nn[2])<.9?0:s===2?.6:t>16?.45:t>14.6&&e>1.6?.3:t>12.2?1.25:e<-2.4?1.4:1}function R4(n){return(t,e,i,s)=>{const r=t.name;return r==="jaw"?!1:r==="crest"?i>17.9&&Zp(e,i,s)<.4:r==="cheekL"||r==="cheekR"?(r==="cheekL"?e:-e)>.6&&i>15.3&&i<16.75&&s>1.7:r==="head"&&i>18.75&&Zp(e,i,s)<.4?!1:n(t,e,i,s)}}const C4=(n,t,e)=>{const i=Math.min(1,Math.max(0,(e-n)/(t-n)));return i*i*(3-2*i)},Zo=n=>16.02-.06*(n-2.7),L4=(n,t,e)=>K(n,t,e,0,16.55,2.9,0,16.1,5,.72,.18),P4=(n,t,e)=>Math.max(L4(n,t,e),Zo(e)-t),of=(n,t,e)=>K(n,t,e,0,15.85,2.8,0,15.75,4.4,.5,.14),I4=(n,t,e)=>Math.max(of(n,t,e),t-Zo(e)+.03),D4=new gt(15759906),U4=new gt(16163402),cf=6951968,N4=15229050,Jp=n=>(t,e,i,s)=>{const r=n?of(Math.abs(t)+.08,e,i)<0:of(Math.abs(t)+.1,Zo(i)-.12,i)<0;!n&&r&&e<Zo(i)+.05&&i<4.7?s.setHex(cf):n&&r&&i<4.7&&e>Zo(i)-.07?s.setHex(Math.abs(t)<.24&&i>3?N4:cf):s.copy(D4).lerp(U4,C4(3.9,5,i))},F4=[0,15.9,2.6];function k4(n){const t=n.std({color:16316660,roughness:.2}),e=n.std({color:657936,roughness:.1}),i=n.std({color:16777215,emissive:16777215,emissiveIntensity:.8,roughness:.2}),s=n.std({color:15247372,roughness:.8}),r=n.std({color:5909512,roughness:.6});for(const u of[1,-1]){const f=u>0?"L":"R",d=new ue;d.name="pl-eye"+f,d.add(new nt(new Wt(_l,22,16),t));const m=new ue;m.name="pl-look"+f,m.rotation.set(.04,-u*.2,0);const v=new nt(new Wt(_l+.012,22,6,0,Math.PI*2,0,.44),e);v.rotation.x=Math.PI/2,m.add(v);const g=new nt(new Wt(.06,8,6),i);g.position.set(u*.08,.1,.47),m.add(g),d.add(m);const p=Ec("pl-lid"+f,_l,s,{gap:.08});for(const x of p.children)x.rotation.order="ZXY";const _=new nt(new kn(_l*1.08+.005,.045,6,24,Math.PI*.8),r);_.rotation.set(Math.PI/2,0,Math.PI*.1),p.children[0].add(_),j2(p,0,0,0,0,0),d.add(p),n.at(d,"head",u*Nn[0],Nn[1],Nn[2])}const a=n.std({vertexColors:!0,roughness:.5,metalness:.02}),o=new nt(sn(P4,{min:[-.8,15.85,2.1],max:[.8,17.35,5.25]},34,Jp(!1),12e3),a);o.position.set(-0,-15.9,-2.6);const c=new ue;c.name="pl-upper",c.add(o),n.at(c,"head",...F4);const l=new nt(sn(I4,{min:[-.56,15.2,2.2],max:[.56,16.1,4.65]},30,Jp(!0),1e4),a);n.at(l,"jaw",0,0,0);const h=new nt(new Wt(1,16,10),n.std({color:cf,roughness:.6}));h.scale.set(.38,.3,.55),n.at(h,"head",0,15.97,3)}const Ul=n=>n<0?0:n>1?1:n,O4=-1.25,B4=1,H4=.2,z4=.04;function j2(n,t,e,i,s,r){const a=n.children[0],o=n.children[1];if(!a||!o)return;const c=Ul(t),l=O4-.3*i+.35*e+.7*s,h=B4+.2*i-.62*e;a.rotation.x=l+(H4-l)*c,o.rotation.x=h+(z4-h)*c,a.rotation.z=r*(1-c)}function N0(n,t,e,i,s){const r=Math.min(12,Math.ceil(e/.008)),a=r>0?e/r:0;for(let o=0;o<r;o++)n.v+=(i*i*(t-n.x)-2*s*i*n.v)*a,n.x+=n.v*a}const Kp=new WeakMap;function V4(n){let t=Kp.get(n);if(t)return t;const e=a=>n.getObjectByName(a)??null,i=[e("pl-lookL"),e("pl-lookR")],s=[e("cheekL"),e("cheekR")],r=e("head");return t={lids:[e("pl-lidL"),e("pl-lidR")],looks:i,lookRest:i.flatMap(a=>[a?.rotation.x??0,a?.rotation.y??0]),upper:e("pl-upper"),crest:e("crest"),cheeks:s,cheekRest:s.map(a=>a?.position.clone()??new C),head:r,prev:r?.quaternion.clone()??new le,dq:new le,t:NaN,cx:{x:0,v:0},cy:{x:0,v:0},cz:{x:0,v:0}},Kp.set(n,t),t}function G4(n,t,e){const i=V4(n),s=Number.isNaN(i.t),r=s?0:Math.min(.1,Math.max(0,t-i.t));i.t=t;const a=(t+2.1)%3.9,o=a<.18?Math.sin(a/.18*Math.PI):0,c=e?e.smileL||e.smileR?e.smileL:e.smile:0,l=e?e.smileL||e.smileR?e.smileR:e.smile:0,h=e?.browDownL??0,u=e?.browDownR??0,f=e?.browUp??0,d=e?.browOuterL??0,m=e?.browOuterR??0,v=e?.puff??0,g=e?.jaw??0;for(let p=0;p<2;p++){const _=i.lids[p];if(!_)continue;const x=p===0?1:-1,M=p===0?h:u,w=e?p===0?e.blinkL:e.blinkR:o,S=e?Ul(Math.max(p===0?e.squintL:e.squintR,.6*(p===0?c:l))):0;j2(_,w,S,e?p===0?e.wideL:e.wideR:0,M,x*(.3*M-.22*f))}for(let p=0;p<2;p++){const _=i.looks[p];_&&_.rotation.set(i.lookRest[p*2]-(e?.lookY??0)*.36,i.lookRest[p*2+1]+(e?.lookX??0)*.5,0)}i.upper&&(i.upper.rotation.x=-(.1*g+.08*(e?.sneer??0)));for(let p=0;p<2;p++){const _=i.cheeks[p];if(!_)continue;const x=p===0?1:-1,M=p===0?c:l,w=i.cheekRest[p];_.position.set(w.x+x*.22*v,w.y+.16*M-.04*v,w.z+.1*v+.04*M),_.scale.setScalar(1+.1*v+.05*M)}if(i.crest){const p=e?Ul(Math.max(f,.5*(d+m))+.25*(e.wideL+e.wideR)+.35*g*f):0,_=e?Ul(Math.max(.5*(h+u),.7*e.frown)):0,x=.42*p-.6*_+(e?0:.05*Math.sin(t*1.1)),M=e?.3*(d-m)+.25*(u-h):.03*Math.sin(t*.7);if(s&&(i.cx.x=x,i.cz.x=M,i.cy.x=0),i.head&&!s){const w=i.dq.copy(i.prev).invert().multiply(i.head.quaternion),S=w.w<0?-2:2;i.cx.x-=.9*w.x*S,i.cy.x-=.6*w.y*S,i.cz.x-=.9*w.z*S}i.head&&i.prev.copy(i.head.quaternion),N0(i.cx,x,r,11,.3),N0(i.cy,0,r,10,.3),N0(i.cz,M,r,11,.3),i.cx.x=Math.max(-1,Math.min(.8,i.cx.x)),i.cy.x=Math.max(-.5,Math.min(.5,i.cy.x)),i.cz.x=Math.max(-.6,Math.min(.6,i.cz.x)),i.crest.rotation.set(i.cx.x,i.cy.x,i.cz.x),i.crest.scale.set(1,1+.12*p-.08*_,1)}}const ud=[{name:"pelvis",a:[0,9.2,0],b:[0,10.4,0],parent:null},{name:"spine1",a:[0,10.4,0],b:[0,12.4,.1],parent:"pelvis"},{name:"spine2",a:[0,12.4,.1],b:[0,15.4,.2],parent:"spine1"},{name:"neck",a:[0,15.4,.2],b:[0,16.2,.3],parent:"spine2",reach:.9},{name:"head",a:[0,16.2,.3],b:[0,18.4,.6],parent:"neck"},{name:"jaw",a:[0,16.4,1.2],b:[0,16.4,1.6],parent:"head",reach:0},{name:"tail1",a:[0,9.2,-.5],b:[0,9,-1],parent:"pelvis",reach:0},{name:"tail2",a:[0,9,-1],b:[0,8.8,-1.5],parent:"tail1",reach:0},{name:"tail3",a:[0,8.8,-1.5],b:[0,8.6,-2],parent:"tail2",reach:0},{name:"tail4",a:[0,8.6,-2],b:[0,8.4,-2.5],parent:"tail3",reach:0},{name:"thighL",a:[2.1,9.2,0],b:[2.3,5.2,.3],parent:"pelvis"},{name:"shinL",a:[2.3,5.2,.3],b:[2.3,1.2,-.1],parent:"thighL"},{name:"footL",a:[2.3,1.2,-.1],b:[2.3,.4,1.8],parent:"shinL"},{name:"thighR",a:[-2.1,9.2,0],b:[-2.3,5.2,.3],parent:"pelvis"},{name:"shinR",a:[-2.3,5.2,.3],b:[-2.3,1.2,-.1],parent:"thighR"},{name:"footR",a:[-2.3,1.2,-.1],b:[-2.3,.4,1.8],parent:"shinR"},{name:"armL",a:[4.1,14.7,.2],b:[4.5,11.6,.4],parent:"spine2"},{name:"forearmL",a:[4.5,11.6,.4],b:[4.5,8.4,1],parent:"armL"},{name:"armR",a:[-4.1,14.7,.2],b:[-4.5,11.6,.4],parent:"spine2"},{name:"forearmR",a:[-4.5,11.6,.4],b:[-4.5,8.4,1],parent:"armR"}],W4={min:[-6.4,-.4,-4.4],max:[6.4,19.8,4]};function qe(n,t,e,i,s,r,a,o,c,l){const h=Math.abs(n-i)-a+l,u=Math.abs(t-s)-o+l,f=Math.abs(e-r)-c+l;return Math.hypot(Math.max(h,0),Math.max(u,0),Math.max(f,0))+Math.min(Math.max(h,u,f),0)-l}function Qp(n,t,e,i,s,r,a,o,c){const l=Math.abs(n-i)-a+c,h=Math.hypot(t-s,e-r)-o+c;return Math.hypot(Math.max(l,0),Math.max(h,0))+Math.min(Math.max(l,h),0)-c}function Z2(n,t,e,i,s,r,a,o){let c=n-i,l=t-s,h=e-r;const u=Math.cos(a),f=Math.sin(a);[c,h]=[c*u-h*f,c*f+h*u];const d=Math.cos(o),m=Math.sin(o);return[c,l]=[c*d+l*m,-c*m+l*d],[c,l,h]}const bn={hx:1.5,hy:14.6,hz:-2.15,yaw:.4,roll:.62,w:1.1,h:.85,t:.12};function X4(n,t,e){const[i,s,r]=Z2(n,t,e,bn.hx,bn.hy,bn.hz,bn.yaw,bn.roll);return qe(i,s,r,bn.w,bn.h,0,bn.w,bn.h,bn.t,.1)}function q4(n,t,e,i=0){const s=Math.abs(n);let r=1e9;{const a=qe(n,t,e,0,13.75,.25,2.9,1.75,1.75,.3),o=(e-(2-Math.max(0,t-13.4)*.6))*.86;r=Math.max(a,o)}return r=O(r,qe(n,t,e,0,12.2,.3,2.3,.6,1.5,.3),.3),r=Math.min(r,qe(n,t,e,0,12.55,1.95,2.5,.22,.28,.1)),r=Math.min(r,qe(s,t,e,2.2,13.1,1.92,.42,.26,.15,.08)),r=Math.min(r,qe(n,t,e,0,11.1,.75,1.15,.9,.55,.25)),r=O(r,qe(n,t,e,0,11,0,1.2,1,1.05,.3),.2),r=O(r,qe(n,t,e,0,9.75,0,2.2,.75,1.4,.3),.25),r=Math.min(r,qe(n,t,e,0,9.45,1.35,.7,.7,.25,.15)),r=Math.min(r,qe(n,t,e,0,13.5,-1.85,2.2,1.6,.55,.25)),r=Math.min(r,X4(s,t,e)),r=Math.min(r,K(n,t,e,0,15.3,.25,0,16.3,.35,.6,.55)),r=Math.min(r,qe(n,t,e,0,17.25,.45,.82,.92,.9,.35)),r=Math.min(r,qe(n,t,e,0,16.55,.95,.55,.38,.42,.18)),r=Math.min(r,qe(n,t,e,0,18.2,.35,.12,.35,.75,.08)),r=Math.min(r,qe(s,t,e,.95,17.55,.25,.12,.62,.3,.08)),r=Math.min(r,qe(s,t,e,4.05,15.05,.2,1.15,.8,1.35,.3)),r=Math.min(r,Qp(s,t,e,5.4,14.7,.2,.32,.92,.12)),r=Math.min(r,ve(s,t,e,4.1,14.4,.2,.75)),r=Math.min(r,K(s,t,e,4.1,14.2,.2,4.5,11.8,.4,.62,.58)),r=Math.min(r,ve(s,t,e,4.5,11.6,.4,.72)),r=Math.min(r,qe(s,t,e,4.55,10,.6,.9,1.5,1,.3)),r=Math.min(r,qe(s,t,e,4.55,8.05,1,.75,.75,.8,.28)),r=Math.min(r,K(s,t,e,2.1,9.1,0,2.3,5.6,.25,1.05,.95)),r=Math.min(r,qe(s,t,e,2.3,5.25,.85,.85,.75,.55,.25)),r=Math.min(r,qe(s,t,e,2.3,3,.05,1.25,2.15,1.35,.35)),r=Math.min(r,Qp(s,t,e,3.75,2.6,-.35,.3,.9,.12)),r=Math.min(r,qe(s,t,e,2.3,.5,.65,1.15,.5,2,.2)),r-i}function $4(n,t,e){const i=Math.abs(n);if(i>5&&Math.hypot(t-14.7,e-.2)<1)return Math.hypot(t-14.7,e-.2)<.42?1:5;if(i>3.38&&Math.hypot(t-2.6,e+.35)<.98)return Math.hypot(t-2.6,e+.35)<.4?1:5;if(t>16.95&&t<17.3&&e>1.2&&i>.12&&i<.62||t>12.85&&t<13.35&&e>1.95&&i>1.85&&i<2.6)return 2;if(t>13.55&&t<15.35&&i<2.55&&i>.18&&e>1.75-Math.max(0,t-13.4)*.6)return 4;if(t>16.15&&t<16.95&&e>1.25&&i<.6)return 6;if(e<-1.9&&t>13.8){const[s,r,a]=Z2(i,t,e,bn.hx,bn.hy,bn.hz,bn.yaw,bn.roll);if(Math.abs(a)<.3&&s>.25&&s<1.75&&r>.85&&r<1.5)return 4}return t>12.3&&t<12.8&&e>1.65||t>14.25&&t<15.9&&i>2.9&&i<5.15||t>4.5&&t<6&&e>.4&&i>1.4&&i<3.2||t<1.1&&e>1.6||t>17.9&&i<.2?1:Math.hypot(i-4.1,t-14.4,e-.2)<.85&&t<14.25||Math.hypot(i-4.5,t-11.6,e-.4)<.8||t>15.2&&t<16.2&&i<.7||t>10.2&&t<11.6&&e<1.25&&i<1.25?3:0}function Re(n,t,e,i,s,r,a,o,c,l){const h=Math.abs(n-i)-a+l,u=Math.abs(t-s)-o+l,f=Math.abs(e-r)-c+l;return Math.hypot(Math.max(h,0),Math.max(u,0),Math.max(f,0))+Math.min(Math.max(h,u,f),0)-l}const Y4={min:[-6.8,-.4,-4.6],max:[6.8,20.2,5]};function j4(n,t,e,i=0){const s=Math.abs(n);let r=1e9;r=Math.min(r,Re(n,t,e,0,13.6,.2,3.1,2.1,2,.5)),r=Math.min(r,ct(n,t,e,0,14.3,2.15,1.05,.7,.75)),r=Math.min(r,Re(n,t,e,0,12.4,2,.9,1,.4,.3)),r=Math.min(r,Re(s,t,e,1.7,15.6,-2.3,.18,2.4,1.1,.12)),r=Math.min(r,Re(n,t,e,0,13,-2.3,2.2,1.6,.6,.3)),r=O(r,Re(n,t,e,0,11.2,.1,1.9,1.1,1.35,.35),.3),r=O(r,Re(n,t,e,0,9.7,0,2.5,.95,1.55,.3),.3),r=Math.min(r,Re(n,t,e,0,9.4,1.4,.8,.9,.35,.2)),r=Math.min(r,K(n,t,e,0,15.3,.2,0,16.4,.3,.75,.7)),r=Math.min(r,Re(n,t,e,0,17.2,.4,1,1,1.1,.4)),r=Math.min(r,Re(n,t,e,0,16.6,1.25,.65,.45,.35,.15)),r=Math.min(r,Re(n,t,e,0,18.6,.3,.13,.75,.9,.08)),r=Math.min(r,K(s,t,e,.95,17.7,.4,1.5,18.5,.2,.2,.08)),r=Math.min(r,Re(s,t,e,4.2,15.4,.1,1.55,.85,1.7,.35)),r=Math.min(r,K(s,t,e,4.2,15.5,1.6,4.2,15.5,3.9,.3,.26)),r=Math.min(r,ve(s,t,e,4.1,14.4,.2,1)),r=Math.min(r,K(s,t,e,4.1,14.2,.2,4.5,11.8,.4,.85,.8)),r=Math.min(r,ve(s,t,e,4.5,11.6,.4,.9)),r=Math.min(r,Re(s,t,e,4.8,10,.6,1,1.7,1.3,.3)),r=Math.min(r,Re(s,t,e,5.85,10,.6,.22,1.8,1.35,.18)),r=Math.min(r,Re(s,t,e,4.75,7.9,1,.85,.85,.95,.3)),r=Math.min(r,K(s,t,e,2.1,9.1,0,2.3,5.8,.25,1.15,1.1)),r=Math.min(r,Re(s,t,e,2.3,5.4,.6,1.15,1.05,1,.3)),r=Math.min(r,Re(s,t,e,2.3,3,0,1.2,2,1.25,.3));for(const a of[3.8,1.9])r=Math.min(r,K(s,t,e,3.35,a,-.4,3.75,a,-.4,.75,.75));return r=Math.min(r,Re(s,t,e,2.3,.55,.65,1.15,.55,2,.2)),r-i}function Z4(n,t,e){const i=Math.abs(n),s=n>0;return t>13.7&&t<15&&e>1.6&&i<1.1||t>16.5&&t<17&&e>1.4&&i<.5&&i>.12?2:i>3.9&&i<4.5&&t>15.1&&t<15.9&&e>1.7||i>5.55&&t>8.2&&t<11.8||i>3.1&&t<4.6&&t>1.1&&e<.4||t>5.5&&t<6.3&&e>1.4&&i>1.3&&i<3.3||Math.hypot(i-4.1,t-14.4,e-.2)<1.05&&t<14.6||Math.hypot(i-4.5,t-11.6,e-.4)<.95&&t>11.3||t>10.7&&t<11&&i<2||t>8.6&&t<8.9&&i>1&&i<3.6?3:i>3.55&&t>6.4&&t<16.4||i>2.9&&t>11.4&&t<16.4?s?4:5:t<8.8&&i>.95?s?6:7:t>15.2||i>1.4&&i<2&&e<-1.2||t<11.3||e<-1.7?1:0}const J4={min:[-7.6,-.4,-6.6],max:[7.6,21,4.4]};function K4(n,t,e,i,s,r,a,o,c,l,h,u){const f=(s+o)/2;return K(n,f+(t-f)/u,e,i,s,r,a,o,c,l,h)*u}function Q4(n,t,e,i,s,r,a,o,c,l,h,u){const f=(i+a)/2;return K(f+(n-f)/u,t,e,i,s,r,a,o,c,l,h)*u}function tT(n,t,e,i=0){const s=Math.abs(n);let r=1e9;return r=Math.min(r,Re(n,t,e,0,13.7,.1,2.5,1.9,1.7,.6)),r=Math.min(r,ct(n,t,e,0,14.4,1.75,.95,.75,.85)),r=O(r,Re(n,t,e,0,11.4,0,1.5,1.2,1.15,.4),.4),r=O(r,Re(n,t,e,0,9.8,0,2.2,.85,1.35,.35),.3),r=Math.min(r,K(n,t,e,0,15.2,-2,0,10.8,-2.3,.75,.2)),r=Math.min(r,K4(s,t,e,1.4,13.6,-2.2,6.8,12.4,-5.6,1.9,.4,.17)),r=Math.min(r,Q4(s,t,e,1.5,14.2,-2.4,1.65,17.8,-3.7,.95,.22,.2)),r=Math.min(r,Re(s,t,e,3.4,15.2,.2,1.15,.9,1.5,.3)),r=Math.min(r,Re(s,t,e,3.4,16.4,-.1,.85,.45,1.1,.2)),r=Math.min(r,K(n,t,e,0,15.3,.1,0,16.3,.2,.6,.55)),r=Math.min(r,ct(n,t,e,0,17.1,.35,.85,1,1.15)),r=Math.min(r,K(s,t,e,.45,17.8,.6,1,19.4,-.9,.16,.05)),r=Math.min(r,ve(s,t,e,4.1,14.5,.2,.8)),r=Math.min(r,K(s,t,e,4.1,14.3,.2,4.5,11.8,.4,.65,.6)),r=Math.min(r,ve(s,t,e,4.5,11.6,.4,.7)),r=Math.min(r,Re(s,t,e,4.5,10,.6,.8,1.6,.85,.3)),r=Math.min(r,Re(s,t,e,4.5,8,.95,.6,.65,.6,.25)),r=Math.min(r,K(s,t,e,2.1,9.1,0,2.3,5.6,.25,1.1,1)),r=Math.min(r,Re(s,t,e,2.3,5.2,.7,.75,.65,.5,.25)),r=Math.min(r,K(s,t,e,2.3,4.8,-.1,2.3,1.7,-.3,1.25,1.15)),r=Math.min(r,K(s,t,e,2.3,1.6,-.6,2.3,1.1,-1.4,1,1.1)),r=Math.min(r,Re(s,t,e,2.3,.45,.9,.75,.45,1.5,.2)),r-i}function eT(n,t,e){const i=Math.abs(n);return t>13.8&&t<15.1&&e>1.2&&i<1||t>16.8&&t<17.4&&e>1&&i<.75?2:t<1.9&&e<-.9||Math.hypot(i-4.1,t-14.5,e-.2)<.85&&t<14.5||Math.hypot(i-4.5,t-11.6,e-.4)<.75||t>10.4&&t<10.8&&i<1.6?3:i>2.5&&i<4.3&&t>16&&t<16.9||e<-1.9&&i>1.5&&i<7&&Math.abs(t-(13.6-(i-1.4)*.22))<.3||t>12.6&&t<13&&i<2.3&&e>.8?4:i>3.6&&t<13.8&&t>7.2||t<5&&i>1?1:0}function $r(n){const t=!!n.mech,e=!!n.cape,i=n.tail??null;return(s,r,a,o)=>s.name.startsWith("thigh")?o>-1.6&&a<s.a[1]+(t?1.4:.8)&&Math.abs(Math.abs(r)-Math.abs(s.a[0]))<(a<s.a[1]+.3?t?1.45:1.3:t?1.4:.9):s.name.startsWith("tail")?i!==null?o<i:e&&o<-1.55:!t&&(s.name.startsWith("arm")||s.name.startsWith("forearm"))?Math.abs(r)>2&&o>-1.2:t&&s.name.startsWith("arm")?o>-1.5:!0}const nT=(n,t,e=2.2)=>n.std({color:t,emissive:t,emissiveIntensity:e,roughness:.3}),iT={id:"crimson",name:"Crimson",blurb:"A suited hero, visor and all",segs:$2,body:{sdf:(n,t,e)=>w4(n,t,e),region:(n,t,e)=>y4(n,t,e),box:M4,palette:[13114922,16053492,1052692,12633292],surface:"suit",capture:$r({})},dress(n){const t=n.std({color:526348,roughness:.08,metalness:.6});for(const e of[-1,1]){const i=new nt(new Ce(1,.38,.4),t);i.rotation.set(0,e*.42,e*-.32),n.at(i,"head",e*.46,17.12,1.12)}},fit:{size:1.08,limb:.7},face:{eyes:[[.46,17.12,1.35,.32],[-.46,17.12,1.35,.32]]}};$r({cape:!0});const sT=t2.map(n=>/^(arm|forearm)/.test(n.name)?{...n,reach:1.95}:n),rT={id:"howler",name:"Howler",blurb:"A wolf man with amber eyes",segs:sT,body:{sdf:(n,t,e)=>xS(n,t,e),region:Qf,box:pS,palette:Ll,capture:$r({tail:-1.5}),fur:{length:.8,density:7,tip:.22},furLen:e2},dress:yS,tick:ES,fit:{size:1.1,limb:.6},idle:{tail:.25},face:{jaw:.45,eyes:[[an[0],an[1],an[2]+.12,.3],[-.62,an[1],an[2]+.12,.3]]}},aT={id:"plume",name:"Plume",blurb:"A big, friendly, feathered bird",segs:S4,body:{sdf:(n,t,e)=>T4(n,t,e),region:Y2,box:E4,palette:[16036872,16770976,15224972,15762468],surface:"soft",capture:R4($r({tail:-2.4})),fur:{length:1.5,density:1.6,tip:.3,feather:!0},furLen:A4},dress:k4,tick:G4,fit:{size:1.12,limb:.5},idle:{tail:.15},face:{jaw:.5,eyes:[[Nn[0],Nn[1],Nn[2]+.45,.5],[-.72,Nn[1],Nn[2]+.45,.5]]}};function fd(n,t){return e=>{const i=nT(e,t);if(n==="bastion"){for(const a of[-1,1]){const o=new nt(new Ce(.42,.2,.1),i);o.rotation.z=a*-.12,e.at(o,"head",a*.36,17.12,1.36);const c=new nt(new Ce(.62,.36,.1),i);e.at(c,"spine2",a*2.2,13.1,2.08)}return}const s=n==="unison",r=new nt(new Wt(1,20,12),i);if(r.scale.set(s?.95:.85,s?.55:.6,s?.45:.35),e.at(r,"spine2",0,14.35,s?2.55:1.95),s)for(const a of[-1,1]){const o=new nt(new Ce(.42,.16,.1),i);o.rotation.z=a*.25,e.at(o,"head",a*.32,16.85,1.62)}else e.at(new nt(new Ce(1.3,.3,.12),i),"head",0,17.1,1.42);if(s){const a=e.std({color:14673130,roughness:.2,metalness:.9}),o=e.std({color:14198832,roughness:.3,metalness:.8}),c=new ue,l=new nt(new Ce(.22,8,.9),a);l.position.y=-4.5,c.add(l);const h=new nt(new ii(.64,1.4,4),a);h.rotation.z=Math.PI,h.position.y=-9.2,h.scale.set(.35,1,1),c.add(h),c.rotation.x=-.95;const u=new nt(new Ce(.5,.4,3),o);u.position.y=-.3,c.add(u);const f=new nt(new vn(.22,.22,1.6,8),o);f.position.y=.6,c.add(f),e.at(c,"forearmR",-4.75,8,2.1)}}}const oT={id:"bastion",name:"Bastion",blurb:"An armoured truck that stands up",segs:ud,body:{sdf:(n,t,e)=>q4(n,t,e),region:$4,box:W4,palette:[4871266,14262322,9431295,1842980,7118020,1316377,12896462],surface:"armour",weights:"rigid",capture:$r({mech:!0})},dress:fd("bastion",9431295),fit:{size:1,limb:.6},face:{eyes:[[.4,17.12,1.5,.28],[-.4,17.12,1.5,.28]]}},cT={id:"kestrel",name:"Kestrel",blurb:"A jet that stands up",segs:ud,body:{sdf:(n,t,e)=>tT(n,t,e),region:eT,box:J4,palette:[15132908,5661306,16756800,1842980,13117498],surface:"armour",weights:"rigid",capture:$r({mech:!0})},dress:fd("kestrel",16756800),fit:{size:1,limb:.6},face:{eyes:[[.36,17.12,1.56,.26],[-.36,17.12,1.56,.26]]}},lT={id:"unison",name:"Unison",blurb:"Five machines locked into one",segs:ud,body:{sdf:(n,t,e)=>j4(n,t,e),region:Z4,box:Y4,palette:[15527666,2503274,8382719,1842980,15234090,2271388,15254056,12855866],surface:"armour",weights:"rigid",capture:$r({mech:!0})},dress:fd("unison",8382719),fit:{size:1,limb:.6},face:{eyes:[[.34,16.9,1.72,.25],[-.34,16.9,1.72,.25]]}},fi=15.55,dd=[0,15.6,1.2],Ui=[1.26,16.95,3.8],J2=[1.4,17.55,2],K2=[.95,17.2,4.35],hT=[1.15,15.85,2.7],uT=[.45,15.85,6.3],Ri=[[0,9,-1.8],[.3,7,-4.6],[1.3,4.6,-7.2],[3,2.5,-9.4],[5.2,1.1,-11.2]],tm=[2.5,1.95,1.45,.95,.3],lf=[2.8,13.9,1.2],Vo=[4.35,12.4,1.8],di=[4.5,11,3.4],Ml=n=>[-n[0],n[1],n[2]],Q2=[{name:"pelvis",a:[0,9.2,-.4],b:[0,10.6,0],parent:null},{name:"spine1",a:[0,10.6,0],b:[0,12.6,.5],parent:"pelvis"},{name:"spine2",a:[0,12.6,.5],b:[0,14.4,.9],parent:"spine1"},{name:"neck",a:[0,14.4,.9],b:[0,16.4,1.2],parent:"spine2"},{name:"head",a:[0,16.4,1.2],b:[0,17.3,5.4],parent:"neck"},{name:"jaw",a:dd,b:[0,16.2,5],parent:"head",reach:0},{name:"tail1",a:Ri[0],b:Ri[1],parent:"pelvis"},{name:"tail2",a:Ri[1],b:Ri[2],parent:"tail1"},{name:"tail3",a:Ri[2],b:Ri[3],parent:"tail2"},{name:"tail4",a:Ri[3],b:Ri[4],parent:"tail3"},{name:"thighL",a:[2,9,.1],b:[2.2,5,.7],parent:"pelvis"},{name:"shinL",a:[2.2,5,.7],b:[2.3,1.5,-.1],parent:"thighL"},{name:"footL",a:[2.3,1.5,-.1],b:[2.4,.4,2.4],parent:"shinL"},{name:"thighR",a:[-2,9,.1],b:[-2.2,5,.7],parent:"pelvis"},{name:"shinR",a:[-2.2,5,.7],b:[-2.3,1.5,-.1],parent:"thighR"},{name:"footR",a:[-2.3,1.5,-.1],b:[-2.4,.4,2.4],parent:"shinR"},{name:"armL",a:lf,b:Vo,parent:"spine2"},{name:"forearmL",a:Vo,b:di,parent:"armL"},{name:"armR",a:Ml(lf),b:Ml(Vo),parent:"spine2"},{name:"forearmR",a:Ml(Vo),b:Ml(di),parent:"armR"},...fT()];function fT(){const n=[{name:"bridge",a:[0,17.2,1],b:[0,16.95,5.6],parent:"head",reach:1.3}];for(const[t,e]of[["L",1],["R",-1]]){const i=s=>[s[0]*e,s[1],s[2]];n.push({name:"brow"+t,a:i(J2),b:i(K2),parent:"head",reach:1},{name:"lip"+t,a:i(hT),b:i(uT),parent:"head",reach:1},{name:"crown"+t,a:i([.8,17.8,.6]),b:i([.45,17.85,2.6]),parent:"head",reach:1.3},{name:"cheek"+t,a:i([1.6,16.15,1.2]),b:i([1.3,16.3,3.1]),parent:"head",reach:1.3},{name:"snout"+t,a:i([.8,16.45,3.2]),b:i([.35,16.5,6]),parent:"head",reach:1.3})}return n}const dT=["browL","browR","lipL","lipR"],pT=["bridge","crownL","crownR","cheekL","cheekR","snoutL","snoutR"],em=(n,t,e)=>-O(-n,-t,e),pd=n=>Math.max(0,Math.min(1,n)),En=(n,t,e)=>{const i=pd((e-n)/(t-n));return i*i*(3-2*i)},Go=n=>1.5+(1.02-1.5)*pd((n-1.5)/4.5);function tv(n,t,e){const i=Math.abs(n);let s=ct(n,t,e,0,16.85,1.3,1.8,1.3,1.95);return s=O(s,K(n,t,e,0,15.8,1.5,0,15.75,6,1.5,1.02),.5),s=O(s,K(n,t,e,0,16.45,2,0,16.4,5.7,1.2,.9),.6),s=O(s,K(i,t,e,...J2,...K2,.56,.42),.35),s=O(s,ct(i,t,e,1.55,16.2,1.6,.82,.95,1.35),.4),s=O(s,ve(i,t,e,.5,16.95,5.75,.28),.2),s=em(s,-ve(i,t,e,Ui[0]+.08,Ui[1]-.02,Ui[2]+.08,.38),.1),em(s,Math.min(fi-t,e-dd[2]),.12)}function mT(n,t,e){const i=Math.abs(n);let s=K(n,t,e,0,15.25,1.5,0,15.2,5.6,1.38,.95);return s=O(s,ve(n,t,e,0,14.9,5.55,.78),.4),s=O(s,ct(n,t,e,0,14.75,2.6,1.25,.75,1.8),.5),s=O(s,K(i,t,e,1.1,15.3,1,1,15.3,3.2,.4,.35),.3),Math.max(s,t-fi)}const gT={min:[-1.8,13.7,-.1],max:[1.8,fi+.05,6.5]};function ev(n,t,e){let i=1e9;for(const s of[-1,0,1])i=Math.min(i,K(n,t,e,2.4+s*.95,.45,3.25+(s===0?.45:0),2.4+s*1.1,.12,4+(s===0?.55:0),.26,.05));for(const s of[-.32,0,.32])i=Math.min(i,K(n,t,e,di[0]+s,di[1]-.45,di[2]+.55,di[0]+s*1.5,di[1]-1.15,di[2]+1.25,.17,.035));return i}function nv(n,t,e){const[i,s,r]=lf,[a,o,c]=Vo,[l,h,u]=di;let f=K(n,t,e,i,s,r,a,o,c,.9,.72);return f=O(f,K(n,t,e,a,o,c,l,h,u,.7,.56),.3),O(f,ct(n,t,e,di[0],di[1]-.25,di[2]+.25,.58,.52,.62),.3)}function vT(n,t,e){const i=Math.abs(n);let s=ct(n,t,e,0,9.7,-.3,3,2.6,2.6);return s=Math.min(s,K(n,t,e,0,10.2,0,0,12.6,.5,2.75,2.55)),s=Math.min(s,K(n,t,e,0,12.6,.5,0,14.2,.7,2.55,2)),s=Math.min(s,ct(n,t,e,0,11.4,1.5,2.2,3,1.75)),s=Math.min(s,ct(i,t,e,1.65,13.9,.5,1.35,1.05,1.4)),s=Math.min(s,ve(i,t,e,2.05,8.6,-.1,2.2)),Math.min(s,K(i,t,e,2,9,.1,2.2,5,.7,1.95,1.55))}function iv(n,t,e){return O(K(n,t,e,0,14,.5,0,16.2,.95,2.05,1.7),ct(n,t,e,0,14.5,1.9,1.45,1,1.3),.6)}const nm=(n,t,e,i,s,r,a)=>{const o=n-i,c=t-s,l=e-r;return o*o+c*c+l*l<a*a};function sv(n,t,e){const i=Math.abs(n);let s=9;if(nm(n,t,e,0,12.4,.4,8.2)&&(s=ct(n,t,e,0,9.7,-.3,3,2.6,2.6),s=O(s,K(n,t,e,0,10.2,0,0,12.6,.5,2.75,2.55),1),s=O(s,K(n,t,e,0,12.6,.5,0,14.2,.7,2.55,2),.9),s=O(s,ct(n,t,e,0,11.4,1.5,2.2,3,1.75),.9),s=O(s,ct(i,t,e,1.65,13.9,.5,1.35,1.05,1.4),.8),s=O(s,iv(n,t,e),.9)),n*n<4&&e<1.5&&t>6.5&&t<19&&(s=O(s,K(n,t,e,0,16.2,-.3,0,12,-2,.45,.6),.6),s=O(s,K(n,t,e,0,12,-2,0,9.4,-3,.6,.55),.6)),t>13.4&&e>-1.6&&nm(n,t,e,0,16.6,3.25,6.5)&&(s=O(s,tv(n,t,e),.7)),e<1.6&&t<13.5&&n>-4.5&&n<7.6){const r=[1,.7,.5,.4];for(let a=0;a<4;a++){const o=Ri[a],c=Ri[a+1];s=O(s,K(n,t,e,o[0],o[1],o[2],c[0],c[1],c[2],tm[a],tm[a+1]),r[a])}}if(t<12.2&&i<6&&e>-4&&e<5.6){let r=ve(i,t,e,2.05,8.6,-.1,2.2);if(r=O(r,K(i,t,e,2,9,.1,2.2,5,.7,1.95,1.55),.6),r=O(r,ve(i,t,e,2.25,5.1,.85,1.45),.5),r=O(r,K(i,t,e,2.2,5,.7,2.3,1.5,-.1,1.45,1.3),.5),t<4.5&&(r=O(r,K(i,t,e,2.3,1.3,0,2.4,.75,2,1.25,.95),.5),r=O(r,ve(i,t,e,2.3,.9,-.6,.95),.4),e>.2))for(const a of[-1,0,1])r=O(r,K(i,t,e,2.4+a*.5,.75,1.8,2.4+a*.95,.5,3.25+(a===0?.45:0),.52,.36),.3);s=O(s,r,.8)}return i>1.2&&t>8.2&&t<15.8&&e>-1.3&&e<6.2&&(s=O(s,nv(i,t,e),.3)),(t<2&&e>2||i>3.2&&t>8.4&&t<12&&e>2.6)&&(s=Math.min(s,ev(i,t,e))),Math.max(s,-t)}const gi={skin:6317163,belly:8814703,ridge:2763823,claw:14867659,mouth:4854808,bone:13222576},xT=[gi.skin,gi.belly,gi.ridge,gi.claw,gi.mouth];function _T(n,t,e){const i=Math.abs(n);if(ev(i,t,e)<.06)return 3;if(e>dd[2]+.2&&e<5.6&&t<fi+.04&&t>fi-.12&&i<Go(e)-.45)return 4;if(e>1.9&&e<3.3&&t>14.75&&t<fi&&i<1||i<.9&&e<-.3&&t>9.4&&t<16.5&&e<-2.45+(t-9.4)*.3)return 2;const s=i/2.05,r=(t-11.1)/3.4;if(s*s+r*r<1&&e>1)return 1;const a=i/1.15,o=(t-14.2)/.75;return a*a+o*o<1&&e>2?1:0}const MT=new gt(gi.belly);function bT(n,t,e,i,s){if(n===1){const r=Math.abs(e*1.25%1-.5)*2;s.multiplyScalar(.8+.2*En(.15,.55,r))}else if(n===0){const r=En(0,-2.5,i)*En(6.5,12,e)+(i<-3?En(-.5,1,e-(9.4+i*.62)):0);s.multiplyScalar(1-.22*Math.min(1,r));const a=Math.abs(t)/2.05,o=(e-11.1)/3.4,c=a*a+o*o;i>.6&&c<1.5&&s.lerp(MT,.35*En(1.5,1,c))}}const Ma=[NaN,NaN,NaN],ba=[NaN,NaN,NaN];let im=!1,F0=0;const wT=(n,t,e,i)=>{const s=n.name;if(s.startsWith("thigh"))return t*n.a[0]>-.3&&i>-2&&e<n.a[1]+.6&&Math.abs(Math.abs(t)-Math.abs(n.a[0]))<(e<n.a[1]-.3?2.2:1.2);if(s.startsWith("tail"))return i<-2.7;if(s.startsWith("arm")||s.startsWith("forearm"))return t*n.a[0]<=0?!1:((t!==Ma[0]||e!==Ma[1]||i!==Ma[2])&&(Ma[0]=t,Ma[1]=e,Ma[2]=i,im=nv(Math.abs(t),e,i)<vT(t,e,i)+.1),im);const r=yT.has(s);return s==="head"||s==="neck"||r?r&&n.a[0]!==0&&t*Math.sign(n.a[0])<-.15?!1:((t!==ba[0]||e!==ba[1]||i!==ba[2])&&(ba[0]=t,ba[1]=e,ba[2]=i,F0=e>13.4&&i>-1.6?tv(t,e,i)-iv(t,e,i):9),s==="neck"?F0>-.25:F0<.25):!0},yT=new Set([...dT,...pT]),ST=[[0,16.6,1.1],[0,14.4,.9],[0,12.6,.5],[0,10.6,0],[0,9,-1],...Ri.slice(1)],Ka=["tail4","tail3","tail2","tail1","pelvis","spine1","spine2","neck"],md=3116543;function sm(n,t,e){const i=ST.map(o=>new C(...o)),s=i.slice(1).map((o,c)=>o.distanceTo(i[c])),r=s.reduce((o,c)=>o+c,0),a=[];for(let o=t*r;o<=e*r+1e-6;o+=n){let c=0,l=0;for(;c<s.length-1&&l+s[c]<o;)l+=s[c++];const h=(o-l)/s[c],u=i[c].clone().lerp(i[c+1],h),f=i[c+1].clone().sub(i[c]).normalize();c+2<i.length&&f.lerp(i[c+2].clone().sub(i[c+1]).normalize(),Math.max(0,h-.5)).normalize();const d=new C(0,.7,-.7);d.addScaledVector(f,-d.dot(f)).normalize();const m=new C().crossVectors(f,d).normalize();a.push({p:u,t:f,o:d,side:m,u:o/r})}return a}function ET(n,t){const e=n.clone().addScaledVector(t,6);for(let i=0;i<80;i++){const s=sv(e.x,e.y,e.z);if(s<.02)break;e.addScaledVector(t,-Math.max(.03,s*.8))}return e}function TT(n,t,e,i){const s=i-.5,r=[[.5,-.35],[.53,.1],[.52,.3],[.5,.47+.08*s],[.36,.42],[.31,.6-.06*s],[.2,.58],[.16,.8],[.06-.04*s,1],[-.06,.82],[-.12,.66],[-.24,.76+.08*s],[-.3,.56],[-.42,.6-.06*s],[-.46,.42],[-.55,.36+.05*s],[-.54,.12],[-.5,-.35]],a=new Xf(r.map(([d,m])=>new ft(d*t,m*n))),o=new _h(a,{depth:e,bevelEnabled:!0,bevelThickness:e*.45,bevelSize:Math.min(.13,t*.04),bevelSegments:1,steps:1,curveSegments:1});o.translate(0,0,-e/2);const c=o.getAttribute("position"),l=new Float32Array(c.count*3),h=new gt(gi.ridge),u=new gt(gi.bone),f=new gt;for(let d=0;d<c.count;d++){const m=c.getY(d)/n;c.setZ(d,c.getZ(d)*(1-.6*pd(m))),f.copy(h).lerp(u,En(-.05,.6,m)),l[d*3]=f.r,l[d*3+1]=f.g,l[d*3+2]=f.b}return o.setAttribute("color",new $t(l,3)),o.deleteAttribute("uv"),o.computeVertexNormals(),o}const AT=n=>2.4+1.8*En(0,.16,n)-1.9*En(.22,.68,n)-.95*En(.68,1,n);function RT(n){const t=new $e({color:16777215,vertexColors:!0,roughness:.6,metalness:.05,emissive:md,emissiveIntensity:0});return t.name=`kaiju-plate-${n}`,t.onBeforeCompile=e=>{e.fragmentShader=e.fragmentShader.replace("#include <emissivemap_fragment>",`#include <emissivemap_fragment>
 totalEmissiveRadiance *= 0.12 + 0.88 * smoothstep(0.08, 0.55, vColor.g);`)},t.customProgramCacheKey=()=>"kaiju-plate-v1",t}let ko=null;function CT(){if(ko)return ko;const n=document.createElement("canvas");n.width=n.height=64;const t=n.getContext("2d"),e=t.createRadialGradient(32,32,0,32,32,32);return e.addColorStop(0,"rgba(255,255,255,1)"),e.addColorStop(.2,"rgba(255,255,255,0.6)"),e.addColorStop(.5,"rgba(255,255,255,0.18)"),e.addColorStop(1,"rgba(255,255,255,0)"),t.fillStyle=e,t.fillRect(0,0,64,64),ko=new Yl(n),ko.colorSpace=gn,ko}function LT(n){let t=Ka[0],e=1/0;const i=new C;for(const s of Ka){const r=Q2.find(o=>o.name===s),a=new kM(new C(...r.a),new C(...r.b)).closestPointToPoint(n,!0,i).distanceTo(n);a<e&&(e=a,t=s)}return t}function PT(n){const t=new Map,e=new Map,i=(x,M,w,S)=>{const T=AT(x.u)*w;if(T<.35)return;const A=x.o.clone().addScaledVector(x.side,M*.55).normalize(),b=ET(x.p.clone().addScaledVector(x.side,M*.9),A),y=En(.42,.05,x.u),E=x.o.clone().addScaledVector(new C(0,1,0),(M?1.9:1.3)*y).addScaledVector(x.side,M*(.7+.6*y)).normalize(),R=new C().crossVectors(x.t,E).normalize(),P=new C().crossVectors(E,R).normalize();b.addScaledVector(E,-.4*Math.min(1,T/2));const I=TT(T,T*(.86+.1*S),Math.max(.12,.085*T+.05),S);I.applyMatrix4(new re().makeBasis(P,E,R).setPosition(b));const F=LT(b);if((t.get(F)??t.set(F,[]).get(F)).push(I),M===0){const H=e.get(F)??{p:new C,h:0,n:0};H.p.add(b.clone().addScaledVector(E,T*.4)),H.h+=T,H.n++,e.set(F,H)}};sm(1.55,.04,.985).forEach((x,M)=>i(x,0,1,M*.618%1)),sm(1.6,.035,.62).forEach((x,M)=>{for(const w of[-1,1])i(x,w,.6+.3*En(.3,.05,x.u),(M+(w>0?.5:0))*.382%1)}),Ka.forEach((x,M)=>{const w=t.get(x);if(!w)return;const S=On(w,!1);w.forEach(b=>b.dispose());const T=new nt(S,RT(M));T.name=`kaiju-plates-${x}`,n.at(T,x,0,0,0);const A=e.get(x);if(A){const b=new Hf({map:CT(),color:0,blending:Or,depthWrite:!1,transparent:!0,opacity:.9,toneMapped:!1});b.name=`kaiju-halo-${M}`,b.userData.keepBlend=!0;const y=new Mg(b);y.scale.setScalar(A.h/A.n*3),y.renderOrder=5;const E=A.p.divideScalar(A.n);n.at(y,x,E.x,E.y,E.z)}});const s=new gt(gi.belly).multiplyScalar(.8),r=sn(mT,gT,40,(x,M,w,S)=>{const T=Math.abs(x);M>fi-.1&&T<Go(w)-.5?S.setHex(gi.mouth):M<14.6&&T<.9?S.copy(s):S.setHex(gi.skin)},16e3),a=new nt(r,Zl());a.name="kaiju-jaw",n.at(a,"jaw",0,0,0);const o=n.std({color:15525588,roughness:.45}),c=[],l=[],h=new C(0,1,0),u=new C,f=(x,M,w,S)=>{u.set(-Math.sign(x)*UT,DT,w>6?-.42:0);const T=u.length();c.push(new vn(S*.42,S*.68,T,6).translate(0,T/2,0).applyQuaternion(new le().setFromUnitVectors(h,u.normalize())).translate(x,M-.1,w))};for(let x=0;x<7;x++)for(const M of[-1,1]){const w=2.3+x*.6,S=x===4?1.35:1;c.push(new ii(.15*S,.55*S,6).rotateX(Math.PI).translate(M*(Go(w)-.14),fi-.22*S,w)),f(M*(Go(w)-.14),fi+.055*S,w,.15*S),l.push(new ii(.12,.42,6).translate(M*(Go(w)-.45),fi+.14,w+.3))}for(const x of[-1,1])c.push(new ii(.13,.42,6).rotateX(Math.PI).translate(x*.32,fi-.17,6.75)),f(x*.32,fi+.04,6.75,.13);n.at(new nt(On(c),o),"head",0,0,0),n.at(new nt(On(l),o),"jaw",0,0,0);const d=new $e({color:793130,emissive:md,emissiveIntensity:0,roughness:.4});d.name="kaiju-core",d.onBeforeCompile=x=>{x.fragmentShader=x.fragmentShader.replace("#include <emissivemap_fragment>",`#include <emissivemap_fragment>
 float facing = abs(dot(normalize(normal), normalize(vViewPosition)));
 totalEmissiveRadiance *= 0.2 + 1.4 * facing * facing;`)},d.customProgramCacheKey=()=>"kaiju-core-v1";const m=new nt(new Wt(1,16,10),d);m.scale.set(.85,.7,.6),n.at(m,"head",0,15,3.2);const v=n.std({color:15769624,emissive:16742912,emissiveIntensity:1,roughness:.18}),g=n.std({color:657414,roughness:.3}),p=Zl(),_=new gt(gi.skin).multiplyScalar(.9);for(const x of[1,-1]){const M=x>0?"L":"R",w=new ue;w.name="kaiju-socket"+M,w.quaternion.copy(IT(x));const S=new ue;S.name="kaiju-eye"+M;const T=new nt(new Wt(.15,10,8),g);T.name="kaiju-pupil"+M,T.position.z=.24,T.scale.set(rv,1.3,.4),S.add(new nt(new Wt(.3,16,12),v),T);const A=Ec("kaiju-lids"+M,.3*rm,p,{gap:.1,tilt:x*.3});A.scale.setScalar(1/rm);for(const b of A.children){const y=b.geometry,E=y.getAttribute("position").count,R=new Float32Array(E*3);for(let P=0;P<E;P++)_.toArray(R,P*3);y.setAttribute("color",new $t(R,3))}w.add(S,A),n.at(w,"head",x*Ui[0],Ui[1],Ui[2])}}function IT(n){const t=new C(n*.6,.05,.8).normalize(),e=new C(0,1,0).cross(t).normalize(),i=new C().crossVectors(t,e);return new le().setFromRotationMatrix(new re().makeBasis(e,i,t))}const DT=.5,UT=.32,rm=2.3,rv=.35,am=new WeakMap,NT=new gt(md);function FT(n){const t=()=>({ball:null,pupil:null,up:null,lo:null,upOpen:0,upShut:0,loOpen:0,loShut:0,brow:null,lip:null,cheek:null,browRest:new C,lipRest:new C,cheekRest:new C}),e={side:[t(),t()],jaw:null};return n.traverse(i=>{i.isBone&&i.name==="jaw"&&(e.jaw=i);const s=/^(kaiju-eye|kaiju-pupil|kaiju-lids|brow|lip|cheek)([LR])$/.exec(i.name);if(!s)return;const r=e.side[s[2]==="L"?0:1];s[1]==="kaiju-eye"?r.ball=i:s[1]==="kaiju-pupil"?r.pupil=i:s[1]==="kaiju-lids"?(r.up=i.children[0]??null,r.lo=i.children[1]??null,ho(i,0,0,0),r.upOpen=r.up?.rotation.x??0,r.loOpen=r.lo?.rotation.x??0,ho(i,1,0,0),r.upShut=r.up?.rotation.x??0,r.loShut=r.lo?.rotation.x??0):i.isBone&&s[1]==="brow"?(r.brow=i,r.browRest.copy(i.position)):i.isBone&&s[1]==="lip"?(r.lip=i,r.lipRest.copy(i.position)):i.isBone&&s[1]==="cheek"&&(r.cheek=i,r.cheekRest.copy(i.position))}),e}const Nl=n=>Math.max(0,Math.min(1,n)),gs=(n,t,e)=>Nl((n-t)/(e-t)),kT=.2,av=.5,OT=.055,BT=new C(1,0,0),HT=new C(0,1,0),zT=new le,om={...uc};function VT(n,t,e,i){let s;if(e)s=e;else{const u=Math.floor(t/3.4),f=En(0,.25,t-u*3.4),d=m=>m%3===0?0:(Math.abs(Math.sin(m*91.7))*2-1)*.8;om.lookX=d(u-1)+(d(u)-d(u-1))*f,s=om}const r=t%5.2,a=r<.2?Math.sin(r/.2*Math.PI):0,o=e?gs(e.browUp,.1,.65):0,c=e?gs(e.sneer,.06,.5):0,l=e?Nl(e.jaw):0,h=e?gs(e.puff,.04,.4):0;e&&n.jaw&&n.jaw.quaternion.setFromAxisAngle(HT,e.jawSide*OT).multiply(zT.setFromAxisAngle(BT,e.jaw*av));for(let u=0;u<2;u++){const f=n.side[u],d=u===0?1:-1,m=u===0,v=e?gs(m?e.blinkL:e.blinkR,.15,.65):a,g=e?gs(m?e.squintL:e.squintR,.2,.7):0,p=e?gs(m?e.wideL:e.wideR,.08,.5):0,_=e?gs(m?e.browDownL:e.browDownR,.08,.55):0,x=e?gs(m?e.browOuterL:e.browOuterR,.08,.6):0,M=e?gs(m?e.smileL:e.smileR,.06,.7):0,w=Math.max(v,Nl(kT+.35*_+.3*g+.15*c-.6*p-.3*o-.2*x-.15*s.lookY)),S=Math.max(v,Nl(.45*g+.3*M));if(f.up){const T=f.upOpen-.3*p;f.up.rotation.x=T+(f.upShut-T)*w}if(f.lo&&(f.lo.rotation.x=f.loOpen+(f.loShut-f.loOpen)*S),f.ball&&Zf(f.ball,s,.45),f.pupil&&(f.pupil.scale.x=rv*(1+.9*p-.35*g)*(1-.3*i)),f.brow&&(f.brow.position.set(f.browRest.x+d*.06*_,f.browRest.y-.14*_+.12*o+.22*x-.04*c,f.browRest.z+.08*_),f.brow.rotation.x=.09*_-.07*o+.02*x+.04*c),f.lip){const T=Math.min(1.2,c+.25*l*l+.5*M);f.lip.position.set(f.lipRest.x+d*.06*T,f.lipRest.y+.3*T,f.lipRest.z+.03*T)}f.cheek&&f.cheek.position.set(f.cheekRest.x+d*.24*h,f.cheekRest.y-.04*h,f.cheekRest.z+.06*h)}}const GT={id:"kaiju",name:"Kaiju",blurb:"A city-stomper: open wide for atomic breath",segs:Q2,body:{sdf:sv,region:_T,box:{min:[-5,-.3,-12],max:[6,19,7.6]},palette:xT,surface:"scales",weights:"sharp",capture:wT,tint:bT},dress:PT,fit:{size:1.06,limb:.6,head:1},idle:{tail:.2},res:88,face:{jaw:av,eyes:[[Ui[0],Ui[1],Ui[2]+.3,.38],[-1.26,Ui[1],Ui[2]+.3,.38]],breath:{colors:[10479871,3844351,3844351,2060287,16777215],rate:3,speed:1.4,size:1}},tick(n,t,e){let i=am.get(n);const s=e?.jaw??0;if(!i){const l=Ka.map(()=>null),h=Ka.map(()=>null);let u=null;n.traverse(f=>{const d=f.material;if(!d||Array.isArray(d))return;const m=/^kaiju-plate-(\d)$/.exec(d.name),v=/^kaiju-halo-(\d)$/.exec(d.name);m&&(l[Number(m[1])]=d),v&&(h[Number(v[1])]=d),d.name==="kaiju-core"&&(u=d)}),i={plates:l,halos:h,core:u,charge:En(.15,.7,s),t,face:FT(n)},am.set(n,i)}const r=Math.max(0,Math.min(.1,t-i.t));i.t=t;const a=En(.15,.7,s);i.charge+=(a-i.charge)*(1-Math.exp(-r/(a>i.charge?.12:.3)));const o=i.charge,c=Ka.length;for(let l=0;l<c;l++){const h=l/(c-1),u=En(h*.45,h*.45+.5,o),f=1+.16*Math.sin(t*29+l*1.7)+.1*Math.sin(t*47+l*2.9)+.22*Math.max(0,Math.sin(t*11.3+l*.8)-.7)*3,d=i.plates[l],m=i.halos[l];d&&(d.emissiveIntensity=1.7*u*f,d.color.setRGB(1-.62*u,1-.5*u,1-.3*u)),m&&m.color.copy(NT).multiplyScalar(.75*u*f)}i.core&&(i.core.emissiveIntensity=2.6*o*(1+.2*Math.sin(t*37))),VT(i.face,t,e,o)}},Un=[2.5,14.55,0],nn=[2.95,11.95,-.05],ji=[3.12,9.6,.35],WT=[0,16.35,-.25],bl=n=>[-n[0],n[1],n[2]],ov=[{name:"pelvis",a:[0,9.6,0],b:[0,10.6,0],parent:null},{name:"spine1",a:[0,10.6,0],b:[0,12.4,.1],parent:"pelvis"},{name:"spine2",a:[0,12.4,.1],b:[0,15,.1],parent:"spine1"},{name:"neck",a:[0,15,.1],b:[0,15.9,.15],parent:"spine2"},{name:"head",a:[0,15.9,.15],b:[0,18.4,.3],parent:"neck"},{name:"jaw",a:WT,b:[0,15.55,1],parent:"head",reach:0},{name:"tail1",a:[0,10.4,-1],b:[0,9.6,-1.1],parent:"pelvis",reach:0},{name:"tail2",a:[0,9.6,-1.1],b:[0,8.8,-1.2],parent:"tail1",reach:0},{name:"tail3",a:[0,8.8,-1.2],b:[0,8,-1.3],parent:"tail2",reach:0},{name:"tail4",a:[0,8,-1.3],b:[0,7.2,-1.4],parent:"tail3",reach:0},{name:"thighL",a:[1.1,9.6,0],b:[1.2,5.3,.2],parent:"pelvis"},{name:"shinL",a:[1.2,5.3,.2],b:[1.2,1.1,-.1],parent:"thighL"},{name:"footL",a:[1.2,1.1,-.1],b:[1.2,.35,1.4],parent:"shinL"},{name:"thighR",a:[-1.1,9.6,0],b:[-1.2,5.3,.2],parent:"pelvis"},{name:"shinR",a:[-1.2,5.3,.2],b:[-1.2,1.1,-.1],parent:"thighR"},{name:"footR",a:[-1.2,1.1,-.1],b:[-1.2,.35,1.4],parent:"shinR"},{name:"armL",a:Un,b:nn,parent:"spine2"},{name:"forearmL",a:nn,b:ji,parent:"armL"},{name:"armR",a:bl(Un),b:bl(nn),parent:"spine2"},{name:"forearmR",a:bl(nn),b:bl(ji),parent:"armR"}],Oo=n=>ov.findIndex(t=>t.name===n),XT={min:[-4.3,-.45,-4.1],max:[4.3,17.3,3.9]},Sh=(n,t)=>[n[0]-t[0],n[1]-t[1],n[2]-t[2]],gd=n=>Math.hypot(n[0],n[1],n[2]),Rc=n=>{const t=gd(n)||1;return[n[0]/t,n[1]/t,n[2]/t]},Eh=(n,t)=>[n[1]*t[2]-n[2]*t[1],n[2]*t[0]-n[0]*t[2],n[0]*t[1]-n[1]*t[0]],sr=n=>n<0?0:n>1?1:n,Gs=(n,t,e)=>{const i=sr((e-n)/(t-n));return i*i*(3-2*i)},cv=(n,t,e)=>-O(-n,-t,e),ws=Rc(Sh(nn,Un)),Zi=gd(Sh(nn,Un)),Fl=Rc(Eh(ws,[0,0,1])),k0=Eh(ws,Fl),Zn=Rc(Sh(ji,nn)),Li=gd(Sh(ji,nn)),Jo=Rc(Eh(Zn,[0,0,1])),kl=Eh(Zn,Jo),Cr=14.3,Ol=13.45;function vd(n,t,e){if(t<9.9)return 10.1-t;if(t>17.2)return t-17;const i=Math.abs(n);if(i>3.3)return i-3.05;if(e>2)return e-1.6;if(e<-1.8)return-1.5-e;let s=ct(n,t,e,0,13.3,.05,1.5,1.85,.95);if(s=O(s,ct(i,t,e,.6,13.25,.5,.6,.52,.5),.35),s=O(s,ct(n,t,e,0,11.3,.05,1.16,1.2,.86),.7),t>13.3&&(s=O(s,K(i,t,e,0,15.02,-.14,2.2,14.62,-.06,.33,.36),.42),s=O(s,ve(i,t,e,Un[0],Un[1],Un[2],.45),.3),s=O(s,K(i,t,e,.2,14.78,.62,2.1,14.9,.22,.11,.1),.08),s=cv(s,-ve(n,t,e,0,14.92,.82,.16),.12),s=O(s,K(n,t,e,0,14.6,-.05,0,16.5,.05,.4,.36),.35),t<Cr+.1&&t>Ol-.1)){const r=sr((Cr-t)/(Cr-Ol)),a=Math.atan2(n,e),o=Math.abs(Math.cos(a)),c=1+.045*r*Math.cos(16*a),l=(1.18+.4*r)*c,h=(.82+.5*r*(.6+.4*o))*c,u=(Math.hypot(n/l,(e-.05)/h)-1)*Math.min(l,h);s=Math.min(s,Math.max(u,t-Cr,Ol-t))}return s}const Ra=[{top:11.35,bot:7.1,r0:[1.22,.98],r1:[2.02,1.78],n:15},{top:7.6,bot:3.75,r0:[1.9,1.62],r1:[2.62,2.32],n:19},{top:4.25,bot:.12,r0:[2.48,2.18],r1:[3.28,2.98],n:23}],_s=11.2,lv=n=>-.028*(11.3-n);function hv(n,t,e){if(t>11.8)return t-11.6;const i=Math.hypot(n,e);if(i>4.1)return i-3.95;const s=Math.atan2(n,e),r=lv(t);let a=Math.max((Math.hypot(n/1.36,(e-.05)/1.08)-1)*1.08,Math.abs(t-_s)-.28);for(const o of Ra){if(t>o.top+.4||t<o.bot-.4){a=Math.min(a,Math.max(t-o.top,o.bot-t));continue}const c=sr((o.top-t)/(o.top-o.bot)),l=Gs(.68,1,c),h=1+.065*l*Math.cos(o.n*s),u=.36*l*l,f=(o.r0[0]+(o.r1[0]-o.r0[0])*c+u)*h,d=(o.r0[1]+(o.r1[1]-o.r0[1])*c+u)*h,m=(Math.hypot(n/f,(e-r)/d)-1)*Math.min(f,d);a=Math.min(a,Math.max(m,t-o.top,o.bot-t))}return a}function uv(n,t,e){if(n<1.6)return 1.75-n;if(t>15.3)return t-15.15;if(t<8.7)return 8.9-t;if(n>4.4)return n-4.1;let i=K(n,t,e,Un[0],Un[1],Un[2],nn[0],nn[1],nn[2],.4,.36);const s=n-nn[0],r=t-nn[1],a=e-nn[2],o=(s*Zn[0]+r*Zn[1]+a*Zn[2])/Li,c=sr(o),l=s-Zn[0]*Li*c,h=r-Zn[1]*Li*c,u=a-Zn[2]*Li*c,f=Math.hypot(l,h,u),d=Gs(.3,1,c),m=Math.atan2(l*kl[0]+h*kl[1]+u*kl[2],l*Jo[0]+h*Jo[1]+u*Jo[2]),v=.34+.4*d*d*(1+.14*d*Math.cos(9*m));i=O(i,Math.max(f-v,-o*Li,(o-1)*Li),.22),i=Math.max(i,-Math.max(f-(v-.13),(.78-o)*Li));const g=n-Un[0],p=t-Un[1],_=e-Un[2],x=(g*ws[0]+p*ws[1]+_*ws[2])/Zi;if(x>.05&&x<.46){const M=g-ws[0]*Zi*x,w=p-ws[1]*Zi*x,S=_-ws[2]*Zi*x,T=sr((x-.14)/.24),A=Math.atan2(M*k0[0]+w*k0[1]+S*k0[2],M*Fl[0]+w*Fl[1]+S*Fl[2]),b=(.47+.3*T)*(1+.07*T*Math.cos(10*A));i=Math.min(i,Math.max(Math.hypot(M,w,S)-b,(.14-x)*Zi,(x-.38)*Zi))}return i}function qT(n,t,e){return Math.min(vd(n,t,e),hv(n,t,e),uv(Math.abs(n),t,e))}const Ca=0,hf=1,fv=2,Jn=new Float64Array(3);let cm=NaN,lm=NaN,hm=NaN,sh=0;function xd(n,t,e){if(n===cm&&t===lm&&e===hm)return sh;Jn[Ca]=vd(n,t,e),Jn[hf]=hv(n,t,e),Jn[fv]=uv(Math.abs(n),t,e);let i=0;for(let s=1;s<3;s++)Jn[s]<Jn[i]&&(i=s);return cm=n,lm=t,hm=e,sh=i,i}const $T=.2,mr=n=>Jn[n]<=Jn[sh]+$T,YT=(n,t,e,i)=>{xd(t,e,i);const s=n.name,r=s.endsWith("L")?1:s.endsWith("R")?-1:0,a=Math.abs(t);return r!==0&&t*r<-.05?!1:s.startsWith("arm")||s.startsWith("forearm")?sh===fv:s==="pelvis"?mr(hf)||mr(Ca)&&e<11.6:s==="spine1"?mr(hf)&&e>9.8||mr(Ca)&&e<13.2:s==="spine2"?mr(Ca):s==="neck"?mr(Ca)&&e>14.5&&a<1.1:s==="head"?mr(Ca)&&e>15.8&&a<.9:!1},jT=(n,t,e)=>xd(n,t,e);function ZT(n,t,e,i,s){const r=xd(t,e,i),a=Math.exp(-(Jn[0]-Jn[r])/.08),o=Math.exp(-(Jn[1]-Jn[r])/.08),c=Math.exp(-(Jn[2]-Jn[r])/.08),l=a+o+c;s.setRGB(a/l,o/l,c/l)}const gr=n=>`vec3(${n.map(t=>t.toFixed(5)).join(", ")})`,JT=`
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
    float bot = ${Ol.toFixed(2)} - scallop(th * 1.3, 0.3, 0.1);
    c = mix(c, lace(p, black(), laceInk(), w), inside(bot - p.y, w));
    // the bare bone: a soft shade down toward the frill, under each collarbone and in the notch between them
    vec3 b = bone() * mix(0.8, 1.0, smoothstep(${Cr.toFixed(2)}, ${(Cr+.45).toFixed(2)}, p.y));
    float front = smoothstep(0.0, 0.35, n.z);
    float clav = segment2(vec2(ax, p.y), vec2(0.22, 14.79), vec2(2.08, 14.91));
    b *= 1.0 - 0.18 * smoothstep(0.26, 0.08, clav) * front;
    b *= 1.0 - 0.3 * smoothstep(0.22, 0.0, length(vec2(p.x, p.y - 14.9))) * front;
    // the collarbones drawn as the face is painted: a soft grey line round each, the bone's knob at the shoulder
    vec3 ink = srgb(0.42, 0.4, 0.44);
    b = mix(b, ink, 0.75 * inside(abs(clav - 0.12) - 0.014, w) * front * step(0.24, ax));
    c = mix(c, b, inside(${(Cr+.02).toFixed(2)} - p.y, w));
    return c;
  }

  vec3 skirtCol(vec3 p, vec3 n, float w) {
    float th = atan(p.x, p.z);
    float arc = th * length(p.xz);
    // the tier that shows here, its colour, its trim's, and how far up from its hem
    vec3 base, trim; float e;
    if (p.y > ${(Ra[0].bot-.03).toFixed(2)}) { base = red(); trim = black(); e = p.y - ${Ra[0].bot.toFixed(2)}; }
    else if (p.y > ${(Ra[1].bot-.03).toFixed(2)}) { base = black(); trim = red(); e = p.y - ${Ra[1].bot.toFixed(2)}; }
    else { base = purple(); trim = black(); e = p.y - ${Ra[2].bot.toFixed(2)}; }
    // gathered: fine pleats shading the cloth
    vec3 c = base * (0.9 + 0.1 * cos(th * 56.0));
    // the trim: a lace band with a scalloped top along each ruffle's hem
    float top = 0.62 + scallop(arc, 0.42, 0.13);
    vec3 t = trim == black() ? lace(p, black(), laceInk(), w) : trim;
    c = mix(c, t, inside(e - top, w));
    // a thin marigold piping at the very hem of each tier
    c = mix(c, marigold(), inside(abs(e - 0.07) - 0.035, w));
    // the sash: purple satin, a marigold stripe along each edge
    float sa = abs(p.y - ${_s.toFixed(2)});
    c = mix(c, purple() * 1.15, inside(sa - 0.3, w));
    c = mix(c, marigold(), inside(abs(sa - 0.22) - 0.035, w));
    // the underside of a ruffle is in its own shade
    c *= mix(1.0, 0.35, smoothstep(-0.2, -0.6, n.y));
    return c;
  }

  vec3 armCol(vec3 p, vec3 n, float w) {
    vec3 q = vec3(abs(p.x), p.y, p.z);
    vec3 nn = vec3(sign(p.x) * n.x, n.y, n.z);
    float tu = dot(q - ${gr(Un)}, ${gr(ws)}) / ${Zi.toFixed(5)};
    vec3 fo = q - ${gr(nn)};
    float tf = dot(fo, ${gr(Zn)}) / ${Li.toFixed(5)};
    vec3 radial = fo - ${gr(Zn)} * ${Li.toFixed(5)} * clamp(tf, 0.0, 1.0);
    float ph = atan(dot(radial, ${gr(kl)}), dot(radial, ${gr(Jo)}));
    vec3 c = red();
    // the bell cuff in black lace from mid-forearm, its top scalloped, a marigold piping at its rim
    float cuffTop = 0.42 - scallop(ph * 0.5, 0.35, 0.09);
    c = mix(c, lace(p, black(), laceInk(), w), inside(cuffTop - tf, w / ${Li.toFixed(3)}));
    c = mix(c, marigold(), inside(abs(tf - 0.965) - 0.018, w / ${Li.toFixed(3)}));
    // inside the open cuff: dark
    c = mix(c, black() * 0.4, step(0.75, tf) * smoothstep(0.1, -0.3, dot(nn, normalize(radial))));
    // the frill at the top of the sleeve, scalloped along its hem, and the bare shoulder above it
    float ub = 0.39 + scallop(ph * 0.5, 0.35, 0.06) / ${Zi.toFixed(3)};
    c = mix(c, lace(p, black(), laceInk(), w), inside(tu - ub, w / ${Zi.toFixed(3)}));
    c = mix(c, bone(), inside(tu - 0.14, w / ${Zi.toFixed(3)}));
    return c;
  }

  vec3 gown(vec3 p, vec3 n, vec3 k, float w) {
    vec3 c = vec3(0.0);
    if (k.x > 0.001) c += torsoCol(p, n, w) * k.x;
    if (k.y > 0.001) c += skirtCol(p, n, w) * k.y;
    if (k.z > 0.001) c += armCol(p, n, w) * k.z;
    return c / max(1e-4, k.x + k.y + k.z);
  }`;function KT(){const n=new $e({vertexColors:!0,roughness:.62,metalness:0});return n.onBeforeCompile=t=>{t.vertexShader=t.vertexShader.replace("#include <common>",`#include <common>
 varying vec3 vBind; varying vec3 vBindN;`).replace("#include <begin_vertex>",`#include <begin_vertex>
 vBind = position; vBindN = normal;`),t.fragmentShader=t.fragmentShader.replace("#include <common>",`#include <common>
`+JT).replace("#include <color_fragment>",`#include <color_fragment>
        float pw = max(length(fwidth(vBind)) * 0.6, 1e-4);
        // the vertex colour is the parts' weights (partTint), not a colour
        diffuseColor.rgb = gown(vBind, normalize(vBindN), diffuseColor.rgb, pw);`)},n.customProgramCacheKey=()=>"catrina-cloth-v4",n}const dv=1.32,pv=-.1,_d=(n,t)=>dv*Math.atan2(n,t-pv),rh=n=>{const t=Math.min(Math.abs(n),.95)/.7;return 16.08+.07*t*t},Ki=[.42,17,1.18];function Th(n,t,e){const i=Math.abs(n);let s=ct(n,t,e,0,17.42,-.08,1.02,1.1,1.22);return s=O(s,ct(n,t,e,0,16.85,-.38,.9,.6,.85),.3),s=O(s,ct(n,t,e,0,16.75,.45,.82,.88,.78),.35),s=O(s,ct(i,t,e,.66,16.68,.72,.3,.28,.42),.25),s=O(s,ct(n,t,e,0,16,.5,.68,.5,.62),.35),s=O(s,ct(n,t,e,0,15.68,.82,.3,.22,.28),.25),s=cv(s,-ct(i,t,e,Ki[0],Ki[1],Ki[2],.3,.28,.22),.1),s}const mv=(n,t,e)=>Math.max(t-rh(_d(n,e)),-.05-e),QT=(n,t,e)=>Math.max(Th(n,t,e),-mv(n,t,e)),tA=(n,t,e)=>Math.max(Th(n,t,e),mv(n,t,e)),eA=new gt(16052200),nA=new gt(1705480);function um(n,t,e,i){const s=Th(n,t,e)<-.025&&Math.abs(t-rh(_d(n,e)))<.06;i.copy(s?nA:eA)}const iA=`
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
    float u = ${dv.toFixed(3)} * atan(p.x, p.z - (${pv.toFixed(3)})), v = p.y, au = abs(u);
    vec2 f = vec2(u, v);
    vec3 c = base;
    const float TAU = 6.2831853, N = 10.0;
    // a ring of petals round each socket, shorter toward the nose, a dot past each tip
    vec2 q = vec2(au - ${Ki[0].toFixed(3)}, v - ${Ki[1].toFixed(3)});
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
  }`;function sA(n){const t=n.std({name:"catrina-face",color:16777215,vertexColors:!0,roughness:.42,metalness:0,emissive:16777215,emissiveIntensity:.14});return t.onBeforeCompile=e=>{e.vertexShader=e.vertexShader.replace("#include <common>",`#include <common>
 varying vec3 vBind;`).replace("#include <begin_vertex>",`#include <begin_vertex>
 vBind = position;`),e.fragmentShader=e.fragmentShader.replace("#include <common>",`#include <common>
`+iA).replace("#include <color_fragment>",`#include <color_fragment>
        float fw = max(length(fwidth(vBind)) * 0.6, 1e-4);
        float skin = smoothstep(0.25, 0.6, diffuseColor.r);
        diffuseColor.rgb = mix(diffuseColor.rgb, paint(diffuseColor.rgb, vBind, fw), skin);`).replace("#include <emissivemap_fragment>",`#include <emissivemap_fragment>
 totalEmissiveRadiance *= diffuseColor.rgb;`)},t.customProgramCacheKey=()=>"catrina-face-v2",t}const vc=n=>new C(n[0],n[1],n[2]);let Bl=1;const Lr=()=>(Bl=Bl*1664525+1013904223>>>0,Bl/4294967296);function je(n,t){const e=n.index?n.toNonIndexed():n;e!==n&&n.dispose(),e.deleteAttribute("uv"),e.attributes.normal||e.computeVertexNormals();const i=e.attributes.position,s=i.count,r=new Float32Array(s*3),a=new gt;for(let o=0;o<s;o++)typeof t=="function"?(a.setRGB(1,1,1),t(i.getX(o),i.getY(o),i.getZ(o),a)):a.set(t),r[o*3]=a.r,r[o*3+1]=a.g,r[o*3+2]=a.b;return e.setAttribute("color",new $t(r,3)),e}function Kn(n){const t=On(n,!1);for(const e of n)e.dispose();return t}function gv(n,t){const e=vc(t).sub(vc(n)).normalize(),i=new C(1,0,0).addScaledVector(e,-e.x);i.lengthSq()<1e-6&&i.set(0,0,1),i.normalize();const s=new C().crossVectors(i,e);return new re().makeBasis(i,e,s).setPosition(n[0],n[1],n[2])}function Pr(n,t,e=[1,1,1],i=10){return new Wt(t,i,Math.max(5,Math.round(i*.7))).scale(e[0],e[1],e[2]).translate(n[0],n[1],n[2])}function vr(n,t,e,i,s){const r=vc(t).distanceTo(vc(n)),a=2,o=5,c=[];for(let h=0;h<=a;h++){const u=-Math.PI/2+h/a*(Math.PI/2);c.push(new ft(Math.max(.001,e*Math.cos(u)),e*.75*Math.sin(u)))}const l=Math.min(.2,1.3*Math.max(e,s)/r);for(let h=1;h<o;h++){const u=h/o;c.push(new ft(i+(e-i)*Math.exp(-((u/l)**2))+(s-i)*Math.exp(-(((1-u)/l)**2)),u*r))}for(let h=0;h<=a;h++){const u=h/a*(Math.PI/2);c.push(new ft(Math.max(.001,s*Math.cos(u)),r+s*.75*Math.sin(u)))}return new Bi(c,6).applyMatrix4(gv(n,t))}function rA(n,t){const e=gv(n,[n[0]+t[0],n[1]+t[1],n[2]+t[2]]),i=1.42,s=(u,f,d)=>{const m=new C(u*i,f*i,d*i).applyMatrix4(e);return[m.x,m.y,m.z]},r=[];for(const[u,f,d]of[[0,.1,.14],[0,.1,-.02],[0,.1,-.18],[.02,.3,.18],[.02,.3,0],[.02,.3,-.16]])r.push(Pr(s(u,f,d),.13,[1,1,1],7));const a=[[.2,1.05],[.07,1.14],[-.07,1.06],[-.19,.88]];for(const[u,f]of a){const d=s(.02,.4,u*.85),m=s(0,.4+.55*f,u),v=s(-.07,.4+.93*f,u*1.05),g=s(-.16,.4+1.17*f,u*1.08),p=s(-.26,.4+1.33*f,u*1.08);r.push(vr(d,m,.1,.07,.105),vr(m,v,.1,.066,.095),vr(v,g,.09,.06,.082),vr(g,p,.078,.055,.06))}const o=s(0,.25,.24),c=s(-.05,.6,.46),l=s(-.1,.88,.56),h=s(-.16,1.08,.6);return r.push(vr(o,c,.11,.08,.1),vr(c,l,.1,.072,.088),vr(l,h,.088,.064,.06)),r}const fm=[16747008,16753178,15888896,16758320,15229952].map(n=>new gt(n));function uf(n){const t=[],i=new re;for(let s=0;s<34;s++){const r=(s+.5)/34,a=Math.acos(1-r*1.2),o=s*2.39996+Lr()*.3,c=new C(Math.sin(a)*Math.cos(o),Math.cos(a),Math.sin(a)*Math.sin(o)),l=new C(-Math.sin(o),0,Math.cos(o)),h=new C().crossVectors(l,c);i.makeBasis(l,c,h).setPosition(c.clone().multiplyScalar(n*.62));const u=new Wt(1,6,4).scale(.08*n,.38*n,.26*n).applyMatrix4(i),f=fm[Math.floor(Lr()*fm.length)].clone().multiplyScalar(.8+.2*Math.sin(a));t.push(je(u,f))}return t.push(je(new Wt(n*.6,10,7),14178816)),Kn(t)}function vv(n,t=11538464){const r=[],a=(u,f)=>{const d=u/72,m=d*2.7*Math.PI*2,v=n*(.1+.62*d),g=1-.22*Math.abs(Math.sin(m*1.25)),p=n*(-.08-.3*d),_=n*(.42-.14*d)*g,x=f/2,M=p+(_-p)*x,w=v*(.82+.18*x+.4*d*x*x);return[Math.cos(m)*w,M,Math.sin(m)*w]};for(let u=0;u<72;u++)for(let f=0;f<2;f++){const d=a(u,f),m=a(u+1,f),v=a(u+1,f+1),g=a(u,f+1);r.push(...d,...m,...v,...d,...v,...g)}const o=new xe;o.setAttribute("position",new ie(r,3)),o.computeVertexNormals();const c=new gt(t),l=c.clone().multiplyScalar(.45),h=[je(o,(u,f,d,m)=>m.copy(l).lerp(c,sr(Math.hypot(u,d)/(n*.5))*.6+sr((f+.2*n)/(.6*n))*.4))];return h.push(je(Pr([0,-.12*n,0],n*.42,[1,.6,1],10),l)),Kn(h)}function aA(n,t,e){const i=[];for(let s=0;s<5;s++){const r=s/5*Math.PI*2;i.push(je(new Wt(1,7,4).scale(n*.5,n*.12,n*.32).translate(n*.5,0,0).rotateY(r),t))}return i.push(je(Pr([0,.05*n,0],n*.22,[1,.7,1],8),e)),Kn(i)}function ff(n){const t=new Wt(1,8,5).scale(n*.22,n*.03,n*.5),e=t.attributes.position;for(let i=0;i<e.count;i++){const s=e.getZ(i)/(n*.5);e.setX(i,e.getX(i)*(1-.55*Math.max(0,s))),e.setY(i,e.getY(i)+.05*n*s*s)}return t.computeVertexNormals(),je(t.translate(0,0,n*.45),3107372)}function dm(n,t,e,i,s=54){const r=new vi(n.map(vc)),a=[je(new Cs(r,24,.035,4,!1),e)],o=new gt(e),c=new gt(i),l=new C(0,-1,0);for(let h=0;h<s;h++){const u=.05+.95*(h/s),f=r.getPoint(u),d=r.getTangent(u),m=new C().crossVectors(d,new C(0,1,0));m.lengthSq()<1e-4&&m.set(1,0,0),m.normalize();const v=t*(.3+.7*Math.pow(Math.sin(Math.PI*Math.min(1,u*1.1)),.6));for(const g of[-1,1])for(let p=0;p<2;p++){const _=m.clone().multiplyScalar(g).addScaledVector(l,.35+.3*p+.2*u).addScaledVector(d,.35).normalize();_.x+=(Lr()-.5)*.3,_.y+=(Lr()-.5)*.3,_.z+=(Lr()-.5)*.3,_.normalize();const x=v*(.75+.35*Lr())*(p?.8:1),M=new ii(.05,x,3,1).translate(0,x/2,0);M.applyQuaternion(new le().setFromUnitVectors(new C(0,1,0),_)).translate(f.x,f.y,f.z),a.push(je(M,(w,S,T,A)=>A.copy(o).lerp(c,sr(Math.hypot(w-f.x,S-f.y,T-f.z)/x))))}}return Kn(a)}const O0=2.7,Ms=1.1;function oA(){const n=[];for(let s=0;s<=6;s++){const r=s/6;n.push(new ft(Ms-.07*r,.7*r))}for(let s=1;s<=8;s++){const r=s/8*Math.PI/2;n.push(new ft(Math.max(.001,(Ms-.07)*Math.cos(r)),.7+.42*Math.sin(r)))}const t=[];for(let s=0;s<=14;s++){const r=s/14,a=Ms-.02+r*(O0-Ms);t.push(new ft(a,-.06*Math.sin(Math.PI*r)+.26*r**4))}const e=Kn([je(new Bi(n,48),1577500),je(new Bi(t,64),1577500),je(new kn(O0,.06,6,96).rotateX(Math.PI/2).translate(0,.26,0),2365994)]),i=e.attributes.position;for(let s=0;s<i.count;s++){const r=i.getX(s),a=i.getZ(s),o=Math.hypot(r,a);if(o>Ms){const c=(o-Ms)/(O0-Ms);i.setY(s,i.getY(s)+.1*c*c*Math.sin(3*Math.atan2(r,a)+.6))}}return e.computeVertexNormals(),e}function B0(n,t,e,i,s=.75,r=0){const a=t*Math.PI/180,o=new C(Math.sin(a),0,Math.cos(a)),c=o.clone().multiplyScalar(s).add(new C(0,1,0)).normalize();return n.rotateY(r),n.applyQuaternion(new le().setFromUnitVectors(new C(0,1,0),c)),n.translate(o.x*e,i,o.z*e)}function cA(){const n=[],t=[[35,1.32,.62,.62,1.6],[72,1.26,.82,.58,1.6],[104,1.3,.52,.5,1.8],[6,1.36,.5,.46,1.8],[50,.9,1.18,.52,.8],[-150,1.3,.55,.5,1.6],[-118,1.36,.45,.4,1.8],[56,2.3,.3,.46,1.2]];for(const[s,r,a,o,c]of t)n.push(B0(uf(o),s,r,a,c));const e=[[18,1.25,.98,.42,1.2],[92,1.05,1.12,.42,1],[54,1.62,.36,.46,1.6],[-14,1.38,.78,.36,1.5],[128,1.42,.45,.4,1.8],[-172,1.38,.62,.44,1.6],[28,2.28,.26,.38,1.2],[-36,1,1.1,.34,.8]];for(const[s,r,a,o,c]of e)n.push(B0(vv(o),s,r,a,c,Lr()*6));const i=[[-28,1.3,.45,.26,14690426],[116,1.18,.95,.26,16051450],[78,1.62,.36,.26,14690426],[-138,1.22,.9,.26,10107592],[0,1.1,1.06,.24,16051450],[40,2.4,.2,.22,14690426],[150,1.35,.5,.24,10107592]];for(const[s,r,a,o,c]of i)n.push(B0(aA(o,c,16765498),s,r,a,1.4));for(const[s,r,a,o,c]of[[30,2.2,.25,1,.2],[90,2,.35,.95,-.3],[125,2,.3,.85,.4],[-160,2,.3,.85,.2],[-5,2,.3,.8,-.4],[60,2.5,.2,.8,-.3]]){const l=s*Math.PI/180;n.push(ff(o).rotateX(-.35).rotateY(l+c).translate(Math.sin(l)*r*.62,a,Math.cos(l)*r*.62))}return Kn(n)}function lA(){return Kn([dm([[1,.6,-.35],[1.25,1.7,-.45],[.95,2.55,-1.05],[.35,2.75,-1.9],[-.05,2.35,-2.55]],.7,16447218,15784172,60),dm([[1.25,.5,.05],[1.85,1.45,-.15],[2.45,1.95,-.7],[2.85,1.7,-1.35]],.5,13641856,9050762,44)])}function hA(n,t){let e=0,i=2;for(let s=0;s<30;s++){const r=(e+i)/2;Th(n,t,r)<0?e=r:i=r}return e}function uA(n,t){let e=0,i=2;for(let s=0;s<26;s++){const r=(e+i)/2;vd(n[0]+t[0]*r,n[1]+t[1]*r,n[2]+t[2]*r)<0?e=r:i=r}return e}const H0=[.05,18.15,-.05],fA=new Tn(-.14,.15,.1);function dA(n){Bl=11;const t=n.bones.get("pelvis").parent;if(t?.isSkinnedMesh){const M=t.geometry,w=M.attributes.position,S=M.attributes.color,T=M.attributes.skinIndex,A=M.attributes.skinWeight,b=Oo("pelvis"),y=Oo("thighL"),E=Oo("thighR"),R=Oo("armL"),P=Oo("armR");for(let I=0;I<w.count;I++){const F=w.getX(I),H=w.getY(I),$=w.getZ(I),B=Math.abs(F),Y=S.getX(I)+S.getY(I)+S.getZ(I)||1,it=S.getX(I)/Y;if(S.getY(I)/Y>.5&&H<10.5){const vt=lv(H),Ct=.42*Gs(-.3,.9,($-vt)/Math.max(.5,Math.hypot(F,$-vt)))*Gs(10.4,6.8,H)*(1-.55*Gs(5.5,1,H)),Ut=Gs(-.9,.9,F);T.setXYZW(I,b,y,E,0),A.setXYZW(I,1-Ct,Ct*Ut,Ct*(1-Ut),0)}else if(it>.5&&H>13.8&&B>1.25){const vt=Gs(1.25,2.3,B)*Gs(13.8,14.35,H);vt>0&&(T.setZ(I,F>0?R:P),A.setXYZW(I,A.getX(I)*(1-vt),A.getY(I)*(1-vt),vt,0))}}T.needsUpdate=!0,A.needsUpdate=!0,t.material.dispose(),t.material=KT()}const e=(M,w,S,T)=>{const A=new nt(M,S);return A.name=T,n.at(A,w,0,0,0),A},i=(M,w,S,T)=>{for(const A of["L","R"]){const b=new nt(M,S);b.name=`${T}${A}`,A==="R"&&(b.scale.x=-1),n.at(b,w+A,0,0,0)}},s=sA(n);e(sn(QT,{min:[-1.12,15.8,-1.42],max:[1.12,18.6,1.4]},54,um,5e4),"head",s,"catrina-skull"),e(sn(tA,{min:[-.92,15.38,-.12],max:[.92,16.3,1.38]},34,um,16e3),"jaw",s,"catrina-jaw");const r=n.std({color:16183522,roughness:.35}),a=M=>{const w=[];for(let S=0;S<10;S++){const T=-.45+S/9*.9,A=_d(T,1),b=rh(A)+(M?-.07:.07),y=hA(T,rh(A)+(M?.04:-.04))-.1;w.push(new ac(.055,.08,2,6).scale(1,1,.7).rotateY(Math.atan2(T,.8)).translate(T,b,y))}return Kn(w.map(S=>je(S,16183522)))};e(a(!0),"head",r,"catrina-teeth"),e(a(!1),"jaw",r,"catrina-lowerteeth"),e(Pr([0,16.02,.5],1,[.56,.3,.5],14),"head",n.std({color:1311754,roughness:.8}),"catrina-mouth");const o=n.std({color:14725184,roughness:.25,metalness:.85}),c=[];for(const M of[1,-1])c.push(je(Pr([M*.93,16.5,-.18],.07,[1,1,1],8),16777215),je(new kn(.1,.025,6,16).rotateY(Math.PI/2).translate(M*.95,16.33,-.18),16777215),je(Pr([M*.95,16.1,-.18],.1,[.8,1.4,.8],10),16777215));e(Kn(c),"head",o,"catrina-earrings");const l=new ue;l.name="catrina-hat",l.add(new nt(oA(),n.std({vertexColors:!0,roughness:.7,metalness:.05,side:Se}))),l.add(new nt(new vn(Ms+.02,Ms+.03,.36,48,1,!0).translate(0,.2,0),n.std({color:6957712,roughness:.35,metalness:.1,side:Se})));const h=n.std({vertexColors:!0,roughness:.6,side:Se});l.add(new nt(cA(),h));const u=new nt(lA(),n.std({vertexColors:!0,roughness:.85,side:Se}));u.name="catrina-plumes",l.add(u),l.rotation.copy(fA),n.at(l,"head",H0[0],H0[1],H0[2]);const f=n.std({color:15920352,roughness:.45,emissive:2762272,emissiveIntensity:1}),d=[ji[0]-nn[0],ji[1]-nn[1],ji[2]-nn[2]];i(Kn(rA([ji[0]-Zn[0]*.35,ji[1]-Zn[1]*.35,ji[2]-Zn[2]*.35],d).map(M=>je(M,16777215))),"forearm",f,"catrina-hand");const m=15.35;e(new kn(.43,.075,8,32).rotateX(Math.PI/2).scale(1,1.6,1).translate(0,m,.02),"neck",n.std({color:1182740,roughness:.8}),"catrina-choker");const v=uf(.17);v.rotateX(Math.PI/2).translate(0,m-.05,.5),e(v,"neck",h,"catrina-neckflower");const g=[];for(const[M,w,S]of[[.45,.075,30],[.85,.065,42]])for(let T=0;T<S;T++){const A=-Math.PI+(T+.5)/S*Math.PI*2,b=(1+Math.cos(A))/2,y=[.42*Math.sin(A),15.12-M*b*b,.02+.42*Math.cos(A)],E=Rc([Math.sin(A)*(.25+b),1.2*(1-b)*(1-b),Math.cos(A)*(.25+b)]),R=uA(y,E)+w*.85;g.push(je(new Wt(w,6,4).translate(y[0]+E[0]*R,y[1]+E[1]*R,y[2]+E[2]*R),16777215))}e(Kn(g),"spine2",n.std({color:16183270,roughness:.18,metalness:.1,emissive:3157032,emissiveIntensity:1}),"catrina-pearls");const p=Kn([uf(.3).rotateX(1.3).rotateY(.5).translate(.95,_s+.05,1.05),vv(.26).rotateX(1.2).rotateY(.9).translate(1.3,_s-.15,.62),ff(.6).rotateY(1.2).translate(1.2,_s-.3,.9),ff(.55).rotateY(-.2).rotateZ(-.6).translate(.75,_s-.25,1.05)]);e(p,"pelvis",h,"catrina-corsage");const _=-1.1,x=[Pr([0,_s,_-.06],1,[.2,.22,.14],10)];for(const M of[1,-1]){x.push(new kn(.36,.11,8,20).scale(1,.62,.45).rotateZ(M*.18).translate(M*.4,_s+.04,_));const w=new ac(.12,1.3,3,8).scale(1.6,1,.4);w.rotateZ(M*.2).rotateX(-.12).translate(M*.28,_s-.78,_-.12),x.push(w)}e(Kn(x.map(M=>je(M,16777215))),"pelvis",n.std({color:6957712,roughness:.35,metalness:.1}),"catrina-bow")}const pm=new WeakMap,pA={id:"catrina",name:"Catrina",blurb:"A sugar-skull lady in a flowered hat",segs:ov,body:{sdf:qT,region:jT,box:XT,palette:[16711680,65280,255],tint:ZT,surface:"soft",weights:"sharp",capture:YT},dress:dA,fit:{size:1.06,limb:.6},face:{jaw:.35,eyes:[[Ki[0],Ki[1],Ki[2]-.04,.3],[-.42,Ki[1],Ki[2]-.04,.3]]},res:80,tick(n,t){let e=pm.get(n);e===void 0&&(e=n.getObjectByName("catrina-plumes")??null,pm.set(n,e)),e&&(e.rotation.x=.03*Math.sin(t*1.3),e.rotation.z=.025*Math.sin(t*.9+1))}},Md=n=>n<0?0:n>1?1:n,dn=(n,t,e)=>{const i=Md((e-n)/(t-n));return i*i*(3-2*i)},mA=(n,t,e)=>-O(-n,-t,e),vo=.12,xv=.3,wa={c:[0,17.25,.15],r:[1.42,1.5,1.38]},bd=n=>.55*Math.sin(7*n+.3)+.3*Math.sin(12*n+1.7)+.15*Math.sin(17*n+.4),_v=n=>.06+.42*dn(14.8,5.4,n),gA=(n,t)=>4.9-.45*n-.08*Math.sin(29*t+1.1);function Mv(n,t,e,i){const s=Md((14-t)/9.2),r=3.3+.45*s,a=1.72+.62*s,o=e-vo,c=Math.hypot(n/r,o/a),l=Math.hypot(n/(r*r),o/(a*a));return(l>1e-6?c*(c-1)/l:-Math.min(r,a))-_v(t)*i}function bv(n,t,e){const i=e-vo;if(t<15.4&&n*n/30+i*i/15.2>1)return 2;let s=ct(n,t,e,wa.c[0],wa.c[1],wa.c[2],wa.r[0],wa.r[1],wa.r[2]);const r=Math.atan2(i,n),a=bd(r);if(s=O(s,ct(n,t,e,0,14,.1,3.3,2.55,1.72)-_v(t)*a*dn(16.4,14,t),1.1),t<15.4){const o=Mv(n,t,e,a);s=Math.min(s,Math.max(o,t-14)),s=Math.max(s,gA(a,r)-t),t<11&&(s=Math.max(s,-mA(o+xv,t-10,.6)))}return s}const wv=0,vA=1;function xA(n,t,e){return t<10.6&&Mv(n,t,e,bd(Math.atan2(e-vo,n)))<-xv*.5?vA:wv}const _A=new gt(10003644);function MA(n,t,e,i,s){if(n!==wv)return;const r=bd(Math.atan2(i-vo,t)),a=dn(15.5,5.6,e);s.lerp(_A,Md(.75*a*Math.max(0,-r)+.1*a));const o=dn(1.1,.4,Math.abs(e-15.85))*dn(1.6,.9,Math.hypot(t,i-.1));s.multiplyScalar(1-.12*o)}const bA={min:[-4.55,3.95,-2.95],max:[4.55,19.1,3.2]},mm=["head","armL","forearmL","armR","forearmR","thighL","thighR","spine2","spine1","pelvis"],[wA,yA,SA,EA,TA,AA,RA,CA,LA,PA]=[0,1,2,3,4,5,6,7,8,9];function IA(n,t,e,i){i.fill(0);const s=Math.abs(n),r=n>=0,a=15.65-.55*dn(.3,1.2,e),o=dn(a,a+.85,t),c=(1-o)*dn(1.45,2.95,s)*dn(15.4,14.3,t)*dn(5.6,9.4,t),l=c*dn(12.6,10.9,t),h=(1-o-c)*.65*dn(9.7,6.9,t)*dn(-1.9,-.3,e-vo),u=h*dn(-1.1,1.1,n),f=Math.max(0,1-o-c-h),d=dn(12.6,13.9,t),m=1-dn(10,11.3,t);i[wA]=o,i[r?yA:EA]=c-l,i[r?SA:TA]=l,i[AA]=u,i[RA]=h-u,i[CA]=f*d,i[LA]=f*(1-d-m),i[PA]=f*m}function DA(n,t){const e=n.geometry.attributes.position,i=n.geometry.attributes.skinIndex,s=n.geometry.attributes.skinWeight,r=mm.map(c=>t.findIndex(l=>l.name===c)),a=new Float32Array(mm.length),o=[0,0,0,0];for(let c=0;c<e.count;c++){IA(e.getX(c),e.getY(c),e.getZ(c),a);let l=0;for(let h=0;h<4;h++){let u=-1;for(let f=0;f<a.length;f++)a[f]>1e-4&&(u<0||a[f]>a[u])&&(u=f);o[h]=u,u>=0&&(l+=a[u],a[u]=-a[u])}for(let h=0;h<4;h++){const u=o[h];i.setComponent(c,h,u>=0?r[u]:0),s.setComponent(c,h,u>=0?-a[u]/l:0)}}i.needsUpdate=!0,s.needsUpdate=!0}function Ah(n,t){let e=0,i=3.2;for(let s=0;s<32;s++){const r=(e+i)/2;bv(n,t,r)<0?e=r:i=r}return e}const hi={x:.47,y:17.48,rx:.29,ry:.43,tilt:.08},Gi={top:16.93,rx0:.25,ry0:.17,rx1:.21,ry1:.52},df=Ah(hi.x,hi.y),UA=Ah(0,16.75),NA=$2.map(n=>n.name==="jaw"?{name:"jaw",a:[0,16.75,.55],b:[0,16.75,UA+.15],parent:"head",reach:0}:n.name.startsWith("tail")?{...n,reach:0}:n);function gm(n,t,e=6,i=28){const r=c=>{const l=[],h=Math.cos(c.tilt),u=Math.sin(c.tilt),f=(d,m)=>{const v=c.cx+d*h-m*u,g=c.cy+d*u+m*h;l.push(v-t.x,g-t.y,Ah(v,g)+.018-t.z)};f(0,0);for(let d=1;d<=e;d++)for(let m=0;m<i;m++){const v=m/i*Math.PI*2,g=d/e;f(Math.cos(v)*c.rx*g,Math.sin(v)*c.ry*g)}return new Float32Array(l)},a=[];for(let c=0;c<i;c++)a.push(0,1+c,1+(c+1)%i);for(let c=1;c<e;c++)for(let l=0;l<i;l++){const h=1+(c-1)*i+l,u=1+(c-1)*i+(l+1)%i,f=h+i,d=u+i;a.push(h,f,d,h,d,u)}const o=new xe;return o.setAttribute("position",new $t(r(n[0]),3)),o.setIndex(a),o.computeVertexNormals(),n.length>1&&(o.morphAttributes.position=n.slice(1).map(c=>new $t(r(c),3))),o}const yv={value:0};function FA(){const n=new $e({vertexColors:!0,roughness:.86,metalness:0,emissive:12900607,emissiveIntensity:.1});return n.onBeforeCompile=t=>{t.uniforms.uFlutter=yv,t.vertexShader=t.vertexShader.replace("#include <common>",`#include <common>
 uniform float uFlutter;`).replace("#include <begin_vertex>",`#include <begin_vertex>
        { // the hem stirs: slow ripples round it, growing toward the edge; in bind pose, so it rides the bones
          float hem = smoothstep(8.2, 4.8, position.y);
          if (hem > 0.0) {
            vec2 r = vec2(position.x, position.z - ${vo.toFixed(2)});
            float th = atan(r.y, r.x);
            float w = 0.6 * sin(uFlutter * 2.1 + th * 3.0 + position.y * 0.9) + 0.4 * sin(uFlutter * 3.3 - th * 5.0 + 1.3);
            transformed.xz += normalize(r + 1e-4) * (0.15 * hem * w);
            transformed.y += 0.07 * hem * sin(uFlutter * 2.7 + th * 4.0);
          }
        }`),t.fragmentShader=t.fragmentShader.replace("#include <emissivemap_fragment>",`#include <emissivemap_fragment>
        // a ghost's rim: a faint cool glow where the sheet turns away from the eye
        totalEmissiveRadiance += vec3(0.55, 0.75, 1.0) * 0.22 * pow(1.0 - clamp(abs(dot(normal, normalize(vViewPosition))), 0.0, 1.0), 2.5);`)},n.customProgramCacheKey=()=>"ghost-sheet-v1",n}function kA(n){const t=n.bones.get("pelvis").parent;t?.isSkinnedMesh&&(DA(t,n.segs),t.material.dispose(),t.material=FA(),t.name="ghost-sheet");const e=n.std({color:263431,roughness:1,metalness:0,polygonOffset:!0,polygonOffsetFactor:-4,polygonOffsetUnits:-4});for(const r of[1,-1]){const a=new C(r*hi.x,hi.y,df),o=new nt(gm([{cx:r*hi.x,cy:hi.y,rx:hi.rx,ry:hi.ry,tilt:-r*hi.tilt}],a),e);o.name=r>0?"ghost-eyeL":"ghost-eyeR",n.at(o,"head",a.x,a.y,a.z).castShadow=!1}const i=new C(0,Gi.top,Ah(0,Gi.top)),s=new nt(gm([{cx:0,cy:Gi.top-Gi.ry0,rx:Gi.rx0,ry:Gi.ry0,tilt:0},{cx:0,cy:Gi.top-Gi.ry1,rx:Gi.rx1,ry:Gi.ry1,tilt:0}],i,7,32),e);s.name="ghost-mouth",n.at(s,"head",i.x,i.y,i.z).castShadow=!1}const vm=new WeakMap,OA={id:"ghost",name:"Ghost",blurb:"A bedsheet ghost that says boo",segs:NA,body:{sdf:bv,region:xA,box:bA,palette:[15330547,7107718],surface:"soft",weights:"soft",tint:MA},dress:kA,fit:{size:1.04,limb:.6,head:.45},face:{jaw:.3,eyes:[[hi.x,hi.y,df+.05,.34],[-.47,hi.y,df+.05,.34]],breath:{colors:[15398655,11066623,13155583,16777215],rate:.7,speed:.55,size:1.5}},res:90,tick(n,t,e){let i=vm.get(n);i||(i={mouth:n.getObjectByName("ghost-mouth")??null,eyes:[n.getObjectByName("ghost-eyeL")??null,n.getObjectByName("ghost-eyeR")??null].filter(l=>!!l)},vm.set(n,i)),yv.value=t;const s=Math.max(0,Math.sin(t*.85-1)),r=e?e.jaw:.55*s*s*s;i.mouth?.morphTargetInfluences&&(i.mouth.morphTargetInfluences[0]=Math.min(1,r));const a=t%5.3<.14?1:0,o=e?e.blinkL:a,c=e?e.blinkR:a;i.eyes[0]&&(i.eyes[0].scale.y=1-.85*o),i.eyes[1]&&(i.eyes[1].scale.y=1-.85*c)}},BA=n=>n<0?0:n>1?1:n,Sv=(n,t,e)=>-O(-n,-t,e),xc=[0,16.62,-.02],HA=[{name:"pelvis",a:[0,9.6,0],b:[0,10.6,0],parent:null},{name:"spine1",a:[0,10.6,0],b:[0,12.4,.1],parent:"pelvis"},{name:"spine2",a:[0,12.4,.1],b:[0,15,.1],parent:"spine1"},{name:"neck",a:[0,15,.1],b:[0,15.9,.15],parent:"spine2",reach:.8},{name:"head",a:[0,15.9,.15],b:[0,18.4,.3],parent:"neck"},{name:"jaw",a:xc,b:[0,16.3,1.3],parent:"head",reach:0},{name:"tail1",a:[0,14.8,-1.2],b:[0,12.6,-1.4],parent:"spine2",reach:0},{name:"tail2",a:[0,12.6,-1.4],b:[0,10.4,-1.6],parent:"tail1",reach:0},{name:"tail3",a:[0,10.4,-1.6],b:[0,8.2,-1.8],parent:"tail2",reach:0},{name:"tail4",a:[0,8.2,-1.8],b:[0,6.2,-2],parent:"tail3",reach:0},{name:"thighL",a:[1.1,9.6,0],b:[1.2,5.3,.2],parent:"pelvis"},{name:"shinL",a:[1.2,5.3,.2],b:[1.2,1.1,-.1],parent:"thighL"},{name:"footL",a:[1.2,1.1,-.1],b:[1.2,.35,1.4],parent:"shinL"},{name:"thighR",a:[-1.1,9.6,0],b:[-1.2,5.3,.2],parent:"pelvis"},{name:"shinR",a:[-1.2,5.3,.2],b:[-1.2,1.1,-.1],parent:"thighR"},{name:"footR",a:[-1.2,1.1,-.1],b:[-1.2,.35,1.4],parent:"shinR"},{name:"armL",a:[2.52,14.55,0],b:[2.92,11.95,-.05],parent:"spine2"},{name:"forearmL",a:[2.92,11.95,-.05],b:[3.08,9.55,.38],parent:"armL"},{name:"armR",a:[-2.52,14.55,0],b:[-2.92,11.95,-.05],parent:"spine2"},{name:"forearmR",a:[-2.92,11.95,-.05],b:[-3.08,9.55,.38],parent:"armR"}],zA={min:[-4.2,-.5,-1.9],max:[4.2,16.6,2.3]},xm=.13;function VA(n,t,e){const i=Math.abs(n);let s=4;if(t>8.2){s=ct(n,t,e,0,13.35,.1,1.62,1.95,1),s=O(s,ct(i,t,e,.8,13.8,.62,.82,.6,.42),.45),s=O(s,ct(n,t,e,0,13.75,-.32,1.66,1.25,.58),.4),s=O(s,K(i,t,e,0,15.3,-.2,1.85,14.95,-.1,.48,.34),.5),s=O(s,ct(n,t,e,0,11.6,.1,1.28,1.45,.86),.6),s=O(s,ct(n,t,e,0,10,0,1.62,1,1),.6),s=O(s,ct(i,t,e,.7,9.55,-.48,.8,.85,.6),.4),s=Math.max(s,-K(n,t,e,0,14.6,-1.06,0,10.6,-.94,.14,.12)),t>14.2&&(s=O(s,K(n,t,e,0,14.9,-.05,0,16.25,.1,.6,.52),.4)),s=O(s,ct(i,t,e,2.42,14.45,0,.6,.84,.7),.4);const r=O(K(i,t,e,2.52,14.4,0,2.92,11.98,-.05,.54,.42),ct(i,t,e,2.7,13.15,.1,.48,.95,.48),.3);if(s=t>14?O(s,r,.3):Math.min(s,r),t<12.4){let a=K(i,t,e,2.92,11.9,-.05,3.06,9.7,.36,.45,.3);a=O(a,ct(i,t,e,2.96,11.2,.05,.46,.8,.46),.3),a=O(a,ct(i,t,e,3.1,9.05,.45,.25,.55,.42),.2),a=O(a,K(i,t,e,3,9.4,.74,2.92,8.9,.94,.15,.12),.12),s=Math.min(s,a)}}return t<10.6&&(s=O(s,K(i,t,e,1.02,9.6,0,1.15,5.45,.2,.86,.54),.45),s=O(s,ct(i,t,e,1.12,7.7,.26,.74,1.6,.68),.4),s=O(s,ct(i,t,e,.82,8.3,0,.52,1.3,.58),.4),s=O(s,ve(i,t,e,1.17,5.3,.3,.5),.3),s=O(s,K(i,t,e,1.18,5.25,.15,1.2,1.15,-.1,.48,.32),.3),s=O(s,ct(i,t,e,1.2,3.95,-.26,.52,1.3,.56),.35),s=O(s,Math.max(ct(i,t,e,1.2,.5,.55,.46,.5,1.25),-t-xm),.25)),s-xm}const GA=()=>0,WA=(n,t,e,i)=>n.name.startsWith("thigh")?i>-1.6&&e<n.a[1]+.8&&Math.abs(Math.abs(t)-Math.abs(n.a[0]))<(e<n.a[1]+.3?1.3:.9):n.name.startsWith("arm")||n.name.startsWith("forearm")?Math.abs(t)>(e<12?2.3:e<14.1?1.95:2.15):!0,XA=17.16,ah=n=>XA+.07*n;function Ev(n,t,e){let i=ct(n,t,e,0,17.35,0,1.1,1.24,1.2);return i=O(i,ct(n,t,e,0,16.7,.4,.88,.9,.94),.4),i=O(i,K(n,t,e,-.62,17.42,1,.62,17.42,1,.2,.2),.3),i=O(i,K(n,t,e,0,17,1.16,0,16.6,1.36,.12,.17),.22),i}function Tv(n,t,e){const i=Math.abs(n),s=Math.hypot(n,e-.15),r=Math.atan2(n,e-.15);return Math.max(Math.abs(t-ah(i))-.085,.86-s,Math.abs(r)*s-.78)}const wd=(n,t)=>Sv(n-(xc[1]-.2*(t-xc[2])),-.2-t,.15),_m=xc[1]-.2*(1.3-xc[2]);function qA(n,t,e){const i=Sv(Ev(n,t,e),-Tv(n,t,e),.04);return Math.max(i,-(wd(t,e)-.012))}function $A(n,t,e){return Math.max(Ev(n,t,e),wd(t,e)+.012)}const YA=new gt(14076846),jA=new gt(1182728);function Mm(n,t,e,i){const s=Tv(n,t,e)<.03||Math.abs(wd(t,e))<.035;i.copy(s?jA:YA)}const ZA=`
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
  }`;function JA(){const n=new $e({vertexColors:!0,roughness:.92,metalness:0});return n.onBeforeCompile=t=>{t.vertexShader=t.vertexShader.replace("#include <common>",`#include <common>
 varying vec3 vBind;`).replace("#include <begin_vertex>",`#include <begin_vertex>
 vBind = position;`),t.fragmentShader=t.fragmentShader.replace("#include <common>",`#include <common>
`+ZA).replace("#include <color_fragment>",`#include <color_fragment>
 float linenH; diffuseColor.rgb = linen(diffuseColor.rgb, vBind, linenH);`).replace("#include <normal_fragment_maps>",`#include <normal_fragment_maps>
 normal = linenBump(-vViewPosition, normal, vec2(dFdx(linenH), dFdy(linenH)) * 0.55, faceDirection);`)},n.customProgramCacheKey=()=>"mummy-linen-v1",n}function KA(n){const t=new os({color:n,transparent:!0,opacity:.6,blending:Or,depthWrite:!1,toneMapped:!1});return t.userData.keepBlend=!0,t.onBeforeCompile=e=>{e.vertexShader=e.vertexShader.replace("#include <common>",`#include <common>
 varying vec3 vHaloN; varying vec3 vHaloV;`).replace("#include <project_vertex>",`#include <project_vertex>
 vHaloN = normalize(normalMatrix * normal); vHaloV = -mvPosition.xyz;`),e.fragmentShader=e.fragmentShader.replace("#include <common>",`#include <common>
 varying vec3 vHaloN; varying vec3 vHaloV;`).replace("#include <color_fragment>",`#include <color_fragment>
 diffuseColor.a *= pow(clamp(dot(normalize(vHaloN), normalize(vHaloV)), 0.0, 1.0), 2.2);`)},t.customProgramCacheKey=()=>"mummy-halo-v1",t}let Hl=1;const QA=()=>(Hl=Hl*1664525+1013904223>>>0,Hl/4294967296);function tR(n){const t=On(n.map(e=>e.index?e.toNonIndexed():e),!1);for(const e of n)e.dispose();return t}function eR(n,t,e,i){const a=[],o=[],c=[],l=new gt(14207396),h=new gt(7232062),u=new gt;for(let d=0;d<=14;d++){const m=d/14,v=i*m,g=Math.cos(v),p=Math.sin(v),_=d===14?.25:0;for(let x=0;x<3;x++){const M=(x/2-.5)*t,w=-n*m+(_?(QA()-.5)*_*n*.25:0);a.push(M*g+e*m*m,w,M*p+.15*Math.sin(m*3.1));const S=Math.abs(x/2-.5)*2;u.copy(l).lerp(h,BA(.15+.5*m*m+.2*S)).multiplyScalar(.92+.12*(1-S)),o.push(u.r,u.g,u.b)}}for(let d=0;d<14;d++)for(let m=0;m<2;m++){const v=d*3+m,g=v+1,p=v+3,_=p+1;c.push(v,p,g,g,p,_)}const f=new xe;return f.setAttribute("position",new ie(a,3)),f.setAttribute("color",new ie(o,3)),f.setIndex(c),f.computeVertexNormals(),f}const nR=[{bone:"forearmL",at:[3.25,9.95,.2],len:2.6,w:.42,curl:.35,twist:.9},{bone:"forearmR",at:[-3.15,11.5,-.25],len:1.9,w:.36,curl:-.25,twist:-.7},{bone:"pelvis",at:[1.55,10.45,.55],len:3.3,w:.44,curl:.4,twist:1.2},{bone:"pelvis",at:[-.75,10.6,-1],len:2.8,w:.4,curl:-.3,twist:-1},{bone:"head",at:[.55,17.9,-.95],len:2.2,w:.38,curl:.25,twist:.8}];function iR(n){Hl=11;const t=JA(),e=n.bones.get("pelvis").parent;e?.isSkinnedMesh&&(e.material.dispose(),e.material=t);const i=sn(qA,{min:[-1.3,15.65,-1.32],max:[1.3,18.72,1.62]},56,Mm,4e4),s=new nt(i,t);s.name="mummy-head",n.at(s,"head",0,0,0);const r=sn($A,{min:[-1.05,15.6,-.35],max:[1.05,16.75,1.62]},40,Mm,2e4),a=new nt(r,t);a.name="mummy-jaw",n.at(a,"jaw",0,0,0);const o=new nt(new Wt(1,18,12).scale(.58,.3,.5).translate(0,_m-.1,.5),n.std({color:1838344,roughness:.9}));n.at(o,"head",0,0,0).castShadow=!1;const c=[];for(const[f,d]of[[-.42,.13],[-.25,.17],[-.08,.15],[.1,.18],[.36,.14]]){const m=Math.sqrt(Math.max(0,1-(f/.9)**2))*.82+.22;c.push(new Ce(.13,d,.1).rotateY(Math.atan2(f,m)).translate(f,_m-.03-d/2,m))}n.at(new nt(tR(c),n.std({color:13350794,roughness:.6})),"head",0,0,0).castShadow=!1;const l=n.std({color:0,emissive:16753182,emissiveIntensity:2.4,roughness:.4}),h=KA(16751140);for(const f of[1,-1]){const d=new nt(new Wt(.1,14,10).scale(1.5,.75,.6),l);d.name="mummy-eye";const m=new nt(new Wt(.1,16,10).scale(3.6,1.6,1.2),h);m.name="mummy-halo",m.renderOrder=2,d.add(m);const v=f*.4,g=.95;n.at(d,"head",v,ah(.4),.15+Math.sqrt(g*g-v*v)),d.castShadow=!1,m.castShadow=!1,m.receiveShadow=!1}const u=n.std({color:16777215,vertexColors:!0,roughness:.92,side:Se});nR.forEach((f,d)=>{const m=new ue;m.name="mummy-end",m.userData.phase=d*1.7,m.add(new nt(eR(f.len,f.w,f.curl,f.twist),u)),n.at(m,f.bone,f.at[0],f.at[1],f.at[2])})}const z0=new le,bm=new le,wm=new Tn,ym=new WeakMap,sR={id:"mummy",name:"Mummy",blurb:"Old linen, loose ends, eyes like embers",segs:HA,body:{sdf:VA,region:GA,box:zA,palette:[14076846],surface:"soft",weights:"sharp",capture:WA},dress:iR,fit:{size:1.06,limb:.6},face:{jaw:.38,eyes:[[.4,ah(.4),1.17,.3],[-.4,ah(.4),1.17,.3]],breath:{colors:[14731408,12098146,15786684,10126432],rate:.8,speed:.6,size:1.3}},res:84,tick(n,t,e){let i=ym.get(n);if(!i){const r=[],a=[],o=new Set;n.traverse(c=>{c.name==="mummy-end"&&(r.push(c),a.push(c.userData.phase??0)),c.name==="mummy-eye"&&o.add(c.material)}),i={ends:r,phase:a,eyes:[...o]},ym.set(n,i)}for(let r=0;r<i.ends.length;r++){const a=i.ends[r],o=i.phase[r];z0.identity();for(let c=a.parent;c&&c!==n;c=c.parent)z0.premultiply(c.quaternion);wm.set(.16*Math.sin(t*1.25+o)+.05*Math.sin(t*3.1+o*2.3),0,.12*Math.sin(t*.95+o*1.3)),bm.setFromEuler(wm),a.quaternion.copy(z0.invert()).multiply(bm)}const s=(2+.5*Math.sin(t*1.6)+.18*Math.sin(t*6.7+.8))*(1-.8*Math.max(e?.blinkL??0,e?.blinkR??0))*(1+.5*(e?.jaw??0));for(const r of i.eyes)r.emissiveIntensity=s}},he=(n,t,e)=>{const i=Math.min(1,Math.max(0,(e-n)/(t-n)));return i*i*(3-2*i)},pe=(n,t,e)=>n+(t-n)*e,oh=(n,t,e)=>-O(-n,-t,e);function Fr(n,t,e,i=!1,s=!1){const r=(n+1)*(t+1),a=new Float32Array(r*3),o=new Float32Array(r*2),c=new C;for(let u=0;u<=t;u++)for(let f=0;f<=n;f++){const d=u*(n+1)+f,m=-1+2*f/n,v=u/t;e(m,v,c),a[d*3]=c.x,a[d*3+1]=c.y,a[d*3+2]=c.z,o[d*2]=(m+1)/2,o[d*2+1]=v}const l=[];for(let u=0;u<t;u++)for(let f=0;f<n;f++){const d=u*(n+1)+f,m=d+1,v=d+n+1,g=v+1;i?l.push(d,v,m,m,v,g):l.push(d,m,v,m,g,v)}const h=new xe;if(h.setAttribute("position",new $t(a,3)),h.setAttribute("uv",new $t(o,2)),h.setIndex(l),h.computeVertexNormals(),s){const u=h.attributes.normal,f=new C,d=new C;for(let m=0;m<=t;m++){const v=m*(n+1),g=v+n;f.fromBufferAttribute(u,v).add(d.fromBufferAttribute(u,g)).normalize(),u.setXYZ(v,f.x,f.y,f.z),u.setXYZ(g,f.x,f.y,f.z)}}return h}function Ko(n,t,e){const i=t.attributes.position,s=t.attributes.uv,r=new Map(n.segs.map((c,l)=>[c.name,l])),a=new Uint16Array(i.count*4),o=new Float32Array(i.count*4);for(let c=0;c<i.count;c++){const l=e(i.getX(c),i.getY(c),i.getZ(c),s?s.getX(c)*2-1:0,s?s.getY(c):0).filter(f=>f[1]>1e-4);l.sort((f,d)=>d[1]-f[1]);const h=Math.min(4,l.length);let u=0;for(let f=0;f<h;f++)u+=l[f][1];for(let f=0;f<h;f++)a[c*4+f]=r.get(l[f][0])??0,o[c*4+f]=u>0?l[f][1]/u:0;h===0&&(a[c*4]=r.get("spine2")??0,o[c*4]=1)}t.setAttribute("skinIndex",new $t(a,4)),t.setAttribute("skinWeight",new $t(o,4))}function zl(n,t,e,i){const s=n.bones.get("pelvis").parent;if(!s?.isSkinnedMesh)return null;const r=new Sc(t,e);return r.name=i,r.castShadow=!0,r.receiveShadow=!0,r.frustumCulled=!1,s.add(r),r.bind(s.skeleton,s.bindMatrix),r}function js(n){const t=On(n,!1);for(const e of n)e.dispose();return t}function Vl(n,t,e,i,s,r=!1){const a=new $e({color:16777215,roughness:e,metalness:0,side:Se,vertexColors:r}),o={uOut:{value:new gt(n)},uIn:{value:new gt(t)},uSheen:{value:i}};return a.onBeforeCompile=c=>{Object.assign(c.uniforms,o),c.fragmentShader=c.fragmentShader.replace("#include <common>",`#include <common>
 uniform vec3 uOut; uniform vec3 uIn; uniform float uSheen;`).replace("#include <color_fragment>",`#include <color_fragment>
 vec3 clothC = gl_FrontFacing ? uOut : uIn; diffuseColor.rgb *= clothC;`).replace("#include <emissivemap_fragment>",`#include <emissivemap_fragment>
 { float fr = 1.0 - abs(dot(normalize(vNormal), normalize(vViewPosition))); totalEmissiveRadiance += clothC * uSheen * pow(fr, 3.0); }`)},a.customProgramCacheKey=()=>s,a}function kr(n,t,e,i=0,s=3){for(let r=0;r<30;r++){const a=(i+s)/2;n(t,e,a)<0?i=a:s=a}return i}function Av(n,t,e,i,s,r=.02){return s.set(n(t+r,e,i)-n(t-r,e,i),n(t,e+r,i)-n(t,e-r,i),n(t,e,i+r)-n(t,e,i-r)).normalize()}function rR(n,t,e,i,s=24){const r=new vi(t.map(([f,d])=>new C(f,d,kr(n,f,d)))),a=[],o=[],c=new C,l=new C,h=new C;for(let f=0;f<=s;f++){const d=r.getPointAt(f/s);if(r.getTangentAt(f/s,l),d.z=kr(n,d.x,d.y),Av(n,d.x,d.y,d.z,c),h.crossVectors(l,c).normalize().multiplyScalar(e/2),d.addScaledVector(c,i),a.push(d.x-h.x,d.y-h.y,d.z-h.z,d.x+h.x,d.y+h.y,d.z+h.z),f>0){const m=(f-1)*2;o.push(m,m+1,m+2,m+1,m+3,m+2)}}const u=new xe;return u.setAttribute("position",new ie(a,3)),u.setIndex(o),u.computeVertexNormals(),u}function Rv(n,t,e,i,s,r,a,o,c,l,h){const u=m=>{const v=m.attributes.position,g=m.attributes.normal,p=new C;for(let _=0;_<v.count;_++){const x=v.getX(_),M=v.getY(_),w=v.getZ(_);if(Math.abs(e(x,M,w))>.12)continue;const S=t(x,M,w);S>.02||S<-.08||(Av(t,x,M,w,p,.015),g.setXYZ(_,p.x,p.y,p.z))}return h?.(m),m},f=new nt(u(sn((m,v,g)=>Math.max(t(m,v,g),-e(m,v,g)),i,r,o,6e4)),c);f.name=`${l}-head`,n.at(f,"head",0,0,0);const d=new nt(u(sn((m,v,g)=>Math.max(t(m,v,g),e(m,v,g)),s,a,o,2e4)),c);d.name=`${l}-jaw`,n.at(d,"jaw",0,0,0)}function aR(n){const t=new $e({vertexColors:!0,roughness:.6,metalness:0});return t.onBeforeCompile=e=>{e.fragmentShader=e.fragmentShader.replace("#include <roughnessmap_fragment>",`#include <roughnessmap_fragment>
 roughnessFactor = mix(0.28, roughnessFactor, smoothstep(0.004, 0.05, dot(vColor.rgb, vec3(0.333))));`)},t.customProgramCacheKey=()=>n,t}function Cv(n,t,e,i,s,r,a={}){const o=a.look??[0,0],c=a.irisFrac??.5,l=n.std({color:a.white??15525594,roughness:.18}),h=n.std({color:i,emissive:i,emissiveIntensity:s,roughness:.15}),u=n.std({color:262916,roughness:.08}),f=n.std({color:16777215,emissive:16777215,emissiveIntensity:.7,roughness:.2}),d=a.lid!==void 0?n.std({color:a.lid,roughness:.55,side:Se}):null;for(const m of[1,-1]){const v=m>0?"L":"R",g=new ue;g.name=`${r}${v}`,g.add(new nt(new Wt(e,20,14),l));const p=new ue;p.rotation.set(o[0],-m*o[1],0);const _=new nt(new Wt(e*1.02,20,6,0,Math.PI*2,0,c),h);_.name=`${r}-iris`,_.rotation.x=Math.PI/2;const x=new nt(new Wt(e*1.035,16,4,0,Math.PI*2,0,c*.42),u);x.rotation.x=Math.PI/2;const M=new nt(new Wt(e*.16,8,6),f);if(M.position.set(m*e*.22,e*.28,e*.98),p.add(_,x,M),g.add(p),d){const w=new nt(new Wt(e*1.12,20,8,0,Math.PI*2,0,1.3),d);w.name=`${r}-lid${v}`,w.rotation.x=a.lidRest??.2,g.add(w)}n.at(g,"head",m*t[0],t[1],t[2])}}function Lv(n,t,e,i,s,r,a){const o=n.std({color:r,roughness:.7});for(const c of[1,-1]){const l=new C(c*t[0],t[1],t[2]),h=new C(c*e[0],e[1],e[2]),u=new vn(s,i,l.distanceTo(h),7,1).scale(1,1,.55),f=new nt(u,o);f.quaternion.setFromUnitVectors(new C(0,1,0),h.clone().sub(l).normalize());const d=new ue;d.name=`${a}${c>0?"L":"R"}`,d.add(f);const m=l.add(h).multiplyScalar(.5);n.at(d,"head",m.x,m.y,m.z)}}function Pv(n,t,e,i){const s={lids:[],eyes:[],brows:[],glow:[]};return n.traverse(r=>{if((r.name===`${t}-lidL`||r.name===`${t}-lidR`)&&s.lids.push({o:r,rest:r.rotation.x,left:r.name.endsWith("L")}),(r.name===`${t}L`||r.name===`${t}R`)&&s.eyes.push({o:r,left:r.name.endsWith("L")}),(r.name===`${e}L`||r.name===`${e}R`)&&s.brows.push({o:r,y:r.position.y}),i.includes(r.name)){const a=r.material;s.glow.includes(a)||s.glow.push(a)}}),s}function Iv(n,t,e=.12){const i=s=>t?s?t.blinkL:t.blinkR:0;for(const s of n.lids)s.o.rotation.x=s.rest+(Math.PI/2-s.rest)*i(s.left);if(!n.lids.length)for(const s of n.eyes)s.o.scale.y=1-.9*i(s.left);for(const s of n.brows)s.o.position.y=s.y+e*(t?.browUp??0)}function Dv(n,t){return(e,i,s,r)=>{const a=e.name;return a.startsWith("thigh")?r>-1.6&&s<e.a[1]+.8&&Math.abs(Math.abs(i)-Math.abs(e.a[0]))<(s<e.a[1]+.3?1.3:.9):a.startsWith("arm")||a.startsWith("forearm")?Math.abs(i)>n(s)&&r>-1.15:a==="head"?s>t:!0}}const Sm=14.6,Oa=11.9,pf=9.45,yd=[{name:"pelvis",a:[0,9.6,0],b:[0,10.6,0],parent:null},{name:"spine1",a:[0,10.6,0],b:[0,12.4,.1],parent:"pelvis"},{name:"spine2",a:[0,12.4,.1],b:[0,15,.1],parent:"spine1"},{name:"neck",a:[0,15,.1],b:[0,15.9,.15],parent:"spine2",reach:.8},{name:"head",a:[0,15.9,.15],b:[0,18.4,.3],parent:"neck"},{name:"jaw",a:[0,16.55,-.12],b:[0,16.2,1.15],parent:"head",reach:0},{name:"tail1",a:[0,14.9,-1.3],b:[0,12.4,-1.6],parent:"spine2",reach:0},{name:"tail2",a:[0,12.4,-1.6],b:[0,9.9,-1.9],parent:"tail1",reach:0},{name:"tail3",a:[0,9.9,-1.9],b:[0,7.4,-2.2],parent:"tail2",reach:0},{name:"tail4",a:[0,7.4,-2.2],b:[0,4.9,-2.5],parent:"tail3",reach:0},{name:"thighL",a:[1.1,9.6,0],b:[1.2,5.3,.2],parent:"pelvis"},{name:"shinL",a:[1.2,5.3,.2],b:[1.2,1.1,-.1],parent:"thighL"},{name:"footL",a:[1.2,1.1,-.1],b:[1.2,.75,1.8],parent:"shinL"},{name:"thighR",a:[-1.1,9.6,0],b:[-1.2,5.3,.2],parent:"pelvis"},{name:"shinR",a:[-1.2,5.3,.2],b:[-1.2,1.1,-.1],parent:"thighR"},{name:"footR",a:[-1.2,1.1,-.1],b:[-1.2,.75,1.8],parent:"shinR"},{name:"armL",a:[2.4,Sm,0],b:[2.72,Oa,-.05],parent:"spine2"},{name:"forearmL",a:[2.72,Oa,-.05],b:[2.85,pf,.4],parent:"armL"},{name:"armR",a:[-2.4,Sm,0],b:[-2.72,Oa,-.05],parent:"spine2"},{name:"forearmR",a:[-2.72,Oa,-.05],b:[-2.85,pf,.4],parent:"armR"}],oR={min:[-3.6,-.3,-1.6],max:[3.6,16.6,2.2]};function mf(n,t,e){const i=Math.abs(n);let s=9;if(t>8.6&&(s=ct(n,t,e,0,13.3,.05,1.78,1.95,1.05),s=O(s,ct(n,t,e,0,11.4,.1,1.38,1.25,.92),.55),s=O(s,ct(n,t,e,0,9.95,0,1.6,1.05,1),.5),t>13.4&&(s=O(s,K(i,t,e,0,15,-.1,2.25,14.6,0,.55,.6),.5),s=O(s,K(n,t,e,0,14.8,-.02,0,16.2,.06,.48,.38),.3))),t<10.9&&(s=O(s,K(i,t,e,1,9.7,0,1.16,5.4,.15,.86,.58),.45),t<6.4&&(s=O(s,K(i,t,e,1.16,5.4,.15,1.2,1.35,-.08,.57,.44),.3))),t<1.9){let r=Math.max(ct(i,t,e,1.2,.48,.55,.5,.48,1.25),-t);r=O(r,Math.max(K(i,t,e,1.2,.36,.7,1.2,.3,1.95,.4,.17),-t),.25),s=O(s,r,.3)}if(i>1.5&&t>8.2&&t<15.6){const r=K(i,t,e,2.4,14.4,0,2.72,11.95,-.05,.56,.47);if(s=t>14?O(s,r,.35):Math.min(s,r),t<12.6){let a=K(i,t,e,2.72,11.95,-.05,2.84,10.15,.27,.46,.41);a=O(a,K(i,t,e,2.83,10.25,.25,2.85,9.85,.33,.37,.36),.06);let o=K(i,t,e,2.85,9.9,.33,2.86,9.4,.42,.22,.21);o=O(o,ct(i,t,e,2.87,9.05,.47,.19,.45,.36),.2),o=O(o,ct(i,t,e,2.88,8.45,.52,.15,.5,.3),.15),o=O(o,K(i,t,e,2.78,9.3,.76,2.72,8.8,.92,.12,.09),.1),s=Math.min(s,O(a,o,.1))}}return s}const gf=0,cR=1,lR=2,Em=3,hR=4;function Uv(n,t,e){const i=Math.abs(n);return t<1.12&&i>.5?lR:i>2.45&&t<10.3?t<9.86?Em:hR:t>15.3&&i<.7?Em:i>2&&t>9?gf:t<10.55?cR:gf}const uR=[.86,.82,.16,.5,.6],fR=`
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
  }`;function dR(){const n=new $e({vertexColors:!0,roughness:.7,metalness:0});return n.onBeforeCompile=t=>{t.vertexShader=t.vertexShader.replace("#include <common>",`#include <common>
 attribute float aTux; attribute float aRough; varying vec3 vBind; varying vec3 vBindN; varying float vTux; varying float vRough;`).replace("#include <begin_vertex>",`#include <begin_vertex>
 vBind = position; vBindN = normal; vTux = aTux; vRough = aRough;`),t.fragmentShader=t.fragmentShader.replace("#include <common>",`#include <common>
`+fR).replace("#include <color_fragment>",`#include <color_fragment>
 float tuxRough = vRough; { float r2 = vRough; vec3 tc = tux(diffuseColor.rgb, vBind, normalize(vBindN), r2); diffuseColor.rgb = mix(diffuseColor.rgb, tc, vTux); tuxRough = mix(vRough, r2, vTux); }`).replace("#include <roughnessmap_fragment>",`#include <roughnessmap_fragment>
 roughnessFactor = tuxRough;`)},n.customProgramCacheKey=()=>"vamp-tux-v1",n}const pR=16.29,Nv=1.16,ch=n=>pR+.21*(Nv-n),Fv=.44,mR=(n,t,e)=>Math.max(t-ch(e),-.15-e,15.98-.32*(e+.15)-t,Math.abs(n)-Fv),qs=[0,.42,.9,1.3,1.72,2.3,Math.PI],Zs=[17.78,18.08,17.86,17.36,17.28,16.85,16.6];function gR(n,t){const e=Math.atan2(n,t);for(let i=1;i<qs.length;i++)if(e<=qs[i]){const s=(e-qs[i-1])/(qs[i]-qs[i-1]);return pe(Zs[i-1],Zs[i],s)}return Zs[Zs.length-1]}const Qi=[.34,17.14,.93],vR=(n,t,e)=>{const i=gR(n,e);return .08*he(i-.03,i+.14,t)*(1+.8*he(17,18,t)*he(.1,-.7,e))},kv=(n,t,e)=>ct(n,t,e,0,17.42,.02,.9,1,1.08)-vR(Math.abs(n),t,e);function Sd(n,t,e){const i=Math.abs(n);let s=kv(n,t,e);return s=O(s,ct(n,t,e,0,16.85,.45,.74,.95,.75),.4),s=O(s,ct(n,t,e,0,16.03,.72,.38,.3,.36),.3),s=O(s,K(i,t,e,.68,16.62,-.05,.27,15.97,.72,.17,.15),.3),s=O(s,ct(i,t,e,.5,16.98,.8,.3,.17,.28),.2),s=oh(s,-ct(i,t,e,.56,16.5,.95,.22,.28,.2),.2),s=O(s,K(i,t,e,.1,17.4,1.04,.62,17.48,.84,.1,.08),.15),s=oh(s,-ct(i,t,e,Qi[0],Qi[1],1.08,.24,.15,.2),.08),s=O(s,K(n,t,e,0,17.2,1.04,0,16.7,1.4,.085,.11),.12),s=O(s,ct(i,t,e,.11,16.68,1.22,.1,.08,.1),.08),s=O(s,K(i,t,e,0,16.36,1.12,.27,16.33,.98,.055,.035),.06),s=O(s,K(i,t,e,0,16.21,1.08,.24,16.25,.96,.055,.035),.06),s=O(s,ct(i,t,e,.88,17,-.05,.1,.32,.2),.12),s=O(s,K(i,t,e,.9,17.15,-.1,1.04,17.66,-.36,.12,.02),.1),O(s,K(n,t,e,0,15.2,-.06,0,16.5,0,.47,.45),.3)}function xR(){const n=new $e({vertexColors:!0,roughness:.58,metalness:0}),t=qs.map((e,i)=>`if (ph <= ${e.toFixed(4)}) return mix(${Zs[i-1]?.toFixed(3)??"0.0"}, ${Zs[i].toFixed(3)}, (ph - ${(qs[i-1]??0).toFixed(4)}) / ${(e-(qs[i-1]??e-1)||1).toFixed(4)});`).slice(1).join(`
    `);return n.onBeforeCompile=e=>{e.vertexShader=e.vertexShader.replace("#include <common>",`#include <common>
 attribute float aHair; varying float vHair; varying vec3 vHeadP;`).replace("#include <begin_vertex>",`#include <begin_vertex>
 vHair = aHair; vHeadP = position;`),e.fragmentShader=e.fragmentShader.replace("#include <common>",`#include <common>
  varying float vHair; varying vec3 vHeadP;
  float hairline(vec3 p) {
    float ph = atan(abs(p.x), p.z);
    ${t}
    return ${Zs[Zs.length-1].toFixed(3)};
  }`).replace("#include <color_fragment>",`#include <color_fragment>
  float hairK = smoothstep(-0.006, 0.006, vHeadP.y - hairline(vHeadP)) * smoothstep(0.35, 0.65, vHair);
  // combed back: faint streaks along the head
  vec3 hairC = vec3(0.0035, 0.0035, 0.005) * (0.8 + 0.4 * sin(atan(vHeadP.x, -vHeadP.z + 0.4) * 90.0));
  diffuseColor.rgb = mix(diffuseColor.rgb, hairC, hairK);`).replace("#include <roughnessmap_fragment>",`#include <roughnessmap_fragment>
 roughnessFactor = mix(roughnessFactor, 0.26, hairK);`)},n.customProgramCacheKey=()=>"vamp-head-v2",n}function _R(n){const t=n.attributes.position,e=new Float32Array(t.count);for(let i=0;i<t.count;i++)e[i]=Math.abs(kv(t.getX(i),t.getY(i),t.getZ(i)))<.05?1:0;n.setAttribute("aHair",new $t(e,1))}function MR(n,t,e){if(t<15)return 15.1-t;const i=ct(n,t,e,0,16.95,.15,1.25,1.95,1.55);return i>.35?i:Sd(n,t,e)}const bR=new gt(14474452),V0=new gt(9340568),wR=new gt(6956080),yR=new gt(2098182),SR=new gt(15657178);function ER(n,t,e,i){const s=Math.abs(n);if(Sd(n,t,e)<-.07){i.copy(e>Nv-.24&&s<.36&&Math.abs(t-ch(e))<.12?SR:yR),s>Fv-.05&&i.copy(V0).multiplyScalar(.55);return}i.copy(bR);const a=Math.hypot((s-Qi[0])/.36,(t-Qi[1]+.04)/.26,(e-1)/.4);i.lerp(V0,.55*(1-he(.7,1.25,a)));const o=Math.hypot((s-.56)/.3,(t-16.5)/.36);i.lerp(V0,.3*(1-he(.4,1,o))*he(.6,.9,e)),e>.95&&s<.3&&Math.abs(t-ch(e))<.08&&i.copy(wR)}const Ov=2.75,Ba=.17,Ed=n=>15.52-.22*(1-n)/2,Tm=n=>14.62-.3*Math.max(0,n)**2;function TR(n,t,e){let i,s,r,a,o,c=0;if(t<=Ba){const l=t/Ba;i=n*2.09;const h=Math.cos(i),u=Ed(h),f=Tm(h),d=pe(2,4,Math.abs(Math.sin(i)));o=f+(u-f)*Math.pow(Math.max(0,1-l**d),1/d),s=pe(.76,3.15,l),r=pe(.76,1.5,l),a=pe(0,-.1,l)}else{const l=(t-Ba)/(1-Ba);i=n*pe(2.09,1.76,he(0,.3,l));const h=Math.cos(i);o=pe(Tm(h),Ov+.35*Math.abs(n)**2,l),s=3.15+.72*Math.sqrt(l)+.6*l*l,r=1.5+.42*Math.sqrt(l)+.55*l*l,a=-.1-.25*l,c=(.012+.09*l)*Math.sin(i*6.5+.4)*he(0,.12,l)}e.set(s*(1+c)*Math.sin(i),o,a-r*(1+c)*Math.cos(i))}function AR(n,t,e){const i=n*pe(2.09,1.72,t),s=Math.cos(i),r=18.12+.62*Math.abs(n)**1.6,a=pe(Ed(s)-.05,r,t),o=.4*t+.6*t*t,c=pe(.8,2,o),l=pe(.8,1.62,o),h=pe(0,-.18,t);e.set(c*Math.sin(i),a,h-l*s)}const xr=yd.filter(n=>n.name.startsWith("tail"));function RR(n,t,e){if(t<=0)return;const i=xr[0].a[1];if(n>=i){e.push(["spine2",t]);return}for(let s=0;s<xr.length;s++){const r=xr[s],a=r.a[1]-r.b[1];if(n>=r.b[1]||s===xr.length-1){const o=Math.min(1,(r.a[1]-n)/a),c=s>0?xr[s-1].name:"spine2",l=s<xr.length-1?xr[s+1].name:null;if(o<.5){const h=.5-o;e.push([r.name,t*(1-h)],[c,t*h])}else if(l){const h=Math.min(.5,o-.5);e.push([r.name,t*(1-h)],[l,t*h])}else e.push([r.name,t]);return}}}function CR(n,t,e,i,s){const r=[],a=n>=0?"L":"R",o=Math.abs(i);let c;if(s<=Ba?c=he(.4,.85,o)*he(.35,1,s/Ba)*.9:c=he(.3,.78,o)*Math.pow(he(Ov+.3,pf+.2,t),1.3),c>0){const l=he(Oa-.9,Oa+.9,t);r.push(["arm"+a,c*l],["forearm"+a,c*(1-l)])}return RR(t,1-c,r),r}function LR(n){const t=n.bones.get("pelvis").parent;if(t?.isSkinnedMesh){const A=t.geometry.attributes.position,b=new Float32Array(A.count),y=new Float32Array(A.count);for(let E=0;E<A.count;E++){const R=A.getX(E),P=A.getY(E),I=A.getZ(E),F=Uv(R,P);b[E]=F===gf&&Math.abs(R)<1.9&&P>10.8&&P<15.4&&I>0?1:0,y[E]=uR[F]??.7}t.geometry.setAttribute("aTux",new $t(b,1)),t.geometry.setAttribute("aRough",new $t(y,1)),t.material.dispose(),t.material=dR()}Rv(n,MR,mR,{min:[-1.12,15.05,-1.28],max:[1.12,18.62,1.62]},{min:[-.52,15.55,-.25],max:[.52,16.75,1.35]},56,30,ER,xR(),"vamp",_R),Cv(n,Qi,.13,11538464,.55,"vamp-eye",{look:[.05,0],lid:11051694,lidRest:.32,white:14998992,irisFrac:.62});const e=(A,b)=>{const y=17.42+b;return[A,y,kr(Sd,A,y,.3,1.6)+.025]};Lv(n,e(.1,.02),e(.6,.17),.065,.025,657932,"vamp-brow");const i=n.std({color:16052454,roughness:.25});for(const A of[1,-1]){const b=new nt(new ii(.048,.24,8).rotateX(Math.PI),i);n.at(b,"head",A*.2,ch(.94)-.1,.94)}const s=Fr(40,6,(A,b,y)=>{const E=A*2.72,R=Math.abs(A),P=he(.78,1,R),I=pe(14.96,15.6-.32*P,b),F=pe(.62,.56,b)+.13*P*b;y.set(F*Math.sin(E),I,.03-F*Math.cos(E))});n.at(new nt(s,n.std({color:15921386,roughness:.55,side:Se})),"neck",0,0,0);const r=Fr(76,60,TR);Ko(n,r,CR);const a=Fr(44,14,AR,!0);Ko(n,a,()=>[["spine2",1]]);const o=Vl(1512734,9046036,.36,.5,"vamp-cape-v1");zl(n,js([r,a]),o,"vamp-cape");const c=n.std({color:13936192,roughness:.28,metalness:.9}),l=[],h=2.09,u=.8*Math.sin(h),f=-.8*Math.cos(h),d=Ed(Math.cos(h))-.12;for(const A of[1,-1])l.push(new vn(.16,.16,.07,16).rotateX(Math.PI/2).rotateY(A*.6).translate(A*u,d,f+.04)),l.push(new Wt(.085,10,8).translate(A*u*1.03,d,f+.09));const m=new vi([new C(u*.95,d,f+.08),new C(0,d-.38,f+.32),new C(-u*.95,d,f+.08)]);l.push(new Cs(m,12,.035,6,!1)),n.at(new nt(js(l),c),"spine2",0,0,0);const v=n.std({color:10095640,roughness:.4,side:Se}),g=12.85,p=kr(mf,0,g),_=[];for(const A of[1,-1])_.push(rR(mf,[[A*.1,g+.35],[A*.3,14],[A*.5,15]],.2,.03));n.at(new nt(js(_),v),"spine2",0,0,0);const x=new ue,M=new nt(new vn(.4,.4,.07,32).rotateX(Math.PI/2),c),w=new nt(new kn(.4,.045,8,32),c),S=js(Array.from({length:12},(A,b)=>{const y=b/12*Math.PI*2;return new Wt(.045,8,6).translate(Math.cos(y)*.29,Math.sin(y)*.29,.05)})),T=new nt(new Wt(.16,16,12).scale(1,1.15,.55),n.std({color:9043984,emissive:12582938,emissiveIntensity:.45,roughness:.08,metalness:.2}));T.name="vamp-gem",T.position.z=.05,x.add(M,w,new nt(S,c),T),n.at(x,"spine2",0,g,p+.07)}const Am=new WeakMap,PR={id:"vampire",name:"Vampire",blurb:"A caped count with a medallion, fangs and red eyes",segs:yd,body:{sdf:mf,region:Uv,box:oR,palette:[1512988,1249815,394760,14474452,15724006],surface:"suit",weights:"sharp",capture:Dv(n=>n<12?2.15:n<14.1?1.95:2.05,15.85)},dress:LR,fit:{size:1.06,limb:.7},idle:{tail:.04},face:{jaw:.42,eyes:[[Qi[0],Qi[1],Qi[2]+.12,.17],[-.34,Qi[1],Qi[2]+.12,.17]],breath:{colors:[11534360,6946832,16722490,2752520],rate:.8,speed:.6,size:1.2}},res:84,tick(n,t,e){let i=Am.get(n);i||(i=Pv(n,"vamp-eye","vamp-brow",["vamp-eye-iris","vamp-gem"]),Am.set(n,i)),Iv(i,e);const s=.45+.12*Math.sin(t*1.3)+1.1*(e?.jaw??0);for(const r of i.glow)r.emissiveIntensity=s}},Bv=yd,_c=n=>Bv.find(t=>t.name===n),Rm=5.3,IR={min:[-3.5,.6,-1.5],max:[3.5,16.6,1.6]};function lh(n,t,e){const i=Math.abs(n);let s=9;if(t>8.7&&(s=ct(n,t,e,0,13.25,.05,1.58,1.85,.98),s=O(s,ct(i,t,e,.62,13.15,.5,.56,.52,.48),.35),s=O(s,ct(n,t,e,0,11.35,.05,1.1,1.25,.78),.55),s=O(s,ct(n,t,e,0,10,0,1.42,1,.95),.5),t>13.4&&(s=O(s,K(i,t,e,0,14.95,-.1,2.15,14.6,0,.46,.5),.45),s=O(s,K(n,t,e,0,14.8,-.02,0,16.2,.06,.42,.34),.3))),t<10.9&&(s=O(s,K(i,t,e,1,9.7,0,1.14,5.4,.15,.62,.46),.45),t<6.4&&(s=O(s,K(i,t,e,1.14,5.4,.15,1.2,1.25,-.08,.42,.3),.3))),i>1.5&&t>7.6&&t<15.6){const r=K(i,t,e,2.4,14.4,0,2.72,11.95,-.05,.48,.4);if(s=t>14?O(s,r,.35):Math.min(s,r),t<12.6){const a=K(i,t,e,2.72,11.95,-.05,2.83,10.3,.25,.39,.44);let o=K(i,t,e,2.83,10.4,.25,2.86,9.4,.42,.17,.18);o=O(o,ct(i,t,e,2.87,9.05,.47,.17,.42,.33),.2);for(let c=0;c<4;c++){const l=.27+c*.14;o=O(o,K(i,t,e,2.88,8.75,l,2.92,8.75-(c===0||c===3?.42:.55),l+.12,.075,.05),.06)}o=O(o,K(i,t,e,2.79,9.3,.76,2.72,8.82,.95,.1,.07),.08),s=Math.min(s,a,o)}}return s}const DR=0,Cm=1,UR=2;function NR(n,t){const e=Math.abs(n);return e>2.5&&t<10.35||t>15.3&&e<.6?Cm:t<10.2&&e<2.2?UR:DR}const FR=-.12,kR=16.24,Hv=1.1,vf=n=>kR+.21*(Hv-n),zv=.42,OR=(n,t,e)=>Math.max(t-vf(e),FR-.03-e,15.98-.32*(e+.15)-t,Math.abs(n)-zv),ts=[.32,17.12,.9],Qa=[.14,16.92,1.52];function hh(n,t,e){if(t<15)return 15.1-t;const i=ct(n,t,e,0,16.95,.3,1.2,1.95,1.8);if(i>.35)return i;const s=Math.abs(n);let r=ct(n,t,e,0,17.42,.02,.88,.98,1.05);return r=O(r,ct(n,t,e,0,16.85,.42,.7,.95,.72),.4),r=O(r,K(n,t,e,0,16.25,.72,0,15.78,1,.24,.13),.3),r=O(r,K(s,t,e,.62,16.62,-.05,.2,15.92,.8,.15,.12),.3),r=O(r,ct(s,t,e,.48,16.95,.76,.28,.17,.25),.2),r=oh(r,-ct(s,t,e,.52,16.48,.92,.2,.26,.18),.2),r=O(r,K(s,t,e,.1,17.38,1,.6,17.44,.82,.09,.07),.15),r=oh(r,-ct(s,t,e,ts[0],ts[1],1.04,.23,.14,.19),.08),r=O(r,K(n,t,e,0,17.18,1,0,16.98,1.42,.085,.125),.12),r=O(r,K(n,t,e,0,16.98,1.42,0,16.68,1.9,.125,.09),.08),r=O(r,K(n,t,e,0,16.68,1.9,0,16.5,1.84,.09,.06),.06),r=O(r,K(n,t,e,0,16.52,1.8,0,16.6,1.18,.07,.1),.1),r=O(r,ct(s,t,e,.1,16.64,1.3,.09,.07,.14),.08),r=O(r,ve(n,t,e,Qa[0],Qa[1],Qa[2],.07),.03),r=O(r,K(s,t,e,0,16.3,1.08,.27,16.33,.94,.05,.03),.05),r=O(r,K(s,t,e,0,16.16,1.05,.24,16.21,.93,.05,.03),.05),r=O(r,ct(s,t,e,.86,17,-.05,.1,.3,.2),.12),O(r,K(n,t,e,0,15.2,-.06,0,16.5,0,.44,.42),.3)}const BR=new gt(10011258),G0=new gt(5602368),HR=new gt(5917264),zR=new gt(1836296),VR=new gt(14208140),GR=new gt(6974002),WR=new gt(1446930);function XR(n,t,e,i){const s=Math.abs(n);if(hh(n,t,e)<-.07){const c=e>Hv-.26&&s<.36&&Math.abs(t-vf(e))<.13,l=(n+.36)/.12,h=Math.floor(l)===4;i.copy(c&&!h&&l-Math.floor(l)<.8?VR:zR),s>zv-.05&&i.copy(G0).multiplyScalar(.55);return}if(t>17.62-.35*he(.4,1.3,Math.atan2(s,e))){i.copy(WR);return}i.copy(BR);const a=Math.hypot((s-ts[0])/.36,(t-ts[1]+.04)/.26,(e-.98)/.4);i.lerp(G0,.6*(1-he(.7,1.25,a)));const o=Math.hypot((s-.52)/.3,(t-16.48)/.36);i.lerp(G0,.35*(1-he(.4,1,o))*he(.6,.9,e)),i.lerp(new gt(10132058),.4*(1-he(.1,.35,Math.hypot(n,t-16.62,e-1.88)))),Math.hypot(n-Qa[0],t-Qa[1],e-Qa[2])<.1&&i.copy(GR),e>.9&&s<.28&&Math.abs(t-vf(e))<.05&&i.copy(HR)}const uh=11.2,xf=4.45;let to=11;const Xn=()=>(to=to*1664525+1013904223>>>0,to/4294967296);function Td(n,t){to=t;const e=Array.from({length:n},()=>.45+.55*Xn());return i=>{const s=(i+1)/2*n,r=Math.floor(s)%n,a=s-Math.floor(s);return e[r]*(1-Math.abs(a*2-1))}}const qR=Td(22,5);function $R(n){if(n>10){const t=he(uh,10,n);return[pe(1.06,1.75,t),pe(.74,1.2,t)]}return[1.75+.12*(10-n),1.2+.16*(10-n)]}function YR(n,t,e){const i=n*Math.PI,s=pe(uh,xf-.85*qR(n)+.15*Math.cos(i),t),[r,a]=$R(s),o=he(10,xf,s),c=1+(.012+.055*o)*Math.sin(i*9+.7)*he(10.4,9.6,s);e.set(r*c*Math.sin(i),s,.02-.12*o+a*c*Math.cos(i))}function jR(n,t,e){const i=Math.min(1,Math.max(0,(uh-t)/(uh-xf))),s=Math.max(0,e/Math.max(.5,Math.hypot(n,e))),r=he(.05,.35,i)*(.3+.7*s)*.92,a=he(-.7,.7,n),o=.5*he(Rm+.6,Rm-.9,t);return[["pelvis",1-r],["thighL",r*a*(1-o)],["shinL",r*a*o],["thighR",r*(1-a)*(1-o)],["shinR",r*(1-a)*o]]}const Ha=.5,ZR=Td(16,9),JR=n=>15.48-.2*(1-n)/2,Lm=n=>14.62-.3*Math.max(0,n)**2,KR=n=>{const t=Math.abs(n);return t<.55?pe(10.9,12.6,he(0,.55,t)):pe(12.6,11.9,he(.55,1,t))};function QR(n,t,e){const i=n*2.72,s=Math.cos(i);let r,a,o,c;if(t<=Ha){const u=t/Ha,f=JR(s),d=Lm(s),m=pe(2,3,Math.abs(Math.sin(i)));c=d+(f-d)*Math.pow(Math.max(0,1-u**m),1/m),r=pe(.68,2.92,u),a=pe(.68,1.42,u),o=pe(0,-.08,u),e.set(r*Math.sin(i),c,o-a*s);return}const l=(t-Ha)/(1-Ha);c=pe(Lm(s),KR(n)-.55*ZR(n),l),r=2.92+.32*Math.sqrt(l),a=1.42+.22*Math.sqrt(l),o=-.08;const h=he(.62,1,Math.abs(n))*he(0,.55,l);e.set(r*Math.sin(i)*pe(1,.12,h),c,o-a*s+.12*h)}function t6(n,t,e,i,s){const r=Math.abs(i),a=he(.28,.5,r)*(1-he(.72,.9,r))*(s<=Ha?he(.4,1,s/Ha):1)*.85;return[["spine2",1-a],[n>=0?"armL":"armR",a]]}function e6(){const n=new C(..._c("forearmL").a),e=new C(..._c("forearmL").b).clone().sub(n),i=e.length();e.normalize();const s=new C(1,0,0).addScaledVector(e,-e.x).normalize(),r=new C().crossVectors(s,e),a=Td(9,3);return Fr(36,8,(o,c,l)=>{const h=o*Math.PI,u=pe(.5,1.12+.2*a(o),c)*i,f=pe(.44,.95,c**1.4);l.copy(n).addScaledVector(e,u).addScaledVector(s,Math.sin(h)*f).addScaledVector(r,Math.cos(h)*f)},!0)}const W0=(n,t,e)=>Math.min(hh(n,t,e),lh(n,t,e));function Pm(n,t){let e=0,i=3.2;if(W0(Math.sin(n)*i,t,Math.cos(n)*i)<0)return i;for(let s=i,r=0;s>0&&r<60;r++){const a=W0(Math.sin(n)*s,t,Math.cos(n)*s);if(a<0){e=s,i=s+.1;break}s-=Math.max(.03,Math.min(.1,a*.8))}for(let s=0;s<12;s++){const r=(e+i)/2;W0(Math.sin(n)*r,t,Math.cos(n)*r)<0?e=r:i=r}return e}function n6(){to=23;const n=[],t=[new gt(1841687),new gt(2499101),new gt(1184016),new gt(3814960)],e=64;for(let i=0;i<e;i++){const r=(i%2===0?1:-1)*(.62+(Math.PI-.62)*((Math.floor(i/2)+Xn()*.6)/(e/2))),a=Math.abs(r)/Math.PI,o=17.72-.25*a+Xn()*.08,c=pe(15,12.4,a**.8)-Xn()*.6,l=[];let h=Pm(r,o)+.06;const u=12,f=Xn()*6.28,d=.5+Xn()*.8;for(let w=0;w<=u;w++){const S=w/u,T=pe(o,c,S),A=T>15.7?.08:pe(.08,pe(.48,.8,he(1.9,2.6,Math.abs(r))),he(15.7,15,T));h=Math.max(h,Pm(r,T)+A);const b=.07*Math.sin(S*9*d+f)*S,y=r+b/Math.max(.8,h);l.push(new C(Math.sin(y)*h,T,Math.cos(y)*h-.02))}const m=new vi(l),v=new Cs(m,14,.07,4,!1),g=v.attributes.position,p=15,_=5;for(let w=0;w<p;w++){const S=m.getPointAt(w/(p-1)),T=pe(1,.3,w/(p-1))*(.8+.4*Xn());for(let A=0;A<_;A++){const b=w*_+A;g.setXYZ(b,S.x+(g.getX(b)-S.x)*T,S.y+(g.getY(b)-S.y)*T,S.z+(g.getZ(b)-S.z)*T)}}v.computeVertexNormals();const x=t[Math.floor(Xn()*t.length)],M=new Float32Array(g.count*3);for(let w=0;w<g.count;w++)M[w*3]=x.r,M[w*3+1]=x.g,M[w*3+2]=x.b;v.setAttribute("color",new $t(M,3)),v.deleteAttribute("uv"),n.push(v)}return js(n)}function i6(n){const t=n.std({color:1315351,roughness:.88,side:Se}),e=new ue;e.name="witch-hat";const i=Fr(64,8,(d,m,v)=>{const g=d*Math.PI,p=pe(.95,2.75,m);v.set(p*Math.sin(g),-.08*m-.2*m*m+.12*Math.sin(3*g+1)*m*m-.1*Math.max(0,Math.cos(g))*m*m,p*Math.cos(g))});e.add(new nt(i,t));const s=new vi([[0,0,0],[0,1.3,-.05],[.05,2.5,-.22],[.22,3.35,-.6],[.5,3.8,-1.15],[.82,3.72,-1.7],[1,3.45,-2]].map(([d,m,v])=>new C(d,m,v))),r=44,a=24,o=new Cs(s,r,1,a,!1),c=o.attributes.position;for(let d=0;d<=r;d++){const m=d/r,v=s.getPointAt(m),g=1.08*Math.pow(1-m,.95)*(1+.05*Math.sin(m*28)*(1-m)*he(.1,.2,m))+.015;for(let p=0;p<=a;p++){const _=d*(a+1)+p;c.setXYZ(_,v.x+(c.getX(_)-v.x)*g,v.y+(c.getY(_)-v.y)*g,v.z+(c.getZ(_)-v.z)*g)}}o.computeVertexNormals(),e.add(new nt(o,t));const l=new Bi([new ft(1.13,.04),new ft(1.11,.24),new ft(1.09,.44)],40);e.add(new nt(l,n.std({color:5909114,roughness:.6,side:Se})));const h=n.std({color:14198840,roughness:.3,metalness:.9}),u=js([new Ce(.56,.08,.06).translate(0,.21,0),new Ce(.56,.08,.06).translate(0,-.21,0),new Ce(.08,.5,.06).translate(.24,0,0),new Ce(.08,.5,.06).translate(-.24,0,0),new Ce(.05,.42,.05).translate(0,0,.02)]),f=new nt(u,h);f.position.set(0,.24,1.13),f.rotation.x=-.03,e.add(f),e.rotation.set(-.1,.15,.1),n.at(e,"head",.04,17.86,-.02)}function s6(n,t,e){let i=Math.max(ct(n,t,e,0,.42,.45,.46,.42,1),-t);return i=O(i,Math.max(K(n,t,e,0,.36,.8,0,.36,2,.36,.15),-t),.25),i=O(i,K(n,t,e,0,.36,2,0,.82,2.55,.15,.04),.12),i=O(i,K(n,t,e,0,.8,0,0,1.75,-.08,.44,.42),.25),i=Math.min(i,Math.max(Math.abs(n)-.2,Math.abs(t-.18)-.18,Math.abs(e+.28)-.18)),i}function r6(n){const t=new C(n*1.2,5.75,.23),e=new C(..._c("shinL").b);e.x=n*1.2;const i=t.distanceTo(e),s=t.clone().sub(e).normalize(),r=[],a=p=>.38+.13*he(0,.45,p/i)-.03*he(.6,1,p/i),o=.34;for(let p=0;p*o<i;p++){const _=p*o,x=Math.min(i,(p+1)*o);r.push([_+.002,a(_),p%2],[(_+x)/2,a((_+x)/2),p%2],[x-.002,a(x),p%2])}const c=20,l=[],h=[],u=[],f=new C(1,0,0).addScaledVector(s,-s.x).normalize(),d=new C().crossVectors(f,s),m=new gt(6958238),v=new gt(1314840);r.forEach(([p,_,x],M)=>{const w=x?v:m;for(let S=0;S<=c;S++){const T=S/c*Math.PI*2,A=e.clone().addScaledVector(s,p).addScaledVector(f,Math.cos(T)*_).addScaledVector(d,Math.sin(T)*_);if(l.push(A.x,A.y,A.z),h.push(w.r,w.g,w.b),M>0&&S<c){const b=(M-1)*(c+1)+S,y=M*(c+1)+S;u.push(b,y,b+1,b+1,y,y+1)}}});const g=new xe;return g.setAttribute("position",new ie(l,3)),g.setAttribute("color",new ie(h,3)),g.setIndex(u),g.computeVertexNormals(),g}function a6(n){to=41;const t=new C(-2.93,9,.62),e=new C(-.07,1,.05).normalize(),i=f=>t.clone().addScaledVector(e,f),s=[];for(let f=0;f<=8;f++){const d=pe(3.4,-6.2,f/8),m=i(d);m.x+=.06*Math.sin(f*2.1),m.z+=.05*Math.cos(f*1.7),s.push(m)}const r=new Cs(new vi(s),40,.12,8,!1),a=n.std({color:5914148,roughness:.75}),o=new ue;o.add(new nt(r,a)),o.add(new nt(new Wt(.13,10,8).translate(s[0].x,s[0].y,s[0].z),a));const c=i(-6),l=[],h=[14201948,12884540,15256700,11043386].map(f=>new gt(f));for(let f=0;f<150;f++){const d=Xn()*Math.PI*2,m=.26*Math.sqrt(Xn()),v=c.clone().add(new C(Math.cos(d)*m,.3-Xn()*.3,Math.sin(d)*m)),g=.12+.75*(m/.26),p=new C(v.x+Math.cos(d)*g,Math.max(.05,v.y-2.4-Xn()*.4),v.z+Math.sin(d)*g),_=v.distanceTo(p),x=new ii(.045,_,3,1).rotateX(Math.PI).translate(0,_/2,0);x.applyQuaternion(new le().setFromUnitVectors(new C(0,1,0),v.clone().sub(p).normalize())).translate(p.x,p.y,p.z);const M=h[Math.floor(Xn()*h.length)],w=x.attributes.position.count,S=new Float32Array(w*3);for(let T=0;T<w;T++)S[T*3]=M.r,S[T*3+1]=M.g,S[T*3+2]=M.b;x.setAttribute("color",new $t(S,3)),l.push(x)}o.add(new nt(js(l),n.std({color:16777215,vertexColors:!0,roughness:.8})));const u=n.std({color:6958238,roughness:.7});for(const[f,d]of[[-5.85,.33],[-6.15,.38]]){const m=new nt(new kn(d,.06,6,20),u);m.position.copy(i(f)),m.quaternion.setFromUnitVectors(new C(0,0,1),e),o.add(m)}n.at(o,"forearmR",0,0,0)}function o6(n){Rv(n,hh,OR,{min:[-1.05,15.05,-1.2],max:[1.05,18.5,2.05]},{min:[-.5,15.5,-.2],max:[.5,16.7,1.3]},56,30,XR,aR("witch-head-v1"),"witch"),Cv(n,ts,.12,13157400,.3,"witch-eye",{look:[.08,.05],lid:6984786,lidRest:.26,white:14867648,irisFrac:.6});const t=(g,p)=>{const _=17.4+p;return[g,_,kr(hh,g,_,.3,1.6)+.025]};Lv(n,t(.1,.06),t(.58,.2),.06,.03,2367516,"witch-brow"),i6(n);const e=n6();Ko(n,e,(g,p)=>{const _=he(15.7,16.6,p);return[["head",_],["neck",(1-_)*.3],["spine2",(1-_)*.7]]}),zl(n,e,n.std({color:16777215,vertexColors:!0,roughness:.5}),"witch-hair");const i=Fr(110,40,YR,!0,!0);Ko(n,i,jR),zl(n,i,Vl(1446938,2760240,.7,.12,"witch-cloth-v1"),"witch-skirt");const s=Fr(72,22,QR);Ko(n,s,t6),zl(n,s,Vl(6040194,3020354,.85,.15,"witch-cloth-v1"),"witch-shawl");const r=new nt(new Wt(.26,12,10).scale(1.3,.9,.8),n.std({color:6040194,roughness:.85}));n.at(r,"spine2",0,13.25,kr(lh,0,13.25)+.36);const a=new nt(new kn(1,.12,8,40).rotateX(Math.PI/2).scale(1.13,1.6,.82),n.std({color:4858470,roughness:.7}));n.at(a,"spine1",0,11.12,.05);const o=n.std({color:14198840,roughness:.3,metalness:.9}),c=js([new Ce(.42,.07,.06).translate(0,.17,0),new Ce(.42,.07,.06).translate(0,-.17,0),new Ce(.07,.4,.06).translate(.18,0,0),new Ce(.07,.4,.06).translate(-.18,0,0)]);n.at(new nt(c,o),"spine1",0,11.12,kr(lh,0,11.12)+.17);const l=e6(),h=Vl(1446938,2760240,.7,.12,"witch-cloth-v1");n.at(new nt(l,h),"forearmL",0,0,0);const u=new nt(l,h);u.scale.x=-1,n.at(u,"forearmR",0,0,0);const f=n.std({color:16777215,vertexColors:!0,roughness:.8}),d=n.std({color:1840664,roughness:.38}),m=sn(s6,{min:[-.6,-.05,-.65],max:[.6,1.95,2.75]},34,void 0,16e3),v=new Bi([new ft(.43,0),new ft(.47,1),new ft(.52,1.35),new ft(.58,1.42),new ft(.56,1.62),new ft(.46,1.6)],24);for(const g of[1,-1]){const p=g>0?"L":"R";n.at(new nt(r6(g),f),"shin"+p,0,0,0);const _=_c("shin"+p).b,x=new ue;x.add(new nt(v,d)),x.quaternion.setFromUnitVectors(new C(0,1,0),new C(..._c("shin"+p).a).sub(new C(..._)).normalize()),n.at(x,"shin"+p,_[0],_[1]+.25,_[2]),n.at(new nt(m,d),"foot"+p,g*1.2,0,0);const M=new nt(c,o);M.scale.setScalar(.8),M.rotation.x=-.85,n.at(M,"foot"+p,g*1.2,.98,.95)}a6(n)}const Im=new WeakMap,c6={id:"witch",name:"Witch",blurb:"A green-faced witch with a crooked hat and a broom",segs:Bv,body:{sdf:lh,region:NR,box:IR,palette:[1578524,10011258,1183766],surface:"soft",weights:"sharp",capture:Dv(n=>n<12?2.1:n<14.1?1.9:2,15.85)},dress:o6,fit:{size:1.06,limb:.7},face:{jaw:.45,eyes:[[ts[0],ts[1],ts[2]+.12,.16],[-.32,ts[1],ts[2]+.12,.16]],breath:{colors:[8191818,11559167,14221194,9055487],rate:1.2,speed:.8}},res:84,tick(n,t,e){let i=Im.get(n);i||(i=Pv(n,"witch-eye","witch-brow",["witch-eye-iris"]),Im.set(n,i)),Iv(i,e,.14);const s=.28+.08*Math.sin(t*2.3)+.9*(e?.jaw??0);for(const r of i.glow)r.emissiveIntensity=s}},as=[jS,gE,dS,OE,rT,_4,aT,GT,pA,OA,sR,PR,c6,iT,oT,cT,lT],_f=["jimothy","builder","skeleton","pumpkin","howler","violet","plume"],rs=n=>as.find(t=>t.id===n)??as[0],l6=n=>new C(n.x,n.y,n.z),h6=new C(1,0,0),u6=new C(0,1,0),ya=(n,t,e)=>{const i=Math.min(1,Math.max(0,(e-n)/(t-n)));return i*i*(3-2*i)};function Dm(n,t){const e=t.clone().normalize(),i=new C().crossVectors(n,e).normalize(),s=new C().crossVectors(e,i).normalize();return new le().setFromRotationMatrix(new re().makeBasis(s,e,i))}function f6(n,t){const e=n.clone().normalize(),i=new C().crossVectors(t,e).normalize(),s=new C().crossVectors(e,i).normalize();return new le().setFromRotationMatrix(new re().makeBasis(e,i,s))}function Mf(n){const t=M=>l6(n[M]),e=(...M)=>Math.min(...M.map(w=>n[w].v)),i=t(U.hipL),s=t(U.hipR),r=t(U.shL),a=t(U.shR),o=i.clone().add(s).multiplyScalar(.5),c=r.clone().add(a).multiplyScalar(.5),l=c.clone().sub(o),h=Dm(i.clone().sub(s),l),u=Dm(r.clone().sub(a),l),f=t(U.earL),d=t(U.earR),m=t(U.nose),v=f.clone().add(d).multiplyScalar(.5),g=f6(f.clone().sub(d),m.clone().sub(v));g.multiply(new le().setFromAxisAngle(new C(1,0,0),-.32));const p=(M,w)=>t(w).sub(t(M)).normalize(),_={armL:p(U.shL,U.elL),forearmL:p(U.elL,U.wrL),armR:p(U.shR,U.elR),forearmR:p(U.elR,U.wrR),thighL:p(U.hipL,U.knL),shinL:p(U.knL,U.anL),footL:p(U.heelL,U.toeL),thighR:p(U.hipR,U.knR),shinR:p(U.knR,U.anR),footR:p(U.heelR,U.toeR)},x={armL:e(U.shL,U.elL),forearmL:e(U.elL,U.wrL),armR:e(U.shR,U.elR),forearmR:e(U.elR,U.wrR),thighL:e(U.hipL,U.knL),shinL:e(U.knL,U.anL),footL:e(U.heelL,U.toeL),thighR:e(U.hipR,U.knR),shinR:e(U.knR,U.anR),footR:e(U.heelR,U.toeR)};return{pelvis:h,chest:u,head:g,headVis:e(U.earL,U.earR,U.nose),neck:v.sub(c).normalize(),dir:_,vis:x}}const d6={armL:new C(1,0,0),armR:new C(-1,0,0),thighL:new C(0,-1,0),thighR:new C(0,-1,0),neck:new C(0,1,0)},Um={forearmL:"armL",forearmR:"armR",shinL:"thighL",shinR:"thighR",footL:"shinL",footR:"shinR"};class p6{bones;rest=new Map;qm=new Map;hipRest;pelvisA;torso;len=new Map;segs;constructor(t,e){this.segs=t,this.bones=e;const i=l=>t.find(h=>h.name===l);for(const l of t){const h=new C(l.b[0]-l.a[0],l.b[1]-l.a[1],l.b[2]-l.a[2]);this.len.set(l.name,h.length()),h.lengthSq()>1e-9?h.normalize():h.set(0,1,0);const u=l.parent?i(l.parent):null,f=u?new C(l.a[0]-u.a[0],l.a[1]-u.a[1],l.a[2]-u.a[2]):new C(...l.a);let d=d6[l.name];if(!d&&Um[l.name]){const m=i(Um[l.name]);d=new C(m.b[0]-m.a[0],m.b[1]-m.a[1],m.b[2]-m.a[2]).normalize(),l.name.startsWith("foot")&&(d=h.clone())}d??=h.clone(),this.rest.set(l.name,{dir:h,offset:f,pre:new le().setFromUnitVectors(h,d),canon:d})}this.pelvisA=new C(...i("pelvis").a);const s=i("thighL").a,r=i("thighR").a,a=i("armL").a,o=i("armR").a;this.hipRest=new C((s[0]+r[0])/2,(s[1]+r[1])/2,(s[2]+r[2])/2);const c=new C((a[0]+o[0])/2,(a[1]+o[1])/2,(a[2]+o[2])/2);this.torso=c.distanceTo(this.hipRest)}setLength(t,e){const i=this.segs.find(a=>a.parent===t&&!a.name.startsWith("tail")&&a.name!=="jaw");if(!i)return;const s=this.bones.get(i.name),r=this.rest.get(i.name);s.position.copy(r.offset).multiplyScalar(e)}neckFit(t){const e=l=>this.segs.find(h=>h.name===l),i=e("spine2"),s=e("neck"),r=e("head"),a=(e("armL").a[1]+e("armR").a[1])/2-i.a[1],o=s.a[1]-i.a[1]+(r.a[1]-s.a[1]),c=(r.a[1]+r.b[1])/2-r.a[1];return o>.001?(a+t-c)/o:1}setNeck(t){for(const e of["neck","head"]){const i=this.bones.get(e),s=this.rest.get(e);i&&s&&i.position.copy(s.offset).multiplyScalar(t)}}swing(t,e,i,s){const r=this.rest.get(t),a=i.clone().applyQuaternion(e.clone().invert()).normalize(),o=new le().setFromUnitVectors(r.canon,a).multiply(r.pre);return s<1&&o.slerp(new le,1-Math.max(0,s)),o}glide=0;primed=new Set;set(t,e,i){const s=this.bones.get(t);s&&(this.glide>0&&this.primed.has(t)&&(e=s.quaternion.clone().slerp(e,this.glide)),s.quaternion.copy(e),this.primed.add(t));const r=i?i.clone().multiply(e):e.clone();return this.qm.set(t,r),r}apply(t,e=0,i=0,s=0){this.glide=s>0?1-Math.exp(-s/.025):0;const r=this.set("pelvis",t.pelvis,null),a=this.hipRest.clone().sub(this.pelvisA).applyQuaternion(t.pelvis);this.bones.get("pelvis").position.copy(a.negate());const o=t.pelvis.clone().slerp(t.chest,.5),c=this.set("spine1",r.clone().invert().multiply(o),r),l=this.set("spine2",c.clone().invert().multiply(t.chest),c),h=ya(.3,.7,t.headVis),u=this.set("neck",this.swing("neck",l,t.neck,h*.6),l),f=u.clone().invert().multiply(t.head);h<1&&f.slerp(new le,1-h),this.set("head",f,u);for(const m of["L","R"]){const v=this.set("arm"+m,this.swing("arm"+m,l,t.dir[`arm${m}`],ya(.35,.7,t.vis[`arm${m}`])),l);this.set("forearm"+m,this.swing("forearm"+m,v,t.dir[`forearm${m}`],ya(.35,.7,t.vis[`forearm${m}`])),v);const g=this.set("thigh"+m,this.swing("thigh"+m,r,t.dir[`thigh${m}`],ya(.4,.75,t.vis[`thigh${m}`])),r),p=this.set("shin"+m,this.swing("shin"+m,g,t.dir[`shin${m}`],ya(.4,.75,t.vis[`shin${m}`])),g);this.set("foot"+m,this.swing("foot"+m,p,t.dir[`foot${m}`],ya(.5,.8,t.vis[`foot${m}`])),p)}let d=r;for(let m=1;m<=4;m++){const v="tail"+m;if(!this.bones.has(v))break;const g=new le().setFromEuler(new Tn(0,Math.sin(e*2.1-m*.7)*i,Math.sin(e*1.3-m*.5)*i*.3));d=this.set(v,g,m===1?this.qm.get(this.segs.find(p=>p.name==="tail1")?.parent??"pelvis")??r:d)}}setJaw(t,e=0){const i=this.bones.get("jaw");i&&i.quaternion.setFromAxisAngle(u6,e*.16).multiply(new le().setFromAxisAngle(h6,t))}dirOf(t){return this.rest.get(t).dir.clone().applyQuaternion(this.qm.get(t))}}const Os=128,Sa=64,ci=96,Wi=72,Bs=12,Ea=9,Xi=24,Ti={spread:1,back:.9,envIntensity:1.15,key:5,every:6,targetMean:.22,maxGain:2.8,fill:.35},Ta=new Float32Array(256).map((n,t)=>{const e=t/255;return e<=.04045?e/12.92:Math.pow((e+.055)/1.055,2.4)});class m6{constructor(t,e,i){this.renderer=t,this.scene=e,this.cv=document.createElement("canvas"),this.cv.width=ci,this.cv.height=Wi,this.ctx=this.cv.getContext("2d",{willReadFrequently:!0}),this.fcv=document.createElement("canvas"),this.fcv.width=this.fcv.height=Xi,this.fctx=this.fcv.getContext("2d",{willReadFrequently:!0}),this.tex=new Ga(this.data,Os,Sa,cn,Xr),this.tex.mapping=Gl,this.tex.colorSpace=Hr,this.tex.magFilter=Ie,this.tex.minFilter=Ie,this.pmrem=new Wu(t),this.key.castShadow=!0,this.key.shadow.mapSize.set(1024,1024),this.key.shadow.bias=-5e-4,this.key.shadow.normalBias=.02,this.key.shadow.radius=4,e.add(this.key),e.add(this.key.target),e.add(this.fill),this.fill.intensity=1}key=new Gu(16777215,1);fill=new LM(16777215,4473924,0);cv;ctx;lin=new Float32Array(ci*Wi*3);blur=new Float32Array(Bs*Ea*3);data=new Uint16Array(Os*Sa*4);smooth=new Float32Array(Os*Sa*3);primed=!1;keyDir=new C(0,1,1).normalize();keyI=0;tex;pmrem;rt=null;mean=0;share=0;gain=1;realism=!1;face=null;faceDir=new C(0,0,1);faceLum=0;faceConf=0;fcv;fctx;dir=new C(0,1,1).normalize();target=new C(0,0,-2);update(t,e,i,s,r,a){if(this.aimShadows(r,i),!a){this.scene.environment=null,this.fill.intensity=1.2,this.key.intensity=1.6,this.key.position.copy(this.target).add(new C(1.5,3,2.5));return}if(s%Ti.every!==0&&this.rt||t.readyState<2||!t.videoWidth)return;this.ctx.drawImage(t,0,0,ci,Wi);const o=this.ctx.getImageData(0,0,ci,Wi).data;let c=0;for(let y=0,E=0;y<ci*Wi;y++,E+=4){const R=Ta[o[E]],P=Ta[o[E+1]],I=Ta[o[E+2]];this.lin[y*3]=R,this.lin[y*3+1]=P,this.lin[y*3+2]=I,c+=.2126*R+.7152*P+.0722*I}this.mean=c/(ci*Wi),this.gain=Math.min(this.realism?1.25:Ti.maxGain,Math.max(1,Ti.targetMean/Math.max(this.mean,.001)));const l=this.gain;this.readFace(t,i),this.blur.fill(0);const h=ci/Bs,u=Wi/Ea;for(let y=0;y<Wi;y++)for(let E=0;E<ci;E++){const R=(Math.floor(y/u)*Bs+Math.floor(E/h))*3,P=(y*ci+E)*3,I=this.blur;I[R]=I[R]+this.lin[P],I[R+1]=I[R+1]+this.lin[P+1],I[R+2]=I[R+2]+this.lin[P+2]}for(let y=0;y<this.blur.length;y++)this.blur[y]=this.blur[y]/(h*u);const f=e.f/e.w,d=e.f/e.h;let m=0;for(let y=0;y<Bs*Ea;y++)m+=.2126*this.blur[y*3]+.7152*this.blur[y*3+1]+.0722*this.blur[y*3+2];m/=Bs*Ea;const v=this.faceConf>0?Math.min(2.5,Math.max(.4,this.faceLum/.35/Math.max(m*2.2,.001))):1,g=Ti.back*(1+(v-1)*this.faceConf);let p=0,_=0,x=0,M=0;for(let y=0;y<Sa;y++){const E=((y+.5)/Sa-.5)*Math.PI,R=Math.sin(E),P=Math.cos(E);for(let I=0;I<Os;I++){const F=((I+.5)/Os-.5)*Math.PI*2;let H=Math.cos(F)*P;const $=Math.sin(F)*P,B=i?-H:H,Y=$<0,it=Math.max(Math.abs($),.05),mt=.5+B/it*f/Ti.spread,vt=.5-R/it*d/Ti.spread,St=Math.min(1,Math.max(0,mt)),Ct=Math.min(1,Math.max(0,vt)),Ut=(Math.min(Ea-1,Math.floor(Ct*Ea))*Bs+Math.min(Bs-1,Math.floor(St*Bs)))*3;let V,X,z;if(Y){const et=(Math.min(Wi-1,Math.floor(Ct*Wi))*ci+Math.min(ci-1,Math.floor(St*ci)))*3,Q=Math.max(Math.abs(mt-.5)-.5,Math.abs(vt-.5)-.5,0),st=Math.min(1,Q/.4);V=this.lin[et]+(this.blur[Ut]-this.lin[et])*st,X=this.lin[et+1]+(this.blur[Ut+1]-this.lin[et+1])*st,z=this.lin[et+2]+(this.blur[Ut+2]-this.lin[et+2])*st}else V=this.blur[Ut]*g,X=this.blur[Ut+1]*g,z=this.blur[Ut+2]*g;V*=l,X*=l,z*=l;const W=(y*Os+I)*3,G=this.primed?.28:1;V=this.smooth[W]=this.smooth[W]+(V-this.smooth[W])*G,X=this.smooth[W+1]=this.smooth[W+1]+(X-this.smooth[W+1])*G,z=this.smooth[W+2]=this.smooth[W+2]+(z-this.smooth[W+2])*G;const tt=(y*Os+I)*4;this.data[tt]=zc.toHalfFloat(V),this.data[tt+1]=zc.toHalfFloat(X),this.data[tt+2]=zc.toHalfFloat(z),this.data[tt+3]=zc.toHalfFloat(1);const at=.2126*V+.7152*X+.0722*z,N=at*P;H=Math.cos(F)*P,p+=N*H,_+=N*R,x+=N*$,M+=N}}this.primed=!0,this.tex.needsUpdate=!0,this.rt=this.pmrem.fromEquirectangular(this.tex,this.rt),this.scene.environment=this.rt.texture,this.scene.environmentIntensity=Ti.envIntensity;const w=Math.hypot(p,_,x);this.share=M>0?w/M:0;const T=(w>1e-6?new C(p/w,_/w,x/w):this.keyDir.clone()).clone().lerp(this.faceDir,.65*this.faceConf).normalize();this.keyDir.lerp(T,.25).normalize(),this.dir.copy(this.keyDir),this.dir.y<.15&&(this.dir.y=.15,this.dir.normalize());const A=this.faceConf>0?Math.min(1,this.faceDir.clone().setZ(0).length()*1.4):this.share,b=Ti.key*(this.share+(A-this.share)*this.faceConf*.6)*(M/(Os*Sa))*2;this.keyI+=(b-this.keyI)*(this.keyI===0?1:.25),this.key.intensity=this.keyI,this.fill.intensity=Ti.fill*(this.realism?.25:1)*Math.min(1,Math.max(0,1-this.mean/.22)),this.key.position.copy(this.target).addScaledVector(this.dir,4)}readFace(t,e){const i=this.face;if(!i||i.w<.04){this.faceConf*=.9;return}const s=i.probe.map(P=>P.x),r=i.probe.map(P=>P.y),a=Math.min(...s),o=Math.max(...s),c=Math.min(...r),l=Math.max(...r),h=.15,u=(o-a)*(1+h*2),f=(l-c)*(1+h*2),d=a-(o-a)*h,m=c-(l-c)*h,v=t.videoWidth,g=t.videoHeight;if(u<=0||f<=0||!v)return;this.fctx.drawImage(t,d*v,m*g,u*v,f*g,0,0,Xi,Xi);const p=this.fctx.getImageData(0,0,Xi,Xi).data,_=i.probe.map(P=>{const I=Math.round((P.x-d)/u*(Xi-1)),F=Math.round((P.y-m)/f*(Xi-1));let H=0,$=0;for(let B=-1;B<=1;B++)for(let Y=-1;Y<=1;Y++){const it=Math.min(Xi-1,Math.max(0,I+Y)),mt=Math.min(Xi-1,Math.max(0,F+B)),vt=(mt*Xi+it)*4;H+=.2126*Ta[p[vt]]+.7152*Ta[p[vt+1]]+.0722*Ta[p[vt+2]],$++}return H/$}),[x,M,w,S,T]=_,A=(x+M+w+S+T)/5,b=(w-S)/Math.max(w+S,1e-4),y=(x-M)/Math.max(x+M,1e-4),E=new C(b*2.2*(e?-1:1),Math.max(.1,y*1+.35),.75).normalize(),R=Math.min(1,Math.max(0,(i.w-.04)/.08));this.faceDir.lerp(E,.3).normalize(),this.faceLum+=(A-this.faceLum)*.3,this.faceConf+=(R-this.faceConf)*.3}aimShadows(t,e){if(!t.length)return;const i=new C;for(const a of t)i.add(a);i.multiplyScalar(1/t.length),e&&(i.x=-i.x);let s=1.4;for(const a of t)s=Math.max(s,Math.hypot((e?-a.x:a.x)-i.x,a.y-i.y,a.z-i.z)+1.4);this.target.copy(i),this.key.target.position.copy(i),this.key.position.copy(i).addScaledVector(this.dir,4);const r=this.key.shadow.camera;r.right!==s&&(r.left=-s,r.right=s,r.top=s,r.bottom=-s,r.near=.1,r.far=4+s*2,r.updateProjectionMatrix())}}const Aa={tauN:1,tauH:.6,imuAgree:35,footVis:.5};class g6{n=new C(0,1,0);h=-1.4;source="assumed";fromFeet=!1;bodyUp=new C(0,1,0);bodyW=0;update(t,e,i){const s=1-Math.exp(-i/Aa.tauN),r=1-Math.exp(-i/Aa.tauH),a=new C;let o=0;for(const d of t){if(d.lost||d.presence<.5)continue;const m=x=>new C(d.world[x].x,d.world[x].y,d.world[x].z),v=m(U.shL).add(m(U.shR)).multiplyScalar(.5),g=Math.min(d.world[U.anL].v,d.world[U.anR].v),p=g>Aa.footVis?m(U.anL).add(m(U.anR)).multiplyScalar(.5):m(U.hipL).add(m(U.hipR)).multiplyScalar(.5),_=v.sub(p);_.lengthSq()<1e-4||(a.addScaledVector(_.normalize(),d.presence*(g>Aa.footVis?1:.6)),o+=d.presence)}o>0&&a.lengthSq()>1e-6&&(a.normalize(),this.bodyUp.lerp(a,this.bodyW>0?s*.5:1).normalize(),this.bodyW=Math.min(1,this.bodyW+i));let c=null;const l=Math.cos(ss.degToRad(Aa.imuAgree));e&&(this.bodyW===0||e.dot(this.bodyUp)>l)?(c=e,this.source="motion"):this.bodyW>0&&(c=this.bodyUp,this.source="body"),c&&this.n.lerp(c,s).normalize();let h=0,u=0,f=!1;for(const d of t){if(d.lost||d.presence<.5)continue;const m=_=>this.n.x*(d.T.x+d.world[_].x)+this.n.y*(d.T.y+d.world[_].y)+this.n.z*(d.T.z+d.world[_].z);let v=1/0;for(const[_,x]of[[U.heelL,.02],[U.heelR,.02],[U.toeL,.02],[U.toeR,.02],[U.anL,.08],[U.anR,.08]])d.world[_].v>Aa.footVis&&(v=Math.min(v,m(_)-x));if(v<1/0){h+=v*d.presence,u+=d.presence,f=!0;continue}const g=(m(U.hipL)+m(U.hipR))/2,p=Math.max(.6,Math.min(1.1,d.len.thigh+d.len.shin+.08));h+=(g-p)*d.presence*.4,u+=d.presence*.4}u>0&&(this.h+=(h/u-this.h)*r,this.fromFeet=f)}foot(t,e=new C){return e.copy(t).addScaledVector(this.n,this.h-this.n.dot(t))}height(t){return this.n.dot(t)-this.h}axes(){const t=new C(0,0,-1).addScaledVector(this.n,this.n.z).normalize(),e=new C().crossVectors(t,this.n).normalize();return{back:t,side:e}}get cameraHeight(){return-this.h}}const _r={coupling:.08,deadzone:2,restitution:.55,pupil:.46},v6=new os({color:16777215,side:Se,depthTest:!1,toneMapped:!1}),x6=new os({color:657930,side:Se,depthTest:!1,toneMapped:!1}),_6=new os({color:10132122,side:Se,depthTest:!1,toneMapped:!1}),M6=new os({color:16777215,side:Se,depthTest:!1,transparent:!0,opacity:.85,toneMapped:!1}),b6=new zr(1,40),w6=new qf(.95,1.05,40),y6=new zr(1,28),S6=new zr(.16,16);class Nm{g=new ue;pupil;q=new ft(0,-.5);w=new ft;prev=[];sm=new C;primed=!1;constructor(){const t=new nt(b6,v6),e=new nt(w6,_6);this.pupil=new nt(y6,x6),this.pupil.scale.setScalar(_r.pupil);const i=new nt(S6,M6);i.position.set(-.38,.42,.003),this.pupil.position.z=.0015,e.position.z=.001,this.g.add(t,e,this.pupil,i),this.g.traverse(s=>{s.renderOrder=1100,s.frustumCulled=!1})}update(t,e,i,s){this.primed||(this.sm.copy(t.p),this.primed=!0),this.sm.lerp(t.p,1-Math.exp(-i/.05)),this.prev.push(this.sm.clone()),this.prev.length>3&&this.prev.shift();const r=new C;if(this.prev.length===3&&i>0){r.copy(this.prev[2]).addScaledVector(this.prev[1],-2).add(this.prev[0]).divideScalar(i*i);const f=r.length();r.multiplyScalar(f>_r.deadzone?(f-_r.deadzone)/f:0)}const a=new C().addScaledVector(e,-9.8).addScaledVector(r,-1).multiplyScalar(_r.coupling/Math.max(t.r,.005)),o=a.dot(t.u),c=a.dot(t.v),l=1-_r.pupil,h=4,u=Math.min(i,.1)/h;for(let f=0;f<h;f++){this.w.x+=o*u,this.w.y+=c*u,this.w.multiplyScalar(Math.exp(-2.2*u)),this.q.addScaledVector(this.w,u);const d=this.q.length();if(d>l){const m=this.q.x/d,v=this.q.y/d;this.q.set(m*l,v*l);const g=this.w.x*m+this.w.y*v;if(g>0){const p=this.w.x-g*m,_=this.w.y-g*v;this.w.set(p*.9-_r.restitution*g*m,_*.9-_r.restitution*g*v)}}}this.g.position.copy(t.p),this.g.quaternion.setFromRotationMatrix(new re().makeBasis(t.u,t.v,t.n)),this.g.scale.setScalar(t.r*s),this.g.visible=s>.02,this.pupil.position.set(this.q.x,this.q.y,.0015)}}class E6{group=new ue;eyes=new Map;update(t,e,i,s){this.group.visible=s;const r=new Set;if(s)for(const a of t){if(!a.eyes)continue;r.add(a.id);let o=this.eyes.get(a.id);if(!o){o=[new Nm,new Nm];for(const c of o)this.group.add(c.g);this.eyes.set(a.id,o)}a.eyes.forEach((c,l)=>o[l]?.update(c,e,i,a.show))}for(const[a,o]of this.eyes)if(!r.has(a)){for(const c of o)this.group.remove(c.g);this.eyes.delete(a)}}}const Hs=900,T6=`
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
  }`,A6=`
  varying float vLife; varying vec3 vColor; varying float vNear;
  void main() {
    vec2 c = gl_PointCoord - 0.5;
    float d = length(c) * 2.0;
    if (d > 1.0 || vLife <= 0.0) discard;
    float core = exp(-d * d * 5.0), halo = exp(-d * d * 1.6) * 0.45;
    // in quickly (a fast spark is metres out by a slow fade-in's end), out slowly
    float fade = smoothstep(0.0, 0.25, vLife) * smoothstep(1.0, 0.95, vLife) * vNear;
    gl_FragColor = vec4(vColor * (core * 1.6 + halo) * fade, 1.0);
  }`,R6=[16722324,11796265,16769065,2744575,9187071].map(n=>new gt(n));class C6{points;pos=new Float32Array(Hs*3);vel=new Float32Array(Hs*3);col=new Float32Array(Hs*3);size=new Float32Array(Hs);life=new Float32Array(Hs);span=new Float32Array(Hs);next=0;owed=new Map;mat;constructor(){const t=new xe;t.setAttribute("position",new $t(this.pos,3)),t.setAttribute("aColor",new $t(this.col,3)),t.setAttribute("aSize",new $t(this.size,1)),t.setAttribute("aLife",new $t(this.life,1)),this.mat=new en({vertexShader:T6,fragmentShader:A6,uniforms:{uScale:{value:800}},transparent:!0,depthWrite:!1,blending:Or,toneMapped:!1}),this.points=new j_(t,this.mat),this.points.frustumCulled=!1,this.points.renderOrder=1050}update(t,e,i,s){if(this.mat.uniforms.uScale.value=i,this.points.visible=s,!s)return;for(const o of t){const c=Math.min(1,Math.max(0,(o.open-.3)/.45));let l=(this.owed.get(o.id)??0)+c*c*110*(o.rate??1)*e;const h=o.colors?.length?o.colors:R6;for(;l>=1;){l-=1;const u=this.next;this.next=(this.next+1)%Hs;const f=.35,d=Math.random()*Math.PI*2,m=Math.random()*f,v=new C(1,0,0).cross(o.dir);v.lengthSq()<1e-4&&v.set(0,1,0),v.normalize();const g=new C().crossVectors(o.dir,v).normalize(),p=o.dir.clone().addScaledVector(v,Math.cos(d)*m).addScaledVector(g,Math.sin(d)*m-.15).normalize(),_=(1.1+Math.random()*1.1)*o.scale*(o.speed??1);this.pos[u*3]=o.p.x,this.pos[u*3+1]=o.p.y,this.pos[u*3+2]=o.p.z,this.vel[u*3]=p.x*_,this.vel[u*3+1]=p.y*_,this.vel[u*3+2]=p.z*_;const x=h[Math.floor(Math.random()*h.length)];this.col[u*3]=x.r,this.col[u*3+1]=x.g,this.col[u*3+2]=x.b,this.size[u]=(.025+Math.random()*.045)*o.scale*(o.size??1),this.span[u]=.9+Math.random()*.6,this.life[u]=1}this.owed.set(o.id,l)}const r=Math.exp(-1.6*e);for(let o=0;o<Hs;o++)this.life[o]<=0||(this.life[o]=this.life[o]-e/this.span[o],this.vel[o*3]=this.vel[o*3]*r,this.vel[o*3+2]=this.vel[o*3+2]*r,this.vel[o*3+1]=this.vel[o*3+1]*r+.5*e,this.pos[o*3]=this.pos[o*3]+this.vel[o*3]*e,this.pos[o*3+1]=this.pos[o*3+1]+this.vel[o*3+1]*e,this.pos[o*3+2]=this.pos[o*3+2]+this.vel[o*3+2]*e);const a=this.points.geometry;for(const o of["position","aColor","aSize","aLife"])a.getAttribute(o).needsUpdate=!0}}const L6=new en({transparent:!0,depthWrite:!1,toneMapped:!1,vertexShader:"varying vec2 vUv; void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }",fragmentShader:"varying vec2 vUv; void main() { float r = length(vUv - 0.5) * 2.0; gl_FragColor = vec4(0.0, 0.0, 0.0, 0.5 * pow(clamp(1.0 - r, 0.0, 1.0), 1.6)); }"}),P6=new xi(1,1),X0=12,I6=n=>({pelvis:n.pelvis.clone(),chest:n.chest.clone(),head:n.head.clone(),headVis:n.headVis,neck:n.neck.clone(),dir:Object.fromEntries(Object.entries(n.dir).map(([t,e])=>[t,e.clone()])),vis:{...n.vis}}),Vv=`
  varying vec2 vUv;
  uniform vec4 uCrop; // u0, v0, du, dv of the video shown
  uniform float uMirror;
  void main() {
    vec2 uv = position.xy * 0.5 + 0.5;
    uv.x = mix(uv.x, 1.0 - uv.x, uMirror);
    vUv = uCrop.xy + uv * uCrop.zw;
    gl_Position = vec4(position.xy, 1.0, 1.0);
  }`,D6=`
  varying vec2 vUv;
  uniform sampler2D uTex;
  void main() { gl_FragColor = vec4(texture2D(uTex, vUv).rgb, 1.0); }`;class U6{constructor(t){this.canvas=t,this.renderer=new My({canvas:t,antialias:!0,alpha:!1,powerPreference:"high-performance",preserveDrawingBuffer:!1}),this.renderer.outputColorSpace=gn,this.renderer.toneMapping=Qm,this.renderer.toneMappingExposure=1,this.renderer.shadowMap.enabled=!0,this.renderer.shadowMap.type=Ym,this.renderer.setPixelRatio(this.opts.pixelRatio),this.plainBg=new en({vertexShader:Vv,fragmentShader:D6,depthTest:!1,depthWrite:!1,toneMapped:!1,uniforms:this.bgUniforms}),this.bg=new nt(new xi(2,2),this.plainBg),this.fg=new nt(new xi(2,2),this.plainBg),this.fg.frustumCulled=!1,this.fg.renderOrder=1e3,this.fg.visible=!1,this.bg.frustumCulled=!1,this.bg.renderOrder=-1e3,this.scene.add(this.bg),this.scene.add(this.fg),this.scene.add(this.world),this.world.add(this.googly.group,this.breath.points);for(const e of this.spots)this.world.add(e,e.target);this.grain=new nt(new xi(2,2),new en({vertexShader:"varying vec2 vUv; void main() { vUv = position.xy * 0.5 + 0.5; gl_Position = vec4(position.xy, 0.0, 1.0); }",fragmentShader:`varying vec2 vUv; uniform float uTime; uniform vec2 uRes;
        float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
        void main() {
          vec2 d = vUv - 0.5; d.y *= 1.15;
          float vig = 1.0 - 0.35 * dot(d, d);
          float n = hash(floor(vUv * uRes) + fract(uTime * 7.31) * 97.0);
          gl_FragColor = vec4(vec3(vig * (0.965 + 0.035 * n)), 1.0);
        }`,uniforms:{uTime:{value:0},uRes:{value:new ft(1,1)}},depthTest:!1,depthWrite:!1,toneMapped:!1,transparent:!0,blending:jm,blendSrc:Zm,blendDst:Jm})),this.grain.frustumCulled=!1,this.grain.renderOrder=1200,this.grain.visible=!1,this.scene.add(this.grain),this.scene.add(this.camera),this.light=new m6(this.renderer,this.scene,this.world),this.rims[0].position.set(-3,2.5,-6),this.rims[1].position.set(3,2.5,-6);for(const e of this.rims)e.target.position.set(0,0,-3),this.scene.add(e,e.target)}renderer;scene=new xg;camera=new qn(50,1,.05,60);world=new ue;light;bg;bgUniforms={uTex:{value:null},uCrop:{value:new de(0,0,1,1)},uMirror:{value:0}};plainBg;videoTex=null;templates=new Map;wearers=new Map;leaving=[];lastT=-1;frameDt=0;pyramid=!1;hideWearers=!1;cloneCast=t=>t;ground=new g6;googly=new E6;breath=new C6;googlyOn=!1;breathOn=!0;spots=[0,1,2].map(()=>new IM(16777215,0,0,.24,.65,2));grain;fg;rims=[new Gu(16723349,0),new Gu(3073791,0)];opts={size:1,shadows:!0,envLight:!0,pixelRatio:Math.min(window.devicePixelRatio||1,2)};cover={s:1,ox:0,oy:0,vw:1,vh:1,cw:1,ch:1,mirror:!1};setVideo(t){this.videoTex?.dispose();const e=new Z_(t);e.colorSpace=Ji,e.minFilter=Ie,e.magFilter=Ie,e.generateMipmaps=!1,this.videoTex=e,this.bgUniforms.uTex.value=e}setBackground(t){this.bg.material=t??this.plainBg}setForeground(t){this.fg.visible=!!t,t&&(this.fg.material=t)}template(t){let e=this.templates.get(t);return e||(e=g0(rs(t)),this.templates.set(t,e)),e}hasTemplate(t){return this.templates.has(t)}worker=null;queue=[];busy=null;waiting=new Map;workerMs=new Map;prepare(t,e=!1){const i=this.templates.get(t);if(i)return Promise.resolve(i);const s=new Promise(r=>{const a=this.waiting.get(t)??[];a.push(r),this.waiting.set(t,a)});return this.busy!==t&&(this.queue=this.queue.filter(r=>r!==t),e?this.queue.unshift(t):this.queue.push(t)),this.pump(),s}isPreparing(t){return this.busy===t||this.queue.includes(t)}pump(){if(!(this.busy||!this.queue.length)){if(!this.worker)try{this.worker=new Worker(new URL(""+new URL("build.worker-BjCjHC17.js",import.meta.url).href,import.meta.url),{type:"module"}),this.worker.onmessage=t=>{const{id:e,body:i,fur:s,ms:r}=t.data;this.workerMs.set(e,r);const a=g0(rs(e),void 0,i?{body:i,fur:s}:void 0);this.finish(e,a)},this.worker.onerror=t=>{console.warn("costume worker failed; building on the main thread",t),this.worker=null,this.workerDead=!0,this.fallback()}}catch{this.workerDead=!0}if(this.workerDead){this.fallback();return}this.busy=this.queue.shift(),this.worker.postMessage({id:this.busy})}}workerDead=!1;fallback(){const t=this.busy??this.queue.shift();t&&(this.busy=t,setTimeout(()=>this.finish(t,g0(rs(t))),16))}finish(t,e){this.templates.has(t)||this.templates.set(t,e);const i=this.templates.get(t);for(const s of this.waiting.get(t)??[])s(i);this.waiting.delete(t),this.busy=null,this.pump()}layout(t,e){const i=this.canvas.clientWidth||window.innerWidth,s=this.canvas.clientHeight||window.innerHeight,r=this.opts.pixelRatio;this.renderer.getPixelRatio()!==r&&this.renderer.setPixelRatio(r);const a=this.renderer.getSize(new ft);(a.x!==i||a.y!==s)&&this.renderer.setSize(i,s,!1);const o=Math.max(i/t.w,s/t.h),c=i/o,l=s/o,h=(t.w-c)/2/t.w,u=(t.h-l)/2/t.h;this.bgUniforms.uCrop.value.set(h,u,c/t.w,l/t.h),this.bgUniforms.uMirror.value=e?1:0,this.camera.fov=ss.radToDeg(2*Math.atan(l/2/t.f)),this.camera.aspect=i/s,this.camera.updateProjectionMatrix(),this.world.scale.x=e?-1:1,this.cover={s:o,ox:(t.w-c)/2,oy:(t.h-l)/2,vw:t.w,vh:t.h,cw:i,ch:s,mirror:e}}sync(t,e,i){const s=this.lastT<0?.03333333333333333:Math.min(.1,Math.max(0,i-this.lastT));this.lastT=i,this.frameDt=s;const r=new Set;for(const a of t){const o=e(a.id);let c=this.wearers.get(a.id);c&&c.def.id!==o&&this.templates.has(o)&&(c.leaving=!0,this.leaving.push(c),this.wearers.delete(a.id),c=void 0),!(!c&&!this.templates.has(o))&&(r.add(a.id),c||(c=this.dress(a.id,o)),c.life=Math.min(1,c.life+s/.35),this.pose(c,a,i))}for(const[a,o]of this.wearers)r.has(a)||this.drop(o);this.leaving=this.leaving.filter(a=>{if(a.life-=s/.35,a.life<=0)return this.drop(a),!1;const o=t.find(c=>c.id===a.trackId);return o&&this.pose(a,o,i),!0})}dress(t,e){const{def:i,root:s,rig:r,mats:a}=this.instance(e),o={trackId:t,def:i,root:s,rig:r,mats:a,fade:0,life:0,leaving:!1,poses:[],head:0,len:null,clones:[]};return this.world.add(s),this.wearers.set(t,o),o}instance(t){const e=this.template(t),i=ky(e.root),s=new Map;i.traverse(a=>{a.isBone&&s.set(a.name,a)});const r=new Map;return i.traverse(a=>{const o=a;if(!o.isMesh&&!a.isSprite)return;const c=l=>{let h=r.get(l);return h||(h=l.clone(),h.onBeforeCompile=l.onBeforeCompile,h.customProgramCacheKey=l.customProgramCacheKey,l.userData.keepBlend?h.userData.baseOpacity=l.opacity:h.alphaHash=!0,r.set(l,h)),h};o.material=Array.isArray(o.material)?o.material.map(c):c(o.material)}),{def:e.def,root:i,rig:new p6(e.def.segs,s),mats:[...r.values()]}}drop(t){this.world.remove(t.root);for(const e of t.clones)this.dropClone(e);for(const e of t.mats)e.dispose();this.wearers.get(t.trackId)===t&&this.wearers.delete(t.trackId)}pose(t,e,i){const s=t.def,r=t.rig,a=Mf(e.world);e.face&&(a.head.copy(e.face.head),a.headVis=Math.max(a.headVis,e.face.headW));const o=this.fit(r,s,e.len);r.apply(a,i,s.idle?.tail??0,this.frameDt),s.face?.jaw&&r.setJaw((e.face?.jaw??0)*s.face.jaw,e.face?.jawSide??0),t.root.position.set(e.T.x,e.T.y,e.T.z),t.root.scale.setScalar(o);const c=e.presence*Math.max(0,Math.min(1,t.life)),l=c*c*(3-2*c);if(l!==t.fade){for(const h of t.mats)h.opacity=l*(h.userData.baseOpacity??1);t.fade=l}t.root.visible=l>.01&&!this.hideWearers,s.tick?.(t.root,i,e.face??null),t.head=(t.head+1)%X0,t.poses[t.head]=I6(a),t.len=e.len,this.posePyramid(t,o,l,i)}fit(t,e,i){const s=i.torso/t.torso*(e.fit?.size??1)*this.opts.size,r=e.fit?.limb??0,a=(c,l)=>{const h=1+(l/s/(t.len.get(c)??1)-1)*r;t.setLength(c,Math.min(1.6,Math.max(.65,h)))};for(const c of["L","R"])a("arm"+c,i.upperArm),a("thigh"+c,i.thigh),a("shin"+c,i.shin);const o=t.neckFit(i.neck/s);return t.setNeck(1+(Math.min(1.25,Math.max(.45,o))-1)*(e.fit?.head??.85)),s}dropClone(t){this.world.remove(t.root,t.shadow);for(const e of t.mats)e.dispose()}posePyramid(t,e,i,s){const r=this.pyramid?this.wearers.size>1?2:3:0,a=[];for(let v=1;v<=r;v++)for(let g=0;g<=v;g++)a.push({row:v,col:g,id:this.cloneCast(t.def.id,a.length)});for(let v=0;v<t.clones.length;v++){const g=t.clones[v],p=a[v];if(!p){this.dropClone(g),t.clones.splice(v--,1);continue}g.id!==p.id&&this.templates.has(p.id)&&(this.dropClone(g),t.clones[v]=this.makeClone(p))}for(;t.clones.length<a.length;){const v=a[t.clones.length];if(!this.templates.has(v.id)){this.prepare(v.id);break}t.clones.push(this.makeClone(v))}const o=t.rig.torso*e*3.2,c=this.ground,{back:l,side:h}=c.axes(),u=t.root.position,f=c.foot(u),d=c.height(u),m=new le().setFromUnitVectors(new C(0,0,1),c.n);for(const v of t.clones){const g=v.col-v.row/2,p=Math.round(v.row*3+Math.abs(g)*1.5);let _;for(let w=p;w>=0&&!_;w--)_=t.poses[(t.head-w+X0*4)%X0];const x=t.len?this.fit(v.rig,v.def,t.len):e;_&&v.rig.apply(_,s-p/30,v.def.idle?.tail??0);const M=f.clone().addScaledVector(l,v.row*o*.5).addScaledVector(h,g*o*.55);v.root.position.copy(M).addScaledVector(c.n,d),v.root.scale.setScalar(x),v.root.visible=i>.01;for(const w of v.mats)w.opacity=i*(w.userData.baseOpacity??1);v.shadow.position.copy(M).addScaledVector(c.n,.004),v.shadow.quaternion.copy(m),v.shadow.scale.set(o*.42,o*.26,1),v.shadow.visible=v.root.visible,v.def.tick?.(v.root,s-p/30,null)}}makeClone(t){const{def:e,root:i,rig:s,mats:r}=this.instance(t.id);i.traverse(o=>{o.castShadow=!1});const a=new nt(P6,L6);return a.renderOrder=1,this.world.add(i,a),{id:t.id,def:e,root:i,rig:s,mats:r,row:t.row,col:t.col,shadow:a}}faces(t,e,i){this.world.updateMatrixWorld();const s=this.world.matrixWorld.clone().invert(),r=[],a=[];for(const l of t){if(l.lost&&l.presence<=0)continue;const h=l.face,u=this.wearers.get(l.id),f=u&&u.root.visible&&!this.hideWearers?u:null,d=l.face?.head??Mf(l.world).head,m=(w,S,T)=>new C(w,S,T).applyQuaternion(d),v=new C(l.T.x+l.world[U.nose].x,l.T.y+l.world[U.nose].y,l.T.z+l.world[U.nose].z),g=Math.max(.3,-v.z),p=(w,S,T)=>new C((w*e.w-e.cx)/e.f*g,(e.cy-S*e.h)/e.f*g,-g).addScaledVector(m(0,0,1),T);let _=null,x=null;if(f){f.root.updateMatrixWorld(!0);const w=f.rig.bones.get("head"),S=f.def.segs.find(E=>E.name==="head"),T=w?s.clone().multiply(w.matrixWorld):null,A=f.root.scale.x;if(T&&S&&f.def.face?.eyes){const E=new C(1,0,0).transformDirection(T),R=new C(0,1,0).transformDirection(T),P=new C(0,0,1).transformDirection(T);_=f.def.face.eyes.map(([I,F,H,$])=>({p:new C(I-S.a[0],F-S.a[1],H-S.a[2]).applyMatrix4(T),u:E,v:R,n:P,r:$*A*1.15}))}const b=f.rig.bones.get("jaw"),y=f.def.segs.find(E=>E.name==="jaw");if(b&&y&&f.def.face?.jaw){const E=s.clone().multiply(b.matrixWorld);x={p:new C(y.b[0]-y.a[0],y.b[1]-y.a[1],y.b[2]-y.a[2]).applyMatrix4(E),dir:new C(0,-.2,1).transformDirection(T??E),scale:A*10}}else if(T&&S){const E=new C(0,0,1).transformDirection(T);x={p:(h?p(h.mouth.x,h.mouth.y,0):v.clone()).addScaledVector(E,.12*A*10),dir:E.clone().add(new C(0,-.2,0)).normalize(),scale:A*10}}}if(!_&&h){const w=m(1,0,0),S=m(0,1,0),T=m(0,0,1);_=h.eyes.map(A=>({p:p(A.x,A.y,.02),u:w,v:S,n:T,r:Math.max(.012,A.r*e.w/e.f*g*1.35)}))}!x&&h&&(x={p:p(h.mouth.x,h.mouth.y,.03),dir:m(0,-.2,1).normalize(),scale:1}),r.push({id:l.id,eyes:_,show:l.presence});const M=f?.def.face?.breath;x&&h&&a.push({id:l.id,...x,open:h.jaw*l.presence,colors:M?.colors.map(w=>new gt(w)),rate:M?.rate,speed:M?.speed,size:M?.size})}this.googly.update(r,this.ground.n,i,this.googlyOn);let o=null;for(const l of t)!l.lost&&l.face?.read&&l.face.probe&&(!o||l.face.mouth.w>o.face.mouth.w)&&(o=l);this.light.face=o?{probe:o.face.probe,w:o.face.mouth.w*2.4}:null;const c=this.renderer.getDrawingBufferSize(new ft).y;this.breath.update(a,i,c/(2*Math.tan(ss.degToRad(this.camera.fov)/2)),this.breathOn)}setGrain(t,e){this.grain.visible=t;const i=this.grain.material.uniforms;i.uTime.value=e;const s=this.renderer.getDrawingBufferSize(new ft);i.uRes.value.set(s.x/1.5,s.y/1.5)}stageSpots(t,e,i,s,r){const a=this.ground,{back:o,side:c}=a.axes(),l=a.foot(r??new C(0,-.3,-3)),h=l.clone().addScaledVector(o,1.1),u=[16769728,16726696,3856639],f=d=>{const m=co(d,s);return new ft(m.x,1-m.y)};return this.spots.map((d,m)=>{const v=l.clone().addScaledVector(c,(m-1)*2.4).addScaledVector(o,.6).addScaledVector(a.n,3.6),g=h.clone().addScaledVector(c,(m-1)*.9+1.2*Math.sin(e*.33+m*2.1)).addScaledVector(o,.8*Math.cos(e*.27+m*1.3)),p=new gt(u[m]);d.color.copy(p),d.position.copy(v),d.target.position.copy(g),d.target.updateMatrixWorld(),d.intensity=t?38*(1+.8*i):0;const _=v.distanceTo(g)*Math.tan(d.angle)*.9,x=f(g),M=v.z<-.15?f(v):new ft(x.x,1.4),w=new ft(Math.abs(f(g.clone().addScaledVector(c,_)).x-x.x),Math.abs(f(g.clone().addScaledVector(o,_)).y-x.y));return{L:M,P:x,R:w,C:p.clone().multiplyScalar(1+.8*i)}})}stageLights(t,e,i){const s=[16722324,11796265,16769065,2744575,9187071];this.rims.forEach((r,a)=>{r.intensity=t?2.2+3*i:0;const o=(e*.12+a*.4)%1*s.length,c=Math.floor(o),l=o-c;r.color.setHex(s[c%s.length]).lerp(new gt(s[(c+1)%s.length]),l)})}people(){return[...this.wearers.values()].filter(t=>t.root.visible).map(t=>t.root.position.clone())}render(t,e,i){this.renderer.shadowMap.enabled=this.opts.shadows,t&&this.light.update(t,e,this.cover.mirror,i,this.people(),this.opts.envLight),this.renderer.render(this.scene,this.camera)}get count(){return this.wearers.size}}const Rs=[{id:"insitu",name:"In Situ",code:12,swatch:"radial-gradient(ellipse at 30% 85%, rgba(255,80,190,0.9), transparent 35%), radial-gradient(ellipse at 72% 80%, rgba(80,220,255,0.9), transparent 35%), linear-gradient(160deg, transparent 40%, rgba(255,240,220,0.35) 50%, transparent 60%), #2a2430"},{id:"tunnel",name:"Tunnel",code:9,swatch:"repeating-radial-gradient(circle, #ff2d95 0 3px, #12071f 3px 8px, #2ee6ff 8px 11px, #12071f 11px 16px)"},{id:"lasers",name:"Lasers",code:10,swatch:"linear-gradient(115deg, transparent 46%, #b6ff2e 48%, transparent 50%), linear-gradient(65deg, transparent 46%, #ff2d95 48%, transparent 50%), linear-gradient(90deg, transparent 47%, #2ee6ff 49%, transparent 51%), #07040d"},{id:"kaleido",name:"Kaleido",code:11,swatch:"conic-gradient(#ff2d95, #ffe62e, #b6ff2e, #2ee6ff, #8a2eff, #ff2d95)"},{id:"rings",name:"Rings",code:5,swatch:"repeating-radial-gradient(circle, #ff3d7f 0 5px, #ffb23d 5px 10px, #3dd6ff 10px 15px, #8c5cff 15px 20px)"},{id:"neon",name:"Neon",code:4,swatch:"radial-gradient(circle, transparent 0 40%, #39ff9c 42% 50%, transparent 54%), #06030f"},{id:"pop",name:"Pop Art",code:1,swatch:"radial-gradient(circle at 30% 30%, #ffde00 0 22%, transparent 23%), radial-gradient(circle at 70% 70%, #ff2d8a 0 22%, transparent 23%), #19c3ff"},{id:"warhol",name:"Warhol",code:2,swatch:"conic-gradient(#ff5fa2 0 25%, #ffd400 0 50%, #2ad4c4 0 75%, #7b5cff 0)"},{id:"echo",name:"Echoes",code:6,swatch:"linear-gradient(90deg, #1b1033, #ff2db4 40%, #2de2ff 70%, #1b1033)"},{id:"disco",name:"Disco",code:7,swatch:"radial-gradient(circle at 30% 30%, #ff4fd8, transparent 45%), radial-gradient(circle at 70% 60%, #4fd1ff, transparent 45%), radial-gradient(circle at 45% 80%, #ffe14f, transparent 40%), #120820"},{id:"solar",name:"Solarize",code:3,swatch:"linear-gradient(135deg, #1a0b3d, #ff7a00 45%, #00e5ff 55%, #2a0b3d)"},{id:"spot",name:"Spotlight",code:0,swatch:"radial-gradient(circle at 50% 40%, #fff6d8, #6a5a40 45%, #120f0a 75%)"}],N6=[[2757440,16727435,16756736,16774084],[731722,46023,16740156,16776160],[2951947,9321727,3997598,16382065],[1058330,16723502,3065343,16769520]],fh=12,wl=`
  varying vec2 vUv;
  void main() { vUv = position.xy * 0.5 + 0.5; gl_Position = vec4(position.xy, 0.0, 1.0); }`,F6=`
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
  }`,k6=`
  varying vec2 vUv;
  uniform sampler2D uTex, uMask;
  uniform vec4 uOn;
  void main() {
    vec4 m = smoothstep(0.3, 0.7, texture2D(uMask, vec2(vUv.x, 1.0 - vUv.y))) * uOn;
    gl_FragColor = vec4(texture2D(uTex, vUv).rgb, max(max(m.r, m.g), max(m.b, m.a)));
  }`,O6=`
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
  ${F6}

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
    return texture(uHist, vec3(q, mod(uHead - delay + ${fh}.0 * 8.0, ${fh}.0)));
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
  }`,B6=`
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
  }`,H6=`
  varying vec2 vUv;
  uniform sampler2D uSrc;
  uniform vec2 uDir;
  void main() {
    vec3 c = texture2D(uSrc, vUv).rgb * 0.2270270;
    c += (texture2D(uSrc, vUv + uDir * 1.3846154).rgb + texture2D(uSrc, vUv - uDir * 1.3846154).rgb) * 0.3162162;
    c += (texture2D(uSrc, vUv + uDir * 3.2307692).rgb + texture2D(uSrc, vUv - uDir * 3.2307692).rgb) * 0.0702703;
    gl_FragColor = vec4(c, 1.0);
  }`,Fm=`
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
  }`;class z6{material;foreground;_preset=Rs[0];get preset(){return this._preset}set preset(t){t!==this._preset&&(this.fromCode=this._preset.code,this.xfade=this.started?0:1,this._preset=t)}fromCode=0;xfade=1;started=!1;rtOld=null;subjects=2;beat=0;setSpots(t,e){const i=this.scene.uniforms;t.forEach((s,r)=>{i.uSpotL.value[r].copy(s.L),i.uSpotP.value[r].copy(s.P),i.uSpotR.value[r].copy(s.R),i.uSpotC.value[r].copy(s.C)}),i.uSpotK.value=e}clones=!0;pyramid=!0;maskTex;maskData=new Uint8Array(4);mw=0;mh=0;fw=0;fh=0;fxTex;fxData;chans=[null,null,null,null];chanMask=[null,null,null,null];union;dist;trail;stamp;uOn=new de;box=new de(.35,.1,.65,.7);quad=new nt(new xi(2,2));quadScene=new xg;cam=new Yf(-1,1,1,-1,0,1);cut;scene;bright;blur;rtScene=[];rtB1a=null;rtB1b=null;rtB2a=null;rtB2b=null;hist=null;head=0;flip=0;sizeKey="";constructor(t,e){this.maskTex=new Ga(new Uint8Array(4),1,1,cn),this.maskTex.needsUpdate=!0,this.resizeFx(160,90);const i={depthTest:!1,depthWrite:!1,toneMapped:!1};this.cut=new en({...i,vertexShader:wl,fragmentShader:k6,uniforms:{uTex:t.uTex,uMask:{value:this.maskTex},uOn:{value:this.uOn}}}),this.scene=new en({...i,vertexShader:wl,fragmentShader:O6,uniforms:{uTex:t.uTex,uMask:{value:this.maskTex},uFx:{value:this.fxTex},uPrev:{value:null},uHist:{value:null},uHead:{value:0},uClones:{value:1},uPyramid:{value:1},uSpotL:{value:[0,1,2].map(()=>new ft(.5,1.2))},uSpotP:{value:[0,1,2].map(()=>new ft(.5,.1))},uSpotR:{value:[0,1,2].map(()=>new ft(.1,.04))},uSpotC:{value:[0,1,2].map(()=>new gt(0,0,0))},uSpotK:{value:0},uClone:{value:Array.from({length:9},()=>new de)},uCloneN:{value:0},uFoot:{value:new ft(.5,.1)},uFootW:{value:.2},uTime:{value:0},uAspect:{value:1},uBeat:{value:0},uLevel:{value:0},uPreset:{value:0},uOn:{value:this.uOn},uBox:{value:this.box},uPal:{value:N6.flat().map(s=>new gt(s))}}}),this.bright=new en({...i,vertexShader:wl,fragmentShader:B6,uniforms:{uSrc:{value:null},uTexel:{value:new ft},uThreshold:{value:.72}}}),this.blur=new en({...i,vertexShader:wl,fragmentShader:H6,uniforms:{uSrc:{value:null},uDir:{value:new ft}}}),this.material=new en({...i,vertexShader:e,fragmentShader:Fm,uniforms:{uCrop:t.uCrop,uMirror:t.uMirror,uScene:{value:null},uBloom1:{value:null},uBloom2:{value:null},uTime:{value:0},uBeat:{value:0},uFlash:{value:1},uRes:{value:new ft(1,1)},uOld:{value:null},uMix:{value:1},uCA:{value:1},uBloomK:{value:1}}}),this.foreground=new en({...i,vertexShader:e,fragmentShader:Fm,transparent:!0,defines:{FG:1},uniforms:{...this.material.uniforms,uMask:this.scene.uniforms.uMask,uOn:this.scene.uniforms.uOn}}),this.quad.frustumCulled=!1,this.quadScene.add(this.quad)}resizeFx(t,e){this.fxTex?.dispose(),this.fxData=new Uint8Array(t*e*4),this.fxTex=new Ga(this.fxData,t,e,cn),this.fxTex.magFilter=Ie,this.fxTex.minFilter=Ie,this.union=new Float32Array(t*e),this.dist=new Float32Array(t*e),this.trail=new Float32Array(t*e),this.stamp=new Float32Array(t*e);for(let i=0;i<t*e;i++)this.fxData[i*4]=255;this.fxTex.needsUpdate=!0,this.fw=t,this.fh=e,this.scene&&(this.scene.uniforms.uFx.value=this.fxTex)}frameDt=1/30;update(t,e,i,s,r,a){this.frameDt=e;const o=this.scene.uniforms;o.uTime.value=i,o.uAspect.value=s,o.uPreset.value=this.preset.code,o.uBeat.value=this.beat,o.uClones.value=this.clones?1:0,o.uPyramid.value=this.pyramid?1:0,this.material.uniforms.uTime.value=i,this.material.uniforms.uBeat.value=this.beat;const c=this.preset.code===12;this.material.uniforms.uCA.value=c?.25:1,this.material.uniforms.uBloomK.value=c?.45:1;const l=s>=1?160:Math.max(48,Math.round(160*s)),h=s>=1?Math.max(48,Math.round(160/s)):160;(l!==this.fw||h!==this.fh)&&this.resizeFx(l,h);const u=t.filter(g=>g.presence>0).sort((g,p)=>p.len.torso/-p.T.z-g.len.torso/-g.T.z).slice(0,this.subjects),f=new Set(u.map(g=>g.id));for(let g=0;g<4;g++)this.chans[g]!==null&&!f.has(this.chans[g])&&(this.chans[g]=null,this.chanMask[g]=null);for(const g of u){let p=this.chans.indexOf(g.id);if(p<0){if(p=this.chans.indexOf(null),p<0)continue;this.chans[p]=g.id}const _=g.det?.mask;if(_){(_.w!==this.mw||_.h!==this.mh)&&this.resizeMask(_.w,_.h);let x=this.chanMask[p];if(!x||x.length!==_.data.length)x=this.chanMask[p]=new Float32Array(_.data.length),x.set(_.data);else{const M=1-Math.exp(-e/.04),w=_.data;for(let S=0;S<w.length;S++)x[S]=x[S]+(w[S]-x[S])*M}}}const d=[0,0,0,0];for(let g=0;g<4;g++){const p=this.chans[g];p!==null&&this.chanMask[g]&&(d[g]=t.find(_=>_.id===p)?.presence??0)}if(this.uOn.set(d[0],d[1],d[2],d[3]),this.fx(e,i,d),this.layPyramid(u[0],r,a,e),!this.mw)return;const m=this.mw*this.mh,v=this.maskData;for(let g=0;g<4;g++){const p=this.chanMask[g];if(!p){for(let _=0;_<m;_++)v[_*4+g]=0;continue}for(let _=0;_<m;_++)v[_*4+g]=p[_]*255}this.maskTex.needsUpdate=!0}cloneSm=Array.from({length:9},()=>new de);cloneSmN=0;layPyramid(t,e,i,s=1/30){const r=this.scene.uniforms;if(!t||!e||!i){r.uCloneN.value=0,this.cloneSmN=0;return}const a=new C(t.T.x,t.T.y,t.T.z),o=e.foot(a),c=Math.max(1.2,Math.min(2.2,e.height(a)*1.9)),{back:l,side:h}=e.axes(),u=co(o,i),f=1-Math.exp(-s/.15),d=r.uFoot.value;this.cloneSmN===0?d.set(u.x,1-u.y):d.lerp(new ft(u.x,1-u.y),f),r.uFootW.value=Math.max(.05,this.box.z-this.box.x);const m=[];for(let g=1;g<=3;g++)for(let p=0;p<=g;p++){const _=p-g/2,x=o.clone().addScaledVector(l,g*c*.5).addScaledVector(h,_*c*.55);if(x.z>-.3)continue;const M=co(x,i);m.push({v:new de(M.x,1-M.y,-o.z/-x.z,g*3+Math.abs(_)*1.5),depth:-x.z})}m.sort((g,p)=>p.depth-g.depth);const v=r.uClone.value;m.forEach((g,p)=>{const _=this.cloneSm[p];this.cloneSmN!==m.length?_.copy(g.v):_.lerp(g.v,f),_.w=g.v.w,v[p].copy(_)}),this.cloneSmN=m.length,r.uCloneN.value=m.length}resizeMask(t,e){this.maskTex.dispose(),this.mw=t,this.mh=e,this.maskData=new Uint8Array(t*e*4),this.maskTex=new Ga(this.maskData,t,e,cn),this.maskTex.magFilter=Ie,this.maskTex.minFilter=Ie,this.scene.uniforms.uMask.value=this.maskTex,this.cut.uniforms.uMask.value=this.maskTex}fx(t,e,i){const s=this.fw,r=this.fh,a=this.union,o=this.dist;let c=s,l=r,h=-1,u=-1;for(let p=0;p<r;p++){const _=Math.min(this.mh-1,Math.floor((p+.5)/r*this.mh));for(let x=0;x<s;x++){let M=0;if(this.mw){const w=_*this.mw+Math.min(this.mw-1,Math.floor((x+.5)/s*this.mw));for(let S=0;S<4;S++){const T=this.chanMask[S];T&&(M=Math.max(M,T[w]*i[S]))}}a[p*s+x]=M,M>.5&&(x<c&&(c=x),x>h&&(h=x),p<l&&(l=p),p>u&&(u=p))}}if(h>=0){const p=1-Math.exp(-t/.12),_=c/s,x=(h+1)/s,M=1-(u+1)/r,w=1-l/r;this.box.set(this.box.x+(_-this.box.x)*p,this.box.y+(M-this.box.y)*p,this.box.z+(x-this.box.z)*p,this.box.w+(w-this.box.w)*p)}const f=1e6,d=Math.SQRT2;for(let p=0;p<s*r;p++)o[p]=a[p]>.5?0:f;for(let p=0;p<r;p++)for(let _=0;_<s;_++){const x=p*s+_;let M=o[x];_>0&&(M=Math.min(M,o[x-1]+1)),p>0&&(M=Math.min(M,o[x-s]+1),_>0&&(M=Math.min(M,o[x-s-1]+d)),_<s-1&&(M=Math.min(M,o[x-s+1]+d))),o[x]=M}for(let p=r-1;p>=0;p--)for(let _=s-1;_>=0;_--){const x=p*s+_;let M=o[x];_<s-1&&(M=Math.min(M,o[x+1]+1)),p<r-1&&(M=Math.min(M,o[x+s]+1),_<s-1&&(M=Math.min(M,o[x+s+1]+d)),_>0&&(M=Math.min(M,o[x+s-1]+d))),o[x]=M}const m=Math.exp(-t/1.1),v=e*.2%1,g=this.fxData;for(let p=0;p<s*r;p++){const _=a[p];this.trail[p]=Math.max(this.trail[p]*m,_),_>.5&&(this.stamp[p]=v),g[p*4]=Math.min(1,o[p]/48)*255,g[p*4+1]=this.trail[p]*255,g[p*4+2]=this.stamp[p]*255,g[p*4+3]=_*255}this.fxTex.needsUpdate=!0}targets(t,e,i){const r=900/Math.max(e,i),a=Math.max(64,Math.round(e*r)),o=Math.max(64,Math.round(i*r)),c=`${a}x${o}`;if(c===this.sizeKey)return;this.sizeKey=c;for(const p of[...this.rtScene,this.rtB1a,this.rtB1b,this.rtB2a,this.rtB2b,this.rtOld])p?.dispose();this.hist?.dispose();const l=t.extensions,h=l.has("EXT_color_buffer_half_float")||l.has("EXT_color_buffer_float"),u={type:h?Xr:Oi,depthBuffer:!1,magFilter:Ie,minFilter:Ie};this.bright.uniforms.uThreshold.value=h?.72:.62,this.rtScene=[new yn(a,o,u),new yn(a,o,u)],this.rtOld=new yn(a,o,u);const f=Math.max(16,Math.round(a/4)),d=Math.max(16,Math.round(o/4)),m=Math.max(8,Math.round(a/16)),v=Math.max(8,Math.round(o/16));this.rtB1a=new yn(f,d,u),this.rtB1b=new yn(f,d,u),this.rtB2a=new yn(m,v,u),this.rtB2b=new yn(m,v,u);const g=480/Math.max(e,i);this.hist=new __(Math.round(e*g),Math.round(i*g),fh,{depthBuffer:!1}),this.hist.texture.magFilter=Ie,this.hist.texture.minFilter=Ie,this.scene.uniforms.uHist.value=this.hist.texture,this.material.uniforms.uRes.value.set(a,o)}pass(t,e,i,s=0){this.quad.material=e,t.setRenderTarget(i,s),t.render(this.quadScene,this.cam)}render(t,e,i){this.targets(t,e,i);const s=t.getRenderTarget();this.head=(this.head+1)%fh,this.pass(t,this.cut,this.hist,this.head),this.scene.uniforms.uHead.value=this.head;const r=this.rtScene[this.flip],a=this.rtScene[1-this.flip];this.flip=1-this.flip,this.scene.uniforms.uPrev.value=a.texture,this.pass(t,this.scene,r),this.started=!0;const o=this.material.uniforms;if(this.xfade<1){this.xfade=Math.min(1,this.xfade+this.frameDt/.45);const d=this.scene.uniforms.uPreset.value;this.scene.uniforms.uPreset.value=this.fromCode,this.pass(t,this.scene,this.rtOld),this.scene.uniforms.uPreset.value=d,o.uOld.value=this.rtOld.texture}const c=this.xfade;o.uMix.value=c*c*(3-2*c);const l=this.bright.uniforms,h=this.blur.uniforms;l.uSrc.value=r.texture,l.uTexel.value.set(1/r.width,1/r.height),this.pass(t,this.bright,this.rtB1a);const u=(d,m,v)=>{for(let g=0;g<v;g++)h.uSrc.value=d.texture,h.uDir.value.set(1.4/d.width,0),this.pass(t,this.blur,m),h.uSrc.value=m.texture,h.uDir.value.set(0,1.4/d.height),this.pass(t,this.blur,d)};u(this.rtB1a,this.rtB1b,1),l.uSrc.value=this.rtB1a.texture,l.uTexel.value.set(1/this.rtB1a.width,1/this.rtB1a.height);const f=l.uThreshold.value;l.uThreshold.value=0,this.pass(t,this.bright,this.rtB2a),l.uThreshold.value=f,u(this.rtB2a,this.rtB2b,2),t.setRenderTarget(s),o.uScene.value=r.texture,o.uBloom1.value=this.rtB1a.texture,o.uBloom2.value=this.rtB2a.texture}}class V6{env=0;level=0;stream=null;ctx=null;an=null;buf=new Uint8Array(0);avg=0;last=0;get on(){return!!this.an}async start(){if(this.an)return;this.stream=await navigator.mediaDevices.getUserMedia({audio:{echoCancellation:!1,noiseSuppression:!1,autoGainControl:!1}});const t=window.AudioContext??window.webkitAudioContext;this.ctx=new t,await this.ctx.resume();const e=this.ctx.createMediaStreamSource(this.stream);this.an=this.ctx.createAnalyser(),this.an.fftSize=1024,this.an.smoothingTimeConstant=0,e.connect(this.an),this.buf=new Uint8Array(this.an.frequencyBinCount)}stop(){for(const t of this.stream?.getTracks()??[])t.stop();this.ctx?.close(),this.stream=null,this.ctx=null,this.an=null,this.env=0,this.level=0}update(t,e){if(this.env*=Math.exp(-t/.18),!this.an||!this.ctx)return;this.an.getByteFrequencyData(this.buf);const i=this.ctx.sampleRate/this.an.fftSize,s=Math.max(1,Math.floor(40/i)),r=Math.max(s+1,Math.ceil(160/i));let a=0;for(let c=s;c<=r;c++)a+=this.buf[c];const o=a/((r-s+1)*255);this.level+=(o-this.level)*Math.min(1,t/.1),this.avg+=(o-this.avg)*Math.min(1,t/1.2),o>this.avg*1.3+.04&&o>.22&&e-this.last>260&&(this.env=1,this.last=e)}}class G6{up=null;listening=!1;async enable(){const t=window.DeviceOrientationEvent;try{if(t?.requestPermission&&await t.requestPermission()!=="granted")return!1}catch{return!1}return this.listening||(this.listening=!0,window.addEventListener("deviceorientation",e=>{if(e.beta===null||e.gamma===null)return;const i=ss.degToRad(e.beta),s=ss.degToRad(e.gamma);(this.up??=new C).set(-Math.sin(s)*Math.cos(i),Math.sin(i),Math.cos(s)*Math.cos(i)).normalize()})),!0}upInCamera(t){if(!this.up)return null;const e=ss.degToRad(screen.orientation?.angle??window.orientation??0),i=this.up.clone().applyAxisAngle(new C(0,0,1),-e);return t==="user"&&(i.x=-i.x,i.z=-i.z),i}}const De={tauJaw:.05,tauBlink:.04,tauLook:.06,tauShape:.1,tauPlace:.05,tauTurn:.07,tauTrust:.25,tauBias:.6,tauBiasRelax:2.5,forgetMs:400,perFrame:2,crop:2.4,cropPx:320,budgetMs:12},W6=new le,X6=new C(0,0,-1);class q6{lm=null;inferMs=0;canvas=document.createElement("canvas");ctx;tried=new Map;n=0;M=new re;v1=new C;v2=new C;constructor(){this.canvas.width=this.canvas.height=De.cropPx,this.ctx=this.canvas.getContext("2d")}async load(){const e=await Xm(()=>import("./vision_bundle-Bk4VIwNi.js"),[],import.meta.url),i=await e.FilesetResolver.forVisionTasks("./mediapipe"),s=r=>e.FaceLandmarker.createFromOptions(i,{baseOptions:{modelAssetPath:"./models/face_landmarker.task",delegate:r},runningMode:"IMAGE",numFaces:1,outputFaceBlendshapes:!0,outputFacialTransformationMatrixes:!0,minFaceDetectionConfidence:.4,minFacePresenceConfidence:.4});try{this.lm=await s("GPU")}catch{this.lm=await s("CPU")}}detect(t,e,i){const s=new Map;if(!this.lm)return s;this.n++;const r=e.filter(l=>!l.lost&&l.presence>.2).sort((l,h)=>(this.tried.get(l.id)??-1)-(this.tried.get(h.id)??-1)),a=performance.now(),o=De.cropPx,c=this.ctx;for(const l of r.slice(0,De.perFrame)){if(s.size&&performance.now()-a>De.budgetMs)break;this.tried.set(l.id,this.n);const h=$6(l,i.w,i.h);if(!h)continue;c.fillStyle="#000",c.fillRect(0,0,o,o),c.drawImage(t,h.x,h.y,h.s,h.s,0,0,o,o);const u=this.lm.detect(this.canvas),f=u.faceLandmarks[0];if(!f||Math.hypot(f[1].x-.5,f[1].y-.5)>.3)continue;const d=new Map;for(const g of u.faceBlendshapes[0]?.categories??[])d.set(g.categoryName,g.score);let m=null;const v=u.facialTransformationMatrixes?.[0];if(v?.data?.length===16){this.M.fromArray(v.data);const g=new le;this.M.decompose(this.v1,g,this.v2);const p=new C((h.x+h.s/2-i.cx)/i.f,-(h.y+h.s/2-i.cy)/i.f,-1).normalize();m=new le().setFromUnitVectors(X6,p).multiply(g)}s.set(l.id,{pts:f.map(g=>({x:(h.x+g.x*h.s)/i.w,y:(h.y+g.y*h.s)/i.h,z:g.z*h.s/i.w})),shapes:d,rot:m})}for(const l of this.tried.keys())e.some(h=>h.id===l)||this.tried.delete(l);return this.inferMs=performance.now()-a,s}close(){this.lm?.close(),this.lm=null}}function $6(n,t,e){const i=n.image,s=h=>({x:i[h].x*t,y:i[h].y*e}),r=[U.nose,U.eyeL,U.eyeR,U.earL,U.earR];let a=0,o=0;for(const h of r){const u=s(h);a+=u.x/r.length,o+=u.y/r.length}const c=(h,u)=>{const f=s(h),d=s(u);return Math.hypot(f.x-d.x,f.y-d.y)},l=De.crop*Math.max(c(U.earL,U.earR),c(U.nose,U.earL),c(U.nose,U.earR),.35*c(U.shL,U.shR));return l>24&&Number.isFinite(a+o)?{x:a-l/2,y:o-l/2,s:l}:null}const Ei=(n,t,e,i)=>n+(t-n)*(1-Math.exp(-e/i)),q0=n=>Math.max(-1,Math.min(1,n)),bf=(n,t)=>({x:(n.x+t.x)/2,y:(n.y+t.y)/2}),dh=(n,t,e)=>Math.hypot((n.x-t.x)*e,n.y-t.y);function Y6(n,t){const e=n.pts,i=(r,a)=>({...bf(e[r],e[a]),r:dh(e[r],e[a],t)*.62/t}),s=r=>n.shapes.get(r)??0;return{eyes:[i(263,362),i(33,133)],mouth:{...bf(e[13],e[14]),w:dh(e[61],e[291],t)/t},nose:e[1],probe:[e[151],e[152],e[425],e[205],e[1]].map(r=>({x:r.x,y:r.y})),jaw:Math.min(1,s("jawOpen")*1.4),blinkL:s("eyeBlinkLeft"),blinkR:s("eyeBlinkRight"),smileL:s("mouthSmileLeft"),smileR:s("mouthSmileRight"),smile:(s("mouthSmileLeft")+s("mouthSmileRight"))/2,frown:(s("mouthFrownLeft")+s("mouthFrownRight"))/2,pucker:s("mouthPucker"),funnel:s("mouthFunnel"),browUp:s("browInnerUp"),browDownL:s("browDownLeft"),browDownR:s("browDownRight"),browOuterL:s("browOuterUpLeft"),browOuterR:s("browOuterUpRight"),squintL:s("eyeSquintLeft"),squintR:s("eyeSquintRight"),wideL:s("eyeWideLeft"),wideR:s("eyeWideRight"),lookX:q0((s("eyeLookOutLeft")-s("eyeLookInLeft")+(s("eyeLookInRight")-s("eyeLookOutRight")))*.8),lookY:q0((s("eyeLookUpLeft")+s("eyeLookUpRight")-(s("eyeLookDownLeft")+s("eyeLookDownRight")))*.8),jawSide:q0((s("jawLeft")-s("jawRight"))*2),puff:s("cheekPuff"),sneer:(s("noseSneerLeft")+s("noseSneerRight"))/2}}function j6(n,t){const e=n.image,i=dh(e[U.eyeL],e[U.eyeR],t)*.3/t;return{eyes:[{x:e[U.eyeL].x,y:e[U.eyeL].y,r:i},{x:e[U.eyeR].x,y:e[U.eyeR].y,r:i}],mouth:{...bf(e[U.mouthL],e[U.mouthR]),w:dh(e[U.mouthL],e[U.mouthR],t)/t}}}function Z6(n,t,e){return{...n,eyes:n.eyes.map(i=>({...i,x:i.x+t,y:i.y+e})),mouth:{...n.mouth,x:n.mouth.x+t,y:n.mouth.y+e},nose:{x:n.nose.x+t,y:n.nose.y+e},probe:n.probe.map(i=>({x:i.x+t,y:i.y+e}))}}const J6=Object.keys(uc),K6=n=>n==="jaw"?De.tauJaw:n==="blinkL"||n==="blinkR"?De.tauBlink:n==="lookX"||n==="lookY"?De.tauLook:De.tauShape;function Q6(n,t,e,i,s){const r=e.w/e.h;for(const a of n){if(a.lost)continue;const o=t?.get(a.id)??null,c=a.image[U.nose];let l=a.face;const h=o?Y6(o,r):null,u=!h&&l?.last&&i-l.last.at<De.forgetMs?Z6(l.last.read,c.x-l.last.nose.x,c.y-l.last.nose.y):null,f=h??u,d=f??j6(a,r),m=Mf(a.world).head;l||(l=a.face={...uc,eyes:d.eyes.map(p=>({...p})),mouth:{...d.mouth},read:!!h,seen:i,head:m.clone(),headW:0,turn:null,bias:new le,trust:0,last:null});{const p=[...d.eyes,d.mouth],_=[...l.eyes,l.mouth];let x=0,M=0;p.forEach((w,S)=>{x+=w.x-_[S].x,M+=w.y-_[S].y}),x/=p.length,M/=p.length;for(const w of _)w.x+=x,w.y+=M}d.eyes.forEach((p,_)=>{const x=l.eyes[_];x.x=Ei(x.x,p.x,s,De.tauPlace),x.y=Ei(x.y,p.y,s,De.tauPlace),x.r=Ei(x.r,p.r,s,De.tauPlace*3)}),l.mouth.x=Ei(l.mouth.x,d.mouth.x,s,De.tauPlace),l.mouth.y=Ei(l.mouth.y,d.mouth.y,s,De.tauPlace),l.mouth.w=Ei(l.mouth.w,d.mouth.w,s,De.tauPlace*3);const v=f??uc;for(const p of J6)l[p]=Ei(l[p],v[p],s,K6(p));h?(l.probe?h.probe.forEach((p,_)=>{const x=l.probe[_];x.x=Ei(x.x,p.x,s,De.tauPlace),x.y=Ei(x.y,p.y,s,De.tauPlace)}):l.probe=h.probe.map(p=>({...p})),l.read=!0,l.seen=i,l.last={read:h,nose:{x:c.x,y:c.y},at:i}):!u&&i-l.seen>De.forgetMs&&(l.read=!1,l.probe=void 0),o?.rot?(l.turn?l.turn.slerp(o.rot,1-Math.exp(-s/De.tauTurn)):l.turn=o.rot.clone(),l.bias.slerp(l.turn.clone().multiply(m.clone().invert()),1-Math.exp(-s/De.tauBias)),l.trust=Ei(l.trust,1,s,De.tauTrust)):u||(l.trust=Ei(l.trust,0,s,De.tauTrust),l.bias.slerp(W6,1-Math.exp(-s/De.tauBiasRelax)));const g=l.bias.clone().multiply(m);l.head.copy(l.turn&&l.trust>.001?g.slerp(l.turn,l.trust):g),l.headW=l.trust}}const zs={people:2,model:"full",size:1,lens:.85,poseConf:.65,zoom:{},envLight:!0,shadows:!0,debug:!1,mode:"one",costume:"jimothy",scene:"costume",effect:"insitu",partyCostumes:"behind",music:!1,faces:!0,googly:!1,breath:!0,partyCast:"skeleton",pyramid:!0,cast:["jimothy","builder","skeleton","pumpkin","howler","violet","plume"],v:6},Gv="costuma26.settings";function tC(){try{const n=JSON.parse(localStorage.getItem(Gv)??"{}"),t=n.v??(Object.keys(n).length?1:zs.v),e={...zs,...n},i=e.partyCostumes;return i===!0?e.partyCostumes="on":i!=="behind"&&i!=="on"&&(e.partyCostumes="off"),t<2&&(e.effect="insitu",e.partyCostumes="behind",e.partyCast="skeleton"),t<3&&(e.model="full"),t<4&&(e.effect==="pyramid"&&(e.effect="insitu"),e.pyramid=!0),t<5&&(e.cast=[...zs.cast]),(!Array.isArray(e.cast)||!e.cast.length)&&(e.cast=[...zs.cast]),t<6&&(e.poseConf=zs.poseConf),e.poseConf>=.3&&e.poseConf<=.95||(e.poseConf=zs.poseConf),(!e.zoom||typeof e.zoom!="object")&&(e.zoom={}),e.costume==="valkyrie"&&(e.costume="violet"),e.partyCast==="valkyrie"&&(e.partyCast="violet"),e.v=zs.v,e}catch{return{...zs}}}function eC(n){try{localStorage.setItem(Gv,JSON.stringify(n))}catch{}}const Bo=n=>`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${n}</svg>`,bs={qr:Bo('<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><path d="M14 14h3v3h-3zM20 14v.01M14 20h.01M17 20h4v-3"/>'),flip:Bo('<path d="M4 7h3l2-3h6l2 3h3a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1z"/><path d="M9 13a3 3 0 0 1 5-2.2M15 13a3 3 0 0 1-5 2.2"/><path d="M14 9v2h-2M10 17v-2h2"/>'),gear:Bo('<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/>'),camera:Bo('<path d="M4 8h3l2-3h6l2 3h3a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1z"/><circle cx="12" cy="13" r="3.5"/>'),googly:'<svg viewBox="0 0 24 24"><circle cx="7.5" cy="12" r="5.5" fill="#fff" stroke="currentColor" stroke-width="1.5"/><circle cx="16.5" cy="12" r="5.5" fill="#fff" stroke="currentColor" stroke-width="1.5"/><circle cx="6.5" cy="14.2" r="2.4" fill="#111"/><circle cx="17.8" cy="13.6" r="2.4" fill="#111"/></svg>',pyramid:Bo('<circle cx="12" cy="5" r="2"/><circle cx="8" cy="12" r="2"/><circle cx="16" cy="12" r="2"/><circle cx="4" cy="19" r="2"/><circle cx="12" cy="19" r="2"/><circle cx="20" cy="19" r="2"/>'),rec:'<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="7" fill="currentColor"/></svg>',stop:'<svg viewBox="0 0 24 24"><rect x="6" y="6" width="12" height="12" rx="2" fill="currentColor"/></svg>'};function nC(n){return n&&n.__esModule&&Object.prototype.hasOwnProperty.call(n,"default")?n.default:n}var $0={exports:{}},km;function iC(){return km||(km=1,(function(n,t){var e=(function(){var i=function(w,S){var T=236,A=17,b=w,y=r[S],E=null,R=0,P=null,I=[],F={},H=function(z,W){R=b*4+17,E=(function(G){for(var tt=new Array(G),at=0;at<G;at+=1){tt[at]=new Array(G);for(var N=0;N<G;N+=1)tt[at][N]=null}return tt})(R),$(0,0),$(R-7,0),$(0,R-7),it(),Y(),vt(z,W),b>=7&&mt(z),P==null&&(P=Ut(b,y,I)),St(P,W)},$=function(z,W){for(var G=-1;G<=7;G+=1)if(!(z+G<=-1||R<=z+G))for(var tt=-1;tt<=7;tt+=1)W+tt<=-1||R<=W+tt||(0<=G&&G<=6&&(tt==0||tt==6)||0<=tt&&tt<=6&&(G==0||G==6)||2<=G&&G<=4&&2<=tt&&tt<=4?E[z+G][W+tt]=!0:E[z+G][W+tt]=!1)},B=function(){for(var z=0,W=0,G=0;G<8;G+=1){H(!0,G);var tt=o.getLostPoint(F);(G==0||z>tt)&&(z=tt,W=G)}return W},Y=function(){for(var z=8;z<R-8;z+=1)E[z][6]==null&&(E[z][6]=z%2==0);for(var W=8;W<R-8;W+=1)E[6][W]==null&&(E[6][W]=W%2==0)},it=function(){for(var z=o.getPatternPosition(b),W=0;W<z.length;W+=1)for(var G=0;G<z.length;G+=1){var tt=z[W],at=z[G];if(E[tt][at]==null)for(var N=-2;N<=2;N+=1)for(var et=-2;et<=2;et+=1)N==-2||N==2||et==-2||et==2||N==0&&et==0?E[tt+N][at+et]=!0:E[tt+N][at+et]=!1}},mt=function(z){for(var W=o.getBCHTypeNumber(b),G=0;G<18;G+=1){var tt=!z&&(W>>G&1)==1;E[Math.floor(G/3)][G%3+R-8-3]=tt}for(var G=0;G<18;G+=1){var tt=!z&&(W>>G&1)==1;E[G%3+R-8-3][Math.floor(G/3)]=tt}},vt=function(z,W){for(var G=y<<3|W,tt=o.getBCHTypeInfo(G),at=0;at<15;at+=1){var N=!z&&(tt>>at&1)==1;at<6?E[at][8]=N:at<8?E[at+1][8]=N:E[R-15+at][8]=N}for(var at=0;at<15;at+=1){var N=!z&&(tt>>at&1)==1;at<8?E[8][R-at-1]=N:at<9?E[8][15-at-1+1]=N:E[8][15-at-1]=N}E[R-8][8]=!z},St=function(z,W){for(var G=-1,tt=R-1,at=7,N=0,et=o.getMaskFunction(W),Q=R-1;Q>0;Q-=2)for(Q==6&&(Q-=1);;){for(var st=0;st<2;st+=1)if(E[tt][Q-st]==null){var ht=!1;N<z.length&&(ht=(z[N]>>>at&1)==1);var pt=et(tt,Q-st);pt&&(ht=!ht),E[tt][Q-st]=ht,at-=1,at==-1&&(N+=1,at=7)}if(tt+=G,tt<0||R<=tt){tt-=G,G=-G;break}}},Ct=function(z,W){for(var G=0,tt=0,at=0,N=new Array(W.length),et=new Array(W.length),Q=0;Q<W.length;Q+=1){var st=W[Q].dataCount,ht=W[Q].totalCount-st;tt=Math.max(tt,st),at=Math.max(at,ht),N[Q]=new Array(st);for(var pt=0;pt<N[Q].length;pt+=1)N[Q][pt]=255&z.getBuffer()[pt+G];G+=st;var _t=o.getErrorCorrectPolynomial(ht),bt=l(N[Q],_t.getLength()-1),ee=bt.mod(_t);et[Q]=new Array(_t.getLength()-1);for(var pt=0;pt<et[Q].length;pt+=1){var Kt=pt+ee.getLength()-et[Q].length;et[Q][pt]=Kt>=0?ee.getAt(Kt):0}}for(var k=0,pt=0;pt<W.length;pt+=1)k+=W[pt].totalCount;for(var L=new Array(k),J=0,pt=0;pt<tt;pt+=1)for(var Q=0;Q<W.length;Q+=1)pt<N[Q].length&&(L[J]=N[Q][pt],J+=1);for(var pt=0;pt<at;pt+=1)for(var Q=0;Q<W.length;Q+=1)pt<et[Q].length&&(L[J]=et[Q][pt],J+=1);return L},Ut=function(z,W,G){for(var tt=h.getRSBlocks(z,W),at=u(),N=0;N<G.length;N+=1){var et=G[N];at.put(et.getMode(),4),at.put(et.getLength(),o.getLengthInBits(et.getMode(),z)),et.write(at)}for(var Q=0,N=0;N<tt.length;N+=1)Q+=tt[N].dataCount;if(at.getLengthInBits()>Q*8)throw"code length overflow. ("+at.getLengthInBits()+">"+Q*8+")";for(at.getLengthInBits()+4<=Q*8&&at.put(0,4);at.getLengthInBits()%8!=0;)at.putBit(!1);for(;!(at.getLengthInBits()>=Q*8||(at.put(T,8),at.getLengthInBits()>=Q*8));)at.put(A,8);return Ct(at,tt)};F.addData=function(z,W){W=W||"Byte";var G=null;switch(W){case"Numeric":G=f(z);break;case"Alphanumeric":G=d(z);break;case"Byte":G=m(z);break;case"Kanji":G=v(z);break;default:throw"mode:"+W}I.push(G),P=null},F.isDark=function(z,W){if(z<0||R<=z||W<0||R<=W)throw z+","+W;return E[z][W]},F.getModuleCount=function(){return R},F.make=function(){if(b<1){for(var z=1;z<40;z++){for(var W=h.getRSBlocks(z,y),G=u(),tt=0;tt<I.length;tt++){var at=I[tt];G.put(at.getMode(),4),G.put(at.getLength(),o.getLengthInBits(at.getMode(),z)),at.write(G)}for(var N=0,tt=0;tt<W.length;tt++)N+=W[tt].dataCount;if(G.getLengthInBits()<=N*8)break}b=z}H(!1,B())},F.createTableTag=function(z,W){z=z||2,W=typeof W>"u"?z*4:W;var G="";G+='<table style="',G+=" border-width: 0px; border-style: none;",G+=" border-collapse: collapse;",G+=" padding: 0px; margin: "+W+"px;",G+='">',G+="<tbody>";for(var tt=0;tt<F.getModuleCount();tt+=1){G+="<tr>";for(var at=0;at<F.getModuleCount();at+=1)G+='<td style="',G+=" border-width: 0px; border-style: none;",G+=" border-collapse: collapse;",G+=" padding: 0px; margin: 0px;",G+=" width: "+z+"px;",G+=" height: "+z+"px;",G+=" background-color: ",G+=F.isDark(tt,at)?"#000000":"#ffffff",G+=";",G+='"/>';G+="</tr>"}return G+="</tbody>",G+="</table>",G},F.createSvgTag=function(z,W,G,tt){var at={};typeof arguments[0]=="object"&&(at=arguments[0],z=at.cellSize,W=at.margin,G=at.alt,tt=at.title),z=z||2,W=typeof W>"u"?z*4:W,G=typeof G=="string"?{text:G}:G||{},G.text=G.text||null,G.id=G.text?G.id||"qrcode-description":null,tt=typeof tt=="string"?{text:tt}:tt||{},tt.text=tt.text||null,tt.id=tt.text?tt.id||"qrcode-title":null;var N=F.getModuleCount()*z+W*2,et,Q,st,ht,pt="",_t;for(_t="l"+z+",0 0,"+z+" -"+z+",0 0,-"+z+"z ",pt+='<svg version="1.1" xmlns="http://www.w3.org/2000/svg"',pt+=at.scalable?"":' width="'+N+'px" height="'+N+'px"',pt+=' viewBox="0 0 '+N+" "+N+'" ',pt+=' preserveAspectRatio="xMinYMin meet"',pt+=tt.text||G.text?' role="img" aria-labelledby="'+V([tt.id,G.id].join(" ").trim())+'"':"",pt+=">",pt+=tt.text?'<title id="'+V(tt.id)+'">'+V(tt.text)+"</title>":"",pt+=G.text?'<description id="'+V(G.id)+'">'+V(G.text)+"</description>":"",pt+='<rect width="100%" height="100%" fill="white" cx="0" cy="0"/>',pt+='<path d="',st=0;st<F.getModuleCount();st+=1)for(ht=st*z+W,et=0;et<F.getModuleCount();et+=1)F.isDark(st,et)&&(Q=et*z+W,pt+="M"+Q+","+ht+_t);return pt+='" stroke="transparent" fill="black"/>',pt+="</svg>",pt},F.createDataURL=function(z,W){z=z||2,W=typeof W>"u"?z*4:W;var G=F.getModuleCount()*z+W*2,tt=W,at=G-W;return M(G,G,function(N,et){if(tt<=N&&N<at&&tt<=et&&et<at){var Q=Math.floor((N-tt)/z),st=Math.floor((et-tt)/z);return F.isDark(st,Q)?0:1}else return 1})},F.createImgTag=function(z,W,G){z=z||2,W=typeof W>"u"?z*4:W;var tt=F.getModuleCount()*z+W*2,at="";return at+="<img",at+=' src="',at+=F.createDataURL(z,W),at+='"',at+=' width="',at+=tt,at+='"',at+=' height="',at+=tt,at+='"',G&&(at+=' alt="',at+=V(G),at+='"'),at+="/>",at};var V=function(z){for(var W="",G=0;G<z.length;G+=1){var tt=z.charAt(G);switch(tt){case"<":W+="&lt;";break;case">":W+="&gt;";break;case"&":W+="&amp;";break;case'"':W+="&quot;";break;default:W+=tt;break}}return W},X=function(z){var W=1;z=typeof z>"u"?W*2:z;var G=F.getModuleCount()*W+z*2,tt=z,at=G-z,N,et,Q,st,ht,pt={"██":"█","█ ":"▀"," █":"▄","  ":" "},_t={"██":"▀","█ ":"▀"," █":" ","  ":" "},bt="";for(N=0;N<G;N+=2){for(Q=Math.floor((N-tt)/W),st=Math.floor((N+1-tt)/W),et=0;et<G;et+=1)ht="█",tt<=et&&et<at&&tt<=N&&N<at&&F.isDark(Q,Math.floor((et-tt)/W))&&(ht=" "),tt<=et&&et<at&&tt<=N+1&&N+1<at&&F.isDark(st,Math.floor((et-tt)/W))?ht+=" ":ht+="█",bt+=z<1&&N+1>=at?_t[ht]:pt[ht];bt+=`
`}return G%2&&z>0?bt.substring(0,bt.length-G-1)+Array(G+1).join("▀"):bt.substring(0,bt.length-1)};return F.createASCII=function(z,W){if(z=z||1,z<2)return X(W);z-=1,W=typeof W>"u"?z*2:W;var G=F.getModuleCount()*z+W*2,tt=W,at=G-W,N,et,Q,st,ht=Array(z+1).join("██"),pt=Array(z+1).join("  "),_t="",bt="";for(N=0;N<G;N+=1){for(Q=Math.floor((N-tt)/z),bt="",et=0;et<G;et+=1)st=1,tt<=et&&et<at&&tt<=N&&N<at&&F.isDark(Q,Math.floor((et-tt)/z))&&(st=0),bt+=st?ht:pt;for(Q=0;Q<z;Q+=1)_t+=bt+`
`}return _t.substring(0,_t.length-1)},F.renderTo2dContext=function(z,W){W=W||2;for(var G=F.getModuleCount(),tt=0;tt<G;tt++)for(var at=0;at<G;at++)z.fillStyle=F.isDark(tt,at)?"black":"white",z.fillRect(tt*W,at*W,W,W)},F};i.stringToBytesFuncs={default:function(w){for(var S=[],T=0;T<w.length;T+=1){var A=w.charCodeAt(T);S.push(A&255)}return S}},i.stringToBytes=i.stringToBytesFuncs.default,i.createStringToBytes=function(w,S){var T=(function(){for(var b=_(w),y=function(){var Y=b.read();if(Y==-1)throw"eof";return Y},E=0,R={};;){var P=b.read();if(P==-1)break;var I=y(),F=y(),H=y(),$=String.fromCharCode(P<<8|I),B=F<<8|H;R[$]=B,E+=1}if(E!=S)throw E+" != "+S;return R})(),A=63;return function(b){for(var y=[],E=0;E<b.length;E+=1){var R=b.charCodeAt(E);if(R<128)y.push(R);else{var P=T[b.charAt(E)];typeof P=="number"?(P&255)==P?y.push(P):(y.push(P>>>8),y.push(P&255)):y.push(A)}}return y}};var s={MODE_NUMBER:1,MODE_ALPHA_NUM:2,MODE_8BIT_BYTE:4,MODE_KANJI:8},r={L:1,M:0,Q:3,H:2},a={PATTERN000:0,PATTERN001:1,PATTERN010:2,PATTERN011:3,PATTERN100:4,PATTERN101:5,PATTERN110:6,PATTERN111:7},o=(function(){var w=[[],[6,18],[6,22],[6,26],[6,30],[6,34],[6,22,38],[6,24,42],[6,26,46],[6,28,50],[6,30,54],[6,32,58],[6,34,62],[6,26,46,66],[6,26,48,70],[6,26,50,74],[6,30,54,78],[6,30,56,82],[6,30,58,86],[6,34,62,90],[6,28,50,72,94],[6,26,50,74,98],[6,30,54,78,102],[6,28,54,80,106],[6,32,58,84,110],[6,30,58,86,114],[6,34,62,90,118],[6,26,50,74,98,122],[6,30,54,78,102,126],[6,26,52,78,104,130],[6,30,56,82,108,134],[6,34,60,86,112,138],[6,30,58,86,114,142],[6,34,62,90,118,146],[6,30,54,78,102,126,150],[6,24,50,76,102,128,154],[6,28,54,80,106,132,158],[6,32,58,84,110,136,162],[6,26,54,82,110,138,166],[6,30,58,86,114,142,170]],S=1335,T=7973,A=21522,b={},y=function(E){for(var R=0;E!=0;)R+=1,E>>>=1;return R};return b.getBCHTypeInfo=function(E){for(var R=E<<10;y(R)-y(S)>=0;)R^=S<<y(R)-y(S);return(E<<10|R)^A},b.getBCHTypeNumber=function(E){for(var R=E<<12;y(R)-y(T)>=0;)R^=T<<y(R)-y(T);return E<<12|R},b.getPatternPosition=function(E){return w[E-1]},b.getMaskFunction=function(E){switch(E){case a.PATTERN000:return function(R,P){return(R+P)%2==0};case a.PATTERN001:return function(R,P){return R%2==0};case a.PATTERN010:return function(R,P){return P%3==0};case a.PATTERN011:return function(R,P){return(R+P)%3==0};case a.PATTERN100:return function(R,P){return(Math.floor(R/2)+Math.floor(P/3))%2==0};case a.PATTERN101:return function(R,P){return R*P%2+R*P%3==0};case a.PATTERN110:return function(R,P){return(R*P%2+R*P%3)%2==0};case a.PATTERN111:return function(R,P){return(R*P%3+(R+P)%2)%2==0};default:throw"bad maskPattern:"+E}},b.getErrorCorrectPolynomial=function(E){for(var R=l([1],0),P=0;P<E;P+=1)R=R.multiply(l([1,c.gexp(P)],0));return R},b.getLengthInBits=function(E,R){if(1<=R&&R<10)switch(E){case s.MODE_NUMBER:return 10;case s.MODE_ALPHA_NUM:return 9;case s.MODE_8BIT_BYTE:return 8;case s.MODE_KANJI:return 8;default:throw"mode:"+E}else if(R<27)switch(E){case s.MODE_NUMBER:return 12;case s.MODE_ALPHA_NUM:return 11;case s.MODE_8BIT_BYTE:return 16;case s.MODE_KANJI:return 10;default:throw"mode:"+E}else if(R<41)switch(E){case s.MODE_NUMBER:return 14;case s.MODE_ALPHA_NUM:return 13;case s.MODE_8BIT_BYTE:return 16;case s.MODE_KANJI:return 12;default:throw"mode:"+E}else throw"type:"+R},b.getLostPoint=function(E){for(var R=E.getModuleCount(),P=0,I=0;I<R;I+=1)for(var F=0;F<R;F+=1){for(var H=0,$=E.isDark(I,F),B=-1;B<=1;B+=1)if(!(I+B<0||R<=I+B))for(var Y=-1;Y<=1;Y+=1)F+Y<0||R<=F+Y||B==0&&Y==0||$==E.isDark(I+B,F+Y)&&(H+=1);H>5&&(P+=3+H-5)}for(var I=0;I<R-1;I+=1)for(var F=0;F<R-1;F+=1){var it=0;E.isDark(I,F)&&(it+=1),E.isDark(I+1,F)&&(it+=1),E.isDark(I,F+1)&&(it+=1),E.isDark(I+1,F+1)&&(it+=1),(it==0||it==4)&&(P+=3)}for(var I=0;I<R;I+=1)for(var F=0;F<R-6;F+=1)E.isDark(I,F)&&!E.isDark(I,F+1)&&E.isDark(I,F+2)&&E.isDark(I,F+3)&&E.isDark(I,F+4)&&!E.isDark(I,F+5)&&E.isDark(I,F+6)&&(P+=40);for(var F=0;F<R;F+=1)for(var I=0;I<R-6;I+=1)E.isDark(I,F)&&!E.isDark(I+1,F)&&E.isDark(I+2,F)&&E.isDark(I+3,F)&&E.isDark(I+4,F)&&!E.isDark(I+5,F)&&E.isDark(I+6,F)&&(P+=40);for(var mt=0,F=0;F<R;F+=1)for(var I=0;I<R;I+=1)E.isDark(I,F)&&(mt+=1);var vt=Math.abs(100*mt/R/R-50)/5;return P+=vt*10,P},b})(),c=(function(){for(var w=new Array(256),S=new Array(256),T=0;T<8;T+=1)w[T]=1<<T;for(var T=8;T<256;T+=1)w[T]=w[T-4]^w[T-5]^w[T-6]^w[T-8];for(var T=0;T<255;T+=1)S[w[T]]=T;var A={};return A.glog=function(b){if(b<1)throw"glog("+b+")";return S[b]},A.gexp=function(b){for(;b<0;)b+=255;for(;b>=256;)b-=255;return w[b]},A})();function l(w,S){if(typeof w.length>"u")throw w.length+"/"+S;var T=(function(){for(var b=0;b<w.length&&w[b]==0;)b+=1;for(var y=new Array(w.length-b+S),E=0;E<w.length-b;E+=1)y[E]=w[E+b];return y})(),A={};return A.getAt=function(b){return T[b]},A.getLength=function(){return T.length},A.multiply=function(b){for(var y=new Array(A.getLength()+b.getLength()-1),E=0;E<A.getLength();E+=1)for(var R=0;R<b.getLength();R+=1)y[E+R]^=c.gexp(c.glog(A.getAt(E))+c.glog(b.getAt(R)));return l(y,0)},A.mod=function(b){if(A.getLength()-b.getLength()<0)return A;for(var y=c.glog(A.getAt(0))-c.glog(b.getAt(0)),E=new Array(A.getLength()),R=0;R<A.getLength();R+=1)E[R]=A.getAt(R);for(var R=0;R<b.getLength();R+=1)E[R]^=c.gexp(c.glog(b.getAt(R))+y);return l(E,0).mod(b)},A}var h=(function(){var w=[[1,26,19],[1,26,16],[1,26,13],[1,26,9],[1,44,34],[1,44,28],[1,44,22],[1,44,16],[1,70,55],[1,70,44],[2,35,17],[2,35,13],[1,100,80],[2,50,32],[2,50,24],[4,25,9],[1,134,108],[2,67,43],[2,33,15,2,34,16],[2,33,11,2,34,12],[2,86,68],[4,43,27],[4,43,19],[4,43,15],[2,98,78],[4,49,31],[2,32,14,4,33,15],[4,39,13,1,40,14],[2,121,97],[2,60,38,2,61,39],[4,40,18,2,41,19],[4,40,14,2,41,15],[2,146,116],[3,58,36,2,59,37],[4,36,16,4,37,17],[4,36,12,4,37,13],[2,86,68,2,87,69],[4,69,43,1,70,44],[6,43,19,2,44,20],[6,43,15,2,44,16],[4,101,81],[1,80,50,4,81,51],[4,50,22,4,51,23],[3,36,12,8,37,13],[2,116,92,2,117,93],[6,58,36,2,59,37],[4,46,20,6,47,21],[7,42,14,4,43,15],[4,133,107],[8,59,37,1,60,38],[8,44,20,4,45,21],[12,33,11,4,34,12],[3,145,115,1,146,116],[4,64,40,5,65,41],[11,36,16,5,37,17],[11,36,12,5,37,13],[5,109,87,1,110,88],[5,65,41,5,66,42],[5,54,24,7,55,25],[11,36,12,7,37,13],[5,122,98,1,123,99],[7,73,45,3,74,46],[15,43,19,2,44,20],[3,45,15,13,46,16],[1,135,107,5,136,108],[10,74,46,1,75,47],[1,50,22,15,51,23],[2,42,14,17,43,15],[5,150,120,1,151,121],[9,69,43,4,70,44],[17,50,22,1,51,23],[2,42,14,19,43,15],[3,141,113,4,142,114],[3,70,44,11,71,45],[17,47,21,4,48,22],[9,39,13,16,40,14],[3,135,107,5,136,108],[3,67,41,13,68,42],[15,54,24,5,55,25],[15,43,15,10,44,16],[4,144,116,4,145,117],[17,68,42],[17,50,22,6,51,23],[19,46,16,6,47,17],[2,139,111,7,140,112],[17,74,46],[7,54,24,16,55,25],[34,37,13],[4,151,121,5,152,122],[4,75,47,14,76,48],[11,54,24,14,55,25],[16,45,15,14,46,16],[6,147,117,4,148,118],[6,73,45,14,74,46],[11,54,24,16,55,25],[30,46,16,2,47,17],[8,132,106,4,133,107],[8,75,47,13,76,48],[7,54,24,22,55,25],[22,45,15,13,46,16],[10,142,114,2,143,115],[19,74,46,4,75,47],[28,50,22,6,51,23],[33,46,16,4,47,17],[8,152,122,4,153,123],[22,73,45,3,74,46],[8,53,23,26,54,24],[12,45,15,28,46,16],[3,147,117,10,148,118],[3,73,45,23,74,46],[4,54,24,31,55,25],[11,45,15,31,46,16],[7,146,116,7,147,117],[21,73,45,7,74,46],[1,53,23,37,54,24],[19,45,15,26,46,16],[5,145,115,10,146,116],[19,75,47,10,76,48],[15,54,24,25,55,25],[23,45,15,25,46,16],[13,145,115,3,146,116],[2,74,46,29,75,47],[42,54,24,1,55,25],[23,45,15,28,46,16],[17,145,115],[10,74,46,23,75,47],[10,54,24,35,55,25],[19,45,15,35,46,16],[17,145,115,1,146,116],[14,74,46,21,75,47],[29,54,24,19,55,25],[11,45,15,46,46,16],[13,145,115,6,146,116],[14,74,46,23,75,47],[44,54,24,7,55,25],[59,46,16,1,47,17],[12,151,121,7,152,122],[12,75,47,26,76,48],[39,54,24,14,55,25],[22,45,15,41,46,16],[6,151,121,14,152,122],[6,75,47,34,76,48],[46,54,24,10,55,25],[2,45,15,64,46,16],[17,152,122,4,153,123],[29,74,46,14,75,47],[49,54,24,10,55,25],[24,45,15,46,46,16],[4,152,122,18,153,123],[13,74,46,32,75,47],[48,54,24,14,55,25],[42,45,15,32,46,16],[20,147,117,4,148,118],[40,75,47,7,76,48],[43,54,24,22,55,25],[10,45,15,67,46,16],[19,148,118,6,149,119],[18,75,47,31,76,48],[34,54,24,34,55,25],[20,45,15,61,46,16]],S=function(b,y){var E={};return E.totalCount=b,E.dataCount=y,E},T={},A=function(b,y){switch(y){case r.L:return w[(b-1)*4+0];case r.M:return w[(b-1)*4+1];case r.Q:return w[(b-1)*4+2];case r.H:return w[(b-1)*4+3];default:return}};return T.getRSBlocks=function(b,y){var E=A(b,y);if(typeof E>"u")throw"bad rs block @ typeNumber:"+b+"/errorCorrectionLevel:"+y;for(var R=E.length/3,P=[],I=0;I<R;I+=1)for(var F=E[I*3+0],H=E[I*3+1],$=E[I*3+2],B=0;B<F;B+=1)P.push(S(H,$));return P},T})(),u=function(){var w=[],S=0,T={};return T.getBuffer=function(){return w},T.getAt=function(A){var b=Math.floor(A/8);return(w[b]>>>7-A%8&1)==1},T.put=function(A,b){for(var y=0;y<b;y+=1)T.putBit((A>>>b-y-1&1)==1)},T.getLengthInBits=function(){return S},T.putBit=function(A){var b=Math.floor(S/8);w.length<=b&&w.push(0),A&&(w[b]|=128>>>S%8),S+=1},T},f=function(w){var S=s.MODE_NUMBER,T=w,A={};A.getMode=function(){return S},A.getLength=function(E){return T.length},A.write=function(E){for(var R=T,P=0;P+2<R.length;)E.put(b(R.substring(P,P+3)),10),P+=3;P<R.length&&(R.length-P==1?E.put(b(R.substring(P,P+1)),4):R.length-P==2&&E.put(b(R.substring(P,P+2)),7))};var b=function(E){for(var R=0,P=0;P<E.length;P+=1)R=R*10+y(E.charAt(P));return R},y=function(E){if("0"<=E&&E<="9")return E.charCodeAt(0)-48;throw"illegal char :"+E};return A},d=function(w){var S=s.MODE_ALPHA_NUM,T=w,A={};A.getMode=function(){return S},A.getLength=function(y){return T.length},A.write=function(y){for(var E=T,R=0;R+1<E.length;)y.put(b(E.charAt(R))*45+b(E.charAt(R+1)),11),R+=2;R<E.length&&y.put(b(E.charAt(R)),6)};var b=function(y){if("0"<=y&&y<="9")return y.charCodeAt(0)-48;if("A"<=y&&y<="Z")return y.charCodeAt(0)-65+10;switch(y){case" ":return 36;case"$":return 37;case"%":return 38;case"*":return 39;case"+":return 40;case"-":return 41;case".":return 42;case"/":return 43;case":":return 44;default:throw"illegal char :"+y}};return A},m=function(w){var S=s.MODE_8BIT_BYTE,T=i.stringToBytes(w),A={};return A.getMode=function(){return S},A.getLength=function(b){return T.length},A.write=function(b){for(var y=0;y<T.length;y+=1)b.put(T[y],8)},A},v=function(w){var S=s.MODE_KANJI,T=i.stringToBytesFuncs.SJIS;if(!T)throw"sjis not supported.";(function(y,E){var R=T(y);if(R.length!=2||(R[0]<<8|R[1])!=E)throw"sjis not supported."})("友",38726);var A=T(w),b={};return b.getMode=function(){return S},b.getLength=function(y){return~~(A.length/2)},b.write=function(y){for(var E=A,R=0;R+1<E.length;){var P=(255&E[R])<<8|255&E[R+1];if(33088<=P&&P<=40956)P-=33088;else if(57408<=P&&P<=60351)P-=49472;else throw"illegal char at "+(R+1)+"/"+P;P=(P>>>8&255)*192+(P&255),y.put(P,13),R+=2}if(R<E.length)throw"illegal char at "+(R+1)},b},g=function(){var w=[],S={};return S.writeByte=function(T){w.push(T&255)},S.writeShort=function(T){S.writeByte(T),S.writeByte(T>>>8)},S.writeBytes=function(T,A,b){A=A||0,b=b||T.length;for(var y=0;y<b;y+=1)S.writeByte(T[y+A])},S.writeString=function(T){for(var A=0;A<T.length;A+=1)S.writeByte(T.charCodeAt(A))},S.toByteArray=function(){return w},S.toString=function(){var T="";T+="[";for(var A=0;A<w.length;A+=1)A>0&&(T+=","),T+=w[A];return T+="]",T},S},p=function(){var w=0,S=0,T=0,A="",b={},y=function(R){A+=String.fromCharCode(E(R&63))},E=function(R){if(!(R<0)){if(R<26)return 65+R;if(R<52)return 97+(R-26);if(R<62)return 48+(R-52);if(R==62)return 43;if(R==63)return 47}throw"n:"+R};return b.writeByte=function(R){for(w=w<<8|R&255,S+=8,T+=1;S>=6;)y(w>>>S-6),S-=6},b.flush=function(){if(S>0&&(y(w<<6-S),w=0,S=0),T%3!=0)for(var R=3-T%3,P=0;P<R;P+=1)A+="="},b.toString=function(){return A},b},_=function(w){var S=w,T=0,A=0,b=0,y={};y.read=function(){for(;b<8;){if(T>=S.length){if(b==0)return-1;throw"unexpected end of file./"+b}var R=S.charAt(T);if(T+=1,R=="=")return b=0,-1;if(R.match(/^\s$/))continue;A=A<<6|E(R.charCodeAt(0)),b+=6}var P=A>>>b-8&255;return b-=8,P};var E=function(R){if(65<=R&&R<=90)return R-65;if(97<=R&&R<=122)return R-97+26;if(48<=R&&R<=57)return R-48+52;if(R==43)return 62;if(R==47)return 63;throw"c:"+R};return y},x=function(w,S){var T=w,A=S,b=new Array(w*S),y={};y.setPixel=function(I,F,H){b[F*T+I]=H},y.write=function(I){I.writeString("GIF87a"),I.writeShort(T),I.writeShort(A),I.writeByte(128),I.writeByte(0),I.writeByte(0),I.writeByte(0),I.writeByte(0),I.writeByte(0),I.writeByte(255),I.writeByte(255),I.writeByte(255),I.writeString(","),I.writeShort(0),I.writeShort(0),I.writeShort(T),I.writeShort(A),I.writeByte(0);var F=2,H=R(F);I.writeByte(F);for(var $=0;H.length-$>255;)I.writeByte(255),I.writeBytes(H,$,255),$+=255;I.writeByte(H.length-$),I.writeBytes(H,$,H.length-$),I.writeByte(0),I.writeString(";")};var E=function(I){var F=I,H=0,$=0,B={};return B.write=function(Y,it){if(Y>>>it)throw"length over";for(;H+it>=8;)F.writeByte(255&(Y<<H|$)),it-=8-H,Y>>>=8-H,$=0,H=0;$=Y<<H|$,H=H+it},B.flush=function(){H>0&&F.writeByte($)},B},R=function(I){for(var F=1<<I,H=(1<<I)+1,$=I+1,B=P(),Y=0;Y<F;Y+=1)B.add(String.fromCharCode(Y));B.add(String.fromCharCode(F)),B.add(String.fromCharCode(H));var it=g(),mt=E(it);mt.write(F,$);var vt=0,St=String.fromCharCode(b[vt]);for(vt+=1;vt<b.length;){var Ct=String.fromCharCode(b[vt]);vt+=1,B.contains(St+Ct)?St=St+Ct:(mt.write(B.indexOf(St),$),B.size()<4095&&(B.size()==1<<$&&($+=1),B.add(St+Ct)),St=Ct)}return mt.write(B.indexOf(St),$),mt.write(H,$),mt.flush(),it.toByteArray()},P=function(){var I={},F=0,H={};return H.add=function($){if(H.contains($))throw"dup key:"+$;I[$]=F,F+=1},H.size=function(){return F},H.indexOf=function($){return I[$]},H.contains=function($){return typeof I[$]<"u"},H};return y},M=function(w,S,T){for(var A=x(w,S),b=0;b<S;b+=1)for(var y=0;y<w;y+=1)A.setPixel(y,b,T(y,b));var E=g();A.write(E);for(var R=p(),P=E.toByteArray(),I=0;I<P.length;I+=1)R.writeByte(P[I]);return R.flush(),"data:image/gif;base64,"+R};return i})();(function(){e.stringToBytesFuncs["UTF-8"]=function(i){function s(r){for(var a=[],o=0;o<r.length;o++){var c=r.charCodeAt(o);c<128?a.push(c):c<2048?a.push(192|c>>6,128|c&63):c<55296||c>=57344?a.push(224|c>>12,128|c>>6&63,128|c&63):(o++,c=65536+((c&1023)<<10|r.charCodeAt(o)&1023),a.push(240|c>>18,128|c>>12&63,128|c>>6&63,128|c&63))}return a}return s(i)}})(),(function(i){n.exports=i()})(function(){return e})})($0)),$0.exports}var sC=iC();const rC=nC(sC);function Qo(){return location.origin+location.pathname.replace(/index\.html$/,"")}function aC(n){const t=rC(0,"M");return t.addData(n),t.make(),t.createSvgTag({cellSize:8,margin:2,scalable:!0})}const Wv=(n,t)=>new File([n],t,{type:n.type});function Ad(n,t){const e=navigator;try{return!!e.canShare?.({files:[Wv(n,t)]})}catch{return!1}}async function Xv(n,t,e=!0){if(Ad(n,t))try{return await navigator.share({files:[Wv(n,t)]}),"shared"}catch(i){if(i.name==="AbortError")return"cancelled";if(!e)return"refused"}else if(!e)return"refused";return qv(n,t),"saved"}function qv(n,t){const e=document.createElement("a");e.href=URL.createObjectURL(n),e.download=t,document.body.appendChild(e),e.click(),e.remove(),setTimeout(()=>URL.revokeObjectURL(e.href),3e4)}function oC(){const n=window.MediaRecorder;if(n)return["video/mp4;codecs=avc1","video/mp4","video/webm;codecs=vp9","video/webm;codecs=vp8","video/webm"].find(t=>n.isTypeSupported(t))}const jt=n=>document.getElementById(n),cC="./",ke=new URLSearchParams(location.search),Rd=ke.get("test")==="1",Qn=Number(ke.get("synth")??0),lt=tC();ke.get("c")&&(lt.costume=ke.get("c"));as.some(n=>n.id===lt.costume)||(lt.costume=as[0].id);ke.get("people")&&(lt.people=Number(ke.get("people")));const ei=()=>eC(lt),We=jt("video"),Mc=jt("stage"),La=jt("overlay"),Ae=La.getContext("2d"),Xt=new U6(Mc);Xt.opts.size=lt.size;Xt.opts.shadows=lt.shadows;Xt.opts.envLight=lt.envLight;const wn=new z6(Xt.bgUniforms,Vv);Xt.cloneCast=(n,t)=>lt.scene==="party"&&lt.partyCast==="mix"?ph(Cd(n)+1+t+wc):n;const Js=new V6,$v=new G6;let fo=null,Y0=-1;(ke.get("scene")==="party"||ke.get("scene")==="costume")&&(lt.scene=ke.get("scene"));ke.get("fx")&&(lt.effect=ke.get("fx"));ke.get("googly")&&(lt.googly=ke.get("googly")==="1");ke.get("pc")&&(lt.partyCostumes=ke.get("pc")==="behind"?"behind":ke.get("pc")==="1"||ke.get("pc")==="on"?"on":"off");wn.preset=Rs.find(n=>n.id===lt.effect)??Rs[0];const He=new cx(We,ke.get("facing")??void 0);let _i=null;const Ye=new Iy;let xo=!1;const _o=new Map,Es=new Map;let bc=0,wc=0;function Yr(){const n=as.filter(t=>lt.cast.includes(t.id));return n.length?n:as.filter(t=>_f.includes(t.id))}const ph=n=>{const t=Yr();return t[(n%t.length+t.length)%t.length].id},Cd=n=>Math.max(0,Yr().findIndex(t=>t.id===n));function mh(n){const t=_o.get(n);if(t)return t;if(lt.scene==="party"){if(lt.partyCast!=="mix")return as.some(s=>s.id===lt.partyCast)?lt.partyCast:"skeleton";let i=Es.get(n);return i||(i=ph(wc+bc++*3),Es.set(n,i)),i}if(lt.mode==="one")return lt.costume;let e=Es.get(n);return e||(e=ph(Cd(lt.costume)+wc+bc++),Es.set(n,e)),e}const Om=new Set;function Mo(n,t=!1){if(Xt.hasTemplate(n))return;const e=!Om.has(n);Om.add(n),!t&&e&&Le(`Dressing up as ${rs(n).name}…`,1800),(e||!t)&&Xt.prepare(n,!0).catch(i=>{console.error("build failed",n,i),Le(`${rs(n).name} failed to build`)})}let Bm=0;function Le(n,t=1400){const e=jt("toast");e.textContent=n,e.classList.add("on"),clearTimeout(Bm),Bm=window.setTimeout(()=>e.classList.remove("on"),t)}const lC=n=>{const t=jt("hint");t.textContent=n,t.classList.toggle("on",!!n)},Ld=n=>`${cC}thumbs/${n}.png`;function Pd(){const n=jt("picker");if(n.innerHTML="",lt.scene==="party"){for(const i of Rs){const s=document.createElement("button");s.className="card fx",s.dataset.id=i.id,s.setAttribute("role","option"),s.innerHTML='<div class="thumb"></div><div class="name"></div>',s.querySelector(".thumb").style.background=i.swatch,s.querySelector(".name").textContent=i.name,s.onclick=()=>Id(i.id),n.appendChild(s)}yc();return}const t=(i,s,r="")=>{const a=document.createElement("button");a.className=`card ${r}`,a.dataset.id=i,a.setAttribute("role","option"),a.innerHTML='<div class="thumb"></div><div class="name"></div>',a.querySelector(".name").textContent=s;const o=a.querySelector(".thumb");if(i==="mix")o.textContent="MIX";else{const c=new Image;c.alt="",c.draggable=!1,c.onerror=()=>{c.remove(),o.textContent=s.slice(0,1)},c.src=Ld(i),o.appendChild(c)}a.onclick=()=>Yv(i),n.appendChild(a)};t("mix","Mix","mix");for(const i of Yr())t(i.id,i.name);const e=document.createElement("button");e.className="card more",e.innerHTML='<div class="thumb">+</div><div class="name">More</div>',e.onclick=fC,n.appendChild(e),yc()}function hC(n){let t=null,e=!1;n.addEventListener("pointerdown",s=>{t={x:s.clientX,left:n.scrollLeft,id:s.pointerId},e=!1}),n.addEventListener("dragstart",s=>s.preventDefault()),n.addEventListener("pointermove",s=>{if(!t||s.pointerId!==t.id)return;const r=s.clientX-t.x;!e&&Math.abs(r)>6&&(e=!0,n.classList.add("dragging")),e&&(n.scrollLeft=t.left-r)});const i=()=>{t=null,n.classList.remove("dragging")};n.addEventListener("pointerup",i),n.addEventListener("pointercancel",i),n.addEventListener("click",s=>{e&&(s.stopPropagation(),s.preventDefault(),e=!1)},!0),n.addEventListener("wheel",s=>{Math.abs(s.deltaY)<=Math.abs(s.deltaX)||(n.scrollLeft+=s.deltaY,s.preventDefault())},{passive:!1})}function yc(){for(const n of jt("picker").querySelectorAll(".card")){const t=lt.scene==="party"?n.dataset.id===lt.effect:lt.mode==="mix"?n.dataset.id==="mix":n.dataset.id===lt.costume;if(n.classList.toggle("on",t),n.setAttribute("aria-selected",String(t)),t){const e=jt("picker");e.scrollTo({left:n.offsetLeft-(e.clientWidth-n.offsetWidth)/2,behavior:"smooth"})}}}function Yv(n){if(_o.clear(),n==="mix"){const t=lt.mode==="mix";lt.mode="mix",t&&wc++,Es.clear(),bc=0,Le(t?"Shuffled":"Mix: everyone gets their own")}else lt.mode="one",lt.costume=n,Mo(n),Xt.hasTemplate(n)&&Le(rs(n).name,900);ei(),yc()}const uC=()=>[...Yr().map(n=>n.id),"mix"];function Id(n){const t=Rs.find(e=>e.id===n)??Rs[0];if(lt.effect===t.id&&wn.preset.id===t.id){const e=uC(),i=e.indexOf(lt.partyCast);lt.partyCast=e[(i+1)%e.length],lt.partyCast==="mix"&&wc++,_o.clear(),Es.clear(),bc=0,lt.partyCast!=="mix"&&Mo(lt.partyCast),lt.partyCostumes==="off"&&(lt.partyCostumes="behind"),ei(),Le(lt.partyCast==="mix"?"Dancers: a mix":`Dancers: ${rs(lt.partyCast).name}`,1e3);return}lt.effect=t.id,wn.preset=t,ei(),yc(),Le(t.name,800)}function wf(n){const t=jt("dip");t.classList.add("on"),setTimeout(async()=>{try{await n()}finally{requestAnimationFrame(()=>requestAnimationFrame(()=>t.classList.remove("on")))}},190)}function yf(n){lt.scene=n,ei(),Xt.setBackground(n==="party"?wn.material:null),_i?.setOptions({masks:n==="party"}),jt("btn-pyramid").classList.toggle("hidden",n!=="party");for(const t of document.querySelectorAll(".modes button")){const e=t.dataset.scene===n;t.classList.toggle("on",e),t.setAttribute("aria-selected",String(e))}Pd()}function fC(){const n=jt("more-body");n.innerHTML="";const t=as.filter(i=>!_f.includes(i.id)),e=(i,s)=>{const r=document.createElement("h3");r.textContent=i,n.appendChild(r);const a=document.createElement("div");a.className="more-grid";for(const o of s){const c=document.createElement("button");c.className="more-card",c.innerHTML='<div class="thumb"></div><div class="name"></div><div class="tick"></div>';const l=new Image;l.alt="",l.draggable=!1,l.src=Ld(o.id),l.onerror=()=>l.remove(),c.querySelector(".thumb").appendChild(l),c.querySelector(".name").textContent=o.name;const h=()=>{const u=lt.cast.includes(o.id);c.classList.toggle("on",u),c.querySelector(".tick").textContent=u?"✓":"✕",c.setAttribute("aria-pressed",String(u))};h(),c.onclick=()=>{const u=lt.cast.includes(o.id);if(u&&lt.cast.length<=1){Le("Keep at least one");return}lt.cast=u?lt.cast.filter(f=>f!==o.id):[...lt.cast,o.id],u||Mo(o.id,!0),Es.clear(),bc=0,ei(),h(),Pd()},a.appendChild(c)}n.appendChild(a)};e("The usual crowd",as.filter(i=>_f.includes(i.id))),e("Advanced & trash",t),Rh("more")}function Rh(n){jt(n).classList.remove("hidden")}for(const n of document.querySelectorAll(".modal"))n.addEventListener("click",t=>{(t.target===n||t.target.closest("[data-close]"))&&n.classList.add("hidden")});function Hm(){const n=Qo();jt("qr-code").innerHTML=aC(n),jt("qr-url").textContent=n,Rh("qr")}jt("btn-copy").onclick=async()=>{try{await navigator.clipboard.writeText(Qo()),Le("Link copied")}catch{Le("Could not copy — long-press the link")}};jt("btn-share-link").onclick=async()=>{if(navigator.share)try{await navigator.share({title:"costuma 2026",text:"Be a 3D costume:",url:Qo()})}catch{}else try{await navigator.clipboard.writeText(Qo()),Le("Link copied")}catch{Le(Qo())}};function dC(){const n=jt("settings-body");n.innerHTML="";const t=(r,a,o)=>{const c=document.createElement("div");c.className="set";const l=document.createElement("label"),h=document.createElement("span");if(h.textContent=r,a){const u=document.createElement("small");u.textContent=a,h.appendChild(u)}l.append(h,o),c.appendChild(l),n.appendChild(c)},e=(r,a,o)=>{const c=document.createElement("div");c.className="seg";for(const[l,h]of r){const u=document.createElement("button");u.textContent=h,u.classList.toggle("on",a()===l),u.onclick=()=>{o(l),ei();for(const f of c.children)f.classList.remove("on");u.classList.add("on")},c.appendChild(u)}return c},i=(r,a)=>{const o=document.createElement("input");return o.type="checkbox",o.className="switch",o.checked=r(),o.onchange=()=>{a(o.checked),ei()},o},s=(r,a,o,c,l)=>{const h=document.createElement("input");return h.type="range",h.min=String(r),h.max=String(a),h.step=String(o),h.value=String(c()),h.oninput=()=>{l(Number(h.value)),ei()},h};t(lt.scene==="party"?"Subjects":"People",lt.scene==="party"?"How many people to cut out (the nearest)":"How many to dress at once",e([[1,"1"],[2,"2"],[3,"3"],[4,"4"]],()=>lt.people,r=>{lt.people=r,_i?.setOptions({numPoses:r})})),t("Costume size","Bigger hides more of the person",s(.8,1.5,.01,()=>lt.size,r=>{lt.size=r,Xt.opts.size=r})),t("Detection threshold","Higher ignores what only looks like a person (coats, posters, shadows); lower finds people further off or half hidden",s(.4,.9,.05,()=>lt.poseConf,r=>{lt.poseConf=r,_i?.setOptions({conf:r})})),t("Pose model","Accurate is steadier, slower to load and run",e([["lite","Fast"],["full","Accurate"]],()=>lt.model,r=>{lt.model=r,wC()})),t("Light from the camera","The costume is lit by the room it stands in",i(()=>lt.envLight,r=>{lt.envLight=r,Xt.opts.envLight=r})),t("Shadows","Off is faster on older phones",i(()=>lt.shadows,r=>{lt.shadows=r,Xt.opts.shadows=r})),t("Lens","If costumes look too flat or too deep",s(.55,1.3,.01,()=>lt.lens,r=>{lt.lens=r})),t("React to the music","Listens through the microphone for the beat; clips record the sound",i(()=>lt.music,r=>{lt.music=r,r?Js.start().then(()=>Le("Listening for the beat",1200)).catch(()=>{lt.music=!1,ei(),Le("No microphone")}):Js.stop()}));{const r=document.createElement("select");r.className="pick";for(const a of Yr()){const o=document.createElement("option");o.value=a.id,o.textContent=a.name,r.appendChild(o)}{const a=document.createElement("option");a.value="mix",a.textContent="A mix",r.appendChild(a)}r.value=lt.partyCast,r.onchange=()=>{lt.partyCast=r.value,_o.clear(),Es.clear(),ei(),r.value!=="mix"&&Mo(r.value)},t("Party dancers","Who dances behind (or as) you in party mode",r)}t("Costumes in party mode","Behind you: you stay yourself, a pyramid of your costume dances behind you",e([["off","Off"],["behind","Behind"],["on","On you"]],()=>lt.partyCostumes,r=>{lt.partyCostumes=r})),t("Face tracking","Mouths open costumes and breathe sparks; googly eyes find your eyes",i(()=>lt.faces,r=>{lt.faces=r,r&&Nd()})),t("Mouth magic","Open your mouth: sparks",i(()=>lt.breath,r=>{lt.breath=r})),t("Show the skeleton","What the pose tracker sees",i(()=>lt.debug,r=>{lt.debug=r}))}let Sf=!1,nr=null;function pC(n,t){nr={blob:n,name:t};const e=jt("preview-media");e.innerHTML="";const i=URL.createObjectURL(n);if(n.type.startsWith("video")){const r=document.createElement("video");r.src=i,r.controls=!0,r.playsInline=!0,r.loop=!0,r.muted=!0,r.play().catch(()=>{}),e.appendChild(r)}else{const r=new Image;r.src=i,e.appendChild(r)}const s=tc()&&Ad(n,t);jt("btn-share").textContent=s?"Save to Photos":"Share",jt("btn-save").textContent=s?"Download":"Save",jt("preview-note").textContent=s?`In the sheet, choose “Save ${n.type.startsWith("video")?"Video":"Image"}”.`:"",Rh("preview")}jt("btn-share").onclick=async()=>{nr&&await Xv(nr.blob,nr.name)==="saved"&&Le("Saved")};jt("btn-save").onclick=()=>{nr&&(qv(nr.blob,nr.name),Le("Saved"))};async function jv(n,t){nr={blob:n,name:t},!(tc()&&Ad(n,t)&&(zm||(zm=!0,Le(n.type.startsWith("video")?"Choose “Save Video” to put it in Photos":"Choose “Save Image” to put it in Photos",2600)),await Xv(n,t,!1)==="shared"))&&pC(n,t)}let zm=!1;const Zv=()=>new Date().toISOString().slice(0,19).replace(/[:T]/g,"-");let yl=null,Vm=0;function mC(){const n=jt("btn-rec");if(yl){yl.stop();return}const t=oC(),e=Mc.captureStream;if(!t||!e){Le("Recording is not supported in this browser");return}const i=[],s=e.call(Mc,30);for(const a of Js.stream?.getAudioTracks()??[])s.addTrack(a);const r=new MediaRecorder(s,{mimeType:t,videoBitsPerSecond:8e6});r.ondataavailable=a=>{a.data.size&&i.push(a.data)},r.onstop=()=>{clearTimeout(Vm),yl=null,n.classList.remove("on"),n.innerHTML=bs.rec;const a=t.split(";")[0];jv(new Blob(i,{type:a}),`costuma-${Zv()}.${a.includes("mp4")?"mp4":"webm"}`)},r.start(250),yl=r,n.classList.add("on"),n.innerHTML=bs.stop,Vm=window.setTimeout(()=>r.state==="recording"&&r.stop(),2e4),Le("Recording — tap to stop",1200)}const gC=4500;let Jv=performance.now(),gh=!1;const vh=()=>jt("hud");function vC(){Jv=performance.now(),vh().classList.contains("idle")&&(vh().classList.remove("idle"),gh=!0,setTimeout(()=>gh=!1,400))}for(const n of["pointerdown","keydown","wheel"])window.addEventListener(n,vC,{capture:!0,passive:!0});setInterval(()=>{const n=[...document.querySelectorAll(".modal")].some(e=>!e.classList.contains("hidden")),t=xo&&!n&&performance.now()-Jv>gC;t!==vh().classList.contains("idle")&&vh().classList.toggle("idle",t)},300);function Kv(n){const t=Xt.cover,e=n.image,i=(e[U.shL].x+e[U.shR].x+e[U.hipL].x+e[U.hipR].x)/4,s=(e[U.shL].y+e[U.shR].y+e[U.hipL].y+e[U.hipR].y)/4;let r=(i*t.vw-t.ox)*t.s;const a=(s*t.vh-t.oy)*t.s;return t.mirror&&(r=t.cw-r),{x:r,y:a}}Mc.addEventListener("click",n=>{if(!xo)return;if(gh){gh=!1;return}if(lt.scene==="party"&&lt.partyCostumes==="off"){const r=Rs.findIndex(a=>a.id===lt.effect);Id(Rs[(r+1)%Rs.length].id);return}let t=null,e=1/0;for(const r of Ye.tracks){if(r.lost)continue;const a=Kv(r),o=Math.hypot(a.x-n.clientX,a.y-n.clientY);o<e&&(e=o,t=r)}if(!t||e>Math.max(innerWidth,innerHeight)*.3)return;const i=mh(t.id),s=ph(Cd(i)+1);_o.set(t.id,s),Mo(s),Le(rs(s).name,900)});let Ef=0,Gm=-1,Tf=0,Af=performance.now(),j0=performance.now();const Pa=document.createElement("canvas"),xC=Pa.getContext("2d");function _C(){if(lt.scene!=="party")return We;const n=We.videoWidth||720,t=We.videoHeight||1280,e=480/Math.max(n,t),i=Math.round(n*e),s=Math.round(t*e);return(Pa.width!==i||Pa.height!==s)&&(Pa.width=i,Pa.height=s),xC.drawImage(We,0,0,i,s),Pa}let Dd=0,Z0=performance.now(),J0=0;function Ch(){return by(We.videoWidth||720,We.videoHeight||1280,lt.lens*(He.zoom>0?He.zoom:1))}function Ud(){const n=jt("lens");if(n.innerHTML="",Qn)return;const t=He.stops(),e=He.zoomRange?t.reduce((i,s,r)=>Math.abs(s.zoom-He.zoom)<Math.abs(t[i].zoom-He.zoom)?r:i,0):He.lens;t.forEach((i,s)=>{const r=document.createElement("button"),a=s===e;r.textContent=a?i.label+"×":i.label,r.classList.toggle("on",a),r.setAttribute("aria-label",He.zoomRange?`Zoom ${i.label}×`:`Camera ${i.label}`),r.onclick=()=>{a||wf(async()=>{try{i.zoom>0?(await He.setZoom(i.zoom),lt.zoom[He.facing]=He.zoom,ei()):(await He.nextLens(-1-i.zoom),Xt.setVideo(We))}catch(o){Le(`Camera: ${o.message}`)}Ud()})},n.appendChild(r)})}function Qv(n){if(requestAnimationFrame(Qv),!xo)return;Ef++;const t=Ch();Xt.layout(t,He.mirrored&&!Qn);let e=null;if(Qn){if(e=Ny(Qn,(n-Af)/1e3*(Rd?0:1)+Number(ke.get("t")??0),t),lt.scene==="party"){const h=t.w/t.h,u=h>=1?240:Math.round(240*h),f=h>=1?Math.round(240/h):240;for(const d of e)d.mask=Fy(d,u,f,h)}}else if(_i&&We.readyState>=2&&We.currentTime!==Gm){Gm=We.currentTime;try{e=_i.detect(_C(),n)}catch(h){console.error(h)}}if(e&&Ye.update(e.slice(0,lt.people),n,t,Xt.ground.n),e){let h=null;if(fo&&lt.faces&&!Qn)try{h=fo.detect(We,Ye.tracks,t)}catch(u){console.error(u)}if(Q6(Ye.tracks,h,t,n,Y0<0?1/30:Math.min(.25,(n-Y0)/1e3)),Y0=n,Qn&&(ke.get("jaw")||ke.get("face")))for(const u of Ye.tracks)u.face&&Object.assign(u.face,Gy(ke.get("face"),{jaw:Number(ke.get("jaw")??0)}))}Xt.ground.update(Ye.tracks,Qn?null:$v.upInCamera(He.facing),Math.min(.25,(n-j0)/1e3));const i=lt.scene==="costume"||lt.partyCostumes!=="off";if(i)for(const h of Ye.tracks)Mo(mh(h.id),!0);const s=(n-Af)/1e3,r=Math.min(.25,(n-j0)/1e3);j0=n;const a=i,o=lt.scene==="party",c=o&&lt.partyCostumes==="behind";Xt.pyramid=o&&lt.pyramid&&lt.partyCostumes!=="off",Xt.hideWearers=c,wn.pyramid=lt.pyramid,Xt.setForeground(c?wn.foreground:null),wn.clones=!Xt.pyramid,Xt.stageLights(lt.scene==="party"&&wn.preset.id!=="insitu",s,Js.env);{const h=Ye.tracks.filter(d=>!d.lost).sort((d,m)=>m.T.z-d.T.z)[0],u=lt.scene==="party"&&wn.preset.id==="insitu",f=Xt.stageSpots(u,s,Js.env,t,h?new C(h.T.x,h.T.y,h.T.z):null);wn.setSpots(f,u?1:0),Xt.light.realism=u}Xt.setGrain(!0,s),Xt.sync(a?Ye.tracks:[],mh,s),Xt.googlyOn=lt.googly&&lt.faces,Xt.breathOn=lt.breath&&lt.faces,Xt.faces(Ye.tracks,t,r),Js.update(r,n),lt.scene==="party"&&(wn.subjects=lt.people,wn.beat=Js.env,wn.update(Ye.tracks,r,s,t.w/t.h,Xt.ground,t),wn.render(Xt.renderer,t.w,t.h)),Xt.render(We,t,Ef),Sf&&(Sf=!1,Mc.toBlob(h=>{h&&jv(h,`costuma-${Zv()}.jpg`)},"image/jpeg",.92)),Ye.tracks.filter(h=>!h.lost).length&&(Tf=n),lC(n-Tf>2500?"Step back until your head and hips are in view":""),bC(),J0++,n-Z0>1e3&&(Dd=J0*1e3/(n-Z0),J0=0,Z0=n,tx(),MC())}let Sl=0,Wm=!1;function MC(){if(!(Rd||!xo||Ye.tracks.length===0)&&(Sl=Dd<22?Sl+1:0,!(Sl<3))){if(Sl=0,Xt.opts.pixelRatio>1.01)Xt.opts.pixelRatio=Math.max(1,Xt.opts.pixelRatio-.25);else if(Xt.opts.shadows)Xt.opts.shadows=!1;else return;Wm||(Wm=!0,Le("Lowering quality to keep up",1500))}}function bC(){const n=La.clientWidth,t=La.clientHeight,e=Math.min(devicePixelRatio||1,2);if(La.width!==Math.round(n*e)&&(La.width=Math.round(n*e),La.height=Math.round(t*e)),Ae.setTransform(e,0,0,e,0,0),Ae.clearRect(0,0,n,t),!lt.debug)return;const i=Xt.cover,s=r=>{let a=(r.x*i.vw-i.ox)*i.s;return i.mirror&&(a=i.cw-a),[a,(r.y*i.vh-i.oy)*i.s]};{const r=Xt.ground,a=Ch(),{back:o,side:c}=r.axes(),l=Ye.tracks.filter(d=>!d.lost).sort((d,m)=>m.T.z-d.T.z)[0],h=r.foot(l?new C(l.T.x,l.T.y,l.T.z):new C(0,0,-3)).addScaledVector(o,-1),u=(d,m)=>h.clone().addScaledVector(c,d).addScaledVector(o,m),f=(d,m)=>{if(d.z>-.2||m.z>-.2)return;const[v,g]=s(co(d,a)),[p,_]=s(co(m,a));Ae.beginPath(),Ae.moveTo(v,g),Ae.lineTo(p,_),Ae.stroke()};Ae.strokeStyle="rgba(125, 252, 255, 0.45)",Ae.lineWidth=1.5;for(let d=-3;d<=3.001;d+=.5)f(u(d,0),u(d,8));for(let d=0;d<=8.001;d+=.5)f(u(-3,d),u(3,d));Ae.fillStyle="#7dfcff",Ae.font="600 12px system-ui",Ae.fillText(`floor: ${r.source}${r.fromFeet?" + feet":""} · camera ${r.cameraHeight.toFixed(2)} m up`,12,i.ch-200)}for(const r of Ye.tracks){Ae.globalAlpha=r.presence,Ae.strokeStyle="#7dfcff",Ae.lineWidth=3;for(const[o,c]of fx){const l=r.image[o],h=r.image[c];if(Math.min(l.v,h.v)<.4)continue;const[u,f]=s(l),[d,m]=s(h);Ae.beginPath(),Ae.moveTo(u,f),Ae.lineTo(d,m),Ae.stroke()}Ae.fillStyle="#ff8a1f";for(const o of r.image){if(o.v<.4)continue;const[c,l]=s(o);Ae.beginPath(),Ae.arc(c,l,4,0,Math.PI*2),Ae.fill()}const a=Kv(r);Ae.fillStyle="#fff",Ae.font="600 14px system-ui",Ae.fillText(`#${r.id} ${rs(mh(r.id)).name} · ${(-r.T.z).toFixed(1)} m`,a.x-40,a.y)}Ae.globalAlpha=1}function tx(){const n=jt("readout");if(!n||jt("settings").classList.contains("hidden"))return;const t=Ch();n.textContent=["build bd7a229 · 2026-11-01 10:04Z",`${Dd.toFixed(0)} fps · pose ${_i?.inferMs.toFixed(1)??"–"} ms (${_i?.delegate??"–"}, ${lt.model}) · face ${fo?fo.inferMs.toFixed(1)+" ms":lt.faces?"loading":"off"}`,`video ${We.videoWidth}×${We.videoHeight} · f ${t.f.toFixed(0)} px · ${He.facing}`,`camera ${He.describe()}`,`people ${Ye.tracks.filter(e=>!e.lost).length} · dressed ${Xt.count}`,...Ye.tracks.filter(e=>!e.lost&&e.face).map(e=>{const i=e.face,s=new Tn().setFromQuaternion(i.head,"YXZ"),r=a=>Math.round(ss.radToDeg(a));return`face ${e.id}: ${i.read?"read":"pose only"} · trust ${i.trust.toFixed(2)} · head yaw ${r(s.y)} nod ${r(s.x)} tilt ${r(s.z)} · jaw ${i.jaw.toFixed(2)} blink ${i.blinkL.toFixed(2)}/${i.blinkR.toFixed(2)} look ${i.lookX.toFixed(2)},${i.lookY.toFixed(2)}`}),`pixels ×${Xt.opts.pixelRatio.toFixed(2)} · shadows ${Xt.opts.shadows?"on":"off"}`,`face light ${Xt.light.faceConf>.05?`${Xt.light.faceLum.toFixed(3)} from (${Xt.light.faceDir.x.toFixed(2)}, ${Xt.light.faceDir.y.toFixed(2)}) ×${Xt.light.faceConf.toFixed(2)}`:"—"}`,`light mean ${Xt.light.mean.toFixed(3)} × ${Xt.light.gain.toFixed(2)} · key share ${Xt.light.share.toFixed(2)} · every ${Ti.every} frames`].join(`
`)}async function wC(){if(Qn)return;const n=_i,t=new qm(lt.model,lt.people,lt.poseConf);t.masks=lt.scene==="party",await t.load(e=>Le(e,2500)),_i=t,n?.close(),Le(lt.model==="full"?"Accurate pose model":"Fast pose model",1e3)}async function Nd(){if(fo||Qn||!lt.faces)return;const n=new q6;try{await n.load(),fo=n}catch(t){console.warn("face model failed",t)}}function yC(){const n=document.createElement("canvas");n.width=720,n.height=1280;const t=n.getContext("2d"),e=()=>{const i=t.createLinearGradient(0,0,0,1280);i.addColorStop(0,"#5a4a63"),i.addColorStop(.62,"#3b3142"),i.addColorStop(.63,"#6b5440"),i.addColorStop(1,"#3a2c22"),t.fillStyle=i,t.fillRect(0,0,720,1280),t.fillStyle="#fff3d6",t.fillRect(40,220,170,330),t.fillStyle="#ffb35a",t.beginPath(),t.arc(600,180,46,0,Math.PI*2),t.fill()};return e(),setInterval(e,500),n.captureStream(30)}async function K0(){const n=jt("start-status"),t=jt("btn-start");t.disabled=!0;const e=Qn?Promise.resolve(!1):$v.enable();try{if(Qn)We.srcObject=yC(),await We.play().catch(()=>{}),We.readyState<2&&await new Promise(s=>We.addEventListener("loadeddata",s,{once:!0}));else{if(!navigator.mediaDevices?.getUserMedia)throw new Error(location.protocol!=="https:"?"The camera needs an https:// page.":"This browser has no camera access.");n.textContent="Asking for the camera…",await He.open(He.facing,lt.zoom[He.facing]??1),Ud(),n.textContent="Loading the pose model…",_i=new qm(lt.model,lt.people,lt.poseConf),_i.masks=lt.scene==="party",await _i.load(s=>{n.textContent=s[0].toUpperCase()+s.slice(1)+"…"})}Xt.setVideo(We),n.textContent=`Dressing up as ${rs(lt.costume).name}…`,await new Promise(s=>setTimeout(s,30));const i=lt.mode==="one"?lt.costume:as[0].id;await Xt.prepare(i,!0);for(const s of Yr())Xt.prepare(s.id);Nd(),jt("start").classList.add("hidden"),jt("hud").classList.remove("hidden"),yf(lt.scene),xo=!0,Af=performance.now(),Tf=performance.now(),yc()}catch(i){console.error(i);const s=i;n.textContent=s.name==="NotAllowedError"?"Camera permission was refused. Allow it in the browser settings and try again.":`Could not start: ${s.message}`,t.disabled=!1}}function SC(){jt("btn-pyramid").innerHTML=bs.pyramid;const n=()=>jt("btn-pyramid").setAttribute("aria-pressed",String(lt.pyramid));n(),jt("btn-pyramid").onclick=()=>{lt.pyramid=!lt.pyramid,ei(),n(),Le(lt.pyramid?"Dance pyramid":"No pyramid",800)},jt("btn-googly").innerHTML=bs.googly;const t=()=>jt("btn-googly").setAttribute("aria-pressed",String(lt.googly));t(),jt("btn-googly").onclick=()=>{lt.googly=!lt.googly,lt.googly&&!lt.faces&&(lt.faces=!0,Nd()),ei(),t(),Le(lt.googly?"Googly eyes":"No googly eyes",800)},jt("btn-qr").innerHTML=bs.qr,jt("btn-flip").innerHTML=bs.flip,jt("btn-gear").innerHTML=bs.gear,jt("btn-snap").innerHTML=bs.camera,jt("btn-rec").innerHTML=bs.rec,jt("btn-start").onclick=()=>void K0(),jt("btn-start-qr").onclick=Hm,jt("btn-qr").onclick=Hm,jt("btn-gear").onclick=()=>{dC(),Rh("settings"),tx()},jt("btn-flip").onclick=async()=>{Qn||wf(async()=>{try{await He.flip(lt.zoom[He.facing==="user"?"environment":"user"]??1),Xt.setVideo(We),Ye.clear(),_o.clear(),Es.clear()}catch(s){Le(`Camera: ${s.message}`)}Ud()})},jt("btn-snap").onclick=()=>{Sf=!0;const s=jt("stage");s.style.filter="brightness(1.8)",setTimeout(()=>s.style.filter="",120)},jt("btn-rec").onclick=mC;for(const s of document.querySelectorAll(".modes button"))s.onclick=()=>{s.dataset.scene!==lt.scene&&wf(()=>yf(s.dataset.scene))};const e=jt("start-cast");for(const s of Yr().slice(0,6)){const r=new Image;r.src=Ld(s.id),r.alt=s.name,r.onerror=()=>r.remove(),e.appendChild(r)}Pd(),hC(jt("picker")),requestAnimationFrame(Qv);const i=window;i.__costuma={stage:Xt,tracker:Ye,settings:lt,start:K0,choose:Yv,party:wn,beat:Js,setScene:yf,chooseEffect:Id,get started(){return xo},get frame(){return Ef},LIGHT_TUNE:Ti,camera:He,intrinsics:Ch},Rd&&Qn&&K0()}SC();
