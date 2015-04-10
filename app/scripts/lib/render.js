const Pixi = require('./pixi_wrapper');
const TWEEN = require('tween.js');

var target = document.getElementById('render-target');

var renderer = Pixi.autoDetectRenderer(target.offsetWidth, target.offsetHeight);
target.innerHTML = '';
target.appendChild(renderer.view);


renderer.view.classList.add('stage');

// Screenspace
var stage = new Pixi.Container();
require('./loop')(() => renderer.render(stage));

// Object space
var container = new Pixi.Container();
stage.addChild(container);
var zoom = 100;
container.position.x =  renderer.width/2; // center at origin
container.position.y =  renderer.height/2;
container.scale.x =  zoom;  // zoom in
container.scale.y = -zoom; // Note: we flip the y axis to make "up" the physics "up"
container.worldScale = 0.01;
module.exports = container;

TWEEN.update();
require('./loop')(() => TWEEN.update());

renderer.view.addEventListener('mousewheel', function (e) {
	if (this.mousewheel) {
		this.mousewheel(e);
	}
}.bind(container));

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
		.easing( TWEEN.Easing.Cubic.Out )
		.onUpdate(function() {
			self.setZoom(this.zoom, 0);
		})
		.start();
}.bind(container);