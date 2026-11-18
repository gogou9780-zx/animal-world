// คลิกการ์ดสัตว์ (ภาพ/ชื่อ) เพื่อเปิดหน้าต่างดูข้อมูลสัตว์ ใช้ได้ทั้ง index.html และ animals.html
// การ์ดต้องมี class="animal" และ data-file="ชื่อไฟล์บน Wikimedia Commons"
(function () {
  "use strict";
  var doc = document;
  var COMMONS = "https://commons.wikimedia.org/wiki/Special:FilePath/";

  var css = doc.createElement("style");
  css.textContent =
    ".animal{cursor:pointer}" +
    ".animal figure:focus-visible{outline:3px solid var(--moss,#2d6a4f);outline-offset:4px}" +
    "dialog.ad{border:0;padding:0;border-radius:28px;width:min(860px,calc(100% - 32px));max-height:calc(100dvh - 32px);overflow:auto;" +
      "background:var(--white,#fff);color:var(--ink,#16261d);box-shadow:0 40px 80px -30px rgba(22,38,29,.6);animation:adIn .35s cubic-bezier(.22,1,.36,1)}" +
    "dialog.ad::backdrop{background:rgba(22,38,29,.6)}" +
    "@keyframes adIn{from{opacity:0;transform:translateY(20px) scale(.97)}}" +
    ".ad-body{display:grid;grid-template-columns:minmax(0,5fr) minmax(0,6fr)}" +
    ".ad-body figure{margin:0;background:var(--leaf,#e3f0e0)}" +
    ".ad-body img{display:block;width:100%;height:100%;min-height:320px;object-fit:cover}" +
    ".ad-text{padding:clamp(22px,4vw,40px);display:flex;flex-direction:column;gap:12px}" +
    ".ad-kind{margin:0;align-self:flex-start;padding:4px 14px;border-radius:999px;background:var(--sun,#ffc94a);font-weight:600;font-size:.9rem}" +
    ".ad-text h2{margin:0;font-family:var(--font-head,inherit);font-size:clamp(1.7rem,4vw,2.4rem);color:var(--moss-deep,#1f4d3a)}" +
    ".ad-fact{margin:0;font-size:1.1rem;line-height:1.8}" +
    ".ad-links{margin:0;display:flex;flex-wrap:wrap;gap:6px 18px;font-size:.95rem}" +
    ".ad-nav{margin-top:auto;display:flex;gap:10px;padding-top:12px}" +
    ".ad-nav button{flex:1;min-height:44px;border:1.5px solid var(--line,#d5e2d3);border-radius:999px;background:var(--white,#fff);color:inherit;font:inherit;font-weight:600;cursor:pointer}" +
    ".ad-nav button:hover{border-color:var(--moss,#2d6a4f);background:var(--leaf,#e3f0e0)}" +
    ".ad-close{position:absolute;top:12px;right:12px;z-index:2;width:44px;height:44px;border:0;border-radius:50%;background:rgba(255,255,255,.92);font-size:1.6rem;line-height:1;cursor:pointer;box-shadow:0 6px 14px -6px rgba(22,38,29,.5)}" +
    "@media (max-width:640px){.ad-body{grid-template-columns:1fr}.ad-body img{min-height:0;aspect-ratio:4/3}}";
  doc.head.appendChild(css);

  var dlg = doc.createElement("dialog");
  dlg.className = "ad";
  dlg.setAttribute("aria-labelledby", "ad-title");
  dlg.innerHTML =
    '<button class="ad-close" type="button" aria-label="ปิด">×</button>' +
    '<div class="ad-body"><figure><img alt="" width="500" height="625"></figure>' +
    '<div class="ad-text"><p class="ad-kind"></p><h2 id="ad-title"></h2><p class="ad-fact"></p>' +
    '<p class="ad-links"><a class="ad-wiki" target="_blank" rel="noopener">อ่านเพิ่มเติมใน Wikipedia</a>' +
    '<a class="ad-credit" target="_blank" rel="noopener">ที่มาของภาพถ่าย</a></p>' +
    '<div class="ad-nav"><button type="button" class="ad-prev">← ก่อนหน้า</button><button type="button" class="ad-next">ถัดไป →</button></div>' +
    '</div></div>';
  doc.body.appendChild(dlg);

  var img = dlg.querySelector("img");
  var current = null;

  function visibleCards() {
    return Array.prototype.filter.call(doc.querySelectorAll(".animal[data-file]"), function (c) { return !c.hidden; });
  }

  function show(card) {
    current = card;
    var name = card.querySelector("h3").textContent;
    var file = card.dataset.file;
    var cardImg = card.querySelector("img");
    var fallback = (cardImg && cardImg.dataset.fallback) || "assets/placeholder.svg";

    img.removeAttribute("data-used");
    img.onerror = function () { if (img.dataset.used) return; img.dataset.used = "1"; img.src = fallback; };
    img.src = COMMONS + file + "?width=1000";
    img.alt = "ภาพถ่าย" + name;

    dlg.querySelector(".ad-kind").textContent = (card.querySelector(".kind") || {}).textContent || "";
    dlg.querySelector("h2").textContent = name;
    dlg.querySelector(".ad-fact").textContent = (card.querySelector("p:not(.kind)") || {}).textContent || "";
    dlg.querySelector(".ad-wiki").href = "https://th.wikipedia.org/wiki/Special:Search?search=" + encodeURIComponent(name);
    dlg.querySelector(".ad-credit").href = "https://commons.wikimedia.org/wiki/File:" + file;

    var many = visibleCards().length > 1;
    dlg.querySelector(".ad-nav").hidden = !many;
    if (!dlg.open) dlg.showModal();
  }

  function step(d) {
    var list = visibleCards();
    var i = list.indexOf(current);
    if (i < 0 || !list.length) return;
    show(list[(i + d + list.length) % list.length]);
  }

  dlg.querySelector(".ad-close").addEventListener("click", function () { dlg.close(); });
  dlg.querySelector(".ad-prev").addEventListener("click", function () { step(-1); });
  dlg.querySelector(".ad-next").addEventListener("click", function () { step(1); });
  dlg.addEventListener("click", function (e) { if (e.target === dlg) dlg.close(); }); // คลิกพื้นหลังเพื่อปิด
  dlg.addEventListener("keydown", function (e) {
    if (e.key === "ArrowLeft") step(-1);
    if (e.key === "ArrowRight") step(1);
  });

  // คลิกที่การ์ดใดก็ได้ (ใช้ delegation เพราะหน้าสัตว์น่ารู้สร้างการ์ดด้วย JS)
  doc.addEventListener("click", function (e) {
    var a = e.target.closest && e.target.closest(".animal[data-file]");
    if (a) show(a);
  });

  // ให้ผู้ใช้คีย์บอร์ดเปิดได้ด้วย Tab + Enter/Space
  function prep() {
    doc.querySelectorAll(".animal[data-file] figure").forEach(function (f) {
      if (f.dataset.ad) return;
      f.dataset.ad = "1";
      var name = f.parentNode.querySelector("h3").textContent;
      f.tabIndex = 0;
      f.setAttribute("role", "button");
      f.setAttribute("aria-label", "ดูข้อมูล" + name);
      f.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); show(f.parentNode); }
      });
    });
  }
  prep();
})();
