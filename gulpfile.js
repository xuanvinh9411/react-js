/**
 * Created by huynhngoctam on 12/2/16.
 */

var gulp = require('gulp');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var minifyCSS = require('gulp-minify-css');

// Concatenate & Minify JS
gulp.task('scripts', function() {
  return gulp.src('styles/**/*.js')
    .pipe(uglify())
    //.pipe(concat('all.js'))
    .pipe(gulp.dest('dist/styles/'));
});


gulp.task('copy-fonts', function(){
  return gulp.src(['styles/fonts/**/*'])
    .pipe(gulp.dest('dist/styles/fonts/'))
})

gulp.task('copy-images', function(){
  return gulp.src(['styles/images/**/*'])
    .pipe(gulp.dest('dist/styles/images'))
})



gulp.task('css', function() {
  return gulp.src('styles/**/*.css')
    .pipe(minifyCSS())
    //.pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9'))
    //.pipe(concat('all.min.css'))
    .pipe(gulp.dest('dist/styles/'))
});



// Default Task
gulp.task('default', ['copy-fonts','copy-images', 'scripts', 'css']);
