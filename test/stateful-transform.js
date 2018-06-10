const fs = require('fs');
const path = require('path');
const test = require('ava');

const statefulTransform = require('../source/transforms/to-stateful');

const statelessComponentSource = fs.readFileSync(
  path.join(
    __dirname,
    '../test-components/image-stateless/image-stateless.jsx'
  ),
  'utf-8'
);

test('Works', t => {
  const transformedSource = statefulTransform(
    statelessComponentSource,
    'image-stateless'
  );

  t.snapshot(transformedSource);
});
