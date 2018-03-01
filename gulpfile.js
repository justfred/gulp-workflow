const gulp = require('gulp');
const sass = require('gulp-sass');
const browserSync = require('browser-sync');
const reload = browserSync.reload;
const autoprefixer = require('gulp-autoprefixer');

const SOURCEPATHS = {
  sassSource: 'src/scss/*.scss',
  htmlSource: 'src/*.html'
}

const APPPATH = {
  root: 'app/',
  css: 'app/css',
  js: 'app/js'
}

//process sass scss into css
gulp.task('sass', function() {
  return gulp.src(SOURCEPATHS.sassSource)
  .pipe(autoprefixer({
        browsers: ['last 2 versions'],
        cascade: false
    }))
    //compact/expanded/compressed/nested/expanded
    .pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError))
    .pipe(gulp.dest(APPPATH.css));
});

//copy html files
gulp.task('copy', function() {
    gulp.src(SOURCEPATHS.htmlSource)
      .pipe(gulp.dest(APPPATH.root))
});

//init browserSync
gulp.task('serve', ['sass'], function() {
    browserSync.init([
      APPPATH.css + '/*.css',
      APPPATH.root + '/*.html',
      APPPATH.js + '/*.js',
    ], {
      server: {
        baseDir: APPPATH.root
      }
    });
});

//watch these directories and run task when anything changes
gulp.task('watch', ['serve', 'sass', 'copy'], function() {
  gulp.watch([SOURCEPATHS.sassSource], ['sass']);
  gulp.watch([SOURCEPATHS.htmlSource], ['copy']);
});

gulp.task('default', ['watch']);
