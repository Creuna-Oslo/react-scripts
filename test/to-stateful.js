const test = require('ava');
const fs = require('fs');
const fsExtra = require('fs-extra');
const path = require('path');
const tempy = require('tempy');

const toStateful = require('../source/to-stateful');

test.cb('To stateful', t => {
  t.plan(1);

  const componentName = 'component-stateless';
  const tempDir = tempy.directory();
  const filePath = path.join(tempDir, componentName, `${componentName}.jsx`);

  fsExtra.copySync(
    path.join(__dirname, '..', 'test-components', componentName),
    path.join(tempDir, componentName)
  );

  toStateful({ filePath }).then(() => {
    t.snapshot(fs.readFileSync(filePath, 'utf-8'));
    t.end();
  });
});
