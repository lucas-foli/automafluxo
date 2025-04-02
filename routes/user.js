const express = require('express');
const router = express.Router();
const User = require('../models/User');

router.post('/save-user', async (req, res) => {
  try {
    const { fbUserId, name } = req.body;
    // Se o usuário já existir, atualize; caso contrário, insira um novo registro.
    const user = await User.findOneAndUpdate(
      { fbUserId },
      { name },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    res.status(200).json({ message: 'Usuário salvo com sucesso!', user });
  } catch (error) {
    console.error('Erro ao salvar usuário:', error);
    res.status(500).json({ error: 'Erro ao salvar usuário' });
  }
});

module.exports = router;