/*
 * we will have 3 types of grunt tasks
 *   dev - DEVELOPMENT
 *   it will run a watch and lint your js files as you save them
 *
 *   prod - PRODUCTION
 *   it will lint and then concatenate your js files
 *   then run a watch for you to confirm the concat works
 *
 *   app - mobile APP
 *   lint, concat, minify
 */



module.exports = function(grunt) {
	//these files hold the game
	var working_files = [
		'src/var.js',
		'src/tutorial.js',
		'src/pim.js',
		'src/game.js',
		'src/script.js'
	];

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		concat: {
			options: {
				separator: '\n'
			},
			dist: {
				src: working_files,
				dest: 'src/stuckInPimbo.js'
			}
		},

		watch: {
			js: {
				files: working_files,
				tasks: ['concat']
			}
		},

		jshint: {
			files: working_files
		},

		uglify: {
			options: {
				mangle: false
			},
			target: {
				files: {
					'src/stuckInPimbo.min.js': 'src/stuckInPimbo.js'
				}
			}
		},

		cssmin: {
			target: {
				files: {
					'src/style.min.css': 'src/style.css'
				}
			}
		},

		//non-working implementation
		processhtml: {
			options: {},
			dev: {
				files: {
					'index.html': 'process/index.html'					
				}
			},
			prodTest: {
				files: {
					'index.html': 'process/index.html'					
				}
			},
			prod: {
				files: {
					'index.html': 'process/index.html'					
				}
			},
			app: {
				files: {
					'index.html': 'process/index.html'					
				}
			}
		}
	});

	//load tasks
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-processhtml');

	//register tasks
	grunt.registerTask('dev', ['jshint', 'watch']);
	grunt.registerTask('prod', ['jshint', 'concat', 'uglify', 'cssmin', 'watch');
	grunt.registerTask('app', ['jshint', 'concat', 'uglify', 'cssmin', );
}