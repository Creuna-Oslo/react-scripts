/* eslint-env node */
/* eslint-disable no-console */
const chalk = require('chalk');
const findUp = require('find-up');
const path = require('path');

// Traverse up the folder tree, trying to find config files
module.exports = function(callback) {
  Promise.all([
    findUp('.eslintrc.json').then(filePath => {
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
          `😱  No ${chalk.redBright(
            '.eslintrc.json'
          )} file found. Check the readme`
        );
        process.exit(1);
      }
    }),
    findUp('.creunarc.json').then(filePath => {
      if (filePath) {
        const creunarcPath = path.relative(__dirname, filePath);
        const { componentsPath, mockupPath } = require(creunarcPath);
        const projectRoot = filePath.substring(
          0,
          filePath.lastIndexOf(path.sep)
        );
        const projectRootRelative = path.relative(process.cwd(), projectRoot);

        return {
          componentsPath: path.join(projectRootRelative, componentsPath),
          mockupPath: path.join(projectRootRelative, mockupPath)
        };
      } else {
        console.log(
          `😱  No ${chalk.redBright(
            '.creunarc.json'
          )} file found. Check the readme`
        );
        process.exit(1);
      }
    })
  ]).then(([{ eslintrc, prettierConfig }, { componentsPath, mockupPath }]) =>
    callback({
      eslintrc,
      prettierConfig,
      componentsPath,
      mockupPath
    })
  );
};
