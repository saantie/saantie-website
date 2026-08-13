# saantie.com

เว็บไซต์หลักของ Saantie — หน้าแนะนำตัวและรวมลิงก์แอปที่พัฒนาขึ้น
โฮสต์บน **Cloudflare Pages** (โดเมนซื้อไว้ที่ Cloudflare อยู่แล้ว จึงไม่ต้องตั้ง DNS เอง)

## โครงสร้าง

```
index.html            → saantie.com          หน้าหลัก (2 ภาษา สลับด้วยปุ่มมุมขวาบน)
8hrs/privacy.html     → saantie.com/8hrs/privacy    นโยบายความเป็นส่วนตัวของ 8Hrs
assets/8hrs-icon.png  → ไอคอนแอปบนการ์ด
```

> **ยังไม่มี `8hrs/index.html`** (หน้า landing page ของโปรแกรม) — ร่างเนื้อหาอยู่ที่
> `F:\posture_monitor\posture_monitor\LANDING_PAGE_DRAFT.md` รอสร้างทีหลัง
> ตอนนี้การ์ดในหน้าหลักจึงยังไม่ลิงก์ไป `/8hrs/` มีแต่ลิงก์ไปหน้านโยบาย

## ⚠️ URL ที่ห้ามเปลี่ยนหลังส่ง Microsoft Store

```
https://saantie.com/8hrs/privacy
```

URL นี้ถูก **ฝังไว้ในโค้ดโปรแกรม** (`PRIVACY_POLICY_URL` ใน `posture_monitor.py`)
และ **ต้องกรอกใน Partner Center ตอนส่งแอป** ถ้าเปลี่ยนหลังขึ้น Store แล้ว
ต้องส่งอัปเดตแอปใหม่และรอ certification อีกรอบ

`8hrs/privacy.html` จะถูกเสิร์ฟที่ `/8hrs/privacy` โดยอัตโนมัติ เพราะ Cloudflare Pages
ตัดนามสกุล `.html` ให้เอง — **ห้ามเปลี่ยนชื่อหรือย้ายไฟล์นี้**

## วิธี deploy ครั้งแรก

1. ~~สร้าง repo ใหม่บน GitHub~~ ✅ สร้างแล้ว: `github.com/saantie/saantie-website`
2. Cloudflare Dashboard → **Workers & Pages** → Create → **Pages** → Connect to Git
3. เลือก repo นี้ · Build command: **เว้นว่าง** · Build output directory: **`/`**
   (เป็นเว็บ static ล้วน ไม่ต้อง build)
4. หลัง deploy เสร็จ → **Custom domains** → เพิ่ม `saantie.com` และ `www.saantie.com`
5. เลือกให้ `saantie.com` เป็นตัวหลัก แล้วตั้ง `www` ให้ redirect มา (Cloudflare ทำให้ได้ในหน้า Redirect Rules)

หลังจากนี้ push ขึ้น GitHub เมื่อไหร่ Cloudflare จะ deploy ให้อัตโนมัติ

## สิ่งที่ **ไม่ได้** อยู่ในเว็บนี้ โดยตั้งใจ

หน้าจัดการสมาชิกโปร (`index.html`, `app.js`) ยังอยู่ที่ repo เดิม
`github.com/saantie/Document-pro_emails-for-Posture-monitor-program` และเสิร์ฟผ่าน GitHub Pages ตามเดิม

**เหตุผล**: เป็นเครื่องมือหลังบ้าน ไม่ควรอยู่โดเมนเดียวกับหน้าที่ลูกค้าเข้า
(ความปลอดภัยจริงอยู่ที่ Firestore Rules ซึ่งล็อกไว้แล้ว แต่ไม่มีเหตุผลที่จะเอา URL ไปวางให้เดาง่าย)

ถ้าวันหนึ่งย้ายหน้าแอดมินมาโดเมนนี้ **ต้องไปเพิ่มโดเมนใหม่ที่ Firebase Console →
Authentication → Settings → Authorized domains ก่อน** ไม่งั้นปุ่มล็อกอินด้วย Google จะถูกปฏิเสธ

## หมายเหตุการแก้ไข

- หน้าหลักเป็น HTML ล้วน ไม่มี framework ไม่มี build step แก้ไฟล์แล้ว push ได้เลย
- ปุ่มสลับภาษาใช้ `document.documentElement.lang` คุม CSS `[data-lang]`
  เพิ่มเนื้อหาใหม่ต้องใส่ทั้ง `data-lang="th"` และ `data-lang="en"` ให้ครบคู่เสมอ
- ค่าตั้งต้นเป็น **อังกฤษ** (เว้นแต่ภาษาเบราว์เซอร์เป็นไทย) เพราะเปิดรับผู้เข้าชมทั่วโลก
  และจำสิ่งที่ผู้ใช้เลือกไว้ใน localStorage
- การ์ดแอปใน `.apps` เป็น grid — เพิ่มแอปตัวต่อไปโดยคัดลอกบล็อก `<div class="app">` ได้เลย
