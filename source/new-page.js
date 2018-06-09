/* eslint-env node */
/* eslint-disable no-console */
const chalk = require('chalk');
const fs = require('fs');
const fsExtra = require('fs-extra');
const kebabToPascal = require('@creuna/utils/kebab-to-pascal').default;
const path = require('path');
const prettier = require('prettier');

const createFolder = require('./utils/create-folder');
const ensureEmptyFolder = require('./utils/ensure-empty-folder');
const getConfigs = require('./utils/get-configs');
const prompt = require('./utils/prompt');
const renameJSXTransform = require('./transforms/rename-jsx');
const writeFile = require('./utils/write-file');

module.exports = function(componentName, humanReadableName) {
  getConfigs(({ prettierConfig, mockupPath }) => {
    prompt(
      {
        componentName: { text: 'Name of page', value: componentName },
        humanReadableName: {
          optional: true,
          text: 'Human readable name (optional)',
          value: humanReadableName
        }
      },
      ({ componentName, humanReadableName }) => {
        createMockupPage({
          componentName,
          humanReadableName,
          mockupPath,
          prettierConfig
        });
      }
    );
  });
};

function createMockupPage({
  componentName,
  humanReadableName,
  mockupPath,
  prettierConfig
}) {
  const folderPath = path.join(mockupPath, componentName);
  const indexFilename = 'index.js';
  const jsonFilename = `${componentName}.json`;
  const jsxFilename = `${componentName}.jsx`;
  const pascalComponentName = kebabToPascal(componentName);

  fsExtra.ensureDirSync(mockupPath);
  ensureEmptyFolder(folderPath, componentName);

  console.log(`⚙️  Generating ${chalk.blueBright(componentName)}`);

  const templateContent = fs.readFileSync(
    path.join(__dirname, 'templates/mockup-page.jsx'),
    { encoding: 'utf-8' }
  );

  const jsxFileContent = prettier.format(
    `// ${humanReadableName || pascalComponentName}\n` +
      renameJSXTransform(templateContent, 'Component', componentName),
    prettierConfig
  );

  const indexFileContent = prettier.format(
    `import ${pascalComponentName} from './${componentName}';
    export default ${pascalComponentName};`,
    prettierConfig
  );

  createFolder(folderPath)
    .then(() => writeFile(folderPath, jsxFilename, jsxFileContent))
    .then(() => writeFile(folderPath, jsonFilename, '{}'))
    .then(() => writeFile(folderPath, indexFilename, indexFileContent));
}
