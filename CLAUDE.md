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
| ส่งอีเมลจากฟอร์มติดต่อ | **Firebase Cloud Functions** (`contactForm`) + **Resend** | โค้ดอยู่ที่ `F:\posture_monitor\posture_monitor\functions\index.js` โปรเจกต์ `posture-monitor-program` เดียวกับ 8Hrs — ยังไม่ได้ deploy/ตั้ง secret ดูหัวข้อ "งานค้าง" ด้านล่าง |
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
  `contactForm` ที่ `functions/index.js`) แต่ **ยังใช้งานจริงไม่ได้** จนกว่าจะทำ 3 ขั้นตอนนี้ให้ครบ
  (ต้องเป็นเจ้าของบัญชีทำเอง — Claude แตะ credential ให้ไม่ได้ตามกฎที่ตั้งไว้):

  1. สมัคร [resend.com](https://resend.com) (ฟรี ไม่ต้องผูกบัตร) แล้ว verify โดเมน `saantie.com`
     (เพิ่ม DNS record ที่ Resend บอกไว้ที่ Cloudflare DNS — ไม่งั้นส่งจาก `contact@saantie.com`
     ไม่ได้จริง ส่งได้แค่ที่อยู่ทดสอบของ Resend เอง)
  2. สร้าง API key ที่ Resend แล้วรันคำสั่งนี้เอง (จะถาม prompt ให้วางค่า key — ห้ามส่งค่า key ให้ Claude
     ไม่ว่าทางไหน):
     ```
     cd F:\posture_monitor\posture_monitor\functions
     firebase functions:secrets:set RESEND_API_KEY
     ```
  3. Deploy: `firebase deploy --only functions:contactForm`

  หลัง deploy เสร็จ ทดสอบจริงโดยกรอกฟอร์มที่ saantie.com แล้วเช็คว่าอีเมลไปถึง `contact@saantie.com`
  จริง (และเช็ค collection `contact_messages` ใน Firestore ว่ามีสำเนาบันทึกไว้ด้วย)

## จะโตแล้วทำยังไง (ถ้าจำนวนหน้าเยอะขึ้นมาก)

ตอนนี้ (2 หน้า: `index.html`, `8hrs/privacy.html`) ยังไม่คุ้มที่จะเพิ่มความซับซ้อนของ build step —
ก็อป `<head>`/CSS token/สคริปต์ร่วมด้วยมือได้สบาย (สคริปต์สลับภาษาแยกไฟล์กลางแล้ว เหลือแค่ CSS token
ที่ยังคัดลอกไว้ในแต่ละไฟล์)

**ถ้าถึงจุดที่แอปเพิ่มขึ้นเรื่อยๆ จนเริ่มเจ็บ** (ก็อป `<head>`/nav/footer ซ้ำหลายไฟล์ แก้ 1 จุดต้องไล่แก้
หลายที่) ให้พิจารณาย้ายไปใช้ static site generator แบบเบา เช่น **Eleventy (11ty)** หรือ **Astro** —
ทั้งคู่ deploy บน Cloudflare Pages ได้ตรงๆ ไม่ต้องเปลี่ยนโฮสต์ และยังคง output เป็น static HTML เหมือนเดิม
(ไม่กระทบ URL ที่ผูกกับ Store) จุดที่ควรทำก่อนคือแยก CSS token ร่วม (สี/ฟอนต์) ออกมาเป็นไฟล์กลางก่อน
build step จริง เพื่อให้ migration ง่ายขึ้นทีหลัง
