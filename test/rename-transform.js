const fs = require('fs');
const path = require('path');
const test = require('ava');

const renameTransform = require('../source/transforms/rename-jsx');

const statefulComponentSource = fs.readFileSync(
  path.join(__dirname, '../test-components/image-stateful/image-stateful.jsx'),
  'utf-8'
);

const statelessComponentSource = fs.readFileSync(
  path.join(
    __dirname,
    '../test-components/image-stateless/image-stateless.jsx'
  ),
  'utf-8'
);

test('Stateful component', t => {
  const transformedSource = renameTransform(
    statefulComponentSource,
    'image-stateful',
    'image'
  );

  t.snapshot(transformedSource);
});

test('Stateless component', t => {
  const transformedSource = renameTransform(
    statelessComponentSource,
    'image-stateless',
    'image'
  );

  t.snapshot(transformedSource);
});
