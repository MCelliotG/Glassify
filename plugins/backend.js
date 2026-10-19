'use strict';
const crypto=require('crypto');
const fs=require('fs');
const path=require('path');
const model=require('./model');
function register(router,filename,log=console) {
  let state={revision:0,settings:{...model.defaults}};
  try {const data=JSON.parse(fs.readFileSync(filename,'utf8'));data.settings={glow:0,overglow:0,glowAngle:90,...data.settings};if(!model.valid(data.settings)||!Number.isSafeInteger(data.revision)||data.revision<0)throw Error('Invalid saved defaults');state=data;}
  catch(e){if(e.code!=='ENOENT')log.warn('Glassify: saved defaults could not be read; using OFF defaults.');}
  const admin=req=>req.session?.isAdminAuthenticated===true;
  function token(req){if(typeof req.session.glassifyCsrf!=='string')req.session.glassifyCsrf=crypto.randomBytes(32).toString('hex');return req.session.glassifyCsrf;}
  router.get('/glassify/assets/glassify-logo.png',(req,res)=>{
    res.sendFile(path.join(__dirname,'assets','glassify-logo.png'),{maxAge:'1h'});
  });
  router.get('/glassify/api/defaults',(req,res)=>{
    res.set('Cache-Control','no-store');
    const canAdmin=admin(req);res.json({revision:state.revision,settings:state.settings,canAdmin,csrf:canAdmin?token(req):null});
  });
  router.put('/glassify/api/defaults',(req,res)=>{
    res.set('Cache-Control','no-store');
    if(!admin(req))return res.status(403).json({error:'Administrator login required.'});
    const supplied=req.get('X-Glassify-CSRF'),expected=req.session.glassifyCsrf;
    if(typeof supplied!=='string'||!/^[a-f0-9]{64}$/.test(supplied)||typeof expected!=='string'||supplied.length!==expected.length||!crypto.timingSafeEqual(Buffer.from(supplied),Buffer.from(expected)))return res.status(403).json({error:'Reload Glassify settings and try again.'});
    if(!model.valid(req.body?.settings)||!Number.isSafeInteger(req.body?.revision))return res.status(400).json({error:'Invalid settings.'});
    if(req.body.revision!==state.revision)return res.status(409).json({error:'Server defaults changed. Reload defaults before saving.'});
    const next={revision:state.revision+1,settings:model.sanitize(req.body.settings)};
    const temporary=filename+'.'+crypto.randomBytes(8).toString('hex')+'.tmp';
    try {fs.writeFileSync(temporary,JSON.stringify(next,null,2),{mode:0o600,flag:'wx'});fs.renameSync(temporary,filename);}
    catch(e){try{fs.unlinkSync(temporary);}catch{}log.error('Glassify: could not save defaults.');return res.status(500).json({error:'Server could not save defaults.'});}
    state=next;res.json({revision:state.revision,settings:state.settings});
  });
}
module.exports={register};
