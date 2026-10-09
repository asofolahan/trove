/* Karibu Trove: shared behavior. Settings come from config.js. */
(function(){
  var KT = window.KT;
  var PLACEHOLDER_WA = '254700000000';

  KT.WA_SVG = '<svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16" aria-hidden="true"><path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.29-1.39a9.87 9.87 0 0 0 4.7 1.2h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.87 9.87 0 0 0 12.04 2m0 1.67c2.22 0 4.31.87 5.88 2.44a8.26 8.26 0 0 1 2.43 5.8c0 4.56-3.71 8.27-8.28 8.27a8.3 8.3 0 0 1-4.22-1.15l-.3-.18-3.14.82.84-3.06-.2-.32a8.25 8.25 0 0 1-1.27-4.4c0-4.57 3.71-8.22 8.26-8.22M8.53 7.33c-.16 0-.43.06-.66.31s-.86.85-.86 2.07.88 2.4 1 2.57c.13.16 1.71 2.6 4.14 3.65.58.25 1.03.4 1.38.51.58.18 1.11.16 1.53.1.47-.07 1.44-.59 1.64-1.16s.2-1.06.14-1.16-.23-.16-.47-.28-1.44-.71-1.66-.79-.39-.12-.55.12-.63.79-.78.95-.29.18-.53.06-1.03-.38-1.96-1.2c-.72-.65-1.21-1.44-1.35-1.69s-.02-.38.11-.5c.11-.11.25-.29.37-.44s.16-.25.24-.42.04-.31-.02-.44-.55-1.32-.75-1.81c-.2-.48-.4-.41-.55-.42h-.47Z"/></svg>';

  /* ---- helpers ---- */
  KT.wa = function(text){
    return 'https://wa.me/' + KT.WA_NUMBER + (text ? '?text=' + encodeURIComponent(text) : '');
  };
  KT.esc = function(s){
    return String(s == null ? '' : s).replace(/[&<>"']/g, function(c){
      return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];
    });
  };
  KT.param = function(name){
    try { return new URLSearchParams(window.location.search).get(name) || ''; } catch(e){ return ''; }
  };
  KT.byCode = function(code){
    code = (code || '').toUpperCase();
    for (var i = 0; i < KT.properties.length; i++){
      if (KT.properties[i].code.toUpperCase() === code) return KT.properties[i];
    }
    return null;
  };
  function lookup(path){
    return path.split('.').reduce(function(o, k){ return o == null ? o : o[k]; }, KT);
  }
  function fmt(v, kind){
    if (kind === 'usd') return '$' + v;
    if (kind === 'kes') return 'KSH ' + Number(v).toLocaleString('en-US');
    return String(v);
  }

  /* ---- fill config-driven text and links ---- */
  document.querySelectorAll('[data-cfg]').forEach(function(el){
    var v = lookup(el.getAttribute('data-cfg'));
    if (v !== undefined && v !== null) el.textContent = fmt(v, el.getAttribute('data-fmt'));
  });
  document.querySelectorAll('[data-wa]').forEach(function(el){
    el.href = KT.wa(el.getAttribute('data-wa'));
    el.target = '_blank'; el.rel = 'noopener';
  });
  document.querySelectorAll('[data-ig]').forEach(function(el){ el.href = 'https://instagram.com/' + KT.INSTAGRAM; el.target = '_blank'; el.rel = 'noopener'; });
  document.querySelectorAll('[data-tt]').forEach(function(el){ el.href = 'https://tiktok.com/@' + KT.TIKTOK; el.target = '_blank'; el.rel = 'noopener'; });
  document.querySelectorAll('[data-email]').forEach(function(el){
    el.href = 'mailto:' + KT.EMAIL; el.textContent = el.getAttribute('data-email-label') || KT.EMAIL;
  });
  document.querySelectorAll('[data-channel]').forEach(function(el){
    if (KT.WA_CHANNEL_URL){ el.href = KT.WA_CHANNEL_URL; el.target = '_blank'; el.rel = 'noopener'; }
    else el.style.display = 'none';
  });

  /* ---- preview banner: disappears once a real WhatsApp number is set ---- */
  if (KT.WA_NUMBER === PLACEHOLDER_WA){
    var b = document.createElement('div');
    b.className = 'ph-banner';
    b.textContent = 'Preview: placeholder contact details are showing. Set your real WhatsApp number in assets/config.js and this bar disappears.';
    document.body.insertBefore(b, document.body.firstChild);
    if (window.console) console.warn('[Karibu Trove] Placeholder WhatsApp number in assets/config.js');
  }

  /* ---- submit a lead (member sign-up or host application) ---- */
  KT.submit = function(payload){
    if (!KT.FORM_ENDPOINT) return Promise.resolve({ stored:false });
    var body = new URLSearchParams();
    Object.keys(payload).forEach(function(k){ body.append(k, payload[k]); });
    return fetch(KT.FORM_ENDPOINT, { method:'POST', mode:'no-cors', body:body })
      .then(function(){ return { stored:true }; })
      .catch(function(){ return { stored:false }; });
  };

  /* ---- Guest / Owner view toggle (home page only) ---- */
  var btnG = document.getElementById('btnGuest'), btnO = document.getElementById('btnOwner');
  if (btnG && btnO){
    var navCta = document.getElementById('navCta');
    KT.setView = function(view){
      document.querySelectorAll('[data-view]').forEach(function(el){
        el.classList.toggle('active', el.getAttribute('data-view') === view);
      });
      document.body.classList.toggle('mode-owner', view === 'owner');
      btnG.classList.toggle('active', view === 'guest'); btnG.classList.toggle('g', view === 'guest');
      btnO.classList.toggle('active', view === 'owner'); btnO.classList.toggle('o', view === 'owner');
      btnG.setAttribute('aria-selected', view === 'guest'); btnO.setAttribute('aria-selected', view === 'owner');
      if (navCta){
        navCta.textContent = view === 'owner' ? 'Apply as a host' : 'Join free';
        navCta.setAttribute('href', view === 'owner' ? 'host.html' : 'join.html');
      }
    };
    btnG.addEventListener('click', function(){ KT.setView('guest'); });
    btnO.addEventListener('click', function(){ KT.setView('owner'); });
    document.querySelectorAll('[data-setview]').forEach(function(a){
      a.addEventListener('click', function(){ KT.setView(a.getAttribute('data-setview')); });
    });
    var wantOwner = KT.param('view') === 'owner' || window.location.hash === '#hosts';
    KT.setView(wantOwner ? 'owner' : 'guest');
    if (wantOwner && window.location.hash === '#hosts') window.scrollTo(0, 0);
  }
})();
