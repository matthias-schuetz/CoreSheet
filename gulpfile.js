'use strict';

var gulp = require('gulp');
var gulpif = require('gulp-if');
var sass  = require('gulp-sass');
var rename = require('gulp-rename');
var insert = require('gulp-insert');
var clip = require('gulp-clip-empty-files');
var packageJson = require('./package.json')

var sassInputFiles = ['./*.scss', './themes/*.scss'];
var cssOutputDir = './dist';
var cssMinifiedExt = '.min.css';

gulp.task('sass', function() {
	return gulp.src(sassInputFiles)
		.pipe(sass({ outputStyle: 'expanded', indentType: 'tab', indentWidth: 1 }))
		.pipe(clip())
		.pipe(gulp.dest(cssOutputDir));
});

gulp.task('sass.min', function() {
	return gulp.src(sassInputFiles)
		.pipe(sass({ outputStyle: 'compressed' }))
		.pipe(rename({ extname: cssMinifiedExt }))		
		.pipe(gulpif(function(file) { return file.path.indexOf('coresheet.min.css') !== -1; },
			insert.prepend('/*\n' +
				' * CoreSheet v' + packageJson.version + '\n' +
				' * A responsive Sass/CSS3 framework including a percentage-based grid system\n' +
				' * https://github.com/matthias-schuetz/CoreSheet/\n' +
				' *\n' +
				' * Copyright (C) Matthias Schuetz\n' +
				' * Free to use under the MIT license\n' +
				' */\n')))
		.pipe(clip())
		.pipe(gulp.dest(cssOutputDir));
});

gulp.task('watch', ['sass', 'sass.min'], function() {
	return gulp.watch(sassInputFiles, ['sass', 'sass.min'])
		.on('change', function(event) {
			console.log('\x1b[32m', event.type.toUpperCase() + ': ' + event.path, '\x1b[0m');
		});
});

gulp.task('default', ['sass', 'sass.min']);