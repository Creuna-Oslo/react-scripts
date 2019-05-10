const test = require('ava');
const fs = require('fs');
const path = require('path');
const tempy = require('tempy');

const newComponent = require('../source/new-component');

const eslintConfig = require('../.eslintrc.json');
const { readFile } = require('./helpers/read');

const template = async (t, pathOrName, expectedJSX) => {
  const componentName = path.basename(pathOrName, '.jsx');
  const expectedFilesNames = [`${componentName}.jsx`, `${componentName}.scss`];
  const tempDir = tempy.directory();
  const componentPath = path.join(tempDir, pathOrName);

  await newComponent({
    componentName,
    eslintConfig,
    folderPath: tempDir
  });

  t.is(expectedJSX, readFile(path.join(componentPath, `${componentName}.jsx`)));
  t.deepEqual(fs.readdirSync(componentPath), expectedFilesNames);
};

test(
  'Stateless',
  template,
  'component-a',
  `import React from 'react';
import PropTypes from 'prop-types';

const ComponentA = () => (
  <div className="component-a">
    {/* -------------------- 📝 -------------------- */}
  </div>
);

ComponentA.propTypes = {
  /* --------------------- 📝 --------------------- */
};

export default ComponentA;
`
);
