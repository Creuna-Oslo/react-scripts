/* eslint-env node */
/* eslint-disable no-console */
const chalk = require('chalk');
const fs = require('fs');

module.exports = function(folderPath, componentName) {
  if (!fs.existsSync(folderPath)) {
    console.log(
      `👻  Couldn't find component ${chalk.redBright(componentName)}.`
    );

    process.exit(1);
  }

  return true;
};
