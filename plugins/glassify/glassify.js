(() => {
'use strict';
// Same raw-source version check as AudioMetrix; never executes remote code.
const pluginVersion = '1.2.0';
const pluginName = 'Glassify';
const pluginHomepageUrl = 'https://github.com/MCelliotG/Glassify';
const pluginUpdateUrl = 'https://raw.githubusercontent.com/MCelliotG/Glassify/main/plugins/glassify/glassify.js';
// Glassify has backend, model and assets: updates must replace the complete package.
const pluginSetupOnlyNotify = true;
const CHECK_FOR_UPDATES = true;
const model=(()=>{
'use strict';
const ranges = {blur:[0,30],opacity:[10,100],radius:[0,24],gloss:[0,150],edge:[0,150],shadow:[0,30],saturation:[0,250],contrast:[50,180],brightness:[50,150],layerStrength:[0,100],glow:[0,100],overglow:[0,100],glowAngle:[0,360]};
const effects = ['none','prism','theme','ripple','mist'];
const defaults = Object.freeze({enabled:false,panels:true,sidebar:true,popups:false,mobile:true,hover:true,blur:5,opacity:40,radius:7,gloss:100,edge:100,shadow:0,saturation:100,contrast:100,brightness:100,layerStrength:35,effect:'none',glow:0,overglow:0,glowAngle:90});
function sanitize(raw) {
  const out={...defaults};
  if(!raw || typeof raw!=='object' || Array.isArray(raw))return out;
  for(const k of Object.keys(defaults)){
    if(ranges[k]){if(typeof raw[k]==='number'&&Number.isFinite(raw[k]))out[k]=Math.round(Math.max(ranges[k][0],Math.min(ranges[k][1],raw[k])));}
    else if(k==='effect'){if(effects.includes(raw[k]))out[k]=raw[k];}
    else if(typeof raw[k]==='boolean')out[k]=raw[k];
  }
  return out;
}
function valid(raw) {return !!raw && typeof raw==='object' && !Array.isArray(raw) && Object.keys(raw).length===Object.keys(defaults).length && Object.keys(defaults).every(k=>ranges[k]?Number.isInteger(raw[k])&&raw[k]>=ranges[k][0]&&raw[k]<=ranges[k][1]:k==='effect'?effects.includes(raw[k]):typeof raw[k]==='boolean');}
const looks = {
 classic:{label:'Classic',values:{}},
 frosted:{label:'Frosted',values:{blur:18,opacity:70,gloss:65,edge:70}},
 clear:{label:'Clear',values:{blur:3,opacity:20,gloss:110,edge:80}},
 smoked:{label:'Smoked',values:{blur:12,opacity:55,brightness:75,saturation:65,gloss:35,shadow:18}},
 crystal:{label:'Crystal',values:{blur:2,opacity:18,contrast:145,saturation:160,gloss:135,edge:140,shadow:12}},
 prism:{label:'Prism',values:{blur:8,opacity:25,effect:'prism',layerStrength:55,saturation:180,contrast:115,gloss:120}},
 ripple:{label:'Ripple',values:{blur:5,opacity:20,effect:'ripple',layerStrength:35,contrast:105,saturation:110,gloss:55}},
 aurora:{label:'Aurora',values:{blur:20,opacity:25,effect:'prism',layerStrength:75,saturation:220,brightness:115,edge:60}},
 mist:{label:'Mist',values:{blur:24,opacity:35,effect:'mist',layerStrength:60,saturation:75,contrast:90,gloss:70}}
};
const visualKeys=['blur','opacity','radius','gloss','edge','shadow','saturation','contrast','brightness','layerStrength','effect','glow','overglow','glowAngle'];
function preset(current,id){const p=looks[id];if(!p)return sanitize(current);const out={...current};for(const k of visualKeys)out[k]=defaults[k];return sanitize({...out,...p.values});}
return {ranges,effects,defaults,sanitize,valid,looks,visualKeys,preset};

})();
const TEMPLATES={"panels": "\n/* Paint-only styles: leave core widths, margins, padding and layout intact. */\nhtml.glassify-active *[class^=\"panel-\"]:not(.no-bg):not(.no-filter):not(.panel-full) {\n    border-radius: var(--gf-radius);\n}\nhtml.glassify-active .panel-100.w-100::before {\n    backdrop-filter: blur(var(--gf-blur));\n    -webkit-backdrop-filter: blur(var(--gf-blur));\n    border-radius: var(--gf-radius);\n}\n", "sidebar": "\nhtml.glassify-active #myModal .modal-panel {\n    background:\n        radial-gradient(ellipse at 1% 1%, color-mix(in srgb, var(--color-4-transparent) 80%, white calc(20% * var(--gf-gloss))), transparent 6%),\n        radial-gradient(ellipse at 12% 10%, rgb(255 255 255 / calc(0.10 * var(--gf-gloss))), transparent 32%),\n        radial-gradient(ellipse at 88% 20%, rgb(255 255 255 / calc(0.06 * var(--gf-gloss))), transparent 26%),\n        radial-gradient(ellipse at 82% 88%, rgb(255 255 255 / calc(0.04 * var(--gf-gloss))), transparent 30%),\n        linear-gradient(135deg, rgb(255 255 255 / calc(0.08 * var(--gf-gloss))), transparent 42%),\n        linear-gradient(to bottom, rgb(255 255 255 / calc(0.07 * var(--gf-gloss))), rgba(0,0,0,0.07)),\n        var(--color-1-transparent);\n    backdrop-filter: blur(var(--gf-blur));\n    -webkit-backdrop-filter: blur(var(--gf-blur));\n    box-shadow:\n        inset -1px -1px 0 rgba(0,0,0,0.44),\n        inset 1px 1px 0 rgb(255 255 255 / calc(0.17 * var(--gf-edge)));\n}\nhtml.glassify-active #myModal .modal-panel-sidebar,\nhtml.glassify-active #myModal .modal-panel-footer {\n    background-color: transparent;\n}\nhtml.glassify-active #myModal .modal-panel-sidebar {\n    box-shadow: inset -1px 0 0 rgb(255 255 255 / calc(0.10 * var(--gf-gloss)));\n    transition: background-color 0.3s ease;\n}\nhtml.glassify-active #myModal .modal-panel-sidebar:hover {\n    background-color: var(--color-2-transparent);\n}\n"};
  const SCRIPT_URL=document.currentScript?.src||new URL('js/plugins/glassify/glassify.js',location.href).href;
  const LOGO=new URL('assets/glassify-logo.png?v=1.2.0-r2',SCRIPT_URL).href;
  window.Glassify?.destroy?.();
  const KEY='glassify.settings.v2',LEGACY='glassify.settings.v1';
  const POSITIONS=['bottom-right','bottom-left','top-right','top-left','custom'];
  const initialPosition=()=>({corner:'bottom-right',x:1,y:1});
  function sanitizePosition(p){return {corner:POSITIONS.includes(p?.corner)?p.corner:'bottom-right',x:Number.isFinite(p?.x)?Math.min(1,Math.max(0,p.x)):1,y:Number.isFinite(p?.y)?Math.min(1,Math.max(0,p.y)):1};}
  let personal=null,custom=null,position=initialPosition(),migrated=false;
  try {
    const raw=JSON.parse(localStorage.getItem(KEY));
    if(raw?.version===2){personal=raw.personal?model.sanitize(raw.personal):null;custom=raw.custom?model.sanitize(raw.custom):null;position=sanitizePosition(raw.position);}
    else if(!raw){const old=JSON.parse(localStorage.getItem(LEGACY));if(old&&typeof old==='object'&&!Array.isArray(old)){personal=model.sanitize(old);migrated=true;}}
  }catch{}
  let server={...model.defaults},revision=0,loaded=false,canAdmin=false,csrf=null;
  let settings=model.sanitize(personal||server),host,root,dialog,opener,style,sideHost,sideInput,sideOpen,previousFocus;
  let dead=false,retryTimer,failures=0,requestRunning=false,drag=null,suppressClick=false,sidebarObserver,panelDrag=null,panelPosition=null;
  const events=new AbortController(),requests=new Set();
  const target='html.glassify-active *[class^="panel-"]:not(.no-bg):not(.no-filter):not(.panel-full):not(#console-output)';
  function glassLayers(s){
    const a=s.layerStrength/100;
    if(s.effect==='theme')return `linear-gradient(125deg,color-mix(in srgb,var(--color-4,#8ad) ${a*45}%,transparent),transparent 35%,color-mix(in srgb,var(--color-main-bright,var(--color-5,#cef)) ${a*40}%,transparent) 65%,color-mix(in srgb,var(--color-main,var(--color-3,#789)) ${a*45}%,transparent)),`;
    if(s.effect==='prism')return `linear-gradient(125deg,rgb(100 220 255 / ${a*.32}),transparent 35%,rgb(240 130 255 / ${a*.28}) 65%,rgb(255 220 130 / ${a*.22})),`;
    if(s.effect==='ripple')return `repeating-radial-gradient(ellipse at 15% 0%,transparent 0 24px,rgb(0 0 0 / ${a*.055}) 25px 26px,rgb(255 255 255 / ${a*.085}) 27px 28px,transparent 29px 52px),`;
    if(s.effect==='mist')return `radial-gradient(ellipse at 10% 20%,rgb(255 255 255 / ${a*.35}),transparent 55%),radial-gradient(ellipse at 85% 80%,rgb(255 255 255 / ${a*.22}),transparent 60%),`;
    return '';
  }
  function surface(s){return `${glassLayers(s)}radial-gradient(ellipse at 1% 1%,color-mix(in srgb,var(--color-4-transparent) ${100-s.gloss*.2}%,white ${s.gloss*.2}%),transparent 6%),radial-gradient(ellipse at 12% 10%,rgb(255 255 255 / ${s.gloss*.001}),transparent 32%),radial-gradient(ellipse at 88% 20%,rgb(255 255 255 / ${s.gloss*.0006}),transparent 26%),linear-gradient(135deg,rgb(255 255 255 / ${s.gloss*.0008}),transparent 42%),linear-gradient(to bottom,rgb(255 255 255 / ${s.gloss*.0007}),rgb(0 0 0 / .07)),var(--color-1-transparent)`;}
  // Shadows paint outside the existing border without pseudo-elements or layout changes.
  // The two opposing light bands follow the angle; no animation loop is needed.
  function accentGlow(s){
    const layers=[];
    if(s.glow){const c=`color-mix(in srgb,var(--color-4,#8ad) ${s.glow*.65}%,transparent)`;
      layers.push(`0 0 10px ${c}`,`0 0 24px color-mix(in srgb,var(--color-4,#8ad) ${s.glow*.32}%,transparent)`);}
    if(s.overglow){
      const r=s.glowAngle*Math.PI/180,x=Math.sin(r),y=-Math.cos(r);
      const accent=`color-mix(in srgb,var(--color-4,#8ad) ${s.overglow*.85}%,transparent)`;
      const bright=`color-mix(in srgb,var(--color-5,#cef) ${s.overglow*.65}%,transparent)`;
      for(const sign of [-1,1]){
        layers.push(`${(sign*x*2).toFixed(2)}px ${(sign*y*2).toFixed(2)}px 2px -1px ${bright}`);
        layers.push(`${(sign*x*7).toFixed(2)}px ${(sign*y*7).toFixed(2)}px 12px -5px ${accent}`);
      }
    }
    return layers.length?','+layers.join(','):'';
  }
  function css(s){
    if(!s.enabled)return '';
    const t=100-s.opacity;
    let text=`html.glassify-active{--gf-blur:${s.blur}px;--gf-description-blur:${s.blur*11}px;--gf-radius:${s.radius}px;--gf-gloss:${s.gloss/100};--gf-edge:${s.edge/100};--color-1-transparent:color-mix(in srgb,var(--color-1),transparent ${t}%);--color-3-transparent:color-mix(in srgb,var(--color-3),transparent ${Math.max(0,t-10)}%);--color-4-transparent:color-mix(in srgb,var(--color-4),transparent ${Math.max(0,t-15)}%);--color-5-transparent:color-mix(in srgb,var(--color-5),transparent ${Math.max(0,t-10)}%);}`;
    if(s.panels)text+=TEMPLATES.panels;
    if(s.sidebar)text+=TEMPLATES.sidebar;
    const surfaces=[];if(s.panels)surfaces.push(target,'html.glassify-active #rt-container');if(s.sidebar)surfaces.push('html.glassify-active #myModal .modal-panel');if(s.popups)surfaces.push('html.glassify-active .popup-window');
    const filter=`blur(${s.blur}px) saturate(${s.saturation}%) contrast(${s.contrast}%) brightness(${s.brightness}%)`;
    const shadow=`inset -1px -1px 0 rgb(0 0 0 / ${s.edge*.0044}),inset 1px 1px 0 rgb(255 255 255 / ${s.edge*.0017})${s.shadow?`,0 ${s.shadow/3}px ${s.shadow}px rgb(0 0 0 / .3)`:''}${accentGlow(s)}`;
    if(surfaces.length)text+=`${surfaces.join(',')}{background:${surface(s)};box-shadow:${shadow};backdrop-filter:${filter};-webkit-backdrop-filter:${filter};}`;
    if(s.panels){
      text+=`${target}.hover-brighten:hover{background:${surface(s)}!important;box-shadow:${shadow}${s.hover?',0 0 12px rgb(255 255 255 / .14),0 0 20px var(--color-4-transparent)':''}!important;}`;
      // Keep explicitly transparent mobile wrappers transparent after the shared surface rule.
      text+=`@media(max-width:768px){html.glassify-active *[class^="panel-"].no-bg-phone,html.glassify-active *[class^="panel-"].no-bg-phone:hover,html.glassify-active *[class^="panel-"].no-bg-phone::before{background:none!important;box-shadow:none!important;backdrop-filter:none!important;-webkit-backdrop-filter:none!important;}}`;
    }
    if(s.popups)text+=`html.glassify-active .popup-window{border-radius:${s.radius}px;}`;
    return s.mobile?text:`@media(min-width:769px){${text}}`;
  }
  function status(text){const el=root?.querySelector('#status');if(el)el.textContent=text;}
  function persist(){try{localStorage.setItem(KEY,JSON.stringify({version:2,personal,custom,position}));return true;}catch{status('Applied for this visit; browser storage is unavailable.');return false;}}
  function apply(){settings=model.sanitize(personal||server);style.textContent=css(settings);document.documentElement.classList.toggle('glassify-active',settings.enabled);sync();paintDialog();}
  function paintDialog(){
    if(!dialog)return;
    dialog.style.setProperty('--color-1-transparent',`color-mix(in srgb,var(--color-1),transparent ${100-settings.opacity}%)`);
    dialog.style.background=surface(settings);
    const filter=`blur(${settings.blur}px) saturate(${settings.saturation}%) contrast(${settings.contrast}%) brightness(${settings.brightness}%)`;
    dialog.style.backdropFilter=filter;dialog.style.webkitBackdropFilter=filter;
    dialog.style.borderRadius=`${settings.radius}px`;
    dialog.style.boxShadow=`inset 1px 1px 0 rgb(255 255 255 / ${settings.edge*.0017}),inset -1px -1px 0 rgb(0 0 0 / ${settings.edge*.0044}),0 8px ${Math.max(12,settings.shadow)}px rgb(0 0 0 / .25)${accentGlow(settings)}`;
  }
  function edit(values){personal=model.sanitize({...settings,...values});apply();if(persist())status('Personal settings saved on this browser.');}
  function labelMode(){return personal?'Personal settings':loaded?'Following server defaults':'Server defaults pending · factory default OFF';}
  function sync(){if(!root)return;for(const k of Object.keys(model.defaults)){const el=root.querySelector(`[name="${k}"]`);if(el){if(el.type==='checkbox')el.checked=settings[k];else el.value=settings[k];}const out=root.querySelector(`[data-value="${k}"]`);if(out)out.value=settings[k];}
    if(sideInput)sideInput.checked=settings.enabled;
    if(opener){opener.hidden=!settings.enabled;if(settings.enabled)place();}
    root.querySelector('#mode').textContent=labelMode();root.querySelector('#position').value=position.corner;
    root.querySelector('#load-custom').disabled=!custom;
    root.querySelector('#admin').hidden=!canAdmin;
    root.querySelector('#server-revision').textContent=`Revision ${revision}`;
  }
  function viewport(){return {w:document.documentElement.clientWidth||innerWidth,h:innerHeight};}
  function place(){if(!opener||opener.hidden)return;const {w,h}=viewport(),r=opener.getBoundingClientRect(),maxX=Math.max(0,w-r.width),maxY=Math.max(0,h-r.height),pad=16;
    let x,y;if(position.corner==='custom'){x=position.x*maxX;y=position.y*maxY;}else{x=position.corner.endsWith('right')?maxX-pad:pad;y=position.corner.startsWith('bottom')?maxY-pad:pad;}
    opener.style.left=`${Math.min(maxX,Math.max(0,x))}px`;opener.style.top=`${Math.min(maxY,Math.max(0,y))}px`;opener.style.right='auto';opener.style.bottom='auto';
  }
  async function api(method,body){const controller=new AbortController();requests.add(controller);const timer=setTimeout(()=>controller.abort(),6000);try{
    const response=await fetch(new URL('glassify/api/defaults',location.href.split('?')[0]),{method,credentials:'same-origin',cache:'no-store',signal:controller.signal,headers:body?{'Content-Type':'application/json','X-Glassify-CSRF':csrf||''}:{},body:body?JSON.stringify(body):undefined});
    const data=await response.json();if(!response.ok)throw new Error(data.error||`HTTP ${response.status}`);return data;
  }finally{clearTimeout(timer);requests.delete(controller);}}
  async function refresh(retry=false){if(dead||requestRunning)return;requestRunning=true;let failed=false;try{const data=await api('GET');if(dead)return;if(!model.valid(data.settings))throw Error('Invalid server defaults');server=model.sanitize(data.settings);revision=data.revision;canAdmin=data.canAdmin===true;csrf=data.csrf;loaded=true;root.querySelector('#admin-enabled').checked=server.enabled;failures=0;clearTimeout(retryTimer);apply();status(personal?'Personal settings kept.':'Server defaults loaded.');}
    catch(e){failed=true;if(!dead)status('Server defaults unavailable. Your local settings remain usable.');}
    finally{requestRunning=false;}
    if(failed&&retry&&!dead&&failures<7){retryTimer=setTimeout(()=>refresh(true),Math.min(30000,2000*2**failures++));}
  }
  function placePanel(x,y){
    if(!dialog?.open)return;
    const {w,h}=viewport(),r=dialog.getBoundingClientRect();
    const left=Math.max(0,Math.min(Math.max(0,w-r.width),x));
    const top=Math.max(0,Math.min(Math.max(0,h-r.height),y));
    dialog.style.position='fixed';dialog.style.margin='0';dialog.style.right='auto';dialog.style.bottom='auto';
    dialog.style.left=`${left}px`;dialog.style.top=`${top}px`;panelPosition={x:left,y:top};
  }
  let updateChecked=false;
  async function checkUpdate(){
    if(updateChecked||dead||!CHECK_FOR_UPDATES)return;
    updateChecked=true;
    const controller=new AbortController();requests.add(controller);
    const timer=setTimeout(()=>controller.abort(),6000);
    try{
      const response=await fetch(pluginUpdateUrl+'?_='+Date.now(),{cache:'no-store',credentials:'omit',signal:controller.signal});
      if(!response.ok)return;
      const text=await response.text();
      const remote=text.match(/const\s+pluginVersion\s*=\s*["'](\d+\.\d+(?:\.\d+)?)["']/)?.[1];
      if(!remote||dead)return;
      const a=remote.split('.').map(Number),b=pluginVersion.split('.').map(Number);
      let cmp=0;for(let i=0;i<Math.max(a.length,b.length);i++){cmp=(a[i]||0)-(b[i]||0);if(cmp)break;}
      const link=root.querySelector('#update-available');
      link.hidden=cmp<=0;
      link.textContent=cmp>0?`Update available: v${remote}`:'';
    }catch{/* Offline or blocked checks leave the reserved update row empty. */}
    finally{clearTimeout(timer);requests.delete(controller);}
  }
  function show(){checkUpdate();previousFocus=document.activeElement;if(!dialog.open)dialog.showModal();
    const r=dialog.getBoundingClientRect(),v=viewport();
    placePanel(panelPosition?.x??(v.w-r.width)/2,panelPosition?.y??(v.h-r.height)/2);
    root.querySelector('#close').focus();refresh();}
  function close(){dialog.close();previousFocus?.focus?.();}
  function destroy(){dead=true;events.abort();sidebarObserver?.disconnect();clearTimeout(retryTimer);for(const c of requests)c.abort();host?.remove();sideHost?.remove();style?.remove();document.documentElement.classList.remove('glassify-active');if(window.Glassify===instance)delete window.Glassify;}
  const instance={version:'1.2.0',destroy,getSettings:()=>({...settings})};window.Glassify=instance;
  function start(){if(dead)return;
    style=document.createElement('style');style.id='glassify-effects';document.head.append(style);host=document.createElement('div');host.id='glassify-host';document.body.append(host);root=host.attachShadow({mode:'open'});
    const toggles=[['enabled','Enable Glassify'],['panels','Main panels'],['sidebar','Settings sidebar'],['popups','Popup windows'],['mobile','Apply on mobile'],['hover','Hover glow']];
    const sliders=[['blur','Blur','px'],['opacity','Background opacity','%'],['radius','Corner radius','px'],['gloss','Reflections','%'],['edge','Embossed edges','%'],['shadow','Outer shadow','px'],['saturation','Backdrop saturation','%'],['contrast','Backdrop contrast','%'],['brightness','Backdrop brightness','%'],['layerStrength','Overlay strength','%'],['glow','Theme accent glow','%'],['overglow','Twin overglow intensity','%'],['glowAngle','Overglow angle','°']];
    root.innerHTML=`<style>
:host{font-family:inherit;font-size:14px;color:var(--color-text,#eee)}*{box-sizing:border-box}[hidden]{display:none!important}button,select,input{font:inherit}button{cursor:pointer}button:disabled{opacity:.45;cursor:default}#open{position:fixed;right:16px;bottom:16px;z-index:1000;border:1px solid var(--color-3,#789);border-radius:7px;padding:9px 13px;background:var(--color-1,#20252c);color:var(--color-5,#fff);box-shadow:0 4px 16px #0005;touch-action:none;user-select:none}dialog{font-family:inherit;font-size:14px;width:min(490px,calc(100vw - 24px));max-height:calc(100dvh - 24px);overflow:auto;padding:20px;border:1px solid var(--color-3,#789);border-radius:12px;background:var(--color-1,#20252c);color:var(--color-text,#eee);box-shadow:0 18px 60px #0008}dialog::backdrop{background:transparent;backdrop-filter:none;-webkit-backdrop-filter:none}header{cursor:move;touch-action:none;user-select:none;position:sticky;top:-20px;z-index:1;background:var(--color-1,#20252c);padding:8px 0;display:flex;align-items:center;justify-content:space-between;gap:12px}.brand{min-width:0;flex:1;text-align:center}.brand-logo{display:block;width:100%;max-width:380px;height:auto;margin:0 auto 4px;pointer-events:none;user-select:none}h2{margin:0;font-size:15px;font-weight:600}#close{flex-shrink:0;align-self:flex-start}h3{margin:20px 0 10px;font-size:16px}small,p{opacity:.8;line-height:1.5}#close{background:transparent;border:0;color:inherit;font-size:24px;padding:4px 9px}.presets,.actions{display:flex;gap:7px;margin:12px 0;flex-wrap:wrap}button:not(#open):not(#close),select{border:1px solid var(--color-3,#789);background:var(--color-2,#303640);color:inherit;border-radius:5px;padding:7px 10px}.switches{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin:16px 0}.switches label{display:flex;align-items:center;gap:7px}input{accent-color:var(--color-4,#8ad)}.slider{display:grid;grid-template-columns:1fr auto;margin:14px 0;gap:6px}.slider input{grid-column:1/-1;width:100%;margin:4px 0}.select-row{display:flex;align-items:center;justify-content:space-between;gap:10px;margin:12px 0}footer{margin-top:18px;border-top:1px solid var(--color-3,#789);padding-top:12px}#status,#mode{font-size:12px}#admin{border:1px solid var(--color-3,#789);padding:12px;border-radius:7px;margin-top:20px}#admin h3{margin-top:0}button:focus-visible,input:focus-visible,select:focus-visible{outline:2px solid var(--color-4,#8ad);outline-offset:3px}@media(max-width:360px){.switches{grid-template-columns:1fr}}

header{align-items:flex-start;background:transparent;gap:12px;position:relative;top:auto;padding:4px 0 10px}
.brand{flex:1;min-width:0;text-align:left}.brand-logo{width:100%;max-width:215px;height:auto;margin:0;pointer-events:none}
.header-actions{flex:0 1 150px;display:flex;flex-direction:column;align-items:flex-end;gap:8px;text-align:right;min-width:95px}
.version-label{font-size:10px;line-height:1.4;opacity:.85}
#close{width:32px;height:32px;display:grid;place-items:center;padding:0;border:1px solid var(--color-4,#8ad);border-radius:7px;background:var(--color-4,#8ad);color:var(--color-1,#20252c);font-size:24px;line-height:1;transition:background-color .12s ease,box-shadow .12s ease}
#close:hover{background:var(--color-5,#cef);box-shadow:0 0 10px var(--color-4,#8ad)}
.sr-only{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0}
#logo-fallback{font-size:22px;font-weight:800;color:var(--color-5,#fff)}

dialog{padding:12px 16px 20px}
header{display:grid;grid-template-columns:minmax(0,1fr) auto;align-items:start;gap:4px 8px;margin:0;padding:0}
.brand{grid-column:1;grid-row:1;align-self:center}.brand-logo{max-width:200px}
.header-actions{display:contents}
#close{grid-column:2;grid-row:1;justify-self:end;align-self:start;background:transparent;border-color:transparent;color:var(--color-4,#8ad);box-shadow:none}
#close:hover{background:var(--color-4,#8ad);border-color:var(--color-4,#8ad);color:var(--color-1,#20252c);box-shadow:0 0 10px var(--color-4,#8ad)}
.version-label{grid-column:1/-1;grid-row:2;justify-self:start;white-space:nowrap;font-size:10px;line-height:1.4;margin:0}
#logo-fallback{white-space:nowrap;font-size:clamp(16px,4vw,22px)}
.fallback-name{font-weight:800}.fallback-author{font-family:Arial,Helvetica,sans-serif;font-size:12px;font-weight:300;color:#fff}
h3,#mode{font-family:inherit;font-size:16px;font-weight:700;line-height:normal;opacity:1;margin:10px 0 6px}
dialog{padding:10px 16px 14px}
header{row-gap:2px}
.brand{align-self:start}
.version-label{grid-column:1/-1}
.update-slot{grid-column:1/-1;grid-row:3;min-height:16px;line-height:16px;font-size:11px}
#update-available{color:var(--color-4,#8ad);text-decoration:none;cursor:pointer}
#update-available:hover{text-decoration:underline;opacity:.85}
#close{position:relative;font-size:0}
#close::before,#close::after{content:"";position:absolute;left:50%;top:50%;width:14px;height:2px;border-radius:1px;background:currentColor;transform:translate(-50%,-50%) rotate(45deg)}
#close::after{transform:translate(-50%,-50%) rotate(-45deg)}
.switches{gap:8px 12px;margin:8px 0}
.presets,.actions{gap:6px;margin:8px 0}
.slider{margin:8px 0;gap:2px}
.slider input{margin:2px 0;min-height:18px}
.select-row{margin:8px 0}
footer{margin-top:10px;padding-top:8px}
footer p{margin:0 0 6px}
#admin{padding:10px;margin-top:10px}
#admin p{margin:6px 0}
</style><button id="open" type="button" aria-haspopup="dialog" title="Click to open · drag to move">◈ Glassify</button><dialog aria-labelledby="title"><header id="drag-header" tabindex="0" aria-label="Move settings window: drag or use arrow keys"><div class="brand"><img class="brand-logo" src="${LOGO}" alt="GLASSIFY" draggable="false"><h2 id="title" class="sr-only">Glassify</h2><span id="logo-fallback" hidden><span class="fallback-name">GLASSIFY</span> <span class="fallback-author">by MCelliotG</span></span></div><div class="header-actions"><button id="close" aria-label="Close" type="button">×</button><small class="version-label">Version 1.2.0 - Layered Glass plugin</small></div><div class="update-slot" aria-live="polite"><a id="update-available" href="${pluginHomepageUrl}" target="_blank" rel="noopener noreferrer" hidden></a></div></header><p id="mode"></p><div class="switches">${toggles.map(([k,l])=>`<label><input type="checkbox" name="${k}">${l}</label>`).join('')}</div><h3>Presets</h3><div class="presets">${Object.entries(model.looks).map(([k,p])=>`<button type="button" data-preset="${k}">${p.label}</button>`).join('')}</div><div class="actions"><button type="button" id="save-custom">Save Custom</button><button type="button" id="load-custom">Load Custom</button></div><label class="select-row">Overlay effect<select name="effect"><option value="none">None</option><option value="prism">Prism</option><option value="theme">Theme aware</option><option value="ripple">Ripple</option><option value="mist">Mist</option></select></label>${sliders.map(([k,l,u])=>`<label class="slider">${l}<span><output data-value="${k}"></output> ${u}</span><input aria-label="${l}" type="range" name="${k}" min="${model.ranges[k][0]}" max="${model.ranges[k][1]}" step="1"></label>`).join('')}<label class="select-row">Button position<select id="position"><option value="bottom-right">Bottom right</option><option value="bottom-left">Bottom left</option><option value="top-right">Top right</option><option value="top-left">Top left</option><option value="custom">Custom (drag button)</option></select></label><small>Drag the floating button anywhere. Drop near a corner to snap.</small><div class="actions"><button id="follow" type="button">Follow server defaults</button><button id="factory" type="button">Factory defaults (OFF)</button></div><section id="admin" hidden><h3>Admin · Server defaults</h3><small id="server-revision"></small><p>Publish the current appearance for visitors without personal settings. Existing personal settings are kept.</p><label><input id="admin-enabled" type="checkbox"> Enabled by default for visitors</label><div class="actions"><button id="publish" type="button">Save current look as server defaults</button><button id="reload" type="button">Reload defaults</button></div></section><footer><p>Backdrop effects are strongest over detailed backgrounds. OFF reveals the installed theme, including an existing glassmod.</p><span id="status" role="status"></span></footer></dialog>`;
    dialog=root.querySelector('dialog');opener=root.querySelector('#open');
    const on=(el,name,fn)=>el.addEventListener(name,fn,{signal:events.signal});
    on(root.querySelector('.brand-logo'),'error',()=>{root.querySelector('.brand-logo').hidden=true;root.querySelector('#logo-fallback').hidden=false;});
    const sidebar=document.querySelector('#myModal .modal-panel-content');
    if(sidebar){
      sideHost=document.createElement('div');sideHost.id='glassify-sidebar-control';sideHost.className='form-group';
      // Reuse the native checkbox markup and CSS, just like other plugin toggles.
      sideHost.innerHTML='<div class="switch flex-container flex-phone flex-phone-column flex-phone-center"><input type="checkbox" tabindex="0" id="glassify-enabled" aria-label="Enable Glassify" role="switch"><label for="glassify-enabled"></label><span class="text-smaller text-uppercase text-bold color-4 p-10">Enable Glassify</span></div>';
      sideInput=sideHost.querySelector('input');
      function positionSwitch(){
        if(dead)return;
        const peers=Array.from(sidebar.querySelectorAll('.switch')).filter(el=>el!==sideInput.parentElement && /enable\s+(?:ui\s*addon|audiometrix)/i.test(el.textContent));
        const peer=peers.at(-1)?.closest('.form-group');
        const anchor=peer||sidebar.querySelector('#imperial-units')?.closest('.form-group');
        if(anchor?.parentNode){if(anchor.nextSibling!==sideHost)anchor.parentNode.insertBefore(sideHost,anchor.nextSibling);}
        else if(!sideHost.isConnected)sidebar.append(sideHost);
      }
      positionSwitch();
      // Other plugins can insert their switches after Glassify initializes.
      sidebarObserver=new MutationObserver(positionSwitch);
      sidebarObserver.observe(sidebar,{childList:true,subtree:true});
      on(sideInput,'change',()=>edit({enabled:sideInput.checked}));
    }

    on(opener,'click',()=>{if(suppressClick){suppressClick=false;return;}show();});
    on(root.querySelector('#close'),'click',close);on(dialog,'cancel',e=>{e.preventDefault();close();});
    on(dialog,'click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)close();}});
    on(root,'input',e=>{const el=e.target;if(!Object.hasOwn(model.defaults,el.name||''))return;edit({[el.name]:el.type==='checkbox'?el.checked:el.name==='effect'?el.value:Number(el.value)});});
    for(const el of root.querySelectorAll('[data-preset]'))on(el,'click',()=>{personal=model.preset(settings,el.dataset.preset);apply();persist();status(`${model.looks[el.dataset.preset].label} applied. Enable Glassify to preview if OFF.`);});
    on(root.querySelector('#save-custom'),'click',()=>{custom={...settings};sync();if(persist())status('Custom preset saved.');});
    on(root.querySelector('#load-custom'),'click',()=>{if(custom){const values={};for(const k of model.visualKeys)values[k]=custom[k];edit(values);status('Custom appearance loaded.');}});
    on(root.querySelector('#factory'),'click',()=>{personal={...model.defaults};apply();persist();status('Factory defaults restored; Glassify is OFF.');});
    on(root.querySelector('#follow'),'click',()=>{personal=null;apply();persist();refresh();});
    on(root.querySelector('#reload'),'click',()=>refresh());
    on(root.querySelector('#publish'),'click',async()=>{const button=root.querySelector('#publish');if(!loaded||!canAdmin)return;const next=model.sanitize({...settings,enabled:root.querySelector('#admin-enabled').checked});button.disabled=true;try{const data=await api('PUT',{settings:next,revision});if(dead)return;server=model.sanitize(data.settings);revision=data.revision;root.querySelector('#admin-enabled').checked=server.enabled;apply();status('Server defaults saved. Personal preferences were not overwritten.');}catch(e){if(!dead)status(e.message);}finally{if(!dead)button.disabled=false;}});
    on(root.querySelector('#position'),'change',e=>{position=sanitizePosition({...position,corner:e.target.value});place();persist();});
    on(opener,'pointerdown',e=>{if(e.button!==0)return;suppressClick=false;const r=opener.getBoundingClientRect();drag={id:e.pointerId,startX:e.clientX,startY:e.clientY,left:r.left,top:r.top,moved:false};opener.setPointerCapture(e.pointerId);});
    on(opener,'pointermove',e=>{if(!drag||drag.id!==e.pointerId)return;const dx=e.clientX-drag.startX,dy=e.clientY-drag.startY;if(!drag.moved&&Math.hypot(dx,dy)<6)return;drag.moved=true;const {w,h}=viewport(),r=opener.getBoundingClientRect(),mx=Math.max(0,w-r.width),my=Math.max(0,h-r.height);position={corner:'custom',x:mx?Math.min(mx,Math.max(0,drag.left+dx))/mx:0,y:my?Math.min(my,Math.max(0,drag.top+dy))/my:0};place();});
    on(opener,'pointerup',e=>{if(!drag||drag.id!==e.pointerId)return;if(drag.moved){const {w,h}=viewport(),r=opener.getBoundingClientRect();const left=r.left<36,right=w-r.right<36,top=r.top<36,bottom=h-r.bottom<36;if((left||right)&&(top||bottom))position.corner=(top?'top':'bottom')+'-'+(left?'left':'right');suppressClick=true;place();sync();persist();}drag=null;if(opener.hasPointerCapture(e.pointerId))opener.releasePointerCapture(e.pointerId);});
    on(opener,'pointercancel',()=>{drag=null;suppressClick=false;place();persist();});on(window,'resize',()=>{place();if(panelPosition)placePanel(panelPosition.x,panelPosition.y);});
    const header=root.querySelector('#drag-header');
    on(header,'pointerdown',e=>{
      if(e.button!==0||e.target.closest('button,a'))return;
      const r=dialog.getBoundingClientRect();panelDrag={id:e.pointerId,x:e.clientX,y:e.clientY,left:r.left,top:r.top};
      header.setPointerCapture(e.pointerId);e.preventDefault();
    });
    on(header,'pointermove',e=>{if(panelDrag?.id===e.pointerId)placePanel(panelDrag.left+e.clientX-panelDrag.x,panelDrag.top+e.clientY-panelDrag.y);});
    on(header,'pointerup',e=>{if(panelDrag?.id!==e.pointerId)return;panelDrag=null;if(header.hasPointerCapture(e.pointerId))header.releasePointerCapture(e.pointerId);});
    on(header,'pointercancel',()=>{panelDrag=null;});
    on(header,'keydown',e=>{
      if(e.target!==header)return;
      const delta={ArrowLeft:[-1,0],ArrowRight:[1,0],ArrowUp:[0,-1],ArrowDown:[0,1]}[e.key];
      if(!delta)return;e.preventDefault();const r=dialog.getBoundingClientRect(),step=e.shiftKey?1:10;
      placePanel(r.left+delta[0]*step,r.top+delta[1]*step);
    });
    apply();place();if(migrated)persist();refresh(true);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true,signal:events.signal});else start();

})();
