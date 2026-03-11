const notices = [
  {
    id: "n-2025-12-21",
    cat: "policy",
    badge: "약관·정책",
    title: "CokePLAY 개인정보 처리방침 개정 안내",
    date: "2025-12-21",
    summary: "개정 사항 및 적용 일정은 공지 원문에서 확인해 주세요.",
    bullets: ["개정 내용 확인", "적용 일정 확인", "문의는 고객센터로 접수"],
    sourceUrl: "https://cokeplay.cocacola.co.kr/customer/board/list"
  },
  {
    id: "n-2025-11-28",
    cat: "policy",
    badge: "약관·정책",
    title: "CokePLAY 개인정보 처리방침(스토어) 개정 안내",
    date: "2025-11-28",
    summary: "스토어 영역 개인정보 처리방침 개정 공지입니다.",
    bullets: ["스토어 정책 변경사항 확인", "시행일자 확인", "관련 문의 접수"],
    sourceUrl: "https://cokeplay.cocacola.co.kr/customer/board/list"
  },
  {
    id: "n-2025-08-13",
    cat: "event",
    badge: "이벤트",
    title: "코카-콜라 <CokePLAY LIVE 7월> 이벤트 당첨자 안내",
    date: "2025-08-13",
    summary: "당첨자 및 경품 안내는 공지 원문을 확인해 주세요.",
    bullets: ["당첨자 안내", "경품/배송 관련 유의사항", "문의 채널 안내"],
    sourceUrl: "https://cokeplay.cocacola.co.kr/customer/board/list"
  },
  {
    id: "n-2025-02-24",
    cat: "service",
    badge: "서비스",
    title: "코-크 플레이 카드 잔액 반환 신청방법 안내",
    date: "2025-02-24",
    summary: "잔액 반환 절차 및 접수 방법을 안내하는 공지입니다.",
    bullets: ["신청 절차 확인", "접수 시 필요한 정보 준비", "처리 기간 확인"],
    sourceUrl: "https://cokeplay.cocacola.co.kr/customer/board/list"
  },
  {
    id: "n-2022-11-10",
    cat: "policy",
    badge: "약관·정책",
    title: "CokePLAY 개인정보 처리방침 이용약관 변경 안내",
    date: "2022-11-10",
    summary: "SNS 회원가입 시 수집 항목을 구체적으로 명시하는 내용이 포함됩니다.",
    bullets: [
      "변경 사항: SNS를 통한 회원가입 시 수집 항목 구체화",
      "예: 카카오 Authorize Code, Apple ID_Token 등(서비스 안내 기준)",
      "동의하지 않을 경우 회원 탈퇴 경로 안내"
    ],
    sourceUrl: "https://cokeplay.cocacola.co.kr/customer/board/view?noticeSeq=188"
  }
];

const $list = document.getElementById("list");
const $q = document.getElementById("q");
const $chips = Array.from(document.querySelectorAll(".chip"));
const $count = document.getElementById("count");
const $empty = document.getElementById("empty");

let activeFilter = "all";

function escapeHtml(s) {
  return String(s)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function matches(n, q, filter) {
  const inFilter = filter === "all" ? true : n.cat === filter;
  if (!inFilter) return false;

  const needle = q.trim().toLowerCase();
  if (!needle) return true;

  const hay = (n.title + " " + n.summary + " " + (n.bullets || []).join(" ")).toLowerCase();
  return hay.includes(needle);
}

function render() {
  const q = $q.value || "";
  const filtered = notices.filter((n) => matches(n, q, activeFilter));
  $count.textContent = String(filtered.length);

  $list.innerHTML = filtered
    .map((n) => {
      const title = escapeHtml(n.title);
      const date = escapeHtml(n.date);
      const badge = escapeHtml(n.badge);
      const summary = escapeHtml(n.summary);
      const bullets = (n.bullets || []).map((b) => `<li>${escapeHtml(b)}</li>`).join("");
      const panelId = `${n.id}-panel`;
      const btnId = `${n.id}-btn`;

      return `
        <article class="notice" role="listitem" aria-expanded="false" data-id="${escapeHtml(n.id)}" data-cat="${escapeHtml(n.cat)}">
          <button type="button" class="notice_head" id="${btnId}" aria-controls="${panelId}" aria-expanded="false">
            <div>
              <div class="notice_title">${title}</div>
              <div class="notice_sub">
                <span class="badge"><span class="badge_dot" aria-hidden="true"></span>${badge}</span>
                <span>${date}</span>
              </div>
            </div>
            <span class="chev" aria-hidden="true">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path fill="currentColor" d="M12 15.5 5.5 9l1.4-1.4L12 12.7l5.1-5.1L18.5 9 12 15.5Z"></path>
              </svg>
            </span>
          </button>

          <div class="notice_panel" id="${panelId}" role="region" aria-labelledby="${btnId}">
            <div class="notice_body">
              <p>${summary}</p>
              <ul>${bullets}</ul>
              <div class="notice_linkrow">
                <a class="linkbtn" href="${escapeHtml(n.sourceUrl)}" target="_blank" rel="noopener noreferrer">
                  공지 출처 보기
                </a>
                <button type="button" class="linkbtn" data-copy="${escapeHtml(n.sourceUrl)}">
                  출처 링크 복사
                </button>
              </div>
            </div>
          </div>
        </article>
      `;
    })
    .join("");

  $empty.hidden = filtered.length !== 0;

  wireAccordions();
  wireCopyButtons();
}

function closeAll(exceptId) {
  const items = Array.from(document.querySelectorAll(".notice"));
  items.forEach((item) => {
    const id = item.getAttribute("data-id");
    if (exceptId && id === exceptId) return;
    setExpanded(item, false);
  });
}

function setExpanded(item, expanded) {
  const btn = item.querySelector(".notice_head");
  const panel = item.querySelector(".notice_panel");
  if (!btn || !panel) return;

  item.setAttribute("aria-expanded", expanded ? "true" : "false");
  btn.setAttribute("aria-expanded", expanded ? "true" : "false");

  if (!expanded) {
    panel.style.height = panel.scrollHeight + "px";
    requestAnimationFrame(() => {
      panel.style.height = "0px";
    });
    return;
  }

  const target = panel.scrollHeight;
  panel.style.height = target + "px";

  const onEnd = (e) => {
    if (e.propertyName !== "height") return;
    panel.removeEventListener("transitionend", onEnd);
    if (item.getAttribute("aria-expanded") === "true") {
      panel.style.height = "auto";
    }
  };

  panel.addEventListener("transitionend", onEnd);
}

function wireAccordions() {
  const items = Array.from(document.querySelectorAll(".notice"));

  items.forEach((item) => {
    const btn = item.querySelector(".notice_head");
    const panel = item.querySelector(".notice_panel");
    if (!btn || !panel) return;

    btn.addEventListener("click", () => {
      const isOpen = item.getAttribute("aria-expanded") === "true";
      closeAll(item.getAttribute("data-id"));

      if (isOpen) {
        setExpanded(item, false);
        return;
      }

      if (panel.style.height === "auto") {
        panel.style.height = panel.scrollHeight + "px";
      }

      setExpanded(item, true);
    });

    btn.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        setExpanded(item, false);
        btn.blur();
      }
    });
  });
}

function wireCopyButtons() {
  const btns = Array.from(document.querySelectorAll("[data-copy]"));

  btns.forEach((b) => {
    b.addEventListener("click", async () => {
      const url = b.getAttribute("data-copy") || "";

      try {
        await navigator.clipboard.writeText(url);
        const prev = b.textContent;
        b.textContent = "복사됨";
        setTimeout(() => {
          b.textContent = prev;
        }, 900);
      } catch {
        const prev = b.textContent;
        b.textContent = "복사 실패";
        setTimeout(() => {
          b.textContent = prev;
        }, 900);
      }
    });
  });
}

$chips.forEach((chip) => {
  chip.addEventListener("click", () => {
    $chips.forEach((c) => c.setAttribute("aria-pressed", "false"));
    chip.setAttribute("aria-pressed", "true");
    activeFilter = chip.getAttribute("data-filter") || "all";
    closeAll();
    render();
  });
});

$q.addEventListener("input", () => {
  closeAll();
  render();
});

[
  "images/cocacola_login_logo_hover.png",
  "images/customer_btn_hover.png"
].forEach((src) => {
  const img = new Image();
  img.src = src;
});

render();