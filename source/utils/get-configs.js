/* eslint-env node */
/* eslint-disable no-console */
const chalk = require('chalk');
const findUp = require('find-up');
const path = require('path');

const red = chalk.redBright;

const removeLastSlug = require('./remove-last-slug');

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
          `😱  ${red('No')} .eslintrc.json' ${red(
            'file found. Check the readme'
          )}`
        );
        process.exit(1);
      }
    }),
    findUp('.creunarc.json').then(filePath => {
      if (filePath) {
        const creunarcPath = path.relative(__dirname, filePath);
        const { componentsPath, mockupPath } = require(creunarcPath);
        const projectRoot = removeLastSlug(filePath);

        return {
          componentsPath: path.join(projectRoot, componentsPath),
          mockupPath: path.join(projectRoot, mockupPath)
        };
      } else {
        console.log(
          `😱  ${red('No')} .creunarc.json' ${red(
            'file found. Check the readme'
          )}`
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
