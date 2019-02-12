const path = require('path');
const test = require('ava');

const statefulTransform = require('../../source/transforms/to-stateful');

const eslintConfig = require('../../.eslintrc.json');
const { readFixture } = require('../helpers/read');

const componentName = 'component-stateless';
const expectedOutput = readFixture(path.join(componentName, 'transformed.jsx'));

const sourceCode = readFixture(
  path.join(componentName, 'component-stateless.jsx')
);

test('Works', t => {
  const output = statefulTransform(sourceCode, componentName, eslintConfig);

  t.is(expectedOutput, output);
});
