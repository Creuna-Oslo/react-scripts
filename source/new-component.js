/* eslint-env node */
const assert = require('assert');
const chalk = require('chalk');
const fsExtra = require('fs-extra');
const path = require('path');
const prettier = require('prettier');

const ensureEmptyFolder = require('./utils/ensure-empty-folder');
const generateIndexFile = require('./templates/generate-index-file');
const getConfigs = require('./utils/get-configs');
const readFile = require('./utils/read-file');
const renameTransform = require('./transforms/rename-jsx');
const writeFile = require('./utils/write-file');

module.exports = function({
  componentName,
  eslintConfig,
  folderPath,
  shouldBeStateful
}) {
  return new Promise(async (resolve, reject) => {
    const { prettierConfig } = getConfigs(eslintConfig);

    try {
      assert(folderPath, 'No path provided');
      assert(componentName, 'No component name provided.');

      const componentPath = path.join(folderPath, componentName);
      const indexFilePath = path.join(componentPath, 'index.js');
      const jsxFilePath = path.join(componentPath, `${componentName}.jsx`);
      const scssFilePath = path.join(componentPath, `${componentName}.scss`);

      const templates = {
        stateful: path.join(__dirname, './templates/stateful-component.jsx'),
        stateless: path.join(__dirname, './templates/stateless-component.jsx')
      };

      const indexFileContent = prettier.format(
        generateIndexFile(componentName),
        prettierConfig
      );

      ensureEmptyFolder(componentPath);
      await fsExtra.ensureDir(componentPath);

      const jsxFileContent = readFile(
        shouldBeStateful ? templates.stateful : templates.stateless
      );

      // Hard coded string name because that's what the template components are called
      const newJsxFileContent = prettier.format(
        renameTransform(jsxFileContent, 'component', componentName),
        prettierConfig
      );

      const messages = [
        writeFile(jsxFilePath, newJsxFileContent),
        writeFile(scssFilePath, `.${componentName} {}`),
        writeFile(indexFilePath, indexFileContent)
      ];

      resolve({
        messages: messages.concat({
          emoji: '🎉',
          text: `Created ${
            shouldBeStateful ? 'stateful' : 'stateless'
          } component ${chalk.greenBright(componentName)}`
        })
      });
    } catch (error) {
      reject(error.message);
    }
  });
};
