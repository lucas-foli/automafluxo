import User from "../models/User.js";
import GoogleUser from "../models/GoogleUser.js";

export const saveUserData = async ({ userId, name, token, profilePicUrl }) => {
  // const userId = "9164357020324792";
  // const token =
  //   "IGAAQLgGchM45BZAE1iWFVsSXB6WktibVVZAd00xM013WkdvdGJQOFlmWG9rY3hjdlZA5eDZAnLXNyTW8teVlZAUnl4bzlpdmFxMU9CZA3JiUnViN1VyU1F4MkVjaUZAoMTZAXQ0l2ZAUIxaTQ2bm54c1RtRXFpR3FR";
  // const name = "simplifiqa";
  try {
    // Verifica se o usuário já existe no banco de dados
    let user = await User.findOne({ userId });

    if (!user) {
      user = new User({ userId, name, token, profilePictureUrl });
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

export const saveGoogleUser = async ({
  whatsapp,
  accessToken,
  refreshToken,
  createdAt,
  expiresIn,
}) => {
  try {
    // Verifica se o usuário já existe no banco de dados
    let user = await GoogleUser.findOne({ whatsapp });

    if (!user) {
      user = new GoogleUser({ whatsapp, accessToken, createdAt, expiresIn });
      await user.save();
      console.log("Usuário criado com sucesso:");
    } else {
      user.whatsapp = whatsapp;
      user.accessToken = accessToken;
      user.refreshToken = refreshToken;
      user.createdAt = createdAt;
      user.expiresIn = expiresIn;
      await user.save();
      console.log("Usuário atualizado com sucesso:");
      console.log(user);
    }
    return user;
  } catch (error) {
    console.error("Erro ao salvar usuário:", error);
    throw error;
  }
};
