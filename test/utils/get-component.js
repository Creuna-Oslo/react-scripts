const test = require('ava');
const path = require('path');
const tempy = require('tempy');

const getComponent = require('../../source/utils/get-component');
const newComponent = require('../../source/new-component');

const template = (t, pathOrName, basePathRelative) => {
  t.plan(1);

  const tempDir = tempy.directory();
  const fileName = path.basename(pathOrName, '.jsx') + '.jsx';
  const pathWithoutExt = pathOrName.replace(/\.jsx$/, '');
  const basePath = path.join(tempDir, basePathRelative);
  const componentPath = path.join(basePath, pathWithoutExt);

  newComponent({
    basePath,
    pathOrName: pathWithoutExt // newComponent doesn't support file endings
  }).then(() => {
    t.is(
      path.join(componentPath, fileName),
      getComponent({
        // Pass undefined in order to test cwd
        basePath,
        pathOrName
      }).filePath
    );
    t.end();
  });
};

test.cb('Basic', template, 'component', '');
test.cb('With file ext', template, 'component.jsx', '');
test.cb('With basePath', template, 'component', 'components');
test.cb('Nested', template, 'component/component', '');
test.cb('Nested with file ext', template, 'component/component.jsx', '');
test.cb('Nested with basePath', template, 'component/component', 'components');
test.cb(
  'Nested with basePath and file ext',
  template,
  'component/component.jsx',
  'components'
);
