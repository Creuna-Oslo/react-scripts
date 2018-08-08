/* eslint-env node */
const chalk = require('chalk');
const prettier = require('prettier');

const ensureCanConvertToStateless = require('./utils/ensure-can-convert-to-stateless');
const getComponent = require('./utils/get-component');
const getConfigs = require('./utils/get-configs');
const readFile = require('./utils/read-file');
const toStatelessTransform = require('./transforms/to-stateless');
const writeFile = require('./utils/write-file');

module.exports = function({ basePath, eslintConfig, pathOrName }) {
  const _eslintConfig = eslintConfig;

  return new Promise((resolve, reject) => {
    const { eslintConfig, prettierConfig } = getConfigs(_eslintConfig);

    try {
      const { componentName, filePath } = getComponent({
        basePath,
        pathOrName
      });

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
      reject(error.message);
    }
  });
};
