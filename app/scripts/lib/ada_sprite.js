const p2 = require('p2');
const Pixi = require('./pixi_wrapper');
const extend = require('util')._extend;
const world = require('./physics');

function vecDiff(p1, p2) {
	return Math.sqrt(Math.pow(p1[0]-p2[0], 2) + Math.pow(p1[1]-p2[1], 2));
}

class PhysSprite {
	constructor(options) {
		if (options.sprite === undefined) {
			throw Error("Need to define with a sprite path.");
		}
		this.data = extend({
			name: 'NULL',
			mass: 1,
			scale: 1,
		}, options);

		this.sprite = Pixi.Sprite.fromFrame(this.data.sprite);
		this.setScale(this.data.scale);
	}

	setScale(scale) {
		this.data.scale = scale;
		this.sprite.scale.y = -this.data.scale;
		this.sprite.scale.x = this.data.scale;
	}

	addSprite(name) {
		this.data.sprite = name;
	}

	setPoints(points, optimizePoints=false) {

		let body = new p2.Body({
			mass: 1
		});

		if (body.fromPolygon(points.slice(), optimizePoints)){
			this.data.points = points.slice();

			// Calculate center of mass.
			let totalArea = 0;
			let com = [0, 0];

			this.data.shapes = [];

			body.shapes.forEach((s, i) => {
				totalArea += s.area;
				com[0] += (s.centerOfMass[0] + body.shapeOffsets[i][0]) * s.area;
				com[1] += (s.centerOfMass[1] + body.shapeOffsets[i][1]) * s.area;
				this.data.shapes[i] = s.vertices
					.map(vs => [vs[0] + body.shapeOffsets[i][0] + body.position[0], vs[1] + body.shapeOffsets[i][1] + body.position[1]])
					.map(v1s => {
						for (let i=0, l=this.data.points.length; i<l; i++) {
							let v2s = this.data.points[i];
							if (vecDiff(v1s, v2s) <= 0.0001) {
								return i;
							}
						}
					});
			});
			com[0] /= totalArea;
			com[1] /= totalArea;
			com[0] += body.position[0];
			com[1] += body.position[1];

			this.setCenterOfMass(com, true);

		} else {
			throw Error('Error constructing shape');
		}
	}

	startPhysics() {

		this.body = new p2.Body({
			mass: this.data.mass,
			position: this.position || [0,0],
			angularVelocity: this.angularVelocity || 0
		});

		this.data.shapes.forEach(function (shapeIn) {
			let self = this;
			let points = shapeIn.map(i => self.data.points[i]).map(a => a.map(b => b*self.data.scale));
			let shape = new p2.Convex(points);
			shape.updateArea();
			shape.updateCenterOfMass();
			this.body.addShape(shape);
		}.bind(this));

		require('./loop')(() => {
			this.sprite.position.x = this.body.position[0];
			this.sprite.position.y = this.body.position[1];
			this.sprite.rotation = this.body.angle;
		});
		world.addBody(this.body);
	}

	setCenterOfMass(point) {
		this.data.com = point;
	}

	getCenterOfMass() {
		return this.data.com;
	}

	optimizePoints() {
		this.setPoints(this.points, true);
	}
}

module.exports = PhysSprite;