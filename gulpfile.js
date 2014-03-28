var gulp = require('gulp');
var concat = require('gulp-concat');
var jshint = require('gulp-jshint');
var minifyCSS = require('gulp-minify-css');
var minifyHTML = require('gulp-minify-html');
var sass = require('gulp-sass');
var uglify = require('gulp-uglify');
var usemin = require("gulp-usemin");

gulp.task('default', function() {
  // place code for your default task here
});

gulp.task('lint', function() {
	gulp.src(['gulpfile.js', './dev/js/formatQAResults.js', './dev/js/qaObjects.js'])
		.pipe(jshint())
		.pipe(jshint.reporter('default'));
});

gulp.task('js', ['lint'], function() {
	gulp.src(['./dev/js/modernizr.js', './dev/js/ZeroClipboard.js', './dev/js/qaObjects.js', './dev/js/formatQAResults.js'])
		.pipe(concat('script.js'))
		.pipe(uglify())
		.pipe(gulp.dest('./prod/js'));

	gulp.src('./dev/swf/ZeroClipboard.swf')
		.pipe(gulp.dest('./prod/swf'));

	gulp.src('./dev/js/addEventListener.js')
		.pipe(gulp.dest('./prod/js'));
});

gulp.task('sass', function() {
	gulp.src('./scss/style.scss')
		.pipe(sass({errLogToConsole: true}))
		.pipe(gulp.dest('./dev/css'));
});

gulp.task('css', ['sass'], function() {
	gulp.src('./dev/css/*.css')
		.pipe(concat('style.css'))
		.pipe(minifyCSS())
		.pipe(gulp.dest('./prod/css'));
});

gulp.task('html', function() {
	gulp.src('./dev/index.html')
		.pipe(usemin({
			js: [uglify()]
		}))
		.pipe(minifyHTML({
			conditionals: true
		}))
		.pipe(gulp.dest('./prod'));
});

gulp.task('fonts', function() {
	gulp.src('./dev/fonts/*')
		.pipe(gulp.dest('./prod/fonts'));
});

gulp.task('build', ['html', 'css', 'js', 'fonts']);