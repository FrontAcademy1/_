/* =========================================================
   QUESTION ARCHIVE — ADMIN APP
   Auth + database authorization are enforced by Supabase/RLS.
   This file contains no password and no service-role key.
   ========================================================= */
const { createClient } = window.supabase;
const db = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const A = {
  questions: [], chapters: [], categories: [], settings: {},
  user: null, profile: null
};

document.addEventListener("DOMContentLoaded", async () => {
  createAdminBubbles();
  bindAdminUI();
  await bootAdmin();
});

function createAdminBubbles() {
  const box = document.getElementById("adminBubbles");
  for (let i = 0; i < 18; i++) {
    const b = document.createElement("span");
    const s = 20 + Math.random() * 90;
    b.style.width = `${s}px`; b.style.height = `${s}px`;
    b.style.left = `${Math.random() * 100}%`;
    b.style.animationDuration = `${20 + Math.random() * 25}s`;
    b.style.animationDelay = `${-Math.random() * 25}s`;
    box.appendChild(b);
  }
}

function bindAdminUI() {
  document.getElementById("loginForm").addEventListener("submit", login);
  document.getElementById("logoutBtn").addEventListener("click", logout);
  document.getElementById("accountLogout").addEventListener("click", logout);
  document.getElementById("addQuestionBtn").addEventListener("click", () => openQuestionModal());
  document.getElementById("addالفصلBtn").addEventListener("click", () => openالفصلModal());
  document.getElementById("addالتصنيفBtn").addEventListener("click", () => openالتصنيفModal());
  document.getElementById("settingsForm").addEventListener("submit", saveSettings);
  document.getElementById("adminQuestionSearch").addEventListener("input", renderQuestionsTable);
  document.querySelectorAll(".side-link").forEach(btn => btn.addEventListener("click", () => switchSection(btn.dataset.section)));
  document.querySelectorAll("[data-close]").forEach(el => el.addEventListener("click", closeModal));
  document.getElementById("sidebarToggle").addEventListener("click", () => document.querySelector(".sidebar").classList.toggle("open"));
}

async function bootAdmin() {
  showLogin(true);
  const { data: { session } } = await db.auth.getSession();
  if (!session) return;
  const allowed = await loadIdentity(session.user);
  if (allowed) await loadAdminData();
}

async function login(event) {
  event.preventDefault();
  const btn = document.getElementById("loginBtn");
  const msg = document.getElementById("loginMessage");
  btn.disabled = true; btn.textContent = "جاري تسجيل الدخول...";
  msg.textContent = "";
  try {
    const email = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPassword").value;
    const { data, error } = await db.auth.signInWithPassword({ email, password });
    if (error) throw error;
    const allowed = await loadIdentity(data.user);
    if (!allowed) {
      await db.auth.signOut();
      throw new Error("ACCESS_DENIED");
    }
    await loadAdminData();
  } catch (error) {
    console.error(error);
    msg.textContent = error.message === "ACCESS_DENIED" ? "الحساب ده مش أدمن ومش مسموح له يدخل لوحة التحكم." : "البريد الإلكتروني أو كلمة المرور غير صحيحة.";
  } finally {
    btn.disabled = false; btn.textContent = "دخول";
  }
}

async function loadIdentity(user) {
  const { data, error } = await db.from("profiles").select("id,display_name,role").eq("id", user.id).single();
  if (error || !data || data.role !== "admin") {
    document.getElementById("loginMessage").textContent = "الدخول مرفوض. الحساب لازم يكون أدمن.";
    return false;
  }
  A.user = user; A.profile = data;
  document.getElementById("adminIdentity").textContent = data.display_name || user.email;
  document.getElementById("accountEmail").textContent = user.email;
  document.getElementById("accountRole").textContent = `الدور: ${data.role === "admin" ? "أدمن" : "طالب"}`;
  return true;
}

async function loadAdminData() {
  try {
    const [q, ch, cat, settings] = await Promise.all([
      db.from("questions").select("*").order("created_at", { ascending: false }),
      db.from("chapters").select("*").order("display_order", { ascending: true }),
      db.from("categories").select("*").order("name", { ascending: true }),
      db.from("site_settings").select("key,value")
    ]);
    for (const result of [q, ch, cat, settings]) if (result.error) throw result.error;
    A.questions = q.data || []; A.chapters = ch.data || []; A.categories = cat.data || [];
    A.settings = Object.fromEntries((settings.data || []).map(x => [x.key, x.value]));
    showLogin(false);
    renderAll();
  } catch (error) {
    console.error(error);
    showLogin(true);
    document.getElementById("loginMessage").textContent = "تعذر تحميل بيانات لوحة التحكم. راجع RLS ودور الحساب.";
  }
}

function renderAll() {
  document.getElementById("mQuestions").textContent = A.questions.length;
  document.getElementById("mمنشور").textContent = A.questions.filter(q => q.published).length;
  document.getElementById("mالفصلs").textContent = A.chapters.length;
  document.getElementById("mCategories").textContent = A.categories.length;
  renderRecent(); renderQuestionsTable(); renderالفصلs(); renderCategories(); renderSettings();
}

function switchSection(name) {
  document.querySelectorAll(".side-link").forEach(x => x.classList.toggle("active", x.dataset.section === name));
  document.querySelectorAll(".panel-section").forEach(x => x.classList.toggle("active", x.id === `section-${name}`));
  document.getElementById("sectionTitle").textContent = name.toUpperCase();
  document.querySelector(".sidebar").classList.remove("open");
}

function renderRecent() {
  const recent = A.questions.slice(0, 7);
  document.getElementById("recentQuestions").innerHTML = recent.length ? recent.map(q => `<div class="recent-item"><span>${esc(q.title)}</span><small>${q.published ? "منشور" : "مسودة"}</small></div>`).join("") : `<div class="state-message">لا توجد أسئلة</div>`;
}

function renderQuestionsTable() {
  const term = document.getElementById("adminQuestionSearch").value.trim().toLowerCase();
  const list = A.questions.filter(q => !term || [q.title,q.question_text].join(" ").toLowerCase().includes(term));
  document.getElementById("questionsTable").innerHTML = list.map(q => {
    const c = A.chapters.find(x => x.id === q.chapter_id);
    const cat = A.categories.find(x => x.id === q.category_id);
    return `<tr>
      <td>${q.id}</td><td>${esc(q.title)}</td><td>${esc(c?.title || "—")}</td><td>${esc(cat?.name || "—")}</td>
      <td><span class="badge ${q.published ? "on" : "off"}">${q.published ? "YES" : "NO"}</span></td>
      <td>${formatDate(q.created_at)}</td>
      <td><div class="row-actions"><button class="icon-btn" onclick="editQuestion('${q.id}')">تعديل</button><button class="icon-btn" onclick="deleteQuestion('${q.id}')">حذف</button></div></td>
    </tr>`;
  }).join("") || `<tr><td colspan="7">لا توجد أسئلة</td></tr>`;
}

function renderالفصلs() {
  document.getElementById("chaptersAdmin").innerHTML = A.chapters.map((c, i) => `<div class="list-row">
    <span class="order">#${c.display_order ?? i + 1}</span><strong>${esc(c.title)}</strong><span>${esc(c.description || "")}</span>
    <span class="row-actions"><button class="icon-btn" onclick="editالفصل('${c.id}')">تعديل</button><button class="icon-btn" onclick="deleteالفصل('${c.id}')">حذف</button></span>
  </div>`).join("") || `<div class="state-message">لا توجد فصول متاحة</div>`;
}

function renderCategories() {
  document.getElementById("categoriesAdmin").innerHTML = A.categories.map(c => `<div class="list-row">
    <span class="order">CAT</span><strong>${esc(c.name)}</strong><span>${esc(c.slug || "")} · ${esc(c.description || "")}</span>
    <span class="row-actions"><button class="icon-btn" onclick="editالتصنيف('${c.id}')">تعديل</button><button class="icon-btn" onclick="deleteالتصنيف('${c.id}')">حذف</button></span>
  </div>`).join("") || `<div class="state-message">لا توجد تصنيفات متاحة</div>`;
}

function renderSettings() {
  document.getElementById("sSiteName").value = A.settings.site_name || "QUESTION ARCHIVE";
  document.getElementById("sDescription").value = A.settings.site_description || "";
  document.getElementById("sWhatsApp").value = A.settings.whatsapp_number || "";
  document.getElementById("sWhatsAppMessage").value = A.settings.whatsapp_message || "";
  document.getElementById("sEmail").value = A.settings.contact_email || "";
  document.getElementById("sFooter").value = A.settings.footer_text || "© 2026 أرشيف الأسئلة";
  document.getElementById("sDeveloperName").value = A.settings.developer_name || "فريق QUESTION ARCHIVE";
  document.getElementById("sDeveloperText").value = A.settings.developer_text || "الموقع ده معمول علشان يسهّل المراجعة وتنظيم الأسئلة للطلاب بطريقة بسيطة وسريعة.";
  document.getElementById("sDeveloperContact").value = A.settings.developer_contact || "";
}

function openQuestionModal(q = null) {
  const chapterOptions = A.chapters.map(c => `<option value="${c.id}" ${q?.chapter_id === c.id ? "selected" : ""}>${esc(c.title)}</option>`).join("");
  const categoryOptions = A.categories.map(c => `<option value="${c.id}" ${q?.category_id === c.id ? "selected" : ""}>${esc(c.name)}</option>`).join("");
  openModal(`<p class="eyebrow">${q ? "تعديل الملف" : "ملف جديد"}</p><h3>${q ? "تعديل السؤال" : "إضافة سؤال"}</h3>
    <form id="questionForm" class="modal-form">
      <label class="full">عنوان السؤال<input id="qTitle" required value="${attr(q?.title)}"></label>
      <label class="full">نص السؤال<textarea id="qText" rows="5" required>${esc(q?.question_text)}</textarea></label>
      <label>الإجابة<textarea id="qالإجابة" rows="4">${esc(q?.answer)}</textarea></label>
      <label>الشرح<textarea id="qالشرح" rows="4">${esc(q?.explanation)}</textarea></label>
      <label>الفصل<select id="qالفصل"><option value="">—</option>${chapterOptions}</select></label>
      <label>التصنيف<select id="qالتصنيف"><option value="">—</option>${categoryOptions}</select></label>
      <label>رابط الصورة<input id="qImage" value="${attr(q?.image_url)}"></label>
      <label>رابط الفيديو<input id="qVideo" value="${attr(q?.video_url)}"></label>
      <label class="full">كود اختياري<textarea id="qCode" rows="5">${esc(q?.code)}</textarea></label>
      <label class="full check-row"><input id="qمنشور" type="checkbox" ${q?.published ? "checked" : ""}> منشور</label>
      <button class="primary" type="submit">${q ? "تحديث السؤال" : "حفظ السؤال"}</button>
      <div id="modalMessage" class="form-message"></div>
    </form>`);
  document.getElementById("questionForm").addEventListener("submit", e => saveQuestion(e, q?.id));
}

async function saveQuestion(e, id) {
  e.preventDefault();
  const button = e.target.querySelector("button[type=submit]");
  button.disabled = true; button.textContent = "جاري الحفظ...";
  const payload = {
    title: document.getElementById("qTitle").value.trim(),
    question_text: document.getElementById("qText").value.trim(),
    answer: document.getElementById("qالإجابة").value.trim() || null,
    explanation: document.getElementById("qالشرح").value.trim() || null,
    chapter_id: document.getElementById("qالفصل").value || null,
    category_id: document.getElementById("qالتصنيف").value || null,
    image_url: document.getElementById("qImage").value.trim() || null,
    video_url: document.getElementById("qVideo").value.trim() || null,
    code: document.getElementById("qCode").value || null,
    published: document.getElementById("qمنشور").checked
  };
  try {
    const result = id ? await db.from("questions").update(payload).eq("id", id) : await db.from("questions").insert(payload);
    if (result.error) throw result.error;
    closeModal(); await loadAdminData(); toast(id ? "تم تعديل السؤال." : "تم إضافة السؤال.");
  } catch (error) {
    console.error(error); document.getElementById("modalMessage").textContent = "تعذر الحفظ. راجع البيانات والصلاحيات.";
    button.disabled = false; button.textContent = id ? "تحديث السؤال" : "حفظ السؤال";
  }
}

window.editQuestion = id => { const q = A.questions.find(x => x.id === id); if (q) openQuestionModal(q); };
window.deleteQuestion = async id => {
  if (!confirm("متأكد إنك عايز تحذف السؤال ده؟")) return;
  try { const { error } = await db.from("questions").delete().eq("id", id); if (error) throw error; await loadAdminData(); toast("تم حذف السؤال."); }
  catch (e) { console.error(e); toast("تعذر الحذف."); }
};

function openالفصلModal(c = null) {
  openModal(`<p class="eyebrow">${c ? "تعديل الفصل" : "فصل جديد"}</p><h3>${c ? "تعديل الفصل" : "إضافة فصل"}</h3>
    <form id="chapterForm" class="modal-form">
      <label class="full">Title<input id="cTitle" required value="${attr(c?.title)}"></label>
      <label class="full">Description<textarea id="cDescription" rows="4">${esc(c?.description)}</textarea></label>
      <label>Order<input id="cOrder" type="number" min="0" value="${c?.display_order ?? (A.chapters.length + 1)}"></label>
      <button class="primary" type="submit">${c ? "تحديث الفصل" : "حفظ الفصل"}</button><div id="modalMessage" class="form-message"></div>
    </form>`);
  document.getElementById("chapterForm").addEventListener("submit", e => saveالفصل(e, c?.id));
}
async function saveالفصل(e,id){
  e.preventDefault(); const btn=e.target.querySelector("button"); btn.disabled=true; btn.textContent="جاري الحفظ...";
  const payload={title:document.getElementById("cTitle").value.trim(),description:document.getElementById("cDescription").value.trim()||null,display_order:Number(document.getElementById("cOrder").value)||0};
  try{const r=id?await db.from("chapters").update(payload).eq("id",id):await db.from("chapters").insert(payload);if(r.error)throw r.error;closeModal();await loadAdminData();toast("تم حفظ الفصل.");}catch(err){console.error(err);document.getElementById("modalMessage").textContent="تعذر حفظ الفصل.";btn.disabled=false;btn.textContent=id?"تحديث الفصل":"حفظ الفصل";}
}
window.editالفصل=id=>{const c=A.chapters.find(x=>x.id===id);if(c)openالفصلModal(c)};
window.deleteالفصل=async id=>{if(!confirm("متأكد إنك عايز تحذف الفصل؟ الأسئلة المرتبطة به قد تتأثر."))return;try{const{error}=await db.from("chapters").delete().eq("id",id);if(error)throw error;await loadAdminData();toast("تم حذف الفصل.");}catch(e){console.error(e);toast("تعذر الحذف. احذف أو انقل الأسئلة المرتبطة بالفصل الأول.");}};

function openالتصنيفModal(c = null) {
  openModal(`<p class="eyebrow">${c ? "تعديل التصنيف" : "تصنيف جديد"}</p><h3>${c ? "تعديل التصنيف" : "إضافة تصنيف"}</h3>
    <form id="categoryForm" class="modal-form">
      <label>Name<input id="catName" required value="${attr(c?.name)}"></label>
      <label>Slug<input id="catSlug" required value="${attr(c?.slug)}"></label>
      <label class="full">Description<textarea id="catDescription" rows="4">${esc(c?.description)}</textarea></label>
      <button class="primary" type="submit">${c ? "تحديث التصنيف" : "حفظ التصنيف"}</button><div id="modalMessage" class="form-message"></div>
    </form>`);
  document.getElementById("categoryForm").addEventListener("submit", e => saveالتصنيف(e, c?.id));
}
async function saveالتصنيف(e,id){
  e.preventDefault();const btn=e.target.querySelector("button");btn.disabled=true;btn.textContent="جاري الحفظ...";
  const payload={name:document.getElementById("catName").value.trim(),slug:document.getElementById("catSlug").value.trim().toLowerCase().replace(/\s+/g,"-"),description:document.getElementById("catDescription").value.trim()||null};
  try{const r=id?await db.from("categories").update(payload).eq("id",id):await db.from("categories").insert(payload);if(r.error)throw r.error;closeModal();await loadAdminData();toast("تم حفظ التصنيف.");}catch(err){console.error(err);document.getElementById("modalMessage").textContent="تعذر حفظ التصنيف.";btn.disabled=false;btn.textContent=id?"تحديث التصنيف":"حفظ التصنيف";}
}
window.editالتصنيف=id=>{const c=A.categories.find(x=>x.id===id);if(c)openالتصنيفModal(c)};
window.deleteالتصنيف=async id=>{if(!confirm("متأكد إنك عايز تحذف التصنيف؟ الأسئلة المرتبطة به قد تتأثر."))return;try{const{error}=await db.from("categories").delete().eq("id",id);if(error)throw error;await loadAdminData();toast("تم حذف التصنيف.");}catch(e){console.error(e);toast("تعذر الحذف. احذف أو انقل الأسئلة المرتبطة بالفصل الأول.");}};

async function saveSettings(e) {
  e.preventDefault(); const btn=e.target.querySelector("button[type=submit]"); btn.disabled=true; btn.textContent="جاري الحفظ...";
  const values={
    site_name:document.getElementById("sSiteName").value.trim(),
    site_description:document.getElementById("sDescription").value.trim(),
    whatsapp_number:document.getElementById("sWhatsApp").value.trim(),
    whatsapp_message:document.getElementById("sWhatsAppMessage").value.trim(),
    contact_email:document.getElementById("sEmail").value.trim(),
    footer_text:document.getElementById("sFooter").value.trim(),
    developer_name:document.getElementById("sDeveloperName").value.trim(),
    developer_text:document.getElementById("sDeveloperText").value.trim(),
    developer_contact:document.getElementById("sDeveloperContact").value.trim()
  };
  try{
    for(const [key,value] of Object.entries(values)){
      const {error}=await db.from("site_settings").upsert({key,value},{onConflict:"key"});if(error)throw error;
    }
    A.settings={...A.settings,...values};document.getElementById("settingsMessage").textContent="تم حفظ الإعدادات بنجاح.";toast("تم حفظ الإعدادات بنجاح.");
  }catch(err){console.error(err);document.getElementById("settingsMessage").textContent="حصلت مشكلة في حفظ الإعدادات.";}
  finally{btn.disabled=false;btn.textContent="حفظ الإعدادات";}
}

async function logout(){await db.auth.signOut();A.user=null;A.profile=null;showLogin(true);document.getElementById("loginMessage").textContent="تم تسجيل الخروج.";window.scrollTo(0,0);}
function showLogin(show){document.getElementById("loginView").classList.toggle("hidden",!show);document.getElementById("adminApp").classList.toggle("hidden",show);}
function openModal(html){document.getElementById("modalContent").innerHTML=html;document.getElementById("modal").classList.remove("hidden");}
function closeModal(){document.getElementById("modal").classList.add("hidden");document.getElementById("modalContent").innerHTML="";}
function toast(message){const r=document.getElementById("toastRegion"),e=document.createElement("div");e.className="toast";e.textContent=message;r.appendChild(e);setTimeout(()=>e.remove(),3000);}
function esc(v){return String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]));}
function attr(v){return esc(v).replace(/\n/g,"&#10;");}
function formatDate(v){try{return new Date(v).toLocaleDateString("en-GB")}catch{return "—";}}

window.addEventListener("qa-language-change", () => {
  const title = document.getElementById("sectionTitle");
  const active = document.querySelector(".side-link.active");
  if (title && active) title.textContent = QA_I18N.t(active.textContent.trim());
  const search = document.getElementById("adminQuestionSearch");
  if (search) search.placeholder = QA_I18N.get() === "ar" ? "ابحث في الأسئلة..." : "Search questions...";
});
