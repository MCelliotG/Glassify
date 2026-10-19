'use strict';
const ranges = {blur:[0,30],opacity:[10,100],radius:[0,24],gloss:[0,150],edge:[0,150],shadow:[0,30],saturation:[0,250],contrast:[50,180],brightness:[50,150],layerStrength:[0,100],glow:[0,100],overglow:[0,100],glowAngle:[0,360]};
const effects = ['none','prism','theme','ripple','mist','frosted','obscure','mica'];
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
 frosted:{label:'Frosted',values:{blur:8,opacity:25,gloss:50,edge:80,effect:'frosted',layerStrength:35}},
 clear:{label:'Clear',values:{blur:3,opacity:20,gloss:110,edge:80}},
 obscure:{label:'Obscure',values:{blur:3,opacity:22,gloss:65,edge:95,effect:'obscure',layerStrength:40}},
 mica:{label:'Mica',values:{blur:20,opacity:45,gloss:20,edge:45,effect:'mica',layerStrength:35,saturation:115}},
 smoked:{label:'Smoked',values:{blur:12,opacity:55,brightness:75,saturation:65,gloss:35,shadow:18}},
 crystal:{label:'Crystal',values:{blur:2,opacity:18,contrast:145,saturation:160,gloss:135,edge:140,shadow:12}},
 prism:{label:'Prism',values:{blur:8,opacity:25,effect:'prism',layerStrength:55,saturation:180,contrast:115,gloss:120}},
 ripple:{label:'Ripple',values:{blur:5,opacity:20,effect:'ripple',layerStrength:35,contrast:105,saturation:110,gloss:55}},
 aurora:{label:'Aurora',values:{blur:20,opacity:25,effect:'prism',layerStrength:75,saturation:220,brightness:115,edge:60}},
 mist:{label:'Mist',values:{blur:24,opacity:35,effect:'mist',layerStrength:60,saturation:75,contrast:90,gloss:70}}
};
const visualKeys=['blur','opacity','radius','gloss','edge','shadow','saturation','contrast','brightness','layerStrength','effect','glow','overglow','glowAngle'];
function preset(current,id){const p=looks[id];if(!p)return sanitize(current);const out={...current};for(const k of visualKeys)out[k]=defaults[k];return sanitize({...out,...p.values});}
module.exports={ranges,effects,defaults,sanitize,valid,looks,visualKeys,preset};
