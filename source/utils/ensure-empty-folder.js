/* eslint-env node */
/* eslint-disable no-console */
const chalk = require('chalk');
const fs = require('fs');

module.exports = function(folderPath, folderName) {
  if (fs.existsSync(folderPath)) {
    console.log(`👻  Folder ${chalk.redBright(folderName)} already exists.`);

    process.exit(1);
  }

  return true;
};
