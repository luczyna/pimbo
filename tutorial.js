// the tutorial
// is so important that it
// gets its own file

var tutorial = {
	'step': 0,
	'instructions': [
		//spawn a ghost, get him moving
		['Here is a ghost.', 'This ghost was once a pim. Now it floats around aimlessly, stuck in pimbo.', 'next'],
		['You can help this ghost.', 'The ghost will continue to wander aimlessly, until you <strong>prime</strong> it. <strong>Click on the ghost to prime it.<strong>', game.pims[0].primed],
		//pause the motions right now, and spawn a skull
		['See the <strong>"!"</strong>', 'Now the ghost is primed: it\'s on the lookout for <strong>skulls</strong> now. Collecting <strong>skulls</strong> will turn the ghost into a zombie.', 'next'],
		['Priming doesn\'t last', 'The ghost will lose interest if left on it\'s own for too long. Clicking it again will <strong>prime</strong> it again.', 'next'],
		//get it moving again
		['Direct the ghost', 'See the container at the bottom? It contains the keyword that determines what happens when you click the ghost. It changes every 5 seconds. Use this to direct the ghost to the <strong>skull</strong>', game.pims[0].state === 'zombie'],
		['Look! A zombie!', 'Now that the ghost collected a <strong>skull</strong>, it\'s turned into a zombie. It\'s on its way to becoming a full fledged pim again.', 'next'],
		['Zombies need life.', 'Just like ghosts needed <strong>skulls</strong>, zombies will need <strong>life</strong> to become pims.', 'next'],
		//spawn magic
		['The same rules apply.', 'Direct the zombies by <strong>clicking</strong> them towards life. The color of the life must match the color of the pim, and it needs to be <strong>primed</strong> in order to know what to look for.', game.pims[0].state === 'pim'],
		//hold the dancing
		['Good job!', 'You helped the pim reach its true form. It\'s celebrating right now.', 'next'],
		['Clear the board.', 'To win the round, you will need to clear the board by helping all the pims reach their true form. The faster you are, the more points you\'ll get at the end of the round.', 'next'],
		//let the pim go
		['Going to the light', 'Pims finished will go to the light. Quite fitting.' 'again']
		//query about playing the tutorial again
	],
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

	//start game
	window.setTimeout( function() {
		message('go!', 750);
		game_start();
	}, 3000);
}
}