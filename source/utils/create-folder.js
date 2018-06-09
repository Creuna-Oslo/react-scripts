/* eslint-env node */
/* eslint-disable no-console */
const chalk = require('chalk');
const fs = require('fs');
const path = require('path');

module.exports = function(folderPath) {
  return new Promise(res => {
    const relativePath = path.relative(process.cwd(), folderPath);
    fs.mkdir(folderPath, err => {
      if (err) {
        console.log(
          `👻  ${chalk.red('Error creating directory')} ${chalk.blueBright(
            relativePath
          )}`,
          err
        );

        process.exit(1);
      }

      return res();
    });
  });
};
