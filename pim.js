//constructors
function Pim(color) {
	this.color = color;
	this.state = 'ghost';
	this.tick = 0;
	this.direction = 'down';
	this.countdown = (Math.floor(Math.random() * 6) + 1);
	this.primed = false;
	this.dancing = false;
	// var pox = Math.max(Math.floor(Math.random() * library.canvas[0]), library.canvas[0] - library.pim_size[2] * library.multiplier);
	// var poy = Math.max(Math.floor(Math.random() * library.canvas[1]), library.canvas[1] - library.pim_size[3] * library.multiplier);
	var pox = Math.floor(Math.random() * (library.canvas[0] - library.pim_size[2] * library.multiplier));
	var poy = Math.floor(Math.random() * (library.canvas[1] - library.pim_size[3] * library.multiplier));
	this.pos = [pox, poy];
}
Pim.prototype.changeDirection = function(cause) {
	//what is the current direction
	var current = this.direction;
	var options = ['up', 'down', 'left', 'right'];

	if (cause === 'random') {
		//what are our options
		var ind = options.indexOf(current);
		var opt = [];
		for (var i = 0; i < 4; i++) {
			if (i !== ind) {
				opt.push(options[i]);
			}
		}
		// console.log(opt);

		var rando = Math.floor(Math.random() * 3);
		this.direction = opt[rando];
		// console.log('changed direction from ' + current + ' to ' + this.direction);
	} else if (cause === 'player') {
		//what is the player action?
		var p = game.player;

		if (p === 'reverse') {
			if (current === 'up') { this.direction = 'down'; }
			else if (current === 'down') { this.direction = 'up'; }
			else if (current === 'left') { this.direction = 'right'; }
			else if (current === 'right') { this.direction = 'left'; }
		} else if (p === 'clockwise') {
			if (current === 'up') { this.direction = 'right'; }
			else if (current === 'down') { this.direction = 'left'; }
			else if (current === 'left') { this.direction = 'up'; }
			else if (current === 'right') { this.direction = 'down'; }
		} else if (p === 'counter-clockwise') {
			if (current === 'up') { this.direction = 'left'; }
			else if (current === 'down') { this.direction = 'right'; }
			else if (current === 'left') { this.direction = 'down'; }
			else if (current === 'right') { this.direction = 'up'; }
		}
		console.log('changed direction, thanks huamn');
	}

	//complete it by starting a new countdown
	this.countdown = (Math.floor(Math.random() * 6) + 1);
}
Pim.prototype.goToLight = function() {
	console.log('going to the light');
}


function god() {
	//we're making a pim
	//need to know the color
	//it's based on order, c, m, then y
	var amount = game.pims.length;
	var c = library.data.color[amount % 3];
	var p = new Pim(c);
	game.pims.push(p);
}