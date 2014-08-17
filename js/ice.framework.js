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
		'equalize'	:	'equalizeHeights.min',
		'jquery'	:	'jquery-1.11.1.min',
		'icebox'	:	'icebox.min',
		'modernizr'	:	'modernizr.min',
		'sticky'	:	'jquery.sticky.min'
	}
});

//Require Modernizr.
require(["modernizr.min"]);

//Require jQuery.
require(["jquery"], function(jQuery) { 
	//Declare requirements.
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
		jQuery('*[data-gallery]').each(function() {
			
		});
	});
});