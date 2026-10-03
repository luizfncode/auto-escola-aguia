(function () {
  var d = document;
  var hd = d.getElementById("hd");
  var nv = d.getElementById("nv");
  var bg = d.getElementById("bg");
  var tm = d.getElementById("tm");

  var rm = matchMedia("(prefers-reduced-motion: reduce)").matches;


  /* =========================================================
     CONTATOS
     Edite SOMENTE este bloco: todo o site é atualizado.
  ========================================================= */

  var CONTACT = {
    /* Somente números, com DDI + DDD (ex.: 556136274041) */
    whatsapp: "556136274041",

    /* Como o telefone aparece escrito no site */
    phoneDisplay: "(61) 3627-4041",

    /* Telefone para ligação (se vazio, usa o número do WhatsApp) */
    phone: "556136274041",

    /* Instagram: apenas o usuário, sem @ */
    instagram: "autoescolaaguia.valparaiso",

    /* Deixe "" para manter o texto "Adicionar..." */
    address: "Avenida 15 de Junho Qd 6 8 Sala 02 Valpáraiso II - VALPARAISO II, Valparaíso de Goiás - GO, 72870-106",
    hours: "08:00–12:00, 14:00–18:00"
  };


  /* =========================================================
     APLICAR CONTATOS NA PÁGINA
  ========================================================= */

  function applyContacts() {
    var phoneDigits = (CONTACT.phone || CONTACT.whatsapp)
      .replace(/\D/g, "");

    var instaUrl =
      "https://www.instagram.com/" + CONTACT.instagram + "/";


    /* -------------------------------------------------------
       WHATSAPP
       Mantém a mensagem (?text=...) já definida em cada link.
    ------------------------------------------------------- */

    d.querySelectorAll('a[href*="wa.me/"]').forEach(function (link) {
      var query = link.getAttribute("href").split("?")[1];

      link.setAttribute(
        "href",
        "https://wa.me/" + CONTACT.whatsapp +
          (query ? "?" + query : "")
      );

      /* Links que mostram o número escrito */
      if (/\d{4}/.test(link.textContent)) {
        link.textContent = CONTACT.phoneDisplay;
      }
    });


    /* -------------------------------------------------------
       TELEFONE
    ------------------------------------------------------- */

    d.querySelectorAll('a[href^="tel:"]').forEach(function (link) {
      link.setAttribute("href", "tel:+" + phoneDigits);
      link.textContent = CONTACT.phoneDisplay;
    });


    /* -------------------------------------------------------
       INSTAGRAM
    ------------------------------------------------------- */

    d.querySelectorAll('a[href*="instagram.com"]').forEach(function (link) {
      link.setAttribute("href", instaUrl);

      if (link.textContent.trim().charAt(0) === "@") {
        link.textContent = "@" + CONTACT.instagram;
      }
    });


    /* -------------------------------------------------------
       ENDEREÇO E HORÁRIO
    ------------------------------------------------------- */

    d.querySelectorAll(".ct dt").forEach(function (label) {
      var text = label.textContent.trim().toLowerCase();
      var value = label.nextElementSibling;

      if (!value) return;

      if (text === "endereço" && CONTACT.address) {
        value.textContent = CONTACT.address;
        value.classList.remove("mu");
      }

      if (text === "horário" && CONTACT.hours) {
        value.textContent = CONTACT.hours;
        value.classList.remove("mu");
      }
    });


    /* Aviso do mapa some quando o endereço for informado */

    var mapNote = d.querySelector(".map .mp");

    if (mapNote && CONTACT.address) {
      mapNote.textContent = CONTACT.address;
    }
  }


  applyContacts();


  /* =========================================================
     ANO DO FOOTER
  ========================================================= */

  d.getElementById("yr").textContent = new Date().getFullYear();


  /* =========================================================
     ENTRADA INICIAL
  ========================================================= */

  requestAnimationFrame(function () {
    requestAnimationFrame(function () {
      d.body.classList.add("ready");
    });
  });


  /* =========================================================
     REVEAL ON SCROLL
  ========================================================= */

  var io = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;

        var element = entry.target;

        /*
         * Timeline:
         * aplica um pequeno atraso diferente para cada etapa.
         */
        if (element.classList.contains("st")) {
          var index = [].indexOf.call(
            element.parentNode.children,
            element
          );

          element.style.transitionDelay =
            (index % 6 * 0.09) + "s";
        }

        element.classList.add("in");

        io.unobserve(element);
      });
    },
    {
      threshold: 0.15
    }
  );


  /* =========================================================
     ELEMENTOS OBSERVADOS
  ========================================================= */

  d.querySelectorAll(".rv, .clip, .st").forEach(function (element) {
    io.observe(element);
  });


  /* =========================================================
     MENU MOBILE
  ========================================================= */

  function closeMenu() {
    nv.classList.remove("o");
    bg.setAttribute("aria-expanded", "false");
    d.body.style.overflow = "";
  }


  bg.onclick = function () {
    var open = nv.classList.toggle("o");

    bg.setAttribute("aria-expanded", open);

    d.body.style.overflow = open
      ? "hidden"
      : "";
  };


  /*
   * Fecha o menu ao clicar em qualquer link.
   */
  nv.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", closeMenu);
  });


  /* =========================================================
     PARALLAX
  ========================================================= */

  var parallaxElements = d.querySelectorAll("[data-par]");

  var ticking = false;


  function updateScroll() {
    ticking = false;

    var y = scrollY;
    var h = innerHeight;


    /* -------------------------------------------------------
       HEADER
    ------------------------------------------------------- */

    hd.classList.toggle("s", y > h * 0.5);


    /* -------------------------------------------------------
       TIMELINE
    ------------------------------------------------------- */

    var timelineRect = tm.getBoundingClientRect();

    var progress = Math.max(
      0,
      Math.min(
        1,
        (h * 0.7 - timelineRect.top) /
          timelineRect.height
      )
    );

    tm.style.setProperty(
      "--p",
      progress * 100 + "%"
    );


    /* -------------------------------------------------------
       PARALLAX DAS IMAGENS
    ------------------------------------------------------- */

    if (!rm && innerWidth > 860) {
      parallaxElements.forEach(function (element) {
        var rect = element.getBoundingClientRect();

        /*
         * Ignora elementos muito fora da viewport.
         */
        if (
          rect.bottom < -100 ||
          rect.top > h + 100
        ) {
          return;
        }


        var image = element.querySelector("img") || element;

        var factor = parseFloat(
          element.dataset.par
        );


        /*
         * Calcula o deslocamento vertical
         * baseado na posição do elemento na tela.
         */
        var offset =
          (
            rect.top +
            rect.height / 2 -
            h / 2
          ) * factor;


        image.style.transform =
          "translate3d(0, " +
          offset.toFixed(1) +
          "px, 0) scale(1.1)";
      });
    }
  }


  /* =========================================================
     SCROLL
  ========================================================= */

  addEventListener(
    "scroll",
    function () {
      if (ticking) return;

      ticking = true;

      requestAnimationFrame(updateScroll);
    },
    {
      passive: true
    }
  );


  /* =========================================================
     RESIZE
  ========================================================= */

  addEventListener("resize", updateScroll);


  /* =========================================================
     PRIMEIRA ATUALIZAÇÃO
  ========================================================= */

  updateScroll();

})();
