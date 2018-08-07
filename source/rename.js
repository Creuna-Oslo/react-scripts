/* eslint-env node */
const chalk = require('chalk');
const fs = require('fs');
const prettier = require('prettier');
const path = require('path');

const ensureEmptyFolder = require('./utils/ensure-empty-folder');
const generateIndexFile = require('./templates/generate-index-file');
const getComponent = require('./utils/get-component');
const getConfigs = require('./utils/get-configs');
const lastSlug = require('./utils/last-slug');
const readFile = require('./utils/read-file');
const renameFile = require('./utils/rename-file');
const renameJSXTransform = require('./transforms/rename-jsx');
const writeFile = require('./utils/write-file');

module.exports = function({
  eslintConfig,
  pathOrName,
  newComponentName,
  componentsPath
}) {
  const { prettierConfig } = getConfigs(eslintConfig);

  return new Promise((resolve, reject) => {
    try {
      const { componentName, filePath, folderPath } = getComponent({
        pathOrName,
        componentsPath
      });

      const jsxFilePath = filePath;
      const indexFilename = 'index.js';
      const indexFilePath = path.join(folderPath, indexFilename);
      const scssFilename = `${componentName}.scss`;
      const scssFilePath = path.join(folderPath, scssFilename);

      const hasScssfile = fs.existsSync(path.join(folderPath, scssFilename));
      const hasIndexFile = fs.existsSync(path.join(folderPath, indexFilename));
      const shouldRenameFolder = componentName === lastSlug(folderPath);
      const shouldWriteIndex = shouldRenameFolder && hasIndexFile;

      if (shouldRenameFolder) {
        // Script should abort if new folder already exists
        const newFolderPath = path.join(
          path.dirname(folderPath),
          newComponentName
        );
        ensureEmptyFolder(newFolderPath);
      }

      const jsxFileContent = readFile(jsxFilePath);

      const newJsxFileContent = prettier.format(
        renameJSXTransform(jsxFileContent, componentName, newComponentName),
        prettierConfig
      );

      const indexFileContent = prettier.format(
        generateIndexFile(newComponentName),
        prettierConfig
      );

      const messages = [];

      messages.push(
        writeFile(jsxFilePath, newJsxFileContent),
        renameFile(jsxFilePath, `${newComponentName}.jsx`)
      );

      if (shouldWriteIndex) {
        messages.push(writeFile(indexFilePath, indexFileContent));
      }

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
