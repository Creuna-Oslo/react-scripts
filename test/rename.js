const test = require('ava');
const fs = require('fs');
const fsExtra = require('fs-extra');
const path = require('path');
const tempy = require('tempy');

const rename = require('../source/rename');

test.cb('Rename', t => {
  t.plan(4);

  const componentName = 'component-stateful';
  const newComponentName = 'new-name';
  const tempDir = tempy.directory();
  const newComponentPath = path.join(tempDir, newComponentName);

  fsExtra.copySync(
    path.join(__dirname, '..', 'test-components', componentName),
    path.join(tempDir, componentName)
  );

  const expectedFileNames = [
    'index.js',
    `${newComponentName}.jsx`,
    `${newComponentName}.scss`
  ];

  rename({
    filePath: path.join(tempDir, componentName, `${componentName}.jsx`),
    newComponentName: newComponentName
  }).then(() => {
    t.deepEqual(
      expectedFileNames,
      fs
        .readdirSync(newComponentPath)
        .filter(fileName => expectedFileNames.includes(fileName))
    );
    expectedFileNames.forEach(fileName => {
      t.snapshot(
        fs.readFileSync(path.join(newComponentPath, fileName), 'utf-8'),
        fileName
      );
    });
    t.end();
  });
});
