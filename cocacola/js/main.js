if (window.AOS) {
  AOS.init({
    once: true,
    offset: 80,
    duration: 900
  });
}

(() => {
  const menuBtn = document.querySelector(".menu_btn");
  const menu = document.querySelector(".menu_layer_tablet");
  const dim = document.querySelector(".menu_dim");
  const closeBtn = document.querySelector(".menu_close");

  if (!menuBtn || !menu || !dim || !closeBtn) return;

  let lastFocus = null;

  menuBtn.setAttribute("aria-haspopup", "dialog");
  menuBtn.setAttribute("aria-controls", "menu_layer_tablet");
  menuBtn.setAttribute("aria-expanded", "false");

  menu.setAttribute("id", "menu_layer_tablet");
  menu.setAttribute("role", "dialog");
  menu.setAttribute("aria-modal", "true");
  menu.setAttribute("aria-hidden", "true");

  const getFocusable = () => {
    const selectors = [
      'a[href]',
      'button:not([disabled])',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      '[tabindex]:not([tabindex="-1"])'
    ].join(",");

    return Array.from(menu.querySelectorAll(selectors))
      .filter((el) => el.offsetParent !== null && !el.hasAttribute("disabled"));
  };

  const focusFirst = () => {
    const list = getFocusable();
    const target = list[0] || closeBtn;
    if (target) target.focus();
  };

  const openMenu = () => {
    lastFocus = document.activeElement;

    menu.classList.add("active");
    dim.classList.add("active");
    document.body.classList.add("menu-open");
    menuBtn.classList.add("is-open");

    menuBtn.setAttribute("aria-expanded", "true");
    menu.setAttribute("aria-hidden", "false");

    requestAnimationFrame(() => focusFirst());
  };

  const closeMenu = () => {
    menu.classList.remove("active");
    dim.classList.remove("active");
    document.body.classList.remove("menu-open");
    menuBtn.classList.remove("is-open");

    menuBtn.setAttribute("aria-expanded", "false");
    menu.setAttribute("aria-hidden", "true");

    if (lastFocus && typeof lastFocus.focus === "function") {
      lastFocus.focus();
    } else {
      menuBtn.focus();
    }

    lastFocus = null;
  };

  const trapTab = (e) => {
    if (e.key !== "Tab") return;

    const list = getFocusable();
    if (!list.length) {
      e.preventDefault();
      closeBtn.focus();
      return;
    }

    const first = list[0];
    const last = list[list.length - 1];

    if (e.shiftKey) {
      if (document.activeElement === first || document.activeElement === menu) {
        e.preventDefault();
        last.focus();
      }
    } else if (document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  };

  const onKeydown = (e) => {
    if (!menu.classList.contains("active")) return;

    if (e.key === "Escape") {
      e.preventDefault();
      closeMenu();
      return;
    }

    trapTab(e);
  };

  menuBtn.addEventListener("click", (e) => {
    e.preventDefault();
    if (!menu.classList.contains("active")) openMenu();
    else closeMenu();
  });

  closeBtn.addEventListener("click", (e) => {
    e.preventDefault();
    closeMenu();
  });

  dim.addEventListener("click", closeMenu);
  document.addEventListener("keydown", onKeydown);

  window.addEventListener("resize", () => {
    if (window.innerWidth > 1194 && menu.classList.contains("active")) {
      closeMenu();
    }
  });
})();

(() => {
  if (window.innerWidth <= 1194) return;

  const wrap = document.querySelector(".brand_wrap");
  if (!wrap) return;

  const track = wrap.querySelector("ul");
  const prevBtn = wrap.querySelector(".brand_prev");
  const nextBtn = wrap.querySelector(".brand_next");
  if (!track || !prevBtn || !nextBtn) return;

  const originals = Array.from(track.children).map((li) => li.cloneNode(true));

  const getPerView = () => {
    const w = window.innerWidth;
    if (w <= 767) return 1;
    if (w <= 1194) return 2;
    return 4;
  };

  let perView = getPerView();
  let index = perView;
  let moving = false;
  let itemW = 0;

  const setTransition = (on) => {
    track.style.transition = on ? "transform 520ms cubic-bezier(.22,.61,.36,1)" : "none";
  };

  const setPos = () => {
    track.style.transform = `translate3d(${-index * itemW}px, 0, 0)`;
  };

  const jumpTo = (newIndex) => {
    setTransition(false);
    index = newIndex;
    setPos();
    requestAnimationFrame(() => {
      requestAnimationFrame(() => setTransition(true));
    });
  };

  function build() {
    perView = getPerView();

    track.innerHTML = "";
    track.style.display = "flex";
    track.style.willChange = "transform";

    const head = originals.slice(0, perView).map((el) => el.cloneNode(true));
    const tail = originals.slice(-perView).map((el) => el.cloneNode(true));

    tail.forEach((el) => track.appendChild(el));
    originals.forEach((el) => track.appendChild(el.cloneNode(true)));
    head.forEach((el) => track.appendChild(el));

    itemW = wrap.clientWidth / perView;

    Array.from(track.children).forEach((li) => {
      li.style.flex = `0 0 ${itemW}px`;
    });

    index = perView;
    setTransition(false);
    setPos();
    requestAnimationFrame(() => setTransition(true));

    moving = false;
  }

  function go(dir) {
    if (moving) return;
    if (originals.length <= perView) return;

    moving = true;
    index += dir * perView;
    setPos();
  }

  track.addEventListener("transitionend", () => {
    const total = originals.length;
    const start = perView;
    const end = perView + total;

    if (index >= end) jumpTo(start);
    if (index < start) jumpTo(start + total - perView);

    moving = false;
  });

  prevBtn.addEventListener("click", (e) => {
    e.preventDefault();
    go(-1);
  });

  nextBtn.addEventListener("click", (e) => {
    e.preventDefault();
    go(1);
  });

  window.addEventListener("resize", build);
  build();
})();

$(function () {
  if (typeof $.fn.bxSlider !== "function") return;

  var $brand = $(".brand_wrap .brand_slider");
  if (!$brand.length) return;

  var brandSlider = null;

  function isTouchRange() {
    return window.innerWidth <= 1194;
  }

  function killFlexForBx(on) {
    if (on) {
      $brand.css({ display: "block" });
      $brand.children("li").css({ flex: "none" });
    } else {
      $brand.css({ display: "" });
      $brand.children("li").css({ flex: "" });
    }
  }

  function initBrandBx() {
    if (brandSlider) return;

    killFlexForBx(true);

    brandSlider = $brand.bxSlider({
      minSlides: 1,
      maxSlides: 4,
      moveSlides: 1,
      slideMargin: 0,
      pager: false,
      controls: false,
      touchEnabled: true,
      infiniteLoop: true,
      hideControlOnEnd: false,
      adaptiveHeight: false,
      responsive: true,
      speed: 520
    });

    $(".brand_prev")
      .off("click.brand")
      .on("click.brand", function (e) {
        e.preventDefault();
        if (brandSlider) brandSlider.goToPrevSlide();
      });

    $(".brand_next")
      .off("click.brand")
      .on("click.brand", function (e) {
        e.preventDefault();
        if (brandSlider) brandSlider.goToNextSlide();
      });

    refreshBrandBx();
  }

  function refreshBrandBx() {
    if (!brandSlider) return;

    var w = window.innerWidth;
    var perView = w <= 767 ? 1 : 2;
    var wrapW = $(".brand_wrap").innerWidth();
    var slideW = Math.floor(wrapW / perView);

    brandSlider.reloadSlider({
      minSlides: perView,
      maxSlides: perView,
      moveSlides: 1,
      slideWidth: slideW,
      slideMargin: 0,
      pager: false,
      controls: false,
      touchEnabled: true,
      infiniteLoop: true,
      responsive: true,
      speed: 520
    });
  }

  function destroyBrandBx() {
    if (!brandSlider) return;

    brandSlider.destroySlider();
    brandSlider = null;

    $(".brand_prev").off("click.brand");
    $(".brand_next").off("click.brand");

    killFlexForBx(false);
  }

  if (isTouchRange()) initBrandBx();

  var lastWidth = window.innerWidth;

  $(window).on("resize", function () {
    var currentWidth = window.innerWidth;

    if (currentWidth === lastWidth) return;

    lastWidth = currentWidth;

    if (isTouchRange()) {
      if (!brandSlider) initBrandBx();
      else refreshBrandBx();
    } else {
      destroyBrandBx();
    }
  });
});

(() => {
  const pc = document.querySelector(".limited_pc");
  const view = pc?.querySelector(".limited_view");
  const track = pc?.querySelector(".limited_track");
  const prevBtn = pc?.querySelector(".limited_prev");
  const nextBtn = pc?.querySelector(".limited_next");
  if (!pc || !view || !track || !prevBtn || !nextBtn) return;

  const isPC = () => window.innerWidth > 767;

  let slides = Array.from(track.children);
  let index = 1;
  let moving = false;

  let dragOn = false;
  let startX = 0;
  let dx = 0;
  let basePx = 0;

  const thresholdRatio = 0.18;

  function setTransition(on) {
    track.style.transition = on ? "transform 520ms cubic-bezier(.22,.61,.36,1)" : "none";
  }

  function slideW() {
    return view.getBoundingClientRect().width;
  }

  function setPx(px) {
    track.style.transform = `translate3d(${px}px, 0, 0)`;
  }

  function gotoIndex(nextIndex, withTransition) {
    if (!isPC()) return;
    const w = slideW();
    index = nextIndex;
    setTransition(withTransition !== false);
    setPx(-index * w);
  }

  function rebuild() {
    if (!isPC()) {
      setTransition(false);
      track.style.transform = "translate3d(0,0,0)";
      return;
    }

    track.innerHTML = "";
    slides.forEach((li) => track.appendChild(li));

    slides = Array.from(track.children);
    const first = slides[0].cloneNode(true);
    const last = slides[slides.length - 1].cloneNode(true);

    track.insertBefore(last, track.firstChild);
    track.appendChild(first);

    index = 1;
    setTransition(false);
    gotoIndex(index, false);
    track.offsetHeight;
    setTransition(true);

    moving = false;
  }

  function go(dir) {
    if (!isPC() || moving) return;
    moving = true;
    gotoIndex(index + dir, true);
  }

  track.addEventListener("transitionend", () => {
    if (!isPC()) return;

    const total = track.children.length;
    const lastIndex = total - 1;

    if (index === lastIndex) {
      setTransition(false);
      index = 1;
      gotoIndex(index, false);
      track.offsetHeight;
      setTransition(true);
    }

    if (index === 0) {
      setTransition(false);
      index = lastIndex - 1;
      gotoIndex(index, false);
      track.offsetHeight;
      setTransition(true);
    }

    moving = false;
  });

  prevBtn.addEventListener("click", (e) => {
    e.preventDefault();
    go(-1);
  });

  nextBtn.addEventListener("click", (e) => {
    e.preventDefault();
    go(1);
  });

  function onDown(e) {
    if (!isPC() || moving) return;

    dragOn = true;
    dx = 0;

    startX = e.clientX;
    basePx = -index * slideW();

    setTransition(false);
    if (view.setPointerCapture) view.setPointerCapture(e.pointerId);

    track.style.userSelect = "none";
    track.style.cursor = "grabbing";
  }

  function onMove(e) {
    if (!dragOn || !isPC()) return;

    dx = e.clientX - startX;
    setPx(basePx + dx);
  }

  function endDrag() {
    if (!dragOn) return;
    dragOn = false;

    const w = slideW();
    const abs = Math.abs(dx);

    track.style.userSelect = "";
    track.style.cursor = "";

    setTransition(true);

    if (abs > w * thresholdRatio) {
      if (dx < 0) gotoIndex(index + 1, true);
      else gotoIndex(index - 1, true);
      moving = true;
    } else {
      gotoIndex(index, true);
    }
  }

  view.addEventListener("pointerdown", (e) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    onDown(e);
  });

  view.addEventListener("pointermove", onMove);
  view.addEventListener("pointerup", endDrag);
  view.addEventListener("pointercancel", endDrag);
  view.addEventListener("pointerleave", () => {
    if (dragOn) endDrag();
  });

  view.addEventListener("dragstart", (e) => e.preventDefault());

  window.addEventListener("resize", rebuild);

  rebuild();
})();

$(window).on("load", function () {
  if (typeof $.fn.bxSlider !== "function") return;

  var $news = $(".news_slider");
  if (!$news.length) return;
  if (window.innerWidth <= 767) return;

  var newsSlider = $news.bxSlider({
    minSlides: 3,
    maxSlides: 3,
    moveSlides: 1,
    slideWidth: 340,
    slideMargin: 69,
    pager: false,
    controls: false,
    infiniteLoop: true,
    hideControlOnEnd: false,
    adaptiveHeight: false,
    speed: 520
  });

  $(".news_event_section .prev")
    .off("click.news")
    .on("click.news", function (e) {
      e.preventDefault();
      newsSlider.goToPrevSlide();
    });

  $(".news_event_section .next")
    .off("click.news")
    .on("click.news", function (e) {
      e.preventDefault();
      newsSlider.goToNextSlide();
    });
});

$(function () {
  if (typeof $.fn.bxSlider !== "function") return;

  var $sustain = $(".sustain_mobile_slider");
  if (!$sustain.length) return;

  var sustainSlider = $sustain.bxSlider({
    minSlides: 1,
    maxSlides: 1,
    moveSlides: 1,
    slideMargin: 0,
    pager: true,
    controls: false,
    touchEnabled: true,
    adaptiveHeight: true,
    speed: 520
  });

  $(".sustain_prev")
    .off("click")
    .on("click", function (e) {
      e.preventDefault();
      sustainSlider.goToPrevSlide();
    });

  $(".sustain_next")
    .off("click")
    .on("click", function (e) {
      e.preventDefault();
      sustainSlider.goToNextSlide();
    });
});

$(function () {
  if (typeof $.fn.bxSlider !== "function") return;

  var $newsM = $("#news_event_mobile .news_mobile_slider");
  if (!$newsM.length) return;

  var totalSlides = $newsM.children("li").length;
  var $pager = $("#news_event_mobile .news_pager_custom");
  $pager.empty();

  for (var i = 0; i < totalSlides; i++) {
    var $btn = $("<button>", {
      type: "button",
      "aria-label": i + 1 + "번 슬라이드"
    });
    $pager.append($btn);
  }

  function setActiveDot(slideIndex) {
    $pager.children("button").removeClass("is-active").eq(slideIndex).addClass("is-active");
  }

  var newsMSlider = $newsM.bxSlider({
    minSlides: 1,
    maxSlides: 1,
    moveSlides: 1,
    slideMargin: 0,
    pager: false,
    controls: false,
    touchEnabled: true,
    adaptiveHeight: true,
    speed: 520,
    onSliderLoad: function (currentIndex) {
      setActiveDot(currentIndex);
    },
    onSlideAfter: function ($slideElement, oldIndex, newIndex) {
      setActiveDot(newIndex);
    }
  });

  $pager.on("click", "button", function () {
    var target = $(this).index();
    newsMSlider.goToSlide(target);
  });

  $("#news_event_mobile .news_prev")
    .off("click")
    .on("click", function (e) {
      e.preventDefault();
      newsMSlider.goToPrevSlide();
    });

  $("#news_event_mobile .news_next")
    .off("click")
    .on("click", function (e) {
      e.preventDefault();
      newsMSlider.goToNextSlide();
    });
});

(() => {
  const section = document.querySelector(".main_image");
  if (!section) return;

  const slides = Array.from(section.querySelectorAll(".main_slide"));
  const btn = section.querySelector(".main_pause_btn");
  if (slides.length <= 1) return;

  let idx = slides.findIndex((s) => s.classList.contains("is-active"));
  if (idx < 0) idx = 0;

  let timer = null;

  function readMsVar(name, fallback) {
    const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
    if (!v) return fallback;
    if (v.endsWith("ms")) {
      const n = Number(v.replace("ms", "").trim());
      return Number.isFinite(n) ? n : fallback;
    }
    if (v.endsWith("s")) {
      const n = Number(v.replace("s", "").trim());
      return Number.isFinite(n) ? Math.round(n * 1000) : fallback;
    }
    const n = Number(v);
    return Number.isFinite(n) ? n : fallback;
  }

  function getDur() {
    const mobile = window.innerWidth <= 767;
    const fade = readMsVar("--main-fade", mobile ? 2200 : 1100);
    const interval = mobile ? Math.max(6500, fade * 2 + 800) : 4000;
    return { interval, cleanup: fade };
  }

  function preloadAll() {
    const tasks = slides.map((img) => {
      img.loading = "eager";
      img.decoding = "async";
      const src = img.currentSrc || img.getAttribute("src");
      if (!src) return Promise.resolve();

      if (img.complete && img.naturalWidth > 0) return Promise.resolve();

      return new Promise((resolve) => {
        const pre = new Image();
        pre.onload = () => resolve();
        pre.onerror = () => resolve();
        pre.src = src;
      });
    });

    return Promise.all(tasks);
  }

  slides.forEach((s, i) => s.classList.toggle("is-active", i === idx));

  function show(nextIdx) {
    const dur = getDur();
    const prevIndex = idx;
    const nextIndex = (nextIdx + slides.length) % slides.length;
    if (prevIndex === nextIndex) return;

    const prev = slides[prevIndex];
    const next = slides[nextIndex];

    prev.classList.add("is-prev");

    requestAnimationFrame(() => {
      next.classList.add("is-active");
      idx = nextIndex;

      setTimeout(() => {
        prev.classList.remove("is-active");
        prev.classList.remove("is-prev");
      }, dur.cleanup);
    });
  }

  function start() {
    stop();
    const dur = getDur();
    timer = setInterval(() => show(idx + 1), dur.interval);
    if (btn) {
      btn.classList.remove("is-paused");
      btn.setAttribute("aria-label", "일시정지");
    }
  }

  function stop() {
    if (timer) clearInterval(timer);
    timer = null;
    if (btn) {
      btn.classList.add("is-paused");
      btn.setAttribute("aria-label", "재생");
    }
  }

  if (btn) {
    btn.addEventListener("click", () => {
      if (timer) stop();
      else start();
    });
  }

  preloadAll().then(() => {
    start();
  });

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) stop();
    else start();
  });

  window.addEventListener("resize", () => {
    if (timer) start();
  });
})();

(() => {
  const popup = document.getElementById("pfNotice");
  if (!popup) return;

  const btnClose = document.getElementById("pfNoticeClose");
  const btnLater = document.getElementById("pfNoticeLater");
  const btnOk = document.getElementById("pfNoticeOk");
  const hideToday = document.getElementById("pfNoticeHideToday");

  const STORAGE_KEY = "pfNoticeHideUntil";
  const now = new Date();
  const savedUntil = localStorage.getItem(STORAGE_KEY);

  function shouldHideToday() {
    if (!savedUntil) return false;
    return now.getTime() < Number(savedUntil);
  }

  function setHideToday() {
    const expire = new Date();
    expire.setHours(23, 59, 59, 999);
    localStorage.setItem(STORAGE_KEY, String(expire.getTime()));
  }

  function open() {
    popup.classList.add("is-open");
    popup.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  function close() {
    popup.classList.remove("is-open");
    popup.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  function handleClose() {
    if (hideToday && hideToday.checked) {
      setHideToday();
    }
    close();
  }

  if (!shouldHideToday()) {
    open();
  } else {
    close();
  }

  if (btnClose) btnClose.addEventListener("click", handleClose);
  if (btnLater) btnLater.addEventListener("click", handleClose);
  if (btnOk) btnOk.addEventListener("click", handleClose);

  popup.addEventListener("click", (e) => {
    if (e.target === popup) handleClose();
  });

  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && popup.classList.contains("is-open")) {
      handleClose();
    }
  });
})();

$(function () {
  if (typeof $.fn.bxSlider !== "function") return;

  var $root = $("#limited_m");
  if (!$root.length) return;

  var $slider = $root.find(".limited_m_slider");
  var $pager = $root.find(".limited_m_pager");
  var slider = null;
  var lastWidth = window.innerWidth;

  function isMobile() {
    return window.innerWidth <= 767;
  }

  function buildPager(total) {
    $pager.empty();
    for (var i = 0; i < total; i++) {
      var $btn = $("<button>", {
        type: "button",
        "aria-label": i + 1 + "번 슬라이드"
      });
      $pager.append($btn);
    }
  }

  function setActiveDot(idx) {
    $pager.children("button").removeClass("is-active").eq(idx).addClass("is-active");
  }

  function bindControls() {
    $root.find(".limited_m_prev").off("click.lim").on("click.lim", function (e) {
      e.preventDefault();
      if (slider) slider.goToPrevSlide();
    });

    $root.find(".limited_m_next").off("click.lim").on("click.lim", function (e) {
      e.preventDefault();
      if (slider) slider.goToNextSlide();
    });

    $pager.off("click.lim").on("click.lim", "button", function () {
      var target = $(this).index();
      if (slider) slider.goToSlide(target);
    });
  }

  function options(total) {
    return {
      minSlides: 1,
      maxSlides: 1,
      moveSlides: 1,
      slideMargin: 0,
      pager: false,
      controls: false,
      touchEnabled: true,
      adaptiveHeight: true,
      speed: 520,
      infiniteLoop: true,
      responsive: true,
      onSliderLoad: function (currentIndex) {
        buildPager(total);
        setActiveDot(currentIndex);
        bindControls();
      },
      onSlideAfter: function ($el, oldIndex, newIndex) {
        setActiveDot(newIndex);
      }
    };
  }

  function init() {
    if (slider) return;
    var total = $slider.children("li").length;
    slider = $slider.bxSlider(options(total));
  }

  function destroy() {
    if (!slider) return;
    slider.destroySlider();
    slider = null;
    $pager.empty();
    $root.find(".limited_m_prev").off("click.lim");
    $root.find(".limited_m_next").off("click.lim");
    $pager.off("click.lim");
  }

  if (isMobile()) init();

  $(window).on("resize", function () {
    var w = window.innerWidth;
    if (w === lastWidth) return;
    lastWidth = w;

    if (isMobile()) {
      if (!slider) init();
    } else {
      destroy();
    }
  });
});

(() => {
  const toggle = document.getElementById("search_toggle");
  const label = document.querySelector('label.search_icon[for="search_toggle"]');
  const form = document.getElementById("searchForm");
  const input = document.getElementById("searchInput");

  if (!toggle || !label || !form || !input) return;

  function openBox() {
    toggle.checked = true;
    requestAnimationFrame(() => input.focus());
  }

  function closeBox() {
    toggle.checked = false;
    input.blur();
  }

  function runSearch() {
    const q = input.value.trim();
    if (!q) return false;
    const url = "https://www.google.com/search?q=" + encodeURIComponent(q);
    window.open(url, "_blank", "noopener,noreferrer");
    return true;
  }

  label.addEventListener("click", (e) => {
    e.preventDefault();

    if (!toggle.checked) {
      openBox();
      return;
    }

    closeBox();
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (runSearch()) closeBox();
    else input.focus();
  });

  input.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeBox();
  });

  document.addEventListener("click", (e) => {
    if (!toggle.checked) return;
    if (label.contains(e.target) || form.contains(e.target)) return;
    closeBox();
  });
})();

(() => {
  const btn = document.querySelector(".top_btn");
  if (!btn) return;

  const toggleShow = () => {
    const y = window.scrollY || document.documentElement.scrollTop || 0;
    btn.classList.toggle("is-show", y > 400);
  };

  const scrollTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  btn.addEventListener("click", (e) => {
    e.preventDefault();
    scrollTop();
  });

  window.addEventListener("scroll", toggleShow, { passive: true });
  window.addEventListener("resize", toggleShow);
  toggleShow();
})();

(() => {
  const root = document.querySelector("#footer_tablet");
  if (!root) return;

  const btns = root.querySelectorAll('.footer_quickbtn[data-panel]');
  const panel = root.querySelector(".footer_panel");
  const boxes = root.querySelectorAll(".panel_box");

  const isTablet = () => window.innerWidth <= 1194;

  function closeAll() {
    btns.forEach((btn) => {
      btn.classList.remove("is-active");
      btn.setAttribute("aria-expanded", "false");
    });

    boxes.forEach((box) => {
      box.hidden = true;
    });

    if (panel) panel.hidden = true;
  }

  function openOne(name) {
    if (!panel) return;

    panel.hidden = false;

    boxes.forEach((box) => {
      box.hidden = box.dataset.panelBox !== name;
    });
  }

  btns.forEach((btn) => {
    btn.setAttribute("aria-expanded", "false");

    btn.addEventListener("click", () => {
      if (!isTablet()) return;

      const name = btn.dataset.panel;
      const wasOpen = btn.classList.contains("is-active");

      closeAll();

      if (!wasOpen) {
        btn.classList.add("is-active");
        btn.setAttribute("aria-expanded", "true");
        openOne(name);
      }
    });
  });

  document.addEventListener("click", (e) => {
    if (!isTablet()) return;
    if (!root.contains(e.target)) closeAll();
  });

  document.addEventListener("keydown", (e) => {
    if (!isTablet()) return;
    if (e.key === "Escape") closeAll();
  });

  window.addEventListener("resize", () => {
    if (!isTablet()) closeAll();
  });

  closeAll();
})();

(() => {
  const modal = document.getElementById("mapModal");
  const closeBtn = document.getElementById("mapModalClose");
  const openBtns = document.querySelectorAll('[data-map-open="true"]');
  const mapContainer = document.getElementById("kakaoMap");

  if (!modal || !closeBtn || !openBtns.length || !mapContainer || !window.kakao || !window.kakao.maps) return;

  let mapLoaded = false;
  let map = null;
  let coords = null;

  function initMap() {
    if (mapLoaded) return;

    coords = new kakao.maps.LatLng(37.570377, 126.973342);

    map = new kakao.maps.Map(mapContainer, {
      center: coords,
      level: 3
    });

    new kakao.maps.Marker({
      map: map,
      position: coords
    });

    var zoomControl = new kakao.maps.ZoomControl();
    map.addControl(zoomControl, kakao.maps.ControlPosition.RIGHT);

    var content = `
      <div class="map_overlay">
        <div class="map_title">한국 코카-콜라</div>
        <div class="map_addr">서울시 종로구 새문안로 68</div>
        <div class="map_links">
          <a href="https://map.kakao.com/link/map/한국 코카-콜라,37.570377,126.973342" target="_blank">큰지도</a>
          <a href="https://map.kakao.com/link/to/한국 코카-콜라,37.570377,126.973342" target="_blank">길찾기</a>
        </div>
      </div>
    `;

    var customOverlay = new kakao.maps.CustomOverlay({
      position: coords,
      content: content,
      yAnchor: 1.35
    });

    customOverlay.setMap(map);
    mapLoaded = true;
  }

  function refreshMap() {
    if (!map) return;
    map.relayout();
    map.setCenter(coords);
  }

  function openModal() {
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";

    if (!mapLoaded) initMap();

    setTimeout(() => {
      refreshMap();
    }, 80);
  }

  function closeModal() {
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  openBtns.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      openModal();
    });
  });

  closeBtn.addEventListener("click", closeModal);

  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });

  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.classList.contains("is-open")) {
      closeModal();
    }
  });

  window.addEventListener("resize", () => {
    if (modal.classList.contains("is-open")) {
      setTimeout(() => {
        refreshMap();
      }, 80);
    }
  });
})();
(() => {
  const popup = document.getElementById("pagePopup");
  const popupFrame = document.getElementById("pagePopupFrame");
  const popupClose = document.getElementById("pagePopupClose");
  const popupLinks = document.querySelectorAll(".layer_popup_link");

  if (!popup || !popupFrame || !popupClose || !popupLinks.length) return;

  const openPopup = (url) => {
    popupFrame.src = url;
    popup.classList.add("is-open");
    popup.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  };

  const closePopup = () => {
    popup.classList.remove("is-open");
    popup.setAttribute("aria-hidden", "true");
    popupFrame.src = "";
    document.body.style.overflow = "";
  };

  popupLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      openPopup(link.dataset.page || link.getAttribute("href"));
    });
  });

  popupClose.addEventListener("click", closePopup);

  popup.addEventListener("click", (e) => {
    if (e.target === popup) {
      closePopup();
    }
  });

  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && popup.classList.contains("is-open")) {
      closePopup();
    }
  });
})();