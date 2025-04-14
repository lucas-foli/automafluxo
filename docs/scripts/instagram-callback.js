(async () => {
  const statusEl = document.getElementById("status");
  const instagramLoginButton = document.getElementById("instagram-login");
  const params = new URLSearchParams(window.location.search);
  const code = params.get("code");

  if (!code) {
    statusEl.textContent = "Missing authorization code.";
    instagramLoginButton.hidden = false;
    return;
  }

  try {
    const response = await fetch(`https://api.automafluxo.com.br/api/instagram/callback?code=${code}`);

    if (!response.ok) {
      const error = await response.json();
      statusEl.textContent =
        "Failed to connect: " + (error.message || "Unknown error");
      instagramLoginButton.hidden = false;
      instagramLoginButton.addEventListener(
        "click",
        () => (window.location.href = window.location.hostname.includes('localhost') ? 'http://localhost:3000/api/instagram/initiate' : 'https://api.automafluxo.com.br/api/instagram/initiate')
      );

      return;
    }

    const result = await response.json();
    statusEl.textContent = "Instagram account connected successfully!";

    // Optional redirect after a few seconds:
    // setTimeout(() => window.location.href = '/dashboard', 3000);
  } catch (error) {
    statusEl.textContent = "Something went wrong: " + error.message;
    instagramLoginButton.hidden = false;
    instagramLoginButton.addEventListener(
      "click",
      () => (window.location.href = window.location.hostname.includes('localhost') ? 'http://localhost:3000/api/instagram/initiate' : 'https://api.automafluxo.com.br/api/instagram/initiate')
    );
  }
})();