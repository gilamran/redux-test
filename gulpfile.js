var exec = require('child_process').exec;
var real_gulp = require('gulp');
var gulp = require('gulp-help')(real_gulp);
var gulpSequence = require('gulp-sequence');
var tslint = require('gulp-tslint');
var tsConfigFiles = require('gulp-tsconfig-files');
var watch = require('./tools/build/watch');
var del = require('del');
var jasmine = require('gulp-jasmine');

var tsFiles = ((c) =>  c.filesGlob || c.files || '**/*.ts')(require('./tsconfig.json'));

gulp.task('update_tsconfig', false, () => {
  gulp.src(tsFiles).pipe(tsConfigFiles());
});

gulp.task('clean', 'Cleans the generated files from build folder', (done) => del('build', done));

gulp.task('tslint', 'Lints all TypeScript source files', () => {
  return gulp.src(tsFiles)
    .pipe(tslint())
    .pipe(tslint.report('verbose'));
});

gulp.task('tsc', 'Compiles all TypeScript files', (cb) => {
  exec('tsc', (err, stdout, stderr) => {
    console.log(stdout);
    console.log(stderr);
    cb(err);
  });
});

gulp.task('build', 'Compiles all TypeScript source files', gulpSequence('update_tsconfig', 'tslint', 'tsc'));

gulp.task('test', 'Runs the Jasmine test specs', () => {
  return gulp.src('build/test/*.js')
    .pipe(jasmine());
});

gulp.task('build_and_test', false, gulpSequence('build', 'test'));

gulp.task('serve', 'Build, run server and watch', gulpSequence('clean', 'build', 'test', 'nodemon'));
