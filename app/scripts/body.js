const p2 = require('p2');
const world = require('./physics');
const Pixi = require('./pixi_wrapper');
const stage = require('./render');
const tris = require('./triangulate');

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

	var body = new p2.Body({
		mass: mass,
		position: [0,0],
		angularVelocity: 0
	});

	if (shape === null && convex !== null) {
		tris(convex).forEach(t => {
			let shape = new p2.Convex(t.map(a => a.map(b => b*scale)));
			shape.updateArea();
			shape.updateCenterOfMass();
			body.addShape(shape);
		});
	} else if (shape === null) {
		shape = new p2.Rectangle(Math.abs(sprite.width), Math.abs(sprite.height));
		body.addShape(shape);
	} else {
		body.addShape(shape);
	}

	require('./loop')(() => {
		sprite.position.x = body.position[0];
		sprite.position.y = body.position[1];
		sprite.rotation = body.angle;
	});

	world.addBody(body);
	body.sprite = sprite;
	return body;
};