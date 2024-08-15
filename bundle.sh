#!/bin/sh

./init.sh || exit 1

# copy compiler-sfc browser version to working directory
([ ! -f compiler-sfc.esm-browser.js ] || [ node_modules/@vue/compiler-sfc/dist/compiler-sfc.esm-browser.js -nt compiler-sfc.esm-browser.js ]) && \
    cp node_modules/@vue/compiler-sfc/dist/compiler-sfc.esm-browser.js compiler-sfc.esm-browser.js

# diff -q node_modules/@vue/compiler-sfc/dist/compiler-sfc.esm-browser.js compiler-sfc.esm-browser.js || cp node_modules/@vue/compiler-sfc/dist/compiler-sfc.esm-browser.js compiler-sfc.esm-browser.js

if [ vue-sfc-compiler.js -nt vue-sfc-compiler-bundle.js ]; then
    # bundle compiler-sfc
    ./esbuild --bundle --platform=browser --format=esm --outfile=vue-sfc-compiler-bundle.js vue-sfc-compiler.js
    # npx esbuild --bundle --platform=browser --format=esm --outfile=vue-sfc-compiler-bundle.js vue-sfc-compiler.js
else
    :
fi
