#!/usr/bin/env node
const newComponent = require('../source/new-page');
const shouldBeStateful = process.argv.indexOf('-s') !== -1 ? true : undefined;

newComponent(process.argv[2], shouldBeStateful);
