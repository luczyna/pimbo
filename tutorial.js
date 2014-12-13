// the tutorial
// is so important that it
// gets its own file

var tutorial = {
	'step': 0,
	'checking': null,
	'instructions': [
		//spawn a ghost, get him moving
		//++  0
		['Here is a ghost.', 'This ghost was once a pim. Now it floats around aimlessly, stuck in pimbo.', 'next'],
		//++  1 
		['You can help this ghost.', 'The ghost will continue to wander aimlessly, until you <strong>prime</strong> it. <strong>Click on the ghost to prime it.<strong>', "game.pims[0].primed"],
		//pause the motions right now, and spawn a skull
		//++  2
		['See the <strong>"!"</strong>', 'Now the ghost is primed: it\'s on the lookout for <strong>skulls</strong> now. Collecting <strong>skulls</strong> will turn the ghost into a zombie.', 'next'],
		['Priming doesn\'t last', 'The ghost will lose interest if left on it\'s own for too long. Clicking it again will <strong>prime</strong> it again.', 'next'],
		//get it moving again
		//++  4
		['Direct the ghost', 'See the container at the bottom? It contains the keyword that determines what happens when you click the ghost. It changes every 5 seconds. Use this to direct the ghost to the <strong>skull</strong>', "game.pims[0].state === 'zombie'"],
		['Look! A zombie!', 'Now that the ghost collected a <strong>skull</strong>, it\'s turned into a zombie. It\'s on its way to becoming a full fledged pim again.', 'next'],
		['Zombies need life.', 'Just like ghosts needed <strong>skulls</strong>, zombies will need <strong>life</strong> to become pims.', 'next'],
		//spawn magic
		//++  7
		['The same rules apply.', 'Direct the zombies by <strong>clicking</strong> them towards life. The color of the life must match the color of the pim, and it needs to be <strong>primed</strong> in order to know what to look for.', "game.pims[0].state === 'pim'"],
		//hold the dancing
		//++  8
		['Good job!', 'You helped the pim reach its true form. It\'s celebrating right now.', 'next'],
		['Clear the board.', 'To win the round, you will need to clear the board by helping all the pims reach their true form. The faster you are, the more points you\'ll get at the end of the round.', 'next'],
		//let the pim go
		//++  10
		['Going to the light', 'Pims finished will go to the light. Quite fitting.', 'again']
		//query about playing the tutorial again
	],

	next: function() {
		this.step++;
	},
	again: function() {
		this.step = 0;
	},
	amount: function() {
		return this.instructions.length;
	}
}

//where does this tutorial get accessed?
//opening screen
function accessTutorial() {
	//clear your event
	this.removeEventListener('click', accessTutorial, false);

	//okay, show the game screen
	elements.opening.style.opacity = 0;
	elements.opening.addEventListener('transitionend', goToTutorialScreen, false);
}
function goToTutorialScreen() {
	//clean up after yourself
	this.removeEventListener('transitionend', goToTutorialScreen, false);

	//prepare the canvas, make it half height for the tutorial?
	// elements.canvas.setAttribute('height', library.canvas[1] / 2);

	//finish showing game screen
	elements.opening.classList.add('hidden');
	elements.game.classList.remove('hidden');
	window.setTimeout(function() {
		elements.game.style.opacity = 1;
		elements.game.addEventListener('transitionend', prepTutorial, false);
	}, 100);
}
function prepTutorial() {
	//clean up after yourself
	this.removeEventListener('transitionend', prepTutorial, false);

	//then start the tutorial
	message('welcome to pimbo', 2500);
	window.setTimeout( function() {
		console.log('doing the tutorial');
		tutorial_start();
		showTutorialStep();
	}, 3000);
}

// the guts and glory
// of this here tutorial
// are execution

//this function SPECIFICALLY
//works very similarily to game_start()
//reference that function (in script.js)
//for any changes
function tutorial_start() {
	//clean everything up
	elements.c.clearRect(0, 0, library.canvas[0], library.canvas[1]);
	elements.c.globalAlpha = 1;
	reset_game_info('tutorial');

	//start the time
	game.start = new Date();
	game.running = true;

	//start the intervals
	game.player_loop = window.setInterval(player_change_action, 5000);
	game.loop = window.setInterval(gameUpdate, 100);

	//add event listeners
	// elements.help_button.addEventListener('click', showHelp, false);
	// elements.canvas.addEventListener('click', pushPim, false);
}
function showTutorialStep() {
	var step = tutorial.step;
	var next = tutorial.instructions[step][2];
	
	//update the tutorial content
	elements.tut_h.innerHTML = tutorial.instructions[step][0];
	elements.tut_p.innerHTML = tutorial.instructions[step][1];

	//what should the button do?
	if (next === 'next') {
		//go to the next step
		elements.tut_b.textContent = 'next';
		elements.tut_b.addEventListener('click', nextStepSimple, false);
		//should something else change?
		checkTutorialStep();
	} else if (next === 'again') {
		//offer to repeat the tutorial

	} else {
		//this is a check...
		//only go to the next step if 
		//this value comes back as true

		elements.tut_b.textContent = 'okay, try';
		elements.tut_b.addEventListener('click', startCheckingCriteria, false);
	}


	//show the tutorial box
	elements.tutorial.classList.remove('hidden');
}

function checkTutorialStep() {
	//at certain intervals, things need to happen
	switch (tutorial.step) {
		case 0:
			//spawn a pim
			console.log('step 0, spawned a pim')
			god();
			destination();
			break;
		case 1:
			console.log('step 1, added clicking ability to pim');
			elements.canvas.addEventListener('click', pushPim, false);
			break;
		case 2: 
			console.log('step 2, added skull, stopped game loop and clicking pim ability');
			toggleGameTutorialPlay('pause');
			chance();
			break;
		case 4: 
			console.log('step 4, started game loop and added clicking pim ability');
			toggleGameTutorialPlay('play');
			break;
		case 5:
			console.log('step 5, removing pim clicking');
			elements.canvas.removeEventListener('click', pushPim, false);
			break;
		case 7:
			console.log('step 7, spawning magic, adding click');
			fate();
			elements.canvas.addEventListener('click', pushPim, false);
			break;
		case 8:
			console.log('step 8, dancing!');
			elements.canvas.removeEventListener('click', pushPim, false);
			game.pims[0].countdown = -1;
			break;
		case 10:
			console.log('step 10, going to the light!');
			game.pims[0].countdown = 0;
			break;
		default:
			console.log('moving along');
	}
}
function toggleGameTutorialPlay(play) {
	if (play === 'play') {
		elements.canvas.addEventListener('click', pushPim, false);
		game.loop = window.setInterval(gameUpdate, 100);
	} else {
		window.clearInterval(game.loop);
		elements.canvas.removeEventListener('click', pushPim, false);
	}
}

function nextStepSimple() {
	//clean up
	this.removeEventListener('click', nextStepSimple, false);

	//hide the tutorial breifly
	elements.tutorial.classList.add('hidden');

	//now update
	tutorial.next();
	showTutorialStep();
}
function startCheckingCriteria() {
	//clean up
	this.removeEventListener('click', startCheckingCriteria, false);

	//hide the tutorial breifly
	elements.tutorial.classList.add('hidden');

	//should something else change?
	checkTutorialStep();

	//start checking
	tutorial.checking = window.setInterval(checkingCriteria, 100);
}
function checkingCriteria() {
	//check to see if the instructions criteria is true
	//only then can we progress
	var str = tutorial.instructions[tutorial.step][2];
	
	// I can only think of eval()
	// is there any other way?
	// I don't see the danger of using it here
	// but open to other strategy
	if (eval(str)) {
		// criteria is fulfilled, stop this loop;
		window.clearInterval(tutorial.checking);

		//now update
		tutorial.next();
		showTutorialStep();
	}
}
