// ตกแต่งพื้นที่ว่างซ้าย/ขวาบนจอกว้าง: ลายเท้า ใบไม้ จุดนำทางส่วนต่าง ๆ แถบความคืบหน้า และปุ่มกลับขึ้นบน
// ใช้คู่กับ gutter.css ทำงานเสริมจากภายนอก ไม่แก้ลอจิกเดิมของหน้า ควรโหลดหลัง member.js
(function () {
  "use strict";
  var doc = document;
  var reduce = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;

  function init() {
    if (doc.querySelector(".g-deco")) return;
    var narrow = !!doc.querySelector("main.quiz"); // หน้าแบบทดสอบมีเนื้อหาแคบกว่าหน้าอื่น
    if (narrow) doc.body.classList.add("g-narrow");

    var PAW = '<svg viewBox="0 0 48 48" aria-hidden="true"><ellipse cx="24" cy="31" rx="10" ry="8.5"/><ellipse cx="9" cy="22" rx="4.2" ry="5.6" transform="rotate(-20 9 22)"/><ellipse cx="18" cy="12" rx="4.2" ry="5.8" transform="rotate(-6 18 12)"/><ellipse cx="30" cy="12" rx="4.2" ry="5.8" transform="rotate(6 30 12)"/><ellipse cx="39" cy="22" rx="4.2" ry="5.6" transform="rotate(20 39 22)"/></svg>';
    var LEAF = '<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M10 44C4 28 12 10 36 4c4 20-4 36-26 40z"/><path d="M12 42C18 30 24 20 32 10"/></svg>';

    var deco = doc.createElement("div");
    deco.className = "g-deco g-on";
    deco.setAttribute("aria-hidden", "true");

    // ซ้าย: ทางเดินรอยเท้า (เดินลง สลับซ้ายขวา)
    var left = '<div class="g-l">';
    for (var i = 0; i < 12; i++) {
      var side = i % 2;
      left += '<span class="paw' + (i % 5 === 4 ? " sun" : "") + '" style="top:' + (i * 8.2 + 2) + '%;left:' + (side ? 54 : 14) +
        'px;--r:' + (180 + (side ? 14 : -14)) + 'deg;--d:' + (i * 0.6).toFixed(1) + 's">' + PAW + "</span>";
    }
    left += "</div>";

    // ขวา: ใบไม้ปลิว
    var cfg = [
      { x: 10, s: 30, t: 30, d: 0,   c: "#2d6a4f" },
      { x: 62, s: 24, t: 36, d: -9,  c: "#9fcf8a" },
      { x: 34, s: 34, t: 26, d: -17, c: "#f5b216" },
      { x: 80, s: 22, t: 40, d: -24, c: "#2d6a4f" },
      { x: 48, s: 28, t: 33, d: -5,  c: "#9fcf8a" },
      { x: 18, s: 20, t: 38, d: -28, c: "#f5b216" }
    ];
    var right = '<div class="g-r">';
    cfg.forEach(function (c, n) {
      right += '<span class="leaf" style="left:' + c.x + "px;--s:" + c.s + "px;--t:" + c.t + "s;--d:" + c.d + "s;--c:" + c.c + ";--y:" + (14 + n * 15) + '">' + LEAF + "</span>";
    });
    right += "</div>";
    deco.innerHTML = left + right;
    doc.body.appendChild(deco);

    // ---------- จุดนำทางส่วนต่าง ๆ (เฉพาะหน้าที่มีหลายส่วน) ----------
    var secs = Array.prototype.slice.call(doc.querySelectorAll("main > section, main > .wrap > section")).filter(function (s) {
      return s.querySelector("h1, h2");
    });
    var dots = [];
    if (secs.length >= 3) {
      var nav = doc.createElement("nav");
      nav.className = "g-dots g-on";
      nav.setAttribute("aria-label", "ไปยังส่วนต่าง ๆ ของหน้า");
      var ul = doc.createElement("ul");
      secs.forEach(function (s, n) {
        if (!s.id) s.id = "g-sec-" + (n + 1);
        s.style.scrollMarginTop = "76px";
        var label = s.querySelector("h1, h2").textContent.trim();
        var li = doc.createElement("li");
        var a = doc.createElement("a");
        a.href = "#" + s.id;
        a.setAttribute("aria-label", label);
        var sp = doc.createElement("span");
        sp.textContent = label; // textContent กันข้อความถูกตีความเป็น HTML
        a.appendChild(sp);
        a.addEventListener("click", function (e) {
          e.preventDefault();
          s.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
        });
        li.appendChild(a);
        ul.appendChild(li);
        dots.push({ sec: s, li: li, a: a });
      });
      nav.appendChild(ul);
      doc.body.appendChild(nav);
    }

    // ---------- แถบความคืบหน้า + ปุ่มกลับขึ้นบน ----------
    var sc = doc.createElement("div");
    sc.className = "g-scroll g-on";
    sc.innerHTML =
      '<div class="g-track" aria-hidden="true"><div class="g-fill"></div><div class="g-pin"></div></div>' +
      '<button type="button" class="g-top" aria-label="กลับขึ้นด้านบน"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 19V5M5 12l7-7 7 7"/></svg></button>';
    doc.body.appendChild(sc);
    var fill = sc.querySelector(".g-fill");
    var pin = sc.querySelector(".g-pin");
    var top = sc.querySelector(".g-top");
    var track = sc.querySelector(".g-track");
    top.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
    });

    var ticking = false;
    function update() {
      ticking = false;
      var max = doc.documentElement.scrollHeight - window.innerHeight;
      var p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      fill.style.transform = "scaleY(" + p + ")";
      pin.style.top = (p * track.offsetHeight) + "px";
      top.classList.toggle("show", window.scrollY > 400);

      var cur = -1;
      dots.forEach(function (d, n) {
        var hide = d.sec.hidden || d.sec.offsetParent === null;
        d.li.hidden = hide;
        if (!hide && d.sec.getBoundingClientRect().top <= window.innerHeight * 0.4) cur = n;
      });
      if (window.innerHeight + window.scrollY >= doc.documentElement.scrollHeight - 4) {
        for (var k = dots.length - 1; k >= 0; k--) { if (!dots[k].li.hidden) { cur = k; break; } }
      }
      dots.forEach(function (d, n) {
        if (n === cur) d.a.setAttribute("aria-current", "true"); else d.a.removeAttribute("aria-current");
      });
    }
    function onScroll() { if (!ticking) { ticking = true; requestAnimationFrame(update); } }
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    update();
  }

  if (doc.readyState === "loading") doc.addEventListener("DOMContentLoaded", init); else init();
})();
