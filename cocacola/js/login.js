const loginBtn = document.getElementById("loginBtn");
const loginForm = document.querySelector(".login_form");
const loginId = document.getElementById("login_id");

if (loginBtn) {
  loginBtn.addEventListener("mouseenter", () => {
    loginBtn.style.backgroundImage = 'url("images/btn_login_hover.png")';
  });

  loginBtn.addEventListener("mouseleave", () => {
    loginBtn.style.backgroundImage = 'url("images/btn_login.png")';
  });
}

if (loginForm) {
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    location.href = "index.html";
  });
}

if (loginId) {
  loginId.addEventListener("input", () => {
    loginId.value = loginId.value.replace(/[^a-zA-Z]/g, "");
  });
}

(() => {
  const pwInput = document.getElementById("login_pw");
  const pwToggle = document.getElementById("pwToggle");

  if (!pwInput || !pwToggle) return;

  pwToggle.addEventListener("click", () => {
    const isPassword = pwInput.type === "password";

    pwInput.type = isPassword ? "text" : "password";
    pwToggle.classList.toggle("is-on", isPassword);
    pwToggle.setAttribute("aria-pressed", isPassword ? "true" : "false");
    pwToggle.setAttribute("aria-label", isPassword ? "비밀번호 숨기기" : "비밀번호 보기");
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