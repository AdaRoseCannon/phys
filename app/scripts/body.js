var p2 = require('p2');
var world = require('./physics');
var Pixi = require('pixi');
var stage = require('./render');

module.exports.addNewBody = function addNewBody(id, {
	mass = 0,
	scale = 1
}) {
	var sprite = Pixi.Sprite.fromFrame(id);
	sprite.anchor.x = 0.5;
	sprite.anchor.y = 0.5;
	sprite.scale.x = scale;
	sprite.scale.y = -scale;
	stage.addChild(sprite);

	var body = new p2.Body({
		mass: mass,
		position: [0,0],
		angularVelocity: 0
	});

	body.addShape(new p2.Rectangle(Math.abs(sprite.width), Math.abs(sprite.height)));

	require('./loop')(() => {
		sprite.position.x = body.position[0];
		sprite.position.y = body.position[1];
		sprite.rotation = body.angle;
	});

	world.addBody(body);
	body.sprite = sprite;
	return body;
};