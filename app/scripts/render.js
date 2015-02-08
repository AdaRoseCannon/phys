
var Pixi = require('pixi');

var doc = document.body.getBoundingClientRect();

document.body.innerHTML = '';
var renderer = Pixi.autoDetectRenderer(doc.width, doc.height);
document.body.appendChild(renderer.view);
renderer.view.classList.add('stage');
var stage = new Pixi.Stage(0x66FF99);
require('./loop')(() => renderer.render(stage));
var container = new Pixi.DisplayObjectContainer();
stage.addChild(container);
var zoom = 1;
container.position.x =  renderer.width/2; // center at origin
container.position.y =  renderer.height/2;
container.scale.x =  zoom;  // zoom in
container.scale.y = -zoom; // Note: we flip the y axis to make "up" the physics "up"

module.exports = container;