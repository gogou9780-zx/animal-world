// จำสถานะสมาชิกในเบราว์เซอร์ และปรับเมนูด้านบนให้ตรงกับสถานะ (เข้าสู่ระบบ / ยังไม่เข้าสู่ระบบ)
(function () {
  var KEY = "animal_member";
  // ส่วนที่แสดงเฉพาะสมาชิกใช้ data-member-only
  var st = document.createElement("style");
  st.textContent = "[data-member-only][hidden], .nav li[hidden] { display: none !important; }";
  document.head.appendChild(st);
  window.Member = {
    get: function () {
      try { return JSON.parse(localStorage.getItem(KEY)) || null; } catch (e) { return null; }
    },
    set: function (m) {
      try { localStorage.setItem(KEY, JSON.stringify(m)); } catch (e) {}
    },
    clear: function () {
      try { localStorage.removeItem(KEY); } catch (e) {}
      if (window.sb) { try { window.sb.auth.signOut(); } catch (e) {} } // ออกจากระบบ Supabase ด้วย
    }
  };

  // ถ้ายังต้องเปลี่ยนรหัสผ่าน ให้พาไปหน้าเปลี่ยนรหัสก่อนทุกหน้า
  var pending = window.Member.get();
  if (pending && pending.mustChange && !/change-password\.html$/.test(location.pathname)) {
    location.replace("change-password.html");
  }

  document.addEventListener("DOMContentLoaded", function () {
    var m = window.Member.get();
    var nav = document.querySelector(".nav");
    var cta = document.querySelector(".nav-cta");

    // เมนู "สัตว์น่ารู้" และส่วนที่ติดป้าย data-member-only แสดงเฉพาะผู้ที่เข้าสู่ระบบ/สมัครแล้ว
    document.querySelectorAll("[data-member-only]").forEach(function (el) { el.hidden = !m; });
    document.querySelectorAll('.nav a[href="animals.html"]').forEach(function (a) { a.parentNode.hidden = !m; });

    if (m) {
      // ล็อกอินแล้ว: ปุ่มหลักเป็น "เมนูสมาชิก" และซ่อนส่วนชวนสมัคร
      if (cta) { cta.textContent = "เมนูสมาชิก"; cta.setAttribute("href", "member.html"); }
      document.querySelectorAll("[data-guest-only]").forEach(function (el) { el.hidden = true; });
    } else if (nav && cta && !document.querySelector(".nav-login")) {
      // ยังไม่ล็อกอิน: เพิ่มลิงก์ "เข้าสู่ระบบ" ก่อนปุ่มสมัคร
      var li = document.createElement("li");
      var a = document.createElement("a");
      a.className = "nav-login";
      a.href = "login.html";
      a.textContent = "เข้าสู่ระบบ";
      if (/login\.html$/.test(location.pathname)) a.setAttribute("aria-current", "page");
      li.appendChild(a);
      nav.insertBefore(li, cta.parentNode);
    }
  });
})();
