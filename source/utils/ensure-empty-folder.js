/* eslint-env node */
/* eslint-disable no-console */
const chalk = require('chalk');
const fs = require('fs');
const path = require('path');

module.exports = function(folderPath) {
  return new Promise((resolve, reject) => {
    const slugs = folderPath.split(path.sep);
    const folderName = slugs.slice(-1)[0];

    if (fs.existsSync(folderPath)) {
      return reject(
        new Error(`Folder ${chalk.blueBright(folderName)} already exists.`)
      );
    }

    resolve();
  });
};
