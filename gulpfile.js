var gulp = require('gulp');
var gutil = require('gulp-util');
var coffee = require('gulp-coffee');
var concat = require('gulp-concat');
var browserify = require('gulp-browserify');
var compass = require('gulp-compass');
var sass = require('gulp-ruby-sass');
var connect = require('gulp-connect');
var gulpif = require('gulp-if');
var uglify = require('gulp-uglify');
var htmlmin = require('gulp-htmlmin');

var env,
    coffeeSources,
    jsSources,
    sassSources,
    htmlSources,
    jsonSources,
    outputDir,
    sassStyle;

env = process.env.NODE_ENV || 'development';

if(env === 'development'){

  outputDir = 'builds/development/';
  sassStyle = 'expanded';

}else{

outputDir = 'builds/production/';
sassStyle = 'compressed';

}

coffeeSources = ['components/coffee/tagline.coffee']
jsSources = [

	'components/scripts/rclick.js',
	'components/scripts/pixgrid.js',
	'components/scripts/tagline.js',
	'components/scripts/template.js'

];

sassSources =['components/sass/style.scss'];
htmlSources =[outputDir + '*.html'];
jsonSources =[outputDir + '*.json'];

gulp.task('coffee', function() {
  gulp.src(coffeeSources)
    .pipe(coffee({bare: true}).on('error', gutil.log))
    .pipe(gulp.dest('components/scripts'));
});




 
gulp.task('js', function() {
  return gulp.src(jsSources)
    .pipe(concat('script.js'))
    .pipe(browserify())
    .pipe(gulpif(env === 'production',uglify()))
    .pipe(gulp.dest(outputDir + 'js'))
    .pipe(connect.reload());
});



gulp.task('compass', function() {
   return sass(sassSources, {
     compass: true,
     lineNumbers: true,
     style : sassStyle
   }).on('error', gutil.log)
   .pipe(gulp.dest(outputDir +'css'))
   .pipe(connect.reload());
});


gulp.task('watch',function(){

  gulp.watch(coffeeSources,['coffee']);
  gulp.watch(jsSources,['js']);
  gulp.watch('components/sass/*.scss',['compass']);
  gulp.watch(htmlSources,['html']);
  gulp.watch(jsonSources,['json']);
});

gulp.task('connect', function() {
 connect.server({
    root: outputDir,
    livereload: true
  });
});


gulp.task('html', function() {
 gulp.src(htmlSources)
 .pipe(connect.reload());
});

gulp.task('minify', function() {
  return gulp.src(htmlSources)
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest('builds/production/'));
});



gulp.task('json', function() {
 gulp.src(jsonSources)
 .pipe(connect.reload());
});

gulp.task('default', ['html','minify','json','coffee','js','compass','connect','watch']);
