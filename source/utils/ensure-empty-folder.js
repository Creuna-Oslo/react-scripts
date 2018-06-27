/* eslint-env node */
/* eslint-disable no-console */
const chalk = require('chalk');
const fs = require('fs');
const path = require('path');

module.exports = function(folderPath) {
  const slugs = folderPath.split(path.sep);
  const folderName = slugs.slice(-1)[0];

  if (fs.existsSync(folderPath)) {
    throw new Error(`Folder ${chalk.blueBright(folderName)} already exists.`);
  }
};
