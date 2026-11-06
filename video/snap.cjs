// Usage: node snap.cjs <outdir> <t1> <t2> ...  -> JPG frames for quick visual checks
const { chromium } = require('playwright');
const path = require('path');
(async()=>{
const [outDir,...times]=process.argv.slice(2);
const b=await chromium.launch();const p=await b.newPage({viewport:{width:1920,height:1080}});
p.on('pageerror',e=>console.error('PAGEERR',e.message));
await p.goto('file://'+path.resolve(__dirname,'index.html')+'?render=1');
await p.evaluate(()=>document.fonts.ready);
console.log('TOTAL',await p.evaluate(()=>TOTAL));
for(const t of times){await p.evaluate(t=>renderAt(t),+t);await p.screenshot({path:`${outDir}/s_${t}.jpg`,type:'jpeg',quality:70});}
await b.close();})();
