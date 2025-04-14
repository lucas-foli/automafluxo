const statusEl = document.getElementById("status");
const instagramLoginButton = document.getElementById("instagram-login");

const handleInstagramCallback = async (code) => {
  try {
    const response = await fetch(
      `https://api.automafluxo.com.br/api/instagram/callback?code=${code}`
    );

    if (!response.ok) {
      const error = await response.json();
      statusEl.textContent =
        "Failed to connect: " + (error.message || "Unknown error");
      instagramLoginButton.hidden = false;
      instagramLoginButton.addEventListener(
        "click",
        () =>
          (window.location.href = window.location.hostname.includes("localhost")
            ? "http://localhost:3000/api/instagram/initiate"
            : "https://api.automafluxo.com.br/api/instagram/initiate")
      );
      return;
    }

    const result = await response.json();
    statusEl.textContent = "Instagram account connected successfully!";
  } catch (error) {
    statusEl.textContent = "Something went wrong: " + error.message;
    instagramLoginButton.hidden = false;
    instagramLoginButton.addEventListener(
      "click",
      () =>
        (window.location.href = window.location.hostname.includes("localhost")
          ? "http://localhost:3000/api/instagram/initiate"
          : "https://api.automafluxo.com.br/api/instagram/initiate")
    );
  }
};

const saveUser = async () => {
  try {
    const response = await fetch(
      "https://api.automafluxo.com.br/api/save-user"
    );

    if (!response.ok) {
      const error = await response.json();
      statusEl.textContent =
        "Failed to save user: " + (error.message || "Unknown error");
      return;
    }

    const result = await response.json();
    console.log("User saved:", result);
  } catch (error) {
    statusEl.textContent = "Something went wrong: " + error.message;
    instagramLoginButton.addEventListener(
      "click",
      () =>
        (window.location.href = window.location.hostname.includes("localhost")
          ? "http://localhost:3000/api/instagram/initiate"
          : "https://api.automafluxo.com.br/api/instagram/initiate")
    );
  }
};

(async () => {
  const params = new URLSearchParams(window.location.search);
  const code = params.get("code");

  if (!code) {
    statusEl.textContent = "Missing authorization code.";
    instagramLoginButton.hidden = false;
    return;
  }

  await handleInstagramCallback(code);
  // await saveUser();
})();
