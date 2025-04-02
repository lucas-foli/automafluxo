const express = require("express");
const axios = require("axios");
const router = express.Router();

const INSTAGRAM_CLIENT_ID = process.env.INSTAGRAM_CLIENT_ID;
const INSTAGRAM_CLIENT_SECRET = process.env.INSTAGRAM_CLIENT_SECRET;
const INSTAGRAM_REDIRECT_URI = process.env.INSTAGRAM_REDIRECT_URI;

// Endpoint para buscar o access token do Instagram
router.post("/", async (req, res) => {
  const { code } = req.body;

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
    res.json(response.data);
  } catch (error) {
    console.error("Erro ao buscar o access token:", error);
    const status = error.response ? error.response.status : 500;
    res.status(status).json({ error: "Erro interno do servidor" });
  }
});

router.get("/extend-token", async (req, res) => {
  const url = new URL("https://graph.instagram.com/access_token");
  const { URLSearchParams } = req.params;
  try {
    const response = await axios.get(url, { params: URLSearchParams });
    res.json(response.data);
  } catch (error) {
    console.error("Erro ao buscar o access token:", error);
    const status = error.response ? error.response.status : 500;
    res.status(status).json({ error: "Erro interno do servidor" });
  }
  url.searchParams.append("client_secret", INSTAGRAM_CLIENT_SECRET);
  url.searchParams.append("access_token", accessToken);
});

module.exports = router;
