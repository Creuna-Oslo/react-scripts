/* eslint-env node */
/* eslint-disable no-console */
const chalk = require('chalk');
const fs = require('fs');
const path = require('path');

module.exports = function(filePath, fileContent, confirmationMessage) {
  const slugs = filePath.split(path.sep);
  const fileName = slugs.slice(-1)[0];
  const defaultConfirmation = {
    emoji: '💾',
    text: `${chalk.blueBright(fileName)} saved`
  };

  return new Promise((resolve, reject) => {
    fs.writeFile(filePath, fileContent, {}, error => {
      if (error) {
        return reject(
          new Error(`Error writing ${chalk.blueBright(fileName)}\n\n${error}`)
        );
      }

      return resolve(confirmationMessage || defaultConfirmation);
    });
  });
};
