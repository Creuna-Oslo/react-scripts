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

    try {
      await ensureEmptyFolder(folderPath);
      await fsExtra.ensureDir(folderPath);

      const jsxFileContent = await readFile(
        shouldBeStateful ? templates.stateful : templates.stateless
      );

      // Hard coded string name because that's what the template components are called
      const newJsxFileContent = prettier.format(
        renameTransform(jsxFileContent, 'component', componentName),
        prettierConfig
      );

      const messages = await Promise.all([
        writeFile(jsxFilePath, newJsxFileContent),
        writeFile(scssFilePath, `.${componentName} {}`),
        writeFile(indexFilePath, indexFileContent)
      ]);

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
