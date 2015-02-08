/* jshint devel:true */

function preloadImage(url) {
	return new Promise(function (resolve, reject) {
		var i = new Image();
		i.src = url;
		i.onload = () => {
			resolve(i);
		};
		i.onerror = reject;
	});
}

Promise.all([
	preloadImage("images/sprite1.png")
]).then(() => {
	require('./render');
	require('./physics');
	var Body = require('./body');
	new Body.rect({
		mass: 0.2
	});
	var b = new Body.rect({
		mass: 0,
		width: 5
	}).position = [-1.5, -5];
	b.angle = 0.1;
});
