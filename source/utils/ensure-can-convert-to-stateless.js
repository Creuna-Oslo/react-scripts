/* eslint-env node */
/* eslint-disable no-console */
const chalk = require('chalk');
const eslint = require('eslint');
const reactEslint = require('eslint-plugin-react');

const linter = new eslint.Linter();

linter.defineRules(
  Object.assign(
    {},
    Object.keys(reactEslint.rules).reduce((accum, key) => {
      accum[`react/${key}`] = reactEslint.rules[key];
      return accum;
    }, {})
  )
);

module.exports = function(
  sourceCode,
  eslintrc,
  showLogError = true,
  exitOnFail = true
) {
  if (
    !linter.verify(sourceCode, {
      parser: eslintrc.parser,
      parserOptions: eslintrc.parserOptions,
      rules: {
        'react/prefer-stateless-function': 1
      }
    }).length
  ) {
    if (showLogError) {
      console.log(
        `😭  ${chalk.redBright(`Component can't be converted. Make sure that there is no:
  • state or references to state
  • class methods
  • refs
        `)}`
      );
    }

    if (exitOnFail) {
      process.exit(1);
    } else {
      throw new Error("Component can't be converted");
    }
  }
};
