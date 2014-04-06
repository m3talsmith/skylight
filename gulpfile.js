'use strict';

var gulp = require('gulp');
var requirejs = require('requirejs');

var config = {
  baseUrl: __dirname,
  include: ['./lib/*.js'],
  out: './public/js/application.js',
  optimize: 'none'
};

function rjs(cb){
  requirejs.optimize(config, function(){ cb(); }, cb);
}

gulp.task('rjs', rjs);

gulp.task('watch', function () {
  gulp.src(['./lib/*.js'])
    .pipe(rjs);
});

gulp.task('default', ['rjs', 'watch']);
