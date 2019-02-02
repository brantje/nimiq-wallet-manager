var jsFiles = [
	// 'js/lib/jquery-3.1.0.min.js',
	'public/javascripts/',
];

module.exports = function (grunt) {
	grunt.initConfig({
		sass: {
			dist: {
				options: {
					style: 'compressed'
				},
				files: {
					'public/css/style.css': 'src/scss/main.scss',

				}
			}
		},
		concat: {
			options: {
				separator: ';'
			},
			dist: {
				src: jsFiles,
				dest: 'js/combined.js'
			}
		},
		uglify: {
			dist: {
				files: {
					'js/combined.js': ['js/combined.js']
				}
			}
		},
		watch: {
			css: {
				files: ['src/scss/*.scss'],
				tasks: ['sass']
			},
			js: {
				files: jsFiles,
				tasks: ['concat','uglify']
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-sass');

	grunt.registerTask('default', ['sass','concat','uglify']);
};
