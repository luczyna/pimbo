//constructors
function Pim(color) {
	this.color = color;
	this.state = 'ghost';
	this.tick = 0;
	this.direction = 'down';
	this.countdown = (Math.floor(Math.random() * 6) + 1);
	this.primed = false;
	this.prime_countdown = 10;
	this.dancing = false;
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
		this.primed = true;
		console.log('changed direction, thanks human');
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






function Skull() {
	var pox = Math.floor(Math.random() * (library.canvas[0] - library.pim_size[2] * library.multiplier));
	var poy = Math.floor(Math.random() * (library.canvas[1] - library.pim_size[3] * library.multiplier));
	this.guid = Math.random();
	this.countdown = (Math.floor(Math.random() * 50) + 100);
	this.pos = [pox, poy];
}


function chance() {
	//we're making a skull
	var s = new Skull();
	game.skulls.push(s);
}







function pushPim(e) {
	// console.log(e);
	var input = [];

	//where did the mouse click?
	input[0] = e.pageX - this.offsetLeft - (library.pim_size[2] / 2);
	input[1] = e.pageY - this.offsetTop - (library.pim_size[3] / 2);
	// console.log('this is where I clicked: ' + input[0] + ' ' + input[1]);
	// elements.c.fillStyle = 'tomato';
	// elements.c.fillRect(input[0], input[1], 100 * library.multiplier, 100 * library.multiplier);

	//does this correlate with any pims?
	for (var i = 0; i < game.pims.length; i++) {
		var pim = game.pims[i];
		var distx = pim.pos[0] - input[0];
		var disty = pim.pos[1] - input[1];
		// console.log('this is the distance for the ' + pim.color + ' pim: ' + distx + ' ' + disty);
		// console.log(input.join() + ' >> ' + pim.pos.join());

		if ( distx >= (-50 * library.multiplier) &&
			distx <= (50 * library.multiplier) &&
			disty >= (-50 * library.multiplier) &&
			disty <= (50 * library.multiplier) ) {
			// console.log('close enough!');
			// pimsTouched.push(i);
			pim.changeDirection('player');
		}
	}

	// if (pimsTouched.length) {
	// 	for (var j = 0; j < pimsTouched.length; j++) {
	// 		var pim = game.pims[pimsTouched[j]];
	// 	}
	// }
}