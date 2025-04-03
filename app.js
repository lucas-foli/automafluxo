import dotenv from "dotenv";
dotenv.config();

import cors from "cors";
import express from "express";
import path from "path";

import { MongoClient, ServerApiVersion } from "mongodb";
const uri = process.env.MONGODB_URI;

import apiRoutes from "./routes/index.js";

const app = express();

// Middlewares para processar JSON e dados de formulários
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: "http://localhost:3000" }));

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    console.log("Connecting to MongoDB...");
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}

run().catch(console.dir);

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
