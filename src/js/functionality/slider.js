if (typeof ice !== 'undefined') {
	ice.f.slider	=	(function($) {
		//Capture all of the sliders.
		var	$sliders	=	$('*[data-slider]');
		
		//If there are sliders.
		if ($sliders.length > 0) {
			//For each slide. 
			$sliders.each(function() {
				//Assign the individual slider from this. 
				var	$slider	=	$(this); 
				
				//On click.
				$slider.click(function() { 
					//Toggle slide.
					$($slider.data('slide')).slideToggle(ice.interval);
				});
			});
		}
	})(jQuery);
}