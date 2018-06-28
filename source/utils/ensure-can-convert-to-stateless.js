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
  const errors = linter.verify(sourceCode, {
    parser: 'babel-eslint',
    parserOptions: eslintrc.parserOptions,
    rules: {
      'react/prefer-stateless-function': 1
    }
  });
  const fatalError = errors.find(error => error.fatal);

  if (fatalError) {
    throw new Error(`${fatalError.message}\n\nAborting.`);
  }

  // If the component can be converted, eslint will return a warning that the component should be converted. If there are no warnings, the component can't be converted.
  if (!errors.length) {
    throw new Error(
      `Component can't be converted. Make sure that there is no:
  • state or references to state
  • class methods
  • refs`
    );
  }
};
