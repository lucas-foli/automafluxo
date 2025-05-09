import axios from "axios";
import dotenv from "dotenv";
import { saveUserData } from "./user.js";
import User from "../models/User.js";
import { handleAxiosError } from "../../utils/error-handler.js";
dotenv.config();

const INSTAGRAM_CLIENT_ID = process.env.INSTAGRAM_CLIENT_ID;
const INSTAGRAM_REDIRECT_URI = process.env.INSTAGRAM_REDIRECT_URI;
const INSTAGRAM_CLIENT_SECRET = process.env.INSTAGRAM_CLIENT_SECRET;
const APP_SECRET = process.env.APP_SECRET;

export const initiateInstagramFlow = async (req, res) => {
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
  const code = req.url.split("code=")[1].split("#_")[0];
  if (!code)
    return res.status(400).json({ error: "Missing authorization code" });

  let longToken = "";
  let shortToken = "";
  let userId = "";

  // 1. Get the short-lived access token
  try {
    const formData = new URLSearchParams();
    formData.append("client_id", INSTAGRAM_CLIENT_ID);
    formData.append("client_secret", INSTAGRAM_CLIENT_SECRET);
    formData.append("grant_type", "authorization_code");
    formData.append("redirect_uri", INSTAGRAM_REDIRECT_URI);
    formData.append("code", code);

    const response = await axios.post(
      "https://api.instagram.com/oauth/access_token",
      formData.toString(),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    shortToken = response.data.access_token;
    userId = response.data.user_id;
    console.log("shortToken exchanged: ", shortToken);
    console.log("User data for short token ", response.data);
  } catch (error) {
    handleAxiosError(error);
    return res.status(500).json({
      error: "Failed to get access token from Instagram",
      details: error.message,
    });
  }

  // 2. Get the long-lived access token
  try {
    const tokenResponse = await getLongAccessToken(shortToken);
    longToken = tokenResponse.access_token;
    console.log("token extended: ", longToken);
    console.log("User data for long token ", tokenResponse.data);
  } catch (error) {
    handleAxiosError(error);
    return res.status(500).json({
      error: "Failed to extend access token",
      details: error.message,
    });
  }

  // 3. TODO: Get the username from token
  const { username, profilePictureUrl } = await getUserData(longToken);

  // 4. Save the user data to the database
  try {
    const user = await saveUserData({
      userId,
      name: username,
      token: longToken,
      profilePictureUrl,
    });
    console.log("User saved successfully:", { user });
    console.log("User data saveUserData ", user.data);
  } catch (error) {
    handleAxiosError(error);
    return res.status(500).json({
      error: "Failed to save user data",
      details: error.message,
    });
  }

  return res.status(200).json({
    message: "User successfully authenticated",
    userId,
    longToken,
    username,
    profilePictureUrl,
  });
};

const getLongAccessToken = async (token) => {
  try {
    const url = `https://graph.instagram.com/access_token?grant_type=ig_exchange_token&client_secret=${INSTAGRAM_CLIENT_SECRET}&access_token=${token}`;
    const response = await axios.get(url);

    const data = response.data;
    console.log("getLongAccessToken data", data);
    return data;
  } catch (error) {
    handleAxiosError(error);
    return res.status(500).json({ error: "Error fetching access token" });
  }
};

export const deleteUserData = async (req, res) => {
  const { name } = req.body;

  try {
    // Aqui você deveria apagar o usuário do banco de dados
    // (Exemplo usando MongoDB ou outro, aqui é só mock)

    console.log(`Deleting data for user: ${name}`);
    const res = await User.deleteOne({ name });
    res.deletedCount === 0
      ? console.log(`User ${name} not found`)
      : console.log(`User ${name} deleted successfully`);

    // Simulação de exclusão
    return res;
  } catch (error) {
    handleAxiosError(error);
    return res.status(500).json({ error: "Error deleting user data" });
  }
};

export const fetchUser = async (req, res) => {
  try {
    const user = await User.find({ name: req.query.username });

    return res.json({ user: user[0] });
  } catch (error) {
    handleAxiosError(error);
    return res.status(500).json({ error: "Error fetching user token" });
  }
};
export const getUserData = async (token) => {
  try {
    const url = `https://graph.instagram.com/me?fields=id,username,profile_picture_url&access_token=${token}`;
    const response = await axios.get(url);
    const username = await response.data.username;
    const profilePictureUrl = await response.data.profile_picture_url;
    const userData = {
      username,
      profilePictureUrl,
    };
    return userData;
  } catch (error) {
    handleAxiosError(error);
    return res.status(500).json({ error: "Error fetching user data" });
  }
};

export const getMediaId = async (req, res) => {
  const token = req.query.access_token;
  const userId = req.query.userId;
  console.log("get-media:", userId, token);

  if (!userId) {
    return res.status(400).json({ error: "User ID is missing" });
  }
  if (!token) {
    return res.status(400).json({ error: "Access token is missing" });
  }

  try {
    const mediaResponse = await axios.get(
      `https://graph.instagram.com/v22.0/${userId}/media?access_token=${token}`
    );

    const mediaId = await mediaResponse.data.data[0].id;
    return res.json({ mediaId });
  } catch (error) {
    handleAxiosError(error);
    return res.status(500).json({ error: "Error fetching media ID" });
  }
};
// --- 2. instagram_business_manage_comments ---
export const fetchComments = async (req, res) => {
  const accessToken = req.query.access_token;
  const mediaId = req.query.mediaId;
  console.log("fetch-comments:", mediaId, accessToken);
  try {
    const response = await axios.get(
      `https://graph.instagram.com/v22.0/${mediaId}/comments?access_token=${accessToken}`
    );
    return res.json({ data: response.data });
  } catch (error) {
    handleAxiosError(error);
    return res.status(500).json({ error: "Error fetching comments" });
  }
};

export const getCommentByID = async (req, res) => {
  const { commentId, token } = req.query;
  console.log("get-comment-by-id:", commentId, token);
  try {
    const response = await axios.get(
      `https://graph.instagram.com/v22.0/${commentId}?fields=text,from&access_token=${token}`
    );
    console.log("get-comment-by-id response", response.data);
    return res.json({ data: response.data });
  } catch (error) {
    handleAxiosError(error);
    return res.status(500).json({ error: "Error fetching comment" });
  }
};

export const replyToComment = async (req, res) => {
  const { commentId, message, token } = req.query;
  console.log("reply-comment:", commentId, message, token);

  try {
    let data = JSON.stringify({
      message,
    });

    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: `https://graph.instagram.com/v22.0/${commentId}/replies`,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        Cookie:
          "csrftoken=5zNvUAXnInyk1KaJuxGfPcxIRH7O5JIQ; ig_did=6EC16D77-D2F8-4A1E-BBA1-02BC75873E8B; ig_nrcb=1; mid=Z-qtwwAEAAFJNstbQR-VLv38xsyG",
      },
      data: data,
    };

    const response = await axios.request(config);

    return res.json({ data: response.data });
  } catch (error) {
    handleAxiosError(error);
    return res.status(error.response?.status || 500).json({
      error: "Error replying to comment",
      details: error.message,
    });
  }
};

// --- 3. instagram_business_manage_messages ---
// Meta exige uso da API Messenger Platform com IG-linked Page ID
export const fetchIGConversations = async (req, res) => {
  const { userId, token } = req.query;

  try {
    const response = await axios.get(
      `https://graph.instagram.com/v22.0/${userId}/conversations?platform=instagram&access_token=${token}`
    );
    return res.json({ data: response.data });
  } catch (error) {
    handleAxiosError(error);
    return res.status(error.response?.status || 500).json({
      error: "Error replying to comment",
      details: error.message,
    });
  }
};

export const fetchMessage = async (req, res) => {
  const { conversation_id, token } = req.query;

  try {
    const fbRes = await axios.get(
      `https://graph.instagram.com/v22.0/${conversation_id}/messages?access_token=${token}&fields=message,from,to,created_time`
    );
    console.log(fbRes.data);
    const data = await fbRes.data;
    return res.json({ data: data.data });
  } catch (error) {
    handleAxiosError(error);
    return res.status(500).json({ error: "Error fetching messages" });
  }
};

export const replyToIGMessage = async (req, res) => {
  const { userId, token, messageText, recipientId } = req.body;
  console.log(userId, token, recipientId, messageText);
  try {
    const fbRes = await axios.post(
      `https://graph.instagram.com/v22.0/${userId}/messages?access_token=${token}`,
      {
        recipient: { id: recipientId },
        message: { text: messageText },
      },
      {
        headers: { "Content-Type": "application/json" },
      }
    );

    return res.json(fbRes.data);
  } catch (error) {
    handleAxiosError(error);
    return res.status(500).json({ error: "Error replying message" });
  }
};

// --- 4. instagram_business_content_publish ---
export const publishIGPhoto = async (
  imageUrl,
  caption,
  igUserId,
  accessToken
) => {
  const container = await axios.post(
    `https://graph.facebook.com/v22.0/${igUserId}/media?image_url=${encodeURIComponent(
      imageUrl
    )}&caption=${encodeURIComponent(caption)}&access_token=${accessToken}`
  );
  const { id: containerId } = await container.json();

  const publish = await axios.post(
    `https://graph.facebook.com/v22.0/${igUserId}/media_publish?creation_id=${containerId}&access_token=${accessToken}`
  );
  return await publish.json();
};

// --- 5. instagram_business_manage_insights ---
export const fetchAccountInsights = async (igUserId, accessToken) => {
  const response = await axios.get(
    `https://graph.facebook.com/v22.0/${igUserId}/insights?metric=impressions,reach,profile_views&period=day&access_token=${accessToken}`
  );
  return await response.json();
};

export const fetchPostInsights = async (mediaId, accessToken) => {
  const response = await axios.get(
    `https://graph.facebook.com/v22.0/${mediaId}/insights?metric=impressions,reach,saved,engagement&access_token=${accessToken}`
  );
  return await response.json();
};

// --- 6. pages_messaging + human_agent (Messenger) ---
export const markHumanAgent = async (conversationId, accessToken) => {
  const conversations = await axios.post(
    `https://graph.facebook.com/v22.0/${conversationId}/pass_thread_control?access_token=${accessToken}`,
    {
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ target_app_id: 263902037430900 }), // Human Agent ID
    }
  );
  return conversations.json();
};

export const sendHumanAgentMessage = async (
  conversationId,
  message,
  accessToken
) => {
  const messagesData = await axios.post(
    `https://graph.facebook.com/v22.0/${conversationId}/messages?access_token=${accessToken}`,
    {
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message_type: "RESPONSE", message }),
    }
  );
  return messagesData.json();
};
