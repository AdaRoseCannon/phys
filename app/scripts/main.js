/* jshint devel:true */

var Pixi = require('./pixi_wrapper');
function preloadImage(...tileAtlas) {
	return new Promise(resolve => {
		var loader = new Pixi.AssetLoader(tileAtlas);
		loader.onComplete = resolve;
		loader.load();	
	});
}

preloadImage("images/spritesheet.json").then(() => {
	console.log('loaded');
	require('./sprite_poly_init');
}).catch(e => console.error(e.message, e.stack));
