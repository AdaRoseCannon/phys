/* jshint devel:true */

var Pixi = require('./lib/pixi_wrapper');
function preloadImage(...tileAtlas) {
	return new Promise(resolve => {
		var loader = new Pixi.loaders.Loader();
		tileAtlas.forEach(s => loader.add(s));
		loader.on('complete', resolve);
		loader.load();
	});
}

preloadImage("images/spritesheet.json").then(() => {
	console.log('loaded');
	require('./lib/sprite_poly_init');
}).catch(e => setTimeout(function () { throw e }));

$.material.init();