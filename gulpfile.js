//Declare variables.
var	autoprefix	=	require('gulp-autoprefixer');
var browserSync	=	require('browser-sync').create();
var	cache		=	require('gulp-cache');
var	concat		=	require('gulp-concat');
var	fs			=	require('fs'); 
var	gulp		=	require('gulp');
var	gulpif		=	require('gulp-if');
var imagemin	=   require('gulp-imagemin');
var	jshint		=	require('gulp-jshint');
var	minifyCSS	=	require('gulp-minify-css');
var	modernizr	=	require('gulp-modernizr');
var notify		=   require('gulp-notify');
var	reload		=	browserSync.reload;
var	rename		=	require('gulp-rename');
var replace		=	require('gulp-replace');
var	sass		=	require('gulp-sass');
var sourcemaps	=	require('gulp-sourcemaps');
var	uglify		=	require('gulp-uglify');
var yargs		=	require('yargs');

//Get all arguments.
var	argv		=	require('yargs').argv;

//Check if this is a development version. 
var	dev			=	(!argv.dev) ? false : true;

//Set initial tasks.
var	tasks		=	(!dev) ? ['images', 'scripts', 'version'] : ['images', 'scripts', 'browserSync', 'watch', 'version'];

//Set tasks specifically for JavaScript. 
var	scripts		=	[];

//Get the package.json version.
var	version		=	JSON.parse(fs.readFileSync('./package.json')).version.split('.');

//Set the increment value based on whether this is a development version. 
var	increment	=	(!dev) ? 2 : 1;

//For each version value.
for(i = 0; i < version.length; i++) {
	//Parse the version as an integer type. 
	version[i]	=	parseInt(version[i]); 
}

//Based on the existing version number.
if (version[3] + increment >= 10) {
	if (version[2] + 1 >= 10) {
		version[1]	+=	1;
		version[2]	=	0;
	} else {
		version[2]	+=	1;
	}
	
	version[3]		+=	increment - 10;
} else {
	version[3]		+=	increment;
}

//Rebuild the version. 
version	=	version.join('.'); 

//Get all paths.
var	paths		=	{
	'input': {
		'images':	'./src/images', 
		'js':		'./src/js', 
		'sass':		'./src/sass'
	}, 
	'output': {
		'index':	'./', 
		'css':		'./css', 
		'images':	'./images', 
		'js': 		'./js'
	}
};

//Get all applications to process. 
var	files	=	{
		sass:			fs.readdirSync(paths.input.sass + '/stylesheets/'),
		js: {
		//	init: 		fs.readdirSync(paths.input.js) + '/init/',
		//	vendor:		fs.readdirSync(paths.input.js) + '/vendor/',
		//	utilities:	fs.readdirSync(paths.input.js) + '/utilities/', 
		//	functions:	fs.readdirSync(paths.input.js) + '/functions/'
		}
};

//Store all processing functions. 
var	functions	=	{
		hint:	function(app) {
			//Run Gulp.
			return gulp.src(app + '/**/*.js')
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
			return gulp.src(app + '/**/*.js')
				.pipe(concat(app + '.js'))
				.pipe(gulpif(!dev, uglify({'preserveComments': 'license'})))
				.pipe(gulp.dest(paths.output.js));
		}, 
		sass:	function(app) { 
			//Declare variables.
			var	die	=	false;
			
			//Run Gulp.
			return gulp.src(app)
				.pipe(sass({sourcemap: true, outputStyle: 'expanded'}))
				.on('error', notify.onError(function(error) {
					//Set die as true.
					die	=	true;
					
					//Log to the console.
					console.error(error);
					
					//Return the error.
					return error;
				}))
				.pipe(gulpif(!die, gulpif(dev, sourcemaps.init())))
				.pipe(autoprefix({browsers: '> 1%'}))
				.pipe(gulpif(!die, gulpif(!dev, minifyCSS({compatibility: 'ie8'}))))
				.pipe(gulpif(!die, gulpif(dev, sourcemaps.write())))
				.pipe(gulpif(!die, gulp.dest(paths.output.css), function() {
					//Reset die.
					die	=	false;
					
					//Return true.
					return true;
				}));
		}
};

//For each CSS/Sass application. 
files.sass.forEach(function(file) {
	//Get the name of the css application. 
	var	name	=	'css-' + file.replace('.scss', '');
	
	//Handle application.
	gulp.task(name, function() {
		//Run function.
		return functions.sass([paths.input.sass + '/stylesheets/' + file]);
	});
	
	//Add task.
	tasks.unshift(name);
});

//For each JavaScript application category.
/*files.js.forEach(function(jsFiles, app) {
	//For each set of files.
	jsFiles.forEach(function(file) {
		//Avoid hinting vendor code, it never works out.
		if (app !== 'vendor') {
			//Hint application.
			gulp.task('hint-' + app, function() {
				//Run function.
				return functions.hint(file);
			});
		}
		
		//Handle application.
		gulp.task('js-' + app, ['hint-' + file], function() {
			//Run function.
			return functions.js(file);
		});
		
		//Add task to modernizr. 
		scripts.unshift('js-' + file);
	});
});*/

//Version control.
gulp.task('version', function() {
	//Run Gulp.
	gulp.src([
		'index.html'
	], {base: './'})
		.pipe(replace(/(.*(css|js))(\?v=.*)?(\".*)/g, '$1?v=' + version + '$4'))
		.pipe(gulp.dest('./'));
	
	//Run Gulp.
	gulp.src('./package.json')
		.pipe(replace(/(.*)(\"version\": \")(.*)(\".*)/g, '$1$2' + version + '$4'))
		.pipe(gulp.dest('./'));
});

//BrowserSync.
gulp.task('browserSync', function() {
	//BrowserSync.
	browserSync.init({
		files: [
			paths.output.index + '/*.html', 
			paths.output.images + '/*',
			paths.output.css + '/*', 
			paths.output.js + '/*'
		], 
		open: false, 
		ui: {
			port: 4040
		}, 
		server: {
			baseDir: "./", 
		}, 
		port: 4044
	});
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

//Modernizr.
gulp.task('scripts', scripts, function() {
	return gulp.src([paths.input.js + '/**/*.js'])
		.pipe(modernizr())
		.pipe(gulp.dest(paths.output.js));
});

//Watch for changes.
gulp.task('watch', function() {
	//For each CSS application.
	//apps.css.forEach(function(app) {
		//Setup watch for Sass Apps. 
		//gulp.watch([paths.input.sass + '/**/*.scss'], ['css-' + app]);
	//});
	
	//For each JS application.
	//apps.js.forEach(function(app) {
		//Setup watch for Hint.
		//gulp.watch(paths.input.js + '/' + app + '/*.js', ['js-' + app]);
	//});
	
	//Watch for images. 
	//gulp.watch(paths.input.images + '/*', ['images']);
});


//Task runner.
gulp.task('default', tasks);