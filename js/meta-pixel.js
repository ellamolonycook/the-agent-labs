/* ============================================================
   Meta Pixel
   ------------------------------------------------------------
   Set PIXEL_ID to the dataset ID from Events Manager
   (Datasets > the pixel > the 15-16 digit number under its name).

   Until it is set, this file does nothing at all: no script is
   injected and no request leaves the browser. That makes it safe
   to ship before the ID is available.
   ============================================================ */
(function () {
  'use strict';

  var PIXEL_ID = '1790181495468842';

  if (!PIXEL_ID) return; // not configured yet, stay silent

  // standard Meta bootstrap: queues calls until fbevents.js lands
  !function (f, b, e, v, n, t, s) {
    if (f.fbq) return;
    n = f.fbq = function () {
      n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
    };
    if (!f._fbq) f._fbq = n;
    n.push = n;
    n.loaded = !0;
    n.version = '2.0';
    n.queue = [];
    t = b.createElement(e);
    t.async = !0;
    t.src = v;
    s = b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t, s);
  }(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');

  fbq('init', PIXEL_ID);
  fbq('track', 'PageView');
})();
