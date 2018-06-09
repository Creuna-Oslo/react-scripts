/* eslint-env node */
/* eslint-disable no-console */
const chalk = require('chalk');
const fs = require('fs');
const path = require('path');

const red = chalk.redBright;

module.exports = function(folderPath) {
  const slugs = folderPath.split(path.sep);
  const folderName = slugs.slice(-1)[0];

  if (fs.existsSync(folderPath)) {
    console.log(`👻  ${red('Folder')} ${folderName} ${red('already exists.')}`);

    process.exit(1);
  }

  return true;
};
