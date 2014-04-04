var path    = require('path'),
    exec    = require('child_process').exec,
    nodemon = require('nodemon');

nodemon({
    script: 'index.js',
    ext: 'js json'
});

nodemon.on('start', function () {
    console.log('App has started');
}).on('quit', function () {
    console.log('App has quit');
}).on('restart', function (files) {
    console.log('App restarted due to: ', files);
});
