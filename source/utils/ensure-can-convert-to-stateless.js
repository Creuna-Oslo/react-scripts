/* eslint-env node */
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
    console.log(
      `👻  Component can't be converted. Please make sure it's not already stateless and that there is no state or methods in your class.`
    );

    process.exit(1);
  }
};
