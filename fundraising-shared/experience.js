(() => {
  'use strict';
  function seedButtonDots(btn, force){
    if(!btn || btn.classList.contains('hero-ecosystem-chip') || btn.disabled) return;
    const existing=btn.querySelector('.btn-bubbles');
    const rect=btn.getBoundingClientRect();
    if(rect.width<8){
      if(!btn.dataset.btnDotsWait){
        btn.dataset.btnDotsWait='1';
        btn.addEventListener('mouseenter', () => seedButtonDots(btn, true), {once:true});
      }
      return;
    }
    const w=rect.width;
    const h=Math.max(rect.height||48, 40);
    const seededW=Number(btn.dataset.btnDotsW||0);
    if(existing && !force && Math.abs(seededW-w)<6) return;
    if(existing) existing.remove();
    const wrap=document.createElement('span');
    wrap.className='btn-bubbles';
    wrap.setAttribute('aria-hidden','true');
    const pitch=Math.max(h*0.27, 12);
    const cols=Math.max(4, Math.round(w/pitch));
    const rows=h>=64?4:3;
    for(let r=0;r<rows;r++){
      const count=r%2?cols:Math.max(3, cols-1);
      for(let c=0;c<count;c++){
        const dot=document.createElement('i');
        const x=((c+0.5)/count)*100;
        const y=((r+0.5)/rows)*100;
        const jx=((c*17+r*11)%9-4)*0.55;
        const jy=((c*13+r*19)%7-3)*0.4;
        const size=h*(0.3+((c*3+r*5)%5)*0.018);
        const delay=(x/100)*0.32+(y/100)*0.14+((c+r)%4)*0.03;
        dot.style.setProperty('--x',(x+jx).toFixed(2)+'%');
        dot.style.setProperty('--y',(y+jy).toFixed(1)+'%');
        dot.style.setProperty('--s',size.toFixed(1)+'px');
        dot.style.setProperty('--dx',((((c*5+r)%5)-2)*(h*0.02)).toFixed(1)+'px');
        dot.style.setProperty('--dy',((((c*3+r*2)%5)-2)*(h*0.018)).toFixed(1)+'px');
        dot.style.setProperty('--d',delay.toFixed(3)+'s');
        wrap.append(dot);
      }
    }
    btn.dataset.btnDotsW=String(Math.round(w));
    btn.prepend(wrap);
  }
  function watchButtonDots(btn){
    seedButtonDots(btn);
    if(!btn || btn.dataset.btnDotsObs || typeof ResizeObserver==='undefined') return;
    btn.dataset.btnDotsObs='1';
    const ro=new ResizeObserver(() => {
      if(btn.matches(':hover') || btn.matches(':focus-visible')) return;
      seedButtonDots(btn, true);
    });
    ro.observe(btn);
  }
  document.querySelectorAll('.button.secondary, .dc-button.secondary, .hero-conversion .dc-hero-actions .dc-button').forEach(watchButtonDots);
})();

(() => {
  'use strict';
  document.documentElement.classList.add('dc-ready');
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const emit = (name, detail = {}) => document.dispatchEvent(new CustomEvent('dc:interaction', {detail: {name, proposal: document.body.dataset.proposal, ...detail}}));
  // Local UI events only. No analytics provider, storage or personal data transmission.
  const HOME_PATH = 'fundraising-soluzioni-per-il-terzo-settore/';
  const NAV_ITEMS = [
    {id:'fundraising', label:'Fundraising', hash:'#hero'},
    {id:'strumenti', label:'Gli strumenti', hash:'#strumenti'},
    {id:'ecosistema', label:'L’ecosistema', hash:'#dc-ecosistema'},
    {id:'community', label:'La community', hash:'#community'}
  ];
  const NAV_PAGE_GROUPS = [
    {
      id:'fundraising',
      label:'Fundraising',
      pages:[
        {label:'Fundraising', path:HOME_PATH},
        {label:'Gli strumenti', path:HOME_PATH, hash:'#strumenti'},
        {label:'L’ecosistema', path:'ecosistema/'},
        {label:'La community', path:HOME_PATH, hash:'#community'}
      ]
    },
    {
      id:'mentor',
      label:'Mentor CRM',
      pages:[
        {label:'Mentor CRM', path:'mentor-crm/'},
        {label:'Moduli di Mentor', path:'mentor-crm/moduli-di-mentor/'}
      ]
    },
    {
      id:'moduli',
      label:'Moduli',
      pages:[
        {label:'Area Donatori', path:'mentor-crm/moduli-di-mentor/area-donatori/'},
        {label:'High Value Donors', path:'mentor-crm/moduli-di-mentor/high-value-donors/'},
        {label:'Telemarketing', path:'mentor-crm/moduli-di-mentor/telemarketing/'},
        {label:'Mentor Automation', path:'mentor-crm/moduli-di-mentor/mentor-automation/'},
        {label:'Questionari', path:'mentor-crm/moduli-di-mentor/questionari/'},
        {label:'Landing Page Maker', path:'mentor-crm/moduli-di-mentor/landing-page-maker/'},
        {label:'Lead & Donations', path:'mentor-crm/moduli-di-mentor/leads-and-donations/'},
        {label:'Lasciti testamentari', path:'mentor-crm/moduli-di-mentor/lasciti-testamentari/'},
        {label:'Eventi Web', path:'mentor-crm/moduli-di-mentor/eventi-web/'},
        {label:'Data Quality e Normalizzazione', path:'mentor-crm/moduli-di-mentor/data-quality-e-normalizzazione/'},
        {label:'Riconciliazioni', path:'mentor-crm/moduli-di-mentor/riconciliazioni/'}
      ]
    },
    {
      id:'integrazioni',
      label:'Integrazioni',
      stack:true,
      pages:[
        {label:'Integrazioni', path:'mentor-integrazioni/'}
      ]
    },
    {
      id:'sense',
      label:'DirectSense',
      stack:true,
      pages:[
        {label:'DirectSense', path:'direct-sense-business-intelligence/'}
      ]
    },
    {
      id:'analisi',
      label:'Analisi Predittive',
      stack:true,
      pages:[
        {label:'Analisi Predittive', path:'fundraising-analisi-predittive/'}
      ]
    }
  ];
  function sitoRoot(){
    const path=(location.pathname||'').replace(/\\/g,'/');
    const idx=path.indexOf('/sito/');
    if((location.protocol==='http:'||location.protocol==='https:') && idx!==-1){
      return path.slice(0, idx+6);
    }
    const src=document.querySelector('script[src*="experience.js"]')?.getAttribute('src')||'';
    const ups=(src.match(/\.\.\//g)||[]).length;
    return ups>1 ? '../'.repeat(ups-1) : './';
  }
  function pagePath(){
    let path=(location.pathname||'').replace(/\\/g,'/');
    const idx=path.indexOf('/sito/');
    if(idx!==-1) path=path.slice(idx+6);
    return path.replace(/index\.html$/,'').replace(/\/?$/,'/');
  }
  function isFundraisingHome(){
    const path=pagePath();
    return path===HOME_PATH || path==='' || path==='/';
  }
  function pageHref(root, home, item){
    const hash=item.hash||'';
    if(home && item.path===HOME_PATH) return hash||'#hero';
    return root+item.path+hash;
  }
  function isCurrentPage(item){
    const current=pagePath();
    const onHome=isFundraisingHome();
    if(item.hash){
      return (current===item.path || (onHome && item.path===HOME_PATH)) && location.hash===item.hash;
    }
    if(item.path===HOME_PATH) return onHome && !location.hash;
    return current===item.path;
  }
  function createNavLink(root, home, item){
    const a=document.createElement('a');
    a.href=pageHref(root, home, item);
    a.textContent=item.label;
    if(isCurrentPage(item)) a.setAttribute('aria-current','page');
    return a;
  }
  function createMenuHeading(label){
    const heading=document.createElement('p');
    heading.className='nav-menu-heading';
    heading.textContent=label;
    return heading;
  }
  function appendMenuPages(parent, root, home, pages){
    pages.forEach(item=>parent.append(createNavLink(root, home, item)));
  }
  function renderDiscoverMenu(root, home){
    const dropdown=document.createElement('div');
    dropdown.className='nav-dropdown';
    const button=document.createElement('button');
    button.type='button';
    button.setAttribute('aria-expanded','false');
    button.setAttribute('aria-haspopup','true');
    button.textContent='Scopri di più';
    const menu=document.createElement('div');
    menu.className='menu';
    menu.setAttribute('role','region');
    menu.setAttribute('aria-label','Tutte le pagine');
    const inner=document.createElement('div');
    inner.className='wrap nav-menu-inner';
    const stack=document.createElement('div');
    stack.className='nav-menu-stack';
    NAV_PAGE_GROUPS.forEach(group=>{
      if(group.stack){
        group.pages.forEach(item=>stack.append(createNavLink(root, home, item)));
        return;
      }
      const section=document.createElement('div');
      section.className='nav-menu-group'+(group.id==='moduli'?' nav-menu-group--moduli':'');
      if(group.id==='moduli'){
        const split=Math.ceil(group.pages.length/2);
        [group.pages.slice(0,split), group.pages.slice(split)].forEach(columnPages=>{
          const column=document.createElement('div');
          column.className='nav-menu-moduli-col';
          column.append(createMenuHeading(group.label));
          appendMenuPages(column, root, home, columnPages);
          section.append(column);
        });
      }else{
        section.append(createMenuHeading(group.label));
        appendMenuPages(section, root, home, group.pages);
      }
      inner.append(section);
    });
    inner.append(stack);
    menu.append(inner);
    dropdown.append(button, menu);
    return dropdown;
  }
  function renderSiteNav(navEl){
    if(!navEl) return;
    const root=sitoRoot();
    const home=isFundraisingHome();
    const frag=document.createDocumentFragment();
    NAV_ITEMS.forEach(item=>{
      const a=document.createElement('a');
      a.href=home ? item.hash : root+HOME_PATH+item.hash;
      a.textContent=item.label;
      a.dataset.navSection=item.id;
      frag.append(a);
    });
    frag.append(renderDiscoverMenu(root, home));
    const cta=document.createElement('a');
    cta.href='#contatti';
    cta.textContent='Richiedi una consulenza';
    frag.append(cta);
    navEl.replaceChildren(frag);
  }
  renderSiteNav(document.querySelector('.nav'));
  const nav = document.querySelector('.nav');
  const toggle = document.querySelector('.nav-toggle');
  const dropdowns = [...document.querySelectorAll('.nav-dropdown')];
  function closeDropdowns(except) {
    dropdowns.forEach(d => { if(d !== except) {d.classList.remove('is-open'); d.querySelector('button').setAttribute('aria-expanded','false');} });
  }
  function closeNav(restore = false) {
    if(nav && toggle) {nav.classList.remove('is-open'); toggle.setAttribute('aria-expanded','false'); toggle.setAttribute('aria-label','Apri menu'); if(restore) toggle.focus();}
    closeDropdowns();
  }
  if(nav && toggle) toggle.addEventListener('click', () => {
    const open = !nav.classList.contains('is-open');
    nav.classList.toggle('is-open',open); toggle.setAttribute('aria-expanded',String(open)); toggle.setAttribute('aria-label',open?'Chiudi menu':'Apri menu');
    if(!open) closeDropdowns();
  });
  dropdowns.forEach((d,i) => {
    const b = d.querySelector('button'), menu = d.querySelector('.menu');
    if(!b || !menu) return;
    menu.id ||= `dc-menu-${i}`; b.setAttribute('aria-controls',menu.id); b.setAttribute('aria-expanded','false');
    b.addEventListener('click', () => {const open=!d.classList.contains('is-open'); closeDropdowns(d); d.classList.toggle('is-open',open); b.setAttribute('aria-expanded',String(open));});
    d.addEventListener('keydown',e => {if(e.key==='Escape'){e.stopPropagation();closeDropdowns();b.focus();}});
  });
  document.addEventListener('keydown',e => {if(e.key==='Escape' && nav?.classList.contains('is-open')) closeNav(true);});
  document.addEventListener('click',e => {
    const menuLink=e.target.closest?.('.nav-dropdown .menu a');
    if(menuLink){
      if(e.button!==0||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey) return;
      e.preventDefault();
      const href=menuLink.href;
      closeNav();
      window.location.assign(href);
      return;
    }
    if(!e.target.closest('.site-header')) closeNav();
    else if(e.target.closest('.nav a')) closeNav();
  });
  document.addEventListener('focusin', e => {if(!e.target.closest('.nav-dropdown')) closeDropdowns(); if(nav?.classList.contains('is-open') && !e.target.closest('.site-header')) closeNav();});
  window.matchMedia('(max-width: 1120px)').addEventListener('change',()=>closeNav());

  function spyHomeNav(){
    if(!nav || !isFundraisingHome()) return;
    const sections=NAV_ITEMS.map(item=>({id:item.id, el:document.querySelector(item.hash)})).filter(item=>item.el);
    if(!sections.length) return;
    const styles=getComputedStyle(document.documentElement);
    const offset=Math.max(
      (parseFloat(styles.getPropertyValue('--header-h'))||72)+48,
      (parseFloat(styles.scrollPaddingTop)||110)+8
    );
    let activeId=sections[0].id;
    for(const section of sections){
      if(section.el.getBoundingClientRect().top<=offset) activeId=section.id;
    }
    nav.querySelectorAll('a[data-nav-section]').forEach(a=>{
      if(a.dataset.navSection===activeId) a.setAttribute('aria-current','page');
      else a.removeAttribute('aria-current');
    });
  }
  let spyFrame=0;
  function requestNavSpy(){
    if(spyFrame) return;
    spyFrame=requestAnimationFrame(()=>{spyFrame=0; spyHomeNav();});
  }
  spyHomeNav();
  window.addEventListener('scroll', requestNavSpy, {passive:true});
  window.addEventListener('hashchange', spyHomeNav);
  window.addEventListener('resize', requestNavSpy);

  const moduleTags=document.querySelector('.module-tags');
  const activeModule=moduleTags?.querySelector('[aria-current="page"]');
  if(moduleTags&&activeModule)requestAnimationFrame(()=>{
    moduleTags.scrollLeft=Math.max(0,activeModule.offsetLeft-(moduleTags.clientWidth-activeModule.clientWidth)/2);
  });

  const reducedMotion=window.matchMedia('(prefers-reduced-motion: reduce)');
  function playHl(el, cls, ms){
    if(reducedMotion.matches){
      if(el.classList.contains('hl--connect')) el.classList.add('is-drawn');
      return;
    }
    el.classList.remove('is-drawn');
    el.classList.remove(cls);
    void el.offsetWidth;
    el.classList.add(cls);
    window.clearTimeout(el._hlTimer);
    el._hlTimer=window.setTimeout(()=>{
      el.classList.remove(cls);
      if(el.classList.contains('hl--connect')) el.classList.add('is-drawn');
    }, ms);
  }

  function bindHl(el, cls, ms){
    const start=()=>playHl(el, cls, ms);
    start();
    window.setTimeout(start, 50);
    el.addEventListener('pointerenter', start);
  }

  function bindLoop(el, cls){
    if(reducedMotion.matches){
      el.classList.add(cls);
      return;
    }
    el.classList.add(cls);
    el.addEventListener('pointerenter',()=>{
      el.classList.remove(cls);
      void el.offsetWidth;
      el.classList.add(cls);
    });
  }

  function ellipsePoints(cx,cy,rx,ry,rotDeg,n,start,sweep){
    const rot=rotDeg*Math.PI/180;
    const pts=[];
    for(let i=0;i<n;i++){
      const a=start+sweep*(i/(n-1));
      const x0=Math.cos(a)*rx;
      const y0=Math.sin(a)*ry;
      pts.push({
        x:cx+x0*Math.cos(rot)-y0*Math.sin(rot),
        y:cy+x0*Math.sin(rot)+y0*Math.cos(rot)
      });
    }
    return pts;
  }

  function linePath(pts){
    return 'M '+pts.map(p=>p.x.toFixed(2)+' '+p.y.toFixed(2)).join(' L ');
  }

  function taperedRibbon(pts,w0,w1){
    const left=[], right=[];
    for(let i=0;i<pts.length;i++){
      const t=i/(pts.length-1);
      const w=Math.max(0.55, w0+(w1-w0)*Math.pow(t,0.78));
      const i0=Math.max(0,i-1);
      const i1=Math.min(pts.length-1,i+1);
      let tx=pts[i1].x-pts[i0].x, ty=pts[i1].y-pts[i0].y;
      const len=Math.hypot(tx,ty)||1;
      const nx=-ty/len, ny=tx/len;
      left.push({x:pts[i].x+nx*w/2, y:pts[i].y+ny*w/2});
      right.push({x:pts[i].x-nx*w/2, y:pts[i].y-ny*w/2});
    }
    const fmt=p=>p.x.toFixed(2)+' '+p.y.toFixed(2);
    const capS=Math.hypot(left[0].x-right[0].x,left[0].y-right[0].y)/2;
    const capE=Math.hypot(left[left.length-1].x-right[right.length-1].x,left[left.length-1].y-right[right.length-1].y)/2;
    let d='M '+fmt(left[0]);
    for(let i=1;i<left.length;i++) d+=' L '+fmt(left[i]);
    d+=' A '+capE.toFixed(2)+' '+capE.toFixed(2)+' 0 0 1 '+fmt(right[right.length-1]);
    for(let i=right.length-2;i>=0;i--) d+=' L '+fmt(right[i]);
    d+=' A '+capS.toFixed(2)+' '+capS.toFixed(2)+' 0 0 1 '+fmt(left[0])+' Z';
    return d;
  }

  function layoutCircle(el){
    const svg=el.querySelector('.hl-rings');
    if(!svg) return;
    const w=Math.max(el.offsetWidth, 8);
    const h=Math.max(el.offsetHeight, 8);
    const sizeKey=w+'x'+h;
    if(el._hlRingSize===sizeKey && svg.querySelector('.hl-taper')) return;
    el._hlRingSize=sizeKey;
    svg.setAttribute('viewBox',`0 0 ${w} ${h}`);
    svg.setAttribute('preserveAspectRatio','none');
    const cx=w/2;
    const cy=h/2+0.2;
    const ns='http://www.w3.org/2000/svg';
    if(!el._hlMaskA) el._hlMaskA='hl-mask-a-'+Math.random().toString(36).slice(2,8);
    if(!el._hlMaskB) el._hlMaskB='hl-mask-b-'+Math.random().toString(36).slice(2,8);
    const ptsA=ellipsePoints(cx, cy, Math.max(w/2-2.4, 13), Math.max(h/2-1.8, 11), -7, 52, -0.95, Math.PI*1.88);
    const ptsB=ellipsePoints(cx+0.8, cy-0.6, Math.max(w/2-0.4, 15), Math.max(h/2-0.6, 12), 6, 52, 0.35, Math.PI*1.86);
    svg.replaceChildren();
    const defs=document.createElementNS(ns,'defs');
    function maskFor(id, pts, cls){
      const mask=document.createElementNS(ns,'mask');
      mask.setAttribute('id', id);
      mask.setAttribute('maskUnits','userSpaceOnUse');
      const draw=document.createElementNS(ns,'path');
      draw.setAttribute('class','hl-draw '+cls);
      draw.setAttribute('d', linePath(pts));
      draw.setAttribute('pathLength','100');
      mask.append(draw);
      defs.append(mask);
    }
    maskFor(el._hlMaskA, ptsA, 'hl-draw-a');
    maskFor(el._hlMaskB, ptsB, 'hl-draw-b');
    svg.append(defs);
    const taperA=document.createElementNS(ns,'path');
    taperA.setAttribute('class','hl-taper hl-taper-a');
    taperA.setAttribute('d', taperedRibbon(ptsA, 11.5, 1.05));
    taperA.setAttribute('mask','url(#'+el._hlMaskA+')');
    const taperB=document.createElementNS(ns,'path');
    taperB.setAttribute('class','hl-taper hl-taper-b');
    taperB.setAttribute('d', taperedRibbon(ptsB, 8.2, 0.85));
    taperB.setAttribute('mask','url(#'+el._hlMaskB+')');
    svg.append(taperA, taperB);
  }

  function roundedRectPath(x,y,w,h,r){
    return `M ${x+r} ${y} H ${x+w-r} A ${r} ${r} 0 0 1 ${x+w} ${y+r} V ${y+h-r} A ${r} ${r} 0 0 1 ${x+w-r} ${y+h} H ${x+r} A ${r} ${r} 0 0 1 ${x} ${y+h-r} V ${y+r} A ${r} ${r} 0 0 1 ${x+r} ${y} Z`;
  }

  function pointOnRoundedRect(x,y,w,h,r,t){
    const straightW=Math.max(w-2*r,0);
    const straightH=Math.max(h-2*r,0);
    const arc=Math.PI*r/2;
    const peri=2*(straightW+straightH)+4*arc;
    let d=(((t%1)+1)%1)*peri;
    if(d<=straightW) return [x+r+d, y];
    d-=straightW;
    if(d<=arc){
      const a=-Math.PI/2+(d/arc)*(Math.PI/2);
      return [x+w-r+Math.cos(a)*r, y+r+Math.sin(a)*r];
    }
    d-=arc;
    if(d<=straightH) return [x+w, y+r+d];
    d-=straightH;
    if(d<=arc){
      const a=(d/arc)*(Math.PI/2);
      return [x+w-r+Math.cos(a)*r, y+h-r+Math.sin(a)*r];
    }
    d-=arc;
    if(d<=straightW) return [x+w-r-d, y+h];
    d-=straightW;
    if(d<=arc){
      const a=Math.PI/2+(d/arc)*(Math.PI/2);
      return [x+r+Math.cos(a)*r, y+h-r+Math.sin(a)*r];
    }
    d-=arc;
    if(d<=straightH) return [x, y+h-r-d];
    d-=straightH;
    const a=Math.PI+Math.min(d,arc)/arc*(Math.PI/2);
    return [x+r+Math.cos(a)*r, y+r+Math.sin(a)*r];
  }

  function layoutConnect(el){
    const svg=el.querySelector('.hl-connect');
    if(!svg) return;
    const w=Math.max(el.offsetWidth, 2);
    const h=Math.max(el.offsetHeight, 2);
    const sizeKey=w+'x'+h;
    if(el._hlSize===sizeKey && svg.querySelector('.hl-dot') && svg.querySelector('.hl-link')) return;
    el._hlSize=sizeKey;
    const radius=2.8;
    const padX=3.4, padTop=2.6, padBottom=10;
    const corner=Math.min(12, Math.max(7, h*0.36));
    const x=padX, y=padTop, rw=Math.max(w-padX*2, corner*2+1), rh=Math.max(h-padTop-padBottom, corner*2+1);
    svg.setAttribute('viewBox',`0 0 ${w} ${h}`);
    svg.setAttribute('preserveAspectRatio','none');
    const frame=roundedRectPath(x,y,rw,rh,corner);
    const peri=2*(rw-2*corner+rh-2*corner)+2*Math.PI*corner;
    const count=Math.max(16, Math.round(peri/16));
    const ns='http://www.w3.org/2000/svg';
    let defs=svg.querySelector('defs');
    if(!defs){
      defs=document.createElementNS(ns,'defs');
      svg.insertBefore(defs, svg.firstChild);
    }
    if(!el._hlGooId) el._hlGooId='hl-goo-'+Math.random().toString(36).slice(2,8);
    let filter=defs.querySelector('.hl-goo');
    if(!filter){
      filter=document.createElementNS(ns,'filter');
      filter.setAttribute('class','hl-goo');
      filter.setAttribute('id', el._hlGooId);
      filter.setAttribute('x','-80%');
      filter.setAttribute('y','-80%');
      filter.setAttribute('width','260%');
      filter.setAttribute('height','260%');
      filter.innerHTML='<feGaussianBlur in="SourceGraphic" stdDeviation="3.4" result="blur"/><feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -8" result="goo"/><feComposite in="SourceGraphic" in2="goo" operator="atop"/>';
      defs.append(filter);
    }
    let link=svg.querySelector('.hl-link');
    if(!link){
      link=document.createElementNS(ns,'path');
      link.setAttribute('class','hl-link');
      svg.append(link);
    }
    link.setAttribute('d', frame);
    link.setAttribute('pathLength','100');
    let group=svg.querySelector('.hl-dot-g');
    if(!group){
      group=document.createElementNS(ns,'g');
      group.setAttribute('class','hl-dot-g');
      svg.append(group);
    }
    group.setAttribute('filter','url(#'+el._hlGooId+')');
    group.replaceChildren();
    const step=1.05/Math.max(count-1,1);
    for(let i=0;i<count;i++){
      const pt=pointOnRoundedRect(x,y,rw,rh,corner,i/count);
      const nxt=pointOnRoundedRect(x,y,rw,rh,corner,(i+1)/count);
      const lx=nxt[0]-pt[0], ly=nxt[1]-pt[1];
      const len=Math.hypot(lx,ly)||1;
      const nx=-ly/len, ny=lx/len;
      const outward=i%2===0?1:-1;
      const bump=outward*2.2;
      const c=document.createElementNS(ns,'circle');
      c.setAttribute('class','hl-dot');
      c.setAttribute('cx',(pt[0]+nx*bump).toFixed(2));
      c.setAttribute('cy',(pt[1]+ny*bump).toFixed(2));
      c.setAttribute('r',(radius*(0.78+(i%3)*0.16)).toFixed(2));
      c.style.setProperty('--dx',(nx*outward*18).toFixed(1)+'px');
      c.style.setProperty('--dy',(ny*outward*14).toFixed(1)+'px');
      c.style.animationDelay=(0.28+i*step)+'s';
      group.append(c);
    }
    const oldPen=svg.querySelector('.hl-pen');
    if(oldPen) oldPen.remove();
    el._hlConnectMs=Math.ceil((0.28+step*(count-1)+1.15)*1000)+280;
  }

  document.querySelectorAll('h1 .hl').forEach(el=>{
    if(el.classList.contains('hl--cycle')) return;
    if(el.classList.contains('hl--liquid')){
      if(!el.querySelector('.hl-blobs')){
        const blobs=document.createElement('span');
        blobs.className='hl-blobs';
        blobs.setAttribute('aria-hidden','true');
        const cols=8;
        const rows=3;
        let n=0;
        for(let r=0;r<rows;r++){
          const count=r===1?cols:cols-1;
          const offset=r===1?0:0.5;
          for(let c=0;c<count;c++){
            const dot=document.createElement('i');
            const x=((c+offset+0.5)/cols)*100;
            const y=12+(r*38);
            const size=0.68+((c*3+r*5)%5)*0.07;
            dot.style.setProperty('--x',x+'%');
            dot.style.setProperty('--y',y+'%');
            dot.style.setProperty('--s',size+'em');
            dot.style.setProperty('--dx',(((c%3)-1)*0.14)+'em');
            dot.style.setProperty('--dy',(((r%3)-1)*0.12)+'em');
            dot.style.animationDelay=(n*0.018)+'s';
            blobs.append(dot);
            n+=1;
          }
        }
        el.prepend(blobs);
      }
      bindHl(el,'is-liquid',2700);
      return;
    }
    if(el.classList.contains('hl--connect')){
      if(!el.querySelector('.hl-connect')){
        const svg=document.createElementNS('http://www.w3.org/2000/svg','svg');
        svg.setAttribute('class','hl-connect');
        svg.setAttribute('aria-hidden','true');
        el.prepend(svg);
      }
      layoutConnect(el);
      if(typeof ResizeObserver==='function'){
        new ResizeObserver(()=>layoutConnect(el)).observe(el);
      }
      const start=()=>playHl(el,'is-connect', el._hlConnectMs||2400);
      window.setTimeout(start, 320);
      el.addEventListener('pointerenter', start);
      return;
    }
    if(el.classList.contains('hl--circle')){
      if(!el.querySelector('.hl-rings')){
        const svg=document.createElementNS('http://www.w3.org/2000/svg','svg');
        svg.setAttribute('class','hl-rings');
        svg.setAttribute('aria-hidden','true');
        el.prepend(svg);
      }
      layoutCircle(el);
      if(typeof ResizeObserver==='function'){
        new ResizeObserver(()=>layoutCircle(el)).observe(el);
      }
      bindLoop(el,'is-play');
      return;
    }
    const ms=el.classList.contains('hl--align')?1250:el.classList.contains('hl--expand')?1100:el.classList.contains('hl--fill')?950:1000;
    bindHl(el,'is-play',ms);
  });

  document.querySelectorAll('.dc-honey-map').forEach(flowMap=>{
    if(flowMap.querySelector('.dc-flow-motion')) return;
    const arrow=(path,duration,begin='0s')=>`<g class="dc-flow-arrow"><polygon points="-13,-8 13,0 -13,8"></polygon><animateMotion path="${path}" dur="${duration}s" begin="${begin}" rotate="auto" repeatCount="indefinite"></animateMotion><animate attributeName="opacity" values="0;1;1;0" keyTimes="0;.16;.84;1" dur="${duration}s" begin="${begin}" repeatCount="indefinite"></animate></g>`;
    flowMap.insertAdjacentHTML('beforeend',`<svg aria-hidden="true" class="dc-flow-motion" focusable="false" viewBox="0 0 1920 1080" preserveAspectRatio="none">
      ${arrow('M 283 385 L 283 725',4.8,'-1.1s')}
      ${arrow('M 283 725 L 283 385',5.2,'-3.6s')}
      ${arrow('M 286 544 L 548 544',3.9,'-2s')}
      ${arrow('M 897 191 L 897 475',4.1,'-.7s')}
      ${arrow('M 897 615 L 897 903',4.2,'-2.6s')}
      ${arrow('M 897 903 L 897 615',4.6,'-1.3s')}
      ${arrow('M 850 545 C 850 372 550 372 550 545 C 550 718 850 718 850 545',8.4,'-1.8s')}
      ${arrow('M 850 545 C 850 372 550 372 550 545 C 550 718 850 718 850 545',8.4,'-6s')}
      ${arrow('M 970 545 C 970 372 1248 372 1248 545 C 1248 718 970 718 970 545',8.1,'-1.2s')}
      ${arrow('M 970 545 C 970 372 1248 372 1248 545 C 1248 718 970 718 970 545',8.1,'-5.25s')}
    </svg>`);
  });

  document.querySelectorAll('[data-explorer]').forEach(explorer => {
    const hexes=[...explorer.querySelectorAll('[data-hex]')];
    const fundraisingHome=document.querySelector('.brand')?.href||window.location.href;
    const modulePages={
      'High Donor Value':'high-value-donors/',
      'High Value Donors':'high-value-donors/',
      'Area Donatori':'area-donatori/',
      'Telemarketing':'telemarketing/',
      'Mentor Automation':'mentor-automation/',
      'Questionari':'questionari/',
      'Landing Page Maker':'landing-page-maker/',
      'Lead & Donations':'leads-and-donations/',
      'Lead & Donation':'leads-and-donations/',
      'Leads and donations':'leads-and-donations/',
      'Lasciti testamentari':'lasciti-testamentari/',
      'Eventi Web':'eventi-web/',
      'Data Quality e Normalizzazione':'data-quality-e-normalizzazione/',
      'Riconciliazioni':'riconciliazioni/'
    };
    hexes.forEach(hex=>{
      const slug=modulePages[hex.dataset.title];
      if(slug) hex.href=new URL('../mentor-crm/moduli-di-mentor/'+slug,fundraisingHome).href;
    });
    const search=explorer.querySelector('input[type="search"]');
    const count=explorer.querySelector('.dc-count');
    const empty=explorer.querySelector('.dc-empty');
    const map=explorer.querySelector('.dc-honey-map');
    const groupNames={api:'API WEB SERVICE',integrazioni:'INTEGRAZIONI',pagamenti:'SISTEMI DI PAGAMENTO',moduli:'MODULI'};
    const itemHexes=hexes.filter(h=>h.dataset.kind==='item');
    const itemTotal=new Set(itemHexes.map(h=>h.dataset.title)).size;
    function syncMapSlices(){
      if(!map)return;
      const width=map.clientWidth,height=map.clientHeight;
      map.querySelectorAll('.dc-hex-map').forEach(hex=>{
        const x=parseFloat(hex.style.left)*width/100;
        const y=parseFloat(hex.style.top)*height/100;
        const hexWidth=hex.offsetWidth,hexHeight=hex.offsetHeight;
        hex.style.setProperty('--dc-map-width',`${width}px`);
        hex.style.setProperty('--dc-map-height',`${height}px`);
        hex.style.setProperty('--dc-map-x',`${-(x-hexWidth/2)}px`);
        hex.style.setProperty('--dc-map-y',`${-(y-hexHeight/2)}px`);
      });
    }
    if(map){
      const image=map.querySelector('.dc-honey-slide');
      const ready=()=>requestAnimationFrame(syncMapSlices);
      image?.complete?ready():image?.addEventListener('load',ready,{once:true});
      new ResizeObserver(syncMapSlices).observe(map);
    }
    function matchesQuery(h, query){
      if(!query) return true;
      const hay=`${h.dataset.title} ${h.dataset.desc} ${groupNames[h.dataset.group]||''}`.toLocaleLowerCase('it');
      return hay.includes(query);
    }
    function render(){
      const query=search.value.trim().toLocaleLowerCase('it');
      const matched=new Set();
      itemHexes.forEach(h=>{
        const match=matchesQuery(h, query);
        const onMap=h.classList.contains('dc-hex-map');
        if(onMap){
          h.hidden=false;
          h.classList.toggle('is-dim',!!query && !match);
          h.classList.toggle('is-match',!!query && match);
        }else{
          h.hidden=!match;
          h.classList.toggle('is-dim',false);
          h.classList.toggle('is-match',!!query && match);
        }
        if(match) matched.add(h.dataset.title);
      });
      const visible=matched.size;
      hexes.filter(h=>h.dataset.kind==='hub').forEach(h=>{
        const any=itemHexes.some(i=>i.dataset.group===h.dataset.group && matchesQuery(i, query));
        if(h.classList.contains('dc-hex-map')){
          h.hidden=false;
          h.classList.toggle('is-dim',!!query && !any);
        }else{
          h.hidden=query?!any:false;
        }
      });
      explorer.querySelectorAll('.dc-hex-cluster').forEach(cluster=>{
        const any=[...cluster.querySelectorAll('[data-hex][data-kind="item"]')].some(h=>!h.hidden);
        cluster.hidden=query?!any:false;
      });
      count.textContent=query?`${visible} ${visible===1?'risultato':'risultati'} per “${search.value.trim()}”`:`${itemTotal} soluzioni nell’ecosistema`;
      empty.hidden=visible>0;
      map?.classList.toggle('is-filtering',!!query);
    }
    hexes.forEach(hex=>hex.addEventListener('click',event=>{
      if(hex.hidden){event.preventDefault();return;}
      emit('solution_open',{solution:hex.dataset.title,category:hex.dataset.group});
      if(hex.dataset.kind==='hub')emit('category_select',{category:hex.dataset.group});
      if(event.button!==0||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;
      const href=hex.getAttribute('href');
      if(!href)return;
      event.preventDefault();
      hex.classList.add('is-activating');
      window.setTimeout(()=>window.location.assign(href),reduced.matches?0:150);
    }));
    search.addEventListener('input',render);
    render();
  });

  document.querySelectorAll('[data-carousel]').forEach(carousel=>{
    const list=carousel.querySelector('.dc-client-list');
    if(!list||!list.children.length)return;
    const originals=[...list.children];
    originals.forEach(item=>{
      const clone=item.cloneNode(true);
      clone.setAttribute('aria-hidden','true');
      clone.querySelectorAll('[id]').forEach(element=>element.removeAttribute('id'));
      clone.querySelectorAll('img').forEach(image=>image.alt='');
      list.append(clone);
    });
    carousel.dataset.autoplay='true';
    let timer,resumeTimer,interacting=false,visible=true,lastTick=performance.now();
    const loopWidth=()=>list.children[originals.length]?.offsetLeft-list.firstElementChild.offsetLeft||list.scrollWidth/2;
    const itemStep=()=>{
      const styles=getComputedStyle(list);
      return list.firstElementChild.getBoundingClientRect().width+(parseFloat(styles.columnGap||styles.gap)||0);
    };
    function normalize(){
      const width=loopWidth();
      if(width&&list.scrollLeft>=width)list.scrollLeft-=width;
    }
    function advance(){
      const now=performance.now();
      const elapsed=Math.min(now-lastTick,1000);
      lastTick=now;
      if(!interacting&&!document.hidden&&visible&&!reduced.matches){
        list.scrollLeft+=elapsed*.022;
        normalize();
      }
    }
    function start(delay=0){
      clearInterval(timer);clearTimeout(resumeTimer);lastTick=performance.now();
      resumeTimer=setTimeout(()=>{lastTick=performance.now();timer=setInterval(advance,40);},delay);
    }
    function pauseForInteraction(){interacting=true;clearTimeout(resumeTimer);}
    function resumeAfterInteraction(){clearTimeout(resumeTimer);resumeTimer=setTimeout(()=>{interacting=false;lastTick=performance.now();},1400);}
    list.addEventListener('pointerdown',pauseForInteraction,{passive:true});
    list.addEventListener('pointerup',resumeAfterInteraction,{passive:true});
    list.addEventListener('pointercancel',resumeAfterInteraction,{passive:true});
    list.addEventListener('scroll',normalize,{passive:true});
    list.addEventListener('keydown',event=>{
      if(!['ArrowLeft','ArrowRight'].includes(event.key))return;
      event.preventDefault();pauseForInteraction();
      list.scrollBy({left:itemStep()*(event.key==='ArrowLeft'?-1:1),behavior:reduced.matches?'instant':'smooth'});
      resumeAfterInteraction();
      emit('clients_navigate',{direction:event.key==='ArrowLeft'?'previous':'next'});
    });
    document.addEventListener('visibilitychange',()=>{lastTick=performance.now();});
    reduced.addEventListener('change',()=>{lastTick=performance.now();});
    new IntersectionObserver(entries=>{visible=entries[0]?.isIntersecting??true;lastTick=performance.now();},{rootMargin:'160px'}).observe(carousel);
    new ResizeObserver(normalize).observe(list);
    start(350);
  });

  const form=document.querySelector('.dc-form');
  if(form){
    form.querySelector('button[type="submit"]').disabled=false;
    const interest=form.elements.interesse, status=form.querySelector('.dc-form-status'), dialog=document.querySelector('.dc-dialog');
    document.querySelectorAll('[data-demo]').forEach(link=>link.addEventListener('click',()=>{
      if(interest && link.dataset.demo) interest.value=link.dataset.demo;
      const topic=(interest && interest.value) || link.dataset.demo || '';
      status.textContent=topic?`La tua consulenza: ${topic}.`:'';
      const heading=document.querySelector('#dc-contact-title');heading.focus({preventScroll:true});
      emit('demo_click',{solution:link.dataset.demo||'generale'});
    }));
    form.addEventListener('invalid',()=>{status.textContent='Controlla i campi obbligatori e inserisci un indirizzo email valido.';},true);
    form.addEventListener('submit',e=>{
      e.preventDefault();
      if(!form.reportValidity())return;
      const summary=dialog.querySelector('dl');summary.replaceChildren();
      [['Nome',form.elements.nome?.value],['Email',form.elements.email?.value],['Organizzazione',form.elements.organizzazione?.value],['Interesse',interest?.value],['Messaggio',form.elements.messaggio?.value]].forEach(([label,value])=>{if(!value)return;const dt=document.createElement('dt'),dd=document.createElement('dd');dt.textContent=label;dd.textContent=value;summary.append(dt,dd);});
      dialog.showModal();status.textContent='Anteprima pronta. Nessuna richiesta è stata inviata.';emit('demo_preview');
    });
    dialog.querySelector('[data-close]').addEventListener('click',()=>dialog.close());
    dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}});
  }

  const footer=document.querySelector('.site-footer');
  const contentRoots=[document.querySelector('main'),footer].filter(Boolean);
  if(footer&&contentRoots.length){
    const excluded='a,button,label,input,textarea,select,option,summary,script,style,noscript,svg,[aria-hidden="true"],[data-hex],.dc-sr,.dc-tools,.dc-carousel-foot,.dc-form,.dc-dialog,h1,.hl';
    const textNodes=[];
    contentRoots.forEach(root=>{
      const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT,{acceptNode(node){
        if(!node.textContent.trim())return NodeFilter.FILTER_REJECT;
        const parent=node.parentElement;
        if(!parent||parent.closest(excluded))return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      }});
      while(walker.nextNode())textNodes.push(walker.currentNode);
    });
    const editables=[];
    const parents=new Set();
    textNodes.forEach(node=>{
      const parent=node.parentElement;
      const onlyText=[...parent.childNodes].every(child=>child.nodeType===Node.TEXT_NODE);
      if(onlyText){
        if(!parents.has(parent)){parents.add(parent);editables.push(parent);}
        return;
      }
      const span=document.createElement('span');
      span.textContent=node.textContent;
      node.replaceWith(span);
      editables.push(span);
    });

    const pageKey=`dc-page-copy:${window.location.pathname.replace(/\/$/,'')||'/'}`;
    let stored={};
    try{stored=JSON.parse(window.localStorage.getItem(pageKey)||'{}');}catch(error){stored={};}
    editables.forEach((element,index)=>{
      const id=`text-${index}`;
      element.dataset.editId=id;
      element.classList.add('dc-editable-text');
      element.setAttribute('contenteditable','plaintext-only');
      element.setAttribute('spellcheck','true');
      element.setAttribute('title','Clicca per modificare questo testo');
      if(Object.prototype.hasOwnProperty.call(stored,id))element.textContent=stored[id];
      element.dataset.savedText=element.textContent;
      element.addEventListener('keydown',event=>{
        const singleLine=/^(H[1-6]|STRONG|SPAN)$/.test(element.tagName);
        if(event.key==='Enter'&&singleLine){event.preventDefault();element.blur();}
        if(event.key==='Escape'){event.preventDefault();element.textContent=element.dataset.savedText;element.blur();updateDirty();}
      });
    });

    const bar=document.createElement('div');
    bar.className='dc-save-bar';
    bar.innerHTML='<div class="dc-save-bar-copy"><strong>Testi modificabili</strong><span data-save-status>Clicca su un testo per modificarlo. Le modifiche restano in questo browser.</span></div><button class="dc-save-page" type="button" disabled>Salva questa pagina</button>';
    footer.append(bar);
    const saveButton=bar.querySelector('.dc-save-page');
    const saveStatus=bar.querySelector('[data-save-status]');
    function updateDirty(){
      const dirty=editables.some(element=>element.textContent!==element.dataset.savedText);
      bar.classList.toggle('is-dirty',dirty);
      saveButton.disabled=!dirty;
      if(dirty){saveButton.textContent='Salva questa pagina';saveStatus.textContent='Hai modifiche non salvate.';}
      return dirty;
    }
    editables.forEach(element=>element.addEventListener('input',updateDirty));
    saveButton.addEventListener('click',()=>{
      const values=Object.fromEntries(editables.map(element=>[element.dataset.editId,element.textContent]));
      try{
        window.localStorage.setItem(pageKey,JSON.stringify(values));
        editables.forEach(element=>{element.dataset.savedText=element.textContent;});
        updateDirty();
        saveButton.textContent='Pagina salvata ✓';
        saveStatus.textContent='Modifiche salvate in questo browser.';
        emit('page_saved',{fields:editables.length});
      }catch(error){
        saveStatus.textContent='Non è stato possibile salvare in questo browser.';
      }
    });
    document.documentElement.classList.add('dc-editing-enabled');
  }

  const cloudLilac = '<path d="M100 36c22-18 62-2 58 30 28 8 22 54-8 60-6 28-50 36-66 8-28 10-58-22-40-46-16-24 12-58 56-52z"/>';
  const cloudGold = '<path d="M28 124c-18 0-28-20-14-36 4-24 38-30 52-12 8-26 48-38 70-12 22-20 60-8 58 20 24 2 34 24 18 40-4 20-38 28-56 10-16 18-60 22-128-10z"/>';
  const cloudSoft = '<path d="M44 116c-18 4-32-14-20-30 6-22 38-28 50-10 10-24 48-30 64-6 18-16 52-6 54 18 20 4 28 28 8 38-6 18-42 22-58 6-14 14-54 16-98-16z"/>';
  const disc = (tone, motion) => `<span class="hero-blob is-disc ${tone}" ${motion}></span>`;
  const cloud = (tone, motion, path) => `<svg class="hero-blob is-cloud ${tone}" ${motion} viewBox="0 0 200 200">${path}</svg>`;
  const cluster = (tone, motion) => `<span class="hero-blob hero-blob-cluster ${tone}" ${motion}><span class="hero-blob-cell is-core"></span><span class="hero-blob-cell is-a"></span><span class="hero-blob-cell is-b"></span><span class="hero-blob-cell is-c"></span><span class="hero-blob-cell is-d"></span><span class="hero-blob-cell is-e"></span><span class="hero-blob-cell is-bead is-bead-1"></span><span class="hero-blob-cell is-bead is-bead-2"></span><span class="hero-blob-cell is-bead is-bead-3"></span><span class="hero-blob-cell is-bead is-bead-4"></span><span class="hero-blob-cell is-bead is-bead-5"></span><span class="hero-blob-cell is-bead is-bead-6"></span><span class="hero-blob-cell is-bead is-bead-7"></span><span class="hero-blob-cell is-bead is-bead-8"></span><span class="hero-blob-cell is-bead is-bead-9"></span><span class="hero-blob-cell is-bead is-bead-10"></span></span>`;
  const blobGoo = '<svg class="hero-blob-goo-defs" aria-hidden="true" focusable="false"><defs><filter id="hero-blob-goo" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur in="SourceGraphic" stdDeviation="11" result="blur"/><feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -9" result="goo"/></filter></defs></svg>';

  const blobThemes = {
    fundraising: [
      disc('is-mint', 'data-x="160" data-y="18" data-spin="16" data-morph="1"'),
      cloud('is-lilac', 'data-x="-12" data-y="-8" data-grow="0.9" data-spin="-10" data-tilt="-8"', cloudLilac),
      cloud('is-gold', 'data-x="-18" data-to="bottom" data-spin="12" data-tilt="8" data-grow="6.2" data-scroll="slow"', cloudGold)
    ],
    mentor: [
      disc('is-peach', 'data-x="140" data-y="28" data-spin="-14" data-morph="1"'),
      cloud('is-mint', 'data-x="24" data-y="-20" data-grow="0.7" data-spin="12"', cloudSoft),
      cloud('is-sky', 'data-x="-50" data-y="70" data-spin="-22" data-tilt="6"', cloudGold)
    ],
    sense: [
      disc('is-sky', 'data-x="150" data-y="12" data-spin="12" data-morph="1"'),
      cloud('is-aqua', 'data-x="18" data-y="-16" data-grow="0.8" data-spin="-8"', cloudLilac),
      cloud('is-gold', 'data-x="-44" data-y="64" data-spin="20" data-tilt="8"', cloudGold)
    ],
    analisi: [
      disc('is-peach', 'data-x="130" data-y="22" data-spin="20" data-morph="1"'),
      cloud('is-gold', 'data-x="30" data-y="-12" data-grow="0.75" data-spin="-14"', cloudGold),
      cloud('is-lilac', 'data-x="-28" data-y="80" data-spin="18" data-tilt="-6"', cloudLilac)
    ],
    integrazioni: [
      cluster('is-sky', 'data-x="70" data-y="18" data-spin="-8" data-morph="1"'),
      cloud('is-gold', 'data-x="-40" data-y="54" data-grow="0.55" data-spin="16"', cloudGold)
    ],
    moduli: [
      disc('is-lilac', 'data-x="120" data-y="20" data-spin="14" data-morph="1"'),
      disc('is-mint', 'data-x="70" data-y="-24" data-spin="-18" data-grow="0.35"'),
      cloud('is-peach', 'data-x="-48" data-y="72" data-grow="0.65" data-spin="22"', cloudSoft)
    ],
    hvd: [
      disc('is-foam', 'data-x="130" data-y="24" data-spin="12" data-morph="1"'),
      cloud('is-gold', 'data-x="-30" data-y="40" data-grow="0.7" data-spin="-16"', cloudGold),
      cloud('is-blush', 'data-x="36" data-y="-18" data-spin="20"', cloudLilac)
    ],
    donors: [
      disc('is-foam', 'data-x="140" data-y="16" data-spin="-12" data-morph="1"'),
      cloud('is-mint', 'data-x="-24" data-y="48" data-grow="0.8" data-spin="14"', cloudSoft),
      cloud('is-peach', 'data-x="28" data-y="-20" data-spin="-18"', cloudLilac)
    ],
    survey: [
      disc('is-foam', 'data-x="120" data-y="20" data-spin="16" data-morph="1"'),
      cloud('is-gold', 'data-x="-36" data-y="56" data-grow="0.65" data-spin="-12"', cloudGold),
      cloud('is-lilac', 'data-x="22" data-y="-16" data-spin="18"', cloudLilac)
    ],
    tele: [
      disc('is-foam', 'data-x="135" data-y="18" data-spin="-14" data-morph="1"'),
      cloud('is-mint', 'data-x="-28" data-y="44" data-grow="0.75" data-spin="16"', cloudSoft),
      cloud('is-sky', 'data-x="34" data-y="-22" data-spin="-20"', cloudGold)
    ],
    landing: [
      disc('is-foam', 'data-x="125" data-y="22" data-spin="12" data-morph="1"'),
      cloud('is-lilac', 'data-x="-32" data-y="50" data-grow="0.7" data-spin="-14"', cloudLilac),
      cloud('is-gold', 'data-x="26" data-y="-18" data-spin="22"', cloudGold)
    ],
    leads: [
      disc('is-foam', 'data-x="145" data-y="14" data-spin="-10" data-morph="1"'),
      cloud('is-gold', 'data-x="-26" data-y="46" data-grow="0.72" data-spin="18"', cloudGold),
      cloud('is-aqua', 'data-x="30" data-y="-14" data-spin="-16"', cloudSoft)
    ],
    auto: [
      disc('is-foam', 'data-x="128" data-y="20" data-spin="14" data-morph="1"'),
      cloud('is-peach', 'data-x="-34" data-y="52" data-grow="0.68" data-spin="-18"', cloudGold),
      cloud('is-mint', 'data-x="24" data-y="-20" data-spin="16"', cloudLilac)
    ],
    legacy: [
      disc('is-peach', 'data-x="132" data-y="18" data-spin="16" data-morph="1"'),
      cloud('is-blush', 'data-x="-30" data-y="48" data-grow="0.7" data-spin="-14"', cloudLilac),
      cloud('is-gold', 'data-x="28" data-y="-18" data-spin="18"', cloudGold)
    ],
    web: [
      disc('is-gold', 'data-x="126" data-y="22" data-spin="-12" data-morph="1"'),
      cloud('is-peach', 'data-x="-32" data-y="50" data-grow="0.66" data-spin="16"', cloudGold),
      cloud('is-lilac', 'data-x="24" data-y="-16" data-spin="-18"', cloudLilac)
    ],
    quality: [
      disc('is-lilac', 'data-x="138" data-y="16" data-spin="14" data-morph="1"'),
      cloud('is-mint', 'data-x="-28" data-y="46" data-grow="0.72" data-spin="-16"', cloudSoft),
      cloud('is-gold', 'data-x="30" data-y="-20" data-spin="20"', cloudGold)
    ],
    recon: [
      disc('is-peach', 'data-x="124" data-y="20" data-spin="-14" data-morph="1"'),
      cloud('is-gold', 'data-x="-34" data-y="52" data-grow="0.68" data-spin="18"', cloudGold),
      cloud('is-aqua', 'data-x="26" data-y="-18" data-spin="-16"', cloudSoft)
    ]
  };

  function blobTheme() {
    const path = (location.pathname || '').replace(/\\/g, '/').toLowerCase();
    if (path.includes('high-value-donors')) return 'hvd';
    if (path.includes('area-donatori')) return 'donors';
    if (path.includes('questionari')) return 'survey';
    if (path.includes('telemarketing')) return 'tele';
    if (path.includes('landing-page-maker')) return 'landing';
    if (path.includes('leads-and-donations')) return 'leads';
    if (path.includes('mentor-automation')) return 'auto';
    if (path.includes('lasciti')) return 'legacy';
    if (path.includes('eventi-web')) return 'web';
    if (path.includes('data-quality')) return 'quality';
    if (path.includes('riconciliazioni')) return 'recon';
    if (path.includes('moduli-di-mentor')) return 'moduli';
    if (path.includes('mentor-integrazioni')) return 'integrazioni';
    if (path.includes('direct-sense')) return 'sense';
    if (path.includes('analisi-predittive')) return 'analisi';
    if (path.includes('mentor-crm')) return 'mentor';
    return 'fundraising';
  }

  function liquidRadius(amount, invert) {
    const direction = invert ? -1 : 1;
    const wave = Math.sin(amount * Math.PI);
    const ripple = Math.sin(amount * Math.PI * 2) * 0.38;
    return [
      50 + ((32 * wave + 10 * ripple) * direction),
      50 - ((24 * wave + 8 * ripple) * direction),
      50 + ((28 * wave - 9 * ripple) * direction),
      50 - ((30 * wave - 7 * ripple) * direction)
    ].map(n => n.toFixed(1) + '%').join(' ') + ' / ' + [
      50 - ((22 * wave - 8 * ripple) * direction),
      50 + ((30 * wave + 9 * ripple) * direction),
      50 - ((26 * wave + 7 * ripple) * direction),
      50 + ((24 * wave - 10 * ripple) * direction)
    ].map(n => n.toFixed(1) + '%').join(' ');
  }

  function washBlobRadius(amount) {
    const t = Math.min(1, Math.max(0, amount));
    const wave = Math.sin(t * Math.PI);
    const ripple = Math.sin(t * Math.PI * 2.7);
    const wobble = Math.cos(t * Math.PI * 1.85);
    const clamp = n => Math.max(12, Math.min(88, n)).toFixed(1) + '%';
    return [
      84 + wave * 4 + ripple * 10,
      16 - wave * 6 + wobble * 12,
      72 + wobble * 14 - ripple * 8,
      28 - wave * 10 + ripple * 12
    ].map(clamp).join(' ') + ' / ' + [
      32 - wobble * 12 + wave * 10,
      80 + wave * 6 + ripple * 10,
      18 + ripple * 14 - wobble * 8,
      70 - wave * 10 + wobble * 12
    ].map(clamp).join(' ');
  }

  document.querySelectorAll('.hero, .hvd-hero').forEach(hero => {
    if (hero.querySelector('.hero-blobs')) return;
    const theme = blobTheme();
    const parts = blobThemes[theme] || blobThemes.fundraising;
    hero.insertAdjacentHTML('afterbegin', `<div class="hero-blobs" data-theme="${theme}" aria-hidden="true">${theme === 'integrazioni' ? blobGoo : ''}${parts.join('')}</div>`);
    const blobs = [...hero.querySelectorAll('.hero-blob')];
    if (!blobs.length) return;
    const heroBox = hero.getBoundingClientRect();
    blobs.forEach(blob => {
      if (blob.dataset.to !== 'bottom') return;
      const box = blob.getBoundingClientRect();
      const top = box.top - heroBox.top;
      blob.dataset.y = String(Math.max(160, Math.round(hero.clientHeight - top - box.height * 0.12 + 110)));
    });

    function paint(progress) {
      const band = hero.closest('.opening-band');
      let wash = progress;
      let slow = progress;
      if (band) {
        const story = hero.closest('main')?.querySelector('.partner-story');
        const storyEnd = story
          ? story.getBoundingClientRect().top + window.scrollY + story.offsetHeight * 0.9
          : 0;
        const washTravel = Math.max(band.offsetHeight * 2.4, window.innerHeight * 1.6, storyEnd);
        const slowTravel = Math.max(band.offsetHeight * 2.6, window.innerHeight * 2.2);
        wash = Math.min(1, Math.max(0, window.scrollY / washTravel));
        slow = Math.min(1, Math.max(0, window.scrollY / slowTravel));
        band.style.setProperty('--hero-wash-scale-x', (1 + wash * 0.62).toFixed(3));
        band.style.setProperty('--hero-wash-scale-y', (1 + wash * 0.18).toFixed(3));
        band.style.setProperty('--hero-wash-shift', (wash * 120).toFixed(1) + 'px');
        band.style.setProperty('--hero-wash-drop', (wash * 160).toFixed(1) + 'px');
        band.style.setProperty('--hero-wash-tilt', (-14 + wash * 10).toFixed(2) + 'deg');
        band.style.setProperty('--hero-wash-radius', washBlobRadius(wash));
      }
      blobs.forEach(blob => {
        const amount = blob.dataset.scroll === 'wash' ? wash : blob.dataset.scroll === 'slow' ? slow : progress;
        const x = Number(blob.dataset.x || 0) * amount;
        const y = Number(blob.dataset.y || 0) * amount;
        const spin = Number(blob.dataset.spin || 0);
        const tilt = Number(blob.dataset.tilt || 0);
        const grow = Number(blob.dataset.grow || 0);
        const scale = 1 + grow * amount;
        if (blob.dataset.morph === '1') {
          blob.style.setProperty('--blob-radius', liquidRadius(Math.sin(amount * Math.PI * 0.5), false));
        }
        blob.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0) rotate(${(tilt + spin * amount).toFixed(2)}deg) scale(${scale.toFixed(3)})`;
      });
    }

    if (reduced.matches) {
      paint(0);
      return;
    }

    let pending = false;
    function update() {
      const rect = hero.getBoundingClientRect();
      const travel = Math.max(hero.offsetHeight * 0.85, 1);
      const progress = Math.min(1, Math.max(0, -rect.top / travel));
      paint(progress);
      pending = false;
    }
    function requestUpdate() {
      if (pending) return;
      pending = true;
      window.requestAnimationFrame(update);
    }

    window.addEventListener('scroll', requestUpdate, {passive: true});
    window.addEventListener('resize', requestUpdate);
    reduced.addEventListener('change', () => {
      if (reduced.matches) paint(0);
      else requestUpdate();
    });
    update();
  });

  document.querySelectorAll('.hero-sky-scene').forEach(scene => {
    const balloons = [...scene.querySelectorAll('.hero-balloon-shot')];
    const layer = scene.querySelector('.hero-balloons');
    if (!balloons.length || !layer) return;

    function fitLayer() {
      const cw = scene.clientWidth || 1;
      const ch = scene.clientHeight || 1;
      const iw = 1152;
      const ih = 864;
      const scale = Math.max(cw / iw, ch / ih);
      const w = iw * scale;
      const h = ih * scale;
      layer.style.left = `${((cw - w) / 2).toFixed(2)}px`;
      layer.style.top = `${((ch - h) / 2).toFixed(2)}px`;
      layer.style.width = `${w.toFixed(2)}px`;
      layer.style.height = `${h.toFixed(2)}px`;
      layer.style.right = 'auto';
      layer.style.bottom = 'auto';
    }

    function lift(progress) {
      const sceneH = scene.clientHeight || 1;
      balloons.forEach(balloon => {
        const rise = sceneH * (Number(balloon.dataset.lift || 70) / 100) * progress;
        const drift = Number(balloon.dataset.drift || 0) * progress;
        balloon.style.transform = `translate3d(${drift.toFixed(1)}px, ${(-rise).toFixed(1)}px, 0)`;
      });
    }

    if (reduced.matches) {
      fitLayer();
      lift(0);
    }

    let pending = false;
    function update() {
      fitLayer();
      const travel = Math.max(window.innerHeight * 0.8, 420);
      const progress = reduced.matches ? 0 : Math.min(1, Math.max(0, window.scrollY / travel));
      lift(progress);
      pending = false;
    }
    function requestUpdate() {
      if (pending) return;
      pending = true;
      window.requestAnimationFrame(update);
    }

    window.addEventListener('scroll', requestUpdate, {passive: true});
    window.addEventListener('resize', requestUpdate);
    reduced.addEventListener('change', () => {
      if (reduced.matches) lift(0);
      else requestUpdate();
    });
    update();
  });
})();
