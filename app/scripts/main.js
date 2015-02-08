/* jshint devel:true */

var sprites = require('./sprite');
var Pixi = require('pixi');

function preloadImage(url) {
	return new Promise(function (resolve, reject) {
		var i = new Image();
		i.src = url;
		i.onload = () => {
			resolve(sprites.addSprite('sprite1', url));
		};
		i.onerror = reject;
	});
}

Promise.all([
	preloadImage("images/sprite2.png")
]).then((sprites) => {
	var stage = require('./render');
	require('./physics');

	var texture = new Pixi.Texture.fromImage("images/sprite2.png");
	var container = new Pixi.DisplayObjectContainer();
	var sprite = new Pixi.Sprite(texture);
	sprite.anchor = 0.5;
	sprite.anchor.y = 0.5;

	stage.addChild(sprite);

	// var Body = require('./body');
	// new Body.fromSprite({
	// 	mass: 0.2,
	// 	sprite: sprites[0]
	// });
	// var b = new Body.fromSprite({
	// 	mass: 0,
	// 	width: 5,
	// 	sprite: sprites[0]
	// }).body;
	// b.position = [-1.5, -5];
	// b.angle = 0.1;
});
