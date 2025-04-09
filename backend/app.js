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

const app = express();
app.set("trust proxy", true);

// Redireciona acessos ao domínio raiz para o frontend em www, exceto chamadas de API ou arquivos estáticos
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

// Middlewares para processar JSON e dados de formulários
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const allowedOrigins = [
  "https://www.automafluxo.com.br",
  "http://localhost:3000",
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS"));
    },
    methods: ["GET", "POST", "OPTIONS"],
    credentials: true,
  })
);

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("✅ Connected to MongoDB with Mongoose"))
  .catch((err) => console.error("❌ Mongoose connection error:", err));

// Serve arquivos estáticos da pasta 'public'
app.use("/", express.static("docs"));

// Monta as rotas da API
app.use("/api", apiRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
