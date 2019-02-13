const path = require('path');
const test = require('ava');

const { readFixture } = require('./helpers/read');

const ensureCanConvertToStateless = require('../source/utils/ensure-can-convert-to-stateless');
const eslintrc = require('../.eslintrc.json');

const validComponentSource = readFixture(
  path.join('component-stateful', 'component-stateful.jsx')
);

const invalidComponentSource = readFixture(
  path.join(
    'component-stateful-no-transform',
    'component-stateful-no-transform.jsx'
  )
);

test('Detects able to convert', t => {
  t.notThrows(() => {
    ensureCanConvertToStateless(validComponentSource, eslintrc);
  });
});

test('Detects unable to convert', t => {
  const error = t.throws(() => {
    ensureCanConvertToStateless(invalidComponentSource, eslintrc);
  });

  t.is(
    `Component can't be converted. Make sure that there is no:
  • state or references to state
  • class methods
  • refs`,
    error.message
  );
});
