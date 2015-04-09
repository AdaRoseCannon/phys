"use strict";
const Pixi = require('./pixi_wrapper');
const pixiToP2 = require('./pixi_to_p2');
const p2ToPixi = require('./p2_to_pixi');
const Body = require('./body');
const stage = require('./render');
const PhysSprite = require('./ada_sprite');

const propertyTarget = $('#properties-target')[0];
const contextButton = $('#context-button')[0];
const contextLink = $('#context-link')[0];
const testLink = $('#test-link')[0];

const STATE_FRESH = 0;
const STATE_WORKING = 1;
const STATE_ADDPATH = 2;

let tempAssets = [];
let points = [];
let currentWorking;
let state = [STATE_FRESH];

stage.setZoom(0.5);
stage.interactive = true;
stage.hitArea = new Pixi.Rectangle(-10000, -10000, 20000, 20000);

function getState() {
	return state[state.length - 1];
}

function setContextIcon(icon) {

	const contextButtonI = $(contextButton).find('i')[0];

	let usedIcons = {
		done: 'mdi-action-done',
		'done-all': 'mdi-action-done-all',
		add: 'mdi-content-add',
		new: 'mdi-content-add-box'
	};

	if (usedIcons[icon] !== undefined) {
		for (let i in usedIcons) {
			contextButtonI.classList.remove(usedIcons[i]);
		}
		contextButtonI.classList.add(usedIcons[icon]);
	}
}

function updateContextIcon() {
	switch(getState()) {
		case STATE_FRESH:
			contextLink.innerHTML = "New Object";
			setContextIcon('add-box');
			break;
		case STATE_WORKING:
			contextLink.innerHTML = "Add new Path";
			setContextIcon('add');
			break;
		case STATE_ADDPATH:
			contextLink.innerHTML = "Finished Path";
			setContextIcon('done');
			break;
	}
}
updateContextIcon();

function popState() {
	const oldState = state.pop();
	if (oldState === STATE_FRESH) {
		throw Error('Cannot push the empty state');
	}
	updateContextIcon();
	return oldState;
}

function pushState(newState) {
	if (newState === STATE_FRESH) {
		throw Error('Cannot push the empty state');
	}
	state.push(newState);
	updateContextIcon();
}

function drawPoint(position) {
	if (currentWorking !== undefined) {
		const pointSprite = Pixi.Sprite.fromFrame('sprites/sprites/handle.png');
		pointSprite.anchor.x = 0.5;
		pointSprite.anchor.y = 0.5;
		pointSprite.position = position;
		currentWorking.sprite.addChild(pointSprite);
		tempAssets.push(pointSprite);
		return pointSprite;
	}
}

function drawPoints(points) {
	if (!points.length || currentWorking === undefined) {
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
	currentWorking.sprite.addChild(polygon);
	tempAssets.push(polygon);
}

function addPoint(position) {

	points.push(position);
	if (points.length >= 3) {

		currentWorking.setPoints(points.map(pixiToP2.point), true);

		tempAssets.forEach(a => currentWorking.sprite.removeChild(a));

		currentWorking.data.shapes.forEach(shape => {
			drawPoints(shape.map(i => currentWorking.data.points[i]).map(p2ToPixi.point));
		});
		drawPoint(p2ToPixi.point(currentWorking.getCenterOfMass()));

		currentWorking.sprite.pivot = p2ToPixi.point(currentWorking.getCenterOfMass());

		let ih = "";
		for (let property in currentWorking.data) {
			ih += `<tr><td data-property="${property}">${property}</td><td class="editable">${JSON.stringify(currentWorking.data[property])}</td></tr>`;
		}
		propertyTarget.innerHTML = ih;

	}
}

function getSprite() {
	return new Promise((resolve, reject) => {
		const m = $('.modal');
		const s = m.find('#select');
		let html = '';
		for(let i in Pixi.utils.TextureCache) {
			html += `<option>${i}</option>`;
		}
		s.html(html);
		m.modal();
		const b = $('.modal-backdrop');
		m.on('hide.bs.modal', reject);
		m.find('#modal-okay').on('click', e => {
			m.hide(e);
			b.hide(200, b.remove);
			resolve(s.val());
		});
	});
}

function onContextClick() {

	switch(getState()) {
		case STATE_FRESH:
			getSprite().then(sprite => {
				currentWorking = new PhysSprite({sprite});
				pushState(STATE_WORKING);
				currentWorking.sprite.anchor.x = 0.5;
				currentWorking.sprite.anchor.y = 0.5;
				stage.addChild(currentWorking.sprite);
			});
			break;
		case STATE_WORKING:
			pushState(STATE_ADDPATH);
			break;
		case STATE_ADDPATH:
			popState();
			break;
	}
}

function test() {
	stage.setZoom(30, 2000);
	currentWorking.setScale(stage.worldScale);
	Body.addNewBody({
		id: 'sprites/sprites/sprite2.png',
		scale: 0.1,
		mass: 0
	}).position = [0, -15];
	currentWorking.startPhysics();
}

/**
 * Events
 */

contextButton.addEventListener('click', onContextClick);
contextLink.addEventListener('click', onContextClick);
testLink.addEventListener('click', test);

stage.click = function (e) {
	if (getState() === STATE_ADDPATH) {
		addPoint(currentWorking.sprite.toLocal(e.data.global));
	}
}.bind(stage);

stage.mousewheel = function (e) {
	if (e.wheelDelta < 0) {
		this.zoomBy(0.9);
	} else if (e.wheelDelta > 0) {
		this.zoomBy(1/0.9);
	}
}.bind(stage);