const Pixi = require('./pixi_wrapper');
const p2 = require('p2');
const pixiToP2 = require('./pixi_to_p2');
const p2ToPixi = require('./p2_to_pixi');
const Body = require('./body');

const PhysSprite = require('./ada_sprite');

const id = 'sprites/sprites/bear/bear1.png';
const stage = require('./render');
const sprite = Pixi.Sprite.fromFrame(id);

const propertyTarget = document.querySelector('#properties-target');

let tempAssets = [];
let points = [];
let currentWorking = new PhysSprite();

function drawPoint(position) {
	const pointSprite = Pixi.Sprite.fromFrame('sprites/sprites/handle.png');
	pointSprite.anchor.x = 0.5;
	pointSprite.anchor.y = 0.5;
	pointSprite.position = position;
	sprite.addChild(pointSprite);
	tempAssets.push(pointSprite);
	return pointSprite;
}

function drawPoints(points) {
	if (!points.length) {
		return;
	}
	let polygon = new Pixi.Graphics();
	polygon.beginFill(0xffffff*Math.random());
	polygon.moveTo(points[0].x, points[0].y);
	polygon.alpha = 0.6;
	for (let point of points) {
		polygon.lineTo(point.x, point.y);
	}
	polygon.endFill();
	sprite.addChild(polygon);
	tempAssets.push(polygon);
}

function addPoint(position) {

	points.push(position);
	if (points.length >= 3) {

		currentWorking.setPoints(points.map(pixiToP2.point), true);

		tempAssets.forEach(a => sprite.removeChild(a));

		currentWorking.data.shapes.forEach(shape => {
			drawPoints(shape.map(i => currentWorking.data.points[i]).map(p2ToPixi.point));
		});
		drawPoint(p2ToPixi.point(currentWorking.getCenterOfMass()));

		sprite.pivot = p2ToPixi.point(currentWorking.getCenterOfMass());

		let ih = "";
		for (let property in currentWorking.data) {
			ih += `<tr><td data-property="${property}">${property}</td><td class="editable">${JSON.stringify(currentWorking.data[property])}</td></tr>`;
		}
		propertyTarget.innerHTML = ih;

	}
}

stage.setZoom(0.5);
stage.interactive = true;
sprite.anchor.x = 0.5;
sprite.anchor.y = 0.5;
sprite.scale.y = -1;
stage.addChild(sprite);

const doneButton = document.getElementById('done-button');
doneButton.addEventListener('click', function () {
	stage.setZoom(30, 2000);

	Body.addNewBody({
		sprite: sprite,
		polygon: points.map(pixiToP2.point),
		scale: 0.01,
		mass: 1
	});

	Body.addNewBody({
		id: 'sprites/sprites/sprite2.png',
		scale: 0.1,
		mass: 0
	}).position = [0, -15];
});

stage.hitArea = new Pixi.Rectangle(-10000, -10000, 20000, 20000);

stage.click = function (e) {
	addPoint(sprite.toLocal(e.global));
}.bind(stage);

stage.mousewheel = function (e) {
	if (e.wheelDelta < 0) {
		this.zoomBy(0.9);
	} else if (e.wheelDelta > 0) {
		this.zoomBy(1/0.9);
	}
}.bind(stage);