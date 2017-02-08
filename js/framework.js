/** @Name		Ice Framework
 ** @URI		https://github.com/mookman288/Ice-Framework
 ** @Author		PxO Ink
 ** @AuthorURI	http://pxoink.net
 ** @License	MIT
 ** @Copyright	© 2014 PxO Ink. All Rights Reserved.
 **/

var	ice	=	ice || {
	interval: 400, 
	gutter: 40, 
	f: {
		mobile: {}
	}, 
	u: {}
};
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
				var	title	=	jQuery(this).attr('title'); 
				
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
				var	$title	=	(title.length > 0) ? jQuery('<p>').text(title) : '';
				var	$div	=	jQuery('<div>').append(html).append($title);
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
						
						//Put this to the bottom of the stack. 
						setTimeout(function() {
							//Recalculate element.
							recalculateIcebox($parent, $this, $this.children('div'));
						}, 100);
						
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
if (typeof ice !== 'undefined') {
	ice.f.code	=	(function($) {
		//If there are code blocks.
		if ($('pre > code').length > 0) {
			//For each code block.
			$('pre > code').each(function() {
				//Declare variables. 
				var	html	=	'';
				
				//Capture the code block. 
				var	$code	=	$(this);
				
				//Capture the code block content.
				var	content	=	$code.html();
				
				//Replace carriage return values, just in case.
				content		=	content.replace("\r\n", "\n");
				
				//Split on new line characters.
				content		=	content.split("\n");
				
				//For each line.
				$.each(content, function(key, line) {
					//If the key is first or last.
					if (key === 0 || key === (content.length - 1)) {
						//If there is no line.
						if ($.trim(line).length < 1) return true;
					}
					
					//Add the line to the html.
					html	+=	"<span>" + line + "</span>\r\n";
				});
				
				//Replace the html.
				$code.html(html);
				
				//On click.
				$code.click(function() {
					//For each child.
					$code.children().each(function() {
						//If this is a span element.
						if ($code.is("span")) {
							//Unwrap.
							$code.contents().unwrap();
						}
					});
				});
			});
		}
	})(jQuery);	
}
if (typeof ice !== 'undefined') {
	ice.f.dismissal	=	(function($) {
		//Capture all of the dismissable elements.
		var	$dismissals	=	$('*[data-dismiss]');
		
		//If there are dismissable elements.
		if ($dismissals.length > 0) {
			//For each dismissable elements.
			$dismissals.each(function() {
				//Assign the individual element from this.
				$dismissal	=	$(this); 
				
				//Add the dismiss class.
				$dismissal.addClass('dismiss');
				
				//On click.
				$dismissal.click(function() {
					//Fade the element out.
					$dismissal.fadeOut(400);
				});
			});
		}
	})(jQuery);
}
if (typeof ice !== 'undefined') {
	ice.f.mobile.menus	=	(function($) {
		//For each horizontal navigation.
		$('nav.horizontal').each(function() {
			//Find nested menues.
			$(this).find('li > ul').each(function() {
				//Add the chevron class.
				$(this).parent().children('a').addClass('chevron');
			});
		});
		
		//For each mobile navigation.
		$('nav.mobile').each(function() { 
			//Capture the last navigational element.
			var	$nav	=	$(this).children('ul:last-child');
			
			//When the mobile menu is clicked.
			$(this).children('ul:first-child').find('a').click(function() { 
				//Slide the navigation.
				$nav.slideToggle();
			});
			
			//Slide the nav elements down.
			$nav.find('li > ul').each(function() {
				//On click. 
				$(this).parent().children('a').click(function() { 
					//Slide the ul.
					$(this).parent().children('ul').slideToggle();
				});
			});
		});
	})(jQuery);
}
if (typeof ice !== 'undefined') {
	ice.f.scroller	=	(function($) {
		//If scroller is allowed.
		if (!$('html').data('no-scroll')) {
			//If there are anchors.
			if ($('a').length > 0) {
				//For each scroller.
				$('a:not([data-no-scroll])').each(function() {
					//Assign the anchor element.
					var	$a	=	$(this);
					
					//Check if the hash is the first element.
					if ($a.attr('href').substring(0, 1) === '#') {
						//On click.
						$a.click(function(e) { 
							//Prevent the anchor from moving. 
							e.preventDefault();
							
							//Get the element to scroll to.
							var	$ele	=	$($a.attr('href'));
							var	top		=	(!$ele.length) ? null : Math.ceil($ele.offset().top);
							
							//If the area of the element is somewhere in the page. 
							if (!$a.data('no-scroll')) {
								//Scroll to the element.
								jQuery('body, html').animate({scrollTop: (top > ice.gutter) ? top - ice.gutter : top}, ice.interval);
							}
							
							//Return false.
							return false;
						});
					}
				});
			}
		}
	})(jQuery);
}
if (typeof ice !== 'undefined') {
	ice.f.tabs	=	(function($) {
		//If there are tabs.
		if ($('.tabs').length > 0) {
			//For each collection of tabs.
			$('.tabs').each(function() { 
				//Declare variables.
				var	hrefs	=	'';
				
				//Assign the current tab collection.
				var	$tab	=	$(this);
				
				//Confirm tab exists.
				$_GET.tab	=	(typeof $_GET.tab !== 'undefined') ? $_GET.tab : false;
				
				//If there is no show tab.
				if (!$_GET.tab) {
					//Set the active class.
					$tab.find('a').eq(0).addClass('active');
				}
				
				//For each anchor.  
				$tab.find('a').each(function() {
					//Get that.
					var	$that	=	jQuery(this);
					
					//Increment hrefs.
					hrefs	+=	$(this).attr('href') + ',';
					
					//Add no scroll.
					$that.attr('data-no-scroll', true);
					
					//If there is a show tab, and this element matches.
					if ($_GET.tab && ('#' + $_GET.tab) == $(this).attr('href')) {
						//Activate.
						$that.addClass('active');
					}
				}).click(function() {
					//Remove the active class.
					$tab.find('a').not(this).removeClass('active');
					
					//Fade out the content. 
					$(hrefs).not($(this).attr('href')).hide();
					
					//Fade in the content. 
					$($(this).addClass('active').attr('href')).fadeIn(400);
				});
				
				//Remove commas from the end of the hrefs. 
				hrefs	=	hrefs.replace(/,+$/,'');
				
				//If there is no show tab.
				if (!$_GET.tab) {
					//Hide all elements.
					$(hrefs).not($tab.find('a:first').addClass('active').attr('href')).hide();
				} else { 
					//Scroll to the element.
					jQuery('body, html').animate({scrollTop: $('#' + $_GET.tab).offset().top}, 400);
					
					//Hide all but this element.
					$(hrefs).not('#' + $_GET.tab).hide();
				}
			});
		}
	})(jQuery);
}
if (typeof ice !== 'undefined') {
	ice.f.toggler	=	(function($) {
		//Capture all of the togglers.
		var	$togglers	=	$('*[data-toggle]');
		
		//If there are togglers.
		if ($togglers.length > 0) {
			//For each slide. 
			$togglers.each(function() {
				//Assign the individual toggler from this. 
				var	$toggler	=	$(this); 
				
				//On click.
				$toggler.click(function(e) { 
					//Prevent the element from triggering its normal action. 
					e.preventDefault();
					
					//Toggle slide.
					$($toggler.data('toggle')).stop().slideToggle(ice.interval);
					
					//Return false.
					return false;
				});
			});
		}
	})(jQuery);
}