// ── UTILITIES ──
const C=id=>document.getElementById(id);
const W2=(c)=>{const r=c.getBoundingClientRect();if(c.width!==~~r.width||c.height!==~~r.height){c.width=~~r.width;c.height=~~r.height;return true;}return false;};
const CREAM='#F8F5EF',CREAM2='#F2EDE4',NAVY='#0B1628',NAVY2='#162040';
const BLUE='#1B4FD8',BLUE3='#3B82F6',GOLD='#C8A96E',GOLD2='#D4B87A';
const ASH='rgba(138,143,154,0.6)',INK='#1A1A2A';
const teal=a=>`rgba(60,180,160,${a})`;
const gold=a=>`rgba(200,169,110,${a})`;
const navy=a=>`rgba(11,22,40,${a})`;
const blue=a=>`rgba(27,79,216,${a})`;
const amber=a=>`rgba(255,155,40,${a})`;

// ── CURSOR ──
const cur=C('cursor'),ring=C('cursorRing');
let mx=0,my=0,rx=0,ry=0;
document.addEventListener('mousemove',e=>{mx=e.clientX;my=e.clientY;});
(function ac(){rx+=(mx-rx)*.1;ry+=(my-ry)*.1;cur.style.left=mx+'px';cur.style.top=my+'px';ring.style.left=rx+'px';ring.style.top=ry+'px';requestAnimationFrame(ac);})();
document.querySelectorAll('a,button,canvas').forEach(el=>{
  el.addEventListener('mouseenter',()=>ring.classList.add('hover'));
  el.addEventListener('mouseleave',()=>ring.classList.remove('hover'));
});

// ── NAV ──
window.addEventListener('scroll',()=>C('mainNav').classList.toggle('scrolled',scrollY>60));

// ── REVEAL ──
const ro=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting)e.target.classList.add('visible');}),{threshold:.08});
document.querySelectorAll('.reveal').forEach(el=>ro.observe(el));
// ── MODAL & STEPPED BRIEF BUILDER ──
let currentBriefStep = 1;

function openModal(){
  C('project-modal').classList.add('open');
  document.body.style.overflow='hidden';
  nextStep(1);
  C('form-body').style.display='block';
  C('form-success').style.display='none';
}

function closeModal(){
  C('project-modal').classList.remove('open');
  document.body.style.overflow='';
}

function nextStep(n) {
  // Hide current pane
  const currentPane = C(`pane-${currentBriefStep}`);
  if (currentPane) currentPane.classList.remove('active');

  // Show new pane
  const nextPane = C(`pane-${n}`);
  if (nextPane) {
    setTimeout(() => {
      nextPane.classList.add('active');
    }, 50);
  }

  // Update step indicator classes
  for (let i = 1; i <= 3; i++) {
    const ind = C(`ind-${i}`);
    if (ind) ind.classList.toggle('active', i === n);
  }

  // Update progress bar fill width
  const progressFill = C('brief-progress-fill');
  if (progressFill) {
    progressFill.style.width = (n === 1 ? '33.3%' : n === 2 ? '66.6%' : '100%');
  }

  currentBriefStep = n;
}

function submitForm(){
  const modal = C('project-modal');
  const name = modal.querySelector('[name="name"]')?.value.trim();
  const email = modal.querySelector('[name="email"]')?.value.trim();
  const phone = modal.querySelector('[name="phone"]')?.value.trim();
  const type = modal.querySelector('[name="type"]')?.value;
  const family = modal.querySelector('[name="family"]')?.value;
  const budget = modal.querySelector('[name="budget"]')?.value;
  const sustain = modal.querySelector('[name="sustain"]')?.value;
  const req = modal.querySelector('[name="requirements"]')?.value.trim();
  const location = modal.querySelector('[name="location"]')?.value.trim();

  if (!name || !email) {
    alert('Please fill in at least your name and email.');
    return;
  }

  const btn = modal.querySelector('.form-submit');
  const originalText = btn.textContent;
  btn.textContent = 'Sending…';
  btn.disabled = true;

  const FORMSPREE_ID = 'mrejjeqq';
  fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    body: JSON.stringify({ name, email, phone, type, family, budget, sustain, requirements: req, location })
  })
  .then(res => {
    if (res.ok) {
      C('form-body').style.display='none';
      C('form-success').style.display='block';
      setTimeout(closeModal, 3500);
    } else {
      throw new Error('Server error');
    }
  })
  .catch(() => {
    btn.textContent = originalText;
    btn.disabled = false;
    alert('Something went wrong. Please email us directly at office@aumbuilds.com');
  });
}

C('project-modal').addEventListener('click',function(e){if(e.target===this)closeModal();});

// ── TUBELIGHT NAVBAR LAMP & SCROLL SPY ──
function updateTubelightLamp(activeItem) {
  const lamp = document.getElementById('nav-tubelight-lamp');
  if (!lamp || !activeItem) return;
  lamp.style.left = activeItem.offsetLeft + 'px';
  lamp.style.width = activeItem.offsetWidth + 'px';
}

function initTubelightNavbar() {
  const navItems = document.querySelectorAll('.nav-tubelight-item');
  const sections = [
    C('site-intelligence'),
    C('performance'),
    C('generative'),
    C('materials'),
    C('about')
  ].filter(Boolean);

  navItems.forEach(item => {
    item.addEventListener('click', function(e) {
      navItems.forEach(i => i.classList.remove('active'));
      this.classList.add('active');
      updateTubelightLamp(this);
    });
  });

  function spy() {
    let currentSec = null;
    const scrollPos = window.scrollY + window.innerHeight * 0.4;
    sections.forEach(sec => {
      const top = sec.offsetTop;
      const height = sec.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        currentSec = sec;
      }
    });

    if (currentSec) {
      const activeId = currentSec.getAttribute('id');
      navItems.forEach(item => {
        const href = item.getAttribute('href');
        if (href === '#' + activeId) {
          if (!item.classList.contains('active')) {
            navItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');
            updateTubelightLamp(item);
          }
        }
      });
    }
  }

  window.addEventListener('scroll', spy);
  window.addEventListener('resize', () => {
    const active = document.querySelector('.nav-tubelight-item.active');
    if (active) updateTubelightLamp(active);
  });

  setTimeout(() => {
    const active = document.querySelector('.nav-tubelight-item.active');
    if (active) updateTubelightLamp(active);
  }, 150);
  
  setTimeout(() => {
    const active = document.querySelector('.nav-tubelight-item.active');
    if (active) updateTubelightLamp(active);
  }, 500);
}

document.addEventListener('DOMContentLoaded', initTubelightNavbar);
window.addEventListener('load', initTubelightNavbar);

// ════════════════════════════════════════
// HERO CANVAS — Warm cream with living building
// ════════════════════════════════════════
(function heroScene(){
  const canvas=C('hero-canvas');if(!canvas)return;
  let W,H,t=0,mouseX=0,mouseY=0;
  function resize(){W=canvas.width=innerWidth;H=canvas.height=innerHeight;}
  resize();window.addEventListener('resize',resize);
  document.addEventListener('mousemove',e=>{mouseX=(e.clientX/innerWidth-.5)*2;mouseY=(e.clientY/innerHeight-.5)*2;});
  const ctx=canvas.getContext('2d');

  // Generate terrain points
  const terrainPts=[];
  for(let i=0;i<8;i++)terrainPts.push({x:Math.random(),y:.6+Math.random()*.15,h:Math.random()});

  function draw(){
    W2(canvas)||resize();
    ctx.clearRect(0,0,W,H);
    // Warm background gradient
    const bg=ctx.createLinearGradient(0,0,0,H);
    bg.addColorStop(0,'#F8F5EF');bg.addColorStop(1,'#EDE5D8');
    ctx.fillStyle=bg;ctx.fillRect(0,0,W,H);

    // Horizon terrain
    ctx.fillStyle='rgba(26,26,42,0.04)';
    ctx.beginPath();ctx.moveTo(0,H*.75);
    for(let x=0;x<=W;x+=4){
      const n=Math.sin(x*.008+t*.2)*18+Math.sin(x*.003+t*.1)*12;
      ctx.lineTo(x,H*.72+n);
    }
    ctx.lineTo(W,H);ctx.lineTo(0,H);ctx.closePath();ctx.fill();

    // Ground plane grid — elegant and light
    ctx.strokeStyle='rgba(26,26,42,0.04)';ctx.lineWidth=.6;
    const vanX=W/2+mouseX*30,vanY=H*.65;
    for(let i=-12;i<=12;i++){
      const x=vanX+i*80;
      ctx.beginPath();ctx.moveTo(x,vanY);ctx.lineTo(vanX+(x-vanX)*4,H+200);ctx.stroke();
    }
    for(let i=0;i<=8;i++){
      const py=vanY+i*(H-vanY+200)/8;
      const spread=(py-vanY)*1.5;
      ctx.beginPath();ctx.moveTo(vanX-spread,py);ctx.lineTo(vanX+spread,py);ctx.stroke();
    }

    // BUILDING — elegant vernacular house in warm cream tones
    const bCX=W*.5+mouseX*8,bBase=H*.68;
    const bW=W*.22,bH=H*.3;
    const bLeft=bCX-bW/2,bRight=bCX+bW/2,bTop=bBase-bH;

    // Shadow
    ctx.fillStyle='rgba(26,26,42,0.06)';
    ctx.beginPath();ctx.ellipse(bCX+mouseX*5,bBase+8,bW*.6,12,0,0,Math.PI*2);ctx.fill();

    // Walls
    ctx.fillStyle='rgba(26,26,42,0.07)';ctx.strokeStyle='rgba(26,26,42,0.18)';ctx.lineWidth=1.5;
    ctx.fillRect(bLeft,bTop,bW,bH);ctx.strokeRect(bLeft,bTop,bW,bH);

    // Wall detail — subtle horizontal lines (rammed earth)
    ctx.strokeStyle='rgba(26,26,42,0.04)';ctx.lineWidth=.6;
    for(let i=1;i<8;i++){const y=bTop+bH*(i/8);ctx.beginPath();ctx.moveTo(bLeft,y);ctx.lineTo(bRight,y);ctx.stroke();}

    // Veranda columns
    const colSpacing=bW/4;
    for(let i=0;i<5;i++){
      const cx2=bLeft+i*colSpacing;ctx.strokeStyle='rgba(26,26,42,0.2)';ctx.lineWidth=2;
      ctx.beginPath();ctx.moveTo(cx2,bTop+bH);ctx.lineTo(cx2,bBase+20);ctx.stroke();
    }
    // Veranda canopy
    ctx.fillStyle='rgba(11,22,40,0.08)';ctx.strokeStyle='rgba(26,26,42,0.2)';ctx.lineWidth=1;
    ctx.fillRect(bLeft-8,bTop+bH-2,bW+16,6);ctx.strokeRect(bLeft-8,bTop+bH-2,bW+16,6);

    // Roof — pitched
    ctx.fillStyle='rgba(26,26,42,0.12)';ctx.strokeStyle=gold(0.5);ctx.lineWidth=1.5;
    ctx.beginPath();ctx.moveTo(bLeft-14,bTop);ctx.lineTo(bCX,bTop-bH*.35);ctx.lineTo(bRight+14,bTop);ctx.closePath();ctx.fill();ctx.stroke();

    // Windows
    ctx.fillStyle=gold(0.15);ctx.strokeStyle=gold(0.4);ctx.lineWidth=.8;
    const wins=[[bLeft+bW*.12,bTop+bH*.2,bW*.16,bH*.25],[bLeft+bW*.38,bTop+bH*.2,bW*.16,bH*.25],[bLeft+bW*.64,bTop+bH*.2,bW*.16,bH*.25]];
    wins.forEach(([x,y,w,h])=>{ctx.fillRect(x,y,w,h);ctx.strokeRect(x,y,w,h);});

    // Door
    ctx.fillStyle=navy(0.15);ctx.strokeStyle=gold(0.3);ctx.lineWidth=.8;
    ctx.fillRect(bCX-bW*.08,bTop+bH*.55,bW*.16,bH*.45);ctx.strokeRect(bCX-bW*.08,bTop+bH*.55,bW*.16,bH*.45);

    // Trees
    function tree(x,scale2=1){
      const tr=bBase;ctx.strokeStyle='rgba(26,26,42,0.15)';ctx.lineWidth=2*scale2;
      ctx.beginPath();ctx.moveTo(x,tr);ctx.lineTo(x,tr-55*scale2);ctx.stroke();
      for(let i=0;i<3;i++){
        ctx.fillStyle=`rgba(26,26,42,${0.04+i*.02})`;ctx.beginPath();
        ctx.arc(x,tr-55*scale2-i*16*scale2,18*scale2-i*4*scale2,0,Math.PI*2);ctx.fill();
      }
    }
    tree(bLeft-60,.85);tree(bLeft-100,.65);tree(bRight+60,.85);tree(bRight+110,.7);

    // Floating particles — dust motes
    ctx.fillStyle='rgba(200,169,110,0.3)';
    for(let i=0;i<20;i++){
      const px=W*.2+Math.sin(t*.5+i*1.7)*W*.4;
      const py=H*.3+Math.cos(t*.3+i*2.1)*H*.2;
      const sz=.8+Math.sin(t+i)*.5;
      ctx.beginPath();ctx.arc(px,py,sz,0,Math.PI*2);ctx.fill();
    }

    // Sun glow — top right
    const sunGrad=ctx.createRadialGradient(W*.85,H*.08,0,W*.85,H*.08,W*.25);
    sunGrad.addColorStop(0,'rgba(200,169,110,0.12)');sunGrad.addColorStop(1,'rgba(248,245,239,0)');
    ctx.fillStyle=sunGrad;ctx.fillRect(0,0,W,H);

    t+=.008;requestAnimationFrame(draw);
  }
  draw();
})();

// ════════════════════════════════════════
// SITE INTELLIGENCE — Living site animation
// ════════════════════════════════════════
let siMode='sun',siT=0;
function setSIMode(mode,btn){
  document.querySelectorAll('.si-mode-btn').forEach(b=>b.classList.remove('active'));btn.classList.add('active');siMode=mode;
  ['lbl-sun','lbl-wind','lbl-water','lbl-ecol'].forEach(id=>{const el=C(id);if(el)el.classList.remove('show');});
  const map={sun:'lbl-sun',wind:'lbl-wind',water:'lbl-water',ecology:'lbl-ecol'};
  const el=C(map[mode]);if(el)el.classList.add('show');
}
setTimeout(()=>{C('lbl-sun').classList.add('show');},1200);

(function siScene(){
  const canvas=C('si-canvas');if(!canvas)return;
  let W,H;
  function resize(){W=canvas.width=canvas.clientWidth;H=canvas.height=canvas.clientHeight;}
  resize();window.addEventListener('resize',resize);
  const ctx=canvas.getContext('2d');

  function draw(){
    W2(canvas)||(W=canvas.width,H=canvas.height);
    ctx.clearRect(0,0,W,H);
    const bg=ctx.createLinearGradient(0,0,0,H);
    bg.addColorStop(0,'#EDE5D8');bg.addColorStop(1,'#E5DDD0');
    ctx.fillStyle=bg;ctx.fillRect(0,0,W,H);

    const bCX=W*.5,bBase=H*.72,bW=W*.28,bH=H*.32,bTop=bBase-bH;

    // Contour terrain lines — organic
    ctx.strokeStyle='rgba(26,26,42,0.06)';ctx.lineWidth=1;
    for(let i=0;i<6;i++){
      const r=H*.12+i*H*.085;ctx.beginPath();
      for(let a=0;a<=Math.PI*2;a+=.05){
        const noise=Math.sin(a*3+siT*.08+i)*18+Math.cos(a*2.1+i)*12;
        const x=bCX+Math.cos(a)*(r*1.6+noise),y=bBase-.2*r+Math.sin(a)*(r*.7+noise*.3);
        a===0?ctx.moveTo(x,y):ctx.lineTo(x,y);
      }
      ctx.closePath();ctx.stroke();
    }

    // GROUND
    ctx.fillStyle='rgba(26,26,42,0.04)';
    ctx.beginPath();ctx.moveTo(0,bBase+10);
    for(let x=0;x<=W;x+=5){ctx.lineTo(x,bBase+10+Math.sin(x*.01+siT*.1)*8);}
    ctx.lineTo(W,H);ctx.lineTo(0,H);ctx.closePath();ctx.fill();

    // BUILDING
    ctx.fillStyle='rgba(240,233,220,0.95)';ctx.strokeStyle='rgba(26,26,42,0.2)';ctx.lineWidth=1.5;
    ctx.fillRect(bCX-bW/2,bTop,bW,bH);ctx.strokeRect(bCX-bW/2,bTop,bW,bH);
    // Rammed earth texture
    ctx.strokeStyle='rgba(26,26,42,0.05)';ctx.lineWidth=.5;
    for(let i=1;i<10;i++){const y=bTop+bH*(i/10);ctx.beginPath();ctx.moveTo(bCX-bW/2,y);ctx.lineTo(bCX+bW/2,y);ctx.stroke();}
    // Roof
    ctx.fillStyle='rgba(26,26,42,0.1)';ctx.strokeStyle=gold(0.5);ctx.lineWidth=1.5;
    ctx.beginPath();ctx.moveTo(bCX-bW/2-12,bTop);ctx.lineTo(bCX,bTop-bH*.3);ctx.lineTo(bCX+bW/2+12,bTop);ctx.closePath();ctx.fill();ctx.stroke();
    // Windows
    ctx.fillStyle=gold(0.12);ctx.strokeStyle=gold(0.35);ctx.lineWidth=.8;
    [-.3,0,.3].forEach(off=>{ctx.fillRect(bCX+off*bW*.6-bW*.08,bTop+bH*.22,bW*.16,bH*.22);ctx.strokeRect(bCX+off*bW*.6-bW*.08,bTop+bH*.22,bW*.16,bH*.22);});
    // Courtyard suggestion
    ctx.fillStyle='rgba(200,169,110,0.06)';ctx.fillRect(bCX-bW*.12,bTop+bH*.55,bW*.24,bH*.45);

    // ── SOLAR MODE ──
    if(siMode==='sun'){
      const sunX=W*.8,sunY=H*.08;
      const sg=ctx.createRadialGradient(sunX,sunY,0,sunX,sunY,W*.3);
      sg.addColorStop(0,'rgba(255,200,80,0.18)');sg.addColorStop(1,'rgba(248,245,239,0)');
      ctx.fillStyle=sg;ctx.fillRect(0,0,W,H);
      ctx.fillStyle='rgba(255,210,80,0.9)';ctx.beginPath();ctx.arc(sunX,sunY,18,0,Math.PI*2);ctx.fill();
      // Solar rays
      for(let i=0;i<12;i++){
        const a=(siT*.015+i/12)*Math.PI*2;
        const r1=22,r2=32+Math.sin(siT*2+i)*4;
        ctx.strokeStyle='rgba(255,200,80,0.4)';ctx.lineWidth=1;
        ctx.beginPath();ctx.moveTo(sunX+Math.cos(a)*r1,sunY+Math.sin(a)*r1);ctx.lineTo(sunX+Math.cos(a)*r2,sunY+Math.sin(a)*r2);ctx.stroke();
      }
      // Shadow cast by building
      const shadowAngle=Math.atan2(bBase-sunY,bCX-sunX)+Math.PI;
      const shadowLen=bW*1.2;
      ctx.fillStyle='rgba(26,26,42,0.08)';
      ctx.beginPath();ctx.moveTo(bCX-bW/2,bBase);ctx.lineTo(bCX-bW/2+Math.cos(shadowAngle)*shadowLen,bBase+Math.sin(shadowAngle)*shadowLen*.4);ctx.lineTo(bCX+bW/2+Math.cos(shadowAngle)*shadowLen,bBase+Math.sin(shadowAngle)*shadowLen*.4);ctx.lineTo(bCX+bW/2,bBase);ctx.closePath();ctx.fill();
      // Overhang shading diagram
      ctx.strokeStyle=gold(0.6);ctx.lineWidth=1;ctx.setLineDash([4,3]);
      ctx.beginPath();ctx.moveTo(sunX,sunY);ctx.lineTo(bCX-bW/2-12,bTop);ctx.stroke();
      ctx.beginPath();ctx.moveTo(sunX,sunY);ctx.lineTo(bCX+bW/2+12,bTop);ctx.stroke();
      ctx.setLineDash([]);
      // Shaded interior label area
      ctx.fillStyle='rgba(60,180,160,0.06)';
      ctx.fillRect(bCX-bW/2,bTop,bW,bH);
    }

    // ── WIND MODE ──
    if(siMode==='wind'){
      const numStreams=16;
      for(let i=0;i<numStreams;i++){
        const phase=i/numStreams;const prog=(siT*.4+phase)%1;
        const baseY=H*.15+i*(H*.6/numStreams);
        const amplitude=20+Math.sin(i*1.3)*15;
        const color=i%3===0?teal(0.5):blue(0.3);
        ctx.strokeStyle=color;ctx.lineWidth=1;ctx.setLineDash([4,4]);
        // Stream path
        const pts=[];
        for(let j=0;j<=30;j++){
          const x=j*(W/30);
          let y=baseY+Math.sin(j*.3+i*.8)*amplitude;
          // Deflect around building
          const buildingInfluence=Math.exp(-((x-bCX)*(x-bCX))/(bW*bW*2));
          if(y>bTop&&y<bBase&&Math.abs(x-bCX)<bW/2){y-=buildingInfluence*30;}
          pts.push([x,y]);
        }
        ctx.beginPath();pts.forEach(([x,y],j)=>j===0?ctx.moveTo(x,y):ctx.lineTo(x,y));ctx.stroke();ctx.setLineDash([]);
        // Moving dot
        const dotIdx=~~(prog*29);if(dotIdx<pts.length){ctx.fillStyle=color.replace('0.5','0.9').replace('0.3','0.7');ctx.beginPath();ctx.arc(pts[dotIdx][0],pts[dotIdx][1],2.5,0,Math.PI*2);ctx.fill();}
      }
      // Wind rose
      const wrX=W*.85,wrY=H*.2,wrR=40;
      ctx.strokeStyle='rgba(26,26,42,0.1)';ctx.lineWidth=.6;ctx.beginPath();ctx.arc(wrX,wrY,wrR,0,Math.PI*2);ctx.stroke();
      const dirs=[[225,.65],[270,.42],[180,.18],[90,.15]];
      dirs.forEach(([deg,str])=>{const a=(deg-90)*Math.PI/180;ctx.strokeStyle=str>.4?teal(0.7):blue(0.4);ctx.lineWidth=str>0.4?3:2;ctx.beginPath();ctx.moveTo(wrX,wrY);ctx.lineTo(wrX+Math.cos(a)*wrR*str*1.5,wrY+Math.sin(a)*wrR*str*1.5);ctx.stroke();});
    }

    // ── WATER MODE ──
    if(siMode==='water'){
      const waterPaths=[[[W*.2,H*.1],[W*.28,H*.35],[W*.35,H*.58],[W*.42,bBase]],[[W*.78,H*.08],[W*.7,H*.3],[W*.6,H*.55],[W*.52,bBase]]];
      waterPaths.forEach((path,pi)=>{
        ctx.strokeStyle=blue(0.4);ctx.lineWidth=1.5;ctx.setLineDash([4,3]);
        ctx.beginPath();path.forEach(([x,y],j)=>j===0?ctx.moveTo(x,y):ctx.lineTo(x,y));ctx.stroke();ctx.setLineDash([]);
        const prog=(siT*.3+pi*.5)%1;const idx=~~(prog*(path.length-1));const nextIdx=Math.min(idx+1,path.length-1);
        const lp=prog*(path.length-1)-idx;const dx=path[nextIdx][0]-path[idx][0];const dy=path[nextIdx][1]-path[idx][1];
        ctx.fillStyle=blue(0.7);ctx.beginPath();ctx.arc(path[idx][0]+dx*lp,path[idx][1]+dy*lp,4,0,Math.PI*2);ctx.fill();
      });
      // Collection pool at base
      ctx.fillStyle=blue(0.08);ctx.strokeStyle=blue(0.25);ctx.lineWidth=1;
      ctx.beginPath();ctx.ellipse(bCX+bW*.8,bBase+15,45,12,0,0,Math.PI*2);ctx.fill();ctx.stroke();
      // Rain dots
      for(let i=0;i<20;i++){
        const rx=W*.1+Math.random()*W*.8;const ry=((siT*80+i*200)%H);
        ctx.strokeStyle=blue(0.3);ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(rx,ry);ctx.lineTo(rx-3,ry+8);ctx.stroke();
      }
    }

    // ── ECOLOGY MODE ──
    if(siMode==='ecology'){
      const vegPts=[[W*.2,H*.45,.7],[W*.35,H*.3,.5],[W*.7,H*.4,.8],[W*.8,H*.6,.4],[W*.15,H*.6,.6]];
      vegPts.forEach(([x,y,str])=>{
        const vg=ctx.createRadialGradient(x,y,0,x,y,80*str);
        vg.addColorStop(0,`rgba(60,140,60,${str*.2})`);vg.addColorStop(1,'rgba(60,140,60,0)');
        ctx.fillStyle=vg;ctx.fillRect(0,0,W,H);
        // Tree
        ctx.strokeStyle=`rgba(40,100,40,${str*.4})`;ctx.lineWidth=1.5;
        ctx.beginPath();ctx.moveTo(x,y+20);ctx.lineTo(x,y-20*str);ctx.stroke();
        for(let li=0;li<3;li++){ctx.fillStyle=`rgba(40,${120+li*15},40,${str*(0.2+li*.06)})`;ctx.beginPath();ctx.arc(x,y-20*str-li*14*str,18*str-li*4*str,0,Math.PI*2);ctx.fill();}
      });
      // Microclimate zones
      const mcg=ctx.createRadialGradient(W*.45,H*.5,0,W*.45,H*.5,W*.25);
      mcg.addColorStop(0,teal(0.08));mcg.addColorStop(1,'rgba(60,180,160,0)');
      ctx.fillStyle=mcg;ctx.fillRect(0,0,W,H);
      // Breathing animation — ripples from trees
      vegPts.forEach(([x,y,str])=>{
        const rr=(siT*25+str*100)%80;ctx.strokeStyle=`rgba(60,140,60,${0.15-rr/600})`;ctx.lineWidth=.7;
        ctx.beginPath();ctx.arc(x,y,rr*str,0,Math.PI*2);ctx.stroke();
      });
    }

    // Trees around building (always)
    function drawTree(x,y,s){
      ctx.strokeStyle=`rgba(26,26,42,${s*.18})`;ctx.lineWidth=s*1.8;
      ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x,y-50*s);ctx.stroke();
      for(let i=0;i<3;i++){ctx.fillStyle=`rgba(${siMode==='ecology'?'50,120,50':'26,26,42'},${s*(0.06+i*.03)})`;ctx.beginPath();ctx.arc(x,y-50*s-i*14*s,20*s-i*5*s,0,Math.PI*2);ctx.fill();}
    }
    drawTree(bCX-bW*.75,bBase,.9);drawTree(bCX-bW*.55,bBase,.7);drawTree(bCX+bW*.75,bBase,.85);drawTree(bCX+bW*.55,bBase,.65);

    siT+=.012;requestAnimationFrame(draw);
  }
  draw();
})();

// ════════════════════════════════════════
// PERFORMANCE — Cinematic building sections
// ════════════════════════════════════════
let perfMode='vent',perfT=0;
const perfData={
  vent:{title:'Cross Ventilation',body:'Cooler interiors with natural airflow — no mechanical cooling required in the shoulder seasons.'},
  daylight:{title:'Daylight Design',body:'Daylight optimised for healthier, brighter spaces — reducing artificial lighting load by up to 50%.'},
  thermal:{title:'Thermal Mass',body:'Walls that store the cool of night and release it through the heat of day. Indoor comfort without energy.'},
  shading:{title:'Intelligent Shading',body:'Reduced heat gain through precisely calculated overhangs and screens — calibrated to your site\'s latitude.'},
};
function setPerfMode(m,btn){
  document.querySelectorAll('.perf-mode-btn').forEach(b=>b.classList.remove('active'));btn.classList.add('active');perfMode=m;
  C('perf-title').textContent=perfData[m].title;C('perf-body').textContent=perfData[m].body;
}

(function perfScene(){
  const canvas=C('perf-canvas');if(!canvas)return;
  let W,H;
  function resize(){W=canvas.width=canvas.clientWidth;H=canvas.height=canvas.clientHeight;}
  resize();window.addEventListener('resize',resize);
  const ctx=canvas.getContext('2d');

  function draw(){
    W2(canvas)||(W=canvas.width,H=canvas.height);
    ctx.clearRect(0,0,W,H);
    const bg=ctx.createLinearGradient(0,0,0,H);
    bg.addColorStop(0,'#EDE5D8');bg.addColorStop(1,'#E0D8CC');
    ctx.fillStyle=bg;ctx.fillRect(0,0,W,H);

    // Building section
    const sX=W*.12,sY=H*.1,sW=W*.76,sH=H*.72,wT=16;

    // Ground
    ctx.fillStyle='rgba(26,26,42,0.06)';ctx.fillRect(0,sY+sH,W,H-(sY+sH));
    ctx.strokeStyle='rgba(26,26,42,0.2)';ctx.lineWidth=1.5;
    ctx.beginPath();ctx.moveTo(0,sY+sH);ctx.lineTo(W,sY+sH);ctx.stroke();

    // Walls — section cut (warm cream fill)
    ctx.fillStyle='rgba(220,210,195,0.9)';ctx.strokeStyle='rgba(26,26,42,0.25)';ctx.lineWidth=1.5;
    ctx.fillRect(sX,sY,wT,sH);ctx.strokeRect(sX,sY,wT,sH);
    ctx.fillRect(sX+sW-wT,sY,wT,sH);ctx.strokeRect(sX+sW-wT,sY,wT,sH);
    ctx.fillRect(sX,sY,sW,wT);ctx.strokeRect(sX,sY,sW,wT);
    ctx.fillRect(sX,sY+sH-wT,sW,wT+8);ctx.strokeRect(sX,sY+sH-wT,sW,wT+8);

    // Interior columns — slender, elegant
    [.25,.5,.75].forEach(p=>{
      ctx.fillStyle='rgba(200,195,185,0.8)';ctx.strokeStyle='rgba(26,26,42,0.15)';ctx.lineWidth=.8;
      const cx2=sX+wT+sW*(1-wT/sW*.5)*p;
      ctx.fillRect(cx2-5,sY+wT,10,sH-wT*2);ctx.strokeRect(cx2-5,sY+wT,10,sH-wT*2);
    });

    // Roof
    ctx.fillStyle='rgba(180,170,155,0.9)';ctx.strokeStyle=gold(0.5);ctx.lineWidth=1.5;
    ctx.beginPath();ctx.moveTo(sX-16,sY);ctx.lineTo(sX+sW/2,sY-sH*.28);ctx.lineTo(sX+sW+16,sY);ctx.closePath();ctx.fill();ctx.stroke();

    // Openings — left (windward/sunward) and right
    const winH=sH*.32,winW=20,winY=sY+sH*.3;
    ctx.fillStyle=teal(0.25);ctx.fillRect(sX,winY,winW+3,winH);
    ctx.fillStyle=teal(0.2);ctx.fillRect(sX+sW-winW-3,winY+sH*.1,winW+3,winH*.8);

    // Skylight
    ctx.fillStyle='rgba(255,220,80,0.18)';ctx.fillRect(sX+sW*.35,sY,sW*.3,wT+2);

    // PERFORMANCE OVERLAYS
    if(perfMode==='vent'){
      for(let i=0;i<10;i++){
        const phase=i/10;const prog=(perfT*.45+phase)%1;
        const startY=winY+winH*(.1+phase*.7);
        const endY=winY+winH*.2+sH*.1*Math.sin(phase*Math.PI);
        const x=sX+wT+(sW-wT*2)*prog;
        ctx.strokeStyle=teal(0.3+Math.sin(perfT+i)*.1);ctx.lineWidth=1.2;ctx.setLineDash([4,4]);
        ctx.beginPath();ctx.moveTo(sX+wT,startY);ctx.bezierCurveTo(sX+sW*.35,startY,sX+sW*.65,endY,sX+sW-wT,winY+winH*.1+sH*.15*phase);ctx.stroke();ctx.setLineDash([]);
        ctx.fillStyle=teal(0.8);ctx.beginPath();ctx.arc(x,startY+(endY-startY)*Math.sin(prog*Math.PI)+(sH*.15*phase-sH*.075)*prog,2.5,0,Math.PI*2);ctx.fill();
      }
      ctx.fillStyle=teal(0.06);ctx.fillRect(sX+wT,sY+wT,sW-wT*2,sH-wT*2);
    }

    if(perfMode==='daylight'){
      const sunX=sX+sW*.5,sunY=sY-sH*.3;
      for(let i=0;i<14;i++){
        const a=-Math.PI*.3-i*(Math.PI*.5/13);
        const len=sH*(0.85-i*.03);
        const srcX=sX+sW*.35+i*(sW*.3/13);
        const endX=srcX+Math.cos(a)*len;const endY=sY+wT+Math.sin(a)*len;
        const grd=ctx.createLinearGradient(srcX,sY,endX,endY);
        grd.addColorStop(0,'rgba(255,215,80,0.35)');grd.addColorStop(1,'rgba(255,215,80,0)');
        ctx.fillStyle=grd;
        ctx.beginPath();ctx.moveTo(srcX-4,sY+wT);ctx.lineTo(srcX+4,sY+wT);ctx.lineTo(endX+6,Math.max(endY,sY+wT+10));ctx.lineTo(endX-6,Math.max(endY,sY+wT+10));ctx.closePath();ctx.fill();
        // Moving photon
        const prog=(perfT*.4+i/14)%1;ctx.fillStyle=`rgba(255,220,80,${0.7-prog*.5})`;ctx.beginPath();ctx.arc(srcX+(endX-srcX)*prog,sY+wT+(Math.max(endY,sY+wT+10)-sY-wT)*prog,2,0,Math.PI*2);ctx.fill();
      }
      // Lux zones on floor
      ctx.strokeStyle='rgba(255,200,60,0.2)';ctx.lineWidth=.6;ctx.setLineDash([2,4]);
      [.1,.2,.35,.5,.65].forEach(p=>{ctx.beginPath();ctx.moveTo(sX+wT+sW*p,sY+sH-wT*3);ctx.lineTo(sX+wT+sW*p,sY+sH-wT-3);ctx.stroke();});
      ctx.setLineDash([]);
    }

    if(perfMode==='thermal'){
      const isDay=Math.sin(perfT*.04)>0;
      // Wall temperature gradient
      const wgL=ctx.createLinearGradient(sX,0,sX+wT*2,0);
      wgL.addColorStop(0,`rgba(255,${isDay?100:150},40,${isDay?0.4:0.1})`);
      wgL.addColorStop(1,'rgba(60,180,160,0.1)');
      ctx.fillStyle=wgL;ctx.fillRect(sX,sY+wT,wT*2,sH-wT*2);
      // Interior comfort gradient
      const inG=ctx.createLinearGradient(0,sY+wT,0,sY+sH-wT);
      inG.addColorStop(0,teal(isDay?0.06:0.04));inG.addColorStop(1,'rgba(60,180,160,0)');
      ctx.fillStyle=inG;ctx.fillRect(sX+wT,sY+wT,sW-wT*2,sH-wT*2);
      // Heat arrows
      for(let i=0;i<4;i++){
        const y=sY+sH*.2+i*(sH*.15);
        ctx.strokeStyle=isDay?amber(0.5):blue(0.4);ctx.lineWidth=1.5;ctx.setLineDash([3,2]);
        ctx.beginPath();ctx.moveTo(isDay?sX+2:sX+wT*2,y);ctx.lineTo(isDay?sX+wT*1.8:sX+4,y);ctx.stroke();ctx.setLineDash([]);
        const ax=isDay?sX+wT*1.8:sX+4;ctx.fillStyle=isDay?amber(0.6):blue(0.5);
        ctx.beginPath();ctx.moveTo(isDay?ax:ax,y);ctx.lineTo(isDay?ax-8:ax+8,y-4);ctx.lineTo(isDay?ax-8:ax+8,y+4);ctx.closePath();ctx.fill();
      }
      ctx.fillStyle=isDay?amber(0.6):blue(0.6);
      const font2=ctx.font;ctx.font=`300 14px 'Cormorant Garamond',serif`;ctx.textAlign='left';
      ctx.fillText(isDay?'Daytime — Wall absorbs heat':'Night — Wall releases stored warmth',sX+wT+16,sY+30);ctx.font=font2;ctx.textAlign='left';
    }

    if(perfMode==='shading'){
      const sunX=W*.8,sunY=H*.05;ctx.fillStyle='rgba(255,210,60,0.9)';ctx.beginPath();ctx.arc(sunX,sunY,18,0,Math.PI*2);ctx.fill();
      const sg=ctx.createRadialGradient(sunX,sunY,0,sunX,sunY,W*.4);sg.addColorStop(0,'rgba(255,200,60,0.08)');sg.addColorStop(1,'rgba(248,245,239,0)');ctx.fillStyle=sg;ctx.fillRect(0,0,W,H);
      // Overhang shading
      ctx.fillStyle='rgba(180,170,155,0.85)';ctx.strokeStyle='rgba(26,26,42,0.25)';ctx.lineWidth=1.2;
      [sX-16,sX+sW*.33,sX+sW*.66].forEach(ox=>{ctx.fillRect(ox,sY-4,sW*.32,14);ctx.strokeRect(ox,sY-4,sW*.32,14);});
      // Shadow zones — good shade
      ctx.fillStyle='rgba(60,180,160,0.08)';ctx.fillRect(sX+wT,sY+wT,sW*.33,sH-wT*2);
      // Sun rays
      for(let i=0;i<8;i++){
        const tx=sX+sW*.1+i*(sW*.1);const ty=sY+wT;
        const prog=(perfT*.04+i/8)*Math.PI;const len=sH*(0.5+Math.sin(prog)*.3);
        const grd=ctx.createLinearGradient(tx,ty,tx+Math.cos(-Math.PI*.25+i*.05)*len,ty+len);
        grd.addColorStop(0,'rgba(255,200,60,0.2)');grd.addColorStop(1,'rgba(255,200,60,0)');
        ctx.fillStyle=grd;
        ctx.beginPath();ctx.moveTo(tx-5,ty);ctx.lineTo(tx+5,ty);ctx.lineTo(tx+Math.cos(-Math.PI*.25+i*.05)*len+8,ty+len);ctx.lineTo(tx+Math.cos(-Math.PI*.25+i*.05)*len-8,ty+len);ctx.closePath();ctx.fill();
      }
    }

    perfT+=.013;requestAnimationFrame(draw);
  }
  draw();
})();

// ════════════════════════════════════════
// GENERATIVE DESIGN — Plan iteration + 3D evolution
// ════════════════════════════════════════
let genT=0,genPhase=0;
const genPhaseNames=['gp0','gp1','gp2','gp3','gp4','gp5'];

(function genScene(){
  const canvas=C('gen-canvas');if(!canvas)return;
  let W,H;
  function resize(){W=canvas.width=canvas.clientWidth;H=canvas.height=canvas.clientHeight;}
  resize();window.addEventListener('resize',resize);
  const ctx=canvas.getContext('2d');

  // Generate a bunch of floor plan variants
  const variants=[];
  for(let v=0;v<12;v++){
    const rooms=[];const numRooms=3+~~(Math.random()*3);
    let cx2=.2+Math.random()*.1,cy2=.2+Math.random()*.1;
    for(let r=0;r<numRooms;r++){
      const w=.1+Math.random()*.12,h=.08+Math.random()*.1;
      rooms.push({x:cx2,y:cy2,w,h,type:['Living','Bedroom','Kitchen','Courtyard'][r%4]});
      cx2+=w+.02;if(cx2+w>.85){cx2=.2;cy2+=h+.02;}
    }
    variants.push({rooms,score:Math.random(),ventScore:Math.random(),lightScore:Math.random(),thermal:Math.random()});
  }
  variants.sort((a,b)=>b.score-a.score);

  function draw(){
    W2(canvas)||(W=canvas.width,H=canvas.height);
    ctx.clearRect(0,0,W,H);
    const bg=ctx.createLinearGradient(0,0,0,H);bg.addColorStop(0,'#EDE5D8');bg.addColorStop(1,'#E5DDD0');
    ctx.fillStyle=bg;ctx.fillRect(0,0,W,H);

    // Update phase
    const newPhase=Math.min(5,~~((genT*0.008)%6));
    if(newPhase!==genPhase){genPhase=newPhase;genPhaseNames.forEach((id,i)=>{const el=C(id);if(el)el.classList.toggle('active',i===genPhase);});}

    const showCount=genPhase<2?variants.length:genPhase<3?8:genPhase<4?4:genPhase<5?2:1;
    const cols=genPhase<3?4:genPhase<5?2:1;
    const rows=Math.ceil(showCount/cols);
    const cardW=W*.18,cardH=H*.25;

    // DRAW PLAN VARIANTS
    variants.slice(0,showCount).forEach((v,idx)=>{
      const col=idx%cols,row=~~(idx/cols);
      const cx2=W*.08+col*(W*.84/cols)+(W*.84/cols)*.5-cardW*.5;
      const cy2=H*.08+row*(H*.82/rows)+H*.82/rows*.5-cardH*.5;
      const isBest=idx===0&&genPhase>=5;
      const alpha=genPhase>=3&&idx>0?0.3:1;

      ctx.globalAlpha=alpha;
      // Card background
      ctx.fillStyle=isBest?'rgba(248,245,239,0.95)':'rgba(240,233,220,0.7)';
      ctx.strokeStyle=isBest?gold(0.7):'rgba(26,26,42,0.15)';
      ctx.lineWidth=isBest?2:0.8;
      ctx.fillRect(cx2,cy2,cardW,cardH);ctx.strokeRect(cx2,cy2,cardW,cardH);

      // Draw rooms
      v.rooms.forEach(r=>{
        const rx=cx2+r.x*cardW*.7,ry=cy2+r.y*cardH*.7;
        const rw=r.w*cardW*.7,rh=r.h*cardH*.7;
        const roomCol=r.type==='Courtyard'?'rgba(60,140,60,0.15)':r.type==='Living'?blue(0.08):'rgba(26,26,42,0.06)';
        ctx.fillStyle=roomCol;ctx.strokeStyle='rgba(26,26,42,0.25)';ctx.lineWidth=.8;
        ctx.fillRect(rx,ry,rw,rh);ctx.strokeRect(rx,ry,rw,rh);
        if(rw>24){ctx.fillStyle='rgba(26,26,42,0.4)';ctx.font=`${Math.min(8,rw*.14)}px 'Space Mono'`;ctx.textAlign='center';ctx.fillText(r.type.substring(0,3),rx+rw/2,ry+rh/2+3);}
      });

      // Performance score bar
      if(genPhase>=1){
        const barY=cy2+cardH-10;const barW2=cardW*.8;
        ctx.fillStyle='rgba(26,26,42,0.08)';ctx.fillRect(cx2+cardW*.1,barY,barW2,4);
        ctx.fillStyle=isBest?GOLD:teal(0.6);ctx.fillRect(cx2+cardW*.1,barY,barW2*v.score,4);
      }

      // Airflow overlay (phase 3+)
      if(genPhase>=3&&idx===0){
        for(let s=0;s<4;s++){
          const prog=(genT*.3+s*.25)%1;ctx.strokeStyle=teal(0.35);ctx.lineWidth=1;ctx.setLineDash([3,3]);
          ctx.beginPath();ctx.moveTo(cx2+2,cy2+cardH*(.2+s*.15));ctx.lineTo(cx2+cardW-2,cy2+cardH*(.15+s*.15));ctx.stroke();ctx.setLineDash([]);
          ctx.fillStyle=teal(0.8);ctx.beginPath();ctx.arc(cx2+cardW*prog,cy2+cardH*(.2+s*.15),2,0,Math.PI*2);ctx.fill();
        }
      }

      // Daylight rays (phase 4+)
      if(genPhase>=4&&idx===0){
        for(let d=0;d<4;d++){
          const sy=cy2+d*(cardH*.2);
          const grd=ctx.createLinearGradient(cx2,sy,cx2+cardW*.6,sy+cardH*.3);
          grd.addColorStop(0,'rgba(255,210,60,0.2)');grd.addColorStop(1,'rgba(255,210,60,0)');
          ctx.fillStyle=grd;ctx.fillRect(cx2,sy,cardW*.6,cardH*.3);
        }
      }

      // Best badge
      if(isBest){
        ctx.fillStyle=gold(0.9);ctx.font=`500 10px 'Space Mono'`;ctx.textAlign='center';
        ctx.fillText('OPTIMAL FORM',cx2+cardW/2,cy2-8);ctx.textAlign='left';
      }
      ctx.globalAlpha=1;
    });

    // Phase label
    const phases=['Generating 247 configurations…','Testing performance against 12 parameters…','Filtering — removing 189 inefficient layouts…','Optimising daylight penetration…','Refining for climate and passive cooling…','The intelligent form emerges.'];
    ctx.fillStyle=genPhase===5?NAVY:INK;
    ctx.font=`300 ${genPhase===5?18:14}px 'Cormorant Garamond',serif`;ctx.textAlign='center';
    ctx.fillText(phases[genPhase],W/2,H-18);ctx.textAlign='left';

    genT+=.015;requestAnimationFrame(draw);
  }
  draw();
})();

// ════════════════════════════════════════
// MATERIAL CARDS — Three cinematic building types
// ════════════════════════════════════════
function matCanvas(id,type){
  const canvas=C(id);if(!canvas)return;
  let t=Math.random()*100;
  function resize(){canvas.width=canvas.clientWidth;canvas.height=canvas.clientHeight;}
  resize();window.addEventListener('resize',resize);
  const ctx=canvas.getContext('2d');

  function draw(){
    W2(canvas)||resize();
    const W=canvas.width,H=canvas.height;
    ctx.clearRect(0,0,W,H);

    if(type==='earth'){
      const bg=ctx.createLinearGradient(0,0,0,H);bg.addColorStop(0,'#C8B89A');bg.addColorStop(1,'#9A8068');
      ctx.fillStyle=bg;ctx.fillRect(0,0,W,H);
      const sky=ctx.createLinearGradient(0,0,0,H*.5);sky.addColorStop(0,'rgba(255,240,200,0.4)');sky.addColorStop(1,'rgba(200,184,154,0)');
      ctx.fillStyle=sky;ctx.fillRect(0,0,W,H*.5);
      ctx.fillStyle='rgba(100,80,55,0.5)';ctx.fillRect(0,H*.75,W,H*.25);
      const bX=W*.1,bY=H*.25,bW=W*.8,bH=H*.5;
      const layers=['rgba(180,150,110,0.9)','rgba(165,135,95,0.9)','rgba(190,165,130,0.9)','rgba(155,125,85,0.9)'];
      layers.forEach((c,i)=>{ctx.fillStyle=c;ctx.fillRect(bX,bY+bH*(i/4),bW,bH/4+1);});
      ctx.strokeStyle='rgba(80,55,30,0.25)';ctx.lineWidth=1;ctx.strokeRect(bX,bY,bW,bH);
      ctx.strokeStyle='rgba(80,55,30,0.15)';ctx.lineWidth=.5;
      for(let i=1;i<16;i++){const ly=bY+bH*(i/16);ctx.beginPath();ctx.moveTo(bX,ly);ctx.lineTo(bX+bW,ly);ctx.stroke();}
      ctx.fillStyle='rgba(255,220,120,0.15)';ctx.strokeStyle='rgba(80,55,30,0.3)';ctx.lineWidth=1;
      [[bX+bW*.15,bY+bH*.2,bW*.18,bH*.35],[bX+bW*.62,bY+bH*.2,bW*.18,bH*.35]].forEach(([x,y,w,h])=>{ctx.fillRect(x,y,w,h);ctx.strokeRect(x,y,w,h);});
      ctx.fillStyle='rgba(140,115,80,0.95)';ctx.fillRect(bX-8,bY-12,bW+16,12);ctx.strokeRect(bX-8,bY-12,bW+16,12);
      const heatY=(t*15)%H;ctx.strokeStyle=`rgba(255,120,40,${0.15-((heatY/H)*.1)})`;ctx.lineWidth=1.5;ctx.setLineDash([3,5]);
      ctx.beginPath();ctx.moveTo(bX+bW*.3,bY);ctx.lineTo(bX+bW*.35,heatY);ctx.stroke();ctx.setLineDash([]);
      ctx.fillStyle='rgba(60,180,160,0.06)';ctx.fillRect(bX+2,bY+2,bW-4,bH-4);
    }

    if(type==='terracotta'){
      const bg=ctx.createLinearGradient(0,0,0,H);bg.addColorStop(0,'#D4936B');bg.addColorStop(1,'#A86040');
      ctx.fillStyle=bg;ctx.fillRect(0,0,W,H);
      const sky=ctx.createLinearGradient(0,0,0,H*.4);sky.addColorStop(0,'rgba(255,200,130,0.5)');sky.addColorStop(1,'rgba(212,147,107,0)');
      ctx.fillStyle=sky;ctx.fillRect(0,0,W,H);
      ctx.fillStyle='rgba(100,55,30,0.5)';ctx.fillRect(0,H*.78,W,H*.22);
      const bX=W*.08,bY=H*.15,bW=W*.84,bH=H*.6;
      ctx.fillStyle='rgba(185,105,65,0.9)';ctx.fillRect(bX,bY,bW,bH);
      const mW=bW/12,mH=bH/10;
      for(let mx=0;mx<12;mx++){for(let my=0;my<10;my++){
        const breathing=Math.sin(t*.5+mx*.3+my*.4)*.025;
        ctx.fillStyle=`rgba(${180+mx*2},${95+my*3},${55+mx},${0.7+breathing})`;
        ctx.fillRect(bX+mx*mW+1,bY+my*mH+1,mW-2,mH-2);
        ctx.fillStyle='rgba(80,40,20,0.08)';ctx.fillRect(bX+mx*mW+mW-2,bY+my*mH+1,2,mH-2);
        ctx.fillRect(bX+mx*mW+1,bY+my*mH+mH-2,mW-2,2);
      }}
      for(let i=0;i<15;i++){
        const px=bX+Math.random()*bW;const py=bY+bH*0.2+(t*12+i*50)%bH*.4;
        ctx.fillStyle=`rgba(200,230,240,${0.25-py/(bY+bH)*.15})`;ctx.beginPath();ctx.arc(px,py,1.5+Math.sin(t+i),0,Math.PI*2);ctx.fill();
      }
      ctx.fillStyle='rgba(80,140,80,0.25)';ctx.strokeStyle='rgba(80,55,30,0.2)';ctx.lineWidth=1;
      ctx.fillRect(bX+bW*.35,bY+bH*.4,bW*.3,bH*.6);ctx.strokeRect(bX+bW*.35,bY+bH*.4,bW*.3,bH*.6);
      ctx.fillStyle='rgba(150,90,50,0.95)';ctx.fillRect(bX-14,bY-14,bW+28,14);
    }

    if(type==='bamboo'){
      const bg=ctx.createLinearGradient(0,0,0,H);bg.addColorStop(0,'#B8D4C0');bg.addColorStop(1,'#7A9E88');
      ctx.fillStyle=bg;ctx.fillRect(0,0,W,H);
      for(let i=0;i<8;i++){const lx=W*(i/8),ly=0,lr=80;
        const lg=ctx.createRadialGradient(lx,ly,0,lx,ly,lr);lg.addColorStop(0,'rgba(255,240,180,0.12)');lg.addColorStop(1,'rgba(184,212,192,0)');
        ctx.fillStyle=lg;ctx.fillRect(0,0,W,H);}
      ctx.fillStyle='rgba(60,100,70,0.5)';ctx.fillRect(0,H*.78,W,H*.22);
      const bX=W*.1,bY=H*.1,bW=W*.8,bH=H*.65;
      ctx.fillStyle='rgba(245,238,220,0.75)';ctx.strokeStyle='rgba(80,100,70,0.2)';ctx.lineWidth=.8;
      ctx.fillRect(bX+30,bY+30,bW-60,bH-30);ctx.strokeRect(bX+30,bY+30,bW-60,bH-30);
      const numCols=8;
      for(let i=0;i<=numCols;i++){
        const cx2=bX+i*(bW/numCols);ctx.strokeStyle='rgba(120,140,60,0.7)';ctx.lineWidth=3+Math.sin(i)*.5;
        ctx.beginPath();ctx.moveTo(cx2,bY);ctx.lineTo(cx2,bY+bH);ctx.stroke();
        for(let j=0;j<5;j++){const ny=bY+bH*(j/4.5+.1);ctx.fillStyle='rgba(100,120,50,0.5)';ctx.beginPath();ctx.ellipse(cx2,ny,3.5,2,0,0,Math.PI*2);ctx.fill();}
      }
      ctx.fillStyle='rgba(150,160,80,0.7)';ctx.strokeStyle='rgba(80,100,40,0.4)';ctx.lineWidth=1;
      ctx.beginPath();ctx.moveTo(bX-20,bY);ctx.lineTo(bX+bW/2,bY-bH*.25);ctx.lineTo(bX+bW+20,bY);ctx.closePath();ctx.fill();ctx.stroke();
      ctx.strokeStyle='rgba(120,140,60,0.3)';ctx.lineWidth=1;
      for(let i=0;i<numCols;i+=2){
        ctx.beginPath();ctx.moveTo(bX+i*(bW/numCols),bY+bH*.1);ctx.lineTo(bX+(i+1)*(bW/numCols),bY+bH*.5);ctx.stroke();
        ctx.beginPath();ctx.moveTo(bX+(i+1)*(bW/numCols),bY+bH*.1);ctx.lineTo(bX+i*(bW/numCols),bY+bH*.5);ctx.stroke();
      }
      for(let i=0;i<4;i++){
        const vx=bX+bW*(.1+i*.25);ctx.strokeStyle='rgba(60,120,60,0.5)';ctx.lineWidth=1.5;
        ctx.beginPath();ctx.moveTo(vx,bY+bH*.05);
        for(let j=0;j<6;j++)ctx.quadraticCurveTo(vx+Math.sin(j*1.2+i)*12,bY+bH*.05+j*(bH*.12),vx+Math.sin((j+1)*1.2+i)*8,bY+bH*.05+(j+1)*(bH*.12));
        ctx.stroke();
      }
      const breathe=Math.sin(t*.4)*.015;ctx.globalAlpha=.15+breathe;
      ctx.fillStyle='rgba(60,180,160,0.1)';ctx.fillRect(bX+32,bY+32,bW-64,bH-32);ctx.globalAlpha=1;
    }

    t+=.01;requestAnimationFrame(draw);
  }
  draw();
}
matCanvas('mat-canvas-1','earth');
matCanvas('mat-canvas-2','terracotta');
matCanvas('mat-canvas-3','bamboo');

// ════════════════════════════════════════
// ABOUT CANVAS — Cinematic environmental atmosphere
// ════════════════════════════════════════
(function aboutScene(){
  const canvas=C('about-canvas');if(!canvas)return;
  let t=0;
  function resize(){canvas.width=canvas.clientWidth;canvas.height=canvas.clientHeight;}
  resize();window.addEventListener('resize',resize);
  const ctx=canvas.getContext('2d');
  function draw(){
    W2(canvas)||resize();
    const W=canvas.width,H=canvas.height;
    ctx.clearRect(0,0,W,H);
    const bg=ctx.createLinearGradient(0,0,W,H);bg.addColorStop(0,NAVY);bg.addColorStop(1,'#0D2040');
    ctx.fillStyle=bg;ctx.fillRect(0,0,W,H);
    ctx.strokeStyle='rgba(248,245,239,0.04)';ctx.lineWidth=.5;
    for(let i=0;i<20;i++){const x=i*(W/20);ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x+H*.3,H);ctx.stroke();}
    for(let i=0;i<10;i++){ctx.beginPath();ctx.moveTo(0,i*(H/10));ctx.lineTo(W,i*(H/10));ctx.stroke();}
    const bCX=W*.5,bBase=H*.85,bW=W*.3,bH=H*.55;
    ctx.fillStyle='rgba(27,79,216,0.08)';ctx.fillRect(bCX-bW/2,bBase-bH,bW,bH);
    ctx.strokeStyle='rgba(27,79,216,0.2)';ctx.lineWidth=1;ctx.strokeRect(bCX-bW/2,bBase-bH,bW,bH);
    ctx.strokeStyle=gold(0.4);ctx.lineWidth=1;
    ctx.beginPath();ctx.moveTo(bCX-bW/2-16,bBase-bH);ctx.lineTo(bCX,bBase-bH-bH*.28);ctx.lineTo(bCX+bW/2+16,bBase-bH);ctx.stroke();
    for(let i=0;i<8;i++){const phase=i/8;const prog=(t*.35+phase)%1;const y=H*.2+i*(H*.5/8);
      ctx.strokeStyle=`rgba(248,245,239,${0.05+Math.sin(t+i)*.03})`;ctx.lineWidth=1;ctx.setLineDash([3,5]);
      ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(W,y+Math.sin(t*.5+i)*12);ctx.stroke();ctx.setLineDash([]);
      ctx.fillStyle='rgba(200,169,110,0.5)';ctx.beginPath();ctx.arc(W*prog,y+Math.sin(t*.5+i)*6,1.5,0,Math.PI*2);ctx.fill();}
    for(let i=0;i<40;i++){const sx=W*((i*127)%100/100),sy=H*((i*83)%100/100);
      ctx.fillStyle=`rgba(200,169,110,${0.1+Math.sin(t*.5+i)*.08})`;ctx.beginPath();ctx.arc(sx,sy,1,0,Math.PI*2);ctx.fill();}
    t+=.008;requestAnimationFrame(draw);
  }
  draw();
})();

// FOUNDER PORTRAIT CANVASES
function founderCanvas(id,col){
  const canvas=C(id);if(!canvas)return;
  let t=Math.random()*100;
  function resize(){canvas.width=canvas.clientWidth;canvas.height=canvas.clientHeight;}
  resize();window.addEventListener('resize',resize);
  const ctx=canvas.getContext('2d');
  function draw(){
    W2(canvas)||resize();
    const W=canvas.width,H=canvas.height;
    ctx.clearRect(0,0,W,H);
    const bg=ctx.createLinearGradient(0,0,0,H);bg.addColorStop(0,CREAM2);bg.addColorStop(1,'#D8D0C4');
    ctx.fillStyle=bg;ctx.fillRect(0,0,W,H);
    ctx.strokeStyle='rgba(26,26,42,0.06)';ctx.lineWidth=.6;
    for(let i=0;i<12;i++){const y=i*(H/12);ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(W,y);ctx.stroke();}
    const cx2=W*.5,cy2=H*.38;
    ctx.fillStyle='rgba(26,26,42,0.08)';ctx.strokeStyle='rgba(26,26,42,0.15)';ctx.lineWidth=1;
    ctx.beginPath();ctx.arc(cx2,cy2-40,45,0,Math.PI*2);ctx.fill();ctx.stroke();
    ctx.beginPath();ctx.moveTo(cx2-80,cy2+20);ctx.quadraticCurveTo(cx2,cy2+5,cx2+80,cy2+20);ctx.lineTo(cx2+95,H);ctx.lineTo(cx2-95,H);ctx.closePath();ctx.fill();ctx.stroke();
    ctx.fillStyle=gold(0.3);ctx.beginPath();ctx.arc(cx2,cy2-40,46,Math.PI*.6,Math.PI*.9);ctx.stroke();
    const pulse=Math.sin(t*.3)*.01;ctx.globalAlpha=.15+pulse;
    const aura=ctx.createRadialGradient(cx2,cy2,0,cx2,cy2,100);aura.addColorStop(0,col);aura.addColorStop(1,'rgba(248,245,239,0)');
    ctx.fillStyle=aura;ctx.fillRect(0,0,W,H);ctx.globalAlpha=1;
    ctx.fillStyle='rgba(26,26,42,0.35)';ctx.font=`300 11px 'Space Mono'`;ctx.textAlign='center';ctx.fillText('PHOTO TO BE ADDED',W/2,H*.82);ctx.textAlign='left';
    t+=.008;requestAnimationFrame(draw);
  }
  draw();
}
founderCanvas('fc1','rgba(27,79,216,0.15)');
founderCanvas('fc2','rgba(200,169,110,0.12)');

// VIDEO CANVASES
['vc1','vc2','vc3'].forEach((id,idx)=>{
  const canvas=C(id);if(!canvas)return;
  let t=idx*20;
  function resize(){canvas.width=canvas.clientWidth;canvas.height=canvas.clientHeight;}
  resize();window.addEventListener('resize',resize);
  const ctx=canvas.getContext('2d');
  function draw(){
    W2(canvas)||resize();
    const W=canvas.width,H=canvas.height;
    ctx.clearRect(0,0,W,H);
    const bg=ctx.createLinearGradient(0,0,W,H);bg.addColorStop(0,NAVY);bg.addColorStop(1,'#0A1525');
    ctx.fillStyle=bg;ctx.fillRect(0,0,W,H);
    const bCX=W*.5,bBase=H*.75,bW=W*.5,bH=H*.4;
    ctx.strokeStyle=`rgba(200,169,110,${0.15+idx*.05})`;ctx.lineWidth=.8;
    ctx.strokeRect(bCX-bW/2,bBase-bH,bW,bH);
    ctx.beginPath();ctx.moveTo(bCX-bW/2-8,bBase-bH);ctx.lineTo(bCX,bBase-bH-bH*.3);ctx.lineTo(bCX+bW/2+8,bBase-bH);ctx.stroke();
    ctx.strokeStyle=gold(0.2);ctx.lineWidth=1;
    ctx.beginPath();for(let x=0;x<=W;x+=4){ctx.lineTo(x,H*.5+Math.sin(x*.02+t)*.3+Math.cos(x*.01+t*.5)*20);}ctx.stroke();
    t+=.01;requestAnimationFrame(draw);
  }
  draw();
});

// CTA CANVAS
(function ctaScene(){
  const canvas=C('cta-canvas');if(!canvas)return;
  let t=0;
  function resize(){canvas.width=canvas.clientWidth;canvas.height=canvas.clientHeight;}
  resize();window.addEventListener('resize',resize);
  const ctx=canvas.getContext('2d');
  function draw(){
    W2(canvas)||resize();
    const W=canvas.width,H=canvas.height;
    ctx.clearRect(0,0,W,H);
    ctx.strokeStyle='rgba(248,245,239,0.03)';ctx.lineWidth=.5;
    for(let i=0;i<16;i++){const x=i*(W/16);ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x+H*.4,H);ctx.stroke();}
    for(let i=0;i<8;i++){ctx.beginPath();ctx.moveTo(0,i*(H/8));ctx.lineTo(W,i*(H/8));ctx.stroke();}
    [[W*.25,H*.8,W*.12,H*.4],[W*.5,H*.8,W*.18,H*.55],[W*.75,H*.8,W*.1,H*.35]].forEach(([x,y,w,h])=>{
      ctx.fillStyle='rgba(27,79,216,0.06)';ctx.strokeStyle='rgba(27,79,216,0.12)';ctx.lineWidth=.8;
      ctx.fillRect(x-w/2,y-h,w,h);ctx.strokeRect(x-w/2,y-h,w,h);
      ctx.strokeStyle=gold(0.2);ctx.beginPath();ctx.moveTo(x-w/2-8,y-h);ctx.lineTo(x,y-h-h*.2);ctx.lineTo(x+w/2+8,y-h);ctx.stroke();
    });
    const gg=ctx.createRadialGradient(W/2,H/2,0,W/2,H/2,W*.4);gg.addColorStop(0,'rgba(200,169,110,0.06)');gg.addColorStop(1,'rgba(11,22,40,0)');
    ctx.fillStyle=gg;ctx.fillRect(0,0,W,H);
    for(let i=0;i<25;i++){const px=W*.5+Math.sin(t*.3+i*1.7)*W*.4;const py=H*.5+Math.cos(t*.2+i*2.1)*H*.3;ctx.fillStyle=gold(0.15+Math.sin(t+i)*.08);ctx.beginPath();ctx.arc(px,py,1.2,0,Math.PI*2);ctx.fill();}
    t+=.007;requestAnimationFrame(draw);
  }
  draw();
})();

// FOOTER CANVAS — breathing architectural grid
(function footerScene(){
  const canvas=C('footer-canvas');if(!canvas)return;
  let t=0;
  function resize(){canvas.width=canvas.clientWidth;canvas.height=canvas.clientHeight;}
  resize();window.addEventListener('resize',resize);
  const ctx=canvas.getContext('2d');
  function draw(){
    W2(canvas)||resize();
    const W=canvas.width,H=canvas.height;
    ctx.clearRect(0,0,W,H);
    const nodes=[];for(let i=0;i<12;i++)nodes.push({x:W*(i/11),y:H*.5+Math.sin(i*1.3)*H*.3,ph:i*.5});
    nodes.forEach(n=>{
      const pulse=Math.sin(t*.4+n.ph)*.5+.5;
      ctx.fillStyle=`rgba(200,169,110,${0.06+pulse*.06})`;ctx.beginPath();ctx.arc(n.x,n.y,2+pulse*2,0,Math.PI*2);ctx.fill();
    });
    ctx.strokeStyle='rgba(200,169,110,0.04)';ctx.lineWidth=.5;
    nodes.forEach((n,i)=>{if(i<nodes.length-1){ctx.beginPath();ctx.moveTo(n.x,n.y);ctx.lineTo(nodes[i+1].x,nodes[i+1].y);ctx.stroke();}});
    ctx.strokeStyle='rgba(248,245,239,0.025)';ctx.lineWidth=.4;
    for(let i=0;i<5;i++){ctx.beginPath();for(let x=0;x<=W;x+=8)ctx.lineTo(x,H*.3+i*(H*.1)+Math.sin(x*.012+t*.2+i)*(6+i*2));ctx.stroke();}
    t+=.008;requestAnimationFrame(draw);
  }
  draw();
})();
