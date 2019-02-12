const test = require('ava');
const fsExtra = require('fs-extra');
const path = require('path');
const tempy = require('tempy');

const toStateless = require('../source/to-stateless');
const eslintConfig = require('../.eslintrc.json');
const { readFile, readFixture } = require('./helpers/read');

const componentName = 'component-stateful';
const fixturePath = path.resolve(__dirname, '..', 'fixtures', componentName);

test('To stateless', async t => {
  const tempDir = tempy.directory();
  const filePath = path.join(tempDir, componentName, `${componentName}.jsx`);
  const expected = readFixture(path.join(componentName, 'transformed.jsx'));

  fsExtra.copySync(fixturePath, path.join(tempDir, componentName));

  await toStateless({ eslintConfig, filePath });

  t.is(expected, readFile(filePath));
});
