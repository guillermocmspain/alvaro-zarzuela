(() => {
  'use strict';
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  document.documentElement.classList.add('js');
  let manualMotion = false;
  const motionDisabled = () => reducedMotion.matches || manualMotion;
  const motionButton = document.querySelector('.motion-toggle');
  const syncMotion = () => {
    document.documentElement.classList.toggle('motion-reduced',motionDisabled());
    motionButton.setAttribute('aria-pressed',String(motionDisabled()));
    motionButton.setAttribute('aria-label',motionDisabled()?'Activar las animaciones':'Reducir las animaciones');
    motionButton.querySelector('span').textContent=motionDisabled()?'OFF':'ON';
  };
  syncMotion();
  motionButton.addEventListener('click',() => {
    manualMotion=!manualMotion;
    syncMotion();
    schedule();
  });
  const menuButton = document.querySelector('.menu-toggle');
  const navigation = document.querySelector('.navigation');
  const header = document.querySelector('.header');
  const main = document.querySelector('main');
  const footer = document.querySelector('.footer');
  let menuOpen = false;
  const setMenu = (open) => {
    menuOpen = open;
    menuButton.setAttribute('aria-expanded',String(open));
    navigation.classList.toggle('open',open);
    navigation.inert = !open;
    main.inert = open;
    footer.inert = open;
    document.body.classList.toggle('locked',open);
    if (open) requestAnimationFrame(() => navigation.querySelector('a').focus({preventScroll:true}));
    else menuButton.focus({preventScroll:true});
  };
  menuButton.addEventListener('click',() => setMenu(!menuOpen));
  navigation.querySelectorAll('a').forEach(link => link.addEventListener('click',() => {
    setMenu(false);
    const target = document.querySelector(link.hash);
    target.setAttribute('tabindex','-1');
    target.focus({preventScroll:true});
  }));
  document.addEventListener('keydown',event => {
    if (!menuOpen) return;
    if (event.key === 'Escape') {setMenu(false);return;}
    if (event.key === 'Tab') {
      const items = [menuButton,...navigation.querySelectorAll('a')];
      const index = items.indexOf(document.activeElement);
      event.preventDefault();
      items[(index + (event.shiftKey ? items.length - 1 : 1)) % items.length].focus();
    }
  });
  header.querySelectorAll('a').forEach(link => link.addEventListener('click',() => {if(menuOpen)setMenu(false);}));
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if(entry.isIntersecting){entry.target.classList.add('visible');revealObserver.unobserve(entry.target);}
    });
  },{threshold:0.08,rootMargin:'0px 0px -15px 0px'});
  document.querySelectorAll('.reveal').forEach(element => revealObserver.observe(element));

  const chapterLinks = [...document.querySelectorAll('.chapter-nav a')];
  const chapters = chapterLinks.map(link => document.querySelector(link.hash));
  const progress = document.querySelector('.progress');
  const parallax = [...document.querySelectorAll('[data-parallax]')];
  const scenes = [...document.querySelectorAll('[data-scene]')];
  const milestones = [...document.querySelectorAll('.milestone')];
  const rail = [...document.querySelectorAll('.timeline-rail span')];
  const strip = document.querySelector('.sound-strip');
  const clamp = value => Math.max(0,Math.min(1,value));
  const ramp = (value,start,end) => clamp((value-start)/(end-start));
  const ease = value => value*value*(3-2*value);
  const style = (element,values) => Object.entries(values).forEach(([key,value]) => element.style.setProperty(key,value));
  const updateScenes = () => {
    scenes.forEach(scene => {
      const rect=scene.getBoundingClientRect();
      if(rect.bottom<0 || rect.top>innerHeight)return;
      let p=clamp(-rect.top/Math.max(1,rect.height-innerHeight));
      if(scene.dataset.scene==='hero') {
        // Preserve the first sequence, then slide into a held history composition.
        const history=ease(ramp(p,.69,.89));
        p=clamp(p/.64);
        const contract=ease(ramp(p,.06,.58));
        const wipe=ease(ramp(p,.38,.78));
        const mobile=innerWidth<=600;
        const edge=110-wipe*120;
        const wave=Array.from({length:121},(_,i)=>{
          const x=i*100/120;
          const y=edge+Math.sin(i*.28)*1.2+Math.sin(i*.11)*2.5+Math.sin(i*.75)*.5;
          return `${x}% ${y.toFixed(2)}%`;
        }).join(',');
        style(scene,{
          '--frame-x':`${contract*(mobile?9:29)}%`,
          '--frame-y':`${contract*(mobile?30:20)}%`,
          '--hero-detail':1-ease(ramp(p,0,.18)),
          '--title-rise':`${-ease(ramp(p,0,.35))*32}vh`,
          '--title-opacity':1-ease(ramp(p,.08,.32)),
          '--portrait-drift':`${-contract*(mobile?0:18)}vw`,
          '--portrait-rise':`${-ease(ramp(p,.32,.8))*28}vh`,
          '--outgoing-opacity':1-ease(ramp(p,.68,.8)),
          '--bridge-opacity':ease(ramp(p,.1,.4))*(1-history),
          '--bridge-drift':`${(1-contract)*30}vw`,
          '--arrival-clip':`polygon(${wave},100% 100%,0% 100%)`,
          '--arrival-rise':`${(1-ease(ramp(p,.4,.85)))*18}%`,
          '--frame-opacity':ease(ramp(p,.06,.18)),
          '--arrival-caption':ease(ramp(p,.8,.94))*(1-history),
          '--history-shift':`${-history*(mobile?0:23)}vw`,
          '--history-progress':history,
          '--history-opacity':history,
          '--history-title-x':`${(1-history)*24}vw`
        });
      } else if(scene.dataset.scene==='timeline') {
        const segment=Math.min(2,Math.floor(p*3));
        const position=segment===2?2:segment+ease(ramp(p*3-segment,.72,1));
        milestones.forEach((milestone,index) => {
          const distance=index-position;
          style(milestone,{'--milestone-opacity':clamp(1-Math.abs(distance)*2),'--milestone-y':`${distance*140}px`,'--milestone-rotation':`${distance*8-4}deg`});
        });
        rail.forEach((item,index)=>item.classList.toggle('active',index===Math.round(position)));
        scene.style.setProperty('--timeline-progress',p);
      } else {
        const curtain=ease(ramp(p,0,.32));
        const arrive=ease(ramp(p,.08,.42));
        const depart=ease(ramp(p,.68,1));
        const photo=ease(ramp(p,.24,.64));
        style(scene,{'--curtain-inset':`${100*(1-curtain)}%`,'--circle-radius':`${curtain*75}%`,'--curtain-side':`${50*(1-curtain)}%`,'--scene-opacity':ramp(p,.1,.3),'--type-left':`${-70*(1-arrive)-depart*85}vw`,'--type-right':`${70*(1-arrive)+depart*85}vw`,'--photo-opacity':ramp(p,.24,.38),'--photo-inset':`${50*(1-photo)}%`,'--photo-scale':.72+photo*.28,'--photo-rotate':`${-9*(1-photo)}deg`,'--photo-gray':1-photo,'--photo-tint':.45*(1-photo),'--caption-opacity':ramp(p,.68,.9),'--caption-y':`${30*(1-ramp(p,.68,.9))}px`});
      }
    });
    const stripTop=strip.getBoundingClientRect().top;
    if(stripTop<innerHeight && stripTop>-300)strip.style.setProperty('--strip-shift',`${(stripTop-innerHeight)*.2}px`);
  };
  let scheduled = false;
  const updateScroll = () => {
    scheduled = false;
    const max = document.documentElement.scrollHeight - innerHeight;
    progress.style.setProperty('--progress',max > 0 ? scrollY / max : 0);
    let active = 0;
    chapters.forEach((chapter,index) => {if(chapter.getBoundingClientRect().top < innerHeight * .45) active=index;});
    chapterLinks.forEach((link,index) => {
      if(index===active)link.setAttribute('aria-current','location');
      else link.removeAttribute('aria-current');
    });
    if(motionDisabled())return;
    updateScenes();
    parallax.forEach(element => {
      const rect = element.getBoundingClientRect();
      if(rect.bottom < -100 || rect.top > innerHeight + 100)return;
      const ratio = (rect.top + rect.height / 2 - innerHeight / 2) / innerHeight;
      element.style.setProperty('--parallax',`${Math.max(-1,Math.min(1,ratio)) * Number(element.dataset.parallax)}px`);
    });
  };
  const schedule = () => {if(!scheduled){scheduled=true;requestAnimationFrame(updateScroll);}};
  addEventListener('scroll',schedule,{passive:true});
  addEventListener('resize',schedule,{passive:true});
  reducedMotion.addEventListener('change',() => {syncMotion();schedule();});
  updateScroll();

  const dialog = document.querySelector('.video-dialog');
  const mount = document.querySelector('#video-mount');
  let videoTrigger;
  document.querySelectorAll('[data-video]').forEach(button => button.addEventListener('click',() => {
    videoTrigger=button;
    document.querySelector('#video-title').textContent=button.dataset.title;
    document.querySelector('#carousel-hint').hidden=button.dataset.video!=='CghCyRGodi5';
    const url=`https://www.instagram.com/p/${button.dataset.video}/`;
    document.querySelector('#video-original').href=url + (button.dataset.video==='CghCyRGodi5'?'?img_index=3':'');
    const iframe=document.createElement('iframe');
    iframe.title=`Vídeo de Instagram: ${button.dataset.title}`;
    iframe.src=url+'embed/';
    iframe.allow='encrypted-media; fullscreen; picture-in-picture';
    iframe.referrerPolicy='strict-origin-when-cross-origin';
    mount.replaceChildren(iframe);
    dialog.showModal();
    document.body.classList.add('locked');
    document.querySelector('.close-video').focus();
  }));
  document.querySelector('.close-video').addEventListener('click',()=>dialog.close());
  dialog.addEventListener('click',event=>{if(event.target===dialog){const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dialog.close();}});
  dialog.addEventListener('close',()=>{
    mount.replaceChildren(); // Unload the player and stop playback on every close path, including Escape.
    document.body.classList.remove('locked');
    videoTrigger?.focus({preventScroll:true});
  });

  // Entrance progress represents settled critical assets, not a simulated timer.
  const entrance=document.querySelector('.entrance');
  const enter=document.querySelector('.enter-button');
  const label=document.querySelector('.enter-label');
  const status=document.querySelector('#entrance-status');
  let entranceLeaving=false;
  const finishEntrance=() => {
    if(!entrance.open)return;
    entrance.close();
    entrance.classList.remove('is-leaving');
    document.body.classList.remove('locked');
    entranceLeaving=false;
    const title=document.querySelector('#hero-title');
    title.setAttribute('tabindex','-1');
    title.focus({preventScroll:true});
    schedule();
  };
  const leaveEntrance=() => {
    if(entranceLeaving)return;
    entranceLeaving=true;
    if(motionDisabled()){finishEntrance();return;}
    entrance.classList.add('is-leaving');
    setTimeout(finishEntrance,1200); // Also completes if CSS animation events are unavailable.
  };
  entrance.addEventListener('animationend',event=>{if(event.target===entrance)finishEntrance();});
  entrance.addEventListener('cancel',event=>{event.preventDefault();finishEntrance();});
  entrance.addEventListener('keydown',event=>{if(event.key==='Escape'){event.preventDefault();finishEntrance();}});
  enter.addEventListener('click',leaveEntrance);
  const openEntrance=() => {
    scrollTo({top:0,behavior:'instant'});
    entrance.showModal();
    document.body.classList.add('locked');
    if(!enter.disabled)enter.focus({preventScroll:true});
  };
  document.querySelector('.replay-entrance').addEventListener('click',openEntrance);
  if(!location.hash || location.hash==='#inicio')openEntrance();
  const preload=new Image();
  preload.src='assets/walk-entry.webp';
  const portrait=document.querySelector('.hero-portrait img');
  const assets=[preload.decode(),portrait.decode(),document.querySelector('.hero-arrival img').decode(),document.fonts.load('800 24px Display'),document.fonts.load('400 16px Body')];
  let settled=0;
  const ready=()=>{
    enter.disabled=false;
    label.textContent='INGRESAR';
    status.textContent='EL ESCENARIO ESTÁ LISTO';
    entrance.style.setProperty('--loaded','1');
  };
  const timeout=setTimeout(ready,8000); // Never trap the visitor behind a failed font or image.
  Promise.allSettled(assets.map(asset=>Promise.resolve(asset).finally(()=>{
    settled++;
    entrance.style.setProperty('--loaded',settled/assets.length);
    if(enter.disabled)label.textContent=`${Math.round(settled/assets.length*100)}%`;
  }))).then(()=>{clearTimeout(timeout);ready();});
})();
