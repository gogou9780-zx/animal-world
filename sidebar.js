// แถบเมนูด้านข้าง: ปุ่มมุมขวาบนของส่วนหัว เปิดแล้วเลื่อนออกมาจากขวา ใช้ได้ทุกหน้า (ใช้คู่กับ sidebar.css)
// ต้องโหลดหลัง member.js เพราะใช้ window.Member ตรวจสถานะสมาชิก
(function () {
  "use strict";
  var doc = document;

  function icon(d) {
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + d + "</svg>";
  }
  var I = {
    menu: icon('<path d="M4 7h16M4 12h16M4 17h16"/>'),
    home: icon('<path d="M3 11l9-8 9 8"/><path d="M5 10v10h5v-6h4v6h5V10"/>'),
    paw: icon('<circle cx="5.5" cy="11" r="1.6"/><circle cx="9.5" cy="6.5" r="1.6"/><circle cx="14.5" cy="6.5" r="1.6"/><circle cx="18.5" cy="11" r="1.6"/><path d="M12 11.5c-3 0-5.5 2.8-5.5 5.2 0 1.7 1.3 2.8 2.8 2.8 1 0 1.8-.5 2.7-.5s1.7.5 2.7.5c1.5 0 2.8-1.1 2.8-2.8 0-2.4-2.5-5.2-5.5-5.2z"/>'),
    quiz: icon('<circle cx="12" cy="12" r="9"/><path d="M9.5 9.5a2.6 2.6 0 0 1 5 1c0 1.8-2.5 2.2-2.5 4"/><path d="M12 17.5h.01"/>'),
    user: icon('<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 4-7 8-7s8 3 8 7"/>'),
    lock: icon('<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>'),
    plus: icon('<path d="M12 5v14M5 12h14"/>')
  };

  var facts = [
    "ปลาหมึกยักษ์มีหัวใจ 3 ดวง",
    "ยีราฟมีกระดูกคอ 7 ข้อ เท่ากับคนเรา เพียงแต่แต่ละข้อยาวกว่ามาก",
    "ฮัมมิงเบิร์ดเป็นนกที่บินถอยหลังได้",
    "นากทะเลนอนหลับโดยจับมือกันไว้ เพื่อไม่ให้ลอยห่างจากกัน",
    "วอมแบตขับถ่ายเป็นก้อนทรงลูกบาศก์",
    "โคอาลานอนวันละประมาณ 18 ถึง 22 ชั่วโมง"
  ];

  function init() {
    var header = doc.querySelector(".site-header .wrap");
    if (!header) return;
    var m = window.Member && window.Member.get();
    var path = location.pathname.split("/").pop() || "index.html";

    // ปุ่มเปิดที่มุมขวาบน
    var btn = doc.createElement("button");
    btn.type = "button";
    btn.className = "sb-toggle";
    btn.setAttribute("aria-label", "เปิดเมนูด้านข้าง");
    btn.setAttribute("aria-expanded", "false");
    btn.setAttribute("aria-controls", "sb-panel");
    btn.innerHTML = I.menu;
    header.appendChild(btn);

    function link(href, label, ic) {
      return '<li><a href="' + href + '"' + (path === href ? ' aria-current="page"' : "") + ">" + ic + "<span>" + label + "</span></a></li>";
    }
    var links = link("index.html", "หน้าแรก", I.home);
    if (m) {
      links += link("animals.html", "สัตว์น่ารู้", I.paw) + link("quiz.html", "แบบทดสอบสัตว์", I.quiz) +
        link("member.html", "เมนูสมาชิก", I.user) + link("change-password.html", "เปลี่ยนรหัสผ่าน", I.lock);
    } else {
      links += link("login.html", "เข้าสู่ระบบ", I.user) + link("register.html", "สมัครสมาชิกฟรี", I.plus);
    }

    var overlay = doc.createElement("div");
    overlay.className = "sb-overlay";
    var panel = doc.createElement("aside");
    panel.className = "sb-panel";
    panel.id = "sb-panel";
    panel.setAttribute("role", "dialog");
    panel.setAttribute("aria-label", "เมนูด้านข้าง");
    panel.innerHTML =
      '<div class="sb-top"><strong>เมนู</strong><button type="button" class="sb-close" aria-label="ปิดเมนู">×</button></div>' +
      '<div class="sb-user" hidden><div class="sb-ava" aria-hidden="true"></div><div><p class="sb-name"></p><p class="sb-id"></p></div></div>' +
      '<p class="sb-guest" hidden>เข้าสู่ระบบหรือสมัครสมาชิกเพื่อดูสัตว์ทั้งหมดและทำแบบทดสอบ</p>' +
      '<nav aria-label="เมนูด้านข้าง"><ul class="sb-links">' + links + "</ul></nav>" +
      '<div class="sb-fact"><h2>รู้หรือไม่?</h2><p></p><button type="button">สุ่มเรื่องใหม่</button></div>' +
      '<button type="button" class="sb-out" hidden>ออกจากระบบ</button>';
    doc.body.appendChild(overlay);
    doc.body.appendChild(panel);

    // ข้อมูลสมาชิก (ใช้ textContent กันชื่อถูกตีความเป็น HTML)
    if (m) {
      var u = panel.querySelector(".sb-user");
      u.hidden = false;
      panel.querySelector(".sb-name").textContent = "คุณ" + (m.name || "");
      panel.querySelector(".sb-id").textContent = m.memberId ? "รหัสสมาชิก " + m.memberId : "";
      var ch = Array.from((m.name || "").trim()).find(function (c) { return /[ก-ฮA-Za-z0-9]/.test(c); });
      panel.querySelector(".sb-ava").textContent = (ch || "ส").toUpperCase();
      var out = panel.querySelector(".sb-out");
      out.hidden = false;
      out.addEventListener("click", function () { window.Member.clear(); location.href = "index.html"; });
    } else {
      panel.querySelector(".sb-guest").hidden = false;
    }

    // เรื่องน่ารู้
    var factP = panel.querySelector(".sb-fact p");
    var fi = Math.floor(Date.now() / 86400000) % facts.length;
    factP.textContent = facts[fi];
    panel.querySelector(".sb-fact button").addEventListener("click", function () {
      var n;
      do { n = Math.floor(Math.random() * facts.length); } while (n === fi);
      fi = n;
      factP.textContent = facts[fi];
    });

    // เปิด/ปิด
    var closeBtn = panel.querySelector(".sb-close");
    function setOpen(open) {
      doc.body.classList.toggle("sb-open", open);
      doc.body.classList.toggle("sb-lock", open);
      btn.setAttribute("aria-expanded", open ? "true" : "false");
      if (open) { setTimeout(function () { closeBtn.focus(); }, 50); } else { btn.focus(); }
    }
    function isOpen() { return doc.body.classList.contains("sb-open"); }
    btn.addEventListener("click", function () { setOpen(!isOpen()); });
    closeBtn.addEventListener("click", function () { setOpen(false); });
    overlay.addEventListener("click", function () { setOpen(false); });
    panel.addEventListener("click", function (e) {
      if (e.target.closest && e.target.closest(".sb-links a")) doc.body.classList.remove("sb-open", "sb-lock");
    });
    doc.addEventListener("keydown", function (e) {
      if (!isOpen()) return;
      if (e.key === "Escape") { setOpen(false); return; }
      if (e.key === "Tab") { // วนโฟกัสอยู่ในแถบ
        var f = panel.querySelectorAll("a[href], button:not([hidden])");
        f = Array.prototype.filter.call(f, function (x) { return x.offsetParent !== null; });
        if (!f.length) return;
        var first = f[0], last = f[f.length - 1];
        if (e.shiftKey && doc.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && doc.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    });
  }

  if (doc.readyState === "loading") doc.addEventListener("DOMContentLoaded", init); else init();
})();
