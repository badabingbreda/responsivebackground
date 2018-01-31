var pkg = require('./package.json'),
    gulp = require('gulp'),
    header = require('gulp-header'),
    rename = require('gulp-rename'),
    uglify = require('gulp-uglify'),
    minify = require('gulp-minify-css'),
    plumber = require('gulp-plumber'),
    replace = require('gulp-replace'),
    banner = ['/*!',
            ' * Responsive Background Hero and Div v<%= pkg.version %>',
            ' * (c) <%= new Date().getFullYear() %> <%= pkg.author.name %>',
            ' * licensed under <%= pkg.licenses[0].type %>',
            ' */',
            ''].join('\n');

    var phpbanner = ['<?php', banner ].join('\n');

gulp.task('watch', function() {
  gulp.watch(['*.js', '*.php'], ['js', 'php']);
});

gulp.task('js', function() {
  return gulp.src('jquery.responsivebackground.js')
    .pipe(plumber())
    .pipe(header(banner, { pkg : pkg } ))
    .pipe(gulp.dest('dist'))
    .pipe(uglify({preserveComments: 'some'}))
	.pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest('dist'));
});

gulp.task('php', function() {
  return gulp.src('class.responsivebackground.php')
    .pipe(plumber())
    .pipe(replace( /^\<\?php\n/g , '' ))
    .pipe(header( phpbanner, { pkg : pkg } ))
    .pipe(gulp.dest('dist'));
});

gulp.task('default', ['js', 'php']);
