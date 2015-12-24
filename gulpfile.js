var gulp = require('gulp');
var concat = require('gulp-concat');
var jshint = require('gulp-jshint');
var minifyCSS = require('gulp-minify-css');
var minifyHTML = require('gulp-minify-html');
var sass = require('gulp-sass');
var jsbeautifier = require('gulp-jsbeautifier');
var uglify = require('gulp-uglify');
var usemin = require("gulp-usemin");

gulp.task('default', function() {
  // place code for your default task here
});

gulp.task('lint', function() {
	return gulp.src(['gulpfile.js', './dev/js/formatQAResults.js', './dev/js/qaObjects.js'])
		.pipe(jshint())
		.pipe(jshint.reporter('default'));
});

gulp.task('jsbeautifier', ['lint'], function() {
	return gulp.src(['./dev/js/qaObjects.js', './dev/js/formatQAResults.js'])
		.pipe(jsbeautifier())
		.pipe(gulp.dest('./dev/js'));
});

gulp.task('js', ['lint'], function() {
	gulp.src('./dev/js/*')
		.pipe(concat('script.js'))
		.pipe(uglify())
		.pipe(gulp.dest('./prod/js'));

	gulp.src('./dev/js/addEventListener.js')
		.pipe(gulp.dest('./prod/js'));
});

gulp.task('sass', function() {
	return gulp.src('./scss/style.scss')
		.pipe(sass({errLogToConsole: true}))
		.pipe(gulp.dest('./dev/css'));
});

gulp.task('css', ['sass'], function() {
	return gulp.src('./dev/css/*.css')
		.pipe(concat('style.css'))
		.pipe(minifyCSS())
		.pipe(gulp.dest('./prod/css'));
});

gulp.task('html', function() {
	return gulp.src('./dev/index.html')
		.pipe(usemin({
			js: [uglify()]
		}))
		.pipe(minifyHTML({
			conditionals: true
		}))
		.pipe(gulp.dest('./prod'));
});

gulp.task('fonts', function() {
	return gulp.src('./dev/fonts/*')
		.pipe(gulp.dest('./prod/fonts'));
});

gulp.task("watch", function() {
	gulp.watch('scss/*.scss', ['sass']);
	gulp.watch(['./dev/**/*.js', ], ['js']);
	gulp.watch(['./dev/**/*.css', ], ['css']);
	gulp.watch(['./dev/**/*.html', ], ['html', 'js']);
});

gulp.task('build', ['html', 'css', 'js', 'fonts']);
