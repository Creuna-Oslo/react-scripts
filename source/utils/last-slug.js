/* eslint-env node */
/* eslint-disable no-console */
const path = require('path');

module.exports = function(somePath) {
  return somePath.slice(somePath.lastIndexOf(path.sep) + 1);
};
