/* Karibu Trove: home page v5 — discovery-first, no collection concept exposed. */
(function(){
  var KT = window.KT, props = KT.properties;

  /* ---- A/B variant switching ---- */
  var VARIANT = 'a';
  try { VARIANT = new URLSearchParams(window.location.search).get('v') || 'a'; } catch(e){}
  document.querySelectorAll('[data-v]').forEach(function(el){
    var show = el.getAttribute('data-v') === VARIANT;
    el.style.display = show ? '' : 'none';
    el.setAttribute('aria-hidden', show ? 'false' : 'true');
  });

  /* ---- helpers ---- */
  function bgFor(p, i){
    if(p.imgUrls && p.imgUrls[i]){
      var f = p.fallback[i % p.fallback.length];
      return "url('" + p.imgUrls[i] + "'), linear-gradient(" + f + ")";
    }
    var f = p.fallback[i % p.fallback.length];
    return "url('images/" + p.slug + "/" + (i + 1) + ".jpg'), linear-gradient(" + f + ")";
  }
  function requestText(p, channel){
    var prefix = channel === 'direct' ? '[Direct Booking] ' : '';
    var vTag   = VARIANT !== 'a' ? '\nVariant: ' + VARIANT : '';
    return prefix + 'Hi Karibu Trove! I\'d like to ask about ' + p.name + ' (' + p.loc + ').\n' +
           'Dates:\nGuests:\nRef: ' + p.code + vTag;
  }
  function discountedRate(usd){ return Math.floor(usd * 0.9); }
  function directLink(p){
    if(KT.DIRECT_BOOKING_URL) return KT.DIRECT_BOOKING_URL + '?prop=' + p.code;
    var subj = 'Direct Booking Request: ' + p.name;
    var body = 'Hi Karibu Trove,\n\nI\'d like to book ' + p.name + ' (' + p.loc + ') directly.\n\nDates:\nGuests:\nRef: ' + p.code;
    return 'mailto:' + KT.EMAIL + '?subject=' + encodeURIComponent(subj) + '&body=' + encodeURIComponent(body);
  }

  /* ---- Stays grid ---- */
  var grid    = document.getElementById('curGrid');
  var chipBox = document.getElementById('chips');
  var current = 'all';

  function priceLine(p){
    if(!p.fromUSD) return '<span>Rates on request</span>';
    return 'From $' + discountedRate(p.fromUSD) + '<span>/night</span> <span class="price-save">10% off Airbnb</span>';
  }

  /* Build a property card — collection units treated as regular cards */
  function buildPropertyCard(p, globalIdx){
    var card = document.createElement('article');
    card.className = 'cur-card';
    var tags = p.trips.map(function(t){ return '<span class="tag">' + KT.esc(KT.TRIPS[t]) + '</span>'; }).join('');
    var playBadge = p.videoUrl ? '<span class="play-badge"><svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor" aria-hidden="true"><polygon points="2,1 9,5 2,9"/></svg> Video</span>' : '';
    var zoomLabel = p.videoUrl ? 'Watch video' : 'View photos';
    card.innerHTML =
      '<div class="cur-img" role="button" tabindex="0" aria-label="' + (p.videoUrl ? 'Watch video and photos of ' : 'View photos of ') + KT.esc(p.name) + '" data-idx="' + globalIdx + '" style="background-image:' + bgFor(p,0) + ';">' +
        playBadge + '<span class="zoom">' + zoomLabel + '</span></div>' +
      '<div class="cur-body">' +
        '<div><h3>' + KT.esc(p.name) + '</h3>' +
        '<div class="cur-loc">' + KT.esc(p.loc) + ' · ' + KT.esc(p.meta) + '</div></div>' +
        '<div class="tags">' + tags + '</div>' +
        '<div class="cur-price">' + priceLine(p) + '</div>' +
        '<div class="cur-actions">' +
          '<button class="btn btn-accent btn-sm btn-block bk-trigger" data-idx="' + globalIdx + '">Ask about this stay</button>' +
          (p.airbnbUrl ? '<a class="cur-link airbnb-link" target="_blank" rel="noopener" href="' + KT.esc(p.airbnbUrl) + '" data-code="' + KT.esc(p.code) + '">Read reviews on Airbnb</a>' : '') +
        '</div>' +
      '</div>';
    return card;
  }

  function render(){
    if(!grid) return;
    grid.innerHTML = '';
    props.forEach(function(p, idx){
      if(current !== 'all' && p.trips.indexOf(current) === -1) return;
      grid.appendChild(buildPropertyCard(p, idx));
    });
    /* wire lightbox triggers */
    grid.querySelectorAll('.cur-img').forEach(function(el){
      function open(){ openLightbox(parseInt(el.getAttribute('data-idx'),10), 0); }
      el.addEventListener('click', open);
      el.addEventListener('keydown', function(e){ if(e.key==='Enter'||e.key===' '){ e.preventDefault(); open(); } });
    });
    /* wire booking popup triggers */
    grid.querySelectorAll('.bk-trigger').forEach(function(btn){
      btn.addEventListener('click', function(){
        var idx = parseInt(btn.getAttribute('data-idx'),10);
        KT.track('listing_enquiry', { prop_code: props[idx].code, prop_name: props[idx].name });
        openBooking(idx);
      });
    });
    /* wire airbnb links */
    grid.querySelectorAll('.airbnb-link').forEach(function(a){
      a.addEventListener('click', function(){
        KT.track('airbnb_referral', { prop_code: a.getAttribute('data-code') });
      });
    });
  }

  function setChip(val){
    current = val;
    if(chipBox) chipBox.querySelectorAll('.chip').forEach(function(c){
      var active = c.getAttribute('data-val') === val;
      c.classList.toggle('on', active);
      c.setAttribute('aria-pressed', active ? 'true' : 'false');
    });
    render();
  }
  function buildChips(){
    var opts = [['all','All stays']].concat(Object.keys(KT.TRIPS).map(function(k){ return [k, KT.TRIPS[k]]; }));
    opts.forEach(function(o){
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'chip' + (o[0]==='all' ? ' on' : '');
      b.setAttribute('data-val', o[0]);
      b.textContent = o[1];
      b.setAttribute('aria-pressed', o[0]==='all' ? 'true' : 'false');
      b.addEventListener('click', function(){ setChip(o[0]); });
      chipBox.appendChild(b);
    });
  }
  if(chipBox) buildChips();
  render();

  /* ---- Stay Guide ---- */
  var sgGrid = document.getElementById('stayGuideGrid');
  if(sgGrid && KT.STAY_GUIDE){
    KT.STAY_GUIDE.forEach(function(n){
      var card = document.createElement('div');
      card.className = 'sg-card';
      card.innerHTML =
        '<span class="sg-tag">' + KT.esc(n.tag) + '</span>' +
        '<h3>' + KT.esc(n.name) + '</h3>' +
        '<p>' + KT.esc(n.summary) + '</p>' +
        '<span class="sg-vibe">' + KT.esc(n.vibe) + '</span>';
      sgGrid.appendChild(card);
    });
  }

  /* ---- Social Proof quotes ---- */
  var spList = document.getElementById('socialProofList');
  if(spList && KT.SOCIAL_PROOF){
    KT.SOCIAL_PROOF.forEach(function(q){
      var fig = document.createElement('figure');
      fig.className = 'sp-quote';
      fig.innerHTML =
        '<blockquote>\u201c' + KT.esc(q.text) + '\u201d</blockquote>' +
        '<figcaption>' + KT.esc(q.attr) + '</figcaption>';
      spList.appendChild(fig);
    });
  }

  /* ---- Lightbox ---- */
  var lb=document.getElementById('lightbox'), lbImg=document.getElementById('lbImg'),
      lbVideoWrap=document.getElementById('lbVideo'), lbVideoEl=document.getElementById('lbVideoEl'),
      lbName=document.getElementById('lbName'), lbMeta=document.getElementById('lbMeta'),
      lbWa=document.getElementById('lbWa'), cp=0, ci=0, lastFocus=null;

  /* ci === -1 means "video slide" when property has videoUrl */
  function totalSlides(p){ return p.photoCount; }

  function paint(){
    var p=props[cp];
    var isVideo = p.videoUrl && ci===-1;
    lbImg.style.display = isVideo ? 'none' : '';
    lbVideoWrap.style.display = isVideo ? '' : 'none';
    if(isVideo){
      if(lbVideoEl.src !== p.videoUrl){ lbVideoEl.src = p.videoUrl; }
      lbVideoEl.play();
      lbMeta.textContent = p.loc + ' · ' + p.meta + ' · Highlight video';
    } else {
      lbVideoEl.pause();
      var photoIdx = ci;
      lbImg.style.backgroundImage = bgFor(p, photoIdx);
      lbMeta.textContent = p.loc+' · '+p.meta+' · Photo '+(photoIdx+1)+'/'+p.photoCount;
    }
    lbName.textContent=p.name;
    lbWa.href=KT.wa(requestText(p,'wa'));
  }
  function openLightbox(i,j){
    lastFocus=document.activeElement;
    cp=i;
    /* start on video if available, otherwise first photo */
    ci = props[i].videoUrl ? -1 : 0;
    paint();
    lb.classList.add('open');
    document.getElementById('lbClose').focus();
  }
  function closeLb(){
    lbVideoEl.pause();
    lb.classList.remove('open');
    if(lastFocus&&lastFocus.focus) lastFocus.focus();
  }
  function step(d){
    var p=props[cp];
    var total = totalSlides(p) + (p.videoUrl ? 1 : 0); /* +1 for video slot */
    var offset = p.videoUrl ? 1 : 0; /* map ci: -1..n-1 → 0..n */
    var pos = ((ci + offset + d) % total + total) % total;
    ci = pos - offset;
    paint();
  }
  document.getElementById('lbClose').addEventListener('click', closeLb);
  lb.addEventListener('click', function(e){ if(e.target===lb) closeLb(); });
  document.getElementById('lbPrev').addEventListener('click', function(){ step(-1); });
  document.getElementById('lbNext').addEventListener('click', function(){ step(1); });
  document.addEventListener('keydown', function(e){
    if(!lb.classList.contains('open')) return;
    if(e.key==='Escape') closeLb();
    if(e.key==='ArrowRight') step(1);
    if(e.key==='ArrowLeft') step(-1);
  });

  /* ---- Booking popup ---- */
  var bkOverlay=document.getElementById('bkOverlay'), bkClose=document.getElementById('bkClose'),
      bkTitle=document.getElementById('bkTitle'), bkMeta=document.getElementById('bkMeta'),
      bkImg=document.getElementById('bkImg'), bkChannels=document.getElementById('bkChannels'),
      bkNote=document.getElementById('bkNote'), bkLast=null;

  function openBooking(idx){
    var p=props[idx];
    bkLast=document.activeElement;
    bkImg.style.backgroundImage=bgFor(p,0);
    bkTitle.textContent=p.name;
    bkMeta.textContent=p.loc+' · '+p.meta;
    bkChannels.innerHTML='';
    var channels=[
      { name:'Ask on WhatsApp', icon:KT.WA_SVG,
        rateHTML: p.fromUSD ? 'From $'+discountedRate(p.fromUSD)+'/night' : 'Best rate guaranteed',
        save: p.fromUSD ? '10% off Airbnb' : null,
        btnClass:'btn btn-wa btn-sm', btnText:'Chat now',
        href:KT.wa(requestText(p,'wa')), target:'_blank', trackEvent: function(){ KT.track('wa_booking_click', { prop_code: p.code }); } },
      { name:'Book Direct',
        icon:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16" aria-hidden="true"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>',
        rateHTML: p.fromUSD ? 'From $'+discountedRate(p.fromUSD)+'/night' : 'Best rate guaranteed',
        save: p.fromUSD ? '10% off Airbnb' : null,
        btnClass:'btn btn-outline btn-sm', btnText:'Request direct',
        href:directLink(p), target: KT.DIRECT_BOOKING_URL ? '_blank' : '_self', trackEvent: null }
    ];
    if(p.airbnbUrl){
      channels.push({
        name:'Airbnb', icon:'<svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16" aria-hidden="true"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15v-4H7l5-8v4h4l-5 8z"/></svg>',
        rateHTML: p.fromUSD ? 'From $'+p.fromUSD+'/night (full rate)' : 'View listing for rates',
        save:null, btnClass:'btn btn-outline btn-sm', btnText:'View listing',
        href:p.airbnbUrl, target:'_blank',
        trackEvent: function(){ KT.track('airbnb_referral', { prop_code: p.code }); }
      });
    }
    channels.forEach(function(ch){
      var row=document.createElement('div'); row.className='bk-channel';
      row.innerHTML=
        '<div class="bk-channel-info">'+
          '<div class="bk-channel-name">'+ch.icon+' '+KT.esc(ch.name)+(ch.save?' <span class="bk-channel-save">'+KT.esc(ch.save)+'</span>':'')+
          '</div><div class="bk-channel-rate">'+ch.rateHTML+'</div>'+
        '</div>'+
        '<div class="bk-channel-btn"><a class="'+ch.btnClass+'" href="'+KT.esc(ch.href)+'" target="'+ch.target+'" rel="noopener">'+KT.esc(ch.btnText)+'</a></div>';
      if(ch.trackEvent){
        var link = row.querySelector('a');
        if(link) link.addEventListener('click', ch.trackEvent);
      }
      bkChannels.appendChild(row);
    });
    bkNote.innerHTML='Questions? We\'re on WhatsApp. We reply within a few hours.';
    bkOverlay.classList.add('open');
    document.body.style.overflow='hidden';
    if(bkClose) bkClose.focus();
  }
  function closeBooking(){ bkOverlay.classList.remove('open'); document.body.style.overflow=''; if(bkLast&&bkLast.focus) bkLast.focus(); }
  if(bkClose) bkClose.addEventListener('click', closeBooking);
  if(bkOverlay) bkOverlay.addEventListener('click', function(e){ if(e.target===bkOverlay) closeBooking(); });
  document.addEventListener('keydown', function(e){
    if(bkOverlay&&bkOverlay.classList.contains('open')&&e.key==='Escape') closeBooking();
  });

  /* ---- price-save badge style ---- */
  var s=document.createElement('style');
  s.textContent='.price-save{font-size:11px;font-weight:700;color:var(--ok);background:#E7F4EA;padding:2px 8px;border-radius:10px;margin-left:4px;}';
  document.head.appendChild(s);

})();
