const fs = require('fs');
const path = require('path');
const test = require('ava');

const statelessTransform = require('../source/transforms/to-stateless');

const statefulComponentSource = fs.readFileSync(
  path.join(
    __dirname,
    '../test-components/component-stateful/component-stateful.jsx'
  ),
  'utf-8'
);

test('Works', t => {
  const transformedSource = statelessTransform(
    statefulComponentSource,
    'component-stateful'
  );

  t.snapshot(transformedSource);
});
