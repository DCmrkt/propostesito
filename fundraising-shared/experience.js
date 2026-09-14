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

  const moduleTags=document.querySelector('.module-tags');
  const activeModule=moduleTags?.querySelector('[aria-current="page"]');
  if(moduleTags&&activeModule)requestAnimationFrame(()=>{
    moduleTags.scrollLeft=Math.max(0,activeModule.offsetLeft-(moduleTags.clientWidth-activeModule.clientWidth)/2);
  });

  document.querySelectorAll('[data-explorer]').forEach(explorer => {
    const hexes=[...explorer.querySelectorAll('[data-hex]')];
    const fundraisingHome=document.querySelector('.brand')?.href||window.location.href;
    const highValuePage=new URL('../mentor-crm/moduli-di-mentor/high-value-donors/',fundraisingHome).href;
    hexes.filter(hex=>hex.dataset.title==='High Donor Value').forEach(hex=>hex.href=highValuePage);
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
    let timer,resumeTimer,scrollTimer,interacting=false,visible=true;
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
      if(interacting||document.hidden||!visible||reduced.matches)return;
      list.scrollBy({left:itemStep(),behavior:'smooth'});
    }
    function schedule(delay=0){
      clearInterval(timer);clearTimeout(resumeTimer);
      if(document.hidden||!visible||reduced.matches)return;
      resumeTimer=setTimeout(()=>{timer=setInterval(advance,2600);},delay);
    }
    function pauseForInteraction(){interacting=true;clearInterval(timer);clearTimeout(resumeTimer);}
    function resumeAfterInteraction(){interacting=false;schedule(4200);}
    list.addEventListener('pointerdown',pauseForInteraction,{passive:true});
    list.addEventListener('pointerup',resumeAfterInteraction,{passive:true});
    list.addEventListener('pointercancel',resumeAfterInteraction,{passive:true});
    list.addEventListener('scroll',()=>{clearTimeout(scrollTimer);scrollTimer=setTimeout(normalize,180);},{passive:true});
    list.addEventListener('keydown',event=>{
      if(!['ArrowLeft','ArrowRight'].includes(event.key))return;
      event.preventDefault();pauseForInteraction();
      list.scrollBy({left:itemStep()*(event.key==='ArrowLeft'?-1:1),behavior:reduced.matches?'instant':'smooth'});
      resumeAfterInteraction();
      emit('clients_navigate',{direction:event.key==='ArrowLeft'?'previous':'next'});
    });
    document.addEventListener('visibilitychange',()=>schedule());
    reduced.addEventListener('change',()=>schedule());
    new IntersectionObserver(entries=>{visible=entries[0]?.isIntersecting??true;schedule();},{rootMargin:'160px'}).observe(carousel);
    new ResizeObserver(normalize).observe(list);
    schedule(500);
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
    const excluded='a,button,label,input,textarea,select,option,summary,script,style,noscript,svg,[aria-hidden="true"],[data-hex],.dc-sr,.dc-tools,.dc-carousel-foot,.dc-form,.dc-dialog';
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
})();
