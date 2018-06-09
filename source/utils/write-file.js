/* eslint-env node */
/* eslint-disable no-console */
const chalk = require('chalk');
const fs = require('fs');
const path = require('path');

module.exports = function(filePath, fileContent) {
  const slugs = filePath.split(path.sep);
  const fileName = slugs.slice(-1)[0];

  return new Promise(res => {
    fs.writeFile(filePath, fileContent, {}, err => {
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
