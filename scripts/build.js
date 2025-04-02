const fs = require("fs");
const path = require("path");

// Load env vars
require("@dotenvx/dotenvx").config();

fs.rmSync('dist', { recursive: true, force: true });

fs.cpSync('public', 'dist', { recursive: true });

// Ensure output dir exists
fs.mkdirSync(path.join(__dirname, "../dist"), { recursive: true });

console.log("✅ fb-login.js built with env variables");
