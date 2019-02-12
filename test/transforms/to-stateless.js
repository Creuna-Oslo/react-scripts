const path = require('path');
const test = require('ava');

const eslintConfig = require('../../.eslintrc.json');
const statelessTransform = require('../../source/transforms/to-stateless');
const { readFixture } = require('../helpers/read');

const componentName = 'component-stateful';

const expectedOutput = readFixture(path.join(componentName, 'transformed.jsx'));

const sourceCode = readFixture(
  path.join(componentName, 'component-stateful.jsx')
);

test('Works', t => {
  const output = statelessTransform(sourceCode, componentName, eslintConfig);

  t.is(expectedOutput, output);
});
