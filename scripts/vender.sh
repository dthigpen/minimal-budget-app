#!/usr/bin/env bash

set -o errexit
set -o nounset
set -o pipefail
set -x

# vender css
rm -rf public/css/vender
mkdir -p public/css/vender

# copy from node_modules
cp node_modules/@picocss/pico/css/pico.min.css public/css/vender/pico.min.css

# copy from libs
# skeleton css
# cp libs/css/{normalize,skeleton}.css public/css/vender/

# vender js
rm -rf public/js/vender
mkdir -p public/js/vender

cp node_modules/vanjs-core/src/{van,van.debug}.js public/js/vender/
cp node_modules/vanjs-ui/dist/van-ui.js public/js/vender/
sed -i 's/vanjs-core/.\/van.js/g' public/js/vender/van-ui.js

cp node_modules/vanjs-ext/src/van-x.js public/js/vender/
sed -i 's/vanjs-core/.\/van.js/g' public/js/vender/van-x.js

