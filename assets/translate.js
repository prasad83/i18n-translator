/**
 * YOU ARE FREE TO USE THIS FOR COMMERCIAL OR NON-COMMERCIAL PURPOSE.
 * PLEASE MAKE SURE TO RETAIN THE COPYRIGHT NOTICE AND PROVIDE CREDITS
 * TO ORIGINAL AUTHOR WHEREVER APPLICABLE.
 * AUTHOR: Prasad.A (http://code.google.com/p/i18n-translator)
 */
 
/**
 * Entry point function.
 */
function tr(reverse) {
	if (typeof(reverse) == 'undefined') reverse = false;

	var q = $('#q').val();
	var slang = $('#slang').val(), tlang = $('#tlang').val();

	/**
	 * Load in iframe and callback after done.
	 */
	var iload = function(id, url, callback) {
		$(id).unbind('load');
		$(id).bind('load', callback);
		$(id).attr('src', 'proxy.php?url='+ encodeURIComponent(url));
	}
	
	/**
	 * Trigger the translation.
	 */
	var triggertr = function() { 
		if (q) { 			
			if (!reverse) {
				$('#gtrnow').empty(); $('#gtrchk').empty();
				$('#ytrnow').empty(); $('#ytrchk').empty();
				$('#wtrnow').empty(); $('#wtrchk').empty();
			}
		
			google(); 			
		} 
	}

	/**
	 * Google service
	 */
	var google = function() {
		var url  = 'https://ajax.googleapis.com/ajax/services/language/translate';
		var glangpair = reverse? (tlang+'|'+slang): (slang+'|'+tlang);
		
		var text = reverse? $('#gtrnow').text() : q;
		
		$('#gtrloading').show();
		$.ajax({
			url: url,
			dataType: 'jsonp',
			data: { v: "1.0", langpair: glangpair, q: text },
			success: function(data) {
				$('#gtrloading').hide();
				var translated = data.responseData.translatedText;
				
				if (reverse) $('#gtrchk').html(translated);
				else $('#gtrnow').html(translated);
				
				yahoo();
			},
			error: function(xhr) {
				if (reverse) $('#gtrchk').html(xhr.responseText);
				else $('#gtrnow').html(xhr.responseText);
				yahoo();
			}
		});
	}

	/**
	 * Yahoo service
	 */
	var yahoo = function() {
		var ylangpair = reverse? (tlang+'_'+slang): (slang+'_'+tlang);  
		var text = reverse? $('#ytrnow').text(): q;		
		
		var yreq = 'http://babelfish.yahoo.com/translate_txt?ei=UTF-8&intl=1&lp='+encodeURIComponent(ylangpair)+'&trtext='+encodeURIComponent(text);
		
		$('#ytrloading').show();
		iload('#yi', yreq, function(e) { 
			$('#ytrloading').hide();
			var translated = $('#yi').contents().find('#result').text();
			
			if (reverse) $('#ytrchk').html(translated);
			else $('#ytrnow').html(translated);
			
			bing();
		});
	}

	/**
	 * Bing service
	 */
	var bing = function() {  
		var wsrc = reverse? tlang: slang;
		var wdest= reverse? slang: tlang;
		
		var url = 'http://api.microsofttranslator.com/V2/Ajax.svc/Translate?oncomplete=?';
		
		var text = reverse? $('#wtrnow').text() : q;
		
		// AppId not configured skip
		var bingappId = config_bing_appid();
		if (bingappId.length == 0) {
			finish(true);
			return;
		}

		$('#wtrloading').show();
		$.ajax({
			url: url,
			dataType: 'jsonp',
			data: { appId: bingappId, from: wsrc, to: wdest, text: q },
			success: function(data) {
				$('#wtrloading').hide();
				var translated = data;
				
				if (reverse) $('#wtrchk').html(translated);
				else $('#wtrnow').html(translated);
				
				finish();
			},
			error: function(xhr) {
				if (reverse) $('#wtrchk').html(xhr.responseText);
				else $('#wtrnow').html(xhr.responseText);
				
				finish(true);
			}
		});
	}

	/**
	 * Finish the operation
	 */
	var finish = function(err) {
		if (typeof(err) == 'undefined') err = false;
		
		if (!err && !reverse) {
			var content = $.sprintf("<div class='container_16'><div class='grid_4'>%s</div><div class='grid_4'>%s</div><div class='grid_4'>%s</div><div class='grid_4'>%s</div></div>", q, $('#gtrnow').text(), $('#ytrnow').text(), $('#wtrnow').text());
		$('#history').append($(content));
		} else {
		}
	}

	// Bootstrap
	triggertr();
}