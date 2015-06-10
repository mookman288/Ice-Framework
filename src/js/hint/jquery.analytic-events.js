/** @Name		jQuery Analytic Events
 ** @URI		https://github.com/mookman288/Ice-Framework
 ** @Author		PxO Ink
 ** @AuthorURI	http://pxoink.net
 ** @License	MIT
 ** @Copyright	© 2015 PxO Ink. All Rights Reserved.
 **/

//On document ready.
jQuery(document).ready(function() {
	//Declare variables.
	var	loc		=	(!jQuery('link[rel=canonical]').attr('href').length) ? window.location.pathname : jQuery('link[rel=canonical]').attr('href');
	var	action	=	jQuery('title').text() + ' (' + loc + ')';
	
	//When any anchor is clicked.
	jQuery('a').click(function() {
		//Determine the label.
		var	label	=	(!jQuery(this).attr('href').length) ? jQuery(this).text() : jQuery(this).attr('href');
		
		//Track event.
		tgae('Anchor/Link Clicked', action, label);
	});
	
	//When any input is interacted with.
	jQuery('input').each(function() {
		//Get this.
		var	$this	=	jQuery(this);
		var	id		=	$this.attr('id');
		var	name	=	(!$this.attr('name')) ? (typeof id === "undefined") ? $this.attr('type') : id : $this.attr('name');
		var	label	=	(typeof id === "undefined") ? name : (!jQuery('label[for=' + id + ']').length) ? name : jQuery('label[for=' + id + ']').text();
		
		//If the element is clicked.
		$this.click(function() {
			//Track event.
			tgae('Input Clicked', action, label);
		});
		
		//If the element is typed into.
		$this.one('keypress', function() {
			//Track event.
			tgaer('Input Typed Into', action, label);
		});
	});
	
	//When any textarea is interacted with.
	jQuery('textarea').each(function() {
		//Get this.
		var	$this	=	jQuery(this);
		var	id		=	$this.attr('id');
		var	name	=	(!$this.attr('name')) ? (typeof id === "undefined") ? $this.attr('type') : id : $this.attr('name');
		var	label	=	(typeof id === "undefined") ? name : (!jQuery('label[for=' + id + ']').length) ? name : jQuery('label[for=' + id + ']').text();
		
		//If the element is clicked.
		$this.click(function() {
			//Track event.
			tgae('Textarea Clicked', action, label);
		});
		
		//If the element is typed into.
		$this.one('keypress', function() {
			//Track event.
			tgaer('Textarea Typed Into', action, label);
		});
	});
		
	//When any select is interacted with.
	jQuery('select').each(function() {
		//Get this.
		var	$this	=	jQuery(this);
		var	id		=	$this.attr('id');
		var	name	=	(!$this.attr('name')) ? (typeof id === "undefined") ? $this.children('option:first-child').text() : id : $this.attr('name');
		var	label	=	(typeof id === "undefined") ? name : (!jQuery('label[for=' + id + ']').length) ? name : jQuery('label[for=' + id + ']').text();
		
		//If the element is clicked.
		$this.click(function() {
			//Track event.
			tgae('Select Clicked', action, label);
		});
		
		//If the element is changed.
		$this.change(function() {
			//Track event.
			tgae('Select Changed', action, label);
		});		
	});
	
	//When any video element is interacted with.
	jQuery('embed, video').each(function() {
		//Get this.
		var	$this	=	jQuery(this);
		
		//If the element is clicked.
		$this.one('click', function() {
			//Track event.
			tgae('Video/Embed Clicked', action, $this.attr('src'));
		});
	});
	
	//When an object is interacted with.
	jQuery('object').each(function() {
		//Get this.
		var	$this	=	jQuery(this);
		
		//If the element is clicked.
		$this.one('click', function() {
			//Track event.
			tgae('Object Clicked', action, $this.attr('data'));
		});
	});
	
	//When a canvas is interacted with.
	jQuery('canvas').each(function() {
		//Get this.
		var	$this	=	jQuery(this);
		var	label	=	(typeof $this.attr('id') === "undefined") ? $this.attr('class') : $this.attr('id');
		
		//If the element is clicked.
		$this.one('click', function() {
			//Track event.
			tgae('Canvas Clicked', action, label);
		});
		
		//If the element is hovered.
		$this.one('mouseover', function() {
			//Track event.
			tgae('Canvas Mouse Interaction', action, label);
		});
	});
	
	//When an iframe is interacted with.
	jQuery('iframe').each(function() {
		//Get this.
		var	$this	=	jQuery(this);
		
		//If the element is clicked.
		$this.one('click', function() {
			//Track event.
			tgae('Inline Frame Clicked', action, $this.attr('src'));
		});
		
		//If the element is hovered.
		$this.one('mouseover', function() {
			//Track event.
			tgae('Inline Frame Mouse Interaction', action, $this.attr('src'));
		});
	});
});

/**
 * Function to push google analytics events. 
 * 
 * @param category
 * @param action
 * @param label
 */
function trackGAEvent(category, action, label) {
	//Push the events.
	if (typeof ga != "undefined") ga('send', 'event', category, action, label);
}

/**
 * Alias function for GA event tracking. 
 * 
 * @param c
 * @param a
 * @param l
 */
function tgae(c, a, l) {
	//Track the event. 
	trackGAEvent(c, a, l);
}