// include gulp
var gulp = require('gulp'); 
 
// include plug-ins
// var jshint = require('gulp-jshint');
var concat  = require('gulp-concat');
var uglify  = require('gulp-uglify');
var rename  = require('gulp-rename');
var rimraf  = require('gulp-rimraf');
var shell   = require('gulp-shell');
var newer   = require('gulp-newer');
 
var srcDir = '../src/';
var destDir = './';
var yuidocDestDir  = '../docs/api-docs/';
var yuidocThemeDir = '../docs/api-docs-theme/';

var baseFileNames = [ '_head.jsfrag', 'a??_*.js', '_tail.jsfrag'];
var fileNames     = [ '_head.jsfrag', 'a??_*.js', 'b??_*.js', '_tail.jsfrag'];


buildMinify('', fileNames);
buildMinify('.base', baseFileNames);

gulp.task('clean-yuidoc', function() {
  return gulp.src(yuidocDestDir, { read: false }) // much faster
    // .pipe(ignore('node_modules/**'))
    .pipe(rimraf( { force: true} ));
});

// for the time being we don't make yuidoc do a clean first - because then we lose the 'newer' effect
gulp.task('yuidoc', function() {
  return gulp.src( mapPath(srcDir, fileNames))
      .pipe(newer(yuidocDestDir + 'data.json'))
      .pipe(concat('foo'))  // just needed a method that would get n -> 1 would like something smaller.
      .pipe(shell(['yuidoc --themedir ' + yuidocThemeDir + ' --outdir ' + yuidocDestDir + ' ' + srcDir]));
});

gulp.task('default', ['minify', 'minify.base', 'yuidoc'], function() {

});


function buildMinify(extn, fileNames, destName) {
  var destName = 'breeze' + extn + '.debug.js'
  var minName = 'breeze' + extn + '.min.js'
  gulp.task('minify' + extn, function() {
    gulp.src( mapPath(srcDir, fileNames))
      .pipe(newer(destDir + destName))
      .pipe(concat(destName,  {newLine: ';'}))
      .pipe(gulp.dest(destDir))
      .pipe(uglify())
      .pipe(rename(minName))
      .pipe(gulp.dest(destDir));
  });
}

function mapPath(dir, fileNames) {
  return fileNames.map(function(fileName) {
    return dir + fileName;
  });
};
