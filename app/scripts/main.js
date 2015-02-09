/* jshint devel:true */

var Pixi = require('pixi');

function preloadImage(tileAtlas) {
	return new Promise(function (resolve) {
		var loader = new Pixi.AssetLoader(tileAtlas);
		loader.onComplete = resolve;
		loader.load();	
	});
}

Promise.all([
	preloadImage(["images/spritesheet-0.json"])
]).then(() => {

	var Body = require('./body');

	Body.addNewBody('sprites/bear/bear1.png', {
		scale: 0.005,
		mass: 1
	}).position = [3, 2];

	var staticBody = Body.addNewBody('sprites/bear/bear1.png', {
		scale: 0.005,
		mass: 0
	});

	staticBody.position[1] = -2;
}).catch((e) => console.error(e.stack));
