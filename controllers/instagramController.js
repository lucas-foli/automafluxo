import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const INSTAGRAM_CLIENT_ID = process.env.INSTAGRAM_CLIENT_ID;
const INSTAGRAM_REDIRECT_URI = process.env.INSTAGRAM_REDIRECT_URI;

export const initiateInstagramFlow = async (req, res) => {
  try {
    console.log(INSTAGRAM_CLIENT_ID, INSTAGRAM_REDIRECT_URI);
    const url =
      "https://www.instagram.com/oauth/authorize?enable_fb_login=0&force_authentication=1&client_id=" +
      INSTAGRAM_CLIENT_ID +
      "&redirect_uri=" +
      INSTAGRAM_REDIRECT_URI +
      "&response_type=code&scope=instagram_business_basic%2Cinstagram_business_manage_messages%2Cinstagram_business_manage_comments%2Cinstagram_business_content_publish%2Cinstagram_business_manage_insights";
    const response = await axios.post(url);
    // console.log(response.config.url);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.redirect(response.config.url);
  } catch (error) {
    const status = error.response ? error.response.status : 500;
    res.status(status).json({ error: "Erro interno do servidor" });
    console.error("Internal server error 🐣");
  }
};
