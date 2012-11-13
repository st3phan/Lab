/*global module:false*/
module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        compass: {
            dev: {
                src: '../css/scss',
                dest: '../css',
                outputstyle: 'expanded',
                linecomments: true,
                forcecompile: true,
                relativeassets: true
            }
        },
        watch: {
            files: ['../css/**/*.scss'],
            tasks: ['compass:dev',]
        }
    });
    
    // Default task
    grunt.registerTask('default', 'compass:dev');
    // Compass tasks
    grunt.loadNpmTasks('grunt-compass');

};