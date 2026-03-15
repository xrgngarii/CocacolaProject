(() => {
  const form = document.getElementById("agreeForm");
  const all = document.getElementById("agree_all");
  const checks = Array.from(document.querySelectorAll(".agree_check"));
  const requiredChecks = Array.from(document.querySelectorAll(".agree_required"));
  const nextBtn = document.getElementById("agreeNext");

  if (!form || !all || !checks.length || !requiredChecks.length || !nextBtn) return;

  const syncState = () => {
    const allChecked = checks.every((check) => check.checked);
    const requiredChecked = requiredChecks.every((check) => check.checked);

    all.checked = allChecked;
    nextBtn.disabled = !requiredChecked;
  };

  all.addEventListener("change", () => {
    checks.forEach((check) => {
      check.checked = all.checked;
    });
    syncState();
  });

  checks.forEach((check) => {
    check.addEventListener("change", syncState);
  });

  form.addEventListener("submit", (e) => {
    const requiredChecked = requiredChecks.every((check) => check.checked);

    if (!requiredChecked) {
      e.preventDefault();
      return;
    }

    sessionStorage.setItem("join_terms", document.querySelector('input[name="terms"]').checked ? "Y" : "N");
    sessionStorage.setItem("join_privacy", document.querySelector('input[name="privacy"]').checked ? "Y" : "N");
    sessionStorage.setItem("join_marketing", document.querySelector('input[name="marketing"]').checked ? "Y" : "N");
  });

  syncState();
})();
(() => {
  const viewButtons = document.querySelectorAll(".agree_view");
  const details = document.querySelectorAll(".agree_detail");

  if (!viewButtons.length) return;

  viewButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const targetId = button.getAttribute("data-target");
      const currentDetail = document.getElementById(targetId);
      const isOpen = currentDetail && currentDetail.classList.contains("is-open");

      details.forEach((detail) => {
        detail.classList.remove("is-open");
      });

      viewButtons.forEach((btn) => {
        btn.textContent = "보기";
      });

      if (!isOpen && currentDetail) {
        currentDetail.classList.add("is-open");
        button.textContent = "닫기";
      }
    });
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