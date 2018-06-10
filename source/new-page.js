/* eslint-env node */
/* eslint-disable no-console */
const chalk = require('chalk');
const fs = require('fs');
const fsExtra = require('fs-extra');
const kebabToPascal = require('@creuna/utils/kebab-to-pascal').default;
const path = require('path');
const prettier = require('prettier');

const createFolder = require('./utils/create-folder');
const ensureEmptyFolder = require('./utils/ensure-empty-folder');
const generateIndexFile = require('./templates/generate-index-file');
const getConfigs = require('./utils/get-configs');
const prompt = require('./utils/prompt');
const renameJSXTransform = require('./transforms/rename-jsx');
const writeFile = require('./utils/write-file');

module.exports = async function(maybeComponentName, maybeHumanReadableName) {
  const { prettierConfig, mockupPath } = await getConfigs();
  const { componentName, humanReadableName } = await prompt({
    componentName: { text: 'Name of page', value: maybeComponentName },
    humanReadableName: {
      optional: true,
      text: 'Human readable name (optional)',
      value: maybeHumanReadableName
    }
  });

  const folderPath = path.join(mockupPath, componentName);
  const indexFilePath = path.join(folderPath, 'index.js');
  const jsonFilePath = path.join(folderPath, `${componentName}.json`);
  const jsxFilePath = path.join(folderPath, `${componentName}.jsx`);
  const pascalComponentName = kebabToPascal(componentName);

  fsExtra.ensureDirSync(mockupPath);
  ensureEmptyFolder(folderPath);

  console.log(`⚙️  Generating ${chalk.blueBright(componentName)}`);

  const templateContent = fs.readFileSync(
    path.join(__dirname, 'templates/mockup-page.jsx'),
    { encoding: 'utf-8' }
  );

  const jsxFileContent = prettier.format(
    `// ${humanReadableName || pascalComponentName}\n` +
      renameJSXTransform(templateContent, 'Component', componentName),
    prettierConfig
  );

  const indexFileContent = prettier.format(
    generateIndexFile(componentName),
    prettierConfig
  );

  createFolder(folderPath)
    .then(() => writeFile(jsxFilePath, jsxFileContent))
    .then(() => writeFile(jsonFilePath, '{}'))
    .then(() => writeFile(indexFilePath, indexFileContent));
};
