/* eslint-env node */
/* eslint-disable no-console */
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

module.exports = function(sourceCode, eslintrc) {
  if (
    !linter.verify(sourceCode, {
      parser: eslintrc.parser,
      parserOptions: eslintrc.parserOptions,
      rules: {
        'react/prefer-stateless-function': 1
      }
    }).length
  ) {
    console.log(`👻  Component can't be converted. Please make sure that:`);
    console.log(`  • There's no state or references to state`);
    console.log(`  • There are no class methods`);
    console.log(`  • There are no refs`);

    process.exit(1);
  }
};
