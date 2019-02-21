/* eslint-env node */
const assert = require('assert');
const chalk = require('chalk');
const fs = require('fs');
const path = require('path');

const ensureEmptyFolder = require('./utils/ensure-empty-folder');
const readFile = require('./utils/read-file');
const renameFile = require('./utils/rename-file');
const renameJSXTransform = require('./transforms/rename-jsx');
const validateFilePath = require('./utils/validate-file-path');
const writeFile = require('./utils/write-file');

module.exports = function({ eslintConfig, filePath, newComponentName }) {
  return new Promise((resolve, reject) => {
    try {
      assert(newComponentName, 'No new component name provided.');
      validateFilePath(filePath);

      const componentName = path.basename(filePath, '.jsx');
      const folderPath = path.dirname(filePath);
      const jsxFilePath = filePath;
      const scssFilename = `${componentName}.scss`;
      const scssFilePath = path.join(folderPath, scssFilename);

      const hasScssfile = fs.existsSync(path.join(folderPath, scssFilename));
      const shouldRenameFolder = componentName === path.basename(folderPath);

      if (shouldRenameFolder) {
        // Script should abort if new folder already exists
        const newFolderPath = path.join(
          path.dirname(folderPath),
          newComponentName
        );
        ensureEmptyFolder(newFolderPath);
      }

      const jsxFileContent = readFile(jsxFilePath);

      const newJsxFileContent = renameJSXTransform(
        jsxFileContent,
        componentName,
        newComponentName,
        eslintConfig
      );

      const messages = [];

      messages.push(
        writeFile(jsxFilePath, newJsxFileContent),
        renameFile(jsxFilePath, `${newComponentName}.jsx`)
      );

      if (hasScssfile) {
        const scssFileContent = readFile(scssFilePath);
        const newScssFileContent = scssFileContent.replace(
          new RegExp(`\\.${componentName}( |-)`, 'g'),
          `.${newComponentName}$1`
        );
        messages.push(
          writeFile(scssFilePath, newScssFileContent),
          renameFile(scssFilePath, `${newComponentName}.scss`)
        );
      }

      if (shouldRenameFolder) {
        messages.push(renameFile(folderPath, newComponentName, 'folder'));
      }

      resolve({
        messages: messages.concat({
          emoji: '🤖',
          text: `${chalk.green(`Beep boop, I'm done!`)}`
        })
      });
    } catch (error) {
      reject(error.message);
    }
  });
};
