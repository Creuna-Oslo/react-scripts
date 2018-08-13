/* eslint-disable no-console */
const chalk = require('chalk');
const path = require('path');

const toStateless = require('../source/to-stateless');

const componentName = process.argv[2];

// The stateful component created by newComponent has a reference to state in it which means toStateless will fail. The easiest way to get a testable stateful component is to create a stateless one and then convert it to stateful 😅
toStateless({
  basePath: path.join(
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
