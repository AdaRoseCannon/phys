const Pixi = require('./pixi_wrapper');
const p2 = require('p2');
const pixiToP2 = require('./pixi_to_p2');
const p2ToPixi = require('./p2_to_pixi');
const Body = require('./body');

const id = 'sprites/sprites/bear/bear1.png';
const stage = require('./render');
const sprite = Pixi.Sprite.fromFrame(id);

let tempAssets = [];
let points = [];

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

		let body = new p2.Body({
			mass: 1
		});

		if (body.fromPolygon(points.map(pixiToP2.point))){

			// Calculate center of mass.
			let totalArea = 0;
			let com = [0, 0];

			body.shapes.forEach((s, i) => {
				totalArea += s.area;
				com[0] += (s.centerOfMass[0] + body.shapeOffsets[i][0]) * s.area;
				com[1] += (s.centerOfMass[1] + body.shapeOffsets[i][1]) * s.area;
			});
			com[0] /= totalArea;
			com[1] /= totalArea;
			com[0] += body.position[0];
			com[1] += body.position[1];

			tempAssets.forEach(a => sprite.removeChild(a));
			updateSpriteAnchorByPosition(sprite, p2ToPixi.point(com));
			drawPoints(points);
		} else {
			console.log('Error constructing shape');
		}
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