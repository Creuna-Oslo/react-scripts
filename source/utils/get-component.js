/* eslint-env node */
const chalk = require('chalk');
const fs = require('fs');
const path = require('path');

// This function tries to find a react component from a full path, a path relative to 'componentsPath' or the current working directory
module.exports = function({ componentsPath, cwd = process.cwd(), pathOrName }) {
  if (!pathOrName) {
    throw new Error('No component name or path provided.');
  }

  if (componentsPath && !path.isAbsolute(componentsPath)) {
    throw new Error(
      `Bad 'componentsPath' (${componentsPath}). Path must be absolute`
    );
  }

  const basePath = componentsPath || cwd;
  const pathWithoutExtension = pathOrName.replace(/\.jsx$/, '');
  const pathWithExtension = `${pathOrName}.jsx`;
  const baseName = path.basename(pathOrName, '.jsx');
  const fileName = `${baseName}.jsx`;

  // List of possible paths for the jsx file. The first matching file will be used.
  const pathVariations = [
    pathOrName,

    // component.jsx -> <basePath>/component.jsx
    path.join(basePath, pathOrName),

    // component -> <basePath>/component.jsx
    path.join(basePath, pathWithExtension),

    // component.jsx -> <basePath>/component/component.jsx
    path.join(basePath, pathWithoutExtension, fileName)
  ];

  const filePath = pathVariations.find(
    filePath => fs.existsSync(filePath) && path.extname(filePath) === '.jsx'
  );

  if (filePath) {
    return {
      componentName: path.basename(filePath, '.jsx'),
      filePath,
      folderPath: path.dirname(filePath)
    };
  }

  throw new Error(
    `Couldn't find component ${chalk.blueBright(path.basename(pathOrName))}.`
  );
};
