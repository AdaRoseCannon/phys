var funcs = [];

module.exports = function addFunc(...f) {
	funcs.push(...f);
};

(function loop() {
	funcs.map(f => {
		f(16.666);
	});
	window.requestAnimationFrame(loop);
})();