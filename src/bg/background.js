var cache = {
	frame: 0
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	switch(request.action){
		case 'tabInfo':
			var url = sender.tab.url;
			var tabInfo = getSiteDomain(url);
			sendResponse(tabInfo);
			break;
		case 'forward':
			var tab = sender.tab.id;
			chrome.tabs.sendMessage(tab, request, {frameId: cache.frame});
			break;
		case 'forward_0':
			var tab = sender.tab.id;
			chrome.tabs.sendMessage(tab,request,{frameId:0});
			break;
		case 'status':
			checkUsing(sender.tab);
		case 'updateCache':
			cache.frame = sender.frameId;
	}
});

function checkUsing(tab){
	var tabUrl = getSiteDomain(tab.url);
	var hostname = tabUrl.hostname;
	chrome.storage.sync.get('offlist', function(item){
		var list = item.offlist;
		var idx = -1;
		if(list){
			idx = list.indexOf(hostname);
		}
		if(idx>=0){
			chrome.action.setIcon({
				tabId: tab.id,
				path: '../../icons/inactive/icon19.png'
			});
			chrome.action.setTitle({
				tabId: tab.id,
				title: chrome.i18n.getMessage('disabledIconTitle')
			});
			chrome.tabs.sendMessage(tab.id, {
				realAction:'stroage.using',
				using: false
			});
		}else{
			chrome.action.setIcon({
				tabId: tab.id,
				path: '../../icons/active/icon19.png'
			});
			chrome.action.setTitle({
				tabId: tab.id,
				title: chrome.i18n.getMessage('enabledIconTitle')
			});
			chrome.tabs.sendMessage(tab.id, {
				realAction:'stroage.using',
				using: true
			});
		}
		// chrome.action.show(tab.id);
	});
}

chrome.action.onClicked.addListener(function(tab){
	var tabUrl = getSiteDomain(tab.url);
	var hostname = tabUrl.hostname;
	chrome.storage.sync.get('offlist', function(item){
		var list = item.offlist;
		var idx = -1;
		if(list){
			idx = list.indexOf(hostname);
		}else{
			list = [];
		}
		if(idx>=0){
			list.splice(idx, 1);
			chrome.action.setIcon({
				tabId: tab.id,
				path: '../../icons/active/icon19.png'
			});
			chrome.action.setTitle({
				tabId: tab.id,
				title: chrome.i18n.getMessage('enabledIconTitle')
			});
			chrome.tabs.sendMessage(tab.id, {
				realAction:'stroage.using',
				using: true
			});
		}else{
			list.push(hostname);
			chrome.action.setIcon({
				tabId: tab.id,
				path: '../../icons/inactive/icon19.png'
			});
			chrome.action.setTitle({
				tabId: tab.id,
				title: chrome.i18n.getMessage('disabledIconTitle')
			});
			chrome.tabs.sendMessage(tab.id, {
				realAction:'stroage.using',
				using: false
			});
		}
		// chrome.action.show(tab.id);
		chrome.storage.sync.set({offlist: list});
	});
});

var suffixMap = null;
function getSuffixMap() {
	if (!suffixMap) {
		var suffix = getSuffix();
		suffixMap = {};
		for (var i = 0; i < suffix.length; ++i) {
			suffixMap[suffix[i]] = true;
		}
	}
	return suffixMap;
}

function getSuffix() {
	return [
		'ac', 'academy', 'accountant', 'accountants', 'active', 'actor', 'ad', 'ads', 'adult', 'ae', 'aeg', 'aero', 'af', 'ag', 'agency', 'ai', 'airforce', 'al', 'allfinanz', 'alsace', 'am', 'amica', 'amsterdam', 'an', 'android', 'ao', 'apartments', 'app', 'apple', 'aq', 'aquarelle', 'ar', 'archi', 'army', 'arpa', 'art', 'arte', 'as', 'asia', 'associates', 'at', 'attorney', 'au', 'auction', 'audio', 'auto', 'autos', 'aw', 'ax', 'axa', 'az', 'azure',
		'ba', 'baidu', 'bank', 'bar', 'bargains', 'bayern', 'bb', 'bd', 'be', 'beats', 'beer', 'berlin', 'bf', 'bg', 'bh', 'bi', 'bid', 'bike', 'bing', 'bio', 'biz', 'bj', 'black', 'blackfriday', 'blog', 'blue', 'bm', 'bn', 'bo', 'boo', 'boutique', 'br', 'brussels', 'bs', 'bt', 'budapest', 'build', 'builders', 'business', 'buzz', 'bv', 'bw', 'by', 'bz',
		'ca', 'cab', 'cafe', 'cal', 'call', 'camera', 'camp', 'cancerresearch', 'capetown', 'capital', 'car', 'cards', 'care', 'career', 'careers', 'cars', 'cartier', 'casa', 'cash', 'casino', 'cat', 'catering', 'cc', 'cd', 'ceo', 'cern', 'cf', 'cg', 'ch', 'channel', 'chat', 'cheap', 'chloe', 'christmas', 'chrome', 'church', 'ci', 'citic', 'city', 'ck', 'cl', 'claims', 'cleaning', 'click', 'clinic', 'clothing', 'cloud', 'club', 'cm', 'cn', 'co', 'coach', 'codes', 'coffee', 'college', 'cologne', 'com', 'community', 'company', 'computer', 'condos', 'construction', 'consulting', 'contractors', 'cooking', 'cool', 'coop', 'corsica', 'country', 'coupon', 'coupons', 'courses', 'cr', 'credit', 'creditcard', 'cricket', 'cruises', 'cu', 'cuisinella', 'cv', 'cw', 'cx', 'cy', 'cymru', 'cz',
		'dad', 'dance', 'date', 'dating', 'datsun', 'day', 'dclk', 'de', 'deals', 'degree', 'delivery', 'democrat', 'dental', 'dentist', 'desi', 'design', 'dev', 'diamonds', 'diet', 'digital', 'direct', 'directory', 'discount', 'dj', 'dk', 'dm', 'dnp', 'do', 'docs', 'dog', 'domains', 'doosan', 'download', 'dubai', 'dunlop', 'dvag', 'dvr', 'dz',
		'eat', 'ec', 'edu', 'education', 'ee', 'eg', 'email', 'emerck', 'energy', 'engineer', 'engineering', 'enterprises', 'equipment', 'er', 'ericsson', 'erni', 'es', 'esq', 'estate', 'et', 'eu', 'eurovision', 'eus', 'events', 'everbank', 'exchange', 'expert', 'exposed',
		'fail', 'faith', 'family', 'fan', 'fans', 'farm', 'fashion', 'feedback', 'fi', 'film', 'finance', 'financial', 'firm', 'fish', 'fishing', 'fit', 'fitness', 'fj', 'fk', 'flowers', 'flsmidth', 'fly', 'fm', 'fo', 'foo', 'football', 'forex', 'forsale', 'forum', 'foundation', 'fr', 'frl', 'frogans', 'fund', 'furniture', 'futbol', 'fx',
		'ga', 'gal', 'gallery', 'game', 'garden', 'gb', 'gbiz', 'gd', 'ge', 'gea', 'gent', 'genting', 'gf', 'gg', 'gh', 'gi', 'gift', 'gifts', 'gives', 'gl', 'glass', 'gle', 'global', 'globo', 'gm', 'gmail', 'gmo', 'gmx', 'gn', 'gold', 'golf', 'goo', 'google', 'gop', 'gov', 'gp', 'gq', 'gr', 'graphics', 'gratis', 'green', 'gripe', 'gs', 'gt', 'gu', 'guardian', 'gucci', 'guge', 'guide', 'guitars', 'guru', 'gw', 'gy',
		'hamburg', 'hangout', 'haus', 'healthcare', 'help', 'here', 'hermes', 'hiphop', 'hitachi', 'hiv', 'hk', 'hm', 'hn', 'hockey', 'holdings', 'holiday', 'homes', 'honda', 'horse', 'host', 'hosting', 'hot', 'house', 'how', 'hr', 'ht', 'hu',
		'ibm', 'icbc', 'ice', 'icu', 'id', 'ie', 'ifm', 'iinet', 'il', 'im', 'immo', 'immobilien', 'in', 'industries', 'info', 'ing', 'ink', 'institute', 'insurance', 'int', 'international', 'io', 'ipiranga', 'iq', 'ir', 'irish', 'is', 'iselect', 'ist', 'istanbul', 'it', 'itau', 'iwc',
		'jcb', 'je', 'jetzt', 'jewelry', 'jlc', 'jll', 'jm', 'jmp', 'jnj', 'jo', 'jobs', 'joburg', 'jot', 'joy', 'jp', 'jprs', 'juegos', 'juniper',
		'kaufen', 'kddi', 'ke', 'kg', 'kh', 'ki', 'kia', 'kim', 'kitchen', 'km', 'kn', 'koeln', 'komatsu', 'kp', 'kr', 'krd', 'kw', 'ky', 'kyoto', 'kz',
		'la', 'lacaixa', 'lamborghini', 'land', 'landrover', 'lasalle', 'lat', 'latrobe', 'law', 'lawyer', 'lb', 'lc', 'lds', 'lease', 'leclerc', 'legal', 'lexus', 'lgbt', 'li', 'liaison', 'lidl', 'life', 'lighting', 'limited', 'limo', 'link', 'live', 'living', 'lk', 'loan', 'loans', 'lol', 'london', 'lotte', 'lotto', 'love', 'lr', 'ls', 'lt', 'lu', 'lupin', 'luxe', 'luxury', 'lv', 'ly',
		'ma', 'madrid', 'maif', 'mail', 'maison', 'man', 'management', 'mango', 'market', 'marketing', 'markets', 'marriott', 'mba', 'mc', 'md', 'me', 'meet', 'melbourne', 'meme', 'memorial', 'men', 'menu', 'merckmsd', 'metlife', 'mg', 'mh', 'miami', 'microsoft', 'mil', 'mini', 'mk', 'ml', 'mm', 'mma', 'mn', 'mo', 'mobi', 'moda', 'moe', 'moi', 'mom', 'money', 'mormon', 'mortgage', 'moscow', 'moto', 'motorcycles', 'mov', 'movie', 'movistar', 'mp', 'mq', 'mr', 'ms', 'mt', 'mtn', 'mtr', 'mu', 'museum', 'mutual', 'mv', 'mw', 'mx', 'my', 'mz',
		'na', 'nab', 'nagoya', 'name', 'nationwide', 'natura', 'navy', 'nc', 'ne', 'nec', 'net', 'netbank', 'network', 'neustar', 'new', 'news', 'nexus', 'nf', 'ng', 'ni', 'nico', 'ninja', 'nissan', 'nl', 'no', 'northwesternmutual', 'norton', 'now', 'nr', 'nra', 'nrw', 'ntt', 'nu', 'nyc',
		'obi', 'observer', 'off', 'office', 'okinawa', 'olayan', 'olayangroup', 'ollo', 'om', 'omega', 'one', 'ong', 'onl', 'online', 'ooo', 'open', 'org', 'orange', 'organic', 'osaka', 'otsuka', 'ovh',
		'pa', 'page', 'panasonic', 'paris', 'partners', 'parts', 'party', 'passagens', 'pay', 'pccw', 'pe', 'pet', 'pf', 'pg', 'ph', 'pharmacy', 'philips', 'phone', 'photo', 'photography', 'photos', 'physio', 'piaget', 'pics', 'pictet', 'pictures', 'pid', 'pin', 'ping', 'pink', 'pizza', 'pk', 'pl', 'place', 'play', 'plumbing', 'plus', 'pm', 'pn', 'pnc', 'pohl', 'poker', 'porn', 'post', 'pr', 'praxi', 'press', 'prime', 'pro', 'prod', 'productions', 'prof', 'progressive', 'promo', 'properties', 'property', 'protection', 'pru', 'prudential', 'ps', 'pt', 'pub', 'pw', 'py',
		'qa', 'qpon',
		'quebec', 'quest',
		'racing', 'radio', 'raid', 're', 'read', 'realtor', 'realty', 'recipes', 'red', 'redstone', 'redumbrella', 'rehab', 'reise', 'reisen', 'reit', 'reliance', 'ren', 'rent', 'rentals', 'repair', 'report', 'republican', 'rest', 'restaurant', 'review', 'reviews', 'rexroth', 'rich', 'ricoh', 'ril', 'rio', 'rip', 'rmit', 'ro', 'rocher', 'rocks', 'rodeo', 'rogers', 'room', 'rs', 'rsvp', 'ru', 'rugby', 'ruhr', 'run', 'rw',
		'sa', 'saarland', 'safe', 'safety', 'sakura', 'sale', 'salon', 'samsung', 'sandvik', 'sandvikcoromant', 'sanofi', 'sap', 'sarl', 'sas', 'save', 'saxo', 'sb', 'sbi', 'sbs', 'sc', 'sca', 'scb', 'schmidt', 'scholarships', 'school', 'schule', 'schwarz', 'science', 'scor', 'scot', 'sd', 'se', 'seat', 'security', 'seek', 'select', 'sener', 'services', 'ses', 'seven', 'sew', 'sex', 'sexy', 'sfr', 'sg', 'sh', 'shangrila', 'sharp', 'shell', 'shia', 'shiksha', 'shoes', 'shop', 'shopping', 'shouji', 'show', 'showtime', 'si', 'silk', 'sina', 'singles', 'site', 'ski', 'skin', 'sky', 'skype', 'sl', 'sling', 'sm', 'smart', 'smile', 'sn', 'sncf', 'so', 'soccer', 'social', 'softbank', 'software', 'sohu', 'solar', 'solutions', 'sony', 'soy', 'space', 'spiegel', 'sport', 'spot', 'spreadbetting', 'sr', 'srl', 'st', 'stadia', 'star', 'starhub', 'statefarm', 'statoil', 'stc', 'stcgroup', 'stockholm', 'storage', 'store', 'stream', 'studio', 'study', 'style', 'su', 'sucks', 'supplies', 'supply', 'support', 'surf', 'surgery', 'suzuki', 'sv', 'swatch', 'swiftcover', 'swiss', 'sx', 'sy', 'sydney', 'symantec', 'systems', 'sz',
		'tab', 'taipei', 'talk', 'taobao', 'tatamotors', 'tatar', 'tattoo', 'tax', 'taxi', 'tc', 'tci', 'td', 'tdk', 'team', 'tech', 'technology', 'tel', 'telefonica', 'temasek', 'tennis', 'teva', 'tf', 'tg', 'th', 'thd', 'theater', 'theatre', 'tiaa', 'tickets', 'tienda', 'tips', 'tires', 'tirol', 'tj', 'tk', 'tl', 'tm', 'tn', 'to', 'today', 'tokyo', 'tools', 'top', 'toray', 'toshiba', 'total', 'tours', 'town', 'toyota', 'toys', 'tr', 'trade', 'trading', 'training', 'travel', 'travelers', 'trust', 'trv', 'tt', 'tube', 'tui', 'tunes', 'tushu', 'tv', 'tvs', 'tw', 'tz',
		'ua', 'ubank', 'ubs', 'ug', 'uk', 'unicom', 'university', 'uno', 'uol', 'ups', 'us', 'uy', 'uz',
		'va', 'vacations', 'vana', 'vanguard', 'vc', 've', 'vegas', 'ventures', 'verisign', 'versicherung', 'vet', 'vg', 'vi', 'viajes', 'video', 'villas', 'vin', 'vip', 'virgin', 'visa', 'vistaprint', 'viva', 'vivo', 'vn', 'vodka', 'volkswagen', 'volvo', 'vote', 'voting', 'voto', 'voyage', 'vu',
		'wales', 'walmart', 'walter', 'wang', 'wanggou', 'warman', 'watch', 'watches', 'weather', 'webcam', 'weber', 'website', 'wed', 'wedding', 'weibo', 'weir', 'wf', 'whoswho', 'wien', 'wiki', 'williamhill', 'win', 'windows', 'wine', 'wme', 'wolterskluwer', 'woodside', 'work', 'works', 'world', 'wow', 'ws',
		'xxx',
		'xyz',
		'yachts', 'yahoo', 'yamaxun', 'yandex', 'ye', 'yodobashi', 'yoga', 'yokohama', 'you', 'youtube',
		'za', 'zappos', 'zara', 'zero', 'zip', 'zippo', 'zm', 'zone', 'zuerich', 'zw'
	];
}

function getSiteDomain(url){
	urlobj = new URL(url);
	var hostname = urlobj.hostname;
	var map = getSuffixMap();
	while (true) {
		var p = hostname.indexOf('.');
		if (p < 0) break;
		var domainName = hostname.substring(0, p);
		var tail = hostname.substring(p + 1);
		if (map[tail]) return {domain:domainName, hostname:hostname};
		hostname = tail;
	}
	return {domain:'', hostname:hostname};
}
