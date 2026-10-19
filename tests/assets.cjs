const fs=require('fs'),path=require('path'),os=require('os'),vm=require('vm'),assert=require('assert');
const source=fs.readFileSync(path.join(__dirname,'../plugins/Glassify.js'),'utf8');
for(const linked of [false,true]){
 const dir=fs.mkdtempSync(path.join(os.tmpdir(),'glassify-assets-'));
 const plugins=path.join(dir,'plugins'),asset=path.join(plugins,'glassify/assets/glassify-logo.png');
 fs.mkdirSync(path.dirname(asset),{recursive:true});fs.writeFileSync(asset,'asset-test-bytes');
 fs.mkdirSync(path.join(dir,'web/js'),{recursive:true});
 if(linked)fs.symlinkSync(plugins,path.join(dir,'web/js/plugins'),'dir');
 const dest=path.join(dir,'web/js/plugins/glassify/assets/glassify-logo.png');
 function run(){let callback;vm.runInNewContext(source,{__dirname:plugins,module:{exports:{}},setImmediate:fn=>callback=fn,console,require:p=>p==='fs'?fs:p==='path'?path:p.endsWith('server_config')?{serverConfig:{plugins:['glassify/glassify.js']},configPath:path.join(dir,'config.json')}:p.endsWith('endpoints')?{}:{register(){}}});callback();}
 run();assert.equal(fs.readFileSync(dest,'utf8'),'asset-test-bytes');run();assert.equal(fs.readFileSync(dest,'utf8'),'asset-test-bytes');
 fs.unlinkSync(asset);run();assert(!fs.existsSync(dest));fs.rmSync(dir,{recursive:true,force:true});
}
console.log('PASS: static logo copy, repeated startup, shared directory symlink, missing-source cleanup.');
