function init() {
	var r1 = init_screens();

	if (r1) {
		init_loadingImages();
		init_info();
	} else {
		console.log('poop')
		//can't play, stoppppp
	}
}

init();

function init_screens() {
	//screen sizes
	var wx = window.innerWidth,
		wy = window.innerHeight;
	library.scr[0] = wx;
	library.scr[1] = wy;
	library.canvas[0] = wx * 0.9;
	library.canvas[1] = wy * 0.9;
	var m;
	if (wx < 400) {
		m = 1;
	} else if (wx >= 400 && wx < 1000) {
		m = 1.5;
	} else if (wx >= 1000 && wx < 1600) {
		m = 1.75;
	} else if (wx >= 1600) {
		m = 2;
	} else {
		m = 1;
	}
	library.multiplier = m;

	//test out canvas capability
	elements.c = elements.canvas.getContext('2d');
	var result;
	if (elements.c !== null) {
		elements.canvas.setAttribute('height', library.canvas[1]);
		elements.canvas.setAttribute('width', library.canvas[0]);
		result = true;
	} else {
		//we can't play this game, tell the person to update browser
		library.data.poop = true;
		result = false;
	}
	return result;
}

function init_loadingImages() {
	library.pim.src = 'images/pimsheet.svg';
	library.magic.src = 'images/magic.svg';
	library.portal.src = 'images/portal.svg';
	library.poof.src = 'images/poof.svg';
	library.skull.src = 'images/skull.svg';
}

function init_info() {
	//check localStorage

	//set the player action
	var playerRandom = Math.floor(Math.random() * 3);
	game.player = library.data.player[playerRandom];
	// console.log('the initial action is: ' + game.player);
	elements.player_action.textContent = game.player;

}






function game_start() {
	//clean everything up
	elements.c.clearRect(0, 0, library.canvas[0], library.canvas[1]);
	reset_game_info();

	//start the time
	game.start = new Date();
	game.running = true;
	initCreate();

	//start the intervals
	game.player_loop = window.setInterval(player_change_action, 5000);
	game.loop = window.setInterval(gameUpdate, 100);

	//add event listeners
	elements.canvas.addEventListener('click', pushPim, false);
}

function reset_game_info() {
	game.start = 0;
	game.end = 0;
	game.total = 0;

	game.running = false;
	game.finished = false;

	game.round = library.data.rounds;
	game.pims.length = 0;
	game.skulls.length = 0;
	game.magic.length = 0;
	
	game.limit[0] = game.round + 3;
	game.limit[1] = game.round + 5;
	game.limit[2] = Math.floor(Math.random * 5) + game.round + 10;

	game.player = library.data.player[Math.floor(Math.random() * 3)];
	window.clearInterval(game.player_countdown);
}

function player_change_action() {
	//what is the action right now?
	var current = game.player;
	var ind = library.data.player.indexOf(current);

	//what are our two other options?
	var options = [];
	for (var i = 0; i < 3; i++) {
		if (i !== ind) {
			options.push(library.data.player[i]);
		}
	}
	// console.log(options);
	var choice = Math.floor(Math.random() * 2);

	//change the action
	game.player = options[choice];
	// console.log('the new action is: ' + game.player);
	elements.player_action.textContent = game.player; 
}

function gameUpdate() {
	//render things
	gameRender();

	//update things
	gameInfoUpdate();

	//spawn things
	createSchtuff();
}

function gameRender() {
	//clear it all
	elements.c.clearRect(0, 0, library.canvas[0], library.canvas[1]);

	//render skulls
	for (var i = 0; i < game.skulls.length; i++) {
		renderSkull(i);
	}

	//render magic

	//render pims
	for (var k = 0; k < game.pims.length; k++) {
		renderPim(k);
	}

	//render portal
}
function gameInfoUpdate() {
	//skulls?
	for (var i = 0; i < game.skulls.length; i++) {
		updateSkull(i);
	}

	//magic?

	//portal?

	//pims?
	for (var k = 0; k < game.pims.length; k++) {
		updatePim(k);
	}
}





function renderPim(num) {
	//what pim should we be drawing?
	var pim = game.pims[num];
	if (pim.poof) {
		elements.c.drawImage(
			library.poof, 
			pim.tick * library.poof_size[2], 
			0, 
			library.poof_size[2], 
			library.poof_size[3],
			pim.pos[0],
			pim.pos[1],
			library.poof_size[2] * library.multiplier, 
			library.poof_size[3] * library.multiplier
		);
	} else {
		//x depends on c(olour) and t(ick)
		//y depends on s(tate) and d(irection)
		var c, s, d, t;
		var sx, sy, dx, dy;
		var param;

		if (pim.color === 'cyan') {	c = 1; } else
		if (pim.color === 'magenta') { c = 0; } else
		if (pim.color === 'yellow') { c = 2; }

		if (pim.state === 'ghost') { s = 3; } else
		if (pim.state === 'zombie') { s = 2; } else
		if (pim.state === 'pim' && pim.dancing) { s = 0; } else
		if (pim.state === 'ghost') { s = 1; }

		if (pim.direction === 'right') { d = 0; } else
		if (pim.direction === 'left') { d = 1; } else
		if (pim.direction === 'down') { d = 2; } else
		if (pim.direction === 'up') { d = 3; }

		t = pim.tick;
		sx = (library.pim_size[2] * c * 4) + (t * library.pim_size[2]);
		if (s) {
			sy = library.pim_size[3] + ((s - 1) * library.pim_size[3] * 4) + (d * library.pim_size[3]);
		} else {
			//dancing pim1
			sy = 0;
		}
		dx = library.pim_size[2] * library.multiplier;
		dy = library.pim_size[3] * library.multiplier;

		//image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight
		param = [library.pim, sx, sy, library.pim_size[2], library.pim_size[3], pim.pos[0], pim.pos[1], dx, dy];
		elements.c.drawImage(param[0], param[1], param[2], param[3], param[4], param[5], param[6], param[7], param[8]);
		// console.log(param.join());
	}
}

function updatePim(num) {
	var pim = game.pims[num];
	var limit, potential, rate, movement = 10;

	if (pim.tick === 3) {
		pim.tick = 0;
		pim.countdown--;
		
		if (pim.primed && pim.prime_countdown === 0) {
			pim.primed = false;
			pim.prime_countdown = 10;
			console.log('disengaged pim');
		} else if (pim.primed) {
			pim.prime_countdown--;
		}
		
		if (pim.poof) {
			pim.poof = false;
		}
	} else {
		pim.tick++;
	}

	if (pim.countdown === 0 && pim.dancing) {
		pim.dancing = false;
		pim.direction = 'up';
		//start directing the pim up to the light
		// pim.goToLight();
	} else if (pim.countdown === 0 && !pim.dancing) {
		pim.changeDirection('random');
	}
	
	if (pim.state === 'ghost') { rate = 1.5; } else
	if (pim.state === 'zombie') { rate = 0.5; } else
	if (pim.state === 'pim') { rate = 1.0; }

	if (pim.primed) {
		pim.collide();
	}

	if (!pim.dancing) {
		if (pim.direction === 'left') {
			potential = pim.pos[0] - (movement * rate);
			if (potential <= 0) {
				pim.pos[0] = 0;
				pim.changeDirection('random');
			} else {
				pim.pos[0] = potential;
			}
		} else if (pim.direction === 'right') {
			potential = pim.pos[0] + (movement * rate);
			limit = library.canvas[0] - (library.pim_size[2] * library.multiplier);
			if (potential >= limit) {
				pim.pos[0] = limit;
				pim.changeDirection('random');
			} else {
				pim.pos[0] = potential;
			}
		} else if (pim.direction === 'up') {
			potential = pim.pos[1] - (movement * rate);
			if (potential <= 0) {
				pim.pos[1] = 0;
				pim.changeDirection('random');
			} else {
				pim.pos[1] = potential;
			}
		} else if (pim.direction === 'down') {
			potential = pim.pos[1] + (movement * rate);
			limit = library.canvas[1] - (library.pim_size[3] * library.multiplier);
			if (potential >= limit) {
				pim.pos[1] = limit;
				pim.changeDirection('random');
			} else {
				pim.pos[1] = potential;
			}
		}
	} else {
		//the pim is dancing
	}
}




function renderSkull(num) {
	var skull = game.skulls[num];
	elements.c.drawImage(library.skull, 0, 0, library.skull_size[0], library.skull_size[1], skull.pos[0], skull.pos[1], library.skull_size[0] * library.multiplier, library.skull_size[1] * library.multiplier);
}

function updateSkull(num) {
	var skull = game.skulls[num];
	if (skull.countdown === 0) {
		//remove this skull from the skulls array
		game.skulls.splice(num, 1);
		console.log('bye skull');
	} else {
		skull.countdown--;
	}
}





function renderMagic(num) {
	var magic = game.magic[num];

	// elements.c.drawImage(library.skull, 0, 0, library.skull_size[0], library.skull_size[1], skull.pos[0], skull.pos[1], library.skull_size[0] * library.multiplier, library.skull_size[1] * library.multiplier);
}

function updateMagic(num) {
	var magic = game.magic[num];
}





function initCreate() {
	//pims
	for (var i = 0; i < game.limit[0]; i++) {
		god();
	}

	//portals
}
function createSchtuff() {
	//skulls
	if (game.skulls.length < game.limit[1]) {
		for (var i = 0; i < game.limit[1] - game.skulls.length; i++) {
			if (Math.random() > 0.5) {
				chance();
			}
		}
	}

	//magic
	if (game.magic.length < game.limit[2]) {
		for (var j = 0; j < game.limit[2] - game.magic.length; j++) {
			if (Math.random() > 0.25) {
				fate();
			}
		}
	}
}
