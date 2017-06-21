module.exports = function(grunt) {
	grunt.loadNpmTasks('grunt-karma');
	
	grunt.initConfig({
		karma: {  
		  unit: {
			options: {
			  frameworks: ['jasmine'],
			  singleRun: true,
			  browsers: ['PhantomJS'],
			  files: [
				'lib/angular.min.js',
				'lib/angular-mocks.js',
				'src/quandl/angular/controller/*.js',
				'src/test/*.js',
				'https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.5.0/Chart.min.js'
			  ]
			}
		  }
		}
	});
	
	grunt.registerTask('test', [ 
	  'karma'
	]);
};