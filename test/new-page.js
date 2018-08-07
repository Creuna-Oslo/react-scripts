const test = require('ava');
const fs = require('fs');
const path = require('path');
const tempy = require('tempy');

const newPage = require('../source/new-page');

test.cb('New page', t => {
  t.plan(2);

  const componentName = 'component';
  const expectedFilesNames = [
    `${componentName}.json`,
    `${componentName}.jsx`,
    'index.js'
  ];
  const tempDir = tempy.directory();
  const componentPath = path.join(tempDir, componentName);

  newPage({
    componentName,
    mockupPath: tempDir
  }).then(() => {
    t.snapshot(
      fs.readFileSync(path.join(componentPath, `${componentName}.jsx`), 'utf-8')
    );
    t.deepEqual(fs.readdirSync(componentPath), expectedFilesNames);
    t.end();
  });
});
