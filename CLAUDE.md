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
| ส่งอีเมลจากฟอร์มติดต่อ | **Firebase Cloud Functions** (`contactForm`) + **Gmail SMTP** (nodemailer) | ✅ deploy แล้ว ทดสอบส่งจริงสำเร็จ (ส.ค. 2569) — โค้ดอยู่ที่ `F:\posture_monitor\posture_monitor\functions\index.js` โปรเจกต์ `posture-monitor-program` เดียวกับ 8Hrs ดูหัวข้อ "ระบบอีเมลของฟอร์มติดต่อ" ด้านล่าง |
| Firebase project ของ 8Hrs | `posture-monitor-program` | **ไม่ได้เชื่อมกับเว็บนี้โดยตรง** เว็บนี้แค่ลิงก์ไปหน้านโยบาย ตัว auth/Firestore ทั้งหมดอยู่ในตัวโปรแกรม `posture_monitor.py` คนละที่ |

## โครงสร้างไฟล์ปัจจุบัน

```
index.html              → saantie.com                  หน้าหลัก (bio + การ์ดลิงก์แอป)
8hrs/index.html          → saantie.com/8hrs              landing page ของ 8Hrs (2 ภาษา + ฟอร์ม waitlist)
8hrs/guide.html          → saantie.com/8hrs/guide        คู่มือการใช้งาน 8 ขั้นตอน (2 ภาษา)
8hrs/privacy.html        → saantie.com/8hrs/privacy      นโยบายความเป็นส่วนตัวของ 8Hrs
assets/8hrs-icon.png     → ไอคอนแอปบนการ์ดหน้าหลัก
assets/lang-toggle.js    → สคริปต์สลับภาษา ใช้ร่วมกันทุกหน้า (ดูหัวข้อถัดไป)
```

**ที่มาของเนื้อหา 3 หน้าใน `8hrs/`** — landing + guide สร้างจากดราฟ artifact ที่เจ้าของเว็บทำไว้
(landing: `05c19d21-af6f-46d2-bc6b-b287908240bf`, guide: `2d6736ca-de7e-49c6-82cb-eda2b1f5087a`)
แล้วปรับให้เข้าธีม `index.html` + ทำ 2 ภาษา ส่วนร่างเนื้อหาเดิมแบบยาวอยู่ที่
`F:\posture_monitor\posture_monitor\LANDING_PAGE_DRAFT.md` (ยังอ้างอิงได้ ตัวเลข/สำนวนบางส่วนดึงจากตรงนั้น)

**ปุ่ม "ดาวน์โหลด" ในหน้า 8Hrs = ฟอร์ม waitlist** (ยังไม่มีปุ่ม Store จริงเพราะยังไม่ได้สมัคร
Partner Center) — ฟอร์มยิงไปที่ Cloud Function `contactForm` **ตัวเดียวกับฟอร์มติดต่อในหน้าหลัก**
โดยแนบข้อความขึ้นต้นด้วย `[8Hrs waitlist]` ให้แยกจากข้อความติดต่อทั่วไปได้ ไม่ต้องแตะ backend
เมื่อ Store พร้อมแล้ว: แทน `href="#notify"` ของปุ่มหลักด้วยลิงก์ Store จริง และแก้ callout ใน
`8hrs/guide.html` หัวข้อ "ติดตั้งโปรแกรม"

**ตัวเลขในหน้า 8Hrs ที่ผูกกับโค้ด `posture_monitor.py`** (แก้ในโปรแกรมต้องมาแก้ที่นี่ด้วย):
฿39/เดือน · ฿399/ปี · $30 USD/ปี · เตือน 1 นาที→กะพริบ, 2 นาที→ส้ม (`ORANGE_S`), 5 นาที→แดง (`RED_S`) ·
ฟรีเก็บสถิติ 7 วันแรกของเดือน (`FREE_TIER_MAX_DAYS_PER_MONTH`) · ทดลองโปร 7 วัน (`PRO_TRIAL_DAYS`) ·
เน็ตหลุดใช้ต่อ 14 วัน (`OFFLINE_GRACE_DAYS`) · โหมดแถบเล็ก 42 px · สีสถานะใช้ hex เดียวกับ
`COLOR_GOOD/WARN/CRIT`

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
<appname>/guide.html     → saantie.com/<appname>/guide     คู่มือการใช้งาน (ถ้ามี — ดู 8hrs/guide.html)
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

## ระบบอีเมลของฟอร์มติดต่อ (deploy สำเร็จแล้ว — ส.ค. 2569)

ฟอร์มใน `index.html` (หัวข้อ "ติดต่อ") ส่งจริงผ่าน Cloud Function `contactForm` แล้ว — **ทดสอบส่งจริง
จากหน้าเว็บสำเร็จ ยืนยันจากเจ้าของเว็บเอง** ไม่ต้องทำอะไรเพิ่มฝั่งนี้แล้ว

**กลไก**: ฟอร์ม → `fetch()` ไปที่
`https://asia-southeast1-posture-monitor-program.cloudfunctions.net/contactForm` → ฟังก์ชันตรวจ
honeypot/validation → ส่งอีเมลจริงผ่าน Gmail SMTP (`nodemailer`) ไปที่ **`contact@saantie.com`**
(ที่อยู่รับของฟอร์มเว็บไซต์ — คนละที่อยู่กับ `8hrs@saantie.com` ที่ตัวโปรแกรม 8Hrs ใช้เอง) พร้อม
`reply_to` เป็นอีเมลผู้กรอกฟอร์ม (กด Reply แล้วไปหาผู้ส่งจริง ไม่ใช่ Gmail ที่ใช้ส่ง) และบันทึกสำเนาลง
Firestore collection `contact_messages` เผื่ออีเมลตกสแปม

**ค่าที่ตั้งไว้แล้วในโปรเจกต์ `posture-monitor-program`**:
- Secret (Secret Manager — ความลับจริง): `GMAIL_APP_PASSWORD`
- Param ธรรมดา (ไม่ใช่ความลับ เก็บใน `functions/.env.posture-monitor-program`): `GMAIL_USER`
  (ที่อยู่ Gmail ที่ใช้ยิง SMTP ออก)
- เปลี่ยนบัญชี Gmail ที่ใช้ส่งทีหลัง: ต้องสร้าง App Password ใหม่ของบัญชีนั้น (ผ่าน
  https://myaccount.google.com/apppasswords ต้องเปิด 2-Step Verification ก่อน) แล้ว
  `firebase functions:secrets:set GMAIL_APP_PASSWORD` ทับของเดิม + แก้ค่าใน `.env.posture-monitor-program`
  ให้ตรงกัน แล้ว deploy ใหม่

**ปัญหาที่เจอจริงระหว่าง deploy ครั้งแรก (จดไว้กันเจอซ้ำ)**:
1. **`firebase deploy --only functions:contactForm` ยังวิเคราะห์ทั้งไฟล์ `index.js` เสมอ** แม้จะเจาะจง
   ฟังก์ชันเดียว — ถ้ามี secret ของฟังก์ชัน**อื่น**ในไฟล์เดียวกันที่ยังไม่เคยตั้งค่า (ตอนนั้นคือ
   `PAYPAL_CLIENT_ID/CLIENT_SECRET/WEBHOOK_ID` ของ `paypalWebhook` ที่ไม่ได้ใช้งานจริงแล้ว) จะถูกถามให้
   กรอกด้วย ทั้งที่ไม่เกี่ยวกับฟังก์ชันที่กำลัง deploy เลย — แก้โดยตั้งค่า placeholder ให้ 3 ตัวนั้นไปเลย
   (`firebase functions:secrets:set PAYPAL_CLIENT_ID` ฯลฯ ใส่ค่าอะไรก็ได้ เช่น `not_used`)
2. **ค่า param ที่ไม่มี default (เช่น `GMAIL_USER`) ถ้ากด Enter เปล่าตอนถูกถามระหว่าง deploy จะถูก
   บันทึกเป็นค่าว่างเงียบๆ** ไม่ error ทันที แต่ทำให้ฟังก์ชันพังตอนรันจริงด้วย
   `Error: Missing credentials for "PLAIN"` (nodemailer หา user/pass ไม่เจอ) — เช็คได้จาก
   `functions/.env.posture-monitor-program` (ไฟล์นี้ไม่ใช่ความลับ เปิดดู/แก้ตรงๆ ได้เลย) ถ้าเจอค่าว่าง
   แก้ไฟล์ตรงนั้นแล้ว deploy ใหม่ ไม่ต้องผ่าน prompt อีกรอบ
3. **`Cannot determine backend specification. Timeout after 10000` ตอน deploy คือปัญหาชั่วคราว** ไม่ใช่
   โค้ดผิด (เจอทั้งตอนรัน emulator ในเครื่องและตอน deploy จริง) — ลองรันคำสั่งเดิมซ้ำมักจะผ่าน
4. **การแก้ไฟล์ `.env.posture-monitor-program` อย่างเดียวไม่มีผลจนกว่าจะ `firebase deploy` ใหม่จริงๆ**
   ต้อง deploy ทุกครั้งหลังแก้ค่า ไม่ใช่แค่บันทึกไฟล์

## งานค้าง

- **สกรีนช็อต / GIF จริงของโปรแกรม** — `8hrs/index.html` และ `8hrs/guide.html` ตอนนี้ใช้ภาพจำลอง
  SVG แทนทั้งหมด (ยังไม่มีไฟล์ภาพจริง) จุดที่ควรแทนที่: hero, การ์ดฟีเจอร์ 3 ใบ, หน้ารายงานในคู่มือ
  — ห้ามใช้ภาพสต็อกคนทำท่าเป็นสกรีนช็อต ต้องเป็นภาพหน้าจอจริงเท่านั้น
- **section รีวิวผู้ใช้** — ตัดออกจาก `8hrs/index.html` แล้ว (ดราฟมี placeholder `[ ชื่อผู้ใช้ ]`)
  ค่อยเพิ่มกลับเมื่อมีรีวิวจริงจากผู้ใช้หลังเปิดตัว
- **ปุ่ม waitlist ใช้ endpoint ร่วมกับฟอร์มติดต่อ** — เป็นทางลัด ไม่มี dedupe อีเมล / ไม่มีหน้าดูรายชื่อ
  ทุก signup = 1 อีเมลเข้า `contact@saantie.com` + 1 doc ใน Firestore `contact_messages` (กรอง
  ด้วยข้อความขึ้นต้น `[8Hrs waitlist]`) พอสำหรับช่วงก่อน launch ถ้ารายชื่อเยอะค่อยแยก collection/หน้า admin

## จะโตแล้วทำยังไง (ถ้าจำนวนหน้าเยอะขึ้นมาก)

ตอนนี้ (4 หน้า: `index.html`, `8hrs/index.html`, `8hrs/guide.html`, `8hrs/privacy.html`) ยังพอไหว
แต่เริ่มเห็นความเจ็บของการก็อป CSS token ไปทุกไฟล์ ยังไม่คุ้มที่จะเพิ่มความซับซ้อนของ build step —
ก็อป `<head>`/CSS token/สคริปต์ร่วมด้วยมือได้สบาย (สคริปต์สลับภาษาแยกไฟล์กลางแล้ว เหลือแค่ CSS token
ที่ยังคัดลอกไว้ในแต่ละไฟล์)

**ถ้าถึงจุดที่แอปเพิ่มขึ้นเรื่อยๆ จนเริ่มเจ็บ** (ก็อป `<head>`/nav/footer ซ้ำหลายไฟล์ แก้ 1 จุดต้องไล่แก้
หลายที่) ให้พิจารณาย้ายไปใช้ static site generator แบบเบา เช่น **Eleventy (11ty)** หรือ **Astro** —
ทั้งคู่ deploy บน Cloudflare Pages ได้ตรงๆ ไม่ต้องเปลี่ยนโฮสต์ และยังคง output เป็น static HTML เหมือนเดิม
(ไม่กระทบ URL ที่ผูกกับ Store) จุดที่ควรทำก่อนคือแยก CSS token ร่วม (สี/ฟอนต์) ออกมาเป็นไฟล์กลางก่อน
build step จริง เพื่อให้ migration ง่ายขึ้นทีหลัง
