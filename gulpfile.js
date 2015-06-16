var gulp = require('gulp');
var gulpSequence = require('gulp-sequence');
var del = require('del');
var replace = require('gulp-g-require-css');
var webpack      = require('webpack');
var browserSync = require('browser-sync');
var watch    = require('gulp-watch');

var config =   {
  entry: {
    scrollbar: ['./example/.tmp/index.js']
  },
  output: {
    path: './example',
    filename: 'js/[name].js',
    publicPath: './example'
  },

  plugins: [
  ],
  module: {
  },
  devtool: 'source-map'
};

var browserSyncConfig = {
  server: {
    baseDir: './example'
  }
}

gulp.task('styles', function() {
  return gulp.src(['./index.js', './src/index.js'])
    .pipe(replace({
      name: '../css/scrollbar.css'
    }))
    .pipe(gulp.dest('./example/.tmp'))
    .pipe(browserSync.reload({stream:true}));;
});

gulp.task('clean', function(cb) {
  del([
    './dist',
    './example/js',
    './example/css',
    './example/.tmp'
  ], cb);
});

gulp.task('default', function(cb) {
  gulpSequence('clean', 'modules', ['watch', 'browserSync'], cb);
});

gulp.task('modules', ['styles'],  function() {
  gulp.start('webpack:development');
});

gulp.task('watch', ['browserSync'], function() {
  watch('./src/scrollbar.less', function() {
    gulp.start('modules');
  });
});


gulp.task('webpack:development', function(callback) {
  var built = false
  webpack(config).watch(1000, function(err, stats) {
    if(!built) { built = true; callback() }
  })
});

gulp.task('browserSync', function() {
  return browserSync(browserSyncConfig);
});