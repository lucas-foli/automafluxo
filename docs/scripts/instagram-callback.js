(async () => {
  const statusEl = document.getElementById("status");
  const usernameHeader = document.getElementById("username");
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
    const response = await fetch(
      `https://api.automafluxo.com.br/api/instagram/callback?code=${code}`
    );

    if (!response.ok) {
      const error = await response.json();
      statusEl.textContent =
        "Failed to connect: " + (error.message || "Unknown error");
      loginButton.hidden = false;
      loginButton.addEventListener(
        "click",
        () =>
          (window.location.href = window.location.hostname.includes("localhost")
            ? "http://localhost:3000/api/instagram/initiate"
            : "https://api.automafluxo.com.br/api/instagram/initiate")
      );

      return;
    }

    const result = await response.json();
    usernameHeader.hidden = false;
    userIdParagraph.hidden = false;
    tokenParagraph.hidden = false;
    connectedParagraph.hidden = false;

    const img = document.createElement("img");
    img.src = result.profilePictureUrl;
    img.alt = "Profile Picture";
    img.style.width = "50px"; // Set the width of the image
    img.style.height = "50px"; // Set the height of the image
    img.style.borderRadius = "50%"; // Make it circular

    const helloTxt = document.createTextNode("Hello ");
    const usernameTxt = document.createTextNode(`@${result.username}`);
    usernameHeader.append(helloTxt, img, usernameTxt); // Append the image to the header

    usernameHeader.style.display = "flex";
    usernameHeader.style.alignItems = "center";
    usernameHeader.style.gap = "8px"; // space between picture and text

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
      () =>
        (window.location.href = window.location.hostname.includes("localhost")
          ? "http://localhost:3000/api/instagram/initiate"
          : "https://api.automafluxo.com.br/api/instagram/initiate")
    );
  }
})();
