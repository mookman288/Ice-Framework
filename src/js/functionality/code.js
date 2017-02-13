if (typeof ice !== 'undefined') {
	ice.f.code	=	(function($) {
		//If there are code blocks.
		if ($('pre > code').length > 0) {
			//For each code block.
			$('pre > code').each(function() {
				//Declare variables. 
				var	html	=	'';
				
				//Capture the code block. 
				var	$code	=	$(this);
				
				//Capture the code block content.
				var	content	=	$code.html();
				
				//Replace carriage return values, just in case.
				content		=	content.replace("\r\n", "\n");
				
				//Split on new line characters.
				content		=	content.split("\n");
				
				//For each line.
				$.each(content, function(key, line) {
					//If the key is first or last.
					if (key === 0 || key === (content.length - 1)) {
						//If there is no line.
						if ($.trim(line).length < 1) return true;
					}
					
					//Add the line to the html.
					html	+=	"<span>" + line + "</span>\r\n";
				});
				
				//Replace the html.
				$code.html(html);
				
				//On click.
				$code.click(function() {
					//For each child.
					$code.children().each(function() {
						//If this is a span element.
						if ($code.is("span")) {
							//Unwrap.
							$code.contents().unwrap();
						}
					});
				});
			});
		}
	})(jQuery);	
}