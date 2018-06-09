/* eslint-env node */
/* eslint-disable no-console */
const chalk = require('chalk');
const fs = require('fs');
const prettier = require('prettier');

const ensureCanConvertToStateless = require('./utils/ensure-can-convert-to-stateless');
const getComponent = require('./utils/get-component');
const getConfigs = require('./utils/get-configs');
const toStatelessTransform = require('./transforms/to-stateless');
const writeFile = require('./utils/write-file');

module.exports = function(pathOrName) {
  getConfigs(({ eslintrc, prettierConfig, componentsPath }) => {
    getComponent(
      { componentsPath, pathOrName },
      ({ componentName, filePath }) => {
        convertToStateless({
          componentName,
          eslintrc,
          filePath,
          prettierConfig
        });
      }
    );
  });

  function convertToStateless({
    componentName,
    eslintrc,
    filePath,
    prettierConfig
  }) {
    const fileContent = fs.readFileSync(filePath, { encoding: 'utf-8' });

    ensureCanConvertToStateless(fileContent, eslintrc);

    const newFileContent = prettier.format(
      toStatelessTransform(fileContent, componentName),
      prettierConfig
    );

    writeFile(
      filePath,
      newFileContent,
      `🤖  ${chalk.green(`Beep boop, I'm done!`)}`
    );
  }
};
