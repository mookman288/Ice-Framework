if (typeof ice !== 'undefined') {
	ice.f.mobile.menus	=	(function($) {
		//For each navigation.
		$('nav').each(function() { 
			//Capture this navigational element.
			var	$nav	=	$(this); 
			
			//Find nested menues.
			$nav.find('li > ul').each(function() {
				//Get the target dropdown. 
				$target		=	$(this); 
				
				//Get the dropdown nav. 
				$dropdown	=	$target.parent();
				
				//Add the appropriate dropdown class.
				$dropdown.addClass('dropdown');
				
				//For specific anchors that are clicked. 
				$dropdown.children('a').click(function(e) {
					//If this is a target, prevent the link from working.
					if ($(this).attr('href').substring(0, 1) === '#') e.preventDefault();
				});
				
				//When the mobile menu is clicked.
				$dropdown.click(function(e) {
					//Toggle the dropdown class.
					$(this).toggleClass('active'); 
					
					//Toggle the navigation into view. 
					$target.slideToggle(ice.interval);
				});
			});
		});
	})(jQuery);
}