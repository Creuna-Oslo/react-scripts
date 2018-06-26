/* eslint-env node */
/* eslint-disable no-console */
const chalk = require('chalk');
const fs = require('fs');
const path = require('path');

module.exports = function(filePath) {
  const slugs = filePath.split(path.sep);
  const fileName = slugs.slice(-1)[0];

  return new Promise((resolve, reject) => {
    fs.readFile(filePath, 'utf-8', (error, fileContent) => {
      if (error) {
        reject(
          new Error(`Error reading ${chalk.blueBright(fileName)}\n\n${error}
        `)
        );
      }

      return resolve(fileContent);
    });
  });
};
