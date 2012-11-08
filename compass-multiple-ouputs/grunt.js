/*global module:false*/
module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        compass: {
            dev: {
                src: 'css/scss',
                dest: 'css/expanded',
                outputstyle: 'expanded',
                linecomments: true,
                forcecompile: true,
                relativeassets: true
            },
            prod: {
                src: 'css/scss',
                dest: 'css/compressed',
                outputstyle: 'compressed',
                linecomments: false,
                forcecompile: true,
                relativeassets: true
            }
        },
        watch: {
            files: ['css/**/*.scss'],
            tasks: ['compass:dev', 'compass:prod']
        }
    });
    
    // Default task
    grunt.registerTask('default', 'compass:prod');
    // Compass tasks
    grunt.loadNpmTasks('grunt-compass');

};