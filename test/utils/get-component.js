const test = require('ava');
const fs = require('fs');
const path = require('path');
const tempy = require('tempy');

const getComponent = require('../../source/utils/get-component');
const newComponent = require('../../source/new-component');

const template = (t, pathOrName, componentsPathRelative, emulateCWD) => {
  t.plan(1);

  const tempDir = tempy.directory();
  const fileName = path.basename(pathOrName, '.jsx') + '.jsx';
  const pathWithoutExt = pathOrName.replace(/\.jsx$/, '');
  const componentsPath = path.join(tempDir, componentsPathRelative);
  const componentPath = path.join(componentsPath, pathWithoutExt);

  newComponent({
    componentsPath,
    pathOrName: pathWithoutExt // newComponent doesn't support file endings
  }).then(() => {
    t.is(
      path.join(componentPath, fileName),
      getComponent({
        // Pass undefined in order to test cwd
        componentsPath: emulateCWD ? undefined : componentsPath,
        cwd: emulateCWD ? componentsPath : undefined,
        pathOrName
      }).filePath
    );
    t.end();
  });
};

test.cb('Basic', template, 'component', '');
test.cb('With file ext', template, 'component.jsx', '');
test.cb('With componentsPath', template, 'component', 'components');
test.cb('Nested', template, 'component/component', '');
test.cb('Nested with file ext', template, 'component/component.jsx', '');
test.cb(
  'Nested with componentsPath',
  template,
  'component/component',
  'components'
);
test.cb(
  'Nested with componentsPath and file ext',
  template,
  'component/component.jsx',
  'components'
);

test.cb('Basic with cwd', template, 'component', '', true);
test.cb('Nested with cwd', template, 'component/component', '', true);
test.cb(
  'Nested with cwd and file ext',
  template,
  'component/component.jsx',
  '',
  true
);
