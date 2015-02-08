var p2 = require('p2');
var Pixi = require('pixi');
var world = require('./physics');
var stage = require('./render');

class Item {
	constructor({
		body = null,
		sprite = null
	}) {

		if (!body || !sprite) {
			throw Error('Missing body or sprite options');
		}

		require('./loop')(() => {
			sprite.sprite.position.x = body.position[0];
			sprite.sprite.position.y = body.position[1];
			sprite.sprite.rotation = body.angle;
		});

		world.addBody(body);
		stage.addChild(sprite.sprite);

		this.body = body;
	}
}

module.exports = {
	fromSprite: function ({
			mass = 1,
			angularVelocity = 0,
			sprite = null,
		}) {

		var boxShape = new p2.Rectangle(sprite.sprite.width, sprite.sprite.height);
		var boxBody = new p2.Body({
			mass:mass,
			position: [0,0],
			angularVelocity: angularVelocity
		});
		boxBody.addShape(boxShape);

		if (!sprite) {
			throw Error('No Sprite!');
		}

		return new Item({
			body: boxBody,
			sprite: sprite
		});
	}
};