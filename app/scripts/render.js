const Pixi = require('./pixi_wrapper');
const TWEEN = require('tween.js');

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

TWEEN.update();
var loop = require('./loop')(() => TWEEN.update());

container.lookAt = function (...coords) {

	if (coords[0].hasOwnProperty('x') && coords[0].hasOwnProperty('y')) {
		this.position = coords[0];
		return;
	}

	if (coords.length === 2) {
		this.position.x =  -coords[0];
		this.position.y =  -coords[1];
		return;
	}

}.bind(container);

container.getZoom = function () {
	return this.scale.x; 
}.bind(container);

container.setZoom = function (zoom, t) {
	if (t >= 16) {
		this.zoomOverTime(zoom, t);
	} else {
		this.scale.x =  zoom;  // zoom in
		this.scale.y = -zoom; // Note: we flip the y axis to make "up" the physics "up"return;
	}
}.bind(container);

container.zoomBy = function (multiplier, t) {
	const newZoom = this.getZoom() * multiplier;
	this.setZoom(newZoom, t);
}.bind(container);

container.zoomOverTime = function(newZoom, time) {
	const self = this;
	window.tween = new TWEEN.Tween({ zoom: this.getZoom() })
		.to({ zoom: newZoom }, time )
		.easing( TWEEN.Easing.Elastic.Out )
		.onUpdate(function() {
			self.setZoom(this.zoom, 0);
		})
		.start();
}.bind(container);