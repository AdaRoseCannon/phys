const Pixi = require('./pixi_wrapper');
const p2 = require('p2');
const pixiToP2 = require('./pixi_to_p2');
const p2ToPixi = require('./p2_to_pixi');

const stage = require('./render');
const sprite = Pixi.Sprite.fromFrame('sprites/sprites/bear/bear1.png');

let polygon;
let points = [];
let convex = null;

function updateSpriteAnchorByPosition(sprite, pos) {
	sprite.anchor.x += pos.x/sprite.width;
	sprite.anchor.y -= pos.y/sprite.height;
	for (let point of points) {
		point.x -= pos.x;
		point.y -= pos.y;
	}
	sprite.position.x += pos.x;
	sprite.position.y -= pos.y;
}

function drawPoints() {
	if (polygon) polygon.parent.removeChild(polygon);
	polygon = new Pixi.Graphics();
	polygon.beginFill(0x00FF00);
	polygon.moveTo(points[0].x, points[0].y);
	for (let point of points) {
		polygon.lineTo(point.x, point.y);
	}
	polygon.endFill();
	sprite.addChild(polygon);
}

function drawPoint(position) {
	const pointSprite = Pixi.Sprite.fromFrame('sprites/sprites/handle.png');
	pointSprite.anchor.x = 0.5;
	pointSprite.anchor.y = 0.5;
	pointSprite.position = position;
	sprite.addChild(pointSprite);
	return pointSprite;
}

function addPoint(position) {
	points.push(position);
	try {
		convex = new p2.Convex(points.map(pixiToP2.point));
		convex.updateArea();
		convex.updateCenterOfMass();
		if (!convex.centerOfMass[0]) throw Error('Points can\'t define center of mass');
		updateSpriteAnchorByPosition(sprite, p2ToPixi.point(convex.centerOfMass));
		drawPoints();
	} catch (e) {
		console.log(e.message);
	}
};

stage.setZoom(0.5);
stage.interactive = true;
sprite.anchor.x = 0.5;
sprite.anchor.y = 0.5;
sprite.scale.y = -1;
stage.addChild(sprite);

const centerOfMass = drawPoint({x: 0, y: 0});

const doneButton = Pixi.Sprite.fromFrame('sprites/sprites/done.png');
doneButton.interactive = true;
doneButton.buttonMode = true;
doneButton.click = function () {
	stage.setZoom(0.2, 2000);
}
stage.parent.addChild(doneButton);

stage.click = function (e) {
	addPoint(sprite.toLocal(e.global));
}.bind(stage);