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
    } else {
      if (document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
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
    const willOpen = !menu.classList.contains("active");
    if (willOpen) openMenu();
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

$(function () {
  const $box = $("#popPlayer");
  if (!$box.length) return;

  $box.on("click", ".video_play", function (e) {
    e.preventDefault();
    if ($box.hasClass("is-playing")) return;

    const src = $box.data("video");
    const iframe = `
      <iframe
        src="${src}"
        title="인기 콘텐츠 영상"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowfullscreen></iframe>
    `;

    $box.addClass("is-playing");
    $box.append(iframe);
  });
});

$(function () {
  const $slider = $("#rc_slider");
  if (!$slider.length) return;

  const $view = $slider.find(".rc_view");
  const $track = $slider.find(".rc_track");
  const $prev = $slider.find(".rc_prev");
  const $next = $slider.find(".rc_next");
  const $thumbs = $(".rc_contents_wrap1 .video_thumb, .rc_contents_wrap2 .video_thumb");

  if ($thumbs.length < 2) return;

  const originals = $thumbs.map(function () {
    return $(this).clone(true, true);
  }).get();

  let perView = 2;
  let gap = 18;
  let itemW = 0;
  let index = 0;
  let moving = false;

  let isDown = false;
  let locked = false;
  let startX = 0;
  let startY = 0;
  let startT = 0;
  let curT = 0;
  let dx = 0;
  let dy = 0;
  let dragMoved = false;

  const CLICK_BLOCK_PX = 12;
  const thresholdRatio = 0.18;

  function active() {
    return window.innerWidth <= 1194;
  }

  function getPerView() {
    return window.innerWidth <= 706 ? 1 : 2;
  }

  function getGap() {
    return window.innerWidth <= 706 ? 14 : 18;
  }

  function setTransition(on) {
    $track.css("transition", on ? "transform 520ms cubic-bezier(.22,.61,.36,1)" : "none");
  }

  function setPos() {
    $track.css("transform", `translate3d(${curT}px,0,0)`);
  }

  function viewWidth() {
    return $view[0].getBoundingClientRect().width;
  }

  function calc() {
    perView = getPerView();
    gap = getGap();
    const vw = viewWidth();
    itemW = (vw - (perView - 1) * gap) / perView;
  }

  function makeLi($a) {
    const $li = $("<li>");
    $li.append($a);
    $li.css({ width: itemW + "px", marginRight: gap + "px" });
    return $li;
  }

  function build() {
    if (!active()) {
      $slider.hide();
      $(".rc_contents_wrap1, .rc_contents_wrap2").show();
      return;
    }

    $slider.show();
    $(".rc_contents_wrap1, .rc_contents_wrap2").hide();

    calc();
    $track.empty();

    const tail = originals.slice(-perView);
    const head = originals.slice(0, perView);

    tail.forEach((a) => $track.append(makeLi($(a).clone(true, true))));
    originals.forEach((a) => $track.append(makeLi($(a).clone(true, true))));
    head.forEach((a) => $track.append(makeLi($(a).clone(true, true))));

    $track.children("li").last().css("margin-right", "0px");

    index = perView;
    curT = -index * (itemW + gap);
    setTransition(false);
    setPos();

    requestAnimationFrame(() => {
      requestAnimationFrame(() => setTransition(true));
    });

    moving = false;
  }

  function jumpTo(newIndex) {
    setTransition(false);
    index = newIndex;
    curT = -index * (itemW + gap);
    setPos();

    requestAnimationFrame(() => {
      requestAnimationFrame(() => setTransition(true));
    });
  }

  function go(dir) {
    if (!active() || moving) return;
    moving = true;
    index += dir * perView;
    curT = -index * (itemW + gap);
    setPos();
  }

  $track.off("transitionend.rc").on("transitionend.rc", function () {
    if (!active()) return;

    const total = originals.length;
    const start = perView;
    const end = perView + total;

    if (index >= end) jumpTo(start);
    if (index < start) jumpTo(start + total - perView);

    moving = false;
  });

  $prev.off("click.rc").on("click.rc", function (e) {
    e.preventDefault();
    go(-1);
  });

  $next.off("click.rc").on("click.rc", function (e) {
    e.preventDefault();
    go(1);
  });

  const viewEl = $view[0];

  function onPointerDown(e) {
    if (!active() || moving) return;
    if (e.pointerType === "mouse" && e.button !== 0) return;

    isDown = true;
    locked = false;
    dragMoved = false;

    startX = e.clientX;
    startY = e.clientY;
    startT = curT;
    dx = 0;
    dy = 0;

    $track.addClass("is-dragging");
    setTransition(false);

    try {
      viewEl.setPointerCapture(e.pointerId);
    } catch (_) {}
  }

  function onPointerMove(e) {
    if (!isDown) return;

    dx = e.clientX - startX;
    dy = e.clientY - startY;

    if (!locked) {
      if (Math.abs(dx) > Math.abs(dy)) locked = true;
      else return;
    }

    if (e.cancelable) e.preventDefault();

    curT = startT + dx;
    setPos();
  }

  function onPointerUp(e) {
    if (!isDown) return;

    isDown = false;
    $track.removeClass("is-dragging");
    setTransition(true);

    try {
      viewEl.releasePointerCapture(e.pointerId);
    } catch (_) {}

    const absDx = Math.abs(dx);
    dragMoved = absDx > CLICK_BLOCK_PX;

    const threshold = viewWidth() * thresholdRatio;

    if (locked && absDx > threshold) {
      go(dx < 0 ? 1 : -1);
    } else {
      curT = -index * (itemW + gap);
      setPos();
    }

    if (!dragMoved) {
      const el = document.elementFromPoint(e.clientX, e.clientY);
      const a = el && el.closest && el.closest("a.video_thumb");
      if (a) {
        window.__rcTapTS = Date.now();
        $(a).trigger("rc:tap");
      }
    }

    setTimeout(() => {
      dragMoved = false;
    }, 0);
  }

  viewEl.addEventListener("pointerdown", onPointerDown, { passive: true });
  viewEl.addEventListener("pointermove", onPointerMove, { passive: false });
  viewEl.addEventListener("pointerup", onPointerUp, { passive: true });
  viewEl.addEventListener("pointercancel", onPointerUp, { passive: true });
  viewEl.addEventListener("pointerleave", onPointerUp, { passive: true });

  $slider.off("click.rcblock").on("click.rcblock", ".rc_track a", function (e) {
    if (dragMoved) {
      e.preventDefault();
      e.stopPropagation();
    }
  });

  let lastW = window.innerWidth;
  $(window).off("resize.rc").on("resize.rc", function () {
    const w = window.innerWidth;
    if (w === lastW) return;
    lastW = w;
    build();
  });

  build();
});

$(function () {
  function openModal(src) {
    const $modal = $(".video_modal");
    const $frame = $modal.find(".video_frame iframe");

    $modal.addClass("is-open").attr("aria-hidden", "false").css("display", "block");
    $frame.attr("src", src);
    $("body").css("overflow", "hidden");
  }

  function closeModal() {
    const $modal = $(".video_modal");
    const $frame = $modal.find(".video_frame iframe");

    $frame.attr("src", "");
    $modal.removeClass("is-open").attr("aria-hidden", "true").css("display", "none");
    $("body").css("overflow", "");
  }

  $(document).on("click rc:tap", "a.video_thumb", function (e) {
    if (e.type === "click" && window.__rcTapTS && Date.now() - window.__rcTapTS < 80) {
      e.preventDefault();
      return;
    }

    e.preventDefault();
    const src = $(this).attr("data-video") || $(this).data("video");
    if (!src) return;
    openModal(src);
  });

  $(document).on("click", ".video_close, .video_dim", function (e) {
    e.preventDefault();
    closeModal();
  });

  $(document).on("keydown", function (e) {
    if (e.key === "Escape") closeModal();
  });
});

(() => {
  const toggle = document.getElementById("search_toggle");
  const label = document.querySelector('label.search_icon[for="search_toggle"]');
  const form = document.getElementById("searchForm");
  const input = document.getElementById("searchInput");

  if (!toggle || !label || !form || !input) return;

  const openBox = () => {
    toggle.checked = true;
    requestAnimationFrame(() => input.focus());
  };

  const closeBox = () => {
    toggle.checked = false;
    input.blur();
  };

  const runSearch = () => {
    const q = input.value.trim();
    if (!q) return false;
    const url = "https://www.google.com/search?q=" + encodeURIComponent(q);
    window.open(url, "_blank", "noopener,noreferrer");
    return true;
  };

  label.addEventListener("click", (e) => {
    e.preventDefault();
    if (!toggle.checked) openBox();
    else closeBox();
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

$(function () {
  const $header = $("#header");

  const getHeaderH = () => {
    const h = $header.outerHeight() || 0;
    return h + 12;
  };

  $(".quick_nav_btn").on("click", function (e) {
    const href = $(this).attr("href");
    if (!href || href.charAt(0) !== "#") return;

    const $target = $(href);
    if (!$target.length) return;

    e.preventDefault();

    const top = $target.offset().top - getHeaderH();

    $("html, body").stop(true).animate(
      { scrollTop: top },
      700,
      "swing"
    );
  });
});

AOS.init({
  once: true,
  offset: 0,
  easing: "ease-out-cubic",
  duration: 1800,
  delay: 150
});

(() => {
  const btn = document.querySelector(".top_btn");
  const header = document.querySelector("#header");
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
    btns.forEach((b) => {
      b.classList.remove("is-active");
      b.setAttribute("aria-expanded", "false");
    });
    boxes.forEach((x) => (x.hidden = true));
    if (panel) panel.hidden = true;
  }

  function openOne(name) {
    if (!panel) return;
    panel.hidden = false;
    boxes.forEach((x) => (x.hidden = x.dataset.panelBox !== name));
  }

  btns.forEach((btn) => {
    btn.addEventListener("click", (e) => {
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

  if (!modal || !closeBtn || !openBtns.length || !mapContainer) return;

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

    const zoomControl = new kakao.maps.ZoomControl();
    map.addControl(zoomControl, kakao.maps.ControlPosition.RIGHT);

    const content = `
      <div class="map_overlay">
        <div class="map_title">한국 코카-콜라</div>
        <div class="map_addr">서울시 종로구 새문안로 68</div>
        <div class="map_links">
          <a href="https://map.kakao.com/link/map/한국 코카-콜라,37.570377,126.973342" target="_blank">큰지도</a>
          <a href="https://map.kakao.com/link/to/한국 코카-콜라,37.570377,126.973342" target="_blank">길찾기</a>
        </div>
      </div>
    `;

    const customOverlay = new kakao.maps.CustomOverlay({
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

    if (!mapLoaded) {
      initMap();
    }

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