(() => {
  'use strict';
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  document.documentElement.classList.add('js');
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
    if(reducedMotion.matches)return;
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
  reducedMotion.addEventListener('change',schedule);
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
})();
