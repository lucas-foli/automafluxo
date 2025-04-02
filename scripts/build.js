const fs = require("fs");
const path = require("path");

// Load env vars
require("@dotenvx/dotenvx").config();

const templatePath = path.join(__dirname, "../public/fb-login.js");
const outputPath = path.join(__dirname, "../dist/fb-login.js");

// Read template file with placeholders
let content = fs.readFileSync(templatePath, "utf8");

// Replace placeholders
content = content
  .replace(/__INSTAGRAM_CLIENT_ID__/g, process.env.INSTAGRAM_CLIENT_ID)
  .replace(/__INSTAGRAM_CLIENT_SECRET__/g, process.env.INSTAGRAM_CLIENT_SECRET)
  .replace(/__INSTAGRAM_REDIRECT_URI__/g, process.env.INSTAGRAM_REDIRECT_URI)
  .replace(/__MONGODB_URI__/g, process.env.MONGODB_URI);

// Ensure output dir exists
fs.mkdirSync(path.join(__dirname, "../dist"), { recursive: true });

// Write result
fs.writeFileSync(outputPath, content);

console.log("✅ fb-login.js built with env variables");
