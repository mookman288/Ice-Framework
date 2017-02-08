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