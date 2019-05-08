/* eslint-env node */
const assert = require('assert');
const chalk = require('chalk');
const fsExtra = require('fs-extra');
const path = require('path');

const ensureEmptyFolder = require('./utils/ensure-empty-folder');
const readFile = require('./utils/read-file');
const renameTransform = require('./transforms/rename-jsx');
const writeFile = require('./utils/write-file');

module.exports = function({ componentName, eslintConfig, folderPath }) {
  return new Promise(async (resolve, reject) => {
    try {
      assert(folderPath, 'No path provided');
      assert(componentName, 'No component name provided.');

      const componentPath = path.join(folderPath, componentName);
      const jsxFilePath = path.join(componentPath, `${componentName}.jsx`);
      const scssFilePath = path.join(componentPath, `${componentName}.scss`);

      ensureEmptyFolder(componentPath);
      await fsExtra.ensureDir(componentPath);

      const jsxFileContent = readFile(
        path.join(__dirname, './templates/component.jsx')
      );

      const newJsxFileContent = renameTransform(
        jsxFileContent,
        'component', // NOTE: This is the name of the template component
        componentName,
        eslintConfig
      );

      const messages = [
        writeFile(jsxFilePath, newJsxFileContent),
        writeFile(scssFilePath, `.${componentName} {}`)
      ];

      resolve({
        messages: messages.concat({
          emoji: '🎉',
          text: `Created component ${chalk.greenBright(componentName)}`
        })
      });
    } catch (error) {
      reject(error.message);
    }
  });
};
