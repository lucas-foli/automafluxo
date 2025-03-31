const express = require('express');
const crypto = require('crypto');
const app = express();

// Middleware para processar dados de formulário (POST)
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

function deleteUserData(fbUserId) {
    app.post()
}

/**
 * Função para decodificar strings em Base64 URL-safe
 */
function base64UrlDecode(str) {
    // Substitui '-' por '+' e '_' por '/' e adiciona padding se necessário
    let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
    while (base64.length % 4) {
        base64 += '=';
    }
    return Buffer.from(base64, 'base64').toString('utf8');
}

/**
 * Função para analisar o signed_request
 */
function parseSignedRequest(signedRequest, appSecret) {
    if (!signedRequest) return null;

    const [encodedSig, payload] = signedRequest.split('.', 2);
    if (!encodedSig || !payload) return null;

    // Decodifica a assinatura e o payload
    const sig = Buffer.from(encodedSig.replace(/-/g, '+').replace(/_/g, '/'), 'base64');
    const data = JSON.parse(base64UrlDecode(payload));

    // Calcula a assinatura esperada usando HMAC-SHA256 com o app secret
    const expectedSig = crypto.createHmac('sha256', appSecret)
        .update(payload)
        .digest();

    // Compara as assinaturas de forma segura
    if (!crypto.timingSafeEqual(sig, expectedSig)) {
        console.error('Bad Signed JSON signature!');
        return null;
    }
    return data;
}

/**
 * Endpoint para exclusão de dados
 */
app.post('/data-deletion-callback', (req, res) => {
    const signedRequest = req.body.signed_request;
    const appSecret = process.env.APP_SECRET; // Recomenda-se usar variáveis de ambiente
    const data = parseSignedRequest(signedRequest, appSecret);

    if (!data) {
        return res.status(400).json({ error: 'Invalid signed request' });
    }

    const fbUserId = data.user_id;

    deleteUserData(fbUserId)
    .then(() => {
      const confirmationCode = generateConfirmationCode(fbUserId); // Gere um código único, por exemplo
      const statusUrl = 'https://www.automafluxo.com.br/deletion?id=' + confirmationCode;
      return res.json({
        url: statusUrl,
        confirmation_code: confirmationCode
      });
    })
    .catch(err => {
      console.error('Erro ao excluir dados:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    });
});

// Inicializa o servidor (você pode integrar essa rota à sua aplicação existente)
app.listen(3000, () => {
    console.log('Data deletion callback endpoint rodando na porta 3000');
});