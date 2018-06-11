/* eslint-env node */
/* eslint-disable no-console */
const chalk = require('chalk');
const findUp = require('find-up');
const path = require('path');

const red = chalk.redBright;

// Traverse up the folder tree, trying to find config files
module.exports = function() {
  return findUp('.eslintrc.json').then(filePath => {
    if (filePath) {
      const eslintrcPath = path.relative(__dirname, filePath);
      const eslintrc = require(eslintrcPath);

      return {
        eslintrc,
        prettierConfig: Object.assign(
          { parser: 'babylon' },
          eslintrc.rules['prettier/prettier'][1]
        )
      };
    } else {
      console.log(
        `😱  ${red('No')} .eslintrc.json' ${red(
          'file found. Check the readme'
        )}`
      );
      process.exit(1);
    }
  });
};
