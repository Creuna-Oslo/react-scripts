/* eslint-env node */
/* eslint-disable no-console */
const chalk = require('chalk');
const fsExtra = require('fs-extra');
const path = require('path');
const prettier = require('prettier');

const ensureEmptyFolder = require('./utils/ensure-empty-folder');
const generateIndexFile = require('./templates/generate-index-file');
const getConfigs = require('./utils/get-configs');
const lastSlug = require('./utils/last-slug');
const readFile = require('./utils/read-file');
const renameTransform = require('./transforms/rename-jsx');
const writeFile = require('./utils/write-file');

module.exports = function({
  componentsPath,
  eslintConfig,
  pathOrName,
  shouldBeStateful
}) {
  return new Promise(async (resolve, reject) => {
    const { prettierConfig } = getConfigs(eslintConfig);

    const isPath = pathOrName.indexOf(path.sep) !== -1;
    const componentName = isPath ? lastSlug(pathOrName) : pathOrName;
    const folderPath = path.join(componentsPath, pathOrName);
    const indexFilePath = path.join(folderPath, 'index.js');
    const jsxFilePath = path.join(folderPath, `${componentName}.jsx`);
    const scssFilePath = path.join(folderPath, `${componentName}.scss`);

    const templates = {
      stateful: path.join(__dirname, './templates/stateful-component.jsx'),
      stateless: path.join(__dirname, './templates/stateless-component.jsx')
    };

    const indexFileContent = prettier.format(
      generateIndexFile(componentName),
      prettierConfig
    );

    fsExtra
      .ensureDir(folderPath)
      .then(() => ensureEmptyFolder(folderPath))
      .then(() =>
        readFile(shouldBeStateful ? templates.stateful : templates.stateless)
      )
      .then(jsxFileContent =>
        // Hard coded string name because that's what the template components are called
        prettier.format(
          renameTransform(jsxFileContent, 'component', componentName),
          prettierConfig
        )
      )
      .then(newJsxFileContent =>
        Promise.all([
          writeFile(jsxFilePath, newJsxFileContent),
          writeFile(scssFilePath, `.${componentName} {}`),
          writeFile(indexFilePath, indexFileContent)
        ])
      )
      .then(messages => {
        resolve({
          messages: messages.concat({
            emoji: '⚙️',
            text: `Created ${
              shouldBeStateful ? 'stateful' : 'stateless'
            } ${chalk.blueBright(componentName)}`
          })
        });
      })
      .catch(error => {
        reject(error.message);
      });
  });
};
