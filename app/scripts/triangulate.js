/**
 * Accepts an array of 2d p2 points and uses earcut to turn it into a
 * group of triangles.
 */

const earcut = require('earcut');

module.exports = function (points) {
	var output = [];
	if (points.length >= 3) {
		var tris = earcut([points], true);
		var tempTriangle = [];
		tris.indices.forEach((a, i) => {
			let vertex = [tris.vertices[a], tris.vertices[a+1]];
			tempTriangle.push(vertex);
			if (!((i+1)%3)) {
				output.push(tempTriangle);
				tempTriangle = [];
			}
		});
	} else {
		throw Error("Not enough points");
	}
	return output;
}