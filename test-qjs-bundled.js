#!/usr/bin/env ./qjs


// import { loadSFC } from './vue-sfc-compiler.js'
import { loadSFC } from './vue-sfc-compiler-bundle.js'


// load file with quickjs
import { loadFile } from 'std'
let source = loadFile('test.vue')


const result = loadSFC(source, 'test.vue')


// import { logResult } from './test-results.js';
import logResult from './test-results.js';

logResult(result);
