[
  "images/cocacola_login_logo_hover.png",
  "images/customer_btn_hover.png"
].forEach((src) => {
  const img = new Image();
  img.src = src;
});

(function () {
  const list = document.getElementById("faqList");
  if (!list) return;

  const items = Array.from(list.querySelectorAll(".faq_item"));
  const empty = document.getElementById("faqEmpty");
  const search = document.getElementById("faqSearch");
  const chips = Array.from(document.querySelectorAll(".chip"));

  let activeCat = "all";

  function closeAllItems() {
    items.forEach((it) => {
      it.classList.remove("is-open");
      const btn = it.querySelector(".faq_q");
      if (btn) btn.setAttribute("aria-expanded", "false");
    });
  }

  function toggleItem(item) {
    const isOpen = item.classList.contains("is-open");
    closeAllItems();
    item.classList.toggle("is-open", !isOpen);
    const btn = item.querySelector(".faq_q");
    if (btn) btn.setAttribute("aria-expanded", String(!isOpen));
  }

  items.forEach((it) => {
    const btn = it.querySelector(".faq_q");
    if (!btn) return;
    btn.addEventListener("click", () => toggleItem(it));
  });

  function normalize(s) {
    return (s || "").toLowerCase().replace(/\s+/g, "");
  }

  function applyFilter() {
    const q = normalize(search ? search.value : "");
    let shown = 0;

    items.forEach((it) => {
      const cat = it.getAttribute("data-cat") || "";
      const hay = normalize(it.getAttribute("data-q") || "") + normalize(it.innerText);

      const catOk = activeCat === "all" ? true : cat === activeCat;
      const qOk = q ? hay.indexOf(q) !== -1 : true;

      const visible = catOk && qOk;
      it.style.display = visible ? "" : "none";
      if (visible) shown += 1;
    });

    if (empty) {
      empty.style.display = shown === 0 ? "block" : "none";
    }

    const anyOpenVisible = items.some(
      (it) => it.classList.contains("is-open") && it.style.display !== "none"
    );

    if (!anyOpenVisible) closeAllItems();
  }

  chips.forEach((chip) => {
    chip.addEventListener("click", () => {
      chips.forEach((c) => {
        c.classList.remove("is-active");
        c.setAttribute("aria-pressed", "false");
      });

      chip.classList.add("is-active");
      chip.setAttribute("aria-pressed", "true");
      activeCat = chip.getAttribute("data-cat") || "all";
      applyFilter();
    });
  });

  if (search) {
    search.addEventListener("input", applyFilter);
  }

  applyFilter();
})();