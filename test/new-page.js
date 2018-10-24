const test = require('ava');
const fs = require('fs');
const path = require('path');
const tempy = require('tempy');

const newPage = require('../source/new-page');
const eslintConfig = require('../.eslintrc.json');

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
  t.plan(2);

  const componentPath = await runNewPage({ componentName: 'component' });

  t.snapshot(
    fs.readFileSync(path.join(componentPath, 'component.jsx'), 'utf-8')
  );
  t.deepEqual(fs.readdirSync(componentPath), [
    'component.json',
    'component.jsx',
    'index.js'
  ]);
});

test('New page with js data file', async t => {
  t.plan(2);

  const componentPath = await runNewPage({
    componentName: 'component',
    dataFileExtension: 'js'
  });

  t.deepEqual(fs.readdirSync(componentPath), [
    'component.js',
    'component.jsx',
    'index.js'
  ]);
  t.is(
    'export default {};',
    fs.readFileSync(path.join(componentPath, 'component.js'), 'utf-8')
  );
});

test('New page with js data file and custom content', async t => {
  t.plan(2);

  const dataFileContent = 'export default { a: 1 };';

  const componentPath = await runNewPage({
    componentName: 'component',
    dataFileExtension: 'js',
    dataFileContent
  });

  t.deepEqual(fs.readdirSync(componentPath), [
    'component.js',
    'component.jsx',
    'index.js'
  ]);
  t.is(
    dataFileContent,
    fs.readFileSync(path.join(componentPath, 'component.js'), 'utf-8')
  );
});

test('New page with yaml data file and custom template', async t => {
  t.plan(2);

  const dataFileContent = 'data:\n  - "hello"';

  const componentPath = await runNewPage({
    componentName: 'component',
    dataFileExtension: 'yml',
    dataFileContent
  });

  t.deepEqual(fs.readdirSync(componentPath), [
    'component.jsx',
    'component.yml',
    'index.js'
  ]);
  t.is(
    dataFileContent,
    fs.readFileSync(path.join(componentPath, 'component.yml'), 'utf-8')
  );
});

test('With page name, group and url', async t => {
  const componentPath = await runNewPage({
    componentName: 'component',
    groupName: 'Some group',
    humanReadableName: 'Some page',
    url: '/some-page'
  });

  const fileContent = fs.readFileSync(
    path.join(componentPath, 'component.jsx'),
    'utf-8'
  );

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
