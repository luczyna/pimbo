function init() {
	var r1 = init_screens();

	if (r1) {
		init_loadingImages();
		init_info();
	} else {
		// console.log('poop');
		//can't play, stoppppp
		uponFailure();
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
		m = 0.9;
	} else if (wx >= 400 && wx < 1000) {
		m = 1.0;
	} else if (wx >= 1000 && wx < 1600) {
		m = 1.5;
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
	var assets = [library.pim, library.magic, library.portal, library.poof, library.skull, library.bg];
	var music = [library.ghost_sound, library.zombie_sound, library.transform_sound, library.portal_sound, library.player_sound];
	library.pim.src = 'images/pimsheet.svg';
	library.magic.src = 'images/magic.svg';
	library.portal.src = 'images/portal.svg';
	library.poof.src = 'images/poof.svg';
	library.skull.src = 'images/skull.svg';
	library.bg.src = 'images/background.jpg';

	library.ghost_sound.src = 'track/Ghost_01.wav';
	library.zombie_sound.src = 'track/Action-02.wav';
	library.transform_sound.src = 'track/Powerup_01.wav';
	library.portal_sound.src = 'track/Portal-01.wav';
	library.player_sound.src = 'track/Function-Change-01.wav';

	for (var i = 0; i < assets.length; i++) {
		assets[i].addEventListener('load', finishedLoading, false);
	}
	for (var j = 0; j < music.length; j++) {
		music[j].addEventListener('canplay', finishedLoading, false);
	}
}

function init_info() {
	//check localStorage
	checkLocalStorage();

	//set the player action
	var playerRandom = Math.floor(Math.random() * 3);
	game.player = library.data.player[playerRandom];
	// console.log('the initial action is: ' + game.player);
	elements.player_action.textContent = game.player;

	//add functionality to opening screen
	prepareScreen();

	//add sound control to the info context
	elements.music.addEventListener('click', toggleSound, false);
}

function prepareScreen() {
	//event listeners
	elements.play.addEventListener('click', goToGame, false);
}
function goToGame() {
	//hide opening, show game
	elements.opening.style.opacity = 0;
	elements.opening.addEventListener('transitionend', goToGameScreen, false);
}
function goToGameScreen() {
	elements.opening.removeEventListener('transitionend', goToGameScreen, false);
	elements.opening.classList.add('hidden');
	elements.game.classList.remove('hidden');
	window.setTimeout(function() {
		elements.game.style.opacity = 1;
		elements.game.addEventListener('transitionend', prepGame, false);
	}, 100);
}
function prepGame() {
	console.log('the game should be starting');
	elements.game.removeEventListener('transitionend', prepGame, false);
	message('get ready', 2500);
	//start game
	window.setTimeout( function() {
		message('go!', 750);
		game_start();
	}, 3000);
}






function game_start() {
	//clean everything up
	elements.c.clearRect(0, 0, library.canvas[0], library.canvas[1]);
	elements.c.globalAlpha = 1;
	reset_game_info();

	//start the time
	game.start = new Date();
	game.running = true;
	initCreate();

	//start the intervals
	game.player_loop = window.setInterval(player_change_action, 5000);
	game.loop = window.setInterval(gameUpdate, 100);

	//add event listeners
	elements.help_button.addEventListener('click', showHelp, false);
	elements.canvas.addEventListener('click', pushPim, false);
}
function reset_game_info() {
	game.start = 0;
	game.end = 0;
	game.total = 0;
	game.score = 0;

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
	game.total += total;
	// var pretty = Math.floor(total) + ':';
	// pretty += 1 - (Math.ceil(total) - total);

	library.data.rounds++;
	var score = ( library.data.rounds * ((game.limit[0] / 3) + 3) * 1000 ) - (total * 60 * 2);
	score = Math.round(score);
	game.score = score;
	checkHighscore(score);

	showEnd();
}



//other stuff
function checkHighscore(num) {
	if (num && num > library.data.highscore) {
		library.data.highscore = num;
		window.localStorage['pimbo'] = num;
	}
}
function checkLocalStorage() {
	//does the localStorage exist?
	if (window.localStorage['pimbo']) {
		var hs = Number(window.localStorage['pimbo']);
		library.data.highscore = hs;
		elements.highscore_open.textContent = hs;
		elements.highscore_open.parentElement.classList.remove('hidden');
	} else {
		window.localStorage.setItem('pimbo', 0);
	}
}




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
	elements.help_button.classList.remove('helphover');

	//event listeners
	elements.canvas.removeEventListener('click', pushPim, false);
	elements.help_button.removeEventListener('click', showHelp, false);
	elements.info_close.addEventListener('click', hideHelp, false);
}
function updateHelpInfo() {
	var hs;
	var prettyTime = Math.floor(game.total) + ':';
	prettyTime += 60 * (1 - (Math.ceil(game.total) - game.total));

	elements.info_round.textContent = library.data.rounds + 1;
	elements.info_time.textContent = Math.round(game.total * 60)+ ' seconds';

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
	elements.help_button.classList.add('helphover');

	//start the game again
	game.running = true;
	game.start = new Date();
	game.player_loop = window.setInterval(player_change_action, 5000);
	game.loop = window.setInterval(gameUpdate, 100);

	//add event listeners
	elements.info_close.removeEventListener('click', hideHelp, false);
	elements.help_button.addEventListener('click', showHelp, false);
	elements.canvas.addEventListener('click', pushPim, false);
}




function showEnd() {
	//update ending info

	// elements.end_message.textContent = '';
	elements.end_ghosts.textContent = game.limit[0] + ' pims';
	elements.end_time.textContent = Math.round(game.total * 60) + ' seconds';
	elements.end_score.textContent = game.score;
	elements.highscore_end.textContent = library.data.highscore;
	elements.highscore_end.parentElement.classList.remove('hidden');


	//show the help
	elements.help_button.classList.remove('helphover');
	elements.ending.classList.remove('hidden');
	window.setTimeout(function() {
		elements.ending.style.opacity = 1;
	}, 500);

	//event listeners
	elements.canvas.removeEventListener('click', pushPim, false);
	elements.help_button.removeEventListener('click', showHelp, false);
	elements.play_again.addEventListener('click', playAgain, false);
}
function playAgain() {
	//hide the ending
	elements.ending.style.opacity = 0;
	elements.ending.addEventListener('transitionend', showGameScreenAgain, false);
}
function showGameScreenAgain() {
	this.removeEventListener('transitionend', showGameScreenAgain, false);
	elements.ending.classList.add('hidden');


	//event listeners
	elements.play_again.removeEventListener('click', playAgain, false);
	elements.canvas.addEventListener('click', pushPim, false);
	elements.help_button.addEventListener('click', showHelp, false);
	elements.help_button.classList.add('helphover');
	
	message('get ready', 2000);
	window.setTimeout(function() {
		game_start();
		message('go!', 500);
	}, 2000);
	
}







function message(str, t) {
	//clear the messages, incase
	// elements.message.textContent = '';

	//add a message to the screen
	elements.message.textContent = str;

	//show the message
	elements.message.classList.remove('hidden');

	//hide if after how many seconds?
	window.setTimeout( function() {
		elements.message.classList.add('hidden');		
	}, t);
}

function toggleSound() {
	if (library.data.music) {
		library.data.music = false;
		elements.music.textContent = 'sound is off';
	} else {
		library.data.music = true;
		elements.music.textContent = 'sound is on';
	}
}





function uponFailure() {
	var fail = document.createElement('p');
	fail.innerHTML = 'Sorry, this browser does not support <strong>canvas</strong>. You need canvas to play this game. Please consider another browser for your gaming pleasure.';
	elements.loading.appendChild(fail);
}

function finishedLoading() {
	// console.log(this + ' finished loading');
	this.removeEventListener('load', finishedLoading, false);
	library.assetsLoaded++;

	if (library.assetsLoaded === library.totalAssets) {
		allAssetsLoaded();
	}
}
function allAssetsLoaded() {
	//stop the bouncy ball
	elements.ball.classList.remove('bouncy');

	window.setTimeout(function() {
		//fade the ball screen away
		elements.loading.style.opacity = 0;
		elements.loading.addEventListener('transitionend', showHomeScreen, false);
	}, 500);
}
function showHomeScreen() {
	elements.loading.removeEventListener('transitionend', showHomeScreen, false);
	elements.loading.classList.add('hidden');
	elements.opening.classList.remove('hidden');
	//the fadeIn wasn't happening, it's all too fast
	window.setTimeout(function() {
		elements.opening.style.opacity = 1;
	}, 100);
}

