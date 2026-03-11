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

    requestAnimationFrame(focusFirst);
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

  menu.addEventListener("click", (e) => {
    const link = e.target.closest("a[href]");
    if (!link) return;

    const href = link.getAttribute("href") || "";
    if (!href || href === "#none" || href === "#") return;

    closeMenu();
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 1194 && menu.classList.contains("active")) {
      closeMenu();
    }
  });
})();

(() => {
  const mq = window.matchMedia("(max-width: 1194px)");
  const cont = document.querySelector("#history .history_cont1");
  const ul = cont?.querySelector(".history_years");
  const prev = cont?.querySelector(".history_prev");
  const next = cont?.querySelector(".history_next");
  const titleEl = document.querySelector("#history .history_title");
  const rangeEl = document.querySelector("#history .history_range");
  const bodyEl = document.querySelector("#history .history_body");

  if (!ul || !prev || !next || !titleEl || !rangeEl || !bodyEl) return;

  const data = {
    1886: {
      title: "탄생과 초기 성장",
      range: "1886 ~ 1920",
      body: "1886년, 애틀랜타의 약사 존 펨버턴 박사는 약용 음료로 코카-콜라 시럽을 개발해 제이콥스 약국에서 처음으로 판매를 시작했다. 이후 사업가 에이사 캔들러가 레시피와 상표권을 인수하면서 코카-콜라는 본격적인 상업적 성장 궤도에 들어섰다. 광고·브랜딩·유통 전략이 체계적으로 구축되며 미국 전역에서 인기를 얻었고, 이 시기에 병입 시스템의 기반도 마련되면서 코카-콜라가 단순한 음료를 넘어 하나의 브랜드로 자리 잡기 시작했다."
    },
    1920: {
      title: "글로벌 진출의 시작",
      range: "1920 ~ 1950",
      body: "1920년대 이후 코카-콜라는 보틀링 네트워크 확장과 함께 해외 시장에 본격 진출했다. 2차 세계대전 시기에는 미군 보급을 계기로 전 세계 곳곳에 생산·유통 기반이 넓어졌고, 전후에는 글로벌 브랜드로서 입지를 빠르게 강화했다."
    },
    1950: {
      title: "대중문화 확립",
      range: "1950 ~ 1980",
      body: "TV·영화·음악 등 대중매체가 성장하면서 코카-콜라는 광고 캠페인과 패키지 디자인을 통해 ‘문화 아이콘’으로 자리잡았다. 다양한 프로모션과 전 세계적 이벤트 참여로 브랜드 경험을 확장했다."
    },
    1980: {
      title: "글로벌 기업으로 도약",
      range: "1980 ~ 2000",
      body: "1980~2000년대는 제품 포트폴리오 다변화와 글로벌 마케팅 고도화가 진행된 시기다. 지역별 소비자 취향에 맞춘 전략으로 시장 영향력을 확대하며 세계적인 음료 기업으로 도약했다."
    },
    2000: {
      title: "현대적 혁신 & 지속가능성",
      range: "2000 ~ 현재",
      body: "2000년대 이후 코카-콜라는 디지털 기반 마케팅, 새로운 음료 카테고리 확장과 함께 지속가능성(패키징, 물 환원, 탄소 저감 등)을 핵심 과제로 추진하며 브랜드 혁신을 이어가고 있다."
    }
  };

  const originalLis = Array.from(ul.children).map((li) => li.cloneNode(true));
  const max = originalLis.length;
  let activeKey = originalLis[0]?.dataset?.key || "1886";

  function setActive(key) {
    const item = data[key];
    if (!item) return;

    activeKey = key;
    bodyEl.classList.add("fade-out");

    setTimeout(() => {
      titleEl.textContent = item.title;
      rangeEl.textContent = item.range;
      bodyEl.textContent = item.body;
      bodyEl.classList.remove("fade-out");
    }, 300);

    ul.querySelectorAll("li").forEach((li) => {
      li.classList.toggle("is-active", li.dataset.key === key);
    });
  }

  ul.addEventListener("click", (e) => {
    const a = e.target.closest("a");
    if (!a) return;

    e.preventDefault();

    const li = a.closest("li");
    const key = li?.dataset?.key;
    if (key) setActive(key);
  });

  let idx = 0;
  let lock = false;
  let fixTimer = null;

  const step = () => ul.clientWidth;

  function buildMobileLoop() {
    ul.innerHTML = "";
    const makeSet = () => originalLis.map((li) => li.cloneNode(true));
    [...makeSet(), ...makeSet(), ...makeSet()].forEach((li) => ul.appendChild(li));

    idx = max;
    ul.scrollTo({ left: step() * idx, behavior: "auto" });
    setActive(activeKey);
  }

  function normalize() {
    if (idx < max) {
      idx += max;
      ul.scrollTo({ left: step() * idx, behavior: "auto" });
    } else if (idx >= 2 * max) {
      idx -= max;
      ul.scrollTo({ left: step() * idx, behavior: "auto" });
    }
  }

  function updateContentByIdx() {
    const li = ul.children[idx];
    const key = li?.dataset?.key;
    if (key) setActive(key);
  }

  function goTo(n) {
    idx = n;
    ul.scrollTo({ left: step() * idx, behavior: "smooth" });

    clearTimeout(fixTimer);
    fixTimer = setTimeout(() => {
      normalize();
      updateContentByIdx();
      lock = false;
    }, 320);
  }

  prev.addEventListener("click", () => {
    if (!mq.matches || lock) return;
    lock = true;
    goTo(idx - 1);
  });

  next.addEventListener("click", () => {
    if (!mq.matches || lock) return;
    lock = true;
    goTo(idx + 1);
  });

  let t = null;

  ul.addEventListener(
    "scroll",
    () => {
      if (!mq.matches) return;

      clearTimeout(t);
      t = setTimeout(() => {
        const s = step() || 1;
        idx = Math.round(ul.scrollLeft / s);
        normalize();
        updateContentByIdx();
      }, 120);
    },
    { passive: true }
  );

  function teardownMobileLoop() {
    ul.innerHTML = "";
    originalLis.forEach((li) => ul.appendChild(li.cloneNode(true)));
    setActive(activeKey);
  }

  setActive(activeKey);

  function syncMode() {
    if (mq.matches) buildMobileLoop();
    else teardownMobileLoop();
  }

  syncMode();
  mq.addEventListener?.("change", syncMode);

  window.addEventListener("resize", () => {
    if (!mq.matches) return;
    ul.scrollTo({ left: step() * idx, behavior: "auto" });
  });
})();

(() => {
  const viewport = document.querySelector(".brand_viewport");
  const track = document.querySelector(".brand_track");
  const prevBtn = document.querySelector(".brand_prev");
  const nextBtn = document.querySelector(".brand_next");

  if (!viewport || !track || !prevBtn || !nextBtn) return;

  const SPEED = 520;
  const thresholdRatio = 0.18;

  const originals = Array.from(track.children).map((li) => li.cloneNode(true));
  const originalCount = originals.length;
  if (originalCount < 2) return;

  let visible = 4;
  let itemW = 0;
  let index = 0;
  let moving = false;
  let rebuilding = false;

  let dragOn = false;
  let locked = false;
  let dragMoved = false;
  let startX = 0;
  let startY = 0;
  let dx = 0;
  let dy = 0;
  let basePx = 0;

  const mod = (n, m) => ((n % m) + m) % m;

  const getVisible = () => {
    const w = window.innerWidth;
    if (w <= 767) return 1;
    if (w <= 1194) return 2;
    return 4;
  };

  const setTransition = (on) => {
    track.style.transition = on
      ? `transform ${SPEED}ms cubic-bezier(.22,.61,.36,1)`
      : "none";
  };

  const setTranslate = (px) => {
    track.style.transform = `translate3d(${px}px,0,0)`;
  };

  const getTranslate = () => {
    const t = getComputedStyle(track).transform;
    if (!t || t === "none") return 0;
    if (t.startsWith("matrix3d")) return parseFloat(t.split(",")[12]) || 0;
    return parseFloat(t.split(",")[4]) || 0;
  };

  const calcItemW = (vis) => {
    const vw = viewport.getBoundingClientRect().width;
    if (!vw) return 0;
    return Math.round((vw / vis) * 1000) / 1000;
  };

  const setPos = () => setTranslate(-index * itemW);

  const getLeftOriginalFromCurrent = (oldVisible, oldItemW) => {
    if (!oldItemW) return 0;
    const curPx = getTranslate();
    const rawIndex = -curPx / oldItemW;
    const originalPos = rawIndex - oldVisible;
    return mod(originalPos, originalCount);
  };

  const alignToPage = (pos, page) => Math.round(pos / page) * page;

  function rebuild(newVisible, keepLeftOriginalIndex) {
    rebuilding = true;
    moving = false;
    dragOn = false;

    visible = newVisible;
    itemW = calcItemW(visible);
    if (!itemW) {
      rebuilding = false;
      return;
    }

    track.innerHTML = "";

    const head = originals.slice(0, visible).map((li) => li.cloneNode(true));
    const tail = originals.slice(-visible).map((li) => li.cloneNode(true));
    const all = [...tail, ...originals, ...head];

    all.forEach((li) => {
      li.style.width = `${itemW}px`;
      li.style.flex = `0 0 ${itemW}px`;
      track.appendChild(li);
    });

    const left = mod(keepLeftOriginalIndex, originalCount);
    index = visible + left;

    setTransition(false);
    setPos();
    track.offsetHeight;
    setTransition(true);

    rebuilding = false;
  }

  function normalize() {
    const start = visible;
    const end = start + originalCount;

    let changed = false;

    while (index >= end) {
      index = start + (index - end);
      changed = true;
    }

    while (index < start) {
      index = end + (index - start);
      changed = true;
    }

    if (!changed) return;

    setTransition(false);
    setPos();
    track.offsetHeight;
    setTransition(true);
  }

  function go(dir) {
    if (moving || rebuilding) return;
    moving = true;
    index += dir * visible;
    setPos();
  }

  track.addEventListener("transitionend", (e) => {
    if (e.target !== track) return;
    if (e.propertyName && e.propertyName !== "transform") return;
    if (!moving || rebuilding) return;
    normalize();
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

  const isBlockTarget = (t) => !!t.closest("button, input, textarea, select, label");

  const onDownCore = (clientX, clientY, preventDefaultFn, setCaptureFn) => {
    if (moving || rebuilding) return;
    if (isBlockTarget(document.elementFromPoint(clientX, clientY) || viewport)) return;

    dragOn = true;
    locked = false;
    dragMoved = false;
    dx = 0;
    dy = 0;

    startX = clientX;
    startY = clientY;
    basePx = getTranslate();

    setTransition(false);
    preventDefaultFn?.();
    setCaptureFn?.();

    track.style.userSelect = "none";
    viewport.style.cursor = "grabbing";
  };

  const onMoveCore = (clientX, clientY, preventDefaultFn) => {
    if (!dragOn || rebuilding) return;

    dx = clientX - startX;
    dy = clientY - startY;

    if (!locked) {
      if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 2) locked = true;
      else return;
    }

    if (Math.abs(dx) > 3) dragMoved = true;

    preventDefaultFn?.();
    setTranslate(basePx + dx);
  };

  const endDragCore = () => {
    if (!dragOn) return;
    dragOn = false;

    track.style.userSelect = "";
    viewport.style.cursor = "grab";

    setTransition(true);

    const abs = Math.abs(dx);
    const w = itemW || 1;

    if (locked && abs > w * thresholdRatio) {
      index += dx < 0 ? visible : -visible;
    } else if (dragMoved) {
      const cur = getTranslate();
      const raw = -cur / w;
      index = Math.round(raw / visible) * visible;
    }

    moving = true;
    setPos();

    clearTimeout(endDragCore._t);
    endDragCore._t = setTimeout(() => {
      moving = false;
      normalize();
    }, SPEED + 120);
  };

  const usePointer = "PointerEvent" in window;

  if (usePointer) {
    viewport.addEventListener("pointerdown", (e) => {
      if (e.pointerType === "mouse" && e.button !== 0) return;
      onDownCore(
        e.clientX,
        e.clientY,
        () => {
          if (e.cancelable) e.preventDefault();
        },
        () => viewport.setPointerCapture?.(e.pointerId)
      );
    });

    viewport.addEventListener(
      "pointermove",
      (e) => {
        onMoveCore(e.clientX, e.clientY, () => {
          if (e.cancelable) e.preventDefault();
        });
      },
      { passive: false }
    );

    viewport.addEventListener("pointerup", endDragCore);
    viewport.addEventListener("pointercancel", endDragCore);
    viewport.addEventListener("pointerleave", () => {
      if (dragOn) endDragCore();
    });
  } else {
    viewport.addEventListener(
      "touchstart",
      (e) => {
        if (!e.touches || !e.touches[0]) return;
        const t = e.touches[0];
        onDownCore(
          t.clientX,
          t.clientY,
          () => {
            if (e.cancelable) e.preventDefault();
          },
          null
        );
      },
      { passive: false }
    );

    viewport.addEventListener(
      "touchmove",
      (e) => {
        if (!e.touches || !e.touches[0]) return;
        const t = e.touches[0];
        onMoveCore(t.clientX, t.clientY, () => {
          if (e.cancelable) e.preventDefault();
        });
      },
      { passive: false }
    );

    viewport.addEventListener("touchend", endDragCore);
    viewport.addEventListener("touchcancel", endDragCore);

    viewport.addEventListener("mousedown", (e) => {
      if (e.button !== 0) return;
      onDownCore(
        e.clientX,
        e.clientY,
        () => {
          if (e.cancelable) e.preventDefault();
        },
        null
      );
    });

    window.addEventListener(
      "mousemove",
      (e) => {
        onMoveCore(e.clientX, e.clientY, null);
      },
      { passive: true }
    );

    window.addEventListener("mouseup", endDragCore);
  }

  viewport.addEventListener(
    "click",
    (e) => {
      if (dragMoved) {
        e.preventDefault();
        e.stopPropagation();
      }
    },
    true
  );

  viewport.addEventListener("dragstart", (e) => e.preventDefault());

  let raf = 0;
  window.addEventListener("resize", () => {
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(() => {
      const nextVisible = getVisible();

      const oldVisible = visible;
      const oldItemW = itemW || calcItemW(oldVisible);

      let leftOriginal = getLeftOriginalFromCurrent(oldVisible, oldItemW);
      leftOriginal = alignToPage(leftOriginal, oldVisible);
      leftOriginal = alignToPage(leftOriginal, nextVisible);
      leftOriginal = mod(leftOriginal, originalCount);

      rebuild(nextVisible, leftOriginal);
      normalize();
    });
  });

  viewport.style.cursor = "grab";
  rebuild(getVisible(), 0);
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

AOS.init({
  once: true,
  offset: 80,
  duration: 900,
  easing: "ease-out-cubic"
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
  const lightSections = document.querySelectorAll(".quick_nav, .main_wrap1_bg");
  const htmlEl = document.documentElement;
  const intersecting = new Set();

  if (lightSections.length === 0) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          intersecting.add(entry.target);
        } else {
          intersecting.delete(entry.target);
        }
      });

      htmlEl.classList.toggle("light-scrollbar", intersecting.size > 0);
    },
    {
      root: null,
      rootMargin: "-40% 0px -40% 0px",
      threshold: 0
    }
  );

  lightSections.forEach((el) => observer.observe(el));
})();