/* QUESTION ARCHIVE — PUBLIC APP */
const { createClient } = window.supabase;
const db = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
const $=s=>document.querySelector(s);
const state={questions:[],chapters:[],categories:[],settings:{}};

document.addEventListener("DOMContentLoaded",async()=>{
 createBubbles();bindNavigation();bindFilters();await loadPublicData();
});
function createBubbles(){const box=$("#bubbles");if(!box)return;for(let i=0;i<18;i++){const b=document.createElement("span"),s=20+Math.random()*90;b.className="bubble";b.style.width=b.style.height=`${s}px`;b.style.left=`${Math.random()*100}%`;b.style.animationDuration=`${18+Math.random()*25}s`;b.style.animationDelay=`${-Math.random()*30}s`;box.appendChild(b)}}
function bindNavigation(){const toggle=$("#menuToggle"),nav=$("#mainNav");toggle?.addEventListener("click",()=>{const open=nav.classList.toggle("open");toggle.setAttribute("aria-expanded",open)});nav?.querySelectorAll("a").forEach(a=>a.addEventListener("click",()=>nav.classList.remove("open")))}
function bindFilters(){["searchInput","chapterFilter","categoryFilter"].forEach(id=>document.getElementById(id)?.addEventListener(id==="searchInput"?"input":"change",renderQuestions));$("#clearFilters")?.addEventListener("click",()=>{$("#searchInput").value="";$("#chapterFilter").value="";$("#categoryFilter").value="";renderQuestions()})}
async function loadPublicData(){
 setQuestionsState(QA_I18N.t("LOADING"));
 try{
  const [q,ch,cat,settings]=await Promise.all([
   db.from("questions").select("id,title,question_text,answer,explanation,chapter_id,category_id,image_url,video_url,code,created_at").eq("published",true).order("created_at",{ascending:false}),
   db.from("chapters").select("id,title,description,display_order,created_at").order("display_order",{ascending:true}),
   db.from("categories").select("id,name,slug,description,created_at").order("name",{ascending:true}),
   db.from("site_settings").select("key,value").in("key",["site_name","site_description","whatsapp_number","whatsapp_message","contact_email","footer_text"])
  ]);
  for(const r of [q,ch,cat,settings])if(r.error)throw r.error;
  state.questions=q.data||[];state.chapters=ch.data||[];state.categories=cat.data||[];state.settings=Object.fromEntries((settings.data||[]).map(x=>[x.key,x.value]));
  renderAll();
 }catch(e){console.error(e);setQuestionsState(QA_I18N.t("DATA_ERROR"));toast(QA_I18N.t("DATA_ERROR"))}
}
function renderAll(){renderFilters();renderQuestions();renderChapters();renderStats();renderContact();document.title=state.settings.site_name||"QUESTION ARCHIVE";$("#footerText").textContent=state.settings.footer_text||"© 2026 Question Archive"}
function renderStats(){$("#totalQuestions").textContent=state.questions.length;$("#totalChapters").textContent=state.chapters.length;$("#totalCategories").textContent=state.categories.length}
function renderFilters(){
 const chap=state.chapters.map(c=>`<option value="${attr(c.id)}">${esc(c.title)}</option>`).join("");
 const cat=state.categories.map(c=>`<option value="${attr(c.id)}">${esc(c.name)}</option>`).join("");
 $("#chapterFilter").innerHTML=`<option value="">${esc(QA_I18N.t("ALL_CHAPTERS"))}</option>`+chap;
 $("#categoryFilter").innerHTML=`<option value="">${esc(QA_I18N.t("ALL_CATEGORIES"))}</option>`+cat;
}
function renderQuestions(){
 const search=$("#searchInput").value.trim().toLowerCase(),cid=$("#chapterFilter").value,catid=$("#categoryFilter").value;
 const list=state.questions.filter(q=>{const c=state.chapters.find(x=>x.id===q.chapter_id),cat=state.categories.find(x=>x.id===q.category_id);const hay=[q.title,q.question_text,c?.title,cat?.name].filter(Boolean).join(" ").toLowerCase();return(!search||hay.includes(search))&&(!cid||q.chapter_id===cid)&&(!catid||q.category_id===catid)});
 $("#resultCount").textContent=list.length;
 if(!list.length){$("#questionsGrid").innerHTML="";setQuestionsState(search||cid||catid?QA_I18N.t("NO_RESULTS"):QA_I18N.t("NO_QUESTIONS"));return}
 setQuestionsState("");$("#questionsGrid").innerHTML=list.map(questionCard).join("");
}
function questionCard(q,index){
 const chapter=state.chapters.find(c=>c.id===q.chapter_id),cat=state.categories.find(c=>c.id===q.category_id);
 const image=q.image_url?`<div class="media-frame"><img src="${attr(q.image_url)}" alt="${attr(q.title)}" loading="lazy"></div>`:"";
 const video=buildVideo(q.video_url);
 return `<article class="question-card" id="question-${attr(q.id)}">
  <div class="question-number"><span>${String(index+1).padStart(2,"0")}</span><i></i></div>
  <div class="card-meta"><span>${esc(chapter?.title||QA_I18N.t("ARCHIVE"))}</span><span>${esc(cat?.name||QA_I18N.t("QUESTION"))}</span></div>
  <h3>${esc(q.title)}</h3>
  <div class="question-text">${esc(q.question_text||"")}</div>
  ${image}${video}
  <div class="card-actions">
   <button class="mini-btn" type="button" onclick="toggleBox(this,'answer-${attr(q.id)}','SHOW_ANSWER','HIDE_ANSWER')">${QA_I18N.t("SHOW_ANSWER")}</button>
   <button class="mini-btn" type="button" onclick="toggleBox(this,'explanation-${attr(q.id)}','SHOW_EXPLANATION','HIDE_EXPLANATION')">${QA_I18N.t("SHOW_EXPLANATION")}</button>
   ${q.code?`<button class="mini-btn" type="button" onclick="toggleBox(this,'code-${attr(q.id)}','SHOW_CODE','HIDE_CODE')">${QA_I18N.t("SHOW_CODE")}</button>`:""}
   <button class="mini-btn" type="button" onclick="copyQuestion('${attr(q.id)}')">${QA_I18N.t("COPY")}</button>
   <button class="mini-btn danger" type="button" onclick="reportQuestion('${attr(q.id)}')">${QA_I18N.t("REPORT")}</button>
  </div>
  <div class="answer-box reveal-box" id="answer-${attr(q.id)}">${esc(q.answer||QA_I18N.t("ANSWER_EMPTY"))}</div>
  <div class="answer-box reveal-box" id="explanation-${attr(q.id)}">${esc(q.explanation||QA_I18N.t("EXPLANATION_EMPTY"))}</div>
  ${q.code?`<pre class="answer-box reveal-box code-box" id="code-${attr(q.id)}"><code>${esc(q.code)}</code></pre>`:""}
 </article>`;
}
function buildVideo(url){if(!url)return"";const id=getYouTubeId(url);if(id)return`<div class="media-frame video-wrap"><iframe src="https://www.youtube.com/embed/${encodeURIComponent(id)}" title="${esc(QA_I18N.t("VIDEO"))}" loading="lazy" allowfullscreen></iframe></div>`;return`<div class="media-frame video-wrap"><video controls preload="metadata"><source src="${attr(url)}">Video</video></div>`}
function getYouTubeId(url){try{const u=new URL(url);if(u.hostname.includes("youtu.be"))return u.pathname.slice(1);if(u.hostname.includes("youtube.com"))return u.searchParams.get("v")||u.pathname.split("/").pop()}catch{}return null}
function renderChapters(){
 const grid=$("#chaptersGrid");if(!state.chapters.length){grid.innerHTML=`<div class="state-message">${esc(QA_I18N.t("NO_CHAPTERS"))}</div>`;return}
 grid.innerHTML=state.chapters.map((c,i)=>{const count=state.questions.filter(q=>q.chapter_id===c.id).length;return`<article class="chapter-card" onclick="selectChapter('${attr(c.id)}')"><span class="chapter-index">${String(i+1).padStart(2,"0")}</span><div><p>CHAPTER ${String(i+1).padStart(2,"0")}</p><h3>${esc(c.title)}</h3><small>${count} ${esc(QA_I18N.t("CHAPTER_QUESTIONS"))}</small></div><b>↙</b></article>`}).join("");
}
function selectChapter(id){$("#chapterFilter").value=id;$("#questions").scrollIntoView({behavior:"smooth",block:"start"});renderQuestions()}
function renderContact(){const n=(state.settings.whatsapp_number||"").replace(/\D/g,""),m=state.settings.whatsapp_message||"أهلًا، عندي مشكلة في أحد الأسئلة.",e=state.settings.contact_email||"";let h="";if(n)h+=`<a class="btn btn-gold" target="_blank" rel="noopener noreferrer" href="https://wa.me/${n}?text=${encodeURIComponent(m)}">${esc(QA_I18N.t("WHATSAPP"))}</a>`;if(e)h+=`<a class="btn" href="mailto:${attr(e)}">${esc(QA_I18N.t("EMAIL"))}</a>`;$("#contactActions").innerHTML=h||`<span class="state-message">${esc(QA_I18N.t("CONTACT_UNAVAILABLE"))}</span>`}
window.toggleBox=(button,id,showKey,hideKey)=>{const el=document.getElementById(id);if(!el)return;const open=el.classList.toggle("open");button.textContent=QA_I18N.t(open?hideKey:showKey)}
window.copyQuestion=async id=>{const q=state.questions.find(x=>String(x.id)===String(id));if(!q)return;try{await navigator.clipboard.writeText(`${q.title}\n\n${q.question_text}`);toast(QA_I18N.t("COPIED"))}catch{toast(QA_I18N.t("COPY_FAIL"))}}
window.reportQuestion=id=>{const q=state.questions.find(x=>String(x.id)===String(id));if(!q)return;const n=(state.settings.whatsapp_number||"").replace(/\D/g,"");if(!n){toast(QA_I18N.t("CONTACT_UNAVAILABLE"));return}const msg=`Question #${q.id}\n${q.title}`;window.open(`https://wa.me/${n}?text=${encodeURIComponent(msg)}`,"_blank","noopener")}
function setQuestionsState(m){$("#questionsState").textContent=m}
function toast(m){const r=$("#toastRegion"),e=document.createElement("div");e.className="toast";e.textContent=m;r.appendChild(e);setTimeout(()=>e.remove(),2800)}
function esc(v){return String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]))}
function attr(v){return esc(v)}
window.addEventListener("qa-language-change",()=>{const s=$("#searchInput");if(s)s.placeholder=QA_I18N.t("SEARCH_PLACEHOLDER");renderFilters();renderQuestions();renderChapters();renderContact();renderStats()});
