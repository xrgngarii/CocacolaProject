const loginBtn = document.getElementById("loginBtn");

if (loginBtn) {
  loginBtn.addEventListener("mouseenter", () => {
    loginBtn.style.backgroundImage = 'url("images/btn_login_hover.png")';
  });

  loginBtn.addEventListener("mouseleave", () => {
    loginBtn.style.backgroundImage = 'url("images/btn_login.png")';
  });
}