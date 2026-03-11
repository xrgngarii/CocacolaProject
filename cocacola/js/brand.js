const menuBtn = document.querySelector(".menu_btn");
const menu = document.querySelector(".menu_layer_tablet");
const dim = document.querySelector(".menu_dim");
const closeBtn = document.querySelector(".menu_close");

if (menuBtn && menu && dim && closeBtn) {
  menuBtn.addEventListener("click", (e) => {
    e.preventDefault();
    const willOpen = !menu.classList.contains("active");
    menu.classList.toggle("active", willOpen);
    dim.classList.toggle("active", willOpen);
    document.body.classList.toggle("menu-open", willOpen);
  });

  function closeMenu() {
    menu.classList.remove("active");
    dim.classList.remove("active");
    document.body.classList.remove("menu-open");
  }

  closeBtn.addEventListener("click", closeMenu);
  dim.addEventListener("click", closeMenu);
}

const videoBox = document.getElementById("kwaveVideo");
const playBtn = videoBox?.querySelector(".video_play");
const thumb = videoBox?.querySelector(".video_thumbnail");
const YT_ID = "g8GCY-1HEGg";

playBtn?.addEventListener("click", (e) => {
  e.preventDefault();
  if (videoBox.querySelector("iframe")) return;
  if (thumb) thumb.style.visibility = "hidden";
  playBtn.style.display = "none";

  const iframe = document.createElement("iframe");
  iframe.className = "video_iframe";
  iframe.src = `https://www.youtube.com/embed/${YT_ID}?autoplay=1&mute=1&playsinline=1&rel=0`;
  iframe.title = "K-Wave video";
  iframe.allow = "autoplay; encrypted-media; picture-in-picture";
  iframe.allowFullscreen = true;
  videoBox.appendChild(iframe);
});

(() => {
  const root = document.getElementById("kwaveSlider");
  if (!root) return;

  const view = root.querySelector(".kv_viewport");
  const track = root.querySelector(".kv_track");
  const prevBtn = root.querySelector(".kv_prev");
  const nextBtn = root.querySelector(".kv_next");
  if (!view || !track || !prevBtn || !nextBtn) return;

  let slides = Array.from(track.children);
  if (slides.length < 2) return;

  slides.forEach((card) => {
    if (card.querySelector(".kv_play")) return;
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "kv_play";
    btn.setAttribute("aria-label", "영상 재생");
    btn.textContent = "▶";
    card.appendChild(btn);
  });

  root.addEventListener("click", (e) => {
    const btn = e.target.closest(".kv_play");
    if (!btn) return;

    const card = btn.closest(".kv_card");
    if (!card) return;

    const media = e.target.closest(".kv_card > img, .kv_card > iframe, .kv_play");
    if (!media) return;

    const ytId = card.getAttribute("data-yt");
    if (!ytId) return;
    if (card.querySelector("iframe")) return;

    btn.style.display = "none";
    const thumb = card.querySelector(":scope > img");
    if (thumb) thumb.style.visibility = "hidden";

    const iframe = document.createElement("iframe");
    iframe.className = "kv_iframe";
    iframe.src = `https://www.youtube.com/embed/${ytId}?autoplay=1&mute=1&playsinline=1&rel=0`;
    iframe.title = "YouTube video";
    iframe.allow = "autoplay; encrypted-media; picture-in-picture";
    iframe.allowFullscreen = true;
    card.appendChild(iframe);
  });

  let index = 1;
  let moving = false;

  let dragOn = false;
  let locked = false;
  let startX = 0;
  let startY = 0;
  let dx = 0;
  let dy = 0;
  let basePx = 0;

  const thresholdRatio = 0.18;
  const isSlideMode = () => window.innerWidth <= 1194;

  const setTransition = (on) => {
    track.style.transition = on ? "transform 520ms ease" : "none";
  };

  const slideW = () => view.getBoundingClientRect().width;

  const setPx = (px) => {
    track.style.transform = `translate3d(${px}px, 0, 0)`;
  };

  const gotoIndex = (nextIndex, withTransition = true) => {
    const w = slideW();
    index = nextIndex;
    setTransition(withTransition);
    setPx(-index * w);
  };

  const rebuild = () => {
    if (!isSlideMode()) {
      track.style.transition = "";
      track.style.transform = "";
      track.innerHTML = "";
      slides.forEach((el) => track.appendChild(el));
      slides = Array.from(track.children);
      index = 0;
      moving = false;
      return;
    }

    track.innerHTML = "";
    slides.forEach((el) => track.appendChild(el));
    slides = Array.from(track.children);
    if (slides.length < 2) return;

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
  };

  const go = (dir) => {
    if (!isSlideMode()) return;
    if (moving) return;
    moving = true;
    gotoIndex(index + dir, true);
  };

  track.addEventListener("transitionend", () => {
    if (!isSlideMode()) return;

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

  const onDown = (e) => {
    if (!isSlideMode()) return;
    if (moving) return;
    if (e.target.closest(".kv_play")) return;

    const card = e.target.closest(".kv_card");
    if (!card || !root.contains(card)) return;

    const block = e.target.closest("a, button, input, textarea, select, label");
    if (block) return;

    dragOn = true;
    locked = false;
    dx = 0;
    dy = 0;

    startX = e.clientX;
    startY = e.clientY;
    basePx = -index * slideW();

    root.classList.add("is-dragging");
    setTransition(false);

    if (view.setPointerCapture) view.setPointerCapture(e.pointerId);
    track.style.userSelect = "none";
  };

  const onMove = (e) => {
    if (!dragOn) return;

    dx = e.clientX - startX;
    dy = e.clientY - startY;

    if (!locked) {
      if (Math.abs(dx) > Math.abs(dy)) locked = true;
      else return;
    }

    if (e.cancelable) e.preventDefault();
    setPx(basePx + dx);
  };

  const endDrag = () => {
    if (!dragOn) return;
    dragOn = false;

    root.classList.remove("is-dragging");
    track.style.userSelect = "";

    const w = slideW();
    const abs = Math.abs(dx);

    setTransition(true);

    if (locked && abs > w * thresholdRatio) {
      if (dx < 0) gotoIndex(index + 1, true);
      else gotoIndex(index - 1, true);
      moving = true;
    } else {
      gotoIndex(index, true);
    }
  };

  view.addEventListener("pointerdown", (e) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    onDown(e);
  });

  view.addEventListener("pointermove", onMove, { passive: false });
  view.addEventListener("pointerup", endDrag);
  view.addEventListener("pointercancel", endDrag);
  view.addEventListener("pointerleave", () => {
    if (dragOn) endDrag();
  });

  view.addEventListener("dragstart", (e) => e.preventDefault());

  let resizeRaf = 0;
  let lastW = window.innerWidth;

  window.addEventListener("resize", () => {
    cancelAnimationFrame(resizeRaf);
    resizeRaf = requestAnimationFrame(() => {
      const w = window.innerWidth;
      if (w === lastW) return;
      lastW = w;

      const current = slides[index - 1] ? index - 1 : 0;
      rebuild();
      if (!isSlideMode()) return;

      index = Math.min(current + 1, track.children.length - 2);
      setTransition(false);
      gotoIndex(index, false);
      track.offsetHeight;
      setTransition(true);
    });
  });

  rebuild();
})();

(() => {
  const root = document.querySelector("#limitedSlider");
  if (!root) return;

  const view = root.querySelector(".limited_viewport");
  const track = root.querySelector(".limited_track");
  const prevBtn = root.querySelector(".btn_prev");
  const nextBtn = root.querySelector(".btn_next");
  if (!view || !track || !prevBtn || !nextBtn) return;

  let slides = Array.from(track.children);
  let index = 1;
  let moving = false;

  let dragOn = false;
  let locked = false;
  let startX = 0;
  let startY = 0;
  let dx = 0;
  let dy = 0;
  let basePx = 0;

  const thresholdRatio = 0.18;

  const setTransition = (on) => {
    track.style.transition = on
      ? "transform 520ms cubic-bezier(.22,.61,.36,1)"
      : "none";
  };

  const slideW = () => view.getBoundingClientRect().width;

  const setPx = (px) => {
    track.style.transform = `translate3d(${px}px, 0, 0)`;
  };

  const gotoIndex = (nextIndex, withTransition = true) => {
    const w = slideW();
    index = nextIndex;
    setTransition(withTransition);
    setPx(-index * w);
  };

  const rebuild = () => {
    track.innerHTML = "";
    slides.forEach((li) => track.appendChild(li));

    slides = Array.from(track.children);
    if (slides.length < 2) return;

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
  };

  const go = (dir) => {
    if (moving) return;
    moving = true;
    gotoIndex(index + dir, true);
  };

  track.addEventListener("transitionend", () => {
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

  const canSelector = ".limited_drink";

  const onDown = (e) => {
    if (moving) return;

    const fromCan = e.target.closest(canSelector);
    if (!fromCan || !root.contains(fromCan)) return;

    dragOn = true;
    locked = false;
    dx = 0;
    dy = 0;

    startX = e.clientX;
    startY = e.clientY;
    basePx = -index * slideW();

    root.classList.add("is-dragging");
    setTransition(false);

    if (view.setPointerCapture) view.setPointerCapture(e.pointerId);
    track.style.userSelect = "none";
  };

  const onMove = (e) => {
    if (!dragOn) return;

    dx = e.clientX - startX;
    dy = e.clientY - startY;

    if (!locked) {
      if (Math.abs(dx) > Math.abs(dy)) locked = true;
      else return;
    }

    setPx(basePx + dx);
  };

  const endDrag = () => {
    if (!dragOn) return;
    dragOn = false;

    root.classList.remove("is-dragging");
    track.style.userSelect = "";

    const w = slideW();
    const abs = Math.abs(dx);

    setTransition(true);

    if (locked && abs > w * thresholdRatio) {
      if (dx < 0) gotoIndex(index + 1, true);
      else gotoIndex(index - 1, true);
      moving = true;
    } else {
      gotoIndex(index, true);
    }
  };

  view.addEventListener(
    "touchmove",
    (e) => {
      if (!dragOn) return;
      if (!locked) return;
      e.preventDefault();
    },
    { passive: false }
  );

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

  let resizeRaf = 0;
  let lastW = window.innerWidth;

  window.addEventListener("resize", () => {
    cancelAnimationFrame(resizeRaf);
    resizeRaf = requestAnimationFrame(() => {
      const w = window.innerWidth;
      if (w === lastW) return;
      lastW = w;

      const current = slides[index - 1] ? index - 1 : 0;
      rebuild();

      index = Math.min(current + 1, track.children.length - 2);
      setTransition(false);
      gotoIndex(index, false);
      track.offsetHeight;
      setTransition(true);
    });
  });

  rebuild();
})();

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

AOS.init({
  once: true,
  offset: 0,
  easing: "ease-out-cubic",
  duration: 1800,
  delay: 150
});

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
    btns.forEach((b) => {
      b.classList.remove("is-active");
      b.setAttribute("aria-expanded", "false");
    });
    boxes.forEach((x) => {
      x.hidden = true;
    });
    if (panel) panel.hidden = true;
  }

  function openOne(name) {
    if (!panel) return;
    panel.hidden = false;
    boxes.forEach((x) => {
      x.hidden = x.dataset.panelBox !== name;
    });
  }

  btns.forEach((btn) => {
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

  if (!modal || !closeBtn || !openBtns.length || !mapContainer) return;

  let mapLoaded = false;
  let map = null;
  let marker = null;
  let infowindow = null;
  let coords = null;

  function initMap() {
    if (mapLoaded) return;

    coords = new kakao.maps.LatLng(37.570377, 126.973342);

    map = new kakao.maps.Map(mapContainer, {
      center: coords,
      level: 3
    });

    marker = new kakao.maps.Marker({
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