const fs = require('fs');
const path = require('path');
const test = require('ava');

const renameTransform = require('../../source/transforms/rename-jsx');

const statefulComponentSource = fs.readFileSync(
  path.join(
    __dirname,
    '../../test-components/component-stateful/component-stateful.jsx'
  ),
  'utf-8'
);

const statelessComponentSource = fs.readFileSync(
  path.join(
    __dirname,
    '../../test-components/component-stateless/component-stateless.jsx'
  ),
  'utf-8'
);

test('Stateful component', t => {
  const transformedSource = renameTransform(
    statefulComponentSource,
    'component-stateful',
    'new-component'
  );

  t.snapshot(transformedSource);
});

test('Stateless component', t => {
  const transformedSource = renameTransform(
    statelessComponentSource,
    'component-stateless',
    'new-component'
  );

  t.snapshot(transformedSource);
});
