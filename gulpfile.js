//Declare variables.
var	cache		=	require('gulp-cache');
var	concat		=	require('gulp-concat');
var	gulp		=	require('gulp');
var	gulpif		=	require('gulp-if');
var imagemin    =   require('gulp-imagemin');
var	jshint		=	require('gulp-jshint');
var	livereload	=	require('gulp-livereload');
var	minifyCSS	=	require('gulp-minify-css');
var notify      =   require('gulp-notify');
var	rename		=	require('gulp-rename');
var	sass		=	require('gulp-sass');
var sourcemaps	=	require('gulp-sourcemaps');
var	uglify		=	require('gulp-uglify');
var yargs		=	require('yargs');

//Determine if this is a dev call.
var	argv		=	require('yargs').argv;
var	dev			=	(!argv.dev) ? false : true;
var	err			=	false;

//Handle stylesheets.
gulp.task('css', function() {
	return gulp.src('./src/css/stylesheet.scss')
		.pipe(sass({sourcemap: true}))
		.on('error', notify.onError(function (error) {
			//Log to the console.
			console.error(error);
			
			//Set the error.
			err	=	true;
			
			//Return the error.
			return "Error: " + error.message;
		}))
		.pipe(gulpif(!err, sourcemaps.init()))
		.pipe(gulpif(!err, gulpif(!dev, minifyCSS({compatibility: 'ie8'}))))
		.pipe(gulpif(!err, sourcemaps.write()))
		.pipe(gulpif(!err, gulp.dest('./css')));
});

//Handle hinting.
gulp.task('hint', function() {
	return gulp.src('./src/js/hint/*.js')
		.pipe(jshint())
		.pipe(notify(function(file) {
			//If not success.
			if (!file.jshint.success) {
				//Get the errors.
				var	errors	=	file.jshint.results.map(function(data) {
					//If there's an error.
					if (data.error) {
						//Return the error.
						return "(" + data.error.line + ":" + data.error.character + ") " + data.error.reason;
					}
				}).join("\n");
				
				//Display the errors.
				return file.relative + " [" + file.jshint.results.length + " errors]\n" + errors;
			}
		}))
		.pipe(jshint.reporter('default'))
		.pipe(gulp.dest('./src/js'));
});

//Handle images.
gulp.task('images', function() {
	return gulp.src('./src/images/*')
		.pipe(cache(imagemin({
			interlaced: true, 
			multipass: true, 
			optimizationLevel: 5, 
			progressive: true, 
			svgoPlugins: [{removeViewBox: false}]
		})))
		.pipe(gulp.dest('./images'));
});

//Handle JavaScript.
gulp.task('js', function() {
	return gulp.src('./src/js/*.js')
		.pipe(concat('framework.js'))
		.pipe(gulp.dest('./js'))
		.pipe(gulpif(!dev, uglify()))
		.pipe(gulp.dest('./js'));
});

//Watch for changes.
gulp.task('watch', function() {
	//Watch for CSS.
	gulp.watch('./src/**/*.scss', ['css']);
	
	//Watch for hint.
	gulp.watch('./src/js/hint/*.js', ['hint']);
	
	//Watch for images. 
	gulp.watch('./src/images/*', ['images']);
	
	//Watch for JS. 
	gulp.watch('./src/js/**/*.js', ['js']);
	
	//Listen for livreload.
	livereload.listen();
	
	//Watch for livereload. 
	gulp.watch(['./css/**/*', './js/**/*', './images/**/*']).on('change', livereload.changed);
});

//Task runner. 
gulp.task('default', ['css', 'hint', 'images', 'js', 'watch']);