const fs = require("fs");
const path = require("path");

// Diretório de origem e destino
const publicDir = path.join(__dirname, "../public");
const distDir = path.join(__dirname, "../dist");

// Limpa a pasta dist (se existir)
fs.rmSync(distDir, { recursive: true, force: true });

// Copia a pasta public para dist
fs.cpSync(publicDir, distDir, { recursive: true });

// Função para processar um único arquivo
const processFile = (filePath) => {
  try {
    let content = fs.readFileSync(filePath, "utf8");
    // Substitui todas as ocorrências de process.env.VARIAVEL
    content = content.replace(/process\.env\.(\w+)/g, (match, p1) => {
      return JSON.stringify(process.env[p1] || "");
    });
    fs.writeFileSync(filePath, content, "utf8");
    console.log(`✅ Processado ${filePath}`);
  } catch (error) {
    console.error(`Erro ao processar ${filePath}:`, error);
  }
};

// Função para percorrer recursivamente um diretório e processar arquivos
const processDirectory = (dir) => {
  const files = fs.readdirSync(dir, { withFileTypes: true });
  for (const file of files) {
    const fullPath = path.join(dir, file.name);
    if (file.isDirectory()) {
      processDirectory(fullPath);
    } else {
      // Processa apenas arquivos de texto (você pode ajustar as extensões conforme necessário)
      if (/\.(js|html|css)$/.test(file.name)) {
        processFile(fullPath);
      }
    }
  }
};

// Processa todos os arquivos em dist para substituir as variáveis de ambiente
processDirectory(distDir);

console.log("✅ Build completo, todos os arquivos foram processados.");