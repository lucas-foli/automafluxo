const APP_ID = process.env.APP_ID;
const FACEBOOK_REDIRECT_URI = process.env.FACEBOOK_REDIRECT_URI;
const APP_SECRET = process.env.APP_SECRET;

export const initiateFbLogin = async (req, res) => {
  const redirectUrl = `https://www.facebook.com/v20.0/dialog/oauth?client_id=${APP_ID}&redirect_uri=${encodeURIComponent(
    FACEBOOK_REDIRECT_URI
  )}&scope=public_profile,pages_show_list,pages_read_engagement,pages_messaging`;
  res.redirect(redirectUrl);
};

export const getFbAccessToken = async (req, res) => {
  const code = req.url.split("code=")[1].split("#_")[0];
  if (!code)
    return res.status(400).json({ error: "Missing authorization code" });

  let userToken = "";
  let pageInfo = {};

  try {
    const formData = new URLSearchParams();
    formData.append("client_id", APP_ID);
    formData.append("client_secret", APP_SECRET);
    formData.append("redirect_uri", FACEBOOK_REDIRECT_URI);
    formData.append("code", code);

    const response = await axios.get(
      "https://graph.facebook.com/v20.0/oauth/access_token",
      {
        params: {
          client_id: APP_ID,
          client_secret: APP_SECRET,
          redirect_uri: FACEBOOK_REDIRECT_URI,
          code: code,
        },
      }
    );

    userToken = response.data.access_token;
    console.log("User Token exchanged: ", userToken);
  } catch (error) {
    console.error("Failed to get user access token:", error);
    const status = error.response ? error.response.status : 500;
    return res.status(status).json({
      error: "Failed to get access token from Facebook",
      details: error.message,
    });
  }

  try {
    const formData = new URLSearchParams();
    formData.append("access_token", userToken);

    const pagesResponse = await axios.get(
      "https://graph.facebook.com/v20.0/me/accounts",
      { params: { access_token: userToken } }
    );

    console.log(pagesResponse.data);
    pageInfo.access_token = pagesResponse.data[0].access_token;
    pageInfo.name = pagesResponse.data[0].name;
    pageInfo.id = pagesResponse.data[0].id;
    return pageInfo;
  } catch (error) {
    const status = error.response ? error.response.status : 500;
    console.error("Error getting user accounts:", error, error.message, status);
  }

  try {
    const user = await saveUserData({
      userId: pageInfo.id,
      name: pageInfo.name,
      token: pageInfo.access_token,
    });
    console.log("User saved successfully:", { user });
  } catch (error) {
    console.error("Error saving user data:", error);
    return res.status(500).json({
      error: "Failed to save user data",
      details: error.message,
    });
  }
};
