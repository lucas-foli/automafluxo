(async () => {
  const statusEl = document.getElementById("status");
  const usernameParagraph = document.getElementById("username");
  const userIdParagraph = document.getElementById("userId");
  const tokenParagraph = document.getElementById("token");
  const connectedParagraph = document.getElementById("connected");
  const loginButton = document.getElementById("login");
  const params = new URLSearchParams(window.location.search);
  const code = params.get("code");

  if (!code) {
    statusEl.textContent = "Missing authorization code.";
    loginButton.hidden = false;
    return;
  }

  try {
    const response = await fetch(`https://api.automafluxo.com.br/api/instagram/callback?code=${code}`);

    if (!response.ok) {
      const error = await response.json();
      statusEl.textContent =
        "Failed to connect: " + (error.message || "Unknown error");
      loginButton.hidden = false;
      loginButton.addEventListener(
        "click",
        () => (window.location.href = window.location.hostname.includes('localhost') ? 'http://localhost:3000/api/instagram/initiate' : 'https://api.automafluxo.com.br/api/instagram/initiate')
      );

      return;
    }

    const result = await response.json();
    usernameParagraph.hidden = false;
    userIdParagraph.hidden = false;
    tokenParagraph.hidden = false;
    connectedParagraph.hidden = false;
    
    usernameParagraph.textContent = `Hello @${result.username}!`;
    connectedParagraph.textContent = `You can start using the features of Automafluxo`;
    userIdParagraph.textContent = `Your user ID is ${result.userId}.`;
    
    statusEl.textContent = "Instagram account connected successfully!";

    // Optional redirect after a few seconds:
    // setTimeout(() => window.location.href = '/dashboard', 3000);
  } catch (error) {
    statusEl.textContent = "Something went wrong: " + error.message;
    loginButton.hidden = false;
    loginButton.addEventListener(
      "click",
      () => (window.location.href = window.location.hostname.includes('localhost') ? 'http://localhost:3000/api/instagram/initiate' : 'https://api.automafluxo.com.br/api/instagram/initiate')
    );
  }
})();