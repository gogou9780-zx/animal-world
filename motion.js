// เอฟเฟกต์การเคลื่อนไหวของเว็บ (ใช้คู่กับ motion.css)
// ไม่แก้ลอจิกเดิมของหน้า: ทำงานเสริมจากภายนอกทั้งหมด ถ้าสคริปต์นี้พัง เว็บยังใช้งานได้ตามปกติ
(function () {
  "use strict";
  var doc = document;
  var reduce = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  var finePointer = window.matchMedia && matchMedia("(hover: hover) and (pointer: fine)").matches;

  // ---------- แถบความคืบหน้า + เงาของส่วนหัว ----------
  var progress = doc.createElement("div");
  progress.className = "scroll-progress";
  progress.setAttribute("aria-hidden", "true");
  doc.body.appendChild(progress);
  var header = doc.querySelector(".site-header");
  var ticking = false;

  function onScroll() {
    var max = doc.documentElement.scrollHeight - window.innerHeight;
    var p = max > 0 ? window.scrollY / max : 0;
    progress.style.transform = "scaleX(" + Math.min(1, Math.max(0, p)) + ")";
    if (header) header.classList.toggle("scrolled", window.scrollY > 8);
    ticking = false;
  }
  window.addEventListener("scroll", function () {
    if (!ticking) { ticking = true; requestAnimationFrame(onScroll); }
  }, { passive: true });
  onScroll();

  // ---------- ปรากฏทีละชิ้นเมื่อเลื่อนมาถึง ----------
  if (!reduce && "IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      var n = 0;
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        e.target.style.setProperty("--d", (n++ * 0.08) + "s");
        e.target.classList.add("in");
        io.unobserve(e.target);
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });

    doc.querySelectorAll(
      ".section-head, .toolbar, .animal, .fact-panel, .join .wrap > *, .menu-item, .daily, " +
      ".form-card, .reg-side > *, .more"
    ).forEach(function (el) {
      el.classList.add("will-reveal");
      io.observe(el);
    });
  }

  // ---------- รูปค่อย ๆ ปรากฏเมื่อโหลดเสร็จ ----------
  doc.querySelectorAll(".animal img, .art img, .reg-side img").forEach(function (img) {
    var fig = img.closest("figure");
    function done() {
      img.classList.add("loaded");
      if (fig) fig.classList.add("is-loaded");
    }
    if (img.complete && img.naturalWidth > 0) { if (fig) fig.classList.add("is-loaded"); return; }
    img.classList.add("img-fade");
    img.addEventListener("load", done);
    setTimeout(done, 5000); // กันรูปค้างโปร่งใส ถ้าโหลดไม่สำเร็จ
  });

  // ---------- หน้าสัตว์: การ์ดเด้งกลับมาเมื่อกรอง ----------
  var grid = doc.getElementById("list");
  if (grid && !reduce) {
    new MutationObserver(function (records) {
      var i = 0;
      records.forEach(function (r) {
        var el = r.target;
        if (el.hidden || r.oldValue === null || !el.classList.contains("in")) return;
        el.style.setProperty("--pd", Math.min(i++, 8) * 0.04 + "s");
        el.classList.remove("pop");
        void el.offsetWidth;
        el.classList.add("pop");
      });
    }).observe(grid, { attributes: true, attributeFilter: ["hidden"], attributeOldValue: true, subtree: true });
  }

  // ---------- เอียงการ์ดตามเมาส์ (เฉพาะจอที่มีเมาส์) ----------
  if (!reduce && finePointer) {
    doc.addEventListener("mousemove", function (e) {
      var fig = e.target.closest && e.target.closest(".animal figure");
      if (!fig) return;
      var r = fig.getBoundingClientRect();
      var x = (e.clientX - r.left) / r.width - 0.5;
      var y = (e.clientY - r.top) / r.height - 0.5;
      fig.style.transform = "perspective(700px) rotateY(" + (x * 8).toFixed(2) + "deg) rotateX(" + (-y * 8).toFixed(2) + "deg)";
    });
    doc.addEventListener("mouseout", function (e) {
      var fig = e.target.closest && e.target.closest(".animal figure");
      if (fig && !fig.contains(e.relatedTarget)) fig.style.transform = "";
    });

    // ภาพหน้าแรกขยับตามเมาส์เป็นชั้น ๆ
    var hero = doc.querySelector(".hero");
    var art = doc.querySelector(".art");
    if (hero && art) {
      hero.addEventListener("mousemove", function (e) {
        var r = hero.getBoundingClientRect();
        art.style.setProperty("--mx", (((e.clientX - r.left) / r.width - 0.5) * 2).toFixed(3));
        art.style.setProperty("--my", (((e.clientY - r.top) / r.height - 0.5) * 2).toFixed(3));
      });
      hero.addEventListener("mouseleave", function () {
        art.style.setProperty("--mx", 0);
        art.style.setProperty("--my", 0);
      });
    }
  }

  // ---------- ระลอกคลื่นเมื่อกดปุ่ม ----------
  doc.addEventListener("click", function (e) {
    var b = e.target.closest && e.target.closest(".btn");
    if (!b || b.disabled || reduce) return;
    var r = b.getBoundingClientRect();
    var s = Math.max(r.width, r.height);
    var x = e.detail === 0 ? r.width / 2 : e.clientX - r.left; // กด Enter/Space ให้ออกจากกลางปุ่ม
    var y = e.detail === 0 ? r.height / 2 : e.clientY - r.top;
    var sp = doc.createElement("span");
    sp.className = "ripple";
    sp.style.cssText = "width:" + s + "px;height:" + s + "px;left:" + (x - s / 2) + "px;top:" + (y - s / 2) + "px";
    b.appendChild(sp);
    setTimeout(function () { sp.remove(); }, 650);
  });

  // ---------- "รู้หรือไม่" เปลี่ยนข้อความแล้วเลื่อนขึ้นมาใหม่ ----------
  var nextBtn = doc.getElementById("next-fact");
  var factEl = doc.getElementById("fact");
  if (nextBtn && factEl) {
    nextBtn.addEventListener("click", function () {
      factEl.classList.remove("swap");
      void factEl.offsetWidth;
      factEl.classList.add("swap");
    });
  }

  // ---------- confetti ----------
  function burst(x, y) {
    if (reduce || !Element.prototype.animate) return;
    var colors = ["#ffc94a", "#2d6a4f", "#9fcf8a", "#f5b216", "#1f4d3a"];
    for (var i = 0; i < 36; i++) {
      (function (i) {
        var p = doc.createElement("i");
        p.className = "confetti";
        p.style.left = x + "px";
        p.style.top = y + "px";
        p.style.background = colors[i % colors.length];
        doc.body.appendChild(p);
        var a = Math.random() * Math.PI * 2;
        var d = 80 + Math.random() * 180;
        var anim = p.animate([
          { transform: "translate(0,0) rotate(0deg)", opacity: 1 },
          { transform: "translate(" + Math.cos(a) * d + "px," + (Math.sin(a) * d + 130) + "px) rotate(" + (Math.random() * 720 - 360) + "deg)", opacity: 0 }
        ], { duration: 900 + Math.random() * 700, easing: "cubic-bezier(.2,.7,.3,1)" });
        anim.onfinish = function () { p.remove(); };
      })(i);
    }
  }

  // สมัครสำเร็จ: ฉลอง
  var done = doc.getElementById("done");
  if (done) {
    new MutationObserver(function () {
      if (!done.hidden) burst(window.innerWidth / 2, window.innerHeight * 0.4);
    }).observe(done, { attributes: true, attributeFilter: ["hidden"] });
  }

  // ---------- แบบทดสอบ: แถบความคืบหน้า + คะแนนนับขึ้น ----------
  var qb = doc.getElementById("quiz-box");
  function quizFx() {
    var pr = qb.querySelector(".q-progress");
    if (pr && !qb.querySelector(".q-bar")) {
      var m = pr.textContent.match(/(\d+)\D+(\d+)/);
      if (m) {
        var bar = doc.createElement("div");
        var fill = doc.createElement("span");
        bar.className = "q-bar";
        bar.setAttribute("aria-hidden", "true");
        fill.style.width = "0%";
        bar.appendChild(fill);
        pr.insertAdjacentElement("afterend", bar);
        requestAnimationFrame(function () {
          requestAnimationFrame(function () { fill.style.width = (m[1] / m[2] * 100) + "%"; });
        });
      }
    }

    var sc = qb.querySelector(".score");
    if (sc && !sc.dataset.fx) {
      sc.dataset.fx = "1";
      var mm = sc.textContent.match(/(\d+)\s*\/\s*(\d+)/);
      if (mm && !reduce) {
        var target = +mm[1], total = +mm[2], t0 = null;
        (function step(ts) {
          if (t0 === null) t0 = ts;
          var k = Math.min(1, (ts - t0) / 900);
          sc.textContent = Math.round(target * k) + " / " + total;
          if (k < 1) requestAnimationFrame(step);
        })(performance.now());
        if (total && target / total >= 0.8) {
          setTimeout(function () {
            var r = sc.getBoundingClientRect();
            burst(r.left + r.width / 2, r.top + r.height / 2);
          }, 400);
        }
      }
    }
  }
  if (qb) {
    new MutationObserver(quizFx).observe(qb, { childList: true, subtree: true });
    quizFx();
  }
})();
