const fs = require('fs');
const path = require('path');

const renameImportTransform = require('../source/transforms/rename-import-json');
const renameJSXTransform = require('../source/transforms/rename-jsx');

const templateSource = fs.readFileSync(
  path.join(__dirname, '../source/templates/mockup-page.jsx'),
  'utf-8'
);

const renamedComonentSource = renameJSXTransform(
  templateSource,
  'component',
  'test-page'
);

renameImportTransform(renamedComonentSource, 'test-page');
