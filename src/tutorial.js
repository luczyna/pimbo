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
        ['Direct the ghost', 'See the container at the bottom? It contains the keyword that determines what happens when you click the ghost. It changes every 5 seconds. Use this to direct the ghost to the <strong>skull</strong>.', "game.pims[0].state === 'zombie'"],
        ['Look! A zombie!', 'Now that the ghost collected a <strong>skull</strong>, it\'s turned into a zombie. It\'s on its way to becoming a full fledged pim again.', 'next'],
        ['Zombies need life.', 'Just like ghosts needed <strong>skulls</strong>, zombies will need <strong>life</strong> to become pims.', 'next'],
        //spawn magic
        //++  7
        ['The same rules apply.', 'Direct the zombies by <strong>clicking</strong> them towards life. The color of the life must match the color of the pim, and it needs to be <strong>primed</strong> in order to know what to look for.', "game.pims[0].state === 'pim'"],
        //hold the dancing
        //++  8
        ['Good job!', 'You helped the pim reach its true form. It\'s celebrating right now.', 'next'],
        //let the pim go
        //++  9
        ['Clear the board.', 'To win the round, you will need to clear the board by helping all the pims reach their true form. The faster you are, the more points you\'ll get at the end of the round.', 'next'],
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
};

//where does this tutorial get accessed?
//opening screen
function accessTutorial() {
    //clear your event
    this.removeEventListener('click', accessTutorial, false);
    this.removeEventListener('touchstart', accessTutorial, false);

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
        // console.log('doing the tutorial');
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
        elements.tut_b.addEventListener('touchstart', nextStepSimple, false);
        //should something else change?
        checkTutorialStep();
    } else if (next === 'again') {
        //offer to repeat the tutorial
        elements.tut_b.textContent = 'repeat?';
        elements.tut_b.addEventListener('click', repeatTutorial, false);
        elements.tut_b.addEventListener('touchstart', repeatTutorial, false);

        //or take me to game play?
        var button = document.createElement('p');
        button.classList.add('button', 'gotogame');
        button.textContent = 'start playing';
        elements.tutorial.appendChild(button);
        button.addEventListener('click', leaveTutorial, false);
        button.addEventListener('touchstart', leaveTutorial, false);

    } else {
        //this is a check...
        //only go to the next step if 
        //this value comes back as true

        elements.tut_b.textContent = 'okay, try';
        elements.tut_b.addEventListener('click', startCheckingCriteria, false);
        elements.tut_b.addEventListener('touchstart', startCheckingCriteria, false);
    }


    //show the tutorial box
    elements.tutorial.classList.remove('hidden');
}

function checkTutorialStep() {
    //at certain intervals, things need to happen
    switch (tutorial.step) {
        case 0:
            //spawn a pim
            // console.log('step 0, spawned a pim');
            god();
            destination();
            break;
        case 1:
            // console.log('step 1, added clicking ability to pim');
            elements.canvas.addEventListener('click', pushPim, false);
            elements.canvas.addEventListener('touchstart', pushPim, false);
            break;
        case 2: 
            // console.log('step 2, added skull, stopped game loop and clicking pim ability');
            chance();
            window.setTimeout(toggleGameTutorialPlay, 100);
            // toggleGameTutorialPlay('pause');
            break;
        case 4: 
            // console.log('step 4, started game loop and added clicking pim ability');
            toggleGameTutorialPlay('play');
            break;
        case 5:
            // console.log('step 5, removing pim clicking');
            elements.canvas.removeEventListener('click', pushPim, false);
            elements.canvas.removeEventListener('touchstart', pushPim, false);
            break;
        case 6:
            // console.log('step 6, spawning magic, a lot of it');
            for (var i = 0; i < 10; i++) {
                fate();
            }
            break;
        case 7:
            // console.log('step 7, adding click');
            // fate();
            elements.canvas.addEventListener('click', pushPim, false);
            elements.canvas.addEventListener('touchstart', pushPim, false);
            break;
        case 8:
            // console.log('step 8, dancing!');
            elements.canvas.removeEventListener('click', pushPim, false);
            elements.canvas.removeEventListener('touchstart', pushPim, false);

            game.pims[0].countdown = -1;
            break;
        case 9:
            // console.log('step 9, going to the light!');
            // console.log(game.pims[0].countdown);
            game.pims[0].countdown = 1;
            // console.log(game.pims[0].countdown);
            break;
        default:
            // console.log('moving along');
            break;
    }
}
function toggleGameTutorialPlay(play) {
    if (play === 'play') {
        elements.canvas.addEventListener('click', pushPim, false);
        elements.canvas.addEventListener('touchstart', pushPim, false);
        game.loop = window.setInterval(gameUpdate, 100);
    } else {
        window.clearInterval(game.loop);
        elements.canvas.removeEventListener('click', pushPim, false);
        elements.canvas.removeEventListener('touchstart', pushPim, false);
    }
}

function nextStepSimple(event) {
    //clean up
    this.removeEventListener('click', nextStepSimple, false);
    this.removeEventListener('touchstart', nextStepSimple, false);

    //hide the tutorial breifly
    elements.tutorial.classList.add('hidden');

    //now update
    tutorial.next();
    showTutorialStep();

    event.preventDefault();
}
function startCheckingCriteria(event) {
    //clean up
    this.removeEventListener('click', startCheckingCriteria, false);
    this.removeEventListener('touchstart', startCheckingCriteria, false);

    //hide the tutorial breifly
    elements.tutorial.classList.add('hidden');

    //should something else change?
    checkTutorialStep();

    //start checking
    tutorial.checking = window.setInterval(checkingCriteria, 100);

    event.preventDefault();
}
function checkingCriteria() {
    //check to see if the instructions criteria is true
    //only then can we progress
    var str = tutorial.instructions[tutorial.step][2];
    
    // I can only think of eval()
    // is there any other way?
    // I don't see the danger of using it here
    // but open to other strategy
    if (eval(str)) { // jshint ignore:line
        // criteria is fulfilled, stop this loop;
        window.clearInterval(tutorial.checking);

        //now update
        tutorial.next();
        showTutorialStep();
    }
}

function repeatTutorial(event) {
    //clean up after yourself
    this.removeEventListener('click', repeatTutorial, false);
    this.removeEventListener('touchstart', repeatTutorial, false);
    var removeThis = this.parentNode.getElementsByTagName('p')[2];
    this.parentNode.removeChild(removeThis);

    //hide the tutorial breifly
    elements.tutorial.classList.add('hidden');

    //rewind
    tutorial.step = 0;

    //then start the tutorial
    message('welcome to pimbo', 2500);
    window.setTimeout( function() {
        // console.log('doing the tutorial');
        tutorial_start();
        showTutorialStep();
    }, 3000);

    event.preventDefault();
}
function leaveTutorial(event) {
    //clean up
    this.removeEventListener('click', leaveTutorial, false);
    this.removeEventListener('touchstart', leaveTutorial, false);
    this.parentNode.removeChild(this);
    elements.tut_b.removeEventListener('click', repeatTutorial, false);
    elements.tut_b.removeEventListener('touchstart', repeatTutorial, false);

    //hide the tutorial
    elements.tutorial.classList.add('hidden');

    //now start the game
    message('good job, now have fun', 2000);
    window.setTimeout( function() {
        prepGame();
    }, 3000);

    event.preventDefault();
}
