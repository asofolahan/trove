/* Karibu Trove: join (member) and apply (host) forms. */
(function(){
  var KT = window.KT;
  var form = document.getElementById('leadForm');
  if (!form) return;
  var kind = form.getAttribute('data-form');           // 'member' | 'host'
  var $ = function(id){ return document.getElementById(id); };

  /* ---- member form: apartment list + QR attribution ---- */
  var src = '';
  if (kind === 'member'){
    var sel = $('stayed');
    var opts = ['<option value="">Choose one</option>'];
    KT.properties.forEach(function(p){
      opts.push('<option value="' + KT.esc(p.code) + '">' + KT.esc(p.name) + ' (' + KT.esc(p.loc.split(',')[0]) + ')</option>');
    });
    opts.push('<option value="OTHER">Another Nairobi apartment</option><option value="UNSURE">Not sure</option>');
    sel.innerHTML = opts.join('');

    src = KT.param('src').replace(/[^A-Za-z0-9\-]/g, '').slice(0, 20).toUpperCase();
    var prop = KT.byCode(src);
    if (prop){
      sel.value = prop.code;
      var note = $('srcNote');
      note.textContent = 'Joining from ' + prop.name + ', ' + prop.loc.split(',')[0] + '.';
      note.classList.add('show');
    }
    $('src').value = src;

    var line = $('foundingLine');
    if (line){
      var left = Math.max(KT.FOUNDING_CAP - KT.MEMBERS_JOINED, 0);
      line.textContent = KT.MEMBERS_JOINED >= KT.SHOW_COUNT_FROM
        ? KT.MEMBERS_JOINED + ' members have joined. ' + left + ' Founding Member spots left.'
        : 'Founding Member offer: the $' + KT.CREDIT_USD + ' welcome credit is for the first ' + KT.FOUNDING_CAP + ' members.';
    }
  }

  /* ---- validation ---- */
  function setErr(name, on){
    var f = form.querySelector('[data-field="' + name + '"]');
    if (f) f.classList.toggle('err', !!on);
  }
  function validate(){
    var v = function(n){ return (form.elements[n] && form.elements[n].value || '').trim(); };
    var ok = true, firstBad = null;
    function bad(el){ ok = false; if (!firstBad) firstBad = el; }

    var nameBad = v('name').length < 2;
    setErr('name', nameBad); if (nameBad) bad($('name'));

    var wa = v('whatsapp'), em = v('email');
    var waDigits = wa.replace(/\D/g, '');
    var waBad = wa ? waDigits.length < 8 : (kind === 'host' || !em);
    setErr('whatsapp', waBad); if (waBad) bad($('whatsapp'));

    var emBad = em && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(em);
    setErr('email', emBad); if (emBad) bad($('email'));

    if (kind === 'host'){
      var apBad = v('apartment').length < 2;
      setErr('apartment', apBad); if (apBad) bad($('apartment'));
    }

    var consentBad = !$('consent').checked;
    $('consentRow').classList.toggle('err', consentBad); if (consentBad) bad($('consent'));

    if (firstBad && firstBad.focus) firstBad.focus();
    return ok;
  }
  ['name','whatsapp','email','apartment'].forEach(function(n){
    var el = form.elements[n];
    if (el) el.addEventListener('input', function(){ setErr(n, false); });
  });
  $('consent').addEventListener('change', function(){ $('consentRow').classList.remove('err'); });

  /* ---- build the WhatsApp / email hand-off text ---- */
  function messageFor(d){
    if (kind === 'member'){
      var p = KT.byCode(d.stayed_at);
      var where = p ? p.name + ' (' + p.loc.split(',')[0] + ')' : (d.stayed_at === 'OTHER' ? 'another Nairobi apartment' : 'not sure');
      return 'Hi Karibu Trove! I just joined as a member.\n' +
             'Name: ' + d.name + '\n' +
             (d.whatsapp ? 'WhatsApp: ' + d.whatsapp + '\n' : '') +
             (d.email    ? 'Email: '    + d.email    + '\n' : '') +
             'Stayed at: ' + where + (d.src ? '\nRef: ' + d.src : '') + '\n' +
             (d.trip_type  ? 'Trip type: '  + d.trip_type  + '\n' : '') +
             (d.next_trip  ? 'Back in Nairobi: ' + d.next_trip + '\n' : '') +
             'Please confirm my $' + KT.CREDIT_USD + ' welcome credit.';
    }
    var roles = [];
    if (d.role_collection === 'yes') roles.push('Collection Host');
    if (d.role_welcome === 'yes') roles.push('Welcome Host');
    return 'Hi Karibu Trove! I just applied as a host.\n' +
           'Name: ' + d.name + '\n' +
           (d.whatsapp ? 'WhatsApp: ' + d.whatsapp + '\n' : '') +
           (d.email ? 'Email: ' + d.email + '\n' : '') +
           'Apartment: ' + d.apartment + (d.neighborhood ? ' (' + d.neighborhood + ')' : '') + '\n' +
           (d.listing_url ? 'Listing: ' + d.listing_url + '\n' : '') +
           (d.units ? 'Units: ' + d.units + '\n' : '') +
           (d.rating ? 'Rating: ' + d.rating + '\n' : '') +
           (roles.length ? 'Roles: ' + roles.join(', ') + '\n' : '') +
           'Looking forward to a quick call.';
  }

  /* ---- submit ---- */
  form.addEventListener('submit', function(e){
    e.preventDefault();
    if (!validate()) return;

    var fd = new FormData(form), d = {};
    fd.forEach(function(val, key){ d[key] = typeof val === 'string' ? val.trim() : val; });
    d.consent = 'yes';
    d.type = kind;
    d.submitted_at = new Date().toISOString();
    d.page = window.location.pathname;
    ['role_collection','role_welcome'].forEach(function(k){ if (kind === 'host') d[k] = d[k] ? 'yes' : 'no'; });

    var btn = $('submitBtn');
    btn.disabled = true;
    var spam = !!d.website;                          // honeypot filled: pretend success, send nothing
    delete d.website;

    var work = spam ? Promise.resolve({ stored:true }) : KT.submit(d);
    work.then(function(res){
      var msg = messageFor(d);
      $('okWa').href = KT.wa(msg);
      var mail = 'mailto:' + KT.EMAIL + '?subject=' + encodeURIComponent(kind === 'member' ? 'Karibu Trove membership' : 'Karibu Trove host application') + '&body=' + encodeURIComponent(msg);
      var first = d.name.split(' ')[0];

      if (kind === 'member'){
        if (res.stored){
          $('okTitle').textContent = 'Welcome, ' + first;
          $('okText').textContent = 'You\'re in. Your $' + KT.CREDIT_USD + ' credit is reserved and we\'ll confirm it shortly. Say hello on WhatsApp to get your welcome message sooner.';
          $('okWa').textContent = 'Message us on WhatsApp';
        } else {
          $('okTitle').textContent = 'One last step, ' + first;
          $('okText').textContent = 'Tap below to send your details to us on WhatsApp and we\'ll confirm your $' + KT.CREDIT_USD + ' welcome credit.';
          $('okWa').textContent = 'Send on WhatsApp';
        }
        $('okAlt').innerHTML = 'No WhatsApp? <a href="' + mail + '">Email us instead</a>.';
      } else {
        $('okTitle').textContent = 'Thank you, ' + first;
        $('okText').textContent = res.stored
          ? 'We\'ve got your application and will be in touch on WhatsApp for a short call.'
          : 'Tap below to send your application to us on WhatsApp and we\'ll set up a short call.';
        $('okWa').textContent = res.stored ? 'Say hello on WhatsApp' : 'Send on WhatsApp';
        $('okAlt').innerHTML = 'Prefer email? <a href="' + mail + '">Send it by email</a>.';
      }
      $('formView').style.display = 'none';
      $('successView').classList.add('show');
      var card = form.closest('.form-card');
      if (card && card.scrollIntoView) card.scrollIntoView({ behavior:'smooth', block:'start' });
    });
  });
})();
