const test = require('ava');

const renameDataImport = require('../../source/transforms/rename-data-import');

const source = `import React from "react";
import content from "./component.json";
const Component = () => null;
export default Component;`;

test('Renames json import', t => {
  const output = renameDataImport(source, 'test-page', 'json');

  const expected = `import React from "react";
import content from "./test-page.json";
const Component = () => null;
export default Component;`;

  t.is(expected, output);
});

test('Renames js import', t => {
  const output = renameDataImport(source, 'component', 'js');

  const expected = `import React from "react";
import content from "./component.js";
const Component = () => null;
export default Component;`;

  t.is(expected, output);
});

test('Renames yaml import', t => {
  const output = renameDataImport(source, 'component', 'yml');

  const expected = `import React from "react";
import content from "./component.yml";
const Component = () => null;
export default Component;`;

  t.is(expected, output);
});
