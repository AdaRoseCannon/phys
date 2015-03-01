var p2 = require('p2');
var world = require('./physics');
var Pixi = require('./pixi_wrapper');
var stage = require('./render');

module.exports.addNewBody = function addNewBody({
	id = null,
	sprite = null,
	mass = 0,
	scale = 1,
	shape = null,
	convex = null
}) {
	if (sprite === null && id !== null) {
		sprite = Pixi.Sprite.fromFrame(id);
		sprite.anchor.x = 0.5;
		sprite.anchor.y = 0.5;
		stage.addChild(sprite);
	}
	sprite.scale.x = scale;
	sprite.scale.y = -scale;

	if (shape === null && convex !== null) {

		shape = new p2.Convex(convex.map(a => a.map(b => b*scale)));
		shape.updateArea();
		shape.updateCenterOfMass();
		if (!shape.centerOfMass[0]) throw Error('Points can\'t define center of mass');
	} else if (shape === null) {
		shape = new p2.Rectangle(Math.abs(sprite.width), Math.abs(sprite.height));
	}

	var body = new p2.Body({
		mass: mass,
		position: [0,0],
		angularVelocity: 0
	});

	body.addShape(shape);

	require('./loop')(() => {
		sprite.position.x = body.position[0];
		sprite.position.y = body.position[1];
		sprite.rotation = body.angle;
	});

	world.addBody(body);
	body.sprite = sprite;
	return body;
};