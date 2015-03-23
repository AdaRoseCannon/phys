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

function updateSpriteAnchorByPosition(sprite, pos) {
	sprite.anchor.x += pos.x/sprite.width;
	sprite.anchor.y += pos.y/sprite.height;
	for (let point of points) {
		point.x -= pos.x;
		point.y -= pos.y;
	}
	sprite.position.x += pos.x;
	sprite.position.y += pos.y;
	drawPoint({x:0, y:0});
}

function drawPoints(points) {
	if (!points.length) {
		return;
	}
	let polygon = new Pixi.Graphics();
	polygon.beginFill(0xffffff*Math.random());
	polygon.moveTo(points[0].x, -points[0].y);
	polygon.alpha = 0.6;
	for (let point of points) {
		polygon.lineTo(point.x, -point.y);
	}
	polygon.endFill();
	sprite.addChild(polygon);
	tempAssets.push(polygon);
}

function addPoint(position) {
	position.y = -position.y;
	points.push(position);
	if (points.length >= 3) {

		currentWorking.setPoints(points.map(pixiToP2.point), true);
		tempAssets.forEach(a => sprite.removeChild(a));
		updateSpriteAnchorByPosition(sprite, p2ToPixi.point(currentWorking.getCenterOfMass()));
		drawPoints(points);

		let ih = "";
		for (let property in currentWorking.data) {
			ih += `<li data-property="${property}">${property}: ${JSON.stringify(currentWorking.data[property])}</li>`;
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

const doneButton = Pixi.Sprite.fromFrame('sprites/sprites/done.png');
doneButton.interactive = true;
doneButton.buttonMode = true;
doneButton.click = function () {
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
};
stage.parent.addChild(doneButton);
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