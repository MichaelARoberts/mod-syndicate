var gulp  = require('gulp')
var sass = require('gulp-sass')
var concat = require('gulp-concat')
var autoprefixer = require('gulp-autoprefixer')

gulp.task('default', function(){
  return gulp
    .src('./public/styles/scss/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer())
    .pipe(concat('custom.css'))
    .pipe(gulp.dest('./public/styles/'))
})
