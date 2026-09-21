/* =========================================================
   QUESTION ARCHIVE — PUBLIC APP
   ========================================================= */
const { createClient } = window.supabase;
const db = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const $ = (s) => document.querySelector(s);
const state = { questions: [], chapters: [], categories: [], settings: {} };

document.addEventListener("DOMContentLoaded", async () => {
  createBubbles();
  bindNavigation();
  bindFilters();
  await loadPublicData();
});

function createBubbles() {
  const box = $("#bubbles");
  for (let i = 0; i < 22; i++) {
    const b = document.createElement("span");
    b.className = "bubble";
    const size = 20 + Math.random() * 100;
    b.style.width = `${size}px`;
    b.style.height = `${size}px`;
    b.style.left = `${Math.random() * 100}%`;
    b.style.animationDuration = `${18 + Math.random() * 25}s`;
    b.style.animationDelay = `${-Math.random() * 30}s`;
    box.appendChild(b);
  }
}

function bindNavigation() {
  const toggle = $("#menuToggle");
  const nav = $("#mainNav");
  toggle.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(open));
  });
  nav.querySelectorAll("a").forEach(a => a.addEventListener("click", () => nav.classList.remove("open")));
}

function bindFilters() {
  $("#searchInput").addEventListener("input", renderQuestions);
  $("#chapterFilter").addEventListener("change", renderQuestions);
  $("#categoryFilter").addEventListener("change", renderQuestions);
}

async function loadPublicData() {
  setQuestionsState("Loading Questions...");
  try {
    const [q, ch, cat, settings] = await Promise.all([
      db.from("questions").select("id,title,question_text,answer,explanation,chapter_id,category_id,image_url,video_url,code,created_at").eq("published", true).order("created_at", { ascending: false }),
      db.from("chapters").select("id,title,description,display_order,created_at").order("display_order", { ascending: true }),
      db.from("categories").select("id,name,slug,description,created_at").order("name", { ascending: true }),
      db.from("site_settings").select("key,value").in("key", ["site_name","site_description","whatsapp_number","whatsapp_message","contact_email","footer_text"])
    ]);
    if (q.error) throw q.error;
    if (ch.error) throw ch.error;
    if (cat.error) throw cat.error;
    if (settings.error) throw settings.error;

    state.questions = q.data || [];
    state.chapters = ch.data || [];
    state.categories = cat.data || [];
    state.settings = Object.fromEntries((settings.data || []).map(x => [x.key, x.value]));

    renderFilters();
    renderQuestions();
    renderChapters();
    renderStats();
    renderContact();
    $("#footerText").textContent = state.settings.footer_text || "© 2026 Question Archive";
  } catch (error) {
    console.error(error);
    setQuestionsState("تعذر تحميل الأرشيف الآن. حاول تحديث الصفحة.");
    toast("تعذر تحميل البيانات. تأكد من إعداد Supabase وRLS.");
  }
}

function renderStats() {
  $("#totalQuestions").textContent = state.questions.length;
  $("#totalChapters").textContent = state.chapters.length;
  $("#totalCategories").textContent = state.categories.length;
}

function renderFilters() {
  $("#chapterFilter").innerHTML = `<option value="">ALL CHAPTERS</option>` +
    state.chapters.map(c => `<option value="${escapeAttr(c.id)}">${escapeHtml(c.title)}</option>`).join("");
  $("#categoryFilter").innerHTML = `<option value="">ALL CATEGORIES</option>` +
    state.categories.map(c => `<option value="${escapeAttr(c.id)}">${escapeHtml(c.name)}</option>`).join("");
}

function renderQuestions() {
  const search = $("#searchInput").value.trim().toLowerCase();
  const chapterId = $("#chapterFilter").value;
  const categoryId = $("#categoryFilter").value;

  const list = state.questions.filter(q => {
    const chapter = state.chapters.find(c => c.id === q.chapter_id);
    const category = state.categories.find(c => c.id === q.category_id);
    const haystack = [q.title, q.question_text, chapter?.title, category?.name].filter(Boolean).join(" ").toLowerCase();
    return (!search || haystack.includes(search)) &&
      (!chapterId || q.chapter_id === chapterId) &&
      (!categoryId || q.category_id === categoryId);
  });

  if (!list.length) {
    $("#questionsGrid").innerHTML = "";
    setQuestionsState(search || chapterId || categoryId ? "NO RESULTS FOUND" : "NO QUESTIONS FOUND");
    return;
  }
  setQuestionsState("");
  $("#questionsGrid").innerHTML = list.map(questionCard).join("");
}

function questionCard(q) {
  const chapter = state.chapters.find(c => c.id === q.chapter_id);
  const category = state.categories.find(c => c.id === q.category_id);
  const image = q.image_url ? `<img class="media-image" src="${escapeAttr(q.image_url)}" alt="${escapeAttr(q.title)}" loading="lazy" onclick="window.open('${escapeAttr(q.image_url)}','_blank','noopener')">` : "";
  const video = buildVideo(q.video_url);
  const code = q.code ? `<pre class="answer-box" id="code-${q.id}"><code>${escapeHtml(q.code)}</code></pre>` : "";
  return `<article class="question-card">
    <div class="card-meta"><span>${escapeHtml(chapter?.title || "ARCHIVE")}</span><span>${escapeHtml(category?.name || "QUESTION")}</span></div>
    <h3>${escapeHtml(q.title)}</h3>
    <div class="question-text">${escapeHtml(q.question_text || "")}</div>
    ${image}${video}
    <div class="card-actions">
      <button class="mini-btn" type="button" onclick="toggleBox('answer-${q.id}')">SHOW ANSWER</button>
      <button class="mini-btn" type="button" onclick="toggleBox('explanation-${q.id}')">SHOW EXPLANATION</button>
      ${q.code ? `<button class="mini-btn" type="button" onclick="toggleBox('code-${q.id}')">SHOW CODE</button>` : ""}
      <button class="mini-btn" type="button" onclick="copyQuestion('${q.id}')">COPY QUESTION</button>
      <button class="mini-btn danger" type="button" onclick="reportQuestion('${q.id}')">REPORT / CONTACT</button>
    </div>
    <div class="answer-box" id="answer-${q.id}">${escapeHtml(q.answer || "No answer available.")}</div>
    <div class="explanation-box" id="explanation-${q.id}">${escapeHtml(q.explanation || "No explanation available.")}</div>
    ${code}
  </article>`;
}

function buildVideo(url) {
  if (!url) return "";
  const safe = escapeAttr(url);
  const youtube = getYouTubeId(url);
  if (youtube) return `<iframe class="media-video" src="https://www.youtube.com/embed/${encodeURIComponent(youtube)}" title="Question video" loading="lazy" allowfullscreen referrerpolicy="strict-origin-when-cross-origin"></iframe>`;
  return `<video class="media-video" controls preload="none"><source src="${safe}">Your browser does not support video.</video>`;
}

function getYouTubeId(url) {
  try {
    const u = new URL(url);
    if (u.hostname.includes("youtu.be")) return u.pathname.slice(1);
    if (u.hostname.includes("youtube.com")) return u.searchParams.get("v") || u.pathname.split("/").pop();
  } catch (_) {}
  return null;
}

function renderChapters() {
  const grid = $("#chaptersGrid");
  if (!state.chapters.length) {
    grid.innerHTML = `<div class="state-message">NO CHAPTERS AVAILABLE</div>`;
    return;
  }
  grid.innerHTML = state.chapters.map((c, i) => {
    const count = state.questions.filter(q => q.chapter_id === c.id).length;
    return `<article class="chapter-card" onclick="selectChapter('${c.id}')">
      <div class="no">CHAPTER ${String(i + 1).padStart(2, "0")}</div>
      <h3>${escapeHtml(c.title)}</h3>
      <p>${escapeHtml(c.description || "Archive chapter")} · ${count} question${count === 1 ? "" : "s"}</p>
    </article>`;
  }).join("");
}

function selectChapter(id) {
  $("#chapterFilter").value = id;
  $("#questions").scrollIntoView({ behavior: "smooth" });
  renderQuestions();
}

function renderContact() {
  const number = (state.settings.whatsapp_number || "").replace(/[^\d]/g, "");
  const message = state.settings.whatsapp_message || "Hello, I found a problem with a question.";
  const email = state.settings.contact_email || "";
  let html = "";
  if (number) html += `<a class="btn btn-gold" target="_blank" rel="noopener noreferrer" href="https://wa.me/${number}?text=${encodeURIComponent(message)}">WHATSAPP</a>`;
  if (email) html += `<a class="btn" href="mailto:${escapeAttr(email)}">EMAIL</a>`;
  $("#contactActions").innerHTML = html || `<span class="state-message">Contact options are currently unavailable.</span>`;
}

window.toggleBox = (id) => {
  const el = document.getElementById(id);
  if (el) el.classList.toggle("open");
};

window.copyQuestion = async (id) => {
  const q = state.questions.find(x => String(x.id) === String(id));
  if (!q) return;
  const text = `${q.title}\n\n${q.question_text}`;
  try {
    await navigator.clipboard.writeText(text);
    toast("Question copied successfully.");
  } catch (_) {
    toast("Clipboard is not available in this browser.");
  }
};

window.reportQuestion = (id) => {
  const q = state.questions.find(x => String(x.id) === String(id));
  if (!q) return;
  const number = (state.settings.whatsapp_number || "").replace(/[^\d]/g, "");
  if (!number) { toast("WhatsApp contact is not configured."); return; }
  const message = `Hello, I found a problem with:\n\nQuestion #${q.id}\n${q.title}`;
  window.open(`https://wa.me/${number}?text=${encodeURIComponent(message)}`, "_blank", "noopener");
};

function setQuestionsState(message) { $("#questionsState").textContent = message; }

function toast(message) {
  const region = $("#toastRegion");
  const el = document.createElement("div");
  el.className = "toast";
  el.textContent = message;
  region.appendChild(el);
  setTimeout(() => el.remove(), 3200);
}

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, ch => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#039;" }[ch]));
}
function escapeAttr(value) { return escapeHtml(value); }
