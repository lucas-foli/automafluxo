import axios from "https://cdn.jsdelivr.net/npm/axios/dist/esm/axios.js";




const saveUserToDatabase = async ({ fbUserId, name, token }) => {
  const database = client.db("instagram_connections");
  const collection = database.collection("tokens");

  const doc = { name: name, userId: fbUserId, token: token };
  const result = await collection.insertOne(doc);
  console.log(`A document was inserted with the _id: ${result.insertedId}`);
  // fetch('/api/save-user', {
  //   method: 'POST',
  //   headers: {
  //     'Content-Type': 'application/json'
  //   },
  //   body: JSON.stringify({ fbUserId, name })
  // })
  // .then(response => response.json())
  // .then(data => console.log('User saved:', data))
  // .catch(err => console.error('Error saving user:', err));
};

document.addEventListener("DOMContentLoaded", function () {
  const instagramLoginButton = document.getElementById("instagram-login");
  const authorizeButton = document.getElementById("authorize");

  instagramLoginButton.addEventListener("click", () => window.location.href = '/api/instagram/initiate');
  authorizeButton.addEventListener("click", () => {
    const code = window.location.href.split("code=")[1].split("#_")[0];
    console.log("Authorize button clicked");
    fetchInstagramAccessToken(code);
  });
});

const fetchInstagramAccessToken = async (code) => {
  try {
    const response = await axios.post(
      "/api/instagram-access-token",
      { code: code },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const data = await response.json();
    console.log("Access Token Response:", data);
    // Aqui você pode salvar os dados ou chamar saveUserToDatabase, etc.
    saveUserToDatabase({
      fbUserId: data.userId || "userId",
      name: "name",
      token: data, // ou o token específico, conforme necessário
    });
    window.alert("User connected!");
    getLongAccessToken();
  } catch (error) {
    console.error("Error fetching access token:", error);
  }
};

const getLongAccessToken = async () => {
  try {
    const response = await axios.get("/api/instagram/extend-token");

    const data = await response.json();
    // Aqui você pode salvar os dados ou chamar saveUserToDatabase, etc.
    saveUserToDatabase({
      fbUserId: data.userId || "userId",
      name: "name",
      token: data, // ou o token específico, conforme necessário
    });
    window.alert("User connected!");
  } catch (error) {
    console.error("Error fetching access token:", error);
  }
};
