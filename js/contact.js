[
  "images/cocacola_login_logo_hover.png",
  "images/customer_btn_hover.png"
].forEach((src) => {
  const img = new Image();
  img.src = src;
});

function handleSubmitForm(form) {
  const data = {
    type: (form.q_type?.value || "").trim(),
    name: (form.name?.value || "").trim(),
    email: (form.email?.value || "").trim(),
    subject: (form.subject?.value || "").trim(),
    message: (form.message?.value || "").trim()
  };

  if (!data.type || !data.name || !data.email || !data.subject || !data.message) {
    alert("필수 항목을 모두 입력해 주세요.");
    return false;
  }

  alert("문의가 접수되었습니다. 감사합니다!");
  form.reset();

  const dd = document.querySelector('[data-dd="qtype"]');
  if (dd) {
    dd.classList.add("is-empty");
    dd.classList.remove("open");

    const text = dd.querySelector("[data-dd-text]");
    if (text) text.textContent = "문의 유형 선택*";

    const hidden = document.getElementById("q_type");
    if (hidden) hidden.value = "";
  }

  return false;
}

(() => {
  const form = document.querySelector(".form_grid");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    handleSubmitForm(form);
  });
})();

(() => {
  const dd = document.querySelector('[data-dd="qtype"]');
  if (!dd) return;

  const btn = dd.querySelector(".dd_btn");
  const list = dd.querySelector(".dd_list");
  const text = dd.querySelector("[data-dd-text]");
  const hidden = document.getElementById("q_type");

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
    if (dd.classList.contains("open")) closeDD();
    else openDD();
  });

  list.addEventListener("click", (e) => {
    const item = e.target.closest(".dd_item");
    if (!item) return;

    hidden.value = item.getAttribute("data-value");
    text.textContent = item.textContent;
    dd.classList.remove("is-empty");
    closeDD();
  });

  document.addEventListener("click", (e) => {
    if (!dd.contains(e.target)) closeDD();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeDD();
  });
})();