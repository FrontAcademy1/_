/* =========================================================
   QUESTION ARCHIVE — I18N
   Full Arabic / English language switcher
   ========================================================= */
(function () {
  "use strict";

  const STORAGE_KEY = "question_archive_language";

  const translations = {
    en: {
      "HOME":"HOME","CHAPTERS":"CHAPTERS","QUESTIONS":"QUESTIONS","CONTACT":"CONTACT",
      "CASE FILE 001 · EDUCATIONAL ARCHIVE":"CASE FILE 001 · EDUCATIONAL ARCHIVE",
      "A PLACE FOR QUESTIONS,":"A PLACE FOR QUESTIONS,","ANSWERS & EXPLANATIONS.":"ANSWERS & EXPLANATIONS.",
      "EXPLORE ARCHIVE":"EXPLORE ARCHIVE","TOTAL QUESTIONS":"TOTAL QUESTIONS","TOTAL CHAPTERS":"TOTAL CHAPTERS","TOTAL CATEGORIES":"TOTAL CATEGORIES",
      "THE MAIN FILES":"THE MAIN FILES","INDEX OF FILES":"INDEX OF FILES","ABOUT THE ARCHIVE":"ABOUT THE ARCHIVE","FINAL NOTE":"FINAL NOTE",
      "FOUND A PROBLEM?":"FOUND A PROBLEM?","ALL CHAPTERS":"ALL CHAPTERS","ALL CATEGORIES":"ALL CATEGORIES",
      "NO RESULTS FOUND":"NO RESULTS FOUND","NO QUESTIONS FOUND":"NO QUESTIONS FOUND","NO CHAPTERS AVAILABLE":"NO CHAPTERS AVAILABLE",
      "WHATSAPP":"WHATSAPP","EMAIL":"EMAIL","CONTACT OPTIONS ARE CURRENTLY UNAVAILABLE.":"CONTACT OPTIONS ARE CURRENTLY UNAVAILABLE.",
      "SHOW ANSWER":"SHOW ANSWER","SHOW EXPLANATION":"SHOW EXPLANATION","SHOW CODE":"SHOW CODE","COPY QUESTION":"COPY QUESTION","REPORT / CONTACT":"REPORT / CONTACT",
      "Question copied successfully.":"Question copied successfully.","Clipboard is not available in this browser.":"Clipboard is not available in this browser.",
      "Loading Questions...":"Loading Questions...","Loading contact...":"Loading contact...","Contact options are currently unavailable.":"Contact options are currently unavailable.",
      "DASHBOARD":"DASHBOARD","SETTINGS":"SETTINGS","ACCOUNT":"ACCOUNT","LOGOUT":"LOGOUT","CONTROL ROOM":"CONTROL ROOM",
      "PUBLISHED":"PUBLISHED","RECENT FILES":"RECENT FILES","RECENT QUESTIONS":"RECENT QUESTIONS","FILE MANAGEMENT":"FILE MANAGEMENT","INDEX MANAGEMENT":"INDEX MANAGEMENT","TAXONOMY":"TAXONOMY","PUBLIC CONFIGURATION":"PUBLIC CONFIGURATION","AUTHENTICATED SESSION":"AUTHENTICATED SESSION",
      "+ ADD QUESTION":"+ ADD QUESTION","+ ADD CHAPTER":"+ ADD CHAPTER","+ ADD CATEGORY":"+ ADD CATEGORY","SAVE SETTINGS":"SAVE SETTINGS","RESTRICTED AREA":"RESTRICTED AREA","ADMIN ACCESS":"ADMIN ACCESS","LOGIN":"LOGIN","RETURN TO ARCHIVE":"← RETURN TO ARCHIVE",
      "Site Name":"Site Name","Contact Email":"Contact Email","Site Description":"Site Description","WhatsApp Number":"WhatsApp Number","WhatsApp Default Message":"WhatsApp Default Message","Footer Text":"Footer Text",
      "Search questions...":"Search questions...","CATEGORIES":"CATEGORIES","ACTIONS":"ACTIONS","TITLE":"TITLE","CATEGORY":"CATEGORY","CHAPTER":"CHAPTER","CREATED":"CREATED",
      "EDIT":"EDIT","DELETE":"DELETE","SAVE":"SAVE","CANCEL":"CANCEL","Published":"Published","Role:":"Role:"
    },
    ar: {
      "HOME":"الرئيسية","CHAPTERS":"الفصول","QUESTIONS":"الأسئلة","CONTACT":"تواصل معنا",
      "CASE FILE 001 · EDUCATIONAL ARCHIVE":"ملف رقم 001 · الأرشيف التعليمي",
      "A PLACE FOR QUESTIONS,":"مكان للأسئلة،","ANSWERS & EXPLANATIONS.":"الإجابات والشروحات.",
      "EXPLORE ARCHIVE":"استكشف الأرشيف","TOTAL QUESTIONS":"إجمالي الأسئلة","TOTAL CHAPTERS":"إجمالي الفصول","TOTAL CATEGORIES":"إجمالي التصنيفات",
      "THE MAIN FILES":"الملفات الرئيسية","INDEX OF FILES":"فهرس الملفات","ABOUT THE ARCHIVE":"عن الأرشيف","FINAL NOTE":"ملاحظة أخيرة",
      "FOUND A PROBLEM?":"وجدت مشكلة؟","ALL CHAPTERS":"كل الفصول","ALL CATEGORIES":"كل التصنيفات",
      "NO RESULTS FOUND":"لا توجد نتائج","NO QUESTIONS FOUND":"لا توجد أسئلة","NO CHAPTERS AVAILABLE":"لا توجد فصول متاحة",
      "WHATSAPP":"واتساب","EMAIL":"البريد الإلكتروني","CONTACT OPTIONS ARE CURRENTLY UNAVAILABLE.":"خيارات التواصل غير متاحة حاليًا.",
      "SHOW ANSWER":"عرض الإجابة","SHOW EXPLANATION":"عرض الشرح","SHOW CODE":"عرض الكود","COPY QUESTION":"نسخ السؤال","REPORT / CONTACT":"إبلاغ / تواصل",
      "Question copied successfully.":"تم نسخ السؤال بنجاح.","Clipboard is not available in this browser.":"النسخ غير متاح في هذا المتصفح.",
      "Loading Questions...":"جاري تحميل الأسئلة...","Loading contact...":"جاري تحميل بيانات التواصل...","Contact options are currently unavailable.":"خيارات التواصل غير متاحة حاليًا.",
      "DASHBOARD":"لوحة التحكم","SETTINGS":"الإعدادات","ACCOUNT":"الحساب","LOGOUT":"تسجيل الخروج","CONTROL ROOM":"غرفة التحكم",
      "PUBLISHED":"منشور","RECENT FILES":"أحدث الملفات","RECENT QUESTIONS":"أحدث الأسئلة","FILE MANAGEMENT":"إدارة الأسئلة","INDEX MANAGEMENT":"إدارة الفصول","TAXONOMY":"التصنيفات","PUBLIC CONFIGURATION":"الإعدادات العامة","AUTHENTICATED SESSION":"جلسة مسجلة",
      "+ ADD QUESTION":"+ إضافة سؤال","+ ADD CHAPTER":"+ إضافة فصل","+ ADD CATEGORY":"+ إضافة تصنيف","SAVE SETTINGS":"حفظ الإعدادات","RESTRICTED AREA":"منطقة مقيدة","ADMIN ACCESS":"دخول الأدمن","LOGIN":"تسجيل الدخول","RETURN TO ARCHIVE":"← العودة للأرشيف",
      "Site Name":"اسم الموقع","Contact Email":"البريد الإلكتروني","Site Description":"وصف الموقع","WhatsApp Number":"رقم واتساب","WhatsApp Default Message":"رسالة واتساب الافتراضية","Footer Text":"نص التذييل",
      "Search questions...":"ابحث في الأسئلة...","CATEGORIES":"التصنيفات","ACTIONS":"الإجراءات","TITLE":"العنوان","CATEGORY":"التصنيف","CHAPTER":"الفصل","CREATED":"تاريخ الإنشاء",
      "EDIT":"تعديل","DELETE":"حذف","SAVE":"حفظ","CANCEL":"إلغاء","Published":"منشور","Role:":"الدور:"
    }
  };

  let language = localStorage.getItem(STORAGE_KEY) || "ar";
  if (!translations[language]) language = "ar";

  function t(text) {
    return translations[language][text] ?? translations.en[text] ?? text;
  }

  function applyLanguage() {
    const isArabic = language === "ar";

    document.documentElement.lang = language;
    document.documentElement.dir = isArabic ? "rtl" : "ltr";
    document.body.classList.toggle("lang-ar", isArabic);
    document.body.classList.toggle("lang-en", !isArabic);

    document.querySelectorAll("[data-i18n]").forEach((element) => {
      element.textContent = t(element.dataset.i18n);
    });

    document.querySelectorAll("[data-i18n-placeholder]").forEach((element) => {
      element.placeholder = t(element.dataset.i18nPlaceholder);
    });

    document.querySelectorAll("[data-i18n-title]").forEach((element) => {
      element.title = t(element.dataset.i18nTitle);
    });

    const toggle = document.getElementById("languageToggle");
    if (toggle) {
      toggle.textContent = isArabic ? "EN" : "عربي";
      toggle.setAttribute("aria-label", isArabic ? "Switch to English" : "التبديل إلى العربية");
      toggle.setAttribute("title", isArabic ? "Switch to English" : "التبديل إلى العربية");
    }

    document.dispatchEvent(new CustomEvent("qa-language-change", {
      detail: { language }
    }));
  }

  function createToggle() {
    if (document.getElementById("languageToggle")) return;

    const button = document.createElement("button");
    button.id = "languageToggle";
    button.className = "language-toggle";
    button.type = "button";

    button.addEventListener("click", function () {
      language = language === "ar" ? "en" : "ar";
      localStorage.setItem(STORAGE_KEY, language);
      document.body.classList.add("language-changing");
      applyLanguage();
      window.setTimeout(() => document.body.classList.remove("language-changing"), 160);
    });

    const host = document.querySelector(".nav-wrap") || document.querySelector(".admin-top") || document.querySelector("header");
    if (host) host.appendChild(button);
  }

  window.QA_I18N = {
    t,
    getLanguage: () => language,
    setLanguage: (next) => {
      if (!translations[next]) return;
      language = next;
      localStorage.setItem(STORAGE_KEY, language);
      applyLanguage();
    },
    apply: applyLanguage,
    translations
  };

  window.addEventListener("DOMContentLoaded", function () {
    createToggle();
    applyLanguage();
  });
})();
