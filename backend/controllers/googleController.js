import axios from "axios";
import qs from "qs";
import { saveGoogleUser } from "./user.js";

export const getGoogleToken = async (req, res) => {
  const { code, state } = req.query;

  try {
    const response = await axios.post(
      "https://oauth2.googleapis.com/token",
      qs.stringify({
        code,
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        redirect_uri: "https://automafluxo.com.br/pages/google-callback.html",
        grant_type: "authorization_code",
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    const { access_token, refresh_token, expires_in } = response.data;
    console.log(response.data);
    // Salve esses tokens no seu banco junto com o WhatsApp do usuário (state)
    await saveGoogleUser({
      whatsapp: state,
      accessToken: access_token,
      createdAt: refresh_token,
      expiresIn: expires_in,
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
