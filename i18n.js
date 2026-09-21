/* =========================================================
   QUESTION ARCHIVE — I18N
   Arabic / English Language System
   ========================================================= */

(() => {
  "use strict";

  const STORAGE_KEY = "question_archive_language";

  const translations = {
    en: {
      // General
      site_name: "QUESTION ARCHIVE",
      site_description: "Your personal archive of questions, answers and explanations.",

      home: "HOME",
      chapters: "CHAPTERS",
      questions: "QUESTIONS",
      contact: "CONTACT",

      explore_archive: "EXPLORE ARCHIVE",
      latest_questions: "LATEST QUESTIONS",
      about_archive: "ABOUT THE ARCHIVE",

      total_questions: "TOTAL QUESTIONS",
      total_chapters: "TOTAL CHAPTERS",
      total_categories: "TOTAL CATEGORIES",

      search: "Search",
      search_placeholder: "Search questions...",
      all: "ALL",
      category: "CATEGORY",
      chapter: "CHAPTER",

      show_answer: "SHOW ANSWER",
      hide_answer: "HIDE ANSWER",

      show_explanation: "SHOW EXPLANATION",
      hide_explanation: "HIDE EXPLANATION",

      copy_question: "COPY QUESTION",
      report_contact: "REPORT / CONTACT",

      answer: "ANSWER",
      explanation: "EXPLANATION",

      no_questions: "NO QUESTIONS FOUND",
      no_results: "NO RESULTS FOUND",
      no_chapters: "NO CHAPTERS AVAILABLE",

      loading_questions: "Loading questions...",
      loading_chapters: "Loading chapters...",
      loading: "Loading...",

      question_copied: "Question copied successfully.",
      copy_failed: "Unable to copy the question.",

      contact_title: "CONTACT",
      contact_text: "Found a problem? Contact us and let us know.",
      contact_us: "CONTACT US",

      footer_contact: "CONTACT",
      footer_text: "© 2026 Question Archive",

      // Admin
      admin_access: "ADMIN ACCESS",
      email: "Email",
      password: "Password",
      login: "LOGIN",
      logout: "LOGOUT",
      dashboard: "DASHBOARD",
      account: "ACCOUNT",
      settings: "SETTINGS",

      admin_questions: "QUESTIONS",
      admin_chapters: "CHAPTERS",
      admin_categories: "CATEGORIES",

      add_question: "ADD QUESTION",
      edit: "EDIT",
      delete: "DELETE",
      save: "SAVE",
      cancel: "CANCEL",
      update: "UPDATE",

      question_title: "QUESTION TITLE",
      question_text: "QUESTION TEXT",
      image_url: "IMAGE URL",
      video_url: "VIDEO URL",
      optional_code: "OPTIONAL CODE",
      published: "PUBLISHED",

      add_chapter: "ADD CHAPTER",
      chapter_title: "CHAPTER TITLE",
      description: "DESCRIPTION",
      order: "ORDER",

      add_category: "ADD CATEGORY",
      category_name: "CATEGORY NAME",
      slug: "SLUG",

      site_name_setting: "SITE NAME",
      site_description_setting: "SITE DESCRIPTION",
      whatsapp_number: "WHATSAPP NUMBER",
      whatsapp_message: "WHATSAPP DEFAULT MESSAGE",
      contact_email: "CONTACT EMAIL",
      footer_text_setting: "FOOTER TEXT",

      save_settings: "SAVE SETTINGS",

      total: "TOTAL",
      recent_questions: "RECENT QUESTIONS",

      published_yes: "Published",
      published_no: "Draft",

      confirm_delete: "Are you sure you want to delete this item?",
      invalid_credentials: "Invalid email or password.",
      access_denied: "Access denied.",
      login_required: "Please login as an administrator.",
      saved_successfully: "Saved successfully.",
      deleted_successfully: "Deleted successfully.",
      error_occurred: "Something went wrong.",

      language: "LANGUAGE",
      arabic: "العربية",
      english: "English"
    },

    ar: {
      // General
      site_name: "أرشيف الأسئلة",
      site_description: "أرشيفك الشخصي للأسئلة والإجابات والشروحات.",

      home: "الرئيسية",
      chapters: "الفصول",
      questions: "الأسئلة",
      contact: "تواصل معنا",

      explore_archive: "استكشف الأرشيف",
      latest_questions: "أحدث الأسئلة",
      about_archive: "عن الأرشيف",

      total_questions: "إجمالي الأسئلة",
      total_chapters: "إجمالي الفصول",
      total_categories: "إجمالي التصنيفات",

      search: "بحث",
      search_placeholder: "ابحث عن الأسئلة...",
      all: "الكل",
      category: "التصنيف",
      chapter: "الفصل",

      show_answer: "إظهار الإجابة",
      hide_answer: "إخفاء الإجابة",

      show_explanation: "إظهار الشرح",
      hide_explanation: "إخفاء الشرح",

      copy_question: "نسخ السؤال",
      report_contact: "إبلاغ / تواصل",

      answer: "الإجابة",
      explanation: "الشرح",

      no_questions: "لا توجد أسئلة",
      no_results: "لا توجد نتائج",
      no_chapters: "لا توجد فصول متاحة",

      loading_questions: "جاري تحميل الأسئلة...",
      loading_chapters: "جاري تحميل الفصول...",
      loading: "جاري التحميل...",

      question_copied: "تم نسخ السؤال بنجاح.",
      copy_failed: "تعذر نسخ السؤال.",

      contact_title: "تواصل معنا",
      contact_text: "وجدت مشكلة؟ تواصل معنا وأخبرنا بها.",
      contact_us: "تواصل معنا",

      footer_contact: "تواصل معنا",
      footer_text: "© 2026 أرشيف الأسئلة",

      // Admin
      admin_access: "دخول الإدارة",
      email: "البريد الإلكتروني",
      password: "كلمة المرور",
      login: "تسجيل الدخول",
      logout: "تسجيل الخروج",
      dashboard: "لوحة التحكم",
      account: "الحساب",
      settings: "الإعدادات",

      admin_questions: "الأسئلة",
      admin_chapters: "الفصول",
      admin_categories: "التصنيفات",

      add_question: "إضافة سؤال",
      edit: "تعديل",
      delete: "حذف",
      save: "حفظ",
      cancel: "إلغاء",
      update: "تحديث",

      question_title: "عنوان السؤال",
      question_text: "نص السؤال",
      image_url: "رابط الصورة",
      video_url: "رابط الفيديو",
      optional_code: "كود اختياري",
      published: "منشور",

      add_chapter: "إضافة فصل",
      chapter_title: "عنوان الفصل",
      description: "الوصف",
      order: "الترتيب",

      add_category: "إضافة تصنيف",
      category_name: "اسم التصنيف",
      slug: "الرابط المختصر",

      site_name_setting: "اسم الموقع",
      site_description_setting: "وصف الموقع",
      whatsapp_number: "رقم واتساب",
      whatsapp_message: "رسالة واتساب الافتراضية",
      contact_email: "البريد الإلكتروني للتواصل",
      footer_text_setting: "نص الفوتر",

      save_settings: "حفظ الإعدادات",

      total: "الإجمالي",
      recent_questions: "أحدث الأسئلة",

      published_yes: "منشور",
      published_no: "مسودة",

      confirm_delete: "هل أنت متأكد أنك تريد حذف هذا العنصر؟",
      invalid_credentials: "البريد الإلكتروني أو كلمة المرور غير صحيحة.",
      access_denied: "تم رفض الوصول.",
      login_required: "يرجى تسجيل الدخول كمسؤول.",
      saved_successfully: "تم الحفظ بنجاح.",
      deleted_successfully: "تم الحذف بنجاح.",
      error_occurred: "حدث خطأ غير متوقع.",

      language: "اللغة",
      arabic: "العربية",
      english: "English"
    }
  };

  let currentLanguage =
    localStorage.getItem(STORAGE_KEY) || "en";

  if (!translations[currentLanguage]) {
    currentLanguage = "en";
  }

  function translate(key) {
    return (
      translations[currentLanguage]?.[key] ??
      translations.en[key] ??
      key
    );
  }

  function applyTranslations(root = document) {
    root.querySelectorAll("[data-i18n]").forEach((element) => {
      const key = element.dataset.i18n;
      element.textContent = translate(key);
    });

    root.querySelectorAll("[data-i18n-placeholder]").forEach((element) => {
      const key = element.dataset.i18nPlaceholder;
      element.placeholder = translate(key);
    });

    root.querySelectorAll("[data-i18n-title]").forEach((element) => {
      const key = element.dataset.i18nTitle;
      element.title = translate(key);
    });

    root.querySelectorAll("[data-i18n-aria-label]").forEach((element) => {
      const key = element.dataset.i18nAriaLabel;
      element.setAttribute("aria-label", translate(key));
    });
  }

  function updateDocumentDirection() {
    const isArabic = currentLanguage === "ar";

    document.documentElement.lang = currentLanguage;
    document.documentElement.dir = isArabic ? "rtl" : "ltr";

    document.body.classList.toggle("lang-ar", isArabic);
    document.body.classList.toggle("lang-en", !isArabic);

    document.body.setAttribute(
      "data-language",
      currentLanguage
    );
  }

  function updateLanguageButtons() {
    document.querySelectorAll("[data-language-button]").forEach((button) => {
      const targetLanguage = button.dataset.languageButton;

      button.classList.toggle(
        "active",
        targetLanguage === currentLanguage
      );

      button.setAttribute(
        "aria-pressed",
        targetLanguage === currentLanguage ? "true" : "false"
      );
    });

    document.querySelectorAll("[data-current-language]").forEach((element) => {
      element.textContent =
        currentLanguage === "ar" ? "العربية" : "English";
    });
  }

  function setLanguage(language) {
    if (!translations[language]) {
      return;
    }

    currentLanguage = language;

    localStorage.setItem(STORAGE_KEY, currentLanguage);

    updateDocumentDirection();
    applyTranslations();
    updateLanguageButtons();

    document.dispatchEvent(
      new CustomEvent("languageChanged", {
        detail: {
          language: currentLanguage
        }
      })
    );
  }

  function initLanguageSystem() {
    updateDocumentDirection();
    applyTranslations();
    updateLanguageButtons();

    document.addEventListener("click", (event) => {
      const button = event.target.closest("[data-language-button]");

      if (!button) {
        return;
      }

      const language = button.dataset.languageButton;

      setLanguage(language);
    });
  }

  window.QuestionArchiveI18n = {
    translate,
    setLanguage,
    getLanguage: () => currentLanguage,
    getTranslations: () => translations[currentLanguage],
    applyTranslations
  };

  if (document.readyState === "loading") {
    document.addEventListener(
      "DOMContentLoaded",
      initLanguageSystem
    );
  } else {
    initLanguageSystem();
  }
})();
