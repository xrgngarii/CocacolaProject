$(function() {
  $(".scroll_link").on("click", function (e) {
    e.preventDefault();
    const href = $(this).attr("href");
    const $target = $(href);
    if (!$target.length) return;

    const $header = $(".header_wrap");
    const headerH = $header.outerHeight() || 0;
    const top = $target.offset().top - headerH;

    $("html, body").stop(true).animate({ scrollTop: top }, 700, "swing");
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const view = document.querySelector(".sus_icon_view");
  const track = document.querySelector(".sus_icon");
  const btnPrev = document.querySelector(".sus_btn.prev");
  const btnNext = document.querySelector(".sus_btn.next");
  if (!view || !track) return;

  const mq = window.matchMedia("(max-width: 1194px)");
  let isInit = false;
  let idx = 1;
  let isMoving = false;
  let itemW = 260;

  const originals = Array.from(track.children);
  const count = originals.length;

  let startX = 0;
  let currentX = 0;
  let isDragging = false;

  function setActive(currentIdx) {
    const items = Array.from(track.children);
    items.forEach((el) => el.classList.remove("active"));

    let activeIdx = currentIdx;

    if (currentIdx === 0) {
      activeIdx = count;
    } else if (currentIdx === count + 1) {
      activeIdx = 1;
    }

    if (items[activeIdx]) items[activeIdx].classList.add("active");
  }

  function move(i, transition = true) {
    idx = i;
    track.style.transition = transition
      ? "transform 0.7s cubic-bezier(0.25, 1, 0.5, 1)"
      : "none";
    track.style.transform = `translateX(${-idx * itemW}px)`;
    setActive(idx);
  }

  function handleLoopReset() {
    if (idx !== 0 && idx !== count + 1) {
      isMoving = false;
      return;
    }

    const resetIdx = idx === 0 ? count : 1;

    track.style.transition = "none";
    idx = resetIdx;
    track.style.transform = `translateX(${-idx * itemW}px)`;
    setActive(idx);

    track.offsetHeight;

    requestAnimationFrame(() => {
      track.style.transition = "";
      isMoving = false;
    });
  }

  function onTransitionEnd(e) {
    if (e.target !== track) return;
    handleLoopReset();
  }

  function onPrev(e) {
    e?.preventDefault();
    if (isMoving) return;
    isMoving = true;
    move(idx - 1, true);
  }

  function onNext(e) {
    e?.preventDefault();
    if (isMoving) return;
    isMoving = true;
    move(idx + 1, true);
  }

  function onTouchStart(e) {
    if (isMoving) return;
    startX = e.touches[0].clientX;
    currentX = startX;
    isDragging = true;
    track.style.transition = "none";
  }

  function onTouchMove(e) {
    if (!isDragging) return;

    currentX = e.touches[0].clientX;
    const diff = currentX - startX;

    if (Math.abs(diff) > 5) e.preventDefault();
    track.style.transform = `translateX(${-idx * itemW + diff}px)`;
  }

  function onTouchEnd() {
    if (!isDragging) return;
    isDragging = false;

    const diff = currentX - startX;

    if (Math.abs(diff) < 10) {
      move(idx, true);
      return;
    }

    if (diff > 50) {
      onPrev();
    } else if (diff < -50) {
      onNext();
    } else {
      move(idx, true);
    }
  }

  function init() {
    if (isInit) return;
    isInit = true;

    track.innerHTML = "";

    const firstClone = originals[0].cloneNode(true);
    const lastClone = originals[count - 1].cloneNode(true);

    firstClone.classList.add("clone");
    lastClone.classList.add("clone");

    track.appendChild(lastClone);
    originals.forEach((el) => track.appendChild(el));
    track.appendChild(firstClone);

    idx = 1;
    move(idx, false);

    btnPrev?.addEventListener("click", onPrev);
    btnNext?.addEventListener("click", onNext);
    view.addEventListener("touchstart", onTouchStart, { passive: true });
    view.addEventListener("touchmove", onTouchMove, { passive: false });
    view.addEventListener("touchend", onTouchEnd);
    track.addEventListener("transitionend", onTransitionEnd);
  }

  function destroy() {
    if (!isInit) return;
    isInit = false;

    track.removeEventListener("transitionend", onTransitionEnd);
    btnPrev?.removeEventListener("click", onPrev);
    btnNext?.removeEventListener("click", onNext);
    view.removeEventListener("touchstart", onTouchStart);
    view.removeEventListener("touchmove", onTouchMove);
    view.removeEventListener("touchend", onTouchEnd);

    track.innerHTML = "";
    originals.forEach((el) => track.appendChild(el));
    track.style.transform = "";
    track.style.transition = "";

    startX = 0;
    currentX = 0;
    isDragging = false;
    isMoving = false;
    idx = 1;
  }

  if (mq.matches) init();

  mq.addEventListener("change", (e) => {
    if (e.matches) {
      init();
    } else {
      destroy();
    }
  });
});

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

    return Array.from(menu.querySelectorAll(selectors)).filter(
      (el) => el.offsetParent !== null && !el.hasAttribute("disabled"),
    );
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

    requestAnimationFrame(focusFirst);
  };

  const closeMenu = () => {
    menu.classList.remove("active");
    dim.classList.remove("active");
    document.body.classList.remove("menu-open");
    menuBtn.classList.remove("is-open");

    menuBtn.setAttribute("aria-expanded", "false");
    menu.setAttribute("aria-hidden", "true");

    if (lastFocus && typeof lastFocus.focus === "function") lastFocus.focus();
    else menuBtn.focus();

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
    if (!menu.classList.contains("active")) openMenu();
    else closeMenu();
  });

  closeBtn.addEventListener("click", (e) => {
    e.preventDefault();
    closeMenu();
  });

  dim.addEventListener("click", closeMenu);

  menu.addEventListener("click", (e) => {
    const link = e.target.closest("a[href]");
    if (!link) return;
    closeMenu();
  });

  document.addEventListener("keydown", onKeydown);

  window.addEventListener("resize", () => {
    if (window.innerWidth > 1194 && menu.classList.contains("active")) closeMenu();
  });
})();

document.addEventListener("click", (e) => {
  const btn = e.target.closest(".community_video .video_thumb");
  if (!btn) return;
  const wrap = btn.closest(".community_video");
  const id = wrap.dataset.videoId;
  if (!id) return;
  wrap.innerHTML = `
    <iframe
      src="https://www.youtube.com/embed/${id}?autoplay=1&rel=0"
      title="YouTube video player"
      frameborder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowfullscreen>
    </iframe>
  `;
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

(() => {
  const lightSections = document.querySelectorAll('.quick_nav, #main');
  const darkSections = document.querySelectorAll('.footer, .footer_tablet');
  const htmlEl = document.documentElement;
  const lightSet = new Set();
  const darkSet = new Set();

  if (lightSections.length === 0 && darkSections.length === 0) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const isDark = entry.target.matches('.footer, .footer_tablet');
        if (entry.isIntersecting) {
          isDark ? darkSet.add(entry.target) : lightSet.add(entry.target);
        } else {
          isDark ? darkSet.delete(entry.target) : lightSet.delete(entry.target);
        }
      });

      if (darkSet.size > 0) {
        htmlEl.classList.remove('light-scrollbar');
      } else {
        htmlEl.classList.toggle('light-scrollbar', lightSet.size > 0);
      }
    },
    {
      root: null,
      rootMargin: '-40% 0px -40% 0px',
      threshold: 0
    }
  );

  lightSections.forEach((el) => observer.observe(el));
  darkSections.forEach((el) => observer.observe(el));
})();