const test = require('ava');
const fsExtra = require('fs-extra');
const path = require('path');
const tempy = require('tempy');

const toStateless = require('../source/to-stateless');

const eslintConfig = require('../.eslintrc.json');
const { readFile, readFixture } = require('./helpers/read');

const fixturesPath = path.join(__dirname, 'fixtures');

test('Happy path', async t => {
  const componentName = 'component-stateful';
  const fixturePath = path.join(fixturesPath, componentName);
  const tempDir = tempy.directory();
  const filePath = path.join(tempDir, componentName, `${componentName}.jsx`);
  const expected = readFixture(path.join(componentName, 'transformed.jsx'));

  fsExtra.copySync(fixturePath, path.join(tempDir, componentName));

  await toStateless({ eslintConfig, filePath });

  t.is(expected, readFile(filePath));
});

test('With not transformable component', async t => {
  const componentName = 'component-stateful-no-transform';
  const fixturePath = path.join(fixturesPath, componentName);
  const tempDir = tempy.directory();
  const filePath = path.join(tempDir, componentName, `${componentName}.jsx`);

  fsExtra.copySync(fixturePath, path.join(tempDir, componentName));

  const error = await t.throwsAsync(
    toStateless({ eslintConfig, filePath }).catch(errorMessage => {
      throw new Error(errorMessage);
    })
  );
  t.is(
    `Component can't be converted. Make sure that there is no:
  • state or references to state
  • class methods
  • refs`,
    // NOTE: the error message also contains a stack trace after the fourth line with is excluded here
    error.message
      .split('\n')
      .slice(0, 4)
      .join('\n')
  );
});
