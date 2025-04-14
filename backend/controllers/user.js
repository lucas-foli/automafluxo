import User from "../models/User.js";

export const saveUserData = async ({userId, name, token}) => {
  try {
    // Verifica se o usuário já existe no banco de dados
    let user = await User.findOne({ userId });

    if (!user) {
      user = new User({ userId, name, token });
      await user.save();
      console.log("Usuário criado com sucesso:");
    } else {
      user.name = name;
      user.token = token;
      await user.save();
      console.log("Usuário atualizado com sucesso:");
    }
    return user;
  } catch (error) {
    console.error("Erro ao salvar usuário:", error);
    throw error;
  }
};

export const saveUser = async (req, res) => {

// 3. TODO: Get the username from userId + token
try {
  username = await getUserData(shortToken);
  console.log("User data:", username);
} catch (error) {
  console.error("Error fetching user data:", error);
  const status = error.response ? error.response.status : 500;
  return res.status(status).json({
    error: "Failed to fetch user data",
    details: error.message,
  });
}
// need to figure out how to get the username
// const userData = await getUserData(response.data.user_id, tokenResponse.access_token);

// 4. Save the user data to the database
try {
  const user = await saveUserData({
    userId,
    name: username,
    token: longToken,
  });
  console.log("User saved successfully:", { user });
} catch (error) {
  console.error("Error saving user data:", error);
  return res.status(500).json({
    error: "Failed to save user data",
    details: error.message,
  });
}
}

export const getUserData = async (token) => {
  try {
    const url = `https://graph.instagram.com/me?fields=username&access_token=${token}`;
    const response = await axios.get(url);
    const username = await response.data.username;
    return username;
  } catch (error) {
    console.error("Error fetching user data:", error);
    throw error;
  }
};