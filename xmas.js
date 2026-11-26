// หิมะตกเบา ๆ อยู่หลังเนื้อหา (ใช้คู่กับ xmas.css) ไม่แตะลอจิกเดิมของหน้า
(function () {
  "use strict";
  if (window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  var doc = document;
  function init() {
    if (doc.querySelector(".xs-snow")) return;
    var n = window.innerWidth < 700 ? 14 : 30;
    var box = doc.createElement("div");
    box.className = "xs-snow";
    box.setAttribute("aria-hidden", "true");
    for (var i = 0; i < n; i++) {
      var f = doc.createElement("i");
      var s = 3 + Math.random() * 6;
      if (i % 9 === 4) f.className = "red"; // เม็ดสีแดงโผล่นาน ๆ ครั้ง
      f.style.cssText = "--x:" + (Math.random() * 100).toFixed(1) + "%;--s:" + s.toFixed(1) + "px;--o:" + (0.35 + Math.random() * 0.45).toFixed(2) +
        ";--t:" + (14 + Math.random() * 16).toFixed(1) + "s;--d:-" + (Math.random() * 30).toFixed(1) + "s;--dx:" + ((Math.random() * 80) - 40).toFixed(0) + "px";
      box.appendChild(f);
    }
    doc.body.appendChild(box);
  }
  if (doc.readyState === "loading") doc.addEventListener("DOMContentLoaded", init); else init();
})();
