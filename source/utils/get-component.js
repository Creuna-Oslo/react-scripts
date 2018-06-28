/* eslint-env node */
const chalk = require('chalk');
const fs = require('fs');
const path = require('path');

const removeLastSlug = require('./remove-last-slug');

// This function tries to find a react component from a full path, a path relative to 'componentsPath' or the current working directory
module.exports = function({ pathOrName, componentsPath }) {
  if (!pathOrName) {
    throw new Error('No component name or path provided.');
  }

  const slugs = pathOrName.split(path.sep);
  const lastSlug = slugs.slice(-1)[0];
  const hasFileExtension = pathOrName.indexOf('.jsx') !== -1;
  const isPath = pathOrName.indexOf(path.sep) !== -1;
  const componentName = lastSlug.replace(/.jsx$/, '');
  const componentNotFoundError = new Error(
    `Couldn't find component ${chalk.blueBright(componentName)}.`
  );

  // Handle full path
  if (isFullPath(pathOrName)) {
    const filePath = pathOrName;
    const folderPath = removeLastSlug(pathOrName);

    if (fs.existsSync(filePath)) {
      return { componentName, filePath, folderPath };
    } else {
      throw componentNotFoundError;
    }
  }

  // Handle file in current working directory
  if (!isPath && hasFileExtension) {
    const filePath = path.join(process.cwd(), lastSlug);
    const folderPath = process.cwd();

    if (fs.existsSync(filePath)) {
      return { componentName, filePath, folderPath };
    } else {
      throw componentNotFoundError;
    }
  }

  // If pathOrName is not a path or a file in CWD, componentsPath is required
  if (!componentsPath) {
    throw new Error('No components path provided.');
  }

  // Handle path relative to 'componentsPath' with file extension
  if (isPath && hasFileExtension) {
    const fullPath = path.join(componentsPath, pathOrName);
    const filePath = fullPath;
    const folderPath = removeLastSlug(fullPath);

    if (fs.existsSync(filePath)) {
      return { componentName, filePath, folderPath };
    } else {
      throw componentNotFoundError;
    }
  }

  // Handle path relative to 'componentsPath' without file extension
  if (isPath) {
    const fullPath = path.join(componentsPath, pathOrName);
    const filePath = path.join(fullPath, `${componentName}.jsx`);
    const folderPath = fullPath;

    if (fs.existsSync(filePath)) {
      return { componentName, filePath, folderPath };
    } else {
      throw componentNotFoundError;
    }
  }

  // Handle component directly descending 'componentsPath' where folder name and jsx file name match
  const filePath = path.join(componentsPath, lastSlug, `${lastSlug}.jsx`);
  const folderPath = path.join(componentsPath, lastSlug);

  if (fs.existsSync(filePath)) {
    return { componentName, filePath, folderPath };
  } else {
    throw componentNotFoundError;
  }
};

function isFullPath(inputPath) {
  const slugs = inputPath.split(path.sep);
  const dirnameSlugs = __dirname.split(path.sep);

  return slugs && slugs[1] === dirnameSlugs[1];
}
