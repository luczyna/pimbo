module.exports = function(grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		concat: {
			options: {
				separator: '\n'
			},
			dist: {
				src: [
					'src/var.js',
					'src/tutorial.js',
					'src/pim.js',
					'src/game.js',
					'src/script.js'
				],
				dest: 'src/stuckInPimbo.js'
			}
		},

		watch: {
			js: {
				files: 'src/*.js',
				tasks: ['concat']
			}
		}
	});

	//load tasks
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-watch');

	//register tasks
	grunt.registerTask('dev', ['concat', 'watch']);
}