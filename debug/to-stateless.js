/* eslint-disable no-console */
const chalk = require('chalk');
const fsExtra = require('fs-extra');
const path = require('path');
const tempy = require('tempy');

const toStateless = require('../source/to-stateless');

const dir = tempy.directory();

fsExtra.copyFileSync(
  path.join(
    __dirname,
    '..',
    'fixtures',
    'component-stateful',
    'component-stateful.jsx'
  ),
  path.join(dir, 'component-stateful.jsx')
);

toStateless({
  filePath: path.join(dir, 'component-stateful.jsx')
})
  .then(({ messages }) => {
    messages.forEach(({ emoji, text }) => console.log(`${emoji} ${text}`));
  })
  .catch(errorMessage => {
    console.log(chalk.redBright(errorMessage));
  });
