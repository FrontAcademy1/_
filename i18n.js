/* QUESTION ARCHIVE — bilingual UI helper */
(function () {
  const KEY = "question_archive_language";
  const dict = {
    ar: {
      HOME:"الرئيسية", CHAPTERS:"الفصول", QUESTIONS:"الأسئلة", CONTACT:"تواصل",
      "CASE FILE 001 · EDUCATIONAL ARCHIVE":"ملف رقم 001 · الأرشيف التعليمي",
      "A PLACE FOR QUESTIONS,":"مكان للأسئلة،", "ANSWERS & EXPLANATIONS.":"الإجابات والشروحات.",
      "EXPLORE ARCHIVE":"استكشف الأرشيف", "TOTAL QUESTIONS":"إجمالي الأسئلة", "TOTAL CHAPTERS":"إجمالي الفصول", "TOTAL CATEGORIES":"إجمالي التصنيفات",
      "THE MAIN FILES":"الملفات الرئيسية", "INDEX OF FILES":"فهرس الملفات", "ABOUT THE ARCHIVE":"عن الأرشيف", "FINAL NOTE":"ملاحظة أخيرة",
      "QUESTIONS":"الأسئلة", "CHAPTERS":"الفصول", "FOUND A PROBLEM?":"وجدت مشكلة؟",
      "ALL CHAPTERS":"كل الفصول", "ALL CATEGORIES":"كل التصنيفات", "NO RESULTS FOUND":"لا توجد نتائج", "NO QUESTIONS FOUND":"لا توجد أسئلة",
      "NO CHAPTERS AVAILABLE":"لا توجد فصول متاحة", "WHATSAPP":"واتساب", "EMAIL":"البريد الإلكتروني", "CONTACT OPTIONS ARE CURRENTLY UNAVAILABLE.":"خيارات التواصل غير متاحة حاليًا.",
      "SHOW ANSWER":"عرض الإجابة", "SHOW EXPLANATION":"عرض الشرح", "SHOW CODE":"عرض الكود", "COPY QUESTION":"نسخ السؤال", "REPORT / CONTACT":"إبلاغ / تواصل",
      "Question copied successfully.":"تم نسخ السؤال بنجاح.", "Clipboard is not available in this browser.":"النسخ غير متاح في هذا المتصفح.",
      "Loading Questions...":"جاري تحميل الأسئلة...", "Loading contact...":"جاري تحميل بيانات التواصل...", "Contact options are currently unavailable.":"خيارات التواصل غير متاحة حاليًا.",
      "DASHBOARD":"لوحة التحكم", "SETTINGS":"الإعدادات", "ACCOUNT":"الحساب", "LOGOUT":"تسجيل الخروج", "CONTROL ROOM":"غرفة التحكم",
      "PUBLISHED":"منشور", "RECENT FILES":"أحدث الملفات", "RECENT QUESTIONS":"أحدث الأسئلة", "FILE MANAGEMENT":"إدارة الملفات", "INDEX MANAGEMENT":"إدارة الفصول", "TAXONOMY":"التصنيفات", "PUBLIC CONFIGURATION":"الإعدادات العامة", "AUTHENTICATED SESSION":"جلسة مسجلة",
      "+ ADD QUESTION":"+ إضافة سؤال", "+ ADD CHAPTER":"+ إضافة فصل", "+ ADD CATEGORY":"+ إضافة تصنيف", "SAVE SETTINGS":"حفظ الإعدادات", "RESTRICTED AREA":"منطقة مقيدة", "ADMIN ACCESS":"دخول الأدمن", "LOGIN":"دخول", "RETURN TO ARCHIVE":"← العودة للأرشيف",
      "Site Name":"اسم الموقع", "Contact Email":"البريد الإلكتروني", "Site Description":"وصف الموقع", "WhatsApp Number":"رقم واتساب", "WhatsApp Default Message":"رسالة واتساب الافتراضية", "Footer Text":"نص التذييل",
      "Search questions...":"ابحث في الأسئلة...", "TOTAL QUESTIONS":"إجمالي الأسئلة", "CHAPTERS":"الفصول", "CATEGORIES":"التصنيفات", "ACTIONS":"الإجراءات", "TITLE":"العنوان", "CATEGORY":"التصنيف", "CHAPTER":"الفصل", "CREATED":"تاريخ الإنشاء",
      "EDIT":"تعديل", "DELETE":"حذف", "SAVE":"حفظ", "CANCEL":"إلغاء", "Published":"منشور", "Role:":"الدور:"
    },
    en: {}
  };
  dict.en = Object.keys(dict.ar).reduce((o,k)=>{o[k]=k;return o;},{});
  let lang = localStorage.getItem(KEY) || "ar";
  window.QA_I18N = { dict, get:()=>lang, t:(s)=>dict[lang]?.[s] ?? s };
  function apply() {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    document.querySelectorAll("[data-i18n]").forEach(el => { el.textContent = QA_I18N.t(el.dataset.i18n); });
    document.querySelectorAll("[data-i18n-placeholder]").forEach(el => { el.placeholder = QA_I18N.t(el.dataset.i18nPlaceholder); });
    const b = document.getElementById("languageToggle");
    if (b) { b.textContent = lang === "ar" ? "EN" : "عربي"; b.setAttribute("aria-label", lang === "ar" ? "Switch to English" : "التبديل إلى العربية"); }
    window.dispatchEvent(new CustomEvent("qa-language-change", { detail: { lang } }));
  }
  function addToggle() {
    if (document.getElementById("languageToggle")) return;
    const button = document.createElement("button");
    button.id = "languageToggle"; button.className = "language-toggle"; button.type = "button";
    button.addEventListener("click", () => { lang = lang === "ar" ? "en" : "ar"; localStorage.setItem(KEY, lang); apply(); });
    const host = document.querySelector(".nav-wrap") || document.querySelector(".admin-top");
    if (host) host.appendChild(button);
  }
  window.addEventListener("DOMContentLoaded", () => { addToggle(); apply(); });
  window.QA_applyLanguage = apply;
})();
