var funcs = [];

module.exports = function addFunc(...f) {
	funcs.push(...f);
};

(function loop() {
	funcs.map(f => {
		f();
		return f;
	});
	window.requestAnimationFrame(loop);
})();