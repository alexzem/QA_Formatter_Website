var gulp = require('gulp');
var concat = require('gulp-concat');
var jshint = require('gulp-jshint');
var minifyCSS = require('gulp-minify-css');
var sass = require('gulp-sass');
var uglify = require('gulp-uglify');

gulp.task('default', function() {
  // place code for your default task here
});

gulp.task('lint', function() {
	gulp.src(['gulpfile.js', './dev/js/formatQAResults.js', './dev/js/qaObjects.js'])
		.pipe(jshint())
		.pipe(jshint.reporter('default'));
});

gulp.task('js', ['lint'], function() {
	gulp.src('./dev/js/*.js')
		.pipe(concat('script.js'))
		.pipe(uglify())
		.pipe(gulp.dest('./prod/js'));
});

gulp.task('sass', function() {
	gulp.src('./scss/style.scss')
		.pipe(sass({errLogToConsole: true}))
		.pipe(gulp.dest('./dev/css'));
});

gulp.task('css', function() {
	gulp.src('./dev/css/*.css')
		.pipe(concat('style.css'))
		.pipe(minifyCSS())
		.pipe(gulp.dest('./prod/css'));
});

gulp.task('build', ['js', 'css'], function() {

});