
[
  "images/cocacola_login_logo_hover.png",
  "images/join_btn_hover.png",
  "images/join_cancel_btn_hover.png",
  "images/join_id_check_btn_hover.png"
].forEach((src) => {
  const img = new Image();
  img.src = src;
});

(() => {
  const joinBtn = document.querySelector(".btn-join");
  if (joinBtn) {
    joinBtn.addEventListener("mouseenter", () => {
      joinBtn.style.backgroundImage = 'url("images/join_btn_hover.png")';
    });
    joinBtn.addEventListener("mouseleave", () => {
      joinBtn.style.backgroundImage = 'url("images/join_btn.png")';
    });
  }

  const cancelBtn = document.querySelector(".btn-cancel");
if (cancelBtn) {
  cancelBtn.addEventListener("mouseenter", () => {
    cancelBtn.style.backgroundImage = 'url("images/join_cancel_btn_hover.png")';
  });
  cancelBtn.addEventListener("mouseleave", () => {
    cancelBtn.style.backgroundImage = 'url("images/join_cancel_btn.png")';
  });
  cancelBtn.addEventListener("click", closePage);
}

function closePage() {
  if (window.opener) {
    window.close();
    return;
  }

  if (window.history.length > 1) {
    window.history.back();
    return;
  }

  location.href = "index.html";
}

  document.querySelectorAll(".btn-idcheck").forEach((btn) => {
    btn.addEventListener("mouseenter", () => {
      btn.style.backgroundImage = 'url("images/join_id_check_btn_hover.png")';
    });
    btn.addEventListener("mouseleave", () => {
      btn.style.backgroundImage = 'url("images/join_id_check_btn.png")';
    });
  });

  function onlyDigits(el) {
    el.value = el.value.replace(/\D/g, "");
  }

  function bindAutoNext(curr, next, maxLen) {
    if (!curr) return;
    curr.addEventListener("input", () => {
      onlyDigits(curr);
      if (curr.value.length >= maxLen && next) next.focus();
    });
  }

  function bindBackPrev(curr, prev) {
    if (!curr) return;
    curr.addEventListener("keydown", (e) => {
      if (e.key === "Backspace" && curr.value.length === 0 && prev) {
        prev.focus();
      }
    });
  }

  const h1 = document.getElementById("tel_home1");
  const h2 = document.getElementById("tel_home2");
  const h3 = document.getElementById("tel_home3");
  bindAutoNext(h1, h2, 3);
  bindAutoNext(h2, h3, 4);
  bindBackPrev(h2, h1);
  bindBackPrev(h3, h2);

  const m1 = document.getElementById("tel_mobile1");
  const m2 = document.getElementById("tel_mobile2");
  const m3 = document.getElementById("tel_mobile3");
  bindAutoNext(m1, m2, 3);
  bindAutoNext(m2, m3, 4);
  bindBackPrev(m2, m1);
  bindBackPrev(m3, m2);
})();

(() => {
  const dd = document.querySelector('[data-dd="email"]');
  if (!dd) return;

  const btn = dd.querySelector(".dd_btn");
  const list = dd.querySelector(".dd_list");
  const text = dd.querySelector("[data-dd-text]");
  const hidden = document.getElementById("email_domain");
  const email2 = document.getElementById("email2");

  function openDD() {
    dd.classList.add("open");
    btn.setAttribute("aria-expanded", "true");
  }

  function closeDD() {
    dd.classList.remove("open");
    btn.setAttribute("aria-expanded", "false");
  }

  btn.addEventListener("click", (e) => {
    e.preventDefault();
    dd.classList.contains("open") ? closeDD() : openDD();
  });

  list.addEventListener("click", (e) => {
    const item = e.target.closest(".dd_item");
    if (!item) return;

    const val = item.getAttribute("data-value");

    if (val === "custom") {
      hidden.value = "";
      text.textContent = "직접입력";
      dd.classList.remove("is-empty");
      closeDD();

      if (email2) {
        email2.value = "";
        email2.placeholder = "도메인 직접입력 (예: gmail.com)";
        email2.focus();
      }
      return;
    }

    hidden.value = val;
    text.textContent = val;
    dd.classList.remove("is-empty");
    closeDD();

    if (email2) {
      email2.value = val;
      email2.placeholder = "";
    }
  });

  document.addEventListener("click", (e) => {
    if (!dd.contains(e.target)) closeDD();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeDD();
  });
})();

(() => {
  const pw = document.getElementById("join_pw");
  if (!pw) return;

  const full = "비밀번호* (영문 대소문자/숫자/특수문자 중 2가지 이상 조합, 8자~16자)";
  const short = "비밀번호* (2종 조합, 8~16자)";

  const apply = () => {
    pw.placeholder = window.matchMedia("(max-width: 560px)").matches ? short : full;
  };

  apply();
  window.addEventListener("resize", apply);
})();
(() => {
  const addr0 = document.getElementById("addr0");
  const addr1 = document.getElementById("addr1");
  const addr2 = document.getElementById("addr2");
  const addrRow = document.querySelector(".row-addr");
  const postcodeBtn = addrRow ? addrRow.querySelector(".btn") : null;

  if (!addr0 || !addr1 || !postcodeBtn || !window.kakao || !window.kakao.Postcode) return;

  const openPostcode = () => {
    new kakao.Postcode({
      oncomplete: (data) => {
        const zonecode = data.zonecode || "";
        const roadAddress = data.roadAddress || "";
        const jibunAddress = data.jibunAddress || "";
        const extraParts = [];

        if (data.bname && /[동로가]$/g.test(data.bname)) {
          extraParts.push(data.bname);
        }

        if (data.buildingName && data.apartment === "Y") {
          extraParts.push(data.buildingName);
        }

        const extraAddress = extraParts.length ? ` (${extraParts.join(", ")})` : "";
        const baseAddress = roadAddress || jibunAddress;

        addr0.value = zonecode;
        addr1.value = `${baseAddress}${roadAddress ? extraAddress : ""}`;
        if (addr2) {
          addr2.focus();
        }
      }
    }).open({
      popupTitle: "우편번호 검색"
    });
  };

  postcodeBtn.addEventListener("click", openPostcode);
})();
(() => {
  const form = document.querySelector(".join_form");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const terms = sessionStorage.getItem("join_terms");
    const privacy = sessionStorage.getItem("join_privacy");

    if (terms !== "Y" || privacy !== "Y") {
      location.href = "join_agree.html";
      return;
    }

    const marketing = sessionStorage.getItem("join_marketing") || "N";
    console.log("마케팅 수신 동의:", marketing);

    location.href = "login.html";
  });
})();
function closePage() {
  if (window.opener) {
    window.close();
    return;
  }

  if (window.history.length > 1) {
    window.history.back();
    return;
  }

  location.href = "index.html";
}
const joinId = document.getElementById("join_id");
const idCheckBtn = document.getElementById("idCheckBtn");
const idCheckMsg = document.getElementById("idCheckMsg");

if (joinId) {
  joinId.addEventListener("input", () => {
    joinId.value = joinId.value.replace(/[^a-z0-9]/g, "");

    if (idCheckMsg) {
      idCheckMsg.textContent = "";
      idCheckMsg.classList.remove("is-error", "is-success", "is-show");
    }
  });
}

if (idCheckBtn && joinId && idCheckMsg) {
  idCheckBtn.addEventListener("click", () => {
    const value = joinId.value.trim();
    const idRule = /^[a-z0-9]{4,16}$/;

    idCheckMsg.classList.remove("is-error", "is-success");

    if (!value) {
      idCheckMsg.textContent = "아이디를 입력해주세요.";
      idCheckMsg.classList.add("is-error", "is-show");
      joinId.focus();
      return;
    }

    if (!idRule.test(value)) {
      idCheckMsg.textContent = "영문소문자/숫자 조합 4~16자로 입력해주세요.";
      idCheckMsg.classList.add("is-error", "is-show");
      joinId.focus();
      return;
    }

    idCheckMsg.textContent = "사용 가능한 아이디입니다.";
    idCheckMsg.classList.add("is-success", "is-show");
  });
}