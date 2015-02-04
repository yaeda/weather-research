var gulp        = require('gulp');
var browserSync = require('browser-sync');

// Static server
gulp.task('browser-sync', function () {
    browserSync({
      server: {
        baseDir: "./public"
      }
    });
});

gulp.task('default', ['browser-sync'], function () {
  gulp.watch('public/scripts/**/*.js', [browserSync.reload]);
  gulp.watch('public/styles/**/*.css', [browserSync.reload]);
});
