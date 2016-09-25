(function(){
	var hostname = '';

	chrome.runtime.sendMessage({
		action:'tabInfo'
	}, function(response){
		hostname = response.hostname;
		chrome.storage.local.get(hostname,function(item){
			var info = item[hostname];
			if($.isArray(info)){
				$('#site').val(info[0]);
				$('input[type="radio"][name="passtype"][value='+ info[1] +']').prop("checked", true);
			}else{
				$('#site').val(response.domain);
			}
		})
	});

	$('#close').click(function(){
		chrome.runtime.sendMessage({
			action:'forward',
			realAction: 'closeFrame'
		});
	})

	$('#mainpass').change(calc);
	$('#mainpass').keyup(calc);
	$('#site').change(settingChange);
	$('#site').keyup(settingChange);
	$('input[type="radio"][name="passtype"]').change(settingChange);

	function calc(){
		var mainpass = $('#mainpass').val();
		var site = $('#site').val();
		var type = $('input[type="radio"][name="passtype"]:checked').val();

		var password = amaranth(mainpass, site, type);

		chrome.runtime.sendMessage({
			action:'forward',
			realAction:'fillIn',
			password:password
		});
	}

	function settingChange(){
		var site = $('#site').val();
		var type = $('input[type="radio"][name="passtype"]:checked').val();
		var data = {};
		data[hostname] = [site, type];
		chrome.storage.local.set(data);
		calc();
	}

	function localizeHtmlPage(){
		$('[i18nmsg]').text(function() {
			return chrome.i18n.getMessage(
				$(this).attr("i18nmsg")
				.match(/__MSG_(\w+)__/)[1]
			);
		});
	}

	localizeHtmlPage();
})();
