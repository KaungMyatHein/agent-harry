#!/usr/bin/env node
// Build docs/graph.html — an Obsidian-style force-directed "brain" graph of the 22 agents.
// Nodes are the agents (rendered as their 8-bit mascots), clustered into phase lobes.
// Click a node → bilingual doc panel (English default, Burmese toggle), sourced from
// content/posts/{en,my}/<agent>.md. Self-contained static HTML (no deps, Jekyll-passthrough).
//
// Usage: node content/scripts/build-graph.mjs

import { readFileSync, existsSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");          // content/
const REPO = resolve(ROOT, "..");               // repo root
const MASCOTS = join(REPO, "docs", "_includes", "mascots");
const OUT = join(REPO, "docs", "graph.html");

const PHASES = {
  meta:            { color:"#7c79f0", c2:"#a78bfa", label:"Meta" },
  discovery:       { color:"#2a93ff", c2:"#38b6ff", label:"Discovery", sub:"Understand the problem" },
  define:          { color:"#9a5cf0", c2:"#b15cff", label:"Define", sub:"Decide what to build" },
  deliver:         { color:"#16b69b", c2:"#1cb89a", label:"Deliver", sub:"Make it real" },
  "cross-cutting": { color:"#e3568c", c2:"#f0568c", label:"Cross-cutting", sub:"Run any time" },
};

const AGENTS = [
  { f:"orchestrator", phase:"meta", model:"opus", tagline:"Decomposes the goal, sequences the agents, enforces the gates." },
  { f:"discovery-researcher", phase:"discovery", model:"sonnet", tagline:"Turns raw data and interviews into framed problems." },
  { f:"competitive-analyst", phase:"discovery", model:"sonnet", tagline:"Teardowns, pattern audits, and feature-gap maps." },
  { f:"pm-strategist", phase:"define", model:"sonnet", tagline:"Vision, business model, pricing, north-star." },
  { f:"product-positioner", phase:"define", model:"sonnet", tagline:"Sharpens what it IS and ISN'T." },
  { f:"feature-prioritizer", phase:"define", model:"sonnet", tagline:"What to build, in what order, and what to cut." },
  { f:"ideation-facilitator", phase:"define", model:"sonnet", tagline:"Diverge before you converge." },
  { f:"prd-author", phase:"define", model:"sonnet", tagline:"One PRD per shipped sub-feature." },
  { f:"information-architect", phase:"define", model:"sonnet", tagline:"Maps the product's bones before anyone sketches." },
  { f:"lo-fi-designer", phase:"define", model:"sonnet", tagline:"Three layouts before falling in love with one." },
  { f:"figma-designer", phase:"deliver", model:"sonnet", tagline:"Lo-fi boxes become real Figma screens." },
  { f:"design-engineer", phase:"deliver", model:"sonnet", tagline:"A real prototype in your real stack." },
  { f:"design-sync", phase:"deliver", model:"sonnet", tagline:"Mirrors Figma to code 1:1. Invents nothing." },
  { f:"usability-tester", phase:"deliver", model:"sonnet", tagline:"Tests designed to falsify, not flatter." },
  { f:"accessibility-auditor", phase:"deliver", model:"sonnet", tagline:"Measures a11y with axe-core. Never guesses." },
  { f:"handoff-engineer", phase:"deliver", model:"sonnet", tagline:"Everything dev actually needs." },
  { f:"pm-launch-architect", phase:"deliver", model:"sonnet", tagline:"From 'designed' to 'in market and growing'." },
  { f:"critique-partner", phase:"cross-cutting", model:"opus", tagline:"Stress-tests any agent's output." },
  { f:"pm-metrics-architect", phase:"cross-cutting", model:"sonnet", tagline:"One number to chase, three to watch, one to fear." },
  { f:"brand-decoder", phase:"cross-cutting", model:"sonnet", tagline:"Decodes how a brand actually thinks." },
  { f:"product-fingerprint-curator", phase:"cross-cutting", model:"sonnet", tagline:"Captures the product's real visual language." },
  { f:"figma-component-bootstrapper", phase:"cross-cutting", model:"sonnet", tagline:"Gives every project a real component library." },
];

function readIf(p){ return existsSync(p) ? readFileSync(p,"utf8") : null; }

const ANCHOR = {
  meta:           [0, -0.05],
  discovery:      [-1.05, -0.18],
  define:         [0, -0.95],
  deliver:        [1.05, -0.18],
  "cross-cutting":[0, 0.92],
};

const nodes = [];
for (const a of AGENTS){
  nodes.push({
    id:a.f, kind:"agent", phase:a.phase, model:a.model, name:a.f, tagline:a.tagline,
    mascot: readIf(join(MASCOTS, `${a.f}.svg`)) || "",
    en: readIf(join(ROOT,"posts","en",`${a.f}.md`)) || "",
    my: readIf(join(ROOT,"posts","my",`${a.f}.md`)) || "",
    ax: ANCHOR[a.phase][0], ay: ANCHOR[a.phase][1],
  });
}
for (const key of ["discovery","define","deliver","cross-cutting"]){
  nodes.push({ id:"hub:"+key, kind:"hub", phase:key, name:PHASES[key].label, sub:PHASES[key].sub||"",
    ax:ANCHOR[key][0], ay:ANCHOR[key][1] });
}

const edges = [];
for (const a of AGENTS){ if (a.phase!=="meta") edges.push(["hub:"+a.phase, a.f]); }
edges.push(["orchestrator","hub:discovery"],["orchestrator","hub:define"],["orchestrator","hub:deliver"],["orchestrator","hub:cross-cutting"]);
edges.push(["hub:discovery","hub:define"],["hub:define","hub:deliver"]);
edges.push(["hub:cross-cutting","hub:discovery"],["hub:cross-cutting","hub:define"],["hub:cross-cutting","hub:deliver"]);

const DATA = { phases:PHASES, nodes, edges };

const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Agent Harry — Agent Graph</title>
<style>
  :root{ --bg:#0a0c10; --ink:#e8ecf2; --muted:#8a93a3; --panel:#11141b; --line:#20242e; }
  *{margin:0;padding:0;box-sizing:border-box}
  html,body{height:100%;overflow:hidden;background:var(--bg);color:var(--ink);
    font-family:'SF Pro Display','SF Pro Text',system-ui,-apple-system,'Segoe UI',sans-serif;-webkit-font-smoothing:antialiased}
  #stage{position:fixed;inset:0}
  canvas{display:block;width:100%;height:100%}
  .top{position:fixed;top:22px;left:24px;z-index:5;pointer-events:none}
  .top h1{font-size:21px;font-weight:600;letter-spacing:-.3px}
  .top p{font-size:13px;color:var(--muted);margin-top:3px;letter-spacing:.2px}
  .lang{position:fixed;top:22px;right:24px;z-index:6;display:flex;background:#161a22;border:1px solid var(--line);border-radius:999px;overflow:hidden}
  .lang button{appearance:none;border:0;background:transparent;color:var(--muted);font:600 13px/1 inherit;padding:9px 16px;cursor:pointer;letter-spacing:.04em}
  .lang button.on{background:#2a2f3b;color:#fff}
  .legend{position:fixed;left:24px;bottom:20px;z-index:5;display:flex;gap:16px;flex-wrap:wrap;font-size:12px;color:var(--muted)}
  .legend span{display:flex;align-items:center;gap:7px}
  .legend i{width:10px;height:10px;border-radius:3px;display:inline-block}
  .hint{position:fixed;right:24px;bottom:20px;z-index:5;font-size:12px;color:var(--muted)}
  #panel{position:fixed;top:0;right:0;height:100%;width:min(460px,92vw);background:var(--panel);
    border-left:1px solid var(--line);transform:translateX(102%);transition:transform .32s cubic-bezier(.2,.7,.2,1);
    z-index:8;display:flex;flex-direction:column;box-shadow:-30px 0 60px -30px rgba(0,0,0,.7)}
  #panel.open{transform:none}
  .ph{padding:26px 28px 18px;border-bottom:1px solid var(--line);position:relative}
  .ph .close{position:absolute;top:20px;right:22px;cursor:pointer;color:var(--muted);font-size:22px;line-height:1}
  .ph .mascot{width:78px;height:78px;image-rendering:pixelated;filter:drop-shadow(0 6px 10px rgba(0,0,0,.5));border-radius:16px;padding:8px}
  .ph .nm{font-size:25px;font-weight:600;letter-spacing:-.6px;margin-top:14px;word-break:break-word}
  .ph .meta{display:flex;gap:8px;margin-top:12px}
  .ph .pill{font:600 12px/1 inherit;letter-spacing:.08em;padding:7px 13px;border-radius:999px}
  .ph .mc{font:600 12px/1 inherit;color:var(--muted);background:#1b1f29;padding:7px 13px;border-radius:999px}
  .body{padding:22px 28px 40px;overflow:auto;flex:1;font-size:15px;line-height:1.55}
  .body h4{font-size:12px;letter-spacing:.12em;text-transform:uppercase;color:var(--muted);margin:20px 0 7px}
  .body p{margin:0 0 9px;color:#d3d9e2}
  .body p.lead{font-size:18px;font-weight:600;color:#fff;letter-spacing:-.3px;line-height:1.32;margin-bottom:16px}
  .body li{list-style:none;padding-left:18px;position:relative;margin:5px 0;color:#d3d9e2}
  .body li:before{content:"";position:absolute;left:0;top:9px;width:7px;height:7px;border-radius:2px;background:currentColor;opacity:.65}
  .body p.cta{margin-top:16px;font-weight:600;color:#fff}
  .body p.tags{margin-top:14px;font-size:12px;color:var(--muted);letter-spacing:.02em}
  .body pre{background:#0c0f15;border:1px solid var(--line);border-radius:10px;padding:12px 14px;font:500 13px/1.5 ui-monospace,Menlo,monospace;color:#cdd5e1;white-space:pre-wrap;margin:6px 0 10px}
  .body b{color:#fff}
  .pending{font-size:13px;color:var(--muted);background:#1b1f29;border:1px solid var(--line);border-radius:10px;padding:12px 14px;margin-top:10px}
</style>
</head>
<body>
<div id="stage"><canvas id="c"></canvas></div>
<div class="top"><h1>Agent Harry</h1><p>22-agent product design system · agent graph</p></div>
<div class="lang"><button data-l="en" class="on">EN</button><button data-l="my">မြန်မာ</button></div>
<div class="legend" id="legend"></div>
<div class="hint">scroll to zoom · drag to move · click a node</div>

<aside id="panel">
  <div class="ph">
    <span class="close" id="close">×</span>
    <div id="p-mascot"></div>
    <div class="nm" id="p-name"></div>
    <div class="meta"><span class="pill" id="p-phase"></span><span class="mc" id="p-model"></span></div>
  </div>
  <div class="body" id="p-body"></div>
</aside>

<script>
const DATA = ${JSON.stringify(DATA)};
let LANG = "en";

const cvs = document.getElementById("c"), ctx = cvs.getContext("2d");
let W=0,H=0,DPR=Math.min(window.devicePixelRatio||1,2);
function resize(){ W=innerWidth; H=innerHeight; cvs.width=W*DPR; cvs.height=H*DPR; ctx.setTransform(DPR,0,0,DPR,0,0); }
addEventListener("resize",resize); resize();

const P = DATA.phases;
const N = DATA.nodes.map(n=>({ ...n, x:(Math.cos(n.id.length)*40)+ n.ax*260, y:(Math.sin(n.id.length)*40)+ n.ay*230, vx:0, vy:0,
  r: n.kind==="hub"?20 : (n.id==="orchestrator"?34:26), img:null }));
const byId = Object.fromEntries(N.map(n=>[n.id,n]));
const E = DATA.edges.map(([a,b])=>[byId[a],byId[b]]).filter(e=>e[0]&&e[1]);

let pending = 0;
for (const n of N){ if (n.kind==="agent" && n.mascot){ pending++;
  const img = new Image();
  img.onload = ()=>{ n.img=img; pending--; };
  img.onerror = ()=>{ pending--; };
  img.src = "data:image/svg+xml;utf8,"+encodeURIComponent(n.mascot);
}}

let cam={x:0,y:0,z:1};
function toScreen(p){ return { x: W/2 + (p.x-cam.x)*cam.z, y: H/2 + (p.y-cam.y)*cam.z }; }
function toWorld(sx,sy){ return { x:(sx-W/2)/cam.z+cam.x, y:(sy-H/2)/cam.z+cam.y }; }

const SPREAD=255;
function step(){
  for(let i=0;i<N.length;i++){ const a=N[i];
    a.vx += (a.ax*SPREAD - a.x)*0.006;
    a.vy += (a.ay*SPREAD - a.y)*0.006;
    for(let j=i+1;j<N.length;j++){ const b=N[j];
      let dx=a.x-b.x, dy=a.y-b.y, d2=dx*dx+dy*dy||0.01, d=Math.sqrt(d2);
      const rep=(a.r+b.r)*(a.r+b.r)*1.7/d2; const fx=dx/d*rep, fy=dy/d*rep;
      a.vx+=fx; a.vy+=fy; b.vx-=fx; b.vy-=fy;
    }
  }
  for(const e of E){ const a=e[0],b=e[1];
    let dx=b.x-a.x, dy=b.y-a.y, d=Math.hypot(dx,dy)||0.01;
    const rest=(a.kind==="hub"||b.kind==="hub")?92:120;
    const f=(d-rest)*0.012; const fx=dx/d*f, fy=dy/d*f;
    if(!a.fixed){a.vx+=fx;a.vy+=fy} if(!b.fixed){b.vx-=fx;b.vy-=fy}
  }
  for(const n of N){ if(n.fixed) continue; n.vx*=0.86; n.vy*=0.86; n.x+=n.vx; n.y+=n.vy; }
}

let hover=null, selected=null;
function neighbors(n){ const s=new Set(); for(const e of E){ if(e[0]===n)s.add(e[1]); if(e[1]===n)s.add(e[0]);} return s; }

function draw(){
  ctx.clearRect(0,0,W,H);
  const g=ctx.createRadialGradient(W/2,H*0.42,80,W/2,H/2,Math.max(W,H)*0.75);
  g.addColorStop(0,"#0e1118"); g.addColorStop(1,"#070809"); ctx.fillStyle=g; ctx.fillRect(0,0,W,H);

  const hl = hover||selected; const nb = hl?neighbors(hl):null;
  for(const e of E){ const a=e[0],b=e[1];
    const pa=toScreen(a), pb=toScreen(b);
    const active = hl && (a===hl||b===hl);
    ctx.strokeStyle = active ? (P[a.phase]?(P[a.phase].color):"#888")+"cc" : (hl?"#2a314055":"#2a314099");
    ctx.lineWidth = active?2.2:1; ctx.beginPath(); ctx.moveTo(pa.x,pa.y); ctx.lineTo(pb.x,pb.y); ctx.stroke();
  }
  for(const n of N){
    const p=toScreen(n); const col=P[n.phase]?P[n.phase].color:"#888";
    const dim = hl && n!==hl && !(nb&&nb.has(n));
    ctx.globalAlpha = dim?0.32:1;
    const r=n.r*cam.z;
    if(n.kind==="hub"){
      ctx.shadowBlur=24; ctx.shadowColor=col;
      ctx.fillStyle=col; ctx.beginPath(); ctx.arc(p.x,p.y,r,0,7); ctx.fill(); ctx.shadowBlur=0;
      ctx.fillStyle="#fff"; ctx.font="600 "+(13*cam.z)+"px sans-serif"; ctx.textAlign="center";
      ctx.fillText(n.name, p.x, p.y+r+16*cam.z);
    } else {
      ctx.shadowBlur=22; ctx.shadowColor=col;
      ctx.fillStyle="#0d1017"; ctx.beginPath(); ctx.arc(p.x,p.y,r,0,7); ctx.fill();
      ctx.shadowBlur=0;
      ctx.lineWidth=2; ctx.strokeStyle=col; ctx.beginPath(); ctx.arc(p.x,p.y,r,0,7); ctx.stroke();
      if(n.img){ const s=r*1.7; ctx.imageSmoothingEnabled=false; ctx.drawImage(n.img,p.x-s/2,p.y-s/2,s,s); }
      else { ctx.fillStyle=col; ctx.beginPath(); ctx.arc(p.x,p.y,r*0.5,0,7); ctx.fill(); }
      if(!dim){ ctx.fillStyle="#cfd6e2"; ctx.font="500 "+(12.5*cam.z)+"px sans-serif"; ctx.textAlign="center";
        ctx.fillText(n.name, p.x, p.y+r+15*cam.z); }
    }
    ctx.globalAlpha=1;
  }
}
function loop(){ step(); draw(); requestAnimationFrame(loop); } loop();

function pick(sx,sy){ let best=null,bd=1e9; for(const n of N){ const p=toScreen(n); const d=Math.hypot(p.x-sx,p.y-sy); if(d< (n.r*cam.z+8) && d<bd){bd=d;best=n;} } return best; }
let drag=null,dragMoved=false,panning=false,last=null;
cvs.addEventListener("mousemove",e=>{
  if(drag){ const w=toWorld(e.clientX,e.clientY); drag.x=w.x; drag.y=w.y; drag.vx=drag.vy=0; dragMoved=true; return; }
  if(panning){ cam.x-=(e.clientX-last.x)/cam.z; cam.y-=(e.clientY-last.y)/cam.z; last={x:e.clientX,y:e.clientY}; return; }
  hover=pick(e.clientX,e.clientY); cvs.style.cursor=hover?"pointer":"grab";
});
cvs.addEventListener("mousedown",e=>{ const n=pick(e.clientX,e.clientY); if(n){ drag=n; n.fixed=true; dragMoved=false; } else { panning=true; last={x:e.clientX,y:e.clientY}; } });
addEventListener("mouseup",e=>{ if(drag){ drag.fixed=false; if(!dragMoved) openPanel(drag); drag=null; } panning=false; });
cvs.addEventListener("wheel",e=>{ e.preventDefault(); const f=Math.exp(-e.deltaY*0.0012); const w=toWorld(e.clientX,e.clientY);
  cam.z=Math.max(0.4,Math.min(2.6,cam.z*f)); const w2=toWorld(e.clientX,e.clientY); cam.x+=w.x-w2.x; cam.y+=w.y-w2.y; },{passive:false});

function esc(s){return s.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");}
function inline(s){return s.replace(/\\*\\*(.+?)\\*\\*/g,"<b>$1</b>");}
function fmt(md){ if(!md) return ""; const out=[]; for(let raw of md.split("\\n")){ const l=raw.trim();
  if(!l){continue;}
  if(l.startsWith("✦")) out.push("<h4>"+esc(l.replace(/^✦\\s*/,""))+"</h4>");
  else if(l.startsWith("👉")) out.push('<p class="cta">'+inline(esc(l))+"</p>");
  else if(l.startsWith("#")) out.push('<p class="tags">'+esc(l)+"</p>");
  else if(l.startsWith("- ")) out.push("<li>"+inline(esc(l.slice(2)))+"</li>");
  else if((l.startsWith('"')&&l.endsWith('"'))) out.push("<pre>"+esc(l)+"</pre>");
  else out.push("<p>"+inline(esc(l))+"</p>");
 } if(out[0]&&out[0].indexOf("<p>")===0) out[0]=out[0].replace("<p>",'<p class="lead">'); return out.join(""); }

function renderBody(n){
  if(LANG==="my" && !n.my){ document.getElementById("p-body").innerHTML =
    fmt(n.en) + '<div class="pending">မြန်မာ ဘာသာပြန် မကြာခင် ထည့်ပါမယ် — အခု English ပြထားပါတယ်။</div>'; return; }
  const txt = LANG==="my" ? n.my : n.en;
  document.getElementById("p-body").innerHTML = fmt(txt) || '<p class="tags">No content.</p>';
}
function openPanel(n){
  if(n.kind!=="agent"){ selected=n; return; }
  selected=n;
  const ph=P[n.phase];
  document.getElementById("p-mascot").innerHTML = '<div class="mascot" style="background:'+ph.color+'1f">'+n.mascot+"</div>";
  document.getElementById("p-name").textContent=n.name;
  const pe=document.getElementById("p-phase"); pe.textContent=ph.label.toUpperCase();
  pe.style.color="#fff"; pe.style.background="linear-gradient(135deg,"+ph.color+","+ph.c2+")";
  document.getElementById("p-model").textContent="model · "+n.model;
  renderBody(n);
  document.getElementById("panel").classList.add("open");
}
document.getElementById("close").onclick=()=>{ document.getElementById("panel").classList.remove("open"); selected=null; };
document.querySelectorAll(".lang button").forEach(b=>b.onclick=()=>{
  LANG=b.dataset.l; document.querySelectorAll(".lang button").forEach(x=>x.classList.toggle("on",x===b));
  if(selected&&selected.kind==="agent") renderBody(selected);
});

document.getElementById("legend").innerHTML = Object.keys(P).map(k=>
  '<span><i style="background:'+P[k].color+'"></i>'+P[k].label+"</span>").join("");
</script>
</body>
</html>`;

writeFileSync(OUT, html, "utf8");
console.log("Wrote " + OUT + " (" + nodes.length + " nodes, " + edges.length + " edges)");
