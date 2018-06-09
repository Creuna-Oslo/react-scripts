/* eslint-env node */
/* eslint-disable no-console */
const path = require('path');

module.exports = function(somePath) {
  return somePath.substring(0, somePath.lastIndexOf(path.sep));
};
