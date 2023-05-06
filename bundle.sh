#!/bin/sh

[ ! -f esbuild ] && curl -fsSL https://esbuild.github.io/dl/latest | sh

([ ! -d node_modules ] || [ ! -d node_modules/@vue/compiler-sfc ]) && npm install

[ ! -f compiler-sfc.esm-browser.js ] && cp node_modules/@vue/compiler-sfc/dist/compiler-sfc.esm-browser.js compiler-sfc.esm-browser.js

# diff -q node_modules/@vue/compiler-sfc/dist/compiler-sfc.esm-browser.js compiler-sfc.esm-browser.js || cp node_modules/@vue/compiler-sfc/dist/compiler-sfc.esm-browser.js compiler-sfc.esm-browser.js

./esbuild --bundle --platform=browser --format=esm --outfile=vue-sfc-compiler-bundle.js vue-sfc-compiler.js
# npx esbuild --bundle --platform=browser --format=esm --outfile=vue-sfc-compiler-bundle.js vue-sfc-compiler.js

