/**
 * Functions for interfacing between pixi and p2.
 */

module.exports.point = function (point) {
	return [point.x, -point.y];
}