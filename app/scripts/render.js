var Pixi = require('./pixi_wrapper');

var doc = document.body.getBoundingClientRect();

document.body.innerHTML = '';
var renderer = Pixi.autoDetectRenderer(doc.width, doc.height);
document.body.appendChild(renderer.view);
renderer.view.classList.add('stage');
var stage = new Pixi.Stage(0x66FF99);
require('./loop')(() => renderer.render(stage));
var container = new Pixi.DisplayObjectContainer();
stage.addChild(container);
var zoom = 100;
container.position.x =  renderer.width/2; // center at origin
container.position.y =  renderer.height/2;
container.scale.x =  zoom;  // zoom in
container.scale.y = -zoom; // Note: we flip the y axis to make "up" the physics "up"

module.exports = container;

container.lookAt = function (...coords) {

	if (coords[0].hasOwnProperty('x') && coords[0].hasOwnProperty('y')) {
		container.position = coords[0];
		return;
	}

	if (coords.length === 2) {
		container.position.x =  -coords[0];
		container.position.y =  -coords[1];
		return;
	}

};

container.setZoom = function (zoom) {
	container.scale.x =  zoom;  // zoom in
	container.scale.y = -zoom; // Note: we flip the y axis to make "up" the physics "up"return;
};

container.zoomBy = function (multiplier) {
	container.scale.x *=  multiplier;  // zoom in
	container.scale.y *= multiplier; // Note: we flip the y axis to make "up" the physics "up"return;
};