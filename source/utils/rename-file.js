/* eslint-env node */
const chalk = require('chalk');
const fs = require('fs');
const path = require('path');

const removeLastSlug = require('./remove-last-slug');

module.exports = function(filePath, newFilename, type = 'file') {
  const slugs = filePath.split(path.sep);
  const fileName = slugs.slice(-1)[0];
  const newFilePath = path.join(removeLastSlug(filePath), newFilename);

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
