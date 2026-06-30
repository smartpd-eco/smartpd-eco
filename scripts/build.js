const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const dist = path.join(root, "dist");

const files = [
  ["public/index.html", "index.html"],
  ["public/dashboard.html", "dashboard.html"],
  ["public/docs.html", "docs.html"],
  ["src/main.js", "main.js"],
  ["src/style.css", "style.css"],
];

fs.mkdirSync(dist, { recursive: true });

for (const [source, target] of files) {
  fs.copyFileSync(path.join(root, source), path.join(dist, target));
}
