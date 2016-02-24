//Declare variables.
var	autoprefix	=	require('gulp-autoprefixer');
var	cache		=	require('gulp-cache');
var	concat		=	require('gulp-concat');
var	gulp		=	require('gulp');
var	gulpif		=	require('gulp-if');
var imagemin    =   require('gulp-imagemin');
var	jshint		=	require('gulp-jshint');
var	minifyCSS	=	require('gulp-minify-css');
var notify      =   require('gulp-notify');
var	rename		=	require('gulp-rename');
var	sass		=	require('gulp-sass');
var sourcemaps	=	require('gulp-sourcemaps');
var	uglify		=	require('gulp-uglify');
var yargs		=	require('yargs');

//Get all arguments.
var	argv		=	require('yargs').argv;

//Check if this is a development version. 
var	dev			=	(!argv.dev) ? false : true;

//Setup the applications to be processed.
var	apps		=	{
		'css': [
			'alerts', 
			'grid', 
			'reset', 
			'tables'
		], 
		'js': [
			'icebox'
		]
}

//Get all paths.
var	paths		=	{
	'input': {
		'images':	'./src/images', 
		'js':		'./src/js', 
		'sass':		'./src/sass/'
	}, 
	'output': {
		'css':		'./css', 
		'images':	'./images', 
		'js': 		'./js'
	}
};

//Set the initial tasks.
var	tasks		=	['images', 'watch'];

//Store all processing functions. 
var	functions	=	{
		hint:	function(app) {
			//Run Gulp.
			gulp.src(paths.input.js + app + '/*.js')
				.pipe(jshint())
				.pipe(notify(function(file) {
					//If not success.
					if (!file.jshint.success) {
						//Get the errors.
						var	errors	=	file.jshint.results.map(function(data) {
							//If there's an error.
							if (data.error) {
								//Increment the error.
								return "(" + data.error.line + ":" + data.error.character + ") " + data.error.reason;
							}
						}).join("\n");
						
						//Display the errors.
						return file.relative + "[" + file.jshint.results.length + " errors]\n" + errors;
					}
				}))
				.pipe(jshint.reporter('default'));
		}, 
		js:		function(app) {
			//Run Gulp.
			gulp.src(paths.input.js + app + '/*.js')
				.pipe(concat(app + '.js'))
				.pipe(gulpif(!dev, uglify({'preserveComments': 'license'})))
				.pipe(gulp.dest(paths.output.js));
		}, 
		sass:	function(app) {
			//Declare variables.
			var	die	=	false;
			
			//Run Gulp.
			gulp.src(paths.input.sass + app + '/' + app + '.scss')
				.pipe(sass({sourcemap: true}))
				.on('error', notify.onError(function(error) {
					//Set die as true.
					die	=	true;
					
					//Log to the console.
					console.error(error);
					
					//Return the error.
					return error;
				}))
				.pipe(gulpif(!die, gulpif(dev, sourcemaps.init())))
				.pipe(autoprefix({browsers: '>1%'}))
				.pipe(gulpif(!die, gulpif(!dev, minifyCSS({compatibility: 'ie8'}))))
				.pipe(gulpif(!die, gulpif(dev, sourcemaps.write())))
				.pipe(gulpif(!die, gulp.dest(paths.output.css)));
		}
};

//For each CSS application.
apps.css.forEach(function(app) {
	//Handle application.
	gulp.task('css-' + app, functions.sass(app));
	
	//Add task.
	tasks.push('css-' + app);
});

//For each JS application.
apps.js.forEach(function(app) {
	//Hint application.
	gulp.task('hint-' + app, functions.sass(app));
	
	//Add task.
	tasks.push('hint-' + app);
	
	//Handle application.
	gulp.task('js-' + app, functions.sass(app));
	
	//Add task.
	tasks.push('js-' + app);
});

//Handle images.
gulp.task('images', function() {
	return gulp.src(paths.input.images + '/*')
		.pipe(cache(imagemin({
			interlaced: true, 
			multipass: true, 
			optimizationLevel: 5, 
			progressive: true, 
			svgoPlugins: [{removeViewBox: false}]
		})))
		.pipe(gulp.dest(paths.output.images));
});

//Watch for changes.
gulp.task('watch', function() {
	//Reset err.
	err	=	false;
	
	//For each CSS application.
	apps.css.forEach(function(app) {
		//Setup watch for Sass.
		gulp.watch(paths.input.sass + app + '/**/*.scss', ['css-' + app]);
	});
	
	//For each JS application.
	apps.js.forEach(function(app) {
		//Setup watch for Hint.
		gulp.watch(paths.input.js + app + '/*.js', ['hint-' + app]);
		
		//Setup watch for JS.
		gulp.watch(paths.input.js + app + '/**/*.js', ['js-' + app]);
	});
	
	//Watch for images. 
	gulp.watch(paths.input.images + '/*', ['images']);
});

//Task runner. 
gulp.task('default', tasks);