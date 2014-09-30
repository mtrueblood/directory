var proxySnippet = require('grunt-connect-proxy/lib/utils').proxyRequest;

// Gruntfile.js
module.exports = function(grunt) {

    // Configure
    grunt.initConfig({

        working_base_folder: 'site',
        dev_base_folder: 'dev',

        // server port
        dev_server_port: 8888,

        // Folder
        working_site_folder: 'directory/site',

        pkg: grunt.file.readJSON('package.json'),
        banner: '/*! ' + [
            '<%= pkg.description %> v<%= pkg.version %>',
            'Copyright (c) <%= grunt.template.today("yyyy") %>',
            '<%= grunt.template.today("ddd, dd mmm yyyy HH:MM:ss Z") %>'
            ].join(' | ') + ' */',

        usebanner: {
            dev: {
                options: {
                    position: 'top',
                    banner: '<%= banner %>',
                },
                files: {
                    src: [
                        '<%= working_base_folder %>/assets/scripts/global.js',
                        '<%= working_base_folder %>/assets/styles/**/*.css',
                    ],
                },
            },
        },

        jst: {
          compile: {

             options: {
                amd: true
            },
            files: {
              "<%= working_base_folder %>/assets/scripts/templates.js": ["<%= working_base_folder %>/assets/scripts/templates/*.html"]
            }
          }
        },

        clean: {
            dev: [
                '<%= working_base_folder %>/assets/scripts/global.js',
                '<%= working_base_folder %>/assets/styles/**/*.css',
                '<%= dev_base_folder %>/'
            ],
        },

        copy: {
            dev: {
                files: [
                    {
                        expand: true,
                        cwd: '<%= working_base_folder %>/',
                        src: [
                            'assets/**/*',
                            'crossbrand/**/*',
                            'data/**/*',
                            'en/**/*',
                        ],
                        dest: '<%= dev_base_folder %>/',
                    },
                ],
            },
        },

        compass: {
            dev: {
                options: {
                    sassDir: 'sass',
                    cssDir: '<%= working_base_folder %>/assets/styles',
                    imagesDir: '<%= working_base_folder %>/assets/images',
                    javascriptsDir: '<%= working_base_folder %>/assets/scripts',
                    fontsDir: '<%= working_base_folder %>/assets/fonts',
                    environment: 'development',
                    outputStyle: 'expanded',
                    noLineComments: false,
                },
            },
        },

        csslint: {
            dev: {
                src: [
                    '<%= working_base_folder %>/assets/styles/**/*.css',
                ],
                strict: {
                    options: {
                        import: 2,
                    },
                },
                options: {
                    'floats': false,
                    'universal-selector': false,
                    'font-sizes': false,
                    'adjoining-classes': false,
                    'bulletproof-font-face': false,
                    'box-model': false,
                },
            },
        },

        // Watch task.
        watch: {
            options: {
                livereload: true,
            },
            gruntfile: {
                files: 'Gruntfile.js',
                tasks: [
                    'default',
                ],
            },
            scripts: {
                files: [
                    '<%= working_base_folder %>/assets/**/*.js',
                    '!<%= working_base_folder %>/assets/**/vendor/*.js',
                ],
                tasks: [
                    'concat',
                    'copy:dev',
                ],
            },
            images: {
                files: [
                    '<%= working_base_folder %>/assets/**/*.jpg',
                    '<%= working_base_folder %>/assets/**/*.png',
                    '<%= working_base_folder %>/assets/**/*.gif',
                ],
                tasks: [
                    'copy:dev',
                ],
            },
            styles: {
                files: [
                    'sass/**/*.scss',
                    'sass/**/*.sass',
                ],
                // The tasks to run
                tasks: [
                    'compass:dev',
                    'copy:dev',
                ],
            },
            html: {
                files: [
                    '<%= working_base_folder %>/**/*.html',
                ],
                tasks: [
                    'includes',
                    'copy:dev',
                ],
            },
        },

        concat: {
            javascript: {
                src: [
                    '<%= working_base_folder %>/assets/scripts/document-ready.js',
                    '<%= working_base_folder %>/assets/scripts/google-analytics.js',
                ],
                dest: '<%= working_base_folder %>/assets/scripts/main.js',
            },
            vendors: {
                src: [
                    //'<%= working_base_folder %>/assets/scripts/vendors/.js',
                ],
                dest: '<%= working_base_folder %>/assets/scripts/vendors.js',
            },
        },

        jshint: {
            options: {
                camelcase: true,
                forin: true,
                curly: true,
                eqeqeq: true,
                eqnull: true,
                immed: true,
                undef: true,
                maxdepth: 3,
                browser: true,
                globals: {
                    jQuery: true,
                    '$': true,
                    "console": true,
                },
            },
        },

        connect: {
            dev: {
                options: {
                    middleware: function (connect, options) {
                        return [
                            // proxySnippet,
                            require('connect-livereload')(),
                            connect.static(options.base),
                            connect.directory(options.base),
                        ];
                    },
                    port: '<%= dev_server_port %>',
                    base: '<%= dev_base_folder %>',
                },
            },
            proxies: [
                {
                    context: '', // /folder
                    host: '', // site.com
                },
            ],
        },

        open: {
            dev: {
                path: '<%= working_site_folder %>/',
            },
        },

        includes: {
            files: {
                src: [
                    '<%= working_base_folder %>/*.html',
                ],
                dest: '<%= dev_base_folder %>', // Destination directory
                flatten: true,
                cwd: '.',
                options: {
                    silent: true,
                    includeRegexp: /^(\s*)<!--#include virtual="(\S+)" -->\s*$/,
                },
            },
        },

    });

    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-compass');
    grunt.loadNpmTasks('grunt-contrib-csslint');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-imagemin');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-connect-proxy');
    grunt.loadNpmTasks('grunt-open');
    grunt.loadNpmTasks('grunt-banner');
    grunt.loadNpmTasks('grunt-includes');
    grunt.loadNpmTasks('grunt-contrib-jst');

    // Default task
    grunt.registerTask('default', 'runs my tasks', function () {
        var tasks = [
            'clean:dev',
            'concat:javascript',
            'concat:vendors',
            'compass:dev',
            'csslint:dev',
            'usebanner:dev',
            'includes',
            'jst',
            'copy:dev',
        ];
        grunt.option('force', true);
        grunt.task.run(tasks);
    });

    grunt.registerTask('start', [
        'default',
        'open:dev',
        'connect:dev',
        'watch',
    ]);
};
