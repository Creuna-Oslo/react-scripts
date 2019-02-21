/* eslint-env node */
const assert = require('assert');
const chalk = require('chalk');
const fsExtra = require('fs-extra');
const path = require('path');

const ensureEmptyFolder = require('./utils/ensure-empty-folder');
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
    try {
      assert(folderPath, 'No path provided');
      assert(componentName, 'No component name provided.');

      const componentPath = path.join(folderPath, componentName);
      const jsxFilePath = path.join(componentPath, `${componentName}.jsx`);
      const scssFilePath = path.join(componentPath, `${componentName}.scss`);

      const templates = {
        stateful: path.join(__dirname, './templates/stateful-component.jsx'),
        stateless: path.join(__dirname, './templates/stateless-component.jsx')
      };

      ensureEmptyFolder(componentPath);
      await fsExtra.ensureDir(componentPath);

      const jsxFileContent = readFile(
        shouldBeStateful ? templates.stateful : templates.stateless
      );

      // Hard coded string name because that's what the template components are called
      const newJsxFileContent = renameTransform(
        jsxFileContent,
        'component',
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
