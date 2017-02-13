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
var	tasks		=	(!dev) ? ['images', 'javascript', 'version'] : ['images', 'javascript', 'browserSync', 'watch', 'version'];

//Get the package.json version.
var	version		=	JSON.parse(fs.readFileSync('./package.json')).version.split('.');

//For each version value.
for(i = 0; i < version.length; i++) {
	//Parse the version as an integer type. 
	version[i]	=	parseInt(version[i]); 
}

//Get the increment value.
var	increment	=	(!dev) ? ((version[3] % 2 !== 0) ? 1 : 2) : ((version[3] % 2 !== 0) ? 2 : 1);

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
		'sass':		'./src/sass',
		'npm':		'./node_modules'
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
			init: 			paths.input.js + '/init/',
			utilities:		paths.input.js + '/utilities/', 
			functionality:	paths.input.js + '/functionality/', 
			vendor:			paths.input.js + '/vendor/'
		}, 
		"js-vendor":			[
			paths.input.npm + '/jquery/dist/jquery.js'
		]
};

//Store all processing functions. 
var	functions	=	{
		hint:	function(files) { 
			//Run Gulp.
			return gulp.src(files)
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
		js:		function(files, filename) { 
			//Run Gulp.
			return gulp.src(files)
				.pipe(concat(filename))
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

//Handle all vendor JS. 
gulp.task('js-vendor', function() {
	return gulp.src(files["js-vendor"])
		.pipe(gulp.dest(paths.input.js + '/vendor/'));
});

//Hint the files.
gulp.task('js-hint', ['js-vendor'], function() {
	//Declare variables.
	var	scripts	=	[];
	
	//For each JavaScript application category.
	for (var type in files.js) {
		//Skip the loop if the property is from prototype.
		if (!files.js.hasOwnProperty(type)) continue;
		
		//For each set of files.
		fs.readdirSync(files.js[type]).forEach(function(file) {
			//Never hint a vendor file. 
			if (type !== 'vendor') { 
				scripts.push(paths.input.js + '/' + type + '/' + file);
			} 
		});
	}
	
	//Hint the file. 
	functions.hint(scripts);
});

//Handle all framework JS. 
gulp.task('js-framework', ['js-hint'], function() {
	//Declare variables.
	var	vendor	=	[];
	var	scripts	=	[];
	
	//For each JavaScript application category.
	for (var type in files.js) {
		//Skip the loop if the property is from prototype.
		if (!files.js.hasOwnProperty(type)) continue;
		
		//For each set of files.
		fs.readdirSync(files.js[type]).forEach(function(file) { 
			//Handle vendors differently. 
			if (type.indexOf('vendor') < 0) {
				scripts.push(paths.input.js + '/' + type + '/' + file);
			} else {
				vendor.push(paths.input.js + '/' + type + '/' + file);
			}
		});
	}
	
	//Run the JavaScript compiler.
	functions.js(vendor, 'vendor.js');
	functions.js(scripts, 'framework.js');
});

//Scripts and modernizr. 
gulp.task('javascript', ['js-framework'], function() {
	return gulp.src([paths.input.js + '/**/*.js'])
		.pipe(modernizr())
		.pipe(gulpif(!dev, uglify({'preserveComments': 'license'})))
		.pipe(gulp.dest(paths.output.js));
});

//Watch for changes.
gulp.task('watch', function() {
	//For each CSS/Sass application. 
	files.sass.forEach(function(file) {
		//Get the name of the css application. 
		var	name	=	file.replace('.scss', '');
		
		//Adjust for the stylesheet being a special catch-all for the framework CSS. 
		var	watcher	=	(name !== 'stylesheet') ? [
			paths.input.sass +	 '/resources/**/*.scss', 
			paths.input.sass + '/variables/**/*.scss', 
			paths.input.sass + '/components/' + name + '/**/*.scss', 
			paths.input.sass + '/stylesheets/' + file
		] : [
			paths.input.sass + '/**/*.scss'
		];
		
		//Watch for changes to the Sass.
		gulp.watch(watcher, ['css-' + name]);
	});
	
	//Watch for changes to the JavaScript. 
	gulp.watch(paths.input.js + '/**/*.js', ['javascript']);
	
	//Watch for images. 
	gulp.watch(paths.input.images + '/*', ['images']);
});


//Task runner.
gulp.task('default', tasks);