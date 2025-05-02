(async () => {
  const connectionResult = document.getElementById("connection-result");
  const connectionHeader = document.getElementById("connection-header");
  const loginButton = document.getElementById("login");
  const params = new URLSearchParams(window.location.search);
  const code = params.get("code");

  const loginHandler = () => {
    loginButton.addEventListener(
      "click",
      () =>
        (window.location.href = window.location.hostname.includes("localhost")
          ? "http://localhost:3000/api/instagram/initiate"
          : "https://api.automafluxo.com.br/api/instagram/initiate")
    );
  };

  connectionResult.innerHTML = `<p style="margin-bottom: 16px; font-size: 18px; font-weight: bold; text-align: center;">
  Processing...
</p>`;

  if (!code) {
    connectionResult.innerHTML = `<p style="margin-bottom: 16px; font-size: 18px; font-weight: bold; text-align: center;">
    Missing authorization code
  </p>`;
    loginButton.hidden = false;
    loginHandler();
    return;
  }

  try {
    const response = await fetch(
      `https://api.automafluxo.com.br/api/instagram/callback?code=${code}`
    );

    if (!response.ok) {
      const error = await response.json();
      connectionResult.innerHTML = `<p style="margin-bottom: 16px; font-size: 18px; font-weight: bold; text-align: center;">
      Failed to connect: ${error.message || "Unknown error"};
    </p>`;
      loginButton.hidden = false;
      loginHandler();

      return;
    }

    const result = await response.json();

    const img = document.createElement("img");
    img.src = result.profilePictureUrl;
    img.alt = "Profile Picture";
    img.style.width = "50px"; // Set the width of the image
    img.style.height = "50px"; // Set the height of the image
    img.style.borderRadius = "50%"; // Make it circular

    connectionHeader.innerHTML = `
    <p style="margin-bottom: 16px; font-size: 18px; font-weight: bold; text-align: center;">
      Welcome
      <img src="${result.profilePictureUrl}" alt="Profile Picture" style="width: 30px; height: 30px; border-radius: 50%;">
        @${result.username}!
    </p>`;
    connectionResult.innerHTML = `
  <div style="
    background: rgba(0, 0, 0, 0.7);
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    max-width: 400px;
    margin: auto;
    text-align: left;
    color: #fff;
  ">
    <p style="margin-bottom: 16px; font-size: 18px; font-weight: bold; text-align: center;">
      Instagram account connected successfully!
    </p>
    <ul style="list-style: none; padding: 0; margin: 0 0 16px 0;">
      <li style="display: flex; align-items: center; gap: 8px; margin-bottom: 10px;">
        <strong>Username:</strong> 
        <img src="${result.profilePictureUrl}" alt="Profile Picture" style="width: 30px; height: 30px; border-radius: 50%;">
        @${result.username}
      </li>
      <li style="margin-bottom: 10px;">
        <strong>User ID:</strong> ${result.userId}
      </li>
    </ul>
    <p style="margin: 0; font-size: 16px; text-align: center;">
      You can start using the features of Automafluxo
    </p>
  </div>
`;

    // Optional redirect after a few seconds:
    // setTimeout(() => window.location.href = '/dashboard', 3000);
  } catch (error) {
    statusEl.textContent = "Something went wrong: " + error.message;
    loginButton.hidden = false;
    loginHandler();
  }
})();
