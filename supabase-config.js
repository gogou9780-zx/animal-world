// ตั้งค่าการเชื่อมต่อ Supabase (ใช้ร่วมกันทุกหน้าที่ต้องล็อกอิน)
// หาค่าได้ที่ Supabase Dashboard > Project Settings > API
//   SUPABASE_URL      = Project URL
//   SUPABASE_ANON_KEY = anon / publishable key (ใส่ในหน้าเว็บได้ ปลอดภัยเพราะมี RLS คุมอยู่)
// ห้ามใส่ service_role key ในไฟล์นี้เด็ดขาด
(function () {
  var SUPABASE_URL = "https://zpmrbsetvaocnqguxsej.supabase.co";
  var SUPABASE_ANON_KEY = "sb_publishable_xnl-sCFvzfNWr4TSkRlRJw_6Nfj4mJr";

  window.SUPABASE_READY = !SUPABASE_URL.startsWith("PASTE_") && !SUPABASE_ANON_KEY.startsWith("PASTE_");
  if (window.SUPABASE_READY && window.supabase) {
    window.sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  }
})();
