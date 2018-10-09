const fs = require('fs');
const path = require('path');
const test = require('ava');

const renameJSX = require('../../source/transforms/rename-jsx');

const templateSource = fs.readFileSync(
  path.join(__dirname, '../../source/templates/mockup-page.jsx'),
  'utf-8'
);

test('Renames component', t => {
  const renamedComonentSource = renameJSX(
    templateSource,
    'component',
    'test-page'
  );

  t.snapshot(renamedComonentSource);
});
