/* eslint-disable no-console */
const chalk = require('chalk');
const path = require('path');

const newComponent = require('../source/new-component');
const toStateless = require('../source/to-stateless');
const toStateful = require('../source/to-stateful');

const componentsPath = path.join(__dirname, '..', 'dist');

newComponent({
  componentsPath,
  pathOrName: process.argv[2] || 'test-component',
  shouldBeStateful: false
})
  .then(() =>
    // The stateful component created by newComponent has a reference to state in it which means toStateless will fail. The easiest way to get a testable stateful component is to create a stateless one and then convert it to stateful 😅
    toStateful({
      componentsPath,
      pathOrName: 'test-component'
    })
  )
  .then(() =>
    toStateless({
      componentsPath,
      pathOrName: 'test-component'
    })
  )
  .then(({ messages }) => {
    messages.forEach(({ emoji, text }) => console.log(`${emoji} ${text}`));
  })
  .catch(errorMessage => {
    console.log(chalk.redBright(errorMessage));
  });
