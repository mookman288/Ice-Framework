if (typeof ice !== 'undefined') {
	ice.f.mobile.menus	=	(function($) {
		//For each navigation.
		$('nav').find('li > ul').each(function() { 
			//Get the dropdown nav. 
			var	$trigger	=	$(this).parent('li');
			
			//Get the target.
			var $target		=	$trigger.children('ul');
			
			//Add the appropriate dropdown class.
			$trigger.addClass('dropdown');
			
			//For specific anchors that are clicked. 
			$trigger.children('a').click(function(e) {
				//If this is a target, prevent the link from working.
				if ($(this).attr('href').substring(0, 1) === '#') e.preventDefault();
			});
			
			//When the mobile menu is clicked.
			$trigger.click(function(e) {
				//Stop propagation up for nested elements. 
				e.stopPropagation();
				
				//Based on whether there is an active class (this ensures order of operations on class assignment.) 
				if (!$trigger.hasClass('active')) {
					//Add the active class. 
					$trigger.addClass('active');
					
					//Slide the target down. 
					$target.stop().slideDown(ice.interval);
				} else {
					//Slide the target up.
					$target.stop().slideUp(ice.interval, function() {
						//Remove the active class.
						$trigger.removeClass('active'); 
					});
				}
			});
		});
	})(jQuery);
}