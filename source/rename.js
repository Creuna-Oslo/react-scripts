/* eslint-env node */
/* eslint-disable no-console */
const chalk = require('chalk');
const fs = require('fs');
const kebabToPascal = require('@creuna/utils/kebab-to-pascal').default;
const prettier = require('prettier');
const path = require('path');

const ensureComponentExists = require('./utils/ensure-component-exists');
const ensureEmptyFolder = require('./utils/ensure-empty-folder');
const getConfigs = require('./utils/get-configs');
const prompt = require('./utils/prompt');
const renameJSXTransform = require('./transforms/rename-jsx');

module.exports = function(componentName, newComponentName) {
  getConfigs(({ prettierConfig, componentsPath }) => {
    prompt(
      {
        componentName: {
          text: 'Name of component',
          value: componentName
        },
        newComponentName: {
          text: 'New name of component',
          value: newComponentName
        }
      },
      ({ componentName, newComponentName }) => {
        renameComponent({
          componentName,
          componentsPath,
          newComponentName,
          prettierConfig
        });
      }
    );
  });
};

function renameComponent({
  componentName,
  componentsPath,
  newComponentName,
  prettierConfig
}) {
  const pascalNewComponentName = kebabToPascal(newComponentName);

  const indexFilename = 'index.js';
  const jsxFilename = `${componentName}.jsx`;
  const scssFilename = `${componentName}.scss`;

  const folderPath = path.join(componentsPath, componentName);
  const newFolderPath = path.join(componentsPath, newComponentName);

  ensureComponentExists(folderPath, componentName);
  ensureEmptyFolder(newFolderPath, newComponentName);

  const jsxFileContent = fs.readFileSync(path.join(folderPath, jsxFilename), {
    encoding: 'utf-8'
  });

  const newJsxFileContent = renameJSXTransform(
    jsxFileContent,
    componentName,
    newComponentName
  );

  fs.writeFileSync(
    path.join(folderPath, jsxFilename),
    prettier.format(newJsxFileContent, prettierConfig)
  );
  console.log(`💾  ${chalk.blueBright(jsxFilename)} written`);

  fs.writeFileSync(
    path.join(folderPath, indexFilename),
    prettier.format(
      `import ${pascalNewComponentName} from './${newComponentName}';
    
    export default ${pascalNewComponentName};`,
      prettierConfig
    )
  );
  console.log(`💾  ${chalk.blueBright(indexFilename)} written`);

  // Overwrite index.js file with new component name
  const newJsxFilename = `${newComponentName}.jsx`;
  fs.renameSync(
    path.join(folderPath, jsxFilename),
    path.join(folderPath, newJsxFilename)
  );
  console.log(
    `💾  ${chalk.blueBright(jsxFilename)} renamed to ${chalk.blueBright(
      newJsxFilename
    )}`
  );

  // Rename scss file and class names if it exists
  if (fs.existsSync(path.join(folderPath, scssFilename))) {
    // Replace selectors
    const scssFileContent = fs.readFileSync(
      path.join(folderPath, scssFilename),
      {
        encoding: 'utf-8'
      }
    );
    const scssRegex = new RegExp(`\\.${componentName}( |-)`, 'g');
    const newScssFileContent = scssFileContent.replace(
      scssRegex,
      `.${newComponentName}$1`
    );

    fs.writeFileSync(path.join(folderPath, scssFilename), newScssFileContent);
    console.log(`💾  ${chalk.blueBright(scssFilename)} written`);

    const newScssFilename = `${newComponentName}.scss`;
    fs.renameSync(
      path.join(folderPath, scssFilename),
      path.join(folderPath, newScssFilename)
    );
    console.log(
      `💾  ${chalk.blueBright(scssFilename)} renamed to ${chalk.blueBright(
        newScssFilename
      )}`
    );
  }

  // Rename component folder
  fs.rename(folderPath, newFolderPath, err => {
    if (err) {
      console.log(`👻  ${chalk.red('Error renaming folder')}`, err);

      process.exit(1);
    }

    console.log(
      `💾  folder ${chalk.blueBright(
        componentName
      )} renamed to ${chalk.blueBright(chalk.blueBright(newComponentName))}`
    );
  });
}
