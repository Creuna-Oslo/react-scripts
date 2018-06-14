const fs = require('fs');
const path = require('path');

const statefulTransform = require('../source/transforms/to-stateful');

const statelessComponentSource = fs.readFileSync(
  path.join(
    __dirname,
    '../test-components/component-stateless/component-stateless.jsx'
  ),
  'utf-8'
);

statefulTransform(statelessComponentSource, 'component-stateless');
