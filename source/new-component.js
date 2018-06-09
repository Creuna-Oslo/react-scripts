/* eslint-env node */
/* eslint-disable no-console */
const chalk = require('chalk');
const path = require('path');
const prettier = require('prettier');

const createFolder = require('./utils/create-folder');
const ensureEmptyFolder = require('./utils/ensure-empty-folder');
const generateIndexFile = require('./templates/generate-index-file');
const getConfigs = require('./utils/get-configs');
const lastSlug = require('./utils/last-slug');
const prompt = require('./utils/prompt');
const readFile = require('./utils/read-file');
const renameTransform = require('./transforms/rename-jsx');
const writeFile = require('./utils/write-file');

module.exports = function(pathOrName, shouldBeStateful) {
  getConfigs(({ prettierConfig, componentsPath }) => {
    prompt(
      {
        pathOrName: {
          text: 'Name of component',
          value: pathOrName
        },
        shouldBeStateful: {
          text: 'Should component have state?',
          type: Boolean,
          value: shouldBeStateful
        }
      },
      ({ pathOrName, shouldBeStateful }) => {
        createComponent({
          componentsPath,
          shouldBeStateful,
          pathOrName,
          prettierConfig
        });
      }
    );
  });
};

function createComponent({
  componentsPath,
  shouldBeStateful,
  pathOrName,
  prettierConfig
}) {
  const isPath = pathOrName.indexOf(path.sep) !== -1;
  const componentName = isPath ? lastSlug(pathOrName) : pathOrName;
  const folderPath = path.join(componentsPath, pathOrName);
  const indexFilePath = path.join(folderPath, 'index.js');
  const jsxFilePath = path.join(folderPath, `${componentName}.jsx`);
  const scssFilePath = path.join(folderPath, `${componentName}.scss`);

  ensureEmptyFolder(folderPath);

  console.log(
    `⚙️  Generating ${
      shouldBeStateful ? 'stateful' : 'stateless'
    } ${chalk.blueBright(componentName)}`
  );

  const templates = {
    stateful: path.join(__dirname, './templates/stateful-component.jsx'),
    stateless: path.join(__dirname, './templates/stateless-component.jsx')
  };

  const indexFileContent = prettier.format(
    generateIndexFile(componentName),
    prettierConfig
  );

  createFolder(folderPath)
    .then(() =>
      readFile(shouldBeStateful ? templates.stateful : templates.stateless)
    )
    .then(jsxFileContent =>
      // Hard coded string name because that's what the template components are called
      prettier.format(
        renameTransform(jsxFileContent, 'component', componentName),
        prettierConfig
      )
    )
    .then(newJsxFileContent => {
      writeFile(jsxFilePath, newJsxFileContent);
      writeFile(scssFilePath, `.${componentName} {}`);
      writeFile(indexFilePath, indexFileContent);
    });
}
