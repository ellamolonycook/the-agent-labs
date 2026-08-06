
/* ============ CONFIG ============
   Ella, 6 Aug 2026: ALL early-bird timing is deliberately gone from this page.
   No countdown, no "ends in", no price-increase dates. Prices are written in the
   HTML and the "Rises to $X" lines carry the urgency without a clock.
   `doorsClose` is the ONLY date left, and it only ever disables the buy buttons.
   ================================================================ */
const CONFIG = {
  doorsClose: new Date('2026-09-05T00:00:00+01:00')
};

/* doors-close guard: once the doors shut, no button still says "buy" */
(function(){
  if(new Date() <= CONFIG.doorsClose) return;
  document.querySelectorAll('.cta-btn').forEach(function(b){
    b.textContent = 'DOORS CLOSED';
    b.style.pointerEvents = 'none';
    b.style.opacity = '.4';
  });
  var ub = document.getElementById('ub-msg');
  if(ub) ub.textContent = 'Doors closed · next run TBA';
})();

/* buttons with no destination yet must not behave like checkouts */
(function(){
  document.querySelectorAll('a[data-todo]').forEach(function(a){
    a.addEventListener('click', function(e){ e.preventDefault(); });
  });
})();

/* urgent bar: height sync only — the ticker is gone */
(function(){
  var bar = document.getElementById('urgent-bar');
  if(!bar) return;
  function sync(){ document.documentElement.style.setProperty('--urgent-h', bar.offsetHeight+'px'); }
  window.addEventListener('resize', sync);
  sync();
})();

/* Phones get the finished text, never the typing.
   Audit Part 6: two typewriter headlines plus a six-line typing terminal is jank
   and battery on a mid-range phone. Treated exactly like reduced-motion. */
function noType(){
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var narrow = window.matchMedia && window.matchMedia('(max-width: 640px)').matches;
  return !!(reduce || narrow);
}

/* terminal typing loop */
(function(){
  const reduce = noType();
  const lines = [
    ['ag','research_agent',' scanning your niche… 3 rising formats found'],
    ['ag','brain',' loading tone of voice: yours, not a bot’s'],
    ['ag','caption_writer',' 5 hooks drafted for tomorrow’s post'],
    ['ag','linkedin_writer',' founder post ready for review'],
    ['ag','carousel_builder',' 8 slides queued from one idea'],
    ['ok','machine',' week of content: done. you were at dinner.']
  ];
  const el = document.getElementById('term');
  if(!el) return;

  if(reduce){
    lines.forEach(l=>{
      const s = document.createElement('span'); s.className='ln';
      const t = document.createElement('span'); t.className=l[0]; t.textContent=l[1]+' ›';
      s.appendChild(t); s.appendChild(document.createTextNode(l[2]));
      el.appendChild(s);
    });
    return;
  }

  let li = 0, ci = 0, cur = null;
  function type(){
    if(li >= lines.length){
      setTimeout(()=>{ el.innerHTML=''; li=0; ci=0; cur=null; type(); }, 6000);
      return;
    }
    if(!cur){
      cur = document.createElement('span');
      cur.className = 'ln';
      const tag = document.createElement('span');
      tag.className = lines[li][0];
      tag.textContent = lines[li][1] + ' ›';
      cur.appendChild(tag);
      cur.appendChild(document.createTextNode(''));
      el.appendChild(cur);
    }
    const full = lines[li][2];
    if(ci < full.length){
      cur.childNodes[1].textContent = full.slice(0, ++ci);
      setTimeout(type, 55);
    } else {
      li++; ci=0; cur=null;
      setTimeout(type, 650);
    }
  }
  type();
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
  var reduceMo = noType();
  var lines = Array.prototype.slice.call(document.querySelectorAll('.typeline'));
  if(!lines.length) return;
  if(reduceMo) return;                        // leave text intact on phones / reduced motion
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
  var reduceMo = noType();
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