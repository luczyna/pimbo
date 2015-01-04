module.exports = function(grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		concat: {
			options: {
				separator: ';'
			},
			dist: {
				src: ['src/*.js'],
				dest: 'src/stuckInPimbo.js'
			}
		}
	});

	//load tasks
	grunt.loadNpmTasks('grunt-contrib-concat');

	//register tasks
	grunt.registerTask('dev', ['concat']);
}