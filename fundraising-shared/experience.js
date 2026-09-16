(() => {
  'use strict';
  document.documentElement.classList.add('dc-ready');
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const emit = (name, detail = {}) => document.dispatchEvent(new CustomEvent('dc:interaction', {detail: {name, proposal: document.body.dataset.proposal, ...detail}}));
  // Local UI events only. No analytics provider, storage or personal data transmission.
  const NAV_ITEMS = [
    {id:'fundraising', label:'Fundraising', path:'fundraising-soluzioni-per-il-terzo-settore/'},
    {id:'mentor', label:'Mentor CRM', path:'mentor-crm/'},
    {id:'moduli', label:'Moduli', path:'mentor-crm/moduli-di-mentor/'},
    {id:'integrazioni', label:'Integrazioni', path:'mentor-integrazioni/'},
    {id:'directsense', label:'DirectSense', path:'direct-sense-business-intelligence/'},
    {id:'analisi', label:'Analisi Predittive', path:'fundraising-analisi-predittive/'}
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
  function currentNavId(){
    let path=(location.pathname||'').replace(/\\/g,'/');
    const idx=path.indexOf('/sito/');
    if(idx!==-1) path=path.slice(idx+6);
    path=path.replace(/index\.html$/,'').replace(/\/?$/,'/');
    let match=NAV_ITEMS[0];
    NAV_ITEMS.forEach(item=>{
      if(path===item.path || path.startsWith(item.path)) match=item;
    });
    return match.id;
  }
  function renderSiteNav(navEl){
    if(!navEl) return;
    const root=sitoRoot();
    const current=currentNavId();
    const frag=document.createDocumentFragment();
    NAV_ITEMS.forEach(item=>{
      const a=document.createElement('a');
      a.href=root+item.path;
      a.textContent=item.label;
      if(item.id===current) a.setAttribute('aria-current','page');
      frag.append(a);
    });
    const demo=document.createElement('a');
    demo.href='#contatti';
    demo.textContent='Richiedi una demo';
    frag.append(demo);
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
  document.addEventListener('click',e => {if(!e.target.closest('.site-header')) closeNav(); else if(e.target.closest('.nav a')) closeNav();});
  document.addEventListener('focusin', e => {if(!e.target.closest('.nav-dropdown')) closeDropdowns(); if(nav?.classList.contains('is-open') && !e.target.closest('.site-header')) closeNav();});
  window.matchMedia('(max-width: 1120px)').addEventListener('change',()=>closeNav());

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
    const start=()=>{
      if(reducedMotion.matches) return;
      el.classList.remove(cls);
      void el.offsetWidth;
      el.classList.add(cls);
    };
    start();
    window.setTimeout(start, 50);
    el.addEventListener('pointerenter', start);
  }

  function layoutCircle(el){
    const svg=el.querySelector('.hl-rings');
    if(!svg) return;
    const w=Math.max(el.offsetWidth, 8);
    const h=Math.max(el.offsetHeight, 8);
    const sizeKey=w+'x'+h;
    if(el._hlRingSize===sizeKey && svg.querySelector('.hl-ring')) return;
    el._hlRingSize=sizeKey;
    svg.setAttribute('viewBox',`0 0 ${w} ${h}`);
    svg.setAttribute('preserveAspectRatio','none');
    const cx=(w/2).toFixed(2);
    const cy=(h/2+0.6).toFixed(2);
    const ns='http://www.w3.org/2000/svg';
    let a=svg.querySelector('.hl-ring-a');
    let b=svg.querySelector('.hl-ring-b');
    if(!a){
      a=document.createElementNS(ns,'ellipse');
      a.setAttribute('class','hl-ring hl-ring-a');
      svg.append(a);
    }
    if(!b){
      b=document.createElementNS(ns,'ellipse');
      b.setAttribute('class','hl-ring hl-ring-b');
      svg.append(b);
    }
    a.setAttribute('cx',cx);
    a.setAttribute('cy',cy);
    a.setAttribute('rx',Math.max(w/2-4, 12).toFixed(2));
    a.setAttribute('ry',Math.max(h/2-3.2, 10).toFixed(2));
    a.setAttribute('pathLength','100');
    a.setAttribute('transform',`rotate(-6 ${cx} ${cy})`);
    b.setAttribute('cx',cx);
    b.setAttribute('cy',(h/2-0.8).toFixed(2));
    b.setAttribute('rx',Math.max(w/2-1.2, 14).toFixed(2));
    b.setAttribute('ry',Math.max(h/2-1.4, 11).toFixed(2));
    b.setAttribute('pathLength','100');
    b.setAttribute('transform',`rotate(5 ${cx} ${(h/2-0.8).toFixed(2)})`);
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
    const font=parseFloat(getComputedStyle(el).fontSize)||16;
    const w=Math.max(Math.round(el.offsetWidth + 0.88*font), 2);
    const h=Math.max(Math.round(el.offsetHeight + 0.64*font), 2);
    const sizeKey=w+'x'+h;
    if(el._hlSize===sizeKey && svg.querySelector('.hl-dot') && svg.querySelector('.hl-link')) return;
    el._hlSize=sizeKey;
    const radius=2.35;
    const pad=radius+3;
    const corner=Math.min(14, Math.max(8, h*0.28));
    const x=pad, y=pad, rw=Math.max(w-pad*2, corner*2+1), rh=Math.max(h-pad*2, corner*2+1);
    svg.setAttribute('viewBox',`0 0 ${w} ${h}`);
    svg.setAttribute('preserveAspectRatio','none');
    const frame=roundedRectPath(x,y,rw,rh,corner);
    const peri=2*(rw-2*corner+rh-2*corner)+2*Math.PI*corner;
    const count=Math.max(22, Math.round(peri/11));
    const ns='http://www.w3.org/2000/svg';
    let link=svg.querySelector('.hl-link');
    if(!link){
      link=document.createElementNS(ns,'path');
      link.setAttribute('class','hl-link');
      svg.insertBefore(link, svg.firstChild);
    }
    link.setAttribute('d', frame);
    link.setAttribute('pathLength','100');
    let group=svg.querySelector('.hl-dot-g');
    if(!group){
      group=document.createElementNS(ns,'g');
      group.setAttribute('class','hl-dot-g');
      svg.append(group);
    }
    group.replaceChildren();
    const step=1.45/Math.max(count-1,1);
    for(let i=0;i<count;i++){
      const pt=pointOnRoundedRect(x,y,rw,rh,corner,i/count);
      const c=document.createElementNS(ns,'circle');
      c.setAttribute('class','hl-dot');
      c.setAttribute('cx',pt[0].toFixed(2));
      c.setAttribute('cy',pt[1].toFixed(2));
      c.setAttribute('r', String(radius));
      c.style.animationDelay=(i*step)+'s';
      group.append(c);
    }
    const oldPen=svg.querySelector('.hl-pen');
    if(oldPen) oldPen.remove();
    el._hlConnectMs=Math.ceil((step*(count-1)+0.9+1.55)*1000);
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
      bindHl(el,'is-connect', el._hlConnectMs||2600);
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
      if(link.dataset.demo) interest.value=link.dataset.demo;
      status.textContent=interest.value?`La tua demo: ${interest.value}.`:'';
      const heading=document.querySelector('#dc-contact-title');heading.focus({preventScroll:true});
      emit('demo_click',{solution:link.dataset.demo||'generale'});
    }));
    form.addEventListener('invalid',()=>{status.textContent='Controlla i campi obbligatori e inserisci un indirizzo email valido.';},true);
    form.addEventListener('submit',e=>{
      e.preventDefault();
      if(!form.reportValidity())return;
      const summary=dialog.querySelector('dl');summary.replaceChildren();
      [['Nome',form.elements.nome.value],['Email',form.elements.email.value],['Organizzazione',form.elements.organizzazione.value],['Interesse',interest.value||'Demo personalizzata'],['Messaggio',form.elements.messaggio.value]].forEach(([label,value])=>{if(!value)return;const dt=document.createElement('dt'),dd=document.createElement('dd');dt.textContent=label;dd.textContent=value;summary.append(dt,dd);});
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

  const blobThemes = {
    fundraising: [
      disc('is-mint', 'data-x="160" data-y="18" data-spin="16" data-morph="1"'),
      cloud('is-lilac', 'data-x="-12" data-y="-8" data-grow="0.9" data-spin="-10" data-tilt="-8"', cloudLilac),
      cloud('is-gold', 'data-x="-36" data-y="90" data-spin="24" data-tilt="10" data-grow="0.12"', cloudGold)
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
      disc('is-mint', 'data-x="90" data-y="16" data-spin="-10" data-morph="1"'),
      disc('is-sky', 'data-x="110" data-y="40" data-spin="18" data-grow="-0.08" data-morph="1"'),
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

  document.querySelectorAll('.hero, .hvd-hero').forEach(hero => {
    if (hero.querySelector('.hero-blobs')) return;
    const theme = blobTheme();
    const parts = blobThemes[theme] || blobThemes.fundraising;
    hero.insertAdjacentHTML('afterbegin', `<div class="hero-blobs" data-theme="${theme}" aria-hidden="true">${parts.join('')}</div>`);
    const blobs = [...hero.querySelectorAll('.hero-blob')];
    if (!blobs.length) return;

    function paint(progress) {
      const morph = Math.sin(progress * Math.PI * 0.5);
      blobs.forEach(blob => {
        const x = Number(blob.dataset.x || 0) * progress;
        const y = Number(blob.dataset.y || 0) * progress;
        const spin = Number(blob.dataset.spin || 0);
        const tilt = Number(blob.dataset.tilt || 0);
        const grow = Number(blob.dataset.grow || 0);
        const scale = 1 + grow * progress;
        if (blob.dataset.morph === '1') {
          blob.style.setProperty('--blob-radius', liquidRadius(morph, false));
        }
        blob.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0) rotate(${(tilt + spin * progress).toFixed(2)}deg) scale(${scale.toFixed(3)})`;
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
})();
