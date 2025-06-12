const inquirer = require('inquirer');
const fs = require('fs');
const path = require('path');

module.exports = async () => {
  const { pageName } = await inquirer.prompt([
    {
      type: 'input',
      name: 'pageName',
      message: 'Enter the new page name:',
      validate: (input) => input ? true : 'Page name cannot be empty',
    },
  ]);

  const pageDir = path.join(process.cwd(), 'src/pages', pageName);

  if (!fs.existsSync(pageDir)) {
    fs.mkdirSync(pageDir, { recursive: true });
    fs.writeFileSync(path.join(pageDir, `${pageName}.jsx`), `export default function ${pageName}() { return <div>${pageName} page</div>; }`);
    console.log(`✅ Page "${pageName}" created at ${pageDir}`);
  } else {
    console.log(`❌ Page "${pageName}" already exists.`);
  }
};