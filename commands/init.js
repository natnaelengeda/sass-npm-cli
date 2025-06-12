const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");
const readline = require("readline");
const fsExtra = require("fs-extra");
const { copySync } = fsExtra;

// ✅ Recreate __dirname — already exists in CommonJS, so no need for import.meta.url
// const __dirname = __dirname; // Just here for clarity — already built-in

// ✅ Read package.json using regular path logic
const pkg = JSON.parse(
  fs.readFileSync(path.join(__dirname, "..", "package.json"), "utf8")
);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function askQuestion(query) {
  return new Promise((resolve) => rl.question(query, resolve));
}

module.exports = async () => {
  console.log("🚀 Initializing SASS dashboard template...");

  const projectName = await askQuestion("Enter your project name: ");
  const projectNameTrimmed = projectName.replace(/\s+/g, "").trim();
  const targetDir = path.resolve(process.cwd(), projectNameTrimmed);


  if (fs.existsSync(targetDir)) {
    console.log("❌ Directory already exists. Please choose another name.");
    process.exit(1);
  }

  console.log("🛠 Creating your project...");
  copySync(path.join(__dirname, "../template"), targetDir);

  console.log("\n✅ Done! Your dashboard is ready. Now run:\n");
  console.log(`   cd ${projectNameTrimmed}`);
  console.log("   npm install");
  console.log("   npm run dev");

  rl.close();
};
