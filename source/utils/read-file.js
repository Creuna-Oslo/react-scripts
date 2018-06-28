/* eslint-env node */
const chalk = require('chalk');
const fs = require('fs');
const path = require('path');

module.exports = function(filePath) {
  const slugs = filePath.split(path.sep);
  const fileName = slugs.slice(-1)[0];

  try {
    return fs.readFileSync(filePath, 'utf-8');
  } catch (error) {
    throw new Error(
      `Error reading ${chalk.blueBright(fileName)}\n\n${error.message}`
    );
  }
};
