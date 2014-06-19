(function () {
    'use strict';

    var allTestFiles = [];
    var TEST_REGEXP = /Spec\.js$/;

    Object.keys(window.__karma__.files).forEach(function (file) {
        if (TEST_REGEXP.test(file)) {
            // Normalize paths to RequireJS module names.
            allTestFiles.push(file);
        }
    });

    var requirejsConfig = {
        baseUrl : '/base',
        paths : {
            'Notum' : 'src',
            'backbone' : 'bower_components/backbone/backbone',
            'underscore' : 'bower_components/underscore/underscore',
            'jquery' : 'bower_components/jquery/dist/jquery',
            'marionette' : 'bower_components/marionette/lib/backbone.marionette'
        },
        shim : {
            'backbone' : {
                'deps' : ['underscore']
            }
        },
        deps : allTestFiles,
        callback : window.__karma__.start
    };
    require.config(requirejsConfig);

})();