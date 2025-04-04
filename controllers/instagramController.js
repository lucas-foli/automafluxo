import { createHmac, timingSafeEqual } from "crypto";
import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const INSTAGRAM_CLIENT_ID = process.env.INSTAGRAM_CLIENT_ID;
const INSTAGRAM_REDIRECT_URI = process.env.INSTAGRAM_REDIRECT_URI;
const INSTAGRAM_CLIENT_SECRET = process.env.INSTAGRAM_CLIENT_SECRET;
const APP_SECRET = process.env.APP_SECRET;

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

export const deleteUserData = (req, res) => {
  const signedRequest = req.body.signed_request;
  const data = parseSignedRequest(signedRequest, APP_SECRET);

  if (!data) {
    return res.status(400).json({ error: "Invalid signed request" });
  }

  try {
    const confirmationCode = Math.floor(
      100000 + Math.random() * 900000
    ).toString(); // Gere um código único, por exemplo
    const statusUrl =
      "https://www.automafluxo.com.br/api/instagram/delete-data?id=" + confirmationCode;
    return res.json({
      url: statusUrl,
      confirmation_code: confirmationCode,
    });
  } catch (err) {
    console.error("Erro ao excluir dados:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

/**
 * Função para decodificar strings em Base64 URL-safe
 */
function base64UrlDecode(str) {
  // Substitui '-' por '+' e '_' por '/' e adiciona padding se necessário
  let base64 = str.replace(/-/g, "+").replace(/_/g, "/");
  while (base64.length % 4) {
    base64 += "=";
  }
  return Buffer.from(base64, "base64").toString("utf8");
}

/**
 * Função para analisar o signed_request
 */
function parseSignedRequest(signedRequest, appSecret) {
  if (!signedRequest) return null;

  const [encodedSig, payload] = signedRequest.split(".", 2);
  if (!encodedSig || !payload) return null;

  // Decodifica a assinatura e o payload
  const sig = Buffer.from(
    encodedSig.replace(/-/g, "+").replace(/_/g, "/"),
    "base64"
  );
  const data = JSON.parse(base64UrlDecode(payload));

  // Calcula a assinatura esperada usando HMAC-SHA256 com o app secret
  const expectedSig = createHmac("sha256", appSecret).update(payload).digest();

  // Compara as assinaturas de forma segura
  if (!timingSafeEqual(sig, expectedSig)) {
    console.error("Bad Signed JSON signature!");
    return null;
  }
  return data;
}
