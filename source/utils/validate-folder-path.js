const assert = require('assert');
const fs = require('fs');
const path = require('path');

module.exports = function(folderPath) {
  assert(folderPath, 'No path provided.');
  assert(
    fs.existsSync(folderPath),
    `Folder ${path.basename(folderPath)} not found.`
  );
};
