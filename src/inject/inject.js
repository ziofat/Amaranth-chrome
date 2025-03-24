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
	var using = list ? list.includes(hostname) : false;
	if(using){
		amaranthStatus.using = false;
	}
});

var amaranthDiv = document.createElement('div');
amaranthDiv.id = 'amaranth';
amaranthDiv.style.display = 'none';
document.body.appendChild(amaranthDiv);

var amaranthIframe = document.createElement('iframe');
amaranthIframe.src = chrome.runtime.getURL('src/inject/iframe.html');
amaranthIframe.id = 'amaranth-iframe';
amaranthIframe.frameborder = '0';
amaranthIframe.scrolling = 'no';
document.getElementById('amaranth').appendChild(amaranthIframe);

document.addEventListener('click', function (event) {
	var target = event.target;
	var isPasswordInput = target.tagName === 'INPUT' && target.type === 'password';
	if (!isPasswordInput) {
		closeFrame();
		return;
	}
	if(amaranthStatus.using == false){
		return;
	}
	amaranthStatus.target = target;
	amaranthStatus.iframe = null;
	if(isIframe()){
		chrome.runtime.sendMessage({
			action:'forward_0',
			realAction:'openFrame',
			element: {
				top: target.offsetTop,
				left: target.offsetLeft,
				height: target.offsetHeight,
				width: target.offsetWidth,
				iframeSrc: document.baseURI
			}
		});
	}else{
		var position = getPosition(target);
		var elem = document.getElementById('amaranth');
		elem.style.left = position.left + 'px';
		elem.style.top = position.top + 'px';
		elem.style.display = 'block';
		amaranthStatus.visible = true;
	}
	chrome.runtime.sendMessage({action:"updateCache"});
});

window.addEventListener('resize', function(){
	if(amaranthStatus.visible){
		var position = {};
		if(amaranthStatus.iframe != null){
			position = getPositionForIframe(amaranthStatus.iframe, amaranthStatus.target)
		}else{
			position = getPosition(amaranthStatus.target);
		}
		var elem = document.getElementById('amaranth');
		elem.style.left = position.left + 'px';
		elem.style.top = position.top + 'px';
	}
});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	switch(request.realAction){
		case 'fillIn':
			if(amaranthStatus.target){
				amaranthStatus.target.value = request.password;
				var event = new Event('change', { bubbles: true });
				amaranthStatus.target.dispatchEvent(event);
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
	var iframe = document.querySelector('iframe[src="' + elem.iframeSrc + '"');
	amaranthStatus.iframe = iframe;
	amaranthStatus.target = elem;
	var position = getPositionForIframe(iframe, elem);
	var amaranthElem = document.getElementById('amaranth');
	amaranthElem.style.left = position.left + 'px';
	amaranthElem.style.top = position.top + 'px';
	amaranthElem.style.display = 'block';
	amaranthStatus.visible = true;
}

function getPositionForIframe(iframe, elem){
	var framePosition = {
		top: iframe.offsetTop,
		left: iframe.offsetLeft,
	}
	var position = {left: 0, top: 0};
	if((framePosition.left + elem.left - document.documentElement.scrollLeft) + elem.width + document.getElementById('amaranth').offsetWidth <= document.documentElement.clientWidth){
		position.left = framePosition.left + elem.left + elem.width;
		position.top = framePosition.top + elem.top;
	}else{
		position.left = framePosition.left + elem.left;
		position.top = framePosition.top + elem.top + elem.height;
	}
	return position;
}

function closeFrame(){
	var elem = document.getElementById('amaranth');
	elem.style.display = 'none';
	amaranthStatus.visible = false;
}

function isIframe(element){
	return self != top;
}

function getPosition(element){
	var position = {left: 0, top: 0};
	var rect = element.getBoundingClientRect();
	var elemPos = {
		top: rect.top + document.documentElement.scrollTop,
		left: rect.left + document.documentElement.scrollLeft,
		height: element.offsetHeight,
		width: element.offsetWidth
	}
	if((elemPos.left - document.documentElement.scrollLeft) + elemPos.width + document.getElementById('amaranth').offsetWidth <= document.documentElement.clientWidth){
		position.left = elemPos.left + elemPos.width;
		position.top = elemPos.top;
	}else{
		position.left = elemPos.left;
		position.top = elemPos.top + elemPos.height;
	}
	return position;
}
