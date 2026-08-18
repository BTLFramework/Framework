const fs = require("fs");
const path = require("path");

for (const directory of ["routes", "services"]) {
  const sourceDir = path.join(__dirname, "..", "src", directory);
  const outputDir = path.join(__dirname, "..", "dist", directory);
  fs.mkdirSync(outputDir, { recursive: true });

  for (const file of fs.readdirSync(sourceDir)) {
    if (!file.endsWith(".js")) continue;

    const typescriptSource = path.join(sourceDir, file.replace(/\.js$/, ".ts"));
    if (fs.existsSync(typescriptSource)) {
      console.log(`Keeping compiled ${directory}/${file}; matching TypeScript source exists`);
      continue;
    }

    fs.copyFileSync(path.join(sourceDir, file), path.join(outputDir, file));
    console.log(`Copied JavaScript-only ${directory}/${file}`);
  }
}
