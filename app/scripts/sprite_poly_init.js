var Pixi = require('pixi');
const stage = require('./render');
const p2 = require('p2');
const id = 'sprites/bear/bear1.png';

stage.setZoom(1);

var sprite = Pixi.Sprite.fromFrame(id);
sprite.anchor.x = 0.5;
sprite.anchor.y = 0.5;
sprite.scale.y = -1;
stage.addChild(sprite);
window.stage = stage;
window.Pixi = Pixi;
stage.parent.interactionManager.onMouseDown = (e) => {
	console.log({x: e.x, y: e.y});
};