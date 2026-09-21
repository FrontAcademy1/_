# QUESTION ARCHIVE

منصة تعليمية شخصية لعرض الأسئلة والإجابات والشروحات، مبنية بـ HTML/CSS/Vanilla JavaScript وSupabase.

## المزايا

- الموقع العام يعمل بدون Login أو Register.
- Supabase PostgreSQL لتخزين الأسئلة والفصول والتصنيفات والإعدادات.
- Supabase Auth للأدمن فقط.
- RLS حقيقي لمنع الزائر من الكتابة أو تعديل البيانات.
- Role = admin يتم التحقق منه من قاعدة البيانات.
- أسئلة Published فقط تظهر للعامة.
- إدارة Questions / Chapters / Categories / Settings.
- بحث وFilters.
- Answer / Explanation / Code بشكل مخفي حتى الضغط.
- صور وفيديو YouTube أو روابط فيديو مباشرة.
- Copy Question.
- Report / Contact عبر WhatsApp.
- Responsive Mobile / Tablet / Desktop.
- خلفية Dark Retro مع Film Grain وفقاعات شفافة متحركة.
- لا يوجد Service Role Key في ملفات المتصفح.

---

# 1. إنشاء Supabase Project

1. افتح Supabase.
2. أنشئ Project جديد.
3. من Project Settings > API انسخ:
   - Project URL
   - Publishable key أو Anon key القديمة إن كانت المتاحة.
4. افتح ملف `config.js`.
5. استبدل فقط:
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`

لا تضع Service Role Key في `config.js`.

---

# 2. إنشاء قاعدة البيانات

من Supabase Dashboard:

SQL Editor → New query

افتح محتوى:

`supabase/schema.sql`

والصقه كاملًا ثم Run.

الملف ينشئ:

- profiles
- chapters
- categories
- questions
- site_settings
- indexes
- triggers
- RLS policies
- admin authorization function
- demo data

---

# 3. إنشاء Admin

لا يوجد Admin Password داخل المشروع.

من Supabase:

Authentication → Users → Add user

أنشئ حساب Admin بالبريد وكلمة المرور من Dashboard.

بعد إنشاء المستخدم:

1. انسخ User UID.
2. افتح SQL Editor.
3. نفذ:

```sql
insert into public.profiles (id, display_name, role)
values ('PUT-USER-UUID-HERE', 'Administrator', 'admin');
```

استبدل UUID فقط.

بعد ذلك يمكن للأدمن الدخول من `admin.html`.

مهم: كلمة المرور تظل داخل Supabase Auth ولا تظهر في الكود.

---

# 4. تشغيل محليًا

لأن المشروع يستخدم ملفات static، يمكنك استخدام أي static server.

مثال باستخدام VS Code:

- افتح المجلد.
- استخدم Live Server.

أو Python:

```bash
python -m http.server 5500
```

ثم افتح:

`http://localhost:5500`

وللوحة الأدمن:

`http://localhost:5500/admin.html`

---

# 5. مسار /admin

المشروع يحتوي على `admin.html`.

على Netlify يوجد `_redirects` لتحويل:

`/admin`

إلى:

`/admin.html`

وعلى Vercel يوجد `vercel.json` لنفس الفكرة.

على GitHub Pages لا توجد rewrites عامة مثل Netlify/Vercel؛ استخدم:

`/admin.html`

أو أضف إعداد الاستضافة المناسب لديك.

---

# 6. نشر Netlify

ارفع مجلد المشروع إلى GitHub ثم اربطه بـ Netlify.

لا تحتاج Build command.

Publish directory:

`.`

ملف `_redirects` سيجعل:

`/admin`

يفتح لوحة الأدمن.

---

# 7. نشر Vercel

اربط مستودع GitHub بالمشروع.

لا تحتاج Framework.

`vercel.json` يحتوي على rewrite لمسار:

`/admin`

إلى:

`/admin.html`

---

# 8. GitHub Pages

يمكن نشر الملفات مباشرة.

الصفحة العامة:

`/`

لوحة الأدمن:

`/admin.html`

تأكد أن `config.js` يحتوي على Project URL وPublishable/Anon key الصحيحين.

---

# 9. إدارة الأسئلة

بعد تسجيل الدخول:

DASHBOARD → QUESTIONS → ADD QUESTION

يمكنك إضافة:

- Title
- Question Text
- Answer
- Explanation
- Chapter
- Category
- Image URL
- Video URL
- Optional Code
- Published

إذا كان Published غير مفعّل، السؤال لا يظهر في الموقع العام.

---

# 10. الصور

يمكنك استخدام رابط صورة عام في `Image URL`.

أو لاحقًا ربط Supabase Storage.

النسخة الحالية تستخدم URL مباشرة لتبقى بسيطة ولا تحتاج Service Role.

---

# 11. الفيديو

يدعم:

- YouTube URL
- Direct MP4/WebM URL

YouTube يتم تحويله تلقائيًا إلى embed.

---

# 12. WhatsApp

من:

ADMIN → SETTINGS

ضع رقم WhatsApp بصيغة دولية، مثل:

`2010XXXXXXXX`

بدون `+` أو مسافات.

ثم ضع الرسالة الافتراضية.

رقم WhatsApp لا يوجد ثابتًا داخل JavaScript؛ يتم قراءته من `site_settings`.

---

# 13. الأمان

الموقع العام لا يملك صلاحيات:

- INSERT
- UPDATE
- DELETE

على الأسئلة.

الـRLS هو المسؤول عن الصلاحيات.

الأدمن يحتاج:

1. Supabase Auth session.
2. Profile موجود بنفس UUID.
3. `role = admin`.

تعديل JavaScript في المتصفح لا يمنح المستخدم صلاحية Admin لأن Supabase RLS يعيد التحقق من قاعدة البيانات.

لا يوجد:

- hardcoded password
- service role key
- frontend-only admin flag

---

# 14. ملاحظة مهمة عن Profiles

لا يوجد public INSERT policy على `profiles`.

هذا يمنع أي زائر من إنشاء profile لنفسه ثم وضع:

`role = admin`

إنشاء أول Admin يتم من Supabase Dashboard ثم إضافة profile بالـUUID.

---

# 15. الملفات

```text
question-archive/
├── index.html
├── style.css
├── app.js
├── admin.html
├── admin.css
├── admin.js
├── config.js
├── README.md
├── _redirects
├── vercel.json
├── assets/
│   ├── images/
│   │   └── favicon.svg
│   ├── videos/
│   └── fonts/
└── supabase/
    └── schema.sql
```

---

# 16. Troubleshooting

## Login لا يعمل

تحقق من:

- Authentication user موجود.
- Email/password صحيحان.
- Profile موجود.
- Profile ID يساوي Auth User UUID.
- Role تساوي `admin`.
- `config.js` يحتوي القيم الصحيحة.
- تم تشغيل `schema.sql` كاملًا.

## Access denied

هذا يعني غالبًا أن الحساب Authenticated لكن لا يوجد:

```text
profiles.role = admin
```

## الأسئلة لا تظهر

تحقق من:

- السؤال `published = true`.
- RLS policies تم إنشاؤها.
- الـProject URL صحيح.
- الـPublishable/Anon key صحيح.

## Admin يرى Login باستمرار

افتح Console وتحقق من:

- Supabase URL.
- Supabase key.
- وجود session.
- وجود profile بنفس UUID.

## RLS errors

لا تعطل RLS لحل المشكلة.

تحقق من أن `schema.sql` تم تشغيله كاملًا وأن `public.is_admin()` موجودة.

---

# 17. Security Checklist

- [x] No admin password in frontend.
- [x] No service-role key in frontend.
- [x] Public users do not need accounts.
- [x] Public can read published questions.
- [x] Public cannot write questions.
- [x] Public cannot create admins.
- [x] Admin access uses Supabase Auth.
- [x] Admin role is checked from database.
- [x] Unpublished questions are hidden from public.
- [x] Logout uses Supabase Auth.
- [x] Error messages do not expose SQL or secrets.
