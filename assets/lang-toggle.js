// ---------- สลับภาษา (ใช้ร่วมกันทุกหน้าในเว็บนี้) ----------
// เลือกจาก 3 ทางตามลำดับ: ที่ผู้ใช้เคยเลือกไว้ -> ภาษาเบราว์เซอร์ -> อังกฤษ
// (อังกฤษเป็นค่าตั้งต้น เพราะโดเมนนี้เปิดรับผู้เข้าชมทั่วโลก ไม่ใช่เฉพาะไทย)
//
// ทุกหน้าที่ใช้สคริปต์นี้ต้องมี:
//   - ปุ่ม <button id="langbtn"> ว่างๆ (ใส่ข้อความเองไม่ได้ สคริปต์นี้ตั้งให้)
//   - เนื้อหาแต่ละภาษาห่อด้วย [data-lang="th"] / [data-lang="en"] คู่กันเสมอ
//     พร้อม CSS: [data-lang]{display:none} html[lang="th"] [data-lang="th"],
//     html[lang="en"] [data-lang="en"]{display:block} (หรือ inline ถ้าเป็น <span>)
//
// ใช้ localStorage key เดียวกัน (saantie-lang) ทุกหน้า ภาษาที่เลือกไว้จึงติดตามผู้ใช้ข้ามหน้าได้ทั้งเว็บ
(function () {
  var KEY = "saantie-lang";
  var btn = document.getElementById("langbtn");
  if (!btn) return;
  function apply(lang) {
    document.documentElement.lang = lang;
    btn.textContent = lang === "th" ? "English" : "ภาษาไทย";
  }
  var saved = null;
  try { saved = localStorage.getItem(KEY); } catch (e) {}
  apply(saved || ((navigator.language || "").toLowerCase().indexOf("th") === 0 ? "th" : "en"));
  btn.addEventListener("click", function () {
    var next = document.documentElement.lang === "th" ? "en" : "th";
    apply(next);
    try { localStorage.setItem(KEY, next); } catch (e) {}
  });
})();
