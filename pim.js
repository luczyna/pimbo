//constructors
function Pim(color) {
	this.color = color;
	this.state = 'ghost';
	this.tick = 0;
	this.direction = 'down';
	this.countdown = (Math.floor(Math.random() * 6) + 1);
	this.primed = false;
	this.prime_countdown = 10;
	this.poof = false,
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
Pim.prototype.collide = function() {
	var pd;

	if (this.direction === 'left') { pd = this.pos[0]; } else 
	if (this.direction === 'right') {pd = this.pos[0] + library.pim_size[2] * library.multiplier; } else
	if (this.direction === 'up') { pd = this.pos[1]; } else
	if (this.direction === 'down') {pd = this.pos[1] + library.pim_size[3] * library.multiplier; }

	//check for skulls
	if (this.state === 'ghost') {
		for (var i = 0; i < game.skulls.length; i++) {
			var skull = game.skulls[i];
			var sd, collect = false, threshold = 5;
			if (this.direction === 'left') {
				// sd = skull.pos[0] + library.skull_size[0] * library.multiplier;
				sd = skull.pos[0];
				if (Math.abs(sd - pd) <= threshold) {
					collect = true;
				}
			} else if (this.direction === 'right') {
				sd = skull.pos[0];
				if (Math.abs(sd - pd) <= threshold) {
					collect = true;
				}
			} else if (this.direction === 'up') {
				// sd = skull.pos[1] + library.skull_size[1] * library.multiplier;
				sd = skull.pos[1];
				if (Math.abs(sd - pd) <= threshold) {
					collect = true;
				}
			} else if (this.direction === 'down') {
				sd = skull.pos[1];
				if (Math.abs(sd - pd) <= threshold) {
					collect = true;
				}
			}

			if (collect) {
				//this pim goes to the next stage!
				this.state = 'zombie';
				this.countdown = (Math.floor(Math.random() * 6) + 1);
				this.primed = false;
				this.prime_countdown = 10;
				this.tick = 0;
				this.poof = true;

				//this skull goes away
				game.skulls.splice(i, 1);
			}
		} 
	}

	//check for magic
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





function Magic(color) {
	this.color = color;
	this.tick = 0;
	this.countdown = (Math.floor(Math.random() * 30) + 15);
	var pox = Math.floor(Math.random() * (library.canvas[0] - library.magic_size[2] * library.multiplier));
	var poy = Math.floor(Math.random() * (library.canvas[1] - library.magic_size[3] * library.multiplier));
	this.pos = [pox, poy];
}

function fate() {
	//we're making magic
	var amount = game.magic.length;
	var c = library.data.color[amount % 3];
	var m = new Magic(c);
	game.magic.push(m);
}





function Portal() {
	var pox, poy;

	this.tick = 0;
	pox = (library.canvas[0] / 2) - (library.portal_size[2] * library.multiplier) / 2;
	poy = 0;
	this.pos = [pox, poy];
}

function destination() {
	var p = new Portal();
	game.portal.push(p);
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
}