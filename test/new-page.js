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
    folderPath: tempDir
  }).then(() => {
    t.snapshot(
      fs.readFileSync(path.join(componentPath, `${componentName}.jsx`), 'utf-8')
    );
    t.deepEqual(fs.readdirSync(componentPath), expectedFilesNames);
    t.end();
  });
});

const throwsTemplate = (t, options) => {
  newPage({})
    .then(() => {
      t.fail();
      t.end();
    })
    .catch(() => {
      t.pass();
      t.end();
    });
};

test.cb('Throws on missing name', throwsTemplate, {
  folderPath: tempy.directory()
});

test.cb('Throws on missing path', throwsTemplate, { componentName: 'a' });
test.cb('Throws on non-existing path', throwsTemplate, {
  componentName: 'a',
  folderPath: 'a/b'
});
