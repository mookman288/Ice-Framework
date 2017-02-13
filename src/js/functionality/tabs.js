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