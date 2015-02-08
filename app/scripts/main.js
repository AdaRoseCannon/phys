/* jshint devel:true */

var Pixi = require('pixi');
var Matter = require('matter-js');

function preloadImage(url) {
	return new Promise(function (resolve, reject) {
		var i = new Image();
		i.src = url;
		i.onload = () => {
			resolve(i);
		};
		i.onerror = reject;
	});
}

function begin() {

	document.body.innerHTML = '';
	var renderer = Pixi.autoDetectRenderer(300, 400);
	document.body.appendChild(renderer.view);
	renderer.view.classList.add('stage');
	var stage = new Pixi.Stage(0x66FF99);

	var texture1 = Pixi.Texture.fromImage("images/sprite1.png");
	var p1 = new Pixi.Sprite(texture1);
	p1.position.x = 0;
	p1.position.y = 0;
	p1.scale.x = 0.2;
	p1.scale.y = 0.2;
	stage.addChild(p1);
	require('./renderloop')(() => renderer.render(stage));
}

Promise.all([
	preloadImage("images/sprite1.png")
]).then(begin);
