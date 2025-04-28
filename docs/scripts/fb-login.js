// import axios from "https://cdn.jsdelivr.net/npm/axios/dist/esm/axios.js";

// function checkLoginState() {
//   FB.getLoginStatus(function (response) {
//     statusChangeCallback(response);
//   });
// }

// function statusChangeCallback(response) {
//   console.log("statusChangeCallback");
//   console.log(response);
//   if (response.status === "connected") {
//     // Usuário logado no Facebook – prosseguir para buscar dados da conta
//     getBusinessAccount();
//   } else {
//     document.getElementById("status").innerHTML =
//       "Por favor, faça login no Facebook.";
//   }
// }

// function getBusinessAccount() {
//   // Primeiro, obter informações básicas do usuário (opcional)
//   FB.api("/me?fields=id,name", function (userResponse) {
//     const fbUserId = userResponse.id;
//     // Salve o fbUserId e o nome do usuário no banco de dados
//     saveUserToDatabase({
//       fbUserId,
//       name: userResponse.name,
//     });
//     console.log("Logado como: " + userResponse.name);
//     document.getElementById("status").innerHTML =
//       "Obrigado por fazer login, " + userResponse.name + "!<br>";

//     // Agora, buscar as páginas que o usuário administra, incluindo dados do Instagram Business Account
//     FB.api(
//       "/me/accounts?fields=name,instagram_business_account",
//       function (pagesResponse) {
//         if (pagesResponse && pagesResponse.data) {
//           let found = false;
//           pagesResponse.data.forEach((page) => {
//             if (page.instagram_business_account) {
//               console.log(
//                 "Conta de Negócio do Instagram encontrada na página " +
//                   page.name +
//                   ": " +
//                   page.instagram_business_account.id
//               );
//               document.getElementById("status").innerHTML +=
//                 "Conta de Negócio do Instagram encontrada na página " +
//                 page.name +
//                 ": " +
//                 page.instagram_business_account.id +
//                 "<br>";
//               found = true;
//               updateUserInstagramId(
//                 fbUserId,
//                 page.instagram_business_account.id
//               );
//             }
//           });
//           if (!found) {
//             console.log(
//               "Nenhuma conta de negócio do Instagram vinculada às suas páginas foi encontrada."
//             );
//             document.getElementById("status").innerHTML +=
//               "Nenhuma conta de negócio do Instagram vinculada foi encontrada.<br>";
//           }
//         } else {
//           console.error("Erro ao buscar páginas.");
//           document.getElementById("status").innerHTML +=
//             "Erro ao buscar suas páginas.<br>";
//         }
//       }
//     );
//   });
// }

// const saveUserToDatabase = async ({ fbUserId, name, token }) => {
//   const database = client.db("instagram_connections");
//   const collection = database.collection("tokens");

//   const doc = { name: name, userId: fbUserId, token: token };
//   const result = await collection.insertOne(doc);
//   console.log(`A document was inserted with the _id: ${result.insertedId}`);
//   // fetch('/api/save-user', {
//   //   method: 'POST',
//   //   headers: {
//   //     'Content-Type': 'application/json'
//   //   },
//   //   body: JSON.stringify({ fbUserId, name })
//   // })
//   // .then(response => response.json())
//   // .then(data => console.log('User saved:', data))
//   // .catch(err => console.error('Error saving user:', err));
// };

// function updateUserInstagramId({ fbUserId, name }) {
//   saveUserToDatabase({ fbUserId, name });
// }

// document.addEventListener("DOMContentLoaded", function () {
//   const instagramLoginButton = document.getElementById("instagram-login");
//   const authorizeButton = document.getElementById("authorize");

//   instagramLoginButton.addEventListener("click", () => {
//     console.log("Instagram login button clicked");
//     window.location.href =
//       "https://www.instagram.com/oauth/authorize?enable_fb_login=0&force_authentication=1&client_id=" +
//       process.env.INSTAGRAM_CLIENT_ID +
//       "&redirect_uri=" +
//       process.env.REDIRECT_URI +
//       "&response_type=code&scope=instagram_business_basic%2Cinstagram_business_manage_messages%2Cinstagram_business_manage_comments%2Cinstagram_business_content_publish%2Cinstagram_business_manage_insights";
//   });
//   authorizeButton.addEventListener("click", () => {
//     const code = window.location.href.split("code=")[1].split("#_")[0];
//     console.log("Authorize button clicked");
//     fetchInstagramAccessToken(code);
//   });
// });

// const fetchInstagramAccessToken = async (code) => {
//   try {
//     const response = await axios.post(
//       "/api/instagram-access-token",
//       { code: code },
//       {
//         headers: {
//           "Content-Type": "application/json",
//         },
//       }
//     );

//     const data = await response.json();
//     console.log("Access Token Response:", data);
//     // Aqui você pode salvar os dados ou chamar saveUserToDatabase, etc.
//     saveUserToDatabase({
//       fbUserId: data.userId || "userId",
//       name: "name",
//       token: data, // ou o token específico, conforme necessário
//     });
//     window.alert("User connected!");
//     getLongAccessToken();
//   } catch (error) {
//     console.error("Error fetching access token:", error);
//   }
// };

// const getLongAccessToken = async () => {
//   try {
//     const response = await axios.get("/api/instagram/extend-token");

//     const data = await response.json();
//     // Aqui você pode salvar os dados ou chamar saveUserToDatabase, etc.
//     saveUserToDatabase({
//       fbUserId: data.userId || "userId",
//       name: "name",
//       token: data, // ou o token específico, conforme necessário
//     });
//     window.alert("User connected!");
//   } catch (error) {
//     console.error("Error fetching access token:", error);
//   }
// };


document.addEventListener("DOMContentLoaded", () => {
  const fbLoginButton = document.getElementById("fb-login");

  fbLoginButton.addEventListener(
    "click",
    () => (window.location.href = window.location.hostname.includes('localhost') ? 'http://localhost:3000/api/facebook/login' : 'https://api.automafluxo.com.br/api/facebook/login')
  );
});