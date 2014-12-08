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
	game.limit[2] = Math.floor(Math.random() * 5) + game.round * 2 + 10 * 2;

	window.clearInterval(game.loop);
	window.clearInterval(game.player_loop);
	game.player = library.data.player[Math.floor(Math.random() * 3)];
}
function roundOver() {
	//congratulations!


	//stop things that need to be stopped
	game.running = false;
	game.finished = true;
	// window.clearInterval(game.loop);
	window.clearInterval(game.player_loop);
	elements.canvas.removeEventListener('click', pushPim, false);
	
	//what's our ending info?
	game.end = new Date();
	//take into account the saved time from pauses later
	var total = (game.end.getTime() - game.start.getTime()) / 1000 / 60;
	var pretty = Math.floor(total) + ':';
	pretty += 1 - (Math.ceil(total) - total);

	library.data.rounds++;
	var score = ( library.data.rounds * ((game.limit[0] / 3) + 3) * 1000 ) - (total * 60 * 2);

	var message = 'You completed the game! You cleared ' + game.limit[0] + ' pims in ' + pretty + '. This was round ' + library.data.rounds + ', so your score was ' + score + '.';
	console.log(message);

}



//other stuff
function showHelp() {
	//pause game
	game.running = false;
	window.clearInterval(game.loop);
	window.clearInterval(game.player_loop);

	//note the time
	game.end = new Date();

	var total = (game.end.getTime() - game.start.getTime()) / 1000 / 60;
	game.total += total;

	//update help info
	updateHelpInfo();

	//show the help
	elements.info.classList.remove('hidden');

	//event listeners
	elements.canvas.removeEventListener('click', pushPim, false);
	elements.info_close.addEventListener('click', hideHelp, false);
}
function updateHelpInfo() {
	var hs;
	var prettyTime = Math.floor(game.total) + ':';
	prettyTime += 1 - (Math.ceil(game.total) - game.total);

	elements.info_round.textContent = library.data.rounds + 1;
	elements.info_time.textContent = prettyTime;

	if (library.data.highscore) {
		hs = library.data.highscore;
	} else {
		hs = 'noop';
	}
	elements.highscore_info.textContent = hs;
}
function hideHelp() {
	//hide the help
	elements.info.classList.add('hidden');

	//start the game again
	game.running = true;
	game.start = new Date();
	game.player_loop = window.setInterval(player_change_action, 5000);
	game.loop = window.setInterval(gameUpdate, 100);

	//add event listeners
	elements.info_close.removeEventListener('click', hideHelp, false);
	elements.canvas.addEventListener('click', pushPim, false);
}


