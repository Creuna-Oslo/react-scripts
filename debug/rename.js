/* eslint-disable no-console */
const chalk = require('chalk');
const path = require('path');

const rename = require('../source/rename');

const componentName = process.argv[2];

rename({
  filePath: path.join(
    __dirname,
    '..',
    'dist',
    componentName,
    `${componentName}.jsx`
  ),
  newComponentName: process.argv[3] || 'new-component'
})
  .then(({ messages }) => {
    messages.forEach(({ emoji, text }) => console.log(`${emoji} ${text}`));
  })
  .catch(errorMessage => {
    console.log(chalk.redBright(errorMessage));
  });
