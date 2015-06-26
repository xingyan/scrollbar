var gulp = require('gulp');
var gulpSequence = require('gulp-sequence');
var del = require('del');
var webpack      = require('webpack');
var browserSync = require('browser-sync');
var watch    = require('gulp-watch');

var less = require('gulp-less'),
  LessPluginAutoPrefix = require('less-plugin-autoprefix'),
  autoprefix= new LessPluginAutoPrefix({ browsers: ["last 2 versions"] });



var config =   {
  entry: {
    scrollbar: ['./index.js']
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
    baseDir: './'
  }
}

gulp.task('styles', function() {
  return gulp.src(['./scrollbar.less'])
    .pipe(less({
      plugins: [autoprefix]
    }))
    .pipe(gulp.dest('./dist'))
    .pipe(browserSync.reload({stream:true}));;
});

gulp.task('clean', function(cb) {
  del([
    './dist',
    './example/js',
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
  watch(['./index.js', './scrollbar.less'], function() {
    gulp.start('modules');
  });
});

gulp.task('webpack:development', function(callback) {
  var built = false
  webpack(config).watch(200, function(err, stats) {
    browserSync.reload();
    if(!built) { built = true; callback() }
  })
});

gulp.task('browserSync', function() {
  return browserSync(browserSyncConfig);
});