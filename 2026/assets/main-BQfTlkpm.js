(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))i(s);new MutationObserver(s=>{for(const r of s)if(r.type==="childList")for(const a of r.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&i(a)}).observe(document,{childList:!0,subtree:!0});function e(s){const r={};return s.integrity&&(r.integrity=s.integrity),s.referrerPolicy&&(r.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?r.credentials="include":s.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function i(s){if(s.ep)return;s.ep=!0;const r=e(s);fetch(s.href,r)}})();const dc=()=>/iPad|iPhone|iPod/.test(navigator.userAgent)||navigator.platform==="MacIntel"&&navigator.maxTouchPoints>1,Bx=()=>dc()||/Android|Mobile/i.test(navigator.userAgent);let Hx=class{constructor(t,e){this.video=t,this.facing=e??(Bx()?"environment":"user"),t.muted=!0,t.playsInline=!0,t.autoplay=!0,t.setAttribute("playsinline",""),t.setAttribute("muted","")}stream=null;facing;zoom=1;zoomRange=null;lenses=[];lens=0;async open(t=this.facing,e=1,i){const s=!!this.stream;this.stop(),s&&await new Promise(a=>setTimeout(a,100));const r={width:{ideal:1280},height:{ideal:720},frameRate:{ideal:30}};i&&!dc()?r.deviceId={exact:i}:r.facingMode=t,this.stream=await navigator.mediaDevices.getUserMedia({audio:!1,video:r}),this.facing=t,this.video.srcObject=this.stream,await this.video.play().catch(()=>{}),this.video.readyState<2&&await new Promise(a=>this.video.addEventListener("loadeddata",()=>a(),{once:!0})),await this.readLenses(),this.zoomRange&&e!==this.zoom&&await this.setZoom(e)}get track(){return this.stream?.getVideoTracks()[0]??null}async readLenses(){const t=this.track;if(this.zoomRange=null,this.zoom=1,this.lenses=[],this.lens=0,!t)return;const e=t.getCapabilities?.()??{};if(e.zoom&&e.zoom.max>e.zoom.min){this.zoomRange={min:e.zoom.min,max:e.zoom.max},this.zoom=t.getSettings().zoom??1;return}if(!dc())try{const i=this.facing==="environment"?/back|rear|environment/i:/front|user|face/i,s=(await navigator.mediaDevices.enumerateDevices()).filter(r=>r.kind==="videoinput"&&i.test(r.label));s.length>1&&(this.lenses=s.map(r=>({id:r.deviceId,label:r.label})),this.lens=Math.max(0,s.findIndex(r=>r.deviceId===t.getSettings().deviceId)))}catch{}}stops(){if(this.zoomRange){const{min:t,max:e}=this.zoomRange,i=[];t<.95&&i.push({zoom:t,label:String(Math.round(t*10)/10).replace(/^0/,"")});for(const s of[1,2,3,5])s>=t-.001&&s<=e+.001&&i.push({zoom:s,label:String(s)});return i.length>1?i:[]}return this.lenses.map((t,e)=>({zoom:-1-e,label:String(e+1)}))}async setZoom(t){const e=this.track;if(!e||!this.zoomRange)return this.zoom;t=Math.min(this.zoomRange.max,Math.max(this.zoomRange.min,t));try{await e.applyConstraints({advanced:[{zoom:t}]}),this.zoom=e.getSettings().zoom??t}catch{}return this.zoom}async nextLens(t=(this.lens+1)%Math.max(1,this.lenses.length)){const e=this.lenses[t];if(!e)return;const i=this.lenses;await this.open(this.facing,1,e.id),this.lenses=i,this.lens=t}async flip(t=1){await this.open(this.facing==="user"?"environment":"user",t)}get mirrored(){return this.facing==="user"}describe(){const t=this.track,e=this.zoomRange?`zoom ${this.zoom.toFixed(2)} of ${this.zoomRange.min}–${this.zoomRange.max}`:"no zoom",i=this.lenses.length?` · lenses ${this.lenses.map((s,r)=>r===this.lens?"["+s.label+"]":s.label).join(", ")}`:"";return`${e}${i}${t?.label?` · ${t.label}`:""}`}stop(){if(this.stream){for(const t of this.stream.getTracks())t.stop();this.video.srcObject=null,this.stream=null}}};const zx="modulepreload",Vx=function(n,t){return new URL(n,t).href},l1={},qf=function(t,e,i){let s=Promise.resolve();if(e&&e.length>0){let a=function(u){return Promise.all(u.map(h=>Promise.resolve(h).then(f=>({status:"fulfilled",value:f}),f=>({status:"rejected",reason:f}))))};const o=document.getElementsByTagName("link"),c=document.querySelector("meta[property=csp-nonce]"),l=c?.nonce||c?.getAttribute("nonce");s=a(e.map(u=>{if(u=Vx(u,i),u in l1)return;l1[u]=!0;const h=u.endsWith(".css"),f=h?'[rel="stylesheet"]':"";if(!!i)for(let v=o.length-1;v>=0;v--){const g=o[v];if(g.href===u&&(!h||g.rel==="stylesheet"))return}else if(document.querySelector(`link[href="${u}"]${f}`))return;const p=document.createElement("link");if(p.rel=h?"stylesheet":zx,h||(p.as="script"),p.crossOrigin="",p.href=u,l&&p.setAttribute("nonce",l),document.head.appendChild(p),h)return new Promise((v,g)=>{p.addEventListener("load",v),p.addEventListener("error",()=>g(new Error(`Unable to preload CSS for ${u}`)))})}))}function r(a){const o=new Event("vite:preloadError",{cancelable:!0});if(o.payload=a,window.dispatchEvent(o),!o.defaultPrevented)throw a}return s.then(a=>{for(const o of a||[])o.status==="rejected"&&r(o.reason);return t().catch(r)})},D={nose:0,eyeInL:1,eyeL:2,eyeOutL:3,eyeInR:4,eyeR:5,eyeOutR:6,earL:7,earR:8,mouthL:9,mouthR:10,shL:11,shR:12,elL:13,elR:14,wrL:15,wrR:16,pinkyL:17,pinkyR:18,indexL:19,indexR:20,thumbL:21,thumbR:22,hipL:23,hipR:24,knL:25,knR:26,anL:27,anR:28,heelL:29,heelR:30,toeL:31,toeR:32},js=33;function Gx(n){return{x:n.x,y:-n.y,z:-n.z,v:n.visibility??1}}const Wx=[[D.shL,D.shR],[D.shL,D.elL],[D.elL,D.wrL],[D.shR,D.elR],[D.elR,D.wrR],[D.shL,D.hipL],[D.shR,D.hipR],[D.hipL,D.hipR],[D.hipL,D.knL],[D.knL,D.anL],[D.hipR,D.knR],[D.knR,D.anR],[D.anL,D.toeL],[D.anR,D.toeR],[D.earL,D.eyeL],[D.eyeL,D.nose],[D.nose,D.eyeR],[D.eyeR,D.earR]];class xg{constructor(t,e,i=.65){this.model=t,this.numPoses=e,this.conf=i}lm=null;lastTs=-1;delegate="GPU";inferMs=0;masks=!1;async load(t){t?.("loading the pose engine");const i=await qf(()=>import("./vision_bundle-Bk4VIwNi.js"),[],import.meta.url),s=await i.FilesetResolver.forVisionTasks("./mediapipe"),r=a=>i.PoseLandmarker.createFromOptions(s,{baseOptions:{modelAssetPath:`./models/pose_landmarker_${this.model}.task`,delegate:a},runningMode:"VIDEO",numPoses:this.numPoses,minPoseDetectionConfidence:this.conf,minPosePresenceConfidence:this.conf,minTrackingConfidence:.5,outputSegmentationMasks:this.masks});t?.(`loading the ${this.model} pose model`);try{this.lm=await r("GPU"),this.delegate="GPU"}catch(a){console.warn("GPU delegate failed, using CPU",a),this.lm=await r("CPU"),this.delegate="CPU"}}async setOptions(t){t.conf!==void 0&&t.conf!==this.conf&&(this.conf=t.conf,await this.lm?.setOptions({minPoseDetectionConfidence:t.conf,minPosePresenceConfidence:t.conf})),t.numPoses&&(this.numPoses=t.numPoses,await this.lm?.setOptions({numPoses:t.numPoses})),t.masks!==void 0&&t.masks!==this.masks&&(this.masks=t.masks,await this.lm?.setOptions({outputSegmentationMasks:t.masks}))}detect(t,e){if(!this.lm)return[];e<=this.lastTs&&(e=this.lastTs+1),this.lastTs=e;const i=performance.now(),s=this.lm.detectForVideo(t,e);this.inferMs=performance.now()-i;const r=[];for(let a=0;a<s.landmarks.length;a++){const o=s.landmarks[a],c=s.worldLandmarks[a];if(!c)continue;const l=s.segmentationMasks?.[a];r.push({image:o.map(u=>({x:u.x,y:u.y,z:u.z,v:u.visibility??1})),world:c.map(Gx),mask:l?{data:l.getAsFloat32Array().slice(),w:l.width,h:l.height}:void 0})}return s.close(),r}close(){this.lm?.close(),this.lm=null}}/**
 * @license
 * Copyright 2010-2025 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const Yf="180",Xx=0,h1=1,$x=2,Mg=1,_g=2,Ms=3,ar=0,Bn=1,Te=2,er=0,ja=1,Xr=2,u1=3,f1=4,wg=5,Ar=100,qx=101,Yx=102,jx=103,Zx=104,bg=200,Jx=201,yg=202,Kx=203,Mu=204,_u=205,Qx=206,tM=207,eM=208,nM=209,iM=210,sM=211,rM=212,aM=213,oM=214,wu=0,bu=1,yu=2,co=3,Su=4,Eu=5,Tu=6,Au=7,Sg=0,cM=1,lM=2,nr=0,hM=1,uM=2,fM=3,dM=4,pM=5,mM=6,Eg=7,d1="attached",gM="detached",Tg=300,lo=301,ho=302,nh=303,Ru=304,Ih=306,uo=1e3,Cr=1001,Cu=1002,si=1003,vM=1004,Vc=1005,Pe=1006,$h=1007,Zs=1008,Hi=1009,Ag=1010,Rg=1011,pc=1012,jf=1013,$r=1014,is=1015,cr=1016,Zf=1017,Jf=1018,mc=1020,Cg=35902,Lg=35899,Pg=1021,Ig=1022,ln=1023,gc=1026,vc=1027,Kf=1028,Qf=1029,Dg=1030,td=1031,ed=1033,kl=33776,Ol=33777,Bl=33778,Hl=33779,Lu=35840,Pu=35841,Iu=35842,Du=35843,Uu=36196,Fu=37492,Nu=37496,ku=37808,Ou=37809,Bu=37810,Hu=37811,zu=37812,Vu=37813,Gu=37814,Wu=37815,Xu=37816,$u=37817,qu=37818,Yu=37819,ju=37820,Zu=37821,Ju=36492,Ku=36494,Qu=36495,tf=36283,ef=36284,nf=36285,sf=36286,xM=3200,MM=3201,Ug=0,_M=1,Qi="",xn="srgb",qr="srgb-linear",ih="linear",Se="srgb",na=7680,p1=519,wM=512,bM=513,yM=514,Fg=515,SM=516,EM=517,TM=518,AM=519,rf=35044,Gc=35048,m1="300 es",ss=2e3,sh=2001;class yo{addEventListener(t,e){this._listeners===void 0&&(this._listeners={});const i=this._listeners;i[t]===void 0&&(i[t]=[]),i[t].indexOf(e)===-1&&i[t].push(e)}hasEventListener(t,e){const i=this._listeners;return i===void 0?!1:i[t]!==void 0&&i[t].indexOf(e)!==-1}removeEventListener(t,e){const i=this._listeners;if(i===void 0)return;const s=i[t];if(s!==void 0){const r=s.indexOf(e);r!==-1&&s.splice(r,1)}}dispatchEvent(t){const e=this._listeners;if(e===void 0)return;const i=e[t.type];if(i!==void 0){t.target=this;const s=i.slice(0);for(let r=0,a=s.length;r<a;r++)s[r].call(this,t);t.target=null}}}const fn=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];let g1=1234567;const ic=Math.PI/180,fo=180/Math.PI;function ki(){const n=Math.random()*4294967295|0,t=Math.random()*4294967295|0,e=Math.random()*4294967295|0,i=Math.random()*4294967295|0;return(fn[n&255]+fn[n>>8&255]+fn[n>>16&255]+fn[n>>24&255]+"-"+fn[t&255]+fn[t>>8&255]+"-"+fn[t>>16&15|64]+fn[t>>24&255]+"-"+fn[e&63|128]+fn[e>>8&255]+"-"+fn[e>>16&255]+fn[e>>24&255]+fn[i&255]+fn[i>>8&255]+fn[i>>16&255]+fn[i>>24&255]).toLowerCase()}function ne(n,t,e){return Math.max(t,Math.min(e,n))}function nd(n,t){return(n%t+t)%t}function RM(n,t,e,i,s){return i+(n-t)*(s-i)/(e-t)}function CM(n,t,e){return n!==t?(e-n)/(t-n):0}function sc(n,t,e){return(1-e)*n+e*t}function LM(n,t,e,i){return sc(n,t,1-Math.exp(-e*i))}function PM(n,t=1){return t-Math.abs(nd(n,t*2)-t)}function IM(n,t,e){return n<=t?0:n>=e?1:(n=(n-t)/(e-t),n*n*(3-2*n))}function DM(n,t,e){return n<=t?0:n>=e?1:(n=(n-t)/(e-t),n*n*n*(n*(n*6-15)+10))}function UM(n,t){return n+Math.floor(Math.random()*(t-n+1))}function FM(n,t){return n+Math.random()*(t-n)}function NM(n){return n*(.5-Math.random())}function kM(n){n!==void 0&&(g1=n);let t=g1+=1831565813;return t=Math.imul(t^t>>>15,t|1),t^=t+Math.imul(t^t>>>7,t|61),((t^t>>>14)>>>0)/4294967296}function OM(n){return n*ic}function BM(n){return n*fo}function HM(n){return(n&n-1)===0&&n!==0}function zM(n){return Math.pow(2,Math.ceil(Math.log(n)/Math.LN2))}function VM(n){return Math.pow(2,Math.floor(Math.log(n)/Math.LN2))}function GM(n,t,e,i,s){const r=Math.cos,a=Math.sin,o=r(e/2),c=a(e/2),l=r((t+i)/2),u=a((t+i)/2),h=r((t-i)/2),f=a((t-i)/2),d=r((i-t)/2),p=a((i-t)/2);switch(s){case"XYX":n.set(o*u,c*h,c*f,o*l);break;case"YZY":n.set(c*f,o*u,c*h,o*l);break;case"ZXZ":n.set(c*h,c*f,o*u,o*l);break;case"XZX":n.set(o*u,c*p,c*d,o*l);break;case"YXY":n.set(c*d,o*u,c*p,o*l);break;case"ZYZ":n.set(c*p,c*d,o*u,o*l);break;default:console.warn("THREE.MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+s)}}function Ui(n,t){switch(t.constructor){case Float32Array:return n;case Uint32Array:return n/4294967295;case Uint16Array:return n/65535;case Uint8Array:return n/255;case Int32Array:return Math.max(n/2147483647,-1);case Int16Array:return Math.max(n/32767,-1);case Int8Array:return Math.max(n/127,-1);default:throw new Error("Invalid component type.")}}function we(n,t){switch(t.constructor){case Float32Array:return n;case Uint32Array:return Math.round(n*4294967295);case Uint16Array:return Math.round(n*65535);case Uint8Array:return Math.round(n*255);case Int32Array:return Math.round(n*2147483647);case Int16Array:return Math.round(n*32767);case Int8Array:return Math.round(n*127);default:throw new Error("Invalid component type.")}}const ni={DEG2RAD:ic,RAD2DEG:fo,generateUUID:ki,clamp:ne,euclideanModulo:nd,mapLinear:RM,inverseLerp:CM,lerp:sc,damp:LM,pingpong:PM,smoothstep:IM,smootherstep:DM,randInt:UM,randFloat:FM,randFloatSpread:NM,seededRandom:kM,degToRad:OM,radToDeg:BM,isPowerOfTwo:HM,ceilPowerOfTwo:zM,floorPowerOfTwo:VM,setQuaternionFromProperEuler:GM,normalize:we,denormalize:Ui};class ht{constructor(t=0,e=0){ht.prototype.isVector2=!0,this.x=t,this.y=e}get width(){return this.x}set width(t){this.x=t}get height(){return this.y}set height(t){this.y=t}set(t,e){return this.x=t,this.y=e,this}setScalar(t){return this.x=t,this.y=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y)}copy(t){return this.x=t.x,this.y=t.y,this}add(t){return this.x+=t.x,this.y+=t.y,this}addScalar(t){return this.x+=t,this.y+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this}subScalar(t){return this.x-=t,this.y-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this}multiply(t){return this.x*=t.x,this.y*=t.y,this}multiplyScalar(t){return this.x*=t,this.y*=t,this}divide(t){return this.x/=t.x,this.y/=t.y,this}divideScalar(t){return this.multiplyScalar(1/t)}applyMatrix3(t){const e=this.x,i=this.y,s=t.elements;return this.x=s[0]*e+s[3]*i+s[6],this.y=s[1]*e+s[4]*i+s[7],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this}clamp(t,e){return this.x=ne(this.x,t.x,e.x),this.y=ne(this.y,t.y,e.y),this}clampScalar(t,e){return this.x=ne(this.x,t,e),this.y=ne(this.y,t,e),this}clampLength(t,e){const i=this.length();return this.divideScalar(i||1).multiplyScalar(ne(i,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(t){return this.x*t.x+this.y*t.y}cross(t){return this.x*t.y-this.y*t.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const i=this.dot(t)/e;return Math.acos(ne(i,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,i=this.y-t.y;return e*e+i*i}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this}lerpVectors(t,e,i){return this.x=t.x+(e.x-t.x)*i,this.y=t.y+(e.y-t.y)*i,this}equals(t){return t.x===this.x&&t.y===this.y}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this}rotateAround(t,e){const i=Math.cos(e),s=Math.sin(e),r=this.x-t.x,a=this.y-t.y;return this.x=r*i-a*s+t.x,this.y=r*s+a*i+t.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class ie{constructor(t=0,e=0,i=0,s=1){this.isQuaternion=!0,this._x=t,this._y=e,this._z=i,this._w=s}static slerpFlat(t,e,i,s,r,a,o){let c=i[s+0],l=i[s+1],u=i[s+2],h=i[s+3];const f=r[a+0],d=r[a+1],p=r[a+2],v=r[a+3];if(o===0){t[e+0]=c,t[e+1]=l,t[e+2]=u,t[e+3]=h;return}if(o===1){t[e+0]=f,t[e+1]=d,t[e+2]=p,t[e+3]=v;return}if(h!==v||c!==f||l!==d||u!==p){let g=1-o;const m=c*f+l*d+u*p+h*v,M=m>=0?1:-1,x=1-m*m;if(x>Number.EPSILON){const b=Math.sqrt(x),S=Math.atan2(b,m*M);g=Math.sin(g*S)/b,o=Math.sin(o*S)/b}const _=o*M;if(c=c*g+f*_,l=l*g+d*_,u=u*g+p*_,h=h*g+v*_,g===1-o){const b=1/Math.sqrt(c*c+l*l+u*u+h*h);c*=b,l*=b,u*=b,h*=b}}t[e]=c,t[e+1]=l,t[e+2]=u,t[e+3]=h}static multiplyQuaternionsFlat(t,e,i,s,r,a){const o=i[s],c=i[s+1],l=i[s+2],u=i[s+3],h=r[a],f=r[a+1],d=r[a+2],p=r[a+3];return t[e]=o*p+u*h+c*d-l*f,t[e+1]=c*p+u*f+l*h-o*d,t[e+2]=l*p+u*d+o*f-c*h,t[e+3]=u*p-o*h-c*f-l*d,t}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get w(){return this._w}set w(t){this._w=t,this._onChangeCallback()}set(t,e,i,s){return this._x=t,this._y=e,this._z=i,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(t){return this._x=t.x,this._y=t.y,this._z=t.z,this._w=t.w,this._onChangeCallback(),this}setFromEuler(t,e=!0){const i=t._x,s=t._y,r=t._z,a=t._order,o=Math.cos,c=Math.sin,l=o(i/2),u=o(s/2),h=o(r/2),f=c(i/2),d=c(s/2),p=c(r/2);switch(a){case"XYZ":this._x=f*u*h+l*d*p,this._y=l*d*h-f*u*p,this._z=l*u*p+f*d*h,this._w=l*u*h-f*d*p;break;case"YXZ":this._x=f*u*h+l*d*p,this._y=l*d*h-f*u*p,this._z=l*u*p-f*d*h,this._w=l*u*h+f*d*p;break;case"ZXY":this._x=f*u*h-l*d*p,this._y=l*d*h+f*u*p,this._z=l*u*p+f*d*h,this._w=l*u*h-f*d*p;break;case"ZYX":this._x=f*u*h-l*d*p,this._y=l*d*h+f*u*p,this._z=l*u*p-f*d*h,this._w=l*u*h+f*d*p;break;case"YZX":this._x=f*u*h+l*d*p,this._y=l*d*h+f*u*p,this._z=l*u*p-f*d*h,this._w=l*u*h-f*d*p;break;case"XZY":this._x=f*u*h-l*d*p,this._y=l*d*h-f*u*p,this._z=l*u*p+f*d*h,this._w=l*u*h+f*d*p;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+a)}return e===!0&&this._onChangeCallback(),this}setFromAxisAngle(t,e){const i=e/2,s=Math.sin(i);return this._x=t.x*s,this._y=t.y*s,this._z=t.z*s,this._w=Math.cos(i),this._onChangeCallback(),this}setFromRotationMatrix(t){const e=t.elements,i=e[0],s=e[4],r=e[8],a=e[1],o=e[5],c=e[9],l=e[2],u=e[6],h=e[10],f=i+o+h;if(f>0){const d=.5/Math.sqrt(f+1);this._w=.25/d,this._x=(u-c)*d,this._y=(r-l)*d,this._z=(a-s)*d}else if(i>o&&i>h){const d=2*Math.sqrt(1+i-o-h);this._w=(u-c)/d,this._x=.25*d,this._y=(s+a)/d,this._z=(r+l)/d}else if(o>h){const d=2*Math.sqrt(1+o-i-h);this._w=(r-l)/d,this._x=(s+a)/d,this._y=.25*d,this._z=(c+u)/d}else{const d=2*Math.sqrt(1+h-i-o);this._w=(a-s)/d,this._x=(r+l)/d,this._y=(c+u)/d,this._z=.25*d}return this._onChangeCallback(),this}setFromUnitVectors(t,e){let i=t.dot(e)+1;return i<1e-8?(i=0,Math.abs(t.x)>Math.abs(t.z)?(this._x=-t.y,this._y=t.x,this._z=0,this._w=i):(this._x=0,this._y=-t.z,this._z=t.y,this._w=i)):(this._x=t.y*e.z-t.z*e.y,this._y=t.z*e.x-t.x*e.z,this._z=t.x*e.y-t.y*e.x,this._w=i),this.normalize()}angleTo(t){return 2*Math.acos(Math.abs(ne(this.dot(t),-1,1)))}rotateTowards(t,e){const i=this.angleTo(t);if(i===0)return this;const s=Math.min(1,e/i);return this.slerp(t,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(t){return this._x*t._x+this._y*t._y+this._z*t._z+this._w*t._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let t=this.length();return t===0?(this._x=0,this._y=0,this._z=0,this._w=1):(t=1/t,this._x=this._x*t,this._y=this._y*t,this._z=this._z*t,this._w=this._w*t),this._onChangeCallback(),this}multiply(t){return this.multiplyQuaternions(this,t)}premultiply(t){return this.multiplyQuaternions(t,this)}multiplyQuaternions(t,e){const i=t._x,s=t._y,r=t._z,a=t._w,o=e._x,c=e._y,l=e._z,u=e._w;return this._x=i*u+a*o+s*l-r*c,this._y=s*u+a*c+r*o-i*l,this._z=r*u+a*l+i*c-s*o,this._w=a*u-i*o-s*c-r*l,this._onChangeCallback(),this}slerp(t,e){if(e===0)return this;if(e===1)return this.copy(t);const i=this._x,s=this._y,r=this._z,a=this._w;let o=a*t._w+i*t._x+s*t._y+r*t._z;if(o<0?(this._w=-t._w,this._x=-t._x,this._y=-t._y,this._z=-t._z,o=-o):this.copy(t),o>=1)return this._w=a,this._x=i,this._y=s,this._z=r,this;const c=1-o*o;if(c<=Number.EPSILON){const d=1-e;return this._w=d*a+e*this._w,this._x=d*i+e*this._x,this._y=d*s+e*this._y,this._z=d*r+e*this._z,this.normalize(),this}const l=Math.sqrt(c),u=Math.atan2(l,o),h=Math.sin((1-e)*u)/l,f=Math.sin(e*u)/l;return this._w=a*h+this._w*f,this._x=i*h+this._x*f,this._y=s*h+this._y*f,this._z=r*h+this._z*f,this._onChangeCallback(),this}slerpQuaternions(t,e,i){return this.copy(t).slerp(e,i)}random(){const t=2*Math.PI*Math.random(),e=2*Math.PI*Math.random(),i=Math.random(),s=Math.sqrt(1-i),r=Math.sqrt(i);return this.set(s*Math.sin(t),s*Math.cos(t),r*Math.sin(e),r*Math.cos(e))}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._w===this._w}fromArray(t,e=0){return this._x=t[e],this._y=t[e+1],this._z=t[e+2],this._w=t[e+3],this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._w,t}fromBufferAttribute(t,e){return this._x=t.getX(e),this._y=t.getY(e),this._z=t.getZ(e),this._w=t.getW(e),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class C{constructor(t=0,e=0,i=0){C.prototype.isVector3=!0,this.x=t,this.y=e,this.z=i}set(t,e,i){return i===void 0&&(i=this.z),this.x=t,this.y=e,this.z=i,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this}multiplyVectors(t,e){return this.x=t.x*e.x,this.y=t.y*e.y,this.z=t.z*e.z,this}applyEuler(t){return this.applyQuaternion(v1.setFromEuler(t))}applyAxisAngle(t,e){return this.applyQuaternion(v1.setFromAxisAngle(t,e))}applyMatrix3(t){const e=this.x,i=this.y,s=this.z,r=t.elements;return this.x=r[0]*e+r[3]*i+r[6]*s,this.y=r[1]*e+r[4]*i+r[7]*s,this.z=r[2]*e+r[5]*i+r[8]*s,this}applyNormalMatrix(t){return this.applyMatrix3(t).normalize()}applyMatrix4(t){const e=this.x,i=this.y,s=this.z,r=t.elements,a=1/(r[3]*e+r[7]*i+r[11]*s+r[15]);return this.x=(r[0]*e+r[4]*i+r[8]*s+r[12])*a,this.y=(r[1]*e+r[5]*i+r[9]*s+r[13])*a,this.z=(r[2]*e+r[6]*i+r[10]*s+r[14])*a,this}applyQuaternion(t){const e=this.x,i=this.y,s=this.z,r=t.x,a=t.y,o=t.z,c=t.w,l=2*(a*s-o*i),u=2*(o*e-r*s),h=2*(r*i-a*e);return this.x=e+c*l+a*h-o*u,this.y=i+c*u+o*l-r*h,this.z=s+c*h+r*u-a*l,this}project(t){return this.applyMatrix4(t.matrixWorldInverse).applyMatrix4(t.projectionMatrix)}unproject(t){return this.applyMatrix4(t.projectionMatrixInverse).applyMatrix4(t.matrixWorld)}transformDirection(t){const e=this.x,i=this.y,s=this.z,r=t.elements;return this.x=r[0]*e+r[4]*i+r[8]*s,this.y=r[1]*e+r[5]*i+r[9]*s,this.z=r[2]*e+r[6]*i+r[10]*s,this.normalize()}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this}divideScalar(t){return this.multiplyScalar(1/t)}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this}clamp(t,e){return this.x=ne(this.x,t.x,e.x),this.y=ne(this.y,t.y,e.y),this.z=ne(this.z,t.z,e.z),this}clampScalar(t,e){return this.x=ne(this.x,t,e),this.y=ne(this.y,t,e),this.z=ne(this.z,t,e),this}clampLength(t,e){const i=this.length();return this.divideScalar(i||1).multiplyScalar(ne(i,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this}lerpVectors(t,e,i){return this.x=t.x+(e.x-t.x)*i,this.y=t.y+(e.y-t.y)*i,this.z=t.z+(e.z-t.z)*i,this}cross(t){return this.crossVectors(this,t)}crossVectors(t,e){const i=t.x,s=t.y,r=t.z,a=e.x,o=e.y,c=e.z;return this.x=s*c-r*o,this.y=r*a-i*c,this.z=i*o-s*a,this}projectOnVector(t){const e=t.lengthSq();if(e===0)return this.set(0,0,0);const i=t.dot(this)/e;return this.copy(t).multiplyScalar(i)}projectOnPlane(t){return qh.copy(this).projectOnVector(t),this.sub(qh)}reflect(t){return this.sub(qh.copy(t).multiplyScalar(2*this.dot(t)))}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const i=this.dot(t)/e;return Math.acos(ne(i,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,i=this.y-t.y,s=this.z-t.z;return e*e+i*i+s*s}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)+Math.abs(this.z-t.z)}setFromSpherical(t){return this.setFromSphericalCoords(t.radius,t.phi,t.theta)}setFromSphericalCoords(t,e,i){const s=Math.sin(e)*t;return this.x=s*Math.sin(i),this.y=Math.cos(e)*t,this.z=s*Math.cos(i),this}setFromCylindrical(t){return this.setFromCylindricalCoords(t.radius,t.theta,t.y)}setFromCylindricalCoords(t,e,i){return this.x=t*Math.sin(e),this.y=i,this.z=t*Math.cos(e),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this}setFromMatrixScale(t){const e=this.setFromMatrixColumn(t,0).length(),i=this.setFromMatrixColumn(t,1).length(),s=this.setFromMatrixColumn(t,2).length();return this.x=e,this.y=i,this.z=s,this}setFromMatrixColumn(t,e){return this.fromArray(t.elements,e*4)}setFromMatrix3Column(t,e){return this.fromArray(t.elements,e*3)}setFromEuler(t){return this.x=t._x,this.y=t._y,this.z=t._z,this}setFromColor(t){return this.x=t.r,this.y=t.g,this.z=t.b,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const t=Math.random()*Math.PI*2,e=Math.random()*2-1,i=Math.sqrt(1-e*e);return this.x=i*Math.cos(t),this.y=e,this.z=i*Math.sin(t),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const qh=new C,v1=new ie;class le{constructor(t,e,i,s,r,a,o,c,l){le.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],t!==void 0&&this.set(t,e,i,s,r,a,o,c,l)}set(t,e,i,s,r,a,o,c,l){const u=this.elements;return u[0]=t,u[1]=s,u[2]=o,u[3]=e,u[4]=r,u[5]=c,u[6]=i,u[7]=a,u[8]=l,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(t){const e=this.elements,i=t.elements;return e[0]=i[0],e[1]=i[1],e[2]=i[2],e[3]=i[3],e[4]=i[4],e[5]=i[5],e[6]=i[6],e[7]=i[7],e[8]=i[8],this}extractBasis(t,e,i){return t.setFromMatrix3Column(this,0),e.setFromMatrix3Column(this,1),i.setFromMatrix3Column(this,2),this}setFromMatrix4(t){const e=t.elements;return this.set(e[0],e[4],e[8],e[1],e[5],e[9],e[2],e[6],e[10]),this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const i=t.elements,s=e.elements,r=this.elements,a=i[0],o=i[3],c=i[6],l=i[1],u=i[4],h=i[7],f=i[2],d=i[5],p=i[8],v=s[0],g=s[3],m=s[6],M=s[1],x=s[4],_=s[7],b=s[2],S=s[5],T=s[8];return r[0]=a*v+o*M+c*b,r[3]=a*g+o*x+c*S,r[6]=a*m+o*_+c*T,r[1]=l*v+u*M+h*b,r[4]=l*g+u*x+h*S,r[7]=l*m+u*_+h*T,r[2]=f*v+d*M+p*b,r[5]=f*g+d*x+p*S,r[8]=f*m+d*_+p*T,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[3]*=t,e[6]*=t,e[1]*=t,e[4]*=t,e[7]*=t,e[2]*=t,e[5]*=t,e[8]*=t,this}determinant(){const t=this.elements,e=t[0],i=t[1],s=t[2],r=t[3],a=t[4],o=t[5],c=t[6],l=t[7],u=t[8];return e*a*u-e*o*l-i*r*u+i*o*c+s*r*l-s*a*c}invert(){const t=this.elements,e=t[0],i=t[1],s=t[2],r=t[3],a=t[4],o=t[5],c=t[6],l=t[7],u=t[8],h=u*a-o*l,f=o*c-u*r,d=l*r-a*c,p=e*h+i*f+s*d;if(p===0)return this.set(0,0,0,0,0,0,0,0,0);const v=1/p;return t[0]=h*v,t[1]=(s*l-u*i)*v,t[2]=(o*i-s*a)*v,t[3]=f*v,t[4]=(u*e-s*c)*v,t[5]=(s*r-o*e)*v,t[6]=d*v,t[7]=(i*c-l*e)*v,t[8]=(a*e-i*r)*v,this}transpose(){let t;const e=this.elements;return t=e[1],e[1]=e[3],e[3]=t,t=e[2],e[2]=e[6],e[6]=t,t=e[5],e[5]=e[7],e[7]=t,this}getNormalMatrix(t){return this.setFromMatrix4(t).invert().transpose()}transposeIntoArray(t){const e=this.elements;return t[0]=e[0],t[1]=e[3],t[2]=e[6],t[3]=e[1],t[4]=e[4],t[5]=e[7],t[6]=e[2],t[7]=e[5],t[8]=e[8],this}setUvTransform(t,e,i,s,r,a,o){const c=Math.cos(r),l=Math.sin(r);return this.set(i*c,i*l,-i*(c*a+l*o)+a+t,-s*l,s*c,-s*(-l*a+c*o)+o+e,0,0,1),this}scale(t,e){return this.premultiply(Yh.makeScale(t,e)),this}rotate(t){return this.premultiply(Yh.makeRotation(-t)),this}translate(t,e){return this.premultiply(Yh.makeTranslation(t,e)),this}makeTranslation(t,e){return t.isVector2?this.set(1,0,t.x,0,1,t.y,0,0,1):this.set(1,0,t,0,1,e,0,0,1),this}makeRotation(t){const e=Math.cos(t),i=Math.sin(t);return this.set(e,-i,0,i,e,0,0,0,1),this}makeScale(t,e){return this.set(t,0,0,0,e,0,0,0,1),this}equals(t){const e=this.elements,i=t.elements;for(let s=0;s<9;s++)if(e[s]!==i[s])return!1;return!0}fromArray(t,e=0){for(let i=0;i<9;i++)this.elements[i]=t[i+e];return this}toArray(t=[],e=0){const i=this.elements;return t[e]=i[0],t[e+1]=i[1],t[e+2]=i[2],t[e+3]=i[3],t[e+4]=i[4],t[e+5]=i[5],t[e+6]=i[6],t[e+7]=i[7],t[e+8]=i[8],t}clone(){return new this.constructor().fromArray(this.elements)}}const Yh=new le;function Ng(n){for(let t=n.length-1;t>=0;--t)if(n[t]>=65535)return!0;return!1}function rh(n){return document.createElementNS("http://www.w3.org/1999/xhtml",n)}function WM(){const n=rh("canvas");return n.style.display="block",n}const x1={};function xc(n){n in x1||(x1[n]=!0,console.warn(n))}function XM(n,t,e){return new Promise(function(i,s){function r(){switch(n.clientWaitSync(t,n.SYNC_FLUSH_COMMANDS_BIT,0)){case n.WAIT_FAILED:s();break;case n.TIMEOUT_EXPIRED:setTimeout(r,e);break;default:i()}}setTimeout(r,e)})}const M1=new le().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),_1=new le().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function $M(){const n={enabled:!0,workingColorSpace:qr,spaces:{},convert:function(s,r,a){return this.enabled===!1||r===a||!r||!a||(this.spaces[r].transfer===Se&&(s.r=Rs(s.r),s.g=Rs(s.g),s.b=Rs(s.b)),this.spaces[r].primaries!==this.spaces[a].primaries&&(s.applyMatrix3(this.spaces[r].toXYZ),s.applyMatrix3(this.spaces[a].fromXYZ)),this.spaces[a].transfer===Se&&(s.r=Za(s.r),s.g=Za(s.g),s.b=Za(s.b))),s},workingToColorSpace:function(s,r){return this.convert(s,this.workingColorSpace,r)},colorSpaceToWorking:function(s,r){return this.convert(s,r,this.workingColorSpace)},getPrimaries:function(s){return this.spaces[s].primaries},getTransfer:function(s){return s===Qi?ih:this.spaces[s].transfer},getToneMappingMode:function(s){return this.spaces[s].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(s,r=this.workingColorSpace){return s.fromArray(this.spaces[r].luminanceCoefficients)},define:function(s){Object.assign(this.spaces,s)},_getMatrix:function(s,r,a){return s.copy(this.spaces[r].toXYZ).multiply(this.spaces[a].fromXYZ)},_getDrawingBufferColorSpace:function(s){return this.spaces[s].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(s=this.workingColorSpace){return this.spaces[s].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(s,r){return xc("THREE.ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),n.workingToColorSpace(s,r)},toWorkingColorSpace:function(s,r){return xc("THREE.ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),n.colorSpaceToWorking(s,r)}},t=[.64,.33,.3,.6,.15,.06],e=[.2126,.7152,.0722],i=[.3127,.329];return n.define({[qr]:{primaries:t,whitePoint:i,transfer:ih,toXYZ:M1,fromXYZ:_1,luminanceCoefficients:e,workingColorSpaceConfig:{unpackColorSpace:xn},outputColorSpaceConfig:{drawingBufferColorSpace:xn}},[xn]:{primaries:t,whitePoint:i,transfer:Se,toXYZ:M1,fromXYZ:_1,luminanceCoefficients:e,outputColorSpaceConfig:{drawingBufferColorSpace:xn}}}),n}const ve=$M();function Rs(n){return n<.04045?n*.0773993808:Math.pow(n*.9478672986+.0521327014,2.4)}function Za(n){return n<.0031308?n*12.92:1.055*Math.pow(n,.41666)-.055}let ia;class qM{static getDataURL(t,e="image/png"){if(/^data:/i.test(t.src)||typeof HTMLCanvasElement>"u")return t.src;let i;if(t instanceof HTMLCanvasElement)i=t;else{ia===void 0&&(ia=rh("canvas")),ia.width=t.width,ia.height=t.height;const s=ia.getContext("2d");t instanceof ImageData?s.putImageData(t,0,0):s.drawImage(t,0,0,t.width,t.height),i=ia}return i.toDataURL(e)}static sRGBToLinear(t){if(typeof HTMLImageElement<"u"&&t instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&t instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&t instanceof ImageBitmap){const e=rh("canvas");e.width=t.width,e.height=t.height;const i=e.getContext("2d");i.drawImage(t,0,0,t.width,t.height);const s=i.getImageData(0,0,t.width,t.height),r=s.data;for(let a=0;a<r.length;a++)r[a]=Rs(r[a]/255)*255;return i.putImageData(s,0,0),e}else if(t.data){const e=t.data.slice(0);for(let i=0;i<e.length;i++)e instanceof Uint8Array||e instanceof Uint8ClampedArray?e[i]=Math.floor(Rs(e[i]/255)*255):e[i]=Rs(e[i]);return{data:e,width:t.width,height:t.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),t}}let YM=0;class id{constructor(t=null){this.isSource=!0,Object.defineProperty(this,"id",{value:YM++}),this.uuid=ki(),this.data=t,this.dataReady=!0,this.version=0}getSize(t){const e=this.data;return typeof HTMLVideoElement<"u"&&e instanceof HTMLVideoElement?t.set(e.videoWidth,e.videoHeight,0):e instanceof VideoFrame?t.set(e.displayHeight,e.displayWidth,0):e!==null?t.set(e.width,e.height,e.depth||0):t.set(0,0,0),t}set needsUpdate(t){t===!0&&this.version++}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.images[this.uuid]!==void 0)return t.images[this.uuid];const i={uuid:this.uuid,url:""},s=this.data;if(s!==null){let r;if(Array.isArray(s)){r=[];for(let a=0,o=s.length;a<o;a++)s[a].isDataTexture?r.push(jh(s[a].image)):r.push(jh(s[a]))}else r=jh(s);i.url=r}return e||(t.images[this.uuid]=i),i}}function jh(n){return typeof HTMLImageElement<"u"&&n instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&n instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&n instanceof ImageBitmap?qM.getDataURL(n):n.data?{data:Array.from(n.data),width:n.width,height:n.height,type:n.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}let jM=0;const Zh=new C;class un extends yo{constructor(t=un.DEFAULT_IMAGE,e=un.DEFAULT_MAPPING,i=Cr,s=Cr,r=Pe,a=Zs,o=ln,c=Hi,l=un.DEFAULT_ANISOTROPY,u=Qi){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:jM++}),this.uuid=ki(),this.name="",this.source=new id(t),this.mipmaps=[],this.mapping=e,this.channel=0,this.wrapS=i,this.wrapT=s,this.magFilter=r,this.minFilter=a,this.anisotropy=l,this.format=o,this.internalFormat=null,this.type=c,this.offset=new ht(0,0),this.repeat=new ht(1,1),this.center=new ht(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new le,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=u,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(t&&t.depth&&t.depth>1),this.pmremVersion=0}get width(){return this.source.getSize(Zh).x}get height(){return this.source.getSize(Zh).y}get depth(){return this.source.getSize(Zh).z}get image(){return this.source.data}set image(t=null){this.source.data=t}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(t){return this.name=t.name,this.source=t.source,this.mipmaps=t.mipmaps.slice(0),this.mapping=t.mapping,this.channel=t.channel,this.wrapS=t.wrapS,this.wrapT=t.wrapT,this.magFilter=t.magFilter,this.minFilter=t.minFilter,this.anisotropy=t.anisotropy,this.format=t.format,this.internalFormat=t.internalFormat,this.type=t.type,this.offset.copy(t.offset),this.repeat.copy(t.repeat),this.center.copy(t.center),this.rotation=t.rotation,this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrix.copy(t.matrix),this.generateMipmaps=t.generateMipmaps,this.premultiplyAlpha=t.premultiplyAlpha,this.flipY=t.flipY,this.unpackAlignment=t.unpackAlignment,this.colorSpace=t.colorSpace,this.renderTarget=t.renderTarget,this.isRenderTargetTexture=t.isRenderTargetTexture,this.isArrayTexture=t.isArrayTexture,this.userData=JSON.parse(JSON.stringify(t.userData)),this.needsUpdate=!0,this}setValues(t){for(const e in t){const i=t[e];if(i===void 0){console.warn(`THREE.Texture.setValues(): parameter '${e}' has value of undefined.`);continue}const s=this[e];if(s===void 0){console.warn(`THREE.Texture.setValues(): property '${e}' does not exist.`);continue}s&&i&&s.isVector2&&i.isVector2||s&&i&&s.isVector3&&i.isVector3||s&&i&&s.isMatrix3&&i.isMatrix3?s.copy(i):this[e]=i}}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.textures[this.uuid]!==void 0)return t.textures[this.uuid];const i={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(t).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(i.userData=this.userData),e||(t.textures[this.uuid]=i),i}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(t){if(this.mapping!==Tg)return t;if(t.applyMatrix3(this.matrix),t.x<0||t.x>1)switch(this.wrapS){case uo:t.x=t.x-Math.floor(t.x);break;case Cr:t.x=t.x<0?0:1;break;case Cu:Math.abs(Math.floor(t.x)%2)===1?t.x=Math.ceil(t.x)-t.x:t.x=t.x-Math.floor(t.x);break}if(t.y<0||t.y>1)switch(this.wrapT){case uo:t.y=t.y-Math.floor(t.y);break;case Cr:t.y=t.y<0?0:1;break;case Cu:Math.abs(Math.floor(t.y)%2)===1?t.y=Math.ceil(t.y)-t.y:t.y=t.y-Math.floor(t.y);break}return this.flipY&&(t.y=1-t.y),t}set needsUpdate(t){t===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(t){t===!0&&this.pmremVersion++}}un.DEFAULT_IMAGE=null;un.DEFAULT_MAPPING=Tg;un.DEFAULT_ANISOTROPY=1;class fe{constructor(t=0,e=0,i=0,s=1){fe.prototype.isVector4=!0,this.x=t,this.y=e,this.z=i,this.w=s}get width(){return this.z}set width(t){this.z=t}get height(){return this.w}set height(t){this.w=t}set(t,e,i,s){return this.x=t,this.y=e,this.z=i,this.w=s,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this.w=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setW(t){return this.w=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;case 3:this.w=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this.w=t.w!==void 0?t.w:1,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this.w+=t.w,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this.w+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this.w=t.w+e.w,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this.w+=t.w*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this.w-=t.w,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this.w-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this.w=t.w-e.w,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this.w*=t.w,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this.w*=t,this}applyMatrix4(t){const e=this.x,i=this.y,s=this.z,r=this.w,a=t.elements;return this.x=a[0]*e+a[4]*i+a[8]*s+a[12]*r,this.y=a[1]*e+a[5]*i+a[9]*s+a[13]*r,this.z=a[2]*e+a[6]*i+a[10]*s+a[14]*r,this.w=a[3]*e+a[7]*i+a[11]*s+a[15]*r,this}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this.w/=t.w,this}divideScalar(t){return this.multiplyScalar(1/t)}setAxisAngleFromQuaternion(t){this.w=2*Math.acos(t.w);const e=Math.sqrt(1-t.w*t.w);return e<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=t.x/e,this.y=t.y/e,this.z=t.z/e),this}setAxisAngleFromRotationMatrix(t){let e,i,s,r;const c=t.elements,l=c[0],u=c[4],h=c[8],f=c[1],d=c[5],p=c[9],v=c[2],g=c[6],m=c[10];if(Math.abs(u-f)<.01&&Math.abs(h-v)<.01&&Math.abs(p-g)<.01){if(Math.abs(u+f)<.1&&Math.abs(h+v)<.1&&Math.abs(p+g)<.1&&Math.abs(l+d+m-3)<.1)return this.set(1,0,0,0),this;e=Math.PI;const x=(l+1)/2,_=(d+1)/2,b=(m+1)/2,S=(u+f)/4,T=(h+v)/4,A=(p+g)/4;return x>_&&x>b?x<.01?(i=0,s=.707106781,r=.707106781):(i=Math.sqrt(x),s=S/i,r=T/i):_>b?_<.01?(i=.707106781,s=0,r=.707106781):(s=Math.sqrt(_),i=S/s,r=A/s):b<.01?(i=.707106781,s=.707106781,r=0):(r=Math.sqrt(b),i=T/r,s=A/r),this.set(i,s,r,e),this}let M=Math.sqrt((g-p)*(g-p)+(h-v)*(h-v)+(f-u)*(f-u));return Math.abs(M)<.001&&(M=1),this.x=(g-p)/M,this.y=(h-v)/M,this.z=(f-u)/M,this.w=Math.acos((l+d+m-1)/2),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this.w=e[15],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this.w=Math.min(this.w,t.w),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this.w=Math.max(this.w,t.w),this}clamp(t,e){return this.x=ne(this.x,t.x,e.x),this.y=ne(this.y,t.y,e.y),this.z=ne(this.z,t.z,e.z),this.w=ne(this.w,t.w,e.w),this}clampScalar(t,e){return this.x=ne(this.x,t,e),this.y=ne(this.y,t,e),this.z=ne(this.z,t,e),this.w=ne(this.w,t,e),this}clampLength(t,e){const i=this.length();return this.divideScalar(i||1).multiplyScalar(ne(i,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z+this.w*t.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this.w+=(t.w-this.w)*e,this}lerpVectors(t,e,i){return this.x=t.x+(e.x-t.x)*i,this.y=t.y+(e.y-t.y)*i,this.z=t.z+(e.z-t.z)*i,this.w=t.w+(e.w-t.w)*i,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z&&t.w===this.w}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this.w=t[e+3],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t[e+3]=this.w,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this.w=t.getW(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class ZM extends yo{constructor(t=1,e=1,i={}){super(),i=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:Pe,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1},i),this.isRenderTarget=!0,this.width=t,this.height=e,this.depth=i.depth,this.scissor=new fe(0,0,t,e),this.scissorTest=!1,this.viewport=new fe(0,0,t,e);const s={width:t,height:e,depth:i.depth},r=new un(s);this.textures=[];const a=i.count;for(let o=0;o<a;o++)this.textures[o]=r.clone(),this.textures[o].isRenderTargetTexture=!0,this.textures[o].renderTarget=this;this._setTextureOptions(i),this.depthBuffer=i.depthBuffer,this.stencilBuffer=i.stencilBuffer,this.resolveDepthBuffer=i.resolveDepthBuffer,this.resolveStencilBuffer=i.resolveStencilBuffer,this._depthTexture=null,this.depthTexture=i.depthTexture,this.samples=i.samples,this.multiview=i.multiview}_setTextureOptions(t={}){const e={minFilter:Pe,generateMipmaps:!1,flipY:!1,internalFormat:null};t.mapping!==void 0&&(e.mapping=t.mapping),t.wrapS!==void 0&&(e.wrapS=t.wrapS),t.wrapT!==void 0&&(e.wrapT=t.wrapT),t.wrapR!==void 0&&(e.wrapR=t.wrapR),t.magFilter!==void 0&&(e.magFilter=t.magFilter),t.minFilter!==void 0&&(e.minFilter=t.minFilter),t.format!==void 0&&(e.format=t.format),t.type!==void 0&&(e.type=t.type),t.anisotropy!==void 0&&(e.anisotropy=t.anisotropy),t.colorSpace!==void 0&&(e.colorSpace=t.colorSpace),t.flipY!==void 0&&(e.flipY=t.flipY),t.generateMipmaps!==void 0&&(e.generateMipmaps=t.generateMipmaps),t.internalFormat!==void 0&&(e.internalFormat=t.internalFormat);for(let i=0;i<this.textures.length;i++)this.textures[i].setValues(e)}get texture(){return this.textures[0]}set texture(t){this.textures[0]=t}set depthTexture(t){this._depthTexture!==null&&(this._depthTexture.renderTarget=null),t!==null&&(t.renderTarget=this),this._depthTexture=t}get depthTexture(){return this._depthTexture}setSize(t,e,i=1){if(this.width!==t||this.height!==e||this.depth!==i){this.width=t,this.height=e,this.depth=i;for(let s=0,r=this.textures.length;s<r;s++)this.textures[s].image.width=t,this.textures[s].image.height=e,this.textures[s].image.depth=i,this.textures[s].isArrayTexture=this.textures[s].image.depth>1;this.dispose()}this.viewport.set(0,0,t,e),this.scissor.set(0,0,t,e)}clone(){return new this.constructor().copy(this)}copy(t){this.width=t.width,this.height=t.height,this.depth=t.depth,this.scissor.copy(t.scissor),this.scissorTest=t.scissorTest,this.viewport.copy(t.viewport),this.textures.length=0;for(let e=0,i=t.textures.length;e<i;e++){this.textures[e]=t.textures[e].clone(),this.textures[e].isRenderTargetTexture=!0,this.textures[e].renderTarget=this;const s=Object.assign({},t.textures[e].image);this.textures[e].source=new id(s)}return this.depthBuffer=t.depthBuffer,this.stencilBuffer=t.stencilBuffer,this.resolveDepthBuffer=t.resolveDepthBuffer,this.resolveStencilBuffer=t.resolveStencilBuffer,t.depthTexture!==null&&(this.depthTexture=t.depthTexture.clone()),this.samples=t.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class En extends ZM{constructor(t=1,e=1,i={}){super(t,e,i),this.isWebGLRenderTarget=!0}}class sd extends un{constructor(t=null,e=1,i=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:t,width:e,height:i,depth:s},this.magFilter=si,this.minFilter=si,this.wrapR=Cr,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(t){this.layerUpdates.add(t)}clearLayerUpdates(){this.layerUpdates.clear()}}class JM extends En{constructor(t=1,e=1,i=1,s={}){super(t,e,s),this.isWebGLArrayRenderTarget=!0,this.depth=i,this.texture=new sd(null,t,e,i),this._setTextureOptions(s),this.texture.isRenderTargetTexture=!0}}class KM extends un{constructor(t=null,e=1,i=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:t,width:e,height:i,depth:s},this.magFilter=si,this.minFilter=si,this.wrapR=Cr,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class So{constructor(t=new C(1/0,1/0,1/0),e=new C(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=t,this.max=e}set(t,e){return this.min.copy(t),this.max.copy(e),this}setFromArray(t){this.makeEmpty();for(let e=0,i=t.length;e<i;e+=3)this.expandByPoint(bi.fromArray(t,e));return this}setFromBufferAttribute(t){this.makeEmpty();for(let e=0,i=t.count;e<i;e++)this.expandByPoint(bi.fromBufferAttribute(t,e));return this}setFromPoints(t){this.makeEmpty();for(let e=0,i=t.length;e<i;e++)this.expandByPoint(t[e]);return this}setFromCenterAndSize(t,e){const i=bi.copy(e).multiplyScalar(.5);return this.min.copy(t).sub(i),this.max.copy(t).add(i),this}setFromObject(t,e=!1){return this.makeEmpty(),this.expandByObject(t,e)}clone(){return new this.constructor().copy(this)}copy(t){return this.min.copy(t.min),this.max.copy(t.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(t){return this.isEmpty()?t.set(0,0,0):t.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(t){return this.isEmpty()?t.set(0,0,0):t.subVectors(this.max,this.min)}expandByPoint(t){return this.min.min(t),this.max.max(t),this}expandByVector(t){return this.min.sub(t),this.max.add(t),this}expandByScalar(t){return this.min.addScalar(-t),this.max.addScalar(t),this}expandByObject(t,e=!1){t.updateWorldMatrix(!1,!1);const i=t.geometry;if(i!==void 0){const r=i.getAttribute("position");if(e===!0&&r!==void 0&&t.isInstancedMesh!==!0)for(let a=0,o=r.count;a<o;a++)t.isMesh===!0?t.getVertexPosition(a,bi):bi.fromBufferAttribute(r,a),bi.applyMatrix4(t.matrixWorld),this.expandByPoint(bi);else t.boundingBox!==void 0?(t.boundingBox===null&&t.computeBoundingBox(),Wc.copy(t.boundingBox)):(i.boundingBox===null&&i.computeBoundingBox(),Wc.copy(i.boundingBox)),Wc.applyMatrix4(t.matrixWorld),this.union(Wc)}const s=t.children;for(let r=0,a=s.length;r<a;r++)this.expandByObject(s[r],e);return this}containsPoint(t){return t.x>=this.min.x&&t.x<=this.max.x&&t.y>=this.min.y&&t.y<=this.max.y&&t.z>=this.min.z&&t.z<=this.max.z}containsBox(t){return this.min.x<=t.min.x&&t.max.x<=this.max.x&&this.min.y<=t.min.y&&t.max.y<=this.max.y&&this.min.z<=t.min.z&&t.max.z<=this.max.z}getParameter(t,e){return e.set((t.x-this.min.x)/(this.max.x-this.min.x),(t.y-this.min.y)/(this.max.y-this.min.y),(t.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(t){return t.max.x>=this.min.x&&t.min.x<=this.max.x&&t.max.y>=this.min.y&&t.min.y<=this.max.y&&t.max.z>=this.min.z&&t.min.z<=this.max.z}intersectsSphere(t){return this.clampPoint(t.center,bi),bi.distanceToSquared(t.center)<=t.radius*t.radius}intersectsPlane(t){let e,i;return t.normal.x>0?(e=t.normal.x*this.min.x,i=t.normal.x*this.max.x):(e=t.normal.x*this.max.x,i=t.normal.x*this.min.x),t.normal.y>0?(e+=t.normal.y*this.min.y,i+=t.normal.y*this.max.y):(e+=t.normal.y*this.max.y,i+=t.normal.y*this.min.y),t.normal.z>0?(e+=t.normal.z*this.min.z,i+=t.normal.z*this.max.z):(e+=t.normal.z*this.max.z,i+=t.normal.z*this.min.z),e<=-t.constant&&i>=-t.constant}intersectsTriangle(t){if(this.isEmpty())return!1;this.getCenter(Po),Xc.subVectors(this.max,Po),sa.subVectors(t.a,Po),ra.subVectors(t.b,Po),aa.subVectors(t.c,Po),Is.subVectors(ra,sa),Ds.subVectors(aa,ra),dr.subVectors(sa,aa);let e=[0,-Is.z,Is.y,0,-Ds.z,Ds.y,0,-dr.z,dr.y,Is.z,0,-Is.x,Ds.z,0,-Ds.x,dr.z,0,-dr.x,-Is.y,Is.x,0,-Ds.y,Ds.x,0,-dr.y,dr.x,0];return!Jh(e,sa,ra,aa,Xc)||(e=[1,0,0,0,1,0,0,0,1],!Jh(e,sa,ra,aa,Xc))?!1:($c.crossVectors(Is,Ds),e=[$c.x,$c.y,$c.z],Jh(e,sa,ra,aa,Xc))}clampPoint(t,e){return e.copy(t).clamp(this.min,this.max)}distanceToPoint(t){return this.clampPoint(t,bi).distanceTo(t)}getBoundingSphere(t){return this.isEmpty()?t.makeEmpty():(this.getCenter(t.center),t.radius=this.getSize(bi).length()*.5),t}intersect(t){return this.min.max(t.min),this.max.min(t.max),this.isEmpty()&&this.makeEmpty(),this}union(t){return this.min.min(t.min),this.max.max(t.max),this}applyMatrix4(t){return this.isEmpty()?this:(us[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(t),us[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(t),us[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(t),us[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(t),us[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(t),us[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(t),us[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(t),us[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(t),this.setFromPoints(us),this)}translate(t){return this.min.add(t),this.max.add(t),this}equals(t){return t.min.equals(this.min)&&t.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(t){return this.min.fromArray(t.min),this.max.fromArray(t.max),this}}const us=[new C,new C,new C,new C,new C,new C,new C,new C],bi=new C,Wc=new So,sa=new C,ra=new C,aa=new C,Is=new C,Ds=new C,dr=new C,Po=new C,Xc=new C,$c=new C,pr=new C;function Jh(n,t,e,i,s){for(let r=0,a=n.length-3;r<=a;r+=3){pr.fromArray(n,r);const o=s.x*Math.abs(pr.x)+s.y*Math.abs(pr.y)+s.z*Math.abs(pr.z),c=t.dot(pr),l=e.dot(pr),u=i.dot(pr);if(Math.max(-Math.max(c,l,u),Math.min(c,l,u))>o)return!1}return!0}const QM=new So,Io=new C,Kh=new C;class lr{constructor(t=new C,e=-1){this.isSphere=!0,this.center=t,this.radius=e}set(t,e){return this.center.copy(t),this.radius=e,this}setFromPoints(t,e){const i=this.center;e!==void 0?i.copy(e):QM.setFromPoints(t).getCenter(i);let s=0;for(let r=0,a=t.length;r<a;r++)s=Math.max(s,i.distanceToSquared(t[r]));return this.radius=Math.sqrt(s),this}copy(t){return this.center.copy(t.center),this.radius=t.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(t){return t.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(t){return t.distanceTo(this.center)-this.radius}intersectsSphere(t){const e=this.radius+t.radius;return t.center.distanceToSquared(this.center)<=e*e}intersectsBox(t){return t.intersectsSphere(this)}intersectsPlane(t){return Math.abs(t.distanceToPoint(this.center))<=this.radius}clampPoint(t,e){const i=this.center.distanceToSquared(t);return e.copy(t),i>this.radius*this.radius&&(e.sub(this.center).normalize(),e.multiplyScalar(this.radius).add(this.center)),e}getBoundingBox(t){return this.isEmpty()?(t.makeEmpty(),t):(t.set(this.center,this.center),t.expandByScalar(this.radius),t)}applyMatrix4(t){return this.center.applyMatrix4(t),this.radius=this.radius*t.getMaxScaleOnAxis(),this}translate(t){return this.center.add(t),this}expandByPoint(t){if(this.isEmpty())return this.center.copy(t),this.radius=0,this;Io.subVectors(t,this.center);const e=Io.lengthSq();if(e>this.radius*this.radius){const i=Math.sqrt(e),s=(i-this.radius)*.5;this.center.addScaledVector(Io,s/i),this.radius+=s}return this}union(t){return t.isEmpty()?this:this.isEmpty()?(this.copy(t),this):(this.center.equals(t.center)===!0?this.radius=Math.max(this.radius,t.radius):(Kh.subVectors(t.center,this.center).setLength(t.radius),this.expandByPoint(Io.copy(t.center).add(Kh)),this.expandByPoint(Io.copy(t.center).sub(Kh))),this)}equals(t){return t.center.equals(this.center)&&t.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(t){return this.radius=t.radius,this.center.fromArray(t.center),this}}const fs=new C,Qh=new C,qc=new C,Us=new C,t0=new C,Yc=new C,e0=new C;class rd{constructor(t=new C,e=new C(0,0,-1)){this.origin=t,this.direction=e}set(t,e){return this.origin.copy(t),this.direction.copy(e),this}copy(t){return this.origin.copy(t.origin),this.direction.copy(t.direction),this}at(t,e){return e.copy(this.origin).addScaledVector(this.direction,t)}lookAt(t){return this.direction.copy(t).sub(this.origin).normalize(),this}recast(t){return this.origin.copy(this.at(t,fs)),this}closestPointToPoint(t,e){e.subVectors(t,this.origin);const i=e.dot(this.direction);return i<0?e.copy(this.origin):e.copy(this.origin).addScaledVector(this.direction,i)}distanceToPoint(t){return Math.sqrt(this.distanceSqToPoint(t))}distanceSqToPoint(t){const e=fs.subVectors(t,this.origin).dot(this.direction);return e<0?this.origin.distanceToSquared(t):(fs.copy(this.origin).addScaledVector(this.direction,e),fs.distanceToSquared(t))}distanceSqToSegment(t,e,i,s){Qh.copy(t).add(e).multiplyScalar(.5),qc.copy(e).sub(t).normalize(),Us.copy(this.origin).sub(Qh);const r=t.distanceTo(e)*.5,a=-this.direction.dot(qc),o=Us.dot(this.direction),c=-Us.dot(qc),l=Us.lengthSq(),u=Math.abs(1-a*a);let h,f,d,p;if(u>0)if(h=a*c-o,f=a*o-c,p=r*u,h>=0)if(f>=-p)if(f<=p){const v=1/u;h*=v,f*=v,d=h*(h+a*f+2*o)+f*(a*h+f+2*c)+l}else f=r,h=Math.max(0,-(a*f+o)),d=-h*h+f*(f+2*c)+l;else f=-r,h=Math.max(0,-(a*f+o)),d=-h*h+f*(f+2*c)+l;else f<=-p?(h=Math.max(0,-(-a*r+o)),f=h>0?-r:Math.min(Math.max(-r,-c),r),d=-h*h+f*(f+2*c)+l):f<=p?(h=0,f=Math.min(Math.max(-r,-c),r),d=f*(f+2*c)+l):(h=Math.max(0,-(a*r+o)),f=h>0?r:Math.min(Math.max(-r,-c),r),d=-h*h+f*(f+2*c)+l);else f=a>0?-r:r,h=Math.max(0,-(a*f+o)),d=-h*h+f*(f+2*c)+l;return i&&i.copy(this.origin).addScaledVector(this.direction,h),s&&s.copy(Qh).addScaledVector(qc,f),d}intersectSphere(t,e){fs.subVectors(t.center,this.origin);const i=fs.dot(this.direction),s=fs.dot(fs)-i*i,r=t.radius*t.radius;if(s>r)return null;const a=Math.sqrt(r-s),o=i-a,c=i+a;return c<0?null:o<0?this.at(c,e):this.at(o,e)}intersectsSphere(t){return t.radius<0?!1:this.distanceSqToPoint(t.center)<=t.radius*t.radius}distanceToPlane(t){const e=t.normal.dot(this.direction);if(e===0)return t.distanceToPoint(this.origin)===0?0:null;const i=-(this.origin.dot(t.normal)+t.constant)/e;return i>=0?i:null}intersectPlane(t,e){const i=this.distanceToPlane(t);return i===null?null:this.at(i,e)}intersectsPlane(t){const e=t.distanceToPoint(this.origin);return e===0||t.normal.dot(this.direction)*e<0}intersectBox(t,e){let i,s,r,a,o,c;const l=1/this.direction.x,u=1/this.direction.y,h=1/this.direction.z,f=this.origin;return l>=0?(i=(t.min.x-f.x)*l,s=(t.max.x-f.x)*l):(i=(t.max.x-f.x)*l,s=(t.min.x-f.x)*l),u>=0?(r=(t.min.y-f.y)*u,a=(t.max.y-f.y)*u):(r=(t.max.y-f.y)*u,a=(t.min.y-f.y)*u),i>a||r>s||((r>i||isNaN(i))&&(i=r),(a<s||isNaN(s))&&(s=a),h>=0?(o=(t.min.z-f.z)*h,c=(t.max.z-f.z)*h):(o=(t.max.z-f.z)*h,c=(t.min.z-f.z)*h),i>c||o>s)||((o>i||i!==i)&&(i=o),(c<s||s!==s)&&(s=c),s<0)?null:this.at(i>=0?i:s,e)}intersectsBox(t){return this.intersectBox(t,fs)!==null}intersectTriangle(t,e,i,s,r){t0.subVectors(e,t),Yc.subVectors(i,t),e0.crossVectors(t0,Yc);let a=this.direction.dot(e0),o;if(a>0){if(s)return null;o=1}else if(a<0)o=-1,a=-a;else return null;Us.subVectors(this.origin,t);const c=o*this.direction.dot(Yc.crossVectors(Us,Yc));if(c<0)return null;const l=o*this.direction.dot(t0.cross(Us));if(l<0||c+l>a)return null;const u=-o*Us.dot(e0);return u<0?null:this.at(u/a,r)}applyMatrix4(t){return this.origin.applyMatrix4(t),this.direction.transformDirection(t),this}equals(t){return t.origin.equals(this.origin)&&t.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class se{constructor(t,e,i,s,r,a,o,c,l,u,h,f,d,p,v,g){se.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],t!==void 0&&this.set(t,e,i,s,r,a,o,c,l,u,h,f,d,p,v,g)}set(t,e,i,s,r,a,o,c,l,u,h,f,d,p,v,g){const m=this.elements;return m[0]=t,m[4]=e,m[8]=i,m[12]=s,m[1]=r,m[5]=a,m[9]=o,m[13]=c,m[2]=l,m[6]=u,m[10]=h,m[14]=f,m[3]=d,m[7]=p,m[11]=v,m[15]=g,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new se().fromArray(this.elements)}copy(t){const e=this.elements,i=t.elements;return e[0]=i[0],e[1]=i[1],e[2]=i[2],e[3]=i[3],e[4]=i[4],e[5]=i[5],e[6]=i[6],e[7]=i[7],e[8]=i[8],e[9]=i[9],e[10]=i[10],e[11]=i[11],e[12]=i[12],e[13]=i[13],e[14]=i[14],e[15]=i[15],this}copyPosition(t){const e=this.elements,i=t.elements;return e[12]=i[12],e[13]=i[13],e[14]=i[14],this}setFromMatrix3(t){const e=t.elements;return this.set(e[0],e[3],e[6],0,e[1],e[4],e[7],0,e[2],e[5],e[8],0,0,0,0,1),this}extractBasis(t,e,i){return t.setFromMatrixColumn(this,0),e.setFromMatrixColumn(this,1),i.setFromMatrixColumn(this,2),this}makeBasis(t,e,i){return this.set(t.x,e.x,i.x,0,t.y,e.y,i.y,0,t.z,e.z,i.z,0,0,0,0,1),this}extractRotation(t){const e=this.elements,i=t.elements,s=1/oa.setFromMatrixColumn(t,0).length(),r=1/oa.setFromMatrixColumn(t,1).length(),a=1/oa.setFromMatrixColumn(t,2).length();return e[0]=i[0]*s,e[1]=i[1]*s,e[2]=i[2]*s,e[3]=0,e[4]=i[4]*r,e[5]=i[5]*r,e[6]=i[6]*r,e[7]=0,e[8]=i[8]*a,e[9]=i[9]*a,e[10]=i[10]*a,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromEuler(t){const e=this.elements,i=t.x,s=t.y,r=t.z,a=Math.cos(i),o=Math.sin(i),c=Math.cos(s),l=Math.sin(s),u=Math.cos(r),h=Math.sin(r);if(t.order==="XYZ"){const f=a*u,d=a*h,p=o*u,v=o*h;e[0]=c*u,e[4]=-c*h,e[8]=l,e[1]=d+p*l,e[5]=f-v*l,e[9]=-o*c,e[2]=v-f*l,e[6]=p+d*l,e[10]=a*c}else if(t.order==="YXZ"){const f=c*u,d=c*h,p=l*u,v=l*h;e[0]=f+v*o,e[4]=p*o-d,e[8]=a*l,e[1]=a*h,e[5]=a*u,e[9]=-o,e[2]=d*o-p,e[6]=v+f*o,e[10]=a*c}else if(t.order==="ZXY"){const f=c*u,d=c*h,p=l*u,v=l*h;e[0]=f-v*o,e[4]=-a*h,e[8]=p+d*o,e[1]=d+p*o,e[5]=a*u,e[9]=v-f*o,e[2]=-a*l,e[6]=o,e[10]=a*c}else if(t.order==="ZYX"){const f=a*u,d=a*h,p=o*u,v=o*h;e[0]=c*u,e[4]=p*l-d,e[8]=f*l+v,e[1]=c*h,e[5]=v*l+f,e[9]=d*l-p,e[2]=-l,e[6]=o*c,e[10]=a*c}else if(t.order==="YZX"){const f=a*c,d=a*l,p=o*c,v=o*l;e[0]=c*u,e[4]=v-f*h,e[8]=p*h+d,e[1]=h,e[5]=a*u,e[9]=-o*u,e[2]=-l*u,e[6]=d*h+p,e[10]=f-v*h}else if(t.order==="XZY"){const f=a*c,d=a*l,p=o*c,v=o*l;e[0]=c*u,e[4]=-h,e[8]=l*u,e[1]=f*h+v,e[5]=a*u,e[9]=d*h-p,e[2]=p*h-d,e[6]=o*u,e[10]=v*h+f}return e[3]=0,e[7]=0,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromQuaternion(t){return this.compose(t_,t,e_)}lookAt(t,e,i){const s=this.elements;return Wn.subVectors(t,e),Wn.lengthSq()===0&&(Wn.z=1),Wn.normalize(),Fs.crossVectors(i,Wn),Fs.lengthSq()===0&&(Math.abs(i.z)===1?Wn.x+=1e-4:Wn.z+=1e-4,Wn.normalize(),Fs.crossVectors(i,Wn)),Fs.normalize(),jc.crossVectors(Wn,Fs),s[0]=Fs.x,s[4]=jc.x,s[8]=Wn.x,s[1]=Fs.y,s[5]=jc.y,s[9]=Wn.y,s[2]=Fs.z,s[6]=jc.z,s[10]=Wn.z,this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const i=t.elements,s=e.elements,r=this.elements,a=i[0],o=i[4],c=i[8],l=i[12],u=i[1],h=i[5],f=i[9],d=i[13],p=i[2],v=i[6],g=i[10],m=i[14],M=i[3],x=i[7],_=i[11],b=i[15],S=s[0],T=s[4],A=s[8],w=s[12],y=s[1],E=s[5],R=s[9],L=s[13],I=s[2],N=s[6],B=s[10],X=s[14],H=s[3],Y=s[7],it=s[11],dt=s[15];return r[0]=a*S+o*y+c*I+l*H,r[4]=a*T+o*E+c*N+l*Y,r[8]=a*A+o*R+c*B+l*it,r[12]=a*w+o*L+c*X+l*dt,r[1]=u*S+h*y+f*I+d*H,r[5]=u*T+h*E+f*N+d*Y,r[9]=u*A+h*R+f*B+d*it,r[13]=u*w+h*L+f*X+d*dt,r[2]=p*S+v*y+g*I+m*H,r[6]=p*T+v*E+g*N+m*Y,r[10]=p*A+v*R+g*B+m*it,r[14]=p*w+v*L+g*X+m*dt,r[3]=M*S+x*y+_*I+b*H,r[7]=M*T+x*E+_*N+b*Y,r[11]=M*A+x*R+_*B+b*it,r[15]=M*w+x*L+_*X+b*dt,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[4]*=t,e[8]*=t,e[12]*=t,e[1]*=t,e[5]*=t,e[9]*=t,e[13]*=t,e[2]*=t,e[6]*=t,e[10]*=t,e[14]*=t,e[3]*=t,e[7]*=t,e[11]*=t,e[15]*=t,this}determinant(){const t=this.elements,e=t[0],i=t[4],s=t[8],r=t[12],a=t[1],o=t[5],c=t[9],l=t[13],u=t[2],h=t[6],f=t[10],d=t[14],p=t[3],v=t[7],g=t[11],m=t[15];return p*(+r*c*h-s*l*h-r*o*f+i*l*f+s*o*d-i*c*d)+v*(+e*c*d-e*l*f+r*a*f-s*a*d+s*l*u-r*c*u)+g*(+e*l*h-e*o*d-r*a*h+i*a*d+r*o*u-i*l*u)+m*(-s*o*u-e*c*h+e*o*f+s*a*h-i*a*f+i*c*u)}transpose(){const t=this.elements;let e;return e=t[1],t[1]=t[4],t[4]=e,e=t[2],t[2]=t[8],t[8]=e,e=t[6],t[6]=t[9],t[9]=e,e=t[3],t[3]=t[12],t[12]=e,e=t[7],t[7]=t[13],t[13]=e,e=t[11],t[11]=t[14],t[14]=e,this}setPosition(t,e,i){const s=this.elements;return t.isVector3?(s[12]=t.x,s[13]=t.y,s[14]=t.z):(s[12]=t,s[13]=e,s[14]=i),this}invert(){const t=this.elements,e=t[0],i=t[1],s=t[2],r=t[3],a=t[4],o=t[5],c=t[6],l=t[7],u=t[8],h=t[9],f=t[10],d=t[11],p=t[12],v=t[13],g=t[14],m=t[15],M=h*g*l-v*f*l+v*c*d-o*g*d-h*c*m+o*f*m,x=p*f*l-u*g*l-p*c*d+a*g*d+u*c*m-a*f*m,_=u*v*l-p*h*l+p*o*d-a*v*d-u*o*m+a*h*m,b=p*h*c-u*v*c-p*o*f+a*v*f+u*o*g-a*h*g,S=e*M+i*x+s*_+r*b;if(S===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const T=1/S;return t[0]=M*T,t[1]=(v*f*r-h*g*r-v*s*d+i*g*d+h*s*m-i*f*m)*T,t[2]=(o*g*r-v*c*r+v*s*l-i*g*l-o*s*m+i*c*m)*T,t[3]=(h*c*r-o*f*r-h*s*l+i*f*l+o*s*d-i*c*d)*T,t[4]=x*T,t[5]=(u*g*r-p*f*r+p*s*d-e*g*d-u*s*m+e*f*m)*T,t[6]=(p*c*r-a*g*r-p*s*l+e*g*l+a*s*m-e*c*m)*T,t[7]=(a*f*r-u*c*r+u*s*l-e*f*l-a*s*d+e*c*d)*T,t[8]=_*T,t[9]=(p*h*r-u*v*r-p*i*d+e*v*d+u*i*m-e*h*m)*T,t[10]=(a*v*r-p*o*r+p*i*l-e*v*l-a*i*m+e*o*m)*T,t[11]=(u*o*r-a*h*r-u*i*l+e*h*l+a*i*d-e*o*d)*T,t[12]=b*T,t[13]=(u*v*s-p*h*s+p*i*f-e*v*f-u*i*g+e*h*g)*T,t[14]=(p*o*s-a*v*s-p*i*c+e*v*c+a*i*g-e*o*g)*T,t[15]=(a*h*s-u*o*s+u*i*c-e*h*c-a*i*f+e*o*f)*T,this}scale(t){const e=this.elements,i=t.x,s=t.y,r=t.z;return e[0]*=i,e[4]*=s,e[8]*=r,e[1]*=i,e[5]*=s,e[9]*=r,e[2]*=i,e[6]*=s,e[10]*=r,e[3]*=i,e[7]*=s,e[11]*=r,this}getMaxScaleOnAxis(){const t=this.elements,e=t[0]*t[0]+t[1]*t[1]+t[2]*t[2],i=t[4]*t[4]+t[5]*t[5]+t[6]*t[6],s=t[8]*t[8]+t[9]*t[9]+t[10]*t[10];return Math.sqrt(Math.max(e,i,s))}makeTranslation(t,e,i){return t.isVector3?this.set(1,0,0,t.x,0,1,0,t.y,0,0,1,t.z,0,0,0,1):this.set(1,0,0,t,0,1,0,e,0,0,1,i,0,0,0,1),this}makeRotationX(t){const e=Math.cos(t),i=Math.sin(t);return this.set(1,0,0,0,0,e,-i,0,0,i,e,0,0,0,0,1),this}makeRotationY(t){const e=Math.cos(t),i=Math.sin(t);return this.set(e,0,i,0,0,1,0,0,-i,0,e,0,0,0,0,1),this}makeRotationZ(t){const e=Math.cos(t),i=Math.sin(t);return this.set(e,-i,0,0,i,e,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(t,e){const i=Math.cos(e),s=Math.sin(e),r=1-i,a=t.x,o=t.y,c=t.z,l=r*a,u=r*o;return this.set(l*a+i,l*o-s*c,l*c+s*o,0,l*o+s*c,u*o+i,u*c-s*a,0,l*c-s*o,u*c+s*a,r*c*c+i,0,0,0,0,1),this}makeScale(t,e,i){return this.set(t,0,0,0,0,e,0,0,0,0,i,0,0,0,0,1),this}makeShear(t,e,i,s,r,a){return this.set(1,i,r,0,t,1,a,0,e,s,1,0,0,0,0,1),this}compose(t,e,i){const s=this.elements,r=e._x,a=e._y,o=e._z,c=e._w,l=r+r,u=a+a,h=o+o,f=r*l,d=r*u,p=r*h,v=a*u,g=a*h,m=o*h,M=c*l,x=c*u,_=c*h,b=i.x,S=i.y,T=i.z;return s[0]=(1-(v+m))*b,s[1]=(d+_)*b,s[2]=(p-x)*b,s[3]=0,s[4]=(d-_)*S,s[5]=(1-(f+m))*S,s[6]=(g+M)*S,s[7]=0,s[8]=(p+x)*T,s[9]=(g-M)*T,s[10]=(1-(f+v))*T,s[11]=0,s[12]=t.x,s[13]=t.y,s[14]=t.z,s[15]=1,this}decompose(t,e,i){const s=this.elements;let r=oa.set(s[0],s[1],s[2]).length();const a=oa.set(s[4],s[5],s[6]).length(),o=oa.set(s[8],s[9],s[10]).length();this.determinant()<0&&(r=-r),t.x=s[12],t.y=s[13],t.z=s[14],yi.copy(this);const l=1/r,u=1/a,h=1/o;return yi.elements[0]*=l,yi.elements[1]*=l,yi.elements[2]*=l,yi.elements[4]*=u,yi.elements[5]*=u,yi.elements[6]*=u,yi.elements[8]*=h,yi.elements[9]*=h,yi.elements[10]*=h,e.setFromRotationMatrix(yi),i.x=r,i.y=a,i.z=o,this}makePerspective(t,e,i,s,r,a,o=ss,c=!1){const l=this.elements,u=2*r/(e-t),h=2*r/(i-s),f=(e+t)/(e-t),d=(i+s)/(i-s);let p,v;if(c)p=r/(a-r),v=a*r/(a-r);else if(o===ss)p=-(a+r)/(a-r),v=-2*a*r/(a-r);else if(o===sh)p=-a/(a-r),v=-a*r/(a-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+o);return l[0]=u,l[4]=0,l[8]=f,l[12]=0,l[1]=0,l[5]=h,l[9]=d,l[13]=0,l[2]=0,l[6]=0,l[10]=p,l[14]=v,l[3]=0,l[7]=0,l[11]=-1,l[15]=0,this}makeOrthographic(t,e,i,s,r,a,o=ss,c=!1){const l=this.elements,u=2/(e-t),h=2/(i-s),f=-(e+t)/(e-t),d=-(i+s)/(i-s);let p,v;if(c)p=1/(a-r),v=a/(a-r);else if(o===ss)p=-2/(a-r),v=-(a+r)/(a-r);else if(o===sh)p=-1/(a-r),v=-r/(a-r);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+o);return l[0]=u,l[4]=0,l[8]=0,l[12]=f,l[1]=0,l[5]=h,l[9]=0,l[13]=d,l[2]=0,l[6]=0,l[10]=p,l[14]=v,l[3]=0,l[7]=0,l[11]=0,l[15]=1,this}equals(t){const e=this.elements,i=t.elements;for(let s=0;s<16;s++)if(e[s]!==i[s])return!1;return!0}fromArray(t,e=0){for(let i=0;i<16;i++)this.elements[i]=t[i+e];return this}toArray(t=[],e=0){const i=this.elements;return t[e]=i[0],t[e+1]=i[1],t[e+2]=i[2],t[e+3]=i[3],t[e+4]=i[4],t[e+5]=i[5],t[e+6]=i[6],t[e+7]=i[7],t[e+8]=i[8],t[e+9]=i[9],t[e+10]=i[10],t[e+11]=i[11],t[e+12]=i[12],t[e+13]=i[13],t[e+14]=i[14],t[e+15]=i[15],t}}const oa=new C,yi=new se,t_=new C(0,0,0),e_=new C(1,1,1),Fs=new C,jc=new C,Wn=new C,w1=new se,b1=new ie;class Cn{constructor(t=0,e=0,i=0,s=Cn.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=e,this._z=i,this._order=s}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get order(){return this._order}set order(t){this._order=t,this._onChangeCallback()}set(t,e,i,s=this._order){return this._x=t,this._y=e,this._z=i,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(t){return this._x=t._x,this._y=t._y,this._z=t._z,this._order=t._order,this._onChangeCallback(),this}setFromRotationMatrix(t,e=this._order,i=!0){const s=t.elements,r=s[0],a=s[4],o=s[8],c=s[1],l=s[5],u=s[9],h=s[2],f=s[6],d=s[10];switch(e){case"XYZ":this._y=Math.asin(ne(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-u,d),this._z=Math.atan2(-a,r)):(this._x=Math.atan2(f,l),this._z=0);break;case"YXZ":this._x=Math.asin(-ne(u,-1,1)),Math.abs(u)<.9999999?(this._y=Math.atan2(o,d),this._z=Math.atan2(c,l)):(this._y=Math.atan2(-h,r),this._z=0);break;case"ZXY":this._x=Math.asin(ne(f,-1,1)),Math.abs(f)<.9999999?(this._y=Math.atan2(-h,d),this._z=Math.atan2(-a,l)):(this._y=0,this._z=Math.atan2(c,r));break;case"ZYX":this._y=Math.asin(-ne(h,-1,1)),Math.abs(h)<.9999999?(this._x=Math.atan2(f,d),this._z=Math.atan2(c,r)):(this._x=0,this._z=Math.atan2(-a,l));break;case"YZX":this._z=Math.asin(ne(c,-1,1)),Math.abs(c)<.9999999?(this._x=Math.atan2(-u,l),this._y=Math.atan2(-h,r)):(this._x=0,this._y=Math.atan2(o,d));break;case"XZY":this._z=Math.asin(-ne(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(f,l),this._y=Math.atan2(o,r)):(this._x=Math.atan2(-u,d),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+e)}return this._order=e,i===!0&&this._onChangeCallback(),this}setFromQuaternion(t,e,i){return w1.makeRotationFromQuaternion(t),this.setFromRotationMatrix(w1,e,i)}setFromVector3(t,e=this._order){return this.set(t.x,t.y,t.z,e)}reorder(t){return b1.setFromEuler(this),this.setFromQuaternion(b1,t)}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._order===this._order}fromArray(t){return this._x=t[0],this._y=t[1],this._z=t[2],t[3]!==void 0&&(this._order=t[3]),this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._order,t}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}Cn.DEFAULT_ORDER="XYZ";class kg{constructor(){this.mask=1}set(t){this.mask=(1<<t|0)>>>0}enable(t){this.mask|=1<<t|0}enableAll(){this.mask=-1}toggle(t){this.mask^=1<<t|0}disable(t){this.mask&=~(1<<t|0)}disableAll(){this.mask=0}test(t){return(this.mask&t.mask)!==0}isEnabled(t){return(this.mask&(1<<t|0))!==0}}let n_=0;const y1=new C,ca=new ie,ds=new se,Zc=new C,Do=new C,i_=new C,s_=new ie,S1=new C(1,0,0),E1=new C(0,1,0),T1=new C(0,0,1),A1={type:"added"},r_={type:"removed"},la={type:"childadded",child:null},n0={type:"childremoved",child:null};class Ge extends yo{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:n_++}),this.uuid=ki(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=Ge.DEFAULT_UP.clone();const t=new C,e=new Cn,i=new ie,s=new C(1,1,1);function r(){i.setFromEuler(e,!1)}function a(){e.setFromQuaternion(i,void 0,!1)}e._onChange(r),i._onChange(a),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:e},quaternion:{configurable:!0,enumerable:!0,value:i},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new se},normalMatrix:{value:new le}}),this.matrix=new se,this.matrixWorld=new se,this.matrixAutoUpdate=Ge.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=Ge.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new kg,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(t){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(t),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(t){return this.quaternion.premultiply(t),this}setRotationFromAxisAngle(t,e){this.quaternion.setFromAxisAngle(t,e)}setRotationFromEuler(t){this.quaternion.setFromEuler(t,!0)}setRotationFromMatrix(t){this.quaternion.setFromRotationMatrix(t)}setRotationFromQuaternion(t){this.quaternion.copy(t)}rotateOnAxis(t,e){return ca.setFromAxisAngle(t,e),this.quaternion.multiply(ca),this}rotateOnWorldAxis(t,e){return ca.setFromAxisAngle(t,e),this.quaternion.premultiply(ca),this}rotateX(t){return this.rotateOnAxis(S1,t)}rotateY(t){return this.rotateOnAxis(E1,t)}rotateZ(t){return this.rotateOnAxis(T1,t)}translateOnAxis(t,e){return y1.copy(t).applyQuaternion(this.quaternion),this.position.add(y1.multiplyScalar(e)),this}translateX(t){return this.translateOnAxis(S1,t)}translateY(t){return this.translateOnAxis(E1,t)}translateZ(t){return this.translateOnAxis(T1,t)}localToWorld(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(this.matrixWorld)}worldToLocal(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(ds.copy(this.matrixWorld).invert())}lookAt(t,e,i){t.isVector3?Zc.copy(t):Zc.set(t,e,i);const s=this.parent;this.updateWorldMatrix(!0,!1),Do.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?ds.lookAt(Do,Zc,this.up):ds.lookAt(Zc,Do,this.up),this.quaternion.setFromRotationMatrix(ds),s&&(ds.extractRotation(s.matrixWorld),ca.setFromRotationMatrix(ds),this.quaternion.premultiply(ca.invert()))}add(t){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.add(arguments[e]);return this}return t===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",t),this):(t&&t.isObject3D?(t.removeFromParent(),t.parent=this,this.children.push(t),t.dispatchEvent(A1),la.child=t,this.dispatchEvent(la),la.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",t),this)}remove(t){if(arguments.length>1){for(let i=0;i<arguments.length;i++)this.remove(arguments[i]);return this}const e=this.children.indexOf(t);return e!==-1&&(t.parent=null,this.children.splice(e,1),t.dispatchEvent(r_),n0.child=t,this.dispatchEvent(n0),n0.child=null),this}removeFromParent(){const t=this.parent;return t!==null&&t.remove(this),this}clear(){return this.remove(...this.children)}attach(t){return this.updateWorldMatrix(!0,!1),ds.copy(this.matrixWorld).invert(),t.parent!==null&&(t.parent.updateWorldMatrix(!0,!1),ds.multiply(t.parent.matrixWorld)),t.applyMatrix4(ds),t.removeFromParent(),t.parent=this,this.children.push(t),t.updateWorldMatrix(!1,!0),t.dispatchEvent(A1),la.child=t,this.dispatchEvent(la),la.child=null,this}getObjectById(t){return this.getObjectByProperty("id",t)}getObjectByName(t){return this.getObjectByProperty("name",t)}getObjectByProperty(t,e){if(this[t]===e)return this;for(let i=0,s=this.children.length;i<s;i++){const a=this.children[i].getObjectByProperty(t,e);if(a!==void 0)return a}}getObjectsByProperty(t,e,i=[]){this[t]===e&&i.push(this);const s=this.children;for(let r=0,a=s.length;r<a;r++)s[r].getObjectsByProperty(t,e,i);return i}getWorldPosition(t){return this.updateWorldMatrix(!0,!1),t.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Do,t,i_),t}getWorldScale(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Do,s_,t),t}getWorldDirection(t){this.updateWorldMatrix(!0,!1);const e=this.matrixWorld.elements;return t.set(e[8],e[9],e[10]).normalize()}raycast(){}traverse(t){t(this);const e=this.children;for(let i=0,s=e.length;i<s;i++)e[i].traverse(t)}traverseVisible(t){if(this.visible===!1)return;t(this);const e=this.children;for(let i=0,s=e.length;i<s;i++)e[i].traverseVisible(t)}traverseAncestors(t){const e=this.parent;e!==null&&(t(e),e.traverseAncestors(t))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(t){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||t)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,t=!0);const e=this.children;for(let i=0,s=e.length;i<s;i++)e[i].updateMatrixWorld(t)}updateWorldMatrix(t,e){const i=this.parent;if(t===!0&&i!==null&&i.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),e===!0){const s=this.children;for(let r=0,a=s.length;r<a;r++)s[r].updateWorldMatrix(!1,!0)}}toJSON(t){const e=t===void 0||typeof t=="string",i={};e&&(t={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},i.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});const s={};s.uuid=this.uuid,s.type=this.type,this.name!==""&&(s.name=this.name),this.castShadow===!0&&(s.castShadow=!0),this.receiveShadow===!0&&(s.receiveShadow=!0),this.visible===!1&&(s.visible=!1),this.frustumCulled===!1&&(s.frustumCulled=!1),this.renderOrder!==0&&(s.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(s.matrixAutoUpdate=!1),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.geometryInfo=this._geometryInfo.map(o=>({...o,boundingBox:o.boundingBox?o.boundingBox.toJSON():void 0,boundingSphere:o.boundingSphere?o.boundingSphere.toJSON():void 0})),s.instanceInfo=this._instanceInfo.map(o=>({...o})),s.availableInstanceIds=this._availableInstanceIds.slice(),s.availableGeometryIds=this._availableGeometryIds.slice(),s.nextIndexStart=this._nextIndexStart,s.nextVertexStart=this._nextVertexStart,s.geometryCount=this._geometryCount,s.maxInstanceCount=this._maxInstanceCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.matricesTexture=this._matricesTexture.toJSON(t),s.indirectTexture=this._indirectTexture.toJSON(t),this._colorsTexture!==null&&(s.colorsTexture=this._colorsTexture.toJSON(t)),this.boundingSphere!==null&&(s.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(s.boundingBox=this.boundingBox.toJSON()));function r(o,c){return o[c.uuid]===void 0&&(o[c.uuid]=c.toJSON(t)),c.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(t).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(t).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=r(t.geometries,this.geometry);const o=this.geometry.parameters;if(o!==void 0&&o.shapes!==void 0){const c=o.shapes;if(Array.isArray(c))for(let l=0,u=c.length;l<u;l++){const h=c[l];r(t.shapes,h)}else r(t.shapes,c)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(t.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const o=[];for(let c=0,l=this.material.length;c<l;c++)o.push(r(t.materials,this.material[c]));s.material=o}else s.material=r(t.materials,this.material);if(this.children.length>0){s.children=[];for(let o=0;o<this.children.length;o++)s.children.push(this.children[o].toJSON(t).object)}if(this.animations.length>0){s.animations=[];for(let o=0;o<this.animations.length;o++){const c=this.animations[o];s.animations.push(r(t.animations,c))}}if(e){const o=a(t.geometries),c=a(t.materials),l=a(t.textures),u=a(t.images),h=a(t.shapes),f=a(t.skeletons),d=a(t.animations),p=a(t.nodes);o.length>0&&(i.geometries=o),c.length>0&&(i.materials=c),l.length>0&&(i.textures=l),u.length>0&&(i.images=u),h.length>0&&(i.shapes=h),f.length>0&&(i.skeletons=f),d.length>0&&(i.animations=d),p.length>0&&(i.nodes=p)}return i.object=s,i;function a(o){const c=[];for(const l in o){const u=o[l];delete u.metadata,c.push(u)}return c}}clone(t){return new this.constructor().copy(this,t)}copy(t,e=!0){if(this.name=t.name,this.up.copy(t.up),this.position.copy(t.position),this.rotation.order=t.rotation.order,this.quaternion.copy(t.quaternion),this.scale.copy(t.scale),this.matrix.copy(t.matrix),this.matrixWorld.copy(t.matrixWorld),this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrixWorldAutoUpdate=t.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=t.matrixWorldNeedsUpdate,this.layers.mask=t.layers.mask,this.visible=t.visible,this.castShadow=t.castShadow,this.receiveShadow=t.receiveShadow,this.frustumCulled=t.frustumCulled,this.renderOrder=t.renderOrder,this.animations=t.animations.slice(),this.userData=JSON.parse(JSON.stringify(t.userData)),e===!0)for(let i=0;i<t.children.length;i++){const s=t.children[i];this.add(s.clone())}return this}}Ge.DEFAULT_UP=new C(0,1,0);Ge.DEFAULT_MATRIX_AUTO_UPDATE=!0;Ge.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const Si=new C,ps=new C,i0=new C,ms=new C,ha=new C,ua=new C,R1=new C,s0=new C,r0=new C,a0=new C,o0=new fe,c0=new fe,l0=new fe;class gi{constructor(t=new C,e=new C,i=new C){this.a=t,this.b=e,this.c=i}static getNormal(t,e,i,s){s.subVectors(i,e),Si.subVectors(t,e),s.cross(Si);const r=s.lengthSq();return r>0?s.multiplyScalar(1/Math.sqrt(r)):s.set(0,0,0)}static getBarycoord(t,e,i,s,r){Si.subVectors(s,e),ps.subVectors(i,e),i0.subVectors(t,e);const a=Si.dot(Si),o=Si.dot(ps),c=Si.dot(i0),l=ps.dot(ps),u=ps.dot(i0),h=a*l-o*o;if(h===0)return r.set(0,0,0),null;const f=1/h,d=(l*c-o*u)*f,p=(a*u-o*c)*f;return r.set(1-d-p,p,d)}static containsPoint(t,e,i,s){return this.getBarycoord(t,e,i,s,ms)===null?!1:ms.x>=0&&ms.y>=0&&ms.x+ms.y<=1}static getInterpolation(t,e,i,s,r,a,o,c){return this.getBarycoord(t,e,i,s,ms)===null?(c.x=0,c.y=0,"z"in c&&(c.z=0),"w"in c&&(c.w=0),null):(c.setScalar(0),c.addScaledVector(r,ms.x),c.addScaledVector(a,ms.y),c.addScaledVector(o,ms.z),c)}static getInterpolatedAttribute(t,e,i,s,r,a){return o0.setScalar(0),c0.setScalar(0),l0.setScalar(0),o0.fromBufferAttribute(t,e),c0.fromBufferAttribute(t,i),l0.fromBufferAttribute(t,s),a.setScalar(0),a.addScaledVector(o0,r.x),a.addScaledVector(c0,r.y),a.addScaledVector(l0,r.z),a}static isFrontFacing(t,e,i,s){return Si.subVectors(i,e),ps.subVectors(t,e),Si.cross(ps).dot(s)<0}set(t,e,i){return this.a.copy(t),this.b.copy(e),this.c.copy(i),this}setFromPointsAndIndices(t,e,i,s){return this.a.copy(t[e]),this.b.copy(t[i]),this.c.copy(t[s]),this}setFromAttributeAndIndices(t,e,i,s){return this.a.fromBufferAttribute(t,e),this.b.fromBufferAttribute(t,i),this.c.fromBufferAttribute(t,s),this}clone(){return new this.constructor().copy(this)}copy(t){return this.a.copy(t.a),this.b.copy(t.b),this.c.copy(t.c),this}getArea(){return Si.subVectors(this.c,this.b),ps.subVectors(this.a,this.b),Si.cross(ps).length()*.5}getMidpoint(t){return t.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(t){return gi.getNormal(this.a,this.b,this.c,t)}getPlane(t){return t.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,e){return gi.getBarycoord(t,this.a,this.b,this.c,e)}getInterpolation(t,e,i,s,r){return gi.getInterpolation(t,this.a,this.b,this.c,e,i,s,r)}containsPoint(t){return gi.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return gi.isFrontFacing(this.a,this.b,this.c,t)}intersectsBox(t){return t.intersectsTriangle(this)}closestPointToPoint(t,e){const i=this.a,s=this.b,r=this.c;let a,o;ha.subVectors(s,i),ua.subVectors(r,i),s0.subVectors(t,i);const c=ha.dot(s0),l=ua.dot(s0);if(c<=0&&l<=0)return e.copy(i);r0.subVectors(t,s);const u=ha.dot(r0),h=ua.dot(r0);if(u>=0&&h<=u)return e.copy(s);const f=c*h-u*l;if(f<=0&&c>=0&&u<=0)return a=c/(c-u),e.copy(i).addScaledVector(ha,a);a0.subVectors(t,r);const d=ha.dot(a0),p=ua.dot(a0);if(p>=0&&d<=p)return e.copy(r);const v=d*l-c*p;if(v<=0&&l>=0&&p<=0)return o=l/(l-p),e.copy(i).addScaledVector(ua,o);const g=u*p-d*h;if(g<=0&&h-u>=0&&d-p>=0)return R1.subVectors(r,s),o=(h-u)/(h-u+(d-p)),e.copy(s).addScaledVector(R1,o);const m=1/(g+v+f);return a=v*m,o=f*m,e.copy(i).addScaledVector(ha,a).addScaledVector(ua,o)}equals(t){return t.a.equals(this.a)&&t.b.equals(this.b)&&t.c.equals(this.c)}}const Og={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Ns={h:0,s:0,l:0},Jc={h:0,s:0,l:0};function h0(n,t,e){return e<0&&(e+=1),e>1&&(e-=1),e<1/6?n+(t-n)*6*e:e<1/2?t:e<2/3?n+(t-n)*6*(2/3-e):n}class gt{constructor(t,e,i){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(t,e,i)}set(t,e,i){if(e===void 0&&i===void 0){const s=t;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(t,e,i);return this}setScalar(t){return this.r=t,this.g=t,this.b=t,this}setHex(t,e=xn){return t=Math.floor(t),this.r=(t>>16&255)/255,this.g=(t>>8&255)/255,this.b=(t&255)/255,ve.colorSpaceToWorking(this,e),this}setRGB(t,e,i,s=ve.workingColorSpace){return this.r=t,this.g=e,this.b=i,ve.colorSpaceToWorking(this,s),this}setHSL(t,e,i,s=ve.workingColorSpace){if(t=nd(t,1),e=ne(e,0,1),i=ne(i,0,1),e===0)this.r=this.g=this.b=i;else{const r=i<=.5?i*(1+e):i+e-i*e,a=2*i-r;this.r=h0(a,r,t+1/3),this.g=h0(a,r,t),this.b=h0(a,r,t-1/3)}return ve.colorSpaceToWorking(this,s),this}setStyle(t,e=xn){function i(r){r!==void 0&&parseFloat(r)<1&&console.warn("THREE.Color: Alpha component of "+t+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(t)){let r;const a=s[1],o=s[2];switch(a){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return i(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,e);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return i(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,e);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return i(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,e);break;default:console.warn("THREE.Color: Unknown color model "+t)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(t)){const r=s[1],a=r.length;if(a===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,e);if(a===6)return this.setHex(parseInt(r,16),e);console.warn("THREE.Color: Invalid hex color "+t)}else if(t&&t.length>0)return this.setColorName(t,e);return this}setColorName(t,e=xn){const i=Og[t.toLowerCase()];return i!==void 0?this.setHex(i,e):console.warn("THREE.Color: Unknown color "+t),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(t){return this.r=t.r,this.g=t.g,this.b=t.b,this}copySRGBToLinear(t){return this.r=Rs(t.r),this.g=Rs(t.g),this.b=Rs(t.b),this}copyLinearToSRGB(t){return this.r=Za(t.r),this.g=Za(t.g),this.b=Za(t.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(t=xn){return ve.workingToColorSpace(dn.copy(this),t),Math.round(ne(dn.r*255,0,255))*65536+Math.round(ne(dn.g*255,0,255))*256+Math.round(ne(dn.b*255,0,255))}getHexString(t=xn){return("000000"+this.getHex(t).toString(16)).slice(-6)}getHSL(t,e=ve.workingColorSpace){ve.workingToColorSpace(dn.copy(this),e);const i=dn.r,s=dn.g,r=dn.b,a=Math.max(i,s,r),o=Math.min(i,s,r);let c,l;const u=(o+a)/2;if(o===a)c=0,l=0;else{const h=a-o;switch(l=u<=.5?h/(a+o):h/(2-a-o),a){case i:c=(s-r)/h+(s<r?6:0);break;case s:c=(r-i)/h+2;break;case r:c=(i-s)/h+4;break}c/=6}return t.h=c,t.s=l,t.l=u,t}getRGB(t,e=ve.workingColorSpace){return ve.workingToColorSpace(dn.copy(this),e),t.r=dn.r,t.g=dn.g,t.b=dn.b,t}getStyle(t=xn){ve.workingToColorSpace(dn.copy(this),t);const e=dn.r,i=dn.g,s=dn.b;return t!==xn?`color(${t} ${e.toFixed(3)} ${i.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(e*255)},${Math.round(i*255)},${Math.round(s*255)})`}offsetHSL(t,e,i){return this.getHSL(Ns),this.setHSL(Ns.h+t,Ns.s+e,Ns.l+i)}add(t){return this.r+=t.r,this.g+=t.g,this.b+=t.b,this}addColors(t,e){return this.r=t.r+e.r,this.g=t.g+e.g,this.b=t.b+e.b,this}addScalar(t){return this.r+=t,this.g+=t,this.b+=t,this}sub(t){return this.r=Math.max(0,this.r-t.r),this.g=Math.max(0,this.g-t.g),this.b=Math.max(0,this.b-t.b),this}multiply(t){return this.r*=t.r,this.g*=t.g,this.b*=t.b,this}multiplyScalar(t){return this.r*=t,this.g*=t,this.b*=t,this}lerp(t,e){return this.r+=(t.r-this.r)*e,this.g+=(t.g-this.g)*e,this.b+=(t.b-this.b)*e,this}lerpColors(t,e,i){return this.r=t.r+(e.r-t.r)*i,this.g=t.g+(e.g-t.g)*i,this.b=t.b+(e.b-t.b)*i,this}lerpHSL(t,e){this.getHSL(Ns),t.getHSL(Jc);const i=sc(Ns.h,Jc.h,e),s=sc(Ns.s,Jc.s,e),r=sc(Ns.l,Jc.l,e);return this.setHSL(i,s,r),this}setFromVector3(t){return this.r=t.x,this.g=t.y,this.b=t.z,this}applyMatrix3(t){const e=this.r,i=this.g,s=this.b,r=t.elements;return this.r=r[0]*e+r[3]*i+r[6]*s,this.g=r[1]*e+r[4]*i+r[7]*s,this.b=r[2]*e+r[5]*i+r[8]*s,this}equals(t){return t.r===this.r&&t.g===this.g&&t.b===this.b}fromArray(t,e=0){return this.r=t[e],this.g=t[e+1],this.b=t[e+2],this}toArray(t=[],e=0){return t[e]=this.r,t[e+1]=this.g,t[e+2]=this.b,t}fromBufferAttribute(t,e){return this.r=t.getX(e),this.g=t.getY(e),this.b=t.getZ(e),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const dn=new gt;gt.NAMES=Og;let a_=0;class Kr extends yo{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:a_++}),this.uuid=ki(),this.name="",this.type="Material",this.blending=ja,this.side=ar,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=Mu,this.blendDst=_u,this.blendEquation=Ar,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new gt(0,0,0),this.blendAlpha=0,this.depthFunc=co,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=p1,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=na,this.stencilZFail=na,this.stencilZPass=na,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(t){this._alphaTest>0!=t>0&&this.version++,this._alphaTest=t}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(t){if(t!==void 0)for(const e in t){const i=t[e];if(i===void 0){console.warn(`THREE.Material: parameter '${e}' has value of undefined.`);continue}const s=this[e];if(s===void 0){console.warn(`THREE.Material: '${e}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(i):s&&s.isVector3&&i&&i.isVector3?s.copy(i):this[e]=i}}toJSON(t){const e=t===void 0||typeof t=="string";e&&(t={textures:{},images:{}});const i={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};i.uuid=this.uuid,i.type=this.type,this.name!==""&&(i.name=this.name),this.color&&this.color.isColor&&(i.color=this.color.getHex()),this.roughness!==void 0&&(i.roughness=this.roughness),this.metalness!==void 0&&(i.metalness=this.metalness),this.sheen!==void 0&&(i.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(i.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(i.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(i.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(i.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(i.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(i.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(i.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(i.shininess=this.shininess),this.clearcoat!==void 0&&(i.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(i.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(i.clearcoatMap=this.clearcoatMap.toJSON(t).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(i.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(t).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(i.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(t).uuid,i.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(i.sheenColorMap=this.sheenColorMap.toJSON(t).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(i.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(t).uuid),this.dispersion!==void 0&&(i.dispersion=this.dispersion),this.iridescence!==void 0&&(i.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(i.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(i.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(i.iridescenceMap=this.iridescenceMap.toJSON(t).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(i.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(t).uuid),this.anisotropy!==void 0&&(i.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(i.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(i.anisotropyMap=this.anisotropyMap.toJSON(t).uuid),this.map&&this.map.isTexture&&(i.map=this.map.toJSON(t).uuid),this.matcap&&this.matcap.isTexture&&(i.matcap=this.matcap.toJSON(t).uuid),this.alphaMap&&this.alphaMap.isTexture&&(i.alphaMap=this.alphaMap.toJSON(t).uuid),this.lightMap&&this.lightMap.isTexture&&(i.lightMap=this.lightMap.toJSON(t).uuid,i.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(i.aoMap=this.aoMap.toJSON(t).uuid,i.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(i.bumpMap=this.bumpMap.toJSON(t).uuid,i.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(i.normalMap=this.normalMap.toJSON(t).uuid,i.normalMapType=this.normalMapType,i.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(i.displacementMap=this.displacementMap.toJSON(t).uuid,i.displacementScale=this.displacementScale,i.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(i.roughnessMap=this.roughnessMap.toJSON(t).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(i.metalnessMap=this.metalnessMap.toJSON(t).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(i.emissiveMap=this.emissiveMap.toJSON(t).uuid),this.specularMap&&this.specularMap.isTexture&&(i.specularMap=this.specularMap.toJSON(t).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(i.specularIntensityMap=this.specularIntensityMap.toJSON(t).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(i.specularColorMap=this.specularColorMap.toJSON(t).uuid),this.envMap&&this.envMap.isTexture&&(i.envMap=this.envMap.toJSON(t).uuid,this.combine!==void 0&&(i.combine=this.combine)),this.envMapRotation!==void 0&&(i.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(i.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(i.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(i.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(i.gradientMap=this.gradientMap.toJSON(t).uuid),this.transmission!==void 0&&(i.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(i.transmissionMap=this.transmissionMap.toJSON(t).uuid),this.thickness!==void 0&&(i.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(i.thicknessMap=this.thicknessMap.toJSON(t).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(i.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(i.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(i.size=this.size),this.shadowSide!==null&&(i.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(i.sizeAttenuation=this.sizeAttenuation),this.blending!==ja&&(i.blending=this.blending),this.side!==ar&&(i.side=this.side),this.vertexColors===!0&&(i.vertexColors=!0),this.opacity<1&&(i.opacity=this.opacity),this.transparent===!0&&(i.transparent=!0),this.blendSrc!==Mu&&(i.blendSrc=this.blendSrc),this.blendDst!==_u&&(i.blendDst=this.blendDst),this.blendEquation!==Ar&&(i.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(i.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(i.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(i.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(i.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(i.blendAlpha=this.blendAlpha),this.depthFunc!==co&&(i.depthFunc=this.depthFunc),this.depthTest===!1&&(i.depthTest=this.depthTest),this.depthWrite===!1&&(i.depthWrite=this.depthWrite),this.colorWrite===!1&&(i.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(i.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==p1&&(i.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(i.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(i.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==na&&(i.stencilFail=this.stencilFail),this.stencilZFail!==na&&(i.stencilZFail=this.stencilZFail),this.stencilZPass!==na&&(i.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(i.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(i.rotation=this.rotation),this.polygonOffset===!0&&(i.polygonOffset=!0),this.polygonOffsetFactor!==0&&(i.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(i.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(i.linewidth=this.linewidth),this.dashSize!==void 0&&(i.dashSize=this.dashSize),this.gapSize!==void 0&&(i.gapSize=this.gapSize),this.scale!==void 0&&(i.scale=this.scale),this.dithering===!0&&(i.dithering=!0),this.alphaTest>0&&(i.alphaTest=this.alphaTest),this.alphaHash===!0&&(i.alphaHash=!0),this.alphaToCoverage===!0&&(i.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(i.premultipliedAlpha=!0),this.forceSinglePass===!0&&(i.forceSinglePass=!0),this.wireframe===!0&&(i.wireframe=!0),this.wireframeLinewidth>1&&(i.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(i.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(i.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(i.flatShading=!0),this.visible===!1&&(i.visible=!1),this.toneMapped===!1&&(i.toneMapped=!1),this.fog===!1&&(i.fog=!1),Object.keys(this.userData).length>0&&(i.userData=this.userData);function s(r){const a=[];for(const o in r){const c=r[o];delete c.metadata,a.push(c)}return a}if(e){const r=s(t.textures),a=s(t.images);r.length>0&&(i.textures=r),a.length>0&&(i.images=a)}return i}clone(){return new this.constructor().copy(this)}copy(t){this.name=t.name,this.blending=t.blending,this.side=t.side,this.vertexColors=t.vertexColors,this.opacity=t.opacity,this.transparent=t.transparent,this.blendSrc=t.blendSrc,this.blendDst=t.blendDst,this.blendEquation=t.blendEquation,this.blendSrcAlpha=t.blendSrcAlpha,this.blendDstAlpha=t.blendDstAlpha,this.blendEquationAlpha=t.blendEquationAlpha,this.blendColor.copy(t.blendColor),this.blendAlpha=t.blendAlpha,this.depthFunc=t.depthFunc,this.depthTest=t.depthTest,this.depthWrite=t.depthWrite,this.stencilWriteMask=t.stencilWriteMask,this.stencilFunc=t.stencilFunc,this.stencilRef=t.stencilRef,this.stencilFuncMask=t.stencilFuncMask,this.stencilFail=t.stencilFail,this.stencilZFail=t.stencilZFail,this.stencilZPass=t.stencilZPass,this.stencilWrite=t.stencilWrite;const e=t.clippingPlanes;let i=null;if(e!==null){const s=e.length;i=new Array(s);for(let r=0;r!==s;++r)i[r]=e[r].clone()}return this.clippingPlanes=i,this.clipIntersection=t.clipIntersection,this.clipShadows=t.clipShadows,this.shadowSide=t.shadowSide,this.colorWrite=t.colorWrite,this.precision=t.precision,this.polygonOffset=t.polygonOffset,this.polygonOffsetFactor=t.polygonOffsetFactor,this.polygonOffsetUnits=t.polygonOffsetUnits,this.dithering=t.dithering,this.alphaTest=t.alphaTest,this.alphaHash=t.alphaHash,this.alphaToCoverage=t.alphaToCoverage,this.premultipliedAlpha=t.premultipliedAlpha,this.forceSinglePass=t.forceSinglePass,this.visible=t.visible,this.toneMapped=t.toneMapped,this.userData=JSON.parse(JSON.stringify(t.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(t){t===!0&&this.version++}}class cs extends Kr{constructor(t){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new gt(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Cn,this.combine=Sg,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.fog=t.fog,this}}const Es=o_();function o_(){const n=new ArrayBuffer(4),t=new Float32Array(n),e=new Uint32Array(n),i=new Uint32Array(512),s=new Uint32Array(512);for(let c=0;c<256;++c){const l=c-127;l<-27?(i[c]=0,i[c|256]=32768,s[c]=24,s[c|256]=24):l<-14?(i[c]=1024>>-l-14,i[c|256]=1024>>-l-14|32768,s[c]=-l-1,s[c|256]=-l-1):l<=15?(i[c]=l+15<<10,i[c|256]=l+15<<10|32768,s[c]=13,s[c|256]=13):l<128?(i[c]=31744,i[c|256]=64512,s[c]=24,s[c|256]=24):(i[c]=31744,i[c|256]=64512,s[c]=13,s[c|256]=13)}const r=new Uint32Array(2048),a=new Uint32Array(64),o=new Uint32Array(64);for(let c=1;c<1024;++c){let l=c<<13,u=0;for(;(l&8388608)===0;)l<<=1,u-=8388608;l&=-8388609,u+=947912704,r[c]=l|u}for(let c=1024;c<2048;++c)r[c]=939524096+(c-1024<<13);for(let c=1;c<31;++c)a[c]=c<<23;a[31]=1199570944,a[32]=2147483648;for(let c=33;c<63;++c)a[c]=2147483648+(c-32<<23);a[63]=3347054592;for(let c=1;c<64;++c)c!==32&&(o[c]=1024);return{floatView:t,uint32View:e,baseTable:i,shiftTable:s,mantissaTable:r,exponentTable:a,offsetTable:o}}function c_(n){Math.abs(n)>65504&&console.warn("THREE.DataUtils.toHalfFloat(): Value out of range."),n=ne(n,-65504,65504),Es.floatView[0]=n;const t=Es.uint32View[0],e=t>>23&511;return Es.baseTable[e]+((t&8388607)>>Es.shiftTable[e])}function l_(n){const t=n>>10;return Es.uint32View[0]=Es.mantissaTable[Es.offsetTable[t]+(n&1023)]+Es.exponentTable[t],Es.floatView[0]}class Jo{static toHalfFloat(t){return c_(t)}static fromHalfFloat(t){return l_(t)}}const $e=new C,Kc=new ht;let h_=0;class qt{constructor(t,e,i=!1){if(Array.isArray(t))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:h_++}),this.name="",this.array=t,this.itemSize=e,this.count=t!==void 0?t.length/e:0,this.normalized=i,this.usage=rf,this.updateRanges=[],this.gpuType=is,this.version=0}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.name=t.name,this.array=new t.array.constructor(t.array),this.itemSize=t.itemSize,this.count=t.count,this.normalized=t.normalized,this.usage=t.usage,this.gpuType=t.gpuType,this}copyAt(t,e,i){t*=this.itemSize,i*=e.itemSize;for(let s=0,r=this.itemSize;s<r;s++)this.array[t+s]=e.array[i+s];return this}copyArray(t){return this.array.set(t),this}applyMatrix3(t){if(this.itemSize===2)for(let e=0,i=this.count;e<i;e++)Kc.fromBufferAttribute(this,e),Kc.applyMatrix3(t),this.setXY(e,Kc.x,Kc.y);else if(this.itemSize===3)for(let e=0,i=this.count;e<i;e++)$e.fromBufferAttribute(this,e),$e.applyMatrix3(t),this.setXYZ(e,$e.x,$e.y,$e.z);return this}applyMatrix4(t){for(let e=0,i=this.count;e<i;e++)$e.fromBufferAttribute(this,e),$e.applyMatrix4(t),this.setXYZ(e,$e.x,$e.y,$e.z);return this}applyNormalMatrix(t){for(let e=0,i=this.count;e<i;e++)$e.fromBufferAttribute(this,e),$e.applyNormalMatrix(t),this.setXYZ(e,$e.x,$e.y,$e.z);return this}transformDirection(t){for(let e=0,i=this.count;e<i;e++)$e.fromBufferAttribute(this,e),$e.transformDirection(t),this.setXYZ(e,$e.x,$e.y,$e.z);return this}set(t,e=0){return this.array.set(t,e),this}getComponent(t,e){let i=this.array[t*this.itemSize+e];return this.normalized&&(i=Ui(i,this.array)),i}setComponent(t,e,i){return this.normalized&&(i=we(i,this.array)),this.array[t*this.itemSize+e]=i,this}getX(t){let e=this.array[t*this.itemSize];return this.normalized&&(e=Ui(e,this.array)),e}setX(t,e){return this.normalized&&(e=we(e,this.array)),this.array[t*this.itemSize]=e,this}getY(t){let e=this.array[t*this.itemSize+1];return this.normalized&&(e=Ui(e,this.array)),e}setY(t,e){return this.normalized&&(e=we(e,this.array)),this.array[t*this.itemSize+1]=e,this}getZ(t){let e=this.array[t*this.itemSize+2];return this.normalized&&(e=Ui(e,this.array)),e}setZ(t,e){return this.normalized&&(e=we(e,this.array)),this.array[t*this.itemSize+2]=e,this}getW(t){let e=this.array[t*this.itemSize+3];return this.normalized&&(e=Ui(e,this.array)),e}setW(t,e){return this.normalized&&(e=we(e,this.array)),this.array[t*this.itemSize+3]=e,this}setXY(t,e,i){return t*=this.itemSize,this.normalized&&(e=we(e,this.array),i=we(i,this.array)),this.array[t+0]=e,this.array[t+1]=i,this}setXYZ(t,e,i,s){return t*=this.itemSize,this.normalized&&(e=we(e,this.array),i=we(i,this.array),s=we(s,this.array)),this.array[t+0]=e,this.array[t+1]=i,this.array[t+2]=s,this}setXYZW(t,e,i,s,r){return t*=this.itemSize,this.normalized&&(e=we(e,this.array),i=we(i,this.array),s=we(s,this.array),r=we(r,this.array)),this.array[t+0]=e,this.array[t+1]=i,this.array[t+2]=s,this.array[t+3]=r,this}onUpload(t){return this.onUploadCallback=t,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const t={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(t.name=this.name),this.usage!==rf&&(t.usage=this.usage),t}}class ad extends qt{constructor(t,e,i){super(new Uint16Array(t),e,i)}}class Bg extends qt{constructor(t,e,i){super(new Uint32Array(t),e,i)}}class ae extends qt{constructor(t,e,i){super(new Float32Array(t),e,i)}}let u_=0;const ci=new se,u0=new Ge,fa=new C,Xn=new So,Uo=new So,Qe=new C;class Me extends yo{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:u_++}),this.uuid=ki(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(t){return Array.isArray(t)?this.index=new(Ng(t)?Bg:ad)(t,1):this.index=t,this}setIndirect(t){return this.indirect=t,this}getIndirect(){return this.indirect}getAttribute(t){return this.attributes[t]}setAttribute(t,e){return this.attributes[t]=e,this}deleteAttribute(t){return delete this.attributes[t],this}hasAttribute(t){return this.attributes[t]!==void 0}addGroup(t,e,i=0){this.groups.push({start:t,count:e,materialIndex:i})}clearGroups(){this.groups=[]}setDrawRange(t,e){this.drawRange.start=t,this.drawRange.count=e}applyMatrix4(t){const e=this.attributes.position;e!==void 0&&(e.applyMatrix4(t),e.needsUpdate=!0);const i=this.attributes.normal;if(i!==void 0){const r=new le().getNormalMatrix(t);i.applyNormalMatrix(r),i.needsUpdate=!0}const s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(t),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(t){return ci.makeRotationFromQuaternion(t),this.applyMatrix4(ci),this}rotateX(t){return ci.makeRotationX(t),this.applyMatrix4(ci),this}rotateY(t){return ci.makeRotationY(t),this.applyMatrix4(ci),this}rotateZ(t){return ci.makeRotationZ(t),this.applyMatrix4(ci),this}translate(t,e,i){return ci.makeTranslation(t,e,i),this.applyMatrix4(ci),this}scale(t,e,i){return ci.makeScale(t,e,i),this.applyMatrix4(ci),this}lookAt(t){return u0.lookAt(t),u0.updateMatrix(),this.applyMatrix4(u0.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(fa).negate(),this.translate(fa.x,fa.y,fa.z),this}setFromPoints(t){const e=this.getAttribute("position");if(e===void 0){const i=[];for(let s=0,r=t.length;s<r;s++){const a=t[s];i.push(a.x,a.y,a.z||0)}this.setAttribute("position",new ae(i,3))}else{const i=Math.min(t.length,e.count);for(let s=0;s<i;s++){const r=t[s];e.setXYZ(s,r.x,r.y,r.z||0)}t.length>e.count&&console.warn("THREE.BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),e.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new So);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new C(-1/0,-1/0,-1/0),new C(1/0,1/0,1/0));return}if(t!==void 0){if(this.boundingBox.setFromBufferAttribute(t),e)for(let i=0,s=e.length;i<s;i++){const r=e[i];Xn.setFromBufferAttribute(r),this.morphTargetsRelative?(Qe.addVectors(this.boundingBox.min,Xn.min),this.boundingBox.expandByPoint(Qe),Qe.addVectors(this.boundingBox.max,Xn.max),this.boundingBox.expandByPoint(Qe)):(this.boundingBox.expandByPoint(Xn.min),this.boundingBox.expandByPoint(Xn.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new lr);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new C,1/0);return}if(t){const i=this.boundingSphere.center;if(Xn.setFromBufferAttribute(t),e)for(let r=0,a=e.length;r<a;r++){const o=e[r];Uo.setFromBufferAttribute(o),this.morphTargetsRelative?(Qe.addVectors(Xn.min,Uo.min),Xn.expandByPoint(Qe),Qe.addVectors(Xn.max,Uo.max),Xn.expandByPoint(Qe)):(Xn.expandByPoint(Uo.min),Xn.expandByPoint(Uo.max))}Xn.getCenter(i);let s=0;for(let r=0,a=t.count;r<a;r++)Qe.fromBufferAttribute(t,r),s=Math.max(s,i.distanceToSquared(Qe));if(e)for(let r=0,a=e.length;r<a;r++){const o=e[r],c=this.morphTargetsRelative;for(let l=0,u=o.count;l<u;l++)Qe.fromBufferAttribute(o,l),c&&(fa.fromBufferAttribute(t,l),Qe.add(fa)),s=Math.max(s,i.distanceToSquared(Qe))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const t=this.index,e=this.attributes;if(t===null||e.position===void 0||e.normal===void 0||e.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const i=e.position,s=e.normal,r=e.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new qt(new Float32Array(4*i.count),4));const a=this.getAttribute("tangent"),o=[],c=[];for(let A=0;A<i.count;A++)o[A]=new C,c[A]=new C;const l=new C,u=new C,h=new C,f=new ht,d=new ht,p=new ht,v=new C,g=new C;function m(A,w,y){l.fromBufferAttribute(i,A),u.fromBufferAttribute(i,w),h.fromBufferAttribute(i,y),f.fromBufferAttribute(r,A),d.fromBufferAttribute(r,w),p.fromBufferAttribute(r,y),u.sub(l),h.sub(l),d.sub(f),p.sub(f);const E=1/(d.x*p.y-p.x*d.y);isFinite(E)&&(v.copy(u).multiplyScalar(p.y).addScaledVector(h,-d.y).multiplyScalar(E),g.copy(h).multiplyScalar(d.x).addScaledVector(u,-p.x).multiplyScalar(E),o[A].add(v),o[w].add(v),o[y].add(v),c[A].add(g),c[w].add(g),c[y].add(g))}let M=this.groups;M.length===0&&(M=[{start:0,count:t.count}]);for(let A=0,w=M.length;A<w;++A){const y=M[A],E=y.start,R=y.count;for(let L=E,I=E+R;L<I;L+=3)m(t.getX(L+0),t.getX(L+1),t.getX(L+2))}const x=new C,_=new C,b=new C,S=new C;function T(A){b.fromBufferAttribute(s,A),S.copy(b);const w=o[A];x.copy(w),x.sub(b.multiplyScalar(b.dot(w))).normalize(),_.crossVectors(S,w);const E=_.dot(c[A])<0?-1:1;a.setXYZW(A,x.x,x.y,x.z,E)}for(let A=0,w=M.length;A<w;++A){const y=M[A],E=y.start,R=y.count;for(let L=E,I=E+R;L<I;L+=3)T(t.getX(L+0)),T(t.getX(L+1)),T(t.getX(L+2))}}computeVertexNormals(){const t=this.index,e=this.getAttribute("position");if(e!==void 0){let i=this.getAttribute("normal");if(i===void 0)i=new qt(new Float32Array(e.count*3),3),this.setAttribute("normal",i);else for(let f=0,d=i.count;f<d;f++)i.setXYZ(f,0,0,0);const s=new C,r=new C,a=new C,o=new C,c=new C,l=new C,u=new C,h=new C;if(t)for(let f=0,d=t.count;f<d;f+=3){const p=t.getX(f+0),v=t.getX(f+1),g=t.getX(f+2);s.fromBufferAttribute(e,p),r.fromBufferAttribute(e,v),a.fromBufferAttribute(e,g),u.subVectors(a,r),h.subVectors(s,r),u.cross(h),o.fromBufferAttribute(i,p),c.fromBufferAttribute(i,v),l.fromBufferAttribute(i,g),o.add(u),c.add(u),l.add(u),i.setXYZ(p,o.x,o.y,o.z),i.setXYZ(v,c.x,c.y,c.z),i.setXYZ(g,l.x,l.y,l.z)}else for(let f=0,d=e.count;f<d;f+=3)s.fromBufferAttribute(e,f+0),r.fromBufferAttribute(e,f+1),a.fromBufferAttribute(e,f+2),u.subVectors(a,r),h.subVectors(s,r),u.cross(h),i.setXYZ(f+0,u.x,u.y,u.z),i.setXYZ(f+1,u.x,u.y,u.z),i.setXYZ(f+2,u.x,u.y,u.z);this.normalizeNormals(),i.needsUpdate=!0}}normalizeNormals(){const t=this.attributes.normal;for(let e=0,i=t.count;e<i;e++)Qe.fromBufferAttribute(t,e),Qe.normalize(),t.setXYZ(e,Qe.x,Qe.y,Qe.z)}toNonIndexed(){function t(o,c){const l=o.array,u=o.itemSize,h=o.normalized,f=new l.constructor(c.length*u);let d=0,p=0;for(let v=0,g=c.length;v<g;v++){o.isInterleavedBufferAttribute?d=c[v]*o.data.stride+o.offset:d=c[v]*u;for(let m=0;m<u;m++)f[p++]=l[d++]}return new qt(f,u,h)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const e=new Me,i=this.index.array,s=this.attributes;for(const o in s){const c=s[o],l=t(c,i);e.setAttribute(o,l)}const r=this.morphAttributes;for(const o in r){const c=[],l=r[o];for(let u=0,h=l.length;u<h;u++){const f=l[u],d=t(f,i);c.push(d)}e.morphAttributes[o]=c}e.morphTargetsRelative=this.morphTargetsRelative;const a=this.groups;for(let o=0,c=a.length;o<c;o++){const l=a[o];e.addGroup(l.start,l.count,l.materialIndex)}return e}toJSON(){const t={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(t.uuid=this.uuid,t.type=this.type,this.name!==""&&(t.name=this.name),Object.keys(this.userData).length>0&&(t.userData=this.userData),this.parameters!==void 0){const c=this.parameters;for(const l in c)c[l]!==void 0&&(t[l]=c[l]);return t}t.data={attributes:{}};const e=this.index;e!==null&&(t.data.index={type:e.array.constructor.name,array:Array.prototype.slice.call(e.array)});const i=this.attributes;for(const c in i){const l=i[c];t.data.attributes[c]=l.toJSON(t.data)}const s={};let r=!1;for(const c in this.morphAttributes){const l=this.morphAttributes[c],u=[];for(let h=0,f=l.length;h<f;h++){const d=l[h];u.push(d.toJSON(t.data))}u.length>0&&(s[c]=u,r=!0)}r&&(t.data.morphAttributes=s,t.data.morphTargetsRelative=this.morphTargetsRelative);const a=this.groups;a.length>0&&(t.data.groups=JSON.parse(JSON.stringify(a)));const o=this.boundingSphere;return o!==null&&(t.data.boundingSphere=o.toJSON()),t}clone(){return new this.constructor().copy(this)}copy(t){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const e={};this.name=t.name;const i=t.index;i!==null&&this.setIndex(i.clone());const s=t.attributes;for(const l in s){const u=s[l];this.setAttribute(l,u.clone(e))}const r=t.morphAttributes;for(const l in r){const u=[],h=r[l];for(let f=0,d=h.length;f<d;f++)u.push(h[f].clone(e));this.morphAttributes[l]=u}this.morphTargetsRelative=t.morphTargetsRelative;const a=t.groups;for(let l=0,u=a.length;l<u;l++){const h=a[l];this.addGroup(h.start,h.count,h.materialIndex)}const o=t.boundingBox;o!==null&&(this.boundingBox=o.clone());const c=t.boundingSphere;return c!==null&&(this.boundingSphere=c.clone()),this.drawRange.start=t.drawRange.start,this.drawRange.count=t.drawRange.count,this.userData=t.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const C1=new se,mr=new rd,Qc=new lr,L1=new C,tl=new C,el=new C,nl=new C,f0=new C,il=new C,P1=new C,sl=new C;class nt extends Ge{constructor(t=new Me,e=new cs){super(),this.isMesh=!0,this.type="Mesh",this.geometry=t,this.material=e,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),t.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=t.morphTargetInfluences.slice()),t.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},t.morphTargetDictionary)),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}updateMorphTargets(){const e=this.geometry.morphAttributes,i=Object.keys(e);if(i.length>0){const s=e[i[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=s.length;r<a;r++){const o=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}getVertexPosition(t,e){const i=this.geometry,s=i.attributes.position,r=i.morphAttributes.position,a=i.morphTargetsRelative;e.fromBufferAttribute(s,t);const o=this.morphTargetInfluences;if(r&&o){il.set(0,0,0);for(let c=0,l=r.length;c<l;c++){const u=o[c],h=r[c];u!==0&&(f0.fromBufferAttribute(h,t),a?il.addScaledVector(f0,u):il.addScaledVector(f0.sub(e),u))}e.add(il)}return e}raycast(t,e){const i=this.geometry,s=this.material,r=this.matrixWorld;s!==void 0&&(i.boundingSphere===null&&i.computeBoundingSphere(),Qc.copy(i.boundingSphere),Qc.applyMatrix4(r),mr.copy(t.ray).recast(t.near),!(Qc.containsPoint(mr.origin)===!1&&(mr.intersectSphere(Qc,L1)===null||mr.origin.distanceToSquared(L1)>(t.far-t.near)**2))&&(C1.copy(r).invert(),mr.copy(t.ray).applyMatrix4(C1),!(i.boundingBox!==null&&mr.intersectsBox(i.boundingBox)===!1)&&this._computeIntersections(t,e,mr)))}_computeIntersections(t,e,i){let s;const r=this.geometry,a=this.material,o=r.index,c=r.attributes.position,l=r.attributes.uv,u=r.attributes.uv1,h=r.attributes.normal,f=r.groups,d=r.drawRange;if(o!==null)if(Array.isArray(a))for(let p=0,v=f.length;p<v;p++){const g=f[p],m=a[g.materialIndex],M=Math.max(g.start,d.start),x=Math.min(o.count,Math.min(g.start+g.count,d.start+d.count));for(let _=M,b=x;_<b;_+=3){const S=o.getX(_),T=o.getX(_+1),A=o.getX(_+2);s=rl(this,m,t,i,l,u,h,S,T,A),s&&(s.faceIndex=Math.floor(_/3),s.face.materialIndex=g.materialIndex,e.push(s))}}else{const p=Math.max(0,d.start),v=Math.min(o.count,d.start+d.count);for(let g=p,m=v;g<m;g+=3){const M=o.getX(g),x=o.getX(g+1),_=o.getX(g+2);s=rl(this,a,t,i,l,u,h,M,x,_),s&&(s.faceIndex=Math.floor(g/3),e.push(s))}}else if(c!==void 0)if(Array.isArray(a))for(let p=0,v=f.length;p<v;p++){const g=f[p],m=a[g.materialIndex],M=Math.max(g.start,d.start),x=Math.min(c.count,Math.min(g.start+g.count,d.start+d.count));for(let _=M,b=x;_<b;_+=3){const S=_,T=_+1,A=_+2;s=rl(this,m,t,i,l,u,h,S,T,A),s&&(s.faceIndex=Math.floor(_/3),s.face.materialIndex=g.materialIndex,e.push(s))}}else{const p=Math.max(0,d.start),v=Math.min(c.count,d.start+d.count);for(let g=p,m=v;g<m;g+=3){const M=g,x=g+1,_=g+2;s=rl(this,a,t,i,l,u,h,M,x,_),s&&(s.faceIndex=Math.floor(g/3),e.push(s))}}}}function f_(n,t,e,i,s,r,a,o){let c;if(t.side===Bn?c=i.intersectTriangle(a,r,s,!0,o):c=i.intersectTriangle(s,r,a,t.side===ar,o),c===null)return null;sl.copy(o),sl.applyMatrix4(n.matrixWorld);const l=e.ray.origin.distanceTo(sl);return l<e.near||l>e.far?null:{distance:l,point:sl.clone(),object:n}}function rl(n,t,e,i,s,r,a,o,c,l){n.getVertexPosition(o,tl),n.getVertexPosition(c,el),n.getVertexPosition(l,nl);const u=f_(n,t,e,i,tl,el,nl,P1);if(u){const h=new C;gi.getBarycoord(P1,tl,el,nl,h),s&&(u.uv=gi.getInterpolatedAttribute(s,o,c,l,h,new ht)),r&&(u.uv1=gi.getInterpolatedAttribute(r,o,c,l,h,new ht)),a&&(u.normal=gi.getInterpolatedAttribute(a,o,c,l,h,new C),u.normal.dot(i.direction)>0&&u.normal.multiplyScalar(-1));const f={a:o,b:c,c:l,normal:new C,materialIndex:0};gi.getNormal(tl,el,nl,f.normal),u.face=f,u.barycoord=h}return u}class Ie extends Me{constructor(t=1,e=1,i=1,s=1,r=1,a=1){super(),this.type="BoxGeometry",this.parameters={width:t,height:e,depth:i,widthSegments:s,heightSegments:r,depthSegments:a};const o=this;s=Math.floor(s),r=Math.floor(r),a=Math.floor(a);const c=[],l=[],u=[],h=[];let f=0,d=0;p("z","y","x",-1,-1,i,e,t,a,r,0),p("z","y","x",1,-1,i,e,-t,a,r,1),p("x","z","y",1,1,t,i,e,s,a,2),p("x","z","y",1,-1,t,i,-e,s,a,3),p("x","y","z",1,-1,t,e,i,s,r,4),p("x","y","z",-1,-1,t,e,-i,s,r,5),this.setIndex(c),this.setAttribute("position",new ae(l,3)),this.setAttribute("normal",new ae(u,3)),this.setAttribute("uv",new ae(h,2));function p(v,g,m,M,x,_,b,S,T,A,w){const y=_/T,E=b/A,R=_/2,L=b/2,I=S/2,N=T+1,B=A+1;let X=0,H=0;const Y=new C;for(let it=0;it<B;it++){const dt=it*E-L;for(let vt=0;vt<N;vt++){const St=vt*y-R;Y[v]=St*M,Y[g]=dt*x,Y[m]=I,l.push(Y.x,Y.y,Y.z),Y[v]=0,Y[g]=0,Y[m]=S>0?1:-1,u.push(Y.x,Y.y,Y.z),h.push(vt/T),h.push(1-it/A),X+=1}}for(let it=0;it<A;it++)for(let dt=0;dt<T;dt++){const vt=f+dt+N*it,St=f+dt+N*(it+1),Ct=f+(dt+1)+N*(it+1),Ft=f+(dt+1)+N*it;c.push(vt,St,Ft),c.push(St,Ct,Ft),H+=6}o.addGroup(d,H,w),d+=H,f+=X}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Ie(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}}function po(n){const t={};for(const e in n){t[e]={};for(const i in n[e]){const s=n[e][i];s&&(s.isColor||s.isMatrix3||s.isMatrix4||s.isVector2||s.isVector3||s.isVector4||s.isTexture||s.isQuaternion)?s.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),t[e][i]=null):t[e][i]=s.clone():Array.isArray(s)?t[e][i]=s.slice():t[e][i]=s}}return t}function bn(n){const t={};for(let e=0;e<n.length;e++){const i=po(n[e]);for(const s in i)t[s]=i[s]}return t}function d_(n){const t=[];for(let e=0;e<n.length;e++)t.push(n[e].clone());return t}function Hg(n){const t=n.getRenderTarget();return t===null?n.outputColorSpace:t.isXRRenderTarget===!0?t.texture.colorSpace:ve.workingColorSpace}const p_={clone:po,merge:bn};var m_=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,g_=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class nn extends Kr{constructor(t){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=m_,this.fragmentShader=g_,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,t!==void 0&&this.setValues(t)}copy(t){return super.copy(t),this.fragmentShader=t.fragmentShader,this.vertexShader=t.vertexShader,this.uniforms=po(t.uniforms),this.uniformsGroups=d_(t.uniformsGroups),this.defines=Object.assign({},t.defines),this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.fog=t.fog,this.lights=t.lights,this.clipping=t.clipping,this.extensions=Object.assign({},t.extensions),this.glslVersion=t.glslVersion,this}toJSON(t){const e=super.toJSON(t);e.glslVersion=this.glslVersion,e.uniforms={};for(const s in this.uniforms){const a=this.uniforms[s].value;a&&a.isTexture?e.uniforms[s]={type:"t",value:a.toJSON(t).uuid}:a&&a.isColor?e.uniforms[s]={type:"c",value:a.getHex()}:a&&a.isVector2?e.uniforms[s]={type:"v2",value:a.toArray()}:a&&a.isVector3?e.uniforms[s]={type:"v3",value:a.toArray()}:a&&a.isVector4?e.uniforms[s]={type:"v4",value:a.toArray()}:a&&a.isMatrix3?e.uniforms[s]={type:"m3",value:a.toArray()}:a&&a.isMatrix4?e.uniforms[s]={type:"m4",value:a.toArray()}:e.uniforms[s]={value:a}}Object.keys(this.defines).length>0&&(e.defines=this.defines),e.vertexShader=this.vertexShader,e.fragmentShader=this.fragmentShader,e.lights=this.lights,e.clipping=this.clipping;const i={};for(const s in this.extensions)this.extensions[s]===!0&&(i[s]=!0);return Object.keys(i).length>0&&(e.extensions=i),e}}class zg extends Ge{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new se,this.projectionMatrix=new se,this.projectionMatrixInverse=new se,this.coordinateSystem=ss,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(t,e){return super.copy(t,e),this.matrixWorldInverse.copy(t.matrixWorldInverse),this.projectionMatrix.copy(t.projectionMatrix),this.projectionMatrixInverse.copy(t.projectionMatrixInverse),this.coordinateSystem=t.coordinateSystem,this}getWorldDirection(t){return super.getWorldDirection(t).negate()}updateMatrixWorld(t){super.updateMatrixWorld(t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(t,e){super.updateWorldMatrix(t,e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}const ks=new C,I1=new ht,D1=new ht;class jn extends zg{constructor(t=50,e=1,i=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=t,this.zoom=1,this.near=i,this.far=s,this.focus=10,this.aspect=e,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.fov=t.fov,this.zoom=t.zoom,this.near=t.near,this.far=t.far,this.focus=t.focus,this.aspect=t.aspect,this.view=t.view===null?null:Object.assign({},t.view),this.filmGauge=t.filmGauge,this.filmOffset=t.filmOffset,this}setFocalLength(t){const e=.5*this.getFilmHeight()/t;this.fov=fo*2*Math.atan(e),this.updateProjectionMatrix()}getFocalLength(){const t=Math.tan(ic*.5*this.fov);return .5*this.getFilmHeight()/t}getEffectiveFOV(){return fo*2*Math.atan(Math.tan(ic*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(t,e,i){ks.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),e.set(ks.x,ks.y).multiplyScalar(-t/ks.z),ks.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),i.set(ks.x,ks.y).multiplyScalar(-t/ks.z)}getViewSize(t,e){return this.getViewBounds(t,I1,D1),e.subVectors(D1,I1)}setViewOffset(t,e,i,s,r,a){this.aspect=t/e,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=i,this.view.offsetY=s,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=this.near;let e=t*Math.tan(ic*.5*this.fov)/this.zoom,i=2*e,s=this.aspect*i,r=-.5*s;const a=this.view;if(this.view!==null&&this.view.enabled){const c=a.fullWidth,l=a.fullHeight;r+=a.offsetX*s/c,e-=a.offsetY*i/l,s*=a.width/c,i*=a.height/l}const o=this.filmOffset;o!==0&&(r+=t*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+s,e,e-i,t,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.fov=this.fov,e.object.zoom=this.zoom,e.object.near=this.near,e.object.far=this.far,e.object.focus=this.focus,e.object.aspect=this.aspect,this.view!==null&&(e.object.view=Object.assign({},this.view)),e.object.filmGauge=this.filmGauge,e.object.filmOffset=this.filmOffset,e}}const da=-90,pa=1;class v_ extends Ge{constructor(t,e,i){super(),this.type="CubeCamera",this.renderTarget=i,this.coordinateSystem=null,this.activeMipmapLevel=0;const s=new jn(da,pa,t,e);s.layers=this.layers,this.add(s);const r=new jn(da,pa,t,e);r.layers=this.layers,this.add(r);const a=new jn(da,pa,t,e);a.layers=this.layers,this.add(a);const o=new jn(da,pa,t,e);o.layers=this.layers,this.add(o);const c=new jn(da,pa,t,e);c.layers=this.layers,this.add(c);const l=new jn(da,pa,t,e);l.layers=this.layers,this.add(l)}updateCoordinateSystem(){const t=this.coordinateSystem,e=this.children.concat(),[i,s,r,a,o,c]=e;for(const l of e)this.remove(l);if(t===ss)i.up.set(0,1,0),i.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),c.up.set(0,1,0),c.lookAt(0,0,-1);else if(t===sh)i.up.set(0,-1,0),i.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),c.up.set(0,-1,0),c.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+t);for(const l of e)this.add(l),l.updateMatrixWorld()}update(t,e){this.parent===null&&this.updateMatrixWorld();const{renderTarget:i,activeMipmapLevel:s}=this;this.coordinateSystem!==t.coordinateSystem&&(this.coordinateSystem=t.coordinateSystem,this.updateCoordinateSystem());const[r,a,o,c,l,u]=this.children,h=t.getRenderTarget(),f=t.getActiveCubeFace(),d=t.getActiveMipmapLevel(),p=t.xr.enabled;t.xr.enabled=!1;const v=i.texture.generateMipmaps;i.texture.generateMipmaps=!1,t.setRenderTarget(i,0,s),t.render(e,r),t.setRenderTarget(i,1,s),t.render(e,a),t.setRenderTarget(i,2,s),t.render(e,o),t.setRenderTarget(i,3,s),t.render(e,c),t.setRenderTarget(i,4,s),t.render(e,l),i.texture.generateMipmaps=v,t.setRenderTarget(i,5,s),t.render(e,u),t.setRenderTarget(h,f,d),t.xr.enabled=p,i.texture.needsPMREMUpdate=!0}}class Vg extends un{constructor(t=[],e=lo,i,s,r,a,o,c,l,u){super(t,e,i,s,r,a,o,c,l,u),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(t){this.image=t}}class x_ extends En{constructor(t=1,e={}){super(t,t,e),this.isWebGLCubeRenderTarget=!0;const i={width:t,height:t,depth:1},s=[i,i,i,i,i,i];this.texture=new Vg(s),this._setTextureOptions(e),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(t,e){this.texture.type=e.type,this.texture.colorSpace=e.colorSpace,this.texture.generateMipmaps=e.generateMipmaps,this.texture.minFilter=e.minFilter,this.texture.magFilter=e.magFilter;const i={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},s=new Ie(5,5,5),r=new nn({name:"CubemapFromEquirect",uniforms:po(i.uniforms),vertexShader:i.vertexShader,fragmentShader:i.fragmentShader,side:Bn,blending:er});r.uniforms.tEquirect.value=e;const a=new nt(s,r),o=e.minFilter;return e.minFilter===Zs&&(e.minFilter=Pe),new v_(1,10,this).update(t,a),e.minFilter=o,a.geometry.dispose(),a.material.dispose(),this}clear(t,e=!0,i=!0,s=!0){const r=t.getRenderTarget();for(let a=0;a<6;a++)t.setRenderTarget(this,a),t.clear(e,i,s);t.setRenderTarget(r)}}class de extends Ge{constructor(){super(),this.isGroup=!0,this.type="Group"}}const M_={type:"move"};class d0{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new de,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new de,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new C,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new C),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new de,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new C,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new C),this._grip}dispatchEvent(t){return this._targetRay!==null&&this._targetRay.dispatchEvent(t),this._grip!==null&&this._grip.dispatchEvent(t),this._hand!==null&&this._hand.dispatchEvent(t),this}connect(t){if(t&&t.hand){const e=this._hand;if(e)for(const i of t.hand.values())this._getHandJoint(e,i)}return this.dispatchEvent({type:"connected",data:t}),this}disconnect(t){return this.dispatchEvent({type:"disconnected",data:t}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(t,e,i){let s=null,r=null,a=null;const o=this._targetRay,c=this._grip,l=this._hand;if(t&&e.session.visibilityState!=="visible-blurred"){if(l&&t.hand){a=!0;for(const v of t.hand.values()){const g=e.getJointPose(v,i),m=this._getHandJoint(l,v);g!==null&&(m.matrix.fromArray(g.transform.matrix),m.matrix.decompose(m.position,m.rotation,m.scale),m.matrixWorldNeedsUpdate=!0,m.jointRadius=g.radius),m.visible=g!==null}const u=l.joints["index-finger-tip"],h=l.joints["thumb-tip"],f=u.position.distanceTo(h.position),d=.02,p=.005;l.inputState.pinching&&f>d+p?(l.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:t.handedness,target:this})):!l.inputState.pinching&&f<=d-p&&(l.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:t.handedness,target:this}))}else c!==null&&t.gripSpace&&(r=e.getPose(t.gripSpace,i),r!==null&&(c.matrix.fromArray(r.transform.matrix),c.matrix.decompose(c.position,c.rotation,c.scale),c.matrixWorldNeedsUpdate=!0,r.linearVelocity?(c.hasLinearVelocity=!0,c.linearVelocity.copy(r.linearVelocity)):c.hasLinearVelocity=!1,r.angularVelocity?(c.hasAngularVelocity=!0,c.angularVelocity.copy(r.angularVelocity)):c.hasAngularVelocity=!1));o!==null&&(s=e.getPose(t.targetRaySpace,i),s===null&&r!==null&&(s=r),s!==null&&(o.matrix.fromArray(s.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,s.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(s.linearVelocity)):o.hasLinearVelocity=!1,s.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(s.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(M_)))}return o!==null&&(o.visible=s!==null),c!==null&&(c.visible=r!==null),l!==null&&(l.visible=a!==null),this}_getHandJoint(t,e){if(t.joints[e.jointName]===void 0){const i=new de;i.matrixAutoUpdate=!1,i.visible=!1,t.joints[e.jointName]=i,t.add(i)}return t.joints[e.jointName]}}class Gg extends Ge{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new Cn,this.environmentIntensity=1,this.environmentRotation=new Cn,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(t,e){return super.copy(t,e),t.background!==null&&(this.background=t.background.clone()),t.environment!==null&&(this.environment=t.environment.clone()),t.fog!==null&&(this.fog=t.fog.clone()),this.backgroundBlurriness=t.backgroundBlurriness,this.backgroundIntensity=t.backgroundIntensity,this.backgroundRotation.copy(t.backgroundRotation),this.environmentIntensity=t.environmentIntensity,this.environmentRotation.copy(t.environmentRotation),t.overrideMaterial!==null&&(this.overrideMaterial=t.overrideMaterial.clone()),this.matrixAutoUpdate=t.matrixAutoUpdate,this}toJSON(t){const e=super.toJSON(t);return this.fog!==null&&(e.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(e.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(e.object.backgroundIntensity=this.backgroundIntensity),e.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(e.object.environmentIntensity=this.environmentIntensity),e.object.environmentRotation=this.environmentRotation.toArray(),e}}class __{constructor(t,e){this.isInterleavedBuffer=!0,this.array=t,this.stride=e,this.count=t!==void 0?t.length/e:0,this.usage=rf,this.updateRanges=[],this.version=0,this.uuid=ki()}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.array=new t.array.constructor(t.array),this.count=t.count,this.stride=t.stride,this.usage=t.usage,this}copyAt(t,e,i){t*=this.stride,i*=e.stride;for(let s=0,r=this.stride;s<r;s++)this.array[t+s]=e.array[i+s];return this}set(t,e=0){return this.array.set(t,e),this}clone(t){t.arrayBuffers===void 0&&(t.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=ki()),t.arrayBuffers[this.array.buffer._uuid]===void 0&&(t.arrayBuffers[this.array.buffer._uuid]=this.array.slice(0).buffer);const e=new this.array.constructor(t.arrayBuffers[this.array.buffer._uuid]),i=new this.constructor(e,this.stride);return i.setUsage(this.usage),i}onUpload(t){return this.onUploadCallback=t,this}toJSON(t){return t.arrayBuffers===void 0&&(t.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=ki()),t.arrayBuffers[this.array.buffer._uuid]===void 0&&(t.arrayBuffers[this.array.buffer._uuid]=Array.from(new Uint32Array(this.array.buffer))),{uuid:this.uuid,buffer:this.array.buffer._uuid,type:this.array.constructor.name,stride:this.stride}}}const wn=new C;class ah{constructor(t,e,i,s=!1){this.isInterleavedBufferAttribute=!0,this.name="",this.data=t,this.itemSize=e,this.offset=i,this.normalized=s}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(t){this.data.needsUpdate=t}applyMatrix4(t){for(let e=0,i=this.data.count;e<i;e++)wn.fromBufferAttribute(this,e),wn.applyMatrix4(t),this.setXYZ(e,wn.x,wn.y,wn.z);return this}applyNormalMatrix(t){for(let e=0,i=this.count;e<i;e++)wn.fromBufferAttribute(this,e),wn.applyNormalMatrix(t),this.setXYZ(e,wn.x,wn.y,wn.z);return this}transformDirection(t){for(let e=0,i=this.count;e<i;e++)wn.fromBufferAttribute(this,e),wn.transformDirection(t),this.setXYZ(e,wn.x,wn.y,wn.z);return this}getComponent(t,e){let i=this.array[t*this.data.stride+this.offset+e];return this.normalized&&(i=Ui(i,this.array)),i}setComponent(t,e,i){return this.normalized&&(i=we(i,this.array)),this.data.array[t*this.data.stride+this.offset+e]=i,this}setX(t,e){return this.normalized&&(e=we(e,this.array)),this.data.array[t*this.data.stride+this.offset]=e,this}setY(t,e){return this.normalized&&(e=we(e,this.array)),this.data.array[t*this.data.stride+this.offset+1]=e,this}setZ(t,e){return this.normalized&&(e=we(e,this.array)),this.data.array[t*this.data.stride+this.offset+2]=e,this}setW(t,e){return this.normalized&&(e=we(e,this.array)),this.data.array[t*this.data.stride+this.offset+3]=e,this}getX(t){let e=this.data.array[t*this.data.stride+this.offset];return this.normalized&&(e=Ui(e,this.array)),e}getY(t){let e=this.data.array[t*this.data.stride+this.offset+1];return this.normalized&&(e=Ui(e,this.array)),e}getZ(t){let e=this.data.array[t*this.data.stride+this.offset+2];return this.normalized&&(e=Ui(e,this.array)),e}getW(t){let e=this.data.array[t*this.data.stride+this.offset+3];return this.normalized&&(e=Ui(e,this.array)),e}setXY(t,e,i){return t=t*this.data.stride+this.offset,this.normalized&&(e=we(e,this.array),i=we(i,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=i,this}setXYZ(t,e,i,s){return t=t*this.data.stride+this.offset,this.normalized&&(e=we(e,this.array),i=we(i,this.array),s=we(s,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=i,this.data.array[t+2]=s,this}setXYZW(t,e,i,s,r){return t=t*this.data.stride+this.offset,this.normalized&&(e=we(e,this.array),i=we(i,this.array),s=we(s,this.array),r=we(r,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=i,this.data.array[t+2]=s,this.data.array[t+3]=r,this}clone(t){if(t===void 0){console.log("THREE.InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.");const e=[];for(let i=0;i<this.count;i++){const s=i*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)e.push(this.data.array[s+r])}return new qt(new this.array.constructor(e),this.itemSize,this.normalized)}else return t.interleavedBuffers===void 0&&(t.interleavedBuffers={}),t.interleavedBuffers[this.data.uuid]===void 0&&(t.interleavedBuffers[this.data.uuid]=this.data.clone(t)),new ah(t.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(t){if(t===void 0){console.log("THREE.InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.");const e=[];for(let i=0;i<this.count;i++){const s=i*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)e.push(this.data.array[s+r])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:e,normalized:this.normalized}}else return t.interleavedBuffers===void 0&&(t.interleavedBuffers={}),t.interleavedBuffers[this.data.uuid]===void 0&&(t.interleavedBuffers[this.data.uuid]=this.data.toJSON(t)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}}class od extends Kr{constructor(t){super(),this.isSpriteMaterial=!0,this.type="SpriteMaterial",this.color=new gt(16777215),this.map=null,this.alphaMap=null,this.rotation=0,this.sizeAttenuation=!0,this.transparent=!0,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.alphaMap=t.alphaMap,this.rotation=t.rotation,this.sizeAttenuation=t.sizeAttenuation,this.fog=t.fog,this}}let ma;const Fo=new C,ga=new C,va=new C,xa=new ht,No=new ht,Wg=new se,al=new C,ko=new C,ol=new C,U1=new ht,p0=new ht,F1=new ht;class Xg extends Ge{constructor(t=new od){if(super(),this.isSprite=!0,this.type="Sprite",ma===void 0){ma=new Me;const e=new Float32Array([-.5,-.5,0,0,0,.5,-.5,0,1,0,.5,.5,0,1,1,-.5,.5,0,0,1]),i=new __(e,5);ma.setIndex([0,1,2,0,2,3]),ma.setAttribute("position",new ah(i,3,0,!1)),ma.setAttribute("uv",new ah(i,2,3,!1))}this.geometry=ma,this.material=t,this.center=new ht(.5,.5),this.count=1}raycast(t,e){t.camera===null&&console.error('THREE.Sprite: "Raycaster.camera" needs to be set in order to raycast against sprites.'),ga.setFromMatrixScale(this.matrixWorld),Wg.copy(t.camera.matrixWorld),this.modelViewMatrix.multiplyMatrices(t.camera.matrixWorldInverse,this.matrixWorld),va.setFromMatrixPosition(this.modelViewMatrix),t.camera.isPerspectiveCamera&&this.material.sizeAttenuation===!1&&ga.multiplyScalar(-va.z);const i=this.material.rotation;let s,r;i!==0&&(r=Math.cos(i),s=Math.sin(i));const a=this.center;cl(al.set(-.5,-.5,0),va,a,ga,s,r),cl(ko.set(.5,-.5,0),va,a,ga,s,r),cl(ol.set(.5,.5,0),va,a,ga,s,r),U1.set(0,0),p0.set(1,0),F1.set(1,1);let o=t.ray.intersectTriangle(al,ko,ol,!1,Fo);if(o===null&&(cl(ko.set(-.5,.5,0),va,a,ga,s,r),p0.set(0,1),o=t.ray.intersectTriangle(al,ol,ko,!1,Fo),o===null))return;const c=t.ray.origin.distanceTo(Fo);c<t.near||c>t.far||e.push({distance:c,point:Fo.clone(),uv:gi.getInterpolation(Fo,al,ko,ol,U1,p0,F1,new ht),face:null,object:this})}copy(t,e){return super.copy(t,e),t.center!==void 0&&this.center.copy(t.center),this.material=t.material,this}}function cl(n,t,e,i,s,r){xa.subVectors(n,e).addScalar(.5).multiply(i),s!==void 0?(No.x=r*xa.x-s*xa.y,No.y=s*xa.x+r*xa.y):No.copy(xa),n.copy(t),n.x+=No.x,n.y+=No.y,n.applyMatrix4(Wg)}const N1=new C,k1=new fe,O1=new fe,w_=new C,B1=new se,ll=new C,m0=new lr,H1=new se,g0=new rd;class Fc extends nt{constructor(t,e){super(t,e),this.isSkinnedMesh=!0,this.type="SkinnedMesh",this.bindMode=d1,this.bindMatrix=new se,this.bindMatrixInverse=new se,this.boundingBox=null,this.boundingSphere=null}computeBoundingBox(){const t=this.geometry;this.boundingBox===null&&(this.boundingBox=new So),this.boundingBox.makeEmpty();const e=t.getAttribute("position");for(let i=0;i<e.count;i++)this.getVertexPosition(i,ll),this.boundingBox.expandByPoint(ll)}computeBoundingSphere(){const t=this.geometry;this.boundingSphere===null&&(this.boundingSphere=new lr),this.boundingSphere.makeEmpty();const e=t.getAttribute("position");for(let i=0;i<e.count;i++)this.getVertexPosition(i,ll),this.boundingSphere.expandByPoint(ll)}copy(t,e){return super.copy(t,e),this.bindMode=t.bindMode,this.bindMatrix.copy(t.bindMatrix),this.bindMatrixInverse.copy(t.bindMatrixInverse),this.skeleton=t.skeleton,t.boundingBox!==null&&(this.boundingBox=t.boundingBox.clone()),t.boundingSphere!==null&&(this.boundingSphere=t.boundingSphere.clone()),this}raycast(t,e){const i=this.material,s=this.matrixWorld;i!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),m0.copy(this.boundingSphere),m0.applyMatrix4(s),t.ray.intersectsSphere(m0)!==!1&&(H1.copy(s).invert(),g0.copy(t.ray).applyMatrix4(H1),!(this.boundingBox!==null&&g0.intersectsBox(this.boundingBox)===!1)&&this._computeIntersections(t,e,g0)))}getVertexPosition(t,e){return super.getVertexPosition(t,e),this.applyBoneTransform(t,e),e}bind(t,e){this.skeleton=t,e===void 0&&(this.updateMatrixWorld(!0),this.skeleton.calculateInverses(),e=this.matrixWorld),this.bindMatrix.copy(e),this.bindMatrixInverse.copy(e).invert()}pose(){this.skeleton.pose()}normalizeSkinWeights(){const t=new fe,e=this.geometry.attributes.skinWeight;for(let i=0,s=e.count;i<s;i++){t.fromBufferAttribute(e,i);const r=1/t.manhattanLength();r!==1/0?t.multiplyScalar(r):t.set(1,0,0,0),e.setXYZW(i,t.x,t.y,t.z,t.w)}}updateMatrixWorld(t){super.updateMatrixWorld(t),this.bindMode===d1?this.bindMatrixInverse.copy(this.matrixWorld).invert():this.bindMode===gM?this.bindMatrixInverse.copy(this.bindMatrix).invert():console.warn("THREE.SkinnedMesh: Unrecognized bindMode: "+this.bindMode)}applyBoneTransform(t,e){const i=this.skeleton,s=this.geometry;k1.fromBufferAttribute(s.attributes.skinIndex,t),O1.fromBufferAttribute(s.attributes.skinWeight,t),N1.copy(e).applyMatrix4(this.bindMatrix),e.set(0,0,0);for(let r=0;r<4;r++){const a=O1.getComponent(r);if(a!==0){const o=k1.getComponent(r);B1.multiplyMatrices(i.bones[o].matrixWorld,i.boneInverses[o]),e.addScaledVector(w_.copy(N1).applyMatrix4(B1),a)}}return e.applyMatrix4(this.bindMatrixInverse)}}class $g extends Ge{constructor(){super(),this.isBone=!0,this.type="Bone"}}class kr extends un{constructor(t=null,e=1,i=1,s,r,a,o,c,l=si,u=si,h,f){super(null,a,o,c,l,u,s,r,h,f),this.isDataTexture=!0,this.image={data:t,width:e,height:i},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}const z1=new se,b_=new se;class cd{constructor(t=[],e=[]){this.uuid=ki(),this.bones=t.slice(0),this.boneInverses=e,this.boneMatrices=null,this.boneTexture=null,this.init()}init(){const t=this.bones,e=this.boneInverses;if(this.boneMatrices=new Float32Array(t.length*16),e.length===0)this.calculateInverses();else if(t.length!==e.length){console.warn("THREE.Skeleton: Number of inverse bone matrices does not match amount of bones."),this.boneInverses=[];for(let i=0,s=this.bones.length;i<s;i++)this.boneInverses.push(new se)}}calculateInverses(){this.boneInverses.length=0;for(let t=0,e=this.bones.length;t<e;t++){const i=new se;this.bones[t]&&i.copy(this.bones[t].matrixWorld).invert(),this.boneInverses.push(i)}}pose(){for(let t=0,e=this.bones.length;t<e;t++){const i=this.bones[t];i&&i.matrixWorld.copy(this.boneInverses[t]).invert()}for(let t=0,e=this.bones.length;t<e;t++){const i=this.bones[t];i&&(i.parent&&i.parent.isBone?(i.matrix.copy(i.parent.matrixWorld).invert(),i.matrix.multiply(i.matrixWorld)):i.matrix.copy(i.matrixWorld),i.matrix.decompose(i.position,i.quaternion,i.scale))}}update(){const t=this.bones,e=this.boneInverses,i=this.boneMatrices,s=this.boneTexture;for(let r=0,a=t.length;r<a;r++){const o=t[r]?t[r].matrixWorld:b_;z1.multiplyMatrices(o,e[r]),z1.toArray(i,r*16)}s!==null&&(s.needsUpdate=!0)}clone(){return new cd(this.bones,this.boneInverses)}computeBoneTexture(){let t=Math.sqrt(this.bones.length*4);t=Math.ceil(t/4)*4,t=Math.max(t,4);const e=new Float32Array(t*t*4);e.set(this.boneMatrices);const i=new kr(e,t,t,ln,is);return i.needsUpdate=!0,this.boneMatrices=e,this.boneTexture=i,this}getBoneByName(t){for(let e=0,i=this.bones.length;e<i;e++){const s=this.bones[e];if(s.name===t)return s}}dispose(){this.boneTexture!==null&&(this.boneTexture.dispose(),this.boneTexture=null)}fromJSON(t,e){this.uuid=t.uuid;for(let i=0,s=t.bones.length;i<s;i++){const r=t.bones[i];let a=e[r];a===void 0&&(console.warn("THREE.Skeleton: No bone found with UUID:",r),a=new $g),this.bones.push(a),this.boneInverses.push(new se().fromArray(t.boneInverses[i]))}return this.init(),this}toJSON(){const t={metadata:{version:4.7,type:"Skeleton",generator:"Skeleton.toJSON"},bones:[],boneInverses:[]};t.uuid=this.uuid;const e=this.bones,i=this.boneInverses;for(let s=0,r=e.length;s<r;s++){const a=e[s];t.bones.push(a.uuid);const o=i[s];t.boneInverses.push(o.toArray())}return t}}const v0=new C,y_=new C,S_=new le;class Er{constructor(t=new C(1,0,0),e=0){this.isPlane=!0,this.normal=t,this.constant=e}set(t,e){return this.normal.copy(t),this.constant=e,this}setComponents(t,e,i,s){return this.normal.set(t,e,i),this.constant=s,this}setFromNormalAndCoplanarPoint(t,e){return this.normal.copy(t),this.constant=-e.dot(this.normal),this}setFromCoplanarPoints(t,e,i){const s=v0.subVectors(i,e).cross(y_.subVectors(t,e)).normalize();return this.setFromNormalAndCoplanarPoint(s,t),this}copy(t){return this.normal.copy(t.normal),this.constant=t.constant,this}normalize(){const t=1/this.normal.length();return this.normal.multiplyScalar(t),this.constant*=t,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(t){return this.normal.dot(t)+this.constant}distanceToSphere(t){return this.distanceToPoint(t.center)-t.radius}projectPoint(t,e){return e.copy(t).addScaledVector(this.normal,-this.distanceToPoint(t))}intersectLine(t,e){const i=t.delta(v0),s=this.normal.dot(i);if(s===0)return this.distanceToPoint(t.start)===0?e.copy(t.start):null;const r=-(t.start.dot(this.normal)+this.constant)/s;return r<0||r>1?null:e.copy(t.start).addScaledVector(i,r)}intersectsLine(t){const e=this.distanceToPoint(t.start),i=this.distanceToPoint(t.end);return e<0&&i>0||i<0&&e>0}intersectsBox(t){return t.intersectsPlane(this)}intersectsSphere(t){return t.intersectsPlane(this)}coplanarPoint(t){return t.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(t,e){const i=e||S_.getNormalMatrix(t),s=this.coplanarPoint(v0).applyMatrix4(t),r=this.normal.applyMatrix3(i).normalize();return this.constant=-s.dot(r),this}translate(t){return this.constant-=t.dot(this.normal),this}equals(t){return t.normal.equals(this.normal)&&t.constant===this.constant}clone(){return new this.constructor().copy(this)}}const gr=new lr,E_=new ht(.5,.5),hl=new C;class ld{constructor(t=new Er,e=new Er,i=new Er,s=new Er,r=new Er,a=new Er){this.planes=[t,e,i,s,r,a]}set(t,e,i,s,r,a){const o=this.planes;return o[0].copy(t),o[1].copy(e),o[2].copy(i),o[3].copy(s),o[4].copy(r),o[5].copy(a),this}copy(t){const e=this.planes;for(let i=0;i<6;i++)e[i].copy(t.planes[i]);return this}setFromProjectionMatrix(t,e=ss,i=!1){const s=this.planes,r=t.elements,a=r[0],o=r[1],c=r[2],l=r[3],u=r[4],h=r[5],f=r[6],d=r[7],p=r[8],v=r[9],g=r[10],m=r[11],M=r[12],x=r[13],_=r[14],b=r[15];if(s[0].setComponents(l-a,d-u,m-p,b-M).normalize(),s[1].setComponents(l+a,d+u,m+p,b+M).normalize(),s[2].setComponents(l+o,d+h,m+v,b+x).normalize(),s[3].setComponents(l-o,d-h,m-v,b-x).normalize(),i)s[4].setComponents(c,f,g,_).normalize(),s[5].setComponents(l-c,d-f,m-g,b-_).normalize();else if(s[4].setComponents(l-c,d-f,m-g,b-_).normalize(),e===ss)s[5].setComponents(l+c,d+f,m+g,b+_).normalize();else if(e===sh)s[5].setComponents(c,f,g,_).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+e);return this}intersectsObject(t){if(t.boundingSphere!==void 0)t.boundingSphere===null&&t.computeBoundingSphere(),gr.copy(t.boundingSphere).applyMatrix4(t.matrixWorld);else{const e=t.geometry;e.boundingSphere===null&&e.computeBoundingSphere(),gr.copy(e.boundingSphere).applyMatrix4(t.matrixWorld)}return this.intersectsSphere(gr)}intersectsSprite(t){gr.center.set(0,0,0);const e=E_.distanceTo(t.center);return gr.radius=.7071067811865476+e,gr.applyMatrix4(t.matrixWorld),this.intersectsSphere(gr)}intersectsSphere(t){const e=this.planes,i=t.center,s=-t.radius;for(let r=0;r<6;r++)if(e[r].distanceToPoint(i)<s)return!1;return!0}intersectsBox(t){const e=this.planes;for(let i=0;i<6;i++){const s=e[i];if(hl.x=s.normal.x>0?t.max.x:t.min.x,hl.y=s.normal.y>0?t.max.y:t.min.y,hl.z=s.normal.z>0?t.max.z:t.min.z,s.distanceToPoint(hl)<0)return!1}return!0}containsPoint(t){const e=this.planes;for(let i=0;i<6;i++)if(e[i].distanceToPoint(t)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}class T_ extends Kr{constructor(t){super(),this.isPointsMaterial=!0,this.type="PointsMaterial",this.color=new gt(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.alphaMap=t.alphaMap,this.size=t.size,this.sizeAttenuation=t.sizeAttenuation,this.fog=t.fog,this}}const V1=new se,af=new rd,ul=new lr,fl=new C;class A_ extends Ge{constructor(t=new Me,e=new T_){super(),this.isPoints=!0,this.type="Points",this.geometry=t,this.material=e,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}raycast(t,e){const i=this.geometry,s=this.matrixWorld,r=t.params.Points.threshold,a=i.drawRange;if(i.boundingSphere===null&&i.computeBoundingSphere(),ul.copy(i.boundingSphere),ul.applyMatrix4(s),ul.radius+=r,t.ray.intersectsSphere(ul)===!1)return;V1.copy(s).invert(),af.copy(t.ray).applyMatrix4(V1);const o=r/((this.scale.x+this.scale.y+this.scale.z)/3),c=o*o,l=i.index,h=i.attributes.position;if(l!==null){const f=Math.max(0,a.start),d=Math.min(l.count,a.start+a.count);for(let p=f,v=d;p<v;p++){const g=l.getX(p);fl.fromBufferAttribute(h,g),G1(fl,g,c,s,t,e,this)}}else{const f=Math.max(0,a.start),d=Math.min(h.count,a.start+a.count);for(let p=f,v=d;p<v;p++)fl.fromBufferAttribute(h,p),G1(fl,p,c,s,t,e,this)}}updateMorphTargets(){const e=this.geometry.morphAttributes,i=Object.keys(e);if(i.length>0){const s=e[i[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=s.length;r<a;r++){const o=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}}function G1(n,t,e,i,s,r,a){const o=af.distanceSqToPoint(n);if(o<e){const c=new C;af.closestPointToPoint(n,c),c.applyMatrix4(i);const l=s.ray.origin.distanceTo(c);if(l<s.near||l>s.far)return;r.push({distance:l,distanceToRay:Math.sqrt(o),point:c,index:t,face:null,faceIndex:null,barycoord:null,object:a})}}class R_ extends un{constructor(t,e,i,s,r=Pe,a=Pe,o,c,l){super(t,e,i,s,r,a,o,c,l),this.isVideoTexture=!0,this.generateMipmaps=!1,this._requestVideoFrameCallbackId=0;const u=this;function h(){u.needsUpdate=!0,u._requestVideoFrameCallbackId=t.requestVideoFrameCallback(h)}"requestVideoFrameCallback"in t&&(this._requestVideoFrameCallbackId=t.requestVideoFrameCallback(h))}clone(){return new this.constructor(this.image).copy(this)}update(){const t=this.image;"requestVideoFrameCallback"in t===!1&&t.readyState>=t.HAVE_CURRENT_DATA&&(this.needsUpdate=!0)}dispose(){this._requestVideoFrameCallbackId!==0&&this.source.data.cancelVideoFrameCallback(this._requestVideoFrameCallbackId),super.dispose()}}class oh extends un{constructor(t,e,i,s,r,a,o,c,l){super(t,e,i,s,r,a,o,c,l),this.isCanvasTexture=!0,this.needsUpdate=!0}}class qg extends un{constructor(t,e,i=$r,s,r,a,o=si,c=si,l,u=gc,h=1){if(u!==gc&&u!==vc)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");const f={width:t,height:e,depth:h};super(f,s,r,a,o,c,u,i,l),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(t){return super.copy(t),this.source=new id(Object.assign({},t.image)),this.compareFunction=t.compareFunction,this}toJSON(t){const e=super.toJSON(t);return this.compareFunction!==null&&(e.compareFunction=this.compareFunction),e}}class Yg extends un{constructor(t=null){super(),this.sourceTexture=t,this.isExternalTexture=!0}copy(t){return super.copy(t),this.sourceTexture=t.sourceTexture,this}}class Mc extends Me{constructor(t=1,e=1,i=4,s=8,r=1){super(),this.type="CapsuleGeometry",this.parameters={radius:t,height:e,capSegments:i,radialSegments:s,heightSegments:r},e=Math.max(0,e),i=Math.max(1,Math.floor(i)),s=Math.max(3,Math.floor(s)),r=Math.max(1,Math.floor(r));const a=[],o=[],c=[],l=[],u=e/2,h=Math.PI/2*t,f=e,d=2*h+f,p=i*2+r,v=s+1,g=new C,m=new C;for(let M=0;M<=p;M++){let x=0,_=0,b=0,S=0;if(M<=i){const w=M/i,y=w*Math.PI/2;_=-u-t*Math.cos(y),b=t*Math.sin(y),S=-t*Math.cos(y),x=w*h}else if(M<=i+r){const w=(M-i)/r;_=-u+w*e,b=t,S=0,x=h+w*f}else{const w=(M-i-r)/i,y=w*Math.PI/2;_=u+t*Math.sin(y),b=t*Math.cos(y),S=t*Math.sin(y),x=h+f+w*h}const T=Math.max(0,Math.min(1,x/d));let A=0;M===0?A=.5/s:M===p&&(A=-.5/s);for(let w=0;w<=s;w++){const y=w/s,E=y*Math.PI*2,R=Math.sin(E),L=Math.cos(E);m.x=-b*L,m.y=_,m.z=b*R,o.push(m.x,m.y,m.z),g.set(-b*L,S,b*R),g.normalize(),c.push(g.x,g.y,g.z),l.push(y+A,T)}if(M>0){const w=(M-1)*v;for(let y=0;y<s;y++){const E=w+y,R=w+y+1,L=M*v+y,I=M*v+y+1;a.push(E,R,L),a.push(R,I,L)}}}this.setIndex(a),this.setAttribute("position",new ae(o,3)),this.setAttribute("normal",new ae(c,3)),this.setAttribute("uv",new ae(l,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Mc(t.radius,t.height,t.capSegments,t.radialSegments,t.heightSegments)}}class Yr extends Me{constructor(t=1,e=32,i=0,s=Math.PI*2){super(),this.type="CircleGeometry",this.parameters={radius:t,segments:e,thetaStart:i,thetaLength:s},e=Math.max(3,e);const r=[],a=[],o=[],c=[],l=new C,u=new ht;a.push(0,0,0),o.push(0,0,1),c.push(.5,.5);for(let h=0,f=3;h<=e;h++,f+=3){const d=i+h/e*s;l.x=t*Math.cos(d),l.y=t*Math.sin(d),a.push(l.x,l.y,l.z),o.push(0,0,1),u.x=(a[f]/t+1)/2,u.y=(a[f+1]/t+1)/2,c.push(u.x,u.y)}for(let h=1;h<=e;h++)r.push(h,h+1,0);this.setIndex(r),this.setAttribute("position",new ae(a,3)),this.setAttribute("normal",new ae(o,3)),this.setAttribute("uv",new ae(c,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Yr(t.radius,t.segments,t.thetaStart,t.thetaLength)}}class Mn extends Me{constructor(t=1,e=1,i=1,s=32,r=1,a=!1,o=0,c=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:t,radiusBottom:e,height:i,radialSegments:s,heightSegments:r,openEnded:a,thetaStart:o,thetaLength:c};const l=this;s=Math.floor(s),r=Math.floor(r);const u=[],h=[],f=[],d=[];let p=0;const v=[],g=i/2;let m=0;M(),a===!1&&(t>0&&x(!0),e>0&&x(!1)),this.setIndex(u),this.setAttribute("position",new ae(h,3)),this.setAttribute("normal",new ae(f,3)),this.setAttribute("uv",new ae(d,2));function M(){const _=new C,b=new C;let S=0;const T=(e-t)/i;for(let A=0;A<=r;A++){const w=[],y=A/r,E=y*(e-t)+t;for(let R=0;R<=s;R++){const L=R/s,I=L*c+o,N=Math.sin(I),B=Math.cos(I);b.x=E*N,b.y=-y*i+g,b.z=E*B,h.push(b.x,b.y,b.z),_.set(N,T,B).normalize(),f.push(_.x,_.y,_.z),d.push(L,1-y),w.push(p++)}v.push(w)}for(let A=0;A<s;A++)for(let w=0;w<r;w++){const y=v[w][A],E=v[w+1][A],R=v[w+1][A+1],L=v[w][A+1];(t>0||w!==0)&&(u.push(y,E,L),S+=3),(e>0||w!==r-1)&&(u.push(E,R,L),S+=3)}l.addGroup(m,S,0),m+=S}function x(_){const b=p,S=new ht,T=new C;let A=0;const w=_===!0?t:e,y=_===!0?1:-1;for(let R=1;R<=s;R++)h.push(0,g*y,0),f.push(0,y,0),d.push(.5,.5),p++;const E=p;for(let R=0;R<=s;R++){const I=R/s*c+o,N=Math.cos(I),B=Math.sin(I);T.x=w*B,T.y=g*y,T.z=w*N,h.push(T.x,T.y,T.z),f.push(0,y,0),S.x=N*.5+.5,S.y=B*.5*y+.5,d.push(S.x,S.y),p++}for(let R=0;R<s;R++){const L=b+R,I=E+R;_===!0?u.push(I,I+1,L):u.push(I+1,I,L),A+=3}l.addGroup(m,A,_===!0?1:2),m+=A}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Mn(t.radiusTop,t.radiusBottom,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}}class ri extends Mn{constructor(t=1,e=1,i=32,s=1,r=!1,a=0,o=Math.PI*2){super(0,t,e,i,s,r,a,o),this.type="ConeGeometry",this.parameters={radius:t,height:e,radialSegments:i,heightSegments:s,openEnded:r,thetaStart:a,thetaLength:o}}static fromJSON(t){return new ri(t.radius,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}}class ls{constructor(){this.type="Curve",this.arcLengthDivisions=200,this.needsUpdate=!1,this.cacheArcLengths=null}getPoint(){console.warn("THREE.Curve: .getPoint() not implemented.")}getPointAt(t,e){const i=this.getUtoTmapping(t);return this.getPoint(i,e)}getPoints(t=5){const e=[];for(let i=0;i<=t;i++)e.push(this.getPoint(i/t));return e}getSpacedPoints(t=5){const e=[];for(let i=0;i<=t;i++)e.push(this.getPointAt(i/t));return e}getLength(){const t=this.getLengths();return t[t.length-1]}getLengths(t=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===t+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;const e=[];let i,s=this.getPoint(0),r=0;e.push(0);for(let a=1;a<=t;a++)i=this.getPoint(a/t),r+=i.distanceTo(s),e.push(r),s=i;return this.cacheArcLengths=e,e}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(t,e=null){const i=this.getLengths();let s=0;const r=i.length;let a;e?a=e:a=t*i[r-1];let o=0,c=r-1,l;for(;o<=c;)if(s=Math.floor(o+(c-o)/2),l=i[s]-a,l<0)o=s+1;else if(l>0)c=s-1;else{c=s;break}if(s=c,i[s]===a)return s/(r-1);const u=i[s],f=i[s+1]-u,d=(a-u)/f;return(s+d)/(r-1)}getTangent(t,e){let s=t-1e-4,r=t+1e-4;s<0&&(s=0),r>1&&(r=1);const a=this.getPoint(s),o=this.getPoint(r),c=e||(a.isVector2?new ht:new C);return c.copy(o).sub(a).normalize(),c}getTangentAt(t,e){const i=this.getUtoTmapping(t);return this.getTangent(i,e)}computeFrenetFrames(t,e=!1){const i=new C,s=[],r=[],a=[],o=new C,c=new se;for(let d=0;d<=t;d++){const p=d/t;s[d]=this.getTangentAt(p,new C)}r[0]=new C,a[0]=new C;let l=Number.MAX_VALUE;const u=Math.abs(s[0].x),h=Math.abs(s[0].y),f=Math.abs(s[0].z);u<=l&&(l=u,i.set(1,0,0)),h<=l&&(l=h,i.set(0,1,0)),f<=l&&i.set(0,0,1),o.crossVectors(s[0],i).normalize(),r[0].crossVectors(s[0],o),a[0].crossVectors(s[0],r[0]);for(let d=1;d<=t;d++){if(r[d]=r[d-1].clone(),a[d]=a[d-1].clone(),o.crossVectors(s[d-1],s[d]),o.length()>Number.EPSILON){o.normalize();const p=Math.acos(ne(s[d-1].dot(s[d]),-1,1));r[d].applyMatrix4(c.makeRotationAxis(o,p))}a[d].crossVectors(s[d],r[d])}if(e===!0){let d=Math.acos(ne(r[0].dot(r[t]),-1,1));d/=t,s[0].dot(o.crossVectors(r[0],r[t]))>0&&(d=-d);for(let p=1;p<=t;p++)r[p].applyMatrix4(c.makeRotationAxis(s[p],d*p)),a[p].crossVectors(s[p],r[p])}return{tangents:s,normals:r,binormals:a}}clone(){return new this.constructor().copy(this)}copy(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}toJSON(){const t={metadata:{version:4.7,type:"Curve",generator:"Curve.toJSON"}};return t.arcLengthDivisions=this.arcLengthDivisions,t.type=this.type,t}fromJSON(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}}class hd extends ls{constructor(t=0,e=0,i=1,s=1,r=0,a=Math.PI*2,o=!1,c=0){super(),this.isEllipseCurve=!0,this.type="EllipseCurve",this.aX=t,this.aY=e,this.xRadius=i,this.yRadius=s,this.aStartAngle=r,this.aEndAngle=a,this.aClockwise=o,this.aRotation=c}getPoint(t,e=new ht){const i=e,s=Math.PI*2;let r=this.aEndAngle-this.aStartAngle;const a=Math.abs(r)<Number.EPSILON;for(;r<0;)r+=s;for(;r>s;)r-=s;r<Number.EPSILON&&(a?r=0:r=s),this.aClockwise===!0&&!a&&(r===s?r=-s:r=r-s);const o=this.aStartAngle+t*r;let c=this.aX+this.xRadius*Math.cos(o),l=this.aY+this.yRadius*Math.sin(o);if(this.aRotation!==0){const u=Math.cos(this.aRotation),h=Math.sin(this.aRotation),f=c-this.aX,d=l-this.aY;c=f*u-d*h+this.aX,l=f*h+d*u+this.aY}return i.set(c,l)}copy(t){return super.copy(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}toJSON(){const t=super.toJSON();return t.aX=this.aX,t.aY=this.aY,t.xRadius=this.xRadius,t.yRadius=this.yRadius,t.aStartAngle=this.aStartAngle,t.aEndAngle=this.aEndAngle,t.aClockwise=this.aClockwise,t.aRotation=this.aRotation,t}fromJSON(t){return super.fromJSON(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}}class C_ extends hd{constructor(t,e,i,s,r,a){super(t,e,i,i,s,r,a),this.isArcCurve=!0,this.type="ArcCurve"}}function ud(){let n=0,t=0,e=0,i=0;function s(r,a,o,c){n=r,t=o,e=-3*r+3*a-2*o-c,i=2*r-2*a+o+c}return{initCatmullRom:function(r,a,o,c,l){s(a,o,l*(o-r),l*(c-a))},initNonuniformCatmullRom:function(r,a,o,c,l,u,h){let f=(a-r)/l-(o-r)/(l+u)+(o-a)/u,d=(o-a)/u-(c-a)/(u+h)+(c-o)/h;f*=u,d*=u,s(a,o,f,d)},calc:function(r){const a=r*r,o=a*r;return n+t*r+e*a+i*o}}}const dl=new C,x0=new ud,M0=new ud,_0=new ud;class Mi extends ls{constructor(t=[],e=!1,i="centripetal",s=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=t,this.closed=e,this.curveType=i,this.tension=s}getPoint(t,e=new C){const i=e,s=this.points,r=s.length,a=(r-(this.closed?0:1))*t;let o=Math.floor(a),c=a-o;this.closed?o+=o>0?0:(Math.floor(Math.abs(o)/r)+1)*r:c===0&&o===r-1&&(o=r-2,c=1);let l,u;this.closed||o>0?l=s[(o-1)%r]:(dl.subVectors(s[0],s[1]).add(s[0]),l=dl);const h=s[o%r],f=s[(o+1)%r];if(this.closed||o+2<r?u=s[(o+2)%r]:(dl.subVectors(s[r-1],s[r-2]).add(s[r-1]),u=dl),this.curveType==="centripetal"||this.curveType==="chordal"){const d=this.curveType==="chordal"?.5:.25;let p=Math.pow(l.distanceToSquared(h),d),v=Math.pow(h.distanceToSquared(f),d),g=Math.pow(f.distanceToSquared(u),d);v<1e-4&&(v=1),p<1e-4&&(p=v),g<1e-4&&(g=v),x0.initNonuniformCatmullRom(l.x,h.x,f.x,u.x,p,v,g),M0.initNonuniformCatmullRom(l.y,h.y,f.y,u.y,p,v,g),_0.initNonuniformCatmullRom(l.z,h.z,f.z,u.z,p,v,g)}else this.curveType==="catmullrom"&&(x0.initCatmullRom(l.x,h.x,f.x,u.x,this.tension),M0.initCatmullRom(l.y,h.y,f.y,u.y,this.tension),_0.initCatmullRom(l.z,h.z,f.z,u.z,this.tension));return i.set(x0.calc(c),M0.calc(c),_0.calc(c)),i}copy(t){super.copy(t),this.points=[];for(let e=0,i=t.points.length;e<i;e++){const s=t.points[e];this.points.push(s.clone())}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}toJSON(){const t=super.toJSON();t.points=[];for(let e=0,i=this.points.length;e<i;e++){const s=this.points[e];t.points.push(s.toArray())}return t.closed=this.closed,t.curveType=this.curveType,t.tension=this.tension,t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,i=t.points.length;e<i;e++){const s=t.points[e];this.points.push(new C().fromArray(s))}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}}function W1(n,t,e,i,s){const r=(i-t)*.5,a=(s-e)*.5,o=n*n,c=n*o;return(2*e-2*i+r+a)*c+(-3*e+3*i-2*r-a)*o+r*n+e}function L_(n,t){const e=1-n;return e*e*t}function P_(n,t){return 2*(1-n)*n*t}function I_(n,t){return n*n*t}function rc(n,t,e,i){return L_(n,t)+P_(n,e)+I_(n,i)}function D_(n,t){const e=1-n;return e*e*e*t}function U_(n,t){const e=1-n;return 3*e*e*n*t}function F_(n,t){return 3*(1-n)*n*n*t}function N_(n,t){return n*n*n*t}function ac(n,t,e,i,s){return D_(n,t)+U_(n,e)+F_(n,i)+N_(n,s)}class jg extends ls{constructor(t=new ht,e=new ht,i=new ht,s=new ht){super(),this.isCubicBezierCurve=!0,this.type="CubicBezierCurve",this.v0=t,this.v1=e,this.v2=i,this.v3=s}getPoint(t,e=new ht){const i=e,s=this.v0,r=this.v1,a=this.v2,o=this.v3;return i.set(ac(t,s.x,r.x,a.x,o.x),ac(t,s.y,r.y,a.y,o.y)),i}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}}class k_ extends ls{constructor(t=new C,e=new C,i=new C,s=new C){super(),this.isCubicBezierCurve3=!0,this.type="CubicBezierCurve3",this.v0=t,this.v1=e,this.v2=i,this.v3=s}getPoint(t,e=new C){const i=e,s=this.v0,r=this.v1,a=this.v2,o=this.v3;return i.set(ac(t,s.x,r.x,a.x,o.x),ac(t,s.y,r.y,a.y,o.y),ac(t,s.z,r.z,a.z,o.z)),i}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}}class Zg extends ls{constructor(t=new ht,e=new ht){super(),this.isLineCurve=!0,this.type="LineCurve",this.v1=t,this.v2=e}getPoint(t,e=new ht){const i=e;return t===1?i.copy(this.v2):(i.copy(this.v2).sub(this.v1),i.multiplyScalar(t).add(this.v1)),i}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new ht){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class O_ extends ls{constructor(t=new C,e=new C){super(),this.isLineCurve3=!0,this.type="LineCurve3",this.v1=t,this.v2=e}getPoint(t,e=new C){const i=e;return t===1?i.copy(this.v2):(i.copy(this.v2).sub(this.v1),i.multiplyScalar(t).add(this.v1)),i}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new C){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class Jg extends ls{constructor(t=new ht,e=new ht,i=new ht){super(),this.isQuadraticBezierCurve=!0,this.type="QuadraticBezierCurve",this.v0=t,this.v1=e,this.v2=i}getPoint(t,e=new ht){const i=e,s=this.v0,r=this.v1,a=this.v2;return i.set(rc(t,s.x,r.x,a.x),rc(t,s.y,r.y,a.y)),i}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class Kg extends ls{constructor(t=new C,e=new C,i=new C){super(),this.isQuadraticBezierCurve3=!0,this.type="QuadraticBezierCurve3",this.v0=t,this.v1=e,this.v2=i}getPoint(t,e=new C){const i=e,s=this.v0,r=this.v1,a=this.v2;return i.set(rc(t,s.x,r.x,a.x),rc(t,s.y,r.y,a.y),rc(t,s.z,r.z,a.z)),i}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class Qg extends ls{constructor(t=[]){super(),this.isSplineCurve=!0,this.type="SplineCurve",this.points=t}getPoint(t,e=new ht){const i=e,s=this.points,r=(s.length-1)*t,a=Math.floor(r),o=r-a,c=s[a===0?a:a-1],l=s[a],u=s[a>s.length-2?s.length-1:a+1],h=s[a>s.length-3?s.length-1:a+2];return i.set(W1(o,c.x,l.x,u.x,h.x),W1(o,c.y,l.y,u.y,h.y)),i}copy(t){super.copy(t),this.points=[];for(let e=0,i=t.points.length;e<i;e++){const s=t.points[e];this.points.push(s.clone())}return this}toJSON(){const t=super.toJSON();t.points=[];for(let e=0,i=this.points.length;e<i;e++){const s=this.points[e];t.points.push(s.toArray())}return t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,i=t.points.length;e<i;e++){const s=t.points[e];this.points.push(new ht().fromArray(s))}return this}}var ch=Object.freeze({__proto__:null,ArcCurve:C_,CatmullRomCurve3:Mi,CubicBezierCurve:jg,CubicBezierCurve3:k_,EllipseCurve:hd,LineCurve:Zg,LineCurve3:O_,QuadraticBezierCurve:Jg,QuadraticBezierCurve3:Kg,SplineCurve:Qg});class B_ extends ls{constructor(){super(),this.type="CurvePath",this.curves=[],this.autoClose=!1}add(t){this.curves.push(t)}closePath(){const t=this.curves[0].getPoint(0),e=this.curves[this.curves.length-1].getPoint(1);if(!t.equals(e)){const i=t.isVector2===!0?"LineCurve":"LineCurve3";this.curves.push(new ch[i](e,t))}return this}getPoint(t,e){const i=t*this.getLength(),s=this.getCurveLengths();let r=0;for(;r<s.length;){if(s[r]>=i){const a=s[r]-i,o=this.curves[r],c=o.getLength(),l=c===0?0:1-a/c;return o.getPointAt(l,e)}r++}return null}getLength(){const t=this.getCurveLengths();return t[t.length-1]}updateArcLengths(){this.needsUpdate=!0,this.cacheLengths=null,this.getCurveLengths()}getCurveLengths(){if(this.cacheLengths&&this.cacheLengths.length===this.curves.length)return this.cacheLengths;const t=[];let e=0;for(let i=0,s=this.curves.length;i<s;i++)e+=this.curves[i].getLength(),t.push(e);return this.cacheLengths=t,t}getSpacedPoints(t=40){const e=[];for(let i=0;i<=t;i++)e.push(this.getPoint(i/t));return this.autoClose&&e.push(e[0]),e}getPoints(t=12){const e=[];let i;for(let s=0,r=this.curves;s<r.length;s++){const a=r[s],o=a.isEllipseCurve?t*2:a.isLineCurve||a.isLineCurve3?1:a.isSplineCurve?t*a.points.length:t,c=a.getPoints(o);for(let l=0;l<c.length;l++){const u=c[l];i&&i.equals(u)||(e.push(u),i=u)}}return this.autoClose&&e.length>1&&!e[e.length-1].equals(e[0])&&e.push(e[0]),e}copy(t){super.copy(t),this.curves=[];for(let e=0,i=t.curves.length;e<i;e++){const s=t.curves[e];this.curves.push(s.clone())}return this.autoClose=t.autoClose,this}toJSON(){const t=super.toJSON();t.autoClose=this.autoClose,t.curves=[];for(let e=0,i=this.curves.length;e<i;e++){const s=this.curves[e];t.curves.push(s.toJSON())}return t}fromJSON(t){super.fromJSON(t),this.autoClose=t.autoClose,this.curves=[];for(let e=0,i=t.curves.length;e<i;e++){const s=t.curves[e];this.curves.push(new ch[s.type]().fromJSON(s))}return this}}class X1 extends B_{constructor(t){super(),this.type="Path",this.currentPoint=new ht,t&&this.setFromPoints(t)}setFromPoints(t){this.moveTo(t[0].x,t[0].y);for(let e=1,i=t.length;e<i;e++)this.lineTo(t[e].x,t[e].y);return this}moveTo(t,e){return this.currentPoint.set(t,e),this}lineTo(t,e){const i=new Zg(this.currentPoint.clone(),new ht(t,e));return this.curves.push(i),this.currentPoint.set(t,e),this}quadraticCurveTo(t,e,i,s){const r=new Jg(this.currentPoint.clone(),new ht(t,e),new ht(i,s));return this.curves.push(r),this.currentPoint.set(i,s),this}bezierCurveTo(t,e,i,s,r,a){const o=new jg(this.currentPoint.clone(),new ht(t,e),new ht(i,s),new ht(r,a));return this.curves.push(o),this.currentPoint.set(r,a),this}splineThru(t){const e=[this.currentPoint.clone()].concat(t),i=new Qg(e);return this.curves.push(i),this.currentPoint.copy(t[t.length-1]),this}arc(t,e,i,s,r,a){const o=this.currentPoint.x,c=this.currentPoint.y;return this.absarc(t+o,e+c,i,s,r,a),this}absarc(t,e,i,s,r,a){return this.absellipse(t,e,i,i,s,r,a),this}ellipse(t,e,i,s,r,a,o,c){const l=this.currentPoint.x,u=this.currentPoint.y;return this.absellipse(t+l,e+u,i,s,r,a,o,c),this}absellipse(t,e,i,s,r,a,o,c){const l=new hd(t,e,i,s,r,a,o,c);if(this.curves.length>0){const h=l.getPoint(0);h.equals(this.currentPoint)||this.lineTo(h.x,h.y)}this.curves.push(l);const u=l.getPoint(1);return this.currentPoint.copy(u),this}copy(t){return super.copy(t),this.currentPoint.copy(t.currentPoint),this}toJSON(){const t=super.toJSON();return t.currentPoint=this.currentPoint.toArray(),t}fromJSON(t){return super.fromJSON(t),this.currentPoint.fromArray(t.currentPoint),this}}class fd extends X1{constructor(t){super(t),this.uuid=ki(),this.type="Shape",this.holes=[]}getPointsHoles(t){const e=[];for(let i=0,s=this.holes.length;i<s;i++)e[i]=this.holes[i].getPoints(t);return e}extractPoints(t){return{shape:this.getPoints(t),holes:this.getPointsHoles(t)}}copy(t){super.copy(t),this.holes=[];for(let e=0,i=t.holes.length;e<i;e++){const s=t.holes[e];this.holes.push(s.clone())}return this}toJSON(){const t=super.toJSON();t.uuid=this.uuid,t.holes=[];for(let e=0,i=this.holes.length;e<i;e++){const s=this.holes[e];t.holes.push(s.toJSON())}return t}fromJSON(t){super.fromJSON(t),this.uuid=t.uuid,this.holes=[];for(let e=0,i=t.holes.length;e<i;e++){const s=t.holes[e];this.holes.push(new X1().fromJSON(s))}return this}}function H_(n,t,e=2){const i=t&&t.length,s=i?t[0]*e:n.length;let r=t2(n,0,s,e,!0);const a=[];if(!r||r.next===r.prev)return a;let o,c,l;if(i&&(r=X_(n,t,r,e)),n.length>80*e){o=1/0,c=1/0;let u=-1/0,h=-1/0;for(let f=e;f<s;f+=e){const d=n[f],p=n[f+1];d<o&&(o=d),p<c&&(c=p),d>u&&(u=d),p>h&&(h=p)}l=Math.max(u-o,h-c),l=l!==0?32767/l:0}return _c(r,a,e,o,c,l,0),a}function t2(n,t,e,i,s){let r;if(s===n3(n,t,e,i)>0)for(let a=t;a<e;a+=i)r=$1(a/i|0,n[a],n[a+1],r);else for(let a=e-i;a>=t;a-=i)r=$1(a/i|0,n[a],n[a+1],r);return r&&mo(r,r.next)&&(bc(r),r=r.next),r}function jr(n,t){if(!n)return n;t||(t=n);let e=n,i;do if(i=!1,!e.steiner&&(mo(e,e.next)||Oe(e.prev,e,e.next)===0)){if(bc(e),e=t=e.prev,e===e.next)break;i=!0}else e=e.next;while(i||e!==t);return t}function _c(n,t,e,i,s,r,a){if(!n)return;!a&&r&&Z_(n,i,s,r);let o=n;for(;n.prev!==n.next;){const c=n.prev,l=n.next;if(r?V_(n,i,s,r):z_(n)){t.push(c.i,n.i,l.i),bc(n),n=l.next,o=l.next;continue}if(n=l,n===o){a?a===1?(n=G_(jr(n),t),_c(n,t,e,i,s,r,2)):a===2&&W_(n,t,e,i,s,r):_c(jr(n),t,e,i,s,r,1);break}}}function z_(n){const t=n.prev,e=n,i=n.next;if(Oe(t,e,i)>=0)return!1;const s=t.x,r=e.x,a=i.x,o=t.y,c=e.y,l=i.y,u=Math.min(s,r,a),h=Math.min(o,c,l),f=Math.max(s,r,a),d=Math.max(o,c,l);let p=i.next;for(;p!==t;){if(p.x>=u&&p.x<=f&&p.y>=h&&p.y<=d&&Ko(s,o,r,c,a,l,p.x,p.y)&&Oe(p.prev,p,p.next)>=0)return!1;p=p.next}return!0}function V_(n,t,e,i){const s=n.prev,r=n,a=n.next;if(Oe(s,r,a)>=0)return!1;const o=s.x,c=r.x,l=a.x,u=s.y,h=r.y,f=a.y,d=Math.min(o,c,l),p=Math.min(u,h,f),v=Math.max(o,c,l),g=Math.max(u,h,f),m=of(d,p,t,e,i),M=of(v,g,t,e,i);let x=n.prevZ,_=n.nextZ;for(;x&&x.z>=m&&_&&_.z<=M;){if(x.x>=d&&x.x<=v&&x.y>=p&&x.y<=g&&x!==s&&x!==a&&Ko(o,u,c,h,l,f,x.x,x.y)&&Oe(x.prev,x,x.next)>=0||(x=x.prevZ,_.x>=d&&_.x<=v&&_.y>=p&&_.y<=g&&_!==s&&_!==a&&Ko(o,u,c,h,l,f,_.x,_.y)&&Oe(_.prev,_,_.next)>=0))return!1;_=_.nextZ}for(;x&&x.z>=m;){if(x.x>=d&&x.x<=v&&x.y>=p&&x.y<=g&&x!==s&&x!==a&&Ko(o,u,c,h,l,f,x.x,x.y)&&Oe(x.prev,x,x.next)>=0)return!1;x=x.prevZ}for(;_&&_.z<=M;){if(_.x>=d&&_.x<=v&&_.y>=p&&_.y<=g&&_!==s&&_!==a&&Ko(o,u,c,h,l,f,_.x,_.y)&&Oe(_.prev,_,_.next)>=0)return!1;_=_.nextZ}return!0}function G_(n,t){let e=n;do{const i=e.prev,s=e.next.next;!mo(i,s)&&n2(i,e,e.next,s)&&wc(i,s)&&wc(s,i)&&(t.push(i.i,e.i,s.i),bc(e),bc(e.next),e=n=s),e=e.next}while(e!==n);return jr(e)}function W_(n,t,e,i,s,r){let a=n;do{let o=a.next.next;for(;o!==a.prev;){if(a.i!==o.i&&Q_(a,o)){let c=i2(a,o);a=jr(a,a.next),c=jr(c,c.next),_c(a,t,e,i,s,r,0),_c(c,t,e,i,s,r,0);return}o=o.next}a=a.next}while(a!==n)}function X_(n,t,e,i){const s=[];for(let r=0,a=t.length;r<a;r++){const o=t[r]*i,c=r<a-1?t[r+1]*i:n.length,l=t2(n,o,c,i,!1);l===l.next&&(l.steiner=!0),s.push(K_(l))}s.sort($_);for(let r=0;r<s.length;r++)e=q_(s[r],e);return e}function $_(n,t){let e=n.x-t.x;if(e===0&&(e=n.y-t.y,e===0)){const i=(n.next.y-n.y)/(n.next.x-n.x),s=(t.next.y-t.y)/(t.next.x-t.x);e=i-s}return e}function q_(n,t){const e=Y_(n,t);if(!e)return t;const i=i2(e,n);return jr(i,i.next),jr(e,e.next)}function Y_(n,t){let e=t;const i=n.x,s=n.y;let r=-1/0,a;if(mo(n,e))return e;do{if(mo(n,e.next))return e.next;if(s<=e.y&&s>=e.next.y&&e.next.y!==e.y){const h=e.x+(s-e.y)*(e.next.x-e.x)/(e.next.y-e.y);if(h<=i&&h>r&&(r=h,a=e.x<e.next.x?e:e.next,h===i))return a}e=e.next}while(e!==t);if(!a)return null;const o=a,c=a.x,l=a.y;let u=1/0;e=a;do{if(i>=e.x&&e.x>=c&&i!==e.x&&e2(s<l?i:r,s,c,l,s<l?r:i,s,e.x,e.y)){const h=Math.abs(s-e.y)/(i-e.x);wc(e,n)&&(h<u||h===u&&(e.x>a.x||e.x===a.x&&j_(a,e)))&&(a=e,u=h)}e=e.next}while(e!==o);return a}function j_(n,t){return Oe(n.prev,n,t.prev)<0&&Oe(t.next,n,n.next)<0}function Z_(n,t,e,i){let s=n;do s.z===0&&(s.z=of(s.x,s.y,t,e,i)),s.prevZ=s.prev,s.nextZ=s.next,s=s.next;while(s!==n);s.prevZ.nextZ=null,s.prevZ=null,J_(s)}function J_(n){let t,e=1;do{let i=n,s;n=null;let r=null;for(t=0;i;){t++;let a=i,o=0;for(let l=0;l<e&&(o++,a=a.nextZ,!!a);l++);let c=e;for(;o>0||c>0&&a;)o!==0&&(c===0||!a||i.z<=a.z)?(s=i,i=i.nextZ,o--):(s=a,a=a.nextZ,c--),r?r.nextZ=s:n=s,s.prevZ=r,r=s;i=a}r.nextZ=null,e*=2}while(t>1);return n}function of(n,t,e,i,s){return n=(n-e)*s|0,t=(t-i)*s|0,n=(n|n<<8)&16711935,n=(n|n<<4)&252645135,n=(n|n<<2)&858993459,n=(n|n<<1)&1431655765,t=(t|t<<8)&16711935,t=(t|t<<4)&252645135,t=(t|t<<2)&858993459,t=(t|t<<1)&1431655765,n|t<<1}function K_(n){let t=n,e=n;do(t.x<e.x||t.x===e.x&&t.y<e.y)&&(e=t),t=t.next;while(t!==n);return e}function e2(n,t,e,i,s,r,a,o){return(s-a)*(t-o)>=(n-a)*(r-o)&&(n-a)*(i-o)>=(e-a)*(t-o)&&(e-a)*(r-o)>=(s-a)*(i-o)}function Ko(n,t,e,i,s,r,a,o){return!(n===a&&t===o)&&e2(n,t,e,i,s,r,a,o)}function Q_(n,t){return n.next.i!==t.i&&n.prev.i!==t.i&&!t3(n,t)&&(wc(n,t)&&wc(t,n)&&e3(n,t)&&(Oe(n.prev,n,t.prev)||Oe(n,t.prev,t))||mo(n,t)&&Oe(n.prev,n,n.next)>0&&Oe(t.prev,t,t.next)>0)}function Oe(n,t,e){return(t.y-n.y)*(e.x-t.x)-(t.x-n.x)*(e.y-t.y)}function mo(n,t){return n.x===t.x&&n.y===t.y}function n2(n,t,e,i){const s=ml(Oe(n,t,e)),r=ml(Oe(n,t,i)),a=ml(Oe(e,i,n)),o=ml(Oe(e,i,t));return!!(s!==r&&a!==o||s===0&&pl(n,e,t)||r===0&&pl(n,i,t)||a===0&&pl(e,n,i)||o===0&&pl(e,t,i))}function pl(n,t,e){return t.x<=Math.max(n.x,e.x)&&t.x>=Math.min(n.x,e.x)&&t.y<=Math.max(n.y,e.y)&&t.y>=Math.min(n.y,e.y)}function ml(n){return n>0?1:n<0?-1:0}function t3(n,t){let e=n;do{if(e.i!==n.i&&e.next.i!==n.i&&e.i!==t.i&&e.next.i!==t.i&&n2(e,e.next,n,t))return!0;e=e.next}while(e!==n);return!1}function wc(n,t){return Oe(n.prev,n,n.next)<0?Oe(n,t,n.next)>=0&&Oe(n,n.prev,t)>=0:Oe(n,t,n.prev)<0||Oe(n,n.next,t)<0}function e3(n,t){let e=n,i=!1;const s=(n.x+t.x)/2,r=(n.y+t.y)/2;do e.y>r!=e.next.y>r&&e.next.y!==e.y&&s<(e.next.x-e.x)*(r-e.y)/(e.next.y-e.y)+e.x&&(i=!i),e=e.next;while(e!==n);return i}function i2(n,t){const e=cf(n.i,n.x,n.y),i=cf(t.i,t.x,t.y),s=n.next,r=t.prev;return n.next=t,t.prev=n,e.next=s,s.prev=e,i.next=e,e.prev=i,r.next=i,i.prev=r,i}function $1(n,t,e,i){const s=cf(n,t,e);return i?(s.next=i.next,s.prev=i,i.next.prev=s,i.next=s):(s.prev=s,s.next=s),s}function bc(n){n.next.prev=n.prev,n.prev.next=n.next,n.prevZ&&(n.prevZ.nextZ=n.nextZ),n.nextZ&&(n.nextZ.prevZ=n.prevZ)}function cf(n,t,e){return{i:n,x:t,y:e,prev:null,next:null,z:0,prevZ:null,nextZ:null,steiner:!1}}function n3(n,t,e,i){let s=0;for(let r=t,a=e-i;r<e;r+=i)s+=(n[a]-n[r])*(n[r+1]+n[a+1]),a=r;return s}class i3{static triangulate(t,e,i=2){return H_(t,e,i)}}class Oa{static area(t){const e=t.length;let i=0;for(let s=e-1,r=0;r<e;s=r++)i+=t[s].x*t[r].y-t[r].x*t[s].y;return i*.5}static isClockWise(t){return Oa.area(t)<0}static triangulateShape(t,e){const i=[],s=[],r=[];q1(t),Y1(i,t);let a=t.length;e.forEach(q1);for(let c=0;c<e.length;c++)s.push(a),a+=e[c].length,Y1(i,e[c]);const o=i3.triangulate(i,s);for(let c=0;c<o.length;c+=3)r.push(o.slice(c,c+3));return r}}function q1(n){const t=n.length;t>2&&n[t-1].equals(n[0])&&n.pop()}function Y1(n,t){for(let e=0;e<t.length;e++)n.push(t[e].x),n.push(t[e].y)}class Dh extends Me{constructor(t=new fd([new ht(.5,.5),new ht(-.5,.5),new ht(-.5,-.5),new ht(.5,-.5)]),e={}){super(),this.type="ExtrudeGeometry",this.parameters={shapes:t,options:e},t=Array.isArray(t)?t:[t];const i=this,s=[],r=[];for(let o=0,c=t.length;o<c;o++){const l=t[o];a(l)}this.setAttribute("position",new ae(s,3)),this.setAttribute("uv",new ae(r,2)),this.computeVertexNormals();function a(o){const c=[],l=e.curveSegments!==void 0?e.curveSegments:12,u=e.steps!==void 0?e.steps:1,h=e.depth!==void 0?e.depth:1;let f=e.bevelEnabled!==void 0?e.bevelEnabled:!0,d=e.bevelThickness!==void 0?e.bevelThickness:.2,p=e.bevelSize!==void 0?e.bevelSize:d-.1,v=e.bevelOffset!==void 0?e.bevelOffset:0,g=e.bevelSegments!==void 0?e.bevelSegments:3;const m=e.extrudePath,M=e.UVGenerator!==void 0?e.UVGenerator:s3;let x,_=!1,b,S,T,A;m&&(x=m.getSpacedPoints(u),_=!0,f=!1,b=m.computeFrenetFrames(u,!1),S=new C,T=new C,A=new C),f||(g=0,d=0,p=0,v=0);const w=o.extractPoints(l);let y=w.shape;const E=w.holes;if(!Oa.isClockWise(y)){y=y.reverse();for(let et=0,Q=E.length;et<Q;et++){const rt=E[et];Oa.isClockWise(rt)&&(E[et]=rt.reverse())}}function L(et){const rt=10000000000000001e-36;let ut=et[0];for(let mt=1;mt<=et.length;mt++){const Mt=mt%et.length,wt=et[Mt],ee=wt.x-ut.x,Kt=wt.y-ut.y,k=ee*ee+Kt*Kt,P=Math.max(Math.abs(wt.x),Math.abs(wt.y),Math.abs(ut.x),Math.abs(ut.y)),J=rt*P*P;if(k<=J){et.splice(Mt,1),mt--;continue}ut=wt}}L(y),E.forEach(L);const I=E.length,N=y;for(let et=0;et<I;et++){const Q=E[et];y=y.concat(Q)}function B(et,Q,rt){return Q||console.error("THREE.ExtrudeGeometry: vec does not exist"),et.clone().addScaledVector(Q,rt)}const X=y.length;function H(et,Q,rt){let ut,mt,Mt;const wt=et.x-Q.x,ee=et.y-Q.y,Kt=rt.x-et.x,k=rt.y-et.y,P=wt*wt+ee*ee,J=wt*k-ee*Kt;if(Math.abs(J)>Number.EPSILON){const ft=Math.sqrt(P),_t=Math.sqrt(Kt*Kt+k*k),pt=Q.x-ee/ft,Gt=Q.y+wt/ft,At=rt.x-k/_t,Ht=rt.y+Kt/_t,zt=((At-pt)*k-(Ht-Gt)*Kt)/(wt*k-ee*Kt);ut=pt+wt*zt-et.x,mt=Gt+ee*zt-et.y;const bt=ut*ut+mt*mt;if(bt<=2)return new ht(ut,mt);Mt=Math.sqrt(bt/2)}else{let ft=!1;wt>Number.EPSILON?Kt>Number.EPSILON&&(ft=!0):wt<-Number.EPSILON?Kt<-Number.EPSILON&&(ft=!0):Math.sign(ee)===Math.sign(k)&&(ft=!0),ft?(ut=-ee,mt=wt,Mt=Math.sqrt(P)):(ut=wt,mt=ee,Mt=Math.sqrt(P/2))}return new ht(ut/Mt,mt/Mt)}const Y=[];for(let et=0,Q=N.length,rt=Q-1,ut=et+1;et<Q;et++,rt++,ut++)rt===Q&&(rt=0),ut===Q&&(ut=0),Y[et]=H(N[et],N[rt],N[ut]);const it=[];let dt,vt=Y.concat();for(let et=0,Q=I;et<Q;et++){const rt=E[et];dt=[];for(let ut=0,mt=rt.length,Mt=mt-1,wt=ut+1;ut<mt;ut++,Mt++,wt++)Mt===mt&&(Mt=0),wt===mt&&(wt=0),dt[ut]=H(rt[ut],rt[Mt],rt[wt]);it.push(dt),vt=vt.concat(dt)}let St;if(g===0)St=Oa.triangulateShape(N,E);else{const et=[],Q=[];for(let rt=0;rt<g;rt++){const ut=rt/g,mt=d*Math.cos(ut*Math.PI/2),Mt=p*Math.sin(ut*Math.PI/2)+v;for(let wt=0,ee=N.length;wt<ee;wt++){const Kt=B(N[wt],Y[wt],Mt);W(Kt.x,Kt.y,-mt),ut===0&&et.push(Kt)}for(let wt=0,ee=I;wt<ee;wt++){const Kt=E[wt];dt=it[wt];const k=[];for(let P=0,J=Kt.length;P<J;P++){const ft=B(Kt[P],dt[P],Mt);W(ft.x,ft.y,-mt),ut===0&&k.push(ft)}ut===0&&Q.push(k)}}St=Oa.triangulateShape(et,Q)}const Ct=St.length,Ft=p+v;for(let et=0;et<X;et++){const Q=f?B(y[et],vt[et],Ft):y[et];_?(T.copy(b.normals[0]).multiplyScalar(Q.x),S.copy(b.binormals[0]).multiplyScalar(Q.y),A.copy(x[0]).add(T).add(S),W(A.x,A.y,A.z)):W(Q.x,Q.y,0)}for(let et=1;et<=u;et++)for(let Q=0;Q<X;Q++){const rt=f?B(y[Q],vt[Q],Ft):y[Q];_?(T.copy(b.normals[et]).multiplyScalar(rt.x),S.copy(b.binormals[et]).multiplyScalar(rt.y),A.copy(x[et]).add(T).add(S),W(A.x,A.y,A.z)):W(rt.x,rt.y,h/u*et)}for(let et=g-1;et>=0;et--){const Q=et/g,rt=d*Math.cos(Q*Math.PI/2),ut=p*Math.sin(Q*Math.PI/2)+v;for(let mt=0,Mt=N.length;mt<Mt;mt++){const wt=B(N[mt],Y[mt],ut);W(wt.x,wt.y,h+rt)}for(let mt=0,Mt=E.length;mt<Mt;mt++){const wt=E[mt];dt=it[mt];for(let ee=0,Kt=wt.length;ee<Kt;ee++){const k=B(wt[ee],dt[ee],ut);_?W(k.x,k.y+x[u-1].y,x[u-1].x+rt):W(k.x,k.y,h+rt)}}}V(),$();function V(){const et=s.length/3;if(f){let Q=0,rt=X*Q;for(let ut=0;ut<Ct;ut++){const mt=St[ut];G(mt[2]+rt,mt[1]+rt,mt[0]+rt)}Q=u+g*2,rt=X*Q;for(let ut=0;ut<Ct;ut++){const mt=St[ut];G(mt[0]+rt,mt[1]+rt,mt[2]+rt)}}else{for(let Q=0;Q<Ct;Q++){const rt=St[Q];G(rt[2],rt[1],rt[0])}for(let Q=0;Q<Ct;Q++){const rt=St[Q];G(rt[0]+X*u,rt[1]+X*u,rt[2]+X*u)}}i.addGroup(et,s.length/3-et,0)}function $(){const et=s.length/3;let Q=0;z(N,Q),Q+=N.length;for(let rt=0,ut=E.length;rt<ut;rt++){const mt=E[rt];z(mt,Q),Q+=mt.length}i.addGroup(et,s.length/3-et,1)}function z(et,Q){let rt=et.length;for(;--rt>=0;){const ut=rt;let mt=rt-1;mt<0&&(mt=et.length-1);for(let Mt=0,wt=u+g*2;Mt<wt;Mt++){const ee=X*Mt,Kt=X*(Mt+1),k=Q+ut+ee,P=Q+mt+ee,J=Q+mt+Kt,ft=Q+ut+Kt;tt(k,P,J,ft)}}}function W(et,Q,rt){c.push(et),c.push(Q),c.push(rt)}function G(et,Q,rt){ot(et),ot(Q),ot(rt);const ut=s.length/3,mt=M.generateTopUV(i,s,ut-3,ut-2,ut-1);F(mt[0]),F(mt[1]),F(mt[2])}function tt(et,Q,rt,ut){ot(et),ot(Q),ot(ut),ot(Q),ot(rt),ot(ut);const mt=s.length/3,Mt=M.generateSideWallUV(i,s,mt-6,mt-3,mt-2,mt-1);F(Mt[0]),F(Mt[1]),F(Mt[3]),F(Mt[1]),F(Mt[2]),F(Mt[3])}function ot(et){s.push(c[et*3+0]),s.push(c[et*3+1]),s.push(c[et*3+2])}function F(et){r.push(et.x),r.push(et.y)}}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}toJSON(){const t=super.toJSON(),e=this.parameters.shapes,i=this.parameters.options;return r3(e,i,t)}static fromJSON(t,e){const i=[];for(let r=0,a=t.shapes.length;r<a;r++){const o=e[t.shapes[r]];i.push(o)}const s=t.options.extrudePath;return s!==void 0&&(t.options.extrudePath=new ch[s.type]().fromJSON(s)),new Dh(i,t.options)}}const s3={generateTopUV:function(n,t,e,i,s){const r=t[e*3],a=t[e*3+1],o=t[i*3],c=t[i*3+1],l=t[s*3],u=t[s*3+1];return[new ht(r,a),new ht(o,c),new ht(l,u)]},generateSideWallUV:function(n,t,e,i,s,r){const a=t[e*3],o=t[e*3+1],c=t[e*3+2],l=t[i*3],u=t[i*3+1],h=t[i*3+2],f=t[s*3],d=t[s*3+1],p=t[s*3+2],v=t[r*3],g=t[r*3+1],m=t[r*3+2];return Math.abs(o-u)<Math.abs(a-l)?[new ht(a,1-c),new ht(l,1-h),new ht(f,1-p),new ht(v,1-m)]:[new ht(o,1-c),new ht(u,1-h),new ht(d,1-p),new ht(g,1-m)]}};function r3(n,t,e){if(e.shapes=[],Array.isArray(n))for(let i=0,s=n.length;i<s;i++){const r=n[i];e.shapes.push(r.uuid)}else e.shapes.push(n.uuid);return e.options=Object.assign({},t),t.extrudePath!==void 0&&(e.options.extrudePath=t.extrudePath.toJSON()),e}class zi extends Me{constructor(t=[new ht(0,-.5),new ht(.5,0),new ht(0,.5)],e=12,i=0,s=Math.PI*2){super(),this.type="LatheGeometry",this.parameters={points:t,segments:e,phiStart:i,phiLength:s},e=Math.floor(e),s=ne(s,0,Math.PI*2);const r=[],a=[],o=[],c=[],l=[],u=1/e,h=new C,f=new ht,d=new C,p=new C,v=new C;let g=0,m=0;for(let M=0;M<=t.length-1;M++)switch(M){case 0:g=t[M+1].x-t[M].x,m=t[M+1].y-t[M].y,d.x=m*1,d.y=-g,d.z=m*0,v.copy(d),d.normalize(),c.push(d.x,d.y,d.z);break;case t.length-1:c.push(v.x,v.y,v.z);break;default:g=t[M+1].x-t[M].x,m=t[M+1].y-t[M].y,d.x=m*1,d.y=-g,d.z=m*0,p.copy(d),d.x+=v.x,d.y+=v.y,d.z+=v.z,d.normalize(),c.push(d.x,d.y,d.z),v.copy(p)}for(let M=0;M<=e;M++){const x=i+M*u*s,_=Math.sin(x),b=Math.cos(x);for(let S=0;S<=t.length-1;S++){h.x=t[S].x*_,h.y=t[S].y,h.z=t[S].x*b,a.push(h.x,h.y,h.z),f.x=M/e,f.y=S/(t.length-1),o.push(f.x,f.y);const T=c[3*S+0]*_,A=c[3*S+1],w=c[3*S+0]*b;l.push(T,A,w)}}for(let M=0;M<e;M++)for(let x=0;x<t.length-1;x++){const _=x+M*t.length,b=_,S=_+t.length,T=_+t.length+1,A=_+1;r.push(b,S,A),r.push(T,A,S)}this.setIndex(r),this.setAttribute("position",new ae(a,3)),this.setAttribute("uv",new ae(o,2)),this.setAttribute("normal",new ae(l,3))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new zi(t.points,t.segments,t.phiStart,t.phiLength)}}class _i extends Me{constructor(t=1,e=1,i=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:t,height:e,widthSegments:i,heightSegments:s};const r=t/2,a=e/2,o=Math.floor(i),c=Math.floor(s),l=o+1,u=c+1,h=t/o,f=e/c,d=[],p=[],v=[],g=[];for(let m=0;m<u;m++){const M=m*f-a;for(let x=0;x<l;x++){const _=x*h-r;p.push(_,-M,0),v.push(0,0,1),g.push(x/o),g.push(1-m/c)}}for(let m=0;m<c;m++)for(let M=0;M<o;M++){const x=M+l*m,_=M+l*(m+1),b=M+1+l*(m+1),S=M+1+l*m;d.push(x,_,S),d.push(_,b,S)}this.setIndex(d),this.setAttribute("position",new ae(p,3)),this.setAttribute("normal",new ae(v,3)),this.setAttribute("uv",new ae(g,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new _i(t.width,t.height,t.widthSegments,t.heightSegments)}}class dd extends Me{constructor(t=.5,e=1,i=32,s=1,r=0,a=Math.PI*2){super(),this.type="RingGeometry",this.parameters={innerRadius:t,outerRadius:e,thetaSegments:i,phiSegments:s,thetaStart:r,thetaLength:a},i=Math.max(3,i),s=Math.max(1,s);const o=[],c=[],l=[],u=[];let h=t;const f=(e-t)/s,d=new C,p=new ht;for(let v=0;v<=s;v++){for(let g=0;g<=i;g++){const m=r+g/i*a;d.x=h*Math.cos(m),d.y=h*Math.sin(m),c.push(d.x,d.y,d.z),l.push(0,0,1),p.x=(d.x/e+1)/2,p.y=(d.y/e+1)/2,u.push(p.x,p.y)}h+=f}for(let v=0;v<s;v++){const g=v*(i+1);for(let m=0;m<i;m++){const M=m+g,x=M,_=M+i+1,b=M+i+2,S=M+1;o.push(x,_,S),o.push(_,b,S)}}this.setIndex(o),this.setAttribute("position",new ae(c,3)),this.setAttribute("normal",new ae(l,3)),this.setAttribute("uv",new ae(u,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new dd(t.innerRadius,t.outerRadius,t.thetaSegments,t.phiSegments,t.thetaStart,t.thetaLength)}}class Xt extends Me{constructor(t=1,e=32,i=16,s=0,r=Math.PI*2,a=0,o=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:t,widthSegments:e,heightSegments:i,phiStart:s,phiLength:r,thetaStart:a,thetaLength:o},e=Math.max(3,Math.floor(e)),i=Math.max(2,Math.floor(i));const c=Math.min(a+o,Math.PI);let l=0;const u=[],h=new C,f=new C,d=[],p=[],v=[],g=[];for(let m=0;m<=i;m++){const M=[],x=m/i;let _=0;m===0&&a===0?_=.5/e:m===i&&c===Math.PI&&(_=-.5/e);for(let b=0;b<=e;b++){const S=b/e;h.x=-t*Math.cos(s+S*r)*Math.sin(a+x*o),h.y=t*Math.cos(a+x*o),h.z=t*Math.sin(s+S*r)*Math.sin(a+x*o),p.push(h.x,h.y,h.z),f.copy(h).normalize(),v.push(f.x,f.y,f.z),g.push(S+_,1-x),M.push(l++)}u.push(M)}for(let m=0;m<i;m++)for(let M=0;M<e;M++){const x=u[m][M+1],_=u[m][M],b=u[m+1][M],S=u[m+1][M+1];(m!==0||a>0)&&d.push(x,_,S),(m!==i-1||c<Math.PI)&&d.push(_,b,S)}this.setIndex(d),this.setAttribute("position",new ae(p,3)),this.setAttribute("normal",new ae(v,3)),this.setAttribute("uv",new ae(g,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Xt(t.radius,t.widthSegments,t.heightSegments,t.phiStart,t.phiLength,t.thetaStart,t.thetaLength)}}class Hn extends Me{constructor(t=1,e=.4,i=12,s=48,r=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:t,tube:e,radialSegments:i,tubularSegments:s,arc:r},i=Math.floor(i),s=Math.floor(s);const a=[],o=[],c=[],l=[],u=new C,h=new C,f=new C;for(let d=0;d<=i;d++)for(let p=0;p<=s;p++){const v=p/s*r,g=d/i*Math.PI*2;h.x=(t+e*Math.cos(g))*Math.cos(v),h.y=(t+e*Math.cos(g))*Math.sin(v),h.z=e*Math.sin(g),o.push(h.x,h.y,h.z),u.x=t*Math.cos(v),u.y=t*Math.sin(v),f.subVectors(h,u).normalize(),c.push(f.x,f.y,f.z),l.push(p/s),l.push(d/i)}for(let d=1;d<=i;d++)for(let p=1;p<=s;p++){const v=(s+1)*d+p-1,g=(s+1)*(d-1)+p-1,m=(s+1)*(d-1)+p,M=(s+1)*d+p;a.push(v,g,M),a.push(g,m,M)}this.setIndex(a),this.setAttribute("position",new ae(o,3)),this.setAttribute("normal",new ae(c,3)),this.setAttribute("uv",new ae(l,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Hn(t.radius,t.tube,t.radialSegments,t.tubularSegments,t.arc)}}class Ps extends Me{constructor(t=new Kg(new C(-1,-1,0),new C(-1,1,0),new C(1,1,0)),e=64,i=1,s=8,r=!1){super(),this.type="TubeGeometry",this.parameters={path:t,tubularSegments:e,radius:i,radialSegments:s,closed:r};const a=t.computeFrenetFrames(e,r);this.tangents=a.tangents,this.normals=a.normals,this.binormals=a.binormals;const o=new C,c=new C,l=new ht;let u=new C;const h=[],f=[],d=[],p=[];v(),this.setIndex(p),this.setAttribute("position",new ae(h,3)),this.setAttribute("normal",new ae(f,3)),this.setAttribute("uv",new ae(d,2));function v(){for(let x=0;x<e;x++)g(x);g(r===!1?e:0),M(),m()}function g(x){u=t.getPointAt(x/e,u);const _=a.normals[x],b=a.binormals[x];for(let S=0;S<=s;S++){const T=S/s*Math.PI*2,A=Math.sin(T),w=-Math.cos(T);c.x=w*_.x+A*b.x,c.y=w*_.y+A*b.y,c.z=w*_.z+A*b.z,c.normalize(),f.push(c.x,c.y,c.z),o.x=u.x+i*c.x,o.y=u.y+i*c.y,o.z=u.z+i*c.z,h.push(o.x,o.y,o.z)}}function m(){for(let x=1;x<=e;x++)for(let _=1;_<=s;_++){const b=(s+1)*(x-1)+(_-1),S=(s+1)*x+(_-1),T=(s+1)*x+_,A=(s+1)*(x-1)+_;p.push(b,S,A),p.push(S,T,A)}}function M(){for(let x=0;x<=e;x++)for(let _=0;_<=s;_++)l.x=x/e,l.y=_/s,d.push(l.x,l.y)}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}toJSON(){const t=super.toJSON();return t.path=this.parameters.path.toJSON(),t}static fromJSON(t){return new Ps(new ch[t.path.type]().fromJSON(t.path),t.tubularSegments,t.radius,t.radialSegments,t.closed)}}class je extends Kr{constructor(t){super(),this.isMeshStandardMaterial=!0,this.type="MeshStandardMaterial",this.defines={STANDARD:""},this.color=new gt(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new gt(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Ug,this.normalScale=new ht(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Cn,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.defines={STANDARD:""},this.color.copy(t.color),this.roughness=t.roughness,this.metalness=t.metalness,this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.emissive.copy(t.emissive),this.emissiveMap=t.emissiveMap,this.emissiveIntensity=t.emissiveIntensity,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.roughnessMap=t.roughnessMap,this.metalnessMap=t.metalnessMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.envMapIntensity=t.envMapIntensity,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.flatShading=t.flatShading,this.fog=t.fog,this}}class a3 extends Kr{constructor(t){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=xM,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(t)}copy(t){return super.copy(t),this.depthPacking=t.depthPacking,this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this}}class o3 extends Kr{constructor(t){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(t)}copy(t){return super.copy(t),this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this}}class pd extends Ge{constructor(t,e=1){super(),this.isLight=!0,this.type="Light",this.color=new gt(t),this.intensity=e}dispose(){}copy(t,e){return super.copy(t,e),this.color.copy(t.color),this.intensity=t.intensity,this}toJSON(t){const e=super.toJSON(t);return e.object.color=this.color.getHex(),e.object.intensity=this.intensity,this.groundColor!==void 0&&(e.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(e.object.distance=this.distance),this.angle!==void 0&&(e.object.angle=this.angle),this.decay!==void 0&&(e.object.decay=this.decay),this.penumbra!==void 0&&(e.object.penumbra=this.penumbra),this.shadow!==void 0&&(e.object.shadow=this.shadow.toJSON()),this.target!==void 0&&(e.object.target=this.target.uuid),e}}class c3 extends pd{constructor(t,e,i){super(t,i),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(Ge.DEFAULT_UP),this.updateMatrix(),this.groundColor=new gt(e)}copy(t,e){return super.copy(t,e),this.groundColor.copy(t.groundColor),this}}const w0=new se,j1=new C,Z1=new C;class s2{constructor(t){this.camera=t,this.intensity=1,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new ht(512,512),this.mapType=Hi,this.map=null,this.mapPass=null,this.matrix=new se,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new ld,this._frameExtents=new ht(1,1),this._viewportCount=1,this._viewports=[new fe(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(t){const e=this.camera,i=this.matrix;j1.setFromMatrixPosition(t.matrixWorld),e.position.copy(j1),Z1.setFromMatrixPosition(t.target.matrixWorld),e.lookAt(Z1),e.updateMatrixWorld(),w0.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),this._frustum.setFromProjectionMatrix(w0,e.coordinateSystem,e.reversedDepth),e.reversedDepth?i.set(.5,0,0,.5,0,.5,0,.5,0,0,1,0,0,0,0,1):i.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),i.multiply(w0)}getViewport(t){return this._viewports[t]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(t){return this.camera=t.camera.clone(),this.intensity=t.intensity,this.bias=t.bias,this.radius=t.radius,this.autoUpdate=t.autoUpdate,this.needsUpdate=t.needsUpdate,this.normalBias=t.normalBias,this.blurSamples=t.blurSamples,this.mapSize.copy(t.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){const t={};return this.intensity!==1&&(t.intensity=this.intensity),this.bias!==0&&(t.bias=this.bias),this.normalBias!==0&&(t.normalBias=this.normalBias),this.radius!==1&&(t.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(t.mapSize=this.mapSize.toArray()),t.camera=this.camera.toJSON(!1).object,delete t.camera.matrix,t}}class l3 extends s2{constructor(){super(new jn(50,1,.5,500)),this.isSpotLightShadow=!0,this.focus=1,this.aspect=1}updateMatrices(t){const e=this.camera,i=fo*2*t.angle*this.focus,s=this.mapSize.width/this.mapSize.height*this.aspect,r=t.distance||e.far;(i!==e.fov||s!==e.aspect||r!==e.far)&&(e.fov=i,e.aspect=s,e.far=r,e.updateProjectionMatrix()),super.updateMatrices(t)}copy(t){return super.copy(t),this.focus=t.focus,this}}class h3 extends pd{constructor(t,e,i=0,s=Math.PI/3,r=0,a=2){super(t,e),this.isSpotLight=!0,this.type="SpotLight",this.position.copy(Ge.DEFAULT_UP),this.updateMatrix(),this.target=new Ge,this.distance=i,this.angle=s,this.penumbra=r,this.decay=a,this.map=null,this.shadow=new l3}get power(){return this.intensity*Math.PI}set power(t){this.intensity=t/Math.PI}dispose(){this.shadow.dispose()}copy(t,e){return super.copy(t,e),this.distance=t.distance,this.angle=t.angle,this.penumbra=t.penumbra,this.decay=t.decay,this.target=t.target.clone(),this.shadow=t.shadow.clone(),this}}class md extends zg{constructor(t=-1,e=1,i=1,s=-1,r=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=t,this.right=e,this.top=i,this.bottom=s,this.near=r,this.far=a,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.left=t.left,this.right=t.right,this.top=t.top,this.bottom=t.bottom,this.near=t.near,this.far=t.far,this.zoom=t.zoom,this.view=t.view===null?null:Object.assign({},t.view),this}setViewOffset(t,e,i,s,r,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=i,this.view.offsetY=s,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=(this.right-this.left)/(2*this.zoom),e=(this.top-this.bottom)/(2*this.zoom),i=(this.right+this.left)/2,s=(this.top+this.bottom)/2;let r=i-t,a=i+t,o=s+e,c=s-e;if(this.view!==null&&this.view.enabled){const l=(this.right-this.left)/this.view.fullWidth/this.zoom,u=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=l*this.view.offsetX,a=r+l*this.view.width,o-=u*this.view.offsetY,c=o-u*this.view.height}this.projectionMatrix.makeOrthographic(r,a,o,c,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.zoom=this.zoom,e.object.left=this.left,e.object.right=this.right,e.object.top=this.top,e.object.bottom=this.bottom,e.object.near=this.near,e.object.far=this.far,this.view!==null&&(e.object.view=Object.assign({},this.view)),e}}class u3 extends s2{constructor(){super(new md(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class lf extends pd{constructor(t,e){super(t,e),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(Ge.DEFAULT_UP),this.updateMatrix(),this.target=new Ge,this.shadow=new u3}dispose(){this.shadow.dispose()}copy(t){return super.copy(t),this.target=t.target.clone(),this.shadow=t.shadow.clone(),this}}class f3 extends jn{constructor(t=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=t}}const J1=new C,gl=new C,Ma=new C,_a=new C,b0=new C,d3=new C,p3=new C;class m3{constructor(t=new C,e=new C){this.start=t,this.end=e}set(t,e){return this.start.copy(t),this.end.copy(e),this}copy(t){return this.start.copy(t.start),this.end.copy(t.end),this}getCenter(t){return t.addVectors(this.start,this.end).multiplyScalar(.5)}delta(t){return t.subVectors(this.end,this.start)}distanceSq(){return this.start.distanceToSquared(this.end)}distance(){return this.start.distanceTo(this.end)}at(t,e){return this.delta(e).multiplyScalar(t).add(this.start)}closestPointToPointParameter(t,e){J1.subVectors(t,this.start),gl.subVectors(this.end,this.start);const i=gl.dot(gl);let r=gl.dot(J1)/i;return e&&(r=ne(r,0,1)),r}closestPointToPoint(t,e,i){const s=this.closestPointToPointParameter(t,e);return this.delta(i).multiplyScalar(s).add(this.start)}distanceSqToLine3(t,e=d3,i=p3){const s=10000000000000001e-32;let r,a;const o=this.start,c=t.start,l=this.end,u=t.end;Ma.subVectors(l,o),_a.subVectors(u,c),b0.subVectors(o,c);const h=Ma.dot(Ma),f=_a.dot(_a),d=_a.dot(b0);if(h<=s&&f<=s)return e.copy(o),i.copy(c),e.sub(i),e.dot(e);if(h<=s)r=0,a=d/f,a=ne(a,0,1);else{const p=Ma.dot(b0);if(f<=s)a=0,r=ne(-p/h,0,1);else{const v=Ma.dot(_a),g=h*f-v*v;g!==0?r=ne((v*d-p*f)/g,0,1):r=0,a=(v*r+d)/f,a<0?(a=0,r=ne(-p/h,0,1)):a>1&&(a=1,r=ne((v-p)/h,0,1))}}return e.copy(o).add(Ma.multiplyScalar(r)),i.copy(c).add(_a.multiplyScalar(a)),e.sub(i),e.dot(e)}applyMatrix4(t){return this.start.applyMatrix4(t),this.end.applyMatrix4(t),this}equals(t){return t.start.equals(this.start)&&t.end.equals(this.end)}clone(){return new this.constructor().copy(this)}}function K1(n,t,e,i){const s=g3(i);switch(e){case Pg:return n*t;case Kf:return n*t/s.components*s.byteLength;case Qf:return n*t/s.components*s.byteLength;case Dg:return n*t*2/s.components*s.byteLength;case td:return n*t*2/s.components*s.byteLength;case Ig:return n*t*3/s.components*s.byteLength;case ln:return n*t*4/s.components*s.byteLength;case ed:return n*t*4/s.components*s.byteLength;case kl:case Ol:return Math.floor((n+3)/4)*Math.floor((t+3)/4)*8;case Bl:case Hl:return Math.floor((n+3)/4)*Math.floor((t+3)/4)*16;case Pu:case Du:return Math.max(n,16)*Math.max(t,8)/4;case Lu:case Iu:return Math.max(n,8)*Math.max(t,8)/2;case Uu:case Fu:return Math.floor((n+3)/4)*Math.floor((t+3)/4)*8;case Nu:return Math.floor((n+3)/4)*Math.floor((t+3)/4)*16;case ku:return Math.floor((n+3)/4)*Math.floor((t+3)/4)*16;case Ou:return Math.floor((n+4)/5)*Math.floor((t+3)/4)*16;case Bu:return Math.floor((n+4)/5)*Math.floor((t+4)/5)*16;case Hu:return Math.floor((n+5)/6)*Math.floor((t+4)/5)*16;case zu:return Math.floor((n+5)/6)*Math.floor((t+5)/6)*16;case Vu:return Math.floor((n+7)/8)*Math.floor((t+4)/5)*16;case Gu:return Math.floor((n+7)/8)*Math.floor((t+5)/6)*16;case Wu:return Math.floor((n+7)/8)*Math.floor((t+7)/8)*16;case Xu:return Math.floor((n+9)/10)*Math.floor((t+4)/5)*16;case $u:return Math.floor((n+9)/10)*Math.floor((t+5)/6)*16;case qu:return Math.floor((n+9)/10)*Math.floor((t+7)/8)*16;case Yu:return Math.floor((n+9)/10)*Math.floor((t+9)/10)*16;case ju:return Math.floor((n+11)/12)*Math.floor((t+9)/10)*16;case Zu:return Math.floor((n+11)/12)*Math.floor((t+11)/12)*16;case Ju:case Ku:case Qu:return Math.ceil(n/4)*Math.ceil(t/4)*16;case tf:case ef:return Math.ceil(n/4)*Math.ceil(t/4)*8;case nf:case sf:return Math.ceil(n/4)*Math.ceil(t/4)*16}throw new Error(`Unable to determine texture byte length for ${e} format.`)}function g3(n){switch(n){case Hi:case Ag:return{byteLength:1,components:1};case pc:case Rg:case cr:return{byteLength:2,components:1};case Zf:case Jf:return{byteLength:2,components:4};case $r:case jf:case is:return{byteLength:4,components:1};case Cg:case Lg:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${n}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:Yf}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=Yf);/**
 * @license
 * Copyright 2010-2025 Three.js Authors
 * SPDX-License-Identifier: MIT
 */function r2(){let n=null,t=!1,e=null,i=null;function s(r,a){e(r,a),i=n.requestAnimationFrame(s)}return{start:function(){t!==!0&&e!==null&&(i=n.requestAnimationFrame(s),t=!0)},stop:function(){n.cancelAnimationFrame(i),t=!1},setAnimationLoop:function(r){e=r},setContext:function(r){n=r}}}function v3(n){const t=new WeakMap;function e(o,c){const l=o.array,u=o.usage,h=l.byteLength,f=n.createBuffer();n.bindBuffer(c,f),n.bufferData(c,l,u),o.onUploadCallback();let d;if(l instanceof Float32Array)d=n.FLOAT;else if(typeof Float16Array<"u"&&l instanceof Float16Array)d=n.HALF_FLOAT;else if(l instanceof Uint16Array)o.isFloat16BufferAttribute?d=n.HALF_FLOAT:d=n.UNSIGNED_SHORT;else if(l instanceof Int16Array)d=n.SHORT;else if(l instanceof Uint32Array)d=n.UNSIGNED_INT;else if(l instanceof Int32Array)d=n.INT;else if(l instanceof Int8Array)d=n.BYTE;else if(l instanceof Uint8Array)d=n.UNSIGNED_BYTE;else if(l instanceof Uint8ClampedArray)d=n.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+l);return{buffer:f,type:d,bytesPerElement:l.BYTES_PER_ELEMENT,version:o.version,size:h}}function i(o,c,l){const u=c.array,h=c.updateRanges;if(n.bindBuffer(l,o),h.length===0)n.bufferSubData(l,0,u);else{h.sort((d,p)=>d.start-p.start);let f=0;for(let d=1;d<h.length;d++){const p=h[f],v=h[d];v.start<=p.start+p.count+1?p.count=Math.max(p.count,v.start+v.count-p.start):(++f,h[f]=v)}h.length=f+1;for(let d=0,p=h.length;d<p;d++){const v=h[d];n.bufferSubData(l,v.start*u.BYTES_PER_ELEMENT,u,v.start,v.count)}c.clearUpdateRanges()}c.onUploadCallback()}function s(o){return o.isInterleavedBufferAttribute&&(o=o.data),t.get(o)}function r(o){o.isInterleavedBufferAttribute&&(o=o.data);const c=t.get(o);c&&(n.deleteBuffer(c.buffer),t.delete(o))}function a(o,c){if(o.isInterleavedBufferAttribute&&(o=o.data),o.isGLBufferAttribute){const u=t.get(o);(!u||u.version<o.version)&&t.set(o,{buffer:o.buffer,type:o.type,bytesPerElement:o.elementSize,version:o.version});return}const l=t.get(o);if(l===void 0)t.set(o,e(o,c));else if(l.version<o.version){if(l.size!==o.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");i(l.buffer,o,c),l.version=o.version}}return{get:s,remove:r,update:a}}var x3=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,M3=`#ifdef USE_ALPHAHASH
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
#endif`,_3=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,w3=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,b3=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,y3=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,S3=`#ifdef USE_AOMAP
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
#endif`,E3=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,T3=`#ifdef USE_BATCHING
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
#endif`,A3=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,R3=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,C3=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,L3=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,P3=`#ifdef USE_IRIDESCENCE
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
#endif`,I3=`#ifdef USE_BUMPMAP
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
#endif`,D3=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,U3=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,F3=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,N3=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,k3=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,O3=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,B3=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,H3=`#if defined( USE_COLOR_ALPHA )
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
#endif`,z3=`#define PI 3.141592653589793
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
} // validated`,V3=`#ifdef ENVMAP_TYPE_CUBE_UV
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
#endif`,G3=`vec3 transformedNormal = objectNormal;
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
#endif`,W3=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,X3=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,$3=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,q3=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,Y3="gl_FragColor = linearToOutputTexel( gl_FragColor );",j3=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,Z3=`#ifdef USE_ENVMAP
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
#endif`,J3=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,K3=`#ifdef USE_ENVMAP
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
#endif`,Q3=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,tw=`#ifdef USE_ENVMAP
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
#endif`,ew=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,nw=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,iw=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,sw=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,rw=`#ifdef USE_GRADIENTMAP
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
}`,aw=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,ow=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,cw=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,lw=`uniform bool receiveShadow;
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
#endif`,hw=`#ifdef USE_ENVMAP
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
#endif`,uw=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,fw=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,dw=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,pw=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,mw=`PhysicalMaterial material;
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
#endif`,gw=`struct PhysicalMaterial {
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
}`,vw=`
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
#endif`,xw=`#if defined( RE_IndirectDiffuse )
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
#endif`,Mw=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,_w=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,ww=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,bw=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,yw=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,Sw=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,Ew=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,Tw=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,Aw=`#if defined( USE_POINTS_UV )
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
#endif`,Rw=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,Cw=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,Lw=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,Pw=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,Iw=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Dw=`#ifdef USE_MORPHTARGETS
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
#endif`,Uw=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Fw=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 nonPerturbedNormal = normal;`,Nw=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
#endif`,kw=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Ow=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Bw=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,Hw=`#ifdef USE_NORMALMAP
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
#endif`,zw=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,Vw=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,Gw=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,Ww=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,Xw=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,$w=`vec3 packNormalToRGB( const in vec3 normal ) {
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
}`,qw=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,Yw=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,jw=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,Zw=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,Jw=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,Kw=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,Qw=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,t5=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,e5=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
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
#endif`,n5=`float getShadowMask() {
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
}`,i5=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,s5=`#ifdef USE_SKINNING
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
#endif`,r5=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,a5=`#ifdef USE_SKINNING
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
#endif`,o5=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,c5=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,l5=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,h5=`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,u5=`#ifdef USE_TRANSMISSION
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
#endif`,f5=`#ifdef USE_TRANSMISSION
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
#endif`,d5=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,p5=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,m5=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,g5=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const v5=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,x5=`uniform sampler2D t2D;
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
}`,M5=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,_5=`#ifdef ENVMAP_TYPE_CUBE
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
}`,w5=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,b5=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,y5=`#include <common>
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
}`,S5=`#if DEPTH_PACKING == 3200
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
}`,E5=`#define DISTANCE
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
}`,T5=`#define DISTANCE
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
}`,A5=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,R5=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,C5=`uniform float scale;
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
}`,L5=`uniform vec3 diffuse;
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
}`,P5=`#include <common>
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
}`,I5=`uniform vec3 diffuse;
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
}`,D5=`#define LAMBERT
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
}`,U5=`#define LAMBERT
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
}`,F5=`#define MATCAP
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
}`,N5=`#define MATCAP
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
}`,k5=`#define NORMAL
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
}`,O5=`#define NORMAL
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
}`,B5=`#define PHONG
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
}`,H5=`#define PHONG
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
}`,z5=`#define STANDARD
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
}`,V5=`#define STANDARD
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
}`,G5=`#define TOON
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
}`,W5=`#define TOON
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
}`,X5=`uniform float size;
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
}`,$5=`uniform vec3 diffuse;
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
}`,q5=`#include <common>
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
}`,Y5=`uniform vec3 color;
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
}`,j5=`uniform float rotation;
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
}`,Z5=`uniform vec3 diffuse;
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
}`,he={alphahash_fragment:x3,alphahash_pars_fragment:M3,alphamap_fragment:_3,alphamap_pars_fragment:w3,alphatest_fragment:b3,alphatest_pars_fragment:y3,aomap_fragment:S3,aomap_pars_fragment:E3,batching_pars_vertex:T3,batching_vertex:A3,begin_vertex:R3,beginnormal_vertex:C3,bsdfs:L3,iridescence_fragment:P3,bumpmap_pars_fragment:I3,clipping_planes_fragment:D3,clipping_planes_pars_fragment:U3,clipping_planes_pars_vertex:F3,clipping_planes_vertex:N3,color_fragment:k3,color_pars_fragment:O3,color_pars_vertex:B3,color_vertex:H3,common:z3,cube_uv_reflection_fragment:V3,defaultnormal_vertex:G3,displacementmap_pars_vertex:W3,displacementmap_vertex:X3,emissivemap_fragment:$3,emissivemap_pars_fragment:q3,colorspace_fragment:Y3,colorspace_pars_fragment:j3,envmap_fragment:Z3,envmap_common_pars_fragment:J3,envmap_pars_fragment:K3,envmap_pars_vertex:Q3,envmap_physical_pars_fragment:hw,envmap_vertex:tw,fog_vertex:ew,fog_pars_vertex:nw,fog_fragment:iw,fog_pars_fragment:sw,gradientmap_pars_fragment:rw,lightmap_pars_fragment:aw,lights_lambert_fragment:ow,lights_lambert_pars_fragment:cw,lights_pars_begin:lw,lights_toon_fragment:uw,lights_toon_pars_fragment:fw,lights_phong_fragment:dw,lights_phong_pars_fragment:pw,lights_physical_fragment:mw,lights_physical_pars_fragment:gw,lights_fragment_begin:vw,lights_fragment_maps:xw,lights_fragment_end:Mw,logdepthbuf_fragment:_w,logdepthbuf_pars_fragment:ww,logdepthbuf_pars_vertex:bw,logdepthbuf_vertex:yw,map_fragment:Sw,map_pars_fragment:Ew,map_particle_fragment:Tw,map_particle_pars_fragment:Aw,metalnessmap_fragment:Rw,metalnessmap_pars_fragment:Cw,morphinstance_vertex:Lw,morphcolor_vertex:Pw,morphnormal_vertex:Iw,morphtarget_pars_vertex:Dw,morphtarget_vertex:Uw,normal_fragment_begin:Fw,normal_fragment_maps:Nw,normal_pars_fragment:kw,normal_pars_vertex:Ow,normal_vertex:Bw,normalmap_pars_fragment:Hw,clearcoat_normal_fragment_begin:zw,clearcoat_normal_fragment_maps:Vw,clearcoat_pars_fragment:Gw,iridescence_pars_fragment:Ww,opaque_fragment:Xw,packing:$w,premultiplied_alpha_fragment:qw,project_vertex:Yw,dithering_fragment:jw,dithering_pars_fragment:Zw,roughnessmap_fragment:Jw,roughnessmap_pars_fragment:Kw,shadowmap_pars_fragment:Qw,shadowmap_pars_vertex:t5,shadowmap_vertex:e5,shadowmask_pars_fragment:n5,skinbase_vertex:i5,skinning_pars_vertex:s5,skinning_vertex:r5,skinnormal_vertex:a5,specularmap_fragment:o5,specularmap_pars_fragment:c5,tonemapping_fragment:l5,tonemapping_pars_fragment:h5,transmission_fragment:u5,transmission_pars_fragment:f5,uv_pars_fragment:d5,uv_pars_vertex:p5,uv_vertex:m5,worldpos_vertex:g5,background_vert:v5,background_frag:x5,backgroundCube_vert:M5,backgroundCube_frag:_5,cube_vert:w5,cube_frag:b5,depth_vert:y5,depth_frag:S5,distanceRGBA_vert:E5,distanceRGBA_frag:T5,equirect_vert:A5,equirect_frag:R5,linedashed_vert:C5,linedashed_frag:L5,meshbasic_vert:P5,meshbasic_frag:I5,meshlambert_vert:D5,meshlambert_frag:U5,meshmatcap_vert:F5,meshmatcap_frag:N5,meshnormal_vert:k5,meshnormal_frag:O5,meshphong_vert:B5,meshphong_frag:H5,meshphysical_vert:z5,meshphysical_frag:V5,meshtoon_vert:G5,meshtoon_frag:W5,points_vert:X5,points_frag:$5,shadow_vert:q5,shadow_frag:Y5,sprite_vert:j5,sprite_frag:Z5},Lt={common:{diffuse:{value:new gt(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new le},alphaMap:{value:null},alphaMapTransform:{value:new le},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new le}},envmap:{envMap:{value:null},envMapRotation:{value:new le},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new le}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new le}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new le},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new le},normalScale:{value:new ht(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new le},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new le}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new le}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new le}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new gt(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new gt(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new le},alphaTest:{value:0},uvTransform:{value:new le}},sprite:{diffuse:{value:new gt(16777215)},opacity:{value:1},center:{value:new ht(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new le},alphaMap:{value:null},alphaMapTransform:{value:new le},alphaTest:{value:0}}},Zi={basic:{uniforms:bn([Lt.common,Lt.specularmap,Lt.envmap,Lt.aomap,Lt.lightmap,Lt.fog]),vertexShader:he.meshbasic_vert,fragmentShader:he.meshbasic_frag},lambert:{uniforms:bn([Lt.common,Lt.specularmap,Lt.envmap,Lt.aomap,Lt.lightmap,Lt.emissivemap,Lt.bumpmap,Lt.normalmap,Lt.displacementmap,Lt.fog,Lt.lights,{emissive:{value:new gt(0)}}]),vertexShader:he.meshlambert_vert,fragmentShader:he.meshlambert_frag},phong:{uniforms:bn([Lt.common,Lt.specularmap,Lt.envmap,Lt.aomap,Lt.lightmap,Lt.emissivemap,Lt.bumpmap,Lt.normalmap,Lt.displacementmap,Lt.fog,Lt.lights,{emissive:{value:new gt(0)},specular:{value:new gt(1118481)},shininess:{value:30}}]),vertexShader:he.meshphong_vert,fragmentShader:he.meshphong_frag},standard:{uniforms:bn([Lt.common,Lt.envmap,Lt.aomap,Lt.lightmap,Lt.emissivemap,Lt.bumpmap,Lt.normalmap,Lt.displacementmap,Lt.roughnessmap,Lt.metalnessmap,Lt.fog,Lt.lights,{emissive:{value:new gt(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:he.meshphysical_vert,fragmentShader:he.meshphysical_frag},toon:{uniforms:bn([Lt.common,Lt.aomap,Lt.lightmap,Lt.emissivemap,Lt.bumpmap,Lt.normalmap,Lt.displacementmap,Lt.gradientmap,Lt.fog,Lt.lights,{emissive:{value:new gt(0)}}]),vertexShader:he.meshtoon_vert,fragmentShader:he.meshtoon_frag},matcap:{uniforms:bn([Lt.common,Lt.bumpmap,Lt.normalmap,Lt.displacementmap,Lt.fog,{matcap:{value:null}}]),vertexShader:he.meshmatcap_vert,fragmentShader:he.meshmatcap_frag},points:{uniforms:bn([Lt.points,Lt.fog]),vertexShader:he.points_vert,fragmentShader:he.points_frag},dashed:{uniforms:bn([Lt.common,Lt.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:he.linedashed_vert,fragmentShader:he.linedashed_frag},depth:{uniforms:bn([Lt.common,Lt.displacementmap]),vertexShader:he.depth_vert,fragmentShader:he.depth_frag},normal:{uniforms:bn([Lt.common,Lt.bumpmap,Lt.normalmap,Lt.displacementmap,{opacity:{value:1}}]),vertexShader:he.meshnormal_vert,fragmentShader:he.meshnormal_frag},sprite:{uniforms:bn([Lt.sprite,Lt.fog]),vertexShader:he.sprite_vert,fragmentShader:he.sprite_frag},background:{uniforms:{uvTransform:{value:new le},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:he.background_vert,fragmentShader:he.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new le}},vertexShader:he.backgroundCube_vert,fragmentShader:he.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:he.cube_vert,fragmentShader:he.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:he.equirect_vert,fragmentShader:he.equirect_frag},distanceRGBA:{uniforms:bn([Lt.common,Lt.displacementmap,{referencePosition:{value:new C},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:he.distanceRGBA_vert,fragmentShader:he.distanceRGBA_frag},shadow:{uniforms:bn([Lt.lights,Lt.fog,{color:{value:new gt(0)},opacity:{value:1}}]),vertexShader:he.shadow_vert,fragmentShader:he.shadow_frag}};Zi.physical={uniforms:bn([Zi.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new le},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new le},clearcoatNormalScale:{value:new ht(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new le},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new le},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new le},sheen:{value:0},sheenColor:{value:new gt(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new le},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new le},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new le},transmissionSamplerSize:{value:new ht},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new le},attenuationDistance:{value:0},attenuationColor:{value:new gt(0)},specularColor:{value:new gt(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new le},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new le},anisotropyVector:{value:new ht},anisotropyMap:{value:null},anisotropyMapTransform:{value:new le}}]),vertexShader:he.meshphysical_vert,fragmentShader:he.meshphysical_frag};const vl={r:0,b:0,g:0},vr=new Cn,J5=new se;function K5(n,t,e,i,s,r,a){const o=new gt(0);let c=r===!0?0:1,l,u,h=null,f=0,d=null;function p(x){let _=x.isScene===!0?x.background:null;return _&&_.isTexture&&(_=(x.backgroundBlurriness>0?e:t).get(_)),_}function v(x){let _=!1;const b=p(x);b===null?m(o,c):b&&b.isColor&&(m(b,1),_=!0);const S=n.xr.getEnvironmentBlendMode();S==="additive"?i.buffers.color.setClear(0,0,0,1,a):S==="alpha-blend"&&i.buffers.color.setClear(0,0,0,0,a),(n.autoClear||_)&&(i.buffers.depth.setTest(!0),i.buffers.depth.setMask(!0),i.buffers.color.setMask(!0),n.clear(n.autoClearColor,n.autoClearDepth,n.autoClearStencil))}function g(x,_){const b=p(_);b&&(b.isCubeTexture||b.mapping===Ih)?(u===void 0&&(u=new nt(new Ie(1,1,1),new nn({name:"BackgroundCubeMaterial",uniforms:po(Zi.backgroundCube.uniforms),vertexShader:Zi.backgroundCube.vertexShader,fragmentShader:Zi.backgroundCube.fragmentShader,side:Bn,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),u.geometry.deleteAttribute("normal"),u.geometry.deleteAttribute("uv"),u.onBeforeRender=function(S,T,A){this.matrixWorld.copyPosition(A.matrixWorld)},Object.defineProperty(u.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),s.update(u)),vr.copy(_.backgroundRotation),vr.x*=-1,vr.y*=-1,vr.z*=-1,b.isCubeTexture&&b.isRenderTargetTexture===!1&&(vr.y*=-1,vr.z*=-1),u.material.uniforms.envMap.value=b,u.material.uniforms.flipEnvMap.value=b.isCubeTexture&&b.isRenderTargetTexture===!1?-1:1,u.material.uniforms.backgroundBlurriness.value=_.backgroundBlurriness,u.material.uniforms.backgroundIntensity.value=_.backgroundIntensity,u.material.uniforms.backgroundRotation.value.setFromMatrix4(J5.makeRotationFromEuler(vr)),u.material.toneMapped=ve.getTransfer(b.colorSpace)!==Se,(h!==b||f!==b.version||d!==n.toneMapping)&&(u.material.needsUpdate=!0,h=b,f=b.version,d=n.toneMapping),u.layers.enableAll(),x.unshift(u,u.geometry,u.material,0,0,null)):b&&b.isTexture&&(l===void 0&&(l=new nt(new _i(2,2),new nn({name:"BackgroundMaterial",uniforms:po(Zi.background.uniforms),vertexShader:Zi.background.vertexShader,fragmentShader:Zi.background.fragmentShader,side:ar,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),l.geometry.deleteAttribute("normal"),Object.defineProperty(l.material,"map",{get:function(){return this.uniforms.t2D.value}}),s.update(l)),l.material.uniforms.t2D.value=b,l.material.uniforms.backgroundIntensity.value=_.backgroundIntensity,l.material.toneMapped=ve.getTransfer(b.colorSpace)!==Se,b.matrixAutoUpdate===!0&&b.updateMatrix(),l.material.uniforms.uvTransform.value.copy(b.matrix),(h!==b||f!==b.version||d!==n.toneMapping)&&(l.material.needsUpdate=!0,h=b,f=b.version,d=n.toneMapping),l.layers.enableAll(),x.unshift(l,l.geometry,l.material,0,0,null))}function m(x,_){x.getRGB(vl,Hg(n)),i.buffers.color.setClear(vl.r,vl.g,vl.b,_,a)}function M(){u!==void 0&&(u.geometry.dispose(),u.material.dispose(),u=void 0),l!==void 0&&(l.geometry.dispose(),l.material.dispose(),l=void 0)}return{getClearColor:function(){return o},setClearColor:function(x,_=1){o.set(x),c=_,m(o,c)},getClearAlpha:function(){return c},setClearAlpha:function(x){c=x,m(o,c)},render:v,addToRenderList:g,dispose:M}}function Q5(n,t){const e=n.getParameter(n.MAX_VERTEX_ATTRIBS),i={},s=f(null);let r=s,a=!1;function o(y,E,R,L,I){let N=!1;const B=h(L,R,E);r!==B&&(r=B,l(r.object)),N=d(y,L,R,I),N&&p(y,L,R,I),I!==null&&t.update(I,n.ELEMENT_ARRAY_BUFFER),(N||a)&&(a=!1,_(y,E,R,L),I!==null&&n.bindBuffer(n.ELEMENT_ARRAY_BUFFER,t.get(I).buffer))}function c(){return n.createVertexArray()}function l(y){return n.bindVertexArray(y)}function u(y){return n.deleteVertexArray(y)}function h(y,E,R){const L=R.wireframe===!0;let I=i[y.id];I===void 0&&(I={},i[y.id]=I);let N=I[E.id];N===void 0&&(N={},I[E.id]=N);let B=N[L];return B===void 0&&(B=f(c()),N[L]=B),B}function f(y){const E=[],R=[],L=[];for(let I=0;I<e;I++)E[I]=0,R[I]=0,L[I]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:E,enabledAttributes:R,attributeDivisors:L,object:y,attributes:{},index:null}}function d(y,E,R,L){const I=r.attributes,N=E.attributes;let B=0;const X=R.getAttributes();for(const H in X)if(X[H].location>=0){const it=I[H];let dt=N[H];if(dt===void 0&&(H==="instanceMatrix"&&y.instanceMatrix&&(dt=y.instanceMatrix),H==="instanceColor"&&y.instanceColor&&(dt=y.instanceColor)),it===void 0||it.attribute!==dt||dt&&it.data!==dt.data)return!0;B++}return r.attributesNum!==B||r.index!==L}function p(y,E,R,L){const I={},N=E.attributes;let B=0;const X=R.getAttributes();for(const H in X)if(X[H].location>=0){let it=N[H];it===void 0&&(H==="instanceMatrix"&&y.instanceMatrix&&(it=y.instanceMatrix),H==="instanceColor"&&y.instanceColor&&(it=y.instanceColor));const dt={};dt.attribute=it,it&&it.data&&(dt.data=it.data),I[H]=dt,B++}r.attributes=I,r.attributesNum=B,r.index=L}function v(){const y=r.newAttributes;for(let E=0,R=y.length;E<R;E++)y[E]=0}function g(y){m(y,0)}function m(y,E){const R=r.newAttributes,L=r.enabledAttributes,I=r.attributeDivisors;R[y]=1,L[y]===0&&(n.enableVertexAttribArray(y),L[y]=1),I[y]!==E&&(n.vertexAttribDivisor(y,E),I[y]=E)}function M(){const y=r.newAttributes,E=r.enabledAttributes;for(let R=0,L=E.length;R<L;R++)E[R]!==y[R]&&(n.disableVertexAttribArray(R),E[R]=0)}function x(y,E,R,L,I,N,B){B===!0?n.vertexAttribIPointer(y,E,R,I,N):n.vertexAttribPointer(y,E,R,L,I,N)}function _(y,E,R,L){v();const I=L.attributes,N=R.getAttributes(),B=E.defaultAttributeValues;for(const X in N){const H=N[X];if(H.location>=0){let Y=I[X];if(Y===void 0&&(X==="instanceMatrix"&&y.instanceMatrix&&(Y=y.instanceMatrix),X==="instanceColor"&&y.instanceColor&&(Y=y.instanceColor)),Y!==void 0){const it=Y.normalized,dt=Y.itemSize,vt=t.get(Y);if(vt===void 0)continue;const St=vt.buffer,Ct=vt.type,Ft=vt.bytesPerElement,V=Ct===n.INT||Ct===n.UNSIGNED_INT||Y.gpuType===jf;if(Y.isInterleavedBufferAttribute){const $=Y.data,z=$.stride,W=Y.offset;if($.isInstancedInterleavedBuffer){for(let G=0;G<H.locationSize;G++)m(H.location+G,$.meshPerAttribute);y.isInstancedMesh!==!0&&L._maxInstanceCount===void 0&&(L._maxInstanceCount=$.meshPerAttribute*$.count)}else for(let G=0;G<H.locationSize;G++)g(H.location+G);n.bindBuffer(n.ARRAY_BUFFER,St);for(let G=0;G<H.locationSize;G++)x(H.location+G,dt/H.locationSize,Ct,it,z*Ft,(W+dt/H.locationSize*G)*Ft,V)}else{if(Y.isInstancedBufferAttribute){for(let $=0;$<H.locationSize;$++)m(H.location+$,Y.meshPerAttribute);y.isInstancedMesh!==!0&&L._maxInstanceCount===void 0&&(L._maxInstanceCount=Y.meshPerAttribute*Y.count)}else for(let $=0;$<H.locationSize;$++)g(H.location+$);n.bindBuffer(n.ARRAY_BUFFER,St);for(let $=0;$<H.locationSize;$++)x(H.location+$,dt/H.locationSize,Ct,it,dt*Ft,dt/H.locationSize*$*Ft,V)}}else if(B!==void 0){const it=B[X];if(it!==void 0)switch(it.length){case 2:n.vertexAttrib2fv(H.location,it);break;case 3:n.vertexAttrib3fv(H.location,it);break;case 4:n.vertexAttrib4fv(H.location,it);break;default:n.vertexAttrib1fv(H.location,it)}}}}M()}function b(){A();for(const y in i){const E=i[y];for(const R in E){const L=E[R];for(const I in L)u(L[I].object),delete L[I];delete E[R]}delete i[y]}}function S(y){if(i[y.id]===void 0)return;const E=i[y.id];for(const R in E){const L=E[R];for(const I in L)u(L[I].object),delete L[I];delete E[R]}delete i[y.id]}function T(y){for(const E in i){const R=i[E];if(R[y.id]===void 0)continue;const L=R[y.id];for(const I in L)u(L[I].object),delete L[I];delete R[y.id]}}function A(){w(),a=!0,r!==s&&(r=s,l(r.object))}function w(){s.geometry=null,s.program=null,s.wireframe=!1}return{setup:o,reset:A,resetDefaultState:w,dispose:b,releaseStatesOfGeometry:S,releaseStatesOfProgram:T,initAttributes:v,enableAttribute:g,disableUnusedAttributes:M}}function tb(n,t,e){let i;function s(l){i=l}function r(l,u){n.drawArrays(i,l,u),e.update(u,i,1)}function a(l,u,h){h!==0&&(n.drawArraysInstanced(i,l,u,h),e.update(u,i,h))}function o(l,u,h){if(h===0)return;t.get("WEBGL_multi_draw").multiDrawArraysWEBGL(i,l,0,u,0,h);let d=0;for(let p=0;p<h;p++)d+=u[p];e.update(d,i,1)}function c(l,u,h,f){if(h===0)return;const d=t.get("WEBGL_multi_draw");if(d===null)for(let p=0;p<l.length;p++)a(l[p],u[p],f[p]);else{d.multiDrawArraysInstancedWEBGL(i,l,0,u,0,f,0,h);let p=0;for(let v=0;v<h;v++)p+=u[v]*f[v];e.update(p,i,1)}}this.setMode=s,this.render=r,this.renderInstances=a,this.renderMultiDraw=o,this.renderMultiDrawInstances=c}function eb(n,t,e,i){let s;function r(){if(s!==void 0)return s;if(t.has("EXT_texture_filter_anisotropic")===!0){const T=t.get("EXT_texture_filter_anisotropic");s=n.getParameter(T.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else s=0;return s}function a(T){return!(T!==ln&&i.convert(T)!==n.getParameter(n.IMPLEMENTATION_COLOR_READ_FORMAT))}function o(T){const A=T===cr&&(t.has("EXT_color_buffer_half_float")||t.has("EXT_color_buffer_float"));return!(T!==Hi&&i.convert(T)!==n.getParameter(n.IMPLEMENTATION_COLOR_READ_TYPE)&&T!==is&&!A)}function c(T){if(T==="highp"){if(n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.HIGH_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.HIGH_FLOAT).precision>0)return"highp";T="mediump"}return T==="mediump"&&n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.MEDIUM_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let l=e.precision!==void 0?e.precision:"highp";const u=c(l);u!==l&&(console.warn("THREE.WebGLRenderer:",l,"not supported, using",u,"instead."),l=u);const h=e.logarithmicDepthBuffer===!0,f=e.reversedDepthBuffer===!0&&t.has("EXT_clip_control"),d=n.getParameter(n.MAX_TEXTURE_IMAGE_UNITS),p=n.getParameter(n.MAX_VERTEX_TEXTURE_IMAGE_UNITS),v=n.getParameter(n.MAX_TEXTURE_SIZE),g=n.getParameter(n.MAX_CUBE_MAP_TEXTURE_SIZE),m=n.getParameter(n.MAX_VERTEX_ATTRIBS),M=n.getParameter(n.MAX_VERTEX_UNIFORM_VECTORS),x=n.getParameter(n.MAX_VARYING_VECTORS),_=n.getParameter(n.MAX_FRAGMENT_UNIFORM_VECTORS),b=p>0,S=n.getParameter(n.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:r,getMaxPrecision:c,textureFormatReadable:a,textureTypeReadable:o,precision:l,logarithmicDepthBuffer:h,reversedDepthBuffer:f,maxTextures:d,maxVertexTextures:p,maxTextureSize:v,maxCubemapSize:g,maxAttributes:m,maxVertexUniforms:M,maxVaryings:x,maxFragmentUniforms:_,vertexTextures:b,maxSamples:S}}function nb(n){const t=this;let e=null,i=0,s=!1,r=!1;const a=new Er,o=new le,c={value:null,needsUpdate:!1};this.uniform=c,this.numPlanes=0,this.numIntersection=0,this.init=function(h,f){const d=h.length!==0||f||i!==0||s;return s=f,i=h.length,d},this.beginShadows=function(){r=!0,u(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(h,f){e=u(h,f,0)},this.setState=function(h,f,d){const p=h.clippingPlanes,v=h.clipIntersection,g=h.clipShadows,m=n.get(h);if(!s||p===null||p.length===0||r&&!g)r?u(null):l();else{const M=r?0:i,x=M*4;let _=m.clippingState||null;c.value=_,_=u(p,f,x,d);for(let b=0;b!==x;++b)_[b]=e[b];m.clippingState=_,this.numIntersection=v?this.numPlanes:0,this.numPlanes+=M}};function l(){c.value!==e&&(c.value=e,c.needsUpdate=i>0),t.numPlanes=i,t.numIntersection=0}function u(h,f,d,p){const v=h!==null?h.length:0;let g=null;if(v!==0){if(g=c.value,p!==!0||g===null){const m=d+v*4,M=f.matrixWorldInverse;o.getNormalMatrix(M),(g===null||g.length<m)&&(g=new Float32Array(m));for(let x=0,_=d;x!==v;++x,_+=4)a.copy(h[x]).applyMatrix4(M,o),a.normal.toArray(g,_),g[_+3]=a.constant}c.value=g,c.needsUpdate=!0}return t.numPlanes=v,t.numIntersection=0,g}}function ib(n){let t=new WeakMap;function e(a,o){return o===nh?a.mapping=lo:o===Ru&&(a.mapping=ho),a}function i(a){if(a&&a.isTexture){const o=a.mapping;if(o===nh||o===Ru)if(t.has(a)){const c=t.get(a).texture;return e(c,a.mapping)}else{const c=a.image;if(c&&c.height>0){const l=new x_(c.height);return l.fromEquirectangularTexture(n,a),t.set(a,l),a.addEventListener("dispose",s),e(l.texture,a.mapping)}else return null}}return a}function s(a){const o=a.target;o.removeEventListener("dispose",s);const c=t.get(o);c!==void 0&&(t.delete(o),c.dispose())}function r(){t=new WeakMap}return{get:i,dispose:r}}const Ba=4,Q1=[.125,.215,.35,.446,.526,.582],Rr=20,y0=new md,tp=new gt;let S0=null,E0=0,T0=0,A0=!1;const Tr=(1+Math.sqrt(5))/2,wa=1/Tr,ep=[new C(-Tr,wa,0),new C(Tr,wa,0),new C(-wa,0,Tr),new C(wa,0,Tr),new C(0,Tr,-wa),new C(0,Tr,wa),new C(-1,1,-1),new C(1,1,-1),new C(-1,1,1),new C(1,1,1)],sb=new C;class hf{constructor(t){this._renderer=t,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(t,e=0,i=.1,s=100,r={}){const{size:a=256,position:o=sb}=r;S0=this._renderer.getRenderTarget(),E0=this._renderer.getActiveCubeFace(),T0=this._renderer.getActiveMipmapLevel(),A0=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(a);const c=this._allocateTargets();return c.depthBuffer=!0,this._sceneToCubeUV(t,i,s,c,o),e>0&&this._blur(c,0,0,e),this._applyPMREM(c),this._cleanup(c),c}fromEquirectangular(t,e=null){return this._fromTexture(t,e)}fromCubemap(t,e=null){return this._fromTexture(t,e)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=sp(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=ip(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(t){this._lodMax=Math.floor(Math.log2(t)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let t=0;t<this._lodPlanes.length;t++)this._lodPlanes[t].dispose()}_cleanup(t){this._renderer.setRenderTarget(S0,E0,T0),this._renderer.xr.enabled=A0,t.scissorTest=!1,xl(t,0,0,t.width,t.height)}_fromTexture(t,e){t.mapping===lo||t.mapping===ho?this._setSize(t.image.length===0?16:t.image[0].width||t.image[0].image.width):this._setSize(t.image.width/4),S0=this._renderer.getRenderTarget(),E0=this._renderer.getActiveCubeFace(),T0=this._renderer.getActiveMipmapLevel(),A0=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const i=e||this._allocateTargets();return this._textureToCubeUV(t,i),this._applyPMREM(i),this._cleanup(i),i}_allocateTargets(){const t=3*Math.max(this._cubeSize,112),e=4*this._cubeSize,i={magFilter:Pe,minFilter:Pe,generateMipmaps:!1,type:cr,format:ln,colorSpace:qr,depthBuffer:!1},s=np(t,e,i);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==t||this._pingPongRenderTarget.height!==e){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=np(t,e,i);const{_lodMax:r}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=rb(r)),this._blurMaterial=ab(r,t,e)}return s}_compileMaterial(t){const e=new nt(this._lodPlanes[0],t);this._renderer.compile(e,y0)}_sceneToCubeUV(t,e,i,s,r){const c=new jn(90,1,e,i),l=[1,-1,1,1,1,1],u=[1,1,1,-1,-1,-1],h=this._renderer,f=h.autoClear,d=h.toneMapping;h.getClearColor(tp),h.toneMapping=nr,h.autoClear=!1,h.state.buffers.depth.getReversed()&&(h.setRenderTarget(s),h.clearDepth(),h.setRenderTarget(null));const v=new cs({name:"PMREM.Background",side:Bn,depthWrite:!1,depthTest:!1}),g=new nt(new Ie,v);let m=!1;const M=t.background;M?M.isColor&&(v.color.copy(M),t.background=null,m=!0):(v.color.copy(tp),m=!0);for(let x=0;x<6;x++){const _=x%3;_===0?(c.up.set(0,l[x],0),c.position.set(r.x,r.y,r.z),c.lookAt(r.x+u[x],r.y,r.z)):_===1?(c.up.set(0,0,l[x]),c.position.set(r.x,r.y,r.z),c.lookAt(r.x,r.y+u[x],r.z)):(c.up.set(0,l[x],0),c.position.set(r.x,r.y,r.z),c.lookAt(r.x,r.y,r.z+u[x]));const b=this._cubeSize;xl(s,_*b,x>2?b:0,b,b),h.setRenderTarget(s),m&&h.render(g,c),h.render(t,c)}g.geometry.dispose(),g.material.dispose(),h.toneMapping=d,h.autoClear=f,t.background=M}_textureToCubeUV(t,e){const i=this._renderer,s=t.mapping===lo||t.mapping===ho;s?(this._cubemapMaterial===null&&(this._cubemapMaterial=sp()),this._cubemapMaterial.uniforms.flipEnvMap.value=t.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=ip());const r=s?this._cubemapMaterial:this._equirectMaterial,a=new nt(this._lodPlanes[0],r),o=r.uniforms;o.envMap.value=t;const c=this._cubeSize;xl(e,0,0,3*c,2*c),i.setRenderTarget(e),i.render(a,y0)}_applyPMREM(t){const e=this._renderer,i=e.autoClear;e.autoClear=!1;const s=this._lodPlanes.length;for(let r=1;r<s;r++){const a=Math.sqrt(this._sigmas[r]*this._sigmas[r]-this._sigmas[r-1]*this._sigmas[r-1]),o=ep[(s-r-1)%ep.length];this._blur(t,r-1,r,a,o)}e.autoClear=i}_blur(t,e,i,s,r){const a=this._pingPongRenderTarget;this._halfBlur(t,a,e,i,s,"latitudinal",r),this._halfBlur(a,t,i,i,s,"longitudinal",r)}_halfBlur(t,e,i,s,r,a,o){const c=this._renderer,l=this._blurMaterial;a!=="latitudinal"&&a!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const u=3,h=new nt(this._lodPlanes[s],l),f=l.uniforms,d=this._sizeLods[i]-1,p=isFinite(r)?Math.PI/(2*d):2*Math.PI/(2*Rr-1),v=r/p,g=isFinite(r)?1+Math.floor(u*v):Rr;g>Rr&&console.warn(`sigmaRadians, ${r}, is too large and will clip, as it requested ${g} samples when the maximum is set to ${Rr}`);const m=[];let M=0;for(let T=0;T<Rr;++T){const A=T/v,w=Math.exp(-A*A/2);m.push(w),T===0?M+=w:T<g&&(M+=2*w)}for(let T=0;T<m.length;T++)m[T]=m[T]/M;f.envMap.value=t.texture,f.samples.value=g,f.weights.value=m,f.latitudinal.value=a==="latitudinal",o&&(f.poleAxis.value=o);const{_lodMax:x}=this;f.dTheta.value=p,f.mipInt.value=x-i;const _=this._sizeLods[s],b=3*_*(s>x-Ba?s-x+Ba:0),S=4*(this._cubeSize-_);xl(e,b,S,3*_,2*_),c.setRenderTarget(e),c.render(h,y0)}}function rb(n){const t=[],e=[],i=[];let s=n;const r=n-Ba+1+Q1.length;for(let a=0;a<r;a++){const o=Math.pow(2,s);e.push(o);let c=1/o;a>n-Ba?c=Q1[a-n+Ba-1]:a===0&&(c=0),i.push(c);const l=1/(o-2),u=-l,h=1+l,f=[u,u,h,u,h,h,u,u,h,h,u,h],d=6,p=6,v=3,g=2,m=1,M=new Float32Array(v*p*d),x=new Float32Array(g*p*d),_=new Float32Array(m*p*d);for(let S=0;S<d;S++){const T=S%3*2/3-1,A=S>2?0:-1,w=[T,A,0,T+2/3,A,0,T+2/3,A+1,0,T,A,0,T+2/3,A+1,0,T,A+1,0];M.set(w,v*p*S),x.set(f,g*p*S);const y=[S,S,S,S,S,S];_.set(y,m*p*S)}const b=new Me;b.setAttribute("position",new qt(M,v)),b.setAttribute("uv",new qt(x,g)),b.setAttribute("faceIndex",new qt(_,m)),t.push(b),s>Ba&&s--}return{lodPlanes:t,sizeLods:e,sigmas:i}}function np(n,t,e){const i=new En(n,t,e);return i.texture.mapping=Ih,i.texture.name="PMREM.cubeUv",i.scissorTest=!0,i}function xl(n,t,e,i,s){n.viewport.set(t,e,i,s),n.scissor.set(t,e,i,s)}function ab(n,t,e){const i=new Float32Array(Rr),s=new C(0,1,0);return new nn({name:"SphericalGaussianBlur",defines:{n:Rr,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/e,CUBEUV_MAX_MIP:`${n}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:i},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:s}},vertexShader:gd(),fragmentShader:`

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
		`,blending:er,depthTest:!1,depthWrite:!1})}function ip(){return new nn({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:gd(),fragmentShader:`

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
		`,blending:er,depthTest:!1,depthWrite:!1})}function sp(){return new nn({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:gd(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:er,depthTest:!1,depthWrite:!1})}function gd(){return`

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
	`}function ob(n){let t=new WeakMap,e=null;function i(o){if(o&&o.isTexture){const c=o.mapping,l=c===nh||c===Ru,u=c===lo||c===ho;if(l||u){let h=t.get(o);const f=h!==void 0?h.texture.pmremVersion:0;if(o.isRenderTargetTexture&&o.pmremVersion!==f)return e===null&&(e=new hf(n)),h=l?e.fromEquirectangular(o,h):e.fromCubemap(o,h),h.texture.pmremVersion=o.pmremVersion,t.set(o,h),h.texture;if(h!==void 0)return h.texture;{const d=o.image;return l&&d&&d.height>0||u&&d&&s(d)?(e===null&&(e=new hf(n)),h=l?e.fromEquirectangular(o):e.fromCubemap(o),h.texture.pmremVersion=o.pmremVersion,t.set(o,h),o.addEventListener("dispose",r),h.texture):null}}}return o}function s(o){let c=0;const l=6;for(let u=0;u<l;u++)o[u]!==void 0&&c++;return c===l}function r(o){const c=o.target;c.removeEventListener("dispose",r);const l=t.get(c);l!==void 0&&(t.delete(c),l.dispose())}function a(){t=new WeakMap,e!==null&&(e.dispose(),e=null)}return{get:i,dispose:a}}function cb(n){const t={};function e(i){if(t[i]!==void 0)return t[i];let s;switch(i){case"WEBGL_depth_texture":s=n.getExtension("WEBGL_depth_texture")||n.getExtension("MOZ_WEBGL_depth_texture")||n.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":s=n.getExtension("EXT_texture_filter_anisotropic")||n.getExtension("MOZ_EXT_texture_filter_anisotropic")||n.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":s=n.getExtension("WEBGL_compressed_texture_s3tc")||n.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||n.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":s=n.getExtension("WEBGL_compressed_texture_pvrtc")||n.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:s=n.getExtension(i)}return t[i]=s,s}return{has:function(i){return e(i)!==null},init:function(){e("EXT_color_buffer_float"),e("WEBGL_clip_cull_distance"),e("OES_texture_float_linear"),e("EXT_color_buffer_half_float"),e("WEBGL_multisampled_render_to_texture"),e("WEBGL_render_shared_exponent")},get:function(i){const s=e(i);return s===null&&xc("THREE.WebGLRenderer: "+i+" extension not supported."),s}}}function lb(n,t,e,i){const s={},r=new WeakMap;function a(h){const f=h.target;f.index!==null&&t.remove(f.index);for(const p in f.attributes)t.remove(f.attributes[p]);f.removeEventListener("dispose",a),delete s[f.id];const d=r.get(f);d&&(t.remove(d),r.delete(f)),i.releaseStatesOfGeometry(f),f.isInstancedBufferGeometry===!0&&delete f._maxInstanceCount,e.memory.geometries--}function o(h,f){return s[f.id]===!0||(f.addEventListener("dispose",a),s[f.id]=!0,e.memory.geometries++),f}function c(h){const f=h.attributes;for(const d in f)t.update(f[d],n.ARRAY_BUFFER)}function l(h){const f=[],d=h.index,p=h.attributes.position;let v=0;if(d!==null){const M=d.array;v=d.version;for(let x=0,_=M.length;x<_;x+=3){const b=M[x+0],S=M[x+1],T=M[x+2];f.push(b,S,S,T,T,b)}}else if(p!==void 0){const M=p.array;v=p.version;for(let x=0,_=M.length/3-1;x<_;x+=3){const b=x+0,S=x+1,T=x+2;f.push(b,S,S,T,T,b)}}else return;const g=new(Ng(f)?Bg:ad)(f,1);g.version=v;const m=r.get(h);m&&t.remove(m),r.set(h,g)}function u(h){const f=r.get(h);if(f){const d=h.index;d!==null&&f.version<d.version&&l(h)}else l(h);return r.get(h)}return{get:o,update:c,getWireframeAttribute:u}}function hb(n,t,e){let i;function s(f){i=f}let r,a;function o(f){r=f.type,a=f.bytesPerElement}function c(f,d){n.drawElements(i,d,r,f*a),e.update(d,i,1)}function l(f,d,p){p!==0&&(n.drawElementsInstanced(i,d,r,f*a,p),e.update(d,i,p))}function u(f,d,p){if(p===0)return;t.get("WEBGL_multi_draw").multiDrawElementsWEBGL(i,d,0,r,f,0,p);let g=0;for(let m=0;m<p;m++)g+=d[m];e.update(g,i,1)}function h(f,d,p,v){if(p===0)return;const g=t.get("WEBGL_multi_draw");if(g===null)for(let m=0;m<f.length;m++)l(f[m]/a,d[m],v[m]);else{g.multiDrawElementsInstancedWEBGL(i,d,0,r,f,0,v,0,p);let m=0;for(let M=0;M<p;M++)m+=d[M]*v[M];e.update(m,i,1)}}this.setMode=s,this.setIndex=o,this.render=c,this.renderInstances=l,this.renderMultiDraw=u,this.renderMultiDrawInstances=h}function ub(n){const t={geometries:0,textures:0},e={frame:0,calls:0,triangles:0,points:0,lines:0};function i(r,a,o){switch(e.calls++,a){case n.TRIANGLES:e.triangles+=o*(r/3);break;case n.LINES:e.lines+=o*(r/2);break;case n.LINE_STRIP:e.lines+=o*(r-1);break;case n.LINE_LOOP:e.lines+=o*r;break;case n.POINTS:e.points+=o*r;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",a);break}}function s(){e.calls=0,e.triangles=0,e.points=0,e.lines=0}return{memory:t,render:e,programs:null,autoReset:!0,reset:s,update:i}}function fb(n,t,e){const i=new WeakMap,s=new fe;function r(a,o,c){const l=a.morphTargetInfluences,u=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,h=u!==void 0?u.length:0;let f=i.get(o);if(f===void 0||f.count!==h){let w=function(){T.dispose(),i.delete(o),o.removeEventListener("dispose",w)};f!==void 0&&f.texture.dispose();const d=o.morphAttributes.position!==void 0,p=o.morphAttributes.normal!==void 0,v=o.morphAttributes.color!==void 0,g=o.morphAttributes.position||[],m=o.morphAttributes.normal||[],M=o.morphAttributes.color||[];let x=0;d===!0&&(x=1),p===!0&&(x=2),v===!0&&(x=3);let _=o.attributes.position.count*x,b=1;_>t.maxTextureSize&&(b=Math.ceil(_/t.maxTextureSize),_=t.maxTextureSize);const S=new Float32Array(_*b*4*h),T=new sd(S,_,b,h);T.type=is,T.needsUpdate=!0;const A=x*4;for(let y=0;y<h;y++){const E=g[y],R=m[y],L=M[y],I=_*b*4*y;for(let N=0;N<E.count;N++){const B=N*A;d===!0&&(s.fromBufferAttribute(E,N),S[I+B+0]=s.x,S[I+B+1]=s.y,S[I+B+2]=s.z,S[I+B+3]=0),p===!0&&(s.fromBufferAttribute(R,N),S[I+B+4]=s.x,S[I+B+5]=s.y,S[I+B+6]=s.z,S[I+B+7]=0),v===!0&&(s.fromBufferAttribute(L,N),S[I+B+8]=s.x,S[I+B+9]=s.y,S[I+B+10]=s.z,S[I+B+11]=L.itemSize===4?s.w:1)}}f={count:h,texture:T,size:new ht(_,b)},i.set(o,f),o.addEventListener("dispose",w)}if(a.isInstancedMesh===!0&&a.morphTexture!==null)c.getUniforms().setValue(n,"morphTexture",a.morphTexture,e);else{let d=0;for(let v=0;v<l.length;v++)d+=l[v];const p=o.morphTargetsRelative?1:1-d;c.getUniforms().setValue(n,"morphTargetBaseInfluence",p),c.getUniforms().setValue(n,"morphTargetInfluences",l)}c.getUniforms().setValue(n,"morphTargetsTexture",f.texture,e),c.getUniforms().setValue(n,"morphTargetsTextureSize",f.size)}return{update:r}}function db(n,t,e,i){let s=new WeakMap;function r(c){const l=i.render.frame,u=c.geometry,h=t.get(c,u);if(s.get(h)!==l&&(t.update(h),s.set(h,l)),c.isInstancedMesh&&(c.hasEventListener("dispose",o)===!1&&c.addEventListener("dispose",o),s.get(c)!==l&&(e.update(c.instanceMatrix,n.ARRAY_BUFFER),c.instanceColor!==null&&e.update(c.instanceColor,n.ARRAY_BUFFER),s.set(c,l))),c.isSkinnedMesh){const f=c.skeleton;s.get(f)!==l&&(f.update(),s.set(f,l))}return h}function a(){s=new WeakMap}function o(c){const l=c.target;l.removeEventListener("dispose",o),e.remove(l.instanceMatrix),l.instanceColor!==null&&e.remove(l.instanceColor)}return{update:r,dispose:a}}const a2=new un,rp=new qg(1,1),o2=new sd,c2=new KM,l2=new Vg,ap=[],op=[],cp=new Float32Array(16),lp=new Float32Array(9),hp=new Float32Array(4);function Eo(n,t,e){const i=n[0];if(i<=0||i>0)return n;const s=t*e;let r=ap[s];if(r===void 0&&(r=new Float32Array(s),ap[s]=r),t!==0){i.toArray(r,0);for(let a=1,o=0;a!==t;++a)o+=e,n[a].toArray(r,o)}return r}function Je(n,t){if(n.length!==t.length)return!1;for(let e=0,i=n.length;e<i;e++)if(n[e]!==t[e])return!1;return!0}function Ke(n,t){for(let e=0,i=t.length;e<i;e++)n[e]=t[e]}function Uh(n,t){let e=op[t];e===void 0&&(e=new Int32Array(t),op[t]=e);for(let i=0;i!==t;++i)e[i]=n.allocateTextureUnit();return e}function pb(n,t){const e=this.cache;e[0]!==t&&(n.uniform1f(this.addr,t),e[0]=t)}function mb(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(n.uniform2f(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Je(e,t))return;n.uniform2fv(this.addr,t),Ke(e,t)}}function gb(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(n.uniform3f(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else if(t.r!==void 0)(e[0]!==t.r||e[1]!==t.g||e[2]!==t.b)&&(n.uniform3f(this.addr,t.r,t.g,t.b),e[0]=t.r,e[1]=t.g,e[2]=t.b);else{if(Je(e,t))return;n.uniform3fv(this.addr,t),Ke(e,t)}}function vb(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(n.uniform4f(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Je(e,t))return;n.uniform4fv(this.addr,t),Ke(e,t)}}function xb(n,t){const e=this.cache,i=t.elements;if(i===void 0){if(Je(e,t))return;n.uniformMatrix2fv(this.addr,!1,t),Ke(e,t)}else{if(Je(e,i))return;hp.set(i),n.uniformMatrix2fv(this.addr,!1,hp),Ke(e,i)}}function Mb(n,t){const e=this.cache,i=t.elements;if(i===void 0){if(Je(e,t))return;n.uniformMatrix3fv(this.addr,!1,t),Ke(e,t)}else{if(Je(e,i))return;lp.set(i),n.uniformMatrix3fv(this.addr,!1,lp),Ke(e,i)}}function _b(n,t){const e=this.cache,i=t.elements;if(i===void 0){if(Je(e,t))return;n.uniformMatrix4fv(this.addr,!1,t),Ke(e,t)}else{if(Je(e,i))return;cp.set(i),n.uniformMatrix4fv(this.addr,!1,cp),Ke(e,i)}}function wb(n,t){const e=this.cache;e[0]!==t&&(n.uniform1i(this.addr,t),e[0]=t)}function bb(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(n.uniform2i(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Je(e,t))return;n.uniform2iv(this.addr,t),Ke(e,t)}}function yb(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(n.uniform3i(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(Je(e,t))return;n.uniform3iv(this.addr,t),Ke(e,t)}}function Sb(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(n.uniform4i(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Je(e,t))return;n.uniform4iv(this.addr,t),Ke(e,t)}}function Eb(n,t){const e=this.cache;e[0]!==t&&(n.uniform1ui(this.addr,t),e[0]=t)}function Tb(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(n.uniform2ui(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Je(e,t))return;n.uniform2uiv(this.addr,t),Ke(e,t)}}function Ab(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(n.uniform3ui(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(Je(e,t))return;n.uniform3uiv(this.addr,t),Ke(e,t)}}function Rb(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(n.uniform4ui(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Je(e,t))return;n.uniform4uiv(this.addr,t),Ke(e,t)}}function Cb(n,t,e){const i=this.cache,s=e.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s);let r;this.type===n.SAMPLER_2D_SHADOW?(rp.compareFunction=Fg,r=rp):r=a2,e.setTexture2D(t||r,s)}function Lb(n,t,e){const i=this.cache,s=e.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s),e.setTexture3D(t||c2,s)}function Pb(n,t,e){const i=this.cache,s=e.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s),e.setTextureCube(t||l2,s)}function Ib(n,t,e){const i=this.cache,s=e.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s),e.setTexture2DArray(t||o2,s)}function Db(n){switch(n){case 5126:return pb;case 35664:return mb;case 35665:return gb;case 35666:return vb;case 35674:return xb;case 35675:return Mb;case 35676:return _b;case 5124:case 35670:return wb;case 35667:case 35671:return bb;case 35668:case 35672:return yb;case 35669:case 35673:return Sb;case 5125:return Eb;case 36294:return Tb;case 36295:return Ab;case 36296:return Rb;case 35678:case 36198:case 36298:case 36306:case 35682:return Cb;case 35679:case 36299:case 36307:return Lb;case 35680:case 36300:case 36308:case 36293:return Pb;case 36289:case 36303:case 36311:case 36292:return Ib}}function Ub(n,t){n.uniform1fv(this.addr,t)}function Fb(n,t){const e=Eo(t,this.size,2);n.uniform2fv(this.addr,e)}function Nb(n,t){const e=Eo(t,this.size,3);n.uniform3fv(this.addr,e)}function kb(n,t){const e=Eo(t,this.size,4);n.uniform4fv(this.addr,e)}function Ob(n,t){const e=Eo(t,this.size,4);n.uniformMatrix2fv(this.addr,!1,e)}function Bb(n,t){const e=Eo(t,this.size,9);n.uniformMatrix3fv(this.addr,!1,e)}function Hb(n,t){const e=Eo(t,this.size,16);n.uniformMatrix4fv(this.addr,!1,e)}function zb(n,t){n.uniform1iv(this.addr,t)}function Vb(n,t){n.uniform2iv(this.addr,t)}function Gb(n,t){n.uniform3iv(this.addr,t)}function Wb(n,t){n.uniform4iv(this.addr,t)}function Xb(n,t){n.uniform1uiv(this.addr,t)}function $b(n,t){n.uniform2uiv(this.addr,t)}function qb(n,t){n.uniform3uiv(this.addr,t)}function Yb(n,t){n.uniform4uiv(this.addr,t)}function jb(n,t,e){const i=this.cache,s=t.length,r=Uh(e,s);Je(i,r)||(n.uniform1iv(this.addr,r),Ke(i,r));for(let a=0;a!==s;++a)e.setTexture2D(t[a]||a2,r[a])}function Zb(n,t,e){const i=this.cache,s=t.length,r=Uh(e,s);Je(i,r)||(n.uniform1iv(this.addr,r),Ke(i,r));for(let a=0;a!==s;++a)e.setTexture3D(t[a]||c2,r[a])}function Jb(n,t,e){const i=this.cache,s=t.length,r=Uh(e,s);Je(i,r)||(n.uniform1iv(this.addr,r),Ke(i,r));for(let a=0;a!==s;++a)e.setTextureCube(t[a]||l2,r[a])}function Kb(n,t,e){const i=this.cache,s=t.length,r=Uh(e,s);Je(i,r)||(n.uniform1iv(this.addr,r),Ke(i,r));for(let a=0;a!==s;++a)e.setTexture2DArray(t[a]||o2,r[a])}function Qb(n){switch(n){case 5126:return Ub;case 35664:return Fb;case 35665:return Nb;case 35666:return kb;case 35674:return Ob;case 35675:return Bb;case 35676:return Hb;case 5124:case 35670:return zb;case 35667:case 35671:return Vb;case 35668:case 35672:return Gb;case 35669:case 35673:return Wb;case 5125:return Xb;case 36294:return $b;case 36295:return qb;case 36296:return Yb;case 35678:case 36198:case 36298:case 36306:case 35682:return jb;case 35679:case 36299:case 36307:return Zb;case 35680:case 36300:case 36308:case 36293:return Jb;case 36289:case 36303:case 36311:case 36292:return Kb}}class ty{constructor(t,e,i){this.id=t,this.addr=i,this.cache=[],this.type=e.type,this.setValue=Db(e.type)}}class ey{constructor(t,e,i){this.id=t,this.addr=i,this.cache=[],this.type=e.type,this.size=e.size,this.setValue=Qb(e.type)}}class ny{constructor(t){this.id=t,this.seq=[],this.map={}}setValue(t,e,i){const s=this.seq;for(let r=0,a=s.length;r!==a;++r){const o=s[r];o.setValue(t,e[o.id],i)}}}const R0=/(\w+)(\])?(\[|\.)?/g;function up(n,t){n.seq.push(t),n.map[t.id]=t}function iy(n,t,e){const i=n.name,s=i.length;for(R0.lastIndex=0;;){const r=R0.exec(i),a=R0.lastIndex;let o=r[1];const c=r[2]==="]",l=r[3];if(c&&(o=o|0),l===void 0||l==="["&&a+2===s){up(e,l===void 0?new ty(o,n,t):new ey(o,n,t));break}else{let h=e.map[o];h===void 0&&(h=new ny(o),up(e,h)),e=h}}}class zl{constructor(t,e){this.seq=[],this.map={};const i=t.getProgramParameter(e,t.ACTIVE_UNIFORMS);for(let s=0;s<i;++s){const r=t.getActiveUniform(e,s),a=t.getUniformLocation(e,r.name);iy(r,a,this)}}setValue(t,e,i,s){const r=this.map[e];r!==void 0&&r.setValue(t,i,s)}setOptional(t,e,i){const s=e[i];s!==void 0&&this.setValue(t,i,s)}static upload(t,e,i,s){for(let r=0,a=e.length;r!==a;++r){const o=e[r],c=i[o.id];c.needsUpdate!==!1&&o.setValue(t,c.value,s)}}static seqWithValue(t,e){const i=[];for(let s=0,r=t.length;s!==r;++s){const a=t[s];a.id in e&&i.push(a)}return i}}function fp(n,t,e){const i=n.createShader(t);return n.shaderSource(i,e),n.compileShader(i),i}const sy=37297;let ry=0;function ay(n,t){const e=n.split(`
`),i=[],s=Math.max(t-6,0),r=Math.min(t+6,e.length);for(let a=s;a<r;a++){const o=a+1;i.push(`${o===t?">":" "} ${o}: ${e[a]}`)}return i.join(`
`)}const dp=new le;function oy(n){ve._getMatrix(dp,ve.workingColorSpace,n);const t=`mat3( ${dp.elements.map(e=>e.toFixed(4))} )`;switch(ve.getTransfer(n)){case ih:return[t,"LinearTransferOETF"];case Se:return[t,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space: ",n),[t,"LinearTransferOETF"]}}function pp(n,t,e){const i=n.getShaderParameter(t,n.COMPILE_STATUS),r=(n.getShaderInfoLog(t)||"").trim();if(i&&r==="")return"";const a=/ERROR: 0:(\d+)/.exec(r);if(a){const o=parseInt(a[1]);return e.toUpperCase()+`

`+r+`

`+ay(n.getShaderSource(t),o)}else return r}function cy(n,t){const e=oy(t);return[`vec4 ${n}( vec4 value ) {`,`	return ${e[1]}( vec4( value.rgb * ${e[0]}, value.a ) );`,"}"].join(`
`)}function ly(n,t){let e;switch(t){case hM:e="Linear";break;case uM:e="Reinhard";break;case fM:e="Cineon";break;case dM:e="ACESFilmic";break;case mM:e="AgX";break;case Eg:e="Neutral";break;case pM:e="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",t),e="Linear"}return"vec3 "+n+"( vec3 color ) { return "+e+"ToneMapping( color ); }"}const Ml=new C;function hy(){ve.getLuminanceCoefficients(Ml);const n=Ml.x.toFixed(4),t=Ml.y.toFixed(4),e=Ml.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${n}, ${t}, ${e} );`,"	return dot( weights, rgb );","}"].join(`
`)}function uy(n){return[n.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",n.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(Qo).join(`
`)}function fy(n){const t=[];for(const e in n){const i=n[e];i!==!1&&t.push("#define "+e+" "+i)}return t.join(`
`)}function dy(n,t){const e={},i=n.getProgramParameter(t,n.ACTIVE_ATTRIBUTES);for(let s=0;s<i;s++){const r=n.getActiveAttrib(t,s),a=r.name;let o=1;r.type===n.FLOAT_MAT2&&(o=2),r.type===n.FLOAT_MAT3&&(o=3),r.type===n.FLOAT_MAT4&&(o=4),e[a]={type:r.type,location:n.getAttribLocation(t,a),locationSize:o}}return e}function Qo(n){return n!==""}function mp(n,t){const e=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return n.replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,e).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows)}function gp(n,t){return n.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}const py=/^[ \t]*#include +<([\w\d./]+)>/gm;function uf(n){return n.replace(py,gy)}const my=new Map;function gy(n,t){let e=he[t];if(e===void 0){const i=my.get(t);if(i!==void 0)e=he[i],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',t,i);else throw new Error("Can not resolve #include <"+t+">")}return uf(e)}const vy=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function vp(n){return n.replace(vy,xy)}function xy(n,t,e,i){let s="";for(let r=parseInt(t);r<parseInt(e);r++)s+=i.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return s}function xp(n){let t=`precision ${n.precision} float;
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
#define LOW_PRECISION`),t}function My(n){let t="SHADOWMAP_TYPE_BASIC";return n.shadowMapType===Mg?t="SHADOWMAP_TYPE_PCF":n.shadowMapType===_g?t="SHADOWMAP_TYPE_PCF_SOFT":n.shadowMapType===Ms&&(t="SHADOWMAP_TYPE_VSM"),t}function _y(n){let t="ENVMAP_TYPE_CUBE";if(n.envMap)switch(n.envMapMode){case lo:case ho:t="ENVMAP_TYPE_CUBE";break;case Ih:t="ENVMAP_TYPE_CUBE_UV";break}return t}function wy(n){let t="ENVMAP_MODE_REFLECTION";if(n.envMap)switch(n.envMapMode){case ho:t="ENVMAP_MODE_REFRACTION";break}return t}function by(n){let t="ENVMAP_BLENDING_NONE";if(n.envMap)switch(n.combine){case Sg:t="ENVMAP_BLENDING_MULTIPLY";break;case cM:t="ENVMAP_BLENDING_MIX";break;case lM:t="ENVMAP_BLENDING_ADD";break}return t}function yy(n){const t=n.envMapCubeUVHeight;if(t===null)return null;const e=Math.log2(t)-2,i=1/t;return{texelWidth:1/(3*Math.max(Math.pow(2,e),112)),texelHeight:i,maxMip:e}}function Sy(n,t,e,i){const s=n.getContext(),r=e.defines;let a=e.vertexShader,o=e.fragmentShader;const c=My(e),l=_y(e),u=wy(e),h=by(e),f=yy(e),d=uy(e),p=fy(r),v=s.createProgram();let g,m,M=e.glslVersion?"#version "+e.glslVersion+`
`:"";e.isRawShaderMaterial?(g=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,p].filter(Qo).join(`
`),g.length>0&&(g+=`
`),m=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,p].filter(Qo).join(`
`),m.length>0&&(m+=`
`)):(g=[xp(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,p,e.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",e.batching?"#define USE_BATCHING":"",e.batchingColor?"#define USE_BATCHING_COLOR":"",e.instancing?"#define USE_INSTANCING":"",e.instancingColor?"#define USE_INSTANCING_COLOR":"",e.instancingMorph?"#define USE_INSTANCING_MORPH":"",e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.map?"#define USE_MAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+u:"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.displacementMap?"#define USE_DISPLACEMENTMAP":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.mapUv?"#define MAP_UV "+e.mapUv:"",e.alphaMapUv?"#define ALPHAMAP_UV "+e.alphaMapUv:"",e.lightMapUv?"#define LIGHTMAP_UV "+e.lightMapUv:"",e.aoMapUv?"#define AOMAP_UV "+e.aoMapUv:"",e.emissiveMapUv?"#define EMISSIVEMAP_UV "+e.emissiveMapUv:"",e.bumpMapUv?"#define BUMPMAP_UV "+e.bumpMapUv:"",e.normalMapUv?"#define NORMALMAP_UV "+e.normalMapUv:"",e.displacementMapUv?"#define DISPLACEMENTMAP_UV "+e.displacementMapUv:"",e.metalnessMapUv?"#define METALNESSMAP_UV "+e.metalnessMapUv:"",e.roughnessMapUv?"#define ROUGHNESSMAP_UV "+e.roughnessMapUv:"",e.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+e.anisotropyMapUv:"",e.clearcoatMapUv?"#define CLEARCOATMAP_UV "+e.clearcoatMapUv:"",e.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+e.clearcoatNormalMapUv:"",e.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+e.clearcoatRoughnessMapUv:"",e.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+e.iridescenceMapUv:"",e.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+e.iridescenceThicknessMapUv:"",e.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+e.sheenColorMapUv:"",e.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+e.sheenRoughnessMapUv:"",e.specularMapUv?"#define SPECULARMAP_UV "+e.specularMapUv:"",e.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+e.specularColorMapUv:"",e.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+e.specularIntensityMapUv:"",e.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+e.transmissionMapUv:"",e.thicknessMapUv?"#define THICKNESSMAP_UV "+e.thicknessMapUv:"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.flatShading?"#define FLAT_SHADED":"",e.skinning?"#define USE_SKINNING":"",e.morphTargets?"#define USE_MORPHTARGETS":"",e.morphNormals&&e.flatShading===!1?"#define USE_MORPHNORMALS":"",e.morphColors?"#define USE_MORPHCOLORS":"",e.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+e.morphTextureStride:"",e.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+e.morphTargetsCount:"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+c:"",e.sizeAttenuation?"#define USE_SIZEATTENUATION":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",e.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(Qo).join(`
`),m=[xp(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,p,e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",e.map?"#define USE_MAP":"",e.matcap?"#define USE_MATCAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+l:"",e.envMap?"#define "+u:"",e.envMap?"#define "+h:"",f?"#define CUBEUV_TEXEL_WIDTH "+f.texelWidth:"",f?"#define CUBEUV_TEXEL_HEIGHT "+f.texelHeight:"",f?"#define CUBEUV_MAX_MIP "+f.maxMip+".0":"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoat?"#define USE_CLEARCOAT":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.dispersion?"#define USE_DISPERSION":"",e.iridescence?"#define USE_IRIDESCENCE":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaTest?"#define USE_ALPHATEST":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.sheen?"#define USE_SHEEN":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors||e.instancingColor||e.batchingColor?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.gradientMap?"#define USE_GRADIENTMAP":"",e.flatShading?"#define FLAT_SHADED":"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+c:"",e.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",e.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",e.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",e.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",e.toneMapping!==nr?"#define TONE_MAPPING":"",e.toneMapping!==nr?he.tonemapping_pars_fragment:"",e.toneMapping!==nr?ly("toneMapping",e.toneMapping):"",e.dithering?"#define DITHERING":"",e.opaque?"#define OPAQUE":"",he.colorspace_pars_fragment,cy("linearToOutputTexel",e.outputColorSpace),hy(),e.useDepthPacking?"#define DEPTH_PACKING "+e.depthPacking:"",`
`].filter(Qo).join(`
`)),a=uf(a),a=mp(a,e),a=gp(a,e),o=uf(o),o=mp(o,e),o=gp(o,e),a=vp(a),o=vp(o),e.isRawShaderMaterial!==!0&&(M=`#version 300 es
`,g=[d,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+g,m=["#define varying in",e.glslVersion===m1?"":"layout(location = 0) out highp vec4 pc_fragColor;",e.glslVersion===m1?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+m);const x=M+g+a,_=M+m+o,b=fp(s,s.VERTEX_SHADER,x),S=fp(s,s.FRAGMENT_SHADER,_);s.attachShader(v,b),s.attachShader(v,S),e.index0AttributeName!==void 0?s.bindAttribLocation(v,0,e.index0AttributeName):e.morphTargets===!0&&s.bindAttribLocation(v,0,"position"),s.linkProgram(v);function T(E){if(n.debug.checkShaderErrors){const R=s.getProgramInfoLog(v)||"",L=s.getShaderInfoLog(b)||"",I=s.getShaderInfoLog(S)||"",N=R.trim(),B=L.trim(),X=I.trim();let H=!0,Y=!0;if(s.getProgramParameter(v,s.LINK_STATUS)===!1)if(H=!1,typeof n.debug.onShaderError=="function")n.debug.onShaderError(s,v,b,S);else{const it=pp(s,b,"vertex"),dt=pp(s,S,"fragment");console.error("THREE.WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(v,s.VALIDATE_STATUS)+`

Material Name: `+E.name+`
Material Type: `+E.type+`

Program Info Log: `+N+`
`+it+`
`+dt)}else N!==""?console.warn("THREE.WebGLProgram: Program Info Log:",N):(B===""||X==="")&&(Y=!1);Y&&(E.diagnostics={runnable:H,programLog:N,vertexShader:{log:B,prefix:g},fragmentShader:{log:X,prefix:m}})}s.deleteShader(b),s.deleteShader(S),A=new zl(s,v),w=dy(s,v)}let A;this.getUniforms=function(){return A===void 0&&T(this),A};let w;this.getAttributes=function(){return w===void 0&&T(this),w};let y=e.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return y===!1&&(y=s.getProgramParameter(v,sy)),y},this.destroy=function(){i.releaseStatesOfProgram(this),s.deleteProgram(v),this.program=void 0},this.type=e.shaderType,this.name=e.shaderName,this.id=ry++,this.cacheKey=t,this.usedTimes=1,this.program=v,this.vertexShader=b,this.fragmentShader=S,this}let Ey=0;class Ty{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(t){const e=t.vertexShader,i=t.fragmentShader,s=this._getShaderStage(e),r=this._getShaderStage(i),a=this._getShaderCacheForMaterial(t);return a.has(s)===!1&&(a.add(s),s.usedTimes++),a.has(r)===!1&&(a.add(r),r.usedTimes++),this}remove(t){const e=this.materialCache.get(t);for(const i of e)i.usedTimes--,i.usedTimes===0&&this.shaderCache.delete(i.code);return this.materialCache.delete(t),this}getVertexShaderID(t){return this._getShaderStage(t.vertexShader).id}getFragmentShaderID(t){return this._getShaderStage(t.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(t){const e=this.materialCache;let i=e.get(t);return i===void 0&&(i=new Set,e.set(t,i)),i}_getShaderStage(t){const e=this.shaderCache;let i=e.get(t);return i===void 0&&(i=new Ay(t),e.set(t,i)),i}}class Ay{constructor(t){this.id=Ey++,this.code=t,this.usedTimes=0}}function Ry(n,t,e,i,s,r,a){const o=new kg,c=new Ty,l=new Set,u=[],h=s.logarithmicDepthBuffer,f=s.vertexTextures;let d=s.precision;const p={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function v(w){return l.add(w),w===0?"uv":`uv${w}`}function g(w,y,E,R,L){const I=R.fog,N=L.geometry,B=w.isMeshStandardMaterial?R.environment:null,X=(w.isMeshStandardMaterial?e:t).get(w.envMap||B),H=X&&X.mapping===Ih?X.image.height:null,Y=p[w.type];w.precision!==null&&(d=s.getMaxPrecision(w.precision),d!==w.precision&&console.warn("THREE.WebGLProgram.getParameters:",w.precision,"not supported, using",d,"instead."));const it=N.morphAttributes.position||N.morphAttributes.normal||N.morphAttributes.color,dt=it!==void 0?it.length:0;let vt=0;N.morphAttributes.position!==void 0&&(vt=1),N.morphAttributes.normal!==void 0&&(vt=2),N.morphAttributes.color!==void 0&&(vt=3);let St,Ct,Ft,V;if(Y){const _e=Zi[Y];St=_e.vertexShader,Ct=_e.fragmentShader}else St=w.vertexShader,Ct=w.fragmentShader,c.update(w),Ft=c.getVertexShaderID(w),V=c.getFragmentShaderID(w);const $=n.getRenderTarget(),z=n.state.buffers.depth.getReversed(),W=L.isInstancedMesh===!0,G=L.isBatchedMesh===!0,tt=!!w.map,ot=!!w.matcap,F=!!X,et=!!w.aoMap,Q=!!w.lightMap,rt=!!w.bumpMap,ut=!!w.normalMap,mt=!!w.displacementMap,Mt=!!w.emissiveMap,wt=!!w.metalnessMap,ee=!!w.roughnessMap,Kt=w.anisotropy>0,k=w.clearcoat>0,P=w.dispersion>0,J=w.iridescence>0,ft=w.sheen>0,_t=w.transmission>0,pt=Kt&&!!w.anisotropyMap,Gt=k&&!!w.clearcoatMap,At=k&&!!w.clearcoatNormalMap,Ht=k&&!!w.clearcoatRoughnessMap,zt=J&&!!w.iridescenceMap,bt=J&&!!w.iridescenceThicknessMap,Nt=ft&&!!w.sheenColorMap,Qt=ft&&!!w.sheenRoughnessMap,Wt=!!w.specularMap,It=!!w.specularColorMap,ce=!!w.specularIntensityMap,q=_t&&!!w.transmissionMap,Tt=_t&&!!w.thicknessMap,Rt=!!w.gradientMap,Ot=!!w.alphaMap,yt=w.alphaTest>0,xt=!!w.alphaHash,Vt=!!w.extensions;let oe=nr;w.toneMapped&&($===null||$.isXRRenderTarget===!0)&&(oe=n.toneMapping);const Re={shaderID:Y,shaderType:w.type,shaderName:w.name,vertexShader:St,fragmentShader:Ct,defines:w.defines,customVertexShaderID:Ft,customFragmentShaderID:V,isRawShaderMaterial:w.isRawShaderMaterial===!0,glslVersion:w.glslVersion,precision:d,batching:G,batchingColor:G&&L._colorsTexture!==null,instancing:W,instancingColor:W&&L.instanceColor!==null,instancingMorph:W&&L.morphTexture!==null,supportsVertexTextures:f,outputColorSpace:$===null?n.outputColorSpace:$.isXRRenderTarget===!0?$.texture.colorSpace:qr,alphaToCoverage:!!w.alphaToCoverage,map:tt,matcap:ot,envMap:F,envMapMode:F&&X.mapping,envMapCubeUVHeight:H,aoMap:et,lightMap:Q,bumpMap:rt,normalMap:ut,displacementMap:f&&mt,emissiveMap:Mt,normalMapObjectSpace:ut&&w.normalMapType===_M,normalMapTangentSpace:ut&&w.normalMapType===Ug,metalnessMap:wt,roughnessMap:ee,anisotropy:Kt,anisotropyMap:pt,clearcoat:k,clearcoatMap:Gt,clearcoatNormalMap:At,clearcoatRoughnessMap:Ht,dispersion:P,iridescence:J,iridescenceMap:zt,iridescenceThicknessMap:bt,sheen:ft,sheenColorMap:Nt,sheenRoughnessMap:Qt,specularMap:Wt,specularColorMap:It,specularIntensityMap:ce,transmission:_t,transmissionMap:q,thicknessMap:Tt,gradientMap:Rt,opaque:w.transparent===!1&&w.blending===ja&&w.alphaToCoverage===!1,alphaMap:Ot,alphaTest:yt,alphaHash:xt,combine:w.combine,mapUv:tt&&v(w.map.channel),aoMapUv:et&&v(w.aoMap.channel),lightMapUv:Q&&v(w.lightMap.channel),bumpMapUv:rt&&v(w.bumpMap.channel),normalMapUv:ut&&v(w.normalMap.channel),displacementMapUv:mt&&v(w.displacementMap.channel),emissiveMapUv:Mt&&v(w.emissiveMap.channel),metalnessMapUv:wt&&v(w.metalnessMap.channel),roughnessMapUv:ee&&v(w.roughnessMap.channel),anisotropyMapUv:pt&&v(w.anisotropyMap.channel),clearcoatMapUv:Gt&&v(w.clearcoatMap.channel),clearcoatNormalMapUv:At&&v(w.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:Ht&&v(w.clearcoatRoughnessMap.channel),iridescenceMapUv:zt&&v(w.iridescenceMap.channel),iridescenceThicknessMapUv:bt&&v(w.iridescenceThicknessMap.channel),sheenColorMapUv:Nt&&v(w.sheenColorMap.channel),sheenRoughnessMapUv:Qt&&v(w.sheenRoughnessMap.channel),specularMapUv:Wt&&v(w.specularMap.channel),specularColorMapUv:It&&v(w.specularColorMap.channel),specularIntensityMapUv:ce&&v(w.specularIntensityMap.channel),transmissionMapUv:q&&v(w.transmissionMap.channel),thicknessMapUv:Tt&&v(w.thicknessMap.channel),alphaMapUv:Ot&&v(w.alphaMap.channel),vertexTangents:!!N.attributes.tangent&&(ut||Kt),vertexColors:w.vertexColors,vertexAlphas:w.vertexColors===!0&&!!N.attributes.color&&N.attributes.color.itemSize===4,pointsUvs:L.isPoints===!0&&!!N.attributes.uv&&(tt||Ot),fog:!!I,useFog:w.fog===!0,fogExp2:!!I&&I.isFogExp2,flatShading:w.flatShading===!0&&w.wireframe===!1,sizeAttenuation:w.sizeAttenuation===!0,logarithmicDepthBuffer:h,reversedDepthBuffer:z,skinning:L.isSkinnedMesh===!0,morphTargets:N.morphAttributes.position!==void 0,morphNormals:N.morphAttributes.normal!==void 0,morphColors:N.morphAttributes.color!==void 0,morphTargetsCount:dt,morphTextureStride:vt,numDirLights:y.directional.length,numPointLights:y.point.length,numSpotLights:y.spot.length,numSpotLightMaps:y.spotLightMap.length,numRectAreaLights:y.rectArea.length,numHemiLights:y.hemi.length,numDirLightShadows:y.directionalShadowMap.length,numPointLightShadows:y.pointShadowMap.length,numSpotLightShadows:y.spotShadowMap.length,numSpotLightShadowsWithMaps:y.numSpotLightShadowsWithMaps,numLightProbes:y.numLightProbes,numClippingPlanes:a.numPlanes,numClipIntersection:a.numIntersection,dithering:w.dithering,shadowMapEnabled:n.shadowMap.enabled&&E.length>0,shadowMapType:n.shadowMap.type,toneMapping:oe,decodeVideoTexture:tt&&w.map.isVideoTexture===!0&&ve.getTransfer(w.map.colorSpace)===Se,decodeVideoTextureEmissive:Mt&&w.emissiveMap.isVideoTexture===!0&&ve.getTransfer(w.emissiveMap.colorSpace)===Se,premultipliedAlpha:w.premultipliedAlpha,doubleSided:w.side===Te,flipSided:w.side===Bn,useDepthPacking:w.depthPacking>=0,depthPacking:w.depthPacking||0,index0AttributeName:w.index0AttributeName,extensionClipCullDistance:Vt&&w.extensions.clipCullDistance===!0&&i.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(Vt&&w.extensions.multiDraw===!0||G)&&i.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:i.has("KHR_parallel_shader_compile"),customProgramCacheKey:w.customProgramCacheKey()};return Re.vertexUv1s=l.has(1),Re.vertexUv2s=l.has(2),Re.vertexUv3s=l.has(3),l.clear(),Re}function m(w){const y=[];if(w.shaderID?y.push(w.shaderID):(y.push(w.customVertexShaderID),y.push(w.customFragmentShaderID)),w.defines!==void 0)for(const E in w.defines)y.push(E),y.push(w.defines[E]);return w.isRawShaderMaterial===!1&&(M(y,w),x(y,w),y.push(n.outputColorSpace)),y.push(w.customProgramCacheKey),y.join()}function M(w,y){w.push(y.precision),w.push(y.outputColorSpace),w.push(y.envMapMode),w.push(y.envMapCubeUVHeight),w.push(y.mapUv),w.push(y.alphaMapUv),w.push(y.lightMapUv),w.push(y.aoMapUv),w.push(y.bumpMapUv),w.push(y.normalMapUv),w.push(y.displacementMapUv),w.push(y.emissiveMapUv),w.push(y.metalnessMapUv),w.push(y.roughnessMapUv),w.push(y.anisotropyMapUv),w.push(y.clearcoatMapUv),w.push(y.clearcoatNormalMapUv),w.push(y.clearcoatRoughnessMapUv),w.push(y.iridescenceMapUv),w.push(y.iridescenceThicknessMapUv),w.push(y.sheenColorMapUv),w.push(y.sheenRoughnessMapUv),w.push(y.specularMapUv),w.push(y.specularColorMapUv),w.push(y.specularIntensityMapUv),w.push(y.transmissionMapUv),w.push(y.thicknessMapUv),w.push(y.combine),w.push(y.fogExp2),w.push(y.sizeAttenuation),w.push(y.morphTargetsCount),w.push(y.morphAttributeCount),w.push(y.numDirLights),w.push(y.numPointLights),w.push(y.numSpotLights),w.push(y.numSpotLightMaps),w.push(y.numHemiLights),w.push(y.numRectAreaLights),w.push(y.numDirLightShadows),w.push(y.numPointLightShadows),w.push(y.numSpotLightShadows),w.push(y.numSpotLightShadowsWithMaps),w.push(y.numLightProbes),w.push(y.shadowMapType),w.push(y.toneMapping),w.push(y.numClippingPlanes),w.push(y.numClipIntersection),w.push(y.depthPacking)}function x(w,y){o.disableAll(),y.supportsVertexTextures&&o.enable(0),y.instancing&&o.enable(1),y.instancingColor&&o.enable(2),y.instancingMorph&&o.enable(3),y.matcap&&o.enable(4),y.envMap&&o.enable(5),y.normalMapObjectSpace&&o.enable(6),y.normalMapTangentSpace&&o.enable(7),y.clearcoat&&o.enable(8),y.iridescence&&o.enable(9),y.alphaTest&&o.enable(10),y.vertexColors&&o.enable(11),y.vertexAlphas&&o.enable(12),y.vertexUv1s&&o.enable(13),y.vertexUv2s&&o.enable(14),y.vertexUv3s&&o.enable(15),y.vertexTangents&&o.enable(16),y.anisotropy&&o.enable(17),y.alphaHash&&o.enable(18),y.batching&&o.enable(19),y.dispersion&&o.enable(20),y.batchingColor&&o.enable(21),y.gradientMap&&o.enable(22),w.push(o.mask),o.disableAll(),y.fog&&o.enable(0),y.useFog&&o.enable(1),y.flatShading&&o.enable(2),y.logarithmicDepthBuffer&&o.enable(3),y.reversedDepthBuffer&&o.enable(4),y.skinning&&o.enable(5),y.morphTargets&&o.enable(6),y.morphNormals&&o.enable(7),y.morphColors&&o.enable(8),y.premultipliedAlpha&&o.enable(9),y.shadowMapEnabled&&o.enable(10),y.doubleSided&&o.enable(11),y.flipSided&&o.enable(12),y.useDepthPacking&&o.enable(13),y.dithering&&o.enable(14),y.transmission&&o.enable(15),y.sheen&&o.enable(16),y.opaque&&o.enable(17),y.pointsUvs&&o.enable(18),y.decodeVideoTexture&&o.enable(19),y.decodeVideoTextureEmissive&&o.enable(20),y.alphaToCoverage&&o.enable(21),w.push(o.mask)}function _(w){const y=p[w.type];let E;if(y){const R=Zi[y];E=p_.clone(R.uniforms)}else E=w.uniforms;return E}function b(w,y){let E;for(let R=0,L=u.length;R<L;R++){const I=u[R];if(I.cacheKey===y){E=I,++E.usedTimes;break}}return E===void 0&&(E=new Sy(n,y,w,r),u.push(E)),E}function S(w){if(--w.usedTimes===0){const y=u.indexOf(w);u[y]=u[u.length-1],u.pop(),w.destroy()}}function T(w){c.remove(w)}function A(){c.dispose()}return{getParameters:g,getProgramCacheKey:m,getUniforms:_,acquireProgram:b,releaseProgram:S,releaseShaderCache:T,programs:u,dispose:A}}function Cy(){let n=new WeakMap;function t(a){return n.has(a)}function e(a){let o=n.get(a);return o===void 0&&(o={},n.set(a,o)),o}function i(a){n.delete(a)}function s(a,o,c){n.get(a)[o]=c}function r(){n=new WeakMap}return{has:t,get:e,remove:i,update:s,dispose:r}}function Ly(n,t){return n.groupOrder!==t.groupOrder?n.groupOrder-t.groupOrder:n.renderOrder!==t.renderOrder?n.renderOrder-t.renderOrder:n.material.id!==t.material.id?n.material.id-t.material.id:n.z!==t.z?n.z-t.z:n.id-t.id}function Mp(n,t){return n.groupOrder!==t.groupOrder?n.groupOrder-t.groupOrder:n.renderOrder!==t.renderOrder?n.renderOrder-t.renderOrder:n.z!==t.z?t.z-n.z:n.id-t.id}function _p(){const n=[];let t=0;const e=[],i=[],s=[];function r(){t=0,e.length=0,i.length=0,s.length=0}function a(h,f,d,p,v,g){let m=n[t];return m===void 0?(m={id:h.id,object:h,geometry:f,material:d,groupOrder:p,renderOrder:h.renderOrder,z:v,group:g},n[t]=m):(m.id=h.id,m.object=h,m.geometry=f,m.material=d,m.groupOrder=p,m.renderOrder=h.renderOrder,m.z=v,m.group=g),t++,m}function o(h,f,d,p,v,g){const m=a(h,f,d,p,v,g);d.transmission>0?i.push(m):d.transparent===!0?s.push(m):e.push(m)}function c(h,f,d,p,v,g){const m=a(h,f,d,p,v,g);d.transmission>0?i.unshift(m):d.transparent===!0?s.unshift(m):e.unshift(m)}function l(h,f){e.length>1&&e.sort(h||Ly),i.length>1&&i.sort(f||Mp),s.length>1&&s.sort(f||Mp)}function u(){for(let h=t,f=n.length;h<f;h++){const d=n[h];if(d.id===null)break;d.id=null,d.object=null,d.geometry=null,d.material=null,d.group=null}}return{opaque:e,transmissive:i,transparent:s,init:r,push:o,unshift:c,finish:u,sort:l}}function Py(){let n=new WeakMap;function t(i,s){const r=n.get(i);let a;return r===void 0?(a=new _p,n.set(i,[a])):s>=r.length?(a=new _p,r.push(a)):a=r[s],a}function e(){n=new WeakMap}return{get:t,dispose:e}}function Iy(){const n={};return{get:function(t){if(n[t.id]!==void 0)return n[t.id];let e;switch(t.type){case"DirectionalLight":e={direction:new C,color:new gt};break;case"SpotLight":e={position:new C,direction:new C,color:new gt,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":e={position:new C,color:new gt,distance:0,decay:0};break;case"HemisphereLight":e={direction:new C,skyColor:new gt,groundColor:new gt};break;case"RectAreaLight":e={color:new gt,position:new C,halfWidth:new C,halfHeight:new C};break}return n[t.id]=e,e}}}function Dy(){const n={};return{get:function(t){if(n[t.id]!==void 0)return n[t.id];let e;switch(t.type){case"DirectionalLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ht};break;case"SpotLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ht};break;case"PointLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ht,shadowCameraNear:1,shadowCameraFar:1e3};break}return n[t.id]=e,e}}}let Uy=0;function Fy(n,t){return(t.castShadow?2:0)-(n.castShadow?2:0)+(t.map?1:0)-(n.map?1:0)}function Ny(n){const t=new Iy,e=Dy(),i={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let l=0;l<9;l++)i.probe.push(new C);const s=new C,r=new se,a=new se;function o(l){let u=0,h=0,f=0;for(let w=0;w<9;w++)i.probe[w].set(0,0,0);let d=0,p=0,v=0,g=0,m=0,M=0,x=0,_=0,b=0,S=0,T=0;l.sort(Fy);for(let w=0,y=l.length;w<y;w++){const E=l[w],R=E.color,L=E.intensity,I=E.distance,N=E.shadow&&E.shadow.map?E.shadow.map.texture:null;if(E.isAmbientLight)u+=R.r*L,h+=R.g*L,f+=R.b*L;else if(E.isLightProbe){for(let B=0;B<9;B++)i.probe[B].addScaledVector(E.sh.coefficients[B],L);T++}else if(E.isDirectionalLight){const B=t.get(E);if(B.color.copy(E.color).multiplyScalar(E.intensity),E.castShadow){const X=E.shadow,H=e.get(E);H.shadowIntensity=X.intensity,H.shadowBias=X.bias,H.shadowNormalBias=X.normalBias,H.shadowRadius=X.radius,H.shadowMapSize=X.mapSize,i.directionalShadow[d]=H,i.directionalShadowMap[d]=N,i.directionalShadowMatrix[d]=E.shadow.matrix,M++}i.directional[d]=B,d++}else if(E.isSpotLight){const B=t.get(E);B.position.setFromMatrixPosition(E.matrixWorld),B.color.copy(R).multiplyScalar(L),B.distance=I,B.coneCos=Math.cos(E.angle),B.penumbraCos=Math.cos(E.angle*(1-E.penumbra)),B.decay=E.decay,i.spot[v]=B;const X=E.shadow;if(E.map&&(i.spotLightMap[b]=E.map,b++,X.updateMatrices(E),E.castShadow&&S++),i.spotLightMatrix[v]=X.matrix,E.castShadow){const H=e.get(E);H.shadowIntensity=X.intensity,H.shadowBias=X.bias,H.shadowNormalBias=X.normalBias,H.shadowRadius=X.radius,H.shadowMapSize=X.mapSize,i.spotShadow[v]=H,i.spotShadowMap[v]=N,_++}v++}else if(E.isRectAreaLight){const B=t.get(E);B.color.copy(R).multiplyScalar(L),B.halfWidth.set(E.width*.5,0,0),B.halfHeight.set(0,E.height*.5,0),i.rectArea[g]=B,g++}else if(E.isPointLight){const B=t.get(E);if(B.color.copy(E.color).multiplyScalar(E.intensity),B.distance=E.distance,B.decay=E.decay,E.castShadow){const X=E.shadow,H=e.get(E);H.shadowIntensity=X.intensity,H.shadowBias=X.bias,H.shadowNormalBias=X.normalBias,H.shadowRadius=X.radius,H.shadowMapSize=X.mapSize,H.shadowCameraNear=X.camera.near,H.shadowCameraFar=X.camera.far,i.pointShadow[p]=H,i.pointShadowMap[p]=N,i.pointShadowMatrix[p]=E.shadow.matrix,x++}i.point[p]=B,p++}else if(E.isHemisphereLight){const B=t.get(E);B.skyColor.copy(E.color).multiplyScalar(L),B.groundColor.copy(E.groundColor).multiplyScalar(L),i.hemi[m]=B,m++}}g>0&&(n.has("OES_texture_float_linear")===!0?(i.rectAreaLTC1=Lt.LTC_FLOAT_1,i.rectAreaLTC2=Lt.LTC_FLOAT_2):(i.rectAreaLTC1=Lt.LTC_HALF_1,i.rectAreaLTC2=Lt.LTC_HALF_2)),i.ambient[0]=u,i.ambient[1]=h,i.ambient[2]=f;const A=i.hash;(A.directionalLength!==d||A.pointLength!==p||A.spotLength!==v||A.rectAreaLength!==g||A.hemiLength!==m||A.numDirectionalShadows!==M||A.numPointShadows!==x||A.numSpotShadows!==_||A.numSpotMaps!==b||A.numLightProbes!==T)&&(i.directional.length=d,i.spot.length=v,i.rectArea.length=g,i.point.length=p,i.hemi.length=m,i.directionalShadow.length=M,i.directionalShadowMap.length=M,i.pointShadow.length=x,i.pointShadowMap.length=x,i.spotShadow.length=_,i.spotShadowMap.length=_,i.directionalShadowMatrix.length=M,i.pointShadowMatrix.length=x,i.spotLightMatrix.length=_+b-S,i.spotLightMap.length=b,i.numSpotLightShadowsWithMaps=S,i.numLightProbes=T,A.directionalLength=d,A.pointLength=p,A.spotLength=v,A.rectAreaLength=g,A.hemiLength=m,A.numDirectionalShadows=M,A.numPointShadows=x,A.numSpotShadows=_,A.numSpotMaps=b,A.numLightProbes=T,i.version=Uy++)}function c(l,u){let h=0,f=0,d=0,p=0,v=0;const g=u.matrixWorldInverse;for(let m=0,M=l.length;m<M;m++){const x=l[m];if(x.isDirectionalLight){const _=i.directional[h];_.direction.setFromMatrixPosition(x.matrixWorld),s.setFromMatrixPosition(x.target.matrixWorld),_.direction.sub(s),_.direction.transformDirection(g),h++}else if(x.isSpotLight){const _=i.spot[d];_.position.setFromMatrixPosition(x.matrixWorld),_.position.applyMatrix4(g),_.direction.setFromMatrixPosition(x.matrixWorld),s.setFromMatrixPosition(x.target.matrixWorld),_.direction.sub(s),_.direction.transformDirection(g),d++}else if(x.isRectAreaLight){const _=i.rectArea[p];_.position.setFromMatrixPosition(x.matrixWorld),_.position.applyMatrix4(g),a.identity(),r.copy(x.matrixWorld),r.premultiply(g),a.extractRotation(r),_.halfWidth.set(x.width*.5,0,0),_.halfHeight.set(0,x.height*.5,0),_.halfWidth.applyMatrix4(a),_.halfHeight.applyMatrix4(a),p++}else if(x.isPointLight){const _=i.point[f];_.position.setFromMatrixPosition(x.matrixWorld),_.position.applyMatrix4(g),f++}else if(x.isHemisphereLight){const _=i.hemi[v];_.direction.setFromMatrixPosition(x.matrixWorld),_.direction.transformDirection(g),v++}}}return{setup:o,setupView:c,state:i}}function wp(n){const t=new Ny(n),e=[],i=[];function s(u){l.camera=u,e.length=0,i.length=0}function r(u){e.push(u)}function a(u){i.push(u)}function o(){t.setup(e)}function c(u){t.setupView(e,u)}const l={lightsArray:e,shadowsArray:i,camera:null,lights:t,transmissionRenderTarget:{}};return{init:s,state:l,setupLights:o,setupLightsView:c,pushLight:r,pushShadow:a}}function ky(n){let t=new WeakMap;function e(s,r=0){const a=t.get(s);let o;return a===void 0?(o=new wp(n),t.set(s,[o])):r>=a.length?(o=new wp(n),a.push(o)):o=a[r],o}function i(){t=new WeakMap}return{get:e,dispose:i}}const Oy=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,By=`uniform sampler2D shadow_pass;
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
}`;function Hy(n,t,e){let i=new ld;const s=new ht,r=new ht,a=new fe,o=new a3({depthPacking:MM}),c=new o3,l={},u=e.maxTextureSize,h={[ar]:Bn,[Bn]:ar,[Te]:Te},f=new nn({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new ht},radius:{value:4}},vertexShader:Oy,fragmentShader:By}),d=f.clone();d.defines.HORIZONTAL_PASS=1;const p=new Me;p.setAttribute("position",new qt(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const v=new nt(p,f),g=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=Mg;let m=this.type;this.render=function(S,T,A){if(g.enabled===!1||g.autoUpdate===!1&&g.needsUpdate===!1||S.length===0)return;const w=n.getRenderTarget(),y=n.getActiveCubeFace(),E=n.getActiveMipmapLevel(),R=n.state;R.setBlending(er),R.buffers.depth.getReversed()===!0?R.buffers.color.setClear(0,0,0,0):R.buffers.color.setClear(1,1,1,1),R.buffers.depth.setTest(!0),R.setScissorTest(!1);const L=m!==Ms&&this.type===Ms,I=m===Ms&&this.type!==Ms;for(let N=0,B=S.length;N<B;N++){const X=S[N],H=X.shadow;if(H===void 0){console.warn("THREE.WebGLShadowMap:",X,"has no shadow.");continue}if(H.autoUpdate===!1&&H.needsUpdate===!1)continue;s.copy(H.mapSize);const Y=H.getFrameExtents();if(s.multiply(Y),r.copy(H.mapSize),(s.x>u||s.y>u)&&(s.x>u&&(r.x=Math.floor(u/Y.x),s.x=r.x*Y.x,H.mapSize.x=r.x),s.y>u&&(r.y=Math.floor(u/Y.y),s.y=r.y*Y.y,H.mapSize.y=r.y)),H.map===null||L===!0||I===!0){const dt=this.type!==Ms?{minFilter:si,magFilter:si}:{};H.map!==null&&H.map.dispose(),H.map=new En(s.x,s.y,dt),H.map.texture.name=X.name+".shadowMap",H.camera.updateProjectionMatrix()}n.setRenderTarget(H.map),n.clear();const it=H.getViewportCount();for(let dt=0;dt<it;dt++){const vt=H.getViewport(dt);a.set(r.x*vt.x,r.y*vt.y,r.x*vt.z,r.y*vt.w),R.viewport(a),H.updateMatrices(X,dt),i=H.getFrustum(),_(T,A,H.camera,X,this.type)}H.isPointLightShadow!==!0&&this.type===Ms&&M(H,A),H.needsUpdate=!1}m=this.type,g.needsUpdate=!1,n.setRenderTarget(w,y,E)};function M(S,T){const A=t.update(v);f.defines.VSM_SAMPLES!==S.blurSamples&&(f.defines.VSM_SAMPLES=S.blurSamples,d.defines.VSM_SAMPLES=S.blurSamples,f.needsUpdate=!0,d.needsUpdate=!0),S.mapPass===null&&(S.mapPass=new En(s.x,s.y)),f.uniforms.shadow_pass.value=S.map.texture,f.uniforms.resolution.value=S.mapSize,f.uniforms.radius.value=S.radius,n.setRenderTarget(S.mapPass),n.clear(),n.renderBufferDirect(T,null,A,f,v,null),d.uniforms.shadow_pass.value=S.mapPass.texture,d.uniforms.resolution.value=S.mapSize,d.uniforms.radius.value=S.radius,n.setRenderTarget(S.map),n.clear(),n.renderBufferDirect(T,null,A,d,v,null)}function x(S,T,A,w){let y=null;const E=A.isPointLight===!0?S.customDistanceMaterial:S.customDepthMaterial;if(E!==void 0)y=E;else if(y=A.isPointLight===!0?c:o,n.localClippingEnabled&&T.clipShadows===!0&&Array.isArray(T.clippingPlanes)&&T.clippingPlanes.length!==0||T.displacementMap&&T.displacementScale!==0||T.alphaMap&&T.alphaTest>0||T.map&&T.alphaTest>0||T.alphaToCoverage===!0){const R=y.uuid,L=T.uuid;let I=l[R];I===void 0&&(I={},l[R]=I);let N=I[L];N===void 0&&(N=y.clone(),I[L]=N,T.addEventListener("dispose",b)),y=N}if(y.visible=T.visible,y.wireframe=T.wireframe,w===Ms?y.side=T.shadowSide!==null?T.shadowSide:T.side:y.side=T.shadowSide!==null?T.shadowSide:h[T.side],y.alphaMap=T.alphaMap,y.alphaTest=T.alphaToCoverage===!0?.5:T.alphaTest,y.map=T.map,y.clipShadows=T.clipShadows,y.clippingPlanes=T.clippingPlanes,y.clipIntersection=T.clipIntersection,y.displacementMap=T.displacementMap,y.displacementScale=T.displacementScale,y.displacementBias=T.displacementBias,y.wireframeLinewidth=T.wireframeLinewidth,y.linewidth=T.linewidth,A.isPointLight===!0&&y.isMeshDistanceMaterial===!0){const R=n.properties.get(y);R.light=A}return y}function _(S,T,A,w,y){if(S.visible===!1)return;if(S.layers.test(T.layers)&&(S.isMesh||S.isLine||S.isPoints)&&(S.castShadow||S.receiveShadow&&y===Ms)&&(!S.frustumCulled||i.intersectsObject(S))){S.modelViewMatrix.multiplyMatrices(A.matrixWorldInverse,S.matrixWorld);const L=t.update(S),I=S.material;if(Array.isArray(I)){const N=L.groups;for(let B=0,X=N.length;B<X;B++){const H=N[B],Y=I[H.materialIndex];if(Y&&Y.visible){const it=x(S,Y,w,y);S.onBeforeShadow(n,S,T,A,L,it,H),n.renderBufferDirect(A,null,L,it,S,H),S.onAfterShadow(n,S,T,A,L,it,H)}}}else if(I.visible){const N=x(S,I,w,y);S.onBeforeShadow(n,S,T,A,L,N,null),n.renderBufferDirect(A,null,L,N,S,null),S.onAfterShadow(n,S,T,A,L,N,null)}}const R=S.children;for(let L=0,I=R.length;L<I;L++)_(R[L],T,A,w,y)}function b(S){S.target.removeEventListener("dispose",b);for(const A in l){const w=l[A],y=S.target.uuid;y in w&&(w[y].dispose(),delete w[y])}}}const zy={[wu]:bu,[yu]:Tu,[Su]:Au,[co]:Eu,[bu]:wu,[Tu]:yu,[Au]:Su,[Eu]:co};function Vy(n,t){function e(){let q=!1;const Tt=new fe;let Rt=null;const Ot=new fe(0,0,0,0);return{setMask:function(yt){Rt!==yt&&!q&&(n.colorMask(yt,yt,yt,yt),Rt=yt)},setLocked:function(yt){q=yt},setClear:function(yt,xt,Vt,oe,Re){Re===!0&&(yt*=oe,xt*=oe,Vt*=oe),Tt.set(yt,xt,Vt,oe),Ot.equals(Tt)===!1&&(n.clearColor(yt,xt,Vt,oe),Ot.copy(Tt))},reset:function(){q=!1,Rt=null,Ot.set(-1,0,0,0)}}}function i(){let q=!1,Tt=!1,Rt=null,Ot=null,yt=null;return{setReversed:function(xt){if(Tt!==xt){const Vt=t.get("EXT_clip_control");xt?Vt.clipControlEXT(Vt.LOWER_LEFT_EXT,Vt.ZERO_TO_ONE_EXT):Vt.clipControlEXT(Vt.LOWER_LEFT_EXT,Vt.NEGATIVE_ONE_TO_ONE_EXT),Tt=xt;const oe=yt;yt=null,this.setClear(oe)}},getReversed:function(){return Tt},setTest:function(xt){xt?$(n.DEPTH_TEST):z(n.DEPTH_TEST)},setMask:function(xt){Rt!==xt&&!q&&(n.depthMask(xt),Rt=xt)},setFunc:function(xt){if(Tt&&(xt=zy[xt]),Ot!==xt){switch(xt){case wu:n.depthFunc(n.NEVER);break;case bu:n.depthFunc(n.ALWAYS);break;case yu:n.depthFunc(n.LESS);break;case co:n.depthFunc(n.LEQUAL);break;case Su:n.depthFunc(n.EQUAL);break;case Eu:n.depthFunc(n.GEQUAL);break;case Tu:n.depthFunc(n.GREATER);break;case Au:n.depthFunc(n.NOTEQUAL);break;default:n.depthFunc(n.LEQUAL)}Ot=xt}},setLocked:function(xt){q=xt},setClear:function(xt){yt!==xt&&(Tt&&(xt=1-xt),n.clearDepth(xt),yt=xt)},reset:function(){q=!1,Rt=null,Ot=null,yt=null,Tt=!1}}}function s(){let q=!1,Tt=null,Rt=null,Ot=null,yt=null,xt=null,Vt=null,oe=null,Re=null;return{setTest:function(_e){q||(_e?$(n.STENCIL_TEST):z(n.STENCIL_TEST))},setMask:function(_e){Tt!==_e&&!q&&(n.stencilMask(_e),Tt=_e)},setFunc:function(_e,hs,Vi){(Rt!==_e||Ot!==hs||yt!==Vi)&&(n.stencilFunc(_e,hs,Vi),Rt=_e,Ot=hs,yt=Vi)},setOp:function(_e,hs,Vi){(xt!==_e||Vt!==hs||oe!==Vi)&&(n.stencilOp(_e,hs,Vi),xt=_e,Vt=hs,oe=Vi)},setLocked:function(_e){q=_e},setClear:function(_e){Re!==_e&&(n.clearStencil(_e),Re=_e)},reset:function(){q=!1,Tt=null,Rt=null,Ot=null,yt=null,xt=null,Vt=null,oe=null,Re=null}}}const r=new e,a=new i,o=new s,c=new WeakMap,l=new WeakMap;let u={},h={},f=new WeakMap,d=[],p=null,v=!1,g=null,m=null,M=null,x=null,_=null,b=null,S=null,T=new gt(0,0,0),A=0,w=!1,y=null,E=null,R=null,L=null,I=null;const N=n.getParameter(n.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let B=!1,X=0;const H=n.getParameter(n.VERSION);H.indexOf("WebGL")!==-1?(X=parseFloat(/^WebGL (\d)/.exec(H)[1]),B=X>=1):H.indexOf("OpenGL ES")!==-1&&(X=parseFloat(/^OpenGL ES (\d)/.exec(H)[1]),B=X>=2);let Y=null,it={};const dt=n.getParameter(n.SCISSOR_BOX),vt=n.getParameter(n.VIEWPORT),St=new fe().fromArray(dt),Ct=new fe().fromArray(vt);function Ft(q,Tt,Rt,Ot){const yt=new Uint8Array(4),xt=n.createTexture();n.bindTexture(q,xt),n.texParameteri(q,n.TEXTURE_MIN_FILTER,n.NEAREST),n.texParameteri(q,n.TEXTURE_MAG_FILTER,n.NEAREST);for(let Vt=0;Vt<Rt;Vt++)q===n.TEXTURE_3D||q===n.TEXTURE_2D_ARRAY?n.texImage3D(Tt,0,n.RGBA,1,1,Ot,0,n.RGBA,n.UNSIGNED_BYTE,yt):n.texImage2D(Tt+Vt,0,n.RGBA,1,1,0,n.RGBA,n.UNSIGNED_BYTE,yt);return xt}const V={};V[n.TEXTURE_2D]=Ft(n.TEXTURE_2D,n.TEXTURE_2D,1),V[n.TEXTURE_CUBE_MAP]=Ft(n.TEXTURE_CUBE_MAP,n.TEXTURE_CUBE_MAP_POSITIVE_X,6),V[n.TEXTURE_2D_ARRAY]=Ft(n.TEXTURE_2D_ARRAY,n.TEXTURE_2D_ARRAY,1,1),V[n.TEXTURE_3D]=Ft(n.TEXTURE_3D,n.TEXTURE_3D,1,1),r.setClear(0,0,0,1),a.setClear(1),o.setClear(0),$(n.DEPTH_TEST),a.setFunc(co),rt(!1),ut(h1),$(n.CULL_FACE),et(er);function $(q){u[q]!==!0&&(n.enable(q),u[q]=!0)}function z(q){u[q]!==!1&&(n.disable(q),u[q]=!1)}function W(q,Tt){return h[q]!==Tt?(n.bindFramebuffer(q,Tt),h[q]=Tt,q===n.DRAW_FRAMEBUFFER&&(h[n.FRAMEBUFFER]=Tt),q===n.FRAMEBUFFER&&(h[n.DRAW_FRAMEBUFFER]=Tt),!0):!1}function G(q,Tt){let Rt=d,Ot=!1;if(q){Rt=f.get(Tt),Rt===void 0&&(Rt=[],f.set(Tt,Rt));const yt=q.textures;if(Rt.length!==yt.length||Rt[0]!==n.COLOR_ATTACHMENT0){for(let xt=0,Vt=yt.length;xt<Vt;xt++)Rt[xt]=n.COLOR_ATTACHMENT0+xt;Rt.length=yt.length,Ot=!0}}else Rt[0]!==n.BACK&&(Rt[0]=n.BACK,Ot=!0);Ot&&n.drawBuffers(Rt)}function tt(q){return p!==q?(n.useProgram(q),p=q,!0):!1}const ot={[Ar]:n.FUNC_ADD,[qx]:n.FUNC_SUBTRACT,[Yx]:n.FUNC_REVERSE_SUBTRACT};ot[jx]=n.MIN,ot[Zx]=n.MAX;const F={[bg]:n.ZERO,[Jx]:n.ONE,[yg]:n.SRC_COLOR,[Mu]:n.SRC_ALPHA,[iM]:n.SRC_ALPHA_SATURATE,[eM]:n.DST_COLOR,[Qx]:n.DST_ALPHA,[Kx]:n.ONE_MINUS_SRC_COLOR,[_u]:n.ONE_MINUS_SRC_ALPHA,[nM]:n.ONE_MINUS_DST_COLOR,[tM]:n.ONE_MINUS_DST_ALPHA,[sM]:n.CONSTANT_COLOR,[rM]:n.ONE_MINUS_CONSTANT_COLOR,[aM]:n.CONSTANT_ALPHA,[oM]:n.ONE_MINUS_CONSTANT_ALPHA};function et(q,Tt,Rt,Ot,yt,xt,Vt,oe,Re,_e){if(q===er){v===!0&&(z(n.BLEND),v=!1);return}if(v===!1&&($(n.BLEND),v=!0),q!==wg){if(q!==g||_e!==w){if((m!==Ar||_!==Ar)&&(n.blendEquation(n.FUNC_ADD),m=Ar,_=Ar),_e)switch(q){case ja:n.blendFuncSeparate(n.ONE,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case Xr:n.blendFunc(n.ONE,n.ONE);break;case u1:n.blendFuncSeparate(n.ZERO,n.ONE_MINUS_SRC_COLOR,n.ZERO,n.ONE);break;case f1:n.blendFuncSeparate(n.DST_COLOR,n.ONE_MINUS_SRC_ALPHA,n.ZERO,n.ONE);break;default:console.error("THREE.WebGLState: Invalid blending: ",q);break}else switch(q){case ja:n.blendFuncSeparate(n.SRC_ALPHA,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case Xr:n.blendFuncSeparate(n.SRC_ALPHA,n.ONE,n.ONE,n.ONE);break;case u1:console.error("THREE.WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case f1:console.error("THREE.WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:console.error("THREE.WebGLState: Invalid blending: ",q);break}M=null,x=null,b=null,S=null,T.set(0,0,0),A=0,g=q,w=_e}return}yt=yt||Tt,xt=xt||Rt,Vt=Vt||Ot,(Tt!==m||yt!==_)&&(n.blendEquationSeparate(ot[Tt],ot[yt]),m=Tt,_=yt),(Rt!==M||Ot!==x||xt!==b||Vt!==S)&&(n.blendFuncSeparate(F[Rt],F[Ot],F[xt],F[Vt]),M=Rt,x=Ot,b=xt,S=Vt),(oe.equals(T)===!1||Re!==A)&&(n.blendColor(oe.r,oe.g,oe.b,Re),T.copy(oe),A=Re),g=q,w=!1}function Q(q,Tt){q.side===Te?z(n.CULL_FACE):$(n.CULL_FACE);let Rt=q.side===Bn;Tt&&(Rt=!Rt),rt(Rt),q.blending===ja&&q.transparent===!1?et(er):et(q.blending,q.blendEquation,q.blendSrc,q.blendDst,q.blendEquationAlpha,q.blendSrcAlpha,q.blendDstAlpha,q.blendColor,q.blendAlpha,q.premultipliedAlpha),a.setFunc(q.depthFunc),a.setTest(q.depthTest),a.setMask(q.depthWrite),r.setMask(q.colorWrite);const Ot=q.stencilWrite;o.setTest(Ot),Ot&&(o.setMask(q.stencilWriteMask),o.setFunc(q.stencilFunc,q.stencilRef,q.stencilFuncMask),o.setOp(q.stencilFail,q.stencilZFail,q.stencilZPass)),Mt(q.polygonOffset,q.polygonOffsetFactor,q.polygonOffsetUnits),q.alphaToCoverage===!0?$(n.SAMPLE_ALPHA_TO_COVERAGE):z(n.SAMPLE_ALPHA_TO_COVERAGE)}function rt(q){y!==q&&(q?n.frontFace(n.CW):n.frontFace(n.CCW),y=q)}function ut(q){q!==Xx?($(n.CULL_FACE),q!==E&&(q===h1?n.cullFace(n.BACK):q===$x?n.cullFace(n.FRONT):n.cullFace(n.FRONT_AND_BACK))):z(n.CULL_FACE),E=q}function mt(q){q!==R&&(B&&n.lineWidth(q),R=q)}function Mt(q,Tt,Rt){q?($(n.POLYGON_OFFSET_FILL),(L!==Tt||I!==Rt)&&(n.polygonOffset(Tt,Rt),L=Tt,I=Rt)):z(n.POLYGON_OFFSET_FILL)}function wt(q){q?$(n.SCISSOR_TEST):z(n.SCISSOR_TEST)}function ee(q){q===void 0&&(q=n.TEXTURE0+N-1),Y!==q&&(n.activeTexture(q),Y=q)}function Kt(q,Tt,Rt){Rt===void 0&&(Y===null?Rt=n.TEXTURE0+N-1:Rt=Y);let Ot=it[Rt];Ot===void 0&&(Ot={type:void 0,texture:void 0},it[Rt]=Ot),(Ot.type!==q||Ot.texture!==Tt)&&(Y!==Rt&&(n.activeTexture(Rt),Y=Rt),n.bindTexture(q,Tt||V[q]),Ot.type=q,Ot.texture=Tt)}function k(){const q=it[Y];q!==void 0&&q.type!==void 0&&(n.bindTexture(q.type,null),q.type=void 0,q.texture=void 0)}function P(){try{n.compressedTexImage2D(...arguments)}catch(q){console.error("THREE.WebGLState:",q)}}function J(){try{n.compressedTexImage3D(...arguments)}catch(q){console.error("THREE.WebGLState:",q)}}function ft(){try{n.texSubImage2D(...arguments)}catch(q){console.error("THREE.WebGLState:",q)}}function _t(){try{n.texSubImage3D(...arguments)}catch(q){console.error("THREE.WebGLState:",q)}}function pt(){try{n.compressedTexSubImage2D(...arguments)}catch(q){console.error("THREE.WebGLState:",q)}}function Gt(){try{n.compressedTexSubImage3D(...arguments)}catch(q){console.error("THREE.WebGLState:",q)}}function At(){try{n.texStorage2D(...arguments)}catch(q){console.error("THREE.WebGLState:",q)}}function Ht(){try{n.texStorage3D(...arguments)}catch(q){console.error("THREE.WebGLState:",q)}}function zt(){try{n.texImage2D(...arguments)}catch(q){console.error("THREE.WebGLState:",q)}}function bt(){try{n.texImage3D(...arguments)}catch(q){console.error("THREE.WebGLState:",q)}}function Nt(q){St.equals(q)===!1&&(n.scissor(q.x,q.y,q.z,q.w),St.copy(q))}function Qt(q){Ct.equals(q)===!1&&(n.viewport(q.x,q.y,q.z,q.w),Ct.copy(q))}function Wt(q,Tt){let Rt=l.get(Tt);Rt===void 0&&(Rt=new WeakMap,l.set(Tt,Rt));let Ot=Rt.get(q);Ot===void 0&&(Ot=n.getUniformBlockIndex(Tt,q.name),Rt.set(q,Ot))}function It(q,Tt){const Ot=l.get(Tt).get(q);c.get(Tt)!==Ot&&(n.uniformBlockBinding(Tt,Ot,q.__bindingPointIndex),c.set(Tt,Ot))}function ce(){n.disable(n.BLEND),n.disable(n.CULL_FACE),n.disable(n.DEPTH_TEST),n.disable(n.POLYGON_OFFSET_FILL),n.disable(n.SCISSOR_TEST),n.disable(n.STENCIL_TEST),n.disable(n.SAMPLE_ALPHA_TO_COVERAGE),n.blendEquation(n.FUNC_ADD),n.blendFunc(n.ONE,n.ZERO),n.blendFuncSeparate(n.ONE,n.ZERO,n.ONE,n.ZERO),n.blendColor(0,0,0,0),n.colorMask(!0,!0,!0,!0),n.clearColor(0,0,0,0),n.depthMask(!0),n.depthFunc(n.LESS),a.setReversed(!1),n.clearDepth(1),n.stencilMask(4294967295),n.stencilFunc(n.ALWAYS,0,4294967295),n.stencilOp(n.KEEP,n.KEEP,n.KEEP),n.clearStencil(0),n.cullFace(n.BACK),n.frontFace(n.CCW),n.polygonOffset(0,0),n.activeTexture(n.TEXTURE0),n.bindFramebuffer(n.FRAMEBUFFER,null),n.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),n.bindFramebuffer(n.READ_FRAMEBUFFER,null),n.useProgram(null),n.lineWidth(1),n.scissor(0,0,n.canvas.width,n.canvas.height),n.viewport(0,0,n.canvas.width,n.canvas.height),u={},Y=null,it={},h={},f=new WeakMap,d=[],p=null,v=!1,g=null,m=null,M=null,x=null,_=null,b=null,S=null,T=new gt(0,0,0),A=0,w=!1,y=null,E=null,R=null,L=null,I=null,St.set(0,0,n.canvas.width,n.canvas.height),Ct.set(0,0,n.canvas.width,n.canvas.height),r.reset(),a.reset(),o.reset()}return{buffers:{color:r,depth:a,stencil:o},enable:$,disable:z,bindFramebuffer:W,drawBuffers:G,useProgram:tt,setBlending:et,setMaterial:Q,setFlipSided:rt,setCullFace:ut,setLineWidth:mt,setPolygonOffset:Mt,setScissorTest:wt,activeTexture:ee,bindTexture:Kt,unbindTexture:k,compressedTexImage2D:P,compressedTexImage3D:J,texImage2D:zt,texImage3D:bt,updateUBOMapping:Wt,uniformBlockBinding:It,texStorage2D:At,texStorage3D:Ht,texSubImage2D:ft,texSubImage3D:_t,compressedTexSubImage2D:pt,compressedTexSubImage3D:Gt,scissor:Nt,viewport:Qt,reset:ce}}function Gy(n,t,e,i,s,r,a){const o=t.has("WEBGL_multisampled_render_to_texture")?t.get("WEBGL_multisampled_render_to_texture"):null,c=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),l=new ht,u=new WeakMap;let h;const f=new WeakMap;let d=!1;try{d=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function p(k,P){return d?new OffscreenCanvas(k,P):rh("canvas")}function v(k,P,J){let ft=1;const _t=Kt(k);if((_t.width>J||_t.height>J)&&(ft=J/Math.max(_t.width,_t.height)),ft<1)if(typeof HTMLImageElement<"u"&&k instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&k instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&k instanceof ImageBitmap||typeof VideoFrame<"u"&&k instanceof VideoFrame){const pt=Math.floor(ft*_t.width),Gt=Math.floor(ft*_t.height);h===void 0&&(h=p(pt,Gt));const At=P?p(pt,Gt):h;return At.width=pt,At.height=Gt,At.getContext("2d").drawImage(k,0,0,pt,Gt),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+_t.width+"x"+_t.height+") to ("+pt+"x"+Gt+")."),At}else return"data"in k&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+_t.width+"x"+_t.height+")."),k;return k}function g(k){return k.generateMipmaps}function m(k){n.generateMipmap(k)}function M(k){return k.isWebGLCubeRenderTarget?n.TEXTURE_CUBE_MAP:k.isWebGL3DRenderTarget?n.TEXTURE_3D:k.isWebGLArrayRenderTarget||k.isCompressedArrayTexture?n.TEXTURE_2D_ARRAY:n.TEXTURE_2D}function x(k,P,J,ft,_t=!1){if(k!==null){if(n[k]!==void 0)return n[k];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+k+"'")}let pt=P;if(P===n.RED&&(J===n.FLOAT&&(pt=n.R32F),J===n.HALF_FLOAT&&(pt=n.R16F),J===n.UNSIGNED_BYTE&&(pt=n.R8)),P===n.RED_INTEGER&&(J===n.UNSIGNED_BYTE&&(pt=n.R8UI),J===n.UNSIGNED_SHORT&&(pt=n.R16UI),J===n.UNSIGNED_INT&&(pt=n.R32UI),J===n.BYTE&&(pt=n.R8I),J===n.SHORT&&(pt=n.R16I),J===n.INT&&(pt=n.R32I)),P===n.RG&&(J===n.FLOAT&&(pt=n.RG32F),J===n.HALF_FLOAT&&(pt=n.RG16F),J===n.UNSIGNED_BYTE&&(pt=n.RG8)),P===n.RG_INTEGER&&(J===n.UNSIGNED_BYTE&&(pt=n.RG8UI),J===n.UNSIGNED_SHORT&&(pt=n.RG16UI),J===n.UNSIGNED_INT&&(pt=n.RG32UI),J===n.BYTE&&(pt=n.RG8I),J===n.SHORT&&(pt=n.RG16I),J===n.INT&&(pt=n.RG32I)),P===n.RGB_INTEGER&&(J===n.UNSIGNED_BYTE&&(pt=n.RGB8UI),J===n.UNSIGNED_SHORT&&(pt=n.RGB16UI),J===n.UNSIGNED_INT&&(pt=n.RGB32UI),J===n.BYTE&&(pt=n.RGB8I),J===n.SHORT&&(pt=n.RGB16I),J===n.INT&&(pt=n.RGB32I)),P===n.RGBA_INTEGER&&(J===n.UNSIGNED_BYTE&&(pt=n.RGBA8UI),J===n.UNSIGNED_SHORT&&(pt=n.RGBA16UI),J===n.UNSIGNED_INT&&(pt=n.RGBA32UI),J===n.BYTE&&(pt=n.RGBA8I),J===n.SHORT&&(pt=n.RGBA16I),J===n.INT&&(pt=n.RGBA32I)),P===n.RGB&&(J===n.UNSIGNED_INT_5_9_9_9_REV&&(pt=n.RGB9_E5),J===n.UNSIGNED_INT_10F_11F_11F_REV&&(pt=n.R11F_G11F_B10F)),P===n.RGBA){const Gt=_t?ih:ve.getTransfer(ft);J===n.FLOAT&&(pt=n.RGBA32F),J===n.HALF_FLOAT&&(pt=n.RGBA16F),J===n.UNSIGNED_BYTE&&(pt=Gt===Se?n.SRGB8_ALPHA8:n.RGBA8),J===n.UNSIGNED_SHORT_4_4_4_4&&(pt=n.RGBA4),J===n.UNSIGNED_SHORT_5_5_5_1&&(pt=n.RGB5_A1)}return(pt===n.R16F||pt===n.R32F||pt===n.RG16F||pt===n.RG32F||pt===n.RGBA16F||pt===n.RGBA32F)&&t.get("EXT_color_buffer_float"),pt}function _(k,P){let J;return k?P===null||P===$r||P===mc?J=n.DEPTH24_STENCIL8:P===is?J=n.DEPTH32F_STENCIL8:P===pc&&(J=n.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):P===null||P===$r||P===mc?J=n.DEPTH_COMPONENT24:P===is?J=n.DEPTH_COMPONENT32F:P===pc&&(J=n.DEPTH_COMPONENT16),J}function b(k,P){return g(k)===!0||k.isFramebufferTexture&&k.minFilter!==si&&k.minFilter!==Pe?Math.log2(Math.max(P.width,P.height))+1:k.mipmaps!==void 0&&k.mipmaps.length>0?k.mipmaps.length:k.isCompressedTexture&&Array.isArray(k.image)?P.mipmaps.length:1}function S(k){const P=k.target;P.removeEventListener("dispose",S),A(P),P.isVideoTexture&&u.delete(P)}function T(k){const P=k.target;P.removeEventListener("dispose",T),y(P)}function A(k){const P=i.get(k);if(P.__webglInit===void 0)return;const J=k.source,ft=f.get(J);if(ft){const _t=ft[P.__cacheKey];_t.usedTimes--,_t.usedTimes===0&&w(k),Object.keys(ft).length===0&&f.delete(J)}i.remove(k)}function w(k){const P=i.get(k);n.deleteTexture(P.__webglTexture);const J=k.source,ft=f.get(J);delete ft[P.__cacheKey],a.memory.textures--}function y(k){const P=i.get(k);if(k.depthTexture&&(k.depthTexture.dispose(),i.remove(k.depthTexture)),k.isWebGLCubeRenderTarget)for(let ft=0;ft<6;ft++){if(Array.isArray(P.__webglFramebuffer[ft]))for(let _t=0;_t<P.__webglFramebuffer[ft].length;_t++)n.deleteFramebuffer(P.__webglFramebuffer[ft][_t]);else n.deleteFramebuffer(P.__webglFramebuffer[ft]);P.__webglDepthbuffer&&n.deleteRenderbuffer(P.__webglDepthbuffer[ft])}else{if(Array.isArray(P.__webglFramebuffer))for(let ft=0;ft<P.__webglFramebuffer.length;ft++)n.deleteFramebuffer(P.__webglFramebuffer[ft]);else n.deleteFramebuffer(P.__webglFramebuffer);if(P.__webglDepthbuffer&&n.deleteRenderbuffer(P.__webglDepthbuffer),P.__webglMultisampledFramebuffer&&n.deleteFramebuffer(P.__webglMultisampledFramebuffer),P.__webglColorRenderbuffer)for(let ft=0;ft<P.__webglColorRenderbuffer.length;ft++)P.__webglColorRenderbuffer[ft]&&n.deleteRenderbuffer(P.__webglColorRenderbuffer[ft]);P.__webglDepthRenderbuffer&&n.deleteRenderbuffer(P.__webglDepthRenderbuffer)}const J=k.textures;for(let ft=0,_t=J.length;ft<_t;ft++){const pt=i.get(J[ft]);pt.__webglTexture&&(n.deleteTexture(pt.__webglTexture),a.memory.textures--),i.remove(J[ft])}i.remove(k)}let E=0;function R(){E=0}function L(){const k=E;return k>=s.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+k+" texture units while this GPU supports only "+s.maxTextures),E+=1,k}function I(k){const P=[];return P.push(k.wrapS),P.push(k.wrapT),P.push(k.wrapR||0),P.push(k.magFilter),P.push(k.minFilter),P.push(k.anisotropy),P.push(k.internalFormat),P.push(k.format),P.push(k.type),P.push(k.generateMipmaps),P.push(k.premultiplyAlpha),P.push(k.flipY),P.push(k.unpackAlignment),P.push(k.colorSpace),P.join()}function N(k,P){const J=i.get(k);if(k.isVideoTexture&&wt(k),k.isRenderTargetTexture===!1&&k.isExternalTexture!==!0&&k.version>0&&J.__version!==k.version){const ft=k.image;if(ft===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(ft.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{V(J,k,P);return}}else k.isExternalTexture&&(J.__webglTexture=k.sourceTexture?k.sourceTexture:null);e.bindTexture(n.TEXTURE_2D,J.__webglTexture,n.TEXTURE0+P)}function B(k,P){const J=i.get(k);if(k.isRenderTargetTexture===!1&&k.version>0&&J.__version!==k.version){V(J,k,P);return}e.bindTexture(n.TEXTURE_2D_ARRAY,J.__webglTexture,n.TEXTURE0+P)}function X(k,P){const J=i.get(k);if(k.isRenderTargetTexture===!1&&k.version>0&&J.__version!==k.version){V(J,k,P);return}e.bindTexture(n.TEXTURE_3D,J.__webglTexture,n.TEXTURE0+P)}function H(k,P){const J=i.get(k);if(k.version>0&&J.__version!==k.version){$(J,k,P);return}e.bindTexture(n.TEXTURE_CUBE_MAP,J.__webglTexture,n.TEXTURE0+P)}const Y={[uo]:n.REPEAT,[Cr]:n.CLAMP_TO_EDGE,[Cu]:n.MIRRORED_REPEAT},it={[si]:n.NEAREST,[vM]:n.NEAREST_MIPMAP_NEAREST,[Vc]:n.NEAREST_MIPMAP_LINEAR,[Pe]:n.LINEAR,[$h]:n.LINEAR_MIPMAP_NEAREST,[Zs]:n.LINEAR_MIPMAP_LINEAR},dt={[wM]:n.NEVER,[AM]:n.ALWAYS,[bM]:n.LESS,[Fg]:n.LEQUAL,[yM]:n.EQUAL,[TM]:n.GEQUAL,[SM]:n.GREATER,[EM]:n.NOTEQUAL};function vt(k,P){if(P.type===is&&t.has("OES_texture_float_linear")===!1&&(P.magFilter===Pe||P.magFilter===$h||P.magFilter===Vc||P.magFilter===Zs||P.minFilter===Pe||P.minFilter===$h||P.minFilter===Vc||P.minFilter===Zs)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),n.texParameteri(k,n.TEXTURE_WRAP_S,Y[P.wrapS]),n.texParameteri(k,n.TEXTURE_WRAP_T,Y[P.wrapT]),(k===n.TEXTURE_3D||k===n.TEXTURE_2D_ARRAY)&&n.texParameteri(k,n.TEXTURE_WRAP_R,Y[P.wrapR]),n.texParameteri(k,n.TEXTURE_MAG_FILTER,it[P.magFilter]),n.texParameteri(k,n.TEXTURE_MIN_FILTER,it[P.minFilter]),P.compareFunction&&(n.texParameteri(k,n.TEXTURE_COMPARE_MODE,n.COMPARE_REF_TO_TEXTURE),n.texParameteri(k,n.TEXTURE_COMPARE_FUNC,dt[P.compareFunction])),t.has("EXT_texture_filter_anisotropic")===!0){if(P.magFilter===si||P.minFilter!==Vc&&P.minFilter!==Zs||P.type===is&&t.has("OES_texture_float_linear")===!1)return;if(P.anisotropy>1||i.get(P).__currentAnisotropy){const J=t.get("EXT_texture_filter_anisotropic");n.texParameterf(k,J.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(P.anisotropy,s.getMaxAnisotropy())),i.get(P).__currentAnisotropy=P.anisotropy}}}function St(k,P){let J=!1;k.__webglInit===void 0&&(k.__webglInit=!0,P.addEventListener("dispose",S));const ft=P.source;let _t=f.get(ft);_t===void 0&&(_t={},f.set(ft,_t));const pt=I(P);if(pt!==k.__cacheKey){_t[pt]===void 0&&(_t[pt]={texture:n.createTexture(),usedTimes:0},a.memory.textures++,J=!0),_t[pt].usedTimes++;const Gt=_t[k.__cacheKey];Gt!==void 0&&(_t[k.__cacheKey].usedTimes--,Gt.usedTimes===0&&w(P)),k.__cacheKey=pt,k.__webglTexture=_t[pt].texture}return J}function Ct(k,P,J){return Math.floor(Math.floor(k/J)/P)}function Ft(k,P,J,ft){const pt=k.updateRanges;if(pt.length===0)e.texSubImage2D(n.TEXTURE_2D,0,0,0,P.width,P.height,J,ft,P.data);else{pt.sort((bt,Nt)=>bt.start-Nt.start);let Gt=0;for(let bt=1;bt<pt.length;bt++){const Nt=pt[Gt],Qt=pt[bt],Wt=Nt.start+Nt.count,It=Ct(Qt.start,P.width,4),ce=Ct(Nt.start,P.width,4);Qt.start<=Wt+1&&It===ce&&Ct(Qt.start+Qt.count-1,P.width,4)===It?Nt.count=Math.max(Nt.count,Qt.start+Qt.count-Nt.start):(++Gt,pt[Gt]=Qt)}pt.length=Gt+1;const At=n.getParameter(n.UNPACK_ROW_LENGTH),Ht=n.getParameter(n.UNPACK_SKIP_PIXELS),zt=n.getParameter(n.UNPACK_SKIP_ROWS);n.pixelStorei(n.UNPACK_ROW_LENGTH,P.width);for(let bt=0,Nt=pt.length;bt<Nt;bt++){const Qt=pt[bt],Wt=Math.floor(Qt.start/4),It=Math.ceil(Qt.count/4),ce=Wt%P.width,q=Math.floor(Wt/P.width),Tt=It,Rt=1;n.pixelStorei(n.UNPACK_SKIP_PIXELS,ce),n.pixelStorei(n.UNPACK_SKIP_ROWS,q),e.texSubImage2D(n.TEXTURE_2D,0,ce,q,Tt,Rt,J,ft,P.data)}k.clearUpdateRanges(),n.pixelStorei(n.UNPACK_ROW_LENGTH,At),n.pixelStorei(n.UNPACK_SKIP_PIXELS,Ht),n.pixelStorei(n.UNPACK_SKIP_ROWS,zt)}}function V(k,P,J){let ft=n.TEXTURE_2D;(P.isDataArrayTexture||P.isCompressedArrayTexture)&&(ft=n.TEXTURE_2D_ARRAY),P.isData3DTexture&&(ft=n.TEXTURE_3D);const _t=St(k,P),pt=P.source;e.bindTexture(ft,k.__webglTexture,n.TEXTURE0+J);const Gt=i.get(pt);if(pt.version!==Gt.__version||_t===!0){e.activeTexture(n.TEXTURE0+J);const At=ve.getPrimaries(ve.workingColorSpace),Ht=P.colorSpace===Qi?null:ve.getPrimaries(P.colorSpace),zt=P.colorSpace===Qi||At===Ht?n.NONE:n.BROWSER_DEFAULT_WEBGL;n.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,P.flipY),n.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,P.premultiplyAlpha),n.pixelStorei(n.UNPACK_ALIGNMENT,P.unpackAlignment),n.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,zt);let bt=v(P.image,!1,s.maxTextureSize);bt=ee(P,bt);const Nt=r.convert(P.format,P.colorSpace),Qt=r.convert(P.type);let Wt=x(P.internalFormat,Nt,Qt,P.colorSpace,P.isVideoTexture);vt(ft,P);let It;const ce=P.mipmaps,q=P.isVideoTexture!==!0,Tt=Gt.__version===void 0||_t===!0,Rt=pt.dataReady,Ot=b(P,bt);if(P.isDepthTexture)Wt=_(P.format===vc,P.type),Tt&&(q?e.texStorage2D(n.TEXTURE_2D,1,Wt,bt.width,bt.height):e.texImage2D(n.TEXTURE_2D,0,Wt,bt.width,bt.height,0,Nt,Qt,null));else if(P.isDataTexture)if(ce.length>0){q&&Tt&&e.texStorage2D(n.TEXTURE_2D,Ot,Wt,ce[0].width,ce[0].height);for(let yt=0,xt=ce.length;yt<xt;yt++)It=ce[yt],q?Rt&&e.texSubImage2D(n.TEXTURE_2D,yt,0,0,It.width,It.height,Nt,Qt,It.data):e.texImage2D(n.TEXTURE_2D,yt,Wt,It.width,It.height,0,Nt,Qt,It.data);P.generateMipmaps=!1}else q?(Tt&&e.texStorage2D(n.TEXTURE_2D,Ot,Wt,bt.width,bt.height),Rt&&Ft(P,bt,Nt,Qt)):e.texImage2D(n.TEXTURE_2D,0,Wt,bt.width,bt.height,0,Nt,Qt,bt.data);else if(P.isCompressedTexture)if(P.isCompressedArrayTexture){q&&Tt&&e.texStorage3D(n.TEXTURE_2D_ARRAY,Ot,Wt,ce[0].width,ce[0].height,bt.depth);for(let yt=0,xt=ce.length;yt<xt;yt++)if(It=ce[yt],P.format!==ln)if(Nt!==null)if(q){if(Rt)if(P.layerUpdates.size>0){const Vt=K1(It.width,It.height,P.format,P.type);for(const oe of P.layerUpdates){const Re=It.data.subarray(oe*Vt/It.data.BYTES_PER_ELEMENT,(oe+1)*Vt/It.data.BYTES_PER_ELEMENT);e.compressedTexSubImage3D(n.TEXTURE_2D_ARRAY,yt,0,0,oe,It.width,It.height,1,Nt,Re)}P.clearLayerUpdates()}else e.compressedTexSubImage3D(n.TEXTURE_2D_ARRAY,yt,0,0,0,It.width,It.height,bt.depth,Nt,It.data)}else e.compressedTexImage3D(n.TEXTURE_2D_ARRAY,yt,Wt,It.width,It.height,bt.depth,0,It.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else q?Rt&&e.texSubImage3D(n.TEXTURE_2D_ARRAY,yt,0,0,0,It.width,It.height,bt.depth,Nt,Qt,It.data):e.texImage3D(n.TEXTURE_2D_ARRAY,yt,Wt,It.width,It.height,bt.depth,0,Nt,Qt,It.data)}else{q&&Tt&&e.texStorage2D(n.TEXTURE_2D,Ot,Wt,ce[0].width,ce[0].height);for(let yt=0,xt=ce.length;yt<xt;yt++)It=ce[yt],P.format!==ln?Nt!==null?q?Rt&&e.compressedTexSubImage2D(n.TEXTURE_2D,yt,0,0,It.width,It.height,Nt,It.data):e.compressedTexImage2D(n.TEXTURE_2D,yt,Wt,It.width,It.height,0,It.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):q?Rt&&e.texSubImage2D(n.TEXTURE_2D,yt,0,0,It.width,It.height,Nt,Qt,It.data):e.texImage2D(n.TEXTURE_2D,yt,Wt,It.width,It.height,0,Nt,Qt,It.data)}else if(P.isDataArrayTexture)if(q){if(Tt&&e.texStorage3D(n.TEXTURE_2D_ARRAY,Ot,Wt,bt.width,bt.height,bt.depth),Rt)if(P.layerUpdates.size>0){const yt=K1(bt.width,bt.height,P.format,P.type);for(const xt of P.layerUpdates){const Vt=bt.data.subarray(xt*yt/bt.data.BYTES_PER_ELEMENT,(xt+1)*yt/bt.data.BYTES_PER_ELEMENT);e.texSubImage3D(n.TEXTURE_2D_ARRAY,0,0,0,xt,bt.width,bt.height,1,Nt,Qt,Vt)}P.clearLayerUpdates()}else e.texSubImage3D(n.TEXTURE_2D_ARRAY,0,0,0,0,bt.width,bt.height,bt.depth,Nt,Qt,bt.data)}else e.texImage3D(n.TEXTURE_2D_ARRAY,0,Wt,bt.width,bt.height,bt.depth,0,Nt,Qt,bt.data);else if(P.isData3DTexture)q?(Tt&&e.texStorage3D(n.TEXTURE_3D,Ot,Wt,bt.width,bt.height,bt.depth),Rt&&e.texSubImage3D(n.TEXTURE_3D,0,0,0,0,bt.width,bt.height,bt.depth,Nt,Qt,bt.data)):e.texImage3D(n.TEXTURE_3D,0,Wt,bt.width,bt.height,bt.depth,0,Nt,Qt,bt.data);else if(P.isFramebufferTexture){if(Tt)if(q)e.texStorage2D(n.TEXTURE_2D,Ot,Wt,bt.width,bt.height);else{let yt=bt.width,xt=bt.height;for(let Vt=0;Vt<Ot;Vt++)e.texImage2D(n.TEXTURE_2D,Vt,Wt,yt,xt,0,Nt,Qt,null),yt>>=1,xt>>=1}}else if(ce.length>0){if(q&&Tt){const yt=Kt(ce[0]);e.texStorage2D(n.TEXTURE_2D,Ot,Wt,yt.width,yt.height)}for(let yt=0,xt=ce.length;yt<xt;yt++)It=ce[yt],q?Rt&&e.texSubImage2D(n.TEXTURE_2D,yt,0,0,Nt,Qt,It):e.texImage2D(n.TEXTURE_2D,yt,Wt,Nt,Qt,It);P.generateMipmaps=!1}else if(q){if(Tt){const yt=Kt(bt);e.texStorage2D(n.TEXTURE_2D,Ot,Wt,yt.width,yt.height)}Rt&&e.texSubImage2D(n.TEXTURE_2D,0,0,0,Nt,Qt,bt)}else e.texImage2D(n.TEXTURE_2D,0,Wt,Nt,Qt,bt);g(P)&&m(ft),Gt.__version=pt.version,P.onUpdate&&P.onUpdate(P)}k.__version=P.version}function $(k,P,J){if(P.image.length!==6)return;const ft=St(k,P),_t=P.source;e.bindTexture(n.TEXTURE_CUBE_MAP,k.__webglTexture,n.TEXTURE0+J);const pt=i.get(_t);if(_t.version!==pt.__version||ft===!0){e.activeTexture(n.TEXTURE0+J);const Gt=ve.getPrimaries(ve.workingColorSpace),At=P.colorSpace===Qi?null:ve.getPrimaries(P.colorSpace),Ht=P.colorSpace===Qi||Gt===At?n.NONE:n.BROWSER_DEFAULT_WEBGL;n.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,P.flipY),n.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,P.premultiplyAlpha),n.pixelStorei(n.UNPACK_ALIGNMENT,P.unpackAlignment),n.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,Ht);const zt=P.isCompressedTexture||P.image[0].isCompressedTexture,bt=P.image[0]&&P.image[0].isDataTexture,Nt=[];for(let xt=0;xt<6;xt++)!zt&&!bt?Nt[xt]=v(P.image[xt],!0,s.maxCubemapSize):Nt[xt]=bt?P.image[xt].image:P.image[xt],Nt[xt]=ee(P,Nt[xt]);const Qt=Nt[0],Wt=r.convert(P.format,P.colorSpace),It=r.convert(P.type),ce=x(P.internalFormat,Wt,It,P.colorSpace),q=P.isVideoTexture!==!0,Tt=pt.__version===void 0||ft===!0,Rt=_t.dataReady;let Ot=b(P,Qt);vt(n.TEXTURE_CUBE_MAP,P);let yt;if(zt){q&&Tt&&e.texStorage2D(n.TEXTURE_CUBE_MAP,Ot,ce,Qt.width,Qt.height);for(let xt=0;xt<6;xt++){yt=Nt[xt].mipmaps;for(let Vt=0;Vt<yt.length;Vt++){const oe=yt[Vt];P.format!==ln?Wt!==null?q?Rt&&e.compressedTexSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+xt,Vt,0,0,oe.width,oe.height,Wt,oe.data):e.compressedTexImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+xt,Vt,ce,oe.width,oe.height,0,oe.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):q?Rt&&e.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+xt,Vt,0,0,oe.width,oe.height,Wt,It,oe.data):e.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+xt,Vt,ce,oe.width,oe.height,0,Wt,It,oe.data)}}}else{if(yt=P.mipmaps,q&&Tt){yt.length>0&&Ot++;const xt=Kt(Nt[0]);e.texStorage2D(n.TEXTURE_CUBE_MAP,Ot,ce,xt.width,xt.height)}for(let xt=0;xt<6;xt++)if(bt){q?Rt&&e.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+xt,0,0,0,Nt[xt].width,Nt[xt].height,Wt,It,Nt[xt].data):e.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+xt,0,ce,Nt[xt].width,Nt[xt].height,0,Wt,It,Nt[xt].data);for(let Vt=0;Vt<yt.length;Vt++){const Re=yt[Vt].image[xt].image;q?Rt&&e.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+xt,Vt+1,0,0,Re.width,Re.height,Wt,It,Re.data):e.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+xt,Vt+1,ce,Re.width,Re.height,0,Wt,It,Re.data)}}else{q?Rt&&e.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+xt,0,0,0,Wt,It,Nt[xt]):e.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+xt,0,ce,Wt,It,Nt[xt]);for(let Vt=0;Vt<yt.length;Vt++){const oe=yt[Vt];q?Rt&&e.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+xt,Vt+1,0,0,Wt,It,oe.image[xt]):e.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+xt,Vt+1,ce,Wt,It,oe.image[xt])}}}g(P)&&m(n.TEXTURE_CUBE_MAP),pt.__version=_t.version,P.onUpdate&&P.onUpdate(P)}k.__version=P.version}function z(k,P,J,ft,_t,pt){const Gt=r.convert(J.format,J.colorSpace),At=r.convert(J.type),Ht=x(J.internalFormat,Gt,At,J.colorSpace),zt=i.get(P),bt=i.get(J);if(bt.__renderTarget=P,!zt.__hasExternalTextures){const Nt=Math.max(1,P.width>>pt),Qt=Math.max(1,P.height>>pt);_t===n.TEXTURE_3D||_t===n.TEXTURE_2D_ARRAY?e.texImage3D(_t,pt,Ht,Nt,Qt,P.depth,0,Gt,At,null):e.texImage2D(_t,pt,Ht,Nt,Qt,0,Gt,At,null)}e.bindFramebuffer(n.FRAMEBUFFER,k),Mt(P)?o.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,ft,_t,bt.__webglTexture,0,mt(P)):(_t===n.TEXTURE_2D||_t>=n.TEXTURE_CUBE_MAP_POSITIVE_X&&_t<=n.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&n.framebufferTexture2D(n.FRAMEBUFFER,ft,_t,bt.__webglTexture,pt),e.bindFramebuffer(n.FRAMEBUFFER,null)}function W(k,P,J){if(n.bindRenderbuffer(n.RENDERBUFFER,k),P.depthBuffer){const ft=P.depthTexture,_t=ft&&ft.isDepthTexture?ft.type:null,pt=_(P.stencilBuffer,_t),Gt=P.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,At=mt(P);Mt(P)?o.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,At,pt,P.width,P.height):J?n.renderbufferStorageMultisample(n.RENDERBUFFER,At,pt,P.width,P.height):n.renderbufferStorage(n.RENDERBUFFER,pt,P.width,P.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,Gt,n.RENDERBUFFER,k)}else{const ft=P.textures;for(let _t=0;_t<ft.length;_t++){const pt=ft[_t],Gt=r.convert(pt.format,pt.colorSpace),At=r.convert(pt.type),Ht=x(pt.internalFormat,Gt,At,pt.colorSpace),zt=mt(P);J&&Mt(P)===!1?n.renderbufferStorageMultisample(n.RENDERBUFFER,zt,Ht,P.width,P.height):Mt(P)?o.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,zt,Ht,P.width,P.height):n.renderbufferStorage(n.RENDERBUFFER,Ht,P.width,P.height)}}n.bindRenderbuffer(n.RENDERBUFFER,null)}function G(k,P){if(P&&P.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(e.bindFramebuffer(n.FRAMEBUFFER,k),!(P.depthTexture&&P.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");const ft=i.get(P.depthTexture);ft.__renderTarget=P,(!ft.__webglTexture||P.depthTexture.image.width!==P.width||P.depthTexture.image.height!==P.height)&&(P.depthTexture.image.width=P.width,P.depthTexture.image.height=P.height,P.depthTexture.needsUpdate=!0),N(P.depthTexture,0);const _t=ft.__webglTexture,pt=mt(P);if(P.depthTexture.format===gc)Mt(P)?o.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,n.DEPTH_ATTACHMENT,n.TEXTURE_2D,_t,0,pt):n.framebufferTexture2D(n.FRAMEBUFFER,n.DEPTH_ATTACHMENT,n.TEXTURE_2D,_t,0);else if(P.depthTexture.format===vc)Mt(P)?o.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,n.DEPTH_STENCIL_ATTACHMENT,n.TEXTURE_2D,_t,0,pt):n.framebufferTexture2D(n.FRAMEBUFFER,n.DEPTH_STENCIL_ATTACHMENT,n.TEXTURE_2D,_t,0);else throw new Error("Unknown depthTexture format")}function tt(k){const P=i.get(k),J=k.isWebGLCubeRenderTarget===!0;if(P.__boundDepthTexture!==k.depthTexture){const ft=k.depthTexture;if(P.__depthDisposeCallback&&P.__depthDisposeCallback(),ft){const _t=()=>{delete P.__boundDepthTexture,delete P.__depthDisposeCallback,ft.removeEventListener("dispose",_t)};ft.addEventListener("dispose",_t),P.__depthDisposeCallback=_t}P.__boundDepthTexture=ft}if(k.depthTexture&&!P.__autoAllocateDepthBuffer){if(J)throw new Error("target.depthTexture not supported in Cube render targets");const ft=k.texture.mipmaps;ft&&ft.length>0?G(P.__webglFramebuffer[0],k):G(P.__webglFramebuffer,k)}else if(J){P.__webglDepthbuffer=[];for(let ft=0;ft<6;ft++)if(e.bindFramebuffer(n.FRAMEBUFFER,P.__webglFramebuffer[ft]),P.__webglDepthbuffer[ft]===void 0)P.__webglDepthbuffer[ft]=n.createRenderbuffer(),W(P.__webglDepthbuffer[ft],k,!1);else{const _t=k.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,pt=P.__webglDepthbuffer[ft];n.bindRenderbuffer(n.RENDERBUFFER,pt),n.framebufferRenderbuffer(n.FRAMEBUFFER,_t,n.RENDERBUFFER,pt)}}else{const ft=k.texture.mipmaps;if(ft&&ft.length>0?e.bindFramebuffer(n.FRAMEBUFFER,P.__webglFramebuffer[0]):e.bindFramebuffer(n.FRAMEBUFFER,P.__webglFramebuffer),P.__webglDepthbuffer===void 0)P.__webglDepthbuffer=n.createRenderbuffer(),W(P.__webglDepthbuffer,k,!1);else{const _t=k.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,pt=P.__webglDepthbuffer;n.bindRenderbuffer(n.RENDERBUFFER,pt),n.framebufferRenderbuffer(n.FRAMEBUFFER,_t,n.RENDERBUFFER,pt)}}e.bindFramebuffer(n.FRAMEBUFFER,null)}function ot(k,P,J){const ft=i.get(k);P!==void 0&&z(ft.__webglFramebuffer,k,k.texture,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,0),J!==void 0&&tt(k)}function F(k){const P=k.texture,J=i.get(k),ft=i.get(P);k.addEventListener("dispose",T);const _t=k.textures,pt=k.isWebGLCubeRenderTarget===!0,Gt=_t.length>1;if(Gt||(ft.__webglTexture===void 0&&(ft.__webglTexture=n.createTexture()),ft.__version=P.version,a.memory.textures++),pt){J.__webglFramebuffer=[];for(let At=0;At<6;At++)if(P.mipmaps&&P.mipmaps.length>0){J.__webglFramebuffer[At]=[];for(let Ht=0;Ht<P.mipmaps.length;Ht++)J.__webglFramebuffer[At][Ht]=n.createFramebuffer()}else J.__webglFramebuffer[At]=n.createFramebuffer()}else{if(P.mipmaps&&P.mipmaps.length>0){J.__webglFramebuffer=[];for(let At=0;At<P.mipmaps.length;At++)J.__webglFramebuffer[At]=n.createFramebuffer()}else J.__webglFramebuffer=n.createFramebuffer();if(Gt)for(let At=0,Ht=_t.length;At<Ht;At++){const zt=i.get(_t[At]);zt.__webglTexture===void 0&&(zt.__webglTexture=n.createTexture(),a.memory.textures++)}if(k.samples>0&&Mt(k)===!1){J.__webglMultisampledFramebuffer=n.createFramebuffer(),J.__webglColorRenderbuffer=[],e.bindFramebuffer(n.FRAMEBUFFER,J.__webglMultisampledFramebuffer);for(let At=0;At<_t.length;At++){const Ht=_t[At];J.__webglColorRenderbuffer[At]=n.createRenderbuffer(),n.bindRenderbuffer(n.RENDERBUFFER,J.__webglColorRenderbuffer[At]);const zt=r.convert(Ht.format,Ht.colorSpace),bt=r.convert(Ht.type),Nt=x(Ht.internalFormat,zt,bt,Ht.colorSpace,k.isXRRenderTarget===!0),Qt=mt(k);n.renderbufferStorageMultisample(n.RENDERBUFFER,Qt,Nt,k.width,k.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+At,n.RENDERBUFFER,J.__webglColorRenderbuffer[At])}n.bindRenderbuffer(n.RENDERBUFFER,null),k.depthBuffer&&(J.__webglDepthRenderbuffer=n.createRenderbuffer(),W(J.__webglDepthRenderbuffer,k,!0)),e.bindFramebuffer(n.FRAMEBUFFER,null)}}if(pt){e.bindTexture(n.TEXTURE_CUBE_MAP,ft.__webglTexture),vt(n.TEXTURE_CUBE_MAP,P);for(let At=0;At<6;At++)if(P.mipmaps&&P.mipmaps.length>0)for(let Ht=0;Ht<P.mipmaps.length;Ht++)z(J.__webglFramebuffer[At][Ht],k,P,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+At,Ht);else z(J.__webglFramebuffer[At],k,P,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+At,0);g(P)&&m(n.TEXTURE_CUBE_MAP),e.unbindTexture()}else if(Gt){for(let At=0,Ht=_t.length;At<Ht;At++){const zt=_t[At],bt=i.get(zt);let Nt=n.TEXTURE_2D;(k.isWebGL3DRenderTarget||k.isWebGLArrayRenderTarget)&&(Nt=k.isWebGL3DRenderTarget?n.TEXTURE_3D:n.TEXTURE_2D_ARRAY),e.bindTexture(Nt,bt.__webglTexture),vt(Nt,zt),z(J.__webglFramebuffer,k,zt,n.COLOR_ATTACHMENT0+At,Nt,0),g(zt)&&m(Nt)}e.unbindTexture()}else{let At=n.TEXTURE_2D;if((k.isWebGL3DRenderTarget||k.isWebGLArrayRenderTarget)&&(At=k.isWebGL3DRenderTarget?n.TEXTURE_3D:n.TEXTURE_2D_ARRAY),e.bindTexture(At,ft.__webglTexture),vt(At,P),P.mipmaps&&P.mipmaps.length>0)for(let Ht=0;Ht<P.mipmaps.length;Ht++)z(J.__webglFramebuffer[Ht],k,P,n.COLOR_ATTACHMENT0,At,Ht);else z(J.__webglFramebuffer,k,P,n.COLOR_ATTACHMENT0,At,0);g(P)&&m(At),e.unbindTexture()}k.depthBuffer&&tt(k)}function et(k){const P=k.textures;for(let J=0,ft=P.length;J<ft;J++){const _t=P[J];if(g(_t)){const pt=M(k),Gt=i.get(_t).__webglTexture;e.bindTexture(pt,Gt),m(pt),e.unbindTexture()}}}const Q=[],rt=[];function ut(k){if(k.samples>0){if(Mt(k)===!1){const P=k.textures,J=k.width,ft=k.height;let _t=n.COLOR_BUFFER_BIT;const pt=k.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,Gt=i.get(k),At=P.length>1;if(At)for(let zt=0;zt<P.length;zt++)e.bindFramebuffer(n.FRAMEBUFFER,Gt.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+zt,n.RENDERBUFFER,null),e.bindFramebuffer(n.FRAMEBUFFER,Gt.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+zt,n.TEXTURE_2D,null,0);e.bindFramebuffer(n.READ_FRAMEBUFFER,Gt.__webglMultisampledFramebuffer);const Ht=k.texture.mipmaps;Ht&&Ht.length>0?e.bindFramebuffer(n.DRAW_FRAMEBUFFER,Gt.__webglFramebuffer[0]):e.bindFramebuffer(n.DRAW_FRAMEBUFFER,Gt.__webglFramebuffer);for(let zt=0;zt<P.length;zt++){if(k.resolveDepthBuffer&&(k.depthBuffer&&(_t|=n.DEPTH_BUFFER_BIT),k.stencilBuffer&&k.resolveStencilBuffer&&(_t|=n.STENCIL_BUFFER_BIT)),At){n.framebufferRenderbuffer(n.READ_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.RENDERBUFFER,Gt.__webglColorRenderbuffer[zt]);const bt=i.get(P[zt]).__webglTexture;n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,bt,0)}n.blitFramebuffer(0,0,J,ft,0,0,J,ft,_t,n.NEAREST),c===!0&&(Q.length=0,rt.length=0,Q.push(n.COLOR_ATTACHMENT0+zt),k.depthBuffer&&k.resolveDepthBuffer===!1&&(Q.push(pt),rt.push(pt),n.invalidateFramebuffer(n.DRAW_FRAMEBUFFER,rt)),n.invalidateFramebuffer(n.READ_FRAMEBUFFER,Q))}if(e.bindFramebuffer(n.READ_FRAMEBUFFER,null),e.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),At)for(let zt=0;zt<P.length;zt++){e.bindFramebuffer(n.FRAMEBUFFER,Gt.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+zt,n.RENDERBUFFER,Gt.__webglColorRenderbuffer[zt]);const bt=i.get(P[zt]).__webglTexture;e.bindFramebuffer(n.FRAMEBUFFER,Gt.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+zt,n.TEXTURE_2D,bt,0)}e.bindFramebuffer(n.DRAW_FRAMEBUFFER,Gt.__webglMultisampledFramebuffer)}else if(k.depthBuffer&&k.resolveDepthBuffer===!1&&c){const P=k.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT;n.invalidateFramebuffer(n.DRAW_FRAMEBUFFER,[P])}}}function mt(k){return Math.min(s.maxSamples,k.samples)}function Mt(k){const P=i.get(k);return k.samples>0&&t.has("WEBGL_multisampled_render_to_texture")===!0&&P.__useRenderToTexture!==!1}function wt(k){const P=a.render.frame;u.get(k)!==P&&(u.set(k,P),k.update())}function ee(k,P){const J=k.colorSpace,ft=k.format,_t=k.type;return k.isCompressedTexture===!0||k.isVideoTexture===!0||J!==qr&&J!==Qi&&(ve.getTransfer(J)===Se?(ft!==ln||_t!==Hi)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",J)),P}function Kt(k){return typeof HTMLImageElement<"u"&&k instanceof HTMLImageElement?(l.width=k.naturalWidth||k.width,l.height=k.naturalHeight||k.height):typeof VideoFrame<"u"&&k instanceof VideoFrame?(l.width=k.displayWidth,l.height=k.displayHeight):(l.width=k.width,l.height=k.height),l}this.allocateTextureUnit=L,this.resetTextureUnits=R,this.setTexture2D=N,this.setTexture2DArray=B,this.setTexture3D=X,this.setTextureCube=H,this.rebindTextures=ot,this.setupRenderTarget=F,this.updateRenderTargetMipmap=et,this.updateMultisampleRenderTarget=ut,this.setupDepthRenderbuffer=tt,this.setupFrameBufferTexture=z,this.useMultisampledRTT=Mt}function Wy(n,t){function e(i,s=Qi){let r;const a=ve.getTransfer(s);if(i===Hi)return n.UNSIGNED_BYTE;if(i===Zf)return n.UNSIGNED_SHORT_4_4_4_4;if(i===Jf)return n.UNSIGNED_SHORT_5_5_5_1;if(i===Cg)return n.UNSIGNED_INT_5_9_9_9_REV;if(i===Lg)return n.UNSIGNED_INT_10F_11F_11F_REV;if(i===Ag)return n.BYTE;if(i===Rg)return n.SHORT;if(i===pc)return n.UNSIGNED_SHORT;if(i===jf)return n.INT;if(i===$r)return n.UNSIGNED_INT;if(i===is)return n.FLOAT;if(i===cr)return n.HALF_FLOAT;if(i===Pg)return n.ALPHA;if(i===Ig)return n.RGB;if(i===ln)return n.RGBA;if(i===gc)return n.DEPTH_COMPONENT;if(i===vc)return n.DEPTH_STENCIL;if(i===Kf)return n.RED;if(i===Qf)return n.RED_INTEGER;if(i===Dg)return n.RG;if(i===td)return n.RG_INTEGER;if(i===ed)return n.RGBA_INTEGER;if(i===kl||i===Ol||i===Bl||i===Hl)if(a===Se)if(r=t.get("WEBGL_compressed_texture_s3tc_srgb"),r!==null){if(i===kl)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(i===Ol)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(i===Bl)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(i===Hl)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(r=t.get("WEBGL_compressed_texture_s3tc"),r!==null){if(i===kl)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(i===Ol)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(i===Bl)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(i===Hl)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(i===Lu||i===Pu||i===Iu||i===Du)if(r=t.get("WEBGL_compressed_texture_pvrtc"),r!==null){if(i===Lu)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(i===Pu)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(i===Iu)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(i===Du)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(i===Uu||i===Fu||i===Nu)if(r=t.get("WEBGL_compressed_texture_etc"),r!==null){if(i===Uu||i===Fu)return a===Se?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(i===Nu)return a===Se?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(i===ku||i===Ou||i===Bu||i===Hu||i===zu||i===Vu||i===Gu||i===Wu||i===Xu||i===$u||i===qu||i===Yu||i===ju||i===Zu)if(r=t.get("WEBGL_compressed_texture_astc"),r!==null){if(i===ku)return a===Se?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(i===Ou)return a===Se?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(i===Bu)return a===Se?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(i===Hu)return a===Se?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(i===zu)return a===Se?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(i===Vu)return a===Se?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(i===Gu)return a===Se?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(i===Wu)return a===Se?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(i===Xu)return a===Se?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(i===$u)return a===Se?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(i===qu)return a===Se?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(i===Yu)return a===Se?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(i===ju)return a===Se?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(i===Zu)return a===Se?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(i===Ju||i===Ku||i===Qu)if(r=t.get("EXT_texture_compression_bptc"),r!==null){if(i===Ju)return a===Se?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(i===Ku)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(i===Qu)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(i===tf||i===ef||i===nf||i===sf)if(r=t.get("EXT_texture_compression_rgtc"),r!==null){if(i===tf)return r.COMPRESSED_RED_RGTC1_EXT;if(i===ef)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(i===nf)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(i===sf)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return i===mc?n.UNSIGNED_INT_24_8:n[i]!==void 0?n[i]:null}return{convert:e}}const Xy=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,$y=`
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

}`;class qy{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(t,e){if(this.texture===null){const i=new Yg(t.texture);(t.depthNear!==e.depthNear||t.depthFar!==e.depthFar)&&(this.depthNear=t.depthNear,this.depthFar=t.depthFar),this.texture=i}}getMesh(t){if(this.texture!==null&&this.mesh===null){const e=t.cameras[0].viewport,i=new nn({vertexShader:Xy,fragmentShader:$y,uniforms:{depthColor:{value:this.texture},depthWidth:{value:e.z},depthHeight:{value:e.w}}});this.mesh=new nt(new _i(20,20),i)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class Yy extends yo{constructor(t,e){super();const i=this;let s=null,r=1,a=null,o="local-floor",c=1,l=null,u=null,h=null,f=null,d=null,p=null;const v=typeof XRWebGLBinding<"u",g=new qy,m={},M=e.getContextAttributes();let x=null,_=null;const b=[],S=[],T=new ht;let A=null;const w=new jn;w.viewport=new fe;const y=new jn;y.viewport=new fe;const E=[w,y],R=new f3;let L=null,I=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(V){let $=b[V];return $===void 0&&($=new d0,b[V]=$),$.getTargetRaySpace()},this.getControllerGrip=function(V){let $=b[V];return $===void 0&&($=new d0,b[V]=$),$.getGripSpace()},this.getHand=function(V){let $=b[V];return $===void 0&&($=new d0,b[V]=$),$.getHandSpace()};function N(V){const $=S.indexOf(V.inputSource);if($===-1)return;const z=b[$];z!==void 0&&(z.update(V.inputSource,V.frame,l||a),z.dispatchEvent({type:V.type,data:V.inputSource}))}function B(){s.removeEventListener("select",N),s.removeEventListener("selectstart",N),s.removeEventListener("selectend",N),s.removeEventListener("squeeze",N),s.removeEventListener("squeezestart",N),s.removeEventListener("squeezeend",N),s.removeEventListener("end",B),s.removeEventListener("inputsourceschange",X);for(let V=0;V<b.length;V++){const $=S[V];$!==null&&(S[V]=null,b[V].disconnect($))}L=null,I=null,g.reset();for(const V in m)delete m[V];t.setRenderTarget(x),d=null,f=null,h=null,s=null,_=null,Ft.stop(),i.isPresenting=!1,t.setPixelRatio(A),t.setSize(T.width,T.height,!1),i.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(V){r=V,i.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(V){o=V,i.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return l||a},this.setReferenceSpace=function(V){l=V},this.getBaseLayer=function(){return f!==null?f:d},this.getBinding=function(){return h===null&&v&&(h=new XRWebGLBinding(s,e)),h},this.getFrame=function(){return p},this.getSession=function(){return s},this.setSession=async function(V){if(s=V,s!==null){if(x=t.getRenderTarget(),s.addEventListener("select",N),s.addEventListener("selectstart",N),s.addEventListener("selectend",N),s.addEventListener("squeeze",N),s.addEventListener("squeezestart",N),s.addEventListener("squeezeend",N),s.addEventListener("end",B),s.addEventListener("inputsourceschange",X),M.xrCompatible!==!0&&await e.makeXRCompatible(),A=t.getPixelRatio(),t.getSize(T),v&&"createProjectionLayer"in XRWebGLBinding.prototype){let z=null,W=null,G=null;M.depth&&(G=M.stencil?e.DEPTH24_STENCIL8:e.DEPTH_COMPONENT24,z=M.stencil?vc:gc,W=M.stencil?mc:$r);const tt={colorFormat:e.RGBA8,depthFormat:G,scaleFactor:r};h=this.getBinding(),f=h.createProjectionLayer(tt),s.updateRenderState({layers:[f]}),t.setPixelRatio(1),t.setSize(f.textureWidth,f.textureHeight,!1),_=new En(f.textureWidth,f.textureHeight,{format:ln,type:Hi,depthTexture:new qg(f.textureWidth,f.textureHeight,W,void 0,void 0,void 0,void 0,void 0,void 0,z),stencilBuffer:M.stencil,colorSpace:t.outputColorSpace,samples:M.antialias?4:0,resolveDepthBuffer:f.ignoreDepthValues===!1,resolveStencilBuffer:f.ignoreDepthValues===!1})}else{const z={antialias:M.antialias,alpha:!0,depth:M.depth,stencil:M.stencil,framebufferScaleFactor:r};d=new XRWebGLLayer(s,e,z),s.updateRenderState({baseLayer:d}),t.setPixelRatio(1),t.setSize(d.framebufferWidth,d.framebufferHeight,!1),_=new En(d.framebufferWidth,d.framebufferHeight,{format:ln,type:Hi,colorSpace:t.outputColorSpace,stencilBuffer:M.stencil,resolveDepthBuffer:d.ignoreDepthValues===!1,resolveStencilBuffer:d.ignoreDepthValues===!1})}_.isXRRenderTarget=!0,this.setFoveation(c),l=null,a=await s.requestReferenceSpace(o),Ft.setContext(s),Ft.start(),i.isPresenting=!0,i.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode},this.getDepthTexture=function(){return g.getDepthTexture()};function X(V){for(let $=0;$<V.removed.length;$++){const z=V.removed[$],W=S.indexOf(z);W>=0&&(S[W]=null,b[W].disconnect(z))}for(let $=0;$<V.added.length;$++){const z=V.added[$];let W=S.indexOf(z);if(W===-1){for(let tt=0;tt<b.length;tt++)if(tt>=S.length){S.push(z),W=tt;break}else if(S[tt]===null){S[tt]=z,W=tt;break}if(W===-1)break}const G=b[W];G&&G.connect(z)}}const H=new C,Y=new C;function it(V,$,z){H.setFromMatrixPosition($.matrixWorld),Y.setFromMatrixPosition(z.matrixWorld);const W=H.distanceTo(Y),G=$.projectionMatrix.elements,tt=z.projectionMatrix.elements,ot=G[14]/(G[10]-1),F=G[14]/(G[10]+1),et=(G[9]+1)/G[5],Q=(G[9]-1)/G[5],rt=(G[8]-1)/G[0],ut=(tt[8]+1)/tt[0],mt=ot*rt,Mt=ot*ut,wt=W/(-rt+ut),ee=wt*-rt;if($.matrixWorld.decompose(V.position,V.quaternion,V.scale),V.translateX(ee),V.translateZ(wt),V.matrixWorld.compose(V.position,V.quaternion,V.scale),V.matrixWorldInverse.copy(V.matrixWorld).invert(),G[10]===-1)V.projectionMatrix.copy($.projectionMatrix),V.projectionMatrixInverse.copy($.projectionMatrixInverse);else{const Kt=ot+wt,k=F+wt,P=mt-ee,J=Mt+(W-ee),ft=et*F/k*Kt,_t=Q*F/k*Kt;V.projectionMatrix.makePerspective(P,J,ft,_t,Kt,k),V.projectionMatrixInverse.copy(V.projectionMatrix).invert()}}function dt(V,$){$===null?V.matrixWorld.copy(V.matrix):V.matrixWorld.multiplyMatrices($.matrixWorld,V.matrix),V.matrixWorldInverse.copy(V.matrixWorld).invert()}this.updateCamera=function(V){if(s===null)return;let $=V.near,z=V.far;g.texture!==null&&(g.depthNear>0&&($=g.depthNear),g.depthFar>0&&(z=g.depthFar)),R.near=y.near=w.near=$,R.far=y.far=w.far=z,(L!==R.near||I!==R.far)&&(s.updateRenderState({depthNear:R.near,depthFar:R.far}),L=R.near,I=R.far),R.layers.mask=V.layers.mask|6,w.layers.mask=R.layers.mask&3,y.layers.mask=R.layers.mask&5;const W=V.parent,G=R.cameras;dt(R,W);for(let tt=0;tt<G.length;tt++)dt(G[tt],W);G.length===2?it(R,w,y):R.projectionMatrix.copy(w.projectionMatrix),vt(V,R,W)};function vt(V,$,z){z===null?V.matrix.copy($.matrixWorld):(V.matrix.copy(z.matrixWorld),V.matrix.invert(),V.matrix.multiply($.matrixWorld)),V.matrix.decompose(V.position,V.quaternion,V.scale),V.updateMatrixWorld(!0),V.projectionMatrix.copy($.projectionMatrix),V.projectionMatrixInverse.copy($.projectionMatrixInverse),V.isPerspectiveCamera&&(V.fov=fo*2*Math.atan(1/V.projectionMatrix.elements[5]),V.zoom=1)}this.getCamera=function(){return R},this.getFoveation=function(){if(!(f===null&&d===null))return c},this.setFoveation=function(V){c=V,f!==null&&(f.fixedFoveation=V),d!==null&&d.fixedFoveation!==void 0&&(d.fixedFoveation=V)},this.hasDepthSensing=function(){return g.texture!==null},this.getDepthSensingMesh=function(){return g.getMesh(R)},this.getCameraTexture=function(V){return m[V]};let St=null;function Ct(V,$){if(u=$.getViewerPose(l||a),p=$,u!==null){const z=u.views;d!==null&&(t.setRenderTargetFramebuffer(_,d.framebuffer),t.setRenderTarget(_));let W=!1;z.length!==R.cameras.length&&(R.cameras.length=0,W=!0);for(let F=0;F<z.length;F++){const et=z[F];let Q=null;if(d!==null)Q=d.getViewport(et);else{const ut=h.getViewSubImage(f,et);Q=ut.viewport,F===0&&(t.setRenderTargetTextures(_,ut.colorTexture,ut.depthStencilTexture),t.setRenderTarget(_))}let rt=E[F];rt===void 0&&(rt=new jn,rt.layers.enable(F),rt.viewport=new fe,E[F]=rt),rt.matrix.fromArray(et.transform.matrix),rt.matrix.decompose(rt.position,rt.quaternion,rt.scale),rt.projectionMatrix.fromArray(et.projectionMatrix),rt.projectionMatrixInverse.copy(rt.projectionMatrix).invert(),rt.viewport.set(Q.x,Q.y,Q.width,Q.height),F===0&&(R.matrix.copy(rt.matrix),R.matrix.decompose(R.position,R.quaternion,R.scale)),W===!0&&R.cameras.push(rt)}const G=s.enabledFeatures;if(G&&G.includes("depth-sensing")&&s.depthUsage=="gpu-optimized"&&v){h=i.getBinding();const F=h.getDepthInformation(z[0]);F&&F.isValid&&F.texture&&g.init(F,s.renderState)}if(G&&G.includes("camera-access")&&v){t.state.unbindTexture(),h=i.getBinding();for(let F=0;F<z.length;F++){const et=z[F].camera;if(et){let Q=m[et];Q||(Q=new Yg,m[et]=Q);const rt=h.getCameraImage(et);Q.sourceTexture=rt}}}}for(let z=0;z<b.length;z++){const W=S[z],G=b[z];W!==null&&G!==void 0&&G.update(W,$,l||a)}St&&St(V,$),$.detectedPlanes&&i.dispatchEvent({type:"planesdetected",data:$}),p=null}const Ft=new r2;Ft.setAnimationLoop(Ct),this.setAnimationLoop=function(V){St=V},this.dispose=function(){}}}const xr=new Cn,jy=new se;function Zy(n,t){function e(g,m){g.matrixAutoUpdate===!0&&g.updateMatrix(),m.value.copy(g.matrix)}function i(g,m){m.color.getRGB(g.fogColor.value,Hg(n)),m.isFog?(g.fogNear.value=m.near,g.fogFar.value=m.far):m.isFogExp2&&(g.fogDensity.value=m.density)}function s(g,m,M,x,_){m.isMeshBasicMaterial||m.isMeshLambertMaterial?r(g,m):m.isMeshToonMaterial?(r(g,m),h(g,m)):m.isMeshPhongMaterial?(r(g,m),u(g,m)):m.isMeshStandardMaterial?(r(g,m),f(g,m),m.isMeshPhysicalMaterial&&d(g,m,_)):m.isMeshMatcapMaterial?(r(g,m),p(g,m)):m.isMeshDepthMaterial?r(g,m):m.isMeshDistanceMaterial?(r(g,m),v(g,m)):m.isMeshNormalMaterial?r(g,m):m.isLineBasicMaterial?(a(g,m),m.isLineDashedMaterial&&o(g,m)):m.isPointsMaterial?c(g,m,M,x):m.isSpriteMaterial?l(g,m):m.isShadowMaterial?(g.color.value.copy(m.color),g.opacity.value=m.opacity):m.isShaderMaterial&&(m.uniformsNeedUpdate=!1)}function r(g,m){g.opacity.value=m.opacity,m.color&&g.diffuse.value.copy(m.color),m.emissive&&g.emissive.value.copy(m.emissive).multiplyScalar(m.emissiveIntensity),m.map&&(g.map.value=m.map,e(m.map,g.mapTransform)),m.alphaMap&&(g.alphaMap.value=m.alphaMap,e(m.alphaMap,g.alphaMapTransform)),m.bumpMap&&(g.bumpMap.value=m.bumpMap,e(m.bumpMap,g.bumpMapTransform),g.bumpScale.value=m.bumpScale,m.side===Bn&&(g.bumpScale.value*=-1)),m.normalMap&&(g.normalMap.value=m.normalMap,e(m.normalMap,g.normalMapTransform),g.normalScale.value.copy(m.normalScale),m.side===Bn&&g.normalScale.value.negate()),m.displacementMap&&(g.displacementMap.value=m.displacementMap,e(m.displacementMap,g.displacementMapTransform),g.displacementScale.value=m.displacementScale,g.displacementBias.value=m.displacementBias),m.emissiveMap&&(g.emissiveMap.value=m.emissiveMap,e(m.emissiveMap,g.emissiveMapTransform)),m.specularMap&&(g.specularMap.value=m.specularMap,e(m.specularMap,g.specularMapTransform)),m.alphaTest>0&&(g.alphaTest.value=m.alphaTest);const M=t.get(m),x=M.envMap,_=M.envMapRotation;x&&(g.envMap.value=x,xr.copy(_),xr.x*=-1,xr.y*=-1,xr.z*=-1,x.isCubeTexture&&x.isRenderTargetTexture===!1&&(xr.y*=-1,xr.z*=-1),g.envMapRotation.value.setFromMatrix4(jy.makeRotationFromEuler(xr)),g.flipEnvMap.value=x.isCubeTexture&&x.isRenderTargetTexture===!1?-1:1,g.reflectivity.value=m.reflectivity,g.ior.value=m.ior,g.refractionRatio.value=m.refractionRatio),m.lightMap&&(g.lightMap.value=m.lightMap,g.lightMapIntensity.value=m.lightMapIntensity,e(m.lightMap,g.lightMapTransform)),m.aoMap&&(g.aoMap.value=m.aoMap,g.aoMapIntensity.value=m.aoMapIntensity,e(m.aoMap,g.aoMapTransform))}function a(g,m){g.diffuse.value.copy(m.color),g.opacity.value=m.opacity,m.map&&(g.map.value=m.map,e(m.map,g.mapTransform))}function o(g,m){g.dashSize.value=m.dashSize,g.totalSize.value=m.dashSize+m.gapSize,g.scale.value=m.scale}function c(g,m,M,x){g.diffuse.value.copy(m.color),g.opacity.value=m.opacity,g.size.value=m.size*M,g.scale.value=x*.5,m.map&&(g.map.value=m.map,e(m.map,g.uvTransform)),m.alphaMap&&(g.alphaMap.value=m.alphaMap,e(m.alphaMap,g.alphaMapTransform)),m.alphaTest>0&&(g.alphaTest.value=m.alphaTest)}function l(g,m){g.diffuse.value.copy(m.color),g.opacity.value=m.opacity,g.rotation.value=m.rotation,m.map&&(g.map.value=m.map,e(m.map,g.mapTransform)),m.alphaMap&&(g.alphaMap.value=m.alphaMap,e(m.alphaMap,g.alphaMapTransform)),m.alphaTest>0&&(g.alphaTest.value=m.alphaTest)}function u(g,m){g.specular.value.copy(m.specular),g.shininess.value=Math.max(m.shininess,1e-4)}function h(g,m){m.gradientMap&&(g.gradientMap.value=m.gradientMap)}function f(g,m){g.metalness.value=m.metalness,m.metalnessMap&&(g.metalnessMap.value=m.metalnessMap,e(m.metalnessMap,g.metalnessMapTransform)),g.roughness.value=m.roughness,m.roughnessMap&&(g.roughnessMap.value=m.roughnessMap,e(m.roughnessMap,g.roughnessMapTransform)),m.envMap&&(g.envMapIntensity.value=m.envMapIntensity)}function d(g,m,M){g.ior.value=m.ior,m.sheen>0&&(g.sheenColor.value.copy(m.sheenColor).multiplyScalar(m.sheen),g.sheenRoughness.value=m.sheenRoughness,m.sheenColorMap&&(g.sheenColorMap.value=m.sheenColorMap,e(m.sheenColorMap,g.sheenColorMapTransform)),m.sheenRoughnessMap&&(g.sheenRoughnessMap.value=m.sheenRoughnessMap,e(m.sheenRoughnessMap,g.sheenRoughnessMapTransform))),m.clearcoat>0&&(g.clearcoat.value=m.clearcoat,g.clearcoatRoughness.value=m.clearcoatRoughness,m.clearcoatMap&&(g.clearcoatMap.value=m.clearcoatMap,e(m.clearcoatMap,g.clearcoatMapTransform)),m.clearcoatRoughnessMap&&(g.clearcoatRoughnessMap.value=m.clearcoatRoughnessMap,e(m.clearcoatRoughnessMap,g.clearcoatRoughnessMapTransform)),m.clearcoatNormalMap&&(g.clearcoatNormalMap.value=m.clearcoatNormalMap,e(m.clearcoatNormalMap,g.clearcoatNormalMapTransform),g.clearcoatNormalScale.value.copy(m.clearcoatNormalScale),m.side===Bn&&g.clearcoatNormalScale.value.negate())),m.dispersion>0&&(g.dispersion.value=m.dispersion),m.iridescence>0&&(g.iridescence.value=m.iridescence,g.iridescenceIOR.value=m.iridescenceIOR,g.iridescenceThicknessMinimum.value=m.iridescenceThicknessRange[0],g.iridescenceThicknessMaximum.value=m.iridescenceThicknessRange[1],m.iridescenceMap&&(g.iridescenceMap.value=m.iridescenceMap,e(m.iridescenceMap,g.iridescenceMapTransform)),m.iridescenceThicknessMap&&(g.iridescenceThicknessMap.value=m.iridescenceThicknessMap,e(m.iridescenceThicknessMap,g.iridescenceThicknessMapTransform))),m.transmission>0&&(g.transmission.value=m.transmission,g.transmissionSamplerMap.value=M.texture,g.transmissionSamplerSize.value.set(M.width,M.height),m.transmissionMap&&(g.transmissionMap.value=m.transmissionMap,e(m.transmissionMap,g.transmissionMapTransform)),g.thickness.value=m.thickness,m.thicknessMap&&(g.thicknessMap.value=m.thicknessMap,e(m.thicknessMap,g.thicknessMapTransform)),g.attenuationDistance.value=m.attenuationDistance,g.attenuationColor.value.copy(m.attenuationColor)),m.anisotropy>0&&(g.anisotropyVector.value.set(m.anisotropy*Math.cos(m.anisotropyRotation),m.anisotropy*Math.sin(m.anisotropyRotation)),m.anisotropyMap&&(g.anisotropyMap.value=m.anisotropyMap,e(m.anisotropyMap,g.anisotropyMapTransform))),g.specularIntensity.value=m.specularIntensity,g.specularColor.value.copy(m.specularColor),m.specularColorMap&&(g.specularColorMap.value=m.specularColorMap,e(m.specularColorMap,g.specularColorMapTransform)),m.specularIntensityMap&&(g.specularIntensityMap.value=m.specularIntensityMap,e(m.specularIntensityMap,g.specularIntensityMapTransform))}function p(g,m){m.matcap&&(g.matcap.value=m.matcap)}function v(g,m){const M=t.get(m).light;g.referencePosition.value.setFromMatrixPosition(M.matrixWorld),g.nearDistance.value=M.shadow.camera.near,g.farDistance.value=M.shadow.camera.far}return{refreshFogUniforms:i,refreshMaterialUniforms:s}}function Jy(n,t,e,i){let s={},r={},a=[];const o=n.getParameter(n.MAX_UNIFORM_BUFFER_BINDINGS);function c(M,x){const _=x.program;i.uniformBlockBinding(M,_)}function l(M,x){let _=s[M.id];_===void 0&&(p(M),_=u(M),s[M.id]=_,M.addEventListener("dispose",g));const b=x.program;i.updateUBOMapping(M,b);const S=t.render.frame;r[M.id]!==S&&(f(M),r[M.id]=S)}function u(M){const x=h();M.__bindingPointIndex=x;const _=n.createBuffer(),b=M.__size,S=M.usage;return n.bindBuffer(n.UNIFORM_BUFFER,_),n.bufferData(n.UNIFORM_BUFFER,b,S),n.bindBuffer(n.UNIFORM_BUFFER,null),n.bindBufferBase(n.UNIFORM_BUFFER,x,_),_}function h(){for(let M=0;M<o;M++)if(a.indexOf(M)===-1)return a.push(M),M;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function f(M){const x=s[M.id],_=M.uniforms,b=M.__cache;n.bindBuffer(n.UNIFORM_BUFFER,x);for(let S=0,T=_.length;S<T;S++){const A=Array.isArray(_[S])?_[S]:[_[S]];for(let w=0,y=A.length;w<y;w++){const E=A[w];if(d(E,S,w,b)===!0){const R=E.__offset,L=Array.isArray(E.value)?E.value:[E.value];let I=0;for(let N=0;N<L.length;N++){const B=L[N],X=v(B);typeof B=="number"||typeof B=="boolean"?(E.__data[0]=B,n.bufferSubData(n.UNIFORM_BUFFER,R+I,E.__data)):B.isMatrix3?(E.__data[0]=B.elements[0],E.__data[1]=B.elements[1],E.__data[2]=B.elements[2],E.__data[3]=0,E.__data[4]=B.elements[3],E.__data[5]=B.elements[4],E.__data[6]=B.elements[5],E.__data[7]=0,E.__data[8]=B.elements[6],E.__data[9]=B.elements[7],E.__data[10]=B.elements[8],E.__data[11]=0):(B.toArray(E.__data,I),I+=X.storage/Float32Array.BYTES_PER_ELEMENT)}n.bufferSubData(n.UNIFORM_BUFFER,R,E.__data)}}}n.bindBuffer(n.UNIFORM_BUFFER,null)}function d(M,x,_,b){const S=M.value,T=x+"_"+_;if(b[T]===void 0)return typeof S=="number"||typeof S=="boolean"?b[T]=S:b[T]=S.clone(),!0;{const A=b[T];if(typeof S=="number"||typeof S=="boolean"){if(A!==S)return b[T]=S,!0}else if(A.equals(S)===!1)return A.copy(S),!0}return!1}function p(M){const x=M.uniforms;let _=0;const b=16;for(let T=0,A=x.length;T<A;T++){const w=Array.isArray(x[T])?x[T]:[x[T]];for(let y=0,E=w.length;y<E;y++){const R=w[y],L=Array.isArray(R.value)?R.value:[R.value];for(let I=0,N=L.length;I<N;I++){const B=L[I],X=v(B),H=_%b,Y=H%X.boundary,it=H+Y;_+=Y,it!==0&&b-it<X.storage&&(_+=b-it),R.__data=new Float32Array(X.storage/Float32Array.BYTES_PER_ELEMENT),R.__offset=_,_+=X.storage}}}const S=_%b;return S>0&&(_+=b-S),M.__size=_,M.__cache={},this}function v(M){const x={boundary:0,storage:0};return typeof M=="number"||typeof M=="boolean"?(x.boundary=4,x.storage=4):M.isVector2?(x.boundary=8,x.storage=8):M.isVector3||M.isColor?(x.boundary=16,x.storage=12):M.isVector4?(x.boundary=16,x.storage=16):M.isMatrix3?(x.boundary=48,x.storage=48):M.isMatrix4?(x.boundary=64,x.storage=64):M.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",M),x}function g(M){const x=M.target;x.removeEventListener("dispose",g);const _=a.indexOf(x.__bindingPointIndex);a.splice(_,1),n.deleteBuffer(s[x.id]),delete s[x.id],delete r[x.id]}function m(){for(const M in s)n.deleteBuffer(s[M]);a=[],s={},r={}}return{bind:c,update:l,dispose:m}}class Ky{constructor(t={}){const{canvas:e=WM(),context:i=null,depth:s=!0,stencil:r=!1,alpha:a=!1,antialias:o=!1,premultipliedAlpha:c=!0,preserveDrawingBuffer:l=!1,powerPreference:u="default",failIfMajorPerformanceCaveat:h=!1,reversedDepthBuffer:f=!1}=t;this.isWebGLRenderer=!0;let d;if(i!==null){if(typeof WebGLRenderingContext<"u"&&i instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");d=i.getContextAttributes().alpha}else d=a;const p=new Uint32Array(4),v=new Int32Array(4);let g=null,m=null;const M=[],x=[];this.domElement=e,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=nr,this.toneMappingExposure=1,this.transmissionResolutionScale=1;const _=this;let b=!1;this._outputColorSpace=xn;let S=0,T=0,A=null,w=-1,y=null;const E=new fe,R=new fe;let L=null;const I=new gt(0);let N=0,B=e.width,X=e.height,H=1,Y=null,it=null;const dt=new fe(0,0,B,X),vt=new fe(0,0,B,X);let St=!1;const Ct=new ld;let Ft=!1,V=!1;const $=new se,z=new C,W=new fe,G={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let tt=!1;function ot(){return A===null?H:1}let F=i;function et(U,j){return e.getContext(U,j)}try{const U={alpha:!0,depth:s,stencil:r,antialias:o,premultipliedAlpha:c,preserveDrawingBuffer:l,powerPreference:u,failIfMajorPerformanceCaveat:h};if("setAttribute"in e&&e.setAttribute("data-engine",`three.js r${Yf}`),e.addEventListener("webglcontextlost",Rt,!1),e.addEventListener("webglcontextrestored",Ot,!1),e.addEventListener("webglcontextcreationerror",yt,!1),F===null){const j="webgl2";if(F=et(j,U),F===null)throw et(j)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(U){throw console.error("THREE.WebGLRenderer: "+U.message),U}let Q,rt,ut,mt,Mt,wt,ee,Kt,k,P,J,ft,_t,pt,Gt,At,Ht,zt,bt,Nt,Qt,Wt,It,ce;function q(){Q=new cb(F),Q.init(),Wt=new Wy(F,Q),rt=new eb(F,Q,t,Wt),ut=new Vy(F,Q),rt.reversedDepthBuffer&&f&&ut.buffers.depth.setReversed(!0),mt=new ub(F),Mt=new Cy,wt=new Gy(F,Q,ut,Mt,rt,Wt,mt),ee=new ib(_),Kt=new ob(_),k=new v3(F),It=new Q5(F,k),P=new lb(F,k,mt,It),J=new db(F,P,k,mt),bt=new fb(F,rt,wt),At=new nb(Mt),ft=new Ry(_,ee,Kt,Q,rt,It,At),_t=new Zy(_,Mt),pt=new Py,Gt=new ky(Q),zt=new K5(_,ee,Kt,ut,J,d,c),Ht=new Hy(_,J,rt),ce=new Jy(F,mt,rt,ut),Nt=new tb(F,Q,mt),Qt=new hb(F,Q,mt),mt.programs=ft.programs,_.capabilities=rt,_.extensions=Q,_.properties=Mt,_.renderLists=pt,_.shadowMap=Ht,_.state=ut,_.info=mt}q();const Tt=new Yy(_,F);this.xr=Tt,this.getContext=function(){return F},this.getContextAttributes=function(){return F.getContextAttributes()},this.forceContextLoss=function(){const U=Q.get("WEBGL_lose_context");U&&U.loseContext()},this.forceContextRestore=function(){const U=Q.get("WEBGL_lose_context");U&&U.restoreContext()},this.getPixelRatio=function(){return H},this.setPixelRatio=function(U){U!==void 0&&(H=U,this.setSize(B,X,!1))},this.getSize=function(U){return U.set(B,X)},this.setSize=function(U,j,at=!0){if(Tt.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}B=U,X=j,e.width=Math.floor(U*H),e.height=Math.floor(j*H),at===!0&&(e.style.width=U+"px",e.style.height=j+"px"),this.setViewport(0,0,U,j)},this.getDrawingBufferSize=function(U){return U.set(B*H,X*H).floor()},this.setDrawingBufferSize=function(U,j,at){B=U,X=j,H=at,e.width=Math.floor(U*at),e.height=Math.floor(j*at),this.setViewport(0,0,U,j)},this.getCurrentViewport=function(U){return U.copy(E)},this.getViewport=function(U){return U.copy(dt)},this.setViewport=function(U,j,at,ct){U.isVector4?dt.set(U.x,U.y,U.z,U.w):dt.set(U,j,at,ct),ut.viewport(E.copy(dt).multiplyScalar(H).round())},this.getScissor=function(U){return U.copy(vt)},this.setScissor=function(U,j,at,ct){U.isVector4?vt.set(U.x,U.y,U.z,U.w):vt.set(U,j,at,ct),ut.scissor(R.copy(vt).multiplyScalar(H).round())},this.getScissorTest=function(){return St},this.setScissorTest=function(U){ut.setScissorTest(St=U)},this.setOpaqueSort=function(U){Y=U},this.setTransparentSort=function(U){it=U},this.getClearColor=function(U){return U.copy(zt.getClearColor())},this.setClearColor=function(){zt.setClearColor(...arguments)},this.getClearAlpha=function(){return zt.getClearAlpha()},this.setClearAlpha=function(){zt.setClearAlpha(...arguments)},this.clear=function(U=!0,j=!0,at=!0){let ct=0;if(U){let Z=!1;if(A!==null){const Et=A.texture.format;Z=Et===ed||Et===td||Et===Qf}if(Z){const Et=A.texture.type,Dt=Et===Hi||Et===$r||Et===pc||Et===mc||Et===Zf||Et===Jf,Bt=zt.getClearColor(),kt=zt.getClearAlpha(),Jt=Bt.r,te=Bt.g,Yt=Bt.b;Dt?(p[0]=Jt,p[1]=te,p[2]=Yt,p[3]=kt,F.clearBufferuiv(F.COLOR,0,p)):(v[0]=Jt,v[1]=te,v[2]=Yt,v[3]=kt,F.clearBufferiv(F.COLOR,0,v))}else ct|=F.COLOR_BUFFER_BIT}j&&(ct|=F.DEPTH_BUFFER_BIT),at&&(ct|=F.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),F.clear(ct)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){e.removeEventListener("webglcontextlost",Rt,!1),e.removeEventListener("webglcontextrestored",Ot,!1),e.removeEventListener("webglcontextcreationerror",yt,!1),zt.dispose(),pt.dispose(),Gt.dispose(),Mt.dispose(),ee.dispose(),Kt.dispose(),J.dispose(),It.dispose(),ce.dispose(),ft.dispose(),Tt.dispose(),Tt.removeEventListener("sessionstart",Vi),Tt.removeEventListener("sessionend",i1),ur.stop()};function Rt(U){U.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),b=!0}function Ot(){console.log("THREE.WebGLRenderer: Context Restored."),b=!1;const U=mt.autoReset,j=Ht.enabled,at=Ht.autoUpdate,ct=Ht.needsUpdate,Z=Ht.type;q(),mt.autoReset=U,Ht.enabled=j,Ht.autoUpdate=at,Ht.needsUpdate=ct,Ht.type=Z}function yt(U){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",U.statusMessage)}function xt(U){const j=U.target;j.removeEventListener("dispose",xt),Vt(j)}function Vt(U){oe(U),Mt.remove(U)}function oe(U){const j=Mt.get(U).programs;j!==void 0&&(j.forEach(function(at){ft.releaseProgram(at)}),U.isShaderMaterial&&ft.releaseShaderCache(U))}this.renderBufferDirect=function(U,j,at,ct,Z,Et){j===null&&(j=G);const Dt=Z.isMesh&&Z.matrixWorld.determinant()<0,Bt=Dx(U,j,at,ct,Z);ut.setMaterial(ct,Dt);let kt=at.index,Jt=1;if(ct.wireframe===!0){if(kt=P.getWireframeAttribute(at),kt===void 0)return;Jt=2}const te=at.drawRange,Yt=at.attributes.position;let pe=te.start*Jt,ye=(te.start+te.count)*Jt;Et!==null&&(pe=Math.max(pe,Et.start*Jt),ye=Math.min(ye,(Et.start+Et.count)*Jt)),kt!==null?(pe=Math.max(pe,0),ye=Math.min(ye,kt.count)):Yt!=null&&(pe=Math.max(pe,0),ye=Math.min(ye,Yt.count));const ze=ye-pe;if(ze<0||ze===1/0)return;It.setup(Z,ct,Bt,at,kt);let De,Ae=Nt;if(kt!==null&&(De=k.get(kt),Ae=Qt,Ae.setIndex(De)),Z.isMesh)ct.wireframe===!0?(ut.setLineWidth(ct.wireframeLinewidth*ot()),Ae.setMode(F.LINES)):Ae.setMode(F.TRIANGLES);else if(Z.isLine){let Zt=ct.linewidth;Zt===void 0&&(Zt=1),ut.setLineWidth(Zt*ot()),Z.isLineSegments?Ae.setMode(F.LINES):Z.isLineLoop?Ae.setMode(F.LINE_LOOP):Ae.setMode(F.LINE_STRIP)}else Z.isPoints?Ae.setMode(F.POINTS):Z.isSprite&&Ae.setMode(F.TRIANGLES);if(Z.isBatchedMesh)if(Z._multiDrawInstances!==null)xc("THREE.WebGLRenderer: renderMultiDrawInstances has been deprecated and will be removed in r184. Append to renderMultiDraw arguments and use indirection."),Ae.renderMultiDrawInstances(Z._multiDrawStarts,Z._multiDrawCounts,Z._multiDrawCount,Z._multiDrawInstances);else if(Q.get("WEBGL_multi_draw"))Ae.renderMultiDraw(Z._multiDrawStarts,Z._multiDrawCounts,Z._multiDrawCount);else{const Zt=Z._multiDrawStarts,Fe=Z._multiDrawCounts,ge=Z._multiDrawCount,Vn=kt?k.get(kt).bytesPerElement:1,ea=Mt.get(ct).currentProgram.getUniforms();for(let Gn=0;Gn<ge;Gn++)ea.setValue(F,"_gl_DrawID",Gn),Ae.render(Zt[Gn]/Vn,Fe[Gn])}else if(Z.isInstancedMesh)Ae.renderInstances(pe,ze,Z.count);else if(at.isInstancedBufferGeometry){const Zt=at._maxInstanceCount!==void 0?at._maxInstanceCount:1/0,Fe=Math.min(at.instanceCount,Zt);Ae.renderInstances(pe,ze,Fe)}else Ae.render(pe,ze)};function Re(U,j,at){U.transparent===!0&&U.side===Te&&U.forceSinglePass===!1?(U.side=Bn,U.needsUpdate=!0,zc(U,j,at),U.side=ar,U.needsUpdate=!0,zc(U,j,at),U.side=Te):zc(U,j,at)}this.compile=function(U,j,at=null){at===null&&(at=U),m=Gt.get(at),m.init(j),x.push(m),at.traverseVisible(function(Z){Z.isLight&&Z.layers.test(j.layers)&&(m.pushLight(Z),Z.castShadow&&m.pushShadow(Z))}),U!==at&&U.traverseVisible(function(Z){Z.isLight&&Z.layers.test(j.layers)&&(m.pushLight(Z),Z.castShadow&&m.pushShadow(Z))}),m.setupLights();const ct=new Set;return U.traverse(function(Z){if(!(Z.isMesh||Z.isPoints||Z.isLine||Z.isSprite))return;const Et=Z.material;if(Et)if(Array.isArray(Et))for(let Dt=0;Dt<Et.length;Dt++){const Bt=Et[Dt];Re(Bt,at,Z),ct.add(Bt)}else Re(Et,at,Z),ct.add(Et)}),m=x.pop(),ct},this.compileAsync=function(U,j,at=null){const ct=this.compile(U,j,at);return new Promise(Z=>{function Et(){if(ct.forEach(function(Dt){Mt.get(Dt).currentProgram.isReady()&&ct.delete(Dt)}),ct.size===0){Z(U);return}setTimeout(Et,10)}Q.get("KHR_parallel_shader_compile")!==null?Et():setTimeout(Et,10)})};let _e=null;function hs(U){_e&&_e(U)}function Vi(){ur.stop()}function i1(){ur.start()}const ur=new r2;ur.setAnimationLoop(hs),typeof self<"u"&&ur.setContext(self),this.setAnimationLoop=function(U){_e=U,Tt.setAnimationLoop(U),U===null?ur.stop():ur.start()},Tt.addEventListener("sessionstart",Vi),Tt.addEventListener("sessionend",i1),this.render=function(U,j){if(j!==void 0&&j.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(b===!0)return;if(U.matrixWorldAutoUpdate===!0&&U.updateMatrixWorld(),j.parent===null&&j.matrixWorldAutoUpdate===!0&&j.updateMatrixWorld(),Tt.enabled===!0&&Tt.isPresenting===!0&&(Tt.cameraAutoUpdate===!0&&Tt.updateCamera(j),j=Tt.getCamera()),U.isScene===!0&&U.onBeforeRender(_,U,j,A),m=Gt.get(U,x.length),m.init(j),x.push(m),$.multiplyMatrices(j.projectionMatrix,j.matrixWorldInverse),Ct.setFromProjectionMatrix($,ss,j.reversedDepth),V=this.localClippingEnabled,Ft=At.init(this.clippingPlanes,V),g=pt.get(U,M.length),g.init(),M.push(g),Tt.enabled===!0&&Tt.isPresenting===!0){const Et=_.xr.getDepthSensingMesh();Et!==null&&Wh(Et,j,-1/0,_.sortObjects)}Wh(U,j,0,_.sortObjects),g.finish(),_.sortObjects===!0&&g.sort(Y,it),tt=Tt.enabled===!1||Tt.isPresenting===!1||Tt.hasDepthSensing()===!1,tt&&zt.addToRenderList(g,U),this.info.render.frame++,Ft===!0&&At.beginShadows();const at=m.state.shadowsArray;Ht.render(at,U,j),Ft===!0&&At.endShadows(),this.info.autoReset===!0&&this.info.reset();const ct=g.opaque,Z=g.transmissive;if(m.setupLights(),j.isArrayCamera){const Et=j.cameras;if(Z.length>0)for(let Dt=0,Bt=Et.length;Dt<Bt;Dt++){const kt=Et[Dt];r1(ct,Z,U,kt)}tt&&zt.render(U);for(let Dt=0,Bt=Et.length;Dt<Bt;Dt++){const kt=Et[Dt];s1(g,U,kt,kt.viewport)}}else Z.length>0&&r1(ct,Z,U,j),tt&&zt.render(U),s1(g,U,j);A!==null&&T===0&&(wt.updateMultisampleRenderTarget(A),wt.updateRenderTargetMipmap(A)),U.isScene===!0&&U.onAfterRender(_,U,j),It.resetDefaultState(),w=-1,y=null,x.pop(),x.length>0?(m=x[x.length-1],Ft===!0&&At.setGlobalState(_.clippingPlanes,m.state.camera)):m=null,M.pop(),M.length>0?g=M[M.length-1]:g=null};function Wh(U,j,at,ct){if(U.visible===!1)return;if(U.layers.test(j.layers)){if(U.isGroup)at=U.renderOrder;else if(U.isLOD)U.autoUpdate===!0&&U.update(j);else if(U.isLight)m.pushLight(U),U.castShadow&&m.pushShadow(U);else if(U.isSprite){if(!U.frustumCulled||Ct.intersectsSprite(U)){ct&&W.setFromMatrixPosition(U.matrixWorld).applyMatrix4($);const Dt=J.update(U),Bt=U.material;Bt.visible&&g.push(U,Dt,Bt,at,W.z,null)}}else if((U.isMesh||U.isLine||U.isPoints)&&(!U.frustumCulled||Ct.intersectsObject(U))){const Dt=J.update(U),Bt=U.material;if(ct&&(U.boundingSphere!==void 0?(U.boundingSphere===null&&U.computeBoundingSphere(),W.copy(U.boundingSphere.center)):(Dt.boundingSphere===null&&Dt.computeBoundingSphere(),W.copy(Dt.boundingSphere.center)),W.applyMatrix4(U.matrixWorld).applyMatrix4($)),Array.isArray(Bt)){const kt=Dt.groups;for(let Jt=0,te=kt.length;Jt<te;Jt++){const Yt=kt[Jt],pe=Bt[Yt.materialIndex];pe&&pe.visible&&g.push(U,Dt,pe,at,W.z,Yt)}}else Bt.visible&&g.push(U,Dt,Bt,at,W.z,null)}}const Et=U.children;for(let Dt=0,Bt=Et.length;Dt<Bt;Dt++)Wh(Et[Dt],j,at,ct)}function s1(U,j,at,ct){const Z=U.opaque,Et=U.transmissive,Dt=U.transparent;m.setupLightsView(at),Ft===!0&&At.setGlobalState(_.clippingPlanes,at),ct&&ut.viewport(E.copy(ct)),Z.length>0&&Hc(Z,j,at),Et.length>0&&Hc(Et,j,at),Dt.length>0&&Hc(Dt,j,at),ut.buffers.depth.setTest(!0),ut.buffers.depth.setMask(!0),ut.buffers.color.setMask(!0),ut.setPolygonOffset(!1)}function r1(U,j,at,ct){if((at.isScene===!0?at.overrideMaterial:null)!==null)return;m.state.transmissionRenderTarget[ct.id]===void 0&&(m.state.transmissionRenderTarget[ct.id]=new En(1,1,{generateMipmaps:!0,type:Q.has("EXT_color_buffer_half_float")||Q.has("EXT_color_buffer_float")?cr:Hi,minFilter:Zs,samples:4,stencilBuffer:r,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:ve.workingColorSpace}));const Et=m.state.transmissionRenderTarget[ct.id],Dt=ct.viewport||E;Et.setSize(Dt.z*_.transmissionResolutionScale,Dt.w*_.transmissionResolutionScale);const Bt=_.getRenderTarget(),kt=_.getActiveCubeFace(),Jt=_.getActiveMipmapLevel();_.setRenderTarget(Et),_.getClearColor(I),N=_.getClearAlpha(),N<1&&_.setClearColor(16777215,.5),_.clear(),tt&&zt.render(at);const te=_.toneMapping;_.toneMapping=nr;const Yt=ct.viewport;if(ct.viewport!==void 0&&(ct.viewport=void 0),m.setupLightsView(ct),Ft===!0&&At.setGlobalState(_.clippingPlanes,ct),Hc(U,at,ct),wt.updateMultisampleRenderTarget(Et),wt.updateRenderTargetMipmap(Et),Q.has("WEBGL_multisampled_render_to_texture")===!1){let pe=!1;for(let ye=0,ze=j.length;ye<ze;ye++){const De=j[ye],Ae=De.object,Zt=De.geometry,Fe=De.material,ge=De.group;if(Fe.side===Te&&Ae.layers.test(ct.layers)){const Vn=Fe.side;Fe.side=Bn,Fe.needsUpdate=!0,a1(Ae,at,ct,Zt,Fe,ge),Fe.side=Vn,Fe.needsUpdate=!0,pe=!0}}pe===!0&&(wt.updateMultisampleRenderTarget(Et),wt.updateRenderTargetMipmap(Et))}_.setRenderTarget(Bt,kt,Jt),_.setClearColor(I,N),Yt!==void 0&&(ct.viewport=Yt),_.toneMapping=te}function Hc(U,j,at){const ct=j.isScene===!0?j.overrideMaterial:null;for(let Z=0,Et=U.length;Z<Et;Z++){const Dt=U[Z],Bt=Dt.object,kt=Dt.geometry,Jt=Dt.group;let te=Dt.material;te.allowOverride===!0&&ct!==null&&(te=ct),Bt.layers.test(at.layers)&&a1(Bt,j,at,kt,te,Jt)}}function a1(U,j,at,ct,Z,Et){U.onBeforeRender(_,j,at,ct,Z,Et),U.modelViewMatrix.multiplyMatrices(at.matrixWorldInverse,U.matrixWorld),U.normalMatrix.getNormalMatrix(U.modelViewMatrix),Z.onBeforeRender(_,j,at,ct,U,Et),Z.transparent===!0&&Z.side===Te&&Z.forceSinglePass===!1?(Z.side=Bn,Z.needsUpdate=!0,_.renderBufferDirect(at,j,ct,Z,U,Et),Z.side=ar,Z.needsUpdate=!0,_.renderBufferDirect(at,j,ct,Z,U,Et),Z.side=Te):_.renderBufferDirect(at,j,ct,Z,U,Et),U.onAfterRender(_,j,at,ct,Z,Et)}function zc(U,j,at){j.isScene!==!0&&(j=G);const ct=Mt.get(U),Z=m.state.lights,Et=m.state.shadowsArray,Dt=Z.state.version,Bt=ft.getParameters(U,Z.state,Et,j,at),kt=ft.getProgramCacheKey(Bt);let Jt=ct.programs;ct.environment=U.isMeshStandardMaterial?j.environment:null,ct.fog=j.fog,ct.envMap=(U.isMeshStandardMaterial?Kt:ee).get(U.envMap||ct.environment),ct.envMapRotation=ct.environment!==null&&U.envMap===null?j.environmentRotation:U.envMapRotation,Jt===void 0&&(U.addEventListener("dispose",xt),Jt=new Map,ct.programs=Jt);let te=Jt.get(kt);if(te!==void 0){if(ct.currentProgram===te&&ct.lightsStateVersion===Dt)return c1(U,Bt),te}else Bt.uniforms=ft.getUniforms(U),U.onBeforeCompile(Bt,_),te=ft.acquireProgram(Bt,kt),Jt.set(kt,te),ct.uniforms=Bt.uniforms;const Yt=ct.uniforms;return(!U.isShaderMaterial&&!U.isRawShaderMaterial||U.clipping===!0)&&(Yt.clippingPlanes=At.uniform),c1(U,Bt),ct.needsLights=Fx(U),ct.lightsStateVersion=Dt,ct.needsLights&&(Yt.ambientLightColor.value=Z.state.ambient,Yt.lightProbe.value=Z.state.probe,Yt.directionalLights.value=Z.state.directional,Yt.directionalLightShadows.value=Z.state.directionalShadow,Yt.spotLights.value=Z.state.spot,Yt.spotLightShadows.value=Z.state.spotShadow,Yt.rectAreaLights.value=Z.state.rectArea,Yt.ltc_1.value=Z.state.rectAreaLTC1,Yt.ltc_2.value=Z.state.rectAreaLTC2,Yt.pointLights.value=Z.state.point,Yt.pointLightShadows.value=Z.state.pointShadow,Yt.hemisphereLights.value=Z.state.hemi,Yt.directionalShadowMap.value=Z.state.directionalShadowMap,Yt.directionalShadowMatrix.value=Z.state.directionalShadowMatrix,Yt.spotShadowMap.value=Z.state.spotShadowMap,Yt.spotLightMatrix.value=Z.state.spotLightMatrix,Yt.spotLightMap.value=Z.state.spotLightMap,Yt.pointShadowMap.value=Z.state.pointShadowMap,Yt.pointShadowMatrix.value=Z.state.pointShadowMatrix),ct.currentProgram=te,ct.uniformsList=null,te}function o1(U){if(U.uniformsList===null){const j=U.currentProgram.getUniforms();U.uniformsList=zl.seqWithValue(j.seq,U.uniforms)}return U.uniformsList}function c1(U,j){const at=Mt.get(U);at.outputColorSpace=j.outputColorSpace,at.batching=j.batching,at.batchingColor=j.batchingColor,at.instancing=j.instancing,at.instancingColor=j.instancingColor,at.instancingMorph=j.instancingMorph,at.skinning=j.skinning,at.morphTargets=j.morphTargets,at.morphNormals=j.morphNormals,at.morphColors=j.morphColors,at.morphTargetsCount=j.morphTargetsCount,at.numClippingPlanes=j.numClippingPlanes,at.numIntersection=j.numClipIntersection,at.vertexAlphas=j.vertexAlphas,at.vertexTangents=j.vertexTangents,at.toneMapping=j.toneMapping}function Dx(U,j,at,ct,Z){j.isScene!==!0&&(j=G),wt.resetTextureUnits();const Et=j.fog,Dt=ct.isMeshStandardMaterial?j.environment:null,Bt=A===null?_.outputColorSpace:A.isXRRenderTarget===!0?A.texture.colorSpace:qr,kt=(ct.isMeshStandardMaterial?Kt:ee).get(ct.envMap||Dt),Jt=ct.vertexColors===!0&&!!at.attributes.color&&at.attributes.color.itemSize===4,te=!!at.attributes.tangent&&(!!ct.normalMap||ct.anisotropy>0),Yt=!!at.morphAttributes.position,pe=!!at.morphAttributes.normal,ye=!!at.morphAttributes.color;let ze=nr;ct.toneMapped&&(A===null||A.isXRRenderTarget===!0)&&(ze=_.toneMapping);const De=at.morphAttributes.position||at.morphAttributes.normal||at.morphAttributes.color,Ae=De!==void 0?De.length:0,Zt=Mt.get(ct),Fe=m.state.lights;if(Ft===!0&&(V===!0||U!==y)){const _n=U===y&&ct.id===w;At.setState(ct,U,_n)}let ge=!1;ct.version===Zt.__version?(Zt.needsLights&&Zt.lightsStateVersion!==Fe.state.version||Zt.outputColorSpace!==Bt||Z.isBatchedMesh&&Zt.batching===!1||!Z.isBatchedMesh&&Zt.batching===!0||Z.isBatchedMesh&&Zt.batchingColor===!0&&Z.colorTexture===null||Z.isBatchedMesh&&Zt.batchingColor===!1&&Z.colorTexture!==null||Z.isInstancedMesh&&Zt.instancing===!1||!Z.isInstancedMesh&&Zt.instancing===!0||Z.isSkinnedMesh&&Zt.skinning===!1||!Z.isSkinnedMesh&&Zt.skinning===!0||Z.isInstancedMesh&&Zt.instancingColor===!0&&Z.instanceColor===null||Z.isInstancedMesh&&Zt.instancingColor===!1&&Z.instanceColor!==null||Z.isInstancedMesh&&Zt.instancingMorph===!0&&Z.morphTexture===null||Z.isInstancedMesh&&Zt.instancingMorph===!1&&Z.morphTexture!==null||Zt.envMap!==kt||ct.fog===!0&&Zt.fog!==Et||Zt.numClippingPlanes!==void 0&&(Zt.numClippingPlanes!==At.numPlanes||Zt.numIntersection!==At.numIntersection)||Zt.vertexAlphas!==Jt||Zt.vertexTangents!==te||Zt.morphTargets!==Yt||Zt.morphNormals!==pe||Zt.morphColors!==ye||Zt.toneMapping!==ze||Zt.morphTargetsCount!==Ae)&&(ge=!0):(ge=!0,Zt.__version=ct.version);let Vn=Zt.currentProgram;ge===!0&&(Vn=zc(ct,j,Z));let ea=!1,Gn=!1,Lo=!1;const Ne=Vn.getUniforms(),ai=Zt.uniforms;if(ut.useProgram(Vn.program)&&(ea=!0,Gn=!0,Lo=!0),ct.id!==w&&(w=ct.id,Gn=!0),ea||y!==U){ut.buffers.depth.getReversed()&&U.reversedDepth!==!0&&(U._reversedDepth=!0,U.updateProjectionMatrix()),Ne.setValue(F,"projectionMatrix",U.projectionMatrix),Ne.setValue(F,"viewMatrix",U.matrixWorldInverse);const Ln=Ne.map.cameraPosition;Ln!==void 0&&Ln.setValue(F,z.setFromMatrixPosition(U.matrixWorld)),rt.logarithmicDepthBuffer&&Ne.setValue(F,"logDepthBufFC",2/(Math.log(U.far+1)/Math.LN2)),(ct.isMeshPhongMaterial||ct.isMeshToonMaterial||ct.isMeshLambertMaterial||ct.isMeshBasicMaterial||ct.isMeshStandardMaterial||ct.isShaderMaterial)&&Ne.setValue(F,"isOrthographic",U.isOrthographicCamera===!0),y!==U&&(y=U,Gn=!0,Lo=!0)}if(Z.isSkinnedMesh){Ne.setOptional(F,Z,"bindMatrix"),Ne.setOptional(F,Z,"bindMatrixInverse");const _n=Z.skeleton;_n&&(_n.boneTexture===null&&_n.computeBoneTexture(),Ne.setValue(F,"boneTexture",_n.boneTexture,wt))}Z.isBatchedMesh&&(Ne.setOptional(F,Z,"batchingTexture"),Ne.setValue(F,"batchingTexture",Z._matricesTexture,wt),Ne.setOptional(F,Z,"batchingIdTexture"),Ne.setValue(F,"batchingIdTexture",Z._indirectTexture,wt),Ne.setOptional(F,Z,"batchingColorTexture"),Z._colorsTexture!==null&&Ne.setValue(F,"batchingColorTexture",Z._colorsTexture,wt));const oi=at.morphAttributes;if((oi.position!==void 0||oi.normal!==void 0||oi.color!==void 0)&&bt.update(Z,at,Vn),(Gn||Zt.receiveShadow!==Z.receiveShadow)&&(Zt.receiveShadow=Z.receiveShadow,Ne.setValue(F,"receiveShadow",Z.receiveShadow)),ct.isMeshGouraudMaterial&&ct.envMap!==null&&(ai.envMap.value=kt,ai.flipEnvMap.value=kt.isCubeTexture&&kt.isRenderTargetTexture===!1?-1:1),ct.isMeshStandardMaterial&&ct.envMap===null&&j.environment!==null&&(ai.envMapIntensity.value=j.environmentIntensity),Gn&&(Ne.setValue(F,"toneMappingExposure",_.toneMappingExposure),Zt.needsLights&&Ux(ai,Lo),Et&&ct.fog===!0&&_t.refreshFogUniforms(ai,Et),_t.refreshMaterialUniforms(ai,ct,H,X,m.state.transmissionRenderTarget[U.id]),zl.upload(F,o1(Zt),ai,wt)),ct.isShaderMaterial&&ct.uniformsNeedUpdate===!0&&(zl.upload(F,o1(Zt),ai,wt),ct.uniformsNeedUpdate=!1),ct.isSpriteMaterial&&Ne.setValue(F,"center",Z.center),Ne.setValue(F,"modelViewMatrix",Z.modelViewMatrix),Ne.setValue(F,"normalMatrix",Z.normalMatrix),Ne.setValue(F,"modelMatrix",Z.matrixWorld),ct.isShaderMaterial||ct.isRawShaderMaterial){const _n=ct.uniformsGroups;for(let Ln=0,Xh=_n.length;Ln<Xh;Ln++){const fr=_n[Ln];ce.update(fr,Vn),ce.bind(fr,Vn)}}return Vn}function Ux(U,j){U.ambientLightColor.needsUpdate=j,U.lightProbe.needsUpdate=j,U.directionalLights.needsUpdate=j,U.directionalLightShadows.needsUpdate=j,U.pointLights.needsUpdate=j,U.pointLightShadows.needsUpdate=j,U.spotLights.needsUpdate=j,U.spotLightShadows.needsUpdate=j,U.rectAreaLights.needsUpdate=j,U.hemisphereLights.needsUpdate=j}function Fx(U){return U.isMeshLambertMaterial||U.isMeshToonMaterial||U.isMeshPhongMaterial||U.isMeshStandardMaterial||U.isShadowMaterial||U.isShaderMaterial&&U.lights===!0}this.getActiveCubeFace=function(){return S},this.getActiveMipmapLevel=function(){return T},this.getRenderTarget=function(){return A},this.setRenderTargetTextures=function(U,j,at){const ct=Mt.get(U);ct.__autoAllocateDepthBuffer=U.resolveDepthBuffer===!1,ct.__autoAllocateDepthBuffer===!1&&(ct.__useRenderToTexture=!1),Mt.get(U.texture).__webglTexture=j,Mt.get(U.depthTexture).__webglTexture=ct.__autoAllocateDepthBuffer?void 0:at,ct.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(U,j){const at=Mt.get(U);at.__webglFramebuffer=j,at.__useDefaultFramebuffer=j===void 0};const Nx=F.createFramebuffer();this.setRenderTarget=function(U,j=0,at=0){A=U,S=j,T=at;let ct=!0,Z=null,Et=!1,Dt=!1;if(U){const kt=Mt.get(U);if(kt.__useDefaultFramebuffer!==void 0)ut.bindFramebuffer(F.FRAMEBUFFER,null),ct=!1;else if(kt.__webglFramebuffer===void 0)wt.setupRenderTarget(U);else if(kt.__hasExternalTextures)wt.rebindTextures(U,Mt.get(U.texture).__webglTexture,Mt.get(U.depthTexture).__webglTexture);else if(U.depthBuffer){const Yt=U.depthTexture;if(kt.__boundDepthTexture!==Yt){if(Yt!==null&&Mt.has(Yt)&&(U.width!==Yt.image.width||U.height!==Yt.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");wt.setupDepthRenderbuffer(U)}}const Jt=U.texture;(Jt.isData3DTexture||Jt.isDataArrayTexture||Jt.isCompressedArrayTexture)&&(Dt=!0);const te=Mt.get(U).__webglFramebuffer;U.isWebGLCubeRenderTarget?(Array.isArray(te[j])?Z=te[j][at]:Z=te[j],Et=!0):U.samples>0&&wt.useMultisampledRTT(U)===!1?Z=Mt.get(U).__webglMultisampledFramebuffer:Array.isArray(te)?Z=te[at]:Z=te,E.copy(U.viewport),R.copy(U.scissor),L=U.scissorTest}else E.copy(dt).multiplyScalar(H).floor(),R.copy(vt).multiplyScalar(H).floor(),L=St;if(at!==0&&(Z=Nx),ut.bindFramebuffer(F.FRAMEBUFFER,Z)&&ct&&ut.drawBuffers(U,Z),ut.viewport(E),ut.scissor(R),ut.setScissorTest(L),Et){const kt=Mt.get(U.texture);F.framebufferTexture2D(F.FRAMEBUFFER,F.COLOR_ATTACHMENT0,F.TEXTURE_CUBE_MAP_POSITIVE_X+j,kt.__webglTexture,at)}else if(Dt){const kt=j;for(let Jt=0;Jt<U.textures.length;Jt++){const te=Mt.get(U.textures[Jt]);F.framebufferTextureLayer(F.FRAMEBUFFER,F.COLOR_ATTACHMENT0+Jt,te.__webglTexture,at,kt)}}else if(U!==null&&at!==0){const kt=Mt.get(U.texture);F.framebufferTexture2D(F.FRAMEBUFFER,F.COLOR_ATTACHMENT0,F.TEXTURE_2D,kt.__webglTexture,at)}w=-1},this.readRenderTargetPixels=function(U,j,at,ct,Z,Et,Dt,Bt=0){if(!(U&&U.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let kt=Mt.get(U).__webglFramebuffer;if(U.isWebGLCubeRenderTarget&&Dt!==void 0&&(kt=kt[Dt]),kt){ut.bindFramebuffer(F.FRAMEBUFFER,kt);try{const Jt=U.textures[Bt],te=Jt.format,Yt=Jt.type;if(!rt.textureFormatReadable(te)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!rt.textureTypeReadable(Yt)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}j>=0&&j<=U.width-ct&&at>=0&&at<=U.height-Z&&(U.textures.length>1&&F.readBuffer(F.COLOR_ATTACHMENT0+Bt),F.readPixels(j,at,ct,Z,Wt.convert(te),Wt.convert(Yt),Et))}finally{const Jt=A!==null?Mt.get(A).__webglFramebuffer:null;ut.bindFramebuffer(F.FRAMEBUFFER,Jt)}}},this.readRenderTargetPixelsAsync=async function(U,j,at,ct,Z,Et,Dt,Bt=0){if(!(U&&U.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let kt=Mt.get(U).__webglFramebuffer;if(U.isWebGLCubeRenderTarget&&Dt!==void 0&&(kt=kt[Dt]),kt)if(j>=0&&j<=U.width-ct&&at>=0&&at<=U.height-Z){ut.bindFramebuffer(F.FRAMEBUFFER,kt);const Jt=U.textures[Bt],te=Jt.format,Yt=Jt.type;if(!rt.textureFormatReadable(te))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!rt.textureTypeReadable(Yt))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");const pe=F.createBuffer();F.bindBuffer(F.PIXEL_PACK_BUFFER,pe),F.bufferData(F.PIXEL_PACK_BUFFER,Et.byteLength,F.STREAM_READ),U.textures.length>1&&F.readBuffer(F.COLOR_ATTACHMENT0+Bt),F.readPixels(j,at,ct,Z,Wt.convert(te),Wt.convert(Yt),0);const ye=A!==null?Mt.get(A).__webglFramebuffer:null;ut.bindFramebuffer(F.FRAMEBUFFER,ye);const ze=F.fenceSync(F.SYNC_GPU_COMMANDS_COMPLETE,0);return F.flush(),await XM(F,ze,4),F.bindBuffer(F.PIXEL_PACK_BUFFER,pe),F.getBufferSubData(F.PIXEL_PACK_BUFFER,0,Et),F.deleteBuffer(pe),F.deleteSync(ze),Et}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(U,j=null,at=0){const ct=Math.pow(2,-at),Z=Math.floor(U.image.width*ct),Et=Math.floor(U.image.height*ct),Dt=j!==null?j.x:0,Bt=j!==null?j.y:0;wt.setTexture2D(U,0),F.copyTexSubImage2D(F.TEXTURE_2D,at,0,0,Dt,Bt,Z,Et),ut.unbindTexture()};const kx=F.createFramebuffer(),Ox=F.createFramebuffer();this.copyTextureToTexture=function(U,j,at=null,ct=null,Z=0,Et=null){Et===null&&(Z!==0?(xc("WebGLRenderer: copyTextureToTexture function signature has changed to support src and dst mipmap levels."),Et=Z,Z=0):Et=0);let Dt,Bt,kt,Jt,te,Yt,pe,ye,ze;const De=U.isCompressedTexture?U.mipmaps[Et]:U.image;if(at!==null)Dt=at.max.x-at.min.x,Bt=at.max.y-at.min.y,kt=at.isBox3?at.max.z-at.min.z:1,Jt=at.min.x,te=at.min.y,Yt=at.isBox3?at.min.z:0;else{const oi=Math.pow(2,-Z);Dt=Math.floor(De.width*oi),Bt=Math.floor(De.height*oi),U.isDataArrayTexture?kt=De.depth:U.isData3DTexture?kt=Math.floor(De.depth*oi):kt=1,Jt=0,te=0,Yt=0}ct!==null?(pe=ct.x,ye=ct.y,ze=ct.z):(pe=0,ye=0,ze=0);const Ae=Wt.convert(j.format),Zt=Wt.convert(j.type);let Fe;j.isData3DTexture?(wt.setTexture3D(j,0),Fe=F.TEXTURE_3D):j.isDataArrayTexture||j.isCompressedArrayTexture?(wt.setTexture2DArray(j,0),Fe=F.TEXTURE_2D_ARRAY):(wt.setTexture2D(j,0),Fe=F.TEXTURE_2D),F.pixelStorei(F.UNPACK_FLIP_Y_WEBGL,j.flipY),F.pixelStorei(F.UNPACK_PREMULTIPLY_ALPHA_WEBGL,j.premultiplyAlpha),F.pixelStorei(F.UNPACK_ALIGNMENT,j.unpackAlignment);const ge=F.getParameter(F.UNPACK_ROW_LENGTH),Vn=F.getParameter(F.UNPACK_IMAGE_HEIGHT),ea=F.getParameter(F.UNPACK_SKIP_PIXELS),Gn=F.getParameter(F.UNPACK_SKIP_ROWS),Lo=F.getParameter(F.UNPACK_SKIP_IMAGES);F.pixelStorei(F.UNPACK_ROW_LENGTH,De.width),F.pixelStorei(F.UNPACK_IMAGE_HEIGHT,De.height),F.pixelStorei(F.UNPACK_SKIP_PIXELS,Jt),F.pixelStorei(F.UNPACK_SKIP_ROWS,te),F.pixelStorei(F.UNPACK_SKIP_IMAGES,Yt);const Ne=U.isDataArrayTexture||U.isData3DTexture,ai=j.isDataArrayTexture||j.isData3DTexture;if(U.isDepthTexture){const oi=Mt.get(U),_n=Mt.get(j),Ln=Mt.get(oi.__renderTarget),Xh=Mt.get(_n.__renderTarget);ut.bindFramebuffer(F.READ_FRAMEBUFFER,Ln.__webglFramebuffer),ut.bindFramebuffer(F.DRAW_FRAMEBUFFER,Xh.__webglFramebuffer);for(let fr=0;fr<kt;fr++)Ne&&(F.framebufferTextureLayer(F.READ_FRAMEBUFFER,F.COLOR_ATTACHMENT0,Mt.get(U).__webglTexture,Z,Yt+fr),F.framebufferTextureLayer(F.DRAW_FRAMEBUFFER,F.COLOR_ATTACHMENT0,Mt.get(j).__webglTexture,Et,ze+fr)),F.blitFramebuffer(Jt,te,Dt,Bt,pe,ye,Dt,Bt,F.DEPTH_BUFFER_BIT,F.NEAREST);ut.bindFramebuffer(F.READ_FRAMEBUFFER,null),ut.bindFramebuffer(F.DRAW_FRAMEBUFFER,null)}else if(Z!==0||U.isRenderTargetTexture||Mt.has(U)){const oi=Mt.get(U),_n=Mt.get(j);ut.bindFramebuffer(F.READ_FRAMEBUFFER,kx),ut.bindFramebuffer(F.DRAW_FRAMEBUFFER,Ox);for(let Ln=0;Ln<kt;Ln++)Ne?F.framebufferTextureLayer(F.READ_FRAMEBUFFER,F.COLOR_ATTACHMENT0,oi.__webglTexture,Z,Yt+Ln):F.framebufferTexture2D(F.READ_FRAMEBUFFER,F.COLOR_ATTACHMENT0,F.TEXTURE_2D,oi.__webglTexture,Z),ai?F.framebufferTextureLayer(F.DRAW_FRAMEBUFFER,F.COLOR_ATTACHMENT0,_n.__webglTexture,Et,ze+Ln):F.framebufferTexture2D(F.DRAW_FRAMEBUFFER,F.COLOR_ATTACHMENT0,F.TEXTURE_2D,_n.__webglTexture,Et),Z!==0?F.blitFramebuffer(Jt,te,Dt,Bt,pe,ye,Dt,Bt,F.COLOR_BUFFER_BIT,F.NEAREST):ai?F.copyTexSubImage3D(Fe,Et,pe,ye,ze+Ln,Jt,te,Dt,Bt):F.copyTexSubImage2D(Fe,Et,pe,ye,Jt,te,Dt,Bt);ut.bindFramebuffer(F.READ_FRAMEBUFFER,null),ut.bindFramebuffer(F.DRAW_FRAMEBUFFER,null)}else ai?U.isDataTexture||U.isData3DTexture?F.texSubImage3D(Fe,Et,pe,ye,ze,Dt,Bt,kt,Ae,Zt,De.data):j.isCompressedArrayTexture?F.compressedTexSubImage3D(Fe,Et,pe,ye,ze,Dt,Bt,kt,Ae,De.data):F.texSubImage3D(Fe,Et,pe,ye,ze,Dt,Bt,kt,Ae,Zt,De):U.isDataTexture?F.texSubImage2D(F.TEXTURE_2D,Et,pe,ye,Dt,Bt,Ae,Zt,De.data):U.isCompressedTexture?F.compressedTexSubImage2D(F.TEXTURE_2D,Et,pe,ye,De.width,De.height,Ae,De.data):F.texSubImage2D(F.TEXTURE_2D,Et,pe,ye,Dt,Bt,Ae,Zt,De);F.pixelStorei(F.UNPACK_ROW_LENGTH,ge),F.pixelStorei(F.UNPACK_IMAGE_HEIGHT,Vn),F.pixelStorei(F.UNPACK_SKIP_PIXELS,ea),F.pixelStorei(F.UNPACK_SKIP_ROWS,Gn),F.pixelStorei(F.UNPACK_SKIP_IMAGES,Lo),Et===0&&j.generateMipmaps&&F.generateMipmap(Fe),ut.unbindTexture()},this.initRenderTarget=function(U){Mt.get(U).__webglFramebuffer===void 0&&wt.setupRenderTarget(U)},this.initTexture=function(U){U.isCubeTexture?wt.setTextureCube(U,0):U.isData3DTexture?wt.setTexture3D(U,0):U.isDataArrayTexture||U.isCompressedArrayTexture?wt.setTexture2DArray(U,0):wt.setTexture2D(U,0),ut.unbindTexture()},this.resetState=function(){S=0,T=0,A=null,ut.reset(),It.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return ss}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(t){this._outputColorSpace=t;const e=this.getContext();e.drawingBufferColorSpace=ve._getDrawingBufferColorSpace(t),e.unpackColorSpace=ve._getUnpackColorSpace()}}function Qy(n,t,e=.85){return{f:e*Math.max(n,t),cx:n/2,cy:t/2,w:n,h:t}}function C0(n,t,e,i=.5){let s=0,r=0,a=0,o=0,c=0,l=0,u=0,h=0,f=0;for(let M=0;M<n.length&&M<t.length;M++){const x=n[M],_=t[M],b=Math.min(x.v,_.v);if(b<i)continue;const S=(_.x*e.w-e.cx)/e.f,T=(e.cy-_.y*e.h)/e.f,A=-S*x.z-x.x,w=-T*x.z-x.y;s+=b,r+=b*S,c+=b*S*S,l+=b*A,h+=b*S*A,a+=b,o+=b*T,c+=b*T*T,u+=b*w,h+=b*T*w,f++}if(f<4)return null;const d=c-r*r/s-o*o/a,p=h-r*l/s-o*u/a;if(Math.abs(d)<1e-9)return null;const v=p/d,g=(l-r*v)/s,m=(u-o*v)/a;return!(v<-.2)||!isFinite(g)||!isFinite(m)?null:{x:g,y:m,z:v}}function go(n,t){const e=-n.z;return{x:(t.cx+t.f*n.x/e)/t.w,y:(t.cy-t.f*n.y/e)/t.h}}const _l=(n,t)=>({x:(n.x+t.x)/2,y:(n.y+t.y)/2,z:(n.z+t.z)/2,v:Math.min(n.v,t.v)}),Gi=(n,t)=>Math.hypot(n.x-t.x,n.y-t.y,n.z-t.z);function bp(n){const t=Gi(_l(n[D.shL],n[D.shR]),_l(n[D.hipL],n[D.hipR])),e=(Gi(n[D.shL],n[D.elL])+Gi(n[D.shR],n[D.elR]))/2,i=(Gi(n[D.elL],n[D.wrL])+Gi(n[D.elR],n[D.wrR]))/2,s=(Gi(n[D.hipL],n[D.knL])+Gi(n[D.hipR],n[D.knR]))/2,r=(Gi(n[D.knL],n[D.anL])+Gi(n[D.knR],n[D.anR]))/2,a=Gi(_l(n[D.shL],n[D.shR]),_l(n[D.earL],n[D.earR]));return{torso:t,upperArm:e,forearm:i,thigh:s,shin:r,neck:a}}const ff={keep:.5,keepWithin:ni.degToRad(30),flatFrom:ni.degToRad(35),flatTo:ni.degToRad(60),holdS:.35,screenUpFrom:ni.degToRad(25),screenUpTo:ni.degToRad(50),screenLenFrom:.5,screenLenTo:.8},vo=n=>new C(n.x,n.y,n.z),xo=(n,t)=>vo(n).add(vo(t)).multiplyScalar(.5),tS=[D.hipL,D.hipR,D.knL,D.knR,D.anL,D.anR,D.heelL,D.heelR,D.toeL,D.toeR],Ha=(n,t,e)=>{const i=Math.min(1,Math.max(0,(e-n)/(t-n)));return i*i*(3-2*i)},h2=(n,t,e)=>{const i=new ie().setFromUnitVectors(n,t);return n.clone().applyQuaternion(new ie().slerpQuaternions(new ie,i,e))};function eS(n,t,e){const i=xo(n[D.shL],n[D.shR]),s=xo(n[D.hipL],n[D.hipR]),r=i.clone().sub(s),a=new ie().setFromUnitVectors(r.clone().normalize(),t),o=i.clone().addScaledVector(t,-e),c=s.clone().sub(i).applyQuaternion(a).add(i),l=o.clone().sub(c),u=n.map(h=>({...h}));for(const h of tS){const f=vo(n[h]).sub(i).applyQuaternion(a).add(i).add(l);u[h]={x:f.x,y:f.y,z:f.z,v:n[h].v}}for(const h of u)h.x-=o.x,h.y-=o.y,h.z-=o.z;return u}function u2(n,t,e,i,s){const r=vo(n[D.shL]).sub(vo(n[D.shR]));if(r.lengthSq()<1e-8)return null;r.normalize();const a=t.clone().addScaledVector(r,-t.dot(r));if(a.lengthSq()<.05)return null;a.normalize();const o=e.clone().addScaledVector(r,-e.dot(r));if(o.lengthSq()<1e-8)return a;o.normalize();const c=Math.atan2(new C().crossVectors(a,o).dot(r),a.dot(o)),l=i*(1-Ha(s,s*2,Math.abs(c)));return a.applyAxisAngle(r,c*l)}function nS(n,t,e,i){const s=ff,r=i.state,a=r.at<0?1/30:Math.min(.25,Math.max(0,(i.now-r.at)/1e3));r.at=i.now;const o=xo(n[D.shL],n[D.shR]),c=xo(n[D.hipL],n[D.hipR]),l=o.clone().sub(c);if(l.lengthSq()<1e-8)return{world:n,verdict:"kept"};const u=l.length(),h=i.len&&i.len>.2?i.len:u,f=l.clone().normalize(),d=Ha(.3,.7,Math.min(t[D.hipL].v,t[D.hipR].v)),p=Ha(s.flatFrom,s.flatTo,f.angleTo(e)),v=i.aspect??1,g=new ht(((t[D.shL].x+t[D.shR].x)/2-(t[D.hipL].x+t[D.hipR].x)/2)*v,(t[D.shL].y+t[D.shR].y)/2-(t[D.hipL].y+t[D.hipR].y)/2),m=new ht(e.x,-e.y),M=m.lengthSq()>1e-6&&g.lengthSq()>1e-10?Math.acos(Math.max(-1,Math.min(1,m.normalize().dot(g.clone().normalize())))):Math.PI,x=i.f&&i.depth?h*i.f/i.depth:0,_=x?Ha(s.screenLenFrom,s.screenLenTo,g.length()/x):1,b=(1-Ha(s.screenUpFrom,s.screenUpTo,M))*_,S=d*p*(1-b);r.belief+=(S-r.belief)*(1-Math.exp(-a/s.holdS));const T=d*p*(b+(1-b)*(1-r.belief)),A=T>.5?b>.5?"stood up":"holding":d<.5?"torso shot":p>.5?"accepted":"kept";if(T<=0)return{world:n,verdict:A};const w=u2(n,e,f,s.keep,s.keepWithin);if(!w)return{world:n,verdict:A};const y=new ie().setFromUnitVectors(f,h2(f,w,T));return{world:n.map(E=>{const R=vo(E).applyQuaternion(y);return{x:R.x,y:R.y,z:R.z,v:E.v}}),verdict:A}}function iS(n,t,e,i){const s=1-Ha(.3,.7,i),r=xo(n[D.shL],n[D.shR]),a=xo(n[D.hipL],n[D.hipR]),o=r.sub(a),c=o.length();if(s<=0||c<1e-4)return n.map(h=>({...h}));const l=o.normalize(),u=u2(n,t,l,ff.keep,ff.keepWithin);return u?eS(n,h2(l,u,s),c+((e>.2?e:c)-c)*s):n.map(h=>({...h}))}const re={tauWorld:.068,tauImage:.053,tauZ:.21,tauLen:1.5,tauVis:.25,tauCore:.135,fadeIn:.22,fadeOut:.35,forgetAfter:.6,confirm:3,matchRadius:1.3,holdWorldCore:.008,holdWorldLimb:.013,holdZ:1.5,holdImageCore:.007,holdImageLimb:.028,holdDepth:.015,motorCore:10,motorLimb:14,motorCreep:2.5,motorBoost:2,motorShake:30,smoothTau:1,smoothBand:1,smoothW:1,rDepth:.03},yp=n=>{const t=[D.shL,D.shR,D.hipL,D.hipR];let e=0,i=0,s=0;for(const c of t){const l=n[c];e+=l.x,i+=l.y,s++}e/=s,i/=s;const r=(n[D.shL].x+n[D.shR].x)/2-(n[D.hipL].x+n[D.hipR].x)/2,a=(n[D.shL].y+n[D.shR].y)/2-(n[D.hipL].y+n[D.hipR].y)/2,o=Math.hypot(n[D.shL].x-n[D.shR].x,n[D.shL].y-n[D.shR].y);return{x:e,y:i,s:Math.max(Math.hypot(r,a),o,.04)}},za=(n,t,e)=>n+(t-n)*e,ba=(n,t)=>1-Math.exp(-n/Math.max(t,1e-4)),lh=new Set([0,1,2,3,4,5,6,7,8,9,10,D.shL,D.shR,D.hipL,D.hipR]);function Sp(n,t,e,i,s=e){for(let r=0;r<js;r++){const a=n[r],o=t[r],c=lh.has(r)?s:e;a.x=za(a.x,o.x,c),a.y=za(a.y,o.y,c),a.z=za(a.z,o.z,c),a.v=za(a.v,o.v,i)}}const wl=n=>n.map(t=>({...t})),Ep=(n,t)=>{for(let e=0;e<t.length;e++){const i=n[e],s=t[e];i.x=s.x,i.y=s.y,i.z=s.z,i.v=s.v}},sS=[D.nose,D.eyeL,D.eyeR,D.earL,D.earR,D.shL,D.shR,D.hipL,D.hipR];function rS(n,t){let e=0,i=0,s=0;for(const r of sS){const a=n[r],o=t[r],c=Math.min(a.v,o.v);c<.5||(e+=(o.x-a.x)*c,i+=(o.y-a.y)*c,s+=c)}if(s<1.5)return{dx:0,dy:0};e/=s,i/=s;for(const r of n)r.x+=e,r.y+=i;return{dx:e,dy:i}}const L0=["x","y","z"];function Vl(n,t,e,i,s,r){const a=Math.max(1,Math.ceil(i*r*(1+re.motorBoost)/.35)),o=i/a,c=re.motorCreep;for(let l=0;l<a;l++){const u=e-n,h=s>0?u*u/(s*s):1e9,f=u*h/(1+h),d=r*(1+re.motorBoost*h/(h+16)),p=d*d*f+c*c*u-2*d*t;t+=p*o,n+=t*o}return[n,t]}function Tp(n,t,e,i,s,r){for(let a=0;a<js;a++){const o=n[a],c=t[a],l=Math.max(.25,Math.min(1,c.v)),u=lh.has(a)?re.motorCore:re.motorLimb;for(let h=0;h<i;h++){const f=a*i+h,[d,p]=Vl(o[L0[h]],e[f],c[L0[h]],s,r(a,h)/l,u*re.smoothW);o[L0[h]]=d,e[f]=p}o.v=c.v}}const aS=new C(0,1,0);function f2(n){const t=Math.max(0,Math.min(1,n)),e=(i,s)=>i+(s-i)*t;re.smoothW=e(2.4,.8),re.smoothBand=e(1.5,4.5),re.smoothTau=e(.8,1.2)}const oS=[D.shL,D.shR,D.hipL,D.hipR];function cS(n,t){let e=0,i=0,s=0;for(const c of oS){const l=n.image[c],u=n.world[c],h=Math.max(0,Math.min(1,(l.v-.4)/.4)),f=h*h*(3-2*h);if(f<=0)continue;const d=-(n.T.z+u.z);if(d<=.05)continue;const p=t.cx+t.f*(n.T.x+u.x)/d,v=t.cy-t.f*(n.T.y+u.y)/d;e+=(l.x*t.w-p)*f,i+=(l.y*t.h-v)*f,s+=f}if(s<=1e-6)return;const r=Math.min(1,Math.max(0,(s-.25)/.75)),a=r*r*(3-2*r),o=-n.T.z;n.T={x:n.T.x+e/s*o*a/t.f,y:n.T.y-i/s*o*a/t.f,z:n.T.z}}class lS{tracks=[];all=[];nextId=1;last=-1;shaped(t,e,i,s){return iS(t,s,i,Math.min(e[D.hipL].v,e[D.hipR].v))}check(t,e,i,s,r,a){return nS(e.world,e.image,r,{len:t.len?.torso,f:s.f/s.h,aspect:s.w/s.h,depth:-i.z,now:a,state:t.up})}update(t,e,i,s=aS){const r=this.last<0?.03333333333333333:Math.min(.25,Math.max(.001,(e-this.last)/1e3));this.last=e;const a=t.map(h=>({d:h,T:C0(h.world,h.image,i),c:yp(h.image)})).filter(h=>h.T),o=this.all.filter(h=>!h.lost||h.presence>0),c=[];o.forEach((h,f)=>{const d=yp(h.image);a.forEach((p,v)=>{const g=Math.hypot(d.x-p.c.x,d.y-p.c.y)/d.s;g<re.matchRadius&&c.push({ti:f,di:v,cost:g})})}),c.sort((h,f)=>h.cost-f.cost);const l=new Set,u=new Set;for(const h of c){if(l.has(h.ti)||u.has(h.di))continue;l.add(h.ti),u.add(h.di);const f=o[h.ti],d=a[h.di],p=f.lost&&f.presence<.05,v=p?1:ba(r,re.tauVis),g=this.check(f,d.d,f.T,i,s,e);f.verdict=g.verdict;let m={dx:0,dy:0};if(Sp(f.wsm,g.world,p?1:ba(r,re.tauWorld*re.smoothTau),v,p?1:ba(r,re.tauCore*re.smoothTau)),p||(m=rS(f.ism,d.d.image)),Sp(f.ism,d.d.image,p?1:ba(r,re.tauImage*re.smoothTau),v),p)Ep(f.wh,f.wsm),Ep(f.image,f.ism),f.vel&&(f.vel.world.fill(0),f.vel.image.fill(0),f.vel.z=0);else{let b=m.dx,S=m.dy;{const E=f.cm??={tx:0,ty:0,x:0,y:0,vx:0,vy:0},R=Math.hypot(f.ism[D.shL].x-f.ism[D.shR].x,(f.ism[D.shL].y-f.ism[D.shR].y)*i.h/i.w)||.05,L=re.holdImageCore*R*re.smoothBand,I=E.x,N=E.y;E.tx+=m.dx,E.ty+=m.dy,[E.x,E.vx]=Vl(E.x,E.vx,E.tx,r,L,re.motorShake*re.smoothW),[E.y,E.vy]=Vl(E.y,E.vy,E.ty,r,L*i.w/i.h,re.motorShake*re.smoothW),b=E.x-I,S=E.y-N;for(const B of f.image)B.x+=b,B.y+=S}const T=Math.hypot(f.ism[D.shL].x-f.ism[D.shR].x,(f.ism[D.shL].y-f.ism[D.shR].y)*i.h/i.w)||.05,A=(E,R)=>(lh.has(E)?re.holdWorldCore:re.holdWorldLimb)*(R===2?re.holdZ:1)*re.smoothBand,w=(E,R)=>(lh.has(E)?re.holdImageCore:re.holdImageLimb)*T*(R===1?i.w/i.h:1)*re.smoothBand,y=f.vel??={world:new Float64Array(js*3),image:new Float64Array(js*2),z:0};Tp(f.wh,f.wsm,y.world,3,r,A),Tp(f.image,f.ism,y.image,2,r,w)}f.world=this.shaped(f.wh,f.image,f.len.torso,s),Math.min(f.image[D.hipL].v,f.image[D.hipR].v)<.7&&f.verdict==="kept"&&(f.verdict="torso shot");const M=C0(f.world,f.image,i)??d.T;if(p)f.T={...M},f.zs=f.zh=M.z,f.kf?.z.reset(0,M.z,re.rDepth**2);else{const b=za(f.zs??f.T.z,M.z,ba(r,re.tauZ*re.smoothTau));if(f.zh!==void 0){const T=f.vel??={world:new Float64Array(js*3),image:new Float64Array(js*2),z:0};[f.zh,T.z]=Vl(f.zh,T.z,b,r,re.holdDepth*Math.abs(b)*re.smoothBand,re.motorCore*re.smoothW)}else f.zh=b;f.zs=b;const S=f.zh/M.z;f.T={x:M.x*S,y:M.y*S,z:f.zh}}cS(f,i);const x=bp(f.wsm),_=ba(r,re.tauLen);for(const b of Object.keys(x))f.len[b]=za(f.len[b],x[b],_);f.seen=e,f.lost=!1,f.det=d.d,f.hits++}a.forEach((h,f)=>{if(u.has(f))return;const d={belief:0,at:-1},p=this.check({up:d},h.d,h.T,i,s,e),v=wl(p.world),g=wl(h.d.image),m=bp(v),M=wl(v),x=wl(g),_=this.shaped(v,g,m.torso,s),b=C0(_,g,i)??h.T;this.all.push({id:this.nextId++,born:e,seen:e,image:g,world:_,wsm:v,wh:M,ism:x,T:{...b},len:m,presence:0,hits:1,lost:!1,det:h.d,up:d,verdict:p.verdict,kf:null})});for(const h of this.all){h.seen!==e&&(h.lost=!0,h.det=null);const f=h.hits>=re.confirm;h.presence=h.lost?Math.max(0,h.presence-r/re.fadeOut):f?Math.min(1,h.presence+r/re.fadeIn):0}return this.all=this.all.filter(h=>!(h.lost&&h.hits<re.confirm)&&!(h.lost&&h.presence<=0&&e-h.seen>re.forgetAfter*1e3)),this.tracks=this.all.filter(h=>h.hits>=re.confirm),this.tracks}clear(){this.tracks=[],this.all=[],this.last=-1}}const hS={armL:[.2,-1,0],forearmL:[.15,-1,.1],armR:[-.2,-1,0],forearmR:[-.15,-1,.1],thighL:[.05,-1,0],shinL:[0,-1,0],footL:[0,-.15,1],thighR:[-.05,-1,0],shinR:[0,-1,0],footR:[0,-.15,1]};function uS(n,t){const e=n.scale??1,i=p=>new C(...n.dir?.[p]??hS[p]).normalize(),s=Array.from({length:js},()=>new C),r=(p,v)=>s[p].copy(v),a=(p,v,g)=>new C(p,v,g).multiplyScalar(e);r(D.hipL,a(.1,0,0)),r(D.hipR,a(-.1,0,0)),r(D.shL,a(.19,.52,-.02)),r(D.shR,a(-.19,.52,-.02));const o=new ie().setFromEuler(new Cn(n.head?.[1]??0,n.head?.[0]??0,0,"YXZ")),c=a(0,.6,-.02),l=(p,v,g)=>a(p,v,g).applyQuaternion(o).add(c);r(D.nose,l(0,.1,.11)),r(D.eyeL,l(.032,.135,.09)),r(D.eyeR,l(-.032,.135,.09)),r(D.eyeInL,l(.018,.135,.095)),r(D.eyeInR,l(-.018,.135,.095)),r(D.eyeOutL,l(.05,.135,.08)),r(D.eyeOutR,l(-.05,.135,.08)),r(D.earL,l(.075,.12,0)),r(D.earR,l(-.075,.12,0)),r(D.mouthL,l(.024,.06,.095)),r(D.mouthR,l(-.024,.06,.095));for(const p of["L","R"]){const v=s[p==="L"?D.shL:D.shR],g=s[p==="L"?D.hipL:D.hipR],m=v.clone().addScaledVector(i(`arm${p}`),.29*e),M=m.clone().addScaledVector(i(`forearm${p}`),.26*e);r(p==="L"?D.elL:D.elR,m),r(p==="L"?D.wrL:D.wrR,M);const x=M.clone().addScaledVector(i(`forearm${p}`),.08*e);r(p==="L"?D.indexL:D.indexR,x.clone().add(a(0,0,.02))),r(p==="L"?D.pinkyL:D.pinkyR,x.clone().add(a(0,0,-.02))),r(p==="L"?D.thumbL:D.thumbR,M.clone().addScaledVector(i(`forearm${p}`),.04*e).add(a(0,0,.04)));const _=g.clone().addScaledVector(i(`thigh${p}`),.43*e),b=_.clone().addScaledVector(i(`shin${p}`),.42*e);r(p==="L"?D.knL:D.knR,_),r(p==="L"?D.anL:D.anR,b);const S=b.clone().add(a(0,-.04,-.05));r(p==="L"?D.heelL:D.heelR,S),r(p==="L"?D.toeL:D.toeR,S.clone().addScaledVector(i(`foot${p}`),.24*e))}const u=new ie().setFromAxisAngle(new C(0,1,0),n.yaw??0),h=new Set([D.knL,D.knR,D.anL,D.anR,D.heelL,D.heelR,D.toeL,D.toeR]),f=[],d=[];for(let p=0;p<js;p++){const v=s[p].clone().applyQuaternion(u),g=h.has(p)?n.legsVis??.98:.98;f.push({x:v.x,y:v.y,z:v.z,v:g});const m=go({x:v.x+n.T.x,y:v.y+n.T.y,z:v.z+n.T.z},t);d.push({x:m.x,y:m.y,z:0,v:g})}return{world:f,image:d}}function fS(n,t,e){const i=[];for(let s=0;s<n;s++){const r=t*1.3+s*2.1,a=(s-(n-1)/2)*.9+Math.sin(t*.4+s)*.15,o=Math.sin(r);i.push(uS({T:{x:a,y:-.1+.03*Math.sin(r*2),z:-3-s*.6},yaw:Math.sin(t*.5+s)*.5,head:[Math.sin(t*.7+s)*.4,Math.sin(t*.9)*.15],dir:{armR:[-1,.3+.5*o,.1],forearmR:[-.3,1,.1+.3*o],armL:[.5+.4*Math.cos(r),-.8+.6*Math.cos(r*.5),.3],forearmL:[.2,-.3,1],thighL:[.12,-1,.25*Math.max(0,o)],shinL:[.05,-1,-.2*Math.max(0,o)]},scale:1-s*.08},e))}return i}function dS(n,t,e,i){const s=n.image,r=new Float32Array(t*e),a=d=>[s[d].x*i,s[d].y],o=Math.hypot(a(D.shL)[0]-a(D.hipL)[0],a(D.shL)[1]-a(D.hipL)[1]),c=[[D.shL,D.elL,.11],[D.elL,D.wrL,.09],[D.shR,D.elR,.11],[D.elR,D.wrR,.09],[D.hipL,D.knL,.15],[D.knL,D.anL,.11],[D.hipR,D.knR,.15],[D.knR,D.anR,.11],[D.anL,D.toeL,.07],[D.anR,D.toeR,.07],[D.shL,D.hipR,.2],[D.shR,D.hipL,.2],[D.shL,D.shR,.14],[D.hipL,D.hipR,.16]],l=a(D.nose),u=a(D.earL),h=a(D.earR),f=Math.max(Math.hypot(u[0]-h[0],u[1]-h[1])*.9,o*.22);for(let d=0;d<e;d++)for(let p=0;p<t;p++){const v=(p+.5)/t*i,g=(d+.5)/e;let m=Math.hypot(v-l[0],g-(l[1]-f*.2))-f;for(const[M,x,_]of c){const b=a(M),S=a(x),T=S[0]-b[0],A=S[1]-b[1],w=T*T+A*A||1,y=Math.max(0,Math.min(1,((v-b[0])*T+(g-b[1])*A)/w));m=Math.min(m,Math.hypot(v-b[0]-T*y,g-b[1]-A*y)-_*o)}r[d*t+p]=Math.max(0,Math.min(1,.5-m/(o*.04)))}return{data:r,w:t,h:e}}function pS(n){const t=new Map,e=new Map,i=n.clone();return d2(n,i,function(s,r){t.set(r,s),e.set(s,r)}),i.traverse(function(s){if(!s.isSkinnedMesh)return;const r=s,a=t.get(s),o=a.skeleton.bones;r.skeleton=a.skeleton.clone(),r.bindMatrix.copy(a.bindMatrix),r.skeleton.bones=o.map(function(c){return e.get(c)}),r.bind(r.skeleton,r.bindMatrix)}),i}function d2(n,t,e){e(n,t);for(let i=0;i<n.children.length;i++)d2(n.children[i],t.children[i],e)}class p2 extends nt{constructor(t,e,i=!1,s=!1,r=1e4){const a=new Me;super(a,e),this.isMarchingCubes=!0;const o=this,c=new Float32Array(36),l=new Float32Array(36),u=new Float32Array(36);this.enableUvs=i,this.enableColors=s,this.init=function(M){this.resolution=M,this.isolation=80,this.size=M,this.size2=this.size*this.size,this.size3=this.size2*this.size,this.halfsize=this.size/2,this.delta=2/this.size,this.yd=this.size,this.zd=this.size2,this.field=new Float32Array(this.size3),this.normal_cache=new Float32Array(this.size3*3),this.palette=new Float32Array(this.size3*3),this.count=0;const x=r*3;this.positionArray=new Float32Array(x*3);const _=new qt(this.positionArray,3);_.setUsage(Gc),a.setAttribute("position",_),this.normalArray=new Float32Array(x*3);const b=new qt(this.normalArray,3);if(b.setUsage(Gc),a.setAttribute("normal",b),this.enableUvs){this.uvArray=new Float32Array(x*2);const S=new qt(this.uvArray,2);S.setUsage(Gc),a.setAttribute("uv",S)}if(this.enableColors){this.colorArray=new Float32Array(x*3);const S=new qt(this.colorArray,3);S.setUsage(Gc),a.setAttribute("color",S)}a.boundingSphere=new lr(new C,1)};function h(M,x,_){return M+(x-M)*_}function f(M,x,_,b,S,T,A,w,y,E){const R=(_-A)/(w-A),L=o.normal_cache;c[x+0]=b+R*o.delta,c[x+1]=S,c[x+2]=T,l[x+0]=h(L[M+0],L[M+3],R),l[x+1]=h(L[M+1],L[M+4],R),l[x+2]=h(L[M+2],L[M+5],R),u[x+0]=h(o.palette[y*3+0],o.palette[E*3+0],R),u[x+1]=h(o.palette[y*3+1],o.palette[E*3+1],R),u[x+2]=h(o.palette[y*3+2],o.palette[E*3+2],R)}function d(M,x,_,b,S,T,A,w,y,E){const R=(_-A)/(w-A),L=o.normal_cache;c[x+0]=b,c[x+1]=S+R*o.delta,c[x+2]=T;const I=M+o.yd*3;l[x+0]=h(L[M+0],L[I+0],R),l[x+1]=h(L[M+1],L[I+1],R),l[x+2]=h(L[M+2],L[I+2],R),u[x+0]=h(o.palette[y*3+0],o.palette[E*3+0],R),u[x+1]=h(o.palette[y*3+1],o.palette[E*3+1],R),u[x+2]=h(o.palette[y*3+2],o.palette[E*3+2],R)}function p(M,x,_,b,S,T,A,w,y,E){const R=(_-A)/(w-A),L=o.normal_cache;c[x+0]=b,c[x+1]=S,c[x+2]=T+R*o.delta;const I=M+o.zd*3;l[x+0]=h(L[M+0],L[I+0],R),l[x+1]=h(L[M+1],L[I+1],R),l[x+2]=h(L[M+2],L[I+2],R),u[x+0]=h(o.palette[y*3+0],o.palette[E*3+0],R),u[x+1]=h(o.palette[y*3+1],o.palette[E*3+1],R),u[x+2]=h(o.palette[y*3+2],o.palette[E*3+2],R)}function v(M){const x=M*3;o.normal_cache[x]===0&&(o.normal_cache[x+0]=o.field[M-1]-o.field[M+1],o.normal_cache[x+1]=o.field[M-o.yd]-o.field[M+o.yd],o.normal_cache[x+2]=o.field[M-o.zd]-o.field[M+o.zd])}function g(M,x,_,b,S){const T=b+1,A=b+o.yd,w=b+o.zd,y=T+o.yd,E=T+o.zd,R=b+o.yd+o.zd,L=T+o.yd+o.zd;let I=0;const N=o.field[b],B=o.field[T],X=o.field[A],H=o.field[y],Y=o.field[w],it=o.field[E],dt=o.field[R],vt=o.field[L];N<S&&(I|=1),B<S&&(I|=2),X<S&&(I|=8),H<S&&(I|=4),Y<S&&(I|=16),it<S&&(I|=32),dt<S&&(I|=128),vt<S&&(I|=64);const St=mS[I];if(St===0)return 0;const Ct=o.delta,Ft=M+Ct,V=x+Ct,$=_+Ct;St&1&&(v(b),v(T),f(b*3,0,S,M,x,_,N,B,b,T)),St&2&&(v(T),v(y),d(T*3,3,S,Ft,x,_,B,H,T,y)),St&4&&(v(A),v(y),f(A*3,6,S,M,V,_,X,H,A,y)),St&8&&(v(b),v(A),d(b*3,9,S,M,x,_,N,X,b,A)),St&16&&(v(w),v(E),f(w*3,12,S,M,x,$,Y,it,w,E)),St&32&&(v(E),v(L),d(E*3,15,S,Ft,x,$,it,vt,E,L)),St&64&&(v(R),v(L),f(R*3,18,S,M,V,$,dt,vt,R,L)),St&128&&(v(w),v(R),d(w*3,21,S,M,x,$,Y,dt,w,R)),St&256&&(v(b),v(w),p(b*3,24,S,M,x,_,N,Y,b,w)),St&512&&(v(T),v(E),p(T*3,27,S,Ft,x,_,B,it,T,E)),St&1024&&(v(y),v(L),p(y*3,30,S,Ft,V,_,H,vt,y,L)),St&2048&&(v(A),v(R),p(A*3,33,S,M,V,_,X,dt,A,R)),I<<=4;let z,W,G,tt=0,ot=0;for(;bl[I+ot]!=-1;)z=I+ot,W=z+1,G=z+2,m(c,l,u,3*bl[z],3*bl[W],3*bl[G]),ot+=3,tt++;return tt}function m(M,x,_,b,S,T){const A=o.count*3;if(o.positionArray[A+0]=M[b],o.positionArray[A+1]=M[b+1],o.positionArray[A+2]=M[b+2],o.positionArray[A+3]=M[S],o.positionArray[A+4]=M[S+1],o.positionArray[A+5]=M[S+2],o.positionArray[A+6]=M[T],o.positionArray[A+7]=M[T+1],o.positionArray[A+8]=M[T+2],o.material.flatShading===!0){const w=(x[b+0]+x[S+0]+x[T+0])/3,y=(x[b+1]+x[S+1]+x[T+1])/3,E=(x[b+2]+x[S+2]+x[T+2])/3;o.normalArray[A+0]=w,o.normalArray[A+1]=y,o.normalArray[A+2]=E,o.normalArray[A+3]=w,o.normalArray[A+4]=y,o.normalArray[A+5]=E,o.normalArray[A+6]=w,o.normalArray[A+7]=y,o.normalArray[A+8]=E}else o.normalArray[A+0]=x[b+0],o.normalArray[A+1]=x[b+1],o.normalArray[A+2]=x[b+2],o.normalArray[A+3]=x[S+0],o.normalArray[A+4]=x[S+1],o.normalArray[A+5]=x[S+2],o.normalArray[A+6]=x[T+0],o.normalArray[A+7]=x[T+1],o.normalArray[A+8]=x[T+2];if(o.enableUvs){const w=o.count*2;o.uvArray[w+0]=M[b+0],o.uvArray[w+1]=M[b+2],o.uvArray[w+2]=M[S+0],o.uvArray[w+3]=M[S+2],o.uvArray[w+4]=M[T+0],o.uvArray[w+5]=M[T+2]}o.enableColors&&(o.colorArray[A+0]=_[b+0],o.colorArray[A+1]=_[b+1],o.colorArray[A+2]=_[b+2],o.colorArray[A+3]=_[S+0],o.colorArray[A+4]=_[S+1],o.colorArray[A+5]=_[S+2],o.colorArray[A+6]=_[T+0],o.colorArray[A+7]=_[T+1],o.colorArray[A+8]=_[T+2]),o.count+=3}this.addBall=function(M,x,_,b,S,T){const A=Math.sign(b);b=Math.abs(b);const w=T!=null;let y=new gt(M,x,_);if(w)try{y=T instanceof gt?T:Array.isArray(T)?new gt(Math.min(Math.abs(T[0]),1),Math.min(Math.abs(T[1]),1),Math.min(Math.abs(T[2]),1)):new gt(T)}catch{y=new gt(M,x,_)}const E=this.size*Math.sqrt(b/S),R=_*this.size,L=x*this.size,I=M*this.size;let N=Math.floor(R-E);N<1&&(N=1);let B=Math.floor(R+E);B>this.size-1&&(B=this.size-1);let X=Math.floor(L-E);X<1&&(X=1);let H=Math.floor(L+E);H>this.size-1&&(H=this.size-1);let Y=Math.floor(I-E);Y<1&&(Y=1);let it=Math.floor(I+E);it>this.size-1&&(it=this.size-1);let dt,vt,St,Ct,Ft,V,$,z,W,G,tt;for(St=N;St<B;St++)for(Ft=this.size2*St,z=St/this.size-_,W=z*z,vt=X;vt<H;vt++)for(Ct=Ft+this.size*vt,$=vt/this.size-x,G=$*$,dt=Y;dt<it;dt++)if(V=dt/this.size-M,tt=b/(1e-6+V*V+G+W)-S,tt>0){this.field[Ct+dt]+=tt*A;const ot=Math.sqrt((dt-I)*(dt-I)+(vt-L)*(vt-L)+(St-R)*(St-R))/E,F=1-ot*ot*ot*(ot*(ot*6-15)+10);this.palette[(Ct+dt)*3+0]+=y.r*F,this.palette[(Ct+dt)*3+1]+=y.g*F,this.palette[(Ct+dt)*3+2]+=y.b*F}},this.addPlaneX=function(M,x){const _=this.size,b=this.yd,S=this.zd,T=this.field;let A,w,y,E,R,L,I,N=_*Math.sqrt(M/x);for(N>_&&(N=_),A=0;A<N;A++)if(L=A/_,E=L*L,R=M/(1e-4+E)-x,R>0)for(w=0;w<_;w++)for(I=A+w*b,y=0;y<_;y++)T[S*y+I]+=R},this.addPlaneY=function(M,x){const _=this.size,b=this.yd,S=this.zd,T=this.field;let A,w,y,E,R,L,I,N,B=_*Math.sqrt(M/x);for(B>_&&(B=_),w=0;w<B;w++)if(L=w/_,E=L*L,R=M/(1e-4+E)-x,R>0)for(I=w*b,A=0;A<_;A++)for(N=I+A,y=0;y<_;y++)T[S*y+N]+=R},this.addPlaneZ=function(M,x){const _=this.size,b=this.yd,S=this.zd,T=this.field;let A,w,y,E,R,L,I,N,B=_*Math.sqrt(M/x);for(B>_&&(B=_),y=0;y<B;y++)if(L=y/_,E=L*L,R=M/(1e-4+E)-x,R>0)for(I=S*y,w=0;w<_;w++)for(N=I+w*b,A=0;A<_;A++)T[N+A]+=R},this.setCell=function(M,x,_,b){const S=this.size2*_+this.size*x+M;this.field[S]=b},this.getCell=function(M,x,_){const b=this.size2*_+this.size*x+M;return this.field[b]},this.blur=function(M=1){const x=this.field,_=x.slice(),b=this.size,S=this.size2;for(let T=0;T<b;T++)for(let A=0;A<b;A++)for(let w=0;w<b;w++){const y=S*w+b*A+T;let E=_[y],R=1;for(let L=-1;L<=1;L+=2){const I=L+T;if(!(I<0||I>=b))for(let N=-1;N<=1;N+=2){const B=N+A;if(!(B<0||B>=b))for(let X=-1;X<=1;X+=2){const H=X+w;if(H<0||H>=b)continue;const Y=S*H+b*B+I,it=_[Y];R++,E+=M*(it-E)/R}}}x[y]=E}},this.reset=function(){for(let M=0;M<this.size3;M++)this.normal_cache[M*3]=0,this.field[M]=0,this.palette[M*3]=this.palette[M*3+1]=this.palette[M*3+2]=0},this.update=function(){this.count=0;const M=this.size-2;for(let x=1;x<M;x++){const _=this.size2*x,b=(x-this.halfsize)/this.halfsize;for(let S=1;S<M;S++){const T=_+this.size*S,A=(S-this.halfsize)/this.halfsize;for(let w=1;w<M;w++){const y=(w-this.halfsize)/this.halfsize,E=T+w;g(y,A,b,E,this.isolation)}}}this.geometry.setDrawRange(0,this.count),a.getAttribute("position").needsUpdate=!0,a.getAttribute("normal").needsUpdate=!0,this.enableUvs&&(a.getAttribute("uv").needsUpdate=!0),this.enableColors&&(a.getAttribute("color").needsUpdate=!0),this.count/3>r&&console.warn("THREE.MarchingCubes: Geometry buffers too small for rendering. Please create an instance with a higher poly count.")},this.init(t)}}const mS=new Int32Array([0,265,515,778,1030,1295,1541,1804,2060,2309,2575,2822,3082,3331,3593,3840,400,153,915,666,1430,1183,1941,1692,2460,2197,2975,2710,3482,3219,3993,3728,560,825,51,314,1590,1855,1077,1340,2620,2869,2111,2358,3642,3891,3129,3376,928,681,419,170,1958,1711,1445,1196,2988,2725,2479,2214,4010,3747,3497,3232,1120,1385,1635,1898,102,367,613,876,3180,3429,3695,3942,2154,2403,2665,2912,1520,1273,2035,1786,502,255,1013,764,3580,3317,4095,3830,2554,2291,3065,2800,1616,1881,1107,1370,598,863,85,348,3676,3925,3167,3414,2650,2899,2137,2384,1984,1737,1475,1226,966,719,453,204,4044,3781,3535,3270,3018,2755,2505,2240,2240,2505,2755,3018,3270,3535,3781,4044,204,453,719,966,1226,1475,1737,1984,2384,2137,2899,2650,3414,3167,3925,3676,348,85,863,598,1370,1107,1881,1616,2800,3065,2291,2554,3830,4095,3317,3580,764,1013,255,502,1786,2035,1273,1520,2912,2665,2403,2154,3942,3695,3429,3180,876,613,367,102,1898,1635,1385,1120,3232,3497,3747,4010,2214,2479,2725,2988,1196,1445,1711,1958,170,419,681,928,3376,3129,3891,3642,2358,2111,2869,2620,1340,1077,1855,1590,314,51,825,560,3728,3993,3219,3482,2710,2975,2197,2460,1692,1941,1183,1430,666,915,153,400,3840,3593,3331,3082,2822,2575,2309,2060,1804,1541,1295,1030,778,515,265,0]),bl=new Int32Array([-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,8,3,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,1,9,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,1,8,3,9,8,1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,1,2,10,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,8,3,1,2,10,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,9,2,10,0,2,9,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,2,8,3,2,10,8,10,9,8,-1,-1,-1,-1,-1,-1,-1,3,11,2,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,11,2,8,11,0,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,1,9,0,2,3,11,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,1,11,2,1,9,11,9,8,11,-1,-1,-1,-1,-1,-1,-1,3,10,1,11,10,3,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,10,1,0,8,10,8,11,10,-1,-1,-1,-1,-1,-1,-1,3,9,0,3,11,9,11,10,9,-1,-1,-1,-1,-1,-1,-1,9,8,10,10,8,11,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,4,7,8,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,4,3,0,7,3,4,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,1,9,8,4,7,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,4,1,9,4,7,1,7,3,1,-1,-1,-1,-1,-1,-1,-1,1,2,10,8,4,7,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,3,4,7,3,0,4,1,2,10,-1,-1,-1,-1,-1,-1,-1,9,2,10,9,0,2,8,4,7,-1,-1,-1,-1,-1,-1,-1,2,10,9,2,9,7,2,7,3,7,9,4,-1,-1,-1,-1,8,4,7,3,11,2,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,11,4,7,11,2,4,2,0,4,-1,-1,-1,-1,-1,-1,-1,9,0,1,8,4,7,2,3,11,-1,-1,-1,-1,-1,-1,-1,4,7,11,9,4,11,9,11,2,9,2,1,-1,-1,-1,-1,3,10,1,3,11,10,7,8,4,-1,-1,-1,-1,-1,-1,-1,1,11,10,1,4,11,1,0,4,7,11,4,-1,-1,-1,-1,4,7,8,9,0,11,9,11,10,11,0,3,-1,-1,-1,-1,4,7,11,4,11,9,9,11,10,-1,-1,-1,-1,-1,-1,-1,9,5,4,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,9,5,4,0,8,3,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,5,4,1,5,0,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,8,5,4,8,3,5,3,1,5,-1,-1,-1,-1,-1,-1,-1,1,2,10,9,5,4,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,3,0,8,1,2,10,4,9,5,-1,-1,-1,-1,-1,-1,-1,5,2,10,5,4,2,4,0,2,-1,-1,-1,-1,-1,-1,-1,2,10,5,3,2,5,3,5,4,3,4,8,-1,-1,-1,-1,9,5,4,2,3,11,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,11,2,0,8,11,4,9,5,-1,-1,-1,-1,-1,-1,-1,0,5,4,0,1,5,2,3,11,-1,-1,-1,-1,-1,-1,-1,2,1,5,2,5,8,2,8,11,4,8,5,-1,-1,-1,-1,10,3,11,10,1,3,9,5,4,-1,-1,-1,-1,-1,-1,-1,4,9,5,0,8,1,8,10,1,8,11,10,-1,-1,-1,-1,5,4,0,5,0,11,5,11,10,11,0,3,-1,-1,-1,-1,5,4,8,5,8,10,10,8,11,-1,-1,-1,-1,-1,-1,-1,9,7,8,5,7,9,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,9,3,0,9,5,3,5,7,3,-1,-1,-1,-1,-1,-1,-1,0,7,8,0,1,7,1,5,7,-1,-1,-1,-1,-1,-1,-1,1,5,3,3,5,7,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,9,7,8,9,5,7,10,1,2,-1,-1,-1,-1,-1,-1,-1,10,1,2,9,5,0,5,3,0,5,7,3,-1,-1,-1,-1,8,0,2,8,2,5,8,5,7,10,5,2,-1,-1,-1,-1,2,10,5,2,5,3,3,5,7,-1,-1,-1,-1,-1,-1,-1,7,9,5,7,8,9,3,11,2,-1,-1,-1,-1,-1,-1,-1,9,5,7,9,7,2,9,2,0,2,7,11,-1,-1,-1,-1,2,3,11,0,1,8,1,7,8,1,5,7,-1,-1,-1,-1,11,2,1,11,1,7,7,1,5,-1,-1,-1,-1,-1,-1,-1,9,5,8,8,5,7,10,1,3,10,3,11,-1,-1,-1,-1,5,7,0,5,0,9,7,11,0,1,0,10,11,10,0,-1,11,10,0,11,0,3,10,5,0,8,0,7,5,7,0,-1,11,10,5,7,11,5,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,10,6,5,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,8,3,5,10,6,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,9,0,1,5,10,6,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,1,8,3,1,9,8,5,10,6,-1,-1,-1,-1,-1,-1,-1,1,6,5,2,6,1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,1,6,5,1,2,6,3,0,8,-1,-1,-1,-1,-1,-1,-1,9,6,5,9,0,6,0,2,6,-1,-1,-1,-1,-1,-1,-1,5,9,8,5,8,2,5,2,6,3,2,8,-1,-1,-1,-1,2,3,11,10,6,5,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,11,0,8,11,2,0,10,6,5,-1,-1,-1,-1,-1,-1,-1,0,1,9,2,3,11,5,10,6,-1,-1,-1,-1,-1,-1,-1,5,10,6,1,9,2,9,11,2,9,8,11,-1,-1,-1,-1,6,3,11,6,5,3,5,1,3,-1,-1,-1,-1,-1,-1,-1,0,8,11,0,11,5,0,5,1,5,11,6,-1,-1,-1,-1,3,11,6,0,3,6,0,6,5,0,5,9,-1,-1,-1,-1,6,5,9,6,9,11,11,9,8,-1,-1,-1,-1,-1,-1,-1,5,10,6,4,7,8,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,4,3,0,4,7,3,6,5,10,-1,-1,-1,-1,-1,-1,-1,1,9,0,5,10,6,8,4,7,-1,-1,-1,-1,-1,-1,-1,10,6,5,1,9,7,1,7,3,7,9,4,-1,-1,-1,-1,6,1,2,6,5,1,4,7,8,-1,-1,-1,-1,-1,-1,-1,1,2,5,5,2,6,3,0,4,3,4,7,-1,-1,-1,-1,8,4,7,9,0,5,0,6,5,0,2,6,-1,-1,-1,-1,7,3,9,7,9,4,3,2,9,5,9,6,2,6,9,-1,3,11,2,7,8,4,10,6,5,-1,-1,-1,-1,-1,-1,-1,5,10,6,4,7,2,4,2,0,2,7,11,-1,-1,-1,-1,0,1,9,4,7,8,2,3,11,5,10,6,-1,-1,-1,-1,9,2,1,9,11,2,9,4,11,7,11,4,5,10,6,-1,8,4,7,3,11,5,3,5,1,5,11,6,-1,-1,-1,-1,5,1,11,5,11,6,1,0,11,7,11,4,0,4,11,-1,0,5,9,0,6,5,0,3,6,11,6,3,8,4,7,-1,6,5,9,6,9,11,4,7,9,7,11,9,-1,-1,-1,-1,10,4,9,6,4,10,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,4,10,6,4,9,10,0,8,3,-1,-1,-1,-1,-1,-1,-1,10,0,1,10,6,0,6,4,0,-1,-1,-1,-1,-1,-1,-1,8,3,1,8,1,6,8,6,4,6,1,10,-1,-1,-1,-1,1,4,9,1,2,4,2,6,4,-1,-1,-1,-1,-1,-1,-1,3,0,8,1,2,9,2,4,9,2,6,4,-1,-1,-1,-1,0,2,4,4,2,6,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,8,3,2,8,2,4,4,2,6,-1,-1,-1,-1,-1,-1,-1,10,4,9,10,6,4,11,2,3,-1,-1,-1,-1,-1,-1,-1,0,8,2,2,8,11,4,9,10,4,10,6,-1,-1,-1,-1,3,11,2,0,1,6,0,6,4,6,1,10,-1,-1,-1,-1,6,4,1,6,1,10,4,8,1,2,1,11,8,11,1,-1,9,6,4,9,3,6,9,1,3,11,6,3,-1,-1,-1,-1,8,11,1,8,1,0,11,6,1,9,1,4,6,4,1,-1,3,11,6,3,6,0,0,6,4,-1,-1,-1,-1,-1,-1,-1,6,4,8,11,6,8,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,7,10,6,7,8,10,8,9,10,-1,-1,-1,-1,-1,-1,-1,0,7,3,0,10,7,0,9,10,6,7,10,-1,-1,-1,-1,10,6,7,1,10,7,1,7,8,1,8,0,-1,-1,-1,-1,10,6,7,10,7,1,1,7,3,-1,-1,-1,-1,-1,-1,-1,1,2,6,1,6,8,1,8,9,8,6,7,-1,-1,-1,-1,2,6,9,2,9,1,6,7,9,0,9,3,7,3,9,-1,7,8,0,7,0,6,6,0,2,-1,-1,-1,-1,-1,-1,-1,7,3,2,6,7,2,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,2,3,11,10,6,8,10,8,9,8,6,7,-1,-1,-1,-1,2,0,7,2,7,11,0,9,7,6,7,10,9,10,7,-1,1,8,0,1,7,8,1,10,7,6,7,10,2,3,11,-1,11,2,1,11,1,7,10,6,1,6,7,1,-1,-1,-1,-1,8,9,6,8,6,7,9,1,6,11,6,3,1,3,6,-1,0,9,1,11,6,7,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,7,8,0,7,0,6,3,11,0,11,6,0,-1,-1,-1,-1,7,11,6,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,7,6,11,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,3,0,8,11,7,6,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,1,9,11,7,6,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,8,1,9,8,3,1,11,7,6,-1,-1,-1,-1,-1,-1,-1,10,1,2,6,11,7,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,1,2,10,3,0,8,6,11,7,-1,-1,-1,-1,-1,-1,-1,2,9,0,2,10,9,6,11,7,-1,-1,-1,-1,-1,-1,-1,6,11,7,2,10,3,10,8,3,10,9,8,-1,-1,-1,-1,7,2,3,6,2,7,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,7,0,8,7,6,0,6,2,0,-1,-1,-1,-1,-1,-1,-1,2,7,6,2,3,7,0,1,9,-1,-1,-1,-1,-1,-1,-1,1,6,2,1,8,6,1,9,8,8,7,6,-1,-1,-1,-1,10,7,6,10,1,7,1,3,7,-1,-1,-1,-1,-1,-1,-1,10,7,6,1,7,10,1,8,7,1,0,8,-1,-1,-1,-1,0,3,7,0,7,10,0,10,9,6,10,7,-1,-1,-1,-1,7,6,10,7,10,8,8,10,9,-1,-1,-1,-1,-1,-1,-1,6,8,4,11,8,6,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,3,6,11,3,0,6,0,4,6,-1,-1,-1,-1,-1,-1,-1,8,6,11,8,4,6,9,0,1,-1,-1,-1,-1,-1,-1,-1,9,4,6,9,6,3,9,3,1,11,3,6,-1,-1,-1,-1,6,8,4,6,11,8,2,10,1,-1,-1,-1,-1,-1,-1,-1,1,2,10,3,0,11,0,6,11,0,4,6,-1,-1,-1,-1,4,11,8,4,6,11,0,2,9,2,10,9,-1,-1,-1,-1,10,9,3,10,3,2,9,4,3,11,3,6,4,6,3,-1,8,2,3,8,4,2,4,6,2,-1,-1,-1,-1,-1,-1,-1,0,4,2,4,6,2,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,1,9,0,2,3,4,2,4,6,4,3,8,-1,-1,-1,-1,1,9,4,1,4,2,2,4,6,-1,-1,-1,-1,-1,-1,-1,8,1,3,8,6,1,8,4,6,6,10,1,-1,-1,-1,-1,10,1,0,10,0,6,6,0,4,-1,-1,-1,-1,-1,-1,-1,4,6,3,4,3,8,6,10,3,0,3,9,10,9,3,-1,10,9,4,6,10,4,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,4,9,5,7,6,11,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,8,3,4,9,5,11,7,6,-1,-1,-1,-1,-1,-1,-1,5,0,1,5,4,0,7,6,11,-1,-1,-1,-1,-1,-1,-1,11,7,6,8,3,4,3,5,4,3,1,5,-1,-1,-1,-1,9,5,4,10,1,2,7,6,11,-1,-1,-1,-1,-1,-1,-1,6,11,7,1,2,10,0,8,3,4,9,5,-1,-1,-1,-1,7,6,11,5,4,10,4,2,10,4,0,2,-1,-1,-1,-1,3,4,8,3,5,4,3,2,5,10,5,2,11,7,6,-1,7,2,3,7,6,2,5,4,9,-1,-1,-1,-1,-1,-1,-1,9,5,4,0,8,6,0,6,2,6,8,7,-1,-1,-1,-1,3,6,2,3,7,6,1,5,0,5,4,0,-1,-1,-1,-1,6,2,8,6,8,7,2,1,8,4,8,5,1,5,8,-1,9,5,4,10,1,6,1,7,6,1,3,7,-1,-1,-1,-1,1,6,10,1,7,6,1,0,7,8,7,0,9,5,4,-1,4,0,10,4,10,5,0,3,10,6,10,7,3,7,10,-1,7,6,10,7,10,8,5,4,10,4,8,10,-1,-1,-1,-1,6,9,5,6,11,9,11,8,9,-1,-1,-1,-1,-1,-1,-1,3,6,11,0,6,3,0,5,6,0,9,5,-1,-1,-1,-1,0,11,8,0,5,11,0,1,5,5,6,11,-1,-1,-1,-1,6,11,3,6,3,5,5,3,1,-1,-1,-1,-1,-1,-1,-1,1,2,10,9,5,11,9,11,8,11,5,6,-1,-1,-1,-1,0,11,3,0,6,11,0,9,6,5,6,9,1,2,10,-1,11,8,5,11,5,6,8,0,5,10,5,2,0,2,5,-1,6,11,3,6,3,5,2,10,3,10,5,3,-1,-1,-1,-1,5,8,9,5,2,8,5,6,2,3,8,2,-1,-1,-1,-1,9,5,6,9,6,0,0,6,2,-1,-1,-1,-1,-1,-1,-1,1,5,8,1,8,0,5,6,8,3,8,2,6,2,8,-1,1,5,6,2,1,6,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,1,3,6,1,6,10,3,8,6,5,6,9,8,9,6,-1,10,1,0,10,0,6,9,5,0,5,6,0,-1,-1,-1,-1,0,3,8,5,6,10,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,10,5,6,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,11,5,10,7,5,11,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,11,5,10,11,7,5,8,3,0,-1,-1,-1,-1,-1,-1,-1,5,11,7,5,10,11,1,9,0,-1,-1,-1,-1,-1,-1,-1,10,7,5,10,11,7,9,8,1,8,3,1,-1,-1,-1,-1,11,1,2,11,7,1,7,5,1,-1,-1,-1,-1,-1,-1,-1,0,8,3,1,2,7,1,7,5,7,2,11,-1,-1,-1,-1,9,7,5,9,2,7,9,0,2,2,11,7,-1,-1,-1,-1,7,5,2,7,2,11,5,9,2,3,2,8,9,8,2,-1,2,5,10,2,3,5,3,7,5,-1,-1,-1,-1,-1,-1,-1,8,2,0,8,5,2,8,7,5,10,2,5,-1,-1,-1,-1,9,0,1,5,10,3,5,3,7,3,10,2,-1,-1,-1,-1,9,8,2,9,2,1,8,7,2,10,2,5,7,5,2,-1,1,3,5,3,7,5,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,8,7,0,7,1,1,7,5,-1,-1,-1,-1,-1,-1,-1,9,0,3,9,3,5,5,3,7,-1,-1,-1,-1,-1,-1,-1,9,8,7,5,9,7,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,5,8,4,5,10,8,10,11,8,-1,-1,-1,-1,-1,-1,-1,5,0,4,5,11,0,5,10,11,11,3,0,-1,-1,-1,-1,0,1,9,8,4,10,8,10,11,10,4,5,-1,-1,-1,-1,10,11,4,10,4,5,11,3,4,9,4,1,3,1,4,-1,2,5,1,2,8,5,2,11,8,4,5,8,-1,-1,-1,-1,0,4,11,0,11,3,4,5,11,2,11,1,5,1,11,-1,0,2,5,0,5,9,2,11,5,4,5,8,11,8,5,-1,9,4,5,2,11,3,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,2,5,10,3,5,2,3,4,5,3,8,4,-1,-1,-1,-1,5,10,2,5,2,4,4,2,0,-1,-1,-1,-1,-1,-1,-1,3,10,2,3,5,10,3,8,5,4,5,8,0,1,9,-1,5,10,2,5,2,4,1,9,2,9,4,2,-1,-1,-1,-1,8,4,5,8,5,3,3,5,1,-1,-1,-1,-1,-1,-1,-1,0,4,5,1,0,5,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,8,4,5,8,5,3,9,0,5,0,3,5,-1,-1,-1,-1,9,4,5,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,4,11,7,4,9,11,9,10,11,-1,-1,-1,-1,-1,-1,-1,0,8,3,4,9,7,9,11,7,9,10,11,-1,-1,-1,-1,1,10,11,1,11,4,1,4,0,7,4,11,-1,-1,-1,-1,3,1,4,3,4,8,1,10,4,7,4,11,10,11,4,-1,4,11,7,9,11,4,9,2,11,9,1,2,-1,-1,-1,-1,9,7,4,9,11,7,9,1,11,2,11,1,0,8,3,-1,11,7,4,11,4,2,2,4,0,-1,-1,-1,-1,-1,-1,-1,11,7,4,11,4,2,8,3,4,3,2,4,-1,-1,-1,-1,2,9,10,2,7,9,2,3,7,7,4,9,-1,-1,-1,-1,9,10,7,9,7,4,10,2,7,8,7,0,2,0,7,-1,3,7,10,3,10,2,7,4,10,1,10,0,4,0,10,-1,1,10,2,8,7,4,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,4,9,1,4,1,7,7,1,3,-1,-1,-1,-1,-1,-1,-1,4,9,1,4,1,7,0,8,1,8,7,1,-1,-1,-1,-1,4,0,3,7,4,3,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,4,8,7,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,9,10,8,10,11,8,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,3,0,9,3,9,11,11,9,10,-1,-1,-1,-1,-1,-1,-1,0,1,10,0,10,8,8,10,11,-1,-1,-1,-1,-1,-1,-1,3,1,10,11,3,10,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,1,2,11,1,11,9,9,11,8,-1,-1,-1,-1,-1,-1,-1,3,0,9,3,9,11,1,2,9,2,11,9,-1,-1,-1,-1,0,2,11,8,0,11,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,3,2,11,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,2,3,8,2,8,10,10,8,9,-1,-1,-1,-1,-1,-1,-1,9,10,2,0,9,2,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,2,3,8,2,8,10,0,1,8,1,10,8,-1,-1,-1,-1,1,10,2,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,1,3,8,9,1,8,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,9,1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,3,8,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1]),m2={uFurFade:{value:1}},gS=`
  float furHash(vec3 p) { p = fract(p * 0.1031); p += dot(p, p.zyx + 31.32); return fract((p.x + p.y) * p.z); }
  float furNoise(vec3 p) { vec3 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f);
    return mix(mix(mix(furHash(i), furHash(i + vec3(1, 0, 0)), f.x), mix(furHash(i + vec3(0, 1, 0)), furHash(i + vec3(1, 1, 0)), f.x), f.y),
               mix(mix(furHash(i + vec3(0, 0, 1)), furHash(i + vec3(1, 0, 1)), f.x), mix(furHash(i + vec3(0, 1, 1)), furHash(i + vec3(1, 1, 1)), f.x), f.y), f.z); }`;function vS(n,t){const e=new je({vertexColors:!0,roughness:t.feather?.75:.92,metalness:0}),i={uH:{value:n},uFurLen:{value:t.length},uFurDensity:{value:t.density},uFurTip:{value:t.tip},uFeather:{value:t.feather?1:0}};return e.onBeforeCompile=s=>{Object.assign(s.uniforms,i,m2),s.vertexShader=s.vertexShader.replace("#include <common>",`#include <common>
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
        ${gS}`).replace("#include <color_fragment>",`#include <color_fragment>
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
        diffuseColor.rgb = mix(diffuseColor.rgb, diffuseColor.rgb * 1.25 + 0.06, uFurTip * smoothstep(0.6, 1.0, t));`)},e.customProgramCacheKey=()=>"kaiju-fur-v2",e}function g2(n,t,e,i){const s=[];for(let r=1;r<=i;r++){const a=new Fc(t,vS(r/i,e));a.castShadow=!1,a.receiveShadow=!0,a.frustumCulled=!1,a.userData.h=r/i,n.add(a),a.bind(n.skeleton,n.bindMatrix),s.push(a)}return s}function xS(n=512){const t=document.createElement("canvas");t.width=t.height=n;const e=t.getContext("2d"),i=document.createElement("canvas");i.width=i.height=n;const s=i.getContext("2d"),r=e.createImageData(n,n),a=s.createImageData(n,n),o=22,c=[];let l=7;const u=()=>(l=l*1664525+1013904223>>>0,l/4294967296);for(let d=0;d<o;d++)for(let p=0;p<o;p++)c.push([(p+.2+u()*.6)/o,(d+.2+u()*.6)/o,.7+u()*.3]);for(let d=0;d<n;d++)for(let p=0;p<n;p++){const v=p/n,g=d/n,m=Math.floor(v*o),M=Math.floor(g*o);let x=9,_=9,b=1;for(let R=-1;R<=1;R++)for(let L=-1;L<=1;L++){const I=(m+L+o)%o,N=(M+R+o)%o,B=c[N*o+I];let X=v-B[0],H=g-B[1];X-=Math.round(X),H-=Math.round(H);const Y=Math.sqrt(X*X+H*H);Y<x?(_=x,x=Y,b=B[2]):Y<_&&(_=Y)}const S=_-x,T=Math.min(1,S/.02),A=1-Math.min(1,x/(.55/o)),w=(.55+.45*T)*b*(.85+.3*A),y=(d*n+p)*4;r.data[y]=255*w,r.data[y+1]=255*w,r.data[y+2]=255*w,r.data[y+3]=255;const E=.55+.4*(1-T)-.15*A;a.data[y]=255*E,a.data[y+1]=255*E,a.data[y+2]=255*E,a.data[y+3]=255}e.putImageData(r,0,0),s.putImageData(a,0,0);const h=new oh(t);h.wrapS=h.wrapT=uo,h.colorSpace=Qi;const f=new oh(i);return f.wrapS=f.wrapT=uo,{map:h,rough:f}}let yl=null;function hh(n=!1,t){if(n)return MS();if(t==="armour")return new je({vertexColors:!0,roughness:.42,metalness:.45});if(t==="soft")return new je({vertexColors:!0,roughness:.82,metalness:0});if(t==="suit")return new je({vertexColors:!0,roughness:.34,metalness:.18});!yl&&typeof document<"u"&&(yl=xS());const e=new je({vertexColors:!0,roughness:.7,metalness:.02});return e.onBeforeCompile=i=>{i.uniforms.uScales={value:yl?.map??null},i.uniforms.uRough={value:yl?.rough??null},i.vertexShader=i.vertexShader.replace("#include <common>",`#include <common>
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
        float roughTex = triplanar(uRough, vBind, bn, sc).r;`).replace("#include <roughnessmap_fragment>","float roughnessFactor = mix(roughTex, 0.9, isBone);")},e.customProgramCacheKey=()=>"kaiju-v1",e}function MS(){const n=new je({vertexColors:!0,roughness:.95,metalness:0});return n.onBeforeCompile=t=>{Object.assign(t.uniforms,m2),t.fragmentShader=t.fragmentShader.replace("#include <common>",`#include <common>
 uniform float uFurFade;`).replace("#include <color_fragment>",`#include <color_fragment>
 diffuseColor.rgb *= mix(1.0, 0.6, uFurFade);`)},n.customProgramCacheKey=()=>"kaiju-undercoat-v1",n}const Mo={jaw:0,blinkL:0,blinkR:0,smile:0,pucker:0,browUp:0,smileL:0,smileR:0,frown:0,browDownL:0,browDownR:0,browOuterL:0,browOuterR:0,squintL:0,squintR:0,wideL:0,wideR:0,lookX:0,lookY:0,jawSide:0,puff:0,funnel:0,sneer:0};function _S(n,t={}){const e={...Mo,...t};for(const i of(n??"").split(",")){const[s,r]=i.split(":");s&&s in e&&r!==void 0&&Number.isFinite(Number(r))&&(e[s]=Number(r))}return e}function df(n){const t=new Me;return t.setAttribute("position",new qt(n.position,3)),t.setAttribute("normal",new qt(n.normal,3)),t.setAttribute("color",new qt(n.color,3)),n.aFur&&t.setAttribute("aFur",new qt(n.aFur,1)),t.setAttribute("skinIndex",new qt(n.skinIndex,4)),t.setAttribute("skinWeight",new qt(n.skinWeight,4)),t}function Ap(n,t,e){return df(wS(n,t,e))}function wS(n,t,e){const i=n.box,s=(i.min[0]+i.max[0])/2,r=(i.min[1]+i.max[1])/2,a=(i.min[2]+i.max[2])/2,o=(i.max[0]-i.min[0])/2,c=(i.max[1]-i.min[1])/2,l=(i.max[2]-i.min[2])/2,u=new p2(e,new cs,!1,!1,4e5);u.isolation=50;const h=u.field,f=e;for(let E=0;E<f;E++){const R=a+(E/(f-1)*2-1)*l;for(let L=0;L<f;L++){const I=r+(L/(f-1)*2-1)*c;for(let N=0;N<f;N++){const B=s+(N/(f-1)*2-1)*o;h[E*f*f+L*f+N]=Math.max(0,Math.min(100,50-n.sdf(B,I,R)*40))}}}u.update();const d=u.count,p=new Float32Array(d*3),v=new Float32Array(d*3),g=new Float32Array(d*3),m=u.positionArray,M=u.normalArray,x=n.palette.map(E=>new gt(E)),_=new gt;for(let E=0;E<d;E++){const R=s+m[E*3]*o,L=r+m[E*3+1]*c,I=a+m[E*3+2]*l;p[E*3]=R,p[E*3+1]=L,p[E*3+2]=I;let N=M[E*3]/o,B=M[E*3+1]/c,X=M[E*3+2]/l;const H=Math.hypot(N,B,X)||1;N/=H,B/=H,X/=H,v[E*3]=N,v[E*3+1]=B,v[E*3+2]=X;const Y=n.region(R,L,I);_.copy(x[Y]??x[0]),n.tint?.(Y,R,L,I,_);const it=.94+.06*Math.sin(L*1.7+I*.9)*Math.cos(R*2.3);g[E*3]=_.r*it,g[E*3+1]=_.g*it,g[E*3+2]=_.b*it}u.geometry.dispose();let b;if(n.fur){b=new Float32Array(d);for(let E=0;E<d;E++)b[E]=n.furLen?n.furLen(p[E*3],p[E*3+1],p[E*3+2]):1}const S=new Uint16Array(d*4),T=new Float32Array(d*4),A=t.map((E,R)=>({i:R,a:E.a,b:E.b,reach:E.reach??1/0,name:E.name})),w=n.capture,y=n.weights??"sharp";for(let E=0;E<d;E++){const R=p[E*3],L=p[E*3+1],I=p[E*3+2];let N=1/0,B=1/0,X=0,H=0;for(const vt of A){if(w&&!w(vt,R,L,I))continue;const St=vt.b[0]-vt.a[0],Ct=vt.b[1]-vt.a[1],Ft=vt.b[2]-vt.a[2],V=R-vt.a[0],$=L-vt.a[1],z=I-vt.a[2],W=Math.max(0,Math.min(1,(V*St+$*Ct+z*Ft)/(St*St+Ct*Ct+Ft*Ft||1))),G=Math.hypot(V-St*W,$-Ct*W,z-Ft*W);G>vt.reach||(G<N?(B=N,H=X,N=G,X=vt.i):G<B&&(B=G,H=vt.i))}isFinite(B)||(B=N,H=X);const Y=y==="rigid"?1:y==="soft"?1/Math.pow(N+1.2,2):1/Math.pow(N+.3,4),it=y==="rigid"?0:y==="soft"?1/Math.pow(B+1.2,2):1/Math.pow(B+.3,4),dt=Y+it;S[E*4]=X,S[E*4+1]=H,T[E*4]=Y/dt,T[E*4+1]=it/dt}return{position:p,normal:v,color:g,skinIndex:S,skinWeight:T,aFur:b}}const bS=(n,t=n.res??88)=>({body:t,fur:Math.max(32,Math.round(t*.6))});function yS(n){const t=new Map;let e=null;for(const i of n){const s=new $g;if(s.name=i.name,i.parent){const r=n.find(a=>a.name===i.parent);s.position.set(i.a[0]-r.a[0],i.a[1]-r.a[1],i.a[2]-r.a[2]),t.get(i.parent).add(s)}else s.position.set(i.a[0],i.a[1],i.a[2]),e=s;t.set(i.name,s)}return{bones:t,root:e}}function P0(n,t=n.res??88,e){const i=performance.now(),s=bS(n,t),{bones:r,root:a}=yS(n.segs);let o,c=[];if(n.body){const l=n.body,u=e?df(e.body):Ap(l,n.segs,s.body),h=l.surface==="scales"||l.surface==="fur"?void 0:l.surface,f=new Fc(u,hh(!!l.fur||l.surface==="fur",h));f.castShadow=!0,f.receiveShadow=!0,f.frustumCulled=!1,f.add(a),f.bind(new cd(n.segs.map(d=>r.get(d.name)))),l.fur&&(n.furShells??10)>0&&(c=g2(f,e?.fur?df(e.fur):Ap(l,n.segs,s.fur),l.fur,n.furShells??10)),o=f}else{const l=new de;l.add(a),o=l}if(n.dress){const l=new Map;n.dress({bones:r,segs:n.segs,at(u,h,f,d,p){const v=n.segs.find(g=>g.name===h);return u.position.set(f-v.a[0],d-v.a[1],p-v.a[2]),u.traverse(g=>{g.isMesh&&(g.castShadow=!0,g.receiveShadow=!0)}),r.get(h).add(u),u},std(u){const h=JSON.stringify(u);let f=l.get(h);return f||(f=new je(u),l.set(h,f)),f}})}return o.name=n.id,{def:n,root:o,bones:r,fur:c,ms:performance.now()-i}}function zn(n,t=!1){const e=n[0].index!==null,i=new Set(Object.keys(n[0].attributes)),s=new Set(Object.keys(n[0].morphAttributes)),r={},a={},o=n[0].morphTargetsRelative,c=new Me;let l=0;for(let u=0;u<n.length;++u){const h=n[u];let f=0;if(e!==(h.index!==null))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+u+". All geometries must have compatible attributes; make sure index attribute exists among all geometries, or in none of them."),null;for(const d in h.attributes){if(!i.has(d))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+u+'. All geometries must have compatible attributes; make sure "'+d+'" attribute exists among all geometries, or in none of them.'),null;r[d]===void 0&&(r[d]=[]),r[d].push(h.attributes[d]),f++}if(f!==i.size)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+u+". Make sure all geometries have the same number of attributes."),null;if(o!==h.morphTargetsRelative)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+u+". .morphTargetsRelative must be consistent throughout all geometries."),null;for(const d in h.morphAttributes){if(!s.has(d))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+u+".  .morphAttributes must be consistent throughout all geometries."),null;a[d]===void 0&&(a[d]=[]),a[d].push(h.morphAttributes[d])}if(t){let d;if(e)d=h.index.count;else if(h.attributes.position!==void 0)d=h.attributes.position.count;else return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+u+". The geometry must have either an index or a position attribute"),null;c.addGroup(l,d,u),l+=d}}if(e){let u=0;const h=[];for(let f=0;f<n.length;++f){const d=n[f].index;for(let p=0;p<d.count;++p)h.push(d.getX(p)+u);u+=n[f].attributes.position.count}c.setIndex(h)}for(const u in r){const h=Rp(r[u]);if(!h)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+u+" attribute."),null;c.setAttribute(u,h)}for(const u in a){const h=a[u][0].length;if(h===0)break;c.morphAttributes=c.morphAttributes||{},c.morphAttributes[u]=[];for(let f=0;f<h;++f){const d=[];for(let v=0;v<a[u].length;++v)d.push(a[u][v][f]);const p=Rp(d);if(!p)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+u+" morphAttribute."),null;c.morphAttributes[u].push(p)}}return c}function Rp(n){let t,e,i,s=-1,r=0;for(let l=0;l<n.length;++l){const u=n[l];if(t===void 0&&(t=u.array.constructor),t!==u.array.constructor)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.array must be of consistent array types across matching attributes."),null;if(e===void 0&&(e=u.itemSize),e!==u.itemSize)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.itemSize must be consistent across matching attributes."),null;if(i===void 0&&(i=u.normalized),i!==u.normalized)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.normalized must be consistent across matching attributes."),null;if(s===-1&&(s=u.gpuType),s!==u.gpuType)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.gpuType must be consistent across matching attributes."),null;r+=u.count*e}const a=new t(r),o=new qt(a,e,i);let c=0;for(let l=0;l<n.length;++l){const u=n[l];if(u.isInterleavedBufferAttribute){const h=c/e;for(let f=0,d=u.count;f<d;f++)for(let p=0;p<e;p++){const v=u.getComponent(f,p);o.setComponent(f+h,p,v)}}else a.set(u.array,c);c+=u.count*e}return s!==void 0&&(o.gpuType=s),o}const SS=-1.05,ES=.72,Cp=.07;function Nc(n,t,e,i={}){const s=new de;s.name=n;const r=t*(1+(i.gap??.08)),a=new nt(new Xt(r,28,10,0,Math.PI*2,0,Math.PI/2),e),o=new nt(new Xt(r,28,10,0,Math.PI*2,Math.PI/2,Math.PI/2),e);return a.name=n+"-up",o.name=n+"-lo",s.add(a,o),s.rotation.z=i.tilt??0,s.userData.open=i.open??1,_o(s,0,0,0),s}function _o(n,t,e,i){const s=n.children[0],r=n.children[1];if(!s||!r)return;const a=n.userData.open??1,o=Math.min(1,Math.max(0,t)),c=SS*a-.3*i,l=(ES-.45*e)*a;s.rotation.x=c+(Cp-c)*o,r.rotation.x=l+(-Cp-l)*o}function vd(n,t,e=.4){let i=n.userData.lookRest;i||(n.userData.lookRest=i=n.rotation.clone());const s=t?.lookX??0,r=t?.lookY??0;n.rotation.set(i.x-r*e*.67,i.y+s*e,i.z)}const O=(n,t,e)=>{const i=Math.max(e-Math.abs(n-t),0)/e;return Math.min(n,t)-i*i*e*.25};function xe(n,t,e,i,s,r,a){const o=n-i,c=t-s,l=e-r;return Math.sqrt(o*o+c*c+l*l)-a}function K(n,t,e,i,s,r,a,o,c,l,u){const h=a-i,f=o-s,d=c-r,p=n-i,v=t-s,g=e-r,m=Math.max(0,Math.min(1,(p*h+v*f+g*d)/(h*h+f*f+d*d))),M=p-h*m,x=v-f*m,_=g-d*m;return Math.sqrt(M*M+x*x+_*_)-(l+(u-l)*m)}function lt(n,t,e,i,s,r,a,o,c){const l=(n-i)/a,u=(t-s)/o,h=(e-r)/c,f=Math.sqrt(l*l+u*u+h*h),d=Math.sqrt(l*l/a+u*u/o+h*h/c);return d>0?f*(f-1)/d:-Math.min(a,o,c)}const v2=[{name:"pelvis",a:[0,9.6,0],b:[0,10.6,0],parent:null},{name:"spine1",a:[0,10.6,0],b:[0,12.4,.1],parent:"pelvis"},{name:"spine2",a:[0,12.4,.1],b:[0,15,.1],parent:"spine1"},{name:"neck",a:[0,15,.1],b:[0,15.9,.15],parent:"spine2"},{name:"head",a:[0,15.9,.15],b:[0,18.4,.3],parent:"neck"},{name:"jaw",a:[0,16.5,-.3],b:[0,16,1.25],parent:"head",reach:0},{name:"tail1",a:[0,10.4,-1],b:[0,9.6,-1.1],parent:"pelvis",reach:0},{name:"tail2",a:[0,9.6,-1.1],b:[0,8.8,-1.2],parent:"tail1",reach:0},{name:"tail3",a:[0,8.8,-1.2],b:[0,8,-1.3],parent:"tail2",reach:0},{name:"tail4",a:[0,8,-1.3],b:[0,7.2,-1.4],parent:"tail3",reach:0},{name:"thighL",a:[1.1,9.6,0],b:[1.2,5.3,.2],parent:"pelvis"},{name:"shinL",a:[1.2,5.3,.2],b:[1.2,1.1,-.1],parent:"thighL"},{name:"footL",a:[1.2,1.1,-.1],b:[1.2,.35,1.4],parent:"shinL"},{name:"thighR",a:[-1.1,9.6,0],b:[-1.2,5.3,.2],parent:"pelvis"},{name:"shinR",a:[-1.2,5.3,.2],b:[-1.2,1.1,-.1],parent:"thighR"},{name:"footR",a:[-1.2,1.1,-.1],b:[-1.2,.35,1.4],parent:"shinR"},{name:"armL",a:[2.4,14.6,0],b:[2.72,11.9,-.05],parent:"spine2"},{name:"forearmL",a:[2.72,11.9,-.05],b:[2.85,9.45,.4],parent:"armL"},{name:"armR",a:[-2.4,14.6,0],b:[-2.72,11.9,-.05],parent:"spine2"},{name:"forearmR",a:[-2.72,11.9,-.05],b:[-2.85,9.45,.4],parent:"armR"}],yc=n=>new C(n[0],n[1],n[2]);function x2(n,t){const e=yc(t).sub(yc(n)).normalize(),i=new C(1,0,0).addScaledVector(e,-e.x);i.lengthSq()<1e-6&&i.set(0,0,1),i.normalize();const s=new C().crossVectors(i,e);return new se().makeBasis(i,e,s).setPosition(n[0],n[1],n[2])}const _s=(n,t,e,i,s)=>Ws(n,t,e,i,s,6,5,2);function Ws(n,t,e,i,s,r=12,a=14,o=4){const c=yc(t).distanceTo(yc(n)),l=[];for(let h=0;h<=o;h++){const f=-Math.PI/2+h/o*(Math.PI/2);l.push(new ht(Math.max(.001,e*Math.cos(f)),e*.75*Math.sin(f)))}const u=Math.min(.2,1.3*Math.max(e,s)/c);for(let h=1;h<a;h++){const f=h/a,d=i+(e-i)*Math.exp(-((f/u)**2))+(s-i)*Math.exp(-(((1-f)/u)**2));l.push(new ht(d,f*c))}for(let h=0;h<=o;h++){const f=h/o*(Math.PI/2);l.push(new ht(Math.max(.001,s*Math.cos(f)),c+s*.75*Math.sin(f)))}return new zi(l,r).applyMatrix4(x2(n,t))}function We(n,t,e=[1,1,1],i=12){return new Xt(t,i,Math.max(6,Math.round(i*.7))).scale(e[0],e[1],e[2]).translate(n[0],n[1],n[2])}function TS(n,t,e=24,i=8){return new Ps(new Mi(n.map(yc)),e,t,i,!1)}function pf(n,t,e=24,i=8){return[TS(n,t,e,i),We(n[0],t,[1,1,1],i),We(n[n.length-1],t,[1,1,1],i)]}function Ei(n){const t=zn(n.map(e=>e.index?e:e.toNonIndexed()),!1);for(const e of n)e.dispose();return t}function rn(n,t,e,i,s=6e4){const r=w=>(t.max[w]-t.min[w])*e/(e-7),a=w=>t.min[w]-2.5*r(w)/e,o=a(0)+r(0)/2,c=a(1)+r(1)/2,l=a(2)+r(2)/2,u=r(0)/2,h=r(1)/2,f=r(2)/2,d=new p2(e,new cs,!1,!1,s);d.isolation=50;const p=d.field,v=e,g=40;for(let w=0;w<v;w++){const y=l+(2*w/v-1)*f;for(let E=0;E<v;E++){const R=c+(2*E/v-1)*h;for(let L=0;L<v;L++){const I=o+(2*L/v-1)*u;p[w*v*v+E*v+L]=Math.max(0,Math.min(100,50-n(I,R,y)*g))}}}d.update();const m=d.count,M=d.positionArray,x=d.normalArray,_=new Float32Array(m*3),b=new Float32Array(m*3),S=i?new Float32Array(m*3):null,T=new gt;for(let w=0;w<m;w++){const y=o+M[w*3]*u,E=c+M[w*3+1]*h,R=l+M[w*3+2]*f;_[w*3]=y,_[w*3+1]=E,_[w*3+2]=R;let L=x[w*3]/u,I=x[w*3+1]/h,N=x[w*3+2]/f;const B=Math.hypot(L,I,N)||1;L/=B,I/=B,N/=B,b[w*3]=L,b[w*3+1]=I,b[w*3+2]=N,S&&(T.setRGB(1,1,1),i(y,E,R,T),S[w*3]=T.r,S[w*3+1]=T.g,S[w*3+2]=T.b)}d.geometry.dispose();const A=new Me;return A.setAttribute("position",new qt(_,3)),A.setAttribute("normal",new qt(b,3)),S&&A.setAttribute("color",new qt(S,3)),A.computeBoundingSphere(),A}const Oo=(n,t,e)=>-O(-n,-t,e),Ja=[.43,17.02,1.06],Ka=[.43,16.99,.8];function M2(n,t,e,i,s){const r=Math.abs(n),o=e-i,c=s,l=Math.hypot(o,c),u=(r*o+(t-e)*c)/l;return Math.max(u,i-t)}function AS(n,t,e){const i=Math.abs(n);let s=lt(n,t,e,0,17.45,-.12,1.1,1.13,1.32);s=O(s,lt(n,t,e,0,16.8,-.35,.98,.62,.95),.3),s=O(s,lt(n,t,e,0,16.68,.58,.8,.74,.72),.35),s=O(s,lt(i,t,e,.78,16.86,.55,.33,.3,.48),.22),s=O(s,K(i,t,e,.86,16.8,.35,.98,16.68,-.42,.15,.13),.15),s=O(s,K(i,t,e,.12,17.32,1.12,.78,17.36,.95,.17,.15),.2),s=Oo(s,-lt(i,t,e,1.32,16.95,.05,.38,.5,.55),.18),s=Oo(s,-lt(i,t,e,Ja[0],Ja[1],Ja[2],.36,.34,.5),.07);const r=Math.min(M2(n,t,16.86,16.42,.19),Math.hypot(i-.08,t-16.47)-.11);return s=Oo(s,-Math.max(r,.8-e),.04),s=Oo(s,16.08-t,.1),s=Oo(s,-lt(i,t,e,.8,16.25,.62,.22,.3,.35),.12),s}function RS(n,t,e,i){const s=Math.abs(n),r=lt(s,t,e,Ja[0],Ja[1],Ja[2],.42,.4,.56),a=Math.max(Math.min(M2(n,t,16.86,16.42,.19),Math.hypot(s-.08,t-16.47)-.11),.8-e)-.06,c=Math.max(0,Math.min(1,-Math.min(r,a)/.05))*(.75+.25*Math.max(0,Math.min(1,(1.2-e)/.4)));i.copy(US).lerp(FS,c),c===0&&i.multiplyScalar(.94+.06*Math.max(0,Math.min(1,(t-16.3)/1.2)))}function CS(n,t,e,i,s,r,a){const o=s-e,c=r-i,l=Math.max(0,Math.min(1,((n-e)*o+(t-i)*c)/(o*o+c*c)));return Math.hypot(n-e-o*l,t-i-c*l)-a}function LS(n,t,e){const i=Math.abs(n);let s=K(i,t,e,0,15.62,1,.5,15.66,.66,.17,.17);return s=O(s,K(i,t,e,.5,15.66,.66,.78,15.74,-.12,.17,.16),.1),s=O(s,Math.max(CS(t,e,15.74,-.14,16.4,-.3,.2),Math.abs(i-.8)-.07),.08),s=O(s,lt(i,t,e,.82,16.45,-.3,.15,.11,.13),.06),s=O(s,lt(n,t,e,0,15.6,1,.33,.21,.17),.1),s=O(s,K(i,t,e,0,15.8,1.02,.52,15.8,.62,.12,.12),.08),s}function PS(n,t,e){const i=Math.abs(n),s=Math.abs(Math.hypot(i-.25,t-10.95,e-.75)-1.4)-.09;let r=Math.max(s,lt(i,t,e,1.2,10.5,-.18,.78,.7,.85));return r=O(r,K(i,t,e,.6,11,-.45,1.55,11.05,.2,.1,.1),.12),r=O(r,lt(n,t,e,0,9.95,-.78,.48,.72,.22),.15),r=O(r,K(i,t,e,.38,10.35,-.72,.85,10.4,-.45,.17,.15),.12),r=O(r,K(i,t,e,1.25,10.15,-.15,1,9.62,0,.24,.24),.15),r=O(r,xe(i,t,e,.92,9.6,0,.32),.12),r=Math.min(r,Math.hypot(Math.hypot(t-9.6,e)-.36,i-1)-.1),r=O(r,K(i,t,e,.95,9.48,.28,.12,9.3,.72,.15,.14),.1),r=O(r,K(i,t,e,.12,9.32,.72,.1,9.02,.66,.15,.15),.1),r=O(r,K(i,t,e,1,9.38,-.2,.78,8.92,-.05,.18,.17),.1),r=O(r,K(i,t,e,.78,8.92,-.05,.12,9.04,.62,.13,.12),.1),r}function I0(n,t,e,i,s){return[new Mn(t,t*1.08,e,12).translate(n[0],n[1],n[2]),new Ie(i,e*.42,.18).translate(n[0],n[1]+.02,n[2]-t*.6),new Ie(.15,e*.55,s).rotateX(.35).translate(n[0],n[1]-.05,n[2]-t-s*.42)]}function Lp(n){const t=[],e=[1.05,1.42,1.64,1.76,1.8,1.74,1.6],i=[.95,1.06,1.12,1.14,1.12,1.06,.96],s=[.32,.48,.62,.72,.8,.85,.85];for(let r=0;r<7;r++){const a=14.55-r*.4,o=e[r],c=.98,l=i[r],u=r>=5,h=[[.26,a+.04,-.78]],f=u?.74*Math.PI:Math.PI-Math.asin(Math.min(.9,.42/o));for(let d=0;d<=7;d++){const p=.14*Math.PI+d/7*(f-.14*Math.PI),v=-Math.cos(p)*(p<Math.PI/2?c:l),g=a-s[r]*Math.pow((p-.14*Math.PI)/(.86*Math.PI),1.3);h.push([o*Math.sin(p),g,v])}if(u){const d=h[h.length-1];h.push([.62,d[1]+.25+(r-5)*.2,1.02],[.26,12.62,1.06])}else h.push([.24,h[h.length-1][1]+.04,l*.98]);t.push(...pf(h.map(d=>[d[0]*n,d[1],d[2]]),r===0?.13:.12,28,7))}return t}function IS(n,t){const e=x2(n,[n[0]+t[0],n[1]+t[1],n[2]+t[2]]),i=1.35,s=(h,f,d)=>{const p=new C(h*i,f*i,d*i).applyMatrix4(e);return[p.x,p.y,p.z]},r=[];for(const[h,f,d]of[[0,.1,.16],[0,.1,-.02],[0,.1,-.2],[.02,.3,.2],[.02,.3,0],[.02,.3,-.18]])r.push(We(s(h,f,d),.14,[1,1,1],8));const a=[[.21,1],[.07,1.08],[-.07,1],[-.2,.82]];for(const[h,f]of a){const d=s(.02,.4,h*.85),p=s(0,.4+.55*f,h),v=s(-.07,.4+.92*f,h*1.05),g=s(-.17,.4+1.15*f,h*1.08),m=s(-.28,.4+1.3*f,h*1.08);r.push(_s(d,p,.1,.075,.105),_s(p,v,.1,.07,.095),_s(v,g,.09,.065,.085),_s(g,m,.08,.06,.065))}const o=s(0,.25,.26),c=s(-.05,.6,.48),l=s(-.1,.88,.58),u=s(-.16,1.08,.62);return r.push(_s(o,c,.11,.085,.1),_s(c,l,.1,.075,.09),_s(l,u,.09,.065,.065)),r}function DS(){const n=[];n.push(We([1.2,.88,0],.27)),n.push(We([1.24,.44,-.3],1,[.27,.32,.44]));for(const[r,a,o]of[[.98,.62,.36],[1.22,.62,.34],[1.46,.55,.22],[1.08,.55,.6],[1.32,.52,.56]])n.push(We([r,a,o],.17,[1,1,1],8));const t=[.95,1.12,1.28,1.42,1.55],e=[.84,1.08,1.3,1.5,1.68],i=[.1,.075,.07,.065,.065],s=[.42,.34,.3,.27,.24];for(let r=0;r<5;r++){const a=[t[r],.5,.62],o=[e[r],.22,1.38-r*.05];n.push(_s(a,o,i[r]*1.3,i[r],i[r]*1.35));const c=[o[0]+(r===0?-.02:.02*r),.15,o[2]+s[r]];n.push(_s(o,c,i[r]*1.05,i[r]*.8,i[r]*.85))}return n}function _2(n,t=2.2){const e=new cs({color:n,transparent:!0,opacity:1,blending:Xr,depthWrite:!1,toneMapped:!1});return e.userData.keepBlend=!0,e.onBeforeCompile=i=>{i.vertexShader=i.vertexShader.replace("#include <common>",`#include <common>
 varying vec3 vGlowN; varying vec3 vGlowV;`).replace("#include <project_vertex>",`#include <project_vertex>
 vGlowN = normalize(normalMatrix * normal); vGlowV = -mvPosition.xyz;`),i.fragmentShader=i.fragmentShader.replace("#include <common>",`#include <common>
 varying vec3 vGlowN; varying vec3 vGlowV;`).replace("#include <color_fragment>",`#include <color_fragment>
 diffuseColor.a *= pow(clamp(dot(normalize(vGlowN), normalize(vGlowV)), 0.0, 1.0), ${t.toFixed(2)});`)},e.customProgramCacheKey=()=>`skelly-glow-v1-${t.toFixed(2)}`,e}const w2=15656396,US=new gt(w2),FS=new gt(1905164),mf=5832490;function NS(n){const t=n.std({color:w2,roughness:.42,metalness:0,emissive:2894368,emissiveIntensity:1}),e=n.std({color:16777215,vertexColors:!0,roughness:.42,metalness:0,emissive:2894368,emissiveIntensity:1}),i=n.std({color:1182214,roughness:.9}),s=(v,g,m=t)=>{for(const M of["L","R"]){const x=new nt(v,m);x.name=`skelly-${g}${M}`,M==="R"&&(x.scale.x=-1),n.at(x,g+M,0,0,0)}},r=(v,g,m=t,M=`skelly-${g}`)=>{const x=new nt(v,m);return x.name=M,n.at(x,g,0,0,0),x},a=rn(AS,{min:[-1.25,15.95,-1.5],max:[1.25,18.65,1.4]},52,RS,4e4);r(a,"head",e);const o=new Xt(.1,14,10),c=new Xt(.042,10,8),l=new Xt(.1,16,10),u=n.std({color:0,emissive:15925222,emissiveIntensity:1.4,roughness:1});for(const v of["L","R"]){const g=new de;g.name=`skelly-eye${v}`;const m=new nt(o,new je({color:0,emissive:mf,emissiveIntensity:1,roughness:1}));m.name=`skelly-pupil${v}`,m.scale.set(1,1.1,.7);const M=new nt(c,u);M.position.z=.075,m.add(M);const x=new nt(l,_2(mf,4));x.name=`skelly-halo${v}`,x.scale.set(2.1,2,1.2),x.renderOrder=2,g.add(m,x),n.at(g,"head",v==="L"?Ka[0]:-.43,Ka[1],Ka[2]),g.traverse(_=>{_.castShadow=!1,_.receiveShadow=!1})}const h=(v,g,m,M,x)=>{const _=[];for(let b=0;b<10;b++){const S=-1.05+b/9*2.1;_.push(new Mc(.075,g,2,7).scale(1,1,.75).rotateY(S).translate(m*Math.sin(S),v,x+M*Math.cos(S)))}return _};r(Ei(h(16.15,.17,.6,.78,.47)),"head",t,"skelly-teeth"),r(Ei([We([0,15.98,.8],1,[.58,.24,.4])]),"head",i,"skelly-mouth"),r(rn(LS,{min:[-1,15.36,-.55],max:[1,16.6,1.22]},36,void 0,12e3),"jaw"),r(Ei(h(15.88,.15,.56,.74,.47)),"jaw",t,"skelly-lowerteeth"),r(Ei([0,1,2,3].flatMap(v=>I0([0,15.12+v*.25,-.22],.25,.19,.72,.3))),"neck"),r(Ei([...[0,1,2,3,4,5].flatMap(v=>I0([0,12.55+v*.4,-.82],.25,.26,.6,.28)),...Lp(1),...Lp(-1),We([0,13.55,1.08],1,[.26,1.05,.12],12),We([0,14.42,1],1,[.36,.32,.13],10),...pf([[.22,14.72,1.02],[.85,14.86,.9],[1.55,14.98,.42],[2.18,15.02,.02]],.13,20,8),...pf([[-.22,14.72,1.02],[-.85,14.86,.9],[-1.55,14.98,.42],[-2.18,15.02,.02]],.13,20,8),We([1.25,13.95,-1],1,[.62,.85,.09],12),We([-1.25,13.95,-1],1,[.62,.85,.09],12)]),"spine2"),r(Ei([0,1,2,3].flatMap(v=>I0([0,10.85+v*.42,-.42],.36,.3,1.15,.45))),"spine1"),r(rn(PS,{min:[-1.75,8.72,-1.05],max:[1.75,11.2,1.05]},40,void 0,24e3),"pelvis"),s(Ei([We([2.33,14.56,-.03],.36),Ws([2.4,14.45,0],[2.71,12.08,-.05],.3,.2,.28),We([2.53,11.98,-.05],.21,[1,.9,1],10),We([2.88,11.98,-.06],.2,[1,.9,1],10)]),"arm");const f=[2.72,11.9,-.05],d=[2.85,9.45,.4],p=[d[0]-f[0],d[1]-f[1],d[2]-f[2]];s(Ei([We([2.74,11.98,-.25],.21,[1,1.1,1],10),Ws([2.76,11.85,-.2],[2.86,9.62,.22],.19,.13,.16,10),Ws([2.66,11.72,.12],[2.86,9.62,.54],.16,.13,.21,10),...IS([d[0],d[1]-.05,d[2]],p)]),"forearm"),s(Ei([We([1.12,9.62,.02],.36),Ws([1.12,9.6,0],[1.55,9.24,-.03],.2,.18,.2,10),We([1.64,9.3,-.08],.3,[1,1.2,1]),Ws([1.56,9.22,0],[1.22,5.62,.18],.28,.21,.34),We([1,5.5,.12],.29),We([1.42,5.5,.12],.29)]),"thigh"),s(Ei([Ws([1.19,5.12,.18],[1.16,1.28,-.08],.36,.18,.24),We([1,1.16,-.05],.17,[1,1.2,1],10),Ws([1.52,4.95,.02],[1.47,1.3,-.16],.16,.09,.17,10),We([1.2,5.36,.62],.27,[1,1.1,.55])]),"shin"),s(Ei(DS()),"foot")}const Pp=new WeakMap,Ip=.015,Dp=.55,kS=.22,OS=.12,BS=.11,D0=v2.find(n=>n.name==="head").a,Up=new C(1,0,0),HS=new C(0,1,0),Fp=new ie,zS=new ie,VS=new gt(mf),GS=new gt(16726546),U0=new gt,Bo=n=>n<0?0:n>1?1:n,WS={id:"skeleton",name:"Skelly",blurb:"Bones, a grin, and green embers for eyes",segs:v2,dress:NS,fit:{size:1.04,limb:.3},face:{jaw:Dp,eyes:[[.43,17.02,1.3,.36],[-.43,17.02,1.3,.36]],breath:{colors:[5832490,11861894,15269846,2817952]}},tick(n,t,e){let i=Pp.get(n);if(!i){const l=[];for(const u of["L","R"]){const h=n.getObjectByName(`skelly-eye${u}`),f=n.getObjectByName(`skelly-pupil${u}`),d=n.getObjectByName(`skelly-halo${u}`);h&&f&&d&&l.push({g:h,pupil:f,halo:d,pm:f.material,hm:d.material,sx:u==="L"?1:-1})}i={jaw:n.getObjectByName("jaw")??null,eyes:l},Pp.set(n,i)}const s=e??null,r=(.95+.3*Math.sin(t*2.1)+.1*Math.sin(t*7.3+1.1))*(1+.45*(s?.jaw??0)),a=(t+1.3)%6.1<.16?1:0,o=s?s.lookX:.5*Math.sin(t*.31+.8*Math.sin(t*.13)),c=s?s.lookY:.2*Math.sin(t*.23+1);for(const l of i.eyes){const u=l.sx>0,h=Bo(s?u?s.blinkL:s.blinkR:a),f=s?u?s.squintL:s.squintR:0,d=s?Bo(Math.max(u?s.wideL:s.wideR,s.browUp,.8*(u?s.browOuterL:s.browOuterR))):0,p=s?Bo(Math.max(u?s.browDownL:s.browDownR,.6*s.sneer)):0,v=s?Bo(s.frown):0,g=s?Bo(Math.max(u?s.smileL:s.smileR,s.smile)):0,m=1-h,M=1+.5*d-.1*p,x=1.1*M*m*(1-.5*f)*(1-.55*p)*(1-.3*g)*(1-.3*v);l.pupil.scale.set(M*(1+.35*h+.15*f+.25*p),Math.max(.001,x),.7*M),l.g.position.set(l.sx*Ka[0]-D0[0]+OS*o,Ka[1]-D0[1]+BS*c-.03*p+.025*g-.02*v,Ka[2]-D0[2]),l.g.rotation.z=l.sx*(.5*p-.4*v),U0.copy(VS).lerp(GS,p),l.pm.emissive.copy(U0),l.pm.emissiveIntensity=r*(.5+.5*m)*(1+.35*d+.3*p),l.halo.scale.set(2.1*(1+.15*d),2*(.4+.6*m)*(1+.15*d)*(1-.3*p),1.2),l.hm.color.copy(U0).multiplyScalar(.2*r*m*(1+.9*d+.4*p))}if(i.jaw)if(s)Fp.setFromAxisAngle(HS,kS*s.jawSide),i.jaw.quaternion.copy(Fp).multiply(zS.setFromAxisAngle(Up,Ip+Dp*s.jaw));else{const l=t%4.6;i.jaw.quaternion.setFromAxisAngle(Up,l<.75?.05+.07*Math.abs(Math.sin(l*25)):Ip)}}},Fi=(n,t,e)=>{const i=Math.max(0,Math.min(1,(e-n)/(t-n)));return i*i*(3-2*i)},Fh=(n,t,e)=>-O(-n,-t,e);function b2(n,t){const e=n.bones.get("pelvis").parent;if(!e?.isSkinnedMesh)return;const i=new Set([e.geometry]);for(const c of e.children)c.isSkinnedMesh&&c.userData.h!==void 0&&i.add(c.geometry);const s=n.segs.findIndex(c=>c.name==="head"),r=t.map(c=>n.segs.findIndex(l=>l.name===c.bone)),a=[0,0],o=[0,0];for(const c of i){const l=c.attributes.position,u=c.attributes.skinIndex,h=c.attributes.skinWeight;for(let f=0;f<l.count;f++){const d=u.getX(f),p=u.getY(f)===d,v=p?0:u.getY(f);let g=h.getX(f)+(p?h.getY(f):0),m=p?0:h.getY(f);const M=(d===s?g:0)+(v===s?m:0);if(M<1e-4)continue;const x=l.getX(f),_=l.getY(f),b=l.getZ(f);let S=0,T=M;for(let w=0;w<t.length&&S<2;w++){const y=t[w].w(x,_,b);y<.002||(a[S]=T*Math.min(1,y),o[S]=r[w],T-=a[S],S++)}if(!S)continue;const A=T/M;d===s&&(g*=A),v===s&&(m*=A),u.setXYZW(f,d,v,o[0],S>1?o[1]:0),h.setXYZW(f,g,m,a[0],S>1?a[1]:0)}u.needsUpdate=!0,h.needsUpdate=!0}}function y2(n,t,e,i,s,r,a,o,c,l){const u=n.bones.get("pelvis").parent;if(!u?.isSkinnedMesh)return null;const h=rn(i,s,r,a,24e3),f=h.attributes.position.count,d=h.attributes.position,p=new Uint16Array(f*4),v=new Float32Array(f*4),g=new Float32Array(f),m=n.segs.findIndex(x=>x.name===e);for(let x=0;x<f;x++)p[x*4]=m,v[x*4]=1,g[x]=l(d.getX(x),d.getY(x),d.getZ(x));h.setAttribute("skinIndex",new qt(p,4)),h.setAttribute("skinWeight",new qt(v,4)),h.setAttribute("aFur",new qt(g,1));const M=new Fc(h,hh(!!o));return M.name=t,M.castShadow=!0,M.receiveShadow=!0,M.frustumCulled=!1,u.add(M),M.bind(u.skeleton,u.bindMatrix),o&&c>0&&g2(M,h,o,c),M}function S2(n,t,e,i){const s=n.bones.get("pelvis").parent;if(!s?.isSkinnedMesh)return null;const r=n.segs.findIndex(g=>g.name==="head"),a=n.segs.findIndex(g=>g.name==="jaw"),o=4,c=e.length,l=[],u=[],h=[],f=[],d=[];for(const g of[1,-1]){const m=l.length/3;for(const M of e)for(let x=0;x<=o;x++)l.push(g*M[0],M[1],M[2]),u.push(g,0,0),h.push(r,a,0,0),f.push(1-x/o,x/o,0,0);for(let M=0;M+1<c;M++)for(let x=0;x<o;x++){const _=m+M*(o+1)+x,b=_+o+1;d.push(_,b,_+1,b,b+1,_+1)}}const p=new Me;p.setAttribute("position",new ae(l,3)),p.setAttribute("normal",new ae(u,3)),p.setAttribute("skinIndex",new ad(h,4)),p.setAttribute("skinWeight",new ae(f,4)),p.setIndex(d);const v=new Fc(p,n.std({color:i,roughness:.8,side:Te}));return v.name=t,v.frustumCulled=!1,v.receiveShadow=!0,s.add(v),v.bind(s.skeleton,s.bindMatrix),v}function E2(n,t){for(let e=0;e<2;e++){const i=n[e],s=e===0;if(!i)continue;const r=Math.max(s?t.squintL:t.squintR,.75*(s?t.smileL:t.smileR));_o(i,Math.max(s?t.blinkL:t.blinkR,.3*r),r,s?t.wideL:t.wideR)}}const T2=n=>{const t=(n+1.3)%4.6;return t<.16?Math.sin(t/.16*Math.PI):0},hn=16,ir=3.75,xd=.66,Md=(n,t,e)=>Math.max(t-hn,ir-e,n-xd),oc=[.8,17.85,3.05],cc=[1.05,19.4,2.7],In=[.6,17.45,4.8],Ci=[.38,16.15,6.55],Sl=n=>[-n[0],n[1],n[2]],A2=[{name:"pelvis",a:[0,9.4,-.6],b:[0,10.4,0],parent:null},{name:"spine1",a:[0,10.4,0],b:[0,12.6,.8],parent:"pelvis"},{name:"spine2",a:[0,12.6,.8],b:[0,14.8,1.9],parent:"spine1"},{name:"neck",a:[0,14.8,1.9],b:[0,16,3],parent:"spine2",reach:1.6},{name:"head",a:[0,16,3],b:[0,16.6,5.8],parent:"neck"},{name:"jaw",a:[0,hn,ir],b:[0,hn-.15,6.2],parent:"head",reach:0},{name:"tail1",a:[0,9.2,-1.6],b:[0,8.2,-3.6],parent:"pelvis",reach:1.8},{name:"tail2",a:[0,8.2,-3.6],b:[0,6.8,-5.2],parent:"tail1",reach:1.8},{name:"tail3",a:[0,6.8,-5.2],b:[0,5.3,-6.4],parent:"tail2",reach:1.6},{name:"tail4",a:[0,5.3,-6.4],b:[0,4,-7.2],parent:"tail3",reach:1.4},{name:"thighL",a:[1.6,9.2,-.3],b:[1.9,6,1.3],parent:"pelvis"},{name:"shinL",a:[1.9,6,1.3],b:[1.9,2.8,-.9],parent:"thighL"},{name:"footL",a:[1.9,2.8,-.9],b:[1.9,.4,1],parent:"shinL"},{name:"thighR",a:[-1.6,9.2,-.3],b:[-1.9,6,1.3],parent:"pelvis"},{name:"shinR",a:[-1.9,6,1.3],b:[-1.9,2.8,-.9],parent:"thighR"},{name:"footR",a:[-1.9,2.8,-.9],b:[-1.9,.4,1],parent:"shinR"},{name:"armL",a:[2.7,14.3,1.6],b:[3.3,11.2,2],parent:"spine2"},{name:"forearmL",a:[3.3,11.2,2],b:[3.2,8.2,3.2],parent:"armL"},{name:"armR",a:[-2.7,14.3,1.6],b:[-3.3,11.2,2],parent:"spine2"},{name:"forearmR",a:[-3.3,11.2,2],b:[-3.2,8.2,3.2],parent:"armR"},{name:"earL",a:oc,b:cc,parent:"head",reach:0},{name:"earR",a:Sl(oc),b:Sl(cc),parent:"head",reach:0},{name:"browL",a:In,b:[In[0]+.45,In[1],In[2]-.35],parent:"head",reach:0},{name:"browR",a:Sl(In),b:[-In[0]-.45,In[1],In[2]-.35],parent:"head",reach:0},{name:"lipL",a:Ci,b:[Ci[0]+.08,Ci[1]-.1,Ci[2]-1.9],parent:"head",reach:0},{name:"lipR",a:Sl(Ci),b:[-Ci[0]-.08,Ci[1]-.1,Ci[2]-1.9],parent:"head",reach:0}],XS={min:[-5,-.5,-8.6],max:[5,20.4,8.6]},on=[.62,17.05,4.75],Np=[0,16.35,7.35];function Nh(n,t,e,i){let s=lt(n,e,i,0,16.9,3.6,1.35,1.25,1.55);return s=O(s,K(n,e,i,0,16.7,4.6,0,16.3,7.1,.82,.45),.5),s=O(s,lt(t,e,i,.36,16,5.4,.27,.24,1.55),.3),s=O(s,lt(t,e,i,1.15,16.5,3.6,.55,.75,.9),.4),s=O(s,K(t,e,i,.22,17.4,4.95,.95,17.5,4.45,.2,.17),.22),s=O(s,K(t,e,i,.75,17.8,3.1,1.05,19.4,2.7,.5,.06),.3),Math.max(s,-xe(t,e,i,on[0],on[1],on[2]+.12,.3))}function $S(n,t,e){const i=Math.abs(n),s=Md(i,t,e);if(s>.08||s<-.6)return!1;const r=Nh(n,i,t,e);return-s>r-.02&&r<-.06}function qS(n,t,e){const i=Math.abs(n);let s=Fh(Nh(n,i,t,e),Md(i,t,e),.06);return s=O(s,K(n,t,e,0,15.8,4.4,0,15.75,6.7,.55,.32),.25),Math.max(s,t-hn,ir-.3-e)}const YS={min:[-.9,15,3.3],max:[.9,hn+.05,7.3]};function jS(n,t,e,i=0){const s=Math.abs(n);let r=lt(n,t,e,0,13.4,1.4,2.6,2.5,2.1);r=O(r,lt(n,t,e,0,11.2,.4,1.7,1.6,1.4),.9),r=O(r,lt(n,t,e,0,9.8,-.4,2,1.2,1.5),.7),r=O(r,lt(n,t,e,0,15.1,1.6,2.3,1.5,2),.8),r=O(r,xe(s,t,e,2.5,14.2,1.5,1.05),.7),r=O(r,Fh(Nh(n,s,t,e),-Md(s,t,e),.08),.6),r=O(r,K(s,t,e,2.7,14.3,1.6,3.3,11.2,2,.9,.72),.5),r=O(r,K(s,t,e,3.3,11.2,2,3.2,8.4,3.1,.78,.55),.35),r=O(r,lt(s,t,e,3.2,7.9,3.35,.55,.75,.55),.3),r=O(r,K(s,t,e,1.6,9.2,-.3,1.9,6,1.3,1.25,.85),.6),r=O(r,K(s,t,e,1.9,6,1.3,1.9,2.8,-.9,.75,.48),.4),r=O(r,K(s,t,e,1.9,2.8,-.9,1.9,.5,.9,.5,.42),.3);const a=[[0,9.2,-1.6,.6],[0,8.2,-3.6,1],[0,6.8,-5.2,1.15],[0,5.3,-6.4,.9],[0,4,-7.2,.35]];for(let o=0;o+1<a.length;o++){const c=a[o],l=a[o+1];r=O(r,K(n,t,e,c[0],c[1],c[2],l[0],l[1],l[2],c[3],l[3]),.5)}r-=i;for(const o of[-1.5,-.5,.5,1.5])r=O(r,K(s,t,e,3.2+o*.17,7.4,3.5,3.2+o*.22,6.5,3.85,.17,.03),.1);for(const o of[-1,0,1])r=O(r,K(s,t,e,1.9+o*.28,.4,1.2,1.9+o*.34,.1,1.85,.2,.03),.1);return r}const Gl=[7827562,12103584,3420204,1183760,4856864];function _d(n,t,e){const i=Math.abs(n);return Math.hypot(n,t-Np[1],e-Np[2])<.45?3:$S(n,t,e)?4:t>hn-.08&&t<hn+.1&&e>ir+.85&&e<7.4||t<7.6&&t>6.2&&e>3.4&&i>2.6||t<.5&&e>1.2?3:t>17.4&&i>.6&&e<3.2||e<-6.3?2:t>15.4&&t<16.4&&e>4.4||t>14.6&&t<15.8&&e>2.8&&i<1.2||e>2.2&&t>10.2&&t<15&&i<1.8?1:t>12.4&&e<.8&&i<1.9&&t>12.4+.5*i?2:0}function R2(n,t,e){const i=Math.abs(n);return _d(n,t,e)>=3||Math.abs(t-hn)<.16&&e>ir-.2&&i<xd+.12||Math.hypot(i-on[0],t-on[1],e-on[2])<.65?0:e>4.6&&t>15.2?.35:t>17.6?.4:t>14&&t<16.4&&e<3.4||e<-1.4&&t<9.6?1.4:t<3?.45:1}const kp=n=>Fi(-.12,.12,n),ZS=[1,-1].flatMap(n=>{const t=n>0?"L":"R",e=l=>n>0?kp(l):1-kp(l),i=[n*oc[0],oc[1],oc[2]],s=[n*cc[0],cc[1],cc[2]],r=s[0]-i[0],a=s[1]-i[1],o=s[2]-i[2],c=r*r+a*a+o*o;return[{bone:"ear"+t,w:(l,u,h)=>{const f=((l-i[0])*r+(u-i[1])*a+(h-i[2])*o)/c,d=K(l,u,h,i[0],i[1],i[2],s[0],s[1],s[2],.5,.06);return e(l)*Fi(.03,.3,f)*Fi(.6,.2,d)}},{bone:"brow"+t,w:(l,u,h)=>{const f=Math.hypot((n*l-In[0])/.6,(u-In[1])/.42,(h-In[2])/.65);return e(l)*(1-Fi(.4,1,f))}},{bone:"lip"+t,w:(l,u,h)=>{const f=Math.hypot((n*l-.42)/.42,(u-16.12)/.48,(h-5.85)/1.3);return e(l)*(1-Fi(.4,1,f))*Fi(hn-.3,hn-.05,u+.25)}}]});function JS(n,t,e,i){const s=t>hn-.05,r=s&&Nh(n,Math.abs(n),hn+.02,e)<-.15;i.setHex(r?Gl[4]:s?Gl[3]:Gl[_d(n,t,e)])}const KS=(n,t,e)=>t>hn-.08||Math.abs(n)>xd-.06?0:R2(n,t,e),QS={length:.8,density:7,tip:.22};function tE(n){b2(n,ZS);const t=n.std({color:16756768,emissive:16756768,emissiveIntensity:1.8,roughness:.3}),e=n.std({color:788486,roughness:.3}),i=n.std({color:5130308,roughness:.9});for(const[h,f]of[[1,"L"],[-1,"R"]]){const d=new de;d.name="howl-eye"+f,d.add(new nt(new Xt(.24,16,12),t));const p=new nt(new Xt(.1,10,8),e);p.position.z=.205,p.scale.set(.62,1.2,.4),d.add(p),n.at(d,"head",h*on[0],on[1],on[2]),n.at(Nc("howl-lid"+f,.24,i,{gap:.1,tilt:h*.3,open:.85}),"head",h*on[0],on[1],on[2])}y2(n,"howl-jaw","jaw",qS,YS,26,JS,QS,5,KS);const s=new Xt(1,18,10).scale(.3,.12,.95).translate(0,hn-.13,5.35);n.at(new nt(s,n.std({color:12079196,roughness:.45})),"jaw",0,0,0);const r=n.std({color:15788760,roughness:.35}),a=(h,f,d,p,v,g=.25)=>{const m=new ri(p,d,7);return v&&m.rotateX(Math.PI),m.translate(h,hn+(v?g-d/2:d/2-g),f)},o=[],c=[];for(const h of[1,-1]){o.push(a(h*.35,6.3,.85,.095,!0,.4),a(h*.38,5.6,.52,.065,!0,.36),a(h*.38,5.05,.48,.065,!0,.36)),c.push(a(h*.24,6.45,.55,.085,!1),a(h*.27,5.5,.3,.06,!1));for(const f of[.07,.19])o.push(a(h*f,6.95,.42,.045,!0,.3)),c.push(a(h*f,6.6,.34,.04,!1))}n.at(new nt(zn(o),r),"head",0,0,0),n.at(new nt(zn(c),r),"jaw",0,0,0);const l=[];for(let h=0;h<=8;h++){const f=ir+.05+h/8*2;l.push([.5-.08*(f-ir),hn,f])}S2(n,"howl-mouth",l,2757140);const u=new Xt(1,14,8).scale(.45,.3,.5).translate(0,hn-.32,ir+.55);n.at(new nt(u,n.std({color:1706764,roughness:.9})),"head",0,0,0)}const Op=new WeakMap,Qa=A2.find(n=>n.name==="head").a,F0=[In[0]-Qa[0],In[1]-Qa[1],In[2]-Qa[2]],N0=[Ci[0]-Qa[0],Ci[1]-Qa[1],Ci[2]-Qa[2]],eE=(n,t)=>{const e=(n+t)%7.3;return e<.35?.16*Math.sin(e/.35*Math.PI*2)*(1-e/.35):0};function nE(n,t,e){let i=Op.get(n);if(!i){const c=u=>n.getObjectByName(u)??null,l=u=>[c(u+"L"),c(u+"R")];i={eyes:l("howl-eye"),lids:l("howl-lid"),ears:l("ear"),brows:l("brow"),lips:l("lip")},Op.set(n,i)}const s=e??null;if(s)E2(i.lids,s);else{const c=T2(t);for(const l of i.lids)l&&_o(l,c,0,0)}for(const c of i.eyes)c&&vd(c,s,.5);const r=s?.browUp??0,a=s?.frown??0,o=s?.sneer??0;for(let c=0;c<2;c++){const l=c===0,u=l?1:-1,h=s?l?s.browOuterL:s.browOuterR:0,f=s?l?s.browDownL:s.browDownR:0,d=s?l?s.wideL:s.wideR:0,p=s?l?s.smileL:s.smileR:0,v=i.brows[c];v&&(v.position.set(u*F0[0],F0[1]+.26*(.55*r+.45*h)-.2*f,F0[2]+.05*f),v.rotation.z=u*(.3*(h-r)+.35*f));const g=i.ears[c];if(g){const M=Math.max(d,.8*r,h),x=Math.max(f,o,.8*a);g.rotation.set(.18*M-.75*x+eE(t,l?2.4:5),0,-u*(.35*x-.12*M))}const m=i.lips[c];m&&(m.position.set(u*(N0[0]+.06*o),N0[1]+.36*o+.08*p-.06*a,N0[2]-.14*p),m.rotation.x=.16*p-.1*a-.06*o)}}const Zr=2.1,Va=[1.95,6,.2],rs=[Zr,3.4,.55],Lr=[Zr,1,0],Bp=[Zr,.3,2],Yi=[2.9,11,.8],ii=[4.99,10.54,1.28],sr=[6.76,10.06,1.79],Dn=[[0,6.6,-2.6],[.5,4.6,-4.4],[1.6,2.4,-5.3],[3,1.1,-5.2],[4.5,.85,-4.1]],Hp=[1.15,1.45,1.4,1.2,.75],$t=[0,14.4,.6],uh=-1.25,Jr=.9,wd=.08,bd=.74,kc=(n,t)=>n-uh-wd*(t-Jr),C2=(n,t,e)=>Math.max(kc(t,e),Jr-e,n-bd),Os=[1.44,$t[1]+1.5,$t[2]-.66],Un=[1.1,$t[1]+1.1,$t[2]+1.5],Fn=[1.8,$t[1]-.66,$t[2]+.25],L2=[{name:"pelvis",a:[0,6,0],b:[0,7.6,0],parent:null},{name:"spine1",a:[0,7.6,0],b:[0,9.4,.1],parent:"pelvis"},{name:"spine2",a:[0,9.4,.1],b:[0,11.4,.1],parent:"spine1"},{name:"neck",a:[0,11.4,.1],b:[0,$t[1]-1.6,$t[2]-.25],parent:"spine2"},{name:"head",a:[0,$t[1]-1.6,$t[2]-.25],b:[0,$t[1]+1.6,$t[2]+.1],parent:"neck"},{name:"jaw",a:[0,$t[1]+uh,$t[2]+Jr],b:[0,$t[1]+uh+wd*2.1-.15,$t[2]+3],parent:"head",reach:0},{name:"tail1",a:Dn[0],b:Dn[1],parent:"pelvis"},{name:"tail2",a:Dn[1],b:Dn[2],parent:"tail1"},{name:"tail3",a:Dn[2],b:Dn[3],parent:"tail2"},{name:"tail4",a:Dn[3],b:Dn[4],parent:"tail3"},{name:"thighL",a:Va,b:rs,parent:"pelvis"},{name:"shinL",a:rs,b:Lr,parent:"thighL"},{name:"footL",a:Lr,b:Bp,parent:"shinL"},{name:"thighR",a:$n(Va),b:$n(rs),parent:"pelvis"},{name:"shinR",a:$n(rs),b:$n(Lr),parent:"thighR"},{name:"footR",a:$n(Lr),b:$n(Bp),parent:"shinR"},{name:"armL",a:Yi,b:ii,parent:"spine2"},{name:"forearmL",a:ii,b:sr,parent:"armL"},{name:"armR",a:$n(Yi),b:$n(ii),parent:"spine2"},{name:"forearmR",a:$n(ii),b:$n(sr),parent:"armR"},{name:"earL",a:Os,b:[Os[0],Os[1]+1.5,Os[2]],parent:"head",reach:0},{name:"earR",a:$n(Os),b:[-Os[0],Os[1]+1.5,Os[2]],parent:"head",reach:0},{name:"browL",a:Un,b:[Un[0]+.8,Un[1]-.15,Un[2]-.4],parent:"head",reach:0},{name:"browR",a:$n(Un),b:[-Un[0]-.8,Un[1]-.15,Un[2]-.4],parent:"head",reach:0},{name:"cheekL",a:Fn,b:[Fn[0]+1,Fn[1],Fn[2]],parent:"head",reach:0},{name:"cheekR",a:$n(Fn),b:[-Fn[0]-1,Fn[1],Fn[2]],parent:"head",reach:0}];function $n(n){return[-n[0],n[1],n[2]]}const iE={min:[-8.6,-.4,-7.2],max:[8.6,18.4,5.8]},cn=[.98,$t[1]+.33,$t[2]+1.97],Or=[0,$t[1]-.5,$t[2]+4.05],Oi=yd(P2(sr,ii)),k0=yd([-Oi[2],0,Oi[0]]);function P2(n,t){return[n[0]-t[0],n[1]-t[1],n[2]-t[2]]}function yd(n){const t=Math.hypot(n[0],n[1],n[2]);return[n[0]/t,n[1]/t,n[2]/t]}const wo=(n,t,e,i=0)=>[n[0]+Oi[0]*t+k0[0]*e,n[1]+Oi[1]*t+k0[1]*e+i,n[2]+Oi[2]*t+k0[2]*e],Di=wo(sr,.35,0),sE=wo(Di,1.3,0),I2=(n,t,e)=>(n-sr[0])*Oi[0]+(t-sr[1])*Oi[1]+(e-sr[2])*Oi[2],D2=[-.42,-.14,.14,.42].map(n=>[wo(Di,.35,n*1.1),wo(Di,1.15-Math.abs(n)*.5,n*1.35,-.12)]);D2.push([wo(Di,-.1,.45),wo(Di,.45,.95,-.1)]);const rE=[-.5,-.17,.17,.5].map(n=>[[Zr+n*1.1,.3,1.8],[Zr+n*1.3,.22,2.7-Math.abs(n)*.4]]),Bs=(n,t,e,i,s,r,a)=>K(n,t,e,i[0],i[1],i[2],s[0],s[1],s[2],r,a),ya=2.5;let zp=NaN,Vp=NaN,Gp=NaN;const Ti={body:0,head:0,arm:0,leg:0,tail:0,min:0,raw:0,cut:0};function Sd(n,t,e,i){let s=lt(n,e,i,0,0,0,2.38,2.05,2.21);return s=O(s,lt(t,e,i,1.8,-.66,.25,1.15,1.23,1.31),.66),s=O(s,K(n,e,i,0,-.25,1.48,0,-.57,3.6,1.11,.45),.5),s=O(s,lt(t,e,i,.3,-.86,2.75,.4,.3,.62),.3),s=O(s,lt(t,e,i,1.44,2.05,-.66,.78,1.03,.34),.29),Math.max(s,-xe(t,e,i,cn[0]+.05,cn[1]-$t[1],cn[2]-$t[2]+.2,.34))}const U2=n=>n.cut<.08&&-n.cut>n.raw-.02;function aE(n,t,e){const i=Math.abs(n),s=t-$t[1],r=e-$t[2];let a=Fh(Sd(n,i,s,r),C2(i,s,r),.06);return a=O(a,K(n,s,r,0,-1.07,1.15,0,-1.23,2.95,.78,.41),.2),Math.max(a,kc(s,r),Jr-.3-r)}const oE={min:[-1,$t[1]-2.1,$t[2]+.5],max:[1,$t[1]-.8,$t[2]+3.6]};function Oc(n,t,e){if(n===zp&&t===Vp&&e===Gp)return Ti;zp=n,Vp=t,Gp=e;const i=Math.abs(n);let s=xe(n,t,e,0,9.2,.2,5.6);s<ya&&(s=lt(n,t,e,0,7.7,.35,3.85,3.35,3.4),s=O(s,lt(n,t,e,0,10.3,.3,3,2.1,2.7),1.6),s=O(s,lt(n,t,e,0,6.9,-1.2,3.4,2.6,2.7),1.2),s=O(s,xe(i,t,e,Yi[0],Yi[1],Yi[2],.85),.7),s=O(s,K(n,t,e,0,11,.2,0,$t[1]-1.4,$t[2]-.15,2.1,1.7),.8)),Ti.body=s;const r=t-$t[1],a=e-$t[2];let o=xe(n,r,a,0,.6,.5,4.3),c=9;Ti.raw=o,o<ya&&(Ti.raw=o=Sd(n,i,r,a),c=C2(i,r,a),o=Fh(o,-c,.08)),Ti.head=o,Ti.cut=c;let l=Bs(i,t,e,Yi,sE,1.6,1.6);if(l<ya&&(l=Bs(i,t,e,Yi,ii,.72,.8),l=O(l,xe(i,t,e,(Yi[0]+ii[0])/2,(Yi[1]+ii[1])/2,(Yi[2]+ii[2])/2,.9),.6),l=O(l,Bs(i,t,e,ii,sr,.8,.6),.4),xe(i,t,e,Di[0],Di[1],Di[2],1.6)<ya)){l=O(l,lt(i,t,e,Di[0],Di[1],Di[2],.62,.38,.62),.3);for(const f of D2)l=O(l,Bs(i,t,e,f[0],f[1],.24,.17),.14)}Ti.arm=l;let u=K(i,t,e,Va[0],Va[1],Va[2],Zr,.6,1,2,2);if(u<ya&&(u=Bs(i,t,e,Va,rs,1.42,1.1),u=O(u,Bs(i,t,e,rs,Lr,1.08,.85),.5),t<2.6)){u=O(u,Math.max(lt(i,t,e,Zr,.45,.75,.95,.6,1.75),-t),.45);for(const f of rE)u=O(u,Bs(i,t,e,f[0],f[1],.26,.18),.15)}Ti.leg=u;let h=xe(n,t,e,2,3.4,-4.4,5.4);if(h<ya){h=1e9;for(let f=0;f+1<Dn.length;f++)h=O(h,Bs(n,t,e,Dn[f],Dn[f+1],Hp[f],Hp[f+1]),.5)}return Ti.tail=h,Ti.min=Math.min(s,o,l,u,h),Ti}function cE(n,t,e){const i=Oc(n,t,e);let s=O(i.body,i.head,.6);return s=O(s,i.arm,.5),s=O(s,i.leg,.7),O(s,i.tail,.6)}function lE(n,t,e){let i=0,s=1/0,r=0;for(let a=0;a+1<Dn.length;a++){const o=Dn[a],c=Dn[a+1],l=c[0]-o[0],u=c[1]-o[1],h=c[2]-o[2],f=l*l+u*u+h*h,d=Math.max(0,Math.min(1,((n-o[0])*l+(t-o[1])*u+(e-o[2])*h)/f)),p=n-o[0]-l*d,v=t-o[1]-u*d,g=e-o[2]-h*d,m=p*p+v*v+g*g;m<s&&(s=m,i=r+d*Math.sqrt(f)),r+=Math.sqrt(f)}return i}function hE(n,t,e){const i=Math.abs(n);if(Math.hypot(n,t-Or[1],e-Or[2])<.62)return 3;const s=Oc(n,t,e),r=s.min;if(s.head===r&&U2(s))return s.raw<-.08?6:2;if(s.head===r){const a=t-$t[1],o=e-$t[2];if(o>.2&&a>-1.9){const c=i-1.1,l=a-.22+.32*c;if((c/1.25)**2+(l/.66)**2<1||i<.34&&a>-.35&&a<2.4&&o>.6)return 2;const u=i-1.05,h=a-1.12+.18*u;if((u/1)**2+(h/.4)**2<1||a<-.15+.25*Math.max(0,i-1.2)&&o>.5)return 1}return a>2.75&&i>.98?1:0}if(s.tail===r){const a=lE(n,t,e);return a>7.9||a%2<.85?2:4}return s.arm===r?I2(i,t,e)>-.25?5:0:s.leg===r?t<1.3?5:0:e>1.2&&(n/2.4)**2+((t-7.9)/3.1)**2<1?4:0}function uE(n,t,e){const i=Math.abs(n),s=Math.hypot(i-cn[0],t-cn[1],e-cn[2]);if(s<.62||Math.hypot(n,t-Or[1],e-Or[2])<.85)return 0;const r=Oc(n,t,e),a=r.min;if(r.head===a){if(U2(r)||Math.abs(kc(t-$t[1],e-$t[2]))<.09&&e-$t[2]>Jr-.2&&i<bd+.1)return 0;const o=t-$t[1],c=e-$t[2];return o>1.4&&i>.9&&c<.1?.5:i>1.4&&o<0&&c<1.5?1.35:c>1?.35+.4*Math.min(1,(s-.62)/1.3):.9}return r.tail===a?1.4:r.arm===a?I2(i,t,e)>-.25?.25:.9:r.leg===a?t<1.3?.3:1:1.1}const fE=.15,dE=new Map([["pelvis",0],["spine1",0],["spine2",0],["neck",1],["head",2],["jaw",2],["armL",3],["forearmL",3],["armR",4],["forearmR",4],["thighL",5],["shinL",5],["footL",5],["thighR",6],["shinR",6],["footR",6],["tail1",7],["tail2",7],["tail3",7],["tail4",7]]),O0=yd(P2(Lr,rs)),pE=new Map([["forearm",(n,t,e)=>(n-ii[0])*Oi[0]+(t-ii[1])*Oi[1]+(e-ii[2])*Oi[2]>-.9],["shin",(n,t,e)=>(n-rs[0])*O0[0]+(t-rs[1])*O0[1]+(e-rs[2])*O0[2]>-.9],["foot",(n,t)=>t<Lr[1]+.7]]),El=(n,t,e,i)=>{const s=pE.get(n.slice(0,-1));return!s||s(Math.abs(t),e,i)},mE=(n,t,e,i)=>{const s=Oc(t,e,i),r=s.min+fE;switch(dE.get(n.name)){case 0:return s.body<=r;case 1:return e>10.6&&(s.body<=r&&Math.abs(t)<2.4||s.head<=r&&e<$t[1]-1.6);case 2:return s.head<=r&&e>$t[1]-2.1||s.body<=r&&e>12&&Math.abs(t)<2;case 3:return s.arm<=r&&t>.5&&El(n.name,t,e,i);case 4:return s.arm<=r&&t<-.5&&El(n.name,t,e,i);case 5:return s.leg<=r&&t>.2&&El(n.name,t,e,i);case 6:return s.leg<=r&&t<-.2&&El(n.name,t,e,i);case 7:return s.tail<=r;default:return!0}},F2={length:1,density:7,tip:.18},gE=new gt(15130834),vE=new gt(5908010),xE=new gt(2761760);function ME(n,t,e,i){const s=t-$t[1],r=e-$t[2],a=kc(s,r)>-.06;i.copy(a?Sd(n,Math.abs(n),s+.02,r)<-.15?vE:xE:gE)}function _E(n,t,e){return kc(t-$t[1],e-$t[2])>-.08||Math.abs(n)>bd-.06?0:.42}const Wp=n=>Fi(-.12,.12,n),wE=[1,-1].flatMap(n=>{const t=n>0?"L":"R",e=i=>n>0?Wp(i):1-Wp(i);return[{bone:"ear"+t,w:(i,s,r)=>{const a=n*i,o=s-$t[1],c=r-$t[2],l=Math.hypot(i/2.38,o/2.05,c/2.21),u=Math.hypot((a-1.44)/.78,(o-2.05)/1.03,(c+.66)/.34);return e(i)*Fi(1,1.14,l)*Fi(1.75,1.25,u)}},{bone:"brow"+t,w:(i,s,r)=>{const a=Math.hypot((n*i-Un[0])/.85,(s-Un[1])/.55,(r-Un[2])/1);return e(i)*(1-Fi(.45,1,a))}},{bone:"cheek"+t,w:(i,s,r)=>{const a=Math.hypot((n*i-Fn[0])/1.6,(s-Fn[1])/1.4,(r-Fn[2])/1.6);return e(i)*(1-Fi(.45,1.05,a))}}]});function bE(n){b2(n,wE);const t=n.std({color:328965,roughness:.06,metalness:.1}),e=n.std({color:16777215,emissive:16777215,emissiveIntensity:1.1,roughness:.3}),i=n.std({color:2169881,roughness:1});for(const[p,v]of[[1,"L"],[-1,"R"]]){const g=new de;g.name="jim-eye"+v,g.add(new nt(new Xt(.34,14,10),t));const m=new nt(new Xt(.075,8,6),e);m.position.set(.1,.15,.28),m.scale.set(1,1,.35),g.add(m),n.at(g,"head",p*cn[0],cn[1],cn[2]),n.at(Nc("jim-lid"+v,.34,i,{gap:.1}),"head",p*cn[0],cn[1],cn[2])}const s=new nt(new Xt(.42,14,10),n.std({color:657930,roughness:.25}));s.scale.set(1.15,.8,.75),n.at(s,"head",Or[0],Or[1],Or[2]),y2(n,"jim-jaw","jaw",aE,oE,24,ME,F2,5,_E);const r=p=>$t[1]+uh+wd*(p-Jr),a=new Xt(1,18,10).scale(.34,.14,.78).translate(0,r(2.05)-.12,$t[2]+2.05);n.at(new nt(a,n.std({color:13132910,roughness:.45})),"jaw",0,0,0);const o=n.std({color:15920868,roughness:.35}),c=(p,v,g,m,M)=>{const x=new ri(m,g,7);return M&&x.rotateX(Math.PI),x.translate(p,r(v)+(M?.1-g/2:g/2-.1),$t[2]+v)},l=[c(.3,2.62,.34,.065,!0),c(-.3,2.62,.34,.065,!0)];for(const p of[-.19,-.065,.065,.19])l.push(c(p,3.08,.2,.034,!0));const u=[c(.23,2.45,.3,.055,!1),c(-.23,2.45,.3,.055,!1)];n.at(new nt(zn(l),o),"head",0,0,0),n.at(new nt(zn(u),o),"jaw",0,0,0);const h=[];for(let p=0;p<=8;p++){const v=Jr+.05+p/8*1.5;h.push([.68-.13*(v-1),r(v),$t[2]+v])}S2(n,"jim-mouth",h,2757140);const f=new Xt(1,14,8).scale(.5,.3,.45).translate(0,$t[1]-1.35,$t[2]+1.35);n.at(new nt(f,n.std({color:1706764,roughness:.9})),"head",0,0,0);const d=n.std({color:1775638,roughness:.5});for(const[p,v]of[[1,"L"],[-1,"R"]]){const g=[];for(const[x,_,b,S,T]of[[.09,-.04,.12,-.32,1.9],[-.02,.06,-.02,-.2,2.1],[-.12,.15,-.17,-.1,1.8]]){const A=new C(p,b,S).normalize();g.push(new Mn(.01,.035,T,5).translate(0,T/2,0).applyQuaternion(new ie().setFromUnitVectors(new C(0,1,0),A)).translate(0,x,_))}const m=new nt(zn(g),d);m.castShadow=!1;const M=new de;M.name="jim-whisk"+v,M.add(m),n.at(M,"head",p*.55,$t[1]-.82,$t[2]+2.8)}}const Xp=new WeakMap,to=L2.find(n=>n.name==="head").a,B0=[Un[0]-to[0],Un[1]-to[1],Un[2]-to[2]],H0=[Fn[0]-to[0],Fn[1]-to[1],Fn[2]-to[2]],yE=(n,t)=>{const e=(n+t)%6.1;return e<.4?.22*Math.sin(e/.4*Math.PI*2)*(1-e/.4):0},SE=n=>{const t=(n+2.2)%3.7;return t<.45?.07*Math.sin(t*42)*(1-t/.45):0};function EE(n,t,e){let i=Xp.get(n);if(!i){const l=h=>n.getObjectByName(h)??null,u=h=>[l(h+"L"),l(h+"R")];i={eyes:u("jim-eye"),lids:u("jim-lid"),ears:u("ear"),brows:u("brow"),cheeks:u("cheek"),whisk:u("jim-whisk")},Xp.set(n,i)}const s=e??null;if(s)E2(i.lids,s);else{const l=T2(t);for(const u of i.lids)u&&_o(u,l,0,0)}for(const l of i.eyes)l&&vd(l,s,.75);const r=s?.frown??0,a=s?.sneer??0,o=s?.puff??0,c=s?.browUp??0;for(let l=0;l<2;l++){const u=l===0,h=u?1:-1,f=s?u?s.browOuterL:s.browOuterR:0,d=s?u?s.browDownL:s.browDownR:0,p=s?u?s.wideL:s.wideR:0,v=s?u?s.smileL:s.smileR:0,g=i.brows[l];g&&(g.position.set(h*B0[0],B0[1]+.36*(.55*c+.45*f)-.26*d,B0[2]+.06*d),g.rotation.z=h*(.32*(f-c)+.3*d));const m=i.ears[l];if(m){const _=Math.max(p,.8*c,f),b=Math.max(d,.6*a),S=r;m.rotation.set(.2*_-.55*b-.12*S+yE(t,u?3.1:.4),0,-h*(.45*b+.4*S-.15*_))}const M=i.cheeks[l];M&&(M.position.set(h*(H0[0]+.12*o+.06*v),H0[1]+.34*v+.12*a-.14*r,H0[2]-.1*v+.08*o),M.scale.setScalar(1+.22*o+.08*v));const x=i.whisk[l];x&&x.rotation.set(0,-h*.3*v,h*(.28*a+.2*o-.12*r+SE(t)))}}const TE={id:"jimothy",name:"Jimothy",blurb:"The round Seattle raccoon, standing up",segs:L2,body:{sdf:cE,region:hE,box:iE,palette:[7103837,15130834,1841431,657930,9406332,3814192,4858406],weights:"soft",capture:mE,fur:F2,furLen:uE,tint(n,t,e,i,s){if(n!==0)return;i<-.5&&s.multiplyScalar(1-.2*Math.min(1,(-.5-i)/2.5));const r=Oc(t,e,i);(r.arm===r.min||r.leg===r.min)&&s.multiplyScalar(.82)}},dress:bE,tick:EE,fit:{size:1.05,limb:.5},face:{jaw:.55,eyes:[[cn[0],cn[1],cn[2]+.18,.36],[-.98,cn[1],cn[2]+.18,.36]]},idle:{tail:.15},res:84,furShells:8},Ho=new C;function li(n,t,e,i,s,r){const a=2*Math.PI*s/4,o=Math.max(r-2*s,0),c=Math.PI/4;Ho.copy(t),Ho[i]=0,Ho.normalize();const l=.5*a/(a+o),u=1-Ho.angleTo(n)/c;return Math.sign(Ho[e])===1?u*l:o/(a+o)+l+l*(1-u)}class Ed extends Ie{constructor(t=1,e=1,i=1,s=2,r=.1){const a=s*2+1;if(r=Math.min(t/2,e/2,i/2,r),super(1,1,1,a,a,a),this.type="RoundedBoxGeometry",this.parameters={width:t,height:e,depth:i,segments:s,radius:r},a===1)return;const o=this.toNonIndexed();this.index=null,this.attributes.position=o.attributes.position,this.attributes.normal=o.attributes.normal,this.attributes.uv=o.attributes.uv;const c=new C,l=new C,u=new C(t,e,i).divideScalar(2).subScalar(r),h=this.attributes.position.array,f=this.attributes.normal.array,d=this.attributes.uv.array,p=h.length/6,v=new C,g=.5/a;for(let m=0,M=0;m<h.length;m+=3,M+=2)switch(c.fromArray(h,m),l.copy(c),l.x-=Math.sign(l.x)*g,l.y-=Math.sign(l.y)*g,l.z-=Math.sign(l.z)*g,l.normalize(),h[m+0]=u.x*Math.sign(c.x)+l.x*r,h[m+1]=u.y*Math.sign(c.y)+l.y*r,h[m+2]=u.z*Math.sign(c.z)+l.z*r,f[m+0]=l.x,f[m+1]=l.y,f[m+2]=l.z,Math.floor(m/p)){case 0:v.set(1,0,0),d[M+0]=li(v,l,"z","y",r,i),d[M+1]=1-li(v,l,"y","z",r,e);break;case 1:v.set(-1,0,0),d[M+0]=1-li(v,l,"z","y",r,i),d[M+1]=1-li(v,l,"y","z",r,e);break;case 2:v.set(0,1,0),d[M+0]=1-li(v,l,"x","z",r,t),d[M+1]=li(v,l,"z","x",r,i);break;case 3:v.set(0,-1,0),d[M+0]=1-li(v,l,"x","z",r,t),d[M+1]=1-li(v,l,"z","x",r,i);break;case 4:v.set(0,0,1),d[M+0]=1-li(v,l,"x","y",r,t),d[M+1]=1-li(v,l,"y","x",r,e);break;case 5:v.set(0,0,-1),d[M+0]=li(v,l,"x","y",r,t),d[M+1]=1-li(v,l,"y","x",r,e);break}}static fromJSON(t){return new Ed(t.width,t.height,t.depth,t.segments,t.radius)}}const Td=[{name:"pelvis",a:[0,9.6,0],b:[0,10.8,0],parent:null},{name:"spine1",a:[0,10.8,0],b:[0,12.6,0],parent:"pelvis"},{name:"spine2",a:[0,12.6,0],b:[0,15,0],parent:"spine1"},{name:"neck",a:[0,15,0],b:[0,15.9,0],parent:"spine2"},{name:"head",a:[0,15.9,0],b:[0,18.4,0],parent:"neck"},{name:"jaw",a:[0,16.5,1],b:[0,16.5,1.3],parent:"head",reach:0},{name:"tail1",a:[0,9.4,-.8],b:[0,9.2,-1.2],parent:"pelvis",reach:0},{name:"tail2",a:[0,9.2,-1.2],b:[0,9,-1.6],parent:"tail1",reach:0},{name:"tail3",a:[0,9,-1.6],b:[0,8.8,-2],parent:"tail2",reach:0},{name:"tail4",a:[0,8.8,-2],b:[0,8.6,-2.4],parent:"tail3",reach:0},{name:"thighL",a:[.95,9.6,0],b:[.95,5.3,0],parent:"pelvis"},{name:"shinL",a:[.95,5.3,0],b:[.95,1.2,0],parent:"thighL"},{name:"footL",a:[.95,1.2,0],b:[.95,.4,1.5],parent:"shinL"},{name:"thighR",a:[-.95,9.6,0],b:[-.95,5.3,0],parent:"pelvis"},{name:"shinR",a:[-.95,5.3,0],b:[-.95,1.2,0],parent:"thighR"},{name:"footR",a:[-.95,1.2,0],b:[-.95,.4,1.5],parent:"shinR"},{name:"armL",a:[2.75,14.4,0],b:[2.75,11.9,0],parent:"spine2"},{name:"forearmL",a:[2.75,11.9,0],b:[2.75,9.5,0],parent:"armL"},{name:"armR",a:[-2.75,14.4,0],b:[-2.75,11.9,0],parent:"spine2"},{name:"forearmR",a:[-2.75,11.9,0],b:[-2.75,9.5,0],parent:"armR"}],Ad={y:17.15,a:1.6,b:1.62},z0=3,Bi=10,$p=Math.PI/Bi,Rd=.38,Ga=[{y0:.35,y1:5.2,r0:7.8,r1:5,bone:"pelvis"},{y0:3.9,y1:8.7,r0:7.1,r1:4.4,bone:"pelvis"},{y0:7.3,y1:12,r0:6.3,r1:3.8,bone:"spine1"},{y0:10.6,y1:15,r0:5.4,r1:3.2,bone:"spine2"},{y0:13.5,y1:20,r0:4.7,r1:2.4,bone:"head",flare:1.8,cols:6,rows:20,hole:Ad},{y0:19.25,y1:23.7,r0:3.4,r1:.05,bone:"head",flare:1}],AE=9425231,RE=2907158,N2=(n,t)=>n.r1+(n.r0-n.r1)*Math.pow(Math.min(1,Math.max(0,1-t)),n.flare??1.25),gf=n=>{const t=Math.sin(n*127.1+311.7)*43758.5453;return t-Math.floor(t)};function Sc(n,t){const e=Math.floor(t),i=t-e,s=$p+e/Bi*Math.PI*2,r=$p+(e+1)/Bi*Math.PI*2;return[n*(Math.sin(s)+(Math.sin(r)-Math.sin(s))*i),n*(Math.cos(s)+(Math.cos(r)-Math.cos(s))*i)]}function k2(n,t,e){const i=N2(n,(e-n.y0)/(n.y1-n.y0));for(let s=0;s<Bi;s++){const[r,a]=Sc(i,s),[o,c]=Sc(i,s+1);if(a+c>0&&(t-r)*(t-o)<=0&&r!==o)return a+(t-r)/(o-r)*(c-a)}return Math.sqrt(Math.max(0,i*i-t*t))}const qp=(n,t,e)=>Math.pow(Math.abs(t/n.a)**z0+Math.abs((e-n.y)/n.b)**z0,1/z0),CE=Ga.find(n=>n.hole),qn=k2(CE,0,Ad.y)-.3,Pr=.56,Ir=17.4,vf=.16,xf=1.45,O2=.62,B2=17.92,Cd=.37,H2=.38,Yp=Cd*Math.sin(H2),Mf=.08,_f=16.5,z2=.72,LE=.12,jp=.03,PE=0,Zp=.05,IE=.056,V2=.06,G2=.25,W2=.4,Sa=Td.find(n=>n.name==="head").a[1],X2=Ad.y-.05,Wa=.8,DE=X2+1.5-Wa,Br=21,fh={cl:-.035,cr:-.035,mid:0,slant:.043,w:1,wl:1,wr:1,t:LE,o:0,round:0,lift:0},$2=[{cl:.21,wl:1.12,t:.13},{cr:.21,wr:1.12,t:.13},{cl:-.2,cr:-.2,mid:.025,w:.92},{o:.46,w:.96},{o:.22,w:.5,round:1,slant:0,cl:0,cr:0},{o:.03,w:.46,round:.65,t:.2,slant:.01,cl:0,cr:0},{lift:.13,t:.14}];function dh(n){const t=new Float32Array(Br*6);for(let e=0;e<Br;e++){const i=-1+2*e/(Br-1),s=Math.max(0,1-i*i),r=i*(z2/2)*n.w*(i>0?n.wl:n.wr),a=(i>0?n.cl:n.cr)*i*i+n.mid*s+n.slant*i,o=n.t/2*((1-.55*i**4)*(1-n.round)+Math.sqrt(s)*n.round),c=Math.sqrt(s)*n.o,l=n.lift*Math.exp(-(((Math.abs(i)-.42)/.3)**2));t.set([r,a+o+.15*c+l,0,r,a-o-c,0],e*6)}return t}const Wl=(Br-1)/2*2,V0=Wl+1;function UE(){const n=dh(fh),t=new Me;t.setAttribute("position",new qt(n,3));const e=new Float32Array(Br*6);for(let s=0;s<Br*2;s++)e[s*3+2]=1;t.setAttribute("normal",new qt(e,3));const i=[];for(let s=0;s<Br-1;s++){const r=s*2;i.push(r,r+1,r+2,r+1,r+3,r+2)}return t.setIndex(i),t.morphAttributes.position=$2.map(s=>{const r=dh({...fh,...s});for(let a=0;a<r.length;a++)r[a]-=n[a];return new qt(r,3)}),t.morphTargetsRelative=!0,t.boundingSphere=new lr(new C(0,-.2,0),.75),t}const Tl=(()=>{const n=dh(fh),t=(i,s)=>i[s*3+1],e=$2.map(i=>dh({...fh,...i}));return{up:t(n,Wl),lo:t(n,V0),dUp:e.map(i=>t(i,Wl)-t(n,Wl)),dLo:e.map(i=>t(i,V0)-t(n,V0))}})(),FE=.98,NE=16.55,q2=-.75;function kE(n){const t=n.cols??2,e=n.rows??2,i=Bi*t,s=n.y1-n.y0,r=[],a=[],o=new gt(AE),c=new gt(RE),l=new gt;for(let f=0;f<=e;f++){const d=1-f/e,p=N2(n,d);for(let v=0;v<=i;v++){let[g,m]=Sc(p,v/t),M=n.y0+d*s;if(f===e&&v%2===0){const _=v%i,b=.6+.8*gf(_+n.y0*7);M-=Rd*b,g*=1.04,m*=1.04}r.push(g,M,m);const x=Math.min(1,Math.max(0,(d-.25)/.4));l.copy(o).lerp(c,x*x*(3-2*x)),a.push(l.r,l.g,l.b)}}const u=[];for(let f=0;f<e;f++)for(let d=0;d<i;d++){const p=f*(i+1)+d,v=p+i+1,g=v+1,m=p+1;u.push(p,v,m,v,g,m)}if(n.hole){const f=n.hole,d=[],p=new Set,v=new Set;for(let g=0;g<u.length;g+=3){const m=[u[g],u[g+1],u[g+2]],M=(r[m[0]*3]+r[m[1]*3]+r[m[2]*3])/3,x=(r[m[0]*3+1]+r[m[1]*3+1]+r[m[2]*3+1])/3;if((r[m[0]*3+2]+r[m[1]*3+2]+r[m[2]*3+2])/3>0&&qp(f,M,x)<1)for(const b of m)p.add(b);else{d.push(...m);for(const b of m)v.add(b)}}for(const g of p){if(!v.has(g))continue;const m=r[g*3],M=r[g*3+1],x=qp(f,m,M);if(x<.3)continue;const _=m/x,b=f.y+(M-f.y)/x;r[g*3]=_,r[g*3+1]=b,r[g*3+2]=k2(n,_,b)}u.length=0,u.push(...d)}const h=new Me;return h.setAttribute("position",new ae(r,3)),h.setAttribute("color",new ae(a,3)),h.setIndex(u),h.computeVertexNormals(),h}const Y2=[[0,-3,.6,2],[0,0,.7,4],[0,2,.55,0],[1,-1,.9,0],[1,1,.6,3],[1,-4,.6,1],[2,-2,.6,1],[2,2,.7,2],[3,-1,.6,4],[3,1,.55,1],[4,-2,.45,1],[4,1,.45,2],[5,-2,.35,0],[5,1,.35,2]],$s=[14165550,2838486,9060304,14699176,15759898],Ec=Y2.map(([n,t,e,i])=>{const s=Ga[n],[r,a]=Sc(s.r0*.99,(t%Bi+Bi)%Bi),o=s.y0-Rd*.55;return{bone:s.bone,p:[r,o-e*1.2-.3,a],ci:i}}),G0=Ec.length,Jp=new WeakMap,j2=n=>{let t=Jp.get(n);return t||(t={uOrnPos:{value:Ec.map(()=>new C(0,-1e4,0))},uOrnCol:{value:Ec.map(()=>new gt(0,0,0))},uOrnR:{value:.2}},Jp.set(n,t)),t};function OE(n){n.name="lime",n.onBeforeCompile=function(t){Object.assign(t.uniforms,j2(this)),t.vertexShader=t.vertexShader.replace("#include <common>",`#include <common>
 varying vec3 vOrnW;`).replace("#include <project_vertex>",`#include <project_vertex>
 vOrnW = (modelMatrix * vec4(transformed, 1.0)).xyz;`),t.fragmentShader=t.fragmentShader.replace("#include <common>",`#include <common>
        varying vec3 vOrnW; uniform vec3 uOrnPos[${G0}]; uniform vec3 uOrnCol[${G0}]; uniform float uOrnR;`).replace("#include <emissivemap_fragment>",`#include <emissivemap_fragment>
        for (int i = 0; i < ${G0}; i++) {
          vec3 dv = vOrnW - uOrnPos[i];
          float q = dot(dv, dv) / (uOrnR * uOrnR);
          totalEmissiveRadiance += uOrnCol[i] * diffuseColor.rgb * (1.0 / (1.0 + q * 2.5)) * smoothstep(9.0, 2.0, q);
        }`)},n.customProgramCacheKey=()=>"builder-lime-ornaments-v1"}let zo=null;function BE(){if(zo)return zo;const n=document.createElement("canvas");n.width=n.height=64;const t=n.getContext("2d"),e=t.createRadialGradient(32,32,0,32,32,32);return e.addColorStop(0,"rgba(255,255,255,1)"),e.addColorStop(.18,"rgba(255,255,255,0.75)"),e.addColorStop(.45,"rgba(255,255,255,0.22)"),e.addColorStop(1,"rgba(255,255,255,0)"),t.fillStyle=e,t.fillRect(0,0,64,64),zo=new oh(n),zo.colorSpace=xn,zo}function HE(n){const t=new Map,e=new Set,i=(H,Y,it=0,dt=0,vt=0)=>{H.position.set(it,dt,vt),H.updateMatrixWorld(!0),H.traverse(St=>{const Ct=St;if(!Ct.isMesh)return;const Ft=Ct.material,V=`${Y}|${Ft.uuid}|${Ct.name}`,$=Ct.geometry.index?Ct.geometry.toNonIndexed():Ct.geometry.clone();for(const W of Object.keys($.attributes))W!=="position"&&W!=="normal"&&W!=="color"&&$.deleteAttribute(W);$.applyMatrix4(Ct.matrixWorld);let z=t.get(V);z||(z={bone:Y,mat:Ft,name:Ct.name,geos:[]},t.set(V,z)),z.geos.push($)})},s=(H,Y,it="")=>{e.add(H);const dt=new nt(H,Y);return dt.name=it,dt},r=n.std({color:16777215,vertexColors:!0,roughness:.95,metalness:0,flatShading:!0,side:Te,emissive:2771474,emissiveIntensity:1}),a=n.std({color:12894672,emissive:12894672,emissiveIntensity:.05,roughness:.75}),o=n.std({color:1315350,roughness:.5}),c=n.std({color:2236962,roughness:.8}),l=$s.map((H,Y)=>{const it=new je({color:H,emissive:H,emissiveIntensity:1.2,roughness:.3,metalness:.1});return it.name=`orn-${Y}`,it});OE(r);const u=n.std({color:1973794,roughness:.45,metalness:.1}),h=n.std({color:15762972,roughness:.45,metalness:.05}),f=n.std({color:15251514,emissive:16758810,emissiveIntensity:.25,roughness:.25,metalness:.85});for(const H of Ga)i(s(kE(H),r),H.bone);const d=new Xt(.34,12,8),p=new Mn(.035,.035,1,4);for(const[H,Y,it,dt]of Y2){const vt=Ga[H],[St,Ct]=Sc(vt.r0*.99,(Y%Bi+Bi)%Bi),Ft=vt.y0-Rd*.55,V=it*1.2,$=s(p,c);$.scale.y=V,i($,vt.bone,St,Ft-V/2,Ct),i(s(d,l[dt],`orn-${dt}`),vt.bone,St,Ft-V-.3,Ct)}const v=$s.map((H,Y)=>{const it=new od({map:BE(),color:H,blending:Xr,depthWrite:!1,transparent:!0,opacity:.85,toneMapped:!1});return it.name=`halo-${Y}`,it.userData.keepBlend=!0,it});for(const H of Ec){const Y=new Xg(v[H.ci]);Y.name=`halo-${H.ci}`,Y.scale.setScalar(3.2),Y.renderOrder=5,n.at(Y,H.bone,...H.p)}i(s(new Ed(3,3,2.3,3,Wa),a),"head",0,X2,qn-1.15);const g=(H,Y,it,dt,vt=!0)=>{n.at(H,"head",Y,it,dt).traverse(St=>{St.receiveShadow=!1,vt||(St.castShadow=!1)})},m=new _i(.62,1).translate(0,-.5,0),M=new _i(.62,1).translate(0,.5,0),x=new _i(W2,1);for(const H of[1,-1]){const Y=H>0?"L":"R",it=new nt(new Xt(vf,12,10),o);it.scale.set(1,xf,G2),it.name="eye"+Y,g(it,H*Pr,Ir,qn+PE);const dt=new nt(m,a);dt.name="lidUp"+Y,g(dt,H*Pr,Ir,qn+Zp,!1);const vt=new nt(M,a);vt.name="lidLo"+Y,g(vt,H*Pr,Ir,qn+Zp,!1);const St=new nt(x,o);St.name="lash"+Y,g(St,H*Pr,Ir,qn+IE,!1);const Ct=new nt(new Ie(Cd*2,.16,.1),o);Ct.rotation.z=H*H2,Ct.name="brow"+Y,g(Ct,H*O2,B2,qn+V2);const Ft=new nt(new Xt(.42,16,12),a);Ft.name="cheek"+Y,Ft.visible=!1,g(Ft,H*FE,NE,qn+q2,!1)}const _=new nt(UE(),o);_.name="mouth",g(_,Mf,_f,qn+jp,!1);const b=new nt(new Yr(1,20),n.std({color:11027023,roughness:.6}));b.name="tongue",b.visible=!1,g(b,Mf,_f,qn+jp+.008,!1);const S=new de,T=[2.4,2.25,2.45],A=s(new Xt(1,24,10,0,Math.PI*2,0,Math.PI/2),u);A.scale.set(...T),S.add(A);const w=.95;for(let H=0;H<4;H++){const Y=s(new Xt(1,8,6,H*(Math.PI/2)+w/2,Math.PI/2-w,.1*Math.PI,.27*Math.PI),h);Y.scale.set(T[0]*1.012,T[1]*1.012,T[2]*1.012),S.add(Y)}const y=new zi([new ht(.96,0),new ht(1.08,0),new ht(1.08,.12),new ht(.96,.12),new ht(.96,0)],24),E=s(y,u);E.scale.set(T[0],1,T[2]*1.06),E.position.set(0,-.02,.1),S.add(E);const R=s(new Yr(1,20),n.std({color:2762272,roughness:.9}));R.rotation.x=Math.PI/2,R.scale.set(T[0]*.99,T[2]*.99,1),R.position.y=.01,S.add(R);const L=new fd;for(let H=0;H<8;H++){const Y=Math.PI/2+H*Math.PI/4,it=H%2?.24:.85;H?L.lineTo(Math.cos(Y)*it,Math.sin(Y)*it):L.moveTo(Math.cos(Y)*it,Math.sin(Y)*it)}const I=new Dh(L,{depth:.12,bevelEnabled:!0,bevelThickness:.06,bevelSize:.05,bevelSegments:1}),N=.95,B=s(I,f);B.scale.setScalar(1.5),B.position.set(0,N,T[2]*Math.sqrt(1-(N/T[1])**2)+.02),B.rotation.x=-.45,S.add(B),S.position.y=-.8;const X=new de;X.add(S),X.rotation.set(.12,0,.36,"ZXY"),i(X,"head",0,Ga[Ga.length-1].y1,0);for(const H of t.values()){const Y=n.segs.find(vt=>vt.name===H.bone).a,it=zn(H.geos);for(const vt of H.geos)vt.dispose();if(!it)throw new Error(`builder: parts on ${H.bone} would not merge`);it.translate(-Y[0],-Y[1],-Y[2]);const dt=new nt(it,H.mat);dt.name=H.name,n.at(dt,H.bone,Y[0],Y[1],Y[2]),H.mat===a&&(dt.receiveShadow=!1)}for(const H of e)H.dispose()}const Kp=new WeakMap,zE=new C,eo=n=>Math.max(0,Math.min(1,n)),wf=(n,t,e)=>{const i=eo((e-n)/(t-n));return i*i*(3-2*i)},tn=(n,t,e)=>eo((n-t)/(e-t)),VE=.2,GE=.22,Pt={blink:[0,0],squint:[0,0],wide:[0,0],down:[0,0],outer:[0,0],smile:[0,0],up:0,frown:0,jaw:0,funnel:0,pucker:0,sneer:0,puff:0,lookX:0,lookY:0,side:0};function WE(n,t){if(n){const l=Math.max(0,n.smile-(n.smileL+n.smileR)/2);Pt.blink[0]=tn(n.blinkL,.15,.65),Pt.blink[1]=tn(n.blinkR,.15,.65),Pt.squint[0]=tn(n.squintL,.2,.7),Pt.squint[1]=tn(n.squintR,.2,.7),Pt.wide[0]=tn(n.wideL,.08,.5),Pt.wide[1]=tn(n.wideR,.08,.5),Pt.down[0]=tn(n.browDownL,.08,.55),Pt.down[1]=tn(n.browDownR,.08,.55),Pt.outer[0]=tn(n.browOuterL,.08,.6),Pt.outer[1]=tn(n.browOuterR,.08,.6),Pt.smile[0]=tn(n.smileL+l,.06,.7),Pt.smile[1]=tn(n.smileR+l,.06,.7),Pt.up=tn(n.browUp,.1,.65),Pt.frown=tn(n.frown,.03,.35),Pt.jaw=eo(n.jaw),Pt.funnel=tn(n.funnel,.06,.5),Pt.pucker=tn(n.pucker,.2,.85),Pt.sneer=tn(n.sneer,.06,.5),Pt.puff=tn(n.puff,.04,.4),Pt.lookX=n.lookX,Pt.lookY=n.lookY,Pt.side=n.jawSide;return}const e=t%13.2,i=e%4.4,s=i<.16?Math.sin(i/.16*Math.PI):e>8.8&&i>.24&&i<.4?Math.sin((i-.24)/.16*Math.PI):0;Pt.blink[0]=Pt.blink[1]=s;const r=Math.floor(t/2.9),a=wf(0,.22,t-r*2.9),o=l=>l%3===0?0:(gf(l*7.3)*2-1)*.75,c=l=>l%3===0?0:(gf(l*3.1+5)-.6)*.6;Pt.lookX=o(r-1)+(o(r)-o(r-1))*a,Pt.lookY=c(r-1)+(c(r)-c(r-1))*a,Pt.squint[0]=Pt.squint[1]=Pt.wide[0]=Pt.wide[1]=Pt.down[0]=Pt.down[1]=Pt.outer[0]=Pt.outer[1]=Pt.smile[0]=Pt.smile[1]=0,Pt.up=Pt.frown=Pt.jaw=Pt.funnel=Pt.pucker=Pt.sneer=Pt.puff=Pt.side=0}function XE(n){for(let a=0;a<2;a++){const o=n.side[a],c=a===0?1:-1,l=Pt.blink[a],u=Pt.squint[a],h=Pt.wide[a],f=Pt.down[a],d=Pt.outer[a],p=Pt.smile[a],v=1+.14*h-.06*u,g=c*Pr+.14*Pt.lookX,m=Ir+.09*Pt.lookY,M=vf*xf*v;o.eye&&(o.eye.position.x=g,o.eye.position.y=m-Sa,o.eye.scale.set(v,xf*v,G2));const x=Math.max(l,eo(VE+.5*f+.3*u+.2*Pt.sneer-.6*h-.3*Pt.up-.3*d-.2*Pt.lookY)),_=Math.max(l,eo(.5*u+.35*p+.15*Pt.sneer)),b=m+M+.025,S=m-.03,T=m-M-.025;let A=b+(S-b)*x,w=T+(S-T)*_;w>A&&(A=w=(A+w)/2);const y=c*(GE+.3*f-.45*Pt.up),E=y*(.35+.65*l);if(o.up){const R=(b+.01-A)/Math.cos(y);o.up.visible=R>.004,o.up.position.x=g-R*Math.sin(y),o.up.position.y=b+.01-Sa,o.up.rotation.z=y,o.up.scale.y=Math.max(.001,R)}if(o.lo){const R=(w-(T-.01))/Math.cos(E);o.lo.visible=R>.004,o.lo.position.x=g+R*Math.sin(E),o.lo.position.y=T-.01-Sa,o.lo.rotation.z=E,o.lo.scale.y=Math.max(.001,R)}if(o.lash){const R=.075*wf(.6,.95,x),L=(A-m)/M,I=vf*v*Math.sqrt(Math.max(0,1-L*L));o.lash.visible=R>.003&&I>.02,o.lash.position.x=g,o.lash.position.y=A-Sa,o.lash.rotation.z=y,o.lash.scale.set((2*I+.05)/W2,Math.max(.001,R),1)}if(o.brow){const R=-Yp+.4*Pt.up-.22*f+.18*d-.08*Pt.sneer,L=Yp+.06*Pt.up-.08*f+.26*d-.03*Pt.sneer,I=B2+(R+L)/2,N=Math.min(Wa*.8,Math.max(0,I+.06-DE));o.brow.position.x=c*(O2-.05*f),o.brow.position.y=I-Sa,o.brow.position.z=qn+V2-(Wa-Math.sqrt(Wa*Wa-N*N)),o.brow.rotation.z=c*Math.asin(Math.max(-.95,Math.min(.95,(L-R)/(2*Cd))))}if(o.cheek){const R=Pt.puff;o.cheek.visible=R>.01,o.cheek.position.z=qn+q2+.4*R,o.cheek.scale.setScalar(1+.08*R)}}const t=n.mouth,e=t?.morphTargetInfluences;if(!t||!e)return;const i=Pt.funnel,s=eo(Pt.pucker+.6*Pt.puff),r=Math.max(1,i+s);if(e[0]=Pt.smile[0],e[1]=Pt.smile[1],e[2]=Pt.frown*(1-.6*Math.max(Pt.smile[0],Pt.smile[1])),e[3]=Pt.jaw,e[4]=i/r,e[5]=s/r,e[6]=Pt.sneer,t.position.x=Mf+.12*Pt.side,n.tongue){let a=Tl.up,o=Tl.lo;for(let h=0;h<e.length;h++)a+=e[h]*Tl.dUp[h],o+=e[h]*Tl.dLo[h];const c=wf(.12,.45,Pt.jaw),l=1-.04*e[3]-.5*e[4]-.54*e[5]-.08*e[2],u=.24*(a-o)*c;n.tongue.visible=u>.01,n.tongue.position.x=t.position.x,n.tongue.position.y=_f+o+u*1.25-Sa,n.tongue.scale.set(Math.max(.001,z2/2*l*.46*c),Math.max(.001,u),1)}}const Qp=$s.map((n,t)=>({rate:1.3+.37*t,ph:t*1.9}));function $E(n,t,e){let i=Kp.get(n);if(!i){const r=()=>({eye:null,up:null,lo:null,lash:null,brow:null,cheek:null}),a={side:[r(),r()],mouth:null,tongue:null,balls:[],halos:[],lime:null,orn:[],k:$s.map(()=>0)},o=new Map,c=new Map,l=/^(eye|lidUp|lidLo|lash|brow|cheek)([LR])$/,u={eye:"eye",lidUp:"up",lidLo:"lo",lash:"lash",brow:"brow",cheek:"cheek"};n.traverse(f=>{const d=l.exec(f.name);d?a.side[d[2]==="L"?0:1][u[d[1]]]=f:f.name==="mouth"?a.mouth=f:f.name==="tongue"&&(a.tongue=f);const p=f.material;if(p&&!Array.isArray(p)){const v=/^orn-(\d)$/.exec(p.name),g=/^halo-(\d)$/.exec(p.name);v&&o.set(Number(v[1]),p),g&&c.set(Number(g[1]),p),p.name==="lime"&&(a.lime=p)}}),a.balls=$s.map((f,d)=>o.get(d)).filter(Boolean),a.halos=$s.map((f,d)=>c.get(d)).filter(Boolean);const h=new Map;n.traverse(f=>{f.isBone&&h.set(f.name,f)});for(const f of Ec){const d=h.get(f.bone),p=Td.find(v=>v.name===f.bone).a;d&&a.orn.push({bone:d,local:new C(f.p[0]-p[0],f.p[1]-p[1],f.p[2]-p[2]),ci:f.ci})}Kp.set(n,i=a)}const s=i.k;for(let r=0;r<Qp.length;r++){const a=Qp[r];s[r]=.55+.45*Math.sin(t*a.rate+a.ph)+.6*Math.max(0,Math.sin(t*a.rate*3.1+a.ph*2)-.85)*6}for(let r=0;r<i.balls.length;r++)i.balls[r].emissiveIntensity=.6+1.6*s[r];for(let r=0;r<i.halos.length;r++)i.halos[r].color.setHex($s[r]).multiplyScalar(.35+.9*s[r]);if(i.lime&&i.orn.length){const r=j2(i.lime);n.updateMatrixWorld(!0),r.uOrnR.value=2.4*Math.abs(zE.setFromMatrixScale(n.matrixWorld).y);for(let a=0;a<i.orn.length;a++){const o=i.orn[a];r.uOrnPos.value[a].copy(o.local).applyMatrix4(o.bone.matrixWorld),r.uOrnCol.value[a].setHex($s[o.ci]).multiplyScalar(1.3*s[o.ci])}}WE(e,t),XE(i)}const qE={id:"builder",name:"Builder",blurb:"A builder in a Christmas tree costume, tipping his hat",segs:Td,dress:HE,tick:$E,fit:{size:1,limb:.2},face:{eyes:[[Pr,Ir,qn+.1,.26],[-Pr,Ir,qn+.1,.26]]}},Z2=[{name:"pelvis",a:[0,9.6,0],b:[0,10.6,0],parent:null},{name:"spine1",a:[0,10.6,0],b:[0,12.4,.1],parent:"pelvis"},{name:"spine2",a:[0,12.4,.1],b:[0,15,.1],parent:"spine1"},{name:"neck",a:[0,15,.1],b:[0,15.9,.15],parent:"spine2",reach:.8},{name:"head",a:[0,15.9,.15],b:[0,18.4,.3],parent:"neck"},{name:"jaw",a:[0,16.4,.9],b:[0,16.4,1.2],parent:"head",reach:0},{name:"tail1",a:[0,14.8,-1.2],b:[0,12.6,-1.4],parent:"spine2",reach:0},{name:"tail2",a:[0,12.6,-1.4],b:[0,10.4,-1.6],parent:"tail1",reach:0},{name:"tail3",a:[0,10.4,-1.6],b:[0,8.2,-1.8],parent:"tail2",reach:0},{name:"tail4",a:[0,8.2,-1.8],b:[0,6.2,-2],parent:"tail3",reach:0},{name:"thighL",a:[1.1,9.6,0],b:[1.2,5.3,.2],parent:"pelvis"},{name:"shinL",a:[1.2,5.3,.2],b:[1.2,1.1,-.1],parent:"thighL"},{name:"footL",a:[1.2,1.1,-.1],b:[1.2,.35,1.4],parent:"shinL"},{name:"thighR",a:[-1.1,9.6,0],b:[-1.2,5.3,.2],parent:"pelvis"},{name:"shinR",a:[-1.2,5.3,.2],b:[-1.2,1.1,-.1],parent:"thighR"},{name:"footR",a:[-1.2,1.1,-.1],b:[-1.2,.35,1.4],parent:"shinR"},{name:"armL",a:[2.5,14.55,0],b:[2.95,11.95,-.05],parent:"spine2"},{name:"forearmL",a:[2.95,11.95,-.05],b:[3.12,9.6,.35],parent:"armL"},{name:"armR",a:[-2.5,14.55,0],b:[-2.95,11.95,-.05],parent:"spine2"},{name:"forearmR",a:[-2.95,11.95,-.05],b:[-3.12,9.6,.35],parent:"armR"}],YE={min:[-4.2,-.5,-1.9],max:[4.2,17.1,2.3]},jE=[3.12,9.6,.35],J2=(n,t,e)=>K(n,t,e,3.05,10.55,.2,3.16,9,.45,.3,.3);function Ld(n,t,e){const i=Math.abs(n);let s=4;if(t>8.4&&(s=lt(n,t,e,0,13,.05,1.74,2.15,1.2),s=O(s,lt(n,t,e,0,11.35,.15,1.62,1.1,1.12),.5),t>13.2&&(s=O(s,K(i,t,e,0,15,-.05,2.15,14.62,0,.5,.56),.5),s=O(s,Math.hypot(Math.hypot(n,(e+.02)*1.15)-.78,t-15.18)-.2,.12),s=O(s,K(n,t,e,0,14.9,.05,0,15.6,.12,.62,.55),.2)),t<11.6&&(s=O(s,lt(n,t,e,0,10.05,0,1.78,1.05,1.15),.4))),t<10.9&&(s=O(s,K(i,t,e,1.08,9.6,0,1.2,5.3,.15,.88,.74),.35),t<6.4&&(s=O(s,K(i,t,e,1.2,5.3,.15,1.22,2.1,-.05,.74,.7),.25))),i>1.5&&t>8.8){const r=K(i,t,e,2.5,14.55,0,2.95,11.95,-.05,.6,.55);s=t>14?O(s,r,.3):Math.min(s,r),t<12.9&&(s=O(s,K(i,t,e,2.95,11.95,-.05,3.08,10,.28,.55,.52),.25),s=Math.max(s,-J2(i,t,e)))}if(t<3.4){const r=O(K(i,t,e,1.22,2.3,-.05,1.22,.6,-.05,.5,.52),Math.max(lt(i,t,e,1.22,.5,.55,.58,.5,1.3),-t),.3);s=Math.min(s,r)}return s}const bf=0,K2=1,ZE=2,Q2=3,JE=4;function tv(n,t,e){const i=Math.abs(n);return J2(i,t,e)<.06?JE:t<2.25&&i>.4?ZE:t>15.38&&i<.8?Q2:i>2.1&&t>9.2||t>10.72?bf:K2}const KE=`
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
  }`;function QE(){const n=new je({vertexColors:!0,roughness:.88,metalness:0});return n.onBeforeCompile=t=>{t.vertexShader=t.vertexShader.replace("#include <common>",`#include <common>
 attribute vec3 aCloth; varying vec3 vCloth; varying vec3 vBind; varying vec3 vBindN;`).replace("#include <begin_vertex>",`#include <begin_vertex>
 vBind = position; vBindN = normal; vCloth = aCloth;`),t.fragmentShader=t.fragmentShader.replace("#include <common>",`#include <common>
`+KE).replace("#include <color_fragment>",`#include <color_fragment>
 diffuseColor.rgb = cloth(diffuseColor.rgb, vBind, normalize(vBindN), vCloth);`)},n.customProgramCacheKey=()=>"jack-cloth-v2",n}const Xe=[0,17.15,.22],ev=1.82,vi=1.38,nv=.24;function Pd(n,t,e){const i=n-Xe[0],s=t-Xe[1],r=e-Xe[2],a=Math.hypot(i,r),o=Math.atan2(r,i),c=1-Math.sqrt(Math.abs(Math.cos(5*(o-Math.PI/2)))),l=1-.06*c;let u=(Math.hypot(a/l/ev,s/vi)-1)*vi;return u+=.32*Math.exp(-((a/.6)**2))*Math.min(1,Math.abs(s)/vi),{d:u,groove:c}}function tm(n,t,e,i,s,r,a=0){const o=(i+s)/2,c=Math.cos(a),l=Math.sin(a),u=(n-e)*c-(t-o)*l,h=(n-e)*l+(t-o)*c+o,f=i-s,d=Math.hypot(f,r);return Math.max((Math.abs(u)*f+(h-i)*r)/d,s-h)}const em=(n,t,e,i,s,r)=>(Math.hypot((n-e)/s,(t-i)/r)-1)*Math.min(s,r),nm=(n,t,e,i,s,r)=>{const a=Math.abs(n-e)-s,o=Math.abs(t-i)-r;return Math.hypot(Math.max(a,0),Math.max(o,0))+Math.min(Math.max(a,o),0)},en={cx:.66,top:.74,bot:.14,w:.36,tilt:-.12},di={lo:{cy:-.36,rx:1.2,ry:.64},up:{cy:-.08,rx:1.34,ry:.56}},W0={u:1.2,v:-.36};function t4(n,t){const e=Math.abs(n);let i=tm(e,t,en.cx,en.top,en.bot,en.w,en.tilt);i=Math.min(i,tm(n,t,0,.1,-.2,.17));let s=Math.max(em(n,t,0,di.lo.cy,di.lo.rx,di.lo.ry),-em(n,t,0,di.up.cy,di.up.rx,di.up.ry));return s=Math.max(s,-nm(e,t,.32,-.7,.11,.12)),s=Math.max(s,-nm(n,t,0,-.93,.12,.13)),Math.min(i,s)}function e4(n,t,e){const i=Pd(n,t,e).d;let s=Math.max(i,-(i+nv));const r=Math.max(t4(n-Xe[0],t-Xe[1]),Xe[2]+.4-e);return s=Math.max(s,-r),s}const n4=new gt(15233038),i4=new gt(10108936),s4=new gt(16757820),r4=new gt(16737290);function a4(n,t,e,i){const{d:s,groove:r}=Pd(n,t,e);if(s<-.05){i.copy(s4).lerp(r4,Math.max(0,Math.min(1,(t-Xe[1]-vi*.2)/(vi*.8))));return}i.copy(n4).lerp(i4,Math.min(1,r*1.3)),i.multiplyScalar(.85+.15*(1-Math.abs(t-Xe[1])/vi))}const o4=`
  uniform vec4 uEyeL; uniform vec4 uEyeR; uniform vec4 uMouth; uniform vec4 uMouth2;
  const vec3 PC = vec3(${Xe.map(n=>n.toFixed(3)).join(", ")});
  const float PR = ${ev.toFixed(3)}, PH = ${vi.toFixed(3)};
  // the left eye (q mirrored for the right): its displacement in the face plane
  vec2 eyeWarp(vec2 q, vec4 e) {
    const float CS = ${Math.cos(en.tilt).toFixed(5)}, SN = ${Math.sin(en.tilt).toFixed(5)};
    const float YB = ${((en.bot-en.top)/2).toFixed(3)}, YT = ${((en.top-en.bot)/2).toFixed(3)}, W = ${en.w.toFixed(3)}, M = 0.26;
    vec2 d = q - vec2(${en.cx.toFixed(3)}, ${((en.top+en.bot)/2).toFixed(3)});
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
  float lipLo(float u) { float k = u / ${di.lo.rx.toFixed(3)}; return ${di.lo.cy.toFixed(3)} - ${di.lo.ry.toFixed(3)} * sqrt(max(0.0, 1.0 - k * k)); }
  float lipUp(float u) { float k = u / ${di.up.rx.toFixed(3)}; return ${di.up.cy.toFixed(3)} - ${di.up.ry.toFixed(3)} * sqrt(max(0.0, 1.0 - k * k)); }
  // where the mouth parts: inside the grin, above the bottom tooth and below the top two
  float parting(float au) {
    float c = min(au, ${W0.u.toFixed(3)});
    float teeth = mix(-0.72, -0.885, smoothstep(0.155, 0.185, c));
    return mix(teeth, 0.5 * (lipLo(c) + lipUp(c)), smoothstep(0.45, 0.62, c));
  }
  vec3 faceWarp(vec3 pos) {
    vec3 p = pos - PC;
    vec2 q = p.xy;
    float au = abs(q.x);
    vec2 wl = eyeWarp(q, uEyeL), wr = eyeWarp(vec2(-q.x, q.y), uEyeR);
    vec2 s = wl + vec2(-wr.x, wr.y);
    vec2 cd = vec2((au - ${W0.u.toFixed(3)}) / 0.42, (q.y - ${W0.v.toFixed(3)}) / 0.36);
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
  }`,im=new WeakMap;function iv(n){let t=im.get(n);return t||(t={uEyeL:{value:new fe},uEyeR:{value:new fe},uMouth:{value:new fe},uMouth2:{value:new fe}},im.set(n,t)),t}function c4(n){const t=n.std({color:16777215,vertexColors:!0,roughness:.5,metalness:0,emissive:16777215,emissiveIntensity:1});return t.onBeforeCompile=function(e){Object.assign(e.uniforms,iv(this)),e.vertexShader=e.vertexShader.replace("#include <common>",`#include <common>
 attribute float aGlow; varying float vGlow;
`+o4).replace("#include <begin_vertex>",`#include <begin_vertex>
 vGlow = aGlow; transformed = faceWarp(transformed);`),e.fragmentShader=e.fragmentShader.replace("#include <common>",`#include <common>
 varying float vGlow;`).replace("#include <color_fragment>",`#include <color_fragment>
 vec3 glowHue = diffuseColor.rgb; diffuseColor.rgb *= 1.0 - 0.92 * vGlow;`).replace("#include <emissivemap_fragment>",`#include <emissivemap_fragment>
 totalEmissiveRadiance *= vGlow * glowHue;`)},t.customProgramCacheKey=()=>"jack-shell-v3",t}let Xl=1;const Pn=()=>(Xl=Xl*1664525+1013904223>>>0,Xl/4294967296),l4=new C(0,1,0),sm=[15255146,13937738,15916172,12884540].map(n=>new gt(n));function Vo(n,t,e,i){const s=new ri(i,e,4,1).translate(0,e/2,0);s.applyQuaternion(new ie().setFromUnitVectors(l4,t.clone().normalize())).translate(n.x,n.y,n.z);const r=sm[Math.floor(Pn()*sm.length)],a=s.attributes.position.count,o=new Float32Array(a*3);for(let c=0;c<a;c++)o[c*3]=r.r,o[c*3+1]=r.g,o[c*3+2]=r.b;return s.setAttribute("color",new qt(o,3)),s}function Go(n,t){const e=n.clone().normalize(),i=Math.abs(e.y)<.9?new C(0,1,0):new C(1,0,0),s=new C().crossVectors(e,i).normalize(),r=new C().crossVectors(e,s),a=Pn()*Math.PI*2,o=Math.tan(t*Math.sqrt(Pn()));return e.addScaledVector(s,Math.cos(a)*o).addScaledVector(r,Math.sin(a)*o).normalize()}function gs(n){const t=zn(n.map(e=>e.index?e.toNonIndexed():e),!1);for(const e of n)e.dispose();return t}function X0(n,t){let e=0,i=3;for(let s=0;s<30;s++){const r=(e+i)/2;Ld(n,t,r)<0?e=r:i=r}return e}function rm(n,t,e){let i=0,s=3;for(let r=0;r<26;r++){const a=(i+s)/2;Ld(Math.cos(t)*a,n,e+Math.sin(t)*a)<0?i=a:s=a}return i}function Al(n,t,e,i){const s=Math.max(8,Math.round(t*18)),r=new Ps(n,s,e,7,i),a=r.attributes.uv,o=a.count,c=new Float32Array(o*3),l=new gt(13150312),u=new gt(9071160),h=new gt;for(let f=0;f<o;f++){const d=.5+.5*Math.sin((a.getX(f)*t*4.5+a.getY(f))*Math.PI*2);h.copy(l).lerp(u,d*d),c[f*3]=h.r,c[f*3+1]=h.g,c[f*3+2]=h.b}return r.setAttribute("color",new qt(c,3)),r}function h4(n){Xl=7;const t=n.bones.get("pelvis").parent;if(t?.isSkinnedMesh){const V=t.geometry.attributes.position,$=new Float32Array(V.count*3);for(let z=0;z<V.count;z++){const W=tv(V.getX(z),V.getY(z),V.getZ(z));$[z*3]=W===bf?1:0,$[z*3+1]=W===K2?1:0,$[z*3+2]=W===Q2?1:0}t.geometry.setAttribute("aCloth",new qt($,3)),t.material.dispose(),t.material=QE()}const e=n.std({color:16777215,vertexColors:!0,roughness:.75,metalness:0}),i=n.std({color:16777215,vertexColors:!0,roughness:.9,metalness:0}),s=(V,$,z,W)=>{for(const G of["L","R"]){const tt=new nt(V,z);tt.name=`jack-${W}${G}`,G==="R"&&(tt.scale.x=-1),n.at(tt,$+G,0,0,0)}},r=rn(e4,{min:[-1.92,Xe[1]-vi-.05,Xe[2]-1.92],max:[1.92,Xe[1]+vi+.05,Xe[2]+1.92]},48,a4,4e4),a=r.attributes.position,o=new Float32Array(a.count);for(let V=0;V<a.count;V++)o[V]=Math.max(0,Math.min(1,-Pd(a.getX(V),a.getY(V),a.getZ(V)).d/.16));r.setAttribute("aGlow",new qt(o,1));const c=new nt(r,c4(n));c.name="jack-pumpkin",n.at(c,"head",0,0,0);const l=Xe[1]-vi+nv+.3,u=new de;u.name="jack-flame";const h=new nt(gs([new Xt(.15,10,8).scale(1,1.1,1).translate(0,.15,0),new ri(.148,.42,10,1,!0).translate(0,.36,0)]),n.std({color:0,emissive:16762976,emissiveIntensity:2.4}));h.name="jack-flamecore",u.add(h),n.at(u,"head",0,l,Xe[2]-.15);const f=new Xt(.1,16,10);for(const V of["L","R"]){const $=new nt(f,_2(sv,2.5));$.name=`jack-spot${V}`,$.scale.set(2.3,2.1,.8),$.renderOrder=2,n.at($,"head",(V==="L"?1:-1)*no[0],no[1],no[2]),$.castShadow=!1,$.receiveShadow=!1}const d=Xe[1]+vi-.22,p=new Mn(.16,.26,1.5,7,8).translate(0,.75,0);{const V=p.attributes.position;for(let $=0;$<V.count;$++){const z=V.getY($)/1.5,W=1+.6*Math.max(0,1-z*5);V.setXYZ($,V.getX($)*W+.5*z*z,V.getY($),V.getZ($)*W-.1*z*z)}p.computeVertexNormals()}n.at(new nt(p.translate(0,d,Xe[2]-.05),n.std({color:5990956,roughness:.85})),"head",0,0,0);const v=n.std({color:4863526,roughness:.95,side:Te}),g=[];for(let V=0;V<=10;V++){const $=1.08+V/10*1.12;g.push(new ht($,-.22*(($-1.08)/1.12)**2))}const m=[];for(let V=0;V<=10;V++){const $=V/10;m.push(new ht(1.1-.24*$-($>.85?($-.85)*3.6:0),$*1.2))}const M=gs([new zi(g,28),new zi(m,28)]);{const V=M.attributes.position;for(let $=0;$<V.count;$++){const z=V.getX($),W=V.getY($),G=V.getZ($),tt=W>.7?.2*Math.exp(-((z/.5)**2))*Math.max(0,G):0;V.setXYZ($,z,W-.07*Math.max(0,z)*Math.max(0,Math.hypot(z,G)-1.08)-tt*.6,G-tt)}M.computeVertexNormals()}const x=new Hn(1.07,.08,6,28).rotateX(Math.PI/2).scale(1,2.4,1).translate(0,.2,0),_=new de;_.add(new nt(M,v),new nt(x,n.std({color:1971986,roughness:.8}))),_.rotation.set(-.08,0,-.2),n.at(_,"head",.08,Xe[1]+vi-.1,Xe[2]-.1);const b=[];for(let V=0;V<34;V++){const $=V/34*Math.PI*2+Pn()*.15,z=.72,W=new C(Math.cos($)*z,15.3+Pn()*.1,Math.sin($)*z*.9),G=Go(new C(Math.cos($)*.9,.7,Math.sin($)*.9),.35);b.push(Vo(W,G,.45+Pn()*.5,.05))}const S=new nt(gs(b),e);S.name="jack-collar",n.at(S,"spine2",0,0,0);const T=new C(2.95,11.95,-.05),A=new C(...jE),w=A.clone().sub(T).normalize(),y=[];for(let V=0;V<46;V++){const $=Pn()*Math.PI*2,z=.26*Math.sqrt(Pn()),W=new C(Math.cos($)*z,0,Math.sin($)*z),G=A.clone().addScaledVector(w,.55).add(W);y.push(Vo(G,Go(w.clone().addScaledVector(W,1.4),.3),.8+Pn()*.9,.055))}s(gs(y),"forearm",e,"hand");const E=[];for(let V=0;V<26;V++){const $=V/26*Math.PI*2+Pn()*.2,z=new C(1.22+Math.cos($)*.62,2.2+Pn()*.12,-.05+Math.sin($)*.62);E.push(Vo(z,Go(new C(Math.cos($),-1.1,Math.sin($)),.3),.4+Pn()*.45,.05))}s(gs(E),"shin",e,"ankle");const R=[];for(let V=0;V<14;V++){const $=V/14*Math.PI*2,z=rm(15.62,$,.1)+.04;R.push(new C(Math.cos($)*z,15.62,.1+Math.sin($)*z))}n.at(new nt(Al(new Mi(R,!0),3.6,.09,!0),i),"neck",0,0,0);const L=10.72,I=[];for(let V=0;V<24;V++){const $=V/24*Math.PI*2,z=rm(L,$,.05)+.06;I.push(new C(Math.cos($)*z,L,.05+Math.sin($)*z))}const N=new Mi(I,!0),B=.55,X=X0(B,L)+.1,H=new Mi([new C(B,L-.05,X),new C(B+.12,L-.6,X+.12),new C(B+.05,L-1.25,X+.08)]),Y=new Mi([new C(B,L-.05,X),new C(B-.12,L-.5,X+.14),new C(B-.02,L-1,X+.1)]),it=[];for(const V of[H,Y]){const $=V.getPoint(1);for(let z=0;z<7;z++)it.push(Vo($,Go(new C(0,-1,.1),.35),.22+Pn()*.2,.035))}const dt=new Xt(.22,10,8).scale(1.2,.9,.8).translate(B,L,X),vt=new Float32Array(dt.attributes.position.count*3),St=new gt(11571288);for(let V=0;V<vt.length;V+=3)vt[V]=St.r,vt[V+1]=St.g,vt[V+2]=St.b;dt.setAttribute("color",new qt(vt,3)),n.at(new nt(gs([Al(N,11,.13,!0),Al(H,1.3,.1,!1),Al(Y,1,.1,!1),dt]),i),"pelvis",0,0,0),n.at(new nt(gs(it),e),"pelvis",0,0,0);const Ct=[],Ft=[];for(const V of[14.25,13.45,12.65]){const $=X0(.13,V);Ct.push(new Mn(.12,.12,.07,10).rotateX(Math.PI/2).translate(.13,V,$+.02))}for(let V=0;V<5;V++)Ft.push(Vo(new C(.13,13.05,X0(.13,13.05)-.05),Go(new C(.4,.3,1),.4),.35+Pn()*.25,.035));n.at(new nt(gs(Ct),n.std({color:2759698,roughness:.5})),"spine2",0,0,0),n.at(new nt(gs(Ft),e),"spine2",0,0,0)}const u4=(n,t,e,i)=>n.name.startsWith("thigh")?i>-1.6&&e<n.a[1]+.8&&Math.abs(Math.abs(t)-Math.abs(n.a[0]))<(e<n.a[1]+.3?1.3:.9):n.name.startsWith("arm")||n.name.startsWith("forearm")?Math.abs(t)>(e<12?2.2:e<14.1?1.88:2.1):!0,no=[en.cx,Xe[1]+(en.top+en.bot)/2-.04,Xe[2]+1.2],sv=16770976,f4=.2,d4=.14,$0=Z2.find(n=>n.name==="head").a,p4=new gt(sv),qs=n=>n<0?0:n>1?1:n,am=new WeakMap;function om(n,t,e,i){const s=qs(t?e?t.blinkL:t.blinkR:i);if(!t)return n.set(s,.1,0,0),s;const r=e?t.browOuterL:t.browOuterR,a=Math.max(e?t.smileL:t.smileR,t.smile),o=qs((e?t.squintL:t.squintR)+.4*a),c=qs(Math.max(e?t.wideL:t.wideR,.7*t.browUp,.7*r)),l=qs(Math.max(e?t.browDownL:t.browDownR,.6*t.sneer)),u=1-(1-s)*(1-.55*o)*(1-.15*l)*(1+.35*c),h=.1+.55*o*(1-s);return n.set(u,h,.95*l-.5*qs(t.frown),.1*Math.max(t.browUp,r)-.05*l),s}const m4={id:"pumpkin",name:"Jack",blurb:"A scarecrow with a candle-lit pumpkin head",segs:Z2,body:{sdf:Ld,region:tv,box:YE,palette:[9181716,2307418,3810326,11044954,1708556],surface:"soft",weights:"sharp",capture:u4},dress:h4,fit:{size:1.08,limb:.6},face:{eyes:[[.66,17.75,2.02,.38],[-.66,17.75,2.02,.38]]},res:76,tick(n,t,e){let i=am.get(n);if(!i){const p=[],v=[];n.traverse(m=>{m.name==="jack-pumpkin"&&p.push(m.material),m.name==="jack-flamecore"&&v.push(m.material)});const g=[];for(const m of["L","R"]){const M=n.getObjectByName(`jack-spot${m}`);M&&g.push({o:M,m:M.material,sx:m==="L"?1:-1})}i={shell:p,carve:p.map(iv),core:v,flame:n.getObjectByName("jack-flame")??null,spots:g},am.set(n,i)}const s=e??null,r=.5*Math.sin(t*1.7)+.3*Math.sin(t*7.9+1.3)+.22*Math.sin(t*13.3+.4)+.15*Math.sin(t*23.7+2.2),a=Math.max(0,Math.sin(t*.83+.5)-.92)*6,o=s?qs(Math.max(s.puff,.8*s.funnel,.5*s.pucker)):0,c=Math.max(.35,1+.36*r-a)*(1+1.3*(s?.jaw??0))*(1+.35*o);for(const p of i.shell)p.emissiveIntensity=c;for(const p of i.core)p.emissiveIntensity=2.4*c;if(i.flame){const p=Math.sin(t*19)+.6*Math.sin(t*31+1.1);i.flame.scale.set(1-.08*r-.15*o,c*(1+.12*Math.sin(t*17))*(1+.6*o),1-.08*r-.15*o),i.flame.rotation.set(-.35*o+.08*o*p,0,.12*Math.sin(t*5.3)+.15*o*p)}const l=(t+.4)%5.7<.15?1:0;let u=0,h=0;for(const p of i.carve)u=om(p.uEyeL.value,s,!0,l),h=om(p.uEyeR.value,s,!1,l),s?(p.uMouth.value.set(qs(s.jaw+.35*s.funnel),Math.max(s.smileL,s.smile)-s.frown,Math.max(s.smileR,s.smile)-s.frown,qs(Math.max(s.pucker,.7*s.funnel))),p.uMouth2.value.set(s.jawSide,0,0,0)):(p.uMouth.value.set(0,0,0,0),p.uMouth2.value.set(0,0,0,0));const f=s?s.lookX:.45*Math.sin(t*.29+.6*Math.sin(t*.11)),d=s?s.lookY:.2*Math.sin(t*.21+2);for(const p of i.spots)p.o.position.set(p.sx*no[0]-$0[0]+f4*f,no[1]-$0[1]+d4*d,no[2]-$0[2]),p.m.color.copy(p4).multiplyScalar(.55*Math.min(1.6,c)*(1-(p.sx>0?u:h)))}},Tc=[1.2,7.9,0],Zn=[1.32,4.5,.15],Jn=[1.32,1.35,-.1],cm=[1.32,1,2],Js=[2.55,12.1,0],Tn=[3.4,9.7,-.1],Pi=[3.95,7.4,.15],Cs=9.4,Hr=6.1,ph=2.9,Wi=n=>[-n[0],n[1],n[2]],Ee=[0,13.6,.25],q0=[1.9,1.95,1.8],He=1.1,hr=n=>[Ee[0]+(n[0]-Ee[0])*He,Ee[1]+(n[1]-Ee[1])*He,Ee[2]+(n[2]-Ee[2])*He],vn=[.88,14.55,1.5],gn=[.5,.62,.44],io=[0,13.2,1.3],mh=n=>io[1]-.13*(n-io[2]),Ea=hr(vn),lm=gn[0]*He,g4=hr(io),rv=[[0,.25,2.1,.45],[.42,.05,1.6,.55],[-.42,.05,1.6,.55],[.22,-.4,1.75,.85],[-.22,-.4,1.75,.85]];function hm(n,t,e){let i=1e9;for(const[s,r,a,o]of rv)i=Math.min(i,K(n,t,e,s*.5,15,r,s*1.4,15.2+a,r-o,.45,.08));return i}const Wo=n=>Ee[1]+(n-Ee[1])/He,Y0=n=>Ee[2]+(n-Ee[2])/He,v4=hr([0,15.1,.05]),x4=hr([0,17,-.55]),Rl=hr([.62,13,.45]),Cl=hr([1.2,12.85,.85]),M4=[{name:"pelvis",a:[0,7.9,0],b:[0,8.9,0],parent:null},{name:"spine1",a:[0,8.9,0],b:[0,10.3,.05],parent:"pelvis"},{name:"spine2",a:[0,10.3,.05],b:[0,11.5,.05],parent:"spine1"},{name:"neck",a:[0,11.5,.05],b:[0,11.9,.1],parent:"spine2"},{name:"head",a:[0,11.9,.1],b:[0,15.3,.4],parent:"neck"},{name:"jaw",a:g4,b:hr([0,12.85,3.75]),parent:"head",reach:0},{name:"crest",a:v4,b:x4,parent:"head"},{name:"cheekL",a:Rl,b:Cl,parent:"head"},{name:"cheekR",a:[-Rl[0],Rl[1],Rl[2]],b:[-Cl[0],Cl[1],Cl[2]],parent:"head"},{name:"tail1",a:[0,6.5,-1.2],b:[0,6,-2],parent:"pelvis",reach:1.3},{name:"tail2",a:[0,6,-2],b:[0,5.6,-2.6],parent:"tail1",reach:1.2},{name:"tail3",a:[0,5.6,-2.6],b:[0,5.35,-3],parent:"tail2",reach:1},{name:"tail4",a:[0,5.35,-3],b:[0,5.2,-3.3],parent:"tail3",reach:.9},{name:"thighL",a:Tc,b:Zn,parent:"pelvis"},{name:"shinL",a:Zn,b:Jn,parent:"thighL"},{name:"footL",a:Jn,b:cm,parent:"shinL"},{name:"thighR",a:Wi(Tc),b:Wi(Zn),parent:"pelvis"},{name:"shinR",a:Wi(Zn),b:Wi(Jn),parent:"thighR"},{name:"footR",a:Wi(Jn),b:Wi(cm),parent:"shinR"},{name:"armL",a:Js,b:Tn,parent:"spine2"},{name:"forearmL",a:Tn,b:Pi,parent:"armL"},{name:"armR",a:Wi(Js),b:Wi(Tn),parent:"spine2"},{name:"forearmR",a:Wi(Tn),b:Wi(Pi),parent:"armR"}],_4={min:[-4.6,.5,-3.8],max:[4.6,18.3,2.5]},Kn=(n,t,e)=>{const i=Math.min(1,Math.max(0,(e-n)/(t-n)));return i*i*(3-2*i)},ui=(n,t,e)=>{const i=Math.sin(n*127.1+t*311.7+e*74.7)*43758.5453;return i-Math.floor(i)};function w4(n,t,e){const i=Math.floor(n),s=Math.floor(t),r=Math.floor(e),a=n-i,o=t-s,c=e-r,l=a*a*(3-2*a),u=o*o*(3-2*o),h=c*c*(3-2*c),f=(d,p,v)=>d+(p-d)*v;return f(f(f(ui(i,s,r),ui(i+1,s,r),l),f(ui(i,s+1,r),ui(i+1,s+1,r),l),u),f(f(ui(i,s,r+1),ui(i+1,s,r+1),l),f(ui(i,s+1,r+1),ui(i+1,s+1,r+1),l),u),h)}function av(n,t,e){if(t<6.5)return 7.3-t;if(t>13.4)return t-12.6;const i=Math.abs(n);let s=lt(n,t,e,0,10,.1,1.85,2.4,1.5);return s=O(s,lt(n,t,e,0,10.8,.4,1.5,1.25,1.2),.6),s=O(s,lt(n,t,e,0,11.45,0,2,1,1.35),.7),s=O(s,xe(i,t,e,2.25,11.85,0,.68),.5),O(s,lt(n,t,e,0,8.3,-.1,1.6,1,1.35),.6)}function ov(n,t,e){return t>Cs+.6||t<Hr-.6?Math.max(t-Cs,Hr-t):Math.max(cv(n,t,e),t-Cs,Hr-t)}function cv(n,t,e){const i=Math.min(1,Math.max(0,(Cs-t)/(Cs-Hr))),s=1-(1-i)*(1-i),r=1+.025*s*Math.cos(Math.atan2(n,e)*12),a=(1.7+.8*s)*r,o=(1.42+.72*s)*r,c=.05-.1*s;return(Math.hypot(n/a,(e-c)/o)-1)*Math.min(a,o)}function b4(n,t,e){const i=Math.abs(n);let s=lt(n,t,e,Ee[0],Ee[1],Ee[2],q0[0],q0[1],q0[2]);if(s=O(s,lt(i,t,e,.9,13,.7,1.05,.9,1),.5),t>14.6)for(const[r,a,o,c]of rv)s=O(s,K(n,t,e,r*.5,15,a,r*1.4,15.2+o,a-c,.45,.08),.4);return Math.max(s,-lt(i,t,e,vn[0],vn[1],vn[2],gn[0]+.05,gn[1]+.05,gn[2]+.05))}const y4=(n,t,e,i)=>i(Ee[0]+(n-Ee[0])/He,Ee[1]+(t-Ee[1])/He,Ee[2]+(e-Ee[2])/He)*He;function lv(n,t,e){return t<10.6?11.4-t:y4(n,t,e,b4)}function hv(n,t,e){if(n<1)return 1.7-n;if(t>13.4)return t-12.8;if(t<4.6)return 5.2-t;let i=K(n,t,e,...Js,...Tn,.6,.56);const s=1.75;i=O(i,K(n,t,e/s,Tn[0],Tn[1],Tn[2]/s,Pi[0],Pi[1],Pi[2]/s,.5,.4),.45);for(let r=0;r<4;r++){const a=-.75+r*.5,o=1.2+.35*(1-Math.abs(a)/.75);i=O(i,K(n,t,e,Pi[0]-.05,Pi[1]+.5,a*.8+.1,Pi[0]+.12,Pi[1]-o,a*1.1+.15,.32,.12),.25)}return i}function uv(n,t,e){if(t>9.4)return t-8.7;if(n>3)return n-2.1;let i=K(n,t,e,...Tc,...Zn,.75,.55);return i=O(i,xe(n,t,e,...Zn,.57),.3),O(i,K(n,t,e,...Zn,...Jn,.53,.42),.3)}function fv(n,t,e){if(e>0)return e+.85;if(t>7.6)return t-6.9;let i=1e9;for(const s of[-1,0,1]){const r=1-Math.abs(s);i=O(i,K(n,t,e,s*.25,6.5,-1.2,s*.7,5.4-r*.2,-3-r*.3,.38,.14),.3)}return i}function S4(n,t,e){const i=Math.abs(n);let s=O(av(n,t,e),lv(n,t,e),.8);return s=O(s,uv(i,t,e),.55),s=O(s,hv(i,t,e),.05+.5*Kn(10.9,11.8,t)),Math.min(s,ov(n,t,e),fv(n,t,e))}const Ts=0,zr=1,Dr=2,Ac=3,so=4,gh=5,ji=new Float64Array(6);let um=NaN,fm=NaN,dm=NaN,vh=0;function kh(n,t,e){if(n===um&&t===fm&&e===dm)return vh;const i=Math.abs(n);ji[Ts]=av(n,t,e),ji[zr]=ov(n,t,e),ji[Dr]=lv(n,t,e),ji[Ac]=hv(i,t,e),ji[so]=uv(i,t,e),ji[gh]=fv(n,t,e);let s=0;for(let r=1;r<6;r++)ji[r]<ji[s]&&(s=r);return um=n,fm=t,dm=e,vh=s,s}const E4=.25,an=n=>ji[n]<=ji[vh]+E4,T4=(n,t,e,i)=>{kh(t,e,i);const s=n.name,r=s.endsWith("L")?1:s.endsWith("R")?-1:0;if(r!==0&&t*r<-.05)return!1;if(s==="pelvis")return an(Ts)||an(zr)||an(gh)||an(so);if(s==="spine1")return an(Ts)||an(zr);if(s==="spine2")return an(Ts);if(s==="neck")return an(Ts)||an(Dr);if(s==="crest")return an(Dr)&&Wo(e)>15.05&&hm(t/He,Wo(e),Y0(i))<.32;if(s==="cheekL"||s==="cheekR"){const a=Wo(e);return an(Dr)&&a<13.85&&a>12.1&&Y0(i)>-.2&&Math.abs(t)/He>.5}return s==="head"?an(Dr)&&!(Wo(e)>15.95&&hm(t/He,Wo(e),Y0(i))<.32):s==="jaw"||s.startsWith("foot")?!1:s.startsWith("tail")?an(gh):s.startsWith("arm")||s.startsWith("forearm")?an(Ac)&&(vh===Ac||e>11.3):s.startsWith("shin")?an(so):s.startsWith("thigh")?an(so)?!0:an(zr)&&i>-.4&&e<Tc[1]+.8&&Math.abs(Math.abs(t)-Tc[0])<1.35:!0},dv=12166120,A4=14998264,R4=1578014,C4=10126548,pv=16053239,mv=1315352,yf=(n,t)=>(t>0?11.2+.55*Kn(.15,1,n):11.65)-.6*Kn(1.35,1.9,n),L4=new gt(pv),pm=new gt(mv),P4=new gt(dv).multiplyScalar(1/1.6),I4=(n,t,e)=>1-Kn(t-e,t+e,Math.abs(n));function D4(n,t,e,i,s){s.copy(L4),n===Ts&&s.lerp(P4,Kn(yf(Math.abs(t),i)-.05,yf(Math.abs(t),i)+.08,e)),s.lerp(pm,I4(e-(Cs-.15),.27,.08)),n===zr&&s.lerp(pm,(1-Kn(Hr+.4,Hr+.56,e))*(cv(t,e,i)>-.12?1:0))}function mm(n,t,e){const s=Math.floor(n/.8),r=Math.floor(t/(.8*1.4)),a=Math.floor(e/.8);for(let o=-1;o<=1;o++)for(let c=-1;c<=1;c++)for(let l=-1;l<=1;l++){const u=s+c,h=r+o,f=a+l;if(ui(u,h,f)>.45)continue;const d=(u+.2+.6*ui(u+7,h,f))*.8,p=(h+.2+.6*ui(u,h+7,f))*.8*1.4,v=(f+.2+.6*ui(u,h,f+7))*.8;if(((n-d)/.44)**2+((t-p)/.75)**2+((e-v)/.44)**2<1)return!0}return!1}function gv(n,t,e){const i=Math.abs(n),s=kh(n,t,e);if(s===zr)return t<Hr+.48||t>Cs-.45?3:2;if(s===Ts){const r=yf(i,e);return t>r+.3?t>11.2&&i>1.5&&mm(n,t,e)?1:0:t>r-.05?2:t<Cs+.12&&t>Cs-.42?3:2}if(s===Dr){const r=Ee[1]+(t-Ee[1])/He,a=Ee[2]+(e-Ee[2])/He;return r>15.2||r>14.2&&a<-.6?5:0}if(s===Ac){if(t<6.6)return 6;const r=t>Tn[1]?Js[0]+(Tn[0]-Js[0])*(Js[1]-t)/(Js[1]-Tn[1]):Tn[0]+(Pi[0]-Tn[0])*Math.min(1,(Tn[1]-t)/(Tn[1]-Pi[1]));return i-r>-.25&&mm(n,t,e)?1:0}return s===so&&t<ph-.05?4:0}function U4(n,t,e){const i=gv(n,t,e);if(i===2||i===3||i===4)return 0;const s=kh(n,t,e),r=Math.abs(n),a=.6+.8*w4(n*1.4+3.1,t*1.4,e*1.4);let o=1;if(s===Dr){const c=r/He,l=Ee[1]+(t-Ee[1])/He,u=Ee[2]+(e-Ee[2])/He,h=Math.hypot((c-vn[0])/gn[0],(l-vn[1])/gn[1],(u-vn[2])/gn[2]);if(h<1.5||u>.95&&c<1.15&&l<13.95&&l>12.2)return 0;const f=Kn(.2,1.2,u)*(1-Kn(1,1.6,c))*(1-Kn(15.2,15.6,l));o=.3*Math.min(1,(h-1.5)/.8)*f+1.3*(1-f),l>15.2?o=1.5:l<12.6&&u>.3&&(o=Math.min(o,.25))}else if(s===Ts)o=(t>11?1.25:.9)*(e>0?1-.55*(1-Kn(.5,1.2,r)):1);else if(s===Ac){const c=Kn(-.4,.4,-e)*.4+Kn(-.2,.3,Js[0]+.6-r)*.4;o=(t<7.2?1.3:1)+c}else s===so?o=t<ph+.7?1.25:.9:s===gh&&(o=1.2);return i===1&&(o*=1.2),o*a}const vv=(n,t,e)=>O(K(n/1.5,t,e,0,13.55,1.2,0,13.05,3.85,.7,.4)*.88,K(n/1.3,t,e,0,13.85,1,0,13.5,2.7,.42,.32),.4),F4=(n,t,e)=>Math.max(vv(n,t,e),mh(e)-t),xv=(n,t,e)=>K(n/1.42,t,e,0,13.1,1.2,0,12.8,3.65,.55,.32)*.9,N4=(n,t,e)=>Math.max(xv(n,t,e),t-mh(e)+.03),k4=new gt(4211536),O4=new gt(8817306),Sf=5903396,B4=13130354,gm=n=>(t,e,i,s)=>{const r=(n?xv:vv)(Math.abs(t)+.09,e,i)<0&&i<3.6;!n&&r&&e<mh(i)+.05?s.setHex(Sf):n&&r&&e>mh(i)-.08?s.setHex(Math.abs(t)<.35&&i>1.7?B4:Sf):s.copy(k4).lerp(O4,Kn(2.9,4.1,i))};function H4(n,t,e){const i=Jn[1];let s=Math.max(lt(n,t,e,0,.32-i,.65,.84,.4,1.72),-(t+i));return s=O(s,lt(n,t,e,0,.78-i,.55,.74,.6,1.5),.2),s=O(s,lt(n,t,e,0,.62-i,1.5,.7,.46,.85),.25),s=O(s,K(n,t,e,0,.95-i,-.2,0,1.4-i,-.15,.62,.6),.3),Math.max(s,-K(n,t,e,0,1.4-i,-.15,0,3-i,-.15,.47,.47))}function z4(n,t,e,i){const s=t+Jn[1];s<.42||e>1.75&&s<.9?i.setHex(16448252):Math.abs(n)<.3&&e>.25&&e<1.55&&s>1?i.setHex(16777215):Math.abs(s-.47)<.05?i.setHex(12105924):i.setHex(14474468)}function V4(){const e=new Uint8Array(65536);for(let s=0;s<128;s++)for(let r=0;r<128;r++){const a=(s+.5)/128,o=(r+.5)/128*Math.PI*2,u=((a*2.6-.38*Math.abs(Math.sin(o)))%.85+.85)%.85<.4&&a<.84;e.set(u?[168,142,224,255]:[246,244,250,255],(s*128+r)*4)}const i=new kr(e,128,128,ln);return i.colorSpace=xn,i.wrapS=uo,i.magFilter=Pe,i.minFilter=Zs,i.generateMipmaps=!0,i.needsUpdate=!0,i}function Xo(n,t,e,i="head"){t.scale.multiplyScalar(He);const s=hr(e);n.at(t,i,s[0],s[1],s[2])}function G4(n){const t=n.std({color:16514047,roughness:.15}),e=n.std({color:2761284,roughness:.1}),i=n.std({color:328712,roughness:.06}),s=n.std({color:1314840,roughness:.5}),r=n.std({color:16777215,emissive:16777215,emissiveIntensity:.8,roughness:.2}),a=n.std({color:11047644,roughness:.85});for(const A of[1,-1]){const w=A>0?"L":"R",y=new de;y.name="vi-eye"+w,y.scale.set(1,gn[1]/gn[0],gn[2]/gn[0]),y.add(new nt(new Xt(gn[0],22,16),t));const E=new de;E.name="vi-look"+w,E.rotation.set(.12,-A*.14,0);for(const[N,B,X]of[[e,.012,.62],[i,.02,.3]]){const H=new nt(new Xt(gn[0]+B,22,6,0,Math.PI*2,0,X),N);H.rotation.x=Math.PI/2,E.add(H)}const R=new nt(new Xt(.07,8,6),r);R.position.set(A*.1,.12,.45),E.add(R),y.add(E);const L=Nc("vi-lid"+w,gn[0],a,{gap:.14});L.rotation.z=0;for(const N of L.children)N.rotation.order="ZXY";const I=new nt(new Hn(gn[0]*1.14+.005,.055,6,24,Math.PI*.8),s);I.rotation.set(Math.PI/2,0,Math.PI*.1),L.children[0].add(I),Mv(L,0,0,0,0,0),y.add(L),Xo(n,y,[A*vn[0],vn[1],vn[2]])}const o=n.std({color:14263361,roughness:.32,metalness:.65}),c=.76,l=vn[2]+gn[2]+.14,u=.3,h=new de;h.name="vi-glasses";for(const A of[1,-1]){const w=new nt(new Hn(c,.12,12,48),o);w.rotation.y=A*u,w.position.set(A*vn[0],0,l),h.add(w);const y=new C(A*(vn[0]+c*Math.cos(u)),.05,l-c*Math.sin(u)),E=new C(A*1.84,.05,-.2),R=new nt(new Mn(.07,.07,y.distanceTo(E),8),o);R.quaternion.setFromUnitVectors(new C(0,1,0),E.clone().sub(y).normalize()),R.position.copy(y).add(E).multiplyScalar(.5),h.add(R)}const f=new nt(new Hn(vn[0]-c*Math.cos(u),.1,8,16,Math.PI),o);f.position.set(0,.05,l+c*Math.sin(u)),h.add(f),Xo(n,h,[0,vn[1],0]);const d=n.std({vertexColors:!0,roughness:.55,metalness:.02}),p=new nt(rn(F4,{min:[-1.15,12.45,.9],max:[1.15,14.35,4.35]},34,gm(!1),12e3),d);p.position.set(-0,-13.2,-1.3);const v=new nt(rn(N4,{min:[-.85,12.45,.9],max:[.85,13.25,4]},30,gm(!0),1e4),d);v.position.set(-0,-13.6,-.25);const g=new de;g.name="vi-upper",g.add(p),Xo(n,g,io);const m=new de;m.add(v),Xo(n,m,Ee,"jaw");const M=new nt(new Xt(1,16,10),n.std({color:Sf,roughness:.6}));M.scale.set(.6,.36,.55),Xo(n,M,[0,io[1]-.05,io[2]+.35]);const x=new je({map:V4(),roughness:.85,side:Te}),_=1.2,b=A=>Zn[2]+(Jn[2]-Zn[2])*(Zn[1]-A)/(Zn[1]-Jn[1]);for(const[A,w]of[["shinL",1],["shinR",-1]]){const y=new C(w*Zn[0],_,b(_)),E=new C(w*Zn[0],ph,b(ph)),R=new nt(new Mn(.6,.53,y.distanceTo(E),40,1,!0),x);R.quaternion.setFromUnitVectors(new C(0,1,0),E.clone().sub(y).normalize());const L=y.add(E).multiplyScalar(.5);n.at(R,A,L.x,L.y,L.z)}const S=rn(H4,{min:[-.95,-Jn[1]-.05,-1.2],max:[.95,.75,2.45]},26,z4,1e4),T=n.std({vertexColors:!0,roughness:.55});for(const[A,w]of[["footL",1],["footR",-1]])n.at(new nt(S,T),A,w*Jn[0],Jn[1],Jn[2])}const $l=n=>n<0?0:n>1?1:n,W4=-1.12,X4=.95,$4=.2,q4=.04;function Mv(n,t,e,i,s,r){const a=n.children[0],o=n.children[1];if(!a||!o)return;const c=$l(t),l=W4-.38*i+.3*e+.55*s,u=X4+.2*i-.62*e;a.rotation.x=l+($4-l)*c,o.rotation.x=u+(q4-u)*c,a.rotation.z=r*(1-c)}function j0(n,t,e,i,s){const r=Math.min(12,Math.ceil(e/.008)),a=r>0?e/r:0;for(let o=0;o<r;o++)n.v+=(i*i*(t-n.x)-2*s*i*n.v)*a,n.x+=n.v*a}const vm=new WeakMap;function Y4(n){let t=vm.get(n);if(t)return t;const e=o=>n.getObjectByName(o)??null,i=[e("vi-lookL"),e("vi-lookR")],s=[e("cheekL"),e("cheekR")],r=e("vi-glasses"),a=e("head");return t={lids:[e("vi-lidL"),e("vi-lidR")],looks:i,lookRest:i.flatMap(o=>[o?.rotation.x??0,o?.rotation.y??0]),glasses:r,glassesY:r?.position.y??0,upper:e("vi-upper"),crest:e("crest"),cheeks:s,cheekRest:s.map(o=>o?.position.clone()??new C),head:a,prev:a?.quaternion.clone()??new ie,dq:new ie,t:NaN,cx:{x:0,v:0},cy:{x:0,v:0},cz:{x:0,v:0}},vm.set(n,t),t}function j4(n,t,e){const i=Y4(n),s=Number.isNaN(i.t),r=s?0:Math.min(.1,Math.max(0,t-i.t));i.t=t;const a=(t+1.3)%4.4,o=a<.18?Math.sin(a/.18*Math.PI):0,c=e?e.smileL||e.smileR?e.smileL:e.smile:0,l=e?e.smileL||e.smileR?e.smileR:e.smile:0,u=e?.browDownL??0,h=e?.browDownR??0,f=e?.browUp??0,d=e?.browOuterL??0,p=e?.browOuterR??0,v=e?.puff??0,g=e?.jaw??0;for(let m=0;m<2;m++){const M=i.lids[m];if(!M)continue;const x=m===0?1:-1,_=e?m===0?e.blinkL:e.blinkR:o,b=e?$l(Math.max(m===0?e.squintL:e.squintR,.6*(m===0?c:l))):0,S=e?m===0?e.wideL:e.wideR:0,T=m===0?u:h;Mv(M,_,b,S,T,x*(.3*T-.22*f))}for(let m=0;m<2;m++){const M=i.looks[m];M&&M.rotation.set(i.lookRest[m*2]-(e?.lookY??0)*.34,i.lookRest[m*2+1]+(e?.lookX??0)*.5,0)}if(i.glasses){const m=Math.max(-.13,Math.min(.13,.1*(d-p)+.08*(h-u)+.04*(c-l))),M=.16*f+.08*(d+p)+.05*(c+l)+vn[0]*Math.abs(Math.sin(m));i.glasses.position.y=i.glassesY+M*He,i.glasses.rotation.z=m}i.upper&&(i.upper.rotation.x=-(.1*g+.08*(e?.sneer??0)));for(let m=0;m<2;m++){const M=i.cheeks[m];if(!M)continue;const x=m===0?1:-1,_=m===0?c:l,b=i.cheekRest[m];M.position.set(b.x+x*.3*v*He,b.y+(.16*_-.05*v)*He,b.z+(.14*v+.04*_)*He),M.scale.setScalar(1+.14*v+.05*_)}if(i.crest){const m=e?$l(Math.max(f,.5*(d+p))+.25*(e.wideL+e.wideR)+.35*g*f):0,M=e?$l(Math.max(.5*(u+h),.7*e.frown)):0,x=.45*m-.6*M+(e?0:.05*Math.sin(t*1.1)),_=e?.3*(d-p)+.25*(h-u):.03*Math.sin(t*.7);if(s&&(i.cx.x=x,i.cz.x=_,i.cy.x=0),i.head&&!s){const b=i.dq.copy(i.prev).invert().multiply(i.head.quaternion),S=b.w<0?-2:2;i.cx.x-=.9*b.x*S,i.cy.x-=.6*b.y*S,i.cz.x-=.9*b.z*S}i.head&&i.prev.copy(i.head.quaternion),j0(i.cx,x,r,11,.3),j0(i.cy,0,r,10,.3),j0(i.cz,_,r,11,.3),i.cx.x=Math.max(-1,Math.min(.8,i.cx.x)),i.cy.x=Math.max(-.5,Math.min(.5,i.cy.x)),i.cz.x=Math.max(-.6,Math.min(.6,i.cz.x)),i.crest.rotation.set(i.cx.x,i.cy.x,i.cz.x),i.crest.scale.set(1,1+.14*m-.08*M,1)}}const Z4={id:"violet",name:"Violet",blurb:"The Valkyries’ lavender raven, in gold glasses",segs:M4,body:{sdf:S4,region:gv,box:_4,palette:[dv,R4,pv,mv,16184570,A4,C4],surface:"soft",capture:T4,fur:{length:1,density:4.5,tip:.3},furLen:U4,tint(n,t,e,i,s){const r=kh(t,e,i);(n===2||n===3)&&(r===Ts||r===zr)&&D4(r,t,e,i,s),n>=2&&n<=4&&s.multiplyScalar(1.6),n!==2&&n!==3&&i<-.6&&s.multiplyScalar(1-.12*Math.min(1,(-.6-i)/1.5))}},dress:G4,tick:j4,fit:{size:1.1,limb:.55},idle:{tail:.12},face:{jaw:.45,eyes:[[Ea[0],Ea[1],Ea[2],lm],[-Ea[0],Ea[1],Ea[2],lm]]},res:72,furShells:9},_v=[{name:"pelvis",a:[0,9.6,0],b:[0,10.6,0],parent:null},{name:"spine1",a:[0,10.6,0],b:[0,12.4,.1],parent:"pelvis"},{name:"spine2",a:[0,12.4,.1],b:[0,15,.1],parent:"spine1"},{name:"neck",a:[0,15,.1],b:[0,15.9,.15],parent:"spine2",reach:.8},{name:"head",a:[0,15.9,.15],b:[0,18.4,.3],parent:"neck"},{name:"jaw",a:[0,16.4,.9],b:[0,16.4,1.2],parent:"head",reach:0},{name:"tail1",a:[0,14.8,-1.2],b:[0,12.6,-1.4],parent:"spine2",reach:1},{name:"tail2",a:[0,12.6,-1.4],b:[0,10.4,-1.6],parent:"tail1",reach:1},{name:"tail3",a:[0,10.4,-1.6],b:[0,8.2,-1.8],parent:"tail2",reach:1},{name:"tail4",a:[0,8.2,-1.8],b:[0,6.2,-2],parent:"tail3",reach:1},{name:"thighL",a:[1.1,9.6,0],b:[1.2,5.3,.2],parent:"pelvis"},{name:"shinL",a:[1.2,5.3,.2],b:[1.2,1.1,-.1],parent:"thighL"},{name:"footL",a:[1.2,1.1,-.1],b:[1.2,.35,1.4],parent:"shinL"},{name:"thighR",a:[-1.1,9.6,0],b:[-1.2,5.3,.2],parent:"pelvis"},{name:"shinR",a:[-1.2,5.3,.2],b:[-1.2,1.1,-.1],parent:"thighR"},{name:"footR",a:[-1.2,1.1,-.1],b:[-1.2,.35,1.4],parent:"shinR"},{name:"armL",a:[2.4,14.6,0],b:[2.72,11.9,-.05],parent:"spine2"},{name:"forearmL",a:[2.72,11.9,-.05],b:[2.85,9.45,.4],parent:"armL"},{name:"armR",a:[-2.4,14.6,0],b:[-2.72,11.9,-.05],parent:"spine2"},{name:"forearmR",a:[-2.72,11.9,-.05],b:[-2.85,9.45,.4],parent:"armR"}],J4={min:[-4.2,-.4,-2.8],max:[4.2,20.4,2.6]};function K4(n,t,e,i){const s=Math.abs(n),r=1-.08*i;let a=lt(n,t,e,0,13.35,.1,1.8*r,1.95,1.05*r);return a=O(a,lt(s,t,e,.85*r,13.75,.75,.95*r,.68,.5),.45),a=O(a,lt(n,t,e,0,13.75,-.35,1.95*r,1.3,.62),.4),a=O(a,K(s,t,e,0,15.35,-.2,1.85*r,14.95,-.1,.5,.36),.5),a=O(a,lt(n,t,e,0,11.6,.12,1.35*r,1.45,.92*r),.6),a=O(a,lt(n,t,e,0,10,0,1.68*r,1,1.02*r),.6),a=O(a,lt(s,t,e,.72,9.55,-.5,.82*r,.85,.62),.4),a=Math.max(a,-K(n,t,e,0,14.6,-1.12,0,10.6,-.98,.16,.14)),a=O(a,K(n,t,e,0,14.9,-.05,0,16.3,.12,.6,.52),.4),a=O(a,lt(n,t,e,0,17.3,.1,.95,1.12,1.08),.3),a=O(a,lt(n,t,e,0,16.55,.4,.74,.74,.82),.35),a=O(a,lt(s,t,e,2.3*r,14.5,0,.7*r,.92,.78),.4),a=O(a,K(s,t,e,2.4,14.4,0,2.72,11.95,-.05,.56*r,.42*r),.3),a=O(a,lt(s,t,e,2.56,13.15,.12,.5*r,.95,.5*r),.3),a=O(a,K(s,t,e,2.72,11.9,-.05,2.85,9.6,.38,.46*r,.3*r),.25),a=O(a,lt(s,t,e,2.76,11.2,.05,.48*r,.8,.48*r),.3),a=O(a,lt(s,t,e,2.87,9,.48,.24,.52,.42),.2),a=O(a,K(s,t,e,2.8,9.35,.75,2.72,8.85,.95,.15,.12),.12),a=O(a,K(s,t,e,1.02,9.6,0,1.15,5.45,.2,.9*r,.56*r),.45),a=O(a,lt(s,t,e,1.12,7.7,.28,.8*r,1.6,.72*r),.4),a=O(a,lt(s,t,e,.8,8.3,0,.55*r,1.3,.6),.4),a=O(a,xe(s,t,e,1.17,5.3,.32,.52*r),.3),a=O(a,K(s,t,e,1.18,5.25,.15,1.2,1.15,-.1,.5*r,.3*r),.3),a=O(a,lt(s,t,e,1.2,3.95,-.28,.56*r,1.3,.6*r),.35),a=O(a,Math.max(lt(s,t,e,1.2,.5,.55,.46,.5,1.25),-t),.25),a}function Q4(n,t,e,i,s=0){const r=Math.abs(n);let a=K4(n,t,e,0);return a=O(a,lt(n,t,e,0,17.3,.12,1.08,1.24,1.18),.25),a=O(a,lt(n,t,e,0,16.5,.45,.82,.72,.86),.25),a=O(a,K(n,t,e,0,18.42,-.7,0,18.5,.85,.16,.12),.2),a=O(a,lt(n,t,e,0,10.55,.05,1.55,.38,1.1),.15),a=O(a,lt(n,t,e,0,10.55,1.05,.55,.42,.22),.1),a=O(a,K(r,t,e,2.82,10.25,.3,2.86,9.5,.42,.4,.38),.15),a=O(a,K(r,t,e,1.2,3.2,-.05,1.2,1,-.08,.52,.48),.2),a-s}function tT(n,t,e,i){const s=Math.abs(n);if(t>16.75&&t<17.5&&e>.9&&s<.95)return 2;if(Math.abs(t-10.6)<.45&&e>-1.5)return 3;if(t<3.2||t<10.4&&s>2.3&&t>8.2)return 1;if(e>.7&&s<1.7){const r=t-12.6-s*.55;if(r>0&&r<.35||r>.75&&r<1.1)return 1}return 0}const eT=[{name:"pelvis",a:[0,7.6,-.4],b:[0,8.8,0],parent:null},{name:"spine1",a:[0,8.8,0],b:[0,10.8,.3],parent:"pelvis"},{name:"spine2",a:[0,10.8,.3],b:[0,12.6,.6],parent:"spine1"},{name:"neck",a:[0,12.6,.6],b:[0,15.6,1.3],parent:"spine2",reach:1.9},{name:"head",a:[0,15.6,1.3],b:[0,17.6,2.4],parent:"neck"},{name:"jaw",a:[0,15.9,2.6],b:[0,15.7,4.4],parent:"head",reach:0},{name:"crest",a:[0,18.05,1.55],b:[0,20.6,.4],parent:"head"},{name:"cheekL",a:[.6,16.3,2.15],b:[1.15,16.15,2.6],parent:"head"},{name:"cheekR",a:[-.6,16.3,2.15],b:[-1.15,16.15,2.6],parent:"head"},{name:"tail1",a:[0,7.4,-2.6],b:[0,6.8,-3.6],parent:"pelvis",reach:1.4},{name:"tail2",a:[0,6.8,-3.6],b:[0,6.2,-4.5],parent:"tail1",reach:1.4},{name:"tail3",a:[0,6.2,-4.5],b:[0,5.7,-5.2],parent:"tail2",reach:1.2},{name:"tail4",a:[0,5.7,-5.2],b:[0,5.3,-5.7],parent:"tail3",reach:1},{name:"thighL",a:[1.4,7.4,0],b:[1.5,4.6,.3],parent:"pelvis"},{name:"shinL",a:[1.5,4.6,.3],b:[1.5,.9,-.2],parent:"thighL"},{name:"footL",a:[1.5,.9,-.2],b:[1.5,.3,1.8],parent:"shinL"},{name:"thighR",a:[-1.4,7.4,0],b:[-1.5,4.6,.3],parent:"pelvis"},{name:"shinR",a:[-1.5,4.6,.3],b:[-1.5,.9,-.2],parent:"thighR"},{name:"footR",a:[-1.5,.9,-.2],b:[-1.5,.3,1.8],parent:"shinR"},{name:"armL",a:[2.7,11.6,.2],b:[3.3,9.2,-.1],parent:"spine2"},{name:"forearmL",a:[3.3,9.2,-.1],b:[3.2,7,.3],parent:"armL"},{name:"armR",a:[-2.7,11.6,.2],b:[-3.3,9.2,-.1],parent:"spine2"},{name:"forearmR",a:[-3.3,9.2,-.1],b:[-3.2,7,.3],parent:"armR"}],nT={min:[-5,-.4,-7.2],max:[5,21.4,6.6]},kn=[.72,17.25,2.75],Ll=.52;function xm(n,t,e){let i=1e9;for(const[s,r]of[[0,1],[.6,.82],[-.6,.82]])i=Math.min(i,K(n,t,e,s*.5,18.1,1.6,s*1.3,18.1+2.7*r,1-.7*r,.34,.12));return i}function iT(n,t,e,i=0){const s=Math.abs(n);let r=lt(n,t,e,0,9.2,-.2,3.3,3.5,3);r=O(r,lt(n,t,e,0,11.4,.5,2.5,2.2,2.3),1),r=O(r,K(n,t,e,0,12.2,.5,0,15.8,1.4,1.25,.95),.8);let a=xe(n,t,e,0,16.9,1.8,1.55);if(t>17.4)for(const[o,c]of[[0,1],[.6,.82],[-.6,.82]])a=O(a,K(n,t,e,o*.5,18.1,1.6,o*1.3,18.1+2.7*c,1-.7*c,.34,.12),.3);a=Math.max(a,-xe(s,t,e,kn[0],kn[1],kn[2],.5)),r=O(r,a,.5),r=O(r,lt(s,t,e,3,9.8,0,.75,2.6,1.7),.7);for(const o of[-1,0,1])r=O(r,K(s,t,e,3.2,8.4,o*.6,3.25,6.6+Math.abs(o)*.4,o*.75+.2,.42,.14),.3);for(const o of[-1,0,1])r=O(r,K(n,t,e,o*.3,7.6,-2.6,o*1.1,7+(1-Math.abs(o))*.5,-5.6,.5,.2),.4);r=O(r,K(s,t,e,1.4,7.4,0,1.5,4.8,.3,1,.55),.5),r=O(r,K(s,t,e,1.5,4.8,.3,1.5,1,-.2,.42,.36),.25),r-=i;for(const o of[-1,0,1])r=O(r,K(s,t,e,1.5,.5,.1,1.5+o*.85,.3,2-Math.abs(o)*.3,.34,.16),.2);return r=O(r,K(s,t,e,1.5,.5,-.2,1.5,.3,-1.1,.3,.14),.15),r}function wv(n,t,e){const i=Math.abs(n);return t>15.6&&t<17.1&&e>2.6&&i<.85||t<5&&i>.9&&i<2.6||t<1?3:t>18.4||e<-4.6?2:e>1.2&&t>9.4&&t<13.4&&i<1.8||e>2.2&&t>16.2&&t<18.2&&i<1.25?1:0}function sT(n,t,e){const i=Math.abs(n),s=wv(n,t,e);return s===3||Math.hypot(i-kn[0],t-kn[1],e-kn[2])<.9?0:s===2?.6:t>16?.45:t>14.6&&e>1.6?.3:t>12.2?1.25:e<-2.4?1.4:1}function rT(n){return(t,e,i,s)=>{const r=t.name;return r==="jaw"?!1:r==="crest"?i>17.9&&xm(e,i,s)<.4:r==="cheekL"||r==="cheekR"?(r==="cheekL"?e:-e)>.6&&i>15.3&&i<16.75&&s>1.7:r==="head"&&i>18.75&&xm(e,i,s)<.4?!1:n(t,e,i,s)}}const aT=(n,t,e)=>{const i=Math.min(1,Math.max(0,(e-n)/(t-n)));return i*i*(3-2*i)},lc=n=>16.02-.06*(n-2.7),oT=(n,t,e)=>K(n,t,e,0,16.55,2.9,0,16.1,5,.72,.18),cT=(n,t,e)=>Math.max(oT(n,t,e),lc(e)-t),Ef=(n,t,e)=>K(n,t,e,0,15.85,2.8,0,15.75,4.4,.5,.14),lT=(n,t,e)=>Math.max(Ef(n,t,e),t-lc(e)+.03),hT=new gt(15759906),uT=new gt(16163402),Tf=6951968,fT=15229050,Mm=n=>(t,e,i,s)=>{const r=n?Ef(Math.abs(t)+.08,e,i)<0:Ef(Math.abs(t)+.1,lc(i)-.12,i)<0;!n&&r&&e<lc(i)+.05&&i<4.7?s.setHex(Tf):n&&r&&i<4.7&&e>lc(i)-.07?s.setHex(Math.abs(t)<.24&&i>3?fT:Tf):s.copy(hT).lerp(uT,aT(3.9,5,i))},dT=[0,15.9,2.6];function pT(n){const t=n.std({color:16316660,roughness:.2}),e=n.std({color:657936,roughness:.1}),i=n.std({color:16777215,emissive:16777215,emissiveIntensity:.8,roughness:.2}),s=n.std({color:15247372,roughness:.8}),r=n.std({color:5909512,roughness:.6});for(const h of[1,-1]){const f=h>0?"L":"R",d=new de;d.name="pl-eye"+f,d.add(new nt(new Xt(Ll,22,16),t));const p=new de;p.name="pl-look"+f,p.rotation.set(.04,-h*.2,0);const v=new nt(new Xt(Ll+.012,22,6,0,Math.PI*2,0,.44),e);v.rotation.x=Math.PI/2,p.add(v);const g=new nt(new Xt(.06,8,6),i);g.position.set(h*.08,.1,.47),p.add(g),d.add(p);const m=Nc("pl-lid"+f,Ll,s,{gap:.08});for(const x of m.children)x.rotation.order="ZXY";const M=new nt(new Hn(Ll*1.08+.005,.045,6,24,Math.PI*.8),r);M.rotation.set(Math.PI/2,0,Math.PI*.1),m.children[0].add(M),bv(m,0,0,0,0,0),d.add(m),n.at(d,"head",h*kn[0],kn[1],kn[2])}const a=n.std({vertexColors:!0,roughness:.5,metalness:.02}),o=new nt(rn(cT,{min:[-.8,15.85,2.1],max:[.8,17.35,5.25]},34,Mm(!1),12e3),a);o.position.set(-0,-15.9,-2.6);const c=new de;c.name="pl-upper",c.add(o),n.at(c,"head",...dT);const l=new nt(rn(lT,{min:[-.56,15.2,2.2],max:[.56,16.1,4.65]},30,Mm(!0),1e4),a);n.at(l,"jaw",0,0,0);const u=new nt(new Xt(1,16,10),n.std({color:Tf,roughness:.6}));u.scale.set(.38,.3,.55),n.at(u,"head",0,15.97,3)}const ql=n=>n<0?0:n>1?1:n,mT=-1.25,gT=1,vT=.2,xT=.04;function bv(n,t,e,i,s,r){const a=n.children[0],o=n.children[1];if(!a||!o)return;const c=ql(t),l=mT-.3*i+.35*e+.7*s,u=gT+.2*i-.62*e;a.rotation.x=l+(vT-l)*c,o.rotation.x=u+(xT-u)*c,a.rotation.z=r*(1-c)}function Z0(n,t,e,i,s){const r=Math.min(12,Math.ceil(e/.008)),a=r>0?e/r:0;for(let o=0;o<r;o++)n.v+=(i*i*(t-n.x)-2*s*i*n.v)*a,n.x+=n.v*a}const _m=new WeakMap;function MT(n){let t=_m.get(n);if(t)return t;const e=a=>n.getObjectByName(a)??null,i=[e("pl-lookL"),e("pl-lookR")],s=[e("cheekL"),e("cheekR")],r=e("head");return t={lids:[e("pl-lidL"),e("pl-lidR")],looks:i,lookRest:i.flatMap(a=>[a?.rotation.x??0,a?.rotation.y??0]),upper:e("pl-upper"),crest:e("crest"),cheeks:s,cheekRest:s.map(a=>a?.position.clone()??new C),head:r,prev:r?.quaternion.clone()??new ie,dq:new ie,t:NaN,cx:{x:0,v:0},cy:{x:0,v:0},cz:{x:0,v:0}},_m.set(n,t),t}function _T(n,t,e){const i=MT(n),s=Number.isNaN(i.t),r=s?0:Math.min(.1,Math.max(0,t-i.t));i.t=t;const a=(t+2.1)%3.9,o=a<.18?Math.sin(a/.18*Math.PI):0,c=e?e.smileL||e.smileR?e.smileL:e.smile:0,l=e?e.smileL||e.smileR?e.smileR:e.smile:0,u=e?.browDownL??0,h=e?.browDownR??0,f=e?.browUp??0,d=e?.browOuterL??0,p=e?.browOuterR??0,v=e?.puff??0,g=e?.jaw??0;for(let m=0;m<2;m++){const M=i.lids[m];if(!M)continue;const x=m===0?1:-1,_=m===0?u:h,b=e?m===0?e.blinkL:e.blinkR:o,S=e?ql(Math.max(m===0?e.squintL:e.squintR,.6*(m===0?c:l))):0;bv(M,b,S,e?m===0?e.wideL:e.wideR:0,_,x*(.3*_-.22*f))}for(let m=0;m<2;m++){const M=i.looks[m];M&&M.rotation.set(i.lookRest[m*2]-(e?.lookY??0)*.36,i.lookRest[m*2+1]+(e?.lookX??0)*.5,0)}i.upper&&(i.upper.rotation.x=-(.1*g+.08*(e?.sneer??0)));for(let m=0;m<2;m++){const M=i.cheeks[m];if(!M)continue;const x=m===0?1:-1,_=m===0?c:l,b=i.cheekRest[m];M.position.set(b.x+x*.22*v,b.y+.16*_-.04*v,b.z+.1*v+.04*_),M.scale.setScalar(1+.1*v+.05*_)}if(i.crest){const m=e?ql(Math.max(f,.5*(d+p))+.25*(e.wideL+e.wideR)+.35*g*f):0,M=e?ql(Math.max(.5*(u+h),.7*e.frown)):0,x=.42*m-.6*M+(e?0:.05*Math.sin(t*1.1)),_=e?.3*(d-p)+.25*(h-u):.03*Math.sin(t*.7);if(s&&(i.cx.x=x,i.cz.x=_,i.cy.x=0),i.head&&!s){const b=i.dq.copy(i.prev).invert().multiply(i.head.quaternion),S=b.w<0?-2:2;i.cx.x-=.9*b.x*S,i.cy.x-=.6*b.y*S,i.cz.x-=.9*b.z*S}i.head&&i.prev.copy(i.head.quaternion),Z0(i.cx,x,r,11,.3),Z0(i.cy,0,r,10,.3),Z0(i.cz,_,r,11,.3),i.cx.x=Math.max(-1,Math.min(.8,i.cx.x)),i.cy.x=Math.max(-.5,Math.min(.5,i.cy.x)),i.cz.x=Math.max(-.6,Math.min(.6,i.cz.x)),i.crest.rotation.set(i.cx.x,i.cy.x,i.cz.x),i.crest.scale.set(1,1+.12*m-.08*M,1)}}const Id=[{name:"pelvis",a:[0,9.2,0],b:[0,10.4,0],parent:null},{name:"spine1",a:[0,10.4,0],b:[0,12.4,.1],parent:"pelvis"},{name:"spine2",a:[0,12.4,.1],b:[0,15.4,.2],parent:"spine1"},{name:"neck",a:[0,15.4,.2],b:[0,16.2,.3],parent:"spine2",reach:.9},{name:"head",a:[0,16.2,.3],b:[0,18.4,.6],parent:"neck"},{name:"jaw",a:[0,16.4,1.2],b:[0,16.4,1.6],parent:"head",reach:0},{name:"tail1",a:[0,9.2,-.5],b:[0,9,-1],parent:"pelvis",reach:0},{name:"tail2",a:[0,9,-1],b:[0,8.8,-1.5],parent:"tail1",reach:0},{name:"tail3",a:[0,8.8,-1.5],b:[0,8.6,-2],parent:"tail2",reach:0},{name:"tail4",a:[0,8.6,-2],b:[0,8.4,-2.5],parent:"tail3",reach:0},{name:"thighL",a:[2.1,9.2,0],b:[2.3,5.2,.3],parent:"pelvis"},{name:"shinL",a:[2.3,5.2,.3],b:[2.3,1.2,-.1],parent:"thighL"},{name:"footL",a:[2.3,1.2,-.1],b:[2.3,.4,1.8],parent:"shinL"},{name:"thighR",a:[-2.1,9.2,0],b:[-2.3,5.2,.3],parent:"pelvis"},{name:"shinR",a:[-2.3,5.2,.3],b:[-2.3,1.2,-.1],parent:"thighR"},{name:"footR",a:[-2.3,1.2,-.1],b:[-2.3,.4,1.8],parent:"shinR"},{name:"armL",a:[4.1,14.7,.2],b:[4.5,11.6,.4],parent:"spine2"},{name:"forearmL",a:[4.5,11.6,.4],b:[4.5,8.4,1],parent:"armL"},{name:"armR",a:[-4.1,14.7,.2],b:[-4.5,11.6,.4],parent:"spine2"},{name:"forearmR",a:[-4.5,11.6,.4],b:[-4.5,8.4,1],parent:"armR"}],wT={min:[-6.4,-.4,-4.4],max:[6.4,19.8,4]};function qe(n,t,e,i,s,r,a,o,c,l){const u=Math.abs(n-i)-a+l,h=Math.abs(t-s)-o+l,f=Math.abs(e-r)-c+l;return Math.hypot(Math.max(u,0),Math.max(h,0),Math.max(f,0))+Math.min(Math.max(u,h,f),0)-l}function wm(n,t,e,i,s,r,a,o,c){const l=Math.abs(n-i)-a+c,u=Math.hypot(t-s,e-r)-o+c;return Math.hypot(Math.max(l,0),Math.max(u,0))+Math.min(Math.max(l,u),0)-c}function yv(n,t,e,i,s,r,a,o){let c=n-i,l=t-s,u=e-r;const h=Math.cos(a),f=Math.sin(a);[c,u]=[c*h-u*f,c*f+u*h];const d=Math.cos(o),p=Math.sin(o);return[c,l]=[c*d+l*p,-c*p+l*d],[c,l,u]}const yn={hx:1.5,hy:14.6,hz:-2.15,yaw:.4,roll:.62,w:1.1,h:.85,t:.12};function bT(n,t,e){const[i,s,r]=yv(n,t,e,yn.hx,yn.hy,yn.hz,yn.yaw,yn.roll);return qe(i,s,r,yn.w,yn.h,0,yn.w,yn.h,yn.t,.1)}function yT(n,t,e,i=0){const s=Math.abs(n);let r=1e9;{const a=qe(n,t,e,0,13.75,.25,2.9,1.75,1.75,.3),o=(e-(2-Math.max(0,t-13.4)*.6))*.86;r=Math.max(a,o)}return r=O(r,qe(n,t,e,0,12.2,.3,2.3,.6,1.5,.3),.3),r=Math.min(r,qe(n,t,e,0,12.55,1.95,2.5,.22,.28,.1)),r=Math.min(r,qe(s,t,e,2.2,13.1,1.92,.42,.26,.15,.08)),r=Math.min(r,qe(n,t,e,0,11.1,.75,1.15,.9,.55,.25)),r=O(r,qe(n,t,e,0,11,0,1.2,1,1.05,.3),.2),r=O(r,qe(n,t,e,0,9.75,0,2.2,.75,1.4,.3),.25),r=Math.min(r,qe(n,t,e,0,9.45,1.35,.7,.7,.25,.15)),r=Math.min(r,qe(n,t,e,0,13.5,-1.85,2.2,1.6,.55,.25)),r=Math.min(r,bT(s,t,e)),r=Math.min(r,K(n,t,e,0,15.3,.25,0,16.3,.35,.6,.55)),r=Math.min(r,qe(n,t,e,0,17.25,.45,.82,.92,.9,.35)),r=Math.min(r,qe(n,t,e,0,16.55,.95,.55,.38,.42,.18)),r=Math.min(r,qe(n,t,e,0,18.2,.35,.12,.35,.75,.08)),r=Math.min(r,qe(s,t,e,.95,17.55,.25,.12,.62,.3,.08)),r=Math.min(r,qe(s,t,e,4.05,15.05,.2,1.15,.8,1.35,.3)),r=Math.min(r,wm(s,t,e,5.4,14.7,.2,.32,.92,.12)),r=Math.min(r,xe(s,t,e,4.1,14.4,.2,.75)),r=Math.min(r,K(s,t,e,4.1,14.2,.2,4.5,11.8,.4,.62,.58)),r=Math.min(r,xe(s,t,e,4.5,11.6,.4,.72)),r=Math.min(r,qe(s,t,e,4.55,10,.6,.9,1.5,1,.3)),r=Math.min(r,qe(s,t,e,4.55,8.05,1,.75,.75,.8,.28)),r=Math.min(r,K(s,t,e,2.1,9.1,0,2.3,5.6,.25,1.05,.95)),r=Math.min(r,qe(s,t,e,2.3,5.25,.85,.85,.75,.55,.25)),r=Math.min(r,qe(s,t,e,2.3,3,.05,1.25,2.15,1.35,.35)),r=Math.min(r,wm(s,t,e,3.75,2.6,-.35,.3,.9,.12)),r=Math.min(r,qe(s,t,e,2.3,.5,.65,1.15,.5,2,.2)),r-i}function ST(n,t,e){const i=Math.abs(n);if(i>5&&Math.hypot(t-14.7,e-.2)<1)return Math.hypot(t-14.7,e-.2)<.42?1:5;if(i>3.38&&Math.hypot(t-2.6,e+.35)<.98)return Math.hypot(t-2.6,e+.35)<.4?1:5;if(t>16.95&&t<17.3&&e>1.2&&i>.12&&i<.62||t>12.85&&t<13.35&&e>1.95&&i>1.85&&i<2.6)return 2;if(t>13.55&&t<15.35&&i<2.55&&i>.18&&e>1.75-Math.max(0,t-13.4)*.6)return 4;if(t>16.15&&t<16.95&&e>1.25&&i<.6)return 6;if(e<-1.9&&t>13.8){const[s,r,a]=yv(i,t,e,yn.hx,yn.hy,yn.hz,yn.yaw,yn.roll);if(Math.abs(a)<.3&&s>.25&&s<1.75&&r>.85&&r<1.5)return 4}return t>12.3&&t<12.8&&e>1.65||t>14.25&&t<15.9&&i>2.9&&i<5.15||t>4.5&&t<6&&e>.4&&i>1.4&&i<3.2||t<1.1&&e>1.6||t>17.9&&i<.2?1:Math.hypot(i-4.1,t-14.4,e-.2)<.85&&t<14.25||Math.hypot(i-4.5,t-11.6,e-.4)<.8||t>15.2&&t<16.2&&i<.7||t>10.2&&t<11.6&&e<1.25&&i<1.25?3:0}function Le(n,t,e,i,s,r,a,o,c,l){const u=Math.abs(n-i)-a+l,h=Math.abs(t-s)-o+l,f=Math.abs(e-r)-c+l;return Math.hypot(Math.max(u,0),Math.max(h,0),Math.max(f,0))+Math.min(Math.max(u,h,f),0)-l}const ET={min:[-6.8,-.4,-4.6],max:[6.8,20.2,5]};function TT(n,t,e,i=0){const s=Math.abs(n);let r=1e9;r=Math.min(r,Le(n,t,e,0,13.6,.2,3.1,2.1,2,.5)),r=Math.min(r,lt(n,t,e,0,14.3,2.15,1.05,.7,.75)),r=Math.min(r,Le(n,t,e,0,12.4,2,.9,1,.4,.3)),r=Math.min(r,Le(s,t,e,1.7,15.6,-2.3,.18,2.4,1.1,.12)),r=Math.min(r,Le(n,t,e,0,13,-2.3,2.2,1.6,.6,.3)),r=O(r,Le(n,t,e,0,11.2,.1,1.9,1.1,1.35,.35),.3),r=O(r,Le(n,t,e,0,9.7,0,2.5,.95,1.55,.3),.3),r=Math.min(r,Le(n,t,e,0,9.4,1.4,.8,.9,.35,.2)),r=Math.min(r,K(n,t,e,0,15.3,.2,0,16.4,.3,.75,.7)),r=Math.min(r,Le(n,t,e,0,17.2,.4,1,1,1.1,.4)),r=Math.min(r,Le(n,t,e,0,16.6,1.25,.65,.45,.35,.15)),r=Math.min(r,Le(n,t,e,0,18.6,.3,.13,.75,.9,.08)),r=Math.min(r,K(s,t,e,.95,17.7,.4,1.5,18.5,.2,.2,.08)),r=Math.min(r,Le(s,t,e,4.2,15.4,.1,1.55,.85,1.7,.35)),r=Math.min(r,K(s,t,e,4.2,15.5,1.6,4.2,15.5,3.9,.3,.26)),r=Math.min(r,xe(s,t,e,4.1,14.4,.2,1)),r=Math.min(r,K(s,t,e,4.1,14.2,.2,4.5,11.8,.4,.85,.8)),r=Math.min(r,xe(s,t,e,4.5,11.6,.4,.9)),r=Math.min(r,Le(s,t,e,4.8,10,.6,1,1.7,1.3,.3)),r=Math.min(r,Le(s,t,e,5.85,10,.6,.22,1.8,1.35,.18)),r=Math.min(r,Le(s,t,e,4.75,7.9,1,.85,.85,.95,.3)),r=Math.min(r,K(s,t,e,2.1,9.1,0,2.3,5.8,.25,1.15,1.1)),r=Math.min(r,Le(s,t,e,2.3,5.4,.6,1.15,1.05,1,.3)),r=Math.min(r,Le(s,t,e,2.3,3,0,1.2,2,1.25,.3));for(const a of[3.8,1.9])r=Math.min(r,K(s,t,e,3.35,a,-.4,3.75,a,-.4,.75,.75));return r=Math.min(r,Le(s,t,e,2.3,.55,.65,1.15,.55,2,.2)),r-i}function AT(n,t,e){const i=Math.abs(n),s=n>0;return t>13.7&&t<15&&e>1.6&&i<1.1||t>16.5&&t<17&&e>1.4&&i<.5&&i>.12?2:i>3.9&&i<4.5&&t>15.1&&t<15.9&&e>1.7||i>5.55&&t>8.2&&t<11.8||i>3.1&&t<4.6&&t>1.1&&e<.4||t>5.5&&t<6.3&&e>1.4&&i>1.3&&i<3.3||Math.hypot(i-4.1,t-14.4,e-.2)<1.05&&t<14.6||Math.hypot(i-4.5,t-11.6,e-.4)<.95&&t>11.3||t>10.7&&t<11&&i<2||t>8.6&&t<8.9&&i>1&&i<3.6?3:i>3.55&&t>6.4&&t<16.4||i>2.9&&t>11.4&&t<16.4?s?4:5:t<8.8&&i>.95?s?6:7:t>15.2||i>1.4&&i<2&&e<-1.2||t<11.3||e<-1.7?1:0}const RT={min:[-7.6,-.4,-6.6],max:[7.6,21,4.4]};function CT(n,t,e,i,s,r,a,o,c,l,u,h){const f=(s+o)/2;return K(n,f+(t-f)/h,e,i,s,r,a,o,c,l,u)*h}function LT(n,t,e,i,s,r,a,o,c,l,u,h){const f=(i+a)/2;return K(f+(n-f)/h,t,e,i,s,r,a,o,c,l,u)*h}function PT(n,t,e,i=0){const s=Math.abs(n);let r=1e9;return r=Math.min(r,Le(n,t,e,0,13.7,.1,2.5,1.9,1.7,.6)),r=Math.min(r,lt(n,t,e,0,14.4,1.75,.95,.75,.85)),r=O(r,Le(n,t,e,0,11.4,0,1.5,1.2,1.15,.4),.4),r=O(r,Le(n,t,e,0,9.8,0,2.2,.85,1.35,.35),.3),r=Math.min(r,K(n,t,e,0,15.2,-2,0,10.8,-2.3,.75,.2)),r=Math.min(r,CT(s,t,e,1.4,13.6,-2.2,6.8,12.4,-5.6,1.9,.4,.17)),r=Math.min(r,LT(s,t,e,1.5,14.2,-2.4,1.65,17.8,-3.7,.95,.22,.2)),r=Math.min(r,Le(s,t,e,3.4,15.2,.2,1.15,.9,1.5,.3)),r=Math.min(r,Le(s,t,e,3.4,16.4,-.1,.85,.45,1.1,.2)),r=Math.min(r,K(n,t,e,0,15.3,.1,0,16.3,.2,.6,.55)),r=Math.min(r,lt(n,t,e,0,17.1,.35,.85,1,1.15)),r=Math.min(r,K(s,t,e,.45,17.8,.6,1,19.4,-.9,.16,.05)),r=Math.min(r,xe(s,t,e,4.1,14.5,.2,.8)),r=Math.min(r,K(s,t,e,4.1,14.3,.2,4.5,11.8,.4,.65,.6)),r=Math.min(r,xe(s,t,e,4.5,11.6,.4,.7)),r=Math.min(r,Le(s,t,e,4.5,10,.6,.8,1.6,.85,.3)),r=Math.min(r,Le(s,t,e,4.5,8,.95,.6,.65,.6,.25)),r=Math.min(r,K(s,t,e,2.1,9.1,0,2.3,5.6,.25,1.1,1)),r=Math.min(r,Le(s,t,e,2.3,5.2,.7,.75,.65,.5,.25)),r=Math.min(r,K(s,t,e,2.3,4.8,-.1,2.3,1.7,-.3,1.25,1.15)),r=Math.min(r,K(s,t,e,2.3,1.6,-.6,2.3,1.1,-1.4,1,1.1)),r=Math.min(r,Le(s,t,e,2.3,.45,.9,.75,.45,1.5,.2)),r-i}function IT(n,t,e){const i=Math.abs(n);return t>13.8&&t<15.1&&e>1.2&&i<1||t>16.8&&t<17.4&&e>1&&i<.75?2:t<1.9&&e<-.9||Math.hypot(i-4.1,t-14.5,e-.2)<.85&&t<14.5||Math.hypot(i-4.5,t-11.6,e-.4)<.75||t>10.4&&t<10.8&&i<1.6?3:i>2.5&&i<4.3&&t>16&&t<16.9||e<-1.9&&i>1.5&&i<7&&Math.abs(t-(13.6-(i-1.4)*.22))<.3||t>12.6&&t<13&&i<2.3&&e>.8?4:i>3.6&&t<13.8&&t>7.2||t<5&&i>1?1:0}function Qr(n){const t=!!n.mech,e=!!n.cape,i=n.tail??null;return(s,r,a,o)=>s.name.startsWith("thigh")?o>-1.6&&a<s.a[1]+(t?1.4:.8)&&Math.abs(Math.abs(r)-Math.abs(s.a[0]))<(a<s.a[1]+.3?t?1.45:1.3:t?1.4:.9):s.name.startsWith("tail")?i!==null?o<i:e&&o<-1.55:!t&&(s.name.startsWith("arm")||s.name.startsWith("forearm"))?Math.abs(r)>2&&o>-1.2:t&&s.name.startsWith("arm")?o>-1.5:!0}const DT=(n,t,e=2.2)=>n.std({color:t,emissive:t,emissiveIntensity:e,roughness:.3}),UT={id:"crimson",name:"Crimson",blurb:"A suited hero, visor and all",segs:_v,body:{sdf:(n,t,e)=>Q4(n,t,e),region:(n,t,e)=>tT(n,t,e),box:J4,palette:[13114922,16053492,1052692,12633292],surface:"suit",capture:Qr({})},dress(n){const t=n.std({color:526348,roughness:.08,metalness:.6});for(const e of[-1,1]){const i=new nt(new Ie(1,.38,.4),t);i.rotation.set(0,e*.42,e*-.32),n.at(i,"head",e*.46,17.12,1.12)}},fit:{size:1.08,limb:.7},face:{eyes:[[.46,17.12,1.35,.32],[-.46,17.12,1.35,.32]]}};Qr({cape:!0});const FT=A2.map(n=>/^(arm|forearm)/.test(n.name)?{...n,reach:1.95}:n),NT={id:"howler",name:"Howler",blurb:"A wolf man with amber eyes",segs:FT,body:{sdf:(n,t,e)=>jS(n,t,e),region:_d,box:XS,palette:Gl,capture:Qr({tail:-1.5}),fur:{length:.8,density:7,tip:.22},furLen:R2},dress:tE,tick:nE,fit:{size:1.1,limb:.6},idle:{tail:.25},face:{jaw:.45,eyes:[[on[0],on[1],on[2]+.12,.3],[-.62,on[1],on[2]+.12,.3]]}},kT={id:"plume",name:"Plume",blurb:"A big, friendly, feathered bird",segs:eT,body:{sdf:(n,t,e)=>iT(n,t,e),region:wv,box:nT,palette:[16036872,16770976,15224972,15762468],surface:"soft",capture:rT(Qr({tail:-2.4})),fur:{length:1.5,density:1.6,tip:.3,feather:!0},furLen:sT},dress:pT,tick:_T,fit:{size:1.12,limb:.5},idle:{tail:.15},face:{jaw:.5,eyes:[[kn[0],kn[1],kn[2]+.45,.5],[-.72,kn[1],kn[2]+.45,.5]]}};function Dd(n,t){return e=>{const i=DT(e,t);if(n==="bastion"){for(const a of[-1,1]){const o=new nt(new Ie(.42,.2,.1),i);o.rotation.z=a*-.12,e.at(o,"head",a*.36,17.12,1.36);const c=new nt(new Ie(.62,.36,.1),i);e.at(c,"spine2",a*2.2,13.1,2.08)}return}const s=n==="unison",r=new nt(new Xt(1,20,12),i);if(r.scale.set(s?.95:.85,s?.55:.6,s?.45:.35),e.at(r,"spine2",0,14.35,s?2.55:1.95),s)for(const a of[-1,1]){const o=new nt(new Ie(.42,.16,.1),i);o.rotation.z=a*.25,e.at(o,"head",a*.32,16.85,1.62)}else e.at(new nt(new Ie(1.3,.3,.12),i),"head",0,17.1,1.42);if(s){const a=e.std({color:14673130,roughness:.2,metalness:.9}),o=e.std({color:14198832,roughness:.3,metalness:.8}),c=new de,l=new nt(new Ie(.22,8,.9),a);l.position.y=-4.5,c.add(l);const u=new nt(new ri(.64,1.4,4),a);u.rotation.z=Math.PI,u.position.y=-9.2,u.scale.set(.35,1,1),c.add(u),c.rotation.x=-.95;const h=new nt(new Ie(.5,.4,3),o);h.position.y=-.3,c.add(h);const f=new nt(new Mn(.22,.22,1.6,8),o);f.position.y=.6,c.add(f),e.at(c,"forearmR",-4.75,8,2.1)}}}const OT={id:"bastion",name:"Bastion",blurb:"An armoured truck that stands up",segs:Id,body:{sdf:(n,t,e)=>yT(n,t,e),region:ST,box:wT,palette:[4871266,14262322,9431295,1842980,7118020,1316377,12896462],surface:"armour",weights:"rigid",capture:Qr({mech:!0})},dress:Dd("bastion",9431295),fit:{size:1,limb:.6},face:{eyes:[[.4,17.12,1.5,.28],[-.4,17.12,1.5,.28]]}},BT={id:"kestrel",name:"Kestrel",blurb:"A jet that stands up",segs:Id,body:{sdf:(n,t,e)=>PT(n,t,e),region:IT,box:RT,palette:[15132908,5661306,16756800,1842980,13117498],surface:"armour",weights:"rigid",capture:Qr({mech:!0})},dress:Dd("kestrel",16756800),fit:{size:1,limb:.6},face:{eyes:[[.36,17.12,1.56,.26],[-.36,17.12,1.56,.26]]}},HT={id:"unison",name:"Unison",blurb:"Five machines locked into one",segs:Id,body:{sdf:(n,t,e)=>TT(n,t,e),region:AT,box:ET,palette:[15527666,2503274,8382719,1842980,15234090,2271388,15254056,12855866],surface:"armour",weights:"rigid",capture:Qr({mech:!0})},dress:Dd("unison",8382719),fit:{size:1,limb:.6},face:{eyes:[[.34,16.9,1.72,.25],[-.34,16.9,1.72,.25]]}},pi=15.55,Ud=[0,15.6,1.2],Ni=[1.26,16.95,3.8],Sv=[1.4,17.55,2],Ev=[.95,17.2,4.35],zT=[1.15,15.85,2.7],VT=[.45,15.85,6.3],Li=[[0,9,-1.8],[.3,7,-4.6],[1.3,4.6,-7.2],[3,2.5,-9.4],[5.2,1.1,-11.2]],bm=[2.5,1.95,1.45,.95,.3],Af=[2.8,13.9,1.2],tc=[4.35,12.4,1.8],mi=[4.5,11,3.4],Pl=n=>[-n[0],n[1],n[2]],Tv=[{name:"pelvis",a:[0,9.2,-.4],b:[0,10.6,0],parent:null},{name:"spine1",a:[0,10.6,0],b:[0,12.6,.5],parent:"pelvis"},{name:"spine2",a:[0,12.6,.5],b:[0,14.4,.9],parent:"spine1"},{name:"neck",a:[0,14.4,.9],b:[0,16.4,1.2],parent:"spine2"},{name:"head",a:[0,16.4,1.2],b:[0,17.3,5.4],parent:"neck"},{name:"jaw",a:Ud,b:[0,16.2,5],parent:"head",reach:0},{name:"tail1",a:Li[0],b:Li[1],parent:"pelvis"},{name:"tail2",a:Li[1],b:Li[2],parent:"tail1"},{name:"tail3",a:Li[2],b:Li[3],parent:"tail2"},{name:"tail4",a:Li[3],b:Li[4],parent:"tail3"},{name:"thighL",a:[2,9,.1],b:[2.2,5,.7],parent:"pelvis"},{name:"shinL",a:[2.2,5,.7],b:[2.3,1.5,-.1],parent:"thighL"},{name:"footL",a:[2.3,1.5,-.1],b:[2.4,.4,2.4],parent:"shinL"},{name:"thighR",a:[-2,9,.1],b:[-2.2,5,.7],parent:"pelvis"},{name:"shinR",a:[-2.2,5,.7],b:[-2.3,1.5,-.1],parent:"thighR"},{name:"footR",a:[-2.3,1.5,-.1],b:[-2.4,.4,2.4],parent:"shinR"},{name:"armL",a:Af,b:tc,parent:"spine2"},{name:"forearmL",a:tc,b:mi,parent:"armL"},{name:"armR",a:Pl(Af),b:Pl(tc),parent:"spine2"},{name:"forearmR",a:Pl(tc),b:Pl(mi),parent:"armR"},...GT()];function GT(){const n=[{name:"bridge",a:[0,17.2,1],b:[0,16.95,5.6],parent:"head",reach:1.3}];for(const[t,e]of[["L",1],["R",-1]]){const i=s=>[s[0]*e,s[1],s[2]];n.push({name:"brow"+t,a:i(Sv),b:i(Ev),parent:"head",reach:1},{name:"lip"+t,a:i(zT),b:i(VT),parent:"head",reach:1},{name:"crown"+t,a:i([.8,17.8,.6]),b:i([.45,17.85,2.6]),parent:"head",reach:1.3},{name:"cheek"+t,a:i([1.6,16.15,1.2]),b:i([1.3,16.3,3.1]),parent:"head",reach:1.3},{name:"snout"+t,a:i([.8,16.45,3.2]),b:i([.35,16.5,6]),parent:"head",reach:1.3})}return n}const WT=["browL","browR","lipL","lipR"],XT=["bridge","crownL","crownR","cheekL","cheekR","snoutL","snoutR"],ym=(n,t,e)=>-O(-n,-t,e),Fd=n=>Math.max(0,Math.min(1,n)),Rn=(n,t,e)=>{const i=Fd((e-n)/(t-n));return i*i*(3-2*i)},ec=n=>1.5+(1.02-1.5)*Fd((n-1.5)/4.5);function Av(n,t,e){const i=Math.abs(n);let s=lt(n,t,e,0,16.85,1.3,1.8,1.3,1.95);return s=O(s,K(n,t,e,0,15.8,1.5,0,15.75,6,1.5,1.02),.5),s=O(s,K(n,t,e,0,16.45,2,0,16.4,5.7,1.2,.9),.6),s=O(s,K(i,t,e,...Sv,...Ev,.56,.42),.35),s=O(s,lt(i,t,e,1.55,16.2,1.6,.82,.95,1.35),.4),s=O(s,xe(i,t,e,.5,16.95,5.75,.28),.2),s=ym(s,-xe(i,t,e,Ni[0]+.08,Ni[1]-.02,Ni[2]+.08,.38),.1),ym(s,Math.min(pi-t,e-Ud[2]),.12)}function $T(n,t,e){const i=Math.abs(n);let s=K(n,t,e,0,15.25,1.5,0,15.2,5.6,1.38,.95);return s=O(s,xe(n,t,e,0,14.9,5.55,.78),.4),s=O(s,lt(n,t,e,0,14.75,2.6,1.25,.75,1.8),.5),s=O(s,K(i,t,e,1.1,15.3,1,1,15.3,3.2,.4,.35),.3),Math.max(s,t-pi)}const qT={min:[-1.8,13.7,-.1],max:[1.8,pi+.05,6.5]};function Rv(n,t,e){let i=1e9;for(const s of[-1,0,1])i=Math.min(i,K(n,t,e,2.4+s*.95,.45,3.25+(s===0?.45:0),2.4+s*1.1,.12,4+(s===0?.55:0),.26,.05));for(const s of[-.32,0,.32])i=Math.min(i,K(n,t,e,mi[0]+s,mi[1]-.45,mi[2]+.55,mi[0]+s*1.5,mi[1]-1.15,mi[2]+1.25,.17,.035));return i}function Cv(n,t,e){const[i,s,r]=Af,[a,o,c]=tc,[l,u,h]=mi;let f=K(n,t,e,i,s,r,a,o,c,.9,.72);return f=O(f,K(n,t,e,a,o,c,l,u,h,.7,.56),.3),O(f,lt(n,t,e,mi[0],mi[1]-.25,mi[2]+.25,.58,.52,.62),.3)}function YT(n,t,e){const i=Math.abs(n);let s=lt(n,t,e,0,9.7,-.3,3,2.6,2.6);return s=Math.min(s,K(n,t,e,0,10.2,0,0,12.6,.5,2.75,2.55)),s=Math.min(s,K(n,t,e,0,12.6,.5,0,14.2,.7,2.55,2)),s=Math.min(s,lt(n,t,e,0,11.4,1.5,2.2,3,1.75)),s=Math.min(s,lt(i,t,e,1.65,13.9,.5,1.35,1.05,1.4)),s=Math.min(s,xe(i,t,e,2.05,8.6,-.1,2.2)),Math.min(s,K(i,t,e,2,9,.1,2.2,5,.7,1.95,1.55))}function Lv(n,t,e){return O(K(n,t,e,0,14,.5,0,16.2,.95,2.05,1.7),lt(n,t,e,0,14.5,1.9,1.45,1,1.3),.6)}const Sm=(n,t,e,i,s,r,a)=>{const o=n-i,c=t-s,l=e-r;return o*o+c*c+l*l<a*a};function Pv(n,t,e){const i=Math.abs(n);let s=9;if(Sm(n,t,e,0,12.4,.4,8.2)&&(s=lt(n,t,e,0,9.7,-.3,3,2.6,2.6),s=O(s,K(n,t,e,0,10.2,0,0,12.6,.5,2.75,2.55),1),s=O(s,K(n,t,e,0,12.6,.5,0,14.2,.7,2.55,2),.9),s=O(s,lt(n,t,e,0,11.4,1.5,2.2,3,1.75),.9),s=O(s,lt(i,t,e,1.65,13.9,.5,1.35,1.05,1.4),.8),s=O(s,Lv(n,t,e),.9)),n*n<4&&e<1.5&&t>6.5&&t<19&&(s=O(s,K(n,t,e,0,16.2,-.3,0,12,-2,.45,.6),.6),s=O(s,K(n,t,e,0,12,-2,0,9.4,-3,.6,.55),.6)),t>13.4&&e>-1.6&&Sm(n,t,e,0,16.6,3.25,6.5)&&(s=O(s,Av(n,t,e),.7)),e<1.6&&t<13.5&&n>-4.5&&n<7.6){const r=[1,.7,.5,.4];for(let a=0;a<4;a++){const o=Li[a],c=Li[a+1];s=O(s,K(n,t,e,o[0],o[1],o[2],c[0],c[1],c[2],bm[a],bm[a+1]),r[a])}}if(t<12.2&&i<6&&e>-4&&e<5.6){let r=xe(i,t,e,2.05,8.6,-.1,2.2);if(r=O(r,K(i,t,e,2,9,.1,2.2,5,.7,1.95,1.55),.6),r=O(r,xe(i,t,e,2.25,5.1,.85,1.45),.5),r=O(r,K(i,t,e,2.2,5,.7,2.3,1.5,-.1,1.45,1.3),.5),t<4.5&&(r=O(r,K(i,t,e,2.3,1.3,0,2.4,.75,2,1.25,.95),.5),r=O(r,xe(i,t,e,2.3,.9,-.6,.95),.4),e>.2))for(const a of[-1,0,1])r=O(r,K(i,t,e,2.4+a*.5,.75,1.8,2.4+a*.95,.5,3.25+(a===0?.45:0),.52,.36),.3);s=O(s,r,.8)}return i>1.2&&t>8.2&&t<15.8&&e>-1.3&&e<6.2&&(s=O(s,Cv(i,t,e),.3)),(t<2&&e>2||i>3.2&&t>8.4&&t<12&&e>2.6)&&(s=Math.min(s,Rv(i,t,e))),Math.max(s,-t)}const xi={skin:6317163,belly:8814703,ridge:2763823,claw:14867659,mouth:4854808,bone:13222576},jT=[xi.skin,xi.belly,xi.ridge,xi.claw,xi.mouth];function ZT(n,t,e){const i=Math.abs(n);if(Rv(i,t,e)<.06)return 3;if(e>Ud[2]+.2&&e<5.6&&t<pi+.04&&t>pi-.12&&i<ec(e)-.45)return 4;if(e>1.9&&e<3.3&&t>14.75&&t<pi&&i<1||i<.9&&e<-.3&&t>9.4&&t<16.5&&e<-2.45+(t-9.4)*.3)return 2;const s=i/2.05,r=(t-11.1)/3.4;if(s*s+r*r<1&&e>1)return 1;const a=i/1.15,o=(t-14.2)/.75;return a*a+o*o<1&&e>2?1:0}const JT=new gt(xi.belly);function KT(n,t,e,i,s){if(n===1){const r=Math.abs(e*1.25%1-.5)*2;s.multiplyScalar(.8+.2*Rn(.15,.55,r))}else if(n===0){const r=Rn(0,-2.5,i)*Rn(6.5,12,e)+(i<-3?Rn(-.5,1,e-(9.4+i*.62)):0);s.multiplyScalar(1-.22*Math.min(1,r));const a=Math.abs(t)/2.05,o=(e-11.1)/3.4,c=a*a+o*o;i>.6&&c<1.5&&s.lerp(JT,.35*Rn(1.5,1,c))}}const Ta=[NaN,NaN,NaN],Aa=[NaN,NaN,NaN];let Em=!1,J0=0;const QT=(n,t,e,i)=>{const s=n.name;if(s.startsWith("thigh"))return t*n.a[0]>-.3&&i>-2&&e<n.a[1]+.6&&Math.abs(Math.abs(t)-Math.abs(n.a[0]))<(e<n.a[1]-.3?2.2:1.2);if(s.startsWith("tail"))return i<-2.7;if(s.startsWith("arm")||s.startsWith("forearm"))return t*n.a[0]<=0?!1:((t!==Ta[0]||e!==Ta[1]||i!==Ta[2])&&(Ta[0]=t,Ta[1]=e,Ta[2]=i,Em=Cv(Math.abs(t),e,i)<YT(t,e,i)+.1),Em);const r=tA.has(s);return s==="head"||s==="neck"||r?r&&n.a[0]!==0&&t*Math.sign(n.a[0])<-.15?!1:((t!==Aa[0]||e!==Aa[1]||i!==Aa[2])&&(Aa[0]=t,Aa[1]=e,Aa[2]=i,J0=e>13.4&&i>-1.6?Av(t,e,i)-Lv(t,e,i):9),s==="neck"?J0>-.25:J0<.25):!0},tA=new Set([...WT,...XT]),eA=[[0,16.6,1.1],[0,14.4,.9],[0,12.6,.5],[0,10.6,0],[0,9,-1],...Li.slice(1)],ro=["tail4","tail3","tail2","tail1","pelvis","spine1","spine2","neck"],Nd=3116543;function Tm(n,t,e){const i=eA.map(o=>new C(...o)),s=i.slice(1).map((o,c)=>o.distanceTo(i[c])),r=s.reduce((o,c)=>o+c,0),a=[];for(let o=t*r;o<=e*r+1e-6;o+=n){let c=0,l=0;for(;c<s.length-1&&l+s[c]<o;)l+=s[c++];const u=(o-l)/s[c],h=i[c].clone().lerp(i[c+1],u),f=i[c+1].clone().sub(i[c]).normalize();c+2<i.length&&f.lerp(i[c+2].clone().sub(i[c+1]).normalize(),Math.max(0,u-.5)).normalize();const d=new C(0,.7,-.7);d.addScaledVector(f,-d.dot(f)).normalize();const p=new C().crossVectors(f,d).normalize();a.push({p:h,t:f,o:d,side:p,u:o/r})}return a}function nA(n,t){const e=n.clone().addScaledVector(t,6);for(let i=0;i<80;i++){const s=Pv(e.x,e.y,e.z);if(s<.02)break;e.addScaledVector(t,-Math.max(.03,s*.8))}return e}function iA(n,t,e,i){const s=i-.5,r=[[.5,-.35],[.53,.1],[.52,.3],[.5,.47+.08*s],[.36,.42],[.31,.6-.06*s],[.2,.58],[.16,.8],[.06-.04*s,1],[-.06,.82],[-.12,.66],[-.24,.76+.08*s],[-.3,.56],[-.42,.6-.06*s],[-.46,.42],[-.55,.36+.05*s],[-.54,.12],[-.5,-.35]],a=new fd(r.map(([d,p])=>new ht(d*t,p*n))),o=new Dh(a,{depth:e,bevelEnabled:!0,bevelThickness:e*.45,bevelSize:Math.min(.13,t*.04),bevelSegments:1,steps:1,curveSegments:1});o.translate(0,0,-e/2);const c=o.getAttribute("position"),l=new Float32Array(c.count*3),u=new gt(xi.ridge),h=new gt(xi.bone),f=new gt;for(let d=0;d<c.count;d++){const p=c.getY(d)/n;c.setZ(d,c.getZ(d)*(1-.6*Fd(p))),f.copy(u).lerp(h,Rn(-.05,.6,p)),l[d*3]=f.r,l[d*3+1]=f.g,l[d*3+2]=f.b}return o.setAttribute("color",new qt(l,3)),o.deleteAttribute("uv"),o.computeVertexNormals(),o}const sA=n=>2.4+1.8*Rn(0,.16,n)-1.9*Rn(.22,.68,n)-.95*Rn(.68,1,n);function rA(n){const t=new je({color:16777215,vertexColors:!0,roughness:.6,metalness:.05,emissive:Nd,emissiveIntensity:0});return t.name=`kaiju-plate-${n}`,t.onBeforeCompile=e=>{e.fragmentShader=e.fragmentShader.replace("#include <emissivemap_fragment>",`#include <emissivemap_fragment>
 totalEmissiveRadiance *= 0.12 + 0.88 * smoothstep(0.08, 0.55, vColor.g);`)},t.customProgramCacheKey=()=>"kaiju-plate-v1",t}let $o=null;function aA(){if($o)return $o;const n=document.createElement("canvas");n.width=n.height=64;const t=n.getContext("2d"),e=t.createRadialGradient(32,32,0,32,32,32);return e.addColorStop(0,"rgba(255,255,255,1)"),e.addColorStop(.2,"rgba(255,255,255,0.6)"),e.addColorStop(.5,"rgba(255,255,255,0.18)"),e.addColorStop(1,"rgba(255,255,255,0)"),t.fillStyle=e,t.fillRect(0,0,64,64),$o=new oh(n),$o.colorSpace=xn,$o}function oA(n){let t=ro[0],e=1/0;const i=new C;for(const s of ro){const r=Tv.find(o=>o.name===s),a=new m3(new C(...r.a),new C(...r.b)).closestPointToPoint(n,!0,i).distanceTo(n);a<e&&(e=a,t=s)}return t}function cA(n){const t=new Map,e=new Map,i=(x,_,b,S)=>{const T=sA(x.u)*b;if(T<.35)return;const A=x.o.clone().addScaledVector(x.side,_*.55).normalize(),w=nA(x.p.clone().addScaledVector(x.side,_*.9),A),y=Rn(.42,.05,x.u),E=x.o.clone().addScaledVector(new C(0,1,0),(_?1.9:1.3)*y).addScaledVector(x.side,_*(.7+.6*y)).normalize(),R=new C().crossVectors(x.t,E).normalize(),L=new C().crossVectors(E,R).normalize();w.addScaledVector(E,-.4*Math.min(1,T/2));const I=iA(T,T*(.86+.1*S),Math.max(.12,.085*T+.05),S);I.applyMatrix4(new se().makeBasis(L,E,R).setPosition(w));const N=oA(w);if((t.get(N)??t.set(N,[]).get(N)).push(I),_===0){const B=e.get(N)??{p:new C,h:0,n:0};B.p.add(w.clone().addScaledVector(E,T*.4)),B.h+=T,B.n++,e.set(N,B)}};Tm(1.55,.04,.985).forEach((x,_)=>i(x,0,1,_*.618%1)),Tm(1.6,.035,.62).forEach((x,_)=>{for(const b of[-1,1])i(x,b,.6+.3*Rn(.3,.05,x.u),(_+(b>0?.5:0))*.382%1)}),ro.forEach((x,_)=>{const b=t.get(x);if(!b)return;const S=zn(b,!1);b.forEach(w=>w.dispose());const T=new nt(S,rA(_));T.name=`kaiju-plates-${x}`,n.at(T,x,0,0,0);const A=e.get(x);if(A){const w=new od({map:aA(),color:0,blending:Xr,depthWrite:!1,transparent:!0,opacity:.9,toneMapped:!1});w.name=`kaiju-halo-${_}`,w.userData.keepBlend=!0;const y=new Xg(w);y.scale.setScalar(A.h/A.n*3),y.renderOrder=5;const E=A.p.divideScalar(A.n);n.at(y,x,E.x,E.y,E.z)}});const s=new gt(xi.belly).multiplyScalar(.8),r=rn($T,qT,40,(x,_,b,S)=>{const T=Math.abs(x);_>pi-.1&&T<ec(b)-.5?S.setHex(xi.mouth):_<14.6&&T<.9?S.copy(s):S.setHex(xi.skin)},16e3),a=new nt(r,hh());a.name="kaiju-jaw",n.at(a,"jaw",0,0,0);const o=n.std({color:15525588,roughness:.45}),c=[],l=[],u=new C(0,1,0),h=new C,f=(x,_,b,S)=>{h.set(-Math.sign(x)*uA,hA,b>6?-.42:0);const T=h.length();c.push(new Mn(S*.42,S*.68,T,6).translate(0,T/2,0).applyQuaternion(new ie().setFromUnitVectors(u,h.normalize())).translate(x,_-.1,b))};for(let x=0;x<7;x++)for(const _ of[-1,1]){const b=2.3+x*.6,S=x===4?1.35:1;c.push(new ri(.15*S,.55*S,6).rotateX(Math.PI).translate(_*(ec(b)-.14),pi-.22*S,b)),f(_*(ec(b)-.14),pi+.055*S,b,.15*S),l.push(new ri(.12,.42,6).translate(_*(ec(b)-.45),pi+.14,b+.3))}for(const x of[-1,1])c.push(new ri(.13,.42,6).rotateX(Math.PI).translate(x*.32,pi-.17,6.75)),f(x*.32,pi+.04,6.75,.13);n.at(new nt(zn(c),o),"head",0,0,0),n.at(new nt(zn(l),o),"jaw",0,0,0);const d=new je({color:793130,emissive:Nd,emissiveIntensity:0,roughness:.4});d.name="kaiju-core",d.onBeforeCompile=x=>{x.fragmentShader=x.fragmentShader.replace("#include <emissivemap_fragment>",`#include <emissivemap_fragment>
 float facing = abs(dot(normalize(normal), normalize(vViewPosition)));
 totalEmissiveRadiance *= 0.2 + 1.4 * facing * facing;`)},d.customProgramCacheKey=()=>"kaiju-core-v1";const p=new nt(new Xt(1,16,10),d);p.scale.set(.85,.7,.6),n.at(p,"head",0,15,3.2);const v=n.std({color:15769624,emissive:16742912,emissiveIntensity:1,roughness:.18}),g=n.std({color:657414,roughness:.3}),m=hh(),M=new gt(xi.skin).multiplyScalar(.9);for(const x of[1,-1]){const _=x>0?"L":"R",b=new de;b.name="kaiju-socket"+_,b.quaternion.copy(lA(x));const S=new de;S.name="kaiju-eye"+_;const T=new nt(new Xt(.15,10,8),g);T.name="kaiju-pupil"+_,T.position.z=.24,T.scale.set(Iv,1.3,.4),S.add(new nt(new Xt(.3,16,12),v),T);const A=Nc("kaiju-lids"+_,.3*Am,m,{gap:.1,tilt:x*.3});A.scale.setScalar(1/Am);for(const w of A.children){const y=w.geometry,E=y.getAttribute("position").count,R=new Float32Array(E*3);for(let L=0;L<E;L++)M.toArray(R,L*3);y.setAttribute("color",new qt(R,3))}b.add(S,A),n.at(b,"head",x*Ni[0],Ni[1],Ni[2])}}function lA(n){const t=new C(n*.6,.05,.8).normalize(),e=new C(0,1,0).cross(t).normalize(),i=new C().crossVectors(t,e);return new ie().setFromRotationMatrix(new se().makeBasis(e,i,t))}const hA=.5,uA=.32,Am=2.3,Iv=.35,Rm=new WeakMap,fA=new gt(Nd);function dA(n){const t=()=>({ball:null,pupil:null,up:null,lo:null,upOpen:0,upShut:0,loOpen:0,loShut:0,brow:null,lip:null,cheek:null,browRest:new C,lipRest:new C,cheekRest:new C}),e={side:[t(),t()],jaw:null};return n.traverse(i=>{i.isBone&&i.name==="jaw"&&(e.jaw=i);const s=/^(kaiju-eye|kaiju-pupil|kaiju-lids|brow|lip|cheek)([LR])$/.exec(i.name);if(!s)return;const r=e.side[s[2]==="L"?0:1];s[1]==="kaiju-eye"?r.ball=i:s[1]==="kaiju-pupil"?r.pupil=i:s[1]==="kaiju-lids"?(r.up=i.children[0]??null,r.lo=i.children[1]??null,_o(i,0,0,0),r.upOpen=r.up?.rotation.x??0,r.loOpen=r.lo?.rotation.x??0,_o(i,1,0,0),r.upShut=r.up?.rotation.x??0,r.loShut=r.lo?.rotation.x??0):i.isBone&&s[1]==="brow"?(r.brow=i,r.browRest.copy(i.position)):i.isBone&&s[1]==="lip"?(r.lip=i,r.lipRest.copy(i.position)):i.isBone&&s[1]==="cheek"&&(r.cheek=i,r.cheekRest.copy(i.position))}),e}const Yl=n=>Math.max(0,Math.min(1,n)),vs=(n,t,e)=>Yl((n-t)/(e-t)),pA=.2,Dv=.5,mA=.055,gA=new C(1,0,0),vA=new C(0,1,0),xA=new ie,Cm={...Mo};function MA(n,t,e,i){let s;if(e)s=e;else{const h=Math.floor(t/3.4),f=Rn(0,.25,t-h*3.4),d=p=>p%3===0?0:(Math.abs(Math.sin(p*91.7))*2-1)*.8;Cm.lookX=d(h-1)+(d(h)-d(h-1))*f,s=Cm}const r=t%5.2,a=r<.2?Math.sin(r/.2*Math.PI):0,o=e?vs(e.browUp,.1,.65):0,c=e?vs(e.sneer,.06,.5):0,l=e?Yl(e.jaw):0,u=e?vs(e.puff,.04,.4):0;e&&n.jaw&&n.jaw.quaternion.setFromAxisAngle(vA,e.jawSide*mA).multiply(xA.setFromAxisAngle(gA,e.jaw*Dv));for(let h=0;h<2;h++){const f=n.side[h],d=h===0?1:-1,p=h===0,v=e?vs(p?e.blinkL:e.blinkR,.15,.65):a,g=e?vs(p?e.squintL:e.squintR,.2,.7):0,m=e?vs(p?e.wideL:e.wideR,.08,.5):0,M=e?vs(p?e.browDownL:e.browDownR,.08,.55):0,x=e?vs(p?e.browOuterL:e.browOuterR,.08,.6):0,_=e?vs(p?e.smileL:e.smileR,.06,.7):0,b=Math.max(v,Yl(pA+.35*M+.3*g+.15*c-.6*m-.3*o-.2*x-.15*s.lookY)),S=Math.max(v,Yl(.45*g+.3*_));if(f.up){const T=f.upOpen-.3*m;f.up.rotation.x=T+(f.upShut-T)*b}if(f.lo&&(f.lo.rotation.x=f.loOpen+(f.loShut-f.loOpen)*S),f.ball&&vd(f.ball,s,.45),f.pupil&&(f.pupil.scale.x=Iv*(1+.9*m-.35*g)*(1-.3*i)),f.brow&&(f.brow.position.set(f.browRest.x+d*.06*M,f.browRest.y-.14*M+.12*o+.22*x-.04*c,f.browRest.z+.08*M),f.brow.rotation.x=.09*M-.07*o+.02*x+.04*c),f.lip){const T=Math.min(1.2,c+.25*l*l+.5*_);f.lip.position.set(f.lipRest.x+d*.06*T,f.lipRest.y+.3*T,f.lipRest.z+.03*T)}f.cheek&&f.cheek.position.set(f.cheekRest.x+d*.24*u,f.cheekRest.y-.04*u,f.cheekRest.z+.06*u)}}const _A={id:"kaiju",name:"Kaiju",blurb:"A city-stomper: open wide for atomic breath",segs:Tv,body:{sdf:Pv,region:ZT,box:{min:[-5,-.3,-12],max:[6,19,7.6]},palette:jT,surface:"scales",weights:"sharp",capture:QT,tint:KT},dress:cA,fit:{size:1.06,limb:.6,head:1},idle:{tail:.2},res:88,face:{jaw:Dv,eyes:[[Ni[0],Ni[1],Ni[2]+.3,.38],[-1.26,Ni[1],Ni[2]+.3,.38]],breath:{colors:[10479871,3844351,3844351,2060287,16777215],rate:3,speed:1.4,size:1}},tick(n,t,e){let i=Rm.get(n);const s=e?.jaw??0;if(!i){const l=ro.map(()=>null),u=ro.map(()=>null);let h=null;n.traverse(f=>{const d=f.material;if(!d||Array.isArray(d))return;const p=/^kaiju-plate-(\d)$/.exec(d.name),v=/^kaiju-halo-(\d)$/.exec(d.name);p&&(l[Number(p[1])]=d),v&&(u[Number(v[1])]=d),d.name==="kaiju-core"&&(h=d)}),i={plates:l,halos:u,core:h,charge:Rn(.15,.7,s),t,face:dA(n)},Rm.set(n,i)}const r=Math.max(0,Math.min(.1,t-i.t));i.t=t;const a=Rn(.15,.7,s);i.charge+=(a-i.charge)*(1-Math.exp(-r/(a>i.charge?.12:.3)));const o=i.charge,c=ro.length;for(let l=0;l<c;l++){const u=l/(c-1),h=Rn(u*.45,u*.45+.5,o),f=1+.16*Math.sin(t*29+l*1.7)+.1*Math.sin(t*47+l*2.9)+.22*Math.max(0,Math.sin(t*11.3+l*.8)-.7)*3,d=i.plates[l],p=i.halos[l];d&&(d.emissiveIntensity=1.7*h*f,d.color.setRGB(1-.62*h,1-.5*h,1-.3*h)),p&&p.color.copy(fA).multiplyScalar(.75*h*f)}i.core&&(i.core.emissiveIntensity=2.6*o*(1+.2*Math.sin(t*37))),MA(i.face,t,e,o)}},Nn=[2.5,14.55,0],sn=[2.95,11.95,-.05],Ji=[3.12,9.6,.35],wA=[0,16.35,-.25],Il=n=>[-n[0],n[1],n[2]],Uv=[{name:"pelvis",a:[0,9.6,0],b:[0,10.6,0],parent:null},{name:"spine1",a:[0,10.6,0],b:[0,12.4,.1],parent:"pelvis"},{name:"spine2",a:[0,12.4,.1],b:[0,15,.1],parent:"spine1"},{name:"neck",a:[0,15,.1],b:[0,15.9,.15],parent:"spine2"},{name:"head",a:[0,15.9,.15],b:[0,18.4,.3],parent:"neck"},{name:"jaw",a:wA,b:[0,15.55,1],parent:"head",reach:0},{name:"tail1",a:[0,10.4,-1],b:[0,9.6,-1.1],parent:"pelvis",reach:0},{name:"tail2",a:[0,9.6,-1.1],b:[0,8.8,-1.2],parent:"tail1",reach:0},{name:"tail3",a:[0,8.8,-1.2],b:[0,8,-1.3],parent:"tail2",reach:0},{name:"tail4",a:[0,8,-1.3],b:[0,7.2,-1.4],parent:"tail3",reach:0},{name:"thighL",a:[1.1,9.6,0],b:[1.2,5.3,.2],parent:"pelvis"},{name:"shinL",a:[1.2,5.3,.2],b:[1.2,1.1,-.1],parent:"thighL"},{name:"footL",a:[1.2,1.1,-.1],b:[1.2,.35,1.4],parent:"shinL"},{name:"thighR",a:[-1.1,9.6,0],b:[-1.2,5.3,.2],parent:"pelvis"},{name:"shinR",a:[-1.2,5.3,.2],b:[-1.2,1.1,-.1],parent:"thighR"},{name:"footR",a:[-1.2,1.1,-.1],b:[-1.2,.35,1.4],parent:"shinR"},{name:"armL",a:Nn,b:sn,parent:"spine2"},{name:"forearmL",a:sn,b:Ji,parent:"armL"},{name:"armR",a:Il(Nn),b:Il(sn),parent:"spine2"},{name:"forearmR",a:Il(sn),b:Il(Ji),parent:"armR"}],qo=n=>Uv.findIndex(t=>t.name===n),bA={min:[-4.3,-.45,-4.1],max:[4.3,17.3,3.9]},Oh=(n,t)=>[n[0]-t[0],n[1]-t[1],n[2]-t[2]],kd=n=>Math.hypot(n[0],n[1],n[2]),Bc=n=>{const t=kd(n)||1;return[n[0]/t,n[1]/t,n[2]/t]},Bh=(n,t)=>[n[1]*t[2]-n[2]*t[1],n[2]*t[0]-n[0]*t[2],n[0]*t[1]-n[1]*t[0]],or=n=>n<0?0:n>1?1:n,Xs=(n,t,e)=>{const i=or((e-n)/(t-n));return i*i*(3-2*i)},Fv=(n,t,e)=>-O(-n,-t,e),Ss=Bc(Oh(sn,Nn)),Ki=kd(Oh(sn,Nn)),jl=Bc(Bh(Ss,[0,0,1])),K0=Bh(Ss,jl),Qn=Bc(Oh(Ji,sn)),Ii=kd(Oh(Ji,sn)),hc=Bc(Bh(Qn,[0,0,1])),Zl=Bh(Qn,hc),Ur=14.3,Jl=13.45;function Od(n,t,e){if(t<9.9)return 10.1-t;if(t>17.2)return t-17;const i=Math.abs(n);if(i>3.3)return i-3.05;if(e>2)return e-1.6;if(e<-1.8)return-1.5-e;let s=lt(n,t,e,0,13.3,.05,1.5,1.85,.95);if(s=O(s,lt(i,t,e,.6,13.25,.5,.6,.52,.5),.35),s=O(s,lt(n,t,e,0,11.3,.05,1.16,1.2,.86),.7),t>13.3&&(s=O(s,K(i,t,e,0,15.02,-.14,2.2,14.62,-.06,.33,.36),.42),s=O(s,xe(i,t,e,Nn[0],Nn[1],Nn[2],.45),.3),s=O(s,K(i,t,e,.2,14.78,.62,2.1,14.9,.22,.11,.1),.08),s=Fv(s,-xe(n,t,e,0,14.92,.82,.16),.12),s=O(s,K(n,t,e,0,14.6,-.05,0,16.5,.05,.4,.36),.35),t<Ur+.1&&t>Jl-.1)){const r=or((Ur-t)/(Ur-Jl)),a=Math.atan2(n,e),o=Math.abs(Math.cos(a)),c=1+.045*r*Math.cos(16*a),l=(1.18+.4*r)*c,u=(.82+.5*r*(.6+.4*o))*c,h=(Math.hypot(n/l,(e-.05)/u)-1)*Math.min(l,u);s=Math.min(s,Math.max(h,t-Ur,Jl-t))}return s}const Ua=[{top:11.35,bot:7.1,r0:[1.22,.98],r1:[2.02,1.78],n:15},{top:7.6,bot:3.75,r0:[1.9,1.62],r1:[2.62,2.32],n:19},{top:4.25,bot:.12,r0:[2.48,2.18],r1:[3.28,2.98],n:23}],ws=11.2,Nv=n=>-.028*(11.3-n);function kv(n,t,e){if(t>11.8)return t-11.6;const i=Math.hypot(n,e);if(i>4.1)return i-3.95;const s=Math.atan2(n,e),r=Nv(t);let a=Math.max((Math.hypot(n/1.36,(e-.05)/1.08)-1)*1.08,Math.abs(t-ws)-.28);for(const o of Ua){if(t>o.top+.4||t<o.bot-.4){a=Math.min(a,Math.max(t-o.top,o.bot-t));continue}const c=or((o.top-t)/(o.top-o.bot)),l=Xs(.68,1,c),u=1+.065*l*Math.cos(o.n*s),h=.36*l*l,f=(o.r0[0]+(o.r1[0]-o.r0[0])*c+h)*u,d=(o.r0[1]+(o.r1[1]-o.r0[1])*c+h)*u,p=(Math.hypot(n/f,(e-r)/d)-1)*Math.min(f,d);a=Math.min(a,Math.max(p,t-o.top,o.bot-t))}return a}function Ov(n,t,e){if(n<1.6)return 1.75-n;if(t>15.3)return t-15.15;if(t<8.7)return 8.9-t;if(n>4.4)return n-4.1;let i=K(n,t,e,Nn[0],Nn[1],Nn[2],sn[0],sn[1],sn[2],.4,.36);const s=n-sn[0],r=t-sn[1],a=e-sn[2],o=(s*Qn[0]+r*Qn[1]+a*Qn[2])/Ii,c=or(o),l=s-Qn[0]*Ii*c,u=r-Qn[1]*Ii*c,h=a-Qn[2]*Ii*c,f=Math.hypot(l,u,h),d=Xs(.3,1,c),p=Math.atan2(l*Zl[0]+u*Zl[1]+h*Zl[2],l*hc[0]+u*hc[1]+h*hc[2]),v=.34+.4*d*d*(1+.14*d*Math.cos(9*p));i=O(i,Math.max(f-v,-o*Ii,(o-1)*Ii),.22),i=Math.max(i,-Math.max(f-(v-.13),(.78-o)*Ii));const g=n-Nn[0],m=t-Nn[1],M=e-Nn[2],x=(g*Ss[0]+m*Ss[1]+M*Ss[2])/Ki;if(x>.05&&x<.46){const _=g-Ss[0]*Ki*x,b=m-Ss[1]*Ki*x,S=M-Ss[2]*Ki*x,T=or((x-.14)/.24),A=Math.atan2(_*K0[0]+b*K0[1]+S*K0[2],_*jl[0]+b*jl[1]+S*jl[2]),w=(.47+.3*T)*(1+.07*T*Math.cos(10*A));i=Math.min(i,Math.max(Math.hypot(_,b,S)-w,(.14-x)*Ki,(x-.38)*Ki))}return i}function yA(n,t,e){return Math.min(Od(n,t,e),kv(n,t,e),Ov(Math.abs(n),t,e))}const Fa=0,Rf=1,Bv=2,ti=new Float64Array(3);let Lm=NaN,Pm=NaN,Im=NaN,xh=0;function Bd(n,t,e){if(n===Lm&&t===Pm&&e===Im)return xh;ti[Fa]=Od(n,t,e),ti[Rf]=kv(n,t,e),ti[Bv]=Ov(Math.abs(n),t,e);let i=0;for(let s=1;s<3;s++)ti[s]<ti[i]&&(i=s);return Lm=n,Pm=t,Im=e,xh=i,i}const SA=.2,Mr=n=>ti[n]<=ti[xh]+SA,EA=(n,t,e,i)=>{Bd(t,e,i);const s=n.name,r=s.endsWith("L")?1:s.endsWith("R")?-1:0,a=Math.abs(t);return r!==0&&t*r<-.05?!1:s.startsWith("arm")||s.startsWith("forearm")?xh===Bv:s==="pelvis"?Mr(Rf)||Mr(Fa)&&e<11.6:s==="spine1"?Mr(Rf)&&e>9.8||Mr(Fa)&&e<13.2:s==="spine2"?Mr(Fa):s==="neck"?Mr(Fa)&&e>14.5&&a<1.1:s==="head"?Mr(Fa)&&e>15.8&&a<.9:!1},TA=(n,t,e)=>Bd(n,t,e);function AA(n,t,e,i,s){const r=Bd(t,e,i),a=Math.exp(-(ti[0]-ti[r])/.08),o=Math.exp(-(ti[1]-ti[r])/.08),c=Math.exp(-(ti[2]-ti[r])/.08),l=a+o+c;s.setRGB(a/l,o/l,c/l)}const _r=n=>`vec3(${n.map(t=>t.toFixed(5)).join(", ")})`,RA=`
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
    float bot = ${Jl.toFixed(2)} - scallop(th * 1.3, 0.3, 0.1);
    c = mix(c, lace(p, black(), laceInk(), w), inside(bot - p.y, w));
    // the bare bone: a soft shade down toward the frill, under each collarbone and in the notch between them
    vec3 b = bone() * mix(0.8, 1.0, smoothstep(${Ur.toFixed(2)}, ${(Ur+.45).toFixed(2)}, p.y));
    float front = smoothstep(0.0, 0.35, n.z);
    float clav = segment2(vec2(ax, p.y), vec2(0.22, 14.79), vec2(2.08, 14.91));
    b *= 1.0 - 0.18 * smoothstep(0.26, 0.08, clav) * front;
    b *= 1.0 - 0.3 * smoothstep(0.22, 0.0, length(vec2(p.x, p.y - 14.9))) * front;
    // the collarbones drawn as the face is painted: a soft grey line round each, the bone's knob at the shoulder
    vec3 ink = srgb(0.42, 0.4, 0.44);
    b = mix(b, ink, 0.75 * inside(abs(clav - 0.12) - 0.014, w) * front * step(0.24, ax));
    c = mix(c, b, inside(${(Ur+.02).toFixed(2)} - p.y, w));
    return c;
  }

  vec3 skirtCol(vec3 p, vec3 n, float w) {
    float th = atan(p.x, p.z);
    float arc = th * length(p.xz);
    // the tier that shows here, its colour, its trim's, and how far up from its hem
    vec3 base, trim; float e;
    if (p.y > ${(Ua[0].bot-.03).toFixed(2)}) { base = red(); trim = black(); e = p.y - ${Ua[0].bot.toFixed(2)}; }
    else if (p.y > ${(Ua[1].bot-.03).toFixed(2)}) { base = black(); trim = red(); e = p.y - ${Ua[1].bot.toFixed(2)}; }
    else { base = purple(); trim = black(); e = p.y - ${Ua[2].bot.toFixed(2)}; }
    // gathered: fine pleats shading the cloth
    vec3 c = base * (0.9 + 0.1 * cos(th * 56.0));
    // the trim: a lace band with a scalloped top along each ruffle's hem
    float top = 0.62 + scallop(arc, 0.42, 0.13);
    vec3 t = trim == black() ? lace(p, black(), laceInk(), w) : trim;
    c = mix(c, t, inside(e - top, w));
    // a thin marigold piping at the very hem of each tier
    c = mix(c, marigold(), inside(abs(e - 0.07) - 0.035, w));
    // the sash: purple satin, a marigold stripe along each edge
    float sa = abs(p.y - ${ws.toFixed(2)});
    c = mix(c, purple() * 1.15, inside(sa - 0.3, w));
    c = mix(c, marigold(), inside(abs(sa - 0.22) - 0.035, w));
    // the underside of a ruffle is in its own shade
    c *= mix(1.0, 0.35, smoothstep(-0.2, -0.6, n.y));
    return c;
  }

  vec3 armCol(vec3 p, vec3 n, float w) {
    vec3 q = vec3(abs(p.x), p.y, p.z);
    vec3 nn = vec3(sign(p.x) * n.x, n.y, n.z);
    float tu = dot(q - ${_r(Nn)}, ${_r(Ss)}) / ${Ki.toFixed(5)};
    vec3 fo = q - ${_r(sn)};
    float tf = dot(fo, ${_r(Qn)}) / ${Ii.toFixed(5)};
    vec3 radial = fo - ${_r(Qn)} * ${Ii.toFixed(5)} * clamp(tf, 0.0, 1.0);
    float ph = atan(dot(radial, ${_r(Zl)}), dot(radial, ${_r(hc)}));
    vec3 c = red();
    // the bell cuff in black lace from mid-forearm, its top scalloped, a marigold piping at its rim
    float cuffTop = 0.42 - scallop(ph * 0.5, 0.35, 0.09);
    c = mix(c, lace(p, black(), laceInk(), w), inside(cuffTop - tf, w / ${Ii.toFixed(3)}));
    c = mix(c, marigold(), inside(abs(tf - 0.965) - 0.018, w / ${Ii.toFixed(3)}));
    // inside the open cuff: dark
    c = mix(c, black() * 0.4, step(0.75, tf) * smoothstep(0.1, -0.3, dot(nn, normalize(radial))));
    // the frill at the top of the sleeve, scalloped along its hem, and the bare shoulder above it
    float ub = 0.39 + scallop(ph * 0.5, 0.35, 0.06) / ${Ki.toFixed(3)};
    c = mix(c, lace(p, black(), laceInk(), w), inside(tu - ub, w / ${Ki.toFixed(3)}));
    c = mix(c, bone(), inside(tu - 0.14, w / ${Ki.toFixed(3)}));
    return c;
  }

  vec3 gown(vec3 p, vec3 n, vec3 k, float w) {
    vec3 c = vec3(0.0);
    if (k.x > 0.001) c += torsoCol(p, n, w) * k.x;
    if (k.y > 0.001) c += skirtCol(p, n, w) * k.y;
    if (k.z > 0.001) c += armCol(p, n, w) * k.z;
    return c / max(1e-4, k.x + k.y + k.z);
  }`;function CA(){const n=new je({vertexColors:!0,roughness:.62,metalness:0});return n.onBeforeCompile=t=>{t.vertexShader=t.vertexShader.replace("#include <common>",`#include <common>
 varying vec3 vBind; varying vec3 vBindN;`).replace("#include <begin_vertex>",`#include <begin_vertex>
 vBind = position; vBindN = normal;`),t.fragmentShader=t.fragmentShader.replace("#include <common>",`#include <common>
`+RA).replace("#include <color_fragment>",`#include <color_fragment>
        float pw = max(length(fwidth(vBind)) * 0.6, 1e-4);
        // the vertex colour is the parts' weights (partTint), not a colour
        diffuseColor.rgb = gown(vBind, normalize(vBindN), diffuseColor.rgb, pw);`)},n.customProgramCacheKey=()=>"catrina-cloth-v4",n}const Hv=1.32,zv=-.1,Hd=(n,t)=>Hv*Math.atan2(n,t-zv),Mh=n=>{const t=Math.min(Math.abs(n),.95)/.7;return 16.08+.07*t*t},ts=[.42,17,1.18];function Hh(n,t,e){const i=Math.abs(n);let s=lt(n,t,e,0,17.42,-.08,1.02,1.1,1.22);return s=O(s,lt(n,t,e,0,16.85,-.38,.9,.6,.85),.3),s=O(s,lt(n,t,e,0,16.75,.45,.82,.88,.78),.35),s=O(s,lt(i,t,e,.66,16.68,.72,.3,.28,.42),.25),s=O(s,lt(n,t,e,0,16,.5,.68,.5,.62),.35),s=O(s,lt(n,t,e,0,15.68,.82,.3,.22,.28),.25),s=Fv(s,-lt(i,t,e,ts[0],ts[1],ts[2],.3,.28,.22),.1),s}const Vv=(n,t,e)=>Math.max(t-Mh(Hd(n,e)),-.05-e),LA=(n,t,e)=>Math.max(Hh(n,t,e),-Vv(n,t,e)),PA=(n,t,e)=>Math.max(Hh(n,t,e),Vv(n,t,e)),IA=new gt(16052200),DA=new gt(1705480);function Dm(n,t,e,i){const s=Hh(n,t,e)<-.025&&Math.abs(t-Mh(Hd(n,e)))<.06;i.copy(s?DA:IA)}const UA=`
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
    float u = ${Hv.toFixed(3)} * atan(p.x, p.z - (${zv.toFixed(3)})), v = p.y, au = abs(u);
    vec2 f = vec2(u, v);
    vec3 c = base;
    const float TAU = 6.2831853, N = 10.0;
    // a ring of petals round each socket, shorter toward the nose, a dot past each tip
    vec2 q = vec2(au - ${ts[0].toFixed(3)}, v - ${ts[1].toFixed(3)});
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
  }`;function FA(n){const t=n.std({name:"catrina-face",color:16777215,vertexColors:!0,roughness:.42,metalness:0,emissive:16777215,emissiveIntensity:.14});return t.onBeforeCompile=e=>{e.vertexShader=e.vertexShader.replace("#include <common>",`#include <common>
 varying vec3 vBind;`).replace("#include <begin_vertex>",`#include <begin_vertex>
 vBind = position;`),e.fragmentShader=e.fragmentShader.replace("#include <common>",`#include <common>
`+UA).replace("#include <color_fragment>",`#include <color_fragment>
        float fw = max(length(fwidth(vBind)) * 0.6, 1e-4);
        float skin = smoothstep(0.25, 0.6, diffuseColor.r);
        diffuseColor.rgb = mix(diffuseColor.rgb, paint(diffuseColor.rgb, vBind, fw), skin);`).replace("#include <emissivemap_fragment>",`#include <emissivemap_fragment>
 totalEmissiveRadiance *= diffuseColor.rgb;`)},t.customProgramCacheKey=()=>"catrina-face-v2",t}const Rc=n=>new C(n[0],n[1],n[2]);let Kl=1;const Fr=()=>(Kl=Kl*1664525+1013904223>>>0,Kl/4294967296);function Ze(n,t){const e=n.index?n.toNonIndexed():n;e!==n&&n.dispose(),e.deleteAttribute("uv"),e.attributes.normal||e.computeVertexNormals();const i=e.attributes.position,s=i.count,r=new Float32Array(s*3),a=new gt;for(let o=0;o<s;o++)typeof t=="function"?(a.setRGB(1,1,1),t(i.getX(o),i.getY(o),i.getZ(o),a)):a.set(t),r[o*3]=a.r,r[o*3+1]=a.g,r[o*3+2]=a.b;return e.setAttribute("color",new qt(r,3)),e}function ei(n){const t=zn(n,!1);for(const e of n)e.dispose();return t}function Gv(n,t){const e=Rc(t).sub(Rc(n)).normalize(),i=new C(1,0,0).addScaledVector(e,-e.x);i.lengthSq()<1e-6&&i.set(0,0,1),i.normalize();const s=new C().crossVectors(i,e);return new se().makeBasis(i,e,s).setPosition(n[0],n[1],n[2])}function Nr(n,t,e=[1,1,1],i=10){return new Xt(t,i,Math.max(5,Math.round(i*.7))).scale(e[0],e[1],e[2]).translate(n[0],n[1],n[2])}function wr(n,t,e,i,s){const r=Rc(t).distanceTo(Rc(n)),a=2,o=5,c=[];for(let u=0;u<=a;u++){const h=-Math.PI/2+u/a*(Math.PI/2);c.push(new ht(Math.max(.001,e*Math.cos(h)),e*.75*Math.sin(h)))}const l=Math.min(.2,1.3*Math.max(e,s)/r);for(let u=1;u<o;u++){const h=u/o;c.push(new ht(i+(e-i)*Math.exp(-((h/l)**2))+(s-i)*Math.exp(-(((1-h)/l)**2)),h*r))}for(let u=0;u<=a;u++){const h=u/a*(Math.PI/2);c.push(new ht(Math.max(.001,s*Math.cos(h)),r+s*.75*Math.sin(h)))}return new zi(c,6).applyMatrix4(Gv(n,t))}function NA(n,t){const e=Gv(n,[n[0]+t[0],n[1]+t[1],n[2]+t[2]]),i=1.42,s=(h,f,d)=>{const p=new C(h*i,f*i,d*i).applyMatrix4(e);return[p.x,p.y,p.z]},r=[];for(const[h,f,d]of[[0,.1,.14],[0,.1,-.02],[0,.1,-.18],[.02,.3,.18],[.02,.3,0],[.02,.3,-.16]])r.push(Nr(s(h,f,d),.13,[1,1,1],7));const a=[[.2,1.05],[.07,1.14],[-.07,1.06],[-.19,.88]];for(const[h,f]of a){const d=s(.02,.4,h*.85),p=s(0,.4+.55*f,h),v=s(-.07,.4+.93*f,h*1.05),g=s(-.16,.4+1.17*f,h*1.08),m=s(-.26,.4+1.33*f,h*1.08);r.push(wr(d,p,.1,.07,.105),wr(p,v,.1,.066,.095),wr(v,g,.09,.06,.082),wr(g,m,.078,.055,.06))}const o=s(0,.25,.24),c=s(-.05,.6,.46),l=s(-.1,.88,.56),u=s(-.16,1.08,.6);return r.push(wr(o,c,.11,.08,.1),wr(c,l,.1,.072,.088),wr(l,u,.088,.064,.06)),r}const Um=[16747008,16753178,15888896,16758320,15229952].map(n=>new gt(n));function Cf(n){const t=[],i=new se;for(let s=0;s<34;s++){const r=(s+.5)/34,a=Math.acos(1-r*1.2),o=s*2.39996+Fr()*.3,c=new C(Math.sin(a)*Math.cos(o),Math.cos(a),Math.sin(a)*Math.sin(o)),l=new C(-Math.sin(o),0,Math.cos(o)),u=new C().crossVectors(l,c);i.makeBasis(l,c,u).setPosition(c.clone().multiplyScalar(n*.62));const h=new Xt(1,6,4).scale(.08*n,.38*n,.26*n).applyMatrix4(i),f=Um[Math.floor(Fr()*Um.length)].clone().multiplyScalar(.8+.2*Math.sin(a));t.push(Ze(h,f))}return t.push(Ze(new Xt(n*.6,10,7),14178816)),ei(t)}function Wv(n,t=11538464){const r=[],a=(h,f)=>{const d=h/72,p=d*2.7*Math.PI*2,v=n*(.1+.62*d),g=1-.22*Math.abs(Math.sin(p*1.25)),m=n*(-.08-.3*d),M=n*(.42-.14*d)*g,x=f/2,_=m+(M-m)*x,b=v*(.82+.18*x+.4*d*x*x);return[Math.cos(p)*b,_,Math.sin(p)*b]};for(let h=0;h<72;h++)for(let f=0;f<2;f++){const d=a(h,f),p=a(h+1,f),v=a(h+1,f+1),g=a(h,f+1);r.push(...d,...p,...v,...d,...v,...g)}const o=new Me;o.setAttribute("position",new ae(r,3)),o.computeVertexNormals();const c=new gt(t),l=c.clone().multiplyScalar(.45),u=[Ze(o,(h,f,d,p)=>p.copy(l).lerp(c,or(Math.hypot(h,d)/(n*.5))*.6+or((f+.2*n)/(.6*n))*.4))];return u.push(Ze(Nr([0,-.12*n,0],n*.42,[1,.6,1],10),l)),ei(u)}function kA(n,t,e){const i=[];for(let s=0;s<5;s++){const r=s/5*Math.PI*2;i.push(Ze(new Xt(1,7,4).scale(n*.5,n*.12,n*.32).translate(n*.5,0,0).rotateY(r),t))}return i.push(Ze(Nr([0,.05*n,0],n*.22,[1,.7,1],8),e)),ei(i)}function Lf(n){const t=new Xt(1,8,5).scale(n*.22,n*.03,n*.5),e=t.attributes.position;for(let i=0;i<e.count;i++){const s=e.getZ(i)/(n*.5);e.setX(i,e.getX(i)*(1-.55*Math.max(0,s))),e.setY(i,e.getY(i)+.05*n*s*s)}return t.computeVertexNormals(),Ze(t.translate(0,0,n*.45),3107372)}function Fm(n,t,e,i,s=54){const r=new Mi(n.map(Rc)),a=[Ze(new Ps(r,24,.035,4,!1),e)],o=new gt(e),c=new gt(i),l=new C(0,-1,0);for(let u=0;u<s;u++){const h=.05+.95*(u/s),f=r.getPoint(h),d=r.getTangent(h),p=new C().crossVectors(d,new C(0,1,0));p.lengthSq()<1e-4&&p.set(1,0,0),p.normalize();const v=t*(.3+.7*Math.pow(Math.sin(Math.PI*Math.min(1,h*1.1)),.6));for(const g of[-1,1])for(let m=0;m<2;m++){const M=p.clone().multiplyScalar(g).addScaledVector(l,.35+.3*m+.2*h).addScaledVector(d,.35).normalize();M.x+=(Fr()-.5)*.3,M.y+=(Fr()-.5)*.3,M.z+=(Fr()-.5)*.3,M.normalize();const x=v*(.75+.35*Fr())*(m?.8:1),_=new ri(.05,x,3,1).translate(0,x/2,0);_.applyQuaternion(new ie().setFromUnitVectors(new C(0,1,0),M)).translate(f.x,f.y,f.z),a.push(Ze(_,(b,S,T,A)=>A.copy(o).lerp(c,or(Math.hypot(b-f.x,S-f.y,T-f.z)/x))))}}return ei(a)}const Q0=2.7,bs=1.1;function OA(){const n=[];for(let s=0;s<=6;s++){const r=s/6;n.push(new ht(bs-.07*r,.7*r))}for(let s=1;s<=8;s++){const r=s/8*Math.PI/2;n.push(new ht(Math.max(.001,(bs-.07)*Math.cos(r)),.7+.42*Math.sin(r)))}const t=[];for(let s=0;s<=14;s++){const r=s/14,a=bs-.02+r*(Q0-bs);t.push(new ht(a,-.06*Math.sin(Math.PI*r)+.26*r**4))}const e=ei([Ze(new zi(n,48),1577500),Ze(new zi(t,64),1577500),Ze(new Hn(Q0,.06,6,96).rotateX(Math.PI/2).translate(0,.26,0),2365994)]),i=e.attributes.position;for(let s=0;s<i.count;s++){const r=i.getX(s),a=i.getZ(s),o=Math.hypot(r,a);if(o>bs){const c=(o-bs)/(Q0-bs);i.setY(s,i.getY(s)+.1*c*c*Math.sin(3*Math.atan2(r,a)+.6))}}return e.computeVertexNormals(),e}function tu(n,t,e,i,s=.75,r=0){const a=t*Math.PI/180,o=new C(Math.sin(a),0,Math.cos(a)),c=o.clone().multiplyScalar(s).add(new C(0,1,0)).normalize();return n.rotateY(r),n.applyQuaternion(new ie().setFromUnitVectors(new C(0,1,0),c)),n.translate(o.x*e,i,o.z*e)}function BA(){const n=[],t=[[35,1.32,.62,.62,1.6],[72,1.26,.82,.58,1.6],[104,1.3,.52,.5,1.8],[6,1.36,.5,.46,1.8],[50,.9,1.18,.52,.8],[-150,1.3,.55,.5,1.6],[-118,1.36,.45,.4,1.8],[56,2.3,.3,.46,1.2]];for(const[s,r,a,o,c]of t)n.push(tu(Cf(o),s,r,a,c));const e=[[18,1.25,.98,.42,1.2],[92,1.05,1.12,.42,1],[54,1.62,.36,.46,1.6],[-14,1.38,.78,.36,1.5],[128,1.42,.45,.4,1.8],[-172,1.38,.62,.44,1.6],[28,2.28,.26,.38,1.2],[-36,1,1.1,.34,.8]];for(const[s,r,a,o,c]of e)n.push(tu(Wv(o),s,r,a,c,Fr()*6));const i=[[-28,1.3,.45,.26,14690426],[116,1.18,.95,.26,16051450],[78,1.62,.36,.26,14690426],[-138,1.22,.9,.26,10107592],[0,1.1,1.06,.24,16051450],[40,2.4,.2,.22,14690426],[150,1.35,.5,.24,10107592]];for(const[s,r,a,o,c]of i)n.push(tu(kA(o,c,16765498),s,r,a,1.4));for(const[s,r,a,o,c]of[[30,2.2,.25,1,.2],[90,2,.35,.95,-.3],[125,2,.3,.85,.4],[-160,2,.3,.85,.2],[-5,2,.3,.8,-.4],[60,2.5,.2,.8,-.3]]){const l=s*Math.PI/180;n.push(Lf(o).rotateX(-.35).rotateY(l+c).translate(Math.sin(l)*r*.62,a,Math.cos(l)*r*.62))}return ei(n)}function HA(){return ei([Fm([[1,.6,-.35],[1.25,1.7,-.45],[.95,2.55,-1.05],[.35,2.75,-1.9],[-.05,2.35,-2.55]],.7,16447218,15784172,60),Fm([[1.25,.5,.05],[1.85,1.45,-.15],[2.45,1.95,-.7],[2.85,1.7,-1.35]],.5,13641856,9050762,44)])}function zA(n,t){let e=0,i=2;for(let s=0;s<30;s++){const r=(e+i)/2;Hh(n,t,r)<0?e=r:i=r}return e}function VA(n,t){let e=0,i=2;for(let s=0;s<26;s++){const r=(e+i)/2;Od(n[0]+t[0]*r,n[1]+t[1]*r,n[2]+t[2]*r)<0?e=r:i=r}return e}const eu=[.05,18.15,-.05],GA=new Cn(-.14,.15,.1);function WA(n){Kl=11;const t=n.bones.get("pelvis").parent;if(t?.isSkinnedMesh){const _=t.geometry,b=_.attributes.position,S=_.attributes.color,T=_.attributes.skinIndex,A=_.attributes.skinWeight,w=qo("pelvis"),y=qo("thighL"),E=qo("thighR"),R=qo("armL"),L=qo("armR");for(let I=0;I<b.count;I++){const N=b.getX(I),B=b.getY(I),X=b.getZ(I),H=Math.abs(N),Y=S.getX(I)+S.getY(I)+S.getZ(I)||1,it=S.getX(I)/Y;if(S.getY(I)/Y>.5&&B<10.5){const vt=Nv(B),Ct=.42*Xs(-.3,.9,(X-vt)/Math.max(.5,Math.hypot(N,X-vt)))*Xs(10.4,6.8,B)*(1-.55*Xs(5.5,1,B)),Ft=Xs(-.9,.9,N);T.setXYZW(I,w,y,E,0),A.setXYZW(I,1-Ct,Ct*Ft,Ct*(1-Ft),0)}else if(it>.5&&B>13.8&&H>1.25){const vt=Xs(1.25,2.3,H)*Xs(13.8,14.35,B);vt>0&&(T.setZ(I,N>0?R:L),A.setXYZW(I,A.getX(I)*(1-vt),A.getY(I)*(1-vt),vt,0))}}T.needsUpdate=!0,A.needsUpdate=!0,t.material.dispose(),t.material=CA()}const e=(_,b,S,T)=>{const A=new nt(_,S);return A.name=T,n.at(A,b,0,0,0),A},i=(_,b,S,T)=>{for(const A of["L","R"]){const w=new nt(_,S);w.name=`${T}${A}`,A==="R"&&(w.scale.x=-1),n.at(w,b+A,0,0,0)}},s=FA(n);e(rn(LA,{min:[-1.12,15.8,-1.42],max:[1.12,18.6,1.4]},54,Dm,5e4),"head",s,"catrina-skull"),e(rn(PA,{min:[-.92,15.38,-.12],max:[.92,16.3,1.38]},34,Dm,16e3),"jaw",s,"catrina-jaw");const r=n.std({color:16183522,roughness:.35}),a=_=>{const b=[];for(let S=0;S<10;S++){const T=-.45+S/9*.9,A=Hd(T,1),w=Mh(A)+(_?-.07:.07),y=zA(T,Mh(A)+(_?.04:-.04))-.1;b.push(new Mc(.055,.08,2,6).scale(1,1,.7).rotateY(Math.atan2(T,.8)).translate(T,w,y))}return ei(b.map(S=>Ze(S,16183522)))};e(a(!0),"head",r,"catrina-teeth"),e(a(!1),"jaw",r,"catrina-lowerteeth"),e(Nr([0,16.02,.5],1,[.56,.3,.5],14),"head",n.std({color:1311754,roughness:.8}),"catrina-mouth");const o=n.std({color:14725184,roughness:.25,metalness:.85}),c=[];for(const _ of[1,-1])c.push(Ze(Nr([_*.93,16.5,-.18],.07,[1,1,1],8),16777215),Ze(new Hn(.1,.025,6,16).rotateY(Math.PI/2).translate(_*.95,16.33,-.18),16777215),Ze(Nr([_*.95,16.1,-.18],.1,[.8,1.4,.8],10),16777215));e(ei(c),"head",o,"catrina-earrings");const l=new de;l.name="catrina-hat",l.add(new nt(OA(),n.std({vertexColors:!0,roughness:.7,metalness:.05,side:Te}))),l.add(new nt(new Mn(bs+.02,bs+.03,.36,48,1,!0).translate(0,.2,0),n.std({color:6957712,roughness:.35,metalness:.1,side:Te})));const u=n.std({vertexColors:!0,roughness:.6,side:Te});l.add(new nt(BA(),u));const h=new nt(HA(),n.std({vertexColors:!0,roughness:.85,side:Te}));h.name="catrina-plumes",l.add(h),l.rotation.copy(GA),n.at(l,"head",eu[0],eu[1],eu[2]);const f=n.std({color:15920352,roughness:.45,emissive:2762272,emissiveIntensity:1}),d=[Ji[0]-sn[0],Ji[1]-sn[1],Ji[2]-sn[2]];i(ei(NA([Ji[0]-Qn[0]*.35,Ji[1]-Qn[1]*.35,Ji[2]-Qn[2]*.35],d).map(_=>Ze(_,16777215))),"forearm",f,"catrina-hand");const p=15.35;e(new Hn(.43,.075,8,32).rotateX(Math.PI/2).scale(1,1.6,1).translate(0,p,.02),"neck",n.std({color:1182740,roughness:.8}),"catrina-choker");const v=Cf(.17);v.rotateX(Math.PI/2).translate(0,p-.05,.5),e(v,"neck",u,"catrina-neckflower");const g=[];for(const[_,b,S]of[[.45,.075,30],[.85,.065,42]])for(let T=0;T<S;T++){const A=-Math.PI+(T+.5)/S*Math.PI*2,w=(1+Math.cos(A))/2,y=[.42*Math.sin(A),15.12-_*w*w,.02+.42*Math.cos(A)],E=Bc([Math.sin(A)*(.25+w),1.2*(1-w)*(1-w),Math.cos(A)*(.25+w)]),R=VA(y,E)+b*.85;g.push(Ze(new Xt(b,6,4).translate(y[0]+E[0]*R,y[1]+E[1]*R,y[2]+E[2]*R),16777215))}e(ei(g),"spine2",n.std({color:16183270,roughness:.18,metalness:.1,emissive:3157032,emissiveIntensity:1}),"catrina-pearls");const m=ei([Cf(.3).rotateX(1.3).rotateY(.5).translate(.95,ws+.05,1.05),Wv(.26).rotateX(1.2).rotateY(.9).translate(1.3,ws-.15,.62),Lf(.6).rotateY(1.2).translate(1.2,ws-.3,.9),Lf(.55).rotateY(-.2).rotateZ(-.6).translate(.75,ws-.25,1.05)]);e(m,"pelvis",u,"catrina-corsage");const M=-1.1,x=[Nr([0,ws,M-.06],1,[.2,.22,.14],10)];for(const _ of[1,-1]){x.push(new Hn(.36,.11,8,20).scale(1,.62,.45).rotateZ(_*.18).translate(_*.4,ws+.04,M));const b=new Mc(.12,1.3,3,8).scale(1.6,1,.4);b.rotateZ(_*.2).rotateX(-.12).translate(_*.28,ws-.78,M-.12),x.push(b)}e(ei(x.map(_=>Ze(_,16777215))),"pelvis",n.std({color:6957712,roughness:.35,metalness:.1}),"catrina-bow")}const Nm=new WeakMap,XA={id:"catrina",name:"Catrina",blurb:"A sugar-skull lady in a flowered hat",segs:Uv,body:{sdf:yA,region:TA,box:bA,palette:[16711680,65280,255],tint:AA,surface:"soft",weights:"sharp",capture:EA},dress:WA,fit:{size:1.06,limb:.6},face:{jaw:.35,eyes:[[ts[0],ts[1],ts[2]-.04,.3],[-.42,ts[1],ts[2]-.04,.3]]},res:80,tick(n,t){let e=Nm.get(n);e===void 0&&(e=n.getObjectByName("catrina-plumes")??null,Nm.set(n,e)),e&&(e.rotation.x=.03*Math.sin(t*1.3),e.rotation.z=.025*Math.sin(t*.9+1))}},zd=n=>n<0?0:n>1?1:n,mn=(n,t,e)=>{const i=zd((e-n)/(t-n));return i*i*(3-2*i)},$A=(n,t,e)=>-O(-n,-t,e),To=.12,Xv=.3,Ra={c:[0,17.25,.15],r:[1.42,1.5,1.38]},Vd=n=>.55*Math.sin(7*n+.3)+.3*Math.sin(12*n+1.7)+.15*Math.sin(17*n+.4),$v=n=>.06+.42*mn(14.8,5.4,n),qA=(n,t)=>4.9-.45*n-.08*Math.sin(29*t+1.1);function qv(n,t,e,i){const s=zd((14-t)/9.2),r=3.3+.45*s,a=1.72+.62*s,o=e-To,c=Math.hypot(n/r,o/a),l=Math.hypot(n/(r*r),o/(a*a));return(l>1e-6?c*(c-1)/l:-Math.min(r,a))-$v(t)*i}function Yv(n,t,e){const i=e-To;if(t<15.4&&n*n/30+i*i/15.2>1)return 2;let s=lt(n,t,e,Ra.c[0],Ra.c[1],Ra.c[2],Ra.r[0],Ra.r[1],Ra.r[2]);const r=Math.atan2(i,n),a=Vd(r);if(s=O(s,lt(n,t,e,0,14,.1,3.3,2.55,1.72)-$v(t)*a*mn(16.4,14,t),1.1),t<15.4){const o=qv(n,t,e,a);s=Math.min(s,Math.max(o,t-14)),s=Math.max(s,qA(a,r)-t),t<11&&(s=Math.max(s,-$A(o+Xv,t-10,.6)))}return s}const jv=0,YA=1;function jA(n,t,e){return t<10.6&&qv(n,t,e,Vd(Math.atan2(e-To,n)))<-Xv*.5?YA:jv}const ZA=new gt(10003644);function JA(n,t,e,i,s){if(n!==jv)return;const r=Vd(Math.atan2(i-To,t)),a=mn(15.5,5.6,e);s.lerp(ZA,zd(.75*a*Math.max(0,-r)+.1*a));const o=mn(1.1,.4,Math.abs(e-15.85))*mn(1.6,.9,Math.hypot(t,i-.1));s.multiplyScalar(1-.12*o)}const KA={min:[-4.55,3.95,-2.95],max:[4.55,19.1,3.2]},km=["head","armL","forearmL","armR","forearmR","thighL","thighR","spine2","spine1","pelvis"],[QA,tR,eR,nR,iR,sR,rR,aR,oR,cR]=[0,1,2,3,4,5,6,7,8,9];function lR(n,t,e,i){i.fill(0);const s=Math.abs(n),r=n>=0,a=15.65-.55*mn(.3,1.2,e),o=mn(a,a+.85,t),c=(1-o)*mn(1.45,2.95,s)*mn(15.4,14.3,t)*mn(5.6,9.4,t),l=c*mn(12.6,10.9,t),u=(1-o-c)*.65*mn(9.7,6.9,t)*mn(-1.9,-.3,e-To),h=u*mn(-1.1,1.1,n),f=Math.max(0,1-o-c-u),d=mn(12.6,13.9,t),p=1-mn(10,11.3,t);i[QA]=o,i[r?tR:nR]=c-l,i[r?eR:iR]=l,i[sR]=h,i[rR]=u-h,i[aR]=f*d,i[oR]=f*(1-d-p),i[cR]=f*p}function hR(n,t){const e=n.geometry.attributes.position,i=n.geometry.attributes.skinIndex,s=n.geometry.attributes.skinWeight,r=km.map(c=>t.findIndex(l=>l.name===c)),a=new Float32Array(km.length),o=[0,0,0,0];for(let c=0;c<e.count;c++){lR(e.getX(c),e.getY(c),e.getZ(c),a);let l=0;for(let u=0;u<4;u++){let h=-1;for(let f=0;f<a.length;f++)a[f]>1e-4&&(h<0||a[f]>a[h])&&(h=f);o[u]=h,h>=0&&(l+=a[h],a[h]=-a[h])}for(let u=0;u<4;u++){const h=o[u];i.setComponent(c,u,h>=0?r[h]:0),s.setComponent(c,u,h>=0?-a[h]/l:0)}}i.needsUpdate=!0,s.needsUpdate=!0}function zh(n,t){let e=0,i=3.2;for(let s=0;s<32;s++){const r=(e+i)/2;Yv(n,t,r)<0?e=r:i=r}return e}const fi={x:.47,y:17.48,rx:.29,ry:.43,tilt:.08},Xi={top:16.93,rx0:.25,ry0:.17,rx1:.21,ry1:.52},Pf=zh(fi.x,fi.y),uR=zh(0,16.75),fR=_v.map(n=>n.name==="jaw"?{name:"jaw",a:[0,16.75,.55],b:[0,16.75,uR+.15],parent:"head",reach:0}:n.name.startsWith("tail")?{...n,reach:0}:n);function Om(n,t,e=6,i=28){const r=c=>{const l=[],u=Math.cos(c.tilt),h=Math.sin(c.tilt),f=(d,p)=>{const v=c.cx+d*u-p*h,g=c.cy+d*h+p*u;l.push(v-t.x,g-t.y,zh(v,g)+.018-t.z)};f(0,0);for(let d=1;d<=e;d++)for(let p=0;p<i;p++){const v=p/i*Math.PI*2,g=d/e;f(Math.cos(v)*c.rx*g,Math.sin(v)*c.ry*g)}return new Float32Array(l)},a=[];for(let c=0;c<i;c++)a.push(0,1+c,1+(c+1)%i);for(let c=1;c<e;c++)for(let l=0;l<i;l++){const u=1+(c-1)*i+l,h=1+(c-1)*i+(l+1)%i,f=u+i,d=h+i;a.push(u,f,d,u,d,h)}const o=new Me;return o.setAttribute("position",new qt(r(n[0]),3)),o.setIndex(a),o.computeVertexNormals(),n.length>1&&(o.morphAttributes.position=n.slice(1).map(c=>new qt(r(c),3))),o}const Zv={value:0};function dR(){const n=new je({vertexColors:!0,roughness:.86,metalness:0,emissive:12900607,emissiveIntensity:.1});return n.onBeforeCompile=t=>{t.uniforms.uFlutter=Zv,t.vertexShader=t.vertexShader.replace("#include <common>",`#include <common>
 uniform float uFlutter;`).replace("#include <begin_vertex>",`#include <begin_vertex>
        { // the hem stirs: slow ripples round it, growing toward the edge; in bind pose, so it rides the bones
          float hem = smoothstep(8.2, 4.8, position.y);
          if (hem > 0.0) {
            vec2 r = vec2(position.x, position.z - ${To.toFixed(2)});
            float th = atan(r.y, r.x);
            float w = 0.6 * sin(uFlutter * 2.1 + th * 3.0 + position.y * 0.9) + 0.4 * sin(uFlutter * 3.3 - th * 5.0 + 1.3);
            transformed.xz += normalize(r + 1e-4) * (0.15 * hem * w);
            transformed.y += 0.07 * hem * sin(uFlutter * 2.7 + th * 4.0);
          }
        }`),t.fragmentShader=t.fragmentShader.replace("#include <emissivemap_fragment>",`#include <emissivemap_fragment>
        // a ghost's rim: a faint cool glow where the sheet turns away from the eye
        totalEmissiveRadiance += vec3(0.55, 0.75, 1.0) * 0.22 * pow(1.0 - clamp(abs(dot(normal, normalize(vViewPosition))), 0.0, 1.0), 2.5);`)},n.customProgramCacheKey=()=>"ghost-sheet-v1",n}function pR(n){const t=n.bones.get("pelvis").parent;t?.isSkinnedMesh&&(hR(t,n.segs),t.material.dispose(),t.material=dR(),t.name="ghost-sheet");const e=n.std({color:263431,roughness:1,metalness:0,polygonOffset:!0,polygonOffsetFactor:-4,polygonOffsetUnits:-4});for(const r of[1,-1]){const a=new C(r*fi.x,fi.y,Pf),o=new nt(Om([{cx:r*fi.x,cy:fi.y,rx:fi.rx,ry:fi.ry,tilt:-r*fi.tilt}],a),e);o.name=r>0?"ghost-eyeL":"ghost-eyeR",n.at(o,"head",a.x,a.y,a.z).castShadow=!1}const i=new C(0,Xi.top,zh(0,Xi.top)),s=new nt(Om([{cx:0,cy:Xi.top-Xi.ry0,rx:Xi.rx0,ry:Xi.ry0,tilt:0},{cx:0,cy:Xi.top-Xi.ry1,rx:Xi.rx1,ry:Xi.ry1,tilt:0}],i,7,32),e);s.name="ghost-mouth",n.at(s,"head",i.x,i.y,i.z).castShadow=!1}const Bm=new WeakMap,mR={id:"ghost",name:"Ghost",blurb:"A bedsheet ghost that says boo",segs:fR,body:{sdf:Yv,region:jA,box:KA,palette:[15330547,7107718],surface:"soft",weights:"soft",tint:JA},dress:pR,fit:{size:1.04,limb:.6,head:.45},face:{jaw:.3,eyes:[[fi.x,fi.y,Pf+.05,.34],[-.47,fi.y,Pf+.05,.34]],breath:{colors:[15398655,11066623,13155583,16777215],rate:.7,speed:.55,size:1.5}},res:90,tick(n,t,e){let i=Bm.get(n);i||(i={mouth:n.getObjectByName("ghost-mouth")??null,eyes:[n.getObjectByName("ghost-eyeL")??null,n.getObjectByName("ghost-eyeR")??null].filter(l=>!!l)},Bm.set(n,i)),Zv.value=t;const s=Math.max(0,Math.sin(t*.85-1)),r=e?e.jaw:.55*s*s*s;i.mouth?.morphTargetInfluences&&(i.mouth.morphTargetInfluences[0]=Math.min(1,r));const a=t%5.3<.14?1:0,o=e?e.blinkL:a,c=e?e.blinkR:a;i.eyes[0]&&(i.eyes[0].scale.y=1-.85*o),i.eyes[1]&&(i.eyes[1].scale.y=1-.85*c)}},gR=n=>n<0?0:n>1?1:n,Jv=(n,t,e)=>-O(-n,-t,e),Cc=[0,16.62,-.02],vR=[{name:"pelvis",a:[0,9.6,0],b:[0,10.6,0],parent:null},{name:"spine1",a:[0,10.6,0],b:[0,12.4,.1],parent:"pelvis"},{name:"spine2",a:[0,12.4,.1],b:[0,15,.1],parent:"spine1"},{name:"neck",a:[0,15,.1],b:[0,15.9,.15],parent:"spine2",reach:.8},{name:"head",a:[0,15.9,.15],b:[0,18.4,.3],parent:"neck"},{name:"jaw",a:Cc,b:[0,16.3,1.3],parent:"head",reach:0},{name:"tail1",a:[0,14.8,-1.2],b:[0,12.6,-1.4],parent:"spine2",reach:0},{name:"tail2",a:[0,12.6,-1.4],b:[0,10.4,-1.6],parent:"tail1",reach:0},{name:"tail3",a:[0,10.4,-1.6],b:[0,8.2,-1.8],parent:"tail2",reach:0},{name:"tail4",a:[0,8.2,-1.8],b:[0,6.2,-2],parent:"tail3",reach:0},{name:"thighL",a:[1.1,9.6,0],b:[1.2,5.3,.2],parent:"pelvis"},{name:"shinL",a:[1.2,5.3,.2],b:[1.2,1.1,-.1],parent:"thighL"},{name:"footL",a:[1.2,1.1,-.1],b:[1.2,.35,1.4],parent:"shinL"},{name:"thighR",a:[-1.1,9.6,0],b:[-1.2,5.3,.2],parent:"pelvis"},{name:"shinR",a:[-1.2,5.3,.2],b:[-1.2,1.1,-.1],parent:"thighR"},{name:"footR",a:[-1.2,1.1,-.1],b:[-1.2,.35,1.4],parent:"shinR"},{name:"armL",a:[2.52,14.55,0],b:[2.92,11.95,-.05],parent:"spine2"},{name:"forearmL",a:[2.92,11.95,-.05],b:[3.08,9.55,.38],parent:"armL"},{name:"armR",a:[-2.52,14.55,0],b:[-2.92,11.95,-.05],parent:"spine2"},{name:"forearmR",a:[-2.92,11.95,-.05],b:[-3.08,9.55,.38],parent:"armR"}],xR={min:[-4.2,-.5,-1.9],max:[4.2,16.6,2.3]},Hm=.13;function MR(n,t,e){const i=Math.abs(n);let s=4;if(t>8.2){s=lt(n,t,e,0,13.35,.1,1.62,1.95,1),s=O(s,lt(i,t,e,.8,13.8,.62,.82,.6,.42),.45),s=O(s,lt(n,t,e,0,13.75,-.32,1.66,1.25,.58),.4),s=O(s,K(i,t,e,0,15.3,-.2,1.85,14.95,-.1,.48,.34),.5),s=O(s,lt(n,t,e,0,11.6,.1,1.28,1.45,.86),.6),s=O(s,lt(n,t,e,0,10,0,1.62,1,1),.6),s=O(s,lt(i,t,e,.7,9.55,-.48,.8,.85,.6),.4),s=Math.max(s,-K(n,t,e,0,14.6,-1.06,0,10.6,-.94,.14,.12)),t>14.2&&(s=O(s,K(n,t,e,0,14.9,-.05,0,16.25,.1,.6,.52),.4)),s=O(s,lt(i,t,e,2.42,14.45,0,.6,.84,.7),.4);const r=O(K(i,t,e,2.52,14.4,0,2.92,11.98,-.05,.54,.42),lt(i,t,e,2.7,13.15,.1,.48,.95,.48),.3);if(s=t>14?O(s,r,.3):Math.min(s,r),t<12.4){let a=K(i,t,e,2.92,11.9,-.05,3.06,9.7,.36,.45,.3);a=O(a,lt(i,t,e,2.96,11.2,.05,.46,.8,.46),.3),a=O(a,lt(i,t,e,3.1,9.05,.45,.25,.55,.42),.2),a=O(a,K(i,t,e,3,9.4,.74,2.92,8.9,.94,.15,.12),.12),s=Math.min(s,a)}}return t<10.6&&(s=O(s,K(i,t,e,1.02,9.6,0,1.15,5.45,.2,.86,.54),.45),s=O(s,lt(i,t,e,1.12,7.7,.26,.74,1.6,.68),.4),s=O(s,lt(i,t,e,.82,8.3,0,.52,1.3,.58),.4),s=O(s,xe(i,t,e,1.17,5.3,.3,.5),.3),s=O(s,K(i,t,e,1.18,5.25,.15,1.2,1.15,-.1,.48,.32),.3),s=O(s,lt(i,t,e,1.2,3.95,-.26,.52,1.3,.56),.35),s=O(s,Math.max(lt(i,t,e,1.2,.5,.55,.46,.5,1.25),-t-Hm),.25)),s-Hm}const _R=()=>0,wR=(n,t,e,i)=>n.name.startsWith("thigh")?i>-1.6&&e<n.a[1]+.8&&Math.abs(Math.abs(t)-Math.abs(n.a[0]))<(e<n.a[1]+.3?1.3:.9):n.name.startsWith("arm")||n.name.startsWith("forearm")?Math.abs(t)>(e<12?2.3:e<14.1?1.95:2.15):!0,bR=17.16,_h=n=>bR+.07*n;function Kv(n,t,e){let i=lt(n,t,e,0,17.35,0,1.1,1.24,1.2);return i=O(i,lt(n,t,e,0,16.7,.4,.88,.9,.94),.4),i=O(i,K(n,t,e,-.62,17.42,1,.62,17.42,1,.2,.2),.3),i=O(i,K(n,t,e,0,17,1.16,0,16.6,1.36,.12,.17),.22),i}function Qv(n,t,e){const i=Math.abs(n),s=Math.hypot(n,e-.15),r=Math.atan2(n,e-.15);return Math.max(Math.abs(t-_h(i))-.085,.86-s,Math.abs(r)*s-.78)}const Gd=(n,t)=>Jv(n-(Cc[1]-.2*(t-Cc[2])),-.2-t,.15),zm=Cc[1]-.2*(1.3-Cc[2]);function yR(n,t,e){const i=Jv(Kv(n,t,e),-Qv(n,t,e),.04);return Math.max(i,-(Gd(t,e)-.012))}function SR(n,t,e){return Math.max(Kv(n,t,e),Gd(t,e)+.012)}const ER=new gt(14076846),TR=new gt(1182728);function Vm(n,t,e,i){const s=Qv(n,t,e)<.03||Math.abs(Gd(t,e))<.035;i.copy(s?TR:ER)}const AR=`
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
  }`;function RR(){const n=new je({vertexColors:!0,roughness:.92,metalness:0});return n.onBeforeCompile=t=>{t.vertexShader=t.vertexShader.replace("#include <common>",`#include <common>
 varying vec3 vBind;`).replace("#include <begin_vertex>",`#include <begin_vertex>
 vBind = position;`),t.fragmentShader=t.fragmentShader.replace("#include <common>",`#include <common>
`+AR).replace("#include <color_fragment>",`#include <color_fragment>
 float linenH; diffuseColor.rgb = linen(diffuseColor.rgb, vBind, linenH);`).replace("#include <normal_fragment_maps>",`#include <normal_fragment_maps>
 normal = linenBump(-vViewPosition, normal, vec2(dFdx(linenH), dFdy(linenH)) * 0.55, faceDirection);`)},n.customProgramCacheKey=()=>"mummy-linen-v1",n}function CR(n){const t=new cs({color:n,transparent:!0,opacity:.6,blending:Xr,depthWrite:!1,toneMapped:!1});return t.userData.keepBlend=!0,t.onBeforeCompile=e=>{e.vertexShader=e.vertexShader.replace("#include <common>",`#include <common>
 varying vec3 vHaloN; varying vec3 vHaloV;`).replace("#include <project_vertex>",`#include <project_vertex>
 vHaloN = normalize(normalMatrix * normal); vHaloV = -mvPosition.xyz;`),e.fragmentShader=e.fragmentShader.replace("#include <common>",`#include <common>
 varying vec3 vHaloN; varying vec3 vHaloV;`).replace("#include <color_fragment>",`#include <color_fragment>
 diffuseColor.a *= pow(clamp(dot(normalize(vHaloN), normalize(vHaloV)), 0.0, 1.0), 2.2);`)},t.customProgramCacheKey=()=>"mummy-halo-v1",t}let Ql=1;const LR=()=>(Ql=Ql*1664525+1013904223>>>0,Ql/4294967296);function PR(n){const t=zn(n.map(e=>e.index?e.toNonIndexed():e),!1);for(const e of n)e.dispose();return t}function IR(n,t,e,i){const a=[],o=[],c=[],l=new gt(14207396),u=new gt(7232062),h=new gt;for(let d=0;d<=14;d++){const p=d/14,v=i*p,g=Math.cos(v),m=Math.sin(v),M=d===14?.25:0;for(let x=0;x<3;x++){const _=(x/2-.5)*t,b=-n*p+(M?(LR()-.5)*M*n*.25:0);a.push(_*g+e*p*p,b,_*m+.15*Math.sin(p*3.1));const S=Math.abs(x/2-.5)*2;h.copy(l).lerp(u,gR(.15+.5*p*p+.2*S)).multiplyScalar(.92+.12*(1-S)),o.push(h.r,h.g,h.b)}}for(let d=0;d<14;d++)for(let p=0;p<2;p++){const v=d*3+p,g=v+1,m=v+3,M=m+1;c.push(v,m,g,g,m,M)}const f=new Me;return f.setAttribute("position",new ae(a,3)),f.setAttribute("color",new ae(o,3)),f.setIndex(c),f.computeVertexNormals(),f}const DR=[{bone:"forearmL",at:[3.25,9.95,.2],len:2.6,w:.42,curl:.35,twist:.9},{bone:"forearmR",at:[-3.15,11.5,-.25],len:1.9,w:.36,curl:-.25,twist:-.7},{bone:"pelvis",at:[1.55,10.45,.55],len:3.3,w:.44,curl:.4,twist:1.2},{bone:"pelvis",at:[-.75,10.6,-1],len:2.8,w:.4,curl:-.3,twist:-1},{bone:"head",at:[.55,17.9,-.95],len:2.2,w:.38,curl:.25,twist:.8}];function UR(n){Ql=11;const t=RR(),e=n.bones.get("pelvis").parent;e?.isSkinnedMesh&&(e.material.dispose(),e.material=t);const i=rn(yR,{min:[-1.3,15.65,-1.32],max:[1.3,18.72,1.62]},56,Vm,4e4),s=new nt(i,t);s.name="mummy-head",n.at(s,"head",0,0,0);const r=rn(SR,{min:[-1.05,15.6,-.35],max:[1.05,16.75,1.62]},40,Vm,2e4),a=new nt(r,t);a.name="mummy-jaw",n.at(a,"jaw",0,0,0);const o=new nt(new Xt(1,18,12).scale(.58,.3,.5).translate(0,zm-.1,.5),n.std({color:1838344,roughness:.9}));n.at(o,"head",0,0,0).castShadow=!1;const c=[];for(const[f,d]of[[-.42,.13],[-.25,.17],[-.08,.15],[.1,.18],[.36,.14]]){const p=Math.sqrt(Math.max(0,1-(f/.9)**2))*.82+.22;c.push(new Ie(.13,d,.1).rotateY(Math.atan2(f,p)).translate(f,zm-.03-d/2,p))}n.at(new nt(PR(c),n.std({color:13350794,roughness:.6})),"head",0,0,0).castShadow=!1;const l=n.std({color:0,emissive:16753182,emissiveIntensity:2.4,roughness:.4}),u=CR(16751140);for(const f of[1,-1]){const d=new nt(new Xt(.1,14,10).scale(1.5,.75,.6),l);d.name="mummy-eye";const p=new nt(new Xt(.1,16,10).scale(3.6,1.6,1.2),u);p.name="mummy-halo",p.renderOrder=2,d.add(p);const v=f*.4,g=.95;n.at(d,"head",v,_h(.4),.15+Math.sqrt(g*g-v*v)),d.castShadow=!1,p.castShadow=!1,p.receiveShadow=!1}const h=n.std({color:16777215,vertexColors:!0,roughness:.92,side:Te});DR.forEach((f,d)=>{const p=new de;p.name="mummy-end",p.userData.phase=d*1.7,p.add(new nt(IR(f.len,f.w,f.curl,f.twist),h)),n.at(p,f.bone,f.at[0],f.at[1],f.at[2])})}const nu=new ie,Gm=new ie,Wm=new Cn,Xm=new WeakMap,FR={id:"mummy",name:"Mummy",blurb:"Old linen, loose ends, eyes like embers",segs:vR,body:{sdf:MR,region:_R,box:xR,palette:[14076846],surface:"soft",weights:"sharp",capture:wR},dress:UR,fit:{size:1.06,limb:.6},face:{jaw:.38,eyes:[[.4,_h(.4),1.17,.3],[-.4,_h(.4),1.17,.3]],breath:{colors:[14731408,12098146,15786684,10126432],rate:.8,speed:.6,size:1.3}},res:84,tick(n,t,e){let i=Xm.get(n);if(!i){const r=[],a=[],o=new Set;n.traverse(c=>{c.name==="mummy-end"&&(r.push(c),a.push(c.userData.phase??0)),c.name==="mummy-eye"&&o.add(c.material)}),i={ends:r,phase:a,eyes:[...o]},Xm.set(n,i)}for(let r=0;r<i.ends.length;r++){const a=i.ends[r],o=i.phase[r];nu.identity();for(let c=a.parent;c&&c!==n;c=c.parent)nu.premultiply(c.quaternion);Wm.set(.16*Math.sin(t*1.25+o)+.05*Math.sin(t*3.1+o*2.3),0,.12*Math.sin(t*.95+o*1.3)),Gm.setFromEuler(Wm),a.quaternion.copy(nu.invert()).multiply(Gm)}const s=(2+.5*Math.sin(t*1.6)+.18*Math.sin(t*6.7+.8))*(1-.8*Math.max(e?.blinkL??0,e?.blinkR??0))*(1+.5*(e?.jaw??0));for(const r of i.eyes)r.emissiveIntensity=s}},ue=(n,t,e)=>{const i=Math.min(1,Math.max(0,(e-n)/(t-n)));return i*i*(3-2*i)},me=(n,t,e)=>n+(t-n)*e,wh=(n,t,e)=>-O(-n,-t,e);function Vr(n,t,e,i=!1,s=!1){const r=(n+1)*(t+1),a=new Float32Array(r*3),o=new Float32Array(r*2),c=new C;for(let h=0;h<=t;h++)for(let f=0;f<=n;f++){const d=h*(n+1)+f,p=-1+2*f/n,v=h/t;e(p,v,c),a[d*3]=c.x,a[d*3+1]=c.y,a[d*3+2]=c.z,o[d*2]=(p+1)/2,o[d*2+1]=v}const l=[];for(let h=0;h<t;h++)for(let f=0;f<n;f++){const d=h*(n+1)+f,p=d+1,v=d+n+1,g=v+1;i?l.push(d,v,p,p,v,g):l.push(d,p,v,p,g,v)}const u=new Me;if(u.setAttribute("position",new qt(a,3)),u.setAttribute("uv",new qt(o,2)),u.setIndex(l),u.computeVertexNormals(),s){const h=u.attributes.normal,f=new C,d=new C;for(let p=0;p<=t;p++){const v=p*(n+1),g=v+n;f.fromBufferAttribute(h,v).add(d.fromBufferAttribute(h,g)).normalize(),h.setXYZ(v,f.x,f.y,f.z),h.setXYZ(g,f.x,f.y,f.z)}}return u}function uc(n,t,e){const i=t.attributes.position,s=t.attributes.uv,r=new Map(n.segs.map((c,l)=>[c.name,l])),a=new Uint16Array(i.count*4),o=new Float32Array(i.count*4);for(let c=0;c<i.count;c++){const l=e(i.getX(c),i.getY(c),i.getZ(c),s?s.getX(c)*2-1:0,s?s.getY(c):0).filter(f=>f[1]>1e-4);l.sort((f,d)=>d[1]-f[1]);const u=Math.min(4,l.length);let h=0;for(let f=0;f<u;f++)h+=l[f][1];for(let f=0;f<u;f++)a[c*4+f]=r.get(l[f][0])??0,o[c*4+f]=h>0?l[f][1]/h:0;u===0&&(a[c*4]=r.get("spine2")??0,o[c*4]=1)}t.setAttribute("skinIndex",new qt(a,4)),t.setAttribute("skinWeight",new qt(o,4))}function th(n,t,e,i){const s=n.bones.get("pelvis").parent;if(!s?.isSkinnedMesh)return null;const r=new Fc(t,e);return r.name=i,r.castShadow=!0,r.receiveShadow=!0,r.frustumCulled=!1,s.add(r),r.bind(s.skeleton,s.bindMatrix),r}function Ks(n){const t=zn(n,!1);for(const e of n)e.dispose();return t}function eh(n,t,e,i,s,r=!1){const a=new je({color:16777215,roughness:e,metalness:0,side:Te,vertexColors:r}),o={uOut:{value:new gt(n)},uIn:{value:new gt(t)},uSheen:{value:i}};return a.onBeforeCompile=c=>{Object.assign(c.uniforms,o),c.fragmentShader=c.fragmentShader.replace("#include <common>",`#include <common>
 uniform vec3 uOut; uniform vec3 uIn; uniform float uSheen;`).replace("#include <color_fragment>",`#include <color_fragment>
 vec3 clothC = gl_FrontFacing ? uOut : uIn; diffuseColor.rgb *= clothC;`).replace("#include <emissivemap_fragment>",`#include <emissivemap_fragment>
 { float fr = 1.0 - abs(dot(normalize(vNormal), normalize(vViewPosition))); totalEmissiveRadiance += clothC * uSheen * pow(fr, 3.0); }`)},a.customProgramCacheKey=()=>s,a}function Gr(n,t,e,i=0,s=3){for(let r=0;r<30;r++){const a=(i+s)/2;n(t,e,a)<0?i=a:s=a}return i}function tx(n,t,e,i,s,r=.02){return s.set(n(t+r,e,i)-n(t-r,e,i),n(t,e+r,i)-n(t,e-r,i),n(t,e,i+r)-n(t,e,i-r)).normalize()}function NR(n,t,e,i,s=24){const r=new Mi(t.map(([f,d])=>new C(f,d,Gr(n,f,d)))),a=[],o=[],c=new C,l=new C,u=new C;for(let f=0;f<=s;f++){const d=r.getPointAt(f/s);if(r.getTangentAt(f/s,l),d.z=Gr(n,d.x,d.y),tx(n,d.x,d.y,d.z,c),u.crossVectors(l,c).normalize().multiplyScalar(e/2),d.addScaledVector(c,i),a.push(d.x-u.x,d.y-u.y,d.z-u.z,d.x+u.x,d.y+u.y,d.z+u.z),f>0){const p=(f-1)*2;o.push(p,p+1,p+2,p+1,p+3,p+2)}}const h=new Me;return h.setAttribute("position",new ae(a,3)),h.setIndex(o),h.computeVertexNormals(),h}function ex(n,t,e,i,s,r,a,o,c,l,u){const h=p=>{const v=p.attributes.position,g=p.attributes.normal,m=new C;for(let M=0;M<v.count;M++){const x=v.getX(M),_=v.getY(M),b=v.getZ(M);if(Math.abs(e(x,_,b))>.12)continue;const S=t(x,_,b);S>.02||S<-.08||(tx(t,x,_,b,m,.015),g.setXYZ(M,m.x,m.y,m.z))}return u?.(p),p},f=new nt(h(rn((p,v,g)=>Math.max(t(p,v,g),-e(p,v,g)),i,r,o,6e4)),c);f.name=`${l}-head`,n.at(f,"head",0,0,0);const d=new nt(h(rn((p,v,g)=>Math.max(t(p,v,g),e(p,v,g)),s,a,o,2e4)),c);d.name=`${l}-jaw`,n.at(d,"jaw",0,0,0)}function kR(n){const t=new je({vertexColors:!0,roughness:.6,metalness:0});return t.onBeforeCompile=e=>{e.fragmentShader=e.fragmentShader.replace("#include <roughnessmap_fragment>",`#include <roughnessmap_fragment>
 roughnessFactor = mix(0.28, roughnessFactor, smoothstep(0.004, 0.05, dot(vColor.rgb, vec3(0.333))));`)},t.customProgramCacheKey=()=>n,t}function nx(n,t,e,i,s,r,a={}){const o=a.look??[0,0],c=a.irisFrac??.5,l=n.std({color:a.white??15525594,roughness:.18}),u=n.std({color:i,emissive:i,emissiveIntensity:s,roughness:.15}),h=n.std({color:262916,roughness:.08}),f=n.std({color:16777215,emissive:16777215,emissiveIntensity:.7,roughness:.2}),d=a.lid!==void 0?n.std({color:a.lid,roughness:.55,side:Te}):null;for(const p of[1,-1]){const v=p>0?"L":"R",g=new de;g.name=`${r}${v}`,g.add(new nt(new Xt(e,20,14),l));const m=new de;m.rotation.set(o[0],-p*o[1],0);const M=new nt(new Xt(e*1.02,20,6,0,Math.PI*2,0,c),u);M.name=`${r}-iris`,M.rotation.x=Math.PI/2;const x=new nt(new Xt(e*1.035,16,4,0,Math.PI*2,0,c*.42),h);x.rotation.x=Math.PI/2;const _=new nt(new Xt(e*.16,8,6),f);if(_.position.set(p*e*.22,e*.28,e*.98),m.add(M,x,_),g.add(m),d){const b=new nt(new Xt(e*1.12,20,8,0,Math.PI*2,0,1.3),d);b.name=`${r}-lid${v}`,b.rotation.x=a.lidRest??.2,g.add(b)}n.at(g,"head",p*t[0],t[1],t[2])}}function ix(n,t,e,i,s,r,a){const o=n.std({color:r,roughness:.7});for(const c of[1,-1]){const l=new C(c*t[0],t[1],t[2]),u=new C(c*e[0],e[1],e[2]),h=new Mn(s,i,l.distanceTo(u),7,1).scale(1,1,.55),f=new nt(h,o);f.quaternion.setFromUnitVectors(new C(0,1,0),u.clone().sub(l).normalize());const d=new de;d.name=`${a}${c>0?"L":"R"}`,d.add(f);const p=l.add(u).multiplyScalar(.5);n.at(d,"head",p.x,p.y,p.z)}}function sx(n,t,e,i){const s={lids:[],eyes:[],brows:[],glow:[]};return n.traverse(r=>{if((r.name===`${t}-lidL`||r.name===`${t}-lidR`)&&s.lids.push({o:r,rest:r.rotation.x,left:r.name.endsWith("L")}),(r.name===`${t}L`||r.name===`${t}R`)&&s.eyes.push({o:r,left:r.name.endsWith("L")}),(r.name===`${e}L`||r.name===`${e}R`)&&s.brows.push({o:r,y:r.position.y}),i.includes(r.name)){const a=r.material;s.glow.includes(a)||s.glow.push(a)}}),s}function rx(n,t,e=.12){const i=s=>t?s?t.blinkL:t.blinkR:0;for(const s of n.lids)s.o.rotation.x=s.rest+(Math.PI/2-s.rest)*i(s.left);if(!n.lids.length)for(const s of n.eyes)s.o.scale.y=1-.9*i(s.left);for(const s of n.brows)s.o.position.y=s.y+e*(t?.browUp??0)}function ax(n,t){return(e,i,s,r)=>{const a=e.name;return a.startsWith("thigh")?r>-1.6&&s<e.a[1]+.8&&Math.abs(Math.abs(i)-Math.abs(e.a[0]))<(s<e.a[1]+.3?1.3:.9):a.startsWith("arm")||a.startsWith("forearm")?Math.abs(i)>n(s)&&r>-1.15:a==="head"?s>t:!0}}const $m=14.6,Xa=11.9,If=9.45,Wd=[{name:"pelvis",a:[0,9.6,0],b:[0,10.6,0],parent:null},{name:"spine1",a:[0,10.6,0],b:[0,12.4,.1],parent:"pelvis"},{name:"spine2",a:[0,12.4,.1],b:[0,15,.1],parent:"spine1"},{name:"neck",a:[0,15,.1],b:[0,15.9,.15],parent:"spine2",reach:.8},{name:"head",a:[0,15.9,.15],b:[0,18.4,.3],parent:"neck"},{name:"jaw",a:[0,16.55,-.12],b:[0,16.2,1.15],parent:"head",reach:0},{name:"tail1",a:[0,14.9,-1.3],b:[0,12.4,-1.6],parent:"spine2",reach:0},{name:"tail2",a:[0,12.4,-1.6],b:[0,9.9,-1.9],parent:"tail1",reach:0},{name:"tail3",a:[0,9.9,-1.9],b:[0,7.4,-2.2],parent:"tail2",reach:0},{name:"tail4",a:[0,7.4,-2.2],b:[0,4.9,-2.5],parent:"tail3",reach:0},{name:"thighL",a:[1.1,9.6,0],b:[1.2,5.3,.2],parent:"pelvis"},{name:"shinL",a:[1.2,5.3,.2],b:[1.2,1.1,-.1],parent:"thighL"},{name:"footL",a:[1.2,1.1,-.1],b:[1.2,.75,1.8],parent:"shinL"},{name:"thighR",a:[-1.1,9.6,0],b:[-1.2,5.3,.2],parent:"pelvis"},{name:"shinR",a:[-1.2,5.3,.2],b:[-1.2,1.1,-.1],parent:"thighR"},{name:"footR",a:[-1.2,1.1,-.1],b:[-1.2,.75,1.8],parent:"shinR"},{name:"armL",a:[2.4,$m,0],b:[2.72,Xa,-.05],parent:"spine2"},{name:"forearmL",a:[2.72,Xa,-.05],b:[2.85,If,.4],parent:"armL"},{name:"armR",a:[-2.4,$m,0],b:[-2.72,Xa,-.05],parent:"spine2"},{name:"forearmR",a:[-2.72,Xa,-.05],b:[-2.85,If,.4],parent:"armR"}],OR={min:[-3.6,-.3,-1.6],max:[3.6,16.6,2.2]};function Df(n,t,e){const i=Math.abs(n);let s=9;if(t>8.6&&(s=lt(n,t,e,0,13.3,.05,1.78,1.95,1.05),s=O(s,lt(n,t,e,0,11.4,.1,1.38,1.25,.92),.55),s=O(s,lt(n,t,e,0,9.95,0,1.6,1.05,1),.5),t>13.4&&(s=O(s,K(i,t,e,0,15,-.1,2.25,14.6,0,.55,.6),.5),s=O(s,K(n,t,e,0,14.8,-.02,0,16.2,.06,.48,.38),.3))),t<10.9&&(s=O(s,K(i,t,e,1,9.7,0,1.16,5.4,.15,.86,.58),.45),t<6.4&&(s=O(s,K(i,t,e,1.16,5.4,.15,1.2,1.35,-.08,.57,.44),.3))),t<1.9){let r=Math.max(lt(i,t,e,1.2,.48,.55,.5,.48,1.25),-t);r=O(r,Math.max(K(i,t,e,1.2,.36,.7,1.2,.3,1.95,.4,.17),-t),.25),s=O(s,r,.3)}if(i>1.5&&t>8.2&&t<15.6){const r=K(i,t,e,2.4,14.4,0,2.72,11.95,-.05,.56,.47);if(s=t>14?O(s,r,.35):Math.min(s,r),t<12.6){let a=K(i,t,e,2.72,11.95,-.05,2.84,10.15,.27,.46,.41);a=O(a,K(i,t,e,2.83,10.25,.25,2.85,9.85,.33,.37,.36),.06);let o=K(i,t,e,2.85,9.9,.33,2.86,9.4,.42,.22,.21);o=O(o,lt(i,t,e,2.87,9.05,.47,.19,.45,.36),.2),o=O(o,lt(i,t,e,2.88,8.45,.52,.15,.5,.3),.15),o=O(o,K(i,t,e,2.78,9.3,.76,2.72,8.8,.92,.12,.09),.1),s=Math.min(s,O(a,o,.1))}}return s}const Uf=0,BR=1,HR=2,qm=3,zR=4;function ox(n,t,e){const i=Math.abs(n);return t<1.12&&i>.5?HR:i>2.45&&t<10.3?t<9.86?qm:zR:t>15.3&&i<.7?qm:i>2&&t>9?Uf:t<10.55?BR:Uf}const VR=[.86,.82,.16,.5,.6],GR=`
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
  }`;function WR(){const n=new je({vertexColors:!0,roughness:.7,metalness:0});return n.onBeforeCompile=t=>{t.vertexShader=t.vertexShader.replace("#include <common>",`#include <common>
 attribute float aTux; attribute float aRough; varying vec3 vBind; varying vec3 vBindN; varying float vTux; varying float vRough;`).replace("#include <begin_vertex>",`#include <begin_vertex>
 vBind = position; vBindN = normal; vTux = aTux; vRough = aRough;`),t.fragmentShader=t.fragmentShader.replace("#include <common>",`#include <common>
`+GR).replace("#include <color_fragment>",`#include <color_fragment>
 float tuxRough = vRough; { float r2 = vRough; vec3 tc = tux(diffuseColor.rgb, vBind, normalize(vBindN), r2); diffuseColor.rgb = mix(diffuseColor.rgb, tc, vTux); tuxRough = mix(vRough, r2, vTux); }`).replace("#include <roughnessmap_fragment>",`#include <roughnessmap_fragment>
 roughnessFactor = tuxRough;`)},n.customProgramCacheKey=()=>"vamp-tux-v1",n}const XR=16.29,cx=1.16,bh=n=>XR+.21*(cx-n),lx=.44,$R=(n,t,e)=>Math.max(t-bh(e),-.15-e,15.98-.32*(e+.15)-t,Math.abs(n)-lx),Ys=[0,.42,.9,1.3,1.72,2.3,Math.PI],Qs=[17.78,18.08,17.86,17.36,17.28,16.85,16.6];function qR(n,t){const e=Math.atan2(n,t);for(let i=1;i<Ys.length;i++)if(e<=Ys[i]){const s=(e-Ys[i-1])/(Ys[i]-Ys[i-1]);return me(Qs[i-1],Qs[i],s)}return Qs[Qs.length-1]}const es=[.34,17.14,.93],YR=(n,t,e)=>{const i=qR(n,e);return .08*ue(i-.03,i+.14,t)*(1+.8*ue(17,18,t)*ue(.1,-.7,e))},hx=(n,t,e)=>lt(n,t,e,0,17.42,.02,.9,1,1.08)-YR(Math.abs(n),t,e);function Xd(n,t,e){const i=Math.abs(n);let s=hx(n,t,e);return s=O(s,lt(n,t,e,0,16.85,.45,.74,.95,.75),.4),s=O(s,lt(n,t,e,0,16.03,.72,.38,.3,.36),.3),s=O(s,K(i,t,e,.68,16.62,-.05,.27,15.97,.72,.17,.15),.3),s=O(s,lt(i,t,e,.5,16.98,.8,.3,.17,.28),.2),s=wh(s,-lt(i,t,e,.56,16.5,.95,.22,.28,.2),.2),s=O(s,K(i,t,e,.1,17.4,1.04,.62,17.48,.84,.1,.08),.15),s=wh(s,-lt(i,t,e,es[0],es[1],1.08,.24,.15,.2),.08),s=O(s,K(n,t,e,0,17.2,1.04,0,16.7,1.4,.085,.11),.12),s=O(s,lt(i,t,e,.11,16.68,1.22,.1,.08,.1),.08),s=O(s,K(i,t,e,0,16.36,1.12,.27,16.33,.98,.055,.035),.06),s=O(s,K(i,t,e,0,16.21,1.08,.24,16.25,.96,.055,.035),.06),s=O(s,lt(i,t,e,.88,17,-.05,.1,.32,.2),.12),s=O(s,K(i,t,e,.9,17.15,-.1,1.04,17.66,-.36,.12,.02),.1),O(s,K(n,t,e,0,15.2,-.06,0,16.5,0,.47,.45),.3)}function jR(){const n=new je({vertexColors:!0,roughness:.58,metalness:0}),t=Ys.map((e,i)=>`if (ph <= ${e.toFixed(4)}) return mix(${Qs[i-1]?.toFixed(3)??"0.0"}, ${Qs[i].toFixed(3)}, (ph - ${(Ys[i-1]??0).toFixed(4)}) / ${(e-(Ys[i-1]??e-1)||1).toFixed(4)});`).slice(1).join(`
    `);return n.onBeforeCompile=e=>{e.vertexShader=e.vertexShader.replace("#include <common>",`#include <common>
 attribute float aHair; varying float vHair; varying vec3 vHeadP;`).replace("#include <begin_vertex>",`#include <begin_vertex>
 vHair = aHair; vHeadP = position;`),e.fragmentShader=e.fragmentShader.replace("#include <common>",`#include <common>
  varying float vHair; varying vec3 vHeadP;
  float hairline(vec3 p) {
    float ph = atan(abs(p.x), p.z);
    ${t}
    return ${Qs[Qs.length-1].toFixed(3)};
  }`).replace("#include <color_fragment>",`#include <color_fragment>
  float hairK = smoothstep(-0.006, 0.006, vHeadP.y - hairline(vHeadP)) * smoothstep(0.35, 0.65, vHair);
  // combed back: faint streaks along the head
  vec3 hairC = vec3(0.0035, 0.0035, 0.005) * (0.8 + 0.4 * sin(atan(vHeadP.x, -vHeadP.z + 0.4) * 90.0));
  diffuseColor.rgb = mix(diffuseColor.rgb, hairC, hairK);`).replace("#include <roughnessmap_fragment>",`#include <roughnessmap_fragment>
 roughnessFactor = mix(roughnessFactor, 0.26, hairK);`)},n.customProgramCacheKey=()=>"vamp-head-v2",n}function ZR(n){const t=n.attributes.position,e=new Float32Array(t.count);for(let i=0;i<t.count;i++)e[i]=Math.abs(hx(t.getX(i),t.getY(i),t.getZ(i)))<.05?1:0;n.setAttribute("aHair",new qt(e,1))}function JR(n,t,e){if(t<15)return 15.1-t;const i=lt(n,t,e,0,16.95,.15,1.25,1.95,1.55);return i>.35?i:Xd(n,t,e)}const KR=new gt(14474452),iu=new gt(9340568),QR=new gt(6956080),t6=new gt(2098182),e6=new gt(15657178);function n6(n,t,e,i){const s=Math.abs(n);if(Xd(n,t,e)<-.07){i.copy(e>cx-.24&&s<.36&&Math.abs(t-bh(e))<.12?e6:t6),s>lx-.05&&i.copy(iu).multiplyScalar(.55);return}i.copy(KR);const a=Math.hypot((s-es[0])/.36,(t-es[1]+.04)/.26,(e-1)/.4);i.lerp(iu,.55*(1-ue(.7,1.25,a)));const o=Math.hypot((s-.56)/.3,(t-16.5)/.36);i.lerp(iu,.3*(1-ue(.4,1,o))*ue(.6,.9,e)),e>.95&&s<.3&&Math.abs(t-bh(e))<.08&&i.copy(QR)}const ux=2.75,$a=.17,$d=n=>15.52-.22*(1-n)/2,Ym=n=>14.62-.3*Math.max(0,n)**2;function i6(n,t,e){let i,s,r,a,o,c=0;if(t<=$a){const l=t/$a;i=n*2.09;const u=Math.cos(i),h=$d(u),f=Ym(u),d=me(2,4,Math.abs(Math.sin(i)));o=f+(h-f)*Math.pow(Math.max(0,1-l**d),1/d),s=me(.76,3.15,l),r=me(.76,1.5,l),a=me(0,-.1,l)}else{const l=(t-$a)/(1-$a);i=n*me(2.09,1.76,ue(0,.3,l));const u=Math.cos(i);o=me(Ym(u),ux+.35*Math.abs(n)**2,l),s=3.15+.72*Math.sqrt(l)+.6*l*l,r=1.5+.42*Math.sqrt(l)+.55*l*l,a=-.1-.25*l,c=(.012+.09*l)*Math.sin(i*6.5+.4)*ue(0,.12,l)}e.set(s*(1+c)*Math.sin(i),o,a-r*(1+c)*Math.cos(i))}function s6(n,t,e){const i=n*me(2.09,1.72,t),s=Math.cos(i),r=18.12+.62*Math.abs(n)**1.6,a=me($d(s)-.05,r,t),o=.4*t+.6*t*t,c=me(.8,2,o),l=me(.8,1.62,o),u=me(0,-.18,t);e.set(c*Math.sin(i),a,u-l*s)}const br=Wd.filter(n=>n.name.startsWith("tail"));function r6(n,t,e){if(t<=0)return;const i=br[0].a[1];if(n>=i){e.push(["spine2",t]);return}for(let s=0;s<br.length;s++){const r=br[s],a=r.a[1]-r.b[1];if(n>=r.b[1]||s===br.length-1){const o=Math.min(1,(r.a[1]-n)/a),c=s>0?br[s-1].name:"spine2",l=s<br.length-1?br[s+1].name:null;if(o<.5){const u=.5-o;e.push([r.name,t*(1-u)],[c,t*u])}else if(l){const u=Math.min(.5,o-.5);e.push([r.name,t*(1-u)],[l,t*u])}else e.push([r.name,t]);return}}}function a6(n,t,e,i,s){const r=[],a=n>=0?"L":"R",o=Math.abs(i);let c;if(s<=$a?c=ue(.4,.85,o)*ue(.35,1,s/$a)*.9:c=ue(.3,.78,o)*Math.pow(ue(ux+.3,If+.2,t),1.3),c>0){const l=ue(Xa-.9,Xa+.9,t);r.push(["arm"+a,c*l],["forearm"+a,c*(1-l)])}return r6(t,1-c,r),r}function o6(n){const t=n.bones.get("pelvis").parent;if(t?.isSkinnedMesh){const A=t.geometry.attributes.position,w=new Float32Array(A.count),y=new Float32Array(A.count);for(let E=0;E<A.count;E++){const R=A.getX(E),L=A.getY(E),I=A.getZ(E),N=ox(R,L);w[E]=N===Uf&&Math.abs(R)<1.9&&L>10.8&&L<15.4&&I>0?1:0,y[E]=VR[N]??.7}t.geometry.setAttribute("aTux",new qt(w,1)),t.geometry.setAttribute("aRough",new qt(y,1)),t.material.dispose(),t.material=WR()}ex(n,JR,$R,{min:[-1.12,15.05,-1.28],max:[1.12,18.62,1.62]},{min:[-.52,15.55,-.25],max:[.52,16.75,1.35]},56,30,n6,jR(),"vamp",ZR),nx(n,es,.13,11538464,.55,"vamp-eye",{look:[.05,0],lid:11051694,lidRest:.32,white:14998992,irisFrac:.62});const e=(A,w)=>{const y=17.42+w;return[A,y,Gr(Xd,A,y,.3,1.6)+.025]};ix(n,e(.1,.02),e(.6,.17),.065,.025,657932,"vamp-brow");const i=n.std({color:16052454,roughness:.25});for(const A of[1,-1]){const w=new nt(new ri(.048,.24,8).rotateX(Math.PI),i);n.at(w,"head",A*.2,bh(.94)-.1,.94)}const s=Vr(40,6,(A,w,y)=>{const E=A*2.72,R=Math.abs(A),L=ue(.78,1,R),I=me(14.96,15.6-.32*L,w),N=me(.62,.56,w)+.13*L*w;y.set(N*Math.sin(E),I,.03-N*Math.cos(E))});n.at(new nt(s,n.std({color:15921386,roughness:.55,side:Te})),"neck",0,0,0);const r=Vr(76,60,i6);uc(n,r,a6);const a=Vr(44,14,s6,!0);uc(n,a,()=>[["spine2",1]]);const o=eh(1512734,9046036,.36,.5,"vamp-cape-v1");th(n,Ks([r,a]),o,"vamp-cape");const c=n.std({color:13936192,roughness:.28,metalness:.9}),l=[],u=2.09,h=.8*Math.sin(u),f=-.8*Math.cos(u),d=$d(Math.cos(u))-.12;for(const A of[1,-1])l.push(new Mn(.16,.16,.07,16).rotateX(Math.PI/2).rotateY(A*.6).translate(A*h,d,f+.04)),l.push(new Xt(.085,10,8).translate(A*h*1.03,d,f+.09));const p=new Mi([new C(h*.95,d,f+.08),new C(0,d-.38,f+.32),new C(-h*.95,d,f+.08)]);l.push(new Ps(p,12,.035,6,!1)),n.at(new nt(Ks(l),c),"spine2",0,0,0);const v=n.std({color:10095640,roughness:.4,side:Te}),g=12.85,m=Gr(Df,0,g),M=[];for(const A of[1,-1])M.push(NR(Df,[[A*.1,g+.35],[A*.3,14],[A*.5,15]],.2,.03));n.at(new nt(Ks(M),v),"spine2",0,0,0);const x=new de,_=new nt(new Mn(.4,.4,.07,32).rotateX(Math.PI/2),c),b=new nt(new Hn(.4,.045,8,32),c),S=Ks(Array.from({length:12},(A,w)=>{const y=w/12*Math.PI*2;return new Xt(.045,8,6).translate(Math.cos(y)*.29,Math.sin(y)*.29,.05)})),T=new nt(new Xt(.16,16,12).scale(1,1.15,.55),n.std({color:9043984,emissive:12582938,emissiveIntensity:.45,roughness:.08,metalness:.2}));T.name="vamp-gem",T.position.z=.05,x.add(_,b,new nt(S,c),T),n.at(x,"spine2",0,g,m+.07)}const jm=new WeakMap,c6={id:"vampire",name:"Vampire",blurb:"A caped count with a medallion, fangs and red eyes",segs:Wd,body:{sdf:Df,region:ox,box:OR,palette:[1512988,1249815,394760,14474452,15724006],surface:"suit",weights:"sharp",capture:ax(n=>n<12?2.15:n<14.1?1.95:2.05,15.85)},dress:o6,fit:{size:1.06,limb:.7},idle:{tail:.04},face:{jaw:.42,eyes:[[es[0],es[1],es[2]+.12,.17],[-.34,es[1],es[2]+.12,.17]],breath:{colors:[11534360,6946832,16722490,2752520],rate:.8,speed:.6,size:1.2}},res:84,tick(n,t,e){let i=jm.get(n);i||(i=sx(n,"vamp-eye","vamp-brow",["vamp-eye-iris","vamp-gem"]),jm.set(n,i)),rx(i,e);const s=.45+.12*Math.sin(t*1.3)+1.1*(e?.jaw??0);for(const r of i.glow)r.emissiveIntensity=s}},fx=Wd,Lc=n=>fx.find(t=>t.name===n),Zm=5.3,l6={min:[-3.5,.6,-1.5],max:[3.5,16.6,1.6]};function yh(n,t,e){const i=Math.abs(n);let s=9;if(t>8.7&&(s=lt(n,t,e,0,13.25,.05,1.58,1.85,.98),s=O(s,lt(i,t,e,.62,13.15,.5,.56,.52,.48),.35),s=O(s,lt(n,t,e,0,11.35,.05,1.1,1.25,.78),.55),s=O(s,lt(n,t,e,0,10,0,1.42,1,.95),.5),t>13.4&&(s=O(s,K(i,t,e,0,14.95,-.1,2.15,14.6,0,.46,.5),.45),s=O(s,K(n,t,e,0,14.8,-.02,0,16.2,.06,.42,.34),.3))),t<10.9&&(s=O(s,K(i,t,e,1,9.7,0,1.14,5.4,.15,.62,.46),.45),t<6.4&&(s=O(s,K(i,t,e,1.14,5.4,.15,1.2,1.25,-.08,.42,.3),.3))),i>1.5&&t>7.6&&t<15.6){const r=K(i,t,e,2.4,14.4,0,2.72,11.95,-.05,.48,.4);if(s=t>14?O(s,r,.35):Math.min(s,r),t<12.6){const a=K(i,t,e,2.72,11.95,-.05,2.83,10.3,.25,.39,.44);let o=K(i,t,e,2.83,10.4,.25,2.86,9.4,.42,.17,.18);o=O(o,lt(i,t,e,2.87,9.05,.47,.17,.42,.33),.2);for(let c=0;c<4;c++){const l=.27+c*.14;o=O(o,K(i,t,e,2.88,8.75,l,2.92,8.75-(c===0||c===3?.42:.55),l+.12,.075,.05),.06)}o=O(o,K(i,t,e,2.79,9.3,.76,2.72,8.82,.95,.1,.07),.08),s=Math.min(s,a,o)}}return s}const h6=0,Jm=1,u6=2;function f6(n,t){const e=Math.abs(n);return e>2.5&&t<10.35||t>15.3&&e<.6?Jm:t<10.2&&e<2.2?u6:h6}const d6=-.12,p6=16.24,dx=1.1,Ff=n=>p6+.21*(dx-n),px=.42,m6=(n,t,e)=>Math.max(t-Ff(e),d6-.03-e,15.98-.32*(e+.15)-t,Math.abs(n)-px),ns=[.32,17.12,.9],ao=[.14,16.92,1.52];function Sh(n,t,e){if(t<15)return 15.1-t;const i=lt(n,t,e,0,16.95,.3,1.2,1.95,1.8);if(i>.35)return i;const s=Math.abs(n);let r=lt(n,t,e,0,17.42,.02,.88,.98,1.05);return r=O(r,lt(n,t,e,0,16.85,.42,.7,.95,.72),.4),r=O(r,K(n,t,e,0,16.25,.72,0,15.78,1,.24,.13),.3),r=O(r,K(s,t,e,.62,16.62,-.05,.2,15.92,.8,.15,.12),.3),r=O(r,lt(s,t,e,.48,16.95,.76,.28,.17,.25),.2),r=wh(r,-lt(s,t,e,.52,16.48,.92,.2,.26,.18),.2),r=O(r,K(s,t,e,.1,17.38,1,.6,17.44,.82,.09,.07),.15),r=wh(r,-lt(s,t,e,ns[0],ns[1],1.04,.23,.14,.19),.08),r=O(r,K(n,t,e,0,17.18,1,0,16.98,1.42,.085,.125),.12),r=O(r,K(n,t,e,0,16.98,1.42,0,16.68,1.9,.125,.09),.08),r=O(r,K(n,t,e,0,16.68,1.9,0,16.5,1.84,.09,.06),.06),r=O(r,K(n,t,e,0,16.52,1.8,0,16.6,1.18,.07,.1),.1),r=O(r,lt(s,t,e,.1,16.64,1.3,.09,.07,.14),.08),r=O(r,xe(n,t,e,ao[0],ao[1],ao[2],.07),.03),r=O(r,K(s,t,e,0,16.3,1.08,.27,16.33,.94,.05,.03),.05),r=O(r,K(s,t,e,0,16.16,1.05,.24,16.21,.93,.05,.03),.05),r=O(r,lt(s,t,e,.86,17,-.05,.1,.3,.2),.12),O(r,K(n,t,e,0,15.2,-.06,0,16.5,0,.44,.42),.3)}const g6=new gt(10011258),su=new gt(5602368),v6=new gt(5917264),x6=new gt(1836296),M6=new gt(14208140),_6=new gt(6974002),w6=new gt(1446930);function b6(n,t,e,i){const s=Math.abs(n);if(Sh(n,t,e)<-.07){const c=e>dx-.26&&s<.36&&Math.abs(t-Ff(e))<.13,l=(n+.36)/.12,u=Math.floor(l)===4;i.copy(c&&!u&&l-Math.floor(l)<.8?M6:x6),s>px-.05&&i.copy(su).multiplyScalar(.55);return}if(t>17.62-.35*ue(.4,1.3,Math.atan2(s,e))){i.copy(w6);return}i.copy(g6);const a=Math.hypot((s-ns[0])/.36,(t-ns[1]+.04)/.26,(e-.98)/.4);i.lerp(su,.6*(1-ue(.7,1.25,a)));const o=Math.hypot((s-.52)/.3,(t-16.48)/.36);i.lerp(su,.35*(1-ue(.4,1,o))*ue(.6,.9,e)),i.lerp(new gt(10132058),.4*(1-ue(.1,.35,Math.hypot(n,t-16.62,e-1.88)))),Math.hypot(n-ao[0],t-ao[1],e-ao[2])<.1&&i.copy(_6),e>.9&&s<.28&&Math.abs(t-Ff(e))<.05&&i.copy(v6)}const Eh=11.2,Nf=4.45;let oo=11;const Yn=()=>(oo=oo*1664525+1013904223>>>0,oo/4294967296);function qd(n,t){oo=t;const e=Array.from({length:n},()=>.45+.55*Yn());return i=>{const s=(i+1)/2*n,r=Math.floor(s)%n,a=s-Math.floor(s);return e[r]*(1-Math.abs(a*2-1))}}const y6=qd(22,5);function S6(n){if(n>10){const t=ue(Eh,10,n);return[me(1.06,1.75,t),me(.74,1.2,t)]}return[1.75+.12*(10-n),1.2+.16*(10-n)]}function E6(n,t,e){const i=n*Math.PI,s=me(Eh,Nf-.85*y6(n)+.15*Math.cos(i),t),[r,a]=S6(s),o=ue(10,Nf,s),c=1+(.012+.055*o)*Math.sin(i*9+.7)*ue(10.4,9.6,s);e.set(r*c*Math.sin(i),s,.02-.12*o+a*c*Math.cos(i))}function T6(n,t,e){const i=Math.min(1,Math.max(0,(Eh-t)/(Eh-Nf))),s=Math.max(0,e/Math.max(.5,Math.hypot(n,e))),r=ue(.05,.35,i)*(.3+.7*s)*.92,a=ue(-.7,.7,n),o=.5*ue(Zm+.6,Zm-.9,t);return[["pelvis",1-r],["thighL",r*a*(1-o)],["shinL",r*a*o],["thighR",r*(1-a)*(1-o)],["shinR",r*(1-a)*o]]}const qa=.5,A6=qd(16,9),R6=n=>15.48-.2*(1-n)/2,Km=n=>14.62-.3*Math.max(0,n)**2,C6=n=>{const t=Math.abs(n);return t<.55?me(10.9,12.6,ue(0,.55,t)):me(12.6,11.9,ue(.55,1,t))};function L6(n,t,e){const i=n*2.72,s=Math.cos(i);let r,a,o,c;if(t<=qa){const h=t/qa,f=R6(s),d=Km(s),p=me(2,3,Math.abs(Math.sin(i)));c=d+(f-d)*Math.pow(Math.max(0,1-h**p),1/p),r=me(.68,2.92,h),a=me(.68,1.42,h),o=me(0,-.08,h),e.set(r*Math.sin(i),c,o-a*s);return}const l=(t-qa)/(1-qa);c=me(Km(s),C6(n)-.55*A6(n),l),r=2.92+.32*Math.sqrt(l),a=1.42+.22*Math.sqrt(l),o=-.08;const u=ue(.62,1,Math.abs(n))*ue(0,.55,l);e.set(r*Math.sin(i)*me(1,.12,u),c,o-a*s+.12*u)}function P6(n,t,e,i,s){const r=Math.abs(i),a=ue(.28,.5,r)*(1-ue(.72,.9,r))*(s<=qa?ue(.4,1,s/qa):1)*.85;return[["spine2",1-a],[n>=0?"armL":"armR",a]]}function I6(){const n=new C(...Lc("forearmL").a),e=new C(...Lc("forearmL").b).clone().sub(n),i=e.length();e.normalize();const s=new C(1,0,0).addScaledVector(e,-e.x).normalize(),r=new C().crossVectors(s,e),a=qd(9,3);return Vr(36,8,(o,c,l)=>{const u=o*Math.PI,h=me(.5,1.12+.2*a(o),c)*i,f=me(.44,.95,c**1.4);l.copy(n).addScaledVector(e,h).addScaledVector(s,Math.sin(u)*f).addScaledVector(r,Math.cos(u)*f)},!0)}const ru=(n,t,e)=>Math.min(Sh(n,t,e),yh(n,t,e));function Qm(n,t){let e=0,i=3.2;if(ru(Math.sin(n)*i,t,Math.cos(n)*i)<0)return i;for(let s=i,r=0;s>0&&r<60;r++){const a=ru(Math.sin(n)*s,t,Math.cos(n)*s);if(a<0){e=s,i=s+.1;break}s-=Math.max(.03,Math.min(.1,a*.8))}for(let s=0;s<12;s++){const r=(e+i)/2;ru(Math.sin(n)*r,t,Math.cos(n)*r)<0?e=r:i=r}return e}function D6(){oo=23;const n=[],t=[new gt(1841687),new gt(2499101),new gt(1184016),new gt(3814960)],e=64;for(let i=0;i<e;i++){const r=(i%2===0?1:-1)*(.62+(Math.PI-.62)*((Math.floor(i/2)+Yn()*.6)/(e/2))),a=Math.abs(r)/Math.PI,o=17.72-.25*a+Yn()*.08,c=me(15,12.4,a**.8)-Yn()*.6,l=[];let u=Qm(r,o)+.06;const h=12,f=Yn()*6.28,d=.5+Yn()*.8;for(let b=0;b<=h;b++){const S=b/h,T=me(o,c,S),A=T>15.7?.08:me(.08,me(.48,.8,ue(1.9,2.6,Math.abs(r))),ue(15.7,15,T));u=Math.max(u,Qm(r,T)+A);const w=.07*Math.sin(S*9*d+f)*S,y=r+w/Math.max(.8,u);l.push(new C(Math.sin(y)*u,T,Math.cos(y)*u-.02))}const p=new Mi(l),v=new Ps(p,14,.07,4,!1),g=v.attributes.position,m=15,M=5;for(let b=0;b<m;b++){const S=p.getPointAt(b/(m-1)),T=me(1,.3,b/(m-1))*(.8+.4*Yn());for(let A=0;A<M;A++){const w=b*M+A;g.setXYZ(w,S.x+(g.getX(w)-S.x)*T,S.y+(g.getY(w)-S.y)*T,S.z+(g.getZ(w)-S.z)*T)}}v.computeVertexNormals();const x=t[Math.floor(Yn()*t.length)],_=new Float32Array(g.count*3);for(let b=0;b<g.count;b++)_[b*3]=x.r,_[b*3+1]=x.g,_[b*3+2]=x.b;v.setAttribute("color",new qt(_,3)),v.deleteAttribute("uv"),n.push(v)}return Ks(n)}function U6(n){const t=n.std({color:1315351,roughness:.88,side:Te}),e=new de;e.name="witch-hat";const i=Vr(64,8,(d,p,v)=>{const g=d*Math.PI,m=me(.95,2.75,p);v.set(m*Math.sin(g),-.08*p-.2*p*p+.12*Math.sin(3*g+1)*p*p-.1*Math.max(0,Math.cos(g))*p*p,m*Math.cos(g))});e.add(new nt(i,t));const s=new Mi([[0,0,0],[0,1.3,-.05],[.05,2.5,-.22],[.22,3.35,-.6],[.5,3.8,-1.15],[.82,3.72,-1.7],[1,3.45,-2]].map(([d,p,v])=>new C(d,p,v))),r=44,a=24,o=new Ps(s,r,1,a,!1),c=o.attributes.position;for(let d=0;d<=r;d++){const p=d/r,v=s.getPointAt(p),g=1.08*Math.pow(1-p,.95)*(1+.05*Math.sin(p*28)*(1-p)*ue(.1,.2,p))+.015;for(let m=0;m<=a;m++){const M=d*(a+1)+m;c.setXYZ(M,v.x+(c.getX(M)-v.x)*g,v.y+(c.getY(M)-v.y)*g,v.z+(c.getZ(M)-v.z)*g)}}o.computeVertexNormals(),e.add(new nt(o,t));const l=new zi([new ht(1.13,.04),new ht(1.11,.24),new ht(1.09,.44)],40);e.add(new nt(l,n.std({color:5909114,roughness:.6,side:Te})));const u=n.std({color:14198840,roughness:.3,metalness:.9}),h=Ks([new Ie(.56,.08,.06).translate(0,.21,0),new Ie(.56,.08,.06).translate(0,-.21,0),new Ie(.08,.5,.06).translate(.24,0,0),new Ie(.08,.5,.06).translate(-.24,0,0),new Ie(.05,.42,.05).translate(0,0,.02)]),f=new nt(h,u);f.position.set(0,.24,1.13),f.rotation.x=-.03,e.add(f),e.rotation.set(-.1,.15,.1),n.at(e,"head",.04,17.86,-.02)}function F6(n,t,e){let i=Math.max(lt(n,t,e,0,.42,.45,.46,.42,1),-t);return i=O(i,Math.max(K(n,t,e,0,.36,.8,0,.36,2,.36,.15),-t),.25),i=O(i,K(n,t,e,0,.36,2,0,.82,2.55,.15,.04),.12),i=O(i,K(n,t,e,0,.8,0,0,1.75,-.08,.44,.42),.25),i=Math.min(i,Math.max(Math.abs(n)-.2,Math.abs(t-.18)-.18,Math.abs(e+.28)-.18)),i}function N6(n){const t=new C(n*1.2,5.75,.23),e=new C(...Lc("shinL").b);e.x=n*1.2;const i=t.distanceTo(e),s=t.clone().sub(e).normalize(),r=[],a=m=>.38+.13*ue(0,.45,m/i)-.03*ue(.6,1,m/i),o=.34;for(let m=0;m*o<i;m++){const M=m*o,x=Math.min(i,(m+1)*o);r.push([M+.002,a(M),m%2],[(M+x)/2,a((M+x)/2),m%2],[x-.002,a(x),m%2])}const c=20,l=[],u=[],h=[],f=new C(1,0,0).addScaledVector(s,-s.x).normalize(),d=new C().crossVectors(f,s),p=new gt(6958238),v=new gt(1314840);r.forEach(([m,M,x],_)=>{const b=x?v:p;for(let S=0;S<=c;S++){const T=S/c*Math.PI*2,A=e.clone().addScaledVector(s,m).addScaledVector(f,Math.cos(T)*M).addScaledVector(d,Math.sin(T)*M);if(l.push(A.x,A.y,A.z),u.push(b.r,b.g,b.b),_>0&&S<c){const w=(_-1)*(c+1)+S,y=_*(c+1)+S;h.push(w,y,w+1,w+1,y,y+1)}}});const g=new Me;return g.setAttribute("position",new ae(l,3)),g.setAttribute("color",new ae(u,3)),g.setIndex(h),g.computeVertexNormals(),g}function k6(n){oo=41;const t=new C(-2.93,9,.62),e=new C(-.07,1,.05).normalize(),i=f=>t.clone().addScaledVector(e,f),s=[];for(let f=0;f<=8;f++){const d=me(3.4,-6.2,f/8),p=i(d);p.x+=.06*Math.sin(f*2.1),p.z+=.05*Math.cos(f*1.7),s.push(p)}const r=new Ps(new Mi(s),40,.12,8,!1),a=n.std({color:5914148,roughness:.75}),o=new de;o.add(new nt(r,a)),o.add(new nt(new Xt(.13,10,8).translate(s[0].x,s[0].y,s[0].z),a));const c=i(-6),l=[],u=[14201948,12884540,15256700,11043386].map(f=>new gt(f));for(let f=0;f<150;f++){const d=Yn()*Math.PI*2,p=.26*Math.sqrt(Yn()),v=c.clone().add(new C(Math.cos(d)*p,.3-Yn()*.3,Math.sin(d)*p)),g=.12+.75*(p/.26),m=new C(v.x+Math.cos(d)*g,Math.max(.05,v.y-2.4-Yn()*.4),v.z+Math.sin(d)*g),M=v.distanceTo(m),x=new ri(.045,M,3,1).rotateX(Math.PI).translate(0,M/2,0);x.applyQuaternion(new ie().setFromUnitVectors(new C(0,1,0),v.clone().sub(m).normalize())).translate(m.x,m.y,m.z);const _=u[Math.floor(Yn()*u.length)],b=x.attributes.position.count,S=new Float32Array(b*3);for(let T=0;T<b;T++)S[T*3]=_.r,S[T*3+1]=_.g,S[T*3+2]=_.b;x.setAttribute("color",new qt(S,3)),l.push(x)}o.add(new nt(Ks(l),n.std({color:16777215,vertexColors:!0,roughness:.8})));const h=n.std({color:6958238,roughness:.7});for(const[f,d]of[[-5.85,.33],[-6.15,.38]]){const p=new nt(new Hn(d,.06,6,20),h);p.position.copy(i(f)),p.quaternion.setFromUnitVectors(new C(0,0,1),e),o.add(p)}n.at(o,"forearmR",0,0,0)}function O6(n){ex(n,Sh,m6,{min:[-1.05,15.05,-1.2],max:[1.05,18.5,2.05]},{min:[-.5,15.5,-.2],max:[.5,16.7,1.3]},56,30,b6,kR("witch-head-v1"),"witch"),nx(n,ns,.12,13157400,.3,"witch-eye",{look:[.08,.05],lid:6984786,lidRest:.26,white:14867648,irisFrac:.6});const t=(g,m)=>{const M=17.4+m;return[g,M,Gr(Sh,g,M,.3,1.6)+.025]};ix(n,t(.1,.06),t(.58,.2),.06,.03,2367516,"witch-brow"),U6(n);const e=D6();uc(n,e,(g,m)=>{const M=ue(15.7,16.6,m);return[["head",M],["neck",(1-M)*.3],["spine2",(1-M)*.7]]}),th(n,e,n.std({color:16777215,vertexColors:!0,roughness:.5}),"witch-hair");const i=Vr(110,40,E6,!0,!0);uc(n,i,T6),th(n,i,eh(1446938,2760240,.7,.12,"witch-cloth-v1"),"witch-skirt");const s=Vr(72,22,L6);uc(n,s,P6),th(n,s,eh(6040194,3020354,.85,.15,"witch-cloth-v1"),"witch-shawl");const r=new nt(new Xt(.26,12,10).scale(1.3,.9,.8),n.std({color:6040194,roughness:.85}));n.at(r,"spine2",0,13.25,Gr(yh,0,13.25)+.36);const a=new nt(new Hn(1,.12,8,40).rotateX(Math.PI/2).scale(1.13,1.6,.82),n.std({color:4858470,roughness:.7}));n.at(a,"spine1",0,11.12,.05);const o=n.std({color:14198840,roughness:.3,metalness:.9}),c=Ks([new Ie(.42,.07,.06).translate(0,.17,0),new Ie(.42,.07,.06).translate(0,-.17,0),new Ie(.07,.4,.06).translate(.18,0,0),new Ie(.07,.4,.06).translate(-.18,0,0)]);n.at(new nt(c,o),"spine1",0,11.12,Gr(yh,0,11.12)+.17);const l=I6(),u=eh(1446938,2760240,.7,.12,"witch-cloth-v1");n.at(new nt(l,u),"forearmL",0,0,0);const h=new nt(l,u);h.scale.x=-1,n.at(h,"forearmR",0,0,0);const f=n.std({color:16777215,vertexColors:!0,roughness:.8}),d=n.std({color:1840664,roughness:.38}),p=rn(F6,{min:[-.6,-.05,-.65],max:[.6,1.95,2.75]},34,void 0,16e3),v=new zi([new ht(.43,0),new ht(.47,1),new ht(.52,1.35),new ht(.58,1.42),new ht(.56,1.62),new ht(.46,1.6)],24);for(const g of[1,-1]){const m=g>0?"L":"R";n.at(new nt(N6(g),f),"shin"+m,0,0,0);const M=Lc("shin"+m).b,x=new de;x.add(new nt(v,d)),x.quaternion.setFromUnitVectors(new C(0,1,0),new C(...Lc("shin"+m).a).sub(new C(...M)).normalize()),n.at(x,"shin"+m,M[0],M[1]+.25,M[2]),n.at(new nt(p,d),"foot"+m,g*1.2,0,0);const _=new nt(c,o);_.scale.setScalar(.8),_.rotation.x=-.85,n.at(_,"foot"+m,g*1.2,.98,.95)}k6(n)}const tg=new WeakMap,B6={id:"witch",name:"Witch",blurb:"A green-faced witch with a crooked hat and a broom",segs:fx,body:{sdf:yh,region:f6,box:l6,palette:[1578524,10011258,1183766],surface:"soft",weights:"sharp",capture:ax(n=>n<12?2.1:n<14.1?1.9:2,15.85)},dress:O6,fit:{size:1.06,limb:.7},face:{jaw:.45,eyes:[[ns[0],ns[1],ns[2]+.12,.16],[-.32,ns[1],ns[2]+.12,.16]],breath:{colors:[8191818,11559167,14221194,9055487],rate:1.2,speed:.8}},res:84,tick(n,t,e){let i=tg.get(n);i||(i=sx(n,"witch-eye","witch-brow",["witch-eye-iris"]),tg.set(n,i)),rx(i,e,.14);const s=.28+.08*Math.sin(t*2.3)+.9*(e?.jaw??0);for(const r of i.glow)r.emissiveIntensity=s}},os=[TE,qE,WS,m4,NT,Z4,kT,_A,XA,mR,FR,c6,B6,UT,OT,BT,HT],kf=["jimothy","builder","skeleton","pumpkin","howler","violet","plume"],as=n=>os.find(t=>t.id===n)??os[0],H6=n=>new C(n.x,n.y,n.z),z6=new C(1,0,0),V6=new C(0,1,0),Ca=(n,t,e)=>{const i=Math.min(1,Math.max(0,(e-n)/(t-n)));return i*i*(3-2*i)};function eg(n,t){const e=t.clone().normalize(),i=new C().crossVectors(n,e).normalize(),s=new C().crossVectors(e,i).normalize();return new ie().setFromRotationMatrix(new se().makeBasis(s,e,i))}function G6(n,t){const e=n.clone().normalize(),i=new C().crossVectors(t,e).normalize(),s=new C().crossVectors(e,i).normalize();return new ie().setFromRotationMatrix(new se().makeBasis(e,i,s))}function Of(n){const t=_=>H6(n[_]),e=(..._)=>Math.min(..._.map(b=>n[b].v)),i=t(D.hipL),s=t(D.hipR),r=t(D.shL),a=t(D.shR),o=i.clone().add(s).multiplyScalar(.5),c=r.clone().add(a).multiplyScalar(.5),l=c.clone().sub(o),u=eg(i.clone().sub(s),l),h=eg(r.clone().sub(a),l),f=t(D.earL),d=t(D.earR),p=t(D.nose),v=f.clone().add(d).multiplyScalar(.5),g=G6(f.clone().sub(d),p.clone().sub(v));g.multiply(new ie().setFromAxisAngle(new C(1,0,0),-.32));const m=(_,b)=>t(b).sub(t(_)).normalize(),M={armL:m(D.shL,D.elL),forearmL:m(D.elL,D.wrL),armR:m(D.shR,D.elR),forearmR:m(D.elR,D.wrR),thighL:m(D.hipL,D.knL),shinL:m(D.knL,D.anL),footL:m(D.heelL,D.toeL),thighR:m(D.hipR,D.knR),shinR:m(D.knR,D.anR),footR:m(D.heelR,D.toeR)},x={armL:e(D.shL,D.elL),forearmL:e(D.elL,D.wrL),armR:e(D.shR,D.elR),forearmR:e(D.elR,D.wrR),thighL:e(D.hipL,D.knL),shinL:e(D.knL,D.anL),footL:e(D.heelL,D.toeL),thighR:e(D.hipR,D.knR),shinR:e(D.knR,D.anR),footR:e(D.heelR,D.toeR)};return{pelvis:u,chest:h,head:g,headVis:e(D.earL,D.earR,D.nose),neck:v.sub(c).normalize(),dir:M,vis:x}}const W6={armL:new C(1,0,0),armR:new C(-1,0,0),thighL:new C(0,-1,0),thighR:new C(0,-1,0),neck:new C(0,1,0)},ng={forearmL:"armL",forearmR:"armR",shinL:"thighL",shinR:"thighR",footL:"shinL",footR:"shinR"};class X6{bones;rest=new Map;qm=new Map;hipRest;pelvisA;torso;len=new Map;segs;constructor(t,e){this.segs=t,this.bones=e;const i=l=>t.find(u=>u.name===l);for(const l of t){const u=new C(l.b[0]-l.a[0],l.b[1]-l.a[1],l.b[2]-l.a[2]);this.len.set(l.name,u.length()),u.lengthSq()>1e-9?u.normalize():u.set(0,1,0);const h=l.parent?i(l.parent):null,f=h?new C(l.a[0]-h.a[0],l.a[1]-h.a[1],l.a[2]-h.a[2]):new C(...l.a);let d=W6[l.name];if(!d&&ng[l.name]){const p=i(ng[l.name]);d=new C(p.b[0]-p.a[0],p.b[1]-p.a[1],p.b[2]-p.a[2]).normalize(),l.name.startsWith("foot")&&(d=u.clone())}d??=u.clone(),this.rest.set(l.name,{dir:u,offset:f,pre:new ie().setFromUnitVectors(u,d),canon:d})}this.pelvisA=new C(...i("pelvis").a);const s=i("thighL").a,r=i("thighR").a,a=i("armL").a,o=i("armR").a;this.hipRest=new C((s[0]+r[0])/2,(s[1]+r[1])/2,(s[2]+r[2])/2);const c=new C((a[0]+o[0])/2,(a[1]+o[1])/2,(a[2]+o[2])/2);this.torso=c.distanceTo(this.hipRest)}setLength(t,e){const i=this.segs.find(a=>a.parent===t&&!a.name.startsWith("tail")&&a.name!=="jaw");if(!i)return;const s=this.bones.get(i.name),r=this.rest.get(i.name);s.position.copy(r.offset).multiplyScalar(e)}neckFit(t){const e=l=>this.segs.find(u=>u.name===l),i=e("spine2"),s=e("neck"),r=e("head"),a=(e("armL").a[1]+e("armR").a[1])/2-i.a[1],o=s.a[1]-i.a[1]+(r.a[1]-s.a[1]),c=(r.a[1]+r.b[1])/2-r.a[1];return o>.001?(a+t-c)/o:1}setNeck(t){for(const e of["neck","head"]){const i=this.bones.get(e),s=this.rest.get(e);i&&s&&i.position.copy(s.offset).multiplyScalar(t)}}swing(t,e,i,s){const r=this.rest.get(t),a=i.clone().applyQuaternion(e.clone().invert()).normalize(),o=new ie().setFromUnitVectors(r.canon,a).multiply(r.pre);return s<1&&o.slerp(new ie,1-Math.max(0,s)),o}glide=0;primed=new Set;set(t,e,i){const s=this.bones.get(t);s&&(this.glide>0&&this.primed.has(t)&&(e=s.quaternion.clone().slerp(e,this.glide)),s.quaternion.copy(e),this.primed.add(t));const r=i?i.clone().multiply(e):e.clone();return this.qm.set(t,r),r}apply(t,e=0,i=0,s=0){this.glide=s>0?1-Math.exp(-s/.025):0;const r=this.set("pelvis",t.pelvis,null),a=this.hipRest.clone().sub(this.pelvisA).applyQuaternion(t.pelvis);this.bones.get("pelvis").position.copy(a.negate());const o=t.pelvis.clone().slerp(t.chest,.5),c=this.set("spine1",r.clone().invert().multiply(o),r),l=this.set("spine2",c.clone().invert().multiply(t.chest),c),u=Ca(.3,.7,t.headVis),h=this.set("neck",this.swing("neck",l,t.neck,u*.6),l),f=h.clone().invert().multiply(t.head);u<1&&f.slerp(new ie,1-u),this.set("head",f,h);for(const p of["L","R"]){const v=this.set("arm"+p,this.swing("arm"+p,l,t.dir[`arm${p}`],Ca(.35,.7,t.vis[`arm${p}`])),l);this.set("forearm"+p,this.swing("forearm"+p,v,t.dir[`forearm${p}`],Ca(.35,.7,t.vis[`forearm${p}`])),v);const g=this.set("thigh"+p,this.swing("thigh"+p,r,t.dir[`thigh${p}`],Ca(.4,.75,t.vis[`thigh${p}`])),r),m=this.set("shin"+p,this.swing("shin"+p,g,t.dir[`shin${p}`],Ca(.4,.75,t.vis[`shin${p}`])),g);this.set("foot"+p,this.swing("foot"+p,m,t.dir[`foot${p}`],Ca(.5,.8,t.vis[`foot${p}`])),m)}let d=r;for(let p=1;p<=4;p++){const v="tail"+p;if(!this.bones.has(v))break;const g=new ie().setFromEuler(new Cn(0,Math.sin(e*2.1-p*.7)*i,Math.sin(e*1.3-p*.5)*i*.3));d=this.set(v,g,p===1?this.qm.get(this.segs.find(m=>m.name==="tail1")?.parent??"pelvis")??r:d)}}setJaw(t,e=0){const i=this.bones.get("jaw");i&&i.quaternion.setFromAxisAngle(V6,e*.16).multiply(new ie().setFromAxisAngle(z6,t))}dirOf(t){return this.rest.get(t).dir.clone().applyQuaternion(this.qm.get(t))}}const mx={strength:1,visFrom:.5,visTo:.8,maxTurn:ni.degToRad(120)},$6=[{bones:["armL","forearmL"],ends:[D.elL,D.wrL],start:D.shL},{bones:["armR","forearmR"],ends:[D.elR,D.wrR],start:D.shR},{bones:["thighL","shinL"],ends:[D.knL,D.anL],start:D.hipL},{bones:["thighR","shinR"],ends:[D.knR,D.anR],start:D.hipR}],ig=(n,t,e)=>{const i=Math.min(1,Math.max(0,(e-n)/(t-n)));return i*i*(3-2*i)},Hs=new se,Yo=new se,au=new ie,sg=new ie,q6=new C,Y6=new C;function j6(n,t,e,i,s){const r=mx,a={};t.updateMatrixWorld(!0),Yo.copy(t.matrixWorld).invert();const o=t.scale.x,c=t.position,l=new C(-c.x/o,-c.y/o,-c.z/o),u=f=>{Hs.multiplyMatrices(Yo,f.matrixWorld);const d=new C().setFromMatrixPosition(Hs);return Hs.multiplyMatrices(Yo,f.parent.matrixWorld),Hs.decompose(Y6,sg,q6),{o:d,parent:sg.clone()}},h=(f,d)=>{const p=n.bones.get(f);if(d&&n.bones.get(d))return Hs.multiplyMatrices(Yo,n.bones.get(d).matrixWorld),new C().setFromMatrixPosition(Hs);const g=n.rest.get(f).dir.clone().multiplyScalar(n.len.get(f)??1);return Hs.multiplyMatrices(Yo,p.matrixWorld),g.applyMatrix4(Hs)};for(const f of $6)for(let d=0;d<2;d++){const p=f.bones[d],v=n.bones.get(p);if(!v||!v.parent)continue;const g=e[f.ends[d]],m=e[d===0?f.start:f.ends[0]],M=r.strength*ig(r.visFrom,r.visTo,g.v)*ig(r.visFrom,r.visTo,m.v),{o:x,parent:_}=u(v),b=h(p,d===0?f.bones[1]:null),S=b.distanceTo(x);if(S<1e-6)continue;const T=new C((g.x*i.w-i.cx)/i.f,-(g.y*i.h-i.cy)/i.f,-1).normalize(),A=l.clone().sub(x),w=T.dot(A),y=w*w-A.lengthSq()+S*S;let E;if(y>=0){const B=l.clone().addScaledVector(T,-w+Math.sqrt(y)),X=l.clone().addScaledVector(T,-w-Math.sqrt(y)),H=B.distanceTo(b),Y=X.distanceTo(b),it=(Y-H)/Math.max(1e-6,H+Y),dt=Math.min(1,Math.max(0,.5+it*8)),vt=dt*dt*(3-2*dt);E=X.clone().lerp(B,vt)}else E=l.clone().addScaledVector(T,-w);const R=B=>{const X=B.clone().multiplyScalar(o).add(c);return[i.cx+i.f*X.x/-X.z,i.cy-i.f*X.y/-X.z]};if(M>0){const B=b.clone().sub(x).normalize(),X=E.clone().sub(x).normalize();au.setFromUnitVectors(B,X);const Y=(2*Math.acos(Math.min(1,Math.abs(au.w)))/r.maxTurn)**4,it=M/Math.pow(1+Y,.25),dt=new ie().slerpQuaternions(new ie,au,it);v.quaternion.premultiply(_.clone().invert().multiply(dt).multiply(_)),v.updateMatrixWorld(!0)}const L=h(p,d===0?f.bones[1]:null),[I,N]=R(L);a[p]=Math.hypot(I-g.x*i.w,N-g.y*i.h)}return a}const Ya={gap:.065,width:.552,cornerL:-.005,cornerR:-.005,apL:.235,apR:.235,browInL:.193,browInR:.193,browOutL:.196,browOutR:.196,irisXL:0,irisXR:0,irisYL:0,irisYR:0,chinX:0},jo=(n,t)=>[n[0]-t[0],n[1]-t[1],n[2]-t[2]],nc=(n,t)=>n[0]*t[0]+n[1]*t[1]+n[2]*t[2],Dl=(n,t)=>[n[0]*t,n[1]*t,n[2]*t],rg=n=>Math.sqrt(nc(n,n)),Z6=(n,t)=>[n[1]*t[2]-n[2]*t[1],n[2]*t[0]-n[0]*t[2],n[0]*t[1]-n[1]*t[0]];function gx(n,t,e){if(n.length<468)return null;const i=f=>[n[f].x*t,-n[f].y*e,-n[f].z*t],s=i(33),r=i(263),a=rg(jo(r,s));if(a<8)return null;const o=Dl([s[0]+r[0],s[1]+r[1],s[2]+r[2]],.5),c=Dl(jo(r,s),1/a);let l=jo(i(10),i(1));l=jo(l,Dl(c,nc(l,c)));const u=rg(l);if(u<1e-6)return null;l=Dl(l,1/u);const h=Z6(c,l);return f=>{const d=jo(i(f),o);return[nc(d,c)/a,nc(d,l)/a,nc(d,h)/a]}}function J6(n,t,e){const i=gx(n,t,e);if(!i)return null;const s=i(13),r=i(14),a=[i(263),i(362)],o=[i(33),i(133)],c=[(a[0][0]+a[1][0])/2,(a[0][1]+a[1][1])/2],l=[(o[0][0]+o[1][0])/2,(o[0][1]+o[1][1])/2],u=Math.abs(a[0][0]-a[1][0]),h=Math.abs(o[0][0]-o[1][0]);let f=0,d=0,p=0,v=0;if(n.length>=478&&u>1e-4&&h>1e-4){const g=i(468),m=i(473),M=Math.hypot(g[0]-c[0],g[1]-c[1]),x=Math.hypot(m[0]-c[0],m[1]-c[1]),_=M<x?g:m,b=M<x?m:g;f=((_[0]-a[1][0])/(a[0][0]-a[1][0])-.5)*2,d=((b[0]-o[1][0])/(o[0][0]-o[1][0])-.5)*2,p=(_[1]-c[1])/u,v=(b[1]-l[1])/h}return{gap:s[1]-r[1],width:i(291)[0]-i(61)[0],cornerL:i(291)[1]-s[1],cornerR:i(61)[1]-s[1],apL:u>1e-4?(i(386)[1]-i(374)[1])/u:Ya.apL,apR:h>1e-4?(i(159)[1]-i(145)[1])/h:Ya.apR,browInL:i(336)[1]-c[1],browInR:i(107)[1]-l[1],browOutL:i(300)[1]-c[1],browOutR:i(70)[1]-l[1],irisXL:f,irisXR:d,irisYL:p,irisYR:v,chinX:i(152)[0]}}const ag={tauRest:6,tauOpenEye:2.5,tauShutEye:20,tauMouthShut:1.5,tauMouthOpen:25,gapFull:.42,cornerFull:.06,browFull:.06,browDownFull:.045,lookFull:.35,lookYFull:.1,chinFull:.08,blinkFrom:.3,blinkTo:.8},Bf=n=>{const t=Math.max(0,Math.min(1,n));return t*t*(3-2*t)},pn=Bf,ou=n=>Math.tanh(n),cu=(n,t,e,i)=>n+(t-n)*(1-Math.exp(-e/i));class K6{rest={...Ya};primed=!1;update(t,e){if(!this.primed){for(const s of Object.keys(this.rest))this.rest[s]=t[s];this.rest.gap=Math.min(t.gap,Ya.gap),this.rest.apL=Math.max(t.apL,Ya.apL*.7),this.rest.apR=Math.max(t.apR,Ya.apR*.7),this.primed=!0;return}const i=ag;for(const s of Object.keys(this.rest))if(s==="apL"||s==="apR"){const r=Bf((t[s]/Math.max(.001,this.rest[s])-.65)/.3);this.rest[s]=cu(this.rest[s],t[s],e,i.tauShutEye+(i.tauOpenEye-i.tauShutEye)*r)}else if(s==="gap"){const r=Bf(.5-(t.gap-this.rest.gap)/.08);this.rest.gap=cu(this.rest.gap,t.gap,e,i.tauMouthOpen+(i.tauMouthShut-i.tauMouthOpen)*r)}else this.rest[s]=cu(this.rest[s],t[s],e,i.tauRest)}express(t,e){const i=ag,s=this.rest,r=pn((t.gap-s.gap)/i.gapFull),a=(v,g)=>1-v/Math.max(.001,g),o=a(t.apL,s.apL),c=a(t.apR,s.apR),l=v=>pn((v-i.blinkFrom)/(i.blinkTo-i.blinkFrom)),u=pn((t.cornerL-s.cornerL)/i.cornerFull),h=pn((t.cornerR-s.cornerR)/i.cornerFull),f=pn(-(t.cornerL-s.cornerL+(t.cornerR-s.cornerR))/2/i.cornerFull)*(1-r),d=pn((.9-t.width/Math.max(.001,s.width))/.25),p=1-pn((t.gap-s.gap)/.12);return{...Mo,puff:e.puff,sneer:e.sneer,jaw:r,blinkL:l(o),blinkR:l(c),squintL:pn(o/.45),squintR:pn(c/.45),wideL:pn(-o/.35),wideR:pn(-c/.35),smileL:u,smileR:h,smile:(u+h)/2,frown:f,pucker:d*p,funnel:d*(1-p),browUp:pn((t.browInL-s.browInL+(t.browInR-s.browInR))/2/i.browFull),browDownL:pn(-(t.browInL-s.browInL)/i.browDownFull),browDownR:pn(-(t.browInR-s.browInR)/i.browDownFull),browOuterL:pn((t.browOutL-s.browOutL)/i.browFull),browOuterR:pn((t.browOutR-s.browOutR)/i.browFull),lookX:ou((t.irisXL-s.irisXL-(t.irisXR-s.irisXR))/2/i.lookFull),lookY:ou((t.irisYL-s.irisYL+(t.irisYR-s.irisYR))/2/i.lookYFull),jawSide:ou((t.chinX-s.chinX)/i.chinFull)}}}const Wr=[{i:61,at:[-.2762,-.7887,-.1204],name:"mouthR",mouth:!0},{i:291,at:[.2762,-.7887,-.1204],name:"mouthL",mouth:!0},{i:0,at:[0,-.7463,.0932],name:"lipTop",mouth:!0},{i:37,at:[-.08,-.7346,.0849],name:"lipUpR",mouth:!0},{i:267,at:[.08,-.7346,.0849],name:"lipUpL",mouth:!0},{i:17,at:[0,-.941,-.0213],name:"lipBot",mouth:!0,jaw:!0},{i:84,at:[-.0787,-.9302,-.0281],name:"lipLoR",mouth:!0,jaw:!0},{i:314,at:[.0787,-.9302,-.0281],name:"lipLoL",mouth:!0,jaw:!0},{i:205,at:[-.4311,-.4831,-.0402],name:"cheekR"},{i:425,at:[.4311,-.4831,-.0402],name:"cheekL"},{i:50,at:[-.5359,-.373,-.0763],name:"cheekHiR"},{i:280,at:[.5359,-.373,-.0763],name:"cheekHiL"},{i:64,at:[-.1791,-.4982,.1107],name:"alaR"},{i:294,at:[.1791,-.4982,.1107],name:"alaL"},{i:107,at:[-.157,.1784,.3098],name:"browInR"},{i:105,at:[-.4483,.2179,.2221],name:"browMidR"},{i:70,at:[-.6434,.1821,.0176],name:"browOutR"},{i:336,at:[.157,.1784,.3098],name:"browInL"},{i:334,at:[.4483,.2179,.2221],name:"browMidL"},{i:300,at:[.6434,.1821,.0176],name:"browOutL"},{i:152,at:[0,-1.3303,-.2954],name:"chin",mouth:!0,jaw:!0},{i:172,at:[-.6681,-.8223,-.7114],name:"jawR",jaw:!0},{i:397,at:[.6681,-.8223,-.7114],name:"jawL",jaw:!0}],Q6={tauRest:6,tauMouthRest:25,tauMove:.05};class tC{rest=new Float32Array(Wr.length*3);move=new Float32Array(Wr.length*3);primed=!1;update(t,e,i,s){const r=gx(t,e,i);if(!r)return!1;const a=Q6,o=1-Math.exp(-s/a.tauMove);return Wr.forEach((c,l)=>{const u=r(c.i);for(let h=0;h<3;h++){const f=l*3+h,d=u[h];this.primed?this.rest[f]=this.rest[f]+(d-this.rest[f])*(1-Math.exp(-s/(c.mouth?a.tauMouthRest:a.tauRest))):this.rest[f]=d,this.move[f]=this.move[f]+(d-this.rest[f]-this.move[f])*o}}),this.primed=!0,!0}relax(t){const e=1-Math.exp(-t/.2);for(let i=0;i<this.move.length;i++)this.move[i]=this.move[i]*(1-e)}}const vx={gain:1.6,sigma:.22,reach:1.1,backFrom:.9,backTo:.35},xx=Wr.length,eC=.7088,lu=-.0142,og=-.816;function nC(n){const t=n.face?.eyes;if(!t||t.length<2)return null;const e=new C(t[0][0],t[0][1],t[0][2]),i=new C(t[1][0],t[1][1],t[1][2]),s=e.clone().add(i).multiplyScalar(.5),r=e.distanceTo(i);if(r<1e-4)return null;const a=r/eC,o=n.face?.mouth,c=o?o[1]:s.y-a*(lu-og),l=Math.max(.3*a,(s.y-c)/(lu-og)),u=a,h=p=>new C(s.x+a*p[0],s.y+l*(p[1]-lu),s.z+u*p[2]),f=vx,d=h([0,-.55,0]);return{o:s,sx:a,sy:l,sz:u,centres:Wr.map(p=>h(p.at)),jaw:!!n.face?.jaw,strength:n.face?.transfer??1,box:new fe(d.x,d.y,f.reach*Math.max(a,l),f.sigma*r),z:new ht(s.z-f.backFrom*r,s.z-f.backTo*r)}}const iC=`
#define FACE_N ${xx}
uniform float uFaceOn; uniform vec3 uFaceC[FACE_N]; uniform vec3 uFaceD[FACE_N]; uniform vec4 uFaceBox; uniform vec2 uFaceZ;
uniform mat4 uFaceHead; uniform mat4 uFaceHeadInv; uniform vec3 uFaceHeadA;
// the face's movement at a point of the costume (model units, its rest frame): the mapped controls' movements, each by a
// Gaussian of its distance across the face's plane, averaged where they crowd; nothing behind the eyes or off the face
vec3 faceDisp(vec3 p) {
  if (uFaceOn <= 0.0) return vec3(0.0);
  vec2 q = p.xy - uFaceBox.xy;
  if (dot(q, q) > uFaceBox.z * uFaceBox.z) return vec3(0.0);
  float front = smoothstep(uFaceZ.x, uFaceZ.y, p.z);
  if (front <= 0.0) return vec3(0.0);
  vec3 sum = vec3(0.0); float wsum = 0.0, s2 = uFaceBox.w * uFaceBox.w;
  for (int i = 0; i < FACE_N; i++) { vec2 d = p.xy - uFaceC[i].xy; float w = exp(-dot(d, d) / s2); sum += w * uFaceD[i]; wsum += w; }
  return sum / max(wsum, 1.0) * front * uFaceOn;
}`,sC=`#include <begin_vertex>
#ifdef USE_SKINNING
  transformed += faceDisp(position);
#else
  // a rigid part (glasses, eyes, teeth, a beak) moves whole, by the field where it stands: it never bends
  { vec4 fw = modelMatrix * vec4(0.0, 0.0, 0.0, 1.0);
    vec3 fd = faceDisp((uFaceHeadInv * fw).xyz + uFaceHeadA);
    if (dot(fd, fd) > 0.0) transformed += inverse(mat3(modelMatrix)) * (mat3(uFaceHead) * fd); }
#endif`;function rC(n,t){const e=nC(t);if(!e)return null;const i=t.segs.find(a=>a.name==="head"),s={uFaceOn:{value:0},uFaceC:{value:e.centres.map(a=>a.clone())},uFaceD:{value:Wr.map(()=>new C)},uFaceBox:{value:e.box.clone()},uFaceZ:{value:e.z.clone()},uFaceHead:{value:new se},uFaceHeadInv:{value:new se},uFaceHeadA:{value:new C(...i?.a??[0,0,0])}},r=new Set;return n.traverse(a=>{const o=a;if(o.isMesh)for(const c of Array.isArray(o.material)?o.material:[o.material]){if(r.has(c)||c.isShaderMaterial)continue;r.add(c);const l=c.onBeforeCompile,u=c.customProgramCacheKey.call(c);c.onBeforeCompile=function(h,f){l.call(this,h,f),Object.assign(h.uniforms,s),h.vertexShader=h.vertexShader.replace("#include <common>",`#include <common>
${iC}`).replace("#include <begin_vertex>",sC)},c.customProgramCacheKey=()=>`${u}|face${xx}`,c.needsUpdate=!0}}),{place:e,u:s}}function aC(n,t,e,i=1){const{place:s,u:r}=n;if(r.uFaceOn.value=t?i*s.strength:0,!t)return;const a=vx.gain;Wr.forEach((o,c)=>{r.uFaceD.value[c].set(t[c*3]*s.sx*a,s.jaw&&o.jaw?0:t[c*3+1]*s.sy*a,t[c*3+2]*s.sz*a)}),e&&(r.uFaceHead.value.copy(e.matrixWorld),r.uFaceHeadInv.value.copy(e.matrixWorld).invert())}const yr={pixels:62500,everyGpu:.15,everyCpu:.8,near:.18,soft:.25,mapEase:.6,calEase:.5},oC=[D.nose,D.shL,D.shR,D.hipL,D.hipR,D.elL,D.elR,D.knL,D.knR,D.earL,D.earR],cC=[.485,.456,.406],lC=[.229,.224,.225];class hC{ready=!1;busy=!1;ms=0;engine="";cal=null;ort=null;session=null;canvas=document.createElement("canvas");w=0;h=0;map=null;last=-1e9;texture=new kr(new Uint16Array(4),2,2,Kf,cr);u={uOccl:{value:this.texture},uOcclOn:{value:0},uOcclCrop:{value:new fe(0,0,1,1)},uOcclMirror:{value:0},uOcclRes:{value:new ht(1,1)},uOcclNear:{value:yr.near},uOcclSoft:{value:yr.soft}};constructor(){this.texture.magFilter=this.texture.minFilter=Pe,this.texture.flipY=!1}async load(t){t?.("Loading the depth engine…");const i=this.ort=await qf(()=>import("./ort.webgpu.bundle.min-C5HzYTF3.js"),[],import.meta.url);i.env.wasm.wasmPaths="./ort/",i.env.wasm.numThreads=1;const s=!!navigator.gpu;s||(i.env.wasm.proxy=!0),t?.("Loading the depth model…");const r="./models/depth-anything-v2-small-q4f16.onnx";for(const a of s?["webgpu","wasm"]:["wasm"])try{this.session=await i.InferenceSession.create(r,{executionProviders:[a]}),this.engine=a;break}catch(o){console.warn("depth: no",a,o)}if(!this.session)throw new Error("the depth model would not load");this.ready=!0}due(t){return this.ready&&!this.busy&&t-this.last>1e3*(this.engine==="webgpu"?yr.everyGpu:yr.everyCpu)}async read(t,e,i,s){if(!(!this.session||!this.ort||this.busy)){this.busy=!0,this.last=s;try{const r=i.w,a=i.h,o=Math.sqrt(yr.pixels/(r*a)),c=Math.max(14,Math.round(r*o/14)*14),l=Math.max(14,Math.round(a*o/14)*14);this.canvas.width=c,this.canvas.height=l;const u=this.canvas.getContext("2d",{willReadFrequently:!0});u.drawImage(t,0,0,c,l);const h=u.getImageData(0,0,c,l).data,f=c*l,d=new Float32Array(3*f);for(let _=0;_<f;_++)for(let b=0;b<3;b++)d[b*f+_]=(h[_*4+b]/255-cC[b])/lC[b];const p=performance.now(),v=await this.session.run({[this.session.inputNames[0]]:new this.ort.Tensor("float32",d,[1,3,l,c])});this.ms=performance.now()-p;const g=v[this.session.outputNames[0]],m=g.data,M=g.dims.at(-2),x=g.dims.at(-1);this.calibrate(m,x,M,e),this.cal&&this.toMetres(m,x,M)}catch(r){console.warn("depth reading failed",r)}finally{this.busy=!1}}}calibrate(t,e,i,s){const r=(S,T)=>{const A=Math.min(e-1,Math.max(0,S*e-.5)),w=Math.min(i-1,Math.max(0,T*i-.5)),y=Math.floor(A),E=Math.floor(w),R=Math.min(e-1,y+1),L=Math.min(i-1,E+1),I=A-y,N=w-E;return(t[E*e+y]*(1-I)+t[E*e+R]*I)*(1-N)+(t[L*e+y]*(1-I)+t[L*e+R]*I)*N};let a=0,o=0,c=0,l=0,u=0,h=0;for(const S of s)if(!(S.lost||S.presence<.5))for(const T of oC){const A=S.image[T],w=S.world[T];if(A.v<.7||A.x<0||A.x>1||A.y<0||A.y>1)continue;const y=-(S.T.z+w.z);if(y<.3)continue;const E=r(A.x,A.y),R=1/y,L=A.v;a+=L,o+=L*E,c+=L*R,l+=L*E*E,u+=L*E*R,h++}if(h<4||a<=0)return;const f=o/a,d=c/a,p=l/a-f*f,v=u/a-f*d,g=p/(p+.02*f*f+1e-9),m=p>1e-9?v/p:0,M=f>1e-9?d/f:0;let x=M+(m-M)*g,_=(d-x*f)*g;x>0||(x=M,_=0);const b=this.cal?yr.calEase:1;this.cal=this.cal?{a:this.cal.a+(x-this.cal.a)*b,b:this.cal.b+(_-this.cal.b)*b,n:h}:{a:x,b:_,n:h}}toMetres(t,e,i){const{a:s,b:r}=this.cal,a=e*i;(!this.map||this.w!==e||this.h!==i)&&(this.map=new Float32Array(a).fill(-1),this.w=e,this.h=i);const o=yr.mapEase,c=new Uint16Array(a);for(let u=0;u<a;u++){const h=s*t[u]+r,f=h>1/60?1/h:60,d=this.map[u]<0?f:this.map[u]+(f-this.map[u])*o;this.map[u]=d,c[u]=Jo.toHalfFloat(d)}const l=this.texture.image;(l.width!==e||l.height!==i)&&(this.texture.dispose(),l.width=e,l.height=i),l.data=c,this.texture.needsUpdate=!0}frame(t,e,i,s,r){const a=t&&this.ready&&this.cal&&this.map?1:0;this.u.uOcclOn.value+=(a-this.u.uOcclOn.value)*(1-Math.exp(-r/.4)),this.u.uOcclCrop.value.copy(e),this.u.uOcclMirror.value=i,this.u.uOcclRes.value.copy(s)}}const uC=`
uniform sampler2D uOccl; uniform float uOcclOn; uniform vec4 uOcclCrop; uniform float uOcclMirror; uniform vec2 uOcclRes;
uniform float uOcclNear; uniform float uOcclSoft;
// how much of this costume pixel the picture leaves showing: the scene's depth where it lands (the background's own
// crop and mirror), against the pixel's own; a curve of how far the scene stands in front
float occlVisible() {
  if (uOcclOn <= 0.0) return 1.0;
  vec2 s = gl_FragCoord.xy / uOcclRes;
  s.x = mix(s.x, 1.0 - s.x, uOcclMirror);
  vec2 v = uOcclCrop.xy + s * uOcclCrop.zw;
  float scene = texture2D(uOccl, vec2(v.x, 1.0 - v.y)).r;
  float hidden = smoothstep(uOcclNear, uOcclNear + uOcclSoft, vViewPosition.z - scene);
  return 1.0 - hidden * uOcclOn;
}`;function fC(n,t){const e=new Set;n.traverse(i=>{const s=i;if(s.isMesh)for(const r of Array.isArray(s.material)?s.material:[s.material]){if(e.has(r)||r.isShaderMaterial)continue;e.add(r);const a=r.onBeforeCompile,o=r.customProgramCacheKey.call(r);r.onBeforeCompile=function(c,l){a.call(this,c,l),c.fragmentShader.includes("vViewPosition")&&(Object.assign(c.uniforms,t),c.fragmentShader=c.fragmentShader.replace("#include <common>",`#include <common>
${uC}`).replace("#include <alphamap_fragment>",`#include <alphamap_fragment>
 diffuseColor.a *= occlVisible();`))},r.customProgramCacheKey=()=>`${o}|occl`,r.needsUpdate=!0}})}const zs=128,La=64,hi=96,$i=72,Vs=12,Pa=9,qi=24,Ri={spread:1,back:.9,envIntensity:1.15,key:5,every:6,targetMean:.22,maxGain:2.8,fill:.35},Ia=new Float32Array(256).map((n,t)=>{const e=t/255;return e<=.04045?e/12.92:Math.pow((e+.055)/1.055,2.4)});class dC{constructor(t,e,i){this.renderer=t,this.scene=e,this.cv=document.createElement("canvas"),this.cv.width=hi,this.cv.height=$i,this.ctx=this.cv.getContext("2d",{willReadFrequently:!0}),this.fcv=document.createElement("canvas"),this.fcv.width=this.fcv.height=qi,this.fctx=this.fcv.getContext("2d",{willReadFrequently:!0}),this.tex=new kr(this.data,zs,La,ln,cr),this.tex.mapping=nh,this.tex.colorSpace=qr,this.tex.magFilter=Pe,this.tex.minFilter=Pe,this.pmrem=new hf(t),this.key.castShadow=!0,this.key.shadow.mapSize.set(1024,1024),this.key.shadow.bias=-5e-4,this.key.shadow.normalBias=.02,this.key.shadow.radius=4,e.add(this.key),e.add(this.key.target),e.add(this.fill),this.fill.intensity=1}key=new lf(16777215,1);fill=new c3(16777215,4473924,0);cv;ctx;lin=new Float32Array(hi*$i*3);blur=new Float32Array(Vs*Pa*3);data=new Uint16Array(zs*La*4);smooth=new Float32Array(zs*La*3);primed=!1;keyDir=new C(0,1,1).normalize();keyI=0;tex;pmrem;rt=null;mean=0;share=0;gain=1;realism=!1;face=null;faceDir=new C(0,0,1);faceLum=0;faceConf=0;fcv;fctx;dir=new C(0,1,1).normalize();target=new C(0,0,-2);update(t,e,i,s,r,a){if(this.aimShadows(r,i),!a){this.scene.environment=null,this.fill.intensity=1.2,this.key.intensity=1.6,this.key.position.copy(this.target).add(new C(1.5,3,2.5));return}if(s%Ri.every!==0&&this.rt||t.readyState<2||!t.videoWidth)return;this.ctx.drawImage(t,0,0,hi,$i);const o=this.ctx.getImageData(0,0,hi,$i).data;let c=0;for(let y=0,E=0;y<hi*$i;y++,E+=4){const R=Ia[o[E]],L=Ia[o[E+1]],I=Ia[o[E+2]];this.lin[y*3]=R,this.lin[y*3+1]=L,this.lin[y*3+2]=I,c+=.2126*R+.7152*L+.0722*I}this.mean=c/(hi*$i),this.gain=Math.min(this.realism?1.25:Ri.maxGain,Math.max(1,Ri.targetMean/Math.max(this.mean,.001)));const l=this.gain;this.readFace(t,i),this.blur.fill(0);const u=hi/Vs,h=$i/Pa;for(let y=0;y<$i;y++)for(let E=0;E<hi;E++){const R=(Math.floor(y/h)*Vs+Math.floor(E/u))*3,L=(y*hi+E)*3,I=this.blur;I[R]=I[R]+this.lin[L],I[R+1]=I[R+1]+this.lin[L+1],I[R+2]=I[R+2]+this.lin[L+2]}for(let y=0;y<this.blur.length;y++)this.blur[y]=this.blur[y]/(u*h);const f=e.f/e.w,d=e.f/e.h;let p=0;for(let y=0;y<Vs*Pa;y++)p+=.2126*this.blur[y*3]+.7152*this.blur[y*3+1]+.0722*this.blur[y*3+2];p/=Vs*Pa;const v=this.faceConf>0?Math.min(2.5,Math.max(.4,this.faceLum/.35/Math.max(p*2.2,.001))):1,g=Ri.back*(1+(v-1)*this.faceConf);let m=0,M=0,x=0,_=0;for(let y=0;y<La;y++){const E=((y+.5)/La-.5)*Math.PI,R=Math.sin(E),L=Math.cos(E);for(let I=0;I<zs;I++){const N=((I+.5)/zs-.5)*Math.PI*2;let B=Math.cos(N)*L;const X=Math.sin(N)*L,H=i?-B:B,Y=X<0,it=Math.max(Math.abs(X),.05),dt=.5+H/it*f/Ri.spread,vt=.5-R/it*d/Ri.spread,St=Math.min(1,Math.max(0,dt)),Ct=Math.min(1,Math.max(0,vt)),Ft=(Math.min(Pa-1,Math.floor(Ct*Pa))*Vs+Math.min(Vs-1,Math.floor(St*Vs)))*3;let V,$,z;if(Y){const et=(Math.min($i-1,Math.floor(Ct*$i))*hi+Math.min(hi-1,Math.floor(St*hi)))*3,Q=Math.max(Math.abs(dt-.5)-.5,Math.abs(vt-.5)-.5,0),rt=Math.min(1,Q/.4);V=this.lin[et]+(this.blur[Ft]-this.lin[et])*rt,$=this.lin[et+1]+(this.blur[Ft+1]-this.lin[et+1])*rt,z=this.lin[et+2]+(this.blur[Ft+2]-this.lin[et+2])*rt}else V=this.blur[Ft]*g,$=this.blur[Ft+1]*g,z=this.blur[Ft+2]*g;V*=l,$*=l,z*=l;const W=(y*zs+I)*3,G=this.primed?.28:1;V=this.smooth[W]=this.smooth[W]+(V-this.smooth[W])*G,$=this.smooth[W+1]=this.smooth[W+1]+($-this.smooth[W+1])*G,z=this.smooth[W+2]=this.smooth[W+2]+(z-this.smooth[W+2])*G;const tt=(y*zs+I)*4;this.data[tt]=Jo.toHalfFloat(V),this.data[tt+1]=Jo.toHalfFloat($),this.data[tt+2]=Jo.toHalfFloat(z),this.data[tt+3]=Jo.toHalfFloat(1);const ot=.2126*V+.7152*$+.0722*z,F=ot*L;B=Math.cos(N)*L,m+=F*B,M+=F*R,x+=F*X,_+=F}}this.primed=!0,this.tex.needsUpdate=!0,this.rt=this.pmrem.fromEquirectangular(this.tex,this.rt),this.scene.environment=this.rt.texture,this.scene.environmentIntensity=Ri.envIntensity;const b=Math.hypot(m,M,x);this.share=_>0?b/_:0;const T=(b>1e-6?new C(m/b,M/b,x/b):this.keyDir.clone()).clone().lerp(this.faceDir,.65*this.faceConf).normalize();this.keyDir.lerp(T,.25).normalize(),this.dir.copy(this.keyDir),this.dir.y<.15&&(this.dir.y=.15,this.dir.normalize());const A=this.faceConf>0?Math.min(1,this.faceDir.clone().setZ(0).length()*1.4):this.share,w=Ri.key*(this.share+(A-this.share)*this.faceConf*.6)*(_/(zs*La))*2;this.keyI+=(w-this.keyI)*(this.keyI===0?1:.25),this.key.intensity=this.keyI,this.fill.intensity=Ri.fill*(this.realism?.25:1)*Math.min(1,Math.max(0,1-this.mean/.22)),this.key.position.copy(this.target).addScaledVector(this.dir,4)}readFace(t,e){const i=this.face;if(!i||i.w<.04){this.faceConf*=.9;return}const s=i.probe.map(L=>L.x),r=i.probe.map(L=>L.y),a=Math.min(...s),o=Math.max(...s),c=Math.min(...r),l=Math.max(...r),u=.15,h=(o-a)*(1+u*2),f=(l-c)*(1+u*2),d=a-(o-a)*u,p=c-(l-c)*u,v=t.videoWidth,g=t.videoHeight;if(h<=0||f<=0||!v)return;this.fctx.drawImage(t,d*v,p*g,h*v,f*g,0,0,qi,qi);const m=this.fctx.getImageData(0,0,qi,qi).data,M=i.probe.map(L=>{const I=Math.round((L.x-d)/h*(qi-1)),N=Math.round((L.y-p)/f*(qi-1));let B=0,X=0;for(let H=-1;H<=1;H++)for(let Y=-1;Y<=1;Y++){const it=Math.min(qi-1,Math.max(0,I+Y)),dt=Math.min(qi-1,Math.max(0,N+H)),vt=(dt*qi+it)*4;B+=.2126*Ia[m[vt]]+.7152*Ia[m[vt+1]]+.0722*Ia[m[vt+2]],X++}return B/X}),[x,_,b,S,T]=M,A=(x+_+b+S+T)/5,w=(b-S)/Math.max(b+S,1e-4),y=(x-_)/Math.max(x+_,1e-4),E=new C(w*2.2*(e?-1:1),Math.max(.1,y*1+.35),.75).normalize(),R=Math.min(1,Math.max(0,(i.w-.04)/.08));this.faceDir.lerp(E,.3).normalize(),this.faceLum+=(A-this.faceLum)*.3,this.faceConf+=(R-this.faceConf)*.3}aimShadows(t,e){if(!t.length)return;const i=new C;for(const a of t)i.add(a);i.multiplyScalar(1/t.length),e&&(i.x=-i.x);let s=1.4;for(const a of t)s=Math.max(s,Math.hypot((e?-a.x:a.x)-i.x,a.y-i.y,a.z-i.z)+1.4);this.target.copy(i),this.key.target.position.copy(i),this.key.position.copy(i).addScaledVector(this.dir,4);const r=this.key.shadow.camera;r.right!==s&&(r.left=-s,r.right=s,r.top=s,r.bottom=-s,r.near=.1,r.far=4+s*2,r.updateProjectionMatrix())}}const Da={tauN:1,tauH:.6,imuAgree:35,footVis:.5};class pC{n=new C(0,1,0);h=-1.4;source="assumed";fromFeet=!1;bodyUp=new C(0,1,0);bodyW=0;update(t,e,i){const s=1-Math.exp(-i/Da.tauN),r=1-Math.exp(-i/Da.tauH),a=new C;let o=0;for(const d of t){if(d.lost||d.presence<.5)continue;const p=x=>new C(d.world[x].x,d.world[x].y,d.world[x].z),v=p(D.shL).add(p(D.shR)).multiplyScalar(.5),g=Math.min(d.world[D.anL].v,d.world[D.anR].v),m=g>Da.footVis?p(D.anL).add(p(D.anR)).multiplyScalar(.5):p(D.hipL).add(p(D.hipR)).multiplyScalar(.5),M=v.sub(m);M.lengthSq()<1e-4||(a.addScaledVector(M.normalize(),d.presence*(g>Da.footVis?1:.6)),o+=d.presence)}o>0&&a.lengthSq()>1e-6&&(a.normalize(),this.bodyUp.lerp(a,this.bodyW>0?s*.5:1).normalize(),this.bodyW=Math.min(1,this.bodyW+i));let c=null;const l=Math.cos(ni.degToRad(Da.imuAgree));e&&(this.bodyW===0||e.dot(this.bodyUp)>l)?(c=e,this.source="motion"):this.bodyW>0&&(c=this.bodyUp,this.source="body"),c&&this.n.lerp(c,s).normalize();let u=0,h=0,f=!1;for(const d of t){if(d.lost||d.presence<.5)continue;const p=M=>this.n.x*(d.T.x+d.world[M].x)+this.n.y*(d.T.y+d.world[M].y)+this.n.z*(d.T.z+d.world[M].z);let v=1/0;for(const[M,x]of[[D.heelL,.02],[D.heelR,.02],[D.toeL,.02],[D.toeR,.02],[D.anL,.08],[D.anR,.08]])d.world[M].v>Da.footVis&&(v=Math.min(v,p(M)-x));if(v<1/0){u+=v*d.presence,h+=d.presence,f=!0;continue}const g=(p(D.hipL)+p(D.hipR))/2,m=Math.max(.6,Math.min(1.1,d.len.thigh+d.len.shin+.08));u+=(g-m)*d.presence*.4,h+=d.presence*.4}h>0&&(this.h+=(u/h-this.h)*r,this.fromFeet=f)}foot(t,e=new C){return e.copy(t).addScaledVector(this.n,this.h-this.n.dot(t))}height(t){return this.n.dot(t)-this.h}axes(){const t=new C(0,0,-1).addScaledVector(this.n,this.n.z).normalize(),e=new C().crossVectors(t,this.n).normalize();return{back:t,side:e}}get cameraHeight(){return-this.h}}const Sr={coupling:.08,deadzone:2,restitution:.55,pupil:.46},mC=new cs({color:16777215,side:Te,depthTest:!1,toneMapped:!1}),gC=new cs({color:657930,side:Te,depthTest:!1,toneMapped:!1}),vC=new cs({color:10132122,side:Te,depthTest:!1,toneMapped:!1}),xC=new cs({color:16777215,side:Te,depthTest:!1,transparent:!0,opacity:.85,toneMapped:!1}),MC=new Yr(1,40),_C=new dd(.95,1.05,40),wC=new Yr(1,28),bC=new Yr(.16,16);class cg{g=new de;pupil;q=new ht(0,-.5);w=new ht;prev=[];sm=new C;primed=!1;constructor(){const t=new nt(MC,mC),e=new nt(_C,vC);this.pupil=new nt(wC,gC),this.pupil.scale.setScalar(Sr.pupil);const i=new nt(bC,xC);i.position.set(-.38,.42,.003),this.pupil.position.z=.0015,e.position.z=.001,this.g.add(t,e,this.pupil,i),this.g.traverse(s=>{s.renderOrder=1100,s.frustumCulled=!1})}update(t,e,i,s){this.primed||(this.sm.copy(t.p),this.primed=!0),this.sm.lerp(t.p,1-Math.exp(-i/.05)),this.prev.push(this.sm.clone()),this.prev.length>3&&this.prev.shift();const r=new C;if(this.prev.length===3&&i>0){r.copy(this.prev[2]).addScaledVector(this.prev[1],-2).add(this.prev[0]).divideScalar(i*i);const f=r.length();r.multiplyScalar(f>Sr.deadzone?(f-Sr.deadzone)/f:0)}const a=new C().addScaledVector(e,-9.8).addScaledVector(r,-1).multiplyScalar(Sr.coupling/Math.max(t.r,.005)),o=a.dot(t.u),c=a.dot(t.v),l=1-Sr.pupil,u=4,h=Math.min(i,.1)/u;for(let f=0;f<u;f++){this.w.x+=o*h,this.w.y+=c*h,this.w.multiplyScalar(Math.exp(-2.2*h)),this.q.addScaledVector(this.w,h);const d=this.q.length();if(d>l){const p=this.q.x/d,v=this.q.y/d;this.q.set(p*l,v*l);const g=this.w.x*p+this.w.y*v;if(g>0){const m=this.w.x-g*p,M=this.w.y-g*v;this.w.set(m*.9-Sr.restitution*g*p,M*.9-Sr.restitution*g*v)}}}this.g.position.copy(t.p),this.g.quaternion.setFromRotationMatrix(new se().makeBasis(t.u,t.v,t.n)),this.g.scale.setScalar(t.r*s),this.g.visible=s>.02,this.pupil.position.set(this.q.x,this.q.y,.0015)}}class yC{group=new de;eyes=new Map;update(t,e,i,s){this.group.visible=s;const r=new Set;if(s)for(const a of t){if(!a.eyes)continue;r.add(a.id);let o=this.eyes.get(a.id);if(!o){o=[new cg,new cg];for(const c of o)this.group.add(c.g);this.eyes.set(a.id,o)}a.eyes.forEach((c,l)=>o[l]?.update(c,e,i,a.show))}for(const[a,o]of this.eyes)if(!r.has(a)){for(const c of o)this.group.remove(c.g);this.eyes.delete(a)}}}const Gs=900,SC=`
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
  }`,EC=`
  varying float vLife; varying vec3 vColor; varying float vNear;
  void main() {
    vec2 c = gl_PointCoord - 0.5;
    float d = length(c) * 2.0;
    if (d > 1.0 || vLife <= 0.0) discard;
    float core = exp(-d * d * 5.0), halo = exp(-d * d * 1.6) * 0.45;
    // in quickly (a fast spark is metres out by a slow fade-in's end), out slowly
    float fade = smoothstep(0.0, 0.25, vLife) * smoothstep(1.0, 0.95, vLife) * vNear;
    gl_FragColor = vec4(vColor * (core * 1.6 + halo) * fade, 1.0);
  }`,TC=[16722324,11796265,16769065,2744575,9187071].map(n=>new gt(n));class AC{points;pos=new Float32Array(Gs*3);vel=new Float32Array(Gs*3);col=new Float32Array(Gs*3);size=new Float32Array(Gs);life=new Float32Array(Gs);span=new Float32Array(Gs);next=0;owed=new Map;mat;constructor(){const t=new Me;t.setAttribute("position",new qt(this.pos,3)),t.setAttribute("aColor",new qt(this.col,3)),t.setAttribute("aSize",new qt(this.size,1)),t.setAttribute("aLife",new qt(this.life,1)),this.mat=new nn({vertexShader:SC,fragmentShader:EC,uniforms:{uScale:{value:800}},transparent:!0,depthWrite:!1,blending:Xr,toneMapped:!1}),this.points=new A_(t,this.mat),this.points.frustumCulled=!1,this.points.renderOrder=1050}update(t,e,i,s){if(this.mat.uniforms.uScale.value=i,this.points.visible=s,!s)return;for(const o of t){const c=Math.min(1,Math.max(0,(o.open-.3)/.45));let l=(this.owed.get(o.id)??0)+c*c*110*(o.rate??1)*e;const u=o.colors?.length?o.colors:TC;for(;l>=1;){l-=1;const h=this.next;this.next=(this.next+1)%Gs;const f=.35,d=Math.random()*Math.PI*2,p=Math.random()*f,v=new C(1,0,0).cross(o.dir);v.lengthSq()<1e-4&&v.set(0,1,0),v.normalize();const g=new C().crossVectors(o.dir,v).normalize(),m=o.dir.clone().addScaledVector(v,Math.cos(d)*p).addScaledVector(g,Math.sin(d)*p-.15).normalize(),M=(1.1+Math.random()*1.1)*o.scale*(o.speed??1);this.pos[h*3]=o.p.x,this.pos[h*3+1]=o.p.y,this.pos[h*3+2]=o.p.z,this.vel[h*3]=m.x*M,this.vel[h*3+1]=m.y*M,this.vel[h*3+2]=m.z*M;const x=u[Math.floor(Math.random()*u.length)];this.col[h*3]=x.r,this.col[h*3+1]=x.g,this.col[h*3+2]=x.b,this.size[h]=(.025+Math.random()*.045)*o.scale*(o.size??1),this.span[h]=.9+Math.random()*.6,this.life[h]=1}this.owed.set(o.id,l)}const r=Math.exp(-1.6*e);for(let o=0;o<Gs;o++)this.life[o]<=0||(this.life[o]=this.life[o]-e/this.span[o],this.vel[o*3]=this.vel[o*3]*r,this.vel[o*3+2]=this.vel[o*3+2]*r,this.vel[o*3+1]=this.vel[o*3+1]*r+.5*e,this.pos[o*3]=this.pos[o*3]+this.vel[o*3]*e,this.pos[o*3+1]=this.pos[o*3+1]+this.vel[o*3+1]*e,this.pos[o*3+2]=this.pos[o*3+2]+this.vel[o*3+2]*e);const a=this.points.geometry;for(const o of["position","aColor","aSize","aLife"])a.getAttribute(o).needsUpdate=!0}}const RC=new nn({transparent:!0,depthWrite:!1,toneMapped:!1,vertexShader:"varying vec2 vUv; void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }",fragmentShader:"varying vec2 vUv; void main() { float r = length(vUv - 0.5) * 2.0; gl_FragColor = vec4(0.0, 0.0, 0.0, 0.5 * pow(clamp(1.0 - r, 0.0, 1.0), 1.6)); }"}),CC=new _i(1,1),hu=12,LC=n=>({pelvis:n.pelvis.clone(),chest:n.chest.clone(),head:n.head.clone(),headVis:n.headVis,neck:n.neck.clone(),dir:Object.fromEntries(Object.entries(n.dir).map(([t,e])=>[t,e.clone()])),vis:{...n.vis}}),Mx=`
  varying vec2 vUv;
  uniform vec4 uCrop; // u0, v0, du, dv of the video shown
  uniform float uMirror;
  void main() {
    vec2 uv = position.xy * 0.5 + 0.5;
    uv.x = mix(uv.x, 1.0 - uv.x, uMirror);
    vUv = uCrop.xy + uv * uCrop.zw;
    gl_Position = vec4(position.xy, 1.0, 1.0);
  }`,PC=`
  varying vec2 vUv;
  uniform sampler2D uTex;
  void main() { gl_FragColor = vec4(texture2D(uTex, vUv).rgb, 1.0); }`;class IC{constructor(t){this.canvas=t,this.renderer=new Ky({canvas:t,antialias:!0,alpha:!1,powerPreference:"high-performance",preserveDrawingBuffer:!1}),this.renderer.outputColorSpace=xn,this.renderer.toneMapping=Eg,this.renderer.toneMappingExposure=1,this.renderer.shadowMap.enabled=!0,this.renderer.shadowMap.type=_g,this.renderer.setPixelRatio(this.opts.pixelRatio),this.plainBg=new nn({vertexShader:Mx,fragmentShader:PC,depthTest:!1,depthWrite:!1,toneMapped:!1,uniforms:this.bgUniforms}),this.bg=new nt(new _i(2,2),this.plainBg),this.fg=new nt(new _i(2,2),this.plainBg),this.fg.frustumCulled=!1,this.fg.renderOrder=1e3,this.fg.visible=!1,this.bg.frustumCulled=!1,this.bg.renderOrder=-1e3,this.scene.add(this.bg),this.scene.add(this.fg),this.scene.add(this.world),this.world.add(this.googly.group,this.breath.points);for(const e of this.spots)this.world.add(e,e.target);this.grain=new nt(new _i(2,2),new nn({vertexShader:"varying vec2 vUv; void main() { vUv = position.xy * 0.5 + 0.5; gl_Position = vec4(position.xy, 0.0, 1.0); }",fragmentShader:`varying vec2 vUv; uniform float uTime; uniform vec2 uRes;
        float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
        void main() {
          vec2 d = vUv - 0.5; d.y *= 1.15;
          float vig = 1.0 - 0.35 * dot(d, d);
          float n = hash(floor(vUv * uRes) + fract(uTime * 7.31) * 97.0);
          gl_FragColor = vec4(vec3(vig * (0.965 + 0.035 * n)), 1.0);
        }`,uniforms:{uTime:{value:0},uRes:{value:new ht(1,1)}},depthTest:!1,depthWrite:!1,toneMapped:!1,transparent:!0,blending:wg,blendSrc:bg,blendDst:yg})),this.grain.frustumCulled=!1,this.grain.renderOrder=1200,this.grain.visible=!1,this.scene.add(this.grain),this.scene.add(this.camera),this.light=new dC(this.renderer,this.scene,this.world),this.rims[0].position.set(-3,2.5,-6),this.rims[1].position.set(3,2.5,-6);for(const e of this.rims)e.target.position.set(0,0,-3),this.scene.add(e,e.target)}renderer;scene=new Gg;camera=new jn(50,1,.05,60);world=new de;light;bg;bgUniforms={uTex:{value:null},uCrop:{value:new fe(0,0,1,1)},uMirror:{value:0}};plainBg;videoTex=null;templates=new Map;wearers=new Map;leaving=[];lastT=-1;frameDt=0;pyramid=!1;hideWearers=!1;cloneCast=t=>t;ground=new pC;googly=new yC;breath=new AC;googlyOn=!1;breathOn=!0;spots=[0,1,2].map(()=>new h3(16777215,0,0,.24,.65,2));grain;fg;rims=[new lf(16723349,0),new lf(3073791,0)];opts={size:1,shadows:!0,envLight:!0,pixelRatio:Math.min(window.devicePixelRatio||1,2)};cover={s:1,ox:0,oy:0,vw:1,vh:1,cw:1,ch:1,mirror:!1};setVideo(t){this.videoTex?.dispose();const e=new R_(t);e.colorSpace=Qi,e.minFilter=Pe,e.magFilter=Pe,e.generateMipmaps=!1,this.videoTex=e,this.bgUniforms.uTex.value=e}setBackground(t){this.bg.material=t??this.plainBg}setForeground(t){this.fg.visible=!!t,t&&(this.fg.material=t)}template(t){let e=this.templates.get(t);return e||(e=P0(as(t)),this.templates.set(t,e)),e}hasTemplate(t){return this.templates.has(t)}worker=null;queue=[];busy=null;waiting=new Map;workerMs=new Map;prepare(t,e=!1){const i=this.templates.get(t);if(i)return Promise.resolve(i);const s=new Promise(r=>{const a=this.waiting.get(t)??[];a.push(r),this.waiting.set(t,a)});return this.busy!==t&&(this.queue=this.queue.filter(r=>r!==t),e?this.queue.unshift(t):this.queue.push(t)),this.pump(),s}isPreparing(t){return this.busy===t||this.queue.includes(t)}pump(){if(!(this.busy||!this.queue.length)){if(!this.worker)try{this.worker=new Worker(new URL(""+new URL("build.worker-BjCjHC17.js",import.meta.url).href,import.meta.url),{type:"module"}),this.worker.onmessage=t=>{const{id:e,body:i,fur:s,ms:r}=t.data;this.workerMs.set(e,r);const a=P0(as(e),void 0,i?{body:i,fur:s}:void 0);this.finish(e,a)},this.worker.onerror=t=>{console.warn("costume worker failed; building on the main thread",t),this.worker=null,this.workerDead=!0,this.fallback()}}catch{this.workerDead=!0}if(this.workerDead){this.fallback();return}this.busy=this.queue.shift(),this.worker.postMessage({id:this.busy})}}workerDead=!1;fallback(){const t=this.busy??this.queue.shift();t&&(this.busy=t,setTimeout(()=>this.finish(t,P0(as(t))),16))}finish(t,e){this.templates.has(t)||this.templates.set(t,e);const i=this.templates.get(t);for(const s of this.waiting.get(t)??[])s(i);this.waiting.delete(t),this.busy=null,this.pump()}K=null;faceTransfer=!0;depth=new hC;layout(t,e){this.K=t;const i=this.canvas.clientWidth||window.innerWidth,s=this.canvas.clientHeight||window.innerHeight,r=this.opts.pixelRatio;this.renderer.getPixelRatio()!==r&&this.renderer.setPixelRatio(r);const a=this.renderer.getSize(new ht);(a.x!==i||a.y!==s)&&this.renderer.setSize(i,s,!1);const o=Math.max(i/t.w,s/t.h),c=i/o,l=s/o,u=(t.w-c)/2/t.w,h=(t.h-l)/2/t.h;this.bgUniforms.uCrop.value.set(u,h,c/t.w,l/t.h),this.bgUniforms.uMirror.value=e?1:0,this.camera.fov=ni.radToDeg(2*Math.atan(l/2/t.f)),this.camera.aspect=i/s,this.camera.updateProjectionMatrix(),this.world.scale.x=e?-1:1,this.cover={s:o,ox:(t.w-c)/2,oy:(t.h-l)/2,vw:t.w,vh:t.h,cw:i,ch:s,mirror:e}}sync(t,e,i){this.world.updateWorldMatrix(!0,!1);const s=this.lastT<0?1/30:Math.min(.1,Math.max(0,i-this.lastT));this.lastT=i,this.frameDt=s;const r=new Set;for(const a of t){const o=e(a.id);let c=this.wearers.get(a.id);c&&c.def.id!==o&&this.templates.has(o)&&(c.leaving=!0,this.leaving.push(c),this.wearers.delete(a.id),c=void 0),!(!c&&!this.templates.has(o))&&(r.add(a.id),c||(c=this.dress(a.id,o)),c.life=Math.min(1,c.life+s/.35),this.pose(c,a,i))}for(const[a,o]of this.wearers)r.has(a)||this.drop(o);this.leaving=this.leaving.filter(a=>{if(a.life-=s/.35,a.life<=0)return this.drop(a),!1;const o=t.find(c=>c.id===a.trackId);return o&&this.pose(a,o,i),!0})}dress(t,e){const{def:i,root:s,rig:r,mats:a,field:o}=this.instance(e),c={trackId:t,def:i,root:s,rig:r,mats:a,field:o,fade:0,life:0,leaving:!1,poses:[],head:0,len:null,clones:[]};return this.world.add(s),this.wearers.set(t,c),c}instance(t){const e=this.template(t),i=pS(e.root),s=new Map;i.traverse(o=>{o.isBone&&s.set(o.name,o)});const r=new Map;i.traverse(o=>{const c=o;if(!c.isMesh&&!o.isSprite)return;const l=u=>{let h=r.get(u);return h||(h=u.clone(),h.onBeforeCompile=u.onBeforeCompile,h.customProgramCacheKey=u.customProgramCacheKey,u.userData.keepBlend?h.userData.baseOpacity=u.opacity:h.alphaHash=!0,r.set(u,h)),h};c.material=Array.isArray(c.material)?c.material.map(l):l(c.material)});const a=rC(i,e.def);return fC(i,this.depth.u),{def:e.def,root:i,rig:new X6(e.def.segs,s),mats:[...r.values()],field:a}}drop(t){this.world.remove(t.root);for(const e of t.clones)this.dropClone(e);for(const e of t.mats)e.dispose();this.wearers.get(t.trackId)===t&&this.wearers.delete(t.trackId)}pose(t,e,i){const s=t.def,r=t.rig,a=Of(e.world);e.face&&(a.head.copy(e.face.head),a.headVis=Math.max(a.headVis,e.face.headW));const o=this.fit(r,s,e.len);r.apply(a,i,s.idle?.tail??0,this.frameDt),s.face?.jaw&&r.setJaw((e.face?.jaw??0)*s.face.jaw,e.face?.jawSide??0),t.root.position.set(e.T.x,e.T.y,e.T.z),t.root.scale.setScalar(o),this.K&&mx.strength>0&&j6(r,t.root,e.image,this.K);const c=e.presence*Math.max(0,Math.min(1,t.life)),l=c*c*(3-2*c);if(l!==t.fade){for(const u of t.mats)u.opacity=l*(u.userData.baseOpacity??1);t.fade=l}t.root.visible=l>.01&&!this.hideWearers,s.tick?.(t.root,i,e.face??null),t.field&&(t.root.updateMatrixWorld(!0),aC(t.field,this.faceTransfer?e.face?.motion?.move??null:null,r.bones.get("head"))),t.head=(t.head+1)%hu,t.poses[t.head]=LC(a),t.len=e.len,this.posePyramid(t,o,l,i)}fit(t,e,i){const s=i.torso/t.torso*(e.fit?.size??1)*this.opts.size,r=e.fit?.limb??0,a=(c,l)=>{const u=1+(l/s/(t.len.get(c)??1)-1)*r;t.setLength(c,Math.min(1.6,Math.max(.65,u)))};for(const c of["L","R"])a("arm"+c,i.upperArm),a("thigh"+c,i.thigh),a("shin"+c,i.shin);const o=t.neckFit(i.neck/s);return t.setNeck(1+(Math.min(1.25,Math.max(.45,o))-1)*(e.fit?.head??.85)),s}dropClone(t){this.world.remove(t.root,t.shadow);for(const e of t.mats)e.dispose()}posePyramid(t,e,i,s){const r=this.pyramid?this.wearers.size>1?2:3:0,a=[];for(let v=1;v<=r;v++)for(let g=0;g<=v;g++)a.push({row:v,col:g,id:this.cloneCast(t.def.id,a.length)});for(let v=0;v<t.clones.length;v++){const g=t.clones[v],m=a[v];if(!m){this.dropClone(g),t.clones.splice(v--,1);continue}g.id!==m.id&&this.templates.has(m.id)&&(this.dropClone(g),t.clones[v]=this.makeClone(m))}for(;t.clones.length<a.length;){const v=a[t.clones.length];if(!this.templates.has(v.id)){this.prepare(v.id);break}t.clones.push(this.makeClone(v))}const o=t.rig.torso*e*3.2,c=this.ground,{back:l,side:u}=c.axes(),h=t.root.position,f=c.foot(h),d=c.height(h),p=new ie().setFromUnitVectors(new C(0,0,1),c.n);for(const v of t.clones){const g=v.col-v.row/2,m=Math.round(v.row*3+Math.abs(g)*1.5);let M;for(let b=m;b>=0&&!M;b--)M=t.poses[(t.head-b+hu*4)%hu];const x=t.len?this.fit(v.rig,v.def,t.len):e;M&&v.rig.apply(M,s-m/30,v.def.idle?.tail??0);const _=f.clone().addScaledVector(l,v.row*o*.5).addScaledVector(u,g*o*.55);v.root.position.copy(_).addScaledVector(c.n,d),v.root.scale.setScalar(x),v.root.visible=i>.01;for(const b of v.mats)b.opacity=i*(b.userData.baseOpacity??1);v.shadow.position.copy(_).addScaledVector(c.n,.004),v.shadow.quaternion.copy(p),v.shadow.scale.set(o*.42,o*.26,1),v.shadow.visible=v.root.visible,v.def.tick?.(v.root,s-m/30,null)}}makeClone(t){const{def:e,root:i,rig:s,mats:r}=this.instance(t.id);i.traverse(o=>{o.castShadow=!1});const a=new nt(CC,RC);return a.renderOrder=1,this.world.add(i,a),{id:t.id,def:e,root:i,rig:s,mats:r,row:t.row,col:t.col,shadow:a}}faces(t,e,i){this.world.updateMatrixWorld();const s=this.world.matrixWorld.clone().invert(),r=[],a=[];for(const l of t){if(l.lost&&l.presence<=0)continue;const u=l.face,h=this.wearers.get(l.id),f=h&&h.root.visible&&!this.hideWearers?h:null,d=l.face?.head??Of(l.world).head,p=(b,S,T)=>new C(b,S,T).applyQuaternion(d),v=new C(l.T.x+l.world[D.nose].x,l.T.y+l.world[D.nose].y,l.T.z+l.world[D.nose].z),g=Math.max(.3,-v.z),m=(b,S,T)=>new C((b*e.w-e.cx)/e.f*g,(e.cy-S*e.h)/e.f*g,-g).addScaledVector(p(0,0,1),T);let M=null,x=null;if(f){f.root.updateMatrixWorld(!0);const b=f.rig.bones.get("head"),S=f.def.segs.find(E=>E.name==="head"),T=b?s.clone().multiply(b.matrixWorld):null,A=f.root.scale.x;if(T&&S&&f.def.face?.eyes){const E=new C(1,0,0).transformDirection(T),R=new C(0,1,0).transformDirection(T),L=new C(0,0,1).transformDirection(T);M=f.def.face.eyes.map(([I,N,B,X])=>({p:new C(I-S.a[0],N-S.a[1],B-S.a[2]).applyMatrix4(T),u:E,v:R,n:L,r:X*A*1.15}))}const w=f.rig.bones.get("jaw"),y=f.def.segs.find(E=>E.name==="jaw");if(w&&y&&f.def.face?.jaw){const E=s.clone().multiply(w.matrixWorld);x={p:new C(y.b[0]-y.a[0],y.b[1]-y.a[1],y.b[2]-y.a[2]).applyMatrix4(E),dir:new C(0,-.2,1).transformDirection(T??E),scale:A*10}}else if(T&&S){const E=new C(0,0,1).transformDirection(T);x={p:(u?m(u.mouth.x,u.mouth.y,0):v.clone()).addScaledVector(E,.12*A*10),dir:E.clone().add(new C(0,-.2,0)).normalize(),scale:A*10}}}if(!M&&u){const b=p(1,0,0),S=p(0,1,0),T=p(0,0,1);M=u.eyes.map(A=>({p:m(A.x,A.y,.02),u:b,v:S,n:T,r:Math.max(.012,A.r*e.w/e.f*g*1.35)}))}!x&&u&&(x={p:m(u.mouth.x,u.mouth.y,.03),dir:p(0,-.2,1).normalize(),scale:1}),r.push({id:l.id,eyes:M,show:l.presence});const _=f?.def.face?.breath;x&&u&&a.push({id:l.id,...x,open:u.jaw*l.presence,colors:_?.colors.map(b=>new gt(b)),rate:_?.rate,speed:_?.speed,size:_?.size})}this.googly.update(r,this.ground.n,i,this.googlyOn);let o=null;for(const l of t)!l.lost&&l.face?.read&&l.face.probe&&(!o||l.face.mouth.w>o.face.mouth.w)&&(o=l);this.light.face=o?{probe:o.face.probe,w:o.face.mouth.w*2.4}:null;const c=this.renderer.getDrawingBufferSize(new ht).y;this.breath.update(a,i,c/(2*Math.tan(ni.degToRad(this.camera.fov)/2)),this.breathOn)}setGrain(t,e){this.grain.visible=t;const i=this.grain.material.uniforms;i.uTime.value=e;const s=this.renderer.getDrawingBufferSize(new ht);i.uRes.value.set(s.x/1.5,s.y/1.5)}stageSpots(t,e,i,s,r){const a=this.ground,{back:o,side:c}=a.axes(),l=a.foot(r??new C(0,-.3,-3)),u=l.clone().addScaledVector(o,1.1),h=[16769728,16726696,3856639],f=d=>{const p=go(d,s);return new ht(p.x,1-p.y)};return this.spots.map((d,p)=>{const v=l.clone().addScaledVector(c,(p-1)*2.4).addScaledVector(o,.6).addScaledVector(a.n,3.6),g=u.clone().addScaledVector(c,(p-1)*.9+1.2*Math.sin(e*.33+p*2.1)).addScaledVector(o,.8*Math.cos(e*.27+p*1.3)),m=new gt(h[p]);d.color.copy(m),d.position.copy(v),d.target.position.copy(g),d.target.updateMatrixWorld(),d.intensity=t?38*(1+.8*i):0;const M=v.distanceTo(g)*Math.tan(d.angle)*.9,x=f(g),_=v.z<-.15?f(v):new ht(x.x,1.4),b=new ht(Math.abs(f(g.clone().addScaledVector(c,M)).x-x.x),Math.abs(f(g.clone().addScaledVector(o,M)).y-x.y));return{L:_,P:x,R:b,C:m.clone().multiplyScalar(1+.8*i)}})}stageLights(t,e,i){const s=[16722324,11796265,16769065,2744575,9187071];this.rims.forEach((r,a)=>{r.intensity=t?2.2+3*i:0;const o=(e*.12+a*.4)%1*s.length,c=Math.floor(o),l=o-c;r.color.setHex(s[c%s.length]).lerp(new gt(s[(c+1)%s.length]),l)})}people(){return[...this.wearers.values()].filter(t=>t.root.visible).map(t=>t.root.position.clone())}render(t,e,i){this.renderer.shadowMap.enabled=this.opts.shadows,t&&this.light.update(t,e,this.cover.mirror,i,this.people(),this.opts.envLight),this.renderer.render(this.scene,this.camera)}get count(){return this.wearers.size}}const Ls=[{id:"insitu",name:"In Situ",code:12,swatch:"radial-gradient(ellipse at 30% 85%, rgba(255,80,190,0.9), transparent 35%), radial-gradient(ellipse at 72% 80%, rgba(80,220,255,0.9), transparent 35%), linear-gradient(160deg, transparent 40%, rgba(255,240,220,0.35) 50%, transparent 60%), #2a2430"},{id:"tunnel",name:"Tunnel",code:9,swatch:"repeating-radial-gradient(circle, #ff2d95 0 3px, #12071f 3px 8px, #2ee6ff 8px 11px, #12071f 11px 16px)"},{id:"lasers",name:"Lasers",code:10,swatch:"linear-gradient(115deg, transparent 46%, #b6ff2e 48%, transparent 50%), linear-gradient(65deg, transparent 46%, #ff2d95 48%, transparent 50%), linear-gradient(90deg, transparent 47%, #2ee6ff 49%, transparent 51%), #07040d"},{id:"kaleido",name:"Kaleido",code:11,swatch:"conic-gradient(#ff2d95, #ffe62e, #b6ff2e, #2ee6ff, #8a2eff, #ff2d95)"},{id:"rings",name:"Rings",code:5,swatch:"repeating-radial-gradient(circle, #ff3d7f 0 5px, #ffb23d 5px 10px, #3dd6ff 10px 15px, #8c5cff 15px 20px)"},{id:"neon",name:"Neon",code:4,swatch:"radial-gradient(circle, transparent 0 40%, #39ff9c 42% 50%, transparent 54%), #06030f"},{id:"pop",name:"Pop Art",code:1,swatch:"radial-gradient(circle at 30% 30%, #ffde00 0 22%, transparent 23%), radial-gradient(circle at 70% 70%, #ff2d8a 0 22%, transparent 23%), #19c3ff"},{id:"warhol",name:"Warhol",code:2,swatch:"conic-gradient(#ff5fa2 0 25%, #ffd400 0 50%, #2ad4c4 0 75%, #7b5cff 0)"},{id:"echo",name:"Echoes",code:6,swatch:"linear-gradient(90deg, #1b1033, #ff2db4 40%, #2de2ff 70%, #1b1033)"},{id:"disco",name:"Disco",code:7,swatch:"radial-gradient(circle at 30% 30%, #ff4fd8, transparent 45%), radial-gradient(circle at 70% 60%, #4fd1ff, transparent 45%), radial-gradient(circle at 45% 80%, #ffe14f, transparent 40%), #120820"},{id:"solar",name:"Solarize",code:3,swatch:"linear-gradient(135deg, #1a0b3d, #ff7a00 45%, #00e5ff 55%, #2a0b3d)"},{id:"spot",name:"Spotlight",code:0,swatch:"radial-gradient(circle at 50% 40%, #fff6d8, #6a5a40 45%, #120f0a 75%)"}],DC=[[2757440,16727435,16756736,16774084],[731722,46023,16740156,16776160],[2951947,9321727,3997598,16382065],[1058330,16723502,3065343,16769520]],Th=12,Ul=`
  varying vec2 vUv;
  void main() { vUv = position.xy * 0.5 + 0.5; gl_Position = vec4(position.xy, 0.0, 1.0); }`,UC=`
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
  }`,FC=`
  varying vec2 vUv;
  uniform sampler2D uTex, uMask;
  uniform vec4 uOn;
  void main() {
    vec4 m = smoothstep(0.3, 0.7, texture2D(uMask, vec2(vUv.x, 1.0 - vUv.y))) * uOn;
    gl_FragColor = vec4(texture2D(uTex, vUv).rgb, max(max(m.r, m.g), max(m.b, m.a)));
  }`,NC=`
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
  ${UC}

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
    return texture(uHist, vec3(q, mod(uHead - delay + ${Th}.0 * 8.0, ${Th}.0)));
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
  }`,kC=`
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
  }`,OC=`
  varying vec2 vUv;
  uniform sampler2D uSrc;
  uniform vec2 uDir;
  void main() {
    vec3 c = texture2D(uSrc, vUv).rgb * 0.2270270;
    c += (texture2D(uSrc, vUv + uDir * 1.3846154).rgb + texture2D(uSrc, vUv - uDir * 1.3846154).rgb) * 0.3162162;
    c += (texture2D(uSrc, vUv + uDir * 3.2307692).rgb + texture2D(uSrc, vUv - uDir * 3.2307692).rgb) * 0.0702703;
    gl_FragColor = vec4(c, 1.0);
  }`,lg=`
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
  }`;class BC{material;foreground;_preset=Ls[0];get preset(){return this._preset}set preset(t){t!==this._preset&&(this.fromCode=this._preset.code,this.xfade=this.started?0:1,this._preset=t)}fromCode=0;xfade=1;started=!1;rtOld=null;subjects=2;beat=0;setSpots(t,e){const i=this.scene.uniforms;t.forEach((s,r)=>{i.uSpotL.value[r].copy(s.L),i.uSpotP.value[r].copy(s.P),i.uSpotR.value[r].copy(s.R),i.uSpotC.value[r].copy(s.C)}),i.uSpotK.value=e}clones=!0;pyramid=!0;maskTex;maskData=new Uint8Array(4);mw=0;mh=0;fw=0;fh=0;fxTex;fxData;chans=[null,null,null,null];chanMask=[null,null,null,null];union;dist;trail;stamp;uOn=new fe;box=new fe(.35,.1,.65,.7);quad=new nt(new _i(2,2));quadScene=new Gg;cam=new md(-1,1,1,-1,0,1);cut;scene;bright;blur;rtScene=[];rtB1a=null;rtB1b=null;rtB2a=null;rtB2b=null;hist=null;head=0;flip=0;sizeKey="";constructor(t,e){this.maskTex=new kr(new Uint8Array(4),1,1,ln),this.maskTex.needsUpdate=!0,this.resizeFx(160,90);const i={depthTest:!1,depthWrite:!1,toneMapped:!1};this.cut=new nn({...i,vertexShader:Ul,fragmentShader:FC,uniforms:{uTex:t.uTex,uMask:{value:this.maskTex},uOn:{value:this.uOn}}}),this.scene=new nn({...i,vertexShader:Ul,fragmentShader:NC,uniforms:{uTex:t.uTex,uMask:{value:this.maskTex},uFx:{value:this.fxTex},uPrev:{value:null},uHist:{value:null},uHead:{value:0},uClones:{value:1},uPyramid:{value:1},uSpotL:{value:[0,1,2].map(()=>new ht(.5,1.2))},uSpotP:{value:[0,1,2].map(()=>new ht(.5,.1))},uSpotR:{value:[0,1,2].map(()=>new ht(.1,.04))},uSpotC:{value:[0,1,2].map(()=>new gt(0,0,0))},uSpotK:{value:0},uClone:{value:Array.from({length:9},()=>new fe)},uCloneN:{value:0},uFoot:{value:new ht(.5,.1)},uFootW:{value:.2},uTime:{value:0},uAspect:{value:1},uBeat:{value:0},uLevel:{value:0},uPreset:{value:0},uOn:{value:this.uOn},uBox:{value:this.box},uPal:{value:DC.flat().map(s=>new gt(s))}}}),this.bright=new nn({...i,vertexShader:Ul,fragmentShader:kC,uniforms:{uSrc:{value:null},uTexel:{value:new ht},uThreshold:{value:.72}}}),this.blur=new nn({...i,vertexShader:Ul,fragmentShader:OC,uniforms:{uSrc:{value:null},uDir:{value:new ht}}}),this.material=new nn({...i,vertexShader:e,fragmentShader:lg,uniforms:{uCrop:t.uCrop,uMirror:t.uMirror,uScene:{value:null},uBloom1:{value:null},uBloom2:{value:null},uTime:{value:0},uBeat:{value:0},uFlash:{value:1},uRes:{value:new ht(1,1)},uOld:{value:null},uMix:{value:1},uCA:{value:1},uBloomK:{value:1}}}),this.foreground=new nn({...i,vertexShader:e,fragmentShader:lg,transparent:!0,defines:{FG:1},uniforms:{...this.material.uniforms,uMask:this.scene.uniforms.uMask,uOn:this.scene.uniforms.uOn}}),this.quad.frustumCulled=!1,this.quadScene.add(this.quad)}resizeFx(t,e){this.fxTex?.dispose(),this.fxData=new Uint8Array(t*e*4),this.fxTex=new kr(this.fxData,t,e,ln),this.fxTex.magFilter=Pe,this.fxTex.minFilter=Pe,this.union=new Float32Array(t*e),this.dist=new Float32Array(t*e),this.trail=new Float32Array(t*e),this.stamp=new Float32Array(t*e);for(let i=0;i<t*e;i++)this.fxData[i*4]=255;this.fxTex.needsUpdate=!0,this.fw=t,this.fh=e,this.scene&&(this.scene.uniforms.uFx.value=this.fxTex)}frameDt=1/30;update(t,e,i,s,r,a){this.frameDt=e;const o=this.scene.uniforms;o.uTime.value=i,o.uAspect.value=s,o.uPreset.value=this.preset.code,o.uBeat.value=this.beat,o.uClones.value=this.clones?1:0,o.uPyramid.value=this.pyramid?1:0,this.material.uniforms.uTime.value=i,this.material.uniforms.uBeat.value=this.beat;const c=this.preset.code===12;this.material.uniforms.uCA.value=c?.25:1,this.material.uniforms.uBloomK.value=c?.45:1;const l=s>=1?160:Math.max(48,Math.round(160*s)),u=s>=1?Math.max(48,Math.round(160/s)):160;(l!==this.fw||u!==this.fh)&&this.resizeFx(l,u);const h=t.filter(g=>g.presence>0).sort((g,m)=>m.len.torso/-m.T.z-g.len.torso/-g.T.z).slice(0,this.subjects),f=new Set(h.map(g=>g.id));for(let g=0;g<4;g++)this.chans[g]!==null&&!f.has(this.chans[g])&&(this.chans[g]=null,this.chanMask[g]=null);for(const g of h){let m=this.chans.indexOf(g.id);if(m<0){if(m=this.chans.indexOf(null),m<0)continue;this.chans[m]=g.id}const M=g.det?.mask;if(M){(M.w!==this.mw||M.h!==this.mh)&&this.resizeMask(M.w,M.h);let x=this.chanMask[m];if(!x||x.length!==M.data.length)x=this.chanMask[m]=new Float32Array(M.data.length),x.set(M.data);else{const _=1-Math.exp(-e/.04),b=M.data;for(let S=0;S<b.length;S++)x[S]=x[S]+(b[S]-x[S])*_}}}const d=[0,0,0,0];for(let g=0;g<4;g++){const m=this.chans[g];m!==null&&this.chanMask[g]&&(d[g]=t.find(M=>M.id===m)?.presence??0)}if(this.uOn.set(d[0],d[1],d[2],d[3]),this.fx(e,i,d),this.layPyramid(h[0],r,a,e),!this.mw)return;const p=this.mw*this.mh,v=this.maskData;for(let g=0;g<4;g++){const m=this.chanMask[g];if(!m){for(let M=0;M<p;M++)v[M*4+g]=0;continue}for(let M=0;M<p;M++)v[M*4+g]=m[M]*255}this.maskTex.needsUpdate=!0}cloneSm=Array.from({length:9},()=>new fe);cloneSmN=0;layPyramid(t,e,i,s=1/30){const r=this.scene.uniforms;if(!t||!e||!i){r.uCloneN.value=0,this.cloneSmN=0;return}const a=new C(t.T.x,t.T.y,t.T.z),o=e.foot(a),c=Math.max(1.2,Math.min(2.2,e.height(a)*1.9)),{back:l,side:u}=e.axes(),h=go(o,i),f=1-Math.exp(-s/.15),d=r.uFoot.value;this.cloneSmN===0?d.set(h.x,1-h.y):d.lerp(new ht(h.x,1-h.y),f),r.uFootW.value=Math.max(.05,this.box.z-this.box.x);const p=[];for(let g=1;g<=3;g++)for(let m=0;m<=g;m++){const M=m-g/2,x=o.clone().addScaledVector(l,g*c*.5).addScaledVector(u,M*c*.55);if(x.z>-.3)continue;const _=go(x,i);p.push({v:new fe(_.x,1-_.y,-o.z/-x.z,g*3+Math.abs(M)*1.5),depth:-x.z})}p.sort((g,m)=>m.depth-g.depth);const v=r.uClone.value;p.forEach((g,m)=>{const M=this.cloneSm[m];this.cloneSmN!==p.length?M.copy(g.v):M.lerp(g.v,f),M.w=g.v.w,v[m].copy(M)}),this.cloneSmN=p.length,r.uCloneN.value=p.length}resizeMask(t,e){this.maskTex.dispose(),this.mw=t,this.mh=e,this.maskData=new Uint8Array(t*e*4),this.maskTex=new kr(this.maskData,t,e,ln),this.maskTex.magFilter=Pe,this.maskTex.minFilter=Pe,this.scene.uniforms.uMask.value=this.maskTex,this.cut.uniforms.uMask.value=this.maskTex}fx(t,e,i){const s=this.fw,r=this.fh,a=this.union,o=this.dist;let c=s,l=r,u=-1,h=-1;for(let m=0;m<r;m++){const M=Math.min(this.mh-1,Math.floor((m+.5)/r*this.mh));for(let x=0;x<s;x++){let _=0;if(this.mw){const b=M*this.mw+Math.min(this.mw-1,Math.floor((x+.5)/s*this.mw));for(let S=0;S<4;S++){const T=this.chanMask[S];T&&(_=Math.max(_,T[b]*i[S]))}}a[m*s+x]=_,_>.5&&(x<c&&(c=x),x>u&&(u=x),m<l&&(l=m),m>h&&(h=m))}}if(u>=0){const m=1-Math.exp(-t/.12),M=c/s,x=(u+1)/s,_=1-(h+1)/r,b=1-l/r;this.box.set(this.box.x+(M-this.box.x)*m,this.box.y+(_-this.box.y)*m,this.box.z+(x-this.box.z)*m,this.box.w+(b-this.box.w)*m)}const f=1e6,d=Math.SQRT2;for(let m=0;m<s*r;m++)o[m]=a[m]>.5?0:f;for(let m=0;m<r;m++)for(let M=0;M<s;M++){const x=m*s+M;let _=o[x];M>0&&(_=Math.min(_,o[x-1]+1)),m>0&&(_=Math.min(_,o[x-s]+1),M>0&&(_=Math.min(_,o[x-s-1]+d)),M<s-1&&(_=Math.min(_,o[x-s+1]+d))),o[x]=_}for(let m=r-1;m>=0;m--)for(let M=s-1;M>=0;M--){const x=m*s+M;let _=o[x];M<s-1&&(_=Math.min(_,o[x+1]+1)),m<r-1&&(_=Math.min(_,o[x+s]+1),M<s-1&&(_=Math.min(_,o[x+s+1]+d)),M>0&&(_=Math.min(_,o[x+s-1]+d))),o[x]=_}const p=Math.exp(-t/1.1),v=e*.2%1,g=this.fxData;for(let m=0;m<s*r;m++){const M=a[m];this.trail[m]=Math.max(this.trail[m]*p,M),M>.5&&(this.stamp[m]=v),g[m*4]=Math.min(1,o[m]/48)*255,g[m*4+1]=this.trail[m]*255,g[m*4+2]=this.stamp[m]*255,g[m*4+3]=M*255}this.fxTex.needsUpdate=!0}targets(t,e,i){const r=900/Math.max(e,i),a=Math.max(64,Math.round(e*r)),o=Math.max(64,Math.round(i*r)),c=`${a}x${o}`;if(c===this.sizeKey)return;this.sizeKey=c;for(const m of[...this.rtScene,this.rtB1a,this.rtB1b,this.rtB2a,this.rtB2b,this.rtOld])m?.dispose();this.hist?.dispose();const l=t.extensions,u=l.has("EXT_color_buffer_half_float")||l.has("EXT_color_buffer_float"),h={type:u?cr:Hi,depthBuffer:!1,magFilter:Pe,minFilter:Pe};this.bright.uniforms.uThreshold.value=u?.72:.62,this.rtScene=[new En(a,o,h),new En(a,o,h)],this.rtOld=new En(a,o,h);const f=Math.max(16,Math.round(a/4)),d=Math.max(16,Math.round(o/4)),p=Math.max(8,Math.round(a/16)),v=Math.max(8,Math.round(o/16));this.rtB1a=new En(f,d,h),this.rtB1b=new En(f,d,h),this.rtB2a=new En(p,v,h),this.rtB2b=new En(p,v,h);const g=480/Math.max(e,i);this.hist=new JM(Math.round(e*g),Math.round(i*g),Th,{depthBuffer:!1}),this.hist.texture.magFilter=Pe,this.hist.texture.minFilter=Pe,this.scene.uniforms.uHist.value=this.hist.texture,this.material.uniforms.uRes.value.set(a,o)}pass(t,e,i,s=0){this.quad.material=e,t.setRenderTarget(i,s),t.render(this.quadScene,this.cam)}render(t,e,i){this.targets(t,e,i);const s=t.getRenderTarget();this.head=(this.head+1)%Th,this.pass(t,this.cut,this.hist,this.head),this.scene.uniforms.uHead.value=this.head;const r=this.rtScene[this.flip],a=this.rtScene[1-this.flip];this.flip=1-this.flip,this.scene.uniforms.uPrev.value=a.texture,this.pass(t,this.scene,r),this.started=!0;const o=this.material.uniforms;if(this.xfade<1){this.xfade=Math.min(1,this.xfade+this.frameDt/.45);const d=this.scene.uniforms.uPreset.value;this.scene.uniforms.uPreset.value=this.fromCode,this.pass(t,this.scene,this.rtOld),this.scene.uniforms.uPreset.value=d,o.uOld.value=this.rtOld.texture}const c=this.xfade;o.uMix.value=c*c*(3-2*c);const l=this.bright.uniforms,u=this.blur.uniforms;l.uSrc.value=r.texture,l.uTexel.value.set(1/r.width,1/r.height),this.pass(t,this.bright,this.rtB1a);const h=(d,p,v)=>{for(let g=0;g<v;g++)u.uSrc.value=d.texture,u.uDir.value.set(1.4/d.width,0),this.pass(t,this.blur,p),u.uSrc.value=p.texture,u.uDir.value.set(0,1.4/d.height),this.pass(t,this.blur,d)};h(this.rtB1a,this.rtB1b,1),l.uSrc.value=this.rtB1a.texture,l.uTexel.value.set(1/this.rtB1a.width,1/this.rtB1a.height);const f=l.uThreshold.value;l.uThreshold.value=0,this.pass(t,this.bright,this.rtB2a),l.uThreshold.value=f,h(this.rtB2a,this.rtB2b,2),t.setRenderTarget(s),o.uScene.value=r.texture,o.uBloom1.value=this.rtB1a.texture,o.uBloom2.value=this.rtB2a.texture}}class HC{env=0;level=0;stream=null;ctx=null;an=null;buf=new Uint8Array(0);avg=0;last=0;get on(){return!!this.an}async start(){if(this.an)return;this.stream=await navigator.mediaDevices.getUserMedia({audio:{echoCancellation:!1,noiseSuppression:!1,autoGainControl:!1}});const t=window.AudioContext??window.webkitAudioContext;this.ctx=new t,await this.ctx.resume();const e=this.ctx.createMediaStreamSource(this.stream);this.an=this.ctx.createAnalyser(),this.an.fftSize=1024,this.an.smoothingTimeConstant=0,e.connect(this.an),this.buf=new Uint8Array(this.an.frequencyBinCount)}stop(){for(const t of this.stream?.getTracks()??[])t.stop();this.ctx?.close(),this.stream=null,this.ctx=null,this.an=null,this.env=0,this.level=0}update(t,e){if(this.env*=Math.exp(-t/.18),!this.an||!this.ctx)return;this.an.getByteFrequencyData(this.buf);const i=this.ctx.sampleRate/this.an.fftSize,s=Math.max(1,Math.floor(40/i)),r=Math.max(s+1,Math.ceil(160/i));let a=0;for(let c=s;c<=r;c++)a+=this.buf[c];const o=a/((r-s+1)*255);this.level+=(o-this.level)*Math.min(1,t/.1),this.avg+=(o-this.avg)*Math.min(1,t/1.2),o>this.avg*1.3+.04&&o>.22&&e-this.last>260&&(this.env=1,this.last=e)}}class zC{up=null;listening=!1;async enable(){const t=window.DeviceOrientationEvent;try{if(t?.requestPermission&&await t.requestPermission()!=="granted")return!1}catch{return!1}return this.listening||(this.listening=!0,window.addEventListener("deviceorientation",e=>{if(e.beta===null||e.gamma===null)return;const i=ni.degToRad(e.beta),s=ni.degToRad(e.gamma);(this.up??=new C).set(-Math.sin(s)*Math.cos(i),Math.sin(i),Math.cos(s)*Math.cos(i)).normalize()})),!0}upInCamera(t){if(!this.up)return null;const e=ni.degToRad(screen.orientation?.angle??window.orientation??0),i=this.up.clone().applyAxisAngle(new C(0,0,1),-e);return t==="user"&&(i.x=-i.x,i.z=-i.z),i}}const Ue={tauJaw:.05,tauBlink:.04,tauLook:.06,tauShape:.1,tauPlace:.05,tauTurn:.07,tauTrust:.25,tauBias:.6,tauBiasRelax:2.5,forgetMs:400,mesh:!0,perFrame:2,crop:2.4,cropPx:320,budgetMs:12},VC=new ie,GC=new C(0,0,-1);class WC{lm=null;inferMs=0;canvas=document.createElement("canvas");ctx;tried=new Map;n=0;M=new se;v1=new C;v2=new C;constructor(){this.canvas.width=this.canvas.height=Ue.cropPx,this.ctx=this.canvas.getContext("2d")}async load(){const e=await qf(()=>import("./vision_bundle-Bk4VIwNi.js"),[],import.meta.url),i=await e.FilesetResolver.forVisionTasks("./mediapipe"),s=r=>e.FaceLandmarker.createFromOptions(i,{baseOptions:{modelAssetPath:"./models/face_landmarker.task",delegate:r},runningMode:"IMAGE",numFaces:1,outputFaceBlendshapes:!0,outputFacialTransformationMatrixes:!0,minFaceDetectionConfidence:.4,minFacePresenceConfidence:.4});try{this.lm=await s("GPU")}catch{this.lm=await s("CPU")}}detect(t,e,i){const s=new Map;if(!this.lm)return s;this.n++;const r=e.filter(l=>!l.lost&&l.presence>.2).sort((l,u)=>(this.tried.get(l.id)??-1)-(this.tried.get(u.id)??-1)),a=performance.now(),o=Ue.cropPx,c=this.ctx;for(const l of r.slice(0,Ue.perFrame)){if(s.size&&performance.now()-a>Ue.budgetMs)break;this.tried.set(l.id,this.n);const u=XC(l,i.w,i.h);if(!u)continue;c.fillStyle="#000",c.fillRect(0,0,o,o),c.drawImage(t,u.x,u.y,u.s,u.s,0,0,o,o);const h=this.lm.detect(this.canvas),f=h.faceLandmarks[0];if(!f||Math.hypot(f[1].x-.5,f[1].y-.5)>.3)continue;const d=new Map;for(const g of h.faceBlendshapes[0]?.categories??[])d.set(g.categoryName,g.score);let p=null;const v=h.facialTransformationMatrixes?.[0];if(v?.data?.length===16){this.M.fromArray(v.data);const g=new ie;this.M.decompose(this.v1,g,this.v2);const m=new C((u.x+u.s/2-i.cx)/i.f,-(u.y+u.s/2-i.cy)/i.f,-1).normalize();p=new ie().setFromUnitVectors(GC,m).multiply(g)}s.set(l.id,{pts:f.map(g=>({x:(u.x+g.x*u.s)/i.w,y:(u.y+g.y*u.s)/i.h,z:g.z*u.s/i.w})),shapes:d,rot:p})}for(const l of this.tried.keys())e.some(u=>u.id===l)||this.tried.delete(l);return this.inferMs=performance.now()-a,s}close(){this.lm?.close(),this.lm=null}}function XC(n,t,e){const i=n.image,s=u=>({x:i[u].x*t,y:i[u].y*e}),r=[D.nose,D.eyeL,D.eyeR,D.earL,D.earR];let a=0,o=0;for(const u of r){const h=s(u);a+=h.x/r.length,o+=h.y/r.length}const c=(u,h)=>{const f=s(u),d=s(h);return Math.hypot(f.x-d.x,f.y-d.y)},l=Ue.crop*Math.max(c(D.earL,D.earR),c(D.nose,D.earL),c(D.nose,D.earR),.35*c(D.shL,D.shR));return l>24&&Number.isFinite(a+o)?{x:a-l/2,y:o-l/2,s:l}:null}const Ai=(n,t,e,i)=>n+(t-n)*(1-Math.exp(-e/i)),uu=n=>Math.max(-1,Math.min(1,n)),Hf=(n,t)=>({x:(n.x+t.x)/2,y:(n.y+t.y)/2}),Ah=(n,t,e)=>Math.hypot((n.x-t.x)*e,n.y-t.y);function $C(n,t){const e=n.pts,i=t.w/t.h,s=(a,o)=>({...Hf(e[a],e[o]),r:Ah(e[a],e[o],i)*.62/i}),r=a=>n.shapes.get(a)??0;return{geo:J6(e,t.w,t.h),eyes:[s(263,362),s(33,133)],mouth:{...Hf(e[13],e[14]),w:Ah(e[61],e[291],i)/i},nose:e[1],probe:[e[151],e[152],e[425],e[205],e[1]].map(a=>({x:a.x,y:a.y})),jaw:Math.min(1,r("jawOpen")*1.4),blinkL:r("eyeBlinkLeft"),blinkR:r("eyeBlinkRight"),smileL:r("mouthSmileLeft"),smileR:r("mouthSmileRight"),smile:(r("mouthSmileLeft")+r("mouthSmileRight"))/2,frown:(r("mouthFrownLeft")+r("mouthFrownRight"))/2,pucker:r("mouthPucker"),funnel:r("mouthFunnel"),browUp:r("browInnerUp"),browDownL:r("browDownLeft"),browDownR:r("browDownRight"),browOuterL:r("browOuterUpLeft"),browOuterR:r("browOuterUpRight"),squintL:r("eyeSquintLeft"),squintR:r("eyeSquintRight"),wideL:r("eyeWideLeft"),wideR:r("eyeWideRight"),lookX:uu((r("eyeLookOutLeft")-r("eyeLookInLeft")+(r("eyeLookInRight")-r("eyeLookOutRight")))*.8),lookY:uu((r("eyeLookUpLeft")+r("eyeLookUpRight")-(r("eyeLookDownLeft")+r("eyeLookDownRight")))*.8),jawSide:uu((r("jawLeft")-r("jawRight"))*2),puff:r("cheekPuff"),sneer:(r("noseSneerLeft")+r("noseSneerRight"))/2}}function qC(n,t){const e=n.image,i=Ah(e[D.eyeL],e[D.eyeR],t)*.3/t;return{eyes:[{x:e[D.eyeL].x,y:e[D.eyeL].y,r:i},{x:e[D.eyeR].x,y:e[D.eyeR].y,r:i}],mouth:{...Hf(e[D.mouthL],e[D.mouthR]),w:Ah(e[D.mouthL],e[D.mouthR],t)/t}}}function YC(n,t,e){return{...n,eyes:n.eyes.map(i=>({...i,x:i.x+t,y:i.y+e})),mouth:{...n.mouth,x:n.mouth.x+t,y:n.mouth.y+e},nose:{x:n.nose.x+t,y:n.nose.y+e},probe:n.probe.map(i=>({x:i.x+t,y:i.y+e}))}}const jC=Object.keys(Mo),ZC=n=>n==="jaw"?Ue.tauJaw:n==="blinkL"||n==="blinkR"?Ue.tauBlink:n==="lookX"||n==="lookY"?Ue.tauLook:Ue.tauShape;function JC(n,t,e,i,s){const r=e.w/e.h;for(const a of n){if(a.lost)continue;const o=t?.get(a.id)??null,c=a.image[D.nose];let l=a.face;const u=o?$C(o,e):null,h=!u&&l?.last&&i-l.last.at<Ue.forgetMs?YC(l.last.read,c.x-l.last.nose.x,c.y-l.last.nose.y):null,f=u??h,d=f??qC(a,r),p=Of(a.world).head;if(l||(l=a.face={...Mo,eyes:d.eyes.map(m=>({...m})),mouth:{...d.mouth},read:!!u,seen:i,head:p.clone(),headW:0,turn:null,bias:new ie,trust:0,last:null,calib:null,motion:null}),o?(l.motion??=new tC,l.motion.update(o.pts,e.w,e.h,s)):h||l.motion?.relax(s),u?.geo&&Ue.mesh){const m=l.calib??=new K6;m.update(u.geo,s),Object.assign(u,m.express(u.geo,u))}{const m=[...d.eyes,d.mouth],M=[...l.eyes,l.mouth];let x=0,_=0;m.forEach((b,S)=>{x+=b.x-M[S].x,_+=b.y-M[S].y}),x/=m.length,_/=m.length;for(const b of M)b.x+=x,b.y+=_}d.eyes.forEach((m,M)=>{const x=l.eyes[M];x.x=Ai(x.x,m.x,s,Ue.tauPlace),x.y=Ai(x.y,m.y,s,Ue.tauPlace),x.r=Ai(x.r,m.r,s,Ue.tauPlace*3)}),l.mouth.x=Ai(l.mouth.x,d.mouth.x,s,Ue.tauPlace),l.mouth.y=Ai(l.mouth.y,d.mouth.y,s,Ue.tauPlace),l.mouth.w=Ai(l.mouth.w,d.mouth.w,s,Ue.tauPlace*3);const v=f??Mo;for(const m of jC)l[m]=Ai(l[m],v[m],s,ZC(m));u?(l.probe?u.probe.forEach((m,M)=>{const x=l.probe[M];x.x=Ai(x.x,m.x,s,Ue.tauPlace),x.y=Ai(x.y,m.y,s,Ue.tauPlace)}):l.probe=u.probe.map(m=>({...m})),l.read=!0,l.seen=i,l.last={read:u,nose:{x:c.x,y:c.y},at:i}):!h&&i-l.seen>Ue.forgetMs&&(l.read=!1,l.probe=void 0),o?.rot?(l.turn?l.turn.slerp(o.rot,1-Math.exp(-s/Ue.tauTurn)):l.turn=o.rot.clone(),l.bias.slerp(l.turn.clone().multiply(p.clone().invert()),1-Math.exp(-s/Ue.tauBias)),l.trust=Ai(l.trust,1,s,Ue.tauTrust)):h||(l.trust=Ai(l.trust,0,s,Ue.tauTrust),l.bias.slerp(VC,1-Math.exp(-s/Ue.tauBiasRelax)));const g=l.bias.clone().multiply(p);l.head.copy(l.turn&&l.trust>.001?g.slerp(l.turn,l.trust):g),l.headW=l.trust}}const xs={people:2,model:"full",size:1,lens:.85,poseConf:.65,smoothing:.5,occlusion:!1,zoom:{},envLight:!0,shadows:!0,debug:!1,mode:"one",costume:"jimothy",scene:"costume",effect:"insitu",partyCostumes:"behind",music:!1,faces:!0,googly:!1,breath:!1,partyCast:"skeleton",pyramid:!0,cast:["jimothy","builder","skeleton","pumpkin","howler","violet","plume"],v:7},_x="costuma26.settings";function KC(){try{const n=JSON.parse(localStorage.getItem(_x)??"{}"),t=n.v??(Object.keys(n).length?1:xs.v),e={...xs,...n},i=e.partyCostumes;return i===!0?e.partyCostumes="on":i!=="behind"&&i!=="on"&&(e.partyCostumes="off"),t<2&&(e.effect="insitu",e.partyCostumes="behind",e.partyCast="skeleton"),t<3&&(e.model="full"),t<4&&(e.effect==="pyramid"&&(e.effect="insitu"),e.pyramid=!0),t<5&&(e.cast=[...xs.cast]),(!Array.isArray(e.cast)||!e.cast.length)&&(e.cast=[...xs.cast]),t<6&&(e.poseConf=xs.poseConf),e.poseConf>=.3&&e.poseConf<=.95||(e.poseConf=xs.poseConf),t<7&&(e.breath=!1),(!e.zoom||typeof e.zoom!="object")&&(e.zoom={}),e.smoothing>=0&&e.smoothing<=1||(e.smoothing=xs.smoothing),e.costume==="valkyrie"&&(e.costume="violet"),e.partyCast==="valkyrie"&&(e.partyCast="violet"),e.v=xs.v,e}catch{return{...xs}}}function QC(n){try{localStorage.setItem(_x,JSON.stringify(n))}catch{}}const Zo=n=>`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${n}</svg>`,ys={qr:Zo('<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><path d="M14 14h3v3h-3zM20 14v.01M14 20h.01M17 20h4v-3"/>'),flip:Zo('<path d="M4 7h3l2-3h6l2 3h3a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1z"/><path d="M9 13a3 3 0 0 1 5-2.2M15 13a3 3 0 0 1-5 2.2"/><path d="M14 9v2h-2M10 17v-2h2"/>'),gear:Zo('<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/>'),camera:Zo('<path d="M4 8h3l2-3h6l2 3h3a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1z"/><circle cx="12" cy="13" r="3.5"/>'),googly:'<svg viewBox="0 0 24 24"><circle cx="7.5" cy="12" r="5.5" fill="#fff" stroke="currentColor" stroke-width="1.5"/><circle cx="16.5" cy="12" r="5.5" fill="#fff" stroke="currentColor" stroke-width="1.5"/><circle cx="6.5" cy="14.2" r="2.4" fill="#111"/><circle cx="17.8" cy="13.6" r="2.4" fill="#111"/></svg>',pyramid:Zo('<circle cx="12" cy="5" r="2"/><circle cx="8" cy="12" r="2"/><circle cx="16" cy="12" r="2"/><circle cx="4" cy="19" r="2"/><circle cx="12" cy="19" r="2"/><circle cx="20" cy="19" r="2"/>'),rec:'<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="7" fill="currentColor"/></svg>',stop:'<svg viewBox="0 0 24 24"><rect x="6" y="6" width="12" height="12" rx="2" fill="currentColor"/></svg>'};function tL(n){return n&&n.__esModule&&Object.prototype.hasOwnProperty.call(n,"default")?n.default:n}var fu={exports:{}},hg;function eL(){return hg||(hg=1,(function(n,t){var e=(function(){var i=function(b,S){var T=236,A=17,w=b,y=r[S],E=null,R=0,L=null,I=[],N={},B=function(z,W){R=w*4+17,E=(function(G){for(var tt=new Array(G),ot=0;ot<G;ot+=1){tt[ot]=new Array(G);for(var F=0;F<G;F+=1)tt[ot][F]=null}return tt})(R),X(0,0),X(R-7,0),X(0,R-7),it(),Y(),vt(z,W),w>=7&&dt(z),L==null&&(L=Ft(w,y,I)),St(L,W)},X=function(z,W){for(var G=-1;G<=7;G+=1)if(!(z+G<=-1||R<=z+G))for(var tt=-1;tt<=7;tt+=1)W+tt<=-1||R<=W+tt||(0<=G&&G<=6&&(tt==0||tt==6)||0<=tt&&tt<=6&&(G==0||G==6)||2<=G&&G<=4&&2<=tt&&tt<=4?E[z+G][W+tt]=!0:E[z+G][W+tt]=!1)},H=function(){for(var z=0,W=0,G=0;G<8;G+=1){B(!0,G);var tt=o.getLostPoint(N);(G==0||z>tt)&&(z=tt,W=G)}return W},Y=function(){for(var z=8;z<R-8;z+=1)E[z][6]==null&&(E[z][6]=z%2==0);for(var W=8;W<R-8;W+=1)E[6][W]==null&&(E[6][W]=W%2==0)},it=function(){for(var z=o.getPatternPosition(w),W=0;W<z.length;W+=1)for(var G=0;G<z.length;G+=1){var tt=z[W],ot=z[G];if(E[tt][ot]==null)for(var F=-2;F<=2;F+=1)for(var et=-2;et<=2;et+=1)F==-2||F==2||et==-2||et==2||F==0&&et==0?E[tt+F][ot+et]=!0:E[tt+F][ot+et]=!1}},dt=function(z){for(var W=o.getBCHTypeNumber(w),G=0;G<18;G+=1){var tt=!z&&(W>>G&1)==1;E[Math.floor(G/3)][G%3+R-8-3]=tt}for(var G=0;G<18;G+=1){var tt=!z&&(W>>G&1)==1;E[G%3+R-8-3][Math.floor(G/3)]=tt}},vt=function(z,W){for(var G=y<<3|W,tt=o.getBCHTypeInfo(G),ot=0;ot<15;ot+=1){var F=!z&&(tt>>ot&1)==1;ot<6?E[ot][8]=F:ot<8?E[ot+1][8]=F:E[R-15+ot][8]=F}for(var ot=0;ot<15;ot+=1){var F=!z&&(tt>>ot&1)==1;ot<8?E[8][R-ot-1]=F:ot<9?E[8][15-ot-1+1]=F:E[8][15-ot-1]=F}E[R-8][8]=!z},St=function(z,W){for(var G=-1,tt=R-1,ot=7,F=0,et=o.getMaskFunction(W),Q=R-1;Q>0;Q-=2)for(Q==6&&(Q-=1);;){for(var rt=0;rt<2;rt+=1)if(E[tt][Q-rt]==null){var ut=!1;F<z.length&&(ut=(z[F]>>>ot&1)==1);var mt=et(tt,Q-rt);mt&&(ut=!ut),E[tt][Q-rt]=ut,ot-=1,ot==-1&&(F+=1,ot=7)}if(tt+=G,tt<0||R<=tt){tt-=G,G=-G;break}}},Ct=function(z,W){for(var G=0,tt=0,ot=0,F=new Array(W.length),et=new Array(W.length),Q=0;Q<W.length;Q+=1){var rt=W[Q].dataCount,ut=W[Q].totalCount-rt;tt=Math.max(tt,rt),ot=Math.max(ot,ut),F[Q]=new Array(rt);for(var mt=0;mt<F[Q].length;mt+=1)F[Q][mt]=255&z.getBuffer()[mt+G];G+=rt;var Mt=o.getErrorCorrectPolynomial(ut),wt=l(F[Q],Mt.getLength()-1),ee=wt.mod(Mt);et[Q]=new Array(Mt.getLength()-1);for(var mt=0;mt<et[Q].length;mt+=1){var Kt=mt+ee.getLength()-et[Q].length;et[Q][mt]=Kt>=0?ee.getAt(Kt):0}}for(var k=0,mt=0;mt<W.length;mt+=1)k+=W[mt].totalCount;for(var P=new Array(k),J=0,mt=0;mt<tt;mt+=1)for(var Q=0;Q<W.length;Q+=1)mt<F[Q].length&&(P[J]=F[Q][mt],J+=1);for(var mt=0;mt<ot;mt+=1)for(var Q=0;Q<W.length;Q+=1)mt<et[Q].length&&(P[J]=et[Q][mt],J+=1);return P},Ft=function(z,W,G){for(var tt=u.getRSBlocks(z,W),ot=h(),F=0;F<G.length;F+=1){var et=G[F];ot.put(et.getMode(),4),ot.put(et.getLength(),o.getLengthInBits(et.getMode(),z)),et.write(ot)}for(var Q=0,F=0;F<tt.length;F+=1)Q+=tt[F].dataCount;if(ot.getLengthInBits()>Q*8)throw"code length overflow. ("+ot.getLengthInBits()+">"+Q*8+")";for(ot.getLengthInBits()+4<=Q*8&&ot.put(0,4);ot.getLengthInBits()%8!=0;)ot.putBit(!1);for(;!(ot.getLengthInBits()>=Q*8||(ot.put(T,8),ot.getLengthInBits()>=Q*8));)ot.put(A,8);return Ct(ot,tt)};N.addData=function(z,W){W=W||"Byte";var G=null;switch(W){case"Numeric":G=f(z);break;case"Alphanumeric":G=d(z);break;case"Byte":G=p(z);break;case"Kanji":G=v(z);break;default:throw"mode:"+W}I.push(G),L=null},N.isDark=function(z,W){if(z<0||R<=z||W<0||R<=W)throw z+","+W;return E[z][W]},N.getModuleCount=function(){return R},N.make=function(){if(w<1){for(var z=1;z<40;z++){for(var W=u.getRSBlocks(z,y),G=h(),tt=0;tt<I.length;tt++){var ot=I[tt];G.put(ot.getMode(),4),G.put(ot.getLength(),o.getLengthInBits(ot.getMode(),z)),ot.write(G)}for(var F=0,tt=0;tt<W.length;tt++)F+=W[tt].dataCount;if(G.getLengthInBits()<=F*8)break}w=z}B(!1,H())},N.createTableTag=function(z,W){z=z||2,W=typeof W>"u"?z*4:W;var G="";G+='<table style="',G+=" border-width: 0px; border-style: none;",G+=" border-collapse: collapse;",G+=" padding: 0px; margin: "+W+"px;",G+='">',G+="<tbody>";for(var tt=0;tt<N.getModuleCount();tt+=1){G+="<tr>";for(var ot=0;ot<N.getModuleCount();ot+=1)G+='<td style="',G+=" border-width: 0px; border-style: none;",G+=" border-collapse: collapse;",G+=" padding: 0px; margin: 0px;",G+=" width: "+z+"px;",G+=" height: "+z+"px;",G+=" background-color: ",G+=N.isDark(tt,ot)?"#000000":"#ffffff",G+=";",G+='"/>';G+="</tr>"}return G+="</tbody>",G+="</table>",G},N.createSvgTag=function(z,W,G,tt){var ot={};typeof arguments[0]=="object"&&(ot=arguments[0],z=ot.cellSize,W=ot.margin,G=ot.alt,tt=ot.title),z=z||2,W=typeof W>"u"?z*4:W,G=typeof G=="string"?{text:G}:G||{},G.text=G.text||null,G.id=G.text?G.id||"qrcode-description":null,tt=typeof tt=="string"?{text:tt}:tt||{},tt.text=tt.text||null,tt.id=tt.text?tt.id||"qrcode-title":null;var F=N.getModuleCount()*z+W*2,et,Q,rt,ut,mt="",Mt;for(Mt="l"+z+",0 0,"+z+" -"+z+",0 0,-"+z+"z ",mt+='<svg version="1.1" xmlns="http://www.w3.org/2000/svg"',mt+=ot.scalable?"":' width="'+F+'px" height="'+F+'px"',mt+=' viewBox="0 0 '+F+" "+F+'" ',mt+=' preserveAspectRatio="xMinYMin meet"',mt+=tt.text||G.text?' role="img" aria-labelledby="'+V([tt.id,G.id].join(" ").trim())+'"':"",mt+=">",mt+=tt.text?'<title id="'+V(tt.id)+'">'+V(tt.text)+"</title>":"",mt+=G.text?'<description id="'+V(G.id)+'">'+V(G.text)+"</description>":"",mt+='<rect width="100%" height="100%" fill="white" cx="0" cy="0"/>',mt+='<path d="',rt=0;rt<N.getModuleCount();rt+=1)for(ut=rt*z+W,et=0;et<N.getModuleCount();et+=1)N.isDark(rt,et)&&(Q=et*z+W,mt+="M"+Q+","+ut+Mt);return mt+='" stroke="transparent" fill="black"/>',mt+="</svg>",mt},N.createDataURL=function(z,W){z=z||2,W=typeof W>"u"?z*4:W;var G=N.getModuleCount()*z+W*2,tt=W,ot=G-W;return _(G,G,function(F,et){if(tt<=F&&F<ot&&tt<=et&&et<ot){var Q=Math.floor((F-tt)/z),rt=Math.floor((et-tt)/z);return N.isDark(rt,Q)?0:1}else return 1})},N.createImgTag=function(z,W,G){z=z||2,W=typeof W>"u"?z*4:W;var tt=N.getModuleCount()*z+W*2,ot="";return ot+="<img",ot+=' src="',ot+=N.createDataURL(z,W),ot+='"',ot+=' width="',ot+=tt,ot+='"',ot+=' height="',ot+=tt,ot+='"',G&&(ot+=' alt="',ot+=V(G),ot+='"'),ot+="/>",ot};var V=function(z){for(var W="",G=0;G<z.length;G+=1){var tt=z.charAt(G);switch(tt){case"<":W+="&lt;";break;case">":W+="&gt;";break;case"&":W+="&amp;";break;case'"':W+="&quot;";break;default:W+=tt;break}}return W},$=function(z){var W=1;z=typeof z>"u"?W*2:z;var G=N.getModuleCount()*W+z*2,tt=z,ot=G-z,F,et,Q,rt,ut,mt={"██":"█","█ ":"▀"," █":"▄","  ":" "},Mt={"██":"▀","█ ":"▀"," █":" ","  ":" "},wt="";for(F=0;F<G;F+=2){for(Q=Math.floor((F-tt)/W),rt=Math.floor((F+1-tt)/W),et=0;et<G;et+=1)ut="█",tt<=et&&et<ot&&tt<=F&&F<ot&&N.isDark(Q,Math.floor((et-tt)/W))&&(ut=" "),tt<=et&&et<ot&&tt<=F+1&&F+1<ot&&N.isDark(rt,Math.floor((et-tt)/W))?ut+=" ":ut+="█",wt+=z<1&&F+1>=ot?Mt[ut]:mt[ut];wt+=`
`}return G%2&&z>0?wt.substring(0,wt.length-G-1)+Array(G+1).join("▀"):wt.substring(0,wt.length-1)};return N.createASCII=function(z,W){if(z=z||1,z<2)return $(W);z-=1,W=typeof W>"u"?z*2:W;var G=N.getModuleCount()*z+W*2,tt=W,ot=G-W,F,et,Q,rt,ut=Array(z+1).join("██"),mt=Array(z+1).join("  "),Mt="",wt="";for(F=0;F<G;F+=1){for(Q=Math.floor((F-tt)/z),wt="",et=0;et<G;et+=1)rt=1,tt<=et&&et<ot&&tt<=F&&F<ot&&N.isDark(Q,Math.floor((et-tt)/z))&&(rt=0),wt+=rt?ut:mt;for(Q=0;Q<z;Q+=1)Mt+=wt+`
`}return Mt.substring(0,Mt.length-1)},N.renderTo2dContext=function(z,W){W=W||2;for(var G=N.getModuleCount(),tt=0;tt<G;tt++)for(var ot=0;ot<G;ot++)z.fillStyle=N.isDark(tt,ot)?"black":"white",z.fillRect(tt*W,ot*W,W,W)},N};i.stringToBytesFuncs={default:function(b){for(var S=[],T=0;T<b.length;T+=1){var A=b.charCodeAt(T);S.push(A&255)}return S}},i.stringToBytes=i.stringToBytesFuncs.default,i.createStringToBytes=function(b,S){var T=(function(){for(var w=M(b),y=function(){var Y=w.read();if(Y==-1)throw"eof";return Y},E=0,R={};;){var L=w.read();if(L==-1)break;var I=y(),N=y(),B=y(),X=String.fromCharCode(L<<8|I),H=N<<8|B;R[X]=H,E+=1}if(E!=S)throw E+" != "+S;return R})(),A=63;return function(w){for(var y=[],E=0;E<w.length;E+=1){var R=w.charCodeAt(E);if(R<128)y.push(R);else{var L=T[w.charAt(E)];typeof L=="number"?(L&255)==L?y.push(L):(y.push(L>>>8),y.push(L&255)):y.push(A)}}return y}};var s={MODE_NUMBER:1,MODE_ALPHA_NUM:2,MODE_8BIT_BYTE:4,MODE_KANJI:8},r={L:1,M:0,Q:3,H:2},a={PATTERN000:0,PATTERN001:1,PATTERN010:2,PATTERN011:3,PATTERN100:4,PATTERN101:5,PATTERN110:6,PATTERN111:7},o=(function(){var b=[[],[6,18],[6,22],[6,26],[6,30],[6,34],[6,22,38],[6,24,42],[6,26,46],[6,28,50],[6,30,54],[6,32,58],[6,34,62],[6,26,46,66],[6,26,48,70],[6,26,50,74],[6,30,54,78],[6,30,56,82],[6,30,58,86],[6,34,62,90],[6,28,50,72,94],[6,26,50,74,98],[6,30,54,78,102],[6,28,54,80,106],[6,32,58,84,110],[6,30,58,86,114],[6,34,62,90,118],[6,26,50,74,98,122],[6,30,54,78,102,126],[6,26,52,78,104,130],[6,30,56,82,108,134],[6,34,60,86,112,138],[6,30,58,86,114,142],[6,34,62,90,118,146],[6,30,54,78,102,126,150],[6,24,50,76,102,128,154],[6,28,54,80,106,132,158],[6,32,58,84,110,136,162],[6,26,54,82,110,138,166],[6,30,58,86,114,142,170]],S=1335,T=7973,A=21522,w={},y=function(E){for(var R=0;E!=0;)R+=1,E>>>=1;return R};return w.getBCHTypeInfo=function(E){for(var R=E<<10;y(R)-y(S)>=0;)R^=S<<y(R)-y(S);return(E<<10|R)^A},w.getBCHTypeNumber=function(E){for(var R=E<<12;y(R)-y(T)>=0;)R^=T<<y(R)-y(T);return E<<12|R},w.getPatternPosition=function(E){return b[E-1]},w.getMaskFunction=function(E){switch(E){case a.PATTERN000:return function(R,L){return(R+L)%2==0};case a.PATTERN001:return function(R,L){return R%2==0};case a.PATTERN010:return function(R,L){return L%3==0};case a.PATTERN011:return function(R,L){return(R+L)%3==0};case a.PATTERN100:return function(R,L){return(Math.floor(R/2)+Math.floor(L/3))%2==0};case a.PATTERN101:return function(R,L){return R*L%2+R*L%3==0};case a.PATTERN110:return function(R,L){return(R*L%2+R*L%3)%2==0};case a.PATTERN111:return function(R,L){return(R*L%3+(R+L)%2)%2==0};default:throw"bad maskPattern:"+E}},w.getErrorCorrectPolynomial=function(E){for(var R=l([1],0),L=0;L<E;L+=1)R=R.multiply(l([1,c.gexp(L)],0));return R},w.getLengthInBits=function(E,R){if(1<=R&&R<10)switch(E){case s.MODE_NUMBER:return 10;case s.MODE_ALPHA_NUM:return 9;case s.MODE_8BIT_BYTE:return 8;case s.MODE_KANJI:return 8;default:throw"mode:"+E}else if(R<27)switch(E){case s.MODE_NUMBER:return 12;case s.MODE_ALPHA_NUM:return 11;case s.MODE_8BIT_BYTE:return 16;case s.MODE_KANJI:return 10;default:throw"mode:"+E}else if(R<41)switch(E){case s.MODE_NUMBER:return 14;case s.MODE_ALPHA_NUM:return 13;case s.MODE_8BIT_BYTE:return 16;case s.MODE_KANJI:return 12;default:throw"mode:"+E}else throw"type:"+R},w.getLostPoint=function(E){for(var R=E.getModuleCount(),L=0,I=0;I<R;I+=1)for(var N=0;N<R;N+=1){for(var B=0,X=E.isDark(I,N),H=-1;H<=1;H+=1)if(!(I+H<0||R<=I+H))for(var Y=-1;Y<=1;Y+=1)N+Y<0||R<=N+Y||H==0&&Y==0||X==E.isDark(I+H,N+Y)&&(B+=1);B>5&&(L+=3+B-5)}for(var I=0;I<R-1;I+=1)for(var N=0;N<R-1;N+=1){var it=0;E.isDark(I,N)&&(it+=1),E.isDark(I+1,N)&&(it+=1),E.isDark(I,N+1)&&(it+=1),E.isDark(I+1,N+1)&&(it+=1),(it==0||it==4)&&(L+=3)}for(var I=0;I<R;I+=1)for(var N=0;N<R-6;N+=1)E.isDark(I,N)&&!E.isDark(I,N+1)&&E.isDark(I,N+2)&&E.isDark(I,N+3)&&E.isDark(I,N+4)&&!E.isDark(I,N+5)&&E.isDark(I,N+6)&&(L+=40);for(var N=0;N<R;N+=1)for(var I=0;I<R-6;I+=1)E.isDark(I,N)&&!E.isDark(I+1,N)&&E.isDark(I+2,N)&&E.isDark(I+3,N)&&E.isDark(I+4,N)&&!E.isDark(I+5,N)&&E.isDark(I+6,N)&&(L+=40);for(var dt=0,N=0;N<R;N+=1)for(var I=0;I<R;I+=1)E.isDark(I,N)&&(dt+=1);var vt=Math.abs(100*dt/R/R-50)/5;return L+=vt*10,L},w})(),c=(function(){for(var b=new Array(256),S=new Array(256),T=0;T<8;T+=1)b[T]=1<<T;for(var T=8;T<256;T+=1)b[T]=b[T-4]^b[T-5]^b[T-6]^b[T-8];for(var T=0;T<255;T+=1)S[b[T]]=T;var A={};return A.glog=function(w){if(w<1)throw"glog("+w+")";return S[w]},A.gexp=function(w){for(;w<0;)w+=255;for(;w>=256;)w-=255;return b[w]},A})();function l(b,S){if(typeof b.length>"u")throw b.length+"/"+S;var T=(function(){for(var w=0;w<b.length&&b[w]==0;)w+=1;for(var y=new Array(b.length-w+S),E=0;E<b.length-w;E+=1)y[E]=b[E+w];return y})(),A={};return A.getAt=function(w){return T[w]},A.getLength=function(){return T.length},A.multiply=function(w){for(var y=new Array(A.getLength()+w.getLength()-1),E=0;E<A.getLength();E+=1)for(var R=0;R<w.getLength();R+=1)y[E+R]^=c.gexp(c.glog(A.getAt(E))+c.glog(w.getAt(R)));return l(y,0)},A.mod=function(w){if(A.getLength()-w.getLength()<0)return A;for(var y=c.glog(A.getAt(0))-c.glog(w.getAt(0)),E=new Array(A.getLength()),R=0;R<A.getLength();R+=1)E[R]=A.getAt(R);for(var R=0;R<w.getLength();R+=1)E[R]^=c.gexp(c.glog(w.getAt(R))+y);return l(E,0).mod(w)},A}var u=(function(){var b=[[1,26,19],[1,26,16],[1,26,13],[1,26,9],[1,44,34],[1,44,28],[1,44,22],[1,44,16],[1,70,55],[1,70,44],[2,35,17],[2,35,13],[1,100,80],[2,50,32],[2,50,24],[4,25,9],[1,134,108],[2,67,43],[2,33,15,2,34,16],[2,33,11,2,34,12],[2,86,68],[4,43,27],[4,43,19],[4,43,15],[2,98,78],[4,49,31],[2,32,14,4,33,15],[4,39,13,1,40,14],[2,121,97],[2,60,38,2,61,39],[4,40,18,2,41,19],[4,40,14,2,41,15],[2,146,116],[3,58,36,2,59,37],[4,36,16,4,37,17],[4,36,12,4,37,13],[2,86,68,2,87,69],[4,69,43,1,70,44],[6,43,19,2,44,20],[6,43,15,2,44,16],[4,101,81],[1,80,50,4,81,51],[4,50,22,4,51,23],[3,36,12,8,37,13],[2,116,92,2,117,93],[6,58,36,2,59,37],[4,46,20,6,47,21],[7,42,14,4,43,15],[4,133,107],[8,59,37,1,60,38],[8,44,20,4,45,21],[12,33,11,4,34,12],[3,145,115,1,146,116],[4,64,40,5,65,41],[11,36,16,5,37,17],[11,36,12,5,37,13],[5,109,87,1,110,88],[5,65,41,5,66,42],[5,54,24,7,55,25],[11,36,12,7,37,13],[5,122,98,1,123,99],[7,73,45,3,74,46],[15,43,19,2,44,20],[3,45,15,13,46,16],[1,135,107,5,136,108],[10,74,46,1,75,47],[1,50,22,15,51,23],[2,42,14,17,43,15],[5,150,120,1,151,121],[9,69,43,4,70,44],[17,50,22,1,51,23],[2,42,14,19,43,15],[3,141,113,4,142,114],[3,70,44,11,71,45],[17,47,21,4,48,22],[9,39,13,16,40,14],[3,135,107,5,136,108],[3,67,41,13,68,42],[15,54,24,5,55,25],[15,43,15,10,44,16],[4,144,116,4,145,117],[17,68,42],[17,50,22,6,51,23],[19,46,16,6,47,17],[2,139,111,7,140,112],[17,74,46],[7,54,24,16,55,25],[34,37,13],[4,151,121,5,152,122],[4,75,47,14,76,48],[11,54,24,14,55,25],[16,45,15,14,46,16],[6,147,117,4,148,118],[6,73,45,14,74,46],[11,54,24,16,55,25],[30,46,16,2,47,17],[8,132,106,4,133,107],[8,75,47,13,76,48],[7,54,24,22,55,25],[22,45,15,13,46,16],[10,142,114,2,143,115],[19,74,46,4,75,47],[28,50,22,6,51,23],[33,46,16,4,47,17],[8,152,122,4,153,123],[22,73,45,3,74,46],[8,53,23,26,54,24],[12,45,15,28,46,16],[3,147,117,10,148,118],[3,73,45,23,74,46],[4,54,24,31,55,25],[11,45,15,31,46,16],[7,146,116,7,147,117],[21,73,45,7,74,46],[1,53,23,37,54,24],[19,45,15,26,46,16],[5,145,115,10,146,116],[19,75,47,10,76,48],[15,54,24,25,55,25],[23,45,15,25,46,16],[13,145,115,3,146,116],[2,74,46,29,75,47],[42,54,24,1,55,25],[23,45,15,28,46,16],[17,145,115],[10,74,46,23,75,47],[10,54,24,35,55,25],[19,45,15,35,46,16],[17,145,115,1,146,116],[14,74,46,21,75,47],[29,54,24,19,55,25],[11,45,15,46,46,16],[13,145,115,6,146,116],[14,74,46,23,75,47],[44,54,24,7,55,25],[59,46,16,1,47,17],[12,151,121,7,152,122],[12,75,47,26,76,48],[39,54,24,14,55,25],[22,45,15,41,46,16],[6,151,121,14,152,122],[6,75,47,34,76,48],[46,54,24,10,55,25],[2,45,15,64,46,16],[17,152,122,4,153,123],[29,74,46,14,75,47],[49,54,24,10,55,25],[24,45,15,46,46,16],[4,152,122,18,153,123],[13,74,46,32,75,47],[48,54,24,14,55,25],[42,45,15,32,46,16],[20,147,117,4,148,118],[40,75,47,7,76,48],[43,54,24,22,55,25],[10,45,15,67,46,16],[19,148,118,6,149,119],[18,75,47,31,76,48],[34,54,24,34,55,25],[20,45,15,61,46,16]],S=function(w,y){var E={};return E.totalCount=w,E.dataCount=y,E},T={},A=function(w,y){switch(y){case r.L:return b[(w-1)*4+0];case r.M:return b[(w-1)*4+1];case r.Q:return b[(w-1)*4+2];case r.H:return b[(w-1)*4+3];default:return}};return T.getRSBlocks=function(w,y){var E=A(w,y);if(typeof E>"u")throw"bad rs block @ typeNumber:"+w+"/errorCorrectionLevel:"+y;for(var R=E.length/3,L=[],I=0;I<R;I+=1)for(var N=E[I*3+0],B=E[I*3+1],X=E[I*3+2],H=0;H<N;H+=1)L.push(S(B,X));return L},T})(),h=function(){var b=[],S=0,T={};return T.getBuffer=function(){return b},T.getAt=function(A){var w=Math.floor(A/8);return(b[w]>>>7-A%8&1)==1},T.put=function(A,w){for(var y=0;y<w;y+=1)T.putBit((A>>>w-y-1&1)==1)},T.getLengthInBits=function(){return S},T.putBit=function(A){var w=Math.floor(S/8);b.length<=w&&b.push(0),A&&(b[w]|=128>>>S%8),S+=1},T},f=function(b){var S=s.MODE_NUMBER,T=b,A={};A.getMode=function(){return S},A.getLength=function(E){return T.length},A.write=function(E){for(var R=T,L=0;L+2<R.length;)E.put(w(R.substring(L,L+3)),10),L+=3;L<R.length&&(R.length-L==1?E.put(w(R.substring(L,L+1)),4):R.length-L==2&&E.put(w(R.substring(L,L+2)),7))};var w=function(E){for(var R=0,L=0;L<E.length;L+=1)R=R*10+y(E.charAt(L));return R},y=function(E){if("0"<=E&&E<="9")return E.charCodeAt(0)-48;throw"illegal char :"+E};return A},d=function(b){var S=s.MODE_ALPHA_NUM,T=b,A={};A.getMode=function(){return S},A.getLength=function(y){return T.length},A.write=function(y){for(var E=T,R=0;R+1<E.length;)y.put(w(E.charAt(R))*45+w(E.charAt(R+1)),11),R+=2;R<E.length&&y.put(w(E.charAt(R)),6)};var w=function(y){if("0"<=y&&y<="9")return y.charCodeAt(0)-48;if("A"<=y&&y<="Z")return y.charCodeAt(0)-65+10;switch(y){case" ":return 36;case"$":return 37;case"%":return 38;case"*":return 39;case"+":return 40;case"-":return 41;case".":return 42;case"/":return 43;case":":return 44;default:throw"illegal char :"+y}};return A},p=function(b){var S=s.MODE_8BIT_BYTE,T=i.stringToBytes(b),A={};return A.getMode=function(){return S},A.getLength=function(w){return T.length},A.write=function(w){for(var y=0;y<T.length;y+=1)w.put(T[y],8)},A},v=function(b){var S=s.MODE_KANJI,T=i.stringToBytesFuncs.SJIS;if(!T)throw"sjis not supported.";(function(y,E){var R=T(y);if(R.length!=2||(R[0]<<8|R[1])!=E)throw"sjis not supported."})("友",38726);var A=T(b),w={};return w.getMode=function(){return S},w.getLength=function(y){return~~(A.length/2)},w.write=function(y){for(var E=A,R=0;R+1<E.length;){var L=(255&E[R])<<8|255&E[R+1];if(33088<=L&&L<=40956)L-=33088;else if(57408<=L&&L<=60351)L-=49472;else throw"illegal char at "+(R+1)+"/"+L;L=(L>>>8&255)*192+(L&255),y.put(L,13),R+=2}if(R<E.length)throw"illegal char at "+(R+1)},w},g=function(){var b=[],S={};return S.writeByte=function(T){b.push(T&255)},S.writeShort=function(T){S.writeByte(T),S.writeByte(T>>>8)},S.writeBytes=function(T,A,w){A=A||0,w=w||T.length;for(var y=0;y<w;y+=1)S.writeByte(T[y+A])},S.writeString=function(T){for(var A=0;A<T.length;A+=1)S.writeByte(T.charCodeAt(A))},S.toByteArray=function(){return b},S.toString=function(){var T="";T+="[";for(var A=0;A<b.length;A+=1)A>0&&(T+=","),T+=b[A];return T+="]",T},S},m=function(){var b=0,S=0,T=0,A="",w={},y=function(R){A+=String.fromCharCode(E(R&63))},E=function(R){if(!(R<0)){if(R<26)return 65+R;if(R<52)return 97+(R-26);if(R<62)return 48+(R-52);if(R==62)return 43;if(R==63)return 47}throw"n:"+R};return w.writeByte=function(R){for(b=b<<8|R&255,S+=8,T+=1;S>=6;)y(b>>>S-6),S-=6},w.flush=function(){if(S>0&&(y(b<<6-S),b=0,S=0),T%3!=0)for(var R=3-T%3,L=0;L<R;L+=1)A+="="},w.toString=function(){return A},w},M=function(b){var S=b,T=0,A=0,w=0,y={};y.read=function(){for(;w<8;){if(T>=S.length){if(w==0)return-1;throw"unexpected end of file./"+w}var R=S.charAt(T);if(T+=1,R=="=")return w=0,-1;if(R.match(/^\s$/))continue;A=A<<6|E(R.charCodeAt(0)),w+=6}var L=A>>>w-8&255;return w-=8,L};var E=function(R){if(65<=R&&R<=90)return R-65;if(97<=R&&R<=122)return R-97+26;if(48<=R&&R<=57)return R-48+52;if(R==43)return 62;if(R==47)return 63;throw"c:"+R};return y},x=function(b,S){var T=b,A=S,w=new Array(b*S),y={};y.setPixel=function(I,N,B){w[N*T+I]=B},y.write=function(I){I.writeString("GIF87a"),I.writeShort(T),I.writeShort(A),I.writeByte(128),I.writeByte(0),I.writeByte(0),I.writeByte(0),I.writeByte(0),I.writeByte(0),I.writeByte(255),I.writeByte(255),I.writeByte(255),I.writeString(","),I.writeShort(0),I.writeShort(0),I.writeShort(T),I.writeShort(A),I.writeByte(0);var N=2,B=R(N);I.writeByte(N);for(var X=0;B.length-X>255;)I.writeByte(255),I.writeBytes(B,X,255),X+=255;I.writeByte(B.length-X),I.writeBytes(B,X,B.length-X),I.writeByte(0),I.writeString(";")};var E=function(I){var N=I,B=0,X=0,H={};return H.write=function(Y,it){if(Y>>>it)throw"length over";for(;B+it>=8;)N.writeByte(255&(Y<<B|X)),it-=8-B,Y>>>=8-B,X=0,B=0;X=Y<<B|X,B=B+it},H.flush=function(){B>0&&N.writeByte(X)},H},R=function(I){for(var N=1<<I,B=(1<<I)+1,X=I+1,H=L(),Y=0;Y<N;Y+=1)H.add(String.fromCharCode(Y));H.add(String.fromCharCode(N)),H.add(String.fromCharCode(B));var it=g(),dt=E(it);dt.write(N,X);var vt=0,St=String.fromCharCode(w[vt]);for(vt+=1;vt<w.length;){var Ct=String.fromCharCode(w[vt]);vt+=1,H.contains(St+Ct)?St=St+Ct:(dt.write(H.indexOf(St),X),H.size()<4095&&(H.size()==1<<X&&(X+=1),H.add(St+Ct)),St=Ct)}return dt.write(H.indexOf(St),X),dt.write(B,X),dt.flush(),it.toByteArray()},L=function(){var I={},N=0,B={};return B.add=function(X){if(B.contains(X))throw"dup key:"+X;I[X]=N,N+=1},B.size=function(){return N},B.indexOf=function(X){return I[X]},B.contains=function(X){return typeof I[X]<"u"},B};return y},_=function(b,S,T){for(var A=x(b,S),w=0;w<S;w+=1)for(var y=0;y<b;y+=1)A.setPixel(y,w,T(y,w));var E=g();A.write(E);for(var R=m(),L=E.toByteArray(),I=0;I<L.length;I+=1)R.writeByte(L[I]);return R.flush(),"data:image/gif;base64,"+R};return i})();(function(){e.stringToBytesFuncs["UTF-8"]=function(i){function s(r){for(var a=[],o=0;o<r.length;o++){var c=r.charCodeAt(o);c<128?a.push(c):c<2048?a.push(192|c>>6,128|c&63):c<55296||c>=57344?a.push(224|c>>12,128|c>>6&63,128|c&63):(o++,c=65536+((c&1023)<<10|r.charCodeAt(o)&1023),a.push(240|c>>18,128|c>>12&63,128|c>>6&63,128|c&63))}return a}return s(i)}})(),(function(i){n.exports=i()})(function(){return e})})(fu)),fu.exports}var nL=eL();const iL=tL(nL);function fc(){return location.origin+location.pathname.replace(/index\.html$/,"")}function sL(n){const t=iL(0,"M");return t.addData(n),t.make(),t.createSvgTag({cellSize:8,margin:2,scalable:!0})}const wx=(n,t)=>new File([n],t,{type:n.type});function Yd(n,t){const e=navigator;try{return!!e.canShare?.({files:[wx(n,t)]})}catch{return!1}}async function bx(n,t,e=!0){if(Yd(n,t))try{return await navigator.share({files:[wx(n,t)]}),"shared"}catch(i){if(i.name==="AbortError")return"cancelled";if(!e)return"refused"}else if(!e)return"refused";return yx(n,t),"saved"}function yx(n,t){const e=document.createElement("a");e.href=URL.createObjectURL(n),e.download=t,document.body.appendChild(e),e.click(),e.remove(),setTimeout(()=>URL.revokeObjectURL(e.href),3e4)}function rL(){const n=window.MediaRecorder;if(n)return["video/mp4;codecs=avc1","video/mp4","video/webm;codecs=vp9","video/webm;codecs=vp8","video/webm"].find(t=>n.isTypeSupported(t))}const jt=n=>document.getElementById(n),aL="./",Be=new URLSearchParams(location.search),jd=Be.get("test")==="1",An=Number(Be.get("synth")??0),st=KC();f2(st.smoothing);Be.get("c")&&(st.costume=Be.get("c"));os.some(n=>n.id===st.costume)||(st.costume=os[0].id);Be.get("people")&&(st.people=Number(Be.get("people")));const On=()=>QC(st),ke=jt("video"),Pc=jt("stage"),Na=jt("overlay"),Ce=Na.getContext("2d"),Ut=new IC(Pc);Ut.opts.size=st.size;Ut.opts.shadows=st.shadows;Ut.opts.envLight=st.envLight;const Sn=new BC(Ut.bgUniforms,Mx);Ut.cloneCast=(n,t)=>st.scene==="party"&&st.partyCast==="mix"?Rh(Zd(n)+1+t+Dc):n;const tr=new HC,Sx=new zC;let bo=null,du=-1;(Be.get("scene")==="party"||Be.get("scene")==="costume")&&(st.scene=Be.get("scene"));Be.get("fx")&&(st.effect=Be.get("fx"));Be.get("googly")&&(st.googly=Be.get("googly")==="1");Be.get("pc")&&(st.partyCostumes=Be.get("pc")==="behind"?"behind":Be.get("pc")==="1"||Be.get("pc")==="on"?"on":"off");Sn.preset=Ls.find(n=>n.id===st.effect)??Ls[0];const Ve=new Hx(ke,Be.get("facing")??void 0);let wi=null;const Ye=new lS;let Ao=!1;const Ro=new Map,As=new Map;let Ic=0,Dc=0;function ta(){const n=os.filter(t=>st.cast.includes(t.id));return n.length?n:os.filter(t=>kf.includes(t.id))}const Rh=n=>{const t=ta();return t[(n%t.length+t.length)%t.length].id},Zd=n=>Math.max(0,ta().findIndex(t=>t.id===n));function Ch(n){const t=Ro.get(n);if(t)return t;if(st.scene==="party"){if(st.partyCast!=="mix")return os.some(s=>s.id===st.partyCast)?st.partyCast:"skeleton";let i=As.get(n);return i||(i=Rh(Dc+Ic++*3),As.set(n,i)),i}if(st.mode==="one")return st.costume;let e=As.get(n);return e||(e=Rh(Zd(st.costume)+Dc+Ic++),As.set(n,e)),e}const ug=new Set;function Co(n,t=!1){if(Ut.hasTemplate(n))return;const e=!ug.has(n);ug.add(n),!t&&e&&be(`Dressing up as ${as(n).name}…`,1800),(e||!t)&&Ut.prepare(n,!0).catch(i=>{console.error("build failed",n,i),be(`${as(n).name} failed to build`)})}let fg=0;function be(n,t=1400){const e=jt("toast");e.textContent=n,e.classList.add("on"),clearTimeout(fg),fg=window.setTimeout(()=>e.classList.remove("on"),t)}const oL=n=>{const t=jt("hint");t.textContent=n,t.classList.toggle("on",!!n)},Jd=n=>`${aL}thumbs/${n}.png`;function Kd(){const n=jt("picker");if(n.innerHTML="",st.scene==="party"){for(const i of Ls){const s=document.createElement("button");s.className="card fx",s.dataset.id=i.id,s.setAttribute("role","option"),s.innerHTML='<div class="thumb"></div><div class="name"></div>',s.querySelector(".thumb").style.background=i.swatch,s.querySelector(".name").textContent=i.name,s.onclick=()=>Qd(i.id),n.appendChild(s)}Uc();return}const t=(i,s,r="")=>{const a=document.createElement("button");a.className=`card ${r}`,a.dataset.id=i,a.setAttribute("role","option"),a.innerHTML='<div class="thumb"></div><div class="name"></div>',a.querySelector(".name").textContent=s;const o=a.querySelector(".thumb");if(i==="mix")o.textContent="MIX";else{const c=new Image;c.alt="",c.draggable=!1,c.onerror=()=>{c.remove(),o.textContent=s.slice(0,1)},c.src=Jd(i),o.appendChild(c)}a.onclick=()=>Ex(i),n.appendChild(a)};t("mix","Mix","mix");for(const i of ta())t(i.id,i.name);const e=document.createElement("button");e.className="card more",e.innerHTML='<div class="thumb">+</div><div class="name">More</div>',e.onclick=hL,n.appendChild(e),Uc()}function cL(n){let t=null,e=!1;n.addEventListener("pointerdown",s=>{t={x:s.clientX,left:n.scrollLeft,id:s.pointerId},e=!1}),n.addEventListener("dragstart",s=>s.preventDefault()),n.addEventListener("pointermove",s=>{if(!t||s.pointerId!==t.id)return;const r=s.clientX-t.x;!e&&Math.abs(r)>6&&(e=!0,n.classList.add("dragging")),e&&(n.scrollLeft=t.left-r)});const i=()=>{t=null,n.classList.remove("dragging")};n.addEventListener("pointerup",i),n.addEventListener("pointercancel",i),n.addEventListener("click",s=>{e&&(s.stopPropagation(),s.preventDefault(),e=!1)},!0),n.addEventListener("wheel",s=>{Math.abs(s.deltaY)<=Math.abs(s.deltaX)||(n.scrollLeft+=s.deltaY,s.preventDefault())},{passive:!1})}function Uc(){for(const n of jt("picker").querySelectorAll(".card")){const t=st.scene==="party"?n.dataset.id===st.effect:st.mode==="mix"?n.dataset.id==="mix":n.dataset.id===st.costume;if(n.classList.toggle("on",t),n.setAttribute("aria-selected",String(t)),t){const e=jt("picker");e.scrollTo({left:n.offsetLeft-(e.clientWidth-n.offsetWidth)/2,behavior:"smooth"})}}}function Ex(n){if(Ro.clear(),n==="mix"){const t=st.mode==="mix";st.mode="mix",t&&Dc++,As.clear(),Ic=0,be(t?"Shuffled":"Mix: everyone gets their own")}else st.mode="one",st.costume=n,Co(n),Ut.hasTemplate(n)&&be(as(n).name,900);On(),Uc()}const lL=()=>[...ta().map(n=>n.id),"mix"];function Qd(n){const t=Ls.find(e=>e.id===n)??Ls[0];if(st.effect===t.id&&Sn.preset.id===t.id){const e=lL(),i=e.indexOf(st.partyCast);st.partyCast=e[(i+1)%e.length],st.partyCast==="mix"&&Dc++,Ro.clear(),As.clear(),Ic=0,st.partyCast!=="mix"&&Co(st.partyCast),st.partyCostumes==="off"&&(st.partyCostumes="behind"),On(),be(st.partyCast==="mix"?"Dancers: a mix":`Dancers: ${as(st.partyCast).name}`,1e3);return}st.effect=t.id,Sn.preset=t,On(),Uc(),be(t.name,800)}function zf(n){const t=jt("dip");t.classList.add("on"),setTimeout(async()=>{try{await n()}finally{requestAnimationFrame(()=>requestAnimationFrame(()=>t.classList.remove("on")))}},190)}function Vf(n){st.scene=n,On(),Ut.setBackground(n==="party"?Sn.material:null),wi?.setOptions({masks:n==="party"}),jt("btn-pyramid").classList.toggle("hidden",n!=="party");for(const t of document.querySelectorAll(".modes button")){const e=t.dataset.scene===n;t.classList.toggle("on",e),t.setAttribute("aria-selected",String(e))}Kd()}function hL(){const n=jt("more-body");n.innerHTML="";const t=os.filter(i=>!kf.includes(i.id)),e=(i,s)=>{const r=document.createElement("h3");r.textContent=i,n.appendChild(r);const a=document.createElement("div");a.className="more-grid";for(const o of s){const c=document.createElement("button");c.className="more-card",c.innerHTML='<div class="thumb"></div><div class="name"></div><div class="tick"></div>';const l=new Image;l.alt="",l.draggable=!1,l.src=Jd(o.id),l.onerror=()=>l.remove(),c.querySelector(".thumb").appendChild(l),c.querySelector(".name").textContent=o.name;const u=()=>{const h=st.cast.includes(o.id);c.classList.toggle("on",h),c.querySelector(".tick").textContent=h?"✓":"✕",c.setAttribute("aria-pressed",String(h))};u(),c.onclick=()=>{const h=st.cast.includes(o.id);if(h&&st.cast.length<=1){be("Keep at least one");return}st.cast=h?st.cast.filter(f=>f!==o.id):[...st.cast,o.id],h||Co(o.id,!0),As.clear(),Ic=0,On(),u(),Kd()},a.appendChild(c)}n.appendChild(a)};e("The usual crowd",os.filter(i=>kf.includes(i.id))),e("Advanced & trash",t),Vh("more")}function Vh(n){jt(n).classList.remove("hidden")}for(const n of document.querySelectorAll(".modal"))n.addEventListener("click",t=>{(t.target===n||t.target.closest("[data-close]"))&&n.classList.add("hidden")});function dg(){const n=fc();jt("qr-code").innerHTML=sL(n),jt("qr-url").textContent=n,Vh("qr")}jt("btn-copy").onclick=async()=>{try{await navigator.clipboard.writeText(fc()),be("Link copied")}catch{be("Could not copy — long-press the link")}};jt("btn-share-link").onclick=async()=>{if(navigator.share)try{await navigator.share({title:"costuma 2026",text:"Be a 3D costume:",url:fc()})}catch{}else try{await navigator.clipboard.writeText(fc()),be("Link copied")}catch{be(fc())}};function uL(){const n=jt("settings-body");n.innerHTML="";const t=(r,a,o)=>{const c=document.createElement("div");c.className="set";const l=document.createElement("label"),u=document.createElement("span");if(u.textContent=r,a){const h=document.createElement("small");h.textContent=a,u.appendChild(h)}l.append(u,o),c.appendChild(l),n.appendChild(c)},e=(r,a,o)=>{const c=document.createElement("div");c.className="seg";for(const[l,u]of r){const h=document.createElement("button");h.textContent=u,h.classList.toggle("on",a()===l),h.onclick=()=>{o(l),On();for(const f of c.children)f.classList.remove("on");h.classList.add("on")},c.appendChild(h)}return c},i=(r,a)=>{const o=document.createElement("input");return o.type="checkbox",o.className="switch",o.checked=r(),o.onchange=()=>{a(o.checked),On()},o},s=(r,a,o,c,l)=>{const u=document.createElement("input");return u.type="range",u.min=String(r),u.max=String(a),u.step=String(o),u.value=String(c()),u.oninput=()=>{l(Number(u.value)),On()},u};t(st.scene==="party"?"Subjects":"People",st.scene==="party"?"How many people to cut out (the nearest)":"How many to dress at once",e([[1,"1"],[2,"2"],[3,"3"],[4,"4"]],()=>st.people,r=>{st.people=r,wi?.setOptions({numPoses:r})})),t("Costume size","Bigger hides more of the person",s(.8,1.5,.01,()=>st.size,r=>{st.size=r,Ut.opts.size=r})),t("Occlusion (experimental)","Things in front of a costume hide it, from a depth model: 47 MB the first time, a few readings a second",i(()=>st.occlusion,r=>{st.occlusion=r,r&&Ix()})),t("Smoothing","Steady holds a still pose rock-solid; snappy follows fast moves sooner",s(0,1,.05,()=>st.smoothing,r=>{st.smoothing=r,f2(r)})),t("Detection threshold","Higher ignores what only looks like a person (coats, posters, shadows); lower finds people further off or half hidden",s(.4,.9,.05,()=>st.poseConf,r=>{st.poseConf=r,wi?.setOptions({conf:r})})),t("Pose model","Accurate is steadier, slower to load and run",e([["lite","Fast"],["full","Accurate"]],()=>st.model,r=>{st.model=r,_L()})),t("Light from the camera","The costume is lit by the room it stands in",i(()=>st.envLight,r=>{st.envLight=r,Ut.opts.envLight=r})),t("Shadows","Off is faster on older phones",i(()=>st.shadows,r=>{st.shadows=r,Ut.opts.shadows=r})),t("Lens","If costumes look too flat or too deep",s(.55,1.3,.01,()=>st.lens,r=>{st.lens=r})),t("React to the music","Listens through the microphone for the beat; clips record the sound",i(()=>st.music,r=>{st.music=r,r?tr.start().then(()=>be("Listening for the beat",1200)).catch(()=>{st.music=!1,On(),be("No microphone")}):tr.stop()}));{const r=document.createElement("select");r.className="pick";for(const a of ta()){const o=document.createElement("option");o.value=a.id,o.textContent=a.name,r.appendChild(o)}{const a=document.createElement("option");a.value="mix",a.textContent="A mix",r.appendChild(a)}r.value=st.partyCast,r.onchange=()=>{st.partyCast=r.value,Ro.clear(),As.clear(),On(),r.value!=="mix"&&Co(r.value)},t("Party dancers","Who dances behind (or as) you in party mode",r)}t("Costumes in party mode","Behind you: you stay yourself, a pyramid of your costume dances behind you",e([["off","Off"],["behind","Behind"],["on","On you"]],()=>st.partyCostumes,r=>{st.partyCostumes=r})),t("Face tracking","Mouths open costumes and breathe sparks; googly eyes find your eyes",i(()=>st.faces,r=>{st.faces=r,r&&n1()})),t("Mouth magic","Open your mouth: sparks",i(()=>st.breath,r=>{st.breath=r})),t("Show the skeleton","What the pose tracker sees",i(()=>st.debug,r=>{st.debug=r}))}let Gf=!1,rr=null;function fL(n,t){rr={blob:n,name:t};const e=jt("preview-media");e.innerHTML="";const i=URL.createObjectURL(n);if(n.type.startsWith("video")){const r=document.createElement("video");r.src=i,r.controls=!0,r.playsInline=!0,r.loop=!0,r.muted=!0,r.play().catch(()=>{}),e.appendChild(r)}else{const r=new Image;r.src=i,e.appendChild(r)}const s=dc()&&Yd(n,t);jt("btn-share").textContent=s?"Save to Photos":"Share",jt("btn-save").textContent=s?"Download":"Save",jt("preview-note").textContent=s?`In the sheet, choose “Save ${n.type.startsWith("video")?"Video":"Image"}”.`:"",Vh("preview")}jt("btn-share").onclick=async()=>{rr&&await bx(rr.blob,rr.name)==="saved"&&be("Saved")};jt("btn-save").onclick=()=>{rr&&(yx(rr.blob,rr.name),be("Saved"))};async function Tx(n,t){rr={blob:n,name:t},!(dc()&&Yd(n,t)&&(pg||(pg=!0,be(n.type.startsWith("video")?"Choose “Save Video” to put it in Photos":"Choose “Save Image” to put it in Photos",2600)),await bx(n,t,!1)==="shared"))&&fL(n,t)}let pg=!1;const Ax=()=>new Date().toISOString().slice(0,19).replace(/[:T]/g,"-");let Fl=null,mg=0;function dL(){const n=jt("btn-rec");if(Fl){Fl.stop();return}const t=rL(),e=Pc.captureStream;if(!t||!e){be("Recording is not supported in this browser");return}const i=[],s=e.call(Pc,30);for(const a of tr.stream?.getAudioTracks()??[])s.addTrack(a);const r=new MediaRecorder(s,{mimeType:t,videoBitsPerSecond:8e6});r.ondataavailable=a=>{a.data.size&&i.push(a.data)},r.onstop=()=>{clearTimeout(mg),Fl=null,n.classList.remove("on"),n.innerHTML=ys.rec;const a=t.split(";")[0];Tx(new Blob(i,{type:a}),`costuma-${Ax()}.${a.includes("mp4")?"mp4":"webm"}`)},r.start(250),Fl=r,n.classList.add("on"),n.innerHTML=ys.stop,mg=window.setTimeout(()=>r.state==="recording"&&r.stop(),2e4),be("Recording — tap to stop",1200)}const pL=4500;let Rx=performance.now(),Lh=!1;const Ph=()=>jt("hud");function mL(){Rx=performance.now(),Ph().classList.contains("idle")&&(Ph().classList.remove("idle"),Lh=!0,setTimeout(()=>Lh=!1,400))}for(const n of["pointerdown","keydown","wheel"])window.addEventListener(n,mL,{capture:!0,passive:!0});setInterval(()=>{const n=[...document.querySelectorAll(".modal")].some(e=>!e.classList.contains("hidden")),t=Ao&&!n&&performance.now()-Rx>pL;t!==Ph().classList.contains("idle")&&Ph().classList.toggle("idle",t)},300);function Cx(n){const t=Ut.cover,e=n.image,i=(e[D.shL].x+e[D.shR].x+e[D.hipL].x+e[D.hipR].x)/4,s=(e[D.shL].y+e[D.shR].y+e[D.hipL].y+e[D.hipR].y)/4;let r=(i*t.vw-t.ox)*t.s;const a=(s*t.vh-t.oy)*t.s;return t.mirror&&(r=t.cw-r),{x:r,y:a}}Pc.addEventListener("click",n=>{if(!Ao)return;if(Lh){Lh=!1;return}if(st.scene==="party"&&st.partyCostumes==="off"){const r=Ls.findIndex(a=>a.id===st.effect);Qd(Ls[(r+1)%Ls.length].id);return}let t=null,e=1/0;for(const r of Ye.tracks){if(r.lost)continue;const a=Cx(r),o=Math.hypot(a.x-n.clientX,a.y-n.clientY);o<e&&(e=o,t=r)}if(!t||e>Math.max(innerWidth,innerHeight)*.3)return;const i=Ch(t.id),s=Rh(Zd(i)+1);Ro.set(t.id,s),Co(s),be(as(s).name,900)});let Wf=0,gg=-1,Xf=0,$f=performance.now(),pu=performance.now();const ka=document.createElement("canvas"),gL=ka.getContext("2d");function vL(){if(st.scene!=="party")return ke;const n=ke.videoWidth||720,t=ke.videoHeight||1280,e=480/Math.max(n,t),i=Math.round(n*e),s=Math.round(t*e);return(ka.width!==i||ka.height!==s)&&(ka.width=i,ka.height=s),gL.drawImage(ke,0,0,i,s),ka}let t1=0,mu=performance.now(),gu=0;function Gh(){return Qy(ke.videoWidth||720,ke.videoHeight||1280,st.lens*(Ve.zoom>0?Ve.zoom:1))}function e1(){const n=jt("lens");if(n.innerHTML="",An)return;const t=Ve.stops(),e=Ve.zoomRange?t.reduce((i,s,r)=>Math.abs(s.zoom-Ve.zoom)<Math.abs(t[i].zoom-Ve.zoom)?r:i,0):Ve.lens;t.forEach((i,s)=>{const r=document.createElement("button"),a=s===e;r.textContent=a?i.label+"×":i.label,r.classList.toggle("on",a),r.setAttribute("aria-label",Ve.zoomRange?`Zoom ${i.label}×`:`Camera ${i.label}`),r.onclick=()=>{a||zf(async()=>{try{i.zoom>0?(await Ve.setZoom(i.zoom),st.zoom[Ve.facing]=Ve.zoom,On()):(await Ve.nextLens(-1-i.zoom),Ut.setVideo(ke))}catch(o){be(`Camera: ${o.message}`)}e1()})},n.appendChild(r)})}function Lx(n){if(requestAnimationFrame(Lx),!Ao)return;Wf++;const t=Gh();Ut.layout(t,Ve.mirrored&&!An);let e=null;if(An){if(e=fS(An,(n-$f)/1e3*(jd?0:1)+Number(Be.get("t")??0),t),st.scene==="party"){const u=t.w/t.h,h=u>=1?240:Math.round(240*u),f=u>=1?Math.round(240/u):240;for(const d of e)d.mask=dS(d,h,f,u)}}else if(wi&&ke.readyState>=2&&ke.currentTime!==gg){gg=ke.currentTime;try{e=wi.detect(vL(),n)}catch(u){console.error(u)}}if(e&&Ye.update(e.slice(0,st.people),n,t,Ut.ground.n),e){let u=null;if(bo&&st.faces&&!An)try{u=bo.detect(ke,Ye.tracks,t)}catch(h){console.error(h)}if(JC(Ye.tracks,u,t,n,du<0?1/30:Math.min(.25,(n-du)/1e3)),du=n,An&&(Be.get("jaw")||Be.get("face")))for(const h of Ye.tracks)h.face&&Object.assign(h.face,_S(Be.get("face"),{jaw:Number(Be.get("jaw")??0)}))}Ut.ground.update(Ye.tracks,An?null:Sx.upInCamera(Ve.facing),Math.min(.25,(n-pu)/1e3));const i=st.scene==="costume"||st.partyCostumes!=="off";if(i)for(const u of Ye.tracks)Co(Ch(u.id),!0);const s=(n-$f)/1e3,r=Math.min(.25,(n-pu)/1e3);pu=n;const a=i,o=st.scene==="party",c=o&&st.partyCostumes==="behind";Ut.pyramid=o&&st.pyramid&&st.partyCostumes!=="off",Ut.hideWearers=c,Sn.pyramid=st.pyramid,Ut.setForeground(c?Sn.foreground:null),Sn.clones=!Ut.pyramid,Ut.stageLights(st.scene==="party"&&Sn.preset.id!=="insitu",s,tr.env);{const u=Ye.tracks.filter(d=>!d.lost).sort((d,p)=>p.T.z-d.T.z)[0],h=st.scene==="party"&&Sn.preset.id==="insitu",f=Ut.stageSpots(h,s,tr.env,t,u?new C(u.T.x,u.T.y,u.T.z):null);Sn.setSpots(f,h?1:0),Ut.light.realism=h}Ut.setGrain(!0,s),Ut.sync(a?Ye.tracks:[],Ch,s),st.occlusion&&!An&&Ut.depth.due(n)&&ke.readyState>=2&&Ut.depth.read(ke,Ye.tracks,t,n),Ut.depth.frame(st.occlusion,Ut.bgUniforms.uCrop.value,Ut.bgUniforms.uMirror.value,Ut.renderer.getDrawingBufferSize(new ht),r),Ut.googlyOn=st.googly&&st.faces,Ut.breathOn=st.breath&&st.faces,Ut.faces(Ye.tracks,t,r),tr.update(r,n),st.scene==="party"&&(Sn.subjects=st.people,Sn.beat=tr.env,Sn.update(Ye.tracks,r,s,t.w/t.h,Ut.ground,t),Sn.render(Ut.renderer,t.w,t.h)),Ut.render(ke,t,Wf),Gf&&(Gf=!1,Pc.toBlob(u=>{u&&Tx(u,`costuma-${Ax()}.jpg`)},"image/jpeg",.92)),Ye.tracks.filter(u=>!u.lost).length&&(Xf=n),oL(n-Xf>2500?"Step back until your head and hips are in view":""),ML(),gu++,n-mu>1e3&&(t1=gu*1e3/(n-mu),gu=0,mu=n,Px(),xL())}let Nl=0,vg=!1;function xL(){if(!(jd||!Ao||Ye.tracks.length===0)&&(Nl=t1<22?Nl+1:0,!(Nl<3))){if(Nl=0,Ut.opts.pixelRatio>1.01)Ut.opts.pixelRatio=Math.max(1,Ut.opts.pixelRatio-.25);else if(Ut.opts.shadows)Ut.opts.shadows=!1;else return;vg||(vg=!0,be("Lowering quality to keep up",1500))}}function ML(){const n=Na.clientWidth,t=Na.clientHeight,e=Math.min(devicePixelRatio||1,2);if(Na.width!==Math.round(n*e)&&(Na.width=Math.round(n*e),Na.height=Math.round(t*e)),Ce.setTransform(e,0,0,e,0,0),Ce.clearRect(0,0,n,t),!st.debug)return;const i=Ut.cover,s=r=>{let a=(r.x*i.vw-i.ox)*i.s;return i.mirror&&(a=i.cw-a),[a,(r.y*i.vh-i.oy)*i.s]};{const r=Ut.ground,a=Gh(),{back:o,side:c}=r.axes(),l=Ye.tracks.filter(d=>!d.lost).sort((d,p)=>p.T.z-d.T.z)[0],u=r.foot(l?new C(l.T.x,l.T.y,l.T.z):new C(0,0,-3)).addScaledVector(o,-1),h=(d,p)=>u.clone().addScaledVector(c,d).addScaledVector(o,p),f=(d,p)=>{if(d.z>-.2||p.z>-.2)return;const[v,g]=s(go(d,a)),[m,M]=s(go(p,a));Ce.beginPath(),Ce.moveTo(v,g),Ce.lineTo(m,M),Ce.stroke()};Ce.strokeStyle="rgba(125, 252, 255, 0.45)",Ce.lineWidth=1.5;for(let d=-3;d<=3.001;d+=.5)f(h(d,0),h(d,8));for(let d=0;d<=8.001;d+=.5)f(h(-3,d),h(3,d));Ce.fillStyle="#7dfcff",Ce.font="600 12px system-ui",Ce.fillText(`floor: ${r.source}${r.fromFeet?" + feet":""} · camera ${r.cameraHeight.toFixed(2)} m up`,12,i.ch-200)}for(const r of Ye.tracks){Ce.globalAlpha=r.presence,Ce.strokeStyle="#7dfcff",Ce.lineWidth=3;for(const[o,c]of Wx){const l=r.image[o],u=r.image[c];if(Math.min(l.v,u.v)<.4)continue;const[h,f]=s(l),[d,p]=s(u);Ce.beginPath(),Ce.moveTo(h,f),Ce.lineTo(d,p),Ce.stroke()}Ce.fillStyle="#ff8a1f";for(const o of r.image){if(o.v<.4)continue;const[c,l]=s(o);Ce.beginPath(),Ce.arc(c,l,4,0,Math.PI*2),Ce.fill()}const a=Cx(r);Ce.fillStyle="#fff",Ce.font="600 14px system-ui",Ce.fillText(`#${r.id} ${as(Ch(r.id)).name} · ${(-r.T.z).toFixed(1)} m`,a.x-40,a.y)}Ce.globalAlpha=1}function Px(){const n=jt("readout");if(!n||jt("settings").classList.contains("hidden"))return;const t=Gh();n.textContent=["build 848ae7d · 2026-11-01 23:10Z",`${t1.toFixed(0)} fps · pose ${wi?.inferMs.toFixed(1)??"–"} ms (${wi?.delegate??"–"}, ${st.model}) · face ${bo?bo.inferMs.toFixed(1)+" ms":st.faces?"loading":"off"}`,`video ${ke.videoWidth}×${ke.videoHeight} · f ${t.f.toFixed(0)} px · ${Ve.facing}`,`camera ${Ve.describe()}`,`depth ${Ut.depth.ready?`${Ut.depth.engine} · ${Ut.depth.ms.toFixed(0)} ms${Ut.depth.cal?` · 1/z = ${Ut.depth.cal.a.toFixed(3)}·d + ${Ut.depth.cal.b.toFixed(3)} (${Ut.depth.cal.n} points)`:" · not yet calibrated"} · on ${Ut.depth.u.uOcclOn.value.toFixed(2)}`:st.occlusion?"loading":"off"}`,`people ${Ye.tracks.filter(e=>!e.lost).length} · dressed ${Ut.count}`,...Ye.tracks.filter(e=>!e.lost&&e.face).map(e=>{const i=e.face,s=new Cn().setFromQuaternion(i.head,"YXZ"),r=a=>Math.round(ni.radToDeg(a));return`face ${e.id}: ${i.read?"read":"pose only"} · trust ${i.trust.toFixed(2)} · head yaw ${r(s.y)} nod ${r(s.x)} tilt ${r(s.z)} · jaw ${i.jaw.toFixed(2)} blink ${i.blinkL.toFixed(2)}/${i.blinkR.toFixed(2)} look ${i.lookX.toFixed(2)},${i.lookY.toFixed(2)}`}),`pixels ×${Ut.opts.pixelRatio.toFixed(2)} · shadows ${Ut.opts.shadows?"on":"off"}`,`face light ${Ut.light.faceConf>.05?`${Ut.light.faceLum.toFixed(3)} from (${Ut.light.faceDir.x.toFixed(2)}, ${Ut.light.faceDir.y.toFixed(2)}) ×${Ut.light.faceConf.toFixed(2)}`:"—"}`,`light mean ${Ut.light.mean.toFixed(3)} × ${Ut.light.gain.toFixed(2)} · key share ${Ut.light.share.toFixed(2)} · every ${Ri.every} frames`].join(`
`)}async function _L(){if(An)return;const n=wi,t=new xg(st.model,st.people,st.poseConf);t.masks=st.scene==="party",await t.load(e=>be(e,2500)),wi=t,n?.close(),be(st.model==="full"?"Accurate pose model":"Fast pose model",1e3)}let vu=!1;async function Ix(){if(!(Ut.depth.ready||vu||An)){vu=!0;try{await Ut.depth.load(n=>be(n,2500)),be(`Occlusion on (${Ut.depth.engine==="webgpu"?"GPU":"CPU"})`,1500)}catch(n){console.warn(n),be("The depth model would not load on this phone"),st.occlusion=!1,On()}finally{vu=!1}}}async function n1(){if(bo||An||!st.faces)return;const n=new WC;try{await n.load(),bo=n}catch(t){console.warn("face model failed",t)}}function wL(){const n=document.createElement("canvas");n.width=720,n.height=1280;const t=n.getContext("2d"),e=()=>{const i=t.createLinearGradient(0,0,0,1280);i.addColorStop(0,"#5a4a63"),i.addColorStop(.62,"#3b3142"),i.addColorStop(.63,"#6b5440"),i.addColorStop(1,"#3a2c22"),t.fillStyle=i,t.fillRect(0,0,720,1280),t.fillStyle="#fff3d6",t.fillRect(40,220,170,330),t.fillStyle="#ffb35a",t.beginPath(),t.arc(600,180,46,0,Math.PI*2),t.fill()};return e(),setInterval(e,500),n.captureStream(30)}async function xu(){const n=jt("start-status"),t=jt("btn-start");t.disabled=!0;const e=An?Promise.resolve(!1):Sx.enable();try{if(An)ke.srcObject=wL(),await ke.play().catch(()=>{}),ke.readyState<2&&await new Promise(s=>ke.addEventListener("loadeddata",s,{once:!0}));else{if(!navigator.mediaDevices?.getUserMedia)throw new Error(location.protocol!=="https:"?"The camera needs an https:// page.":"This browser has no camera access.");n.textContent="Asking for the camera…",await Ve.open(Ve.facing,st.zoom[Ve.facing]??1),e1(),n.textContent="Loading the pose model…",wi=new xg(st.model,st.people,st.poseConf),wi.masks=st.scene==="party",await wi.load(s=>{n.textContent=s[0].toUpperCase()+s.slice(1)+"…"})}Ut.setVideo(ke),n.textContent=`Dressing up as ${as(st.costume).name}…`,await new Promise(s=>setTimeout(s,30));const i=st.mode==="one"?st.costume:os[0].id;await Ut.prepare(i,!0);for(const s of ta())Ut.prepare(s.id);n1(),st.occlusion&&Ix(),jt("start").classList.add("hidden"),jt("hud").classList.remove("hidden"),Vf(st.scene),Ao=!0,$f=performance.now(),Xf=performance.now(),Uc()}catch(i){console.error(i);const s=i;n.textContent=s.name==="NotAllowedError"?"Camera permission was refused. Allow it in the browser settings and try again.":`Could not start: ${s.message}`,t.disabled=!1}}function bL(){jt("btn-pyramid").innerHTML=ys.pyramid;const n=()=>jt("btn-pyramid").setAttribute("aria-pressed",String(st.pyramid));n(),jt("btn-pyramid").onclick=()=>{st.pyramid=!st.pyramid,On(),n(),be(st.pyramid?"Dance pyramid":"No pyramid",800)},jt("btn-googly").innerHTML=ys.googly;const t=()=>jt("btn-googly").setAttribute("aria-pressed",String(st.googly));t(),jt("btn-googly").onclick=()=>{st.googly=!st.googly,st.googly&&!st.faces&&(st.faces=!0,n1()),On(),t(),be(st.googly?"Googly eyes":"No googly eyes",800)},jt("btn-qr").innerHTML=ys.qr,jt("btn-flip").innerHTML=ys.flip,jt("btn-gear").innerHTML=ys.gear,jt("btn-snap").innerHTML=ys.camera,jt("btn-rec").innerHTML=ys.rec,jt("btn-start").onclick=()=>void xu(),jt("btn-start-qr").onclick=dg,jt("btn-qr").onclick=dg,jt("btn-gear").onclick=()=>{uL(),Vh("settings"),Px()},jt("btn-flip").onclick=async()=>{An||zf(async()=>{try{await Ve.flip(st.zoom[Ve.facing==="user"?"environment":"user"]??1),Ut.setVideo(ke),Ye.clear(),Ro.clear(),As.clear()}catch(s){be(`Camera: ${s.message}`)}e1()})},jt("btn-snap").onclick=()=>{Gf=!0;const s=jt("stage");s.style.filter="brightness(1.8)",setTimeout(()=>s.style.filter="",120)},jt("btn-rec").onclick=dL;for(const s of document.querySelectorAll(".modes button"))s.onclick=()=>{s.dataset.scene!==st.scene&&zf(()=>Vf(s.dataset.scene))};const e=jt("start-cast");for(const s of ta().slice(0,6)){const r=new Image;r.src=Jd(s.id),r.alt=s.name,r.onerror=()=>r.remove(),e.appendChild(r)}Kd(),cL(jt("picker")),requestAnimationFrame(Lx);const i=window;i.__costuma={stage:Ut,tracker:Ye,settings:st,start:xu,choose:Ex,party:Sn,beat:tr,setScene:Vf,chooseEffect:Qd,get started(){return Ao},get frame(){return Wf},LIGHT_TUNE:Ri,camera:Ve,intrinsics:Gh},jd&&An&&xu()}bL();
