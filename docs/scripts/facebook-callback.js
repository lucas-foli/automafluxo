(async () => {
  const statusEl = document.getElementById("status");
  const loginButton = document.getElementById("login");
  const params = new URLSearchParams(window.location.search);
  const code = params.get("code");

  if (!code) {
    statusEl.textContent = "Missing authorization code.";
    loginButton.hidden = false;
    return;
  }

  try {
    const response = await fetch(`/api/facebook/callback?code=${code}`);

    if (!response.ok) {
      const error = await response.json();
      statusEl.textContent =
        "Failed to connect: " + (error.message || "Unknown error");
      loginButton.hidden = false;
      loginButton.addEventListener(
        "click",
        () => (window.location.href = '/api/facebook/login')
      );

      return;
    }

    const result = await response.json();
    statusEl.textContent = "Facebook account connected successfully!";

    // Optional redirect after a few seconds:
    // setTimeout(() => window.location.href = '/dashboard', 3000);
  } catch (error) {
    statusEl.textContent = "Something went wrong: " + error.message;
    loginButton.hidden = false;
    loginButton.addEventListener(
      "click",
      () => (window.location.href = '/api/facebook/login')
    );
  }
})();