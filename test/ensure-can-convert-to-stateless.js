const fs = require('fs');
const path = require('path');
const test = require('ava');

const ensureCanConvertToStateless = require('../source/utils/ensure-can-convert-to-stateless');
const eslintrc = require('../.eslintrc.json');

const validComponentSource = fs.readFileSync(
  path.join(
    __dirname,
    '../test-components/component-stateful/component-stateful.jsx'
  ),
  'utf-8'
);

const invalidComponentSource = fs.readFileSync(
  path.join(
    __dirname,
    '../test-components/component-stateful-no-transform/component-stateful-no-transform.jsx'
  ),
  'utf-8'
);

test('Detects able to convert', t => {
  t.notThrows(() => {
    ensureCanConvertToStateless(validComponentSource, eslintrc);
  });
});

test('Detects unable to convert', t => {
  t.throws(() => {
    ensureCanConvertToStateless(invalidComponentSource, eslintrc);
  });
});
