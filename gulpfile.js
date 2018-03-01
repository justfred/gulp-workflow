const gulp = require('gulp');
const sass = require('gulp-sass');
const browserSync = require('browser-sync');
const reload = browserSync.reload;
const autoprefixer = require('gulp-autoprefixer');
const browserify = require('gulp-browserify');
const clean = require('gulp-clean');
const concat = require('gulp-concat');
const merge = require('merge-stream');

const SOURCEPATHS = {
  sassSource: 'src/scss/*.scss',
  htmlSource: 'src/*.html',
  jsSource: 'src/js/**'
}

const APPPATH = {
  root: 'app/',
  css: 'app/css',
  js: 'app/js'
}

//clean deleted files
gulp.task('clean-html', function() {
    return gulp.src(APPPATH.root + '/*.html', {read: false, force: true})
      .pipe(clean());
});
gulp.task('clean-scripts', function() {
    return gulp.src(APPPATH.js + '/*.js', {read: false, force: true})
      .pipe(clean());
});

//process sass scss into css
gulp.task('sass', function() {
  let bootstrapCSS = gulp.src('./node_modules/bootstrap/dist/css/bootstrap.css');
  let sassFiles = gulp.src(SOURCEPATHS.sassSource)
    .pipe(autoprefixer({
        browsers: ['last 2 versions'],
        cascade: false
    }))
    //compact/expanded/compressed/nested/expanded
    .pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError));

    //overwrite bootstrap with our files
    return merge(bootstrapCSS, sassFiles)
      .pipe(concat('app.css'))
      .pipe(gulp.dest(APPPATH.css));


});

//copy javascript files
gulp.task('scripts', ['clean-scripts'], function() {
    gulp.src(SOURCEPATHS.jsSource)
      .pipe(concat('main.js'))
      .pipe(browserify())
      .pipe(gulp.dest(APPPATH.js))
});

//copy html files
gulp.task('copy', ['clean-html'], function() {
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
gulp.task('watch', ['serve', 'sass', 'copy', 'clean-html', 'scripts', 'clean-scripts'], function() {
  gulp.watch([SOURCEPATHS.sassSource], ['sass']);
  gulp.watch([SOURCEPATHS.htmlSource], ['copy']);
  gulp.watch([SOURCEPATHS.jsSource], ['scripts']);
});

//default task if gulp is run with no task specified
gulp.task('default', ['watch']);
