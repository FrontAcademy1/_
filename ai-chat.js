/* =========================================================
   QUESTION ARCHIVE — AI DEVELOPER
   ========================================================= */

(() => {

  "use strict";


  /* ---------------------------------------------------------
     CONFIG
  --------------------------------------------------------- */

  const AI_FUNCTION_NAME = "ai-chat";


  /* ---------------------------------------------------------
     DOM
  --------------------------------------------------------- */

  const chatMessages =
    document.getElementById("chatMessages");

  const messageInput =
    document.getElementById("messageInput");

  const sendBtn =
    document.getElementById("sendBtn");

  const stopBtn =
    document.getElementById("stopBtn");

  const newChatBtn =
    document.getElementById("newChatBtn");

  const typingIndicator =
    document.getElementById("typingIndicator");

  const languageSelect =
    document.getElementById("languageSelect");

  const selectedLanguage =
    document.getElementById("selectedLanguage");

  const connectionStatus =
    document.getElementById("connectionStatus");


  /* ---------------------------------------------------------
     STATE
  --------------------------------------------------------- */

  let conversation = [];

  let controller = null;

  let isSending = false;


  /* ---------------------------------------------------------
     SUPABASE
  --------------------------------------------------------- */

  if (!window.supabase) {
    showConnection(
      "Supabase غير محمل",
      false
    );

    return;
  }


  if (
    !window.SUPABASE_URL ||
    !window.SUPABASE_ANON_KEY
  ) {

    showConnection(
      "إعدادات Supabase ناقصة",
      false
    );

    return;
  }


  const supabaseClient =
    window.supabase.createClient(
      window.SUPABASE_URL,
      window.SUPABASE_ANON_KEY
    );


  /* ---------------------------------------------------------
     AUTH
  --------------------------------------------------------- */

  init();


  async function init() {

    try {

      const {
        data: {
          session
        }
      } =
        await supabaseClient.auth.getSession();


      if (!session) {

        redirectToAdmin();

        return;
      }


      const {
        data: profile,
        error
      } =
        await supabaseClient
          .from("profiles")
          .select("role, display_name")
          .eq("id", session.user.id)
          .maybeSingle();


      if (error) {
        throw error;
      }


      if (
        !profile ||
        profile.role !== "admin"
      ) {

        await supabaseClient.auth.signOut();

        redirectToAdmin();

        return;
      }


      showConnection(
        "متصل",
        true
      );


      setupEvents();

    } catch (error) {

      console.error(
        "AI initialization error:",
        error
      );

      showConnection(
        "فشل التحقق",
        false
      );

    }

  }


  function redirectToAdmin() {

    window.location.href =
      "admin.html";

  }


  /* ---------------------------------------------------------
     EVENTS
  --------------------------------------------------------- */

  function setupEvents() {

    sendBtn.addEventListener(
      "click",
      sendMessage
    );


    stopBtn.addEventListener(
      "click",
      stopGeneration
    );


    newChatBtn.addEventListener(
      "click",
      newChat
    );


    messageInput.addEventListener(
      "keydown",
      event => {

        if (
          event.key === "Enter" &&
          !event.shiftKey
        ) {

          event.preventDefault();

          sendMessage();

        }

      }
    );


    languageSelect.addEventListener(
      "change",
      updateLanguage
    );


    document
      .querySelectorAll(".quick-action")
      .forEach(button => {

        button.addEventListener(
          "click",
          () => {

            messageInput.value =
              button.dataset.prompt || "";

            messageInput.focus();

          }
        );

      });


    chatMessages.addEventListener(
      "click",
      handleChatClick
    );

  }


  /* ---------------------------------------------------------
     LANGUAGE
  --------------------------------------------------------- */

  function updateLanguage() {

    const value =
      languageSelect.value;

    const option =
      languageSelect.options[
        languageSelect.selectedIndex
      ];


    selectedLanguage.textContent =
      option
        ? option.textContent
        : value;

  }


  /* ---------------------------------------------------------
     SEND
  --------------------------------------------------------- */

  async function sendMessage() {

    if (isSending) {
      return;
    }


    const message =
      messageInput.value.trim();


    if (!message) {
      return;
    }


    isSending = true;

    setLoading(true);


    appendMessage(
      "user",
      message
    );


    messageInput.value = "";


    const language =
      languageSelect.value;


    conversation.push({
      role: "user",
      content: message
    });


    try {

      controller =
        new AbortController();


      const {
        data: {
          session
        }
      } =
        await supabaseClient.auth.getSession();


      if (!session) {

        redirectToAdmin();

        return;
      }


      const response =
        await fetch(
          `${window.SUPABASE_URL}/functions/v1/${AI_FUNCTION_NAME}`,
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",

              "Authorization":
                `Bearer ${session.access_token}`,

              "apikey":
                window.SUPABASE_ANON_KEY
            },

            body: JSON.stringify({
              message,
              language,
              history:
                conversation.slice(
                  -12
                )
            }),

            signal:
              controller.signal
          }
        );


      const raw =
        await response.text();


      let data;

      try {

        data =
          JSON.parse(raw);

      } catch {

        data = {
          error:
            raw ||
            "رد غير صالح من الخادم."
        };

      }


      if (!response.ok) {

        throw new Error(
          data.error ||
          `HTTP ${response.status}`
        );

      }


      const reply =
        data.reply ||
        data.message ||
        data.output ||
        "لم يصل رد من الذكاء الاصطناعي.";


      conversation.push({
        role: "assistant",
        content: reply
      });


      appendMessage(
        "assistant",
        reply
      );


    } catch (error) {

      if (
        error.name ===
        "AbortError"
      ) {

        appendMessage(
          "assistant",
          "تم إيقاف التوليد."
        );

      } else {

        console.error(
          "AI request error:",
          error
        );


        appendMessage(
          "assistant",
          `حصل خطأ أثناء الاتصال بالـAI:

${error.message}`
        );

      }

    } finally {

      controller = null;

      isSending = false;

      setLoading(false);

    }

  }


  /* ---------------------------------------------------------
     STOP
  --------------------------------------------------------- */

  function stopGeneration() {

    if (controller) {
      controller.abort();
    }

  }


  /* ---------------------------------------------------------
     NEW CHAT
  --------------------------------------------------------- */

  function newChat() {

    if (isSending) {
      return;
    }


    conversation = [];


    chatMessages.innerHTML = `
      <article class="message assistant-message">

        <div class="message-avatar">
          AI
        </div>

        <div class="message-content">

          <div class="message-meta">
            AI DEVELOPER
          </div>

          <div class="message-text">

            <h3>
              محادثة جديدة.
            </h3>

            <p>
              اكتب المشكلة البرمجية التي تريد حلها.
            </p>

          </div>

        </div>

      </article>
    `;


    messageInput.focus();

  }


  /* ---------------------------------------------------------
     UI
  --------------------------------------------------------- */

  function setLoading(
    loading
  ) {

    if (loading) {

      typingIndicator.classList.remove(
        "hidden"
      );

      sendBtn.classList.add(
        "hidden"
      );

      stopBtn.classList.remove(
        "hidden"
      );

      messageInput.disabled =
        true;

    } else {

      typingIndicator.classList.add(
        "hidden"
      );

      sendBtn.classList.remove(
        "hidden"
      );

      stopBtn.classList.add(
        "hidden"
      );

      messageInput.disabled =
        false;

      messageInput.focus();

    }

  }


  function showConnection(
    text,
    connected
  ) {

    connectionStatus.textContent =
      text;


    connectionStatus.style.color =
      connected
        ? "#b89455"
        : "#d99389";

  }


  /* ---------------------------------------------------------
     MESSAGE
  --------------------------------------------------------- */

  function appendMessage(
    role,
    text
  ) {

    const article =
      document.createElement(
        "article"
      );


    article.className =
      `message ${
        role === "user"
          ? "user-message"
          : "assistant-message"
      }`;


    const avatar =
      document.createElement(
        "div"
      );


    avatar.className =
      "message-avatar";


    avatar.textContent =
      role === "user"
        ? "YOU"
        : "AI";


    const content =
      document.createElement(
        "div"
      );


    content.className =
      "message-content";


    const meta =
      document.createElement(
        "div"
      );


    meta.className =
      "message-meta";


    meta.textContent =
      role === "user"
        ? "DEVELOPER"
        : "AI DEVELOPER";


    const messageText =
      document.createElement(
        "div"
      );


    messageText.className =
      "message-text";


    renderMarkdownLike(
      messageText,
      text
    );


    content.appendChild(
      meta
    );

    content.appendChild(
      messageText
    );


    article.appendChild(
      avatar
    );

    article.appendChild(
      content
    );


    chatMessages.appendChild(
      article
    );


    scrollChat();

  }


  /* ---------------------------------------------------------
     SIMPLE MARKDOWN / CODE
  --------------------------------------------------------- */

  function renderMarkdownLike(
    container,
    text
  ) {

    const parts =
      text.split(
        /```([\s\S]*?)```/g
      );


    parts.forEach(
      (part, index) => {

        if (index % 2 === 1) {

          let code =
            part.trim();


          let language =
            "CODE";


          const firstLine =
            code.match(
              /^([a-zA-Z0-9_+-]+)\n/
            );


          if (firstLine) {

            language =
              firstLine[1]
                .toUpperCase();

            code =
              code.replace(
                /^([a-zA-Z0-9_+-]+)\n/,
                ""
              );

          }


          const wrapper =
            document.createElement(
              "div"
            );


          wrapper.className =
            "code-wrapper";


          const header =
            document.createElement(
              "div"
            );


          header.className =
            "code-header";


          const languageLabel =
            document.createElement(
              "span"
            );


          languageLabel.textContent =
            language;


          const copyButton =
            document.createElement(
              "button"
            );


          copyButton.type =
            "button";

          copyButton.className =
            "copy-code";

          copyButton.textContent =
            "نسخ الكود";


          copyButton.dataset.code =
            code;


          const pre =
            document.createElement(
              "pre"
            );


          const codeElement =
            document.createElement(
              "code"
            );


          codeElement.textContent =
            code;


          pre.appendChild(
            codeElement
          );


          header.appendChild(
            languageLabel
          );

          header.appendChild(
            copyButton
          );


          wrapper.appendChild(
            header
          );

          wrapper.appendChild(
            pre
          );


          container.appendChild(
            wrapper
          );


        } else {

          const fragment =
            document.createDocumentFragment();


          const lines =
            part.split("\n");


          lines.forEach(
            line => {

              const p =
                document.createElement(
                  "p"
                );


              p.textContent =
                line;


              fragment.appendChild(
                p
              );

            }
          );


          container.appendChild(
            fragment
          );

        }

      }
    );

  }


  /* ---------------------------------------------------------
     COPY
  --------------------------------------------------------- */

  async function copyText(
    text
  ) {

    try {

      await navigator.clipboard.writeText(
        text
      );

      showToast(
        "تم نسخ الكود."
      );

    } catch {

      showToast(
        "تعذر نسخ الكود."
      );

    }

  }


  function handleChatClick(
    event
  ) {

    const button =
      event.target.closest(
        ".copy-code"
      );


    if (!button) {
      return;
    }


    copyText(
      button.dataset.code || ""
    );

  }


  /* ---------------------------------------------------------
     SCROLL
  --------------------------------------------------------- */

  function scrollChat() {

    requestAnimationFrame(
      () => {

        chatMessages.scrollTop =
          chatMessages.scrollHeight;

      }
    );

  }


  /* ---------------------------------------------------------
     TOAST
  --------------------------------------------------------- */

  function showToast(
    message
  ) {

    let region =
      document.getElementById(
        "toastRegion"
      );


    if (!region) {

      region =
        document.createElement(
          "div"
        );

      region.id =
        "toastRegion";

      region.style.position =
        "fixed";

      region.style.bottom =
        "20px";

      region.style.left =
        "20px";

      region.style.zIndex =
        "9999";

      document.body.appendChild(
        region
      );

    }


    const toast =
      document.createElement(
        "div"
      );


    toast.textContent =
      message;


    toast.style.background =
      "#19110c";

    toast.style.color =
      "#d7c6a4";

    toast.style.border =
      "1px solid rgba(184,148,85,.35)";

    toast.style.padding =
      "10px 14px";

    toast.style.borderRadius =
      "6px";

    toast.style.marginTop =
      "8px";

    toast.style.fontFamily =
      "Cairo, sans-serif";


    region.appendChild(
      toast
    );


    setTimeout(
      () => toast.remove(),
      2500
    );

  }

})();
