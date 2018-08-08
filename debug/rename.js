/* eslint-disable no-console */
const chalk = require('chalk');
const path = require('path');

const rename = require('../source/rename');

rename({
  basePath: path.join(__dirname, '..', 'dist'),
  newComponentName: process.argv[3] || 'new-component',
  pathOrName: process.argv[2] || 'test-component'
})
  .then(({ messages }) => {
    messages.forEach(({ emoji, text }) => console.log(`${emoji} ${text}`));
  })
  .catch(errorMessage => {
    console.log(chalk.redBright(errorMessage));
  });
