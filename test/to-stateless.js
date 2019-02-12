const test = require('ava');
const fs = require('fs');
const fsExtra = require('fs-extra');
const path = require('path');
const tempy = require('tempy');

const toStateless = require('../source/to-stateless');
const eslintConfig = require('../.eslintrc.json');

test.cb('To stateless', t => {
  t.plan(1);

  const componentName = 'component-stateful';
  const tempDir = tempy.directory();
  const filePath = path.join(tempDir, componentName, `${componentName}.jsx`);

  fsExtra.copySync(
    path.join(__dirname, '..', 'fixtures', componentName),
    path.join(tempDir, componentName)
  );

  toStateless({ eslintConfig, filePath }).then(() => {
    t.snapshot(fs.readFileSync(filePath, 'utf-8'));
    t.end();
  });
});
