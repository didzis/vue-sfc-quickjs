#!/usr/bin/env deno run --allow-read=test.vue


import { loadSFC } from './vue-sfc-compiler.js'
// import { loadSFC } from './vue-sfc-compiler-bundle.js'


// load file with deno
const decoder = new TextDecoder("utf-8");
let source = decoder.decode(Deno.readFileSync('test.vue'));


const result = loadSFC(source, 'test.vue')


// import { logResult } from './test-results.js';
import logResult from './test-results.js';

logResult(result);
