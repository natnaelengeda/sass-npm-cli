#!/usr/bin/env node

import { execSync } from "child_process"
import fs from "fs"
import path from "path"
import readline from "readline"
// import chalk from "chalk"
import fsExtra from "fs-extra" // ✅ this line
import https from "https"
import { fileURLToPath } from "url"
import { dirname } from "path"

const { copySync } = fsExtra

// ⛓️ Recreate __dirname in ESM
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// 📦 Read your package.json
const pkg = JSON.parse(
  fs.readFileSync(new URL("./package.json", import.meta.url))
)

function checkForUpdate() {
  const packageName = pkg.name
  const currentVersion = pkg.version

  https
    .get(`https://registry.npmjs.org/${packageName}/latest`, res => {
      let rawData = ""
      res.on("data", chunk => {
        rawData += chunk
      })
      res.on("end", () => {
        try {
          const latest = JSON.parse(rawData).version
          if (latest !== currentVersion) {
            console.log(`\n⚠️  Update available: ${currentVersion} → ${latest}`)
            console.log(`👉 Run: npm create ${packageName}@latest\n`)
          }
        } catch (e) {
          // silent fail
        }
      })
    })
    .on("error", () => {
      // silent fail
    })
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

function askQuestion(query) {
  return new Promise(resolve => rl.question(query, resolve))
}

async function main() {
  // checkForUpdate()

  console.log("🚀 Welcome to Reactjs Dashboard CLI!")

  const projectName = await askQuestion("Enter your project name: ")
  const targetDir = path.resolve(process.cwd(), projectName.trim())

  if (fs.existsSync(targetDir)) {
    console.log("❌ Directory already exists. Please choose another name.")
    process.exit(1)
  }

  console.log("🛠 Creating your project...")
  copySync(path.join(__dirname, "template"), targetDir)

  console.log("📦 Installing dependencies...")
  execSync(`cd ${projectName} && npm install`, { stdio: "inherit" })

  console.log("✅ Done! Your dashboard is ready.")
  rl.close()
}

main()
