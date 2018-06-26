/* eslint-env node */
/* eslint-disable no-console */
const chalk = require('chalk');
const fs = require('fs');
const path = require('path');

const removeLastSlug = require('./remove-last-slug');

// This function tries to find a react component from a full path, a path relative to 'componentsPath' or the current working directory
module.exports = function({ pathOrName, componentsPath }) {
  if (!componentsPath) {
    throw new Error('No components path provided.');
  }

  if (!pathOrName) {
    throw new Error('No component name provided.');
  }

  const slugs = pathOrName.split(path.sep);
  const lastSlug = slugs.slice(-1)[0];
  const hasFileExtension = pathOrName.indexOf('.jsx') !== -1;

  // Handle full path
  if (isFullPath(pathOrName)) {
    return validatePath({
      componentName: lastSlug.replace(/.jsx$/, ''),
      filePath: pathOrName,
      folderPath: removeLastSlug(pathOrName)
    });
  }

  // Handle path relative to 'componentsPath'
  if (isPath(pathOrName)) {
    const fullPath = path.join(componentsPath, pathOrName);
    const componentName = lastSlug.replace(/.jsx$/, '');

    return validatePath({
      componentName,
      filePath: hasFileExtension
        ? fullPath
        : path.join(fullPath, `${componentName}.jsx`),
      folderPath: hasFileExtension ? removeLastSlug(fullPath) : fullPath
    });
  }

  // Handle file in current working directory
  if (hasFileExtension) {
    return validatePath({
      componentName: lastSlug.replace(/.jsx$/, ''),
      filePath: path.join(process.cwd(), lastSlug),
      folderPath: process.cwd()
    });
  }

  // Handle component directly descending 'componentsPath'
  return validatePath({
    componentName: lastSlug,
    filePath: path.join(componentsPath, lastSlug, `${lastSlug}.jsx`),
    folderPath: path.join(componentsPath, lastSlug)
  });
};

function isFullPath(inputPath) {
  const slugs = inputPath.split(path.sep);
  const dirnameSlugs = __dirname.split(path.sep);

  return slugs && slugs[1] === dirnameSlugs[1];
}

function isPath(inputPath) {
  return inputPath.indexOf(path.sep) !== -1;
}

function validatePath({ componentName, filePath, folderPath }) {
  if (!fs.existsSync(folderPath) || !fs.existsSync(filePath)) {
    throw new Error(
      `Couldn't find component ${chalk.blueBright(componentName)}.`
    );
  }

  return { componentName, filePath, folderPath };
}
