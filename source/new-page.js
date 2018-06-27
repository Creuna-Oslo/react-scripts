/* eslint-env node */
/* eslint-disable no-console */
const chalk = require('chalk');
const fs = require('fs');
const fsExtra = require('fs-extra');
const kebabToPascal = require('@creuna/utils/kebab-to-pascal').default;
const path = require('path');
const prettier = require('prettier');

const ensureEmptyFolder = require('./utils/ensure-empty-folder');
const generateIndexFile = require('./templates/generate-index-file');
const getConfigs = require('./utils/get-configs');
const renameImportTransform = require('./transforms/rename-import-json');
const renameJSXTransform = require('./transforms/rename-jsx');
const writeFile = require('./utils/write-file');

module.exports = function({
  componentName,
  eslintConfig,
  humanReadableName,
  mockupPath
}) {
  return new Promise(async (resolve, reject) => {
    if (!mockupPath) {
      return reject('No mockup component path provided.');
    }

    if (!componentName) {
      return reject('No page name provided.');
    }

    const { prettierConfig } = getConfigs(eslintConfig);

    const folderPath = path.join(mockupPath, componentName);
    const indexFilePath = path.join(folderPath, 'index.js');
    const jsonFilePath = path.join(folderPath, `${componentName}.json`);
    const jsxFilePath = path.join(folderPath, `${componentName}.jsx`);
    const pascalComponentName = kebabToPascal(componentName);

    const templateContent = fs.readFileSync(
      path.join(__dirname, 'templates/mockup-page.jsx'),
      { encoding: 'utf-8' }
    );

    const renamedSource = renameJSXTransform(
      templateContent,
      'component',
      componentName
    );

    const sourceWithRenamedImport = renameImportTransform(
      renamedSource,
      componentName
    );

    const jsxFileContent = prettier.format(
      `// ${humanReadableName || pascalComponentName}\n` +
        sourceWithRenamedImport,
      prettierConfig
    );

    const indexFileContent = prettier.format(
      generateIndexFile(componentName),
      prettierConfig
    );

    try {
      await ensureEmptyFolder(folderPath);
      await fsExtra.ensureDir(folderPath);

      const messages = [
        writeFile(jsxFilePath, jsxFileContent),
        writeFile(jsonFilePath, '{}'),
        writeFile(indexFilePath, indexFileContent)
      ];

      resolve({
        messages: messages.concat({
          emoji: '🎉',
          text: `Created page ${chalk.greenBright(componentName)}`
        })
      });
    } catch (error) {
      reject(error.message);
    }
  });
};
