/* eslint-env node */
const assert = require('assert');
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

const emptyFileContent = {
  json: '{}',
  js: 'export default {};'
};

module.exports = function({
  componentName,
  dataFileExtension = 'json',
  eslintConfig,
  folderPath,
  humanReadableName
}) {
  return new Promise(async (resolve, reject) => {
    const { prettierConfig } = getConfigs(eslintConfig);

    try {
      assert(folderPath, 'No path provided.');
      assert(componentName, 'No page name provided.');
      assert(fs.existsSync(folderPath), `Path '${folderPath}' does not exist.`);

      const componentPath = path.join(folderPath, componentName);
      const indexFilePath = path.join(componentPath, 'index.js');
      const dataFilePath = path.join(
        componentPath,
        `${componentName}.${dataFileExtension}`
      );
      const jsxFilePath = path.join(componentPath, `${componentName}.jsx`);
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

      const dataFileContent = emptyFileContent[dataFileExtension] || '';
      const indexFileContent = prettier.format(
        generateIndexFile(componentName),
        prettierConfig
      );

      ensureEmptyFolder(componentPath);
      await fsExtra.ensureDir(componentPath);

      const messages = [
        writeFile(jsxFilePath, jsxFileContent),
        writeFile(dataFilePath, dataFileContent),
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
