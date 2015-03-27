/**
 * Functions for interfacing between pixi and p2.
 */

module.exports.point = function (point) {
	return {x: point[0], y: -point[1]};
}