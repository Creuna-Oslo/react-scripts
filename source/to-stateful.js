/* eslint-env node */
/* eslint-disable no-console */
const chalk = require('chalk');
const fs = require('fs');
const prettier = require('prettier');

const getComponent = require('./utils/get-component');
const getConfigs = require('./utils/get-configs');
const toStatefulTransform = require('./transforms/to-stateful');
const writeFile = require('./utils/write-file');

module.exports = function(pathOrName) {
  getConfigs(({ eslintrc, prettierConfig, componentsPath }) => {
    getComponent(
      { componentsPath, pathOrName },
      ({ componentName, filePath }) => {
        convertToStateful({
          componentName,
          eslintrc,
          filePath,
          prettierConfig
        });
      }
    );
  });

  function convertToStateful({ componentName, filePath, prettierConfig }) {
    const fileContent = fs.readFileSync(filePath, { encoding: 'utf-8' });

    const newFileContent = prettier.format(
      toStatefulTransform(fileContent, componentName),
      prettierConfig
    );

    writeFile(
      filePath,
      newFileContent,
      `🤖  ${chalk.green(`Beep boop, I'm done!`)}`
    );
  }
};
