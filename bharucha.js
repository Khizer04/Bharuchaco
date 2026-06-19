/* ============================================================
   Bharucha & Co. — shared behaviors (used by every page).
   Everything is guarded by element existence, so each page
   only runs what applies to it. Load this AFTER any inline
   script that generates page content.
   ============================================================ */
(function(){
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Scroll reveal */
  const io = new IntersectionObserver((es)=>es.forEach(e=>{
    if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target);}
  }),{threshold:.12});
  document.querySelectorAll('.sr').forEach(el=>io.observe(el));

  /* Counters */
  const cio = new IntersectionObserver((es)=>es.forEach(e=>{
    if(e.isIntersecting){const el=e.target,t=+el.dataset.target;let n=0;const step=Math.max(1,t/60);
      const tick=()=>{n+=step;if(n>=t){el.textContent=t;}else{el.textContent=Math.floor(n);requestAnimationFrame(tick);}};
      tick();cio.unobserve(el);}
  }),{threshold:.6});
  document.querySelectorAll('.counter').forEach(el=>cio.observe(el));

  /* Nav scroll state (transparent over hero → white on scroll) */
  const nav=document.getElementById('nav');
  if(nav){
    const navItems=document.getElementById('navItems'),navCta=document.getElementById('navCta'),
          logoWhite=document.getElementById('logoWhite'),logoNavy=document.getElementById('logoNavy');
    function navState(){
      const scrolled=window.scrollY>40;
      nav.classList.toggle('bg-white/90',scrolled);
      nav.classList.toggle('backdrop-blur-md',scrolled);
      nav.classList.toggle('shadow-sm',scrolled);
      if(logoWhite)logoWhite.classList.toggle('opacity-0',scrolled);
      if(logoNavy)logoNavy.classList.toggle('opacity-0',!scrolled);
      if(navItems)navItems.querySelectorAll('a').forEach(a=>{a.classList.toggle('text-white/90',!scrolled);a.classList.toggle('text-ink',scrolled);});
      if(navCta){
        navCta.classList.toggle('border-white/30',!scrolled);navCta.classList.toggle('text-white',!scrolled);
        navCta.classList.toggle('border-navy/30',scrolled);navCta.classList.toggle('text-navy',scrolled);
        navCta.classList.toggle('hover:bg-navy',scrolled);navCta.classList.toggle('hover:text-white',scrolled);
      }
    }
    navState();window.addEventListener('scroll',navState);
  }

  /* Mobile menu */
  const burger=document.getElementById('burger'),mm=document.getElementById('mobileMenu');
  if(burger&&mm){
    burger.addEventListener('click',()=>mm.classList.toggle('hidden'));
    mm.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>mm.classList.add('hidden')));
  }

  /* Per-letter headline (hero) */
  document.querySelectorAll('.letters').forEach(el=>{
    const txt=el.dataset.text;
    el.innerHTML=[...txt].map(c=>c===' '?'<span class="ltr" style="width:.32em">&nbsp;</span>':`<span class="ltr">${c}</span>`).join('');
  });

  /* Hero reveal */
  const hero=document.getElementById('top');
  if(hero){requestAnimationFrame(()=>hero.classList.add('hero-in'));}

  if(reduce) return;

  /* Hero parallax + spotlight + particle field */
  if(hero){
    const parallax=[...document.querySelectorAll('.parallax')];
    let tx=0,ty=0,cx=0,cy=0;
    hero.addEventListener('mousemove',e=>{
      const r=hero.getBoundingClientRect();
      tx=(e.clientX-r.left)/r.width-0.5; ty=(e.clientY-r.top)/r.height-0.5;
      hero.style.setProperty('--mx',(e.clientX-r.left)+'px');
      hero.style.setProperty('--my',(e.clientY-r.top)+'px');
    });
    (function loop(){
      cx+=(tx-cx)*.06; cy+=(ty-cy)*.06;
      parallax.forEach(p=>{const d=+p.dataset.depth||10;p.style.transform=`translate(${cx*d}px,${cy*d}px)`;});
      requestAnimationFrame(loop);
    })();

    const cv=document.getElementById('heroCanvas');
    if(cv){
      const ctx=cv.getContext('2d');
      let W,H,parts=[],mouse={x:-999,y:-999};
      function size(){W=cv.width=hero.offsetWidth;H=cv.height=hero.offsetHeight;
        const n=Math.min(70,Math.floor(W/22));parts=Array.from({length:n},()=>({
          x:Math.random()*W,y:Math.random()*H,vx:(Math.random()-.5)*.3,vy:(Math.random()-.5)*.3,r:Math.random()*1.6+.4}));}
      size();window.addEventListener('resize',size);
      hero.addEventListener('mousemove',e=>{const r=hero.getBoundingClientRect();mouse.x=e.clientX-r.left;mouse.y=e.clientY-r.top;});
      hero.addEventListener('mouseleave',()=>{mouse.x=mouse.y=-999;});
      (function draw(){
        ctx.clearRect(0,0,W,H);
        for(const p of parts){
          p.x+=p.vx;p.y+=p.vy;
          if(p.x<0||p.x>W)p.vx*=-1; if(p.y<0||p.y>H)p.vy*=-1;
          const dx=p.x-mouse.x,dy=p.y-mouse.y,dist=Math.hypot(dx,dy);
          if(dist<120){const f=(120-dist)/120;p.x+=dx/dist*f*1.2;p.y+=dy/dist*f*1.2;}
          ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,7);ctx.fillStyle='rgba(199,210,254,.55)';ctx.fill();
        }
        for(let i=0;i<parts.length;i++)for(let j=i+1;j<parts.length;j++){
          const a=parts[i],b=parts[j],d=Math.hypot(a.x-b.x,a.y-b.y);
          if(d<110){ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);
            ctx.strokeStyle='rgba(165,180,252,'+(1-d/110)*.18+')';ctx.lineWidth=.6;ctx.stroke();}
        }
        requestAnimationFrame(draw);
      })();
    }
  }

  /* Magnetic buttons */
  document.querySelectorAll('.magnetic').forEach(btn=>{
    btn.addEventListener('mousemove',e=>{const r=btn.getBoundingClientRect();
      btn.style.transform=`translate(${(e.clientX-r.left-r.width/2)*.3}px,${(e.clientY-r.top-r.height/2)*.4}px)`;});
    btn.addEventListener('mouseleave',()=>btn.style.transform='');
  });

  /* Custom cursor */
  const cur=document.getElementById('cursor');
  if(cur){
    const dot=document.getElementById('cursorDot');
    let mx=0,my=0,dx2=0,dy2=0;
    window.addEventListener('mousemove',e=>{mx=e.clientX;my=e.clientY;cur.style.opacity=1;
      if(dot){dot.style.opacity=1;dot.style.left=mx+'px';dot.style.top=my+'px';}});
    (function cl(){dx2+=(mx-dx2)*.18;dy2+=(my-dy2)*.18;cur.style.left=dx2+'px';cur.style.top=dy2+'px';requestAnimationFrame(cl);})();
    document.querySelectorAll('a,button,.pa-card,.ltr,.schip,.ipcard,.mcard').forEach(el=>{
      el.addEventListener('mouseenter',()=>cur.classList.add('big'));
      el.addEventListener('mouseleave',()=>cur.classList.remove('big'));
    });
  }
})();
