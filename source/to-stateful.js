/* eslint-env node */
const chalk = require('chalk');
const path = require('path');

const readFile = require('./utils/read-file');
const toStatefulTransform = require('./transforms/to-stateful');
const validateFilePath = require('./utils/validate-file-path');
const writeFile = require('./utils/write-file');

module.exports = function({ eslintConfig, filePath }) {
  return new Promise((resolve, reject) => {
    try {
      validateFilePath(filePath);

      const componentName = path.basename(filePath, '.jsx');
      const fileContent = readFile(filePath);

      const newFileContent = toStatefulTransform(
        fileContent,
        componentName,
        eslintConfig
      );

      writeFile(filePath, newFileContent);

      resolve({
        messages: [
          { emoji: '🤖', text: `${chalk.green(`Beep boop, I'm done!`)}` }
        ]
      });
    } catch (error) {
      reject(error.message);
    }
  });
};
