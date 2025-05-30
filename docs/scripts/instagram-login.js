/* NEEDS CLEANUP
    - Remove saveMeButton
    - Remove authorizeButton
*/
document.addEventListener("DOMContentLoaded", () => {
  const instagramLoginButton = document.getElementById("instagram-login");
  const authorizeButton = document.getElementById("authorize");
  const saveMeButton = document.getElementById("save");

  instagramLoginButton.addEventListener(
    "click",
    () => (window.location.href = window.location.hostname.includes('localhost') ? 'http://localhost:3000/api/instagram/initiate' : 'https://api.automafluxo.com.br/api/instagram/initiate')
  );
  authorizeButton.addEventListener("click", () => {
    const code = window.location.href.split("code=")[1].split("#_")[0];
    fetch(`/api/instagram/access-token?code=${code}`);
  });
  saveMeButton.addEventListener("click", () => {
    fetch(`/api/instagram/save-user`);
  });
});
