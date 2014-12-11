//constructors
function Pim(color) {
	this.color = color;
	this.state = 'ghost';
	this.tick = 0;
	this.direction = 'down';
	this.done = false,
	this.onDestiny = false,
	this.destiny = [null, null],
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
		this.countdown = (Math.floor(Math.random() * 5) + 5);
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
		if (this.state === 'ghost') {
			playMusic(library.ghost_sound);
		} else if (this.state === 'zombie') {
			playMusic(library.zombie_sound);
		}
		console.log('changed direction, thanks human');
		//complete it by starting a new countdown
		this.prime_countdown = 10;
	}

}
Pim.prototype.collide = function() {
	var pd = [];

	// if (this.direction === 'left') {
	// 	pd[0] = this.pos[0];
	// 	pd[1] = this.pos[1] + (library.pim_size[3] * library.multiplier / 2);
	// } else if (this.direction === 'right') {
	// 	pd[0] = this.pos[0] + library.pim_size[2] * library.multiplier;
	// 	pd[1] = this.pos[1] + (library.pim_size[3] * library.multiplier / 2);
	// } else if (this.direction === 'up') { 
	// 	pd[0] = this.pos[0] + (library.pim_size[2] * library.multiplier / 2);
	// 	pd[1] = this.pos[1];
	// } else if (this.direction === 'down') {
	// 	pd[0] = this.pos[0] + (library.pim_size[2] * library.multiplier / 2);
	// 	pd[1] = this.pos[1] + library.pim_size[2] * library.multiplier;
	// }
	pd[0] = this.pos[0];
	pd[1] = this.pos[1];

	//check for skulls
	if (this.state === 'ghost') {
		this.checkCollide('skulls', 50, pd);
	} else if (this.state === 'zombie') {
		this.checkCollide('magic', 50, pd);
	}

	//check for magic
}
Pim.prototype.checkCollide = function(obj, sensitivity, pd) {
	//pd is the Pim Distance/Origin value, like it's left or right most point
	//obj could be skulls or magic
	var check = game[obj];
	var threshold = sensitivity;
	//we need a reference to the correct image in the library
	var l = [];
	if (obj === 'skulls') { 
		l[0] = library.skull_size[0];
		l[1] = library.skull_size[1];
	} else {
		l[0] = library.magic_size[2];
		l[1] = library.magic_size[3];
	}

	//now we go through each of the object items
	for (var i = 0; i < check.length; i++) {
		var item = check[i];
		var id = [], collect = false;

		// if (this.direction === 'left') {
		// 	id[0] = item.pos[0] + l[0] * library.multiplier;
		// 	id[1] = item.pos[1] + (l[1] * library.multiplier / 2);
		// } else if (this.direction === 'right') {
		// 	id[0] = item.pos[0];
		// 	id[1] = item.pos[1] + (l[1] * library.multiplier / 2);
		// } else if (this.direction === 'up') { 
		// 	id[0] = item.pos[0] + (l[0] * library.multiplier / 2);
		// 	id[1] = item.pos[1] + l[1] * library.multiplier;
		// } else if (this.direction === 'down') {
		// 	id[0] = item.pos[0] + (l[2] * library.multiplier / 2);
		// 	id[1] = item.pos[1];
		// }
		id[0] = item.pos[0];
		id[1] = item.pos[1];

		if (Math.abs(id[0] - pd[0]) <= threshold && Math.abs(id[1] - pd[1]) <= threshold) {
			var message;
			if (this.state === 'zombie' && (this.color === item.color)) {
				//the zombie interacted with the correct color magic
				message = 'The ' + this.color + ' pim going ' + this.direction + ' touched the ' + item.color + ' magic. The pim was at ' + pd + ' the magic was at ' + id + '.';
				console.log(message);
				collect = true;
			} else if (this.state === 'ghost') {
				//the ghost can find any skull
				message = 'The ' + this.color + ' ghost going ' + this.direction + ' touched the skull at ' + id + '. The pim was at ' + pd + ' the skull had a guid of ' + item.guid + '.';
				console.log(message);
				collect = true;
			}
		}

		if (collect) {
			//this pim goes to the next stage!
			if (this.state === 'ghost') {
				this.state = 'zombie';
			} else if (this.state === 'zombie') {
				this.state = 'pim';
				this.dancing = true;
			}
			playMusic(library.transform_sound);
			this.countdown = (Math.floor(Math.random() * 6) + 1);
			this.primed = false;
			this.prime_countdown = 10;
			this.tick = 0;
			this.poof = true;

			//this item goes away
			check.splice(i, 1);
		}
	}
}
Pim.prototype.goToLight = function() {
	console.log('going to the light');
	this.onDestiny = true;
	this.destiny[0] = game.portal[0].pos[0];
	this.destiny[1] = 0;

	//start moving towards x
	if (this.pos[0] < this.destiny[0]) {
		this.direction = 'right';
	} else {
		this.direction = 'left';
	}
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

		if ( distx >= (-50 * Math.round(library.multiplier)) &&
			distx <= (50 * Math.round(library.multiplier)) &&
			disty >= (-50 * Math.round(library.multiplier)) &&
			disty <= (50 * Math.round(library.multiplier)) &&
			pim.state !== 'pim') {
			// console.log('close enough!');
			// pimsTouched.push(i);
			pim.changeDirection('player');
		}
	}
}