/* eslint-env node */
const assert = require('assert');
const chalk = require('chalk');
const fs = require('fs');
const fsExtra = require('fs-extra');
const kebabToPascal = require('@creuna/utils/kebab-to-pascal').default;
const path = require('path');
const prettier = require('prettier');
const t = require('@babel/types');

const ensureEmptyFolder = require('./utils/ensure-empty-folder');
const getConfigs = require('./utils/get-configs');
const writeFile = require('./utils/write-file');
const generateComponent = require('./templates/static-site-page');

const dataFileTemplates = {
  json: '{}',
  js: 'export default {};'
};

module.exports = function({
  componentName,
  dataFileExtension = 'json',
  dataFileContent,
  eslintConfig,
  folderPath,
  groupName,
  humanReadableName,
  template, // Expecting an array
  url
}) {
  return new Promise(async (resolve, reject) => {
    const { prettierConfig } = getConfigs(eslintConfig);

    try {
      assert(folderPath, 'No path provided.');
      assert(componentName, 'No page name provided.');
      assert(fs.existsSync(folderPath), `Path '${folderPath}' does not exist.`);

      const componentPath = path.join(folderPath, componentName);
      const dataFilePath = path.join(
        componentPath,
        `${componentName}.${dataFileExtension}`
      );
      const jsxFilePath = path.join(componentPath, `${componentName}.jsx`);

      const replacements = {
        componentName: t.identifier(kebabToPascal(componentName)),
        dataFilePath: t.stringLiteral(`./${componentName}.${dataFileExtension}`)
      };
      const componentSource = generateComponent(
        replacements,
        Array.isArray(template) ? template.join('\n') : template
      );

      const frontmatter =
        `/*\n` +
        (groupName ? `group: ${groupName}\n` : '') +
        (humanReadableName ? `name: ${humanReadableName}\n` : '') +
        (url ? `path: ${url}\n` : '') +
        `*/\n\n`;

      const jsxFileContent = prettier.format(
        frontmatter + componentSource,
        prettierConfig
      );

      const staticDataFileContent =
        dataFileContent || dataFileTemplates[dataFileExtension] || '';

      ensureEmptyFolder(componentPath);
      await fsExtra.ensureDir(componentPath);

      const messages = [
        writeFile(jsxFilePath, jsxFileContent),
        writeFile(dataFilePath, staticDataFileContent)
      ];

      resolve({
        messages: messages.concat({
          emoji: '🎉',
          text: `Created page ${chalk.greenBright(componentName)}`
        })
      });
    } catch (error) {
      reject(error.message);
    }
  });
};
