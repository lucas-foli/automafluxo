import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const INSTAGRAM_CLIENT_ID = process.env.INSTAGRAM_CLIENT_ID;
const INSTAGRAM_REDIRECT_URI = process.env.INSTAGRAM_REDIRECT_URI;
const INSTAGRAM_CLIENT_SECRET = process.env.INSTAGRAM_CLIENT_SECRET;

export const initiateInstagramFlow = async (req, res) => {
  console.log(INSTAGRAM_CLIENT_ID, INSTAGRAM_REDIRECT_URI);
  const url =
    "https://www.instagram.com/oauth/authorize?enable_fb_login=0&force_authentication=1&client_id=" +
    INSTAGRAM_CLIENT_ID +
    "&redirect_uri=" +
    INSTAGRAM_REDIRECT_URI +
    "&response_type=code&scope=instagram_business_basic%2Cinstagram_business_manage_messages%2Cinstagram_business_manage_comments%2Cinstagram_business_content_publish%2Cinstagram_business_manage_insights";
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.redirect(url);
};

export const getAccessToken = async (req, res) => {
  const code = req.url.split("code=")[1];

  // Cria os dados do formulário em formato URL encoded
  const formData = new URLSearchParams();
  formData.append("client_id", INSTAGRAM_CLIENT_ID);
  formData.append("client_secret", INSTAGRAM_CLIENT_SECRET);
  formData.append("grant_type", "authorization_code");
  formData.append("redirect_uri", INSTAGRAM_REDIRECT_URI);
  formData.append("code", code);

  try {
    const response = await axios.post(
      "https://api.instagram.com/oauth/access_token",
      formData.toString(),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    // Retorna os dados obtidos para o front-end
    const data = res.json(response.data);
    // console.log("getAccessToken response", data);
    // const tokenResponse = await getLongAccessToken(response.data);
    // res.status(200).json(tokenResponse.data)
  } catch (error) {
    console.error("Erro ao buscar o access token:", error);
    const status = error.response ? error.response.status : 500;
    res.status(status).json({ error: "Erro interno do servidor" });
  }
};

export const getLongAccessToken = async (getTokenData) => {
  try {
    const url = `https://graph.instagram.com/access_token?grant_type=ig_exchange_token&client_secret=${INSTAGRAM_CLIENT_SECRET}&access_token=${getTokenData.access_token}`;
    const response = await axios.get(url);

    const data = response.data;
    console.log("getLongAccessToken data", data);
    // Aqui você pode salvar os dados ou chamar saveUserToDatabase, etc.
    // saveUserToDatabase({
    //   fbUserId: data.userId || "userId",
    //   name: "name",
    //   token: data, // ou o token específico, conforme necessário
    // });
    res.status(200).json(data);
    window.alert("User connected!");
  } catch (error) {
    console.error("Error fetching access token:", error);
  }
};


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