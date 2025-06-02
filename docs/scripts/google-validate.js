(async () => {
  const connectionResult = document.getElementById("connection-result");
  const loginButton = document.getElementById("login");
  const params = new URLSearchParams(window.location.search);
  const whatsapp = params.get("whatsapp");
  // const loginHandler = () => {
  //   loginButton.addEventListener(
  //     "click",
  //     () =>
  //       (window.location.href = window.location.hostname.includes("localhost")
  //         ? "http://localhost:3000/api/instagram/initiate"
  //         : "https://api.automafluxo.com.br/api/instagram/initiate")
  //   );
  // };


  try {
    const response = await fetch(
      `https://api.automafluxo.com.br/api/google/token?whatsapp=${whatsapp}`
    );

    if (!response.ok) {
      const error = await response.json();
      connectionResult.innerHTML = `<p style="margin-bottom: 16px; font-size: 18px; font-weight: bold; text-align: center;">
      Failed to connect: ${error.message || "Unknown error"};
    </p>`;
      loginButton.hidden = false;
      // loginHandler();

      return;
    }

    console.log("Response from Google authentication:", response);
    connectionResult.innerHTML = `<p style="margin-bottom: 16px; font-size: 18px; font-weight: bold; text-align: center;">
    Autenticado! Redirecionando ao WhatsApp...
  </p>`;

    setTimeout(() => (window.location.href = "https://api.whatsapp.com/send?phone=551152862523&text=Conectado%20no%20Google%20"), 3000);
  } catch (error) {
    connectionResult.textContent = "Something went wrong: " + error.message;
    loginButton.hidden = false;
    // loginHandler();
  }
})();
