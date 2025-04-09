import dotenv from "dotenv";
import cors from "cors";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";

import apiRoutes from "./routes/index.js";
import mongoose from "mongoose";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "../.env") });

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("✅ Connected to MongoDB with Mongoose"))
  .catch((err) => console.error("❌ Mongoose connection error:", err));

// Configuração do Express
const app = express();
app.set("trust proxy", true);

const corsOptions = {
  origin: (origin, callback) => {
    const allowedOrigins = [
      "http://localhost:3000",
      "https://www.automafluxo.com.br",
    ];

    if (!origin) {
      // ⚠️ Permite requisições sem Origin (como curl, Postman)
      return callback(null, true);
    }

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      console.error("❌ Bloqueado por CORS:", origin);
      return callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "OPTIONS"],
  credentials: true,
};

app.use(cors(corsOptions));

app.use((req, res, next) => {
  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Origin", req.headers.origin || "*");
    res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type,Authorization");
    res.setHeader("Access-Control-Allow-Credentials", "true");
    return res.sendStatus(204); // No Content
  }
  next();
});

// Middlewares para processar JSON e dados de formulários
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve arquivos estáticos da pasta 'public'
app.use("/", express.static("docs"));

// Monta as rotas da API
app.use("/api", apiRoutes);

app.use((req, res, next) => {
  const isRoot = req.hostname === "automafluxo.com.br";
  const isApi = req.originalUrl.startsWith("/api");
  const isStatic = req.originalUrl.startsWith("/assets");

  // Se for uma requisição para o domínio raiz que não seja API nem arquivo estático, redireciona para o frontend
  if (isRoot && !isApi && !isStatic) {
    return res.redirect(
      301,
      `https://www.automafluxo.com.br${req.originalUrl}`
    );
  }

  next(); // Continua normalmente para os próximos middlewares ou rotas
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
