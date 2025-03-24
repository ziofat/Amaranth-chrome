(function(){
    var hostname = '';

    chrome.runtime.sendMessage({
        action:'tabInfo'
    }, function(response){
        hostname = response.hostname;
        chrome.storage.local.get(hostname,function(item){
            var info = item[hostname];
            if(Array.isArray(info)){
                document.getElementById('site').value = info[0];
                document.querySelector('input[type="radio"][name="passtype"][value="'+ info[1] +'"]').checked = true;
            }else{
                document.getElementById('site').value = response.domain;
            }
        })
    });

    document.getElementById('close').addEventListener('click', function(){
        chrome.runtime.sendMessage({
            action:'forward',
            realAction: 'closeFrame'
        });
    });

    document.getElementById('mainpass').addEventListener('change', calc);
    document.getElementById('mainpass').addEventListener('keyup', calc);
    document.getElementById('site').addEventListener('change', settingChange);
    document.getElementById('site').addEventListener('keyup', settingChange);

    var passTypeRadios = document.querySelectorAll('input[type="radio"][name="passtype"]');
    passTypeRadios.forEach(function(radio) {
        radio.addEventListener('change', settingChange);
    });

    function calc(){
        var mainpass = document.getElementById('mainpass').value;
        var site = document.getElementById('site').value;
        var type = document.querySelector('input[type="radio"][name="passtype"]:checked').value;

        var password = amaranth(mainpass, site, type);

        chrome.runtime.sendMessage({
            action:'forward',
            realAction:'fillIn',
            password:password
        });
    }

    function settingChange(){
        var site = document.getElementById('site').value;
        var type = document.querySelector('input[type="radio"][name="passtype"]:checked').value;
        var data = {};
        data[hostname] = [site, type];
        chrome.storage.local.set(data);
        calc();
    }

    function localizeHtmlPage(){
        var elements = document.querySelectorAll('[i18nmsg]');
        elements.forEach(function(element) {
            var messageKey = element.getAttribute("i18nmsg").match(/__MSG_(\w+)__/)[1];
            element.textContent = chrome.i18n.getMessage(messageKey);
        });
    }

    localizeHtmlPage();
})();
