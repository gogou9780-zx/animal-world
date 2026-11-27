// Lightweight seasonal atmosphere: decorative only, no application logic touched.
(function () {
  "use strict";
  var doc = document;
  function init() {
    if (doc.querySelector(".xs-snow")) return;
    if (window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    var n = window.innerWidth < 700 ? 18 : 38;
    var snow = doc.createElement("div"); snow.className = "xs-snow"; snow.setAttribute("aria-hidden", "true");
    for (var i = 0; i < n; i++) {
      var f = doc.createElement("i"); var s = 2.5 + Math.random() * 5.5;
      f.style.cssText = "--x:"+(Math.random()*100).toFixed(1)+"%;--s:"+s.toFixed(1)+"px;--o:"+(0.45+Math.random()*.45).toFixed(2)+";--t:"+(17+Math.random()*18).toFixed(1)+"s;--d:-"+(Math.random()*32).toFixed(1)+"s;--dx:"+((Math.random()*90)-45).toFixed(0)+"px";
      snow.appendChild(f);
    }
    doc.body.appendChild(snow);
    var lights=doc.createElement("div");lights.className="xs-lights";lights.setAttribute("aria-hidden","true");
    for(var j=0;j<28;j++){var bulb=doc.createElement("i");bulb.style.animationDelay=(Math.random()*2.5).toFixed(2)+"s";lights.appendChild(bulb)}
    doc.body.appendChild(lights);
  }
  if (doc.readyState === "loading") doc.addEventListener("DOMContentLoaded", init); else init();
})();
