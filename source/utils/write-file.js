/* eslint-env node */
/* eslint-disable no-console */
const chalk = require('chalk');
const fs = require('fs');
const path = require('path');

module.exports = function(filePath, fileContent, confirmationMessage) {
  const slugs = filePath.split(path.sep);
  const fileName = slugs.slice(-1)[0];
  const defaultConfirmation = `💾  ${chalk.blueBright(fileName)} saved`;

  return new Promise(res => {
    fs.writeFile(filePath, fileContent, {}, err => {
      if (err) {
        console.log(`👻  ${chalk.redBright('Error writing')} ${fileName}`, err);

        process.exit(1);
      }

      console.log(confirmationMessage || defaultConfirmation);

      return res();
    });
  });
};
