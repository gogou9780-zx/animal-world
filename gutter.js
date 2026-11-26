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

    var SNOW = '<svg viewBox="0 0 48 48" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><path d="M24 4v40M7 14l34 20M41 14L7 34"/><path d="M19 8l5 5 5-5M19 40l5-5 5 5"/></g></svg>';
    var SPRIG = '<svg viewBox="0 0 48 48" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><path d="M24 44V6"/><path d="M24 16L12 8M24 16l12-8M24 26L10 18M24 26l14-8M24 36L12 28M24 36l12-8"/></g></svg>';
    var BERRY = '<svg viewBox="0 0 48 48" aria-hidden="true"><circle cx="16" cy="29" r="7"/><circle cx="31" cy="25" r="7"/><circle cx="23" cy="13" r="7"/></svg>';

    var deco = doc.createElement("div");
    deco.className = "g-deco g-on";
    deco.setAttribute("aria-hidden", "true");

    // ซ้าย: ลูกบอลห้อยจากแถบหัว (สีแดง เขียว ทราย)
    var strings = [
      { x: 22, len: 15, c: "#B22222", bs: 30, sw: 6.2, d: 0,    sm: "#2F4F3E" },
      { x: 58, len: 31, c: "#2F4F3E", bs: 34, sw: 7.4, d: -2.1, sm: "#B22222" },
      { x: 92, len: 22, c: "#E8E1D7", bs: 28, sw: 5.6, d: -3.7, sm: "#8A7F72" },
      { x: 40, len: 52, c: "#B22222", bs: 26, sw: 6.8, d: -1.2, sm: "#E8E1D7" }
    ];
    var left = '<div class="g-l">';
    strings.forEach(function (o) {
      left += '<span class="orn" style="left:' + o.x + "px;--len:" + o.len + "vh;--c:" + o.c + ";--bs:" + o.bs + "px;--sw:" + o.sw + "s;--d:" + o.d + 's">' +
        '<i class="bau sm" style="--c:' + o.sm + '"></i><i class="bau"></i></span>';
    });
    left += "</div>";

    // ขวา: เกล็ดหิมะ กิ่งสน เบอร์รี ปลิวลงช้า ๆ
    var cfg = [
      { x: 10, s: 30, t: 30, d: 0,   c: "#8A7F72", g: SNOW },
      { x: 62, s: 26, t: 36, d: -9,  c: "#2F4F3E", g: SPRIG },
      { x: 34, s: 24, t: 26, d: -17, c: "#B22222", g: BERRY },
      { x: 80, s: 22, t: 40, d: -24, c: "#8A7F72", g: SNOW },
      { x: 48, s: 28, t: 33, d: -5,  c: "#2F4F3E", g: SPRIG },
      { x: 18, s: 22, t: 38, d: -28, c: "#B22222", g: BERRY }
    ];
    var right = '<div class="g-r">';
    cfg.forEach(function (c, n) {
      right += '<span class="leaf" style="left:' + c.x + "px;--s:" + c.s + "px;--t:" + c.t + "s;--d:" + c.d + "s;--c:" + c.c + ";--y:" + (14 + n * 15) + '">' + c.g + "</span>";
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
