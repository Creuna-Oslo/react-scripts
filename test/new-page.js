const test = require('ava');
const fs = require('fs');
const path = require('path');
const tempy = require('tempy');

const newPage = require('../source/new-page');
const eslintConfig = require('../.eslintrc.json');

const runNewPage = (componentName, dataFileExtension) =>
  new Promise(resolve => {
    const folderPath = tempy.directory();
    const componentPath = path.join(folderPath, componentName);

    newPage({
      componentName,
      dataFileExtension,
      eslintConfig,
      folderPath
    }).then(() => {
      resolve(componentPath);
    });
  });

test.cb('New page', t => {
  t.plan(2);

  runNewPage('component').then(componentPath => {
    t.snapshot(
      fs.readFileSync(path.join(componentPath, 'component.jsx'), 'utf-8')
    );
    t.deepEqual(fs.readdirSync(componentPath), [
      'component.json',
      'component.jsx',
      'index.js'
    ]);
    t.end();
  });
});

test.cb('New page with js data file', t => {
  t.plan(2);

  runNewPage('component', 'js').then(componentPath => {
    t.deepEqual(fs.readdirSync(componentPath), [
      'component.js',
      'component.jsx',
      'index.js'
    ]);
    t.is(
      fs.readFileSync(path.join(componentPath, 'component.js'), 'utf-8'),
      'export default {};'
    );
    t.end();
  });
});

const throwsTemplate = (t, options) => {
  newPage(options)
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
