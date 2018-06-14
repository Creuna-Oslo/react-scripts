const fs = require('fs');
const path = require('path');

const statelessTransform = require('../source/transforms/to-stateless');
const ensureCanConvert = require('../source/utils/ensure-can-convert-to-stateless');
const eslintrc = require('../.eslintrc.json');

const statefulComponentSource = fs.readFileSync(
  path.join(
    __dirname,
    '../test-components/component-stateful/component-stateful.jsx'
  ),
  'utf-8'
);

ensureCanConvert(statefulComponentSource, eslintrc);

statelessTransform(statefulComponentSource, 'component-stateful');
