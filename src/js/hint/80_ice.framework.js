/** @Name		Ice Framework
 ** @URI		https://github.com/mookman288/Ice-Framework
 ** @Author		PxO Ink
 ** @AuthorURI	http://pxoink.net
 ** @License	MIT
 ** @Copyright	© 2014 PxO Ink. All Rights Reserved.
 **/

//Declare global variables.
var	ice			=	ice || {};
var	interval	=	interval || {};

/**
 * Gets query parameters. 
 * @author http://stackoverflow.com/a/439578
 * @param e
 * @returns object|array
 */
var	$_GET	=	function(){qs=document.location.search;qs=qs.split("+").join(" ");var t={},n,r=/[?&]?([^=]+)=([^&]*)/g;while(!!(n=r.exec(qs))){t[decodeURIComponent(n[1])]=decodeURIComponent(n[2]);}return t;}();	

/**
 * Accordions/Vertical Slides.
 */
ice.accordion	=	(function($) {
	//For sliders.
	$('*[data-slide]').each(function() {
		//Get this.
		var	$this	=	$(this); 
		
		//On click.
		$this.click(function() { console.log($this.data('slide'));
			//Toggle slide.
			$($this.data('slide')).slideToggle(400);
		});
	});
})(jQuery);

/**
 * Code blocks. 
 */ 
ice.codeBlocks	=	(function($) {
	//For each code block.
	$('pre > code').each(function() {
		//Declare variables.
		var	html	=	'';
		var	current	=	$(this).html();
		
		//Replace values, just in case.
		current		=	current.replace("\r\n", "\n");
		
		//Split on new line.
		current		=	current.split("\n");
		
		//For each line.
		$.each(current, function(key, line) {
			//If the key is first or last.
			if (key === 0 || key === (current.length - 1)) {
				//If there is no line.
				if ($.trim(line).length < 1) return true;
			}
			
			//Add the line to the html.
			html	+=	"<span>" + line + "</span>\r\n";
		});
		
		//Replace the html.
		$(this).html(html);
		
		//On click.
		$(this).click(function() {
			//For each child.
			$(this).children().each(function() {
				//If this is a span element.
				if ($(this).is("span")) {
					//Unwrap.
					$(this).contents().unwrap();
				}
			});
		});
	});
})(jQuery);

/**
 * Dismissal elements. 
 */ 
ice.dismissals	=	(function($) {
	//For each dismissable object.
	$('*[data-dismiss]').each(function() {
		//Add the dismiss class.
		$(this).addClass('dismiss');
		
		//On click.
		$(this).click(function() {
			//Fade the item out.
			$(this).fadeOut(400);
		});
	});
})(jQuery);

/**
 * Galleries. 
 */
ice.galleries	=	(function($) {
	//For each gallery.
	$('.gallery').removeWhitespace().each(function() {
		//Get this.
		var	$this	=	$(this);
		
        //Adjust the CSS of each image.
        $this.addClass('base-half-margin').find('img').css({'vertical-align': 'bottom', 'opacity': 0});
		
		//When the images are fully loaded.
		$this.imagesLoaded(function() {
			//Get the target height.
            var    targetHeight    =    $this.data('height');
            
            //Get the direction.
            var    direction        =    $this.data('direction');
            
            //Create the settings object.
            var    settings        =    {'allowPartialLastRow': true};
            
            //If there is a target height.
            if (typeof targetHeight !== "undefined") {
                //Set the height. 
                settings.targetHeight    =    targetHeight;
            }
            
            //If there is a direction.
            if (typeof direction !== "undefined") {
                //Set the direction.
                settings.direction    =    direction;
            }
			
			//CollagePlus.
            $this.collagePlus(settings);
            
            //Create the timer.
            var    timer;
            
            //Resize the element.
            $(window).bind('resize', function() {
                //Hide the images.
                $this.find('img').css('opacity', 0);
                
                //If there is a timer.
                if (timer) clearTimeout(timer);
                
                //Create a new timer.
               timer	=	setTimeout(function() { $this.collagePlus(settings); }, 250);
            });
		});
	});
})(jQuery);

/**
 * Mobile menu code.
 */
ice.menues        =    (function($) {
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
        //Get this.
        var    $this    =    $(this);
        var    $nav    =    $this.children('ul:last-child');
        
        //When the mobile menu is clicked.
        $this.children('ul:first-child').find('a').click(function() { 
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

/**
 * Scrolling behavior override. 
 */
ice.scrolling	=	(function($) {
	//If scrollto is allowed.
	if (!$('html').data('no-scroll')) {
		//For each scrollto.
		$('a:not([data-no-scroll])').each(function() {
			//Get this.
			var	$this	=	$(this);
			
			//Check if the hash is the first element.
			if ($this.attr('href').substring(0, 1) === '#') {
				//On click.
				$this.click(function(e) { 
					//Get the element to scroll to.
					var	$ele	=	$($this.attr('href'));
					var	top		=	(!$ele.length) ? -1 : Math.ceil($ele.offset().top);
					
					//If the area of the element is somewhere in the page. 
					if (top > 0 && !$this.data('no-scroll')) {
						//Scroll to the element.
						jQuery('body, html').animate({scrollTop: (top > 40) ? top - 40 : top}, 400);
					}
					
					//Prevent default functionality.
					e.preventDefault();
					
					//Return false.
					return false;
				});
			}
		});
	}
})(jQuery);

/**
 * Implements a slide change. 
 * @param $parent
 * @param dir
 */
ice.slide	=	function($parent, dir) {
	//Declare variables.
	var	num			=	$parent.children().length;
	var	rand		=	$parent.data('id');
	
	//Clear the interval.
	clearInterval(interval[rand]);
	
	//Fade the element out.
	$parent.children('.active').fadeOut(400, function() {
		//Get the element.
		var	$this		=	jQuery(this);
		
		//Get the current index.
		var	cur		=	$this.index();
		
		//Remove the active class.
		$this.removeClass('active');
		
		//Get the next element depending upon the direction.
		var	ele		=	(dir < 1) ? (cur !== 0) ? (cur - 1) : (num - 1) : (cur !== (num - 1)) ? (1 + cur) : 0;

		//Fade in the slide.
		$parent.children().each(function() { 
			//Declare that.
			var $that	=	jQuery(this);
			
			//If the index is correct.
			if ($that.index() == ele) {
				//Fade the element in.
				$that.fadeIn(400).addClass('active');
				
				//Restart the interval.
				interval[rand] = setInterval(function() {
					//Slide. 
					ice.slide($parent, 1);
				}, 10000);
			}
		});
	});
};

/**
 * Sliders. 
 */
ice.sliders		=	(function($) {
	//Implement slider.
	$('.slider').each(function() { 
		//Declare variables.
		var	$this	=	$(this);
		var	rand	=	Math.round(Date.now() * Math.random());
		
		//Fade in the first slide.
		$this.children(':first-child').addClass('active');
		
		//Add the random value.
		$this.attr('data-id', rand);
		
		//Set interval.
		interval[rand] = setInterval(function() {
			//Slide. 
			ice.slide($this, 1);
		}, 10000);
		
		//On hover.
		$this.mouseenter(function() {
			//Set active.
			$this.addClass('active');
			
			//Clear the interval.
			clearInterval(interval[rand]);
		}).mouseleave(function() {
			//Set inactive.
			$this.removeClass('active');
			
			//Restart the interval.
			interval[rand] = setInterval(function() {
				//Slide. 
				ice.slide($this, 1);
			}, 10000);
		});
		
		//Keystrokes.
		$(document).keydown(function (e) {
			//Switch key movements.
			switch(e.which) {
				case 37:
					//Only activate this keypress if the element is active.
					if ($this.hasClass('active')) {
						//Slide right.
						ice.slide($this, 0);
						
						//Return false.
						return false;
					}
				break;
				case 39:
					//Only activate this keypress if the element is active.
					if ($this.hasClass('active')) {
						//Slide right. 
						ice.slide($this, 1);
						
						//Return false.
						return false;
					}
				break;
			}
		});
		
		//On slide left.
		$('.slide-left').click(function() {
			//Slide left.
			ice.slide($this, 0);
		});
		
		//On slide right. 
		$('.slide-right').click(function() {
			//Slide right. 
			ice.slide($this, 1);
		});
	});
})(jQuery);

/**
 * Tabs
 */ 
ice.tabs		=	(function($) {
	//Impement tabs.
	$('.tabs').each(function() { 
		//Declare variables.
		var	$this	=	$(this);
		var	hrefs	=	'';
		
		//Confirm showtab exists.
		$_GET.showTab	=	(typeof $_GET.showTab !== 'undefined') ? $_GET.showTab : false;
		
		//If there is no show tab.
		if (!$_GET.showTab) {
			//Set the active class.
			$this.find('a').eq(0).addClass('active');
		}
		
		//For each hrefs. 
		$this.find('a').each(function() {
			//Get that.
			var	$that	=	jQuery(this);
			
			//Increment hrefs.
			hrefs	+=	$(this).attr('href') + ',';
			
			//Add no scroll.
			$that.attr('data-no-scroll', true);
			
			//If there is a show tab, and this element matches.
			if ($_GET.showTab && ('#' + $_GET.showTab) == $(this).attr('href')) {
				//Activate.
				$that.addClass('active');
			}
		}).click(function() {
			//Remove the active class.
			$this.find('a').not(this).removeClass('active');
			
			//Fade out the content. 
			$(hrefs).not($(this).attr('href')).hide();
			
			//Fade in the content. 
			$($(this).addClass('active').attr('href')).fadeIn(400);
		});
		
		//rtrim comma.
		hrefs	=	hrefs.replace(/,+$/,'');
		
		//If there is no show tab.
		if (!$_GET.showTab) {
			//Hide all elements.
			$(hrefs).not($this.find('a:first').addClass('active').attr('href')).hide();
		} else { 
			//Scroll down.
			$('#' + $_GET.showTab).ScrollTo();
			
			//Hide all but this element.
			$(hrefs).not('#' + $_GET.showTab).hide();
		}
	});
})(jQuery);