jQuery( document ).ready( function($) {
	
	$.getJSON( 'http://ben.balter.com/resume/?feed=json&callback=?', function(data){

	    	//propegate heading and contact info
	    	$.each( data, function( key, value ) {			   		
		    	
		    	//skip sections
		    	if ( key == 'sections' )
		    		return true;
		    	
		    	//handle url edge case
		    	if ( key == 'url' && $('#' + key ) ) {
			    	$('#' + key).attr( 'href', value );
			    	return true;
		    	}
		    	
		    	//everything else abstractly
		    	if ( $('#' + key) )
		    		$('#' + key).html( value );

			});
			
			//got sections?
			if ( data.sections == null )
				return;
			
			//loop sections
			$.each( data.sections, function( sectionName, organizations ) {
			
				//clone section template and grab jQuery object to save lookups
				var section =  $('.blanks .section').clone().appendTo('.hresume').attr( 'id', sectionName );
				
				//store name
				$(section).find('.sectionName').text( sectionName );
								
				//loop organizations
				$.each( organizations, function( key, organization  ){
										
					//no organization, jump to positions and kick
					if ( $.isArray( organization ) ) {
						
						//clone position template and append to orgnization
						var pos = $('.blanks article.position').clone().appendTo( section );

						//loop through position details and set
						$.each( organization[0], function( key, value ) {
							$(pos).find( '.' + key ).html( value );
						});
						
						return true;
						
					}
					
					//clone org and append to section
					var org = $('.blanks .organization').clone().appendTo(section).attr( 'id', key );
					
					//loop through organization details and set
					$.each( organization, function( key, value ) {
						$(org).find( '.' + key ).html( value );
					});

					//loop through positions
					$.each( organization.positions, function( key, position ) {
					
						//clone position template and append to orgnization
						var pos = $('.blanks section.position').clone().appendTo( org );
						
						//loop through position details and set
						$.each( position, function( key, value ) {
							$(pos).find( '.' + key ).html( value );
						});
						
					});
					
				});

			});
			
    });
    
	//sidebar height
	$(window).load(function() {
    	$('.resume #bar').css({'height':($('.resume').height())+'px'});
	});
	
	
	//Google Analytics Event Tracking
	$('a').each(function(){
	    
	    var href = $(this).attr('href');
	    var filetypes = /\.(zip|exe|pdf|doc*|xls*|ppt*|mp3)$/i;
	    
	    //no href, avoid errors
	    if ( typeof( href ) == 'undefined' )
	    	return false;
	    	
	    //check for links starting with http or https, making sure that links to our own domain are excluded
	    if ((href.match(/^https?\:/i)) && (!href.match(document.domain))){
	    	$(this).click(function() {
	    		var extLink = href.replace(/^https?\:\/\//i, '');
	    		_gaq.push(['_trackEvent','External', 'Click', extLink]);
	    	});
	    }
	    //check for links starting with mailto:
	    else if (href.match(/^mailto\:/i)){
	    	$(this).click(function() {
	    		var mailLink = href.replace(/^mailto\:/i, '');
	    		_gaq.push(['_trackEvent','Email', 'Click', mailLink]);
	    	});
	    }
	    //check for links with file extension that match the filetypes regular expression:
	    else if (href.match(filetypes)){
	    	$(this).click(function() {
  	    		var extension = (/[.]/.exec(href)) ? /[^.]+$/.exec(href) : undefined;
	    		var filePath = href.replace(/^https?\:\/\/(www.)mydomain\.com\//i, '');
	    		_gaq.push(['_trackEvent','Download', 'Click - ' + extension, filePath]);
	    	});
	    }

	});
	
	
});


