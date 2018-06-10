const fs = require('fs');
const path = require('path');
const test = require('ava');

const ensureCanConvertToStateless = require('../source/utils/ensure-can-convert-to-stateless');
const eslintrc = require('../.eslintrc.json');

const statefulComponentSource = fs.readFileSync(
  path.join(
    __dirname,
    '../test-components/image-stateful-no-transform/image-stateful-no-transform.jsx'
  ),
  'utf-8'
);

test('Works', t => {
  t.throws(() => {
    ensureCanConvertToStateless(
      statefulComponentSource,
      eslintrc,
      false,
      false
    );
  });
});
