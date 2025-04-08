import User from "../models/User.js";
import { getUserData } from "./instagramController.js";

export const saveUserData = async () => {
  //   const userData = await getUserData();
  //   const { userId, name } = userData;
  //   const { userId, name, token } = req.query;
  const userId = "9164357020324792";
  const token =
    "IGAAQLgGchM45BZAE1iWFVsSXB6WktibVVZAd00xM013WkdvdGJQOFlmWG9rY3hjdlZA5eDZAnLXNyTW8teVlZAUnl4bzlpdmFxMU9CZA3JiUnViN1VyU1F4MkVjaUZAoMTZAXQ0l2ZAUIxaTQ2bm54c1RtRXFpR3FR";
  const name = "simplifiqa";
  try {
    // Verifica se o usuário já existe no banco de dados
    let user = await User.findOne({ userId });

    if (!user) {
      console.log("user not found");
      // Se o usuário não existir, cria um novo registro
      user = new User({ userId, name, token });
      await user.save();
    //   return res
    //     .status(201)
    //     .json({ message: "Usuário criado com sucesso!", user });
    }

    console.log(`User: ${user}`);
    // Se o usuário já existir, atualiza os dados
    user.name = name;
    await user.save();
    res.status(200).json({ message: "Usuário atualizado com sucesso!", user });
  } catch (error) {
    console.error("Erro ao salvar usuário:", error);
    res.status(500).json({ error: "Erro ao salvar usuário" });
  }
};
