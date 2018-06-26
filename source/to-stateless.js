/* eslint-env node */
/* eslint-disable no-console */
const chalk = require('chalk');
const prettier = require('prettier');

const ensureCanConvertToStateless = require('./utils/ensure-can-convert-to-stateless');
const getComponent = require('./utils/get-component');
const getConfigs = require('./utils/get-configs');
const readFile = require('./utils/read-file');
const toStatelessTransform = require('./transforms/to-stateless');
const writeFile = require('./utils/write-file');

module.exports = async function({ eslintConfig, pathOrName, componentsPath }) {
  const _eslintConfig = eslintConfig;

  return new Promise(async (resolve, reject) => {
    const { eslintConfig, prettierConfig } = getConfigs(_eslintConfig);

    try {
      const { componentName, filePath } = getComponent({
        componentsPath,
        pathOrName
      });

      const fileContent = readFile(filePath);

      ensureCanConvertToStateless(fileContent, eslintConfig);

      const newFileContent = prettier.format(
        toStatelessTransform(fileContent, componentName),
        prettierConfig
      );

      await writeFile(filePath, newFileContent);

      resolve([
        { emoji: `🤖`, text: `${chalk.green(`Beep boop, I'm done!`)}` }
      ]);
    } catch (error) {
      reject(error.message);
    }
  });
};
