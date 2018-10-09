const fs = require('fs');
const path = require('path');
const test = require('ava');

const renameDataImport = require('../../source/transforms/rename-import-json');

const templateSource = fs.readFileSync(
  path.join(__dirname, '../../source/templates/mockup-page.jsx'),
  'utf-8'
);

test('Renames json import', t => {
  const sourceWithRenamedImport = renameDataImport(
    templateSource,
    'test-page',
    'json'
  );

  t.snapshot(sourceWithRenamedImport);
});

test('Renames js import', t => {
  const sourceWithRenamedImport = renameDataImport(
    templateSource,
    'component',
    'js'
  );

  t.snapshot(sourceWithRenamedImport);
});

test('Renames yaml import', t => {
  const sourceWithRenamedImport = renameDataImport(
    templateSource,
    'component',
    'yml'
  );

  t.snapshot(sourceWithRenamedImport);
});
