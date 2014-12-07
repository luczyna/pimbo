var library = {
	//images
	'pim': new Image(),
	'magic': new Image(),
	'portal': new Image(),
	'poof': new Image(),
	'skull': new Image(),

	//music
	'ambient': 'huh',

	//ratios
	'scr': [],
	'canvas': [],
	'multiplier': 0,
	//[x, y, frame_x, frame_y]
	'pim_size': [864, 1248, 72, 96],
	'magic_size': [],
	'portal_size': [],
	'poof_size': [],
	'skull_size': [],

	//dataaa
	'data': {
		'poop': false,
		'highscore': null,
		'rounds': 0,
		'music': false,
		'player': ['reverse', 'clockwise', 'counter-clockwise'],
		'color': ['cyan', 'magenta', 'yellow']
	}
};

var game = {
	//time
	'start': null,
	'end': null,
	'total': 0,

	//status
	'running': false,
	'finished': true,

	//each round has new info
	'round': 0,
	'pims': [],
	'skulls': [],
	'magic': [],
		//[pims, skulls, magic, portals = 3]
	'limit': [null, null, null, 3],
	'player': null,
	'player_loop': null,
	'loop': null
};

var elements = {
	'opening': document.getElementById('open-screen'),
	'game': document.getElementById('game-screen'),
	'ending': document.getElementById('end-screen'),
	'info': document.getElementById('info-screen'),
	
	'player_action': document.getElementById('game-action'),
	'canvas': document.getElementById('game-canvas'),
	'c': null,

	'info_round': document.getElementById('info-round'),
	'info_time': document.getElementById('info-time'),
	
	'end_message': document.querySelector('.rando'),
	'end_ghosts': document.getElementById('end-ghost-count'),
	'end_time': document.getElementById('end-time'),
	'end_score': document.getElementById('end-score'),
	
	'play': document.getElementById('open-play'),
	'play_again': document.getElementById('end-play'),
	'help_button': document.getElementById('game-help'),
	'info_close': document.getElementById('info-close'),

	'highscore_open': document.getElementById('open-hs'),
	'highscore_info': document.getElementById('info-highscore'),
	'highscore_end': document.getElementById('end-hs'),

};