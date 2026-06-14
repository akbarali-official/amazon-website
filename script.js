/* ═══════════════════════════════════════════════════
   AMAZON COMPLETE PAGE — script.js
   ═══════════════════════════════════════════════════ */
'use strict';

/* ── TOAST ── */
function showToast(msg) {
  var b = document.getElementById('toastBox'), t = document.getElementById('toastTxt');
  if (!b || !t) return;
  t.textContent = msg;
  b.classList.add('show');
  clearTimeout(b._t);
  b._t = setTimeout(function(){ b.classList.remove('show'); }, 2800);
}

/* ── CART ── */
var cQty = 0;
function setCart(n){ cQty=n; var e=document.getElementById('cartNum'); if(e) e.textContent=cQty; }
var cLink = document.getElementById('cartLink');
if(cLink) cLink.addEventListener('click', function(e){ e.preventDefault(); showToast(cQty===0?'Your Cart is empty.':'Cart has '+cQty+' item(s).'); });

/* ── CATEGORY DROPDOWN ── */
var scBtn=document.getElementById('scBtn'), scDrop=document.getElementById('scDrop'), scLabel=document.getElementById('scLabel');
if(scBtn && scDrop){
  scBtn.addEventListener('click', function(e){ e.stopPropagation(); scDrop.classList.toggle('open'); });
  var scList=document.getElementById('scList');
  if(scList) scList.querySelectorAll('li').forEach(function(li){
    li.addEventListener('click', function(){
      scList.querySelectorAll('li').forEach(function(l){ l.classList.remove('sc-active'); });
      li.classList.add('sc-active');
      var v=li.dataset.val;
      if(scLabel) scLabel.textContent=v.length>16?v.slice(0,14)+'…':v;
      scDrop.classList.remove('open');
    });
  });
  document.addEventListener('click', function(e){ if(!scBtn.contains(e.target)&&!scDrop.contains(e.target)) scDrop.classList.remove('open'); });
}

/* ── SEARCH ── */
function doSearch(id){
  var inp=document.getElementById(id), q=inp?inp.value.trim():'';
  showToast(q?'Searching: "'+q+'"':'Please enter a search term.');
  if(!q&&inp) inp.focus();
}
var sBtn=document.getElementById('sBtn'), sInput=document.getElementById('sInput');
var mBtn=document.getElementById('mBtn'),   mInput=document.getElementById('mInput');
if(sBtn)   sBtn.addEventListener('click', function(){ doSearch('sInput'); });
if(sInput) sInput.addEventListener('keydown', function(e){ if(e.key==='Enter') doSearch('sInput'); });
if(mBtn)   mBtn.addEventListener('click', function(){ doSearch('mInput'); });
if(mInput) mInput.addEventListener('keydown', function(e){ if(e.key==='Enter') doSearch('mInput'); });

/* ── SIDE DRAWER ── */
var hbg=document.getElementById('hamburger'), ovl=document.getElementById('overlay'),
    drw=document.getElementById('drawer'),   drc=document.getElementById('drwClose');
function openD(){ if(!drw)return; drw.classList.add('open'); ovl.classList.add('open'); drw.setAttribute('aria-hidden','false'); document.body.style.overflow='hidden'; }
function closeD(){ if(!drw)return; drw.classList.remove('open'); ovl.classList.remove('open'); drw.setAttribute('aria-hidden','true'); document.body.style.overflow=''; }
if(hbg) hbg.addEventListener('click', openD);
if(drc) drc.addEventListener('click', closeD);
if(ovl) ovl.addEventListener('click', closeD);
var n2a=document.getElementById('n2AllBtn'); if(n2a) n2a.addEventListener('click', openD);
document.addEventListener('keydown', function(e){ if(e.key==='Escape'){ closeD(); if(scDrop) scDrop.classList.remove('open'); } });

/* ═══════════════════════════════════════════════════
   HERO SLIDER
   ═══════════════════════════════════════════════════ */
(function(){
  var track=document.getElementById('heroTrack'), dotsC=document.getElementById('hDots'),
      prev=document.getElementById('hPrev'), next=document.getElementById('hNext');
  if(!track) return;
  var slides=track.querySelectorAll('.h-slide'), total=slides.length, cur=0, timer;
  slides.forEach(function(_,i){
    var d=document.createElement('button');
    d.className='h-dot'+(i===0?' active':'');
    d.setAttribute('aria-label','Slide '+(i+1));
    d.addEventListener('click', function(){ goTo(i); reset(); });
    dotsC.appendChild(d);
  });
  function goTo(idx){
    cur=(idx+total)%total;
    track.style.transform='translateX(-'+cur*100+'%)';
    dotsC.querySelectorAll('.h-dot').forEach(function(d,i){ d.classList.toggle('active',i===cur); });
  }
  function reset(){ clearInterval(timer); timer=setInterval(function(){ goTo(cur+1); }, 5000); }
  if(prev) prev.addEventListener('click', function(){ goTo(cur-1); reset(); });
  if(next) next.addEventListener('click', function(){ goTo(cur+1); reset(); });
  var tx=0;
  track.addEventListener('touchstart', function(e){ tx=e.touches[0].clientX; }, {passive:true});
  track.addEventListener('touchend',   function(e){ var dx=tx-e.changedTouches[0].clientX; if(Math.abs(dx)>50){ goTo(dx>0?cur+1:cur-1); reset(); } });
  reset();
})();

/* ═══════════════════════════════════════════════════
   PRODUCT SLIDERS — universal setup
   ═══════════════════════════════════════════════════ */
function setupSlider(trackId, prevId, nextId, fillId){
  var track=document.getElementById(trackId),
      prev=document.getElementById(prevId),
      next=document.getElementById(nextId),
      fill=fillId?document.getElementById(fillId):null;
  if(!track) return;

  function getAmt(){
    var item=track.querySelector('.ps-it');
    if(!item) return 320;
    return item.offsetWidth * 3;
  }
  if(prev) prev.addEventListener('click', function(){ track.scrollBy({left:-getAmt(), behavior:'smooth'}); });
  if(next) next.addEventListener('click', function(){ track.scrollBy({left: getAmt(), behavior:'smooth'}); });

  function onScroll(){
    var max=track.scrollWidth-track.clientWidth, cur=track.scrollLeft, pct=max>0?cur/max:0;
    if(fill) fill.style.width=Math.min(10+pct*88,100)+'%';
    if(prev) prev.style.opacity=cur<=2?'0.3':'1';
    if(next) next.style.opacity=cur>=max-2?'0.3':'1';
  }
  track.addEventListener('scroll', onScroll, {passive:true});
  onScroll();

  /* Touch drag */
  var tx=0, ts=0;
  track.addEventListener('touchstart', function(e){ tx=e.touches[0].clientX; ts=track.scrollLeft; }, {passive:true});
  track.addEventListener('touchmove',  function(e){ track.scrollLeft=ts+(tx-e.touches[0].clientX); }, {passive:true});

  /* Mouse drag */
  var isDrag=false, mx=0, ms=0;
  track.addEventListener('mousedown',  function(e){ isDrag=true; mx=e.pageX-track.offsetLeft; ms=track.scrollLeft; track.style.cursor='grabbing'; track.style.userSelect='none'; });
  track.addEventListener('mousemove',  function(e){ if(!isDrag)return; track.scrollLeft=ms-(e.pageX-track.offsetLeft-mx); });
  function stopDrag(){ isDrag=false; track.style.cursor=''; track.style.userSelect=''; }
  track.addEventListener('mouseup',    stopDrag);
  track.addEventListener('mouseleave', stopDrag);
}

/* Init all 5 sliders */
setupSlider('b1Track','b1Prev','b1Next', null);
setupSlider('b2Track','b2Prev','b2Next','b2Fill');
setupSlider('b3Track','b3Prev','b3Next', null);
setupSlider('b4Track','b4Prev','b4Next', null);
setupSlider('b5Track','b5Prev','b5Next','b5Fill');

/* ── Sticky shadow ── */
window.addEventListener('scroll', function(){
  var h=document.querySelector('.amz-header');
  if(h) h.style.boxShadow=window.scrollY>4?'0 3px 10px rgba(0,0,0,.5)':'0 2px 8px rgba(0,0,0,.4)';
}, {passive:true});

/* ── Init ── */
setCart(0);

/* ═══════════════════════════════════════════════════════
   AMAZON FOOTER — script.js
   ═══════════════════════════════════════════════════════ */
'use strict';

/* ── BACK TO TOP ── */
var backTop = document.getElementById('backTop');
if (backTop) {
  backTop.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ── MOBILE ACCORDION for 4-col footer links ── */
/* On mobile ≤ 768px, each column heading toggles open/close */
function initAccordion() {
  if (window.innerWidth > 768) return; /* only on mobile */

  var cols = document.querySelectorAll('.ft-col');
  cols.forEach(function (col) {
    var hd   = col.querySelector('.ft-col-hd');
    var links = col.querySelectorAll('.ft-lnk');
    if (!hd || !links.length) return;

    /* Wrap links in a body div for animation */
    var body = document.createElement('div');
    body.className = 'ft-col-body';
    links.forEach(function (lnk) { body.appendChild(lnk); });
    col.appendChild(body);

    hd.addEventListener('click', function () {
      col.classList.toggle('open');
    });
  });
}

/* ── LOCALE BUTTON FEEDBACK ── */
document.querySelectorAll('.ft-loc-btn').forEach(function (btn) {
  btn.addEventListener('click', function () {
    var txt = btn.textContent.trim();
    showPulse(btn);
  });
});

function showPulse(el) {
  el.style.borderColor = '#febd69';
  el.style.color = '#febd69';
  setTimeout(function () {
    el.style.borderColor = '';
    el.style.color = '';
  }, 500);
}

/* ── SIGN IN BUTTON ── */
var sbBtn = document.querySelector('.sb-btn');
if (sbBtn) {
  sbBtn.addEventListener('click', function (e) {
    e.preventDefault();
    sbBtn.style.background = '#f7ca00';
    setTimeout(function () { sbBtn.style.background = ''; }, 300);
  });
}

/* ── GRID ITEM HOVER FEEDBACK ── */
document.querySelectorAll('.ft-grid-item').forEach(function (item) {
  item.addEventListener('mouseenter', function () {
    item.style.background = 'rgba(255,255,255,0.04)';
  });
  item.addEventListener('mouseleave', function () {
    item.style.background = '';
  });
});

/* ── FOOTER LINKS CLICK ── */
document.querySelectorAll('.ft-lnk, .fg-title, .ft-legal-links a').forEach(function (lnk) {
  lnk.addEventListener('click', function (e) {
    e.preventDefault();
  });
});

/* ── RESIZE HANDLER (rebuild accordion on resize) ── */
var resizeTimer;
window.addEventListener('resize', function () {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(function () {
    /* On resize to desktop, remove mobile accordion wrappers */
    if (window.innerWidth > 768) {
      document.querySelectorAll('.ft-col-body').forEach(function (body) {
        var col = body.parentElement;
        while (body.firstChild) {
          col.insertBefore(body.firstChild, body);
        }
        body.remove();
        col.classList.remove('open');
      });
    }
  }, 250);
});

/* ── INIT ── */
initAccordion();