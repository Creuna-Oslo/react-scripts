/* eslint-env node */
/* eslint-disable no-console */
const chalk = require('chalk');
const fs = require('fs');
const prettier = require('prettier');
const path = require('path');

const ensureCanConvertToStateless = require('./utils/ensure-can-convert-to-stateless');
const ensureComponentExists = require('./utils/ensure-component-exists');
const getConfigs = require('./utils/get-configs');
const prompt = require('./utils/prompt');
const toStatelessTransform = require('./transforms/to-stateless');

module.exports = function(componentName) {
  getConfigs(({ eslintrc, prettierConfig, componentsPath }) => {
    prompt(
      {
        componentName: {
          text: 'Name of component',
          value: componentName
        }
      },
      ({ componentName }) => {
        convertToStateless({
          componentName,
          componentsPath,
          eslintrc,
          prettierConfig
        });
      }
    );
  });

  function convertToStateless({
    componentName,
    componentsPath,
    eslintrc,
    prettierConfig
  }) {
    const fileName = `${componentName}.jsx`;
    const folderPath = path.join(componentsPath, componentName);
    const filePath = path.join(folderPath, fileName);

    ensureComponentExists(folderPath, componentName);

    const fileContent = fs.readFileSync(filePath, { encoding: 'utf-8' });

    ensureCanConvertToStateless(fileContent, eslintrc);

    const newFileContent = toStatelessTransform(fileContent, componentName);

    fs.writeFile(
      filePath,
      prettier.format(newFileContent, prettierConfig),
      {},
      err => {
        if (err) {
          console.log(
            `👻  ${chalk.red('Error writing')} ${chalk.blueBright(
              `${componentName}.jsx`
            )}`,
            err
          );

          process.exit(1);
        }

        console.log(`🤖  ${chalk.green(`Beep boop, I'm done!`)}`);
      }
    );
  }
};
