const fs = require('fs');
const path = require('path');
const test = require('ava');

const renameImportTransform = require('../source/transforms/rename-import-json');
const renameJSXTransform = require('../source/transforms/rename-jsx');

const templateSource = fs.readFileSync(
  path.join(__dirname, '../source/templates/mockup-page.jsx'),
  'utf-8'
);

test('Renames component and json import', t => {
  const renamedComonentSource = renameJSXTransform(
    templateSource,
    'component',
    'test-page'
  );

  const sourceWithRenamedImport = renameImportTransform(
    renamedComonentSource,
    'test-page'
  );

  t.snapshot(sourceWithRenamedImport);
});
