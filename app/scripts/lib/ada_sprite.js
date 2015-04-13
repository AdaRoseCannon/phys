const p2 = require('p2');
const Pixi = require('./pixi_wrapper');
const extend = require('util')._extend;
const world = require('./physics');
const p2ToPixi = require('./p2_to_pixi');

function vecDiff(p1, p2) {
	return Math.sqrt(Math.pow(p1[0]-p2[0], 2) + Math.pow(p1[1]-p2[1], 2));
}

function getVecIndexFromArray(v1s, array) {
	for (let i=0, l=array.length; i<l; i++) {
		let v2s = array[i];
		if (vecDiff(v1s, v2s) <= 0.001) {
			return i;
		}
	}

	// If the vertex is not in the array then add it.
	array.push(v1s);
	return array.indexOf(v1s);
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
			com: [0, 0],
			shapes: [],
			points: []
		}, options);

		this.sprite = Pixi.Sprite.fromFrame(this.data.sprite);
		this.setScale(this.data.scale);
	}

	setScale(scale) {
		this.data.scale = scale;
		this.sprite.scale.y = -this.data.scale;
		this.sprite.scale.x = this.data.scale;
	}

	addVertex(v) {
		var vs = v.slice();
		this.data.points.push(vs);
		return this.data.points.indexOf(vs);
	}

	getVertices(a) {
		return a.map(i => this.data.points[i]);
	}

	addSprite(name) {
		this.data.sprite = name;
	}

	setShape(shape, index, optimizePoints=false) {

		let body = new p2.Body({
			mass: 1
		});

		// breakdown shape and add it
		if (body.fromPolygon(this.getVertices(shape), optimizePoints)){

			this.data.shapes[index] = [];

			body.shapes.forEach((s, i) => {
				this.data.shapes[index][i] = s.vertices
					// Get the absolutely positioned vertex from eachshape and match them to points
					.map(vs => {
						return [vs[0] + body.shapeOffsets[i][0] + body.position[0], vs[1] + body.shapeOffsets[i][1] + body.position[1]];
					})
					// get the matching point.
					.map(v1s => getVecIndexFromArray(v1s, this.data.points));
			});

			// Add previously broken down shapes
			this.data.shapes.forEach(shapeGroup => shapeGroup.forEach(s => {
				var c = new p2.Convex(this.getVertices(s));
				c.updateArea();
				c.updateCenterOfMass();
				body.addShape(c);
			}));

			// Calculate center of mass.
			let totalArea = 0;
			let com = [0, 0];
			body.shapes.forEach((s, i) => {
				totalArea += s.area;
				com[0] += (s.centerOfMass[0] + body.shapeOffsets[i][0]) * s.area;
				com[1] += (s.centerOfMass[1] + body.shapeOffsets[i][1]) * s.area;
			});

			com[0] /= totalArea;
			com[1] /= totalArea;
			com[0] += body.position[0];
			com[1] += body.position[1];

			this.setCenterOfMass(com);

		} else {
			throw Error('Error constructing shape');
		}
	}

	setCenterOfMass(pos) {
		this.sprite.anchor.x += pos[0]/this.sprite.width;
		this.sprite.anchor.y += pos[1]/this.sprite.height;
		for (let point of this.data.points) {
			point[0] -= pos[0];
			point[1] -= pos[1];
		}
		this.sprite.position.x += pos[0];
		this.sprite.position.y += pos[1];
	}

	startPhysics() {

		this.body = new p2.Body({
			mass: this.data.mass,
			position: this.position || [0,0],
			angularVelocity: this.angularVelocity || 0
		});

		this.data.shapes.forEach(shapeGroup => shapeGroup.forEach(shapeIn => {
			let points = this.getVertices(shapeIn).map(a => a.map(b => b*this.data.scale));
			let shape = new p2.Convex(points);
			shape.updateArea();
			shape.updateCenterOfMass();
			this.body.addShape(shape);
		}));

		require('./loop')(() => {
			this.sprite.position.x = this.body.position[0];
			this.sprite.position.y = this.body.position[1];
			this.sprite.rotation = this.body.angle;
		});
		world.addBody(this.body);
	}

	getCenterOfMass() {
		return this.data.com;
	}

	optimizePoints(index) {
		this.setShape(this.points, index || 0, true);
	}
}

module.exports = PhysSprite;