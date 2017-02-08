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
                    var    $e    =    jQuery(jQuery(this).data('icebox'));
					
					//Get the html.
                    html    =    jQuery('<div>').append($e.clone()).html();
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
				jQuery('body').append($shadow.append($icebox));
				
				//Fade the shadow in.
				jQuery('#ice-shadow').fadeIn('400', function() {
					//Fade the icebox in.
					jQuery('#icebox').fadeIn('400', function() {
						//Declare this.
						var	$this	=	jQuery(this);
						var	$parent	=	$this.parent();
						
						//Recalculate element.
						recalculateIcebox($parent, $this, $this.children('div'));
						
						//Create a new timer.
						var    timer;
						
						//Resize the element.
						jQuery(window).bind('resize', function() { 
							//Set the div to display none.
							//$this.children('div').animate({'opacity': 0}, 125).css('display': 'none');
							
							//If there is a timer.
							if (timer) clearTimeout(timer);
							
							//Create a new timer.
							timer	=	setTimeout(function() {
								//Recalculate element.
								recalculateIcebox($parent, $this, $this.children('div'));
							}, 250);
						});
						
						//Set close listener.
						jQuery('#icebox-close').click(function(e) {
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

/**
 * Recalculates an element based on its child and vise-versa.
 */
function	recalculateIcebox($parent, $this, $child, repeat) {
	//Declare variables.
	var	options	=	{'queue': false, 'duration': (!repeat) ? 0 : 125};
	
	//If this is not a repeat.
	if (!repeat) {
		//Reset CSS.
		$this.css({'width': 'auto', 'height': 'auto'});
		$child.css({'width': 'auto', 'height': 'auto'});
	}
	
	//Get the heights and widths.
	var	cHeight	=	$child.height();
	var	cWidth	=	$child.width();
	var	height	=	$this.height();
	var	width	=	$this.width();
	
	//Calculate the height.
	if (height > cHeight) {
		$this.animate({'height': $child.outerHeight()}, options);
	} else if (cHeight > height) {
		$child.animate({'height': $this.height()}, options);
	}
	
	//Calculate the width.
	if (width > cWidth) {
		$this.animate({'width': $child.outerWidth()}, options);
	} else if (cWidth > width) {
		$child.animate({'width': $this.width()}, options);
	}
	
	//If this is not a repeat.
	if (!repeat) {
		//Set the CSS.
		$child.css('display', 'inline-block');
		
		//Repeat. 
		recalculateIcebox($parent, $this, $child, true);
	} else {
		//Set a timeout.
		setTimeout(function() {
			//Center the element.
			$this.animate({'top': (($parent.outerHeight() - $this.outerHeight()) / 2)}, options);
			$this.animate({'left': (($parent.outerWidth() - $this.outerWidth()) / 2)}, options);
			
			//Show the element.
			$this.animate({'opacity': 1}, {'queue': false, 'duration': 250});
		}, 126);
	}
}

//If jQuery exists.
if (typeof jQuery !== 'undefined') {
	//Launch icebox. 
	icebox();
} else {
	//Create a new script.
	var	script		=	document.createElement('script');
	
	//Set the script attributes.
	script.src		=	"https://code.jquery.com/jquery-1.12.1.min.js";
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