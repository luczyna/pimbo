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
    library.canvas[0] = wx;
    library.canvas[1] = wy;
    var m;
    if (wx < 400) {
        m = 0.75;
    } else if (wx >= 400 && wx < 1000) {
        m = 1.25;
    } else if (wx >= 1000 && wx < 1600) {
        m = 1.5;
    } else if (wx >= 1600) {
        m = 2;
    } else {
        m = 1;
    }
    library.multiplier = m;

    //set the message position
    elements.message.style.top = library.scr[1] * 0.45 + 'px';

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
    var assets = [library.pim, library.magic, library.portal, library.poof, library.skull, library.bg, library.excla];
    var music = [library.ghost_sound, library.zombie_sound, library.transform_sound, library.portal_sound, library.player_sound];
    library.pim.src = 'images/pimsheet.svg';
    library.magic.src = 'images/magic.svg';
    library.portal.src = 'images/portal.svg';
    library.poof.src = 'images/poof.svg';
    library.skull.src = 'images/skull.svg';
    library.bg.src = 'images/background_3.svg';
    library.excla.src = 'images/exclamation.svg';

    library.ghost_sound.src = 'track/Ghost_01.wav';
    library.zombie_sound.src = 'track/Action-02.wav';
    library.transform_sound.src = 'track/Powerup_01.wav';
    library.portal_sound.src = 'track/Portal-01.wav';
    library.player_sound.src = 'track/Function-Change-01.wav';

    for (var i = 0; i < assets.length; i++) {
        assets[i].addEventListener('load', finishedLoading, false);
    }

    var test = document.createElement('audio');
    test.setAttribute('oncanplay', 'return');

    // var t = document.createElement('p');
    // t.textContent = test.oncanplay + '  - this browser recognises the play function';
    // elements.loading.appendChild(t);
    
    if (test.oncanplay === null) {
        for (var j = 0; j < music.length; j++) {
            music[j].addEventListener('canplay', finishedLoading, false);
        }
    } else {
        //fake the loading of the 5 audio elements
        finishedLoading();
        finishedLoading();
        finishedLoading();
        finishedLoading();
        finishedLoading();
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
    elements.music.addEventListener('touchstart', toggleSound, false);
}

function prepareScreen() {
    //event listeners
    elements.play.addEventListener('click', goToGame, false);
    elements.play.addEventListener('touchstart', goToGame, false);
    elements.open_tutorial.addEventListener('click', accessTutorial, false);
    elements.open_tutorial.addEventListener('touchstart', accessTutorial, false);
}
function goToGame(event) {
    //hide opening, show game
    elements.opening.style.opacity = 0;
    elements.opening.addEventListener('transitionend', goToGameScreen, false);

    event.preventDefault();
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
    // console.log('the game should be starting');
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
    reset_game_info('game');

    //start the time
    game.start = new Date();
    game.running = true;
    initCreate();

    //start the intervals
    game.player_loop = window.setInterval(player_change_action, 5000);
    game.loop = window.setInterval(gameUpdate, 100);

    //add event listeners
    elements.help_button.addEventListener('click', showHelp, false);
    elements.help_button.addEventListener('touchstart', showHelp, false);
    elements.canvas.addEventListener('click', pushPim, false);
    elements.canvas.addEventListener('touchstart', pushPim, false);
}
function reset_game_info(forwhat) {
    game.start = 0;
    game.end = 0;
    game.total = 0;
    game.score = 0;

    game.running = false;
    game.finished = false;

    if (forwhat === 'tutorial') {
        game.pims.length = 0;
        game.skulls.length = 0;
        game.magic.length = 0;
        
        game.limit[0] = 1;
        game.limit[1] = 0;
        game.limit[2] = 0;
    } else {
        //it's for the game
        game.round = library.data.rounds;
        game.pims.length = 0;
        game.skulls.length = 0;
        game.magic.length = 0;
        
        game.limit[0] = game.round + 3;
        game.limit[1] = game.round + 3;
        game.limit[2] = Math.floor(Math.random() * 5) + game.round * 2 + 10;
    }

    window.clearInterval(game.loop);
    window.clearInterval(game.player_loop);
    game.player = library.data.player[Math.floor(Math.random() * 3)];
}
function roundOver() {
    //congratulations!


    //stop things that need to be stopped
    game.running = false;
    game.finished = true;
    window.clearInterval(game.player_loop);
    elements.canvas.removeEventListener('click', pushPim, false);
    elements.canvas.removeEventListener('touchstart', pushPim, false);
    
    //what's our ending info?
    game.end = new Date();
    //take into account the saved time from pauses later
    var total = (game.end.getTime() - game.start.getTime()) / 1000 / 60;
    game.total += total;


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
        window.localStorage['pimbo'] = num; // jshint ignore:line
    }
}
function checkLocalStorage() {
    //does the localStorage exist?
    if (window.localStorage['pimbo']) { // jshint ignore:line
        var hs = Number(window.localStorage['pimbo']); // jshint ignore:line
        library.data.highscore = hs;
        elements.highscore_open.textContent = hs;
        elements.highscore_open.parentElement.classList.remove('hidden');
    } else {
        window.localStorage.setItem('pimbo', 0);
    }
}




function showHelp(event) {
    //pause game
    game.running = false;
    window.clearInterval(game.loop);
    window.clearInterval(game.player_loop);
    elements.help_button.textContent = '>';

    //note the time
    game.end = new Date();

    var total = (game.end.getTime() - game.start.getTime()) / 1000 / 60;
    game.total += total;

    //update help info
    updateHelpInfo();

    //show the help
    elements.info.classList.remove('hidden');
    window.setTimeout( function() {
        elements.info.style.opacity = 1;
    }, 100);
    elements.help_button.classList.remove('helphover');

    //event listeners
    elements.canvas.removeEventListener('click', pushPim, false);
    elements.canvas.removeEventListener('touchstart', pushPim, false);
    elements.help_button.removeEventListener('click', showHelp, false);
    elements.help_button.removeEventListener('touchstart', showHelp, false);
    elements.info_close.addEventListener('click', hideHelp, false);
    elements.info_close.addEventListener('touchstart', hideHelp, false);

    event.preventDefault();
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
function hideHelp(event) {
    //hide the help
    elements.info.style.opacity = 0;

    elements.help_button.textContent = '||';

    //evnt listeners and stuff
    elements.help_button.classList.add('helphover');
    elements.info_close.removeEventListener('click', hideHelp, false);
    elements.info_close.removeEventListener('touchstart', hideHelp, false);
    elements.info.addEventListener('transitionend', startGameAgain, false);

    event.preventDefault();
}
function startGameAgain() {
    elements.info.removeEventListener('transitionend', startGameAgain, false);
    elements.info.classList.add('hidden');
    
    window.setTimeout( function() {
        //start the game again
        game.running = true;
        game.start = new Date();
        game.player_loop = window.setInterval(player_change_action, 5000);
        game.loop = window.setInterval(gameUpdate, 100);

        //add event listeners
        elements.help_button.addEventListener('click', showHelp, false);
        elements.help_button.addEventListener('touchstart', showHelp, false);
        elements.canvas.addEventListener('click', pushPim, false);
        elements.canvas.addEventListener('touchstart', pushPim, false);

    }, 200);
}




function showEnd() {
    //update ending info

    elements.end_message.textContent = endGameMessage();
    elements.end_ghosts.textContent = game.limit[0] + ' pims';
    elements.end_time.textContent = Math.round(game.total * 60) + ' seconds';
    elements.end_score.textContent = game.score;
    elements.highscore_end.textContent = library.data.highscore;
    elements.highscore_end.parentElement.classList.remove('hidden');


    //show the end
    elements.help_button.classList.remove('helphover');
    elements.ending.classList.remove('hidden');
    window.setTimeout(function() {
        elements.ending.style.opacity = 1;
    }, 500);

    //event listeners
    elements.canvas.removeEventListener('click', pushPim, false);
    elements.canvas.removeEventListener('touchstart', pushPim, false);
    elements.help_button.removeEventListener('click', showHelp, false);
    elements.help_button.removeEventListener('touchstart', showHelp, false);
    elements.play_again.addEventListener('click', playAgain, false);
    elements.play_again.addEventListener('touchstart', playAgain, false);
}
function playAgain(event) {
    //hide the ending
    elements.ending.style.opacity = 0;
    elements.ending.addEventListener('transitionend', showGameScreenAgain, false);

    event.preventDefault();
}
function showGameScreenAgain() {
    this.removeEventListener('transitionend', showGameScreenAgain, false);
    elements.ending.classList.add('hidden');


    //event listeners
    elements.play_again.removeEventListener('click', playAgain, false);
    elements.play_again.removeEventListener('touchstart', playAgain, false);
    
    message('get ready', 2000);
    window.setTimeout(function() {
        game_start();
        message('go!', 500);
    
        elements.canvas.addEventListener('touchstart', pushPim, false);
        elements.canvas.addEventListener('click', pushPim, false);
        elements.help_button.addEventListener('click', showHelp, false);
        elements.help_button.addEventListener('touchstart', showHelp, false);
        elements.help_button.classList.add('helphover');
    }, 2000);
    
}







function message(str, t) {
    //add a message to the screen
    elements.message.textContent = str;

    //show the message
    elements.message.classList.remove('hidden');

    //hide if after how many seconds?
    window.setTimeout( function() {
        elements.message.classList.add('hidden');       
    }, t);
}

function toggleSound(event) {
    if (library.data.music) {
        library.data.music = false;
        elements.music.textContent = 'sound is off';
    } else {
        library.data.music = true;
        elements.music.textContent = 'sound is on';
    }

    event.preventDefault();
}





function uponFailure() {
    var fail = document.createElement('p');
    fail.innerHTML = 'Sorry, this browser does not support <strong>canvas</strong>. You need canvas to play this game. Please consider another browser for your gaming pleasure.';
    elements.loading.appendChild(fail);
}

function finishedLoading() {
    // console.log(this.src + ' finished loading');
    this.volume = 0.45;
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

function endGameMessage() {
    var t = game.total * 60;
    var message, which, rank;
    if (t > 120) {
        rank = 2;
    } else if (t > 30 && t <= 120) {
        rank = 1;
    } else if (t <= 30) {
        rank = 0;
    }
    which = Math.floor(Math.random() * endMessages[rank].length);
    message = endMessages[rank][which];
    console.log('end message: ' + message);
    return message;
}

