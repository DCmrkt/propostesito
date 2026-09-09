(() => {
  'use strict';
  document.documentElement.classList.add('dc-ready');
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const emit = (name, detail = {}) => document.dispatchEvent(new CustomEvent('dc:interaction', {detail: {name, proposal: document.body.dataset.proposal, ...detail}}));
  // Local UI events only. No analytics provider, storage or personal data transmission.
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
  window.matchMedia('(max-width: 760px)').addEventListener('change',()=>closeNav());

  document.querySelectorAll('[data-explorer]').forEach(explorer => {
    const tabs=[...explorer.querySelectorAll('[role="tab"]')];
    const panels=[...explorer.querySelectorAll('.dc-panel')];
    const search=explorer.querySelector('input[type="search"]');
    const count=explorer.querySelector('.dc-count');
    const empty=explorer.querySelector('.dc-empty');
    let active=tabs[0].dataset.group;
    function render() {
      const query=search.value.trim().toLocaleLowerCase('it');
      let visible=0;
      tabs.forEach(t=>{const current=t.dataset.group===active; t.setAttribute('aria-selected',String(current&&!query));t.tabIndex=current?0:-1;});
      panels.forEach(panel=>{
        let matches=0;
        const cards=[...panel.querySelectorAll('.dc-card')];
        cards.forEach((c,i)=>{const match=!query || c.textContent.toLocaleLowerCase('it').includes(query); c.hidden=!match || (!query && !panel.dataset.expanded && i>=6); if(match) matches++;});
        panel.hidden=query?!matches:panel.dataset.group!==active;
        panel.setAttribute('role',query?'region':'tabpanel');
        const more=panel.querySelector('.dc-more');
        more.hidden=!!query || cards.length<=6;
        more.textContent=panel.dataset.expanded?'Mostra meno':panel.dataset.group==='integrazioni'?`Mostra tutte le ${cards.length} integrazioni`:`Mostra tutti i ${cards.length} moduli`;
        more.setAttribute('aria-expanded',String(!!panel.dataset.expanded));
        if(!panel.hidden) visible+=matches;
      });
      count.textContent=query?`${visible} ${visible===1?'risultato':'risultati'} in tutte le categorie per “${search.value.trim()}”`:`${visible} soluzioni da esplorare`;
      empty.hidden=visible>0;
    }
    tabs.forEach((tab,i)=>{
      tab.addEventListener('click',()=>{active=tab.dataset.group;search.value='';render();emit('category_select',{category:active});});
      tab.addEventListener('keydown',e=>{
        const positions={ArrowRight:(i+1)%tabs.length,ArrowLeft:(i+tabs.length-1)%tabs.length,Home:0,End:tabs.length-1};
        if(e.key in positions){e.preventDefault();const next=tabs[positions[e.key]];next.focus();next.click();}
      });
    });
    panels.forEach(panel=>panel.querySelector('.dc-more').addEventListener('click',()=>{if(panel.dataset.expanded) delete panel.dataset.expanded;else panel.dataset.expanded='true';render();}));
    search.addEventListener('input',render);
    explorer.querySelectorAll('.dc-card').forEach(c=>c.addEventListener('toggle',()=>{if(c.open)emit('solution_open',{solution:c.querySelector('summary').textContent.trim()});}));
    render();
  });

  document.querySelectorAll('[data-carousel]').forEach(carousel=>{
    const list=carousel.querySelector('.dc-client-list'), prev=carousel.querySelector('[data-prev]'), next=carousel.querySelector('[data-next]');
    const play=carousel.querySelector('[data-play]'), all=carousel.querySelector('[data-all]'), status=carousel.querySelector('[data-position]');
    let playing=false, timer, expanded=false, hovered=false, focused=false, scrollTimer;
    function update(){
      const end=list.scrollWidth-list.clientWidth;
      prev.disabled=expanded || list.scrollLeft<=2;next.disabled=expanded || list.scrollLeft>=end-2;
      const width=list.firstElementChild.getBoundingClientRect().width+18;
      const first=Math.round(list.scrollLeft/width)+1;
      status.textContent=expanded?`Tutte le ${list.children.length} organizzazioni`:`${first}–${Math.min(list.children.length,first+Math.round(list.clientWidth/width)-1)} di ${list.children.length} organizzazioni`;
    }
    function step(direction, automatic=false){
      const end=list.scrollWidth-list.clientWidth;
      const target=automatic && list.scrollLeft>=end-2?0:Math.max(0,Math.min(end,list.scrollLeft+direction*(list.clientWidth+18)));
      list.scrollTo({left:target,behavior:reduced.matches?'instant':'smooth'});
      if(!automatic)emit('clients_navigate');
    }
    function schedule(){clearInterval(timer); if(playing&&!expanded&&!hovered&&!focused&&!document.hidden) timer=setInterval(()=>step(1,true),5000);}
    function stop(){playing=false;play.textContent='Avvia scorrimento';play.setAttribute('aria-pressed','false');status.setAttribute('aria-live','polite');schedule();}
    prev.addEventListener('click',()=>{stop();step(-1);});next.addEventListener('click',()=>{stop();step(1);});
    play.addEventListener('click',()=>{playing=!playing;if(playing){focused=false;hovered=false;}play.textContent=playing?'Pausa':'Avvia scorrimento';play.setAttribute('aria-pressed',String(playing));status.setAttribute('aria-live',playing?'off':'polite');schedule();});
    all.addEventListener('click',()=>{expanded=!expanded;stop();list.classList.toggle('dc-all',expanded);all.textContent=expanded?'Torna al carosello':'Mostra tutti i clienti';all.setAttribute('aria-expanded',String(expanded));play.disabled=expanded;update();emit('clients_expand',{expanded});});
    list.addEventListener('scroll',()=>{clearTimeout(scrollTimer);scrollTimer=setTimeout(update,120);},{passive:true});
    list.addEventListener('keydown',e=>{if(['ArrowLeft','ArrowRight','Home','End'].includes(e.key)){e.preventDefault();stop();if(e.key==='Home'||e.key==='End')list.scrollTo({left:e.key==='Home'?0:list.scrollWidth,behavior:reduced.matches?'instant':'smooth'});else step(e.key==='ArrowLeft'?-1:1);}});
    carousel.addEventListener('mouseenter',()=>{hovered=true;schedule();});carousel.addEventListener('mouseleave',()=>{hovered=false;schedule();});
    carousel.addEventListener('focusin',()=>{focused=true;schedule();});carousel.addEventListener('focusout',e=>{focused=carousel.contains(e.relatedTarget);schedule();});
    document.addEventListener('visibilitychange',schedule);reduced.addEventListener('change',()=>{if(reduced.matches)stop();});
    new ResizeObserver(update).observe(list);update();
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
})();
