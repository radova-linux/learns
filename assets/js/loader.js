// Loads js/learns.bundle.js?v=2 right after the DOM is ready, or sooner on a first interaction
// (css/fonts.css is linked non-blocking in <head>).
(function () {
  "use strict";
  var base = document.currentScript.src;
  var loaded = false;
  var events = ["pointerdown", "keydown", "touchstart", "scroll", "mouseover", "focusin"];

  function add(tag, attrs) {
    var el = document.createElement(tag);
    for (var k in attrs) el[k] = attrs[k];
    (tag === "link" ? document.head : document.body).appendChild(el);
  }

  function load() {
    if (loaded) return;
    loaded = true;
    events.forEach(function (e) { removeEventListener(e, load); });
    // ponytail: fonts.css already loaded non-blocking in <head>
    add("script", { src: new URL("learns.bundle.js?v=2", base).href });
  }

  events.forEach(function (e) { addEventListener(e, load, { once: true, passive: true }); });
  document.addEventListener("click", function (e) {
    var t = !window.__rdvReady && e.target.closest && e.target.closest("button:not([type=submit]), [data-goto-tab]");
    if (t) {
      if (t.hasAttribute("data-goto-tab")) e.preventDefault();
      window.__rdvQ = t;
      load();
    }
  }, true);

  if (document.readyState === "complete" || document.readyState === "interactive") {
    setTimeout(load, 1);
  } else {
    document.addEventListener("DOMContentLoaded", function () { setTimeout(load, 1); }, { once: true });
  }
})();
