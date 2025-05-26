import axios from "axios";
import qs from "qs";
import { saveGoogleUser } from "./user.js";
import { handleAxiosError } from "../../utils/error-handler.js";
import GoogleUser from "../models/GoogleUser.js";

export const exchangeToken = async (req, res) => {
  const { code, state: whatsapp } = req.query;
  const redirectUri = "https://automafluxo.com.br/pages/google-callback.html";

  try {
    const { access_token, refresh_token, expires_in } =
      await exchangeCodeForTokens(code, redirectUri);

    await saveGoogleUser({
      whatsapp,
      accessToken: access_token,
      refreshToken: refresh_token,
      expiresIn: {
        timestamp: expires_in * 1000,
        dateString: new Date(Date.now() + expires_in * 1000),
      },
    });

    res.send(
      "✅ Autenticação concluída com sucesso. Você pode fechar essa aba."
    );
  } catch (error) {
    handleAxiosError(error);
    return res.status(500).json({
      error: "Erro ao trocar código por token:",
      details: error.message,
    });
  }
};

export const exchangeCodeForTokens = async (code, redirectUri) => {
  const response = await axios.post(
    "https://oauth2.googleapis.com/token",
    qs.stringify({
      code,
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      redirect_uri: redirectUri,
      grant_type: "authorization_code",
    }),
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );
  console.log("Response from Google token exchange:", response.data);
  return response.data;
};

export const refreshAccessToken = async (refreshToken) => {
  try {
    const response = await axios.post(
      "https://oauth2.googleapis.com/token",
      qs.stringify({
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        refresh_token: refreshToken,
        grant_type: "refresh_token",
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );
    console.log("Response from Google token refresh:", response.data);
    return response.data; // contém: access_token, expires_in, scope, token_type
  } catch (error) {
    handleAxiosError(error);
    throw new Error("Erro ao renovar access_token via refresh_token");
  }
};

export const getGoogleToken = async (req, res) => {
  const { whatsapp } = req.query;
  const user = await GoogleUser.findOne({ whatsapp });

  if (!user) {
    return res.status(404).json({ error: "Usuário não encontrado" });
  }

  console.log("User found:", user);

  const now = Date.now();
  const expiration = user.expiresIn; // salvar isso ao obter token
  const isValid = expiration && now < expiration - 60000;

  console.log('expiration', expiration);
  console.log('isValid', isValid);

  if (isValid) {
    return res.json({ access_token: user.accessToken });
  }

  try {
    const refreshed = await refreshAccessToken(user.refreshToken);
    console.log("Refreshed token:", refreshed);

    await saveGoogleUser({
      whatsapp,
      accessToken: refreshed.access_token,
      expiresIn: now + refreshed.expires_in * 1000,
    });

    return res.json({ access_token: refreshed.access_token });
  } catch (error) {
    return res.status(500).json({ error: "Erro ao renovar token" });
  }
};
