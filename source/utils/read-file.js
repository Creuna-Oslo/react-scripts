/* eslint-env node */
/* eslint-disable no-console */
const chalk = require('chalk');
const fs = require('fs');
const path = require('path');

module.exports = function(filePath) {
  const slugs = filePath.split(path.sep);
  const fileName = slugs.slice(-1)[0];

  return new Promise(res => {
    fs.readFile(filePath, 'utf-8', (err, fileContent) => {
      if (err) {
        console.log(`👻  ${chalk.redBright('Error reading')} ${fileName}`, err);

        process.exit(1);
      }

      return res(fileContent);
    });
  });
};
