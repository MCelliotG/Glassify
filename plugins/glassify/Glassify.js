'use strict';
const pluginConfig={name:'Glassify',version:'1.3.1',author:'MCelliotG',frontEndPath:'glassify/glassify.js'};
module.exports={pluginConfig};
// Metadata is collected while endpoints.js is still loading. Defer registration
// until that synchronous require chain has completed, and only if enabled.
setImmediate(()=>{
  const {serverConfig,configPath}=require('../server/server_config');
  if(!Array.isArray(serverConfig.plugins)||!serverConfig.plugins.includes(pluginConfig.frontEndPath))return;
  // Serve assets next to the frontend on both Linux file symlinks and Windows junctions.
  const fs=require('fs'),path=require('path');
  const source=path.join(__dirname,'glassify','assets','glassify-logo.png');
  const destination=path.join(__dirname,'..','web','js','plugins','glassify','assets','glassify-logo.png');
  try {
    if(fs.existsSync(source)){
      fs.mkdirSync(path.dirname(destination),{recursive:true});
      if(!fs.existsSync(destination)||fs.realpathSync(source)!==fs.realpathSync(destination))fs.copyFileSync(source,destination);
    }else if(fs.existsSync(destination)){fs.unlinkSync(destination);}
  }catch(e){console.warn('Glassify: logo asset unavailable; using text branding.');}
  const router=require('../server/endpoints');
  const {register}=require('./glassify/backend');
  register(router,configPath.replace(/\.json$/i,'')+'.glassify.json');
});
