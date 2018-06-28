/* eslint-env node */
const chalk = require('chalk');
const fs = require('fs');
const path = require('path');

module.exports = function(filePath, fileContent) {
  const slugs = filePath.split(path.sep);
  const fileName = slugs.slice(-1)[0];

  try {
    fs.writeFileSync(filePath, fileContent);
    return {
      emoji: '💾',
      text: `${chalk.blueBright(fileName)} saved`
    };
  } catch (error) {
    throw new Error(
      `Error writing ${chalk.blueBright(fileName)}\n\n${error.message}`
    );
  }
};
