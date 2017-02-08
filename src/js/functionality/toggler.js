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
					$($toggler.data('toggle')).slideToggle(ice.interval);
					
					//Return false.
					return false;
				});
			});
		}
	})(jQuery);
}