const assert=require('assert'),fs=require('fs'),os=require('os'),path=require('path'),vm=require('vm');
const {register}=require('../plugins/glassify/backend'),model=require('../plugins/glassify/model');
const dir=fs.mkdtempSync(path.join(os.tmpdir(),'glassify-test-')),file=path.join(dir,'config.glassify.json');
const routes={};register({get:(p,f)=>routes.GET=f,put:(p,f)=>routes.PUT=f},file);
function call(method,{session={},body,token}={}){const res={code:200,set(){return this},status(n){this.code=n;return this},json(value){this.body=value;return this}};routes[method]({session,body,get:()=>token},res);return res;}
const admin={isAdminAuthenticated:true};
assert.equal(call('GET').body.settings.enabled,false);assert.equal(call('GET').body.csrf,null);
const auth=call('GET',{session:admin});assert(auth.body.canAdmin);assert.match(auth.body.csrf,/^[a-f0-9]{64}$/);
let body={revision:0,settings:{...model.defaults,enabled:true,effect:'prism'}};
assert.equal(call('PUT',{body}).code,403);
assert.equal(call('PUT',{session:{isTuneAuthenticated:true},body}).code,403);
assert.equal(call('PUT',{session:admin,body,token:'z'.repeat(64)}).code,403);
assert.equal(call('PUT',{session:admin,body,token:'λ'.repeat(64)}).code,403);
assert.equal(call('PUT',{session:admin,body:{revision:0,settings:{...body.settings,blur:999}},token:auth.body.csrf}).code,400);
assert.equal(call('PUT',{session:admin,body,token:auth.body.csrf}).code,200);
assert.equal(call('GET').body.settings.enabled,true);
assert.equal(call('PUT',{session:admin,body,token:auth.body.csrf}).code,409);
const routes2={};register({get:(p,f)=>routes2.GET=f,put:()=>{}},file);let disk;routes2.GET({session:{}},{set(){},json(v){disk=v}});assert.equal(disk.revision,1);assert.equal(disk.settings.effect,'prism');
const fail={};register({get:(p,f)=>fail.GET=f,put:(p,f)=>fail.PUT=f},path.join(dir,'missing','file.json'),{error(){},warn(){}});let auth2;const s2={isAdminAuthenticated:true};fail.GET({session:s2},{set(){},json(v){auth2=v}});let code;fail.PUT({session:s2,get:()=>auth2.csrf,body:{revision:0,settings:body.settings}},{set(){},status(c){code=c;return this},json(){}});assert.equal(code,500);
for(const p of Object.keys(model.looks))assert(model.valid(model.preset(model.defaults,p)));
assert.equal(model.sanitize({blur:Infinity}).blur,5);
// Exercise the real metadata loader and verify deferred, enabled-only registration.
const loader=fs.readFileSync(path.join(__dirname,'../plugins/Glassify.js'),'utf8');
for(const enabled of [false,true]){let scheduled,registered=0;const router={};const context={__dirname:'/server/plugins',module:{exports:{}},setImmediate:fn=>scheduled=fn,console,require:p=>p==='fs'?{existsSync:()=>false}:p==='path'?path:p.endsWith('server_config')?{serverConfig:{plugins:enabled?['glassify/glassify.js']:[]},configPath:'/private/config.json'}:p.endsWith('endpoints')?router:{register:(r,f)=>{assert.equal(r,router);assert.equal(f,'/private/config.glassify.json');registered++;}}};vm.runInNewContext(loader,context);assert.equal(registered,0);scheduled();assert.equal(registered,enabled?1:0);}
const oldSettings={...model.defaults,enabled:true,blur:17};delete oldSettings.glow;delete oldSettings.overglow;delete oldSettings.glowAngle;
fs.writeFileSync(file,JSON.stringify({revision:7,settings:oldSettings}));
const migratedRoutes={};register({get:(p,f)=>migratedRoutes.GET=f,put(){}},file);
let migratedState;migratedRoutes.GET({session:{}},{set(){},json(v){migratedState=v}});
assert.equal(migratedState.revision,7);assert.equal(migratedState.settings.blur,17);assert.equal(migratedState.settings.enabled,true);assert.equal(migratedState.settings.glow,0);
assert(model.valid({...model.defaults,effect:'theme',glow:100,overglow:100,glowAngle:360}));
assert(!model.valid({...model.defaults,glowAngle:361}));
fs.rmSync(dir,{recursive:true});console.log('PASS backend: default OFF, admin vs tune authorization, CSRF including malformed Unicode, validation, revision conflicts, atomic persistence/reload/failure and deferred enabled-only loader.');
