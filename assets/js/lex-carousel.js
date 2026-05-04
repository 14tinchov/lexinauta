/**
 * Carrusel de imágenes en .post-content + modal (dialog).
 * Marcado: ver _includes/carousel.html o bloque HTML equivalente.
 */
(function () {
  "use strict";

  var SEL_ROOT = ".post-content .lex-carousel";
  var ATTR_INIT = "data-lex-carousel-init";

  function pad2(n) {
    return String(n).padStart(2, "0");
  }

  function prefersReducedMotion() {
    try {
      return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    } catch (e) {
      return false;
    }
  }

  function normalizeDom(root) {
    var viewport = root.querySelector(".lex-carousel__viewport");
    var track = root.querySelector(".lex-carousel__track");
    if (viewport && track) {
      return { viewport: viewport, track: track };
    }
    viewport = document.createElement("div");
    viewport.className = "lex-carousel__viewport";
    track = document.createElement("div");
    track.className = "lex-carousel__track";
    var toMove = [];
    var ch = root.firstChild;
    while (ch) {
      var next = ch.nextSibling;
      if (ch.nodeType === 1 && ch.tagName !== "DIALOG") {
        toMove.push(ch);
      }
      ch = next;
    }
    toMove.forEach(function (node) {
      track.appendChild(node);
    });
    viewport.appendChild(track);
    root.insertBefore(viewport, root.firstChild);
    return { viewport: viewport, track: track };
  }

  function ensureSlideClass(track) {
    var figs = track.querySelectorAll("figure");
    figs.forEach(function (fig) {
      if (!fig.classList.contains("lex-carousel__slide")) {
        fig.classList.add("lex-carousel__slide");
      }
    });
  }

  function initOne(root) {
    if (root.getAttribute(ATTR_INIT)) return;
    var parts = normalizeDom(root);
    var viewport = parts.viewport;
    var track = parts.track;
    ensureSlideClass(track);
    var slides = Array.prototype.slice.call(track.querySelectorAll("figure.lex-carousel__slide"));
    var n = slides.length;
    if (n === 0) return;

    root.setAttribute(ATTR_INIT, "1");
    root.classList.add("lex-carousel--ready");

    var index = 0;
    var reduceMotion = prefersReducedMotion();

    var shell = document.createElement("div");
    shell.className = "lex-carousel__shell";
    root.insertBefore(shell, viewport);

    var frame = document.createElement("div");
    frame.className = "lex-carousel__frame";

    var terminal = document.createElement("div");
    terminal.className = "lex-carousel__terminal";
    var terminalText = document.createElement("span");
    terminalText.className = "lex-carousel__terminal-text";
    terminalText.setAttribute("aria-live", "polite");
    var terminalDots = document.createElement("span");
    terminalDots.className = "lex-carousel__terminal-dots";
    terminalDots.setAttribute("aria-hidden", "true");
    for (var dotI = 0; dotI < 3; dotI++) {
      var dot = document.createElement("span");
      dot.className = "lex-carousel__terminal-dot";
      if (dotI === 1) dot.classList.add("is-pulse");
      terminalDots.appendChild(dot);
    }
    terminal.appendChild(terminalText);
    terminal.appendChild(terminalDots);

    var stage = document.createElement("div");
    stage.className = "lex-carousel__stage";

    var btnPrevDesktop = document.createElement("button");
    btnPrevDesktop.type = "button";
    btnPrevDesktop.className = "lex-carousel__btn lex-carousel__btn--desktop lex-carousel__btn--prev";
    btnPrevDesktop.setAttribute("aria-label", "Imagen anterior");
    btnPrevDesktop.innerHTML = "<span aria-hidden=\"true\">‹</span>";

    var btnNextDesktop = document.createElement("button");
    btnNextDesktop.type = "button";
    btnNextDesktop.className = "lex-carousel__btn lex-carousel__btn--desktop lex-carousel__btn--next";
    btnNextDesktop.setAttribute("aria-label", "Imagen siguiente");
    btnNextDesktop.innerHTML = "<span aria-hidden=\"true\">›</span>";

    var badge = document.createElement("span");
    badge.className = "lex-carousel__badge";
    badge.setAttribute("aria-live", "polite");

    stage.appendChild(viewport);
    stage.appendChild(btnPrevDesktop);
    stage.appendChild(btnNextDesktop);
    stage.appendChild(badge);

    var mobileNav = document.createElement("div");
    mobileNav.className = "lex-carousel__mobile-nav";
    mobileNav.setAttribute("role", "group");
    mobileNav.setAttribute("aria-label", "Navegación del carrusel");

    var btnPrevMobile = document.createElement("button");
    btnPrevMobile.type = "button";
    btnPrevMobile.className = "lex-carousel__btn lex-carousel__btn--mobile lex-carousel__btn--prev";
    btnPrevMobile.setAttribute("aria-label", "Imagen anterior");
    btnPrevMobile.innerHTML = "<span aria-hidden=\"true\">‹</span>";

    var mobileCounter = document.createElement("span");
    mobileCounter.className = "lex-carousel__counter lex-carousel__counter--mobile";
    mobileCounter.setAttribute("aria-live", "polite");

    var btnNextMobile = document.createElement("button");
    btnNextMobile.type = "button";
    btnNextMobile.className = "lex-carousel__btn lex-carousel__btn--mobile lex-carousel__btn--next";
    btnNextMobile.setAttribute("aria-label", "Imagen siguiente");
    btnNextMobile.innerHTML = "<span aria-hidden=\"true\">›</span>";

    mobileNav.appendChild(btnPrevMobile);
    mobileNav.appendChild(mobileCounter);
    mobileNav.appendChild(btnNextMobile);

    frame.appendChild(terminal);
    frame.appendChild(stage);
    shell.appendChild(frame);
    shell.appendChild(mobileNav);

    root.setAttribute("role", "region");
    root.setAttribute("aria-roledescription", "carrusel");
    if (!root.getAttribute("aria-label")) {
      root.setAttribute("aria-label", "Galería de imágenes");
    }
    if (!root.hasAttribute("tabindex")) {
      root.tabIndex = 0;
    }

    var dialog = document.createElement("dialog");
    dialog.className = "lex-carousel__dialog";
    dialog.setAttribute("aria-modal", "true");
    dialog.setAttribute("aria-label", "Vista ampliada");

    var dialogInner = document.createElement("div");
    dialogInner.className = "lex-carousel__dialog-inner";

    var btnClose = document.createElement("button");
    btnClose.type = "button";
    btnClose.className = "lex-carousel__dialog-close";
    btnClose.setAttribute("aria-label", "Cerrar vista ampliada");
    btnClose.innerHTML = "<span aria-hidden=\"true\">×</span>";

    var dialogFigure = document.createElement("figure");
    dialogFigure.className = "lex-carousel__dialog-figure";
    var dialogImg = document.createElement("img");
    dialogImg.className = "lex-carousel__dialog-img";
    dialogImg.alt = "";
    dialogFigure.appendChild(dialogImg);

    var dialogBar = document.createElement("div");
    dialogBar.className = "lex-carousel__dialog-bar";
    var dPrev = document.createElement("button");
    dPrev.type = "button";
    dPrev.className = "lex-carousel__btn lex-carousel__btn--prev lex-carousel__btn--dialog";
    dPrev.setAttribute("aria-label", "Imagen anterior");
    dPrev.innerHTML = "<span aria-hidden=\"true\">‹</span>";
    var dCounter = document.createElement("span");
    dCounter.className = "lex-carousel__counter lex-carousel__counter--dialog";
    dCounter.setAttribute("aria-live", "polite");
    var dNext = document.createElement("button");
    dNext.type = "button";
    dNext.className = "lex-carousel__btn lex-carousel__btn--next lex-carousel__btn--dialog";
    dNext.setAttribute("aria-label", "Imagen siguiente");
    dNext.innerHTML = "<span aria-hidden=\"true\">›</span>";
    dialogBar.appendChild(dPrev);
    dialogBar.appendChild(dCounter);
    dialogBar.appendChild(dNext);

    dialogInner.appendChild(btnClose);
    dialogInner.appendChild(dialogFigure);
    dialogInner.appendChild(dialogBar);
    dialog.appendChild(dialogInner);
    root.appendChild(dialog);

    function slideImg(i) {
      var fig = slides[i];
      if (!fig) return null;
      return fig.querySelector("img");
    }

    function updateCounter() {
      var current = index + 1;
      var compact = current + " / " + n;
      terminalText.textContent = "SYSTEM_LOG // IMAGE: " + pad2(current) + "/" + pad2(n);
      badge.textContent = current + "/ " + n;
      mobileCounter.textContent = compact;
      dCounter.textContent = compact;
    }

    function setBtnState() {
      var atStart = index <= 0;
      var atEnd = index >= n - 1;
      btnPrevDesktop.disabled = atStart;
      btnNextDesktop.disabled = atEnd;
      btnPrevMobile.disabled = atStart;
      btnNextMobile.disabled = atEnd;
      dPrev.disabled = atStart;
      dNext.disabled = atEnd;
    }

    function applyTrackTransform() {
      var w = viewport.offsetWidth;
      if (w <= 0) return;
      track.style.width = n * w + "px";
      slides.forEach(function (slide) {
        slide.style.flex = "0 0 " + w + "px";
        slide.style.width = w + "px";
        slide.style.maxWidth = w + "px";
      });
      var x = -index * w;
      if (reduceMotion) {
        track.style.transition = "none";
      } else {
        track.style.transition = "";
      }
      track.style.transform = "translate3d(" + x + "px,0,0)";
    }

    function syncDialogImage() {
      var srcImg = slideImg(index);
      if (!srcImg) return;
      dialogImg.src = srcImg.src;
      dialogImg.alt = srcImg.alt || "";
    }

    function go(delta, fromDialog) {
      var next = index + delta;
      if (next < 0 || next >= n) return;
      index = next;
      applyTrackTransform();
      updateCounter();
      setBtnState();
      if (fromDialog && dialog.open) {
        syncDialogImage();
      }
    }

    function openDialog(opener) {
      dialog.__lexOpener = opener || null;
      syncDialogImage();
      updateCounter();
      setBtnState();
      try {
        dialog.showModal();
      } catch (e) {
        return;
      }
      btnClose.focus();
    }

    function closeDialog() {
      try {
        dialog.close();
      } catch (e2) {}
    }

    btnPrevDesktop.addEventListener("click", function () {
      go(-1, false);
    });
    btnNextDesktop.addEventListener("click", function () {
      go(1, false);
    });
    btnPrevMobile.addEventListener("click", function () {
      go(-1, false);
    });
    btnNextMobile.addEventListener("click", function () {
      go(1, false);
    });
    dPrev.addEventListener("click", function () {
      go(-1, true);
    });
    dNext.addEventListener("click", function () {
      go(1, true);
    });

    btnClose.addEventListener("click", closeDialog);

    dialog.addEventListener("close", function () {
      var op = dialog.__lexOpener;
      dialog.__lexOpener = null;
      if (op && typeof op.focus === "function") {
        try {
          op.focus();
        } catch (e) {}
      }
    });

    viewport.addEventListener("click", function (ev) {
      if (ev.target.closest("button")) return;
      var img = ev.target.closest(".lex-carousel__slide img");
      if (!img || !viewport.contains(img)) return;
      openDialog(img);
    });

    dialog.addEventListener("keydown", function (ev) {
      if (ev.key === "ArrowLeft") {
        ev.preventDefault();
        go(-1, true);
      } else if (ev.key === "ArrowRight") {
        ev.preventDefault();
        go(1, true);
      }
    });

    root.addEventListener("keydown", function (ev) {
      if (dialog.open) return;
      if (ev.key === "ArrowLeft") {
        ev.preventDefault();
        go(-1, false);
      } else if (ev.key === "ArrowRight") {
        ev.preventDefault();
        go(1, false);
      }
    });

    if (typeof ResizeObserver !== "undefined") {
      var ro = new ResizeObserver(function () {
        applyTrackTransform();
      });
      ro.observe(viewport);
    } else {
      window.addEventListener("resize", applyTrackTransform);
    }

    updateCounter();
    setBtnState();
    applyTrackTransform();

    if (typeof window !== "undefined") {
      window.addEventListener("pageshow", function (ev) {
        if (ev.persisted) applyTrackTransform();
      });
    }
  }

  function init() {
    var roots = document.querySelectorAll(SEL_ROOT);
    for (var i = 0; i < roots.length; i++) {
      initOne(roots[i]);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
