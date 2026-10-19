const vm=require('vm'),fs=require('fs'),assert=require('assert'),path=require('path');
const model=require('../plugins/glassify/model');const source=fs.readFileSync(path.join(__dirname,'../plugins/glassify/glassify.js'),'utf8');
const flush=()=>new Promise(r=>setImmediate(r));
function boot(raw=null,serverValues={},legacy=null,remoteVersion="1.2.0"){
 const nodes=[],classes=new Set(),store=new Map(),data=new Map();if(raw)store.set('glassify.settings.v2',JSON.stringify(raw));if(legacy)store.set('glassify.settings.v1',JSON.stringify(legacy));let published;
 class Element{
 constructor(){this.style={setProperty(k,v){this[k]=v}};this.children=[];this.listeners={};this.checked=false;this.open=false;this.textContent='';this.dataset={};}
 append(x){this.children.push(x);nodes.push(x);x.isConnected=true}remove(){this.removed=true}attachShadow(){this.shadowRoot=new Element();return this.shadowRoot}set innerHTML(v){this.html=v}querySelector(k){if(k==='h1')return null;if(!this.map)this.map=new Map();if(!this.map.has(k))this.map.set(k,new Element());return this.map.get(k)}closest(){return null}querySelectorAll(){return []}insertBefore(x){this.append(x)}
 addEventListener(n,fn,opt){(this.listeners[n]??=[]).push({fn,opt})}emit(n,e={}){for(const {fn,opt} of this.listeners[n]||[])if(!opt?.signal?.aborted)fn(e)}focus(){}showModal(){this.open=true}close(){this.open=false}getBoundingClientRect(){const left=parseFloat(this.style.left)||16,top=parseFloat(this.style.top)||16;return {left,top,right:left+110,bottom:top+40,width:110,height:40}}setPointerCapture(){}hasPointerCapture(){return true}releasePointerCapture(){}
 }
 const side=new Element();const doc={readyState:'complete',head:new Element(),body:new Element(),documentElement:{clientWidth:1000,classList:{toggle(k,v){v?classes.add(k):classes.delete(k)},remove(k){classes.delete(k)}}},createElement:()=>new Element(),querySelector:()=>side};const win=new Element();const ctx={document:doc,window:win,innerWidth:1000,innerHeight:800,MutationObserver:class{observe(){}disconnect(){}},AbortController,URL,location:{href:'http://localhost:8080/'},setTimeout,clearTimeout,console,localStorage:{getItem:k=>store.get(k)||null,setItem:(k,v)=>store.set(k,v)},fetch:async(url,opts)=>{if(String(url).startsWith('https://raw.githubusercontent.com/'))return {ok:true,text:async()=>`const pluginVersion = '${remoteVersion}';`};if(opts.method==='PUT'){published=JSON.parse(opts.body);return {ok:true,json:async()=>({revision:2,settings:published.settings})}}return {ok:true,json:async()=>({revision:1,settings:{...model.defaults,...serverValues},canAdmin:true,csrf:'a'.repeat(64)})}}};vm.createContext(ctx);vm.runInContext(source,ctx);
 return {ctx,nodes,side,store,classes,get ui(){return nodes.find(n=>n.id==='glassify-host'&&!n.removed).shadowRoot},get effects(){return nodes.find(n=>n.id==='glassify-effects'&&!n.removed)},get published(){return published},saved(){return JSON.parse(store.get('glassify.settings.v2')||'null')}};
}
(async()=>{
 let x=boot();assert.equal(x.ctx.window.Glassify.getSettings().enabled,false);await flush();assert.equal(x.effects.textContent,'');assert.equal(x.ui.querySelector('#open').hidden,true);
 let input=x.side.children[0].querySelector('input');input.checked=true;input.emit('change');assert.equal(x.ctx.window.Glassify.getSettings().enabled,true);assert(x.effects.textContent.includes('backdrop-filter'));assert.equal(x.ui.querySelector('#open').hidden,false);assert(!/(?:^|[;{])\s*(?:width|height|min-width|max-width|margin(?:-[a-z]+)?|padding(?:-[a-z]+)?|position|display)\s*:/m.test(x.effects.textContent));assert.equal(x.saved().personal.enabled,true);
 const floating=x.ui.querySelector('#open');floating.emit('click');
 const panel=x.ui.querySelector('dialog'),header=x.ui.querySelector('#drag-header');assert(panel.open);assert(panel.style.backdropFilter.includes('blur(5px)'));assert(panel.style.background.includes('color-mix'));assert(!source.includes('data:image/png;base64'));assert(source.includes('Version 1.2.0 - Layered Glass plugin'));
 assert(x.ui.html.includes('dialog::backdrop{background:transparent;backdrop-filter:none'));
 header.emit('pointerdown',{button:0,pointerId:2,clientX:200,clientY:200,target:header,preventDefault(){}});
 header.emit('pointermove',{pointerId:2,clientX:9999,clientY:9999});assert.equal(panel.style.left,'890px');assert.equal(panel.style.top,'760px');
 header.emit('pointerup',{pointerId:2});header.emit('keydown',{target:header,key:'ArrowLeft',shiftKey:false,preventDefault(){}});assert.equal(panel.style.left,'880px');
 x.ui.querySelector('#close').emit('click');assert(!panel.open);
 x.ui.querySelector('#save-custom').emit('click');assert(x.saved().custom);let before=x.ctx.window.Glassify.getSettings();x.ui.querySelector('#factory').emit('click');assert.equal(x.ctx.window.Glassify.getSettings().enabled,false);x.ui.querySelector('#load-custom').emit('click');assert.equal(x.ctx.window.Glassify.getSettings().enabled,false);assert.equal(x.ctx.window.Glassify.getSettings().blur,before.blur);
 input.checked=true;input.emit('change');
 let pos=x.ui.querySelector('#position');pos.value='top-left';pos.emit('change',{target:pos});assert.equal(x.saved().position.corner,'top-left');assert.equal(x.ui.querySelector('#open').style.left,'16px');
 let open=x.ui.querySelector('#open');open.emit('pointerdown',{button:0,pointerId:1,clientX:20,clientY:20});open.emit('pointermove',{pointerId:1,clientX:400,clientY:300});open.emit('pointerup',{pointerId:1});assert.equal(x.saved().position.corner,'custom');open.emit('click');assert.equal(x.ui.querySelector('dialog').open,false);
 input.checked=false;input.emit('change');assert.equal(x.ui.querySelector('#open').hidden,true);
 x.ui.querySelector('#admin-enabled').checked=true;x.ui.querySelector('#publish').emit('click');await flush();assert.equal(x.published.settings.enabled,true);assert.equal(x.ctx.window.Glassify.getSettings().enabled,false); // personal retained
 x.ui.querySelector('#follow').emit('click');await flush();assert.equal(x.saved().personal,null);x.ctx.window.Glassify.destroy();assert.equal(x.classes.size,0);assert(x.nodes.every(n=>n.removed));
 x=boot(null,{enabled:true,blur:18});await flush();assert.equal(x.ctx.window.Glassify.getSettings().blur,18);assert.equal(x.ctx.window.Glassify.getSettings().enabled,true);assert(!x.saved());
 x.ctx.window.Glassify.destroy();
 x=boot({version:2,personal:{...model.defaults,enabled:false,blur:3},custom:null,position:{corner:'bottom-left'}},{enabled:true,blur:18});await flush();assert.equal(x.ctx.window.Glassify.getSettings().enabled,false);assert.equal(x.ctx.window.Glassify.getSettings().blur,3);vm.runInContext(source,x.ctx);await flush();assert.equal(x.nodes.filter(n=>!n.removed&&n.id==='glassify-host').length,1);x.ctx.window.Glassify.destroy();
 x=boot(null,{}, {...model.defaults,enabled:true,blur:8});await flush();assert.equal(x.saved().personal.blur,8);assert.equal(x.ctx.window.Glassify.getSettings().enabled,true);x.ctx.window.Glassify.destroy();
 for(const [remote,visible] of [['1.2.1',true],['1.10.0',true],['1.2.0',false],['1.1.2',false],['invalid',false]]){
  x=boot(null,{},null,remote);await flush();x.ui.querySelector('#update-available').hidden=true;
  x.ui.querySelector('#open').emit('click');await flush();
  assert.equal(x.ui.querySelector('#update-available').hidden,!visible);
  if(visible)assert.equal(x.ui.querySelector('#update-available').textContent,`Update available: v${remote}`);
  x.ctx.window.Glassify.destroy();
 }
 x=boot(null,{enabled:true,glow:75,overglow:80,glowAngle:90,effect:'theme'});await flush();
 assert(x.effects.textContent.includes('var(--color-main-bright'));
 assert(x.effects.textContent.includes('7.00px -0.00px 12px -5px'));
 assert(x.effects.textContent.includes('0 0 24px color-mix'));
 assert(!/(?:^|[;{])\s*(?:width|height|margin|padding|position|display)\s*:/m.test(x.effects.textContent));
 x.ui.querySelector('#open').emit('click');
 assert(x.ui.querySelector('dialog').style.boxShadow.includes('0 0 24px color-mix'));
 x.ui.querySelector('#save-custom').emit('click');assert.equal(x.saved().custom.overglow,80);
 x.ctx.window.Glassify.destroy();
 console.log('PASS frontend (mock DOM): default OFF, sidebar toggle, server inheritance vs personal settings, Custom, corner selection/free drag, click suppression, admin publication independent of local state, follow/reset, v1 migration, cleanup and double initialization.');
})().catch(e=>{console.error(e);process.exitCode=1});
