/* eslint-disable no-console */
const chalk = require('chalk');
const path = require('path');

const toStateless = require('../source/to-stateless');

// The stateful component created by newComponent has a reference to state in it which means toStateless will fail. The easiest way to get a testable stateful component is to create a stateless one and then convert it to stateful 😅
toStateless({
  basePath: path.join(__dirname, '..', 'dist'),
  pathOrName: process.argv[2] || 'test-component'
})
  .then(({ messages }) => {
    messages.forEach(({ emoji, text }) => console.log(`${emoji} ${text}`));
  })
  .catch(errorMessage => {
    console.log(chalk.redBright(errorMessage));
  });
