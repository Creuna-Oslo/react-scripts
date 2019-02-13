const path = require('path');
const test = require('ava');

const renameTransform = require('../../source/transforms/rename-jsx');

const { readFixture } = require('../helpers/read');
const eslintConfig = require('../../.eslintrc.json');

test('Stateful component', t => {
  const componentName = 'component-stateful';
  const source = readFixture(
    path.join(componentName, 'component-stateful.jsx')
  );
  const expected = readFixture(path.join(componentName, 'renamed.jsx'));
  const output = renameTransform(
    source,
    'component-stateful',
    'new-component',
    eslintConfig
  );

  t.is(expected, output);
});

test('Stateless component', t => {
  const componentName = 'component-stateless';
  const source = readFixture(
    path.join(componentName, 'component-stateless.jsx')
  );
  const expected = readFixture(path.join(componentName, 'renamed.jsx'));
  const output = renameTransform(
    source,
    componentName,
    'new-component',
    eslintConfig
  );

  t.is(expected, output);
});
