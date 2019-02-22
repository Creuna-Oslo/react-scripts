/* eslint-env node */
const assert = require('assert');
const chalk = require('chalk');
const fs = require('fs');
const fsExtra = require('fs-extra');
const path = require('path');
const prettier = require('prettier');

const ensureEmptyFolder = require('./utils/ensure-empty-folder');
const getConfigs = require('./utils/get-configs');
const renameDataImport = require('./transforms/rename-data-import');
const renameJSX = require('./transforms/rename-jsx');
const writeFile = require('./utils/write-file');

const dataFileTemplates = {
  json: '{}',
  js: 'export default {};'
};

module.exports = function({
  componentName,
  dataFileExtension = 'json',
  dataFileContent,
  eslintConfig,
  folderPath,
  groupName,
  humanReadableName,
  url
}) {
  return new Promise(async (resolve, reject) => {
    const { prettierConfig } = getConfigs(eslintConfig);

    try {
      assert(folderPath, 'No path provided.');
      assert(componentName, 'No page name provided.');
      assert(fs.existsSync(folderPath), `Path '${folderPath}' does not exist.`);

      const componentPath = path.join(folderPath, componentName);
      const dataFilePath = path.join(
        componentPath,
        `${componentName}.${dataFileExtension}`
      );
      const jsxFilePath = path.join(componentPath, `${componentName}.jsx`);

      const templateContent = fs.readFileSync(
        path.join(__dirname, 'templates/static-site-page.jsx'),
        { encoding: 'utf-8' }
      );

      const renamedSource = renameJSX(
        templateContent,
        'component',
        componentName
      );

      const sourceWithRenamedImport = renameDataImport(
        renamedSource,
        componentName,
        dataFileExtension
      );

      const frontmatter =
        `/*\n` +
        (groupName ? `group: ${groupName}\n` : '') +
        (humanReadableName ? `name: ${humanReadableName}\n` : '') +
        (url ? `path: ${url}\n` : '') +
        `*/\n\n`;

      const jsxFileContent = prettier.format(
        frontmatter + sourceWithRenamedImport,
        prettierConfig
      );

      const staticDataFileContent =
        dataFileContent || dataFileTemplates[dataFileExtension] || '';

      ensureEmptyFolder(componentPath);
      await fsExtra.ensureDir(componentPath);

      const messages = [
        writeFile(jsxFilePath, jsxFileContent),
        writeFile(dataFilePath, staticDataFileContent)
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
