const fs = require('fs');
const path = require('path');

const fixturesPath = path.resolve(__dirname, '..', '..', 'fixtures');

const readFile = filePath => fs.readFileSync(filePath, 'utf8');
const readFixture = relativePath =>
  readFile(path.resolve(fixturesPath, relativePath));

module.exports = {
  readFile,
  readFixture
};
