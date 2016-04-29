# Data Vis: Audio

Playing with the Web Audio API, and hooking the results into super-fancy visualizations (hopefully).

## Tasks:

1. [x] Import Keyboard JS functions
2. [x] Refactor JS
3. [x] Set-up base markup etc.
4. [ ] Extend keyboard with visualisations
    - volume (live & over time)
    - frequency (live & over time)


## Install

Run `npm install` to set-up the Gulp environment.

Assets will be compiled into the "/assets" folder using sources in the "/uncompressed" folder.

## Usage

Run `gulp setup` to run everything and set up the initial environment.

Run `gulp` to activate the Gulp task. This watches all the files in the "/uncompressed" folder, and triggers tasks as-needed.

There are also a few standalone commands that can be run:

* `gulp staticjs` will compile just the static javascript assets.
* `gulp jslint` will run all javascript in the "/uncompressed/js/custom" folder through a JS linter.
* `gulp scsslint` will run all Sass in the "/uncompressed/scss" folder through an SCSS linter.
* `gulp test` will output a the message "testing with colour", where "colour" will appear cyan.
* `gulp svg` will compile any SVG files in the "/uncompressed/icons" folder into an SVG Sprite.
* `gulp images` optimises images in the "/uncompressed/images" folder.
* `gulp fonts` simply copies font files from "/uncompressed/fonts" to "/assets/fonts" (so we can keep all source files in one dir. and don't need to manually move them). 
* `gulp scripts` concatenates and minifies JS files, starting with "/uncompressed/js/vendor" and ending with "/uncompressed/js/custom" (to preserve source-order)
* `gulp sass` concatenates and minifies SCSS files in "/uncompressed/scss". It also runs them through Autoprefixer to apply missing browser-prefixes.