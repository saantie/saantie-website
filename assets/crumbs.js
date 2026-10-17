// ---------- แถบบอกตำแหน่งหน้า (breadcrumb) ใช้ร่วมกันทุกหน้า ----------
// หน้าแรก › 8Hrs ▾ › คู่มือการใช้งาน ▾
//   - กดชื่อ = ย้อนไปหน้านั้น, กด ▾ = ข้ามไปหน้าอื่นในระดับเดียวกัน
//   - หน้าที่มีหน้าย่อย มีตัวเลือก "ไปที่ ▾" ต่อท้าย
//
// ทุกหน้าต้องมี:
//   <link rel="stylesheet" href="/assets/crumbs.css">  และ  <nav id="crumbs"></nav>  (ว่างๆ สคริปต์เติมเอง)
//   <script src="/assets/crumbs.js"></script>  หลัง lang-toggle.js
//
// ⚠️ เพิ่มหน้าใหม่ในเว็บ = เพิ่มใน SITE ด้านล่างด้วย ไม่งั้นหน้านั้นจะไม่มีแถบนี้และไม่อยู่ในเมนู
// ข้อความสร้างตามภาษาปัจจุบันเอง (ไม่ใช้ [data-lang] ของหน้า เพราะแต่ละหน้ามีกฎ CSS ภาษาไม่เหมือนกัน
// เช่น privacy.html ไม่มีกฎ span แบบ inline) และวาดใหม่เมื่อ <html lang> เปลี่ยน
(function () {
  var SITE = {
    path: "/", th: "หน้าแรก", en: "Home",
    children: [
      {
        path: "/8hrs", th: "8Hrs", en: "8Hrs", full: { th: "8Hrs Posture Monitor", en: "8Hrs Posture Monitor" },
        children: [
          { path: "/8hrs/guide", th: "คู่มือการใช้งาน", en: "Guide" },
          { path: "/8hrs/privacy", th: "นโยบายความเป็นส่วนตัว", en: "Privacy policy" }
        ]
      },
      {
        path: "/pms", th: "Saantie PMS", en: "Saantie PMS", full: { th: "Saantie PMS (จัดการที่พัก)", en: "Saantie PMS (bookings)" },
        children: [
          { path: "/pms/import", th: "นำเข้าข้อมูลการจอง", en: "Import bookings" }
        ]
      }
    ]
  };

  var nav = document.getElementById("crumbs");
  if (!nav) return;

  // Cloudflare Pages ตัด .html ให้ แต่เปิดไฟล์ตรงๆ (ทดสอบในเครื่อง) จะมี .html / index.html
  function norm(p) {
    p = p.replace(/\/index(\.html)?$/, "/").replace(/\.html$/, "");
    return p.length > 1 ? p.replace(/\/+$/, "") : "/";
  }
  var here = norm(location.pathname);

  // หาเส้นทางจากหน้าแรกถึงหน้านี้ [{node, parent}]
  function find(node, parent, trail) {
    var t = trail.concat([{ node: node, parent: parent }]);
    if (node.path === here) return t;
    var kids = node.children || [];
    for (var i = 0; i < kids.length; i++) {
      var r = find(kids[i], node, t);
      if (r) return r;
    }
    return null;
  }
  var trail = find(SITE, null, []);
  if (!trail) { nav.hidden = true; return; }

  function lang() { return document.documentElement.lang === "en" ? "en" : "th"; }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function label(n, long) { var L = lang(); return long && n.full ? n.full[L] : n[L]; }

  function menu(items, title) {
    return '<details class="crumb-menu"><summary aria-label="' + esc(title) + '" title="' + esc(title) + '">' +
      '<span class="crumb-caret" aria-hidden="true"></span></summary><ul>' +
      items.map(function (n) {
        var cur = n.path === here;
        return "<li>" + (cur
          ? '<span class="crumb-cur" aria-current="page">' + esc(label(n, true)) + "</span>"
          : '<a href="' + n.path + '">' + esc(label(n, true)) + "</a>") + "</li>";
      }).join("") + "</ul></details>";
  }

  function render() {
    var L = lang();
    var html = [];
    trail.forEach(function (step, i) {
      var n = step.node, last = i === trail.length - 1;
      var part = last
        ? '<span class="crumb-cur" aria-current="page">' + esc(label(n)) + "</span>"
        : '<a href="' + n.path + '">' + esc(label(n)) + "</a>";
      // ▾ = หน้าอื่นในระดับเดียวกัน (มีเฉพาะเมื่อมีมากกว่าหนึ่งหน้า)
      var sibs = step.parent ? step.parent.children : [];
      if (sibs.length > 1) part += menu(sibs, L === "th" ? "หน้าอื่นในหมวดเดียวกัน" : "Other pages at this level");
      html.push('<li class="crumb">' + part + "</li>");
    });
    var kids = trail[trail.length - 1].node.children || [];
    if (kids.length) {
      html.push('<li class="crumb crumb-go"><span class="crumb-go-label">' + (L === "th" ? "ไปที่" : "Go to") + "</span>" +
        menu(kids, L === "th" ? "หน้าย่อยของหน้านี้" : "Pages under this one") + "</li>");
    }
    nav.className = "crumbs";
    nav.setAttribute("aria-label", L === "th" ? "ตำแหน่งของหน้านี้ในเว็บไซต์" : "Where you are on this site");
    nav.innerHTML = "<ol>" + html.join("") + "</ol>";
  }

  render();
  new MutationObserver(render).observe(document.documentElement, { attributes: true, attributeFilter: ["lang"] });

  // เปิดได้ทีละเมนู · กดที่อื่นหรือ Esc = ปิด
  nav.addEventListener("toggle", function (e) {
    if (!e.target.open) return;
    nav.querySelectorAll("details[open]").forEach(function (d) { if (d !== e.target) d.open = false; });
    // เมนูต้องไม่ล้นขอบจอ (จอมือถือแคบ แถบนี้อาจตัดขึ้นบรรทัดใหม่จนเมนูอยู่ชิดขวา)
    var ul = e.target.querySelector("ul");
    ul.style.left = ""; ul.style.right = "";
    var r = ul.getBoundingClientRect();
    if (r.right > document.documentElement.clientWidth - 8) {
      ul.style.left = "auto"; ul.style.right = "0";
      if (ul.getBoundingClientRect().left < 8) { ul.style.right = "auto"; ul.style.left = (8 - e.target.getBoundingClientRect().left) + "px"; }
    }
  }, true);
  document.addEventListener("click", function (e) {
    if (!nav.contains(e.target)) nav.querySelectorAll("details[open]").forEach(function (d) { d.open = false; });
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") nav.querySelectorAll("details[open]").forEach(function (d) { d.open = false; d.querySelector("summary").focus(); });
  });
})();
