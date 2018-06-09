/* eslint-env node */
/* eslint-disable no-console */
const chalk = require('chalk');
const fs = require('fs');
const path = require('path');

module.exports = function(filePath, newFilename, type = 'file') {
  const slugs = filePath.split(path.sep);
  const fileName = slugs.slice(-1)[0];
  const newFilePath = path.join(
    filePath.slice(0, filePath.lastIndexOf(path.sep)),
    newFilename
  );

  return new Promise(res => {
    fs.rename(filePath, newFilePath, err => {
      if (err) {
        console.log(
          `👻  ${chalk.red(`Error renaming ${type}`)} ${chalk.blueBright(
            fileName
          )}`,
          err
        );

        process.exit(1);
      }

      console.log(
        `💾  ${chalk.blueBright(fileName)} renamed to ${chalk.blueBright(
          newFilename
        )}`
      );

      return res();
    });
  });
};
