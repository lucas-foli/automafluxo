import { API_BASE_URL } from "./config";

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
    () => (window.location.href = `${API_BASE_URL}/api/instagram/initiate`)
  );
  authorizeButton.addEventListener("click", () => {
    const code = window.location.href.split("code=")[1].split("#_")[0];
    fetch(`${API_BASE_URL}/api/instagram/access-token?code=${code}`);
  });
  saveMeButton.addEventListener("click", () => {
    fetch(`${API_BASE_URL}/api/save-user?fbUserId=123&name=John Doe`);
  });
});
