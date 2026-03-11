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
  const $shell = $(".goods_shell");
  const $frame = $("#goodsFrame");
  const $slides = $frame.find(".goods_slide");
  const $prev = $shell.find(".goods_prev");
  const $next = $shell.find(".goods_next");
  const $tabs = $(".goods_tab");

  let activeSet = 0;
  let itemIdx = 0;

  const DATA = {
    0: [
      {
        img: "images/goods_year.png",
        badge: "연휴 베스트셀러",
        title: "코카콜라 분수컵 인형",
        lead: "코카콜라 분수컵 인형으로 집에 즐거움을 더해보세요.",
        desc: "웃는 얼굴과 코카콜라 특유의 빨간색과 흰색 디테일이 돋보이는 이 귀여운 인형은 수집가뿐 아니라 추억을 불러일으키는 재미있는 선물로도 좋아요.",
        specs: [
          "소재: 고급 플러시 및 펠트, 자수 디테일",
          '대략적인 크기: 12" × 6.75" × 6.75"',
          "관리 방법: 부분 세척",
          "원산지: 수입"
        ]
      },
      {
        img: "images/goods_year_2.png",
        badge: "연휴 베스트셀러",
        title: "Champion 스웨트셔츠",
        lead: "면 혼방 플리스 원단, 스크린 프린팅과 로고 패치 디테일.",
        desc: "챔피언(Champion)의 이 스웨트셔츠는 면 혼방 소재의 도톰한 플리스 원단으로 제작되었으며, 앞면에 스크린 프린팅 디테일이, 왼쪽 소매에는 로고 패치가 부착되어 있습니다. 소매와 허리 부분에 커프스가 있고, 겨드랑이 부분에 박음질된 패널이 있는 패셔너블한 디자인입니다.",
        specs: [
          "소재: 면 82%/폴리에스터 18%",
          "관리 방법: 기계 세탁 가능",
          "원산지: 수입"
        ]
      },
      {
        img: "images/goods_year_3.png",
        badge: "연휴 베스트셀러",
        title: "터비스 스테인리스 텀블러",
        lead: "뜨거운 음료는 따뜻하게, 차가운 음료는 시원하게 유지.",
        desc: "이 스테인리스 스틸 소재의 터비스 텀블러는 뜨거운 음료는 따뜻하게, 차가운 음료는 시원하게 유지하는 데 탁월하며 로고가 스크린 프린팅되어 있습니다.",
        specs: [
          '대략적인 크기: 7"×3.5"×3.5"',
          "용량: 20온스",
          "재질: 고급 구리 코팅/스테인리스 스틸",
          "관리 방법: 손세탁",
          "전자레인지/냉동실/식기세척기 사용 비권장",
          "물 튀김 방지·파손 방지·쉽게 닫히는 뚜껑",
          "보온: 최대 8시간 / 보냉: 최대 24시간",
          "제한적 평생 보증",
          "원산지: 수입 (디자인/장식: 플로리다주 베니스)"
        ]
      },
      {
        img: "images/goods_year_4.png",
        badge: "연휴 베스트셀러",
        title: "코카콜라 스마일 실리콘 텀블러",
        lead: "밝고 경쾌한 스마일 디자인의 355ml 재사용 텀블러.",
        desc: "코카콜라 스마일 실리콘 텀블러로 일상에 코카콜라의 즐거움을 더해보세요! FDA 승인을 받은 실리콘 소재로 제작된 이 355ml 텀블러는 밝고 경쾌한 코카콜라 스마일 디자인으로, 한 모금 마실 때마다 기분 좋은 에너지를 선사합니다. 가볍고 휴대하기 편하며 깨지지 않아 가정, 통근, 캠핑 또는 야외 활동에 이상적입니다.",
        specs: [
          "용량: 12온스",
          "재질: 100% 식품 등급, FDA 승인 실리콘",
          "사용 방법: 식기세척기/냉동실/전자레인지 사용 가능",
          "BPA/BPS/프탈레이트 무첨가",
          "원산지: 수입"
        ]
      }
    ],
    1: [
      {
        img: "images/goods_bear.png",
        badge: "북극곰 컬렉션",
        title: "스카프를 두른 코카콜라<br>북극곰 인형 - 25cm",
        lead: "남녀노소 누구나 사랑하는 이 상징적인 캐릭터를 선물하세요.",
        desc: "표면 세척이 가능한 부드러운 합성 털과 귀여운 유리 눈 디테일. 코카콜라 로고가 자수로 새겨진 밝은 빨간색 스카프가 함께 제공됩니다.",
        specs: [
          "소재: 고급 플러시 및 펠트, 자수 디테일",
          '대략적인 크기: 12" × 6.75" × 6.75"',
          "관리 방법: 부분 세척",
          "원산지: 수입"
        ]
      },
      {
        img: "images/goods_bear_2.png",
        badge: "북극곰 컬렉션",
        title: "코카콜라 북극곰 포근한 양말",
        lead: "xF 디지털 PB 코지삭스",
        desc: "",
        specs: [
          "SKU: 노스야드-23846",
          "UPC: 088881021703",
          "크기: 기본",
          "무게(파운드): 1.000000"
        ]
      },
      {
        img: "images/goods_bear_3.png",
        badge: "북극곰 컬렉션",
        title: "코카콜라 북극곰 패밀리 8온스 병",
        lead: "",
        desc: "이 8온스짜리 코카콜라 병은 수축 포장지에 북극곰 가족 그림이 그려져 있습니다.",
        specs: [
          "SKU: 노스야드-20924",
          "UPC: 410001227960",
          "무게(파운드): 1.000000"
        ]
      },
      {
        img: "images/goods_bear_4.png",
        badge: "북극곰 컬렉션",
        title: "코카콜라 북극곰 윈터 머그컵",
        lead: "따뜻한 겨울 무드를 담은 세라믹 머그.",
        desc: "북극곰 일러스트와 코카콜라 레드 포인트가 들어간 데일리 머그컵입니다. 손에 잡히는 그립감이 좋고, 따뜻한 음료를 즐기기에 적당한 용량으로 집/사무실 어디서나 잘 어울려요.",
        specs: [
          "SKU: 노스야드-24107",
          "UPC: 410001228233",
          "용량: 11온스",
          "재질: 세라믹",
          "관리 방법: 전자레인지/식기세척기 사용 가능(권장: 상단 랙)",
          "무게(파운드): 1.200000"
        ]
      }
    ]
  };

  function syncTabs() {
    $tabs.removeClass("is-active").attr("aria-selected", "false");
    $tabs.filter(`[data-set="${activeSet}"]`).addClass("is-active").attr("aria-selected", "true");
  }

  function showSet(setNo) {
    activeSet = setNo;
    itemIdx = 0;
    $slides.removeClass("is-active").filter(`[data-slide="${activeSet}"]`).addClass("is-active");
    syncTabs();
    renderItem(activeSet, itemIdx);
  }

  function renderItem(setNo, i) {
    const list = DATA[setNo] || [];
    if (!list.length) return;

    itemIdx = (i + list.length) % list.length;
    const item = list[itemIdx];
    const $slide = $slides.filter(`[data-slide="${setNo}"]`);
    const $mainImg = $slide.find(".goods_visual img");

    $mainImg.attr("src", item.img);

    const isSmileTumbler = setNo === 0 && itemIdx === 3;
    $mainImg.toggleClass("is-small", isSmileTumbler);

    $slide.find(".goods_badge").text(item.badge || "");
    $slide.find(".goods_info h3").html(item.title || "");
    $slide.find(".goods_info .lead").text(item.lead || "");
    $slide.find(".goods_info .desc").text(item.desc || "");

    const $spec = $slide.find(".goods_specs");
    if ($spec.length) {
      $spec.empty();
      if (item.specs && item.specs.length) {
        item.specs.forEach((t) => {
          const s = String(t);
          const parts = s.split(":");
          const key = (parts[0] || "").trim();
          const val = parts.slice(1).join(":").trim();

          if (!val) {
            $spec.append(`<li>${s}</li>`);
          } else {
            $spec.append(`<li><b>${key}:</b> ${val}</li>`);
          }
        });
      }
    }
  }

  $tabs.on("click", function () {
    const target = Number($(this).attr("data-set"));
    if (Number.isNaN(target)) return;
    showSet(target);
  });

  $prev.on("click", function (e) {
    e.preventDefault();
    renderItem(activeSet, itemIdx - 1);
  });

  $next.on("click", function (e) {
    e.preventDefault();
    renderItem(activeSet, itemIdx + 1);
  });

  $frame.on("click", ".goods_slide.is-active .goods_thumb", function () {
    const i = Number($(this).attr("data-idx"));
    if (Number.isNaN(i)) return;
    renderItem(activeSet, i);
  });

  $(document).on("keydown", function (e) {
    if (e.key === "ArrowLeft") renderItem(activeSet, itemIdx - 1);
    if (e.key === "ArrowRight") renderItem(activeSet, itemIdx + 1);
  });

  showSet(0);
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
  if (!btn) return;

  const toggleShow = () => {
    const y = window.scrollY || document.documentElement.scrollTop || 0;
    btn.classList.toggle("is-show", y > 400);
  };

  btn.addEventListener("click", (e) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  });

  window.addEventListener("scroll", toggleShow, { passive: true });
  window.addEventListener("resize", toggleShow);
  toggleShow();
})();

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
  if (typeof kakao === "undefined" || !kakao.maps) return;

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
          <a href="https://map.kakao.com/link/map/한국 코카-콜라,37.570377,126.973342" target="_blank" rel="noopener noreferrer">큰지도</a>
          <a href="https://map.kakao.com/link/to/한국 코카-콜라,37.570377,126.973342" target="_blank" rel="noopener noreferrer">길찾기</a>
        </div>
      </div>
    `;

    const overlay = new kakao.maps.CustomOverlay({
      position: coords,
      content: content,
      yAnchor: 1.35
    });

    overlay.setMap(map);
    mapLoaded = true;
  }

  function refreshMap() {
    if (!map || !coords) return;
    map.relayout();
    map.setCenter(coords);
  }

  function openModal() {
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    initMap();
    setTimeout(() => {
      refreshMap();
    }, 120);
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

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.classList.contains("is-open")) {
      closeModal();
    }
  });

  window.addEventListener("resize", () => {
    if (modal.classList.contains("is-open")) {
      setTimeout(() => {
        refreshMap();
      }, 120);
    }
  });
})();