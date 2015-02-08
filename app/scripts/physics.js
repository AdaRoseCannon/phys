var p2 = require('p2');

// Create a physics world, where bodies and constraints live
var world = new p2.World({
	gravity:[0, -9.82]
});

// The "Game loop". Could be replaced by, for example, requestAnimationFrame.
require('./loop')(function(delta){

	// The step method moves the bodies forward in time.
	world.step(delta/1000);
});

module.exports = world;