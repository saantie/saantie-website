# CLAUDE.md

คำแนะนำสำหรับ Claude Code (หรือใครก็ตามที่มาแก้เว็บนี้) — อ่านก่อนแก้ไฟล์ใดๆ เสมอ

## ภาพรวม

เว็บไซต์หลักของ **Saantie** — นักพัฒนาอิสระ หน้าแนะนำตัว + หน้ารวมลิงก์แอป/โปรแกรมที่พัฒนาขึ้น
แต่ละแอปมี **หน้า landing page + นโยบายความเป็นส่วนตัวของตัวเอง** อยู่ในโดเมนเดียวกัน

เป็นเว็บ **static ล้วน ไม่มี build step** — HTML/CSS/JS ธรรมดา แก้ไฟล์แล้ว push ได้เลย
ตั้งใจให้เป็นแบบนี้ต่อไปตราบใดที่จำนวนหน้ายังไม่เยอะมาก (ดูหัวข้อ "จะโตแล้วทำยังไง" ท้ายไฟล์)

## บริการภายนอกที่เชื่อมโยงอยู่ (เช็คก่อนแก้ ถ้าจะแตะส่วนที่เกี่ยวข้อง)

| ส่วน | บริการ | หมายเหตุ |
|---|---|---|
| Hosting + auto-deploy | **Cloudflare Pages** | ต่อกับ repo นี้โดยตรง push เข้า `main` แล้ว deploy ให้อัตโนมัติ ไม่ต้องสั่งอะไรเพิ่ม |
| Repo | `github.com/saantie/saantie-website` | `git remote -v` ยืนยันแล้ว |
| โดเมน + DNS | **Cloudflare** (ซื้อโดเมนที่นี่ด้วย) | `saantie.com` เป็นโดเมนหลัก, `www.saantie.com` redirect มาหา (มีไฟล์ `CNAME` เดิมจาก GitHub Pages หลงเหลืออยู่ — ไม่มีผลอะไรตราบใดที่ยังใช้ Cloudflare Pages เป็นตัว serve จริง) |
| รับอีเมล | **Cloudflare Email Routing** | `contact@saantie.com` ยืนยันแล้วว่า MX ชี้มาที่ Cloudflare จริง (`route1/2/3.mx.cloudflare.net`) |
| ส่งอีเมลจากฟอร์มติดต่อ | **Firebase Cloud Functions** (`contactForm`) + **Gmail SMTP** (nodemailer) | โค้ดอยู่ที่ `F:\posture_monitor\posture_monitor\functions\index.js` โปรเจกต์ `posture-monitor-program` เดียวกับ 8Hrs — ใช้บัญชี Gmail ที่มีอยู่แล้วส่ง ไม่ต้องสมัครบริการใหม่ — ยังไม่ได้ deploy/ตั้ง secret ดูหัวข้อ "งานค้าง" ด้านล่าง |
| Firebase project ของ 8Hrs | `posture-monitor-program` | **ไม่ได้เชื่อมกับเว็บนี้โดยตรง** เว็บนี้แค่ลิงก์ไปหน้านโยบาย ตัว auth/Firestore ทั้งหมดอยู่ในตัวโปรแกรม `posture_monitor.py` คนละที่ |

## โครงสร้างไฟล์ปัจจุบัน

```
index.html              → saantie.com                  หน้าหลัก (bio + การ์ดลิงก์แอป)
8hrs/index.html          → saantie.com/8hrs              (ยังไม่สร้าง — ร่างอยู่ที่ F:\posture_monitor\posture_monitor\LANDING_PAGE_DRAFT.md)
8hrs/privacy.html        → saantie.com/8hrs/privacy      นโยบายความเป็นส่วนตัวของ 8Hrs
assets/8hrs-icon.png     → ไอคอนแอปบนการ์ดหน้าหลัก
assets/lang-toggle.js    → สคริปต์สลับภาษา ใช้ร่วมกันทุกหน้า (ดูหัวข้อถัดไป)
```

## ⚠️ กฎที่ห้ามฝ่าฝืน

**`saantie.com/8hrs/privacy` ห้ามเปลี่ยน URL เด็ดขาด** — ฝังอยู่ใน `PRIVACY_POLICY_URL` ของ
`posture_monitor.py` และกรอกไว้ใน Microsoft Partner Center ตอนส่งแอปแล้ว ถ้าเปลี่ยนต้องส่งอัปเดตแอปใหม่
และรอ certification รอบใหม่ทั้งกระบวนการ **ห้ามเปลี่ยนชื่อ/ย้าย/ลบ `8hrs/privacy.html`**

Cloudflare Pages ตัดนามสกุล `.html` ให้อัตโนมัติ — `8hrs/privacy.html` จึงเสิร์ฟที่ `/8hrs/privacy`
โดยไม่ต้องตั้งค่าอะไรเพิ่ม กฎนี้ใช้กับทุกหน้าในเว็บ ไม่ใช่แค่ 8hrs

## Convention สำหรับเพิ่มแอปใหม่ในอนาคต

**ทุกแอปใหม่ = 1 โฟลเดอร์ระดับบนสุดของตัวเอง ชื่อเดียวกับแอป** ทำตามแบบ `8hrs/` ที่มีอยู่แล้ว
(ไม่ใช้ `apps/` prefix ห่อ เพราะ `8hrs/` ผูก URL กับ Store ไปแล้ว ถ้าตั้ง prefix ใหม่ตอนนี้จะไม่สอดคล้องกัน)

```
<appname>/index.html      → saantie.com/<appname>          landing page ของแอป
<appname>/privacy.html    → saantie.com/<appname>/privacy   นโยบายความเป็นส่วนตัว (บังคับถ้าแอปขึ้น Store)
```

**ทุกหน้าใหม่ต้อง**:
1. ใช้โทนสี/ตัวแปร CSS ชุดเดียวกับ `index.html` (ตัวแปรอยู่ใน `:root` ของแต่ละไฟล์ — ยังไม่ได้แยกเป็นไฟล์
   กลาง เพราะแต่ละหน้าอาจอยากปรับโทนต่างกันได้ตามลักษณะแอป เช่น `privacy.html` จงใจใช้ธีมสว่างต่างจาก
   หน้าหลักเพราะเป็นเอกสารที่อาจถูกสั่งพิมพ์)
2. ใช้สคริปต์สลับภาษาร่วม `<script src="/assets/lang-toggle.js"></script>` — **ห้ามก็อปโค้ดสลับภาษาไปวาง
   ซ้ำในไฟล์ใหม่อีก** (เคยเป็นแบบนั้นมาก่อนระหว่าง `index.html` กับ `privacy.html` เพิ่งแยกออกมาเป็นไฟล์
   กลางแล้ว) ต้องมีปุ่ม `<button id="langbtn">` เปล่าๆ ให้สคริปต์เติมข้อความเอง และห่อเนื้อหาแต่ละภาษาด้วย
   `[data-lang="th"]` / `[data-lang="en"]` คู่กันเสมอ
3. ใช้ `localStorage` key เดียวกัน (`saantie-lang`, กำหนดไว้ในตัวสคริปต์กลางแล้ว) — ตัวเลือกภาษาจะติดตาม
   ผู้ใช้ข้ามทุกหน้าในเว็บนี้ให้เองอัตโนมัติ ไม่ต้องเขียนอะไรเพิ่ม

## สิ่งที่ **ไม่ได้** อยู่ในเว็บนี้ โดยตั้งใจ

หน้าจัดการสมาชิกโปรของ 8Hrs (`index.html`, `app.js`) อยู่ที่ repo แยก
`github.com/saantie/Document-pro_emails-for-Posture-monitor-program` เสิร์ฟผ่าน GitHub Pages ต่างหาก
เพราะเป็นเครื่องมือหลังบ้าน ไม่ควรอยู่โดเมนเดียวกับหน้าที่ลูกค้าเข้า (ความปลอดภัยจริงอยู่ที่ Firestore
Security Rules ซึ่งล็อกไว้แล้ว แต่ไม่มีเหตุผลให้ URL เดาง่าย) — ถ้าวันหนึ่งย้ายมาโดเมนนี้ ต้องไปเพิ่มโดเมน
ใหม่ที่ Firebase Console → Authentication → Settings → Authorized domains ก่อน ไม่งั้นปุ่มล็อกอิน Google
จะถูกปฏิเสธ

## งานค้าง

- **`8hrs/index.html`** (landing page ตัวโปรแกรม 8Hrs) — ยังไม่สร้าง ร่างเนื้อหาอยู่ที่
  `F:\posture_monitor\posture_monitor\LANDING_PAGE_DRAFT.md`

- **ฟอร์มติดต่อ** — เขียนโค้ดครบแล้วทั้ง 2 ฝั่ง (ฟอร์มในหน้าเว็บ `index.html` + Cloud Function
  `contactForm` ที่ `functions/index.js`, ส่งผ่าน Gmail SMTP ด้วย `nodemailer`) แต่ **ยังใช้งานจริงไม่ได้**
  จนกว่าเจ้าของบัญชีจะทำ 5 ขั้นตอนนี้เอง — Claude แตะ credential ให้ไม่ได้ตามกฎที่ตั้งไว้ ทุกขั้นตอนที่ต้อง
  พิมพ์รหัส/วางค่าลับ **ให้เจ้าของบัญชีเป็นคนพิมพ์เองเท่านั้น**

  **ขั้นที่ 1 — เปิด 2-Step Verification ของบัญชี Gmail ที่จะใช้ส่ง** (ถ้ายังไม่เปิด จะสร้าง App
  Password ในขั้นถัดไปไม่ได้เลย)
  1. เข้า https://myaccount.google.com/security
  2. หาหัวข้อ "2-Step Verification" (การยืนยันแบบ 2 ขั้นตอน) กดเข้าไปเปิดใช้งาน ทำตามขั้นตอนที่ Google
     กำหนด (มักต้องยืนยันผ่านเบอร์โทรศัพท์)

  **ขั้นที่ 2 — สร้าง App Password** (รหัสผ่าน 16 หลัก ใช้แทนรหัสผ่านจริง เฉพาะให้แอปนี้ใช้ ยกเลิกได้
  ทีหลังโดยไม่กระทบรหัสผ่านจริงของบัญชี)
  1. เข้า https://myaccount.google.com/apppasswords (เข้าได้ก็ต่อเมื่อเปิด 2-Step Verification แล้วเท่านั้น)
  2. ช่อง "App name" พิมพ์อะไรก็ได้ที่จำได้ เช่น `saantie contact form`
  3. กด "Create" / "สร้าง" — จะได้รหัส 16 หลัก (มีเว้นวรรคเป็น 4 ชุด เช่น `abcd efgh ijkl mnop`)
     **คัดลอกเก็บไว้ก่อน หน้านี้จะไม่โชว์รหัสนี้ซ้ำอีก**

  **ขั้นที่ 3 — ตั้งค่า secret ผ่าน Firebase CLI เอง** (เปิด terminal เอง พิมพ์เอง — ห้ามบอกรหัสนี้กับ
  Claude ไม่ว่าทางไหน แม้จะขอให้ช่วย debug ก็ตาม)
  ```
  cd F:\posture_monitor\posture_monitor\functions
  firebase functions:secrets:set GMAIL_APP_PASSWORD
  ```
  พอรันแล้วจะมีข้อความถามให้วางค่า (paste value) — **วาง App Password 16 หลักจากขั้นที่ 2** (จะวางแบบ
  มีช่องว่างคั่นหรือไม่มีก็ได้ Google รับทั้ง 2 แบบ) กด Enter

  **ขั้นที่ 4 — Deploy**
  ```
  cd F:\posture_monitor\posture_monitor\functions
  firebase deploy --only functions:contactForm
  ```
  รอบแรกที่ deploy ถ้ายังไม่เคยตั้งค่า `GMAIL_USER` มาก่อน จะมีข้อความถามในหน้าจอ (ไม่ใช่ความลับ พิมพ์
  ได้ปกติ ไม่ต้องระวังเป็นพิเศษ):
  ```
  ? Enter a string value for GMAIL_USER:
  ```
  พิมพ์ **ที่อยู่อีเมล Gmail เต็มๆ** ของบัญชีที่สร้าง App Password ไว้ในขั้นที่ 2 (เช่น
  `saantie@gmail.com`) แล้ว Enter — deploy จะใช้เวลาสักครู่ เสร็จแล้วจะมี URL ของฟังก์ชันโชว์ในหน้าจอ

  **ขั้นที่ 5 — ทดสอบจริง**
  1. เปิด https://saantie.com เลื่อนไปหัวข้อ "ติดต่อ" กรอกฟอร์มด้วยอีเมลตัวเอง ส่งทดสอบดู
  2. เช็คกล่องจดหมายที่ `contact@saantie.com` (หรือที่ Cloudflare Email Routing forward ไปให้) ว่าอีเมล
     มาถึงจริง — เนื้อความควรมีชื่อ+อีเมลที่กรอก และกดตอบกลับ (Reply) แล้วต้องไปหาอีเมลที่กรอกในฟอร์ม
     ไม่ใช่กลับไปหา Gmail ที่ใช้ส่ง (เช็ค reply-to ทำงานถูกต้อง)
  3. เข้า Firebase Console → Firestore → collection `contact_messages` เช็คว่ามีสำเนาข้อความบันทึกไว้
     ด้วย (เผื่ออีเมลตกสแปมภายหลัง ยังมีที่ตามดูย้อนหลังได้)

  **ถ้าอีเมลไปไม่ถึง / ค้าง**: เช็ค log ด้วย `firebase functions:log --only contactForm` — ข้อผิดพลาด
  ที่เจอบ่อยคือ (ก) ยังไม่ได้เปิด 2-Step Verification ก่อนสร้าง App Password (ข) พิมพ์ App Password ผิด
  ตอนตั้ง secret (ลบแล้วตั้งใหม่ได้ด้วยคำสั่งเดิมในขั้นที่ 3 ซ้ำอีกรอบ) (ค) Gmail จำกัดส่งได้ 500
  อีเมล/วัน ถ้าทดสอบถี่เกินไปอาจโดนบล็อกชั่วคราว

## จะโตแล้วทำยังไง (ถ้าจำนวนหน้าเยอะขึ้นมาก)

ตอนนี้ (2 หน้า: `index.html`, `8hrs/privacy.html`) ยังไม่คุ้มที่จะเพิ่มความซับซ้อนของ build step —
ก็อป `<head>`/CSS token/สคริปต์ร่วมด้วยมือได้สบาย (สคริปต์สลับภาษาแยกไฟล์กลางแล้ว เหลือแค่ CSS token
ที่ยังคัดลอกไว้ในแต่ละไฟล์)

**ถ้าถึงจุดที่แอปเพิ่มขึ้นเรื่อยๆ จนเริ่มเจ็บ** (ก็อป `<head>`/nav/footer ซ้ำหลายไฟล์ แก้ 1 จุดต้องไล่แก้
หลายที่) ให้พิจารณาย้ายไปใช้ static site generator แบบเบา เช่น **Eleventy (11ty)** หรือ **Astro** —
ทั้งคู่ deploy บน Cloudflare Pages ได้ตรงๆ ไม่ต้องเปลี่ยนโฮสต์ และยังคง output เป็น static HTML เหมือนเดิม
(ไม่กระทบ URL ที่ผูกกับ Store) จุดที่ควรทำก่อนคือแยก CSS token ร่วม (สี/ฟอนต์) ออกมาเป็นไฟล์กลางก่อน
build step จริง เพื่อให้ migration ง่ายขึ้นทีหลัง
