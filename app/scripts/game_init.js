
require('./render');
var Body = require('./body');

Body.addNewBody('sprites/bear/bear1.png', {
	scale: 0.005,
	mass: 1
}).position = [3, 2];

var staticBody = Body.addNewBody('sprites/bear/bear1.png', {
	scale: 0.005,
	mass: 0
});

staticBody.position[1] = -2;