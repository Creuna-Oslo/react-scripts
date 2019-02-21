const test = require('ava');
const fs = require('fs');
const path = require('path');
const tempy = require('tempy');

const newPage = require('../source/new-page');

const eslintConfig = require('../.eslintrc.json');
const { readFile } = require('./helpers/read');

const runNewPage = options =>
  new Promise(resolve => {
    const { componentName } = options;
    const folderPath = tempy.directory();
    const componentPath = path.join(folderPath, componentName);

    newPage({
      ...options,
      componentName,
      eslintConfig,
      folderPath
    }).then(() => {
      resolve(componentPath);
    });
  });

test('New page', async t => {
  const componentPath = await runNewPage({ componentName: 'component' });

  const expectedJsx = `/*
 */

import React from 'react';
import Layout from '../../layout';

import content from './component.json';

const Component = () => (
  <Layout>
    {/* ------------------------- 📝 ------------------------- */}
  </Layout>
);

export default Component;
`;

  t.is(expectedJsx, readFile(path.join(componentPath, 'component.jsx')));
  t.deepEqual(fs.readdirSync(componentPath), [
    'component.json',
    'component.jsx'
  ]);
});

test('New page with js data file', async t => {
  const componentPath = await runNewPage({
    componentName: 'component',
    dataFileExtension: 'js'
  });

  t.deepEqual(fs.readdirSync(componentPath), ['component.js', 'component.jsx']);
  t.is(
    'export default {};',
    readFile(path.join(componentPath, 'component.js'))
  );
});

test('New page with js data file and custom content', async t => {
  const dataFileContent = 'export default { a: 1 };';

  const componentPath = await runNewPage({
    componentName: 'component',
    dataFileExtension: 'js',
    dataFileContent
  });

  t.deepEqual(fs.readdirSync(componentPath), ['component.js', 'component.jsx']);
  t.is(dataFileContent, readFile(path.join(componentPath, 'component.js')));
});

test('New page with yaml data file and custom template', async t => {
  const dataFileContent = 'data:\n  - "hello"';

  const componentPath = await runNewPage({
    componentName: 'component',
    dataFileExtension: 'yml',
    dataFileContent
  });

  t.deepEqual(fs.readdirSync(componentPath), [
    'component.jsx',
    'component.yml'
  ]);
  t.is(dataFileContent, readFile(path.join(componentPath, 'component.yml')));
});

test('With page name, group and url', async t => {
  const componentPath = await runNewPage({
    componentName: 'component',
    groupName: 'Some group',
    humanReadableName: 'Some page',
    url: '/some-page'
  });

  const fileContent = readFile(path.join(componentPath, 'component.jsx'));

  const expectedLines =
    `/*\n` +
    `group: Some group\n` +
    `name: Some page\n` +
    `path: /some-page\n` +
    `*/`;

  const frontMatterLines = fileContent
    .split('\n')
    .slice(0, 5)
    .join('\n');

  t.is(expectedLines, frontMatterLines);
});

const throwsTemplate = async (t, options, erorrMessage) => {
  try {
    await newPage(options);
  } catch (error) {
    t.is(erorrMessage, error);
  }
};

test(
  'Throws on missing name',
  throwsTemplate,
  {
    folderPath: tempy.directory()
  },
  'No page name provided.'
);

test(
  'Throws on missing path',
  throwsTemplate,
  { componentName: 'a' },
  'No path provided.'
);

test(
  'Throws on non-existing path',
  throwsTemplate,
  {
    componentName: 'a',
    folderPath: 'a/b'
  },
  "Path 'a/b' does not exist."
);
