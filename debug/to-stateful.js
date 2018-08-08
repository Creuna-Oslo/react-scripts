/* eslint-disable no-console */
const chalk = require('chalk');
const path = require('path');

const toStateful = require('../source/to-stateful');

toStateful({
  basePath: path.join(__dirname, '..', 'dist'),
  pathOrName: process.argv[2] || 'test-component'
})
  .then(({ messages }) => {
    messages.forEach(({ emoji, text }) => console.log(`${emoji} ${text}`));
  })
  .catch(errorMessage => {
    console.log(chalk.redBright(errorMessage));
  });
