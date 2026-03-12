const loginBtn = document.getElementById("loginBtn");

if (loginBtn) {
  loginBtn.addEventListener("mouseenter", () => {
    loginBtn.style.backgroundImage = 'url("images/btn_login_hover.png")';
  });

  loginBtn.addEventListener("mouseleave", () => {
    loginBtn.style.backgroundImage = 'url("images/btn_login.png")';
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