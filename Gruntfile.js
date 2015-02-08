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
				files: 'src/*.js',
				tasks: ['concat']
			}
		},

		jshint: {
			files: working_files
		},

		copy: {
			main: {
				src: ['src/stuckInPimbo.min.js', 'src/style.min.css'],
				dest: 'build/stuckInPimbo.min.js'
			}
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

		targethtml: {
			dev: {
				'index.html': 'build/index.html'
			},
			prod: {
				'index.html': 'build/index.html'
			},
			app: {
				'index.html': 'build/index.html'
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
	grunt.loadNpmTasks('grunt-targethtml');

	//register tasks
	grunt.registerTask('dev', ['jshint', 'targethtml:dev','watch']);
	grunt.registerTask('prod', ['jshint', 'concat', 'targethtml:prod', 'watch']);
	grunt.registerTask('app', ['jshint', 'concat', 'uglify', 'cssmin', 'copy', 'targethtml:app']);
}