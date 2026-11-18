// เสริมหน้า login / register / change-password / เมนูสมาชิก (ใช้คู่กับ auth.css)
// ไม่แตะลอจิกเดิม: แค่ห่อช่องรหัสผ่านด้วยปุ่มดูรหัส เพิ่มแถบความแข็งแรง และเติมอวาตาร์/คำทักทาย
(function () {
  "use strict";
  var doc = document;

  var EYE = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/></svg>';
  var EYE_OFF = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 3l18 18"/><path d="M10.6 5.1A10 10 0 0 1 12 5c6.4 0 10 7 10 7a17 17 0 0 1-3.2 4.1M6.5 6.5A17 17 0 0 0 2 12s3.6 7 10 7a9.7 9.7 0 0 0 4.2-.9"/><path d="M9.9 9.9a3 3 0 0 0 4.2 4.2"/></svg>';

  // ---------- ปุ่มแสดง/ซ่อนรหัสผ่าน ----------
  doc.querySelectorAll('input[type="password"]').forEach(function (inp) {
    var wrap = doc.createElement("div");
    wrap.className = "pw-wrap";
    inp.parentNode.insertBefore(wrap, inp);
    wrap.appendChild(inp);
    inp.classList.add("pw"); // คงไอคอนกุญแจไว้ แม้เปลี่ยนเป็น type=text ชั่วคราว

    var b = doc.createElement("button");
    b.type = "button";
    b.className = "pw-toggle";
    b.setAttribute("aria-label", "แสดงรหัสผ่าน");
    b.setAttribute("aria-pressed", "false");
    b.innerHTML = EYE;
    b.addEventListener("click", function () {
      var show = inp.type === "password";
      inp.type = show ? "text" : "password";
      b.setAttribute("aria-pressed", show ? "true" : "false");
      b.setAttribute("aria-label", show ? "ซ่อนรหัสผ่าน" : "แสดงรหัสผ่าน");
      b.innerHTML = show ? EYE_OFF : EYE;
    });
    wrap.appendChild(b);
  });

  // ---------- แถบความแข็งแรงรหัสผ่าน (เฉพาะหน้าสมัคร) ----------
  var pw = doc.getElementById("password");
  var errEl = doc.getElementById("password-err");
  if (pw && errEl && doc.getElementById("password2")) {
    var meter = doc.createElement("div");
    meter.className = "pw-meter";
    meter.setAttribute("data-level", "0");
    meter.innerHTML = "<span></span><span></span><span></span><span></span><em></em>";
    errEl.parentNode.insertBefore(meter, errEl);
    var label = meter.querySelector("em");
    var names = ["", "อ่อน", "พอใช้", "ดี", "แข็งแรง"];

    pw.addEventListener("input", function () {
      var v = pw.value, level = 0;
      if (v) {
        if (v.length < 8) {
          level = 1;
        } else {
          level = 2;
          if (/[A-Za-z]/.test(v) && /\d/.test(v)) level++;
          if (v.length >= 12 || (/[a-z]/.test(v) && /[A-Z]/.test(v)) || /[^A-Za-z0-9]/.test(v)) level++;
          level = Math.min(4, level);
        }
      }
      meter.setAttribute("data-level", level);
      label.textContent = names[level];
    });
  }

  // ---------- เมนูสมาชิก: คำทักทายตามเวลา + อวาตาร์ตัวอักษรแรก ----------
  var greet = doc.getElementById("greet");
  if (greet) {
    var h = new Date().getHours();
    greet.textContent = h < 12 ? "สวัสดีตอนเช้า" : h < 17 ? "สวัสดีตอนบ่าย" : "สวัสดีตอนเย็น";
  }
  var av = doc.getElementById("avatar");
  var who = doc.getElementById("who");
  if (av && who) {
    var ch = Array.from(who.textContent.trim()).find(function (c) { return /[ก-ฮA-Za-z0-9]/.test(c); });
    av.textContent = (ch || "ส").toUpperCase();
  }
})();
