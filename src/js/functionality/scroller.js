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
							var	top		=	(!$ele.length) ? -1 : Math.ceil($ele.offset().top);
							
							//If the area of the element is somewhere in the page. 
							if (top > 0 && !$a.data('no-scroll')) {
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