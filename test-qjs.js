






// ============================================

// import { loadSFC } from './vue-sfc-compiler.js'
import { loadSFC } from './vue-sfc-compiler-bundle.js'


// load file with quickjs
import * as std from 'std'
let source = std.loadFile('test.vue')


const result = loadSFC(source, 'test.vue')

console.log('-------RESULT------')
console.log(result)

console.log('-------SCRIPT------')
console.log(result.script.content)
console.log('-------TEMPLATE------')
console.log(result.template.code)
console.log('-------STYLES------')
console.log(result.styles)
console.log('-------MAIN------')
console.log(result.code)
