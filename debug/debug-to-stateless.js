const fs = require('fs');
const path = require('path');

const statelessTransform = require('../source/transforms/to-stateless');

const statefulComponentSource = fs.readFileSync(
  path.join(
    __dirname,
    '../test-components/component-stateful/component-stateful.jsx'
  ),
  'utf-8'
);

statelessTransform(statefulComponentSource, 'component-stateful');
