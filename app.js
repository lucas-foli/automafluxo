import dotenv from "dotenv";
dotenv.config();

import cors from "cors";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";

import apiRoutes from "./routes/index.js";
import mongoose from "mongoose";

const app = express();
app.set('trust proxy', true);

// Redireciona acessos ao domínio raiz para o frontend em www, exceto chamadas de API ou arquivos estáticos
app.use((req, res, next) => {
  const isRoot = req.hostname === "automafluxo.com.br";
  const isApi = req.originalUrl.startsWith('/api');
  const isStatic = req.originalUrl.startsWith('/assets') || req.originalUrl.startsWith('/public');

  // Se for uma requisição para o domínio raiz que não seja API nem arquivo estático, redireciona para o frontend
  if (isRoot && !isApi && !isStatic) {
    return res.redirect(301, `https://www.automafluxo.com.br${req.originalUrl}`);
  }

  next(); // Continua normalmente para os próximos middlewares ou rotas
});

const __filename = fileURLToPath(import.meta.url);
// This gives you the directory of the current file
const __dirname = path.dirname(__filename);

// Middlewares para processar JSON e dados de formulários
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: "http://localhost:3000" }));

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("✅ Connected to MongoDB with Mongoose"))
  .catch((err) => console.error("❌ Mongoose connection error:", err));

// Serve arquivos estáticos da pasta 'public'
app.use(express.static("public"));
app.use("/assets", express.static("assets"));

// Monta as rotas da API
app.use("/api", apiRoutes);

// Rota para servir a página principal
app.get("/", (_req, res) => {
  res.send(path.join(__dirname, "index.html"));
});

app.get("/politica", (_req, res) => {
  res.sendFile(path.join(__dirname, "/public/politica.html"));
});

app.get("/termos", (_req, res) => {
  res.sendFile(path.join(__dirname, "/public/termos.html"));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
