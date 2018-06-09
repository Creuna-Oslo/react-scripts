/* eslint-env node */
/* eslint-disable no-console */
const chalk = require('chalk');
const fs = require('fs');
const path = require('path');

module.exports = function(folderPath, fileName, fileContent) {
  return new Promise(res => {
    fs.writeFile(path.join(folderPath, fileName), fileContent, {}, err => {
      if (err) {
        console.log(
          `👻  ${chalk.red('Error writing')} ${chalk.blueBright(fileName)}`,
          err
        );

        process.exit(1);
      }

      console.log(`💾  ${chalk.blueBright(fileName)} saved`);

      return res();
    });
  });
};
