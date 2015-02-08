var p2 = require('p2');
var Pixi = require('pixi');
var world = require('./physics');
var stage = require('./render');

module.exports = {
	rect: function (options = {}) {

		var {
			width = 2,
			height = 1,
			mass = 1,
			angularVelocity = 0
		} = options;

		var boxShape = new p2.Rectangle(width, height);
		var boxBody = new p2.Body({
			mass:mass,
			position: [0,2],
			angularVelocity: angularVelocity
		});
		boxBody.addShape(boxShape);

		var graphics = new Pixi.Graphics();
		graphics.beginFill(0xff0000);
		graphics.drawRect(-boxShape.width/2, -boxShape.height/2, boxShape.width/2, boxShape.height/2);

		require('./loop')(() => {
			graphics.position.x = boxBody.position[0];
			graphics.position.y = boxBody.position[1];
			graphics.rotation = boxBody.angle;
		});

		// ...and add the body to the world.
		// If we don't add it to the world, it won't be simulated.
		world.addBody(boxBody);
		stage.addChild(graphics);
		return boxBody;
	},

	circle: function (options = {}) {

		var {
			radius = 1,
			mass = 1,
			angularVelocity = 0
		} = options;

		var boxShape = new p2.Circle(radius);
		var boxBody = new p2.Body({
			mass:mass,
			position:[0,2],
			angularVelocity:angularVelocity
		});
		boxBody.addShape(boxShape);

		var graphics = new Pixi.Graphics();
		graphics.beginFill(0xff0000);
		graphics.drawRect(-radius, -radius, radius, radius);

		require('./loop')(() => {
			graphics.position.x = boxBody.position[0];
			graphics.position.y = boxBody.position[1];
			graphics.rotation = boxBody.angle;
		});

		// ...and add the body to the world.
		// If we don't add it to the world, it won't be simulated.
		world.addBody(boxBody);
		stage.addChild(graphics);
	}
};