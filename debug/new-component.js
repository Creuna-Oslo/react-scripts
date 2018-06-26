/* eslint-disable no-console */
const chalk = require('chalk');
const path = require('path');

const newComponent = require('../source/new-component');

newComponent({
  componentsPath: path.join(__dirname, '..', 'dist'),
  pathOrName: process.argv[2] || 'test-component',
  shouldBeStateful: process.argv.indexOf('-s') !== -1
})
  .then(({ messages }) => {
    messages.forEach(({ emoji, text }) => console.log(`${emoji} ${text}`));
  })
  .catch(errorMessage => {
    console.log(chalk.redBright(errorMessage));
  });
