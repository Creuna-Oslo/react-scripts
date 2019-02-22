const test = require('ava');
const fs = require('fs');
const fsExtra = require('fs-extra');
const path = require('path');
const tempy = require('tempy');

const rename = require('../source/rename');

const { readFile, readFixture } = require('./helpers/read');
const eslintConfig = require('../.eslintrc.json');

test('Rename', async t => {
  const componentName = 'component-stateful';
  const newComponentName = 'new-component';
  const tempDir = tempy.directory();
  const newComponentPath = path.join(tempDir, newComponentName);

  fsExtra.copySync(
    path.join(__dirname, 'fixtures', componentName),
    path.join(tempDir, componentName)
  );

  const expectedFileNames = [
    `${newComponentName}.jsx`,
    `${newComponentName}.scss`
  ];

  await rename({
    eslintConfig,
    filePath: path.join(tempDir, componentName, `${componentName}.jsx`),
    newComponentName
  });

  t.deepEqual(
    expectedFileNames,
    fs
      .readdirSync(newComponentPath)
      .filter(fileName => expectedFileNames.includes(fileName))
  );

  t.is(
    readFixture(path.join(componentName, 'renamed.jsx')),
    readFile(path.join(newComponentPath, `${newComponentName}.jsx`))
  );

  t.is(
    `.new-component {
}

.new-component-class {
}
`,
    readFile(path.join(newComponentPath, `${newComponentName}.scss`))
  );
});
