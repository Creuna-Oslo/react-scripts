const test = require('ava');
const fs = require('fs');
const path = require('path');
const tempy = require('tempy');

const newComponent = require('../source/new-component');

const template = (t, pathOrName, componentsPathRelative, shouldBeStateful) => {
  t.plan(2);

  const componentName = path.basename(pathOrName, '.jsx');
  const expectedFilesNames = [
    `${componentName}.jsx`,
    `${componentName}.scss`,
    'index.js'
  ];
  const tempDir = tempy.directory();
  const componentsPath = path.join(tempDir, componentsPathRelative);
  const componentPath = path.join(componentsPath, pathOrName);

  newComponent({
    componentsPath,
    pathOrName,
    shouldBeStateful
  }).then(() => {
    t.snapshot(
      fs.readFileSync(path.join(componentPath, `${componentName}.jsx`), 'utf-8')
    );
    t.deepEqual(fs.readdirSync(componentPath), expectedFilesNames);
    t.end();
  });
};

test.cb('Stateless', template, 'component', '', false);
test.cb('Stateful', template, 'component', '', true);

test.cb('Relative path', template, 'test/test/component', '');
test.cb('With componentsPath', template, 'component', 'components');
test.cb(
  'Nested with componentsPath',
  template,
  'test/test/component',
  'components'
);
