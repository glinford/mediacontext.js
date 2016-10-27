module.exports = function(grunt) {
  grunt.initConfig({
    'uglify': {
      mediacontext: {
        files: {
          'mediacontext.min.js': ['mediacontext.js']
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');

  grunt.registerTask('default', ['uglify']);
};
