//Declare variables.
var	cache		=	require('gulp-cache');
var	concat		=	require('gulp-concat');
var	gulp		=	require('gulp');
var	jshint		=	require('gulp-jshint');
var	livereload	=	require('gulp-livereload');
var	rename		=	require('gulp-rename');
var	sass		=	require('gulp-sass');
var	uglify		=	require('gulp-uglify');

//Handle stylesheets.
gulp.task('css', function() {
	return gulp.src('./src/css/stylesheet.scss')
		.pipe(sass({sourcemap: true}))
		.on('error', function (error) {
			console.error(error);
            this.emit('end');
		})
		.pipe(gulp.dest('./css'))
		.pipe(rename({suffix: '.min'}));
});

//Handle hinting.
gulp.task('hint', function() {
	return gulp.src('./src/js/hint/*.js')
		.pipe(jshint())
		.pipe(jshint.reporter('default'));
});

//Handle JavaScript.
gulp.task('js', function() {
	return gulp.src('./src/js/**/*.js')
		.pipe(concat('framework.js'))
		.pipe(gulp.dest('./js'))
		.pipe(rename({suffix: '.min'}))
		.pipe(uglify())
		.pipe(gulp.dest('./js'));
});

//Watch for changes.
gulp.task('watch', function() {
	//Watch for CSS.
	gulp.watch('./src/**/*.scss', ['css']);
	
	//Watch for hint.
	gulp.watch('./src/js/hint/*.js', ['hint']);
	
	//Wtach for JS. 
	gulp.watch('./src/js/**/*.js', ['js']);
	
	//Listen for livreload.
	livereload.listen();
	
	//Watch for livereload. 
	gulp.watch(['./css/**/*', './js/**/*']).on('change', livereload.changed);
});

//Task runner. 
gulp.task('default', ['css', 'js', 'watch']);