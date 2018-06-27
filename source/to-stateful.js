/* eslint-env node */
/* eslint-disable no-console */
const chalk = require('chalk');
const prettier = require('prettier');

const getComponent = require('./utils/get-component');
const getConfigs = require('./utils/get-configs');
const readFile = require('./utils/read-file');
const toStatefulTransform = require('./transforms/to-stateful');
const writeFile = require('./utils/write-file');

module.exports = function({ componentsPath, eslintConfig, pathOrName }) {
  return new Promise(async (resolve, reject) => {
    const { prettierConfig } = getConfigs(eslintConfig);

    try {
      const { componentName, filePath } = getComponent({
        componentsPath,
        pathOrName
      });

      const fileContent = readFile(filePath);

      const newFileContent = prettier.format(
        toStatefulTransform(fileContent, componentName),
        prettierConfig
      );

      writeFile(filePath, newFileContent);

      resolve([
        { emoji: '🤖', text: `${chalk.green(`Beep boop, I'm done!`)}` }
      ]);
    } catch (error) {
      reject(error.message);
    }
  });
};
