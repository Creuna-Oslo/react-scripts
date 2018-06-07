const chalk = require('chalk');
const differ = require('diff');

module.exports = function(before, after) {
  const diff = differ.diffLines(before, after);

  diff.forEach(part => {
    if (part.added) {
      process.stdout.write(chalk.bgGreenBright(part.value));
    } else if (part.removed) {
      process.stdout.write(chalk.bgRedBright(part.value));
    } else {
      process.stdout.write(part.value);
    }
  });

  process.stdout.write('\n');
};
