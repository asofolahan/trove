/* Karibu Trove: analytics loader — reads config.js, injects GTM or GA4. */
(function(){
  var KT = window.KT || {};
  window.dataLayer = window.dataLayer || [];

  /* GTM injection */
  if(KT.GTM_CONTAINER_ID){
    window.dataLayer.push({'gtm.start': new Date().getTime(), event:'gtm.js'});
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtm.js?id=' + KT.GTM_CONTAINER_ID;
    document.head.appendChild(s);
    /* noscript iframe — appended to body after DOM ready */
    document.addEventListener('DOMContentLoaded', function(){
      var ns = document.createElement('noscript');
      var iframe = document.createElement('iframe');
      iframe.src = 'https://www.googletagmanager.com/ns.html?id=' + KT.GTM_CONTAINER_ID;
      iframe.height = '0'; iframe.width = '0';
      iframe.style.cssText = 'display:none;visibility:hidden';
      ns.appendChild(iframe);
      document.body.insertBefore(ns, document.body.firstChild);
    });
  }

  /* GA4 direct (only if no GTM) */
  if(KT.GA_MEASUREMENT_ID && !KT.GTM_CONTAINER_ID){
    var g = document.createElement('script');
    g.async = true;
    g.src = 'https://www.googletagmanager.com/gtag/js?id=' + KT.GA_MEASUREMENT_ID;
    document.head.appendChild(g);
    function gtag(){ window.dataLayer.push(arguments); }
    window.gtag = gtag;
    gtag('js', new Date());
    gtag('config', KT.GA_MEASUREMENT_ID);
  }

  /* Universal track() helper — works with both GTM dataLayer and gtag */
  KT.track = function(eventName, params){
    try {
      if(window.gtag) window.gtag('event', eventName, params || {});
      else window.dataLayer.push(Object.assign({ event: eventName }, params || {}));
    } catch(e){}
  };
})();
