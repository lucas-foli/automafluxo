document.addEventListener("DOMContentLoaded", () => {
  const instagramLoginButton = document.getElementById("instagram-login");
  const authorizeButton = document.getElementById("authorize");

  instagramLoginButton.addEventListener("click", () => window.location.href = '/api/instagram/initiate');
  authorizeButton.addEventListener("click", () => {
    const code = window.location.href.split("code=")[1].split("#_")[0];
    fetch(`/api/instagram/access-token?code=${code}`);
  });
});
