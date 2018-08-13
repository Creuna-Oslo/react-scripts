const test = require('ava');
const fs = require('fs');
const path = require('path');
const tempy = require('tempy');

const newComponent = require('../source/new-component');

const template = (t, pathOrName, shouldBeStateful) => {
  t.plan(2);

  const componentName = path.basename(pathOrName, '.jsx');
  const expectedFilesNames = [
    `${componentName}.jsx`,
    `${componentName}.scss`,
    'index.js'
  ];
  const tempDir = tempy.directory();
  const componentPath = path.join(tempDir, pathOrName);

  newComponent({
    componentName,
    folderPath: tempDir,
    shouldBeStateful
  }).then(() => {
    t.snapshot(
      fs.readFileSync(path.join(componentPath, `${componentName}.jsx`), 'utf-8')
    );
    t.deepEqual(fs.readdirSync(componentPath), expectedFilesNames);
    t.end();
  });
};

test.cb('Stateless', template, 'component', false);
test.cb('Stateful', template, 'component', true);
