// including plugins
var gulp = require('gulp')
, uglify = require("gulp-uglify")
, rename = require('gulp-rename')
, jshint = require("gulp-jshint");

// task
gulp.task('jsLint', function () {
    gulp.src('src/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter());
});

// task
gulp.task('minify-js', function () {
    gulp.src('src/*.js')
    .pipe(uglify())
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest('dist'));
});

gulp.task('default', function() {
    gulp.start('jsLint', 'minify-js');
});