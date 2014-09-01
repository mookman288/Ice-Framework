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
		'scrollto'	:	'jquery.scrollto.min',
		'sticky'	:	'jquery.sticky.min',
		'whitespace':	'jquery.removeWhitespace.min'
	}
});

//Declare global variables.
var	interval	=	new Object();
var $_GET		=	getQueryParams(document.location.search);

//Require Modernizr.
require(["modernizr.min"]);

//Require jQuery.
require(["jquery"], function(jQuery) { 
	//Declare requirements.
	require(["collage"]);
	require(["equalize"]);
	require(["icebox"]);
	require(["scrollto"]);
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
		
		//For each dismissable object.
		jQuery('*[data-dismiss]').each(function() {
			//Add the dismiss class.
			jQuery(this).addClass('dismiss');
			
			//On click.
			jQuery(this).click(function() {
				//Fade the item out.
				jQuery(this).fadeOut(400);
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
				//Keystrokes.
				jQuery(document).keydown(function (e) {
					//Switch key movements.
					switch(e.which) {
						case 37:
							//Slide left.
							slide($this, 0);
							
							//Return false.
							return false;
						break;
						case 39:
							//Slide right.
							slide($this, 1);
							
							//Return false.
							return false;
						break;
					}
				});
				
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
				//Slide left.
				slide($this, 0);
			});
			
			//On slide right. 
			jQuery('.slide-right').click(function() {
				//Slide right. 
				slide($this, 1);
			});
		});
		
		//Impement tabs.
		jQuery('.tabs').each(function() { 
			//Declare variables.
			var	$this	=	jQuery(this);
			var	hrefs	=	'';
			
			//For each hrefs. 
			$this.find('a').each(function() {
				//Increment hrefs.
				hrefs	+=	jQuery(this).attr('href') + ',';
				
				//If there is a show tab, and this element matches.
				if ($_GET['showTab'] && ('#' + $_GET['showTab']) == jQuery(this).attr('href')) {
					//Activate.
					jQuery(this).addClass('active');
				}
			});
			
			//rtrim comma.
			hrefs	=	hrefs.replace(/,+$/,'');
			
			//If there is no show tab.
			if (!$_GET['showTab']) {
				//Hide all elements.
				jQuery(hrefs).not($this.find('a:first').addClass('active').attr('href')).hide();
			} else { 
				//Scroll down.
				jQuery('#' + $_GET['showTab']).ScrollTo();
				
				//Hide all but this element.
				jQuery(hrefs).not('#' + $_GET['showTab']).hide();
			}
			
			//For each nav element.
			$this.find('a').click(function() {
				//Remove the active class.
				$this.find('a').not(this).removeClass('active');
				
				//Fade out the content. 
				jQuery(hrefs).not(jQuery(this).attr('href')).hide();
				
				//Fade in the content. 
				jQuery(jQuery(this).addClass('active').attr('href')).fadeIn(400);
			});
		});
		
		//For sliders.
		jQuery('*[data-slide-id], *[data-slide-class]').each(function() {
			//Get the id or class.
			var	elements	=	(!jQuery(this).data('slide-id')) ? '.' + jQuery(this).data('slide-class') : '#' + jQuery(this).data('slide-id');
			
			//On click.
			jQuery(this).click(function() {
				//Toggle slide.
				jQuery(elements).slideToggle(400);
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
		
		//If scrollto is allowed.
		if (!jQuery('html').data('no-scroll')) {
			//For each scrollto.
			jQuery('a').each(function() { 
				//Check if the hash is the first element.
				if (jQuery(this).attr('href').substring(0, 1) === '#') {
					//On click.
					jQuery(this).click(function(e) {
						//Get the element to scroll to.
						var	ele	=	jQuery(this).attr('href');
						
						//Scroll to the element.
						jQuery(ele).ScrollTo();
						
						//Prevent default functionality.
						e.preventDefault();
						
						//Return false.
						return false;
					});
				}
			});
		}
		
		//If there is history.
		if (jQuery('html').data('history')) {
			
		}
		
		//Keystrokes.
		jQuery(document).keydown(function (e) {
			//Switch key movements.
			switch(e.which) {

			}
		});
	});
});

/**
 * Gets query parameters. 
 * @author http://stackoverflow.com/a/439578
 * @param e
 * @returns {___anonymous6837_6838}
 */
function getQueryParams(e){e=e.split("+").join(" ");var t={},n,r=/[?&]?([^=]+)=([^&]*)/g;while(n=r.exec(e)){t[decodeURIComponent(n[1])]=decodeURIComponent(n[2])}return t}

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