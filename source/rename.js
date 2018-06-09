/* eslint-env node */
/* eslint-disable no-console */
const fs = require('fs');
const kebabToPascal = require('@creuna/utils/kebab-to-pascal').default;
const prettier = require('prettier');
const path = require('path');

const ensureEmptyFolder = require('./utils/ensure-empty-folder');
const getComponent = require('./utils/get-component');
const getConfigs = require('./utils/get-configs');
const prompt = require('./utils/prompt');
const readFile = require('./utils/read-file');
const renameFile = require('./utils/rename-file');
const renameJSXTransform = require('./transforms/rename-jsx');
const writeFile = require('./utils/write-file');

module.exports = function(pathOrName, newComponentName) {
  getConfigs(({ prettierConfig, componentsPath }) => {
    getComponent(
      { pathOrName, componentsPath },
      ({ componentName, filePath, folderPath }) => {
        prompt(
          {
            newComponentName: {
              text: 'New name of component',
              value: newComponentName
            }
          },
          ({ newComponentName }) => {
            renameComponent({
              componentName,
              folderPath,
              jsxFilePath: filePath,
              newComponentName,
              prettierConfig
            });
          }
        );
      }
    );
  });
};

function renameComponent({
  componentName,
  folderPath,
  jsxFilePath,
  newComponentName,
  prettierConfig
}) {
  const pascalNewComponentName = kebabToPascal(newComponentName);

  const indexFilename = 'index.js';
  const indexFilePath = path.join(folderPath, indexFilename);
  const scssFilename = `${componentName}.scss`;
  const scssFilePath = path.join(folderPath, scssFilename);

  const hasScssfile = fs.existsSync(path.join(folderPath, scssFilename));
  const hasIndexFile = fs.existsSync(path.join(folderPath, indexFilename));
  const slugs = folderPath.split(path.sep);
  const shouldRenameFolder = componentName === slugs.slice(-1)[0];
  const shouldWriteIndex = shouldRenameFolder && hasIndexFile;

  const newFolderPath =
    shouldRenameFolder &&
    path.join(
      folderPath.slice(0, folderPath.lastIndexOf(path.sep)),
      newComponentName
    );

  if (shouldRenameFolder) {
    ensureEmptyFolder(newFolderPath);
  }

  const jsxFileContent = fs.readFileSync(jsxFilePath, 'utf-8');

  const newJsxFileContent = prettier.format(
    renameJSXTransform(jsxFileContent, componentName, newComponentName),
    prettierConfig
  );

  const indexFileContent = prettier.format(
    `import ${pascalNewComponentName} from './${newComponentName}';
      
    export default ${pascalNewComponentName};`,
    prettierConfig
  );

  writeFile(jsxFilePath, newJsxFileContent)
    .then(() => renameFile(jsxFilePath, `${newComponentName}.jsx`))
    .then(() => shouldWriteIndex && writeFile(indexFilePath, indexFileContent))
    .then(() => hasScssfile && readFile(scssFilePath))
    .then(
      scssFileContent =>
        scssFileContent &&
        scssFileContent.replace(
          new RegExp(`\\.${componentName}( |-)`, 'g'),
          `.${newComponentName}$1`
        )
    )
    .then(
      newScssFileContent =>
        newScssFileContent && writeFile(scssFilePath, newScssFileContent)
    )
    .then(
      () => hasScssfile && renameFile(scssFilePath, `${newComponentName}.scss`)
    )
    .then(
      () =>
        shouldRenameFolder && renameFile(folderPath, newComponentName, 'folder')
    );
}
