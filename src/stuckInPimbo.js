var library = {
    //images
    'pim': new Image(),
    'magic': new Image(),
    'portal': new Image(),
    'poof': new Image(),
    'skull': new Image(),
    'bg': new Image(),
    'excla': new Image(),

    //music
    'ghost_sound': new Audio(),
    'zombie_sound': new Audio(),
    'transform_sound': new Audio(),
    'portal_sound': new Audio(),
    'player_sound': new Audio(),

    'totalAssets': 12,
    'assetsLoaded': 0,

    //ratios
    'scr': [],
    'canvas': [],
    'multiplier': 0,
    //[x, y, frame_x, frame_y]
    'pim_size': [864, 1248, 72, 96],
    'magic_size': [256, 192, 64, 64],
    'portal_size': [288, 64, 72, 64],
    'poof_size': [288, 96, 72, 96],
    'skull_size': [64, 64],
    'excla_size': [14, 32],
    'bg_size': [100, 500],

    //dataaa
    'data': {
        'poop': false,
        'highscore': null,
        'rounds': 0,
        'music': true,
        'player': ['reverse', 'clockwise', 'counter-clockwise'],
        'color': ['cyan', 'magenta', 'yellow']
    }
};

var game = {
    //time
    'start': null,
    'end': null,
    'total': 0,
    'score': 0,

    //status
    'running': false,
    'finished': true,

    //each round has new info
    'round': 0,
    'pims': [],
    'skulls': [],
    'magic': [],
    'portal': [],
        //[pims, skulls, magic, portals]
    'limit': [null, null, null, 1],
    'player': null,
    'player_loop': null,
    'loop': null,
};

var elements = {
    'loading': document.getElementById('loading-screen'),
    'opening': document.getElementById('open-screen'),
    'game': document.getElementById('game-screen'),
    'ending': document.getElementById('end-screen'),
    'info': document.getElementById('info-screen'),
    
    'player_action': document.getElementById('game-action'),
    'canvas': document.getElementById('game-canvas'),
    'c': null,

    'ball': document.querySelector('.ball'),

    'info_round': document.getElementById('info-round'),
    'info_time': document.getElementById('info-time'),
    
    'end_message': document.querySelector('.rando'),
    'end_ghosts': document.getElementById('end-ghost-count'),
    'end_time': document.getElementById('end-time'),
    'end_score': document.getElementById('end-score'),

    'open_tutorial': document.getElementById('open-tutorial'),
    'tutorial': document.getElementById('tutorial'),
    'tut_h': document.getElementById('tutorial').querySelector('h2'),
    'tut_p': document.getElementById('tutorial').querySelectorAll('p')[0],
    'tut_b': document.getElementById('tutorial').querySelectorAll('p')[1],
    
    'play': document.getElementById('open-play'),
    'play_again': document.getElementById('end-play'),
    'help_button': document.getElementById('game-help'),
    'info_close': document.getElementById('info-closer'),
    'message': document.getElementById('mega-message'),
    'music': document.getElementById('sound-toggle'),

    'highscore_open': document.getElementById('open-hs'),
    'highscore_info': document.getElementById('info-highscore'),
    'highscore_end': document.getElementById('end-hs'),
};

var endMessages = [
    //great job!
    [
        'You\'ve saved a generation of pims.',
        'All the pims were saved, and slept soundly that night.',
        'The rescue pims-from-pimbo plan was completed so quickly, you\'ll be mailed a medal in 2 weeks.',
        'We all outta pims.',
        'The pims are thankful.',
        'Making it through the light, the pims lived to see another pimbo.'
    ],
    //okay job
    [
        'You might be seeing more pims in pimbo, son.',
        'Better check that all the zombies are gone.',
        'The pims won\'t get you... today.',
        'So proud. So pim. So wow.',
        'I might be emotional right now.',
    ],
    //woah, you need to check yoself
    [
        'I might be emotional, but not for any of the right reasons.',
        'You all outta skill',
        'Go home, player. You must be drunk.',
        'The pims are coming to get you for making them suffer in pimbo for so long.',
        'Pimter is coming.',
        'Get ready to live in pimbo, you got a first class ticket there.',
        'Could you take any longer? Gaw!',
        'You turned into a zombie for taking so long to save the pims.',
    ]
];
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
        //should something else change?
        checkTutorialStep();
    } else if (next === 'again') {
        //offer to repeat the tutorial
        elements.tut_b.textContent = 'repeat?';
        elements.tut_b.addEventListener('click', repeatTutorial, false);

        //or take me to game play?
        var button = document.createElement('p');
        button.classList.add('button', 'gotogame');
        button.textContent = 'start playing';
        elements.tutorial.appendChild(button);
        button.addEventListener('click', leaveTutorial, false);

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
            // console.log('step 0, spawned a pim');
            god();
            destination();
            break;
        case 1:
            // console.log('step 1, added clicking ability to pim');
            elements.canvas.addEventListener('click', pushPim, false);
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
            break;
        case 8:
            // console.log('step 8, dancing!');
            elements.canvas.removeEventListener('click', pushPim, false);
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
    if (eval(str)) { // jshint ignore:line
        // criteria is fulfilled, stop this loop;
        window.clearInterval(tutorial.checking);

        //now update
        tutorial.next();
        showTutorialStep();
    }
}

function repeatTutorial() {
    //clean up after yourself
    this.removeEventListener('click', repeatTutorial, false);
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
}
function leaveTutorial() {
    //clean up
    this.removeEventListener('click', leaveTutorial, false);
    this.parentNode.removeChild(this);
    elements.tut_b.removeEventListener('click', repeatTutorial, false);

    //hide the tutorial
    elements.tutorial.classList.add('hidden');

    //now start the game
    message('good job, now have fun', 2000);
    window.setTimeout( function() {
        prepGame();
    }, 3000);
}

//constructors
function Pim(color) {
    this.color = color;
    this.state = 'ghost';
    this.tick = 0;
    this.direction = 'down';
    this.done = false;
    this.onDestiny = false;
    this.destiny = [null, null];
    this.countdown = (Math.floor(Math.random() * 6) + 1);
    this.primed = false;
    this.prime_countdown = 10;
    this.poof = false;
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
        // console.log('changed direction, thanks human');
        //complete it by starting a new countdown
        this.prime_countdown = 10;
    }

};
Pim.prototype.collide = function() {
    var pd = [];
    pd[0] = this.pos[0];
    pd[1] = this.pos[1];

    if (this.state === 'ghost') {
        this.checkCollide('skulls', 0.65, pd);
    } else if (this.state === 'zombie') {
        this.checkCollide('magic', 0.55, pd);
    }
};
Pim.prototype.checkCollide = function(obj, sensitivity, pd) {
    //pd is the Pim Distance/Origin value, like it's left or right most point
    //obj could be skulls or magic
    var check = game[obj];
    var threshold = [sensitivity * library.pim_size[2], sensitivity * library.pim_size[3]];
    var message, item, id = [], collect = false;

    //now we go through each of the object items
    for (var i = 0; i < check.length; i++) {
        item = check[i];
        id[0] = item.pos[0];
        id[1] = item.pos[1];

        if (Math.abs(id[0] - pd[0]) <= threshold[0] && Math.abs(id[1] - pd[1]) <= threshold[1]) {
            if (this.state === 'zombie' && (this.color === item.color)) {
                //the zombie interacted with the correct color magic
                // message = 'The ' + this.color + ' pim going ' + this.direction + ' touched the ' + item.color + ' magic. The pim was at ' + pd + ' the magic was at ' + id + '.';
                // console.log(message);
                collect = true;
            } else if (this.state === 'ghost') {
                //the ghost can find any skull
                // message = 'The ' + this.color + ' ghost going ' + this.direction + ' touched the skull at ' + id + '. The pim was at ' + pd + ', the distance was ' + [Math.abs(id[0] - pd[0]), Math.abs(id[1] - pd[1])] + ' and the sensitivity was ' + threshold + '.';
                // console.log(message);
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
            //reset collect
            collect = false;
        }
    }
};
Pim.prototype.goToLight = function() {
    // console.log('going to the light');
    this.onDestiny = true;
    this.destiny[0] = game.portal[0].pos[0];
    this.destiny[1] = 0;

    //start moving towards x
    if (this.pos[0] < this.destiny[0]) {
        this.direction = 'right';
    } else {
        this.direction = 'left';
    }
};


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

    //does this correlate with any pims?
    for (var i = 0; i < game.pims.length; i++) {
        var pim = game.pims[i];
        var distx = pim.pos[0] - input[0];
        var disty = pim.pos[1] - input[1];
        // console.log('this is the distance for the ' + pim.color + ' pim: ' + distx + ' ' + disty);

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
    playMusic(library.player_sound);
}

function gameUpdate() {
    //render things
    gameRender();

    //update things
    gameInfoUpdate();

    //spawn things
    if (game.running) {
        createSchtuff();
    }
}

function gameRender() {
    //clear it all
    elements.c.clearRect(0, 0, library.canvas[0], library.canvas[1]);

    //render portal
    renderPortal();

    //render skulls
    for (var i = 0; i < game.skulls.length; i++) {
        renderSkull(i);
    }

    //render magic
    for (var j = 0; j < game.magic.length; j++) {
        renderMagic(j);
    }

    //render pims
    for (var k = 0; k < game.pims.length; k++) {
        renderPim(k);
    }
}
function gameInfoUpdate() {
    //magic?
    for (var j = 0; j < game.magic.length; j++) {
        updateMagic(j);
    }

    //pims?
    for (var k = 0; k < game.pims.length; k++) {
        updatePim(k);
    }

    //portal?
    updatePortal();
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
            if (Math.random() > 0.9) {
                fate();
            }
        }
    }
}
function initCreate() {
    //pims
    for (var i = 0; i < game.limit[0]; i++) {
        god();
    }

    //portals
    destination();
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

        if (pim.color === 'cyan') { c = 1; } else
        if (pim.color === 'magenta') { c = 0; } else
        if (pim.color === 'yellow') { c = 2; }

        if (pim.state === 'ghost') { s = 3; } else
        if (pim.state === 'zombie') { s = 2; } else
        if (pim.state === 'pim' && pim.dancing) { s = 0; } else
        if (pim.state === 'pim') { s = 1; }

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
        //if the pim is primed, then draw a '!' above them
        if (pim.primed) {
            var offset;
            if (pim.state === 'ghost') {
                offset = pim.pos[1] + 17 - library.excla_size[1] * library.multiplier;
            } else {
                offset = pim.pos[1] - library.excla_size[1] * library.multiplier;
            }
            elements.c.drawImage(
                library.excla,
                0,
                0,
                library.excla_size[0],
                library.excla_size[1],
                pim.pos[0] + dx / 2.5,
                offset,
                library.excla_size[0] * library.multiplier,
                library.excla_size[1] * library.multiplier
            );
        }
        elements.c.drawImage(param[0], param[1], param[2], param[3], param[4], param[5], param[6], param[7], param[8]);
        // console.log(param.join());
    }
}
function updatePim(num) {
    var pim = game.pims[num];
    var limit, potential, rate, movement = 10;

    if (pim.tick === 3) {
        pim.tick = 0;
        if (!pim.onDestiny) {
            pim.countdown--;
        }
        
        if (pim.primed && pim.prime_countdown === 0) {
            pim.primed = false;
            // console.log('disengaged pim');
            pim.prime_countdown = 10;
            if (pim.state === 'pim') {
                console.log('we got issue');
            }
        } else if (pim.primed) {
            pim.prime_countdown--;
        }
        if (pim.poof) {
            pim.poof = false;
            if (pim.onDestiny) {
                pim.done = true;
                //the pim when to a better place
                playMusic(library.portal_sound);
                game.pims.splice(num, 1);
                if (!game.pims.length && game.limit[0] > 1) {
                    //the game is over! 
                    //and this wasn't the tutorial 
                    roundOver();
                }
            }
        }
    } else {
        pim.tick++;
    }

    if (pim.countdown === 0 && pim.dancing) {
        pim.dancing = false;
        //start directing the pim up to the light
        pim.goToLight();
    } else if (pim.countdown === 0 && !pim.dancing && !pim.onDestiny && !pim.primed) {
        pim.changeDirection('random');
    }
    
    if (pim.state === 'ghost') { rate = 1.5; } else
    if (pim.state === 'zombie') { rate = 0.5; } else
    if (pim.state === 'pim') { rate = 1.0; }

    if (pim.primed) {
        pim.collide();
    }

    if (!pim.dancing) {
        if (
            pim.onDestiny && 
            Math.abs(pim.destiny[0] - pim.pos[0]) <= 50 * library.multiplier &&
            (pim.direction === 'left' || pim.direction === 'right')
        ) {
            pim.direction = 'up';
        } else if (pim.direction === 'left') {
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
            } else if (pim.onDestiny && Math.abs(pim.destiny[1] - pim.pos[1]) <= 50 * library.multiplier)  {
                pim.poof = true;
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
        //the pim is dancing, don't move him
    }
}




function renderSkull(num) {
    var skull = game.skulls[num];
    elements.c.drawImage(library.skull, 0, 0, library.skull_size[0], library.skull_size[1], skull.pos[0], skull.pos[1], library.skull_size[0] * library.multiplier, library.skull_size[1] * library.multiplier);
}





function renderMagic(num) {
    var magic = game.magic[num];
    var sx, sy, dw, dh;

    sx = magic.tick * library.magic_size[2];
    if (magic.color === 'cyan') { sy = 0; } else
    if (magic.color === 'yellow') { sy = 1; } else
    if (magic.color === 'magenta') { sy = 2; }
    sy *= library.magic_size[3];

    dw = library.magic_size[2] * library.multiplier;
    dh = library.magic_size[3] * library.multiplier;

    elements.c.drawImage(library.magic, sx, sy, library.magic_size[2], library.magic_size[3], magic.pos[0], magic.pos[1], dw, dh);
}
function updateMagic(num) {
    var magic = game.magic[num];

    if (magic.tick === 3) {
        magic.tick = 0;
    } else {
        magic.tick++;
    }
}




function renderPortal() {
    var portal = game.portal[0];
    var sx, sy, dw, dh;

    sx = portal.tick * library.portal_size[2];
    sy = 0;
    dw = library.portal_size[2] * library.multiplier;
    dh = library.portal_size[3] * library.multiplier;

    elements.c.drawImage(library.portal, sx, sy, library.portal_size[2], library.portal_size[3], portal.pos[0], portal.pos[1], dw, dh);
}
function updatePortal() {
    var portal = game.portal[0];

    if (portal.tick === 3) {
        portal.tick = 0;
    } else {
        portal.tick++;
    }
}




function playMusic(what) {
    if (library.data.music) {
        what.play();
    }
}









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
    library.bg.src = 'images/background.jpg';
    library.excla.src = 'images/exclamation.svg';

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
    elements.open_tutorial.addEventListener('click', accessTutorial, false);
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
    elements.canvas.addEventListener('click', pushPim, false);
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
    window.setTimeout( function() {
        elements.info.style.opacity = 1;
    }, 100);
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
    elements.info.style.opacity = 0;

    //evnt listeners and stuff
    elements.help_button.classList.add('helphover');
    elements.info_close.removeEventListener('click', hideHelp, false);
    elements.info.addEventListener('transitionend', startGameAgain, false);

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
        elements.canvas.addEventListener('click', pushPim, false);

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
    this.volume *= 0.45;
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

