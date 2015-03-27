const p2 = require('p2');
const extend = require('util')._extend;

function vecDiff(p1, p2) {
	return Math.sqrt(Math.pow(p1[0]-p2[0], 2) + Math.pow(p1[1]-p2[1], 2));
}

class PhysSprite {
	constructor(options) {
		this.data = extend({
			name: 'NULL',
			mass: 1,
			scale: 1
		}, options);
	}

	setSprite(name) {
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

	setCenterOfMass(point) {
		this.data.com = point;
	}

	getCenterOfMass(point) {
		return this.data.com;
	}

	optimizePoints() {
		setPoints(this.points, true);
	}
}

module.exports = PhysSprite;