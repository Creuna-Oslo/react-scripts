const assert = require('assert');
const fs = require('fs');
const path = require('path');

module.exports = function(filePath) {
  assert(filePath, 'No path provided.');
  assert(fs.existsSync(filePath), `File ${path.basename(filePath)} not found.`);
};
