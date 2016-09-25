var amaranthStatus = {
	visible: false,
	target: null,
	iframe: null,
	using: true
};

chrome.runtime.sendMessage({
	action:'status'
});

var url = new URL(window.location);
var hostname = url.hostname;
chrome.storage.sync.get('offlist', function(item){
	var list = item.offlist;
	var using = $.inArray(hostname, list);
	if(using >= 0){
		amaranthStatus.using = false;
	}
});

$('<div>', {
	id: 'amaranth',
	style: 'display: none;'
}).appendTo('body');
$('<iframe>', {
	src: chrome.extension.getURL('src/inject/iframe.html'),
	id: 'amaranth-iframe',
	frameborder: 0,
	scrolling: 'no'
}).appendTo('#amaranth');

$(document).on('click', 'input[type=password]', function (event) {
	if(amaranthStatus.using == false){
		return;
	}
	amaranthStatus.target = $(this);
	amaranthStatus.iframe = null;
	if(isIframe()){
		chrome.runtime.sendMessage({
			action:'forward_0',
			realAction:'openFrame',
			element: {
				top: $(this).offset().top,
				left: $(this).offset().left,
				height: $(this).outerHeight(),
				width: $(this).outerWidth(),
				iframeSrc: document.baseURI
			}
		});
	}else{
		var position = getPosition($(this));
		var elem = $('#amaranth');
		elem.attr('style','left:'+position.left+'px;top:'+position.top+"px;");
		elem.show();
		amaranthStatus.visible = true;
	}
	chrome.runtime.sendMessage({action:"updateCache"});
});

$(window).resize(function(){
	if(amaranthStatus.visible){
		var position = {};
		if(amaranthStatus.iframe != null){
			position = getPositionForIframe(amaranthStatus.iframe, amaranthStatus.target)
		}else{
			position = getPosition(amaranthStatus.target);
		}
		var elem = $('#amaranth');
		elem.attr('style','left:'+position.left+'px;top:'+position.top+"px;");
	}
});

$(document).click(function(event){
	if(!$(event.target).is('input:password')){
		closeFrame();
	}
});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	switch(request.realAction){
		case 'fillIn':
			if(amaranthStatus.target){
				$(amaranthStatus.target).val(request.password);
			}
			break;
		case 'closeFrame':
			closeFrame();
			break;
		case 'stroage.using':
			amaranthStatus.using = request.using;
			if(!request.using && amaranthStatus.visible){
				closeFrame();
			}
			break;
		case 'openFrame':
			openFrame(request.element);
			break;
	}
});

function openFrame(elem){
	var iframe = $('iframe[src="' + elem.iframeSrc + '"');
	amaranthStatus.iframe = iframe;
	amaranthStatus.target = elem;
	var position = getPositionForIframe(iframe, elem);
	var elem = $('#amaranth');
	elem.attr('style','left:'+position.left+'px;top:'+position.top+"px;");
	elem.show();
	amaranthStatus.visible = true;
}

function getPositionForIframe(iframe, elem){
	var framePosition = {
		top: iframe.offset().top,
		left: iframe.offset().left,
	}
	var position = {left: 0, top: 0};
	if((framePosition.left + elem.left - $(document).scrollLeft()) + elem.width + $('#amaranth').outerWidth() <= $(window).width()){
		position.left = framePosition.left + elem.left + elem.width;
		position.top = framePosition.top + elem.top;
	}else{
		position.left = framePosition.left + elem.left;
		position.top = framePosition.top + elem.top + elem.height;
	}
	return position;
}

function closeFrame(){
	var elem = $('#amaranth');
	elem.hide();
	amaranthStatus.visible = false;
}

function isIframe(element){
	return self != top;
}

function getPosition(element){
	var position = {left: 0, top: 0};
	var elemPos = {
		top: element.offset().top,
		left: element.offset().left,
		height: element.outerHeight(),
		width: element.outerWidth()
	}
	if((elemPos.left - $(document).scrollLeft()) + elemPos.width + $('#amaranth').outerWidth() <= $(window).width()){
		position.left = elemPos.left + elemPos.width;
		position.top = elemPos.top;
	}else{
		position.left = elemPos.left;
		position.top = elemPos.top + elemPos.height;
	}
	return position;
}
