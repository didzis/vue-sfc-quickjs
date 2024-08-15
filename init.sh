#!/bin/sh

# download esbuild
[ ! -f esbuild ] && curl -fsSL https://esbuild.github.io/dl/latest | sh

# get quickjs
[ ! -d quickjs ] && git submodule update

# compile quickjs
[ ! -f quickjs/qjs ] && (cd quickjs; make)

# symlink qjs
[ ! -f qjs ] && ln -s quickjs/qjs qjs

# install node packages, i.e., compiler-sfc
([ ! -d node_modules ] || [ ! -d node_modules/@vue/compiler-sfc ]) && npm install || :
