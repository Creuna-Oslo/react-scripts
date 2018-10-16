/* eslint-env node */
const chalk = require('chalk');
const path = require('path');
const prettier = require('prettier');

const ensureCanConvertToStateless = require('./utils/ensure-can-convert-to-stateless');
const getConfigs = require('./utils/get-configs');
const readFile = require('./utils/read-file');
const toStatelessTransform = require('./transforms/to-stateless');
const validateFilePath = require('./utils/validate-file-path');
const writeFile = require('./utils/write-file');

module.exports = function({ eslintConfig, filePath }) {
  const _eslintConfig = eslintConfig;

  return new Promise((resolve, reject) => {
    const { eslintConfig, prettierConfig } = getConfigs(_eslintConfig);

    try {
      validateFilePath(filePath);

      const componentName = path.basename(filePath, '.jsx');
      const fileContent = readFile(filePath);

      ensureCanConvertToStateless(fileContent, eslintConfig);

      const newFileContent = prettier.format(
        toStatelessTransform(fileContent, componentName),
        prettierConfig
      );

      writeFile(filePath, newFileContent);

      resolve({
        messages: [
          { emoji: `🤖`, text: `${chalk.green(`Beep boop, I'm done!`)}` }
        ]
      });
    } catch (error) {
      reject(error.message + `\n\n${error.stack || ''}`);
    }
  });
};
