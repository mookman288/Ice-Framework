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