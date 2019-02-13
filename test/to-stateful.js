const test = require('ava');
const fsExtra = require('fs-extra');
const path = require('path');
const tempy = require('tempy');

const toStateful = require('../source/to-stateful');

const eslintConfig = require('../.eslintrc.json');
const { readFile, readFixture } = require('./helpers/read');

test('To stateful', async t => {
  const componentName = 'component-stateless';
  const fixturePath = path.resolve(__dirname, 'fixtures', componentName);
  const tempDir = tempy.directory();
  const filePath = path.join(tempDir, componentName, `${componentName}.jsx`);
  const expected = readFixture(path.join(componentName, 'transformed.jsx'));

  fsExtra.copySync(fixturePath, path.join(tempDir, componentName));

  await toStateful({ eslintConfig, filePath });

  t.is(expected, readFile(filePath));
});
