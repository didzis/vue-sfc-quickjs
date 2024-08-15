#!/usr/bin/env node


// import { loadSFC } from './vue-sfc-compiler.js'
import { loadSFC } from './vue-sfc-compiler-bundle.js'


// load file with node.js
import { readFileSync } from 'fs'
let source = readFileSync('test.vue', { encoding: 'utf8' })


const result = loadSFC(source, 'test.vue')


// import { logResult } from './test-results.js';
import logResult from './test-results.js';

logResult(result);
