/* eslint-env node */
const path = require('path');

module.exports = function(somePath) {
  return somePath.slice(somePath.lastIndexOf(path.sep) + 1);
};
