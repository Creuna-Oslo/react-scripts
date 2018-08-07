/* eslint-env node */
const chalk = require('chalk');
const fs = require('fs');
const path = require('path');

module.exports = function(filePath, newFilename, type = 'file') {
  const fileName = path.basename(filePath);
  const newFilePath = path.join(path.dirname(filePath), newFilename);

  try {
    fs.renameSync(filePath, newFilePath);

    return {
      emoji: '💾',
      text: `${chalk.blueBright(fileName)} renamed to ${chalk.cyan(
        newFilename
      )}`
    };
  } catch (error) {
    throw new Error(
      `Error renaming ${type} ${chalk.blueBright(fileName)}\n\n${error.message}`
    );
  }
};
