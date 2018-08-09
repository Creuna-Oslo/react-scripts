/* eslint-disable no-console */
const chalk = require('chalk');
const path = require('path');

const toStateful = require('../source/to-stateful');

const componentName = process.argv[2];

toStateful({
  filePath: path.join(
    __dirname,
    '..',
    'dist',
    componentName,
    `${componentName}.jsx`
  )
})
  .then(({ messages }) => {
    messages.forEach(({ emoji, text }) => console.log(`${emoji} ${text}`));
  })
  .catch(errorMessage => {
    console.log(chalk.redBright(errorMessage));
  });
