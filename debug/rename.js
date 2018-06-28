/* eslint-disable no-console */
const chalk = require('chalk');
const path = require('path');

const newComponent = require('../source/new-component');
const rename = require('../source/rename');

const componentsPath = path.join(__dirname, '..', 'dist');

newComponent({
  componentsPath,
  pathOrName: process.argv[2] || 'test-component',
  shouldBeStateful: false
})
  .then(() =>
    rename({
      componentsPath,
      newComponentName: process.argv[3] || 'new-component',
      pathOrName: 'test-component'
    })
  )
  .then(({ messages }) => {
    messages.forEach(({ emoji, text }) => console.log(`${emoji} ${text}`));
  })
  .catch(errorMessage => {
    console.log(chalk.redBright(errorMessage));
  });
