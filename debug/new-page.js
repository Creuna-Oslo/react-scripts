/* eslint-disable no-console */
const chalk = require('chalk');
const path = require('path');

const newPage = require('../source/new-page');

newPage({
  componentName: process.argv[2] || 'test-page',
  folderPath: path.join(__dirname, '..', 'dist'),
  humanReadableName: process.argv[3]
})
  .then(({ messages }) => {
    messages.forEach(({ emoji, text }) => console.log(`${emoji} ${text}`));
  })
  .catch(errorMessage => {
    console.log(chalk.redBright(errorMessage));
  });
