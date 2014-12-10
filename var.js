var library = {
	//images
	'pim': new Image(),
	'magic': new Image(),
	'portal': new Image(),
	'poof': new Image(),
	'skull': new Image(),
	'bg': new Image(),

	//music
	'ghost_sound': new Audio(),
	'zombie_sound': new Audio(),
	'transform_sound': new Audio(),
	'portal_sound': new Audio(),
	'player_sound': new Audio(),

	'totalAssets': 11,
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