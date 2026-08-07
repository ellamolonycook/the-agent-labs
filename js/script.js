
/* ============ CONFIG · all dates + prices live here ============ */
const CONFIG = {
  earlyBirdEnds: new Date('2026-08-29T00:00:00+01:00'),
  doorsClose:    new Date('2026-09-05T00:00:00+01:00'), 
  essEarly:  '$197', essFull: '$297',  
  earlyPrice: '$395', fullPrice: '$495'
};

/* pricing flip */
(function(){
  // Every id below is optional in the markup — a missing one used to throw here,
  // and an uncaught throw at top level kills every script block after it.
  function setText(id, value){
    var el = document.getElementById(id);
    if(el) el.textContent = value;
  }

  const now = new Date();
  const early = now < CONFIG.earlyBirdEnds;
  const price = early ? CONFIG.earlyPrice : CONFIG.fullPrice;
  const essPrice = early ? CONFIG.essEarly : CONFIG.essFull;
  setText('vip-price', price);
  setText('vip-btn', 'GET THE FULL MACHINE · ' + price + ' →');
  setText('ess-price', essPrice);
  setText('ess-btn', 'START WITH ESSENTIAL · ' + essPrice);
  var pcDays = Math.max(1, Math.ceil((CONFIG.earlyBirdEnds - now) / 86400000));
  setText('pc-days', pcDays + (pcDays === 1 ? ' day' : ' days'));
  if(!early){
    ['vip-badge','vip-was','vip-deadline','ess-was','ess-deadline','price-countdown'].forEach(function(id){
      var el = document.getElementById(id); if(el) el.style.display = 'none';
    });
  }
  if(now > CONFIG.doorsClose){
    document.querySelectorAll('.cta-btn').forEach(b=>{
      b.textContent = 'DOORS CLOSED';
      b.style.pointerEvents = 'none';
      b.style.opacity = '.4';
    });
    document.getElementById('bar-count').textContent = 'DOORS CLOSED · NEXT RUN TBA';
  }
})();

/* countdown in sticky bar: early-bird first, then doors-close */
(function () {
  const el = document.getElementById('bar-count');
  if (!el) return;

  const endTime = new Date(Date.now() + 48 * 60 * 60 * 1000);

  function fmt(ms) {
    const totalSeconds = Math.floor(ms / 1000);

    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return `${hours}H ${minutes}M ${seconds}S`;
  }

  function tick() {
    const now = new Date();
    const remaining = endTime - now;

    if (remaining > 0) {
      el.textContent = `EARLY BIRD SPECIAL ENDS IN ${fmt(remaining)}`;
    } else {
      el.textContent = 'EARLY BIRD SPECIAL ENDED';
      clearInterval(timer);
    }
  }

  tick();

  const timer = setInterval(tick, 1000);
})();

/* urgent red bar: live countdown + height sync */
(function(){
  var bar = document.getElementById('urgent-bar');
  var el  = document.getElementById('urgent-count');
  var msg = document.getElementById('ub-msg');
  if(!bar || !el || !msg) return;
  var state = '';
  function pad(n){ return (n<10?'0':'')+n; }
  function fmt(ms){
    var d=Math.floor(ms/86400000), h=Math.floor(ms%86400000/3600000),
        m=Math.floor(ms%3600000/60000), s=Math.floor(ms%60000/1000);
    return (d>0?d+'d ':'') + pad(h)+'h '+pad(m)+'m '+pad(s)+'s';
  }
  function sync(){ document.documentElement.style.setProperty('--urgent-h', bar.offsetHeight+'px'); }
  var timer;
  function setState(s){
    if(state===s) return; state=s;
    if(s==='early'){ msg.innerHTML='Founding member pricing available now'; }
    else if(s==='doors'){ msg.textContent='Doors close Fri Sept 4 · last chance to get in'; }
    else { msg.textContent='Doors closed · next run TBA'; el.style.display='none'; }
    sync();
  }
  function tick(){
    var now = new Date();
    if(now < CONFIG.earlyBirdEnds){ setState('early'); el.textContent = fmt(CONFIG.earlyBirdEnds - now); }
    else if(now < CONFIG.doorsClose){ setState('doors'); el.textContent = fmt(CONFIG.doorsClose - now); }
    else { setState('closed'); clearInterval(timer); }
  }
  tick(); timer = setInterval(tick, 1000);
  window.addEventListener('resize', sync); sync();
})();

/* ============================================================
   THE CONTENT MACHINE — terminal typing loop
   ============================================================ */
(function () {
  'use strict';

  // Flip to false to render exactly as before (no blinking cursor).
  var SHOW_CARET = true;

  var CHAR_DELAY = 55;    // ms per character
  var LINE_DELAY = 650;   // ms between lines
  var LOOP_DELAY = 6000;  // ms before restarting

  var LINES = [
    ['ag', 'research_agent',   ' scanning your niche… 3 rising formats found'],
    ['ag', 'brain',            ' loading tone of voice: yours, not a bot’s'],
    ['ag', 'caption_writer',   ' 5 hooks drafted for tomorrow’s post'],
    ['ag', 'linkedin_writer',  ' founder post ready for review'],
    ['ag', 'carousel_builder', ' 8 slides queued from one idea'],
    ['ok', 'machine',          ' week of content: done. you were at dinner.']
  ];

  function ready(fn) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', fn, { once: true });
    } else {
      fn();
    }
  }

  ready(function init() {
    var el = document.getElementById('term');
    if (!el) return;
    if (el.getAttribute('data-term-init') === '1') return; // no double-init
    el.setAttribute('data-term-init', '1');

    var mq = window.matchMedia
      ? window.matchMedia('(prefers-reduced-motion: reduce)')
      : null;

    var timer = null;
    var caret = null;
    var li = 0, ci = 0, cur = null;

    function stop() {
      if (timer) { clearTimeout(timer); timer = null; }
      while (el.firstChild) el.removeChild(el.firstChild);
      caret = null; cur = null; li = 0; ci = 0;
    }

    // Builds one line and returns a direct reference to its text element.
    // An element node is never dropped by normalize() or an innerHTML
    // round-trip, and we never look it up by index again.
    function makeLine(def) {
      var line = document.createElement('span');
      line.className = 'ln';

      var tag = document.createElement('span');
      tag.className = def[0];
      tag.textContent = def[1] + ' ›';

      var txt = document.createElement('span');
      txt.className = 'txt';

      line.appendChild(tag);
      line.appendChild(txt);

      return { line: line, txt: txt };
    }

    function renderStatic() {
      stop();
      for (var i = 0; i < LINES.length; i++) {
        var part = makeLine(LINES[i]);
        part.txt.textContent = LINES[i][2];
        el.appendChild(part.line);
      }
    }

    function start() {
      stop();
      if (SHOW_CARET) {
        caret = document.createElement('span');
        caret.className = 'caret';
      }
      step();
    }

    function step() {
      timer = null;

      if (li >= LINES.length) {
        timer = setTimeout(start, LOOP_DELAY);
        return;
      }

      if (!cur) {
        cur = makeLine(LINES[li]);
        el.appendChild(cur.line);
        if (caret) cur.line.appendChild(caret); // appendChild moves it down
      }

      var full = LINES[li][2];

      if (ci < full.length) {
        ci++;
        cur.txt.textContent = full.slice(0, ci); // direct reference, never null
        timer = setTimeout(step, CHAR_DELAY);
      } else {
        li++; ci = 0; cur = null;
        timer = setTimeout(step, LINE_DELAY);
      }
    }

    function apply() {
      if (mq && mq.matches) renderStatic();
      else start();
    }

    apply();

    if (mq) {
      if (mq.addEventListener) mq.addEventListener('change', apply);
      else if (mq.addListener) mq.addListener(apply); // older Safari
    }
  });
})();

/* scroll reveal + stat count-up */
(function(){
  if(!('IntersectionObserver' in window)) return;
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var statWrap = document.querySelector('.stats');
  if(statWrap){
    var nums = statWrap.querySelectorAll('b[data-count]');
    var counted = false;
    var run = function(){
      nums.forEach(function(el){
        var target = parseFloat(el.getAttribute('data-count'));
        var suffix = el.getAttribute('data-suffix') || '';
        if(reduce){ el.textContent = target + suffix; return; }
        var start = null, dur = 1200;
        (function frame(){
          requestAnimationFrame(function(ts){
            if(start === null) start = ts;
            var p = Math.min((ts - start) / dur, 1);
            var eased = 1 - Math.pow(1 - p, 3);
            el.textContent = Math.round(target * eased) + suffix;
            if(p < 1) frame(); else el.textContent = target + suffix;
          });
        })();
      });
    };
    var so = new IntersectionObserver(function(es){
      es.forEach(function(e){ if(e.isIntersecting && !counted){ counted = true; run(); so.disconnect(); } });
    }, { threshold: .4 });
    so.observe(statWrap);
  }

  // timeline lights up as you scroll through it
  var week = document.querySelector('.week');
  if(week && !reduce){
    week.classList.add('armed');
    var wo = new IntersectionObserver(function(es){
      es.forEach(function(e){ if(e.isIntersecting){ e.target.classList.add('lit'); wo.unobserve(e.target); } });
    }, { threshold: .55 });
    week.querySelectorAll('li').forEach(function(li){ wo.observe(li); });
  }

  if(reduce) return;
  var items = Array.prototype.slice.call(document.querySelectorAll('.phase,.card,.tier,.vip-card,.date-row,.callout,.pull'));
  items.forEach(function(el){ el.classList.add('reveal'); });
  var ro = new IntersectionObserver(function(es){
    es.forEach(function(e){ if(e.isIntersecting){ e.target.classList.add('in'); ro.unobserve(e.target); } });
  }, { threshold: .12 });
  items.forEach(function(el){ ro.observe(el); });
})();

/* animated headings: TYPEWRITER reveal, char by char on scroll-in. Every char is pre-placed (just hidden) so nothing reflows. */
(function(){
  var reduceMo = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var lines = Array.prototype.slice.call(document.querySelectorAll('.typeline'));
  if(!lines.length) return;
  if(reduceMo) return;                        // leave text intact if motion is reduced
  lines.forEach(function(el){
    var text = el.textContent;
    el.textContent = '';
    el._chars = [];
    for(var i = 0; i < text.length; i++){
      var s = document.createElement('span');
      s.className = 'tw-char';
      s.textContent = text.charAt(i);
      el.appendChild(s);
      el._chars.push(s);
    }
  });
  function run(el){
    var chars = el._chars || [], i = 0;
    var caret = document.createElement('span');
    caret.className = 'tw-caret';
    (function step(){
      if(caret.parentNode) caret.parentNode.removeChild(caret);
      if(i >= chars.length){
        var last = chars[chars.length - 1];
        if(last) last.after(caret);
        setTimeout(function(){ if(caret.parentNode) caret.parentNode.removeChild(caret); }, 1500);
        return;
      }
      var c = chars[i];
      c.classList.add('on');
      c.after(caret);                         // caret sits just after the last typed char
      i++;
      var ch = c.textContent;
      var delay = /[.,!?;:]/.test(ch) ? 460 : (ch === ' ' ? 95 : 74);   // pause on punctuation, like a typewriter
      setTimeout(step, delay);
    })();
  }
  var to = new IntersectionObserver(function(es){
    es.forEach(function(e){ if(e.isIntersecting){ run(e.target); to.unobserve(e.target); } });
  }, { threshold: .5 });
  lines.forEach(function(el){ to.observe(el); });
})();


/* typewriter loop: type + erase + repeat, triggered on scroll-in */
(function(){
  var reduceMo = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var lines = Array.prototype.slice.call(document.querySelectorAll('.typeline-loop'));
  if(!lines.length) return;
  if(reduceMo) return;
  
  lines.forEach(function(el){
    var text = el.textContent;
    el.textContent = '';
    el._chars = [];
    for(var i = 0; i < text.length; i++){
      var s = document.createElement('span');
      s.className = 'tw-char';
      s.textContent = text.charAt(i);
      el.appendChild(s);
      el._chars.push(s);
    }
  });
  
  function loop(el){
    var chars = el._chars || [];
    var caret = document.createElement('span');
    caret.className = 'tw-caret';
    
    function typeOut(){
      var i = 0;
      (function step(){
        if(i >= chars.length){
          setTimeout(erase, 2000);
          return;
        }
        var c = chars[i];
        c.classList.add('on');
        c.after(caret);
        i++;
        var ch = c.textContent;
        var delay = /[.,!?;:]/.test(ch) ? 460 : (ch === ' ' ? 95 : 74);
        setTimeout(step, delay);
      })();
    }
    
    function erase(){
      var i = chars.length - 1;
      (function step(){
        if(i < 0){
          setTimeout(typeOut, 800);
          return;
        }
        var c = chars[i];
        c.classList.remove('on');
        c.after(caret);
        i--;
        setTimeout(step, 50);
      })();
    }
    
    typeOut();
  }
  
  var to = new IntersectionObserver(function(es){
    es.forEach(function(e){ 
      if(e.isIntersecting && !e.target._loopStarted){
        e.target._loopStarted = true;
        loop(e.target);
        to.unobserve(e.target);
      }
    });
  }, { threshold: .5 });
  
  lines.forEach(function(el){ to.observe(el); });
})();

/* story: each paragraph starts blank and glides in as you scroll down to it. */
(function(){
  var stories = Array.prototype.slice.call(document.querySelectorAll('.story'));
  if(!stories.length) return;
  var reduceMo = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  
  stories.forEach(function(story) {
    var prog = story.querySelector('.story-spine .prog');
    var groups = Array.prototype.slice.call(story.querySelectorAll('.story-group'));
    if(!groups.length) return;
    
    if(reduceMo){ 
      groups.forEach(function(b){ b.classList.add('in'); }); 
      if(prog) prog.style.strokeDashoffset='0'; 
      return; 
    }
    
    var revealed = 0;
    function drawTo(n){ if(prog) prog.style.strokeDashoffset = String(1 - Math.min(1, n / groups.length)); }
    drawTo(0);
    
    var io = new IntersectionObserver(function(es){
      es.forEach(function(e){
        if(e.isIntersecting && !e.target.classList.contains('in')){
          e.target.classList.add('in');
          revealed++;
          drawTo(revealed);
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0, rootMargin: '0px 0px -18% 0px' });
    
    groups.forEach(function(b){ io.observe(b); });
  });
})();

/* proof wall: tap a screenshot to read it full size */
(function(){
  var box = document.getElementById('lightbox');
  var img = document.getElementById('lightbox-img');
  if(!box || !img) return;
  var closeBtn = box.querySelector('.lightbox-close');
  var lastFocus = null;

  function open(src, alt){
    lastFocus = document.activeElement;
    img.src = src;
    img.alt = alt || '';
    box.hidden = false;
    document.body.style.overflow = 'hidden';
    if(closeBtn) closeBtn.focus();
  }
  function close(){
    box.hidden = true;
    img.src = '';
    document.body.style.overflow = '';
    if(lastFocus && lastFocus.focus) lastFocus.focus();   // back to the thumbnail
    lastFocus = null;
  }

  document.querySelectorAll('.shot-open').forEach(function(btn){
    btn.addEventListener('click', function(){
      var full = btn.getAttribute('data-full');
      var thumb = btn.querySelector('img');
      if(full) open(full, thumb ? thumb.alt : '');
    });
  });

  if(closeBtn) closeBtn.addEventListener('click', close);
  box.addEventListener('click', function(e){ if(e.target === box) close(); });   // backdrop only
  document.addEventListener('keydown', function(e){
    if(e.key === 'Escape' && !box.hidden) close();
  });
})();

/* 50+ skills: turn the wrapped chip list into two stacked auto-scrolling rows */
(function(){
  var wrap = document.querySelector('.vskills');
  if(!wrap) return;
  if(window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;   // keep the static list if motion is reduced
  var chips = Array.prototype.slice.call(wrap.querySelectorAll('.vchip'));
  if(chips.length < 6) return;
  var mid = Math.ceil(chips.length / 2);
  var rows = [chips.slice(0, mid), chips.slice(mid)];
  wrap.innerHTML = '';
  wrap.classList.add('marquee-on');
  rows.forEach(function(rowChips, r){
    var m = document.createElement('div'); m.className = 'vmarquee';
    var t = document.createElement('div'); t.className = 'vtrack' + (r === 1 ? ' rev' : '');
    for(var pass = 0; pass < 2; pass++){                 // two identical copies = seamless -50% loop
      rowChips.forEach(function(ch){ t.appendChild(ch.cloneNode(true)); });
    }
    m.appendChild(t);
    wrap.appendChild(m);
  });
})();