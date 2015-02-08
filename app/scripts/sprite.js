var Pixi = require('pixi');
var sprites = {};

class AdaSprite {
	constructor (url, points = []) {
		var texture = new Pixi.Texture.fromImage(url);
		var container = new Pixi.DisplayObjectContainer();
		var sprite = new Pixi.Sprite(texture);
		sprite.scale = 1/Math.max(sprite.width, sprite.height);
		this.sprite = container;
		this.points = points;
		[container.width, container.height] = [sprite.width, sprite.height];
	}
}

module.exports = {
	addSprite: function (name, url, points = []) {
		if (typeof url === 'undefined') {
			throw Error('No url parameter');
		}
		sprites[name] = new AdaSprite(url, points);
		return sprites[name];
	},
	getSprite: function (name) {
		return sprites[name];
	},
	AdaSprite: AdaSprite
};
