/** @Name		icebox.js
 ** @URI		http://pxoink.net/articles/icebox
 ** @Author		PxO Ink
 ** @AuthorURI	http://pxoink.net
 ** @License	MIT
 ** @Copyright	© 2014 PxO Ink. All Rights Reserved.
 **/

/**
 * Icebox.  
 */
var	icebox	=	function() {
	//When the document is ready.
	jQuery(document).ready(function() { 
		//Declare global variables.
		var	icebox	=	false;
		
		//For each element to invoke icebox.
		jQuery('*[data-icebox]').each(function() { 
			//Declare variables.
			var	html;
			
			//Add cursor pointer.
			jQuery(this).addClass('icebox');
			
			//For each invoking.
			jQuery(this).click(function(e) {
				//If the icebox is set to true.
				if (icebox)	{
					//Prevent default functionality.
					e.preventDefault();
					
					//Return false.
					return false;
				}
				
				//Set icebox is true.
				icebox		=	true;
				
				//Get the image.
				var	imgSrc	=	jQuery(this).data('src');
				
				//If there is no image. 
				if (!imgSrc) { 
					//Get the element.
					var	$e	=	jQuery('#' + jQuery(this).attr('data-icebox-id')); 
					
					//Get the html.
					html	=	$e.html();
				} else {
					//Get the alt text.
					var alt	=	jQuery(this).attr('alt');
					
					//Get the html.
					html	=	jQuery('<img>', {src: imgSrc, alt: alt});
				}
				
				//Create elements.
				var	$shadow	=	jQuery('<div>', {id: 'ice-shadow'});
				var	$close	=	jQuery('<a>', {id: 'icebox-close', 
					href: '#icebox-close', title: 'Close'}).html('&times;');
				var	$div	=	jQuery('<div>').append(html);
				var	$icebox	=	jQuery('<div>', {id: 'icebox'}).append($close).append($div);
				
				//Append the shadow and icebox.
				jQuery('body').append($shadow).append($icebox);
				
				//Fade the shadow in.
				jQuery('#ice-shadow').fadeIn('400', function() {
					//Fade the icebox in.
					jQuery('#icebox').fadeIn('400', function() {
						//Center the element.
						jQuery(this).css("top", (((jQuery(window).height() - jQuery(this).outerHeight()) / 2) + jQuery(window).scrollTop()));
						jQuery(this).css("left", (((jQuery(window).width() - jQuery(this).outerWidth()) / 2) + jQuery(window).scrollLeft()));
						
						//Set close listener.
						jQuery('#icebox-close, #ice-shadow').click(function(e) {
							//Prevent default.
							e.preventDefault();
							
							//Fade the icebox out.
							jQuery('#icebox').fadeOut('400', function() {
								//Fade the shadow out.
								jQuery('#ice-shadow').fadeOut('400', function() {
									//Kill the icebox and the shadow.
									jQuery('#ice-shadow, #icebox').remove();
									
									//Set icebox is false.
									icebox	=	false;
								});
							});
							
							//Return fales.
							return false;
						});
					});
				});
				
				//Prevent default functionality.
				e.preventDefault();
				
				//Return false.
				return false;
			});
		});
	});
};

//If jQuery exists.
if (typeof jQuery !== 'undefined') {
	//Launch icebox. 
	icebox();
} else {
	//Create a new script.
	var	script		=	document.createElement('script');
	
	//Set the script attributes.
	script.src		=	"https://code.jquery.com/jquery-1.11.1.min.js";
	script.type		=	"text/javascript";
	
	//Shim jQuery in.
	document.getElementsByTagName("head")[0].appendChild(script);
	
	//Create a new interval.
	var	i			=	0;
	var	interval	=	setInterval(function() {
		//Only poll for jQuery five times. 
		if (i < 5) {
			//If jQuery is here. 
			if (window.jQuery) {
				//Clear the interval.
				clearInterval(interval);
				
				//Launch icebox.
				icebox();
			}
		} else {
			//Clear the interval.
			clearInterval(interval);
			
			//Log the error.
			console.error('Unexpected error: jQuery must be loaded before running icebox.js.');
		}
	}, 250);
}