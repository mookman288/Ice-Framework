/** @Name		Ice Framework
 ** @URI		https://github.com/mookman288/Ice-Framework
 ** @Author		PxO Ink
 ** @AuthorURI	http://pxoink.net
 ** @License	MIT
 ** @Copyright	© 2014 PxO Ink. All Rights Reserved.
 **/

//Set the require config.
requirejs.config({
	paths: {
		'collage'	:	'jquery.collagePlus.min',
		'equalize'	:	'equalizeHeights.min',
		'jquery'	:	'jquery-1.11.1.min',
		'icebox'	:	'icebox',
		'modernizr'	:	'modernizr.min',
		'sticky'	:	'jquery.sticky.min',
		'whitespace':	'jquery.removeWhitespace.min'
	}
});

//Declare global variables.
var	interval	=	new Object();

//Require Modernizr.
require(["modernizr.min"]);

//Require jQuery.
require(["jquery"], function(jQuery) { 
	//Declare requirements.
	require(["collage"]);
	require(["equalize"]);
	require(["icebox"]);
	require(["sticky"], function() {
		//When the DOM is ready.
		jQuery('document').ready(function() {
			//For each sticky element.
			jQuery('.sticky').each(function() {
				//Declare variables.
				var	position	=	(!jQuery(this).data('position')) ? 'top' : jQuery(this).data('position');
				var	center		=	(!jQuery(this).data('center')) ? false : true;
				
				//If the position is bottom. 
				if (position == 'bottom') {
					//Sticky.
					jQuery(this).sticky({bottomSpacing: 0, center: center, className: 'stuck'});
				} else {
					//Sticky.
					jQuery(this).sticky({topSpacing: 0, center: center, className: 'stuck'});
				}
			});
		});
	});
	require(["whitespace"]);
	
	//When the DOM is ready.
	jQuery('document').ready(function() {
		//For each code block.
		jQuery('code').each(function() {
			//Declare variables.
			var	html	=	'';
			var	current	=	jQuery(this).html();
			
			//Replace values, just in case.
			current		=	current.replace("\r\n", "\n");
			
			//Split on new line.
			current		=	current.split("\n");
			
			//For each line.
			jQuery.each(current, function(key, line) {
				//If the key is first or last.
				if (key === 0 || key === (current.length - 1)) {
					//If there is no line.
					if (jQuery.trim(line).length < 1) return true;
				}
				
				//Add the line to the html.
				html	+=	"<span>" + line + "</span>\r\n";
			});
			
			//Replace the html.
			jQuery(this).html(html);
			
			//On click.
			jQuery(this).click(function() {
				//For each child.
				jQuery(this).children().each(function() {
					//If this is a span element.
					if (jQuery(this).is("span")) {
						//Unwrap.
						jQuery(this).contents().unwrap();
					}
				});
			});
		});
		
		//For each gallery.
		jQuery('.gallery').removeWhitespace().each(function() {
			//Get the target height.
			var	targetHeight	=	jQuery(this).data('height');
			var	direction		=	jQuery(this).data('direction');
			
			//CollagePlus.
			jQuery(this).collagePlus({'direction': direction, 'targetHeight': targetHeight, 'allowPartialLastRow': true});
		});
		
		//Implement slider.
		jQuery('.slider').each(function() { 
			//Declare variables.
			var	$this	=	jQuery(this);
			var	rand	=	Math.round(Date.now() * Math.random());
			
			//Fade in the first slide.
			$this.children(':first-child').addClass('active');
			
			//Add the random value.
			$this.data('id', rand);
			
			//Set interval.
			interval.rand = setInterval(function() {
				//Slide. 
				slide($this, 1);
			}, 10000);
			
			//On hover.
			$this.hover(function() {
				//Clear the interval.
				clearInterval(interval.rand);
			}, function() {
				//Restart the interval.
				interval.rand = setInterval(function() {
					//Slide. 
					slide($this, 1);
				}, 10000);
			});
			
			//On slide left.
			jQuery('.slide-left').click(function() {
				slide($this, 0);
			});
			
			//On slide right. 
			jQuery('.slide-right').click(function() {
				slide($this, 1);
			});
		});

		//For each equalize.
		jQuery('*[data-equalize]').each(function() {
			//Get the equalize value.
			var	type	=	jQuery(this).data('equalize');
			
			//If the type is children.
			if (type == 'children') {
				jQuery(this).children().equalizeHeights();
			} else {
				jQuery(this).find(type).equalizeHeights();
			}
		});
		
		//Equalize heights.
		jQuery('.equalize').equalizeHeights();
	});
});

/**
 * Implements a slide change. 
 * @param $parent
 * @param dir
 */
function slide($parent, dir) {
	//Declare variables.
	var	num			=	$parent.children().length;
	var	rand		=	$parent.data('id');
	
	//Clear the interval.
	clearInterval(interval.rand);
	
	//Fade the element out.
	$parent.children('.active').fadeOut(400, function() {
		//Get the current index.
		var	cur		=	jQuery(this).index();
		
		//Remove the active class.
		jQuery(this).removeClass('active');
		
		//Get the next element depending upon the direction.
		var	ele		=	(dir < 1) ? (cur != 0) ? (cur - 1) : (num - 1) : (cur != (num - 1)) ? (1 + cur) : 0;

		//Fade in the slide.
		$parent.children().each(function() { 
			//If the index is correct.
			if (jQuery(this).index() == ele) {
				//Fade the element in.
				jQuery(this).fadeIn(400).addClass('active');
				
				//Restart the interval.
				interval.rand = setInterval(function() {
					//Slide. 
					slide($parent, 1);
				}, 10000);
			}
		});
	});
}